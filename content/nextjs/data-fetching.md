---
title: "Data Fetching (ဒေတာ ရယူခြင်း)"
description: "Server Components (fetch API, ORM/database) နဲ့ Client Components (`use` API, SWR/React Query) တွေထဲမှာ data တွေကို ဘယ်လို fetch လုပ်မလဲ — loading.js နဲ့ `<Suspense>` သုံးပြီး streaming လုပ်ခြင်း၊ sequential/parallel data fetching နဲ့ React.cache ဖြင့် data ပြန်သုံးခြင်း အပါအဝင်။"
order: 5
source: "https://nextjs.org/docs/app/getting-started/fetching-data"
status: translated
updated: 2026-09-05
---

ဒီ page မှာ [Server](#server-components) နဲ့ [Client](#client-components) Components တွေထဲမှာ data တွေကို ဘယ်လို fetch လုပ်မလဲ၊ ပြီးတော့ uncached data တွေပေါ် မှီခိုနေတဲ့ components တွေကို ဘယ်လို [stream](#streaming) လုပ်မလဲ ဆိုတာတွေကို အဆင့်ဆင့် ရှင်းပြသွားမှာ ဖြစ်ပါတယ်။

## Data တွေကို Fetch လုပ်ခြင်း

### Server Components

Server Components တွေထဲမှာ ဘယ် asynchronous I/O ကိုမဆို သုံးပြီး data fetch လုပ်နိုင်ပါတယ် — ဥပမာ:

1. [`fetch` API](#with-the-fetch-api)
2. [ORM (သို့) database](#with-an-orm-or-database)

#### `fetch` API သုံးပြီး Data Fetch လုပ်ခြင်း

`fetch` API နဲ့ data fetch လုပ်ဖို့ — component ကို asynchronous function အဖြစ် ပြောင်းပြီး `fetch` call ကို `await` လုပ်ပါ။ ဥပမာ:

```tsx filename="app/blog/page.tsx" switcher
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/blog/page.js" switcher
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

> **သိထားသင့်သည်:**
>
> - React component tree ထဲမှာ တူညီတဲ့ `fetch` requests တွေကို default အနေနဲ့ [memoize (မှတ်သား ပြန်သုံး) လုပ်](https://nextjs.org/docs/app/glossary#memoization)ပေးပါတယ် — ဒါကြောင့် props တွေကို အဆင့်ဆင့် ထပ်ဆင့် ပို့နေစရာ (prop drilling) မလိုဘဲ data လိုအပ်တဲ့ component ထဲမှာကိုပဲ fetch လုပ်လို့ ရပါတယ်။
> - `fetch` requests တွေကို default အနေနဲ့ cache မလုပ်ဘဲ — request ပြီးမြောက်သည်အထိ page ကို render မလုပ်နိုင်အောင် ပိတ်ဆို့ (block) ထားပါတယ်။ ရလဒ်တွေကို cache လုပ်ချင်ရင် [`use cache`](/docs/nextjs/use-cache) directive ကို သုံးပါ၊ (သို့) request time မှာ fresh data တွေ stream လုပ်ဖို့ data fetch လုပ်တဲ့ component ကို [`<Suspense>`](/docs/nextjs/caching#streaming-uncached-data) ထဲမှာ wrap လုပ်ပါ။ အသေးစိတ်အတွက် [caching](/docs/nextjs/caching) ကို ကြည့်ပါ။
> - Development ကာလအတွင်း ပိုကောင်းတဲ့ မြင်နိုင်စွမ်းနဲ့ debugging အတွက် `fetch` calls တွေကို log လုပ်နိုင်ပါတယ်။ [`logging` API reference](/docs/nextjs/next-config-logging) ကို ကြည့်ပါ။

#### ORM (သို့) Database သုံးပြီး Data Fetch လုပ်ခြင်း

Server Components တွေကို server ပေါ်မှာ render လုပ်တာဖြစ်လို့ — credentials (ဝင်ရောက်ခွင့် အထောက်အထားများ) နဲ့ query logic တွေက client bundle ထဲမှာ မပါဝင်ပါဘူး။ ဒါကြောင့် ORM (သို့) database client သုံးပြီး database queries တွေကို လုံခြုံစွာ လုပ်ဆောင်နိုင်ပါတယ်။

```tsx filename="app/blog/page.tsx" switcher
import { db, posts } from '@/lib/db'

export default async function Page() {
  const allPosts = await db.select().from(posts)
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/blog/page.js" switcher
import { db, posts } from '@/lib/db'

export default async function Page() {
  const allPosts = await db.select().from(posts)
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

ဒါပေမယ့် requests တွေကို မှန်ကန်စွာ authenticated (ခွင့်ပြုချက် စစ်ဆေးခြင်း) နဲ့ authorized (ခွင့်ပြုခြင်း) လုပ်ထားဖို့တော့ သေချာ လုပ်သင့်ပါတယ်။ Server ဘက်က data သုံးခွင့် လုံခြုံရေးအတွက် အကောင်းဆုံး နည်းလမ်းတွေကို [data security guide](/docs/nextjs/data-security) မှာ ကြည့်ပါ။

### Streaming

Server Components တွေထဲမှာ data fetch လုပ်တဲ့အခါ — request တစ်ခုစီအတွက် data တွေကို server ပေါ်မှာ fetch ပြီး render လုပ်ပါတယ်။ နှေးကွေးတဲ့ data requests တွေ ရှိနေရင် — data အားလုံး fetch ပြီးမြောက်သည်အထိ route တစ်ခုလုံးက render လုပ်ဖို့ ပိတ်ဆို့ခံနေရပါတယ်။

ကနဦး load time နဲ့ user experience ကို ပိုကောင်းအောင် — page ကို _chunks_ (အပိုင်းငယ်များ) အဖြစ် ခွဲပြီး server ကနေ client ဆီ အဲဒီ chunks တွေကို တစ်ဆင့်ချင်း (progressively) ပို့ပေးနိုင်ပါတယ်။ ဒါကို **streaming** လို့ ခေါ်ပါတယ်။ Streaming က ဘယ်လို အလုပ်လုပ်လဲ — HTTP contract, infrastructure ထည့်သွင်းစဉ်းစားစရာတွေ၊ performance trade-offs တွေ အပါအဝင် — အသေးစိတ်ကို [Streaming guide](/docs/nextjs/streaming) မှာ ကြည့်ပါ။

သင့် application ထဲမှာ streaming ကို နည်း နှစ်မျိုး သုံးနိုင်ပါတယ်:

1. Page တစ်ခုကို [`loading.js` file](#with-loadingjs) နဲ့ wrap လုပ်ခြင်း
2. Component တစ်ခုကို [`<Suspense>`](#with-suspense) နဲ့ wrap လုပ်ခြင်း

> **သိထားသင့်သည်:** Bots နဲ့ crawlers တွေကို browsers တွေနဲ့ မတူဘဲ သီးခြား ပေးပို့ပါတယ်။ Next.js က data fetching ပြီးမြောက်တာကို စောင့်ပြီး — progressively stream လုပ်မယ့်အစား render လုပ်ပြီးသား page အပြည့်အစုံကို ပို့ပေးပါတယ်။ [Bots နဲ့ crawlers](/docs/nextjs/streaming#bots-and-crawlers) ကို ကြည့်ပါ။

#### `loading.js` ဖြင့် Streaming လုပ်ခြင်း

Data fetch လုပ်နေချိန်မှာ **page တစ်ခုလုံး** ကို stream လုပ်ဖို့ — page ရှိတဲ့ folder ထဲမှာကိုပဲ `loading.js` file တစ်ခု ဖန်တီးနိုင်ပါတယ်။ ဥပမာ — `app/blog/page.js` ကို stream လုပ်ချင်ရင် `app/blog` folder ထဲမှာ အဲဒီ file ကို ထည့်ပါ။

```tsx filename="app/blog/loading.tsx" switcher
export default function Loading() {
  // Define the Loading UI here
  return <div>Loading...</div>
}
```

```jsx filename="app/blog/loading.js" switcher
export default function Loading() {
  // Define the Loading UI here
  return <div>Loading...</div>
}
```

Navigation လုပ်လိုက်တဲ့အခါ — page render လုပ်နေချိန်မှာ user က layout နဲ့ [loading state](#creating-meaningful-loading-states) တစ်ခုကို ချက်ချင်း မြင်ရပါတယ်။ Render ပြီးစီးတာနဲ့ content အသစ်ကို အလိုအလျောက် အစားထိုး ပြသပေးပါတယ်။

နောက်ကွယ်မှာတော့ — `loading.js` ကို [`layout.js` ရဲ့ အတွင်းမှာ nested (အသိုက်အမြှုံး) ထားရှိ](/docs/nextjs/project-structure#component-hierarchy)ပြီး — `page.js` file နဲ့ ၎င်းအောက်က children တွေအားလုံးကို `<Suspense>` boundary တစ်ခုထဲမှာ အလိုအလျောက် wrap လုပ်ပေးပါတယ်။

ဒါကြောင့် — uncached (သို့) runtime data တွေကို သုံးနေတဲ့ layout တစ်ခု (ဥပမာ — `cookies()`, `headers()`, (သို့) uncached fetches) က တူညီတဲ့ route segment ရဲ့ `loading.js` ကို fallback အဖြစ် မသုံးပါဘူး။ အဲဒီအစား — layout render ပြီးမြောက်သည်အထိ navigation ကို ပိတ်ဆို့ထားပါတယ်။ [Cache Components](/docs/nextjs/caching) က build-time error တစ်ခုနဲ့ လမ်းညွှန်ပေးပြီး ဒီပြဿနာကို ကာကွယ်ပေးပါတယ်။

ဒါကို ပြင်ဆင်ဖို့ — uncached access ကို fallback ပါတဲ့ ကိုယ်ပိုင် [`<Suspense>`](#with-suspense) boundary တစ်ခုထဲမှာ wrap လုပ်ပါ၊ (သို့) `loading.js` က ကာမိနိုင်တဲ့ `page.js` ထဲကို data fetching ကို ရွှေ့ပါ။ အသေးစိတ်အတွက် [`loading.js`](/docs/nextjs/file-conventions-loading) ကို ကြည့်ပါ။

ဒါကြောင့်ပဲ — `loading.js` က route segments တွေကို streaming လုပ်ဖို့ ကောင်းကောင်း အလုပ်လုပ်ပေးနိုင်ပေမယ့် — runtime (သို့) uncached data access တွေနဲ့ နီးကပ်တဲ့နေရာမှာ `<Suspense>` ကို သုံးဖို့ အကြံပြုထားပါတယ်။

#### `<Suspense>` ဖြင့် Streaming လုပ်ခြင်း

`<Suspense>` က page ရဲ့ ဘယ်အပိုင်းတွေကို stream လုပ်မလဲ ဆိုတာကို ပိုပြီး အတိအကျ (granular) ထိန်းချုပ်ခွင့် ပေးပါတယ်။ ဥပမာ — `<Suspense>` boundary အပြင်ဘက်က page content တွေကို ချက်ချင်း ပြသနိုင်ပြီး — boundary အတွင်းက blog posts စာရင်းကိုတော့ stream လုပ်ပြသနိုင်ပါတယ်။

```tsx filename="app/blog/page.tsx" switcher
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'

export default function BlogPage() {
  return (
    <div>
      {/* This content will be sent to the client immediately */}
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        {/* If there's any dynamic content inside this boundary, it will be streamed in */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

```jsx filename="app/blog/page.js" switcher
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'

export default function BlogPage() {
  return (
    <div>
      {/* This content will be sent to the client immediately */}
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        {/* If there's any dynamic content inside this boundary, it will be streamed in */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

#### အဓိပ္ပာယ်ရှိသော Loading States ဖန်တီးခြင်း

Instant loading state ဆိုတာ — navigation အပြီး user ကို ချက်ချင်း ပြသပေးတဲ့ fallback UI ပါ။ အကောင်းဆုံး user experience အတွက် — app က တုံ့ပြန်နေပြီ ဆိုတာ user တွေ နားလည်စေမယ့်၊ အဓိပ္ပာယ်ရှိတဲ့ loading states တွေကို ဒီဇိုင်း လုပ်ဖို့ အကြံပြုပါတယ်။ ဥပမာ — skeletons နဲ့ spinners တွေ၊ (သို့) cover photo, title စတဲ့ နောက်လာမယ့် screen ရဲ့ သေးငယ်ပေမယ့် အဓိပ္ပာယ်ရှိတဲ့ အစိတ်အပိုင်းတချို့ကို သုံးနိုင်ပါတယ်။

Development မှာ — [React Devtools](https://react.dev/learn/react-developer-tools) သုံးပြီး သင့် components တွေရဲ့ loading state ကို ကြိုကြည့် (preview) ပြီး စစ်ဆေးနိုင်ပါတယ်။

### Client Components

Client Components တွေထဲမှာ data fetch လုပ်ဖို့ နည်း နှစ်မျိုး ရှိပါတယ်:

1. React ရဲ့ [`use` API](https://react.dev/reference/react/use)
2. [SWR](https://swr.vercel.app/) (သို့) [React Query](https://tanstack.com/query/latest) လို community library တစ်ခု

#### `use` API ဖြင့် Data Streaming လုပ်ခြင်း

React ရဲ့ [`use` API](https://react.dev/reference/react/use) ကို သုံးပြီး data တွေကို server ကနေ client ဆီ [stream](#streaming) လုပ်နိုင်ပါတယ်။ ပထမဆုံး — Server component ထဲမှာ data fetch လုပ်ပြီး အဲဒီ promise ကို Client Component ဆီ prop အနေနဲ့ ပေးပို့ပါ:

```tsx filename="app/blog/page.tsx" switcher
import Posts from '@/app/ui/posts'
import { Suspense } from 'react'

export default function Page() {
  // Don't await the data fetching function
  const posts = getPosts()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

```jsx filename="app/blog/page.js" switcher
import Posts from '@/app/ui/posts'
import { Suspense } from 'react'

export default function Page() {
  // Don't await the data fetching function
  const posts = getPosts()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

ပြီးရင် — Client Component ထဲမှာ promise ကို ဖတ်ဖို့ `use` API ကို သုံးပါ:

```tsx filename="app/ui/posts.tsx" switcher
'use client'
import { use } from 'react'

export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>
}) {
  const allPosts = use(posts)

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/ui/posts.js" switcher
'use client'
import { use } from 'react'

export default function Posts({ posts }) {
  const allPosts = use(posts)

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

အပေါ်က ဥပမာမှာ — `<Posts>` component ကို [`<Suspense>` boundary](https://react.dev/reference/react/Suspense) တစ်ခုထဲမှာ wrap ထားပါတယ်။ ဆိုလိုတာက — promise ဖြေရှင်းနေချိန်မှာ fallback ကို ပြသမှာ ဖြစ်ပါတယ်။ [streaming](#streaming) အကြောင်း ထပ်ဆင့် လေ့လာနိုင်ပါတယ်။

Promise တစ်ခုကို server ပေါ်မှာ `await` နဲ့ဖြစ်စေ၊ Client Component တစ်ခုထဲမှာ `use()` နဲ့ဖြစ်စေ ဖြေရှင်းနိုင်ပါတယ်။ Promise တစ်ခုကို Server (သို့) Client Component ထဲမှာ ဘယ်အခါ ဖြေရှင်းရမလဲဆိုတာကို React ရဲ့ [documentation](https://react.dev/reference/react/use#resolve-promise-in-server-or-client-component) မှာ ဖော်ပြထားပါတယ်။ Promise တစ်ခုကို prop အနေနဲ့ ပို့နေမယ့်အစား Client Components အများအပြားနဲ့ share လုပ်ချင်ရင် — context ကနေတစ်ဆင့် ပေးနိုင်ပါတယ်။ [Context Provider တစ်ခုအတွင်းမှာ React ရဲ့ `use` ကို အသုံးပြုခြင်း](/docs/nextjs/single-page-applications) ကို ကြည့်ပါ။

#### Community Library များ

Client Components တွေထဲမှာ data fetch လုပ်ဖို့ [SWR](https://swr.vercel.app/) (သို့) [React Query](https://tanstack.com/query/latest) လို community library တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။ ဒီ libraries တွေမှာ caching, streaming စတဲ့ feature တွေအတွက် ကိုယ်ပိုင် semantics (အဓိပ္ပာယ် သတ်မှတ်ချက်များ) ရှိပါတယ်။ ဥပမာ — SWR နဲ့ဆိုရင်:

```tsx filename="app/blog/page.tsx" switcher
'use client'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function BlogPage() {
  const { data, error, isLoading } = useSWR(
    'https://api.vercel.app/blog',
    fetcher
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map((post: { id: string; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/blog/page.js" switcher
'use client'

import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function BlogPage() {
  const { data, error, isLoading } = useSWR(
    'https://api.vercel.app/blog',
    fetcher
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

Browser ကနေ တိုက်ရိုက် fetch လုပ်ခြင်း၊ Server Component တစ်ခုကနေ initial data ပေးခြင်း၊ ပြီးတော့ library ရဲ့ cache ကို Next.js server နဲ့ client caches တွေနဲ့ ချိန်ညှိခြင်း အကြောင်းတွေအတွက် [Client-side data fetching](/docs/nextjs/client-side-data-fetching) ကို ကြည့်ပါ။

## ဥပမာများ

### Sequential Data Fetching (Data တွေကို တစ်ခုပြီးတစ်ခု ရယူခြင်း)

Request တစ်ခုက နောက်တစ်ခုရဲ့ data ပေါ် မှီခိုနေတဲ့အခါ — sequential data fetching ဖြစ်ပေါ်ပါတယ်။

ဥပမာ — `<Playlists>` က `artistID` လိုအပ်လို့ `getArtist()` ဖြေရှင်းပြီးမှသာ data fetch လုပ်နိုင်ပါတယ်:

```tsx filename="app/artist/[username]/page.tsx" switcher
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  // Get artist information
  const artist = await getArtist(username)

  return (
    <>
      <h1>{artist.name}</h1>
      {/* Show fallback UI while the Playlists component is loading */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Pass the artist ID to the Playlists component */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}

async function Playlists({ artistID }: { artistID: string }) {
  // Use the artist ID to fetch playlists
  const playlists = await getArtistPlaylists(artistID)

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/artist/[username]/page.js" switcher
export default async function Page({ params }) {
  const { username } = await params
  // Get artist information
  const artist = await getArtist(username)

  return (
    <>
      <h1>{artist.name}</h1>
      {/* Show fallback UI while the Playlists component is loading */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Pass the artist ID to the Playlists component */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}

async function Playlists({ artistID }) {
  // Use the artist ID to fetch playlists
  const playlists = await getArtistPlaylists(artistID)

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}
```

ဒီဥပမာမှာ — `<Suspense>` က artist data load ဖြစ်ပြီးမှ playlists တွေကို stream လုပ်ဝင်စေပါတယ်။ ဒါပေမယ့် — ဘာမှ မပြသခင် page က artist data ကို ဆက်စောင့်နေပါသေးတယ်။ ဒါကို ကာကွယ်ဖို့ — page component တစ်ခုလုံးကို `<Suspense>` boundary တစ်ခုထဲမှာ wrap လုပ်ပြီး (ဥပမာ — [`loading.js` file](#with-loadingjs) သုံးပြီး) loading state တစ်ခုကို ချက်ချင်း ပြသနိုင်ပါတယ်။

ပထမ request က တခြား အရာအားလုံးကို ပိတ်ဆို့ထားလို့ — သင့် data source က ပထမ request ကို မြန်မြန် ဖြေရှင်းနိုင်ဖို့ သေချာ လုပ်ပါ။ Request ကို ထပ်ပြီး optimize လုပ်လို့ မရတော့ဘူးဆိုရင် — data က မကြာခဏ မပြောင်းလဲဘူးဆိုရင် ရလဒ်ကို [cache](/docs/nextjs/caching) လုပ်ဖို့ စဉ်းစားပါ။

### Parallel Data Fetching (Data တွေကို တစ်ပြိုင်နက် ရယူခြင်း)

Route တစ်ခုထဲက data requests တွေကို တစ်ပြိုင်နက် စတင်လုပ်ဆောင်တဲ့အခါ — parallel data fetching ဖြစ်ပေါ်ပါတယ်။

Default အနေနဲ့ — [layouts နဲ့ pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) တွေကို parallel ဖြစ်ဖြစ် render လုပ်ပါတယ်။ ဒါကြောင့် segment တစ်ခုစီက data fetching ကို တတ်နိုင်သမျှ မြန်မြန် စတင်ပါတယ်။

ဒါပေမယ့် — component _တိုင်း_ ထဲမှာတော့ `async`/`await` requests အများအပြားက တစ်ခုပြီးတစ်ခု နေရာချထားရင် sequential ဖြစ်နေနိုင်ပါသေးတယ်။ ဥပမာ — `getAlbums` က `getArtist` ဖြေရှင်းပြီးသည်အထိ ပိတ်ဆို့ခံနေရပါတယ်:

```tsx filename="app/artist/[username]/page.tsx" switcher
import { getArtist, getAlbums } from '@/app/lib/data'

export default async function Page({ params }) {
  // These requests will be sequential
  const { username } = await params
  const artist = await getArtist(username)
  const albums = await getAlbums(username)
  return <div>{artist.name}</div>
}
```

`fetch` တွေကို ခေါ်ပြီး requests အများအပြားကို စတင်လိုက်ပါ — ပြီးရင် [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) နဲ့ သူတို့ကို `await` လုပ်ပါ။ `fetch` ခေါ်လိုက်တာနဲ့ requests တွေ ချက်ချင်း စတင်ပါတယ်။

```tsx filename="app/artist/[username]/page.tsx" highlight={3,8,24} switcher
import Albums from './albums'

async function getArtist(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}`)
  return res.json()
}

async function getAlbums(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`)
  return res.json()
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  // Initiate requests
  const artistData = getArtist(username)
  const albumsData = getAlbums(username)

  const [artist, albums] = await Promise.all([artistData, albumsData])

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  )
}
```

```jsx filename="app/artist/[username]/page.js" highlight={3,8,20} switcher
import Albums from './albums'

async function getArtist(username) {
  const res = await fetch(`https://api.example.com/artist/${username}`)
  return res.json()
}

async function getAlbums(username) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`)
  return res.json()
}

export default async function Page({ params }) {
  const { username } = await params

  // Initiate requests
  const artistData = getArtist(username)
  const albumsData = getAlbums(username)

  const [artist, albums] = await Promise.all([artistData, albumsData])

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  )
}
```

> **သိထားသင့်သည်:** `Promise.all` သုံးတဲ့အခါ request တစ်ခု fail ဖြစ်ရင် — operation တစ်ခုလုံး fail ဖြစ်သွားပါတယ်။ ဒါကို ကိုင်တွယ်ဖို့ — [`Promise.allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) method ကို အဲဒီအစား သုံးနိုင်ပါတယ်။

### React.cache ဖြင့် Data ပြန်သုံးခြင်း

Data-fetching function တစ်ခုကို [`React.cache`](https://react.dev/reference/react/cache) ထဲမှာ wrap လုပ်ထားရင် — request တစ်ခုတည်းအတွင်း component အများအပြားက ပြန်ပြန် fetch လုပ်နေမယ့်အစား ရလဒ်တစ်ခုတည်းကို အတူတကွ share လုပ်နိုင်ပါတယ်:

```ts filename="app/lib/user.ts" switcher
import { cache } from 'react'

export const getUser = cache(async () => {
  const res = await fetch('https://api.example.com/user')
  return res.json()
})
```

```js filename="app/lib/user.js" switcher
import { cache } from 'react'

export const getUser = cache(async () => {
  const res = await fetch('https://api.example.com/user')
  return res.json()
})
```

Server Components တွေက `getUser()` ကို တိုက်ရိုက် ခေါ်နိုင်ပါတယ်:

```tsx filename="app/dashboard/page.tsx" switcher
import { getUser } from '../lib/user'

export default async function DashboardPage() {
  const user = await getUser() // Cached - same request, no duplicate fetch
  return <h1>Dashboard for {user.name}</h1>
}
```

```jsx filename="app/dashboard/page.js" switcher
import { getUser } from '../lib/user'

export default async function DashboardPage() {
  const user = await getUser() // Cached - same request, no duplicate fetch
  return <h1>Dashboard for {user.name}</h1>
}
```

`getUser` ကို `React.cache` နဲ့ wrap ထားလို့ — request တစ်ခုတည်းအတွင်း ခေါ်မှု အများအပြားက memoize လုပ်ထားတဲ့ ရလဒ်တစ်ခုတည်းကိုပဲ ပြန်ပေးပါတယ် — Server Components တွေထဲမှာ တိုက်ရိုက် ခေါ်သည်ဖြစ်စေ၊ Client Components တွေထဲမှာ context ကနေတစ်ဆင့် ဖြေရှင်းသည်ဖြစ်စေ အတူတူပါပဲ။

> **သိထားသင့်သည်:** `React.cache` က လက်ရှိ request အတွက်ပဲ scope လုပ်ထားပါတယ်။ Request တစ်ခုစီမှာ ကိုယ်ပိုင် memoization scope ရှိပြီး — requests တွေကြားမှာ sharing လုပ်ခြင်း မရှိပါဘူး။
