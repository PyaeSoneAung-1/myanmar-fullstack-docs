---
title: "persistQueryClient (QueryClient cache ကို persist လုပ်သိမ်းဆည်း/restore လုပ်ရန် utilities)"
description: "persistQueryClient utilities — persister ဆိုတာ ဘာလဲ, persistQueryClientSave/Subscribe/Restore, Options, PersistQueryClientProvider နဲ့ useIsRestoring, Persister interface နဲ့ custom persister တည်ဆောက်နည်း"
order: 55
source: "https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient"
status: translated
updated: 2026-09-02
---

ဒီ page မှာပါတဲ့ utilities တွေက **persisters** တွေနဲ့ ချိတ်ဆက်အလုပ်လုပ်ဖို့ ဖြစ်ပါတယ် — persister ဆိုတာ သင့် queryClient ကို နောက်မှ ပြန်သုံးဖို့ သိမ်းဆည်းပေးတဲ့ အရာပါ။ **Persister** အမျိုးမျိုးကို သုံးပြီး သင့် client နဲ့ cache ကို storage layer အမျိုးမျိုးပေါ်မှာ သိမ်းဆည်းထားနိုင်ပါတယ်။

## Persister တည်ဆောက်ခြင်း (Build Persisters)

- [createSyncStoragePersister](/docs/tanstack-query/create-sync-storage-persister)
- [createAsyncStoragePersister](/docs/tanstack-query/create-async-storage-persister)
- [custom persister တစ်ခု ဖန်တီးခြင်း](#persisters)

## ဘယ်လို အလုပ်လုပ်လဲ (How It Works)

**အရေးကြီးသည်** — persist ကောင်းကောင်း အလုပ်လုပ်ဖို့ဆိုရင် — `QueryClient` ကို hydration ကာလအတွင်း default ကို override လုပ်ဖို့ `gcTime` value တစ်ခု ပေးထားသင့်ပါတယ် (အပေါ်က ဥပမာမှာ ပြထားသလိုပါ)။

ဒါကို `QueryClient` instance ဖန်တီးတုန်းက မသတ်မှတ်ထားရင် — hydration အတွက် `300000` (၅ မိနစ်) ကို default အနေနဲ့ သုံးမှာ ဖြစ်ပြီး — သိမ်းထားတဲ့ cache ကို လှုပ်ရှားမှု မရှိဘဲ ၅ မိနစ် ကြာတာနဲ့ ဖျက်ပစ်မှာ ဖြစ်ပါတယ်။ ဒါက default garbage collection အပြုအမူပါ။

ဒါကို persistQueryClient ရဲ့ `maxAge` option နဲ့ တူညီတဲ့ ဒါမှမဟုတ် ပိုမြင့်တဲ့ တန်ဖိုးအဖြစ် သတ်မှတ်ထားသင့်ပါတယ်။ ဥပမာ — `maxAge` က ၂၄ နာရီ (default) ဆိုရင် `gcTime` ကလည်း ၂၄ နာရီ ဒါမှမဟုတ် ပိုမြင့်ရပါမယ်။ `maxAge` ထက် နိမ့်နေရင် — garbage collection က ဝင်ပြီး သိမ်းထားတဲ့ cache ကို မျှော်လင့်ထားတာထက် စောပြီး ဖျက်ပစ်နိုင်ပါတယ်။

`Infinity` ပေးပြီး garbage collection အပြုအမူကို လုံးဝ ပိတ်ထားလည်း ရပါတယ်။

JavaScript ရဲ့ ကန့်သတ်ချက်တစ်ခုကြောင့် — `gcTime` ရဲ့ အများဆုံး ခွင့်ပြုတန်ဖိုးက ခန့်မှန်းခြေ [၂၄ ရက်](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value) လောက်ပါ။ ဒါပေမယ့် [timeoutManager.setTimeoutProvider](https://tanstack.com/query/latest/docs/reference/timeoutManager#timeoutmanagersettimeoutprovider) ကို သုံးပြီး ဒီကန့်သတ်ချက်ကို ကျော်လွှားဖို့ ဖြစ်နိုင်ပါတယ်။

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})
```

### Cache Busting (Cache ကို အတင်း ပြန်စတင်ခြင်း)

တစ်ခါတလေ သင်က သင့် application ဒါမှမဟုတ် data မှာ ပြောင်းလဲမှုတွေ လုပ်ပြီး — cache လုပ်ထားတဲ့ data အားလုံးကို ချက်ချင်း invalidate လုပ်ချင်တာမျိုး ရှိနိုင်ပါတယ်။ ဒီလိုအခါမျိုးမှာ `buster` string option တစ်ခုကို ပို့နိုင်ပါတယ်။ ရှာတွေ့တဲ့ cache မှာ အဲဒီ buster string မပါရင် — cache ကို ဖျက်ပစ်မှာ ဖြစ်ပါတယ်။ အောက်က function တွေက ဒီ option ကို လက်ခံပါတယ်:

```tsx
persistQueryClient({ queryClient, persister, buster: buildHash })
persistQueryClientSave({ queryClient, persister, buster: buildHash })
persistQueryClientRestore({ queryClient, persister, buster: buildHash })
```

### Removal (ဖျက်သိမ်းခြင်း)

Data တစ်ခုကို အောက်ပါအခြေအနေတွေထဲက တစ်ခုခုနဲ့ တွေ့ရှိရရင်:

1. expired (သက်တမ်းကုန်နေပြီ — `maxAge` ကို ကြည့်ပါ)
2. busted (buster ကိုက်ညီမှု မရှိ — `buster` ကို ကြည့်ပါ)
3. error (ဥပမာ — `throws ...`)
4. empty (ဥပမာ — `undefined`)

persister ရဲ့ `removeClient()` ကို ခေါ်ပြီး cache ကို ချက်ချင်း ဖျက်ပစ်ပါတယ်။

## API

### `persistQueryClientSave`

- သင့် query/mutation တွေကို `dehydrate` လုပ်ပြီး သင်ပေးထားတဲ့ persister နဲ့ သိမ်းဆည်းပါတယ်။
- `createSyncStoragePersister` နဲ့ `createAsyncStoragePersister` တွေက ဒီ action ကို — ဈေးကြီးနိုင်တဲ့ writes တွေ သက်သာစေဖို့ အနည်းဆုံး ၁ စက္ကန့်တစ်ခါ ဖြစ်အောင် throttle လုပ်ထားပါတယ်။ သူတို့ရဲ့ throttle timing ကို ဘယ်လို စိတ်ကြိုက် ပြင်ဆင်မလဲဆိုတာ သက်ဆိုင်ရာ documentation မှာ ပြန်ကြည့်ပါ။

ဒါကို သင်ရွေးချယ်တဲ့ အချိန်တွေမှာ cache ကို ကိုယ်တိုင် သိမ်းဆည်းဖို့ သုံးနိုင်ပါတယ်။

```tsx
persistQueryClientSave({
  queryClient,
  persister,
  buster = '',
  dehydrateOptions = undefined,
})
```

### `persistQueryClientSubscribe`

သင့် `queryClient` ရဲ့ cache ပြောင်းလဲတိုင်း `persistQueryClientSave` ကို run ပေးပါတယ်။ ဥပမာ — user က login ဝင်ပြီး "Remember me" ကို ရွေးချယ်တဲ့အခါ subscribe ကို စတင်နိုင်ပါတယ်။

- Monitor ကို ရပ်တန့်ဖို့ သုံးလို့ရတဲ့ `unsubscribe` function တစ်ခုကို ပြန်ပေးပါတယ် — ဒါဆို persist လုပ်ထားတဲ့ cache ဆီ update တွေ ဆက်မသွားတော့ပါဘူး။
- `unsubscribe` ပြီးနောက် persist လုပ်ထားတဲ့ cache ကို ဖျက်ပစ်ချင်ရင် — `persistQueryClientRestore` ဆီ `buster` အသစ်တစ်ခု ပို့လိုက်ပါ; ဒါက persister ရဲ့ `removeClient` function ကို trigger လုပ်ပြီး persist လုပ်ထားတဲ့ cache ကို ဖျက်ပစ်ပါလိမ့်မယ်။

```tsx
persistQueryClientSubscribe({
  queryClient,
  persister,
  buster = '',
  dehydrateOptions = undefined,
})
```

### `persistQueryClientRestore`

- အရင်က persist/dehydrate လုပ်ထားတဲ့ query/mutation cache ကို persister ကနေ ပြန်ယူပြီး — ပေးထားတဲ့ query client ရဲ့ query cache ထဲကို `hydrate` လုပ်ဖို့ ကြိုးစားပါတယ်။
- `maxAge` (default က ၂၄ နာရီ) ထက် ပိုဟောင်းနေတဲ့ cache တစ်ခုကို တွေ့ရင် ဖျက်ပစ်မှာ ဖြစ်ပါတယ်။ ဒီကြာချိန်ကို သင်လိုသလို စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။

ဒါကို သင်ရွေးချယ်တဲ့ အချိန်တွေမှာ cache ကို ပြန် restore လုပ်ဖို့ သုံးနိုင်ပါတယ်။

```tsx
persistQueryClientRestore({
  queryClient,
  persister,
  maxAge = 1000 * 60 * 60 * 24, // 24 hours
  buster = '',
  hydrateOptions = undefined,
})
```

### `persistQueryClient`

အောက်ပါ လုပ်ဆောင်ချက်တွေကို လုပ်ပေးပါတယ်:

1. Persist လုပ်ထားတဲ့ cache တစ်ခုခုကို ချက်ချင်း restore လုပ်ပါတယ် ([`persistQueryClientRestore`](#persistqueryclientrestore) ကို ကြည့်ပါ)
2. Query cache ကို subscribe လုပ်ပြီး `unsubscribe` function ကို ပြန်ပေးပါတယ် ([`persistQueryClientSubscribe`](#persistqueryclientsubscribe) ကို ကြည့်ပါ)

ဒီ functionality ကို version 3.x ကတည်းက ထိန်းသိမ်းလာခဲ့တာ ဖြစ်ပါတယ်။

```tsx
persistQueryClient({
  queryClient,
  persister,
  maxAge = 1000 * 60 * 60 * 24, // 24 hours
  buster = '',
  hydrateOptions = undefined,
  dehydrateOptions = undefined,
})
```

### Options

ရနိုင်တဲ့ option တွေ အားလုံးက အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```tsx
interface PersistQueryClientOptions {
  /** The QueryClient to persist */
  queryClient: QueryClient
  /** The Persister interface for storing and restoring the cache
   * to/from a persisted location */
  persister: Persister
  /** The max-allowed age of the cache in milliseconds.
   * If a persisted cache is found that is older than this
   * time, it will be **silently** discarded
   * (defaults to 24 hours) */
  maxAge?: number
  /** A unique string that can be used to forcefully
   * invalidate existing caches if they do not share the same buster string */
  buster?: string
  /** The options passed to the hydrate function
   * Not used on `persistQueryClientSave` or `persistQueryClientSubscribe` */
  hydrateOptions?: HydrateOptions
  /** The options passed to the dehydrate function
   * Not used on `persistQueryClientRestore` */
  dehydrateOptions?: DehydrateOptions
}
```

ဒီမှာ interface စုစုပေါင်း ၃ မျိုး ရှိပါတယ်:

- `PersistedQueryClientSaveOptions` — `persistQueryClientSave` နဲ့ `persistQueryClientSubscribe` တွေအတွက် သုံးပါတယ် (`hydrateOptions` မသုံးပါ)
- `PersistedQueryClientRestoreOptions` — `persistQueryClientRestore` အတွက် သုံးပါတယ် (`dehydrateOptions` မသုံးပါ)
- `PersistQueryClientOptions` — `persistQueryClient` အတွက် သုံးပါတယ်

## React နဲ့ အသုံးပြုခြင်း (Usage with React)

[persistQueryClient](#persistqueryclient) က cache ကို restore လုပ်ဖို့ ကြိုးစားပြီး — နောက်ပိုင်း ပြောင်းလဲမှုတွေကိုပါ အလိုအလျောက် subscribe လုပ်ပေးလို့ — သင့် client ကို ပေးထားတဲ့ storage နဲ့ sync ဖြစ်နေစေပါတယ်။

ဒါပေမယ့် — restore လုပ်တာက asynchronous ဖြစ်ပါတယ်; persister တွေ အားလုံးက သဘာဝအရ async ဖြစ်လို့ပါ။ ဆိုလိုတာက — restore လုပ်နေတုန်း သင့် App ကို render လုပ်လိုက်ရင် — query တစ်ခုက mount ဖြစ်ပြီး fetch လုပ်တာနဲ့ restore က ပြိုင်ဆိုင်ပြီး race conditions တွေ ဖြစ်လာနိုင်ပါတယ်။

ဒါ့အပြင် — React component lifecycle အပြင်မှာ ပြောင်းလဲမှုတွေကို subscribe လုပ်ထားရင် — unsubscribe လုပ်ဖို့ နည်းလမ်း မရှိတော့ပါဘူး:

```tsx
// 🚨 never unsubscribes from syncing
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
})

// 🚨 happens at the same time as restoring
ReactDOM.createRoot(rootElement).render(<App />)
```

### PersistQueryClientProvider

ဒီလိုအသုံးပြုမှုအတွက် — `PersistQueryClientProvider` ကို သုံးနိုင်ပါတယ်။ ဒါက React component lifecycle အတိုင်း subscribe/unsubscribe ကို မှန်ကန်စွာ လုပ်ပေးပြီး — restore လုပ်နေဆဲ ကာလအတွင်း queries တွေ fetch စတင် လုပ်မှာ မဟုတ်ကြောင်းလည်း သေချာစေပါတယ်။ Queries တွေက ဆက် render ဖြစ်နေဦးမှာ ဖြစ်ပြီး — data restore ပြီးတဲ့အထိ `fetchingState: 'idle'` ထဲမှာ ထားမှာ ဖြစ်ပါတယ်။ ပြီးရင် restore လုပ်ထားတဲ့ data က _fresh_ မလုံလောက်ရင် refetch လုပ်မှာ ဖြစ်ပြီး — _initialData_ ကိုလည်း လေးစားမှာ ဖြစ်ပါတယ်။ ပုံမှန် [QueryClientProvider](/docs/tanstack-query/query-client-provider) နေရာမှာ _အစားထိုး_ သုံးလို့ ရပါတယ်:

```tsx
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
})

ReactDOM.createRoot(rootElement).render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister }}
  >
    <App />
  </PersistQueryClientProvider>,
)
```

#### Props

`PersistQueryClientProvider` က [QueryClientProvider](/docs/tanstack-query/query-client-provider) နဲ့ အတူတူ props တွေကို လက်ခံပြီး — ထပ်ဆောင်းပြီး အောက်ပါတို့ ပါဝင်ပါတယ်:

- `persistOptions: PersistQueryClientOptions`
  - [persistQueryClient](#persistqueryclient) ဆီ ပို့လို့ရတဲ့ [options](#options) တွေ အားလုံး — QueryClient ကိုယ်တိုင် မပါဘဲ
- `onSuccess?: () => Promise<unknown> | unknown`
  - optional
  - ကနဦး restore ပြီးဆုံးတဲ့အခါ ခေါ်ပေးပါတယ်
  - [resumePausedMutations](https://tanstack.com/query/latest/docs/reference/QueryClient#queryclientresumepausedmutations) ကို ခေါ်ဖို့ သုံးနိုင်ပါတယ်
  - Promise တစ်ခု ပြန်ပို့ထားရင် await လုပ်ပေးပြီး — အဲဒီအထိ restore လုပ်နေတုန်းလို့ သတ်မှတ်ထားပါတယ်
- `onError?: () => Promise<unknown> | unknown`
  - optional
  - restore လုပ်နေစဉ်အတွင်း error တစ်ခု throw ဖြစ်တဲ့အခါ ခေါ်ပေးပါတယ်
  - Promise တစ်ခု ပြန်ပို့ထားရင် await လုပ်ပေးပါတယ်

### useIsRestoring

`PersistQueryClientProvider` ကို သုံးနေတယ်ဆိုရင် — restore တစ်ခု လက်ရှိ လုပ်ဆောင်နေလားဆိုတာ စစ်ဆေးဖို့ `useIsRestoring` hook ကို ၎င်းနဲ့ တွဲသုံးနိုင်ပါတယ် ([useIsRestoring](/docs/tanstack-query/use-is-restoring))။ `useQuery` နဲ့ အခြား hooks တွေကလည်း — restore လုပ်ခြင်းနဲ့ mounting queries တွေကြားမှာ race conditions မဖြစ်အောင် ဒါကို အတွင်းပိုင်းကနေ စစ်ဆေးပါတယ်။

## Persisters

Persisters တွေမှာ အောက်ပါ interface တွေ ရှိပါတယ်:

```tsx
export interface Persister {
  persistClient(persistClient: PersistedClient): Promisable<void>
  restoreClient(): Promisable<PersistedClient | undefined>
  removeClient(): Promisable<void>
}
```

Persist လုပ်ထားတဲ့ client entries တွေမှာ အောက်ပါ interface ရှိပါတယ်:

```tsx
export interface PersistedClient {
  timestamp: number
  buster: string
  clientState: DehydratedState
}
```

ဒါတွေကို (persister တစ်ခု တည်ဆောက်ဖို့) import လုပ်နိုင်ပါတယ်:

```tsx
import {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client'
```

### Persister တစ်ခု တည်ဆောက်ခြင်း (Building a Persister)

သင်ကြိုက်တဲ့ ပုံစံနဲ့ပဲ persist လုပ်နိုင်ပါတယ်။ ဥပမာအနေနဲ့ — [Indexed DB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) persister တစ်ခုကို ဘယ်လို တည်ဆောက်မလဲ အောက်မှာ ပြထားပါတယ်။ `Web Storage API` နဲ့ ယှဉ်ရင် Indexed DB က ပိုမြန်ပြီး — 5MB ထက်ပိုပြီး သိမ်းလို့ရကာ serialization မလိုပါဘူး။ ဆိုလိုတာက `Date` နဲ့ `File` လို JavaScript native types တွေကိုပါ အဆင်သင့် သိမ်းဆည်းထားနိုင်ပါတယ်။

```tsx
import { get, set, del } from 'idb-keyval'
import {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client'

/**
 * Creates an Indexed DB persister
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client)
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey)
    },
    removeClient: async () => {
      await del(idbValidKey)
    },
  } satisfies Persister
}
```
