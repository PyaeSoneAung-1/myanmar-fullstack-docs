---
title: "serverComponentsHmrCache (HMR refresh များတွင် fetch cache လုပ်ခြင်း)"
description: "serverComponentsHmrCache option — local development တွင် Hot Module Replacement (HMR) refreshes ကြားမှ Server Components ၏ `fetch` responses များကို cache လုပ်ရန် experimental သတ်မှတ်ချက်; default true, false သတ်မှတ်၍ ပိတ်နိုင်"
order: 164
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/serverComponentsHmrCache"
status: translated
updated: 2026-09-03
---

Experimental `serverComponentsHmrCache` option က local development အတွင်းမှာ Hot Module Replacement (HMR) refreshes တွေကို ဖြတ်ပြီး Server Components ထဲက `fetch` responses တွေကို cache လုပ်နိုင်အောင် ခွင့်ပြုပါတယ်။ ဒါကြောင့် responses တွေ မြန်ဆန်လာပြီး — ငွေပေးချေရတဲ့ (billed) API calls တွေရဲ့ ကုန်ကျစရိတ်လည်း လျော့ကျပါတယ်။

Default အားဖြင့် HMR cache က `cache: 'no-store'` option ပါတဲ့ requests တွေ အပါအဝင် `fetch` requests အားလုံးကို သက်ရောက်ပါတယ်။ ဆိုလိုတာက — HMR refreshes တွေကြားမှာ cache မလုပ်ထားတဲ့ (uncached) requests တွေက ဒေတာအသစ်ကို ပြသမှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် navigation လုပ်တဲ့အခါ (သို့) full-page reload လုပ်တဲ့အခါမှာတော့ cache က ရှင်းလင်းသွားပါတယ်။

သင့် `next.config.js` file ထဲမှာ `serverComponentsHmrCache` ကို `false` လို့ သတ်မှတ်ပြီး HMR cache ကို ပိတ်နိုင်ပါတယ်:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsHmrCache: false, // default က true
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false, // default က true
  },
}

module.exports = nextConfig
```

> **သိထားသင့်သည် (Good to know):** ပိုကောင်းတဲ့ observability (စောင့်ကြည့်စစ်ဆေးနိုင်မှု) အတွက် — development အတွင်းမှာ fetch cache hits နဲ့ misses တွေကို console ထဲ log လုပ်ပေးတဲ့ [`logging.fetches`](/docs/nextjs/next-config-logging) option ကို သုံးဖို့ အကြံပြုပါတယ်။
