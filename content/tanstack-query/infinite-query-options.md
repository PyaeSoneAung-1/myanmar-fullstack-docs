---
title: "infiniteQueryOptions (infinite query များအတွက် options object ကြိုတင်ဖန်တီးရန် function)"
description: "infiniteQueryOptions ရဲ့ overloads, type parameters နဲ့ Returns — useInfiniteQuery / queryClient.infiniteQuery တို့အတွက် options object ကို ကြိုတင်ဖန်တီးပြီး type inference ရရှိစေခြင်း"
order: 70
source: "https://tanstack.com/query/latest/docs/framework/react/reference/functions/infiniteQueryOptions"
status: translated
updated: 2026-09-05
---

`useInfiniteQuery` ဒါမှမဟုတ် `queryClient.infiniteQuery` လို infinite query APIs တွေကို ခေါ်တဲ့အခါ တွဲသုံးဖို့ — options object တစ်ခုကို ကြိုတင် ဖန်တီးပေးတဲ့ function ဖြစ်ပါတယ်။ Query key နဲ့ query function ကို နေရာတစ်ခုတည်းမှာ သတ်မှတ်ထားနိုင်ပြီး — TypeScript type inference ကိုပါ အပြည့်အဝ ရရှိစေပါတယ်။

## Call Signature

```ts
function infiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options): UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & object & QueryKeyWithDataTag<TQueryKey, InfiniteData<TQueryFnData, unknown>, TError>;
```

`useInfiniteQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံးကို `infiniteQueryOptions` ဆီလည်း ယေဘုယျအားဖြင့် ပို့နိုင်ပါတယ်။ ဒီ options တွေကို hooks တွေနဲ့ `queryClient.infiniteQuery` လို imperative API တွေကြားမှာ မျှဝေသုံးနိုင်ပါတယ်။ `options.queryKey` က required ဖြစ်ပြီး — ဒါက options တွေ ထုတ်ပေးဖို့ သုံးမယ့် query key ဖြစ်ပါတယ်။

`initialData` သတ်မှတ်ထားတဲ့အခါ ဒီ overload ကို ရွေးချယ် အသုံးပြုပါတယ်။

### Type Parameters

#### TQueryFnData

`TQueryFnData`

#### TError

`TError` = `Error`

#### TData

`TData` = `InfiniteData`\<`TQueryFnData`, `unknown`\>

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### TPageParam

`TPageParam` = `unknown`

### Parameters

#### options

[`DefinedInitialDataInfiniteOptions`](/docs/tanstack-query/defined-initial-data-infinite-options)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

သုံးမယ့် options ရဲ့ type ကတော့ [`DefinedInitialDataInfiniteOptions`](/docs/tanstack-query/defined-initial-data-infinite-options) — `useInfiniteQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံး ပါဝင်ပြီး `initialData` ကိုပါ သတ်မှတ်ထားပါတယ်။

### Returns

ထည့်လိုက်တဲ့ options object အတိုင်း ပြန်ပေးပါတယ် — `queryKey` က inferred လုပ်ထားတဲ့ data type ကို သယ်ဆောင်နိုင်အောင် type သတ်မှတ်ပေးထားပါတယ်။

### See

ဒီ options တွေနဲ့ infinite query run လုပ်ဖို့ [`useInfiniteQuery`](/docs/tanstack-query/use-infinite-query) ကို ကြည့်ပါ။

### Remarks

နောက်ထပ် pages တွေကို — button click ကနေဖြစ်စေ၊ သုံးသူ scroll လုပ်လိုက်တာနဲ့ အလိုအလျောက် ဖြစ်စေ — fetch လုပ်တဲ့ ဥပမာတွေအတွက် [`useInfiniteQuery`](/docs/tanstack-query/use-infinite-query) ကို ကြည့်ပါ။

### Example

```tsx
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const projectsOptions = infiniteQueryOptions({
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjects(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextId,
  initialData: { pages: [], pageParams: [] },
})

function Projects() {
  // `data` is never `undefined`, thanks to `initialData` — even if a refetch fails, so the
  // list stays visible alongside the error.
  const { data, isError, error } = useInfiniteQuery(projectsOptions)

  return (
    <div>
      {isError ? <span>Error: {error.message}</span> : null}
      <ul>
        {data.pages.map((page) => page.projects.map((p) => <li key={p.id}>{p.name}</li>))}
      </ul>
    </div>
  )
}
```

## Call Signature

```ts
function infiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options): OmitKeyof<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>, "queryFn"> & object & QueryKeyWithDataTag<TQueryKey, InfiniteData<TQueryFnData, unknown>, TError>;
```

`useInfiniteQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံးကို `infiniteQueryOptions` ဆီလည်း ယေဘုယျအားဖြင့် ပို့နိုင်ပါတယ်။ ဒီ options တွေကို hooks တွေနဲ့ `queryClient.infiniteQuery` လို imperative API တွေကြားမှာ မျှဝေသုံးနိုင်ပါတယ်။ `options.queryKey` က required ဖြစ်ပြီး — ဒါက options တွေ ထုတ်ပေးဖို့ သုံးမယ့် query key ဖြစ်ပါတယ်။

### Type Parameters

#### TQueryFnData

`TQueryFnData`

#### TError

`TError` = `Error`

#### TData

`TData` = `InfiniteData`\<`TQueryFnData`, `unknown`\>

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### TPageParam

`TPageParam` = `unknown`

### Parameters

#### options

[`UnusedSkipTokenInfiniteOptions`](/docs/tanstack-query/unused-skip-token-infinite-options)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

သုံးမယ့် options ရဲ့ type ကတော့ [`UnusedSkipTokenInfiniteOptions`](/docs/tanstack-query/unused-skip-token-infinite-options) — `useInfiniteQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံး ပါဝင်ပါတယ်။

### Returns

ထည့်လိုက်တဲ့ options object အတိုင်း ပြန်ပေးပါတယ် — `queryKey` က inferred လုပ်ထားတဲ့ data type ကို သယ်ဆောင်နိုင်အောင် type သတ်မှတ်ပေးထားပါတယ်။

### Remarks

နောက်ထပ် pages တွေကို — button click ကနေဖြစ်စေ၊ သုံးသူ scroll လုပ်လိုက်တာနဲ့ အလိုအလျောက် ဖြစ်စေ — fetch လုပ်တဲ့ ဥပမာတွေအတွက် [`useInfiniteQuery`](/docs/tanstack-query/use-infinite-query) ကို ကြည့်ပါ။

### Example

Parameterized factory ပုံစံ — `postId` တစ်ခုစီအတွက် တူညီတဲ့ options object ကို ပြန်သုံးနိုင်အောင် လုပ်ထားတာပါ:
```tsx
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const commentsOptions = (postId: string) =>
  infiniteQueryOptions({
    queryKey: ['post', postId, 'comments'],
    queryFn: ({ pageParam }) => fetchComments(postId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId,
  })

function Comments({ postId }: { postId: string }) {
  const { data, isPending, isError, error } = useInfiniteQuery(commentsOptions(postId))

  if (isPending) return 'Loading...'
  if (isError) return <span>Error: {error.message}</span>

  return (
    <ul>
      {data.pages.map((page) => page.comments.map((c) => <li key={c.id}>{c.text}</li>))}
    </ul>
  )
}
```

### See

ဒီ options တွေနဲ့ infinite query run လုပ်ဖို့ [`useInfiniteQuery`](/docs/tanstack-query/use-infinite-query) ကို ကြည့်ပါ။

## Call Signature

```ts
function infiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>(options): UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam> & object & QueryKeyWithDataTag<TQueryKey, InfiniteData<TQueryFnData, unknown>, TError>;
```

`useInfiniteQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံးကို `infiniteQueryOptions` ဆီလည်း ယေဘုယျအားဖြင့် ပို့နိုင်ပါတယ်။ ဒီ options တွေကို hooks တွေနဲ့ `queryClient.infiniteQuery` လို imperative API တွေကြားမှာ မျှဝေသုံးနိုင်ပါတယ်။ `options.queryKey` က required ဖြစ်ပြီး — ဒါက options တွေ ထုတ်ပေးဖို့ သုံးမယ့် query key ဖြစ်ပါတယ်။

### Type Parameters

#### TQueryFnData

`TQueryFnData`

#### TError

`TError` = `Error`

#### TData

`TData` = `InfiniteData`\<`TQueryFnData`, `unknown`\>

#### TQueryKey

`TQueryKey` *extends* readonly `unknown`[] = readonly `unknown`[]

#### TPageParam

`TPageParam` = `unknown`

### Parameters

#### options

[`UndefinedInitialDataInfiniteOptions`](/docs/tanstack-query/undefined-initial-data-infinite-options)\<`TQueryFnData`, `TError`, `TData`, `TQueryKey`, `TPageParam`\>

သုံးမယ့် options ရဲ့ type ကတော့ [`UndefinedInitialDataInfiniteOptions`](/docs/tanstack-query/undefined-initial-data-infinite-options) — `useInfiniteQuery` ဆီ ပို့နိုင်သမျှ အရာအားလုံး ပါဝင်ပါတယ်။

### Returns

ထည့်လိုက်တဲ့ options object အတိုင်း ပြန်ပေးပါတယ် — `queryKey` က inferred လုပ်ထားတဲ့ data type ကို သယ်ဆောင်နိုင်အောင် type သတ်မှတ်ပေးထားပါတယ်။

### Remarks

နောက်ထပ် pages တွေကို (button click ကနေဖြစ်စေ၊ သုံးသူ scroll လုပ်လိုက်တာနဲ့ အလိုအလျောက် ဖြစ်စေ) fetch လုပ်တာနဲ့ — `postId` သတ်မှတ်မပြီးမချိန်အထိ `skipToken` သုံးပြီး query ကို disable လုပ်ထားတာ — စတဲ့ ဥပမာတွေအတွက် [`useInfiniteQuery`](/docs/tanstack-query/use-infinite-query) ကို ကြည့်ပါ။

### Example

Parameterized factory ပုံစံ — `postId` တစ်ခုစီအတွက် တူညီတဲ့ options object ကို ပြန်သုံးနိုင်အောင် လုပ်ထားတာပါ:
```tsx
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'

export const commentsOptions = (postId: string) =>
  infiniteQueryOptions({
    queryKey: ['post', postId, 'comments'],
    queryFn: ({ pageParam }) => fetchComments(postId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextId,
  })

function Comments({ postId }: { postId: string }) {
  const { data, isPending, isError, error } = useInfiniteQuery(commentsOptions(postId))

  if (isPending) return 'Loading...'
  if (isError) return <span>Error: {error.message}</span>

  return (
    <ul>
      {data.pages.map((page) => page.comments.map((c) => <li key={c.id}>{c.text}</li>))}
    </ul>
  )
}
```

### See

ဒီ options တွေနဲ့ infinite query run လုပ်ဖို့ [`useInfiniteQuery`](/docs/tanstack-query/use-infinite-query) ကို ကြည့်ပါ။
