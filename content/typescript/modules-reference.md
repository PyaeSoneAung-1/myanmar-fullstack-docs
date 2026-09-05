---
title: "Modules: Reference (Modules ကိုးကားချက်)"
description: "Modules series ၏ reference စာမျက်နှာ — module syntax ပုံစံများ ၊ module နှင့် moduleResolution compiler options တစ်ခုချင်းစီ၏ အသေးစိတ် (node16/nodenext ၊ preserve ၊ bundler ၊ paths ၊ package.json fields များ အပါအဝင်)"
order: 51
source: "https://www.typescriptlang.org/docs/handbook/modules/reference.html"
status: translated
updated: 2026-09-05
---

## Module syntax (Module ရေးသားရာတွင် သုံးသော syntax)

TypeScript compiler က TypeScript နဲ့ JavaScript files တွေထဲမှာ ရှိတဲ့ standard [ECMAScript module syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) တွေကိုရော — JavaScript files တွေထဲမှာ ရှိတဲ့ [CommonJS syntax](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#commonjs-modules-are-supported) ပုံစံများစွာကိုပါ မှတ်မိနားလည်ပါတယ်။

ဒါ့အပြင် — TypeScript files တွေမှာ ဒါမှမဟုတ် JSDoc comments တွေထဲမှာ (နှစ်မျိုးလုံးမှာလည်း) သုံးလို့ရတဲ့ TypeScript အတွက်သာ သီးသန့်ဖြစ်တဲ့ syntax extensions အနည်းငယ်လည်း ရှိပါသေးတယ်။

### Importing and exporting TypeScript-specific declarations (TypeScript-specific declarations များကို import/export လုပ်ခြင်း)

Type aliases ၊ interfaces ၊ enums နဲ့ namespaces တွေကို — standard JavaScript declaration တစ်ခုလိုပဲ — `export` modifier တစ်ခုနဲ့ module တစ်ခုကနေ export လုပ်လို့ရပါတယ်:

```ts
// Standard JavaScript syntax...
export function f() {}
// ...extended to type declarations
export type SomeType = /* ... */;
export interface SomeInterface { /* ... */ }
```

သူတို့ကို named exports တွေထဲမှာလည်း — standard JavaScript declarations တွေဆီ ရည်ညွှန်းတာတွေနဲ့ တွဲဖက်ပြီးတော့တောင် — ရည်ညွှန်းနိုင်ပါတယ်:

```ts
export { f, SomeType, SomeInterface };
```

Export လုပ်ထားတဲ့ types တွေ (နဲ့ တခြား TypeScript-specific declarations တွေ) ကို standard ECMAScript imports တွေနဲ့ import လုပ်နိုင်ပါတယ်:

```ts
import { f, SomeType, SomeInterface } from "./module.js";
```

Namespace imports ဒါမှမဟုတ် exports တွေကို သုံးတဲ့အခါ — export လုပ်ထားတဲ့ types တွေကို type position တစ်ခုထဲမှာ ရည်ညွှန်းတဲ့အခါ namespace ပေါ်မှာ ရနိုင်ပါတယ်:

```ts
import * as mod from "./module.js";
mod.f();
mod.SomeType; // Property 'SomeType' does not exist on type 'typeof import("./module.js")'
let x: mod.SomeType; // Ok
```

### Type-only imports and exports (Type သက်သက်အတွက်သာ imports/exports များ)

Imports တွေနဲ့ exports တွေကို JavaScript ဆီ emit လုပ်တဲ့အခါ — TypeScript က ပုံမှန်အားဖြင့် type positions တွေထဲမှာပဲ သုံးထားတဲ့ imports တွေကိုရော — types တွေကိုပဲ ရည်ညွှန်းတဲ့ exports တွေကိုပါ — အလိုအလျောက် elide (emit မလုပ်ဘဲ ဖယ်ရှား) လုပ်ပါတယ်။ Type-only imports နဲ့ exports တွေကို သုံးပြီး ဒီအပြုအမူကို အတင်းအကျပ် ဖြစ်စေနိုင်ပြီး — elision ကို သိသာထင်ရှားအောင်လည်း လုပ်နိုင်ပါတယ်။ `import type` နဲ့ ရေးထားတဲ့ import declarations တွေ ၊ `export type { ... }` နဲ့ ရေးထားတဲ့ export declarations တွေ ၊ ပြီးတော့ `type` keyword နဲ့ ရှေ့ဆင်ထားတဲ့ import/export specifiers တွေ — အားလုံးက output JavaScript ကနေ elide လုပ်ခံရမှာ သေချာပါတယ်။

```ts
// @Filename: main.ts
import { f, type SomeInterface } from "./module.js";
import type { SomeType } from "./module.js";

class C implements SomeInterface {
  constructor(p: SomeType) {
    f();
  }
}

export type { C };

// @Filename: main.js
import { f } from "./module.js";

class C {
  constructor(p) {
    f();
  }
}
```

Values တွေကိုတော့ `import type` နဲ့တောင် import လုပ်လို့ရပါတယ် — ဒါပေမယ့် သူတို့က output JavaScript ထဲမှာ မရှိတော့တာမို့ — emit (code ထုတ်လွှတ်) လုပ်တဲ့ positions တွေမှာပဲ သုံးလို့ရပါတယ်:

```ts
import type { f } from "./module.js";
f(); // 'f' cannot be used as a value because it was imported using 'import type'
let otherFunction: typeof f = () => {}; // Ok
```

Type-only import declaration တစ်ခုက default import တစ်ခုနဲ့ named bindings တွေကို တစ်ပြိုင်နက် ကြေညာလို့ မရပါဘူး — `type` က default import ကို သက်ရောက်တာလား ၊ import declaration တစ်ခုလုံးကို သက်ရောက်တာလားဆိုတာ ဝေဝါးနေလို့ပါ။ အဲဒီအစား — import declaration ကို နှစ်ပိုင်း ခွဲလိုက်ပါ ၊ ဒါမှမဟုတ် `default` ကို named binding အနေနဲ့ သုံးလိုက်ပါ:

```ts
import type fs, { BigIntOptions } from "fs";
//          ^^^^^^^^^^^^^^^^^^^^^
// Error: A type-only import can specify a default import or named bindings, but not both.

import type { default as fs, BigIntOptions } from "fs"; // Ok
```

### `import()` types (Import declaration မရေးဘဲ module type ရယူခြင်း)

TypeScript က — JavaScript ရဲ့ dynamic `import` နဲ့ ဆင်တူတဲ့ type syntax တစ်ခုကို ပေးပါတယ် — import declaration တစ်ခု မရေးပဲနဲ့ module တစ်ခုရဲ့ type ကို ရည်ညွှန်းနိုင်ဖို့ပါ:

```ts
// Access an exported type:
type WriteFileOptions = import("fs").WriteFileOptions;
// Access the type of an exported value:
type WriteFileFunction = typeof import("fs").writeFile;
```

ဒါက JavaScript files တွေထဲက JSDoc comments တွေမှာ အထူး အသုံးဝင်ပါတယ် — အဲဒီနေရာတွေမှာ types တွေကို တခြားနည်းနဲ့ import လုပ်ဖို့ မဖြစ်နိုင်လို့ပါ:

```ts
/** @type {import("webpack").Configuration} */
module.exports = {
  // ...
}
```

### `export =` and `import = require()` (`export =` နဲ့ `import = require()` ပုံစံများ)

CommonJS modules တွေကို emit လုပ်တဲ့အခါ — TypeScript files တွေက JavaScript ရဲ့ `module.exports = ...` နဲ့ `const mod = require("...")` syntax တွေရဲ့ တိုက်ရိုက် နှိုင်းယှဉ်စရာ (analog) ပုံစံကို သုံးနိုင်ပါတယ်:

```ts
// @Filename: main.ts
import fs = require("fs");
export = fs.readFileSync("...");

// @Filename: main.js
"use strict";
const fs = require("fs");
module.exports = fs.readFileSync("...");
```

ဒီ syntax ကို JavaScript နည်းလမ်းတွေထက် သုံးခဲ့ကြတာက — variable declarations တွေနဲ့ property assignments တွေက TypeScript types တွေကို ရည်ညွှန်းလို့ မရခဲ့လို့ပါ — အထူး TypeScript syntax ကျတော့ ရည်ညွှန်းလို့ ရခဲ့တယ်လေ:

```ts
// @Filename: a.ts
interface Options { /* ... */ }
module.exports = Options; // Error: 'Options' only refers to a type, but is being used as a value here.
export = Options; // Ok

// @Filename: b.ts
const Options = require("./a");
const options: Options = { /* ... */ }; // Error: 'Options' refers to a value, but is being used as a type here.

// @Filename: c.ts
import Options = require("./a");
const options: Options = { /* ... */ }; // Ok
```

### Ambient modules (Runtime ထဲမှာ ရှိပြီး file မရှိသော modules များကို ကြေညာခြင်း)

TypeScript က script (module မဟုတ်တဲ့) files တွေထဲမှာ — runtime ထဲမှာ တည်ရှိပေမယ့် သက်ဆိုင်တဲ့ file မရှိတဲ့ module တစ်ခုကို ကြေညာဖို့ syntax တစ်ခုကို ထောက်ပံ့ပေးပါတယ်။ ဒီ _ambient modules_ တွေက အများအားဖြင့် — Node.js ထဲက `"fs"` ဒါမှမဟုတ် `"path"` လိုမျိုး — runtime ဘက်က ထောက်ပံ့ပေးထားတဲ့ modules တွေကို ကိုယ်စားပြုပါတယ်:

```ts
declare module "path" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export var sep: string;
}
```

Ambient module တစ်ခုကို TypeScript program ထဲ load လုပ်ပြီးတာနဲ့ — TypeScript က တခြား files တွေထဲမှာ ကြေညာထားတဲ့ module ကို import လုပ်တာတွေကို မှတ်မိနားလည်ပါလိမ့်မယ်:

```ts
// 👇 Ensure the ambient module is loaded -
//    may be unnecessary if path.d.ts is included
//    by the project tsconfig.json somehow.
/// <reference path="path.d.ts" />

import { normalize, join } from "path";
```

Ambient module declarations တွေက — syntax တူညီနေလို့ — [module augmentations](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) တွေနဲ့ ရောထွေးဖို့ လွယ်ပါတယ်။ File က module တစ်ခု ဖြစ်နေတဲ့အခါ — ဆိုလိုတာက top-level `import` ဒါမှမဟုတ် `export` statement တစ်ခု ပါနေတဲ့အခါ (ဒါမှမဟုတ် [`--moduleDetection force` ဒါမှမဟုတ် `auto`](https://www.typescriptlang.org/tsconfig#moduleDetection) ရဲ့ သက်ရောက်မှု ခံရတဲ့အခါ) — ဒီ module declaration syntax က module augmentation တစ်ခု ဖြစ်သွားပါတယ်:

```ts
// Not an ambient module declaration anymore!
export {};
declare module "path" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export var sep: string;
}
```

Ambient modules တွေက module declaration ရဲ့ body ထဲမှာ imports တွေကို သုံးပြီး တခြား modules တွေဆီ ရည်ညွှန်းနိုင်ပါတယ် — ဒါက ပါဝင်တဲ့ file ကို module အဖြစ် ပြောင်းလဲမသွားစေပါဘူး (ပြောင်းသွားရင် ambient module declaration က module augmentation ဖြစ်သွားမှာမို့ပါ):

```ts
declare module "m" {
  // Moving this outside "m" would totally change the meaning of the file!
  import { SomeType } from "other";
  export function f(): SomeType;
}
```

_Pattern_ ambient module တစ်ခုက သူ့ရဲ့ name ထဲမှာ `*` wildcard character တစ်ခုတည်း ပါဝင်ပြီး — import paths တွေထဲက character သုည ဒါမှမဟုတ် ဒီထက်မက ကိုက်ညီပါတယ်။ Custom loaders တွေက ထောက်ပံ့ပေးတဲ့ modules တွေကို ကြေညာဖို့ ဒါက အသုံးဝင်နိုင်ပါတယ်:

```ts
declare module "*.html" {
  const content: string;
  export default content;
}
```

## The `module` compiler option (output module format ထိန်းချုပ်သော compiler option)

ဒီ section က `module` compiler option value တစ်ခုချင်းစီရဲ့ အသေးစိတ်တွေကို ဆွေးနွေးပါတယ်။ ဒီ option က ဘာလဲ ၊ compilation လုပ်ငန်းစဉ်တစ်ခုလုံးထဲမှာ ဘယ်လို နေရာယူထားလဲဆိုတဲ့ နောက်ခံအကြောင်း ပိုသိချင်ရင် [_Module output format_](/docs/typescript/modules-theory) theory section ကို ကြည့်ပါ။ အကျဉ်းပြောရရင် — `module` compiler option က သမိုင်းအရဆိုရင် — emit လုပ်လိုက်တဲ့ JavaScript files တွေရဲ့ output module format ကိုပဲ ထိန်းချုပ်ဖို့ သုံးခဲ့တာပါ။ ဒါပေမယ့် — ပိုလတ်တလော `node16` ၊ `node18` နဲ့ `nodenext` values တွေကျတော့ — ဘယ် module formats တွေကို ထောက်ပံ့လဲ ၊ file တစ်ခုချင်းစီရဲ့ module format ကို ဘယ်လို ဆုံးဖြတ်လဲ ၊ module formats မတူညီတာတွေ အချင်းချင်း ဘယ်လို အပြန်အလှန် ဆက်စပ်လည်ပတ်လဲ စတဲ့ Node.js ရဲ့ module system ရဲ့ လက္ခဏာရပ်များစွာကို ဖော်ပြပါတယ်။

### `node16`, `node18`, `node20`, `nodenext` (Node.js module system mode များ)

Node.js က CommonJS ရော ECMAScript modules ရော နှစ်မျိုးလုံးကို ထောက်ပံ့ပါတယ် — file တစ်ခုစီက format ဘယ်လိုမျိုး ဖြစ်နိုင်လဲ ၊ format နှစ်မျိုးကို ဘယ်လို အပြန်အလှန် အသုံးပြုခွင့် ရှိလဲဆိုတဲ့ သတ်မှတ်ထားတဲ့ စည်းမျဉ်းတွေနဲ့ပါ။ `node16` ၊ `node18` နဲ့ `nodenext` တွေက Node.js ရဲ့ dual-format module system ရဲ့ အပြုအမူ အစုံအလင်ကို ဖော်ပြပြီး — **CommonJS ဒါမှမဟုတ် ESM format နဲ့ files တွေကို emit လုပ်ပါတယ်**။ ဒါက တခြား `module` options တွေနဲ့ မတူပါဘူး — အဲဒါတွေက runtime-agnostic (runtime မရွေး အလုပ်လုပ်) ဖြစ်ပြီး — output files အားလုံးကို format တစ်ခုတည်းအဖြစ် အတင်းအကျပ် သွင်းကာ — output က သူတို့ရဲ့ runtime အတွက် မှန်ကန်မှု ရှိမရှိ သေချာအောင် user တွေဘက်က လုပ်ရပါတယ်။

> လွဲမှားနေတတ်တဲ့ အယူအဆတစ်ခုကတော့ — `node16`—`nodenext` က ES modules တွေကိုပဲ emit လုပ်တယ်ဆိုတာပါ။ တကယ်တော့ ဒီ modes တွေက ES modules တွေကို _အသုံးပြုတဲ့_ projects တွေကိုသာ ဖော်ပြတာမဟုတ်ဘဲ — ES modules တွေကို _ထောက်ပံ့တဲ့_ Node.js ဗားရှင်းတွေကို ဖော်ပြတာပါ။ File တစ်ခုချင်းစီရဲ့ [detected module format](https://www.typescriptlang.org/docs/handbook/modules) ပေါ်မူတည်ပြီး — ESM ရော CommonJS emit ရော နှစ်မျိုးလုံး ထောက်ပံ့ပါတယ်။ Node.js ရဲ့ dual module system ရဲ့ ရှုပ်ထွေးမှုတွေကို ထင်ဟပ်ပြတဲ့ `module` options တွေက ဒါတွေပဲ ဖြစ်လို့ — ES modules သုံးသည်ဖြစ်စေ မသုံးသည်ဖြစ်စေ — Node.js v12 ဒါမှမဟုတ် နောက်ပိုင်းမှာ run ဖို့ ရည်ရွယ်ထားတဲ့ app တွေရော library တွေရော အားလုံးအတွက်ပါ — ဒါတွေကပဲ **မှန်ကန်တဲ့ `module` options** တွေ ဖြစ်ပါတယ်။

Fixed-version ဖြစ်တဲ့ `node16` နဲ့ `node18` modes တွေက သူတို့နဲ့ သက်ဆိုင်တဲ့ Node.js ဗားရှင်းတွေထဲမှာ တည်ငြိမ်သွားတဲ့ module system အပြုအမူကို ကိုယ်စားပြုပြီး — `nodenext` mode ကျတော့ Node.js ရဲ့ နောက်ဆုံး stable ဗားရှင်းတွေနဲ့အညီ ပြောင်းလဲနေပါတယ်။ Mode သုံးခုကြားက လက်ရှိ ကွာခြားချက်တွေကို အောက်က table မှာ အကျဉ်းချုပ် ဖော်ပြထားပါတယ်:

|          | `target` | `moduleResolution` | import assertions | import attributes | JSON imports        | require(esm) |
|----------|----------|--------------------|-------------------|-------------------|---------------------|--------------|
| node16   | `es2022` | `node16`           | ❌                | ❌                 | ကန့်သတ်ချက် မရှိ        | ❌           |
| node18   | `es2022` | `node16`           | ✅                | ✅                 | `type "json"` လိုအပ်  | ❌           |
| nodenext | `esnext` | `nodenext`         | ❌                | ✅                 | `type "json"` လိုအပ်  | ✅           |

#### Module format detection (Module format ခွဲခြားသိရှိခြင်း)

- `.mts`/`.mjs`/`.d.mts` files တွေက အမြဲတမ်း ES modules တွေပါ။
- `.cts`/`.cjs`/`.d.cts` files တွေက အမြဲတမ်း CommonJS modules တွေပါ။
- `.ts`/`.tsx`/`.js`/`.jsx`/`.d.ts` files တွေကတော့ — အနီးဆုံး ဘိုးဘေး (ancestor) package.json file ထဲမှာ `"type": "module"` ပါရင် ES modules ၊ မပါရင် CommonJS modules တွေပါ။

Input `.ts`/`.tsx`/`.mts`/`.cts` files တွေရဲ့ သိရှိထားတဲ့ module format က emit လုပ်လိုက်တဲ့ JavaScript files တွေရဲ့ module format ကို ဆုံးဖြတ်ပေးပါတယ်။ ဥပမာ — `.ts` files တွေချည်းပဲ ပါတဲ့ project တစ်ခုက `--module nodenext` အောက်မှာ default အနေနဲ့ CommonJS modules တွေအားလုံးကို emit လုပ်ပြီး — project ရဲ့ package.json ထဲ `"type": "module"` ထည့်လိုက်ရင် ES modules တွေအားလုံးအဖြစ် emit လုပ်အောင် လုပ်နိုင်ပါတယ်။

#### Interoperability rules (ESM/CJS အပြန်အလှန် ဆက်စပ်မှု စည်းမျဉ်းများ)

- **ES module တစ်ခုက CommonJS module တစ်ခုကို ရည်ညွှန်းတဲ့အခါ:**
  - CommonJS module ရဲ့ `module.exports` ကို ES module ဘက်က default import တစ်ခုအနေနဲ့ ရနိုင်ပါတယ်။
  - CommonJS module ရဲ့ `module.exports` ရဲ့ properties တွေ (`default` ကလွဲလို့) က ES module ဘက်က named imports တွေအနေနဲ့ ရနိုင်လည်း ရှိ ၊ မရနိုင်လည်း ရှိပါတယ်။ Node.js က [static analysis](https://github.com/nodejs/cjs-module-lexer) ကနေတစ်ဆင့် သူတို့ကို ရနိုင်အောင် ကြိုးစားပါတယ်။ TypeScript က declaration file တစ်ခုကနေ အဲဒီ static analysis အောင်မြင်မလား ဆိုတာ မသိနိုင်လို့ — အောင်မြင်မယ်လို့ အကောင်းမြင် (optimistic) အနေနဲ့ ယူဆထားပါတယ်။ ဒါက runtime မှာ crash ဖြစ်နိုင်တဲ့ named imports တွေကို TypeScript ဘက်က ဖမ်းဆီးနိုင်စွမ်းကို ကန့်သတ်ပေးပါတယ်။ အသေးစိတ်ကို [#54018](https://github.com/microsoft/TypeScript/issues/54018) မှာ ကြည့်ပါ။
- **CommonJS module တစ်ခုက ES module တစ်ခုကို ရည်ညွှန်းတဲ့အခါ:**
  - `node16` နဲ့ `node18` တွေမှာ — `require` က ES module တစ်ခုကို ရည်ညွှန်းလို့ မရပါဘူး။ TypeScript အတွက်ဆိုရင် — [detected](https://www.typescriptlang.org/docs/handbook/modules) CommonJS modules တွေလို့ သတ်မှတ်ထားတဲ့ files တွေထဲက `import` statements တွေလည်း ဒီထဲ ပါဝင်ပါတယ် — အဲဒီ `import` statements တွေက emit လုပ်ထားတဲ့ JavaScript ထဲမှာ `require` calls တွေအဖြစ် ပြောင်းလဲခံရလို့ပါ။
  - `nodenext` မှာတော့ — Node.js v22.12.0 နဲ့ နောက်ပိုင်းတွေရဲ့ အပြုအမူကို ထင်ဟပ်ဖို့ — `require` က ES module တစ်ခုကို ရည်ညွှန်းနိုင်ပါတယ်။ Node.js မှာတော့ — ES module ဒါမှမဟုတ် သူ import လုပ်ထားတဲ့ module တစ်ခုခုက top-level `await` ကို သုံးထားရင် error တစ်ခု throw လုပ်ပါတယ်။ TypeScript က ဒီကိစ္စကို detect လုပ်ဖို့ မကြိုးစားတာမို့ — compile-time error တစ်ခုကိုလည်း emit လုပ်မှာ မဟုတ်ပါဘူး။ `require` call ရဲ့ ရလဒ်က module ရဲ့ Module Namespace Object ပါ — ဆိုလိုတာက တူညီတဲ့ module ကို `await import()` လုပ်ရင် ရမယ့် ရလဒ်နဲ့ အတူတူပါပဲ (ဘာကိုမှ `await` လုပ်စရာ မလိုဘူးဆိုတာပဲ ကွာပါတယ်)။
  - Dynamic `import()` call တစ်ခုကိုတော့ ES module တစ်ခုကို import လုပ်ဖို့ အမြဲတမ်း သုံးလို့ရပါတယ်။ သူက module ရဲ့ Module Namespace Object ရဲ့ Promise တစ်ခုကို ပြန်ပေးပါတယ် (တခြား ES module တစ်ခုကနေ `import * as ns from "./module.js"` လုပ်ရင် ရမယ့်အရာပါ)။

#### Emit (Output ထုတ်လွှတ်မှု)

File တစ်ခုချင်းစီရဲ့ emit format ကို အဲဒီ file ရဲ့ [detected module format](https://www.typescriptlang.org/docs/handbook/modules) နဲ့ ဆုံးဖြတ်ပါတယ်။ ESM emit က [`--module esnext`](https://www.typescriptlang.org/docs/handbook/modules) နဲ့ ဆင်တူပေမယ့် — `--module esnext` မှာ ခွင့်မပြုတဲ့ `import x = require("...")` အတွက် အထူး transformation တစ်ခု ပါပါတယ်:

```ts
// @Filename: main.ts
import x = require("mod");
```

```js
// @Filename: main.js
import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const x = __require("mod");
```

CommonJS emit ကတော့ [`--module commonjs`](https://www.typescriptlang.org/docs/handbook/modules) နဲ့ ဆင်တူပေမယ့် — dynamic `import()` calls တွေကို transform မလုပ်ပါဘူး။ ဒီမှာ Emit ကို `esModuleInterop` ဖွင့်ထားတဲ့အနေနဲ့ ပြထားပါတယ်:

```ts
// @Filename: main.ts
import fs from "fs"; // transformed
const dynamic = import("mod"); // not transformed
```

```js
// @Filename: main.js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs")); // transformed
const dynamic = import("mod"); // not transformed
```

#### Implied and enforced options (အလိုအလျောက် ပါဝင်ပြီး အတင်းအကျပ် သတ်မှတ်ခံရသော options)

- `--module nodenext` က `--moduleResolution nodenext` ကို imply လုပ်ပြီး enforce လုပ်ပါတယ်။
- `--module node18` ဒါမှမဟုတ် `node16` က `--moduleResolution node16` ကို imply လုပ်ပြီး enforce လုပ်ပါတယ်။
- `--module nodenext` က `--target esnext` ကို imply လုပ်ပါတယ်။
- `--module node18` ဒါမှမဟုတ် `node16` က `--target es2022` ကို imply လုပ်ပါတယ်။
- `--module nodenext` ၊ `node18` ဒါမှမဟုတ် `node16` က `--esModuleInterop` ကို imply လုပ်ပါတယ်။

#### Summary (အကျဉ်းချုပ်)

- `node16` ၊ `node18` နဲ့ `nodenext` တွေက — ES modules သုံးသည်ဖြစ်စေ မသုံးသည်ဖြစ်စေ — Node.js v12 ဒါမှမဟုတ် နောက်ပိုင်းမှာ run ဖို့ ရည်ရွယ်ထားတဲ့ app တွေရော library တွေရော အားလုံးအတွက် မှန်ကန်တဲ့ `module` options တွေပဲ ဖြစ်ပါတယ်။
- `node16` ၊ `node18` နဲ့ `nodenext` တွေက — file တစ်ခုချင်းစီရဲ့ [detected module format](https://www.typescriptlang.org/docs/handbook/modules) ပေါ်မူတည်ပြီး — CommonJS ဒါမှမဟုတ် ESM format နဲ့ emit လုပ်ပါတယ်။
- Node.js ရဲ့ ESM နဲ့ CJS ကြားက interoperability စည်းမျဉ်းတွေကို type checking ထဲမှာ ထင်ဟပ်ဖော်ပြပါတယ်။
- ESM emit က `import x = require("...")` ကို — `createRequire` import တစ်ခုကနေ တည်ဆောက်ထားတဲ့ `require` call တစ်ခုအဖြစ် — transform လုပ်ပါတယ်။
- CommonJS emit က dynamic `import()` calls တွေကို transform မလုပ်ဘဲ ချန်ထားလို့ — CommonJS modules တွေက ES modules တွေကို asynchronously import လုပ်နိုင်ပါတယ်။

### `preserve` (import/export ပုံစံများကို မူလအတိုင်း ထိန်းသိမ်းသည့် mode)

`--module preserve` ([TypeScript 5.4 မှာ ထည့်သွင်းခဲ့](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html#support-for-require-calls-in---moduleresolution-bundler-and---module-preserve)တာ) မှာ — input files တွေထဲမှာ ရေးထားတဲ့ ECMAScript imports တွေနဲ့ exports တွေကို output ထဲမှာ မူလအတိုင်း ထိန်းသိမ်းပြီး — CommonJS ပုံစံ `import x = require("...")` နဲ့ `export = ...` statements တွေကိုတော့ CommonJS `require` နဲ့ `module.exports` အဖြစ် emit လုပ်ပါတယ်။ တစ်နည်းပြောရရင် — import/export statement တစ်ခုချင်းစီရဲ့ format ကို — compilation တစ်ခုလုံး (ဒါမှမဟုတ် file တစ်ခုလုံးတောင်) အတွက် format တစ်ခုတည်းအဖြစ် အတင်းအကျပ် သွင်းခြင်းမျိုး မဟုတ်ဘဲ — မူလအတိုင်း ထိန်းသိမ်းထားတာပါ။

File တစ်ခုတည်းထဲမှာ imports တွေနဲ့ require calls တွေ ရောသုံးဖို့ လိုအပ်တာက ရှားပါတယ် — ဒါပေမယ့် ဒီ `module` mode က ခေတ်သစ် bundlers အများစုရဲ့ စွမ်းဆောင်ရည်တွေကိုရော Bun runtime ကိုပါ အကောင်းဆုံး ထင်ဟပ်ပါတယ်။

> bundler ဒါမှမဟုတ် Bun နဲ့ဆို — `noEmit` ပါ set လုပ်ထားနိုင်တာ ဖြစ်လို့ — TypeScript ရဲ့ `module` emit ကို ဘာလို့ ဂရုစိုက်ရတာလဲ? TypeScript ရဲ့ type checking ရော module resolution အပြုအမူရော — သူ _emit_ လုပ်မယ့် module format ရဲ့ သက်ရောက်မှုကို ခံရပါတယ်။ `module` ကို set လုပ်လိုက်တာက — bundler ဒါမှမဟုတ် runtime က imports တွေနဲ့ exports တွေကို ဘယ်လို process လုပ်မယ်ဆိုတဲ့ အချက်အလက်တွေကို TypeScript ဆီ ပေးလိုက်တာပါ — ဒါမှ imported values တွေပေါ်မှာ သင်မြင်ရတဲ့ types တွေက runtime မှာ ဒါမှမဟုတ် bundling အပြီးမှာ တကယ် ဖြစ်မယ့်အရာကို တိကျစွာ ထင်ဟပ်နေမှာပါ။ ဆက်လက်ဆွေးနွေးချက်အတွက် — [`--moduleResolution bundler`](https://www.typescriptlang.org/docs/handbook/modules) ကို ကြည့်ပါ။

#### Examples (ဥပမာများ)

```ts
// @Filename: main.ts
import x, { y, z } from "mod";
import mod = require("mod");
const dynamic = import("mod");

export const e1 = 0;
export default "default export";
```

```js
// @Filename: main.js
import x, { y, z } from "mod";
const mod = require("mod");
const dynamic = import("mod");

export const e1 = 0;
export default "default export";
```

#### Implied and enforced options (အလိုအလျောက် ပါဝင်ပြီး အတင်းအကျပ် သတ်မှတ်ခံရသော options)

- `--module preserve` က `--moduleResolution bundler` ကို imply လုပ်ပါတယ်။
- `--module preserve` က `--esModuleInterop` ကို imply လုပ်ပါတယ်။

> `--esModuleInterop` option က `--module preserve` ထဲမှာ — သူ့ရဲ့ [type checking](https://www.typescriptlang.org/docs/handbook/modules/appendices/esm-cjs-interop.html#allowsyntheticdefaultimports-and-esmoduleinterop) အပြုအမူအတွက်ပဲ — default အနေနဲ့ ဖွင့်ထားတာပါ။ `--module preserve` မှာ imports တွေက ဘယ်တော့မှ require calls တွေအဖြစ် transform မဖြစ်လို့ — `--esModuleInterop` က emit လုပ်လိုက်တဲ့ JavaScript ကို သက်ရောက်မှု မရှိပါဘူး။

### `es2015`, `es2020`, `es2022`, `esnext` (ES module format များဖြင့် emit လုပ်သော mode များ)

#### Summary (အကျဉ်းချုပ်)

- Bundlers တွေ ၊ Bun နဲ့ tsx တွေအတွက် — `esnext` ကို `--moduleResolution bundler` နဲ့ တွဲသုံးပါ။
- Node.js အတွက် မသုံးပါနဲ့။ Node.js အတွက် ES modules emit လုပ်ဖို့ package.json ထဲက `"type": "module"` နဲ့အတူ `node16` ၊ `node18` ဒါမှမဟုတ် `nodenext` ကို သုံးပါ။
- `import mod = require("mod")` ကို non-declaration files တွေထဲမှာ ခွင့်မပြုပါဘူး။
- `es2020` က `import.meta` properties တွေအတွက် support ထပ်ဖြည့်ပေးပါတယ်။
- `es2022` က top-level `await` အတွက် support ထပ်ဖြည့်ပေးပါတယ်။
- `esnext` က ရွေ့လျားနေတဲ့ target တစ်ခုပါ — ECMAScript modules အတွက် Stage 3 proposals တွေရဲ့ support တွေ ပါဝင်လာနိုင်ပါတယ်။
- Emit လုပ်လိုက်တဲ့ files တွေက ES modules တွေ ဖြစ်ပြီး — dependencies တွေကတော့ format မရွေး ဖြစ်နိုင်ပါတယ်။

#### Examples (ဥပမာများ)

```ts
// @Filename: main.ts
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);

export const e1 = 0;
export default "default export";
```

```js
// @Filename: main.js
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);

export const e1 = 0;
export default "default export";
```

### `commonjs` (CommonJS modules များအဖြစ် emit လုပ်သည့် mode)

#### Summary (အကျဉ်းချုပ်)

- ဒါကို သုံးစရာ မလိုပါဘူး။ Node.js အတွက် CommonJS modules emit လုပ်ဖို့ `node16` ၊ `node18` ဒါမှမဟုတ် `nodenext` ကို သုံးပါ။
- Emit လုပ်လိုက်တဲ့ files တွေက CommonJS modules တွေ ဖြစ်ပြီး — dependencies တွေကတော့ format မရွေး ဖြစ်နိုင်ပါတယ်။
- Dynamic `import()` ကို `require()` call တစ်ခုရဲ့ Promise တစ်ခုအဖြစ် transform လုပ်ပါတယ်။
- `esModuleInterop` က default နဲ့ namespace imports တွေအတွက် output code ကို သက်ရောက်ပါတယ်။

#### Examples (ဥပမာများ)

> Output ကို `esModuleInterop: false` နဲ့ ပြထားပါတယ်။

```ts
// @Filename: main.ts
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);

export const e1 = 0;
export default "default export";
```

```js
// @Filename: main.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.e1 = void 0;
const mod_1 = require("mod");
const mod = require("mod");
const dynamic = Promise.resolve().then(() => require("mod"));

console.log(mod_1.default, mod_1.y, mod_1.z, mod);
exports.e1 = 0;
exports.default = "default export";
```

`export =` ပုံစံပါတဲ့ ဥပမာကို ကြည့်ရအောင်:

```ts
// @Filename: main.ts
import mod = require("mod");
console.log(mod);

export = {
    p1: true,
    p2: false
};
```

```js
// @Filename: main.js
"use strict";
const mod = require("mod");
console.log(mod);

module.exports = {
    p1: true,
    p2: false
};
```

### `system` (SystemJS module loader အတွက် mode)

#### Summary (အကျဉ်းချုပ်)

- [SystemJS module loader](https://github.com/systemjs/systemjs) နဲ့ တွဲသုံးဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်။

#### Examples (ဥပမာများ)

```ts
// @Filename: main.ts
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);

export const e1 = 0;
export default "default export";
```

```js
// @Filename: main.js
System.register(["mod"], function (exports_1, context_1) {
    "use strict";
    var mod_1, mod, dynamic, e1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (mod_1_1) {
                mod_1 = mod_1_1;
                mod = mod_1_1;
            }
        ],
        execute: function () {
            dynamic = context_1.import("mod");
            console.log(mod_1.default, mod_1.y, mod_1.z, mod, dynamic);
            exports_1("e1", e1 = 0);
            exports_1("default", "default export");
        }
    };
});
```

### `amd` (AMD loaders များအတွက် mode)

#### Summary (အကျဉ်းချုပ်)

- RequireJS လို AMD loaders တွေအတွက် ဒီဇိုင်းထုတ်ထားပါတယ်။
- ဒါကို သုံးစရာ မလိုပါဘူး။ bundler တစ်ခုကို သုံးပါ။
- Emit လုပ်လိုက်တဲ့ files တွေက AMD modules တွေ ဖြစ်ပြီး — dependencies တွေကတော့ format မရွေး ဖြစ်နိုင်ပါတယ်။
- `outFile` ကို ထောက်ပံ့ပါတယ်။

#### Examples (ဥပမာများ)

```ts
// @Filename: main.ts
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);

export const e1 = 0;
export default "default export";
```

```js
// @Filename: main.js
define(["require", "exports", "mod", "mod"], function (require, exports, mod_1, mod) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.e1 = void 0;
    const dynamic = new Promise((resolve_1, reject_1) => { require(["mod"], resolve_1, reject_1); });

    console.log(mod_1.default, mod_1.y, mod_1.z, mod, dynamic);
    exports.e1 = 0;
    exports.default = "default export";
});
```

### `umd` (`umd` mode)

#### Summary (အကျဉ်းချုပ်)

- AMD ဒါမှမဟုတ် CommonJS loaders တွေအတွက် ဒီဇိုင်းထုတ်ထားပါတယ်။
- တခြား UMD wrappers အများစုလိုမျိုး global variable တစ်ခုကို ထုတ်ဖော်မပြပါဘူး။
- ဒါကို သုံးစရာ မလိုပါဘူး။ bundler တစ်ခုကို သုံးပါ။
- Emit လုပ်လိုက်တဲ့ files တွေက UMD modules တွေ ဖြစ်ပြီး — dependencies တွေကတော့ format မရွေး ဖြစ်နိုင်ပါတယ်။

#### Examples (ဥပမာများ)

```ts
// @Filename: main.ts
import x, { y, z } from "mod";
import * as mod from "mod";
const dynamic = import("mod");
console.log(x, y, z, mod, dynamic);

export const e1 = 0;
export default "default export";
```

```js
// @Filename: main.js
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "mod", "mod"], factory);
    }
})(function (require, exports) {
    "use strict";
    var __syncRequire = typeof module === "object" && typeof module.exports === "object";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.e1 = void 0;
    const mod_1 = require("mod");
    const mod = require("mod");
    const dynamic = __syncRequire ? Promise.resolve().then(() => require("mod")) : new Promise((resolve_1, reject_1) => { require(["mod"], resolve_1, reject_1); });

    console.log(mod_1.default, mod_1.y, mod_1.z, mod, dynamic);
    exports.e1 = 0;
    exports.default = "default export";
});
```

## The `moduleResolution` compiler option (module specifiers ဖြေရှင်းပုံကို ထိန်းချုပ်သည့် option)

ဒီ section က `moduleResolution` modes အများအပြားမှာ တူညီတဲ့ module resolution features တွေနဲ့ လုပ်ငန်းစဉ်တွေကို ဦးစွာ ဖော်ပြပြီး — mode တစ်ခုချင်းစီရဲ့ အသေးစိတ်တွေကို ဆက်လက် သတ်မှတ်ဖော်ပြပါတယ်။ ဒီ option က ဘာလဲ ၊ compilation လုပ်ငန်းစဉ်တစ်ခုလုံးထဲမှာ ဘယ်လို နေရာယူထားလဲဆိုတဲ့ နောက်ခံအကြောင်း ပိုသိချင်ရင် [_Module resolution_](/docs/typescript/modules-theory) theory section ကို ကြည့်ပါ။ အကျဉ်းပြောရရင် — `moduleResolution` က TypeScript က _module specifiers_ တွေ (`import`/`export`/`require` statements တွေထဲက string literals) ကို disk ပေါ်က files တွေဆီ ဘယ်လို resolve (ဖြေရှင်း) လဲဆိုတာကို ထိန်းချုပ်ပြီး — target runtime ဒါမှမဟုတ် bundler က သုံးတဲ့ module resolver နဲ့ ကိုက်ညီအောင် set လုပ်ထားသင့်ပါတယ်။

### Common features and processes (အားလုံးတွင် တူညီသော features များနဲ့ လုပ်ငန်းစဉ်များ)

#### File extension substitution (File extension အစားထိုးခြင်း)

TypeScript က အမြဲတမ်း — type information ပေးနိုင်တဲ့ file တစ်ခုဆီ internal အနေနဲ့ resolve လုပ်စေချင်ပြီး — runtime ဒါမှမဟုတ် bundler ကတော့ JavaScript implementation တစ်ခု ပေးတဲ့ file တစ်ခုဆီ တူညီတဲ့ path နဲ့ resolve လုပ်နိုင်ဖို့လည်း သေချာစေချင်ပါတယ်။ သတ်မှတ်ထားတဲ့ `moduleResolution` algorithm အရ — runtime ဒါမှမဟုတ် bundler ထဲမှာ JavaScript file တစ်ခုကို ရှာဖွေတာ (lookup) စတင်စေမယ့် module specifier တိုင်းအတွက် — TypeScript က ဦးစွာ — နာမည်တူ ၊ ဆင်တူတဲ့ file extension ရှိတဲ့ TypeScript implementation file ဒါမှမဟုတ် type declaration file တစ်ခုကို ရှာဖွေပါလိမ့်မယ်။

| Runtime lookup (Runtime ရှာဖွေမှု) | TypeScript lookup #1 (TypeScript ရှာဖွေမှု #1) | TypeScript lookup #2 (TypeScript ရှာဖွေမှု #2) | TypeScript lookup #3 (TypeScript ရှာဖွေမှု #3) | TypeScript lookup #4 (TypeScript ရှာဖွေမှု #4) | TypeScript lookup #5 (TypeScript ရှာဖွေမှု #5) |
| -------------- | -------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| `/mod.js`      | `/mod.ts`            | `/mod.tsx`           | `/mod.d.ts`          | `/mod.js`            | `./mod.jsx`          |
| `/mod.mjs`     | `/mod.mts`           | `/mod.d.mts`         | `/mod.mjs`           |                      |                      |
| `/mod.cjs`     | `/mod.cts`           | `/mod.d.cts`         | `/mod.cjs`           |                      |                      |

ဒီအပြုအမူက import ထဲမှာ တကယ်ရေးထားတဲ့ module specifier နဲ့ မသက်ဆိုင်ဘူးဆိုတာ သတိပြုပါ။ ဆိုလိုတာက — module specifier က `.js` file extension ကို အတိအကျ သုံးထားရင်တောင် — TypeScript က `.ts` ဒါမှမဟုတ် `.d.ts` file တစ်ခုဆီ resolve လုပ်နိုင်ပါတယ်:

```ts
import x from "./mod.js";
// Runtime lookup: "./mod.js"
// TypeScript lookup #1: "./mod.ts"
// TypeScript lookup #2: "./mod.d.ts"
// TypeScript lookup #3: "./mod.js"
```

TypeScript ရဲ့ module resolution က ဘာလို့ ဒီလိုမျိုး အလုပ်လုပ်လဲဆိုတဲ့ ရှင်းလင်းချက်အတွက် — [_TypeScript imitates the host’s module resolution, but with types_](/docs/typescript/modules-theory) ကို ကြည့်ပါ။

#### Relative file path resolution (Relative file path ဖြေရှင်းခြင်း)

TypeScript ရဲ့ `moduleResolution` algorithms တိုင်းက — file extension ပါဝင်တဲ့ relative path တစ်ခုနဲ့ module တစ်ခုကို ရည်ညွှန်းတာကို ထောက်ပံ့ပါတယ် (အဲဒီ extension ကို [အထက်က စည်းမျဉ်းတွေ](https://www.typescriptlang.org/docs/handbook/modules) အတိုင်း အစားထိုးခံရမှာပါ):

```ts
// @Filename: a.ts
export {};

// @Filename: b.ts
import {} from "./a.js"; // ✅ Works in every `moduleResolution`
```

#### Extensionless relative paths (Extension မပါတဲ့ relative paths)

အချို့အခြေအနေတွေမှာ — runtime ဒါမှမဟုတ် bundler က relative path တစ်ခုကနေ `.js` file extension ကို ချန်လှပ်ထားခွင့် ပြုပါတယ်။ `moduleResolution` setting နဲ့ context က runtime ဒါမှမဟုတ် bundler က ဒါကို ထောက်ပံ့တယ်လို့ ညွှန်ပြတဲ့အခါ — TypeScript ကလည်း ဒီအပြုအမူကို ထောက်ပံ့ပါတယ်:

```ts
// @Filename: a.ts
export {};

// @Filename: b.ts
import {} from "./a";
```

Module specifier `"./a"` အတွက် runtime က `./a.js` ကို ရှာဖွေမယ်လို့ TypeScript က ဆုံးဖြတ်လိုက်ရင် — `./a.js` က [extension substitution](https://www.typescriptlang.org/docs/handbook/modules) ကို ဖြတ်သန်းပြီး — ဒီဥပမာထဲမှာ `a.ts` ဆိုတဲ့ file ဆီ resolve လုပ်ပါလိမ့်မယ်။

Extensionless relative paths တွေကို Node.js ရဲ့ `import` paths တွေမှာ ထောက်ပံ့မထားပါဘူး — ပြီးတော့ package.json files တွေထဲမှာ သတ်မှတ်ထားတဲ့ file paths တွေမှာလည်း အမြဲတမ်း ထောက်ပံ့တာ မဟုတ်ပါဘူး။ `.mjs`/`.mts` ဒါမှမဟုတ် `.cjs`/`.cts` file extension တွေကို ချန်လှပ်တာကိုတော့ — runtimes တွေရော bundlers တွေရော တချို့ လုပ်ပေးနိုင်ပေမယ့် — TypeScript က လက်ရှိမှာ ဘယ်တော့မှ မထောက်ပံ့ပါဘူး။

#### Directory modules (index file resolution) (Directory modules — index file ဖြေရှင်းခြင်း)

အချို့ကိစ္စတွေမှာ — file တစ်ခုအစား directory တစ်ခုကို module တစ်ခုအနေနဲ့ ရည်ညွှန်းနိုင်ပါတယ်။ အရိုးရှင်းဆုံး ဖြစ်လေ့ဖြစ်ထရှိတဲ့ ကိစ္စကတော့ — runtime ဒါမှမဟုတ် bundler က directory တစ်ခုထဲမှာ `index.js` file တစ်ခုကို ရှာဖွေတာမျိုးပါ။ `moduleResolution` setting နဲ့ context က runtime ဒါမှမဟုတ် bundler က ဒါကို ထောက်ပံ့တယ်လို့ ညွှန်ပြတဲ့အခါ — TypeScript ကလည်း ဒီအပြုအမူကို ထောက်ပံ့ပါတယ်:

```ts
// @Filename: dir/index.ts
export {};

// @Filename: b.ts
import {} from "./dir";
```

Module specifier `"./dir"` အတွက် runtime က `./dir/index.js` ကို ရှာဖွေမယ်လို့ TypeScript က ဆုံးဖြတ်လိုက်ရင် — `./dir/index.js` က [extension substitution](https://www.typescriptlang.org/docs/handbook/modules) ကို ဖြတ်သန်းပြီး — ဒီဥပမာထဲမှာ `dir/index.ts` ဆိုတဲ့ file ဆီ resolve လုပ်ပါလိမ့်မယ်။

Directory modules တွေမှာ package.json file တစ်ခုလည်း ပါဝင်နိုင်ပြီး — အဲဒီမှာ [`"main"` နဲ့ `"types"`](https://www.typescriptlang.org/docs/handbook/modules) fields တွေရဲ့ resolution ကို ထောက်ပံ့ပြီး — `index.js` ရှာဖွေမှုတွေထက် ဦးစားပေးပါတယ်။ [`"typesVersions"`](https://www.typescriptlang.org/docs/handbook/modules) field ကိုလည်း directory modules တွေမှာ ထောက်ပံ့ပါတယ်။

Directory modules တွေက [`node_modules` packages](https://www.typescriptlang.org/docs/handbook/modules) တွေနဲ့ မတူဘူးဆိုတာ သတိပြုပါ — packages တွေမှာ ရနိုင်တဲ့ features တွေရဲ့ အစိတ်အပိုင်း တစိတ်တပိုင်းကိုပဲ ထောက်ပံ့ပြီး — context တချို့မှာတော့ လုံးဝ မထောက်ပံ့ပါဘူး။ Node.js ကလည်း ဒါတွေကို [legacy feature](https://nodejs.org/dist/latest-v20.x/docs/api/modules.html#folders-as-modules) တစ်ခုအဖြစ် သတ်မှတ်ပါတယ်။

#### `paths` (module paths များကို သတ်မှတ်သည့် option)

##### Overview (အကျဉ်းချုပ် မြင်ကွင်း)

TypeScript က — bare specifiers တွေအတွက် compiler ရဲ့ module resolution ကို ကျော်လွန်ပြီး ကိုယ်ပိုင် သတ်မှတ်နိုင်တဲ့ နည်းလမ်းတစ်ခုကို `paths` compiler option နဲ့ ပေးပါတယ်။ ဒီ feature က မူလက AMD module loader (ESM မပေါ်ခင် ဒါမှမဟုတ် bundlers တွေ ကျယ်ကျယ်ပြန့်ပြန့် မသုံးခင် browser ထဲမှာ modules တွေ run လုပ်တဲ့ နည်းလမ်း) နဲ့ တွဲသုံးဖို့ ဒီဇိုင်းထုတ်ခဲ့တာ ဖြစ်ပေမယ့် — ယနေ့ခေတ်မှာတော့ — runtime ဒါမှမဟုတ် bundler တစ်ခုက TypeScript က ပုံစံမဖော်နိုင်တဲ့ module resolution features တွေကို ထောက်ပံ့တဲ့အခါ အသုံးဝင်နေဆဲပါ။ ဥပမာ — Node.js ကို `--experimental-network-imports` နဲ့ run လုပ်တဲ့အခါ — သတ်မှတ်ထားတဲ့ `https://` import တစ်ခုအတွက် local type definition file တစ်ခုကို ကိုယ်တိုင် သတ်မှတ်နိုင်ပါတယ်:

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "paths": {
      "https://esm.sh/lodash@4.17.21": ["./node_modules/@types/lodash/index.d.ts"]
    }
  }
}
```

```ts
// Typed by ./node_modules/@types/lodash/index.d.ts due to `paths` entry
import { add } from "https://esm.sh/lodash@4.17.21";
```

Bundlers တွေနဲ့ တည်ဆောက်ထားတဲ့ apps တွေမှာလည်း — bundler configuration ထဲမှာ convenience path aliases (အဆင်ပြေစေတဲ့ path နာမည်တိုများ) တွေ သတ်မှတ်ပြီး — အဲဒီ aliases တွေကို `paths` နဲ့ TypeScript ကို အသိပေးတာဟာ ဖြစ်လေ့ဖြစ်ထ ရှိပါတယ်:

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@app/*": ["./src/*"]
    }
  }
}
```

##### `paths` does not affect emit (`paths` က emit ကို မသက်ရောက်ပါ)

`paths` option က TypeScript ရဲ့ emit code ထဲက import path ကို _မပြောင်းလဲပါဘူး_။ ဒါကြောင့် — TypeScript ထဲမှာ အလုပ်လုပ်ပုံ ရပေမယ့် runtime မှာ crash ဖြစ်မယ့် path aliases တွေကို ဖန်တီးမိဖို့ အလွန် လွယ်ကူပါတယ်:

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "paths": {
      "node-has-no-idea-what-this-is": ["./oops.ts"]
    }
  }
}
```

```ts
// TypeScript: ✅
// Node.js: 💥
import {} from "node-has-no-idea-what-this-is";
```

Bundled apps တွေက `paths` ကို set လုပ်တာ အဆင်ပြေပေမယ့် — publish လုပ်တဲ့ libraries တွေကတော့ _မလုပ်ဖို့_ အရမ်း အရေးကြီးပါတယ် — အဲဒီ libraries တွေရဲ့ emitted JavaScript က — library ကို သုံးတဲ့သူတွေဘက်က TypeScript ရော သူတို့ရဲ့ bundler ရောအတွက် aliases တွေ အတူတူ set မလုပ်ထားရင် — အလုပ်မလုပ်နိုင်လို့ပါ။ Libraries တွေရော apps တွေရော — convenience `paths` aliases တွေရဲ့ standard အစားထိုးတစ်ခုအနေနဲ့ package.json ရဲ့ [`"imports"`](https://www.typescriptlang.org/docs/handbook/modules) ကို စဉ်းစားနိုင်ပါတယ်။

##### `paths` should not point to monorepo packages or node_modules packages (`paths` ကို monorepo/node_modules packages များဆီ ညွှန်းမထားသင့်ပါ)

`paths` aliases တွေနဲ့ ကိုက်ညီတဲ့ module specifiers တွေက bare specifiers တွေ ဖြစ်ပေမယ့် — alias ကို resolve လုပ်ပြီးတာနဲ့ — module resolution က resolve လုပ်ပြီးသား path ပေါ်မှာ relative path တစ်ခုအနေနဲ့ ဆက်လက် လုပ်ဆောင်ပါတယ်။ ဒါကြောင့် — [`node_modules` package lookups](https://www.typescriptlang.org/docs/handbook/modules) တွေမှာ ဖြစ်ပွားတဲ့ — package.json ရဲ့ `"exports"` field support အပါအဝင် — resolution features တွေက `paths` alias တစ်ခု ကိုက်ညီသွားတဲ့အခါ အကျိုးသက်ရောက်မှု မရှိပါဘူး။ ဒါက — `paths` ကို `node_modules` package တစ်ခုဆီ ညွှန်းဖို့ သုံးရင် အံ့သြစရာ အပြုအမူတွေ ဖြစ်စေနိုင်ပါတယ်:

```ts
{
  "compilerOptions": {
    "paths": {
      "pkg": ["./node_modules/pkg/dist/index.d.ts"],
      "pkg/*": ["./node_modules/pkg/*"]
    }
  }
}
```

ဒီ configuration က package resolution ရဲ့ အပြုအမူတချို့ကို အတုယူ လုပ်ဆောင်နိုင်ပေမယ့် — package ရဲ့ `package.json` ထဲမှာ သတ်မှတ်ထားတဲ့ `main` ၊ `types` ၊ `exports` နဲ့ `typesVersions` အားလုံးကို ကျော်လွန် (override) လုပ်လိုက်ပြီး — package ကနေ imports တွေက runtime မှာ ကျရှုံးသွားနိုင်ပါတယ်။

ဒီသတိပေးချက်က monorepo တစ်ခုထဲမှာ package တွေ အချင်းချင်း ရည်ညွှန်းတဲ့ နေရာမှာလည်း သက်ရောက်ပါတယ်။ `paths` ကို သုံးပြီး TypeScript ကို `"@my-scope/lib"` ကို ဘေးချင်းကပ်နေတဲ့ package တစ်ခုဆီ အတုအယောင် resolve လုပ်စေမယ့်အစား — [npm](https://docs.npmjs.com/cli/v7/using-npm/workspaces) ၊ [yarn](https://classic.yarnpkg.com/en/docs/workspaces/) ဒါမှမဟုတ် [pnpm](https://pnpm.io/workspaces) ကနေတစ်ဆင့် workspaces တွေကို သုံးပြီး ကိုယ့် packages တွေကို `node_modules` ထဲမှာ symlink လုပ်ထားတာ အကောင်းဆုံးပါ — ဒါဆိုရင် TypeScript ရော runtime ဒါမှမဟုတ် bundler ရော နှစ်ခုလုံးက တကယ့် `node_modules` package lookups တွေကို လုပ်ဆောင်ပါလိမ့်မယ်။ Monorepo packages တွေကို npm မှာ publish လုပ်မယ်ဆိုရင် ဒါက အထူး အရေးကြီးပါတယ် — packages တွေက users တွေ install လုပ်ပြီးတာနဲ့ `node_modules` package lookups တွေကနေတစ်ဆင့် အချင်းချင်း ရည်ညွှန်းကြမှာမို့ — workspaces တွေက အဲဒီအပြုအမူကို local development အတွင်း စမ်းသပ်ခွင့် ပေးပါတယ်။

##### Relationship to `baseUrl` (`baseUrl` နဲ့ ဆက်စပ်မှု)

[`baseUrl`](https://www.typescriptlang.org/docs/handbook/modules) ပေးထားရင် — `paths` array တစ်ခုစီထဲက values တွေကို `baseUrl` နဲ့ ဆက်စပ်ပြီး resolve လုပ်ပါတယ်။ မပေးထားရင်တော့ — သူတို့ကို သတ်မှတ်ထားတဲ့ `tsconfig.json` file နဲ့ ဆက်စပ်ပြီး resolve လုပ်ပါတယ်။

##### Wildcard substitutions (Wildcard အစားထိုးမှုများ)

`paths` patterns တွေက `*` wildcard တစ်ခုတည်း ပါဝင်နိုင်ပြီး — အဲဒါက string မဆို ကိုက်ညီပါတယ်။ အဲဒီ `*` token ကို — ကိုက်ညီသွားတဲ့ string နဲ့ အစားထိုးဖို့ — file path values တွေထဲမှာ ပြန်သုံးနိုင်ပါတယ်:

```json
{
  "compilerOptions": {
    "paths": {
      "@app/*": ["./src/*"]
    }
  }
}
```

`"@app/components/Button"` ဆိုတဲ့ import တစ်ခုကို resolve လုပ်တဲ့အခါ — TypeScript က `@app/*` နဲ့ ကိုက်ညီအောင် လုပ်ပြီး — `*` ကို `components/Button` နဲ့ bind လုပ်ကာ — `tsconfig.json` ရဲ့ path နဲ့ ဆက်စပ်ပြီး `./src/components/Button` ဆိုတဲ့ path ကို resolve လုပ်ဖို့ ကြိုးစားပါတယ်။ ဒီ lookup ရဲ့ ကျန်တဲ့ အပိုင်းတွေက `moduleResolution` setting အရ — တခြား [relative path lookup](https://www.typescriptlang.org/docs/handbook/modules) တစ်ခုခုရဲ့ စည်းမျဉ်းတွေအတိုင်းပဲ လိုက်နာပါတယ်။

Patterns အများအပြားက module specifier တစ်ခုကို ကိုက်ညီတဲ့အခါ — `*` token မတိုင်ခင် အရှည်ဆုံး ကိုက်ညီတဲ့ prefix ရှိတဲ့ pattern ကို သုံးပါတယ်:

```json
{
  "compilerOptions": {
    "paths": {
      "*": ["./src/foo/one.ts"],
      "foo/*": ["./src/foo/two.ts"],
      "foo/bar": ["./src/foo/three.ts"]
    }
  }
}
```

`"foo/bar"` ဆိုတဲ့ import တစ်ခုကို resolve လုပ်တဲ့အခါ — `paths` patterns သုံးခုလုံး ကိုက်ညီပေမယ့် — `"foo/bar"` က `"foo/"` နဲ့ `""` တို့ထက် ပိုရှည်လို့ — နောက်ဆုံး pattern ကိုပဲ သုံးပါတယ်။

##### Fallbacks (Fallback ရွေးချယ်စရာများ)

Path mapping တစ်ခုအတွက် file paths အများအပြား ပေးနိုင်ပါတယ်။ Path တစ်ခုနဲ့ resolution မအောင်မြင်ရင် — array ထဲက နောက် path ကို — resolution အောင်မြင်တာ ဒါမှမဟုတ် array ရဲ့ အဆုံးကို ရောက်တာအထိ — စမ်းကြည့်ပါတယ်။

```json
{
  "compilerOptions": {
    "paths": {
      "*": ["./vendor/*", "./types/*"]
    }
  }
}
```

#### `baseUrl` (bare specifiers ဖြေရှင်းရန် အခြေခံ directory သတ်မှတ်သည့် option)

> `baseUrl` ကို AMD module loaders တွေနဲ့ တွဲသုံးဖို့ ဒီဇိုင်းထုတ်ခဲ့တာပါ။ AMD module loader တစ်ခုကို မသုံးဘူးဆိုရင် — `baseUrl` ကိုလည်း သုံးစရာ မလိုပါဘူး။ TypeScript 4.1 ကစပြီး — [`paths`](https://www.typescriptlang.org/docs/handbook/modules) သုံးဖို့ `baseUrl` မလိုအပ်တော့ပါဘူး — `paths` values တွေကို ဘယ်ကနေ resolve လုပ်မလဲဆိုတဲ့ directory ကို set လုပ်ဖို့ပဲ သီးသန့် မသုံးသင့်ပါဘူး။

`baseUrl` compiler option က `moduleResolution` mode မရွေး ပေါင်းစပ်သုံးလို့ရပြီး — bare specifiers တွေ (`./` ၊ `../` ဒါမှမဟုတ် `/` နဲ့ မစတင်တဲ့ module specifiers) ကို ဘယ် directory ကနေ resolve လုပ်မလဲဆိုတာ သတ်မှတ်ပါတယ်။ `baseUrl` က — ဒါတွေကို ထောက်ပံ့တဲ့ `moduleResolution` modes တွေထဲက [`node_modules` package lookups](https://www.typescriptlang.org/docs/handbook/modules) တွေထက် ဦးစားပေး မြင့်ပါတယ်။

`baseUrl` lookup တစ်ခု လုပ်ဆောင်တဲ့အခါ — resolution က တခြား relative path resolutions တွေရဲ့ စည်းမျဉ်းအတိုင်း ဆက်လုပ်ပါတယ်။ ဥပမာ — [extensionless relative paths](https://www.typescriptlang.org/docs/handbook/modules) တွေကို ထောက်ပံ့တဲ့ `moduleResolution` mode တစ်ခုမှာ — `baseUrl` ကို `/src` လို့ set ထားရင် `"some-file"` ဆိုတဲ့ module specifier က `/src/some-file.ts` ဆီ resolve လုပ်နိုင်ပါတယ်။

Relative module specifiers တွေရဲ့ resolution ကိုတော့ `baseUrl` option က ဘယ်တော့မှ မသက်ရောက်ပါဘူး။

#### `node_modules` package lookups (`node_modules` package ရှာဖွေခြင်း)

Node.js က — relative paths ၊ absolute paths ဒါမှမဟုတ် URLs တွေ မဟုတ်တဲ့ module specifiers တွေကို — `node_modules` subdirectories တွေထဲမှာ ရှာဖွေတဲ့ packages တွေဆီ ရည်ညွှန်းတာအဖြစ် သဘောထားပါတယ်။ Bundlers တွေက ဒီအပြုအမူကို — သူတို့ရဲ့ users တွေ Node.js မှာ သုံးသလို တူညီတဲ့ dependency management system ကိုရော မကြာခဏဆိုသလို တူညီတဲ့ dependencies တွေကိုပါ သုံးနိုင်အောင် — အဆင်ပြေစွာ လက်ခံကျင့်သုံးခဲ့ကြပါတယ်။ TypeScript ရဲ့ `moduleResolution` options တွေအားလုံး (`classic` ကလွဲလို့) က `node_modules` lookups တွေကို ထောက်ပံ့ပါတယ်။ (`classic` က တခြား နည်းလမ်းတွေနဲ့ resolution မအောင်မြင်တဲ့အခါ `node_modules/@types` ထဲမှာ lookups တွေ လုပ်ပေးပေမယ့် — `node_modules` ထဲမှာ packages တွေကို တိုက်ရိုက် ဘယ်တော့မှ မရှာဖွေပါဘူး။) `node_modules` package lookup တိုင်းမှာ အောက်ပါ ဖွဲ့စည်းပုံ ရှိပါတယ် (ဦးစားပေး မြင့်တဲ့ bare specifier စည်းမျဉ်းတွေ — `paths` ၊ `baseUrl` ၊ self-name imports နဲ့ package.json ရဲ့ `"imports"` lookups တွေ — ကုန်ဆုံးသွားပြီးမှ စတင်တာပါ):

1. Import လုပ်နေတဲ့ file ရဲ့ ဘိုးဘေး (ancestor) directory တစ်ခုချင်းစီအတွက် — အဲဒီထဲမှာ `node_modules` directory တစ်ခု ရှိနေရင်:
   1. Package နဲ့ နာမည်တူတဲ့ directory တစ်ခု `node_modules` ထဲမှာ ရှိနေရင်:
      1. Package directory ကနေ types တွေကို resolve လုပ်ဖို့ ကြိုးစားပါ။
      2. ရလဒ်တစ်ခု တွေ့ရင် — အဲဒါကို ပြန်ပေးပြီး ရှာဖွေမှုကို ရပ်လိုက်ပါ။
   2. Package နဲ့ နာမည်တူတဲ့ directory တစ်ခု `node_modules/@types` ထဲမှာ ရှိနေရင်:
      1. `@types` package directory ကနေ types တွေကို resolve လုပ်ဖို့ ကြိုးစားပါ။
      2. ရလဒ်တစ်ခု တွေ့ရင် — အဲဒါကို ပြန်ပေးပြီး ရှာဖွေမှုကို ရပ်လိုက်ပါ။
2. အပေါ်က ရှာဖွေမှုကို `node_modules` directories အားလုံးကနေတစ်ဆင့် ထပ်လုပ်ပါ — ဒါပေမယ့် ဒီတစ်ခါ JavaScript files တွေကို ရလဒ်အဖြစ် ခွင့်ပြုပြီး — `@types` directories တွေထဲမှာတော့ မရှာဖွေတော့ပါဘူး။

`moduleResolution` modes အားလုံး (`classic` ကလွဲလို့) က ဒီ pattern ကို လိုက်နာပြီး — package directory တစ်ခုကို တွေ့ရှိပြီးတာနဲ့ အဲဒီကနေ ဘယ်လို resolve လုပ်လဲဆိုတဲ့ အသေးစိတ်တွေကတော့ ကွဲပြားပြီး — အောက်က sections တွေမှာ ရှင်းပြထားပါတယ်။

#### package.json `"exports"` (package.json ရဲ့ `"exports"` field)

`moduleResolution` ကို `node16` ၊ `nodenext` ဒါမှမဟုတ် `bundler` လို့ set ထားပြီး — `resolvePackageJsonExports` ကို disable မလုပ်ထားဘူးဆိုရင် — TypeScript က [bare specifier `node_modules` package lookup](https://www.typescriptlang.org/docs/handbook/modules) တစ်ခုကြောင့် package directory တစ်ခုကနေ resolve လုပ်တဲ့အခါ — Node.js ရဲ့ [package.json `"exports"` spec](https://nodejs.org/api/packages.html#packages_package_entry_points) ကို လိုက်နာပါတယ်။

Module specifier တစ်ခုကို `"exports"` ကနေတစ်ဆင့် file path တစ်ခုဆီ resolve လုပ်တဲ့ TypeScript ရဲ့ အကောင်အထည်ဖော်မှုက Node.js ကို အတိအကျ လိုက်နာပါတယ်။ ဒါပေမယ့် — file path တစ်ခု resolve လုပ်ပြီးတာနဲ့ — TypeScript က types တွေကို ဦးစားပေး ရှာတွေ့နိုင်ဖို့ — [file extensions အများအပြားကို စမ်းကြည့်နေဆဲ](https://www.typescriptlang.org/docs/handbook/modules)ပါ။

[Conditional `"exports"`](https://nodejs.org/api/packages.html#conditional-exports) ကနေတစ်ဆင့် resolve လုပ်တဲ့အခါ — TypeScript က ရှိနေရင် `"types"` နဲ့ `"default"` conditions တွေကို အမြဲတမ်း ကိုက်ညီအောင် လုပ်ပါတယ်။ ဒါ့အပြင် — TypeScript က `"types@{selector}"` ပုံစံရှိတဲ့ versioned types condition တစ်ခုကို (`{selector}` က `"typesVersions"`-compatible version selector တစ်ခု ဖြစ်ပြီး) — [`"typesVersions"`](https://www.typescriptlang.org/docs/handbook/modules) ထဲမှာ အကောင်အထည်ဖော်ထားတဲ့ version-matching စည်းမျဉ်းတွေအတိုင်းပဲ — ကိုက်ညီအောင် လုပ်ပါတယ်။ တခြား configure လုပ်လို့မရတဲ့ conditions တွေက `moduleResolution` mode ပေါ် မူတည်ပြီး — အောက်က sections တွေမှာ သတ်မှတ်ဖော်ပြထားပါတယ်။ `customConditions` compiler option နဲ့တော့ conditions အပိုတွေကို configure လုပ်ပြီး ကိုက်ညီအောင် လုပ်နိုင်ပါတယ်။

`"exports"` ထဲမှာ အတိအကျ စာရင်းမပါတဲ့ ဒါမှမဟုတ် pattern တစ်ခုနဲ့ မကိုက်ညီတဲ့ subpaths တွေကို resolve လုပ်တာကို — `"exports"` ရှိနေရုံနဲ့တင် တားဆီးပါတယ်ဆိုတာ သတိပြုပါ။

##### Example: subpaths, conditions, and extension substitution (ဥပမာ: subpaths ၊ conditions နဲ့ extension substitution)

ဖြစ်စဉ်ဥပမာ (Scenario): `"pkg/subpath"` ကို conditions `["types", "node", "require"]` တွေနဲ့ တောင်းဆိုထားတယ် ဆိုပါစို့ (moduleResolution setting နဲ့ module resolution request ကို စတင်စေတဲ့ context ပေါ်မူတည်ပြီး သတ်မှတ်တာပါ) — အောက်ပါ package.json ပါတဲ့ package directory တစ်ခုထဲမှာပေါ့:

```json
{
  "name": "pkg",
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.cjs"
    },
    "./subpath": {
      "import": "./subpath/index.mjs",
      "require": "./subpath/index.cjs"
    }
  }
}
```

Package directory အတွင်းမှာ ဖြေရှင်းတဲ့ လုပ်ငန်းစဉ် (Resolution process):

1. `"exports"` ရှိပါသလား? **ရှိပါတယ်။**
2. `"exports"` ထဲမှာ `"./subpath"` entry တစ်ခု ရှိပါသလား? **ရှိပါတယ်။**
3. `exports["./subpath"]` မှာရှိတဲ့ value က object တစ်ခုပါ — conditions တွေကို သတ်မှတ်နေတာ ဖြစ်ရမယ်။
4. ပထမ condition `"import"` က ဒီ request နဲ့ ကိုက်ညီပါသလား? **မကိုက်ညီပါဘူး။**
5. ဒုတိယ condition `"require"` က ဒီ request နဲ့ ကိုက်ညီပါသလား? **ကိုက်ညီပါတယ်။**
6. `"./subpath/index.cjs"` ဆိုတဲ့ path မှာ TypeScript က အသိအမှတ်ပြုတဲ့ file extension ရှိပါသလား? **မရှိပါဘူး — ဒါကြောင့် extension substitution ကို သုံးပါ။**
7. [Extension substitution](https://www.typescriptlang.org/docs/handbook/modules) ကနေတစ်ဆင့် — အောက်ပါ paths တွေကို စမ်းပြီး — ပထမဆုံး ရှိနေတာကို ပြန်ပေး ၊ ဘာမှ မရှိရင် `undefined` ပြန်ပေးပါ:
   1. `./subpath/index.cts`
   2. `./subpath/index.d.cts`
   3. `./subpath/index.cjs`

`./subpath/index.cts` ဒါမှမဟုတ် `./subpath.d.cts` ရှိနေရင် — resolution က ပြီးပြည့်စုံပါပြီ။ မရှိဘူးဆိုရင်တော့ — resolution က [`node_modules` package lookups](https://www.typescriptlang.org/docs/handbook/modules) စည်းမျဉ်းတွေအရ — types တွေကို resolve ဖို့အတွက် `node_modules/@types/pkg` နဲ့ တခြား `node_modules` directories တွေကို ရှာဖွေပါတယ်။ Types တွေ မတွေ့ရင် — `node_modules` အားလုံးကိုဖြတ်တဲ့ ဒုတိယ pass တစ်ခုက `./subpath/index.cjs` ဆီ resolve လုပ်ပါတယ် (အဲဒါ ရှိနေရင်ပေါ့) — ဒါက အောင်မြင်တဲ့ resolution တစ်ခုလို့ သတ်မှတ်ပေမယ့် — types တွေ မပေးပါဘူး — `any`-typed imports တွေ ဖြစ်စေပြီး — enable လုပ်ထားရင် `noImplicitAny` error တစ်ခုပါ ဖြစ်စေပါတယ်။

##### Example: explicit `"types"` condition (ဥပမာ: ထင်ရှားစွာ သတ်မှတ်ထားသော `"types"` condition)

ဖြစ်စဉ်ဥပမာ (Scenario): `"pkg/subpath"` ကို conditions `["types", "node", "import"]` တွေနဲ့ တောင်းဆိုထားတယ် ဆိုပါစို့ (moduleResolution setting နဲ့ module resolution request ကို စတင်စေတဲ့ context ပေါ်မူတည်ပြီး သတ်မှတ်တာပါ) — အောက်ပါ package.json ပါတဲ့ package directory တစ်ခုထဲမှာပေါ့:

```json
{
  "name": "pkg",
  "exports": {
    "./subpath": {
      "import": {
        "types": "./types/subpath/index.d.mts",
        "default": "./es/subpath/index.mjs"
      },
      "require": {
        "types": "./types/subpath/index.d.cts",
        "default": "./cjs/subpath/index.cjs"
      }
    }
  }
}
```

Package directory အတွင်းမှာ ဖြေရှင်းတဲ့ လုပ်ငန်းစဉ် (Resolution process):

1. `"exports"` ရှိပါသလား? **ရှိပါတယ်။**
2. `"exports"` ထဲမှာ `"./subpath"` entry တစ်ခု ရှိပါသလား? **ရှိပါတယ်။**
3. `exports["./subpath"]` မှာရှိတဲ့ value က object တစ်ခုပါ — conditions တွေကို သတ်မှတ်နေတာ ဖြစ်ရမယ်။
4. ပထမ condition `"import"` က ဒီ request နဲ့ ကိုက်ညီပါသလား? **ကိုက်ညီပါတယ်။**
5. `exports["./subpath"].import` မှာရှိတဲ့ value က object တစ်ခုပါ — conditions တွေကို သတ်မှတ်နေတာ ဖြစ်ရမယ်။
6. ပထမ condition `"types"` က ဒီ request နဲ့ ကိုက်ညီပါသလား? **ကိုက်ညီပါတယ်။**
7. `"./types/subpath/index.d.mts"` ဆိုတဲ့ path မှာ TypeScript က အသိအမှတ်ပြုတဲ့ file extension ရှိပါသလား? **ရှိပါတယ် — ဒါကြောင့် extension substitution ကို မသုံးပါဘူး။**
8. `"./types/subpath/index.d.mts"` ဆိုတဲ့ path ကို — file ရှိနေရင် ပြန်ပေး ၊ မရှိရင် `undefined` ပြန်ပေးပါ။

##### Example: versioned `"types"` condition (ဥပမာ: Version သတ်မှတ်ထားသော `"types"` condition)

ဖြစ်စဉ်ဥပမာ (Scenario): TypeScript 4.7.5 ကို သုံးနေပြီး — `"pkg/subpath"` ကို conditions `["types", "node", "import"]` တွေနဲ့ တောင်းဆိုထားတယ် ဆိုပါစို့ (moduleResolution setting နဲ့ module resolution request ကို စတင်စေတဲ့ context ပေါ်မူတည်ပြီး သတ်မှတ်တာပါ) — အောက်ပါ package.json ပါတဲ့ package directory တစ်ခုထဲမှာပေါ့:

```json
{
  "name": "pkg",
  "exports": {
    "./subpath": {
      "types@>=5.2": "./ts5.2/subpath/index.d.ts",
      "types@>=4.6": "./ts4.6/subpath/index.d.ts",
      "types": "./tsold/subpath/index.d.ts",
      "default": "./dist/subpath/index.js"
    }
  }
}
```

Package directory အတွင်းမှာ ဖြေရှင်းတဲ့ လုပ်ငန်းစဉ် (Resolution process):

1. `"exports"` ရှိပါသလား? **ရှိပါတယ်။**
2. `"exports"` ထဲမှာ `"./subpath"` entry တစ်ခု ရှိပါသလား? **ရှိပါတယ်။**
3. `exports["./subpath"]` မှာရှိတဲ့ value က object တစ်ခုပါ — conditions တွေကို သတ်မှတ်နေတာ ဖြစ်ရမယ်။
4. ပထမ condition `"types@>=5.2"` က ဒီ request နဲ့ ကိုက်ညီပါသလား? **မကိုက်ညီပါဘူး — 4.7.5 က 5.2 ထက် ကြီးသည် ဒါမှမဟုတ် ညီသည် မဟုတ်လို့ပါ။**
5. ဒုတိယ condition `"types@>=4.6"` က ဒီ request နဲ့ ကိုက်ညီပါသလား? **ကိုက်ညီပါတယ် — 4.7.5 က 4.6 ထက် ကြီးသည် ဒါမှမဟုတ် ညီလို့ပါ။**
6. `"./ts4.6/subpath/index.d.ts"` ဆိုတဲ့ path မှာ TypeScript က အသိအမှတ်ပြုတဲ့ file extension ရှိပါသလား? **ရှိပါတယ် — ဒါကြောင့် extension substitution ကို မသုံးပါဘူး။**
7. `"./ts4.6/subpath/index.d.ts"` ဆိုတဲ့ path ကို — file ရှိနေရင် ပြန်ပေး ၊ မရှိရင် `undefined` ပြန်ပေးပါ။

##### Example: subpath patterns (ဥပမာ: Subpath patterns)

ဖြစ်စဉ်ဥပမာ (Scenario): `"pkg/wildcard.js"` ကို conditions `["types", "node", "import"]` တွေနဲ့ တောင်းဆိုထားတယ် ဆိုပါစို့ (moduleResolution setting နဲ့ module resolution request ကို စတင်စေတဲ့ context ပေါ်မူတည်ပြီး သတ်မှတ်တာပါ) — အောက်ပါ package.json ပါတဲ့ package directory တစ်ခုထဲမှာပေါ့:

```json
{
  "name": "pkg",
  "type": "module",
  "exports": {
    "./*.js": {
      "types": "./types/*.d.ts",
      "default": "./dist/*.js"
    }
  }
}
```

Package directory အတွင်းမှာ ဖြေရှင်းတဲ့ လုပ်ငန်းစဉ် (Resolution process):

1. `"exports"` ရှိပါသလား? **ရှိပါတယ်။**
2. `"exports"` ထဲမှာ `"./wildcard.js"` entry တစ်ခု ရှိပါသလား? **မရှိပါဘူး။**
3. `*` ပါတဲ့ key တစ်ခုခုက `"./wildcard.js"` နဲ့ ကိုက်ညီပါသလား? **ကိုက်ညီပါတယ် — `"./*.js"` က ကိုက်ညီပြီး `wildcard` ကို substitution အဖြစ် သတ်မှတ်ပါတယ်။**
4. `exports["./*.js"]` မှာရှိတဲ့ value က object တစ်ခုပါ — conditions တွေကို သတ်မှတ်နေတာ ဖြစ်ရမယ်။
5. ပထမ condition `"types"` က ဒီ request နဲ့ ကိုက်ညီပါသလား? **ကိုက်ညီပါတယ်။**
6. `./types/*.d.ts` ထဲမှာ `*` ကို substitution `wildcard` နဲ့ အစားထိုးပါ။ **`./types/wildcard.d.ts`**
7. `"./types/wildcard.d.ts"` ဆိုတဲ့ path မှာ TypeScript က အသိအမှတ်ပြုတဲ့ file extension ရှိပါသလား? **ရှိပါတယ် — ဒါကြောင့် extension substitution ကို မသုံးပါဘူး။**
8. `"./types/wildcard.d.ts"` ဆိုတဲ့ path ကို — file ရှိနေရင် ပြန်ပေး ၊ မရှိရင် `undefined` ပြန်ပေးပါ။

##### Example: `"exports"` block other subpaths (ဥပမာ: `"exports"` က အခြား subpaths များကို ပိတ်ပင်ခြင်း)

ဖြစ်စဉ်ဥပမာ (Scenario): `"pkg/dist/index.js"` ကို အောက်ပါ package.json ပါတဲ့ package directory တစ်ခုထဲမှာ တောင်းဆိုထားတယ် ဆိုပါစို့:

```json
{
  "name": "pkg",
  "main": "./dist/index.js",
  "exports": "./dist/index.js"
}
```

Package directory အတွင်းမှာ ဖြေရှင်းတဲ့ လုပ်ငန်းစဉ် (Resolution process):

1. `"exports"` ရှိပါသလား? **ရှိပါတယ်။**
2. `exports` မှာရှိတဲ့ value က string တစ်ခုပါ — package root (`"."`) အတွက် file path တစ်ခု ဖြစ်ရမယ်။
3. `"pkg/dist/index.js"` ဆိုတဲ့ request က package root အတွက်လား? **မဟုတ်ပါဘူး — သူ့မှာ `dist/index.js` ဆိုတဲ့ subpath ရှိပါတယ်။**
4. Resolution မအောင်မြင်ပါ — `undefined` ပြန်ပေးပါ။

`"exports"` မရှိရင် အဲဒီ request က အောင်မြင်နိုင်ခဲ့ပေမယ့် — `"exports"` ရှိနေတာက — `"exports"` ကနေတစ်ဆင့် မကိုက်ညီနိုင်တဲ့ subpaths တွေကို resolve လုပ်တာကို တားဆီးပါတယ်။

#### package.json `"typesVersions"` (package.json ရဲ့ `"typesVersions"` field)

[`node_modules` package](https://www.typescriptlang.org/docs/handbook/modules) တစ်ခု ဒါမှမဟုတ် [directory module](https://www.typescriptlang.org/docs/handbook/modules) တစ်ခုက သူ့ရဲ့ package.json ထဲမှာ `"typesVersions"` field တစ်ခုကို သတ်မှတ်ပြီး — TypeScript compiler ရဲ့ ဗားရှင်းအလိုက် (ပြီးတော့ `node_modules` packages တွေအတွက်ဆိုရင် resolve လုပ်နေတဲ့ subpath အလိုက်ပါ) — TypeScript ရဲ့ resolution လုပ်ငန်းစဉ်ကို လမ်းကြောင်းပြောင်းပေးနိုင်ပါတယ်။ ဒါက package authors တွေကို — TypeScript syntax အသစ်တွေကို type definitions အစုတစ်ခုထဲမှာ ထည့်ပြီး — TypeScript ဗားရှင်းအဟောင်းတွေနဲ့ နောက်ပြန် လိုက်ဖက်ညီမှုအတွက် (တစ်နည်း) နောက်ထပ် အစုတစ်ခုကိုလည်း ထောက်ပံ့ပေးနိုင်စေပါတယ် ([downlevel-dts](https://github.com/sandersn/downlevel-dts) လို tool တစ်ခုကနေတစ်ဆင့်ပေါ့)။ `"typesVersions"` ကို `moduleResolution` modes အားလုံးမှာ ထောက်ပံ့ပါတယ်; ဒါပေမယ့် — [package.json ရဲ့ `"exports"`](https://www.typescriptlang.org/docs/handbook/modules) တွေကို ဖတ်တဲ့ အခြေအနေတွေမှာတော့ ဒီ field ကို ဖတ်မပေးပါဘူး။

##### Example: redirect all requests to a subdirectory (ဥပမာ: တောင်းဆိုမှုအားလုံးကို subdirectory တစ်ခုဆီ လမ်းကြောင်းပြောင်းခြင်း)

ဖြစ်စဉ်ဥပမာ (Scenario): TypeScript 5.2 ကို သုံးပြီး module တစ်ခုက `"pkg"` ကို import လုပ်နေတယ် ဆိုပါစို့ — `node_modules/pkg/package.json` က ဒီလိုဆိုရင်:

```json
{
  "name": "pkg",
  "version": "1.0.0",
  "types": "./index.d.ts",
  "typesVersions": {
    ">=3.1": {
      "*": ["ts3.1/*"]
    }
  }
}
```

ဖြေရှင်းတဲ့ လုပ်ငန်းစဉ် (Resolution process):

1. (Compiler options ပေါ် မူတည်ပြီး) `"exports"` ရှိပါသလား? **မရှိပါဘူး။**
2. `"typesVersions"` ရှိပါသလား? **ရှိပါတယ်။**
3. TypeScript ဗားရှင်းက `>=3.1` လား? **ဟုတ်ပါတယ်။ `"*": ["ts3.1/*"]` ဆိုတဲ့ mapping ကို မှတ်ထားပါ။**
4. Package နာမည်ပြီးနောက်မှာ subpath တစ်ခုကို resolve လုပ်နေတာလား? **မဟုတ်ပါဘူး — root `"pkg"` ပဲ ဖြစ်ပါတယ်။**
5. `"types"` ရှိပါသလား? **ရှိပါတယ်။**
6. `"typesVersions"` ထဲက key တစ်ခုခုက `./index.d.ts` နဲ့ ကိုက်ညီပါသလား? **ကိုက်ညီပါတယ် — `"*"` က ကိုက်ညီပြီး `index.d.ts` ကို substitution အဖြစ် သတ်မှတ်ပါတယ်။**
7. `ts3.1/*` ထဲမှာ `*` ကို substitution `./index.d.ts` နဲ့ အစားထိုးပါ: **`ts3.1/index.d.ts`**။
8. `./ts3.1/index.d.ts` ဆိုတဲ့ path မှာ TypeScript က အသိအမှတ်ပြုတဲ့ file extension ရှိပါသလား? **ရှိပါတယ် — ဒါကြောင့် extension substitution ကို မသုံးပါဘူး။**
9. `./ts3.1/index.d.ts` ဆိုတဲ့ path ကို — file ရှိနေရင် ပြန်ပေး ၊ မရှိရင် `undefined` ပြန်ပေးပါ။

##### Example: redirect requests for a specific file (ဥပမာ: သတ်မှတ် file တစ်ခုအတွက် တောင်းဆိုမှုများကို လမ်းကြောင်းပြောင်းခြင်း)

ဖြစ်စဉ်ဥပမာ (Scenario): TypeScript 3.9 ကို သုံးပြီး module တစ်ခုက `"pkg"` ကို import လုပ်နေတယ် ဆိုပါစို့ — `node_modules/pkg/package.json` က ဒီလိုဆိုရင်:

```json
{
  "name": "pkg",
  "version": "1.0.0",
  "types": "./index.d.ts",
  "typesVersions": {
    "<4.0": { "index.d.ts": ["index.v3.d.ts"] }
  }
}
```

ဖြေရှင်းတဲ့ လုပ်ငန်းစဉ် (Resolution process):

1. (Compiler options ပေါ် မူတည်ပြီး) `"exports"` ရှိပါသလား? **မရှိပါဘူး။**
2. `"typesVersions"` ရှိပါသလား? **ရှိပါတယ်။**
3. TypeScript ဗားရှင်းက `<4.0` လား? **ဟုတ်ပါတယ်။ `"index.d.ts": ["index.v3.d.ts"]` ဆိုတဲ့ mapping ကို မှတ်ထားပါ။**
4. Package နာမည်ပြီးနောက်မှာ subpath တစ်ခုကို resolve လုပ်နေတာလား? **မဟုတ်ပါဘူး — root `"pkg"` ပဲ ဖြစ်ပါတယ်။**
5. `"types"` ရှိပါသလား? **ရှိပါတယ်။**
6. `"typesVersions"` ထဲက key တစ်ခုခုက `./index.d.ts` နဲ့ ကိုက်ညီပါသလား? **ကိုက်ညီပါတယ် — `"index.d.ts"` က ကိုက်ညီပါတယ်။**
7. `./index.v3.d.ts` ဆိုတဲ့ path မှာ TypeScript က အသိအမှတ်ပြုတဲ့ file extension ရှိပါသလား? **ရှိပါတယ် — ဒါကြောင့် extension substitution ကို မသုံးပါဘူး။**
8. `./index.v3.d.ts` ဆိုတဲ့ path ကို — file ရှိနေရင် ပြန်ပေး ၊ မရှိရင် `undefined` ပြန်ပေးပါ။

#### package.json `"main"` and `"types"` (package.json ရဲ့ `"main"` နဲ့ `"types"` fields)

Directory တစ်ခုရဲ့ [package.json `"exports"`](https://www.typescriptlang.org/docs/handbook/modules) field ကို မဖတ်တဲ့အခါ (compiler options တွေကြောင့်ဖြစ်စေ ၊ field မရှိလို့ဖြစ်စေ ၊ directory ကို [`node_modules` package](https://www.typescriptlang.org/docs/handbook/modules) တစ်ခုအစား [directory module](https://www.typescriptlang.org/docs/handbook/modules) တစ်ခုအနေနဲ့ resolve လုပ်နေလို့ဖြစ်စေ) — ပြီးတော့ module specifier မှာ package နာမည် ဒါမှမဟုတ် package.json ပါတဲ့ directory ပြီးနောက်မှာ subpath မရှိဘူးဆိုရင် — TypeScript က package ဒါမှမဟုတ် directory အတွက် main module ကို ရှာဖို့ — အောက်ပါ package.json fields တွေကနေ — စဉ်လိုက် resolve လုပ်ဖို့ ကြိုးစားပါတယ်:

- `"types"`
- `"typings"` (legacy)
- `"main"`

`"types"` မှာ တွေ့ရတဲ့ declaration file က `"main"` မှာ တွေ့ရတဲ့ implementation file ရဲ့ တိကျတဲ့ ကိုယ်စားပြုမှုတစ်ခု ဖြစ်တယ်လို့ ယူဆပါတယ်။ `"types"` နဲ့ `"typings"` နှစ်ခုလုံး မရှိဘူး ဒါမှမဟုတ် resolve မလုပ်နိုင်ဘူးဆိုရင် — TypeScript က `"main"` field ကို ဖတ်ပြီး — declaration file တစ်ခု ရှာဖို့ [extension substitution](https://www.typescriptlang.org/docs/handbook/modules) ကို လုပ်ဆောင်ပါတယ်။

Typed package တစ်ခုကို npm မှာ publish လုပ်တဲ့အခါ — [extension substitution](https://www.typescriptlang.org/docs/handbook/modules) ဒါမှမဟုတ် [package.json ရဲ့ `"exports"`](https://www.typescriptlang.org/docs/handbook/modules) က မလိုအပ်အောင် လုပ်ထားရင်တောင် — `"types"` field တစ်ခု ထည့်ဖို့ အကြံပြုပါတယ် — package.json ထဲမှာ `"types"` field ပါမှသာ npm က package registry စာရင်းထဲမှာ TS icon တစ်ခု ပြပေးလို့ပါ။

#### Package-relative file paths (package နှင့် ဆက်စပ်၍ ဖြေရှင်းသော file paths)

[package.json ရဲ့ `"exports"`](https://www.typescriptlang.org/docs/handbook/modules) ရော [package.json ရဲ့ `"typesVersions"`](https://www.typescriptlang.org/docs/handbook/modules) ရော နှစ်ခုလုံး သက်ရောက်မှု မရှိဘူးဆိုရင် — bare package specifier တစ်ခုရဲ့ subpaths တွေက — သက်ဆိုင်တဲ့ [relative path](https://www.typescriptlang.org/docs/handbook/modules) resolution စည်းမျဉ်းတွေအရ — package directory နဲ့ ဆက်စပ်ပြီး resolve လုပ်ပါတယ်။ [package.json ရဲ့ `"exports"`] ကို လေးစားလိုက်နာတဲ့ modes တွေမှာ — import က `"exports"` ကနေတစ်ဆင့် resolve မအောင်မြင်ရင်တောင် — package ရဲ့ package.json ထဲမှာ `"exports"` field ရှိနေရုံလေးနဲ့တင် ဒီအပြုအမူကို ပိတ်ဆို့ပါတယ် ([အထက်က ဥပမာ](https://www.typescriptlang.org/docs/handbook/modules) မှာ ပြထားသလိုပါ)။ တစ်ဖက်မှာ — import က `"typesVersions"` ကနေတစ်ဆင့် resolve မအောင်မြင်ရင်တော့ — package-relative file path resolution တစ်ခုကို fallback အနေနဲ့ စမ်းကြည့်ပါတယ်။

Package-relative paths တွေကို ထောက်ပံ့တဲ့အခါ — သူတို့က `moduleResolution` mode နဲ့ context ကို ထည့်စဉ်းစားပြီး — တခြား relative path တစ်ခုခုရဲ့ စည်းမျဉ်းတွေအတိုင်းပဲ resolve လုပ်ပါတယ်။ ဥပမာ — [`--moduleResolution nodenext`](https://www.typescriptlang.org/docs/handbook/modules) မှာ — [directory modules](https://www.typescriptlang.org/docs/handbook/modules) တွေရော [extensionless paths](https://www.typescriptlang.org/docs/handbook/modules) တွေရော `import`s တွေမှာ မဟုတ်ဘဲ — `require` calls တွေထဲမှာပဲ ထောက်ပံ့ပါတယ်:

```ts
// @Filename: module.mts
import "pkg/dist/foo";                // ❌ import, needs `.js` extension
import "pkg/dist/foo.js";             // ✅
import foo = require("pkg/dist/foo"); // ✅ require, no extension needed
```

#### package.json `"imports"` and self-name imports (package.json ရဲ့ `"imports"` နဲ့ self-name imports)

`moduleResolution` ကို `node16` ၊ `nodenext` ဒါမှမဟုတ် `bundler` လို့ set ထားပြီး — `resolvePackageJsonImports` ကို disable မလုပ်ထားဘူးဆိုရင် — TypeScript က `#` နဲ့ စတင်တဲ့ import paths တွေကို — import လုပ်နေတဲ့ file ရဲ့ အနီးဆုံး ဘိုးဘေး (ancestor) package.json ရဲ့ `"imports"` field ကနေတစ်ဆင့် — resolve လုပ်ဖို့ ကြိုးစားပါတယ်။ အလားတူ — [package.json ရဲ့ `"exports"` lookups](https://www.typescriptlang.org/docs/handbook/modules) တွေ enable လုပ်ထားတဲ့အခါ — TypeScript က လက်ရှိ package နာမည် (ဆိုလိုတာက import လုပ်နေတဲ့ file ရဲ့ အနီးဆုံး ဘိုးဘေး package.json ထဲက `"name"` field ရဲ့ တန်ဖိုး) နဲ့ စတင်တဲ့ import paths တွေကို — အဲဒီ package.json ရဲ့ `"exports"` field ကနေတစ်ဆင့် — resolve လုပ်ဖို့ ကြိုးစားပါတယ်။ ဒီ feature နှစ်ခုလုံးက — package တစ်ခုထဲက files တွေကို အဲဒီ package ထဲက တခြား files တွေကို import လုပ်ခွင့် — relative import path တစ်ခုရဲ့ နေရာမှာ အစားထိုးပြီး — ပေးပါတယ်။

TypeScript က Node.js ရဲ့ [`"imports"`](https://nodejs.org/api/packages.html#subpath-imports) နဲ့ [self references](https://nodejs.org/api/packages.html#self-referencing-a-package-using-its-name) တွေအတွက် resolution algorithm ကို — file path တစ်ခု resolve မဖြစ်သေးတဲ့အထိ — အတိအကျ လိုက်နာပါတယ်။ အဲဒီနေရာမှာ — TypeScript ရဲ့ resolution algorithm က — resolve လုပ်နေတဲ့ `"imports"` ဒါမှမဟုတ် `"exports"` တွေ ပါဝင်တဲ့ package.json က `node_modules` dependency တစ်ခုထဲမှာ ရှိတာလား ၊ compile လုပ်နေတဲ့ local project ထဲမှာ ရှိတာလား (ဆိုလိုတာက — အဲဒီ directory ထဲမှာ import လုပ်နေတဲ့ file ပါဝင်တဲ့ project ရဲ့ tsconfig.json file ရှိနေတာလား) ဆိုတာပေါ် မူတည်ပြီး — လမ်းခွဲသွားပါတယ်:

- Package.json က `node_modules` ထဲမှာ ရှိနေရင် — TypeScript က file path မှာ TypeScript က အသိအမှတ်ပြုတဲ့ file extension မရှိသေးဘူးဆိုရင် [extension substitution](https://www.typescriptlang.org/docs/handbook/modules) ကို လုပ်ဆောင်ပြီး — ရလာတဲ့ file paths တွေ တည်ရှိမှုကို စစ်ဆေးပါတယ်။
- Package.json က local project ရဲ့ အစိတ်အပိုင်း ဖြစ်နေရင် — `"imports"` ကနေ resolve လုပ်လိုက်တဲ့ output JavaScript ဒါမှမဟုတ် declaration file path ကို နောက်ဆုံးမှာ ထုတ်လုပ်ပေးမယ့် _input_ TypeScript implementation file ကို ရှာဖို့ — remapping အဆင့် တစ်ခု ထပ်ဆောင်း လုပ်ဆောင်ပါတယ်။ ဒီအဆင့် မရှိရင် — `"imports"` path တစ်ခုကို resolve လုပ်တဲ့ compilation တိုင်းက — လက်ရှိ compilation ထဲ ထည့်သွင်းဖို့ ရည်ရွယ်ထားတဲ့ တခြား input files တွေအစား — _အရင် compilation_ ရဲ့ output files တွေကို ရည်ညွှန်းနေမှာပါ။ ဒီ remapping က tsconfig.json ထဲက `outDir`/`declarationDir` နဲ့ `rootDir` တွေကို သုံးလို့ — `"imports"` သုံးတာက ပုံမှန်အားဖြင့် `rootDir` တစ်ခုကို အတိအကျ set လုပ်ထားဖို့ လိုအပ်ပါတယ်။

ဒီပုံစံအမျိုးကွဲက package authors တွေကို — npm မှာ publish လုပ်မယ့် compilation outputs တွေကိုပဲ ရည်ညွှန်းတဲ့ `"imports"` နဲ့ `"exports"` fields တွေကို ရေးနိုင်စေပြီး — local development မှာတော့ မူရင်း TypeScript source files တွေကို ဆက်သုံးနိုင်စေပါတယ်။

##### Example: local project with conditions (ဥပမာ: Conditions ပါတဲ့ local project)

ဖြစ်စဉ်ဥပမာ (Scenario): `"/src/main.mts"` က `"#utils"` ကို conditions `["types", "node", "import"]` တွေနဲ့ import လုပ်နေတယ် ဆိုပါစို့ (moduleResolution setting နဲ့ module resolution request ကို စတင်စေတဲ့ context ပေါ်မူတည်ပြီး သတ်မှတ်တာပါ) — tsconfig.json နဲ့ package.json ပါတဲ့ project directory တစ်ခုထဲမှာပေါ့:

```json5
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "node16",
    "resolvePackageJsonImports": true,
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

```json5
// package.json
{
  "name": "pkg",
  "imports": {
    "#utils": {
      "import": "./dist/utils.d.mts",
      "require": "./dist/utils.d.cts"
    }
  }
}
```

ဖြေရှင်းတဲ့ လုပ်ငန်းစဉ် (Resolution process):

1. Import path က `#` နဲ့ စတင်ပါတယ် — `"imports"` ကနေတစ်ဆင့် resolve လုပ်ဖို့ ကြိုးစားပါ။
2. အနီးဆုံး ဘိုးဘေး (ancestor) package.json ထဲမှာ `"imports"` ရှိပါသလား? **ရှိပါတယ်။**
3. `"imports"` object ထဲမှာ `"#utils"` ရှိပါသလား? **ရှိပါတယ်။**
4. `imports["#utils"]` မှာရှိတဲ့ value က object တစ်ခုပါ — conditions တွေကို သတ်မှတ်နေတာ ဖြစ်ရမယ်။
5. ပထမ condition `"import"` က ဒီ request နဲ့ ကိုက်ညီပါသလား? **ကိုက်ညီပါတယ်။**
6. Output path ကို input path တစ်ခုဆီ မြေပုံဆွဲဖို့ ကြိုးစားသင့်ပါသလား? **ကြိုးစားသင့်ပါတယ် — ဘာကြောင့်လဲဆိုတော့:**
   - Package.json က `node_modules` ထဲမှာ ရှိပါသလား? **မရှိပါဘူး — local project ထဲမှာ ရှိပါတယ်။**
   - Tsconfig.json က package.json ရှိတဲ့ directory ထဲမှာ ရှိပါသလား? **ရှိပါတယ်။**
7. `./dist/utils.d.mts` ထဲမှာ `outDir` prefix ကို `rootDir` နဲ့ အစားထိုးပါ။ **`./src/utils.d.mts`**
8. Output extension `.d.mts` ကို သက်ဆိုင်တဲ့ input extension `.mts` နဲ့ အစားထိုးပါ။ **`./src/utils.mts`**
9. `"./src/utils.mts"` ဆိုတဲ့ path ကို — file ရှိနေရင် ပြန်ပေးပါ။
10. မရှိဘူးဆိုရင် — `"./dist/utils.d.mts"` ဆိုတဲ့ path ကို — file ရှိနေရင် ပြန်ပေးပါ။

##### Example: `node_modules` dependency with subpath pattern (ဥပမာ: Subpath pattern ပါတဲ့ `node_modules` dependency)

ဖြစ်စဉ်ဥပမာ (Scenario): `"/node_modules/pkg/main.mts"` က `"#internal/utils"` ကို conditions `["types", "node", "import"]` တွေနဲ့ import လုပ်နေတယ် ဆိုပါစို့ (moduleResolution setting နဲ့ module resolution request ကို စတင်စေတဲ့ context ပေါ်မူတည်ပြီး သတ်မှတ်တာပါ) — package.json က ဒီလိုဆိုရင်:

```json5
// /node_modules/pkg/package.json
{
  "name": "pkg",
  "imports": {
    "#internal/*": {
      "import": "./dist/internal/*.mjs",
      "require": "./dist/internal/*.cjs"
    }
  }
}
```

ဖြေရှင်းတဲ့ လုပ်ငန်းစဉ် (Resolution process):

1.  Import path က `#` နဲ့ စတင်ပါတယ် — `"imports"` ကနေတစ်ဆင့် resolve လုပ်ဖို့ ကြိုးစားပါ။
2.  အနီးဆုံး ဘိုးဘေး (ancestor) package.json ထဲမှာ `"imports"` ရှိပါသလား? **ရှိပါတယ်။**
3.  `"imports"` object ထဲမှာ `"#internal/utils"` ရှိပါသလား? **မရှိပါဘူး — pattern matches တွေကို စစ်ကြည့်ပါ။**
4.  `*` ပါတဲ့ key တစ်ခုခုက `"#internal/utils"` နဲ့ ကိုက်ညီပါသလား? **ကိုက်ညီပါတယ် — `"#internal/*"` က ကိုက်ညီပြီး `utils` ကို substitution အဖြစ် သတ်မှတ်ပါတယ်။**
5.  `imports["#internal/*"]` မှာရှိတဲ့ value က object တစ်ခုပါ — conditions တွေကို သတ်မှတ်နေတာ ဖြစ်ရမယ်။
6.  ပထမ condition `"import"` က ဒီ request နဲ့ ကိုက်ညီပါသလား? **ကိုက်ညီပါတယ်။**
7.  Output path ကို input path တစ်ခုဆီ မြေပုံဆွဲဖို့ ကြိုးစားသင့်ပါသလား? **မလုပ်သင့်ပါဘူး — package.json က `node_modules` ထဲမှာ ရှိနေလို့ပါ။**
8.  `./dist/internal/*.mjs` ထဲမှာ `*` ကို substitution `utils` နဲ့ အစားထိုးပါ။ **`./dist/internal/utils.mjs`**
9.  `./dist/internal/utils.mjs` ဆိုတဲ့ path မှာ TypeScript က အသိအမှတ်ပြုတဲ့ file extension ရှိပါသလား? **မရှိပါဘူး — extension substitution ကို စမ်းကြည့်ပါ။**
10. [Extension substitution](https://www.typescriptlang.org/docs/handbook/modules) ကနေတစ်ဆင့် — အောက်ပါ paths တွေကို စမ်းပြီး — ပထမဆုံး ရှိနေတာကို ပြန်ပေး ၊ ဘာမှ မရှိရင် `undefined` ပြန်ပေးပါ:
    1. `./dist/internal/utils.mts`
    2. `./dist/internal/utils.d.mts`
    3. `./dist/internal/utils.mjs`

### `node16`, `nodenext` (moduleResolution mode များအဖြစ် `node16` ၊ `nodenext`)

ဒီ modes တွေက Node.js v12 နဲ့ နောက်ပိုင်းတွေရဲ့ module resolution အပြုအမူကို ထင်ဟပ်ပါတယ်။ (`node16` နဲ့ `nodenext` တွေက လက်ရှိမှာ တူညီပေမယ့် — Node.js က သူ့ရဲ့ module system ကို အနာဂတ်မှာ သိသိသာသာ ပြောင်းလဲလုပ်မယ်ဆိုရင် — `node16` က အေးခဲသွားပြီး — `nodenext` ကျတော့ အပြုအမူအသစ်ကို ထင်ဟပ်ဖို့ update လုပ်ခံရမှာ ဖြစ်ပါတယ်။) Node.js မှာ — ECMAScript imports တွေအတွက် resolution algorithm က CommonJS `require` calls တွေအတွက် algorithm နဲ့ သိသိသာသာ ကွဲပြားပါတယ်။ Resolve လုပ်နေတဲ့ module specifier တစ်ခုချင်းစီအတွက် — specifier ရဲ့ syntax နဲ့ [import လုပ်နေတဲ့ file ရဲ့ module format](https://www.typescriptlang.org/docs/handbook/modules) ကို ဦးစွာ သုံးပြီး — အဲဒီ module specifier က emit လုပ်ထားတဲ့ JavaScript ထဲမှာ `import` တစ်ခုလား `require` တစ်ခုလားဆိုတာ ဆုံးဖြတ်ပါတယ်။ အဲဒီအချက်အလက်ကို — ဘယ် resolution algorithm ကို သုံးမလဲ (ပြီးတော့ package.json ရဲ့ [`"exports"`](https://www.typescriptlang.org/docs/handbook/modules) ဒါမှမဟုတ် [`"imports"`](https://www.typescriptlang.org/docs/handbook/modules) အတွက် `"import"` condition ကိုသုံးမလား `"require"` condition ကိုသုံးမလဲ) ဆုံးဖြတ်ဖို့ — module resolver ဆီ ပို့ပေးပါတယ်။

> [CommonJS format နဲ့ ဖြစ်ဖို့ သတ်မှတ်ထား](https://www.typescriptlang.org/docs/handbook/modules)တဲ့ TypeScript files တွေက default အနေနဲ့ `import` နဲ့ `export` syntax တွေကို ဆက်သုံးနိုင်ပေမယ့် — emit လုပ်လိုက်တဲ့ JavaScript ကတော့ `require` နဲ့ `module.exports` တွေကို သုံးပါလိမ့်မယ်။ ဒါက — `require` algorithm နဲ့ resolve လုပ်ခံရတဲ့ `import` statements တွေကို မြင်ရတာ သာမန်ပဲ ဆိုတာ ဆိုလိုပါတယ်။ ဒါက ရှုပ်ထွေးစေတယ်ဆိုရင် — `require` calls တွေအဖြစ် emit လုပ်ခံရမယ့် `import` statements တွေရဲ့ အသုံးပြုမှုကို တားမြစ်ပေးတဲ့ `verbatimModuleSyntax` compiler option ကို enable လုပ်နိုင်ပါတယ်။

Dynamic `import()` calls တွေကို — Node.js ရဲ့ အပြုအမူအတိုင်း — `import` algorithm နဲ့ပဲ အမြဲတမ်း resolve လုပ်တယ်ဆိုတာ သတိပြုပါ။ ဒါပေမယ့် — `import()` types တွေကိုတော့ — import လုပ်နေတဲ့ file ရဲ့ format နဲ့အညီ resolve လုပ်ပါတယ် (ရှိပြီးသား CommonJS-format type declarations တွေနဲ့ နောက်ပြန် လိုက်ဖက်ညီမှုအတွက်ပါ):

```ts
// @Filename: module.mts
import x from "./mod.js";             // `import` algorithm due to file format (emitted as-written)
import("./mod.js");                   // `import` algorithm due to syntax (emitted as-written)
type Mod = typeof import("./mod.js"); // `import` algorithm due to file format
import mod = require("./mod");        // `require` algorithm due to syntax (emitted as `require`)

// @Filename: commonjs.cts
import x from "./mod";                // `require` algorithm due to file format (emitted as `require`)
import("./mod.js");                   // `import` algorithm due to syntax (emitted as-written)
type Mod = typeof import("./mod");    // `require` algorithm due to file format
import mod = require("./mod");        // `require` algorithm due to syntax (emitted as `require`)
```

#### Implied and enforced options (အလိုအလျောက် ပါဝင်ပြီး အတင်းအကျပ် သတ်မှတ်ခံရသော options)

- `--moduleResolution node16` နဲ့ `nodenext` တွေကို [`--module node16` ၊ `node18` ၊ `node20` ဒါမှမဟုတ် `nodenext`](https://www.typescriptlang.org/docs/handbook/modules) နဲ့ တွဲဖက်ထားရပါမယ်။

#### Supported features (ထောက်ပံ့ပေးထားသော features များ)

Features တွေကို ဦးစားပေး အစဉ်လိုက် စာရင်းပြုထားပါတယ်။

| | `import` | `require` |
|-| -------- | --------- |
| [`paths`](https://www.typescriptlang.org/docs/handbook/modules) | ✅ | ✅ |
| [`baseUrl`](https://www.typescriptlang.org/docs/handbook/modules) | ✅ | ✅ |
| [`node_modules` package lookups](https://www.typescriptlang.org/docs/handbook/modules) | ✅ | ✅ |
| [package.json `"exports"`](https://www.typescriptlang.org/docs/handbook/modules) | ✅ `types` ၊ `node` ၊ `import` တွေနဲ့ ကိုက်ညီ | ✅ `types` ၊ `node` ၊ `require` တွေနဲ့ ကိုက်ညီ |
| [package.json `"imports"` and self-name imports](https://www.typescriptlang.org/docs/handbook/modules) | ✅ `types` ၊ `node` ၊ `import` တွေနဲ့ ကိုက်ညီ | ✅ `types` ၊ `node` ၊ `require` တွေနဲ့ ကိုက်ညီ |
| [package.json `"typesVersions"`](https://www.typescriptlang.org/docs/handbook/modules) | ✅ | ✅ |
| [Package-relative paths](https://www.typescriptlang.org/docs/handbook/modules) | ✅ `exports` မရှိရင် | ✅ `exports` မရှိရင် |
| [Full relative paths](https://www.typescriptlang.org/docs/handbook/modules) | ✅ | ✅ |
| [Extensionless relative paths](https://www.typescriptlang.org/docs/handbook/modules) | ❌ | ✅ |
| [Directory modules](https://www.typescriptlang.org/docs/handbook/modules) | ❌ | ✅ |

### `bundler` (bundlers များအတွက် module resolution mode)

`--moduleResolution bundler` က JavaScript bundlers အများစုမှာ တူညီတဲ့ module resolution အပြုအမူကို ပုံစံဖော်ဖို့ ကြိုးစားပါတယ်။ အတိုချုပ်ပြောရရင် — Node.js ရဲ့ CommonJS `require` resolution algorithm နဲ့ အစဉ်အလာ ဆက်စပ်နေတဲ့ — [`node_modules` lookups](https://www.typescriptlang.org/docs/handbook/modules) ၊ [directory modules](https://www.typescriptlang.org/docs/handbook/modules) နဲ့ [extensionless paths](https://www.typescriptlang.org/docs/handbook/modules) လို အပြုအမူတွေ အားလုံးကို ထောက်ပံ့ပြီး — [package.json ရဲ့ `"exports"`](https://www.typescriptlang.org/docs/handbook/modules) နဲ့ [package.json ရဲ့ `"imports"`](https://www.typescriptlang.org/docs/handbook/modules) လို — ပိုသစ်တဲ့ Node.js resolution features တွေကိုပါ ထောက်ပံ့ပါတယ်။

`--moduleResolution bundler` နဲ့ `--moduleResolution nodenext` ကြားက တူညီမှုတွေရော ကွာခြားမှုတွေရော — အထူးသဖြင့် package.json ရဲ့ `"exports"` ဒါမှမဟုတ် `"imports"` တွေကို resolve လုပ်တဲ့အခါ ဘယ် conditions တွေကို သုံးမလဲ ဆုံးဖြတ်ပုံ — ကို စဉ်းစားကြည့်တာ အကျိုးရှိပါတယ်။ `.ts` file တစ်ခုထဲက import statement တစ်ခုကို စဉ်းစားကြည့်ပါ:

```ts
// index.ts
import { foo } from "pkg";
```

`--module nodenext --moduleResolution nodenext` မှာ — `--module` setting က ဦးစွာ import က `.js` file ထဲမှာ `import` call တစ်ခုလား `require` call တစ်ခုလားဆိုပြီး [ဆုံးဖြတ်](https://www.typescriptlang.org/docs/handbook/modules)ပြီး — အဲဒီအချက်အလက်ကို — `"pkg"` ရဲ့ package.json `"exports"` ထဲမှာ `"import"` condition ကို ကိုက်ညီအောင် လုပ်မလား `"require"` condition ကို ကိုက်ညီအောင် လုပ်မလား ဆုံးဖြတ်တဲ့ — TypeScript ရဲ့ module resolver ဆီ ပို့ပေးတယ်ဆိုတာ ပြန်သတိရပါ။ ဒီ file ရဲ့ scope ထဲမှာ package.json မရှိဘူးလို့ ယူဆကြည့်ရအောင်။ File extension က `.ts` ဖြစ်လို့ — output file extension က `.js` ဖြစ်မယ် — Node.js က အဲဒါကို CommonJS အနေနဲ့ အနက်ဖွင့်မယ် — ဒါကြောင့် TypeScript က ဒီ `import` ကို `require` call တစ်ခုအနေနဲ့ emit လုပ်မယ်။ ဒါကြောင့် — module resolver က `"pkg"` ကနေ `"exports"` တွေကို resolve လုပ်တဲ့အခါ `require` condition ကို သုံးပါလိမ့်မယ်။

`--moduleResolution bundler` မှာလည်း ဒီလုပ်ငန်းစဉ်အတိုင်းပဲ ဖြစ်ပေမယ့် — ဒီ import statement အတွက် `import` call တစ်ခုလား `require` call တစ်ခုလား emit လုပ်မလဲ ဆုံးဖြတ်တဲ့ စည်းမျဉ်းတွေကတော့ မတူပါဘူး — `--moduleResolution bundler` က [`--module esnext`](https://www.typescriptlang.org/docs/handbook/modules) ဒါမှမဟုတ် [`--module preserve`](https://www.typescriptlang.org/docs/handbook/modules) တွေကို သုံးဖို့ လိုအပ်လို့ပါ။ Mode နှစ်ခုလုံးမှာ — ESM `import` declarations တွေက ESM `import` declarations တွေအနေနဲ့ပဲ အမြဲတမ်း emit လုပ်တာမို့ — TypeScript ရဲ့ module resolver က အဲဒီအချက်အလက်ကို လက်ခံရရှိပြီး — `"pkg"` ကနေ `"exports"` တွေကို resolve လုပ်တဲ့အခါ `"import"` condition ကို သုံးပါလိမ့်မယ်။

ဒီရှင်းလင်းချက်က နည်းနည်း စိတ်ထဲ မဝင်နိုင်စရာ ဖြစ်နိုင်ပါတယ် — `--moduleResolution bundler` က ပုံမှန်အားဖြင့် `--noEmit` နဲ့ တွဲသုံးလေ့ ရှိလို့ပါ — bundlers တွေက ပုံမှန်အားဖြင့် raw `.ts` files တွေကို process လုပ်ပြီး — transform မလုပ်ရသေးတဲ့ `import`s တွေနဲ့ `require`s တွေပေါ်မှာ module resolution ကို လုပ်ဆောင်ပါတယ်။ ဒါပေမယ့် — ညီညွတ်မှုအတွက် — TypeScript က `module` က ဆုံးဖြတ်တဲ့ စိတ်ကူးယဉ် emit ကို module resolution ရော type checking ရောအတွက် အသိပေးချက်အဖြစ် ဆက်သုံးပါတယ်။ ဒါကြောင့် — runtime ဒါမှမဟုတ် bundler တစ်ခုက raw `.ts` files တွေပေါ်မှာ အလုပ်လုပ်နေတဲ့အခါတိုင်း — transformation မရှိဘူးလို့ ဆိုလိုတဲ့ — [`--module preserve`](https://www.typescriptlang.org/docs/handbook/modules) က အကောင်းဆုံး ရွေးချယ်မှုပါ။ `--module preserve --moduleResolution bundler` အောက်မှာ — imports တွေရော requires တွေရော တစ်ခုတည်းသော file ထဲမှာ ရေးပြီး — အသီးသီး `import` နဲ့ `require` conditions တွေနဲ့ resolve လုပ်နိုင်ပါတယ်:

```ts
// index.ts
import pkg1 from "pkg";       // Resolved with "import" condition
import pkg2 = require("pkg"); // Resolved with "require" condition
```


#### Implied and enforced options (အလိုအလျောက် ပါဝင်ပြီး အတင်းအကျပ် သတ်မှတ်ခံရသော options)

- `--moduleResolution bundler` ကို `--module esnext` ဒါမှမဟုတ် `--module preserve` နဲ့ တွဲဖက်ထားရပါမယ်။
- `--moduleResolution bundler` က `--allowSyntheticDefaultImports` ကို imply လုပ်ပါတယ်။

#### Supported features (ထောက်ပံ့ပေးထားသော features များ)

- [`paths`](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [`baseUrl`](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [`node_modules` package lookups](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [package.json `"exports"`](https://www.typescriptlang.org/docs/handbook/modules) ✅ syntax ပေါ် မူတည်ပြီး `types` ၊ `import`/`require` တွေနဲ့ ကိုက်ညီ
- [package.json `"imports"` and self-name imports](https://www.typescriptlang.org/docs/handbook/modules) ✅ syntax ပေါ် မူတည်ပြီး `types` ၊ `import`/`require` တွေနဲ့ ကိုက်ညီ
- [package.json `"typesVersions"`](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [Package-relative paths](https://www.typescriptlang.org/docs/handbook/modules) ✅ `exports` မရှိရင်
- [Full relative paths](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [Extensionless relative paths](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [Directory modules](https://www.typescriptlang.org/docs/handbook/modules) ✅

### `node10` (formerly known as `node`) (node10 mode — ယခင်က `node` ဟု သိကြသော mode)

`--moduleResolution node` ကို TypeScript 5.0 မှာ `node10` လို့ အမည်ပြောင်းခဲ့ပါတယ် (နောက်ပြန် လိုက်ဖက်ညီမှုအတွက် `node` ကို alias တစ်ခုအနေနဲ့ ထားရှိပါတယ်)။ ဒါက Node.js v12 မတိုင်ခင် ဗားရှင်းတွေမှာ တည်ရှိခဲ့တဲ့ CommonJS module resolution algorithm ကို ထင်ဟပ်ပါတယ်။ ဒါကို နောက်ထပ် သုံးစရာ မလိုတော့ပါဘူး။

#### Supported features (ထောက်ပံ့ပေးထားသော features များ)

- [`paths`](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [`baseUrl`](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [`node_modules` package lookups](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [package.json `"exports"`](https://www.typescriptlang.org/docs/handbook/modules) ❌
- [package.json `"imports"` and self-name imports](https://www.typescriptlang.org/docs/handbook/modules) ❌
- [package.json `"typesVersions"`](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [Package-relative paths](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [Full relative paths](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [Extensionless relative paths](https://www.typescriptlang.org/docs/handbook/modules) ✅
- [Directory modules](https://www.typescriptlang.org/docs/handbook/modules) ✅

### `classic` (မသုံးသင့်သော ရှေးကျ mode)

`classic` ကို မသုံးပါနဲ့။
