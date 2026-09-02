---
title: "createSyncStoragePersister (Sync Storage Persister ဖန်တီးရန် utility)"
description: "createSyncStoragePersister — localStorage/sessionStorage လို synchronous storage တွေနဲ့ cache ကို persist လုပ်ဖို့ persister ဖန်တီးနည်း — deprecated အခြေအနေ, usage, retries, options"
order: 56
source: "https://tanstack.com/query/latest/docs/framework/react/plugins/createSyncStoragePersister"
status: translated
updated: 2026-09-02
---

## Deprecated (အသုံးမပြုတော့ပါ)

ဒီ plugin က deprecated ဖြစ်နေပြီး — နောက် major version မှာ ဖယ်ရှားပစ်မှာ ဖြစ်ပါတယ်။ အဲဒီအစား ['@tanstack/query-async-storage-persister'](/docs/tanstack-query/create-async-storage-persister) ကို ရိုးရိုးရှင်းရှင်း သုံးနိုင်ပါတယ်။

## တပ်ဆင်ခြင်း (Installation)

ဒီ utility က သီးခြား package တစ်ခုအနေနဲ့ ပါဝင်ပြီး — `'@tanstack/query-sync-storage-persister'` import အောက်မှာ ရနိုင်ပါတယ်။

```bash
npm install @tanstack/query-sync-storage-persister @tanstack/react-query-persist-client
```

သို့မဟုတ်

```bash
pnpm add @tanstack/query-sync-storage-persister @tanstack/react-query-persist-client
```

သို့မဟုတ်

```bash
yarn add @tanstack/query-sync-storage-persister @tanstack/react-query-persist-client
```

သို့မဟုတ်

```bash
bun add @tanstack/query-sync-storage-persister @tanstack/react-query-persist-client
```

## အသုံးပြုခြင်း (Usage)

- `createSyncStoragePersister` function ကို import လုပ်ပါ
- syncStoragePersister အသစ်တစ်ခု ဖန်တီးပါ
- [`persistQueryClient`](/docs/tanstack-query/persist-query-client) function ဆီ ပို့ပါ

```tsx
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})
// const sessionStoragePersister = createSyncStoragePersister({ storage: window.sessionStorage })

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
})
```

## Retries (ပြန်ကြိုးစားခြင်း)

Persistence က မအောင်မြင်နိုင်ပါဘူး — ဥပမာ size က storage ပေါ်က ရနိုင်တဲ့ နေရာထက် ကျော်လွန်သွားရင် မျိုးမှာပါ။ Errors တွေကို persister ဆီ `retry` function တစ်ခု ပေးပြီး လှပစွာ ကိုင်တွယ်နိုင်ပါတယ်။

retry function က သိမ်းဖို့ ကြိုးစားခဲ့တဲ့ `persistedClient` အပြင် `error` နဲ့ `errorCount` တို့ကိုပါ input အနေနဲ့ လက်ခံပါတယ်။ ပြန် persist လုပ်ဖို့ ကြိုးစားမယ့် _new_ `PersistedClient` တစ်ခုကို ပြန်ပေးရမှာ ဖြစ်ပါတယ်။ _undefined_ ပြန်ပို့ရင် — နောက်ထပ် persist ကြိုးစားမှု ရှိတော့မှာ မဟုတ်ပါဘူး။

```tsx
export type PersistRetryer = (props: {
  persistedClient: PersistedClient
  error: Error
  errorCount: number
}) => PersistedClient | undefined
```

### ကြိုတင်သတ်မှတ်ထားသော နည်းလမ်းများ (Predefined Strategies)

Default အနေနဲ့ — retry ဘာမှ ဖြစ်မှာ မဟုတ်ပါဘူး။ Retry တွေကို ကိုင်တွယ်ဖို့ ကြိုတင်သတ်မှတ်ထားတဲ့ နည်းလမ်းတွေထဲက တစ်ခုကို သုံးနိုင်ပါတယ်။ ၎င်းတို့ကို `'@tanstack/react-query-persist-client'` ကနေ import လုပ်နိုင်ပါတယ်:

- `removeOldestQuery`
  - ရှေးအကျဆုံး query ကို ဖယ်ထားတဲ့ `PersistedClient` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

```tsx
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  retry: removeOldestQuery,
})
```

## API

### `createSyncStoragePersister`

ဒီ function ကို ခေါ်ပြီး — နောက်ပိုင်းမှာ `persistQueryClient` နဲ့ တွဲသုံးနိုင်မယ့် syncStoragePersister တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။

```tsx
createSyncStoragePersister(options: CreateSyncStoragePersisterOptions)
```

### Options

```tsx
interface CreateSyncStoragePersisterOptions {
  /** The storage client used for setting an retrieving items from cache (window.localStorage or window.sessionStorage) */
  storage: Storage | undefined | null
  /** The key to use when storing the cache */
  key?: string
  /** To avoid spamming,
   * pass a time in ms to throttle saving the cache to disk */
  throttleTime?: number
  /** How to serialize the data to storage */
  serialize?: (client: PersistedClient) => string
  /** How to deserialize the data from storage */
  deserialize?: (cachedString: string) => PersistedClient
  /** How to retry persistence on error **/
  retry?: PersistRetryer
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

#### `serialize` နဲ့ `deserialize` options

`localStorage` ထဲမှာ သိမ်းလို့ရတဲ့ data ပမာဏမှာ ကန့်သတ်ချက် ရှိပါတယ်။ `localStorage` မှာ data ပိုပြီး သိမ်းချင်ရင် — [lz-string](https://github.com/pieroxy/lz-string/) လို library တစ်ခုနဲ့ data တွေကို compress/decompress လုပ်ဖို့ `serialize` နဲ့ `deserialize` function တွေကို override လုပ်နိုင်ပါတယ်။

```tsx
import { QueryClient } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import { compress, decompress } from 'lz-string'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
})

persistQueryClient({
  queryClient: queryClient,
  persister: createSyncStoragePersister({
    storage: window.localStorage,
    serialize: (data) => compress(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decompress(data)),
  }),
  maxAge: Infinity,
})
```
