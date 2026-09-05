---
title: "Layouts & Pages (Layout နဲ့ Page)"
description: "Next.js ရဲ့ file-system based routing — folder/file တွေနဲ့ page နဲ့ layout ဖန်တီးနည်း, root layout (html/body) လိုအပ်ချက်, nested routes/layouts, dynamic segments, searchParams, page တွေကြား Link navigation, PageProps/LayoutProps helpers"
order: 2
source: "https://nextjs.org/docs/app/getting-started/layouts-and-pages"
status: translated
updated: 2026-09-05
---

Next.js က **file-system based routing** ကို သုံးပါတယ် — ဆိုလိုတာက folder တွေနဲ့ file တွေကို သုံးပြီး route တွေ သတ်မှတ်နိုင်ပါတယ်။ ဒီ page မှာ layout တွေနဲ့ page တွေကို ဘယ်လို ဖန်တီးရမလဲ၊ သူတို့ကြားမှာ ဘယ်လို link ချိတ်ရမလဲဆိုတာ လမ်းညွှန်ပေးပါမယ်။

## Page တစ်ခု ဖန်တီးခြင်း (Creating a Page)

**Page** ဆိုတာ — သတ်မှတ်ထားတဲ့ route တစ်ခုပေါ်မှာ render လုပ်ပေးတဲ့ UI ပါ။ Page တစ်ခု ဖန်တီးဖို့ — `app` directory ထဲမှာ [`page` file](/docs/nextjs/file-conventions-page) တစ်ခု ထည့်ပြီး React component တစ်ခုကို **default export** လုပ်ရပါတယ်။ ဥပမာ — index page (`/`) တစ်ခု ဖန်တီးဖို့:

```tsx filename="app/page.tsx" switcher
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

```jsx filename="app/page.js" switcher
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

## Layout တစ်ခု ဖန်တီးခြင်း (Creating a Layout)

Layout ဆိုတာ — page အများအပြားကြားမှာ **share လုပ်ထားတဲ့ UI** ပါ။ Navigation လုပ်တဲ့အခါ layout တွေက state ကို ထိန်းသိမ်းထားပြီး interactive ဖြစ်နေတုန်းပဲ — **ပြန်လည် render လုပ်ခြင်း မရှိပါဘူး**။

[`layout` file](/docs/nextjs/file-conventions-layout) ကနေ React component တစ်ခုကို default export လုပ်ခြင်းဖြင့် layout တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။ Component က `children` prop တစ်ခုကို လက်ခံရပါမယ် — `children` ထဲမှာ page တစ်ခု (သို့) နောက်ထပ် [layout](#nesting-layouts) တစ်ခု ဝင်နိုင်ပါတယ်။

ဥပမာ — index page ကို child အဖြစ် လက်ခံတဲ့ layout တစ်ခု ဖန်တီးဖို့ `app` directory ထဲမှာ `layout` file တစ်ခု ထည့်ပါ:

```tsx filename="app/layout.tsx" switcher
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI — page တွေအားလုံးမှာ ထပ်တူပါမယ့် အပိုင်း */}
        {/* children ကို page (သို့) nested layout ပြချင်တဲ့နေရာမှာ ထားပါ */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Layout UI — page တွေအားလုံးမှာ ထပ်တူပါမယ့် အပိုင်း */}
        {/* children ကို page (သို့) nested layout ပြချင်တဲ့နေရာမှာ ထားပါ */}
        <main>{children}</main>
      </body>
    </html>
  )
}
```

အထက်ပါ layout ကို [root layout](/docs/nextjs/file-conventions-layout#root-layout) လို့ ခေါ်ပါတယ် — `app` directory ရဲ့ အမြစ်မှာ သတ်မှတ်ထားလို့ပါ။ Root layout က **မဖြစ်မနေ လိုအပ်ပြီး** `html` နဲ့ `body` tags နှစ်ခုလုံး ပါဝင်ရပါမယ်။

## Nested Route တစ်ခု ဖန်တီးခြင်း (Creating a Nested Route)

Nested route ဆိုတာ — URL segment အများအပြား ပေါင်းစပ်ထားတဲ့ route တစ်ခုပါ။ ဥပမာ — `/blog/[slug]` route က segment သုံးခု ပါဝင်ပါတယ်:

- `/` — Root Segment (အမြစ် segment)
- `blog` — Segment
- `[slug]` — Leaf Segment (အစွန်ဆုံး segment)

Next.js မှာ:

- **Folders** တွေက URL segments တွေနဲ့ ချိတ်ဆက်တဲ့ route segments တွေကို သတ်မှတ်ပါတယ်။
- **Files** (ဥပမာ `page` နဲ့ `layout`) တွေက segment တစ်ခုအတွက် ပြသမယ့် UI ကို ဖန်တီးပါတယ်။

Nested routes တွေ ဖန်တီးဖို့ — folder တွေကို တစ်ခုထဲတစ်ခု အထဲမှာ ထည့်နိုင်ပါတယ်။ ဥပမာ `/blog` route တစ်ခု ထည့်ဖို့ — `app` directory ထဲမှာ `blog` folder တစ်ခု ဖန်တီးပြီး `/blog` ကို public ဝင်ရောက်နိုင်အောင် `page.tsx` file တစ်ခု ထည့်ပါ:

```tsx filename="app/blog/page.tsx" switcher
// Dummy imports (ဥပမာပြရန် သက်သက်)
import { getPosts } from '@/lib/posts'
import { Post } from '@/ui/post'

export default async function Page() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  )
}
```

```jsx filename="app/blog/page.js" switcher
// Dummy imports (ဥပမာပြရန် သက်သက်)
import { getPosts } from '@/lib/posts'
import { Post } from '@/ui/post'

export default async function Page() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  )
}
```

Nested routes တွေ ဖန်တီးဖို့ folder တွေကို ဆက်ပြီး အထပ်လိုက် ထည့်သွားနိုင်ပါတယ်။ ဥပမာ — blog post တစ်ပုဒ်ချင်းစီအတွက် route တစ်ခု ဖန်တီးဖို့ `blog` folder ထဲမှာ `[slug]` folder အသစ်တစ်ခု ဖန်တီးပြီး `page` file တစ်ခု ထည့်ပါ:

```tsx filename="app/blog/[slug]/page.tsx" switcher
export function generateStaticParams() {}

export default function Page() {
  return <h1>Hello, Blog Post Page!</h1>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export function generateStaticParams() {}

export default function Page() {
  return <h1>Hello, Blog Post Page!</h1>
}
```

Folder နာမည်တစ်ခုကို square brackets နဲ့ ပတ်ထားခြင်း (ဥပမာ `[slug]`) က [dynamic route segment](/docs/nextjs/file-conventions-dynamic-routes) တစ်ခုကို ဖန်တီးပေးပါတယ် — data ကနေ page အများအပြား ထုတ်လုပ်ဖို့ သုံးပါတယ်။ ဥပမာ — blog posts, product pages စတာတွေပါ။

## Nesting Layouts

Default အနေနဲ့ — folder hierarchy ထဲက layouts တွေလည်း nested ဖြစ်နေပါတယ် — ဆိုလိုတာက သူတို့က child layouts တွေကို ကိုယ့်ရဲ့ `children` prop ကနေတစ်ဆင့် wrap လုပ်ပါတယ်။ Layouts တွေကို — သီးခြား route segments (folders) တွေထဲမှာ `layout` ထည့်ခြင်းဖြင့် — အလွှာလိုက် ထပ်နိုင်ပါတယ်။

ဥပမာ — `/blog` route အတွက် layout တစ်ခု ဖန်တီးဖို့ `blog` folder ထဲမှာ `layout` file အသစ်တစ်ခု ထည့်ပါ:

```tsx filename="app/blog/layout.tsx" switcher
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

```jsx filename="app/blog/layout.js" switcher
export default function BlogLayout({ children }) {
  return <section>{children}</section>
}
```

အထက်ပါ layouts နှစ်ခုကို ပေါင်းလိုက်ရင် — root layout (`app/layout.js`) က blog layout (`app/blog/layout.js`) ကို wrap လုပ်ပြီး — blog layout က blog page (`app/blog/page.js`) နဲ့ blog post page (`app/blog/[slug]/page.js`) တို့ကို wrap လုပ်ပါတယ်။

## Dynamic Segment တစ်ခု ဖန်တီးခြင်း (Creating a Dynamic Segment)

[Dynamic segments](/docs/nextjs/file-conventions-dynamic-routes) တွေက data ကနေ ထုတ်လုပ်ထားတဲ့ routes တွေကို ဖန်တီးခွင့် ပေးပါတယ်။ ဥပမာ — blog post တစ်ပုဒ်ချင်းစီအတွက် route တစ်ခုစီကို ကိုယ်တိုင် ဖန်တီးနေမယ့်အစား — blog post data ပေါ် အခြေခံပြီး routes တွေ ထုတ်လုပ်ဖို့ dynamic segment တစ်ခုကို သုံးနိုင်ပါတယ်။

Dynamic segment တစ်ခု ဖန်တီးဖို့ — segment (folder) ရဲ့ နာမည်ကို square brackets ထဲမှာ ပတ်ပါ: `[segmentName]`။ ဥပမာ — `app/blog/[slug]/page.tsx` route ထဲမှာ `[slug]` က dynamic segment ပါ။

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

[Dynamic Segments](/docs/nextjs/file-conventions-dynamic-routes) နဲ့ [`params`](/docs/nextjs/file-conventions-page#params-optional) props တွေအကြောင်း ပိုလေ့လာပါ။ [Dynamic Segments အတွင်းက Nested layouts](/docs/nextjs/file-conventions-layout#params-optional) တွေကလည်း `params` props တွေကို ဝင်ရောက် သုံးနိုင်ပါတယ်။

## Search Params တွေနဲ့ Rendering လုပ်ခြင်း (Rendering with Search Params)

Server Component **page** တစ်ခုမှာ — [`searchParams`](/docs/nextjs/file-conventions-page#searchparams-optional) prop ကို သုံးပြီး search parameters တွေကို ဝင်ရောက် ဖတ်နိုင်ပါတယ်:

```tsx filename="app/page.tsx" switcher
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}
```

```jsx filename="app/page.jsx" switcher
export default async function Page({ searchParams }) {
  const filters = (await searchParams).filters
}
```

`searchParams` ကို သုံးတာက page ကို [**dynamic rendering**](/docs/nextjs/glossary#dynamic-rendering) ထဲ ရောက်သွားစေပါတယ် — search parameters တွေကို ဖတ်ဖို့ incoming request တစ်ခု လိုအပ်လို့ပါ။

Client Components တွေကတော့ search params တွေကို ဖတ်ဖို့ [`useSearchParams`](/docs/nextjs/use-search-params) hook ကို သုံးနိုင်ပါတယ်။

`useSearchParams` အကြောင်း [prerendered](/docs/nextjs/use-search-params#prerendering) နဲ့ [dynamically rendered](/docs/nextjs/use-search-params#dynamic-rendering) routes တွေမှာ ပိုလေ့လာပါ။

### ဘာကို ဘယ်အချိန်မှာ သုံးမလဲ (What to Use and When)

- Page အတွက် **data တွေ load လုပ်ဖို့** search parameters တွေ လိုအပ်ရင် (ဥပမာ — pagination, database ကနေ filtering) `searchParams` prop ကို သုံးပါ။
- Search parameters တွေကို **client ပေါ်မှာပဲ** သုံးမယ်ဆိုရင် (ဥပမာ — props ကနေ load လုပ်ပြီးသား list တစ်ခုကို filter လုပ်တာ) `useSearchParams` ကို သုံးပါ။
- Optimization အသေးစားတစ်ခုအနေနဲ့ — re-renders တွေ မဖြစ်စေဘဲ search params တွေကို ဖတ်ချင်ရင် **callbacks (သို့) event handlers** တွေထဲမှာ `new URLSearchParams(window.location.search)` ကို သုံးနိုင်ပါတယ်။

## Page တွေကြား Linking လုပ်ခြင်း (Linking Between Pages)

Routes တွေကြားမှာ navigate လုပ်ဖို့ [`<Link>` component](/docs/nextjs/component-link) ကို သုံးနိုင်ပါတယ်။ `<Link>` က Next.js ရဲ့ built-in component တစ်ခုဖြစ်ပြီး — HTML `<a>` tag ကို extend လုပ်ကာ [prefetching](/docs/nextjs/linking) နဲ့ [client-side navigation](/docs/nextjs/linking) တွေကို ပံ့ပိုးပေးပါတယ်။

ဥပမာ — blog posts စာရင်းတစ်ခု ထုတ်လုပ်ဖို့ `next/link` ကနေ `<Link>` ကို import လုပ်ပြီး component ဆီ `href` prop တစ်ခု ပေးပါ:

```tsx filename="app/ui/post.tsx" highlight={1,2,11} switcher
import Link from 'next/link'
import { getPosts } from '@/lib/posts'

export default async function Posts() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/ui/post.js" highlight={1,2,11} switcher
import Link from 'next/link'
import { getPosts } from '@/lib/posts'

export default async function Posts() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

> **သိထားသင့်သည်:** `<Link>` က Next.js မှာ routes တွေကြား navigate လုပ်ဖို့ အဓိက နည်းလမ်း ဖြစ်ပါတယ်။ ပိုပြီး အဆင့်မြင့်တဲ့ navigation တွေအတွက် [`useRouter` hook](/docs/nextjs/use-router) ကိုလည်း သုံးနိုင်ပါတယ်။

## Route Props Helpers (Route Props အထောက်အကူများ)

Next.js က route structure ကနေ `params` နဲ့ named slots တွေကို ခန့်မှန်းပေးတဲ့ utility types တွေကို ထုတ်ပေးပါတယ်:

- [**PageProps**](/docs/nextjs/file-conventions-page#page-props-helper): `page` components တွေအတွက် props — `params` နဲ့ `searchParams` အပါအဝင်။
- [**LayoutProps**](/docs/nextjs/file-conventions-layout#layout-props-helper): `layout` components တွေအတွက် props — `children` နဲ့ named slots တွေ (ဥပမာ `@analytics` လို folders) အပါအဝင်။

ဒါတွေက global အနေနဲ့ ရရှိနိုင်တဲ့ helpers တွေပါ — `next dev`, `next build` (သို့) [`next typegen`](/docs/nextjs/next-cli#next-typegen-options) run လုပ်တဲ့အခါ generate လုပ်ပေးပါတယ်။

```tsx filename="app/blog/[slug]/page.tsx"
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  return <h1>Blog post: {slug}</h1>
}
```

```tsx filename="app/dashboard/layout.tsx"
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}
      {/* app/dashboard/@analytics ရှိရင် typed slot အဖြစ် ပေါ်လာပါတယ်: */}
      {/* {props.analytics} */}
    </section>
  )
}
```

> **သိထားသင့်သည်:**
>
> - Static routes တွေက `params` ကို `{}` အဖြစ် resolve လုပ်ပါတယ်။
> - `PageProps`, `LayoutProps` တွေက global helpers တွေပါ — imports မလိုပါဘူး။
> - Types တွေကို `next dev`, `next build` (သို့) `next typegen` လုပ်ချိန်မှာ generate လုပ်ပါတယ်။
