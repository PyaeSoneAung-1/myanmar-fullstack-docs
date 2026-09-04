---
title: "Modules: Packages"
description: "package.json fields (name, main, type, exports, imports)၊ entry points၊ conditional exports၊ subpath patterns နဲ့ dual CommonJS/ES module packages အပါအဝင် Node.js packages ရေးသားခြင်းအတွက် လမ်းညွှန်"
order: 110
source: "https://nodejs.org/api/packages.html"
status: translated
updated: 2026-09-04
---

## နိဒါန်း (Introduction)

Package ဆိုတာ `package.json` file တစ်ခုနဲ့ ဖော်ပြထားတဲ့ folder tree (ဖိုင်တွဲ သစ်ပင်) တစ်ခုပါ။ Package ထဲမှာ `package.json` file ပါတဲ့ folder နဲ့ — နောက်ထပ် `package.json` file တစ်ခု ဒါမှမဟုတ် `node_modules` ဆိုတဲ့ folder တစ်ခုကို မတွေ့မချင်း — subfolder (အဆင့်ခွဲ ဖိုင်တွဲ) အားလုံး ပါဝင်ပါတယ်။

ဒီစာမျက်နှာက Node.js က သတ်မှတ်ထားတဲ့ [`package.json`][] fields တွေရဲ့ reference နဲ့အတူ — `package.json` files တွေ ရေးသားနေတဲ့ package authors (package ရေးသားသူများ) အတွက် လမ်းညွှန်ချက်တွေကိုပါ ဖော်ပြပေးပါတယ်။

## Module system သတ်မှတ်ခြင်း (Determining module system)

### နိဒါန်း (Introduction)

Node.js က အောက်ပါအရာတွေကို `node` ဆီ initial input (ပထမဆုံး ထည့်သွင်းမှု) အနေနဲ့ ပေးလိုက်တဲ့အခါ ဒါမှမဟုတ် `import` statements တွေ ဒါမှမဟုတ် `import()` expressions တွေနဲ့ ရည်ညွှန်းလိုက်တဲ့အခါ [ES modules][] အဖြစ် သတ်မှတ်ပါတယ်:

* `.mjs` extension ပါတဲ့ files တွေ။

* အနီးဆုံး parent `package.json` file ထဲမှာ top-level [`"type"`][] field ပါပြီး တန်ဖိုးက `"module"` ဖြစ်နေတဲ့ `.js` extension ပါတဲ့ files တွေ။

* `--eval` ရဲ့ argument အနေနဲ့ ဒါမှမဟုတ် `STDIN` ကနေ `node` ဆီ pipe လုပ်ပြီး — `--input-type=module` flag နဲ့ ပေးလိုက်တဲ့ strings တွေ။

* [ES modules][] အဖြစ်သာ အောင်မြင်စွာ parse လုပ်လို့ရတဲ့ syntax ပါဝင်တဲ့ code တွေ — ဥပမာ `import` ဒါမှမဟုတ် `export` statements တွေ၊ `import.meta` စတာတွေ — ဘယ်လို အနက်ဖွင့်ရမလဲဆိုတဲ့ ထင်ရှားတဲ့ marker (အမှတ်အသား) မပါဘဲ။ ထင်ရှားတဲ့ markers တွေကတော့ `.mjs` ဒါမှမဟုတ် `.cjs` extensions တွေ၊ `"module"` ဒါမှမဟုတ် `"commonjs"` တန်ဖိုးတွေနဲ့ `package.json` ရဲ့ `"type"` fields တွေ၊ ဒါမှမဟုတ် `--input-type` flag တို့ပဲ ဖြစ်ပါတယ်။ Dynamic `import()` expressions တွေကတော့ CommonJS ရော ES modules နှစ်ခုလုံးမှာ သုံးလို့ရတာမို့ — file တစ်ခုကို ES module အဖြစ် အတင်းသတ်မှတ်စေမှာ မဟုတ်ပါဘူး။ [Syntax detection][] ကို ကြည့်ပါ။

Node.js က အောက်ပါအရာတွေကို `node` ဆီ initial input အနေနဲ့ ပေးလိုက်တဲ့အခါ ဒါမှမဟုတ် `import` statements တွေ ဒါမှမဟုတ် `import()` expressions တွေနဲ့ ရည်ညွှန်းလိုက်တဲ့အခါ [CommonJS][] အဖြစ် သတ်မှတ်ပါတယ်:

* `.cjs` extension ပါတဲ့ files တွေ။

* အနီးဆုံး parent `package.json` file ထဲမှာ top-level [`"type"`][] field ပါပြီး တန်ဖိုးက `"commonjs"` ဖြစ်နေတဲ့ `.js` extension ပါတဲ့ files တွေ။

* `--eval` ဒါမှမဟုတ် `--print` ရဲ့ argument အနေနဲ့ ဒါမှမဟုတ် `STDIN` ကနေ `node` ဆီ pipe လုပ်ပြီး — `--input-type=commonjs` flag နဲ့ ပေးလိုက်တဲ့ strings တွေ။

* Parent `package.json` file မရှိတဲ့ ဒါမှမဟုတ် အနီးဆုံး parent `package.json` file ထဲမှာ `type` field မပါတဲ့ `.js` extension ပါတဲ့ files တွေ — ပြီးတော့ အဲဒီ code က CommonJS အဖြစ် အောင်မြင်စွာ evaluate (တွက်ချက် run) လုပ်လို့ရနိုင်တဲ့ files တွေ။ တစ်နည်းပြောရရင် — Node.js က ဒီလို "ambiguous" (မရေရာသော) files တွေကို CommonJS အဖြစ် အရင်ဦးစွာ run ဖို့ ကြိုးစားပြီး — CommonJS အဖြစ် evaluate လုပ်တဲ့အခါ parser က ES module syntax တွေ့လို့ မအောင်မြင်ခဲ့ရင် ES modules အဖြစ် ပြန်ပြီး retry (ထပ်ကြိုးစား) လုပ်ပါတယ်။

ဒီလို "ambiguous" files တွေထဲမှာ ES module syntax ရေးသားခြင်းက performance ကုန်ကျစရိတ် ရှိတာမို့ — authors တွေအနေနဲ့ တတ်နိုင်သမျှ ရှင်းရှင်းလင်းလင်း သတ်မှတ်ဖို့ တိုက်တွန်းထားပါတယ်။ အထူးသဖြင့် package authors တွေက source တွေအားလုံး CommonJS ဖြစ်နေတဲ့ packages တွေမှာတောင် — ကိုယ့် `package.json` file တွေထဲမှာ [`"type"`][] field ကို အမြဲ ထည့်သွင်းသင့်ပါတယ်။ Package ရဲ့ `type` ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ထားခြင်းက — Node.js ရဲ့ default type တစ်ချိန်ချိန်မှာ ပြောင်းသွားရင်တောင် package ကို အနာဂတ်အတွက် ကြိုတင်ကာကွယ်ပေးထားသလို ဖြစ်စေပြီး — build tools တွေနဲ့ loaders တွေအတွက် package ထဲက files တွေကို ဘယ်လို အနက်ဖွင့်ရမလဲ ဆုံးဖြတ်ရာမှာလည်း ပိုလွယ်ကူစေပါတယ်။

### Syntax ရှာဖွေဖော်ထုတ်ခြင်း (Syntax detection)

> Stability: 1.2 - Release candidate

Node.js က ambiguous input ရဲ့ source code ကို စစ်ဆေးပြီး ES module syntax ပါဝင်မဝင် ဆုံးဖြတ်ပါတယ်။ ဒီလို syntax တွေ့ရှိရင် input ကို ES module အဖြစ် သတ်မှတ်ပါတယ်။

Ambiguous input ဆိုတာက:

* `.js` extension ဒါမှမဟုတ် extension လုံးဝမပါတဲ့ files တွေ — ပြီးတော့ control လုပ်မယ့် `package.json` file မရှိတာ ဒါမှမဟုတ် `type` field မပါတဲ့ file ရှိနေတာ။
* `--input-type` မသတ်မှတ်ထားတဲ့အခါ string input (`--eval` ဒါမှမဟုတ် `STDIN`) တွေ။

ES module syntax ဆိုတာက CommonJS အဖြစ် evaluate လုပ်တဲ့အခါ throw ဖြစ်စေမယ့် syntax ကို ဆိုလိုပါတယ်။ ဒီထဲမှာ အောက်ပါတို့ ပါဝင်ပါတယ်:

* `import` statements တွေ (ဒါပေမယ့် CommonJS မှာ valid ဖြစ်တဲ့ `import()` expressions တွေ မဟုတ်ပါ)။
* `export` statements တွေ။
* `import.meta` references တွေ။
* Module တစ်ခုရဲ့ top level မှာ ရှိတဲ့ `await`။
* CommonJS wrapper variables တွေရဲ့ lexical redeclarations (စာလုံးအဆင့် ပြန်လည်ကြေညာခြင်း) — `require`, `module`, `exports`, `__dirname`, `__filename` တို့ပါ။

### Module resolution နှင့် loading (Module resolution and loading)

Node.js မှာ module resolution နဲ့ loading အမျိုးအစား နှစ်မျိုး ရှိပြီး — module ကို ဘယ်လို request လုပ်လဲဆိုတာပေါ် မူတည်ပြီး ရွေးချယ်ပါတယ်။

Module တစ်ခုကို `require()` ကနေ request လုပ်တဲ့အခါ (CommonJS modules တွေမှာ default အနေနဲ့ ရနိုင်ပြီး — CommonJS ရော ES Modules နှစ်ခုလုံးမှာ `createRequire()` သုံးပြီး dynamically ဖန်တီးလို့လည်း ရပါတယ်):

* Resolution (resolution လုပ်ဆောင်ခြင်း):
  * `require()` ကနေ စတင်တဲ့ resolution က [folders as modules][] ကို support လုပ်ပါတယ်။
  * Specifier တစ်ခုကို resolve လုပ်တဲ့အခါ — အတိအကျ ကိုက်ညီတဲ့အရာ မတွေ့ရင် `require()` က extensions (`.js`, `.json`, နောက်ဆုံးအနေနဲ့ `.node`) တွေကို ထည့်ကြည့်ပြီး [folders as modules][] အနေနဲ့ resolve လုပ်ဖို့ ကြိုးစားပါတယ်။
  * Default အနေနဲ့ URLs တွေကို specifiers အဖြစ် support မလုပ်ပါဘူး။
* Loading (loading လုပ်ဆောင်ခြင်း):
  * `.json` files တွေကို JSON text files အဖြစ် သတ်မှတ်ပါတယ်။
  * `.node` files တွေကို `process.dlopen()` နဲ့ load လုပ်တဲ့ compiled addon modules တွေအဖြစ် အနက်ဖွင့်ပါတယ်။
  * `.ts`, `.mts` နဲ့ `.cts` files တွေကို [TypeScript][] text files အဖြစ် သတ်မှတ်ပါတယ်။
  * တခြား extension တစ်ခုခု ဒါမှမဟုတ် extension လုံးဝမပါတဲ့ files တွေကို JavaScript text files အဖြစ် သတ်မှတ်ပါတယ်။
  * [ECMAScript module][ES Module] _နဲ့ ၎င်း၏ dependencies တွေ_ synchronous (ထပ်တူကျသော — top-level `await` မပါတဲ့) ဖြစ်နေမှသာ — `require()` ကို CommonJS modules တွေကနေ [ECMAScript modules တွေကို load လုပ်ဖို့][load ECMAScript modules from CommonJS modules] သုံးနိုင်ပါတယ်။

Module တစ်ခုကို static `import` statements (ES Modules တွေမှာပဲ ရနိုင်တဲ့) ဒါမှမဟုတ် `import()` expressions (CommonJS ရော ES Modules နှစ်ခုလုံးမှာ ရနိုင်တဲ့) ကနေ request လုပ်တဲ့အခါ:

* Resolution (resolution လုပ်ဆောင်ခြင်း):
  * `import`/`import()` ရဲ့ resolution က folders တွေကို modules အဖြစ် support မလုပ်ပါဘူး — directory indexes တွေ (ဥပမာ `'./startup/index.js'`) ကို အပြည့်အစုံ သတ်မှတ်ပေးရပါမယ်။
  * Extension ရှာဖွေခြင်း မလုပ်ပါဘူး။ Specifier က relative ဒါမှမဟုတ် absolute file URL ဖြစ်နေရင် file extension ကို ပေးထားရပါမယ်။
  * Default အနေနဲ့ `file://` နဲ့ `data:` URLs တွေကို specifiers အဖြစ် support လုပ်ပါတယ်။
* Loading (loading လုပ်ဆောင်ခြင်း):
  * `.json` files တွေကို JSON text files အဖြစ် သတ်မှတ်ပါတယ်။ JSON modules တွေကို import လုပ်တဲ့အခါ import type attribute လိုအပ်ပါတယ် (ဥပမာ — `import json from './data.json' with { type: 'json' }`)။
  * [`--experimental-addon-modules`][] enable လုပ်ထားရင် `.node` files တွေကို `process.dlopen()` နဲ့ load လုပ်တဲ့ compiled addon modules တွေအဖြစ် အနက်ဖွင့်ပါတယ်။
  * `.ts`, `.mts` နဲ့ `.cts` files တွေကို [TypeScript][] text files အဖြစ် သတ်မှတ်ပါတယ်။
  * JavaScript text files တွေအတွက် `.js`, `.mjs`, နဲ့ `.cjs` extensions တွေကိုပဲ လက်ခံပါတယ်။
  * `.wasm` files တွေကို [WebAssembly modules][] အဖြစ် သတ်မှတ်ပါတယ်။
  * တခြား file extensions တွေက [`ERR_UNKNOWN_FILE_EXTENSION`][] error ဖြစ်စေပါတယ်။ ထပ်ဆောင်း file extensions တွေကို [customization hooks][] ကနေ ပံ့ပိုးပေးနိုင်ပါတယ်။
  * `import`/`import()` ကို JavaScript [CommonJS modules][commonjs] တွေ load လုပ်ဖို့ သုံးနိုင်ပါတယ်။ ဒီလို modules တွေကို named exports တွေ ခွဲခြားသိဖို့ [merve][] ကနေ ဖြတ်သန်းပြီး — static analysis နဲ့ ဆုံးဖြတ်လို့ရတဲ့ exports တွေကို ရရှိနိုင်ပါတယ်။

Module တစ်ခုကို ဘယ်လို request လုပ်လုပ်ပဲ ဖြစ်ဖြစ် — resolution နဲ့ loading လုပ်ငန်းစဉ်တွေကို [customization hooks][] သုံးပြီး customize လုပ်နိုင်ပါတယ်။

### `package.json` နှင့် file extensions များ (package.json and file extensions)

Package တစ်ခုအတွင်းမှာ [`package.json`][] ရဲ့ [`"type"`][] field က `.js` files တွေကို Node.js က ဘယ်လို အနက်ဖွင့်ရမလဲ သတ်မှတ်ပါတယ်။ `package.json` file တစ်ခုမှာ `"type"` field မရှိရင် `.js` files တွေကို [CommonJS][] အဖြစ် သတ်မှတ်ပါတယ်။

`package.json` ရဲ့ `"type"` တန်ဖိုးက `"module"` ဆိုရင် Node.js က အဲဒီ package အတွင်းက `.js` files တွေကို [ES module][] syntax သုံးတဲ့ files တွေအဖြစ် အနက်ဖွင့်ပါတယ်။

`"type"` field က ကနဦး entry points တွေ (`node my-app.js`) ပေါ်မှာပဲ သက်ရောက်တာ မဟုတ်ဘဲ — `import` statements တွေနဲ့ `import()` expressions တွေက ရည်ညွှန်းထားတဲ့ files တွေပေါ်မှာလည်း သက်ရောက်ပါတယ်။

```js
// my-app.js, treated as an ES module because there is a package.json
// file in the same folder with "type": "module".

import './startup/init.js';
// Loaded as ES module since ./startup contains no package.json file,
// and therefore inherits the "type" value from one level up.

import 'commonjs-package';
// Loaded as CommonJS since ./node_modules/commonjs-package/package.json
// lacks a "type" field or contains "type": "commonjs".

import './node_modules/commonjs-package/index.js';
// Loaded as CommonJS since ./node_modules/commonjs-package/package.json
// lacks a "type" field or contains "type": "commonjs".
```

`.mjs` နဲ့ အဆုံးသတ်တဲ့ files တွေကို အနီးဆုံး parent `package.json` ဘာပဲဖြစ်ဖြစ် — [ES modules][] အဖြစ် အမြဲ load လုပ်ပါတယ်။

`.cjs` နဲ့ အဆုံးသတ်တဲ့ files တွေကို အနီးဆုံး parent `package.json` ဘာပဲဖြစ်ဖြစ် — [CommonJS][] အဖြစ် အမြဲ load လုပ်ပါတယ်။

```js
import './legacy-file.cjs';
// Loaded as CommonJS since .cjs is always loaded as CommonJS.

import 'commonjs-package/src/index.mjs';
// Loaded as ES module since .mjs is always loaded as ES module.
```

`.mjs` နဲ့ `.cjs` extensions တွေကို package တစ်ခုတည်းအတွင်းမှာ type အမျိုးမျိုး ရောနှောဖို့ သုံးနိုင်ပါတယ်:

* `"type": "module"` package တစ်ခုထဲမှာ `.js` ရော `.mjs` files တွေ နှစ်ခုလုံးကို ES modules အဖြစ် သတ်မှတ်တာမို့ — သီးခြား file တစ်ခုကို [CommonJS][] အဖြစ် အနက်ဖွင့်စေချင်ရင် `.cjs` extension နဲ့ နာမည်ပေးနိုင်ပါတယ်။

* `"type": "commonjs"` package တစ်ခုထဲမှာ `.js` ရော `.cjs` files တွေ နှစ်ခုလုံးကို CommonJS အဖြစ် သတ်မှတ်တာမို့ — သီးခြား file တစ်ခုကို [ES module][] အဖြစ် အနက်ဖွင့်စေချင်ရင် `.mjs` extension နဲ့ နာမည်ပေးနိုင်ပါတယ်။

### `--input-type` flag

`--input-type=module` flag သတ်မှတ်ထားတဲ့အခါ — `--eval` (ဒါမှမဟုတ် `-e`) ရဲ့ argument အနေနဲ့ ဒါမှမဟုတ် `STDIN` ကနေ `node` ဆီ pipe လုပ်ပြီး ပေးလိုက်တဲ့ strings တွေကို [ES modules][] အဖြစ် သတ်မှတ်ပါတယ်။

```bash
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"

echo "import { sep } from 'node:path'; console.log(sep);" | node --input-type=module
```

အပြည့်အစုံအတွက်တော့ — string input တွေကို CommonJS အဖြစ် အတိအကျ run ဖို့ `--input-type=commonjs` ဆိုတာလည်း ရှိပါတယ်။ `--input-type` မသတ်မှတ်ထားရင် ဒါကပဲ default အပြုအမူ ဖြစ်ပါတယ်။

## Package entry point များ (Package entry points)

Package တစ်ခုရဲ့ `package.json` file ထဲမှာ package အတွက် entry points တွေ သတ်မှတ်ပေးနိုင်တဲ့ fields နှစ်ခု ရှိပါတယ်: [`"main"`][] နဲ့ [`"exports"`][] တို့ပါ။ Fields နှစ်ခုစလုံးက ES module ရော CommonJS module ရဲ့ entry points တွေပေါ်မှာပါ သက်ရောက်ပါတယ်။

[`"main"`][] field ကို Node.js ရဲ့ version အားလုံးမှာ support လုပ်ပေမယ့် — စွမ်းဆောင်နိုင်မှုကတော့ အကန့်အသတ်ရှိပါတယ်: package ရဲ့ အဓိက entry point တစ်ခုတည်းကိုပဲ သတ်မှတ်ပေးနိုင်ပါတယ်။

[`"exports"`][] ကတော့ [`"main"`][] ရဲ့ ခေတ်မီတဲ့ အစားထိုးနည်းတစ်ခု ဖြစ်ပြီး — entry points အများအပြား သတ်မှတ်နိုင်ခြင်း၊ environment တစ်ခုနဲ့တစ်ခုကြားမှာ conditional entry resolution ကို support လုပ်ခြင်း၊ ပြီးတော့ [`"exports"`][] ထဲမှာ သတ်မှတ်ထားတာတွေကလွဲလို့ **တခြား entry points တွေကို ဘယ်ဟာမှ မသုံးနိုင်အောင် တားဆီးခြင်း** တို့ကို လုပ်ဆောင်ပေးပါတယ်။ ဒီ encapsulation (သီးသန့်ပိတ်ဆံ့ခြင်း) ကြောင့် module authors တွေက ကိုယ့် package ရဲ့ public interface ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်နိုင်ပါတယ်။

လက်ရှိ support လုပ်နေတဲ့ Node.js versions တွေကို ပစ်မှတ်ထားတဲ့ package အသစ်တွေအတွက် [`"exports"`][] field ကို အကြံပြုပါတယ်။ Node.js 10 နဲ့ အောက်ကို support လုပ်ရမယ့် packages တွေအတွက်တော့ [`"main"`][] field လိုအပ်ပါတယ်။ [`"exports"`][] ရော [`"main"`][] ပါ သတ်မှတ်ထားရင် — support လုပ်တဲ့ Node.js versions တွေမှာ [`"exports"`][] field က [`"main"`][] ထက် ဦးစားပေး အသုံးပြုပါတယ်။

Package ကို `require` ကနေ ရည်ညွှန်းလား `import` ကနေ ရည်ညွှန်းလားဆိုတာ အပါအဝင် — environment တစ်ခုချင်းစီအလိုက် မတူညီတဲ့ package entry points တွေ သတ်မှတ်ဖို့ [`"exports"`][] အတွင်းမှာ [Conditional exports][] ကို သုံးနိုင်ပါတယ်။ Package တစ်ခုတည်းထဲမှာ CommonJS ရော ES modules နှစ်ခုလုံးကို support လုပ်ခြင်းအကြောင်း ပိုမိုသိရှိလိုပါက [the dual CommonJS/ES module packages section][] ကို ကြည့်ပါ။

[`"exports"`][] field အသစ် မိတ်ဆက်လိုက်တဲ့ ရှိပြီးသား packages တွေက consumer တွေအနေနဲ့ သတ်မှတ်မထားတဲ့ entry points တွေကို ဘယ်ဟာမှ သုံးလို့မရတော့အောင် တားဆီးပါလိမ့်မယ် — [`package.json`][] ကိုယ်တိုင်တောင် ပါဝင်ပါတယ် (ဥပမာ — `require('your-package/package.json')`)။ **ဒါက breaking change (နောက်ပြန် လိုက်ဖက်မှု ပျက်စေတဲ့ အပြောင်းအလဲ) ဖြစ်နိုင်ခြေ များပါတယ်။**

[`"exports"`][] ကို non-breaking ဖြစ်အောင် မိတ်ဆက်ဖို့ဆိုရင် — အရင်က support လုပ်ခဲ့တဲ့ entry point တိုင်းကို export လုပ်ထားဖို့ သေချာစေရပါမယ်။ Entry points တွေကို အတိအကျ သတ်မှတ်ထားတာ အကောင်းဆုံးပါ — ဒါဆိုရင် package ရဲ့ public API က ကောင်းကောင်း သတ်မှတ်ပြီးသား ဖြစ်နေမှာပါ။ ဥပမာ — အရင်က `main`, `lib`, `feature`, နဲ့ `package.json` တို့ကို export လုပ်ခဲ့တဲ့ project တစ်ခုက အောက်ပါ `package.exports` ကို သုံးနိုင်ပါတယ်:

```json
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/index": "./lib/index.js",
    "./lib/index.js": "./lib/index.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./feature/index.js",
    "./feature/index.js": "./feature/index.js",
    "./package.json": "./package.json"
  }
}
```

ဒါမှမဟုတ် project တစ်ခုက folder တစ်ခုလုံးကို — extension ပါတဲ့ နဲ့ မပါတဲ့ subpaths နှစ်မျိုးစလုံးနဲ့ — export patterns သုံးပြီး export လုပ်ဖို့ ရွေးချယ်နိုင်ပါတယ်:

```json
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/*": "./lib/*.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/*": "./feature/*.js",
    "./feature/*.js": "./feature/*.js",
    "./package.json": "./package.json"
  }
}
```

အထက်ပါပုံစံတွေက minor package versions တိုင်းအတွက် backwards-compatibility (နောက်ပြန် လိုက်ဖက်မှု) ရစေနေချိန်မှာ — နောက်ပိုင်း major change တစ်ခုအတွက်တော့ package က ထုတ်ပြတဲ့ feature exports တွေကိုပဲ သင့်လျော်စွာ ကန့်သတ်နိုင်ပါတယ်:

```json
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./feature/*.js": "./feature/*.js",
    "./feature/internal/*": null
  }
}
```

### အဓိက entry point export (Main entry point export)

Package အသစ်တစ်ခု ရေးသားတဲ့အခါ [`"exports"`][] field ကို သုံးဖို့ အကြံပြုပါတယ်:

```json
{
  "exports": "./index.js"
}
```

[`"exports"`][] field သတ်မှတ်ထားတဲ့အခါ — package ရဲ့ subpaths အားလုံး သီးသန့်ပိတ်ဆံ့သွားပြီး importers တွေ ထပ်မံ အသုံးပြုလို့ မရတော့ပါဘူး။ ဥပမာ — `require('pkg/subpath.js')` က [`ERR_PACKAGE_PATH_NOT_EXPORTED`][] error ကို throw လုပ်ပါတယ်။

ဒီ exports encapsulation က tools တွေအတွက်ရော — package ကို semver upgrades တွေ ကိုင်တွယ်တဲ့အခါမှာပါ — package interfaces တွေအကြောင်း ပိုပြီး စိတ်ချရတဲ့ အာမခံချက်တွေ ပေးပါတယ်။ ဒါပေမယ့် ဒါက သိပ်ပြီး ခိုင်မာတဲ့ encapsulation မဟုတ်ပါဘူး — package ရဲ့ absolute subpath တစ်ခုခုကို တိုက်ရိုက် require လုပ်တာ (ဥပမာ `require('/path/to/node_modules/pkg/subpath.js')`) ဆိုရင် `subpath.js` ကို ဆက်ပြီး load လုပ်နေဦးမှာမို့ပါ။

လက်ရှိ support လုပ်နေတဲ့ Node.js versions အားလုံးနဲ့ ခေတ်မီ build tools တွေက `"exports"` field ကို support လုပ်ပါတယ်။ Node.js အဟောင်း ဒါမှမဟုတ် ဆက်စပ် build tool တစ်ခုကို သုံးနေတဲ့ projects တွေအတွက်တော့ — `"exports"` နဲ့အတူ တူညီတဲ့ module ကို ညွှန်ပြတဲ့ `"main"` field ကိုပါ ထည့်ပေးခြင်းဖြင့် compatibility ရနိုင်ပါတယ်:

```json
{
  "main": "./index.js",
  "exports": "./index.js"
}
```

### Subpath export များ (Subpath exports)

[`"exports"`][] field သုံးတဲ့အခါ — main entry point ကို `"."` subpath အဖြစ် သတ်မှတ်ပြီး — main entry point နဲ့အတူ custom subpaths တွေကိုပါ သတ်မှတ်နိုင်ပါတယ်:

```json
{
  "exports": {
    ".": "./index.js",
    "./submodule.js": "./src/submodule.js"
  }
}
```

အခုဆိုရင် consumer တစ်ယောက်က [`"exports"`][] ထဲမှာ သတ်မှတ်ထားတဲ့ subpath ကိုပဲ import လုပ်နိုင်တော့မှာပါ:

```js
import submodule from 'es-module-package/submodule.js';
// Loads ./node_modules/es-module-package/src/submodule.js
```

ကျန်တဲ့ subpaths တွေကတော့ error ဖြစ်ပါလိမ့်မယ်:

```js
import submodule from 'es-module-package/private-module.js';
// Throws ERR_PACKAGE_PATH_NOT_EXPORTED
```

#### Subpaths များထဲက extensions များ (Extensions in subpaths)

Package authors တွေက ကိုယ့် exports တွေထဲမှာ extension ပါတဲ့ (`import 'pkg/subpath.js'`) ဒါမှမဟုတ် extension မပါတဲ့ (`import 'pkg/subpath'`) subpaths — နှစ်မျိုးထဲက တစ်မျိုးကိုပဲ တစ်သမတ်တည်း သုံးသင့်ပါတယ်။ ဒါက exported module တစ်ခုချင်းစီအတွက် subpath တစ်ခုတည်းသာ ရှိစေပြီး — dependents (မှီခိုသုံးစွဲသူများ) အားလုံး တူညီတဲ့ specifier ကိုပဲ import လုပ်ကြတာမို့ — consumer တွေအတွက် package contract ရှင်းလင်းနေပြီး package subpath completions တွေကိုလည်း ရိုးရှင်းစေပါတယ်။

အစဉ်အလာအရတော့ packages တွေက extension မပါတဲ့ style ကို သုံးလေ့ရှိပါတယ် — ဒါက ဖတ်ရလွယ်ကူစေပြီး package အတွင်းက file ရဲ့ တကယ့် path ကို ဖုံးကွယ်ပေးနိုင်လို့ပါ။

[import maps][] တွေက browsers တွေနဲ့ တခြား JavaScript runtimes တွေမှာ package resolution အတွက် standard တစ်ခု ဖြစ်လာတာနဲ့အမျှ — extension မပါတဲ့ style သုံးခြင်းက import map definitions တွေကို ဖောင်းပွစေနိုင်ပါတယ်။ File extensions တွေကို အတိအကျ သတ်မှတ်ခြင်းက ဒီပြဿနာကို ရှောင်ရှားနိုင်ပြီး — import map က subpath export တစ်ခုချင်းစီအတွက် map entry သီးခြား ထည့်စရာမလိုဘဲ [packages folder mapping][] ကို သုံးပြီး subpaths အများအပြားကို တစ်ပြိုင်နက် map လုပ်နိုင်ပါတယ်။ ဒါက relative နဲ့ absolute import specifiers တွေမှာ [the full specifier path][] ကို သုံးရမယ်ဆိုတဲ့ လိုအပ်ချက်နဲ့လည်း ကိုက်ညီပါတယ်။

#### Export targets များအတွက် path rules နှင့် validation (Path rules and validation for export targets)

[`"exports"`][] field ထဲမှာ path တွေကို targets အဖြစ် သတ်မှတ်တဲ့အခါ Node.js က security, predictability (ကြိုတင်ခန့်မှန်းနိုင်မှု), နဲ့ proper encapsulation တို့ သေချာစေဖို့ စည်းမျဉ်း အများအပြားကို ကျင့်သုံးပါတယ်။ ဒီစည်းမျဉ်းတွေကို နားလည်ထားခြင်းက packages တွေ ထုတ်ဝေတဲ့ authors တွေအတွက် အရေးကြီးပါတယ်။

##### Targets များသည် relative URLs ဖြစ်ရမည် (Targets must be relative URLs)

[`"exports"`][] map ထဲက target paths အားလုံး (export keys တွေနဲ့ ဆက်စပ်နေတဲ့ values တွေ) က `./` နဲ့ စတင်တဲ့ relative URL strings တွေ ဖြစ်ရပါမယ်။

```json
// package.json
{
  "name": "my-package",
  "exports": {
    ".": "./dist/main.js",          // Correct
    "./feature": "./lib/feature.js", // Correct
    // "./origin-relative": "/dist/main.js", // Incorrect: Must start with ./
    // "./absolute": "file:///dev/null", // Incorrect: Must start with ./
    // "./outside": "../common/util.js" // Incorrect: Must start with ./
  }
}
```

ဒီလို ပြုမူရခြင်းရဲ့ အကြောင်းရင်းတွေကတော့:

* **Security (လုံခြုံရေး):** package ရဲ့ ကိုယ်ပိုင် directory အပြင်ဘက်က မထင်သလို files တွေကို export လုပ်ခြင်းကနေ ကာကွယ်ပေးပါတယ်။
* **Encapsulation:** Export လုပ်တဲ့ paths အားလုံးကို package root နဲ့ ဆက်စပ်ပြီး resolve လုပ်ဖို့ သေချာစေပြီး — package ကို self-contained (ကိုယ့်ဘာသာ ပြည့်စုံသော) ဖြစ်စေပါတယ်။

##### Path traversal နှင့် invalid segments များ မပါဝင်ရ (No path traversal or invalid segments)

Export targets တွေက package ရဲ့ root directory အပြင်ဘက်ကို ရောက်တဲ့ နေရာဆီကို resolve မလုပ်ရပါဘူး။ ဒါ့အပြင် `.` (single dot), `..` (double dot), ဒါမှမဟုတ် `node_modules` လိုမျိုး path segments တွေ (URL-encoded ပုံစံတွေ အပါအဝင်) ကို — ကနဦး `./` ပြီးနောက်ပိုင်း `target` string ထဲမှာရော target pattern တစ်ခုထဲကို အစားထိုးဝင်သွားတဲ့ `subpath` အပိုင်းတွေထဲမှာပါ — ယေဘုယျအားဖြင့် ခွင့်မပြုပါဘူး။

```json
// package.json
{
  "name": "my-package",
  "exports": {
    // ".": "./dist/../../elsewhere/file.js", // Invalid: path traversal
    // ".": "././dist/main.js",             // Invalid: contains "." segment
    // ".": "./dist/../dist/main.js",       // Invalid: contains ".." segment
    // "./utils/./helper.js": "./utils/helper.js" // Key has invalid segment
  }
}
```

### Exports sugar (အတိုကောက် exports ရေးသားနည်း)

`"."` export တစ်ခုတည်းပဲ ရှိတဲ့အခါ — [`"exports"`][] field က ဒီအခြေအနေအတွက် sugar (အတိုကောက် ရေးသားနည်း) ကို ပံ့ပိုးပေးပြီး [`"exports"`][] field ရဲ့ တန်ဖိုးကို တိုက်ရိုက် သတ်မှတ်လို့ ရပါတယ်။

```json
{
  "exports": {
    ".": "./index.js"
  }
}
```

ဒီလိုရေးတာကို အောက်ပါအတိုင်းလည်း ရေးနိုင်ပါတယ်:

```json
{
  "exports": "./index.js"
}
```

### Subpath imports (package အတွင်းမှသာ သုံးနိုင်သော mappings များ)

[`"exports"`][] field အပြင် — package ရဲ့ အတွင်းဘက်ကနေပဲ import specifiers တွေကို သက်ရောက်တဲ့ private mappings (သီးသန့် mapping များ) တွေ ဖန်တီးပေးတဲ့ package `"imports"` field လည်း ရှိပါတယ်။

`"imports"` field ထဲက entries တွေက external package specifiers တွေနဲ့ မရောထွေးအောင် `#` နဲ့ အမြဲ စတင်ရပါမယ်။

ဥပမာ — imports field ကို internal modules တွေအတွက် conditional exports ရဲ့ အကျိုးကျေးဇူးတွေ ရယူဖို့ သုံးနိုင်ပါတယ်:

```json
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```

ဒီနေရာမှာ `import '#dep'` က external package `dep-node-native` ရဲ့ resolution ကို (၎င်း၏ exports တွေပါ အလှည့်ကျ မပါဝင်) မရယူဘဲ — တခြား environments တွေမှာ package နဲ့ ဆက်စပ်နေတဲ့ local file `./dep-polyfill.js` ကိုပဲ ရယူပါတယ်။

`"exports"` field နဲ့ မတူတာက — `"imports"` field က external packages တွေဆီကို mapping လုပ်တာကို ခွင့်ပြုပါတယ်။

Imports field ရဲ့ resolution rules တွေကတော့ exports field နဲ့ တခြားမှ မဆိုစလောက် တူညီပါတယ်။

### Subpath patterns (subpath များစွာကို pattern ဖြင့် သတ်မှတ်ခြင်း)

Exports ဒါမှမဟုတ် imports အနည်းငယ်ပဲ ရှိတဲ့ packages တွေအတွက်တော့ exports subpath entry တစ်ခုချင်းစီကို အတိအကျ စာရင်းပြုစုဖို့ အကြံပြုပါတယ်။ ဒါပေမယ့် subpaths အများကြီး ရှိတဲ့ packages တွေမှာတော့ ဒီလိုလုပ်ခြင်းက `package.json` ဖောင်းပွစေပြီး ထိန်းသိမ်းရ ခက်ခဲစေနိုင်ပါတယ်။

ဒီလို use cases တွေအတွက်တော့ subpath export patterns တွေကို အစားထိုး သုံးနိုင်ပါတယ်:

```json
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js"
  },
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}
```

**`*` က string replacement syntax (စာသား အစားထိုး syntax) သက်သက်သာ ဖြစ်လို့ nested subpaths တွေကို ဖော်ထုတ်ပေးပါတယ်။**

Right hand side ပေါ်က `*` တွေအားလုံးကို ဒီတန်ဖိုးနဲ့ အစားထိုးပါလိမ့်မယ် — အဲဒီတန်ဖိုးထဲမှာ `/` separators တွေ ပါနေရင်တောင် အစားထိုးပါတယ်။

```js
import featureX from 'es-module-package/features/x.js';
// Loads ./node_modules/es-module-package/src/features/x.js

import featureY from 'es-module-package/features/y/y.js';
// Loads ./node_modules/es-module-package/src/features/y/y.js

import internalZ from '#internal/z.js';
// Loads ./src/internal/z.js
```

ဒါက file extensions တွေအတွက် အထူး ကိုင်တွယ်မှု မရှိတဲ့ — တိုက်ရိုက် static matching နဲ့ replacement ပဲ ဖြစ်ပါတယ်။ Mapping ရဲ့ နှစ်ဖက်စလုံးမှာ `"*.js"` ထည့်ထားခြင်းက package ရဲ့ ထုတ်ပြတဲ့ exports တွေကို JS files တွေပဲ ဖြစ်အောင် ကန့်သတ်ပါတယ်။

Exports တွေ statically enumerable (တည်ငြိမ်စွာ စာရင်းကောက်လို့ရတဲ့) ဖြစ်တယ်ဆိုတဲ့ ဂုဏ်သတ္တိက exports patterns တွေနဲ့ဆို ထိန်းသိမ်းထားနိုင်ပါတယ် — package တစ်ခုအတွက် exports တစ်ခုချင်းစီကို package ထဲက files စာရင်းပေါ်မှာ right hand side target pattern ကို `**` glob အနေနဲ့ သုံးပြီး ဆုံးဖြတ်နိုင်လို့ပါ။ Exports targets တွေထဲမှာ `node_modules` paths တွေ တားမြစ်ထားတာမို့ — ဒီ expansion က package ရဲ့ files တွေပေါ်မှာပဲ မူတည်ပါတယ်။

Patterns တွေကနေ private subfolders တွေကို ဖယ်ထုတ်ဖို့ `null` targets တွေကို သုံးနိုင်ပါတယ်:

```json
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js",
    "./features/private-internal/*": null
  }
}
```

```js
import featureInternal from 'es-module-package/features/private-internal/m.js';
// Throws: ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// Loads ./node_modules/es-module-package/src/features/x.js
```

### Conditional exports (အခြေအနေပေါ် မူတည်သော exports များ)

Conditional exports တွေက အချို့သော conditions တွေပေါ် မူတည်ပြီး မတူညီတဲ့ paths တွေဆီကို mapping လုပ်ဖို့ နည်းလမ်း ပေးပါတယ်။ CommonJS ရော ES module imports နှစ်ခုလုံးအတွက်မှာ support လုပ်ပါတယ်။

ဥပမာ — `require()` နဲ့ `import` တို့အတွက် မတူညီတဲ့ ES module exports တွေ ပေးချင်တဲ့ package တစ်ခုကို ဒီလို ရေးနိုင်ပါတယ်:

```json
// package.json
{
  "exports": {
    "import": "./index-module.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
```

Node.js က conditions တွေကို အောက်ပါအတိုင်း — conditions တွေ သတ်မှတ်သင့်တဲ့ အစီအစဉ်အတိုင်း most specific ကနေ least specific အထိ — implement လုပ်ပါတယ်:

* `"node-addons"` - `"node"` နဲ့ ဆင်တူပြီး Node.js environment တိုင်းနဲ့ ကိုက်ညီပါတယ်။ Native C++ addons တွေ သုံးတဲ့ entry point တစ်ခုကို — native addons တွေကို အားမကိုးတဲ့ ပိုပြီး universal ဖြစ်တဲ့ entry point တစ်ခုနဲ့ ဆန့်ကျင်ဘက် အနေနဲ့ ပေးဖို့ ဒီ condition ကို သုံးနိုင်ပါတယ်။ ဒီ condition ကို [`--no-addons` flag][] နဲ့ disable လုပ်နိုင်ပါတယ်။
* `"node"` - Node.js environment တိုင်းနဲ့ ကိုက်ညီပါတယ်။ CommonJS ဒါမှမဟုတ် ES module file ဖြစ်နိုင်ပါတယ်။ _အများစုမှာတော့ Node.js platform ကို အတိအကျ ဖော်ပြဖို့ မလိုအပ်ပါဘူး။_
* `"import"` - package ကို `import` ဒါမှမဟုတ် `import()` ကနေ ဒါမှမဟုတ် ECMAScript module loader ရဲ့ top-level import ဒါမှမဟုတ် resolve operation တစ်ခုခုကနေ load လုပ်တဲ့အခါ ကိုက်ညီပါတယ်။ Target file ရဲ့ module format ဘယ်လိုပဲ ဖြစ်ဖြစ် သက်ရောက်ပါတယ်။ _`"require"` နဲ့ အမြဲတမ်း အပြန်အလှန် သီးသန့် (mutually exclusive) ဖြစ်ပါတယ်။_
* `"require"` - package ကို `require()` ကနေ load လုပ်တဲ့အခါ ကိုက်ညီပါတယ်။ Condition က target file ရဲ့ module format ဘယ်လိုပဲ ဖြစ်ဖြစ် ကိုက်ညီပေမယ့် — ရည်ညွှန်းထားတဲ့ file ကို `require()` နဲ့ load လုပ်လို့ရအောင် ဖြစ်သင့်ပါတယ်။ မျှော်လင့်ရတဲ့ formats တွေကတော့ CommonJS, JSON, native addons, နဲ့ ES modules တို့ပါ။ _`"import"` နဲ့ အမြဲတမ်း အပြန်အလှန် သီးသန့် ဖြစ်ပါတယ်။_
* `"module-sync"` - package ကို `import`, `import()` ဒါမှမဟုတ် `require()` — ဘယ်ကနေ load လုပ်လုပ်ပဲ ကိုက်ညီပါတယ်။ Format က ၎င်း၏ module graph ထဲမှာ top-level await မပါတဲ့ ES modules ဖြစ်ဖို့ မျှော်လင့်ပါတယ် — ပါနေခဲ့ရင် module ကို `require()` လုပ်တဲ့အခါ `ERR_REQUIRE_ASYNC_MODULE` throw ဖြစ်ပါလိမ့်မယ်။
* `"default"` - အမြဲတမ်း ကိုက်ညီတဲ့ generic fallback ပါ။ CommonJS ဒါမှမဟုတ် ES module file ဖြစ်နိုင်ပါတယ်။ _ဒီ condition က အမြဲတမ်း နောက်ဆုံးမှာ လာသင့်ပါတယ်။_

[`"exports"`][] object အတွင်းမှာ key order က အရေးပါပါတယ်။ Condition matching လုပ်တဲ့အခါ — အစောပိုင်း entries တွေက priority ပိုမြင့်ပြီး နောက် entries တွေထက် ဦးစားပေး သက်ရောက်ပါတယ်။ _ယေဘုယျ စည်းမျဉ်းကတော့ conditions တွေကို object order ထဲမှာ most specific ကနေ least specific အထိ စီစဉ်သင့်ပါတယ်။_

`"import"` နဲ့ `"require"` conditions တွေ သုံးခြင်းက အန္တရာယ်တချို့ ဖြစ်စေနိုင်ပြီး — အဲဒါတွေကို [the dual CommonJS/ES module packages section][] မှာ ထပ်ဆင့် ရှင်းပြထားပါတယ်။

`"node-addons"` condition ကို native C++ addons တွေ သုံးတဲ့ entry point တစ်ခု ပေးဖို့ သုံးနိုင်ပါတယ်။ ဒါပေမယ့် ဒီ condition ကို [`--no-addons` flag][] နဲ့ disable လုပ်နိုင်ပါတယ်။ `"node-addons"` သုံးတဲ့အခါ `"default"` ကို — ဥပမာ native addon အစား WebAssembly သုံးတာမျိုး — ပိုပြီး universal ဖြစ်တဲ့ entry point တစ်ခု ပေးစွမ်းတဲ့ enhancement တစ်ခုအနေနဲ့ သတ်မှတ်ဖို့ အကြံပြုပါတယ်။

Conditional exports တွေကို exports subpaths တွေအထိပါ တိုးချဲ့နိုင်ပါတယ် — ဥပမာ:

```json
{
  "exports": {
    ".": "./index.js",
    "./feature.js": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}
```

ဒါက `require('pkg/feature.js')` နဲ့ `import 'pkg/feature.js'` တို့အတွက် — Node.js နဲ့ တခြား JS environments တွေကြားမှာ မတူညီတဲ့ implementations တွေ ပေးနိုင်တဲ့ package တစ်ခုကို သတ်မှတ်ပါတယ်။

Environment branches တွေ သုံးတဲ့အခါ တတ်နိုင်သမျှ `"default"` condition တစ်ခု အမြဲ ထည့်ပါ။ `"default"` condition ထည့်ထားခြင်းက — မသိတဲ့ JS environments တွေက ဒီ universal implementation ကို သုံးနိုင်ဖို့ သေချာစေပြီး — conditional exports တွေပါတဲ့ packages တွေကို support လုပ်ဖို့ ရှိပြီးသား environments တွေအဖြစ် ဟန်ဆောင်နေစရာ မလိုတော့အောင် ကူညီပါတယ်။ ဒါကြောင့် `"node"` နဲ့ `"default"` condition branches တွေက `"node"` နဲ့ `"browser"` condition branches တွေထက် ပိုပြီး ဦးစားပေး သုံးသင့်ပါတယ်။

### Nested conditions (အဆင့်ဆင့် ထည့်သွင်းထားသော conditions များ)

တိုက်ရိုက် mappings တွေအပြင် — Node.js က nested condition objects တွေကိုလည်း support လုပ်ပါတယ်။

ဥပမာ — browser အတွက် မဟုတ်ဘဲ Node.js မှာပဲ သုံးမယ့် dual mode entry points တွေပဲ ရှိတဲ့ package တစ်ခု သတ်မှတ်ဖို့:

```json
{
  "exports": {
    "node": {
      "import": "./feature-node.mjs",
      "require": "./feature-node.cjs"
    },
    "default": "./feature.mjs"
  }
}
```

Conditions တွေက flat conditions တွေလိုပဲ အစီအစဉ်အတိုင်း ဆက်ပြီး match လုပ်ပါတယ်။ Nested condition တစ်ခုမှာ mapping မရှိရင် — parent condition ရဲ့ ကျန်နေတဲ့ conditions တွေကို ဆက်ပြီး စစ်ဆေးပါလိမ့်မယ်။ ဒီနည်းနဲ့ nested conditions တွေက nested JavaScript `if` statements တွေလိုပဲ ပြုမူပါတယ်။

### User conditions များကို resolve လုပ်ခြင်း (Resolving user conditions)

Node.js run လုပ်နေတဲ့အခါ `--conditions` flag နဲ့ custom user conditions တွေကို ထည့်နိုင်ပါတယ်:

```bash
node --conditions=development index.js
```

ဒါဆိုရင် package imports နဲ့ exports တွေထဲမှာ `"development"` condition ကို resolve လုပ်ပြီး — ရှိပြီးသား `"node"`, `"node-addons"`, `"default"`, `"import"`, နဲ့ `"require"` conditions တွေကိုလည်း သင့်လျော်သလို resolve လုပ်ပါလိမ့်မယ်။

Custom conditions တွေကို flags တွေ ထပ်ခါထပ်ခါ သုံးပြီး ဘယ်နှစ်ခုဖြစ်ဖြစ် သတ်မှတ်နိုင်ပါတယ်။

ပုံမှန် conditions တွေမှာ alphanumerical characters (စာလုံးနဲ့ ဂဏန်း စာလုံးများ) တွေပဲ ပါသင့်ပြီး — လိုအပ်ရင် ":", "-", ဒါမှမဟုတ် "=" တို့ကို separators အဖြစ် သုံးနိုင်ပါတယ်။ တခြားအရာတွေ ပါသွားရင် node ပြင်ပ မှာ compatibility ပြဿနာတွေ ကြုံရနိုင်ပါတယ်။

Node ထဲမှာတော့ conditions တွေမှာ ကန့်သတ်ချက် အနည်းငယ်ပဲ ရှိပါတယ် — အတိအကျ ပြောရရင်:

1. အနည်းဆုံး character တစ်လုံး ပါဝင်ရပါမယ်။
2. "." နဲ့ စတင်လို့ မရပါဘူး — relative paths တွေကိုပါ ခွင့်ပြုတဲ့ နေရာတွေမှာ ပေါ်လာနိုင်လို့ပါ။
3. "," ပါဝင်လို့ မရပါဘူး — CLI tools တချို့က comma-separated list အဖြစ် parse လုပ်နိုင်လို့ပါ။
4. "10" လိုမျိုး integer property keys တွေ မဖြစ်ရပါဘူး — JS objects တွေရဲ့ property key ordering ပေါ်မှာ မမျှော်လင့်တဲ့ သက်ရောက်မှုတွေ ရှိနိုင်လို့ပါ။

### Community conditions အဓိပ္ပာယ်ဖွင့်ဆိုချက်များ (Community conditions definitions)

Node.js core ထဲမှာ [implement လုပ်ထားတဲ့](#conditional-exports) `"import"`, `"require"`, `"node"`, `"module-sync"`, `"node-addons"` နဲ့ `"default"` conditions တွေကလွဲလို့ တခြား condition strings တွေကို default အနေနဲ့ လျစ်လျူရှုပါတယ်။

တခြား platforms တွေက တခြား conditions တွေကို implement လုပ်နိုင်ပြီး — Node.js မှာတော့ [`--conditions` / `-C` flag][] ကနေ user conditions တွေကို enable လုပ်နိုင်ပါတယ်။

Custom package conditions တွေက မှန်ကန်တဲ့ အသုံးပြုမှု သေချာစေဖို့ ရှင်းလင်းတဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်တွေ လိုအပ်တာမို့ — ecosystem coordination (ဂေဟစနစ် ပူးပေါင်းဆောင်ရွက်မှု) ကို အထောက်အကူပြုဖို့ လူသိများတဲ့ package conditions တွေနဲ့ ၎င်းတို့ရဲ့ တိကျတဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်တွေရဲ့ စာရင်းကို အောက်မှာ ဖော်ပြထားပါတယ်။

* `"types"` - typing systems တွေက ပေးထားတဲ့ export အတွက် typing file ကို resolve လုပ်ဖို့ သုံးနိုင်ပါတယ်။ _ဒီ condition ကို အမြဲတမ်း ပထမဆုံး ထည့်သွင်းသင့်ပါတယ်။_
* `"browser"` - web browser environment တစ်ခုခု ဖြစ်ပါတယ်။
* `"development"` - development အတွက်သာ သီးသန့်တဲ့ environment entry point တစ်ခုကို သတ်မှတ်ဖို့ သုံးနိုင်ပါတယ် — ဥပမာ development mode မှာ run နေတဲ့အခါ ပိုကောင်းတဲ့ error messages တွေလိုမျိုး debugging context အပိုတွေ ပေးဖို့ပါ။ _`"production"` နဲ့ အမြဲတမ်း အပြန်အလှန် သီးသန့် ဖြစ်ရပါမယ်။_
* `"production"` - production environment အတွက် entry point တစ်ခုကို သတ်မှတ်ဖို့ သုံးနိုင်ပါတယ်။ _`"development"` နဲ့ အမြဲတမ်း အပြန်အလှန် သီးသန့် ဖြစ်ရပါမယ်။_

တခြား runtimes တွေအတွက် — platform-specific condition key အဓိပ္ပာယ်ဖွင့်ဆိုချက်တွေကို [Runtime Keys][] proposal specification ထဲမှာ [WinterCG][] က ထိန်းသိမ်းထားပါတယ်။

[Node.js documentation for this section][] ဆီကို pull request တစ်ခု ဖန်တီးခြင်းဖြင့် ဒီစာရင်းထဲကို condition definition အသစ်တွေ ထည့်နိုင်ပါတယ်။ Condition definition အသစ်တစ်ခုကို စာရင်းသွင်းဖို့ လိုအပ်ချက်တွေကတော့:

* အဓိပ္ပာယ်ဖွင့်ဆိုချက်က implementers အားလုံးအတွက် ရှင်းလင်းပြီး သံသယဖြစ်စရာ မရှိရပါဘူး။
* Condition လိုအပ်တဲ့ use case ကို ရှင်းရှင်းလင်းလင်း မျှတစွာ ရှင်းပြနိုင်ရပါမယ်။
* လက်ရှိမှာ လုံလောက်တဲ့ implementation အသုံးပြုမှု ရှိနေရပါမယ်။
* Condition နာမည်က တခြား condition definition တစ်ခု ဒါမှမဟုတ် ကျယ်ကျယ်ပြန့်ပြန့် သုံးနေတဲ့ condition တစ်ခုနဲ့ မတိုက်မိရပါဘူး။
* Condition definition ကို စာရင်းသွင်းခြင်းက ဒီလိုမဟုတ်ရင် မရနိုင်တဲ့ ecosystem အတွက် coordination အကျိုးကျေးဇူး တစ်ခုခု ပေးစွမ်းနိုင်ရပါမယ်။ ဥပမာ — company-specific ဒါမှမဟုတ် application-specific conditions တွေအတွက်တော့ ဒါမျိုး မလိုအပ်နိုင်ပါဘူး။
* Condition က Node.js user တစ်ယောက်က Node.js core documentation ထဲမှာ ရှိမယ်လို့ မျှော်လင့်မယ့် အမျိုးအစား ဖြစ်ရပါမယ်။ `"types"` condition က ဥပမာကောင်းတစ်ခုပါ: ဒါက [Runtime Keys][] proposal ထဲမှာ သိပ်မဆိုင်ပေမယ့် — Node.js docs ထဲမှာတော့ ကောင်းကောင်း ကိုက်ညီနေပါတယ်။

အထက်ပါ အဓိပ္ပာယ်ဖွင့်ဆိုချက်တွေကို အချိန်တန်ရင် သီးသန့် conditions registry တစ်ခုဆီကို ရွှေ့ပြောင်းနိုင်ပါတယ်။

### Package ကို ၎င်း၏ name နဲ့ self-reference လုပ်ခြင်း (Self-referencing a package using its name)

Package တစ်ခုအတွင်းမှာ — package ရဲ့ `package.json` [`"exports"`][] field ထဲမှာ သတ်မှတ်ထားတဲ့ တန်ဖိုးတွေကို package ရဲ့ name ကနေတစ်ဆင့် ရည်ညွှန်းနိုင်ပါတယ်။ ဥပမာ — အောက်ပါ `package.json` ရှိတယ်ဆိုပါစို့:

```json
// package.json
{
  "name": "a-package",
  "exports": {
    ".": "./index.mjs",
    "./foo.js": "./foo.js"
  }
}
```

ဒါဆိုရင် _အဲဒီ package ထဲက_ module တစ်ခုခုက package ထဲက export တစ်ခုကိုတောင် ရည်ညွှန်းနိုင်ပါတယ်:

```js
// ./a-module.mjs
import { something } from 'a-package'; // Imports "something" from ./index.mjs.
```

Self-referencing က `package.json` မှာ [`"exports"`][] ရှိနေမှသာ ရနိုင်ပြီး — အဲဒီ [`"exports"`][] (က `package.json` ထဲမှာ) ခွင့်ပြုထားတာကိုပဲ import လုပ်ခွင့် ရှိပါတယ်။ ဒါကြောင့် အထက်က package ကို ပေးထားတဲ့ အောက်က code က runtime error တစ်ခု ဖြစ်ပေါ်စေပါလိမ့်မယ်:

```js
// ./another-module.mjs

// Imports "another" from ./m.mjs. Fails because
// the "package.json" "exports" field
// does not provide an export named "./m.mjs".
import { another } from 'a-package/m.mjs';
```

Self-referencing ကို `require` သုံးတဲ့အခါမှာလည်း ရနိုင်ပါတယ် — ES module ထဲမှာရော CommonJS ထဲမှာပါ။ ဥပမာ — ဒီ code ကလည်း အလုပ်လုပ်ပါလိမ့်မယ်:

```cjs
// ./a-module.js
const { something } = require('a-package/foo.js'); // Loads from ./foo.js.
```

နောက်ဆုံးအနေနဲ့ — self-referencing က scoped packages တွေမှာလည်း အလုပ်လုပ်ပါတယ်။ ဥပမာ — ဒီ code တွေကလည်း အလုပ်လုပ်ပါလိမ့်မယ်:

```json
// package.json
{
  "name": "@my/package",
  "exports": "./index.js"
}
```

```cjs
// ./index.js
module.exports = 42;
```

```cjs
// ./other.js
console.log(require('@my/package'));
```

```console
$ node other.js
42
```

## Dual CommonJS/ES module packages (CommonJS နှင့် ES module နှစ်မျိုးလုံးအတွက် packages များ)

အသေးစိတ်ကို [the package examples repository][] မှာ ကြည့်ပါ။

## Package maps (package map များ)

> Stability: 1 - Experimental. ဒီ API ကို [`--experimental-package-map`][] နဲ့ enable လုပ်ပါ။

Package maps တွေက `node_modules` folder structure ကို အားမကိုးဘဲ package resolution ကို ထိန်းချုပ်ဖို့ ယန္တရားတစ်ခု ပေးပါတယ်။ [`--experimental-package-map`][] flag နဲ့ enable လုပ်လိုက်တဲ့အခါ — Node.js က JSON configuration file တစ်ခုကို သုံးပြီး bare specifiers တွေကို ဘယ်လို resolve လုပ်ရမလဲ ဆုံးဖြတ်ပါတယ်။

ဒီ feature က အောက်ပါကိစ္စတွေမှာ အသုံးဝင်ပါတယ်:

* **Monorepos (monorepo များ):** symlinks တွေရဲ့ ဒါမှမဟုတ် hoisting ရဲ့ ရှုပ်ထွေးမှုတွေ မလိုဘဲ — workspace packages တွေကြားမှာ ထင်ရှားတဲ့ dependency relationships တွေ သတ်မှတ်နိုင်ပါတယ်။
* **Dependency isolation (dependency သီးခြားခွဲထားခြင်း):** packages တွေက ကြေညာမထားတဲ့ dependencies တွေ (phantom dependencies) ဆီကို ဝင်ရောက်ခွင့် မရအောင် တားဆီးပေးပါတယ်။
* **Low file system coupling (file system နှင့် ဆက်စပ်မှု နည်းပါးခြင်း):** Package resolution algorithm က file system ကို စစ်ဆေးစရာ မလိုဘဲ — static data tables တွေပေါ်မှာပဲ မှီခိုပြီး run ပါတယ်။

### Configuration file ပုံစံ (Configuration file format)

Package map configuration file က `packages` object တစ်ခုပါတဲ့ JSON file တစ်ခုပါ။ `packages` ထဲက key တစ်ခုချင်းစီကို package ID လို့ ခေါ်ပြီး — package entry တစ်ခုအတွက် သီးသန့် identifier (ခွဲခြားသတ်မှတ်ကိန်း) တစ်ခု ဖြစ်ပါတယ်:

```json
{
  "packages": {
    "app": {
      "url": "./packages/app",
      "dependencies": {
        "@myorg/utils": "utils",
        "@myorg/ui-lib": "ui-lib"
      }
    },
    "utils": {
      "url": "./packages/utils"
    },
    "ui-lib": {
      "url": "./packages/ui-lib",
      "dependencies": {
        "@myorg/utils": "utils"
      }
    }
  }
}
```

Package entry တစ်ခုချင်းစီမှာ အောက်ပါ fields တွေ ရှိပါတယ်:

* `url` {string} **လိုအပ်သည် (Required).** Absolute ဒါမှမဟုတ် relative URL တစ်ခုပါ။ ဒါကို configuration file ရဲ့ URL ကို base အဖြစ် သုံးပြီး WHATWG [`URL`][] API နဲ့ parse လုပ်ပါတယ်။ `file:` protocol ကိုပဲ support လုပ်ပါတယ်။ Packages အများအပြား URL တစ်ခုတည်းကို share လုပ်ခွင့် ရှိပြီး — consumers တွေက module instances တွေကို module url ရော **package IDs** ပါ နှစ်ခုလုံးနဲ့ ခွဲခြားသတ်မှတ်ရပါမယ်။
* `dependencies` {Object} Bare specifiers တွေကို package keys တွေဆီကို map လုပ်ပေးတဲ့ object တစ်ခုပါ။ Key တစ်ခုချင်းစီက source code ထဲမှာ သုံးတဲ့ import name ဖြစ်ပြီး — value တစ်ခုချင်းစီက `packages` object ထဲက သက်ဆိုင်တဲ့ package key ဖြစ်ပါတယ်။ Default အနေနဲ့ empty object တစ်ခု ဖြစ်ပါတယ်။

### Resolution algorithm (resolution လုပ်ဆောင်မှု algorithm)

Bare specifier တစ်ခုကို တွေ့လိုက်ရတဲ့အခါ:

1. Node.js က ဘယ် package က resolution request ကို လုပ်ဆောင်မလဲ ဆုံးဖြတ်ပါတယ်။
   * ဖြစ်နိုင်ရင် importer file အတွက် package ID ကို resolution algorithm ဆီ ပေးသင့်ပါတယ်။
   * ဒါမဖြစ်နိုင်ရင် — resolution က file path က ၎င်း၏ `url` ကနေ decode လုပ်ထားတဲ့ package location တစ်ခုခုရဲ့ အတွင်းမှာ ရှိမရှိ စစ်ဆေးပါလိမ့်မယ်။
2. Package ID မပေးထားဘဲ importing file က mapped package တစ်ခုခုရဲ့ အတွင်းမှာလည်း မဟုတ်ဘူးဆိုရင် — [`ERR_PACKAGE_MAP_EXTERNAL_FILE`][] error တစ်ခု throw လုပ်ပါတယ်။
3. Node.js က importing package ရဲ့ `dependencies` object ထဲမှာ specifier ရဲ့ package name ကို ရှာပြီး သက်ဆိုင်တဲ့ package key ကို ရှာဖွေပါတယ်။
4. တွေ့ခဲ့ရင် — resolution algorithm က package map ထဲက package ရဲ့ `url` field ကနေ target package location ကို ရှာဖွေပါတယ်။
5. Specifier က `dependencies` ထဲမှာ မရှိဘူးဆိုရင် `MODULE_NOT_FOUND` error တစ်ခု throw လုပ်ပါတယ်။
6. Package location ကို resolution ပြီးမြောက်အောင် (`index.js`, exports field, စသဖြင့်) ပုံမှန် Node.js resolution algorithm ဆီ ပို့ပေးပါတယ်။

နောက်ထပ် အသေးစိတ်တွေကို [resolution algorithm pseudo-code][] မှာ ကြည့်နိုင်ပါတယ်။

### Package version များစွာ (Multiple package versions)

Package အမျိုးမျိုးက package တစ်ခုတည်းရဲ့ version အမျိုးမျိုးကို မှီခိုနိုင်ပါတယ်။ `dependencies` က bare specifiers တွေကို package keys တွေဆီ map လုပ်တာမို့ — packages နှစ်ခုက specifier တစ်ခုတည်းကို target အမျိုးမျိုးဆီ map လုပ်နိုင်ပါတယ်:

```json
{
  "packages": {
    "app": {
      "url": "./app",
      "dependencies": {
        "component": "component-v2"
      }
    },
    "legacy": {
      "url": "./legacy",
      "dependencies": {
        "component": "component-v1"
      }
    },
    "component-v1": {
      "url": "./vendor/component-1.0.0"
    },
    "component-v2": {
      "url": "./vendor/component-2.0.0"
    }
  }
}
```

`app` ရော `legacy` ပါ `import 'component'` လုပ်နိုင်ပေမယ့် — သူတို့ ကြေညာထားတဲ့ dependencies တွေအပေါ် မူတည်ပြီး path အမျိုးမျိုးဆီကို resolve လုပ်ပါလိမ့်မယ်။

### URL တစ်ခုတည်းအတွက် packages အများအပြား (Multiple packages for the same URL)

ရှုပ်ထွေးတဲ့ hoisting အခြေအနေတွေကို ဖြေရှင်းဖို့ — packages အများအပြား URL တစ်ခုတည်းကို share လုပ်နိုင်ပြီး — ဒါက import တစ်ခု ဘယ် package ကနေ စတင်သလဲ ဆုံးဖြတ်ရာမှာ မရေရာမှု ဖြစ်စေပါတယ်:

```json
{
  "packages": {
    "app-old": {
      "url": "./app-old",
      "dependencies": {
        "lib": "lib-old"
      }
    },
    "app-new": {
      "url": "./app-new",
      "dependencies": {
        "lib": "lib-new"
      }
    },
    "lib-old": {
      "url": "./lib",
      "dependencies": {
        "react": "react-15"
      }
    },
    "lib-new": {
      "url": "./lib",
      "dependencies": {
        "react": "react-18"
      }
    }
  }
}
```

အထက်ပါ ဥပမာထဲမှာ `lib-old` ရော `lib-new` ပါ ကိုယ့် source တွေကို သိမ်းဖို့ `./lib` folder တစ်ခုတည်းကို သုံးပြီး — တစ်ခုတည်းသော ကွာခြားချက်က `require` calls တွေ ဒါမှမဟုတ် `import` သုံးတဲ့အခါ `react` ရဲ့ version ဘယ်ဟာကို ဝင်ရောက်မလဲဆိုတာပဲ ဖြစ်ပါတယ်။

Package entries အများအပြား URL တစ်ခုတည်းကို share လုပ်နေတာမို့ — အဲဒီ URL အတွင်းက file တစ်ခုကနေ bare specifier တစ်ခုကို resolve လုပ်တာက — မူရင်း package ID ကို မသိရဘူးဆိုရင် မရေရာပါဘူး။ Package ID ကို ဆုံးဖြတ်လို့ မရဘူးဆိုရင် (ဥပမာ — caller က အရင် resolution တစ်ခုကနေ ဒါကို ဆက်မပို့လိုက်လို့) — Node.js က ခန့်မှန်းတာ မလုပ်ဘဲ error တစ်ခု throw လုပ်ပါလိမ့်မယ်။

ဒီ pattern ကို support လုပ်ဖို့ — implementers တွေက module instances တွေကို package ID နဲ့ ခွဲခြားသတ်မှတ်ပြီး resolution result တစ်ခုချင်းစီကနေ နောက်ထပ် resolution requests တွေဆီကို ဆက်ပို့ပေးရပါမယ်။ ဒါက `lib` က `react` ကို require လုပ်တဲ့အခါ — request က `lib-old` ကလား `lib-new` ကလား runtime က သိနိုင်ပြီး မှန်ကန်တဲ့ dependency ကို ရွေးချယ်နိုင်စေပါတယ်။

### အခြား resolution များနှင့် အပြန်အလှန် သက်ရောက်မှု (Interaction with other resolution)

Package maps တွေက Node.js builtin modules တွေ မဟုတ်တဲ့ bare specifiers တွေပေါ်မှာပဲ သက်ရောက်ပါတယ်။ အောက်ပါကိစ္စတွေကတော့ package maps ရဲ့ သက်ရောက်မှု မခံရဘဲ — standard resolution ကို ဆက်သုံးပါတယ်:

* Relative paths တွေ ဒါမှမဟုတ် URLs တွေ (`./` ဒါမှမဟုတ် `../`)။
* Absolute paths တွေ ဒါမှမဟုတ် URLs တွေ။
* Node.js builtin modules တွေ (`node:fs`, စသဖြင့်)။

### ကန့်သတ်ချက်များ (Limitations)

* Package maps တွေက static file တစ်ခုတည်း ဖြစ်ရပါမယ် — dynamic configuration ကို support မလုပ်ပါဘူး။
* Package map resolver က circular dependency detection (သံသရာ မှီခိုမှု ရှာဖွေခြင်း) ကို မလုပ်ဆောင်ပါဘူး။
* Package map file ကို startup မှာ synchronously load လုပ်ပါတယ်။

## Node.js ၏ `package.json` field အဓိပ္ပာယ်ဖွင့်ဆိုချက်များ (Node.js package.json field definitions)

ဒီ section က Node.js runtime က သုံးတဲ့ fields တွေကို ဖော်ပြပါတယ်။ [npm](https://docs.npmjs.com/cli/v8/configuring-npm/package-json) လိုမျိုး တခြား tools တွေက ထပ်ဆောင်း fields တွေ သုံးကြပေမယ့် — အဲဒါတွေကို Node.js က လျစ်လျူရှုပြီး ဒီနေရာမှာ မှတ်တမ်းတင်မထားပါဘူး။

`package.json` files တွေထဲမှာ Node.js က သုံးတဲ့ fields တွေကတော့:

* [`"name"`][] - Package အတွင်းမှာ named imports တွေ သုံးတဲ့အခါ သက်ဆိုင်ပါတယ်။ Package managers တွေကလည်း package ရဲ့ name အဖြစ် သုံးပါတယ်။
* [`"main"`][] - Exports မသတ်မှတ်ထားရင် — ပြီးတော့ exports မမိတ်ဆက်ခင် Node.js versions တွေမှာ — package ကို load လုပ်တဲ့အခါ default module ဖြစ်ပါတယ်။
* [`"type"`][] - `.js` files တွေကို CommonJS လား ES modules လား load လုပ်မလဲ ဆုံးဖြတ်ပေးတဲ့ package type ပါ။
* [`"exports"`][] - Package exports တွေနဲ့ conditional exports တွေပါ။ ရှိနေတဲ့အခါ — package အတွင်းကနေ ဘယ် submodules တွေကို load လို့ရမလဲ ကန့်သတ်ပါတယ်။
* [`"imports"`][] - Package imports တွေပါ — package အတွင်းက modules တွေက ကိုယ်တိုင် သုံးဖို့ ဖြစ်ပါတယ်။

### `"name"`

* Type: {string}

```json
{
  "name": "package-name"
}
```

`"name"` field က package ရဲ့ နာမည်ကို သတ်မှတ်ပါတယ်။ _npm_ registry ပေါ်ကို ထုတ်ဝေဖို့ဆိုရင် [certain requirements](https://docs.npmjs.com/files/package.json#name) တွေနဲ့ ကိုက်ညီတဲ့ နာမည်တစ်ခု လိုအပ်ပါတယ်။

`"name"` field ကို [`"exports"`][] field နဲ့အတူ ပေါင်းပြီး — package တစ်ခုကို ၎င်း၏ name သုံးပြီး [self-reference][] လုပ်ဖို့အတွက်လည်း သုံးနိုင်ပါတယ်။

### `"main"`

* Type: {string}

```json
{
  "main": "./index.js"
}
```

`"main"` field က package ကို name နဲ့ `node_modules` lookup ကနေတစ်ဆင့် import လုပ်တဲ့အခါ — package ရဲ့ entry point ကို သတ်မှတ်ပါတယ်။ ၎င်း၏ တန်ဖိုးက path တစ်ခုပါ။

[`"exports"`][] field ရှိနေရင် — package ကို name နဲ့ import လုပ်တဲ့အခါ `"main"` field ထက် ဦးစားပေး အသုံးပြုပါတယ်။

ဒါ့အပြင် [package directory ကို `require()` ကနေ load လုပ်တဲ့အခါ](https://nodejs.org/api/modules.html#folders-as-modules) သုံးမယ့် script ကိုလည်း ဒီ field က သတ်မှတ်ပေးပါတယ်။

```cjs
// This resolves to ./path/to/directory/index.js.
require('./path/to/directory');
```

### `"type"`

* Type: {string}

`"type"` field က အဲဒီ `package.json` file ကို အနီးဆုံး parent အဖြစ် ရှိတဲ့ `.js` files အားလုံးအတွက် Node.js က သုံးမယ့် module format ကို သတ်မှတ်ပါတယ်။

အနီးဆုံး parent `package.json` file ထဲမှာ top-level field `"type"` တန်ဖိုး `"module"` ပါနေရင် `.js` နဲ့ အဆုံးသတ်တဲ့ files တွေကို ES modules အဖြစ် load လုပ်ပါတယ်။

အနီးဆုံး parent `package.json` ဆိုတာက — လက်ရှိ folder ထဲမှာ စတင်ရှာဖွေပြီး အဲဒီ folder ရဲ့ parent၊ ဒီအတိုင်း node\_modules folder ဒါမှမဟုတ် volume root ကို မရောက်မချင်း — အပေါ်တက်လိုက် ရှာတဲ့အခါ ပထမဆုံး တွေ့ရတဲ့ `package.json` ကို ဆိုလိုပါတယ်။

```json
// package.json
{
  "type": "module"
}
```

```bash
# In same folder as preceding package.json
node my-app.js # Runs as ES module
```

အနီးဆုံး parent `package.json` ထဲမှာ `"type"` field မရှိဘူး ဒါမှမဟုတ် `"type": "commonjs"` ပါနေရင် — `.js` files တွေကို [CommonJS][] အဖြစ် သတ်မှတ်ပါတယ်။ Volume root ကို ရောက်တဲ့အထိ `package.json` မတွေ့ရဘူးဆိုရင်လည်း `.js` files တွေကို [CommonJS][] အဖြစ် သတ်မှတ်ပါတယ်။

အနီးဆုံး parent `package.json` ထဲမှာ `"type": "module"` ပါနေရင် — `.js` files တွေရဲ့ `import` statements တွေကို ES modules အဖြစ် သတ်မှတ်ပါတယ်။

```js
// my-app.js, part of the same example as above
import './startup.js'; // Loaded as ES module because of package.json
```

`"type"` field ရဲ့ တန်ဖိုး ဘာပဲဖြစ်ဖြစ် — `.mjs` files တွေကို အမြဲတမ်း ES modules အဖြစ် သတ်မှတ်ပြီး `.cjs` files တွေကို အမြဲတမ်း CommonJS အဖြစ် သတ်မှတ်ပါတယ်။

### `"exports"`

* Type: {Object|string|string\[]}

```json
{
  "exports": "./index.js"
}
```

`"exports"` field က package ကို name နဲ့ import လုပ်တဲ့အခါ — `node_modules` lookup ကနေဖြစ်စေ [self-reference][] ကနေဖြစ်စေ — package ရဲ့ [entry points][] တွေကို သတ်မှတ်ခွင့် ပေးပါတယ်။ [subpath exports][] နဲ့ [conditional exports][] တွေကို သတ်မှတ်နိုင်ပြီး internal unexported modules တွေကို သီးသန့်ပိတ်ဆံ့ထားနိုင်တဲ့ — [`"main"`][] ရဲ့ အစားထိုးတစ်ခုအနေနဲ့ Node.js 12+ မှာ support လုပ်ပါတယ်။

[Conditional Exports][] တွေကိုလည်း `"exports"` အတွင်းမှာ သုံးပြီး — package ကို `require` ကနေ ရည်ညွှန်းလား `import` ကနေ ရည်ညွှန်းလားဆိုတာ အပါအဝင် — environment တစ်ခုချင်းစီအလိုက် မတူညီတဲ့ package entry points တွေ သတ်မှတ်နိုင်ပါတယ်။

`"exports"` ထဲမှာ သတ်မှတ်ထားတဲ့ paths တွေအားလုံးက `./` နဲ့ စတင်တဲ့ relative file URLs တွေ ဖြစ်ရပါမယ်။

### `"imports"`

* Type: {Object}

```json
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```

Imports field ထဲက entries တွေက `#` နဲ့ စတင်တဲ့ strings တွေ ဖြစ်ရပါမယ်။

Package imports တွေက external packages တွေဆီကို mapping လုပ်ခွင့် ပြုပါတယ်။

ဒီ field က လက်ရှိ package အတွက် [subpath imports][] တွေကို သတ်မှတ်ပေးပါတယ်။

[CommonJS]: modules.md
[Conditional exports]: #conditional-exports
[ES module]: esm.md
[ES modules]: esm.md
[Node.js documentation for this section]: https://github.com/nodejs/node/blob/HEAD/doc/api/packages.md#conditions-definitions
[Runtime Keys]: https://runtime-keys.proposal.wintercg.org/
[Syntax detection]: #syntax-detection
[TypeScript]: typescript.md
[WebAssembly modules]: esm.md#wasm-modules
[WinterCG]: https://wintercg.org/
[`"exports"`]: #exports
[`"imports"`]: #imports
[`"main"`]: #main
[`"name"`]: #name
[`"type"`]: #type
[`--conditions` / `-C` flag]: #resolving-user-conditions
[`--experimental-addon-modules`]: cli.md#--experimental-addon-modules
[`--experimental-package-map`]: cli.md#--experimental-package-mappath
[`--no-addons` flag]: cli.md#--no-addons
[`ERR_PACKAGE_MAP_EXTERNAL_FILE`]: errors.md#err_package_map_external_file
[`ERR_PACKAGE_PATH_NOT_EXPORTED`]: errors.md#err_package_path_not_exported
[`ERR_UNKNOWN_FILE_EXTENSION`]: errors.md#err_unknown_file_extension
[`URL`]: url.md#the-whatwg-url-api
[`package.json`]: #nodejs-packagejson-field-definitions
[customization hooks]: module.md#customization-hooks
[entry points]: #package-entry-points
[folders as modules]: modules.md#folders-as-modules
[import maps]: https://github.com/WICG/import-maps
[load ECMAScript modules from CommonJS modules]: modules.md#loading-ecmascript-modules-using-require
[merve]: https://github.com/anonrig/merve
[packages folder mapping]: https://github.com/WICG/import-maps#packages-via-trailing-slashes
[resolution algorithm pseudo-code]: modules.md#all-together
[self-reference]: #self-referencing-a-package-using-its-name
[subpath exports]: #subpath-exports
[subpath imports]: #subpath-imports
[the dual CommonJS/ES module packages section]: #dual-commonjses-module-packages
[the full specifier path]: esm.md#mandatory-file-extensions
[the package examples repository]: https://github.com/nodejs/package-examples
