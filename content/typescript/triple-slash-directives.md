---
title: "Triple-Slash Directives (Triple-Slash ညွှန်ကြားချက်များ)"
description: "Triple-slash directives (XML tag တစ်ခုတည်းပါသော compiler ညွှန်ကြားချက်များ) အကြောင်း — reference path/types/lib directives, no-default-lib, amd-module, amd-dependency နဲ့ preserve=\"true\""
order: 63
source: "https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html"
status: translated
updated: 2026-09-05
---

Triple-slash directives တွေက — XML tag တစ်ခုတည်း ပါဝင်တဲ့ single-line comments (စာကြောင်းတစ်ကြောင်း မှတ်ချက်များ) တွေ ဖြစ်ပါတယ်။
ဒီ comments တွေရဲ့ ပါဝင်ချက်တွေကို compiler directives (compiler ညွှန်ကြားချက်များ) အနေနဲ့ သုံးပါတယ်။

Triple-slash directives တွေက သူတို့ ပါဝင်တဲ့ file ရဲ့ ထိပ်ဆုံးမှာသာ — **မှန်ကန်ပါတယ်** — ဆိုလိုတာက triple-slash directive တစ်ခုရဲ့ ရှေ့မှာ single-line ဒါမှမဟုတ် multi-line comments တွေပဲ ရှိနိုင်ပြီး — တခြား triple-slash directives တွေလည်း ပါဝင်နိုင်ပါတယ်။
ဒါတွေကို statement (ကြေညာချက်) ဒါမှမဟုတ် declaration တစ်ခုရဲ့ နောက်မှာ တွေ့ရတယ်ဆိုရင် — သာမန် single-line comments တွေလိုပဲ သဘောထားပြီး — အထူး အဓိပ္ပာယ် ဘာမှ မရှိတော့ပါဘူး။

TypeScript 5.5 ကစပြီး — compiler က reference directives တွေကို ထုတ်လုပ်တာ မရှိတော့ဘဲ — [`preserve="true"`](https://www.typescriptlang.org/docs/handbook) လို့ အမှတ်အသား ပြုထားတဲ့ directives တွေကလွဲရင် — လက်နဲ့ရေးထားတဲ့ triple-slash directives တွေကို output files တွေဆီ _emit (ထုတ်လွှင့်)_ လုပ်တာ မရှိတော့ပါဘူး။

## `/// <reference path="..." />` (Path ရည်ညွှန်းချက်)

`/// <reference path="..." />` directive က ဒီအုပ်စုထဲမှာ အသုံးအများဆုံး ဖြစ်ပါတယ်။
ဒါက files တွေကြားက _dependency (မှီခိုမှု)_ တစ်ခုရဲ့ ကြေညာချက် (declaration) အနေနဲ့ ဆောင်ရွက်ပါတယ်။

Triple-slash references တွေက — compile လုပ်တဲ့ လုပ်ငန်းစဉ်ထဲမှာ နောက်ထပ် files တွေကို ထည့်သွင်းဖို့ compiler ကို ညွှန်ကြားပါတယ်။

ဒါတွေက — [`out`](https://www.typescriptlang.org/tsconfig) ဒါမှမဟုတ် [`outFile`](https://www.typescriptlang.org/tsconfig) သုံးတဲ့အခါ — output ကို အစဉ်လိုက် စီစဉ်ဖို့ နည်းလမ်းတစ်ခုအနေနဲ့လည်း ဆောင်ရွက်ပါတယ်။
Preprocessing pass (ကြိုတင်ပြင်ဆင်ခြင်း အဆင့်) ပြီးတဲ့အခါ — files တွေကို input ရဲ့ အစဉ်လိုက်အတိုင်းပဲ output file ရဲ့ တည်နေရာဆီ emit လုပ်ပါတယ်။

### Preprocessing input files (Input Files များကို ကြိုတင်ပြင်ဆင်ခြင်း)

Compiler က triple-slash reference directives တွေ အားလုံးကို ဖြေရှင်းဖို့ — input files တွေပေါ်မှာ preprocessing pass တစ်ခု လုပ်ဆောင်ပါတယ်။
ဒီလုပ်ငန်းစဉ်အတွင်း — compilation ထဲကို နောက်ထပ် files တွေ ထည့်သွင်းပါတယ်။

ဒီလုပ်ငန်းစဉ်က _root files (အခြေခံ files များ)_ အစုတစ်ခုနဲ့ စတင်ပါတယ် — ဒါတွေက command-line မှာ ဒါမှမဟုတ် `tsconfig.json` file ထဲက [`files`](https://www.typescriptlang.org/tsconfig) list ထဲမှာ သတ်မှတ်ထားတဲ့ file အမည်တွေ ဖြစ်ပါတယ်။
Root files တွေကို သတ်မှတ်ထားတဲ့ အစဉ်အတိုင်း preprocess လုပ်ပါတယ်။
File တစ်ခုကို list ထဲ မထည့်ခင် — အဲဒီ file ထဲက triple-slash references တွေ အားလုံးကို လုပ်ဆောင်ပြီး — သူတို့ ရည်ညွှန်းတဲ့ targets တွေကို ထည့်သွင်းပါတယ်။
Triple-slash references တွေကို file ထဲမှာ တွေ့ရှိရတဲ့ အစဉ်အတိုင်း — depth-first (နက်ရှိုင်းရာ အရင်ဆုံး) ပုံစံနဲ့ ဖြေရှင်းပါတယ်။

Relative path သုံးထားတယ်ဆိုရင် — triple-slash reference တစ်ခုရဲ့ path ကို — သူပါဝင်တဲ့ file ကို အခြေခံပြီး ဖြေရှင်းပါတယ်။

### Errors (Error များ)

မရှိတဲ့ file တစ်ခုကို reference လုပ်တာက error ဖြစ်ပါတယ်။
File တစ်ခုက သူ့ကိုယ်သူ triple-slash reference လုပ်တာလည်း error ဖြစ်ပါတယ်။

### Using `--noResolve` (`--noResolve` ကို သုံးခြင်း)

[`noResolve`](https://www.typescriptlang.org/tsconfig) ဆိုတဲ့ compiler flag ကို သတ်မှတ်ထားရင် — triple-slash references တွေကို လျစ်လျူရှုပါတယ်; ဒါတွေက files အသစ်တွေ ထပ်ထည့်တာလည်း မရှိသလို — ပေးထားတဲ့ files တွေရဲ့ အစဉ်ကိုလည်း မပြောင်းလဲပါဘူး။

## `/// <reference types="..." />` (Types ရည်ညွှန်းချက်)

_dependency_ တစ်ခုရဲ့ ကြေညာချက်အနေနဲ့ ဆောင်ရွက်တဲ့ `/// <reference path="..." />` directive လိုပဲ — `/// <reference types="..." />` directive က package တစ်ခုအပေါ် မှီခိုမှုကို ကြေညာပါတယ်။

ဒီ package အမည်တွေကို ဖြေရှင်းတဲ့ လုပ်ငန်းစဉ်က — `import` statement တစ်ခုထဲမှာ module အမည်တွေကို ဖြေရှင်းတဲ့ လုပ်ငန်းစဉ်နဲ့ ဆင်တူပါတယ်။
Triple-slash-reference-types directives တွေကို — declaration packages တွေအတွက် `import` တစ်ခုလို့ ထင်မှတ်ကြည့်ရင် နားလည်ဖို့ လွယ်ပါတယ်။

ဥပမာ — declaration file တစ်ခုထဲမှာ `/// <reference types="node" />` ထည့်လိုက်တာက — ဒီ file က `@types/node/index.d.ts` ထဲမှာ ကြေညာထားတဲ့ အမည်တွေကို သုံးတယ်လို့ ကြေညာလိုက်တာ ဖြစ်ပြီး — ဒါကြောင့် ဒီ package ကို declaration file နဲ့အတူ compilation ထဲ ထည့်သွင်းဖို့ လိုအပ်ပါတယ်။

`.ts` file တစ်ခုထဲမှာ `@types` package တစ်ခုအပေါ် မှီခိုမှု ကြေညာချင်ရင်တော့ — အဲဒီအစား command line ဒါမှမဟုတ် သင့် `tsconfig.json` ထဲမှာ [`types`](https://www.typescriptlang.org/tsconfig) ကို သုံးပါ။
အသေးစိတ်အတွက် [`tsconfig.json` files တွေထဲမှာ `@types`, `typeRoots` နဲ့ `types` သုံးခြင်း](/docs/typescript/tsconfig-json) ကို ကြည့်ပါ။

## `/// <reference lib="..." />` (Lib ရည်ညွှန်းချက်)

ဒီ directive က — file တစ်ခုအနေနဲ့ — ရှိပြီးသား built-in _lib_ file တစ်ခုကို တိကျစွာ ထည့်သွင်းနိုင်အောင် ခွင့်ပြုပါတယ်။

Built-in _lib_ files တွေကို — _tsconfig.json_ ထဲက [`lib`](https://www.typescriptlang.org/tsconfig) compiler option ကို reference လုပ်သလိုမျိုးပဲ — reference လုပ်ပါတယ် (ဥပမာ — `lib="es2015"` လို့ သုံးပြီး `lib="lib.es2015.d.ts"` လို့ မသုံးရဘူး စသဖြင့်)။

DOM APIs ဒါမှမဟုတ် `Symbol` ဒါမှမဟုတ် `Iterable` လို built-in JS run-time constructors စတဲ့ — built-in types တွေကို မှီခိုတဲ့ declaration file တွေ ရေးသားသူတွေအတွက် — triple-slash-reference lib directives တွေကို အကြံပြုပါတယ်။
အရင်က ဒီ .d.ts files တွေက — အဲဒီလို types တွေရဲ့ forward/duplicate declarations (ရှေ့ကြိုကြေညာချက်/နှစ်ဆကြေညာချက်များ) တွေကို ထည့်ပေးရပါတယ်။

ဥပမာ — compilation ထဲက file တစ်ခုထဲကို `/// <reference lib="es2017.string" />` ထည့်လိုက်တာက — `--lib es2017.string` နဲ့ compile လုပ်တာနဲ့ ညီမျှပါတယ်။

```ts
/// <reference lib="es2017.string" />

"foo".padStart(4);
```

## `/// <reference no-default-lib="true"/>` (No-default-lib ရည်ညွှန်းချက်)

ဒီ directive က file တစ်ခုကို _default library_ အဖြစ် အမှတ်အသား ပြုပါတယ်။
`lib.d.ts` ရဲ့ ထိပ်ဆုံးမှာရော — သူ့ရဲ့ မတူညီတဲ့ variants (မူကွဲများ) တွေရဲ့ ထိပ်မှာပါ — ဒီ comment ကို တွေ့ရမှာ ဖြစ်ပါတယ်။

ဒီ directive က — compilation ထဲမှာ default library (ဆိုလိုတာက `lib.d.ts`) ကို _မထည့်သွင်းဖို့_ compiler ကို ညွှန်ကြားပါတယ်။
ဒီမှာ သက်ရောက်မှုက command line မှာ [`noLib`](https://www.typescriptlang.org/tsconfig) ပေးလိုက်တာနဲ့ ဆင်တူပါတယ်။

ပြီးတော့ — [`skipDefaultLibCheck`](https://www.typescriptlang.org/tsconfig) ပေးလိုက်တဲ့အခါ — compiler က `/// <reference no-default-lib="true"/>` ပါတဲ့ files တွေကိုပဲ check လုပ်တာ ကျော်လိုက်မယ်ဆိုတာ သတိပြုပါ။

## `/// <amd-module />` (AMD Module ကြေညာချက်)

ပုံမှန်အားဖြင့် — AMD modules တွေကို anonymous (အမည်မဲ့) အနေနဲ့ ထုတ်လုပ်ပါတယ်။
ဒါက — bundlers (ဥပမာ `r.js`) လို တခြား tools တွေနဲ့ ရလာတဲ့ modules တွေကို process လုပ်တဲ့အခါ — ပြဿနာတွေ ဖြစ်စေနိုင်ပါတယ်။

`amd-module` directive က — optional (မထည့်လည်းရတဲ့) module အမည်တစ်ခုကို compiler ဆီ ပေးပို့နိုင်အောင် ခွင့်ပြုပါတယ်:

##### amdModule.ts

```ts
/// <amd-module name="NamedModule"/>
export class C {}
```

ဒါက — AMD `define` ကို ခေါ်တဲ့အခါမှာ module ကို `NamedModule` ဆိုတဲ့ အမည် သတ်မှတ်ပေးတာမျိုး ဖြစ်စေပါတယ်:

##### amdModule.js

```js
define("NamedModule", ["require", "exports"], function (require, exports) {
  var C = (function () {
    function C() {}
    return C;
  })();
  exports.C = C;
});
```

## `/// <amd-dependency />` (AMD Dependency ကြေညာချက်)

> **မှတ်ချက်:** ဒီ directive က deprecated (ဖျက်သိမ်းထား) ဖြစ်သွားပါပြီ။ အဲဒီအစား `import "moduleName";` statements တွေကို သုံးပါ။

`/// <amd-dependency path="x" />` က — ရလာတဲ့ module ရဲ့ require call ထဲကို ထည့်သွင်းဖို့ လိုအပ်တဲ့ — non-TS module dependency တစ်ခုအကြောင်း compiler ကို အသိပေးပါတယ်။

`amd-dependency` directive မှာ optional `name` property တစ်ခုလည်း ပါနိုင်ပါတယ် — ဒါက amd-dependency တစ်ခုအတွက် optional အမည်တစ်ခုကို ပေးပို့နိုင်စေပါတယ်:

```ts
/// <amd-dependency path="legacy/moduleA" name="moduleA"/>
declare var moduleA: MyType;
moduleA.callStuff();
```

ထုတ်လုပ်လိုက်တဲ့ JS code:

```js
define(["require", "exports", "legacy/moduleA"], function (
  require,
  exports,
  moduleA
) {
  moduleA.callStuff();
});
```

## `preserve="true"` (Preserve — ထိန်းသိမ်းခြင်း)

Triple-slash directives တွေကို `preserve="true"` နဲ့ အမှတ်အသား ပြုထားရင် — compiler က သူတို့ကို output ကနေ ဖယ်ရှားတာ မလုပ်နိုင်အောင် တားဆီးနိုင်ပါတယ်။

ဥပမာ — ဒါတွေကတော့ output ထဲမှာ ဖျက်ပစ်ခံရမှာ ဖြစ်ပါတယ်:

```ts
/// <reference path="..." />
/// <reference types="..." />
/// <reference lib="..." />
```

ဒါပေမယ့် ဒါတွေကတော့ ထိန်းသိမ်းခံရမှာ ဖြစ်ပါတယ်:

```ts
/// <reference path="..." preserve="true" />
/// <reference types="..." preserve="true" />
/// <reference lib="..." preserve="true" />
```
