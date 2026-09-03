---
title: "API Reference (adapter API ကိုးကား)"
description: "NextAdapter interface ထဲက modifyConfig နှင့် onBuildComplete functions"
order: 249
source: "https://nextjs.org/docs/app/api-reference/adapters/api-reference"
status: translated
updated: 2026-09-03
---

## `async modifyConfig(config, context)` (configuration ကို ပြုပြင်မွမ်းမံရန်)

`next.config.js` file ကို load လုပ်တဲ့ CLI command တိုင်းမှာ — configuration ကို ပြုပြင်မွမ်းမံခွင့်ပြုဖို့ ဒီ function ကို ခေါ်ပါတယ်။

**Parameters:**

- `config`: ပြီးပြည့်စုံတဲ့ Next.js configuration object
- `context.phase`: လက်ရှိ build phase (ကြည့်ရန်: [phases](https://nextjs.org/docs/app/api-reference/config/next-config-js#phase))
- `context.nextVersion`: အသုံးပြုနေတဲ့ Next.js ရဲ့ ဗားရှင်း
- `context.projectDir`: Next.js project directory ဆီ ညွှန်ပြတဲ့ absolute path

**Returns:** ပြုပြင်မွမ်းမံပြီးသား configuration object ကို ပြန်ပေးပါတယ် (async လည်း ဖြစ်နိုင်ပါတယ်)

## `async onBuildComplete(context)` (build ပြီးဆုံးချိန်တွင် လုပ်ဆောင်ရန်)

Build process ပြီးဆုံးသွားတဲ့အခါ — routes နဲ့ outputs တွေအကြောင်း အသေးစိတ် အချက်အလက်တွေနဲ့အတူ ဒီ function ကို ခေါ်ပါတယ်။

**Parameters:**

- `context.routing`: Next.js routing phases နဲ့ metadata တွေ ပါဝင်တဲ့ object
  - `routing.beforeMiddleware`: middleware မတိုင်ခင် execute လုပ်တဲ့ routes တွေ (header နဲ့ redirect handling တွေ ပါဝင်ပါတယ်)
  - `routing.middlewareMatchers`: ဒီ build အတွက် middleware matcher definitions တွေ — request တစ်ခုအတွက် middleware ကို invoke လုပ်သင့်၊ မလုပ်သင့် ဆုံးဖြတ်ဖို့ အသုံးပြုပါတယ်
  - `routing.beforeFiles`: filesystem route matching မတိုင်ခင် စစ်ဆေးတဲ့ rewrite routes တွေ
  - `routing.afterFiles`: filesystem route matching ပြီးမှ စစ်ဆေးတဲ့ rewrite routes တွေ
  - `routing.dynamicRoutes`: Dynamic route matching အတွက် ဇယား (table)
  - `routing.onMatch`: ကိုက်ညီမှု အောင်မြင်ပြီးနောက် သက်ရောက်တဲ့ routes တွေ (ဥပမာ — immutable static asset cache headers)
  - `routing.fallback`: နောက်ဆုံး rewrite fallback routes တွေ
  - `routing.shouldNormalizeNextData`: matching လုပ်နေစဉ် `/_next/data/<buildId>/...` URLs တွေကို normalize လုပ်သင့်၊ မလုပ်သင့် ဆိုတာ
  - `routing.rsc`: React Server Components routing အပြုအမူအတွက် အသုံးပြုတဲ့ route metadata
- `context.outputs`: Build outputs အားလုံးအကြောင်း type အလိုက် စီစဉ်ထားတဲ့ အသေးစိတ် အချက်အလက်တွေ
- `context.projectDir`: Next.js project directory ဆီ ညွှန်ပြတဲ့ absolute path
- `context.repoRoot`: တွေ့ရှိထားတဲ့ repository root ဆီ ညွှန်ပြတဲ့ absolute path
- `context.distDir`: Build output directory ဆီ ညွှန်ပြတဲ့ absolute path
- `context.config`: နောက်ဆုံး Next.js configuration (`modifyConfig` ကို သက်ရောက်ပြီးသား)
- `context.nextVersion`: အသုံးပြုနေတဲ့ Next.js ရဲ့ ဗားရှင်း
- `context.buildId`: လက်ရှိ build အတွက် သီးခြား (unique) identifier
