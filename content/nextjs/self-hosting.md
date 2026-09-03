---
title: "Self-Hosting (ကိုယ်တိုင် hosting လုပ်ခြင်း)"
description: "သင့် Next.js application ကို Node.js server, Docker image (သို့) static HTML files (static exports) တွေနဲ့ ကိုယ်တိုင် self-host လုပ်နည်း — reverse proxy, Image Optimization, Proxy, environment variables, caching နဲ့ ISR, build cache, multi-server deployments, version skew, streaming/Suspense နဲ့ CDN အသုံးပြုမှု အကြောင်း အပြည့်အစုံ"
order: 133
source: "https://nextjs.org/docs/app/guides/self-hosting"
status: translated
updated: 2026-09-03
---

သင့် Next.js app ကို [deploy](/docs/nextjs/deploying) လုပ်တဲ့အခါ — သင့် infrastructure (အခြေခံအုတ်မြစ်) ပေါ် မူတည်ပြီး feature အမျိုးမျိုးကို ဘယ်လို ကိုင်တွယ်မလဲ ဆိုတာ configure လုပ်ချင်စိတ် ဖြစ်နိုင်ပါတယ်။

> **🎥 ကြည့်ရှုရန်:** Next.js ကို self-host လုပ်ခြင်းအကြောင်း ပိုမိုလေ့လာရန် → [YouTube (၄၅ မိနစ်)](https://www.youtube.com/watch?v=sIVL4JMqRfc)

## Reverse Proxy သုံးခြင်း

Self-hosting လုပ်တဲ့အခါ — သင့် Next.js server ကို internet ပေါ် တိုက်ရိုက် ဖွင့်ထားမယ့်အစား ရှေ့မှာ reverse proxy (nginx လိုမျိုး) တစ်ခု ထားဖို့ အကြံပြုပါတယ်။ Reverse proxy က malformed requests (ပုံစံမမှန်တဲ့ requests), slow connection attacks (နှေးကွေးတဲ့ ချိတ်ဆက်မှုကို အသုံးချတဲ့ တိုက်ခိုက်မှုများ), payload size limits (payload အရွယ်အစား ကန့်သတ်ချက်များ), rate limiting (တောင်းဆိုမှု နှုန်း ကန့်သတ်ချက်) နဲ့ အခြား security ကိစ္စတွေကို ကိုင်တွယ်ပေးနိုင်ပြီး — ဒီအလုပ်တွေကို Next.js server ဆီကနေ လွှဲပြောင်းယူပါတယ်။ ဒါကြောင့် server က request validation အစား rendering အတွက်ပဲ သူ့ရဲ့ resources တွေကို မြှုပ်နှံနိုင်ပါတယ်။

## Image Optimization (ပုံများကို optimize လုပ်ခြင်း)

`next start` နဲ့ deploy လုပ်တဲ့အခါ — `next/image` ကနေတစ်ဆင့် [Image Optimization](/docs/nextjs/component-image) က configuration ဘာမှ မလိုဘဲ self-hosted အလုပ်လုပ်ပါတယ်။ Images တွေကို optimize လုပ်ဖို့ သီးခြား service တစ်ခု သုံးချင်တယ်ဆိုရင် — [image loader တစ်ခုကို configure](/docs/nextjs/component-image) လုပ်နိုင်ပါတယ်။

Image Optimization ကို [static export](/docs/nextjs/static-exports) နဲ့လည်း သုံးနိုင်ပါတယ် — `next.config.js` ထဲမှာ custom image loader တစ်ခု သတ်မှတ်ပေးရုံပါပဲ။ Images တွေကို build ချိန်မှာ မဟုတ်ဘဲ runtime မှာ optimize လုပ်တာ သတိပြုပါ။

> **သိထားသင့်သည်:**
>
> - glibc-based Linux systems တွေမှာ Image Optimization က memory အလွန်အကျွံ သုံးစွဲမှု မဖြစ်စေဖို့ [ထပ်ဆောင်း configuration](https://sharp.pixelplumbing.com/install#linux-memory-allocator) လိုအပ်နိုင်ပါတယ်။
> - Optimize လုပ်ထားတဲ့ images တွေရဲ့ [caching behavior](/docs/nextjs/component-image) အကြောင်းနဲ့ TTL ကို ဘယ်လို configure လုပ်မလဲ ဆိုတာ ပိုလေ့လာပါ။
> - ကြိုက်နှစ်သက်ရင် — [Image Optimization ကို disable](/docs/nextjs/component-image) လုပ်ပြီး `next/image` သုံးခြင်းရဲ့ တခြား အကျိုးကျေးဇူးတွေကိုတော့ ဆက်ထိန်းထားနိုင်ပါတယ်။ ဥပမာ — images တွေကို ကိုယ်တိုင် သီးခြား optimize လုပ်နေတယ်ဆိုရင် မျိုးပါ။

## Proxy

[Proxy](/docs/nextjs/file-conventions-proxy) က `next start` နဲ့ deploy လုပ်တဲ့အခါ configuration ဘာမှ မလိုဘဲ self-hosted အလုပ်လုပ်ပါတယ်။ သူက incoming request ကို ဝင်ရောက်ခွင့် လိုအပ်လို့ — [static export](/docs/nextjs/static-exports) သုံးတဲ့အခါမှာတော့ ထောက်ပံ့မပေးပါဘူး။

Node.js APIs အားလုံး လိုအပ်တဲ့ logic တစ်ခုခု (သို့) external package တစ်ခု ထည့်ချင်နေတယ်ဆိုရင် — ဒီ logic ကို [Server Component](/docs/nextjs/server-client-components) တစ်ခုအနေနဲ့ [layout](/docs/nextjs/file-conventions-layout) တစ်ခုဆီ ရွှေ့နိုင်ပါလိမ့်မယ်။ ဥပမာ — [headers](/docs/nextjs/headers) တွေကို စစ်ဆေးတာ နဲ့ [redirecting](/docs/nextjs/redirect) လုပ်တာမျိုးပါ။ `next.config.js` ကနေတစ်ဆင့် — headers, cookies (သို့) query parameters တွေကို သုံးပြီး [redirect](/docs/nextjs/next-config-redirects) (သို့) [rewrite](/docs/nextjs/next-config-rewrites) လုပ်နိုင်ပါသေးတယ်။ အဲဒါတွေနဲ့မှ အဆင်မပြေရင် — [custom server](/docs/nextjs/custom-server) တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။

## Environment Variables (ပတ်ဝန်းကျင် variable များ)

Next.js က build time ရော runtime ရော environment variables နှစ်မျိုးလုံးကို ထောက်ပံ့ပါတယ်။

**Default အနေနဲ့ — environment variables တွေက server ပေါ်မှာပဲ ရနိုင်ပါတယ်**။ Environment variable တစ်ခုကို browser ထဲမှာ ရနိုင်အောင် လုပ်ဖို့ — `NEXT_PUBLIC_` နဲ့ prefix တပ်ပေးရပါမယ်။ ဒါပေမယ့် — ဒီ public environment variables တွေက `next build` လုပ်ချိန်မှာ JavaScript bundle ထဲကို inline လုပ်ခံရပါလိမ့်မယ်။

Dynamic rendering လုပ်နေချိန်မှာ server ပေါ်က environment variables တွေကို ဘေးကင်းစွာ ဖတ်နိုင်ပါတယ်:

```tsx filename="app/page.ts" switcher
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  // cookies, headers နဲ့ အခြား Request-time APIs တွေကလည်း
  // dynamic rendering ကို opt in လုပ်ပေးလို့ — ဒီ env variable ကို
  // runtime မှာ အကဲဖြတ်ပါတယ်
  const value = process.env.MY_VALUE
  // ...
}
```

```jsx filename="app/page.js" switcher
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  // cookies, headers နဲ့ အခြား Request-time APIs တွေကလည်း
  // dynamic rendering ကို opt in လုပ်ပေးလို့ — ဒီ env variable ကို
  // runtime မှာ အကဲဖြတ်ပါတယ်
  const value = process.env.MY_VALUE
  // ...
}
```

ဒါက သင့်ကို — environment အမျိုးမျိုးအတွက် တန်ဖိုး အမျိုးမျိုးနဲ့ stage တွေကြားမှာ မြှင့်တင်လို့ရတဲ့ (promote လုပ်လို့ရတဲ့) Docker image တစ်ခုတည်းကို သုံးနိုင်စေပါတယ်။

> **သိထားသင့်သည်:**
>
> - Server စတင်ချိန်မှာ code run လုပ်ဖို့ — [`register` function](/docs/nextjs/instrumentation) ကို သုံးနိုင်ပါတယ်။

## Caching နဲ့ ISR

Next.js က responses, generated static pages, build outputs နဲ့ images, fonts, scripts လို တခြား static assets တွေကို cache လုပ်နိုင်ပါတယ်။

Caching နဲ့ revalidating pages ([Incremental Static Regeneration](https://nextjs.org/docs/app/guides/incremental-static-regeneration)) တွေက **Next.js server cache တစ်ခုတည်းကိုပဲ** သုံးပါတယ်။ Default အနေနဲ့ — ဒီ cache ကို Next.js server instance တစ်ခုချင်းစီရဲ့ local filesystem (disk ပေါ်မှာ) မှာ သိမ်းပါတယ်။

ဒါက persistent local disk ရှိတဲ့ self-hosted `next start` instance တစ်ခုတည်းအတွက်ဆိုရင် အလိုအလျောက် အလုပ်လုပ်ပါတယ်။ Instance အများအပြား run နေတယ်၊ ephemeral compute (ယာယီ compute) သုံးတယ် (သို့) Next.js ရဲ့ ရှေ့မှာ CDN/reverse proxy ထားတယ်ဆိုရင် — [Caching ကို သတ်မှတ်ခြင်း](#configuring-caching), [Instance အများအပြားကြား Cache Coordination](#multi-instance-cache-coordination) နဲ့ [CDNs တွေနဲ့ အသုံးပြုခြင်း](#usage-with-cdns) တွေကိုပါ ပြန်သုံးသပ်ကြည့်ပါ။

Cached pages နဲ့ data တွေကို durable storage (ကြာရှည်ခံ storage) မှာ သိမ်းချင်တယ် (သို့) သင့် Next.js application ရဲ့ containers (သို့) instances အများအပြားကြားမှာ cache ကို မျှဝေချင်တယ်ဆိုရင် — Next.js cache ရဲ့ တည်နေရာကို configure လုပ်နိုင်ပါတယ်။

### အလိုအလျောက် Caching

- Next.js က တကယ့် immutable (ပြောင်းလဲခြင်းမရှိ) assets တွေအတွက် `Cache-Control` header ကို `public, max-age=31536000, immutable` အနေနဲ့ သတ်မှတ်ပေးပြီး — ဒါကို override လုပ်လို့ မရပါဘူး။ ဒီ immutable files တွေရဲ့ file name ထဲမှာ SHA-hash ပါဝင်လို့ — ကြာရှည်စွာ အန္တရာယ်ကင်းစွာ cache လုပ်နိုင်ပါတယ်။ ဥပမာ — [Static Image Imports](/docs/nextjs/image) မျိုးပါ။ Images တွေအတွက် [TTL ကို configure](/docs/nextjs/component-image) လုပ်နိုင်ပါတယ်။
- Incremental Static Regeneration (ISR) က `Cache-Control` header ကို `s-maxage: <revalidate in getStaticProps>, stale-while-revalidate` အနေနဲ့ သတ်မှတ်ပါတယ်။ ဒီ revalidation time ကို သင့် [`getStaticProps` function](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props) ထဲမှာ seconds နဲ့ သတ်မှတ်ပါတယ်။ `revalidate: false` လို့ သတ်မှတ်ထားရင် — တစ်နှစ်ကြာ cache duration ကို default အနေနဲ့ သုံးပါလိမ့်မယ်။ ဒါကို CDN layer မှာ အသုံးချဖို့ဆိုရင် — သင့် CDN/reverse proxy က ဒီ directives တွေနဲ့ cache-key variability ([CDN Caching](/docs/nextjs/cdn-caching)) တွေကို လေးစားလိုက်နာရမှာ ဖြစ်ပြီး — မလိုက်နာရင် responses တွေက CDN caching ကို ကျော်သွားနိုင်သလို client-side navigation ချိန်မှာ stale (သက်တမ်းလွန်) (သို့) mismatched variants တွေ ပို့ပေးနိုင်ပါတယ်။
- Dynamically rendered pages တွေက user-specific data တွေ cache မဖြစ်အောင် `Cache-Control` header ကို `private, no-cache, no-store, max-age=0, must-revalidate` အနေနဲ့ သတ်မှတ်ပါတယ်။ ဒါက App Router ရော Pages Router မှာပါ သက်ရောက်ပြီး — [Draft Mode](/docs/nextjs/draft-mode) လည်း ပါဝင်ပါတယ်။

### Static Assets (static ဖိုင်များ)

Static assets တွေကို မတူညီတဲ့ domain (သို့) CDN တစ်ခုပေါ်မှာ host လုပ်ချင်တယ်ဆိုရင် — `next.config.js` ထဲက `assetPrefix` [configuration](/docs/nextjs/next-config-asset-prefix) ကို သုံးနိုင်ပါတယ်။ JavaScript (သို့) CSS files တွေကို ထုတ်ယူတဲ့အခါ Next.js က ဒီ asset prefix ကို သုံးပါလိမ့်မယ်။ Assets တွေကို domain တစ်ခုခုပေါ် ခွဲထားတာက DNS နဲ့ TLS resolution အတွက် အချိန်ပိုကုန်တဲ့ အားနည်းချက် ရှိပါတယ်။

[`assetPrefix` အကြောင်း ပိုမိုလေ့လာရန်](/docs/nextjs/next-config-asset-prefix)

### Caching ကို သတ်မှတ်ခြင်း (Configuring Caching)

Default အနေနဲ့ — generated cache assets တွေကို memory (default 50mb) နဲ့ disk ပေါ်မှာ သိမ်းပါတယ်။ Ephemeral compute platforms (serverless setup တွေမှာ အဖြစ်များပါတယ်) ပေါ်မှာ local disk က မကြာခဏ non-persistent (မတည်မြဲ) (သို့) မရနိုင်တာမို့ — ဒီ cache က ထိရောက်စွာ သက်တမ်းတိုပြီး instance တစ်ခုချင်းစီအတွက်ပဲ ဖြစ်ပါတယ်။ Kubernetes လို container orchestration platform တစ်ခုနဲ့ Next.js ကို host လုပ်နေတယ်ဆိုရင် — pod တစ်ခုချင်းစီမှာ cache ရဲ့ copy တစ်ခုစီ ရှိပါလိမ့်မယ်။ Cache က default အနေနဲ့ pods တွေကြားမှာ share မလုပ်ထားလို့ stale data တွေ ပြသမှု မဖြစ်စေဖို့ — Next.js cache ကို cache handler တစ်ခု ပေးပြီး in-memory caching ကို disable လုပ်အောင် configure လုပ်နိုင်ပါတယ်။

Self-hosting လုပ်တဲ့အခါ cache တည်နေရာကို သတ်မှတ်ဖို့ — သင့် `next.config.js` file ထဲမှာ custom handler တစ်ခု configure လုပ်နိုင်ပါတယ်:

Production deployments တွေအတွက် — ဒါကို starting point (စမှတ်) အနေနဲ့ သုံးပြီး durable storage, eviction policies (ဖယ်ရှားရေး မူဝါဒများ), error handling နဲ့ distributed tag coordination တွေနဲ့ တိုးချဲ့ပါ။ [Custom Next.js Cache Handler](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath) နဲ့ [Redis `cacheHandler` example](https://github.com/vercel/next.js/tree/canary/examples/cache-handler-redis) တို့ကို ကြည့်ပါ။ `'use cache'` directives တွေအတွက် backends တွေ သတ်မှတ်နေတယ်ဆိုရင် — [`cacheHandlers`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) ကို သုံးပါ။

```jsx filename="next.config.js"
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // disable default in-memory caching
}
```

ပြီးရင် — သင့် project ရဲ့ root မှာ `cache-handler.js` ကို ဖန်တီးပါ၊ ဥပမာ:

```jsx filename="cache-handler.js"
const cache = new Map()

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options
  }

  async get(key) {
    // ဒါကို durable storage လိုမျိုး ဘယ်နေရာမှာမဆို သိမ်းထားနိုင်ပါတယ်
    return cache.get(key)
  }

  async set(key, data, ctx) {
    // ဒါကို durable storage လိုမျိုး ဘယ်နေရာမှာမဆို သိမ်းထားနိုင်ပါတယ်
    cache.set(key, {
      value: data,
      lastModified: Date.now(),
      tags: ctx.tags,
    })
  }

  async revalidateTag(tags) {
    // tags က string တစ်ခု (သို့) strings array တစ်ခု ဖြစ်နိုင်ပါတယ်
    tags = [tags].flat()
    // Cache ထဲက entries အားလုံးကို လှည့်ကြည့်ပါ
    for (let [key, value] of cache) {
      // Entry ရဲ့ tags ထဲမှာ သတ်မှတ်ထားတဲ့ tag ပါနေရင် ဒီ entry ကို ဖျက်ပါ
      if (value.tags.some((tag) => tags.includes(tag))) {
        cache.delete(key)
      }
    }
  }

  // Request တစ်ခုအတွက်ပဲ သက်တမ်းတိုတဲ့ in-memory cache ထားချင်ရင် —
  // နောက် request မတိုင်ခင် reset လုပ်ပေးမယ့် ဒီ method ကို သုံးနိုင်ပါတယ်
  resetRequestCache() {}
}
```

Custom cache handler တစ်ခု သုံးခြင်းဖြင့် — သင့် Next.js application ကို host လုပ်နေတဲ့ pods အားလုံးကြားမှာ consistency (တစ်ပြေးညီဖြစ်မှု) ရှိအောင် သေချာစေနိုင်ပါတယ်။ ဥပမာ — cached values တွေကို [Redis](https://github.com/vercel/next.js/tree/canary/examples/cache-handler-redis) (သို့) AWS S3 လိုမျိုး ဘယ်နေရာမှာမဆို သိမ်းနိုင်ပါတယ်။

> **သိထားသင့်သည်:**
>
> - `revalidatePath` က cache tags တွေအပေါ်မှာ တည်ဆောက်ထားတဲ့ convenience layer (အဆင်ပြေစေတဲ့ အလွှာ) တစ်ခုပါ။ `revalidatePath` ကို ခေါ်လိုက်ရင် — ပေးထားတဲ့ page အတွက် special default tag တစ်ခုနဲ့ `revalidateTag` function ကို ခေါ်ပါလိမ့်မယ်။

## Build Cache

`next build` လုပ်ချိန်မှာ Next.js က — သင့် application ရဲ့ ဘယ် version ကို serve လုပ်နေလဲ ခွဲခြားသတ်မှတ်ဖို့ ID တစ်ခု generate လုပ်ပါတယ်။ Containers အများအပြား boot တက်ဖို့ build တစ်ခုတည်းကိုပဲ သုံးသင့်ပါတယ်။

သင့် environment ရဲ့ stage တစ်ခုစီအတွက် rebuild လုပ်နေတယ်ဆိုရင် — containers တွေကြားမှာ သုံးဖို့ consistent build ID တစ်ခု generate လုပ်ဖို့ လိုပါမယ်။ `next.config.js` ထဲမှာ `generateBuildId` command ကို သုံးပါ:

```jsx filename="next.config.js"
module.exports = {
  generateBuildId: async () => {
    // ဒါက ဘာဖြစ်ဖြစ် ရပါတယ် — ဥပမာ နောက်ဆုံး git hash ကို သုံးနိုင်ပါတယ်
    return process.env.GIT_HASH
  },
}
```

> **သိထားသင့်သည်:** [`deploymentId`](https://nextjs.org/docs/app/api-reference/config/next-config-js/deploymentId) ကို သတ်မှတ်ထားတဲ့အခါ — Next.js က constant build ID တစ်ခုကို သုံးပြီး `generateBuildId` က သက်ရောက်မှု မရှိတော့ပါဘူး။ [Version skew](#version-skew) ကို deployment ID ကနေတစ်ဆင့် ရှာဖွေတွေ့ရှိပါတယ်။

## Server အများအပြား Deploy လုပ်ခြင်း (Multi-Server Deployments)

Next.js ကို server instances အများအပြားမှာ run လုပ်တဲ့အခါ (ဥပမာ — load balancer နောက်မှာ ရှိတဲ့ containers) — consistent (တစ်ပြေးညီ) အပြုအမူ ရှိစေဖို့ ထပ်ဆောင်း စဉ်းစားစရာတွေ ရှိပါတယ်။

### Server Functions ရဲ့ encryption key

Next.js က [Server Function](https://nextjs.org/docs/app/getting-started/mutating-data) closure variables တွေကို client ဆီ မပို့ခင် encrypt လုပ်ပါတယ်။ Default အနေနဲ့ — build တစ်ခုစီအတွက် unique encryption key တစ်ခု generate လုပ်ပါတယ်။

Server instances အများအပြား run လုပ်တဲ့အခါ — instance အားလုံးက encryption key တစ်ခုတည်းကို သုံးရပါမယ်။ မဟုတ်ရင် — instance တစ်ခုက encrypt လုပ်ထားတဲ့ Server Function ကို နောက်တစ်ခုက decrypt လုပ်လို့ မရတော့ဘဲ "Failed to find Server Action" errors တွေ ဖြစ်စေပါတယ်။

`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` environment variable ကို သုံးပြီး consistent encryption key တစ်ခု သတ်မှတ်ပါ။ Key က valid AES key length (16, 24 (သို့) 32 bytes) ရှိတဲ့ base64-encoded value တစ်ခု ဖြစ်ရပါမယ်။ Next.js က 32-byte keys တွေကို default အနေနဲ့ generate လုပ်ပါတယ်။

```bash
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=your-generated-key next build
```

ဒီ key က build output ထဲမှာ ထည့်သွင်းပြီး runtime မှာ အလိုအလျောက် သုံးပါတယ်။ [Data Security guide](https://nextjs.org/docs/app/guides/data-security#overwriting-encryption-keys-advanced) ထဲမှာ ပိုလေ့လာနိုင်ပါတယ်။

### Deployment identifier (deployment ID)

Rolling deployments (တစ်စတစ်စ ပြောင်းလဲတဲ့ deployments) တွေမှာ version skew protection (version ကွဲလွဲမှု ကာကွယ်ရေး) ကို ဖွင့်ဖို့ — [`deploymentId`](https://nextjs.org/docs/app/api-reference/config/next-config-js/deploymentId) တစ်ခု configure လုပ်ပါ။ ဒါက clients တွေ အမြဲတမ်း consistent deployment version တစ်ခုတည်းကနေ assets တွေ ရရှိစေဖို့ သေချာစေပါတယ်။

### Shared cache (မျှဝေထားသော cache)

Default အနေနဲ့ — Next.js က instances တွေကြားမှာ မမျှဝေတဲ့ in-memory cache ကို သုံးပါတယ်။ Consistent caching အပြုအမူအတွက် — data တွေကို external storage မှာ သိမ်းတဲ့ [custom cache handler](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) တစ်ခုနဲ့ [`'use cache: remote'`](/docs/nextjs/use-cache-remote) ကို သုံးပါ။

## Version Skew (version ကွဲလွဲမှု)

Instances အများအပြားမှာ self-host လုပ်တာ (သို့) rolling deployments လုပ်တဲ့အခါ — [version skew](https://nextjs.org/docs/app/glossary#version-skew) က ဒါတွေကို ဖြစ်စေနိုင်ပါတယ်:

- **Missing assets (ပျောက်ဆုံးနေတဲ့ assets)**: Client က server ပေါ်မှာ မရှိတော့တဲ့ JavaScript (သို့) CSS files တွေကို တောင်းဆိုမိတာ
- **Server Function mismatches (Server Function မကိုက်ညီမှုများ)**: Client က previous build ကနေ ID တစ်ခုကို သုံးပြီး Server Function တစ်ခုကို invoke လုပ်ပေမယ့် server က အဲဒီ ID ကို မမှတ်မိတော့တာ
- **Navigation failures (navigation မအောင်မြင်မှုများ)**: Deployment အဟောင်းကနေ prefetch လုပ်ထားတဲ့ page data က server အသစ်နဲ့ မကိုက်ညီတော့တာ

Next.js က version skew ကို ရှာဖွေ ကိုင်တွယ်ဖို့ [`deploymentId`](https://nextjs.org/docs/app/api-reference/config/next-config-js/deploymentId) ကို သုံးပါတယ်။ Deployment ID တစ်ခု configure လုပ်ထားတဲ့အခါ:

- Static assets တွေမှာ `?dpl=<deploymentId>` query parameter ပါဝင်ပါတယ်
- Client-side navigation requests တွေမှာ `x-deployment-id` header ပါဝင်ပါတယ်
- Server က client ရဲ့ deployment ID ကို သူ့ကိုယ်ပိုင် deployment ID နဲ့ နှိုင်းယှဉ်ပါတယ်

Mismatch (မကိုက်ညီမှု) တစ်ခု တွေ့ရှိရင် — Next.js က client-side navigation အစား hard navigation (page တစ်ခုလုံး reload လုပ်ခြင်း) ကို trigger လုပ်ပါတယ်။ ဒါက client က consistent deployment version တစ်ခုတည်းကနေ assets တွေ ရယူစေဖို့ သေချာစေပါတယ်။

```js filename="next.config.js"
module.exports = {
  deploymentId: process.env.DEPLOYMENT_VERSION,
}
```

> **သိထားသင့်သည်:** Application ကို reload လုပ်လိုက်တဲ့အခါ — page navigations တွေကြားမှာ ဆက်ထိန်းထားဖို့ ဒီဇိုင်းမထားရင် application state တစ်ချို့ ဆုံးရှုံးနိုင်ပါတယ်။ URL state (သို့) local storage တွေကတော့ ဆက်ရှိနေမှာ ဖြစ်ပြီး — `useState` လို component state တွေကတော့ ပျောက်သွားပါလိမ့်မယ်။

## Streaming နဲ့ Suspense

Next.js App Router က self-hosting လုပ်တဲ့အခါ [streaming responses](/docs/nextjs/file-conventions-loading) တွေကို ထောက်ပံ့ပါတယ်။ nginx (သို့) အလားတူ proxy တစ်ခု သုံးနေတယ်ဆိုရင် — streaming ရဖို့ buffering ကို disable လုပ်အောင် configure လုပ်ဖို့ လိုပါမယ်။

ဥပမာ — `X-Accel-Buffering` ကို `no` လို့ သတ်မှတ်ပြီး nginx ထဲမှာ buffering ကို disable လုပ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ]
  },
}
```

nginx အပြင် — သင့် infrastructure တစ်ခုလုံးက streaming ကို end-to-end ထောက်ပံ့ကြောင်း သေချာပါစေ:

- **Load balancers** တွေက chunked transfer encoding (သို့) HTTP/2 streaming ကို ထောက်ပံ့ရပါမယ်။ Cloud load balancers တစ်ချို့ (ဥပမာ — AWS ALB ကို Lambda integration နဲ့ သုံးတာ) က default အနေနဲ့ responses တွေကို buffer လုပ်နိုင်ပါတယ်။
- Load balancer နဲ့ Next.js ကြားက **reverse proxies** တွေကလည်း buffering မလုပ်ဘဲ chunked responses တွေကို ဖြတ်ပို့ပေးရပါမယ်။
- [Partial Prerendering](https://nextjs.org/docs/app/guides/ppr-platform-guide) သုံးနေတယ်ဆိုရင် — streaming support က မဖြစ်မနေ လိုအပ်ပါတယ်။ အဲဒါမရှိရင် — static shell နဲ့ dynamic content တွေက full render ပြီးမှ အတူတူ ပို့ပေးလို့ PPR ရဲ့ time-to-first-byte အကျိုးကျေးဇူး ပျောက်သွားပါတယ်။

## Instance အများအပြားကြား Cache Coordination (Multi-Instance Cache Coordination)

အပေါ်က [multi-server configuration](#multi-server-deployments) (encryption key, deployment ID, shared cache) တွေအပြင် — instances အများအပြားပါတဲ့ App Router deployments တွေမှာ cache tag coordination (cache tag ညှိနှိုင်းဆောင်ရွက်မှု) လိုအပ်ပါတယ်။

Default အနေနဲ့ — instance တစ်ခုပေါ်မှာ [`revalidateTag()`](/docs/nextjs/revalidate-tag) ကို ခေါ်လိုက်ရင် အဲဒီ instance ပေါ်က cache ကိုပဲ invalidate လုပ်ပါတယ်။ ကျန်တဲ့ instances တွေက invalidation ကို သူတို့ဘာသာ ရှာမတွေ့မချင်း stale content တွေကို ဆက်ပြီး serve လုပ်နေပါလိမ့်မယ်။

Instances တွေကြားမှာ tag invalidation ကို ညှိနှိုင်းဖို့ — သင့် [custom cache handler](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) ထဲမှာ [`refreshTags()`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers#refreshtags) method ကို implement လုပ်ပါ။ ဒီ method ကို request တစ်ခုစီ မတိုင်ခင် ခေါ်ပြီး — shared storage (Redis လိုမျိုး) ကနေ tag state ကို sync လုပ်ပေးရမှာ ဖြစ်လို့ — instances အားလုံးက invalidations တွေကို ချက်ချင်း သိရှိပါလိမ့်မယ်။

Tag architecture အကြောင်း အသေးစိတ် ရှင်းလင်းချက်အတွက် — [How Revalidation Works](https://nextjs.org/docs/app/guides/how-revalidation-works) ကို ကြည့်ပါ။

## Cache Components

[Cache Components](/docs/nextjs/caching) တွေက Next.js နဲ့ဆို default အနေနဲ့ အလုပ်လုပ်ပြီး — CDN အတွက်ပဲ ဖြစ်တဲ့ feature မဟုတ်ပါဘူး။ Node.js server အနေနဲ့ (`next start` ကနေတစ်ဆင့်) ရော — Docker container နဲ့ သုံးတဲ့အခါမှာပါ ပါဝင်ပါတယ်။

## CDNs တွေနဲ့ အသုံးပြုခြင်း (Usage with CDNs)

သင့် Next.js application ရဲ့ ရှေ့မှာ CDN တစ်ခု သုံးတဲ့အခါ — dynamic APIs တွေကို ဝင်ရောက်သုံးတဲ့အခါ page မှာ `Cache-Control: private` response header ပါဝင်ပါလိမ့်မယ်။ ဒါက ရလာတဲ့ HTML page ကို non-cacheable အဖြစ် မှတ်သားစေပါတယ်။ Page က static အဖြစ် အပြည့်အဝ prerender လုပ်ထားရင် — `Cache-Control: public` ပါဝင်လို့ page ကို CDN ပေါ်မှာ cache လုပ်နိုင်ပါတယ်။

Static နဲ့ dynamic components နှစ်မျိုးလုံး ရောနှောစရာ မလိုဘူးဆိုရင် — သင့် route တစ်ခုလုံးကို static ဖြစ်အောင် လုပ်ပြီး output HTML ကို CDN ပေါ်မှာ cache လုပ်နိုင်ပါတယ်။ ဒီ Automatic Static Optimization က dynamic APIs တွေ မသုံးရင် `next build` run လုပ်တဲ့အခါ default အပြုအမူ ဖြစ်ပါတယ်။

CDN caching အပြုအမူ, graceful degradation (တဖြည်းဖြည်း ကျဆင်းခြင်း) နဲ့ cache variability တွေအတွက် အသေးစိတ် လမ်းညွှန်ချက်တွေကို — [CDN Caching](/docs/nextjs/cdn-caching) မှာ ကြည့်ပါ။ Platform အမျိုးမျိုးပေါ်မှာ Partial Prerendering ထောက်ပံ့မှုအတွက် — [PPR Platform Guide](https://nextjs.org/docs/app/guides/ppr-platform-guide) နဲ့ [Deployment Adapter API](https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath) တို့ကို ကြည့်ပါ။

## `after`

[`after`](/docs/nextjs/after) ကို `next start` နဲ့ self-hosting လုပ်တဲ့အခါ အပြည့်အဝ ထောက်ပံ့ပါတယ်။

Server ကို ရပ်တန့်တဲ့အခါ — `SIGINT` (သို့) `SIGTERM` signals တွေ ပို့ပြီး စောင့်ဆိုင်းခြင်းဖြင့် graceful shutdown (ချောမွေ့စွာ ပိတ်ခြင်း) သေချာစေပါ။ Next.js server က in-flight requests (လက်ရှိ လုပ်ဆောင်နေဆဲ requests) တွေ ပြီးဆုံးအောင် လုပ်ပြီး — exit မလုပ်ခင် ဆိုင်းငံ့ထားတဲ့ `after()` callbacks တွေကို execute လုပ်ပါလိမ့်မယ်။ Platforms တွေက background အလုပ်အားလုံး ပြီးစီးဖို့ — configure လုပ်လို့ရတဲ့ drain period (စက္ကန့် ၁၀–၃၀ သုံးဖို့ အကြံပြုပါတယ်) တစ်ခုကို ခွင့်ပြုသင့်ပါတယ်။
