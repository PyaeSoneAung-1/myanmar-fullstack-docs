---
title: "page.js (Route ရဲ့ Page)"
description: "page.js file convention — route တစ်ခုအတွက် သီးသန့် UI သတ်မှတ်ပေးတဲ့ file; params နဲ့ searchParams props, PageProps helper အကြောင်း"
order: 26
source: "https://nextjs.org/docs/app/api-reference/file-conventions/page"
status: translated
updated: 2026-09-02
---

`page` file က route တစ်ခုအတွက် **သီးသန့် (unique)** UI ကို သတ်မှတ်ပေးပါတယ်။ File ကနေ component တစ်ခုကို default export လုပ်ရုံနဲ့ page တစ်ခု ဖန်တီးပြီးသား ဖြစ်သွားပါတယ်:

```tsx
// app/blog/[slug]/page.tsx
export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return <h1>My Page</h1>
}
```

## သိထားသင့်တာများ (Good to know)

- `page` file အတွက် `.js`, `.jsx` (သို့) `.tsx` extension တွေ သုံးလို့ရပါတယ်။
- `page` က route subtree ရဲ့ အမြဲတမ်း **leaf (အဆုံးထွက် အစိတ်အပိုင်း)** ဖြစ်ပါတယ်။
- Route segment တစ်ခု **publicly accessible (အများပြည်သူ ဝင်ရောက်နိုင်)** ဖြစ်ဖို့ `page` file မဖြစ်မနေ လိုအပ်ပါတယ်။
- Pages တွေက ပုံမှန် default အနေနဲ့ [Server Components](https://react.dev/reference/rsc/server-components) တွေ ဖြစ်ပြီး — [Client Component](https://react.dev/reference/rsc/use-client) အဖြစ်လည်း ပြောင်းလို့ရပါတယ်။
- [Component hierarchy](/docs/nextjs/project-structure) ထဲမှာ `page.js` က အထဲဆုံး file convention ဖြစ်ပြီး — တူညီတဲ့ segment ထဲက `loading.js` (Suspense boundary), `error.js` (error boundary), `template.js` နဲ့ `layout.js` တွေရဲ့ အတွင်းမှာ wrap ခံထားရပါတယ်။

## Reference

### Props

#### `params` (optional)

`params` က promise တစ်ခု ဖြစ်ပြီး — root segment ကနေ အဲဒီ page အထိ [dynamic route parameters](/docs/nextjs/dynamic-routes) တွေ ပါဝင်တဲ့ object တစ်ခုကို resolve လုပ်ပေးပါတယ်။

```tsx
// app/shop/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
}
```

| ဥပမာ Route | URL | `params` |
|---|---|---|
| `app/shop/[slug]/page.js` | `/shop/1` | `Promise<{ slug: '1' }>` |
| `app/shop/[category]/[item]/page.js` | `/shop/1/2` | `Promise<{ category: '1', item: '2' }>` |
| `app/shop/[...slug]/page.js` | `/shop/1/2` | `Promise<{ slug: ['1', '2'] }>` |

- `params` prop က promise ဖြစ်လို့ — တန်ဖိုးတွေ ဖတ်ဖို့ `async/await` (သို့) React ရဲ့ [`use`](https://react.dev/reference/react/use) function ကို သုံးရပါတယ်။
  - Version 14 နဲ့ အစောပိုင်းတွေမှာ `params` က synchronous prop ဖြစ်ခဲ့ပါတယ်။ Backwards compatibility (နောက်ပြန် လိုက်ဖက်မှု) အတွက် Next.js 15 မှာ synchronous အနေနဲ့လည်း ဆက်ဖတ်လို့ရသေးပေမယ့် — ဒီအပြုအမူက နောင်မှာ deprecated (ဖျက်သိမ်းမယ့်) ဖြစ်တော့မှာပါ။

#### `searchParams` (optional)

`searchParams` က promise တစ်ခု ဖြစ်ပြီး — current URL ရဲ့ [search parameters](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#parameters) (query string ထဲက ကန့်သတ်ချက်များ) ပါဝင်တဲ့ object တစ်ခုကို resolve လုပ်ပေးပါတယ်။ ဥပမာ:

```tsx
// app/shop/page.tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}
```

Client Component **pages** တွေကလည်း React ရဲ့ [`use`](https://react.dev/reference/react/use) hook ကို သုံးပြီး `searchParams` ကို ဝင်ရောက်ဖတ်လို့ရပါတယ်:

```tsx
// app/shop/page.tsx
'use client'
import { use } from 'react'

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = use(searchParams).filters
}
```

| ဥပမာ URL | `searchParams` |
|---|---|
| `/shop?a=1` | `Promise<{ a: '1' }>` |
| `/shop?a=1&b=2` | `Promise<{ a: '1', b: '2' }>` |
| `/shop?a=1&a=2` | `Promise<{ a: ['1', '2'] }>` |

- `searchParams` prop ကလည်း promise ဖြစ်လို့ — တန်ဖိုးတွေ ဖတ်ဖို့ `async/await` (သို့) React ရဲ့ [`use`](https://react.dev/reference/react/use) function ကို သုံးရပါတယ်။
  - Version 14 နဲ့ အစောပိုင်းတွေမှာ `searchParams` က synchronous prop ဖြစ်ခဲ့ပါတယ်။ Backwards compatibility အတွက် Next.js 15 မှာ synchronous အနေနဲ့လည်း ဆက်ဖတ်လို့ရသေးပေမယ့် — ဒီအပြုအမူက နောင်မှာ deprecated ဖြစ်တော့မှာပါ။
- `searchParams` က **[Request-time API](https://nextjs.org/docs/app/glossary#request-time-apis)** တစ်ခု ဖြစ်ပြီး — တန်ဖိုးတွေကို ကြိုတင် မသိနိုင်ပါဘူး။ ဒါကို သုံးလိုက်တာနဲ့ page က request အချိန်မှာ **[dynamic rendering](https://nextjs.org/docs/app/glossary#dynamic-rendering)** (တစ်ခါ request တိုင်း ပြန် render လုပ်ခြင်း) ဘက်ကို ရောက်သွားပါတယ်။
- [Cache Components](/docs/nextjs/caching) သုံးထားရင် — component tree ထဲက ဘယ်နေရာမှာ `searchParams` ကို ဝင်ရောက်ဖတ်လဲဆိုတာက page ရဲ့ ဘယ်လောက်ကို ကြိုတင် render (prerender) လုပ်နိုင်မလဲ ဆုံးဖြတ်ပေးပါတယ်။ Static shell ကို အများဆုံး အသုံးချနည်း အတွက် caching guide ထဲက Maximizing the static shell section ကို ကြည့်ပါ။
- `searchParams` က သာမန် JavaScript object တစ်ခုပါ — `URLSearchParams` instance မဟုတ်ပါဘူး။

### Page Props Helper

Page တွေကို `PageProps` နဲ့ type လုပ်ပြီး — route literal (route path စာသား) ကနေ strongly typed `params` နဲ့ `searchParams` တွေ ရယူနိုင်ပါတယ်။ `PageProps` က global အနေနဲ့ နေရာတိုင်းမှာ ရနိုင်တဲ့ helper တစ်ခုပါ။

```tsx
// app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
  return <h1>Blog Post: {slug}</h1>
}
```

> **သိထားသင့်သည်:**
>
> - Route literal (ဥပမာ `'/blog/[slug]'`) ကို သုံးထားရင် `params` အတွက် autocomplete နဲ့ တိကျတဲ့ keys တွေ ရပါတယ်။
> - Static routes တွေက `params` ကို `{}` အဖြစ် resolve လုပ်ပေးပါတယ်။
> - Types တွေကို `next dev`, `next build` (သို့) `next typegen` လုပ်ချိန်မှာ generate လုပ်ပါတယ်။
> - Type generation ပြီးရင် `PageProps` helper က global အနေနဲ့ ရနေပြီဖြစ်လို့ — import လုပ်စရာ မလိုပါဘူး။

## ဥပမာများ

### `params` ပေါ်မူတည်ပြီး content ပြသခြင်း

[dynamic route segments](/docs/nextjs/dynamic-routes) တွေကို သုံးပြီး — `params` prop ပေါ်မူတည်ကာ အဲဒီ page အတွက် သီးသန့် content တွေကို ပြသ (သို့) data fetch လုပ်နိုင်ပါတယ်။

```tsx
// app/blog/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>Blog Post: {slug}</h1>
}
```

### `searchParams` နဲ့ filtering ကိုင်တွယ်ခြင်း

URL ရဲ့ query string ပေါ်မူတည်ပြီး filtering, pagination (စာမျက်နှာ ခွဲခြင်း) (သို့) sorting တွေကို `searchParams` prop နဲ့ ကိုင်တွယ်နိုင်ပါတယ်။

```tsx
// app/shop/page.tsx
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { page = '1', sort = 'asc', query = '' } = await searchParams

  return (
    <div>
      <h1>Product Listing</h1>
      <p>Search query: {query}</p>
      <p>Current page: {page}</p>
      <p>Sort order: {sort}</p>
    </div>
  )
}
```

### Client Components တွေမှာ `searchParams` နဲ့ `params` ဖတ်ခြင်း

Client Component (ထဲမှာ `async` မလုပ်နိုင်) တစ်ခုမှာ `searchParams` နဲ့ `params` တွေကို သုံးချင်ရင် — React ရဲ့ [`use`](https://react.dev/reference/react/use) function နဲ့ promise ကို ဖတ်နိုင်ပါတယ်:

```tsx
// app/page.tsx
'use client'

import { use } from 'react'

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = use(params)
  const { query } = use(searchParams)
}
```

## Version History

| Version | အပြောင်းအလဲ |
|---|---|
| `v15.0.0-RC` | `params` နဲ့ `searchParams` တွေကို promises အဖြစ် ပြောင်းလိုက်ပါတယ်။ [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#150) ရနိုင်ပါတယ်။ |
| `v13.0.0` | `page` စတင် မိတ်ဆက်။ |

## နောက်တစ်ဆင့်တွေ

- [Pages & Layouts](/docs/nextjs/pages-layouts) — page နဲ့ layout တွေ ဘယ်လို တွဲဖက်အလုပ်လုပ်လဲ
- [Dynamic Routes](/docs/nextjs/dynamic-routes) — dynamic segments နဲ့ `params` တွေအကြောင်း
- [Linking & Navigation](/docs/nextjs/linking) — app ထဲမှာ လမ်းကြောင်း ပြောင်းလဲခြင်း
