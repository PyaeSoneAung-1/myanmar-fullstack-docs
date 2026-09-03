---
title: "cacheLife (custom cache profiles သတ်မှတ်ချက်)"
description: "cacheLife option — component (သို့) function များအတွင်း cacheLife() function နှင့် 'use cache' directive scope တွင် သုံးရန် custom cache profiles (stale/revalidate/expire) များကို next.config.js တွင် သတ်မှတ်နည်း; cacheComponents flag လိုအပ်"
order: 210
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife"
status: translated
updated: 2026-09-03
---

`cacheLife` option က — component (သို့) function တွေထဲမှာ [`cacheLife`](/docs/nextjs/cache-life) function ကို သုံးတဲ့အခါ၊ (သို့) [`use cache`](/docs/nextjs/use-cache) directive ရဲ့ scope အတွင်းမှာ သုံးတဲ့အခါ — **custom cache profiles** တွေကို သတ်မှတ်ခွင့် ပေးပါတယ်။

## Usage (အသုံးပြုပုံ)

Profile တစ်ခု သတ်မှတ်ဖို့ — [`cacheComponents` flag](/docs/nextjs/next-config-cache-components) ကို ဖွင့်ပြီး `next.config.js` file ထဲက `cacheLife` object ထဲမှာ cache profile ကို ထည့်ပါ။ ဥပမာ — `blog` profile တစ်ခု:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    blog: {
      stale: 3600, // 1 နာရီ
      revalidate: 900, // 15 မိနစ်
      expire: 86400, // 1 ရက်
    },
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
module.exports = {
  cacheComponents: true,
  cacheLife: {
    blog: {
      stale: 3600, // 1 နာရီ
      revalidate: 900, // 15 မိနစ်
      expire: 86400, // 1 ရက်
    },
  },
}
```

ဒီလိုဆိုရင် အခု ဒီ custom `blog` configuration ကို သင့် component (သို့) function ထဲမှာ အောက်ပါအတိုင်း သုံးနိုင်ပါပြီ:

```tsx filename="app/actions.ts" highlight={4,5} switcher
import { cacheLife } from 'next/cache'

export async function getCachedData() {
  'use cache'
  cacheLife('blog')
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return data
}
```

```jsx filename="app/actions.js" highlight={4,5} switcher
import { cacheLife } from 'next/cache'

export async function getCachedData() {
  'use cache'
  cacheLife('blog')
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return data
}
```

နာမည်တူ profile တစ်ခု (`default`, `seconds`, `minutes`, `hours`, `days`, `weeks` (သို့) `max`) ကို သတ်မှတ်ပြီး built-in profile တစ်ခုကို override လုပ်လို့လည်း ရပါတယ်။ [Default cache profiles တွေကို override လုပ်ခြင်း](/docs/nextjs/cache-life) ကို ကြည့်ပါ။

## Reference

Configuration object မှာ အောက်ပါပုံစံအတိုင်း key-value တွေ ပါဝင်ပါတယ်:

| **Property** | **Value** | **Description**                                                       | **Requirement**                    |
| ------------ | --------- | --------------------------------------------------------------------- | ---------------------------------- |
| `stale`      | `number`  | Client က server ကို ပြန်မစစ်ဘဲ value တစ်ခုကို cache ထားသင့်တဲ့ ကြာချိန်။   | Optional                           |
| `revalidate` | `number`  | Server ပေါ်မှာ cache ကို refresh လုပ်သင့်တဲ့ အကြိမ်ရေ; revalidate လုပ်နေစဉ်အတွင်း stale value တွေကို ဆက်ပြန် ပေးနိုင်သည်။ | Optional                           |
| `expire`     | `number`  | Value တစ်ခု dynamic အဖြစ် မပြောင်းမီ stale အဖြစ် နေနိုင်တဲ့ အများဆုံး ကြာချိန်။ | Optional — `revalidate` ထက် ပိုရှည်ရမည် |
