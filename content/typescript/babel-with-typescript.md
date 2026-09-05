---
title: "Using Babel with TypeScript (Babel နဲ့ TypeScript ပေါင်းသုံးခြင်း)"
description: "Babel နဲ့ TypeScript ကို တွဲသုံးနည်း — Babel ကို transpiling (JS ထုတ်လုပ်ခြင်း) အတွက်၊ tsc ကို type checking နဲ့ .d.ts file ထုတ်လုပ်ခြင်းအတွက် သုံးတဲ့ hybrid ချဉ်းကပ်နည်းနှင့် သက်ဆိုင်ရာ tsconfig flags"
order: 39
source: "https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html"
status: translated
updated: 2026-09-05
---

## TypeScript အတွက် Babel vs `tsc` (Babel vs tsc for TypeScript)

ခေတ်ပေါ် JavaScript project တစ်ခု လုပ်တဲ့အခါ — TypeScript ကနေ JavaScript ကို files တွေ ဘယ်လို ပြောင်းရမလဲဆိုတဲ့ မှန်ကန်တဲ့ နည်းလမ်းက ဘာလဲလို့ ကိုယ့်ကိုယ်ကို မေးမိနိုင်ပါတယ်။

အဖြေက အများအားဖြင့် _"အခြေအနေပေါ် မူတည်ပါတယ်"_ ဒါမှမဟုတ် _"project ပေါ် မူတည်ပြီး တစ်ယောက်ယောက်က ဆုံးဖြတ်ပြီးသား ဖြစ်နိုင်ပါတယ်"_ ဆိုတာမျိုးပါ။ [tsdx](https://tsdx.io)။ [Angular](https://angular.io/)။ [NestJS](https://nestjs.com/) လိုမျိုး framework တစ်ခုခု ဒါမှမဟုတ် [Getting Started](/docs/typescript/getting-started) မှာ ဖော်ပြထားတဲ့ framework တစ်ခုခုနဲ့ project ကို တည်ဆောက်နေတယ်ဆိုရင် — ဒီဆုံးဖြတ်ချက်ကို သင့်အတွက် စီမံပြီးသား ဖြစ်ပါတယ်။

ဒါပေမယ့် — အသုံးဝင်နိုင်တဲ့ heuristic (ခန့်မှန်း ဆုံးဖြတ်နည်း) တစ်ခုကတော့:

- သင့်ရဲ့ build output တွေက source input files တွေနဲ့ အများအားဖြင့် အတူတူပဲလား? → `tsc` ကို သုံးပါ
- Output မျိုးစုံ ထွက်နိုင်တဲ့ build pipeline တစ်ခု လိုအပ်လား? → transpiling အတွက် `babel` ကို သုံးပြီး type checking အတွက် `tsc` ကို သုံးပါ

## Transpiling အတွက် Babel၊ types အတွက် `tsc` (Babel for transpiling, tsc for types)

ဒါက — JavaScript codebase တစ်ခုကနေ TypeScript ဆီ ပြောင်းရွှေ့ထားတဲ့ (ported) ရှိပြီးသား build infrastructure (တည်ဆောက်မှု အခြေခံစနစ်) တွေ ရှိတဲ့ project တွေအတွက် အသုံးများတဲ့ pattern တစ်ခုပါ။

ဒီ technique က hybrid ချဉ်းကပ်နည်း (hybrid approach) တစ်ခုပါ — JS files တွေ ထုတ်လုပ်ဖို့ Babel ရဲ့ [preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript) ကို သုံးပြီး — type checking နဲ့ `.d.ts` file ထုတ်လုပ်ခြင်းအတွက် TypeScript ကို သုံးပါတယ်။

Babel ရဲ့ TypeScript ထောက်ပံ့မှုကို သုံးခြင်းအားဖြင့် — ရှိပြီးသား build pipelines တွေနဲ့ အလုပ်လုပ်နိုင်စေပြီး — Babel က သင့် code ကို type check မလုပ်လို့ — JS emit ချိန် (JS files ထုတ်တဲ့ အချိန်) ပိုမြန်ဖို့ အလားအလာ ပိုရှိပါတယ်။

#### Type Checking နဲ့ d.ts File ထုတ်လုပ်ခြင်း (Type Checking and d.ts file generation)

Babel သုံးခြင်းရဲ့ အားနည်းချက်က — TS ကနေ JS ကို ပြောင်းတဲ့ လုပ်ငန်းစဉ်အတွင်း type checking မရလို့ပါ။ ဆိုလိုတာက — editor ထဲမှာ လွတ်သွားတဲ့ type error တွေက production code ထဲအထိ တိုးဝင်သွားနိုင်ပါတယ်။

ဒါအပြင် — Babel က သင့် TypeScript အတွက် `.d.ts` files တွေကို ဖန်တီးပေးနိုင်စွမ်း မရှိလို့ — သင့် project က library တစ်ခုဆိုရင် အလုပ်လုပ်ရတာ ပိုခက်ခဲစေနိုင်ပါတယ်။

ဒီပြဿနာတွေကို ဖြေရှင်းဖို့ — TSC သုံးပြီး project ကို type check လုပ်မယ့် command တစ်ခု သတ်မှတ်ထားချင်ပါလိမ့်မယ်။ ဒါက — သင့် babel config ထဲက တစ်ချို့ကို သက်ဆိုင်ရာ [`tsconfig.json`](https://www.typescriptlang.org/tsconfig) ထဲမှာ ထပ်ပွား (duplicate) လုပ်ပြီး — အောက်ပါ flags တွေ ဖွင့်ထားဖို့ လိုအပ်ပါလိမ့်မယ်:

```json tsconfig
"compilerOptions": {
  // Ensure that .d.ts files are created by tsc, but not .js files
  "declaration": true,
  "emitDeclarationOnly": true,
  // Ensure that Babel can safely transpile files in the TypeScript project
  "isolatedModules": true
}
```

ဒီ flags တွေအကြောင်း ပိုမိုသိရှိရန်:

- [`isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules)
- [`declaration`](https://www.typescriptlang.org/tsconfig#declaration)။ [`emitDeclarationOnly`](https://www.typescriptlang.org/tsconfig#emitDeclarationOnly)
