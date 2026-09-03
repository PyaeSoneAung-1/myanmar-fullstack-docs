---
title: "prefetchInlining (prefetch response စုစည်းမှု ချိန်ညှိချက်)"
description: "experimental.prefetchInlining option — App Router ၏ small segment prefetch responses များကို response တစ်ခုတည်းထဲ စုစည်း (bundle) လုပ်သည့် အပြုအမူကို override (သို့) ပိတ်ရန်; maxSize/maxBundleSize thresholds ဖြင့် ချိန်ညှိနိုင်; default ဖွင့်ထား"
order: 211
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/prefetchInlining"
status: translated
updated: 2026-09-03
---

App Router က route တစ်ခုကို prefetch လုပ်တဲ့အခါ — segment response အသေးလေးတွေကို တစ်ခုချင်းစီ သပ်သပ် request လုပ်မယ့်အစား response တစ်ခုတည်းထဲ စုပြီး (bundle) ထည့်နိုင်ပါတယ်။ ဒါက prefetch request အရေအတွက်ကို လျှော့ချပေးပေမယ့် — route တွေကြားမှာ shared segment data တချို့ ထပ်နေတတ်ပါတယ်။ ဒီအပြုအမူက default အားဖြင့် ဖွင့်ထားပြီး — app အများစုက ဒီအတိုင်းပဲ ထားသင့်ပါတယ်။

`experimental.prefetchInlining` option က ဒီအပြုအမူကို override လုပ်ဖို့ (သို့) — navigation ပြဿနာတွေ ရှာဖွေနေချိန် (သို့) request အရေအတွက် တိုင်းတာချင်တဲ့အခါ inlining ကို ပိတ်ဖို့ ခွင့်ပြုပါတယ်။ App အများစုအတွက်တော့ default အပြုအမူကို ပြောင်းစရာ မလိုပါဘူး။

> **သိထားသင့်သည် (Good to know):** Inlining အပြုအမူက App Router ရဲ့ အမြဲတမ်း အစိတ်အပိုင်း တစ်ခုပါ။ `experimental.prefetchInlining` configuration ပဲ experimental ဖြစ်တာမို့ — ၎င်းရဲ့ options တွေ နောက်ပိုင်း ပြောင်းလဲနိုင်ပါသေးတယ်။

## Usage (အသုံးပြုပုံ)

Prefetch inlining ကို ပိတ်ဖို့ — `experimental.prefetchInlining` ကို `false` လို့ သတ်မှတ်ပါ:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    prefetchInlining: false,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    prefetchInlining: false,
  },
}

module.exports = nextConfig
```

Inlining ကို မပိတ်ဘဲ thresholds တွေကို override လုပ်ချင်ရင် — object တစ်ခု ပေးပါ။ ချန်လှပ်ထားတဲ့ value တိုင်းက သူ့ရဲ့ default ကို ဆက်သုံးပါတယ်:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    prefetchInlining: {
      maxSize: 2048,
      maxBundleSize: 10240,
    },
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    prefetchInlining: {
      maxSize: 2048,
      maxBundleSize: 10240,
    },
  },
}

module.exports = nextConfig
```

## Reference

| Value    | Description                                                                 |
| -------- | --------------------------------------------------------------------------- |
| `true`   | Prefetch responses တွေကို default thresholds တွေနဲ့ inline လုပ်သည်။ ဒါက default ဖြစ်သည်။ |
| `false`  | Prefetch inlining ကို ပိတ်သည်။ Segment တစ်ခုစီကို ကိုယ်ပိုင် request တစ်ခုအနေနဲ့ prefetch လုပ်သည်။ |
| `object` | သင် သတ်မှတ်လိုက်တဲ့ `maxSize` (သို့) `maxBundleSize` တွေကို သုံးပြီး prefetch responses တွေကို inline လုပ်သည်။ |

Object တစ်ခု ပေးလိုက်တဲ့အခါ — အောက်ပါ options တွေက thresholds တွေကို ထိန်းချုပ်ပါတယ်။ နှစ်ခုလုံးကို gzip-compressed segment response ရဲ့ bytes နဲ့ တိုင်းတာပါတယ်:

| Option          | Type     | Default | Description                                                                        |
| --------------- | -------- | ------- | ---------------------------------------------------------------------------------- |
| `maxSize`       | `number` | `2048`  | Inline လုပ်ဖို့ အရည်အချင်းပြည့်မီနိုင်တဲ့ single segment response တစ်ခုရဲ့ အများဆုံး အရွယ်အစား။ |
| `maxBundleSize` | `number` | `10240` | Path တစ်လျှောက် bundled prefetch response တစ်ခုတည်းထဲ inline လုပ်လို့ရတဲ့ စုစုပေါင်း အရွယ်အစား အများဆုံး။ |

Threshold တွေ နိမ့်လေလေ — per-segment deduplication (segment တစ်ခုချင်းစီအလိုက် ထပ်နေမှု ဖယ်ရှားခြင်း) ပိုများလေလေပါ။ မြင့်လေလေ — data တွေ ပိုပြီး inline ဖြစ်ကာ request အရေအတွက် ပိုလျော့သွားလေလေပါ။

## Version History

| Version | Changes                                             |
| ------- | --------------------------------------------------- |
| 16.3.0  | `experimental.prefetchInlining` ကို default အနေနဲ့ ဖွင့်ပေးခဲ့သည်။ |
| 16.2.0  | `experimental.prefetchInlining` ကို စတင် မိတ်ဆက်ခဲ့သည်။       |
