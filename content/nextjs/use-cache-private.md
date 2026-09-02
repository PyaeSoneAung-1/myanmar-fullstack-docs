---
title: "use cache: private"
description: "'use cache: private' directive — cached scope အတွင်းမှာ cookies(), headers(), searchParams လို runtime request APIs တွေ သုံးနိုင်စေတဲ့ directive; ရလဒ်တွေကို server ပေါ်မှာ ဘယ်တော့မှ မသိမ်းဘဲ browser memory ထဲမှာပဲ cache လုပ်ခြင်း"
order: 59
source: "https://nextjs.org/docs/app/api-reference/directives/use-cache-private"
status: translated
updated: 2026-09-02
---

`'use cache: private'` directive က functions တွေကို cached scope တစ်ခုအတွင်းမှာ `cookies()`, `headers()` နဲ့ `searchParams` လို runtime request APIs တွေ ဝင်ရောက်သုံးနိုင်စေပါတယ်။ ဒါပေမယ့် — ရလဒ်တွေကို server ပေါ်မှာ **ဘယ်တော့မှ မသိမ်းပါဘူး**၊ browser ရဲ့ memory ထဲမှာပဲ cache လုပ်ပြီး — page reload တွေကြားမှာ မတည်မြဲပါဘူး။

`'use cache: private'` ကို ဒီအခြေအနေတွေမှာ သုံးပါ:

- Runtime data တွေကို ဝင်ရောက်သုံးနေပြီးသား function တစ်ခုကို cache လုပ်ချင်ပြီး — [runtime access ကို အပြင်ဘက် ရွှေ့ပြီး values တွေကို arguments အဖြစ် ပို့တာ](https://nextjs.org/docs/app/getting-started/caching#working-with-runtime-apis) က လက်တွေ့ မဖြစ်နိုင်တဲ့အခါ
- Compliance လိုအပ်ချက်တွေက တချို့ data တွေကို server ပေါ်မှာ ယာယီတောင်မှ သိမ်းတာကို တားမြစ်ထားတဲ့အခါ

ဒီ directive က runtime data တွေကို ဝင်ရောက်သုံးလို့ — function က server render တိုင်းမှာ run ပြီး [static shell](https://nextjs.org/docs/app/getting-started/caching#prerendering) generation ကာလအတွင်း run လုပ်ခြင်းကနေ ဖယ်ထုတ်ခံရပါတယ်။

`'use cache: private'` အတွက် custom cache handlers တွေကို configure လုပ်ဖို့ **မဖြစ်နိုင်ပါဘူး**။

Cache directives တွေ နှိုင်းယှဉ်ချက်အတွက် — [How `use cache: remote` differs from `use cache` and `use cache: private`](/docs/nextjs/use-cache-remote#how-use-cache-remote-differs-from-use-cache-and-use-cache-private) ကို ကြည့်ပါ။

## အသုံးပြုပုံ (Usage)

`'use cache: private'` သုံးဖို့ — သင့် `next.config.ts` file ထဲမှာ [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) flag ကို enable လုပ်ပါ:

```tsx filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

```jsx filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
}

module.exports = nextConfig
```

ပြီးရင် သင့် function မှာ `cacheLife` configuration တစ်ခုနဲ့အတူ `'use cache: private'` ကို ထည့်ပါ။

### အခြေခံ ဥပမာ

ဒီဥပမာမှာ `'use cache: private'` scope တစ်ခုအတွင်းမှာ cookies တွေကို ဝင်ရောက်သုံးနိုင်တာကို ပြထားပါတယ်:

```tsx filename="app/product/[id]/page.tsx" switcher
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

export async function generateStaticParams() {
  return [{ id: '1' }]
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div>
      <ProductDetails id={id} />
      <Suspense fallback={<div>Loading recommendations...</div>}>
        <Recommendations productId={id} />
      </Suspense>
    </div>
  )
}

async function Recommendations({ productId }: { productId: string }) {
  const recommendations = await getRecommendations(productId)

  return (
    <div>
      {recommendations.map((rec) => (
        <ProductCard key={rec.id} product={rec} />
      ))}
    </div>
  )
}

async function getRecommendations(productId: string) {
  'use cache: private'
  cacheTag(`recommendations-${productId}`)
  cacheLife({ stale: 60 })

  // Access cookies within private cache functions
  const sessionId = (await cookies()).get('session-id')?.value || 'guest'

  return getPersonalizedRecommendations(productId, sessionId)
}
```

```jsx filename="app/product/[id]/page.js" switcher
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

export async function generateStaticParams() {
  return [{ id: '1' }]
}

export default async function ProductPage({ params }) {
  const { id } = await params

  return (
    <div>
      <ProductDetails id={id} />
      <Suspense fallback={<div>Loading recommendations...</div>}>
        <Recommendations productId={id} />
      </Suspense>
    </div>
  )
}

async function Recommendations({ productId }) {
  const recommendations = await getRecommendations(productId)

  return (
    <div>
      {recommendations.map((rec) => (
        <ProductCard key={rec.id} product={rec} />
      ))}
    </div>
  )
}

async function getRecommendations(productId) {
  'use cache: private'
  cacheTag(`recommendations-${productId}`)
  cacheLife({ stale: 60 })

  // Access cookies within private cache functions
  const sessionId = (await cookies()).get('session-id')?.value || 'guest'

  return getPersonalizedRecommendations(productId, sessionId)
}
```

> **သိထားသင့်သည်:** Link တစ်ခုချင်းစီရဲ့ prefetching အလုပ်လုပ်ဖို့ `stale` time က အနည်းဆုံး စက္ကန့် ၃၀ ရှိရပြီး — content က route ရဲ့ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) ထဲမှာ ပါဝင်ဖို့ဆိုရင် အနည်းဆုံး ၅ မိနစ် ရှိရပါတယ်။ အသေးစိတ်အတွက် [`cacheLife` prerendering behavior](/docs/nextjs/cache-life#prerendering-behavior) ကို ကြည့်ပါ။

## Private caches တွေထဲမှာ ခွင့်ပြုထားတဲ့ Request APIs

အောက်က request-specific APIs တွေကို `'use cache: private'` functions တွေအတွင်းမှာ သုံးနိုင်ပါတယ်:

| API            | `use cache` ထဲမှာ ခွင့်ပြု? | `'use cache: private'` ထဲမှာ ခွင့်ပြု? |
| -------------- | ---------------------- | --------------------------------- |
| `cookies()`    | No                     | Yes                               |
| `headers()`    | No                     | Yes                               |
| `searchParams` | No                     | Yes                               |
| `connection()` | No                     | No                                |

> **မှတ်ချက်:** [`connection()`](https://nextjs.org/docs/app/api-reference/functions/connection) API ကို `use cache` ရော `'use cache: private'` နှစ်ခုလုံးမှာ တားမြစ်ထားပါတယ် — သူက connection-specific ဖြစ်တဲ့ လုံခြုံစွာ cache လုပ်လို့မရတဲ့ အချက်အလက်တွေကို ပေးစွမ်းလို့ပါ။

## Version History

| Version   | အပြောင်းအလဲ                                                              |
| --------- | -------------------------------------------------------------------- |
| `v16.0.0` | `"use cache: private"` ကို Cache Components feature နဲ့အတူ enable လုပ်နိုင်ပါပြီ။ |
