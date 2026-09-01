---
title: "Server Rendering & Hydration (ဆာဗာ Rendering နဲ့ Hydration)"
description: "React Query ကို server rendering နဲ့ သုံးနည်း — queryClient setup, initialData, hydration APIs, prefetching, error handling, serialization, request waterfalls, tips & caveats"
order: 20
source: "https://tanstack.com/query/latest/docs/framework/react/guides/ssr"
status: translated
updated: 2026-09-01
---

ဒီ guide မှာ React Query ကို server rendering နဲ့ ဘယ်လို သုံးရမလဲဆိုတာ လေ့လာရပါမယ်။

နောက်ခံ အကြောင်းအရာအချို့အတွက် [Prefetching & Router Integration](/docs/tanstack-query/prefetching) guide ကို ကြည့်ပါ။ အဲဒီ့အပြင် [Performance & Request Waterfalls guide](/docs/tanstack-query/request-waterfalls) ကိုလည်း အရင်ကြည့်ချင်နိုင်ပါတယ်။

Hydration + prefetching အကြောင်း ပိုနက်ရှိုင်းတဲ့ ဥပမာတွေ (code splitting အပါအဝင်) အတွက် — [Dependent Queries & Code Splitting](/docs/tanstack-query/prefetching#dependent-queries-code-splitting) section ကို ကြည့်ပါ။

Streaming, Server Components နဲ့ Next.js app router အသစ်လို advanced server rendering ပုံစံတွေအတွက် — [Advanced Server Rendering guide](/docs/tanstack-query/advanced-ssr) ကို ကြည့်ပါ။

Code ပဲ ကြည့်ချင်ရင် — အောက်က [Full Next.js pages router example](#full-nextjs-pages-router-example) ဒါမှမဟုတ် [Full Remix example](#full-remix-example) ဆီကို ကျော်သွားနိုင်ပါတယ်။

## Server Rendering နဲ့ React Query

ဒါဆို server rendering ဆိုတာ ဘာလဲ။ ဒီ guide ရဲ့ ကျန်တဲ့ အပိုင်းတွေက ဒီ concept ကို သင်ရင်းနှီးပြီးသားလို့ ယူဆပါမယ် — ဒါပေမယ့် React Query နဲ့ ဘယ်လို ဆက်စပ်လဲဆိုတာကို ခဏလောက် လေ့လာကြည့်ရအောင်။ Server rendering ဆိုတာ — user က page ကို load လုပ်တာနဲ့ ကြည့်လို့ရတဲ့ content တစ်ခုခု ရှိစေဖို့ server ပေါ်မှာ initial html ကို ထုတ်လုပ်ခြင်းပါ။ ဒါက page တစ်ခုကို request လုပ်တဲ့အခါ လိုအပ်သလို (SSR) ဖြစ်နိုင်သလို — အရင်က request တစ်ခုရဲ့ cache ကြောင့် ဒါမှမဟုတ် build time မှာ ကြိုတင်လည်း ဖြစ်နိုင်ပါတယ် (SSG)။

[Performance & Request Waterfalls guide](/docs/tanstack-query/request-waterfalls) ကို ဖတ်ဖူးရင် ဒါကို မှတ်မိနိုင်ပါတယ်:

```
1. |-> Markup (without content)
2.   |-> JS
3.     |-> Query
```

Client-rendered application တစ်ခုနဲ့ဆိုရင် — user အတွက် screen ပေါ်မှာ content တစ်ခုခု ပေါ်လာဖို့ server roundtrip အနည်းဆုံး ၃ ခု လိုပါတယ်။ Server rendering ကို ကြည့်တဲ့ နည်းတစ်နည်းက — အပေါ်က ပုံစံကို ဒီလို ပြောင်းလိုက်တာပါ:

```
1. |-> Markup (with content AND initial data)
2.   |-> JS
```

**1.** ပြီးသွားတာနဲ့ user က content ကို မြင်ရပြီး — **2.** ပြီးတဲ့အခါ page က interactive ဖြစ်ပြီး click လုပ်လို့ရပါပြီ။ Markup ထဲမှာ လိုအပ်တဲ့ initial data ပါ ပါဝင်နေလို့ — step **3.** က client မှာ လုံးဝ run စရာ မလိုပါဘူး။ အနည်းဆုံးတော့ — တစ်နည်းနည်းနဲ့ data ကို revalidate လုပ်ချင်တဲ့ အထိပါ။

ဒါတွေက client ရဲ့ ရှုထောင့်ကပါ။ Server ဘက်မှာတော့ — markup ကို မထုတ်လုပ်ခင်/မရေးခင် ဒီ data တွေကို **prefetch** လုပ်ဖို့ လိုပြီး — markup ထဲမှာ ထည့်သွင်းနိုင်ဖို့ data ကို **dehydrate** လုပ်ပြီး serializable format တစ်ခုအဖြစ် ပြောင်းဖို့ လိုပါတယ်။ Client မှာတော့ — client မှာ fetch အသစ်တစ်ခု ထပ်မလုပ်ဖို့ React Query cache ထဲကို data ကို **hydrate** လုပ်ဖို့ လိုပါတယ်။

ဒီ step သုံးခုကို React Query နဲ့ ဘယ်လို အကောင်အထည်ဖော်ရမလဲဆိုတာ ဆက်လေ့လာကြည့်ရအောင်။

## Suspense အကြောင်း မှတ်ချက်တစ်ခု

ဒီ guide က ပုံမှန် `useQuery` API ကို သုံးပါတယ်။ ကျွန်တော်တို့ အမြဲတမ်းတော့ အကြံမပြုပေမယ့် — **သင့် queries တွေ အားလုံးကို အမြဲ prefetch လုပ်သရွေ့** — ဒါကို `useSuspenseQuery` နဲ့ အစားထိုးလို့ ရပါတယ်။ အကျိုးကျေးဇူးကတော့ — client မှာ loading states တွေအတွက် `<Suspense>` ကို သုံးလို့ရတာပါ။

`useSuspenseQuery` သုံးနေတုန်း query တစ်ခုကို prefetch လုပ်ဖို့ မေ့သွားရင် — အကျိုးဆက်က သင်သုံးနေတဲ့ framework ပေါ်မှာ မူတည်ပါတယ်။ ဖြစ်ရပ်တချို့မှာ — data က Suspend ဖြစ်ပြီး server မှာ fetch ခံရပေမယ့် client ဆီ ဘယ်တော့မှ hydrate မဖြစ်ဘဲ — client မှာ နောက်တစ်ကြိမ် ပြန် fetch လုပ်ပါလိမ့်မယ်။ ဒီလိုဖြစ်ရင် markup hydration mismatch ရပါလိမ့်မယ် — ဘာကြောင့်လဲဆိုတော့ server နဲ့ client က မတူညီတဲ့ အရာတွေကို render လုပ်ဖို့ ကြိုးစားခဲ့လို့ပါ။

## ကနဦး Setup

React Query သုံးတဲ့အခါ ပထမဆုံး step တွေက — `queryClient` တစ်ခု ဖန်တီးပြီး application ကို `<QueryClientProvider>` နဲ့ ထုပ်ဖို့ပါ။ Server rendering လုပ်တဲ့အခါ — `queryClient` instance ကို **သင့် app ရဲ့ အတွင်းမှာ**၊ React state ထဲမှာ ဖန်တီးဖို့ အရေးကြီးပါတယ် (instance ref ဆိုရင်လည်း ရပါတယ်)။ **ဒါက data တွေကို user တွေနဲ့ requests တွေကြားမှာ မျှဝေမခံရအောင် သေချာစေပြီး** — `queryClient` ကို component lifecycle တစ်ခုမှာ တစ်ကြိမ်ပဲ ဖန်တီးစေပါတယ်။

Next.js pages router:

```tsx
// _app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// NEVER DO THIS:
// const queryClient = new QueryClient()
//
// File root level မှာ queryClient ဖန်တီးရင် cache က share ဖြစ်ပြီး
// requests အားလုံးကြားမှာ — data အားလုံးက user အားလုံးဆီ ရောက်သွားပါတယ်။
// Performance အတွက် မကောင်းတာအပြင် — sensitive data တွေပါ ပေါက်ကြားစေပါတယ်။

export default function MyApp({ Component, pageProps }) {
  // အဲဒီအစား ဒီလိုလုပ်ပါ — request တစ်ခုချင်းစီမှာ ကိုယ်ပိုင် cache ရှိစေပါတယ်:
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // SSR မှာ ပုံမှန်အားဖြင့် default staleTime တစ်ခု သတ်မှတ်ချင်တတ်ပါတယ်
            // client မှာ ချက်ချင်း refetch မဖြစ်အောင် 0 အထက် ထားပါ
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
```

Remix:

```tsx
// app/root.tsx
import { Outlet } from '@remix-run/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function MyApp() {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // SSR မှာ ပုံမှန်အားဖြင့် default staleTime တစ်ခု သတ်မှတ်ချင်တတ်ပါတယ်
            // client မှာ ချက်ချင်း refetch မဖြစ်အောင် 0 အထက် ထားပါ
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}
```

## `initialData` နဲ့ အမြန် စတင်ခြင်း

အမြန်ဆုံး စတင်နည်းက — prefetching နဲ့ ပတ်သက်လို့ React Query ကို လုံးဝ မပါဝင်စေဘဲ — `dehydrate`/`hydrate` APIs တွေကိုလည်း မသုံးတာပါ။ အဲဒီအစား — raw data ကို `useQuery` ရဲ့ `initialData` option အဖြစ် ထည့်ပေးလိုက်ပါ။ Next.js pages router ကို `getServerSideProps` နဲ့ သုံးတဲ့ ဥပမာ ကြည့်ရအောင်။

```tsx
export async function getServerSideProps() {
  const posts = await getPosts()
  return { props: { posts } }
}

function Posts(props) {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    initialData: props.posts,
  })

  // ...
}
```

ဒါက `getStaticProps` ဒါမှမဟုတ် အဟောင်းဖြစ်တဲ့ `getInitialProps` နဲ့လည်း အလုပ်လုပ်ပြီး — အလားတူ function တွေ ရှိတဲ့ တခြား framework တိုင်းမှာလည်း ဒီ pattern ကို သုံးနိုင်ပါတယ်။ ဒီဥပမာတစ်ခုတည်းကို Remix နဲ့ ဘယ်လို ရေးမလဲဆိုတာ ဒီမှာ ကြည့်ရအောင်:

```tsx
export async function loader() {
  const posts = await getPosts()
  return json({ posts })
}

function Posts() {
  const { posts } = useLoaderData<typeof loader>()

  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    initialData: posts,
  })

  // ...
}
```

Setup က အနည်းငယ်ပဲ လိုပြီး ဖြစ်ရပ်တချို့အတွက် အမြန် solution တစ်ခု ဖြစ်နိုင်ပေမယ့် — ပြည့်စုံတဲ့ approach နဲ့ ယှဉ်ရင် **စဉ်းစားစရာ tradeoffs အနည်းငယ်** ရှိပါတယ်:

- Component tree ထဲ ပိုနက်တဲ့ နေရာမှာ `useQuery` ခေါ်နေတယ်ဆိုရင် — `initialData` ကို အဲဒီနေရာအထိ အောက်ကို ပို့ပေးရပါမယ်
- `useQuery` ကို နေရာများစွာမှာ တူညီတဲ့ query နဲ့ ခေါ်နေတယ်ဆိုရင် — `initialData` ကို တစ်နေရာတည်းမှာပဲ ထည့်ပေးတာက brittle (ပျက်စီးလွယ်) ဖြစ်ပြီး သင့် app ပြောင်းလဲတဲ့အခါ ပျက်သွားနိုင်ပါတယ်။ `initialData` ပါတဲ့ `useQuery` ရှိတဲ့ component ကို ဖယ်လိုက် ဒါမှမဟုတ် ရွှေ့လိုက်ရင် — ပိုနက်တဲ့ `useQuery` မှာ data လုံးဝ မရှိတော့နိုင်ပါဘူး။ `initialData` ကို လိုအပ်တဲ့ query **တိုင်း** မှာ ထည့်ပေးရတာကလည်း ပင်ပန်းပါတယ်
- Query ကို server မှာ ဘယ်အချိန် fetch လုပ်ခဲ့လဲဆိုတာ သိဖို့ နည်းလမ်း မရှိလို့ — `dataUpdatedAt` နဲ့ query က refetch လိုလား ဆုံးဖြတ်တာက page ဘယ်အချိန် load ဖြစ်ခဲ့လဲဆိုတာပေါ် အခြေခံပါတယ်
- Query တစ်ခုအတွက် cache ထဲမှာ data ရှိပြီးသားဆိုရင် — `initialData` က ဒီ data ကို ဘယ်တော့မှ overwrite လုပ်မှာ မဟုတ်ပါဘူး — **data အသစ်က အဟောင်းထက် ပိုပြီး fresh ဖြစ်နေရင်တောင် မဖြစ်ပါဘူး**။
  - ဒါက ဘာကြောင့် အထူးဆိုးလဲဆိုတာ နားလည်ဖို့ — အပေါ်က `getServerSideProps` ဥပမာကို စဉ်းစားကြည့်ပါ။ Page တစ်ခုဆီ ခဏခဏ အသွားအပြန် သွားရင် — `getServerSideProps` က တစ်ခါတိုင်း ခေါ်ခံရပြီး data အသစ် fetch လုပ်ပါတယ်။ ဒါပေမယ့် `initialData` option သုံးနေတာမို့ — client cache နဲ့ data က ဘယ်တော့မှ update ဖြစ်မှာ မဟုတ်ပါဘူး

ပြည့်စုံတဲ့ hydration solution ကို setup လုပ်တာက ရိုးရှင်းပြီး ဒီအားနည်းချက်တွေ မရှိပါဘူး — ဒါက ကျန်တဲ့ documentation ရဲ့ အဓိကအကြောင်းအရာ ဖြစ်ပါလိမ့်မယ်။

## Hydration APIs တွေကို အသုံးပြုခြင်း

Setup နည်းနည်း ပိုလုပ်ရုံနဲ့ — preload phase အတွင်း queries တွေကို prefetch လုပ်ဖို့ `queryClient` တစ်ခုကို သုံးပြီး — အဲဒီ `queryClient` ရဲ့ serialized version ကို app ရဲ့ rendering အပိုင်းဆီ ပို့ပြီး အဲဒီမှာ ပြန်သုံးနိုင်ပါတယ်။ ဒါက အပေါ်က အားနည်းချက်တွေကို ရှောင်ပါတယ်။ ပြည့်စုံတဲ့ Next.js pages router နဲ့ Remix ဥပမာတွေအတွက် ရှေ့ကို ကျော်သွားလို့ ရပါတယ် — ဒါပေမယ့် ယေဘုယျအားဖြင့် အပို step တွေက ဒီလိုပါ:

- Framework ရဲ့ loader function ထဲမှာ `const queryClient = new QueryClient(options)` ကို ဖန်တီးပါ
- Loader function ထဲမှာ — prefetch လုပ်ချင်တဲ့ query တစ်ခုချင်းစီအတွက် `await queryClient.query(...)` ကို လုပ်ပါ
  - ဖြစ်နိုင်ရင် queries တွေကို parallel ဖြစ်အောင် fetch လုပ်ဖို့ `await Promise.all(...)` ကို သုံးချင်ပါလိမ့်မယ်
  - Prefetch မလုပ်ထားတဲ့ queries တွေ ရှိနေတာ ကိစ္စမရှိပါဘူး။ ဒါတွေက server-render မဖြစ်ဘဲ — application interactive ဖြစ်ပြီးနောက် client မှာ fetch ခံရပါလိမ့်မယ်။ User interaction ပြီးမှသာ ပြသရတဲ့ content တွေ ဒါမှမဟုတ် ပိုအရေးကြီးတဲ့ content တွေကို မပိတ်ဆို့ဖို့ page ရဲ့ အောက်ပိုင်းမှာ ရှိတဲ့ content တွေအတွက် ကောင်းပါတယ်
- Loader ကနေ `dehydrate(queryClient)` ကို return လုပ်ပါ — ဒါကို return လုပ်တဲ့ syntax အတိအကျက framework တွေကြားမှာ ကွဲပြားတာကို သတိပြုပါ
- သင့် tree ကို `<HydrationBoundary state={dehydratedState}>` နဲ့ ထုပ်ပါ — `dehydratedState` က framework loader ကနေ လာပါတယ်။ `dehydratedState` ကို ဘယ်လို ရယူမလဲဆိုတာလည်း framework တွေကြားမှာ ကွဲပြားပါတယ်
  - ဒါကို route တစ်ခုချင်းစီအတွက် လုပ်နိုင်သလို — boilerplate ရှောင်ဖို့ application ရဲ့ ထိပ်ဆုံးမှာလည်း လုပ်နိုင်ပါတယ်၊ ဥပမာတွေ ကြည့်ပါ

> စိတ်ဝင်စားစရာ အသေးစိတ်တစ်ခုက — တကယ်တော့ `queryClient` သုံးခု ပါဝင်နေတာပါ။ Framework loaders တွေက rendering မဖြစ်ခင် ဖြစ်ပွားတဲ့ "preloading" phase တစ်မျိုး ဖြစ်ပြီး — ဒီ phase မှာ prefetching လုပ်တဲ့ ကိုယ်ပိုင် `queryClient` ရှိပါတယ်။ ဒီ phase ရဲ့ dehydrated ရလဒ်ကို server rendering process **ရော** client rendering process **ပါ** နှစ်ခုလုံးဆီ ပို့ပေးပါတယ် — တစ်ခုချင်းစီမှာ ကိုယ်ပိုင် `queryClient` ရှိပါတယ်။ ဒါက နှစ်ခုလုံး တူညီတဲ့ data နဲ့ စတင်နိုင်ပြီး — တူညီတဲ့ markup ကို ပြန်ပို့နိုင်စေဖို့ သေချာစေပါတယ်။

> Server Components တွေက "preloading" phase ရဲ့ နောက်ထပ် ပုံစံတစ်ခု ဖြစ်ပြီး — React component tree ရဲ့ အပိုင်းတွေကိုလည်း "preload" (pre-render) လုပ်နိုင်ပါတယ်။ [Advanced Server Rendering guide](/docs/tanstack-query/advanced-ssr) မှာ ပိုဖတ်ပါ။

### Full Next.js pages router example

> App router documentation အတွက် — [Advanced Server Rendering guide](/docs/tanstack-query/advanced-ssr) ကို ကြည့်ပါ။

ကနဦး setup:

```tsx
// _app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // SSR မှာ ပုံမှန်အားဖြင့် default staleTime တစ်ခု သတ်မှတ်ချင်တတ်ပါတယ်
            // client မှာ ချက်ချင်း refetch မဖြစ်အောင် 0 အထက် ထားပါ
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
```

Route တစ်ခုချင်းစီမှာ:

```tsx
// pages/posts.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from '@tanstack/react-query'

// ဒါက getServerSideProps လည်း ဖြစ်နိုင်ပါတယ်
export async function getStaticProps() {
  const queryClient = new QueryClient()

  await queryClient
    .query({
      queryKey: ['posts'],
      queryFn: getPosts,
    })
    .catch(noop)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}

function Posts() {
  // ဒီ useQuery က <PostsRoute> ရဲ့ ပိုနက်တဲ့ child တစ်ခုခုမှာ ဖြစ်နိုင်ပါတယ်
  // ဘယ်လိုပဲ ဖြစ်ဖြစ် data က ချက်ချင်း ရနိုင်ပါလိမ့်မယ်
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts })

  // ဒီ query က server မှာ prefetch မဖြစ်ခဲ့ဘူး — client ပေါ်မှာမှ
  // fetch စတင်ပါမယ်၊ pattern နှစ်ခုလုံး ရောသုံးလို့ ရပါတယ်
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  })

  // ...
}

export default function PostsRoute({ dehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  )
}
```

### Full Remix example

ကနဦး setup:

```tsx
// app/root.tsx
import { Outlet } from '@remix-run/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function MyApp() {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // SSR မှာ ပုံမှန်အားဖြင့် default staleTime တစ်ခု သတ်မှတ်ချင်တတ်ပါတယ်
            // client မှာ ချက်ချင်း refetch မဖြစ်အောင် 0 အထက် ထားပါ
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  )
}
```

Route တစ်ခုချင်းစီမှာ — nested routes တွေမှာလည်း ဒါကို လုပ်တာ ကိစ္စမရှိဘူးဆိုတာ သတိပြုပါ:

```tsx
// app/routes/posts.tsx
import { json } from '@remix-run/node'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from '@tanstack/react-query'

export async function loader() {
  const queryClient = new QueryClient()

  await queryClient
    .query({
      queryKey: ['posts'],
      queryFn: getPosts,
    })
    .catch(noop)

  return json({ dehydratedState: dehydrate(queryClient) })
}

function Posts() {
  // ဒီ useQuery က <PostsRoute> ရဲ့ ပိုနက်တဲ့ child တစ်ခုခုမှာ ဖြစ်နိုင်ပါတယ်
  // ဘယ်လိုပဲ ဖြစ်ဖြစ် data က ချက်ချင်း ရနိုင်ပါလိမ့်မယ်
  const { data } = useQuery({ queryKey: ['posts'], queryFn: getPosts })

  // ဒီ query က server မှာ prefetch မဖြစ်ခဲ့ဘူး — client ပေါ်မှာမှ
  // fetch စတင်ပါမယ်၊ pattern နှစ်ခုလုံး ရောသုံးလို့ ရပါတယ်
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  })

  // ...
}

export default function PostsRoute() {
  const { dehydratedState } = useLoaderData<typeof loader>()
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  )
}
```

## Optional — Boilerplate ဖယ်ရှားခြင်း

ဒီအပိုင်းကို route တိုင်းမှာ ထည့်ရတာက boilerplate တွေ အများကြီးလိုသလို ထင်ရနိုင်ပါတယ်:

```tsx
export default function PostsRoute({ dehydratedState }) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <Posts />
    </HydrationBoundary>
  )
}
```

ဒီ approach မှာ ဘာမှားလို့ မရှိပါဘူး — ဒါပေမယ့် ဒီ boilerplate ကို ဖယ်ချင်တယ်ဆိုရင် Next.js မှာ သင့် setup ကို ဒီလို ပြင်ဆင်နိုင်ပါတယ်:

```tsx
// _app.tsx
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </HydrationBoundary>
    </QueryClientProvider>
  )
}

// pages/posts.tsx
// HydrationBoundary ပါတဲ့ PostsRoute ကို ဖယ်ပြီး Posts ကို တိုက်ရိုက် export လုပ်ပါ:
export default function Posts() { ... }
```

Remix နဲ့တော့ နည်းနည်း ပိုပြီး ပါဝင်ပတ်သက်မှု ရှိပါတယ် — [use-dehydrated-state](https://github.com/maplegrove-io/use-dehydrated-state) package ကို ကြည့်ဖို့ အကြံပြုပါတယ်။

## Dependent queries တွေကို prefetch လုပ်ခြင်း

Prefetching guide ထဲမှာ [dependent queries တွေကို prefetch လုပ်နည်း](/docs/tanstack-query/prefetching#dependent-queries-code-splitting) ကို လေ့လာခဲ့ပြီးပါပြီ — ဒါပေမယ့် framework loaders တွေထဲမှာရော ဘယ်လို လုပ်မလဲ။ [Dependent Queries guide](/docs/tanstack-query/dependent-queries) ကနေ ယူထားတဲ့ အောက်က code ကို စဉ်းစားကြည့်ပါ:

```tsx
// User ကို ယူမယ်
const { data: user } = useQuery({
  queryKey: ['user', email],
  queryFn: getUserByEmail,
})

const userId = user?.id

// ပြီးတော့ user ရဲ့ projects တွေကို ယူမယ်
const {
  status,
  fetchStatus,
  data: projects,
} = useQuery({
  queryKey: ['projects', userId],
  queryFn: getProjectsByUser,
  // userId ရှိမှသာ query က execute ဖြစ်ပါမယ်
  enabled: !!userId,
})
```

ဒါကို server render ဖြစ်အောင် prefetch လုပ်ဖို့ ဘယ်လို လုပ်မလဲ။ ဥပမာ ဒီလိုပါ:

```tsx
// Remix အတွက်ဆိုရင် ဒါကို loader လို့ အမည်ပြောင်းပါ
export async function getServerSideProps() {
  const queryClient = new QueryClient()

  const user = await queryClient.query({
    queryKey: ['user', email],
    queryFn: getUserByEmail,
  })

  if (user?.userId) {
    await queryClient.query({
      queryKey: ['projects', userId],
      queryFn: getProjectsByUser,
    })
  }

  // For Remix:
  // return json({ dehydratedState: dehydrate(queryClient) })
  return { props: { dehydratedState: dehydrate(queryClient) } }
}
```

ဒါက တကယ်တော့ ပိုရှုပ်ထွေးလာနိုင်ပါတယ် — ဒါပေမယ့် ဒီ loader functions တွေက JavaScript သက်သက်မို့ — သင့် logic ကို ဆောက်ဖို့ ဘာသာစကားရဲ့ စွမ်းအား အပြည့်ကို သုံးနိုင်ပါတယ်။ Server render ဖြစ်စေချင်တဲ့ queries တွေ အားလုံးကို prefetch လုပ်ဖို့ သေချာပါစေ။

## Error ကိုင်တွယ်ခြင်း

React Query က default အနေနဲ့ graceful degradation (တဖြည်းဖြည်း လျှော့ချသွားတဲ့) strategy ကို သုံးပါတယ်။ ဆိုလိုတာက:

- `dehydrate(...)` က အောင်မြင်တဲ့ queries တွေကိုသာ ထည့်သွင်းပြီး — မအောင်မြင်တဲ့ဟာတွေကို မထည့်ပါဘူး
- error တွေကို မျိုချဖို့ `void queryClient.query(...)` ကနေ ပြန်လာတဲ့ promise ကို ရည်ရွယ်ချက်ရှိရှိ ignore လုပ်ပြီး `.catch(noop)` ကို ထည့်နိုင်ပါတယ် — ဒါကြောင့် ဝန်းကျင်က loader code က query errors တွေကို မမြင်ရပါဘူး

ဒါက မအောင်မြင်တဲ့ queries တွေ အားလုံးကို client မှာ retry လုပ်စေပြီး — server-rendered output မှာ content အပြည့်အစုံ အစား loading states တွေ ပါဝင်စေပါလိမ့်မယ်။

ဒါက ကောင်းတဲ့ default တစ်ခု ဖြစ်ပေမယ့် — တခါတလေ သင်လိုချင်တာ ဒါမဟုတ်ပါဘူး။ အရေးကြီးတဲ့ content ပျောက်နေတဲ့အခါ — အခြေအနေပေါ် မူတည်ပြီး 404 ဒါမှမဟုတ် 500 status code နဲ့ ပြန်ဖို့ လိုချင်နိုင်ပါတယ်။ ဒီလိုအခြေအနေတွေအတွက် — noop catch မပါဘဲ `await queryClient.query(...)` ကို သုံးပါ။ ဒါက မအောင်မြင်တဲ့အခါ error တွေကို throw လုပ်ပြီး — သင့်တော်တဲ့ နည်းနဲ့ ကိုင်တွယ်နိုင်စေပါလိမ့်မယ်။

```tsx
let result

try {
  result = await queryClient.query(...)
} catch (error) {
  // Error ကို ကိုင်တွယ်ပါ — သင့် framework ရဲ့ documentation ကို ကိုးကားပါ
}

// ဒီနေရာမှာ invalid ဖြစ်နေတဲ့ `result` တွေကိုလည်း စစ်ပြီး ကိုင်တွယ်ချင်နိုင်ပါတယ်
```

အကြောင်းတစ်ခုခုကြောင့် retries တွေကို ရှောင်ဖို့ မအောင်မြင်တဲ့ queries တွေကို dehydrated state ထဲ ထည့်ချင်ရင် — default function ကို override လုပ်ပြီး ကိုယ်ပိုင် logic ရေးဖို့ `shouldDehydrateQuery` option ကို သုံးနိုင်ပါတယ်:

```tsx
dehydrate(queryClient, {
  shouldDehydrateQuery: (query) => {
    // ဒါက queries တွေ အားလုံးကို ထည့်ပါမယ် — မအောင်မြင်တဲ့ဟာတွေ အပါအဝင်၊
    // ဒါပေမယ့် `query` ကို စစ်ဆေးပြီး ကိုယ်ပိုင် logic လည်း ရေးနိုင်ပါတယ်
    return true
  },
})
```

## Serialization (စီရီရယ်လိုက်ဇေးရှင်း)

Next.js မှာ `return { props: { dehydratedState: dehydrate(queryClient) } }` လုပ်တဲ့အခါ ဒါမှမဟုတ် Remix မှာ `return json({ dehydratedState: dehydrate(queryClient) })` လုပ်တဲ့အခါ — ဖြစ်ပျက်တာက `queryClient` ရဲ့ `dehydratedState` ကိုယ်စားပြုမှုကို framework က serialize လုပ်ပြီး — markup ထဲမှာ ထည့်သွင်းကာ client ဆီ ပို့ဆောင်ပေးပါတယ်။

Default အနေနဲ့ — ဒီ frameworks တွေက ဘေးကင်းစွာ serializable/parsable ဖြစ်တဲ့ အရာတွေကိုသာ ပြန်ပို့ဖို့ ထောက်ပံ့ပေးတာမို့ — `undefined`, `Error`, `Date`, `Map`, `Set`, `BigInt`, `Infinity`, `NaN`, `-0`, regular expressions စတာတွေကို မထောက်ပံ့ပါဘူး။ ဆိုလိုတာက — ဒီအရာတွေထဲက ဘယ်ဟာကိုမဆို သင့် queries တွေကနေ return လုပ်လို့ မရပါဘူး။ ဒီ values တွေကို return လုပ်ချင်တယ်ဆိုရင် — [superjson](https://github.com/blitz-js/superjson) ဒါမှမဟုတ် အလားတူ packages တွေကို ကြည့်ပါ။

Custom SSR setup သုံးနေတယ်ဆိုရင် — ဒီ step ကို ကိုယ်တိုင် ဂရုစိုက်ရပါမယ်။ ပထမဆုံး စိတ်ကူးရတတ်တာက `JSON.stringify(dehydratedState)` သုံးဖို့ပါ — ဒါပေမယ့် ဒါက `<script>alert('Oh no..')</script>` လို အရာတွေကို default အနေနဲ့ escape မလုပ်ပေးတာမို့ — သင့် application မှာ **XSS-vulnerabilities** (XSS အားနည်းချက်များ) ကို အလွယ်တကူ ဖြစ်စေနိုင်ပါတယ်။ [superjson](https://github.com/blitz-js/superjson) ကလည်း values တွေကို **escape မလုပ်ပေးတဲ့အတွက်** — custom SSR setup မှာ တစ်ခုတည်း သုံးဖို့ မလုံခြုံပါဘူး (output ကို escape လုပ်တဲ့ အပို step တစ်ခု ထည့်မထားရင်)။ အဲဒီအစား — [Serialize JavaScript](https://github.com/yahoo/serialize-javascript) ဒါမှမဟုတ် [devalue](https://github.com/Rich-Harris/devalue) လို library တွေကို သုံးဖို့ အကြံပြုပါတယ် — ဒီနှစ်ခုလုံးက XSS injections တွေကနေ out of the box ဘေးကင်းပါတယ်။

## Request waterfalls အကြောင်း မှတ်ချက်

[Performance & Request Waterfalls guide](/docs/tanstack-query/request-waterfalls) မှာ — server rendering က ပိုရှုပ်ထွေးတဲ့ nested waterfalls တစ်ခုကို ဘယ်လို ပြောင်းလဲပေးလဲဆိုတာ ပြန်လည် လေ့လာမယ်လို့ ကျွန်တော်တို့ ပြောခဲ့ပါတယ်။ [သီးခြား code ဥပမာ](/docs/tanstack-query/request-waterfalls#code-splitting) ကို ပြန်ကြည့်ပါ — ပြန်မှတ်မိအောင် ပြောရရင် — `<Feed>` component တစ်ခုထဲမှာ code-split လုပ်ထားတဲ့ `<GraphFeedItem>` component တစ်ခု ရှိပါတယ်။ Feed ထဲမှာ graph item ပါမှသာ ဒါက render ဖြစ်ပြီး — ဒီ component နှစ်ခုလုံးက သူတို့ရဲ့ ကိုယ်ပိုင် data တွေကို fetch လုပ်ပါတယ်။ Client rendering နဲ့ဆိုရင် ဒီလို request waterfall ဖြစ်ပါတယ်:

```
1. |> Markup (without content)
2.   |> JS for <Feed>
3.     |> getFeed()
4.       |> JS for <GraphFeedItem>
5.         |> getGraphDataById()
```

Server rendering ရဲ့ ကောင်းတဲ့အချက်က — အပေါ်က ပုံစံကို ဒီလို ပြောင်းလို့ရတာပါ:

```
1. |> Markup (with content AND initial data)
2.   |> JS for <Feed>
2.   |> JS for <GraphFeedItem>
```

Queries တွေက client မှာ မရှိတော့ဘဲ — သူတို့ရဲ့ data တွေက markup ထဲမှာ ပါဝင်နေတာကို သတိပြုပါ။ JS တွေကို ဒီကနေ parallel ဖြစ်အောင် load လုပ်နိုင်တဲ့ အကြောင်းရင်းက — `<GraphFeedItem>` ကို server မှာ render လုပ်ခဲ့လို့ client မှာလည်း ဒီ JS လိုမယ်ဆိုတာ သိပြီး — ဒီ chunk အတွက် script-tag တစ်ခုကို markup ထဲမှာ ထည့်နိုင်လို့ပါ။ Server မှာတော့ — ဒီ request waterfall က ဆက်ရှိနေပါဦးမယ်:

```
1. |> getFeed()
2.   |> getGraphDataById()
```

Feed ကို fetch လုပ်ပြီးမှသာ graph data ကိုပါ fetch ဖို့ လိုမလိုဆိုတာ သိနိုင်တာမို့ — ဒါတွေက dependent queries တွေပါ။ ဒါက server ပေါ်မှာ ဖြစ်တာမို့ — latency က ယေဘုယျအားဖြင့် ပိုနည်းပြီး ပိုတည်ငြိမ်တာကြောင့် — ဒါက သိပ်ပြီး ကိစ္စမကြီးလှပါဘူး။

အံ့သြစရာကောင်းတာက — ကျွန်တော်တို့ရဲ့ waterfalls တွေကို အများကြီး ပြားချပ်အောင် လုပ်နိုင်ခဲ့ပါပြီ! ဒါပေမယ့် ပြဿနာတစ်ခု ရှိပါသေးတယ်။ ဒီ page ကို `/feed` page လို့ ခေါ်ပြီး — `/posts` လို နောက်ထပ် page တစ်ခုလည်း ရှိတယ်လို့ ယူဆကြည့်ပါ။ URL bar ထဲမှာ `www.example.com/feed` ကို တိုက်ရိုက် ရိုက်ပြီး enter ခေါက်လိုက်ရင် — ဒီ server rendering အကျိုးကျေးဇူးတွေ အားလုံး ရပါတယ်။ ဒါပေမယ့် — `www.example.com/posts` ကို ရိုက်ပြီး `/feed` ဆီ **link တစ်ခုကို click** လုပ်လိုက်ရင်တော့ — ဒီပုံစံကို ပြန်ရောက်သွားပါတယ်:

```
1. |> JS for <Feed>
2.   |> getFeed()
3.     |> JS for <GraphFeedItem>
4.       |> getGraphDataById()
```

ဒါက — SPA တွေမှာ server rendering က ပထမဆုံး page load အတွက်သာ အလုပ်လုပ်ပြီး — နောက်ဆက်တွဲ navigation တွေအတွက် မဟုတ်လို့ပါ။

Modern frameworks တွေက ဒါကို — initial code နဲ့ data တွေကို parallel ဖြစ်အောင် fetch လုပ်ပြီး ဖြေရှင်းဖို့ ကြိုးစားတတ်ပါတယ်။ ဒါကြောင့် ဒီ guide မှာ ဖော်ပြထားတဲ့ prefetching patterns တွေ (dependent queries တွေကို prefetch လုပ်နည်း အပါအဝင်) နဲ့ Next.js ဒါမှမဟုတ် Remix ကို သုံးနေရင် — တကယ်တော့ ဒီလိုပုံစံ ဖြစ်ပါလိမ့်မယ်:

```
1. |> JS for <Feed>
1. |> getFeed() + getGraphDataById()
2.   |> JS for <GraphFeedItem>
```

ဒါက ပိုကောင်းပါတယ် — ဒါပေမယ့် ဒီထက်ပိုပြီး မြှင့်တင်ချင်ရင်တော့ Server Components တွေနဲ့ roundtrip တစ်ခုတည်း (single roundtrip) အဖြစ် ပြားချပ်အောင် လုပ်နိုင်ပါတယ်။ [Advanced Server Rendering guide](/docs/tanstack-query/advanced-ssr) မှာ ဘယ်လိုလုပ်ရမလဲ လေ့လာပါ။

## အကြံပြုချက်များ၊ နည်းလမ်းများနဲ့ သတိထားစရာများ

### Staleness ကို query ကို server မှာ fetch လုပ်ခဲ့တဲ့ အချိန်ကနေ တိုင်းတာခြင်း

Query တစ်ခုကို stale အဖြစ် သတ်မှတ်တာက — ဘယ်အချိန်မှာ `dataUpdatedAt` ဖြစ်ခဲ့လဲဆိုတာပေါ် မူတည်ပါတယ်။ ဒီနေရာမှာ သတိထားစရာက — ဒါက မှန်ကန်စွာ အလုပ်လုပ်ဖို့ server မှာ မှန်ကန်တဲ့ အချိန် ရှိဖို့ လိုပါတယ်။ ဒါပေမယ့် UTC time ကို သုံးတာမို့ — timezones တွေက ဒီထဲမှာ ပါဝင်ပတ်သက်မှု မရှိပါဘူး။

`staleTime` က default `0` ဖြစ်တာကြောင့် — queries တွေက page load လုပ်တာနဲ့ default အနေနဲ့ background မှာ refetch ခံရပါလိမ့်မယ်။ ဒီ double fetching (နှစ်ထပ် fetch) ကို ရှောင်ချင်ရင် — အထူးသဖြင့် သင့် markup ကို cache မလုပ်ထားဘူးဆိုရင် — `staleTime` ကို ပိုမြင့်တဲ့တန်ဖိုး သုံးချင်ပါလိမ့်မယ်။

Stale queries တွေကို ဒီလို refetch လုပ်တာက — markup ကို CDN မှာ cache လုပ်တဲ့အခါ အကောင်းဆုံး ကိုက်ညီမှု ရှိပါတယ်! Page ရဲ့ cache time ကို မြင့်မြင့် ထားပြီး — server မှာ page တွေကို ပြန်ပြန် render လုပ်ရတာကို ရှောင်နိုင်ပေမယ့် — queries တွေရဲ့ `staleTime` ကို နိမ့်နိမ့် ထားပြီး — user တစ်ယောက် page ကို လာလည်တာနဲ့ data ကို background မှာ refetch လုပ်ဖို့ သေချာစေနိုင်ပါတယ်။ Page တွေကို တစ်ပတ်လောက် cache လုပ်ချင်ပေမယ့် — data က တစ်ရက်ထက် ပိုဟောင်းနေရင် page load မှာ အလိုအလျောက် refetch လုပ်စေချင်လား?

### ဆာဗာမှာ memory အသုံးပြုမှု မြင့်မားခြင်း

Request တိုင်းအတွက် `QueryClient` ဖန်တီးနေတယ်ဆိုရင် — React Query က ဒီ client အတွက် သီးခြား cache ကို ဖန်တီးပြီး — အဲဒါက `gcTime` period အတွင်း memory ထဲမှာ ထိန်းသိမ်းထားပါတယ်။ အဲဒီကာလအတွင်း request အရေအတွက် များရင် — server မှာ memory အသုံးပြုမှု မြင့်မားလာနိုင်ပါတယ်။

Server ပေါ်မှာ `gcTime` က default `Infinity` ဖြစ်ပြီး — manual garbage collection ကို disable လုပ်ကာ request တစ်ခု ပြီးသွားတာနဲ့ memory ကို အလိုအလျောက် ရှင်းပေးပါတယ်။ `Infinity` မဟုတ်တဲ့ `gcTime` ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ထားရင် — cache ကို စောစောစီးစီး ရှင်းဖို့ သင့်တာဝန် ဖြစ်ပါလိမ့်မယ်။

`gcTime` ကို `0` လို့ မသတ်မှတ်ပါနဲ့ — hydration error ဖြစ်နိုင်လို့ပါ။ ဒါက — [Hydration Boundary](https://tanstack.com/query/latest/docs/reference/hydration#hydrationboundary) က rendering အတွက် လိုအပ်တဲ့ data တွေကို cache ထဲမှာ ထားပေးပေမယ့် — garbage collector က rendering မပြီးခင် data ကို ဖယ်ရှားလိုက်ရင် ပြဿနာတွေ ဖြစ်လာနိုင်လို့ပါ။ ပိုတိုတဲ့ `gcTime` လိုတယ်ဆိုရင် — app က data ကို ကိုးကားဖို့ အချိန်အလုံအလောက် ရစေဖို့ `2 * 1000` လို့ သတ်မှတ်ဖို့ အကြံပြုပါတယ်။

Cache မလိုတော့တဲ့အခါ ရှင်းပြီး memory အသုံးပြုမှု လျှော့ချဖို့ — request ကို ကိုင်တွယ်ပြီး dehydrated state ကို client ဆီ ပို့လိုက်ပြီးနောက် [`queryClient.clear()`](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientclear) ကို ခေါ်နိုင်ပါတယ်။

တနည်းအားဖြင့် — `gcTime` ကို ပိုသေးတဲ့တန်ဖိုး သတ်မှတ်နိုင်ပါတယ်။

### Next.js rewrites အတွက် သတိထားစရာ

[Next.js ရဲ့ rewrites feature](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites) ကို [Automatic Static Optimization](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization) ဒါမှမဟုတ် `getStaticProps` နဲ့ တွဲသုံးနေတယ်ဆိုရင် သတိထားစရာ ရှိပါတယ်: ဒါက React Query ကနေ ဒုတိယမြောက် hydration တစ်ခု ဖြစ်စေပါလိမ့်မယ်။ ဘာကြောင့်လဲဆိုတော့ — [Next.js က rewrites တွေကို client မှာ parse လုပ်ဖို့ လိုပြီး](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites#rewrite-parameters) — hydration ပြီးနောက် params တွေ အားလုံးကို စုဆောင်းပြီး `router.query` မှာ ထည့်ပေးနိုင်ဖို့ပါ။

ရလဒ်က — hydration data အားလုံးအတွက် referential equality ပျောက်ဆုံးသွားတာပါ — ဥပမာ သင့် data ကို components တွေရဲ့ props အဖြစ် ဒါမှမဟုတ် `useEffect`/`useMemo` တွေရဲ့ dependency array တွေထဲမှာ သုံးတဲ့ နေရာတိုင်းမှာ ဒါက trigger ဖြစ်စေပါတယ်။
