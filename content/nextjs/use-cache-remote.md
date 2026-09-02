---
title: "use cache: remote"
description: "'use cache: remote' directive — remote cache handlers တွေနဲ့ persistent, shared caching အတွက် သုံးတဲ့ directive; ဘယ်အချိန် ရှောင်ရမလဲ/သုံးသင့်လဲ၊ nesting rules, cache key ထည့်သွင်းစဉ်းစားချက်များ နဲ့ ဥပမာများ"
order: 60
source: "https://nextjs.org/docs/app/api-reference/directives/use-cache-remote"
status: translated
updated: 2026-09-02
---

Application အများစုအတွက် `use cache` directive က လုံလောက်ပေမယ့် — cached operations တွေ မျှော်လင့်ထားတာထက် ပိုပြီး မကြာခဏ ပြန် run နေတာ (သို့) သင့် upstream services တွေ (CMS, databases, external APIs) ဆီ hits တွေ ပိုများနေတာကို သတိထားမိနိုင်ပါတယ်။ ဒါ ဖြစ်နိုင်တာက `use cache` က entries တွေကို in-memory မှာ သိမ်းလို့ပါ — အဲဒီမှာ မွေးရာပါ ကန့်သတ်ချက်တွေ ရှိပါတယ်:

- Entries အသစ်တွေ နေရာရဖို့ cache entries တွေ ဖယ်ထုတ်ခံရခြင်း (eviction)
- သင့် deployment environment ရဲ့ memory ကန့်သတ်ချက်တွေ
- Cache က requests (သို့) server restarts တွေကြားမှာ မတည်မြဲခြင်း

`use cache` က server-side caching ရဲ့ အပြင် တန်ဖိုးတွေ ဆက်ပေးနေမှန်း သတိပြုပါ — ဘာတွေကို prefetch လုပ်လို့ရလဲ Next.js ကို အသိပေးပြီး client-side navigation အတွက် stale times တွေကိုလည်း သတ်မှတ်ပေးပါတယ်။

`'use cache: remote'` directive က cached output တစ်ခုကို in-memory အစား remote cache တစ်ခုထဲမှာ သိမ်းသင့်ကြောင်း declaratively သတ်မှတ်နိုင်စေပြီး — server instances အားလုံးကြားမှာ share လုပ်ထားတဲ့ durable caching ကို ပေးပါတယ်။ ဒါနဲ့အတူ tradeoffs တွေ ပါလာပါတယ်: infrastructure ကုန်ကျစရိတ်နဲ့ cache lookups ကာလအတွင်း network latency တို့ ဖြစ်ပါတယ်။

## အသုံးပြုပုံ (Usage)

`'use cache: remote'` သုံးဖို့ — သင့် `next.config.ts` file ထဲမှာ [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) flag ကို enable လုပ်ပါ:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
}

module.exports = nextConfig
```

ပြီးရင် remote caching သင့်တယ်လို့ ဆုံးဖြတ်ထားတဲ့ functions (သို့) components တွေမှာ `'use cache: remote'` ကို ထည့်ပါ။ Handler ရဲ့ implementation ကို [`cacheHandlers`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) ကနေ configure လုပ်ပါတယ် — ဒါပေမယ့် hosting providers တွေက ပုံမှန်အားဖြင့် ဒါကို အလိုအလျောက် ပေးသင့်ပါတယ်။ Self-hosting လုပ်နေတယ်ဆိုရင် — သင့် cache storage ကို တည်ဆောက်ဖို့ `cacheHandlers` configuration reference ကို ကြည့်ပါ။

### Remote caching ကို ဘယ်အခါ ရှောင်ရမလဲ

- သင့် data layer ကို ဝန်းရံထားတဲ့ server-side cache key-value store တစ်ခု ရှိပြီးသားဆိုရင် — caching layer အသစ်တစ်ခု ထပ်ထည့်စရာ မလိုဘဲ static shell ထဲ data တွေ ထည့်ဖို့ `use cache` က လုံလောက်နိုင်ပါတယ်
- Operations တွေက နီးကပ်မှု (သို့) local access ကြောင့် မြန်ပြီးသား (< 50ms) ဆိုရင် — remote cache lookup က performance တိုးတက်စေချင်မှ တိုးစေပါလိမ့်မယ်
- Cache keys တွေက request တစ်ခုချင်းစီမှာ မတူတဲ့ values တွေ အများစု ဖြစ်နေရင် (search filters, price ranges, user-specific parameters) — cache utilization က သုညနီးပါး ဖြစ်ပါလိမ့်မယ်
- Data တွေက မကြာခဏ ပြောင်းနေရင် (စက္ကန့်ပိုင်းကနေ မိနစ်ပိုင်း) — cache hits တွေက မြန်မြန် stale ဖြစ်ပြီး — misses တွေ မကြာခဏ ဖြစ်ကာ upstream revalidation ကို စောင့်ရပါလိမ့်မယ်

### Remote caching က ဘယ်အခါ အဓိပ္ပာယ် ရှိလဲ

Remote caching က content တွေကို request time ဆီ ရွှေ့ဆိုင်းထားတဲ့အခါ (static shell ရဲ့ အပြင်ဘက်) အကျိုးအရှိဆုံး ဖြစ်ပါတယ်။ ဒါက ပုံမှန်အားဖြင့် component တစ်ခုက [`cookies()`](/docs/nextjs/cookies), [`headers()`](/docs/nextjs/headers), (သို့) [`searchParams`](/docs/nextjs/file-conventions-page#searchparams-optional) လို request values တွေကို ဝင်ရောက်သုံးပြီး Suspense boundary တစ်ခုအတွင်းမှာ နေရာချခံရတဲ့အခါ ဖြစ်ပါတယ်။ ဒီ context ထဲမှာ:

- Request တစ်ခုစီက component ကို run ပြီး cache ကို lookup လုပ်ပါတယ်
- Serverless environments တွေမှာ instance တစ်ခုစီမှာ ကိုယ်ပိုင် ephemeral memory ရှိလို့ cache hit rates နည်းပါတယ်
- Remote caching က instances အားလုံးကြားမှာ shared cache တစ်ခု ပေးပြီး — hit rates တွေ မြှင့်တင်ကာ backend load တွေ လျှော့ချပေးပါတယ်

`'use cache: remote'` အတွက် ဆွဲဆောင်မှုရှိတဲ့ အခြေအနေတွေ:

- **Rate-limited APIs**: သင့် upstream service မှာ သင် ထိမှန်နိုင်ခြေရှိတဲ့ rate limits (သို့) request quotas တွေ ရှိနေတာ
- **Slow backends တွေကို ကာကွယ်ခြင်း**: သင့် database (သို့) API က traffic များတဲ့အခါ bottleneck ဖြစ်နေတာ
- **Expensive operations**: ထပ်ခါထပ်ခါ run ရတာ ကုန်ကျစရိတ် များတဲ့ database queries (သို့) computations တွေ
- **Flaky (သို့) မယုံကြည်ရတဲ့ services**: ရံဖန်ရံခါ ကျရှုံးတတ်တဲ့ (သို့) availability ပြဿနာရှိတဲ့ external services တွေ

ဒီကိစ္စတွေမှာ — remote caching ရဲ့ ကုန်ကျစရိတ်နဲ့ latency က ပိုဆိုးတဲ့ ရလဒ်တွေ (rate limit errors, backend overload, compute bills မြင့်တာ, (သို့) user experience ကျဆင်းတာ) တွေကို ရှောင်ရှားပေးလို့ တန်ပါတယ်။

Static shell content တွေအတွက်တော့ `use cache` က ပုံမှန်အားဖြင့် လုံလောက်ပါတယ်။ သင့် upstream source က concurrent revalidation requests တွေကို မကိုင်တွယ်နိုင်ဘူးဆိုရင် (rate-limited CMS တစ်ခုလိုမျိုး) — `use cache: remote` က shared cache layer တစ်ခုအနေနဲ့ လုပ်ဆောင်ပါတယ်။ ဒါက database တစ်ခုရဲ့ ရှေ့မှာ key-value store တစ်ခု ထားတာနဲ့ တူညီတဲ့ pattern ပါ — code ထဲမှာ ကြေညာထားတာပဲ ကွာပါတယ်။

### How `use cache: remote` differs from `use cache` and `use cache: private`

Next.js က caching directives သုံးခု ပေးပါတယ် — တစ်ခုချင်းစီက မတူညီတဲ့ use cases တွေအတွက် ဒီဇိုင်းထားပါတယ်:

| Feature                                 | `use cache`                     | `'use cache: remote'`             | `'use cache: private'` |
| --------------------------------------- | ------------------------------- | --------------------------------- | ---------------------- |
| **Server-side caching**                 | In-memory (သို့) cache handler      | Remote cache handler              | None                   |
| **Cache scope**                         | Users အားလုံးကြားမှာ shared    | Users အားလုံးကြားမှာ shared      | Per-client (browser)   |
| **cookies/headers တွေကို တိုက်ရိုက် သုံးလို့ရလား** | No (arguments အဖြစ် ပို့ရမယ်)     | No (arguments အဖြစ် ပို့ရမယ်)       | Yes                    |
| **Server cache utilization**            | Static shell အပြင်မှာ နည်းနိုင် | High (instances တွေကြားမှာ shared) | N/A                    |
| **ထပ်ဆောင်း ကုန်ကျစရိတ်**                    | None                            | Infrastructure (storage, network) | None                   |
| **Latency သက်ရောက်မှု**                  | None                            | Cache handler lookup              | None                   |
| **Deploys ကြားမှာ တည်မြဲလား**             | No                              | No                                | N/A                    |

### Deploys ကြားမှာ persistence (တည်မြဲမှု)

Remote cache entries တွေက deploys တွေကြားမှာ မတည်မြဲပါဘူး။ Cache key ထဲမှာ `deploymentId` (configure လုပ်ထားရင်) (သို့) `buildId` ပါဝင်လို့ — build အသစ်တစ်ခုက keys အသစ်တွေ ထုတ်ပေးပြီး ယခင် build ရဲ့ entries တွေက ဆက်လက်လှမ်းမီလို့ မရတော့ပါဘူး။ Key ပေါင်းစပ်ပုံ အပြည့်အစုံအတွက် [Cache keys](/docs/nextjs/use-cache#cache-keys) ကို ကြည့်ပါ။

ဒါက ရည်ရွယ်ချက်ရှိရှိ လုပ်ထားတာပါ။ Builds နှစ်ခုကြားမှာ function ရဲ့ identity hash (သို့) သူ့ရဲ့ return value ပုံစံက ပြောင်းလဲနိုင်ပါတယ်။ CMS client တစ်ခု upgrade လုပ်တာ, cached function တစ်ခု refactor လုပ်တာ, (သို့) dependency တစ်ခု ပြောင်းလိုက်တာက — older callers တွေ မျှော်လင့်ထားတာနဲ့ မကိုက်ညီတဲ့ တန်ဖိုးတစ်ခု ထုတ်ပေးနိုင်လို့ — deploys တွေကြားမှာ entries တွေ ပြန်သုံးတာက stale (သို့) ပုံစံပျက်နေတဲ့ data တွေ ပေးမိစေနိုင်ပါတယ်။

Deploys တွေကြားမှာ တည်မြဲတဲ့ entries တွေ လိုအပ်ရင် — non-`fetch` functions တွေအတွက် [`unstable_cache`](https://nextjs.org/docs/app/api-reference/functions/unstable_cache) ကို သုံးပါ (သို့) [`fetch`](https://nextjs.org/docs/app/api-reference/functions/fetch) cache ကို အားကိုးပါ။

### Runtime data တွေနဲ့ caching လုပ်ခြင်း

`use cache` ရော `'use cache: remote'` ပါ — cookies (သို့) search params လို runtime values တွေကို တိုက်ရိုက် ဝင်ရောက်လို့ မရပါဘူး။ ဒီ values တွေကို ထုတ်ယူပြီး cached functions တွေဆီ arguments အဖြစ် ပို့နိုင်ပါတယ်။ ဒီ pattern အတွက် [runtime data နဲ့ အလုပ်လုပ်ခြင်း](/docs/nextjs/caching) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:** `use cache` က entries တွေကို in-memory မှာ သိမ်းပါတယ်။ Serverless environments တွေမှာ memory က instances တွေကြားမှာ share မလုပ်ရဘဲ — request တစ်ခု ဆောင်ရွက်ပေးပြီးနောက် ပုံမှန်အားဖြင့် ဖျက်ဆီးခံရလို့ — runtime caching အတွက် cache misses တွေ မကြာခဏ ဖြစ်စေပါတယ်။

### Cache key ထည့်သွင်းစဉ်းစားချက်များ

Cache keys တွေထဲမှာ ဘယ် values တွေ ထည့်လဲဆိုတာ သေချာ စဉ်းစားပါ။ Unique value တစ်ခုချင်းစီက cache entry သီးခြားစီ တစ်ခု ဖန်တီးပြီး — cache utilization ကို လျှော့ချပါတယ်။ Search filters ပါတဲ့ ဒီဥပမာကို ကြည့်ပါ:

```tsx filename="app/products/[category]/page.tsx"
import { Suspense } from 'react'

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ minPrice?: string }>
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList params={params} searchParams={searchParams} />
    </Suspense>
  )
}

async function ProductList({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ minPrice?: string }>
}) {
  const { category } = await params

  const { minPrice } = await searchParams

  // Cache only on category (few unique values)
  // Don't include price filter (many unique values)
  const products = await getProductsByCategory(category)

  // Filter price in memory instead of creating cache entries
  // for every price value
  const filtered = minPrice
    ? products.filter((p) => p.price >= parseFloat(minPrice))
    : products

  return <div>{/* render filtered products */}</div>
}

async function getProductsByCategory(category: string) {
  'use cache: remote'
  // Only category is part of the cache key
  // Much better utilization than caching every price filter value
  return db.products.findByCategory(category)
}
```

ဒီဥပမာမှာ remote handler က cache entry တစ်ခုစီမှာ data ပိုများများ သိမ်းပြီး (category တစ်ခုထဲက products အားလုံး) — ပိုကောင်းတဲ့ cache hit rates တွေ ရဖို့ပါ။ Cache misses တွေရဲ့ ကုန်ကျစရိတ် (backend ကို ထိမှန်တာ) က entry ပိုကြီးတာရဲ့ storage ကုန်ကျစရိတ်ထက် များတဲ့အခါ ဒါက တန်ပါတယ်။

User-specific data တွေမှာလည်း ဒီနိယာမ အတူတူပါပဲ။ User တစ်ဦးချင်းစီရဲ့ data တွေကို တိုက်ရိုက် cache လုပ်မယ့်အစား — ဘယ် shared data တွေကို cache လုပ်ရမလဲ ဆုံးဖြတ်ဖို့ user preferences တွေကို သုံးပါ။

ဥပမာ — users တွေရဲ့ session ထဲမှာ language preference တစ်ခု ရှိတယ်ဆိုရင် — အဲဒီ preference ကို ထုတ်ယူပြီး shared content တွေကို cache လုပ်ဖို့ သုံးပါ:

- User တစ်ဦးစီအတွက် entry တစ်ခုစီ ဖန်တီးပေးတဲ့ `getUserProfile(sessionID)` ကို remote cache လုပ်မယ့်အစား
- Language တစ်ခုစီအတွက် entry တစ်ခုစီ ဖန်တီးပေးတဲ့ `getCMSContent(language)` ကို remote cache လုပ်ပါ

```tsx filename="app/components/welcome-message.tsx"
import { cookies } from 'next/headers'
import { cacheLife } from 'next/cache'

export async function WelcomeMessage() {
  // Extract the language preference (not unique per user)
  const language = (await cookies()).get('language')?.value || 'en'

  // Cache based on language (few unique values: en, es, fr, de, etc.)
  // All users who prefer 'en' share the same cache entry
  const content = await getCMSContent(language)

  return <div>{content.welcomeMessage}</div>
}

async function getCMSContent(language: string) {
  'use cache: remote'
  cacheLife({ expire: 3600 })
  // Creates ~10-50 cache entries (one per language)
  // instead of thousands (one per user)
  return cms.getHomeContent(language)
}
```

ဒီနည်းနဲ့ language တူတဲ့ users တွေ အားလုံး cache entry တစ်ခုတည်းကို share လုပ်ပြီး — cache utilization ကောင်းမွန်ကာ သင့် CMS ပေါ်က load ကို လျှော့ချပေးပါတယ်။

ဥပမာ နှစ်ခုလုံးမှာ pattern က အတူတူပါပဲ — unique values နည်းတဲ့ dimension ကို ရှာပါ (category vs. price, language vs. user ID)၊ အဲဒီ dimension ပေါ်မှာ cache လုပ်ပြီး — ကျန်တာတွေကို in-memory မှာ filter (သို့) ရွေးချယ်ပါ။

`getUserProfile` သုံးတဲ့ service က သင့် frontend load နဲ့အညီ scale မလုပ်နိုင်ဘူးဆိုရင် — in-memory caching အတွက် `cacheLife` တိုတိုနဲ့ `use cache` directive ကို ဆက်သုံးနိုင်ပါသေးတယ်။ ဒါပေမယ့် user data အများစုအတွက်တော့ — source ကနေ တိုက်ရိုက် fetch လုပ်တာကို ဦးစားပေး ဖြစ်နိုင်ပါတယ် (အပေါ်က guidelines တွေမှာ ဖော်ပြခဲ့သလို key/value store တစ်ခုထဲမှာ wrap လုပ်ပြီးသား ဖြစ်နိုင်ပါတယ်)။

Compliance လိုအပ်ချက်တွေ ရှိတာ (သို့) runtime data တွေကို arguments အဖြစ် ပို့ဖို့ refactor မလုပ်နိုင်တဲ့အခါမှသာ — [`'use cache: private'`](/docs/nextjs/use-cache-private) ကို သုံးပါ။

### Nesting rules

Remote caches တွေမှာ တိကျတဲ့ nesting rules တွေ ရှိပါတယ်:

- Remote caches တွေက တခြား remote caches တွေအတွင်းမှာ nest လုပ်လို့ **ရပါတယ်** (`'use cache: remote'`)
- Remote caches တွေက regular caches တွေအတွင်းမှာ nest လုပ်လို့ **ရပါတယ်** (`'use cache'`)
- Remote caches တွေက private caches တွေအတွင်းမှာ nest လုပ်လို့ **မရပါဘူး** (`'use cache: private'`)
- Private caches တွေက remote caches တွေအတွင်းမှာ nest လုပ်လို့ **မရပါဘူး**

```tsx
// VALID: Remote inside remote
async function outerRemote() {
  'use cache: remote'
  const result = await innerRemote()
  return result
}

async function innerRemote() {
  'use cache: remote'
  return getData()
}

// VALID: Remote inside regular cache
async function outerCache() {
  'use cache'
  // The inner remote cache will work when deferred to request time
  const result = await innerRemote()
  return result
}

async function innerRemote() {
  'use cache: remote'
  return getData()
}

// INVALID: Remote inside private
async function outerPrivate() {
  'use cache: private'
  const result = await innerRemote() // Error!
  return result
}

async function innerRemote() {
  'use cache: remote'
  return getData()
}

// INVALID: Private inside remote
async function outerRemote() {
  'use cache: remote'
  const result = await innerPrivate() // Error!
  return result
}

async function innerPrivate() {
  'use cache: private'
  return getData()
}
```

## ဥပမာများ (Examples)

အောက်က ဥပမာတွေက `'use cache: remote'` သုံးတဲ့ အသုံးများတဲ့ patterns တွေကို ပြပါတယ်။ `cacheLife` parameters (`stale`, `revalidate`, `expire`) အသေးစိတ်အတွက် — [`cacheLife` API reference](/docs/nextjs/cache-life) ကို ကြည့်ပါ။

### User preferences တွေနဲ့

User ရဲ့ currency preference ပေါ် မူတည်ပြီး product pricing တွေကို cache လုပ်ပါ။ Currency က cookie ထဲမှာ သိမ်းထားလို့ — ဒီ component က request time မှာ render ပါတယ်။ Currency တူတဲ့ users အားလုံးက cached price ကို share လုပ်ကြပြီး — serverless environments တွေမှာ instances အားလုံးက remote cache တစ်ခုတည်းကို share လုပ်လို့ — ဒီမှာ remote caching က တန်ဖိုးရှိပါတယ်။

```tsx filename="app/product/[id]/page.tsx" switcher
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheTag, cacheLife } from 'next/cache'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
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
      <Suspense fallback={<div>Loading price...</div>}>
        <ProductPrice productId={id} />
      </Suspense>
    </div>
  )
}

function ProductDetails({ id }: { id: string }) {
  return <div>Product: {id}</div>
}

async function ProductPrice({ productId }: { productId: string }) {
  // Reading cookies defers this component to request time
  const currency = (await cookies()).get('currency')?.value ?? 'USD'

  // Cache the price per product and currency combination
  // All users with the same currency share this cache entry
  const price = await getProductPrice(productId, currency)

  return (
    <div>
      Price: {price} {currency}
    </div>
  )
}

async function getProductPrice(productId: string, currency: string) {
  'use cache: remote'
  cacheTag(`product-price-${productId}`)
  cacheLife({ expire: 3600 }) // 1 hour

  // Cached per (productId, currency) - few currencies means high cache utilization
  return db.products.getPrice(productId, currency)
}
```

```jsx filename="app/product/[id]/page.js" switcher
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheTag, cacheLife } from 'next/cache'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

export default async function ProductPage({ params }) {
  const { id } = await params

  return (
    <div>
      <ProductDetails id={id} />
      <Suspense fallback={<div>Loading price...</div>}>
        <ProductPrice productId={id} />
      </Suspense>
    </div>
  )
}

function ProductDetails({ id }) {
  return <div>Product: {id}</div>
}

async function ProductPrice({ productId }) {
  // Reading cookies defers this component to request time
  const currency = (await cookies()).get('currency')?.value ?? 'USD'

  // Cache the price per product and currency combination
  // All users with the same currency share this cache entry
  const price = await getProductPrice(productId, currency)

  return (
    <div>
      Price: {price} {currency}
    </div>
  )
}

async function getProductPrice(productId, currency) {
  'use cache: remote'
  cacheTag(`product-price-${productId}`)
  cacheLife({ expire: 3600 }) // 1 hour

  // Cached per (productId, currency) - few currencies means high cache utilization
  return db.products.getPrice(productId, currency)
}
```

### Database load လျှော့ချခြင်း

ဈေးကြီးတဲ့ database queries တွေကို cache လုပ်ပြီး — သင့် database ပေါ်က load ကို လျှော့ချပါ။ ဒီဥပမာမှာ `cookies()`, `headers()`, (သို့) `searchParams` တွေကို မသုံးပါဘူး။ ဒီ stats တွေကို static shell ထဲ မထည့်ချင်တဲ့ လိုအပ်ချက်တစ်ခု ရှိရင် — request time ဆီ အတိအကျ ရွှေ့ဆိုင်းဖို့ [`connection()`](/docs/nextjs/connection) ကို သုံးနိုင်ပါတယ်:

```tsx filename="app/dashboard/page.tsx"
import { Suspense } from 'react'
import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading stats...</div>}>
      <DashboardStats />
    </Suspense>
  )
}

async function DashboardStats() {
  // Defer to request time
  await connection()

  const stats = await getGlobalStats()

  return <StatsDisplay stats={stats} />
}

async function getGlobalStats() {
  'use cache: remote'
  cacheTag('global-stats')
  cacheLife({ expire: 60 }) // 1 minute

  // This expensive database query is cached and shared across all users,
  // reducing load on your database
  const stats = await db.analytics.aggregate({
    total_users: 'count',
    active_sessions: 'count',
    revenue: 'sum',
  })

  return stats
}
```

ဒီ setup နဲ့ဆိုရင် — dashboard ကို user ဘယ်နှစ်ယောက် လာကြည့်ကြည့် သင့် upstream database က တစ်မိနစ်ကို request အများဆုံး တစ်ခုပဲ မြင်ရပါတယ်။

### Streaming contexts တွေထဲက API responses

Streaming (သို့) dynamic operations တွေ ပြီးနောက်မှာ fetch လုပ်တဲ့ API responses တွေကို cache လုပ်ပါ:

```tsx filename="app/feed/page.tsx"
import { Suspense } from 'react'
import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'

export default async function FeedPage() {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <FeedItems />
      </Suspense>
    </div>
  )
}

async function FeedItems() {
  // Defer to request time
  await connection()

  const items = await getFeedItems()

  return items.map((item) => <FeedItem key={item.id} item={item} />)
}

async function getFeedItems() {
  'use cache: remote'
  cacheTag('feed-items')
  cacheLife({ expire: 120 }) // 2 minutes

  // This API call is cached, reducing requests to your external service
  const response = await fetch('https://api.example.com/feed')
  return response.json()
}
```

### Dynamic checks တွေ ပြီးနောက်က computed data

Dynamic security (သို့) feature checks တွေ ပြီးနောက်မှာ ဖြစ်ပေါ်တဲ့ ဈေးကြီးတဲ့ computations တွေကို cache လုပ်ပါ:

```tsx filename="app/reports/page.tsx"
import { connection } from 'next/server'
import { cacheLife } from 'next/cache'

export default async function ReportsPage() {
  // Defer to request time (for security check)
  await connection()

  const report = await generateReport()

  return <ReportViewer report={report} />
}

async function generateReport() {
  'use cache: remote'
  cacheLife({ expire: 3600 }) // 1 hour

  // This expensive computation is cached and shared across all authorized users,
  // avoiding repeated calculations
  const data = await db.transactions.findMany()

  return {
    totalRevenue: calculateRevenue(data),
    topProducts: analyzeProducts(data),
    trends: calculateTrends(data),
  }
}
```

### Caching strategies ရောနှောသုံးခြင်း

အကောင်းဆုံး performance အတွက် static, remote နဲ့ private caching တွေကို ပေါင်းစပ်ပါ:

```tsx filename="app/product/[id]/page.tsx"
import { Suspense } from 'react'
import { connection } from 'next/server'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

// Static product data - prerendered at build time
async function getProduct(id: string) {
  'use cache'
  cacheTag(`product-${id}`)

  // This is cached at build time and shared across all users
  return db.products.find({ where: { id } })
}

// Shared pricing data - cached at runtime in remote handler
async function getProductPrice(id: string) {
  'use cache: remote'
  cacheTag(`product-price-${id}`)
  cacheLife({ expire: 300 }) // 5 minutes

  // This is cached at runtime and shared across all users
  return db.products.getPrice({ where: { id } })
}

// User-specific recommendations - private cache per user
async function getRecommendations(productId: string) {
  'use cache: private'
  cacheLife({ expire: 60 }) // 1 minute

  const sessionId = (await cookies()).get('session-id')?.value

  // This is cached per-user and never shared
  return db.recommendations.findMany({
    where: { productId, sessionId },
  })
}

export default async function ProductPage({ params }) {
  const { id } = await params

  // Static product data
  const product = await getProduct(id)

  return (
    <div>
      <ProductDetails product={product} />

      {/* Dynamic shared price */}
      <Suspense fallback={<PriceSkeleton />}>
        <ProductPriceComponent productId={id} />
      </Suspense>

      {/* Dynamic personalized recommendations */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <ProductRecommendations productId={id} />
      </Suspense>
    </div>
  )
}

function ProductDetails({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  )
}

async function ProductPriceComponent({ productId }) {
  // Defer to request time
  await connection()

  const price = await getProductPrice(productId)
  return <div>Price: ${price}</div>
}

async function ProductRecommendations({ productId }) {
  const recommendations = await getRecommendations(productId)
  return <RecommendationsList items={recommendations} />
}

function PriceSkeleton() {
  return <div>Loading price...</div>
}

function RecommendationsSkeleton() {
  return <div>Loading recommendations...</div>
}

function RecommendationsList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

> **သိထားသင့်သည်:**
>
> - Remote caches တွေကို server-side cache handlers တွေထဲမှာ သိမ်းပြီး users အားလုံးကြားမှာ share လုပ်ပါတယ်
> - `'use cache: remote'` က static shell ရဲ့ အပြင်ဘက်မှာ အလုပ်လုပ်ပါတယ် — အဲဒီမှာ [`use cache`](/docs/nextjs/use-cache) က server-side cache hits တွေ မပေးနိုင်တဲ့နေရာပါ
> - Remote caches တွေကို on-demand invalidate လုပ်ဖို့ [`cacheTag()`](/docs/nextjs/cache-tag) နဲ့ [`revalidateTag()`](/docs/nextjs/revalidate-tag) ကို သုံးပါ
> - Cache expiration သတ်မှတ်ဖို့ [`cacheLife()`](/docs/nextjs/cache-life) ကို သုံးပါ
> - User-specific data တွေအတွက် `'use cache: remote'` အစား [`'use cache: private'`](/docs/nextjs/use-cache-private) ကို သုံးပါ
> - Remote caches တွေက computed (သို့) fetched data တွေကို server-side မှာ သိမ်းပြီး origin load ကို လျှော့ချပေးပါတယ်

## Platform Support (Platform ထောက်ပံ့မှု)

| Deployment Option                                                   | Supported |
| ------------------------------------------------------------------- | --------- |
| [Node.js server](/docs/nextjs/deploying#nodejs-server) | Yes       |
| [Docker container](/docs/nextjs/deploying#docker)      | Yes       |
| [Static export](/docs/nextjs/deploying#static-export)  | No        |
| [Adapters](/docs/nextjs/deploying#adapters)            | Yes       |

## Version History

| Version   | အပြောင်းအလဲ                                                             |
| --------- | ------------------------------------------------------------------- |
| `v16.0.0` | `"use cache: remote"` ကို Cache Components feature နဲ့အတူ enable လုပ်နိုင်ပါပြီ။ |
