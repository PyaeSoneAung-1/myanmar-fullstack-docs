---
title: "Dynamic Segments ([folderName] — dynamic route segments file convention)"
description: "Dynamic Segments file convention — [folderName] နဲ့ URL path params တွေ ဖတ်ပြီး dynamic data ကနေ routes ဖန်တီးနည်း; Client Components ထဲသုံးပုံ, catch-all [...slug], optional catch-all [[...slug]], TypeScript typing, Cache Components နဲ့ တွဲသုံးပုံ"
order: 101
source: "https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes"
status: translated
updated: 2026-09-02
---

URL path တစ်ခုက path segments တွေ ဆက်တိုက် ပါဝင်ပါတယ်။ App Router မှာ segment တစ်ခုက **static** (တန်ဖိုး အတိအကျ match လုပ်တဲ့ literal value) ဖြစ်နိုင်သလို — **dynamic** (URL ကနေ တန်ဖိုးတစ်ခုကို ဖမ်းယူတဲ့ placeholder) လည်း ဖြစ်နိုင်ပါတယ်။ Segment ရဲ့ တန်ဖိုးကို ကြိုမသိရဘူးဆိုရင် — dynamic data တွေကနေ routes တွေ ဖန်တီးဖို့ Dynamic Segment တစ်ခုကို သတ်မှတ်ပါတယ်။ Next.js က ဖမ်းယူလိုက်တဲ့ တန်ဖိုးတွေကို page ဆီ `params` prop အနေနဲ့ — request time မှာ ဖြည့်ပေးတာပဲ ဖြစ်ဖြစ် build time မှာ prerender လုပ်တာပဲ ဖြစ်ဖြစ် ပို့ပေးပါတယ်။

> **သိထားသင့်သည်:** Dynamic Segments တွေကို path params, route params (သို့) URL params လို့လည်း အများအားဖြင့် ခေါ်ကြပါတယ်။

## Convention (စည်းမျဉ်း)

Dynamic Segment တစ်ခုကို folder နာမည်ကို square brackets နဲ့ ပတ်ပြီး ဖန်တီးနိုင်ပါတယ်: `[folderName]`။ ဥပမာ — blog တစ်ခုမှာ `[slug]` က blog posts တွေအတွက် Dynamic Segment ဖြစ်တဲ့ `app/blog/[slug]/page.js` ဆိုတဲ့ route ပါဝင်နိုင်ပါတယ်။

```tsx filename="app/blog/[slug]/page.tsx" switcher
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export default async function Page({ params }) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

Dynamic Segments တွေကို `params` prop အနေနဲ့ [`layout`](/docs/nextjs/file-conventions-layout), [`page`](/docs/nextjs/file-conventions-page), [`route`](/docs/nextjs/file-conventions-route) နဲ့ [`generateMetadata`](/docs/nextjs/generate-metadata) function တွေဆီ ပို့ပေးပါတယ်။

| Route                     | ဥပမာ URL    | `params`        |
| ------------------------- | ----------- | --------------- |
| `app/blog/[slug]/page.js` | `/blog/a`   | `{ slug: 'a' }` |
| `app/blog/[slug]/page.js` | `/blog/b`   | `{ slug: 'b' }` |
| `app/blog/[slug]/page.js` | `/blog/c`   | `{ slug: 'c' }` |

[root layout](/docs/nextjs/file-conventions-layout#root-layout) ရဲ့ ရှေ့မှာ ပေါ်လာတဲ့ dynamic segments တွေက **root parameters** တွေ ဖြစ်ပြီး — [`next/root-params`](https://nextjs.org/docs/app/api-reference/functions/next-root-params) နဲ့ Server Component ဘယ်ကနေမဆို ထပ်ဆောင်း ဖတ်နိုင်ပါတယ်။

### Client Components တွေထဲမှာ

Client Component **page** တစ်ခုထဲမှာဆိုရင် — props ကနေ လာတဲ့ dynamic segments တွေကို React ရဲ့ [`use`](https://react.dev/reference/react/use) API နဲ့ ဝင်ရောက် ဖတ်နိုင်ပါတယ်။

```tsx filename="app/blog/[slug]/page.tsx" switcher
'use client'
import { use } from 'react'

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  return (
    <div>
      <p>{slug}</p>
    </div>
  )
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
'use client'
import { use } from 'react'

export default function BlogPostPage({ params }) {
  const { slug } = use(params)

  return (
    <div>
      <p>{slug}</p>
    </div>
  )
}
```

တနည်းအားဖြင့် — Client Components တွေက [`useParams`](/docs/nextjs/use-params) hook ကို သုံးပြီး Client Component tree ထဲ ဘယ်နေရာမှာမဆို `params` တွေကို ဝင်ရောက် ဖတ်နိုင်ပါတယ်။

### Catch-all Segments

Dynamic Segments တွေကို brackets အတွင်းမှာ ellipsis ထည့်ပြီး `[...folderName]` — နောက်ဆက်တွဲ segments တွေကိုပါ ဖမ်းယူနိုင်တဲ့ **catch-all** အဖြစ် ချဲ့ထွင်နိုင်ပါတယ်။

ဥပမာ — `app/shop/[...slug]/page.js` က `/shop/clothes` ကို match လုပ်နိုင်သလို — `/shop/clothes/tops`, `/shop/clothes/tops/t-shirts` စတာတွေကိုပါ match လုပ်နိုင်ပါတယ်။

| Route                        | ဥပမာ URL     | `params`                    |
| ---------------------------- | ------------- | --------------------------- |
| `app/shop/[...slug]/page.js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `app/shop/[...slug]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[...slug]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

### Optional Catch-all Segments

Catch-all Segments တွေကို double square brackets ထဲမှာ ထည့်ပြီး `[[...folderName]]` — **optional** ဖြစ်အောင် လုပ်နိုင်ပါတယ်။

ဥပမာ — `app/shop/[[...slug]]/page.js` က `/shop/clothes`, `/shop/clothes/tops`, `/shop/clothes/tops/t-shirts` တွေအပြင် `/shop` ကိုပါ **match** လုပ်ပါလိမ့်မယ်။

**Catch-all** နဲ့ **optional catch-all** segments တွေရဲ့ ကွာခြားချက်က — optional မှာ parameter မပါတဲ့ route (အပေါ်က ဥပမာထဲက `/shop`) ကိုပါ match လုပ်တာ ဖြစ်ပါတယ်။

| Route                          | ဥပမာ URL     | `params`                    |
| ------------------------------ | ------------- | --------------------------- |
| `app/shop/[[...slug]]/page.js` | `/shop`       | `{ slug: undefined }`       |
| `app/shop/[[...slug]]/page.js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

### TypeScript

TypeScript သုံးနေရင် — သင့်ရဲ့ route segment အလိုက် `params` တွေအတွက် types တွေ ထည့်နိုင်ပါတယ်: `page` ထဲမှာ `params` တွေကို type လုပ်ဖို့ [`PageProps<'/route'>`](/docs/nextjs/file-conventions-page#page-props-helper), `layout` အတွက် [`LayoutProps<'/route'>`](/docs/nextjs/file-conventions-layout#layout-props-helper), `route` အတွက် [`RouteContext<'/route'>`](/docs/nextjs/file-conventions-route#route-context-helper) တွေကို အသီးသီး သုံးပါ။

Route `params` တန်ဖိုးတွေကို `string`, `string[]` (သို့) `undefined` (optional catch-all segments အတွက်) အနေနဲ့ type လုပ်ထားပါတယ် — တန်ဖိုးတွေက runtime အထိ မသိရသေးလို့ပါ။ User တွေက address bar ထဲ URL ဘာမဆို ရိုက်ထည့်နိုင်တာမို့ — ဒီကျယ်ပြန့်တဲ့ types တွေက သင့် application code က ဖြစ်နိုင်ခြေ ကိစ္စအားလုံးကို ကိုင်တွယ်နိုင်အောင် သေချာစေပါတယ်။

| Route                               | `params` Type သတ်မှတ်ချက်              |
| ----------------------------------- | ---------------------------------------- |
| `app/blog/[slug]/page.js`           | `{ slug: string }`                       |
| `app/shop/[...slug]/page.js`        | `{ slug: string[] }`                     |
| `app/shop/[[...slug]]/page.js`      | `{ slug?: string[] }`                    |
| `app/[categoryId]/[itemId]/page.js` | `{ categoryId: string, itemId: string }` |

`params` က တရားဝင် တန်ဖိုး အနည်းအကျဉ်းပဲ ရှိနိုင်တဲ့ route တစ်ခုမှာ အလုပ်လုပ်နေရင် — ဥပမာ သိထားပြီးသား language codes အစုတစ်ခုပါတဲ့ `[locale]` param မျိုး — runtime validation ကို သုံးပြီး user ရိုက်ထည့်နိုင်တဲ့ invalid params တွေကို ကိုင်တွယ်နိုင်ပြီး — သင့် application ရဲ့ ကျန်အပိုင်းတွေကိုတော့ သိထားတဲ့ set ကန့်သတ်ချက်ထဲက ပိုကျဉ်းတဲ့ type နဲ့ အလုပ်လုပ်စေနိုင်ပါတယ်။

```tsx filename="/app/[locale]/page.tsx"
import { notFound } from 'next/navigation'
import type { Locale } from '@i18n/types'
import { isValidLocale } from '@i18n/utils'

function assertValidLocale(value: string): asserts value is Locale {
  if (!isValidLocale(value)) notFound()
}

export default async function Page(props: PageProps<'/[locale]'>) {
  const { locale } = await props.params // locale is typed as string
  assertValidLocale(locale)
  // locale is now typed as Locale
}
```

## အလုပ်လုပ်ပုံ (Behavior)

- `params` prop က promise တစ်ခုမို့ — တန်ဖိုးတွေကို ဝင်ရောက်ဖို့ `async`/`await` (သို့) React ရဲ့ `use` function ကို သုံးရပါမယ်။
  - Version 14 နဲ့ အစောပိုင်းတွေမှာ `params` က synchronous prop တစ်ခုပါ။ Backwards compatibility အတွက် Next.js 15 မှာ synchronous အနေနဲ့ ဆက်ပြီး ဝင်ရောက်နိုင်ပေမယ့် — ဒီအပြုအမူက နောင်မှာ deprecated ဖြစ်ပါမယ်။

### Cache Components တွေနဲ့ ဆိုရင်

[Cache Components](/docs/nextjs/caching) တွေကို dynamic route segments တွေနဲ့ သုံးတဲ့အခါ — params တွေကို ကိုင်တွယ်ပုံက [`generateStaticParams`](/docs/nextjs/generate-static-params) သုံးလား မသုံးလားပေါ်မှာ မူတည်ပါတယ်။

`generateStaticParams` မပါဘဲ — param တန်ဖိုးတွေက prerendering ကာလအတွင်း မသိရသေးတာမို့ params တွေက runtime data တွေ ဖြစ်ပါတယ်။ Param access တွေကို fallback UI ပေးဖို့ `<Suspense>` boundaries တွေနဲ့ ပတ်ထားရပါမယ်။

`generateStaticParams` နဲ့ဆိုရင် — build time မှာ သုံးလို့ရတဲ့ sample param values တွေကို ပေးပါတယ်။ Build process က dynamic content တွေနဲ့ တခြား runtime APIs တွေကို မှန်ကန်စွာ ကိုင်တွယ်ထားလားဆိုတာ validate လုပ်ပြီး — samples တွေအတွက် static HTML files တွေ generate လုပ်ပါတယ်။ Runtime params တွေနဲ့ render လုပ်တဲ့ pages တွေကိုတော့ ပထမဆုံး request အောင်မြင်ပြီးနောက် disk ပေါ်မှာ သိမ်းဆည်းပါတယ်။

အောက်က sections တွေက pattern နှစ်မျိုးလုံးကို ပြသပါတယ်။

#### `generateStaticParams` မပါဘဲ

Params တွေ အားလုံးက runtime data တွေပါ။ Param access တွေကို Suspense fallback UI တွေနဲ့ ပတ်ထားရပါမယ်။ Next.js က build time မှာ static shell တစ်ခု generate လုပ်ပြီး — content တွေက request တစ်ခုချင်းစီမှာ load လုပ်ပါတယ်။

> **သိထားသင့်သည်:**
>
> - Page-level fallback UI အတွက် [`loading.tsx`](/docs/nextjs/file-conventions-loading) ကိုလည်း သုံးနိုင်ပါတယ်။
> - Layouts တွေထဲမှာတော့ `params` တွေကို top level မှာ await မလုပ်ပါနဲ့ — ဒါဆိုရင် layout ကို prerender လုပ်လို့ မရတော့ပါဘူး။ အဲဒီအစား params promise ကို လိုအပ်တဲ့ component ဆီ အောက်ကို ပို့ချပြီး အဲဒီမှာ await လုပ်ပါ။ ဥပမာတွေအတွက် [static shell ကို အများဆုံး အသုံးချခြင်း](/docs/nextjs/caching) ကို ကြည့်ပါ။

```tsx filename="app/blog/[slug]/page.tsx"
import { Suspense } from 'react'

export default function Page({ params }: PageProps<'/blog/[slug]'>) {
  return (
    <div>
      <h1>Blog Post</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {params.then(({ slug }) => (
          <Content slug={slug} />
        ))}
      </Suspense>
    </div>
  )
}

async function Content({ slug }: { slug: string }) {
  const res = await fetch(`https://api.vercel.app/blog/${slug}`)
  const post = await res.json()

  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </article>
  )
}
```

#### `generateStaticParams` နဲ့

Params တွေကို ကြိုပေးထားပြီး build time မှာ pages တွေကို prerender လုပ်ပါတယ်။ လိုအပ်ချက်အရ routes အားလုံး (သို့) အစိတ်အပိုင်းတစ်ခုကိုပဲ prerender လုပ်နိုင်ပါတယ်။

Build process အတွင်းမှာ route ကို sample param တစ်ခုချင်းစီနဲ့ run ပြီး HTML result တွေ စုဆောင်းပါတယ်။ Dynamic content (သို့) runtime data တွေကို မှားယွင်းစွာ ဝင်ရောက်ခဲ့ရင် — build က fail ဖြစ်ပါမယ်။

```tsx filename="app/blog/[slug]/page.tsx" highlight={3-5,8,19}
import { Suspense } from 'react'

export async function generateStaticParams() {
  return [{ slug: '1' }, { slug: '2' }, { slug: '3' }]
}

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params

  return (
    <div>
      <h1>Blog Post</h1>
      <Content slug={slug} />
    </div>
  )
}

async function Content({ slug }: { slug: string }) {
  const post = await getPost(slug)
  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </article>
  )
}

async function getPost(slug: string) {
  'use cache'
  const res = await fetch(`https://api.vercel.app/blog/${slug}`)
  return res.json()
}
```

Build-time validation က sample params တွေနဲ့ execute လုပ်တဲ့ code paths တွေကိုပဲ လွှမ်းခြုံပါတယ်။ သင့် route ထဲမှာ သင့် samples တွေထဲ မပါတဲ့ param တန်ဖိုးတချို့အတွက် runtime APIs တွေကို ဝင်ရောက်တဲ့ conditional logic ပါနေရင် — အဲဒီ branches တွေကို build time မှာ validate လုပ်မှာ မဟုတ်ပါဘူး:

```tsx filename="app/blog/[slug]/page.tsx"
import { cookies } from 'next/headers'

export async function generateStaticParams() {
  return [{ slug: 'public-post' }, { slug: 'hello-world' }]
}

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params

  if (slug.startsWith('private-')) {
    // ဒီ branch ကို build time မှာ ဘယ်တော့မှ execute မလုပ်ပါဘူး
    // 'private-*' slugs တွေအတွက် runtime requests တွေ error ဖြစ်ပါမယ်
    return <PrivatePost slug={slug} />
  }

  return <PublicPost slug={slug} />
}

async function PrivatePost({ slug }: { slug: string }) {
  const token = (await cookies()).get('token')
  // token သုံးပြီး auth လုပ်ကာ private post ကို fetch လုပ်ပြီး render လုပ်ပါ
}
```

`generateStaticParams` က return မလုပ်တဲ့ runtime params တွေအတွက်တော့ — validation က ပထမဆုံး request အတွင်းမှာ ဖြစ်ပေါ်ပါတယ်။ အပေါ်က ဥပမာထဲမှာ — `private-` နဲ့ စတဲ့ slugs တွေအတွက် requests တွေက fail ဖြစ်ပါမယ် — `PrivatePost` က Suspense boundary မပါဘဲ `cookies()` ကို ဝင်ရောက်လို့ပါ။ Conditional branch ကို မထိမိတဲ့ တခြား runtime params တွေကတော့ အောင်မြင်စွာ render ဖြစ်ပြီး — နောက် requests တွေအတွက် disk ပေါ်မှာ သိမ်းဆည်းပါတယ်။

ဒါကို ဖြေရှင်းဖို့ — `PrivatePost` ကို Suspense နဲ့ ပတ်ပါ:

```tsx filename="app/blog/[slug]/page.tsx" highlight={13-15}
import { Suspense } from 'react'
import { cookies } from 'next/headers'

export async function generateStaticParams() {
  return [{ slug: 'public-post' }, { slug: 'hello-world' }]
}

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params

  if (slug.startsWith('private-')) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <PrivatePost slug={slug} />
      </Suspense>
    )
  }

  return <PublicPost slug={slug} />
}

async function PrivatePost({ slug }: { slug: string }) {
  const token = (await cookies()).get('token')
  // token သုံးပြီး auth လုပ်ကာ private post ကို fetch လုပ်ပြီး render လုပ်ပါ
}
```

## ဥပမာများ (Examples)

### `generateStaticParams` နဲ့

[`generateStaticParams`](/docs/nextjs/generate-static-params) function ကို သုံးပြီး — request time မှာ on-demand ဖန်တီးမယ့်အစား build time မှာ routes တွေကို [statically generate (prerender)](https://nextjs.org/docs/app/glossary#prerendering) လုပ်နိုင်ပါတယ်။

```tsx filename="app/blog/[slug]/page.tsx" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

`generateStaticParams` function ထဲမှာ `fetch` သုံးရင် — requests တွေကို [အလိုအလျောက် deduplicate](https://nextjs.org/docs/app/glossary#memoization) လုပ်ပါတယ်။ ဒါက Layouts, Pages နဲ့ တခြား `generateStaticParams` functions တွေကြားမှာ data တူတူအတွက် network calls အကြိမ်ကြိမ် မဖြစ်အောင် ကာကွယ်ပေးပြီး — build time ကို မြန်စေပါတယ်။

### `generateStaticParams` နဲ့ Dynamic GET Route Handlers

`generateStaticParams` က dynamic [Route Handlers](/docs/nextjs/file-conventions-route) တွေနဲ့လည်း အလုပ်လုပ်ပြီး — build time မှာ API responses တွေကို statically generate လုပ်နိုင်ပါတယ်:

```ts filename="app/api/posts/[id]/route.ts" switcher
export async function generateStaticParams() {
  const posts: { id: number }[] = await fetch(
    'https://api.vercel.app/blog'
  ).then((res) => res.json())

  return posts.map((post) => ({
    id: `${post.id}`,
  }))
}

export async function GET(
  request: Request,
  { params }: RouteContext<'/api/posts/[id]'>
) {
  const { id } = await params
  const res = await fetch(`https://api.vercel.app/blog/${id}`)

  if (!res.ok) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }

  const post = await res.json()
  return Response.json(post)
}
```

```js filename="app/api/posts/[id]/route.js" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )

  return posts.map((post) => ({
    id: `${post.id}`,
  }))
}

export async function GET(request, { params }) {
  const { id } = await params
  const res = await fetch(`https://api.vercel.app/blog/${id}`)

  if (!res.ok) {
    return Response.json({ error: 'Post not found' }, { status: 404 })
  }

  const post = await res.json()
  return Response.json(post)
}
```

ဒီဥပမာထဲမှာ — `generateStaticParams` က return လုပ်တဲ့ blog post IDs အားလုံးအတွက် route handlers တွေကို build time မှာ statically generate လုပ်ပါတယ်။ တခြား IDs တွေဆီက requests တွေကိုတော့ request time မှာ dynamically ကိုင်တွယ်ပါတယ်။
