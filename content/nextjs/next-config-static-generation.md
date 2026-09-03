---
title: "staticGeneration* (Static Generation သတ်မှတ်ချက်များ)"
description: "staticGeneration* options — advanced use cases များအတွက် Static Generation process ကို configure လုပ်ရန် experimental သတ်မှတ်ချက်များ: staticGenerationRetryCount, staticGenerationMaxConcurrency, staticGenerationMinPagesPerWorker"
order: 170
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/staticGeneration"
status: translated
updated: 2026-09-03
---

`staticGeneration*` options တွေက advanced use cases တွေအတွက် Static Generation process ကို configure လုပ်နိုင်အောင် ခွင့်ပြုပါတယ်။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
const nextConfig = {
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
  },
}

module.exports = nextConfig
```

## Config Options

အောက်ပါ options တွေ ရနိုင်ပါတယ်:

- `staticGenerationRetryCount`: Page တစ်ခုရဲ့ generation က မအောင်မြင်ရင် — build မကျရှုံးခင် ပြန်ကြိုးစားရမယ့် အကြိမ်အရေအတွက်။
- `staticGenerationMaxConcurrency`: Worker တစ်ခုစီမှာ process လုပ်ရမယ့် pages အများဆုံး အရေအတွက်။
- `staticGenerationMinPagesPerWorker`: Worker အသစ်တစ်ခု မစတင်ခင် process လုပ်ထားရမယ့် pages အနည်းဆုံး အရေအတွက်။
