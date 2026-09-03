---
title: "next/root-params module (root-level route parameters များကို ဝင်ရောက်ဖတ်ရှုခြင်း)"
description: "next/root-params — Server Components တွေထဲမှာ root layout ရဲ့ ရှေ့မှာရှိတဲ့ dynamic segments (root parameters) တွေကို prop drilling မလိုဘဲ ဖတ်နိုင်တဲ့ getter functions များ; generateStaticParams, caching directives, multiple root layouts, catch-all segments, return types, ကန့်သတ်ချက်များနဲ့ အသုံးပြုပုံ ဥပမာများ"
order: 152
source: "https://nextjs.org/docs/app/api-reference/functions/next-root-params"
status: translated
updated: 2026-09-03
---

`next/root-params` module က [**Server Components**](https://nextjs.org/docs/app/glossary#server-component) တွေထဲမှာ root-level [parameters](/docs/nextjs/file-conventions-dynamic-routes) တွေကို ဝင်ရောက်ဖတ်ရှုဖို့ getter functions တွေ ထောက်ပံ့ပေးပါတယ်။ Root parameter တစ်ခုစီကို async function တစ်ခုအနေနဲ့ export လုပ်ထားပြီး — လက်ရှိ route အတွက် parameter ရဲ့ တန်ဖိုးကို resolve လုပ်ပေးပါတယ်။

Export နာမည်တွေကို သင့် dynamic segment folder တွေရဲ့ နာမည်ကနေ generate လုပ်ပါတယ်။ ဥပမာ — သင့် root layout က `app/[locale]` အတွင်းမှာဆိုရင် `next/root-params` ကနေ `locale` ကို import လုပ်ပါ။

ဒါက language (သို့) locale segment လိုမျိုး — application တစ်ခုလုံးမှာ ဝင်ရောက်သုံးဖို့ လိုအပ်တဲ့ တန်ဖိုးတွေအတွက် အသုံးဝင်ပါတယ်။ ဥပမာ shared utilities တွေ၊ layouts တွေနဲ့ နက်နက်ရှိုင်းရှိုင်း nested ဖြစ်နေတဲ့ components တွေထဲမှာ — props တွေအနေနဲ့ အောက်ကို ဆင့်ပို့ (pass down) စရာမလိုဘဲ ဝင်ရောက်သုံးနိုင်လို့ပါ။

```tsx filename="app/[lang]/layout.tsx" highlight={1,5} switcher
import { lang } from 'next/root-params'

export default async function RootLayout(props: LayoutProps<'/[lang]'>) {
  return (
    <html lang={await lang()}>
      <body>{props.children}</body>
    </html>
  )
}
```

```jsx filename="app/[lang]/layout.js" highlight={1,5} switcher
import { lang } from 'next/root-params'

export default async function RootLayout({ children }) {
  return (
    <html lang={await lang()}>
      <body>{children}</body>
    </html>
  )
}
```

Root parameters တွေက [root layout](/docs/nextjs/file-conventions-layout) ရဲ့ ရှေ့မှာ ပေါ်လာတဲ့ [dynamic segments](/docs/nextjs/file-conventions-dynamic-routes) တွေပါ။ ပုံမှန် [`params` prop](/docs/nextjs/file-conventions-page) နဲ့ မတူဘဲ — root parameter getters တွေကို prop drilling မလိုပဲ သင့် application ထဲက Server Component ဘယ်နေရာကမဆို ခေါ်လို့ရပါတယ်။ အသေးစိတ်အတွက် Root parameters တွေ ဘာကြောင့် အထူးလဲ ဆိုတဲ့ အပိုင်းကို ကြည့်ပါ။

> **သိထားသင့်သည် (Good to know)**:
>
> - Root parameter နာမည်တွေဟာ valid JavaScript function identifiers တွေ ဖြစ်ရပါမယ်။ Kebab-case နာမည်တွေ (ဥပမာ `[post-slug]`) ကို မထောက်ပံ့ပါဘူး — dev time (သို့) build လုပ်ချိန်မှာ error တစ်ခု ဖြစ်စေပါလိမ့်မယ်။
> - `next/root-params` ကို Server Components တွေမှာ သုံးနိုင်ပါတယ်။ Client Components တွေ၊ Server Actions တွေ (သို့) [Route Handlers](/docs/nextjs/file-conventions-route) တွေမှာတော့ မသုံးနိုင်ပါဘူး။ Route Handlers အတွက် ထောက်ပံ့မှုကို အနာဂတ် release တစ်ခုမှာ ထည့်သွင်းဖို့ စီစဉ်ထားပါတယ်။
> - `next/root-params` exports တွေအတွက် types တွေကို `next dev`၊ `next build` (သို့) [`next typegen`](/docs/nextjs/next-cli) လုပ်ချိန်မှာ generate လုပ်ပါတယ် — [`PageProps` နဲ့ `LayoutProps`](https://nextjs.org/docs/app/api-reference/config/typescript#route-aware-type-helpers) တွေလိုပါပဲ။

## Root parameters နဲ့ `generateStaticParams`

Root parameters တွေဟာ သူတို့ကို သတ်မှတ်ထားတဲ့ routes တွေ ဖန်တီးလိုက်တာနဲ့ ရရှိနိုင်ပါတယ်။ [`generateStaticParams`](/docs/nextjs/generate-static-params) function တစ်ခုက [Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) တွေမှာသာ လိုအပ်ပြီး — အဲဒီအခါ root parameter တစ်ခုစီမှာ အနည်းဆုံး တန်ဖိုးတစ်ခုစီ ရှိရပါမယ်။ မရှိရင် build က မအောင်မြင်ပါဘူး။

Root parameter တစ်ခုတည်းနဲ့ ဆိုရင်:

```tsx filename="app/[lang]/layout.tsx" highlight={11,12,13} switcher
import { lang } from 'next/root-params'

export default async function RootLayout(props: LayoutProps<'/[lang]'>) {
  return (
    <html lang={await lang()}>
      <body>{props.children}</body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'fr' }]
}
```

```jsx filename="app/[lang]/layout.js" highlight={11,12,13} switcher
import { lang } from 'next/root-params'

export default async function RootLayout({ children }) {
  return (
    <html lang={await lang()}>
      <body>{children}</body>
    </html>
  )
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'fr' }]
}
```

Root parameters အများကြီး ရှိတဲ့အခါ — တစ်ခုချင်းစီအတွက် တန်ဖိုးတစ်ခုစီ return လုပ်ပါ:

```tsx filename="app/[lang]/[locale]/layout.tsx"
export async function generateStaticParams() {
  return [
    { lang: 'en', locale: 'us' },
    { lang: 'en', locale: 'uk' },
  ]
}
```

### Nested `generateStaticParams` တစ်ခုထဲမှာ root parameters ဖတ်ခြင်း

Nested segment တစ်ခုရဲ့ [`generateStaticParams`](/docs/nextjs/generate-static-params) အတွင်းမှာ — `params` argument ကနေ destructure လုပ်မယ့်အစား root parameter တစ်ခုကို ၎င်းရဲ့ getter နဲ့ တိုက်ရိုက် ဖတ်နိုင်ပါတယ်:

```tsx filename="app/[lang]/posts/[slug]/page.tsx" highlight={1,4} switcher
import { lang } from 'next/root-params'

export async function generateStaticParams() {
  const language = await lang()
  const posts = await fetch(
    `https://api.example.com/posts?lang=${language}`
  ).then((res) => res.json())
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function Page() {
  // ...
}
```

```jsx filename="app/[lang]/posts/[slug]/page.js" highlight={1,4} switcher
import { lang } from 'next/root-params'

export async function generateStaticParams() {
  const language = await lang()
  const posts = await fetch(
    `https://api.example.com/posts?lang=${language}`
  ).then((res) => res.json())
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function Page() {
  // ...
}
```

## Root parameters နဲ့ အခြား route parameters

Root parameters တွေက root layout file အထိ path ထဲမှာ ပေါ်လာတဲ့ [dynamic segments](https://nextjs.org/docs/app/glossary#dynamic-route-segments) တွေကနေ လာတဲ့ route parameters တွေပါ။ Route tree ထဲက ပိုနက်တဲ့ နေရာတွေမှာရှိတဲ့ အခြား route parameters တွေကိုတော့ [`params` prop](/docs/nextjs/file-conventions-page) ကနေတစ်ဆင့် ဝင်ရောက်ပါတယ်။

ဒီ file structure ကို ကြည့်ပါ:

- `app/[lang]/layout.tsx` (root layout)
- `app/[lang]/posts/[slug]/page.tsx`

`lang` ကပဲ root parameter တစ်ခု ဖြစ်ပြီး — `slug` က ပုံမှန် route parameter တစ်ခုပါ:

```tsx filename="app/[lang]/posts/[slug]/page.tsx" highlight={1,7} switcher
import { lang } from 'next/root-params'

export default async function PostPage(
  props: PageProps<'/[lang]/posts/[slug]'>
) {
  const { slug } = await props.params
  const language = await lang()

  return (
    <article>
      <p>Language: {language}</p>
      <p>Post: {slug}</p>
    </article>
  )
}
```

```jsx filename="app/[lang]/posts/[slug]/page.js" highlight={1,5} switcher
import { lang } from 'next/root-params'

export default async function PostPage({ params }) {
  const { slug } = await params
  const language = await lang()

  return (
    <article>
      <p>Language: {language}</p>
      <p>Post: {slug}</p>
    </article>
  )
}
```

## Shared code တွေထဲမှာ root parameters ဝင်ရောက်ခြင်း

Root parameter getters တွေက module imports တွေ ဖြစ်လို့ — layouts နဲ့ pages တွေတင်မက Server Component (သို့) server-side utility ဘယ်ကနေမဆို ခေါ်နိုင်ပါတယ်:

```tsx filename="lib/get-translations.ts" highlight={4}
import { lang } from 'next/root-params'

export async function getTranslations() {
  const language = await lang()
  // Load translations based on the root language parameter
  return import(`@/locales/${language}.json`)
}
```

> **သိထားသင့်သည်:** `next/root-params` သုံးတဲ့ files တွေမှာ `import 'server-only'` ထည့်စရာ မလိုပါဘူး။ Client Component တစ်ခုမှာ သုံးမိရင် import ကိုယ်တိုင် build time မှာ fail ဖြစ်နေပြီးသားပါ။

## Caching directives တွေနဲ့ အပြုအမူ (Behavior)

Root parameter getters တွေက import လုပ်ထားတဲ့ functions တွေ ဖြစ်လို့ — [cached](/docs/nextjs/use-cache) function တစ်ခုက ဘယ် getters တွေကို သုံးလဲဆိုတာကို Next.js က ခြေရာခံနိုင်ပါတယ်။ သုံးထားတဲ့ root parameters တွေကပဲ [cache key](/docs/nextjs/use-cache) ထဲမှာ ပါဝင်လို့ — cache entries တွေဟာ မသက်ဆိုင်တဲ့ parameter တန်ဖိုးတွေကြားမှာ ကွဲပြားမသွားပါဘူး။

```tsx filename="app/[lang]/components/cached-nav.tsx" highlight={7} switcher
import { lang } from 'next/root-params'

// The cache key for this function only includes `lang`,
// not every dynamic segment in the route.
async function getNavigation() {
  'use cache'
  const language = await lang()
  const res = await fetch(`https://api.example.com/nav?lang=${language}`)
  return res.json()
}

export default async function CachedNav() {
  const nav = await getNavigation()
  return <nav>{/* render nav items */}</nav>
}
```

```jsx filename="app/[lang]/components/cached-nav.js" highlight={7} switcher
import { lang } from 'next/root-params'

// The cache key for this function only includes `lang`,
// not every dynamic segment in the route.
async function getNavigation() {
  'use cache'
  const language = await lang()
  const res = await fetch(`https://api.example.com/nav?lang=${language}`)
  return res.json()
}

export default async function CachedNav() {
  const nav = await getNavigation()
  return <nav>{/* render nav items */}</nav>
}
```

ပုံမှန် `params` prop နဲ့ဆိုရင် — cached function ရဲ့ အပြင်ဘက်မှာ `await params` လုပ်ပြီး တန်ဖိုးကို argument တစ်ခုအနေနဲ့ ထည့်ပေးဖို့ လိုပါလိမ့်မယ်:

```tsx filename="app/[lang]/page.tsx" highlight={6,17} switcher
import { lang } from 'next/root-params'

// With root params: call directly inside the cached function
async function getDataWithRootParams() {
  'use cache'
  const language = await lang()
  return fetch(`https://api.example.com/data?lang=${language}`)
}

// Without root params: await params outside, pass as argument
async function getDataWithParams(language: string) {
  'use cache'
  return fetch(`https://api.example.com/data?lang=${language}`)
}

export default async function Page(props: PageProps<'/[lang]'>) {
  const { lang: language } = await props.params
  const data = await getDataWithParams(language)
  // ...
}
```

```jsx filename="app/[lang]/page.js" highlight={6,17} switcher
import { lang } from 'next/root-params'

// With root params: call directly inside the cached function
async function getDataWithRootParams() {
  'use cache'
  const language = await lang()
  return fetch(`https://api.example.com/data?lang=${language}`)
}

// Without root params: await params outside, pass as argument
async function getDataWithParams(language) {
  'use cache'
  return fetch(`https://api.example.com/data?lang=${language}`)
}

export default async function Page({ params }) {
  const { lang: language } = await params
  const data = await getDataWithParams(language)
  // ...
}
```

## Multiple root layouts (root layouts အများအပြား)

Application တစ်ခုမှာ မတူညီတဲ့ parameters တွေနဲ့ root layouts အများအပြား ရှိတဲ့အခါ — getter functions တွေရဲ့ types တွေကို ဖြစ်နိုင်တဲ့ routes အားလုံးမှာ အသုံးပြုမှု အတွက် ထည့်သွင်းစဉ်းစား (account) ထားပါတယ်။ Root layout တိုင်းမှာ မရှိတဲ့ parameter တစ်ခုရဲ့ type က `string | undefined` ဖြစ်ပါတယ်။

ဒီ file structure ကို ကြည့်ပါ:

- `app/dashboard/[id]/layout.tsx` (root layout — `id` နဲ့)
- `app/marketing/layout.tsx` (root layout — `id` မပါ)

```tsx filename="app/dashboard/[id]/page.tsx" highlight={4} switcher
import { id } from 'next/root-params'

export default async function DashboardPage() {
  const dashboardId = await id() // string | undefined
  return <div>Dashboard: {dashboardId}</div>
}
```

```jsx filename="app/dashboard/[id]/page.js" highlight={4} switcher
import { id } from 'next/root-params'

export default async function DashboardPage() {
  const dashboardId = await id() // string | undefined
  return <div>Dashboard: {dashboardId}</div>
}
```

`id` က marketing root layout မှာ မရှိတာမို့ — marketing routes တွေကနေ ဝင်ရောက်တဲ့အခါ `await id()` က `undefined` ကို ပြန်ပေးပါတယ်။

## Catch-all နဲ့ optional catch-all segments

Root parameters တွေက [catch-all နဲ့ optional catch-all](/docs/nextjs/file-conventions-dynamic-routes) segments တွေနဲ့ အလုပ်လုပ်ပါတယ်:

```tsx filename="app/docs/[...path]/layout.tsx" highlight={6} switcher
import { path } from 'next/root-params'

export default async function DocsLayout(
  props: LayoutProps<'/docs/[...path]'>
) {
  const segments = await path() // string[] | undefined
  return (
    <div>
      <nav>Path: {segments?.join(' / ')}</nav>
      {props.children}
    </div>
  )
}
```

```jsx filename="app/docs/[...path]/layout.js" highlight={4} switcher
import { path } from 'next/root-params'

export default async function DocsLayout({ children }) {
  const segments = await path() // string[] | undefined
  return (
    <div>
      <nav>Path: {segments?.join(' / ')}</nav>
      {children}
    </div>
  )
}
```

## Returns

Root parameter getter တစ်ခုစီက — အောက်ပါတို့ထဲက တစ်ခုကို resolve လုပ်တဲ့ `Promise` တစ်ခုကို ပြန်ပေးပါတယ်:

| Segment အမျိုးအစား | ဥပမာ       | Return type             |
| ------------------ | ---------- | ----------------------- |
| Dynamic            | `[id]`     | `string`                |
| Catch-all          | `[...path]` | `string[]`             |
| Optional catch-all | `[[...path]]` | `string[] \| undefined` |

Parameter က လက်ရှိ route ရဲ့ root layout ထဲမှာ မရှိဘူးဆိုရင် (Multiple root layouts ကို ကြည့်ပါ) — return type ထဲမှာ `undefined` ပါဝင်ပါတယ်။

## ကန့်သတ်ချက်များ (Restrictions)

ဒီအများစုက root parameters အလုပ်လုပ်ပုံရဲ့ အမြဲတမ်း ကန့်သတ်ချက်တွေပါ။ ခြွင်းချက်ကတော့ [Route Handlers](/docs/nextjs/file-conventions-route) ပဲ ဖြစ်ပြီး — အခုထိ မထောက်ပံ့သေးပေမယ့် အနာဂတ် release တစ်ခုမှာ ထည့်သွင်းဖို့ စီစဉ်ထားပါတယ်။

### Server Components တွေမှာပဲ

Root parameter getters တွေကို Server Components တွေမှာပဲ သုံးနိုင်ပါတယ်:

```tsx
// This will cause a build error
'use client'

import { lang } from 'next/root-params' // Error: Cannot import in Client Component
```

### `unstable_cache` ထဲမှာ မရနိုင်ပါ

`unstable_cache` အတွင်းမှာ root parameter getter တစ်ခုကို ခေါ်ရင် runtime error တစ်ခု throw ဖြစ်ပါတယ်။ အဲဒီအစား [`"use cache"`](/docs/nextjs/use-cache) ကို သုံးပါ။

```tsx
import { lang } from 'next/root-params'
import { unstable_cache } from 'next/cache'

const getCachedData = unstable_cache(async () => {
  const language = await lang() // Error: Not supported inside unstable_cache
  return fetch(`https://api.example.com/data?lang=${language}`)
})
```

### Server Actions တွေမှာ မရနိုင်ပါ

```tsx
import { lang } from 'next/root-params'

async function submitForm() {
  'use server'
  const language = await lang() // Error: Not supported in Server Actions
}
```

## Root parameters တွေ ဘာကြောင့် အထူးလဲ (Why root parameters are special)

[Root layout](/docs/nextjs/file-conventions-layout) က top-level rendering boundary (ထိပ်ဆုံးအဆင့် render နယ်နိမိတ်) ဖြစ်ပါတယ်။ ၎င်းရဲ့ ရှေ့မှာရှိတဲ့ route parameters တွေကို အဲဒီ root layout အောက်က routes အားလုံးက မျှဝေသုံးတာမို့ — tree ထဲက Server Component ဘယ်ကနေမဆို ဝင်ရောက်ဖတ်ဖို့ လုံခြုံစေပါတယ်။ Route ထဲက ပိုနက်တဲ့ နေရာတွေမှာရှိတဲ့ route parameters တွေကတော့ ဘယ် child page ကို render လုပ်နေလဲပေါ် မူတည်ပြီး ပြောင်းလဲတတ်လို့ — သူတို့ကို သတ်မှတ်ထားတဲ့ page (သို့) layout ထဲမှာရှိတဲ့ [`params` prop](/docs/nextjs/file-conventions-page) ကနေပဲ ရနိုင်ပါတယ်။

```txt
app/
  [lang]/              ← root parameter (shared by all routes below)
    layout.tsx         ← root layout
    page.tsx           ← has no slug, doesn't know about blog or store
    blog/
      [slug]/          ← route parameter
        page.tsx
    store/
      [...slug]/       ← catch-all route parameter with the same name
        page.tsx
```

ဒီဥပမာမှာ `lang` ကပဲ တစ်ခုတည်းသော root parameter ပါ။ Root layout ရဲ့ တိုက်ရိုက်အောက်က `page.tsx` မှာ `slug` လုံးဝ မရှိပါဘူး။ Blog နဲ့ store branch နှစ်ခုလုံးက `slug` ကို သတ်မှတ်ထားပေမယ့် — segment types တွေ မတူပါဘူး (`[slug]` vs `[...slug]`). Route တစ်ခုစီက ၎င်းရဲ့ ကိုယ်ပိုင် route parameters တွေကိုပဲ သိပါတယ်။ နာမည်တူတာတောင် route ပေါ်မူတည်ပြီး type မတူနိုင်၊ အဓိပ္ပါယ် မတူနိုင် (သို့) လုံးဝ မရှိနိုင်ပါဘူး။ ဒါကြောင့်မို့ root layout အောက်က route parameters တွေကို global getters တွေအနေနဲ့ မဟုတ်ဘဲ `params` prop ကနေတစ်ဆင့် ဝင်ရောက်တာပါ။

ခြွင်းချက်ကတော့ multiple root layouts ပါ။ မတူညီတဲ့ root layouts တွေက မတူညီတဲ့ route parameters တွေ သတ်မှတ်ထားတဲ့အခါ — ပေးထားတဲ့ parameter တစ်ခု မရှိနိုင်တဲ့ routes တွေအတွက် getter functions တွေရဲ့ return type ထဲမှာ `undefined` ပါဝင်ပါတယ်။

## Version History

| Version   | အပြောင်းအလဲ                     |
| --------- | ------------------------------ |
| `v16.3.0` | `next/root-params` ကို စတင် မိတ်ဆက်။ |
