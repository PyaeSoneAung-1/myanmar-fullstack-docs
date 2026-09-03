---
title: "cacheHandler (ကိုယ်ပိုင် cache handler သတ်မှတ်ချက်)"
description: "cacheHandler option (ယခင် incrementalCacheHandlerPath) — cached pages/data များကို durable storage (Redis, Memcached စသည်) တွင် သိမ်းရန် (သို့) containers/instances အများအပြားကြား cache မျှဝေရန် cache တည်နေရာ သတ်မှတ်ချက်; get/set/revalidateTag/resetRequestCache methods; next/image optimization caching အတွက်လည်း သုံးနိုင်"
order: 209
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath"
status: translated
updated: 2026-09-03
---

Cached pages နဲ့ data တွေကို durable storage (ကြာရှည်ခံ storage) မှာ သိမ်းဆည်းချင်တာ (သို့) သင့် Next.js application ရဲ့ containers (သို့) instances အများအပြားကြားမှာ cache ကို မျှဝေသုံးချင်တယ်ဆိုရင် — Next.js cache ရဲ့ တည်နေရာကို configure လုပ်နိုင်ပါတယ်။

> **သိထားသင့်သည် (Good to know):** `cacheHandler` (singular — အနည်းကိန်း) configuration ကို Next.js က server cache operations — ISR သိမ်းဆည်းခြင်းနဲ့ revalidating, route handler responses နဲ့ optimized images လိုမျိုးတွေအတွက် သီးသန့် အသုံးပြုပါတယ်။ ဒါက `'use cache'` directives တွေအတွက် **မဟုတ်ပါဘူး**။ `'use cache'` directives တွေအတွက်ဆိုရင် [`cacheHandlers`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) (plural — အများကိန်း) ကို သုံးပါ။ [`cacheMaxMemorySize`](/docs/nextjs/next-config-cache-max-memory-size) က နှစ်ခုလုံးနဲ့ သီးခြားဖြစ်ပြီး — တစ်ခုချင်းစီအတွက် in-memory cache ရဲ့ အရွယ်အစားကို သတ်မှတ်ပေးပါတယ်။

```js filename="next.config.js"
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  cacheMaxMemorySize: 0, // disable default in-memory caching
}
```

[custom cache handler တစ်ခုရဲ့ ဥပမာကို ကြည့်ပြီး](/docs/nextjs/self-hosting) implementation အကြောင်း ပိုလေ့လာပါ။

## API Reference

Cache handler က အောက်ပါ methods တွေကို implement လုပ်နိုင်ပါတယ်: `get`, `set`, `revalidateTag` နဲ့ `resetRequestCache` တို့ဖြစ်ပါတယ်။

### `get()`

| Parameter | Type     | Description                                 |
| --------- | -------- | ------------------------------------------- |
| `key`     | `string` | Cache လုပ်ထားတဲ့ တန်ဖိုးဆီကို ညွှန်တဲ့ key။          |
| `ctx`     | `object` | Cache entry ရဲ့ အမျိုးအစား အပါအဝင် context။ |

`ctx` parameter မှာ ပြန်ယူနေတဲ့ cache entry ရဲ့ အမျိုးအစားကို ဖော်ပြတဲ့ `kind` property တစ်ခု ပါဝင်ပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `'APP_PAGE'`, `'APP_ROUTE'`, `'PAGES'`, `'FETCH'` နဲ့ `'IMAGE'` တို့ ဖြစ်ပါတယ်။

တွေ့ရှိရင် cache လုပ်ထားတဲ့ တန်ဖိုးကို ပြန်ပေးပြီး — မတွေ့ရင် `null` ပြန်ပေးပါတယ်။

### `set()`

| Parameter | Type             | Description                              |
| --------- | ---------------- | ---------------------------------------- |
| `key`     | `string`         | Data ကို သိမ်းဆည်းရမယ့် key။                |
| `data`    | Data (သို့) `null` | Cache လုပ်ရမယ့် data။                       |
| `ctx`     | `{ tags: [] }`   | ပေးထားတဲ့ cache tags တွေ။                    |

`data` object မှာ cache entry ရဲ့ အမျိုးအစားကို ဖော်ပြတဲ့ `kind` property တစ်ခု ပါဝင်ပါတယ်။ Image optimization အတွက်ဆိုရင် `kind` က `'IMAGE'` ဖြစ်ပြီး data ထဲမှာ `buffer`, `etag`, `extension` နဲ့ `revalidate` လိုမျိုး properties တွေ ပါဝင်ပါလိမ့်မယ်။

`Promise<void>` ပြန်ပေးပါတယ်။

### `revalidateTag()`

| Parameter | Type                     | Description                        |
| --------- | ------------------------ | ---------------------------------- |
| `tag`     | `string` (သို့) `string[]` | Revalidate လုပ်ရမယ့် cache tags တွေ။ |

`Promise<void>` ပြန်ပေးပါတယ်။ [revalidating data](/docs/nextjs/incremental-static-regeneration) (သို့) [`revalidateTag()`](/docs/nextjs/revalidate-tag) function အကြောင်း ပိုလေ့လာပါ။

### `resetRequestCache()`

ဒီ method က နောက် request တစ်ခု မလာခင် — request တစ်ခုတည်းအတွက် ယာယီ in-memory cache ကို reset လုပ်ပါတယ်။

`void` ပြန်ပေးပါတယ်။

**သိထားသင့်သည်:**

- `revalidatePath` က cache tags တွေအပေါ် တည်ဆောက်ထားတဲ့ convenience layer တစ်ခုပါ။ `revalidatePath` ခေါ်လိုက်ရင် သင့် `revalidateTag` function ကို ခေါ်ပေးပါလိမ့်မယ် — path ကို အခြေခံပြီး cache keys တွေကို tag လုပ်ချင်လားဆိုတာ အဲဒီမှာ သင်ကိုယ်တိုင် ရွေးချယ်နိုင်ပါတယ်။

## Image optimization caching

`cacheHandler` ကို `next/image` ကနေ optimized images တွေကို cache လုပ်ဖို့လည်း သုံးနိုင်ပါတယ်။ ဒါကို ဖွင့်ဖို့ — သင့် `next.config.js` ထဲမှာ `images.customCacheHandler` ကို `true` အဖြစ် သတ်မှတ်ပါ:

```js filename="next.config.js"
module.exports = {
  cacheHandler: require.resolve('./cache-handler.js'),
  images: {
    customCacheHandler: true,
  },
}
```

> **သိထားသင့်သည် (Good to know):** ဒီ opt-in flag က နောက် major version တစ်ခုမှာ default အပြုအမူ ဖြစ်လာပါလိမ့်မယ်။ အခု သတ်မှတ်ထားခြင်းက — image optimization entries တွေအတွက် သင့် cache handler ကို ကြိုပြီး အသင့်ပြင်ဆင်နိုင်စေပါတယ်။

လိုအပ်ရင် cache entry types တွေကို ခွဲခြားပြီး images တွေကို သီးခြားစီ ကိုင်တွယ်ဖို့ `kind` property ကို သုံးနိုင်ပါတယ် — ဥပမာ eviction policy တစ်ခု အကောင်အထည်ဖော်တာ (သို့) images တွေကို နေရာအခြားတစ်ခုမှာ သိမ်းဆည်းတာမျိုးပါ။

Image cache entries တွေကို ကိုင်တွယ်တဲ့အခါ `kind` က `'IMAGE'` ဖြစ်ပြီး data ထဲမှာ `buffer`, `etag`, `extension` နဲ့ `revalidate` properties တွေ ပါဝင်ပါလိမ့်မယ်။

## Platform ထောက်ပံ့မှု (Platform Support)

| Deployment Option                                    | ထောက်ပံ့မှု         |
| ---------------------------------------------------- | ------------------- |
| [Node.js server](/docs/nextjs/deploying)             | ရသည်               |
| [Docker container](/docs/nextjs/deploying)           | ရသည်               |
| [Static export](/docs/nextjs/deploying)              | မရပါ               |
| [Adapters](/docs/nextjs/deploying)                   | Platform အလိုက် ကွဲပြားသည် |

Next.js ကို self-host လုပ်တဲ့အခါ [ISR ကို configure လုပ်နည်း](/docs/nextjs/self-hosting) ကို လေ့လာပါ။

## Version History

| Version   | Changes                                                       |
| --------- | ------------------------------------------------------------- |
| `v16.2.0` | `cacheHandler` မှာ image optimization caching အတွက် ထောက်ပံ့မှု။ |
| `v14.1.0` | `cacheHandler` အဖြစ် ပြန်လည်မှည့်ခေါ်ပြီး stable ဖြစ်လာ။                 |
| `v13.4.0` | `incrementalCacheHandlerPath` မှာ `revalidateTag` အတွက် ထောက်ပံ့မှု။  |
| `v13.4.0` | `incrementalCacheHandlerPath` မှာ standalone output အတွက် ထောက်ပံ့မှု။ |
| `v12.2.0` | Experimental `incrementalCacheHandlerPath` ထပ်ဖြည့်ခဲ့။            |
