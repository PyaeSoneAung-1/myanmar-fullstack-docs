---
title: "generateStaticParams function (dynamic routes တွေကို build time မှာ static generate လုပ်ခြင်း)"
description: "generateStaticParams() — [slug] လို dynamic route segments တွေအတွက် params list ပြန်ပေးပြီး routes တွေကို request time မဟုတ်ဘဲ build time မှာ statically generate လုပ်ခြင်း; dynamicParams, multi-segment, Route Handlers အကြောင်း"
order: 44
source: "https://nextjs.org/docs/app/api-reference/functions/generate-static-params"
status: translated
updated: 2026-09-02
---

`generateStaticParams` function ကို [dynamic route segments](/docs/nextjs/dynamic-routes) တွေနဲ့ တွဲသုံးပြီး — routes တွေကို request time မှာ on-demand ဖြစ်အောင် မဟုတ်ဘဲ build time မှာ [**statically generate**](https://nextjs.org/docs/app/glossary#prerendering) (ကြိုတင် ထုတ်လုပ်) လုပ်ဖို့ သုံးပါတယ်။

`generateStaticParams` ကို အောက်ပါတို့နဲ့ တွဲသုံးနိုင်ပါတယ်:

- [Pages](/docs/nextjs/file-conventions-page) (`page.tsx`/`page.js`)
- [Layouts](/docs/nextjs/file-conventions-layout) (`layout.tsx`/`layout.js`)
- [Route Handlers](/docs/nextjs/route-handlers) (`route.ts`/`route.js`)

```tsx
// app/blog/[slug]/page.tsx
// [slug] dynamic segment ကို ဖြည့်ပေးဖို့ `params` list တစ်ခု ပြန်ပေးပါ
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// ဒီ page ရဲ့ version အများအပြားကို `generateStaticParams` က ပြန်ပေးတဲ့
// `params` တွေကို သုံးပြီး statically generate လုပ်ပါလိမ့်မယ်
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

> **သိထားသင့်သည်:**
>
> - [`dynamicParams`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams) segment config option ကို သုံးပြီး — `generateStaticParams` နဲ့ မထုတ်လုပ်ထားတဲ့ dynamic segment တစ်ခုကို လည်ပတ်လာတဲ့အခါ ဘာဖြစ်မလဲ ထိန်းချုပ်နိုင်ပါတယ်။
> - Runtime မှာ paths တွေကို revalidate (ISR) လုပ်နိုင်ဖို့ — `generateStaticParams` ကနေ empty array ပြန်ပေးရပါမယ် (အောက်က ဥပမာ) (သို့) [`export const dynamic = 'force-static'`](https://nextjs.org/docs/app/guides/caching-without-cache-components#dynamic) ကို သုံးရပါတယ်။
> - `next dev` ကာလအတွင်းမှာ — route တစ်ခုဆီ navigate လုပ်တဲ့အခါ `generateStaticParams` ကို ခေါ်ပါတယ်။
> - `next build` ကာလအတွင်းမှာ — သက်ဆိုင်ရာ Layouts (သို့) Pages တွေ မထုတ်လုပ်ခင် `generateStaticParams` က အရင် run ပါတယ်။
> - Revalidation (ISR) ကာလအတွင်းမှာတော့ — `generateStaticParams` ကို နောက်တစ်ကြိမ် ပြန်ခေါ်မှာ မဟုတ်ပါဘူး။
> - `generateStaticParams` က Pages Router ထဲက [`getStaticPaths`](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths) function နေရာကို အစားထိုးပါတယ်။

## Parameters

`options.params` (optional)

Route တစ်ခုထဲမှာ dynamic segments အများအပြားက `generateStaticParams` သုံးနေရင် — parent က ထုတ်ပေးလိုက်တဲ့ `params` set တစ်ခုစီအတွက် child `generateStaticParams` function ကို တစ်ကြိမ်စီ execute လုပ်ပါတယ်။

`params` object ထဲမှာ parent `generateStaticParams` က ဖြည့်ပေးလိုက်တဲ့ `params` တွေ ပါဝင်ပြီး — child segment ထဲက `params` တွေကို ထုတ်လုပ်ဖို့ (အောက်က Multiple Dynamic Segments in a Route ကဏ္ဍ) သုံးနိုင်ပါတယ်။

## Returns

`generateStaticParams` က objects array တစ်ခုကို ပြန်ပေးရပါမယ် — object တစ်ခုစီက route တစ်ခုတည်းရဲ့ ဖြည့်ပြီးသား (populated) dynamic segments တွေကို ကိုယ်စားပြုပါတယ်။

- Object ထဲက property တစ်ခုစီက route အတွက် ဖြည့်ရမယ့် dynamic segment တစ်ခုပါ။
- Property ရဲ့ name က segment ရဲ့ name ဖြစ်ပြီး — property ရဲ့ value က အဲဒီ segment ကို ဘာနဲ့ ဖြည့်ရမလဲ ဖြစ်ပါတယ်။

| ဥပမာ Route                       | `generateStaticParams` Return Type        |
| --------------------------------- | ----------------------------------------- |
| `/product/[id]`                   | `{ id: string }[]`                        |
| `/products/[category]/[product]`  | `{ category: string, product: string }[]` |
| `/products/[...slug]`             | `{ slug: string[] }[]`                    |

## Dynamic segment တစ်ခုတည်း (Single Dynamic Segment)

```tsx
// app/product/[id]/page.tsx
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

// ဒီ page ရဲ့ version သုံးခုကို `generateStaticParams` က ပြန်ပေးတဲ့
// `params` တွေကို သုံးပြီး statically generate လုပ်ပါလိမ့်မယ်
// - /product/1
// - /product/2
// - /product/3
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // ...
}
```

## Dynamic segments အများအပြား (Multiple Dynamic Segments)

```tsx
// app/products/[category]/[product]/page.tsx
export function generateStaticParams() {
  return [
    { category: 'a', product: '1' },
    { category: 'b', product: '2' },
    { category: 'c', product: '3' },
  ]
}

// ဒီ page ရဲ့ version သုံးခုကို `generateStaticParams` က ပြန်ပေးတဲ့
// `params` တွေကို သုံးပြီး statically generate လုပ်ပါလိမ့်မယ်
// - /products/a/1
// - /products/b/2
// - /products/c/3
export default async function Page({
  params,
}: {
  params: Promise<{ category: string; product: string }>
}) {
  const { category, product } = await params
  // ...
}
```

## Catch-all Dynamic Segment

```tsx
// app/product/[...slug]/page.tsx
export function generateStaticParams() {
  return [{ slug: ['a', '1'] }, { slug: ['b', '2'] }, { slug: ['c', '3'] }]
}

// ဒီ page ရဲ့ version သုံးခုကို `generateStaticParams` က ပြန်ပေးတဲ့
// `params` တွေကို သုံးပြီး statically generate လုပ်ပါလိမ့်မယ်
// - /product/a/1
// - /product/b/2
// - /product/c/3
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  // ...
}
```

## ဥပမာများ

### Prerendering

#### Paths အားလုံး build time မှာ

Paths အားလုံးကို build time မှာ statically render လုပ်ဖို့ — path list အပြည့်အစုံကို `generateStaticParams` ဆီ ပေးပါ။ (ဒီ page ရဲ့ ထိပ်ဆုံး ဥပမာမှာ ပြထားတဲ့အတိုင်း posts အားလုံးကို fetch လုပ်ပြီး map လုပ်တဲ့ ပုံစံပါ။)

#### Paths အစုအဝေး (subset) build time မှာ

Paths အစုအဝေးတစ်ခုကို build time မှာ statically render လုပ်ပြီး — ကျန်တာတွေကို runtime မှာ ပထမဆုံး လည်ပတ်တဲ့အခါ render လုပ်စေချင်ရင် — path list တစ်စိတ်တစ်ပိုင်းကို ပြန်ပေးပါ:

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  // Build time မှာ ပထမဆုံး posts ၁၀ ခုကိုပဲ render လုပ်ပါ
  return posts.slice(0, 10).map((post) => ({
    slug: post.slug,
  }))
}
```

ပြီးရင် — [`dynamicParams`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams) segment config option ကို သုံးပြီး `generateStaticParams` နဲ့ မထုတ်လုပ်ထားတဲ့ dynamic segment တစ်ခုကို လည်ပတ်လာတဲ့အခါ ဘာဖြစ်မလဲ ထိန်းချုပ်နိုင်ပါတယ်:

```tsx
// app/blog/[slug]/page.tsx
// ထိပ်ဆုံး ၁၀ ခုကလွဲပြီး posts အားလုံး 404 ဖြစ်ပါလိမ့်မယ်
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
  const topPosts = posts.slice(0, 10)

  return topPosts.map((post) => ({
    slug: post.slug,
  }))
}
```

#### Paths အားလုံး runtime မှာ

Paths အားလုံးကို ပထမဆုံး လည်ပတ်တဲ့အခါ statically render လုပ်စေချင်ရင် — empty array ပြန်ပေးပါ (build time မှာ ဘယ် path မှ render မလုပ်တော့ပါ) (သို့) [`export const dynamic = 'force-static'`](https://nextjs.org/docs/app/guides/caching-without-cache-components#dynamic) ကို သုံးပါ:

```jsx
// app/blog/[slug]/page.js
export async function generateStaticParams() {
  return []
}
```

```jsx
// app/changelog/[slug]/page.js
export const dynamic = 'force-static'
```

> **သိထားသင့်သည်:**
>
> - `generateStaticParams` ကနေ array ကို အမြဲ ပြန်ပေးရပါတယ် — empty ဖြစ်နေရင်တောင် ပြန်ပေးရပါတယ်။ မဟုတ်ရင် route က dynamically render ဖြစ်သွားပါလိမ့်မယ်။

#### Cache Components နဲ့အတူ

[Dynamic routes](/docs/nextjs/dynamic-routes) တွေမှာ [Cache Components](/docs/nextjs/caching) သုံးတဲ့အခါ — `generateStaticParams` က **param အနည်းဆုံး တစ်ခု** ပြန်ပေးရပါတယ်။ Empty arrays တွေက [build error](https://nextjs.org/docs/messages/empty-generate-static-params) တစ်ခု ဖြစ်စေပါတယ်။ ဒါက Cache Components တွေက သင့် route က runtime မှာ `cookies()`, `headers()` (သို့) `searchParams` တွေကို မှားယွင်းစွာ ဝင်ရောက်ဖတ်မှု မရှိကြောင်း validate လုပ်နိုင်စေဖို့ပါ။

> **သိထားသင့်သည်:** Build time မှာ တကယ့် param values တွေကို မသိဘူးဆိုရင် — validation အတွက် placeholder param တစ်ခု (ဥပမာ `[{ slug: '__placeholder__' }]`) ပြန်ပေးပြီး သင့် page ထဲမှာ [`notFound()`](/docs/nextjs/not-found) နဲ့ ကိုင်တွယ်နိုင်ပါတယ်။ ဒါပေမယ့် ဒါက build time validation ကို ထိရောက်မှု မရှိအောင် လုပ်ပြီး — runtime errors တွေ ဖြစ်စေနိုင်တာ သတိပြုပါ။

အသေးစိတ် walkthroughs တွေအတွက် [dynamic routes section](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#with-cache-components) ကို ကြည့်ပါ — (သို့) routes အစုအဝေးတစ်ခုကို prerender လုပ်ပြီး ကျန်တာတွေအတွက် App Shells တွေ ပေးဖို့ [ISR with Cache Components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components) ကို ကြည့်ပါ။

### Route Handlers နဲ့အတူ

API responses တွေကို build time မှာ statically generate လုပ်ဖို့ — [Route Handlers](/docs/nextjs/route-handlers) တွေနဲ့လည်း `generateStaticParams` ကို သုံးနိုင်ပါတယ်:

```ts
// app/api/posts/[id]/route.ts
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

export async function GET(
  request: Request,
  { params }: RouteContext<'/api/posts/[id]'>
) {
  const { id } = await params
  // ID 1, 2, 3 တွေအတွက် statically generate လုပ်ပါလိမ့်မယ်
  return Response.json({ id, title: `Post ${id}` })
}
```

[Cache Components](/docs/nextjs/caching) သုံးတဲ့အခါ — အကောင်းဆုံး caching အတွက် `use cache` နဲ့ ပေါင်းသုံးပါ။ [Route Handlers documentation](https://nextjs.org/docs/app/api-reference/file-conventions/route#static-generation-with-generatestaticparams) မှာ အသေးစိတ် ကြည့်ပါ။

### သတ်မှတ်မထားတဲ့ (unspecified) paths တွေအတွက် rendering ပိတ်ခြင်း

သတ်မှတ်မထားတဲ့ paths တွေကို runtime မှာ prerender မလုပ်စေချင်ရင် — route segment တစ်ခုထဲမှာ `export const dynamicParams = false` option ကို ထည့်ပါ။ ဒီ config option သုံးထားတဲ့အခါ — `generateStaticParams` က ပေးထားတဲ့ paths တွေကိုပဲ ဆာဗာ (serve) လုပ်ပြီး — သတ်မှတ်မထားတဲ့ routes တွေက [catch-all routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#catch-all-segments) တွေရဲ့ ကိစ္စမှာ 404 (သို့) match ဖြစ်ပါတယ်။ (ဥပမာအပြည့်အစုံကို အပေါ်က Paths အစုအဝေး (subset) build time မှာ ကဏ္ဍမှာ ကြည့်ပါ။)

### Multiple Dynamic Segments in a Route

လက်ရှိ layout (သို့) page ရဲ့ **အပေါ်က** (above) dynamic segments တွေအတွက် params တွေ ထုတ်လုပ်နိုင်ပေမယ့် — **အောက်က** (below) segments တွေအတွက်တော့ မရပါဘူး။ ဥပမာ — `app/products/[category]/[product]` route အတွက်:

- `app/products/[category]/[product]/page.js` က `[category]` ရော `[product]` ရော **နှစ်ခုလုံးအတွက်** params တွေ ထုတ်လုပ်နိုင်ပါတယ်။
- `app/products/[category]/layout.js` က `[category]` အတွက်ပဲ params တွေ ထုတ်လုပ်နိုင်ပါတယ်။

Dynamic segments အများအပြား ပါတဲ့ route တစ်ခုအတွက် params တွေ ထုတ်လုပ်ဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:

#### Params တွေကို အောက်ကနေ အပေါ် (bottom up) ထုတ်လုပ်ခြင်း

Child route segment ကနေ dynamic segments အများအပြားကို တစ်ပြိုင်တည်း ထုတ်လုပ်ပါ — အပေါ်က Dynamic segments အများအပြား (Multiple Dynamic Segments) ဥပမာက ဒီပုံစံပဲ ဖြစ်ပါတယ်။

#### Params တွေကို အပေါ်ကနေ အောက် (top down) ထုတ်လုပ်ခြင်း

Parent segments တွေကို အရင် ထုတ်လုပ်ပြီး — ရလဒ်ကို သုံးပြီး child segments တွေကို ထုတ်လုပ်ပါ။

```tsx
// app/products/[category]/layout.tsx
// [category] အတွက် segments တွေ ထုတ်လုပ်ပါ
export async function generateStaticParams() {
  const products = await fetch('https://.../products').then((res) => res.json())

  return products.map((product) => ({
    category: product.category.slug,
  }))
}

export default function Layout({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  // ...
}
```

Child route segment ရဲ့ `generateStaticParams` function ကို — parent `generateStaticParams` က ထုတ်လုပ်ပေးတဲ့ segment တစ်ခုစီအတွက် တစ်ကြိမ်စီ execute လုပ်ပါတယ်။

Child `generateStaticParams` function က parent `generateStaticParams` ကနေ ပြန်လာတဲ့ `params` တွေကို သုံးပြီး — ကိုယ်ပိုင် segments တွေကို dynamically ထုတ်လုပ်နိုင်ပါတယ်:

```tsx
// app/products/[category]/[product]/page.tsx
// Parent segment ရဲ့ `generateStaticParams` function ကနေ ပို့လာတဲ့
// `params` တွေကို သုံးပြီး [product] အတွက် segments တွေ ထုတ်လုပ်ပါ
export async function generateStaticParams({
  params: { category },
}: {
  params: { category: string }
}) {
  const products = await fetch(
    `https://.../products?category=${category}`
  ).then((res) => res.json())

  return products.map((product) => ({
    product: product.id,
  }))
}

export default function Page({
  params,
}: {
  params: Promise<{ category: string; product: string }>
}) {
  // ...
}
```

`params` argument ကို synchronously (await မလုပ်ဘဲ) ဝင်ရောက်နိုင်ပြီး — parent segment ရဲ့ params တွေပဲ ပါဝင်တာ သတိပြုပါ။

> **သိထားသင့်သည်:** Parent dynamic segment တစ်ခုက [root parameter](https://nextjs.org/docs/app/api-reference/functions/next-root-params) တစ်ခုဖြစ်နေရင် — nested `generateStaticParams` တစ်ခုအတွင်းကနေ `next/root-params` module ရဲ့ getter ကို ခေါ်ပြီး ၎င်းကို ဖတ်နိုင်ပါတယ်။

Type completion အတွက် — [`Page Props helper`](https://nextjs.org/docs/app/api-reference/file-conventions/page#page-props-helper) (သို့) [`Layout Props helper`](https://nextjs.org/docs/app/api-reference/file-conventions/layout#layout-props-helper) တွေနဲ့ တွဲပြီး TypeScript ရဲ့ `Awaited` helper ကို သုံးနိုင်ပါတယ်:

```ts
// app/products/[category]/[product]/page.tsx
export async function generateStaticParams({
  params: { category },
}: {
  params: Awaited<LayoutProps<'/products/[category]'>['params']>
}) {
  const products = await fetch(
    `https://.../products?category=${category}`
  ).then((res) => res.json())

  return products.map((product) => ({
    product: product.id,
  }))
}
```

> **သိထားသင့်သည်:** `fetch` requests တွေက `generate`-prefixed functions, Layouts, Pages နဲ့ Server Components တွေအားလုံးမှာ တူညီတဲ့ data အတွက် အလိုအလျောက် [memoized](https://nextjs.org/docs/app/glossary#memoization) လုပ်ပေးပါတယ်။ `fetch` မရနိုင်တဲ့နေရာမှာတော့ React [cache](https://react.dev/reference/react/cache) ကို သုံးနိုင်ပါတယ်။

## Version History

| Version   | အပြောင်းအလဲ                    |
| --------- | ----------------------------- |
| `v13.0.0` | `generateStaticParams` စတင် မိတ်ဆက် |
