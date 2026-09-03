---
title: "cacheMaxMemorySize (in-memory cache အရွယ်အစား သတ်မှတ်ချက်)"
description: "cacheMaxMemorySize option — Next.js server instance တစ်ခုစီက သိမ်းဆည်းထားသော in-memory cache (prerendered pages, route handler responses, optimized images နှင့် 'use cache' အတွက်) အရွယ်အစားကို bytes ဖြင့် သတ်မှတ်ရန်; default 50 MB, 0 သတ်မှတ်လျှင် နှစ်ခုလုံး ပိတ်သည်"
order: 163
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheMaxMemorySize"
status: translated
updated: 2026-09-03
---

`cacheMaxMemorySize` က Next.js server instance တစ်ခုစီက သိမ်းဆည်းထားတဲ့ in-memory cache (memory ထဲမှာ ထားတဲ့ cache) ရဲ့ အရွယ်အစားကို bytes နဲ့ သတ်မှတ်ပေးပါတယ်။ Default အားဖြင့် 50 MB ဖြစ်ပါတယ်။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheMaxMemorySize: 50 * 1024 * 1024, // 50 MB — default တန်ဖိုး
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheMaxMemorySize: 50 * 1024 * 1024, // 50 MB — default တန်ဖိုး
}

module.exports = nextConfig
```

ဒီ option က သီးခြား caches နှစ်ခုရဲ့ အရွယ်အစားကို သတ်မှတ်ပေးပါတယ်:

- Prerendered pages တွေ, route handler responses တွေနဲ့ optimized images တွေကို သိမ်းဆည်းတဲ့ **server cache** ဖြစ်ပါတယ်။ [custom `cacheHandler`](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath) ကို သုံးတဲ့အခါ ဒါကို `0` လို့ သတ်မှတ်ပါ — ဒါဆိုရင် instance တစ်ခုချင်းစီရဲ့ ကိုယ်ပိုင် copy ကနေ မဟုတ်ဘဲ သင့် store ကနေ ဖတ်ပါလိမ့်မယ်။
- [`'use cache'`](/docs/nextjs/use-cache) နောက်ကွယ်မှာ အလုပ်လုပ်တဲ့ **built-in handler** ဖြစ်ပါတယ်။ [`cacheHandlers`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) ကနေ ကိုယ်ပိုင် handler တစ်ခုကို register လုပ်ထားရင် — အဲဒီ handler က သူ့ရဲ့ memory ကို သူ့ဘာသာ စီမံခန့်ခွဲမှာ ဖြစ်လို့ ဒီ option က ၎င်းအတွက် သက်ရောက်မှု မရှိတော့ပါဘူး။

`cacheMaxMemorySize: 0` လို့ သတ်မှတ်ရင် in-memory caches နှစ်ခုလုံး ပိတ်သွားပါတယ်။ ဒါက serverless environment ထဲမှာ `use cache` က ဘယ်လို ပြုမူလဲ ဆိုတာကို အတုယူဖို့ နည်းလမ်းတစ်ခုလည်း ဖြစ်ပါတယ် — serverless မှာ cache entries တွေက requests တွေကြားမှာ ခဲခဲယဉ်းယဉ်းသာ ကျန်ရှိတတ်ပါတယ်။

> **သိထားသင့်သည် (Good to know):** `next dev` က ဒီ option ဘယ်လို သတ်မှတ်ထားသည်ဖြစ်စေ သူ့ရဲ့ ကိုယ်ပိုင် in-memory cache ကို သိမ်းထားလို့ — reload တွေ မြန်နေတာပါ။ Production မှာတော့ သတ်မှတ်ထားတဲ့ တန်ဖိုးကို အတိအကျ လိုက်နာပါတယ်။
