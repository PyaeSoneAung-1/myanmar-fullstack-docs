---
title: "TypeScript 4.4 (TypeScript 4.4 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 4.4 ထုတ်ပြန်မှု — aliased conditions နှင့် discriminant များအတွက် control flow analysis, symbol နှင့် template string pattern index signatures, catch variable များတွင် unknown အဖြစ် default ပြောင်းခြင်း, static blocks, performance တိုးတက်မှုများ နှင့် breaking changes အကြောင်း"
order: 84
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html"
status: translated
updated: 2026-09-05
---

## Control Flow Analysis of Aliased Conditions and Discriminants (Aliased Conditions နှင့် Discriminants များအတွက် Control Flow Analysis)

JavaScript မှာ — value တစ်ခုကို နည်းအမျိုးမျိုးနဲ့ စစ်ဆေးပြီး — သူ့ရဲ့ type အကြောင်း ပိုသိလာတာနဲ့အမျှ မတူညီတဲ့ အလုပ်တွေ လုပ်ရတာမျိုး မကြာခဏ ရှိပါတယ်။ TypeScript က ဒီလို check တွေကို နားလည်ပြီး — ၎င်းတို့ကို _type guards_ လို့ ခေါ်ပါတယ်။ Variable တစ်ခုကို သုံးတိုင်း သူ့ရဲ့ type ကို TypeScript ကို ယုံကြည်စေဖို့ ကြိုးစားနေစရာ မလိုတော့ဘဲ — type-checker က _control flow analysis_ လို့ ခေါ်တဲ့ နည်းကို အသုံးပြုပြီး — code တစ်ပိုင်း မရောက်ခင် type guard တစ်ခုကို သုံးခဲ့သလားဆိုတာ စစ်ဆေးပါတယ်။

ဥပမာ — ဒီလိုမျိုး ရေးနိုင်ပါတယ်:

```ts twoslash
function foo(arg: unknown) {
  if (typeof arg === "string") {
    console.log(arg.toUpperCase());
    //           ^?
  }
}
```

ဒီဥပမာမှာ — `arg` က `string` ဟုတ်မဟုတ် စစ်ဆေးထားပါတယ်။ TypeScript က `typeof arg === "string"` ဆိုတဲ့ check ကို type guard တစ်ခုအဖြစ် အသိအမှတ်ပြုပြီး — `if` block ရဲ့ အတွင်းမှာ `arg` က `string` ဖြစ်တယ်ဆိုတာ သိပါတယ်။ အဲဒါကြောင့် — error မတက်ဘဲ `toUpperCase()` လို `string` method တွေကို သုံးနိုင်ခဲ့တာပါ။

ဒါပေမယ့် — အဲဒီ condition ကို `argIsString` ဆိုတဲ့ constant တစ်ခုဆီ ရွှေ့လိုက်ရင် ဘာဖြစ်မလဲ?

```ts
// In TS 4.3 and below

function foo(arg: unknown) {
  const argIsString = typeof arg === "string";
  if (argIsString) {
    console.log(arg.toUpperCase());
    //              ~~~~~~~~~~~
    // Error! Property 'toUpperCase' does not exist on type 'unknown'.
  }
}
```

TypeScript ရဲ့ အရင် ဗားရှင်းတွေမှာတော့ — ဒါက error တစ်ခု ဖြစ်ပါတယ်။ `argIsString` ကို type guard တစ်ခုရဲ့ တန်ဖိုးနဲ့ assign လုပ်ထားပေမယ့် — TypeScript က အဲဒီ အချက်အလက်ကို လုံးဝ ဆုံးရှုံးသွားစေပါတယ်။ ဒါက စိတ်မကောင်းစရာပါ — ဘာလို့လဲဆိုတော့ တူညီတဲ့ check ကို နေရာအများကြီးမှာ ပြန်သုံးချင်တတ်လို့ပါ။ ဒါကို ရှောင်ရှားဖို့ — user တွေက ကိုယ့်ဟာကိုယ် ထပ်ခါထပ်ခါ ရေးနေရတာ ဒါမှမဟုတ် type assertion (cast လို့လည်း ခေါ်ပါတယ်) တွေကို သုံးရတတ်ပါတယ်။

TypeScript 4.4 မှာတော့ — အဲဒီလို မဟုတ်တော့ပါဘူး။ အပေါ်က ဥပမာက error မရှိဘဲ အလုပ်လုပ်ပါတယ်! TypeScript က constant value တစ်ခုကို စစ်ဆေးနေတာကို မြင်တဲ့အခါ — ၎င်းထဲမှာ type guard ပါဝင်သလားဆိုတာ သိဖို့ အလုပ်နည်းနည်း ထပ်လုပ်ပါတယ်။ အဲဒီ type guard က `const` တစ်ခု၊ `readonly` property တစ်ခု၊ ဒါမှမဟုတ် ပြင်ဆင်မွမ်းမံမထားတဲ့ (un-modified) parameter တစ်ခုပေါ်မှာ အလုပ်လုပ်ရင် — TypeScript က အဲဒီ value ကို သင့်လျော်သလို narrow လုပ်နိုင်ပါတယ်။

Type guard condition တွေရဲ့ ပုံစံအမျိုးမျိုးကို ထိန်းသိမ်းထားပါတယ် — `typeof` check တွေ တစ်ခုတည်း မဟုတ်ပါဘူး။ ဥပမာ — discriminated unions တွေပေါ်က check တွေက အလွန် ကောင်းမွန်စွာ အလုပ်လုပ်ပါတယ်။

```ts twoslash
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number };

function area(shape: Shape): number {
  const isCircle = shape.kind === "circle";
  if (isCircle) {
    // We know we have a circle here!
    return Math.PI * shape.radius ** 2;
  } else {
    // We know we're left with a square here!
    return shape.sideLength ** 2;
  }
}
```

4.4 မှာ discriminants တွေအပေါ် analysis က နည်းနည်း ပိုနက်ရှိုင်းလာပါတယ် — အခု discriminants တွေကို ထုတ်ယူ (extract) လို့ ရပြီး — TypeScript က မူရင်း object ကိုပါ narrow လုပ်နိုင်ပါတယ်။

```ts twoslash
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number };

function area(shape: Shape): number {
  // Extract out the 'kind' field first.
  const { kind } = shape;

  if (kind === "circle") {
    // We know we have a circle here!
    return Math.PI * shape.radius ** 2;
  } else {
    // We know we're left with a square here!
    return shape.sideLength ** 2;
  }
}
```

နောက်ထပ် ဥပမာတစ်ခုအနေနဲ့ — သူ့ရဲ့ input နှစ်ခုမှာ content တွေ ရှိမရှိ စစ်ဆေးတဲ့ function တစ်ခု ဒီမှာ ပါပါတယ်။

```ts twoslash
function doSomeChecks(
  inputA: string | undefined,
  inputB: string | undefined,
  shouldDoExtraWork: boolean
) {
  const mustDoWork = inputA && inputB && shouldDoExtraWork;
  if (mustDoWork) {
    // We can access 'string' properties on both 'inputA' and 'inputB'!
    const upperA = inputA.toUpperCase();
    const upperB = inputB.toUpperCase();
    // ...
  }
}
```

`mustDoWork` က `true` ဆိုရင် — `inputA` ရော `inputB` ပါ နှစ်ခုလုံး တည်ရှိနေတယ်ဆိုတာကို TypeScript က နားလည်ပါတယ်။ ဆိုလိုတာက — `inputA` က `undefined` မဟုတ်ဘူးဆိုတာ TypeScript ကို ယုံကြည်စေဖို့ `inputA!` လို non-null assertion ရေးနေစရာ မလိုတော့ပါဘူး။

ဒီမှာ ကောင်းမွန်တဲ့ အချက်တစ်ခုက — ဒီ analysis က transitively (အဆင့်ဆင့် ဆက်သွယ်) အလုပ်လုပ်ပါတယ်။ TypeScript က constant တွေကို ဖြတ်သန်းပြီး — မင်း ဘယ်လို check မျိုးတွေ လုပ်ပြီးသွားပြီလဲဆိုတာ နားလည်ပါတယ်။

```ts twoslash
function f(x: string | number | boolean) {
  const isString = typeof x === "string";
  const isNumber = typeof x === "number";
  const isStringOrNumber = isString || isNumber;
  if (isStringOrNumber) {
    x;
//  ^?
  } else {
    x;
//  ^?
  }
}
```

သတိပြုစရာက — cutoff (ကန့်သတ်ချက်) တစ်ခု ရှိပါတယ်။ ဒီ condition တွေကို စစ်ဆေးတဲ့အခါ TypeScript က မတရားနက်ရှိုင်းအောင် မသွားပါဘူး — ဒါပေမယ့် သူ့ရဲ့ analysis က check အများစုအတွက် လုံလောက်ပါတယ်။

ဒီ feature က — အလိုလိုသိနိုင်တဲ့ JavaScript code တွေ အများကြီးကို TypeScript ထဲမှာ — မင်းကို အနှောင့်အယှက် မဖြစ်စေဘဲ "အလုပ်ဖြစ်သွားအောင်" လုပ်ပေးနိုင်ပါတယ်။ အသေးစိတ်အတွက် — [GitHub ပေါ်က implementation ကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/44730)!

## Symbol and Template String Pattern Index Signatures (Symbol နှင့် Template String Pattern Index Signature များ)

TypeScript က — property တိုင်း တိကျတဲ့ type တစ်မျိုးတည်း ရှိရမယ့် object တွေကို _index signatures_ သုံးပြီး ဖော်ပြနိုင်အောင် လုပ်ပေးပါတယ်။ ဒါက ဒီလို object တွေကို dictionary လိုမျိုး types တွေအနေနဲ့ သုံးနိုင်စေပါတယ် — square bracket တွေနဲ့ string key တွေကို သုံးပြီး ၎င်းတို့ထဲ index လုပ်နိုင်ပါတယ်။

ဥပမာ — `string` key တွေကို လက်ခံပြီး `boolean` value တွေဆီ map လုပ်တဲ့ index signature ပါတဲ့ type တစ်ခုကို ရေးနိုင်ပါတယ်။ `boolean` မဟုတ်တဲ့ တန်ဖိုးတစ်ခုခုကို assign လုပ်ဖို့ ကြိုးစားရင် — error တစ်ခု ရပါမယ်။

```ts twoslash
// @errors: 2322 2375
interface BooleanDictionary {
  [key: string]: boolean;
}

declare let myDict: BooleanDictionary;

// Valid to assign boolean values
myDict["foo"] = true;
myDict["bar"] = false;

// Error, "oops" isn't a boolean
myDict["baz"] = "oops";
```

[`Map` တစ်ခုက ဒီနေရာအတွက် ပိုကောင်းတဲ့ data structure တစ်ခု ဖြစ်နိုင်ပေမယ့်](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) (အထူးသဖြင့် — `Map<string, boolean>`) — JavaScript object တွေက သုံးရပိုအဆင်ပြေတတ်ပြီး ဒါမှမဟုတ် ကျွန်တော်တို့ လက်ထဲမှာ ရှိပြီးသား အရာတွေ ဖြစ်နေတတ်ပါတယ်။

အလားတူပဲ — `Array<T>` က `T` type တန်ဖိုးတွေကို ထည့်သွင်း/ပြန်ထုတ်နိုင်စေတဲ့ `number` index signature တစ်ခုကို ကြိုတင် သတ်မှတ်ထားပြီးသားပါ။

```ts
// @errors: 2322 2375
// This is part of TypeScript's definition of the built-in Array type.
interface Array<T> {
  [index: number]: T;

  // ...
}

let arr = new Array<string>();

// Valid
arr[0] = "hello!";

// Error, expecting a 'string' value here
arr[1] = 123;
```

Index signatures တွေက — လက်တွေ့ကမ္ဘာ့ code အများကြီးကို ဖော်ပြဖို့ အလွန် အသုံးဝင်ပါတယ်; ဒါပေမယ့် — အခုအချိန်အထိ ၎င်းတို့က `string` နဲ့ `number` key တွေအတွက်ပဲ ကန့်သတ်ထားခဲ့ပါတယ် (`string` index signatures တွေမှာတော့ — `number` key တွေကို လက်ခံနိုင်တဲ့ ရည်ရွယ်ချက်ရှိတဲ့ ထူးခြားချက်တစ်ခု ရှိပါတယ် — ဘာလို့လဲဆိုတော့ ၎င်းတို့က ဘယ်လိုပဲဖြစ်ဖြစ် strings တွေအဖြစ် ပြောင်းလဲခံရမှာ မို့လို့ပါ)။ ဆိုလိုတာက — TypeScript က `symbol` key တွေနဲ့ object တွေကို index လုပ်တာကို ခွင့်မပြုခဲ့ပါဘူး။ `string` key တွေရဲ့ _subset_ (အစုခွဲ) တစ်ခုရဲ့ index signature ကိုလည်း TypeScript က ပုံဖော်နိုင်ခဲ့မှာ မဟုတ်ပါဘူး — ဥပမာ — `data-` နဲ့ စတင်တဲ့ နာမည်တွေရှိတဲ့ properties တွေကိုပဲ ဖော်ပြတဲ့ index signature မျိုးပါ။

TypeScript 4.4 က ဒီကန့်သတ်ချက်တွေကို ဖြေရှင်းပေးပြီး — `symbol` တွေနဲ့ template string patterns တွေအတွက် index signatures တွေကို ခွင့်ပြုပါတယ်။

ဥပမာ — TypeScript က အခု ကြိုက်ရာ `symbol` တွေနဲ့ key လုပ်လို့ရတဲ့ type တစ်ခုကို ကြေညာနိုင်စေပါပြီ။

```ts twoslash
// @errors: 2322 2375
interface Colors {
  [sym: symbol]: number;
}

const red = Symbol("red");
const green = Symbol("green");
const blue = Symbol("blue");

let colors: Colors = {};

// Assignment of a number is allowed
colors[red] = 255;
let redVal = colors[red];
//  ^?

colors[blue] = "da ba dee";
```

အလားတူပဲ — template string pattern type တစ်ခုနဲ့ index signature တစ်ခုကို ရေးနိုင်ပါတယ်။ ဒါရဲ့ အသုံးတစ်ခုက — `data-` နဲ့ စတင်တဲ့ properties တွေကို TypeScript ရဲ့ excess property checking ကနေ ကင်းလွတ်ခွင့် ပေးဖို့ ဖြစ်နိုင်ပါတယ်။ Object literal တစ်ခုကို မျှော်လင့်ထားတဲ့ type ရှိတဲ့ နေရာတစ်ခုဆီ ပို့လိုက်တဲ့အခါ — TypeScript က မျှော်လင့်ထားတဲ့ type ထဲမှာ ကြေညာထားခြင်း မရှိတဲ့ excess properties တွေကို ရှာဖွေပါတယ်။

```ts
// @errors: 2322 2375
interface Options {
    width?: number;
    height?: number;
}

let a: Options = {
    width: 100,
    height: 100,

    "data-blah": true,
};

interface OptionsWithDataProps extends Options {
    // Permit any property starting with 'data-'.
    [optName: `data-${string}`]: unknown;
}

let b: OptionsWithDataProps = {
    width: 100,
    height: 100,
    "data-blah": true,

    // Fails for a property which is not known, nor
    // starts with 'data-'
    "unknown-property": true,
};
```

Index signatures အကြောင်း နောက်ဆုံး မှတ်ချက်တစ်ခုက — ၎င်းတို့က အခု union types တွေကို ခွင့်ပြုပါတယ် — ၎င်းတို့ဟာ infinite-domain (အကန့်အသတ်မရှိ နယ်ပယ်) ရှိတဲ့ primitive types တွေရဲ့ union ဖြစ်နေသရွေ့ပါ — အထူးသဖြင့်:

- `string`
- `number`
- `symbol`
- template string patterns (ဥပမာ — `` `hello-${string}` ``)

ဒီ types တွေရဲ့ union တစ်ခုကို argument အဖြစ် လက်ခံတဲ့ index signature တစ်ခုက — index signature အများအပြား အဖြစ် de-sugar (ဖြန့်ခွဲသွား) ပါလိမ့်မယ်။

```ts
interface Data {
  [optName: string | symbol]: any;
}

// Equivalent to

interface Data {
  [optName: string]: any;
  [optName: symbol]: any;
}
```

အသေးစိတ်အတွက် — [pull request ကို ဖတ်ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/44512)

## Defaulting to the `unknown` Type in Catch Variables (`--useUnknownInCatchVariables`) (Catch Variable များတွင် `unknown` Type အဖြစ် Default သတ်မှတ်ခြင်း)

JavaScript မှာ — `throw` နဲ့ ဘယ်လို type မဆို တန်ဖိုးကို ပစ်လွှတ်လို့ ရပြီး — `catch` clause တစ်ခုမှာ ဖမ်းယူလို့ ရပါတယ်။ ဒါကြောင့် — TypeScript က catch clause variable တွေကို သမိုင်းအရ `any` အဖြစ်ပဲ type သတ်မှတ်ခဲ့ပြီး — တခြား type annotation တစ်ခုခုကို ခွင့်မပြုခဲ့ပါဘူး:

```ts
try {
  // Who knows what this might throw...
  executeSomeThirdPartyCode();
} catch (err) {
  // err: any
  console.error(err.message); // Allowed, because 'any'
  err.thisWillProbablyFail(); // Allowed, because 'any' :(
}
```

TypeScript က `unknown` type ကို ထည့်ပေးပြီးတဲ့နောက် — အမြင့်ဆုံး correctness နဲ့ type-safety ကို လိုချင်တဲ့ user တွေအတွက် `catch` clause variable တွေမှာ `unknown` က `any` ထက် ပိုကောင်းတဲ့ ရွေးချယ်မှု ဖြစ်တာ ထင်ရှားလာပါတယ် — ဘာလို့လဲဆိုတော့ ၎င်းက ပိုကောင်းအောင် narrow လုပ်နိုင်ပြီး — ကြိုက်ရာ value တွေကို စစ်ဆေးရန် အတင်းအကျပ် ဖြစ်စေလို့ပါ။ နောက်ဆုံး TypeScript 4.0 က user တွေကို `catch` clause variable တစ်ခုချင်းစီပေါ်မှာ `unknown` (ဒါမှမဟုတ် `any`) ဆိုတဲ့ ရှင်းလင်းတဲ့ type annotation တစ်ခုကို သတ်မှတ်ခွင့် ပေးခဲ့ပါတယ် — ဒါမှ case-by-case အလိုက် ပိုတင်းကျပ်တဲ့ types တွေကို ရွေးချယ်သုံးလို့ ရမယ်လေ; ဒါပေမယ့် — တစ်ချို့အတွက်တော့ — `catch` clause တိုင်းမှာ `: unknown` ကို ကိုယ်တိုင် သတ်မှတ်နေရတာက ငြီးငွေ့စရာ အလုပ်တစ်ခု ဖြစ်နေပါတယ်။

ဒါကြောင့်ပဲ TypeScript 4.4 က [`useUnknownInCatchVariables`](https://www.typescriptlang.org/tsconfig#useUnknownInCatchVariables) လို့ ခေါ်တဲ့ flag အသစ်တစ်ခုကို မိတ်ဆက်ပေးပါတယ်။ ဒီ flag က `catch` clause variable တွေရဲ့ default type ကို `any` ကနေ `unknown` အဖြစ် ပြောင်းလဲပေးပါတယ်။

```ts twoslash
// @errors: 2571 18046
declare function executeSomeThirdPartyCode(): void;
// ---cut---
try {
  executeSomeThirdPartyCode();
} catch (err) {
  // err: unknown

  // Error! Property 'message' does not exist on type 'unknown'.
  console.error(err.message);

  // Works! We can narrow 'err' from 'unknown' to 'Error'.
  if (err instanceof Error) {
    console.error(err.message);
  }
}
```

ဒီ flag ကို [`strict`](https://www.typescriptlang.org/tsconfig#strict) option မိသားစုအောက်မှာ enable လုပ်ထားပါတယ်။ ဆိုလိုတာက — [`strict`](https://www.typescriptlang.org/tsconfig#strict) ကို သုံးပြီး code ကို check လုပ်ရင် — ဒီ option က အလိုအလျောက် ဖွင့်ပေးမှာ ဖြစ်ပါတယ်။ TypeScript 4.4 မှာ ဒီလိုမျိုး errors တွေ ကြုံရနိုင်ပါတယ်:

```
Property 'message' does not exist on type 'unknown'.
Property 'name' does not exist on type 'unknown'.
Property 'stack' does not exist on type 'unknown'.
```

`catch` clause တစ်ခုထဲမှာ `unknown` variable တစ်ခုနဲ့ ဆက်ဆံချင်မှာ မဟုတ်တဲ့ အခြေအနေတွေမှာ — ပိုတင်းကျပ်တဲ့ types တွေကနေ ထွက်ဖို့ (opt _out_) အတွက် — `: any` ဆိုတဲ့ ရှင်းလင်းတဲ့ annotation တစ်ခုကို အမြဲ ထည့်နိုင်ပါတယ်။

```ts twoslash
declare function executeSomeThirdPartyCode(): void;
// ---cut---
try {
  executeSomeThirdPartyCode();
} catch (err: any) {
  console.error(err.message); // Works again!
}
```

နောက်ထပ် အချက်အလက်တွေအတွက် — [implementing pull request ကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/41013)။

## Exact Optional Property Types (`--exactOptionalPropertyTypes`) (Optional Property Type များကို အတိအကျ သတ်မှတ်ခြင်း)

JavaScript မှာ — object တစ်ခုပေါ်က _မရှိတဲ့ (missing)_ property တစ်ခုကို ဖတ်ရင် — `undefined` ဆိုတဲ့ တန်ဖိုး ရပါတယ်။ တကယ့် property တစ်ခုမှာ `undefined` တန်ဖိုး _ရှိဖို့_ လည်း ဖြစ်နိုင်ပါတယ်။ JavaScript ထဲက code အများစုက ဒီအခြေအနေ နှစ်မျိုးလုံးကို တူညီတဲ့ ပုံစံမျိုးနဲ့ သတ်မှတ်တတ်ကြတာမို့ — TypeScript ကလည်း အစမှာ optional property တိုင်းကို — user က type ထဲမှာ `undefined` ရေးထားသလိုပဲ — အဓိပ္ပာယ် ဖွင့်ဆိုခဲ့ပါတယ်။ ဥပမာ —

```ts
interface Person {
  name: string;
  age?: number;
}
```

ဟာ ဒီလိုနဲ့ ညီမျှတယ်လို့ သတ်မှတ်ခဲ့ပါတယ်:

```ts
interface Person {
  name: string;
  age?: number | undefined;
}
```

ဒါရဲ့ အဓိပ္ပာယ်က — user တစ်ယောက်က `age` နေရာမှာ `undefined` ကို ရှင်းရှင်းလင်းလင်း ရေးနိုင်တယ် ဆိုတာပါ။

```ts
const p: Person = {
  name: "Daniel",
  age: undefined, // This is okay by default.
};
```

ဒါကြောင့် — default အနေနဲ့ — TypeScript က `undefined` တန်ဖိုး ရှိတဲ့ တည်ရှိနေတဲ့ property တစ်ခုနဲ့ မရှိတဲ့ property တစ်ခုကို ခွဲခြားမသိပါဘူး။ ဒါက အများစုမှာ အလုပ်ဖြစ်ပေမယ့် — JavaScript ထဲက code အားလုံးက ဒီလိုပဲ ယူဆကြတာ မဟုတ်ပါဘူး။ `Object.assign`, `Object.keys`, object spread (`{ ...obj }`) စတဲ့ functions နဲ့ operators တွေ၊ `for`-`in` loops တွေက — property တစ်ခု object တစ်ခုပေါ်မှာ တကယ်ရှိမရှိပေါ် မူတည်ပြီး — မတူညီစွာ ပြုမူပါတယ်။ ကျွန်တော်တို့ရဲ့ `Person` ဥပမာမှာဆိုရင် — `age` property ရဲ့ တည်ရှိမှုက အရေးပါတဲ့ context တစ်ခုမှာ ၎င်းကို သုံးသပ်မိရင် — runtime errors တွေ ဖြစ်လာနိုင်ခြေ ရှိပါတယ်။

TypeScript 4.4 မှာ — flag အသစ် [`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes) က — optional property types တွေကို ရေးထားတဲ့အတိုင်း အတိအကျ အဓိပ္ပာယ် ဖွင့်သင့်တယ်လို့ သတ်မှတ်ပါတယ် — ဆိုလိုတာက type ထဲကို `| undefined` ကို ထည့်မပေးတော့ပါဘူး:

```ts twoslash
// @exactOptionalPropertyTypes
// @errors: 2322 2375
interface Person {
  name: string;
  age?: number;
}
// ---cut---
// With 'exactOptionalPropertyTypes' on:
const p: Person = {
  name: "Daniel",
  age: undefined, // Error! undefined isn't a number
};
```

ဒီ flag က [`strict`](https://www.typescriptlang.org/tsconfig#strict) မိသားစုရဲ့ အစိတ်အပိုင်း **မဟုတ်ပါဘူး** — ဒီအပြုအမူကို လိုချင်ရင် ကိုယ်တိုင် ရှင်းရှင်းလင်းလင်း ဖွင့်ပေးရပါမယ်။ ၎င်းက [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) ကိုလည်း တစ်ပြိုင်နက် enable လုပ်ထားဖို့ လိုအပ်ပါတယ်။ Transition ကို တတ်နိုင်သမျှ ချောမွေ့အောင် — DefinitelyTyped နဲ့ တခြား definitions တွေကို အပ်ဒိတ်လုပ်နေပါတယ် — ဒါပေမယ့် မင်းရဲ့ code တည်ဆောက်ပုံပေါ် မူတည်ပြီး ဒါနဲ့ ပတ်သက်တဲ့ ပွတ်တိုက်မှု (friction) တစ်ချို့ ကြုံရနိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [implementing pull request ကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/43947)။

## `static` Blocks in Classes (Class များတွင် `static` Block များ)

TypeScript 4.4 က — [class တွေထဲမှာ `static` blocks](https://github.com/tc39/proposal-class-static-block#ecmascript-class-static-initialization-blocks) တွေအတွက် ပံ့ပိုးမှု ယူဆောင်လာပါတယ် — ဒါက static members တွေအတွက် ပိုရှုပ်ထွေးတဲ့ initialization code တွေ ရေးဖို့ ကူညီပေးနိုင်တဲ့ လာမယ့် ECMAScript feature တစ်ခုပါ။

```ts twoslash
declare function someCondition(): boolean
// ---cut---
class Foo {
    static count = 0;

    // This is a static block:
    static {
        if (someCondition()) {
            Foo.count++;
        }
    }
}
```

ဒီ static blocks တွေက — သူတို့ရဲ့ ကိုယ်ပိုင် scope ရှိတဲ့ statement တစ်ခုချင်းစီကို အစီအစဉ်တစ်ခုအနေနဲ့ ရေးနိုင်စေပြီး — ပါဝင်တဲ့ class ရဲ့ အတွင်းက private fields တွေကို ဝင်ရောက်ကြည့်ရှုနိုင်ပါတယ်။ ဆိုလိုတာက — statement တွေ ရေးခြင်းရဲ့ စွမ်းဆောင်နိုင်မှု အားလုံးနဲ့အတူ — variable တွေ ပေါက်ကြားမှု မရှိဘဲ — ကျွန်တော်တို့ class ရဲ့ အတွင်းပိုင်း အရာတွေကို အပြည့်အဝ ဝင်ရောက်နိုင်တဲ့ initialization code တွေကို ရေးနိုင်ပါတယ်။

```ts twoslash
declare function loadLastInstances(): any[]
// ---cut---
class Foo {
    static #count = 0;

    get count() {
        return Foo.#count;
    }

    static {
        try {
            const lastInstances = loadLastInstances();
            Foo.#count += lastInstances.length;
        }
        catch {}
    }
}
```

`static` blocks တွေ မရှိဘဲနဲ့တော့ — အပေါ်က code ကို ရေးလို့ ရနိုင်ပါတယ် — ဒါပေမယ့် တစ်နည်းနည်းနဲ့ အလျှော့အတင်း လုပ်ရတဲ့ hack အမျိုးမျိုး ပါဝင်တတ်ပါတယ်။

သတိပြုစရာက — class တစ်ခုမှာ `static` blocks အများအပြား ရှိနိုင်ပြီး — ၎င်းတို့ကို ရေးထားတဲ့ အစီအစဉ်အတိုင်းပဲ run ပါတယ်။

```ts twoslash
// Prints:
//    1
//    2
//    3
class Foo {
    static prop = 1
    static {
        console.log(Foo.prop++);
    }
    static {
        console.log(Foo.prop++);
    }
    static {
        console.log(Foo.prop++);
    }
}
```

ဒီ feature ရဲ့ TypeScript implementation အတွက် [Wenlu Wang](https://github.com/Kingwl) ကို ကျေးဇူးတင်ကြောင်း ပြောကြားလိုပါတယ်။ အသေးစိတ်အတွက် — [အဲဒီ pull request ကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/43370)။

## `tsc --help` Updates and Improvements (`tsc --help` အပ်ဒိတ်နှင့် တိုးတက်မှုများ)

TypeScript ရဲ့ `--help` option ကို အသစ်ပြင်ဆင် (refresh) လုပ်လိုက်ပါပြီ! [Song Gao](https://github.com/ShuiRuTian) ရဲ့ တစ်စိတ်တစ်ပိုင်း ပါဝင်မှုကြောင့် — [ကျွန်တော်တို့ရဲ့ compiler options တွေရဲ့ ဖော်ပြချက်တွေကို အပ်ဒိတ်လုပ်တာ](https://github.com/microsoft/TypeScript/pull/44409) နဲ့ [အရောင်တွေနဲ့ အခြား အမြင်အား ခွဲခြားမှုတွေ ပါတဲ့ `--help` menu ကို ပုံစံအသစ် ပြန်လုပ်တာ](https://github.com/microsoft/TypeScript/pull/44157) တို့ကို ယူဆောင်လာခဲ့ပါတယ်။

![Output တွေကို နယ်ပယ်အများအပြား ခွဲပြထားတဲ့ TypeScript `--help` menu အသစ်](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/08/tsc-help-ps-wt-4-4.png)

[မူရင်း proposal thread မှာ ထပ်ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/issues/44074)။

## Performance Improvements (Performance တိုးတက်မှုများ)

### Faster Declaration Emit (Declaration Emit ပိုမြန်ဆန်လာခြင်း)

TypeScript က အခု — internal symbols တွေ မတူညီတဲ့ contexts တွေမှာ ဝင်ရောက်လို့ ရမရ၊ တိကျတဲ့ types တွေကို ဘယ်လို print လုပ်သင့်လဲဆိုတာတွေကို cache လုပ်ထားပါတယ်။ ဒီအပြောင်းအလဲတွေက — အတော်ရှုပ်ထွေးတဲ့ types တွေ ပါတဲ့ code တွေမှာ TypeScript ရဲ့ ယေဘုယျ performance ကို တိုးတက်စေနိုင်ပြီး — [`declaration`](https://www.typescriptlang.org/tsconfig#declaration) flag အောက်မှာ `.d.ts` files တွေ emit လုပ်တဲ့အခါ အထူးသဖြင့် သိသာပါတယ်။

[အသေးစိတ်တွေကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/43973)။

### Faster Path Normalization (Path Normalization ပိုမြန်ဆန်လာခြင်း)

TypeScript က compiler က နေရာတိုင်းမှာ သုံးလို့ရတဲ့ ညီညွတ်တဲ့ format တစ်ခုရဖို့ — file paths တွေကို "normalization" အမျိုးမျိုး လုပ်ရလေ့ ရှိပါတယ်။ ဒါတွေထဲမှာ backslashes တွေကို slashes တွေအဖြစ် အစားထိုးတာ၊ path တွေရဲ့ ကြားထဲက `/./` နဲ့ `/../` segments တွေကို ဖယ်ရှားတာ စတာတွေ ပါဝင်ပါတယ်။ TypeScript က ဒီ paths တွေကို သန်းနဲ့ချီပြီး ကိုင်တွယ်ရတဲ့အခါ — ဒီလုပ်ဆောင်ချက်တွေက နည်းနည်း နှေးကွေးသွားတတ်ပါတယ်။ TypeScript 4.4 မှာတော့ — paths တွေကို normalization လိုအပ်မလိုအပ် ဦးစွာ အမြန် စစ်ဆေးပါတယ်။ ဒီတိုးတက်မှုတွေ ပေါင်းလိုက်တဲ့အခါ — ပိုကြီးတဲ့ projects တွေမှာ project load time ကို 5-10% လျှော့ချပေးနိုင်ပြီး — ကျွန်တော်တို့ အတွင်းမှာ စမ်းသပ်ထားတဲ့ ဧရာမ projects တွေမှာ ပိုပြီး သိသိသာသာ လျှော့ချပေးနိုင်ပါတယ်။

အသေးစိတ်အတွက် — [path segment normalization အတွက် PR](https://github.com/microsoft/TypeScript/pull/44173) နဲ့ [slash normalization အတွက် PR](https://github.com/microsoft/TypeScript/pull/44100) တို့ကို ကြည့်နိုင်ပါတယ်။

### Faster Path Mapping (Path Mapping ပိုမြန်ဆန်လာခြင်း)

TypeScript က path-mappings တွေကို တည်ဆောက်တဲ့ ပုံစံကို အခု cache လုပ်ပါတယ် (`tsconfig.json` ထဲက [`paths`](https://www.typescriptlang.org/tsconfig#paths) option ကို သုံးပြီး)။ Mapping ရာနဲ့ချီ ရှိတဲ့ projects တွေအတွက် — လျှော့ချမှုက သိသာပါတယ်။ [အပြောင်းအလဲကိုယ်တိုင်အကြောင်း ဒီမှာ ထပ်ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/44078)။

### Faster Incremental Builds with `--strict` (`--strict` ဖြင့် Incremental Build ပိုမြန်ဆန်လာခြင်း)

ထိရောက်စွာ bug တစ်ခုလို့ ဆိုရမယ့် အခြေအနေမှာ — [`strict`](https://www.typescriptlang.org/tsconfig#strict) ဖွင့်ထားရင် TypeScript က [`incremental`](https://www.typescriptlang.org/tsconfig#incremental) compilations တွေအောက်မှာ type-checking အလုပ်တွေကို ပြန်လုပ်နေတတ်ပါတယ်။ ဒါကြောင့် — build အများစုက [`incremental`](https://www.typescriptlang.org/tsconfig#incremental) ပိတ်ထားသလောက်ပဲ နှေးကွေးနေခဲ့ပါတယ်။ TypeScript 4.4 က ဒါကို ပြင်ဆင်ပေးပါတယ် — ဒါပေမယ့် ဒီအပြောင်းအလဲကို TypeScript 4.3 ဆီကိုလည်း back-port လုပ်ထားပါတယ်။

[ဒီမှာ ထပ်ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/44394)။

### Faster Source Map Generation for Big Outputs (ကြီးမားသော Output များအတွက် Source Map ထုတ်လုပ်မှု ပိုမြန်ဆန်လာခြင်း)

TypeScript 4.4 က — အလွန် ကြီးမားတဲ့ output files တွေပေါ်မှာ source map ထုတ်လုပ်မှုအတွက် optimization တစ်ခု ထည့်ပေးပါတယ်။ TypeScript compiler ရဲ့ ဗားရှင်းအဟောင်းတစ်ခုကို build လုပ်တဲ့အခါ — ဒါက emit time မှာ 8% ဝန်းကျင် လျှော့ချပေးနိုင်ပါတယ်။

ဒီ performance အမြတ်ကို ဖြစ်စေတဲ့ [ရိုးရှင်းပြီး သန့်ရှင်းတဲ့ အပြောင်းအလဲ](https://github.com/microsoft/TypeScript/pull/44031) တစ်ခုကို ပံ့ပိုးပေးခဲ့တဲ့ [David Michon](https://github.com/dmichon-msft) ကို ကျေးဇူးတင်ကြောင်း ပြောကြားလိုပါတယ်။

### Faster `--force` Builds (`--force` Build ပိုမြန်ဆန်လာခြင်း)

Project references တွေပေါ်မှာ `--build` mode ကို သုံးတဲ့အခါ — TypeScript က ဘယ် files တွေ ပြန် build လုပ်ဖို့ လိုလဲ ဆုံးဖြတ်ဖို့ up-to-date checks တွေ လုပ်ရပါတယ်။ ဒါပေမယ့် [`--force`](https://www.typescriptlang.org/tsconfig#force) build တစ်ခုကို လုပ်တဲ့အခါမှာတော့ — project dependency တိုင်းကို အစကနေ ပြန် build လုပ်မှာ မို့ — အဲဒီ အချက်အလက်က မသက်ဆိုင်တော့ပါဘူး။ TypeScript 4.4 မှာ — [`--force`](https://www.typescriptlang.org/tsconfig#force) builds တွေက ဒီမလိုအပ်တဲ့ အဆင့်တွေကို ရှောင်ရှားပြီး — full build တစ်ခုကို စတင်ပါတယ်။ အပြောင်းအလဲအကြောင်း [ဒီမှာ ထပ်ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/43666)။

## Spelling Suggestions for JavaScript (JavaScript အတွက် Spelling အကြံပြုချက်များ)

TypeScript က Visual Studio နဲ့ Visual Studio Code လို editors တွေမှာ JavaScript editing အတွေ့အကြုံကို အားဖြည့်ပေးပါတယ်။ အများစုမှာ — TypeScript က JavaScript files တွေထဲမှာ ကိုယ့်ကိုကိုယ် မနှောင့်ယှက်အောင် နေတတ်ပါတယ်; ဒါပေမယ့် — TypeScript မှာ ယုံကြည်စိတ်ချရတဲ့ အကြံပြုချက်တွေ လုပ်ဖို့ အချက်အလက် အများကြီး ရှိတတ်ပြီး — _သိပ်မကျူးကျော်_ တဲ့ နည်းလမ်းတွေနဲ့ အကြံပြုချက်တွေကို ပြသတတ်ပါတယ်။

ဒါကြောင့်ပဲ — TypeScript က အခု သာမန် JavaScript files တွေမှာပါ spelling suggestions တွေ ထုတ်ပေးပါတယ် — `// @ts-check` မပါတဲ့ files တွေ ဒါမှမဟုတ် [`checkJs`](https://www.typescriptlang.org/tsconfig#checkJs) ပိတ်ထားတဲ့ project တစ်ခုထဲက files တွေမှာပါ။ ဒါတွေက TypeScript files တွေမှာ ရှိပြီးသား _"Did you mean...?"_ suggestions တွေနဲ့ အတူတူပါပဲ — အခုတော့ ၎င်းတို့ကို JavaScript files _အားလုံး_ မှာ ပုံစံတစ်မျိုးမျိုးနဲ့ ရနိုင်ပါပြီ။

ဒီ spelling suggestions တွေက — မင်းရဲ့ code မှားနေတယ်ဆိုတဲ့ သိမ်မွေ့တဲ့ သဲလွန်စတစ်ခုကို ပေးနိုင်ပါတယ်။ ဒီ feature ကို စမ်းသပ်နေတုန်း — ရှိပြီးသား code တွေထဲမှာ bug တစ်ချို့ကိုလည်း ရှာတွေ့ခဲ့ပါတယ်!

ဒီ feature အသစ်အကြောင်း အသေးစိတ်အတွက် — [pull request ကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/44271)!

## Inlay Hints (Inlay Hint များ)

TypeScript 4.4 က — မင်းရဲ့ code ထဲမှာ parameter names တွေ return types တွေလို အသုံးဝင်တဲ့ အချက်အလက်တွေကို ပြသပေးနိုင်တဲ့ _inlay hints_ တွေအတွက် ပံ့ပိုးမှု ပေးပါတယ်။ ၎င်းကို ဖော်ရွေတဲ့ "ghost text" (တစ်ဝက်ကြည့်ရသော စာသား) တစ်မျိုးလို့ ထင်မှတ်နိုင်ပါတယ်။

![Visual Studio Code ထဲမှာ inlay hints တွေရဲ့ နမူနာ မြင်ကွင်း](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/08/inlayHints-4.4-rc-ghd.png)

ဒီ feature ကို [Wenlu Wang](https://github.com/Kingwl) က တည်ဆောက်ခဲ့ပြီး — သူ့ရဲ့ [pull request](https://github.com/microsoft/TypeScript/pull/42089) မှာ အသေးစိတ်တွေ ရှိပါတယ်။

Wenlu က — [July 2021 (1.59) release ရဲ့ အစိတ်အပိုင်း](https://code.visualstudio.com/updates/v1_59#_typescript-44) တစ်ခုအနေနဲ့ ထွက်ရှိပြီးသား [Visual Studio Code ထဲမှာ inlay hints တွေရဲ့ integration](https://github.com/microsoft/vscode/pull/113412) ကိုလည်း ပံ့ပိုးပေးခဲ့ပါတယ်။ Inlay hints တွေကို စမ်းသုံးကြည့်ချင်ရင် — editor ရဲ့ [stable](https://code.visualstudio.com/updates/v1_59) ဒါမှမဟုတ် [insiders](https://code.visualstudio.com/insiders/) ဗားရှင်းအသစ်တစ်ခုကို သုံးနေဖို့ သေချာပါစေ။ Visual Studio Code ရဲ့ settings တွေမှာ inlay hints တွေကို ဘယ်အချိန် ဘယ်နေရာမှာ ပြသမလဲဆိုတာကိုလည်း ပြင်ဆင်နိုင်ပါတယ်။

## Auto-Imports Show True Paths in Completion Lists (Completion List များတွင် Auto-Import များက စစ်မှန်သော Path များကို ပြသခြင်း)

Visual Studio Code လို editors တွေက completion list တစ်ခုကို ပြတဲ့အခါ — auto-imports တွေ ပါဝင်တဲ့ completions တွေကို ပေးထားတဲ့ module ဆီ ညွှန်တဲ့ path တစ်ခုနဲ့ ပြသပါတယ်; ဒါပေမယ့် — ဒီ path က TypeScript က module specifier တစ်ခုထဲမှာ နောက်ဆုံး ထည့်လိုက်တဲ့အရာ မဟုတ်တတ်ပါဘူး။ Path က အများအားဖြင့် _workspace_ နဲ့ ဆက်စပ်တဲ့ (relative) တစ်ခုခု ဖြစ်တတ်ပါတယ် — ဆိုလိုတာက `moment` လို package တစ်ခုကနေ import လုပ်နေရင် — `node_modules/moment` လို path တစ်ခုကို မကြာခဏ တွေ့ရမှာ ဖြစ်ပါတယ်။

!['node_modules' ပါဝင်တဲ့ ကိုင်တွယ်ရခက်တဲ့ paths တွေ ပါတဲ့ completion list — ဥပမာ 'calendarFormat' ရဲ့ label က 'moment' အစား 'node_modules/moment/moment' ဖြစ်နေပုံ](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/08/completion-import-labels-pre-4-4.png)

ဒီ paths တွေက ကိုင်တွယ်ရခက်ပြီး မကြာခဏ လှည့်ဖြားမှုတွေ ဖြစ်စေပါတယ် — အထူးသဖြင့် မင်းရဲ့ file ထဲကို တကယ် ထည့်သွင်းလိုက်တဲ့ path က Node ရဲ့ `node_modules` resolution, path mappings, symlinks နဲ့ re-exports တွေကို ထည့်သွင်း စဉ်းစားဖို့ လိုနေလို့ပါ။

ဒါကြောင့်ပဲ TypeScript 4.4 မှာ — completion item ရဲ့ label က အခု import အတွက် တကယ်သုံးမယ့် _အမှန်တကယ်ရှိတဲ့_ module path ကို ပြသပါတယ်!

![ကြားထဲမှာ 'node_modules' မပါတဲ့ သန့်ရှင်းတဲ့ paths တွေ ပါတဲ့ completion list — ဥပမာ 'calendarFormat' ရဲ့ label က 'node_modules/moment/moment' အစား 'moment' ဖြစ်နေပုံ](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/08/completion-import-labels-4-4.png)

ဒီတွက်ချက်မှုက ဈေးကြီးတာမို့ — auto-imports အများကြီး ပါတဲ့ completion lists တွေက — မင်း စာလုံးတွေ ပိုရိုက်လာတာနဲ့အမျှ — နောက်ဆုံး module specifiers တွေကို batch အလိုက် ဖြည့်ပေးနိုင်ပါတယ်။ တစ်ခါတလေ ဟောင်းနေတဲ့ workspace-relative path labels တွေကို ဆက်မြင်နေရဦးမယ့် အလားအလာလည်း ရှိပါတယ်; ဒါပေမယ့် — မင်းရဲ့ editing အတွေ့အကြုံက "warm up" ဖြစ်လာတာနဲ့ — နောက်ထပ် keystroke တစ်ခု ဒါမှမဟုတ် နှစ်ခုအတွင်းမှာ ၎င်းတို့ကို တကယ့် path တွေနဲ့ အစားထိုးသွားမှာ ဖြစ်ပါတယ်။

## Breaking Changes (Breaking Change များ)

### `lib.d.ts` Changes for TypeScript 4.4 (TypeScript 4.4 အတွက် `lib.d.ts` အပြောင်းအလဲများ)

TypeScript ဗားရှင်းတိုင်းမှာ ဖြစ်သလိုပဲ — `lib.d.ts` အတွက် declarations တွေ (အထူးသဖြင့် web contexts တွေအတွက် ထုတ်ပေးတဲ့ declarations တွေ) ပြောင်းလဲသွားပါတယ်။ ဘာတွေ ထိခိုက်လဲဆိုတာ နားလည်ဖို့ — [ကျွန်တော်တို့ သိထားတဲ့ `lib.dom.d.ts` အပြောင်းအလဲများ စာရင်း](https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1029#issuecomment-869224737) ကို ကြည့်ရှုနိုင်ပါတယ်။

### More-Compliant Indirect Calls for Imported Functions (Imported Function များအတွက် ပိုမို Compliant ဖြစ်သော Indirect Call များ)

TypeScript ရဲ့ အစောပိုင်း ဗားရှင်းတွေမှာ — CommonJS, AMD နဲ့ တခြား non-ES module systems တွေကနေ import လုပ်ထားတဲ့ function တစ်ခုကို ခေါ်တဲ့အခါ — ခေါ်လိုက်တဲ့ function ရဲ့ `this` value ကို သတ်မှတ်ပေးလိုက်ပါတယ်။ အထူးသဖြင့် — အောက်က ဥပမာမှာ `fooModule.foo()` ကို ခေါ်တဲ့အခါ — `foo()` method ရဲ့ `this` တန်ဖိုးအဖြစ် `fooModule` ကို ထားပေးပါတယ်။

```ts
// Imagine this is our imported module, and it has an export named 'foo'.
let fooModule = {
  foo() {
    console.log(this);
  },
};

fooModule.foo();
```

ဒါက — ECMAScript မှာ exported functions တွေကို ခေါ်တဲ့အခါ အလုပ်လုပ်သင့်တဲ့ နည်းလမ်း မဟုတ်ပါဘူး။ ဒါကြောင့်ပဲ TypeScript 4.4 က imported functions တွေကို ခေါ်တဲ့အခါ — အောက်က emit ကို သုံးပြီး — `this` value ကို ရည်ရွယ်ချက်ရှိရှိ စွန့်ပစ်လိုက်ပါတယ်။

```ts
// Imagine this is our imported module, and it has an export named 'foo'.
let fooModule = {
  foo() {
    console.log(this);
  },
};

// Notice we're actually calling '(0, fooModule.foo)' now, which is subtly different.
(0, fooModule.foo)();
```

[ဒီအပြောင်းအလဲတွေအကြောင်း ဒီမှာ ထပ်ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/44624)။

### Using `unknown` in Catch Variables (Catch Variable များတွင် `unknown` သုံးခြင်း)

[`strict`](https://www.typescriptlang.org/tsconfig#strict) flag နဲ့ run နေတဲ့ user တွေက — `catch` variables တွေ `unknown` ဖြစ်နေတာနဲ့ ပတ်သက်တဲ့ errors အသစ်တွေကို မြင်ရနိုင်ပါတယ် — အထူးသဖြင့် ရှိပြီးသား code က `Error` values တွေပဲ ဖမ်းမိတယ်လို့ ယူဆထားရင် ပိုဖြစ်တတ်ပါတယ်။ ဒါက ဒီလို error messages တွေကို မကြာခဏ ဖြစ်ပေါ်စေပါတယ်:

```
Property 'message' does not exist on type 'unknown'.
Property 'name' does not exist on type 'unknown'.
Property 'stack' does not exist on type 'unknown'.
```

ဒါကို ရှောင်ရှားဖို့ — thrown type က မင်း မျှော်လင့်ထားတဲ့ type နဲ့ ကိုက်ညီကြောင်း သေချာအောင် runtime checks တွေကို အထူးသဖြင့် ထည့်နိုင်ပါတယ်။ ဒါမှမဟုတ် — type assertion တစ်ခုကို သုံးတာ၊ မင်းရဲ့ catch variable ကို `: any` ရှင်းရှင်းလင်းလင်း ထည့်တာ၊ ဒါမှမဟုတ် [`useUnknownInCatchVariables`](https://www.typescriptlang.org/tsconfig#useUnknownInCatchVariables) ကို ပိတ်ထားတာမျိုး လုပ်နိုင်ပါတယ်။

### Broader Always-Truthy Promise Checks (Always-Truthy Promise Check များ ပိုကျယ်ပြန့်လာခြင်း)

အရင် ဗားရှင်းတွေမှာ — TypeScript က `await` တစ်ခုကို မေ့ထားခဲ့နိုင်တဲ့ code တွေကို ဖမ်းယူဖို့ "Always Truthy Promise checks" တွေကို မိတ်ဆက်ခဲ့ပါတယ်; ဒါပေမယ့် — ဒီ checks တွေက named declarations တွေအတွက်ပဲ အသုံးချခဲ့ပါတယ်။ ဆိုလိုတာက — အောက်က code က error တစ်ခုကို မှန်မှန်ကန်ကန် ရမှာ ဖြစ်ပေမယ့်...

```ts
async function foo(): Promise<boolean> {
  return false;
}

async function bar(): Promise<string> {
  const fooResult = foo();
  if (fooResult) {
    // <- error! :D
    return "true";
  }
  return "false";
}
```

...အောက်က code ကတော့ မရခဲ့ပါဘူး။

```ts
async function foo(): Promise<boolean> {
  return false;
}

async function bar(): Promise<string> {
  if (foo()) {
    // <- no error :(
    return "true";
  }
  return "false";
}
```

TypeScript 4.4 က အခု နှစ်ခုလုံးကို flag တက်စေပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် — [မူရင်း အပြောင်းအလဲအကြောင်း ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/44491)။

### Abstract Properties Do Not Allow Initializers (Abstract Property များတွင် Initializer များ ခွင့်မပြုခြင်း)

Abstract properties တွေမှာ initializers တွေ မပါနိုင်တာမို့ — အောက်က code က အခု error တစ်ခု ဖြစ်ပါတယ်:

```ts
abstract class C {
  abstract prop = 1;
  //       ~~~~
  // Property 'prop' cannot have an initializer because it is marked abstract.
}
```

အဲဒီအစား — property အတွက် type တစ်ခုကိုပဲ သတ်မှတ်လို့ ရပါတယ်:

```ts
abstract class C {
  abstract prop: number;
}
```
