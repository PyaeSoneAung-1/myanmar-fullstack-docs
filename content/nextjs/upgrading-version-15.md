---
title: "Version 15 သို့ ပြောင်းရွှေ့ခြင်း (How to upgrade to version 15)"
description: "သင့် Next.js application ကို Version 14 ကနေ 15 ဆီ upgrade လုပ်နည်း — upgrade codemod, React 19, Async Request APIs (cookies, headers, draftMode, params, searchParams), runtime configuration, fetch caching, Route Handlers caching, Client Cache, next/font, bundlePagesRouterDependencies, serverExternalPackages, Speed Insights နဲ့ NextRequest geolocation ပြောင်းလဲမှုများ အကြောင်း"
order: 238
source: "https://nextjs.org/docs/app/guides/upgrading/version-15"
status: translated
updated: 2026-09-03
---

## 14 ကနေ 15 သို့ upgrade လုပ်ခြင်း (Upgrading from 14 to 15)

Next.js version 15 ဆီ update လုပ်ဖို့ — `upgrade` codemod ကို သုံးနိုင်ပါတယ်:

```bash package="pnpm"
pnpm dlx @next/codemod@canary upgrade latest
```

```bash package="npm"
npx @next/codemod@canary upgrade latest
```

```bash package="yarn"
yarn dlx @next/codemod@canary upgrade latest
```

```bash package="bun"
bunx @next/codemod@canary upgrade latest
```

ကိုယ်တိုင် လုပ်ချင်တယ်ဆိုရင် — နောက်ဆုံး Next နဲ့ React versions တွေကို တပ်ဆင်နေကြောင်း သေချာပါစေ:

```bash package="pnpm"
pnpm add next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash package="npm"
npm install next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash package="yarn"
yarn add next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash package="bun"
bun add next@latest react@latest react-dom@latest eslint-config-next@latest
```

> **သိထားသင့်သည်:**
>
> - Peer dependencies warning တစ်ခု တွေ့ရရင် — `react` နဲ့ `react-dom` တွေကို အကြံပြုထားတဲ့ versions တွေဆီ update လုပ်ဖို့ (သို့) warning ကို ကျော်လိုက်ဖို့ `--force` (သို့) `--legacy-peer-deps` flag ကို သုံးဖို့ လိုအပ်နိုင်ပါတယ်။ Next.js 15 ရော React 19 ပါ stable ဖြစ်သွားတာနဲ့ ဒါ မလိုအပ်တော့ပါဘူး။

## React 19

- `react` နဲ့ `react-dom` တွေရဲ့ minimum versions တွေက အခု 19 ဖြစ်ပါတယ်။
- `useFormState` ကို `useActionState` နဲ့ အစားထိုးလိုက်ပါပြီ။ `useFormState` hook က React 19 မှာ ရနေဆဲ ဖြစ်ပေမယ့် — deprecated ဖြစ်ပြီး နောင် release တစ်ခုမှာ ဖယ်ရှားပါလိမ့်မယ်။ `useActionState` ကို အကြံပြုထားပြီး — `pending` state ကို တိုက်ရိုက် ဖတ်ခြင်းလို additional properties တွေလည်း ပါဝင်ပါတယ်။ [ပိုလေ့လာပါ](https://react.dev/reference/react/useActionState)။
- `useFormStatus` မှာ အခု `data`, `method`, `action` လို additional keys တွေ ပါဝင်ပါတယ်။ React 19 မသုံးဘူးဆိုရင် `pending` key တစ်ခုတည်းပဲ ရနိုင်ပါတယ်။ [ပိုလေ့လာပါ](https://react.dev/reference/react-dom/hooks/useFormStatus)။
- [React 19 upgrade guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) မှာ ပိုလေ့လာပါ။

> **သိထားသင့်သည်:** TypeScript သုံးနေရင် — `@types/react` နဲ့ `@types/react-dom` တွေကိုပါ နောက်ဆုံး versions တွေဆီ upgrade လုပ်ထားကြောင်း သေချာပါစေ။

## Async Request APIs (Breaking change)

အရင်က synchronous ဖြစ်ခဲ့ပြီး request information တွေပေါ်မှာ မှီခိုတဲ့ Request-time APIs တွေက အခု **asynchronous** တွေ ဖြစ်သွားပါပြီ:

- [`cookies`](/docs/nextjs/cookies)
- [`headers`](/docs/nextjs/headers)
- [`draftMode`](/docs/nextjs/draft-mode)
- [`layout.js`](/docs/nextjs/file-conventions-layout), [`page.js`](/docs/nextjs/file-conventions-page), [`route.js`](/docs/nextjs/file-conventions-route), [`default.js`](/docs/nextjs/file-conventions-default), [`opengraph-image`](/docs/nextjs/opengraph-image), [`twitter-image`](/docs/nextjs/opengraph-image), [`icon`](/docs/nextjs/app-icons) နဲ့ [`apple-icon`](/docs/nextjs/app-icons) တွေထဲက `params`
- [`page.js`](/docs/nextjs/file-conventions-page) ထဲက `searchParams`

Migration ရဲ့ ဝန်ထုပ်ဝန်ပိုး သက်သာစေဖို့ — ဒီလုပ်ငန်းစဉ်ကို အလိုအလျောက် လုပ်ပေးတဲ့ [codemod](/docs/nextjs/upgrading-codemods#150) တစ်ခု ရနိုင်ပြီး — APIs တွေကို ယာယီအားဖြင့် synchronously ဝင်ရောက်လို့လည်း ရပါသေးတယ်။

### `cookies`

#### အကြံပြုထားသော Async အသုံးပြုမှု (Recommended Async Usage)

```tsx
import { cookies } from 'next/headers'

// Before
const cookieStore = cookies()
const token = cookieStore.get('token')

// After
const cookieStore = await cookies()
const token = cookieStore.get('token')
```

#### ယာယီ Synchronous အသုံးပြုမှု (Temporary Synchronous Usage)

```tsx filename="app/page.tsx" switcher
import { cookies, type UnsafeUnwrappedCookies } from 'next/headers'

// Before
const cookieStore = cookies()
const token = cookieStore.get('token')

// After
const cookieStore = cookies() as unknown as UnsafeUnwrappedCookies
// will log a warning in dev
const token = cookieStore.get('token')
```

```jsx filename="app/page.js" switcher
import { cookies } from 'next/headers'

// Before
const cookieStore = cookies()
const token = cookieStore.get('token')

// After
const cookieStore = cookies()
// will log a warning in dev
const token = cookieStore.get('token')
```

### `headers`

#### အကြံပြုထားသော Async အသုံးပြုမှု (Recommended Async Usage)

```tsx
import { headers } from 'next/headers'

// Before
const headersList = headers()
const userAgent = headersList.get('user-agent')

// After
const headersList = await headers()
const userAgent = headersList.get('user-agent')
```

#### ယာယီ Synchronous အသုံးပြုမှု (Temporary Synchronous Usage)

```tsx filename="app/page.tsx" switcher
import { headers, type UnsafeUnwrappedHeaders } from 'next/headers'

// Before
const headersList = headers()
const userAgent = headersList.get('user-agent')

// After
const headersList = headers() as unknown as UnsafeUnwrappedHeaders
// will log a warning in dev
const userAgent = headersList.get('user-agent')
```

```jsx filename="app/page.js" switcher
import { headers } from 'next/headers'

// Before
const headersList = headers()
const userAgent = headersList.get('user-agent')

// After
const headersList = headers()
// will log a warning in dev
const userAgent = headersList.get('user-agent')
```

### `draftMode`

#### အကြံပြုထားသော Async အသုံးပြုမှု (Recommended Async Usage)

```tsx
import { draftMode } from 'next/headers'

// Before
const { isEnabled } = draftMode()

// After
const { isEnabled } = await draftMode()
```

#### ယာယီ Synchronous အသုံးပြုမှု (Temporary Synchronous Usage)

```tsx filename="app/page.tsx" switcher
import { draftMode, type UnsafeUnwrappedDraftMode } from 'next/headers'

// Before
const { isEnabled } = draftMode()

// After
// will log a warning in dev
const { isEnabled } = draftMode() as unknown as UnsafeUnwrappedDraftMode
```

```jsx filename="app/page.js" switcher
import { draftMode } from 'next/headers'

// Before
const { isEnabled } = draftMode()

// After
// will log a warning in dev
const { isEnabled } = draftMode()
```

### `params` & `searchParams`

#### Asynchronous Layout (async layout များ)

```tsx filename="app/layout.tsx" switcher
// Before
type Params = { slug: string }

export function generateMetadata({ params }: { params: Params }) {
  const { slug } = params
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const { slug } = params
}

// After
type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const { slug } = await params
}
```

```jsx filename="app/layout.js" switcher
// Before
export function generateMetadata({ params }) {
  const { slug } = params
}

export default async function Layout({ children, params }) {
  const { slug } = params
}

// After
export async function generateMetadata({ params }) {
  const { slug } = await params
}

export default async function Layout({ children, params }) {
  const { slug } = await params
}
```

#### Synchronous Layout (sync layout များ)

```tsx filename="app/layout.tsx" switcher
// Before
type Params = { slug: string }

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const { slug } = params
}

// After
import { use } from 'react'

type Params = Promise<{ slug: string }>

export default function Layout(props: {
  children: React.ReactNode
  params: Params
}) {
  const params = use(props.params)
  const slug = params.slug
}
```

```jsx filename="app/layout.js" switcher
// Before
export default function Layout({ children, params }) {
  const { slug } = params
}

// After
import { use } from 'react'
export default async function Layout(props) {
  const params = use(props.params)
  const slug = params.slug
}

```

#### Asynchronous Page (async page များ)

```tsx filename="app/page.tsx" switcher
// Before
type Params = { slug: string }
type SearchParams = { [key: string]: string | string[] | undefined }

export function generateMetadata({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { slug } = params
  const { query } = searchParams
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { slug } = params
  const { query } = searchParams
}

// After
type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const slug = params.slug
  const query = searchParams.query
}

export default async function Page(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const slug = params.slug
  const query = searchParams.query
}
```

```jsx filename="app/page.js" switcher
// Before
export function generateMetadata({ params, searchParams }) {
  const { slug } = params
  const { query } = searchParams
}

export default function Page({ params, searchParams }) {
  const { slug } = params
  const { query } = searchParams
}

// After
export async function generateMetadata(props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const slug = params.slug
  const query = searchParams.query
}

export default async function Page(props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const slug = params.slug
  const query = searchParams.query
}
```

#### Synchronous Page (sync page များ)

```tsx
'use client'

// Before
type Params = { slug: string }
type SearchParams = { [key: string]: string | string[] | undefined }

export default function Page({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { slug } = params
  const { query } = searchParams
}

// After
import { use } from 'react'

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function Page(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = use(props.params)
  const searchParams = use(props.searchParams)
  const slug = params.slug
  const query = searchParams.query
}
```

```jsx
// Before
export default function Page({ params, searchParams }) {
  const { slug } = params
  const { query } = searchParams
}

// After
import { use } from "react"

export default function Page(props) {
  const params = use(props.params)
  const searchParams = use(props.searchParams)
  const slug = params.slug
  const query = searchParams.query
}

```

#### Route Handlers (route handler များ)

```tsx filename="app/api/route.ts" switcher
// Before
type Params = { slug: string }

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = segmentData.params
  const slug = params.slug
}

// After
type Params = Promise<{ slug: string }>

export async function GET(request: Request, segmentData: { params: Params }) {
  const params = await segmentData.params
  const slug = params.slug
}
```

```js filename="app/api/route.js" switcher
// Before
export async function GET(request, segmentData) {
  const params = segmentData.params
  const slug = params.slug
}

// After
export async function GET(request, segmentData) {
  const params = await segmentData.params
  const slug = params.slug
}
```

## `runtime` configuration (Breaking change)

`runtime` [segment configuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/runtime) က အရင်က `edge` အပြင် `experimental-edge` ဆိုတဲ့ value တစ်ခုကိုပါ ထောက်ပံ့ခဲ့ပါတယ်။ Config နှစ်ခုလုံးက တစ်ခုတည်းကိုပဲ ရည်ညွှန်းတာမို့ — options တွေကို ရိုးရှင်းစေဖို့ — အခု `experimental-edge` သုံးရင် error ထုတ်ပေးပါမယ်။ ဒါကို ပြုပြင်ဖို့ သင့် `runtime` configuration ကို `edge` အဖြစ် update လုပ်ပါ။ ဒါကို အလိုအလျောက် လုပ်ပေးတဲ့ [codemod](/docs/nextjs/upgrading-codemods#app-dir-runtime-config-experimental-edge) တစ်ခု ရနိုင်ပါတယ်။

## `fetch` requests

[`fetch` requests](/docs/nextjs/fetch) တွေကို default အနေနဲ့ နောက်တော့ cache လုပ်မှာ မဟုတ်ပါဘူး။

`fetch` requests တစ်ခုချင်းစီကို caching ထဲ opt in လုပ်ချင်ရင် — `cache: 'force-cache'` option ကို ပို့ပေးနိုင်ပါတယ်။

```js filename="app/layout.js"
export default async function RootLayout() {
  const a = await fetch('https://...') // Not Cached
  const b = await fetch('https://...', { cache: 'force-cache' }) // Cached

  // ...
}
```

Layout (သို့) page တစ်ခုထဲက `fetch` requests အားလုံးကို caching ထဲ opt in လုပ်ချင်ရင် — `export const fetchCache = 'default-cache'` [segment config option](/docs/nextjs/route-segment-config) ကို သုံးနိုင်ပါတယ်။ `fetch` requests တစ်ခုချင်းစီမှာ `cache` option သတ်မှတ်ထားရင် အဲဒါကို သုံးပါလိမ့်မယ်။

```js filename="app/layout.js"
// Since this is the root layout, all fetch requests in the app
// that don't set their own cache option will be cached.
export const fetchCache = 'default-cache'

export default async function RootLayout() {
  const a = await fetch('https://...') // Cached
  const b = await fetch('https://...', { cache: 'no-store' }) // Not cached

  // ...
}
```

## Route Handlers (route handler များ)

[Route Handlers](/docs/nextjs/file-conventions-route) တွေထဲက `GET` functions တွေကို default အနေနဲ့ နောက်တော့ cache လုပ်မှာ မဟုတ်ပါဘူး။ `GET` methods တွေကို caching ထဲ opt in လုပ်ချင်ရင် — သင့် Route Handler file ထဲမှာ `export const dynamic = 'force-static'` လို [route config option](/docs/nextjs/route-segment-config) တစ်ခုကို သုံးနိုင်ပါတယ်။

```js filename="app/api/route.js"
export const dynamic = 'force-static'

export async function GET() {}
```

## Client Cache (client-side cache)

`<Link>` (သို့) `useRouter` ကတစ်ဆင့် pages တွေကြား navigate လုပ်တဲ့အခါ — [page](/docs/nextjs/file-conventions-page) segments တွေကို [Client Cache](https://nextjs.org/docs/app/glossary#client-cache) ကနေ နောက်တော့ ပြန်သုံးမှာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — browser ရဲ့ backward နဲ့ forward navigation တွေနဲ့ shared layouts တွေအတွက်တော့ ပြန်သုံးနေဆဲ ဖြစ်ပါတယ်။

Page segments တွေကို caching ထဲ opt in လုပ်ချင်ရင် — [`staleTimes`](/docs/nextjs/next-config-stale-times) config option ကို သုံးနိုင်ပါတယ်:

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
}

module.exports = nextConfig
```

[Layouts](/docs/nextjs/file-conventions-layout) နဲ့ [loading states](/docs/nextjs/file-conventions-loading) တွေကတော့ — navigation တွေမှာ cache လုပ်ပြီး ပြန်သုံးနေဆဲ ဖြစ်ပါတယ်။

## `next/font`

`@next/font` package ကို built-in [`next/font`](/docs/nextjs/component-font) နဲ့ အစားထိုးလိုက်လို့ ဖယ်ရှားလိုက်ပါပြီ။ သင့် imports တွေကို ဘေးကင်းစွာ အလိုအလျောက် အမည်ပြောင်းပေးတဲ့ [codemod](/docs/nextjs/upgrading-codemods#built-in-next-font) တစ်ခု ရနိုင်ပါတယ်။

```js filename="app/layout.js"
// Before
import { Inter } from '@next/font/google'

// After
import { Inter } from 'next/font/google'
```

## bundlePagesRouterDependencies

`experimental.bundlePagesExternals` က အခု stable ဖြစ်သွားပြီး — `bundlePagesRouterDependencies` လို့ အမည်ပြောင်းလိုက်ပါပြီ။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Before
  experimental: {
    bundlePagesExternals: true,
  },

  // After
  bundlePagesRouterDependencies: true,
}

module.exports = nextConfig
```

## serverExternalPackages

`experimental.serverComponentsExternalPackages` က အခု stable ဖြစ်သွားပြီး — `serverExternalPackages` လို့ အမည်ပြောင်းလိုက်ပါပြီ။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Before
  experimental: {
    serverComponentsExternalPackages: ['package-name'],
  },

  // After
  serverExternalPackages: ['package-name'],
}

module.exports = nextConfig
```

## Speed Insights

Speed Insights အတွက် auto instrumentation ကို Next.js 15 မှာ ဖယ်ရှားလိုက်ပါပြီ။

Speed Insights ကို ဆက်သုံးချင်ရင် [Vercel Speed Insights Quickstart](https://vercel.com/docs/speed-insights/quickstart) guide ကို လိုက်နာပါ။

## `NextRequest` Geolocation

`NextRequest` ပေါ်က `geo` နဲ့ `ip` properties တွေကို ဖယ်ရှားလိုက်ပါပြီ — ဒီ values တွေကို သင့် hosting provider က ပေးတာမို့ပါ။ ဒီ migration ကို အလိုအလျောက် လုပ်ပေးတဲ့ [codemod](/docs/nextjs/upgrading-codemods#150) တစ်ခု ရနိုင်ပါတယ်။

Vercel သုံးနေရင် — [`@vercel/functions`](https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package) ကနေ `geolocation` နဲ့ `ipAddress` functions တွေကို အစားထိုး သုံးနိုင်ပါတယ်:

```ts filename="middleware.ts"
import { geolocation } from '@vercel/functions'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { city } = geolocation(request)

  // ...
}
```

```ts filename="middleware.ts"
import { ipAddress } from '@vercel/functions'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const ip = ipAddress(request)

  // ...
}
```
