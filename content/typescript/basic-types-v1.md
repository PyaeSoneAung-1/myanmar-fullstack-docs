---
title: "Basic Types (အခြေခံ Type များ)"
description: "Handbook v1 မှ အခြေခံ type များ — boolean, number, string, array, tuple, enum, unknown, any, void, null/undefined, never, object နှင့် type assertions တို့၏ သဘောတရားနှင့် ဥပမာများ"
order: 74
source: "https://www.typescriptlang.org/docs/handbook/basic-types.html"
status: translated
updated: 2026-09-05
---

Program တွေ အသုံးဝင်ဖို့ဆိုရင် — အရိုးရှင်းဆုံး data unit တွေဖြစ်တဲ့ numbers (ကိန်းဂဏန်းများ), strings (စာသားများ), structures (ဖွဲ့စည်းပုံများ), boolean values (မှန်/မှား တန်ဖိုးများ) စတာတွေနဲ့ အလုပ်လုပ်နိုင်ဖို့ လိုအပ်ပါတယ်။
TypeScript မှာလည်း — JavaScript မှာ မျှော်လင့်ရမယ့် type တွေအတိုင်း ပံ့ပိုးပေးပြီး — အပိုအနေနဲ့ enumeration type တစ်ခုပါ ထည့်သွင်းပေးထားပါတယ်။

## Boolean (မှန်/မှား)

အခြေခံအကျဆုံး datatype ကတော့ — JavaScript ရော TypeScript ရော — `boolean` value လို့ ခေါ်တဲ့ — ရိုးရှင်းတဲ့ true/false (မှန်/မှား) တန်ဖိုးပဲ ဖြစ်ပါတယ်။

```ts  twoslash
let isDone: boolean = false;
```

## Number (ကိန်းဂဏန်းများ)

JavaScript မှာလိုပဲ — TypeScript ထဲက number တွေအားလုံးဟာ floating point values (ဒသမကိန်း တန်ဖိုးများ) ဒါမှမဟုတ် BigIntegers တွေ ဖြစ်ပါတယ်။
ဒီ floating point numbers တွေက `number` type ရပြီး — BigIntegers တွေကတော့ `bigint` type ရပါတယ်။
Hexadecimal နဲ့ decimal literals တွေအပြင် — TypeScript က ECMAScript 2015 မှာ စတင် မိတ်ဆက်ခဲ့တဲ့ binary နဲ့ octal literals တွေကိုလည်း ပံ့ပိုးပေးပါတယ်။

```ts twoslash
// @target: ES2020
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let big: bigint = 100n;
```

## String (စာသားများ)

Webpages တွေအတွက်ပဲ ဖြစ်ဖြစ် — servers တွေအတွက်ပဲ ဖြစ်ဖြစ် — JavaScript နဲ့ program တွေ ဖန်တီးရာမှာ အခြေခံကျတဲ့ နောက်ထပ် အစိတ်အပိုင်းတစ်ခုကတော့ textual data (စာသား data) တွေနဲ့ အလုပ်လုပ်ခြင်းပဲ ဖြစ်ပါတယ်။
တခြား languages တွေမှာလိုပဲ — ဒီလို textual datatypes တွေကို ရည်ညွှန်းဖို့ `string` type ကို သုံးပါတယ်။
JavaScript မှာလိုပဲ — TypeScript ကလည်း string data တွေကို ဝိုင်းရံဖို့ double quotes (`"`) ဒါမှမဟုတ် single quotes (`'`) တွေကို သုံးပါတယ်။

```ts twoslash
let color: string = "blue";
// prettier-ignore
color = 'red';
```

_template strings_ တွေကိုလည်း သုံးလို့ရပါတယ် — ဒါတွေက line များစွာကို ဖြန့်ကျက်နိုင်ပြီး — embedded expressions (ထည့်သွင်းထားသော expressions) တွေလည်း ပါဝင်နိုင်ပါတယ်။
ဒီလို strings တွေကို backtick/backquote (`` ` ``) character နဲ့ ဝိုင်းရံထားပြီး — embedded expressions တွေက `${ expr }` ပုံစံနဲ့ ရေးပါတယ်။

```ts twoslash
let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}.

I'll be ${age + 1} years old next month.`;
```

ဒါက `sentence` ကို အောက်ပါအတိုင်း ကြေညာတာနဲ့ ညီမျှပါတယ်:

```ts twoslash
let fullName: string = `Bob Bobbington`;
let age: number = 37;
// ---cut---
let sentence: string =
  "Hello, my name is " +
  fullName +
  ".\n\n" +
  "I'll be " +
  (age + 1) +
  " years old next month.";
```

## Array (Array များ)

JavaScript မှာလိုပဲ — TypeScript မှာလည်း value တွေရဲ့ arrays တွေနဲ့ အလုပ်လုပ်နိုင်ပါတယ်။
Array types တွေကို နည်း နှစ်မျိုးထဲက တစ်မျိုးနဲ့ ရေးလို့ရပါတယ်။
ပထမနည်းကတော့ — element တွေရဲ့ type နောက်မှာ `[]` ထည့်ပြီး အဲဒီ element type ရဲ့ array တစ်ခုကို ဖော်ပြတာပါ:

```ts twoslash
let list: number[] = [1, 2, 3];
```

ဒုတိယနည်းကတော့ — generic array type — `Array<elemType>` ကို သုံးတာပါ:

```ts twoslash
let list: Array<number> = [1, 2, 3];
```

## Tuple (Tuple များ)

Tuple types တွေက — element အရေအတွက် ပုံသေ သတ်မှတ်ထားပြီး — types တွေ သိရှိထားပေမယ့် — တူညီဖို့တော့ မလိုတဲ့ — array တစ်ခုကို ဖော်ပြနိုင်စေပါတယ်။ ဥပမာ — value တစ်ခုကို `string` တစ်ခုနဲ့ `number` တစ်ခု တွဲထားတဲ့ pair အနေနဲ့ ဖော်ပြချင်တယ် ဆိုပါစို့:

```ts twoslash
// @errors: 2322
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error
```

သိထားတဲ့ index တစ်ခုနဲ့ element တစ်ခုကို ဝင်ရောက်ကြည့်တဲ့အခါ — မှန်ကန်တဲ့ type ကို ပြန်လည် ရရှိပါတယ်:

```ts twoslash
// @errors: 2339
let x: [string, number];
x = ["hello", 10]; // OK
/// ---cut---
// OK
console.log(x[0].substring(1));

console.log(x[1].substring(1));
```

သိထားတဲ့ indices အစုရဲ့ အပြင်ဘက်က element တစ်ခုကို ဝင်ရောက်ကြည့်ရင် — error တစ်ခုနဲ့ မအောင်မြင်ပါဘူး:

```ts twoslash
// @errors: 2493 2532 2322
let x: [string, number];
x = ["hello", 10]; // OK
/// ---cut---
x[3] = "world";

console.log(x[5].toString());
```

## Enum (Enum များ)

JavaScript ရဲ့ standard datatypes အစုထဲကို အသုံးဝင်တဲ့ ထပ်ဆောင်းတစ်ခု အနေနဲ့ ဝင်ရောက်လာတာကတော့ `enum` ပဲ ဖြစ်ပါတယ်။
C# လို languages တွေမှာလိုပဲ — enum ဆိုတာ numeric values (ကိန်းဂဏန်း တန်ဖိုးများ) အစုတွေကို ပိုပြီး အဆင်ပြေတဲ့ နာမည်တွေနဲ့ ပေးအပ်တဲ့ နည်းလမ်းတစ်ခု ဖြစ်ပါတယ်။

```ts twoslash
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

ပုံမှန်အားဖြင့် — enums တွေက သူတို့ရဲ့ members တွေကို `0` ကနေ စတင် နံပါတ် တပ်ပါတယ်။
Member တစ်ခုရဲ့ value ကို ကိုယ်တိုင် သတ်မှတ်ပေးခြင်းအားဖြင့် ဒါကို ပြောင်းလဲနိုင်ပါတယ်။
ဥပမာ — အပေါ်က ဥပမာကို `0` အစား `1` ကနေ စတင်နိုင်ပါတယ်:

```ts twoslash
enum Color {
  Red = 1,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

ဒါမှမဟုတ် — enum ထဲက value တွေအားလုံးကိုတောင် ကိုယ်တိုင် သတ်မှတ်လို့ရပါတယ်:

```ts twoslash
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}
let c: Color = Color.Green;
```

Enums တွေရဲ့ အဆင်ပြေတဲ့ အင်္ဂါရပ်တစ်ခုကတော့ — numeric value တစ်ခုကနေ — အဲဒီ value ရဲ့ enum ထဲက နာမည်ဆီကို ပြန်သွားလို့ရတာပါ။
ဥပမာ — value `2` ရှိပေမယ့် အပေါ်က `Color` enum ထဲမှာ ဘာနဲ့ ချိတ်ဆက်နေလဲ မသေချာဘူးဆိုရင် — သက်ဆိုင်တဲ့ နာမည်ကို ရှာဖွေကြည့်လို့ရပါတယ်:

```ts twoslash
enum Color {
  Red = 1,
  Green,
  Blue,
}
let colorName: string = Color[2];

// Displays 'Green'
console.log(colorName);
```

## Unknown (မသိရသေးသော Type)

Application တစ်ခု ရေးသားနေတုန်းမှာ — ကျွန်တော်တို့ မသိသေးတဲ့ variables တွေရဲ့ types တွေကို ဖော်ပြဖို့ လိုအပ်လာနိုင်ပါတယ်။
ဒီလို values တွေဟာ dynamic content တွေကနေ လာနိုင်ပါတယ် — ဥပမာ — user ဆီကနေ — ဒါမှမဟုတ် ကိုယ့် API ထဲမှာ value အားလုံးကို ရည်ရွယ်ချက်ရှိရှိ လက်ခံချင်တာမျိုး ဖြစ်နိုင်ပါတယ်။
ဒီလိုအခြေအနေမျိုးမှာ — ဒီ variable က ဘာမဆို ဖြစ်နိုင်တယ်ဆိုတာကို compiler ကိုရော — နောက်ပိုင်း ဖတ်ရှုမယ့်သူတွေကိုပါ ပြောပြတဲ့ type တစ်ခု ပေးချင်တာမို့ — `unknown` type ကို သတ်မှတ်ပေးပါတယ်။

```ts twoslash
let notSure: unknown = 4;
notSure = "maybe a string instead";

// OK, definitely a boolean
notSure = false;
```

`unknown` type ရှိတဲ့ variable တစ်ခု ရှိရင် — `typeof` checks, comparison checks (နှိုင်းယှဉ် စစ်ဆေးမှုများ) ဒါမှမဟုတ် နောက်အခန်းတစ်ခုမှာ ဆွေးနွေးမယ့် ပိုအဆင့်မြင့်တဲ့ type guards တွေကို လုပ်ခြင်းအားဖြင့် — ပိုတိကျတဲ့ type တစ်ခုဆီကို narrow (ကျဉ်းမြောင်း) လုပ်နိုင်ပါတယ်:

```ts twoslash
// @errors: 2322 2322 2322
declare const maybe: unknown;
// 'maybe' could be a string, object, boolean, undefined, or other types
const aNumber: number = maybe;

if (maybe === true) {
  // TypeScript knows that maybe is a boolean now
  const aBoolean: boolean = maybe;
  // So, it cannot be a string
  const aString: string = maybe;
}

if (typeof maybe === "string") {
  // TypeScript knows that maybe is a string
  const aString: string = maybe;
  // So, it cannot be a boolean
  const aBoolean: boolean = maybe;
}
```

## Any (မည်သည့်အရာမဆို)

အခြေအနေ တချို့မှာ — type information အားလုံး မရရှိနိုင်တာမျိုး ဒါမှမဟုတ် — ကြေညာဖို့ဆိုရင် မသင့်လျော်လောက်အောင် အားစိုက်ထုတ်ရမယ့် အခြေအနေမျိုး ရှိနိုင်ပါတယ်။
TypeScript မပါဘဲ ရေးသားထားတဲ့ code ဒါမှမဟုတ် 3rd party library တစ်ခုကနေ လာတဲ့ values တွေမှာ ဒီလိုမျိုး ဖြစ်တတ်ပါတယ်။
ဒီလိုအခြေအနေမျိုးမှာ — type checking ကနေ ရှောင်ထွက် (opt-out) ချင်လာနိုင်ပါတယ်။
အဲဒီလိုလုပ်ဖို့ — ဒီ values တွေကို `any` type နဲ့ တံဆိပ်ကပ်ပေးပါတယ်:

```ts twoslash
declare function getValue(key: string): any;
// OK, return value of 'getValue' is not checked
const str: string = getValue("myString");
```

`any` type က — ရှိပြီးသား JavaScript တွေနဲ့ အလုပ်လုပ်ဖို့ အားကောင်းတဲ့ နည်းလမ်းတစ်ခု ဖြစ်ပြီး — compilation ကာလအတွင်း type checking ကို တဖြည်းဖြည်း opt-in လုပ်ဖို့ရော opt-out လုပ်ဖို့ပါ ခွင့်ပြုပေးပါတယ်။

`unknown` နဲ့ မတူဘဲ — `any` type ရဲ့ variables တွေက — မရှိတဲ့ properties တွေတောင် အပါအဝင် — ကြိုက်ရာ properties တွေကို ဝင်ရောက်ကြည့်လို့ ရစေပါတယ်။
ဒီ properties တွေထဲမှာ functions တွေလည်း ပါဝင်နိုင်ပြီး — TypeScript က သူတို့ရဲ့ တည်ရှိမှုကိုရော type ကိုပါ check လုပ်မှာ မဟုတ်ပါဘူး:

```ts twoslash
// @errors: 2571 18046
let looselyTyped: any = 4;
// OK, ifItExists might exist at runtime
looselyTyped.ifItExists();
// OK, toFixed exists (but the compiler doesn't check)
looselyTyped.toFixed();

let strictlyTyped: unknown = 4;
strictlyTyped.toFixed();
```

`any` က ကိုယ့် objects တွေကတစ်ဆင့် ဆက်လက် ပျံ့နှံ့ (propagate) သွားပါလိမ့်မယ်:

```ts twoslash
let looselyTyped: any = {};
let d = looselyTyped.a.b.c.d;
//  ^?
```

ခြုံပြောရရင် — `any` ရဲ့ အဆင်ပြေမှု (convenience) အားလုံးဟာ — type safety (type လုံခြုံမှု) ဆုံးရှုံးခြင်းဆိုတဲ့ စျေးနဲ့ လာတယ်ဆိုတာ သတိရပါ။
Type safety က TypeScript ကို သုံးရတဲ့ အဓိက ရည်ရွယ်ချက်တွေထဲက တစ်ခု ဖြစ်ပြီး — မလိုအပ်တဲ့အခါ `any` သုံးတာကို ရှောင်ရှားဖို့ ကြိုးစားသင့်ပါတယ်။

## Void (တန်ဖိုး လုံးဝမရှိခြင်း)

`void` က `any` ရဲ့ ဆန့်ကျင်ဘက်လို အနည်းငယ် သဘောမျိုးပါ: type တစ်ခုမှ လုံးဝ မရှိခြင်းပဲ ဖြစ်ပါတယ်။
ဒါကို value တစ်ခု ပြန်မပေးတဲ့ functions တွေရဲ့ return type အနေနဲ့ မကြာခဏ တွေ့ရတတ်ပါတယ်:

```ts twoslash
function warnUser(): void {
  console.log("This is my warning message");
}
```

`void` type ရဲ့ variables တွေကို ကြေညာတာက အသုံးမဝင်လှပါဘူး — ဘာလို့လဲဆိုတော့ သူတို့ဆီကို `null` ( [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) သတ်မှတ်ထားခြင်း မရှိမှသာ — နောက် section မှာ ကြည့်ပါ) ဒါမှမဟုတ် `undefined` ပဲ assign (သတ်မှတ်ပေး) လို့ရလို့ပါ:

```ts twoslash
// @strict: false
let unusable: void = undefined;
// OK if `--strictNullChecks` is not given
unusable = null;
```

## Null and Undefined (Null နှင့် Undefined)

TypeScript မှာ — `undefined` ရော `null` ရော နှစ်ခုလုံးက — သူတို့ရဲ့ types တွေ အသီးသီး `undefined` နဲ့ `null` လို့ပဲ အမည် ရှိပါတယ်။
`void` လိုပဲ — သူတို့ချည်းသက်သက်ဆိုရင်တော့ သိပ်ပြီး အသုံးမဝင်ပါဘူး:

```ts twoslash
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

ပုံမှန်အားဖြင့် — `null` နဲ့ `undefined` တွေက တခြား type တွေအားလုံးရဲ့ subtypes တွေ ဖြစ်ပါတယ်။
ဆိုလိုတာက — `null` နဲ့ `undefined` တွေကို `number` လို type မျိုးဆီကို assign လုပ်လို့ရပါတယ်။

ဒါပေမယ့် — [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) flag ကို သုံးတဲ့အခါ — `null` နဲ့ `undefined` တွေက `unknown`, `any` နဲ့ သူတို့ရဲ့ ကိုယ်ပိုင် types တွေဆီကိုပဲ assign လုပ်လို့ရပါတော့တယ် (`undefined` က `void` ဆီကိုလည်း assign လုပ်လို့ရတာကတော့ ခြွင်းချက်တစ်ခုပါ)။
ဒါက ဖြစ်လေ့ဖြစ်ထရှိတဲ့ error _များစွာကို_ ရှောင်ရှားဖို့ ကူညီပေးပါတယ်။
`string` ဒါမှမဟုတ် `null` ဒါမှမဟုတ် `undefined` — ဘယ်ဟာကိုမဆို ထည့်သွင်းပေးချင်တဲ့ အခြေအနေမျိုးမှာ — `string | null | undefined` ဆိုတဲ့ union type ကို သုံးနိုင်ပါတယ်။

Union types တွေကတော့ နောက်အခန်းတစ်ခုမှာ အကျယ်တဝင့် ဆွေးနွေးမယ့် အဆင့်မြင့် အကြောင်းအရာတစ်ခုပါ။

> မှတ်ချက်တစ်ခုအနေနဲ့: ဖြစ်နိုင်ရင် [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) ကို သုံးဖို့ တိုက်တွန်းပါတယ် — ဒါပေမယ့် ဒီ handbook ရဲ့ ရည်ရွယ်ချက်တွေအတွက်တော့ — အဲဒါကို ပိတ်ထားတယ်လို့ ယူဆသွားပါမယ်။

## Never (ဘယ်တော့မှ မဖြစ်ပေါ်ခြင်း)

`never` type က — ဘယ်တော့မှ မဖြစ်ပေါ်တဲ့ values တွေရဲ့ type ကို ကိုယ်စားပြုပါတယ်။
ဥပမာ — exception တစ်ခုကို အမြဲတမ်း throw လုပ်တဲ့ ဒါမှမဟုတ် ဘယ်တော့မှ ပြန်မလာတဲ့ — function expression ဒါမှမဟုတ် arrow function expression တစ်ခုရဲ့ return type က `never` ဖြစ်ပါတယ်။
ဘယ်တော့မှ true မဖြစ်နိုင်တဲ့ type guards တွေနဲ့ narrow လုပ်ခံရတဲ့ variables တွေကလည်း `never` type ကို ရရှိပါတယ်။

`never` type က type တိုင်းရဲ့ subtype ဖြစ်ပြီး — type တိုင်းဆီကိုလည်း assign လုပ်လို့ရပါတယ်; ဒါပေမယ့် — `never` ကိုယ်တိုင်ကလွဲရင် — type ဘယ်တစ်ခုမှ `never` ရဲ့ subtype မဟုတ်သလို — `never` ဆီကိုလည်း assign လုပ်လို့ မရပါဘူး။
`any` တောင် `never` ဆီကို assign လုပ်လို့ မရပါဘူး။

`never` ကို ပြန်ပေးတဲ့ functions တွေရဲ့ ဥပမာ တချို့:

```ts twoslash
// Function returning never must not have a reachable end point
function error(message: string): never {
  throw new Error(message);
}

// Inferred return type is never
function fail() {
  return error("Something failed");
}

// Function returning never must not have a reachable end point
function infiniteLoop(): never {
  while (true) {}
}
```

## Object (Primitive မဟုတ်သော Type)

`object` က non-primitive type ကို ကိုယ်စားပြုတဲ့ type တစ်ခုပါ — ဆိုလိုတာက `number`, `string`, `boolean`, `bigint`, `symbol`, `null` ဒါမှမဟုတ် `undefined` မဟုတ်တဲ့ — ဘာမဆို ဖြစ်ပါတယ်။

`object` type နဲ့ဆိုရင် — `Object.create` လို APIs တွေကို ပိုကောင်းအောင် ကိုယ်စားပြုနိုင်ပါတယ်။ ဥပမာ:

```ts twoslash
// @errors: 2345
declare function create(o: object | null): void;

// OK
create({ prop: 0 });
create(null);
create(undefined); // with `--strictNullChecks` flag enabled, undefined is not a subtype of null

create(42);
create("string");
create(false);
```

ယေဘုယျအားဖြင့်တော့ — ဒါကို သုံးဖို့ မလိုအပ်ပါဘူး။

## Type assertions (Type Assertion များ)

တစ်ခါတလေ — value တစ်ခုအကြောင်း TypeScript သိတာထက် ပိုပြီး သင်က သိနေတဲ့ အခြေအနေမျိုးကို ရောက်သွားတတ်ပါတယ်။
ပုံမှန်အားဖြင့် — entity တစ်ခုရဲ့ type က သူ့ရဲ့ လက်ရှိ type ထက် ပိုတိကျနိုင်တယ်ဆိုတာ သင်သိတဲ့အခါမျိုးမှာ ဖြစ်တတ်ပါတယ်။

_Type assertions_ တွေက compiler ကို "ငါ့ကို ယုံလိုက်ပါ — ငါ ဘာလုပ်နေလဲ သိတယ်" လို့ ပြောတဲ့ နည်းလမ်းတစ်ခုပါ။
Type assertion ဆိုတာ တခြား languages တွေက type cast လိုမျိုးပဲ — ဒါပေမယ့် data တွေအပေါ် အထူး checking ရော — ပြန်လည်ဖွဲ့စည်းခြင်း (restructuring) ရော — ဘာမှ မလုပ်ဆောင်ပါဘူး။
Runtime အပေါ် သက်ရောက်မှု မရှိဘဲ — compiler ကပဲ သက်သက် အသုံးပြုတာပါ။
TypeScript က — programmer ဖြစ်တဲ့ သင်က — သင်လိုအပ်တဲ့ အထူး checks တွေကို လုပ်ဆောင်ပြီးသားလို့ ယူဆပါတယ်။

Type assertions တွေမှာ ပုံစံ နှစ်မျိုး ရှိပါတယ်။

တစ်မျိုးကတော့ `as`-syntax ပါ:

```ts twoslash
let someValue: unknown = "this is a string";

let strLength: number = (someValue as string).length;
```

နောက်တစ်မျိုးကတော့ "angle-bracket" syntax ပါ:

```ts twoslash
let someValue: unknown = "this is a string";

let strLength: number = (<string>someValue).length;
```

ဥပမာ နှစ်ခုလုံးက ညီမျှပါတယ်။
ဘယ်ဟာကို သုံးမလဲဆိုတာက အများအားဖြင့် ကြိုက်နှစ်သက်ရာ ရွေးချယ်မှုတစ်ခုပါ; ဒါပေမယ့် — TypeScript ကို JSX နဲ့ သုံးတဲ့အခါ — `as`-style assertions တွေပဲ ခွင့်ပြုပါတယ်။

## A note about `let` (`let` အကြောင်း မှတ်ချက်)

ဒီအထိ — သင်ပိုရင်းနှီးနေမယ့် JavaScript ရဲ့ `var` keyword အစား — `let` keyword ကိုပဲ သုံးနေတာကို သတိထားမိကြမယ် ထင်ပါတယ်။
`let` keyword က တကယ်တော့ — TypeScript က ရရှိစေတဲ့ — JavaScript ရဲ့ ပိုသစ်တဲ့ construct တစ်ခုပါ။
[Variable Declarations](/docs/typescript/variable-declarations) ဆိုတဲ့ Handbook Reference မှာ — `let` နဲ့ `const` တွေက `var` ရဲ့ ပြဿနာ အများအပြားကို ဘယ်လို ဖြေရှင်းပေးလဲဆိုတာကို ပိုပြီး ဖတ်ရှုနိုင်ပါတယ်။

## About `Number`, `String`, `Boolean`, `Symbol` and `Object` (Number, String, Boolean, Symbol နှင့် Object အကြောင်း)

`Number`, `String`, `Boolean`, `Symbol` ဒါမှမဟုတ် `Object` ဆိုတဲ့ types တွေက — အပေါ်မှာ အကြံပြုထားတဲ့ lowercase ဗားရှင်းတွေနဲ့ အတူတူပဲလို့ ထင်စရာ ရှိနိုင်ပါတယ်။
ဒါပေမယ့် — ဒီ types တွေက language primitives တွေကို ရည်ညွှန်းတာ မဟုတ်ဘဲ — type အနေနဲ့တော့ ဘယ်တော့မှ နီးပါး မသုံးသင့်ပါဘူး။

```ts twoslash
// @errors: 2339
function reverse(s: String): String {
  return s.split("").reverse().join("");
}

reverse("hello world");
```

အဲဒီအစား — `number`, `string`, `boolean`, `object` နဲ့ `symbol` ဆိုတဲ့ types တွေကို သုံးပါ။

```ts twoslash
function reverse(s: string): string {
  return s.split("").reverse().join("");
}

reverse("hello world");
```
