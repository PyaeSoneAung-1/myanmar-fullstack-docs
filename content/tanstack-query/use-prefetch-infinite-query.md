---
title: "usePrefetchInfiniteQuery (Infinite query ကို render အတွင်း prefetch ပြုလုပ်ရန် hook)"
description: "usePrefetchInfiniteQuery ရဲ့ call signature, type parameters, options နဲ့ Returns — suspense boundary မတိုင်ခင် useSuspenseInfiniteQuery အတွက် infinite query ကို render လုပ်နေစဉ်အတွင်း prefetch လုပ်ပေးတဲ့ hook"
order: 49
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/usePrefetchInfiniteQuery"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function usePrefetchInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options, queryClient?): void;
```

`usePrefetchInfiniteQuery` က ဘာမှ ပြန်မပေးပါဘူး — render လုပ်နေစဉ်အတွင်းမှာ infinite query တစ်ခုကို prefetch လုပ်ဖို့ပဲ သုံးပါတယ်။ [usePrefetchQuery](/docs/tanstack-query/use-prefetch-query) ရဲ့ infinite version ဖြစ်ပြီး — [useSuspenseInfiniteQuery](/docs/tanstack-query/use-suspense-infinite-query) သုံးထားတဲ့ component ကို ထုပ်ထားတဲ့ suspense boundary မတိုင်ခင်မှာ ခေါ်ပါတယ်။

`queryClient.infiniteQuery` ဆီ ပို့လို့ရတဲ့ အရာအားလုံး ဒီ hook ဆီကိုပါ ပို့လို့ရပါတယ် — ဒါပေမယ့် `queryKey`, `initialPageParam`, `getNextPageParam` တို့က အမြဲ required ဖြစ်ပြီး `queryFn` ကတော့ default query function သတ်မှတ်ထားမှသာ မလိုပါ။

`getNextPageParam` က — infinite data ရဲ့ နောက်ဆုံး page နဲ့ page အားလုံး ပါဝင်တဲ့ array တစ်ခုလုံး၊ pageParam အချက်အလက်တွေကို လက်ခံပြီး — `queryFn` ဆီ `context.pageParam` အနေနဲ့ ရောက်သွားမယ့် တန်ဖိုးတစ်ခုတည်းကို ပြန်ပေးရပါတယ်။ နောက်ထပ် page မရှိတော့ဘူးဆိုရင် `undefined`/`null` ပြန်ပေးပါ။

Query မှာ cache state တစ်ခုခု ရှိနှင့်ပြီးသားဆိုရင် prefetch ကို skip လုပ်ပါတယ် — အရင်ကြိုးစားမှုကနေ ကျန်ခဲ့တဲ့ `pending`/`error` state တွေ အပါအဝင်ပါ။ ဒါကြောင့် render တိုင်း ခေါ်နေရင်တောင် စရိတ် နည်းပြီး — ရှိပြီးသား ဒါမှမဟုတ် fetching ဖြစ်နေပြီးသား data ကို ပြန် refetch လုပ်မှာ မဟုတ်ပါဘူး။

## Type Parameters

| Type Parameter | Default | အဓိပ္ပာယ် |
|---|---|---|
| `TQueryFnData` | `unknown` | page တစ်ခုချင်းစီအတွက် `queryFn` က resolve လုပ်ပေးတဲ့ raw data ရဲ့ type |
| `TError` | `Error` | `queryFn` က throw နိုင်တဲ့ error ရဲ့ type |
| `TData` | `InfiniteData<TQueryFnData, unknown>` | `data` ထဲမှာ ရောက်ရှိတဲ့ type — `pages` + `pageParams` တွေ ပါဝင်တဲ့ `InfiniteData` |
| `TQueryKey` | `readonly unknown[]` | query key ရဲ့ type — `QueryKey` ကို extend လုပ်ထားရမယ် |
| `TPageParam` | `unknown` | `getNextPageParam`/`getPreviousPageParam` တွေကနေ `pageParam` အနေနဲ့ `queryFn` ဆီ ရောက်သွားတဲ့ တန်ဖိုးရဲ့ type |

## Parameters

**`options`** — [`UsePrefetchInfiniteQueryOptions`](https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UsePrefetchInfiniteQueryOptions)<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`> type — `queryClient.infiniteQuery` ဆီ ပို့လို့ရတဲ့ options အားလုံး ဖြစ်ပါတယ်။ Option တစ်ခုချင်းစီရဲ့ အဓိပ္ပာယ်အပြည့်အစုံကို [useInfiniteQuery](/docs/tanstack-query/use-infinite-query) နဲ့ [Infinite Queries](/docs/tanstack-query/infinite-queries) မှာ ကြည့်နိုင်ပါတယ်။

**`queryClient?`** — custom `QueryClient` instance တစ်ခုကို သုံးချင်ရင် ဒီနေရာမှာ ပို့ပါ။ မပို့ရင် component tree ထဲက အနီးဆုံး `QueryClientProvider` context ကနေ အလိုအလျောက် ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

`void` — ဘာမှ ပြန်မပေးပါဘူး။ (Prefetch လုပ်ထားတဲ့ data က cache ထဲကို ရောက်သွားပြီး — နောက်ပိုင်း `useSuspenseInfiniteQuery`/`useInfiniteQuery` တွေက အဲဒီ data ကို ချက်ချင်း ပြန်သုံးပါတယ်။)

## ဥပမာများ

`infiniteQueryOptions` နဲ့ options တွေကို ကြိုတင် define လုပ်ထားပြီး — render အတွင်း၊ suspense boundary မတိုင်ခင် prefetch ကို fire လုပ်တဲ့ ပုံစံ:

```tsx
import { Suspense } from 'react'
import { infiniteQueryOptions, usePrefetchInfiniteQuery } from '@tanstack/react-query'

const projectsOptions = infiniteQueryOptions({
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjects(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextId,
})

function App() {
  // Fire the prefetch during render, before the suspense boundary below.
  usePrefetchInfiniteQuery(projectsOptions)

  return (
    <Suspense fallback={<h1>Loading projects...</h1>}>
      <Projects />
    </Suspense>
  )
}
```

Suspense mode နဲ့ error handling ပုံစံတွေ အတွက် [Suspense](/docs/tanstack-query/suspense) guide ကို ကြည့်ပါ။
