---
title: "createAsyncStoragePersister (Async Storage Persister ဖန်တီးရန် utility)"
description: "createAsyncStoragePersister — AsyncStorage interface နဲ့ ကိုက်ညီတဲ့ storage (React Native AsyncStorage အပါအဝင်) ပေါ်မှာ cache ကို persist လုပ်ဖို့ persister ဖန်တီးနည်း — usage, retries, options"
order: 57
source: "https://tanstack.com/query/latest/docs/framework/react/plugins/createAsyncStoragePersister"
status: translated
updated: 2026-09-02
---

## တပ်ဆင်ခြင်း (Installation)

ဒီ utility က သီးခြား package တစ်ခုအနေနဲ့ ပါဝင်ပြီး — `'@tanstack/query-async-storage-persister'` import အောက်မှာ ရနိုင်ပါတယ်။

```bash
npm install @tanstack/query-async-storage-persister @tanstack/react-query-persist-client
```

သို့မဟုတ်

```bash
pnpm add @tanstack/query-async-storage-persister @tanstack/react-query-persist-client
```

သို့မဟုတ်

```bash
yarn add @tanstack/query-async-storage-persister @tanstack/react-query-persist-client
```

သို့မဟုတ်

```bash
bun add @tanstack/query-async-storage-persister @tanstack/react-query-persist-client
```

## အသုံးပြုခြင်း (Usage)

- `createAsyncStoragePersister` function ကို import လုပ်ပါ
- asyncStoragePersister အသစ်တစ်ခု ဖန်တီးပါ
  - `AsyncStorage` interface နဲ့ ကိုက်ညီတဲ့ ဘယ် `storage` ကိုမဆို ပို့လို့ရပါတယ် — အောက်က ဥပမာက React Native ရဲ့ async-storage ကို သုံးထားတာပါ
  - `window.localStorage` လို synchronous ဖတ်/ရေး လုပ်တဲ့ storages တွေကလည်း `AsyncStorage` interface နဲ့ ကိုက်ညီလို့ — `createAsyncStoragePersister` နဲ့ပါ သုံးလို့ရပါတယ်
- သင့် app ကို [`PersistQueryClientProvider`](/docs/tanstack-query/persist-query-client#persistqueryclientprovider) component နဲ့ wrap လုပ်ပါ

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

const Root = () => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister: asyncStoragePersister }}
  >
    <App />
  </PersistQueryClientProvider>
)

export default Root
```

## Retries (ပြန်ကြိုးစားခြင်း)

Retries တွေက [SyncStoragePersister](/docs/tanstack-query/create-sync-storage-persister) အတွက်နဲ့ အတူတူပဲ အလုပ်လုပ်ပါတယ် — ကွာခြားချက်က သူတို့က asynchronous တွေလည်း ဖြစ်နိုင်တာပါ။ ကြိုတင်သတ်မှတ်ထားတဲ့ retry handlers တွေကိုလည်း အကုန်လုံး သုံးနိုင်ပါတယ်။

## API

### `createAsyncStoragePersister`

ဒီ function ကို ခေါ်ပြီး — နောက်ပိုင်းမှာ `persistQueryClient` နဲ့ တွဲသုံးနိုင်မယ့် asyncStoragePersister တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။

```tsx
createAsyncStoragePersister(options: CreateAsyncStoragePersisterOptions)
```

### Options

```tsx
interface CreateAsyncStoragePersisterOptions {
  /** The storage client used for setting an retrieving items from cache */
  storage: AsyncStorage | undefined | null
  /** The key to use when storing the cache to localStorage */
  key?: string
  /** To avoid localStorage spamming,
   * pass a time in ms to throttle saving the cache to disk */
  throttleTime?: number
  /** How to serialize the data to storage */
  serialize?: (client: PersistedClient) => string
  /** How to deserialize the data from storage */
  deserialize?: (cachedString: string) => PersistedClient
  /** How to retry persistence on error **/
  retry?: AsyncPersistRetryer
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
  key = `REACT_QUERY_OFFLINE_CACHE`,
  throttleTime = 1000,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}
```
