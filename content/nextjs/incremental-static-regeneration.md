---
title: "Incremental Static Regeneration (ISR) အကောင်အထည်ဖော်နည်း"
description: "Incremental Static Regeneration (ISR) နဲ့ runtime မှာ static pages တွေကို ဘယ်လို ဖန်တီး/update လုပ်မလဲ — generateStaticParams, revalidate (time-based) နဲ့ revalidatePath/revalidateTag (on-demand) revalidation, caching, troubleshooting နဲ့ platform support အကြောင်း — Cache Components မသုံးတဲ့ project တွေအတွက်"
order: 183
source: "https://nextjs.org/docs/app/guides/incremental-static-regeneration"
status: translated
updated: 2026-09-03
---

<details>
  <summary>ဥပမာများ (Examples)</summary>

- [Next.js Commerce](https://vercel.com/templates/next.js/nextjs-commerce)
- [On-Demand ISR](https://on-demand-isr.vercel.app)
- [Next.js Forms](https://github.com/vercel/next.js/tree/canary/examples/next-forms)

</details>

> **သိထားသင့်သည်**: ဒီ guide က Cache Components မပါတဲ့ ISR အကြောင်း ဖြစ်ပါတယ်။ [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ကို သုံးနေတယ်ဆိုရင် — [Cache Components နဲ့ ISR](/docs/nextjs/incremental-static-regeneration-cache-components) ကို ကြည့်ပါ။

**Incremental Static Regeneration (ISR)** က အောက်ပါတို့ကို လုပ်နိုင်စေပါတယ်:

- Site တစ်ခုလုံးကို ပြန်ပြန် build မလုပ်ဘဲ static content တွေကို update လုပ်ခြင်း
- Requests အများစုအတွက် prerender လုပ်ပြီးသား static pages တွေကို ပေးဝေခြင်းအားဖြင့် server load ကို လျှော့ချခြင်း
- Pages တွေမှာ သင့်လျော်တဲ့ `cache-control` headers တွေကို အလိုအလျောက် ထည့်ပေးခြင်း
- `next build` အချိန် ကြာမြင့်စရာ မလိုဘဲ content pages အများအပြားကို ကိုင်တွယ်နိုင်ခြင်း

ဒီမှာ အနည်းဆုံး (minimal) ဥပမာတစ်ခု ဖြစ်ပါတယ်:

```tsx filename="app/blog/[id]/page.tsx" switcher
interface Post {
  id: string
  title: string
  content: string
}

// Next.js က request တစ်ခု ဝင်လာတိုင်း — စက္ကန့် 60 အတွင်း
// အများဆုံး တစ်ကြိမ်နှုန်းနဲ့ cache ကို invalidate လုပ်ပါလိမ့်မယ်။
export const revalidate = 60

export async function generateStaticParams() {
  const posts: Post[] = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
  return posts.map((post) => ({
    id: String(post.id),
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post: Post = await fetch(`https://api.vercel.app/blog/${id}`).then(
    (res) => res.json()
  )
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

```jsx filename="app/blog/[id]/page.jsx" switcher
// Next.js က request တစ်ခု ဝင်လာတိုင်း — စက္ကန့် 60 အတွင်း
// အများဆုံး တစ်ကြိမ်နှုန်းနဲ့ cache ကို invalidate လုပ်ပါလိမ့်မယ်။
export const revalidate = 60

export async function generateStaticParams() {
  const posts = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
  return posts.map((post) => ({
    id: String(post.id),
  }))
}

export default async function Page({ params }) {
  const { id } = await params
  const post = await fetch(`https://api.vercel.app/blog/${id}`).then((res) =>
    res.json()
  )
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

ဒီဥပမာ အလုပ်လုပ်ပုံက ဒီလိုပါ:

1. [`generateStaticParams`](/docs/nextjs/generate-static-params) က prerender လုပ်ဖို့ posts စာရင်းကို ပြန်ပေးခြင်းအားဖြင့် dynamic route အတွက် ISR ကို enable လုပ်ပါတယ်
2. `next build` ကာလအတွင်းမှာ post တစ်ခုချင်းစီအတွက် page တစ်ခု prerender လုပ်ပါတယ်
3. ဒီ pages တွေဆီ (ဥပမာ `/blog/1`) လုပ်တဲ့ requests တွေအားလုံးကို cache လုပ်ပြီး ချက်ချင်း (instant) ပြန်ပေးပါတယ်
4. စက္ကန့် 60 ကျော်သွားတာနဲ့ နောက်ထပ် request တစ်ခုက cache လုပ်ထားတဲ့ (အခု stale ဖြစ်နေတဲ့) page ကိုပဲ ဆက်ပြန်ပေးပါတယ်
5. Cache ကို invalidate လုပ်ပြီး page အသစ်တစ်ခုကို နောက်ခံမှာ စတင် generate လုပ်ပါတယ်
6. အောင်မြင်စွာ generate လုပ်ပြီးတာနဲ့ နောက် request က update လုပ်ထားတဲ့ page ကို ပြန်ပေးပြီး — နောက်ထပ် requests တွေအတွက် cache လုပ်ပါတယ်
7. `/blog/26` ကို request လုပ်ပြီး အဲဒီ post တည်ရှိနေရင် — page ကို on-demand အနေနဲ့ generate လုပ်ပါလိမ့်မယ်။ ဒီအပြုအမူကို မတူညီတဲ့ [dynamicParams](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams) value တစ်ခုကို သုံးပြီး ပြောင်းလဲနိုင်ပါတယ်။ ဒါပေမယ့် post မတည်ရှိဘူးဆိုရင် 404 ကို ပြန်ပေးပါတယ်။

## Reference

### Route segment config

- [`revalidate`](/docs/nextjs/caching-without-cache-components)
- [`dynamicParams`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams)

### Functions

- [`generateStaticParams`](/docs/nextjs/generate-static-params)
- [`revalidatePath`](/docs/nextjs/revalidate-path)
- [`revalidateTag`](/docs/nextjs/revalidate-tag)

## Examples

### Time-based revalidation (အချိန်အခြေပြု revalidation)

ဒါက /blog ပေါ်မှာ blog posts စာရင်းတစ်ခုကို fetch လုပ်ပြီး ပြသပါတယ်။ တစ်နာရီ ကုန်သွားတာနဲ့ နောက် visitor က မြန်ဆန်တဲ့ response ရဖို့ cache လုပ်ထားတဲ့ (stale) page ရဲ့ version ကို ချက်ချင်း ဆက်ရရှိပါသေးတယ်။ တစ်ချိန်တည်းမှာပဲ Next.js က နောက်ခံမှာ fresh version အသစ်တစ်ခုရဲ့ regeneration ကို စတင်ပါတယ်။ Version အသစ် အောင်မြင်စွာ generate ဖြစ်ပြီးတာနဲ့ — cache လုပ်ထားတဲ့ version နေရာကို အစားထိုးလိုက်ပြီး နောက် visitors တွေက update လုပ်ထားတဲ့ content ကို ရရှိပါတယ်။

```tsx filename="app/blog/page.tsx" switcher
interface Post {
  id: string
  title: string
  content: string
}

export const revalidate = 3600 // နာရီတိုင်း invalidate လုပ်ပါ

export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts: Post[] = await data.json()
  return (
    <main>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  )
}
```

```jsx filename="app/blog/page.js" switcher
export const revalidate = 3600 // နာရီတိုင်း invalidate လုပ်ပါ

export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <main>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  )
}
```

Revalidation အချိန်ကို မြင့်မြင့် သတ်မှတ်ဖို့ အကြံပြုပါတယ်။ ဥပမာ — စက္ကန့် 1 အစား 1 နာရီမျိုးပေါ့။ ပိုတိကျဖို့ လိုအပ်ရင် on-demand revalidation ကို သုံးစဉ်းစားပါ။ Real-time data လိုအပ်ရင် [dynamic rendering](https://nextjs.org/docs/app/glossary#dynamic-rendering) ဆီ ပြောင်းစဉ်းစားပါ။

### `revalidatePath` နဲ့ On-demand revalidation

ပိုတိကျတဲ့ revalidation နည်းလမ်းအတွက် — `revalidatePath` function နဲ့ cached pages တွေကို on-demand အနေနဲ့ invalidate လုပ်ပါ။

ဥပမာ — ဒီ Server Action ကို post အသစ်တစ်ခု ထည့်ပြီးတာနဲ့ ခေါ်ပါလိမ့်မယ်။ Server Component ထဲမှာ data တွေကို `fetch` သုံးပြီး ယူတာပဲဖြစ်ဖြစ်, database ကို ချိတ်ဆက်ပြီး ယူတာပဲဖြစ်ဖြစ် — ဒါက route တစ်ခုလုံးအတွက် cache ကို invalidate လုပ်ပါလိမ့်မယ်။ အဲဒီ route ဆီ နောက်ထပ် request တစ်ခု ရောက်လာရင် regeneration ကို စတင်ပြီး fresh data ကို ပေးဝေကာ — နောက်ထပ် requests တွေအတွက် cache လုပ်ပါလိမ့်မယ်။

> **မှတ်ချက်:** `revalidatePath` က cache entries တွေကို invalidate လုပ်ပေမယ့် — regeneration ကတော့ နောက် request တစ်ခုမှာ ဖြစ်ပါတယ်။ နောက် request ကို မစောင့်ဘဲ cache entry ကို ချက်ချင်း eagerly regenerate လုပ်ချင်ရင် — Pages Router ရဲ့ [`res.revalidate`](https://nextjs.org/docs/pages/guides/incremental-static-regeneration#on-demand-validation-with-resrevalidate) method ကို သုံးနိုင်ပါတယ်။ App Router အတွက် eager regeneration စွမ်းရည်တွေ ပေးနိုင်ဖို့ method အသစ်တွေ ထည့်ဖို့ ကျွန်တော်တို့ လုပ်ဆောင်နေပါတယ်။

```ts filename="app/actions.ts" switcher
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  // /posts route အတွက် cache ကို invalidate လုပ်ပါ
  revalidatePath('/posts')
}
```

```js filename="app/actions.js" switcher
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  // /posts route အတွက် cache ကို invalidate လုပ်ပါ
  revalidatePath('/posts')
}
```

[Demo ကို ကြည့်ပါ](https://on-demand-isr.vercel.app) ပြီးတော့ [source code ကို လေ့လာပါ](https://github.com/vercel/on-demand-isr)။

### `revalidateTag` နဲ့ On-demand revalidation

အသုံးပြုမှု အများစုအတွက် path တစ်ခုလုံးကို revalidate လုပ်တာကို ဦးစားပေးပါ။ ပိုပြီး granular (အကွက်စိတ်) ထိန်းချုပ်မှု လိုအပ်ရင်တော့ `revalidateTag` function ကို သုံးနိုင်ပါတယ်။ ဥပမာ — `fetch` call တစ်ခုချင်းစီကို tag လုပ်ထားနိုင်ပါတယ်:

```tsx filename="app/blog/page.tsx" switcher
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog', {
    next: { tags: ['posts'] },
  })
  const posts = await data.json()
  // ...
}
```

```jsx filename="app/blog/page.js" switcher
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog', {
    next: { tags: ['posts'] },
  })
  const posts = await data.json()
  // ...
}
```

ORM တစ်ခုကို သုံးနေတာ (သို့) database ကို ချိတ်ဆက်နေတယ်ဆိုရင် — `unstable_cache` ကို သုံးနိုင်ပါတယ်:

```tsx filename="app/blog/page.tsx" switcher
import { unstable_cache } from 'next/cache'
import { db, posts } from '@/lib/db'

const getCachedPosts = unstable_cache(
  async () => {
    return await db.select().from(posts)
  },
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)

export default async function Page() {
  const posts = getCachedPosts()
  // ...
}
```

```jsx filename="app/blog/page.js" switcher
import { unstable_cache } from 'next/cache'
import { db, posts } from '@/lib/db'

const getCachedPosts = unstable_cache(
  async () => {
    return await db.select().from(posts)
  },
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)

export default async function Page() {
  const posts = getCachedPosts()
  // ...
}
```

ပြီးရင် [Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data) (သို့) [Route Handler](/docs/nextjs/file-conventions-route) ထဲမှာ `revalidateTag` ကို သုံးနိုင်ပါတယ်:

```ts filename="app/actions.ts" switcher
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  // 'posts' နဲ့ tag လုပ်ထားတဲ့ data အားလုံးကို invalidate လုပ်ပါ
  revalidateTag('posts', 'max')
}
```

```js filename="app/actions.js" switcher
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  // 'posts' နဲ့ tag လုပ်ထားတဲ့ data အားလုံးကို invalidate လုပ်ပါ
  revalidateTag('posts', 'max')
}
```

### Error (ဖမ်းမရတဲ့ exceptions) တွေကို ကိုင်တွယ်ခြင်း

Data ကို revalidate လုပ်ဖို့ ကြိုးစားတုန်း error တစ်ခု ဖြစ်ခဲ့ရင် — နောက်ဆုံး အောင်မြင်စွာ generate လုပ်ထားတဲ့ data ကို cache ကနေ ဆက်ပြီး ပေးနေပါလိမ့်မယ်။ နောက်ထပ် request တစ်ခုမှာ Next.js က data ကို revalidate လုပ်ဖို့ ပြန်ကြိုးစားပါလိမ့်မယ်။ [Error handling အကြောင်း ပိုလေ့လာပါ](/docs/nextjs/error-handling)။

### Cache တည်နေရာကို စိတ်ကြိုက် ပြင်ဆင်ခြင်း (Customizing the cache location)

Cached pages နဲ့ data တွေကို durable storage ထဲမှာ သိမ်းထားချင်ရင် (သို့) သင့် Next.js application ရဲ့ containers/instances အများအပြားကြားမှာ cache ကို share လုပ်ချင်ရင် — Next.js ရဲ့ cache တည်နေရာကို configure လုပ်နိုင်ပါတယ်။ [ပိုလေ့လာပါ](/docs/nextjs/self-hosting)။

## Troubleshooting (ပြဿနာဖြေရှင်းခြင်း)

### Local development မှာ cached data တွေကို Debug လုပ်ခြင်း

`fetch` API ကို သုံးနေတယ်ဆိုရင် — ဘယ် requests တွေ cached (သို့) uncached ဖြစ်လဲ နားလည်ဖို့ logging ထပ်ထည့်နိုင်ပါတယ်။ [`logging` option အကြောင်း ပိုလေ့လာပါ](/docs/nextjs/next-config-logging)။

```jsx filename="next.config.js"
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

### Production အပြုအမူ မှန်ကန်ကြောင်း စစ်ဆေးခြင်း

Pages တွေကို production မှာ မှန်ကန်စွာ cached နဲ့ revalidated ဖြစ်နေလား စစ်ဆေးဖို့ — `next build` run လုပ်ပြီး production Next.js server ကို run ဖို့ `next start` ကို သုံးပြီး local မှာ စမ်းသပ်နိုင်ပါတယ်။

ဒါက production environment မှာ အလုပ်လုပ်သလို ISR အပြုအမူကို စမ်းသပ်နိုင်စေပါလိမ့်မယ်။ နောက်ထပ် debugging အတွက် သင့် `.env` file ထဲမှာ အောက်ပါ environment variable ကို ထည့်ပါ:

```bash filename=".env"
NEXT_PRIVATE_DEBUG_CACHE=1
```

ဒါက Next.js server ရဲ့ console မှာ ISR cache hits နဲ့ misses တွေကို log လုပ်ပေးပါလိမ့်မယ်။ `next build` ကာလအတွင်းမှာ ဘယ် pages တွေ generate ဖြစ်လဲ၊ paths တွေကို on-demand ဝင်ရောက်လာတာနဲ့ pages တွေ ဘယ်လို update ဖြစ်လဲဆိုတာကို output ကြည့်ပြီး စစ်ဆေးနိုင်ပါတယ်။

## Caveats (သတိပြုရမည့်အချက်များ)

- ISR က Node.js runtime (default) ကို သုံးတဲ့အခါမှာပဲ ထောက်ပံ့ပါတယ်။
- [Static Export](/docs/nextjs/static-exports) တစ်ခု ဖန်တီးတဲ့အခါ ISR ကို မထောက်ပံ့ပါဘူး။
- Prerendered route တစ်ခုထဲမှာ `fetch` requests အများအပြား ရှိပြီး တစ်ခုချင်းစီမှာ မတူညီတဲ့ `revalidate` ကြိမ်နှုန်း ရှိနေရင် — အနိမ့်ဆုံး အချိန်ကို ISR အတွက် သုံးပါလိမ့်မယ်။ ဒါပေမယ့် အဲဒီ revalidation ကြိမ်နှုန်းတွေကို [cache](/docs/nextjs/caching) ကတော့ ဆက်လက် လေးစားလိုက်နာပါသေးတယ်။
- Route တစ်ခုပေါ်မှာ သုံးထားတဲ့ `fetch` request တစ်ခုခုမှာ `revalidate` အချိန် `0` (သို့) ရှင်းရှင်းလင်းလင်း `no-store` ရှိနေရင် — route ကို dynamically render လုပ်ပါလိမ့်မယ်။
- On-demand ISR requests တွေအတွက် Proxy ကို run လုပ်ပေးမှာ မဟုတ်ပါဘူး — ဆိုလိုတာက Proxy ထဲက path rewrites (သို့) logic တွေ သက်ရောက်မှာ မဟုတ်ပါဘူး။ တိကျတဲ့ path ကိုပဲ revalidate လုပ်နေဖို့ သေချာပါစေ။ ဥပမာ — rewritten `/post-1` အစား `/post/1` ကိုပါ။
- Instances အများအပြားမှာ run လုပ်တဲ့အခါ — default file-system cache က instance တစ်ခုချင်းစီအတွက်ပါ။ On-demand revalidation က call ကို လက်ခံရရှိတဲ့ instance ပေါ်မှာပဲ invalidate လုပ်ပါတယ်။ Instances တွေကြားမှာ ညှိနှိုင်းဖို့ shared [custom cache handler](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath) တစ်ခုကို သုံးပါ။ Architecture အပြည့်အစုံအတွက် [Revalidation ဘယ်လို အလုပ်လုပ်လဲ](/docs/nextjs/how-revalidation-works) ကို ကြည့်ပါ။
- Background regeneration (stale-while-revalidate) က triggering request ကို လက်ခံရရှိတဲ့ instance ပေါ်မှာ run လုပ်ပါတယ်။ Per-request billing ရှိတဲ့ platforms တွေမှာ — ဒီ background အလုပ်က ထပ်ဆောင်း compute အဖြစ် ရေတွက်ပါတယ်။
- Cache အပြုအမူကို လေ့လာဖို့ `x-nextjs-cache` response header ကို သုံးနိုင်ပါတယ်။ Values တွေကတော့ `HIT` (cache ကနေ ပေးဝေသည်), `STALE` (cache ကနေ ပေးဝေပြီး နောက်ခံမှာ revalidate လုပ်နေသည်), `MISS` (cache ထဲမှာ မရှိ၊ fresh အနေနဲ့ render လုပ်သည်) (သို့) `REVALIDATED` (on-demand revalidation ကနေ ပြန်ထုတ်လုပ်သည်) တို့ ဖြစ်ပါတယ်။

## Platform Support (Platform အထောက်အပံ့)

| Deployment Option                                                | Supported (ထောက်ပံ့မှု) |
| ----------------------------------------------------------------- | ------------------------- |
| [Node.js server](/docs/nextjs/deploying)                          | ရပါတယ်                   |
| [Docker container](/docs/nextjs/deploying)                        | ရပါတယ်                   |
| [Static export](/docs/nextjs/deploying)                           | မရပါဘူး                  |
| [Adapters](/docs/nextjs/deploying)                                | Platform အလိုက် မူတည်သည် |

Next.js ကို self-host လုပ်တဲ့အခါ [ISR ကို ဘယ်လို configure လုပ်မလဲ](/docs/nextjs/self-hosting) ဆိုတာ လေ့လာပါ။

## Version History (ဗားရှင်း မှတ်တမ်း)

| Version   | Changes                                             |
| --------- | --------------------------------------------------- |
| `v14.1.0` | Custom `cacheHandler` က stable ဖြစ်လာပါတယ်။        |
| `v13.0.0` | App Router ကို မိတ်ဆက်လိုက်ပါတယ်။                   |
