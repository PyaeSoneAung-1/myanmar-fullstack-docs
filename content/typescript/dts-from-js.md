---
title: "Creating .d.ts Files from JS (JavaScript ကနေ .d.ts Files ဖန်တီးခြင်း)"
description: "TypeScript 3.7 ကစပြီး JSDoc syntax သုံးပြီး JavaScript ကနေ .d.ts files တွေ generate လုပ်နည်း — dev dependency ထည့်ခြင်း, tsconfig.json ပြင်ဆင်ခြင်း, compiler run လုပ်ခြင်းနဲ့ package.json ထဲမှာ types field သတ်မှတ်ခြင်း"
order: 45
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html"
status: translated
updated: 2026-09-05
---

[TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html) ကစပြီး — TypeScript က JSDoc syntax ကို သုံးပြီး JavaScript ကနေ .d.ts files တွေ generate (ထုတ်လုပ်) လုပ်နိုင်တဲ့ support ကို ထည့်သွင်းပေးခဲ့ပါတယ်။

ဒီ setup ကြောင့် — project တစ်ခုလုံးကို TypeScript ဆီ port (ပြောင်းရွှေ့) လုပ်စရာ မလိုဘဲ၊ codebase ထဲမှာ .d.ts files တွေကို ကိုယ်တိုင် ထိန်းသိမ်းစရာလည်း မလိုဘဲ — TypeScript နဲ့ စွမ်းအားသွင်းထားတဲ့ editors တွေရဲ့ editor experience (တည်းဖြတ်မှု အတွေ့အကြုံ) ကို ကိုယ်ပိုင် ပိုင်ဆိုင်နိုင်ပါတယ်။

TypeScript က JSDoc tags အများစုကို ပံ့ပိုးတာမို့ — [reference ကို ဒီမှာ](/docs/typescript/type-checking-javascript-files) ရှာတွေ့နိုင်ပါတယ်။

## Setting up your Project to emit .d.ts files (Project က .d.ts files emit လုပ်နိုင်အောင် ပြင်ဆင်ခြင်း)

ကိုယ့် project ထဲမှာ .d.ts files တွေ ဖန်တီးထုတ်လုပ်ဖို့ — အဆင့် လေးဆင့်အထိ လုပ်ဆောင်ရပါမယ်:

- Dev dependencies တွေထဲကို TypeScript ထည့်ပါ
- TypeScript ကို configure လုပ်ဖို့ `tsconfig.json` တစ်ခု ထည့်ပါ
- JS files တွေအတွက် သက်ဆိုင်တဲ့ d.ts files တွေကို generate လုပ်ဖို့ TypeScript compiler ကို run လုပ်ပါ
- (optional) Types တွေကို ညွှန်းပြဖို့ package.json ကို တည်းဖြတ်ပါ

### Adding TypeScript (TypeScript ထည့်သွင်းခြင်း)

ဒါကို ဘယ်လို လုပ်ရမလဲဆိုတာ ကျွန်တော်တို့ရဲ့ [installation page](https://www.typescriptlang.org/download) မှာ လေ့လာနိုင်ပါတယ်။

### TSConfig (TSConfig ဖိုင်)

TSConfig ဆိုတာ — compiler flags တွေကို configure လုပ်ပေးပြီး files တွေကို ဘယ်မှာ ရှာရမလဲဆိုတာကိုလည်း သတ်မှတ်ပေးတဲ့ jsonc file တစ်ခုပါ။ ဒီကိစ္စမှာဆိုရင် — အောက်ပါအတိုင်း ပုံစံမျိုးရှိတဲ့ file တစ်ခု လိုပါလိမ့်မယ်:

```jsonc tsconfig
{
  // Change this to match your project
  "include": ["src/**/*"],

  "compilerOptions": {
    // Tells TypeScript to read JS files, as
    // normally they are ignored as source files
    "allowJs": true,
    // Generate d.ts files
    "declaration": true,
    // This compiler run should
    // only output d.ts files
    "emitDeclarationOnly": true,
    // Types should go into this directory.
    // Removing this would place the .d.ts files
    // next to the .js files
    "outDir": "dist",
    // go to js file when using IDE functions like
    // "Go to Definition" in VSCode
    "declarationMap": true
  }
}
```

Options တွေအကြောင်း ပိုသိချင်ရင် — [tsconfig reference](https://www.typescriptlang.org/tsconfig) မှာ ကြည့်နိုင်ပါတယ်။ TSConfig file သုံးမယ့်အစား CLI ကိုလည်း သုံးလို့ရပါတယ် — အောက်ပါအတိုင်း CLI command တစ်ခုက ဒီအတိုင်း တူညီတဲ့ အပြုအမူကို ရစေပါတယ်:

```sh
npx -p typescript tsc src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

## Run the compiler (Compiler ကို run လုပ်ခြင်း)

ဒါကို ဘယ်လို လုပ်ရမလဲဆိုတာ ကျွန်တော်တို့ရဲ့ [installation page](https://www.typescriptlang.org/download) မှာ လေ့လာနိုင်ပါတယ်။ ဒီ files တွေက ကိုယ့် project ရဲ့ `.gitignore` ထဲမှာ ပါနေတယ်ဆိုရင် — ကိုယ့် package ထဲမှာ ပါဝင်အောင် သေချာ လုပ်ထားချင်ပါလိမ့်မယ်။

## Editing the package.json (package.json ကို တည်းဖြတ်ခြင်း)

TypeScript က `package.json` တစ်ခုထဲမှာ modules တွေအတွက် node resolution (module ရှာဖွေမှု စည်းမျဉ်း) ကို အတုယူပြီး — .d.ts files တွေကို ရှာဖွေဖို့ အဆင့်တစ်ခု ထပ်ဖြည့်ထားပါတယ်။ အကြမ်းဖျင်း ပြောရရင် — resolution က ပထမဆုံး optional ဖြစ်တဲ့ `types` field ကို စစ်ပြီး၊ နောက် `"main"` field ကို စစ်ကာ — နောက်ဆုံးမှာတော့ root ထဲက `index.d.ts` ကို စမ်းကြည့်ပါတယ်။

| Package.json | Default .d.ts တည်နေရာ |
| :------------------------ | :----------------------------- |
| "types" field မရှိရင် | "main" ကို စစ်ပြီး၊ နောက် index.d.ts |
| "types": "main.d.ts"      | main.d.ts                      |
| "types": "./dist/main.js" | ./dist/main.d.ts               |

"types" မရှိရင် — "main" ကို သုံးပါတယ်

| Package.json             | Default .d.ts တည်နေရာ |
| :----------------------- | :------------------------ |
| "main" field မရှိရင် | index.d.ts                |
| "main":"index.js"        | index.d.ts                |
| "main":"./dist/index.js" | ./dist/index.d.ts         |

## Tips (အကြံပြုချက်များ)

ကိုယ့်ရဲ့ .d.ts files တွေအတွက် tests တွေ ရေးချင်တယ်ဆိုရင် — [tsd](https://github.com/SamVerschueren/tsd) ဒါမှမဟုတ် [TSTyche](https://github.com/tstyche/tstyche) ကို စမ်းသုံးကြည့်ပါ။
