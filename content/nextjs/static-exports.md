---
title: "Static Exports"
description: "Next.js application ကို static site (သို့) Single-Page Application (SPA) အဖြစ် စတင်ပြီး static export ဖန်တီးခြင်း — output: 'export', Server/Client Components, Route Handlers, Image Optimization, unsupported features နဲ့ deploy လုပ်နည်း"
order: 18
source: "https://nextjs.org/docs/app/guides/static-exports"
status: translated
updated: 2026-09-01
---

Next.js က static site (သို့) Single-Page Application (SPA) အဖြစ် စတင်နိုင်ပြီး — နောက်ပိုင်းမှာ server လိုအပ်တဲ့ features တွေကို သုံးဖို့ optionally upgrade လုပ်နိုင်ပါတယ်။

`next build` run လုပ်တဲ့အခါ — Next.js က route တစ်ခုချင်းစီအတွက် HTML file တစ်ခုစီ ထုတ်ပေးပါတယ်။ SPA တစ်ခုကို HTML file တစ်ခုချင်းစီအဖြစ် ခွဲလိုက်ခြင်းအားဖြင့် — Next.js က client-side မှာ မလိုအပ်တဲ့ JavaScript code တွေ load လုပ်တာကို ရှောင်ရှားနိုင်ပြီး — bundle size ကို လျှော့ချကာ page loads တွေ ပိုမြန်စေပါတယ်။

Next.js က ဒီ static export ကို support လုပ်လို့ — HTML/CSS/JS static assets တွေကို ပေးနိုင်တဲ့ web server မဆီ deploy လုပ်ပြီး host လုပ်နိုင်ပါတယ်။

## Configuration (ပြင်ဆင်သတ်မှတ်ခြင်း)

Static export တစ်ခု enable လုပ်ဖို့ — `next.config.js` ထဲမှာ output mode ကို ပြောင်းပါ:

```js
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',

  // Optional: Links တွေကို `/me` -> `/me/` ပြောင်းပြီး `/me.html` -> `/me/index.html` ထုတ်ပေးပါ
  // trailingSlash: true,

  // Optional: အလိုအလျောက် `/me` -> `/me/` ပြောင်းတာကို တားပြီး `href` ကို မူလအတိုင်း ထားပါ
  // skipTrailingSlashRedirect: true,

  // Optional: Output directory ကို `out` -> `dist` ပြောင်းပါ
  // distDir: 'dist',
}

module.exports = nextConfig
```

`next build` run လုပ်ပြီးတဲ့နောက် — Next.js က သင့် application ရဲ့ HTML/CSS/JS assets တွေနဲ့ `out` folder တစ်ခုကို ဖန်တီးပါလိမ့်မယ်။

## Supported Features (ပံ့ပိုးပေးသော လုပ်ဆောင်ချက်များ)

Next.js ရဲ့ core ကို static exports တွေကို support လုပ်ဖို့ ဒီဇိုင်းလုပ်ထားပါတယ်။

### Server Components

Static export တစ်ခု generate လုပ်ဖို့ `next build` run လုပ်တဲ့အခါ — `app` directory ထဲမှာ သုံးထားတဲ့ Server Components တွေက traditional static-site generation လိုပဲ — build ကာလအတွင်းမှာ run လုပ်ပါလိမ့်မယ်။

ရလဒ် component ကို ကနဦး page load အတွက် static HTML အဖြစ် ရော — routes တွေကြားမှာ client navigation အတွက် static payload အဖြစ်ပါ render လုပ်ပါတယ်။ သူတို့က [dynamic server functions](#unsupported-features) တွေကို သုံးမထားဘူးဆိုရင် — static export သုံးတဲ့အခါ သင့် Server Components တွေအတွက် ပြောင်းလဲစရာ ဘာမှ မလိုပါဘူး။

```tsx
export default async function Page() {
  // ဒီ fetch က `next build` ကာလအတွင်း server ပေါ်မှာ run လုပ်ပါမယ်
  const res = await fetch('https://api.example.com/...')
  const data = await res.json()

  return <main>...</main>
}
```

### Client Components

Client ပေါ်မှာ data fetching လုပ်ချင်ရင် — requests တွေကို memoize လုပ်ဖို့ [SWR](https://github.com/vercel/swr) နဲ့ Client Component တစ်ခုကို သုံးနိုင်ပါတယ်။

```tsx
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Page() {
  const { data, error } = useSWR(
    `https://jsonplaceholder.typicode.com/posts/1`,
    fetcher
  )
  if (error) return 'Failed to load'
  if (!data) return 'Loading...'

  return data.title
}
```

Route transitions တွေက client-side မှာ ဖြစ်လို့ — ဒါက traditional SPA တစ်ခုလို ပြုမူပါတယ်။ ဥပမာ — အောက်ပါ index route က client ပေါ်မှာ posts အမျိုးမျိုးဆီ navigate လုပ်နိုင်စေပါတယ်:

```tsx
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <h1>Index Page</h1>
      <hr />
      <ul>
        <li>
          <Link href="/post/1">Post 1</Link>
        </li>
        <li>
          <Link href="/post/2">Post 2</Link>
        </li>
      </ul>
    </>
  )
}
```

### Image Optimization (ပုံ optimize လုပ်ခြင်း)

`next/image` ကနေ [Image Optimization](/docs/nextjs/image) ကို — `next.config.js` ထဲမှာ custom image loader တစ်ခု သတ်မှတ်ပြီး static export တစ်ခုနဲ့တွဲ သုံးနိုင်ပါတယ်။ ဥပမာ — Cloudinary လို service တစ်ခုနဲ့ images တွေကို optimize လုပ်နိုင်ပါတယ်:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './my-loader.ts',
  },
}

module.exports = nextConfig
```

ဒီ custom loader က remote source တစ်ခုကနေ images တွေကို ဘယ်လို fetch လုပ်မလဲဆိုတာ သတ်မှတ်ပေးပါတယ်။ ဥပမာ — အောက်ပါ loader က Cloudinary အတွက် URL ကို တည်ဆောက်ပေးပါလိမ့်မယ်:

```ts
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://res.cloudinary.com/demo/image/upload/${params.join(
    ','
  )}${src}`
}
```

ပြီးတော့ — သင့် application ထဲမှာ `next/image` ကို သုံးပြီး Cloudinary ထဲက image ဆီ relative paths တွေ သတ်မှတ်နိုင်ပါတယ်:

```tsx
import Image from 'next/image'

export default function Page() {
  return <Image alt="turtles" src="/turtles.jpg" width={300} height={300} />
}
```

### Route Handlers

Route Handlers တွေက `next build` run လုပ်တဲ့အခါ static response တစ်ခုကို render လုပ်ပါလိမ့်မယ်။ `GET` HTTP verb တစ်ခုတည်းကိုပဲ support လုပ်ပါတယ်။ ဒါက cached (သို့) uncached data တွေကနေ static HTML, JSON, TXT (သို့) တခြား files တွေ generate လုပ်ဖို့ သုံးနိုင်ပါတယ်။ Route Handlers တွေ prerender ဖြစ်ဖို့ သေချာစေဖို့ — static export enable လုပ်ထားတဲ့အခါ `export const dynamic = 'force-static'` ထည့်ပြီး handler ကို static အဖြစ် ရှင်းရှင်းလင်းလင်း မှတ်သားရပါမယ်။ ဥပမာ:

```ts
export const dynamic = 'force-static'

export async function GET() {
  return Response.json({ name: 'Lee' })
}
```

အပေါ်က `app/data.json/route.ts` file က `next build` ကာလအတွင်း static file တစ်ခုအဖြစ် render လုပ်ပြီး — `{ name: 'Lee' }` ပါတဲ့ `data.json` ကို ထုတ်ပေးပါလိမ့်မယ်။

Incoming request ကနေ dynamic values တွေ ဖတ်ဖို့ လိုအပ်ရင် — static export ကို သုံးလို့ မရပါဘူး။

### Browser APIs များ

Client Components တွေကို `next build` ကာလအတွင်း HTML အဖြစ် prerender လုပ်ပါတယ်။ `window`, `localStorage` နဲ့ `navigator` လို [Web APIs](https://developer.mozilla.org/docs/Web/API) တွေက server ပေါ်မှာ မရှိလို့ — ဒီ APIs တွေကို browser မှာပဲ run လုပ်နေချိန်မှာသာ ဘေးကင်းစွာ ဝင်ရောက်သုံးဖို့ လိုပါတယ်။ ဥပမာ:

```jsx
'use client';

import { useEffect } from 'react';

export default function ClientComponent() {
  useEffect(() => {
    // အခု `window` ကို ဝင်ရောက်သုံးနိုင်ပါပြီ
    console.log(window.innerHeight);
  }, [])

  return ...;
}
```

## Unsupported Features (ပံ့ပိုးမပေးသော လုပ်ဆောင်ချက်များ)

Node.js server တစ်ခု လိုအပ်တဲ့ (သို့) build process ကာလအတွင်း တွက်ချက်လို့ မရတဲ့ dynamic logic လိုအပ်တဲ့ features တွေကို **support မလုပ်ပါဘူး**:

- `dynamicParams: true` နဲ့ [Dynamic Routes](/docs/nextjs/dynamic-routes)
- `generateStaticParams()` မပါတဲ့ [Dynamic Routes](/docs/nextjs/dynamic-routes)
- Request ပေါ် မှီခိုတဲ့ [Route Handlers](/docs/nextjs/route-handlers)
- [Cookies](/docs/nextjs/cookies)
- [Rewrites](/docs/nextjs/rewrites)
- [Redirects](/docs/nextjs/redirects)
- [Headers](/docs/nextjs/headers)
- [Proxy](/docs/nextjs/proxy)
- [Incremental Static Regeneration](/docs/nextjs/incremental-static-regeneration)
- Default `loader` နဲ့ [Image Optimization](/docs/nextjs/image)
- [Draft Mode](/docs/nextjs/draft-mode)
- [Server Actions](/docs/nextjs/mutating-data)
- [Intercepting Routes](/docs/nextjs/intercepting-routes)

`next dev` နဲ့ ဒီ features တွေထဲက တစ်ခုခုကို သုံးဖို့ ကြိုးစားရင် — root layout မှာ [`dynamic`](/docs/nextjs/caching-without-cache-components#dynamic) option ကို `error` အဖြစ် သတ်မှတ်ထားတာနဲ့ ဆင်တူတဲ့ error တစ်ခု ရပါလိမ့်မယ်:

```jsx
export const dynamic = 'error'
```

## Deploying (ဖြန့်ကျက်ခြင်း)

Static export တစ်ခုနဲ့ဆိုရင် — Next.js က HTML/CSS/JS static assets တွေကို ပေးနိုင်တဲ့ web server မဆီ deploy လုပ်ပြီး host လုပ်နိုင်ပါတယ်။

`next build` run လုပ်တဲ့အခါ — Next.js က static export ကို `out` folder ထဲမှာ ထုတ်ပေးပါတယ်။ ဥပမာ — သင့်မှာ အောက်ပါ routes တွေ ရှိတယ်ဆိုပါစို့:

- `/`
- `/blog/[id]`

`next build` run လုပ်ပြီးတဲ့နောက် — Next.js က အောက်ပါ files တွေကို ထုတ်ပေးပါလိမ့်မယ်:

- `/out/index.html`
- `/out/404.html`
- `/out/blog/post-1.html`
- `/out/blog/post-2.html`

Nginx လို static host တစ်ခု သုံးနေရင် — incoming requests တွေကနေ မှန်ကန်တဲ့ files တွေဆီ rewrites တွေ configure လုပ်နိုင်ပါတယ်:

```nginx
server {
  listen 80;
  server_name acme.com;

  root /var/www/out;

  location / {
      try_files $uri $uri.html $uri/ =404;
  }

  # `trailingSlash: false` ဖြစ်ရင် ဒါ လိုအပ်ပါတယ်။
  # `trailingSlash: true` ဖြစ်ရင် ဒါကို ချန်လိုက်နိုင်ပါတယ်။
  location /blog/ {
      rewrite ^/blog/(.*)$ /blog/$1.html break;
  }

  error_page 404 /404.html;
  location = /404.html {
      internal;
  }
}
```

GitHub Pages ဆီ deploy လုပ်ဖို့ — project အသစ်တစ်ခု ဖန်တီးဖို့ (သို့) ရှိပြီးသား project တစ်ခုကို configure လုပ်တဲ့အခါ ကိုးကားစရာအဖြစ် ကျွန်တော်တို့ရဲ့ [template](https://github.com/nextjs/deploy-github-pages) ကို သုံးပါ။

## Version History (ဗားရှင်း မှတ်တမ်း)

| Version   | Changes                                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| `v14.0.0` | `next export` ကို `"output": "export"` နဲ့ အစားထိုးလို့ ဖယ်ရှားလိုက်ပါပြီ                                                      |
| `v13.4.0` | App Router (Stable) က React Server Components နဲ့ Route Handlers အပါအဝင် enhanced static export support ထည့်ပေးပါတယ် |
| `v13.3.0` | `next export` က deprecated ဖြစ်ပြီး `"output": "export"` နဲ့ အစားထိုးလိုက်ပါပြီ                                                  |
