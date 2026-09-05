---
title: "TypeScript 5.5 (TypeScript 5.5 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 5.5 ရဲ့ ထုတ်ပြန်မှုမှတ်စု — inferred type predicates, constant indexed access narrowing, JSDoc `@import`, regular expression syntax checking, ECMAScript `Set` methods အသစ်များ, `isolatedDeclarations`, `${configDir}`, editor/watch-mode reliability, performance တိုးတက်မှုတွေနဲ့ notable behavioral changes အကြောင်း"
order: 95
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html"
status: translated
updated: 2026-09-05
---

## Inferred Type Predicates (Type Predicate များကို Inference ပြုလုပ်ခြင်း)

*ဒီ section ကို [Dan Vanderkam](https://github.com/danvk) က ရေးသားခဲ့ပြီး — သူက ဒီ feature ကို [TypeScript 5.5 မှာ implement လုပ်ပေးခဲ့ပါတယ်](https://github.com/microsoft/TypeScript/pull/57465)။ Dan ကို ကျေးဇူးတင်ပါတယ်!*

TypeScript ရဲ့ control flow analysis က — variable တစ်ခုရဲ့ type က သင့် code ထဲ ဖြတ်သန်းရွေ့လျားလာတာနဲ့အမျှ ဘယ်လို ပြောင်းလဲသွားလဲဆိုတာကို ခြေရာခံတာမှာ အတော်လေး ကောင်းမွန်စွာ လုပ်ဆောင်ပေးပါတယ်:

```tsx
interface Bird {
    commonName: string;
    scientificName: string;
    sing(): void;
}

// Maps country names -> national bird.
// Not all nations have official birds (looking at you, Canada!)
declare const nationalBirds: Map<string, Bird>;

function makeNationalBirdCall(country: string) {
  const bird = nationalBirds.get(country);  // bird has a declared type of Bird | undefined
  if (bird) {
    bird.sing();  // bird has type Bird inside the if statement
  } else {
    // bird has type undefined here.
  }
}
```

`undefined` case ကို ကိုင်တွယ်စေခြင်းအားဖြင့် — TypeScript က ပိုမို ခိုင်မာတဲ့ (robust) code တွေ ရေးဖို့ သင့်ကို တွန်းအားပေးပါတယ်။

အရင်တုန်းကတော့ — ဒီလို type refinement (type ကို ပိုမိုတိကျအောင် သန့်စင်ခြင်း) မျိုးကို arrays တွေအပေါ်မှာ အသုံးချဖို့ ပိုပြီး ခက်ခဲပါတယ်။ အောက်ပါဟာမျိုးက TypeScript ရဲ့ ယခင် ဗားရှင်းတွေအားလုံးမှာ error တစ်ခု ဖြစ်ခဲ့မှာပါ:

```tsx
function makeBirdCalls(countries: string[]) {
  // birds: (Bird | undefined)[]
  const birds = countries
    .map(country => nationalBirds.get(country))
    .filter(bird => bird !== undefined);

  for (const bird of birds) {
    bird.sing();  // error: 'bird' is possibly 'undefined'.
  }
}
```

ဒီ code က လုံးဝ အဆင်ပြေပါတယ်: ကျွန်တော်တို့က list ထဲက `undefined` တန်ဖိုးတွေ အားလုံးကို filter ထုတ်ပစ်ထားပြီးသားပါ။
ဒါပေမယ့် TypeScript က ဒါကို လိုက်နားလည်နိုင်စွမ်း မရှိခဲ့ပါဘူး။

TypeScript 5.5 နဲ့ဆိုရင် — type checker က ဒီ code ကို လက်ခံပါတယ်:

```tsx
function makeBirdCalls(countries: string[]) {
  // birds: Bird[]
  const birds = countries
    .map(country => nationalBirds.get(country))
    .filter(bird => bird !== undefined);

  for (const bird of birds) {
    bird.sing();  // ok!
  }
}
```

`birds` အတွက် ပိုပြီး တိကျတဲ့ type ကို သတိပြုပါ။

ဒါက အလုပ်လုပ်တာက — TypeScript က `filter` function အတွက် [type predicate](/docs/typescript/narrowing) တစ်ခုကို ယခုဆို infer (ခန့်မှန်း) လုပ်လို့ပါ။
ဒါကို သီးခြား function တစ်ခုအဖြစ် ထုတ်လိုက်ရင် — ဘာတွေ ဖြစ်နေလဲဆိုတာ ပိုပြီး ရှင်းရှင်းလင်းလင်း မြင်နိုင်ပါတယ်:

```tsx
// function isBirdReal(bird: Bird | undefined): bird is Bird
function isBirdReal(bird: Bird | undefined) {
  return bird !== undefined;
}
```

`bird is Bird` ဆိုတာ type predicate ပါ။
ဆိုလိုတာက — function က `true` ပြန်ပေးရင် အဲဒါက `Bird` တစ်ခု ဖြစ်ပြီး — (function က `false` ပြန်ပေးရင်တော့ `undefined` ဖြစ်ပါတယ်)။
`Array.prototype.filter` အတွက် type declarations တွေက type predicates တွေအကြောင်း သိထားတာမို့ — နောက်ဆုံး ရလဒ်အနေနဲ့ ပိုပြီး တိကျတဲ့ type တစ်ခု ရရှိပြီး — code က type checker ကို အောင်မြင်စွာ ဖြတ်သန်းသွားပါတယ်။

အောက်ပါ အခြေအနေတွေ ပြည့်စုံနေရင် — TypeScript က function တစ်ခုက type predicate တစ်ခုကို ပြန်ပေးတယ်လို့ infer လုပ်ပါလိမ့်မယ်:

1. Function မှာ explicit return type ဒါမှမဟုတ် type predicate annotation မပါရပါဘူး။
2. Function မှာ `return` statement တစ်ခုတည်းသာ ရှိပြီး — implicit returns တွေ မရှိရပါဘူး။
3. Function က သူ့ရဲ့ parameter ကို mutate (ပြောင်းလဲ) မလုပ်ရပါဘူး။
4. Function က parameter ပေါ်က refinement တစ်ခုနဲ့ ချိတ်ဆက်ထားတဲ့ `boolean` expression တစ်ခုကို ပြန်ပေးရပါတယ်။

ယေဘုယျအားဖြင့် ဒါက သင်မျှော်လင့်ထားတဲ့အတိုင်းပဲ အလုပ်လုပ်ပါတယ်။
Inferred type predicates တွေရဲ့ ဥပမာ နောက်ထပ် အနည်းငယ် ဒီမှာ ကြည့်ရအောင်:

```tsx
// const isNumber: (x: unknown) => x is number
const isNumber = (x: unknown) => typeof x === 'number';

// const isNonNullish: <T>(x: T) => x is NonNullable<T>
const isNonNullish = <T,>(x: T) => x != null;
```

အရင်က TypeScript က ဒီ function တွေက `boolean` ပြန်ပေးတယ်လို့ပဲ infer လုပ်ခဲ့မှာပါ။
ယခုဆို `x is number` ဒါမှမဟုတ် `x is NonNullable<T>` လို type predicates တွေပါတဲ့ signatures တွေကို infer လုပ်ပါတယ်။

Type predicates တွေမှာ "if and only if" (မှန်လျှင်သာ မှန်) ဆိုတဲ့ semantics ရှိပါတယ်။
Function တစ်ခုက `x is T` ပြန်ပေးရင် — ဆိုလိုတာက:

1. Function က `true` ပြန်ပေးရင် `x` မှာ `T` type ရှိပါတယ်။
2. Function က `false` ပြန်ပေးရင် `x` မှာ `T` type *မရှိ*ပါဘူး။

Type predicate တစ်ခုကို infer လုပ်ပေးမယ်လို့ မျှော်လင့်ထားပေမယ့် မရလာဘူးဆိုရင် — ဒုတိယ စည်းမျဉ်းကို ချိုးဖောက်မိနေတာ ဖြစ်နိုင်ပါတယ်။ ဒါက "truthiness" (တန်ဖိုးရှိ/မရှိ) စစ်ဆေးမှုတွေနဲ့ မကြာခဏ ကြုံရတတ်ပါတယ်:

```tsx
function getClassroomAverage(students: string[], allScores: Map<string, number>) {
  const studentScores = students
    .map(student => allScores.get(student))
    .filter(score => !!score);

  return studentScores.reduce((a, b) => a + b) / studentScores.length;
  //     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // error: Object is possibly 'undefined'.
}
```

TypeScript က `score => !!score` အတွက် type predicate တစ်ခုကို infer မလုပ်ခဲ့ပါဘူး — ဒါကလည်း မှန်ကန်ပါတယ်: ဒါက `true` ပြန်ပေးရင် `score` က `number` တစ်ခုပါ။
ဒါပေမယ့် `false` ပြန်ပေးရင်တော့ — `score` က `undefined` ဒါမှမဟုတ် `number` (အတိအကျဆိုရင် `0`) ဖြစ်နိုင်ပါတယ်။
ဒါက တကယ့် bug တစ်ခုပါ: ကျောင်းသားတစ်ယောက်ယောက်က စာမေးပွဲမှာ သုည ရခဲ့ရင် — သူတို့ရဲ့ score ကို filter ထုတ်လိုက်တာက ပျမ်းမျှ (average) ကို အပေါ်ကို စောင်းစေပါလိမ့်မယ်။
ပျမ်းမျှအထက် ရောက်သူတွေ နည်းသွားပြီး — စိတ်မကောင်းဖွယ်ရာတွေ များလာပါလိမ့်မယ်!

ပထမ ဥပမာမှာလိုပဲ — `undefined` တန်ဖိုးတွေကို ရှင်းရှင်းလင်းလင်း (explicitly) filter ထုတ်တာက ပိုကောင်းပါတယ်:

```tsx
function getClassroomAverage(students: string[], allScores: Map<string, number>) {
  const studentScores = students
    .map(student => allScores.get(student))
    .filter(score => score !== undefined);

  return studentScores.reduce((a, b) => a + b) / studentScores.length;  // ok!
}
```

Object types တွေအတွက်တော့ — မရေမရာ ဖြစ်စရာ မရှိတာမို့ — truthiness check က type predicate တစ်ခုကို *ဖြစ်ဖြစ်* infer လုပ်ပါလိမ့်မယ်။
Inferred type predicate တစ်ခုရဲ့ ကိုယ်စားလှယ်လောင်း (candidate) ဖြစ်ဖို့ — function တွေက `boolean` ပြန်ပေးရမယ်ဆိုတာ သတိရပါ: `x => !!x` က type predicate တစ်ခုကို infer လုပ်နိုင်ပေမယ့် — `x => x` ကတော့ ဘယ်တော့မှ မလုပ်နိုင်ပါဘူး။

Explicit type predicates တွေကတော့ အရင်ကလိုပဲ အတိအကျ ဆက်လက် အလုပ်လုပ်ပါတယ်။
TypeScript က — သူက type predicate တစ်ခုတည်းကိုပဲ infer လုပ်မလားဆိုတာကို မစစ်ဆေးပါဘူး။
Explicit type predicates ("is") တွေက type assertion ("as") တစ်ခုထက် ပိုပြီး လုံခြုံတာ မဟုတ်ပါဘူး။

TypeScript က သင်လိုချင်တာထက် ပိုပြီး တိကျတဲ့ type တစ်ခုကို ယခုဆို infer လုပ်လာရင် — ဒီ feature က ရှိပြီးသား code တွေကို ပျက်စေနိုင်ပါတယ်။ ဥပမာ:

```tsx
// Previously, nums: (number | null)[]
// Now, nums: number[]
const nums = [1, 2, 3, null, 5].filter(x => x !== null);

nums.push(null);  // ok in TS 5.4, error in TS 5.5
```

ဖြေရှင်းနည်းကတော့ — explicit type annotation တစ်ခုသုံးပြီး သင်လိုချင်တဲ့ type ကို TypeScript ကို ပြောပြလိုက်တာပါ:

```tsx
const nums: (number | null)[] = [1, 2, 3, null, 5].filter(x => x !== null);
nums.push(null);  // ok in all versions
```

နောက်ထပ် အချက်အလက်တွေအတွက် — [implementing pull request](https://github.com/microsoft/TypeScript/pull/57465) နဲ့ [Dan ရဲ့ ဒီ feature ကို implement လုပ်ခဲ့ပုံအကြောင်း blog post](https://effectivetypescript.com/2024/04/16/inferring-a-type-predicate/) ကို ကြည့်ပါ။

## Control Flow Narrowing for Constant Indexed Accesses (Constant Indexed Access များအတွက် Control Flow Narrowing)

`obj` ရော `key` ပါ ထိရောက်စွာ constant (ပြောင်းလဲမှုမရှိ) ဖြစ်နေတဲ့အခါ — `obj[key]` ပုံစံရှိတဲ့ expressions တွေကို TypeScript က ယခုဆို narrow လုပ်နိုင်ပါပြီ။

```ts
function f1(obj: Record<string, unknown>, key: string) {
    if (typeof obj[key] === "string") {
        // Now okay, previously was error
        obj[key].toUpperCase();
    }
}
```

အပေါ်က ဥပမာမှာ — `obj` ရော `key` ပါ ဘယ်တော့မှ mutate မလုပ်ပါဘူး — ဒါကြောင့် `typeof` check ပြီးနောက် TypeScript က `obj[key]` ရဲ့ type ကို `string` အဖြစ် narrow လုပ်နိုင်ပါတယ်။
နောက်ထပ် အချက်အလက်အတွက် — [implementing pull request ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/57847)။

## The JSDoc `@import` Tag (JSDoc `@import` Tag အကြောင်း)

ယနေ့ခေတ်မှာ — JavaScript file တစ်ခုထဲမှာ type-checking အတွက်သာ တစ်ခုခုကို import လုပ်ချင်ရင် — အတော်လေး ခက်ခဲပါတယ်။
JavaScript developer တွေက runtime မှာ မရှိတဲ့ `SomeType` ဆိုတဲ့ type တစ်ခုကို ရိုးရိုးရှင်းရှင်း import လုပ်လို့ မရပါဘူး။

```js
// ./some-module.d.ts
export interface SomeType {
    // ...
}

// ./index.js
import { SomeType } from "./some-module"; // ❌ runtime error!

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

`SomeType` က runtime မှာ မရှိတာမို့ — import က မအောင်မြင်ပါဘူး။
Developer တွေက အဲဒီအစား namespace import တစ်ခုကို သုံးနိုင်ပါတယ်။

```js
import * as someModule from "./some-module";

/**
 * @param {someModule.SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

ဒါပေမယ့် `./some-module` က runtime မှာ ဆက်ပြီး import လုပ်ခံနေရပါသေးတယ် — ဒါကလည်း နှစ်လိုဖွယ် မကောင်းနိုင်ပါဘူး။

ဒါကို ရှောင်ဖို့ — developer တွေက ပုံမှန်အားဖြင့် JSDoc comments တွေထဲမှာ `import(...)` types တွေကို သုံးခဲ့ရပါတယ်။

```js
/**
 * @param {import("./some-module").SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

Type တစ်ခုတည်းကို နေရာအများအပြားမှာ ပြန်သုံးချင်ရင် — import ကို ထပ်ခါထပ်ခါ ရေးနေစရာ မလိုအောင် `typedef` တစ်ခုကို သုံးနိုင်ပါတယ်။

```js
/**
 * @typedef {import("./some-module").SomeType} SomeType
 */

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

ဒါက `SomeType` ကို ဒေသအလိုက် (local) သုံးတာတွေအတွက်တော့ အထောက်အကူ ဖြစ်ပေမယ့် — import တွေ များလာတာနဲ့အမျှ ထပ်ခါထပ်ခါ ဖြစ်လာပြီး — နည်းနည်း ရှည်လျားလာနိုင်ပါတယ်။

ဒါကြောင့်မို့ TypeScript က ECMAScript imports တွေနဲ့ syntax တူညီတဲ့ `@import` comment tag အသစ်တစ်ခုကို ယခုဆို ပံ့ပိုးပေးပါတယ်။

```js
/** @import { SomeType } from "some-module" */

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

ဒီမှာ — ကျွန်တော်တို့က named imports တွေကို သုံးထားပါတယ်။
ကျွန်တော်တို့ရဲ့ import ကို namespace import တစ်ခုအနေနဲ့လည်း ရေးနိုင်ခဲ့ပါတယ်။

```js
/** @import * as someModule from "some-module" */

/**
 * @param {someModule.SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

ဒါတွေက JSDoc comments တွေသက်သက် ဖြစ်လို့ — runtime အပြုအမူကို လုံးဝ မထိခိုက်ပါဘူး။

[Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ကို ကျေးဇူးတင်ကြောင်း ပြောကြားလိုပါတယ် — သူက ဒီ [ပြောင်းလဲမှု](https://github.com/microsoft/TypeScript/pull/57207) ကို ပံ့ပိုးပေးခဲ့လို့ပါ!

## Regular Expression Syntax Checking (Regular Expression Syntax စစ်ဆေးခြင်း)

အခုထိ အချိန်အထိ — TypeScript က code ထဲက regular expressions အများစုကို ပုံမှန်အားဖြင့် ကျော်လွှားသွားလေ့ ရှိပါတယ်။
ဒါက — regular expressions တွေမှာ နည်းပညာအရ extensible grammar (တိုးချဲ့နိုင်သော သဒ္ဒါ) ရှိနေပြီး — TypeScript က regular expressions တွေကို JavaScript ဗားရှင်းအဟောင်းတွေဆီ compile လုပ်ဖို့ ဘယ်တော့မှ ကြိုးစားခဲ့တာ မဟုတ်လို့ပါ။
ဒါပေမယ့် ဒါက — regular expressions တွေထဲမှာ ဖြစ်လေ့ရှိတဲ့ ပြဿနာ အများအပြားကို မတွေ့ရှိနိုင်ဘဲ ဖြစ်နေစေပြီး — သူတို့က runtime မှာ error တွေ ဖြစ်သွားတာပဲဖြစ်ဖြစ် — တိတ်တဆိတ် ကျရှုံးသွားတာပဲဖြစ်ဖြစ် ဆိုတဲ့ အဓိပ္ပာယ် သက်ရောက်ခဲ့ပါတယ်။

ဒါပေမယ့် TypeScript က regular expressions တွေအပေါ် အခြေခံ syntax စစ်ဆေးမှုတွေကို ယခုဆို လုပ်ဆောင်ပါတယ်!

```ts
let myRegex = /@robot(\s+(please|immediately)))? do some task/;
//                                            ~
// error!
// Unexpected ')'. Did you mean to escape it with backslash?
```

ဒါက ရိုးရှင်းတဲ့ ဥပမာတစ်ခုပါ — ဒါပေမယ့် ဒီစစ်ဆေးမှုက ဖြစ်လေ့ရှိတဲ့ အမှားတွေ အများကြီးကို ဖမ်းမိနိုင်ပါတယ်။
တကယ်တော့ — TypeScript ရဲ့ စစ်ဆေးမှုက syntactic checks တွေထက်ကို နည်းနည်း ကျော်လွန်ပါတယ်။
ဥပမာ — TypeScript က မရှိတဲ့ backreferences တွေနဲ့ ပတ်သက်တဲ့ ပြဿနာတွေကို ယခုဆို ဖမ်းမိနိုင်ပါတယ်။

```ts
let myRegex = /@typedef \{import\((.+)\)\.([a-zA-Z_]+)\} \3/u;
//                                                        ~
// error!
// This backreference refers to a group that does not exist.
// There are only 2 capturing groups in this regular expression.
```

နာမည်ပေးထားတဲ့ (named) capturing groups တွေအတွက်လည်း အလားတူပဲ အကျုံးဝင်ပါတယ်။

```ts
let myRegex = /@typedef \{import\((?<importPath>.+)\)\.(?<importedEntity>[a-zA-Z_]+)\} \k<namedImport>/;
//                                                                                        ~~~~~~~~~~~
// error!
// There is no capturing group named 'namedImport' in this regular expression.
```

TypeScript ရဲ့ စစ်ဆေးမှုက — သင့် target ECMAScript ဗားရှင်းထက် အသစ်ကျတဲ့ RegExp feature တစ်ချို့ကို သုံးနေတဲ့အခါမျိုးကိုလည်း ယခုဆို သတိပြုမိပါတယ်။
ဥပမာ — ES5 target တစ်ခုမှာ အပေါ်ကလို named capturing groups တွေကို သုံးရင် — error တစ်ခု ရပါလိမ့်မယ်။

```ts
let myRegex = /@typedef \{import\((?<importPath>.+)\)\.(?<importedEntity>[a-zA-Z_]+)\} \k<importedEntity>/;
//                                  ~~~~~~~~~~~~         ~~~~~~~~~~~~~~~~
// error!
// Named capturing groups are only available when targeting 'ES2018' or later.
```

အချို့သော regular expression flags တွေအတွက်လည်း အလားတူပဲ သက်ရောက်ပါတယ်။

TypeScript ရဲ့ regular expression ပံ့ပိုးမှုက regular expression *literals* တွေပေါ်မှာသာ ကန့်သတ်ထားတာ သတိပြုပါ။
`new RegExp` ကို string literal တစ်ခုနဲ့ ခေါ်ဖို့ ကြိုးစားရင် — TypeScript က ပေးလိုက်တဲ့ string ကို စစ်ဆေးပေးမှာ မဟုတ်ပါဘူး။

[GitHub user graphemecluster](https://github.com/graphemecluster/) ကို ကျေးဇူးတင်ကြောင်း ပြောကြားလိုပါတယ် — သူက ဒီ [feature ကို TypeScript ထဲ ရောက်အောင်](https://github.com/microsoft/TypeScript/pull/55600) ကျွန်တော်တို့နဲ့အတူ အများကြီး ထပ်ခါထပ်ခါ လုပ်ဆောင်ပေးခဲ့လို့ပါ။

## Support for New ECMAScript `Set` Methods (ECMAScript `Set` Methods အသစ်များအတွက် ပံ့ပိုးမှု)

TypeScript 5.5 က [ECMAScript `Set` type အတွက် အဆိုပြုထားသော (proposed) methods အသစ်များ](https://github.com/tc39/proposal-set-methods) ကို ကြေညာပါတယ်။

ဒီ methods တွေထဲက — `union`, `intersection`, `difference` နဲ့ `symmetricDifference` လိုဟာတွေက — တခြား `Set` တစ်ခုကို ယူပြီး — ရလဒ်အဖြစ် `Set` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။
ကျန်တဲ့ methods တွေဖြစ်တဲ့ `isSubsetOf`, `isSupersetOf` နဲ့ `isDisjointFrom` တွေကတော့ — တခြား `Set` တစ်ခုကို ယူပြီး `boolean` တစ်ခုကို ပြန်ပေးပါတယ်။
ဒီ methods တွေထဲက ဘယ်ဟာမှ မူရင်း `Set` တွေကို mutate (ပြောင်းလဲ) မလုပ်ပါဘူး။

ဒီ methods တွေကို ဘယ်လို သုံးနိုင်လဲ၊ သူတို့ ဘယ်လို အပြုအမူ ရှိလဲဆိုတဲ့ ဥပမာ အမြန်တစ်ခု ဒီမှာ ကြည့်ရအောင်:

```ts
let fruits = new Set(["apples", "bananas", "pears", "oranges"]);
let applesAndBananas = new Set(["apples", "bananas"]);
let applesAndOranges = new Set(["apples", "oranges"]);
let oranges = new Set(["oranges"]);
let emptySet = new Set();

////
// union
////

// Set(4) {'apples', 'bananas', 'pears', 'oranges'}
console.log(fruits.union(oranges));

// Set(3) {'apples', 'bananas', 'oranges'}
console.log(applesAndBananas.union(oranges));

////
// intersection
////

// Set(2) {'apples', 'bananas'}
console.log(fruits.intersection(applesAndBananas));

// Set(0) {}
console.log(applesAndBananas.intersection(oranges));

// Set(1) {'apples'}
console.log(applesAndBananas.intersection(applesAndOranges));

////
// difference
////

// Set(3) {'apples', 'bananas', 'pears'}
console.log(fruits.difference(oranges));

// Set(2) {'pears', 'oranges'}
console.log(fruits.difference(applesAndBananas));

// Set(1) {'bananas'}
console.log(applesAndBananas.difference(applesAndOranges));

////
// symmetricDifference
////

// Set(2) {'bananas', 'oranges'}
console.log(applesAndBananas.symmetricDifference(applesAndOranges)); // no apples

////
// isDisjointFrom
////

// true
console.log(applesAndBananas.isDisjointFrom(oranges));

// false
console.log(applesAndBananas.isDisjointFrom(applesAndOranges));

// true
console.log(fruits.isDisjointFrom(emptySet));

// true
console.log(emptySet.isDisjointFrom(emptySet));

////
// isSubsetOf
////

// true
console.log(applesAndBananas.isSubsetOf(fruits));

// false
console.log(fruits.isSubsetOf(applesAndBananas));

// false
console.log(applesAndBananas.isSubsetOf(oranges));

// true
console.log(fruits.isSubsetOf(fruits));

// true
console.log(emptySet.isSubsetOf(fruits));

////
// isSupersetOf
////

// true
console.log(fruits.isSupersetOf(applesAndBananas));

// false
console.log(applesAndBananas.isSupersetOf(fruits));

// false
console.log(applesAndBananas.isSupersetOf(oranges));

// true
console.log(fruits.isSupersetOf(fruits));

// false
console.log(emptySet.isSupersetOf(fruits));
```

[Kevin Gibbons](https://github.com/bakkot) ကို ကျေးဇူးတင်ကြောင်း ပြောကြားလိုပါတယ် — သူက ဒီ feature ကို ECMAScript မှာ co-champion လုပ်ပေးရုံတင် မကဘဲ — [TypeScript ထဲမှာ `Set`, `ReadonlySet` နဲ့ `ReadonlySetLike` အတွက် declarations တွေကိုပါ ပံ့ပိုးပေးခဲ့လို့ပါ](https://github.com/microsoft/TypeScript/pull/57230)!

## Isolated Declarations (Isolated Declarations အကြောင်း)

*ဒီ section ကို [Rob Palmer](https://github.com/robpalme) နဲ့ ပူးတွဲ ရေးသားခဲ့ပြီး — သူက isolated declarations ရဲ့ ဒီဇိုင်းကို ပံ့ပိုးပေးခဲ့ပါတယ်။*

Declaration files တွေ (ခေါ် `.d.ts` files) က ရှိပြီးသား libraries နဲ့ modules တွေရဲ့ ပုံသဏ္ဍာန် (shape) ကို TypeScript ကို ဖော်ပြပေးပါတယ်။
ဒီပေါ့ပါးတဲ့ ဖော်ပြချက်က library ရဲ့ type signatures တွေကို ပါဝင်စေပြီး — function bodies လို အကောင်အထည်ဖော်မှု (implementation) အသေးစိတ်တွေကိုတော့ ဖယ်ထုတ်ထားပါတယ်။
သူတို့ကို — TypeScript က library ကိုယ်တိုင်ကို ခွဲခြမ်းစိတ်ဖြာစရာ မလိုဘဲ — သင့်ရဲ့ library အသုံးပြုမှုကို ထိရောက်စွာ စစ်ဆေးနိုင်ဖို့ ထုတ်ဝေထားတာပါ။
Declaration files တွေကို လက်နဲ့ ရေးလို့ ရနိုင်ပေမယ့် — type သတ်မှတ်ထားတဲ့ (typed) code ကို ရေးသားနေသူဆိုရင် — `--declaration` ကိုသုံးပြီး TypeScript ကို source files တွေကနေ အလိုအလျောက် ထုတ်ပေးလိုက်တာက ပိုပြီး လုံခြုံပြီး ပိုရိုးရှင်းပါတယ်။

TypeScript compiler နဲ့ သူ့ရဲ့ APIs တွေက declaration files တွေ ထုတ်လုပ်တဲ့ အလုပ်ကို အမြဲတမ်း လုပ်ဆောင်ခဲ့ပါတယ်;
ဒါပေမယ့် — တခြား tools တွေကို သုံးချင်စရာ၊ ဒါမှမဟုတ် ရိုးရိုး build process က မလိုက်မီနိုင်တဲ့ use-cases တစ်ချို့ ရှိပါတယ်။

### Use-case: Faster Declaration Emit Tools (အသုံးပြုမှုပုံစံ: ပိုမိုမြန်ဆန်သော Declaration Emit Tools)

Declaration files တွေ ထုတ်လုပ်ဖို့ ပိုမြန်တဲ့ tool တစ်ခုကို ဖန်တီးချင်တယ်ဆိုပါစို့ — ဥပမာ publishing service တစ်ခု ဒါမှမဟုတ် bundler အသစ်တစ်ခုရဲ့ အစိတ်အပိုင်းအနေနဲ့ပေါ့။
TypeScript ကို JavaScript အဖြစ် ပြောင်းပေးနိုင်တဲ့ မယုံနိုင်လောက်အောင် မြန်ဆန်တဲ့ tools တွေရဲ့ ထွန်းကားနေတဲ့ ecosystem တစ်ခု ရှိပေမယ့် — TypeScript ကို declaration files အဖြစ် ပြောင်းပေးတာမှာတော့ အဲဒီလို မဟုတ်ပါဘူး။
အကြောင်းကတော့ — TypeScript ရဲ့ inference က types တွေကို ရှင်းရှင်းလင်းလင်း ကြေညာစရာမလိုဘဲ code တွေ ရေးနိုင်စေလို့ — declaration emit က ရှုပ်ထွေးနိုင်ပါတယ်။

import လုပ်ထားတဲ့ variable နှစ်ခုကို ပေါင်းပေးတဲ့ function တစ်ခုရဲ့ ရိုးရှင်းတဲ့ ဥပမာတစ်ခုကို စဉ်းစားကြည့်ရအောင်။

```ts
// util.ts
export let one = "1";
export let two = "2";

// add.ts
import { one, two } from "./util";
export function add() { return one + two; }
```

ကျွန်တော်တို့ လုပ်ချင်တာက `add.d.ts` တစ်ခုကို ထုတ်ပေးရုံပဲ ဖြစ်ရင်တောင် — TypeScript က နောက်ထပ် import လုပ်ထားတဲ့ file တစ်ခု (`util.ts`) ထဲကို စူးစမ်းပြီး — `one` နဲ့ `two` ရဲ့ types တွေက strings တွေလို့ infer လုပ်ကာ — string နှစ်ခုပေါ်မှာ `+` operator က `string` return type တစ်ခုကို ဖြစ်ပေါ်စေမယ်ဆိုတာကို တွက်ချက်ဖို့ လိုအပ်ပါတယ်။

```ts
// add.d.ts
export declare function add(): string;
```

ဒီ inference က developer အတွေ့အကြုံအတွက် အရေးကြီးပေမယ့် — ဆိုလိုတာက declaration files တွေ ထုတ်လုပ်ချင်တဲ့ tools တွေက — inference အပြင် imports တွေကို လိုက်ကြည့်ဖို့ module specifiers တွေကို resolve လုပ်နိုင်စွမ်း အပါအဝင် — type-checker ရဲ့ အစိတ်အပိုင်းတွေကို ပုံတူကူးထားဖို့ လိုအပ်ပါတယ်။

### Use-case: Parallel Declaration Emit and Parallel Checking (အသုံးပြုမှုပုံစံ: Parallel Declaration Emit နှင့် Parallel Checking)

project အများအပြား ပါဝင်တဲ့ monorepo တစ်ခုနဲ့ — သင့် code တွေကို ပိုမြန်အောင် စစ်ဆေးပေးချင်နေတဲ့ multi-core CPU တစ်လုံး ရှိတယ်ဆိုပါစို့။
Project တစ်ခုချင်းစီကို core တစ်ခုစီမှာ run ပြီး — project အားလုံးကို တစ်ချိန်တည်းမှာ စစ်ဆေးနိုင်ရင် ကောင်းလိုက်မလို့နော်!

ကံမကောင်းစရာက — အလုပ်အားလုံးကို parallel လုပ်ဖို့ လွတ်လပ်မှု မရှိပါဘူး။
အကြောင်းကတော့ — project တွေကို dependency အစီအစဉ်အတိုင်း build လုပ်ရလို့ပါ — project တစ်ခုချင်းစီက သူတို့ရဲ့ dependencies တွေရဲ့ declaration files တွေနဲ့ ဆန့်ကျင်ပြီး စစ်ဆေးနေလို့ပါ။
ဒါကြောင့် declaration files တွေ ထုတ်လုပ်ဖို့ dependency ကို အရင် build လုပ်ရပါတယ်။
TypeScript ရဲ့ project references feature ကလည်း — project အစုအဝေးကို "topological" dependency အစီအစဉ်နဲ့ build လုပ်ပြီး — အလားတူပဲ အလုပ်လုပ်ပါတယ်။

ဥပမာတစ်ခုအနေနဲ့ — `backend` နဲ့ `frontend` လို့ခေါ်တဲ့ project နှစ်ခု ရှိပြီး — သူတို့ နှစ်ခုလုံးက `core` လို့ခေါ်တဲ့ project တစ်ခုအပေါ် မှီခိုနေတယ်ဆိုရင် — `core` ကို build လုပ်ပြီး သူ့ရဲ့ declaration files တွေ ထုတ်လုပ်ပြီးမှသာ TypeScript က `frontend` ဒါမှမဟုတ် `backend` ကို type-check စလုပ်နိုင်မှာပါ။

![frontend နဲ့ backend တွေက core ကို ညွှန်ပြနေပြီး — တခြားအရာတွေက အဲဒီထဲက တစ်ခုချင်းစီကို ညွှန်ပြနိုင်တယ်](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2024/04/5-5-beta-isolated-declarations-deps.png)

အပေါ်က ဂရပ်ထဲမှာ — bottleneck (ပိတ်ဆို့နေတဲ့ နေရာ) တစ်ခု ရှိနေတာကို မြင်နိုင်ပါတယ်။
`frontend` နဲ့ `backend` ကို parallel နဲ့ build လုပ်နိုင်ပေမယ့် — တစ်ခုခု စတင်နိုင်ဖို့ `core` က build ပြီးစီးတာကို အရင်စောင့်ရပါတယ်။

ဒါကို ဘယ်လို ပိုကောင်းအောင် လုပ်နိုင်မလဲ?
ကောင်းပြီ — မြန်ဆန်တဲ့ tool တစ်ခုက `core` အတွက် declaration files တွေ အားလုံးကို *parallel* နဲ့ ထုတ်ပေးနိုင်ရင် — TypeScript က အဲဒီနောက် `core`, `frontend` နဲ့ `backend` တွေကိုပါ *parallel* နဲ့ type-check လုပ်ပြီး ချက်ချင်း ဆက်လုပ်နိုင်မှာပါ။

### Solution: Explicit Types! (အဖြေ: Explicit Types!)

Use-case နှစ်ခုလုံးရဲ့ ဘုံလိုအပ်ချက်က — declaration files တွေ ထုတ်လုပ်ဖို့ cross-file type-checker တစ်ခု လိုအပ်တာပါ။
ဒါက tooling အသိုင်းအဝိုင်းကို တောင်းဆိုဖို့ အတော်လေး များပါတယ်။

ပိုရှုပ်ထွေးတဲ့ ဥပမာတစ်ခုအနေနဲ့ — အောက်ပါ code အတွက် declaration file တစ်ခု လိုချင်တယ်ဆိုရင်...

```ts
import { add } from "./add";

const x = add();

export function foo() {
    return x;
}
```

...`foo` အတွက် signature တစ်ခုကို ထုတ်ပေးဖို့ လိုအပ်ပါလိမ့်မယ်။
ကောင်းပြီ — အဲဒါက `foo` ရဲ့ implementation ကို ကြည့်ဖို့ လိုပါတယ်။
`foo` က `x` ကိုပဲ ပြန်ပေးတာမို့ — `x` ရဲ့ type ရဖို့ `add` ရဲ့ implementation ကို ကြည့်ဖို့ လိုအပ်ပါတယ်။
ဒါပေမယ့် အဲဒါက `add` ရဲ့ dependencies တွေရဲ့ implementation တွေကို ကြည့်ဖို့ လိုအပ်စေနိုင်ပြီး — အဲဒီလိုနဲ့ ဆက်သွားနိုင်ပါတယ်။
ဒီမှာ ကျွန်တော်တို့ မြင်နေရတာက — declaration files တွေ ထုတ်လုပ်ဖို့ဆိုတာ — လက်ရှိ file နဲ့ မသက်ဆိုင်တဲ့ နေရာတွေရဲ့ types တွေကို တွက်ဆဖို့ logic အများကြီး လိုအပ်တာပါ။

ဒါပေမယ့် — လျင်မြန်တဲ့ iteration အချိန်တွေနဲ့ အပြည့်အဝ parallel builds တွေကို ရှာဖွေနေတဲ့ developer တွေအတွက်တော့ — ဒီပြဿနာကို တွေးတဲ့ နည်းလမ်း တစ်မျိုး ရှိပါသေးတယ်။
Declaration file တစ်ခုက module တစ်ခုရဲ့ public API ရဲ့ types တွေကိုပဲ လိုအပ်ပါတယ် — တစ်နည်းပြောရရင် export လုပ်ထားတဲ့ အရာတွေရဲ့ types တွေပါ။
အငြင်းပွားစရာ ဖြစ်နိုင်ပေမယ့် — developer တွေက သူတို့ export လုပ်တဲ့ အရာတွေရဲ့ types တွေကို ရှင်းရှင်းလင်းလင်း ရေးချဖို့ ဆန္ဒရှိမယ်ဆိုရင် — tools တွေက module ရဲ့ implementation ကို ကြည့်စရာ မလိုဘဲ — full type-checker တစ်ခုကို ပြန်လည် အကောင်အထည်ဖော်စရာမလိုဘဲ — declaration files တွေကို ထုတ်ပေးနိုင်ပါလိမ့်မယ်။

ဒီနေရာမှာပဲ `--isolatedDeclarations` option အသစ် ဝင်လာပါတယ်။
`--isolatedDeclarations` က — type-checker တစ်ခုမပါဘဲ module တစ်ခုကို စိတ်ချရစွာ ပြောင်းလဲလို့ မရတဲ့အခါ errors တွေကို သတင်းပို့ပါတယ်။
ပိုပြီး ရိုးရိုးရှင်းရှင်း ပြောရရင် — export တွေအပေါ်မှာ လုံလောက်စွာ annotate မလုပ်ထားတဲ့ file တစ်ခု ရှိရင် — TypeScript က errors တွေ သတင်းပို့စေပါတယ်။

ဆိုလိုတာက အပေါ်က ဥပမာမှာ — အောက်ပါအတိုင်း error တစ်ခု တွေ့ရမှာပါ:

```ts
export function foo() {
//              ~~~
// error! Function must have an explicit
// return type annotation with --isolatedDeclarations.
    return x;
}
```

### Why are errors desirable? (Error များသည် အဘယ်ကြောင့် နှစ်လိုဖွယ်ကောင်းသနည်း?)

အကြောင်းကတော့ — ဒါက TypeScript ကို အောက်ပါအတိုင်း လုပ်နိုင်စေလို့ပါ

1. တခြား tools တွေက declaration files တွေ ထုတ်လုပ်ရာမှာ ပြဿနာတွေ ရှိမရှိကို ကြိုတင် (up-front) အသိပေးနိုင်တယ်
2. ပျောက်နေတဲ့ annotations တွေ ထပ်ဖြည့်ဖို့ ကူညီပေးမယ့် quick fix တစ်ခုကို ပေးနိုင်တယ်

ဒါပေမယ့် ဒီ mode က *နေရာတိုင်း*မှာ annotations တွေ မလိုအပ်ပါဘူး။
Locals တွေကတော့ — public API ကို မထိခိုက်လို့ — လျစ်လျူရှုထားနိုင်ပါတယ်။
ဥပမာ — အောက်ပါ code က error တစ်ခုကို **ထုတ်ပေးမှာ မဟုတ်ပါဘူး**:

```ts
import { add } from "./add";

const x = add("1", "2"); // no error on 'x', it's not exported.

export function foo(): string {
    return x;
}
```

ပြီးတော့ type က "trivial" (အလွယ်တကူ) တွက်လို့ရတဲ့ expressions အချို့လည်း ရှိပါသေးတယ်။

```ts
// No error on 'x'.
// It's trivial to calculate the type is 'number'
export let x = 10;

// No error on 'y'.
// We can get the type from the return expression.
export function y() {
    return 20;
}

// No error on 'z'.
// The type assertion makes it clear what the type is.
export function z() {
    return Math.max(x, y()) as number;
}
```

### Using `isolatedDeclarations` (`isolatedDeclarations` ကို အသုံးပြုခြင်း)

`isolatedDeclarations` က `declaration` ဒါမှမဟုတ် `composite` flags တွေထဲက တစ်ခုခုကိုပါ သတ်မှတ်ထားဖို့ လိုအပ်ပါတယ်။

`isolatedDeclarations` က TypeScript ရဲ့ emit လုပ်ပုံကို မပြောင်းလဲဘူးဆိုတာ သတိပြုပါ — errors တွေကို သတင်းပို့ပုံကိုပဲ ပြောင်းလဲတာပါ။
အရေးကြီးတာက — `isolatedModules` နဲ့ ဆင်တူပြီး — TypeScript မှာ ဒီ feature ကို enable လုပ်လိုက်ရုံနဲ့ ဒီမှာ ဆွေးနွေးထားတဲ့ အလားအလာရှိတဲ့ အကျိုးကျေးဇူးတွေ ချက်ချင်း ပေါ်လာမှာ မဟုတ်ပါဘူး။
ဒါကြောင့် စိတ်ရှည်ရှည်ထားပြီး — ဒီနေရာမှာ အနာဂတ် တိုးတက်မှုတွေကို မျှော်လင့်ပေးပါ။
Tool author တွေကို စိတ်ထဲထားရင်း — ဒီနေ့အထိ TypeScript ရဲ့ declaration emit အားလုံးကို — အဲဒါကို လမ်းညွှန်အဖြစ် သုံးချင်တဲ့ တခြား tools တွေက အလွယ်တကူ ပုံတူကူးလို့ မရသေးဘူးဆိုတာကိုလည်း အသိအမှတ်ပြုသင့်ပါတယ်။
ဒါက ကျွန်တော်တို့ တိုးတက်အောင် တက်ကြွစွာ လုပ်ဆောင်နေတဲ့ အရာပါ။

ဒါတွေအပြင် — isolated declarations က feature အသစ်တစ်ခု ဖြစ်နေဆဲဖြစ်ပြီး — အတွေ့အကြုံကို ပိုကောင်းအောင် ကျွန်တော်တို့ တက်ကြွစွာ လုပ်ဆောင်နေပါတယ်။
Classes နဲ့ object literals တွေထဲမှာ computed property declarations တွေ သုံးတာလို အခြေအနေအချို့ကတော့ `isolatedDeclarations` အောက်မှာ *သေချာပေါက်* ပံ့ပိုးမထားသေးပါဘူး။
ဒီနေရာကို စောင့်ကြည့်ထားပြီး — သင့် feedback တွေကို လွတ်လပ်စွာ ပေးပို့နိုင်ပါတယ်။

`isolatedDeclarations` ကို case-by-case အလိုက် လက်ခံကျင့်သုံးသင့်တယ်လို့လည်း ထောက်ပြဖို့ ထိုက်တန်တယ်လို့ ခံစားမိပါတယ်။
`isolatedDeclarations` ကို သုံးတဲ့အခါ developer ergonomics (လွယ်ကူမှု) တစ်ချို့ ဆုံးရှုံးသွားတာမို့ — သင့် setup က အစောပိုင်းမှာ ဖော်ပြခဲ့တဲ့ အခြေအနေ နှစ်ခုကို အသုံးမချဘူးဆိုရင် — ဒါက မှန်ကန်တဲ့ ရွေးချယ်မှု ဖြစ်ချင်မှ ဖြစ်ပါလိမ့်မယ်။
တခြားသူတွေအတွက်ကျတော့ — `isolatedDeclarations` ပေါ်က အလုပ်က parallel build strategy အမျိုးမျိုးကို ဖွင့်ပေးဖို့ optimization နဲ့ အခွင့်အလမ်း တွေ အများကြီးကို ရှာဖွေတွေ့ရှိပြီးသားပါ။
ဒီအတောအတွင်း — အပေးအယူ (trade-off) တွေကို လုပ်ဖို့ ဆန္ဒရှိမယ်ဆိုရင် — external tooling တွေ ပိုပြီး ကျယ်ကျယ်ပြန့်ပြန့် ရနိုင်လာတာနဲ့အမျှ — သင့် build process ကို မြန်ဆန်စေဖို့ `isolatedDeclarations` က အစွမ်းထက်တဲ့ tool တစ်ခု ဖြစ်လာနိုင်တယ်လို့ ကျွန်တော်တို့ ယုံကြည်ပါတယ်။

နောက်ထပ် အချက်အလက်အတွက် — TypeScript issue tracker ပေါ်က [Isolated Declarations: State of the Feature](https://github.com/microsoft/TypeScript/issues/58944) ဆွေးနွေးချက်ကို ဖတ်ကြည့်ပါ။

### Credit (ဂုဏ်ပြုချီးကျူးမှု)

`isolatedDeclarations` ပေါ်က အလုပ်က TypeScript team နဲ့ Bloomberg နဲ့ Google အတွင်းက infrastructure နဲ့ tooling teams တွေကြား ကာလရှည် ပူးပေါင်းဆောင်ရွက်မှုတစ်ခုပါ။
Google က [isolated declaration errors တွေအတွက် quick fix](https://github.com/microsoft/TypeScript/pull/58260) ကို implement လုပ်ပေးခဲ့တဲ့ Hana Joo (အဲဒီအကြောင်း မကြာခင် ပိုပြောပါမယ်) အပြင် — Ashley Claymore, Jan Kühle, Lisa Velden, Rob Palmer နဲ့ Thomas Chetwin တို့လို ပုဂ္ဂိုလ်တွေက လပေါင်းများစွာ ဆွေးနွေးမှု၊ specification နဲ့ implementation တွေမှာ ပါဝင်ပတ်သက်ခဲ့ပါတယ်။
ဒါပေမယ့် — Bloomberg က [Titian Cernicova-Dragomir](https://github.com/dragomirtitian) ပေးအပ်ခဲ့တဲ့ ဧရာမ ပမာဏရှိတဲ့ အလုပ်ကို အထူး ထောက်ပြ ပြောကြားဖို့ ထိုက်တန်တယ်လို့ ခံစားမိပါတယ်။
Titian က `isolatedDeclarations` ရဲ့ implementation ကို မောင်းနှင်ရာမှာ အဓိက တွန်းအား ဖြစ်ခဲ့ပြီး — အဲဒီမတိုင်ခင်နှစ်တွေကတည်းက TypeScript project ကို ပံ့ပိုးပေးခဲ့သူတစ်ဦးလည်း ဖြစ်ပါတယ်။

ဒီ feature မှာ ပြောင်းလဲမှုတွေ အများကြီး ပါဝင်ခဲ့ပေမယ့် — [Isolated Declarations အတွက် အဓိက အလုပ်ကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/58201)။
## The `${configDir}` Template Variable for Configuration Files (Configuration Files များအတွက် `${configDir}` Template Variable)

Codebase အများအပြားမှာ — တခြား configuration files တွေအတွက် "base" တစ်ခုအနေနဲ့ ဆောင်ရွက်တဲ့ shared `tsconfig.json` file တစ်ခုကို ပြန်လည် အသုံးပြုတာ ဖြစ်လေ့ရှိပါတယ်။
ဒါကို `tsconfig.json` file တစ်ခုထဲမှာ `extends` field ကို သုံးပြီး လုပ်ပါတယ်။

```json
{
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
        "outDir": "./dist"
    }
}
```

ဒီနည်းလမ်းရဲ့ ပြဿနာတစ်ခုက — `tsconfig.json` file ထဲက path အားလုံးက file ကိုယ်တိုင် တည်ရှိတဲ့ နေရာနဲ့ ဆက်စပ် (relative) နေတာပါ။
ဆိုလိုတာက — project အများအပြားမှာ သုံးနေတဲ့ shared `tsconfig.base.json` file တစ်ခု ရှိရင် — derived project တွေထဲမှာ relative paths တွေက မကြာခဏ အသုံးမဝင်နိုင်ပါဘူး။
ဥပမာ — အောက်ပါ `tsconfig.base.json` ကို စိတ်ကူးကြည့်ပါ:

```json5
{
    "compilerOptions": {
        "typeRoots": [
            "./node_modules/@types",
            "./custom-types"
        ],
        "outDir": "dist"
    }
}
```

Author ရဲ့ ရည်ရွယ်ချက်က — ဒီ file ကို extend လုပ်တဲ့ `tsconfig.json` တိုင်း

1. derived `tsconfig.json` နဲ့ ဆက်စပ်တဲ့ `dist` directory တစ်ခုဆီ output ထုတ်ပေးတာ၊ နဲ့
1. derived `tsconfig.json` နဲ့ ဆက်စပ်တဲ့ `custom-types` directory တစ်ခု ရှိနေတာ —

ဖြစ်စေချင်တယ်ဆိုရင် — ဒါက အလုပ်မဖြစ်ပါဘူး။
`typeRoots` paths တွေက — ဒါကို extend လုပ်တဲ့ project နဲ့ မဟုတ်ဘဲ — shared `tsconfig.base.json` file ရဲ့ တည်နေရာနဲ့ ဆက်စပ်နေမှာပါ။
ဒီ shared file ကို extend လုပ်တဲ့ project တစ်ခုချင်းစီက — ကိုယ်ပိုင် `outDir` နဲ့ `typeRoots` တွေကို ပါဝင်မှုတူညီစွာ ကြေညာထားဖို့ လိုပါလိမ့်မယ်။
ဒါက စိတ်ပျက်စရာ ကောင်းနိုင်ပြီး — project တွေကြားမှာ ထပ်တူညီအောင် ထိန်းသိမ်းဖို့လည်း ခက်ခဲနိုင်ပါတယ် — အပေါ်က ဥပမာက `typeRoots` ကို သုံးနေပေမယ့် — ဒါက `paths` နဲ့ တခြား options တွေအတွက်ပါ ဖြစ်လေ့ရှိတဲ့ ပြဿနာတစ်ခုပါ။

ဒါကို ဖြေရှင်းဖို့ — TypeScript 5.5 က `${configDir}` လို့ခေါ်တဲ့ template variable အသစ်တစ်ခုကို မိတ်ဆက်ပေးပါတယ်။
`tsconfig.json` ဒါမှမဟုတ် `jsconfig.json` file တစ်ခုရဲ့ path fields တစ်ချို့ထဲမှာ `${configDir}` ကို ရေးလိုက်ရင် — ဒီ variable ကို ပေးထားတဲ့ compilation တစ်ခုထဲက configuration file ပါဝင်နေတဲ့ directory (containing directory) နဲ့ အစားထိုးလိုက်ပါတယ်။
ဆိုလိုတာက — အပေါ်က `tsconfig.base.json` ကို အောက်ပါအတိုင်း ပြန်ရေးလို့ ရပါတယ်:

```json5
{
    "compilerOptions": {
        "typeRoots": [
            "${configDir}/node_modules/@types",
            "${configDir}/custom-types"
        ],
        "outDir": "${configDir}/dist"
    }
}
```

ယခုဆို — project တစ်ခုက ဒီ file ကို extend လုပ်တဲ့အခါ — paths တွေက shared `tsconfig.base.json` file နဲ့ မဟုတ်ဘဲ — derived `tsconfig.json` နဲ့ ဆက်စပ်နေမှာပါ။
ဒါက configuration files တွေကို project တွေကြားမှာ မျှဝေဖို့ ပိုလွယ်ကူစေပြီး — configuration files တွေ ပိုပြီး သယ်ဆောင်ရလွယ် (portable) ဖြစ်စေပါတယ်။

`tsconfig.json` file တစ်ခုကို extend လုပ်လို့ရအောင် လုပ်ဖို့ ရည်ရွယ်ထားရင် — `./` တစ်ခုကို `${configDir}` နဲ့ ရေးသင့်သလားဆိုတာ စဉ်းစားကြည့်ပါ။

နောက်ထပ် အချက်အလက်အတွက် — [အဆိုပြုချက် issue](https://github.com/microsoft/TypeScript/issues/57485) နဲ့ [implementing pull request](https://github.com/microsoft/TypeScript/pull/58042) ကို ကြည့်ပါ။

## Consulting `package.json` Dependencies for Declaration File Generation (Declaration File Generation အတွက် `package.json` Dependencies များကို တိုင်ပင်ခြင်း)

အရင်က TypeScript က အောက်ပါလို error message မျိုးကို မကြာခဏ ထုတ်ပြန်လေ့ ရှိပါတယ်

```
The inferred type of "X" cannot be named without a reference to "Y". This is likely not portable. A type annotation is necessary.
```

ဒါက မကြာခဏဆိုသလို — TypeScript ရဲ့ declaration file generation က program တစ်ခုထဲမှာ ဘယ်တော့မှ explicitly import မလုပ်ခဲ့တဲ့ files တွေရဲ့ ပါဝင်မှုတွေထဲမှာ ကိုယ့်ကိုယ်ကိုယ် တွေ့နေလို့ပါ။
အဲဒီလို file တစ်ခုဆီ import တစ်ခု ထုတ်ပေးတာက — path က relative ဖြစ်သွားရင် စွန့်စားစရာ ဖြစ်နိုင်ပါတယ်။
ဒါပေမယ့် — `package.json` တစ်ခုရဲ့ `dependencies` (ဒါမှမဟုတ် `peerDependencies` နဲ့ `optionalDependencies`) ထဲမှာ ရှင်းရှင်းလင်းလင်း dependencies တွေ ရှိတဲ့ codebases တွေအတွက်တော့ — resolution modes အချို့အောက်မှာ အဲဒီလို import တစ်ခု ထုတ်ပေးတာက လုံခြုံသင့်ပါတယ်။
ဒါကြောင့် TypeScript 5.5 မှာ — အဲဒီလို အခြေအနေမျိုးဆိုရင် ကျွန်တော်တို့ ပိုပြီး လျော့ပေါ့ပေးထားပြီး — ဒီ error ရဲ့ ဖြစ်ရပ်တွေ အများအပြား ပျောက်ကွယ်သွားသင့်ပါတယ်။

ဒီပြောင်းလဲမှုရဲ့ အသေးစိတ်အတွက် — [ဒီ pull request ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/issues/42873)။

## Editor and Watch-Mode Reliability Improvements (Editor နှင့် Watch-Mode Reliability မြှင့်တင်မှုများ)

TypeScript က `--watch` mode နဲ့ TypeScript ရဲ့ editor ပေါင်းစပ်မှုကို ပိုပြီး စိတ်ချရစေမယ့် — လုပ်ဆောင်ချက် အသစ်တွေ ထပ်ဖြည့်တာ ဒါမှမဟုတ် ရှိပြီးသား logic တွေကို ပြင်ဆင်တာတွေ လုပ်ထားပါတယ်။
ဒါက TSServer/editor restart တွေ နည်းပါးလာအောင် ဘာသာပြန်ဆိုနိုင်ဖို့ မျှော်လင့်ပါတယ်။

### Correctly Refresh Editor Errors in Configuration Files (Configuration Files များထဲက Editor Errors များကို မှန်ကန်စွာ Refresh ပြုလုပ်ခြင်း)

TypeScript က `tsconfig.json` files တွေအတွက် errors တွေ ထုတ်ပေးနိုင်ပါတယ်;
ဒါပေမယ့် — အဲဒီ errors တွေက တကယ်တော့ project တစ်ခုကို load လုပ်ခြင်းကနေ ထုတ်ပေးတာဖြစ်ပြီး — editors တွေက `tsconfig.json` files တွေအတွက် အဲဒီ errors တွေကို တိုက်ရိုက် မတောင်းဆိုလေ့ ရှိပါဘူး။
ဒါက နည်းပညာပိုင်း အသေးစိတ်တစ်ခုလို ထင်ရပေမယ့် — `tsconfig.json` တစ်ခုထဲမှာ ထုတ်ပေးထားတဲ့ errors တွေ အားလုံး ပြင်ပြီးသွားတဲ့အခါ — TypeScript က errors အလွတ် အစုအသစ်တစ်ခုကို ထုတ်မပေးတာမို့ — အသုံးပြုသူတွေက သူတို့ရဲ့ editor ကို ပြန်မဖွင့်ရင် ခေတ်နောက်ကျနေတဲ့ (stale) errors တွေနဲ့ပဲ ကျန်နေတယ်လို့ ဆိုလိုပါတယ်။

TypeScript 5.5 က ယခုဆို ဒါတွေကို ရှင်းပစ်ဖို့ event တစ်ခုကို ရည်ရွယ်ချက်ရှိရှိ ထုတ်ပြန်ပါတယ်။
[ဒီမှာ နောက်ထပ် ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/58120)။

### Better Handling for Deletes Followed by Immediate Writes (Deletes များနောက်တွင် ချက်ချင်း Writes ပြုလုပ်ခြင်းအတွက် ပိုမိုကောင်းမွန်သော ကိုင်တွယ်မှု)

Files တွေကို overwrite လုပ်မယ့်အစား — tools အချို့က သူတို့ကို ဖျက်ပစ်ပြီး — file အသစ်တွေကို အစကနေ ပြန်ဖန်တီးတာကို ရွေးချယ်ပါတယ်။
ဥပမာ — `npm ci` run လုပ်တဲ့အခါမျိုးမှာ ဒီလိုပါ။

ဒါက အဲဒီ tools တွေအတွက် ထိရောက်နိုင်ပေမယ့် — watched file တစ်ခုကို ဖျက်လိုက်တာက ၎င်းနဲ့ ၎င်းရဲ့ transitive dependencies အားလုံးကို dispose လုပ်ပစ်နိုင်တာမို့ — TypeScript ရဲ့ editor အခြေအနေတွေအတွက်တော့ ပြဿနာ ဖြစ်စေနိုင်ပါတယ်။
File တစ်ခုကို ဖျက်ပြီး ချက်ချင်း ပြန်ဖန်တီးတာက — TypeScript က project တစ်ခုလုံးကို ဖြိုချပြီး — အစကနေ ပြန်တည်ဆောက်စေနိုင်ပါတယ်။

TypeScript 5.5 က ယခုဆို — ဖျက်လိုက်တဲ့ project တစ်ခုရဲ့ အစိတ်အပိုင်းတွေကို — creation event အသစ်တစ်ခုကို မဖမ်းမိမချင်း သိမ်းထားခြင်းအားဖြင့် — ပိုပြီး သိမ်မွေ့တဲ့ (nuanced) ချဉ်းကပ်မှုတစ်ခု ရှိပါတယ်။
ဒါက `npm ci` လို လုပ်ဆောင်ချက်တွေကို TypeScript နဲ့ အများကြီး ပိုကောင်းကောင်း အလုပ်လုပ်စေသင့်ပါတယ်။
[ချဉ်းကပ်မှုအပေါ် နောက်ထပ် အချက်အလက်တွေကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/57492)။

### Symlinks are Tracked in Failed Resolutions (Failed Resolutions များတွင် Symlinks များကို ခြေရာခံခြင်း)

TypeScript က module တစ်ခုကို resolve လုပ်ဖို့ မအောင်မြင်တဲ့အခါ — module ကို နောက်မှ ထပ်ဖြည့်လာနိုင်တာမို့ — မအောင်မြင်ခဲ့တဲ့ lookup paths တွေကို ဆက်ပြီး watch လုပ်ဖို့ လိုအပ်ပါတယ်။
အရင်က ဒါကို symlinked directories တွေအတွက် မလုပ်ခဲ့ပါဘူး — ဒါက project တစ်ခုမှာ build ဖြစ်ခဲ့ပေမယ့် — နောက်တစ်ခုမှာ မြင်မခံရတာမျိုး ဖြစ်တဲ့ monorepo ပုံစံ အခြေအနေတွေမှာ reliability ပြဿနာတွေ ဖြစ်စေနိုင်ပါတယ်။
TypeScript 5.5 မှာ ဒါကို ပြင်ဆင်ထားပြီး — ဆိုလိုတာက သင့် editor ကို မကြာခဏ restart လုပ်စရာ မလိုတော့ပါဘူး။

[ဒီမှာ နောက်ထပ် အချက်အလက်တွေ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/58139)။

### Project References Contribute to Auto-Imports (Project References များသည် Auto-Imports များကို ပံ့ပိုးပေးခြင်း)

Auto-imports တွေက project reference setup တစ်ခုထဲမှာ — မှီခိုတဲ့ projects တွေဆီ explicit import တစ်ခုအနည်းဆုံး ရှိဖို့ မလိုအပ်တော့ပါဘူး။
အဲဒီအစား — သင့် `tsconfig.json` ရဲ့ `references` field ထဲမှာ စာရင်းပြုစုထားတဲ့ အရာအားလုံးအနှံ့ auto-import completions တွေက ရိုးရိုးရှင်းရှင်း အလုပ်လုပ်သင့်ပါတယ်။

[implementing pull request အပေါ် နောက်ထပ် ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/55955)။

## Performance and Size Optimizations (Performance နှင့် Size Optimization များ)

### Monomorphized Objects in Language Service and Public API (Language Service နှင့် Public API ရှိ Monomorphized Objects)

TypeScript 5.0 မှာ — ကျွန်တော်တို့ရဲ့ [`Node`](https://github.com/microsoft/TypeScript/pull/51682) နဲ့ [`Symbol`](https://github.com/microsoft/TypeScript/pull/51880) objects တွေမှာ — တသမတ်တည်း initialization order တစ်ခုနဲ့ ညီညွတ်တဲ့ properties အစုတစ်ခု ရှိကြောင်း သေချာအောင် လုပ်ခဲ့ပါတယ်။
ဒီလိုလုပ်ခြင်းက operations အမျိုးမျိုးမှာ polymorphism တွေကို လျှော့ချပေးနိုင်ပြီး — runtimes တွေက properties တွေကို ပိုမြန်မြန် ဆွဲယူနိုင်စေပါတယ်။

ဒီပြောင်းလဲမှုကို လုပ်ခြင်းအားဖြင့် — compiler ထဲမှာ အထင်ကြီးလောက်တဲ့ speed တိုးတက်မှုတွေ မြင်ခဲ့ရပါတယ်;
ဒါပေမယ့် — ဒီပြောင်းလဲမှုတွေထဲက အများစုက ကျွန်တော်တို့ရဲ့ data structures တွေအတွက် internal allocators တွေအပေါ်မှာ လုပ်ဆောင်ခဲ့တာပါ။
Language service က TypeScript ရဲ့ public API နဲ့အတူ — အချို့သော objects တွေအတွက် မတူညီတဲ့ allocators အစုတစ်ခုကို သုံးပါတယ်။
ဒါက TypeScript compiler ကို နည်းနည်း ပိုပါးလွှာစေခဲ့ပါတယ် — language service အတွက်ပဲ သုံးတဲ့ data တွေက compiler ထဲမှာ ဘယ်တော့မှ သုံးစရာ မလိုလို့ပါ။

TypeScript 5.5 မှာတော့ — language service နဲ့ public API အတွက်ပါ အလားတူ monomorphization အလုပ်ကို လုပ်ပြီးပါပြီ။
ဒါရဲ့ အဓိပ္ပာယ်က — သင့်ရဲ့ editor အတွေ့အကြုံနဲ့ TypeScript API ကို သုံးတဲ့ build tools တွေက အတော်လေး ပိုမြန်လာမှာပါ။
တကယ်တော့ — ကျွန်တော်တို့ရဲ့ benchmarks တွေမှာ — public TypeScript API ရဲ့ allocators တွေကို သုံးတဲ့အခါ **build times တွေမှာ 5-8% မြန်ဆန်မှု** နဲ့ **language service operations တွေ 10-20% ပိုမြန်လာတာ** ကို မြင်ခဲ့ရပါတယ်။
ဒါက memory တိုးလာမှုကို ဆိုလိုပေမယ့် — အဲဒီ အပေးအယူက တန်ဖိုးရှိတယ်လို့ ယုံကြည်ပြီး — အဲဒီ memory overhead ကို လျှော့ချဖို့ နည်းလမ်းတွေ ရှာတွေ့ဖို့ မျှော်လင့်ပါတယ်။
အခုဆို အရာတွေက ပိုပြီး လျင်မြန်လာသင့်ပါတယ်။

နောက်ထပ် အချက်အလက်အတွက် — [ဒီပြောင်းလဲမှုကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/58045)။

### Monomorphized Control Flow Nodes (Monomorphized Control Flow Node များ)

TypeScript 5.5 မှာ — control flow graph ရဲ့ nodes တွေကို သူတို့ အမြဲတမ်း ညီညွတ်တဲ့ ပုံသဏ္ဍာန်တစ်ခု ဆောင်ထားနိုင်အောင် monomorphize လုပ်ထားပါတယ်။
ဒီလိုလုပ်ခြင်းအားဖြင့် — check times တွေက 1% လောက် မကြာခဏ လျော့ကျသွားပါလိမ့်မယ်။

[ဒီပြောင်းလဲမှုကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/57977)။

### Optimizations on our Control Flow Graph (Control Flow Graph အပေါ် Optimization များ)

အခြေအနေ အများအပြားမှာ — control flow analysis က သတင်းအချက်အလက် အသစ်တစ်ခုမှ မပေးတဲ့ nodes တွေကို ဖြတ်သန်းသွားတတ်ပါတယ်။
Nodes တစ်ချို့ရဲ့ antecedents (သို့ "dominators") တွေထဲမှာ စောစောပိုင်း ရပ်တန့်မှု (early termination) ဒါမှမဟုတ် effects တွေ မရှိတဲ့အခါ — အဲဒီ nodes တွေကို အမြဲတမ်း ကျော်သွားလို့ရတယ်ဆိုတာ ကျွန်တော်တို့ သတိပြုမိခဲ့ပါတယ်။
ဒါကြောင့် TypeScript က — control flow analysis အတွက် စိတ်ဝင်စားစရာ သတင်းအချက်အလက်တွေကို *တကယ်* ပေးတဲ့ အစောပိုင်း node တစ်ခုဆီ ချိတ်ဆက်ခြင်းအားဖြင့် — ဒါကို အခွင့်ကောင်းယူဖို့ သူ့ရဲ့ control flow graphs တွေကို ယခုဆို တည်ဆောက်ပါတယ်။
ဒါက ပိုပြားချပ်တဲ့ (flatter) control flow graph တစ်ခုကို ဖြစ်ပေါ်စေပြီး — ဖြတ်သန်းဖို့ ပိုပြီး ထိရောက်စေနိုင်ပါတယ်။
ဒီ optimization က ကျိုးနပ်တဲ့ တိုးတက်မှုတွေ ရစေခဲ့ပေမယ့် — codebases အချို့မှာ build time ရဲ့ 2% အထိ လျှော့ချပေးနိုင်ပါတယ်။

[ဒီမှာ နောက်ထပ် ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/58013)။

### Skipped Checking in `transpileModule` and `transpileDeclaration` (`transpileModule` နှင့် `transpileDeclaration` တွင် Checking ကျော်လိုက်ခြင်း)

TypeScript ရဲ့ `transpileModule` API ကို — TypeScript file တစ်ခုတည်းရဲ့ ပါဝင်မှုတွေကို JavaScript အဖြစ် compile လုပ်ဖို့ သုံးနိုင်ပါတယ်။
အလားတူပဲ — `transpileDeclaration` API (အောက်မှာ ကြည့်ပါ) ကို TypeScript file တစ်ခုတည်းအတွက် declaration file တစ်ခု ထုတ်လုပ်ဖို့ သုံးနိုင်ပါတယ်။
ဒီ APIs တွေရဲ့ ပြဿနာတစ်ခုက — TypeScript က output မထုတ်ခင် file ရဲ့ ပါဝင်မှုတစ်ခုလုံးအပေါ်မှာ full type-checking pass တစ်ခုကို အတွင်းပိုင်းမှာ လုပ်ဆောင်ခဲ့တာပါ။
နောက်ပိုင်း emit အဆင့်အတွက် သုံးမယ့် အချက်အလက်တစ်ချို့ကို စုဆောင်းဖို့ ဒါက လိုအပ်ခဲ့ပါတယ်။

TypeScript 5.5 မှာ — full check တစ်ခု လုပ်ဆောင်တာကို ရှောင်နိုင်တဲ့ နည်းလမ်းတစ်ခု တွေ့ခဲ့ပြီး — ဒီအချက်အလက်တွေကို လိုအပ်သလောက်ပဲ lazily (ဆိုင်းငံ့) စုဆောင်းပါတယ် — `transpileModule` ရော `transpileDeclaration` ပါ ဒီလုပ်ဆောင်ချက်ကို default အနေနဲ့ enable လုပ်ထားပါတယ်။
ရလဒ်အနေနဲ့ — ဒီ APIs တွေနဲ့ ပေါင်းစပ်အသုံးပြုတဲ့ [ts-loader](https://www.npmjs.com/package/ts-loader) (`transpileOnly` နဲ့) နဲ့ [ts-jest](https://www.npmjs.com/package/ts-jest) လို tools တွေက သိသာတဲ့ မြန်ဆန်မှုကို တွေ့ရသင့်ပါတယ်။
ကျွန်တော်တို့ရဲ့ စမ်းသပ်မှုတွေမှာ — [`transpileModule` ကို သုံးတဲ့အခါ build time မှာ 2x လောက် မြန်ဆန်တာကို ယေဘုယျအားဖြင့် တွေ့ခဲ့ရပါတယ်](https://github.com/microsoft/TypeScript/pull/58364#issuecomment-2138580690)။

### TypeScript Package Size Reduction (TypeScript Package Size လျှော့ချခြင်း)

[5.0 မှာ modules တွေဆီ ပြောင်းရွှေ့ခဲ့တာ](https://devblogs.microsoft.com/typescript/typescripts-migration-to-modules/) ကို ထပ်ပြီး အခွင့်ကောင်းယူရင်း — [`tsserver.js` နဲ့ `typingsInstaller.js` တွေကို သီးခြား standalone bundles တွေ ထုတ်မယ့်အစား — ဘုံ API library တစ်ခုကနေ import လုပ်စေခြင်းအားဖြင့်](https://github.com/microsoft/TypeScript/pull/55326) — TypeScript ရဲ့ package size တစ်ခုလုံးကို သိသိသာသာ လျှော့ချနိုင်ခဲ့ပါတယ်။

ဒါက TypeScript ရဲ့ disk ပေါ်က size ကို 30.2 MB ကနေ 20.4 MB အထိ လျှော့ချပေးပြီး — packed size ကို 5.5 MB ကနေ 3.7 MB အထိ လျှော့ချပေးပါတယ်!

### Node Reuse in Declaration Emit (Declaration Emit တွင် Node ပြန်လည်အသုံးပြုခြင်း)

`isolatedDeclarations` ကို enable လုပ်ဖို့ အလုပ်တွေရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ — declaration files တွေ ထုတ်လုပ်တဲ့အခါ TypeScript က သင့် input source code ကို တိုက်ရိုက် ကူးယူနိုင်တဲ့ အကြိမ်အရေအတွက်ကို သိသိသာသာ တိုးတက်အောင် လုပ်ထားပါတယ်။

ဥပမာ — သင်က အောက်ပါအတိုင်း ရေးထားတယ်ဆိုပါစို့

```ts
export const strBool: string | boolean = "hello";
export const boolStr: boolean | string = "world";
```

ဒီ union types တွေက တူညီပေမယ့် — union ရဲ့ အစီအစဉ်က မတူညီတာ သတိပြုပါ။
Declaration file ကို emit လုပ်တဲ့အခါ — TypeScript မှာ တူညီတဲ့ output ဖြစ်နိုင်ခြေ နှစ်မျိုး ရှိပါတယ်။

ပထမတစ်ခုက — type တစ်ခုချင်းစီအတွက် တသမတ်တည်း canonical representation တစ်ခုကို သုံးတာပါ:

```ts
export const strBool: string | boolean;
export const boolStr: string | boolean;
```

ဒုတိယတစ်ခုကတော့ — type annotations တွေကို ရေးထားတဲ့အတိုင်း အတိအကျ ပြန်သုံးတာပါ:

```ts
export const strBool: string | boolean;
export const boolStr: boolean | string;
```

ဒုတိယ ချဉ်းကပ်မှုက ယေဘုယျအားဖြင့် ပိုနှစ်သက်ဖွယ် ကောင်းပါတယ် — အကြောင်းရင်း အနည်းငယ်ကြောင့်ပါ:

* ညီမျှတဲ့ representations တွေ အများအပြားက ရည်ရွယ်ချက် အတိုင်းအတာတစ်ခုကို ထည့်သွင်းထားဆဲ ဖြစ်ပြီး — အဲဒါတွေကို declaration file ထဲမှာ ထိန်းသိမ်းထားတာ ပိုကောင်းပါတယ်
* Type တစ်ခုရဲ့ representation အသစ်တစ်ခု ထုတ်လုပ်တာက အတော်လေး စရိတ်ကြီးနိုင်တာမို့ — ရှောင်နိုင်ရင် ပိုကောင်းပါတယ်
* အသုံးပြုသူ ရေးထားတဲ့ types တွေက ပုံမှန်အားဖြင့် generated type representations တွေထက် ပိုတိုပါတယ်

5.5 မှာ — input file ထဲမှာ ရေးထားတဲ့အတိုင်း types တွေကို အတိအကျ ပြန် print ထုတ်ဖို့ လုံခြုံပြီး မှန်ကန်တဲ့ နေရာတွေကို TypeScript က မှန်ကန်စွာ ခွဲခြားသိမြင်နိုင်တဲ့ နေရာ အရေအတွက်ကို အများကြီး တိုးတက်အောင် လုပ်ထားပါတယ်။
ဒီအမှုတွေထဲက အများစုက မမြင်ရတဲ့ performance တိုးတက်မှုတွေပါ — TypeScript က syntax nodes အစုအသစ်တွေ ထုတ်လုပ်ပြီး သူတို့ကို string တစ်ခုအဖြစ် serialize လုပ်ခဲ့ပါတယ်။
အဲဒီအစား — TypeScript က ယခုဆို မူရင်း syntax nodes တွေအပေါ်မှာ တိုက်ရိုက် လည်ပတ်နိုင်ပြီး — ဒါက အများကြီး ပိုသက်သာပြီး ပိုမြန်ပါတယ်။

### Caching Contextual Types from Discriminated Unions (Discriminated Unions များမှ Contextual Types များကို Caching ပြုလုပ်ခြင်း)

TypeScript က object literal တစ်ခုလို expression တစ်ခုရဲ့ contextual type ကို တောင်းဆိုတဲ့အခါ — မကြာခဏဆိုသလို union type တစ်ခုကို ကြုံရတတ်ပါတယ်။
အဲဒီလို အခြေအနေမျိုးမှာ — TypeScript က သိထားတဲ့ တန်ဖိုးတွေရှိတဲ့ သိထားတဲ့ properties တွေ (ဆိုလိုတာက discriminant properties) ပေါ်အခြေခံပြီး union ရဲ့ members တွေကို filter ထုတ်ဖို့ ကြိုးစားပါတယ်။
ဒီအလုပ်က အတော်လေး စရိတ်ကြီးနိုင်ပါတယ် — အထူးသဖြင့် property အများကြီး ပါဝင်တဲ့ object တစ်ခုနဲ့ ဆုံးသွားရင် ပိုဆိုးပါတယ်။
TypeScript 5.5 မှာ — [တွက်ချက်မှုအများစုကို object literal ထဲက property တိုင်းအတွက် ပြန်တွက်စရာ မလိုအောင် တစ်ခါတည်း cache လုပ်ထားပါတယ်](https://github.com/microsoft/TypeScript/pull/58372)။
ဒီ optimization ကို လုပ်ဆောင်ခြင်းက TypeScript compiler ကိုယ်တိုင် compile လုပ်တာကနေ 250ms ကို ချွေတာပေးခဲ့ပါတယ်။

## Easier API Consumption from ECMAScript Modules (ECMAScript Modules များမှ API Consumption ပိုမိုလွယ်ကူလာခြင်း)

အရင်က — Node.js မှာ ECMAScript module တစ်ခု ရေးနေတယ်ဆိုရင် — `typescript` package ကနေ named imports တွေကို မရနိုင်ခဲ့ပါဘူး။

```ts
import { createSourceFile } from "typescript"; // ❌ error

import * as ts from "typescript";
ts.createSourceFile // ❌ undefined???

ts.default.createSourceFile // ✅ works - but ugh!
```

ဒါက — [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer) က TypeScript ရဲ့ generated CommonJS code ရဲ့ ပုံစံကို အသိအမှတ် မပြုခဲ့လို့ပါ။
ဒါကို ပြင်ဆင်ပြီးပါပြီ — Node.js ထဲက ECMAScript modules တွေနဲ့ TypeScript npm package ကနေ named imports တွေကို အသုံးပြုသူတွေ ယခုဆို သုံးနိုင်ပါပြီ။

```ts
import { createSourceFile } from "typescript"; // ✅ works now!

import * as ts from "typescript";
ts.createSourceFile // ✅ works now!
```

နောက်ထပ် အချက်အလက်အတွက် — [ဒီပြောင်းလဲမှုကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/57133)။
## The `transpileDeclaration` API (`transpileDeclaration` API အကြောင်း)

TypeScript ရဲ့ API က `transpileModule` လို့ခေါ်တဲ့ function တစ်ခုကို ဖော်ထုတ်ပေးထားပါတယ်။
၎င်းက TypeScript code file တစ်ခုတည်းကို compile လုပ်တာ လွယ်ကူစေဖို့ ရည်ရွယ်ပါတယ်။
၎င်းမှာ *program* တစ်ခုလုံးဆီ ဝင်ရောက်ခွင့် မရှိတာမို့ — code က `isolatedModules` option အောက်မှာ errors တစ်ခုခု ချိုးဖောက်နေရင် — မှန်ကန်တဲ့ output ကို ထုတ်ပေးချင်မှ ထုတ်ပေးမယ်ဆိုတဲ့ သတိပေးချက် (caveat) တစ်ခု ရှိပါတယ်။

TypeScript 5.5 မှာ — `transpileDeclaration` လို့ခေါ်တဲ့ အလားတူ API အသစ်တစ်ခုကို ထပ်ဖြည့်ထားပါတယ်။
ဒီ API က `transpileModule` နဲ့ ဆင်တူပေမယ့် — input source text တစ်ချို့ကို အခြေခံပြီး *declaration file* တစ်ခုတည်းကို ထုတ်လုပ်ဖို့ အထူးဒီဇိုင်းထုတ်ထားတာပါ။
`transpileModule` လိုပဲ — ၎င်းမှာ full program တစ်ခုဆီ ဝင်ရောက်ခွင့် မရှိပါဘူး — အလားတူ သတိပေးချက်လည်း သက်ရောက်ပါတယ်: input code က `isolatedDeclarations` option အသစ်အောက်မှာ errors ကင်းစင်မှသာ — မှန်ကန်တဲ့ declaration file တစ်ခုကို ထုတ်လုပ်ပေးနိုင်မှာပါ။

လိုအပ်ရင် — ဒီ function ကို `isolatedDeclarations` mode အောက်မှာ files အားလုံးအနှံ့ declaration emit တွေကို parallelize (အပြိုင် လုပ်ဆောင်) လုပ်ဖို့ သုံးနိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်အတွက် — [implementation ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/58261)။

## Notable Behavioral Changes (ထင်ရှားသော Behavioral Changes များ)

ဒီ section က — upgrade တစ်ခုခုရဲ့ အစိတ်အပိုင်းအနေနဲ့ အသိအမှတ်ပြု နားလည်ထားသင့်တဲ့ မှတ်သားထိုက်သော ပြောင်းလဲမှုအစုတစ်ခုကို မီးမောင်းထိုးပြပါတယ်။
တစ်ခါတစ်ရံ deprecations, removals တွေနဲ့ ကန့်သတ်ချက်အသစ်တွေကို မီးမောင်းထိုးပြပါလိမ့်မယ်။
ထို့အပြင် — လုပ်ဆောင်နိုင်စွမ်းအရ တိုးတက်မှုတွေ ဖြစ်ပေမယ့် — error အသစ်တွေ မိတ်ဆက်ခြင်းအားဖြင့် ရှိပြီးသား build တစ်ခုကိုပါ ထိခိုက်စေနိုင်တဲ့ bug fixes တွေလည်း ပါဝင်နိုင်ပါတယ်။

### Disabling Features Deprecated in TypeScript 5.0 (TypeScript 5.0 တွင် Deprecated ပြုလုပ်ထားသော Features များကို ပိတ်ပစ်ခြင်း)

TypeScript 5.0 က အောက်ပါ options နဲ့ အပြုအမူတွေကို deprecate လုပ်ခဲ့ပါတယ်:

* `charset`
* `target: ES3`
* `importsNotUsedAsValues`
* `noImplicitUseStrict`
* `noStrictGenericChecks`
* `keyofStringsOnly`
* `suppressExcessPropertyErrors`
* `suppressImplicitAnyIndexErrors`
* `out`
* `preserveValueImports`
* project references တွေထဲက `prepend`
* လည်ပတ်စနစ် (OS) အလိုက် သွယ်ဝိုက် သတ်မှတ်သော `newLine`

အပေါ်က deprecated options တွေကို ဆက်သုံးနိုင်ဖို့ — TypeScript 5.0 နဲ့ အခြား ပိုသစ်တဲ့ ဗားရှင်းတွေ သုံးနေတဲ့ developer တွေက `ignoreDeprecations` လို့ခေါ်တဲ့ option အသစ်တစ်ခုကို `"5.0"` တန်ဖိုးနဲ့ သတ်မှတ်ခဲ့ရပါတယ်။

TypeScript 5.5 မှာတော့ — ဒီ options တွေက သက်ရောက်မှု ဘာမှ မရှိတော့ပါဘူး။
ချောမွေ့တဲ့ upgrade လမ်းကြောင်းတစ်ခုအတွက် ကူညီဖို့ — သင့် tsconfig ထဲမှာ သူတို့ကို သတ်မှတ်ထားဆဲ ဖြစ်နိုင်ပါတယ် — ဒါပေမယ့် TypeScript 6.0 မှာတော့ သတ်မှတ်တာက error တစ်ခု ဖြစ်လာပါမယ်။
ကျွန်တော်တို့ရဲ့ deprecation strategy ကို အကျဉ်းချုပ်ဖော်ပြထားတဲ့ [Flag Deprecation Plan](https://github.com/microsoft/TypeScript/issues/51000) ကိုလည်း ကြည့်ပါ။

သင့် codebase ကို အကောင်းဆုံး ဘယ်လို လိုက်လျောညီထွေ ဖြစ်အောင် လုပ်ရမလဲဆိုတဲ့ အကြံပြုချက်တွေ ပါဝင်တဲ့ [ဒီ deprecation အစီအစဉ်တွေနဲ့ ပတ်သက်တဲ့ အချက်အလက် ပိုမိုကို GitHub ပေါ်မှာ ရနိုင်ပါတယ်](https://github.com/microsoft/TypeScript/issues/51909)။

### `lib.d.ts` Changes (`lib.d.ts` ပြောင်းလဲမှုများ)

DOM အတွက် ထုတ်လုပ်ထားတဲ့ Types တွေက သင့် codebase ကို type-check လုပ်တာကို သက်ရောက်မှု ရှိနိုင်ပါတယ်။
နောက်ထပ် အချက်အလက်အတွက် — [TypeScript 5.5 အတွက် DOM updates တွေကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/58211)။

### Stricter Parsing for Decorators (Decorators များအတွက် Parsing ပိုမိုတင်းကျပ်လာခြင်း)

TypeScript က decorators တွေကို ပံ့ပိုးမှု စတင်မိတ်ဆက်ကတည်းက — proposal အတွက် သတ်မှတ်ထားတဲ့ grammar ကို ပိုတင်းကျပ်အောင် လုပ်ထားပါတယ်။
TypeScript က ယခုဆို ဘယ်ပုံစံတွေကို ခွင့်ပြုလဲဆိုတာနဲ့ ပတ်သက်ပြီး ပိုတင်းကျပ်ပါတယ်။
ရှားပေမယ့် — ရှိပြီးသား decorators တွေက errors တွေ မဖြစ်အောင် parentheses (ကွင်းစကွင်းပိတ်) တွေနဲ့ ကာရံထားဖို့ လိုအပ်လာနိုင်ပါတယ်။

```ts
class DecoratorProvider {
    decorate(...args: any[]) { }
}

class D extends DecoratorProvider {
    m() {
        class C {
            @super.decorate // ❌ error
            method1() { }

            @(super.decorate) // ✅ okay
            method2() { }
        }
    }
}
```

[ဒီပြောင်းလဲမှုအပေါ် နောက်ထပ် အချက်အလက်တွေ ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/57749)။

### `undefined` is No Longer a Definable Type Name (`undefined` သည် သတ်မှတ်နိုင်သော Type Name တစ်ခု မဟုတ်တော့ခြင်း)

TypeScript က built-in types တွေနဲ့ ထိပ်တိုက်ဆုံနေတဲ့ type alias နာမည်တွေကို အမြဲတမ်း ခွင့်မပြုခဲ့ပါဘူး:

```ts
// Illegal
type null = any;
// Illegal
type number = any;
// Illegal
type object = any;
// Illegal
type any = any;
```

Bug တစ်ခုကြောင့် — ဒီ logic က built-in type `undefined` အတွက်တော့ သက်ရောက်မှု မရှိခဲ့ပါဘူး။
5.5 မှာတော့ — ဒါကို ယခုဆို error တစ်ခုအနေနဲ့ မှန်ကန်စွာ ခွဲခြားသတ်မှတ်ပါတယ်:

```ts
// Now also illegal
type undefined = any;
```

`undefined` လို့ နာမည်ပေးထားတဲ့ type aliases တွေဆီ bare references တွေက တကယ်တော့ အစကတည်းက အလုပ်မလုပ်ခဲ့ပါဘူး။
သူတို့ကို define လုပ်နိုင်ပေမယ့် — unqualified type name တစ်ခုအနေနဲ့တော့ သုံးလို့ မရခဲ့ပါဘူး။

```ts
export type undefined = string;
export const m: undefined = "";
//           ^
// Errors in 5.4 and earlier - the local definition of 'undefined' was not even consulted.
```

နောက်ထပ် အချက်အလက်အတွက် — [ဒီပြောင်းလဲမှုကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/57575)။

### Simplified Reference Directive Declaration Emit (Reference Directive Declaration Emit ရိုးရှင်းလာခြင်း)

Declaration file တစ်ခုကို ထုတ်လုပ်တဲ့အခါ — TypeScript က reference directive တစ်ခု လိုအပ်တယ်လို့ ယူဆတဲ့အခါ — အဲဒါကို synthesize (ဖန်တီး) လုပ်ခဲ့ပါတယ်။
ဥပမာ — Node.js modules တွေ အားလုံးက ambiently ကြေညာထားတာမို့ — module resolution တစ်ခုတည်းနဲ့ load လို့ မရပါဘူး။
အောက်ပါလို file တစ်ခုက:

```tsx
import path from "path";
export const myPath = path.parse(__filename);
```

အောက်ပါလို declaration file တစ်ခုကို emit လုပ်ပါလိမ့်မယ်:

```tsx
/// <reference types="node" />
import path from "path";
export declare const myPath: path.ParsedPath;
```

reference directive က မူရင်း source ထဲမှာ ဘယ်တော့မှ မပေါ်ခဲ့ပေမယ့်လည်း အဲဒီလို ဖြစ်ပါတယ်။

အလားတူပဲ — TypeScript က output ရဲ့ အစိတ်အပိုင်းတစ်ခု ဖြစ်ဖို့ မလိုအပ်ဘူးလို့ ယူဆတဲ့ reference directives တွေကိုလည်း *ဖယ်ရှား*ခဲ့ပါတယ်။
ဥပမာ — `jest` ဆီ reference directive တစ်ခု ရှိတယ်ဆိုပါစို့;
ဒါပေမယ့် declaration file ကို ထုတ်လုပ်ဖို့ အဲဒီ reference directive က မလိုအပ်ဘူးဆိုတာ စိတ်ကူးကြည့်ပါ။
TypeScript က ၎င်းကို ရိုးရိုးရှင်းရှင်း ပစ်ချလိုက်မှာပါ။
ဒါကြောင့် အောက်ပါ ဥပမာမှာ:

```tsx
/// <reference types="jest" />
import path from "path";
export const myPath = path.parse(__filename);
```

TypeScript က အောက်ပါအတိုင်းပဲ emit လုပ်နေဦးမှာပါ:

```tsx
/// <reference types="node" />
import path from "path";
export declare const myPath: path.ParsedPath;
```

`isolatedDeclarations` ပေါ်မှာ အလုပ်လုပ်နေတုန်း — type checking မပါဘဲ ဒါမှမဟုတ် file တစ်ခုတည်းရဲ့ context ထက်ပိုပြီး သုံးနေတဲ့ declaration emitter တစ်ခုကို အကောင်အထည်ဖော်ဖို့ ကြိုးစားသူတိုင်းအတွက် — ဒီ logic က မထိန်းသိမ်းနိုင်စရာ (untenable) ဖြစ်တာကို ကျွန်တော်တို့ သဘောပေါက်ခဲ့ပါတယ်။
ဒီအပြုအမူက အသုံးပြုသူတစ်ဦးရဲ့ ရှုထောင့်ကနေလည်း နားလည်ဖို့ ခက်ခဲပါတယ်; emitted file ထဲမှာ reference directive တစ်ခု ပေါ်လား/မပေါ်ဘူးလားဆိုတာက — typechecking အတွင်းမှာ အတိအကျ ဘာတွေ ဖြစ်နေလဲဆိုတာကို နားမလည်ရင် — မညီမညွတ် ဖြစ်နေပြီး ကြိုတင်ခန့်မှန်းဖို့ ခက်ခဲပုံရပါတယ်။
`isolatedDeclarations` ကို enable လုပ်ထားတဲ့အခါ declaration emit က မတူညီအောင် မဖြစ်စေဖို့ — ကျွန်တော်တို့ရဲ့ emit က ပြောင်းလဲဖို့ လိုအပ်တယ်ဆိုတာ သိခဲ့ပါတယ်။

[စမ်းသပ်မှု](https://github.com/microsoft/TypeScript/pull/57569) တွေကနေတစ်ဆင့် — TypeScript က reference directives တွေကို synthesize လုပ်ခဲ့တဲ့ အမှုတွေ အားလုံးနီးပါးက `node` ဒါမှမဟုတ် `react` တွေကို ဆွဲသွင်းဖို့ပဲ ဖြစ်တာကို တွေ့ခဲ့ရပါတယ်။
ဒါတွေက — downstream အသုံးပြုသူတစ်ဦးက အဲဒီ types တွေကို tsconfig.json ရဲ့ `"types"` ဒါမှမဟုတ် library imports တွေကနေတစ်ဆင့် ရည်ညွှန်းပြီးသား ဖြစ်မယ်လို့ မျှော်လင့်ရတဲ့ အခြေအနေတွေပါ — ဒါကြောင့် ဒီ reference directives တွေကို ဆက်ပြီး synthesize မလုပ်တော့တာက ဘယ်သူ့ကိုမှ မပျက်စီးစေနိုင်လောက်ပါဘူး။
module တစ်ခုက `WeakMap` တစ်ခုကို export လုပ်တဲ့အခါ TypeScript က `lib="es2015"` ဆီ reference တစ်ခုကို synthesize မလုပ်ဘဲ — downstream အသုံးပြုသူတစ်ဦးက အဲဒါကို သူတို့ရဲ့ environment ရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ ထည့်သွင်းထားပြီးသားလို့ ယူဆတာက — `lib.d.ts` အတွက် ဒီလိုပဲ အလုပ်လုပ်ပြီးသား ဖြစ်တာ မှတ်သားထိုက်ပါတယ်။

Library authors တွေ ရေးသားခဲ့တဲ့ (synthesize မဟုတ်တဲ့) reference directives တွေအတွက်ကျတော့ — [နောက်ထပ် စမ်းသပ်မှု](https://github.com/microsoft/TypeScript/pull/57656) တွေက သူတို့ အားလုံးနီးပါးကို ဖယ်ရှားခဲ့ပြီး — output ထဲမှာ ဘယ်တော့မှ မပေါ်ဘူးဆိုတာ ပြသခဲ့ပါတယ်။
ထိန်းသိမ်းထားခဲ့တဲ့ reference directives အများစုက ကျိုးပဲ့နေပြီး — ထိန်းသိမ်းဖို့ ရည်ရွယ်ထားတာ မဟုတ်နိုင်ပါဘူး။

ဒီရလဒ်တွေကို ထည့်သွင်းစဉ်းစားပြီး — TypeScript 5.5 မှာ declaration emit ထဲက reference directives တွေကို သိသိသာသာ ရိုးရှင်းအောင် လုပ်ဖို့ ဆုံးဖြတ်ခဲ့ပါတယ်။
ပိုပြီး တသမတ်တည်း ဖြစ်တဲ့ strategy တစ်ခုက library authors တွေနဲ့ သုံးစွဲသူတွေကို သူတို့ရဲ့ declaration files တွေအပေါ် ပိုကောင်းတဲ့ ထိန်းချုပ်မှု ရှိစေဖို့ ကူညီပါလိမ့်မယ်။

Reference directives တွေကို ဆက်ပြီး synthesize မလုပ်တော့ပါဘူး။
အသုံးပြုသူ ရေးသားထားတဲ့ reference directives တွေကိုလည်း — `preserve="true"` attribute အသစ်တစ်ခုနဲ့ annotate လုပ်ထားမှသာ — ထိန်းသိမ်းတော့မှာ မဟုတ်ပါဘူး။
လက်တွေ့ကျကျ ဆိုရရင် — အောက်ပါလို input file တစ်ခုက:

```tsx
/// <reference types="some-lib" preserve="true" />
/// <reference types="jest" />
import path from "path";
export const myPath = path.parse(__filename);
```

အောက်ပါအတိုင်း emit လုပ်ပါလိမ့်မယ်:

```tsx
/// <reference types="some-lib" preserve="true" />
import path from "path";
export declare const myPath: path.ParsedPath;
```

`preserve="true"` ကို ထည့်တာက — အမည်မသိ attributes တွေကို လျစ်လျူရှုတာမို့ — TypeScript ဗားရှင်းအဟောင်းတွေနဲ့ နောက်ပြန် သဟဇာတဖြစ် (backwards compatible) ပါတယ်။

ဒီပြောင်းလဲမှုက performance ကိုလည်း တိုးတက်စေခဲ့ပါတယ်; ကျွန်တော်တို့ရဲ့ benchmarks တွေမှာ — declaration emit enable လုပ်ထားတဲ့ projects တွေရဲ့ emit အဆင့်မှာ 1-4% တိုးတက်မှု တွေ့ခဲ့ရပါတယ်။
