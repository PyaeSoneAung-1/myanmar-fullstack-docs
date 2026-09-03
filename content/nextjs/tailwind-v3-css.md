---
title: "Tailwind CSS v3 (Next.js application မှာ Tailwind CSS v3 တပ်ဆင်ခြင်း)"
description: "Next.js application တစ်ခုမှာ Tailwind CSS v3 ကို တပ်ဆင် configure လုပ်နည်း — browser ထောက်ပံ့မှု ပိုကျယ်ပြန့်စေရန်; tailwindcss, PostCSS setup, template paths, global CSS directives နဲ့ Turbopack အသုံးပြုမှု"
order: 235
source: "https://nextjs.org/docs/app/guides/tailwind-v3-css"
status: translated
updated: 2026-09-03
---

ဒီ guide က — သင့် Next.js application ထဲမှာ [Tailwind CSS v3](https://v3.tailwindcss.com/) ကို ဘယ်လို တပ်ဆင်မလဲဆိုတာ အဆင့်ဆင့် ရှင်းပြပေးပါတယ်။

> **သိထားသင့်သည်:** အသစ်ဆုံး Tailwind 4 setup အတွက်တော့ — [Tailwind CSS setup instructions](/docs/nextjs/css#tailwind-css) ကို ကြည့်ပါ။

## Tailwind v3 တပ်ဆင်ခြင်း

Tailwind CSS နဲ့ သူ့ရဲ့ peer dependencies တွေကို တပ်ဆင်ပြီး — `tailwind.config.js` နဲ့ `postcss.config.js` files နှစ်ခုလုံးကို ထုတ်ပေးဖို့ `init` command ကို run လုပ်ပါ:

```bash package="pnpm"
pnpm add -D tailwindcss@^3 postcss autoprefixer
npx tailwindcss init -p
```

```bash package="npm"
npm install -D tailwindcss@^3 postcss autoprefixer
npx tailwindcss init -p
```

```bash package="yarn"
yarn add -D tailwindcss@^3 postcss autoprefixer
npx tailwindcss init -p
```

```bash package="bun"
bun add -D tailwindcss@^3 postcss autoprefixer
bunx tailwindcss init -p
```

## Tailwind v3 ကို configure လုပ်ခြင်း

သင့် `tailwind.config.js` file ထဲမှာ template paths တွေကို သတ်မှတ်ပါ:

```js filename="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Tailwind directives တွေကို သင့် global CSS file ထဲ ထည့်ပါ:

```css filename="app/globals.css"
@tailwind base;
@tailwind components;
@tailwind utilities;
```

CSS file ကို သင့် root layout ထဲမှာ import လုပ်ပါ:

```tsx filename="app/layout.tsx" switcher
import './globals.css'

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

```jsx filename="app/layout.js" switcher
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Utility classes တွေကို အသုံးပြုခြင်း

Tailwind CSS ကို တပ်ဆင်ပြီး global styles တွေ ထည့်ပြီးတဲ့နောက် — သင့် application ထဲမှာ Tailwind ရဲ့ utility classes တွေကို သုံးနိုင်ပါပြီ။

```tsx filename="app/page.tsx" switcher
export default function Page() {
  return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
}
```

```jsx filename="app/page.js" switcher
export default function Page() {
  return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
}
```

## Turbopack နဲ့ အသုံးပြုခြင်း

Next.js 13.1 ကစပြီး — Tailwind CSS နဲ့ PostCSS တွေကို [Turbopack](https://turbo.build/pack/docs/features/css#tailwind-css) နဲ့ ထောက်ပံ့ပေးပါတယ်။
