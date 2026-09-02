---
title: "Declaration Files များ ရယူသုံးစွဲခြင်း (Consumption)"
description: "သင့် project အတွက် type declarations များ ရယူသုံးစွဲနည်း — @types packages များ download လုပ်ခြင်း၊ modules/global code တို့တွင် သုံးစွဲခြင်းနှင့် ရှာဖွေခြင်း"
order: 25
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html"
status: translated
updated: 2026-09-02
---

## Downloading (Download လုပ်ခြင်း)

Type declarations တွေ ရယူဖို့က npm ကလွဲရင် ဘယ် tool မှ မလိုအပ်ပါဘူး။

ဥပမာ — lodash လိုမျိုး library တစ်ခုရဲ့ declarations တွေကို ရယူဖို့ဆိုရင် အောက်က command လောက်ပဲ လိုပါတယ်:

```sh
npm install --save-dev @types/lodash
```

npm package က သူ့ရဲ့ declaration file ကို [Publishing](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html) မှာ ဖော်ပြထားသလို ပါပြီးသားဆိုရင် — သက်ဆိုင်တဲ့ `@types` package ကို download လုပ်စရာ မလိုတော့ဘူးဆိုတာ မှတ်သားထိုက်ပါတယ်။

## Consuming (သုံးစွဲခြင်း)

အဲဒီကစပြီး သင့် TypeScript code ထဲမှာ lodash ကို ရှုပ်ထွေးမှု မရှိဘဲ သုံးနိုင်မှာ ဖြစ်ပါတယ်။ ဒါက modules တွေမှာရော global code တွေမှာပါ အလုပ်လုပ်ပါတယ်။

ဥပမာ — သင့် type declarations တွေကို `npm install` လုပ်ပြီးတာနဲ့ — imports တွေကို သုံးပြီး ဒီလို ရေးနိုင်ပါတယ်:

```ts
import * as _ from "lodash";
_.padStart("Hello TypeScript!", 20, " ");
```

ဒါမှမဟုတ် modules တွေ မသုံးဘူးဆိုရင် — `_` ဆိုတဲ့ global variable ကိုပဲ တိုက်ရိုက် သုံးနိုင်ပါတယ်:

```ts
_.padStart("Hello TypeScript!", 20, " ");
```

## Searching (ရှာဖွေခြင်း)

အများအားဖြင့် — type declaration packages တွေရဲ့ နာမည်က npm ပေါ်က package နာမည်နဲ့ အတူတူပဲ ဖြစ်ပြီး `@types/` ရှေ့ဆက်သာ ပါပါတယ်။ ဒါပေမယ့် လိုအပ်ရင် — သင်အကြိုက်ဆုံး library အတွက် package ကို ရှာဖို့ [Yarn package search](https://yarnpkg.com/) ကို သုံးနိုင်ပါတယ်။

> Note: သင်ရှာဖွေနေတဲ့ declaration file က မတွေ့ရဘူးဆိုရင် — သင်ကိုယ်တိုင် တစ်ခု ပံ့ပိုးပေး (contribute) လိုက်ပြီး နောက်ထပ် အဲဒါကို ရှာဖွေနေမယ့် developer တစ်ယောက်ကို ကူညီနိုင်ပါတယ်။ အသေးစိတ်အတွက် DefinitelyTyped ရဲ့ [contribution guidelines page](https://definitelytyped.org/guides/contributing.html) ကို ကြည့်ပါ။
