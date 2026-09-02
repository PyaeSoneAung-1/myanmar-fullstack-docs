---
title: "Do's and Don'ts (Declaration Files ရေးရာမှာ လုပ်သင့်/မလုပ်သင့်ချက်များ)"
description: "d.ts files ရေးတဲ့အခါ လိုက်နာသင့်တဲ့ အကြံပြုချက်များ — general types ရွေးချယ်မှု, callback types, function overloads တွေမှာ ရှောင်ရန်/လုပ်ရန် ပုံစံများ"
order: 21
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html"
status: translated
updated: 2026-09-02
---

## General Types (အသုံးများတဲ့ Types)

### `Number`, `String`, `Boolean`, `Symbol` နဲ့ `Object`

❌ **မသုံးပါနဲ့** — `Number`, `String`, `Boolean`, `Symbol`, `Object` types တွေကို ဘယ်တော့မှ မသုံးပါနဲ့။ ဒီ types တွေက JavaScript code တွေထဲမှာ သင့်လျော်စွာ သုံးလေ့မရှိသလောက်နီးပါး ဖြစ်တဲ့ — non-primitive boxed objects (value ကို object နဲ့ ထုပ်ထားတဲ့ ပုံစံ) တွေကို ရည်ညွှန်းပါတယ်။

```ts
/* WRONG */
function reverse(s: String): String;
```

✅ **သုံးပါ** — `number`, `string`, `boolean`, `symbol` types တွေကို သုံးပါ။

```ts
/* OK */
function reverse(s: string): string;
```

`Object` အစား — non-primitive ဖြစ်တဲ့ `object` type ကို သုံးပါ ([TypeScript 2.2 မှာ ထည့်သွင်းခဲ့တယ်](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#object-type))။

### Generics

❌ **မရေးပါနဲ့** — ကိုယ့်ရဲ့ type parameter ကို လုံးဝ အသုံးမပြုတဲ့ generic type မျိုး ဘယ်တော့မှ မရေးပါနဲ့။ အသေးစိတ်ကို [TypeScript FAQ page](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-type-inference-work-on-this-interface-interface-foot--) မှာ ကြည့်ပါ။

### `any`

❌ **မသုံးပါနဲ့** — သင်က JavaScript project တစ်ခုကို TypeScript ဆီ ပြောင်းရွှေ့ (migrate) လုပ်နေတာ မဟုတ်ဘူးဆိုရင် — type တစ်ခုအနေနဲ့ `any` ကို မသုံးပါနဲ့။ Compiler က `any` ကို "ဒီအရာအတွက် type checking ပိတ်ထားပါ" လို့ _ထိရောက်စွာ_ (effectively) သဘောထားပါတယ်။ ဒါက variable ကို သုံးတိုင်း နေရာတိုင်းမှာ `@ts-ignore` comment တစ်ခု ထည့်ထားတာနဲ့ တူပါတယ်။ JavaScript project တစ်ခုကို TypeScript ဆီ ပထမဆုံး ပြောင်းနေချိန်မှာတော့ — ဒါက အရမ်း အထောက်အကူ ဖြစ်နိုင်ပါတယ် — ဘာလို့လဲဆိုတော့ မပြောင်းရသေးတဲ့ အစိတ်အပိုင်းတွေအတွက် type ကို `any` အနေနဲ့ သတ်မှတ်ထားလို့ရလို့ပါ။ ဒါပေမယ့် TypeScript project အပြည့်အစုံမှာတော့ — `any` သုံးထားတဲ့ program ရဲ့ အစိတ်အပိုင်းတွေအတွက် type checking ကို ပိတ်ထားတာ ဖြစ်ပါတယ်။

ဘယ် type ကို လက်ခံရမယ်ဆိုတာ မသိတဲ့ အခြေအနေမျိုးမှာ ဒါမှမဟုတ် — value ကို သူနဲ့ အပြန်အလှန် ဆက်သွယ် (interact) မလုပ်ဘဲ မျက်စိမှိတ် ထပ်ဆင့်ပို့ (pass through) လုပ်ချင်လို့ ဘာမဆို လက်ခံချင်တဲ့ အခြေအနေမျိုးမှာ — [`unknown`](https://www.typescriptlang.org/play/#example/unknown-and-never) ကို သုံးနိုင်ပါတယ်။

## Callback Types (Callback function တွေအတွက် Types)

### Callbacks တွေရဲ့ Return Types

❌ **မသုံးပါနဲ့** — return value (ပြန်ပေးတဲ့တန်ဖိုး) ကို လျစ်လျူရှုမယ့် callbacks (နောက်မှ ပြန်ခေါ်ပေးတဲ့ functions) တွေအတွက် return type `any` ကို မသုံးပါနဲ့:

```ts
/* WRONG */
function fn(x: () => any) {
  x();
}
```

✅ **သုံးပါ** — return value ကို လျစ်လျူရှုမယ့် callbacks တွေအတွက် return type `void` ကို သုံးပါ:

```ts
/* OK */
function fn(x: () => void) {
  x();
}
```

❔ **ဘာကြောင့်လဲ:** `void` သုံးတာက ပိုလုံခြုံပါတယ် — ဘာလို့လဲဆိုတော့ `x` ရဲ့ return value ကို စစ်ဆေးမှုမရှိဘဲ (unchecked) မတော်တဆ သုံးမိသွားတာမျိုးကနေ ကာကွယ်ပေးလို့ပါ:

```ts
function fn(x: () => void) {
  var k = x(); // oops! meant to do something else
  k.doSomething(); // error, but would be OK if the return type had been 'any'
}
```

### Callbacks တွေမှာ Optional Parameters

❌ **မသုံးပါနဲ့** — သင်တကယ် ရည်ရွယ်ထားတာ မဟုတ်ဘူးဆိုရင် callbacks တွေမှာ optional parameters (ထည့်ချင်မှ ထည့်ရတဲ့ parameters) တွေ မသုံးပါနဲ့:

```ts
/* WRONG */
interface Fetcher {
  getObject(done: (data: unknown, elapsedTime?: number) => void): void;
}
```

ဒါက အဓိပ္ပါယ် အတိအကျ ရှိတဲ့ အချက်ပါ: `done` callback ကို argument ၁ ခုနဲ့ ခေါ်တာမျိုး ဒါမှမဟုတ် argument ၂ ခုနဲ့ ခေါ်တာမျိုး ဖြစ်နိုင်ပါတယ်။ Author (ရေးသားသူ) က ရည်ရွယ်ထားတာက — callback က `elapsedTime` parameter ကို ဂရုမစိုက်တာမျိုး ဖြစ်နိုင်တယ်ဆိုတာ ပြောချင်တာ ဖြစ်နိုင်ပါတယ် — ဒါပေမယ့် အဲဒါကို ပြီးမြောက်ဖို့ parameter ကို optional လုပ်စရာ မလိုပါဘူး — argument နည်းနည်းပဲ လက်ခံတဲ့ callback တစ်ခု ပေးလိုက်တာက အမြဲတမ်း မှန်ကန် (legal) ပါတယ်။

✅ **ရေးပါ** — callback parameters တွေကို non-optional အနေနဲ့ ရေးပါ:

```ts
/* OK */
interface Fetcher {
  getObject(done: (data: unknown, elapsedTime: number) => void): void;
}
```

### Overloads နဲ့ Callbacks

❌ **မရေးပါနဲ့** — callback ရဲ့ arity (argument အရေအတွက်) ပေါ်မှာပဲ ကွဲပြားတဲ့ overload တွေကို သီးခြားစီ မရေးပါနဲ့:

```ts
/* WRONG */
declare function beforeAll(action: () => void, timeout?: number): void;
declare function beforeAll(
  action: (done: DoneFn) => void,
  timeout?: number
): void;
```

✅ **ရေးပါ** — အများဆုံး arity ကို သုံးပြီး overload တစ်ခုတည်း ရေးပါ:

```ts
/* OK */
declare function beforeAll(
  action: (done: DoneFn) => void,
  timeout?: number
): void;
```

❔ **ဘာကြောင့်လဲ:** Callback တစ်ခုက parameter တစ်ခုကို လျစ်လျူရှုဖို့ဆိုတာ အမြဲတမ်း မှန်ကန်တာမို့ — overload ပိုတိုတဲ့ဟာ မလိုအပ်ပါဘူး။ Overload တိုတိုကို အရင်ထားရင် — ပထမ overload နဲ့ ကိုက်ညီသွားလို့ type မှားနေတဲ့ functions တွေကို ထည့်လိုက်မိတာ ဖြစ်နိုင်ပါတယ်။

## Function Overloads (Function တွေကို Overload လုပ်ခြင်း)

### Ordering (အစီအစဉ်)

❌ **မရေးပါနဲ့** — ပိုပြီး ယေဘုယျကျတဲ့ (general) overload တွေကို ပိုပြီး တိကျတဲ့ (specific) overload တွေရဲ့ ရှေ့မှာ မထားပါနဲ့:

```ts
/* WRONG */
declare function fn(x: unknown): unknown;
declare function fn(x: HTMLElement): number;
declare function fn(x: HTMLDivElement): string;

var myElem: HTMLDivElement;
var x = fn(myElem); // x: unknown, wat?
```

✅ **ဒီလို စီပါ** — ပိုပြီး ယေဘုယျကျတဲ့ signatures တွေကို ပိုပြီး တိကျတဲ့ signatures တွေရဲ့ နောက်မှာ ထားပြီး overload တွေကို စီစဉ်ပါ:

```ts
/* OK */
declare function fn(x: HTMLDivElement): string;
declare function fn(x: HTMLElement): number;
declare function fn(x: unknown): unknown;

var myElem: HTMLDivElement;
var x = fn(myElem); // x: string, :)
```

❔ **ဘာကြောင့်လဲ:** TypeScript က function call တစ်ခုကို resolve (ဖြေရှင်း/ဆုံးဖြတ်) လုပ်တဲ့အခါ — _ပထမဆုံး ကိုက်ညီတဲ့ overload_ ကို ရွေးချယ်ပါတယ်။ ရှေ့က overload က နောက်က overload ထက် "ပိုပြီး general" ဖြစ်နေရင် — နောက်က overload က ထိရောက်စွာ ဝှက်ထားခံရပြီး ခေါ်လို့ မရတော့ပါဘူး။

### Optional Parameters တွေကို သုံးပါ

❌ **မရေးပါနဲ့** — နောက်ဆုံးမှာ လာတဲ့ (trailing) parameters တွေမှာပဲ ကွဲပြားတဲ့ overload တွေ အများကြီး မရေးပါနဲ့:

```ts
/* WRONG */
interface Example {
  diff(one: string): number;
  diff(one: string, two: string): number;
  diff(one: string, two: string, three: boolean): number;
}
```

✅ **သုံးပါ** — ဖြစ်နိုင်တဲ့အခါတိုင်း optional parameters တွေကို သုံးပါ:

```ts
/* OK */
interface Example {
  diff(one: string, two?: string, three?: boolean): number;
}
```

ဒီလို ပေါင်းစည်းလိုက်တာက — overload အားလုံးရဲ့ return type အတူတူဆိုမှသာ လုပ်သင့်တယ်ဆိုတာ သတိပြုပါ။

❔ **ဘာကြောင့်လဲ:** ဒါက အကြောင်းရင်း နှစ်ခုအတွက် အရေးကြီးပါတယ်။

TypeScript က signature compatibility (signature တွေ လိုက်ဖက်မှု) ကို — target ရဲ့ signature တစ်ခုခုကို source ရဲ့ arguments တွေနဲ့ ခေါ်လို့ရလားဆိုတာ ကြည့်ပြီး resolve လုပ်ပါတယ် — _ပြီးတော့ extraneous (ပိုနေတဲ့) arguments တွေကို ခွင့်ပြုပါတယ်_။ ဥပမာ ဒီ code က — signature ကို optional parameters တွေနဲ့ မှန်ကန်စွာ ရေးမှပဲ bug ကို ဖော်ထုတ်ပြတာမျိုးပါ:

```ts
function fn(x: (a: string, b: number, c: number) => void) {}
var x: Example;
// When written with overloads, OK -- used first overload
// When written with optionals, correctly an error
fn(x.diff);
```

ဒုတိယ အကြောင်းရင်းကတော့ — consumer (အသုံးပြုသူ) တစ်ယောက်က TypeScript ရဲ့ "strict null checking" feature ကို သုံးတဲ့အခါပါ။ သတ်မှတ်မထားတဲ့ (unspecified) parameters တွေက JavaScript မှာ `undefined` အနေနဲ့ ပေါ်လာတာမို့ — optional arguments ပါတဲ့ function တစ်ခုဆီကို explicit `undefined` တစ်ခု ပေးလိုက်တာက ပုံမှန်အားဖြင့် ပြဿနာ မရှိပါဘူး။ ဥပမာ ဒီ code က strict nulls အောက်မှာ OK ဖြစ်သင့်ပါတယ်:

```ts
var x: Example;
// When written with overloads, incorrectly an error because of passing 'undefined' to 'string'
// When written with optionals, correctly OK
x.diff("something", true ? undefined : "hour");
```

### Union Types တွေကို သုံးပါ

❌ **မရေးပါနဲ့** — argument နေရာ တစ်ခုတည်းမှာပဲ type ကွဲပြားတဲ့ overload တွေ မရေးပါနဲ့:

```ts
/* WRONG */
interface Moment {
  utcOffset(): number;
  utcOffset(b: number): Moment;
  utcOffset(b: string): Moment;
}
```

✅ **သုံးပါ** — ဖြစ်နိုင်တဲ့အခါတိုင်း union types (type အများကြား ပေါင်းစပ်ထားတဲ့ types) တွေကို သုံးပါ:

```ts
/* OK */
interface Moment {
  utcOffset(): number;
  utcOffset(b: number | string): Moment;
}
```

ဒီမှာ `b` ကို optional မလုပ်ထားတာကို သတိပြုပါ — ဘာလို့လဲဆိုတော့ signatures တွေရဲ့ return types တွေ ကွဲပြားနေလို့ပါ။

❔ **ဘာကြောင့်လဲ:** ဒါက — သင့် function ဆီ value တစ်ခုကို "ထပ်ဆင့်ပို့ (passing through)" လုပ်နေတဲ့သူတွေအတွက် အရေးကြီးပါတယ်:

```ts
function fn(x: string): Moment;
function fn(x: number): Moment;
function fn(x: number | string) {
  // When written with separate overloads, incorrectly an error
  // When written with union types, correctly OK
  return moment().utcOffset(x);
}
```

## ဆက်လက်လေ့လာရန်

- [Type Declarations](/docs/typescript/type-declarations) — `.d.ts` files တွေနဲ့ type definitions အခြေခံ
- [နေ့စဉ်သုံး Types](/docs/typescript/everyday-types) — `object` type, interfaces နဲ့ type aliases
- [Functions အသေးစိတ်](/docs/typescript/functions) — function overloads နဲ့ signatures
