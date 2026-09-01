---
title: "Caching"
description: "Cache Components နဲ့ caching အကြောင်း — use cache directive, cacheLife, data-level/UI-level caching, runtime APIs, prerendering (PPR), prefetching, ISR နဲ့ cache သိမ်းတဲ့နေရာတွေ"
order: 8
source: "https://nextjs.org/docs/app/getting-started/caching"
status: translated
updated: 2026-09-01
---

> ဒီ page က [Cache Components](/docs/nextjs/cache-components) နဲ့ caching အကြောင်းကို ဖော်ပြပါတယ် — `next.config.ts` file ထဲမှာ [`cacheComponents: true`](/docs/nextjs/cache-components) သတ်မှတ်ပြီး enable လုပ်ပါတယ်။ Cache Components မသုံးဘူးဆိုရင် [Caching and Revalidating (Previous Model)](/docs/nextjs/caching-without-cache-components) guide ကို ကြည့်ပါ။

**Caching** ဆိုတာ data fetching နဲ့ အခြား တွက်ချက်မှုတွေရဲ့ ရလဒ်တွေကို သိမ်းဆည်းထားပြီး — တူညီတဲ့ data အတွက် နောက်ထပ် request တွေကို အလုပ်ပြန်မလုပ်ဘဲ ပိုမြန်အောင် ဆောင်ရွက်ပေးတဲ့ နည်းပညာတစ်ခုပါ။

## Cache Components Enable လုပ်ခြင်း

Next config file ထဲမှာ [`cacheComponents`](/docs/nextjs/cache-components) option ထည့်ပြီး Cache Components ကို enable လုပ်နိုင်ပါတယ်:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

> **သိထားသင့်သည်** — Cache Components enable ဖြစ်နေတဲ့အခါ `GET` Route Handlers တွေက pages တွေနဲ့ တူညီတဲ့ prerendering model ကို လိုက်နာပါတယ်။ အသေးစိတ်ကို [Cache Components နဲ့ Route Handlers](/docs/nextjs/route-handlers#with-cache-components) မှာ ကြည့်ပါ။

## အသုံးပြုပုံ (Usage)

[`use cache`](/docs/nextjs/use-cache) directive က async functions နဲ့ components တွေရဲ့ return value တွေကို cache လုပ်ပါတယ်။ အဆင့် နှစ်မျိုးမှာ သုံးနိုင်ပါတယ်:

- **Data-level**: data fetch (သို့) တွက်ချက်မှု လုပ်တဲ့ function တစ်ခုကို cache လုပ်ခြင်း (ဥပမာ — `getProducts()`, `getUser(id)`)
- **UI-level**: component (သို့) page တစ်ခုလုံးကို cache လုပ်ခြင်း (ဥပမာ — `async function BlogPosts()`)

Cache directive တစ်ခုက ရလဒ်တစ်ခုကို lifetime (သက်တမ်း) ပေးပါတယ် — Next.js က rendering optimizations တွေ သုံးဖို့ အဲဒီအချက်ကို အသုံးပြုပါတယ်။ Cache လုပ်ထားတဲ့ ရလဒ်တွေက static shell ရဲ့ အစိတ်အပိုင်း ဘယ်လို ဖြစ်လာပြီး [prefetch](#prefetching) ထဲမှာ ဘယ်လို ပါဝင်နိုင်လဲဆိုတာကို [Prerendering](#prerendering) မှာ ကြည့်ပါ။

> **သိထားသင့်သည်** — Cache directive တိုင်းကို [`cacheLife`](/docs/nextjs/cacheLife) နဲ့ တွဲသုံးဖို့ အကြံပြုပါတယ်။ မသုံးရင် implicit `default` profile ကို သုံးပါလိမ့်မယ်။

Arguments တွေနဲ့ parent scopes တွေကနေ ဖမ်းယူလိုက်တဲ့ (captured) value တွေက [cache key](/docs/nextjs/use-cache#cache-keys) ရဲ့ အစိတ်အပိုင်း အလိုအလျောက် ဖြစ်သွားပါတယ် — ဆိုလိုတာက input မတူရင် cache entry သီးခြားစီ ဖြစ်ပါတယ်။ Entry တစ်ခုထဲမှာ ဘာတွေ ပါဝင်လဲဆိုတာကို [cache output](/docs/nextjs/use-cache#cache-output) မှာ၊ ဘာတွေကို cache လုပ်နိုင်လဲ၊ arguments တွေ ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ အသေးစိတ်ကို [serialization requirements and constraints](/docs/nextjs/use-cache#constraints) မှာ ကြည့်ပါ။

### Data-level caching

Data fetch လုပ်တဲ့ asynchronous function တစ်ခုကို cache လုပ်ဖို့ — function body ရဲ့ ထိပ်မှာ `use cache` directive ထည့်ပါ:

```tsx
import { cacheLife } from 'next/cache'

export async function getUsers() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM users')
}
```

Data-level caching က data တစ်ခုတည်းကို component အများအပြားမှာ သုံးတဲ့အခါ (သို့) data ကို UI နဲ့ သီးခြား cache လုပ်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

### UI-level caching

Component, page (သို့) layout တစ်ခုလုံးကို cache လုပ်ဖို့ — component (သို့) page body ရဲ့ ထိပ်မှာ `use cache` directive ထည့်ပါ:

```tsx
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')

  const users = await db.query('SELECT * FROM users')

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

> File တစ်ခုရဲ့ ထိပ်မှာ "`use cache`" ထည့်လိုက်ရင် — အဲဒီ file ထဲက exported functions တွေအားလုံးကို cache လုပ်ပါလိမ့်မယ်။

### Uncached data တွေကို streaming လုပ်ခြင်း

API, database (သို့) အခြား async operation လို asynchronous source ကနေ data ယူပြီး — request တိုင်းမှာ fresh data လိုအပ်တဲ့ components တွေအတွက်တော့ `"use cache"` ကို မသုံးပါနဲ့။

အဲဒီအစား component ကို [`<Suspense>`](https://react.dev/reference/react/Suspense) ထဲမှာ wrap ပြီး fallback UI တစ်ခု ပေးပါ။ Fallback က prerendered shell နဲ့အတူ ပါသွားပြီး — async အလုပ်က request time မှာ run လုပ်ပါတယ်။

```tsx
import { Suspense } from 'react'

async function LatestPosts() {
  const data = await fetch('https://api.example.com/posts')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

export default function Page() {
  return (
    <>
      <h1>My Blog</h1>
      <Suspense fallback={<p>Loading posts...</p>}>
        <LatestPosts />
      </Suspense>
    </>
  )
}
```

ဥပမာ — `<p>Loading posts...</p>` က static shell ထဲ ပါဝင်ပြီး posts တွေက request time မှာ stream လုပ်ဝင်ပါတယ်။

Uncached read တစ်ခုကို `<Suspense>` boundary မပါဘဲ သုံးရင် dev overlay က ဒီပြင်ဆင်နည်းနဲ့အတူ **blocking-route** insight ကို ပြပါတယ်:

> **Suspense ထဲမှာ wrap လုပ်ပါ (သို့) ရွှေ့ထည့်ပါ**
>
> ```tsx
> <Suspense fallback={…}>
>   <DataChild />
> </Suspense>
> ```
>
> Fix card တစ်ခုချင်းစီက patterns, code samples နဲ့ trade-offs ပါတဲ့ အသေးစိတ် walkthrough တွေဆီ ချိတ်ဆက်ပေးပါတယ်။ Card ကို နှိပ်ပြီး ကြည့်နိုင်ပါတယ်။

`<Suspense>` က async အလုပ် ပြီးချိန်အထိ fallback UI ပေးပေမယ့် — သူ့ဘာသာသူ component တစ်ခုကို dynamic rendering ထဲ မရွှေ့ပါဘူး။ Component တစ်ခုက synchronous အလုပ်ပဲ လုပ်ရင် — `<Suspense>` ထဲ wrap ထားသည် မထားသည် မဆို prerendering ကာလအတွင်းမှာ ပြီးသွားပါလိမ့်မယ်။

## Runtime APIs တွေနဲ့ အလုပ်လုပ်ခြင်း

Runtime APIs တွေက user တစ်ယောက် request လုပ်မှပဲ ရနိုင်တဲ့ အချက်အလက်တွေ လိုအပ်ပါတယ်။ ဥပမာတွေက:

- [`cookies`](/docs/nextjs/cookies) — User ရဲ့ cookie data
- [`headers`](/docs/nextjs/headers) — Request headers
- [`searchParams`](/docs/nextjs/page#searchparams-optional) — URL query parameters
- [`params`](/docs/nextjs/page#params-optional) — Dynamic route parameters — build time မှာ တိကျတဲ့ value တွေကို prerender လုပ်ဖို့ [`generateStaticParams`](/docs/nextjs/generate-static-params) ကို သုံးပါ၊ (သို့) မသိတဲ့ params တွေက နောက်ခံမှာ ဖြေရှင်းနေချိန်မှာ [App Shell](/docs/nextjs/glossary#app-shell) တစ်ခုကို ပေးဖို့ [Cache Components နဲ့ ISR](/docs/nextjs/incremental-static-regeneration-cache-components) ကို သုံးပါ။

Runtime APIs တွေကို ဝင်ရောက်သုံးတဲ့ components တွေကို `<Suspense>` ထဲမှာ wrap လုပ်သင့်ပါတယ်:

```tsx
import { cookies } from 'next/headers'
import { Suspense } from 'react'

async function UserGreeting() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value || 'light'
  return <p>Your theme: {theme}</p>
}

export default function Page() {
  return (
    <>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <UserGreeting />
      </Suspense>
    </>
  )
}
```

Runtime API ကို `<Suspense>` မပါဘဲ ဝင်ရောက်သုံးရင်လည်း dev overlay မှာ တူညီတဲ့ **blocking-route** insight နဲ့ ဒီအတိုင်း ပြင်ဆင်နည်း ပေါ်ပါတယ်:

> **Suspense ထဲမှာ wrap လုပ်ပါ (သို့) ရွှေ့ထည့်ပါ**
>
> ```tsx
> <Suspense fallback={…}>
>   <DataChild />
> </Suspense>
> ```

Runtime ပေါ်မှာ မှီခိုတဲ့ data ကိုလည်း Cache Components နဲ့အတူ ပါလာတဲ့ နောက်ထပ် variant တစ်ခုဖြစ်တဲ့ [`"use cache: private"`](/docs/nextjs/use-cache-private) နဲ့ cache lifetime ပေးနိုင်ပါတယ်။ ဒါက cookies, headers (သို့) `searchParams` တွေကို တိုက်ရိုက်ဖတ်တဲ့ function တစ်ခုကို lifetime ပေးပြီး — [prefetch](#prefetching) ထဲမှာ ပါဝင်နိုင်အောင် လုပ်ပေးပါတယ်။

နောက် section မှာ `use cache: private` ရဲ့ အခြားရွေးချယ်စရာတစ်ခုကို ပြပါမယ်: runtime value တစ်ခုကို ထုတ်ယူပြီး share လုပ်ထားတဲ့ cached function တစ်ခုဆီ argument အနေနဲ့ ပို့တာပါ။

### Runtime values တွေကို cached functions တွေဆီ ပို့ခြင်း

Runtime APIs တွေကနေ value တွေကို ထုတ်ယူပြီး cached functions တွေဆီ arguments အဖြစ် ပို့နိုင်ပါတယ်:

```tsx
import { cookies } from 'next/headers'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  )
}

// Component (cache မလုပ်ထား) က runtime data ကို ဖတ်တယ်
async function ProfileContent() {
  const session = (await cookies()).get('session')?.value
  return <CachedContent sessionId={session} />
}

// Cached component က ထုတ်ယူထားတဲ့ value ကို prop အဖြစ် လက်ခံတယ်
async function CachedContent({ sessionId }: { sessionId: string }) {
  'use cache'
  // sessionId က cache key ရဲ့ အစိတ်အပိုင်း ဖြစ်သွားတယ်
  const data = await fetchUserData(sessionId)
  return <div>{data}</div>
}
```

Request time မှာ — ကိုက်ညီတဲ့ cache entry မတွေ့ရင် `<CachedContent />` က run လုပ်ပြီး — တူညီတဲ့ `sessionId` နဲ့ လာမယ့် နောက်ထပ် requests တွေအတွက် ရလဒ်ကို သိမ်းထားပါတယ်။

> **သိထားသင့်သည်** — `<CachedContent />` က request data ရဲ့ နောက်မှာ ပိတ်ထားလို့ — prerendered static shell ထဲ မထည့်ပါဘူး။ Runtime မှာ default အနေနဲ့ [in-memory](/docs/nextjs/use-cache#runtime-caching-considerations) မှာ cache လုပ်ပြီး — serverless requests တွေကြားမှာ မတည်မြဲလို့ request တစ်ခုချင်းစီမှာ ပြန်အကဲဖြတ်ရနိုင်ပါတယ်။ Durable, shared caching အတွက် [`'use cache: remote'`](/docs/nextjs/use-cache-remote) ကို သုံးပါ။

ဒီပုံစံနဲ့ [prefetching](#prefetching) က client transition တစ်ခုအတွင်း user ရဲ့ တကယ့် session နဲ့ `<CachedContent />` ကို prerender လုပ်ပြီး — click မလုပ်ခင် ရလဒ်ကို အသင့်ဖြစ်အောင် လုပ်နိုင်ပါတယ်။ Server-side entries တွေက requests တွေကြားမှာ ခဲခဲယဉ်းယဉ်းပဲ ကျန်ရစ်တာတောင် အလုပ်လုပ်ပါတယ် — ဘာလို့လဲဆိုတော့ သင်သတ်မှတ်တဲ့ lifetime က ရလဒ်ကို prefetch ထဲ ပါဝင်စေပြီး — client က သူ့ရဲ့ [`cacheLife`](/docs/nextjs/cacheLife) `stale` window အတွင်းမှာ fresh အဖြစ် သတ်မှတ်ထားလို့ပါ။

## Static, cached နဲ့ streaming

ဒီမှာ page တစ်ခုတည်းပေါ်မှာ static content, cached dynamic content နဲ့ streaming dynamic content တွေ အတူတကွ အလုပ်လုပ်ပုံကို ပြထားတဲ့ ဥပမာ အပြည့်အစုံပါ:

```tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <>
      {/* Static content - prerender လုပ်ပြီးသား */}
      <header>
        <h1>Our Blog</h1>
        <nav>
          <Link href="/">Home</Link> | <Link href="/about">About</Link>
        </nav>
      </header>

      {/* Cached dynamic content - static shell ထဲ ပါဝင်တယ် */}
      <BlogPosts />

      {/* Runtime dynamic content - request time မှာ stream လုပ်တယ် */}
      <Suspense fallback={<p>Loading your preferences...</p>}>
        <UserPreferences />
      </Suspense>
    </>
  )
}

type Post = { id: string; title: string; author: string; date: string }

// လူတိုင်း တူညီတဲ့ blog posts တွေကို မြင်ရတယ် (နာရီတိုင်း revalidate လုပ်တယ်)
async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  cacheTag('posts')

  const res = await fetch('https://api.vercel.app/blog')
  const posts: Post[] = await res.json()

  return (
    <section>
      <h2>Latest Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>
              By {post.author} on {post.date}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Cookies ထဲမှာ သိမ်းထားတဲ့ value တစ်ခုပေါ် မှီခိုတဲ့ UI
async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  const favoriteCategory = (await cookies()).get('category')?.value

  return (
    <aside>
      <p>Your theme: {theme}</p>
      {favoriteCategory && <p>Favorite category: {favoriteCategory}</p>}
    </aside>
  )
}
```

Prerendering ကာလအတွင်း header (static) နဲ့ blog posts (cached — `use cache` နဲ့) တွေက static shell ရဲ့ အစိတ်အပိုင်း ဖြစ်သွားပြီး — user preferences အတွက် fallback UI လည်း ပါဝင်ပါတယ်။ Cookies ထဲမှာ သိမ်းထားတဲ့ preferences UI တွေကတော့ request time မှာ stream လုပ်ဝင်ပါတယ်။

ဒီမှာ `cookies()` ကို ဖတ်တာက အရင်က rendering model လိုမျိုး route တစ်ခုလုံးကို dynamic rendering ထဲ မရွှေ့ပါဘူး။ Suspense boundary က runtime access stream လုပ်တဲ့နေရာအတွက် fallback UI ပေးပြီး — static နဲ့ cached content တွေက ကနဦး HTML ထဲမှာပဲ ပါဝင်နေပါတယ်။

`<Suspense>` က async access တွေကို ထိန်းထားသလိုပဲ — **error boundary** က failure တွေကို ထိန်းထားပါတယ်: rendering ကာလအတွင်း error ဖြစ်နိုင်တဲ့ subtree တစ်ခုကို wrap လုပ်ပါ။ Component-level boundaries တွေအတွက် [`catchError`](/docs/nextjs/catchError) ကို သုံးပြီး — route-level boundaries တွေအတွက် [`error.js`](/docs/nextjs/error) file convention ကို သုံးပါ။

ဆောက်ရင်းနဲ့ သတိပြုရမှာက — [`generateMetadata`](/docs/nextjs/generate-metadata#with-cache-components) နဲ့ [`generateViewport`](/docs/nextjs/generate-viewport#with-cache-components) အတွင်းမှာ uncached fetches (သို့) runtime data access တွေက page ထဲမှာလိုပဲ insights နဲ့ errors တွေကို ပြတာမို့ — သင်ရည်ရွယ်ထားတဲ့ rendering ဆီ လမ်းညွှန်ပေးပါတယ်။ Params value သိထားတဲ့ နဲ့ မသိတဲ့ နှစ်မျိုးလုံးနဲ့ incremental static regeneration အတွက် — [Cache Components နဲ့ ISR](/docs/nextjs/incremental-static-regeneration-cache-components) ကို ကြည့်ပါ။

## Random values နဲ့ timestamps တွေ

`Math.random()`, `Date.now()` (သို့) `crypto.randomUUID()` လို operations တွေက သူတို့ run လုပ်တိုင်း မတူညီတဲ့ value တွေ ထုတ်ပေးပါတယ်။ Cache Components က ဒါတွေကို သင်က ရှင်းရှင်းလင်းလင်း ကိုင်တွယ်ဖို့ လိုအပ်ပါတယ်။

> **သိထားသင့်သည်** — `performance.now()` က telemetry အတွက် ရည်ရွယ်ထားလို့ Next.js က ဒါကို ကာကွယ်ရမယ့် value အဖြစ် မသတ်မှတ်ပါဘူး။ Timing အတွက် သုံးပြီး — ရလဒ်ကို render လုပ်မယ့်အစား သင့် logger (သို့) metrics ဆီ ပို့ပါ။

**Request တစ်ခုချင်းစီအတွက် ထူးခြားတဲ့ (unique) values တွေ ထုတ်လုပ်ဖို့** — ဒီ operations တွေ မလုပ်ခင် request time ဆီ ရွှေ့ဖို့ [`connection()`](/docs/nextjs/connection) ကို ခေါ်ပြီး component ကို `<Suspense>` ထဲမှာ wrap လုပ်ပါ:

```tsx
import { connection } from 'next/server'
import { Suspense } from 'react'

async function UniqueContent() {
  await connection()
  const uuid = crypto.randomUUID()
  return <p>Request ID: {uuid}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UniqueContent />
    </Suspense>
  )
}
```

တနည်းအားဖြင့် — **ရလဒ်ကို cache လုပ်နိုင်ပါတယ်** — ဒါဆိုရင် revalidation မဖြစ်ခင် user အားလုံး တူညီတဲ့ value ကို မြင်ရပါလိမ့်မယ်:

```tsx
export default async function Page() {
  'use cache'
  const buildId = crypto.randomUUID()
  return <p>Build ID: {buildId}</p>
}
```

ဘယ် operations တွေက ဒီလိုမျိုး ပြုမူတယ်ဆိုတာ အလွတ်ကျက်စရာ မလိုပါဘူး။ Dev overlay က call အလိုက် **blocking-prerender-random**, **blocking-prerender-current-time** (သို့) **blocking-prerender-crypto** insight တွေကို ဒီပြင်ဆင်နည်းတွေနဲ့ ပြပါတယ်:

> **Request တိုင်းမှာ ထုတ်လုပ်ပါ**
>
> ```tsx
> await connection()
> const id = Math.random()
> return <Item id={id} />
> ```

> **Value ကို cache လုပ်ပါ**
>
> ```tsx
> function RandomId() {
>   "use cache"
>   return String(Math.random())
> }
> ```

## ခန့်မှန်းလို့ရတဲ့ (Predictable) values တွေ

Renders တွေကြားမှာ ပြောင်းလဲနိုင်တဲ့ random values နဲ့ timestamps တွေနဲ့ မတူဘဲ — module imports, synchronous I/O နဲ့ pure computations တွေက run လုပ်တိုင်း တူညီတဲ့ ရလဒ်ကို ထုတ်ပေးပါတယ်။ ဒီ operations တွေပဲ သုံးတဲ့ Components တွေကို အလိုအလျောက် prerender လုပ်ပြီး — သူတို့ရဲ့ output က build time မှာ static HTML ရဲ့ အစိတ်အပိုင်း ဖြစ်သွားပါတယ်။

```tsx
import fs from 'node:fs'

export default async function Page() {
  const constants = await import('./constants.json')
  const content = fs.readFileSync('./config.json', 'utf-8')
  const items = JSON.parse(content).items ?? []

  return (
    <div>
      <h1>{constants.appName}</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  )
}
```

> **သိထားသင့်သည်** — ဒီထဲမှာ synchronous APIs တွေနဲ့ embedded databases တွေဆီက queries တွေ ပါဝင်ပါတယ် — ဥပမာ `better-sqlite3` (သို့) Node.js ရဲ့ built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html)။ Synchronous source တစ်ခုကနေ per-request data လိုအပ်ရင် — query မလုပ်ခင် [`connection()`](/docs/nextjs/connection) ကို ခေါ်ပါ။

Asynchronous APIs အချို့က incoming request ပေါ်မှာ မမှီခိုတဲ့ local resources တွေကို ဖတ်ပါတယ် — ဥပမာ fonts (သို့) configuration files တွေ။ အဲဒီ resources တွေက request တိုင်းအတွက် တူညီမယ်လို့ မျှော်လင့်ရရင် — rendering ကာလအတွင်း ဖတ်မယ့်အစား module scope မှာ တစ်ခါတည်း ဖတ်ထားပါ။

Data ကို rendering ကာလအတွင်းမှာ တွက်ချက်ပြီး requests တွေကြားမှာ ပြန်သုံးသင့်ရင်တော့ — read ကို [`use cache`](/docs/nextjs/use-cache) ထဲမှာ wrap လုပ်ပါ။ Data က incoming request ပေါ်မှာ မှီခိုတယ် (သို့) အချိန်နဲ့အမျှ ပြောင်းမယ်လို့ မျှော်လင့်ရရင် — request-time rendering ကာလအတွင်းမှာ ဖတ်ပါ။

```tsx
import { readFile } from 'node:fs/promises'

const content = await readFile('./config.json', 'utf-8')
const items = JSON.parse(content).items ?? []

export default function Page() {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.value}</li>
      ))}
    </ul>
  )
}
```

ဒီဥပမာမှာ configuration file က request တိုင်းအတွက် တူညီမယ်လို့ မျှော်လင့်ရလို့ — module scope မှာ တစ်ခါတည်း ဖတ်ထားပါတယ်။ Component ထဲမှာ `await readFile()` ခေါ်ရင် — uncached data အဖြစ် သတ်မှတ်ခံရပြီး `use cache` အတွင်း (သို့) `<Suspense>` boundary နောက်မှာ ဝင်ရောက်ရပါမယ်။ ဒီ file က request ပေါ်မှာ မမှီခိုဘဲ ပြောင်းလဲမယ်လို့လည်း မမျှော်လင့်ရတာမို့ — module scope က အရိုးရှင်းဆုံး ရွေးချယ်မှုပါ။

## Prerendering

Build time မှာ Next.js က သင့် route ရဲ့ component tree ကို render လုပ်ပါတယ်။ Component တစ်ခုချင်းစီကို ဘယ်လို ကိုင်တွယ်လဲဆိုတာက သူသုံးတဲ့ APIs တွေပေါ် မူတည်ပါတယ်:

- [`use cache`](#usage) — lifetime [သိပ်မတိုဘူးဆိုရင်](/docs/nextjs/cacheLife#prerendering-behavior) ရလဒ်ကို cache လုပ်ပြီး static shell ထဲ ထည့်ပါတယ်
- [`<Suspense>`](#streaming-uncached-data) — content က request time မှာ stream လုပ်နေချိန်မှာ fallback UI က static shell ထဲ ပါဝင်ပါတယ်
- [Predictable values](#predictable-values) — module imports, `fs.readFileSync` နဲ့ pure computations တွေက prerender ကာလအတွင်း ပြီးပြီး static shell ထဲ အလိုအလျောက် ပါဝင်ပါတယ်
- [Random values နဲ့ timestamps](#random-values-နဲ့-timestamps-တွေ) — request တစ်ခုချင်းစီအတွက် unique value ရဖို့ `connection()` + `<Suspense>` သုံးပါ၊ (သို့) user တွေကြားမှာ share လုပ်ဖို့ `use cache` သုံးပါ

ဒါက ကနဦး page loads တွေအတွက် HTML နဲ့ client-side navigation အတွက် serialized [RSC Payload](/docs/nextjs/server-client-components#on-the-server) တစ်ခုပါဝင်တဲ့ static shell တစ်ခုကို ထုတ်ပေးပါတယ် — user တွေ URL ကို တိုက်ရိုက်ဝင်သည်ဖြစ်စေ, တခြား page ကနေ transition လုပ်သည်ဖြစ်စေ browser က render လုပ်ပြီးသား content တွေကို ချက်ချင်း ရရှိစေပါတယ်။ ဒီ rendering နည်းလမ်းကို **Partial Prerendering (PPR)** လို့ ခေါ်ပြီး — Cache Components နဲ့ဆိုရင် default အပြုအမူ ဖြစ်ပါတယ်။

ထုတ်လုပ်လိုက်တဲ့ static shell တိုင်းကို upstream server ကို ဖြတ်စရာ မလိုဘဲ CDN ကနေ တိုက်ရိုက် ဆောင်ရွက်နိုင်ပါတယ်။ ဒါက တိုက်ရိုက် navigation တွေကို [ချက်ချင်း](#instant-navigation) ဖြစ်စေပါတယ်။

Route တစ်ခုရဲ့ static shell ထဲမှာ ဘာတွေ ပါဝင်လဲဆိုတာက build time မှာ သိရတဲ့အရာပေါ် မူတည်ပါတယ်။ Route တစ်ခုရဲ့ [dynamic params](/docs/nextjs/generate-static-params) တွေကို သိတဲ့အခါ — shell ထဲမှာ အဲဒီ concrete content ပါဝင်ပြီး ကျန်တဲ့ uncached (သို့) runtime data တွေက သူတို့ရဲ့ `<Suspense>` fallback နောက်မှာ ဆက်ပြီး stream လုပ်ပါတယ်။ Params တွေကို မသိတဲ့အခါ — ပြန်သုံးလို့ရတဲ့, URL-independent version က [**App Shell**](/docs/nextjs/glossary#app-shell) ပါ: param-specific အပိုင်းတွေက သူတို့ရဲ့ fallbacks နောက်မှာ ကျန်ရစ်ထားတဲ့ တူညီတဲ့ static shell ပဲ ဖြစ်ပါတယ်။ [Incremental Static Regeneration](#incremental-static-regeneration) က ပထမဆုံး visit အပြီးမှာ concrete versions တွေကို ဖြည့်ပေးပါတယ်။

Prerendering ကာလအတွင်းမှာ မပြီးနိုင်တဲ့ components တွေကို Next.js က ရှင်းရှင်းလင်းလင်း ကိုင်တွယ်ဖို့ လိုအပ်ပါတယ်။ Dev overlay နဲ့ dev server console မှာ route ကို အမည်ပေးပြီး ပြင်ဆင်နည်းတွေ ညွှန်တဲ့ validation insight တစ်ခု ပြပါတယ် (access ကို cache လုပ်ပါ, `<Suspense>` boundary ထဲ ရွှေ့ပါ, (သို့) route ကို opt out လုပ်ပါ)။ ဒီ validation က route တိုင်း static shell ထုတ်လုပ်နိုင်အောင် ထိန်းထားလို့ — တိုက်ရိုက် navigation တွေ ချက်ချင်း ဖြစ်နေပါတယ်။

> **🎥 ကြည့်ရှုရန်** — Partial Prerendering က ဘာကြောင့်လဲ၊ ဘယ်လို အလုပ်လုပ်သလဲ → [YouTube (10 မိနစ်)](https://www.youtube.com/watch?v=MTcPrTIBkpA)

### Static shell ကို အများဆုံး ဖြစ်အောင်

သင့် async အလုပ်က tree ထဲမှာ ပိုနက်လေလေ — page ရဲ့ ပိုများတဲ့ အစိတ်အပိုင်းကို prerender လုပ်နိုင်လေလေပါပဲ။ ဒါက Cache Components က အားပေးတဲ့ structural pattern ပါ — နေရာတိုင်းမှာ သုံးသင့်တဲ့ ယေဘုယျ အလေ့အကျင့်တစ်ခုဖြစ်ပြီး နောက်က လာမယ့် instant navigation နဲ့ prefetching တွေရဲ့ အခြေခံလည်း ဖြစ်ပါတယ်။ [runtime APIs](#working-with-runtime-apis) တွေနဲ့ data fetches လို async operations တွေအားလုံးကို သက်ရောက်ပါတယ်။

ထိပ်ဆုံးမှာ `params` ကို destructure လုပ်တဲ့ layout တစ်ခုကို စဉ်းစားကြည့်ပါ:

```tsx
export default async function Layout({
  children,
  params,
}: LayoutProps<'/shop/[slug]'>) {
  const { slug } = await params

  return (
    <div>
      <Sidebar />
      <h1>{slug}</h1>
      {children}
    </div>
  )
}
```

ဒီ param က dynamic ဖြစ်ရင် ([`generateStaticParams`](/docs/nextjs/generate-static-params) က မပေးထားရင်) — သူက runtime data ဖြစ်လို့ layout ကို prerender လုပ်လို့ မရပါဘူး။

ဒါပေမယ့် param value ကို tree ရဲ့ ပိုနက်တဲ့နေရာမှာ ဖတ်ဖို့ မကြာခဏ ဖြစ်နိုင်ပါတယ်။ Layout level မှာ await လုပ်မယ့်အစား — params promise ကို အောက်ကို ပို့ပြီး အဲဒီမှာ await လုပ်ပါ:

```tsx
import { Suspense } from 'react'

// async မဟုတ်ပါ: ဒီ layout က params ကို ဘယ်တော့မှ await မလုပ်ပါဘူး
export default function Layout({
  children,
  params,
}: LayoutProps<'/shop/[slug]'>) {
  return (
    <div>
      <Sidebar />
      <Suspense fallback={<h1>Loading...</h1>}>
        {/* await က boundary အတွင်းမှာ ဖြစ်လို့ shell က ဆက်ပြီး render လုပ်နေတယ် */}
        {params.then(({ slug }) => (
          <SlugHeading slug={slug} />
        ))}
      </Suspense>
      {children}
    </div>
  )
}

function SlugHeading({ slug }: { slug: string }) {
  return <h1>{slug}</h1>
}
```

အခုဆိုရင် `<Sidebar />`, `{children}` နဲ့ Suspense fallback တွေအားလုံး static shell ရဲ့ အစိတ်အပိုင်း ဖြစ်သွားပါပြီ။ `SlugHeading` ပဲ request time မှာ stream လုပ်ဝင်ပါတယ်။ `params` promise တစ်ခုလုံးကိုလည်း ပို့ပြီး child component ထဲမှာ await လုပ်လို့ရပါတယ်။

ဒီနိယာမက `cookies()`, `headers()`, `searchParams` နဲ့ data fetches တွေကိုလည်း သက်ရောက်ပါတယ်။ ဆက်စပ်တဲ့ ပုံစံတစ်ခုအတွက် [React.cache နဲ့ data ပြန်သုံးခြင်း](/docs/nextjs/data-fetching) ကို ကြည့်ပါ။

### Instant navigation

Cache Components က 16.0.0 မှာ ပါလာပြီး — route တစ်ခုကို တိုက်ရိုက် visit လုပ်ရင် static shell ထုတ်ပေးတယ်ဆိုတာ verification ပါပါတယ်။ Client navigations တွေကတော့ မတူပါဘူး: တိုက်ရိုက် visit တစ်ခုကို ဖုံးအုပ်ထားတဲ့ `<Suspense>` boundary တစ်ခုက transition တစ်ခုအတွင်း render ရဲ့ အစိတ်အပိုင်း မဖြစ်နိုင်ပါဘူး။ Framework က ဝင်ကူတဲ့အခါ အဲဒီ structure မှန်အောင် လုပ်ရတာ ပိုလွယ်ပါတယ်။ Cache Components က ဒီ navigations တွေကိုလည်း အခု validate လုပ်ပြီး — သင့် route ဆီ navigation တွေကို instant ဖြစ်အောင် လုပ်ဖို့ လမ်းညွှန်ပေးတဲ့ insights နဲ့ errors တွေ ပေးပါတယ်။ ဥပမာ — data ကို `<Suspense>` ထဲမှာ wrap လုပ်ပါ၊ `use cache` နဲ့ cache လုပ်ပါ၊ (သို့) access ဖြစ်တဲ့နေရာကို ရွှေ့ပါ။

ဥပမာတွေနဲ့ စစ်ဆေးရေး tools တွေအတွက် [Instant navigation guide](/docs/nextjs/instant-navigation) ကို ဖတ်ပါ။

### Prefetching

[Partial Prefetching](/docs/nextjs/partialPrefetching) enable လုပ်ထားရင် — router က route တစ်ခုချင်းစီရဲ့ [App Shell](/docs/nextjs/glossary#app-shell) ကို default အနေနဲ့ prefetch လုပ်ပါတယ်။ App Shell ထဲမှာ static content တွေနဲ့ `cookies()` နဲ့ `headers()` တွေကနေ ဆင်းသက်လာတဲ့ session data တွေ ပါဝင်ပါတယ်။ Link တစ်ခုရဲ့ **URL data** — `searchParams` (သို့) dynamic `params` လိုမျိုး — ပေါ်မှာ မှီခိုတဲ့ cached content တွေကိုပါ prefetch လုပ်ချင်ရင် အဲဒီ link ပေါ်မှာ `prefetch={true}` သတ်မှတ်ပါ။

[`<Link prefetch={true}>`](/docs/nextjs/link#prefetch) က [Partial Prefetching](/docs/nextjs/partialPrefetching) route တစ်ခုကို ညွှန်နေရင် — Next.js က prefetch time မှာ အဲဒီ route ရဲ့ component tree ကို ဒီတစ်ခါ destination URL ဖြေရှင်းပြီးသားနဲ့ ပြန် render လုပ်ပါတယ်။ တူညီတဲ့ rules တွေ သက်ရောက်ပေမယ့် — ဒီတစ်ခါ `searchParams` နဲ့ `params` တွေ scope ထဲ ရောက်နေလို့ tree ရဲ့ ပိုများတဲ့ အစိတ်အပိုင်း ဖြေရှင်းနိုင်ပါတယ်:

- Runtime APIs တွေကနေ ထုတ်ယူထားတဲ့ values တွေနဲ့ (arguments အဖြစ်) ခေါ်ထားတဲ့ [`use cache`](#usage) တွေက per-link prefetch ထဲ ပါဝင်ပါတယ်
- [`use cache: private`](/docs/nextjs/use-cache-private) က server ပေါ်မှာ run လုပ်ပြီး runtime data တွေကို တိုက်ရိုက် ဖတ်ကာ — ရလဒ်ကို per-link prefetch ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ browser ထဲမှာ cache လုပ်ပါတယ်
- [`<Suspense>`](#streaming-uncached-data) fallbacks တွေက prefetched UI ထဲမှာ ရှိနေပြီး — uncached content တွေက request time မှာ stream လုပ်ပါတယ်

ဒီ per-link prefetch မှာ destination URL သိပြီးမှ ဖြေရှင်းနိုင်တဲ့ cached content တွေ ပါဝင်ပါတယ်။ Prefetchable link တစ်ခုချင်းစီအတွက် server invocation တစ်ခု ကုန်ကျပါတယ်။

ဥပမာ — URL ကနေ `searchParams` ဖတ်တဲ့ search page တစ်ခုကို ကြည့်ပါ:

```tsx
import { Suspense } from 'react'

export default function SearchPage(props: PageProps<'/search'>) {
  return (
    <Suspense fallback={<p>Loading results...</p>}>
      <Results searchParams={props.searchParams} />
    </Suspense>
  )
}

async function Results({
  searchParams,
}: Pick<PageProps<'/search'>, 'searchParams'>) {
  const { q } = await searchParams
  const results = await search(q)
  return (
    <ul>
      {results.map((result) => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  )
}

async function search(query: string | string[] | undefined) {
  'use cache'
  return db.search(query)
}
```

တိုက်ရိုက် visit တစ်ခုမှာ `<Results>` က fallback ရဲ့ နောက်မှာ stream လုပ်ဝင်ပါတယ်။

`/search?q=shoes` ဆီ [`<Link>`](/docs/nextjs/link) တစ်ခုကို prefetch လုပ်တဲ့အခါ — framework က link ရဲ့ URL ကနေ `searchParams` ကို ဖြေရှင်းလို့ cached `search` ရလဒ်က click မလုပ်ခင် runtime prerender ထဲ ပါဝင်သွားပါတယ်။ Browser က အဲဒါကို သူ့ရဲ့ [`stale`](/docs/nextjs/cacheLife#stale) အချိန် ကုန်တဲ့အထိ (သို့) `searchParams` တွေ ပြောင်းသွားတဲ့အထိ ပြန်သုံးပါတယ်။

[Adopting Partial Prefetching](/docs/nextjs/adopting-partial-prefetching) မှာ `<Link>` prefetching က ဘယ်လို ပြုမူလဲ၊ ဘယ်လို adopt လုပ်ရမလဲဆိုတာ နားလည်နိုင်ပါတယ်။

ပုံစံ အပြည့်အစုံအတွက် [Optimizing prefetching guide](/docs/nextjs/optimizing-prefetching) ကို ကြည့်ပြီး — mode အားလုံးအတွက် [`prefetch` reference](/docs/nextjs/route-segment-config#prefetch) ကို ကြည့်ပါ။

## Cache လုပ်ထားတဲ့ content တွေကို ဘယ်မှာ သိမ်းလဲ

Cached function တစ်ခုရဲ့ output ကို **RSC payload** အဖြစ် build time (သို့) runtime မှာ serialized လုပ်ပါတယ်။ တခြားအရာအားလုံး ဒီ payload ကနေ အလုပ်လုပ်ပါတယ်။ Next.js က ဒါကို HTML အဖြစ် render လုပ်ပြီး — server (သို့) remote store ထဲမှာ ထားပါတယ်၊ (သို့) browser ဆီ ပို့ပါတယ် — [`cacheLife`](/docs/nextjs/cacheLife) က copy တစ်ခုချင်းစီ fresh ဖြစ်နေတဲ့ ကြာချိန်ကို သတ်မှတ်ပါတယ်:

- **Prerendered HTML** — Payload ကို HTML အဖြစ် render လုပ်ပြီး self-hosting လုပ်ရင် disk ပေါ်မှာ၊ (သို့) သင့် platform ရဲ့ CDN နောက်က durable storage ထဲမှာ သိမ်းပါတယ်။ အဲဒီ HTML က build time မှာ [static shell](#prerendering) ဖြစ်ပြီး [ISR](#incremental-static-regeneration) upgrade လုပ်ပြီးနောက် concrete page ဖြစ်ပါတယ် — [`revalidate`](/docs/nextjs/cacheLife#revalidate) နဲ့ [`expire`](/docs/nextjs/cacheLife#expire) တွေက ဘယ်အချိန်မှာ ပြန်ဆောက်မလဲ ထိန်းချုပ်ပါတယ်။
- **Shared store** — Default အနေနဲ့ ရလဒ်က per-instance, in-memory store ထဲမှာ ကျန်နေပြီး serverless ပေါ်မှာတော့ ephemeral ဖြစ်ပါတယ်။ [`use cache: remote`](/docs/nextjs/use-cache-remote) က ဒါကို instances တွေကြားမှာ share လုပ်ထားတဲ့ durable [cache handler](/docs/nextjs/cacheHandlers) တစ်ခုဆီ ရွှေ့ပါတယ် — network roundtrip တစ်ခု ကုန်ကျပြီး **hit rate မြင့်မှသာ** အကျိုးရှိပါတယ်။
- **Browser** — Payload က client navigation (သို့) [prefetch](#prefetching) တစ်ခုအတွက် ပို့တဲ့ RSC ထဲ ပါဝင်ပြီး — browser က သူ့ရဲ့ [`stale`](/docs/nextjs/cacheLife#stale) window အတွင်း fresh ထားပါတယ်။ [`use cache: private`](/docs/nextjs/use-cache-private) ရလဒ်တွေက ဒီနေရာမှာပဲ ရှိပါတယ်။

> **သိထားသင့်သည်** — `cookies()` (သို့) `headers()` တွေကို ဖတ်တဲ့ [App Shell](/docs/nextjs/glossary#app-shell) တစ်ခုက session-specific ဖြစ်ပြီး — shared server cache ထဲမှာ မဟုတ်ဘဲ client ပေါ်မှာ session တစ်ခုချင်းစီအလိုက် cache လုပ်ပါတယ်။

ဒီ stores တွေအားလုံးက deployment တစ်ခုတည်းကိုပဲ scope လုပ်ထားပါတယ်။ Deploy အသစ်တစ်ခုက fresh စပြီး — prerenders အသစ်တွေ ဆောက်ပါတယ် — `use cache` entries တွေက durable [`remote`](/docs/nextjs/use-cache-remote) တွေတောင် ဆက်မပါပါဘူး — ဘာလို့လဲဆိုတော့ [cache key](/docs/nextjs/use-cache#cache-keys) ထဲမှာ build id ပါဝင်လို့ပါ။ Environment တစ်ခုချင်းစီရဲ့ အပြုအမူအတွက် [Runtime caching considerations](/docs/nextjs/use-cache#runtime-caching-considerations) ကို ကြည့်ပြီး — server cache ကို configure လုပ်ဖို့ [Self-hosting](/docs/nextjs/self-hosting#caching-and-isr) ကို ကြည့်ပါ။

## Incremental Static Regeneration

Dynamic param segments တွေပါတဲ့ route တစ်ခုမှာ — [`generateStaticParams`](/docs/nextjs/generate-static-params) က build time မှာ သင်စာရင်းပြုစုထားတဲ့ URLs တွေကို prerender လုပ်ပါတယ်။ တခြား URL တိုင်းကို [App Shell](/docs/nextjs/glossary#app-shell) အနေနဲ့ ချက်ချင်း ပေးပြီး — အဲဒီနောက် အခု သိပြီဖြစ်တဲ့ params တွေနဲ့ နောက်ခံမှာ upgrade လုပ်ကာ နောက် visitor အတွက် cache လုပ်ပါတယ်။

Walkthrough အပြည့်အစုံအတွက် [Cache Components နဲ့ ISR](/docs/nextjs/incremental-static-regeneration-cache-components) ကို ကြည့်ပါ။

## Bots နဲ့ crawlers တွေ

Browsers တွေက static shell ကို ချက်ချင်း ရရှိပါတယ်။ Bots နဲ့ crawlers တွေကိုတော့ သူတို့ရဲ့ user agent နဲ့ ခွဲခြားပြီး မတူညီစွာ ကိုင်တွယ်ပါတယ်: သူတို့က document အပြည့်အစုံ လိုအပ်လို့ — Next.js က shell ကို ကျော်ပြီး page တစ်ခုလုံးကို request time မှာ dynamic အနေနဲ့ render လုပ်ကာ render ပြီးတာနဲ့ finished HTML ကို ပို့ပေးပါတယ်။

Shell ကို ပြန်သုံးမယ့်အစား ပြန် render လုပ်လို့ — prerendering ကာလအတွင်း ပြီးခဲ့တဲ့ အလုပ်တွေက bot တစ်ခုအတွက်တော့ request time မှာ run လုပ်ပါတယ်။ သင့် shell ရဲ့ အစိတ်အပိုင်းတစ်ခုက prerendering ကာလအတွင်းမှာပဲ ရှိတဲ့ inputs တွေပေါ် မှီခိုနေရင် — build-time data (သို့) request-time environment မှာ မရနိုင်တဲ့ values တွေလိုမျိုး — လူတစ်ယောက်အတွက် load ဖြစ်တဲ့ page တစ်ခုက crawler တစ်ခုအတွက်တော့ render မဖြစ်နိုင်ပါဘူး။ သင့် shell မှီခိုနေတဲ့ data က request time မှာလည်း ရနိုင်အောင် သေချာလုပ်ပါ။ အသေးစိတ်အတွက် Streaming guide ထဲက [Bots and crawlers](/docs/nextjs/streaming#bots-and-crawlers) ကို ကြည့်ပါ။
