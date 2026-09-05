---
title: "TypeScript 4.2 (TypeScript 4.2 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 4.2 ၏ ပြောင်းလဲမှုအသစ်များ — type alias ထိန်းသိမ်းမှု ပိုမိုကောင်းမွန်လာခြင်း၊ tuple types တွင် rest elements နေရာချထားမှု ကျယ်ပြန့်လာခြင်း၊ `in` operator နှင့် `abstract` construct signatures စစ်ဆေးမှုများ၊ `--explainFiles` flag အပါအဝင် breaking changes များ"
order: 82
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html"
status: translated
updated: 2026-09-05
---

## Smarter Type Alias Preservation (ပိုမိုကောင်းမွန်သော Type Alias ထိန်းသိမ်းမှု)

TypeScript မှာ type alias လို့ ခေါ်တဲ့ — types တွေအတွက် နာမည်အသစ်တွေ ကြေညာတဲ့ နည်းလမ်းတစ်ခု ရှိပါတယ်။
`string | number | boolean` တွေပေါ်မှာ အားလုံး အလုပ်လုပ်တဲ့ function အစုတစ်စု ရေးနေတယ်ဆိုရင် — ကိုယ့်ဟာကို ထပ်ခါထပ်ခါ မရေးရအောင် type alias တစ်ခု ရေးနိုင်ပါတယ်။

```ts
type BasicPrimitive = number | string | boolean;
```

Types တွေကို ပြသရာမှာ type aliases တွေကို ဘယ်အချိန် ပြန်သုံးရမလဲဆိုတာအတွက် — TypeScript က အမြဲတမ်း စည်းမျဉ်းတွေနဲ့ ခန့်မှန်းချက်တွေ သုံးလာခဲ့ပါတယ်။
ဥပမာ — အောက်က code snippet ကို ကြည့်ပါ။

```ts
export type BasicPrimitive = number | string | boolean;

export function doStuff(value: BasicPrimitive) {
  let x = value;
  return x;
}
```

Visual Studio, Visual Studio Code ဒါမှမဟုတ် [TypeScript Playground](https://www.typescriptlang.org/play?ts=4.1.3#code/KYDwDg9gTgLgBDAnmYcBCBDAzgSwMYAKUOAtjjDgG6oC8cAdgK4kBGwUcAPnFjMfQHMucFhAgAbYBnoBuAFBzQkWHABmjengoR6cACYQAyjEarVACkoZxjYAC502fEVLkqwAJRwA3nLj+4SXgQODorG2B5ALgoYBMoXRB5AF8gA) လို editor တစ်ခုထဲမှာ — `x` ပေါ်ကို mouse နဲ့ ရွှေ့ကြည့်ရင် — `BasicPrimitive` ဆိုတဲ့ type ကို ပြပေးတဲ့ quick info panel တစ်ခု ရပါလိမ့်မယ်။
အလားတူပဲ — ဒီ file အတွက် declaration file output (`.d.ts` output) ကို ယူကြည့်ရင်လည်း — `doStuff` က `BasicPrimitive` ကို ပြန်ပေးတယ်လို့ TypeScript က ဆိုပါလိမ့်မယ်။

ဒါပေမယ့် — `BasicPrimitive` ဒါမှမဟုတ် `undefined` တစ်ခုခုကို ပြန်ပေးရင်ရော ဘာဖြစ်မလဲ?

```ts
export type BasicPrimitive = number | string | boolean;

export function doStuff(value: BasicPrimitive) {
  if (Math.random() < 0.5) {
    return undefined;
  }

  return value;
}
```

[TypeScript 4.1 playground](https://www.typescriptlang.org/play?ts=4.1.3#code/KYDwDg9gTgLgBDAnmYcBCBDAzgSwMYAKUOAtjjDgG6oC8cAdgK4kBGwUcAPnFjMfQHMucFhAgAbYBnoBuALAAoRQHplcABIRqHCPTgByACYQAyjEYAzC-pHBxEAO4IIPYKgcALDPAAqyYCZ4xGDwhjhYYOIYiFhwFtAIHqhQwOZQekgoAHQqagDqqGQCHvBe1HCgKHgwwIZw5M5wYPzw2Lm5cJ2YuITEZBTl3Iz0hsAWOPS1HR0sjPBs9k5+KIHB8AAsWQBMADT18BO8UnVhEVExcG0Kqh2dTKzswrz8QtyiElJ6QyNjE1PXykUlWg8Asw2qOF0cGMZksFgAFJQMOJGMAAFzobD4IikchUYAASjgAG9FJ1yTgLHB4QBZbweLJQaTGEjwokAHjgAAYsgBWImkhTk4WdFJpPTDUbjSaGeRC4UAX0UZOFYsY6TgSJRwDlcAVQA) မှာ ဘာတွေ ဖြစ်မလဲဆိုတာ မြင်နိုင်ပါတယ်။
TypeScript က `doStuff` ရဲ့ return type ကို `BasicPrimitive | undefined` အနေနဲ့ ပြစေချင်ပေမယ့် — သူက `string | number | boolean | undefined` လို့ ပြသနေပါတယ်!
ဘာကြောင့်လဲ?

ဒါက TypeScript က types တွေကို အတွင်းပိုင်းမှာ ဘယ်လို ကိုယ်စားပြုလဲဆိုတာနဲ့ ဆက်စပ်နေပါတယ်။
Union type တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ union types တွေကနေ union type အသစ်တစ်ခု ဖန်တီးတဲ့အခါ — အဲဒီ types တွေကို ပြားချပ်တဲ့ (flattened) union type အသစ်တစ်ခုအဖြစ် အမြဲတမ်း _normalize_ (စံပုံစံပြောင်း) လုပ်ပါတယ် — ဒါပေမယ့် အဲဒီလို လုပ်တာက သတင်းအချက်အလက်တွေ ဆုံးရှုံးစေပါတယ်။
Type-checker က — `string | number | boolean | undefined` ထဲက type ပေါင်းစပ်မှု တိုင်းကို ရှာဖွေပြီး — ဘယ် type aliases တွေ သုံးထားနိုင်လဲဆိုတာ ကြည့်ရပါလိမ့်မယ် — ပြီးတော့ အဲဒီလို ကြည့်တောင် — `string | number | boolean` အတွက် type aliases အများကြီး ရှိနေနိုင်ပါသေးတယ်။

TypeScript 4.2 မှာတော့ — ကျွန်တော်တို့ရဲ့ အတွင်းပိုင်း ယန္တရားတွေ နည်းနည်း ပိုတော်လာပါတယ်။
Types တွေကို မူလက ဘယ်လို ရေးသားခဲ့ပြီး တည်ဆောက်ခဲ့လဲဆိုတဲ့ အစိတ်အပိုင်းတွေကို သိမ်းထားခြင်းအားဖြင့် — types တွေ ဘယ်လို တည်ဆောက်ခဲ့လဲဆိုတာကို ခြေရာခံပါတယ်။
တခြား aliases တွေရဲ့ instances တွေဆီ ညွှန်တဲ့ type aliases တွေကိုလည်း — ခြေရာခံပြီး ခွဲခြားပါတယ်!

ကိုယ့် code ထဲမှာ types တွေကို သုံးထားတဲ့ပုံစံပေါ် အခြေခံပြီး — types တွေကို ပြန်ပြသနိုင်တာက — TypeScript သုံးစွဲသူတစ်ယောက်အနေနဲ့ — ကံမကောင်းစွာနဲ့ပဲ ကြီးမားလွန်းတဲ့ types တွေ ပြသခံရတာကို ရှောင်ရှားနိုင်တယ်လို့ ဆိုလိုပါတယ် — ပြီးတော့ ဒါက ပိုကောင်းတဲ့ `.d.ts` file output တွေ၊ error messages တွေ၊ quick info နဲ့ signature help တွေထဲက in-editor type displays တွေကို မကြာခဏ ဖြစ်ပေါ်စေပါတယ်။
ဒါက TypeScript ကို — အသစ်အသစ်သော သုံးစွဲသူတွေအတွက် — နည်းနည်း ပိုပြီး ချဉ်းကပ်ရလွယ်တဲ့ ခံစားမှုမျိုး ဖြစ်စေနိုင်ပါတယ်။

အသေးစိတ် သိချင်ရင် — [union type aliases တွေကို ထိန်းသိမ်းခြင်းဆိုင်ရာ ကိစ္စအမျိုးမျိုးကို တိုးတက်စေတဲ့ ပထမ pull request](https://github.com/microsoft/TypeScript/pull/42149) နဲ့ [indirect aliases တွေကို ထိန်းသိမ်းပေးတဲ့ ဒုတိယ pull request](https://github.com/microsoft/TypeScript/pull/42284) တို့ကို ကြည့်ပါ။

## Leading/Middle Rest Elements in Tuple Types (Tuple Type များထဲမှာ ရှေ့ဆုံး/အလယ်က Rest Elements များ)

TypeScript မှာ — tuple types တွေက သတ်မှတ်ထားတဲ့ length (အရှည်) နဲ့ element types တွေ ရှိတဲ့ arrays တွေကို model (ပုံစံဖော်) လုပ်ဖို့ ရည်ရွယ်ပါတယ်။

```ts
// A tuple that stores a pair of numbers
let a: [number, number] = [1, 2];

// A tuple that stores a string, a number, and a boolean
let b: [string, number, boolean] = ["hello", 42, true];
```

အချိန်ကြာလာတာနဲ့အမျှ — TypeScript ရဲ့ tuple types တွေက JavaScript ထဲက parameter lists လို အရာတွေကိုပါ model လုပ်ဖို့ သုံးကြတာမို့ — ပိုပြီး ဆန်းပြားလာပါတယ်။
အကျိုးဆက်အနေနဲ့ — သူတို့မှာ optional elements နဲ့ rest elements တွေ ရှိနိုင်ပြီး — tooling နဲ့ ဖတ်ရလွယ်ကူမှုအတွက် labels တွေတောင် ပါနိုင်ပါတယ်။

```ts twoslash
// A tuple that has either one or two strings.
let c: [string, string?] = ["hello"];
c = ["hello", "world"];

// A labeled tuple that has either one or two strings.
let d: [first: string, second?: string] = ["hello"];
d = ["hello", "world"];

// A tuple with a *rest element* - holds at least 2 strings at the front,
// and any number of booleans at the back.
let e: [string, string, ...boolean[]];

e = ["hello", "world"];
e = ["hello", "world", false];
e = ["hello", "world", true, false, true];
```

TypeScript 4.2 မှာ — rest elements တွေကို သုံးနိုင်တဲ့ ပုံစံတွေ အထူးသဖြင့် ချဲ့ထွင်လိုက်ပါတယ်။
အရင်ဗားရှင်းတွေမှာ — TypeScript က `...rest` elements တွေကို tuple type တစ်ခုရဲ့ နောက်ဆုံး နေရာမှာပဲ ခွင့်ပြုခဲ့ပါတယ်။

ဒါပေမယ့် — အခုတော့ rest elements တွေက tuple တစ်ခုထဲမှာ ကန့်သတ်ချက် အနည်းငယ်နဲ့သာ — _နေရာတိုင်း_ မှာ ဖြစ်ပေါ်နိုင်ပါပြီ။

```ts twoslash
let foo: [...string[], number];

foo = [123];
foo = ["hello", 123];
foo = ["hello!", "hello!", "hello!", 123];

let bar: [boolean, ...string[], boolean];

bar = [true, false];
bar = [true, "some text", false];
bar = [true, "some", "separated", "text", false];
```

တစ်ခုတည်းသော ကန့်သတ်ချက်က — rest element တစ်ခုကို နောက်မှာ တခြား optional element ဒါမှမဟုတ် rest element တစ်ခု မလိုက်ဘူးဆိုရင် — tuple တစ်ခုရဲ့ နေရာတိုင်းမှာ ထားလို့ရပါတယ်။
တစ်နည်းပြောရရင် — tuple တစ်ခုမှာ rest element တစ်ခုပဲ ရှိရမှာ ဖြစ်ပြီး — rest elements တွေရဲ့ နောက်မှာ optional elements တွေ မရှိရပါဘူး။

```ts twoslash
// @errors: 1265 1266
interface Clown {
  /*...*/
}
interface Joker {
  /*...*/
}

let StealersWheel: [...Clown[], "me", ...Joker[]];

let StringsAndMaybeBoolean: [...string[], boolean?];
```

ဒီ non-trailing rest elements (နောက်ဆုံးမှာ မဟုတ်တဲ့ rest elements) တွေကို — ရှေ့ကနေ argument အရေအတွက် ဘယ်လောက်ပဲ ယူယူ — နောက်မှာ သတ်မှတ်ထားတဲ့ argument အနည်းငယ် လိုက်ပါတဲ့ functions တွေကို model လုပ်ဖို့ သုံးနိုင်ပါတယ်။

```ts twoslash
declare function doStuff(...args: [...names: string[], shouldCapitalize: boolean]): void;

doStuff(/*shouldCapitalize:*/ false)
doStuff("fee", "fi", "fo", "fum", /*shouldCapitalize:*/ true);
```

JavaScript မှာ leading rest parameters တွေကို model လုပ်ဖို့ syntax တစ်ခုမှ မရှိပေမယ့် — `...args` rest parameter ကို _leading rest element တစ်ခု သုံးထားတဲ့ tuple type_ တစ်ခုနဲ့ ကြေညာခြင်းအားဖြင့် — `doStuff` ကို leading arguments တွေ ယူတဲ့ function တစ်ခုအဖြစ် ကြေညာနိုင်ခဲ့ပါတယ်။
ဒါက လက်ရှိ ရှိနေတဲ့ JavaScript အများကြီးကို model လုပ်ဖို့ အထောက်အကူ ဖြစ်နိုင်ပါတယ်!

အသေးစိတ်အတွက် — [မူလ pull request](https://github.com/microsoft/TypeScript/pull/41544) ကို ကြည့်ပါ။

## Stricter Checks For The `in` Operator (`in` Operator အတွက် ပိုမိုတင်းကျပ်သော စစ်ဆေးမှုများ)

JavaScript မှာ — `in` operator ရဲ့ ညာဘက်ခြမ်းမှာ non-object type တစ်ခုကို သုံးတာက runtime error တစ်ခုပါ။
TypeScript 4.2 က ဒါကို design-time (ရေးသားချိန်) မှာ ဖမ်းမိနိုင်အောင် သေချာ လုပ်ပေးပါတယ်။

```ts twoslash
// @errors: 2361 2322
"foo" in 42;
```

ဒီစစ်ဆေးမှုက အများအားဖြင့် ရှေးရိုးဆန်တဲ့ (conservative) ပုံစံပါ — ဒါကြောင့် ဒီအကြောင်း error တစ်ခု ရရှိခဲ့ရင် — code ထဲမှာ ပြဿနာတစ်ခု ရှိနေလို့ ဖြစ်နိုင်ခြေ များပါတယ်။

ကျွန်တော်တို့ရဲ့ ပြင်ပ contributor [Jonas Hübotter](https://github.com/jonhue) က [သူတို့ရဲ့ pull request](https://github.com/microsoft/TypeScript/pull/41928) အတွက် — အထူး ကျေးဇူးတင်ရှိပါတယ်!

## `--noPropertyAccessFromIndexSignature`

TypeScript က index signatures တွေကို စတင် မိတ်ဆက်တုန်းက — အဲဒီကနေ ကြေညာထားတဲ့ properties တွေကို `person["name"]` လို "bracketed" (ကွင်းစကွင်းပိတ်) element access syntax နဲ့ပဲ ရနိုင်ပါတယ်။

```ts twoslash
interface SomeType {
  /** This is an index signature. */
  [propName: string]: any;
}

function doStuff(value: SomeType) {
  let x = value["someProperty"];
}
```

ဒါက — ကြိုတင် သတ်မှတ်ထားခြင်း မရှိတဲ့ (arbitrary) properties တွေ ရှိတဲ့ objects တွေနဲ့ အလုပ်လုပ်ရတဲ့ အခြေအနေတွေမှာ — ရှုပ်ထွေး ခက်ခဲစေပါတယ်။
ဥပမာ — property နာမည်တစ်ခုကို နောက်ဆုံးမှာ `s` စာလုံး အပိုတစ်လုံး ထည့်ပြီး စာလုံးပေါင်း မှားတတ်တဲ့ API တစ်ခုကို မြင်ယောင်ကြည့်ပါ။

```ts twoslash
interface Options {
  /** File patterns to be excluded. */
  exclude?: string[];

  /**
   * It handles any extra properties that we haven't declared as type 'any'.
   */
  [x: string]: any;
}

function processOptions(opts: Options) {
  // Notice we're *intentionally* accessing `excludes`, not `exclude`
  if (opts.excludes) {
    console.error(
      "The option `excludes` is not valid. Did you mean `exclude`?"
    );
  }
}
```

ဒီလို အခြေအနေမျိုးတွေကို ပိုလွယ်ကူစေဖို့ — ခဏအကြာက TypeScript က — type တစ်ခုမှာ string index signature ရှိနေရင် — `person.name` လို "dotted" (အစက် သုံးတဲ့) property access syntax ကို သုံးလို့ရအောင် လုပ်ပေးခဲ့ပါတယ်။
ဒါက ရှိပြီးသား JavaScript code တွေကို TypeScript ဆီ ပြောင်းရွှေ့ရတာလည်း ပိုလွယ်ကူစေခဲ့ပါတယ်။

ဒါပေမယ့် — ကန့်သတ်ချက်ကို ဖြေလျှော့လိုက်တာက — အတိအကျ ကြေညာထားတဲ့ property တစ်ခုကို စာလုံးပေါင်း မှားဖို့လည်း ပိုလွယ်သွားစေတယ်လို့ ဆိုလိုပါတယ်။

```ts twoslash
interface Options {
  /** File patterns to be excluded. */
  exclude?: string[];

  /**
   * It handles any extra properties that we haven't declared as type 'any'.
   */
  [x: string]: any;
}
// ---cut---
function processOptions(opts: Options) {
  // ...

  // Notice we're *accidentally* accessing `excludes` this time.
  // Oops! Totally valid.
  for (const excludePattern of opts.excludes) {
    // ...
  }
}
```

ကိစ္စတချို့မှာ — သုံးစွဲသူတွေက index signature ထဲကို အတိအကျ ဝင်ရောက်တာကို ရွေးချယ်ချင်ပါတယ် — dotted property access တစ်ခုက သီးခြား property declaration တစ်ခုနဲ့ မကိုက်ညီတဲ့အခါ error message တစ်ခု ရချင်တာမျိုးပါ။

ဒါကြောင့်ပဲ TypeScript က [`noPropertyAccessFromIndexSignature`](https://www.typescriptlang.org/tsconfig#noPropertyAccessFromIndexSignature) လို့ ခေါ်တဲ့ flag အသစ်တစ်ခုကို မိတ်ဆက်လိုက်ပါတယ်။
ဒီ mode အောက်မှာ — error တစ်ခု ထုတ်ပေးတဲ့ TypeScript ရဲ့ အဟောင်း အပြုအမူထဲကို သင် ရောက်ရှိသွားပါလိမ့်မယ်။
ဒီ setting အသစ်က [`strict`](https://www.typescriptlang.org/tsconfig#strict) flags အုပ်စုထဲ မပါဝင်ပါဘူး — ဘာလို့လဲဆိုတော့ — သုံးစွဲသူတွေအတွက် codebase တချို့မှာ ပိုအသုံးဝင်ပြီး တချို့မှာ သိပ်မအသုံးဝင်ဘူးလို့ ကျွန်တော်တို့ ယုံကြည်လို့ပါ။

ဒီ feature အကြောင်း ပိုပြီး အသေးစိတ် နားလည်ချင်ရင် — သက်ဆိုင်တဲ့ [pull request](https://github.com/microsoft/TypeScript/pull/40171/) ကို ဖတ်ကြည့်နိုင်ပါတယ်။
ဒီ pull request ကို ပို့ပေးခဲ့တဲ့ [Wenlu Wang](https://github.com/Kingwl) ကိုလည်း — ကျေးဇူးအထူး တင်ပါတယ်!

## `abstract` Construct Signatures (`abstract` Construct Signature များ)

TypeScript က class တစ်ခုကို _abstract_ အဖြစ် မှတ်သားဖို့ ခွင့်ပြုပါတယ်။
ဒါက TypeScript ကို — ဒီ class က extend (ဆက်ခံ) လုပ်ဖို့အတွက်သာ ရည်ရွယ်ပြီး — instance တစ်ခု တကယ် ဖန်တီးဖို့အတွက် — သတ်မှတ်ထားတဲ့ members တွေကို subclass တိုင်းက ဖြည့်ပေးရမယ်လို့ အသိပေးပါတယ်။

```ts twoslash
// @errors: 2511
abstract class Shape {
  abstract getArea(): number;
}

new Shape();

class Square extends Shape {
  #sideLength: number;

  constructor(sideLength: number) {
    super();
    this.#sideLength = sideLength;
  }

  getArea() {
    return this.#sideLength ** 2;
  }
}

// Works fine.
new Square(42);
```

`abstract` classes တွေကို `new` လုပ်ခြင်းဆိုင်ရာ ဒီကန့်သတ်ချက်ကို တစ်သမတ်တည်း ကျင့်သုံးဖို့ သေချာစေရန် — `abstract` class တစ်ခုကို construct signature တစ်ခု မျှော်လင့်တဲ့ ဘယ်အရာဆီမှာမဆို assign လုပ်လို့ မရပါဘူး။

```ts twoslash
// @errors: 2322
abstract class Shape {
  abstract getArea(): number;
}
// ---cut---
interface HasArea {
  getArea(): number;
}

let Ctor: new () => HasArea = Shape;
```

ဒါက `new Ctor` လို code တွေ run ဖို့ ရည်ရွယ်တဲ့ ကိစ္စမှာတော့ မှန်ကန်တဲ့ အပြုအမူပါ — ဒါပေမယ့် `Ctor` ရဲ့ subclass တစ်ခု ရေးချင်တဲ့ ကိစ္စမှာတော့ — အကန့်အသတ် လွန်ကဲနေပါတယ်။

```ts twoslash
// @errors: 2345
abstract class Shape {
  abstract getArea(): number;
}

interface HasArea {
  getArea(): number;
}

function makeSubclassWithArea(Ctor: new () => HasArea) {
  return class extends Ctor {
    getArea() {
      return 42
    }
  };
}

let MyShape = makeSubclassWithArea(Shape);
```

ဒါက `InstanceType` လို built-in helper types တွေနဲ့လည်း ကောင်းကောင်း အလုပ်မလုပ်ပါဘူး။

```ts twoslash
// @errors: 2344
abstract class Shape {
  abstract getArea(): number;
}
// ---cut---
type MyInstance = InstanceType<typeof Shape>;
```

ဒါကြောင့်ပဲ TypeScript 4.2 က — construct signatures တွေပေါ်မှာ `abstract` modifier တစ်ခုကို သတ်မှတ်ဖို့ ခွင့်ပြုလိုက်ပါတယ်။

```ts twoslash {5}
abstract class Shape {
  abstract getArea(): number;
}
// ---cut---
interface HasArea {
    getArea(): number;
}

// Works!
let Ctor: abstract new () => HasArea = Shape;
```

Construct signature တစ်ခုပေါ်မှာ `abstract` modifier ထည့်လိုက်တာက — `abstract` constructors တွေကို ထည့်သွင်း (pass in) လို့ရတယ်လို့ အချက်ပြပါတယ်။
"concrete" (ခိုင်မာတဲ့) တခြား classes/constructor functions တွေကို ထည့်သွင်းတာကို မတားဆီးပါဘူး — တကယ်တော့ — constructor ကို တိုက်ရိုက် run ဖို့ ရည်ရွယ်ချက် မရှိဘူးဆိုတာကိုသာ အချက်ပြတာပါ — ဒါကြောင့် class type နှစ်မျိုးလုံးကို ထည့်သွင်းတာ အန္တရာယ် ကင်းပါတယ်။

ဒီ feature က ကျွန်တော်တို့ကို — abstract classes တွေကို ထောက်ပံ့တဲ့ ပုံစံနဲ့ _mixin factories_ တွေ ရေးနိုင်စေပါတယ်။
ဥပမာ — အောက်က code snippet ထဲမှာ — `withStyles` ဆိုတဲ့ mixin function ကို `abstract` class `SuperClass` နဲ့ သုံးနိုင်ပါတယ်။

```ts twoslash
abstract class SuperClass {
    abstract someMethod(): void;
    badda() {}
}

type AbstractConstructor<T> = abstract new (...args: any[]) => T

function withStyles<T extends AbstractConstructor<object>>(Ctor: T) {
    abstract class StyledClass extends Ctor {
        getStyles() {
            // ...
        }
    }
    return StyledClass;
}

class SubClass extends withStyles(SuperClass) {
    someMethod() {
        this.someMethod()
    }
}
```

`withStyles` က စည်းမျဉ်း တစ်ခုကို သရုပ်ပြနေတာ သတိပြုပါ — abstract constructor တစ်ခုနဲ့ ကန့်သတ်ထားတဲ့ (bounded) generic value တစ်ခုကို (ဥပမာ `Ctor`) extend လုပ်တဲ့ class တစ်ခု (ဥပမာ `StyledClass`) ကလည်း — `abstract` အဖြစ် ကြေညာထားရပါတယ်။
ဘာလို့လဲဆိုတော့ — abstract members _ပိုများတဲ့_ class တစ်ခု ထည့်သွင်းခံရလားဆိုတာ သိဖို့ နည်းလမ်း မရှိလို့ပါ — ဒါကြောင့် subclass က abstract members အားလုံးကို implement လုပ်လား မလုပ်လားဆိုတာ သိဖို့ မဖြစ်နိုင်ပါဘူး။

Abstract construct signatures အကြောင်း ပိုပြီး ဖတ်ချင်ရင် — [သူ့ရဲ့ pull request](https://github.com/microsoft/TypeScript/pull/36392) မှာ ကြည့်နိုင်ပါတယ်။

## Understanding Your Project Structure With `--explainFiles` (`--explainFiles` ဖြင့် သင့် Project Structure ကို နားလည်ခြင်း)

TypeScript သုံးစွဲသူတွေအတွက် အံ့သြစရာလောက်အောင် အဖြစ်များတဲ့ အခြေအနေတစ်ခုက — "ဒီ file ကို TypeScript က ဘာလို့ ထည့်သွင်းနေတာလဲ?" ဆိုတဲ့ မေးခွန်းပါ။
သင့် program ရဲ့ files တွေကို မှန်းဆခြင်းက ရှုပ်ထွေးတဲ့ ဖြစ်စဉ်တစ်ခု ဖြစ်လို့ — `lib.d.ts` ရဲ့ ပေါင်းစပ်မှု တစ်ခုကို ဘာလို့ သုံးလဲ၊ `node_modules` ထဲက file တချို့ ဘာလို့ ပါဝင်နေလဲ၊ [`exclude`](https://www.typescriptlang.org/tsconfig#exclude) ကို သတ်မှတ်ရင် ဖယ်ထုတ်နိုင်မယ်လို့ ထင်ထားပေမယ့် — file တချို့ ဘာလို့ ပါဝင်နေတုန်းလဲဆိုတဲ့ အကြောင်းပြချက် အများကြီး ရှိနေတတ်ပါတယ်။

ဒါကြောင့်ပဲ TypeScript က အခု [`explainFiles`](https://www.typescriptlang.org/tsconfig#explainFiles) flag တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

```sh
tsc --explainFiles
```

ဒီ option ကို သုံးတဲ့အခါ — TypeScript compiler က file တစ်ခု ဘာလို့ သင့် program ထဲ ရောက်သွားလဲဆိုတာနဲ့ ပတ်သက်ပြီး — အလွန် အသေးစိတ်ကျတဲ့ (verbose) output တစ်ခုကို ပေးပါလိမ့်မယ်။
ပိုလွယ်ကူစွာ ဖတ်နိုင်ဖို့ — output ကို file တစ်ခုဆီ ထည့်လွှဲ (forward) လုပ်နိုင်သလို — အလွယ်တကူ ကြည့်ရှုနိုင်တဲ့ program တစ်ခုဆီ pipe လုပ်ပြီးလည်း ပို့နိုင်ပါတယ်။

```sh
# Forward output to a text file
tsc --explainFiles > explanation.txt

# Pipe output to a utility program like `less`, or an editor like VS Code
tsc --explainFiles | less

tsc --explainFiles | code -
```

ပုံမှန်အားဖြင့် — output က `lib.d.ts` files တွေ ပါဝင်ရတဲ့ အကြောင်းရင်းတွေကနေ စပြီး — နောက်ပိုင်းမှာ local files တွေ၊ ပြီးတော့ `node_modules` files တွေအတွက် စာရင်း ဖော်ပြပါလိမ့်မယ်။

```
TS_Compiler_Directory/4.2.2/lib/lib.es5.d.ts
  Library referenced via 'es5' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2015.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2015.d.ts
  Library referenced via 'es2015' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2016.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2016.d.ts
  Library referenced via 'es2016' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2017.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2017.d.ts
  Library referenced via 'es2017' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2018.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2018.d.ts
  Library referenced via 'es2018' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2019.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2019.d.ts
  Library referenced via 'es2019' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2020.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2020.d.ts
  Library referenced via 'es2020' from file 'TS_Compiler_Directory/4.2.2/lib/lib.esnext.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.esnext.d.ts
  Library 'lib.esnext.d.ts' specified in compilerOptions

... More Library References...

foo.ts
  Matched by include pattern '**/*' in 'tsconfig.json'
```

လောလောဆယ်မှာ — output format နဲ့ ပတ်သက်ပြီး အာမခံချက် မပေးနိုင်ပါဘူး — အချိန်ကြာလာရင် ပြောင်းလဲသွားနိုင်ပါတယ်။
ဒီနဲ့ ပတ်သက်ပြီး — သင့်မှာ အကြံပြုချက်တွေ ရှိရင် — ဒီ format ကို တိုးတက်အောင် လုပ်ဖို့ ကျွန်တော်တို့ စိတ်ဝင်စားပါတယ်!

နောက်ထပ် အချက်အလက်တွေအတွက် — [မူလ pull request ကို ကြည့်လိုက်ပါ](https://github.com/microsoft/TypeScript/pull/40011)!

## Improved Uncalled Function Checks in Logical Expressions (Logical Expressions များထဲမှ Uncalled Function စစ်ဆေးမှုများ တိုးတက်လာခြင်း)

[Alex Tarasyuk](https://github.com/a-tarasyuk) ရဲ့ နောက်ထပ် တိုးတက်မှုတွေကြောင့် — TypeScript ရဲ့ uncalled function စစ်ဆေးမှုတွေက အခု `&&` နဲ့ `||` expressions တွေထဲမှာပါ သက်ရောက်လာပါပြီ။

[`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) အောက်မှာ — အောက်က code က အခု error တက်ပါလိမ့်မယ်။

```ts
function shouldDisplayElement(element: Element) {
  // ...
  return true;
}

function getVisibleItems(elements: Element[]) {
  return elements.filter((e) => shouldDisplayElement && e.children.length);
  //                          ~~~~~~~~~~~~~~~~~~~~
  // This condition will always return true since the function is always defined.
  // Did you mean to call it instead.
}
```

အသေးစိတ်အတွက် — [ဒီမှာ pull request ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/issues/40197).

## Destructured Variables Can Be Explicitly Marked as Unused (Destructured Variables များကို Unused အဖြစ် အတိအကျ မှတ်သားနိုင်ခြင်း)

[Alex Tarasyuk](https://github.com/a-tarasyuk) ဆီက နောက်ထပ် pull request တစ်ခုကြောင့် — destructured variables တွေကို သူတို့ရဲ့ ရှေ့မှာ underscore (`_` character) တစ်လုံး ထည့်ခြင်းအားဖြင့် — unused အဖြစ် အခု မှတ်သားနိုင်ပါပြီ။

```ts
let [_first, second] = getValues();
```

အရင်က — `_first` ကို နောက်ပိုင်းမှာ ဘယ်တော့မှ မသုံးခဲ့ရင် — TypeScript က [`noUnusedLocals`](https://www.typescriptlang.org/tsconfig#noUnusedLocals) အောက်မှာ error တစ်ခု ထုတ်ပေးပါတယ်။
အခုတော့ — `_first` ကို underscore နဲ့ နာမည်ပေးထားတာက — သုံးဖို့ ရည်ရွယ်ချက် မရှိလို့ ရည်ရွယ်ချက်ရှိရှိ လုပ်ထားတာဖြစ်ကြောင်း TypeScript က အသိအမှတ်ပြုပါလိမ့်မယ်။

အသေးစိတ်အတွက် — [အပြည့်အစုံ ပြောင်းလဲမှု](https://github.com/microsoft/TypeScript/pull/41378) ကို ကြည့်ပါ။

## Relaxed Rules Between Optional Properties and String Index Signatures (Optional Properties နှင့် String Index Signatures အကြား စည်းမျဉ်းများ ဖြေလျှော့လာခြင်း)

String index signatures တွေက — dictionary နဲ့တူတဲ့ objects တွေကို type လုပ်တဲ့ နည်းလမ်းတစ်ခုပါ — အဲဒီမှာ arbitrary keys တွေနဲ့ ဝင်ရောက်ခွင့် ပြုချင်ပါတယ်:

```ts twoslash
const movieWatchCount: { [key: string]: number } = {};

function watchMovie(title: string) {
  movieWatchCount[title] = (movieWatchCount[title] ?? 0) + 1;
}
```

ဟုတ်ပါတယ် — dictionary ထဲမှာ မရှိသေးတဲ့ movie title တိုင်းအတွက် — `movieWatchCount[title]` က `undefined` ဖြစ်ပါလိမ့်မယ် (TypeScript 4.1 က ဒီလို index signature ကနေ ဖတ်တဲ့အခါ `undefined` ပါဝင်စေဖို့ — [`noUncheckedIndexedAccess`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#checked-indexed-accesses---nouncheckedindexedaccess) ဆိုတဲ့ option ကို ထည့်ပေးခဲ့ပါတယ်)။
`movieWatchCount` ထဲမှာ မပါဝင်တဲ့ strings တချို့ ရှိကို ရှိရမယ်ဆိုတာ ရှင်းနေပေမယ့် — TypeScript ရဲ့ အရင်ဗားရှင်းတွေက — `undefined` ပါဝင်နေလို့ — optional object properties တွေကို တခြားနည်းနဲ့ လိုက်ဖက်တဲ့ (compatible) index signatures တွေဆီ unassignable အဖြစ် သဘောထားခဲ့ပါတယ်။

```ts twoslash
type WesAndersonWatchCount = {
  "Fantastic Mr. Fox"?: number;
  "The Royal Tenenbaums"?: number;
  "Moonrise Kingdom"?: number;
  "The Grand Budapest Hotel"?: number;
};

declare const wesAndersonWatchCount: WesAndersonWatchCount;
const movieWatchCount: { [key: string]: number } = wesAndersonWatchCount;
//    ~~~~~~~~~~~~~~~ error!
// Type 'WesAndersonWatchCount' is not assignable to type '{ [key: string]: number; }'.
//    Property '"Fantastic Mr. Fox"' is incompatible with index signature.
//      Type 'number | undefined' is not assignable to type 'number'.
//        Type 'undefined' is not assignable to type 'number'. (2322)
```

TypeScript 4.2 က ဒီ assignment ကို ခွင့်ပြုပါတယ်။
ဒါပေမယ့် — သူတို့ရဲ့ types တွေထဲမှာ `undefined` ပါတဲ့ non-optional properties တွေရဲ့ assignment ကိုတော့ — _ခွင့်မပြုပါဘူး_ — ပြီးတော့ key တစ်ခုခုဆီ `undefined` ရေးသွင်းတာကိုလည်း ခွင့်မပြုပါဘူး:

```ts twoslash
// @errors: 2322
type BatmanWatchCount = {
  "Batman Begins": number | undefined;
  "The Dark Knight": number | undefined;
  "The Dark Knight Rises": number | undefined;
};

declare const batmanWatchCount: BatmanWatchCount;

// Still an error in TypeScript 4.2.
const movieWatchCount: { [key: string]: number } = batmanWatchCount;

// Still an error in TypeScript 4.2.
// Index signatures don't implicitly allow explicit `undefined`.
movieWatchCount["It's the Great Pumpkin, Charlie Brown"] = undefined;
```

စည်းမျဉ်းအသစ်က number index signatures တွေကိုလည်း သက်ရောက်မှု မရှိပါဘူး — ဘာလို့လဲဆိုတော့ သူတို့ကို array နဲ့တူပြီး နေရာလပ်မရှိတဲ့ (dense) ပုံစံလို့ ယူဆထားလို့ပါ:

```ts twoslash
// @errors: 2322
declare let sortOfArrayish: { [key: number]: string };
declare let numberKeys: { 42?: string };

sortOfArrayish = numberKeys;
```

ဒီပြောင်းလဲမှုကို ပိုကောင်းကောင်း နားလည်ချင်ရင် — [မူလ PR ကို ဖတ်ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/41921).

## Declare Missing Helper Function (ပျောက်ဆုံးနေသော Helper Function ကို ကြေညာခြင်း)

ခေါ်ဆိုသည့် နေရာ (call-site) ပေါ် အခြေခံပြီး — function နဲ့ method အသစ်တွေကို ကြေညာပေးတဲ့ quick fix တစ်ခု ကျွန်တော်တို့မှာ အခု ရှိပါပြီ။
ဒါက [community pull request](https://github.com/microsoft/TypeScript/pull/41215) တစ်ခုကြောင့် — [Alexander Tarasyuk](https://github.com/a-tarasyuk) ဆီကနေ ရလာတာပါ!

![ကြေညာထားခြင်း မရှိသေးသော `foo` function တစ်ခုကို ခေါ်ဆိုနေခြင်း — quick fix က file ၏ အကြောင်းအရာအသစ်များကို ပုံစံဖော်ပြနေသည်](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/01/addMissingFunction-4.2.gif)

## Breaking Changes (နောက်ပြန်လိုက်ဖက်မှုကို ပျက်စေနိုင်သော အပြောင်းအလဲများ)

ကျွန်တော်တို့က release တစ်ခုမှာ breaking changes တွေကို အနည်းဆုံး ဖြစ်အောင် အမြဲ ကြိုးစားပါတယ်။
TypeScript 4.2 မှာ breaking changes တချို့ ပါဝင်ပေမယ့် — upgrade လုပ်တဲ့အခါ စီမံနိုင်လောက်တဲ့ အဆင့်တွေပဲ ဖြစ်မယ်လို့ ကျွန်တော်တို့ ယုံကြည်ပါတယ်။

### `lib.d.ts` Updates (`lib.d.ts` အပ်ဒိတ်များ)

TypeScript ဗားရှင်းတိုင်းလိုပဲ — `lib.d.ts` အတွက် declarations တွေ (အထူးသဖြင့် web contexts တွေအတွက် ထုတ်ပေးတဲ့ declarations တွေ) ပြောင်းလဲသွားပါတယ်။
ပြောင်းလဲမှု အမျိုးမျိုး ရှိပါတယ် — `Intl` နဲ့ `ResizeObserver` ရဲ့ ပြောင်းလဲမှုတွေကတော့ အပျက်အစီး အများဆုံး ဖြစ်သွားနိုင်ပါတယ်။

### `noImplicitAny` Errors Apply to Loose `yield` Expressions (Loose `yield` Expressions များတွင် `noImplicitAny` Errors သက်ရောက်လာခြင်း)

`yield` expression တစ်ခုရဲ့ value ကို ဖမ်းယူ (capture) လုပ်ထားပေမယ့် — သူဘယ် type မျိုး ရရှိစေချင်လဲဆိုတာကို TypeScript က ချက်ချင်း မသိနိုင်တဲ့အခါ (ဆိုလိုတာက — `yield` expression က contextually typed မဟုတ်တဲ့အခါ) — TypeScript က အခု implicit `any` error တစ်ခု ထုတ်ပေးပါလိမ့်မယ်။

```ts twoslash
// @errors: 7057
function* g1() {
  const value = yield 1;
}

function* g2() {
  // No error.
  // The result of `yield 1` is unused.
  yield 1;
}

function* g3() {
  // No error.
  // `yield 1` is contextually typed by 'string'.
  const value: string = yield 1;
}

function* g4(): Generator<number, void, string> {
  // No error.
  // TypeScript can figure out the type of `yield 1`
  // from the explicit return type of `g4`.
  const value = yield 1;
}
```

အသေးစိတ်ကို [သက်ဆိုင်ရာ ပြောင်းလဲမှုများ](https://github.com/microsoft/TypeScript/pull/41348) မှာ ကြည့်ပါ။

### Expanded Uncalled Function Checks (Uncalled Function စစ်ဆေးမှုများ ချဲ့ထွင်ခြင်း)

အပေါ်မှာ ဖော်ပြခဲ့သလိုပဲ — uncalled function စစ်ဆေးမှုတွေက [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) သုံးနေတဲ့အခါ — `&&` နဲ့ `||` expressions တွေထဲမှာပါ အခု တစ်သမတ်တည်း အလုပ်လုပ်ပါလိမ့်မယ်။
ဒါက break အသစ်တွေရဲ့ ရင်းမြစ်တစ်ခု ဖြစ်နိုင်ပေမယ့် — ပုံမှန်အားဖြင့်တော့ — ရှိပြီးသား code ထဲက logic error တစ်ခုကို ညွှန်ပြနေတာပါ။

### Type Arguments in JavaScript Are Not Parsed as Type Arguments (JavaScript ထဲက Type Arguments များကို Type Arguments အဖြစ် Parse မလုပ်တော့ခြင်း)

Type arguments တွေက JavaScript မှာ ကတည်းက ခွင့်မပြုထားပါဘူး — ဒါပေမယ့် TypeScript 4.2 မှာတော့ — parser က သူတို့ကို spec နဲ့ ပိုကိုက်ညီတဲ့ (spec-compliant) နည်းနဲ့ parse လုပ်ပါလိမ့်မယ်။
ဒါကြောင့် JavaScript file တစ်ခုထဲမှာ အောက်က code ကို ရေးတဲ့အခါ:

```ts
f<T>(100);
```

TypeScript က ဒါကို အောက်က JavaScript အနေနဲ့ parse လုပ်ပါလိမ့်မယ်:

```js
f < T > 100;
```

ဒါက — JavaScript files တွေထဲက type constructs တွေကို parse လုပ်ဖို့ TypeScript ရဲ့ API ကို အသုံးချနေတယ်ဆိုရင် — သင့်ကို ထိခိုက်စေနိုင်ပါတယ် — Flow files တွေကို parse လုပ်ဖို့ ကြိုးစားတဲ့အခါမျိုးမှာ ဒါမျိုး ဖြစ်ခဲ့နိုင်ပါတယ်။

ဘာတွေကို စစ်ဆေးလဲဆိုတဲ့ အသေးစိတ်အတွက် [pull request](https://github.com/microsoft/TypeScript/pull/41928) ကို ကြည့်ပါ။

### Tuple size limits for spreads (Spreads များအတွက် Tuple အရွယ်အစား ကန့်သတ်ချက်များ)

TypeScript မှာ — ဘယ်လို spread syntax (`...`) မျိုးကိုမဆို သုံးပြီး tuple types တွေကို ဖန်တီးနိုင်ပါတယ်။

```ts
// Tuple types with spread elements
type NumStr = [number, string];
type NumStrNumStr = [...NumStr, ...NumStr];

// Array spread expressions
const numStr = [123, "hello"] as const;
const numStrNumStr = [...numStr, ...numStr] as const;
```

တစ်ခါတလေ ဒီ tuple types တွေက မတော်တဆ ကြီးမားသွားနိုင်ပြီး — type-checking က အချိန် ကြာကြာ ယူစေနိုင်ပါတယ်။
Type-checking ဖြစ်စဉ်ကို ရပ်ဆိုင်းထား (hang) လိုက်တာမျိုး (editor အခြေအနေတွေမှာ အထူးသဖြင့် ဆိုးပါတယ်) အစား — TypeScript မှာ အဲဒီအလုပ်အားလုံးကို မလုပ်မိအောင် limiter (ကန့်သတ်ကိရိယာ) တစ်ခု ထည့်ထားပါတယ်။

အသေးစိတ်အတွက် [ဒီ pull request ကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/42448)။

### `.d.ts` Extensions Cannot Be Used In Import Paths (Import Paths များထဲမှာ `.d.ts` Extensions တွေ သုံးလို့မရတော့ခြင်း)

TypeScript 4.2 မှာ — သင့် import paths တွေရဲ့ extension ထဲမှာ `.d.ts` ပါဝင်နေတာက အခု error တစ်ခု ဖြစ်လာပါပြီ။

```ts
// must be changed to something like
//   - "./foo"
//   - "./foo.js"
import { Foo } from "./foo.d.ts";
```

အဲဒီအစား — သင့် import paths တွေက — runtime မှာ သင့် loader က ဘာလုပ်မလဲဆိုတာကို ထင်ဟပ်စေရပါမယ်။
အောက်က imports တွေထဲက ဘယ်ဟာမဆို အစားထိုး သုံးလို့ ရနိုင်ပါတယ်။

```ts
import { Foo } from "./foo";
import { Foo } from "./foo.js";
import { Foo } from "./foo/index.js";
```

### Reverting Template Literal Inference (Template Literal Inference ကို ပြန်ရုတ်သိမ်းခြင်း)

ဒီပြောင်းလဲမှုက TypeScript 4.2 beta ထဲက feature တစ်ခုကို ဖယ်ရှားလိုက်ပါတယ်။
ကျွန်တော်တို့ရဲ့ နောက်ဆုံး stable release ထက်ကို မတက်သေးဘူးဆိုရင် — သင် ထိခိုက်မှာ မဟုတ်ပါဘူး — ဒါပေမယ့် ဒီပြောင်းလဲမှုကို စိတ်ဝင်စားနေသေးနိုင်ပါတယ်။

TypeScript 4.2 ရဲ့ beta ဗားရှင်းမှာ template strings တွေဆီအတွက် inference ထဲကို ပြောင်းလဲမှုတစ်ခု ပါဝင်ခဲ့ပါတယ်။
ဒီပြောင်းလဲမှုမှာ — template string literals တွေကို template string types တွေ ဒါမှမဟုတ် string literal types အများကြီးဆီ ရိုးရှင်းအောင် လုပ်ထားတဲ့ types တွေ ပေးအပ်ခဲ့ပါတယ်။
ပြီးတော့ ဒီ types တွေက — mutable variables တွေဆီ assign လုပ်တဲ့အခါ `string` ဆီ _widen_ (ကျယ်ပြန့်) သွားပါတယ်။

```ts
declare const yourName: string;

// 'bar' is constant.
// It has type '`hello ${string}`'.
const bar = `hello ${yourName}`;

// 'baz' is mutable.
// It has type 'string'.
let baz = `hello ${yourName}`;
```

ဒါက string literal inference အလုပ်လုပ်ပုံနဲ့ ဆင်တူပါတယ်။

```ts
// 'bar' has type '"hello"'.
const bar = "hello";

// 'baz' has type 'string'.
let baz = "hello";
```

ဒါကြောင့် — template string expressions တွေကို template string types တွေ ပေးထားတာက "လိုက်ဖက်ညီ" မယ်လို့ ကျွန်တော်တို့ ယုံကြည်ခဲ့ပါတယ်;
ဒါပေမယ့် — ကျွန်တော်တို့ မြင်တွေ့ခဲ့ရတဲ့အရာတွေကနေ — ဒါက အမြဲတမ်း နှစ်လိုဖွယ် မဟုတ်ပါဘူး။

အဲဒါနဲ့ ပတ်သက်ပြီး — ဒီ feature (နဲ့ ဖြစ်နိုင်ခြေရှိတဲ့ breaking change) ကို ကျွန်တော်တို့ ပြန်ရုတ်သိမ်းလိုက်ပါတယ်။
Template string expression တစ်ခုကို literal နဲ့တူတဲ့ type တစ်ခု ပေးစေချင်တယ်ဆိုရင်တော့ — သူ့ရဲ့ အဆုံးမှာ `as const` ကို အမြဲ ထည့်နိုင်ပါတယ်။

```ts
declare const yourName: string;

// 'bar' has type '`hello ${string}`'.
const bar = `hello ${yourName}` as const;
//                              ^^^^^^^^

// 'baz' has type 'string'.
const baz = `hello ${yourName}`;
```

### TypeScript's `lift` Callback in `visitNode` Uses a Different Type (`visitNode` ထဲက TypeScript ရဲ့ `lift` Callback က Type တစ်မျိုး သုံးလာခြင်း)

TypeScript မှာ `lift` function တစ်ခုကို လက်ခံတဲ့ `visitNode` function တစ်ခု ရှိပါတယ်။
`lift` က အခု `NodeArray<Node>` အစား — `readonly Node[]` တစ်ခုကို မျှော်လင့်ပါတယ်။
ဒါက နည်းပညာအရ API breaking change တစ်ခုပါ — [ဒီမှာ](https://github.com/microsoft/TypeScript/pull/42000) ပိုပြီး ဖတ်နိုင်ပါတယ်။
