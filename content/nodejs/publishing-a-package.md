---
title: "Package ထုတ်ဝေခြင်း (Publishing a Package)"
description: "Package တစ်ခုကို ဘယ် module format (CJS/ESM) နဲ့ ရေးပြီး ဘယ်လို distribution ပုံစံတွေနဲ့ ထုတ်ဝေမလဲ — package.json ရဲ့ type/exports fields, ESM wrapper, dual-package hazard နဲ့ ရှောင်ရှားနည်း, gotchas"
order: 58
source: "https://nodejs.org/learn/modules/publishing-a-package"
status: translated
updated: 2026-09-02
---

npm package တစ်ခုကို ထုတ်ဝေတဲ့အခါမှာ သိထားရမယ့် အချက်က — module format နှစ်မျိုး (**CommonJS** နဲ့ **ES modules**) ကြားမှာ ကိုယ့် source code ကို ဘယ် format နဲ့ ရေးမလဲ၊ ပြီးတော့ user တွေဆီကို ဘယ် distribution ပုံစံတွေနဲ့ ဖြန့်မလဲ ဆိုတာပါ။ ဒီ guide က အဲဒီအတွက် package.json configuration ပုံစံမျိုးစုံကို ရှင်းပြထားပြီး — အလုပ်ဖြစ်တဲ့ ဥပမာအပြည့်အစုံကို [nodejs-module-config-examples](https://github.com/JakobJingleheimer/nodejs-module-config-examples) repo မှာ ကြည့်ရှုနိုင်ပါတယ်။ နောက်ခံသမိုင်းနဲ့ ပိုနက်ရှိုင်းတဲ့ ရှင်းလင်းချက်တွေကို စိတ်ဝင်စားရင် Down the rabbit-hole နဲ့ How did we get here section တွေ ပါပါတယ်။

## Format ရွေးချယ်ခြင်း (Pick Your Fix)

Use case အများစုကို အကျုံးဝင်တဲ့ အဓိက option နှစ်ခု ရှိပါတယ်:

- **Source ကို CJS နဲ့ ရေးပြီး CJS အနေနဲ့ ထုတ်ဝေခြင်း** — `require()` သုံးတဲ့ CJS package ကို CJS ရော ESM ရော (Node.js version အားလုံးမှာ) သုံးလို့ ရပါတယ်။
- **Source ကို ESM နဲ့ ရေးပြီး ESM အနေနဲ့ ထုတ်ဝေခြင်း** — `import` သုံးပြီး top-level `await` မသုံးထားတဲ့ ESM package ကိုလည်း ESM ရော CJS ရော သုံးနိုင်ပါတယ် (Node.js 22.x နဲ့ 23.x မှာ — [`require()` နဲ့ ES module ခေါ်ခြင်း](https://nodejs.org/api/modules.html#requireesm) ကို ကြည့်ပါ)။

**Format တစ်မျိုးတည်း (CJS ဖြစ်စေ၊ ESM ဖြစ်စေ) ပဲ ထုတ်ဝေတာ အကောင်းဆုံးပါ။** Format နှစ်မျိုးလုံး ထုတ်ဝေရင် — dual-package hazard အပြင် အခြား အားနည်းချက်တွေပါ ဖြစ်နိုင်ပါတယ်။ အောက်မှာ package author က ဘာ format နဲ့ ရေးလဲ၊ consumer တွေက ဘယ်လို သုံးမလဲ ပေါ်မူတည်ပြီး ရွေးချယ်စရာတွေပါ:

| Author ရဲ့ source | Consumer တွေရဲ့ code | Option |
|---|---|---|
| CJS (`require()`) | ESM: consumer တွေက `import` နဲ့ သုံးမယ် | CJS source + ESM distribution သက်သက် |
| CJS (`require()`) | CJS ရော ESM ရော | CJS source + CJS & ESM distribution နှစ်မျိုးလုံး |
| ESM (`import`) | CJS: consumer တွေက `require()` နဲ့ သုံးမယ် | ESM source + CJS distribution သက်သက် |
| ESM (`import`) | CJS ရော ESM ရော | ESM source + CJS & ESM distribution နှစ်မျိုးလုံး |

## CJS source နဲ့ CJS distribution

အနည်းဆုံး config က `"name"` တစ်ခုတည်းနဲ့တောင် ရပေမယ့် — package ရဲ့ exports တွေကို `"exports"` field နဲ့ ကြေညာထားတာ ပိုရှင်းလင်းပါတယ်။

```json
{
  "name": "cjs-source-and-distribution"
  // "main": "./index.js"
}
```

`packageJson.exports["."] = filepath` ဆိုတာ `packageJson.exports["."].default = filepath` ရဲ့ အတိုကောက် ဖြစ်ပါတယ်။

## ESM source နဲ့ ESM distribution

အပေါ်က CJS–CJS configuration နဲ့ လုံးဝနီးပါး တူပြီး — `"type"` field တစ်ခုပဲ ကွာပါတယ်။ Node.js v23.0.0 ကစပြီး static ESM (top-level `await` မပါတဲ့ code) ကို `require()` လုပ်လို့ ရတာကို သတိပြုပါ။

```json
{
  "name": "esm-source-and-distribution",
  "type": "module"
  // "main": "./index.js"
}
```

Node.js 23.0.0 နဲ့ 22.12.0 ကစပြီး — ESM က CJS နဲ့ "နောက်ပြန်" compatible ဖြစ်လာပါတယ်: CJS module တစ်ခုက ES module ကို flag မလိုဘဲ `require()` လုပ်နိုင်ပါပြီ။

## CJS source နဲ့ ESM distribution သက်သက်

ဒီပုံစံက နည်းနည်း လှည့်ကွက် လိုပါတယ် — ပိုအသစ်တဲ့ standard တွေကို ပစ်မှတ်ထားတဲ့ နှစ်ဟောင်း project တွေ၊ ဒါမှမဟုတ် CJS ကိုပဲ ကြိုက်ပေမယ့် မတူတဲ့ environment အတွက် ထုတ်ဝေနေတဲ့ author တွေအတွက် သင့်တော်ပါတယ်:

```json
{
  "name": "cjs-source-with-esm-distribution",
  "main": "./dist/index.mjs"
}
```

**`.mjs` file extension က အသာစီးယူတဲ့ (trump-card) ကတ်ပါ** — တခြား configuration ဘာပဲ ရှိရှိ ဒီ extension ရှိတဲ့ file ကို ESM အဖြစ် သတ်မှတ်ခံရပါတယ်။ ဒီ extension က မဖြစ်မနေ လိုအပ်တာက — `packageJson.exports.import` က file ကို ESM ဖြစ်စေတာ မဟုတ်ဘူး (အများစုရဲ့ အထင်မှားမှု ဖြစ်ပေမယ့်)၊ အဲဒီ file ကို package import လုပ်တဲ့အခါ သုံးရမယ်လို့ပဲ ညွှန်ပြတာပါ (ESM က CJS ကိုလည်း import လုပ်နိုင်တယ် — အောက်က Gotchas မှာ ကြည့်ပါ)။

## CJS source နဲ့ CJS & ESM distribution နှစ်မျိုးလုံး

Audience နှစ်မျိုးလုံးကို တိုက်ရိုက် ထောက်ပံ့ချင်ရင် option သုံးခု ရှိပါတယ်:

### Named exports တွေကို `exports` ပေါ် တိုက်ရိုက် တွဲခြင်း

`module.exports` တစ်ခုလုံးကို reassign လုပ်မယ့်အစား — ရှိပြီးသား `module.exports` ပေါ်ကို property တွေ ထပ်တွဲတဲ့ နည်းပါ။

- **အားသာချက်** — package size ပေါ့ပါးတယ်၊ ရေးရတာ ရိုးရှင်းတယ်၊ dual-package hazard မဖြစ်နိုင်ဘူး
- **အားနည်းချက်** — တိကျတဲ့ syntax စည်းကမ်းကို လိုက်နာရတယ်

တခါတရံ CJS module က `module.exports` ကို တခြား object (သို့) function တစ်ခုလုံးနဲ့ အစားထိုးတတ်ပါတယ်:

```js
const someObject = {
  foo() {},
  bar() {},
  qux() {},
};

module.exports = someObject;
```

Node.js က CJS ထဲက named exports တွေကို [pattern အချို့ကို ရှာဖွေတဲ့ static analysis](https://github.com/nodejs/cjs-module-lexer) နဲ့ ရှာဖွေတွေ့ရှိပါတယ် — အပေါ်က ဥပမာကတော့ အဲဒီ detection ကို ရှောင်သွားပါတယ်။ Named exports တွေ detectable ဖြစ်အောင် ဒီလို ရေးရပါတယ်:

```js
module.exports.foo = function foo() {};
module.exports.bar = function bar() {};
module.exports.qux = function qux() {};
```

### ESM wrapper အရိုးရှင်းဆုံး သုံးခြင်း

Setup က ရှုပ်ထွေးပြီး ဟန်ချက် ညှိရခက်ပါတယ်။ Bundler ရဲ့ CJS output က Node.js ရဲ့ named exports detection ကို ရှောင်သွားတဲ့အခါ — ESM consumer တွေအတွက် သိထားတဲ့ named exports တွေကို ပြန်ထုတ်ပေးဖို့ ESM wrapper ကို သုံးနိုင်ပါတယ်:

```json
{
  "name": "cjs-with-wrapper-dual-distro",
  "exports": {
    ".": {
      "import": "./dist/esm/wrapper.mjs",
      "require": "./dist/cjs/index.js",
      "default": "./dist/cjs/index.js"
    }
  }
}
```

CJS က object တစ်ခုကို export လုပ်တဲ့အခါ (ဒါက ESM ရဲ့ `default` အနေနဲ့ မြင်ရမယ်) — wrapper ထဲမှာ object ရဲ့ members တွေကို local မှာ သိမ်းပြီး ESM consumer တွေ နာမည်နဲ့ ဝင်ကြည့်လို့ရအောင် ပြန် export လုပ်နိုင်ပါတယ်:

```js
import cjs from '../cjs/index.js';

const { a, b, c /* … */ } = cjs;

export { a, b, c /* … */ };
```

**သတိထားရန်** — ဒါက live bindings ကို ပျက်စေပါတယ်: `cjs.a` ကို ပြန်သတ်မှတ်ရင် `esmWrapper.a` မှာ ထင်ဟပ်မှာ မဟုတ်ပါဘူး။

### Distribution နှစ်ခုလုံး အပြည့်အစုံ ထုတ်ခြင်း

CJS → CJS & ESM option တွေထဲမှာ အဖြစ်အများဆုံးနဲ့ အလွယ်ဆုံး ဖြစ်ပေမယ့် — ဒါတွေအတွက် သင်ပေးဆပ်ရပါတယ်။ **ဒါက ကောင်းတဲ့ ရွေးချယ်မှု ခဲပါတယ်** — package size က နှစ်ဆလောက် ကြီးပြီး dual-package hazard ဖြစ်နိုင်လို့ပါ။

```json
{
  "name": "cjs-with-full-dual-distro",
  "exports": {
    ".": {
      "import": "./dist/esm/index.mjs",
      "require": "./dist/cjs/index.js",
      "default": "./dist/cjs/index.js"
    }
  }
}
```

အစားထိုး နည်းတစ်ခုက — `"default"` နဲ့ `"node"` keys တွေကို သုံးတာပါ: Node.js က `"node"` option ကို အမြဲ ရွေးမယ် (အမြဲ အလုပ်ဖြစ်တယ်)၊ Node.js မဟုတ်တဲ့ tool တွေကတော့ `"default"` ကို ရွေးမယ်။ **ဒါက dual-package hazard ကို ကာကွယ်ပေးပါတယ်:**

```json
{
  "name": "cjs-with-alt-full-dual-distro",
  "exports": {
    ".": {
      "node": "./dist/cjs/index.js",
      "default": "./dist/esm/index.mjs"
    }
  }
}
```

## ESM source နဲ့ CJS distribution သက်သက်

ဒီမှာ `"type": "module"` ကို `.cjs` file extension နဲ့ တွဲသုံးတာ အကောင်းဆုံး ရလဒ်ကို ပေးပါတယ်။ `.js` extension ရှိတဲ့ file တွေကို `package.json` ထဲက `"type"` က ဘယ်လို အနက်ပြန်လဲ ဆိုတာ သတိရပါ — `"type": "commonjs"` + `.js` → CJS၊ `"type": "module"` + `.js` → ESM။ File အားလုံး `.cjs`/`.mjs` extension အတိအကျ သုံးထားရင်တော့ `"type"` က မလိုအပ်တော့ပါဘူး:

```json
{
  "name": "esm-with-cjs-distribution",
  "type": "module",
  "main": "./dist/index.cjs"
}
```

Build tool တိုင်း ဒီပုံစံ output ကို မထုတ်နိုင်ပါဘူး — Rollup က commonjs target နဲ့ အဆင်သင့် compatible output ထုတ်ပေးပြီး၊ Webpack 5.66.0+ က `commonjs-static` output type အသစ်နဲ့ ရပါတယ် (esbuild ကတော့ လောလောဆယ် မရသေးပါဘူး)။

## ESM source နဲ့ CJS & ESM distribution နှစ်မျိုးလုံး

Source ကို JavaScript မဟုတ်တဲ့ ဘာသာစကား (ဥပမာ TypeScript) နဲ့ ရေးတဲ့အခါ — `.ts` လို language-specific extension ကြောင့် `.mjs` နဲ့ ညီမျှတဲ့ ရွေးစရာ မရှိတတ်လို့ options တွေ ကန့်သတ်သွားတတ်ပါတယ်။ CJS source → dual distribution မှာလိုပဲ — option သုံးမျိုး ရှိပါတယ်:

1. **Property exports ပါတဲ့ CJS distribution သက်သက် ထုတ်ဝေခြင်း** — အပေါ်က "CJS source → dual (property exports)" နဲ့ အတူတူပါပဲ၊ `package.json` မှာ `"type": "module"` ပါတာပဲ ကွာပါတယ်။
2. **ESM wrapper ပါတဲ့ CJS distribution ထုတ်ဝေခြင်း** — CJS source → dual (wrapper) နဲ့ ဆင်တူပေမယ့် `"type": "module"` နဲ့ `.cjs` extensions တချို့ ပါဝင်ပါတယ်။
3. **CJS & ESM distribution နှစ်ခုလုံး အပြည့်အစုံ ထုတ်ဝေခြင်း** — package တစ်ခုလုံးကို ESM အဖြစ် သတ်မှတ်ပြီး CJS exports တွေကို `.cjs` extension နဲ့ တိတိကျကျ ခွဲခြားခြင်း:

```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

ဒါမှမဟုတ် `"default"` နဲ့ `"node"` keys ကို သုံးတာလည်း ရပါတယ် (dual-package hazard ကို ကာကွယ်ပေးပါတယ်):

```json
{
  "type": "module",
  "exports": {
    ".": {
      "node": "./dist/index.cjs",
      "default": "./dist/esm/index.js"
    }
  }
}
```

Source file အားလုံးအတွက် `.mjs` (သို့) နဲ့ ညီမျှတဲ့ extension သုံးတာကလည်း နည်းတစ်ခုပါ — config ကတော့ "CJS source → dual" နဲ့ အတူတူပါပဲ။

> **Node.js 12.22.x ထက် နိမ့်တဲ့ versions**: မလုပ်သင့်ပါဘူး — Node.js 12.x ထက် နိမ့်တဲ့ versions တွေက End of Life ဖြစ်ပြီး security အန္တရာယ် ကြီးကြီးမားမား ရှိပါတယ်။

## အထွေထွေ မှတ်ချက်များ (General Notes)

- Syntax detection က တကယ့် package configuration ရဲ့ **အစားထိုး မဟုတ်ပါဘူး** — detection က fool-proof မဟုတ်သလို performance cost လည်း သိသိသာသာ ရှိပါတယ်။
- `"exports"` သုံးတဲ့အခါ `"./package.json": "./package.json"` ကိုပါ ထည့်ထားတာ ယေဘုယျအားဖြင့် ကောင်းပါတယ် — package.json ကို import လုပ်လို့ရအောင်ပါ။
- `"exports"` က `"main"` ထက် သာတာက — package ရဲ့ internal code တွေကို ပြင်ပက လှမ်းသုံးလို့ မရအောင် တားဆီးပေးလို့ပါ (user တွေ မသုံးသင့်တဲ့အရာတွေကို မမှီခိုအောင် သေချာစေတယ်)။ ဒီလို မလိုအပ်ရင်တော့ `"main"` က ပိုရိုးရှင်းပြီး ပိုသင့်တော်နိုင်ပါတယ်။
- `"engines"` field က package က Node.js version ဘယ်လောက်တွေနဲ့ အလုပ်လုပ်လဲ ဆိုတာကို လူရော machine ရော နားလည်လွယ်တဲ့ ပုံစံနဲ့ ဖော်ပြပါတယ် — package manager အပေါ်မူတည်ပြီး consumer ရဲ့ Node.js version မကိုက်ရင် install လုပ်တဲ့အခါ exception ထွက်ပြီး fail ဖြစ်စေနိုင်ပါတယ်။ ဒီ field ထည့်ထားတာက version ဟောင်း သုံးနေတဲ့ consumer တွေရဲ့ ခေါင်းကိုက်မှုကို အများကြီး သက်သာစေပါတယ်။

## Dual-Package Hazard ဆိုတာ

CJS ရော ESM ရော source နှစ်မျိုးလုံး ထောက်ပံ့တဲ့ package ကို application တစ်ခုက သုံးနေတဲ့အခါ — package ရဲ့ instance နှစ်ခုလုံး load ဖြစ်သွားရင် bug တချို့ ဖြစ်နိုင်ခြေ ရှိပါတယ်။ `const pkgInstance = require('pkg')` နဲ့ ရတဲ့ instance က `import pkgInstance from 'pkg'` (ဒါမှမဟုတ် `'pkg/module'` လို တခြား main path) နဲ့ ရတဲ့ instance နဲ့ **အတူတူ မဟုတ်လို့ပါ**။ ဒါကို **dual package hazard** လို့ ခေါ်ပြီး — runtime environment တစ်ခုတည်းထဲမှာ package တစ်ခုရဲ့ instance နှစ်ခု တစ်ပြိုင်နက် load ဖြစ်တာပါ။ Application က နှစ်မျိုးလုံးကို တမင်တကာ load လုပ်ဖို့ မဖြစ်နိုင်ပေမယ့် — application က တစ်မျိုး load လုပ်နေတုန်း application ရဲ့ dependency တစ်ခုက နောက်တစ်မျိုး load လုပ်တာ အဖြစ်များပါတယ်။ Node.js က CJS နဲ့ ESM ရောနှော သုံးလို့ရတာမို့ ဒီ hazard ဖြစ်နိုင်ပြီး — မမျှော်လင့်တဲ့ ရှုပ်ထွေးတဲ့ အပြုအမူတွေ ဖြစ်စေနိုင်ပါတယ်။

ဥပမာ — package ရဲ့ အဓိက export က constructor ဆိုရင် instance နှစ်ခုကြား `instanceof` စစ်ရင် `false` ပြန်ပြီး — export က object ဆိုရင် တစ်ဖက်မှာ ထည့်လိုက်တဲ့ property (ဥပမာ `pkgInstance.foo = 3`) က တစ်ဖက်မှာ မရှိပါဘူး။ Package က stateful ဖြစ်နေရင် — CJS နဲ့ ESM distribution နှစ်ခုလုံး သုံးမိရင် parallel states နှစ်ခု ဖြစ်နေတတ်ပြီး (ဒါက မရည်ရွယ်ဘဲ ဖြစ်တာပါ)။

## Gotchas — `"type"` field ကို မှားသုံးခြင်း

`package.json` ရဲ့ `"type"` field က `.js` extension ရဲ့ အဓိပ္ပာယ်ကို `commonjs` (သို့) ES `module` အဖြစ် ပြောင်းလဲပေးပါတယ်။ CJS ရော ESM ရော ရောနှောပါတဲ့ package တွေမှာ ဒီ field ကို မှားသုံးတာ အလွန် အဖြစ်များပါတယ်:

```json
{
  "type": "module",
  "main": "./dist/CJS/index.js",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "default": "./dist/cjs/index.js"
    },
    "./package.json": "./package.json"
  }
}
```

ဒါက **အလုပ်မဖြစ်ပါဘူး** — `"type": "module"` ကြောင့် `packageJson.main`၊ `packageJson.exports["."].require` နဲ့ `packageJson.exports["."].default` တွေကို ESM အဖြစ် အနက်ပြန်ခံရပြီး (သူတို့က တကယ်တော့ CJS file တွေပါ)။

`"type": "module"` ကို ချန်လိုက်ရင်တော့ ပြောင်းပြန် ပြဿနာ ဖြစ်ပါတယ်:

```json
{
  "main": "./dist/CJS/index.js",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "default": "./dist/cjs/index.js"
    },
    "./package.json": "./package.json"
  }
}
```

ဒါက **အလုပ်မဖြစ်ပါဘူး** — `packageJson.exports["."].import` ကို CJS အဖြစ် အနက်ပြန်ခံရလို့ပါ (အဲဒါက တကယ်တော့ ESM file ပါ)။
