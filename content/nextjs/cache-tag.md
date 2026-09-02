---
title: "cacheTag function (cache entries များကို tag လုပ်ခြင်း)"
description: "cacheTag() — `use cache` scope အတွင်းက cached data တွေကို tag လုပ်ပြီး on-demand invalidation (updateTag/revalidateTag) အတွက် ပြင်ဆင်နည်း — tags ကန့်သတ်ချက်များ နှင့် ဥပမာများ"
order: 54
source: "https://nextjs.org/docs/app/api-reference/functions/cacheTag"
status: translated
updated: 2026-09-02
---

`cacheTag` function က cached data တွေကို on-demand invalidation (လိုအပ်တဲ့အခါမှ ပြန်လည်စစ်ဆေးခြင်း) အတွက် tag လုပ်နိုင်စေပါတယ်။ Cache entries တွေနဲ့ tags တွေကို တွဲထားခြင်းဖြင့် — အခြား cached data တွေကို မထိခိုက်စေဘဲ ကိုယ်လိုချင်တဲ့ cache entries တွေကိုပဲ ရွေးချယ် purge (သို့) revalidate လုပ်နိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

`cacheTag` သုံးဖို့ `next.config.js` file ထဲမှာ [`cacheComponents` flag](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ကို ဖွင့်ပါ:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

JavaScript project တွေမှာဆို `module.exports = { cacheComponents: true }` ပုံစံနဲ့ ရေးနိုင်ပါတယ်။

`cacheTag` function က string values တစ်ခု (သို့) တစ်ခုထက်ပို လက်ခံပါတယ်:

```ts
// app/data.ts
import { cacheTag } from 'next/cache'

export async function getData() {
  'use cache'
  cacheTag('my-data')
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return data
}
```

JavaScript project တွေမှာလည်း type annotations မပါဘဲ အလားတူ code မျိုး ရေးနိုင်ပါတယ်။

ပြီးရင် [Server Function](https://nextjs.org/docs/app/getting-started/mutating-data) (သို့) [Route Handler](/docs/nextjs/route-handlers) တစ်ခုကနေ cache ကို on-demand purge လုပ်နိုင်ပါတယ်:

- [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag) ကို — read-your-own-writes အခြေအနေတွေမှာ သုံးပါ။ ဥပမာ forms (သို့) user-triggered mutations လိုမျိုး — user တစ်ယောက် ပြောင်းလဲမှု လုပ်လိုက်ပြီး နောက် read တစ်ခုက fresh data ကို ချက်ချင်း ရသင့်တဲ့နေရာမျိုးပါ။ `updateTag` က Server Functions တွေထဲမှာပဲ ရနိုင်ပါတယ်။
- [`revalidateTag`](/docs/nextjs/revalidate-tag) ကို — revalidation ကို background မှာ လုပ်နေချိန် stale data ပေးတာ လက်ခံနိုင်တဲ့အခါ (သို့) [Route Handler](/docs/nextjs/route-handlers) တစ်ခု (သို့) အခြား context ကနေ revalidate လုပ်တဲ့အခါ သုံးပါ။

ဥပမာ — ဒီ Server Function က post တစ်ခု ထည့်ပြီး `'my-data'` လို့ tag လုပ်ထားတဲ့ cache entries တိုင်းကို purge လုပ်လိုက်တာမို့ — နောက် read တစ်ခုက အပြောင်းအလဲကို ထင်ဟပ်စေပါတယ်:

```ts
// app/action.ts
'use server'

import { updateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  updateTag('my-data')
}
```

## သိထားသင့်သည် (Good to know)

- **Idempotent Tags**: Tag တစ်ခုတည်းကို အကြိမ်ကြိမ် သက်ရောက်စေတာက နောက်ထပ် အကျိုးသက်ရောက်မှု မရှိပါဘူး။
- **Tags အများအပြား**: `cacheTag` ကို string values အများအပြား ပေးပြီး cache entry တစ်ခုကို tags တစ်ခုထက်ပို သတ်မှတ်နိုင်ပါတယ်:

```tsx
cacheTag('tag-one', 'tag-two')
```

- **ကန့်သတ်ချက်များ**: `cacheTag()` call တစ်ခုက tags 128 ခုအထိ လက်ခံပြီး — tag တစ်ခုစီက အများဆုံး စာလုံးရေ 256 ရှိရပါမယ်။ 256 ကျော်တဲ့ tags တွေကို ကျော်လိုက်ပြီး — call တစ်ခုထဲမှာ 128 ခုမြောက်နောက်ပိုင်း tags တွေကို ဖြုတ်ချပါတယ်။ နှစ်မျိုးစလုံးမှာ console warning တစ်ခု log တက်ပါတယ်။

## ဥပမာများ

### Components (သို့) functions တွေကို tagging လုပ်ခြင်း

Cached function (သို့) component တစ်ခုအတွင်းမှာ `cacheTag` ခေါ်ပြီး သင့် cached data ကို tag လုပ်ပါ:

```tsx
// app/components/bookings.tsx
import { cacheTag } from 'next/cache'

interface BookingsProps {
  type: string
}

export async function Bookings({ type = 'haircut' }: BookingsProps) {
  'use cache'
  cacheTag('bookings-data')

  async function getBookingsData() {
    const response = await fetch(
      `https://api.example.com/bookings?type=${encodeURIComponent(type)}`
    )
    const data = await response.json()
    return data
  }

  return //...
}
```

JavaScript project တွေမှာလည်း `interface` နဲ့ type annotations တွေ မပါဘဲ အလားတူ code မျိုး ရေးနိုင်ပါတယ်။

### External data ကနေ tags ဖန်တီးခြင်း

Async function တစ်ခုရဲ့ ပြန်ပေးတဲ့ data ကို သုံးပြီး cache entry ကို tag လုပ်နိုင်ပါတယ်:

```tsx
// app/components/bookings.tsx
import { cacheTag } from 'next/cache'

interface BookingsProps {
  type: string
}

export async function Bookings({ type = 'haircut' }: BookingsProps) {
  async function getBookingsData() {
    'use cache'
    const response = await fetch(
      `https://api.example.com/bookings?type=${encodeURIComponent(type)}`
    )
    const data = await response.json()
    cacheTag('bookings-data', data.id)
    return data
  }
  return //...
}
```

### Tag လုပ်ထားတဲ့ cache ကို invalidate လုပ်ခြင်း

[`revalidateTag`](/docs/nextjs/revalidate-tag) ကို သုံးပြီး လိုအပ်တဲ့အခါ tag တစ်ခုအတွက် cache ကို invalidate လုပ်နိုင်ပါတယ်:

```ts
// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function updateBookings() {
  await updateBookingData()
  revalidateTag('bookings-data', 'max')
}
```
