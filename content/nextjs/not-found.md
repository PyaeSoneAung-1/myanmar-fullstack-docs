---
title: "not-found.js (NotFound စာမျက်နှာ)"
description: "not-found.js file convention — notFound() ခေါ်လိုက်ရင် ပြမယ့် custom 404 UI, root app/not-found.js နဲ့ experimental global-not-found.js တို့အကြောင်း"
order: 23
source: "https://nextjs.org/docs/app/api-reference/file-conventions/not-found"
status: translated
updated: 2026-09-02
---

Next.js မှာ not found ကိစ္စတွေကို ကိုင်တွယ်ဖို့ convention နှစ်မျိုး ရှိပါတယ်:

- **`not-found.js`** — route segment တစ်ခုအတွင်းမှာ [`notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found) function ကို ခေါ်လိုက်တဲ့အခါ သုံးပါတယ်။
- **`global-not-found.js`** (experimental) — app တစ်ခုလုံးမှာ ဘယ် route နဲ့မှ မကိုက်ညီတဲ့ URLs တွေအတွက် global 404 page ကို သတ်မှတ်ပါတယ်။ ဒါက routing level မှာ ကိုင်တွယ်တာမို့ layout (သို့) page တစ်ခုခုကို render လုပ်တာပေါ်မှာ မမူတည်ပါဘူး။

## not-found.js

**not-found** file က route segment တစ်ခုအတွင်းမှာ [`notFound()`](https://nextjs.org/docs/app/api-reference/functions/not-found) function ကို ခေါ်လိုက်တဲ့အခါ render လုပ်မယ့် UI ကို သတ်မှတ်ပါတယ်။ Custom UI ပြသပေးတာအပြင် — Next.js က streamed responses တွေအတွက် `200` HTTP status code ကို ပြန်ပြီး non-streamed responses တွေအတွက် `404` ကို ပြန်ပေးပါတယ်။

Route folder တစ်ခုထဲမှာ `not-found.js` file ထည့်ပြီး — React component တစ်ခုကို default export လုပ်ပါ:

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  )
}
```

[Component hierarchy](/docs/nextjs/project-structure) အရ — `not-found.js` က `loading.js` နဲ့ `page.js` ကြားမှာ render လုပ်ပြီး၊ တူညီတဲ့ segment ထဲက `loading.js` ရဲ့ `<Suspense>` boundary နဲ့ `error.js` ရဲ့ error boundary အတွင်းမှာ wrap ခံထားရပါတယ်။

> **Good to know:** Default not found UI က operating system ရဲ့ color scheme (`prefers-color-scheme`) အတိုင်း လိုက်ပါပြီး — app အဆင့်က theme (ဥပမာ `<html>` ပေါ်က class (သို့) `data-theme` attribute) ကို မဖတ်ပါဘူး။ Root layout အတွင်းမှာ render လုပ်တာမို့ — theme နဲ့ ကိုက်အောင် ချင်ရင် global stylesheet ထဲမှာ `html[data-theme='light'] body` လို higher-specificity rules တွဲထည့်နိုင်ပြီး markup အပြည့်အဝ ထိန်းချုပ်ချင်ရင်တော့ ကိုယ်ပိုင် `not-found.js` ရေးပါ။

`not-found.js` က [special file conventions](/docs/nextjs/project-structure) တစ်ခုမို့ — app folder ရဲ့ ဘယ် route segment မှာမဆို ထည့်လို့ရပါတယ်။ ဒါကြောင့် 404 UI ကို granular ဖြစ်အောင် ထိန်းချုပ်နိုင်ပါတယ် — segment တစ်ခုချင်းစီအတွက် သီးခြား `not-found.js` ထည့်ထားနိုင်ပြီး အဲဒီ segment တွေရဲ့ အောက်မှာ `notFound()` ခေါ်လိုက်တဲ့အခါ သင့်တော်တဲ့ not-found UI တွေ ပြသနိုင်ပါတယ်။ Root `app/not-found.js` တစ်ခုတည်း ထားထားရင်တော့ — app တစ်ခုလုံးက not found UI တွေအတွက် ပုံမှန် fallback ဖြစ်ပြီး root layout ရဲ့ အတွင်းမှာ render ဖြစ်လို့ header/footer စတဲ့ shared UI တွေနဲ့အတူ တသမတ်တည်း ပေါ်ပါတယ်။

### notFound() function ကို ဘယ်အချိန် ခေါ်မလဲ

Data fetch လုပ်ပြီး resource (ဥပမာ blog post တစ်ပုဒ်) မတွေ့တဲ့အခါ — page (သို့) layout တစ်ခုအတွင်းကနေ `notFound()` ကို ခေါ်နိုင်ပါတယ်။ ဒါက အနီးဆုံး `not-found.js` UI ကို render လုပ်ပေးပါတယ်:

```tsx
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <div>{post.title}</div>
}
```

[`notFound()`](https://nextjs.org/docs/app/api-reference/functions/not-found) function ရဲ့ အလုပ်လုပ်ပုံ အသေးစိတ်ကို သိထားဖို့ အရေးကြီးပါတယ် — သူက error တစ်ခုကို throw လုပ်ပြီး Next.js 404 page ကို render လုပ်စေပါတယ်။ ဒါကြောင့်:

- `notFound()` ကို **render path** ထဲမှာ ခေါ်ရပါတယ် — component တစ်ခုထဲ (သို့) component က `await` လုပ်တဲ့ function တစ်ခုထဲမှာပါ။ Un-awaited promise တစ်ခုထဲမှာ ချန်ထားခဲ့ရင် error က ဘယ်မှ မဖမ်းနိုင်တော့ဘဲ not-found UI လည်း render မဖြစ်ပါဘူး။
- သူ throw လုပ်လိုက်တာနဲ့ — အဲဒီ route segment ရဲ့ rendering ကို ရပ်လိုက်ပြီး page ကို search engines တွေ index မလုပ်အောင် `<meta name="robots" content="noindex" />` tag ကိုလည်း အလိုအလျောက် ထည့်ပေးပါတယ်။
- `notFound()` ကို [Server Components](/docs/nextjs/server-client-components), Server Functions (ဥပမာ form action) နဲ့ [Route Handlers](/docs/nextjs/route-handlers) တွေထဲကနေ ခေါ်လို့ရပါတယ်။

## global-not-found.js (experimental)

`global-not-found.js` file က application တစ်ခုလုံးအတွက် 404 page ကို သတ်မှတ်ပေးပါတယ်။ Route level မှာ အလုပ်လုပ်တဲ့ `not-found.js` နဲ့ မတူဘဲ — ဒါက requested URL က ဘယ် route နဲ့မှ မကိုက်ညီတဲ့အခါ သုံးပါတယ်။ Next.js က ပုံမှန် rendering ကို **ကျော်လိုက်ပြီး** ဒီ global page ကို တိုက်ရိုက် ပြန်ပေးပါတယ်။

`global-not-found.js` က app ရဲ့ ပုံမှန် rendering ကို bypass လုပ်လို့ — ဒီ 404 page လိုအပ်တဲ့ global styles, fonts (သို့) အခြား dependencies တွေကို ဒီ file ထဲမှာ ကိုယ်တိုင် import လုပ်ပေးရပါတယ်။ Theme လည်း ပါဝင်ပါတယ် — layout ကို bypass လုပ်လို့ default UI က OS color scheme ကိုပဲ မြင်ရတာမို့ theme (class (သို့) attribute) ကို ဒီ file အတွင်းမှာ သက်ရောက်ပေးပါ။ ဒီ page ရဲ့ performance အတွက် global styles ရဲ့ အသေးစားဗားရှင်းနဲ့ ပိုရိုးရှင်းတဲ့ font family ကို သုံးတာ ပိုကောင်းပါတယ်။

`global-not-found.js` က ဘယ်အချိန်မှာ အသုံးဝင်လဲဆိုရင် — `layout.js` နဲ့ `not-found.js` ပေါင်းစပ်ပြီး 404 page တည်ဆောက်လို့ မရတဲ့ အခြေအနေတွေမှာပါ:

- App မှာ root layouts အများအပြား ရှိနေရင် (ဥပမာ `app/(admin)/layout.tsx` နဲ့ `app/(shop)/layout.tsx`) — global 404 တစ်ခုကို စုစည်းဖို့ layout တစ်ခုတည်း မရှိလို့ပါ။
- Root layout ကို top-level dynamic segments တွေနဲ့ သတ်မှတ်ထားရင် (ဥပမာ `app/[country]/layout.tsx`) — တစ်သမတ်တည်း 404 page စုစည်းဖို့ ခက်ခဲလို့ပါ။

ဖွင့်ဖို့ — `next.config.ts` ထဲမှာ `globalNotFound` flag ထည့်ပါ:

```tsx
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
}

export default nextConfig
```

ပြီးတော့ `app` directory ရဲ့ root မှာ file ဖန်တီးပါ — `app/global-not-found.js`:

```tsx
// Import global styles and fonts
import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>This page does not exist.</p>
      </body>
    </html>
  )
}
```

`not-found.js` နဲ့ မတူတဲ့ အချက်က — ဒီ file က `<html>` နဲ့ `<body>` tags တွေ ပါဝင်တဲ့ **full HTML document** ကို return လုပ်ပေးရပါတယ်။

> **Good to know:** Expected `notFound()` errors တွေကို ဖမ်းတာအပြင် — root `app/not-found.js` နဲ့ `app/global-not-found.js` files တွေက app တစ်ခုလုံးအတွက် ဘယ် route နဲ့မှ မကိုက်ညီတဲ့ URLs တွေကိုပါ ကိုင်တွယ်ပေးပါတယ်။ ဒါကြောင့် app က မကိုင်တွယ်တဲ့ URL တစ်ခုကို user ဝင်ကြည့်ရင် — ဒီ files တွေကနေ export လုပ်ထားတဲ့ UI ကို ပြသပါလိမ့်မယ်။

## Reference — Props

`not-found.js` (သို့) `global-not-found.js` components တွေက props ဘာမှ လက်ခံပါဘူး။

## ဥပမာများ

### Data Fetching

Default အနေနဲ့ `not-found` က Server Component ဖြစ်ပါတယ် — `async` လုပ်ပြီး data fetch လုပ်ကာ ပြသနိုင်ပါတယ်:

```tsx
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NotFound() {
  const headersList = await headers()
  const domain = headersList.get('host')
  const data = await getSiteData(domain)
  return (
    <div>
      <h2>Not Found: {data.name}</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/blog">all posts</Link>
      </p>
    </div>
  )
}
```

ဒီလိုနေရာမှာ `usePathname` လို Client Component hooks တွေ သုံးပြီး path ပေါ်မူတည်ပြီး content ပြချင်ရင်တော့ — data တွေကို client-side မှာ fetch လုပ်ရပါမယ်။

### Metadata

`global-not-found.js` အတွက် — `metadata` object (သို့) [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) function ကို export လုပ်ပြီး 404 page ရဲ့ `<title>`, `<meta>` စတဲ့ head tags တွေကို စိတ်ကြိုက် ပြင်နိုင်ပါတယ်:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div>
          <h1>Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </body>
    </html>
  )
}
```

> **Good to know:** Next.js က 404 status code ပြန်တဲ့ pages တွေအတွက် `<meta name="robots" content="noindex" />` ကို အလိုအလျောက် ထည့်ပေးပါတယ် — `global-not-found.js` pages တွေ အပါအဝင်ပါ။

## Version History

| Version | အပြောင်းအလဲ |
|---|---|
| `v15.4.0` | `global-not-found.js` စတင် မိတ်ဆက် (experimental) |
| `v13.3.0` | Root `app/not-found` က global unmatched URLs တွေကို ကိုင်တွယ်လာ |
| `v13.0.0` | `not-found` စတင် မိတ်ဆက် |

## နောက်တစ်ဆင့်တွေ

- [Error Handling](/docs/nextjs/error-handling) — expected errors နဲ့ uncaught exceptions တွေ ကိုင်တွယ်ခြင်း
- [Dynamic Routes](/docs/nextjs/dynamic-routes) — params တွေနဲ့ notFound() ပေါင်းသုံးခြင်း
- [Project Structure](/docs/nextjs/project-structure) — component hierarchy အသေးစိတ်
