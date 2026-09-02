---
title: "revalidatePath function (path အလိုက် cache ပြန်လည်စစ်ဆေးခြင်း)"
description: "revalidatePath() — Server Functions/Route Handlers တွေကနေ သတ်မှတ်ထားတဲ့ page သို့မဟုတ် layout path ရဲ့ cached data တွေကို on-demand invalidate လုပ်ခြင်း (type: 'page' | 'layout')"
order: 38
source: "https://nextjs.org/docs/app/api-reference/functions/revalidatePath"
status: translated
updated: 2026-09-02
---

`revalidatePath` က သတ်မှတ်ထားတဲ့ path တစ်ခုအတွက် [cached data](/docs/nextjs/caching) တွေကို on-demand (လိုအပ်တဲ့အခါမှ) invalidate လုပ်နိုင်စေပါတယ်။

## အသုံးပြုပုံ (Usage)

`revalidatePath` ကို [Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data) နဲ့ [Route Handlers](/docs/nextjs/route-handlers) တွေမှာ ခေါ်နိုင်ပါတယ်။

`revalidatePath` က server environments တွေမှာပဲ အလုပ်လုပ်လို့ — Client Components (သို့) Proxy တွေထဲမှာတော့ ခေါ်လို့ မရပါဘူး။

> **သိထားသင့်သည်:**
>
> - **Server Functions**: UI ကို ချက်ချင်း update လုပ်ပါတယ် (သက်ရောက်ခံရတဲ့ path ကို ကြည့်နေတယ်ဆိုရင်)။ လက်ရှိမှာ ဒါက အရင်က လည်ပတ်ခဲ့ဖူးတဲ့ pages တွေအားလုံးကိုပါ နောက်တစ်ခါ ပြန်သွားတဲ့အခါ refresh ဖြစ်စေပါတယ်။ ဒီအပြုအမူက ယာယီပါ — နောင်မှာ သတ်မှတ်ထားတဲ့ path တစ်ခုတည်းကိုပဲ သက်ရောက်အောင် ပြောင်းလဲသွားပါမယ်။
> - **Route Handlers**: Path ကို revalidation အတွက် အမှတ်အသား (mark) လုပ်ပေးပါတယ်။ Revalidation က သတ်မှတ်ထားတဲ့ path ကို နောက်တစ်ခါ လည်ပတ်တဲ့အခါမှ လုပ်ဆောင်ပါတယ်။ ဆိုလိုတာက dynamic route segment တစ်ခုနဲ့ `revalidatePath` ခေါ်လိုက်ရင် — revalidations အများအပြားကို တစ်ပြိုင်နက် ချက်ချင်း မဖြစ်ပေါ်စေပါဘူး။ Invalidation က path ကို နောက်တစ်ခါ လည်ပတ်တဲ့အခါမှပဲ ဖြစ်ပါတယ်။

## Parameters

```ts
revalidatePath(path: string, type?: 'page' | 'layout'): void;
```

- `path`: သင့် route file structure ကို ကိုယ်စားပြုတဲ့ string တစ်ခု။ `/product/123` လို literal path တစ်ခု (သို့) `/product/[slug]` လို dynamic segments ပါတဲ့ route pattern တစ်ခု ဖြစ်နိုင်ပါတယ်။ `/page` (သို့) `/layout` တွေကို နောက်ကနေ ထည့်ရေးစရာ မလိုပါဘူး — အဲဒီအစား `type` parameter ကို သုံးပါ။ စာလုံးရေ 1024 ထက် မကျော်ရပါဘူး။ ဒီတန်ဖိုးက case-sensitive ပါ။ သင့်ရဲ့ [`trailingSlash`](https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash) config ဘယ်လိုပဲ ရှိရှိ — trailing slash ထည့်စရာ မလိုပါဘူး။
- `type`: (optional) revalidate လုပ်မယ့် path ရဲ့ အမျိုးအစားကို ပြောင်းဖို့ `'page'` (သို့) `'layout'` string။ `path` ထဲမှာ `/product/[slug]` လို dynamic segment တစ်ခု ပါနေရင် — ဒီ parameter က **မဖြစ်မနေ လိုအပ်**ပါတယ်။ `path` က `/product/1` လို literal path တစ်ခုဆိုရင် — `type` ကို ချန်လိုက်ပါ။

Page တစ်ခုတည်းကို refresh လုပ်ချင်တဲ့အခါ literal path ကို သုံးပါ။ ကိုက်ညီတဲ့ pages အားလုံးကို refresh လုပ်ချင်တဲ့အခါ route pattern တစ်ခုနဲ့ `type` ကို သုံးပါ — ဥပမာ အောက်က ဥပမာများ (Examples) ထဲမှာ ကြည့်ပါ။

## Returns

`revalidatePath` က တန်ဖိုး ဘာမှ ပြန်မပေးပါဘူး။

## ဘာတွေကို invalidate လုပ်နိုင်လဲ

`path` parameter က pages, layouts (သို့) route handlers တွေကို ညွှန်ပြနိုင်ပါတယ်:

- **Pages**: သတ်မှတ်ထားတဲ့ page ကို invalidate လုပ်ပါတယ်
- **Layouts**: Layout (အဲဒီ segment က `layout.tsx`), သူ့အောက်က nested layouts အားလုံးနဲ့ — သူတို့အောက်က pages အားလုံးကို invalidate လုပ်ပါတယ်
- **Route Handlers**: Route handlers တွေအတွင်းမှာ ဝင်ရောက်ထားတဲ့ cached data တွေကို invalidate လုပ်ပါတယ်။ ဥပမာ — `revalidatePath("/api/data")` က ဒီ GET handler ကို invalidate လုပ်ပါတယ်:

```ts
// app/api/data/route.ts
export async function GET() {
  const data = await fetch('https://api.vercel.app/blog', {
    cache: 'force-cache',
  })

  return Response.json(await data.json())
}
```

## Rewrites တွေနဲ့ `revalidatePath` သုံးခြင်း

[Rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites) သုံးနေတဲ့အခါ — browser ရဲ့ address bar ထဲမှာ ပေါ်နေတဲ့ source path မဟုတ်ဘဲ **destination** path (တကယ့် route file ရှိတဲ့ နေရာ) ကို ပေးရပါမယ်။

ဥပမာ — `/blog` ကနေ `/news` ဆီ rewrite တစ်ခု ရှိနေတယ်ဆိုပါစို့:

```js
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: '/news',
      },
    ]
  },
}
```

ဒီ page ကို revalidate လုပ်ဖို့ — destination path ကို သုံးပါ:

```ts
// မှန်တယ်: destination path ကို သုံးပါ
revalidatePath('/news')

// မှားတယ်: source path က cache entry နဲ့ ကိုက်ညီမှာ မဟုတ်ဘူး
revalidatePath('/blog')
```

ဒါက `revalidatePath` က user တွေ မြင်နေရတဲ့ URL မဟုတ်ဘဲ — route file structure ပေါ်မှာ အလုပ်လုပ်လို့ပါ။ Cache entries တွေက ဘယ် route file က သူတို့ကို render လုပ်လဲ ပေါ်မူတည်ပြီး tag လုပ်ခံရပါတယ်။

## `revalidateTag` နဲ့ `updateTag` တို့နဲ့ ဆက်စပ်မှု

`revalidatePath`, [`revalidateTag`](/docs/nextjs/revalidate-tag) နဲ့ [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag) တို့က ရည်ရွယ်ချက် မတူညီပါဘူး:

- **`revalidatePath`**: သတ်မှတ်ထားတဲ့ page (သို့) layout path တစ်ခုကို invalidate လုပ်ပါတယ်
- **`revalidateTag`**: သတ်မှတ်ထားတဲ့ tags တွေပါတဲ့ data တွေကို **stale** အဖြစ် အမှတ်အသား လုပ်ပါတယ်။ အဲဒီ tags တွေကို သုံးနေတဲ့ pages အားလုံးကို သက်ရောက်ပါတယ်
- **`updateTag`**: သတ်မှတ်ထားတဲ့ tags တွေပါတဲ့ data တွေကို expire လုပ်ပါတယ်။ အဲဒီ tags တွေကို သုံးနေတဲ့ pages အားလုံးကို သက်ရောက်ပါတယ်

`revalidatePath` ကို ခေါ်လိုက်တဲ့အခါ — သတ်မှတ်ထားတဲ့ path တစ်ခုတည်းပဲ နောက်တစ်ခါ လည်ပတ်တဲ့အခါ fresh data ရပါတယ်။ Data tags တွေ တူညီနေတဲ့ အခြား pages တွေကတော့ — အဲဒီ tags တွေကိုပါ သီးခြား revalidate မလုပ်မချင်း cache လုပ်ထားတဲ့ data ကို ဆက်ပြီး ပေးနေပါလိမ့်မယ်:

```tsx
// Page A: /blog
const posts = await fetch('https://api.vercel.app/blog', {
  next: { tags: ['posts'] },
})

// Page B: /dashboard
const recentPosts = await fetch('https://api.vercel.app/blog?limit=5', {
  next: { tags: ['posts'] },
})
```

`revalidatePath('/blog')` ကို ခေါ်ပြီးတဲ့ နောက်မှာ:

- **Page A (/blog)**: Fresh data ပြသပါတယ် (page ကို ပြန် render လုပ်လို့)
- **Page B (/dashboard)**: Stale data ကို ဆက်ပြသပါတယ် (cache tag `'posts'` ကို invalidate မလုပ်ရသေးလို့)

[`revalidateTag` နဲ့ `updateTag` ကြားက ကွာခြားချက်](https://nextjs.org/docs/app/api-reference/functions/updateTag#differences-from-revalidatetag) အကြောင်း လေ့လာပါ။

### Revalidation utility တွေ တည်ဆောက်ခြင်း

`revalidatePath` နဲ့ `updateTag` တို့က ပေါင်းစပ်လုပ်ဆောင်လေ့ ရှိတဲ့ primitives တွေပါ — app တစ်ခုလုံးမှာ data consistency (ဒေတာ ညီညွတ်မှု) သေချာစေဖို့ utility functions တွေထဲမှာ အတူတူ သုံးလေ့ ရှိပါတယ်:

```ts
'use server'

import { revalidatePath, updateTag } from 'next/cache'

export async function updatePost() {
  await updatePostInDatabase()

  revalidatePath('/blog') // Blog page ကို refresh လုပ်ပါ
  updateTag('posts') // 'posts' tag သုံးထားတဲ့ pages အားလုံးကို refresh လုပ်ပါ
}
```

ဒီပုံစံက သတ်မှတ်ထားတဲ့ page ရော — တူညီတဲ့ data သုံးနေတဲ့ အခြား pages တွေပါ တသမတ်တည်း ဖြစ်နေအောင် သေချာစေပါတယ်။

## ဥပမာများ

### တစ်ခုတည်းသော path တစ်ခု revalidate လုပ်ခြင်း

```ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/post-1')
```

ဒါက နောက်တစ်ခါ page လည်ပတ်တဲ့အခါ revalidation အတွက် path တစ်ခုတည်းကို invalidate လုပ်ပါတယ်။

### Page path တစ်ခု revalidate လုပ်ခြင်း

```ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/[slug]', 'page')
// (သို့) route groups တွေနဲ့
revalidatePath('/(main)/blog/[slug]', 'page')
```

ဒါက ပေးထားတဲ့ `page` file နဲ့ ကိုက်ညီတဲ့ path တစ်ခုခုကို နောက်တစ်ခါ လည်ပတ်တဲ့အခါ revalidation အတွက် invalidate လုပ်ပါတယ်။ ဒါက အဲဒီ page ရဲ့ **အောက်က pages တွေကိုတော့ invalidate မလုပ်ပါဘူး** — ဥပမာ `/blog/[slug]` က `/blog/[slug]/[author]` ကို invalidate လုပ်မှာ မဟုတ်ပါဘူး။

### Layout path တစ်ခု revalidate လုပ်ခြင်း

```ts
import { revalidatePath } from 'next/cache'
revalidatePath('/blog/[slug]', 'layout')
// (သို့) route groups တွေနဲ့
revalidatePath('/(main)/post/[slug]', 'layout')
```

ဒါက ပေးထားတဲ့ `layout` file နဲ့ ကိုက်ညီတဲ့ path တစ်ခုခုကို နောက်တစ်ခါ လည်ပတ်တဲ့အခါ revalidation အတွက် invalidate လုပ်ပါတယ်။ ဒါက အဲဒီ layout ကို မျှဝေသုံးနေတဲ့ အောက်က pages တွေကိုပါ invalidate ဖြစ်စေပြီး နောက်တစ်ခါ လည်ပတ်တဲ့အခါ revalidate ဖြစ်စေပါတယ် — အပေါ်က ဥပမာမှာဆို `/blog/[slug]/[another]` ပါ invalidate ဖြစ်ပြီး နောက်တစ်ခါ လည်ပတ်တဲ့အခါ revalidate ဖြစ်ပါတယ်။

### Data အားလုံး revalidate လုပ်ခြင်း

```ts
import { revalidatePath } from 'next/cache'

revalidatePath('/', 'layout')
```

ဒါက [Client Cache](https://nextjs.org/docs/app/glossary#client-cache) ကို ရှင်းလင်းပြီး — cached data အားလုံးကို နောက်တစ်ခါ လည်ပတ်တဲ့အခါ revalidation အတွက် invalidate လုပ်ပါတယ်။

### Server Function

```ts
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export default async function submit() {
  await submitForm()
  revalidatePath('/')
}
```

### Route Handler

```ts
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')

  if (path) {
    revalidatePath(path)
    return Response.json({ revalidated: true, now: Date.now() })
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing path to revalidate',
  })
}
```
