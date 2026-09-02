---
title: "useQuery (Query run လုပ်ရန် hook)"
description: "useQuery ရဲ့ call signature, type parameters, options နဲ့ Returns — query တစ်ခုကို declare လုပ်ပြီး run/cache လုပ်ခြင်း"
order: 37
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/useQuery"
status: translated
updated: 2026-09-02
---

## Call Signature

```ts
function useQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient?): UseQueryResult<TData, TError>;
```

TanStack Query ရဲ့ အဓိက hook ဖြစ်ပြီး — query တစ်ခုကို component ထဲမှာ declare လုပ်ပြီး run ဖို့ သုံးပါတယ်။ Query ရဲ့ နောက်ကွယ်က mechanism (cache, status, refetch စတာတွေ) အကြောင်းကို [Queries အသေးစိတ်](/docs/tanstack-query/queries) မှာ ရှင်းပြထားပြီးဖြစ်လို့ — ဒီစာမျက်နှာက reference အနေနဲ့ signature, options နဲ့ result တွေကို အာရုံစိုက်ပါမယ်။

`useQuery` ကို TypeScript overload ၃ မျိုးနဲ့ သတ်မှတ်ထားပြီး — အပေါ်က signature က အခြေခံပုံစံပါ။ Overload တွေကြားက ကွာခြားချက်က options type ပေါ်မှာ မူတည်ပါတယ်:

- `initialData` သတ်မှတ်ထားတဲ့ options ([`DefinedInitialDataOptions`](https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/DefinedInitialDataOptions)) နဲ့ ခေါ်ရင် — return type က [`DefinedUseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/DefinedUseQueryResult) ဖြစ်ပြီး `data` က ဘယ်တော့မှ `undefined` မဖြစ်ပါဘူး။ `initialData` က data ကို အစကတည်းက အာမခံထားလို့ — refetch မှာ error ဖြစ်ရင်တောင် မူလ data ကို ဆက်ပြထားနိုင်ပြီး၊ ဒီ overload ရဲ့ type ထဲမှာ `status` က `pending` ဆိုတဲ့ အခြေအနေ မပါဝင်တော့ပါဘူး။
- `initialData` မပါတဲ့ options ([`UndefinedInitialDataOptions`](https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UndefinedInitialDataOptions) / [`UseQueryOptions`](https://tanstack.com/query/latest/docs/framework/react/reference/interfaces/UseQueryOptions)) နဲ့ ခေါ်ရင် — result က [`UseQueryResult`](https://tanstack.com/query/latest/docs/framework/react/reference/type-aliases/UseQueryResult) ဖြစ်ပြီး cache ထဲမှာ ပြစရာ data မရှိသေးသရွေ့ `data` က `undefined` ဖြစ်နိုင်ပါတယ်။

## Type Parameters

| Type Parameter | Default | အဓိပ္ပာယ် |
|---|---|---|
| `TQueryFnData` | `unknown` | `queryFn` က resolve လုပ်ပေးတဲ့ raw data ရဲ့ type |
| `TError` | `Error` | `queryFn` က throw နိုင်တဲ့ error ရဲ့ type |
| `TData` | `TQueryFnData` | `select` transformation ပြီးနောက် `data` ထဲမှာ ရောက်ရှိတဲ့ type |
| `TQueryKey` | `readonly unknown[]` | query key ရဲ့ type — `QueryKey` ကို extend လုပ်ထားရမယ် |

## Parameters

**`options`** — overload အလိုက် `DefinedInitialDataOptions` / `UndefinedInitialDataOptions` / `UseQueryOptions` type ဖြစ်ပြီး — `useQuery` ဆီ ပို့လို့ရတဲ့ option အကုန်လုံး ဒီထဲမှာ ပါဝင်ပါတယ်။ အသုံးအများဆုံး option တွေက:

| Option | အဓိပ္ပာယ် |
|---|---|
| `queryKey` | query ကို ခွဲခြားတဲ့ unique key (required) — [Query Keys](/docs/tanstack-query/query-keys) |
| `queryFn` | data ရအောင် resolve လုပ်တဲ့ Promise-returning function (required) — [Query Functions](/docs/tanstack-query/query-functions) |
| `enabled` | `false` ထားရင် query က အလိုအလျောက် run မှာ မဟုတ်ဘူး — [Disabling Queries](/docs/tanstack-query/disabling-queries) |
| `staleTime` / `gcTime` | data ကို fresh လို့ သတ်မှတ်တဲ့ ကြာချိန် / cache ကနေ ဖျက်ပစ်ခင် စောင့်တဲ့ ကြာချိန် — [Caching အခြေခံ](/docs/tanstack-query/cache) |
| `retry` | failed query တွေကို ပြန်ကြိုးစားတဲ့ အကြိမ်ရေ — [Query Retries](/docs/tanstack-query/query-retries) |
| `select` | cache ထဲက data ကနေ component လိုအပ်တဲ့ ပုံစံသစ်ကို ထုတ်ပေးတဲ့ transformation (cache ထဲက မူရင်း data ကို မပြောင်းပါဘူး) |
| `initialData` | cache ထဲ data မရှိသေးချိန်မှာ ကြိုတင်ပြမယ့် data — [Initial Query Data](/docs/tanstack-query/initial-query-data) |
| `placeholderData` | loading state နေရာမှာ ယာယီပြဖို့ data (ဥပမာ `keepPreviousData`) — [Placeholder Query Data](/docs/tanstack-query/placeholder-query-data) |
| `refetchOnWindowFocus` | window ပြန် focus ဖြစ်တဲ့အခါ refetch လုပ်မလား — default `true` |
| `meta` | query နဲ့အတူ သယ်သွားချင်တဲ့ အချက်အလက် (retry/error handler တွေမှာ ပြန်ဖတ်လို့ရ) |

ဒီ options တွေကို `useQuery` နဲ့ `queryClient.query()` လို imperative API တွေကြားမှာ မျှဝေသုံးချင်ရင် — [`queryOptions`](/docs/tanstack-query/query-options) helper ကို သုံးပါ; ဒါက type inference ကိုပါ ထိန်းသိမ်းပေးပါတယ်။

**`queryClient?`** — custom `QueryClient` instance တစ်ခုကို သုံးချင်ရင် ဒီနေရာမှာ ပို့ပါ။ မပို့ရင် component tree ထဲက အနီးဆုံး `QueryClientProvider` context ကနေ အလိုအလျောက် ယူပါတယ် — [useQueryClient](/docs/tanstack-query/use-query-client) ကို ကြည့်ပါ။

## Returns

`UseQueryResult<TData, TError>` — (`initialData` overload မှာတော့ `DefinedUseQueryResult` ။) QueryObserverResult ကို အခြေခံတဲ့ result object ဖြစ်ပြီး — cache ထဲမှာ ပြစရာ data မရှိရင် `status` က `pending`, နောက်ဆုံး fetch attempt မအောင်မြင်ရင် `error`, ပြစရာ data ရှိနေရင် `success` ဖြစ်ပါတယ်။ `isPending`/`isSuccess`/`isError` တွေက ဒီ status ကနေ ဆင်းသက်လာတဲ့ convenience booleans တွေပါ။ အဓိက fields တွေက:

| Property | အဓိပ္ပာယ် |
|---|---|
| `status` | `'pending'` \| `'error'` \| `'success'` — data ရှိ/မရှိ အခြေအနေ |
| `fetchStatus` | `'fetching'` \| `'paused'` \| `'idle'` — `queryFn` အလုပ်လုပ်နေလား ဆိုတဲ့ အခြေအနေ |
| `data` | query data — `success` မဟုတ်ရင် `undefined` |
| `dataUpdatedAt` | data နောက်ဆုံး update ဖြစ်တဲ့ timestamp (number) |
| `error` | နောက်ဆုံး error (မရှိရင် `null`) |
| `errorUpdatedAt` / `errorUpdateCount` | error နောက်ဆုံး ဖြစ်တဲ့ အချိန် / error update အကြိမ်ရေ |
| `failureCount` / `failureReason` | ဆက်တိုက် မအောင်မြင်တဲ့ အကြိမ်ရေ / နောက်ဆုံး failure ရဲ့ အကြောင်းရင်း |
| `isFetching` / `isPaused` | `fetchStatus` ကနေ ဆင်းသက်လာတဲ့ flags |
| `isLoading` | ပထမဆုံး fetch run နေချိန် (`isFetching && isPending`) |
| `isRefetching` | data ရှိပြီးသားပေမယ့် background refetch ဖြစ်နေတာ (`isFetching && !isPending`) |
| `isStale` | data က stale ဖြစ်နေလား |
| `isFetched` / `isFetchedAfterMount` | query fetch ဖြစ်ဖူးလား / component mount ပြီးမှ fetch ဖြစ်ခဲ့လား |
| `isPlaceholderData` | လက်ရှိ data က `placeholderData` ကလာတာလား |
| `refetch()` | query ကို ကိုယ်တိုင် ပြန် fetch လုပ်တဲ့ function (Promise return) |

## ဥပမာများ

အခြေခံအသုံးပြုပုံ — `status` တစ်ခုချင်းစီအတွက် UI ခွဲပြီး background update ဖြစ်နေတာကိုပါ ပြတာပါ:

```tsx
import { useQuery } from '@tanstack/react-query'

function Posts() {
  const { status, data, error, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (status === 'pending') return 'Loading...'
  if (status === 'error') return <span>Error: {error.message}</span>

  return (
    <div>
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      <div>{isFetching ? 'Background Updating...' : ' '}</div>
    </div>
  )
}
```

`select` နဲ့ cache ထဲက data ကို မပြောင်းဘဲ component လိုအပ်တဲ့ ပုံစံအဖြစ် ပြောင်းယူခြင်း — cache ထဲမှာ `Post[]` အပြည့်အစုံ ရှိနေဆဲဖြစ်ပြီး `data` ကတော့ `number` ဖြစ်နေပါတယ်:

```tsx
import { useQuery } from '@tanstack/react-query'

function PostCount() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    select: (posts) => posts.length,
  })

  if (isPending) return 'Loading...'
  if (isError) return <span>Error: {error.message}</span>

  return <span>{data} posts</span>
}
```

ဆက်စပ်လေ့လာစရာများ — dependent query တွေမှာ `isLoading` ကို ဘာကြောင့် သုံးသလဲဆိုတာ [Dependent Queries](/docs/tanstack-query/dependent-queries) မှာ၊ `skipToken` နဲ့ type-safe ဖြစ်အောင် query disable လုပ်နည်းကို [Disabling Queries](/docs/tanstack-query/disabling-queries) နဲ့ [TypeScript](/docs/tanstack-query/typescript) မှာ၊ cache ထဲက list data ကနေ detail query ကို seed လုပ်တာနဲ့ `keepPreviousData` pagination ပုံစံတွေကို [Initial Query Data](/docs/tanstack-query/initial-query-data) နဲ့ [Paginated Queries](/docs/tanstack-query/paginated-queries) မှာ ကြည့်နိုင်ပါတယ်။
