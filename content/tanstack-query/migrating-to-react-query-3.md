---
title: "Migrating to React Query 3 (React Query 3 သို့ ပြောင်းရွှေ့ခြင်း)"
description: "React Query v2 ကနေ v3 သို့ ပြောင်းရွှေ့ရာမှာ သိထားရမယ့် breaking changes များနဲ့ feature အသစ်များ — QueryClient/QueryCache ခွဲခြားမှု, QueryClientProvider, useQueries, select, QueryObserver စသည်"
order: 67
source: "https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-react-query-3"
status: translated
updated: 2026-09-02
---

React Query ရဲ့ အရင် version တွေက ကောင်းမွန်ပြီး — feature အသစ်တွေ၊ magic တွေ ပိုမိုပါဝင်လာကာ library ရဲ့ အသုံးပြုမှု အတွေ့အကြုံတစ်ခုလုံးကို ပိုကောင်းစေခဲ့ပါတယ်။ အဲဒါတွေနဲ့အတူ — library ကို လူအများအပြား လက်ခံသုံးစွဲလာခဲ့ပြီး — (issues/contributions တွေကနေတစ်ဆင့်) library ကို ပိုကောင်းအောင် ပွတ်တိုက်ပြုပြင်ဖို့ လိုအပ်တဲ့ အချက်တချို့ကိုလည်း မီးမောင်းထိုးပြနိုင်ခဲ့ပါတယ်။ v3 မှာ အဲဒီ polish တွေ ပါဝင်ပါတယ်။

## အကြမ်းဖျင်း (Overview)

- ပိုပြီး scale လုပ်လို့ရပြီး test လုပ်ရလွယ်ကူတဲ့ cache configuration
- SSR support ပိုကောင်းလာခြင်း
- Data-lag (အရင်က usePaginatedQuery) — ဘယ်နေရာမှာမဆို!
- Bi-directional infinite queries
- Query data selectors!
- Queries နဲ့ mutations တွေကို မသုံးခင် defaults တွေကို အပြည့်အစုံ configure လုပ်နိုင်ခြင်း
- Optional rendering optimization အတွက် ပိုမို သေးစိတ်တဲ့ (granular) ထိန်းချုပ်မှု
- `useQueries` hook အသစ်! (အရှည် ပြောင်းလဲနိုင်တဲ့ parallel query execution)
- `useIsFetching()` hook အတွက် query filter support!
- Mutations အတွက် retry/offline/replay support
- React ရဲ့ အပြင်ဘက်မှာ queries/mutations တွေကို observe လုပ်ခြင်း
- React Query ရဲ့ core logic ကို လိုချင်တဲ့ နေရာမှာ သုံးနိုင်ခြင်း!
- `react-query/devtools` ကနေ bundled/colocated devtools
- Web storage ပေါ်ကို cache persistence (experimental — `react-query/persistQueryClient-experimental` နဲ့ `react-query/createWebStoragePersistor-experimental` ကနေ)

## Breaking Changes (ပြောင်းရွှေ့စဉ် သတိထားရမည့် အပြောင်းအလဲများ)

### `QueryCache` ကို `QueryClient` နဲ့ အောက်အဆင့် `QueryCache`, `MutationCache` instance များအဖြစ် ခွဲလိုက်ပြီ

`QueryCache` ထဲမှာ queries အားလုံး ပါဝင်ပြီး — `MutationCache` ထဲမှာ mutations အားလုံး ပါဝင်ပါတယ် — `QueryClient` ကတော့ configuration သတ်မှတ်ဖို့နဲ့ ၎င်းတို့နဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ သုံးပါတယ်။

ဒါက အကျိုးကျေးဇူးတချို့ ရှိပါတယ်:

- Caches အမျိုးအစား အမျိုးမျိုးကို ခွင့်ပြုပေးပါတယ်
- Configuration မတူတဲ့ clients အများအပြားက cache တစ်ခုတည်းကို သုံးနိုင်ပါတယ်
- Clients တွေက queries တွေကို track လုပ်ဖို့ သုံးနိုင်ပြီး — SSR မှာ shared caches တွေအတွက် သုံးနိုင်ပါတယ်
- Client API က သာမန် အသုံးပြုမှုတွေအတွက် ပိုပြီး အာရုံစိုက်ထားပါတယ်
- အစိတ်အပိုင်း တစ်ခုချင်းစီကို test လုပ်ရတာ ပိုလွယ်ကူပါတယ်

`new QueryClient()` တစ်ခု ဖန်တီးတဲ့အခါ — သင်ကိုယ်တိုင် မပေးသွင်းရင် `QueryCache` နဲ့ `MutationCache` တွေကို အလိုအလျောက် ဖန်တီးပေးပါတယ်။

```tsx
import { QueryClient } from 'react-query'

const queryClient = new QueryClient()
```

### `ReactQueryConfigProvider` နဲ့ `ReactQueryCacheProvider` — နှစ်ခုလုံးကို `QueryClientProvider` နဲ့ အစားထိုးလိုက်ပြီ

Queries နဲ့ mutations တွေအတွက် default options တွေကို အခု `QueryClient` ထဲမှာ သတ်မှတ်နိုင်ပါပြီ:

**အခု defaultConfig အစား defaultOptions ဖြစ်သွားတာ သတိပြုပါ**

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // query options
    },
    mutations: {
      // mutation options
    },
  },
})
```

`QueryClientProvider` component ကို အခု `QueryClient` တစ်ခုကို သင့် application နဲ့ ချိတ်ဆက်ဖို့ သုံးပါတယ်:

```tsx
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
}
```

### Default `QueryCache` မရှိတော့ပါဘူး — **ဒီတစ်ခါတော့ တကယ်ပါ!**

အရင်က deprecation နဲ့အတူ မှတ်ချက်ပြုခဲ့သလို — main package ကနေ ဖန်တီး/export လုပ်ပေးတဲ့ default `QueryCache` ဆိုတာ မရှိတော့ပါဘူး။ **သင်ကိုယ်တိုင် `new QueryClient()` ဒါမှမဟုတ် `new QueryCache()` (ပြီးရင် `new QueryClient({ queryCache })` ဆီ ပို့လို့ရတယ်) နဲ့ ဖန်တီးရပါမယ်**

### Deprecated ဖြစ်နေတဲ့ `makeQueryCache` utility ကို ဖယ်ရှားလိုက်ပြီ

ဒါက ကြာမြင့်စွာ စောင့်ခဲ့ရတဲ့ အပြောင်းအလဲတစ်ခုပါ — ဒါပေမယ့် နောက်ဆုံးတော့ ဖယ်ရှားလိုက်ပါပြီ :)

### `QueryCache.prefetchQuery()` ကို `QueryClient.prefetchQuery()` ဆီ ရွှေ့လိုက်ပြီ

`QueryClient.prefetchQuery()` function အသစ်က async ဖြစ်ပေမယ့် — **query ရဲ့ data ကို ပြန်မပေးပါဘူး**။ Data လိုအပ်တယ်ဆိုရင် — `QueryClient.fetchQuery()` function အသစ်ကို သုံးပါ

```tsx
// Prefetch a query:
await queryClient.prefetchQuery('posts', fetchPosts)

// Fetch a query:
try {
  const data = await queryClient.fetchQuery('posts', fetchPosts)
} catch (error) {
  // Error handling
}
```

### `ReactQueryErrorResetBoundary` နဲ့ `QueryCache.resetErrorBoundaries()` တို့ကို `QueryErrorResetBoundary` နဲ့ `useQueryErrorResetBoundary()` တို့နဲ့ အစားထိုးလိုက်ပြီ

ဒီနှစ်ခုက ပေါင်းပြီး အရင်ကလို အတွေ့အကြုံမျိုးကို ပေးပါတယ် — ဒါပေမယ့် — ဘယ် component trees တွေကို reset လုပ်ချင်လဲ ရွေးချယ်နိုင်တဲ့ ထိန်းချုပ်မှု ထပ်တိုးပါတယ်။ အသေးစိတ်အတွက် ကြည့်ပါ:

- [QueryErrorResetBoundary](https://tanstack.com/query/latest/docs/framework/react/reference/functions/QueryErrorResetBoundary)
- [useQueryErrorResetBoundary](https://tanstack.com/query/latest/docs/framework/react/reference/functions/useQueryErrorResetBoundary)

### `QueryCache.getQuery()` ကို `QueryCache.find()` နဲ့ အစားထိုးလိုက်ပြီ

Cache တစ်ခုထဲက query တစ်ခုချင်းစီကို ရှာဖို့ — အခု `QueryCache.find()` ကို သုံးရပါမယ်

### `QueryCache.getQueries()` ကို `QueryCache.findAll()` ဆီ ရွှေ့လိုက်ပြီ

Cache တစ်ခုထဲက queries အများအပြားကို ရှာဖို့ — အခု `QueryCache.findAll()` ကို သုံးရပါမယ်

### `QueryCache.isFetching` ကို `QueryClient.isFetching()` ဆီ ရွှေ့လိုက်ပြီ

**အခုတော့ property အစား function တစ်ခု ဖြစ်သွားတာ သတိပြုပါ**

### `useQueryCache` hook ကို `useQueryClient` hook နဲ့ အစားထိုးလိုက်ပြီ

ဒါက ၎င်းရဲ့ component tree အတွက် ပေးထားတဲ့ `queryClient` ကို ပြန်ပေးပြီး — rename လုပ်တာကလွဲရင် သိပ်ပြီး ပြင်ဆင်စရာ မလိုအပ်ပါဘူး။

### Query key ရဲ့ အပိုင်းတွေကို query function ဆီ automatic spread လုပ်တော့မှာ မဟုတ်ပါဘူး

သင့် query functions တွေဆီ parameters တွေ ပို့ဖို့ — inline functions တွေက အခု အကြံပြုထားတဲ့ နည်းလမ်း ဖြစ်ပါတယ်:

```tsx
// Old
useQuery(['post', id], (_key, id) => fetchPost(id))

// New
useQuery(['post', id], () => fetchPost(id))
```

Inline functions မသုံးချင်ဘူးဆိုရင်တော့ — အသစ်ပေးလိုက်တဲ့ `QueryFunctionContext` ကို သုံးနိုင်ပါတယ်:

```tsx
useQuery(['post', id], (context) => fetchPost(context.queryKey[1]))
```

### Infinite query ရဲ့ page params တွေကို အခု `QueryFunctionContext.pageParam` ကနေတစ်ဆင့် ပို့ပါတယ်

အရင်က ဒါတွေကို query function ထဲက နောက်ဆုံး query key parameter အနေနဲ့ ထည့်ပေးခဲ့ပေမယ့် — pattern တချို့အတွက် အဲဒါ ခက်ခဲစေတာ တွေ့ရှိခဲ့ရပါတယ်

```tsx
// Old
useInfiniteQuery(['posts'], (_key, pageParam = 0) => fetchPosts(pageParam))

// New
useInfiniteQuery(['posts'], ({ pageParam = 0 }) => fetchPosts(pageParam))
```

### usePaginatedQuery() ကို ဖယ်ရှားပြီး `keepPreviousData` option ကို သုံးပါ

`keepPreviousData` option အသစ်က `useQuery` နဲ့ `useInfiniteQuery` နှစ်ခုလုံးမှာ ရနိုင်ပြီး — သင့် data ပေါ်မှာ အရင်ကလိုပဲ "lagging" effect ရှိပါလိမ့်မယ်:

```tsx
import { useQuery } from 'react-query'

function Page({ page }) {
  const { data } = useQuery(['page', page], fetchPage, {
    keepPreviousData: true,
  })
}
```

### useInfiniteQuery() က အခု bi-directional ဖြစ်လာပြီ

`useInfiniteQuery()` ရဲ့ interface က bi-directional infinite lists တွေကို အပြည့်အဝ ပံ့ပိုးဖို့ ပြောင်းလဲသွားပါပြီ။

- `options.getFetchMore` ကို `options.getNextPageParam` လို့ အမည်ပြောင်းလိုက်ပြီ
- `queryResult.canFetchMore` ကို `queryResult.hasNextPage` လို့ အမည်ပြောင်းလိုက်ပြီ
- `queryResult.fetchMore` ကို `queryResult.fetchNextPage` လို့ အမည်ပြောင်းလိုက်ပြီ
- `queryResult.isFetchingMore` ကို `queryResult.isFetchingNextPage` လို့ အမည်ပြောင်းလိုက်ပြီ
- `options.getPreviousPageParam` option ကို ထပ်ထည့်လိုက်ပြီ
- `queryResult.hasPreviousPage` property ကို ထပ်ထည့်လိုက်ပြီ
- `queryResult.fetchPreviousPage` property ကို ထပ်ထည့်လိုက်ပြီ
- `queryResult.isFetchingPreviousPage` ကို ထပ်ထည့်လိုက်ပြီ
- Infinite query ရဲ့ `data` က အခု — pages တွေနဲ့ ၎င်းတို့ကို fetch လုပ်ဖို့ သုံးခဲ့တဲ့ `pageParams` တွေ ပါဝင်တဲ့ object တစ်ခု ဖြစ်သွားပါပြီ: `{ pages: [data, data, data], pageParams: [...]}`

ဦးတည်ချက် တစ်ဖက်:

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery(
    'projects',
    ({ pageParam = 0 }) => fetchProjects(pageParam),
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    },
  )
```

ဦးတည်ချက် နှစ်ဖက်:

```tsx
const {
  data,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
  isFetchingNextPage,
  isFetchingPreviousPage,
} = useInfiniteQuery(
  'projects',
  ({ pageParam = 0 }) => fetchProjects(pageParam),
  {
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage, pages) => firstPage.prevCursor,
  },
)
```

ဦးတည်ချက် တစ်ဖက် — ပြောင်းပြန်:

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery(
    'projects',
    ({ pageParam = 0 }) => fetchProjects(pageParam),
    {
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
      getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
    },
  )
```

### Infinite query ရဲ့ data မှာ အခု pages array နဲ့ ၎င်းတို့ကို fetch လုပ်ဖို့ သုံးခဲ့တဲ့ pageParams တွေ ပါဝင်ပါတယ်

ဒါက data နဲ့ page params တွေကို လွယ်ကူစွာ ကိုင်တွယ်နိုင်စေပါတယ် — ဥပမာ — ပထမ page ကို ၎င်းရဲ့ params နဲ့အတူ ဖယ်ရှားချင်ရင်:

```tsx
queryClient.setQueryData(['projects'], (data) => ({
  pages: data.pages.slice(1),
  pageParams: data.pageParams.slice(1),
}))
```

### useMutation က array အစား object တစ်ခုကို ပြန်ပေးပါတယ်

အရင်နည်းက `useState` ကို ပထမဆုံး ရှာဖွေတွေ့ရှိစဉ်က ခံစားချက်မျိုး ပေးခဲ့ပေမယ့် — အဲဒီခံစားချက်တွေက ကြာရှည် မခံခဲ့ပါဘူး။ အခု mutation ရဲ့ return က object တစ်ခုတည်း ဖြစ်ပါတယ်။

```tsx
// Old:
const [mutate, { status, reset }] = useMutation()

// New:
const { mutate, status, reset } = useMutation()
```

### `mutation.mutate` က promise တစ်ခုကို ပြန်မပေးတော့ပါဘူး

- `[mutate]` variable ကို `mutation.mutate` function အဖြစ် ပြောင်းလိုက်ပြီ
- `mutation.mutateAsync` function ကို ထပ်ထည့်လိုက်ပြီ

ဒီအပြုအမူနဲ့ ပတ်သက်ပြီး — users တွေက promise ကို သာမန် promise တစ်ခုလို ပြုမူမယ်လို့ မျှော်လင့်ခဲ့လို့ — မေးခွန်းတွေ အများကြီး ရခဲ့ပါတယ်။

အဲဒါကြောင့် `mutate` function ကို အခု `mutate` နဲ့ `mutateAsync` ဆိုပြီး နှစ်ခု ခွဲလိုက်ပါတယ်။

Callbacks တွေ သုံးတဲ့အခါ `mutate` function ကို သုံးနိုင်ပါတယ်:

```tsx
const { mutate } = useMutation({ mutationFn: addTodo })

mutate('todo', {
  onSuccess: (data) => {
    console.log(data)
  },
  onError: (error) => {
    console.error(error)
  },
  onSettled: () => {
    console.log('settled')
  },
})
```

async/await သုံးတဲ့အခါ `mutateAsync` function ကို သုံးနိုင်ပါတယ်:

```tsx
const { mutateAsync } = useMutation({ mutationFn: addTodo })

try {
  const data = await mutateAsync('todo')
  console.log(data)
} catch (error) {
  console.error(error)
} finally {
  console.log('settled')
}
```

### useQuery ရဲ့ object syntax က အခု collapsed config ကို သုံးပါတယ်

```tsx
// Old:
useQuery({
  queryKey: 'posts',
  queryFn: fetchPosts,
  config: { staleTime: Infinity },
})

// New:
useQuery({
  queryKey: 'posts',
  queryFn: fetchPosts,
  staleTime: Infinity,
})
```

### QueryOptions.enabled option ကို သတ်မှတ်ထားရင် — boolean (`true`/`false`) ဖြစ်ရပါမယ်

`enabled` query option က value `false` ဖြစ်မှသာ query ကို disable လုပ်တော့မှာ ဖြစ်ပါတယ်။ လိုအပ်ရင် values တွေကို `!!userId` ဒါမှမဟုတ် `Boolean(userId)` နဲ့ cast လုပ်နိုင်ပြီး — non-boolean value တစ်ခု ပို့မိရင် အဆင်ပြေတဲ့ error တစ်ခု throw လုပ်ပါလိမ့်မယ်။

### QueryOptions.initialStale option ကို ဖယ်ရှားလိုက်ပြီ

`initialStale` query option ကို ဖယ်ရှားလိုက်ပြီး — initial data ကို အခု သာမန် data လိုပဲ သဘောထားပါတယ်။ ဆိုလိုတာက — `initialData` ပေးထားရင် query က mount လုပ်တဲ့အခါ default အနေနဲ့ refetch လုပ်ပါလိမ့်မယ်။ ချက်ချင်း refetch မလုပ်စေချင်ရင် `staleTime` တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။

### `QueryOptions.forceFetchOnMount` option ကို `refetchOnMount: 'always'` နဲ့ အစားထိုးလိုက်ပြီ

ရိုးရိုးသားသား ပြောရရင် — `refetchOn____` options တွေ အများကြီး စုမိလာခဲ့လို့ — ဒါက အရာတွေကို ရှင်းလင်းစေပါလိမ့်မယ်။

### `QueryOptions.refetchOnMount` option က အခု query observers အားလုံး အစား ၎င်းရဲ့ parent component ကိုပဲ သက်ရောက်ပါတယ်

အရင်က `refetchOnMount` ကို `false` လို့ သတ်မှတ်ထားရင် — နောက်ထပ် components တွေက mount လုပ်တဲ့အခါ refetch လုပ်တာကို တားဆီးခဲ့ပါတယ်။ Version 3 မှာတော့ — option ကို သတ်မှတ်ထားတဲ့ component ကပဲ mount လုပ်တဲ့အခါ refetch လုပ်မှာ မဟုတ်တော့ပါဘူး။

### `QueryOptions.queryFnParamsFilter` ကို ဖယ်ရှားပြီး `QueryFunctionContext` object အသစ်ကို သုံးပါ

`queryFnParamsFilter` option ကို ဖယ်ရှားလိုက်ပြီ — ဘာလို့လဲဆိုတော့ query functions တွေက query key အစား `QueryFunctionContext` object တစ်ခုကို အခု ရလို့ပါ။

`QueryFunctionContext` ထဲမှာလည်း query key ပါ ပါဝင်နေတာမို့ — parameters တွေကို query function ထဲမှာကိုယ်တိုင် ဆက်ပြီး filter လုပ်နိုင်ပါသေးတယ်။

### `QueryOptions.notifyOnStatusChange` option နေရာမှာ `notifyOnChangeProps` နဲ့ `notifyOnChangePropsExclusions` options အသစ်တွေ ဝင်လာပြီ

ဒီ options အသစ်တွေနဲ့ — component တစ်ခု ဘယ်အချိန် re-render ဖြစ်သင့်လဲဆိုတာကို granular အဆင့်အထိ configure လုပ်နိုင်ပါတယ်။

`data` ဒါမှမဟုတ် `error` properties တွေ ပြောင်းလဲမှသာ re-render လုပ်ချင်ရင်:

```tsx
import { useQuery } from 'react-query'

function User() {
  const { data } = useQuery(['user'], fetchUser, {
    notifyOnChangeProps: ['data', 'error'],
  })
  return <div>Username: {data.username}</div>
}
```

`isStale` property ပြောင်းလဲတဲ့အခါ re-render မလုပ်စေချင်ရင်:

```tsx
import { useQuery } from 'react-query'

function User() {
  const { data } = useQuery(['user'], fetchUser, {
    notifyOnChangePropsExclusions: ['isStale'],
  })
  return <div>Username: {data.username}</div>
}
```

### `QueryResult.clear()` function ကို `QueryResult.remove()` လို့ အမည်ပြောင်းလိုက်ပြီ

အရင်က `clear` လို့ ခေါ်ခဲ့ပေမယ့် — တကယ်တော့ query ကို cache ထဲကနေ ဖယ်ရှားပေးတာပါ။ အခု နာမည်က လုပ်ဆောင်ချက်နဲ့ ကိုက်ညီသွားပါပြီ။

### `QueryResult.updatedAt` property ကို `QueryResult.dataUpdatedAt` နဲ့ `QueryResult.errorUpdatedAt` ဆိုပြီး ခွဲလိုက်ပြီ

Data နဲ့ errors တွေက တစ်ချိန်တည်းမှာ ရှိနေနိုင်လို့ — `updatedAt` property ကို `dataUpdatedAt` နဲ့ `errorUpdatedAt` ဆိုပြီး ခွဲလိုက်ပါတယ်။

### `setConsole()` နေရာမှာ `setLogger()` function အသစ် ဝင်လာပြီ

```tsx
import { setLogger } from 'react-query'

// Log with Sentry
setLogger({
  error: (error) => {
    Sentry.captureException(error)
  },
})

// Log with Winston
setLogger(winston.createLogger())
```

### React Native မှာ logger ကို override လုပ်ဖို့ မလိုအပ်တော့ပါဘူး

React Native မှာ query တစ်ခု မအောင်မြင်တဲ့အခါ error screens တွေ မပေါ်အောင် — အရင်က Console ကို ကိုယ်တိုင် ပြောင်းလဲဖို့ လိုအပ်ခဲ့ပါတယ်:

```tsx
import { setConsole } from 'react-query'

setConsole({
  log: console.log,
  warn: console.warn,
  error: console.warn,
})
```

Version 3 မှာတော့ — **React Query ကို React Native မှာ သုံးတဲ့အခါ ဒါကို အလိုအလျောက် လုပ်ပေးပါတယ်**။

### TypeScript

#### `QueryStatus` ကို [enum](https://www.typescriptlang.org/docs/handbook/enums.html#string-enums) ကနေ [union type](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) အဖြစ် ပြောင်းလိုက်ပြီ

ဒါကြောင့် — query ဒါမှမဟုတ် mutation တစ်ခုရဲ့ status property ကို QueryStatus enum property တစ်ခုနဲ့ စစ်ဆေးနေတယ်ဆိုရင် — အခု enum က တစ်ခါက property တစ်ခုချင်းစီအတွက် ကိုင်ထားခဲ့တဲ့ string literal နဲ့ စစ်ဆေးရပါမယ်။

ဒါကြောင့် enum properties တွေကို ၎င်းတို့နဲ့ ညီမျှတဲ့ string literals တွေအဖြစ် ပြောင်းရပါမယ်:

- `QueryStatus.Idle` -> `'idle'`
- `QueryStatus.Loading` -> `'loading'`
- `QueryStatus.Error` -> `'error'`
- `QueryStatus.Success` -> `'success'`

သင်ပြုလုပ်ရမယ့် အပြောင်းအလဲတွေရဲ့ ဥပမာ တစ်ခု ဒီမှာ:

```tsx
- import { useQuery, QueryStatus } from 'react-query'; // [!code --]
+ import { useQuery } from 'react-query'; // [!code ++]

const { data, status } = useQuery(['post', id], () => fetchPost(id))

- if (status === QueryStatus.Loading) { // [!code --]
+ if (status === 'loading') { // [!code ++]
  ...
}

- if (status === QueryStatus.Error) { // [!code --]
+ if (status === 'error') { // [!code ++]
  ...
}
```

## Feature အသစ်များ (New Features)

#### Query Data Selectors

`useQuery` နဲ့ `useInfiniteQuery` hooks တွေမှာ အခု `select` option ပါဝင်လာပြီ — query result ရဲ့ အစိတ်အပိုင်းတွေကို ရွေးထုတ်ဖို့/transform လုပ်ဖို့ ဖြစ်ပါတယ်။

```tsx
import { useQuery } from 'react-query'

function User() {
  const { data } = useQuery(['user'], fetchUser, {
    select: (user) => user.username,
  })
  return <div>Username: {data}</div>
}
```

`notifyOnChangeProps` option ကို `['data', 'error']` လို့ သတ်မှတ်ထားရင် — select လုပ်ထားတဲ့ data ပြောင်းလဲမှသာ re-render ဖြစ်ပါလိမ့်မယ်။

#### `useQueries()` hook — အရှည် ပြောင်းလဲနိုင်တဲ့ parallel query execution အတွက်

`useQuery` ကို loop ထဲမှာ run လုပ်နိုင်ရင် ကောင်းမှာနော်လို့ ဆန္ဒရှိဖူးလား။ Hooks ရဲ့ စည်းမျဉ်းတွေက မရဘူးလို့ ဆိုပေမယ့် — `useQueries()` hook အသစ်နဲ့တော့ ရပါတယ်!

```tsx
import { useQueries } from 'react-query'

function Overview() {
  const results = useQueries([
    { queryKey: ['post', 1], queryFn: fetchPost },
    { queryKey: ['post', 2], queryFn: fetchPost },
  ])
  return (
    <ul>
      {results.map(({ data }) => data && <li key={data.id}>{data.title})</li>)}
    </ul>
  )
}
```

#### Retry/offline mutations

Default အနေနဲ့ React Query က mutation တစ်ခုကို error ဖြစ်ရင် retry မလုပ်ပါဘူး — ဒါပေမယ့် `retry` option နဲ့ လုပ်နိုင်ပါတယ်:

```tsx
const mutation = useMutation({
  mutationFn: addTodo,
  retry: 3,
})
```

Device offline ဖြစ်လို့ mutations တွေ မအောင်မြင်ခဲ့ရင် — device ပြန် connect ဖြစ်တဲ့အခါ အစီအစဉ်အတိုင်း ပြန် retry လုပ်ပါလိမ့်မယ်။

#### Mutations တွေကို persist လုပ်ခြင်း

Mutations တွေကို အခု storage ပေါ်မှာ persist လုပ်ပြီး — နောက်ပိုင်းမှာ ပြန် resume လုပ်လို့ရပါတယ်။ အသေးစိတ်ကို [mutations documentation](/docs/tanstack-query/mutations) မှာ ကြည့်နိုင်ပါတယ်။

#### QueryObserver

`QueryObserver` ကို query တစ်ခုကို ဖန်တီးဖို့ ဒါမှမဟုတ် watch လုပ်ဖို့ သုံးနိုင်ပါတယ်:

```tsx
const observer = new QueryObserver(queryClient, { queryKey: 'posts' })

const unsubscribe = observer.subscribe((result) => {
  console.log(result)
  unsubscribe()
})
```

#### InfiniteQueryObserver

`InfiniteQueryObserver` ကို infinite query တစ်ခုကို ဖန်တီးဖို့ ဒါမှမဟုတ် watch လုပ်ဖို့ သုံးနိုင်ပါတယ်:

```tsx
const observer = new InfiniteQueryObserver(queryClient, {
  queryKey: 'posts',
  queryFn: fetchPosts,
  getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
})

const unsubscribe = observer.subscribe((result) => {
  console.log(result)
  unsubscribe()
})
```

#### QueriesObserver

`QueriesObserver` ကို queries အများအပြားကို ဖန်တီးဖို့ ဒါမှမဟုတ် watch လုပ်ဖို့ သုံးနိုင်ပါတယ်:

```tsx
const observer = new QueriesObserver(queryClient, [
  { queryKey: ['post', 1], queryFn: fetchPost },
  { queryKey: ['post', 2], queryFn: fetchPost },
])

const unsubscribe = observer.subscribe((result) => {
  console.log(result)
  unsubscribe()
})
```

#### Query တစ်ခုချင်းစီအတွက် default options သတ်မှတ်ခြင်း

`QueryClient.setQueryDefaults()` method ကို သုံးပြီး — query တစ်ခုချင်းစီအတွက် default options တွေ သတ်မှတ်နိုင်ပါတယ်:

```tsx
queryClient.setQueryDefaults(['posts'], { queryFn: fetchPosts })

function Component() {
  const { data } = useQuery(['posts'])
}
```

#### Mutation တစ်ခုချင်းစီအတွက် default options သတ်မှတ်ခြင်း

`QueryClient.setMutationDefaults()` method ကို သုံးပြီး — mutation တစ်ခုချင်းစီအတွက် default options တွေ သတ်မှတ်နိုင်ပါတယ်:

```tsx
queryClient.setMutationDefaults(['addPost'], { mutationFn: addPost })

function Component() {
  const { mutate } = useMutation({ mutationKey: ['addPost'] })
}
```

#### useIsFetching()

`useIsFetching()` hook က အခု filters တွေကို လက်ခံပါတယ် — ဥပမာ — query အမျိုးအစား တစ်ခုအတွက်ပဲ spinner ပြချင်တာမျိုး လုပ်ဖို့:

```tsx
const fetches = useIsFetching({ queryKey: ['posts'] })
```

#### Core ကို သီးခြား ခွဲထားခြင်း (Core Separation)

React Query ရဲ့ core က React ကနေ အခု အပြည့်အဝ ခွဲထားပြီး — standalone အနေနဲ့ ဒါမှမဟုတ် အခြား frameworks တွေမှာပါ သုံးနိုင်ပါတယ်။ Core functionality ကိုပဲ import လုပ်ချင်ရင် `react-query/core` entry point ကို သုံးပါ:

```tsx
import { QueryClient } from 'react-query/core'
```

### Devtools တွေ အခု main repo နဲ့ npm package ထဲမှာ ပါဝင်လာပြီ

Devtools တွေကို အခု `react-query` package ထဲကိုကိုယ်တိုင် — `react-query/devtools` import အောက်မှာ ထည့်သွင်းလိုက်ပါပြီ။ `react-query-devtools` imports တွေကို `react-query/devtools` နဲ့ အစားထိုးလိုက်ရုံပါပဲ။
