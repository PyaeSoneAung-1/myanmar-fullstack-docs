---
title: "usePrefetchQuery (Render အတွင်း prefetch ပြုလုပ်ရန် hook)"
description: "usePrefetchQuery ရဲ့ call signature, options နဲ့ Returns — suspense boundary မတိုင်ခင် render လုပ်နေစဉ်အတွင်း prefetch ကို fire လုပ်တဲ့ hook"
order: 48
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/usePrefetchQuery"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function usePrefetchQuery<TQueryFnData, TError, TData, TQueryData, TQueryKey>(options, queryClient?): void;
```

`usePrefetchQuery` က ဘာမှ ပြန်မပေးပါဘူး — render လုပ်နေစဉ်အတွင်းမှာ prefetch ကို fire လုပ်ဖို့ပဲ သုံးပါတယ်။ ပုံမှန်အားဖြင့် prefetch ကို `QueryClient.prefetchQuery` နဲ့ event handler / effect တွေထဲမှာ လုပ်လေ့ရှိပြီး — render လုပ်နေတုန်း ချက်ချင်း prefetch စေချင်တဲ့နေရာမှာ၊ ဆိုလိုတာက [useSuspenseQuery](/docs/tanstack-query/use-suspense-query) သုံးထားတဲ့ component ကို ထုပ်ထားတဲ့ suspense boundary မတိုင်ခင်မှာ — ဒီ hook ကို သုံးပါတယ်။ Prefetching ပုံစံတွေ အပြည့်အစုံကို [Prefetching](/docs/tanstack-query/prefetching) guide မှာ ဖတ်နိုင်ပါတယ်။

`usePrefetchQuery` ဆီမှာ `queryClient.query` ဆီ ပို့လို့ရတဲ့ အရာအားလုံး ပို့လို့ရပါတယ် — ဒါပေမယ့် `queryKey` က အမြဲ required ဖြစ်ပြီး — `queryFn` က default query function သတ်မှတ်ထားရင် ကလွဲလို့ required ပါ။

ဒါ့အပြင် — query မှာ cache state တစ်ခုခု ရှိနှင့်ပြီးသားဆိုရင် prefetch ကို skip လုပ်ပါတယ် (အရင်တစ်ခါ ကြိုးစားမှုကနေ ကျန်ခဲ့တဲ့ `pending`/`error` state တွေ အပါအဝင်)။ ဒါကြောင့် render တိုင်းမှာ ဒီ hook ကို ခေါ်နေရင်တောင် စရိတ် (cost) နည်းပြီး — ရှိပြီးသား / fetching ဖြစ်နေပြီးသား data ကို ပြန် refetch လုပ်မှာ မဟုတ်ပါဘူး။

## Type Parameters

| Type Parameter | Default | အဓိပ္ပာယ် |
|---|---|---|
| `TQueryFnData` | `unknown` | `queryFn` က resolve လုပ်တဲ့ raw data ရဲ့ type |
| `TError` | `Error` | `queryFn` က throw နိုင်တဲ့ error ရဲ့ type |
| `TData` | `TQueryFnData` | `select` transformation ပြီးနောက် `data` ထဲမှာ ရောက်ရှိတဲ့ type |
| `TQueryData` | `TQueryFnData` | query cache ထဲမှာ တကယ် သိမ်းထားတဲ့ data ရဲ့ type — `select` ရဲ့ input |
| `TQueryKey` | `readonly unknown[]` | query key ရဲ့ type — `QueryKey` ကို extend လုပ်ထားရမယ် |

## Parameters

**`options`** — [`UsePrefetchQueryOptions`](https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UsePrefetchQueryOptions)<`TQueryFnData`, `TError`, `TData`, `TQueryData`, `TQueryKey`> type — `queryClient.query` ဆီ ပို့လို့ရတဲ့ options အားလုံး (`queryKey`, `queryFn`, `staleTime`/`gcTime`, `initialData`, `meta` စသည်) ဖြစ်ပါတယ်။ Option တစ်ခုချင်းစီရဲ့ အဓိပ္ပာယ်အပြည့်အစုံကို [useQuery](/docs/tanstack-query/use-query) စာမျက်နှာမှာ ကြည့်နိုင်ပါတယ်။

**`queryClient?`** — custom `QueryClient` instance တစ်ခုကို သုံးချင်ရင် ဒီနေရာမှာ ပို့ပါ။ မပို့ရင် component tree ထဲက အနီးဆုံး `QueryClientProvider` context ကနေ အလိုအလျောက် ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

`void` — ဘာမှ ပြန်မပေးပါဘူး။ (Prefetch ရဲ့ ရလဒ်ကို စောင့်ကြည့်ချင်ရင် — cache ထဲကို ရောက်သွားတဲ့ data ကို နောက်ပိုင်း `useSuspenseQuery`/`useQuery` တွေက ပြန်သုံးပါတယ်။)

## ဥပမာများ

Render အတွင်း၊ suspense boundary မတိုင်ခင် prefetch ကို fire လုပ်ခြင်း:

```tsx
import { Suspense } from 'react'
import { usePrefetchQuery } from '@tanstack/react-query'

function App() {
  // suspense boundary မတိုင်ခင် render အတွင်းမှာပဲ prefetch ကို fire လုပ်တယ်။
  usePrefetchQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  return (
    <Suspense fallback={<h1>Loading posts...</h1>}>
      <Posts />
    </Suspense>
  )
}
```

ဒီ hook က render-as-you-fetch ချဉ်းကပ်မှုရဲ့ တစ်စိတ်တစ်ပိုင်းပါ — Fetch-on-render နဲ့ Render-as-you-fetch ကွာခြားပုံကို [Suspense guide](/docs/tanstack-query/suspense) မှာ ကြည့်နိုင်ပါတယ်။ Event handler / effect တွေထဲကနေ prefetch လုပ်ချင်ရင်တော့ `QueryClient.prefetchQuery` ကို သုံးပါ — prefetch လုပ်ထားတဲ့ data ကို cache ကနေ ဘယ်လို ပြန်သုံးမလဲဆိုတာ အပါအဝင် အသေးစိတ်ကို [Prefetching](/docs/tanstack-query/prefetching) guide မှာ ဖတ်နိုင်ပါတယ်။
