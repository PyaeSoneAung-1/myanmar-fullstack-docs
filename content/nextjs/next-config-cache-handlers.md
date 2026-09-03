---
title: "cacheHandlers ('use cache' directives များအတွက် ကိုယ်ပိုင် cache handler များ သတ်မှတ်ချက်)"
description: "cacheHandlers option — 'use cache' နှင့် 'use cache: remote' directives များအတွက် custom cache storage implementations (Redis, Memcached, DynamoDB စသည့် external services) သတ်မှတ်ရန်; get/set/refreshTags/getExpiration/updateTags methods များပါသော CacheHandler interface ကို implement ရန် လိုအပ်; instances အများအပြားကြား cache/tag coordination အတွက် အသုံးဝင်; 'use cache: private' ကတော့ configure လုပ်၍ မရ"
order: 221
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers"
status: translated
updated: 2026-09-03
---

`cacheHandlers` configuration က [`'use cache'`](/docs/nextjs/use-cache) နဲ့ [`'use cache: remote'`](/docs/nextjs/use-cache-remote) directives တွေအတွက် custom cache storage implementations (ကိုယ်ပိုင် cache သိမ်းဆည်းမှု အကောင်အထည်ဖော်မှုများ) သတ်မှတ်နိုင်စေပါတယ်။ ဒါက cache လုပ်ထားတဲ့ components နဲ့ functions တွေကို external services တွေမှာ သိမ်းဆည်းနိုင်စေပြီး — caching အပြုအမူကိုလည်း customize လုပ်နိုင်စေပါတယ်။ [`'use cache: private'`](/docs/nextjs/use-cache-private) ကတော့ configure လုပ်လို့ မရပါဘူး။

## Custom cache handlers တွေကို ဘယ်အခါ သုံးမလဲ

**Application အများစုမှာ custom cache handlers တွေ မလိုအပ်ပါဘူး။** Default in-memory cache က ပုံမှန် အသုံးပြုမှု ကိစ္စတွေမှာ ကောင်းမွန်စွာ အလုပ်လုပ်ပါတယ်။

Custom cache handlers တွေက — cache ကို instances အများအပြားကြားမှာ မျှဝေဖို့ (သို့) cache သိမ်းတဲ့ နေရာကို ပြောင်းလဲဖို့ လိုအပ်တဲ့ အဆင့်မြင့် (advanced) အခြေအနေတွေအတွက် ဖြစ်ပါတယ်။ ဥပမာ — external storage (key-value store လိုမျိုး) အတွက် custom `remote` handler တစ်ခုကို configure လုပ်ပြီး — in-memory caching အတွက် သင့် code ထဲမှာ `'use cache'` ကို သုံးကာ external storage အတွက် `'use cache: remote'` ကို သုံးနိုင်ပါတယ် — application တစ်ခုတည်းအတွင်းမှာ caching strategies အမျိုးမျိုး သုံးစွဲနိုင်စေပါတယ်။

**Instances အများအပြားကြားမှာ cache မျှဝေခြင်း**

Default in-memory cache က Next.js process တစ်ခုချင်းစီအတွက် သီးခြားပါ။ Servers (သို့) containers အများအပြား run နေရင် — instance တစ်ခုချင်းစီမှာ သူ့ကိုယ်ပိုင် cache ရှိပြီး — တခြား instance တွေနဲ့ မျှဝေမထားဘဲ restart လုပ်တဲ့အခါ ပျောက်ဆုံးသွားပါတယ်။

Custom handlers တွေက သင့် Next.js instances အားလုံး ဝင်ရောက်သုံးနိုင်တဲ့ shared storage systems တွေ (Redis, Memcached (သို့) DynamoDB လိုမျိုး) နဲ့ ပေါင်းစပ်နိုင်စေပါတယ်။

**Storage အမျိုးအစား ပြောင်းလဲခြင်း**

Cache ကို default in-memory နည်းလမ်းနဲ့ မတူဘဲ တခြားနည်းနဲ့ သိမ်းချင်တာ ဖြစ်နိုင်ပါတယ်။ Cache ကို disk, database (သို့) external caching service တစ်ခုမှာ သိမ်းဖို့ custom handler တစ်ခုကို implement လုပ်နိုင်ပါတယ်။ အကြောင်းရင်းတွေထဲမှာ — restart တွေကြားမှာ ဆက်လက်တည်မြဲစေချင်တာ (persistence), memory အသုံးပြုမှု လျှော့ချချင်တာ (သို့) ရှိပြီးသား infrastructure တွေနဲ့ ပေါင်းစပ်ချင်တာတွေ ပါဝင်နိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

Custom cache handlers တွေကို configure လုပ်ဖို့:

1. သင့် cache handler ကို file သီးခြားတစ်ခုမှာ သတ်မှတ်ပါ — implementation အသေးစိတ်အတွက် [examples](#examples) ကို ကြည့်ပါ။
2. သင့် Next.js config file ထဲမှာ file path ကို ကိုးကားပါ။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheHandlers: {
    default: require.resolve('./cache-handlers/default-handler.js'),
    remote: require.resolve('./cache-handlers/remote-handler.js'),
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
module.exports = {
  cacheHandlers: {
    default: require.resolve('./cache-handlers/default-handler.js'),
    remote: require.resolve('./cache-handlers/remote-handler.js'),
  },
}
```

### Handler အမျိုးအစားများ (Handler types)

- **`default`**: `'use cache'` directive က အသုံးပြုပါတယ်
- **`remote`**: `'use cache: remote'` directive က အသုံးပြုပါတယ်

`cacheHandlers` ကို configure မလုပ်ထားရင် — Next.js က `default` ရော `remote` အတွက်ပါ in-memory LRU (Least Recently Used) cache ကို သုံးပါတယ်။ [Default implementation](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/lib/cache-handlers/default.ts) ကို reference အဖြစ် ကြည့်နိုင်ပါတယ်။

ထပ်ဆောင်း named handlers တွေ (ဥပမာ `sessions`, `analytics`) လည်း သတ်မှတ်နိုင်ပြီး — `'use cache: <name>'` နဲ့ ကိုးကားနိုင်ပါတယ်။

`'use cache: private'` က cache handlers တွေကို မသုံးဘဲ customize လုပ်လို့လည်း မရပါဘူး ဆိုတာ သတိပြုပါ။

## API Reference

Cache handler တစ်ခုက အောက်ပါ methods တွေပါတဲ့ [`CacheHandler`](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/lib/cache-handlers/types.ts) interface ကို implement လုပ်ရပါမယ်:

### `get()`

ပေးထားတဲ့ cache key အတွက် cache entry တစ်ခုကို ပြန်ယူပါတယ်။

```ts
get(cacheKey: string, softTags: string[]): Promise<CacheEntry | undefined>
```

| Parameter  | Type       | Description                                                                                 |
| ---------- | ---------- | ------------------------------------------------------------------------------------------- |
| `cacheKey` | `string`   | Cache entry ရဲ့ unique key။                                                                |
| `softTags` | `string[]` | Route path ကနေ ဆင်းသက်လာတဲ့ implicit tags တွေ။ ဘယ်လို သုံးမလဲဆိုတာ [Soft Tags](#soft-tags) မှာ ကြည့်ပါ။ |

တွေ့ရှိရင် `CacheEntry` object တစ်ခုကို ပြန်ပေးပြီး — မတွေ့ရှိရင် (သို့) သက်တမ်းကုန်သွားရင် `undefined` ပြန်ပေးပါတယ်။

သင့် `get` method က storage ကနေ cache entry ကို ပြန်ယူပြီး — `revalidate` အချိန်ကို အခြေခံပြီး သက်တမ်းကုန်သွားလား စစ်ဆေးကာ — မရှိတဲ့ (သို့) သက်တမ်းကုန်နေတဲ့ entries တွေအတွက် `undefined` ပြန်ပေးသင့်ပါတယ်။

```js
const cacheHandler = {
  async get(cacheKey, softTags) {
    const entry = cache.get(cacheKey)
    if (!entry) return undefined

    // သက်တမ်းကုန်သွားလား စစ်ဆေးပါ
    const now = Date.now()
    if (now > entry.timestamp + entry.revalidate * 1000) {
      return undefined
    }

    return entry
  },
}
```

### `set()`

ပေးထားတဲ့ cache key အတွက် cache entry တစ်ခုကို သိမ်းဆည်းပါတယ်။

```ts
set(cacheKey: string, pendingEntry: Promise<CacheEntry>): Promise<void>
```

| Parameter      | Type                  | Description                                 |
| -------------- | --------------------- | ------------------------------------------- |
| `cacheKey`     | `string`              | Entry ကို သိမ်းဆည်းရမယ့် unique key။         |
| `pendingEntry` | `Promise<CacheEntry>` | Cache entry အဖြစ် resolve ဖြစ်မယ့် promise တစ်ခု။ |

ဒီ method ကို ခေါ်တဲ့အခါ entry က မပြီးသေးဘဲ pending ဖြစ်နေနိုင်ပါတယ် (ဆိုလိုတာက — သူ့ရဲ့ value stream ကို ဆက်ရေးနေဆဲ ဖြစ်နိုင်ပါတယ်)။ သင့် handler က entry ကို process မလုပ်ခင် promise ကို await လုပ်သင့်ပါတယ်။

`Promise<void>` ပြန်ပေးပါတယ်။

သင့် `set` method က ဒီ method ကို ခေါ်တဲ့အချိန်မှာ cache entry က generate လုပ်နေဆဲ ဖြစ်နိုင်လို့ — သိမ်းဆည်းမလုပ်ခင် `pendingEntry` promise ကို await လုပ်ရပါမယ်။ Resolve ဖြစ်ပြီးတာနဲ့ — entry ကို သင့် cache system ထဲမှာ သိမ်းပါ။

```js
const cacheHandler = {
  async set(cacheKey, pendingEntry) {
    // Entry အသင့်ဖြစ်ဖို့ စောင့်ပါ
    const entry = await pendingEntry

    // သင့် cache system ထဲမှာ သိမ်းပါ
    cache.set(cacheKey, entry)
  },
}
```

### `refreshTags()`

Request အသစ်တစ်ခု မစတင်ခင် external tag services တွေနဲ့ sync လုပ်ဖို့ အခါအားလျော်စွာ ခေါ်ပါတယ်။

```ts
refreshTags(): Promise<void>
```

Instances (သို့) services အများအပြားကြားမှာ cache invalidation ကို ညှိနှိုင်းနေတယ်ဆိုရင် ဒါက အသုံးဝင်ပါတယ်။ In-memory caches တွေအတွက်တော့ ဒါက no-op (ဘာမှ မလုပ်ဘဲ နေခြင်း) ဖြစ်နိုင်ပါတယ်။

`Promise<void>` ပြန်ပေးပါတယ်။

In-memory caches တွေအတွက် ဒါက no-op ဖြစ်နိုင်ပါတယ်။ Distributed caches တွေအတွက်တော့ — requests တွေကို process မလုပ်ခင် external service (သို့) database ကနေ tag state တွေကို sync လုပ်ဖို့ ဒါကို သုံးပါ။

```js
const cacheHandler = {
  async refreshTags() {
    // In-memory cache အတွက် ဘာမှ လုပ်စရာ မလိုပါ
    // Distributed cache အတွက် external service ကနေ tag state များကို sync လုပ်ပါ
  },
}
```

### `getExpiration()`

Tags တစ်စုအတွက် အများဆုံး revalidation timestamp ကို ရယူပါတယ်။

```ts
getExpiration(tags: string[]): Promise<number>
```

| Parameter | Type       | Description                            |
| --------- | ---------- | -------------------------------------- |
| `tags`    | `string[]` | Expiration စစ်ဆေးရမယ့် tags တွေရဲ့ array။ |

ပြန်ပေးတာတွေက:

- tags တစ်ခုမှ တစ်ခါမှ revalidate မလုပ်ဖူးဘူးဆိုရင် `0`
- နောက်အကျဆုံး revalidation ကို ကိုယ်စားပြုတဲ့ timestamp (milliseconds နဲ့)
- soft tags တွေကို `get` method ထဲမှာ စစ်မယ့်အစား ညွှန်ပြချင်ရင် `Infinity`

Tag revalidation timestamps တွေကို ခြေရာခံမထားဘူးဆိုရင် `0` ပြန်ပေးပါ။ မဟုတ်ရင် — ပေးထားတဲ့ tags တွေအားလုံးထဲက နောက်အကျဆုံး revalidation timestamp ကို ရှာပါ။ Soft tag စစ်ဆေးမှုကို `get` method ထဲမှာ ကိုင်တွယ်ချင်ရင် `Infinity` ပြန်ပေးပါ။

```js
const cacheHandler = {
  async getExpiration(tags) {
    // Tag revalidation ကို ခြေရာခံမထားရင် 0 ပြန်ပေးပါ
    return 0

    // ဒါမှမဟုတ် နောက်အကျဆုံး revalidation timestamp ကို ပြန်ပေးပါ
    // return Math.max(...tags.map(tag => tagTimestamps.get(tag) || 0));
  },
}
```

### `updateTags()`

Tags တွေ revalidate (သို့) သက်တမ်းကုန်သွားတဲ့အခါ ခေါ်ပါတယ်။

```ts
updateTags(tags: string[], durations?: { expire?: number }): Promise<void>
```

| Parameter   | Type                  | Description                              |
| ----------- | --------------------- | ---------------------------------------- |
| `tags`      | `string[]`            | Update လုပ်ရမယ့် tags တွေရဲ့ array။        |
| `durations` | `{ expire?: number }` | Optional expiration ကြာချိန် (seconds နဲ့)။ |

သင့် handler က ဒီ tags တွေကို invalidated အဖြစ် မှတ်သားဖို့ သူ့ရဲ့ internal state ကို update လုပ်သင့်ပါတယ်။

`Promise<void>` ပြန်ပေးပါတယ်။

Tags တွေ revalidate ဖြစ်တဲ့အခါ — သင့် handler က အဲဒီ tags တွေထဲက တစ်ခုခု ပါဝင်တဲ့ cache entries အားလုံးကို invalidate လုပ်သင့်ပါတယ်။ သင့် cache ထဲက entries တွေကို ဖြတ်သွားပြီး — ပေးထားတဲ့ list နဲ့ ကိုက်ညီတဲ့ tags ပါတဲ့ entries တွေကို ဖယ်ရှားပါ။

```js
const cacheHandler = {
  async updateTags(tags, durations) {
    // Tags ကိုက်ညီတဲ့ cache entries အားလုံးကို invalidate လုပ်ပါ
    for (const [key, entry] of cache.entries()) {
      if (entry.tags.some((tag) => tags.includes(tag))) {
        cache.delete(key)
      }
    }
  },
}
```

## CacheEntry Type (CacheEntry အမျိုးအစား)

[`CacheEntry`](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/lib/cache-handlers/types.ts) object မှာ အောက်ပါ structure ရှိပါတယ်:

```ts
interface CacheEntry {
  value: ReadableStream<Uint8Array>
  tags: string[]
  stale: number
  timestamp: number
  expire: number
  revalidate: number
}
```

| Property     | Type                         | Description                                                  |
| ------------ | ---------------------------- | ------------------------------------------------------------ |
| `value`      | `ReadableStream<Uint8Array>` | Cache လုပ်ထားတဲ့ data (stream အနေနဲ့)။                      |
| `tags`       | `string[]`                   | Cache tags (soft tags မပါဝင်)။                              |
| `stale`      | `number`                     | Client-side staleness အတွက် ကြာချိန် (seconds နဲ့)။          |
| `timestamp`  | `number`                     | Entry ကို ဖန်တီးခဲ့တဲ့ အချိန် (milliseconds timestamp နဲ့)။ |
| `expire`     | `number`                     | Entry ကို အသုံးပြုခွင့်ရှိတဲ့ ကြာချိန် (seconds နဲ့)။          |
| `revalidate` | `number`                     | Entry ကို ဘယ်လောက်ကြာမှ revalidate လုပ်သင့်လဲ (seconds နဲ့)။ |

> **သိထားသင့်သည် (Good to know):**
>
> - `value` က [`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream) တစ်ခုပါ။ Stream data တွေကို ဖတ်ပြီး သိမ်းထားဖို့လိုရင် [`.tee()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/tee) ကို သုံးပါ။
> - Stream က data တစ်စိတ်တစ်ပိုင်းနဲ့ error ဖြစ်သွားရင် — partial cache ကို သိမ်းထားမလား၊ ဖယ်ပစ်မလား ဆိုတာ သင့် handler က ဆုံးဖြတ်ရပါမယ်။

## Examples

### Basic in-memory cache handler

ဒီမှာ storage အတွက် `Map` တစ်ခု သုံးထားတဲ့ minimal implementation တစ်ခုပါ။ ဒီဥပမာက အဓိက concept တွေကို သရုပ်ပြတာ ဖြစ်ပြီး — LRU eviction, error handling နဲ့ tag management ပါတဲ့ production-ready implementation တစ်ခုအတွက်တော့ [default cache handler](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/lib/cache-handlers/default.ts) ကို ကြည့်ပါ။

```js filename="cache-handlers/memory-handler.js"
const cache = new Map()
const pendingSets = new Map()

module.exports = {
  async get(cacheKey, softTags) {
    // ဆက်လုပ်ဆောင်နေဆဲ set operation တွေ ပြီးစီးဖို့ စောင့်ပါ
    const pendingPromise = pendingSets.get(cacheKey)
    if (pendingPromise) {
      await pendingPromise
    }

    const entry = cache.get(cacheKey)
    if (!entry) {
      return undefined
    }

    // Entry သက်တမ်းကုန်သွားလား စစ်ဆေးပါ
    const now = Date.now()
    if (now > entry.timestamp + entry.revalidate * 1000) {
      return undefined
    }

    return entry
  },

  async set(cacheKey, pendingEntry) {
    // ဒီ set operation ကို ခြေရာခံဖို့ promise တစ်ခု ဖန်တီးပါ
    let resolvePending
    const pendingPromise = new Promise((resolve) => {
      resolvePending = resolve
    })
    pendingSets.set(cacheKey, pendingPromise)

    try {
      // Entry အသင့်ဖြစ်ဖို့ စောင့်ပါ
      const entry = await pendingEntry

      // Entry ကို cache ထဲမှာ သိမ်းပါ
      cache.set(cacheKey, entry)
    } finally {
      resolvePending()
      pendingSets.delete(cacheKey)
    }
  },

  async refreshTags() {
    // In-memory cache အတွက် no-op
  },

  async getExpiration(tags) {
    // Tag တွေ revalidate မဖြစ်သေးကြောင်း ညွှန်ပြဖို့ 0 ပြန်ပေးပါ
    return 0
  },

  async updateTags(tags, durations) {
    // Tag-based invalidation ကို အကောင်အထည်ဖော်ပါ
    for (const [key, entry] of cache.entries()) {
      if (entry.tags.some((tag) => tags.includes(tag))) {
        cache.delete(key)
      }
    }
  },
}
```

### External storage pattern

Redis (သို့) database လို durable storage တွေအတွက် — cache entries တွေကို serialize လုပ်ဖို့ လိုအပ်ပါတယ်။ ဒီမှာ Redis ဥပမာရိုးရိုးတစ်ခုပါ:

```js filename="cache-handlers/redis-handler.js"
const { createClient } = require('redis')

const client = createClient({ url: process.env.REDIS_URL })
client.connect()

module.exports = {
  async get(cacheKey, softTags) {
    // Redis ကနေ ပြန်ယူပါ
    const stored = await client.get(cacheKey)
    if (!stored) return undefined

    // Entry ကို deserialize လုပ်ပါ
    const data = JSON.parse(stored)

    // သိမ်းထားတဲ့ data ကနေ ReadableStream ကို ပြန်တည်ဆောက်ပါ
    return {
      value: new ReadableStream({
        start(controller) {
          controller.enqueue(Buffer.from(data.value, 'base64'))
          controller.close()
        },
      }),
      tags: data.tags,
      stale: data.stale,
      timestamp: data.timestamp,
      expire: data.expire,
      revalidate: data.revalidate,
    }
  },

  async set(cacheKey, pendingEntry) {
    const entry = await pendingEntry

    // Data ရဖို့ stream ကို ဖတ်ပါ
    const reader = entry.value.getReader()
    const chunks = []

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }

    // Redis storage အတွက် chunks တွေ ပေါင်းပြီး serialize လုပ်ပါ
    const data = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)))

    await client.set(
      cacheKey,
      JSON.stringify({
        value: data.toString('base64'),
        tags: entry.tags,
        stale: entry.stale,
        timestamp: entry.timestamp,
        expire: entry.expire,
        revalidate: entry.revalidate,
      }),
      { EX: entry.expire } // အလိုအလျောက် သက်တမ်းကုန်ခြင်းအတွက် Redis TTL ကို သုံးပါ
    )
  },

  async refreshTags() {
    // အခြေခံ Redis implementation အတွက် no-op
    // လိုအပ်ရင် external tag service နဲ့ sync လုပ်နိုင်ပါတယ်
  },

  async getExpiration(tags) {
    // Tag တွေ revalidate မဖြစ်သေးကြောင်း ညွှန်ပြဖို့ 0 ပြန်ပေးပါ
    // Tracking လုပ်နေတယ်ဆိုရင် tag expiration timestamps တွေအတွက် Redis ကို query လုပ်နိုင်ပါတယ်
    return 0
  },

  async updateTags(tags, durations) {
    // လိုအပ်ရင် tag-based invalidation ကို အကောင်အထည်ဖော်ပါ
    // Tags ကိုက်ညီတဲ့ keys တွေကို ဖြတ်ပြီး ဖျက်ပစ်နိုင်ပါတယ်
  },
}
```

## Distributed Tag Coordination (tags များကို instances အများအပြားကြား ညှိနှိုင်းခြင်း)

Next.js instances အများအပြား run နေတဲ့အခါ — tag invalidation ကို instances တွေကြားမှာ ညှိနှိုင်း ဆောင်ရွက်ရပါတယ်။ Default in-memory handler က tags တွေကို local မှာပဲ ခြေရာခံလို့ — instance တစ်ခုပေါ်မှာ `revalidateTag()` ခေါ်လိုက်တာက တခြား instance တွေကို သက်ရောက်မှု မရှိပါဘူး။

Tags တွေကို instances တွေကြားမှာ ညှိနှိုင်းဖို့:

1. **`updateTags()`** ကို `revalidateTag()` ခေါ်တဲ့အခါ ခေါ်ပါတယ်။ သင့် handler က invalidation timestamp ကို shared storage ထဲမှာ ရေးသင့်ပါတယ်။
2. **`refreshTags()`** ကို request တစ်ခုချင်းစီ မတိုင်ခင် ခေါ်ပါတယ်။ သင့် handler က shared storage ကနေ မကြာသေးတဲ့ invalidation events တွေကို ဖတ်ပြီး — သူ့ရဲ့ local tag state ကို update လုပ်သင့်ပါတယ်။
3. **`getExpiration()`** က ပေးထားတဲ့ tags တွေအားလုံးထဲက နောက်အကျဆုံး revalidation timestamp ကို ပြန်ပေးပါတယ်။ Default implementation က `Math.max(...timestamps, 0)` ကို ပြန်ပေးပါတယ်။

Redis ကို distributed tag coordination အတွက် သုံးတဲ့ ဥပမာတစ်ခုကို ဒီမှာ ပြထားပါတယ်:

```js filename="cache-handlers/distributed-tags.js"
const { createClient } = require('redis')

const client = createClient({ url: process.env.REDIS_URL })
client.connect()

// refreshTags ကတစ်ဆင့် sync လုပ်ထားတဲ့ tag timestamps တွေရဲ့ local cache
const localTagTimestamps = new Map()

module.exports = {
  // ... get() နဲ့ set() methods တွေ ...

  async refreshTags() {
    // Redis ကနေ tag invalidation timestamps တွေကို sync လုပ်ပါ
    // Tag keys တွေကို ခြေရာခံဖို့ dedicated set တစ်ခု သုံးခြင်းက keyspace ကို scan လုပ်ရတာကို ရှောင်ရှားပေးပါတယ်
    const tagKeys = await client.sMembers('revalidated-tags')
    if (tagKeys.length > 0) {
      const values = await client.mGet(tagKeys.map((k) => `tag:${k}`))
      for (let i = 0; i < tagKeys.length; i++) {
        localTagTimestamps.set(tagKeys[i], Number(values[i]))
      }
    }
  },

  async getExpiration(tags) {
    const timestamps = tags.map((tag) => localTagTimestamps.get(tag) || 0)
    return Math.max(...timestamps, 0)
  },

  async updateTags(tags, durations) {
    const now = Date.now()
    const pipeline = client.multi()
    for (const tag of tags) {
      pipeline.set(`tag:${tag}`, String(now))
      pipeline.sAdd('revalidated-tags', tag)
      localTagTimestamps.set(tag, now)
    }
    await pipeline.exec()
  },
}
```

Tag architecture အကြောင်း အပြည့်အစုံ ရှင်းလင်းချက် (soft tags နဲ့ multi-instance ထည့်သွင်းစဉ်းစားမှုတွေ အပါအဝင်) အတွက် — [How Revalidation Works](/docs/nextjs/how-revalidation-works) ကို ကြည့်ပါ။

## Soft Tags

Soft tags တွေက Next.js က route path ပေါ် အခြေခံပြီး အလိုအလျောက် ထုတ်ပေးတဲ့ implicit tags တွေပါ။ Path ထဲက segment တိုင်းအတွက် layout tag တစ်ခုစီ ပါဝင်ပြီး — leaf route ကိုယ်တိုင်လည်း ပါပါတယ်။ ဥပမာ — `/blog/hello` route က `/layout`, `/blog/layout`, `/blog/hello/layout` နဲ့ `/blog/hello` အတွက် soft tags တွေ ထုတ်ပေးပါတယ်။ ဒီ tags တွေကို internal အနေနဲ့ `_N_T_` နဲ့ prefix လုပ်ထားပါတယ်။

Soft tags တွေက [`revalidatePath()`](/docs/nextjs/revalidate-path) ကို tag-based cache system တစ်ခုတည်းကတစ်ဆင့် အလုပ်လုပ်နိုင်စေပါတယ်။ `revalidatePath('/blog/hello')` ခေါ်လိုက်တဲ့အခါ — အဲဒီ path ရဲ့ soft tags တွေနဲ့ ဆက်စပ်နေတဲ့ cache entries အားလုံးကို invalidate လုပ်ပါတယ်။

Cache handler API ထဲမှာ — soft tags တွေကို [`get()`](#get) method ဆီ `softTags` parameter အနေနဲ့ ပေးပို့ပါတယ်။ Cache entry ရဲ့ `timestamp` ပြီးနောက်မှာ soft tag တစ်ခုခု invalidate ဖြစ်ခဲ့လား ဆိုတာကို (`getExpiration()` ကတစ်ဆင့် (သို့) timestamps တွေကို တိုက်ရိုက် နှိုင်းယှဉ်ပြီး) သင့် handler က စစ်ဆေးသင့်ပါတယ်။ Soft tag တစ်ခုက entry ဖန်တီးပြီးချိန်ထက် နောက်ကျမှ invalidate ဖြစ်ခဲ့ရင် — entry ကို stale အဖြစ် သဘောထားသင့်ပါတယ်။

## Streams များကို ကိုင်တွယ်ခြင်း (Handling Streams)

`CacheEntry.value` က [`ReadableStream<Uint8Array>`](https://developer.mozilla.org/docs/Web/API/ReadableStream) တစ်ခုပါ။ Entries တွေကို external မှာ သိမ်းတဲ့ cache handler တစ်ခု implement လုပ်တဲ့အခါ သတိထားရမှာတွေက:

- **`.tee()` ကို သုံးပါ** — stream ကို သိမ်းလည်း သိမ်းချင်၊ ပြန်လည်း ပြန်ချင်ရင်။ Branch တစ်ခုက storage ဆီ သွားပြီး — နောက်တစ်ခုက caller ဆီ ပြန်ပေးပါတယ်။
- **Memory သက်ရောက်မှုများ**: Page ကြီးတွေက cache entries ကြီးတွေ ထုတ်ပေးပါတယ်။ S3 လိုမျိုး storage backends တွေအတွက် — entry တစ်ခုလုံးကို memory ထဲမှာ buffer မလုပ်ဘဲ storage ဆီ တိုက်ရိုက် stream လုပ်တာ စဉ်းစားပါ။
- **Partial writes**: Rendering လုပ်နေစဉ် တစ်ဝက်တစ်ပျက် stream က error ဖြစ်နိုင်ပါတယ်။ Partial entries တွေကို သိမ်းထားမလား ဖယ်ပစ်မလား သင့် handler က ဆုံးဖြတ်သင့်ပါတယ်။ Partial entries တွေက page မပြည့်စုံတာတွေ ထုတ်ပေးနိုင်လို့ — ဖယ်ပစ်လိုက်တာက ပိုလုံခြုံပါတယ်။

## Error ကိုင်တွယ်ခြင်း (Error Handling)

Cache operations တွေကို defensive (ကြိုတင် ကာကွယ်မှုရှိသော) နည်းလမ်းနဲ့ implement လုပ်သင့်ပါတယ်:

- **`set()` failure**: Response stream က စီးဆင်းနေပြီးမှ `set()` ကို asynchronously ခေါ်တာမို့ — user ကို response ကို ဆက်ပဲ ပေးပါတယ်။ Cache entry က ပျောက်ဆုံးသွားပြီး — နောက် request က render အသစ်တစ်ခုကို စတင်ပါတယ်။
- **`get()` failure**: သင့် handler က internal errors တွေကို ဖမ်းပြီး `undefined` ("cache miss" အချက်ပြ) ပြန်ပေးသင့်ပါတယ်။ Framework က `get()` ကို try/catch ထဲမှာ မထားတာမို့ — `get()` ကနေ ကိုင်တွယ်မထားတဲ့ exception တစ်ခုက render error အဖြစ် ပျံ့နှံ့သွားပါလိမ့်မယ်။
- **Partial writes**: Cache entry တစ်ခုကို တစ်ဝက်တစ်ပျက် ရေးပြီး ဖတ်လိုက်ရင် — အပြုအမူက undefined (သတ်မှတ်မထား) ပါ။ Partial entries တွေ မကျွေးမိအောင် — atomic writes (သို့) write-then-rename pattern တွေကို သုံးပါ။

## Platform ထောက်ပံ့မှု (Platform Support)

| Deployment Option                                                    | ထောက်ပံ့မှု            |
| -------------------------------------------------------------------- | ----------------------- |
| [Node.js server](/docs/nextjs/deploying)                             | ရသည်                   |
| [Docker container](/docs/nextjs/deploying)                           | ရသည်                   |
| [Static export](/docs/nextjs/deploying)                              | မရပါ                   |
| [Adapters](/docs/nextjs/deploying)                                   | Platform အလိုက် ကွဲပြားသည် |

## Version History

| Version   | အပြောင်းအလဲ                 |
| --------- | --------------------------- |
| `v16.0.0` | `cacheHandlers` စတင် မိတ်ဆက်ခဲ့။ |
