---
title: "Create React App ကနေ Next.js ဆီ ပြောင်းရွှေ့ခြင်း (How to migrate from Create React App)"
description: "သင့်ရဲ့ လက်ရှိ Create React App (CRA) site ကို Next.js ဆီ ပြောင်းရွှေ့နည်း — ပြောင်းရွှေ့သင့်တဲ့ အကြောင်းရင်းများ, step-by-step migration (SPA mode, root layout, metadata, images, environment variables), Additional Considerations နဲ့ Bundler Compatibility"
order: 179
source: "https://nextjs.org/docs/app/guides/migrating/from-create-react-app"
status: translated
updated: 2026-09-03
---

ဒီ guide က သင့်ရဲ့ လက်ရှိ Create React App (CRA) site တစ်ခုကို Next.js ဆီ ပြောင်းရွှေ့ဖို့ ကူညီပေးပါလိမ့်မယ်။

## ဘာကြောင့် ပြောင်းရွှေ့သင့်သလဲ (Why Switch?)

Create React App ကနေ Next.js ဆီ ပြောင်းရွှေ့ချင်စရာ အကြောင်းရင်း အနည်းငယ် ရှိပါတယ်:

### ကနဦး page loading အချိန် နှေးကွေးခြင်း

Create React App က client-side rendering (client ဘက်မှာ render လုပ်ခြင်း) သက်သက်ကို သုံးပါတယ်။ Client-side သက်သက် application တွေကို [single-page applications (SPAs)](/docs/nextjs/single-page-applications) လို့လည်း ခေါ်ပါတယ် — ဒါတွေက ကနဦး page loading အချိန်မှာ မကြာခဏ နှေးကွေးတတ်ပါတယ်။ အကြောင်းရင်း နှစ်ခုကြောင့် ဖြစ်တတ်ပါတယ်:

1. Browser က React code နဲ့ သင့် application တစ်ခုလုံးရဲ့ bundle ကို download လုပ်ပြီး run လုပ်နိုင်ဖို့ စောင့်ဆိုင်းရပါတယ် — အဲဒီနောက်မှသာ သင့် code က data တွေ load လုပ်ဖို့ request တွေ ပို့နိုင်ပါတော့တယ်။
2. Feature အသစ်တွေနဲ့ dependency အသစ်တွေ ထည့်လေလေ — သင့် application code က ကြီးထွားလေလေ ဖြစ်ပါတယ်။

### Automatic code splitting မရှိခြင်း

အထက်က နှေးကွေးတဲ့ loading time ပြဿနာကို code splitting (code ကို အပိုင်းပိုင်း ခွဲထုတ်ခြင်း) နဲ့ တစိတ်တပိုင်း သက်သာစေနိုင်ပါတယ်။ ဒါပေမယ့် — code splitting ကို ကိုယ်တိုင် လုပ်ဖို့ ကြိုးစားရင် network waterfall (request တွေ တစ်ခုပြီးတစ်ခု စောင့်ဆိုင်းရတဲ့ ဖြစ်စဉ်) တွေကို မတော်တဆ ဖန်တီးမိနိုင်ပါတယ်။ Next.js ကတော့ automatic code splitting နဲ့ tree-shaking (အသုံးမပြုတဲ့ code တွေကို ဖယ်ရှားခြင်း) တွေကို သူ့ရဲ့ router နဲ့ build pipeline ထဲမှာ တည်ဆောက်ပြီးသား ပါဝင်ပါတယ်။

### Network waterfalls

Application တွေက data တွေ ယူဖို့ client-server request တွေကို တစ်ခုပြီးတစ်ခု (sequentially) လုပ်တဲ့အခါ — performance ညံ့ဖျင်းစေတဲ့ အဖြစ်များတဲ့ အကြောင်းရင်း တစ်ခု ဖြစ်ပေါ်လာပါတယ်။ [SPA](/docs/nextjs/single-page-applications) တစ်ခုမှာ data fetching အတွက် ပုံမှန် pattern တစ်ခုက — placeholder တစ်ခု render လုပ်ပြီး component ကို mount လုပ်ပြီးမှ data ကို fetch လုပ်တာပါ။ ကံမကောင်းစွာပဲ — child component တစ်ခုက သူ့ရဲ့ parent က ကိုယ့်ရဲ့ data တွေကို load လုပ်ပြီးမှသာ data fetching စတင်နိုင်လို့ request တွေရဲ့ "waterfall" (ရေတံခွန်) တစ်ခု ဖြစ်ပေါ်လာပါတယ်။

Client-side data fetching ကို Next.js မှာ ထောက်ပံ့ပေးပေမယ့် — data fetching ကို server ဆီ ရွှေ့ဖို့လည်း Next.js က ခွင့်ပြုပါတယ်။ ဒါက client-server waterfall တွေကို မကြာခဏ လုံးဝ ပပျောက်စေနိုင်ပါတယ်။

### မြန်ဆန်ပြီး ရည်ရွယ်ချက်ရှိရှိ loading states

[React Suspense ကနေတစ်ဆင့် streaming](https://nextjs.org/docs/app/getting-started/linking-and-navigating#streaming) အတွက် built-in ထောက်ပံ့မှုနဲ့အတူ — network waterfalls တွေ မဖန်တီးဘဲ သင့် UI ရဲ့ ဘယ်အပိုင်းတွေကို အရင်ဆုံး load လုပ်မလဲ၊ ဘယ်လို အစီအစဉ်နဲ့လဲ ဆိုတာ သတ်မှတ်နိုင်ပါတယ်။

ဒါက ပိုမြန်ဆန်စွာ load ဖြစ်တဲ့ pages တွေကို တည်ဆောက်နိုင်စေပြီး [layout shifts](https://vercel.com/blog/how-core-web-vitals-affect-seo) (page အပြင်အဆင် ရုတ်တရက် ရွေ့ပြောင်းမှုများ) တွေကိုလည်း ဖယ်ရှားနိုင်စေပါတယ်။

### Data fetching strategy ကို ရွေးချယ်ခြင်း

သင့်လိုအပ်ချက်ပေါ် မူတည်ပြီး — Next.js က page (သို့) component တစ်ခုချင်းစီအလိုက် data fetching strategy ကို ရွေးချယ်နိုင်အောင် ခွင့်ပြုပါတယ်။ ဥပမာ — မြန်ဆန်တဲ့ load speeds တွေအတွက် သင့် CMS ကနေ data ကို build time မှာ fetch လုပ်ပြီး blog posts တွေကို render လုပ်နိုင်သလို (SSG) — လိုအပ်တဲ့အခါ request time မှာ data ကို fetch လုပ်တာမျိုး (SSR) လည်း လုပ်နိုင်ပါတယ်။

### Proxy

[Next.js Proxy](/docs/nextjs/file-conventions-proxy) က request တစ်ခု မပြီးဆုံးခင် server ပေါ်မှာ code တွေ run လုပ်နိုင်စေပါတယ်။ ဥပမာ — authenticated လုပ်ထားသူများအတွက်သာ ဖြစ်တဲ့ pages တွေမှာ proxy ထဲကနေ user ကို login page ဆီ redirect လုပ်ပြီး authenticated မဟုတ်တဲ့ content တွေ ခဏတာ ပေါ်လာတာကို ရှောင်ရှားနိုင်ပါတယ်။ A/B testing, experimentation (စမ်းသပ်မှုများ) နဲ့ [internationalization](/docs/nextjs/internationalization) လို features တွေအတွက်လည်း သုံးနိုင်ပါတယ်။

### Built-in Optimizations (ကြိုတင် တည်ဆောက်ထားသော မြှင့်တင်မှုများ)

[Images](/docs/nextjs/component-image), [fonts](/docs/nextjs/component-font) နဲ့ [third-party scripts](https://nextjs.org/docs/app/guides/scripts) တွေက application တစ်ခုရဲ့ performance အပေါ် ကြီးမားတဲ့ သက်ရောက်မှု ရှိတတ်ပါတယ်။ Next.js မှာ အဲဒါတွေကို အလိုအလျောက် optimize လုပ်ပေးတဲ့ အထူးပြု components နဲ့ APIs တွေ ပါဝင်ပါတယ်။

## Migration Steps (ပြောင်းရွှေ့ခြင်း အဆင့်များ)

ကျွန်တော်တို့ရဲ့ ရည်မှန်းချက်က — နောက်ပိုင်းမှာ Next.js features တွေကို တဖြည်းဖြည်း (incrementally) သုံးနိုင်အောင် — တတ်နိုင်သမျှ မြန်မြန် အလုပ်လုပ်တဲ့ Next.js application တစ်ခု ရအောင်ပါ။ အစပိုင်းမှာတော့ သင့်ရဲ့ လက်ရှိ router ကို ချက်ချင်း အစားမထိုးဘဲ — သင့် application ကို client-side သက်သက် application ([SPA](/docs/nextjs/single-page-applications)) တစ်ခုအနေနဲ့ပဲ သဘောထားသွားပါမယ်။ ဒါက ရှုပ်ထွေးမှုတွေနဲ့ merge conflicts တွေကို လျှော့ချပေးပါတယ်။

> **မှတ်ချက်**: သင့် `package.json` ထဲက custom `homepage` field၊ custom service worker (သို့) တိကျတဲ့ Babel/webpack ပြုပြင်မှုတွေ လိုမျိုး — ဆန်းပြားတဲ့ (advanced) CRA configurations တွေ သုံးနေတယ်ဆိုရင် ဒီ features တွေကို Next.js မှာ ဘယ်လို ပြန်ထုတ်လုပ် (သို့) လိုက်လျောညီထွေ ဖြစ်အောင် လုပ်ရမလဲဆိုတဲ့ အကြံပြုချက်တွေအတွက် ဒီ guide ရဲ့ အဆုံးမှာရှိတဲ့ **Additional Considerations (ထပ်ဆောင်း ထည့်သွင်းစဉ်းစားစရာများ)** section ကို ကြည့်ပါ။

### အဆင့် 1: Next.js dependency ကို တပ်ဆင်ခြင်း

သင့် လက်ရှိ project ထဲမှာ Next.js ကို တပ်ဆင်ပါ:

```bash package="pnpm"
pnpm add next@latest
```

```bash package="npm"
npm install next@latest
```

```bash package="yarn"
yarn add next@latest
```

```bash package="bun"
bun add next@latest
```

### အဆင့် 2: Next.js configuration file ကို ဖန်တီးခြင်း

သင့် project ရဲ့ root မှာ (သင့် `package.json` နဲ့ တစ်နေရာတည်း) `next.config.ts` တစ်ခု ဖန်တီးပါ။ ဒီ file ထဲမှာ သင့်ရဲ့ [Next.js configuration options](https://nextjs.org/docs/app/api-reference/config/next-config-js) တွေ ထည့်ထားပါတယ်။

```js filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export', // Outputs a Single-Page Application (SPA)
  distDir: 'build', // Changes the build output directory to `build`
}

export default nextConfig
```

> **မှတ်ချက်**: `output: 'export'` ကို သုံးတာက static export လုပ်နေတာကို ဆိုလိုပါတယ်။ SSR (သို့) APIs လိုမျိုး server-side features တွေကို သင် **လက်လှမ်းမီနိုင်မှာ မဟုတ်ပါဘူး**။ Next.js ရဲ့ server features တွေကို အသုံးချချင်ရင် ဒီ line ကို ဖယ်ရှားနိုင်ပါတယ်။

### အဆင့် 3: Root layout ကို ဖန်တီးခြင်း

Next.js [App Router](https://nextjs.org/docs/app) application တစ်ခုမှာ သင့် pages တွေအားလုံးကို wrap လုပ်ပေးမယ့် [React Server Component](/docs/nextjs/server-client-components) တစ်ခုဖြစ်တဲ့ [root layout](/docs/nextjs/file-conventions-layout) file တစ်ခု **မဖြစ်မနေ** ပါဝင်ရပါတယ်။

CRA application တစ်ခုမှာ root layout file နဲ့ အနီးစပ်ဆုံး ညီမျှတာကတော့ — သင့် `<html>`, `<head>` နဲ့ `<body>` tags တွေ ပါဝင်တဲ့ `public/index.html` ပဲ ဖြစ်ပါတယ်။

1. သင့် `src` folder ထဲမှာ `app` directory အသစ်တစ်ခု ဖန်တီးပါ (`app` ကို root မှာ ထားချင်တယ်ဆိုရင် project root မှာလည်း ရပါတယ်)။
2. `app` directory ထဲမှာ `layout.tsx` (သို့) `layout.js` file တစ်ခု ဖန်တီးပါ:

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return '...'
}
```

```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return '...'
}
```

အခု သင့် အရင် `index.html` ရဲ့ content တွေကို ဒီ `<RootLayout>` component ထဲကို ကူးယူပါ။ `body div#root` (နဲ့ `body noscript`) တွေကို `<div id="root">{children}</div>` နဲ့ အစားထိုးပါ။

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

> **သိထားသင့်သည်**: Next.js က CRA ရဲ့ `public/manifest.json`, အပိုဆောင်း iconography တွေနဲ့ [testing configuration](/docs/nextjs/testing) တွေကို default အားဖြင့် လျစ်လျူရှုပါတယ်။ ဒါတွေ လိုအပ်ရင် — Next.js မှာ ၎င်းရဲ့ [Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) နဲ့ [Testing](/docs/nextjs/testing) setup တွေနဲ့ ထောက်ပံ့ပေးထားပါတယ်။

### အဆင့် 4: Metadata

Next.js က `<meta charset="UTF-8" />` နဲ့ `<meta name="viewport" content="width=device-width, initial-scale=1" />` tags တွေကို အလိုအလျောက် ထည့်ပေးတာမို့ — `<head>` ကနေ ဖယ်ရှားနိုင်ပါတယ်:

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

`favicon.ico`, `icon.png`, `robots.txt` လိုမျိုး [metadata files](https://nextjs.org/docs/app/getting-started/metadata-and-og-images#file-based-metadata) တွေက — သင့် `app` directory ရဲ့ ထိပ်ဆုံး (top level) မှာ ထားထားရင် application ရဲ့ `<head>` tag ထဲကို အလိုအလျောက် ထည့်ပေးပါတယ်။ [ထောက်ပံ့ပေးတဲ့ files](https://nextjs.org/docs/app/getting-started/metadata-and-og-images#file-based-metadata) အားလုံးကို `app` directory ထဲကို ရွှေ့ပြီးတာနဲ့ — သူတို့ရဲ့ `<link>` tags တွေကို စိတ်ချလက်ချ ဖျက်ပစ်နိုင်ပါပြီ:

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>React App</title>
        <meta name="description" content="Web site created..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

နောက်ဆုံးအနေနဲ့ — ကျန်နေတဲ့ `<head>` tags တွေကို [Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) နဲ့ Next.js က စီမံပေးနိုင်ပါတယ်။ သင့်ရဲ့ နောက်ဆုံး metadata အချက်အလက်တွေကို export လုပ်ထားတဲ့ [`metadata` object](/docs/nextjs/generate-metadata) တစ်ခုထဲကို ရွှေ့ပါ:

```tsx filename="app/layout.tsx" switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
export const metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

အထက်က အပြောင်းအလဲတွေနဲ့အတူ — သင် `index.html` ထဲမှာ အရာအားလုံးကို ကြေညာတဲ့ ပုံစံကနေ framework ထဲမှာ တည်ဆောက်ပြီးသား ဖြစ်တဲ့ Next.js ရဲ့ convention-based ချဉ်းကပ်မှု ([Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)) ဆီ ပြောင်းသွားပါပြီ။ ဒီချဉ်းကပ်မှုက သင့် pages တွေရဲ့ SEO နဲ့ web sharing လုပ်နိုင်မှုကို ပိုလွယ်ကူစွာ မြှင့်တင်နိုင်စေပါတယ်။

### အဆင့် 5: Styles (စတိုင်များ)

CRA လိုပဲ — Next.js က [CSS Modules](/docs/nextjs/css) တွေကို အစကတည်းက (out of the box) ထောက်ပံ့ပါတယ်။ [global CSS imports](/docs/nextjs/css) တွေကိုလည်း ထောက်ပံ့ပါတယ်။

သင့်မှာ global CSS file တစ်ခု ရှိရင် — အဲဒါကို သင့် `app/layout.tsx` ထဲမှာ import လုပ်ပါ:

```tsx filename="app/layout.tsx" switcher
import '../index.css'

export const metadata = {
  title: 'React App',
  description: 'Web site created with Next.js.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

Tailwind CSS သုံးနေတယ်ဆိုရင် — ကျွန်တော်တို့ရဲ့ [installation docs](/docs/nextjs/css) ကို ကြည့်ပါ။

### အဆင့် 6: Entrypoint page ကို ဖန်တီးခြင်း

Create React App က `src/index.tsx` (သို့) `index.js` ကို entry point အဖြစ် သုံးပါတယ်။ Next.js (App Router) မှာတော့ — `app` directory ထဲက folder တိုင်းက route တစ်ခုကို ကိုယ်စားပြုပြီး folder တိုင်းမှာ `page.tsx` ရှိရပါတယ်။

အခုအချိန်မှာ app ကို SPA တစ်ခုအနေနဲ့ ထားပြီး route **အားလုံး**ကို ကြားဖြတ်ချင်တာမို့ — [optional catch-all route](/docs/nextjs/file-conventions-dynamic-routes) တစ်ခုကို သုံးသွားပါမယ်။

1. **`app` ထဲမှာ `[[...slug]]` directory တစ်ခု ဖန်တီးပါ။**

```bash
app
 ┣ [[...slug]]
 ┃ ┗ page.tsx
 ┣ layout.tsx
```

2. **`page.tsx` ထဲကို အောက်ပါအတိုင်း ထည့်ပါ**:

```tsx filename="app/[[...slug]]/page.tsx" switcher
export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // We'll update this
}
```

```jsx filename="app/[[...slug]]/page.js" switcher
export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // We'll update this
}
```

ဒါက Next.js ကို — empty slug (`/`) အတွက် route တစ်ခုတည်း ထုတ်ပေးဖို့ ပြောတာဖြစ်ပြီး route **အားလုံး**ကို page တစ်ခုတည်းဆီ ထိရောက်စွာ ပုံဖော် (map) ပေးပါတယ်။ ဒီ page က [Server Component](/docs/nextjs/server-client-components) တစ်ခုဖြစ်ပြီး static HTML အဖြစ် ကြိုတင် render (prerender) လုပ်ပါတယ်။

### အဆင့် 7: Client-only entrypoint တစ်ခု ထည့်သွင်းခြင်း

နောက်တစ်ဆင့်အနေနဲ့ — သင့် CRA ရဲ့ root App component ကို [Client Component](/docs/nextjs/server-client-components) တစ်ခုအတွင်းမှာ ထည့်သွင်းပြီး logic အားလုံး client-side မှာ ဆက်ရှိနေအောင် လုပ်ပါမယ်။ ဒါက သင့် Next.js ပထမဆုံး အကြိမ် သုံးတာဆိုရင် — Client Components တွေကို (default အားဖြင့်) server ပေါ်မှာ ကြိုတင် render (prerender) လုပ်ထားဆဲ ဖြစ်ကြောင်း သိထားသင့်ပါတယ်။ သူတို့ကို client-side JavaScript run လုပ်နိုင်တဲ့ အပိုစွမ်းရည်တစ်ခု ပါတဲ့အရာတွေလို့ တွေးကြည့်နိုင်ပါတယ်။

`app/[[...slug]]/` ထဲမှာ `client.tsx` (သို့) `client.js` ဖန်တီးပါ:

```tsx filename="app/[[...slug]]/client.tsx" switcher
'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

```jsx filename="app/[[...slug]]/client.js" switcher
'use client'

import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

- `'use client'` directive က ဒီ file ကို **Client Component** တစ်ခု ဖြစ်စေပါတယ်။
- `ssr: false` ပါတဲ့ `dynamic` import က `<App />` component အတွက် server-side rendering ကို ပိတ်ထားပြီး — တကယ့် client-only (SPA) ဖြစ်စေပါတယ်။

အခု သင့် `page.tsx` (သို့) `page.js` ကို သင့် component အသစ် သုံးအောင် update လုပ်ပါ:

```tsx filename="app/[[...slug]]/page.tsx" switcher
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

```jsx filename="app/[[...slug]]/page.js" switcher
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

### အဆင့် 8: Static image imports တွေကို update လုပ်ခြင်း

CRA မှာ — image file တစ်ခုကို import လုပ်ရင် သူ့ရဲ့ public URL ကို string တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်:

```tsx
import image from './img.png'

export default function App() {
  return <img src={image} />
}
```

Next.js မှာတော့ — static image imports တွေက object တစ်ခုကို ပြန်ပေးပါတယ်။ အဲဒီ object ကို Next.js ရဲ့ [`<Image>` component](/docs/nextjs/component-image) နဲ့ တိုက်ရိုက် သုံးနိုင်သလို — သင့် လက်ရှိ `<img>` tag နဲ့ဆို object ရဲ့ `src` property ကို သုံးနိုင်ပါတယ်။

`<Image>` component မှာ [automatic image optimization](/docs/nextjs/component-image) ဆိုတဲ့ အပိုအကျိုးကျေးဇူးတွေ ရှိပါတယ်။ `<Image>` component က image ရဲ့ dimensions အပေါ် မူတည်ပြီး ရလာတဲ့ `<img>` ရဲ့ `width` နဲ့ `height` attributes တွေကို အလိုအလျောက် သတ်မှတ်ပေးပါတယ်။ ဒါက image load လုပ်တဲ့အခါ layout shifts တွေ မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။ ဒါပေမယ့် — သင့် app ထဲမှာ image တစ်ခုရဲ့ dimension တစ်ခုတည်းကိုပဲ style လုပ်ထားပြီး နောက်တစ်ခုကို `auto` မလုပ်ထားတဲ့ images တွေ ရှိနေရင် ပြဿနာ ဖြစ်စေနိုင်ပါတယ်။ `auto` လုပ်မထားတဲ့အခါ — dimension က `<img>` ရဲ့ dimension attribute ရဲ့ တန်ဖိုးကို default အနေနဲ့ ယူလို့ image က ပုံပျက်ပြီး ပေါ်နိုင်ပါတယ်။

`<img>` tag ကို ဆက်ထားတာက သင့် application ထဲမှာ ပြောင်းလဲမှု အရေအတွက်ကို လျှော့ချပေးပြီး အထက်က ပြဿနာတွေကိုလည်း ကာကွယ်ပေးပါတယ်။ နောက်ပိုင်းမှာ — [loader တစ်ခု configure လုပ်ခြင်း](/docs/nextjs/component-image) အားဖြင့် (သို့) automatic image optimization ပါတဲ့ default Next.js server ဆီ ရွှေ့ပြီး — images တွေကို optimize လုပ်ဖို့ `<Image>` component ဆီ ရွေးချယ် ပြောင်းရွှေ့နိုင်ပါတယ်။

**`/public` ကနေ import လုပ်ထားတဲ့ images တွေရဲ့ absolute import paths တွေကို relative imports အဖြစ် ပြောင်းပါ:**

```tsx
// Before
import logo from '/logo.png'

// After
import logo from '../public/logo.png'
```

**Image object တစ်ခုလုံး အစား — image ရဲ့ `src` property ကို သင့် `<img>` tag ဆီ ပို့ပါ:**

```tsx
// Before
<img src={logo} />

// After
<img src={logo.src} />
```

တနည်းအားဖြင့် — filename အပေါ် မူတည်ပြီး image asset ရဲ့ public URL ကို ရည်ညွှန်းနိုင်ပါတယ်။ ဥပမာ — `public/logo.png` က သင့် application အတွက် image ကို `/logo.png` မှာ ဆာဗာလုပ်ပေးမှာဖြစ်ပြီး — အဲဒါက `src` value ဖြစ်သွားပါလိမ့်မယ်။

> **သတိပေးချက်:** TypeScript သုံးနေတယ်ဆိုရင် — `src` property ကို ဝင်ရောက်တဲ့အခါ type errors တွေ ကြုံရနိုင်ပါတယ်။ ဖြေရှင်းဖို့ — `next-env.d.ts` ကို သင့် `tsconfig.json` ရဲ့ [`include` array](https://www.typescriptlang.org/tsconfig#include) ထဲမှာ ထည့်ဖို့ လိုအပ်ပါတယ်။ အဆင့် 9 မှာ သင့် application ကို run လုပ်တဲ့အခါ Next.js က ဒီ file ကို အလိုအလျောက် ထုတ်ပေးပါလိမ့်မယ်။

### အဆင့် 9: Environment variables တွေကို ပြောင်းရွှေ့ခြင်း

Next.js က [environment variables](/docs/nextjs/environment-variables) တွေကို CRA နဲ့ ဆင်တူစွာ ထောက်ပံ့ပေးပေမယ့် — browser မှာ ထုတ်ဖော်ပြချင်တဲ့ variable တိုင်းအတွက် `NEXT_PUBLIC_` prefix တစ်ခုကို **မဖြစ်မနေ** လိုအပ်ပါတယ်။

အဓိက ကွာခြားချက်ကတော့ — client-side မှာ environment variables တွေကို ထုတ်ဖော်ဖို့ သုံးတဲ့ prefix ပဲ ဖြစ်ပါတယ်။ `REACT_APP_` prefix ပါတဲ့ environment variables တွေ အားလုံးကို `NEXT_PUBLIC_` အဖြစ် ပြောင်းလဲပါ။

### အဆင့် 10: `package.json` ထဲက scripts တွေကို update လုပ်ခြင်း

သင့် `package.json` scripts တွေကို Next.js commands တွေ သုံးအောင် update လုပ်ပါ။ ဒါ့အပြင် `.next` နဲ့ `next-env.d.ts` တွေကို သင့် `.gitignore` ထဲမှာ ထည့်ပါ:

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "npx serve@latest ./build"
  }
}
```

```txt filename=".gitignore"
# ...
.next
next-env.d.ts
```

အခု သင် run လုပ်နိုင်ပါပြီ:

```bash package="pnpm"
pnpm dev
```

```bash package="npm"
npm run dev
```

```bash package="yarn"
yarn dev
```

```bash package="bun"
bun dev
```

[http://localhost:3000](http://localhost:3000) ကို ဖွင့်ကြည့်ပါ။ သင့် application က ခုဆို Next.js ပေါ်မှာ (SPA mode နဲ့) run နေတာကို မြင်ရပါလိမ့်မယ်။

### အဆင့် 11: ရှင်းလင်းရေး (Clean Up)

အခု Create React App အတွက်သာ သီးသန့်ဖြစ်တဲ့ artifacts တွေကို ဖယ်ရှားနိုင်ပါပြီ:

- `public/index.html`
- `src/index.tsx`
- `src/react-app-env.d.ts`
- `reportWebVitals` setup
- `react-scripts` dependency (သင့် `package.json` ကနေ uninstall လုပ်ပါ)

## ထပ်ဆောင်း ထည့်သွင်းစဉ်းစားစရာများ (Additional Considerations)

### CRA မှာ Custom `homepage` သုံးနေခြင်း

သင့် app ကို subpath တစ်ခုအောက်မှာ ဆာဗာလုပ်ဖို့ CRA `package.json` ထဲက `homepage` field ကို သုံးနေတယ်ဆိုရင် — Next.js မှာ `next.config.ts` ထဲက [`basePath` configuration](/docs/nextjs/next-config-base-path) နဲ့ ပြန်ထုတ်လုပ်နိုင်ပါတယ်:

```ts filename="next.config.ts"
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/my-subpath',
  // ...
}

export default nextConfig
```

### Custom `Service Worker` တစ်ခုကို ကိုင်တွယ်ခြင်း

CRA ရဲ့ service worker ကို သုံးနေတယ်ဆိုရင် (ဥပမာ — `create-react-app` ကနေ လာတဲ့ `serviceWorker.js`) — ဒီ service worker ကို အောက်ပါ syntax နဲ့ register လုပ်နိုင်ပါတယ်:

```ts
await navigator.serviceWorker.register(new URL('../serviceWorker.js', import.meta.url), ...)
```

Next.js နဲ့ [Progressive Web Applications (PWAs)](https://nextjs.org/docs/app/guides/progressive-web-apps) တွေ ဘယ်လို ဖန်တီးရမလဲဆိုတာ ပိုလေ့လာပါ။

### API requests တွေကို proxy လုပ်ခြင်း

သင့် CRA app က requests တွေကို backend server တစ်ခုဆီ ပို့ဖို့ `package.json` ထဲက `proxy` field ကို သုံးနေတယ်ဆိုရင် — `next.config.ts` ထဲက [Next.js rewrites](/docs/nextjs/next-config-rewrites) တွေနဲ့ ပြန်ထုတ်လုပ်နိုင်ပါတယ်:

```ts filename="next.config.ts"
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://your-backend.com/:path*',
      },
    ]
  },
}
```

### Custom Webpack

CRA မှာ custom webpack (သို့) Babel configuration ရှိခဲ့တယ်ဆိုရင် — `next.config.ts` ထဲမှာ Next.js ရဲ့ config ကို extend လုပ်နိုင်ပါတယ်:

```ts filename="next.config.ts"
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Modify the webpack config here
    return config
  },
}

export default nextConfig
```

> **မှတ်ချက်**: ဒါက သုံးမယ်ဆိုရင် — သင့် `dev` script မှာ `--webpack` ထည့်ပြီး Webpack ကို အသုံးပြုဖို့ လိုအပ်ပါလိမ့်မယ်။

### TypeScript Setup

သင့်မှာ `tsconfig.json` ရှိရင် — Next.js က TypeScript ကို အလိုအလျောက် စနစ်ထည့်သွင်းပေးပါတယ်။ `next-env.d.ts` က သင့် `tsconfig.json` ရဲ့ `include` array ထဲမှာ ပါဝင်ကြောင်း သေချာပါစေ:

```json
{
  "include": ["next-env.d.ts", "app/**/*", "src/**/*"]
}
```

## Bundler Compatibility (Bundler လိုက်ဖက်ညီမှု)

Create React App က bundling အတွက် webpack ကို သုံးပါတယ်။ Next.js ကတော့ ပိုမြန်ဆန်တဲ့ local development အတွက် အခု [Turbopack](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack) ကို default အနေနဲ့ သုံးပါတယ်:

```bash
next dev  # Uses Turbopack by default
```

Webpack ကို သုံးချင်ရင် (CRA နဲ့ ဆင်တူအောင်):

```bash
next dev --webpack
```

CRA ကနေ advanced webpack settings တွေကို ပြောင်းရွှေ့ဖို့ လိုအပ်ရင် — [custom webpack configuration](/docs/nextjs/next-config-webpack) တစ်ခုကို ဆက်လက် ပေးနိုင်ပါသေးတယ်။

## နောက်တစ်ဆင့်များ (Next Steps)

အားလုံး အဆင်ပြေသွားတယ်ဆိုရင် — သင့်မှာ single-page application တစ်ခုအနေနဲ့ အလုပ်လုပ်နေတဲ့ Next.js application တစ်ခု အခု ရှိနေပါပြီ။ Server-side rendering (သို့) file-based routing လိုမျိုး Next.js features တွေကို သေးသေးမွှားမွှား အသုံးချနေတာ မဟုတ်သေးပေမယ့် — အခုကစပြီး တဖြည်းဖြည်းချင်း လုပ်နိုင်ပါပြီ:

- **React Router ကနေ** [Next.js App Router](https://nextjs.org/docs/app) ဆီ ပြောင်းရွှေ့ပါ:
  - Automatic code splitting
  - [Streaming server rendering](/docs/nextjs/file-conventions-loading)
  - [React Server Components](/docs/nextjs/server-client-components)
- [`<Image>` component](/docs/nextjs/component-image) နဲ့ **images တွေကို optimize လုပ်ပါ**
- [`next/font`](/docs/nextjs/component-font) နဲ့ **fonts တွေကို optimize လုပ်ပါ**
- [`<Script>` component](https://nextjs.org/docs/app/guides/scripts) နဲ့ **third-party scripts တွေကို optimize လုပ်ပါ**
- Next.js [recommended rules](https://nextjs.org/docs/app/api-reference/config/eslint) တွေနဲ့ **ESLint ကို ဖွင့်ပါ**

> **မှတ်ချက်**: Static export (`output: 'export'`) ကို သုံးတာက `useParams` hook (သို့) အခြား server features တွေကို [လက်ရှိ ထောက်ပံ့မထားပါဘူး](https://github.com/vercel/next.js/issues/54393)။ Next.js features အားလုံးကို သုံးဖို့ — သင့် `next.config.ts` ကနေ `output: 'export'` ကို ဖယ်ရှားပါ။
