---
title: "npm အခြေခံ"
description: "npm ဆိုတာ ဘာလဲ၊ npm init နဲ့ package.json၊ npm install (dependencies/devDependencies)၊ npm scripts၊ npx နဲ့ အသုံးများတဲ့ commands"
order: 5
source: "https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager"
status: translated
updated: 2026-09-01
---

## npm ဆိုတာ ဘာလဲ

**npm** (Node Package Manager) က Node.js ရဲ့ standard package manager ပါ။ Project အတွက် လိုအပ်တဲ့ **dependencies** (library, package လို့ခေါ်တဲ့ အဆင်သင့် code အပိုင်းအစတွေ) တွေကို install, update, manage လုပ်ပေးပါတယ်။ Package တွေက **npm registry** — package တွေ သိမ်းဆည်းထားတဲ့ ကြီးမားတဲ့ online repository — ကနေ download လုပ်ရပါတယ်။ Registry မှာ package နှစ်သန်းကျော် ရှိတာမို့ — လိုအပ်တဲ့ အရာအများစုအတွက် package ရှိတယ်လို့ ဆိုလို့ရပါတယ်။ ကိုယ်တိုင် library ရေးစရာမလိုဘဲ အခြားသူတွေ ရေးပြီးသား၊ စမ်းသပ်ပြီးသား code တွေကို ချက်ချင်း သုံးလို့ရတာက npm ရဲ့ အဓိက အားသာချက်ပါ။ Frontend JavaScript မှာလည်း အသုံးများပြီး **Yarn** နဲ့ **pnpm** က npm ရဲ့ နာမည်ကြီး အခြားရွေးချယ်စရာတွေပါ။ npm က Node.js install လုပ်တာနဲ့အတူ ပါလာပါတယ် — [Node.js မိတ်ဆက်](/docs/nodejs/getting-started) မှာ ကြည့်နိုင်ပါတယ်။

## npm init နဲ့ package.json

Project အသစ်တစ်ခုမှာ npm သုံးဖို့ **`package.json`** file ရှိဖို့ လိုပါတယ် — project ရဲ့ အချက်အလက်တွေ (name, version, scripts, dependencies) ကို သိမ်းထားတဲ့ file ပါ:

```bash
npm init -y
```

`npm init` က `package.json` ကို ဖန်တီးပေးပြီး — `-y` flag ဆိုရင် မေးခွန်းတွေ ကျော်ပြီး default နဲ့ ချက်ချင်း ဖန်တီးပေးပါတယ်။ ရလာတဲ့ `package.json` ထဲမှာ name, version, main စတဲ့ အချက်အလက်တွေ ပါပြီး — scripts တွေကို ဒီလိုမျိုး ထည့်လို့ရပါတယ်:

```json
{
  "scripts": {
    "start-dev": "node lib/server-development",
    "start": "node lib/server-production"
  }
}
```

## npm install — dependencies နဲ့ devDependencies

Project ရဲ့ dependency တွေကို install လုပ်ဖို့ `npm install` ကို သုံးပါတယ်:

```bash
npm install express          # dependencies ထဲ ထည့်ပြီး install
npm install --save-dev jest  # devDependencies ထဲ ထည့်ပြီး install
npm install -g nodemon       # system တစ်ခုလုံးအတွက် global install
```

- `npm install` (package name မပါဘဲ) က `package.json` ထဲက dependency အားလုံးကို **`node_modules`** folder ထဲ install လုပ်ပေးပါတယ် (folder မရှိရင်လည်း အလိုအလျောက် ဖန်တီးပေးပါတယ်)။
- **`dependencies`** — production မှာပါ လိုအပ်တဲ့ package တွေ
- **`devDependencies`** — testing library လိုမျိုး development tool တွေ (production မှာ မပါပါဘူး) — `--save-dev` (အတိုကောက် `-D`) နဲ့ ထည့်ပါတယ်
- **`npm install -g`** — command line tool တွေလို global install လုပ်ချင်တဲ့အခါ သုံးပါတယ်

Version တိတိကျကျ လိုချင်ရင် `npm install <package-name>@<version>` လို့ သတ်မှတ်နိုင်ပြီး — npm က **semver (semantic versioning)** စံနှုန်းနဲ့ version တွေကို စီမံပါတယ်။ Install လုပ်တိုင်း **`package-lock.json`** မှာ install ဖြစ်တဲ့ version အတိအကျတွေ မှတ်တမ်းတင်သွားလို့ — team ထဲက လူတိုင်း version တူတူပဲ သုံးနေတာ သေချာစေပြီး install ပြန်လုပ်တိုင်း တူညီတဲ့ result ရပါတယ်။

## npm scripts နဲ့ အသုံးများတဲ့ commands

ထပ်ခါထပ်ခါ ရိုက်ရတဲ့ command တွေကို `package.json` ရဲ့ **`scripts`** ထဲမှာ နာမည်ပေးပြီး သိမ်းထားလို့ရပါတယ် — အပေါ်က `"start"` လိုမျိုး သတ်မှတ်ထားတာတွေကို `npm run <task-name>` နဲ့ ခေါ်ပါတယ်။ **`npx`** ကတော့ package ကို install မလုပ်ဘဲ run ကြည့်ဖို့ သုံးပါတယ် — CLI tool တွေကို တစ်ခါသုံးချင်တဲ့အခါ အဆင်ပြေပါတယ်:

```bash
npm run start          # scripts ထဲက task တစ်ခုကို run ခြင်း
npm run start-dev
npm update             # version constraint နဲ့ ကိုက်တဲ့ latest version တွေဆီ update
npm update express     # package တစ်ခုချင်းစီ update
npm uninstall express  # package ဖြုတ်ခြင်း
npx cowsay hello       # package install မလုပ်ဘဲ run ကြည့်ခြင်း
```

## ဆက်ဖတ်ရန်

- [Modules အခြေခံ](/docs/nodejs/modules) — install လုပ်ထားတဲ့ package တွေကို module အနေနဲ့ သုံးခြင်း
- [File System](/docs/nodejs/file-system) — file operations တွေနဲ့ path ကိုင်တွယ်ခြင်း
- [Node.js မိတ်ဆက်](/docs/nodejs/getting-started) — Node.js အခြေခံ
