---
title: "turbopackMemoryEviction (Turbopack memory eviction strategy)"
description: "turbopackMemoryEviction option — persistent (FileSystem) cache ဖွင့်ထားချိန်တွင် Turbopack ၏ memory eviction (memory ပြန်လည်ရယူခြင်း) strategy ကို ထိန်းချုပ်ရန် experimental သတ်မှတ်ချက်; false | 'auto' (default) | 'full'"
order: 196
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackMemoryEviction"
status: translated
updated: 2026-09-03
---

## အသုံးပြုပုံ (Usage)

`turbopackMemoryEviction` က persistent (FileSystem) cache ဖွင့်ထားချိန်မှာ — Turbopack က memory ကို ပြန်လည်ရယူ (reclaim) လုပ်မလား ဆိုတာကို ထိန်းချုပ်ပေးပါတယ်။ Turbopack က သူ့ရဲ့ cache ရဲ့ snapshot တစ်ခုကို disk ပေါ် ရေးပြီးတဲ့နောက် — အဲဒီဒေတာရဲ့ in-memory copies တွေကို 'evict' (ဖယ်ရှား) လုပ်ပြီး လိုအပ်တဲ့အခါ disk ကနေ ပြန်လည် load လုပ်နိုင်ပါတယ်။

လက်ရှိမှာ options သုံးမျိုး ရှိပါတယ်:

- `false`: ဘယ်တော့မှ evict မလုပ်ပါ။ Cached data တွေက process ရဲ့ သက်တမ်းတစ်လျှောက်လုံး memory ထဲမှာ ရှိနေပါတယ်။
- `'auto'` (default): နောက်ဆုံး eviction နောက်ပိုင်း memory အလုံအလောက် သုံးစွဲပြီးမှသာ — snapshot တစ်ခု ပြီးတိုင်း evict လုပ်ပါတယ်။ Operating system ရဲ့ thresholds တွေနဲ့ memory pressure feedback (memory ဖိအား တုံ့ပြန်ချက်) တွေကို အသုံးချပါတယ်။
- `'full'`: disk ပေါ် သိမ်းတိုင်း — ဖြစ်နိုင်သမျှ ဒေတာအားလုံးကို memory ကနေ evict လုပ်ပါတယ်။

> **သိထားသင့်သည် (Good to know):** ဒီ option က eviction ဟာ disk ပေါ် ဒေတာ persist လုပ်ပြီးသား ဖြစ်မှုအပေါ် မှီခိုနေလို့ — [FileSystem Cache](/docs/nextjs/next-config-turbopack-file-system-cache) ဖွင့်ထားတဲ့ `next dev` sessions တွေမှာပဲ သက်ရောက်မှု ရှိပါတယ်။ ဒါက experimental ဖြစ်ပြီး တက်ကြွစွာ ဖွံ့ဖြိုးဆဲ (under active development) လည်း ဖြစ်ပါတယ်။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackMemoryEviction: 'auto',
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackMemoryEviction: 'auto',
  },
}

module.exports = nextConfig
```

## Version Changes

| Version   | အပြောင်းအလဲ                                              |
| --------- | ------------------------------------------------------ |
| `v16.3.0` | `turbopackMemoryEviction` ကို experimental အဖြစ် ထုတ်ဝေ။ |
