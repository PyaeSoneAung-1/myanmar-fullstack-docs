---
title: "Nightly Builds (Nightly Build ဗားရှင်းများ)"
description: "TypeScript ၏ nightly build ကို npm မှ မည်သို့ ရယူရမည် နှင့် VS Code, Sublime Text, Visual Studio, IntelliJ IDEA ကဲ့သို့သော IDE/editor များတွင် အသုံးပြုရန် ပြင်ဆင်သတ်မှတ်ပုံ"
order: 81
source: "https://www.typescriptlang.org/docs/handbook/nightly-builds.html"
status: translated
updated: 2026-09-05
---

[TypeScript's `main`](https://github.com/Microsoft/TypeScript/tree/main) branch ကနေ ထွက်တဲ့ nightly build တစ်ခုကို — PST သန်းခေါင်ယံ မတိုင်မီ — npm ပေါ်ကို နေ့စဉ် ထုတ်ပြန်ပေးပါတယ်။
ဒါကို ဘယ်လို ရယူရမလဲ — ကိုယ့် tools တွေနဲ့ ဘယ်လို သုံးရမလဲဆိုတာ ဒီမှာ ဖော်ပြထားပါတယ်။

## Using npm (npm ကို အသုံးပြုခြင်း)

```shell
npm install -D typescript@next
```

## Updating your IDE to use the nightly builds (Nightly Builds သုံးရန် IDE ကို Update လုပ်ခြင်း)

Nightly drop (နေ့စဉ် ထုတ်ဝေသည့် ဗားရှင်း) ကို သုံးဖို့ ကိုယ့် editor/IDE ကိုလည်း update လုပ်နိုင်ပါတယ်။
ပုံမှန်အားဖြင့် — package ကို npm ကနေ install လုပ်ဖို့ လိုအပ်ပါလိမ့်မယ်။
ဒီ section ရဲ့ ကျန်တဲ့ အပိုင်းတွေကတော့ — `typescript@next` ကို install လုပ်ပြီးသား ဖြစ်နေတယ်လို့ အဓိက ယူဆထားပါတယ်။

### Visual Studio Code

VS Code website မှာ [workspace ထဲက TypeScript version တစ်ခုကို ရွေးချယ်ခြင်းဆိုင်ရာ documentation](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions) ရှိပါတယ်။
ကိုယ့် workspace ထဲမှာ TypeScript ရဲ့ nightly version တစ်ခုကို install လုပ်ပြီးရင် — အဲဒီမှာ ပါတဲ့ လမ်းညွှန်ချက်တွေကို လိုက်လုပ်နိုင်သလို — ဒါမှမဟုတ် JSON view ထဲမှာ ကိုယ့် workspace settings တွေကို ရိုးရိုးရှင်းရှင်း update လုပ်လို့လည်း ရပါတယ်။
ဒါကို လုပ်ဖို့ တိုက်ရိုက် နည်းလမ်းတစ်ခုကတော့ — ကိုယ့် workspace ရဲ့ `.vscode/settings.json` ကို ဖွင့်ပြီး (သို့) အသစ် ဖန်တီးပြီး — အောက်ပါ property ကို ထည့်သွင်းဖို့ပါ:

```json
"typescript.tsdk": "<path to your folder>/node_modules/typescript/lib"
```

တနည်းအားဖြင့် — ကိုယ့် workspace version ကို မပြောင်းဘဲ — Visual Studio Code ထဲမှာ JavaScript နဲ့ TypeScript အတွက် nightly editing experience ကို ရိုးရိုးရှင်းရှင်း run လုပ်ချင်ရင် — [JavaScript and TypeScript Nightly Extension](https://marketplace.visualstudio.com/items?itemName%253Dms-vscode.vscode-typescript-next) ကို run လုပ်နိုင်ပါတယ်။

### Sublime Text

`Settings - User` file ကို အောက်ပါအတိုင်း update လုပ်ပါ:

```json
"typescript_tsdk": "<path to your folder>/node_modules/typescript/lib"
```

အသေးစိတ် အချက်အလက်တွေကို [Sublime Text အတွက် TypeScript Plugin installation documentation](https://github.com/Microsoft/TypeScript-Sublime-Plugin#installation) မှာ ကြည့်ရှုနိုင်ပါတယ်။

### Visual Studio 2013 and 2015

> မှတ်ချက်: ပြောင်းလဲမှု အများစုက VS TypeScript plugin ရဲ့ ဗားရှင်းအသစ်တစ်ခုကို install လုပ်ဖို့ မလိုအပ်ပါဘူး။

Nightly build မှာ လောလောဆယ် — plugin တစ်ခုလုံးရဲ့ setup မပါဝင်သေးပေမယ့် — installer တစ်ခုကိုလည်း nightly အလိုက် ထုတ်ဝေဖို့ ကျွန်တော်တို့ လုပ်ဆောင်နေပါတယ်။

1. [VSDevMode.ps1](https://github.com/Microsoft/TypeScript/blob/main/scripts/VSDevMode.ps1) script ကို download လုပ်ပါ။

   > [custom language service file တစ်ခုကို သုံးခြင်း](https://github.com/Microsoft/TypeScript/wiki/Dev-Mode-in-Visual-Studio#using-a-custom-language-service-file) ဆိုတဲ့ ကျွန်တော်တို့ရဲ့ wiki page ကိုလည်း ကြည့်ပါ။

2. PowerShell command window တစ်ခုကနေ အောက်ပါအတိုင်း run လုပ်ပါ:

For VS 2015:

```posh
VSDevMode.ps1 14 -tsScript <path to your folder>/node_modules/typescript/lib
```

For VS 2013:

```posh
VSDevMode.ps1 12 -tsScript <path to your folder>/node_modules/typescript/lib
```

### IntelliJ IDEA (Mac)

`Preferences` > `Languages & Frameworks` > `TypeScript` ဆီ သွားပါ:

> TypeScript Version: npm နဲ့ install လုပ်ခဲ့တယ်ဆိုရင်: `/usr/local/lib/node_modules/typescript/lib`

### IntelliJ IDEA (Windows)

`File` > `Settings` > `Languages & Frameworks` > `TypeScript` ဆီ သွားပါ:

> TypeScript Version: npm နဲ့ install လုပ်ခဲ့တယ်ဆိုရင်: `C:\Users\USERNAME\AppData\Roaming\npm\node_modules\typescript\lib`
