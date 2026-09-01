---
title: "CSS"
description: "Next.js app မှာ CSS ထည့်သွင်းနိုင်တဲ့ နည်းလမ်းအမျိုးမျိုး — Tailwind CSS, CSS Modules, Global CSS, External Stylesheets, CSS စီစဉ်ပုံ (Ordering) နဲ့ development/production ကွာခြားချက်"
order: 11
source: "https://nextjs.org/docs/app/getting-started/css"
status: translated
updated: 2026-09-01
---

Next.js က CSS သုံးပြီး သင့် application ကို style လုပ်ဖို့ နည်းလမ်းပေါင်းများစွာ ပေးထားပါတယ်:

- [Tailwind CSS](#tailwind-css)
- [CSS Modules](#css-modules)
- [Global CSS](#global-css)
- [External Stylesheets](#external-stylesheets)
- [Sass](/docs/nextjs/sass)
- [CSS-in-JS](/docs/nextjs/css-in-js)

## Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) က utility-first CSS framework တစ်ခုပါ — custom designs တွေ တည်ဆောက်ဖို့ low-level utility classes တွေ ပေးပါတယ်။

Tailwind CSS ကို install လုပ်ပါ:

```bash
pnpm add -D tailwindcss @tailwindcss/postcss
```

သင့် `postcss.config.mjs` file ထဲမှာ PostCSS plugin ကို ထည့်ပါ:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

သင့် global CSS file ထဲမှာ Tailwind ကို import လုပ်ပါ:

```css
@import 'tailwindcss';
```

Root layout ထဲမှာ CSS file ကို import လုပ်ပါ:

```tsx
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

အခုဆိုရင် သင့် application ထဲမှာ Tailwind ရဲ့ utility classes တွေကို စသုံးလို့ရပါပြီ:

```tsx
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
```

> **သိထားသင့်သည်** — အရမ်းဟောင်းတဲ့ browsers တွေအတွက် ပိုကျယ်ပြန့်တဲ့ browser support လိုအပ်ရင် [Tailwind CSS v3 setup instructions](/docs/nextjs/tailwind-v3-css) ကို ကြည့်ပါ။

## CSS Modules

CSS Modules တွေက unique class names တွေ ထုတ်လုပ်ပြီး CSS ကို local scope ဖြစ်အောင် လုပ်ပါတယ်။ ဒါကြောင့် class name ထပ်တူကျမှာ (naming collisions) စိုးရိမ်စရာ မလိုဘဲ — file အမျိုးမျိုးမှာ class တစ်ခုတည်းကို ပြန်သုံးလို့ရပါတယ်။

CSS Modules စသုံးဖို့ — `.module.css` extension နဲ့ file အသစ်တစ်ခု ဖန်တီးပြီး `app` directory ထဲက component မဆီ import လုပ်ပါ:

```css
.blog {
  padding: 24px;
}
```

```tsx
import styles from './blog.module.css'

export default function Page() {
  return <main className={styles.blog}></main>
}
```

## Global CSS

သင့် application တစ်ခုလုံးကို style ကျရောက်စေဖို့ global CSS ကို သုံးနိုင်ပါတယ်။

`app/global.css` file တစ်ခု ဖန်တီးပြီး root layout ထဲမှာ import လုပ်ပါ — ဒါဆိုရင် သင့် application ရဲ့ **route တိုင်း** ကို style တွေ ကျရောက်ပါတယ်:

```css
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

```tsx
// ဒီ styles တွေက application ထဲက route တိုင်းကို ကျရောက်တယ်
import './global.css'

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

> **သိထားသင့်သည်** — Global styles တွေကို `app` directory အတွင်းက layout, page (သို့) component မဆီ import လုပ်လို့ရပါတယ်။ ဒါပေမယ့် Next.js က Suspense နဲ့ ပေါင်းစည်းဖို့ React ရဲ့ built-in stylesheets support ကို သုံးလို့ — route တွေကြား navigate လုပ်တဲ့အခါ stylesheets တွေကို ဖယ်ရှားမပေးတာမို့ conflicts ဖြစ်နိုင်ပါတယ်။ Global styles တွေကို _တကယ့်_ global CSS (Tailwind ရဲ့ base styles လိုမျိုး) အတွက်ပဲ သုံးဖို့ အကြံပြုပြီး — component styling အတွက် [Tailwind CSS](#tailwind-css)၊ လိုအပ်တဲ့အခါ custom scoped CSS အတွက် [CSS Modules](#css-modules) တွေကို သုံးပါ။

## External stylesheets

External packages တွေက ထုတ်ဝေထားတဲ့ stylesheets တွေကို `app` directory အတွင်းမှာ ဘယ်နေရာမှာမဆို import လုပ်နိုင်ပါတယ် — colocated components တွေအပါအဝင်ပါ:

```tsx
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

> **သိထားသင့်သည်** — React 19 မှာ `<link rel="stylesheet" href="..." />` ကိုလည်း သုံးလို့ရပါတယ်။ ပိုသိချင်ရင် [React `link` documentation](https://react.dev/reference/react-dom/components/link) ကို ကြည့်ပါ။

## Ordering နဲ့ Merging

Next.js က production builds တွေမှာ CSS ကို stylesheets တွေ အလိုအလျောက် chunk (merge) လုပ်ပြီး optimize လုပ်ပါတယ်။ **သင့် CSS ရဲ့ အစီအစဉ်** က **သင့် code ထဲမှာ styles တွေကို import လုပ်တဲ့ အစီအစဉ်** ပေါ်မှာ မူတည်ပါတယ်။

ဥပမာ — `base-button.module.css` က `page.module.css` ထက် အရင် order ကျပါလိမ့်မယ် — ဘာလို့လဲဆိုတော့ `<BaseButton>` ကို `page.module.css` ထက် အရင် import လုပ်လို့ပါ:

```tsx
import { BaseButton } from './base-button'
import styles from './page.module.css'

export default function Page() {
  return <BaseButton className={styles.primary} />
}
```

```tsx
import styles from './base-button.module.css'

export function BaseButton() {
  return <button className={styles.primary} />
}
```

### အကြံပြုချက်များ

CSS ordering ကို ခန့်မှန်းလို့ရအောင် ထားဖို့:

- CSS imports တွေကို JavaScript (သို့) TypeScript entry file တစ်ခုတည်းမှာ ထားဖို့ ကြိုးစားပါ
- Global styles နဲ့ Tailwind stylesheets တွေကို သင့် application ရဲ့ root မှာ import လုပ်ပါ
- Style လိုအပ်ချက် အများစုအတွက် **Tailwind CSS** ကို သုံးပါ — utility classes တွေနဲ့ အသုံးများတဲ့ design patterns တွေကို ဖုံးအုပ်ပေးလို့ပါ
- Tailwind utilities တွေ မလုံလောက်တဲ့အခါ component-specific styles တွေအတွက် CSS Modules ကို သုံးပါ
- သင့် CSS modules တွေအတွက် ညီညွတ်တဲ့ naming convention တစ်ခု သုံးပါ — ဥပမာ `<name>.tsx` ထက် `<name>.module.css` ဆိုတာမျိုး
- Duplicate imports တွေ ရှောင်ဖို့ shared styles တွေကို shared components တွေထဲ ထုတ်ယူပါ
- ESLint ရဲ့ [`sort-imports`](https://eslint.org/docs/latest/rules/sort-imports) လို imports တွေကို auto-sort လုပ်တဲ့ linters (သို့) formatters တွေကို ပိတ်ထားပါ
- CSS ကို ဘယ်လို chunk လုပ်မလဲ ထိန်းချုပ်ဖို့ `next.config.js` ထဲမှာ [`cssChunking`](/docs/nextjs/cssChunking) option ကို သုံးနိုင်ပါတယ်

## Development vs Production

- Development (`next dev`) မှာ CSS updates တွေက [Fast Refresh](/docs/nextjs/fast-refresh) နဲ့ ချက်ချင်း ကျရောက်ပါတယ်
- Production (`next build`) မှာ CSS files တွေအားလုံးကို အလိုအလျောက် **minified နဲ့ code-split လုပ်ထားတဲ့** `.css` files အများအပြားအဖြစ် ပေါင်းစပ်ပြီး — route တစ်ခုအတွက် လိုအပ်တဲ့ CSS အနည်းဆုံးပဲ load ဖြစ်အောင် လုပ်ပါတယ်
- Production မှာ JavaScript ပိတ်ထားတာတောင် CSS က load ဖြစ်ပါတယ် — ဒါပေမယ့် development မှာတော့ Fast Refresh အတွက် JavaScript လိုအပ်ပါတယ်
- CSS ordering က development မှာ မတူညီစွာ ပြုမူနိုင်ပါတယ် — နောက်ဆုံး CSS order ကို သေချာအောင် အမြဲတမ်း build (`next build`) ကို စစ်ဆေးပါ
