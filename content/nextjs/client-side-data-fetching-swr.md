---
title: "SWR နဲ့ client-side data fetching (client ဘက်မှ data ယူခြင်း)"
description: "SWR ကို သုံးပြီး Client Components တွေထဲမှာ data fetch လုပ်နည်း; Server Component ကနေ initial data (fallback) ထောက်ပံ့ခြင်း, inline/Suspense loading states, Cache Components နဲ့ server data cache လုပ်ခြင်း, mutations ပြီးနောက် server နဲ့ client caches ညှိနှိုင်းခြင်း"
order: 175
source: "https://nextjs.org/docs/app/guides/client-side-data-fetching/swr"
status: translated
updated: 2026-09-03
---

Client Components တွေထဲမှာ data fetch လုပ်ဖို့၊ Server Components တွေကနေ initial data (ကနဦး ဒေတာ) တွေ ထောက်ပံ့ဖို့နဲ့ browser mutations တွေကို cached server data တွေနဲ့ ညှိနှိုင်းဖို့ [SWR](https://swr.vercel.app) ကို သုံးနိုင်ပါတယ်။ Pattern တစ်ခု ရွေးချယ်ဖို့ [Client-side data fetching](/docs/nextjs/client-side-data-fetching) ကို ကြည့်ပါ။

## Client ပေါ်မှာ data fetch လုပ်ခြင်း (Fetch data on the client)

ကနဦး view က hydration ပြီးနောက် browser request တစ်ခုကို စောင့်နိုင်တယ်ဆိုရင် — SWR က browser ထဲမှာတင် အပြည့်အဝ fetch လုပ်နိုင်ပါတယ်။ Loading UI ကို ဘယ်မှာ ပေါ်စေချင်လဲဆိုတာပေါ် မူတည်ပြီး [inline (သို့) Suspense loading state](/docs/nextjs/client-side-data-fetching) တစ်ခုကို ရွေးပါ။ ဒီဥပမာတွေမှာ `query` က အလွတ်ကနေ စတင်ပြီး — hydration ပြီးနောက် client state ကနေ update လုပ်ပါတယ်။

Component က ကိုယ်ပိုင် loading နဲ့ error states တွေကို render လုပ်သင့်တယ်ဆိုရင် `useSWR` ကို သုံးပါ။ Conditional key (အခြေအနေအလိုက် သတ်မှတ်တဲ့ key) တစ်ခုက — interaction ကနေ input ရောက်လာတဲ့အထိ request ကို ရွှေ့ဆိုင်းပေးပါတယ်:

```tsx filename="app/product-autocomplete.tsx"
'use client'

import useSWR from 'swr'

type Product = { id: string; name: string }

async function fetcher(url: string): Promise<Product[]> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export function ProductAutocomplete({ query }: { query: string }) {
  const {
    data = [],
    error,
    isLoading,
  } = useSWR(
    query ? `/api/products?query=${encodeURIComponent(query)}` : null,
    fetcher
  )

  if (!query) return null
  if (error) return <p>Failed to load products.</p>
  if (isLoading) return <p>Loading products...</p>

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

## Client data အတွက် Suspense သုံးခြင်း

အနီးဆုံး Suspense boundary က loading UI ကို သတ်မှတ်ပေးသင့်တယ်ဆိုရင် `suspense: true` ကို သုံးပါ။ Results တွေ load လုပ်နေတုန်း interactive shell က ရရှိနေနိုင်အောင် — boundary ရဲ့ အပြင်ဘက်မှာ ထားပါ:

```tsx filename="app/product-autocomplete.tsx"
'use client'

import { Suspense } from 'react'
import useSWR from 'swr'

type Product = { id: string; name: string }

async function fetcher(url: string): Promise<Product[]> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export function ProductAutocomplete({ query }: { query: string }) {
  if (!query) return null

  return (
    <Suspense fallback={<p>Loading products...</p>}>
      <ProductResults query={query} />
    </Suspense>
  )
}

function ProductResults({ query }: { query: string }) {
  const { data } = useSWR(
    `/api/products?query=${encodeURIComponent(query)}`,
    fetcher,
    { suspense: true }
  )

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

Unconditional key တစ်ခုနဲ့ဆိုရင် — Suspense resolve ဖြစ်ပြီးနောက်မှာ SWR က `data` ကို သတ်မှတ်ပေးပါတယ်။ Request errors တွေကို အနီးဆုံး [error boundary](/docs/nextjs/error-handling) နဲ့ ကိုင်တွယ်ပါ။

Request တစ်ခု run နေပြီး ပြသဖို့ loaded data မရှိသေးတဲ့အခါ `isLoading` value က `true` ဖြစ်ပါတယ်။ Background revalidation အပါအဝင် — request တစ်ခု run နေတိုင်း `isValidating` value က `true` ဖြစ်ပါတယ်။

`suspense: true` နဲ့ဆိုရင် — Suspense က ကနဦး no-data state ကို ကိုင်တွယ်ပါတယ်။ နောက်ပိုင်း key တစ်ခုတည်းအတွက် revalidation လုပ်တဲ့အခါ — Suspense fallback ကို ပြန်မပြဘဲ လက်ရှိ data ကို ဆက်ပြီး render လုပ်ပါတယ်။ Background refresh feedback ပေးဖို့ `isValidating` ကို သုံးပါ။ [SWR loading states](https://swr.vercel.app/docs/advanced/understanding#combining-with-isloading-and-isvalidating-for-better-ux) အကြောင်း ပိုလေ့လာပါ။

ပိုလေ့လာရန်: [SWR data fetching](https://swr.vercel.app/docs/data-fetching)။

> **သိထားသင့်သည်:** Sibling components တွေမှာ render လုပ်တဲ့ သီးခြား Suspense reads တွေက parallel (တစ်ပြိုင်နက်) အနေနဲ့ စတင်နိုင်ပါတယ်။ Component တစ်ခုထဲက Suspense reads အများအပြားကတော့ — တစ်ခုပြီးတစ်ခု sequential အနေနဲ့ run ပါတယ်။ [Network waterfalls](/docs/nextjs/migrating-from-create-react-app) နဲ့ [SWR Suspense](https://swr.vercel.app/docs/suspense) အကြောင်း ပိုလေ့လာပါ။

## Server Component ကနေ initial data ထောက်ပံ့ခြင်း

ကနဦး render မှာ data လိုအပ်ပြီး — browser ထဲမှာ SWR က ဆက်ပြီး စီမံခန့်ခွဲသင့်တယ်ဆိုရင် [server-provided data pattern](/docs/nextjs/client-side-data-fetching) ကို သုံးပါ။ SWR 2.3.0 နဲ့ React 19 တို့နဲ့ဆိုရင် — Server Component တစ်ခုက client မစတင်ခင် fallback data ကို ထောက်ပံ့ပေးနိုင်ပါတယ်။

Data ကို ပိုင်ဆိုင်တဲ့ route segment ကိုပဲ `<SWRConfig>` နဲ့ scope လုပ်ပါ။ Provider က `fallback` ကို သူ့ရဲ့ consumer အနီးမှာ ထားပြီး — feature data တွေကို shared layout တစ်ခုထဲ ထည့်တာမျိုး ရှောင်ရှားပေးပါတယ်:

```tsx filename="app/products/[id]/page.tsx" switcher
import { Suspense } from 'react'
import { SWRConfig } from 'swr'
import { getProduct } from './data' // some server-side function
import { productCache } from './product-cache'
import { ProductView } from './product-view'

export default function Page({ params }: PageProps<'/products/[id]'>) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      {params.then(({ id }) => (
        <ProductData id={id} />
      ))}
    </Suspense>
  )
}

function ProductData({ id }: { id: string }) {
  return (
    <SWRConfig
      value={{
        fallback: {
          // Not awaited: only components that read this key suspend
          [productCache.key(id)]: getProduct(id),
        },
      }}
    >
      <ProductView id={id} />
    </SWRConfig>
  )
}
```

```jsx filename="app/products/[id]/page.js" switcher
import { Suspense } from 'react'
import { SWRConfig } from 'swr'
import { getProduct } from './data' // some server-side function
import { productCache } from './product-cache'
import { ProductView } from './product-view'

export default function Page({ params }) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      {params.then(({ id }) => (
        <ProductData id={id} />
      ))}
    </Suspense>
  )
}

function ProductData({ id }) {
  return (
    <SWRConfig
      value={{
        fallback: {
          // Not awaited: only components that read this key suspend
          [productCache.key(id)]: getProduct(id),
        },
      }}
    >
      <ProductView id={id} />
    </SWRConfig>
  )
}
```

Fallback နဲ့ Client Component က SWR key တစ်ခုတည်းကို သုံးရပါမယ်။ Key ကို တစ်နေရာတည်းမှာ သတ်မှတ်ထားလိုက်ပါ — call sites နှစ်ခုလုံး တူညီတဲ့ identity ကို မျှဝေနိုင်အောင်:

```ts filename="app/products/[id]/product-cache.ts" switcher
export const productCache = {
  key: (id: string) => `/api/products/${id}`,
}
```

```js filename="app/products/[id]/product-cache.js" switcher
export const productCache = {
  key: (id) => `/api/products/${id}`,
}
```

Page ဥပမာထဲမှာ — `params.then()` က ပြန်ပေးတဲ့ Promise က route parameters တွေ resolve မဖြစ်မချင်း fallback ကို မြင်နေရအောင် ထားပေးပါတယ်။ `ProductData` ကနေမှ SWR `fallback` အတွက် သီးခြား await မလုပ်ထားတဲ့ `getProduct(id)` Promise တစ်ခုကို ဖန်တီးပါတယ်။ React က အဲဒီ Promise ကို React Server Component payload ကနေတစ်ဆင့် ပို့ပေးပြီး — matching key ကို ဖတ်နေတဲ့ component က data resolve မဖြစ်မချင်း suspend လုပ်ပါတယ်။

Client Component က key တစ်ခုတည်းကို သုံးပြီး `useSWR` နဲ့ data ကို ဖတ်ပါတယ်:

```tsx filename="app/products/[id]/product-view.tsx" switcher
'use client'

import useSWR from 'swr'
import { productCache } from './product-cache'

type Product = { id: string; name: string }

async function fetcher(url: string): Promise<Product> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch product')
  return response.json()
}

export function ProductView({ id }: { id: string }) {
  const { data } = useSWR(productCache.key(id), fetcher, { suspense: true })

  return <h1>{data.name}</h1>
}
```

```jsx filename="app/products/[id]/product-view.js" switcher
'use client'

import useSWR from 'swr'
import { productCache } from './product-cache'

async function fetcher(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch product')
  return response.json()
}

export function ProductView({ id }) {
  const { data } = useSWR(productCache.key(id), fetcher, { suspense: true })

  return <h1>{data.name}</h1>
}
```

> **သိထားသင့်သည်:** `fallback` key နဲ့ `useSWR` key တွေက အတိအကျ တူညီနေရပါမယ်။ ကွဲသွားခဲ့ရင် — SWR က fallback value ကို လျစ်လျူရှုပြီး client ပေါ်မှာ fetch လုပ်ပါလိမ့်မယ်။

`fallback` က hook ရဲ့ ကနဦး value ကို ထောက်ပံ့ပေးပါတယ်။ Default အနေနဲ့ SWR က fallback data ကို stale အဖြစ် သဘောထားပြီး — hydration ပြီးနောက် browser revalidation တစ်ခုကို စတင်ပါတယ်။

SWR က fallback data အတွက် time-based freshness window (အချိန်အခြေပြု freshness ကြားကာလ) တစ်ခုကို မပေးပါဘူး။ `revalidateIfStale: false` လို့ သတ်မှတ်လိုက်ရင် — hook က cached data နဲ့ mount လုပ်တဲ့အခါ revalidation ကို ကျော်သွားပါတယ်။ ဒီ setting က mount တိုင်းမှာ သက်ရောက်ပြီး — TanStack Query ရဲ့ `staleTime` နဲ့တော့ မတူပါဘူး။

Focus, reconnect, polling နဲ့ `mutate` တွေက key ကို ဆက်ပြီး revalidate လုပ်နိုင်ပါသေးတယ်။ အချိန်ဇယားအတိုင်း refresh လုပ်ဖို့ — [`refreshInterval`](https://swr.vercel.app/docs/revalidation#revalidate-on-interval) ကို သတ်မှတ်ပါ။

SWR key က `GET` method ပါတဲ့ [Route Handler](/docs/nextjs/file-conventions-route) တစ်ခုကို ညွှန်ပြပါတယ်။ Route Handler က fallback ကို ထောက်ပံ့ပေးတဲ့ `getProduct` function တစ်ခုတည်းကိုပဲ ခေါ်နိုင်ပြီး — browser ကတော့ revalidation နဲ့ polling အတွက် URL ကို သုံးပါတယ်။

ပိုလေ့လာရန်: [SWR arguments and keys](https://swr.vercel.app/docs/arguments) နဲ့ [SWR with Next.js App Router](https://swr.vercel.app/docs/with-nextjs)။

## Server က ထောက်ပံ့တဲ့ data တွေကို Cache Components နဲ့ cache လုပ်ခြင်း

ဒီ pattern မသုံးခင် `next.config.ts` ထဲမှာ [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ကို enable လုပ်ပါ။ ပြီးရင် SWR fallback အဖြစ် သုံးတဲ့ server data တွေကို cache လုပ်နိုင်ပါတယ်။ [`use cache`](/docs/nextjs/use-cache) ထည့်ပြီး — [`cacheLife`](/docs/nextjs/cache-life) profile တစ်ခု ရွေးကာ — mutations တွေ invalidate လုပ်နိုင်အောင် [`cacheTag`](/docs/nextjs/cache-tag) ကို သက်ရောက်လိုက်ပါ:

```ts filename="app/products/[id]/data.ts" switcher
import { cacheLife, cacheTag } from 'next/cache'

export async function getProduct(id: string) {
  'use cache'
  cacheLife('max')
  cacheTag(`product:${id}`)

  const product = await db.product.findUnique({ where: { id } })
  if (!product) throw new Error('Product not found')
  return product
}
```

```js filename="app/products/[id]/data.js" switcher
import { cacheLife, cacheTag } from 'next/cache'

export async function getProduct(id) {
  'use cache'
  cacheLife('max')
  cacheTag(`product:${id}`)

  const product = await db.product.findUnique({ where: { id } })
  if (!product) throw new Error('Product not found')
  return product
}
```

ဒီဥပမာက `cacheLife('max')` ကို သုံးထားတာက — writes တွေက product tag ကို invalidate လုပ်လို့ပါ။ Cache profile အတွင်းမှာ — `stale` က Next.js client cache က prefetch လုပ်ထားတဲ့ payload တစ်ခုကို ဘယ်လောက်ကြာကြာ ပြန်သုံးနိုင်လဲ ထိန်းချုပ်ပြီး — `revalidate` နဲ့ `expire` တွေကတော့ server cache ကို ထိန်းချုပ်ပါတယ်။ Server value က အချိန်နဲ့အမျှ refresh သင့်တယ်ဆိုရင် — ပိုတိုတဲ့ profile တစ်ခုကို ရွေးပါ။

SWR က သီးခြား browser cache တစ်ခုကို ပိုင်ဆိုင်လို့ — သူ့ရဲ့ revalidation options တွေက `cacheLife` နဲ့ တိုက်ဆိုင်နေဖို့ မလိုပါဘူး။

Mutation တစ်ခုတည်းက browser cache ကိုရော cached server data တွေကိုပါ update လုပ်တဲ့အခါ — identity နှစ်ခုလုံးကို shared contract တစ်ခုထဲမှာ သတ်မှတ်နိုင်ပါတယ်:

```diff filename="app/products/[id]/product-cache.ts" switcher
 export const productCache = {
   key: (id: string) => `/api/products/${id}`,
+  tag: (id: string) => `product:${id}`,
 }
```

```diff filename="app/products/[id]/product-cache.js" switcher
 export const productCache = {
   key: (id) => `/api/products/${id}`,
+  tag: (id) => `product:${id}`,
 }
```

Server function ကနေမှ `cacheTag(productCache.tag(id))` လို့ ခေါ်နိုင်ပါတယ်။ ဒီ contract ကို server-only နဲ့ client-only imports တွေ ကင်းစင်အောင် ထားပါ — cache layers နှစ်ခုလုံး ပြန်သုံးနိုင်အောင်။

## Mutations ပြီးနောက် server နဲ့ client caches တွေ ညှိနှိုင်းခြင်း

Fallback က ကနဦး value ကို ထောက်ပံ့ပေးပါတယ်။ Hydration ပြီးနောက် — SWR က browser cache နဲ့ revalidation ကို စီမံခန့်ခွဲပါတယ်။ ပြန်သုံးနေတဲ့ data တွေအတွက် — SWR key နဲ့ server tag ကို cache contract တစ်ခုတည်းထဲမှာ ထားပါ:

```ts filename="app/activity/activity-cache.ts" switcher
export const activityCache = {
  key: '/api/activity/unread',
  tag: (userId: string) => `activity:${userId}`,
}
```

```js filename="app/activity/activity-cache.js" switcher
export const activityCache = {
  key: '/api/activity/unread',
  tag: (userId) => `activity:${userId}`,
}
```

Fallback, Client Component read နဲ့ mutation တွေအတွက် key တစ်ခုတည်းကို သုံးပါ။ SWR နဲ့ဆိုရင် — write ကို [`mutate`](https://swr.vercel.app/docs/mutation) ဆီ ပို့ပြီး `optimisticData` ကို ထောက်ပံ့ပေးပါ။ SWR က optimistic value ကို ချက်ချင်း ပြပြီး — write မအောင်မြင်ရင် ပြန် roll back လုပ်ပါတယ်။ ဒီဥပမာက — final value ကို ကြိုသိထားလို့ action အောင်မြင်ပြီးနောက်မှာလည်း optimistic value ကို ဆက်ထားပါတယ်:

```tsx filename="app/activity/mark-read-button.tsx" switcher
'use client'

import { useSWRConfig } from 'swr'
import { markActivityReadAction } from './actions'
import { activityCache } from './activity-cache'

export function MarkReadButton() {
  const { mutate } = useSWRConfig()

  function markRead() {
    return mutate(
      activityCache.key,
      async () => {
        await markActivityReadAction()
        return { count: 0 }
      },
      {
        optimisticData: { count: 0 },
        revalidate: false,
        rollbackOnError: true,
        throwOnError: false,
      }
    )
  }

  return <button onClick={markRead}>Mark read</button>
}
```

```jsx filename="app/activity/mark-read-button.js" switcher
'use client'

import { useSWRConfig } from 'swr'
import { markActivityReadAction } from './actions'
import { activityCache } from './activity-cache'

export function MarkReadButton() {
  const { mutate } = useSWRConfig()

  function markRead() {
    return mutate(
      activityCache.key,
      async () => {
        await markActivityReadAction()
        return { count: 0 }
      },
      {
        optimisticData: { count: 0 },
        revalidate: false,
        rollbackOnError: true,
        throwOnError: false,
      }
    )
  }

  return <button onClick={markRead}>Mark read</button>
}
```

Server Action က database ထဲကို write လုပ်ပြီး — tag လုပ်ထားတဲ့ server data ကို [`updateTag`](/docs/nextjs/update-tag) နဲ့ expire လုပ်ပါတယ်။ Tag တွေ ကိုက်ညီနေအောင် — cached server query ကို [`cacheTag`](/docs/nextjs/cache-tag) နဲ့ tag လုပ်ထားပါ:

```ts filename="app/activity/actions.ts" switcher
'use server'

import { updateTag } from 'next/cache'
import {
  getCurrentUserId,
  markActivityRead as markActivityReadInDatabase,
} from './data'
import { activityCache } from './activity-cache'

export async function markActivityReadAction() {
  const userId = await getCurrentUserId()
  await markActivityReadInDatabase(userId)
  updateTag(activityCache.tag(userId))
}
```

```js filename="app/activity/actions.js" switcher
'use server'

import { updateTag } from 'next/cache'
import {
  getCurrentUserId,
  markActivityRead as markActivityReadInDatabase,
} from './data'
import { activityCache } from './activity-cache'

export async function markActivityReadAction() {
  const userId = await getCurrentUserId()
  await markActivityReadInDatabase(userId)
  updateTag(activityCache.tag(userId))
}
```

Optimistic SWR value က လက်ရှိ screen ကို update လုပ်ပါတယ်။ `updateTag` က နောက်တစ်ကြိမ် cached server read မှာ fresh activity ပြန်ရဖို့ သေချာစေပါတယ်။

> **သိထားသင့်သည်:** Server Action တစ်ခုက write ကို ချက်ချင်း ထင်ဟပ်စေရမယ့် cached read တစ်ခုကို ပြောင်းလဲတဲ့အခါ `updateTag` ကို ခေါ်ပါ။ Cache မလုပ်ထားတဲ့ read တစ်ခုမှာတော့ update လုပ်ဖို့ server tag မရှိပါဘူး။ အခြား invalidation အပြုအမူတွေအတွက် [Client-side data fetching](/docs/nextjs/client-side-data-fetching) ကို ကြည့်ပါ။

Live [`next-spa-patterns` demo](https://next-spa-patterns.labs.vercel.dev/swr) နဲ့ သူ့ရဲ့ [source code](https://github.com/vercel-labs/next-spa-patterns/tree/main/app/swr) တွေကို ကြည့်ပါ။ [SWR mutation နဲ့ optimistic updates](https://swr.vercel.app/docs/mutation) အကြောင်းနဲ့ [SWR documentation](https://swr.vercel.app/docs/getting-started) တွေမှာ ပိုလေ့လာနိုင်ပါတယ်။
