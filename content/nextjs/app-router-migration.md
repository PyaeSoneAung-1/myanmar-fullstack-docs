---
title: "Pages Router ကနေ App Router သို့ ပြောင်းရွှေ့ခြင်း (How to migrate from Pages to the App Router)"
description: "သင့် ရှိပြီးသား Next.js application ကို Pages Router ကနေ App Router ဆီ ဘယ်လို upgrade လုပ်ပြီး တစ်ဆင့်ချင်း ပြောင်းရွှေ့မလဲ ဆိုတာ လေ့လာပါ။"
order: 239
source: "https://nextjs.org/docs/app/guides/migrating/app-router-migration"
status: translated
updated: 2026-09-03
---

ဒီ guide က အောက်ပါတို့အတွက် သင့်ကို ကူညီပေးပါလိမ့်မယ်:

- သင့် Next.js application ကို version 12 ကနေ 13 ဆီ update လုပ်ခြင်း
- `pages` ရော `app` directory နှစ်ခုလုံးမှာ အလုပ်လုပ်တဲ့ features အသစ်တွေကို upgrade လုပ်ခြင်း
- သင့် ရှိပြီးသား application ကို `pages` ကနေ `app` ဆီ တစ်ဆင့်ချင်း (incrementally) ပြောင်းရွှေ့ခြင်း

## Upgrade လုပ်ခြင်း (Upgrading)

### Node.js Version (Node.js ဗားရှင်း)

အနည်းဆုံး Node.js version က အခု **v18.17** ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် [Node.js documentation](https://nodejs.org/docs/latest-v18.x/api/) ကို ကြည့်ပါ။

### Next.js Version (Next.js ဗားရှင်း)

Next.js version 13 ဆီ update လုပ်ဖို့ — သင်နှစ်သက်ရာ package manager ကို သုံးပြီး အောက်ပါ command ကို run လုပ်ပါ:

```bash package="pnpm"
pnpm add next@latest react@latest react-dom@latest
```

```bash package="npm"
npm install next@latest react@latest react-dom@latest
```

```bash package="yarn"
yarn add next@latest react@latest react-dom@latest
```

```bash package="bun"
bun add next@latest react@latest react-dom@latest
```

### ESLint Version (ESLint ဗားရှင်း)

ESLint သုံးနေတယ်ဆိုရင် — သင့် ESLint version ကို upgrade လုပ်ဖို့ လိုအပ်ပါတယ်:

```bash package="pnpm"
pnpm add -D eslint-config-next@latest
```

```bash package="npm"
npm install -D eslint-config-next@latest
```

```bash package="yarn"
yarn add -D eslint-config-next@latest
```

```bash package="bun"
bun add -D eslint-config-next@latest
```

> **သိထားသင့်သည် (Good to know):** ESLint အပြောင်းအလဲတွေ အကျိုးသက်ရောက်ဖို့ VS Code ထဲက ESLint server ကို restart လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။ Command Palette ကို ဖွင့်ပါ (`cmd+shift+p` — Mac မှာ; `ctrl+shift+p` — Windows မှာ) ပြီးတော့ `ESLint: Restart ESLint Server` ကို ရှာပါ။

## နောက်ထပ် အဆင့်များ (Next Steps)

Update လုပ်ပြီးပြီဆိုရင် — နောက်ထပ် အဆင့်တွေအတွက် အောက်ပါ section တွေကို ကြည့်ပါ:

- **Feature အသစ်များ Upgrade လုပ်ခြင်း:** ပိုကောင်းလာတဲ့ Image နဲ့ Link Components လို features အသစ်တွေဆီ upgrade လုပ်ဖို့ လမ်းညွှန်တစ်ခု။
- **`pages` ကနေ `app` directory ဆီ ပြောင်းရွှေ့ခြင်း:** `pages` ကနေ `app` directory ဆီ တစ်ဆင့်ချင်း ပြောင်းရွှေ့ဖို့ ကူညီပေးတဲ့ အဆင့်ဆင့် လမ်းညွှန်တစ်ခု။

## Feature အသစ်များ Upgrade လုပ်ခြင်း (Upgrading New Features)

Next.js 13 က [App Router](https://nextjs.org/docs/app) အသစ်ကို features အသစ်တွေနဲ့ conventions အသစ်တွေနဲ့အတူ မိတ်ဆက်ခဲ့ပါတယ်။ Router အသစ်က `app` directory ထဲမှာ ရရှိနိုင်ပြီး — `pages` directory နဲ့အတူ တွဲဖက် တည်ရှိနိုင်ပါတယ်။

Next.js 13 ဆီ upgrade လုပ်တာက App Router ကို သုံးဖို့ **မလိုအပ်ပါဘူး**။ directory နှစ်ခုလုံးမှာ အလုပ်လုပ်တဲ့ features အသစ်တွေ — update လုပ်ထားတဲ့ **Image component**, **Link component**, **Script component**, **Font optimization** — တွေနဲ့အတူ `pages` ကို ဆက်သုံးနိုင်ပါတယ်။

### Image Component (`<Image/>`)

Next.js 12 က Image Component အတွက် တိုးတက်မှုအသစ်တွေကို ယာယီ import — `next/future/image` — နဲ့ မိတ်ဆက်ခဲ့ပါတယ်။ ဒီတိုးတက်မှုတွေထဲမှာ client-side JavaScript လျှော့ချခြင်း၊ images တွေကို ချဲ့ထွင်ပြီး style လုပ်ရတာ လွယ်ကူစေခြင်း၊ accessibility ပိုကောင်းစေခြင်း၊ native browser lazy loading တို့ ပါဝင်ပါတယ်။

Version 13 မှာတော့ ဒီအပြုအမူအသစ်က `next/image` အတွက် default ဖြစ်သွားပါပြီ။

Image Component အသစ်ဆီ ပြောင်းရွှေ့ဖို့ codemod နှစ်ခု ရှိပါတယ်:

- [**`next-image-to-legacy-image` codemod**](/docs/nextjs/upgrading-codemods): `next/image` imports တွေကို `next/legacy/image` အဖြစ် ဘေးကင်းစွာ အလိုအလျောက် အမည်ပြောင်းပေးပါတယ်။ ရှိပြီးသား components တွေက အပြုအမူ အတိုင်းပဲ ဆက်ရှိနေပါလိမ့်မယ်။
- [**`next-image-experimental` codemod**](/docs/nextjs/upgrading-codemods): Inline styles တွေကို ထည့်ပေးပြီး အသုံးမလိုတော့တဲ့ props တွေကို ဖယ်ရှားပေးပါတယ် — ဒါက သတိထားရမယ့် (dangerous) အပြောင်းအလဲတစ်ခုပါ။ ဒါက ရှိပြီးသား components တွေရဲ့ အပြုအမူကို default အသစ်တွေနဲ့ ကိုက်ညီအောင် ပြောင်းလဲပေးပါလိမ့်မယ်။ ဒီ codemod ကို သုံးဖို့ — အရင် `next-image-to-legacy-image` codemod ကို run လုပ်ထားဖို့ လိုအပ်ပါတယ်။

### Link Component (`<Link>`)

[`<Link>` Component](/docs/nextjs/component-link) က child အဖြစ် `<a>` tag တစ်ခုကို လက်နဲ့ ထည့်ပေးဖို့ မလိုအပ်တော့ပါဘူး။ ဒီအပြုအမူကို [version 12.2](https://nextjs.org/blog/next-12-2) မှာ experimental option အဖြစ် ထည့်ခဲ့ပြီး — အခု default ဖြစ်လာပါပြီ။ Next.js 13 မှာ `<Link>` က `<a>` ကို အမြဲတမ်း render လုပ်ပြီး — အောက်ခံ tag ဆီ props တွေ forward လုပ်ဖို့လည်း ခွင့်ပြုပါတယ်။

ဥပမာ:

```jsx
import Link from 'next/link'

// Next.js 12: `<a>` ကို nested လုပ်ထားမှသာ ပါဝင်မှာ ဖြစ်ပါတယ်
<Link href="/about">
  <a>About</a>
</Link>

// Next.js 13: `<Link>` က `<a>` ကို အောက်ခံမှာ အမြဲတမ်း render လုပ်ပါတယ်
<Link href="/about">
  About
</Link>
```

သင့် links တွေကို Next.js 13 ဆီ upgrade လုပ်ဖို့ — [`new-link` codemod](/docs/nextjs/upgrading-codemods) ကို သုံးနိုင်ပါတယ်။

### Script Component (`<Script>`)

[`next/script`](/docs/nextjs/component-script) ရဲ့ အပြုအမူကို `pages` ရော `app` ပါ ထောက်ပံ့အောင် update လုပ်ထားပါတယ် — ဒါပေမယ့် ချောမွေ့တဲ့ migration ရဖို့ ပြောင်းလဲမှုအချို့ လိုအပ်ပါတယ်:

- အရင်က `_document.js` ထဲမှာ ထည့်ထားခဲ့တဲ့ `beforeInteractive` scripts တွေကို [root layout](/docs/nextjs/file-conventions-layout#root-layout) — ဥပမာ `app/layout.tsx` (သို့) `app/[locale]/layout.tsx` — တစ်ခုဆီ ရွှေ့ပါ။
- Experimental `worker` strategy က `app` မှာ အလုပ်မလုပ်သေးပါဘူး — ဒီ strategy နဲ့ မှတ်သားထားတဲ့ scripts တွေကို ဖယ်ရှားရမှာ (သို့) တခြား strategy တစ်ခု (ဥပမာ `lazyOnload`) သုံးအောင် ပြုပြင်ရပါမယ်။
- `onLoad`, `onReady`, `onError` handlers တွေက Server Components တွေမှာ အလုပ်မလုပ်ပါဘူး — ဒါတွေကို [Client Component](/docs/nextjs/server-client-components) တစ်ခုဆီ ရွှေ့ပါ (သို့) လုံးဝ ဖယ်ရှားပစ်ပါ။

### Font Optimization (fonts များကို optimize လုပ်ခြင်း)

အရင်က Next.js က [font CSS တွေကို inline လုပ်ခြင်း](/docs/nextjs/component-font) အားဖြင့် fonts တွေကို optimize လုပ်ပေးခဲ့ပါတယ်။ Version 13 ကတော့ [`next/font`](/docs/nextjs/component-font) module အသစ်ကို မိတ်ဆက်ပေးပြီး — performance ကောင်းကောင်းနဲ့ privacy ကိုပါ ထိန်းသိမ်းထားရင်း သင့် font loading experience ကို စိတ်ကြိုက် ပြင်ဆင်နိုင်စေပါတယ်။ `next/font` ကို `pages` ရော `app` directory နှစ်ခုလုံးမှာ ထောက်ပံ့ပါတယ်။

[CSS inline လုပ်ခြင်း](/docs/nextjs/component-font) က `pages` မှာ အလုပ်လုပ်နေဆဲ ဖြစ်ပေမယ့် — `app` မှာတော့ အလုပ်မလုပ်ပါဘူး။ အဲဒီအစား [`next/font`](/docs/nextjs/component-font) ကို သုံးသင့်ပါတယ်။

`next/font` ကို ဘယ်လို သုံးရမလဲ ဆိုတာ သိဖို့ [Font Optimization](/docs/nextjs/component-font) page ကို ကြည့်ပါ။

## `pages` ကနေ `app` သို့ ပြောင်းရွှေ့ခြင်း (Migrating from `pages` to `app`)

> **🎥 ကြည့်ရှုရန် (Watch):** App Router ကို တစ်ဆင့်ချင်း စတင်သုံးနည်း → [YouTube (16 minutes)](https://www.youtube.com/watch?v=YQMSietiFm0)။

App Router ဆီ ပြောင်းရွှေ့တာက — Next.js က အောက်ခံအဖြစ် တည်ဆောက်ထားတဲ့ Server Components, Suspense စတဲ့ React features တွေကို ပထမဆုံးအကြိမ် အသုံးပြုရတဲ့ အချိန်မျိုး ဖြစ်နိုင်ပါတယ်။ [Special files](https://nextjs.org/docs/app/api-reference/file-conventions) နဲ့ [layouts](/docs/nextjs/file-conventions-layout) လို Next.js features အသစ်တွေနဲ့ ပေါင်းလိုက်တဲ့အခါ — migration ဆိုတာ concepts အသစ်တွေ၊ mental models အသစ်တွေနဲ့ behavioral changes တွေကို လေ့လာရတဲ့ ကိစ္စ ဖြစ်လာပါတယ်။

ဒီ updates တွေရဲ့ ပေါင်းစပ် ရှုပ်ထွေးမှုကို လျှော့ချဖို့ — သင့် migration ကို အဆင့်ငယ်လေးတွေ ခွဲပြီး လုပ်ဖို့ အကြံပြုပါတယ်။ `app` directory ကို `pages` directory နဲ့ တစ်ပြိုင်နက် အလုပ်လုပ်နိုင်အောင် ရည်ရွယ်ချက်ရှိရှိ ဒီဇိုင်းထားပြီး — page တစ်ခုချင်းစီအလိုက် incremental migration လုပ်နိုင်စေပါတယ်။

- `app` directory က nested routes _နဲ့_ layouts တွေကို ထောက်ပံ့ပါတယ်။ [ပိုလေ့လာပါ](https://nextjs.org/docs/app/getting-started/layouts-and-pages)။
- Route segment တစ်ခုကို public ဝင်ရောက်နိုင်အောင် — nested folders တွေနဲ့ routes တွေကို သတ်မှတ်ပြီး `page.js` special file တစ်ခု သုံးပါ။
- Route segment တစ်ခုချင်းစီအတွက် UI ဖန်တီးဖို့ [special file conventions](https://nextjs.org/docs/app/api-reference/file-conventions) တွေကို သုံးပါတယ်။ အသုံးအများဆုံး special files တွေက `page.js` နဲ့ `layout.js` ပါ။
  - `page.js` ကို route တစ်ခုအတွက် သီးသန့် UI သတ်မှတ်ဖို့ သုံးပါတယ်။
  - `layout.js` ကို routes အများအပြားကြားမှာ မျှဝေတဲ့ UI သတ်မှတ်ဖို့ သုံးပါတယ်။
  - Special files တွေအတွက် `.js`, `.jsx`, (သို့) `.tsx` file extensions တွေ သုံးနိုင်ပါတယ်။
- Components, styles, tests စတဲ့ တခြား files တွေကိုလည်း `app` directory ထဲမှာ တွဲထည့် (colocate) လုပ်နိုင်ပါတယ်။ [ပိုလေ့လာပါ](https://nextjs.org/docs/app)。
- `getServerSideProps` နဲ့ `getStaticProps` လို data fetching functions တွေကို `app` ထဲမှာ [API အသစ်](https://nextjs.org/docs/app/getting-started/fetching-data) တစ်ခုနဲ့ အစားထိုးလိုက်ပါပြီ။ `getStaticPaths` ကို [`generateStaticParams`](/docs/nextjs/generate-static-params) နဲ့ အစားထိုးပါတယ်။
- `pages/_app.js` နဲ့ `pages/_document.js` တွေကို `app/layout.js` root layout တစ်ခုတည်းနဲ့ အစားထိုးပါတယ်။ [ပိုလေ့လာပါ](/docs/nextjs/file-conventions-layout#root-layout)。
- `pages/_error.js` ကို ပိုမို granular ဖြစ်တဲ့ `error.js` special files တွေနဲ့ အစားထိုးပါတယ်။ [ပိုလေ့လာပါ](/docs/nextjs/error-handling)。
- `pages/404.js` ကို [`not-found.js`](/docs/nextjs/not-found) file နဲ့ အစားထိုးပါတယ်။
- `pages/api/*` API Routes တွေကို [`route.js`](/docs/nextjs/file-conventions-route) (Route Handler) special file နဲ့ အစားထိုးပါတယ်။

### အဆင့် 1 — `app` directory ဖန်တီးခြင်း (Step 1: Creating the `app` directory)

နောက်ဆုံး Next.js version ဆီ update လုပ်ပါ (13.4 (သို့) ပိုမြင့်တဲ့ version လိုအပ်ပါတယ်):

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

ပြီးရင် သင့် project ရဲ့ root မှာ (သို့) `src/` directory ထဲမှာ `app` directory အသစ်တစ်ခု ဖန်တီးပါ။

### အဆင့် 2 — Root Layout ဖန်တီးခြင်း (Step 2: Creating a Root Layout)

`app` directory ထဲမှာ `app/layout.tsx` file အသစ်တစ်ခု ဖန်တီးပါ။ ဒါက `app` ထဲက routes အားလုံးကို သက်ရောက်မယ့် [root layout](/docs/nextjs/file-conventions-layout#root-layout) တစ်ခု ဖြစ်ပါတယ်။

```tsx filename="app/layout.tsx" switcher
export default function RootLayout({
  // Layouts တွေက children prop တစ်ခုကို လက်ခံရပါမယ်။
  // ဒါကို nested layouts (သို့) pages တွေနဲ့ ဖြည့်ပေးပါလိမ့်မယ်
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

```jsx filename="app/layout.js" switcher
export default function RootLayout({
  // Layouts တွေက children prop တစ်ခုကို လက်ခံရပါမယ်။
  // ဒါကို nested layouts (သို့) pages တွေနဲ့ ဖြည့်ပေးပါလိမ့်မယ်
  children,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- `app` directory မှာ root layout တစ်ခု **မဖြစ်မနေ** ပါဝင်ရပါမယ်။
- Root layout က `html` နဲ့ `body` tags တွေကို သတ်မှတ်ပေးရပါမယ် — Next.js က ဒါတွေကို အလိုအလျောက် ဖန်တီးမပေးလို့ပါ။
- Root layout က `pages/_app.tsx` နဲ့ `pages/_document.tsx` files တွေနေရာကို အစားထိုးပါတယ်။
- Layout files တွေအတွက် `.js`, `.jsx`, (သို့) `.tsx` extensions တွေ သုံးနိုင်ပါတယ်။

`<head>` HTML elements တွေကို စီမံဖို့ — [built-in SEO support](/docs/nextjs/metadata-and-og-images) ကို သုံးနိုင်ပါတယ်:

```tsx filename="app/layout.tsx" switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
}
```

```jsx filename="app/layout.js" switcher
export const metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
}
```

#### `_document.js` နဲ့ `_app.js` များကို ပြောင်းရွှေ့ခြင်း (Migrating `_document.js` and `_app.js`)

`_app` (သို့) `_document` file တစ်ခု ရှိပြီးသားဆိုရင် — contents တွေ (ဥပမာ global styles) ကို root layout (`app/layout.tsx`) ဆီ copy လုပ်နိုင်ပါတယ်။ `app/layout.tsx` ထဲက styles တွေက `pages/*` ကို _သက်ရောက်မှာ မဟုတ်ပါဘူး_။ Migration ကာလအတွင်း သင့် `pages/*` routes တွေ မပျက်စီးအောင် — `_app`/`_document` တွေကို ဆက်ထားသင့်ပါတယ်။ အပြည့်အဝ ပြောင်းရွှေ့ပြီးတာနဲ့ — ဒါတွေကို ဘေးကင်းစွာ ဖျက်နိုင်ပါတယ်။

React Context providers တွေ သုံးနေတယ်ဆိုရင် — ဒါတွေကို [Client Component](/docs/nextjs/server-client-components) တစ်ခုဆီ ရွှေ့ဖို့ လိုအပ်ပါလိမ့်မယ်။

#### `getLayout()` pattern ကို Layouts ဆီ ပြောင်းရွှေ့ခြင်း (Optional)

Next.js က `pages` directory ထဲမှာ per-page layouts ရဖို့ [Page components တွေဆီ property တစ်ခု ထည့်တဲ့](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#layout-pattern) နည်းလမ်းကို အကြံပြုခဲ့ပါတယ်။ ဒီ pattern ကို `app` directory ထဲက [nested layouts](/docs/nextjs/file-conventions-layout) အတွက် native support နဲ့ အစားထိုးနိုင်ပါတယ်။

<details>

<summary>မပြောင်းမီ နဲ့ ပြောင်းပြီး ဥပမာကို ကြည့်ရန်</summary>

**မပြောင်းမီ (Before)**

```jsx filename="components/DashboardLayout.js"
export default function DashboardLayout({ children }) {
  return (
    <div>
      <h2>My Dashboard</h2>
      {children}
    </div>
  )
}
```

```jsx filename="pages/dashboard/index.js"
import DashboardLayout from '../components/DashboardLayout'

export default function Page() {
  return <p>My Page</p>
}

Page.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}
```

**ပြောင်းပြီး (After)**

- `pages/dashboard/index.js` ကနေ `Page.getLayout` property ကို ဖယ်ရှားပြီး — အောက်က Pages များကို ပြောင်းရွှေ့ခြင်း အဆင့်တွေအတိုင်း `app` directory ဆီ ရွှေ့ပါ။

  ```jsx filename="app/dashboard/page.js"
  export default function Page() {
    return <p>My Page</p>
  }
  ```

- `DashboardLayout` ရဲ့ contents တွေကို `pages` directory အပြုအမူ ဆက်ထိန်းထားဖို့ [Client Component](/docs/nextjs/server-client-components) အသစ်တစ်ခုဆီ ရွှေ့ပါ။

  ```jsx filename="app/dashboard/DashboardLayout.js"
  'use client' // ဒီ directive က file ရဲ့ ထိပ်ဆုံးမှာ — imports တွေ မတိုင်ခင် — ရှိရပါမယ်။

  // ဒါက Client Component တစ်ခုပါ
  export default function DashboardLayout({ children }) {
    return (
      <div>
        <h2>My Dashboard</h2>
        {children}
      </div>
    )
  }
  ```

- `DashboardLayout` ကို `app` directory ထဲက `layout.js` file အသစ်တစ်ခုထဲမှာ import လုပ်ပါ။

  ```jsx filename="app/dashboard/layout.js"
  import DashboardLayout from './DashboardLayout'

  // ဒါက Server Component တစ်ခုပါ
  export default function Layout({ children }) {
    return <DashboardLayout>{children}</DashboardLayout>
  }
  ```

- `DashboardLayout.js` (Client Component) ရဲ့ non-interactive အစိတ်အပိုင်းတွေကို `layout.js` (Server Component) ထဲဆီ တစ်ဆင့်ချင်း ရွှေ့ပြီး — client ဆီ ပို့တဲ့ component JavaScript ပမာဏကို လျှော့ချနိုင်ပါတယ်။

</details>

### အဆင့် 3 — `next/head` ကို ပြောင်းရွှေ့ခြင်း (Step 3: Migrating `next/head`)

`pages` directory မှာ — `next/head` React component ကို `title` နဲ့ `meta` လို `<head>` HTML elements တွေကို စီမံဖို့ သုံးပါတယ်။ `app` directory မှာတော့ — `next/head` နေရာကို [built-in SEO support](/docs/nextjs/metadata-and-og-images) အသစ်နဲ့ အစားထိုးပါတယ်။

**မပြောင်းမီ (Before):**

```tsx filename="pages/index.tsx" switcher
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>My page title</title>
      </Head>
    </>
  )
}
```

```jsx filename="pages/index.js" switcher
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>My page title</title>
      </Head>
    </>
  )
}
```

**ပြောင်းပြီး (After):**

```tsx filename="app/page.tsx" switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Page Title',
}

export default function Page() {
  return '...'
}
```

```jsx filename="app/page.js" switcher
export const metadata = {
  title: 'My Page Title',
}

export default function Page() {
  return '...'
}
```

[Metadata options တွေ အားလုံးကို ကြည့်ရန်](/docs/nextjs/generate-metadata)

### အဆင့် 4 — Pages များကို ပြောင်းရွှေ့ခြင်း (Step 4: Migrating Pages)

- [`app` directory](https://nextjs.org/docs/app) ထဲက pages တွေက default အနေနဲ့ [Server Components](/docs/nextjs/server-client-components) တွေ ဖြစ်ပါတယ်။ ဒါက — pages တွေ [Client Components](/docs/nextjs/server-client-components) တွေ ဖြစ်တဲ့ — `pages` directory နဲ့ မတူပါဘူး။
- `app` ထဲမှာ [data fetching](https://nextjs.org/docs/app/getting-started/fetching-data) ပြောင်းလဲသွားပါပြီ။ `getServerSideProps`, `getStaticProps` နဲ့ `getInitialProps` တွေကို ပိုရိုးရှင်းတဲ့ API တစ်ခုနဲ့ အစားထိုးပါတယ်။
- `app` directory က routes တွေကို nested folders တွေနဲ့ သတ်မှတ်ပြီး — route segment တစ်ခုကို public ဝင်ရောက်နိုင်အောင် `page.js` special file တစ်ခုက လုပ်ပေးပါတယ်။

| `pages` directory | `app` directory       | Route          |
| ----------------- | --------------------- | -------------- |
| `index.js`        | `page.js`             | `/`            |
| `about.js`        | `about/page.js`       | `/about`       |
| `blog/[slug].js`  | `blog/[slug]/page.js` | `/blog/post-1` |

Page တစ်ခုရဲ့ migration ကို အဓိက အဆင့်နှစ်ခုနဲ့ ခွဲလုပ်ဖို့ အကြံပြုပါတယ်:

- အဆင့် 1 — Default export လုပ်ထားတဲ့ Page Component ကို Client Component အသစ်တစ်ခုဆီ ရွှေ့ပါ။
- အဆင့် 2 — Client Component အသစ်ကို `app` directory ထဲက `page.js` file အသစ်တစ်ခုထဲမှာ import လုပ်ပါ။

> **သိထားသင့်သည် (Good to know):** ဒါက `pages` directory နဲ့ အပြုအမူအရ အနီးစပ်ဆုံး နှိုင်းယှဉ်နိုင်လို့ — အလွယ်ကူဆုံး migration path ဖြစ်ပါတယ်။

**အဆင့် 1 — Client Component အသစ်တစ်ခု ဖန်တီးပါ**

- `app` directory ထဲမှာ file သီးခြားတစ်ခု (ဥပမာ — `app/home-page.tsx` (သို့) အလားတူ) ဖန်တီးပြီး Client Component တစ်ခုကို export လုပ်ပါ။ Client Components တွေကို သတ်မှတ်ဖို့ — file ရဲ့ ထိပ်ဆုံးမှာ (imports တွေ မတိုင်ခင်) `'use client'` directive ကို ထည့်ပါ။
  - Pages Router မှာလိုပဲ — ကနဦး page load မှာ Client Components တွေကို static HTML အဖြစ် prerender လုပ်ဖို့ [optimization step](/docs/nextjs/server-client-components) တစ်ခု ရှိပါတယ်။
- Default export လုပ်ထားတဲ့ page component ကို `pages/index.js` ကနေ `app/home-page.tsx` ဆီ ရွှေ့ပါ။

```tsx filename="app/home-page.tsx" switcher
'use client'

// ဒါက Client Component တစ်ခုပါ (`pages` directory ထဲက components တွေလိုပဲ)
// Props တွေအနေနဲ့ data လက်ခံရရှိပြီး — state နဲ့ effects တွေကို ဝင်ရောက်သုံးနိုင်ကာ
// ကနဦး page load မှာ server ပေါ်မှာ prerender လုပ်ခံရပါတယ်
export default function HomePage({ recentPosts }) {
  return (
    <div>
      {recentPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

```jsx filename="app/home-page.js" switcher
'use client'

// ဒါက Client Component တစ်ခုပါ။ `pages` directory ထဲက Page components
// တွေလိုပဲ props တွေအနေနဲ့ data လက်ခံရရှိပြီး — state နဲ့ effects တွေကို
// ဝင်ရောက်သုံးနိုင်ပါတယ်
export default function HomePage({ recentPosts }) {
  return (
    <div>
      {recentPosts.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

**အဆင့် 2 — Page အသစ်တစ်ခု ဖန်တီးပါ**

- `app` directory ထဲမှာ `app/page.tsx` file အသစ်တစ်ခု ဖန်တီးပါ။ ဒါက default အနေနဲ့ Server Component တစ်ခု ဖြစ်ပါတယ်။
- `home-page.tsx` Client Component ကို page ထဲမှာ import လုပ်ပါ။
- `pages/index.js` မှာ data fetch လုပ်နေတယ်ဆိုရင် — [data fetching APIs](https://nextjs.org/docs/app/getting-started/fetching-data) အသစ်တွေကို သုံးပြီး data fetching logic ကို Server Component ထဲ တိုက်ရိုက် ရွှေ့လိုက်ပါ။ အသေးစိတ်အတွက် အောက်က Data Fetching Method များကို ပြောင်းရွှေ့ခြင်း အဆင့်ကို ကြည့်ပါ။

  ```tsx filename="app/page.tsx" switcher
  // သင့် Client Component ကို import လုပ်ပါ
  import HomePage from './home-page'

  async function getPosts() {
    const res = await fetch('https://...')
    const posts = await res.json()
    return posts
  }

  export default async function Page() {
    // Data တွေကို Server Component တစ်ခုထဲမှာ တိုက်ရိုက် fetch လုပ်ပါ
    const recentPosts = await getPosts()
    // Fetch လုပ်ထားတဲ့ data တွေကို သင့် Client Component ဆီ ပို့ပေးပါ
    return <HomePage recentPosts={recentPosts} />
  }
  ```

  ```jsx filename="app/page.js" switcher
  // သင့် Client Component ကို import လုပ်ပါ
  import HomePage from './home-page'

  async function getPosts() {
    const res = await fetch('https://...')
    const posts = await res.json()
    return posts
  }

  export default async function Page() {
    // Data တွေကို Server Component တစ်ခုထဲမှာ တိုက်ရိုက် fetch လုပ်ပါ
    const recentPosts = await getPosts()
    // Fetch လုပ်ထားတဲ့ data တွေကို သင့် Client Component ဆီ ပို့ပေးပါ
    return <HomePage recentPosts={recentPosts} />
  }
  ```

- သင့် page အရင်က `useRouter` သုံးထားတယ်ဆိုရင် — routing hooks အသစ်တွေဆီ update လုပ်ဖို့ လိုပါလိမ့်မယ်။ [ပိုလေ့လာပါ](/docs/nextjs/use-router)。
- Development server ကို စတင်ပြီး [`http://localhost:3000`](http://localhost:3000) ကို သွားကြည့်ပါ။ သင့် ရှိပြီးသား index route ကို — အခု app directory ကနေ serve လုပ်နေတာ — တွေ့ရပါလိမ့်မယ်။

### အဆင့် 5 — Routing Hooks များကို ပြောင်းရွှေ့ခြင်း (Step 5: Migrating Routing Hooks)

`app` directory ထဲက အပြုအမူအသစ်ကို ထောက်ပံ့ဖို့ router အသစ်တစ်ခု ထည့်လိုက်ပါပြီ။

`app` မှာ — `next/navigation` ကနေ import လုပ်တဲ့ hooks အသစ်သုံးခု — [`useRouter()`](/docs/nextjs/use-router), [`usePathname()`](/docs/nextjs/use-pathname), နဲ့ [`useSearchParams()`](/docs/nextjs/use-search-params) — ကို သုံးသင့်ပါတယ်။

- `useRouter` hook အသစ်ကို `next/navigation` ကနေ import လုပ်ပြီး — `pages` မှာ `next/router` ကနေ import လုပ်တဲ့ `useRouter` hook နဲ့ အပြုအမူ မတူပါဘူး။
  - [`next/router` ကနေ import လုပ်တဲ့ `useRouter` hook](https://nextjs.org/docs/pages/api-reference/functions/use-router) ကို `app` directory မှာ ထောက်ပံ့မထားပါဘူး — ဒါပေမယ့် `pages` directory မှာတော့ ဆက်သုံးနိုင်ပါတယ်။
- `useRouter` အသစ်က `pathname` string ကို ပြန်မပေးပါဘူး။ အဲဒီအစား သီးခြား `usePathname` hook ကို သုံးပါ။
- `useRouter` အသစ်က `query` object ကို ပြန်မပေးပါဘူး။ Search parameters နဲ့ dynamic route parameters တွေက အခု သီးခြားစီ ဖြစ်သွားပါပြီ — `useSearchParams` နဲ့ `useParams` hooks တွေကို သုံးပါ။
- Page ပြောင်းလဲမှုတွေကို နားထောင်ဖို့ `useSearchParams` နဲ့ `usePathname` တွေကို တွဲသုံးနိုင်ပါတယ်။ အသေးစိတ်အတွက် [Router Events](/docs/nextjs/use-router) section ကို ကြည့်ပါ။
- ဒီ hooks အသစ်တွေက Client Components တွေမှာပဲ ထောက်ပံ့ပါတယ်။ Server Components တွေမှာတော့ သုံးလို့ မရပါဘူး။

```tsx filename="app/example-client-component.tsx" switcher
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ...
}
```

```jsx filename="app/example-client-component.js" switcher
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ExampleClientComponent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ...
}
```

ထို့အပြင် — `useRouter` hook အသစ်မှာ အောက်ပါ အပြောင်းအလဲတွေ ရှိပါတယ်:

- `isFallback` ကို ဖယ်ရှားလိုက်ပါပြီ — `fallback` ကို အစားထိုးလိုက်လို့ပါ။
- `locale`, `locales`, `defaultLocales`, `domainLocales` values တွေကို ဖယ်ရှားလိုက်ပါပြီ — `app` directory မှာ built-in i18n Next.js features တွေ မလိုအပ်တော့လို့ပါ။ [i18n အကြောင်း ပိုလေ့လာပါ](/docs/nextjs/internationalization)。
- `basePath` ကို ဖယ်ရှားလိုက်ပါပြီ။ အစားထိုး option က `useRouter` ရဲ့ အစိတ်အပိုင်း ဖြစ်လာမှာ မဟုတ်ပါဘူး။ အခုထိ အကောင်အထည် မဖော်ရသေးပါဘူး။
- `asPath` ကို ဖယ်ရှားလိုက်ပါပြီ — `as` ဆိုတဲ့ concept ကို router အသစ်ကနေ ဖယ်ရှားလိုက်လို့ပါ။
- `isReady` ကို ဖယ်ရှားလိုက်ပါပြီ — ဒါက မလိုအပ်တော့လို့ပါ။ [Prerendering](https://nextjs.org/docs/app/glossary#prerendering) ကာလအတွင်းမှာ — [`useSearchParams()`](/docs/nextjs/use-search-params) hook ကို သုံးတဲ့ component တိုင်းက prerendering အဆင့်ကို ကျော်ပြီး — runtime မှာ client ပေါ်မှာ render လုပ်ပါလိမ့်မယ်။
- `route` ကို ဖယ်ရှားလိုက်ပါပြီ။ `usePathname` (သို့) `useSelectedLayoutSegments()` တွေက အစားထိုး ပေးပါတယ်။

[`useRouter()` API reference ကို ကြည့်ရန်](/docs/nextjs/use-router)

#### `pages` နဲ့ `app` အကြား components မျှဝေခြင်း (Sharing components between `pages` and `app`)

Components တွေကို `pages` ရော `app` routers နှစ်ခုလုံးနဲ့ လိုက်ဖက်အောင် ထားဖို့ — [`next/compat/router` ကနေ `useRouter` hook](https://nextjs.org/docs/pages/api-reference/functions/use-router#the-nextcompatrouter-export) ကို ကိုးကားပါ။ ဒါက `pages` directory ရဲ့ `useRouter` hook ဖြစ်ပေမယ့် — routers နှစ်ခုကြားမှာ components တွေ မျှဝေသုံးနေချိန်မှာ သုံးဖို့ ရည်ရွယ်ပါတယ်။ `app` router မှာပဲ သုံးတော့မယ်လို့ အသင့်ဖြစ်တာနဲ့ — [`next/navigation` ကနေ `useRouter` အသစ်](/docs/nextjs/use-router) ဆီ update လုပ်ပါ။

### အဆင့် 6 — Data Fetching Method များကို ပြောင်းရွှေ့ခြင်း (Step 6: Migrating Data Fetching Methods)

`pages` directory က pages တွေအတွက် data fetch လုပ်ဖို့ `getServerSideProps` နဲ့ `getStaticProps` တွေကို သုံးပါတယ်။ `app` directory ထဲမှာတော့ — ဒီ data fetching functions အဟောင်းတွေကို `fetch()` နဲ့ `async` React Server Components တွေအပေါ် တည်ဆောက်ထားတဲ့ [ပိုရိုးရှင်းတဲ့ API](https://nextjs.org/docs/app/getting-started/fetching-data) တစ်ခုနဲ့ အစားထိုးပါတယ်။

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  // ဒီ request အတွက် Next.js Data Cache ထဲ opt in လုပ်ပါတယ်။
  // Cached response ကို requests တွေကြားမှာ ပြန်သုံးနိုင်ပြီး — on-demand revalidate လုပ်နိုင်ပါတယ်။
  // `getStaticProps` နဲ့ ဆင်တူပါတယ်။
  const cachedData = await fetch('https://...', { cache: 'force-cache' })

  // ဒီ request အတွက် caching ကနေ opt out လုပ်ပါတယ်။
  // Next.js က request တိုင်းမှာ ဒီ data ကို data source ကနေ fetch လုပ်ပါတယ်။
  // ဒါက fetch ရဲ့ default အပြုအမူပါ။
  // `getServerSideProps` နဲ့ ဆင်တူပါတယ်။
  const uncachedData = await fetch('https://...', { cache: 'no-store' })

  // ဒီ request ကို cache လုပ်ပေမယ့် — အများဆုံး စက္ကန့် 10 တိုင်း revalidate လုပ်ပါတယ်။
  // `revalidate` option ပါတဲ့ `getStaticProps` နဲ့ ဆင်တူပါတယ်။
  const revalidatedData = await fetch('https://...', {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
export default async function Page() {
  // ဒီ request အတွက် Next.js Data Cache ထဲ opt in လုပ်ပါတယ်။
  // Cached response ကို requests တွေကြားမှာ ပြန်သုံးနိုင်ပြီး — on-demand revalidate လုပ်နိုင်ပါတယ်။
  // `getStaticProps` နဲ့ ဆင်တူပါတယ်။
  const cachedData = await fetch('https://...', { cache: 'force-cache' })

  // ဒီ request အတွက် caching ကနေ opt out လုပ်ပါတယ်။
  // Next.js က request တိုင်းမှာ ဒီ data ကို data source ကနေ fetch လုပ်ပါတယ်။
  // ဒါက fetch ရဲ့ default အပြုအမူပါ။
  // `getServerSideProps` နဲ့ ဆင်တူပါတယ်။
  const uncachedData = await fetch('https://...', { cache: 'no-store' })

  // ဒီ request ကို cache လုပ်ပေမယ့် — အများဆုံး စက္ကန့် 10 တိုင်း revalidate လုပ်ပါတယ်။
  // `revalidate` option ပါတဲ့ `getStaticProps` နဲ့ ဆင်တူပါတယ်။
  const revalidatedData = await fetch('https://...', {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

#### Server-side Rendering (`getServerSideProps`)

`pages` directory မှာ — `getServerSideProps` ကို server ပေါ်မှာ data fetch လုပ်ပြီး file ထဲက default export React component ဆီ props တွေ ပို့ဖို့ သုံးပါတယ်။ Page အတွက် ကနဦး HTML ကို server ကနေ prerender လုပ်ပြီး — နောက်မှာ browser မှာ page ကို "hydrate" (interactive ဖြစ်အောင် လုပ်ခြင်း) လုပ်ပါတယ်။

```jsx filename="pages/dashboard.js"
// `pages` directory

export async function getServerSideProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Dashboard({ projects }) {
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

App Router မှာတော့ — [Server Components](/docs/nextjs/server-client-components) တွေကို သုံးပြီး ကိုယ့် React components တွေထဲမှာကို data fetching ကို တွဲထည့် (colocate) လုပ်နိုင်ပါတယ်။ ဒါက client ဆီ JavaScript ပိုနည်းအောင် ပို့ဆောင်နိုင်စေပြီး — server ကနေ render လုပ်ထားတဲ့ HTML ကိုတော့ ထိန်းထားနိုင်ပါတယ်။

`cache` option ကို `no-store` လို့ သတ်မှတ်ခြင်းအားဖြင့် — fetch လုပ်ထားတဲ့ data ကို [ဘယ်တော့မှ cache မလုပ်ရဘူး](https://nextjs.org/docs/app/getting-started/fetching-data) လို့ ညွှန်ပြနိုင်ပါတယ်။ ဒါက `pages` directory ထဲက `getServerSideProps` နဲ့ ဆင်တူပါတယ်။

```tsx filename="app/dashboard/page.tsx" switcher
// `app` directory

// ဒီ function ကို ဘာနာမည်မဆို ပေးလို့ရပါတယ်
async function getProjects() {
  const res = await fetch(`https://...`, { cache: 'no-store' })
  const projects = await res.json()

  return projects
}

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
// `app` directory

// ဒီ function ကို ဘာနာမည်မဆို ပေးလို့ရပါတယ်
async function getProjects() {
  const res = await fetch(`https://...`, { cache: 'no-store' })
  const projects = await res.json()

  return projects
}

export default async function Dashboard() {
  const projects = await getProjects()

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  )
}
```

#### Request Object ဝင်ရောက်ခြင်း (Accessing Request Object)

`pages` directory မှာ — Node.js HTTP API ကို အခြေခံပြီး request-based data တွေကို ရယူနိုင်ပါတယ်။

ဥပမာ — `getServerSideProps` ကနေ `req` object ကို ရယူပြီး — request ရဲ့ cookies နဲ့ headers တွေကို ဖတ်ဖို့ သုံးနိုင်ပါတယ်။

```jsx filename="pages/index.js"
// `pages` directory

export async function getServerSideProps({ req, query }) {
  const authHeader = req.getHeaders()['authorization'];
  const theme = req.cookies['theme'];

  return { props: { ... }}
}

export default function Page(props) {
  return ...
}
```

`app` directory ကတော့ request data တွေကို ရယူဖို့ read-only functions အသစ်တွေ ထုတ်ပေးပါတယ်:

- [`headers`](/docs/nextjs/headers): Web Headers API ကို အခြေခံပြီး — [Server Components](/docs/nextjs/server-client-components) တွေထဲမှာ request headers တွေကို ရယူဖို့ သုံးနိုင်ပါတယ်။
- [`cookies`](/docs/nextjs/cookies): Web Cookies API ကို အခြေခံပြီး — [Server Components](/docs/nextjs/server-client-components) တွေထဲမှာ cookies တွေကို ရယူဖို့ သုံးနိုင်ပါတယ်။

```tsx filename="app/page.tsx" switcher
// `app` directory
import { cookies, headers } from 'next/headers'

async function getData() {
  const authHeader = (await headers()).get('authorization')

  return '...'
}

export default async function Page() {
  // `cookies` (သို့) `headers` တွေကို Server Components တွေထဲမှာ
  // တိုက်ရိုက် (သို့) သင့် data fetching function ထဲမှာ သုံးနိုင်ပါတယ်
  const theme = (await cookies()).get('theme')
  const data = await getData()
  return '...'
}
```

```jsx filename="app/page.js" switcher
// `app` directory
import { cookies, headers } from 'next/headers'

async function getData() {
  const authHeader = (await headers()).get('authorization')

  return '...'
}

export default async function Page() {
  // `cookies` (သို့) `headers` တွေကို Server Components တွေထဲမှာ
  // တိုက်ရိုက် (သို့) သင့် data fetching function ထဲမှာ သုံးနိုင်ပါတယ်
  const theme = (await cookies()).get('theme')
  const data = await getData()
  return '...'
}
```

#### Static Site Generation (`getStaticProps`)

`pages` directory မှာ — `getStaticProps` function ကို build time မှာ page တစ်ခုကို prerender လုပ်ဖို့ သုံးပါတယ်။ ဒီ function က external API တစ်ခု (သို့) database တစ်ခုကနေ တိုက်ရိုက် data fetch လုပ်ပြီး — build လုပ်နေချိန်မှာ ဒီ data တွေကို page တစ်ခုလုံးဆီ ဖြန့်ဝေပေးပါတယ်။

```jsx filename="pages/index.js"
// `pages` directory

export async function getStaticProps() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return { props: { projects } }
}

export default function Index({ projects }) {
  return projects.map((project) => <div>{project.name}</div>)
}
```

`app` directory မှာတော့ — [`fetch()`](/docs/nextjs/fetch) နဲ့ data fetching က default အနေနဲ့ `cache: 'force-cache'` ဖြစ်ပြီး — ကိုယ်တိုင် invalidate မလုပ်မချင်း request data ကို cache လုပ်ထားပါတယ်။ ဒါက `pages` directory ရဲ့ `getStaticProps` နဲ့ ဆင်တူပါတယ်။

```jsx filename="app/page.js"
// `app` directory

// ဒီ function ကို ဘာနာမည်မဆို ပေးလို့ရပါတယ်
async function getProjects() {
  const res = await fetch(`https://...`)
  const projects = await res.json()

  return projects
}

export default async function Index() {
  const projects = await getProjects()

  return projects.map((project) => <div>{project.name}</div>)
}
```

#### Dynamic Paths (`getStaticPaths`)

`pages` directory မှာ — `getStaticPaths` function ကို build time မှာ prerender လုပ်သင့်တဲ့ dynamic paths တွေကို သတ်မှတ်ဖို့ သုံးပါတယ်။

```jsx filename="pages/posts/[id].js"
// `pages` directory
import PostLayout from '@/components/post-layout'

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  return { props: { post } }
}

export default function Post({ post }) {
  return <PostLayout post={post} />
}
```

`app` directory မှာတော့ — `getStaticPaths` နေရာကို [`generateStaticParams`](/docs/nextjs/generate-static-params) နဲ့ အစားထိုးပါတယ်။

[`generateStaticParams`](/docs/nextjs/generate-static-params) က `getStaticPaths` နဲ့ ဆင်တူစွာ အလုပ်လုပ်ပေမယ့် — route parameters တွေ ပြန်ပို့ဖို့ API ပိုရိုးရှင်းပြီး — [layouts](/docs/nextjs/file-conventions-layout) တွေထဲမှာလည်း သုံးနိုင်ပါတယ်။ `generateStaticParams` ရဲ့ return shape က nested `param` objects တွေ (သို့) resolved paths string တစ်ခုရဲ့ array မဟုတ်ဘဲ — segments တွေရဲ့ array တစ်ခု ဖြစ်ပါတယ်။

```jsx filename="app/posts/[id]/page.js"
// `app` directory
import PostLayout from '@/components/post-layout'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

async function getPost(params) {
  const res = await fetch(`https://.../posts/${(await params).id}`)
  const post = await res.json()

  return post
}

export default async function Post({ params }) {
  const post = await getPost(params)

  return <PostLayout post={post} />
}
```

`generateStaticParams` ဆိုတဲ့ နာမည်က `app` directory ရဲ့ model အသစ်အတွက် `getStaticPaths` ထက် ပိုသင့်တော်ပါတယ်။ `get` prefix နေရာမှာ — `getStaticProps` နဲ့ `getServerSideProps` တွေ မလိုအပ်တော့တာနဲ့ ပိုသင့်လျော်တဲ့ `generate` ကို သုံးပါတယ်။ `Paths` suffix နေရာမှာ — dynamic segments အများအပြားပါတဲ့ nested routing အတွက် ပိုသင့်လျော်တဲ့ `Params` ကို သုံးပါတယ်။

---

#### `fallback` အစားထိုးခြင်း (Replacing `fallback`)

`pages` directory မှာ — `getStaticPaths` ကနေ ပြန်ပေးတဲ့ `fallback` property ကို build time မှာ prerender မလုပ်ထားတဲ့ page တစ်ခုရဲ့ အပြုအမူကို သတ်မှတ်ဖို့ သုံးပါတယ်။ ဒီ property ကို — page ကို generate လုပ်နေချိန်မှာ fallback page တစ်ခု ပြသဖို့ `true`၊ 404 page တစ်ခု ပြသဖို့ `false`၊ (သို့) request time မှာ page ကို generate လုပ်ဖို့ `blocking` — ဆိုပြီး သတ်မှတ်နိုင်ပါတယ်။

```jsx filename="pages/posts/[id].js"
// `pages` directory

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params }) {
  ...
}

export default function Post({ post }) {
  return ...
}
```

`app` directory မှာတော့ — [`config.dynamicParams` property](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams) က [`generateStaticParams`](/docs/nextjs/generate-static-params) ထဲမပါတဲ့ params တွေကို ဘယ်လို ကိုင်တွယ်မလဲ ဆိုတာကို ထိန်းချုပ်ပါတယ်:

- **`true`**: (default) `generateStaticParams` ထဲမပါတဲ့ dynamic segments တွေကို on-demand ဖန်တီးပါတယ်။
- **`false`**: `generateStaticParams` ထဲမပါတဲ့ dynamic segments တွေက 404 ပြန်ပေးပါလိမ့်မယ်။

ဒါက `pages` directory ထဲက `getStaticPaths` ရဲ့ `fallback: true | false | 'blocking'` option နေရာကို အစားထိုးပါတယ်။ `fallback: 'blocking'` option ကိုတော့ `dynamicParams` ထဲမှာ ထည့်မထားပါဘူး — streaming နဲ့ဆိုရင် `'blocking'` နဲ့ `true` အကြား ကွာခြားချက်က မထင်ရှားလို့ပါ။

```jsx filename="app/posts/[id]/page.js"
// `app` directory

export const dynamicParams = true;

export async function generateStaticParams() {
  return [...]
}

async function getPost(params) {
  ...
}

export default async function Post({ params }) {
  const post = await getPost(params);

  return ...
}
```

[`dynamicParams`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams) ကို `true` (default) လို့ သတ်မှတ်ထားတဲ့အခါ — မဖန်တီးရသေးတဲ့ route segment တစ်ခုကို request လုပ်လာရင် — server-render လုပ်ပြီး cache လုပ်ပါလိမ့်မယ်။

#### Incremental Static Regeneration (`revalidate` ပါတဲ့ `getStaticProps`)

`pages` directory မှာ — `getStaticProps` function က အချိန်ကာလတစ်ခု ပြည့်သွားတဲ့အခါ page တစ်ခုကို အလိုအလျောက် ပြန်ထုတ်ဖို့ `revalidate` field တစ်ခု ထည့်နိုင်စေပါတယ်။

```jsx filename="pages/index.js"
// `pages` directory

export async function getStaticProps() {
  const res = await fetch(`https://.../posts`)
  const posts = await res.json()

  return {
    props: { posts },
    revalidate: 60,
  }
}

export default function Index({ posts }) {
  return (
    <Layout>
      <PostList posts={posts} />
    </Layout>
  )
}
```

`app` directory မှာတော့ — [`fetch()`](/docs/nextjs/fetch) နဲ့ data fetching မှာ `revalidate` ကို သုံးနိုင်ပြီး — သတ်မှတ်ထားတဲ့ စက္ကန့်အရေအတွက်အတွက် request ကို cache လုပ်ပါလိမ့်မယ်။

```jsx filename="app/page.js"
// `app` directory

async function getPosts() {
  const res = await fetch(`https://.../posts`, { next: { revalidate: 60 } })
  const data = await res.json()

  return data.posts
}

export default async function PostList() {
  const posts = await getPosts()

  return posts.map((post) => <div>{post.name}</div>)
}
```

#### API Routes

API Routes တွေက `pages/api` directory ထဲမှာ ဘာအပြောင်းအလဲမှ မလိုဘဲ ဆက်အလုပ်လုပ်ပါတယ်။ ဒါပေမယ့် — `app` directory ထဲမှာတော့ ဒါတွေနေရာကို [Route Handlers](/docs/nextjs/file-conventions-route) နဲ့ အစားထိုးပါတယ်။

Route Handlers တွေက Web [Request](https://developer.mozilla.org/docs/Web/API/Request) နဲ့ [Response](https://developer.mozilla.org/docs/Web/API/Response) APIs တွေကို သုံးပြီး — ပေးထားတဲ့ route တစ်ခုအတွက် custom request handlers တွေ ဖန်တီးနိုင်စေပါတယ်။

```ts filename="app/api/route.ts" switcher
export async function GET(request: Request) {}
```

```js filename="app/api/route.js" switcher
export async function GET(request) {}
```

> **သိထားသင့်သည် (Good to know):** အရင်က client ကနေ external API တစ်ခုကို ခေါ်ဖို့ API routes တွေ သုံးခဲ့တယ်ဆိုရင် — အခုတော့ data တွေကို လုံခြုံစွာ fetch လုပ်ဖို့ [Server Components](/docs/nextjs/server-client-components) တွေကို သုံးနိုင်ပါပြီ။ [Data fetching](https://nextjs.org/docs/app/getting-started/fetching-data) အကြောင်း ပိုလေ့လာပါ။

#### Single-Page Applications

တစ်ချိန်တည်းမှာပဲ Single-Page Application (SPA) တစ်ခုကနေလည်း Next.js ဆီ ပြောင်းရွှေ့နေတယ်ဆိုရင် — ကျွန်တော်တို့ရဲ့ [documentation](/docs/nextjs/single-page-applications) ကို ကြည့်ပါ။

### အဆင့် 7 — Styling (ပုံစံ ချိန်ညှိခြင်း)

`pages` directory မှာ — global stylesheets တွေကို `pages/_app.js` မှာပဲ ကန့်သတ်ထားပါတယ်။ `app` directory နဲ့ဆိုရင် — ဒီကန့်သတ်ချက် ရုတ်သိမ်းလိုက်ပါပြီ။ Global styles တွေကို layout, page, (သို့) component ဘယ်မှာမဆို ထည့်နိုင်ပါတယ်။

- [CSS Modules](/docs/nextjs/css#css-modules)
- [Tailwind CSS](/docs/nextjs/css#tailwind-css)
- [Global Styles](/docs/nextjs/css#global-css)
- [CSS-in-JS](/docs/nextjs/css-in-js)
- [External Stylesheets](/docs/nextjs/css#external-stylesheets)
- [Sass](/docs/nextjs/sass)

#### Tailwind CSS

Tailwind CSS သုံးနေတယ်ဆိုရင် — သင့် `tailwind.config.js` file ထဲမှာ `app` directory ကို ထည့်ပေးဖို့ လိုပါလိမ့်မယ်:

```js filename="tailwind.config.js"
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // <-- ဒီ line ကို ထည့်ပါ
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}
```

သင့် `app/layout.js` file ထဲမှာလည်း global styles တွေကို import လုပ်ဖို့ လိုပါလိမ့်မယ်:

```jsx filename="app/layout.js"
import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

[Tailwind CSS နဲ့ styling အကြောင်း ပိုလေ့လာပါ](/docs/nextjs/css#tailwind-css)

## App Router နဲ့ Pages Router တွဲဖက် အသုံးပြုခြင်း (Using App Router together with Pages Router)

Next.js routers မတူညီတဲ့ နှစ်ခုက serve လုပ်တဲ့ routes တွေကြားမှာ navigate လုပ်တဲ့အခါ — hard navigation တစ်ခု ဖြစ်သွားပါလိမ့်မယ်။ `next/link` နဲ့ automatic link prefetching က routers တွေကို ဖြတ်ပြီး prefetch လုပ်မှာ မဟုတ်ပါဘူး။

ဒီအစား — App Router နဲ့ Pages Router အကြား navigations တွေမှာ prefetch လုပ်ပြီး မြန်ဆန်တဲ့ page transitions တွေ ထိန်းသိမ်းဖို့ — [navigations တွေကို optimize လုပ်နိုင်ပါတယ်](https://vercel.com/guides/optimizing-hard-navigations)။ [ပိုလေ့လာပါ](https://vercel.com/guides/optimizing-hard-navigations)။

## Codemods

Feature တစ်ခု deprecated ဖြစ်သွားတဲ့အခါ — သင့် codebase ကို upgrade လုပ်ဖို့ ကူညီဖို့ Next.js က Codemod transformations တွေ ပေးပါတယ်။ အသေးစိတ်အတွက် [Codemods](/docs/nextjs/upgrading-codemods) ကို ကြည့်ပါ။
