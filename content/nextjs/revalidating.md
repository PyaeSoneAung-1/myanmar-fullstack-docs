---
title: "Revalidating"
description: "Cache လုပ်ထားတဲ့ data တွေကို time-based (cacheLife) နဲ့ on-demand (revalidateTag, updateTag, revalidatePath) နည်းလမ်းတွေနဲ့ ဘယ်လို ပြန်လည်စစ်ဆေး (revalidate) မလဲ"
order: 9
source: "https://nextjs.org/docs/app/getting-started/revalidating"
status: translated
updated: 2026-09-01
---

> ဒီ page က [Cache Components](/docs/nextjs/cache-components) နဲ့ revalidation အကြောင်းကို ဖော်ပြပါတယ် — `next.config.ts` file ထဲမှာ [`cacheComponents: true`](/docs/nextjs/cache-components) သတ်မှတ်ပြီး enable လုပ်ပါတယ်။ Cache Components မသုံးဘူးဆိုရင် [Caching and Revalidating (Previous Model)](/docs/nextjs/caching-without-cache-components) guide ကို ကြည့်ပါ။

**Revalidation** ဆိုတာ cache လုပ်ထားတဲ့ data တွေကို update လုပ်တဲ့ လုပ်ငန်းစဉ်ပါ။ ဒါက မြန်ဆန်တဲ့ cached responses တွေကို ဆက်ပြီး ပေးနေရင်းနဲ့ — content တွေ fresh ဖြစ်နေအောင် သေချာစေပါတယ်။ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:

- **Time-based revalidation** — သတ်မှတ်ထားတဲ့ ကြာချိန်တစ်ခု ပြည့်တာနဲ့ cache လုပ်ထားတဲ့ data ကို အလိုအလျောက် refresh လုပ်ခြင်း — [`cacheLife`](#cachelife) နဲ့
- **On-demand revalidation** — mutation (ပြောင်းလဲမှု) တစ်ခု ပြီးတာနဲ့ cache လုပ်ထားတဲ့ data ကို ကိုယ်တိုင် invalidate လုပ်ခြင်း — [`revalidateTag`](#revalidatetag), [`updateTag`](#updatetag) (သို့) [`revalidatePath`](#revalidatepath) နဲ့

## `cacheLife`

[`cacheLife`](/docs/nextjs/cacheLife) က cache လုပ်ထားတဲ့ data တွေ ဘယ်လောက်ကြာကြာ valid ဖြစ်နေမလဲ ထိန်းချုပ်ပါတယ်။ Cache lifetime သတ်မှတ်ဖို့ [`use cache`](/docs/nextjs/use-cache) scope အတွင်းမှာ သုံးပါ။

```tsx
import { cacheLife } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM products')
}
```

`cacheLife` က profile name တစ်ခု (သို့) custom configuration object တစ်ခုကို လက်ခံပါတယ်:

| Profile   | `stale` | `revalidate` | `expire` |
| --------- | ------- | ------------ | -------- |
| `default` | 5m      | 15m          | never    |
| `seconds` | 30s     | 1s           | 60s      |
| `minutes` | 5m      | 1m           | 1h       |
| `hours`   | 5m      | 1h           | 1d       |
| `days`    | 5m      | 1d           | 1w       |
| `weeks`   | 5m      | 1w           | 30d      |
| `max`     | 5m      | 30d          | 1y       |

ပိုမို အတိအကျ ထိန်းချုပ်ချင်ရင် object တစ်ခု ပို့ပါ:

```tsx
'use cache'
cacheLife({
  stale: 3600, // 1 hour until considered stale
  revalidate: 7200, // 2 hours until revalidated
  expire: 86400, // 1 day until expired
})
```

> **သိထားသင့်သည်** — Cache တစ်ခုက `seconds` profile, `revalidate: 0` (သို့) မိနစ် ၅ ခုအောက် `expire` သုံးထားရင် "short-lived" (သက်တမ်းတို) အဖြစ် သတ်မှတ်ပါတယ်။ Short-lived caches တွေကို prerenders တွေကနေ အလိုအလျောက် ဖယ်ထုတ်ပြီး dynamic holes အဖြစ် ပြောင်းသွားပါတယ်။ အသေးစိတ်ကို [Prerendering behavior](/docs/nextjs/cacheLife#prerendering-behavior) မှာ ကြည့်ပါ။

Profiles အားလုံးနဲ့ custom configuration options တွေအတွက် [`cacheLife` API reference](/docs/nextjs/cacheLife) ကို ကြည့်ပါ။

## `cacheTag`

[`cacheTag`](/docs/nextjs/cacheTag) က cache လုပ်ထားတဲ့ data တွေကို tag လုပ်ပေးပြီး — on-demand နဲ့ invalidate လုပ်နိုင်အောင် လုပ်ပါတယ်။ [`use cache`](/docs/nextjs/use-cache) scope အတွင်းမှာ သုံးပါ:

```tsx
import { cacheTag } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheTag('products')
  return db.query('SELECT * FROM products')
}
```

Tag လုပ်ပြီးတာနဲ့ — [`revalidateTag`](#revalidatetag) (သို့) [`updateTag`](#updatetag) သုံးပြီး cache ကို invalidate လုပ်နိုင်ပါတယ်။

ပိုသိချင်ရင် [`cacheTag` API reference](/docs/nextjs/cacheTag) ကို ကြည့်ပါ။

## `revalidateTag`

`revalidateTag` က tag အလိုက် cache entries တွေကို stale-while-revalidate semantics နဲ့ invalidate လုပ်ပါတယ် — fresh content တွေ နောက်ခံမှာ load လုပ်နေချိန်မှာ stale content ကို ချက်ချင်း ဆက်ပေးနေပါတယ်။ ဒါက update မှာ နည်းနည်းလေး နှောင့်နှေးတာ လက်ခံနိုင်တဲ့ content တွေအတွက် အကောင်းဆုံးပါ — blog posts (သို့) product catalogs လိုမျိုးပေါ့။

```tsx
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  // Mutate data
  revalidateTag('user', 'max') // အကြံပြုချက်: stale-while-revalidate
}
```

Tag တစ်ခုတည်းကို function အများအပြားမှာ သုံးပြီး — အားလုံးကို တစ်ခါတည်း revalidate လုပ်နိုင်ပါတယ်။ `revalidateTag` ကို [Server Action](/docs/nextjs/mutating-data) (သို့) [Route Handler](/docs/nextjs/route-handlers) ထဲမှာ ခေါ်ပါ။

> **သိထားသင့်သည်** — ဒုတိယ argument က fresh content တွေ နောက်ခံမှာ ထုတ်လုပ်နေချိန်မှာ stale content ကို ဘယ်လောက်ကြာကြာ ဆက်ပေးနိုင်မလဲ သတ်မှတ်ပါတယ်။ သက်တမ်း ကုန်သွားတာနဲ့ — နောက်ထပ် requests တွေက fresh content အသင့်မဖြစ်မချင်း block ဖြစ်ပါတယ်။ `'max'` သုံးရင် stale window အရှည်ဆုံး ရပါတယ်။

ပိုသိချင်ရင် [`revalidateTag` API reference](/docs/nextjs/revalidateTag) ကို ကြည့်ပါ။

## `updateTag`

`updateTag` က read-your-own-writes ဖြစ်ရပ်တွေအတွက် cache လုပ်ထားတဲ့ data တွေကို ချက်ချင်း expire လုပ်ပါတယ် — user က stale content မဟုတ်ဘဲ သူ့ရဲ့ ပြောင်းလဲမှုကို ချက်ချင်း မြင်ရပါတယ်။ `revalidateTag` နဲ့ မတူဘဲ — ဒါကို [Server Actions](/docs/nextjs/server-actions) တွေမှာပဲ သုံးလို့ရပါတယ်။

```tsx
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    },
  })

  updateTag('posts')
  redirect(`/posts/${post.id}`)
}
```

|              | `updateTag`                                   | `revalidateTag`                      |
| ------------ | --------------------------------------------- | ------------------------------------ |
| **နေရာ**     | Server Actions တွေမှာပဲ                    | Server Actions နဲ့ Route Handlers    |
| **အပြုအမူ** | Cache ကို ချက်ချင်း expire လုပ်သည်         | Stale-while-revalidate               |
| **အသုံးပြုမှု** | Read-your-own-writes (user က သူ့ရဲ့ ပြောင်းလဲမှုကို မြင်ရသည်) | နောက်ခံမှာ refresh (နည်းနည်း နှောင့်နှေးတာ OK) |

ပိုသိချင်ရင် [`updateTag` API reference](/docs/nextjs/updateTag) ကို ကြည့်ပါ။

## `revalidatePath`

`revalidatePath` က route path တစ်ခုအတွက် cache လုပ်ထားတဲ့ data အားလုံးကို invalidate လုပ်ပါတယ်။ Route တစ်ခုကို revalidate လုပ်ချင်ပေမယ့် — ဘယ် tags တွေ ဆက်စပ်နေလဲ မသိတဲ့အခါ သုံးပါ။

```tsx
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  // Mutate data
  revalidatePath('/profile')
}
```

> **သိထားသင့်သည်** — ဖြစ်နိုင်ရင် path-based ထက် tag-based revalidation (`revalidateTag`/`updateTag`) ကို ဦးစားပေးပါ — ပိုတိကျပြီး over-invalidating (မလိုအပ်ဘဲ invalidate လုပ်မိတာ) ရှောင်နိုင်လို့ပါ။

ပိုသိချင်ရင် [`revalidatePath` API reference](/docs/nextjs/revalidatePath) ကို ကြည့်ပါ။

## ဘာတွေကို cache လုပ်သင့်လဲ

[runtime data](/docs/nextjs/caching#working-with-runtime-apis) ပေါ်မှာ မမှီခိုတဲ့ — ပြီးတော့ ကာလတစ်ခုအတွက် cache ကနေ ပေးတာ အဆင်ပြေမယ့် data တွေကို cache လုပ်ပါ။ အဲဒီအပြုအမူကို ဖော်ပြဖို့ `use cache` နဲ့ `cacheLife` ကို သုံးပါ။

Content က time-based revalidation မလိုအပ်တဲ့အခါ — ဥပမာ CMS ကနေ ရတဲ့ data — [`cacheTag`](#cachetag) နဲ့ `max` လို ရှည်လျားတဲ့ [`cacheLife`](#cachelife) တစ်ခုကို သုံးပြီး static shell ထဲမှာ ထားပါ။ Content source ကို configure လုပ်ပြီး — content ပြောင်းတဲ့အခါ [`revalidateTag`](#revalidatetag) ကို ခေါ်တဲ့ webhook (သို့) အခြား notification တစ်ခု ဖြစ်အောင် လုပ်ပါ။ ဒါက မပြောင်းလဲတဲ့ content အတွက် မလိုအပ်တဲ့ time-based revalidation တွေကို လျှော့ချပေးပါတယ်။

> **သိထားသင့်သည်** — Serverless environment တွေမှာ in-memory cache entries တွေက revalidations တွေကြားမှာ မတည်မြဲနိုင်ပါဘူး။ အသေးစိတ်အတွက် [runtime caching considerations](/docs/nextjs/use-cache#runtime-caching-considerations) ကို ကြည့်ပါ။
