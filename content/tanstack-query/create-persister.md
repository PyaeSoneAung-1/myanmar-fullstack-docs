---
title: "experimental_createQueryPersister (Query တစ်ခုချင်းစီအတွက် persister ဖန်တီးရန် utility)"
description: "experimental_createQueryPersister — query တစ်ခုချင်းစီကို storage ပေါ်မှာ သီးခြား persist လုပ်ပေးတဲ့ experimental utility — usage, ထပ်ဆောင်း utilities (persistQueryByKey, retrieveQuery, persisterGc, restoreQueries, removeQueries), options"
order: 58
source: "https://tanstack.com/query/latest/docs/framework/react/plugins/createPersister"
status: translated
updated: 2026-09-02
---

## တပ်ဆင်ခြင်း (Installation)

ဒီ utility က သီးခြား package တစ်ခုအနေနဲ့ ပါဝင်ပြီး — `'@tanstack/query-persist-client-core'` import အောက်မှာ ရနိုင်ပါတယ်။

```bash
npm install @tanstack/query-persist-client-core
```

သို့မဟုတ်

```bash
pnpm add @tanstack/query-persist-client-core
```

သို့မဟုတ်

```bash
yarn add @tanstack/query-persist-client-core
```

သို့မဟုတ်

```bash
bun add @tanstack/query-persist-client-core
```

> Note — ဒီ util က `@tanstack/react-query-persist-client` package ထဲမှာလည်း ပါဝင်ပါတယ်။ ဒါကြောင့် အဲဒီ package ကို သုံးနေတယ်ဆိုရင် — သီးခြား ထပ်တင် စရာ မလိုပါဘူး။

## အသုံးပြုခြင်း (Usage)

- `experimental_createQueryPersister` function ကို import လုပ်ပါ
- `experimental_createQueryPersister` အသစ်တစ်ခု ဖန်တီးပါ
  - `AsyncStorage` interface နဲ့ ကိုက်ညီတဲ့ ဘယ် `storage` ကိုမဆို ပို့လို့ရပါတယ် — အောက်က ဥပမာက React Native ရဲ့ async-storage ကို သုံးထားတာပါ
- အဲဒီ `persister` ကို သင့် Query ရဲ့ option တစ်ခုအနေနဲ့ ပို့ပါ။ ဒါကို `QueryClient` ရဲ့ `defaultOptions` မှာ ဒါမှမဟုတ် ဘယ် `useQuery` hook instance မှာမဆို ပို့လို့ရပါတယ်
  - ဒီ `persister` ကို `defaultOptions` အနေနဲ့ ပို့ရင် — queries အားလုံးကို ပေးထားတဲ့ `storage` ပေါ်မှာ persist လုပ်မှာ ဖြစ်ပါတယ်။ `filters` ပေးပြီး ထပ်ပြီး ကျဉ်းမြောင်းအောင် လုပ်လို့လည်း ရပါတယ်။ `persistClient` plugin နဲ့ မတူတာက — query client တစ်ခုလုံးကို item တစ်ခုတည်းအနေနဲ့ မသိမ်းဘဲ — query တစ်ခုချင်းစီကို သီးခြားစီ သိမ်းပါတယ်။ Key အနေနဲ့တော့ query hash ကို သုံးပါတယ်
  - ဒီ `persister` ကို `useQuery` hook တစ်ခုတည်းဆီပဲ ပို့ရင် — အဲဒီ Query တစ်ခုကိုပဲ persist လုပ်မှာ ဖြစ်ပါတယ်
- Note — `queryClient.setQueryData()` operations တွေကို persist မလုပ်ပါဘူး။ ဆိုလိုတာက — optimistic update တစ်ခု လုပ်ပြီး query ကို invalidate မလုပ်ရသေးခင် page ကို refresh လုပ်လိုက်ရင် — query data ပေါ်က သင့်ပြောင်းလဲမှုတွေ ပျောက်သွားနိုင်ပါတယ်။ https://github.com/TanStack/query/issues/6310 မှာ အသေးစိတ် ကြည့်ပါ။

ဒီနည်းနဲ့ — `QueryClient` တစ်ခုလုံးကို သိမ်းစရာ မလိုဘဲ — သင့် application မှာ ဘယ်အရာကို persist လုပ်သင့်လဲ ရွေးချယ်နိုင်ပါတယ်။ Query တစ်ခုချင်းစီကို lazy ပုံစံနဲ့ restore လုပ်ပါတယ် (Query ကို ပထမဆုံး သုံးတဲ့အခါ) ပြီးတော့ — persist လုပ်ပါတယ် (`queryFn` run တိုင်း) — ဒါကြောင့် throttle လုပ်စရာ မလိုပါဘူး။ Query restore လုပ်ပြီးနောက်မှာလည်း `staleTime` ကို လေးစားပါတယ် — data ကို `stale` လို့ သတ်မှတ်ရင် restore ပြီးချင်း ချက်ချင်း refetch လုပ်မှာ ဖြစ်ပြီး — data က `fresh` ဆိုရင်တော့ `queryFn` run မှာ မဟုတ်ပါဘူး။

Query တစ်ခုကို memory ကနေ garbage collect လုပ်တာက persist လုပ်ထားတဲ့ data ကို မထိခိုက်ပါဘူး။ ဆိုလိုတာက — queries တွေကို memory ထဲမှာ ကြာကြာ မထားဘဲ နေလို့ရပြီး — **memory ပိုသက်သာ** စေပါတယ်။ နောက်တစ်ခါ သုံးတဲ့အခါ persistent storage ကနေ ပြန် restore လုပ်သွားမှာ ဖြစ်ပါတယ်။

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryClient } from '@tanstack/react-query'
import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core'

const persister = experimental_createQueryPersister({
  storage: AsyncStorage,
  maxAge: 1000 * 60 * 60 * 12, // 12 hours
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 30, // 30 seconds
      persister: persister.persisterFn,
    },
  },
})
```

### ပြောင်းလဲထားသော defaults (Adapted Defaults)

`createPersister` plugin က `queryFn` ကို အတွင်းပိုင်းကနေ wrap လုပ်ထားလို့ — `queryFn` မဖြစ်တဲ့အခါ restore လည်း မဖြစ်ပါဘူး။ ဒီလိုနည်းနဲ့ — Query နဲ့ network ကြားမှာ caching layer တစ်ခုလို ဆောင်ရွက်ပါတယ်။ ဒါကြောင့် — persister သုံးထားချိန်မှာ `networkMode` က `'offlineFirst'` ကို default အနေနဲ့ သုံးမှာ ဖြစ်ပြီး — network ချိတ်ဆက်မှု မရှိဘဲနဲ့တောင် persistent storage ကနေ restore လုပ်နိုင်ပါတယ်။

## ထပ်ဆောင်း utilities (Additional Utilities)

`experimental_createQueryPersister` ကို ခေါ်လိုက်ရင် — `persisterFn` အပြင် userland လုပ်ဆောင်ချက်တွေ ပိုလွယ်ကူအောင် ထပ်ဆောင်း utilities တွေကိုပါ ပြန်ပေးပါတယ်။

### `persistQueryByKey(queryKey: QueryKey, queryClient: QueryClient): Promise<void>`

ဒီ function က `Query` တစ်ခုကို — persister ဖန်တီးတုန်းက သတ်မှတ်ထားတဲ့ storage နဲ့ key ထဲကို persist လုပ်ပေးပါတယ်။
ဒီ utility ကို `setQueryData` နဲ့ တွဲသုံးပြီး — invalidation ကို မစောင့်ဘဲ optimistic update တွေကို storage ထဲ သိမ်းဖို့ သုံးနိုင်ပါတယ်။

```tsx
const persister = experimental_createQueryPersister({
  storage: AsyncStorage,
  maxAge: 1000 * 60 * 60 * 12, // 12 hours
})

const queryClient = useQueryClient()

useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    ...
    // Optimistically update to the new value
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo])
    // And persist it to storage
    persister.persistQueryByKey(['todos'], queryClient)
    ...
  },
})
```

### `retrieveQuery<T>(queryHash: string): Promise<T | undefined>`

ဒီ function က persist လုပ်ထားတဲ့ query တစ်ခုကို `queryHash` နဲ့ ပြန်ယူဖို့ ကြိုးစားပါတယ်။
Query က `expired` (သက်တမ်းကုန်), `busted` ဒါမှမဟုတ် `malformed` (ပုံစံပျက်) ဖြစ်နေရင်တော့ — storage ကနေ ဖယ်ရှားပစ်ပြီး `undefined` ကို ပြန်ပေးမှာ ဖြစ်ပါတယ်။

### `persisterGc(): Promise<void>`

ဒီ function ကို သုံးပြီး — storage ထဲက `expired`, `busted` ဒါမှမဟုတ် `malformed` entries တွေကို ရံဖန်ရံခါ ရှင်းလင်းနိုင်ပါတယ်။

ဒီ function အလုပ်လုပ်ဖို့ — သင့် storage မှာ `key-value tuple array` တစ်ခုကို ပြန်ပေးတဲ့ `entries` method ရှိနေရပါမယ်။
ဥပမာ — `localStorage` အတွက် `Object.entries(localStorage)` ဒါမှမဟုတ် `idb-keyval` ရဲ့ `entries` ။

### `restoreQueries(queryClient: QueryClient, filters): Promise<void>`

ဒီ function ကို သုံးပြီး — persister ထဲမှာ လက်ရှိ သိမ်းထားတဲ့ queries တွေကို restore လုပ်နိုင်ပါတယ်။
ဥပမာ — သင့် app က offline mode နဲ့ စတင်နေတဲ့အခါ၊ ဒါမှမဟုတ် အရင် session ကနေ data အားလုံး ဒါမှမဟုတ် တချို့ကို — intermediate `loading` state မရှိဘဲ ချက်ချင်း ရနိုင်စေချင်တဲ့အခါ သုံးပါတယ်။

Filter object မှာ အောက်ပါ properties တွေကို ပံ့ပိုးပါတယ်:

- `queryKey?: QueryKey`
  - ဒီ property ကို သတ်မှတ်ပြီး ကိုက်ညီစေချင်တဲ့ query key ကို define လုပ်ပါ။
- `exact?: boolean`
  - Query key နဲ့ အားလုံးပါဝင်အောင် (inclusively) ရှာချင်မှာ မဟုတ်ဘူးဆိုရင် — `exact: true` option ကို ပို့ပြီး သင်ပေးထားတဲ့ query key နဲ့ အတိအကျ တူတဲ့ query ကိုပဲ ပြန်ယူနိုင်ပါတယ်။

ဒီ function အလုပ်လုပ်ဖို့ — သင့် storage မှာ `key-value tuple array` တစ်ခုကို ပြန်ပေးတဲ့ `entries` method ရှိနေရပါမယ်။
ဥပမာ — `localStorage` အတွက် `Object.entries(localStorage)` ဒါမှမဟုတ် `idb-keyval` ရဲ့ `entries` ။

### `removeQueries(filters): Promise<void>`

`queryClient.removeQueries` ကို သုံးတဲ့အခါ — data က persister ထဲမှာ ကျန်နေပြီး သီးခြား ဖယ်ရှားဖို့ လိုပါတယ်။
ဒီ function ကို သုံးပြီး persister ထဲမှာ လက်ရှိ သိမ်းထားတဲ့ queries တွေကို ဖယ်ရှားနိုင်ပါတယ်။

Filter object မှာ အောက်ပါ properties တွေကို ပံ့ပိုးပါတယ်:

- `queryKey?: QueryKey`
  - ဒီ property ကို သတ်မှတ်ပြီး ကိုက်ညီစေချင်တဲ့ query key ကို define လုပ်ပါ။
- `exact?: boolean`
  - Query key နဲ့ အားလုံးပါဝင်အောင် (inclusively) ရှာချင်မှာ မဟုတ်ဘူးဆိုရင် — `exact: true` option ကို ပို့ပြီး သင်ပေးထားတဲ့ query key နဲ့ အတိအကျ တူတဲ့ query ကိုပဲ ပြန်ယူနိုင်ပါတယ်။

ဒီ function အလုပ်လုပ်ဖို့ — သင့် storage မှာ `key-value tuple array` တစ်ခုကို ပြန်ပေးတဲ့ `entries` method ရှိနေရပါမယ်။
ဥပမာ — `localStorage` အတွက် `Object.entries(localStorage)` ဒါမှမဟုတ် `idb-keyval` ရဲ့ `entries` ။

## API

### `experimental_createQueryPersister`

```tsx
experimental_createQueryPersister(options: StoragePersisterOptions)
```

#### Options

```tsx
export interface StoragePersisterOptions {
  /** The storage client used for setting and retrieving items from cache.
   * For SSR pass in `undefined`.
   */
  storage: AsyncStorage | Storage | undefined | null
  /**
   * How to serialize the data to storage.
   * @default `JSON.stringify`
   */
  serialize?: (persistedQuery: PersistedQuery) => string
  /**
   * How to deserialize the data from storage.
   * @default `JSON.parse`
   */
  deserialize?: (cachedString: string) => PersistedQuery
  /**
   * A unique string that can be used to forcefully invalidate existing caches,
   * if they do not share the same buster string
   */
  buster?: string
  /**
   * The max-allowed age of the cache in milliseconds.
   * If a persisted cache is found that is older than this
   * time, it will be discarded
   * @default 24 hours
   */
  maxAge?: number
  /**
   * Prefix to be used for storage key.
   * Storage key is a combination of prefix and query hash in a form of `prefix-queryHash`.
   */
  prefix?: string
  /**
   * If set to `true`, the query will refetch on successful query restoration if the data is stale.
   * If set to `false`, the query will not refetch on successful query restoration.
   * If set to `'always'`, the query will always refetch on successful query restoration.
   * Defaults to `true`.
   */
  refetchOnRestore?: boolean | 'always'
  /**
   * Filters to narrow down which Queries should be persisted.
   */
  filters?: QueryFilters
}

interface AsyncStorage<TStorageValue = string> {
  getItem: (key: string) => MaybePromise<TStorageValue | undefined | null>
  setItem: (key: string, value: TStorageValue) => MaybePromise<unknown>
  removeItem: (key: string) => MaybePromise<void>
  entries?: () => MaybePromise<Array<[key: string, value: TStorageValue]>>
}
```

Default options တွေကတော့:

```tsx
{
  prefix = 'tanstack-query',
  maxAge = 1000 * 60 * 60 * 24,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
  refetchOnRestore = true,
}
```
