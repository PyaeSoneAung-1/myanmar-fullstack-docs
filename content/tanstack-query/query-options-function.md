---
title: "queryOptions (query များအတွက် options object ကြိုတင်ဖန်တီးရန် function)"
description: "queryOptions ရဲ့ overloads, type parameters နဲ့ Returns — hooks နဲ့ imperative API များကြားမှာ မျှဝေသုံးနိုင်သော query options object ကို ကြိုတင်ဖန်တီးခြင်း"
order: 72
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/queryOptions"
status: translated
updated: 2026-09-05
---

`useQuery`, `useSuspenseQuery` နဲ့ `queryClient.query` လို API တွေကြားမှာ မျှဝေသုံးနိုင်တဲ့ — query options object တစ်ခုကို ကြိုတင် ဖန်တီးပေးတဲ့ function ဖြစ်ပါတယ်။ Query key နဲ့ query function ကို နေရာတစ်ခုတည်းမှာ co-located ဖြစ်အောင် ထားနိုင်ပြီး — TypeScript type inference ကိုပါ ရရှိစေပါတယ် ([Query Options guide](/docs/tanstack-query/query-options) ကို ကြည့်ပါ)။

## Call Signature

```ts
function queryOptions<TQueryFnData, TError, TData, TQueryKey>(options): Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryFn"> & object & QueryKeyWithDataTag<TQueryKey, TQueryFnData, TError>;
```

`useQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံးကို `queryOptions` ဆီလည်း ယေဘုယျအားဖြင့် ပို့နိုင်ပါတယ်။ ဒီ options တွေကို hooks တွေနဲ့ `queryClient.query` လို imperative API တွေကြားမှာ မျှဝေသုံးနိုင်ပါတယ်။ `options.queryKey` က required ဖြစ်ပြီး — ဒါက options တွေ ထုတ်ပေးဖို့ သုံးမယ့် query key ဖြစ်ပါတယ်။

`initialData` သတ်မှတ်ထားတဲ့အခါ ဒီ overload ကို ရွေးချယ် အသုံးပြုပါတယ် — ဒါကြောင့် ရလာတဲ့ `data` က ဘယ်တော့မှ `undefined` မဖြစ်ပါဘူး။

### Type Parameters

#### TQueryFnData

`TQueryFnData` = `unknown`

#### TError

`TError` = `Error`

#### TData

`TData` = `TQueryFnData`

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

### Parameters

#### options

[`DefinedInitialDataOptions`](/docs/tanstack-query/defined-initial-data-options)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

သုံးမယ့် options ရဲ့ type ကတော့ [`DefinedInitialDataOptions`](/docs/tanstack-query/defined-initial-data-options) — `useQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံး ပါဝင်ပြီး `initialData` ကိုပါ သတ်မှတ်ထားပါတယ်။

### Returns

ထည့်လိုက်တဲ့ options object အတိုင်း ပြန်ပေးပါတယ် — `queryKey` က inferred လုပ်ထားတဲ့ data type ကို သယ်ဆောင်နိုင်အောင် type သတ်မှတ်ပေးထားပါတယ်။

### See

- [`useQuery`](/docs/tanstack-query/use-query) နဲ့ ဒီ options တွေကို သုံးပြီး query run လုပ်ပါ။
- ဒီ pattern အကြောင်း ပိုလေ့လာချင်ရင် [The Query Options API](https://tkdodo.eu/blog/the-query-options-api) ကို ကြည့်ပါ။

### Example

```tsx
import { queryOptions, useQuery } from '@tanstack/react-query'

export const postsOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  initialData: [],
})

function Posts() {
  // `data` is `Post[]`, never `undefined`, thanks to `initialData` — even if a refetch fails,
  // so the list stays visible alongside the error.
  const { data, isError, error } = useQuery(postsOptions)

  return (
    <div>
      {isError ? <span>Error: {error.message}</span> : null}
      <ul>
        {data.map((post) => <li key={post.id}>{post.title}</li>)}
      </ul>
    </div>
  )
}
```

## Call Signature

```ts
function queryOptions<TQueryFnData, TError, TData, TQueryKey>(options): OmitKeyof<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryFn"> & object & QueryKeyWithDataTag<TQueryKey, TQueryFnData, TError>;
```

`useQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံးကို `queryOptions` ဆီလည်း ယေဘုယျအားဖြင့် ပို့နိုင်ပါတယ်။ ဒီ options တွေကို hooks တွေနဲ့ `queryClient.query` လို imperative API တွေကြားမှာ မျှဝေသုံးနိုင်ပါတယ်။ `options.queryKey` က required ဖြစ်ပြီး — ဒါက options တွေ ထုတ်ပေးဖို့ သုံးမယ့် query key ဖြစ်ပါတယ်။

### Type Parameters

#### TQueryFnData

`TQueryFnData` = `unknown`

#### TError

`TError` = `Error`

#### TData

`TData` = `TQueryFnData`

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

### Parameters

#### options

[`UnusedSkipTokenOptions`](/docs/tanstack-query/unused-skip-token-options)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

သုံးမယ့် options ရဲ့ type ကတော့ [`UnusedSkipTokenOptions`](/docs/tanstack-query/unused-skip-token-options) — `useQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံး ပါဝင်ပါတယ်။

### Returns

ထည့်လိုက်တဲ့ options object အတိုင်း ပြန်ပေးပါတယ် — `queryKey` က inferred လုပ်ထားတဲ့ data type ကို သယ်ဆောင်နိုင်အောင် type သတ်မှတ်ပေးထားပါတယ်။

### See

- [`useQuery`](/docs/tanstack-query/use-query) နဲ့ ဒီ options တွေကို သုံးပြီး query run လုပ်ပါ။
- ဒီ pattern အကြောင်း ပိုလေ့လာချင်ရင် [The Query Options API](https://tkdodo.eu/blog/the-query-options-api) ကို ကြည့်ပါ။

### Example

Parameterized factory ပုံစံ — `id` တစ်ခုစီအတွက် တူညီတဲ့ options object ကို ပြန်သုံးနိုင်အောင် လုပ်ထားတာပါ:
```tsx
import { queryOptions, useQuery } from '@tanstack/react-query'

export const postOptions = (id: string) =>
  queryOptions({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  })

function Post({ id }: { id: string }) {
  const { data, isPending, isError, error } = useQuery(postOptions(id))

  if (isPending) return 'Loading...'
  if (isError) return <span>Error: {error.message}</span>

  return <h1>{data.title}</h1>
}
```

## Call Signature

```ts
function queryOptions<TQueryFnData, TError, TData, TQueryKey>(options): UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & object & QueryKeyWithDataTag<TQueryKey, TQueryFnData, TError>;
```

`useQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံးကို `queryOptions` ဆီလည်း ယေဘုယျအားဖြင့် ပို့နိုင်ပါတယ်။ ဒီ options တွေကို hooks တွေနဲ့ `queryClient.query` လို imperative API တွေကြားမှာ မျှဝေသုံးနိုင်ပါတယ်။ `options.queryKey` က required ဖြစ်ပြီး — ဒါက options တွေ ထုတ်ပေးဖို့ သုံးမယ့် query key ဖြစ်ပါတယ်။

### Type Parameters

#### TQueryFnData

`TQueryFnData` = `unknown`

#### TError

`TError` = `Error`

#### TData

`TData` = `TQueryFnData`

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

### Parameters

#### options

[`UndefinedInitialDataOptions`](/docs/tanstack-query/undefined-initial-data-options)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`\>

သုံးမယ့် options ရဲ့ type ကတော့ [`UndefinedInitialDataOptions`](/docs/tanstack-query/undefined-initial-data-options) — `useQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံး ပါဝင်ပါတယ်။

### Returns

ထည့်လိုက်တဲ့ options object အတိုင်း ပြန်ပေးပါတယ် — `queryKey` က inferred လုပ်ထားတဲ့ data type ကို သယ်ဆောင်နိုင်အောင် type သတ်မှတ်ပေးထားပါတယ်။

### See

- [`useQuery`](/docs/tanstack-query/use-query) နဲ့ ဒီ options တွေကို သုံးပြီး query run လုပ်ပါ။
- ဒီ pattern အကြောင်း ပိုလေ့လာချင်ရင် [The Query Options API](https://tkdodo.eu/blog/the-query-options-api) ကို ကြည့်ပါ။

### Remarks

ဒီ overload ကသာ `queryFn: skipToken` ကို လက်ခံနိုင်ပြီး — ဥပမာကို အောက်မှာ ပြထားပါတယ်။

### Examples

Parameterized factory ပုံစံ — `id` တစ်ခုစီအတွက် တူညီတဲ့ options object ကို ပြန်သုံးနိုင်အောင် လုပ်ထားတာပါ:
```tsx
import { queryOptions, useQuery } from '@tanstack/react-query'

export const postOptions = (id: string) =>
  queryOptions({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
  })

function Post({ id }: { id: string }) {
  const { data, isPending, isError, error } = useQuery(postOptions(id))

  if (isPending) return 'Loading...'
  if (isError) return <span>Error: {error.message}</span>

  return <h1>{data.title}</h1>
}
```

`postId` သတ်မှတ်မပြီးမချိန်အထိ query ကို type-safe ဖြစ်အောင် disable လုပ်ပေးတဲ့ factory ပုံစံ:
```tsx
import { queryOptions, skipToken, useQuery } from '@tanstack/react-query'

export const postOptions = (postId: number | undefined) =>
  queryOptions({
    queryKey: ['post', postId],
    queryFn: postId != null ? () => fetchPost(postId) : skipToken,
  })

function Post({ postId }: { postId: number | undefined }) {
  const { data, isLoading, isError, error } = useQuery(postOptions(postId))

  if (postId == null) return 'Select a post'
  if (isLoading) return 'Loading...'
  if (isError) return <span>Error: {error.message}</span>

  return <h1>{data?.title}</h1>
}
```
