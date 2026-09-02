---
title: "useSuspenseInfiniteQuery (Suspense mode Infinite Query hook)"
description: "useSuspenseInfiniteQuery ရဲ့ call signature, options နဲ့ Returns — Suspense နဲ့ သုံးတဲ့ infinite query; data undefined မဖြစ်ကြောင်း အာမခံချက်၊ error boundary နဲ့ အလုပ်လုပ်ပုံ"
order: 46
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useSuspenseInfiniteQuery"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useSuspenseInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options, queryClient?): UseSuspenseInfiniteQueryResult<TData, TError>;
```

`useSuspenseInfiniteQuery` က [useInfiniteQuery](/docs/tanstack-query/use-infinite-query) ရဲ့ Suspense-enabled version ပါ — page တွေ ဆက်တိုက် ဆွဲယူရတဲ့ infinite query ကို React Suspense နဲ့ သုံးချင်တဲ့အခါ ဒီ hook ကို သုံးပါတယ်။ Data အဆင်သင့် မဖြစ်သေးသရွေ့ component ကို suspend လုပ်ထားပြီး — loading/error UI ကို Suspense fallback နဲ့ error boundary တွေက ကိုင်တွယ်ပေးပါတယ် ([Suspense guide](/docs/tanstack-query/suspense))။ Non-Suspense ဗားရှင်း ဖြစ်တဲ့ [useInfiniteQuery](/docs/tanstack-query/use-infinite-query) လိုပဲ — `data.pages`/`data.pageParams`, `fetchNextPage`, `hasNextPage`, `isFetchingNextPage` စတဲ့ result fields တွေ အတူတူ ရပါတယ်။

`useSuspenseInfiniteQuery` ရဲ့ options တွေက `useInfiniteQuery` နဲ့ အတူတူပဲ — `throwOnError`, `enabled`, `placeholderData` တို့ ကလွဲပြီး ဖြစ်ပါတယ်။

**သတိပြုစရာ (Caveat):** cancellation က ဒီ hook နဲ့ အလုပ်မလုပ်ပါဘူး။

## Type Parameters

| Type Parameter | Default | အဓိပ္ပာယ် |
|---|---|---|
| `TQueryFnData` | — | `queryFn` က resolve လုပ်တဲ့ page တစ်ခုချင်းစီရဲ့ raw data type |
| `TError` | `Error` | `queryFn` က throw နိုင်တဲ့ error ရဲ့ type |
| `TData` | `InfiniteData<TQueryFnData, unknown>` | `data` ထဲမှာ ရောက်ရှိတဲ့ type — `pages` + `pageParams` တွေ ပါဝင်တဲ့ `InfiniteData` |
| `TQueryKey` | `readonly unknown[]` | query key ရဲ့ type — `QueryKey` ကို extend လုပ်ထားရမယ် |
| `TPageParam` | `unknown` | `getNextPageParam`/`getPreviousPageParam` တွေနဲ့ `pageParam` အနေနဲ့ `queryFn` ဆီ ရောက်သွားတဲ့ တန်ဖိုးရဲ့ type |

## Parameters

**`options`** — [`UseSuspenseInfiniteQueryOptions`](https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseSuspenseInfiniteQueryOptions)<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`> type — အပေါ်မှာ ဖယ်ထားတဲ့ options တွေကလွဲလို့ `useInfiniteQuery` options နဲ့ အတူတူပါ (infinite query အတွက် `initialPageParam`, `getNextPageParam` စတာတွေ အပါအဝင်)။ Option တစ်ခုချင်းစီရဲ့ အဓိပ္ပာယ်အပြည့်အစုံကို [useInfiniteQuery](/docs/tanstack-query/use-infinite-query) နဲ့ [Infinite Queries](/docs/tanstack-query/infinite-queries) မှာ ကြည့်နိုင်ပါတယ်။

**`queryClient?`** — custom `QueryClient` instance တစ်ခုကို သုံးချင်ရင် ဒီနေရာမှာ ပို့ပါ။ မပို့ရင် component tree ထဲက အနီးဆုံး `QueryClientProvider` context ကနေ အလိုအလျောက် ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

[`UseSuspenseInfiniteQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseSuspenseInfiniteQueryResult)<`TData`, `TError`> — `useInfiniteQuery` ပြန်ပေးတဲ့ object နဲ့ ပုံစံတူပေမယ့် ကွာခြားချက် သုံးခု ရှိပါတယ်:

| Property | ကွာခြားချက် |
|---|---|
| `data` | **သေချာပေါက် defined** — ဘယ်တော့မှ `undefined` မဖြစ်ပါဘူး |
| `isPlaceholderData` | မပါတော့ပါဘူး |
| `status` | `'success'` \| `'error'` ပဲ ဖြစ်နိုင်တယ် (derived flags — `isSuccess`/`isError` — တွေလည်း အလိုက်သင့် သတ်မှတ်ပေးပါတယ်) |

**data undefined မဖြစ်တဲ့ အာမခံချက်** — data မရှိသေးသရွေ့ component က render ဖြစ်မှာ မဟုတ်ဘဲ `<Suspense>` fallback အောက်မှာ စောင့်နေလို့ — `data` ကို `undefined` ဖြစ်နိုင်ခြေ မရှိတဲ့ type အနေနဲ့ သုံးလို့ ရပါတယ်။ **Error boundary နဲ့ အလုပ်လုပ်ပုံ** ကလည်း [useSuspenseQuery](/docs/tanstack-query/use-suspense-query) နဲ့ အတူတူပါ — cache data မရှိဘဲ fetch ကျရှုံးရင် error ကို throw လုပ်ပြီး၊ background refetch ကျရှုံးရင်တော့ ရှိပြီးသား data ကို ဆက် render လုပ်ပါတယ်။

## သတိပြုစရာများ (Remarks)

- Component တစ်ခုထဲမှာ suspenseful query တွေ တစ်ခုထက်ပိုရင် — query တွေက serial ဖြစ်ပြီး suspend လုပ်လို့ request waterfall ဖြစ်ပါတယ် (query တစ်ခု resolve မဖြစ်မချင်း နောက်တစ်ခု fetch စလို့ မရပါဘူး)။ ပြီးတော့ Suspense အောက်မှာ infinite query တွေ အများကြီးကို parallel ဖြစ်အောင် လုပ်ဖို့ နည်းလမ်း မရှိပါဘူး။
- `fetchNextPage` လို imperative fetch calls တွေက default refetch behavior ကို အနှောင့်အယှက် ဖြစ်စေနိုင်ပြီး — နောက်ဆုံးမှာ outdated (ခေတ်မမီတဲ့) data တွေ ဖြစ်စေနိုင်ပါတယ်။ ဒါကြောင့် ဒီ function တွေကို user action တွေရဲ့ တုံ့ပြန်မှုမှာပဲ ခေါ်ပါ — ဒါမှမဟုတ် `hasNextPage && !isFetching` လို condition တွေ ထည့်ပြီးမှ ခေါ်ပါ။

Non-Suspense ဗားရှင်း အကြောင်း အသေးစိတ်ကို [useInfiniteQuery](/docs/tanstack-query/use-infinite-query) မှာ ကြည့်နိုင်ပါတယ်။

## ဥပမာများ

Fetch ကျရှုံးပြီး cache data မရှိသေးရင် error ကို throw လုပ်လို့ — `<Suspense>` ပတ်ပတ်လည်မှာ error boundary လိုပါတယ်။ Background refetch ကျရှုံးတာကတော့ cache data ကို ဆက် render လုပ်ပါတယ်:

```tsx
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {
  QueryErrorResetBoundary,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query'

function Projects() {
  // `data` က ဒီနေရာမှာ သေချာပေါက် defined ဖြစ်ပါတယ် — `isPending` check မလိုပါဘူး။
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ['projects'],
      queryFn: ({ pageParam }) => fetchProjects(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextId,
    })

  return (
    <div>
      <ul>
        {data.pages.map((page) =>
          page.projects.map((project) => <li key={project.id}>{project.name}</li>),
        )}
      </ul>
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetching}
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
      </button>
    </div>
  )
}

function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              There was an error!
              <button onClick={() => resetErrorBoundary()}>Try again</button>
            </div>
          )}
        >
          <Suspense fallback={<h1>Loading projects...</h1>}>
            <Projects />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

`fetchNextPage`/`isFetchingNextPage` စတဲ့ infinite query result fields တွေရဲ့ အဓိပ္ပာယ်အပြည့်အစုံနဲ့ pagination ပုံစံတွေကို [Infinite Queries](/docs/tanstack-query/infinite-queries) guide မှာ ကြည့်နိုင်ပါတယ်။
