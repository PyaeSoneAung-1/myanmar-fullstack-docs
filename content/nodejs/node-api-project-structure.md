---
title: "Node-API Project တစ်ခုရဲ့ ဖွဲ့စည်းပုံ (Anatomy of a Node-API Project)"
description: "node-addon-api project တိုင်းမှာ တူညီတဲ့ ဖွဲ့စည်းပုံ — API level ရွေးချယ်ခြင်း (C API vs node-addon-api), directory layout, package.json နဲ့ gypfile, binding.gyp, lib/binding.js"
order: 74
source: "https://nodejs.org/learn/node-api/getting-started/project-structure"
status: translated
updated: 2026-09-02
---

Code တွေ မရေးခင် — `node-addon-api` project တိုင်းမှာ တူညီတဲ့ ဖိုင်တွေနဲ့ တည်ဆောက်ပုံ (layout) ကို နားလည်ထားတာက အထောက်အကူ ဖြစ်ပါတယ်။ ဒီ guides ထဲက N-API ဥပမာ အားလုံးက ဒီ structure အတိုင်းပဲ လိုက်နာတာမို့ — ဒီ page မှာ တစ်ခါတည်း ရှင်းပြထားပြီး — ကျန်တဲ့ tutorial တွေက တစ်ခုချင်းစီရဲ့ ထူးခြားချက်ကိုပဲ အာရုံစိုက်နိုင်အောင် လုပ်ထားပါတယ်။

## API အဆင့် ရွေးချယ်ခြင်း (Choosing an API Level)

Node-API က အဆင့် နှစ်မျိုးမှာ အလုပ်လုပ်ပါတယ်:

- **C API** — Node.js ထဲမှာ တိုက်ရိုက် built-in ဖြစ်ပြီး [Node.js API pages](https://nodejs.org/api/n-api.html) မှာ အပြည့်အစုံ မှတ်တမ်းတင်ထားပါတယ်။ Extra dependency တွေ မလိုဘဲ အပြည့်အဝ ထိန်းချုပ်ခွင့် ပေးပါတယ်။
- **C++ wrapper (`node-addon-api`)** — C API ကို idiomatic C++ object model တစ်ခုအဖြစ် wrap လုပ်ပေးတဲ့ npm package ပါ။ Project အများစုအတွက် အကြံပြုထားတာက ဒါပါ — boilerplate (ထပ်ခါထပ်ခါ ရေးရတဲ့ code) တွေ သိသိသာသာ ဖယ်ရှားပေးပြီး Node-API ရဲ့ ABI-stability guarantee အပြည့်အဝကို ထိန်းသိမ်းပေးပါတယ်။

ဒီ section ထဲက tutorial တွေက `node-addon-api` ကို သုံးပါတယ်။

> Node-API က လက်ရှိ ထောက်ပံ့နေတဲ့ Node.js releases အားလုံးမှာ stable ဖြစ်ပါတယ်။ အတွေ့အကြုံ အကောင်းဆုံး ရဖို့ [Active LTS ဒါမှမဟုတ် Maintenance LTS release](https://nodejs.org/en/about/releases/) တစ်ခုကို သုံးပါ။ ကိုယ့် machine ပေါ်က Node.js version ကို `node -v` နဲ့ စစ်ကြည့်နိုင်ပါတယ်။

## Directory Layout

```
.
├── binding.gyp        # node-gyp က C/C++ source တွေကို ဘယ်လို compile လုပ်ရမယ်ဆိုတာ ပြောပြတယ်
├── build/             # compile လုပ်ပြီး ထွက်လာတဲ့ output (အလိုအလျောက် ထုတ်ပေးတာ)
├── lib/
│   └── binding.js     # compile ပြီးသား binary ကို load လုပ်တဲ့ JavaScript အလွှာ
├── node_modules/
├── src/
│   └── *.cc / *.h     # သင့်ရဲ့ C/C++ implementation
├── test/
│   └── *.js           # test code
├── package.json
└── package-lock.json
```

## package.json

`package.json` ထဲက entry နှစ်ခုက native addons အတွက် သီးသန့် ဖြစ်ပါတယ်။

### `node-addon-api` dependency

```json
"dependencies": {
  "node-addon-api": "^8.0.0"
}
```

[`node-addon-api`](https://github.com/nodejs/node-addon-api) က Node.js ထဲမှာ built-in ဖြစ်တဲ့ C API အပေါ်မှာ C++ wrapper တစ်ခု ထပ်ဖြည့်ပေးပါတယ်။ JavaScript objects တွေကို C++ ကနေ ဖန်တီး၊ ခြယ်လှယ်တာတွေကို ရိုးရှင်းစေပြီး — သင်က wrap လုပ်နေတဲ့ အောက်ခံ library က C နဲ့ ရေးထားတာပဲ ဖြစ်ဖြစ် အသုံးဝင်ပါတယ်။

### `"gypfile": true`

```json
"gypfile": true
```

ဒါက npm ကို — package က native compilation အဆင့် လိုအပ်တယ်ဆိုတာ ပြောပြပါတယ်။ npm က ဒီ entry ကို တွေ့တဲ့အခါ — သူ့မှာ ပါဝင်တဲ့ `node-gyp` copy ကို အလိုအလျောက် ခေါ်ပြီး — `binding.gyp` ကို ဖတ်ကာ binary ကို တည်ဆောက်ပေးပါတယ်။

## binding.gyp

`binding.gyp` က [GYP](https://gyp.gsrc.io/) file တစ်ခုဖြစ်ပြီး — သင့်ရဲ့ C/C++ code တွေကို ဘယ်လို compile လုပ်ပြီး link လုပ်ရမယ်ဆိုတာ ဖော်ပြပါတယ်။ နာမည်ကို အတိအကျ `binding.gyp` လို့ပဲ ပေးရပါမယ်။

[GYP](https://gyp.gsrc.io/) (Generate Your Projects) က Windows, macOS, Linux တွေမှာ အလုပ်လုပ်တဲ့ build description တစ်ခုတည်းကို ရေးလို့ရအောင် လုပ်ပေးပါတယ်။ [`node-gyp`](https://github.com/nodejs/node-gyp) က ဒီ file ကို ဖတ်ပြီး — platform နဲ့ ကိုက်ညီတဲ့ build files တွေ (Windows မှာ MSVC project, Linux မှာ Makefile, macOS မှာ Xcode project) ကို ထုတ်ပေးကာ — compiler ကို ခေါ်ယူပါတယ်။

`node-addon-api` project တစ်ခုအတွက် အနည်းဆုံး `binding.gyp` ကတော့ ဒီလိုပါ:

```json
{
  "targets": [
    {
      "target_name": "my_addon",
      "sources": ["src/my_addon.cc"],
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"]
    }
  ]
}
```

GYP format အပြည့်အစုံကို [GYP User Documentation](https://gyp.gsrc.io/docs/UserDocumentation.md) မှာ မှတ်တမ်းတင်ထားပါတယ်။

## lib/binding.js

`lib/` directory ထဲမှာ — compile ပြီးသား binary ကို load လုပ်ပြီး ပြန် export လုပ်ပေးတဲ့ ပါးလွှာတဲ့ (thin) JavaScript wrapper တစ်ခု ထားရှိပါတယ်။ ဒီအလွှာက binary-loading logic တွေကို တစ်နေရာတည်းမှာ ထားပေးပြီး — JavaScript ဘက်က validation ဒါမှမဟုတ် အဆင်ပြေစေမယ့် convenience methods တွေ ထည့်ဖို့ သဘာဝကျတဲ့ နေရာတစ်ခုလည်း ဖြစ်ပါတယ်။

ပုံမှန် `binding.js` တစ်ခုက [`bindings`](https://www.npmjs.com/package/bindings) package ကို သုံးပြီး — platform မရွေး `.node` file ရဲ့ path ကို ရှာဖွေပေးပါတယ်:

```cjs
'use strict';
const addon = require('bindings')('my_addon');
module.exports = addon;
```

> npm နဲ့ package တွေကို globally install လုပ်ရာမှာ `Error: EACCES: permission denied` မျိုး ကြုံရရင် — [`nvm`](https://github.com/nvm-sh/nvm) ကို သုံးပြီး Node.js installation ကို စီမံပါ။ nvm နဲ့ဆိုရင် global installs တွေက ကိုယ့်ရဲ့ home directory ထဲကို ရောက်သွားပြီး — `sudo` ဘယ်တော့မှ မလိုပါဘူး။
