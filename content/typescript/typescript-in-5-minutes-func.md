---
title: "TypeScript for Functional Programmers (Functional Programmer များအတွက် TypeScript)"
description: "Haskell/ML programmer များအတွက် TypeScript မိတ်ဆက် — built-in types, gradual typing, structural typing, unions, unit types, contextual typing, discriminated unions, type parameters နှင့် module system နှိုင်းယှဉ်ချက်များ"
order: 43
source: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html"
status: translated
updated: 2026-09-05
---

TypeScript က — Microsoft က programmer တွေ ရိုးရာ object-oriented program တွေကို web ဆီ ယူဆောင်လာနိုင်ဖို့ — JavaScript ဆီ ရိုးရာ object-oriented types တွေကို ယူဆောင်လာဖို့ ကြိုးပမ်းမှုတစ်ခုအဖြစ် စတင်ခဲ့ပါတယ်။ ဖွံ့ဖြိုးလာတာနဲ့အမျှ — TypeScript ရဲ့ type system က ဇာတိ JavaScript programmer တွေ ရေးတဲ့ code တွေကို ပုံစံထုတ်ဖို့ (model လုပ်ဖို့) ပြောင်းလဲ ဖွံ့ဖြိုးလာပါတယ်။ ရလဒ်ဖြစ်တဲ့ စနစ်က စွမ်းဆောင်နိုင်မှု ရှိပြီး၊ စိတ်ဝင်စားစရာ ကောင်းပြီး — ရှုပ်ပွနေပါတယ်။

ဒီနိဒါန်းက Haskell ဒါမှမဟုတ် ML programmer တွေထဲက — TypeScript ကို သင်ယူချင်နေတဲ့ — လက်တွေ့ အလုပ်လုပ်နေသူတွေအတွက် ရည်ရွယ်ပါတယ်။ TypeScript ရဲ့ type system က Haskell ရဲ့ type system နဲ့ ဘယ်လို ကွာခြားလဲဆိုတာကို ဒီမှာ ဖော်ပြပါတယ်။ JavaScript code တွေကို ပုံစံထုတ်ခြင်းကနေ ပေါ်ပေါက်လာတဲ့ — TypeScript ရဲ့ type system ရဲ့ ထူးခြားတဲ့ feature တွေကိုလည်း ဖော်ပြပါတယ်။

ဒီနိဒါန်းမှာ object-oriented programming အကြောင်း မပါဝင်ပါဘူး။ လက်တွေ့မှာ — TypeScript ထဲက object-oriented program တွေက OO features ပါတဲ့ တခြား လူကြိုက်များတဲ့ language တွေထဲက program တွေနဲ့ ဆင်တူပါတယ်။

## Prerequisites (ကြိုတင် လိုအပ်ချက်များ)

ဒီနိဒါန်းမှာ သင်အောက်ပါတို့ကို သိပြီးသားလို့ ကျွန်တော် ယူဆပါတယ်:

- JavaScript မှာ program ရေးနည်း — ကောင်းမွန်တဲ့ အပိုင်းတွေ (the good parts) ပါ။
- C မျိုးဆက် (C-descended) language တစ်ခုရဲ့ type syntax။

JavaScript ရဲ့ good parts တွေကို လေ့လာဖို့ လိုအပ်ရင် — [JavaScript: The Good Parts](https://shop.oreilly.com/product/9780596517748.do) ကို ဖတ်ပါ။
call-by-value ဖြစ်ပြီး lexically scoped (စာသားအတိုင်း scope သတ်မှတ်တဲ့) — mutability တွေ အများကြီးရှိပြီး ဒါတွေကလွဲလို့ ဘာမှ မပါတဲ့ language တစ်မျိုးမှာ program တွေ ဘယ်လို ရေးရမယ်ဆိုတာ သိပြီးသားဆိုရင် — ဒီစာအုပ်ကို ကျော်သွားလို့ ရပါတယ်။
[R<sup>4</sup>RS Scheme](https://people.csail.mit.edu/jaffer/r4rs.pdf) က ဥပမာကောင်းတစ်ခုပါ။

C-style type syntax အကြောင်း လေ့လာဖို့ [The C++ Programming Language](http://www.stroustrup.com/4th.html) က နေရာကောင်းတစ်ခုပါ။ C++ နဲ့ မတူဘဲ — TypeScript က postfix types (နာမည်ရဲ့ နောက်မှာ type ရေးတာ) ကို သုံးပါတယ် — `string x` အစား `x: string` လိုမျိုးပေါ့။

## Concepts not in Haskell (Haskell မှာ မရှိတဲ့ Concept များ)

### Built-in types (Built-in Types)

JavaScript က built-in types ၈ မျိုး သတ်မှတ်ထားပါတယ်:

| Type        | ရှင်းလင်းချက်                                 |
| ----------- | ------------------------------------------- |
| `Number`    | double-precision IEEE 754 floating point တစ်ခု။ |
| `String`    | ပြောင်းလဲလို့မရတဲ့ (immutable) UTF-16 string တစ်ခု။ |
| `BigInt`    | arbitrary precision (ကန့်သတ်မထားတဲ့ တိကျမှု) ပုံစံနဲ့ integer များ။ |
| `Boolean`   | `true` နဲ့ `false`။                         |
| `Symbol`    | ထူးခြားတဲ့ (unique) value — အများအားဖြင့် key အဖြစ် သုံးသည်။ |
| `Null`      | unit type နဲ့ ညီမျှသည်။                |
| `Undefined` | unit type နဲ့လည်း ညီမျှသည်။           |
| `Object`    | records များနဲ့ ဆင်တူသည်။                |

အသေးစိတ်ကို [MDN page မှာ ကြည့်ရှုပါ](https://developer.mozilla.org/docs/Web/JavaScript/Data_structures)။

TypeScript မှာ ဒီ built-in types တွေအတွက် သက်ဆိုင်တဲ့ primitive types တွေ ရှိပါတယ်:

- `number`
- `string`
- `bigint`
- `boolean`
- `symbol`
- `null`
- `undefined`
- `object`

#### Other important TypeScript types (အခြား အရေးကြီးသော TypeScript Types)

| Type           | ရှင်းလင်းချက်                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| `unknown`      | top type (ထိပ်ဆုံး type) ဖြစ်သည်။                                                |
| `never`        | bottom type (အောက်ဆုံး type) ဖြစ်သည်။                                           |
| object literal | ဥပမာ — `{ property: Type }`                                                      |
| `void`         | documented return value မရှိတဲ့ functions များအတွက်                            |
| `T[]`          | mutable arrays — `Array<T>` လို့လည်း ရေးသည်။                                     |
| `[T, T]`       | tuples — အလျား ပုံသေဖြစ်သော်လည်း mutable ဖြစ်သည်။                               |
| `(t: T) => U`  | functions                                                                       |

မှတ်ချက်များ:

1. Function syntax မှာ parameter နာမည်တွေ ပါဝင်ပါတယ်။ ဒါက ကျင့်သားရဖို့ အတော်လေး ခက်ပါတယ်!

   ```ts
   let fst: (a: any, b: any) => any = (a, b) => a;

   // or more precisely:

   let fst: <T, U>(a: T, b: U) => T = (a, b) => a;
   ```

2. Object literal type syntax က object literal value syntax ကို အနီးကပ် မှန်ပြောင်သလို ထင်ဟပ်ပါတယ်:

   ```ts
   let o: { n: number; xs: object[] } = { n: 1, xs: [] };
   ```

3. `[T, T]` က `T[]` ရဲ့ subtype တစ်ခုပါ။ ဒါက Haskell နဲ့ မတူပါဘူး — Haskell မှာ tuples တွေက lists တွေနဲ့ မသက်ဆိုင်ပါဘူး။

#### Boxed types (Boxed Types)

JavaScript မှာ programmer တွေ ဒီ types တွေနဲ့ ဆက်စပ် မှတ်ယူထားတဲ့ methods တွေ ပါဝင်တဲ့ — primitive types တွေရဲ့ boxed (ထုပ်ပိုးထားသော) ညီမျှပုံစံတွေ ရှိပါတယ်။ TypeScript က ဒါကို — ဥပမာ — primitive type `number` နဲ့ boxed type `Number` ကြားက ကွာခြားချက်နဲ့ ထင်ဟပ်ပြသပါတယ်။ Boxed types တွေရဲ့ methods တွေက primitives တွေကို return လုပ်တာမို့ — boxed types တွေကို ရှားရှားပါးပါးသာ လိုအပ်ပါတယ်။

```ts
(1).toExponential();
// equivalent to
Number.prototype.toExponential.call(1);
```

numeric literal တစ်ခုအပေါ်မှာ method တစ်ခုကို ခေါ်တဲ့အခါ — parser ကို အကူအညီ ဖြစ်စေဖို့ — parentheses ထဲမှာ ထားဖို့ လိုအပ်တာ သတိပြုပါ။

### Gradual typing (Gradual Typing — တဖြည်းဖြည်း Type သတ်မှတ်ခြင်း)

Expression တစ်ခုရဲ့ type က ဘာဖြစ်သင့်လဲဆိုတာ TypeScript မပြောနိုင်တဲ့ အခါတိုင်း — သူက `any` type ကို သုံးပါတယ်။ `Dynamic` နဲ့ ယှဉ်ရင် — `any` ကို type တစ်ခုလို့ ခေါ်တာက ချဲ့ကား ပြောဆိုမှုတစ်ခုပါ။ သူက type checker ကို — ပေါ်လာတဲ့ နေရာတိုင်းမှာ ပိတ်ပစ်လိုက်ရုံပါပဲ။ ဥပမာ — value တစ်ခုကို ဘယ်လိုမှ အမှတ်အသား မလုပ်ဘဲ — `any[]` ထဲကို value ဘယ်ဟာကိုမဆို push လုပ်နိုင်ပါတယ်:

```ts twoslash
// with "noImplicitAny": false in tsconfig.json, anys: any[]
const anys = [];
anys.push(1);
anys.push("oh no");
anys.push({ anything: "goes" });
```

ပြီးတော့ — `any` type ရှိတဲ့ expression တစ်ခုကို ဘယ်နေရာမှာမဆို သုံးနိုင်ပါတယ်:

```ts
anys.map(anys[1]); // oh no, "oh no" is not a function
```

`any` က ကူးစက်တတ်တာလည်း ဖြစ်ပါတယ် — `any` type ရှိတဲ့ expression တစ်ခုနဲ့ variable တစ်ခုကို initialize လုပ်လိုက်ရင် — အဲဒီ variable မှာလည်း `any` type ရှိသွားပါတယ်။

```ts
let sepsis = anys[0] + anys[1]; // this could mean anything
```

TypeScript က `any` တစ်ခု ထုတ်လုပ်တဲ့အခါ error ရချင်ရင် — `tsconfig.json` ထဲမှာ `"noImplicitAny": true` ဒါမှမဟုတ် `"strict": true` ကို သုံးပါ။

### Structural typing (Structural Typing — ဖွဲ့စည်းပုံအခြေပြု Type သတ်မှတ်ခြင်း)

Structural typing က functional programmer အများစုအတွက် အကျွမ်းတဝင် ရှိတဲ့ concept တစ်ခုပါ — Haskell နဲ့ ML အများစုက structurally typed (ဖွဲ့စည်းပုံအခြေပြု type သတ်မှတ်မှု) မဟုတ်ကြပေမယ့်ပါ။ သူ့ရဲ့ အခြေခံပုံစံက အတော်လေး ရိုးရှင်းပါတယ်:

```ts
// @strict: false
let o = { x: "hi", extra: 1 }; // ok
let o2: { x: string } = o; // ok
```

ဒီမှာ — object literal `{ x: "hi", extra: 1 }` မှာ ကိုက်ညီတဲ့ literal type `{ x: string, extra: number }` ရှိပါတယ်။ ဒီ type မှာ လိုအပ်တဲ့ properties အားလုံး ရှိပြီး — အဲဒီ properties တွေမှာ assignable types တွေ ရှိတာမို့ — ဒီ type က `{ x: string }` ဆီ assignable ပါ။ Extra property က assignment ကို မတားဆီးပါဘူး — သူက `{ x: string }` ရဲ့ subtype တစ်ခု ဖြစ်စေရုံပါပဲ။

Named types တွေက type တစ်ခုကို နာမည်တစ်ခု ပေးရုံသက်သက်ပါ — assignability (assign လုပ်နိုင်မှု) ရည်ရွယ်ချက်အတွက်ဆိုရင် — အောက်က type alias `One` နဲ့ interface type `Two` ကြားမှာ ဘာကွာခြားမှုမှ မရှိပါဘူး။ သူတို့ နှစ်ခုလုံးမှာ `p: string` ဆိုတဲ့ property ရှိပါတယ်။ (ဒါပေမယ့် — recursive definitions နဲ့ type parameters တွေနဲ့ ပတ်သက်လာရင် — type aliases တွေက interfaces တွေနဲ့ မတူဘဲ ပြုမူတတ်ပါတယ်။)

```ts twoslash
// @errors: 2322
type One = { p: string };
interface Two {
  p: string;
}
class Three {
  p = "Hello";
}

let x: One = { p: "hi" };
let two: Two = x;
two = new Three();
```

### Unions (Union များ)

TypeScript မှာ — union types တွေက untagged (tag မပါဘဲ) ဖြစ်ပါတယ်။ တစ်နည်းပြောရရင် — သူတို့ဟာ Haskell ထဲက `data` လိုမျိုး discriminated unions တွေ မဟုတ်ပါဘူး။ ဒါပေမယ့် — built-in tags ဒါမှမဟုတ် တခြား properties တွေကို သုံးပြီး — union တစ်ခုထဲက types တွေကို မကြာခဏ ခွဲခြားနိုင်ပါတယ်။

```ts twoslash
function start(
  arg: string | string[] | (() => string) | { s: string }
): string {
  // this is super common in JavaScript
  if (typeof arg === "string") {
    return commonCase(arg);
  } else if (Array.isArray(arg)) {
    return arg.map(commonCase).join(",");
  } else if (typeof arg === "function") {
    return commonCase(arg());
  } else {
    return commonCase(arg.s);
  }

  function commonCase(s: string): string {
    // finally, just convert a string to another string
    return s;
  }
}
```

`string`, `Array` နဲ့ `Function` တွေမှာ built-in type predicates (type စစ်ဆေးနည်းများ) ရှိတာမို့ — အဆင်ပြေစွာနဲ့ပဲ object type ကို `else` branch အတွက် ချန်ထားခဲ့လို့ ရပါတယ်။ ဒါပေမယ့် — runtime မှာ ခွဲခြားဖို့ ခက်ခဲတဲ့ unions တွေကို ထုတ်လုပ်ဖို့လည်း ဖြစ်နိုင်ပါတယ်။ Code အသစ်တွေအတွက်ဆိုရင် — discriminated unions တွေကိုပဲ တည်ဆောက်တာ အကောင်းဆုံးပါ။

အောက်ပါ types တွေမှာ built-in predicates တွေ ရှိပါတယ်:

| Type      | Predicate                          |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| bigint    | `typeof m === "bigint"`            |
| boolean   | `typeof b === "boolean"`           |
| symbol    | `typeof g === "symbol"`            |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |
| object    | `typeof o === "object"`            |

Functions တွေနဲ့ arrays တွေက runtime မှာ objects တွေ ဖြစ်ပေမယ့် — သူတို့မှာ ကိုယ်ပိုင် predicates တွေ ရှိတာ သတိပြုပါ။

#### Intersections (Intersection Type များ)

Unions တွေအပြင် — TypeScript မှာ intersections တွေလည်း ရှိပါတယ်:

```ts twoslash
type Combined = { a: number } & { b: string };
type Conflicting = { a: number } & { a: string };
```

`Combined` မှာ `a` နဲ့ `b` ဆိုတဲ့ properties နှစ်ခု ရှိပါတယ် — object literal type တစ်ခုတည်းအဖြစ် ရေးထားသလိုပါပဲ။ Intersection ရော union ပါ — conflicts (ပဋိပက္ခများ) ဖြစ်တဲ့အခါ recursive ဖြစ်ပါတယ် — ဒါကြောင့် `Conflicting.a: number & string` ဖြစ်သွားတာပါ။

### Unit types (Unit Types)

Unit types တွေက — primitive value တစ်ခုတည်း အတိအကျ ပါဝင်တဲ့ — primitive types တွေရဲ့ subtypes တွေပါ။ ဥပမာ — `"foo"` ဆိုတဲ့ string မှာ `"foo"` ဆိုတဲ့ type ရှိပါတယ်။ JavaScript မှာ built-in enums တွေ မရှိတာမို့ — အဲဒီအစား — လူသိများတဲ့ strings တွေရဲ့ set တစ်ခုကို သုံးတာ အဖြစ်များပါတယ်။ String literal types တွေရဲ့ unions တွေက — ဒီ pattern ကို TypeScript က type သတ်မှတ်နိုင်အောင် ခွင့်ပြုပေးပါတယ်:

```ts twoslash
declare function pad(s: string, n: number, direction: "left" | "right"): string;
pad("hi", 10, "left");
```

လိုအပ်တဲ့အခါ — compiler က unit type ကို primitive type အဖြစ် _widen_ လုပ်ပါတယ် — supertype အဖြစ် ပြောင်းလဲပေးတာပါ — ဥပမာ `"foo"` ကို `string` အဖြစ်ပေါ့။ ဒါက mutability သုံးတဲ့အခါ ဖြစ်တတ်ပြီး — mutable variables တွေရဲ့ အသုံးပြုမှုတချို့ကို အဟန့်အတား ဖြစ်စေနိုင်ပါတယ်:

```ts twoslash
// @errors: 2345
declare function pad(s: string, n: number, direction: "left" | "right"): string;
// ---cut---
let s = "right";
pad("hi", 10, s); // error: 'string' is not assignable to '"left" | "right"'
```

Error ဘယ်လို ဖြစ်သွားလဲဆိုတာ ဒီမှာပါ:

- `"right"` ရဲ့ type က `"right"` ပါ
- `s` က `string` — ဘာလို့လဲဆိုတော့ — mutable variable တစ်ခုကို assign လုပ်လိုက်တဲ့အခါ `"right"` က `string` အဖြစ် widen ဖြစ်သွားလို့ပါ
- `string` က `"left" | "right"` ဆီ assignable မဟုတ်ပါဘူး

`s` အတွက် type annotation တစ်ခုနဲ့ ဒါကို ရှောင်ကွင်းလို့ ရပါတယ် — ဒါပေမယ့် အဲဒါက — `"left" | "right"` type မဟုတ်တဲ့ variables တွေကို `s` ဆီ assign လုပ်တာကို တစ်ဖန် တားဆီးပါတယ်။

```ts twoslash
declare function pad(s: string, n: number, direction: "left" | "right"): string;
// ---cut---
let s: "left" | "right" = "right";
pad("hi", 10, s);
```

## Concepts similar to Haskell (Haskell နဲ့ ဆင်တူတဲ့ Concept များ)

### Contextual typing (Contextual Typing — အခြေအနေအရ Type သတ်မှတ်ခြင်း)

TypeScript မှာ types တွေကို infer လုပ်နိုင်တဲ့ သိသာတဲ့ နေရာတချို့ ရှိပါတယ် — variable declarations တွေလိုမျိုးပေါ့:

```ts twoslash
let s = "I'm a string!";
```

ဒါပေမယ့် — C-syntax language တွေနဲ့ အလုပ်လုပ်ဖူးရင် မမျှော်လင့်နိုင်တဲ့ — နေရာ အနည်းငယ်မှာလည်း types တွေကို infer လုပ်ပါတယ်:

```ts twoslash
declare function map<T, U>(f: (t: T) => U, ts: T[]): U[];
let sns = map((n) => n.toString(), [1, 2, 3]);
```

ဒီမှာ — call မလုပ်ခင် `T` နဲ့ `U` တွေကို infer မလုပ်ရသေးပေမယ့် — ဒီဥပမာထဲမှာလည်း `n: number` ဖြစ်နေပါတယ်။ တကယ်တော့ — `[1,2,3]` ကို `T=number` လို့ infer ဖို့ သုံးပြီးတဲ့နောက်မှာ — `n => n.toString()` ရဲ့ return type ကို `U=string` လို့ infer ဖို့ သုံးတာမို့ — `sns` မှာ `string[]` type ရှိသွားပါတယ်။

Inference က ဘယ်အစီအစဉ်နဲ့မဆို အလုပ်လုပ်နိုင်ပေမယ့် — intellisense က left-to-right ပဲ အလုပ်လုပ်တာမို့ — TypeScript က array ကို အရင်ထည့်ပြီး `map` ကို ကြေညာတာကို ဦးစားပေးတာ သတိပြုပါ:

```ts twoslash
declare function map<T, U>(ts: T[], f: (t: T) => U): U[];
```

Contextual typing က object literals တွေကတစ်ဆင့် recursive အနေနဲ့လည်း အလုပ်လုပ်ပြီး — မဟုတ်ရင် `string` ဒါမှမဟုတ် `number` အဖြစ် infer ခံရမယ့် unit types တွေအပေါ်မှာလည်း အလုပ်လုပ်ပါတယ်။ ပြီးတော့ context ကနေ return types တွေကိုလည်း infer လုပ်နိုင်ပါတယ်:

```ts twoslash
declare function run<T>(thunk: (t: T) => void): T;
let i: { inference: string } = run((o) => {
  o.inference = "INSERT STATE HERE";
});
```

`o` ရဲ့ type က `{ inference: string }` ဖြစ်တယ်လို့ ဆုံးဖြတ်ခံရတာက အောက်ပါတို့ကြောင့်ပါ

1. Declaration initializers တွေကို declaration ရဲ့ type နဲ့ contextually type သတ်မှတ်ပေးတာမို့ပါ: `{ inference: string }`။
2. Call တစ်ခုရဲ့ return type က inferences တွေအတွက် contextual type ကို သုံးတာမို့ — compiler က `T={ inference: string }` လို့ infer လုပ်ပါတယ်။
3. Arrow functions တွေက သူတို့ရဲ့ parameters တွေကို type သတ်မှတ်ဖို့ contextual type ကို သုံးတာမို့ — compiler က `o: { inference: string }` လို့ ပေးပါတယ်။

ပြီးတော့ သင်ရိုက်နေတုန်းမှာကိုက ဒါတွေ လုပ်ပေးတာမို့ — `o.` လို့ ရိုက်လိုက်တာနဲ့ — `inference` property အတွက် — တကယ့် program တစ်ခုထဲမှာ ရှိမယ့် တခြား properties တွေနဲ့အတူ — completions တွေ ရပါတယ်။ ခြုံငုံကြည့်ရင် — ဒီ feature က TypeScript ရဲ့ inference ကို unifying type inference engine (ပေါင်းစည်းပေးတဲ့ type inference engine) တစ်ခုလို ပုံပေါက်စေနိုင်ပေမယ့် — တကယ်တော့ ဒါမျိုး မဟုတ်ပါဘူး။

### Type aliases (Type Alias များ)

Type aliases တွေဟာ — Haskell ထဲက `type` လိုပဲ — alias သက်သက်တွေပါ။ Compiler က source code ထဲမှာ alias ကို သုံးခဲ့တဲ့ နေရာတိုင်းမှာ — alias နာမည်ကိုပဲ သုံးဖို့ ကြိုးစားပေမယ့် — အမြဲတော့ မအောင်မြင်ပါဘူး။

```ts twoslash
type Size = [number, number];
let x: Size = [101.1, 999.9];
```

`newtype` နဲ့ အနီးစပ်ဆုံး ညီမျှတာက _tagged intersection_ (tag တပ်ထားတဲ့ intersection) ပါ:

```ts
type FString = string & { __compileTimeOnly: any };
```

`FString` က သာမန် string တစ်ခုလိုပါပဲ — ခြားနားချက်က — compiler က သူ့မှာ တကယ်မရှိတဲ့ `__compileTimeOnly` ဆိုတဲ့ property ရှိတယ်လို့ ထင်မှတ်နေတာပါ။ ဒါက — `FString` ကို `string` ဆီ assign လုပ်လို့ ရနေသေးပေမယ့် — အပြန်အလှန်ကတော့ မရဘူးလို့ ဆိုလိုတာပါ။

### Discriminated Unions (Discriminated Unions ဆိုတာ)

`data` နဲ့ အနီးစပ်ဆုံး ညီမျှတာက — discriminant properties (ခွဲခြားသတ်မှတ်ပေးတဲ့ properties) ပါတဲ့ types တွေရဲ့ union တစ်ခုပါ — TypeScript မှာ ပုံမှန်အားဖြင့် discriminated unions လို့ ခေါ်ပါတယ်:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
```

Haskell နဲ့ မတူဘဲ — tag (ဒါမှမဟုတ် discriminant) က object type တစ်ခုချင်းစီထဲမှာ ရှိတဲ့ property တစ်ခု သက်သက်ပါ။ Variant တစ်ခုချင်းစီမှာ — မတူညီတဲ့ unit type တစ်ခုနဲ့ — တူညီတဲ့ property နာမည်တစ်ခု ရှိပါတယ်။ ဒါဟာ သာမန် union type တစ်ခုပါပဲ; ရှေ့ဆုံးက `|` က union type syntax ရဲ့ optional အပိုင်းတစ်ခုပါ။ Union ရဲ့ members တွေကို — သာမန် JavaScript code တွေ သုံးပြီး ခွဲခြားနိုင်ပါတယ်:

```ts twoslash
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };

function area(s: Shape) {
  if (s.kind === "circle") {
    return Math.PI * s.radius * s.radius;
  } else if (s.kind === "square") {
    return s.x * s.x;
  } else {
    return (s.x * s.y) / 2;
  }
}
```

`area` ရဲ့ return type ကို `number` အဖြစ် infer လုပ်ထားတာ သတိပြုပါ — ဘာလို့လဲဆိုတော့ — ဒီ function က total (ဖြစ်နိုင်တဲ့ ကိစ္စအားလုံးကို ဖုံးအုပ်ထားတဲ့) ဖြစ်တာကို TypeScript က သိလို့ပါ။ Variant တစ်ခုခု မပါဝင်ရင်တော့ — `area` ရဲ့ return type က `number | undefined` ဖြစ်သွားမှာပါ။

ထို့ပြင် — Haskell နဲ့ မတူဘဲ — common properties တွေက union ဘယ်ခုမှာမဆို ပေါ်လာတာမို့ — union ရဲ့ members အများအပြားကို အကျိုးရှိရှိ ခွဲခြားနိုင်ပါတယ်:

```ts twoslash
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
// ---cut---
function height(s: Shape) {
  if (s.kind === "circle") {
    return 2 * s.radius;
  } else {
    // s.kind: "square" | "triangle"
    return s.x;
  }
}
```

### Type Parameters (Type Parameters — Type ကန့်သတ်ချက်များ)

C မျိုးဆက် (C-descended) language အများစုလိုပဲ — TypeScript မှာ type parameters တွေကို ကြေညာဖို့ လိုအပ်ပါတယ်:

```ts
function liftArray<T>(t: T): Array<T> {
  return [t];
}
```

စာလုံးအကြီးအသေး (case) သတ်မှတ်ချက်တော့ မရှိပါဘူး — ဒါပေမယ့် type parameters တွေကို အစဉ်အလာအရ — စာလုံးကြီး တစ်လုံးတည်းနဲ့ ရေးလေ့ ရှိပါတယ်။ Type parameters တွေကို type တစ်ခုဆီ ကန့်သတ် (constrain) လုပ်လို့လည်း ရပါတယ် — ဒါက type class constraints တွေလို နည်းနည်း ပြုမူပါတယ်:

```ts
function firstish<T extends { length: number }>(t1: T, t2: T): T {
  return t1.length > t2.length ? t1 : t2;
}
```

TypeScript က arguments တွေရဲ့ types တွေကို အခြေခံပြီး — call တစ်ခုကနေ type arguments တွေကို ပုံမှန်အားဖြင့် infer လုပ်နိုင်တာမို့ — type arguments တွေ ပုံမှန် မလိုအပ်ပါဘူး။

TypeScript က structural ဖြစ်တာမို့ — nominal systems တွေလောက် type parameters တွေကို မလိုအပ်ပါဘူး။ အထူးသဖြင့် — function တစ်ခုကို polymorphic ဖြစ်စေဖို့ သူတို့ မလိုအပ်ပါဘူး။ Type parameters တွေကို — parameters တွေကို type တစ်ခုတည်း ဖြစ်အောင် ကန့်သတ်တာလိုမျိုး — type information တွေကို _ဖြန့်ဝေပေးဖို့ (propagate)_ အတွက်သာ သုံးသင့်ပါတယ်:

```ts
function length<T extends ArrayLike<unknown>>(t: T): number {}

function length(t: ArrayLike<unknown>): number {}
```

ပထမ `length` မှာ — T က မလိုအပ်ပါဘူး; သူ့ကို တစ်ကြိမ်ပဲ ရည်ညွှန်းထားတာ သတိပြုပါ — ဒါကြောင့် return value ဒါမှမဟုတ် တခြား parameters တွေရဲ့ type ကို ကန့်သတ်ဖို့ မသုံးထားပါဘူး။

#### Higher-kinded types (Higher-kinded Types)

TypeScript မှာ higher-kinded types (type တွေကို parameter အဖြစ် လက်ခံတဲ့ types) တွေ မရှိတာမို့ — အောက်ပါဟာက တရားဝင် မဟုတ်ပါဘူး:

```ts
function length<T extends ArrayLike<unknown>, U>(m: T<U>) {}
```

#### Point-free programming (Point-free Programming)

Point-free programming — currying နဲ့ function composition တွေကို အသုံးများတဲ့ ပုံစံ — က JavaScript မှာ ဖြစ်နိုင်ပေမယ့် — စာလုံး ရှည်လျားတတ်ပါတယ်။ TypeScript မှာ — point-free program တွေအတွက် type inference က မကြာခဏ မအောင်မြင်တာမို့ — value parameters တွေအစား type parameters တွေကို သတ်မှတ်ရင်း ကုန်ဆုံးသွားတတ်ပါတယ်။ ရလဒ်က ဒီလောက်ကို ရှည်လျားတာမို့ — point-free programming ကို ရှောင်ရှားတာ ပုံမှန်အားဖြင့် ပိုကောင်းပါတယ်။

### Module system (Module System)

JavaScript ရဲ့ ခေတ်သစ် module syntax က Haskell ရဲ့ဟာနဲ့ နည်းနည်း ဆင်ပါတယ် — ခြားနားချက်က — `import` ဒါမှမဟုတ် `export` ပါတဲ့ file ဘယ်ဟာမဆို — implicitly module တစ်ခု ဖြစ်သွားတာပါ:

```ts
import { value, Type } from "npm-package";
import { other, Types } from "./local-package";
import * as prefix from "../lib/third-package";
```

CommonJS modules — node.js ရဲ့ module system သုံးပြီး ရေးထားတဲ့ modules — တွေကိုလည်း import လုပ်နိုင်ပါတယ်:

```ts
import f = require("single-function-package");
```

Export list တစ်ခုနဲ့လည်း export လုပ်နိုင်ပါတယ်:

```ts
export { f };

function f() {
  return g();
}
function g() {} // g is not exported
```

ဒါမှမဟုတ် — export တစ်ခုချင်းစီကို သီးခြားစီ အမှတ်အသား လုပ်ခြင်းအားဖြင့်လည်း ရပါတယ်:

```ts
export function f() { return g() }
function g() { }
```

နောက်ဆုံးပြောတဲ့ ပုံစံက ပိုအဖြစ်များပေမယ့် — နှစ်မျိုးလုံး ခွင့်ပြုပါတယ် — file တစ်ခုတည်းထဲမှာတောင် ရောသုံးလို့ ရပါတယ်။

### `readonly` and `const` (`readonly` နဲ့ `const`)

JavaScript မှာ — mutability က default ဖြစ်ပါတယ် — ဒါပေမယ့် `const` နဲ့ variable declarations တွေက _reference_ ကို immutable (မပြောင်းလဲနိုင်အောင်) ကြေညာဖို့ ခွင့်ပြုပါတယ်။ ဒါပေမယ့် ရည်ညွှန်းခံရတဲ့အရာ (referent) ကတော့ ဆက် mutable ဖြစ်နေပါသေးတယ်:

```js
const a = [1, 2, 3];
a.push(102); // ):
a[0] = 101; // D:
```

TypeScript မှာ properties တွေအတွက် `readonly` modifier တစ်ခု ထပ်ပြီး ရှိပါတယ်။

```ts
interface Rx {
  readonly x: number;
}
let rx: Rx = { x: 1 };
rx.x = 12; // error
```

ပြီးတော့ — properties အားလုံးကို `readonly` ဖြစ်စေတဲ့ mapped type `Readonly<T>` တစ်ခုလည်း ပါဝင်ပါတယ်:

```ts
interface X {
  x: number;
}
let rx: Readonly<X> = { x: 1 };
rx.x = 12; // error
```

ပြီးတော့ — side-affecting methods တွေကို ဖယ်ရှားပြီး — array ရဲ့ indices တွေဆီ ရေးသားတာကို တားဆီးပေးတဲ့ — `ReadonlyArray<T>` type တစ်ခု သီးသန့် ရှိပြီး — ဒီ type အတွက် အထူး syntax တစ်ခုလည်း ပါပါတယ်:

```ts
let a: ReadonlyArray<number> = [1, 2, 3];
let b: readonly number[] = [1, 2, 3];
a.push(102); // error
b[0] = 101; // error
```

Arrays တွေနဲ့ object literals တွေအပေါ် အလုပ်လုပ်တဲ့ — const-assertion တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်:

```ts
let a = [1, 2, 3] as const;
a.push(102); // error
a[0] = 101; // error
```

ဒါပေမယ့် — ဒီ option တွေထဲက ဘယ်ဟာမှ default မဟုတ်တာမို့ — TypeScript code တွေထဲမှာ တစိုက်မတ်မတ် သုံးနေကျတော့ မဟုတ်ပါဘူး။

### Next Steps (နောက်ထပ် ဆက်လုပ်ရန် အဆင့်များ)

ဒီ doc က နေ့စဉ် code တွေမှာ သင်သုံးမယ့် syntax နဲ့ types တွေရဲ့ high-level ခြုံငုံ သုံးသပ်ချက်ပါ။ ဒီကနေ သင်လုပ်သင့်တာတွေက:

- Handbook တစ်အုပ်လုံးကို [အစအဆုံး](/docs/typescript/getting-started) ဖတ်ရှုပါ
- [Playground ဥပမာများ](https://www.typescriptlang.org/play) ကို စူးစမ်းလေ့လာပါ
