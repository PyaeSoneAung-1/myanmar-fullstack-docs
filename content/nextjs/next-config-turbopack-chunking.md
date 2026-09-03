---
title: "experimental.turbopackChunking (Turbopack chunking သတ်မှတ်ချက်များ)"
description: "experimental.turbopackChunking option — Turbopack ရဲ့ production JavaScript chunker ကို configure လုပ်ရန် သတ်မှတ်ချက်များ; chunk ပေါင်းစည်းမှု (merge) အတွက် size thresholds (minChunkSize, maxChunkCountPerGroup, maxMergeChunkSize), experimental component chunks (generateComponentChunks, minComponentChunkSize) နှင့် heuristics (firstPageLoadPriority, priorityRoutes, priorityBoost, requestCost) တို့ ပါဝင်"
order: 217
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackChunking"
status: translated
updated: 2026-09-03
---

`experimental.turbopackChunking` က Turbopack ရဲ့ production JavaScript chunker ကို configure လုပ်နိုင်စေပါတယ်။ ဒီ options တွေက chunker က user အပြုအမူအပေါ် ချမှတ်ထားတဲ့ ယူဆချက်တွေကို ပြောင်းလဲခြင်း၊ သူအသုံးပြုတဲ့ raw size thresholds တွေကို ချိန်ညှိခြင်းနဲ့ experimental component chunks feature ကို ဖွင့်ပေးခြင်းတွေ လုပ်နိုင်စေပါတယ်။

Default အားဖြင့် — Turbopack ရဲ့ chunking ကို အောက်ပါအတိုင်း configure လုပ်ထားပါတယ်:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig = {
  experimental: {
    turbopackChunking: {
      minChunkSize: 50000,
      maxChunkCountPerGroup: 40,
      maxMergeChunkSize: 200000,
      minComponentChunkSize: 20000,
      generateComponentChunks: false,
    },
  },
} satisfies NextConfig

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackChunking: {
      minChunkSize: 50000,
      maxChunkCountPerGroup: 40,
      maxMergeChunkSize: 200000,
      minComponentChunkSize: 20000,
      generateComponentChunks: false,
    },
  },
}

module.exports = nextConfig
```

## Size Thresholds (အရွယ်အစား ကန့်သတ်ချက်များ)

အောက်ပါ options တွေက Turbopack က chunks တွေကို ဘယ်လောက် ပြင်းပြင်းထန်ထန် merge လုပ်လဲ၊ chunk တစ်ခု ဘယ်လောက်အထိ ကြီးထွားခွင့်ရှိလဲ ဆိုတာတွေကို ထိန်းချုပ်ပါတယ်။ Sizes တွေက uncompressed, unminified code ရဲ့ bytes အနေနဲ့ ဖြစ်ပြီး (compressed, minified output ရဲ့ အရွယ်အစားရဲ့ ခန့်မှန်းခြေ ၅ ဆ ခန့် ဖြစ်ပါတယ်)။

- **`minChunkSize`** (default `50000`): Turbopack က ဒီအရွယ်အစားထက် ငယ်တဲ့ chunk တစ်ခုထက်ပိုပြီး မဖြစ်အောင် — chunks အသေးတွေကို chunks ကြီးတွေထဲ merge လုပ်ပြီး ရှောင်ရှားပါတယ်။ ဒီနံပါတ်ကို မြှင့်လိုက်ရင် chunk အရေအတွက် ပိုနည်းပြီး အရွယ်အစား ပိုကြီးတဲ့ chunks တွေ ထွက်လာပါတယ်။ လျှော့လိုက်ရင်တော့ အရွယ်အစား ပိုငယ်တဲ့ chunks တွေ ပိုများများ ထွက်လာပါတယ်။
- **`maxChunkCountPerGroup`** (default `40`): Turbopack က chunk group တစ်ခုအတွက် (ဥပမာ route တစ်ခု (သို့) dynamic import တစ်ခု) ဒီထက်များတဲ့ chunk အရေအတွက်ကို emit လုပ်မှာ မဟုတ်ပါဘူး။ ဒီနံပါတ်ကို လျှော့လိုက်ရင် merge လုပ်မှု ပိုပြင်းထန်လာပြီး page တစ်ခုအတွက် network requests အရေအတွက် ပိုနည်းပါတယ်။ မြှင့်လိုက်ရင်တော့ chunks တွေ ပိုငယ်လာပြီး navigation လုပ်တဲ့အခါ cache hits ဖြစ်နိုင်ခြေ ပိုများပါတယ်။
- **`maxMergeChunkSize`** (default `200000`): Turbopack က ဒီအရွယ်အစားထက် ကြီးတဲ့ chunk တစ်ခုကို တခြား chunks တွေနဲ့ ဘယ်တော့မှ merge မလုပ်ပါဘူး။ ဒါက chunks ကြီးတွေထဲက code တွေ output chunks ကြီးများစွာကြားမှာ ထပ်ခါထပ်ခါ ပွားမနေအောင် ကာကွယ်ပေးပါတယ်။

Chunks တွေကို merge လုပ်တဲ့အခါ — ကနဦး page loads တွေရဲ့ performance ကို ပိုကောင်းအောင် လုပ်ပြီး navigation performance ကို စတေးရတဲ့ trade-off ဖြစ်ပါတယ်။ အကြောင်းက network request တစ်ခုချင်းစီ ထပ်လုပ်ရတာက cost ကြီးပေမယ့် — chunks တွေ ငယ်လေလေ pages တွေကြားမှာ ပြန်သုံးလို့ရနိုင်ခြေ များလေလေပါပဲ။

## Component Chunks

Component chunks တွေ ထုတ်လုပ်ခြင်းက — merged chunks တွေရဲ့ ကနဦး page load အကျိုးကျေးဇူးတွေကို reusability (ပြန်သုံးနိုင်မှု) မစတေးဘဲ ရရှိစေဖို့ ရည်ရွယ်တဲ့ experimental feature တစ်ခုပါ။ ဒီ feature က runtime ကို merged chunk တစ်ခုကို file တစ်ခုတည်းအနေနဲ့ load လုပ်မလား၊ (သို့) သူ့မှာ မရှိသေးတဲ့ component chunks တွေကိုပဲ load လုပ်မလား ဆိုတာကို dynamically ရွေးချယ်ခွင့်ပေးပါတယ်။ ဒါ့အပြင် — merged chunk တစ်ခုရဲ့ အစိတ်အပိုင်းအနေနဲ့ တစ်ခါ load လုပ်ပြီးသား chunks တွေကိုလည်း ပြန်ပြီး download လုပ်မှာ မဟုတ်ပါဘူး။

ဒါက browser မှာ ရှိပြီးသား JavaScript တွေကို navigation လုပ်တဲ့အခါ ပြန်လည် download လုပ်ရခြင်းကို ရှောင်ရှားပေးပါတယ်။

- **`generateComponentChunks`** (default `false`): ဖွင့်ထားရင် — merged production chunk တစ်ခုချင်းစီကနေ သူ့ရဲ့ အစိတ်အပိုင်း component chunks တွေကိုပါ တွဲထုတ်ပေးလို့ — browser runtime က component chunks တစ်ခုချင်းစီကို fetch လုပ်နိုင်ပါတယ်။
- **`minComponentChunkSize`** (default `20000`): ဒီအရွယ်အစားထက် ငယ်တဲ့ component chunks တွေကို သူတို့ဘာသာသူတို့ emit မလုပ်ဘဲ component တစ်ခုထဲ ထည့်ပေါင်းလိုက်ပြီး — chunks အသေးလေးတွေ အများအပြား ဖြစ်မသွားအောင် ကာကွယ်ပါတယ်။

## Heuristics

ဒါတွေက chunk နှစ်ခုကို merge လုပ်တာ တန်မတန် ချိန်တွယ်တဲ့အခါ chunker ရဲ့ ယူဆချက်တွေကို ပြောင်းလဲပေးပါတယ်။

- **`firstPageLoadPriority`** (`0` နဲ့ `1` ကြားက နံပါတ်): page load တစ်ခုတည်းအတွက် chunks တွေကို merge လုပ်ခြင်းရဲ့ အကျိုးကို ဘယ်လောက် အလေးပေးမလဲ သတ်မှတ်ပါတယ်။ တန်ဖိုး ပိုများလေလေ ပိုစိတ်အားထက်သန်စွာ merge လုပ်လေလေပါ။ ပိုကောင်းတဲ့ တန်ဖိုး မရှိရင် — သင့် site ရဲ့ bounce rate က အနီးစပ်ဆုံး ခန့်မှန်းချက် ကောင်းတစ်ခုပါ။
- **`priorityRoutes`** (`RegExp` တွေရဲ့ array): visitor တစ်ဦး ပထမဆုံး ရောက်လေ့ရှိတဲ့ routes တွေ (ဥပမာ homepage) ဖြစ်ပါတယ်။ သူတို့ရဲ့ client-side bundles တွေကို route တစ်ခုတည်းရဲ့ request cost လျှော့ချဖို့ ပိုစိတ်အားထက်သန်စွာ merge လုပ်ပြီး — တခြား pages တွေဆီ navigate လုပ်တဲ့အခါမှာတော့ requests အပိုတွေ ဖြစ်စေနိုင်ပါတယ်။
- **`priorityBoost`** (default `1.5`): `priorityRoutes` တွေရဲ့ single-request probability ကို မြှောက်ပေးတဲ့ multiplier ပါ။ တန်ဖိုး ပိုများလေလေ အဲဒီ routes တွေရဲ့ bundles တွေကို ပိုပြင်းထန်စွာ merge လုပ်လေလေပါ။
- **`requestCost`** (default `200000`): request တစ်ခု ထပ်လုပ်တာရဲ့ ခန့်မှန်းခြေ cost ကို uncompressed, unminified code ရဲ့ bytes နဲ့ ဖော်ပြပါတယ်။ တန်ဖိုး ပိုကြီးလေလေ — chunks အရေအတွက် ပိုနည်းပြီး ပိုကြီးတဲ့ chunks နဲ့ requests အားလုံး ပိုနည်းတဲ့ဘက်ကို ဦးတည်လေလေပါ။
