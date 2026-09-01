---
title: "Suspense (React Suspense နဲ့ အသုံးပြုခြင်း)"
description: "useSuspenseQuery စတဲ့ hooks တွေနဲ့ React Suspense ကို သုံးပြီး data fetching — throwOnError, Error Boundaries reset လုပ်ခြင်း, Fetch-on-render vs Render-as-you-fetch, ဆာဗာမှာ streaming suspense"
order: 19
source: "https://tanstack.com/query/latest/docs/framework/react/guides/suspense"
status: translated
updated: 2026-09-01
---

React Query ကို React ရဲ့ Suspense for Data Fetching APIs တွေနဲ့လည်း သုံးနိုင်ပါတယ်။ ဒီအတွက် သီးသန့် hooks တွေ ရှိပါတယ်:

- [useSuspenseQuery](https://tanstack.com/query/latest/docs/reference/useSuspenseQuery)
- [useSuspenseInfiniteQuery](https://tanstack.com/query/latest/docs/reference/useSuspenseInfiniteQuery)
- [useSuspenseQueries](https://tanstack.com/query/latest/docs/reference/useSuspenseQueries)

Suspense mode သုံးတဲ့အခါ — `status` states တွေနဲ့ `error` objects တွေ မလိုတော့ဘဲ — အဲဒီအစား `React.Suspense` component ကို သုံးပြီး အစားထိုးပါတယ် (`fallback` prop နဲ့ error တွေကို ဖမ်းဖို့ React error boundaries တွေ အပါအဝင်)။ Suspense mode ကို ဘယ်လို setup လုပ်ရမလဲဆိုတဲ့ အချက်အလက်တွေအတွက် [Resetting Error Boundaries](#resetting-error-boundaries) ကို ဖတ်ပြီး [Suspense Example](https://tanstack.com/query/latest/docs/framework/react/examples/suspense) ကို ကြည့်ပါ။

Mutation တွေကလည်း (queries တွေလိုပဲ) error တွေကို အနီးဆုံး error boundary ဆီ ပြန့်ပွားစေချင်ရင် — `throwOnError` option ကို `true` လို့ သတ်မှတ်နိုင်ပါတယ်။

Query တစ်ခုအတွက် suspense mode ဖွင့်နည်း:

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'

const { data } = useSuspenseQuery({ queryKey, queryFn })
```

ဒါက TypeScript မှာ ကောင်းကောင်း အလုပ်လုပ်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ `data` က သေချာပေါက် defined ဖြစ်နေလို့ပါ (error နဲ့ loading states တွေကို Suspense- နဲ့ ErrorBoundaries တွေက ကိုင်တွယ်ပေးလို့)။

ဒါကြောင့် ပြောင်းပြန်အနေနဲ့ — query ကို condition အလိုက် enable/disable လုပ်လို့ မရတော့ပါဘူး။ Dependent Queries တွေအတွက်တော့ ဒါက ယေဘုယျအားဖြင့် မလိုအပ်လောက်ပါဘူး — ဘာကြောင့်လဲဆိုတော့ suspense နဲ့ဆိုရင် component တစ်ခုထဲက သင့် Queries တွေ အားလုံးက serial ဖြစ်ဖြစ် fetch လုပ်ခံရလို့ပါ။

ဒီ Query အတွက် `placeholderData` လည်း မရှိပါဘူး။ Update တစ်ခုအတွင်း UI ကို fallback နဲ့ အစားထိုးမခံရအောင် — QueryKey ကို ပြောင်းလဲစေတဲ့ updates တွေကို [startTransition](https://react.dev/reference/react/Suspense#preventing-unwanted-fallbacks) ထဲမှာ ထုပ်ပေးပါ။

### throwOnError ၏ default တန်ဖိုး

Error တွေ အားလုံးကို default အနေနဲ့ အနီးဆုံး Error Boundary ဆီ throw လုပ်တာ မဟုတ်ပါဘူး — ပြဖို့ တခြား data မရှိမှသာ error တွေကို throw လုပ်ပါတယ်။ ဆိုလိုတာက — Query တစ်ခုက cache ထဲမှာ data ကို ဘယ်တော့မဆို အောင်မြင်စွာ ရဖူးရင် — data က `stale` ဖြစ်နေရင်တောင် component က render လုပ်ပါလိမ့်မယ်။ ဒါကြောင့် `throwOnError` ရဲ့ default က:

```
throwOnError: (error, query) => typeof query.state.data === 'undefined'
```

`throwOnError` ကို ပြောင်းလို့ မရတာကြောင့် (`data` က `undefined` ဖြစ်လာနိုင်လို့) — error တွေ အားလုံးကို Error Boundaries တွေက ကိုင်တွယ်စေချင်ရင် error တွေကို manual အနေနဲ့ throw လုပ်ရပါမယ်:

```tsx
import { useSuspenseQuery } from '@tanstack/react-query'

const { data, error, isFetching } = useSuspenseQuery({ queryKey, queryFn })

if (error && !isFetching) {
  throw error
}

// data ကို ဆက်ပြီး render လုပ်ပါ
```

## Resetting Error Boundaries

သင့် queries တွေမှာ **suspense** ပဲ သုံးသုံး **throwOnError** ပဲ သုံးသုံး — error တစ်ခု ဖြစ်ပြီးနောက် re-render လုပ်တဲ့အခါ နောက်တစ်ကြိမ် ပြန်ကြိုးစားချင်ကြောင်း queries တွေကို အသိပေးဖို့ နည်းလမ်းတစ်ခု လိုပါလိမ့်မယ်။

Query errors တွေကို `QueryErrorResetBoundary` component ဒါမှမဟုတ် `useQueryErrorResetBoundary` hook နဲ့ reset လုပ်နိုင်ပါတယ်။

Component ကို သုံးတဲ့အခါ — component ရဲ့ နယ်နိမိတ် (boundaries) အတွင်းက query errors တွေ အားလုံးကို reset လုပ်ပါလိမ့်မယ်:

```tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

const App = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <div>
            There was an error!
            <Button onClick={() => resetErrorBoundary()}>Try again</Button>
          </div>
        )}
      >
        <Page />
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
)
```

Hook ကို သုံးတဲ့အခါ — အနီးဆုံး `QueryErrorResetBoundary` ရဲ့ အတွင်းက query errors တွေ အားလုံးကို reset လုပ်ပါလိမ့်မယ်။ Boundary မသတ်မှတ်ထားရင် — global အနေနဲ့ reset လုပ်ပါလိမ့်မယ်:

```tsx
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'

const App = () => {
  const { reset } = useQueryErrorResetBoundary()
  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => (
        <div>
          There was an error!
          <Button onClick={() => resetErrorBoundary()}>Try again</Button>
        </div>
      )}
    >
      <Page />
    </ErrorBoundary>
  )
}
```

## Fetch-on-render နဲ့ Render-as-you-fetch

ပုံမှန် (out of the box) အနေနဲ့ — `suspense` mode ထဲက React Query က အပိုဆောင်း configuration မလိုဘဲ **Fetch-on-render** solution အဖြစ် ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။ ဆိုလိုတာက — သင့် components တွေ mount လုပ်ဖို့ ကြိုးစားတဲ့အခါ query fetching ကို trigger လုပ်ပြီး suspend ဖြစ်ပါတယ်။ ဒါပေမယ့် components တွေကို import လုပ်ပြီး mount လုပ်ပြီးမှသာ ဖြစ်ပါတယ်။ ဒီထက်တစ်ဆင့် တက်ပြီး **Render-as-you-fetch** model ကို အကောင်အထည်ဖော်ချင်ရင် — queries တွေကို mount မလုပ်ခင်၊ ဖြစ်နိုင်ရင် parent components တွေကို import/mount မလုပ်ခင် စတင် loading ဖြစ်စေဖို့ routing callbacks တွေ ဒါမှမဟုတ် user interaction events တွေပေါ်မှာ [Prefetching](/docs/tanstack-query/prefetching) ကို အကောင်အထည်ဖော်ဖို့ အကြံပြုပါတယ်။

## ဆာဗာမှာ streaming နဲ့ Suspense

`NextJs` သုံးနေတယ်ဆိုရင် — ဆာဗာမှာ Suspense အတွက် ကျွန်တော်တို့ရဲ့ **experimental** integration ကို သုံးနိုင်ပါတယ်: `@tanstack/react-query-next-experimental`။ ဒီ package က သင့် component ထဲမှာ `useSuspenseQuery` ကို ခေါ်ရုံနဲ့ (client component တစ်ခုထဲမှာ) ဆာဗာပေါ်မှာ data fetch လုပ်ခွင့်ပေးပါတယ်။ ရလဒ်တွေကို SuspenseBoundaries တွေ resolve ဖြစ်လာတာနဲ့ ဆာဗာကနေ client ဆီ streaming လုပ်ပေးပါလိမ့်မယ်။

ဒါကို အောင်မြင်ဖို့ — သင့် app ကို `ReactQueryStreamedHydration` component နဲ့ ထုပ်ပေးပါ:

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
        // SSR မှာ ပုံမှန်အားဖြင့် default staleTime တစ်ခု သတ်မှတ်ချင်တတ်ပါတယ်
        // client မှာ ချက်ချင်း refetch မဖြစ်အောင် 0 အထက် ထားပါ
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (environmentManager.isServer()) {
    // Server: query client အသစ် အမြဲ ဖန်တီးမယ်
    return makeQueryClient()
  } else {
    // Browser: ရှိပြီးသား မရှိသေးရင် query client အသစ် ဖန်တီးမယ်
    // React က initial render အတွင်း suspend ဖြစ်ရင် client အသစ်
    // ပြန်မဖန်တီးမိအောင် ဒါက အရမ်းအရေးကြီးပါတယ်။ ဒါက query client
    // ဖန်တီးမှုရဲ့ အောက်မှာ suspense boundary ရှိရင် မလိုအပ်နိုင်ပါဘူး
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function Providers(props: { children: React.ReactNode }) {
  // မှတ်ချက်: ဒီ query client နဲ့ suspense ဖြစ်နိုင်တဲ့ code ကြားမှာ
  //       suspense boundary မရှိရင် query client ကို initialize လုပ်ဖို့ useState
  //       ကို ရှောင်ပါ — boundary မရှိဘဲ initial render မှာ suspense ဖြစ်ရင်
  //       React က client ကို ပစ်ပယ်လိုက်လို့ပါ
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

ပိုပြီး အသေးစိတ် သိချင်ရင် [NextJs Suspense Streaming Example](https://tanstack.com/query/latest/docs/framework/react/examples/nextjs-suspense-streaming) နဲ့ [Advanced Rendering & Hydration](/docs/tanstack-query/advanced-ssr) guide ကို ကြည့်ပါ။
