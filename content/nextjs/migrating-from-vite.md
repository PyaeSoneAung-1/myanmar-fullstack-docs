---
title: "Vite ကနေ Next.js ဆီ ပြောင်းရွှေ့ခြင်း (How to migrate from Vite)"
description: "သင့်ရဲ့ လက်ရှိ Vite application ကို Next.js ဆီ ပြောင်းရွှေ့နည်း — ပြောင်းရွှေ့သင့်တဲ့ အကြောင်းရင်းများ, step-by-step migration (dependency, configuration, TypeScript, root layout, entrypoint page, static images, environment variables, scripts)"
order: 180
source: "https://nextjs.org/docs/app/guides/migrating/from-vite"
status: translated
updated: 2026-09-03
---

ဒီ guide က သင့်ရဲ့ လက်ရှိ Vite application တစ်ခုကို Next.js ဆီ ပြောင်းရွှေ့ဖို့ ကူညီပေးပါလိမ့်မယ်။

## ဘာကြောင့် ပြောင်းရွှေ့သင့်သလဲ (Why Switch?)

Vite ကနေ Next.js ဆီ ပြောင်းရွှေ့ချင်စရာ အကြောင်းရင်း အနည်းငယ် ရှိပါတယ်:

### ကနဦး page loading အချိန် နှေးကွေးခြင်း

သင့် application ကို [React အတွက် default Vite plugin](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) နဲ့ တည်ဆောက်ထားတယ်ဆိုရင် — သင့် application က client-side သက်သက် application တစ်ခု ဖြစ်ပါတယ်။ Client-side သက်သက် application တွေကို single-page applications (SPAs) လို့လည်း ခေါ်ပြီး — ကနဦး page loading အချိန်မှာ မကြာခဏ နှေးကွေးတတ်ပါတယ်။ အကြောင်းရင်း နှစ်ခုကြောင့် ဖြစ်တတ်ပါတယ်:

1. Browser က React code နဲ့ သင့် application တစ်ခုလုံးရဲ့ bundle ကို download လုပ်ပြီး run လုပ်နိုင်ဖို့ စောင့်ဆိုင်းရပါတယ် — အဲဒီနောက်မှသာ သင့် code က data တချို့ load လုပ်ဖို့ request တွေ ပို့နိုင်ပါတော့တယ်။
2. Feature အသစ်တွေနဲ့ အပို dependency တွေ ထည့်လေလေ — သင့် application code က ကြီးထွားလေလေ ဖြစ်ပါတယ်။

### Automatic code splitting မရှိခြင်း

အထက်က နှေးကွေးတဲ့ loading time ပြဿနာကို code splitting (code ကို အပိုင်းပိုင်း ခွဲထုတ်ခြင်း) နဲ့ တစိတ်တပိုင်း စီမံနိုင်ပါတယ်။ ဒါပေမယ့် — code splitting ကို ကိုယ်တိုင် လုပ်ဖို့ ကြိုးစားရင် performance ကို မကြာခဏ ပိုဆိုးစေပါတယ်။ ကိုယ်တိုင် code-splitting လုပ်တဲ့အခါ network waterfall (request တွေ တစ်ခုပြီးတစ်ခု စောင့်ဆိုင်းရတဲ့ ဖြစ်စဉ်) တွေကို မတော်တဆ ဖန်တီးမိဖို့ လွယ်ကူပါတယ်။ Next.js ကတော့ automatic code splitting ကို သူ့ရဲ့ router ထဲမှာ တည်ဆောက်ပြီးသား ပါဝင်ပါတယ်။

### Network waterfalls

Application တွေက data တွေ ယူဖို့ client-server request တွေကို တစ်ခုပြီးတစ်ခု (sequentially) လုပ်တဲ့အခါ — performance ညံ့ဖျင်းစေတဲ့ အဖြစ်များတဲ့ အကြောင်းရင်း တစ်ခု ဖြစ်ပေါ်လာပါတယ်။ SPA တစ်ခုမှာ data fetching အတွက် ပုံမှန် pattern တစ်ခုက — placeholder တစ်ခုကို ကနဦး render လုပ်ပြီး component ကို mount လုပ်ပြီးမှ data ကို fetch လုပ်တာပါ။ ကံမကောင်းစွာပဲ — ဒါက data fetch လုပ်တဲ့ child component တစ်ခုက သူ့ရဲ့ parent component က ကိုယ့်ရဲ့ data တွေကို load လုပ်ပြီးမှသာ fetch စတင်နိုင်လို့ ဖြစ်ပါတယ်။

Client ပေါ်မှာ data fetching လုပ်တာကို Next.js မှာ ထောက်ပံ့ပေးပေမယ့် — data fetching ကို server ဆီ ရွှေ့ဖို့ option လည်း ပေးထားပြီး — ဒါက client-server waterfalls တွေကို ပပျောက်စေနိုင်ပါတယ်။

### မြန်ဆန်ပြီး ရည်ရွယ်ချက်ရှိရှိ loading states

[React Suspense ကနေတစ်ဆင့် streaming](https://nextjs.org/docs/app/getting-started/linking-and-navigating#streaming) အတွက် built-in ထောက်ပံ့မှုနဲ့အတူ — network waterfalls တွေ မဖန်တီးဘဲ သင့် UI ရဲ့ ဘယ်အပိုင်းတွေကို အရင်ဆုံး load လုပ်မလဲ၊ ဘယ်လို အစီအစဉ်နဲ့လဲ ဆိုတာကို ပိုပြီး ရည်ရွယ်ချက်ရှိရှိ ဖြစ်အောင် လုပ်နိုင်ပါတယ်။

ဒါက ပိုမြန်ဆန်စွာ load ဖြစ်တဲ့ pages တွေကို တည်ဆောက်နိုင်စေပြီး [layout shifts](https://vercel.com/blog/how-core-web-vitals-affect-seo) (page အပြင်အဆင် ရုတ်တရက် ရွေ့ပြောင်းမှုများ) တွေကိုလည်း ဖယ်ရှားနိုင်စေပါတယ်။

### Data fetching strategy ကို ရွေးချယ်ခြင်း

သင့်လိုအပ်ချက်ပေါ် မူတည်ပြီး — Next.js က page နဲ့ component အလိုက် data fetching strategy ကို ရွေးချယ်နိုင်အောင် ခွင့်ပြုပါတယ်။ Build time မှာ ဖြစ်ဖြစ်၊ server ပေါ်မှာ request time မှာ ဖြစ်ဖြစ်၊ client ပေါ်မှာ ဖြစ်ဖြစ် — fetch လုပ်ဖို့ သင်ဆုံးဖြတ်နိုင်ပါတယ်။ ဥပမာ — သင့် CMS ကနေ data ကို build time မှာ fetch လုပ်ပြီး blog posts တွေကို render လုပ်နိုင်ပါတယ် — နောက်ပိုင်းမှာ အဲဒါတွေကို CDN တစ်ခုပေါ်မှာ ထိရောက်စွာ cache လုပ်နိုင်ပါတယ်။

### Proxy

[Next.js Proxy](/docs/nextjs/file-conventions-proxy) က request တစ်ခု မပြီးဆုံးခင် server ပေါ်မှာ code တွေ run လုပ်နိုင်စေပါတယ်။ ဒါက — user က authenticated-only page တစ်ခုကို လာလည်တဲ့အခါ login page ဆီ redirect လုပ်ပြီး authenticated မဟုတ်တဲ့ content တွေ ခဏတာ ပေါ်လာတာကို ရှောင်ရှားဖို့ အထူး အသုံးဝင်ပါတယ်။ Experimentation (စမ်းသပ်မှုများ) နဲ့ [internationalization](/docs/nextjs/internationalization) တွေအတွက်လည်း proxy က အသုံးဝင်ပါတယ်။

### Built-in Optimizations (ကြိုတင် တည်ဆောက်ထားသော မြှင့်တင်မှုများ)

[Images](/docs/nextjs/component-image), [fonts](/docs/nextjs/component-font) နဲ့ [third-party scripts](https://nextjs.org/docs/app/guides/scripts) တွေက application တစ်ခုရဲ့ performance အပေါ် သိသိသာသာ သက်ရောက်မှု ရှိတတ်ပါတယ်။ Next.js မှာ အဲဒါတွေကို အလိုအလျောက် optimize လုပ်ပေးတဲ့ built-in components တွေ ပါဝင်ပါတယ်။

## Migration Steps (ပြောင်းရွှေ့ခြင်း အဆင့်များ)

ဒီ migration ရဲ့ ရည်မှန်းချက်က — နောက်ပိုင်းမှာ Next.js features တွေကို တဖြည်းဖြည်း သုံးနိုင်အောင် — တတ်နိုင်သမျှ မြန်မြန် အလုပ်လုပ်တဲ့ Next.js application တစ်ခု ရအောင်ပါ။ အစပိုင်းမှာတော့ သင့် router ကို ပြောင်းရွှေ့စရာ မလိုဘဲ — client-side သက်သက် application (SPA) တစ်ခုအနေနဲ့ပဲ ထားသွားပါမယ်။ ဒါက migration လုပ်ငန်းစဉ်အတွင်း ပြဿနာတွေ ကြုံရနိုင်ခြေကို အနည်းဆုံး ဖြစ်အောင် ကူညီပေးပြီး merge conflicts တွေကိုလည်း လျှော့ချပေးပါတယ်။

### အဆင့် 1: Next.js dependency ကို တပ်ဆင်ခြင်း

ပထမဆုံး လုပ်ရမှာက `next` ကို dependency တစ်ခုအနေနဲ့ တပ်ဆင်ဖို့ ဖြစ်ပါတယ်:

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

သင့် project ရဲ့ root မှာ `next.config.mjs` တစ်ခု ဖန်တီးပါ။ ဒီ file ထဲမှာ သင့်ရဲ့ [Next.js configuration options](https://nextjs.org/docs/app/api-reference/config/next-config-js) တွေ ထည့်ထားပါလိမ့်မယ်။

```js filename="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Outputs a Single-Page Application (SPA).
  distDir: './dist', // Changes the build output directory to `./dist/`.
}

export default nextConfig
```

> **သိထားသင့်သည်:** သင့် Next.js configuration file အတွက် `.js` (သို့) `.mjs` — တစ်ခုခုကို သုံးနိုင်ပါတယ်။

### အဆင့် 3: TypeScript configuration ကို update လုပ်ခြင်း

TypeScript သုံးနေတယ်ဆိုရင် — သင့် `tsconfig.json` file ကို Next.js နဲ့ လိုက်ဖက်ညီအောင် အောက်ပါ အပြောင်းအလဲတွေနဲ့ update လုပ်ဖို့ လိုအပ်ပါတယ်။ TypeScript မသုံးဘူးဆိုရင် ဒီအဆင့်ကို ကျော်နိုင်ပါတယ်။

1. [`tsconfig.node.json` ဆီကို ညွှန်ပြတဲ့](https://www.typescriptlang.org/tsconfig#references) [project reference](https://www.typescriptlang.org/tsconfig#references) ကို ဖယ်ရှားပါ
2. [`include` array](https://www.typescriptlang.org/tsconfig#include) ထဲမှာ `./dist/types/**/*.ts` နဲ့ `./next-env.d.ts` တွေကို ထည့်ပါ
3. [`exclude` array](https://www.typescriptlang.org/tsconfig#exclude) ထဲမှာ `./node_modules` ကို ထည့်ပါ
4. [`compilerOptions` ထဲက `plugins` array](https://www.typescriptlang.org/tsconfig#plugins) မှာ `{ "name": "next" }` ထည့်ပါ: `"plugins": [{ "name": "next" }]`
5. [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) ကို `true` လို့ သတ်မှတ်ပါ: `"esModuleInterop": true`
6. [`jsx`](https://www.typescriptlang.org/tsconfig#jsx) ကို `react-jsx` လို့ သတ်မှတ်ပါ: `"jsx": "react-jsx"`
7. [`allowJs`](https://www.typescriptlang.org/tsconfig#allowJs) ကို `true` လို့ သတ်မှတ်ပါ: `"allowJs": true`
8. [`forceConsistentCasingInFileNames`](https://www.typescriptlang.org/tsconfig#forceConsistentCasingInFileNames) ကို `true` လို့ သတ်မှတ်ပါ: `"forceConsistentCasingInFileNames": true`
9. [`incremental`](https://www.typescriptlang.org/tsconfig#incremental) ကို `true` လို့ သတ်မှတ်ပါ: `"incremental": true`

ဒီအပြောင်းအလဲတွေ ပါဝင်တဲ့ အလုပ်လုပ်တဲ့ `tsconfig.json` ရဲ့ ဥပမာတစ်ခုက:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["./src", "./dist/types/**/*.ts", "./next-env.d.ts"],
  "exclude": ["./node_modules"]
}
```

TypeScript ကို configure လုပ်ခြင်းအကြောင်း ပိုမိုသိရှိဖို့ [Next.js docs](https://nextjs.org/docs/app/api-reference/config/typescript) မှာ ကြည့်နိုင်ပါတယ်။

### အဆင့် 4: Root layout ကို ဖန်တီးခြင်း

Next.js [App Router](https://nextjs.org/docs/app) application တစ်ခုမှာ သင့် application ထဲက pages အားလုံးကို wrap လုပ်ပေးမယ့် [React Server Component](/docs/nextjs/server-client-components) တစ်ခုဖြစ်တဲ့ [root layout](/docs/nextjs/file-conventions-layout) file တစ်ခု မဖြစ်မနေ ပါဝင်ရပါတယ်။ ဒီ file ကို `app` directory ရဲ့ ထိပ်ဆုံး (top level) မှာ သတ်မှတ်ပါတယ်။

Vite application တစ်ခုမှာ root layout file နဲ့ အနီးစပ်ဆုံး ညီမျှတာကတော့ — သင့် `<html>`, `<head>` နဲ့ `<body>` tags တွေ ပါဝင်တဲ့ [`index.html` file](https://vitejs.dev/guide/#index-html-and-project-root) ပဲ ဖြစ်ပါတယ်။

ဒီအဆင့်မှာ — သင့် `index.html` file ကို root layout file အဖြစ် ပြောင်းလဲပါလိမ့်မယ်:

1. သင့် `src` folder ထဲမှာ `app` directory အသစ်တစ်ခု ဖန်တီးပါ။
2. အဲဒီ `app` directory ထဲမှာ `layout.tsx` file အသစ်တစ်ခု ဖန်တီးပါ:

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

> **သိထားသင့်သည်**: Layout files တွေအတွက် `.js`, `.jsx` (သို့) `.tsx` extensions တွေကို သုံးနိုင်ပါတယ်။

3. သင့် `index.html` file ရဲ့ content ကို အရင် ဖန်တီးထားတဲ့ `<RootLayout>` component ထဲကို ကူးယူပြီး — `body.div#root` နဲ့ `body.script` tags တွေကို `<div id="root">{children}</div>` နဲ့ အစားထိုးပါ:

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
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
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

4. Next.js က [meta charset](https://developer.mozilla.org/docs/Web/HTML/Element/meta#charset) နဲ့ [meta viewport](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) tags တွေကို default အားဖြင့် ထည့်ပေးပြီးသား ဖြစ်လို့ — ဒါတွေကို သင့် `<head>` ကနေ စိတ်ချလက်ချ ဖယ်ရှားနိုင်ပါတယ်:

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
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
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

5. `favicon.ico`, `icon.png`, `robots.txt` လိုမျိုး [metadata files](https://nextjs.org/docs/app/getting-started/metadata-and-og-images#file-based-metadata) တွေက — သင့် `app` directory ရဲ့ ထိပ်ဆုံး (top level) မှာ ထားထားရင် application ရဲ့ `<head>` tag ထဲကို အလိုအလျောက် ထည့်ပေးပါတယ်။ [ထောက်ပံ့ပေးတဲ့ files](https://nextjs.org/docs/app/getting-started/metadata-and-og-images#file-based-metadata) အားလုံးကို `app` directory ထဲကို ရွှေ့ပြီးတာနဲ့ — သူတို့ရဲ့ `<link>` tags တွေကို စိတ်ချလက်ချ ဖျက်ပစ်နိုင်ပါပြီ:

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
        <meta name="description" content="My App is a..." />
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
        <title>My App</title>
        <meta name="description" content="My App is a..." />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
```

6. နောက်ဆုံးအနေနဲ့ — ကျန်နေတဲ့ `<head>` tags တွေကို [Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) နဲ့ Next.js က စီမံပေးနိုင်ပါတယ်။ သင့်ရဲ့ နောက်ဆုံး metadata အချက်အလက်တွေကို export လုပ်ထားတဲ့ [`metadata` object](/docs/nextjs/generate-metadata) တစ်ခုထဲကို ရွှေ့ပါ:

```tsx filename="app/layout.tsx" switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'My App is a...',
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
  title: 'My App',
  description: 'My App is a...',
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

### အဆင့် 5: Entrypoint page ကို ဖန်တီးခြင်း

Next.js မှာ — `page.tsx` file တစ်ခု ဖန်တီးခြင်းအားဖြင့် သင့် application ရဲ့ entrypoint တစ်ခုကို ကြေညာပါတယ်။ Vite မှာ ဒီ file နဲ့ အနီးစပ်ဆုံး ညီမျှတာက သင့်ရဲ့ `main.tsx` file ပဲ ဖြစ်ပါတယ်။ ဒီအဆင့်မှာ — သင့် application ရဲ့ entrypoint ကို စနစ်ထည့်သွင်းသွားပါမယ်။

1. **သင့် `app` directory ထဲမှာ `[[...slug]]` directory တစ်ခု ဖန်တီးပါ။**

ဒီ guide မှာ ကျွန်တော်တို့ ပထမဆုံး ရည်ရွယ်တာက ကျွန်တော်တို့ရဲ့ Next.js ကို SPA (Single Page Application) တစ်ခုအနေနဲ့ တည်ဆောက်ဖို့ ဖြစ်လို့ — သင့် application ရဲ့ route တွေ အားလုံးကို ဖမ်းယူနိုင်ဖို့ page entrypoint တစ်ခု လိုအပ်ပါတယ်။ အဲဒါအတွက် — သင့် `app` directory ထဲမှာ `[[...slug]]` directory အသစ်တစ်ခု ဖန်တီးပါ။

ဒီ directory ကို [optional catch-all route segment](/docs/nextjs/file-conventions-dynamic-routes) လို့ ခေါ်ပါတယ်။ Next.js က file-system အခြေပြု router ကို သုံးပြီး — folders တွေနဲ့ routes တွေကို သတ်မှတ်ပါတယ်။ ဒီ အထူး directory က သင့် application ရဲ့ route အားလုံးကို သူ့ထဲမှာ ပါဝင်တဲ့ `page.tsx` file ဆီ ဦးတည်သွားစေမှာ သေချာစေပါတယ်။

2. **`app/[[...slug]]` directory ထဲမှာ အောက်ပါ content တွေနဲ့ `page.tsx` file အသစ်တစ်ခု ဖန်တီးပါ:**

```tsx filename="app/[[...slug]]/page.tsx" switcher
import '../../index.css'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // We'll update this
}
```

```jsx filename="app/[[...slug]]/page.js" switcher
import '../../index.css'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return '...' // We'll update this
}
```

> **သိထားသင့်သည်**: Page files တွေအတွက် `.js`, `.jsx` (သို့) `.tsx` extensions တွေကို သုံးနိုင်ပါတယ်။

ဒီ file က [Server Component](/docs/nextjs/server-client-components) တစ်ခု ဖြစ်ပါတယ်။ `next build` run လုပ်တဲ့အခါ — file ကို static asset တစ်ခုအဖြစ် ကြိုတင် render (prerender) လုပ်ပါတယ်။ ၎င်းက dynamic code တစ်ခုမှ မလိုအပ်ပါဘူး။

ဒီ file က ကျွန်တော်တို့ရဲ့ global CSS ကို import လုပ်ပြီး — [`generateStaticParams`](/docs/nextjs/generate-static-params) ကို သုံးပြီး route တစ်ခုတည်း — `/` မှာရှိတဲ့ index route ကိုပဲ generate လုပ်မယ်လို့ ပြောပါတယ်။

အခု — client-only အဖြစ် run မယ့် ကျွန်တော်တို့ရဲ့ Vite application ရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းတွေကို ရွှေ့လိုက်ရအောင်။

```tsx filename="app/[[...slug]]/client.tsx" switcher
'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

```jsx filename="app/[[...slug]]/client.js" switcher
'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return <App />
}
```

ဒီ file က `'use client'` directive နဲ့ သတ်မှတ်ထားတဲ့ [Client Component](/docs/nextjs/server-client-components) တစ်ခု ဖြစ်ပါတယ်။ Client Components တွေကို client ဆီ မပို့ခင် server ပေါ်မှာ [HTML အဖြစ် ကြိုတင် render (prerender)](/docs/nextjs/server-client-components) လုပ်ထားဆဲ ဖြစ်ပါတယ်။

ကျွန်တော်တို့က client-only application တစ်ခုနဲ့ စတင်ချင်တာမို့ — `App` component ကနေ အောက်ပိုင်း (down) ကို prerendering ပိတ်ထားဖို့ Next.js ကို configure လုပ်နိုင်ပါတယ်။

```tsx
const App = dynamic(() => import('../../App'), { ssr: false })
```

အခု — component အသစ်ကို သုံးဖို့ သင့် entrypoint page ကို update လုပ်ပါ:

```tsx filename="app/[[...slug]]/page.tsx" switcher
import '../../index.css'
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

```jsx filename="app/[[...slug]]/page.js" switcher
import '../../index.css'
import { ClientOnly } from './client'

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default function Page() {
  return <ClientOnly />
}
```

### အဆင့် 6: Static image imports တွေကို update လုပ်ခြင်း

Next.js က static image imports တွေကို Vite နဲ့ နည်းနည်း ကွဲပြားစွာ ကိုင်တွယ်ပါတယ်။ Vite မှာ — image file တစ်ခုကို import လုပ်ရင် သူ့ရဲ့ public URL ကို string တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်:

```tsx filename="App.tsx"
import image from './img.png' // `image` will be '/assets/img.2d8efhg.png' in production

export default function App() {
  return <img src={image} />
}
```

Next.js မှာတော့ — static image imports တွေက object တစ်ခုကို ပြန်ပေးပါတယ်။ အဲဒီ object ကို Next.js ရဲ့ [`<Image>` component](/docs/nextjs/component-image) နဲ့ တိုက်ရိုက် သုံးနိုင်သလို — သင့် လက်ရှိ `<img>` tag နဲ့ဆို object ရဲ့ `src` property ကို သုံးနိုင်ပါတယ်။

`<Image>` component မှာ [automatic image optimization](/docs/nextjs/component-image) ဆိုတဲ့ အပိုအကျိုးကျေးဇူးတွေ ရှိပါတယ်။ `<Image>` component က image ရဲ့ dimensions အပေါ် မူတည်ပြီး ရလာတဲ့ `<img>` ရဲ့ `width` နဲ့ `height` attributes တွေကို အလိုအလျောက် သတ်မှတ်ပေးပါတယ်။ ဒါက image load လုပ်တဲ့အခါ layout shifts တွေ မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။ ဒါပေမယ့် — သင့် app ထဲမှာ image တစ်ခုရဲ့ dimension တစ်ခုတည်းကိုပဲ style လုပ်ထားပြီး နောက်တစ်ခုကို `auto` မလုပ်ထားတဲ့ images တွေ ရှိနေရင် ပြဿနာ ဖြစ်စေနိုင်ပါတယ်။ `auto` လုပ်မထားတဲ့အခါ — dimension က `<img>` ရဲ့ dimension attribute ရဲ့ တန်ဖိုးကို default အနေနဲ့ ယူလို့ image က ပုံပျက်ပြီး ပေါ်နိုင်ပါတယ်။

`<img>` tag ကို ဆက်ထားတာက သင့် application ထဲမှာ ပြောင်းလဲမှု အရေအတွက်ကို လျှော့ချပေးပြီး အထက်က ပြဿနာတွေကိုလည်း ကာကွယ်ပေးပါတယ်။ နောက်ပိုင်းမှာ — [loader တစ်ခု configure လုပ်ခြင်း](/docs/nextjs/component-image) အားဖြင့် (သို့) automatic image optimization ပါတဲ့ default Next.js server ဆီ ရွှေ့ပြီး — images တွေကို optimize လုပ်ဖို့ `<Image>` component ဆီ ရွေးချယ် ပြောင်းရွှေ့နိုင်ပါတယ်။

1. **`/public` ကနေ import လုပ်ထားတဲ့ images တွေရဲ့ absolute import paths တွေကို relative imports အဖြစ် ပြောင်းပါ:**

```tsx
// Before
import logo from '/logo.png'

// After
import logo from '../public/logo.png'
```

2. **Image object တစ်ခုလုံး အစား — image ရဲ့ `src` property ကို သင့် `<img>` tag ဆီ ပို့ပါ:**

```tsx
// Before
<img src={logo} />

// After
<img src={logo.src} />
```

တနည်းအားဖြင့် — filename အပေါ် မူတည်ပြီး image asset ရဲ့ public URL ကို ရည်ညွှန်းနိုင်ပါတယ်။ ဥပမာ — `public/logo.png` က သင့် application အတွက် image ကို `/logo.png` မှာ ဆာဗာလုပ်ပေးမှာဖြစ်ပြီး — အဲဒါက `src` value ဖြစ်သွားပါလိမ့်မယ်။

> **သတိပေးချက်:** TypeScript သုံးနေတယ်ဆိုရင် — `src` property ကို ဝင်ရောက်တဲ့အခါ type errors တွေ ကြုံရနိုင်ပါတယ်။ အခုအချိန်မှာတော့ အဲဒါတွေကို စိတ်ချစွာ လျစ်လျူရှုနိုင်ပါတယ်။ ဒီ guide ရဲ့ အဆုံးမှာ ပြုပြင်ပြီးသား ဖြစ်သွားပါလိမ့်မယ်။

### အဆင့် 7: Environment variables တွေကို ပြောင်းရွှေ့ခြင်း

Next.js က `.env` [environment variables](/docs/nextjs/environment-variables) တွေကို Vite နဲ့ ဆင်တူစွာ ထောက်ပံ့ပေးပါတယ်။ အဓိက ကွာခြားချက်ကတော့ — client-side မှာ environment variables တွေကို ထုတ်ဖော်ဖို့ သုံးတဲ့ prefix ပဲ ဖြစ်ပါတယ်။

- `VITE_` prefix ပါတဲ့ environment variables တွေ အားလုံးကို `NEXT_PUBLIC_` အဖြစ် ပြောင်းလဲပါ။

Turbopack က Vite ရဲ့ built-in `import.meta.env.MODE`, `DEV`, `PROD`, `BASE_URL` နဲ့ `SSR` properties တွေကို — ဘာမှ ပြောင်းစရာ မလိုဘဲ ထောက်ပံ့ပေးပါတယ်။ `BASE_URL` က Next.js ရဲ့ [`basePath`](/docs/nextjs/next-config-base-path) configuration ကို ထင်ဟပ်ပြီး — Vite ရဲ့ format နဲ့ ကိုက်ညီအောင် trailing slash တစ်ခု ပါဝင်ပါတယ်။

**`import.meta.glob`** ကို Turbopack (default Next.js bundler) က — ဘာမှ ပြောင်းစရာ မလိုဘဲ ထောက်ပံ့ပေးပါတယ်။ Vite 5 မှာ deprecated ဖြစ်ခဲ့တဲ့ `as` option ကို သုံးနေတယ်ဆိုရင် — အဲဒါကို `query` နဲ့ အစားထိုးပါ:

```js
// Before (Vite)
const modules = import.meta.glob('./dir/*.txt', { as: 'raw' })

// After (Next.js / Turbopack)
const modules = import.meta.glob('./dir/*.txt', { query: '?raw' })
```

API အပြည့်အစုံအတွက် [import.meta.glob docs](https://nextjs.org/docs/app/api-reference/turbopack#importmetaglob) ကို ကြည့်ပါ။

သင့် Vite application က custom base URL တစ်ခုကို configure လုပ်ထားတယ်ဆိုရင် — သင့် `next.config.mjs` file ထဲမှာ ညီမျှတဲ့ [`basePath`](/docs/nextjs/next-config-base-path) ကို သတ်မှတ်ပါ:

```js filename="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Outputs a Single-Page Application (SPA).
  distDir: './dist', // Changes the build output directory to `./dist/`.
  basePath: '/some-base-path',
}

export default nextConfig
```

### အဆင့် 8: `package.json` ထဲက scripts တွေကို update လုပ်ခြင်း

အခုဆို သင် Next.js ဆီ အောင်မြင်စွာ ပြောင်းရွှေ့ပြီးလား စမ်းသပ်ဖို့ သင့် application ကို run လုပ်နိုင်ပါပြီ။ ဒါပေမယ့် — အရင်ဆုံး သင့် `package.json` ထဲက `scripts` တွေကို Next.js နဲ့ ဆက်စပ်တဲ့ commands တွေနဲ့ update လုပ်ပြီး — `.next` နဲ့ `next-env.d.ts` တွေကို သင့် `.gitignore` ထဲမှာ ထည့်ဖို့ လိုပါတယ်:

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

```txt filename=".gitignore"
# ...
.next
next-env.d.ts
dist
```

အခု `npm run dev` ကို run လုပ်ပြီး [`http://localhost:3000`](http://localhost:3000) ကို ဖွင့်ကြည့်ပါ။ သင့် application က ခုဆို Next.js ပေါ်မှာ run နေတာကို မြင်ရပါလိမ့်မယ်။

> **ဥပမာ:** Vite application တစ်ခုကို Next.js ဆီ ပြောင်းရွှေ့ထားတဲ့ အလုပ်လုပ်တဲ့ ဥပမာတစ်ခုအတွက် [ဒီ pull request](https://github.com/inngest/vite-to-nextjs/pull/1) ကို ကြည့်ပါ။

### အဆင့် 9: ရှင်းလင်းရေး (Clean Up)

အခု Vite နဲ့ ဆက်စပ်နေတဲ့ artifacts တွေကနေ သင့် codebase ကို ရှင်းလင်းနိုင်ပါပြီ:

- `main.tsx` ကို ဖျက်ပါ
- `index.html` ကို ဖျက်ပါ
- `vite-env.d.ts` ကို ဖျက်ပါ
- `tsconfig.node.json` ကို ဖျက်ပါ
- `vite.config.ts` ကို ဖျက်ပါ
- Vite dependencies တွေကို uninstall လုပ်ပါ

## နောက်တစ်ဆင့်များ (Next Steps)

အစီအစဉ်အတိုင်း အားလုံး အဆင်ပြေသွားတယ်ဆိုရင် — သင့်မှာ single-page application တစ်ခုအနေနဲ့ အလုပ်လုပ်နေတဲ့ Next.js application တစ်ခု အခု ရှိနေပါပြီ။ ဒါပေမယ့် — Next.js ရဲ့ အကျိုးကျေးဇူး အများစုကို သင်မရသေးပါဘူး။ အခုကစပြီး အကျိုးကျေးဇူးတွေ အားလုံး ရဖို့ တဖြည်းဖြည်းချင်း ပြောင်းလဲမှုတွေ စတင်လုပ်နိုင်ပါတယ်။ နောက်ထပ် လုပ်ချင်စရာတွေကတော့:

- React Router ကနေ [Next.js App Router](https://nextjs.org/docs/app) ဆီ ပြောင်းရွှေ့ပါ:
  - Automatic code splitting
  - [Streaming Server-Rendering](/docs/nextjs/file-conventions-loading)
  - [React Server Components](/docs/nextjs/server-client-components)
- [images တွေကို `<Image>` component နဲ့ optimize လုပ်ပါ](/docs/nextjs/component-image)
- [fonts တွေကို `next/font` နဲ့ optimize လုပ်ပါ](/docs/nextjs/component-font)
- [third-party scripts တွေကို `<Script>` component နဲ့ optimize လုပ်ပါ](https://nextjs.org/docs/app/guides/scripts)
- [Next.js rules တွေကို ထောက်ပံ့ဖို့ သင့် ESLint configuration ကို update လုပ်ပါ](https://nextjs.org/docs/app/api-reference/config/eslint)
