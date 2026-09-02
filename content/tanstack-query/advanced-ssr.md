---
title: "Advanced Server Rendering (အဆင့်မြင့် Server Rendering)"
description: "React Query ကို streaming, Server Components နဲ့ Next.js app router နဲ့ သုံးနည်း — prefetching & de/hydrating data, nested Server Components, data ownership & revalidation, experimental streaming, persist adapter"
order: 33
source: "https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr"
status: translated
updated: 2026-09-01
---

Advanced Server Rendering guide မှ ကြိုဆိုပါတယ် — ဒီမှာ React Query ကို streaming၊ Server Components နဲ့ Next.js app router တွေနဲ့ ဘယ်လို သုံးရမလဲဆိုတာ အကုန်လုံး လေ့လာရပါမယ်။

ဒီ guide မဖတ်ခင် [Server Rendering & Hydration guide](/docs/tanstack-query/ssr) ကို အရင်ဖတ်ချင်ပါလိမ့်မယ် — ဘာကြောင့်လဲဆိုတော့ အဲဒီမှာ React Query ကို SSR နဲ့ သုံးခြင်းရဲ့ အခြေခံတွေကို သင်ပေးထားလို့ပါ — [Performance & Request Waterfalls](/docs/tanstack-query/request-waterfalls) နဲ့ [Prefetching & Router Integration](/docs/tanstack-query/prefetching) တွေကလည်း အဖိုးတန်တဲ့ နောက်ခံ အကြောင်းအရာတွေ ပါဝင်ပါတယ်။

မစတင်ခင်မှာ — SSR guide မှာ ဖော်ပြထားတဲ့ `initialData` approach က Server Components တွေနဲ့လည်း အလုပ်လုပ်တယ်ဆိုတာ မှတ်သားထားပါ — ဒါပေမယ့် ကျွန်တော်တို့ ဒီ guide မှာတော့ hydration APIs တွေကို အဓိကထား လေ့လာပါမယ်။

## Server Components နဲ့ Next.js app router

Server Components တွေကို ဒီမှာ အသေးစိတ် မဖော်ပြတော့ပါဘူး — ဒါပေမယ့် အတိုချုပ် ပြောရရင် — ဒါတွေက server ပေါ်မှာသာ _ပဲ_ run မယ်လို့ အာမခံထားတဲ့ components တွေပါ — ကနဦး page view အတွက်ရော page transitions တွေမှာပါ။ ဒါက Next.js ရဲ့ `getServerSideProps`/`getStaticProps` နဲ့ Remix ရဲ့ `loader` တွေ အလုပ်လုပ်ပုံနဲ့ ဆင်တူပါတယ် — ဒါတွေကလည်း server ပေါ်မှာ အမြဲ run ပြီး — ဒါပေမယ့် အဲဒီဟာတွေက data ကိုပဲ return လုပ်လို့ ရပေမယ့် Server Components တွေကတော့ အများကြီး ပိုလုပ်နိုင်ပါတယ်။ ဒါပေမယ့် React Query အတွက်တော့ data အပိုင်းက အဓိကပါ — ဒါကြောင့် ဒါကို အဓိကထား ကြည့်ရအောင်။

Server Rendering guide ထဲက [framework loaders တွေထဲမှာ prefetch လုပ်ထားတဲ့ data တွေကို app ဆီ ပို့နည်း](/docs/tanstack-query/ssr) ကို Server Components နဲ့ Next.js app router မှာ ဘယ်လို အသုံးချမလဲ။ စဉ်းစားဖို့ အကောင်းဆုံး နည်းလမ်းက — Server Components တွေကို "ပုံမှန်" framework loader တစ်ခုလိုပဲ သဘောထားဖို့ပါ။

### ဝေါဟာရအကြောင်း အမြန် မှတ်ချက်

ဒီ guides တွေထဲမှာ ကျွန်တော်တို့က _server_ နဲ့ _client_ အကြောင်း ပြောနေပါတယ်။ စိတ်ရှုပ်စရာကောင်းတာက — ဒါက _Server Components_ နဲ့ _Client Components_ တို့နဲ့ 1-1 တိုက်ဆိုင်မှု မရှိဘူးဆိုတာ သတိပြုဖို့ အရေးကြီးပါတယ်။ Server Components တွေက server ပေါ်မှာသာ run မယ်လို့ အာမခံပေမယ့် — Client Components တွေကတော့ နေရာနှစ်ခုလုံးမှာ တကယ် run နိုင်ပါတယ်။ ဒါဖြစ်ရတဲ့ အကြောင်းရင်းက — သူတို့ကလည်း ကနဦး _server rendering_ pass အတွင်းမှာ render လုပ်နိုင်လို့ပါ။

ဒါကို စဉ်းစားနိုင်တဲ့ နည်းတစ်နည်းက — Server Components တွေကလည်း _render_ လုပ်ပေမယ့် — သူတို့က "loader phase" (server ပေါ်မှာ အမြဲ ဖြစ်ပွားတဲ့) အတွင်းမှာ ဖြစ်ပြီး — Client Components တွေကတော့ "application phase" အတွင်းမှာ run ပါတယ်။ အဲဒီ application က SSR အတွင်းမှာ server ပေါ်မှာ ဖြစ်စေ၊ ဥပမာ browser တစ်ခုထဲမှာ ဖြစ်စေ run နိုင်ပါတယ်။ အဲဒီ application က အတိအကျ ဘယ်မှာ run လဲဆိုတာနဲ့ SSR အတွင်းမှာ run လား မလားဆိုတာကတော့ framework တွေကြားမှာ ကွဲပြားနိုင်ပါတယ်။

### ကနဦး Setup

ဘယ် React Query setup ရဲ့မဆို ပထမဆုံး step ကတော့ — `queryClient` တစ်ခု ဖန်တီးပြီး သင့် application ကို `QueryClientProvider` နဲ့ ထုပ်ဖို့ပါ။ Server Components တွေနဲ့ဆိုရင် — ဒါက framework တွေကြားမှာ အများအားဖြင့် တူညီပြီး — file naming conventions မှာတော့ ကွာခြားချက် တစ်ခု ရှိပါတယ်:

```tsx
// In Next.js, this file would be called: app/providers.tsx
'use client'

// QueryClientProvider က useContext ကို အောက်ခံမှာ သုံးလို့ — ထိပ်မှာ 'use client' ထည့်ရပါမယ်
import {
  environmentManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (environmentManager.isServer()) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
```

```tsx
// In Next.js, this file would be called: app/layout.tsx
import Providers from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

ဒီအပိုင်းက SSR guide မှာ လုပ်ခဲ့တာနဲ့ အတော်လေး ဆင်ပါတယ် — file နှစ်ခုအဖြစ် ခွဲထားဖို့ပဲ လိုပါတယ်။

### Data တွေကို Prefetch လုပ်ပြီး de/hydrate လုပ်ခြင်း

နောက်တစ်ခု — data တွေကို တကယ် prefetch လုပ်ပြီး dehydrate နဲ့ hydrate လုပ်ပုံကို ကြည့်ရအောင်။ **Next.js Pages Router** နဲ့ဆိုရင် ဒီလို ပုံစံ ဖြစ်ပါတယ်:

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
  //
  // ဒီမှာ useSuspenseQuery အစား useQuery ကို သုံးနေတာ သတိပြုပါ။
  // ဒီ data ကို prefetch လုပ်ပြီးပြီမို့ — component ထဲမှာ
  // suspend ဖြစ်စရာ မလိုပါဘူး။ Prefetch ကို မေ့သွားရင် ဒါမှမဟုတ်
  // ဖယ်လိုက်ရင် — ဒါက client ပေါ်မှာ data ကို fetch လုပ်မှာဖြစ်ပြီး —
  // useSuspenseQuery သုံးရင် ပိုဆိုးတဲ့ side effects တွေ ရှိမှာပါ။
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

ဒါကို app router ဆီ ပြောင်းတာကလည်း တကယ်တော့ အတော်လေး ဆင်ပါတယ် — အရာတွေကို နည်းနည်း နေရာရွှေ့ဖို့ပဲ လိုပါတယ်။ ပထမဆုံး — prefetching အပိုင်းကို လုပ်ဖို့ Server Component တစ်ခု ဖန်တီးပါမယ်:

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Posts from './posts'

export default async function PostsPage() {
  const queryClient = new QueryClient()

  await queryClient
    .query({
      queryKey: ['posts'],
      queryFn: getPosts,
    })
    .catch(noop)

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

နောက်တစ်ခု — Client Component အပိုင်းက ဘယ်လို ပုံစံ ဖြစ်လဲ ကြည့်ရအောင်:

```tsx
// app/posts/posts.tsx
'use client'

export default function Posts() {
  // ဒီ useQuery က <Posts> ရဲ့ ပိုနက်တဲ့ child တစ်ခုခုမှာ ဖြစ်နိုင်ပါတယ်
  // ဘယ်လိုပဲ ဖြစ်ဖြစ် data က ချက်ချင်း ရနိုင်ပါလိမ့်မယ်
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  })

  // ဒီ query က server မှာ prefetch မဖြစ်ခဲ့ဘူး — client ပေါ်မှာမှ
  // fetch စတင်ပါမယ်၊ pattern နှစ်ခုလုံး ရောသုံးလို့ ရပါတယ်
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  })

  // ...
}
```

အပေါ်က ဥပမာတွေရဲ့ ကောင်းတဲ့အချက်တစ်ခုက — Next.js-specific ဖြစ်တဲ့အရာက file names တွေပဲ ဖြစ်ပြီး — ကျန်တဲ့အရာအားလုံးက Server Components ကို ထောက်ပံ့တဲ့ ဘယ် framework မှာမဆို အတူတူပဲ ဖြစ်ပါလိမ့်မယ်။

SSR guide ထဲမှာ — route တိုင်းမှာ `<HydrationBoundary>` ပါတဲ့ boilerplate ကို ဖယ်ရှားလို့ ရတယ်လို့ ကျွန်တော်တို့ မှတ်ချက်ပြုခဲ့ပါတယ်။ Server Components တွေနဲ့တော့ ဒါက မဖြစ်နိုင်ပါဘူး။

> NOTE: TypeScript ဗားရှင်း `5.1.3` အောက်နဲ့ `@types/react` ဗားရှင်း `18.2.8` အောက်တွေနဲ့ async Server Components သုံးတဲ့အခါ type error ကြုံရရင် — နှစ်ခုလုံးကို နောက်ဆုံးထွက် ဗားရှင်းတွေအထိ update လုပ်ဖို့ အကြံပြုပါတယ်။ တနည်းအားဖြင့် — ဒီ component ကို တခြား component တစ်ခုထဲမှာ ခေါ်တဲ့အခါ `{/* @ts-expect-error Server Component */}` ထည့်တဲ့ ယာယီ workaround ကို သုံးနိုင်ပါတယ်။ အသေးစိတ်အတွက် Next.js TypeScript docs ထဲက [Async Server Component TypeScript Error](https://nextjs.org/docs/app/building-your-application/configuring/typescript#async-server-component-typescript-error) ကို ကြည့်ပါ။

> WARNING: `queryFn` ထဲမှာ data _fetch_ လုပ်ဖို့ Next.js Server Actions တွေကို သုံးဖို့ ကျွန်တော်တို့ **အကြံမပြုပါဘူး**။ Client ကနေ ခေါ်တဲ့အခါ Server Actions တွေက [serial ဖြစ်ပြီး parallel မဟုတ်ဘဲ run ပါတယ်](https://react.dev/reference/rsc/use-server#caveats) — ဒါက React Query ရဲ့ queries တွေကို fetch/refetch လုပ်ပုံနဲ့ ဆန့်ကျင်ပါတယ်။ ဒါက queries တွေကို pending state ထဲမှာ ပိတ်မိစေနိုင်သလို — action ကို လုံးဝ run မဖြစ်အောင်လည်း လုပ်နိုင်ပါတယ် ([#7934](https://github.com/TanStack/query/issues/7934) ကြည့်ပါ)။ Server Action reference တစ်ခုကို `queryFn` ဆီ ပေးတာကလည်း — `Only plain objects, and a few built-ins, can be passed to Server Actions...` ဆိုတဲ့ error နဲ့ ရှုံးနိုင်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ reference အဖြစ် ပေးလိုက်တာထက် action ကို _call_ လုပ်ဖို့ လိုလို့ပါ ([#6264](https://github.com/TanStack/query/issues/6264) ကြည့်ပါ)။ Client ပေါ်မှာ data fetch လုပ်ဖို့ဆိုရင် — API route ကနေ `fetch` သုံးပါ ဒါမှမဟုတ် tRPC လို RPC layer တစ်ခုကို သုံးပါ။ Server Actions တွေကတော့ **mutations** (`useMutation`) တွေအတွက် ကောင်းမွန်တဲ့ ရွေးချယ်မှုတစ်ခု ဆက်ဖြစ်နေပါတယ်။

### Server Components တွေကို nesting လုပ်ခြင်း

Server Components တွေရဲ့ ကောင်းတဲ့အချက်က — သူတို့က React tree ထဲမှာ နေရာအမျိုးမျိုး၊ အဆင့်မျိုးစုံမှာ ရှိနိုင်ပြီး — application ရဲ့ ထိပ်ဆုံးမှာတင်မဟုတ်ဘဲ data ကို တကယ်သုံးတဲ့ နေရာနဲ့ နီးနီးကပ်ကပ် prefetch လုပ်နိုင်လို့ပါ (Remix loaders တွေလိုပါပဲ)။ ဒါက Server Component တစ်ခုက နောက် Server Component တစ်ခုကို render လုပ်ရုံလောက် ရိုးရှင်းနိုင်ပါတယ် (ဒီဥပမာမှာ အတိုချုံးဖို့ Client Components တွေကို ချန်ထားပါမယ်):

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Posts from './posts'
import CommentsServerComponent from './comments-server'

export default async function PostsPage() {
  const queryClient = new QueryClient()

  await queryClient
    .query({
      queryKey: ['posts'],
      queryFn: getPosts,
    })
    .catch(noop)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
      <CommentsServerComponent />
    </HydrationBoundary>
  )
}

// app/posts/comments-server.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Comments from './comments'

export default async function CommentsServerComponent() {
  const queryClient = new QueryClient()

  await queryClient
    .query({
      queryKey: ['posts-comments'],
      queryFn: getComments,
    })
    .catch(noop)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Comments />
    </HydrationBoundary>
  )
}
```

မြင်ရတဲ့အတိုင်း — `<HydrationBoundary>` ကို နေရာမျိုးစုံမှာ သုံးတာ၊ prefetching အတွက် `queryClient` အများအပြား ဖန်တီးပြီး dehydrate လုပ်တာတွေ လုံးဝ အဆင်ပြေပါတယ်။

`CommentsServerComponent` ကို render မလုပ်ခင် `getPosts` ကို await လုပ်နေလို့ — ဒါက server side waterfall တစ်ခု ဖြစ်စေမယ်ဆိုတာ သတိပြုပါ:

```
1. |> getPosts()
2.   |> getComments()
```

Data ဆီ server latency နည်းရင် — ဒါက ပြဿနာကြီးကြီး မဟုတ်ပေမယ့် — ထောက်ပြဖို့တော့ တန်ပါတယ်။

Next.js မှာ — `page.tsx` ထဲမှာ data prefetch လုပ်တာအပြင် — `layout.tsx` နဲ့ [parallel routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes) တွေထဲမှာလည်း လုပ်နိုင်ပါတယ်။ ဒါတွေအားလုံးက routing ရဲ့ အစိတ်အပိုင်းတွေမို့ — Next.js က ဒါတွေအားလုံးကို parallel ဖြစ်အောင် fetch လုပ်နည်း သိပါတယ်။ ဒါကြောင့် အပေါ်က `CommentsServerComponent` ကို parallel route အဖြစ် ဖော်ပြလိုက်ရင် — waterfall က အလိုအလျောက် ပြားချပ်သွားပါလိမ့်မယ်။

Framework တွေ ပိုပိုပြီး Server Components တွေကို ထောက်ပံ့လာတာနဲ့အမျှ — သူတို့မှာ တခြား routing conventions တွေ ရှိနိုင်ပါတယ်။ အသေးစိတ်အတွက် သင့် framework ရဲ့ documentation တွေကို ဖတ်ပါ။

### ရွေးချယ်စရာ: Prefetching အတွက် `queryClient` တစ်ခုတည်း သုံးခြင်း

အပေါ်က ဥပမာမှာ — data fetch လုပ်တဲ့ Server Component တစ်ခုချင်းစီအတွက် `queryClient` အသစ်တစ်ခု ဖန်တီးခဲ့ပါတယ်။ ဒါက အကြံပြုထားတဲ့ approach ပါ — ဒါပေမယ့် သင်လိုချင်ရင် — Server Components အားလုံးကြားမှာ ပြန်သုံးတဲ့ queryClient တစ်ခုတည်းကိုလည်း ဖန်တီးနိုင်ပါတယ်:

```tsx
// app/getQueryClient.tsx
import { QueryClient } from '@tanstack/react-query'
import { cache } from 'react'

// cache() က request တစ်ခုချင်းစီအလိုက် scoped ဖြစ်လို့ — requests တွေကြားမှာ data မပေါက်ကြားပါဘူး
const getQueryClient = cache(() => new QueryClient())
export default getQueryClient
```

ဒီရဲ့ အကျိုးကျေးဇူးက — Server Component တစ်ခုကနေ ခေါ်ခံရတဲ့ ဘယ်နေရာမှာမဆို — utility functions တွေ အပါအဝင် — `getQueryClient()` ကို ခေါ်ပြီး ဒီ client ကို ရယူနိုင်တာပါ။ အားနည်းချက်ကတော့ — `dehydrate(getQueryClient())` ကို တစ်ခါတိုင်း ခေါ်တဲ့အခါ — အရင်က serialize လုပ်ပြီးသား၊ လက်ရှိ Server Component နဲ့ မဆိုင်တဲ့ queries တွေ အပါအဝင် — `queryClient` တစ်ခုလုံးကို serialize လုပ်တာမို့ — မလိုအပ်တဲ့ overhead ဖြစ်ပါတယ်။

Next.js က `fetch()` သုံးတဲ့ requests တွေကို dedupe လုပ်ပြီးသားပါ — ဒါပေမယ့် သင့် `queryFn` ထဲမှာ တခြားအရာတစ်ခုခု သုံးနေတယ်ဆိုရင် — ဒါမှမဟုတ် ဒီ requests တွေကို အလိုအလျောက် dedupe မလုပ်တဲ့ framework တစ်ခုကို သုံးနေတယ်ဆိုရင် — အပေါ်မှာ ဖော်ပြထားသလို `queryClient` တစ်ခုတည်း သုံးတာက — serialization နှစ်ထပ် ဖြစ်နေပေမယ့် — အဓိပ္ပာယ် ရှိနိုင်ပါတယ်။

> အနာဂတ် တိုးတက်မှုအနေနဲ့ — နောက်ဆုံး `dehydrateNew()` ခေါ်ပြီးကတည်းက _အသစ်_ ဖြစ်တဲ့ queries တွေကိုသာ dehydrate လုပ်မယ့် `dehydrateNew()` function (နာမည် မသေချာသေး) တစ်ခု ဖန်တီးဖို့ စဉ်းစားနေပါတယ်။ ဒါက စိတ်ဝင်စားစရာလို့ ထင်ပြီး ကူညီချင်တယ်ဆိုရင် ဆက်သွယ်ဖို့ လွတ်လပ်ပါတယ်!

### Data ownership နဲ့ revalidation

Server Components တွေနဲ့ဆိုရင် — data ownership (data ရဲ့ ပိုင်ဆိုင်မှု) နဲ့ revalidation အကြောင်း စဉ်းစားဖို့ အရေးကြီးပါတယ်။ ဘာကြောင့်လဲဆိုတာ ရှင်းပြဖို့ — အပေါ်က ဥပမာတစ်ခုရဲ့ ပြုပြင်ထားတဲ့ ဗားရှင်းကို ကြည့်ရအောင်:

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Posts from './posts'

export default async function PostsPage() {
  const queryClient = new QueryClient()

  // query ကနေ result ကို ရယူနေတာ သတိပြုပါ
  const posts = await queryClient.query({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* ဒါက အသစ် ထပ်ထည့်ထားတဲ့ အပိုင်းပါ */}
      <div>Nr of posts: {posts.length}</div>
      <Posts />
    </HydrationBoundary>
  )
}
```

အခုဆိုရင် `getPosts` query ကနေ data ကို Server Component တစ်ခုမှာရော Client Component တစ်ခုမှာပါ render လုပ်နေပါတယ်။ ကနဦး page render အတွက်တော့ ဒါက အဆင်ပြေပါလိမ့်မယ် — ဒါပေမယ့် `staleTime` ကျော်သွားတဲ့အခါ တစ်နည်းနည်းနဲ့ client ပေါ်မှာ query က revalidate လုပ်တဲ့အခါ ဘာဖြစ်မလဲ။

React Query က _Server Component ကို revalidate လုပ်နည်း_ လုံးဝ မသိပါဘူး — ဒါကြောင့် client ပေါ်မှာ data ကို refetch လုပ်ပြီး — posts တွေရဲ့ list ကို React က re-render လုပ်စေတဲ့အခါ — `Nr of posts: {posts.length}` က နောက်ကျကျန် (out of sync) ဖြစ်သွားပါလိမ့်မယ်။

React Query က ဘယ်တော့မှ revalidate မလုပ်အောင် `staleTime: Infinity` သတ်မှတ်ထားရင်တော့ ဒါက အဆင်ပြေပါတယ် — ဒါပေမယ့် React Query ကို ပထမနေရာမှာ သုံးနေတယ်ဆိုရင် ဒါက သင်လိုချင်တာ ဖြစ်ချင်မှ ဖြစ်ပါလိမ့်မယ်။

React Query ကို Server Components တွေနဲ့ သုံးတာ အဓိပ္ပာယ် အရှိဆုံး အခြေအနေတွေက:

- React Query သုံးနေတဲ့ app တစ်ခု ရှိပြီး — data fetching အားလုံးကို ပြန်မရေးဘဲ Server Components ဆီ migrate လုပ်ချင်တဲ့အခါ
- ရင်းနှီးပြီးသား programming paradigm တစ်ခု လိုချင်ပေမယ့် — အဓိပ္ပာယ်ရှိတဲ့ နေရာတွေမှာ Server Components တွေရဲ့ အကျိုးကျေးဇူးတွေကို ဖြန့်ဖြူးထည့်သွင်းချင်တဲ့အခါ
- React Query က ကာမိတဲ့ use case တစ်ခုခု ရှိပြီး — သင်ရွေးထားတဲ့ framework က မကာမိတဲ့အခါ

React Query ကို Server Components တွေနဲ့ တွဲသုံးတာ ဘယ်အချိန် အဓိပ္ပာယ်ရှိလဲ မရှိလဲဆိုတာ ယေဘုယျ အကြံဉာဏ် ပေးဖို့ ခက်ပါတယ်။ **Server Components app အသစ်တစ်ခု စတင်နေတယ်ဆိုရင် — သင့် framework က ပေးထားတဲ့ data fetching tools တွေနဲ့ စတင်ပြီး — React Query ကို တကယ်လိုအပ်တဲ့အထိ မယူလာဖို့ အကြံပြုပါတယ်။** အဲဒါ ဘယ်တော့မှ မလိုအပ်တာလည်း ဖြစ်နိုင်ပြီး — ဒါက ရပါတယ်၊ အလုပ်အတွက် မှန်ကန်တဲ့ tool ကို သုံးပါ!

သုံးမယ်ဆိုရင်တော့ — ကောင်းတဲ့ စည်းမျဉ်းတစ်ခုက — `queryClient.query` ရဲ့ result ကို server ပေါ်မှာ render လုပ်တာ ဒါမှမဟုတ် တခြား component တစ်ခုဆီ ပေးပို့တာကို ရှောင်ဖို့ပါ — Client Component တစ်ခုဆီတောင် မပို့ပါနဲ့။

React Query ရဲ့ ရှုထောင့်ကကြည့်ရင် — Server Components တွေကို data prefetch လုပ်ဖို့ နေရာတစ်ခုလို့ပဲ သဘောထားပါ — ဒါထက် ပိုမဟုတ်ပါဘူး။

ဟုတ်ပါတယ် — Server Components တွေက data တစ်ချို့ကို ပိုင်ဆိုင်ပြီး Client Components တွေက အခြား data တစ်ချို့ကို ပိုင်ဆိုင်တာ ရပါတယ် — ဒီ reality နှစ်ခု တစ်ခုနဲ့တစ်ခု နောက်ကျကျန် မဖြစ်အောင်ပဲ သေချာပါစေ။

## Server Components တွေနဲ့ Streaming

Next.js app router က application ရဲ့ ပြသဖို့ အသင့်ဖြစ်နေတဲ့ ဘယ်အပိုင်းကိုမဆို browser ဆီ တတ်နိုင်သမျှ အမြန်ဆုံး အလိုအလျောက် stream လုပ်ပြီး — ပြီးသွားတဲ့ content ကို ဆက်လုပ်နေဆဲ content တွေကို မစောင့်ဘဲ ချက်ချင်း ပြသနိုင်ပါတယ်။ ဒါကို `<Suspense>` boundary တွေရဲ့ မျဉ်းကြောင်းအတိုင်း လုပ်ပါတယ်။ `loading.tsx` file တစ်ခု ဖန်တီးလိုက်ရင် — ဒါက နောက်ကွယ်မှာ `<Suspense>` boundary တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးတယ်ဆိုတာ သတိပြုပါ။

အပေါ်မှာ ဖော်ပြထားတဲ့ prefetching patterns တွေနဲ့ဆိုရင် — React Query က ဒီလို streaming ပုံစံနဲ့ လုံးဝ လိုက်ဖက်ပါတယ်။ Suspense boundary တစ်ခုချင်းစီရဲ့ data တွေ ပြည့်စုံလာတာနဲ့ — Next.js က ပြီးသွားတဲ့ content ကို render ပြီး browser ဆီ stream လုပ်နိုင်ပါတယ်။ အပေါ်မှာ ဖော်ပြထားသလို `useQuery` သုံးနေရင်တောင် ဒါက အလုပ်လုပ်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ suspending ဖြစ်တာက prefetch ကို `await` လုပ်တဲ့အခါမှာ ဖြစ်လို့ပါ။

React Query v5.40.0 ကစပြီး — ဒါအလုပ်လုပ်ဖို့ prefetches တွေ အားလုံးကို `await` လုပ်စရာ မလိုတော့ပါဘူး — `pending` Queries တွေကိုလည်း dehydrate လုပ်ပြီး client ဆီ ပို့လို့ ရလို့ပါ။ ဒါက prefetches တွေကို Suspense boundary တစ်ခုလုံးကို မပိတ်ဆို့စေဘဲ တတ်နိုင်သမျှ စောစော စတင်စေပြီး — query ပြီးစီးတာနဲ့ _data_ ကို client ဆီ stream လုပ်ပေးပါတယ်။ ဥပမာ — user interaction တစ်ခုခုပြီးမှသာ မြင်ရမယ့် content တစ်ချို့ကို prefetch ချင်တာ ဒါမှမဟုတ် — infinite query ရဲ့ ပထမဆုံး page ကို `await` လုပ်ပြီး render လုပ်ချင်ပေမယ့် — rendering ကို မပိတ်ဆို့ဘဲ page 2 ကို prefetch စတင်ချင်တာမျိုးအတွက် အသုံးဝင်ပါတယ်။

ဒါအလုပ်လုပ်ဖို့ — `queryClient` ကို pending Queries တွေကိုပါ `dehydrate` လုပ်ဖို့ ညွှန်ကြားရပါမယ်။ ဒါကို global အနေနဲ့ ဖြစ်စေ — `dehydrate` ဆီ option ကို တိုက်ရိုက် ပေးခြင်းအားဖြင့် ဖြစ်စေ လုပ်နိုင်ပါတယ်။

ပြီးတော့ — `getQueryClient()` function ကို ကျွန်တော်တို့ရဲ့ `app/providers.tsx` file ထဲကနေ ဖယ်ထုတ်ဖို့လည်း လိုပါမယ် — ဘာကြောင့်လဲဆိုတော့ ဒါကို ကျွန်တော်တို့ရဲ့ server component ရော client provider ထဲမှာပါ သုံးချင်လို့ပါ။

```tsx
// app/get-query-client.ts
import {
  environmentManager,
  QueryClient,
  defaultShouldDehydrateQuery,
} from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
        shouldRedactErrors: (error) => {
          // Next.js server errors တွေကို ဖမ်းယူထား (catch) မထားသင့်ပါဘူး
          // ဘာကြောင့်လဲဆိုတော့ Next.js က dynamic pages တွေကို
          // ဒီနည်းနဲ့ သိရှိတာမို့ ဖြစ်လို့ပါ — ဒါကြောင့် redact မလုပ်နိုင်ပါဘူး။
          // Next.js က ပိုကောင်းတဲ့ digests တွေနဲ့ errors တွေကို
          // ကျွန်တော်တို့အတွက် အလိုအလျောက်လည်း redact လုပ်ပေးပါတယ်။
          return false
        },
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (environmentManager.isServer()) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
```

> Note: ဒါက NextJs နဲ့ Server Components တွေမှာ အလုပ်လုပ်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ React က Client Components တွေဆီ ပို့လိုက်တဲ့အခါ Promises တွေကို wire ပေါ်မှာ serialize လုပ်နိုင်လို့ပါ။

ပြီးတော့ — လုပ်ရမှာက `HydrationBoundary` တစ်ခု ပေးလိုက်ရုံပါပဲ — ဒါပေမယ့် prefetches တွေကို `await` လုပ်စရာ မလိုတော့ပါဘူး:

```tsx
// app/posts/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from './get-query-client'
import Posts from './posts'

// ဘာမှ `await` မလုပ်တော့လို့ function က `async` ဖြစ်စရာ မလိုပါဘူး
export default function PostsPage() {
  const queryClient = getQueryClient()

  // ကြည့်လိုက်ပါ၊ await မရှိဘူး
  void queryClient
    .query({
      queryKey: ['posts'],
      queryFn: getPosts,
    })
    .catch(noop)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

Client ပေါ်မှာ — Promise ကို ကျွန်တော်တို့အတွက် QueryCache ထဲမှာ ထည့်ပေးပါလိမ့်မယ်။ ဆိုလိုတာက — အခု `Posts` component ထဲမှာ `useSuspenseQuery` ကို ခေါ်ပြီး (Server ပေါ်မှာ ဖန်တီးခဲ့တဲ့) ဒီ Promise ကို "အသုံးပြု" နိုင်ပါပြီ:

```tsx
// app/posts/posts.tsx
'use client'

export default function Posts() {
  const { data } = useSuspenseQuery({ queryKey: ['posts'], queryFn: getPosts })

  // ...
}
```

> `useSuspenseQuery` အစား `useQuery` ကိုလည်း သုံးလို့ ရတယ်ဆိုတာ သတိပြုပါ — Promise ကို မှန်မှန်ကန်ကန် ကောက်ယူသုံးနိုင်ပါသေးတယ်။ ဒါပေမယ့် — အဲဒီအခါ NextJs က suspend မလုပ်တော့ဘဲ — component က `pending` status နဲ့ render ဖြစ်ပြီး — content ကို server render လုပ်ခြင်းကနေလည်း ဖယ်ထွက်သွားစေပါတယ်။

Non-JSON data types တွေ သုံးနေပြီး query results တွေကို server ပေါ်မှာ serialize လုပ်နေတယ်ဆိုရင် — boundary ရဲ့ ဘက်တစ်ဖက်စီမှာ data တွေကို serialize/deserialize လုပ်ဖို့ `dehydrate.serializeData` နဲ့ `hydrate.deserializeData` options တွေကို သတ်မှတ်နိုင်ပြီး — cache ထဲမှာ data က server ရော client မှာပါ တူညီတဲ့ format ဖြစ်နေဖို့ သေချာစေနိုင်ပါတယ်:

```tsx
// app/get-query-client.ts
import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query'
import { deserialize, serialize } from './transformer'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // ...
      hydrate: {
        deserializeData: deserialize,
      },
      dehydrate: {
        serializeData: serialize,
      },
    },
  })
}

// ...
```

```tsx
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getQueryClient } from './get-query-client'
import { serialize } from './transformer'
import Posts from './posts'

export default function PostsPage() {
  const queryClient = getQueryClient()

  // ကြည့်လိုက်ပါ၊ await မရှိဘူး
  void queryClient
    .query({
      queryKey: ['posts'],
      queryFn: () => getPosts().then(serialize), // <-- server ပေါ်မှာ data ကို serialize လုပ်ပါ
    })
    .catch(noop)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

```tsx
// app/posts/posts.tsx
'use client'

export default function Posts() {
  const { data } = useSuspenseQuery({ queryKey: ['posts'], queryFn: getPosts })

  // ...
}
```

အခုဆိုရင် — သင့် `getPosts` function က ဥပမာ `Temporal` datetime objects တွေကို return လုပ်နိုင်ပြီး — သင့် transformer က ဒီ data types တွေကို serialize/deserialize လုပ်နိုင်ရင် — data က client ပေါ်မှာ serialize ဖြစ်ပြီး deserialize ဖြစ်သွားပါလိမ့်မယ်။

အသေးစိတ်အတွက် — [Next.js App with Prefetching Example](https://tanstack.com/query/latest/docs/framework/react/examples/nextjs-app-prefetching) ကို ကြည့်ပါ။

### Streaming နဲ့ Persist Adapter ကို သုံးခြင်း

[Streaming with Server Components](#streaming-with-server-components) feature နဲ့ persist adapter ကို သုံးနေတယ်ဆိုရင် — promises တွေကို storage ထဲ မသိမ်းမိအောင် သတိထားရပါမယ်။ Pending queries တွေက dehydrate ဖြစ်ပြီး client ဆီ stream လုပ်လို့ ရတာမို့ — အောင်မြင်တဲ့ queries တွေကိုသာ persist လုပ်ဖို့ persister ကို configure လုပ်သင့်ပါတယ်:

```tsx
<PersistQueryClientProvider
  client={queryClient}
  persistOptions={{
    persister,
    // Promises တွေကို storage ထဲ သိမ်းမချင်လို့ — အောင်မြင်တဲ့ queries တွေကိုသာ persist လုပ်ပါတယ်
    dehydrateOptions: { shouldDehydrateQuery: defaultShouldDehydrateQuery },
  }}
>
  {children}
</PersistQueryClientProvider>
```

ဒါက — အောင်မြင်စွာ resolve ဖြစ်တဲ့ queries တွေကိုသာ storage ထဲ persist ဖြစ်စေပြီး — pending promises တွေနဲ့ serialization ပြဿနာတွေကို ကာကွယ်ပေးပါတယ်။

## Next.js မှာ Prefetching မပါဘဲ Experimental Streaming

အပေါ်မှာ အသေးစိတ် ဖော်ပြထားတဲ့ prefetching solution ကို ကျွန်တော်တို့ အကြံပြုပါတယ် — ဘာကြောင့်လဲဆိုတော့ ဒါက ကနဦး page load ရော နောက်ဆက်တွဲ page navigation တွေမှာပါ request waterfalls တွေကို ပြားချပ်အောင် လုပ်ပေးလို့ပါ — ဒါပေမယ့် prefetching ကို လုံးဝ ကျော်ပြီး streaming SSR အလုပ်ဖြစ်အောင် လုပ်နိုင်မယ့် experimental နည်းလမ်းတစ်ခုလည်း ရှိပါတယ်: `@tanstack/react-query-next-experimental`

ဒီ package က သင့် component ထဲမှာ `useSuspenseQuery` ကို ခေါ်ရုံနဲ့ (Client Component တစ်ခုထဲမှာ) server ပေါ်မှာ data fetch လုပ်ခွင့်ပေးပါလိမ့်မယ်။ ရလဒ်တွေက SuspenseBoundaries တွေ resolve ဖြစ်တာနဲ့ server ကနေ client ဆီ stream လုပ်ခံရပါလိမ့်မယ်။ `useSuspenseQuery` ကို `<Suspense>` boundary တစ်ခုထဲမှာ ထုပ်မထားဘဲ ခေါ်ရင် — fetch resolve မဖြစ်မချင်း HTML response က မစတင်ပါဘူး။ အခြေအနေပေါ် မူတည်ပြီး ဒါက သင်လိုချင်တာ ဖြစ်နိုင်ပေမယ့် — ဒါက သင့် TTFB ကို ထိခိုက်စေမယ်ဆိုတာ သတိထားပါ။

ဒါကို အောင်မြင်ဖို့ — သင့် app ကို `ReactQueryStreamedHydration` component နဲ့ ထုပ်ပါ:

```tsx
// app/providers.tsx
'use client'

import {
  environmentManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import * as React from 'react'
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (environmentManager.isServer()) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function Providers(props: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}
```

အသေးစိတ်အတွက် — [NextJs Suspense Streaming Example](https://tanstack.com/query/latest/docs/framework/react/examples/nextjs-suspense-streaming) ကို ကြည့်ပါ။

အကြီးမားဆုံး အားသာချက်က — SSR အလုပ်ဖြစ်ဖို့ queries တွေကို manual ဖြစ် prefetch လုပ်စရာ မလိုတော့ဘဲ — ရလဒ်ကိုတောင် ဆက် stream လုပ်ပေးပါသေးတယ်! ဒါက သင့်ကို phenomenal DX နဲ့ code complexity ပိုနည်းအောင် ပေးပါတယ်။

အားနည်းချက်ကို ရှင်းပြဖို့ အလွယ်ဆုံးက — [Performance & Request Waterfalls guide ထဲက ရှုပ်ထွေးတဲ့ request waterfall ဥပမာ](/docs/tanstack-query/request-waterfalls#code-splitting) ကို ပြန်ကြည့်ရင် ရပါတယ်။ Prefetching ပါတဲ့ Server Components တွေက — ကနဦး page load ရော နောက်ဆက်တွဲ navigation တွေမှာပါ request waterfalls တွေကို ထိရောက်စွာ ဖယ်ရှားပေးပါတယ်။ ဒီ prefetch-less approach ကတော့ — ကနဦး page load မှာပဲ waterfalls တွေကို ပြားချပ်အောင် လုပ်နိုင်ပြီး — page navigations တွေမှာတော့ မူရင်း ဥပမာလိုပဲ နက်ရှိုင်းတဲ့ waterfall နဲ့ ဆုံးသွားပါတယ်:

```
1. |> JS for <Feed>
2.   |> getFeed()
3.     |> JS for <GraphFeedItem>
4.       |> getGraphDataById()
```

ဒါက `getServerSideProps`/`getStaticProps` တွေနဲ့ ယှဉ်ရင်တောင် ပိုဆိုးပါတယ် — ဘာကြောင့်လဲဆိုတော့ အဲဒီဟာတွေနဲ့ဆိုရင် data- နဲ့ code-fetching တွေကို အနည်းဆုံး parallel ဖြစ်အောင် လုပ်နိုင်လို့ပါ။

သင် performance ထက် DX/iteration/shipping speed ကို code complexity နည်းနည်းနဲ့ ပိုတန်ဖိုးထားတယ်ဆိုရင် — နက်ရှိုင်းစွာ nested ဖြစ်တဲ့ queries တွေ မရှိဘူးဆိုရင် — ဒါမှမဟုတ် `useSuspenseQueries` လို tools တွေနဲ့ parallel fetching သုံးပြီး သင့် request waterfalls တွေကို သေချာ ကိုင်တွယ်နေတယ်ဆိုရင် — ဒါက ကောင်းတဲ့ tradeoff တစ်ခု ဖြစ်နိုင်ပါတယ်။

> Approach နှစ်ခုကို ပေါင်းစပ်လို့ ရနိုင်ပေမယ့် — ကျွန်တော်တို့ ကိုယ်တိုင်တောင် အဲဒါကို မစမ်းရသေးပါဘူး။ သင်စမ်းကြည့်ရင် — သင့်တွေ့ရှိချက်တွေကို ပြန်တင်ပြပါ ဒါမှမဟုတ် ဒီ docs တွေကို tips တွေနဲ့ update လုပ်ပေးဖို့တောင် လွတ်လပ်စွာ လုပ်နိုင်ပါတယ်!

## နိဂုံးချုပ်စကား

Server Components နဲ့ streaming တွေက အတော်လေး အသစ်ဖြစ်တဲ့ concepts တွေ ဆက်ဖြစ်နေပြီး — React Query က ဒီထဲမှာ ဘယ်လို ဝင်ဆံ့လဲ၊ API ကို ဘာ improvements တွေ လုပ်နိုင်လဲဆိုတာ ကျွန်တော်တို့ ဆက်လေ့လာနေပါတယ်။ Suggestions၊ feedback နဲ့ bug reports တွေကို ကြိုဆိုပါတယ်!

ဒီလိုပဲ — ဒီ paradigm အသစ်ရဲ့ ရှုပ်ထွေးနက်နဲမှု အားလုံးကို guide တစ်ခုတည်း၊ ပထမဆုံး ကြိုးစားမှုနဲ့ သင်ပေးဖို့ မဖြစ်နိုင်ပါဘူး။ ဒီမှာ အချက်အလက် တစ်ခုခု ပျောက်နေတယ်လို့ ခံစားရရင် ဒါမှမဟုတ် ဒီ content တွေ ပိုကောင်းအောင် ဘယ်လို လုပ်ရမလဲဆိုတဲ့ suggestions ရှိရင် — ဆက်သွယ်ပါ — ဒါမှမဟုတ် ပိုကောင်းတာက — အောက်က "Edit on GitHub" button ကို နှိပ်ပြီး ကျွန်တော်တို့ကို ကူညီပေးပါ။

## ထပ်ဆင့် ဖတ်ရှုရန်

သင့် application က Server Components တွေကိုပါ သုံးတဲ့အခါ React Query ကနေ အကျိုးခံစားနိုင်လားဆိုတာ နားလည်ဖို့ — [You Might Not Need React Query](https://tkdodo.eu/blog/you-might-not-need-react-query) ဆောင်းပါးကို ကြည့်ပါ။
