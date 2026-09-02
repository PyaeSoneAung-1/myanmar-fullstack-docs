---
title: "Declaration Files များ ဖြန့်ချိခြင်း (Publishing)"
description: "သင့် d.ts files တွေကို npm ပေါ် ဖြန့်ချိနည်း — npm package ထဲ bundle လုပ်ခြင်း၊ dependencies သတ်မှတ်ခြင်း၊ typesVersions version ရွေးချယ်မှု၊ DefinitelyTyped/@types သို့ publish လုပ်ခြင်း"
order: 24
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html"
status: translated
updated: 2026-09-02
---

ဒီ guide ရဲ့ အဆင့်တွေအတိုင်း declaration file တစ်ခုကို ရေးသားပြီးသွားပြီဆိုရင် — အခုတော့ အဲဒါကို npm ပေါ်ကို publish (ဖြန့်ချိ) လုပ်ဖို့ အချိန်ကျပါပြီ။ သင့် declaration files တွေကို npm ပေါ်ကို publish လုပ်ဖို့ နည်းလမ်း အဓိက နှစ်မျိုး ရှိပါတယ်:

1. သင့် npm package နဲ့အတူ bundle (ထည့်သွင်း) လုပ်ခြင်း
2. npm ပေါ်က [@types organization](https://www.npmjs.com/~types) ဆီ publish လုပ်ခြင်း

သင့် types တွေက သင့် source code ကနေ ထုတ်ပေးတာဆိုရင် — types တွေကို source code နဲ့အတူ publish လုပ်ပါ။ TypeScript ရော JavaScript ရော project နှစ်မျိုးလုံးက [`declaration`](https://www.typescriptlang.org/tsconfig#declaration) compiler option ကနေတစ်ဆင့် types တွေ ထုတ်ပေးနိုင်ပါတယ်။

အဲဒီလို မဟုတ်ရင်တော့ — types တွေကို DefinitelyTyped ဆီ တင်သွင်းဖို့ (submit) အကြံပြုပါတယ်။ DefinitelyTyped က အဲဒါတွေကို npm ပေါ်က `@types` organization ဆီ publish လုပ်ပေးပါလိမ့်မယ်။

## သင့် npm package ထဲမှာ declarations များ ထည့်သွင်းခြင်း

သင့် package မှာ main `.js` file ရှိတယ်ဆိုရင် — သင့် `package.json` file ထဲမှာ main declaration file ကိုပါ ညွှန်ပြထားဖို့ လိုအပ်ပါတယ်။ Bundle လုပ်ထားတဲ့ declaration file ကို ညွှန်ပြဖို့ `types` property ကို သတ်မှတ်ပါ။ ဥပမာ:

```json
{
  "name": "awesome",
  "author": "Vandelay Industries",
  "version": "1.0.0",
  "main": "./lib/main.js",
  "types": "./lib/main.d.ts"
}
```

`"typings"` field က `types` နဲ့ အဓိပ္ပါယ်တူညီပြီး — အဲဒါကိုလည်း သုံးနိုင်ပါတယ်ဆိုတာ သတိပြုပါ။

## Dependencies (မှီခိုမှုများ)

Dependencies အားလုံးကို npm က စီမံပေးပါတယ်။ သင်မှီခိုနေရတဲ့ declaration packages တွေ အားလုံးကို သင့် `package.json` ထဲက `"dependencies"` section မှာ မှန်ကန်စွာ မှတ်သားထားဖို့ သေချာစေပါ။ ဥပမာ — Browserify နဲ့ TypeScript ကို သုံးတဲ့ package တစ်ခု ရေးထားတယ် ဆိုပါစို့။

```json
{
  "name": "browserify-typescript-extension",
  "author": "Vandelay Industries",
  "version": "1.0.0",
  "main": "./lib/main.js",
  "types": "./lib/main.d.ts",
  "dependencies": {
    "browserify": "latest",
    "@types/browserify": "latest",
    "typescript": "next"
  }
}
```

ဒီမှာ ကျွန်တော်တို့ရဲ့ package က `browserify` နဲ့ `typescript` packages တွေပေါ် မှီခိုနေပါတယ်။ `browserify` က သူ့ရဲ့ declaration files တွေကို သူ့ npm packages တွေနဲ့အတူ bundle မလုပ်ပေးတာမို့ — သူ့ရဲ့ declarations တွေအတွက် `@types/browserify` ကို မှီခိုဖို့ လိုအပ်ပါတယ်။ `typescript` ကတော့ သူ့ရဲ့ declaration files တွေကို package လုပ်ပေးတာမို့ — နောက်ထပ် dependencies တွေ မလိုအပ်ပါဘူး။

ကျွန်တော်တို့ရဲ့ package က အဲဒီ package တစ်ခုချင်းစီကနေ declarations တွေကို expose (ထုတ်ဖော်) လုပ်ထားတာမို့ — `browserify-typescript-extension` ရဲ့ user တိုင်းမှာလည်း ဒီ dependencies တွေ ရှိထားဖို့ လိုအပ်ပါတယ်။ အဲဒါကြောင့် `"devDependencies"` မဟုတ်ဘဲ `"dependencies"` ကို သုံးထားတာပါ — မဟုတ်ရင် ကျွန်တော်တို့ရဲ့ consumers (သုံးစွဲသူများ) က အဲဒီ packages တွေကို ကိုယ်တိုင် manual နဲ့ install လုပ်နေရမှာမို့ပါ။ ဒါက library အနေနဲ့ သုံးခံရဖို့ မဟုတ်ဘဲ — command line application တစ်ခုပဲ ရေးထားတာဆိုရင်တော့ `devDependencies` ကို သုံးလို့ရပါတယ်။

## Red flags (သတိထားရမည့် အချက်များ)

### `/// <reference path="..." />`

သင့် declaration files တွေထဲမှာ `/// <reference path="..." />` ကို _မသုံးပါနဲ့_။

```ts
/// <reference path="../typescript/lib/typescriptServices.d.ts" />
....
```

အဲဒီအစား `/// <reference types="..." />` ကိုတော့ _သုံးပါ_။

```ts
/// <reference types="typescript" />
....
```

အသေးစိတ် အချက်အလက်တွေအတွက် [Consuming dependencies](https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html#consuming-dependencies) section ကို ပြန်လည် သွားကြည့်ဖို့ သေချာစေပါ။

### မှီခိုနေသော declarations များကို package လုပ်ခြင်း

သင့် type definitions တွေက အခြား package တစ်ခုပေါ် မှီခိုနေတယ်ဆိုရင်:

- သင့်ဟာနဲ့ ပေါင်းစပ် (combine) မလုပ်ပါနဲ့ — တစ်ခုချင်းစီကို သူ့ဖိုင် သူ့ထဲမှာပဲ ထားပါ။
- သင့် package ထဲကို အဲဒီ declarations တွေ copy (ကူးယူ) ထည့်တာလည်း မလုပ်ပါနဲ့။
- သူ့ရဲ့ declaration files တွေကို package မလုပ်ထားဘူးဆိုရင် — npm ပေါ်က type declaration package ကိုတော့ _မှီခိုပါ_။

## `typesVersions` ဖြင့် version ရွေးချယ်ခြင်း

TypeScript က `package.json` file တစ်ခုကို ဖွင့်ပြီး ဘယ် files တွေ ဖတ်ရမလဲ ဆုံးဖြတ်တဲ့အခါ — ပထမဆုံး `typesVersions` လို့ခေါ်တဲ့ field ကို ကြည့်ပါတယ်။

#### Folder redirects (`*` ကို သုံးခြင်း)

`typesVersions` field ပါတဲ့ `package.json` တစ်ခုက ဒီလိုပုံ ရှိနိုင်ပါတယ်:

```json
{
  "name": "package-name",
  "version": "1.0.0",
  "types": "./index.d.ts",
  "typesVersions": {
    ">=3.1": { "*": ["ts3.1/*"] }
  }
}
```

ဒီ `package.json` က TypeScript ကို — လက်ရှိ TypeScript version ကို အရင်ဆုံး စစ်ဖို့ ပြောပါတယ်။ Version က 3.1 ဒါမှမဟုတ် နောက်ပိုင်းဆိုရင် — TypeScript က သင် import လုပ်ထားတဲ့ path ကို package နဲ့ ဆက်စပ်ပြီး တွက်ထုတ်ကာ package ရဲ့ `ts3.1` folder ကနေ ဖတ်ပါတယ်။

ဒါက `{ "*": ["ts3.1/*"] }` ရဲ့ အဓိပ္ပါယ်ပါ — [path mapping](https://www.typescriptlang.org/tsconfig#paths) နဲ့ ရင်းနှီးပြီးသားဆိုရင် အဲဒီအတိုင်းပဲ အလုပ်လုပ်တယ်လို့ နားလည်နိုင်ပါတယ်။

အပေါ်က ဥပမာမှာ — TypeScript 3.1 မှာ run နေချိန် `"package-name"` ကနေ import လုပ်မယ်ဆိုရင် TypeScript က `[...]/node_modules/package-name/ts3.1/index.d.ts` (နဲ့ အခြား သက်ဆိုင်တဲ့ paths) ကနေ resolve လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ `package-name/foo` ကနေ import လုပ်ရင်တော့ — `[...]/node_modules/package-name/ts3.1/foo.d.ts` နဲ့ `[...]/node_modules/package-name/ts3.1/foo/index.d.ts` တွေကို ရှာဖို့ ကြိုးစားပါလိမ့်မယ်။

ဒီ ဥပမာမှာ သင်က TypeScript 3.1 မှာ run မနေဘူးဆိုရင်ကော? `typesVersions` ထဲက field တစ်ခုမှ မကိုက်ညီဘူးဆိုရင် — TypeScript က `types` field ဆီကို ပြန်ကျ (fall back) သွားပါတယ်။ ဒါကြောင့် ဒီနေရာမှာ TypeScript 3.0 နဲ့ အစောပိုင်း version တွေက `[...]/node_modules/package-name/index.d.ts` ဆီကို redirect လုပ်ခံရပါလိမ့်မယ်။

#### File redirects

တစ်ကြိမ်မှာ file တစ်ခုတည်းအတွက်ပဲ resolution ကို ပြောင်းချင်တယ်ဆိုရင် — filename အတိအကျ (exact) တွေကို ထည့်ပေးပြီး အဲဒီ file ကို မတူညီတဲ့နည်းနဲ့ resolve လုပ်ဖို့ TypeScript ကို ပြောနိုင်ပါတယ်:

```json
{
  "name": "package-name",
  "version": "1.0.0",
  "types": "./index.d.ts",
  "typesVersions": {
    "<4.0": { "index.d.ts": ["index.v3.d.ts"] }
  }
}
```

TypeScript 4.0 နဲ့ အထက်မှာ `"package-name"` အတွက် import တစ်ခုက `./index.d.ts` ဆီ resolve ဖြစ်မှာဖြစ်ပြီး — 3.9 နဲ့ အောက် version တွေမှာတော့ `./index.v3.d.ts` ဆီ resolve ဖြစ်ပါလိမ့်မယ်။

Redirections တွေက package တစ်ခုရဲ့ _external_ (ပြင်ပ) API ကိုပဲ သက်ရောက်မှုရှိပြီး — project တစ်ခုအတွင်းက import resolution တွေကိုတော့ `typesVersions` က သက်ရောက်မှု မရှိဘူးဆိုတာ သတိပြုပါ။ ဥပမာ — အပေါ်က ဥပမာထဲက `d.ts` file တစ်ခုမှာ `import * as foo from "./index"` ပါရင် — အဲဒါက `index.v3.d.ts` မဟုတ်ဘဲ `index.d.ts` ကိုပဲ map ဖြစ်ဦးမှာပါ။ ဒါပေမယ့် အခြား package တစ်ခုက `import * as foo from "package-name"` လို့ import လုပ်ရင်တော့ `index.v3.d.ts` ကို ရရှိမှာ ဖြစ်ပါတယ်။

## Matching အပြုအမူ

Compiler နဲ့ language ရဲ့ version တစ်ခု ကိုက်ညီမှု ရှိ/မရှိကို TypeScript က ဆုံးဖြတ်တဲ့ နည်းလမ်းကတော့ — Node ရဲ့ [semver ranges](https://github.com/npm/node-semver#ranges) ကို သုံးခြင်းပါ။

## Fields အများအပြား

`typesVersions` က fields အများအပြားကို ထောက်ပံ့ပေးနိုင်ပြီး — field name တစ်ခုချင်းစီကို match လုပ်ရမယ့် range နဲ့ သတ်မှတ်ပါတယ်။

```json
{
  "name": "package-name",
  "version": "1.0",
  "types": "./index.d.ts",
  "typesVersions": {
    ">=3.2": { "*": ["ts3.2/*"] },
    ">=3.1": { "*": ["ts3.1/*"] }
  }
}
```

Ranges တွေက ထပ်နေနိုင်ခြေ ရှိတာမို့ — ဘယ် redirect ကို သုံးမလဲ ဆုံးဖြတ်တာက order (အစီအစဉ်) ပေါ်မှာ မူတည်ပါတယ်။ ဆိုလိုတာက — အပေါ်က ဥပမာမှာ `>=3.2` ရော `>=3.1` ရော matcher နှစ်ခုစလုံးက TypeScript 3.2 နဲ့ အထက်ကို ထောက်ပံ့ပေးနိုင်ပေမယ့် — order ကို ပြောင်းပြန်လှန်လိုက်ရင် အပြုအမူ ကွဲပြားသွားနိုင်ပါတယ်။ ဒါကြောင့် အပေါ်က sample က အောက်က ဥပမာနဲ့ ညီမျှမှာ မဟုတ်ပါဘူး။

```jsonc
{
  "name": "package-name",
  "version": "1.0",
  "types": "./index.d.ts",
  "typesVersions": {
    // NOTE: this doesn't work!
    ">=3.1": { "*": ["ts3.1/*"] },
    ">=3.2": { "*": ["ts3.2/*"] }
  }
}
```

## [@types](https://www.npmjs.com/~types) ဆီ publish လုပ်ခြင်း

`@types` organization အောက်က packages တွေကို [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) ကနေ [types-publisher tool](https://github.com/microsoft/DefinitelyTyped-tools/tree/master/packages/publisher) ကို သုံးပြီး အလိုအလျောက် publish လုပ်ပါတယ်။ သင့် declarations တွေကို @types package အနေနဲ့ publish ဖြစ်စေချင်ရင် — [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) ဆီ pull request တစ်ခု တင်သွင်းပေးပါ။ အသေးစိတ် အချက်အလက်တွေကို [contribution guidelines page](https://definitelytyped.github.io/guides/contributing.html) မှာ ရှာတွေ့နိုင်ပါတယ်။
