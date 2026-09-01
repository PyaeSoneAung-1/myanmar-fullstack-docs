---
title: "Persisting Store Data (Store Data သိမ်းဆည်းခြင်း)"
description: "persist middleware နဲ့ Zustand state ကို localStorage, AsyncStorage, IndexedDB စတဲ့ storage တွေမှာ သိမ်းခြင်း — options အားလုံး, Persist API, hydration, asynchronous storages နဲ့ FAQ"
order: 21
source: "https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data"
status: translated
updated: 2026-09-01
---

`persist` middleware က သင့် Zustand state ကို storage တစ်ခုထဲမှာ (ဥပမာ — `localStorage`, `AsyncStorage`, `IndexedDB` စသည်) သိမ်းထားခွင့်ပေးတာမို့ — state ရဲ့ data တွေ ဆက်လက် တည်မြဲနေစေပါတယ် (persist ဖြစ်စေပါတယ်)။

ဒီ middleware က `localStorage` လို synchronous storage တွေရော — `AsyncStorage` လို asynchronous storage တွေကိုပါ ထောက်ပံ့ပေးပါတယ်။ ဒါပေမယ့် asynchronous storage ကို သုံးတာက ကုန်ကျစရိတ် (cost) တစ်ခု ရှိပါတယ်။ အသေးစိတ်ကို [Hydration နဲ့ asynchronous storages](#hydration-and-asynchronous-storages) မှာ ကြည့်ပါ။

## ရိုးရှင်းတဲ့ ဥပမာ

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useBearStore = create()(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // storage ထဲက item ရဲ့ name (unique ဖြစ်ရမယ်)
      storage: createJSONStorage(() => sessionStorage), // (optional) default အားဖြင့် 'localStorage' ကို သုံးပါတယ်
    },
  ),
)
```

## TypeScript ရိုးရှင်းတဲ့ ဥပမာ

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type BearStore = {
  bears: number
  addABear: () => void
}

export const useBearStore = create<BearStore>()(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // storage ထဲက item ရဲ့ name (unique ဖြစ်ရမယ်)
      storage: createJSONStorage(() => sessionStorage), // (optional) default အားဖြင့် 'localStorage' ကို သုံးပါတယ်
    },
  ),
)
```

## Options

### `name` — သိမ်းဆည်းမည့် key နာမည်

ဒါက တစ်ခုတည်းသော မဖြစ်မနေ လိုအပ်တဲ့ option ပါ။ ပေးလိုက်တဲ့ name က သင့် Zustand state ကို storage ထဲမှာ သိမ်းဖို့ သုံးမယ့် key ဖြစ်လို့ — unique ဖြစ်ရပါမယ်။

### `storage` — စိတ်ကြိုက် storage engine

> Type: `() => StateStorage`

`StateStorage` ကို ဒီလို import လုပ်နိုင်ပါတယ်:

```ts
import { StateStorage } from 'zustand/middleware'
```

> Default: `createJSONStorage(() => localStorage)`

သင့်ကိုယ်ပိုင် storage ကို သုံးခွင့်ပေးပါတယ်။ သင်သုံးချင်တဲ့ storage ကို ပြန်ပေးတဲ့ function တစ်ခုကို ရိုးရိုးရှင်းရှင်း ပေးလိုက်ရုံပါပဲ။ `StateStorage` interface နဲ့ ကိုက်ညီတဲ့ `storage` object တစ်ခု ဖန်တီးဖို့ [`createJSONStorage`](#createjsonstorage) helper function ကို သုံးဖို့ အကြံပြုပါတယ်။

ဥပမာ:

```ts
import { persist, createJSONStorage } from 'zustand/middleware'

export const useBoundStore = create(
  persist(
    (set, get) => ({
      // ...
    }),
    {
      // ...
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
```

### `partialize` — သိမ်းမယ့် field တွေ ရွေးချယ်ခြင်း

> Type: `(state: Object) => Object`

> Default: `(state) => state`

State ထဲက field တချို့ကိုပဲ storage ထဲ သိမ်းချင်ရင် ရွေးလို့ရပါတယ်။

Field အများကြီးထဲက တချို့ကို ချန်လှပ်ထားချင်ရင် အောက်ကလို လုပ်နိုင်ပါတယ်:

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      foo: 0,
      bar: 1,
    }),
    {
      // ...
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['foo'].includes(key)),
        ),
    },
  ),
)
```

ဒါမှမဟုတ် သီးခြား field တချို့ကိုပဲ ခွင့်ပြုချင်ရင် အောက်ကလို လုပ်နိုင်ပါတယ်:

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      foo: 0,
      bar: 1,
    }),
    {
      // ...
      partialize: (state) => ({ foo: state.foo }),
    },
  ),
)
```

### `onRehydrateStorage` — Hydration listener

> Type: `(state: Object) => ((state?: Object, error?: Error) => void) | void`

ဒီ option က storage ကို hydrate လုပ်တဲ့အခါ ခေါ်ပေးမယ့် listener function တစ်ခုကို ပေးနိုင်ပါတယ်။

ဥပမာ:

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      // ...
    }),
    {
      // ...
      onRehydrateStorage: (state) => {
        console.log('hydration starts')

        // optional
        return (state, error) => {
          if (error) {
            console.log('an error happened during hydration', error)
          } else {
            console.log('hydration finished')
          }
        }
      },
    },
  ),
)
```

### `version` — Storage version

> Type: `number`

> Default: `0`

Storage ထဲမှာ breaking change တစ်ခု မိတ်ဆက်ချင်တယ်ဆိုရင် (ဥပမာ — field တစ်ခုကို ပြန်မှည့်တာမျိုး) — version နံပါတ်အသစ်တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။ Default အားဖြင့် — storage ထဲက version နဲ့ code ထဲက version မတူညီရင် သိမ်းထားတဲ့ value ကို သုံးမှာ မဟုတ်ပါဘူး။ အရင်က သိမ်းထားခဲ့တဲ့ data တွေကို ဆက်ထိန်းထားနိုင်ဖို့ breaking changes တွေကို ကိုင်တွယ်ဖို့ [migrate](#migrate) function ကို သုံးနိုင်ပါတယ် (အောက်မှာ ကြည့်ပါ)။

### `migrate` — Version migration ကိုင်တွယ်ခြင်း

> Type: `(persistedState: Object, version: number) => Object | Promise<Object>`

> Default: `(persistedState) => persistedState`

ဒီ option ကို version migrations တွေကို ကိုင်တွယ်ဖို့ သုံးနိုင်ပါတယ်။ Migrate function က persisted state နဲ့ version နံပါတ်ကို argument အဖြစ် လက်ခံပြီး — နောက်ဆုံးထွက် version (code ထဲက version) နဲ့ ကိုက်ညီတဲ့ state တစ်ခုကို ပြန်ပေးရပါမယ်။

ဥပမာ — field တစ်ခုကို ပြန်မှည့်ချင်ရင် အောက်ကလို သုံးနိုင်ပါတယ်:

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      newField: 0, // version 0 မှာ ဒီ field ကို နာမည်တစ်မျိုးနဲ့ သုံးခဲ့တယ်ဆိုပါစို့
    }),
    {
      // ...
      version: 1, // storage ထဲက version နဲ့ ဒီ version မတူရင် migration ဖြစ်ပေါ်ပါမယ်
      migrate: (persistedState, version) => {
        if (version === 0) {
          // သိမ်းထားတဲ့ value က version 0 ဖြစ်ရင် field ကို နာမည်အသစ်နဲ့ ပြောင်းလိုက်ပါတယ်
          persistedState.newField = persistedState.oldField
          delete persistedState.oldField
        }

        return persistedState
      },
    },
  ),
)
```

### `merge` — Custom merge function

> Type: `(persistedState: Object, currentState: Object) => Object`

> Default: `(persistedState, currentState) => ({ ...currentState, ...persistedState })`

တချို့ကိစ္စတွေမှာ — persisted value နဲ့ လက်ရှိ state ကို ပေါင်းစပ်ဖို့ (merge) custom merge function တစ်ခုကို သုံးချင်ပါလိမ့်မယ်။

Default အားဖြင့် middleware က shallow merge လုပ်ပါတယ်။ Nested objects တွေကို တစ်စိတ်တစ်ပိုင်း သိမ်းထားတယ်ဆိုရင် — shallow merge က မလုံလောက်နိုင်ပါဘူး။ ဥပမာ — storage ထဲမှာ အောက်ပါအတိုင်း ရှိနေပြီး:

```ts
{
  foo: {
    bar: 0,
  }
}
```

ဒါပေမယ့် သင့် Zustand store ထဲမှာ:

```ts
{
  foo: {
    bar: 0,
    baz: 1,
  }
}
```

Shallow merge လုပ်လိုက်ရင် `foo` object ထဲက `baz` field က ပျောက်သွားပါလိမ့်မယ်။ ဒါကို ဖြေရှင်းဖို့ နည်းတစ်ခုကတော့ custom deep merge function တစ်ခု ပေးလိုက်တာပါ:

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      foo: {
        bar: 0,
        baz: 1,
      },
    }),
    {
      // ...
      merge: (persistedState, currentState) =>
        deepMerge(currentState, persistedState),
    },
  ),
)
```

### `skipHydration` — Hydration ကို ရွှေ့ဆိုင်းခြင်း

> Type: `boolean | undefined`

> Default: `undefined`

Default အားဖြင့် store ကို initialization လုပ်ချိန်မှာ hydrate လုပ်ပါတယ်။

တချို့ applications တွေမှာ — ပထမဆုံး hydration ဘယ်အချိန် ဖြစ်မလဲဆိုတာကို ကိုယ်တိုင် ထိန်းချုပ်ဖို့ လိုပါတယ်။ ဥပမာ — server-rendered apps တွေမှာပေါ့။

`skipHydration` ကို သတ်မှတ်ထားရင် — hydration အတွက် ကနဦး ခေါ်ဆိုမှုကို မလုပ်တော့ဘဲ — `rehydrate()` ကို ကိုယ်တိုင် manually ခေါ်ဖို့ သင့်အပေါ်မှာ မူတည်ပါတယ်။

```ts
export const useBoundStore = create(
  persist(
    () => ({
      count: 0,
      // ...
    }),
    {
      // ...
      skipHydration: true,
    },
  ),
)
```

```tsx
import { useBoundStore } from './path-to-store';

export function StoreConsumer() {
  // mount ဖြစ်ပြီးနောက်မှာ persisted store ကို hydrate လုပ်ပါ
  useEffect(() => {
    useBoundStore.persist.rehydrate();
  }, [])

  return (
    //...
  )
}
```

## API

> Version: >=3.6.3

Persist API က React component တစ်ခုရဲ့ အတွင်းကရော အပြင်ကပါ — Persist middleware နဲ့ အပြန်အလှန် ဆက်သွယ်မှုတွေ အများကြီး လုပ်နိုင်စေပါတယ်။

### `getOptions`

> Type: `() => Partial<PersistOptions>`

> Returns: Persist middleware ရဲ့ Options

ဥပမာ — storage name ကို ရယူဖို့ သုံးနိုင်ပါတယ်:

```ts
useBoundStore.persist.getOptions().name
```

### `setOptions`

> Type: `(newOptions: Partial<PersistOptions>) => void`

Middleware ရဲ့ options တွေကို ပြောင်းလဲပေးပါတယ်။ သတိပြုရမှာက — option အသစ်တွေက လက်ရှိ options တွေနဲ့ merge လုပ်သွားမှာ ဖြစ်ပါတယ်။

ဥပမာ — storage name ကို ပြောင်းဖို့ သုံးနိုင်ပါတယ်:

```ts
useBoundStore.persist.setOptions({
  name: 'new-name',
})
```

ဒါမှမဟုတ် storage engine ကိုတောင် ပြောင်းလို့ရပါတယ်:

```ts
useBoundStore.persist.setOptions({
  storage: createJSONStorage(() => sessionStorage),
})
```

### `clearStorage`

> Type: `() => void`

[name](#name) key အောက်မှာ သိမ်းထားသမျှ အားလုံးကို ရှင်းလင်းပစ်ပါတယ်။

```ts
useBoundStore.persist.clearStorage()
```

### `rehydrate`

> Type: `() => Promise<void>`

တချို့ကိစ္စတွေမှာ — rehydration ကို ကိုယ်တိုင် manually စတင်ချင်ပါလိမ့်မယ်။ `rehydrate` method ကို ခေါ်ပြီး ဒါကို လုပ်နိုင်ပါတယ်။

```ts
await useBoundStore.persist.rehydrate()
```

### `hasHydrated`

> Type: `() => boolean`

ဒါက storage ကို hydrate လုပ်ပြီးပြီလားဆိုတာ စစ်ဆေးတဲ့ non-reactive getter တစ်ခုပါ ([rehydrate](#rehydrate) ကို ခေါ်တဲ့အခါ update ဖြစ်တာကို သတိပြုပါ)။

```ts
useBoundStore.persist.hasHydrated()
```

### `onHydrate`

> Type: `(listener: (state) => void) => () => void`

> Returns: Unsubscribe function

Hydration လုပ်ငန်းစဉ် စတင်တဲ့အခါ ဒီ listener ကို ခေါ်ပေးပါတယ်။

```ts
const unsub = useBoundStore.persist.onHydrate((state) => {
  console.log('hydration starts')
})

// နောက်ပိုင်းမှာ...
unsub()
```

### `onFinishHydration`

> Type: `(listener: (state) => void) => () => void`

> Returns: Unsubscribe function

Hydration လုပ်ငန်းစဉ် ပြီးဆုံးတဲ့အခါ ဒီ listener ကို ခေါ်ပေးပါတယ်။

```ts
const unsub = useBoundStore.persist.onFinishHydration((state) => {
  console.log('hydration finished')
})

// နောက်ပိုင်းမှာ...
unsub()
```

### `createJSONStorage`

> Type: `(getStorage: () => StateStorage, options?: JsonStorageOptions) => StateStorage`

> Returns: `PersistStorage`

ဒီ helper function က custom storage engine တစ်ခုကို သုံးချင်တဲ့အခါ အသုံးဝင်တဲ့ [`storage`](#storage) object တစ်ခုကို ဖန်တီးပေးပါတယ်။

`getStorage` ဆိုတာ `getItem`, `setItem` နဲ့ `removeItem` ဆိုတဲ့ properties တွေ ပါတဲ့ storage engine ကို ပြန်ပေးတဲ့ function တစ်ခုပါ။

`options` က data ရဲ့ serialization နဲ့ deserialization ကို စိတ်ကြိုက် ပြင်ဆင်ဖို့ optional object တစ်ခုပါ။ `options.reviver` ဆိုတာ data ကို deserialize လုပ်ဖို့ `JSON.parse` ဆီ ပေးပို့တဲ့ function ဖြစ်ပြီး — `options.replacer` ကတော့ data ကို serialize လုပ်ဖို့ `JSON.stringify` ဆီ ပေးပို့တဲ့ function ပါ။

```ts
import { createJSONStorage } from 'zustand/middleware'

const storage = createJSONStorage(() => sessionStorage, {
  reviver: (key, value) => {
    if (value && value.type === 'date') {
      return new Date(value)
    }
    return value
  },
  replacer: (key, value) => {
    // မှတ်ချက်: `.toJSON()` ရဲ့ ရလဒ်ကို replacer function ဆီ value အနေနဲ့ ပေးပို့ပါတယ်
    // ဒါကြောင့် ဒီနေရာမှာ Date က `string` အဖြစ် အမြဲ ရှိနေပါတယ်
    if (key === 'someDate') return { type: 'date', value }
    return value
  },
})
```

## Hydration နဲ့ asynchronous storages

Asynchronous storages တွေရဲ့ "ကုန်ကျစရိတ်" က ဘာလဲဆိုတာကို ရှင်းပြဖို့ — hydration ဆိုတာ ဘာလဲဆိုတာ နားလည်ထားဖို့ လိုပါတယ်။

အချုပ်ပြောရရင် — hydration ဆိုတာ storage ထဲကနေ persisted state ကို ပြန်ယူပြီး လက်ရှိ state နဲ့ merge လုပ်တဲ့ လုပ်ငန်းစဉ်ပါ။

Persist middleware က hydration နှစ်မျိုး လုပ်ပါတယ် — synchronous နဲ့ asynchronous။ ပေးထားတဲ့ storage က synchronous (ဥပမာ — `localStorage`) ဆိုရင် — hydration ကို synchronously လုပ်ပါတယ်။ တစ်ဖက်မှာ — storage က asynchronous (ဥပမာ — `AsyncStorage`) ဆိုရင် — hydration ကို asynchronously လုပ်ပါတယ် (အံ့သြစရာပဲ မဟုတ်လား!)။

ဒါပေမယ့် ကွာခြားချက်က ဘာလဲ? Synchronous hydration နဲ့ဆို — Zustand store က ဖန်တီးလိုက်တာနဲ့ ချက်ချင်း hydrate ဖြစ်ပြီးသားပါ။ ဆန့်ကျင်ဘက်အနေနဲ့ — asynchronous hydration နဲ့ဆို — Zustand store က နောက်ပိုင်းမှာ microtask တစ်ခုထဲမှာ hydrate ဖြစ်ပါတယ်။

ဒါက ဘာကြောင့် အရေးကြီးလဲ? Asynchronous hydration က မမျှော်လင့်တဲ့ အပြုအမူတချို့ ဖြစ်စေနိုင်ပါတယ်။ ဥပမာ — React app တစ်ခုမှာ Zustand သုံးနေတယ်ဆိုရင် — store က **ကနဦး render မှာ** hydrate ဖြစ်မှာ မဟုတ်ပါဘူး။ သင့် app က page load ချိန်မှာ persisted value ပေါ် မှီခိုနေတယ်ဆိုရင် — ဘာမှ မပြခင် store hydrate ဖြစ်ပြီးတဲ့အထိ စောင့်ချင်ပါလိမ့်မယ်။ ဥပမာ — သင့် app က user က login မဝင်ထားဘူးလို့ ထင်နေနိုင်ပါတယ် — ဘာလို့လဲဆိုတော့ default က အဲဒါမို့ပါ — ဒါပေမယ့် တကယ်တော့ store က မျိုမကျသေးတာ ဖြစ်နိုင်ပါတယ်။

သင့် app က page load ချိန်မှာ persisted state ပေါ် မှီခိုနေတယ်ဆိုရင် — အောက်က [FAQ](#faq) section ထဲက [_Store hydrated ဖြစ်ပြီလားဆိုတာ ဘယ်လို စစ်မလဲ_](#how-can-i-check-if-my-store-has-been-hydrated) ကို ကြည့်ပါ။

### Next.js မှာ သုံးခြင်း

NextJS က Server Side Rendering ကို သုံးပြီး — server ပေါ်မှာ render လုပ်ထားတဲ့ component ကို client ပေါ်မှာ render လုပ်တာနဲ့ နှိုင်းယှဉ်ကြည့်ပါတယ်။ ဒါပေမယ့် သင်က browser ကနေ ရတဲ့ data ကို သုံးပြီး component ကို ပြောင်းနေတာမို့ — render နှစ်ခု ကွဲပြားနေပြီး Next က warning တစ်ခု ပစ်ပေးပါလိမ့်မယ်။

Error တွေကတော့ အများအားဖြင့်:

- Text content does not match server-rendered HTML
- Hydration failed because the initial UI does not match what was rendered on the server
- There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering

ဒီ errors တွေကို ဖြေရှင်းဖို့ — Zustand က သင့် components တွေကို မပြောင်းခင် နည်းနည်းလေး စောင့်နိုင်အောင် custom hook တစ်ခု ဖန်တီးပါ။

အောက်ပါအတိုင်း file တစ်ခု ဖန်တီးပါ:

```ts
// useStore.ts
import { useState, useEffect } from 'react'

const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) => {
  const result = store(callback) as F
  const [data, setData] = useState<F>()

  useEffect(() => {
    setData(result)
  }, [result])

  return data
}

export default useStore
```

အခု သင့် pages တွေမှာ — hook ကို နည်းနည်း ကွဲပြားတဲ့ ပုံစံနဲ့ သုံးပါလိမ့်မယ်:

```ts
// useBearStore.ts

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// store ကိုယ်တိုင်ကတော့ ပြောင်းလဲစရာ မလိုပါဘူး
export const useBearStore = create(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage',
    },
  ),
)
```

```ts
// yourComponent.tsx

import useStore from './useStore'
import { useBearStore } from './stores/useBearStore'

const bears = useStore(useBearStore, (state) => state.bears)
```

Credit: [ဒီ issue reply](https://github.com/pmndrs/zustand/issues/938#issuecomment-1481801942) ကို ကိုးကားထားပြီး — [ဒီ blog post](https://dev.to/abdulsamad/how-to-use-zustands-persist-middleware-in-nextjs-4lb5) ကို ညွှန်ပြပါတယ်။

## FAQ

### Store hydrated ဖြစ်ပြီလားဆိုတာ ဘယ်လို စစ်မလဲ

ဒါကို လုပ်ဖို့ နည်းလမ်း အနည်းငယ် ရှိပါတယ်။

Store ထဲက field တစ်ခုကို update လုပ်ဖို့ [onRehydrateStorage](#onrehydratestorage) listener function ကို သုံးနိုင်ပါတယ်:

```ts
const useBoundStore = create(
  persist(
    (set, get) => ({
      // ...
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      }
    }),
    {
      // ...
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true)
      }
    }
  )
);

export default function App() {
  const hasHydrated = useBoundStore(state => state._hasHydrated);

  if (!hasHydrated) {
    return <p>Loading...</p>
  }

  return (
    // ...
  );
}
```

Custom `useHydration` hook တစ်ခုလည်း ဖန်တီးနိုင်ပါတယ်:

```ts
const useBoundStore = create(persist(...))

const useHydration = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // မှတ်ချက်: Manual rehydration ကိုပါ ထည့်သွင်းစဉ်းစားချင်တဲ့အခါ အတွက် ဖြစ်ပါတယ်။
    // မလိုအပ်ရင် အောက်က line ကို ဖျက်လိုက်လို့ရပါတယ်။
    const unsubHydrate = useBoundStore.persist.onHydrate(() => setHydrated(false))

    const unsubFinishHydration = useBoundStore.persist.onFinishHydration(() => setHydrated(true))

    setHydrated(useBoundStore.persist.hasHydrated())

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
  }, [])

  return hydrated
}
```

### Custom storage engine တစ်ခုကို ဘယ်လို သုံးမလဲ

သင်သုံးချင်တဲ့ storage က မျှော်လင့်ထားတဲ့ API နဲ့ မကိုက်ညီဘူးဆိုရင် — ကိုယ်ပိုင် storage တစ်ခုကို ဖန်တီးနိုင်ပါတယ်:

```ts
import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval' // IndexedDB, Ionic Storage စသဖြင့် ဘာမဆို သုံးနိုင်ပါတယ်

// Custom storage object
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, 'has been retrieved')
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, 'with value', value, 'has been saved')
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, 'has been deleted')
    await del(name)
  },
}

export const useBoundStore = create(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // unique ဖြစ်တဲ့ name
      storage: createJSONStorage(() => storage),
    },
  ),
)
```

`JSON.stringify()` က မထောက်ပံ့တဲ့ type တစ်ခုကို သုံးနေတယ်ဆိုရင် — ကိုယ်ပိုင် serialization/deserialization code ရေးဖို့ လိုပါလိမ့်မယ်။ ဒါပေမယ့် အဲဒါက ငြီးငွေ့စရာ ဖြစ်နေရင် — data type အမျိုးမျိုးကို serialize/deserialize လုပ်ဖို့ third-party libraries တွေကို သုံးနိုင်ပါတယ်။

ဥပမာ — [Superjson](https://github.com/blitz-js/superjson) က data ကို သူ့ရဲ့ type နဲ့အတူ serialize လုပ်နိုင်ပြီး — deserialization လုပ်တဲ့အခါ data ကို မူရင်း type အတိုင်း ပြန်ရစေပါတယ်

```ts
import superjson from 'superjson' // serialize-javascript, devalue စသဖြင့် ဘာမဆို သုံးနိုင်ပါတယ်
import { PersistStorage } from 'zustand/middleware'

interface BearState {
  bear: Map<string, string>
  fish: Set<string>
  time: Date
  query: RegExp
}

const storage: PersistStorage<BearState> = {
  getItem: (name) => {
    const str = localStorage.getItem(name)
    if (!str) return null
    return superjson.parse(str)
  },
  setItem: (name, value) => {
    localStorage.setItem(name, superjson.stringify(value))
  },
  removeItem: (name) => localStorage.removeItem(name),
}

const initialState: BearState = {
  bear: new Map(),
  fish: new Set(),
  time: new Date(),
  query: new RegExp(''),
}

export const useBearStore = create<BearState>()(
  persist(
    (set) => ({
      ...initialState,
      // ...
    }),
    {
      name: 'food-storage',
      storage,
    },
  ),
)
```

### Storage event ပေါ်မှာ ဘယ်လို rehydrate လုပ်မလဲ

Persist API ကို သုံးပြီး ကိုယ်ပိုင် implementation တစ်ခု ဖန်တီးနိုင်ပါတယ် — အောက်က ဥပမာနဲ့ ဆင်တူပါတယ်:

```ts
type StoreWithPersist = Mutate<StoreApi<State>, [["zustand/persist", unknown]]>

export const withStorageDOMEvents = (store: StoreWithPersist) => {
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      store.persist.rehydrate()
    }
  }

  window.addEventListener('storage', storageEventCallback)

  return () => {
    window.removeEventListener('storage', storageEventCallback)
  }
}

const useBoundStore = create(persist(...))
withStorageDOMEvents(useBoundStore)
```

### TypeScript နဲ့ ဘယ်လို သုံးမလဲ

အခြေခံ TypeScript အသုံးပြုမှုက — `create(...)` အစား `create<State>()(...)` လို့ ရေးရတာကလွဲရင် ဘာမှ အထူး မလိုအပ်ပါဘူး။

```tsx
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface MyState {
  bears: number
  addABear: () => void
}

export const useBearStore = create<MyState>()(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // storage ထဲက item ရဲ့ name (unique ဖြစ်ရမယ်)
      storage: createJSONStorage(() => sessionStorage), // (optional) default အားဖြင့် 'localStorage' ကို သုံးပါတယ်
      partialize: (state) => ({ bears: state.bears }),
    },
  ),
)
```

### Map နဲ့ Set တွေနဲ့ ဘယ်လို သုံးမလဲ

`Map` နဲ့ `Set` လို object types တွေကို persist လုပ်ဖို့ဆိုရင် — အဲဒါတွေကို `Array` လို JSON-serializable type တွေအဖြစ် ပြောင်းဖို့ လိုပါလိမ့်မယ်။ Custom `storage` engine တစ်ခုကို သတ်မှတ်ပြီး ဒါကို လုပ်နိုင်ပါတယ်။

သင့် state က `transactions` စာရင်းတစ်ခုကို ကိုင်တွယ်ဖို့ `Map` ကို သုံးနေတယ်ဆိုပါစို့ — အောက်မှာ ပြထားတဲ့အတိုင်း `storage` prop ထဲမှာ `Map` ကို `Array` အဖြစ် ပြောင်းလို့ရပါတယ်:

```ts

interface BearState {
  .
  .
  .
  transactions: Map<any>
}

  storage: {
    getItem: (name) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      const existingValue = JSON.parse(str);
      return {
        ...existingValue,
        state: {
          ...existingValue.state,
          transactions: new Map(existingValue.state.transactions),
        }
      }
    },
    setItem: (name, newValue: StorageValue<BearState>) => {
      // functions တွေကို JSON encode လုပ်လို့ မရပါဘူး
      const str = JSON.stringify({
        ...newValue,
        state: {
          ...newValue.state,
          transactions: Array.from(newValue.state.transactions.entries()),
        },
      })
      localStorage.setItem(name, str)
    },
    removeItem: (name) => localStorage.removeItem(name),
  },
```
