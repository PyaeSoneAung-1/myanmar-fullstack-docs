---
title: "useQueries (Query အများအပြား run လုပ်ရန် hook)"
description: "useQueries ရဲ့ signature, queries array, combine option နဲ့ Returns — dynamic အရေအတွက်ရှိတဲ့ query တွေကို တစ်ပြိုင်နက် run လုပ်ခြင်း"
order: 40
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useQueries"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useQueries<T, TCombinedResult>(__namedParameters, queryClient?): TCombinedResult;
```

`useQueries` hook က — **အရေအတွက် အလိုက်ပြောင်းနေတဲ့ (variable) query တွေကို** တစ်ပြိုင်နက် fetch လုပ်ဖို့ သုံးပါတယ်။ Query အရေအတွက် ပုံသေသေချာရင် `useQuery` တစ်ခုချင်းစီ ခေါ်လို့ရပြီး — dynamic ဖြစ်နေရင် (ဥပမာ id list တစ်ခုကနေ post တစ်ခုချင်းစီ ယူတာ) `useQueries` က ပိုသင့်တော်ပါတယ်။ ဒီနှစ်မျိုးလုံးရဲ့ ဥပမာတွေကို [Parallel Queries](/docs/tanstack-query/parallel-queries) မှာ ကြည့်နိုင်ပါတယ်။

## Parameters

**`__namedParameters`** — အောက်ပါ properties ပါတဲ့ object:

| Property | အဓိပ္ပာယ် |
|---|---|
| `queries` | query options object တွေရဲ့ array — element တစ်ခုချင်းစီက `useQuery` ရဲ့ options နဲ့ အတူတူနီးပါးပါ။ ကွာချက် — per-query `queryClient` နဲ့ `subscribed` တို့ကို လက်မခံပါဘူး (`subscribed` က ဒီမှာ top-level option ဖြစ်သွားပြီး)၊ `placeholderData` ကလည်း `previousData`/`previousQuery` တွေ အမြဲ `undefined` ဖြစ်နေတဲ့ `QueriesPlaceholderDataFunction` ကိုပဲ လက်ခံပါတယ် |
| `subscribed?` | `false` ထားရင် query cache ရဲ့ update တွေကို ဒီ observer က နားမထောင်တော့ဘူး (default: `true`) |
| `combine?` | `(results) => TCombinedResult` — query results တွေကို value တစ်ခုတည်းအဖြစ် ပေါင်းစပ်ဖို့။ Result ကို referential stability ရနိုင်သမျှ ကောင်းအောင် structurally share လုပ်ပေးပါတယ် |

**`queryClient?`** — custom `QueryClient` instance ကို ပို့ချင်ရင် သုံးပါ; မပို့ရင် အနီးဆုံး `QueryClientProvider` context ကနေ ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

`TCombinedResult` —

- `combine` မပါရင် — query results တွေရဲ့ array။ Input array ရဲ့ အစဉ်အတိုင်း result တွေ ပြန်ရပြီး element တစ်ခုစီက `UseQueryResult` ပုံစံပါ — [useQuery](/docs/tanstack-query/use-query) မှာ ကြည့်ပါ)။ TypeScript က ဒီ array ရဲ့ type ကို input query options တွေကနေ element တစ်ခုချင်းစီအလိုက် infer လုပ်ပေးပါတယ်။
- `combine` ပေးထားရင် — `combine` က return လုပ်တဲ့ value။

**သတိပြုစရာတွေ (Remarks)** —

- `combine` function က referentially ပြောင်းလဲမှု ရှိမှ ဒါမှမဟုတ် query result တစ်ခုခု ပြောင်းမှသာ ပြန် run ပါတယ်။ ဒါကြောင့် inline ရေးထားတဲ့ `combine` က render တိုင်း run ဖြစ်နေမှာမို့ — `useCallback` နဲ့ ထုပ်ပါ ဒါမှမဟုတ် dependency မရှိရင် stable function reference အဖြစ် ထုတ်ထားပါ။
- Query object တွေထဲမှာ query key အတူတူကို တစ်ကြိမ်ထက်ပိုပြီး ထည့်ထားရင် query တွေကြားမှာ data တချို့ share ဖြစ်သွားနိုင်ပါတယ် — မလိုချင်ရင် queries တွေကို de-duplicate လုပ်ပြီး result တွေကို လိုချင်တဲ့ ပုံစံအတိုင်း ပြန် map လုပ်ပါ။
- `useQuery` နဲ့မတူဘဲ — `useQueries` က inline ရေးထားတဲ့ `select` ရဲ့ `data` argument ကို သူ့အလားတူ object ထဲက `queryFn` ကနေ infer လုပ်ပေးနိုင်စွမ်း မရှိပါဘူး (queries array တစ်ခုလုံးရဲ့ type ကို တစ်ပြိုင်နက် infer လုပ်ရလို့ `select` ရဲ့ parameter က `unknown` အဖြစ် ပြုတ်ကျပါတယ် — [TypeScript ရဲ့ သိထားတဲ့ ကန့်သတ်ချက်](https://github.com/TanStack/query/issues/6556) တစ်ခုပါ)။ ရှောင်ဖို့ — `select` ရဲ့ parameter ကို explicitly annotate လုပ်ပါ၊ ဒါမှမဟုတ် `queryOptions()` နဲ့ options တွေကို `useQueries` ဆီ မရောက်ခင် type တွေ ဖြေရှင်းပြီးသား ဖြစ်အောင် လုပ်ပါ။ ဒီကန့်သတ်ချက်က `useSuspenseQueries` မှာလည်း အတူတူပါပဲ။
- `placeholderData` က ဒီမှာလည်း ရပါတယ် — ဒါပေမယ့် `useQuery` နဲ့မတူဘဲ render တစ်ခုနဲ့တစ်ခုကြား query အရေအတွက် ကွာနိုင်လို့ အရင်က render လုပ်ခဲ့တဲ့ query တွေရဲ့ အချက်အလက်ကို လက်ခံရရှိမှာ မဟုတ်ပါဘူး။

## ဥပမာများ

Dynamic id list တစ်ခုကနေ query တွေ တစ်ပြိုင်နက် ဆွဲယူခြင်း:

```tsx
import { useQueries } from '@tanstack/react-query'

function Posts({ ids }: { ids: Array<number> }) {
  const postQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
      staleTime: Infinity,
    })),
  })

  return (
    <ul>
      {postQueries.map((query, index) => {
        if (query.isPending) return <li key={ids[index]}>Loading...</li>
        if (query.isError) return <li key={ids[index]}>Error: {query.error.message}</li>
        return <li key={ids[index]}>{query.data.title}</li>
      })}
    </ul>
  )
}
```

`combine` နဲ့ results တွေကို value တစ်ခုတည်းအဖြစ် ပေါင်းစပ်ခြင်း:

```tsx
import { useQueries } from '@tanstack/react-query'

function Posts({ ids }: { ids: Array<number> }) {
  const { data, isPending, isError } = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['post', id],
      queryFn: () => fetchPost(id),
    })),
    combine: (postQueries) => {
      return {
        data: postQueries.map((query) => query.data),
        isPending: postQueries.some((query) => query.isPending),
        isError: postQueries.some((query) => query.isError),
      }
    },
  })

  if (isPending) return 'Loading...'
  if (isError) return 'Error loading posts'

  return (
    <ul>
      {data.map((post) => (
        <li key={post?.id}>{post?.title}</li>
      ))}
    </ul>
  )
}
```

Inline `select` ရဲ့ type ကန့်သတ်ချက်ကို `queryOptions` နဲ့ ရှောင်ခြင်း — သတိပြုစရာ: `queryOptions` ရဲ့ result ကို spread လုပ်ပြီး `select` ကို inline ပြန်ထည့်ရင် `unknown` အဖြစ် ပြန်ပြုတ်ကျပါသေးတယ် — spread ထားတဲ့ options တစ်ခုလုံးကို `queryOptions` ထဲ ထပ်ထုပ်မှသာ `useQueries` ဆီ မရောက်ခင် type ဖြေရှင်းပြီးသား ဖြစ်ပါတယ်:

```tsx
import { queryOptions, useQueries } from '@tanstack/react-query'

const postOptions = (id: number) =>
  queryOptions({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  })

function PostTitle({ id }: { id: number }) {
  const [{ data: broken }] = useQueries({
    queries: [
      {
        ...postOptions(id),
        // ❌ `data` က ဒီနေရာမှာ `unknown` ဖြစ်နေမယ်
        select: (data) => data.title,
      },
    ],
  })

  const [{ data: fixed }] = useQueries({
    queries: [
      queryOptions({
        ...postOptions(id),
        // ✅ `data` က `Post` type ရပြီ
        select: (data) => data.title,
      }),
    ],
  })

  return <h1>{fixed}</h1>
}
```

`queryOptions` helper အကြောင်း အသေးစိတ်ကို [Query Options](/docs/tanstack-query/query-options) မှာ ဖတ်နိုင်ပါတယ်။
