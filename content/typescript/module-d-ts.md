---
title: "Modules .d.ts (Module .d.ts များ)"
description: "CommonJS module တွေအတွက် .d.ts ရေးနည်း — module.exports ဖြင့် exports ဖော်ပြခြင်း, default exports, import ပုံစံ အမျိုးမျိုး, module ထဲက types နဲ့ namespaces, export as namespace နှင့် စတင်ရေးသားရန် reference template"
order: 30
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html"
status: translated
updated: 2026-09-05
---

## JavaScript ကို ဥပမာ DTS နဲ့ နှိုင်းယှဉ်ခြင်း (Comparing JavaScript to an Example DTS)

## အသုံးများတဲ့ CommonJS ပုံစံများ (Common CommonJS Patterns)

CommonJS ပုံစံများကို သုံးတဲ့ module တစ်ခုက — export လုပ်လိုက်တဲ့ values တွေကို ဖော်ပြဖို့ `module.exports` ကို အသုံးပြုပါတယ်။ ဥပမာ — function တစ်ခုနဲ့ ဂဏန်း constant (ကိန်းသေတန်ဖိုး) တစ်ခုကို export လုပ်တဲ့ module တစ်ခု ဒီမှာ ကြည့်ရအောင်:

```js
const maxInterval = 12;

function getArrayLength(arr) {
  return arr.length;
}

module.exports = {
  getArrayLength,
  maxInterval,
};
```

ဒါကို အောက်ပါ `.d.ts` နဲ့ ဖော်ပြနိုင်ပါတယ်:

```ts
export function getArrayLength(arr: any[]): number;
export const maxInterval: 12;
```

TypeScript playground က JavaScript code တစ်ခုရဲ့ `.d.ts` နဲ့ ညီမျှတဲ့ ပုံစံကို ပြသနိုင်ပါတယ်။ [ဒီမှာ ကိုယ်တိုင် စမ်းကြည့်နိုင်ပါတယ်](https://www.typescriptlang.org/play?useJavaScript=true#code/GYVwdgxgLglg9mABAcwKZQIICcsEMCeAMqmMlABYAUuOAlIgN6IBQiiW6IWSNWAdABsSZcswC+zCAgDOURAFtcADwAq5GKUQBeRAEYATM2by4AExBC+qJQAc4WKNO2NWKdNjxFhFADSvFquqk4sxAA).

`.d.ts` syntax က ရည်ရွယ်ချက်ရှိရှိနဲ့ပဲ [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) syntax နဲ့ တူအောင် ရေးထားတာပါ။ ES Modules ကို TC39 က 2015 ခုနှစ်မှာ ES2015 (ES6) ရဲ့ အစိတ်အပိုင်းအဖြစ် အတည်ပြုခဲ့ပါတယ် — transpilers တွေကတော့ ဒါကို ကြာမြင့်စွာကတည်းက ပံ့ပိုးပေးနေခဲ့ပါပြီ။ အကယ်၍ သင့်မှာ ES Modules သုံးထားတဲ့ JavaScript codebase တစ်ခု ရှိနေရင်တော့:

```js
export function getArrayLength(arr) {
  return arr.length;
}
```

ဒါဆိုရင် အောက်ပါ `.d.ts` နဲ့ ညီမျှမှာ ဖြစ်ပါတယ်:

```ts
export function getArrayLength(arr: any[]): number;
```

### Default Exports (Default Export များ)

CommonJS မှာ ဘယ် value ကိုမဆို default export အဖြစ် export လုပ်နိုင်ပါတယ် — ဥပမာ ဒီမှာ regular expression module တစ်ခု ရှိပါတယ်:

```js
module.exports = /hello( world)?/;
```

ဒါကို အောက်ပါ .d.ts နဲ့ ဖော်ပြနိုင်ပါတယ်:

```ts
declare const helloWorld: RegExp;
export = helloWorld;
```

ဒါမှမဟုတ် ဂဏန်းတစ်ခု:

```js
module.exports = 3.142;
```

```ts
declare const pi: number;
export = pi;
```

CommonJS မှာ export လုပ်တဲ့ ပုံစံတစ်မျိုးကတော့ function တစ်ခုကို export လုပ်တာပါ။ Function က object တစ်ခုလည်း ဖြစ်တာမို့ — အပို fields (အကွက်များ) တွေကို ထပ်ထည့်လို့ရပြီး — အဲဒါတွေက export ထဲမှာပါ ပါဝင်သွားပါတယ်။

```js
function getArrayLength(arr) {
  return arr.length;
}
getArrayLength.maxInterval = 12;

module.exports = getArrayLength;
```

ဒါကို ဒီလိုမျိုး ဖော်ပြနိုင်ပါတယ်:

```ts
declare function getArrayLength(arr: any[]): number;
declare namespace getArrayLength {
  declare const maxInterval: 12;
}

export = getArrayLength;
```

ဒါ ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ အသေးစိတ်အတွက် [Module: Functions](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html) ကို ကြည့်နိုင်ပြီး — [Modules reference](/docs/typescript/modules) page ကိုလည်း ကြည့်နိုင်ပါတယ်။

## Import ပုံစံမျိုးစုံ ကိုင်တွယ်ခြင်း (Handling Many Consuming Import)

ခေတ်မီ consuming code (module တွေကို သုံးစွဲတဲ့ code) တွေမှာ module တစ်ခုကို import လုပ်ဖို့ နည်းလမ်း အမျိုးမျိုး ရှိပါတယ်:

```ts
const fastify = require("fastify");
const { fastify } = require("fastify");
import fastify = require("fastify");
import * as Fastify from "fastify";
import { fastify, FastifyInstance } from "fastify";
import fastify from "fastify";
import fastify, { FastifyInstance } from "fastify";
```

ဒီ ကိစ္စအားလုံးကို လွှမ်းခြုံနိုင်ဖို့ဆိုရင် JavaScript code က ဒီ patterns တွေ အားလုံးကို တကယ်ပဲ ပံ့ပိုးပေးနိုင်ဖို့ လိုအပ်ပါတယ်။ ဒီလို ပုံစံ အများအပြားကို ပံ့ပိုးဖို့ဆိုရင် CommonJS module တစ်ခုက ဒီလိုမျိုး ရှိနေဖို့ လိုပါလိမ့်မယ်:

```js
class FastifyInstance {}

function fastify() {
  return new FastifyInstance();
}

fastify.FastifyInstance = FastifyInstance;

// Allows for { fastify }
fastify.fastify = fastify;
// Allows for strict ES Module support
fastify.default = fastify;
// Sets the default export
module.exports = fastify;
```

## Modules တွေထဲက Types (Types in Modules)

Type မရှိသေးတဲ့ JavaScript code တစ်ခုအတွက် type တစ်ခု ထောက်ပံ့ပေးချင်တဲ့ အခြေအနေမျိုး ကြုံရနိုင်ပါတယ်

```js
function getArrayMetadata(arr) {
  return {
    length: getArrayLength(arr),
    firstObject: arr[0],
  };
}

module.exports = {
  getArrayMetadata,
};
```

ဒါကို ဒီလိုမျိုး ဖော်ပြနိုင်ပါတယ်:

```ts
export type ArrayMetadata = {
  length: number;
  firstObject: any | undefined;
};
export function getArrayMetadata(arr: any[]): ArrayMetadata;
```

ဒီ ဥပမာက [generics သုံးခြင်း](/docs/typescript/generics#generic-types) အားဖြင့် ပိုကြွယ်ဝတဲ့ (richer) type အချက်အလက်တွေ ပေးဖို့ သင့်တော်တဲ့ ဥပမာကောင်းတစ်ခုပါ:

```ts
export type ArrayMetadata<ArrType> = {
  length: number;
  firstObject: ArrType | undefined;
};

export function getArrayMetadata<ArrType>(
  arr: ArrType[]
): ArrayMetadata<ArrType>;
```

အခုဆိုရင် array ရဲ့ type က `ArrayMetadata` type ထဲကို ပြန့်ပွား (propagate) သွားပါပြီ။

ပြီးတော့ export လုပ်ထားတဲ့ types တွေကို module တွေရဲ့ သုံးစွဲသူတွေက — TypeScript code ထဲမှာ `import` ဒါမှမဟုတ် `import type` သုံးပြီးဖြစ်စေ၊ [JSDoc imports](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types) သုံးပြီးဖြစ်စေ — ပြန်လည် အသုံးပြုနိုင်ပါတယ်။

### Module Code ထဲက Namespaces (Namespaces in Module Code)

JavaScript code တွေရဲ့ runtime (လည်ပတ်ချိန်) ဆက်နွယ်မှုကို ဖော်ပြဖို့ ကြိုးစားတာက သိမ်မွေ့နိုင်ပါတယ်။ ES Module ပုံစံ syntax က exports တွေကို ဖော်ပြဖို့ လုံလောက်တဲ့ ကိရိယာတွေ မပေးနိုင်ဘူးဆိုရင် — `namespaces` တွေကို သုံးနိုင်ပါတယ်။

ဥပမာ — ရှုပ်ထွေးလွန်းတဲ့အတွက် သင့် `.d.ts` ထဲမှာ namespace လုပ်ပြီး စုစည်းထားဖို့ ရွေးချယ်မိနိုင်တဲ့ types တွေ သင့်မှာ ရှိနေနိုင်ပါတယ်:

```ts
// This represents the JavaScript class which would be available at runtime
export class API {
  constructor(baseURL: string);
  getInfo(opts: API.InfoRequest): API.InfoResponse;
}

// This namespace is merged with the API class and allows for consumers, and this file
// to have types which are nested away in their own sections.
declare namespace API {
  export interface InfoRequest {
    id: string;
  }

  export interface InfoResponse {
    width: number;
    height: number;
  }
}
```

`.d.ts` files တွေထဲမှာ namespaces တွေ ဘယ်လို အလုပ်လုပ်လဲ နားလည်ဖို့ဆိုရင် [`.d.ts` deep dive](/docs/typescript/declaration-deep-dive) ကို ဖတ်ပါ။

### ရွေးချယ်နိုင်သော Global အသုံးပြုမှု (Optional Global Usage)

သင့် module က UMD contexts (module loader မရှိတဲ့ environment မှာ global အနေနဲ့ ရနိုင်တဲ့ အခြေအနေမျိုး) တွေမှာ global scope ထဲမှာ ရနိုင်မယ်ဆိုတာကို ကြေညာဖို့ `export as namespace` ကို သုံးနိုင်ပါတယ်:

```ts
export as namespace moduleName;
```

## ကိုးကားစရာ ဥပမာ (Reference Example)

အပိုင်းအစတွေ အားလုံး ဘယ်လို ပေါင်းစပ်သွားနိုင်လဲဆိုတဲ့ စိတ်ကူးရစေဖို့ — module အသစ်တစ်ခု ဖန်တီးတဲ့အခါ စတင်နိုင်ဖို့ အတွက် reference `.d.ts` တစ်ခုကို ဒီမှာ ဖော်ပြပေးထားပါတယ်:

```ts
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ This is the module template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ If this module is a UMD module that exposes a global variable 'myLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
export as namespace myLib;

/*~ If this module exports functions, declare them like so.
 */
export function myFunction(a: string): string;
export function myOtherFunction(a: number): number;

/*~ You can declare types that are available via importing the module */
export interface SomeType {
  name: string;
  length: number;
  extras?: string[];
}

/*~ You can declare properties of the module using const, let, or var */
export const myField: number;
```

### Library ရဲ့ File Layout (Library File Layout)

သင့် declaration files တွေရဲ့ layout (ဖွဲ့စည်းပုံ) က library ရဲ့ layout ကို ထင်ဟပ်နေသင့်ပါတယ်။

Library တစ်ခုက module အများအပြား ပါဝင်နိုင်ပါတယ် — ဥပမာ:

```
myLib
  +---- index.js
  +---- foo.js
  +---- bar
         +---- index.js
         +---- baz.js
```

ဒါတွေကို ဒီလိုမျိုး import လုပ်နိုင်ပါတယ်:

```js
var a = require("myLib");
var b = require("myLib/foo");
var c = require("myLib/bar");
var d = require("myLib/bar/baz");
```

ဒါကြောင့် သင့် declaration files တွေက ဒီလိုမျိုး ရှိသင့်ပါတယ်:

```
@types/myLib
  +---- index.d.ts
  +---- foo.d.ts
  +---- bar
         +---- index.d.ts
         +---- baz.d.ts
```

### သင့် Types တွေကို စမ်းသပ်ခြင်း (Testing Your Types)

ဒီပြောင်းလဲမှုတွေကို လူတိုင်း အသုံးပြုနိုင်ဖို့ DefinitelyTyped ဆီ တင်သွင်းဖို့ စီစဉ်နေတယ်ဆိုရင် — အောက်ပါအတိုင်း လုပ်ဖို့ အကြံပြုပါတယ်:

> 1. `node_modules/@types/[libname]` ထဲမှာ folder အသစ်တစ်ခု ဖန်တီးပါ
> 2. အဲဒီ folder ထဲမှာ `index.d.ts` တစ်ခု ဖန်တီးပြီး — ဥပမာ code ကို ကူးထည့်ပါ
> 3. Module ကို သင့် အသုံးပြုမှု ဘယ်နေရာတွေမှာ ပျက်သွားလဲ ကြည့်ပြီး — index.d.ts ကို စတင် ဖြည့်စွက်ပါ
> 4. အဆင်ပြေပြီဆိုရင် [DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped) ကို clone လုပ်ပြီး — README ထဲက ညွှန်ကြားချက်တွေ အတိုင်း လုပ်ဆောင်ပါ။

မဟုတ်ရင်တော့

> 1. သင့် source tree ရဲ့ root မှာ ဖိုင်အသစ်တစ်ခု ဖန်တီးပါ: `[libname].d.ts`
> 2. `declare module "[libname]" {  }` ကို ထည့်ပါ
> 3. declare module ရဲ့ braces ({ }) အတွင်းမှာ template ကို ထည့်ပြီး — သင့် အသုံးပြုမှု ဘယ်နေရာတွေမှာ ပျက်လဲ ကြည့်ပါ
