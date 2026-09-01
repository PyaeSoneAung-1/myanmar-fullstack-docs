---
title: "Next.js နဲ့ တွဲသုံးခြင်း"
description: "SWR ကို Next.js နဲ့ တွဲသုံးခြင်း — App Router ရဲ့ Server/Client Components၊ Server Components မှာ preload နဲ့ cacheData သုံး၍ data ကြိုတင်ယူခြင်း၊ SSR/SSG pre-rendering နဲ့ default data"
order: 15
source: "https://swr.vercel.app/docs/with-nextjs"
status: translated
updated: 2026-09-01
---

## App Router

### Server Components

> ✅ Next.js App Router မှာ — component တွေ အားလုံးက default အားဖြင့် React Server Components (RSC) တွေပါ။ **RSC ထဲမှာ SWRConfig နဲ့ key serialization API တွေကို SWR ကနေ import လုပ်လို့ရပါတယ်။**

```tsx
import { unstable_serialize } from 'swr' // ✅ Server components တွေမှာ ရနိုင်ပါတယ်
import { unstable_serialize as infinite_unstable_serialize } from 'swr/infinite' // ✅ Server components တွေမှာ ရနိုင်ပါတယ်

import { SWRConfig } from 'swr' // ✅ Server components တွေမှာ ရနိုင်ပါတယ်
import { preload } from 'swr' // ✅ Server components တွေမှာ ရနိုင်ပါတယ်
```

> Hook API တွေက RSC ထဲမှာ မရနိုင်တာမို့ — SWR ကနေ hook API တွေကို import လုပ်လို့ မရပါဘူး။

```tsx
import useSWR from 'swr' // ❌ Server components တွေမှာ မရနိုင်ပါဘူး
import useSWRInfinite from 'swr/infinite' // ❌ Server components တွေမှာ မရနိုင်ပါဘူး
import usesSWRMutation from 'swr/mutation' // ❌ Server components တွေမှာ မရနိုင်ပါဘူး
```

### Client Components

Component တွေကို `'use client'` directive နဲ့ မှတ်သားလို့ရသလို — client component ကနေ SWR ကို import လုပ်လို့လည်း ရပါတယ်။ နည်းလမ်း နှစ်ခုလုံးက SWR ရဲ့ client data fetching hook တွေကို သုံးခွင့် ပေးပါတယ်။

```tsx
'use client'

import useSWR from 'swr'

export default function Page() {
  const { data } = useSWR('/api/user', fetcher)
  return <h1>{data.name}</h1>
}
```

### Server Components ထဲမှာ Data ကြိုတင်ယူခြင်း

React Server Components (RSC) မှာ အကြံပြုထားတဲ့ နည်းလမ်းကတော့ — `preload` နဲ့ fetch စတင်ပြီး — ရလာတဲ့ data ကို `<SWRConfig>` ရဲ့ `cacheData` option ကနေ client component tree ဆီ ပေးပို့တာပါ:

```tsx
import { preload, SWRConfig } from 'swr'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cacheData = {
    ...preload('/api/user', fetchUserFromAPI),
    ...preload('/api/posts', fetchPostsFromAPI),
  }

  return (
    <SWRConfig value={{ cacheData }}>
      {children}
    </SWRConfig>
  )
}
```

> 💡 `preload` ခေါ်မှု နှစ်ခုလုံးက ချက်ချင်း fetch စတင်တာမို့ — layout ထဲမှာ await လုပ်စရာ မလိုဘဲ — request တွေက အပြိုင် (parallel) လည်ပတ်နေပါတယ်။

React Server Components တွေမှာ — `cacheData` ထဲက promise တွေက `"use client"` boundary ကို ဖြတ်ကျော်နိုင်ပြီး — Server-Side Rendering လုပ်နေတုန်း SWR က အဲဒါတွေကို အလိုအလျောက် resolve လုပ်ပေးပါတယ်:

```tsx
'use client'

import useSWR from 'swr'

export default function Page() {
  // SWR က Server Component က preload လုပ်ထားတဲ့ data ကို resolve လုပ်ပေးပါတယ်
  // `user` ရော `posts` ပါ SSR နဲ့ client hydration နှစ်ခုလုံးမှာ အဆင်သင့် ဖြစ်နေပါတယ်
  const { data: user } = useSWR('/api/user', fetcher)
  const { data: posts } = useSWR('/api/posts', fetcher)

  return (
    <div>
      <h1>{user.name}'s Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

SWR က initial render အတွက် server က load လုပ်ထားတဲ့ ရလဒ်ကို သုံးပါတယ်။ Client ဘက်မှာတော့ — SWR က တာဝန်ယူပြီး ပုံမှန် revalidation အပြုအမူအတိုင်း ဆက်လုပ်ပါတယ်။

`preload` နဲ့ `cacheData` နဲ့ဆိုရင် — server ပေါ်မှာ fetch က တတ်နိုင်သမျှ အစောဆုံး စတင်ပါတယ်။ Data ကို သုံးစွဲတဲ့ UI boundary တွေပဲ — ဥပမာ အနီးဆုံး `Suspense` boundary ဒါမှမဟုတ် Next.js layout — streaming SSR အတွင်း block ဖြစ်ပါတယ်။

> ဒီ prefetch ပုံစံကို app ထဲမှာ တစ်ဆင့်ချင်း (incrementally) စတင်ကျင့်သုံးချင်ရင် — `strictServerPrefetchWarning` option ကို ဖွင့်နိုင်ပါတယ်။ ဒါက key တစ်ခုအတွက် pre-filled data မရှိတဲ့အခါ console မှာ warning message ပြပေးတာမို့ — ဘယ် data fetching call တွေက server-side prefetching ကနေ အကျိုးရှိနိုင်လဲ ခွဲခြားသိစေပါတယ်။

### `cacheData` ဘယ်လို အလုပ်လုပ်လဲ

> 🧪 ဒီ feature က SWR 2.5.0-beta.1 နဲ့ အထက် လိုအပ်ပြီး — လက်ရှိမှာ experimental ဖြစ်နေပါတယ်။

Server Component တစ်ခုမှာ — `preload(key, fetcher)` က fetch ကို ချက်ချင်း စတင်ပြီး — request-scoped `CacheData` object တစ်ခု ပြန်ပေးပါတယ်။ အဲဒီ object ကို `SWRConfig` ရဲ့ `cacheData` option ဆီ ပေးလိုက်ပါ:

```tsx
import { preload, SWRConfig } from 'swr'
import { User } from './user'

const getUser = () => fetchUserFromDatabase()

export default function Page() {
  const cacheData = preload('/api/user', getUser)

  return (
    <SWRConfig value={{ cacheData }}>
      <User />
    </SWRConfig>
  )
}
```

Client component ကတော့ — key တူတူကို ပုံမှန် client-side fetcher နဲ့ သုံးပါတယ်:

```tsx
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function User() {
  const { data } = useSWR('/api/user', fetcher)
  return <h1>{data?.name}</h1>
}
```

SWR က initial render အတွက် server က load လုပ်ထားတဲ့ ရလဒ်ကို သုံးပြီး — hydration အတွင်း client cache ထဲ ရေးပြီး — ထပ်နေတဲ့ client initial request ကို ကျော်သွားပါတယ်။ နောက်ပိုင်း revalidation တွေကတော့ client-side fetcher ကိုပဲ ဆက်သုံးပါတယ်။

`preload` ခေါ်မှုတစ်ခုချင်းစီက object အသစ် ပြန်ပေးတာမို့ — key အများကြီးကို await မလုပ်ဘဲ ကြိုတင်ယူချင်ရင် object တွေကို ပေါင်းစပ်လိုက်ပါ:

```tsx
const cacheData = {
  ...preload('/api/user', getUser),
  ...preload('/api/posts', getPosts),
}
```

`preload` က ရှုပ်ထွေးတဲ့ SWR key တွေကို အလိုအလျောက် serialize လုပ်ပေးပါတယ်။ `cacheData` option ကို `SWRConfig` မှာပဲ ထောက်ပံ့ပြီး — `useSWR` ဆီ တိုက်ရိုက် ပေးလို့ မရပါဘူး။

## Client Side Data Fetching

Page ထဲမှာ မကြာခဏ update ဖြစ်နေတဲ့ data တွေ ပါပြီး — data ကို pre-render လုပ်စရာ မလိုဘူးဆိုရင် — SWR က အံကိုက်ဖြစ်ပြီး အထူး setup တစ်ခုမှ မလိုပါဘူး: `useSWR` ကို import လုပ်ပြီး — data ကို သုံးတဲ့ component တွေထဲမှာ hook ကို သုံးလိုက်ရုံပါပဲ။

ဒီလို အလုပ်လုပ်ပါတယ်:

- အရင်ဆုံး — data မပါဘဲ page ကို ချက်ချင်း ပြပါ။ ပျောက်နေတဲ့ data အတွက် loading state တွေ ပြနိုင်ပါတယ်။
- ပြီးရင် — client side မှာ data ကို fetch လုပ်ပြီး — အဆင်သင့် ဖြစ်တာနဲ့ ပြသပါ။

ဒီနည်းလမ်းက user dashboard page တွေလို နေရာမျိုးအတွက် ကောင်းပါတယ်။ Dashboard က private၊ user-specific page ဖြစ်တာမို့ — SEO က အရေးမပါဘဲ — page ကို pre-render လုပ်စရာလည်း မလိုပါဘူး။ Data ကလည်း မကြာခဏ update ဖြစ်တာမို့ — request-time data fetching လိုအပ်ပါတယ်။

## Default Data နဲ့ Pre-rendering

Page ကို pre-render လုပ်ဖို့ လိုအပ်ရင် — Next.js က [pre-rendering ပုံစံ ၂ မျိုး](https://nextjs.org/docs/basic-features/data-fetching) ကို ထောက်ပံ့ပါတယ်: **Static Generation (SSG)** နဲ့ **Server-side Rendering (SSR)** တို့ပါ။

SWR နဲ့ တွဲသုံးရင် — page ကို SEO အတွက် pre-render လုပ်နိုင်သလို — client side မှာ caching, revalidation, focus tracking, interval နဲ့ refetching စတဲ့ feature တွေကိုပါ ရရှိနိုင်ပါတယ်။

Boundary အောက်က SWR hook တွေ အားလုံးအတွက် — server ကရတဲ့ data ကို cache ထဲ ထည့်ပေးဖို့ [`SWRConfig`](/docs/swr/global-config) ရဲ့ `cacheData` option ကို သုံးနိုင်ပါတယ်။

ဥပမာ `getStaticProps` နဲ့:

```jsx
 export async function getStaticProps () {
  // `getStaticProps` က server side မှာ execute လုပ်ပါတယ်
  const article = await getArticleFromAPI()
  return {
    props: {
      cacheData: {
        '/api/article': article
      }
    }
  }
}

function Article() {
  // `data` က server က ပေးထားတဲ့ `cacheData` ကနေ ရနိုင်ပါတယ်
  const { data } = useSWR('/api/article', fetcher)
  return <h1>{data.title}</h1>
}

export default function Page({ cacheData }) {
  // `SWRConfig` boundary အောက်က SWR hooks တွေက ဒီ values တွေကို သုံးပါလိမ့်မယ်
  return (
    <SWRConfig value={{ cacheData }}>
      <Article />
    </SWRConfig>
  )
}
```

Page က pre-render လုပ်ထားဆဲပါ — SEO friendly၊ response မြန်ဆန်ပြီး — client side မှာတော့ SWR ရဲ့ စွမ်းဆောင်ရည် အပြည့် သုံးနေပါတယ်။ Data က dynamic ဖြစ်ပြီး — အချိန်ကြာလာတာနဲ့အမျှ ကိုယ်တိုင် update ဖြစ်နေနိုင်ပါတယ်။

> 💡 `Article` component က pre-generated data ကို render လုပ်ပြီး — duplicate initial request မလုပ်ဘဲ client cache ထဲ hydrate လုပ်ပါတယ်။ နောက်ပိုင်း revalidation တွေကတော့ client fetcher ကိုပဲ ဆက်သုံးပါတယ်။

### Complex Keys

`useSWR` က `array` နဲ့ `function` type ဖြစ်တဲ့ key တွေနဲ့ သုံးလို့ရပါတယ်။ `cacheData` ကို ကိုယ်တိုင် ဖန်တီးတဲ့အခါ — ဒီ key တွေကို `unstable_serialize` နဲ့ serialize လုပ်ပါ။

```jsx
import useSWR, { unstable_serialize } from 'swr'

export async function getStaticProps () {
  const article = await getArticleFromAPI(1)
  return {
    props: {
      cacheData: {
        // unstable_serialize() က array style key ကို serialize လုပ်ပေးပါတယ်
        [unstable_serialize(['api', 'article', 1])]: article,
      }
    }
  }
}

function Article() {
  // array style key သုံးထားပါတယ်
  const { data } = useSWR(['api', 'article', 1], fetcher)
  return <h1>{data.title}</h1>
}

export default function Page({ cacheData }) {
  return (
    <SWRConfig value={{ cacheData }}>
      <Article />
    </SWRConfig>
  )
}
```
