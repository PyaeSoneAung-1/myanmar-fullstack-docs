---
title: "TypeScript 4.7 (TypeScript 4.7 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 4.7 ထုတ်ပြန်မှုမှတ်စု — Node.js တွင် ECMAScript module ပံ့ပိုးမှု (node16/nodenext) ၊ moduleDetection ၊ instantiation expressions ၊ infer type variables များပေါ်က extends constraints ၊ variance annotations ၊ moduleSuffixes ၊ resolution-mode ၊ breaking changes များ"
order: 87
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html"
status: translated
updated: 2026-09-05
---

## ECMAScript Module Support in Node.js (Node.js တွင် ECMAScript Module ပံ့ပိုးမှု)

လွန်ခဲ့တဲ့ နှစ်အနည်းငယ်အတွင်း — Node.js က ECMAScript modules (ESM) တွေကို ပံ့ပိုးပေးနိုင်ဖို့ ကြိုးပမ်း လုပ်ဆောင်ခဲ့ပါတယ်။ ဒါက အတော်လေး ခက်ခဲတဲ့ feature တစ်ခု ဖြစ်ခဲ့ပါတယ် — Node.js ရဲ့ ecosystem ကြီးက CommonJS (CJS) လို့ခေါ်တဲ့ မတူညီတဲ့ module system တစ်ခုအပေါ်မှာ တည်ဆောက်ထားလို့ပါ။ နှစ်ခုကြား အပြန်အလှန် ချိတ်ဆက် အလုပ်လုပ်နိုင်ဖို့ဆိုတာ — ကိုင်တွယ်ရမယ့် feature အသစ်တွေ အများကြီးနဲ့အတူ — ကြီးမားတဲ့ စိန်ခေါ်မှုတွေ ဖြစ်စေပါတယ်; ဒါပေမယ့် Node.js မှာ ESM အတွက် ပံ့ပိုးမှုကို Node.js 12 နဲ့ ၎င်းနောက်ပိုင်း versions တွေမှာ အကြမ်းဖျင်း အကောင်အထည်ဖော်နိုင်ခဲ့ပါပြီ။ TypeScript 4.5 လောက်မှာ — user တွေဆီကနေ feedback ရယူဖို့နဲ့ library authors တွေ ပိုကျယ်ပြန့်တဲ့ ပံ့ပိုးမှုတွေအတွက် ကြိုတင် ပြင်ဆင်နိုင်ဖို့ — Node.js ထဲက ESM အတွက် nightly-only ပံ့ပိုးမှုကို စတင် ထုတ်ပေးခဲ့ပါတယ်။

TypeScript 4.7 က ဒီလုပ်ဆောင်ချက်ကို `module` settings အသစ် နှစ်ခုဖြစ်တဲ့ `node16` နဲ့ `nodenext` တို့နဲ့အတူ ထည့်သွင်းပေးပါတယ်။

```jsonc
{
    "compilerOptions": {
        "module": "node16",
    }
}
```

ဒီ modes အသစ်တွေက high-level features တစ်ချို့ကို ယူဆောင်လာပြီး — အဲဒါတွေကို ဒီမှာ လေ့လာသွားပါမယ်။

### `type` in `package.json` and New Extensions (`package.json` ထဲက `type` နှင့် Extension အသစ်များ)

Node.js က `package.json` ထဲမှာ `type` လို့ခေါ်တဲ့ [setting အသစ်တစ်ခုကို ပံ့ပိုးပေးပါတယ်](https://nodejs.org/api/packages.html#packages_package_json_and_file_extensions)။ `"type"` ကို `"module"` ဒါမှမဟုတ် `"commonjs"` — တစ်ခုခုအနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။

```jsonc
{
    "name": "my-package",
    "type": "module",

    "//": "...",
    "dependencies": {
    }
}
```

ဒီ setting က `.js` နဲ့ `.d.ts` files တွေကို ES modules အဖြစ်လား CommonJS modules အဖြစ်လား အဓိပ္ပာယ်ဖွင့်ဆိုမလဲဆိုတာကို ထိန်းချုပ်ပြီး — မသတ်မှတ်ထားရင် CommonJS ကို default အဖြစ် ယူပါတယ်။ File တစ်ခုကို ES module အဖြစ် သတ်မှတ်လိုက်တဲ့အခါ — CommonJS နဲ့ ယှဉ်ရင် စည်းမျဉ်း အနည်းငယ် ကွဲပြားလာပါတယ်:

* `import`/`export` statements တွေကို သုံးနိုင်ပါတယ်။
* Top-level `await` ကို သုံးနိုင်ပါတယ်။
* Relative import paths တွေမှာ extension အပြည့်အစုံ ပါဖို့ လိုပါတယ် (`import "./foo"` အစား `import "./foo.js"` လို့ ရေးရပါတယ်)။
* Imports တွေက `node_modules` ထဲက dependencies တွေကနေ ကွဲပြားတဲ့ နည်းလမ်းနဲ့ resolve ဖြစ်နိုင်ပါတယ်။
* `require` နဲ့ `module` လိုမျိုး global-like values တချို့ကို တိုက်ရိုက် သုံးလို့ မရပါဘူး။
* CommonJS modules တွေကို အထူး စည်းမျဉ်းတချို့အရ import လုပ်ပါတယ်။

ဒီအထဲက တချို့ဆီ နောက်မှ ပြန်လာပါမယ်။

ဒီ system ထဲမှာ TypeScript အလုပ်လုပ်ပုံကို ထပ်ဆင့်ပေါင်းစပ်ဖို့ဆိုရင် — `.ts` နဲ့ `.tsx` files တွေက အခုဆိုရင် အလားတူ နည်းလမ်းအတိုင်း အလုပ်လုပ်ပါတယ်။ TypeScript က `.ts` ၊ `.tsx` ၊ `.js` ဒါမှမဟုတ် `.jsx` file တစ်ခုကို တွေ့တဲ့အခါ — အဲဒီ file က ES module လားဆိုတာ သိဖို့ `package.json` တစ်ခုကို ရှာတွေ့သည်အထိ အပေါ်ကို လမ်းလျှောက်ကြည့်ပြီး — အောက်ပါတို့ကို ဆုံးဖြတ်ဖို့ အသုံးပြုပါတယ်:

* အဲဒီ file က import လုပ်တဲ့ တခြား modules တွေကို ဘယ်လို ရှာဖွေရမလဲ
* ပြီးတော့ outputs ထုတ်ပေးမယ်ဆိုရင် အဲဒီ file ကို ဘယ်လို transform လုပ်ရမလဲ

`.ts` file တစ်ခုကို ES module အဖြစ် compile လုပ်တဲ့အခါ — ECMAScript `import`/`export` statements တွေကို `.js` output ထဲမှာ မပြောင်းလဲဘဲ ထားလိုက်ပါတယ်; CommonJS module အဖြစ် compile လုပ်တဲ့အခါမှာတော့ — `--module commonjs` အောက်မှာ ယနေ့ သင်ရရှိနေတဲ့ output အတိုင်းပဲ ထုတ်ပေးပါတယ်။

ဒါက ES modules တွေဖြစ်တဲ့ `.ts` files တွေနဲ့ CJS modules တွေကြားမှာ paths တွေ ကွဲပြားစွာ resolve ဖြစ်တယ်လို့လည်း ဆိုလိုပါတယ်။ ဥပမာ — သင့်မှာ အောက်ပါ code ရှိတယ်ဆိုပါစို့:

```ts
// ./foo.ts
export function helper() {
    // ...
}

// ./bar.ts
import { helper } from "./foo"; // only works in CJS

helper();
```

ဒီ code က CommonJS modules တွေထဲမှာ အလုပ်လုပ်ပေမယ့် — ES modules တွေထဲမှာတော့ မအောင်မြင်ပါဘူး — ဘာလို့လဲဆိုတော့ relative import paths တွေမှာ extensions တွေ သုံးဖို့ လိုလို့ပါ။ ရလဒ်အနေနဲ့ — `foo.ts` ရဲ့ _output_ ရဲ့ extension ကို သုံးဖို့ ပြန်ရေးရပါလိမ့်မယ် — ဒါကြောင့် `bar.ts` က `./foo.js` ကနေ import လုပ်ရမှာ ဖြစ်ပါတယ်။

```ts
// ./bar.ts
import { helper } from "./foo.js"; // works in ESM & CJS

helper();
```

ဒါက အစပိုင်းမှာ နည်းနည်း ကသိကအောက် ဖြစ်စေနိုင်ပေမယ့် — auto-imports နဲ့ path completion လိုမျိုး TypeScript tooling တွေက ဒါမျိုးကို ပုံမှန်အားဖြင့် သင့်အတွက် လုပ်ပေးပါလိမ့်မယ်။

နောက်ထပ် ပြောစရာ တစ်ချက်က — ဒါက `.d.ts` files တွေမှာပါ သက်ရောက်တယ်ဆိုတာပါ။ TypeScript က package တစ်ခုထဲမှာ `.d.ts` file တစ်ခုကို တွေ့တဲ့အခါ — ပါဝင်တဲ့ package အပေါ် အခြေခံပြီး အဓိပ္ပာယ်ဖွင့်ဆိုပါတယ်။

### New File Extensions (File Extension အသစ်များ)

`package.json` ထဲက `type` field က ကောင်းပါတယ် — အဆင်ပြေစေနိုင်တဲ့ `.ts` နဲ့ `.js` file extensions တွေကို ဆက်ပြီး သုံးနိုင်လို့ပါ; ဒါပေမယ့် — `type` က သတ်မှတ်ထားတာနဲ့ ကွဲပြားတဲ့ file တစ်ခုကို ရေးဖို့ လိုအပ်တဲ့ အခါမျိုးတွေ ရံဖန်ရံခါ ကြုံရနိုင်ပါတယ်။ ဒါမှမဟုတ် အမြဲတမ်း ရှင်းရှင်းလင်းလင်း ဖော်ပြချင်တာမျိုးလည်း ဖြစ်နိုင်ပါတယ်။

Node.js က ဒါအတွက် extension နှစ်ခုကို ပံ့ပိုးပါတယ်: `.mjs` နဲ့ `.cjs`။ `.mjs` files တွေက အမြဲတမ်း ES modules တွေ ဖြစ်ပြီး — `.cjs` files တွေက အမြဲတမ်း CommonJS modules တွေ ဖြစ်ပါတယ် — ဒါတွေကို override လုပ်ဖို့ နည်းလမ်း မရှိပါဘူး။

အလှည့်ကျအနေနဲ့ — TypeScript က source file extensions အသစ် နှစ်ခုဖြစ်တဲ့ `.mts` နဲ့ `.cts` တို့ကို ပံ့ပိုးပါတယ်။ TypeScript က ဒါတွေကို JavaScript files အဖြစ် emit လုပ်တဲ့အခါ — `.mjs` နဲ့ `.cjs` အဖြစ် အသီးသီး emit လုပ်ပါတယ်။

ဒါ့အပြင် — TypeScript က declaration file extensions အသစ် နှစ်ခုဖြစ်တဲ့ `.d.mts` နဲ့ `.d.cts` တို့ကိုလည်း ပံ့ပိုးပါတယ်။ TypeScript က `.mts` နဲ့ `.cts` တွေအတွက် declaration files တွေ ထုတ်ပေးတဲ့အခါ — သက်ဆိုင်တဲ့ extensions တွေက `.d.mts` နဲ့ `.d.cts` ဖြစ်ပါလိမ့်မယ်။

ဒီ extensions တွေကို သုံးတာက လုံးဝ optional ဖြစ်ပေမယ့် — သင့် primary workflow ရဲ့ အစိတ်အပိုင်းအဖြစ် မသုံးဖို့ ရွေးချယ်ထားရင်တောင် — မကြာခဏဆိုသလို အသုံးဝင်ပါလိမ့်မယ်။

### CommonJS Interoperability (CommonJS အပြန်အလှန် အလုပ်လုပ်နိုင်မှု)

Node.js က ES modules တွေကို — default export ပါတဲ့ ES modules တွေလိုပဲ — CommonJS modules တွေကို import လုပ်ခွင့် ပြုပါတယ်။

```ts
// ./foo.cts
export function helper() {
    console.log("hello world!");
}

// ./bar.mts
import foo from "./foo.cjs";

// prints "hello world!"
foo.helper();
```

အချို့သော အခြေအနေတွေမှာ — Node.js က CommonJS modules တွေကနေ named exports တွေကိုလည်း synthesize (ပေါင်းစပ် ဖန်တီး) လုပ်ပေးပါတယ် — ဒါက ပိုပြီး အဆင်ပြေစေနိုင်ပါတယ်။ ဒီလိုအခြေအနေတွေမှာ — ES modules တွေက "namespace-style" import (ဥပမာ `import * as foo from "..."`) ဒါမှမဟုတ် named imports (ဥပမာ `import { helper } from "..."`) တွေကို သုံးနိုင်ပါတယ်။

```ts
// ./foo.cts
export function helper() {
    console.log("hello world!");
}

// ./bar.mts
import { helper } from "./foo.cjs";

// prints "hello world!"
helper();
```

ဒီ named imports တွေ synthesize လုပ်ခံရမလားဆိုတာကို TypeScript က အမြဲတမ်း သိနိုင်တာတော့ မဟုတ်ပါဘူး — ဒါပေမယ့် TypeScript က ခွင့်ပြုပေးတတ်တဲ့ (permissive) ဘက်က ရပ်ပြီး — CommonJS module တစ်ခုလို့ သေချာတဲ့ file တစ်ခုကနေ import လုပ်တဲ့အခါ heuristic တချို့ သုံးပါတယ်။

Interop နဲ့ ပတ်သက်တဲ့ TypeScript-specific မှတ်စု တစ်ခုကတော့ အောက်ပါ syntax ပါ:

```ts
import foo = require("foo");
```

CommonJS module တစ်ခုထဲမှာ — ဒါက `require()` call တစ်ခုအထိပဲ ရိုးရှင်းသွားပြီး — ES module တစ်ခုထဲမှာတော့ — အလားတူ ရလဒ်ရဖို့ [`createRequire`](https://nodejs.org/api/module.html#module_module_createrequire_filename) ကို import လုပ်ပါတယ်။ ဒါက code ကို browser လိုမျိုး runtimes တွေမှာ (`require()` ကို မပံ့ပိုးတဲ့) သယ်ယူသုံးစွဲနိုင်မှု (portability) နည်းစေပေမယ့် — interoperability အတွက်တော့ မကြာခဏ အသုံးဝင်ပါလိမ့်မယ်။ အလှည့်ကျအနေနဲ့ — အပေါ်က ဥပမာကို ဒီ syntax သုံးပြီး အောက်ပါအတိုင်း ရေးနိုင်ပါတယ်:

```ts
// ./foo.cts
export function helper() {
    console.log("hello world!");
}

// ./bar.mts
import foo = require("./foo.cjs");

foo.helper()
```

နောက်ဆုံးအနေနဲ့ — CJS module တစ်ခုကနေ ESM files တွေကို import လုပ်ဖို့ တစ်ခုတည်းသော နည်းလမ်းက dynamic `import()` calls တွေ သုံးတာပဲ ဆိုတာ သတိပြုဖို့ ထိုက်ပါတယ်။ ဒါက စိန်ခေါ်မှုတွေ ဖြစ်စေနိုင်ပေမယ့် — ဒါက ယနေ့ Node.js ရဲ့ အပြုအမူပါ။

ESM/CommonJS interop အကြောင်း [Node.js မှာ ဒီမှာ ဆက်ဖတ်နိုင်ပါတယ်](https://nodejs.org/api/esm.html#esm_interoperability_with_commonjs)။

### `package.json` Exports, Imports, and Self-Referencing (`package.json` ၏ Exports ၊ Imports နှင့် Self-Referencing)

Node.js က `package.json` ထဲမှာ entry points တွေ သတ်မှတ်ဖို့ `"exports"` လို့ခေါ်တဲ့ [field အသစ်တစ်ခုကို ပံ့ပိုးပါတယ်](https://nodejs.org/api/packages.html#packages_exports)။ ဒီ field က `package.json` ထဲမှာ `"main"` သတ်မှတ်ခြင်းထက် ပိုအစွမ်းထက်တဲ့ အခြားရွေးချယ်စရာတစ်ခု ဖြစ်ပြီး — သင့် package ရဲ့ ဘယ်အပိုင်းတွေကို consumers တွေဆီ ထုတ်ဖော်ပြသမလဲဆိုတာကို ထိန်းချုပ်နိုင်ပါတယ်။

CommonJS နဲ့ ESM အတွက် entry-point သီးခြားစီ ပံ့ပိုးပေးတဲ့ `package.json` တစ်ခု ဒီမှာ ရှိပါတယ်:

```jsonc
// package.json
{
    "name": "my-package",
    "type": "module",
    "exports": {
        ".": {
            // Entry-point for `import "my-package"` in ESM
            "import": "./esm/index.js",

            // Entry-point for `require("my-package") in CJS
            "require": "./commonjs/index.cjs",
        },
    },

    // CJS fall-back for older versions of Node.js
    "main": "./commonjs/index.cjs",
}
```

ဒီ feature မှာ ပါဝင်စရာ အကြောင်းအရာ အများကြီး ရှိပြီး — [Node.js documentation ပေါ်မှာ ဒီအကြောင်း ပိုပြီး ဖတ်နိုင်ပါတယ်](https://nodejs.org/api/packages.html)။ ဒီမှာတော့ — TypeScript က ဒါကို ဘယ်လို ပံ့ပိုးလဲဆိုတာကိုပဲ အဓိက အာရုံစိုက်သွားပါမယ်။

TypeScript ရဲ့ မူလ Node ပံ့ပိုးမှုနဲ့ဆိုရင် — ၎င်းက `"main"` field တစ်ခုကို ရှာပြီး — အဲဒီ entry point နဲ့ ကိုက်ညီတဲ့ declaration files တွေကို ရှာဖွေပါတယ်။ ဥပမာ — `"main"` က `./lib/index.js` ကို ညွှန်ပြနေရင် — TypeScript က `./lib/index.d.ts` လို့ခေါ်တဲ့ file တစ်ခုကို ရှာဖွေပါလိမ့်မယ်။ Package author တစ်ယောက်က `"types"` လို့ခေါ်တဲ့ သီးခြား field တစ်ခု သတ်မှတ်ခြင်းအားဖြင့် (ဥပမာ `"types": "./types/index.d.ts"`) ဒါကို override လုပ်နိုင်ပါတယ်။

ပံ့ပိုးမှု အသစ်ကတော့ [import conditions](https://nodejs.org/api/packages.html) တွေနဲ့ အလားတူ နည်းလမ်းအတိုင်း အလုပ်လုပ်ပါတယ်။ Default အားဖြင့် — TypeScript က import conditions တွေနဲ့ စည်းမျဉ်းတွေကို ထပ်ဆင့်ပေါင်းစပ်ပါတယ် — ES module တစ်ခုကနေ `import` တစ်ခု ရေးရင် `import` field ကို ကြည့်ပြီး — CommonJS module တစ်ခုကနေဆိုရင် `require` field ကို ကြည့်ပါတယ်။ ဒါတွေကို တွေ့ရှိရင် — သက်ဆိုင်တဲ့ declaration file တစ်ခုကို ရှာဖွေပါလိမ့်မယ်။ သင့် type declarations တွေအတွက် မတူညီတဲ့ တည်နေရာတစ်ခုကို ညွှန်ပြဖို့ လိုအပ်ရင် — `"types"` import condition တစ်ခု ထည့်နိုင်ပါတယ်။

```jsonc
// package.json
{
    "name": "my-package",
    "type": "module",
    "exports": {
        ".": {
            // Entry-point for `import "my-package"` in ESM
            "import": {
                // Where TypeScript will look.
                "types": "./types/esm/index.d.ts",

                // Where Node.js will look.
                "default": "./esm/index.js"
            },
            // Entry-point for `require("my-package") in CJS
            "require": {
                // Where TypeScript will look.
                "types": "./types/commonjs/index.d.cts",

                // Where Node.js will look.
                "default": "./commonjs/index.cjs"
            },
        }
    },

    // Fall-back for older versions of TypeScript
    "types": "./types/index.d.ts",

    // CJS fall-back for older versions of Node.js
    "main": "./commonjs/index.cjs"
}
```

> `"exports"` ထဲမှာ `"types"` condition က အမြဲတမ်း ပထမဆုံး နေရာမှာ ရှိသင့်ပါတယ်။

CommonJS entrypoint ရော ES module entrypoint ရောက — contents တွေ တစ်ခုနဲ့တစ်ခု တူညီနေရင်တောင် — declaration file တစ်ခုစီ သီးခြား လိုအပ်တယ်ဆိုတာ သတိပြုဖို့ အရေးကြီးပါတယ်။ Declaration file တိုင်းကို — ၎င်းရဲ့ file extension နဲ့ `package.json` ရဲ့ `"type"` field အပေါ် အခြေခံပြီး — CommonJS module ဒါမှမဟုတ် ES module အဖြစ် အဓိပ္ပာယ်ဖွင့်ဆိုပြီး — type checking မှန်ကန်ဖို့ဆိုရင် ဒီလို ထောက်လှမ်းတွေ့ရှိတဲ့ module kind က Node က သက်ဆိုင်ရာ JavaScript file အတွက် ထောက်လှမ်းမယ့် module kind နဲ့ ကိုက်ညီရပါမယ်။ ES module entrypoint ရော CommonJS entrypoint ရောကို type လုပ်ဖို့ `.d.ts` file တစ်ခုတည်းကို သုံးဖို့ ကြိုးစားရင် — TypeScript က entrypoints တွေထဲက တစ်ခုပဲ ရှိတယ်လို့ ထင်မှာ ဖြစ်လို့ — package ရဲ့ users တွေအတွက် compiler errors တွေ ဖြစ်စေပါလိမ့်မယ်။

TypeScript က `package.json` ရဲ့ [`"imports"` field](https://nodejs.org/api/packages.html#packages_imports) ကိုလည်း — သက်ဆိုင်ရာ files တွေဘေးမှာ declaration files တွေ ရှာဖွေခြင်းအားဖြင့် — အလားတူ နည်းလမ်းနဲ့ ပံ့ပိုးပြီး — [packages တွေ ကိုယ့်ကိုယ်ကို self-reference လုပ်တာ](https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name) ကိုလည်း ပံ့ပိုးပါတယ်။ ဒီ features တွေက ယေဘုယျအားဖြင့် configure လုပ်ဖို့ သိပ်မရှုပ်ထွေးပေမယ့် — ပံ့ပိုးထားပါတယ်။

### Your Feedback Wanted! (သင့် Feedback ကို လိုလားပါသည်!)

ကျွန်တော်တို့ TypeScript 4.7 ကို ဆက်လက် လုပ်ဆောင်နေတုန်းမှာ — ဒီလုပ်ဆောင်ချက်အတွက် documentation နဲ့ polish တွေ ပိုပြီး ထည့်သွင်းလာဖို့ မျှော်လင့်ပါတယ်။ ဒီ features အသစ်တွေကို ပံ့ပိုးတာက ရည်မှန်းချက်ကြီးတဲ့ လုပ်ငန်းစဉ်တစ်ခု ဖြစ်ခဲ့ပြီး — အဲဒါကြောင့်ပဲ စောစောပိုင်း feedback တွေကို ရှာဖွေနေတာ ဖြစ်ပါတယ်! ဒါတွေကို စမ်းသုံးကြည့်ပြီး — သင့်အတွက် ဘယ်လို အလုပ်လုပ်လဲဆိုတာ ပြောပြပေးပါ။

နောက်ထပ် အချက်အလက်တွေအတွက် — [implementing PR ကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/44501)။

## Control over Module Detection (Module Detection အပေါ် ထိန်းချုပ်ခြင်း)

JavaScript ဆီ modules တွေ မိတ်ဆက်ခဲ့စဉ်က ပြဿနာတစ်ခုကတော့ — ရှိပြီးသား "script" code တွေနဲ့ module code အသစ်တွေကြားက မရေရာမှု (ambiguity) ပါ။ Module တစ်ခုထဲက JavaScript code က နည်းနည်း ကွဲပြားစွာ run ပြီး — scoping rules တွေလည်း ကွဲပြားတာမို့ — file တစ်ခုချင်းစီကို ဘယ်လို run မလဲဆိုတာနဲ့ ပတ်သက်ပြီး tools တွေက ဆုံးဖြတ်ချက်တွေ ချရပါတယ်။ ဥပမာ — Node.js က module entry-points တွေကို `.mjs` နဲ့ ရေးရဖို့ ဒါမှမဟုတ် အနီးမှာ `"type": "module"` ပါတဲ့ `package.json` ရှိဖို့ လိုအပ်ပါတယ်။ TypeScript ကတော့ file တစ်ခုထဲမှာ `import` ဒါမှမဟုတ် `export` statement တစ်ခုခု တွေ့တိုင်း အဲဒီ file ကို module အဖြစ် သတ်မှတ်ပြီး — မတွေ့ရင် `.ts` ဒါမှမဟုတ် `.js` file ကို global scope ပေါ်မှာ လုပ်ဆောင်တဲ့ script file တစ်ခုလို့ ယူဆပါတယ်။

ဒါက Node.js ရဲ့ အပြုအမူနဲ့ သိပ် မကိုက်ညီပါဘူး — Node.js မှာ `package.json` က file တစ်ခုရဲ့ format ကို ပြောင်းလဲနိုင်ပြီး — `--jsx` setting ရဲ့ `react-jsx` မှာဆိုရင် JSX file တိုင်းမှာ JSX factory တစ်ခုဆီ implicit import ပါဝင်နေလို့ပါ။ ခေတ်မီ မျှော်လင့်ချက်တွေနဲ့လည်း မကိုက်ညီပါဘူး — အခုခေတ်မှာ TypeScript code အသစ်အများစုကို modules တွေကို ရည်ရွယ်ပြီး ရေးသားကြတာမို့ပါ။

အဲဒါကြောင့်ပဲ TypeScript 4.7 က `moduleDetection` လို့ခေါ်တဲ့ option အသစ်တစ်ခုကို မိတ်ဆက်ပေးပါတယ်။ `moduleDetection` က တန်ဖိုး ၃ မျိုး ယူနိုင်ပါတယ်: `"auto"` (default) ၊ `"legacy"` (4.6 နဲ့ အစောပိုင်း versions တွေရဲ့ အပြုအမူအတိုင်း) နဲ့ `"force"`။

`"auto"` mode အောက်မှာ — TypeScript က `import` နဲ့ `export` statements တွေကိုပဲ ရှာတာ မဟုတ်ဘဲ — အောက်ပါတို့ကိုပါ စစ်ဆေးပါတယ်:

* `--module nodenext`/`--module node16` အောက်မှာ run နေတဲ့အခါ `package.json` ထဲက `"type"` field က `"module"` ဖြစ်မဖြစ် ၊ ပြီးတော့
* `--jsx react-jsx` အောက်မှာ run နေတဲ့အခါ လက်ရှိ file က JSX file တစ်ခု ဟုတ်မဟုတ်

File တိုင်းကို module အဖြစ် သတ်မှတ်စေချင်တဲ့ အခြေအနေတွေမှာ — `"force"` setting က non-declaration file တိုင်းကို module အဖြစ် သတ်မှတ်စေပါတယ်။ ဒါက `module` ၊ `moduleResolution` နဲ့ `jsx` တို့ကို ဘယ်လိုပဲ configure လုပ်ထားလုပ်ထား — အမြဲတမ်း သက်ရောက်ပါတယ်။

တစ်ချိန်တည်းမှာပဲ — `"legacy"` option က file တစ်ခုက module ဟုတ်မဟုတ် ဆုံးဖြတ်ဖို့ `import` နဲ့ `export` statements တွေကိုပဲ ရှာဖွေတဲ့ အပြုအမူအဟောင်းဆီ ရိုးရှင်းစွာ ပြန်သွားပါတယ်။

ဒီပြောင်းလဲမှုအကြောင်း [pull request ပေါ်မှာ ဆက်ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/47495)။

## Control-Flow Analysis for Bracketed Element Access (Bracket ကာရံထားသော Element Access များအတွက် Control-Flow Analysis)

TypeScript 4.7 က indexed keys တွေ literal types ဒါမှမဟုတ် unique symbols တွေ ဖြစ်နေတဲ့အခါ — element accesses တွေရဲ့ types တွေကို narrow လုပ်ပါတယ်။ ဥပမာ — အောက်ပါ code ကို ကြည့်ပါ:

```ts
const key = Symbol();

const numberOrString = Math.random() < 0.5 ? 42 : "hello";

const obj = {
    [key]: numberOrString,
};

if (typeof obj[key] === "string") {
    let str = obj[key].toUpperCase();
}
```

အရင်က — TypeScript က `obj[key]` ပေါ်မှာ type guards တစ်ခုမှ ထည့်သွင်း စဉ်းစားမပေးခဲ့ဘဲ — `obj[key]` က တကယ့်ကို `string` ဆိုတာ လုံးဝ မသိနိုင်ခဲ့ပါဘူး။ အဲဒီအစား — `obj[key]` က `string | number` ပဲ ဖြစ်နေသေးတယ်လို့ ထင်ပြီး — `toUpperCase()` ကို ခေါ်တာက error ဖြစ်စေပါလိမ့်မယ်။

TypeScript 4.7 က အခုဆိုရင် `obj[key]` က string တစ်ခုဆိုတာ သိပါတယ်။

ဒါက — `--strictPropertyInitialization` အောက်မှာ — computed properties တွေကို constructor body ရဲ့ အဆုံးမှာ initialize လုပ်ပြီးသား ဖြစ်မဖြစ် TypeScript က မှန်မှန်ကန်ကန် စစ်ဆေးနိုင်တယ်လို့လည်း ဆိုလိုပါတယ်။

```ts
// 'key' has type 'unique symbol'
const key = Symbol();

class C {
    [key]: string;

    constructor(str: string) {
        // oops, forgot to set 'this[key]'
    }

    screamString() {
        return this[key].toUpperCase();
    }
}
```

TypeScript 4.7 အောက်မှာ — `--strictPropertyInitialization` က `[key]` property ကို constructor ရဲ့ အဆုံးမှာ သေချာပေါက် assign လုပ်ပြီးသား မဟုတ်ဘူးလို့ ပြောတဲ့ error တစ်ခု အစီရင်ခံပါတယ်။

ဒီပြောင်းလဲမှုကို ပံ့ပိုးပေးခဲ့တဲ့ [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ကို ကျွန်တော်တို့ ကျေးဇူးတင်ကြောင်း ဖော်ပြချင်ပါတယ် — [ဒီပြောင်းလဲမှုကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/45974)!

## Improved Function Inference in Objects and Methods (Objects နှင့် Methods များတွင် Function Inference ပိုမိုကောင်းမွန်လာခြင်း)

TypeScript 4.7 က အခုဆိုရင် objects နဲ့ arrays တွေအတွင်းက functions တွေကနေ ပိုပြီး granular (အသေးစိတ်ကျတဲ့) inferences တွေကို လုပ်ဆောင်နိုင်ပါပြီ။ ဒါက ဒီ functions တွေရဲ့ types တွေကို — သာမန် arguments တွေလိုပဲ — ဘယ်ကနေ ညာ ဦးတည်ချက်အတိုင်း တသမတ်တည်း စီးဆင်းစေပါတယ်။

```ts
declare function f<T>(arg: {
    produce: (n: string) => T,
    consume: (x: T) => void }
): void;

// Works
f({
    produce: () => "hello",
    consume: x => x.toLowerCase()
});

// Works
f({
    produce: (n: string) => n,
    consume: x => x.toLowerCase(),
});

// Was an error, now works.
f({
    produce: n => n,
    consume: x => x.toLowerCase(),
});

// Was an error, now works.
f({
    produce: function () { return "hello"; },
    consume: x => x.toLowerCase(),
});

// Was an error, now works.
f({
    produce() { return "hello" },
    consume: x => x.toLowerCase(),
});
```

ဒီဥပမာတွေထဲက တချို့မှာ inference မအောင်မြင်ခဲ့တာက — သူတို့ရဲ့ `produce` functions တွေရဲ့ type ကို သိရှိခြင်းက — `T` အတွက် type ကောင်းတစ်ခု မရှာတွေ့ခင်မှာပဲ — `arg` ရဲ့ type ကို သွယ်ဝိုက်၍ တောင်းဆိုနေလို့ပါ။ TypeScript က အခုဆိုရင် `T` ရဲ့ inferred type ဆီ ပံ့ပိုးပေးနိုင်တဲ့ functions တွေကို စုစည်းပြီး — အဲဒီကနေ lazily (လိုအပ်မှသာ) infer လုပ်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [ကျွန်တော်တို့ရဲ့ inference process ဆီ ပြုလုပ်ထားတဲ့ တိကျတဲ့ ပြုပြင်မွမ်းမံမှုတွေကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/48538)။

## Instantiation Expressions (Instantiation Expression များ)

ရံဖန်ရံခါ — functions တွေက ကျွန်တော်တို့ လိုချင်တာထက် ပိုပြီး ယေဘုယျကျ (general) နေတတ်ပါတယ်။ ဥပမာ — `makeBox` function တစ်ခု ရှိတယ်ဆိုပါစို့။

```ts
interface Box<T> {
    value: T;
}

function makeBox<T>(value: T) {
    return { value };
}
```

`Wrench` တွေနဲ့ `Hammer` တွေရဲ့ `Box` တွေ ဖန်တီးဖို့ ပိုပြီး အထူးပြုထားတဲ့ (specialized) functions အစုတစ်ခု ဖန်တီးချင်တာ ဖြစ်နိုင်ပါတယ်။ အဲဒါကို ယနေ့ လုပ်ဖို့ဆိုရင် — `makeBox` ကို တခြား functions တွေထဲမှာ wrap လုပ်ရပါမယ် — ဒါမှမဟုတ် `makeBox` ရဲ့ alias တစ်ခုအတွက် explicit type တစ်ခု သုံးရပါတယ်။

```ts
function makeHammerBox(hammer: Hammer) {
    return makeBox(hammer);
}

// or...

const makeWrenchBox: (wrench: Wrench) => Box<Wrench> = makeBox;
```

ဒါတွေက အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် `makeBox` call တစ်ခုကို wrap လုပ်တာက နည်းနည်း အလဟသ ဖြစ်ပြီး — `makeWrenchBox` ရဲ့ signature အပြည့်အစုံ ရေးတာကလည်း မသင့်တော်လောက်အောင် ကြီးထွားသွားနိုင်ပါတယ်။ အကောင်းဆုံးကတော့ — signature ထဲက generics တွေ အားလုံးကို အစားထိုးလိုက်ရင်း — `makeBox` ကို alias လုပ်ချင်တယ်လို့ပဲ ပြောနိုင်စေချင်ပါတယ်။

TypeScript 4.7 က အဲဒါကို အတိအကျ ခွင့်ပြုပါတယ်! အခုဆိုရင် functions တွေနဲ့ constructors တွေကို ယူပြီး type arguments တွေကို တိုက်ရိုက် ကျွေးနိုင်ပါပြီ။

```ts
const makeHammerBox = makeBox<Hammer>;
const makeWrenchBox = makeBox<Wrench>;
```

ဒါဆိုရင် — ဒါနဲ့အတူ `makeBox` ကို ပိုတိကျတဲ့ types တွေ လက်ခံပြီး — တခြားအရာတွေကို ငြင်းပယ်ဖို့ specialize လုပ်နိုင်ပါတယ်။

```ts
const makeStringBox = makeBox<string>;

// TypeScript correctly rejects this.
makeStringBox(42);
```

ဒီ logic က `Array` ၊ `Map` နဲ့ `Set` လိုမျိုး constructor functions တွေမှာလည်း အလုပ်လုပ်ပါတယ်။

```ts
// Has type `new () => Map<string, Error>`
const ErrorMap = Map<string, Error>;

// Has type `// Map<string, Error>`
const errorMap = new ErrorMap();
```

Function ဒါမှမဟုတ် constructor တစ်ခုကို type arguments တွေ ပေးလိုက်တဲ့အခါ — compatible ဖြစ်တဲ့ type parameter lists တွေပါတဲ့ signatures အားလုံးကို ထိန်းသိမ်းပြီး — သက်ဆိုင်တဲ့ type parameters တွေကို ပေးလိုက်တဲ့ type arguments တွေနဲ့ အစားထိုးတဲ့ type အသစ်တစ်ခု ထုတ်ပေးပါတယ်။ ကျန်တဲ့ signatures တွေကတော့ ဖျက်ပစ်ခံရပါတယ် — TypeScript က အဲဒါတွေကို သုံးဖို့ ရည်ရွယ်ထားတာ မဟုတ်ဘူးလို့ ယူဆလို့ပါ။

ဒီ feature အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် — [pull request ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/47607)။

## `extends` Constraints on `infer` Type Variables (`infer` Type Variables များအပေါ် `extends` Constraints)

Conditional types တွေက power-user feature မျိုး ဖြစ်ပါတယ်။ ဒါတွေက types တွေရဲ့ ပုံသဏ္ဍာန်ကို match လုပ်ပြီး infer လုပ်နိုင်စေကာ — အဲဒါတွေအပေါ် အခြေခံပြီး ဆုံးဖြတ်ချက်တွေ ချနိုင်စေပါတယ်။ ဥပမာ — tuple type တစ်ခုရဲ့ ပထမဆုံး element က `string`-လိုမျိုး type တစ်ခုဆိုရင် အဲဒီ element ကို ပြန်ပေးတဲ့ conditional type တစ်ခုကို ရေးနိုင်ပါတယ်။

```ts
type FirstIfString<T> =
    T extends [infer S, ...unknown[]]
        ? S extends string ? S : never
        : never;

 // string
type A = FirstIfString<[string, number, number]>;

// "hello"
type B = FirstIfString<["hello", number, number]>;

// "hello" | "world"
type C = FirstIfString<["hello" | "world", boolean]>;

// never
type D = FirstIfString<[boolean, number, string]>;
```

`FirstIfString` က အနည်းဆုံး element တစ်ခု ပါတဲ့ tuple တိုင်းကို match လုပ်ပြီး — ပထမဆုံး element ရဲ့ type ကို `S` အဖြစ် ဖမ်းယူပါတယ်။ ပြီးတော့ `S` က `string` နဲ့ compatible ဖြစ်မဖြစ် စစ်ပြီး — ဖြစ်ရင် အဲဒီ type ကို ပြန်ပေးပါတယ်။

ဒါကို ရေးဖို့ conditional types နှစ်ခု သုံးခဲ့ရတာ သတိပြုပါ။ `FirstIfString` ကို အောက်ပါအတိုင်းလည်း ရေးနိုင်ခဲ့ပါတယ်:

```ts
type FirstIfString<T> =
    T extends [string, ...unknown[]]
        // Grab the first type out of `T`
        ? T[0]
        : never;
```

ဒါက အလုပ်လုပ်ပေမယ့် — နည်းနည်း "manual" ဆန်ပြီး — declarative (ကြေညာဆန်သော) မှု နည်းပါတယ်။ Type ပေါ်မှာ pattern-matching လုပ်ပြီး ပထမ element ကို နာမည်တစ်ခု ပေးလိုက်ရုံမက — `T[0]` နဲ့ `T` ရဲ့ `0`th element ကို ဆွဲထုတ်ရပါသေးတယ်။ Tuples တွေထက် ပိုရှုပ်ထွေးတဲ့ types တွေနဲ့ ဆက်ဆံနေရရင် — ဒါက ပိုပြီး လှည့်ကွက်ဆန်လာနိုင်လို့ — `infer` က အရာတွေကို ရိုးရှင်းစေနိုင်ပါတယ်။

Type တစ်ခုကို infer လုပ်ပြီး — အဲဒီ inferred type နဲ့ ထပ်ပြီး match လုပ်ဖို့ nested conditionals တွေ သုံးတာက အတော်လေး အသုံးများပါတယ်။ ဒုတိယအဆင့် nesting တွေကို ရှောင်ဖို့ — TypeScript 4.7 က အခုဆိုရင် ဘယ် `infer` type ပေါ်မဆို constraint တစ်ခု နေရာချခွင့် ပြုပါတယ်။

```ts
type FirstIfString<T> =
    T extends [infer S extends string, ...unknown[]]
        ? S
        : never;
```

ဒီနည်းနဲ့ — TypeScript က `S` ကို match လုပ်တဲ့အခါ — `S` က `string` ဖြစ်ရမယ်ဆိုတာကိုလည်း သေချာ စစ်ဆေးပေးပါတယ်။ `S` က `string` မဟုတ်ဘူးဆိုရင် — false path ကို ယူပြီး — ဒီကိစ္စတွေမှာ `never` ဖြစ်ပါတယ်။

အသေးစိတ် အချက်အလက်တွေအတွက် — [GitHub ပေါ်က ပြောင်းလဲမှုအကြောင်း ဒီမှာ ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/48112)။

## Optional Variance Annotations for Type Parameters (Type Parameters များအတွက် Optional Variance Annotations)

အောက်ပါ types တွေကို ကြည့်ကြရအောင်။

```ts
interface Animal {
    animalStuff: any;
}

interface Dog extends Animal {
    dogStuff: any;
}

// ...

type Getter<T> = () => T;

type Setter<T> = (value: T) => void;
```

`Getter` တွေရဲ့ instance မတူညီတဲ့ နှစ်ခု ရှိတယ်လို့ စိတ်ကူးကြည့်ပါ။ `Getter` မတူညီတဲ့ နှစ်ခု အပြန်အလှန် အစားထိုး (substitutable) ဖြစ်မဖြစ် ဆုံးဖြတ်တာက `T` ပေါ်မှာပဲ လုံးဝ မူတည်ပါတယ်။ `Getter<Dog>` → `Getter<Animal>` assignment တစ်ခု တရားဝင်မဝင် ဆိုတဲ့ ကိစ္စမှာ — `Dog` → `Animal` တရားဝင်မဝင် စစ်ဆေးရပါတယ်။ `T` အတွက် type တစ်ခုချင်းစီက တူညီတဲ့ "ဦးတည်ချက်" တစ်ခုတည်းနဲ့ပဲ ဆက်စပ်နေလို့ — `Getter` type က `T` ပေါ်မှာ *covariant* ဖြစ်တယ်လို့ ပြောပါတယ်။ အခြားတစ်ဖက်မှာ — `Setter<Dog>` → `Setter<Animal>` တရားဝင်မဝင် စစ်ဆေးတာက `Animal` → `Dog` တရားဝင်မဝင် စစ်ဆေးတာနဲ့ ပတ်သက်နေပါတယ်။ ဒီလို ဦးတည်ချက် "ပြောင်းပြန်လှန်ခြင်း" က — သင်္ချာမှာ −*x* < *−y* ဆိုတာ *y* < *x* နဲ့ အတူတူပဲဆိုတဲ့ စစ်ဆေးခြင်းမျိုးနဲ့ တူပါတယ်။ `T` တွေကို နှိုင်းယှဉ်ဖို့ ဒီလို ဦးတည်ချက် ပြောင်းပြန်လှန်ရတဲ့အခါ — `Setter` က `T` ပေါ်မှာ *contravariant* ဖြစ်တယ်လို့ ပြောပါတယ်။

TypeScript 4.7 နဲ့အတူ — အခုဆိုရင် type parameters တွေပေါ်မှာ variance ကို *အတိအကျ* (explicitly) သတ်မှတ်နိုင်ပါပြီ။

ဒါဆိုရင် — `Getter` က `T` ပေါ်မှာ covariant ဖြစ်တာကို ရှင်းရှင်းလင်းလင်း ဖြစ်စေချင်တယ်ဆိုရင် — `out` modifier ကို ပေးနိုင်ပါပြီ။

```ts
type Getter<out T> = () => T;
```

အလားတူပဲ — `Setter` က `T` ပေါ်မှာ contravariant ဖြစ်တာကို ရှင်းရှင်းလင်းလင်း ဖြစ်စေချင်ရင်လည်း — `in` modifier ကို ပေးနိုင်ပါတယ်။

```ts
type Setter<in T> = (value: T) => void;
```

`out` နဲ့ `in` တို့ကို ဒီမှာ သုံးတာက — type parameter တစ်ခုရဲ့ variance က ၎င်းကို *output* ဒါမှမဟုတ် *input* အနေနဲ့ သုံးထားလားဆိုတာပေါ် မူတည်လို့ပါ။ Variance အကြောင်း စဉ်းစားမယ့်အစား — `T` ကို output နဲ့ input positions တွေမှာ သုံးထားလားဆိုတာကိုပဲ စဉ်းစားလို့ ရပါတယ်။

`in` ရော `out` ရော နှစ်ခုလုံး သုံးရတဲ့ အခြေအနေတွေလည်း ရှိပါတယ်။

```ts
interface State<in out T> {
    get: () => T;
    set: (value: T) => void;
}
```

`T` တစ်ခုကို output ရော input ရော position နှစ်ခုလုံးမှာ သုံးတဲ့အခါ — *invariant* ဖြစ်လာပါတယ်။ `State<T>` မတူညီတဲ့ နှစ်ခုက — သူတို့ရဲ့ `T` တွေ တူညီနေမှသာ အပြန်အလှန် အစားထိုးလို့ ရပါတယ်။ တစ်နည်းပြောရရင် — `State<Dog>` နဲ့ `State<Animal>` တို့က တစ်ခုကိုတစ်ခု အစားထိုးလို့ မရပါဘူး။

အခု နည်းပညာအရ ပြောရရင် — purely structural type system တစ်ခုထဲမှာ — type parameters တွေနဲ့ သူတို့ရဲ့ variance တွေက တကယ်တော့ အရေးမကြီးပါဘူး — type parameter တစ်ခုစီရဲ့ နေရာမှာ types တွေ ထည့်သွင်းပြီး — member တစ်ခုချင်းစီက structural အရ compatible ဖြစ်မဖြစ် စစ်ဆေးလိုက်ရုံပဲ ဆိုတော့ပါ။ ဒါဆိုရင် TypeScript က structural type system ကို သုံးတယ်ဆိုရင် — type parameters တွေရဲ့ variance တွေကို ဘာလို့ စိတ်ဝင်စားရတာလဲ? ပြီးတော့ ဘာကြောင့် သူတို့ကို annotate လုပ်ချင်ရတာလဲ?

အကြောင်းရင်း တစ်ခုကတော့ — type parameter တစ်ခုကို ဘယ်လို သုံးထားလဲဆိုတာ စာဖတ်သူတစ်ယောက်က တစ်ချက်ကြည့်ရင်းနဲ့ ရှင်းရှင်းလင်းလင်း မြင်နိုင်ဖို့ အသုံးဝင်လို့ပါ။ အများကြီး ပိုရှုပ်ထွေးတဲ့ types တွေမှာ — type တစ်ခုကို ဖတ်ဖို့လား ၊ ရေးဖို့လား ၊ ဒါမှမဟုတ် နှစ်ခုလုံးအတွက်လားဆိုတာ ခွဲခြားပြောဖို့ ခက်ခဲတတ်ပါတယ်။ ဒီ type parameter ကို ဘယ်လို သုံးထားလဲဆိုတာ ဖော်ပြဖို့ မေ့သွားရင်လည်း — TypeScript က ကူညီပေးပါလိမ့်မယ်။ ဥပမာ — `State` ပေါ်မှာ `in` ရော `out` ရော နှစ်ခုလုံး သတ်မှတ်ဖို့ မေ့သွားရင် — error တစ်ခု ရပါလိမ့်မယ်။

```ts
interface State<out T> {
    //          ~~~~~
    // error!
    // Type 'State<sub-T>' is not assignable to type 'State<super-T>' as implied by variance annotation.
    //   Types of property 'set' are incompatible.
    //     Type '(value: sub-T) => void' is not assignable to type '(value: super-T) => void'.
    //       Types of parameters 'value' and 'value' are incompatible.
    //         Type 'super-T' is not assignable to type 'sub-T'.
    get: () => T;
    set: (value: T) => void;
}
```

နောက်ထပ် အကြောင်းရင်းတစ်ခုကတော့ တိကျမှုနဲ့ မြန်နှုန်းပါ! TypeScript က type parameters တွေရဲ့ variance ကို optimization တစ်ခုအနေနဲ့ ခန့်မှန်း (infer) လုပ်ဖို့ ကြိုးစားနှင့်ပြီးသားပါ။ ဒါကိုလုပ်ခြင်းအားဖြင့် — ပိုကြီးတဲ့ structural types တွေကို ကျိုးကြောင်းဆီလျော်တဲ့ အချိန်အတွင်း type-check လုပ်နိုင်ပါတယ်။ Variance တွေကို ကြိုတင် တွက်ချက်ထားခြင်းက type-checker ကို ပိုနက်ရှိုင်းတဲ့ နှိုင်းယှဉ်မှုတွေ ကျော်လိုက်ပြီး — type arguments တွေကိုပဲ နှိုင်းယှဉ်စေပါတယ် — ဒါက type တစ်ခုရဲ့ structure အပြည့်အစုံကို ထပ်ခါတလဲလဲ နှိုင်းယှဉ်နေတာထက် *အများကြီး* ပိုမြန်နိုင်ပါတယ်။ ဒါပေမယ့် — ဒီတွက်ချက်မှုက အတော်လေး စရိတ်ကြီးနေသေးတဲ့ အခြေအနေတွေ မကြာခဏ ရှိပြီး — တွက်ချက်မှုက တိကျစွာ ဖြေရှင်းလို့မရတဲ့ circularities (သံသရာလည်နေမှုများ) တွေကို တွေ့ရှိနိုင်ပါတယ် — ဆိုလိုတာက type တစ်ခုရဲ့ variance အတွက် ရှင်းလင်းတဲ့ အဖြေ မရှိတာမျိုးပါ။

```ts
type Foo<T> = {
    x: T;
    f: Bar<T>;
}

type Bar<U> = (x: Baz<U[]>) => void;

type Baz<V> = {
    value: Foo<V[]>;
}

declare let foo1: Foo<unknown>;
declare let foo2: Foo<string>;

foo1 = foo2;  // Should be an error but isn't ❌
foo2 = foo1;  // Error - correct ✅
```

Explicit annotation တစ်ခု ပေးခြင်းက ဒီလို circularities တွေမှာ type-checking ကို မြန်ဆန်စေပြီး — တိကျမှု ပိုကောင်းစေနိုင်ပါတယ်။ ဥပမာ — အပေါ်က ဥပမာထဲမှာ `T` ကို invariant အဖြစ် မှတ်သားခြင်းက ပြဿနာရှိတဲ့ assignment ကို ရပ်တန့်စေနိုင်ပါတယ်။

```diff
- type Foo<T> = {
+ type Foo<in out T> = {
      x: T;
      f: Bar<T>;
  }
```

Type parameter တိုင်းကို သူ့ရဲ့ variance နဲ့အတူ annotate လုပ်ဖို့တော့ အမြဲတမ်း အကြံပြုတာ မဟုတ်ပါဘူး; ဥပမာ — variance ကို လိုအပ်တာထက် နည်းနည်း ပိုတင်းကျပ်အောင် လုပ်တာ ဖြစ်နိုင်ပေမယ့် (အကြံပြုလို့တော့ မရပါဘူး) — TypeScript က တကယ်တော့ covariant ၊ contravariant ဒါမှမဟုတ် independent ဖြစ်နေတဲ့အရာတစ်ခုကို invariant အဖြစ် မှတ်သားတာကို တားဆီးမှာ မဟုတ်ပါဘူး။ ဒါကြောင့် explicit variance markers တွေ ထည့်ဖို့ ရွေးချယ်ရင် — တွေးတောဆင်ခြင်ပြီး တိကျသေချာတဲ့ အသုံးပြုမှုမျိုး ဖြစ်စေချင်ပါတယ်။

ဒါပေမယ့် — deep recursion ရှိတဲ့ types တွေနဲ့ အလုပ်လုပ်နေတယ်ဆိုရင် — အထူးသဖြင့် library author တစ်ယောက်ဆိုရင် — ဒီ annotations တွေက သင့် users တွေအတွက် အကျိုးရှိအောင် သုံးဖို့ စိတ်ဝင်စားစရာ ဖြစ်နိုင်ပါတယ်။ ဒီ annotations တွေက တိကျမှုရော type-checking မြန်နှုန်းရောမှာ အကျိုးအမြတ် နှစ်မျိုးလုံး ပေးနိုင်ပြီး — ဒါတွေက သူတို့ရဲ့ code editing အတွေ့အကြုံကိုတောင် သက်ရောက်နိုင်ပါတယ်။ Variance တွက်ချက်မှုက type-checking အချိန်ရဲ့ bottleneck ဟုတ်မဟုတ် ဆုံးဖြတ်တာကို စမ်းသပ်မှုတွေနဲ့ လုပ်နိုင်ပြီး — ကျွန်တော်တို့ရဲ့ [analyze-trace](https://github.com/microsoft/typescript-analyze-trace) utility လိုမျိုး tooling တွေနဲ့ ဆုံးဖြတ်နိုင်ပါတယ်။

ဒီ feature အကြောင်း အသေးစိတ် အချက်အလက်တွေအတွက် — [pull request ပေါ်မှာ ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/48240)။

## Resolution Customization with `moduleSuffixes` (`moduleSuffixes` ဖြင့် Resolution စိတ်ကြိုက် ပြင်ဆင်ခြင်း)

TypeScript 4.7 က module specifiers တွေကို ဘယ်လို ရှာဖွေရမလဲ စိတ်ကြိုက် ပြင်ဆင်နိုင်ဖို့ `moduleSuffixes` option တစ်ခုကို အခု ပံ့ပိုးပါတယ်။

```jsonc
{
    "compilerOptions": {
        "moduleSuffixes": [".ios", ".native", ""]
    }
}
```

အပေါ်က configuration ပေးထားရင် — အောက်ပါလိုမျိုး import တစ်ခုက...

```ts
import * as foo from "./foo";
```

... ဆိုရင် relative files တွေဖြစ်တဲ့ `./foo.ios.ts` ၊ `./foo.native.ts` နဲ့ နောက်ဆုံး `./foo.ts` တို့ကို ကြည့်ပါလိမ့်မယ်။

> `moduleSuffixes` ထဲမှာ empty string `""` ပါဝင်တာက TypeScript က `./foo.ts` ကိုပါ ရှာဖွေနိုင်ဖို့ လိုအပ်ကြောင်း သတိပြုပါ။
> တစ်နည်းပြောရရင် — `moduleSuffixes` ရဲ့ default value က `[""]` ဖြစ်ပါတယ်။

ဒီ feature က target platform တစ်ခုချင်းစီအတွက် `moduleSuffixes` မတူညီတဲ့ `tsconfig.json` သီးခြားစီ သုံးနိုင်တဲ့ React Native projects တွေအတွက် အသုံးဝင်နိုင်ပါတယ်။

[`moduleSuffixes` option](https://github.com/microsoft/TypeScript/pull/48189) ကို [Adam Foxman](https://github.com/afoxman) ရဲ့ ပံ့ပိုးမှုကြောင့် ရရှိခဲ့တာပါ!

## resolution-mode (resolution-mode ကို အသုံးပြုခြင်း)

Node ရဲ့ ECMAScript resolution နဲ့ဆိုရင် — ပါဝင်တဲ့ file ရဲ့ mode နဲ့ သင်သုံးတဲ့ syntax က imports တွေကို ဘယ်လို resolve လုပ်မလဲဆိုတာ ဆုံးဖြတ်ပါတယ်; ဒါပေမယ့် — ECMAScript module တစ်ခုကနေ CommonJS module တစ်ခုရဲ့ types တွေကို ဒါမှမဟုတ် အပြန်အလှန် — reference လုပ်နိုင်ဖို့ဆိုရင် အသုံးဝင်ပါလိမ့်မယ်။

TypeScript က အခုဆိုရင် `/// <reference types="..." />` directives တွေကို ခွင့်ပြုပါတယ်။

```ts
/// <reference types="pkg" resolution-mode="require" />

// or

/// <reference types="pkg" resolution-mode="import" />
```

ဒါ့အပြင် — TypeScript ရဲ့ nightly versions တွေမှာ — `import type` က အလားတူ ရလဒ်ရဖို့ import assertion တစ်ခု သတ်မှတ်နိုင်ပါတယ်။

```ts
// Resolve `pkg` as if we were importing with a `require()`
import type { TypeFromRequire } from "pkg" assert {
    "resolution-mode": "require"
};

// Resolve `pkg` as if we were importing with an `import`
import type { TypeFromImport } from "pkg" assert {
    "resolution-mode": "import"
};

export interface MergedType extends TypeFromRequire, TypeFromImport {}
```

ဒီ import assertions တွေကို `import()` types တွေပေါ်မှာလည်း သုံးနိုင်ပါတယ်။

```ts
export type TypeFromRequire =
    import("pkg", { assert: { "resolution-mode": "require" } }).TypeFromRequire;

export type TypeFromImport =
    import("pkg", { assert: { "resolution-mode": "import" } }).TypeFromImport;

export interface MergedType extends TypeFromRequire, TypeFromImport {}
```

`import type` နဲ့ `import()` syntaxes တွေက `resolution-mode` ကို TypeScript ရဲ့ [nightly builds](/docs/typescript/nightly-builds) တွေမှာပဲ ပံ့ပိုးပါတယ်။ အောက်ပါလိုမျိုး error တစ်ခု သင်ရနိုင်ဖွယ် ရှိပါတယ်:

```
Resolution mode assertions are unstable. Use nightly TypeScript to silence this error. Try updating with 'npm install -D typescript@next'.
```

ဒီ feature ကို TypeScript ရဲ့ nightly versions တွေမှာ ကိုယ်တိုင် သုံးနေတယ်ဆိုရင် — [ဒီ issue ပေါ်မှာ feedback ပေးဖို့ စဉ်းစားပါ](https://github.com/microsoft/TypeScript/issues/49055)။

သက်ဆိုင်ရာ ပြောင်းလဲမှုတွေကို [reference directives တွေအတွက်](https://github.com/microsoft/TypeScript/pull/47732) နဲ့ [type import assertions တွေအတွက်](https://github.com/microsoft/TypeScript/pull/47807) မှာ ကြည့်နိုင်ပါတယ်။

## Go to Source Definition (Source Definition သို့ သွားရောက်ခြင်း)

TypeScript 4.7 မှာ *Go To Source Definition* လို့ခေါ်တဲ့ experimental editor command အသစ်တစ်ခုအတွက် ပံ့ပိုးမှု ပါဝင်ပါတယ်။ ဒါက *Go To Definition* နဲ့ ဆင်တူပေမယ့် — declaration files တွေထဲမှာတော့ ဘယ်တော့မှ result တွေ ပြန်မပေးပါဘူး။ အဲဒီအစား — သက်ဆိုင်တဲ့ *implementation* files တွေ (`.js` ဒါမှမဟုတ် `.ts` files လိုမျိုး) ကို ရှာဖွေပြီး — အဲဒီ files တွေက `.d.ts` files တွေကြောင့် ပုံမှန်အားဖြင့် ဖုံးကွယ်ခံထားရတာတွေတောင် — အဲဒီနေရာမှာ definitions တွေကို ရှာဖွေပါတယ်။

ဒါက — library တစ်ခုကနေ import လုပ်နေတဲ့ function တစ်ခုရဲ့ `.d.ts` file ထဲက type declaration အစား — သူ့ရဲ့ implementation ကို ချောင်းကြည့်ဖို့ လိုအပ်တဲ့အခါမျိုးမှာ အသုံးအများဆုံးပါ။

![The "Go to Source Definition" command on a use of the yargs package jumps the editor to an index.cjs file in yargs.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2022/05/go-to-source-definition-4-7-v1.gif)

ဒီ command အသစ်ကို Visual Studio Code ရဲ့ နောက်ဆုံး versions တွေမှာ စမ်းသုံးနိုင်ပါတယ်။ ဒါပေမယ့် — ဒီလုပ်ဆောင်ချက်က preview ထဲမှာ ရှိနေဆဲ ဖြစ်ပြီး — သိထားရမယ့် ကန့်သတ်ချက်တွေ ရှိပါတယ်ဆိုတာ သတိပြုပါ။ အချို့သော အခြေအနေတွေမှာ TypeScript က definition တစ်ခုရဲ့ ပေးထားတဲ့ result နဲ့ ကိုက်ညီမယ့် `.js` file ကို ခန့်မှန်းဖို့ heuristics တွေ သုံးတာမို့ — ဒီ results တွေ မတိကျနိုင်ပါဘူး။ Visual Studio Code က result တစ်ခုက ခန့်မှန်းချက်တစ်ခု ဟုတ်မဟုတ်ကိုလည်း အခုထိ ညွှန်ပြမပေးသေးပါဘူး — ဒါပေမယ့် အဲဒါက ကျွန်တော်တို့ ပူးပေါင်း လုပ်ဆောင်နေတဲ့ အရာတစ်ခုပါ။

ဒီ feature အကြောင်း feedback ထားခဲ့နိုင်သလို — သိထားရမယ့် ကန့်သတ်ချက်တွေ ဖတ်နိုင်၊ ဒါမှမဟုတ် [ကျွန်တော်တို့ရဲ့ feedback issue](https://github.com/microsoft/TypeScript/issues/49003) မှာ ပိုပြီး လေ့လာနိုင်ပါတယ်။

## Group-Aware Organize Imports (Group ကို ထည့်တွက်သော Organize Imports)

TypeScript မှာ JavaScript ရော TypeScript အတွက်ပါ *Organize Imports* ဆိုတဲ့ editor feature တစ်ခု ရှိပါတယ်။ ကံမကောင်းစွာနဲ့ပဲ — ဒါက အတော်လေး ခပ်တုံးတုံး ကိရိယာတစ်ခုလို ဖြစ်နိုင်ပြီး — သင့် import statements တွေကို ရိုးရိုးရှင်းရှင်း sort လုပ်တတ်ပါတယ်။

ဥပမာ — အောက်ပါ file ပေါ်မှာ Organize Imports ကို run လုပ်လိုက်ရင်...

```ts
// local code
import * as bbb from "./bbb";
import * as ccc from "./ccc";
import * as aaa from "./aaa";

// built-ins
import * as path from "path";
import * as child_process from "child_process"
import * as fs from "fs";

// some code...
```

... အောက်ပါလိုမျိုး တစ်ခုခု ရပါလိမ့်မယ်

```ts
// local code
import * as child_process from "child_process";
import * as fs from "fs";
// built-ins
import * as path from "path";
import * as aaa from "./aaa";
import * as bbb from "./bbb";
import * as ccc from "./ccc";

// some code...
```

ဒါက... သိပ်မကောင်းပါဘူး။ သေချာပါတယ် — ကျွန်တော်တို့ရဲ့ imports တွေက သူတို့ရဲ့ paths တွေအလိုက် sort ဖြစ်သွားပြီး — comments တွေရော newlines တွေရော ထိန်းသိမ်းထားပေမယ့် — ကျွန်တော်တို့ မျှော်လင့်ထားတဲ့ ပုံစံမျိုးနဲ့တော့ မဟုတ်ပါဘူး။ အများစုသော အချိန်တွေမှာ — imports တွေကို တိကျတဲ့ နည်းလမ်းတစ်ခုနဲ့ group လုပ်ထားပြီးသားဆိုရင် — အဲဒီအတိုင်း ထိန်းသိမ်းထားစေချင်ကြပါတယ်။

TypeScript 4.7 က Organize Imports ကို group-aware နည်းလမ်းနဲ့ လုပ်ဆောင်ပါတယ်။ အပေါ်က code ပေါ်မှာ run လုပ်လိုက်ရင် — သင်မျှော်လင့်ထားတာနဲ့ ပိုနီးစပ်တဲ့ ပုံစံမျိုး ရပါလိမ့်မယ်:

```ts
// local code
import * as aaa from "./aaa";
import * as bbb from "./bbb";
import * as ccc from "./ccc";

// built-ins
import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";

// some code...
```

ဒီ feature ကို ပံ့ပိုးပေးခဲ့တဲ့ [Minh Quy](https://github.com/MQuy) ကို ကျေးဇူးတင်ကြောင်း ဖော်ပြချင်ပါတယ် — [ဒီ feature ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/48330)။

## Object Method Snippet Completions (Object Method Snippet Completion များ)

TypeScript က object literal methods တွေအတွက် snippet completions တွေကို အခု ပံ့ပိုးပေးပါတယ်။ Object တစ်ခုထဲမှာ members တွေ complete လုပ်တဲ့အခါ — TypeScript က method တစ်ခုရဲ့ နာမည်တစ်ခုတည်းအတွက် ပုံမှန် completion entry တစ်ခုနဲ့အတူ — method definition အပြည့်အစုံအတွက် သီးခြား completion entry တစ်ခုပါ ပေးပါလိမ့်မယ်!

![Completion a full method signature from an object](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2022/05/object-method-completions-4-7-v2.gif)

အသေးစိတ် အချက်အလက်တွေအတွက် — [implementing pull request ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/48168)။

## Breaking Changes (ပြိုပျက်စေသော အပြောင်းအလဲများ)

### `lib.d.ts` Updates (`lib.d.ts` အပ်ဒိတ်များ)

TypeScript က ကြီးမားတဲ့ breaks တွေကို ရှောင်ရှားဖို့ ကြိုးစားနေပေမယ့် — built-in libraries တွေထဲက သေးငယ်တဲ့ ပြောင်းလဲမှုတွေတောင် ပြဿနာတွေ ဖြစ်စေနိုင်ပါတယ်။ DOM နဲ့ `lib.d.ts` updates တွေကြောင့် ကြီးမားတဲ့ breaks တွေ ဖြစ်မယ်လို့တော့ မျှော်လင့်မထားပါဘူး — ဒါပေမယ့် သေးငယ်တဲ့ဟာတွေတော့ ရှိနိုင်ပါတယ်။

### Stricter Spread Checks in JSX (JSX တွင် Spread Checks ပိုမိုတင်းကျပ်လာခြင်း)

JSX ထဲမှာ `...spread` တစ်ခု ရေးတဲ့အခါ — TypeScript က ပေးထားတဲ့ type က တကယ်ကို object တစ်ခု ဟုတ်မဟုတ် ပိုတင်းကျပ်တဲ့ စစ်ဆေးမှုတွေ အခု ပြုလုပ်ပါတယ်။ ရလဒ်အနေနဲ့ — `unknown` နဲ့ `never` types တွေရှိတဲ့ values တွေ (ပိုရှားပါးပေမယ့် — သာမန် `null` နဲ့ `undefined` တွေပါ) — JSX elements တွေထဲကို spread လုပ်လို့ မရတော့ပါဘူး။

ဒါဆိုရင် အောက်ပါ ဥပမာအတွက်:

```tsx
import * as React from "react";

interface Props {
    stuff?: string;
}

function MyComponent(props: unknown) {
    return <div {...props} />;
}
```

... အောက်ပါလိုမျိုး error တစ်ခု အခု ရပါလိမ့်မယ်:

```
Spread types may only be created from object types.
```

ဒါက object literals တွေထဲက spreads တွေနဲ့ ဒီအပြုအမူကို ပိုပြီး ကိုက်ညီစေပါတယ်။

အသေးစိတ် အချက်အလက်တွေအတွက် — [GitHub ပေါ်က ပြောင်းလဲမှုကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/48570)။

### Stricter Checks with Template String Expressions (Template String Expressions များတွင် စစ်ဆေးမှုများ ပိုမိုတင်းကျပ်လာခြင်း)

Template string တစ်ခုထဲမှာ `symbol` value တစ်ခုကို သုံးတဲ့အခါ — JavaScript မှာ runtime error တစ်ခု ဖြစ်ပေါ်ပါတယ်။

```js
let str = `hello ${Symbol()}`;
// TypeError: Cannot convert a Symbol value to a string
```

ရလဒ်အနေနဲ့ — TypeScript ကလည်း error တစ်ခု ထုတ်ပြန်ပါလိမ့်မယ်; ဒါပေမယ့် — TypeScript က အခုဆိုရင် — တစ်နည်းနည်းနဲ့ symbol တစ်ခုဆီ constrained ဖြစ်နေတဲ့ generic value တစ်ခုကို template string ထဲမှာ သုံးထားလားဆိုတာကိုပါ စစ်ဆေးပါတယ်။

```ts
function logKey<S extends string | symbol>(key: S): S {
    // Now an error.
    console.log(`${key} is the key`);
    return key;
}

function get<T, K extends keyof T>(obj: T, key: K) {
    // Now an error.
    console.log(`Grabbing property '${key}'.`);
    return obj[key];
}
```

TypeScript က အခု အောက်ပါ error ကို ထုတ်ပြန်ပါလိမ့်မယ်:

```
Implicit conversion of a 'symbol' to a 'string' will fail at runtime. Consider wrapping this expression in 'String(...)'.
```

အချို့သော အခြေအနေတွေမှာ — error message က အကြံပြုထားသလိုပဲ — expression ကို `String` call တစ်ခုထဲမှာ wrap လုပ်ခြင်းအားဖြင့် ဒါကို ရှောင်ရှားနိုင်ပါတယ်။

```ts
function logKey<S extends string | symbol>(key: S): S {
    // No longer an error.
    console.log(`${String(key)} is the key`);
    return key;
}
```

အခြား အခြေအနေတွေမှာတော့ — ဒီ error က အလွန်အကျွံ pedantic ဖြစ်ပြီး — `keyof` သုံးတဲ့အခါ `symbol` keys တွေကို ခွင့်ပြုဖို့တောင် သင်ဂရုမစိုက်နိုင်ပါဘူး။ ဒီလိုအခြေအနေမျိုးတွေမှာ — `string & keyof ...` ကို ပြောင်းသုံးနိုင်ပါတယ်:

```ts
function get<T, K extends string & keyof T>(obj: T, key: K) {
    // No longer an error.
    console.log(`Grabbing property '${key}'.`);
    return obj[key];
}
```

နောက်ထပ် အချက်အလက်တွေအတွက် — [implementing pull request ကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/44578)။

### `readFile` Method is No Longer Optional on `LanguageServiceHost` (`LanguageServiceHost` တွင် `readFile` Method သည် Optional မဟုတ်တော့ခြင်း)

သင်က `LanguageService` instances တွေ ဖန်တီးနေတယ်ဆိုရင် — ပေးအပ်ထားတဲ့ `LanguageServiceHost`s တွေက `readFile` method တစ်ခု ပေးအပ်ဖို့ လိုအပ်ပါလိမ့်မယ်။ ဒီပြောင်းလဲမှုက compiler option အသစ်ဖြစ်တဲ့ `moduleDetection` ကို ပံ့ပိုးနိုင်ဖို့ လိုအပ်ခဲ့တာပါ။

[ဒီမှာ ပြောင်းလဲမှုအကြောင်း ဆက်ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/47495)။

### `readonly` Tuples Have a `readonly` `length` Property (`readonly` Tuples များတွင် `readonly` `length` Property ရှိခြင်း)

`readonly` tuple တစ်ခုက ၎င်းရဲ့ `length` property ကို အခုဆိုရင် `readonly` အဖြစ် သတ်မှတ်ပါလိမ့်မယ်။ ဒါက fixed-length tuples တွေအတွက်ဆိုရင် ဘယ်တော့မှ မမြင်နိုင်လောက်တဲ့ အရာတစ်ခု ဖြစ်ပေမယ့် — trailing optional နဲ့ rest element types တွေ ပါတဲ့ tuples တွေမှာတော့ သတိပြုမိနိုင်တဲ့ ကြီးကြပ်မှု လွတ်နေမှု (oversight) တစ်ခု ဖြစ်ခဲ့ပါတယ်။

ရလဒ်အနေနဲ့ — အောက်ပါ code က အခု မအောင်မြင်တော့ပါဘူး:

```ts
function overwriteLength(tuple: readonly [string, string, string]) {
    // Now errors.
    tuple.length = 7;
}
```

[ဒီမှာ ဒီပြောင်းလဲမှုအကြောင်း ဆက်ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/47717)။
