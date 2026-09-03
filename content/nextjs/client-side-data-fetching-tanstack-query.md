---
title: "TanStack Query နဲ့ client-side data fetching (client ဘက်မှ data ယူခြင်း)"
description: "TanStack Query ကို သုံးပြီး Client Components တွေထဲမှာ data fetch လုပ်နည်း; QueryClientProvider setup, Server Component ကနေ initial data (hydration) ထောက်ပံ့ခြင်း, Suspense, Cache Components, mutations ပြီးနောက် server နဲ့ client caches ညှိနှိုင်းခြင်း"
order: 176
source: "https://nextjs.org/docs/app/guides/client-side-data-fetching/tanstack-query"
status: translated
updated: 2026-09-03
---

Client Components တွေထဲမှာ data fetch လုပ်ဖို့၊ Server Components တွေကနေ initial data (ကနဦး ဒေတာ) တွေ ထောက်ပံ့ဖို့နဲ့ browser mutations တွေကို cached server data တွေနဲ့ ညှိနှိုင်းဖို့ [TanStack Query](https://tanstack.com/query) ကို သုံးနိုင်ပါတယ်။ Pattern တစ်ခု ရွေးချယ်ဖို့ [Client-side data fetching](/docs/nextjs/client-side-data-fetching) ကို ကြည့်ပါ။

## Provider တစ်ခု ပြင်ဆင်သတ်မှတ်ခြင်း (Set up the provider)

TanStack Query သုံးတဲ့ routes တွေကို `QueryClientProvider` တစ်ခုထဲမှာ wrap လုပ်ပါ။ Server render တစ်ခုစီအတွက် query client အသစ်တစ်ခု ဖန်တီးပြီး — browser ထဲမှာတော့ query client တစ်ခုတည်းကို ပြန်သုံးပါ:

```tsx filename="app/products/providers.tsx"
'use client'

import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  // Keep server requests isolated and preserve the browser cache across renders.
  if (typeof window === 'undefined') return new QueryClient()
  browserQueryClient ??= new QueryClient()
  return browserQueryClient
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  )
}
```

Provider ကို အနီးဆုံး shared layout ကနေ render လုပ်ပါ:

```tsx filename="app/products/layout.tsx"
import { Providers } from './providers'

export default function Layout({ children }: LayoutProps<'/products'>) {
  return <Providers>{children}</Providers>
}
```

Provider setup အပြည့်အစုံကို [demo source](https://github.com/vercel-labs/next-spa-patterns/tree/main/app/react-query) မှာ ကြည့်နိုင်ပြီး — provider options တွေအကြောင်းကို [TanStack Query Advanced SSR guide](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr) မှာ လေ့လာနိုင်ပါတယ်။

## Client ပေါ်မှာ data fetch လုပ်ခြင်း (Fetch data on the client)

ကနဦး view က hydration ပြီးနောက် browser request တစ်ခုကို စောင့်နိုင်တယ်ဆိုရင် — TanStack Query က browser ထဲမှာတင် အပြည့်အဝ fetch လုပ်နိုင်ပါတယ်။ Loading UI ကို ဘယ်မှာ ပေါ်စေချင်လဲဆိုတာပေါ် မူတည်ပြီး [inline (သို့) Suspense loading state](/docs/nextjs/client-side-data-fetching) တစ်ခုကို ရွေးပါ။ ဒီဥပမာတွေမှာ `query` က အလွတ်ကနေ စတင်ပြီး — hydration ပြီးနောက် client state ကနေ update လုပ်ပါတယ်။

Component က ကိုယ်ပိုင် loading နဲ့ error states တွေကို render လုပ်သင့်တယ်ဆိုရင် `useQuery` ကို သုံးပါ။ `enabled` option က — interaction ကနေ input ရောက်လာတဲ့အထိ request ကို ရွှေ့ဆိုင်းပေးပါတယ်:

```tsx filename="app/product-autocomplete.tsx"
'use client'

import { useQuery } from '@tanstack/react-query'

type Product = { id: string; name: string }

async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(
    `/api/products?query=${encodeURIComponent(query)}`
  )
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export function ProductAutocomplete({ query }: { query: string }) {
  const {
    data = [],
    error,
    isPending,
  } = useQuery({
    queryKey: ['product-search', query],
    queryFn: () => searchProducts(query),
    enabled: query.length > 0,
  })

  if (!query) return null
  if (error) return <p>Failed to load products.</p>
  if (isPending) return <p>Loading products...</p>

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

ပိုလေ့လာရန်: [TanStack Query queries](https://tanstack.com/query/latest/docs/framework/react/guides/queries)။

## Client data အတွက် Suspense သုံးခြင်း

အနီးဆုံး Suspense boundary က loading UI ကို သတ်မှတ်ပေးသင့်တယ်ဆိုရင် `useSuspenseQuery` ကို သုံးပါ။ Results တွေ load လုပ်နေတုန်း interactive shell က ရရှိနေနိုင်အောင် — boundary ရဲ့ အပြင်ဘက်မှာ ထားပါ:

```tsx filename="app/product-autocomplete.tsx"
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

type Product = { id: string; name: string }

async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(
    `/api/products?query=${encodeURIComponent(query)}`
  )
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
  const { data } = useSuspenseQuery({
    queryKey: ['product-search', query],
    queryFn: () => searchProducts(query),
  })

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

ကနဦး request မအောင်မြင်ခဲ့ရင် — `useSuspenseQuery` က error ကို အနီးဆုံး [error boundary](/docs/nextjs/error-handling) ဆီ ပြန့်ပွားစေပါတယ်။

Query တစ်ခုမှာ data ရှိပြီးသားဆိုရင် — နောက်ပိုင်း query တစ်ခုတည်းအတွက် refetch တွေက Suspense fallback ကို ပြန်မပြဘဲ cached data ကို ဆက်ပြီး render လုပ်ပါတယ်။ Background refresh feedback ပေးဖို့ `isFetching` ကို သုံးပါ။

ကနဦး view မှာ data လိုအပ်တယ်ဆိုရင် — အောက်မှာ ပြထားတဲ့အတိုင်း Server Component တစ်ခုကနေ ထောက်ပံ့ပါ။

> **သိထားသင့်သည်:** Component တစ်ခုထဲက `useSuspenseQuery` calls အများအပြားက sequential အနေနဲ့ run ပါတယ်။ သီးခြား queries တွေကို sibling components တွေထဲမှာ ထားပါ (သို့) [`useSuspenseQueries`](https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQueries) ကို သုံးပါ။ [Request waterfalls](https://tanstack.com/query/latest/docs/framework/react/guides/request-waterfalls) အကြောင်း ပိုလေ့လာပါ။

## Server Component ကနေ initial data ထောက်ပံ့ခြင်း

ကနဦး render မှာ data လိုအပ်ပြီး — browser ထဲမှာ TanStack Query က ဆက်ပြီး စီမံခန့်ခွဲသင့်တယ်ဆိုရင် [server-provided data pattern](/docs/nextjs/client-side-data-fetching) ကို သုံးပါ။ Server Component တစ်ခုက client မစတင်ခင် initial query data ကို ထောက်ပံ့ပေးနိုင်ပါတယ်။

TanStack Query 5.40.0 (သို့) ဒီထက်နောက်ကျတဲ့ version တွေက pending queries တွေကို dehydrate လုပ်နိုင်ပါတယ်။ `prefetchQuery` ကို await မလုပ်ဘဲ စတင်လိုက်ပြီး — dehydrated state ကို `<HydrationBoundary>` ဆီ ပို့ပါ။ Server ပေါ်မှာ `queryFn` ကို override လုပ်ပါ — Route Handler ရဲ့ relative URL က browser ထဲမှာပဲ resolve လို့ပါ:

```tsx filename="app/products/[id]/page.tsx" switcher
import { Suspense } from 'react'
import {
  defaultShouldDehydrateQuery,
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getProduct } from './data'
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
  const queryClient = new QueryClient()

  // Not awaited, so rendering is not blocked.
  void queryClient.prefetchQuery({
    ...productCache.options(id),
    queryFn: () => getProduct(id),
  })

  return (
    <HydrationBoundary
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      })}
    >
      <ProductView id={id} />
    </HydrationBoundary>
  )
}
```

```jsx filename="app/products/[id]/page.js" switcher
import { Suspense } from 'react'
import {
  defaultShouldDehydrateQuery,
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getProduct } from './data'
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
  const queryClient = new QueryClient()

  // Not awaited, so rendering is not blocked.
  void queryClient.prefetchQuery({
    ...productCache.options(id),
    queryFn: () => getProduct(id),
  })

  return (
    <HydrationBoundary
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      })}
    >
      <ProductView id={id} />
    </HydrationBoundary>
  )
}
```

Server နဲ့ Client Component တွေက query key တစ်ခုတည်းကို သုံးရပါမယ်။ Key နဲ့ query options တွေကို တစ်နေရာတည်းမှာ ထားပါ — call sites နှစ်ခုလုံး တူညီတဲ့ identity ကို မျှဝေနိုင်အောင်:

```ts filename="app/products/[id]/product-cache.ts" switcher
import { queryOptions } from '@tanstack/react-query'

export type Product = { id: string; name: string }

export const productCache = {
  key: (id: string) => ['product', id] as const,
  options: (id: string) =>
    queryOptions({
      queryKey: productCache.key(id),
      queryFn: async (): Promise<Product> => {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error('Failed to fetch product')
        return res.json()
      },
      staleTime: 30_000,
    }),
}
```

```js filename="app/products/[id]/product-cache.js" switcher
import { queryOptions } from '@tanstack/react-query'

export const productCache = {
  key: (id) => ['product', id],
  options: (id) =>
    queryOptions({
      queryKey: productCache.key(id),
      queryFn: async () => {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error('Failed to fetch product')
        return res.json()
      },
      staleTime: 30_000,
    }),
}
```

Query function က [Route Handler](/docs/nextjs/file-conventions-route) တစ်ခုကို fetch လုပ်လို့ — client ပေါ်မှာ run နိုင်ပါတယ်။ `staleTime` က hydrated data ကို စက္ကန့် 30 ကြာ fresh အနေနဲ့ ထားပြီး — ချက်ချင်း client refetch တစ်ခု မဖြစ်အောင် တားဆီးပေးပါတယ်။ Data ဘယ်လောက်မြန်မြန် ပြောင်းနိုင်လဲဆိုတာပေါ် မူတည်ပြီး ကြာချိန်ကို ရွေးပါ။

ပိုကြီးတဲ့ features တွေက query options တွေကို သီးခြား client-facing module တစ်ခုထဲမှာ ထားနိုင်ပါတယ် — caller တိုင်း cache contract တစ်ခုတည်းကနေ key ကို import လုပ်သရွေ့ပါ။ [TanStack Query defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults) အကြောင်း ပိုလေ့လာပါ။

SWR နည်းတူပဲ — `params.then()` က `<Suspense>` အတွင်းမှာ `id` ကို resolve လုပ်ပြီး — `ProductData` က boundary အောက်မှာ prefetch လုပ်ပါတယ်။

Client Component က query key တစ်ခုတည်းကို `useSuspenseQuery` (သို့) inline အနေနဲ့ `isPending` နဲ့ `error` states တွေ render လုပ်ချင်ရင် `useQuery` နဲ့ ဖတ်ပါတယ်:

```tsx filename="app/products/[id]/product-view.tsx" switcher
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { productCache } from './product-cache'

export function ProductView({ id }: { id: string }) {
  const { data } = useSuspenseQuery(productCache.options(id))

  return <h1>{data.name}</h1>
}
```

```jsx filename="app/products/[id]/product-view.js" switcher
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { productCache } from './product-cache'

export function ProductView({ id }) {
  const { data } = useSuspenseQuery(productCache.options(id))

  return <h1>{data.name}</h1>
}
```

ပိုလေ့လာရန်: [TanStack Query Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)။

## Server က ထောက်ပံ့တဲ့ data တွေကို Cache Components နဲ့ cache လုပ်ခြင်း

ဒီ pattern မသုံးခင် `next.config.ts` ထဲမှာ [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ကို enable လုပ်ပါ။ ပြီးရင် TanStack Query ဆီ ထောက်ပံ့တဲ့ server data တွေကို cache လုပ်နိုင်ပါတယ်။ [`use cache`](/docs/nextjs/use-cache) ထည့်ပြီး — [`cacheLife`](/docs/nextjs/cache-life) profile တစ်ခု ရွေးကာ — mutations တွေ invalidate လုပ်နိုင်အောင် [`cacheTag`](/docs/nextjs/cache-tag) ကို သက်ရောက်လိုက်ပါ:

```ts filename="app/products/[id]/data.ts" switcher
import { cacheLife, cacheTag } from 'next/cache'
import type { Product } from './product-cache'

export async function getProduct(id: string): Promise<Product> {
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

TanStack Query က သီးခြား browser cache တစ်ခုကို ပိုင်ဆိုင်လို့ — သူ့ရဲ့ `staleTime` က `cacheLife` နဲ့ တိုက်ဆိုင်နေဖို့ မလိုပါဘူး။

Cache Components enable ဖြစ်နေတဲ့အခါ — Next.js က Client Components တွေကိုပါ prerender လုပ်ပါတယ်။ ကနဦး render အတွင်း လိုအပ်တဲ့ query တစ်ခုကို [Suspense](https://nextjs.org/docs/app/getting-started/fetching-data#streaming) ရဲ့ နောက်မှာ ထားပါ။ TanStack Query က active query state ဖန်တီးနေစဉ် current time ကို ဖတ်နိုင်ပြီး — boundary က အဲဒီအလုပ်ကို Next.js ဆီ [current-time prerender error](https://nextjs.org/docs/messages/blocking-prerender-current-time-client) တစ်ခု မတင်ဘဲ ရွှေ့ဆိုင်းထားနိုင်စေပါတယ်။

Mutation တစ်ခုတည်းက browser cache ကိုရော cached server data တွေကိုပါ update လုပ်တဲ့အခါ — identity နှစ်ခုလုံးကို shared contract တစ်ခုထဲမှာ သတ်မှတ်နိုင်ပါတယ်:

```diff filename="app/products/[id]/product-cache.ts" switcher
 export const productCache = {
   key: (id: string) => ['product', id] as const,
+  tag: (id: string) => `product:${id}`,
   // ...
 }
```

```diff filename="app/products/[id]/product-cache.js" switcher
 export const productCache = {
   key: (id) => ['product', id],
+  tag: (id) => `product:${id}`,
   // ...
 }
```

Server function ကနေမှ `cacheTag(productCache.tag(id))` လို့ ခေါ်နိုင်ပါတယ်။ ဒီ contract ကို server-only နဲ့ client-only imports တွေ ကင်းစင်အောင် ထားပါ — cache layers နှစ်ခုလုံး ပြန်သုံးနိုင်အောင်။

> **သိထားသင့်သည်:** TanStack Query ရဲ့ `dehydrate()` က Cache Components prerendering လုပ်နေစဉ် current time ကို ဖတ်ပါတယ်။ Cached initial data တွေအတွက် [prerenderable hydration helper](#build-a-prerenderable-hydration-state) ကို သုံးပါ။

## Mutations ပြီးနောက် server နဲ့ client caches တွေ ညှိနှိုင်းခြင်း

Hydration က client cache ရဲ့ ကနဦး value ကို ထောက်ပံ့ပေးပါတယ်။ Hydration ပြီးနောက် — TanStack Query က browser copy နဲ့ သူ့ရဲ့ revalidation ကို ပိုင်ဆိုင်ပါတယ်။ ပြန်သုံးနေတဲ့ data တွေအတွက် — query key နဲ့ server tag ကို cache contract တစ်ခုတည်းထဲမှာ ထားပါ:

```ts filename="app/activity/activity-cache.ts" switcher
export const activityCache = {
  key: ['activity', 'unread'] as const,
  tag: (userId: string) => `activity:${userId}`,
}
```

```js filename="app/activity/activity-cache.js" switcher
export const activityCache = {
  key: ['activity', 'unread'],
  tag: (userId) => `activity:${userId}`,
}
```

Mutation လုပ်တဲ့အခါ — `useMutation` ရဲ့ [`onMutate`](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates) callback ကို သုံးပြီး cache ကို ချက်ချင်း update လုပ်ကာ — write မအောင်မြင်ရင် `onError` ထဲမှာ အရင် value ကို ပြန်ထားပါ။ ဒီဥပမာက — final value ကို ကြိုသိထားလို့ action အောင်မြင်ပြီးနောက်မှာလည်း optimistic value ကို ဆက်ထားပါတယ်:

```tsx filename="app/activity/mark-read-button.tsx" switcher
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markActivityReadAction } from './actions'
import { activityCache } from './activity-cache'

export function MarkReadButton() {
  const queryClient = useQueryClient()
  const queryKey = activityCache.key

  const markRead = useMutation({
    mutationFn: markActivityReadAction,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, { count: 0 })
      return { previous }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
  })

  return <button onClick={() => markRead.mutate()}>Mark read</button>
}
```

```jsx filename="app/activity/mark-read-button.js" switcher
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markActivityReadAction } from './actions'
import { activityCache } from './activity-cache'

export function MarkReadButton() {
  const queryClient = useQueryClient()
  const queryKey = activityCache.key

  const markRead = useMutation({
    mutationFn: markActivityReadAction,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, { count: 0 })
      return { previous }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
  })

  return <button onClick={() => markRead.mutate()}>Mark read</button>
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

Optimistic query value က လက်ရှိ screen ကို update လုပ်ပါတယ်။ `updateTag` က နောက်တစ်ကြိမ် cached server read မှာ fresh activity ပြန်ရဖို့ သေချာစေပါတယ်။

> **သိထားသင့်သည်:** Server Action တစ်ခုက write ကို ချက်ချင်း ထင်ဟပ်စေရမယ့် cached read တစ်ခုကို ပြောင်းလဲတဲ့အခါ `updateTag` ကို ခေါ်ပါ။ Cache မလုပ်ထားတဲ့ read တစ်ခုမှာတော့ update လုပ်ဖို့ server tag မရှိပါဘူး။ အခြား invalidation အပြုအမူတွေအတွက် [Client-side data fetching](/docs/nextjs/client-side-data-fetching) ကို ကြည့်ပါ။

## Prerender လုပ်လို့ရတဲ့ hydration state တစ်ခု တည်ဆောက်ခြင်း (Build a prerenderable hydration state)

အထက်ပါ TanStack Query pattern က hydration state ဖန်တီးဖို့ `dehydrate()` ကို သုံးပါတယ်။ Cache Components တွေနဲ့ဆိုရင် — `dehydrate()` က prerendering လုပ်နေစဉ် current time (`Date.now()`) ကို ဖတ်တာမို့ [current-time prerender error](https://nextjs.org/docs/messages/blocking-prerender-current-time) တစ်ခု ဖြစ်စေပါတယ်။

ဒါအစား — timestamp ကိုပဲ cache လုပ်ပြီး dehydrated state ကို လက်နဲ့ တည်ဆောက်ပါ။ Time read ကို data reads တွေရဲ့ tags တစ်ခုတည်းနဲ့ [`use cache`](/docs/nextjs/use-cache) ထဲမှာ wrap လုပ်ပါ။ Mutation တစ်ခုက အဲဒီ tags တွေကို invalidate လုပ်တဲ့အခါ — data နဲ့ သူ့ရဲ့ timestamp က အတူတူ ရှေ့ဆက်သွားလို့ — နောက် navigation တစ်ခုမှာ `<HydrationBoundary>` က client query ကို overwrite လုပ်ပါတယ်:

```tsx filename="app/lib/hydrate.ts" switcher
import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  type DehydratedState,
  type QueryKey,
} from '@tanstack/react-query'

type HydratedQuery = {
  queryKey: QueryKey
  data: unknown
}

type HydrationOptions = {
  tags: string[]
}

async function getHydrationUpdatedAt(tags: string[]) {
  'use cache'
  cacheTag(...tags)
  cacheLife('max')
  return Date.now()
}

export async function dehydrate(
  queries: HydratedQuery[],
  options: HydrationOptions
): Promise<DehydratedState> {
  const updatedAt = await getHydrationUpdatedAt(options.tags)

  const queryClient = new QueryClient()

  for (const query of queries) {
    queryClient.setQueryData(query.queryKey, query.data, { updatedAt })
  }

  return {
    mutations: [],
    queries: queryClient
      .getQueryCache()
      .getAll()
      .filter((query) => defaultShouldDehydrateQuery(query))
      .map((query) => ({
        dehydratedAt: updatedAt,
        queryHash: query.queryHash,
        queryKey: query.queryKey,
        state: query.state,
        ...(query.meta ? { meta: query.meta } : {}),
      })),
  }
}
```

```js filename="app/lib/hydrate.js" switcher
import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

async function getHydrationUpdatedAt(tags) {
  'use cache'
  cacheTag(...tags)
  cacheLife('max')
  return Date.now()
}

export async function dehydrate(queries, options) {
  const updatedAt = await getHydrationUpdatedAt(options.tags)

  const queryClient = new QueryClient()

  for (const query of queries) {
    queryClient.setQueryData(query.queryKey, query.data, { updatedAt })
  }

  return {
    mutations: [],
    queries: queryClient
      .getQueryCache()
      .getAll()
      .filter((query) => defaultShouldDehydrateQuery(query))
      .map((query) => ({
        dehydratedAt: updatedAt,
        queryHash: query.queryHash,
        queryKey: query.queryKey,
        state: query.state,
        ...(query.meta ? { meta: query.meta } : {}),
      })),
  }
}
```

Data ကို ပိုင်ဆိုင်တဲ့ segment ထဲမှာ helper ကို await လုပ်ပြီး — data နဲ့အတူ `getProduct` read အောက်မှာ သုံးထားတဲ့ tags တစ်ခုတည်းကို ပို့ပါ။ ရလဒ်ကို `ProductData` ထဲက `<HydrationBoundary>` ဆီ လွှဲပြောင်းပေးလိုက်ပါ:

```tsx filename="app/products/[id]/page.tsx" switcher
import { HydrationBoundary } from '@tanstack/react-query'
import { dehydrate } from '@/app/lib/hydrate'
import { getProduct } from './data'
import { productCache } from './product-cache'
import { ProductView } from './product-view'

async function ProductData({ id }: { id: string }) {
  const product = await getProduct(id)
  const state = await dehydrate(
    [{ queryKey: productCache.key(id), data: product }],
    { tags: [productCache.tag(id)] }
  )

  return (
    <HydrationBoundary state={state}>
      <ProductView id={id} />
    </HydrationBoundary>
  )
}
```

```jsx filename="app/products/[id]/page.js" switcher
import { HydrationBoundary } from '@tanstack/react-query'
import { dehydrate } from '@/app/lib/hydrate'
import { getProduct } from './data'
import { productCache } from './product-cache'
import { ProductView } from './product-view'

async function ProductData({ id }) {
  const product = await getProduct(id)
  const state = await dehydrate(
    [{ queryKey: productCache.key(id), data: product }],
    { tags: [productCache.tag(id)] }
  )

  return (
    <HydrationBoundary state={state}>
      <ProductView id={id} />
    </HydrationBoundary>
  )
}
```

> **သိထားသင့်သည်:** Hydrated data ပြောင်းလဲတိုင်း timestamp က ရှေ့ဆက်တိုးရပါမယ်။ Helper က tag-driven server data တွေအတွက် သင့်တော်ပါတယ် — နှစ်ခုလုံးက tags တစ်ခုတည်းကို သုံးလို့ပါ။ Time-driven server data တွေအတွက်တော့ — မသက်ဆိုင်တဲ့ time windows တွေကို သီးခြား ထိန်းသိမ်းမယ့်အစား — data နဲ့ hydration timestamp ကို cached snapshot တစ်ခုတည်းကနေ ဆင်းသက်စေပါ။

Live [`next-spa-patterns` demo](https://next-spa-patterns.labs.vercel.dev/react-query) နဲ့ သူ့ရဲ့ [source code](https://github.com/vercel-labs/next-spa-patterns/tree/main/app/react-query) တွေကို ကြည့်ပါ။ [TanStack Query optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates) အကြောင်းနဲ့ [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview) တွေမှာ ပိုလေ့လာနိုင်ပါတယ်။
