---
title: "useInfiniteQuery (Infinite query run လုပ်ရန် hook)"
description: "useInfiniteQuery ရဲ့ signature, infinite-specific options (initialPageParam, getNextPageParam...) နဲ့ Returns — paginated data တွေကို စာမျက်နှာလိုက် ဆွဲယူခြင်း"
order: 39
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useInfiniteQuery"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useInfiniteQuery<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options, queryClient?): UseInfiniteQueryResult<TData, TError>;
```

`useInfiniteQuery` ဆိုတာ paginated / "load more" data (page တစ်ခုပြီးတစ်ခု ဆွဲယူရတဲ့ data) တွေအတွက် `useQuery` ရဲ့ အထူးပြုဗားရှင်းပါ — "Load More" ခလုတ်တွေ၊ infinite scroll တွေမှာ သုံးပါတယ်။ အသုံးပြုပုံ pattern တွေ အပြည့်အစုံကို [Infinite Queries အသေးစိတ်](/docs/tanstack-query/infinite-queries) မှာ ဖတ်နိုင်ပါတယ်။

`useQuery` လိုပဲ overload များစွာ ရှိပြီး — `initialData` သတ်မှတ်ထားရင် return type က `DefinedUseInfiniteQueryResult` ဖြစ်လို့ `data` က ဘယ်တော့မှ `undefined` မဖြစ်ပါဘူး (refetch error ဖြစ်ရင်တောင် list ကို error နဲ့အတူ ဆက်ပြနိုင်တယ်)။ Type parameter တွေကလည်း `useQuery` နဲ့ အတူတူပါပဲ — `TPageParam` တစ်ခု ထပ်တိုးပါတယ် (page တစ်ခုစီကို ခွဲခြားတဲ့ value — ဥပမာ cursor ဒါမှမဟုတ် page number — ရဲ့ type)။

## Options

`useInfiniteQuery` ရဲ့ options တွေက `useQuery` နဲ့ အတူတူပါပဲ — [useQuery](/docs/tanstack-query/use-query) မှာ ကြည့်နိုင်ပြီး — ဒီ ၄ ခု ထပ်တိုးပါတယ်:

| Option | အဓိပ္ပာယ် |
|---|---|
| `initialPageParam` | (required) ပထမဆုံး page အတွက် page param — `queryFn` ကို ပထမဆုံးအကြိမ် ခေါ်တဲ့အခါ ဒါကို ပို့ပေးပါတယ် |
| `getNextPageParam` | `(lastPage, allPages, lastPageParam, allPageParams) => nextPageParam` — နောက် page ရဲ့ param ကို ပြန်ပေးတဲ့ function; `undefined` return လုပ်ရင် နောက်ထပ် page မရှိတော့ဘူးလို့ ဆိုလိုပါတယ် |
| `getPreviousPageParam` | `(firstPage, allPages, firstPageParam, allPageParams) => previousPageParam` — အရင် page ရဲ့ param ကို ပြန်ပေးတဲ့ function |
| `maxPages` | cache ထဲမှာ တစ်ပြိုင်နက် ထားမယ့် page အများဆုံး အရေအတွက် — ဒီထက်ကျော်ရင် အဟောင်းဆုံး page တွေကို ဖျက်ပါတယ် (unlimited scroll လို memory ထိန်းချင်တဲ့နေရာမှာ သုံး) |

**`queryClient?`** — custom `QueryClient` instance ကို ပို့ချင်ရင် သုံးပါ; မပို့ရင် အနီးဆုံး `QueryClientProvider` context ကနေ ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

`UseInfiniteQueryResult` — `useQuery` ရဲ့ result fields တွေ အကုန်ပါဝင်ပြီး (status, data, error, isPending... — [useQuery](/docs/tanstack-query/use-query) မှာ ကြည့်ပါ) အောက်ပါတို့ ထပ်တိုးပါတယ်:

| Property | အဓိပ္ပာယ် |
|---|---|
| `data.pages` | fetch ဖြစ်ပြီးသား page တစ်ခုစီရဲ့ data တွေပါတဲ့ array — `InfiniteData<TData, TPageParam>` ရဲ့ property |
| `data.pageParams` | page တစ်ခုစီအတွက် သုံးခဲ့တဲ့ page param တွေပါတဲ့ array |
| `fetchNextPage()` | နောက် page ကို fetch လုပ်တဲ့ function — `getNextPageParam` ရဲ့ result ကို `queryFn` ရဲ့ `pageParam` အနေနဲ့ သုံးပါတယ် |
| `fetchPreviousPage()` | အရင် page ကို ပြန် fetch လုပ်တဲ့ function |
| `hasNextPage` | `getNextPageParam` က `undefined` မဟုတ်တဲ့ value ပြန်ပေးနိုင်သေးရင် `true` — fetch စရင် `false` |
| `hasPreviousPage` | `getPreviousPageParam` က value ပြန်ပေးနိုင်သေးရင် `true` |
| `isFetchingNextPage` / `isFetchingPreviousPage` | next/previous page ကို fetch လုပ်နေတုန်းလား |
| `isFetchNextPageError` / `isFetchPreviousPageError` | next/previous page ရဲ့ fetch က error ဖြစ်သွားလား |

**သတိပြုစရာ (Remarks)** — `fetchNextPage()` လို imperative fetch တွေက default refetch behavior ကို အနှောင့်အယှက် ဖြစ်စေပြီး data ဟောင်းတွေ ကျန်နေစေနိုင်ပါတယ်။ ဒါကြောင့် ဒီ function တွေကို user action တစ်ခုရဲ့ response အနေနဲ့ပဲ ခေါ်ပါ — ဒါမှမဟုတ် `hasNextPage && !isFetching` လို condition တွေနဲ့ ကာကွယ်ပါ။

## ဥပမာများ

"Load More" ခလုတ်ကနေ နောက် page ကို ဆွဲယူခြင်း:

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'

function Projects() {
  const { data, isPending, isError, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['projects'],
      queryFn: ({ pageParam }) => fetchProjects(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextId,
    })

  if (isPending) return 'Loading...'
  if (isError) return <span>Error: {error.message}</span>

  return (
    <>
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
    </>
  )
}
```

User scroll လုပ်တာနဲ့အလိုက် နောက် page ကို အလိုအလျောက် ဆွဲယူခြင်း (infinite scroll) — list ရဲ့ နောက်မှာ ထားတဲ့ sentinel element တစ်ခုကို `IntersectionObserver` နဲ့ စောင့်ကြည့်တာပါ:

```tsx
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'

function Projects() {
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: ({ pageParam }) => fetchProjects(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId,
  })

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (sentinel == null || !hasNextPage || isFetching) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) fetchNextPage()
    })
    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [hasNextPage, isFetching, fetchNextPage])

  if (isPending) return 'Loading...'
  if (isError) return <span>Error: {error.message}</span>

  return (
    <>
      <ul>
        {data.pages.map((page) =>
          page.projects.map((project) => <li key={project.id}>{project.name}</li>),
        )}
      </ul>
      <div ref={sentinelRef}>{isFetchingNextPage ? 'Loading more...' : null}</div>
    </>
  )
}
```

`postId` မရသေးခင်အထိ type-safe ဖြစ်အောင် disable ထားတဲ့ infinite query — `enabled: false` အစား `queryFn` မှာ `skipToken` ကို ပို့ထားတာပါ:

```tsx
import { skipToken, useInfiniteQuery } from '@tanstack/react-query'

function Comments({ postId }: { postId: string | undefined }) {
  // `isPending` မဟုတ်ဘဲ `isLoading` ကို သုံးပါ — query disabled ဖြစ်နေချိန်မှာ loading state မပြစေဖို့ပါ
  const { data, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ['post', postId, 'comments'],
    queryFn:
      postId != null
        ? ({ pageParam }) => fetchComments(postId, pageParam)
        : skipToken,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId,
  })

  if (postId == null) return 'Select a post'
  if (isLoading) return 'Loading...'
  if (isError) return <span>Error: {error.message}</span>

  return (
    <ul>
      {data?.pages.map((page) => page.comments.map((c) => <li key={c.id}>{c.text}</li>))}
    </ul>
  )
}
```

`skipToken` အကြောင်း ထပ်ဆင့်ဖတ်ရန် — [Disabling Queries](/docs/tanstack-query/disabling-queries) နဲ့ [TypeScript](/docs/tanstack-query/typescript) မှာ ကြည့်နိုင်ပါတယ်။ `useInfiniteQuery` ရဲ့ options တွေကို imperative API တွေ (`queryClient.infiniteQuery`) နဲ့ မျှဝေချင်ရင် `infiniteQueryOptions` helper ကို သုံးနိုင်ပါတယ်။
