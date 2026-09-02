---
title: "layout.js (Layout ဖိုင်)"
description: "layout.js file convention — route segment တစ်ခုရဲ့ အပြင်ဆုံးမှာ ဘုံ UI ဖွဲ့စည်းပုံ သတ်မှတ်ပေးပြီး root layout ကနေ <html>/<body> အထိ ထိန်းချုပ်ပေးတဲ့ special file; children နဲ့ params props အကြောင်း"
order: 29
source: "https://nextjs.org/docs/app/api-reference/file-conventions/layout"
status: translated
updated: 2026-09-02
---

`layout` file က Next.js application ထဲမှာ **layout** တစ်ခု သတ်မှတ်ဖို့ သုံးပါတယ်။ Layout ဆိုတာက — navigation bar, sidebar စတဲ့ ဘုံ UI တွေပါဝင်ပြီး အောက်က content (children) တွေကို wrap လုပ်ပေးတဲ့ အစိတ်အပိုင်းပါ။

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

[Component hierarchy](/docs/nextjs/project-structure) အရ — `layout.js` က route segment တစ်ခုရဲ့ **အပြင်ဘက်ဆုံး (outermost)** component ပါ။ `template.js`, `error.js`, `loading.js`, `not-found.js` နဲ့ `page.js` — ဒီ files တွေအားလုံးကို သူက wrap လုပ်ပေးပါတယ်။

**Root layout** ဆိုတာက — root `app` directory ရဲ့ အပေါ်ဆုံးမှာ ရှိတဲ့ layout ပါ။ `<html>` နဲ့ `<body>` tags တွေ အပါအဝင် — app တစ်ခုလုံးမှာ မျှဝေသုံးတဲ့ UI တွေကို ဒီမှာ သတ်မှတ်ပါတယ်။

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Reference

### Props

#### `children` (required)

Layout components တွေက `children` prop တစ်ခုကို လက်ခံပြီး သုံးသင့်ပါတယ်။ Render လုပ်နေချိန်မှာ — layout က wrap လုပ်ထားတဲ့ route segments တွေနဲ့ `children` ကို ဖြည့်ပေးပါတယ်။ အများအားဖြင့်တော့ ဒါတွေက အောက်က child [Page](/docs/nextjs/file-conventions-page) (ရှိရင်) ရဲ့ component တွေ ဖြစ်ပေမယ့် — သက်ဆိုင်ရာ အခြေအနေတွေမှာ [Loading](/docs/nextjs/file-conventions-loading) (သို့) [Error](/docs/nextjs/error-handling) လို အခြား special files တွေလည်း ဖြစ်နိုင်ပါတယ်။

#### `params` (optional)

`params` က promise တစ်ခု ဖြစ်ပြီး — root segment ကနေ အဲဒီ layout အထိ [dynamic route parameters](/docs/nextjs/dynamic-routes) တွေ ပါဝင်တဲ့ object တစ်ခုကို resolve လုပ်ပေးပါတယ်။

```tsx
// app/dashboard/[team]/layout.tsx
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ team: string }>
}) {
  const { team } = await params
}
```

| ဥပမာ Route | URL | `params` |
|---|---|---|
| `app/dashboard/[team]/layout.js` | `/dashboard/1` | `Promise<{ team: '1' }>` |
| `app/shop/[tag]/[item]/layout.js` | `/shop/1/2` | `Promise<{ tag: '1', item: '2' }>` |
| `app/blog/[...slug]/layout.js` | `/blog/1/2` | `Promise<{ slug: ['1', '2'] }>` |

- `params` prop က promise ဖြစ်လို့ — တန်ဖိုးတွေ ဖတ်ဖို့ `async/await` (သို့) React ရဲ့ [`use`](https://react.dev/reference/react/use) function ကို သုံးရပါတယ်။
- Version 14 နဲ့ အစောပိုင်းတွေမှာ `params` က synchronous prop ဖြစ်ခဲ့ပါတယ်။ Backwards compatibility (နောက်ပြန် လိုက်ဖက်မှု) အတွက် Next.js 15 မှာ synchronous အနေနဲ့လည်း ဆက်ဖတ်လို့ရသေးပေမယ့် — ဒီအပြုအမူက နောင်မှာ deprecated (ဖျက်သိမ်းမယ့်) ဖြစ်တော့မှာပါ။

### Layout Props Helper

Layout တွေကို `LayoutProps` နဲ့ type လုပ်ပြီး — ကိုယ့် directory structure ကနေ အလိုအလျောက် ကောက်ယူထားတဲ့ strongly typed `params` နဲ့ named slots တွေကို ရယူနိုင်ပါတယ်။ `LayoutProps` က global အနေနဲ့ နေရာတိုင်းမှာ ရနိုင်တဲ့ helper တစ်ခုပါ။

```tsx
// app/dashboard/layout.tsx
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}
      {/* If you have app/dashboard/@analytics, it appears as a typed slot: */}
      {/* {props.analytics} */}
    </section>
  )
}
```

> **သိထားသင့်သည်:**
>
> - Types တွေကို `next dev`, `next build` (သို့) `next typegen` လုပ်ချိန်မှာ generate လုပ်ပါတယ်။
> - Type generation ပြီးရင် `LayoutProps` helper က global အနေနဲ့ ရနေပြီဖြစ်လို့ — import လုပ်စရာ မလိုပါဘူး။

### Root Layout

`app` directory မှာ **root layout** တစ်ခု မဖြစ်မနေ ပါရပါမယ် — ဒါက root `app` directory ရဲ့ အပေါ်ဆုံး layout ဖြစ်ပြီး ပုံမှန်အားဖြင့် `app/layout.js` ပါ (အစောပိုင်းက ဥပမာမှာ မြင်ရတဲ့ ပုံစံမျိုးပါ)။ Root layout နဲ့ ပတ်သက်ပြီး သိထားသင့်တာတွေက:

- Root layout က `<html>` နဲ့ `<body>` tags တွေကို **သတ်မှတ်ပေးရပါမယ်**။
- `<title>` နဲ့ `<meta>` လို `<head>` tags တွေကို root layout ထဲမှာ **လက်နဲ့ ထည့်စရာ မလိုပါဘူး**။ အဲဒီအစား — streaming နဲ့ `<head>` elements တွေကို de-duplicate (ထပ်နေတာတွေ ရှင်းခြင်း) လုပ်ပေးတာလို အဆင့်မြင့် လိုအပ်ချက်တွေကို အလိုအလျောက် ကိုင်တွယ်ပေးတဲ့ [Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) ကို သုံးပါ။
- **Root layouts အများအပြား** ဖန်တီးလို့ရပါတယ်။ ကိုယ့်အပေါ်မှာ `layout.js` မရှိတဲ့ layout တိုင်းက root layout ပါ။ ပုံမှန် ချဉ်းကပ်နည်း နှစ်မျိုးက:
  - [Route groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) သုံးတာ — ဥပမာ `app/(shop)/layout.js` နဲ့ `app/(marketing)/layout.js` လိုမျိုး။
  - `app/layout.js` ကို ချန်လှပ်ပြီး — `app/dashboard/layout.js` နဲ့ `app/blog/layout.js` လို subdirectory တွေထဲက layouts တစ်ခုချင်းစီကို သက်ဆိုင်ရာ directory တွေအတွက် root layouts အဖြစ် လုပ်တာ။
- Root layouts အများအပြားကြားကို ဖြတ်ပြီး **navigate လုပ်တိုင်း full page load** ဖြစ်စေပါတယ် (client-side navigation နဲ့ ဆန့်ကျင်ဘက်အနေနဲ့)။
- Root layout က **dynamic segment** အောက်မှာလည်း ရှိနိုင်ပါတယ် — ဥပမာ [internationalization](/docs/nextjs/internationalization) လုပ်တဲ့အခါ `app/[lang]/layout.js` လိုမျိုးပါ။ Root layout ရဲ့ ရှေ့မှာ ရှိတဲ့ dynamic segments တွေက **root parameters** တွေ ဖြစ်ပြီး — [`next/root-params`](https://nextjs.org/docs/app/api-reference/functions/next-root-params) နဲ့ Server Component တိုင်းကနေ ဖတ်လို့ရပါတယ်။

## Caveats (သတိထားစရာများ)

### Request Object

Layouts တွေက navigation လုပ်ချိန်မှာ မလိုအပ်တဲ့ server requests တွေ ရှောင်ဖို့ client ဘက်မှာ cache (ကက်ရှ် — သိမ်းထားခြင်း) လုပ်ထားပါတယ်။ **Layouts တွေက rerender မဖြစ်ပါဘူး** — pages တွေကြား ပြောင်းသွားတဲ့အခါ မလိုအပ်တဲ့ တွက်ချက်မှုတွေ ရှောင်ဖို့ သူတို့ကို cache လုပ်ပြီး ပြန်သုံးလို့ရပါတယ်။ Layout တွေကို raw request ထဲ ဝင်ရောက်ခွင့် မပေးဘဲ ထားခြင်းအားဖြင့် — Next.js က layout အတွင်းမှာ performance ကို ထိခိုက်စေနိုင်တဲ့ နှေးကွေးပြီး ဈေးကြီးတဲ့ user code တွေ လည်ပတ်မှာကို တားဆီးပေးပါတယ်။

Request object ကို ဝင်ရောက်ဖို့ဆိုရင် — [Server Components](/docs/nextjs/server-client-components) နဲ့ Functions တွေထဲမှာ [`headers`](https://nextjs.org/docs/app/api-reference/functions/headers) နဲ့ [`cookies`](https://nextjs.org/docs/app/api-reference/functions/cookies) APIs တွေကို သုံးနိုင်ပါတယ်။

```tsx
// app/shop/layout.tsx
import { cookies } from 'next/headers'

export default async function Layout({ children }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return '...'
}
```

### Query params

Layouts တွေက navigation ပေါ်မှာ rerender မဖြစ်လို့ — မကြာခင် ခေတ်နောက်ကျ (stale) ဖြစ်သွားမယ့် search params တွေကို သူတို့ ဝင်ရောက်လို့ မရပါဘူး။

Query parameters အသစ်တွေကို ဖတ်ချင်ရင် — Page ရဲ့ [`searchParams`](/docs/nextjs/file-conventions-page) prop ကို သုံးနိုင်သလို၊ Client Component တစ်ခုအတွင်းမှာ [`useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params) hook နဲ့လည်း ဖတ်နိုင်ပါတယ်။ Client Components တွေက navigation ပေါ်မှာ rerender ဖြစ်လို့ — နောက်ဆုံး query parameters တွေကို သူတို့ဆီမှာ အမြဲ ရှိပါတယ်။

```tsx
// app/ui/search.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function Search() {
  const searchParams = useSearchParams()

  const search = searchParams.get('search')

  return '...'
}
```

ဒီလို Client Component တစ်ခုကို layout ထဲမှာ import လုပ်ပြီး — `children` ရဲ့ အပေါ်မှာ ထည့် render လုပ်နိုင်ပါတယ်:

```tsx
// app/shop/layout.tsx
import Search from '@/app/ui/search'

export default function Layout({ children }) {
  return (
    <>
      <Search />
      {children}
    </>
  )
}
```

### Pathname

Layouts တွေက navigation ပေါ်မှာ rerender မဖြစ်လို့ — stale ဖြစ်သွားမယ့် pathname ကိုလည်း ဝင်ရောက်လို့ မရပါဘူး။

Current pathname ကို ဖတ်ချင်ရင် — Client Component တစ်ခုအတွင်းမှာ [`usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) hook ကို သုံးပါ။ Client Components တွေက navigation ချိန်မှာ rerender ဖြစ်လို့ — နောက်ဆုံး pathname ကို သူတို့ဆီမှာ ရှိပါတယ်။

```tsx
// app/ui/breadcrumbs.tsx
'use client'

import { usePathname } from 'next/navigation'

// Simplified breadcrumbs logic
export default function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/')

  return (
    <nav>
      {segments.map((segment, index) => (
        <span key={index}>
          {' > '}
          {segment}
        </span>
      ))}
    </nav>
  )
}
```

```tsx
// app/docs/layout.tsx
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'

export default function Layout({ children }) {
  return (
    <>
      <Breadcrumbs />
      <main>{children}</main>
    </>
  )
}
```

### `loading.js` နဲ့ အပြန်အလှန် ဆက်စပ်ပုံ

[Component hierarchy](/docs/nextjs/project-structure) ထဲမှာ `loading.js` က `layout.js` ရဲ့ **အောက်မှာ** ရှိတာမို့ — layout ကိုယ်တိုင်အတွင်းမှာ [`cookies()`](https://nextjs.org/docs/app/api-reference/functions/cookies), [`headers()`](https://nextjs.org/docs/app/api-reference/functions/headers) ခေါ်တာ (သို့) uncached fetches တွေလို uncached (cache မလုပ်ထား) ဒါမှမဟုတ် runtime data access တွေအတွက် fallback ကို သူ ပြသပေးနိုင်မှာ မဟုတ်ပါဘူး။

ဒီအပြုအမူက [Cache Components](/docs/nextjs/caching) ဖွင့်ထားလား မဖွင့်ထားဘူးလားပေါ်မှာ မူတည်ပါတယ်:

- **Cache Components မသုံးထားရင်:** Layout က render လုပ်ပြီးမှသာ navigation က ဆက်ဖြစ်ပါတယ် (block ဖြစ်နေမယ်) — ပြီးတော့ `loading.js` ရဲ့ fallback ကို ပြသမှာ မဟုတ်ပါဘူး။
- **Cache Components သုံးထားရင်:** `loading.js` ကို အထူး prefetch marker တစ်ခုလိုမဟုတ်ဘဲ — ပုံမှန် `<Suspense>` boundary တစ်ခုအနေနဲ့ သဘောထားပါတယ်။ Layout ထဲက uncached (သို့) runtime data access တွေကို ကိုယ်ပိုင် `<Suspense>` boundary နဲ့ ရှင်းရှင်းလင်းလင်း wrap လုပ်ထားရမှာ ဖြစ်ပြီး — မဟုတ်ရင် Next.js က build-time error နဲ့ လမ်းညွှန်ပေးပါတယ်။ Static shell က ချက်ချင်း stream လုပ်ပြီး — uncached content တွေက ဖြေရှင်းပြီးချိန်မှာ နေရာဝင် လဲလှယ်ပေးပါတယ်။

အခြေအနေ နှစ်မျိုးလုံးမှာ navigation ကို ချက်ချင်း ဖြစ်စေချင်ရင်:

- Layout ထဲက runtime data access တွေကို fallback ပါတဲ့ ကိုယ်ပိုင် `<Suspense>` boundary တစ်ခုနဲ့ wrap လုပ်ပါ။
- Uncached data fetching တွေကို `layout.js` ကနေ `page.js` ထဲ ရွှေ့ပါ — ဒါဆိုရင် `loading.js` က fallback ပြသပေးနိုင်မှာ ဖြစ်ပါတယ်။

```tsx
// app/dashboard/layout.tsx
import { Suspense } from 'react'
import { NavSkeleton } from './nav-skeleton'
import { DashboardNav } from './dashboard-nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<NavSkeleton />}>
        <DashboardNav />
      </Suspense>
      <main>{children}</main>
    </>
  )
}
```

### Data Fetching

Layouts တွေက ကိုယ့် `children` ဆီကို data တွေ ပို့ပေးလို့ မရပါဘူး။ ဒါပေမယ့် — route တစ်ခုထဲမှာ data တစ်ခုတည်းကို တစ်ကြိမ်ထက် ပိုပြီး fetch လုပ်လို့ရပြီး — React ရဲ့ `cache` ကို သုံးပြီး requests တွေကို de-duplicate (ထပ်နေတာ ရှင်းခြင်း) လုပ်ထားရင် performance ထိခိုက်မှာ မရှိပါဘူး။

ဒါမှမဟုတ် — Next.js ထဲမှာ [`fetch`](https://nextjs.org/docs/app/api-reference/functions/fetch) သုံးတဲ့အခါ requests တွေကို အလိုအလျောက် dedupe လုပ်ပေးပါတယ်။

```tsx
// app/lib/data.ts
export async function getUser(id: string) {
  const res = await fetch(`https://.../users/${id}`)
  return res.json()
}
```

ဥပမာ — layout ရော page ရော တူညီတဲ့ data တစ်ခုတည်းကို fetch လုပ်ရင် — request တစ်ခုတည်းပဲ ဖြစ်သွားပြီး နှစ်ခုစလုံး အလုပ်လုပ်နိုင်ပါတယ်:

```tsx
// app/dashboard/layout.tsx
import { getUser } from '@/app/lib/data'
import { UserName } from '@/app/ui/user-name'

export default async function Layout({ children }) {
  const user = await getUser('1')

  return (
    <>
      <nav>
        {/* ... */}
        <UserName user={user.name} />
      </nav>
      {children}
    </>
  )
}
```

```tsx
// app/dashboard/page.tsx
import { getUser } from '@/app/lib/data'
import { UserName } from '@/app/ui/user-name'

export default async function Page() {
  const user = await getUser('1')

  return (
    <div>
      <h1>Welcome {user.name}</h1>
    </div>
  )
}
```

### Child segments တွေကို ဝင်ရောက်ခြင်း

Layouts တွေက ကိုယ့်အောက်က route segments တွေဆီကို တိုက်ရိုက် ဝင်ရောက်ခွင့် မရှိပါဘူး။ Route segments အားလုံးကို ဝင်ရောက်ချင်ရင် — Client Component တစ်ခုထဲမှာ [`useSelectedLayoutSegment`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment) (သို့) [`useSelectedLayoutSegments`](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segments) ကို သုံးပါ။

```tsx
// app/ui/nav-link.tsx
'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function NavLink({
  slug,
  children,
}: {
  slug: string
  children: React.ReactNode
}) {
  const segment = useSelectedLayoutSegment()
  const isActive = slug === segment

  return (
    <Link
      href={`/blog/${slug}`}
      // Change style depending on whether the link is active
      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
    >
      {children}
    </Link>
  )
}
```

```tsx
// app/blog/layout.tsx
import { NavLink } from './nav-link'
import getPosts from './get-posts'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const featuredPosts = await getPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <NavLink slug={post.slug}>{post.title}</NavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```

## ဥပမာများ

### Metadata

`title` နဲ့ `meta` လို `<head>` HTML elements တွေကို — [`metadata` object](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#the-metadata-object) (သို့) [`generateMetadata` function](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function) နဲ့ ပြင်ဆင်နိုင်ပါတယ်။

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return '...'
}
```

> **သိထားသင့်သည်:** `<title>` နဲ့ `<meta>` လို `<head>` tags တွေကို root layout ထဲမှာ လက်နဲ့ ထည့်စရာ မလိုပါဘူး။ အဲဒီအစား — streaming နဲ့ de-duplication လို အဆင့်မြင့် လိုအပ်ချက်တွေကို အလိုအလျောက် ကိုင်တွယ်ပေးတဲ့ [Metadata APIs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) တွေကို သုံးပါ။

### Active Nav Links

Nav link တစ်ခု active (လက်ရှိ ရောက်နေတဲ့ route) ဟုတ်မဟုတ် ဆုံးဖြတ်ဖို့ [`usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname) hook ကို သုံးနိုင်ပါတယ်။ `usePathname` က client hook တစ်ခုမို့ — nav links တွေကို Client Component တစ်ခုထဲ ထုတ်ထားပြီး အဲဒါကို ကိုယ့် layout ထဲမှာ import လုပ်သုံးရပါမယ်:

```tsx
// app/ui/nav-links.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
        Home
      </Link>

      <Link
        className={`link ${pathname === '/about' ? 'active' : ''}`}
        href="/about"
      >
        About
      </Link>
    </nav>
  )
}
```

ပြီးတော့ root layout ထဲမှာ `<NavLinks />` ကို `<body>` ရဲ့ အတွင်း — `children` ရဲ့ အပေါ်မှာ ထည့် render လုပ်နိုင်ပါတယ်။

### `params` ပေါ်မူတည်ပြီး content ပြသခြင်း

[dynamic route segments](/docs/nextjs/dynamic-routes) တွေကို သုံးပြီး — `params` prop ပေါ်မူတည်ကာ သီးသန့် content တွေကို ပြသ (သို့) fetch လုပ်နိုင်ပါတယ်။

```tsx
// app/dashboard/layout.tsx
export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ team: string }>
}) {
  const { team } = await params

  return (
    <section>
      <header>
        <h1>Welcome to {team}'s Dashboard</h1>
      </header>
      <main>{children}</main>
    </section>
  )
}
```

### Client Components တွေမှာ `params` ဖတ်ခြင်း

Client Component (ထဲမှာ `async` မလုပ်နိုင်) တစ်ခုမှာ `params` ကို သုံးချင်ရင် — React ရဲ့ [`use`](https://react.dev/reference/react/use) function နဲ့ promise ကို ဖတ်နိုင်ပါတယ်:

```tsx
// app/page.tsx
'use client'

import { use } from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
}
```

## Version History

| Version | အပြောင်းအလဲ |
|---|---|
| `v15.0.0-RC` | `params` ကို promise အဖြစ် ပြောင်းလိုက်ပါတယ်။ [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#150) ရနိုင်ပါတယ်။ |
| `v13.0.0` | `layout` စတင် မိတ်ဆက်။ |

## နောက်တစ်ဆင့်တွေ

- [Pages & Layouts](/docs/nextjs/pages-layouts) — `page.js` နဲ့ `layout.js` တွဲဖက် အလုပ်လုပ်ပုံ
- [Dynamic Routes](/docs/nextjs/dynamic-routes) — dynamic segments တွေနဲ့ `params` အကြောင်း
- [Loading UI](/docs/nextjs/file-conventions-loading) — `loading.js` Suspense fallback နဲ့ layout ရဲ့ ဆက်စပ်ပုံ
