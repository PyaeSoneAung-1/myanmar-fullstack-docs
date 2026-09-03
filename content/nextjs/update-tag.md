---
title: "updateTag function (read-your-own-writes အတွက် cached data ကို ချက်ချင်း update လုပ်ခြင်း)"
description: "updateTag() — Server Actions တွေထဲကနေ cache tag တစ်ခုအတွက် cached data ကို on-demand ချက်ချင်း expire/invalidate လုပ်ခြင်း; read-your-own-writes အခြေအနေများ, revalidateTag နဲ့ ကွာခြားချက်များ, ဘယ်အခါ သုံးမလဲ"
order: 143
source: "https://nextjs.org/docs/app/api-reference/functions/updateTag"
status: translated
updated: 2026-09-03
---

`updateTag` က [Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data) တွေထဲကနေ — သတ်မှတ်ထားတဲ့ cache tag တစ်ခုအတွက် cached data ကို on-demand (လိုအပ်တဲ့အခါမှ) update လုပ်နိုင်စေပါတယ်။

ဒီ function က **read-your-own-writes** (ကိုယ်ရေးထားတာ ကိုယ်ပြန်ဖတ်ခြင်း) အခြေအနေတွေအတွက် ဒီဇိုင်းထုတ်ထားပါတယ် — user တစ်ယောက်က ပြောင်းလဲမှုတစ်ခု လုပ်လိုက်တဲ့အခါ (ဥပမာ post တစ်ခု ဖန်တီးတာ) — UI က stale data အစား အပြောင်းအလဲကို ချက်ချင်း ပြသပေးတာမျိုးပါ။

## အသုံးပြုပုံ (Usage)

`updateTag` ကို [Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data) တွေထဲကနေပဲ ခေါ်လို့ ရပါတယ်။ Route Handlers, Client Components (သို့) အခြား context တွေထဲမှာတော့ မသုံးနိုင်ပါဘူး။

Route Handlers (သို့) အခြား context တွေထဲမှာ cache tags တွေကို invalidate လုပ်ဖို့ လိုအပ်ရင် — [`revalidateTag`](/docs/nextjs/revalidate-tag) ကို သုံးပါ။

> **သိထားသင့်သည်:** `updateTag` က သတ်မှတ်ထားတဲ့ tag အတွက် cached data ကို ချက်ချင်း expire ဖြစ်စေပါတယ်။ နောက် request တစ်ခုက cache ကနေ stale content ကို မပေးဘဲ — fresh data ရဖို့ စောင့်ဆိုင်းပါလိမ့်မယ်။ ဒါကြောင့် users တွေက သူတို့ရဲ့ အပြောင်းအလဲတွေကို ချက်ချင်း မြင်ရတာ သေချာစေပါတယ်။

## Parameters

```tsx
updateTag(tag: string): void;
```

- `tag`: Update လုပ်ချင်တဲ့ data နဲ့ ဆက်စပ်ထားတဲ့ cache tag ကို ကိုယ်စားပြုတဲ့ string တစ်ခု။ စာလုံးရေ 256 ထက် မကျော်ရပါဘူး။ ဒီတန်ဖိုးက case-sensitive ဖြစ်ပါတယ်။

Tags တွေကို အရင်ဆုံး cached data တွေနဲ့ တွဲသတ်မှတ် (assign) ထားရပါမယ်။ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:

- External API requests တွေကို cache လုပ်ဖို့ `fetch` နဲ့ [`next.tags`](/docs/nextjs/fetch) option ကို သုံးခြင်း:

```tsx
fetch(url, { next: { tags: ['posts'] } })
```

- `'use cache'` directive ပါတဲ့ cached functions (သို့) components တွေထဲမှာ [`cacheTag`](/docs/nextjs/cache-tag) ကို သုံးခြင်း:

```tsx
import { cacheTag } from 'next/cache'

async function getData() {
  'use cache'
  cacheTag('posts')
  // ...
}
```

## Returns

`updateTag` က တန်ဖိုး ဘာမှ ပြန်မပေးပါဘူး။

## revalidateTag နဲ့ ကွာခြားချက်များ

`updateTag` ရော `revalidateTag` ပါ cached data တွေကို invalidate လုပ်ပေးပေမယ့် — ရည်ရွယ်ချက်တွေ မတူညီပါဘူး:

- **`updateTag`**:
  - Server Actions တွေထဲမှာပဲ သုံးလို့ ရပါတယ်
  - နောက် request က fresh data ကို စောင့်ပါတယ် (stale content ကို မပေးပါဘူး)
  - Read-your-own-writes အခြေအနေတွေအတွက် ဒီဇိုင်းထုတ်ထားပါတယ်

- **`revalidateTag`**:
  - Server Actions ရော Route Handlers တွေမှာပါ သုံးလို့ ရပါတယ်
  - `profile="max"` (အကြံပြုထား) နဲ့ဆို: နောက်ခံမှာ fresh data ယူနေချိန် cached data ကို ဆက်ပေးပါတယ် (stale-while-revalidate)
  - Custom profile နဲ့ဆို: အဆင့်မြင့် အသုံးပြုမှုတွေအတွက် cache life profile တစ်ခုခုကို configure လုပ်နိုင်ပါတယ်
  - Profile မပါဘဲ: `updateTag` နဲ့ ညီမျှတဲ့ legacy (အမွေဆက်ခံ) အပြုအမူ

## ဥပမာများ

### Read-your-own-writes ပါတဲ့ Server Action

```ts filename="app/actions.ts" switcher
'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  // Create the post in your database
  const post = await db.post.create({
    data: { title, content },
  })

  // Invalidate cache tags so the new post is immediately visible
  // 'posts' tag: affects any page that displays a list of posts
  updateTag('posts')
  // 'post-{id}' tag: affects the individual post detail page
  updateTag(`post-${post.id}`)

  // Redirect to the new post - user will see fresh data, not cached
  redirect(`/posts/${post.id}`)
}
```

```js filename="app/actions.js" switcher
'use server'

import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData) {
  const title = formData.get('title')
  const content = formData.get('content')

  // Create the post in your database
  const post = await db.post.create({
    data: { title, content },
  })

  // Invalidate cache tags so the new post is immediately visible
  // 'posts' tag: affects any page that displays a list of posts
  updateTag('posts')
  // 'post-{id}' tag: affects the individual post detail page
  updateTag(`post-${post.id}`)

  // Redirect to the new post - user will see fresh data, not cached
  redirect(`/posts/${post.id}`)
}
```

### Server Actions အပြင်မှာ သုံးရင် error

Server Action တစ်ခုရဲ့ အပြင်ဘက်မှာ `updateTag` ကို ခေါ်ရင် — error တစ်ခု throw ဖြစ်ပါလိမ့်မယ်:

```ts filename="app/api/posts/route.ts" switcher
import { revalidateTag, updateTag } from 'next/cache'

export async function POST() {
  // This will throw an error
  updateTag('posts')
  // Error: updateTag can only be called from within a Server Action

  // Use revalidateTag instead in Route Handlers
  revalidateTag('posts', 'max')
}
```

## updateTag ကို ဘယ်အခါ သုံးမလဲ

ဒီအခြေအနေတွေမှာ `updateTag` ကို သုံးပါ:

- Server Action တစ်ခုထဲမှာ ရှိနေတဲ့အခါ
- Read-your-own-writes အတွက် ချက်ချင်း cache invalidation လိုအပ်နေတဲ့အခါ
- နောက် request က update ဖြစ်ထားတဲ့ data ကို မြင်ရမယ်လို့ သေချာစေချင်တဲ့အခါ

အဲဒီအစား ဒီအခြေအနေတွေမှာ `revalidateTag` ကို သုံးပါ:

- Route Handler (သို့) action မဟုတ်တဲ့ အခြား context တစ်ခုထဲမှာ ရှိနေတဲ့အခါ
- Stale-while-revalidate semantics တွေ လိုချင်တဲ့အခါ
- Cache invalidation အတွက် webhook (သို့) API endpoint တစ်ခု တည်ဆောက်နေတဲ့အခါ

## ဆက်စပ်အကြောင်းအရာများ (Related)

- [`revalidateTag`](/docs/nextjs/revalidate-tag) — Route Handlers တွေထဲမှာ tags တွေကို invalidate လုပ်ဖို့
- [`revalidatePath`](/docs/nextjs/revalidate-path) — သတ်မှတ်ထားတဲ့ paths တွေကို invalidate လုပ်ဖို့
