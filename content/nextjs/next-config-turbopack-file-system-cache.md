---
title: "turbopackFileSystemCache (FileSystem cache သတ်မှတ်ချက်)"
description: "turbopackFileSystemCache options — `next dev` (turbopackFileSystemCacheForDev) နှင့် `next build` (turbopackFileSystemCacheForBuild) လုပ်ဆောင်ချက်များကြား Turbopack ၏ FileSystem caching ဖွင့်/ပိတ်ရန် သတ်မှတ်ချက်များ; နှစ်ခုလုံး default အားဖြင့် true"
order: 198
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache"
status: translated
updated: 2026-09-03
---

## အသုံးပြုပုံ (Usage)

Turbopack FileSystem Cache က Turbopack ကို `next dev` (သို့) `next build` commands တွေကြားမှာ အလုပ်တွေ လျှော့ချနိုင်အောင် ကူညီပေးပါတယ်။ ဖွင့်ထားတဲ့အခါ — Turbopack က run တစ်ခုနဲ့တစ်ခုကြားမှာ `.next` directory အောက်မှာ ဒေတာတွေကို သိမ်းဆည်းပြီး ပြန်လည်ရယူ (restore) ပါတယ်။ ဒါက နောက်ဆက်တွဲ builds တွေနဲ့ dev sessions တွေကို သိသိသာသာ မြန်ဆန်စေနိုင်ပါတယ်။

Options နှစ်ခုက cache ကို ထိန်းချုပ်ပါတယ် — တစ်ခုက `next dev` အတွက်၊ နောက်တစ်ခုက `next build` အတွက် ဖြစ်ပါတယ်။ နှစ်ခုလုံးက default အားဖြင့် ဖွင့်ထားပါတယ်:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
  },
}

module.exports = nextConfig
```

## Options

- **`turbopackFileSystemCacheForDev`** (default: `true`): `next dev` ရဲ့ Turbopack အလုပ်တွေကို `.next/dev/cache/turbopack` မှာ cache လုပ်ပါတယ်။ Dev server ကို ပြန်စတင်တဲ့အခါ — ယခင် compilation ကို ပြန်လည် အသုံးပြုပါတယ်။
- **`turbopackFileSystemCacheForBuild`** (default: `true`): `next build` ရဲ့ Turbopack အလုပ်တွေကို `.next/cache/turbopack` မှာ cache လုပ်ပါတယ်။ နောက်ဆက်တွဲ builds တွေက warm (ကြိုတင် ပြင်ဆင်ပြီးသား) အခြေအနေကနေ စတင်ပါတယ်။ [Build environments](#build-environments) ကို ကြည့်ပါ။

Option တစ်ခုခုကို `false` လို့ သတ်မှတ်ပြီး opt out လုပ်နိုင်ပါတယ်။

## Build environments

Build cache က `.next/cache` မှာ နေထိုင်ပါတယ်။ Builds တွေက အဲဒီ directory ကို build တစ်ခုစီ မတိုင်ခင် ပြန်လည်ရယူထားမှသာ မြန်ဆန်လာပါတယ်။

- **Self-hosted builds**: builds တွေကြားမှာ တူညီတဲ့ working directory ကို ပြန်လည် အသုံးပြုပါ။ Containerized builds တွေက clean layer ကနေ စတင်ပြီး — သင်က cache လုပ်ထားခြင်း (သို့) mount လုပ်ထားခြင်း မရှိရင် `.next/cache` ကို သယ်ဆောင် မသွားပါဘူး။
- **CI providers**: `.next/cache` အတွက် [build caching](/docs/nextjs/ci-build-caching) ကို configure လုပ်ပါ။

သင့် build environment က `.next/cache` ကို ဘယ်တော့မှ မထိန်းသိမ်းဘူးဆိုရင် — ဖတ်စရာ မရှိတဲ့ cache တစ်ခုကို ရေးနေစရာ မလိုအောင် `turbopackFileSystemCacheForBuild: false` လို့ သတ်မှတ်ပါ။

## Version History

| Version   | အပြောင်းအလဲ                                                    |
| --------- | ------------------------------------------------------------ |
| `v16.3.0` | Builds တွေအတွက် FileSystem caching ကို default အဖြစ် ဖွင့်ပေး။   |
| `v16.1.0` | Development အတွက် FileSystem caching ကို default အဖြစ် ဖွင့်ပေး။ |
| `v16.0.0` | Build နဲ့ dev အတွက် သီးခြား flags ပါတဲ့ Beta ထုတ်ဝေ။           |
| `v15.5.0` | Persistent caching ကို canary releases တွေမှာ experimental အဖြစ် ထုတ်ဝေ။ |
