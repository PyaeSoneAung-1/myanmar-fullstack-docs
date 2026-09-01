---
title: "TypeScript"
description: "SWR နဲ့ TypeScript တွဲသုံးခြင်း — type-safe data fetching၊ fetcher ရဲ့ argument type တွေကို အလိုအလျောက် infer လုပ်ခြင်း၊ generics နဲ့ middleware types"
order: 14
source: "https://swr.vercel.app/docs/typescript"
status: translated
updated: 2026-09-01
---

SWR က TypeScript နဲ့ ရေးထားတဲ့ app တွေအတွက် အဆင်ပြေပါတယ် — type safety က စက်ရုံထုတ်အနေနဲ့ (out of the box) ပါပြီးသားပါ။

## အခြေခံ အသုံးပြုနည်း

Default အားဖြင့် — SWR က `fetcher` ရဲ့ argument type တွေကို `key` ကနေ infer (ခန့်မှန်း) လုပ်ပေးပါတယ် — ဒါကြောင့် လိုချင်တဲ့ type တွေကို အလိုအလျောက် ရရှိပါတယ်။

### useSWR

```typescript
// `key` ကို `string` အနေနဲ့ infer လုပ်ပါမယ်
useSWR('/api/user', key => {})
useSWR(() => '/api/user', key => {})

// `key` ကို { a: string; b: { c: string; d: number } } အနေနဲ့ infer လုပ်ပါမယ်
useSWR({ a: '1', b: { c: '3', d: 2 } }, key => {})
useSWR(() => ({ a: '1', b: { c: '3', d: 2 } }), key => {})

// `arg0` ကို string အနေနဲ့၊ `arg1` ကို number အနေနဲ့ infer လုပ်ပါမယ်
useSWR(['user', 8], ([arg0, arg1]) => {})
useSWR(() => ['user', 8], ([arg0, arg1]) => {})
```

`key` နဲ့ `fetcher` ရဲ့ argument type တွေကို ကိုယ်တိုင် အတိအကျ သတ်မှတ်လို့လည်း ရပါတယ်။

```typescript
import useSWR, { Fetcher } from 'swr'

const uid = '<user_id>'
const fetcher: Fetcher<User, string> = (id) => getUserById(id)

const { data } = useSWR(uid, fetcher)
// `data` က `User | undefined` ဖြစ်ပါမယ်။
```

Default အားဖြင့် — `fetcher` function ထဲမှာ [ပစ်လိုက်တဲ့ error](https://swr.vercel.app/docs/error-handling) ရဲ့ type က `any` ဖြစ်ပါတယ်။ ဒီ type ကိုလည်း အတိအကျ သတ်မှတ်လို့ရပါတယ်။

```typescript
const { data, error } = useSWR<User, Error>(uid, fetcher);
// `data` က `User | undefined` ဖြစ်ပါမယ်။
// `error` က `Error | undefined` ဖြစ်ပါမယ်။
```

### useSWRInfinite

`swr/infinite` မှာလည်း အလားတူပါပဲ — automatic type inference ကို အားကိုးလို့ရသလို — type တွေကို ကိုယ်တိုင်လည်း အတိအကျ သတ်မှတ်လို့ရပါတယ်။

```typescript
import { SWRInfiniteKeyLoader } from 'swr/infinite'

const getKey: SWRInfiniteKeyLoader = (index, previousPageData) => {
  // ...
}

const { data } = useSWRInfinite(getKey, fetcher)
```

### useSWRSubscription

- Subscribe function ကို inline ရေးပြီး — `next` ရဲ့ type ကို `SWRSubscriptionOptions` နဲ့ ကိုယ်တိုင် သတ်မှတ်နိုင်ပါတယ်။

```tsx
import useSWRSubscription from 'swr/subscription'
import type { SWRSubscriptionOptions } from 'swr/subscription'

const { data, error } = useSWRSubscription('key', 
  (key, { next }: SWRSubscriptionOptions<number, Error>) => {
  //^ key ကို `string` အနေနဲ့ infer လုပ်ပါမယ်
  //....
  })
  return {
    data,
    //^ data ကို `number | undefined` အနေနဲ့ infer လုပ်ပါမယ်
    error
    //^ error ကို `Error | undefined` အနေနဲ့ infer လုပ်ပါမယ်
  }
}
```

- Subscribe function ကို `SWRSubscription` နဲ့ ကြေညာနိုင်ပါတယ်။

```tsx
import useSWRSubscription from 'swr/subscription'
import type { SWRSubscription } from 'swr/subscription'

/** 
 * ပထမဆုံး generic က Key
 * ဒုတိယ generic က Data
 * တတိယ generic က Error
 */
const sub: SWRSubscription<string, number, Error> = (key, { next }) => {                         
  //......
}
const { data, error } = useSWRSubscription('key', sub)
```

## Generics

`data` ရဲ့ type ကို သတ်မှတ်တာ လွယ်ပါတယ်။ Default အားဖြင့် — `fetcher` ရဲ့ return type ကို (non-ready state အတွက် `undefined` နဲ့အတူ) `data` type အဖြစ် သုံးပါတယ် — ဒါပေမယ့် parameter အနေနဲ့လည်း ပေးလို့ရပါတယ်:

```typescript
// 🔹 A. Typed fetcher သုံးခြင်း:
// `getUser` က `(endpoint: string) => User` ဖြစ်ပါတယ်
const { data } = useSWR('/api/user', getUser)

// 🔹 B. Data type ကို သတ်မှတ်ခြင်း:
// `fetcher` က ယေဘုယျအားဖြင့် `any` ပြန်ပေးနေပါတယ်
const { data } = useSWR<User>('/api/user', fetcher)
```

SWR ရဲ့ တခြား option တွေအတွက် type တွေ ထည့်ချင်ရင်လည်း — အဲဒီ type တွေကို တိုက်ရိုက် import လုပ်လို့ရပါတယ်:

```typescript
import useSWR from 'swr'
import type { SWRConfiguration } from 'swr'

const config: SWRConfiguration = {
  fallbackData: "fallback",
  revalidateOnMount: false
  // ...
}

const { data } = useSWR<string[]>('/api/data', fetcher, config)
```

## Middleware Types

ကိုယ်ပိုင် custom middleware တွေအတွက် type ထည့်ဖို့ — import လုပ်လို့ရတဲ့ type definition အပိုတွေ ရှိပါတယ်။

```typescript
import useSWR, { Middleware, SWRHook } from 'swr'

const swrMiddleware: Middleware = (useSWRNext: SWRHook) => (key, fetcher, config) => {
  // ...
  return useSWRNext(key, fetcher, config)
}
```
