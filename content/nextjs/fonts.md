---
title: "Fonts (Optimizing Fonts)"
description: "next/font နဲ့ font optimization — Google Fonts/local fonts တွေကို self-host လုပ်ခြင်း, variable fonts, layout shift ရှောင်ခြင်း နဲ့ Tailwind CSS နဲ့ တွဲသုံးခြင်း"
order: 21
source: "https://nextjs.org/docs/app/getting-started/fonts"
status: translated
updated: 2026-09-02
---

[`next/font`](https://nextjs.org/docs/app/api-reference/components/font) module က သင့် fonts တွေကို အလိုအလျောက် optimize လုပ်ပေးပြီး — privacy နဲ့ performance ပိုကောင်းအောင် **external network requests တွေကို ဖယ်ရှားပေးပါတယ်**။

ဘယ် font file မဆို **built-in automatic self-hosting** (ကိုယ့် server ပေါ်မှာ ကိုယ်တိုင် host လုပ်ခြင်း) ပါဝင်ပါတယ် — ဆိုလိုတာက [layout shift](https://web.dev/articles/cls) မရှိဘဲ web fonts တွေကို အကောင်းဆုံး ပုံစံနဲ့ load လုပ်နိုင်ပါတယ်။ ပုံမှန် webfonts တွေမှာဆိုရင် font file ရောက်လာချိန်အထိ fallback font နဲ့ ပြရလို့ text တွေ ခုန်ပြောင်းတတ်ပြီး — `next/font` က ဒီလို Cumulative Layout Shift မဖြစ်အောင် အလိုအလျောက် ကိုင်တွယ်ပေးပါတယ်။

`next/font` ကို စသုံးဖို့ — `next/font/local` (သို့) `next/font/google` ကနေ import လုပ်ပြီး သင့်တော်တဲ့ options တွေနဲ့ function တစ်ခုအနေနဲ့ ခေါ်ကာ — font သက်ရောက်စေချင်တဲ့ element ရဲ့ `className` မှာ ထည့်ရပါတယ်။ ဥပမာ:

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

Fonts တွေက သူတို့ သုံးထားတဲ့ component ထဲမှာပဲ scope ဖြစ်ပါတယ် — application တစ်ခုလုံးကို သက်ရောက်စေချင်ရင် [Root Layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout) ထဲမှာ ထည့်ပေးရပါမယ်။

### Layout shift ဘာကြောင့် မဖြစ်တော့တာလဲ

Web font တစ်ခုကို သုံးတဲ့အခါ browser က font file မရောက်သေးခင် fallback font နဲ့ အရင်ပြပြီး — font ရောက်လာတာနဲ့ ပြောင်းလဲ ပြသလေ့ ရှိပါတယ်။ Font နှစ်ခုရဲ့ metrics (အကျယ်အဝန်း, line-height) မတူညီရင် text တွေ ခုန်ပြောင်းပြီး [Cumulative Layout Shift](https://web.dev/articles/cls) ဖြစ်တတ်ပါတယ်။ `next/font` က ဒီပြဿနာကို နည်းလမ်းပေါင်းစုံနဲ့ ဖြေရှင်းပေးပါတယ်:

- Font files တွေကို build ချိန်မှာ ကြိုယူပြီး **ကိုယ့် server ပေါ်မှာ self-host** လုပ်ထားလို့ runtime မှာ third-party ဆီ network request မလိုတော့ပါဘူး — load မြန်စေပြီး failure အလားအလာလည်း နည်းပါတယ်။
- `display` ရဲ့ default က `'swap'` ဖြစ်လို့ — font file မရောက်သေးရင်တောင် fallback font နဲ့ text တွေ ချက်ချင်း မြင်ရပြီး (FOIT — invisible text ကာလ — မရှိပါဘူး) font ရောက်တာနဲ့ အစားထိုး ပြသပါတယ်။
- [`adjustFontFallback`](https://nextjs.org/docs/app/api-reference/components/font#adjustfontfallback) (google အတွက် default `true`, local အတွက် default `'Arial'`) က fallback font ရဲ့ metrics တွေကို load လုပ်မယ့် font နဲ့ ကိုက်ညီအောင် အလိုအလျောက် ချိန်ပေးလို့ — fallback ကနေ ပုံမှန် font ကို ပြောင်းတဲ့အခါ text တွေ ခုန်ပြောင်းမှု (layout shift) သိသိသာသာ မဖြစ်စေပါဘူး။

## Google Fonts

Google Fonts တစ်ခုခုကို သုံးရင် — `next/font/google` ကနေ ရွေးထားတဲ့ font ကို import လုပ်ပါ။ Build လုပ်ချိန်မှာ font ရဲ့ CSS နဲ့ font files တွေကို download လုပ်ပြီး — ကျန်တဲ့ static assets တွေနဲ့အတူ **ကိုယ့် deployment ရဲ့ domain ကနေပဲ self-host** လုပ်ပါတယ်။ ဒါကြောင့် user တစ်ယောက် site ကို ဝင်ကြည့်တဲ့အခါ **browser ကနေ Google ဆီ request ဘာမှ မပို့တော့ပါဘူး** — performance ရော privacy ပါ ပိုကောင်းပါတယ်။

```tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

Performance နဲ့ flexibility အကောင်းဆုံး ရဖို့ [variable fonts](https://fonts.google.com/variablefonts) တွေကို သုံးဖို့ အကြံပြုပါတယ်။ Variable font မဟုတ်ရင်တော့ — `weight` ကို တိတိကျကျ သတ်မှတ်ပေးရပါမယ်:

```tsx
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

Weight နဲ့ style အများအပြား လိုအပ်ရင် array အနေနဲ့လည်း သတ်မှတ်နိုင်ပါတယ်:

```jsx
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})
```

> **Good to know:** စကားလုံး နှစ်လုံးနဲ့ ဖွဲ့ထားတဲ့ font နာမည်တွေကို underscore (`_`) နဲ့ ရေးရပါတယ် — ဥပမာ `Roboto Mono` ကို `Roboto_Mono` အနေနဲ့ import လုပ်ပါ။

Google Fonts တွေကို အလိုအလျောက် [subset](https://fonts.google.com/knowledge/glossary/subsetting) လုပ်ပေးပြီး — font file အရွယ်အစား ကျစေကာ performance ပိုကောင်းစေပါတယ်။ `subsets` နဲ့ ဘယ် subset တွေကို preload လုပ်မလဲ သတ်မှတ်ပေးရပြီး — `preload` က `true` (default) ဖြစ်နေချိန်မှာ subsets တစ်ခုမှ မသတ်မှတ်ရင် warning တက်ပါလိမ့်မယ်။

## Local Fonts (Local font များ)

Local font သုံးဖို့ — `next/font/local` ကနေ `localFont` function ကို import လုပ်ပြီး ကိုယ့် font file ရဲ့ [`src`](https://nextjs.org/docs/app/api-reference/components/font#src) ကို သတ်မှတ်ပေးပါ။ Path က `localFont` ခေါ်တဲ့ file နဲ့ ယှဉ်ပြီး resolve လုပ်ပါတယ်။ Fonts တွေကို project ထဲ ဘယ်နေရာမှာမဆို သိမ်းလို့ရပြီး — `public` folder (သို့) `app` folder အတွင်းမှာ colocate လုပ်ထားလို့လည်း ရပါတယ်။ ဥပမာ `app/fonts/` ထဲမှာ သိမ်းထားတဲ့ font အတွက်:

```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

Font family တစ်ခုအတွက် files အများအပြား သုံးချင်ရင် — `src` ကို array အနေနဲ့ ထည့်နိုင်ပါတယ်:

```js
const roboto = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})
```

## Fonts အများအပြား သုံးခြင်း (Using Multiple Fonts)

Application တစ်ခုထဲမှာ fonts အများအပြား import လုပ်ပြီး သုံးနိုင်ပါတယ် — နည်းလမ်း နှစ်မျိုး ရှိပါတယ်။

ပထမနည်းက — font တစ်ခုကို export လုပ်တဲ့ utility file (ဥပမာ `app/fonts.ts`) ဖန်တီးပြီး လိုအပ်တဲ့နေရာမှာ import လုပ်ကာ သူ့ရဲ့ `className` ကို သက်ရောက်တာပါ။ ဒီနည်းက font ကို render လုပ်ချိန်မှသာ preload ဖြစ်အောင် သေချာစေပါတယ်:

```ts
import { Inter, Roboto_Mono } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})
```

```tsx
import { inter } from './fonts'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

ဒါဆိုရင် ဒီ utility module ကနေ fonts တွေကို ဘယ် Server/Client Component မှာမဆို import လုပ်ပြီး — heading တွေအတွက် `roboto_mono.className`, body အတွက် `inter.className` စသဖြင့် element အလိုက် သက်ရောက်နိုင်ပါတယ်။

## Tailwind CSS နဲ့ တွဲသုံးခြင်း

`next/font` က [Tailwind CSS](https://tailwindcss.com/) နဲ့ [CSS variables](https://nextjs.org/docs/app/api-reference/components/font#css-variables) ကတစ်ဆင့် ချောမွေ့စွာ ပေါင်းစပ်လို့ ရပါတယ်။ Font တွေအတွက် `variable` option နဲ့ CSS variable နာမည်တွေ သတ်မှတ်ပြီး — `<html>` (သို့) `<body>` tag ပေါ်မှာ `inter.variable`, `roboto_mono.variable` စသဖြင့် ထည့်ပေးရပါတယ် (နေရာကို ကိုယ့် styling လိုအပ်ချက်အလိုက် ရွေးနိုင်ပါတယ်):

```tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto_mono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  )
}
```

ပြီးရင် Tailwind CSS v4 မှာ — `global.css` ထဲက [`@theme`](https://nextjs.org/docs/app/getting-started/css#tailwind-css) directive ထဲ CSS variable တွေကို ထည့်ပါ:

```css
@import 'tailwindcss';

@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-roboto-mono);
}
```

Tailwind CSS v3 သုံးနေတယ်ဆိုရင်တော့ — `tailwind.config.js` ရဲ့ `theme.extend.fontFamily` ထဲမှာ ထည့်ပေးရပါတယ်:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [],
}
```

ဒါဆိုရင် `font-sans` နဲ့ `font-mono` utility classes တွေနဲ့ element တွေကို style လုပ်လို့ ရပါပြီ:

```html
<p class="font-sans ...">The quick brown fox ...</p>
<p class="font-mono ...">The quick brown fox ...</p>
```

## Font Style သက်ရောက်ပုံ (Applying Styles)

Loaded font ရဲ့ styles တွေကို နည်း သုံးမျိုးနဲ့ သက်ရောက်နိုင်ပါတယ်:

- **`className`** — loaded font အတွက် read-only CSS `className` ကို ပြန်ပေးပြီး HTML element ကို ထည့်ဖို့ သုံးပါတယ် — ဥပမာ `<p className={inter.className}>Hello, Next.js!</p>`
- **`style`** — read-only CSS `style` object ပြန်ပေးပြီး — `style.fontFamily` နဲ့ font family name နဲ့ fallback fonts တွေကို ရယူနိုင်ပါတယ် — ဥပမာ `<p style={inter.style}>Hello World</p>`
- **CSS Variables** — font ကို `variable: '--font-inter'` လို CSS variable နာမည်နဲ့ သတ်မှတ်ထားရင် အဲဒီ variable ကို ဘယ် CSS selector မှာမဆို သုံးနိုင်ပါတယ်

## Load Options အသေးစိတ်

`next/font/google` နဲ့ `next/font/local` function တွေမှာ သုံးလို့ရတဲ့ အဓိက options တွေက:

- **`src`** — font file ရဲ့ path (local အတွက် required)။ Loader function ခေါ်တဲ့ directory နဲ့ ယှဉ်တဲ့ relative path ဖြစ်ပြီး string (သို့) `{ path, weight, style }` object တွေရဲ့ array ဖြစ်နိုင်ပါတယ်။
- **`weight`** — font [weight](https://fonts.google.com/knowledge/glossary/weight)။ Font က variable font မဟုတ်ရင် **required** ဖြစ်ပြီး — single value (`'400'`), variable font အတွက် range (`'100 900'`), (သို့) non-variable Google font အတွက် array (`['100', '400', '900']`) အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။
- **`style`** — font style — default က `'normal'` ဖြစ်ပြီး `'italic'` စသဖြင့် သတ်မှတ်နိုင်ပါတယ်။
- **`subsets`** — Google Font ရဲ့ [subsets](https://fonts.google.com/knowledge/glossary/subsetting) (ဥပမာ `['latin']`)။ `subsets` နဲ့ သတ်မှတ်ထားတဲ့ fonts တွေကို `preload` option `true` (default) ဖြစ်နေရင် `<head>` ထဲမှာ preload link tag ထည့်ပေးပါတယ်။
- **`display`** — CSS [`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) value — `'auto'`, `'block'`, `'swap'`, `'fallback'` (သို့) `'optional'` — default က `'swap'` (font မရောက်သေးခင် fallback font နဲ့ ပြပြီး ရောက်တာနဲ့ အစားထိုး)။
- **`preload`** — font ကို [preload](https://nextjs.org/docs/app/api-reference/components/font#preloading) လုပ်မလုပ် — default `true`။
- **`fallback`** — font load မဖြစ်ရင် သုံးမယ့် fallback fonts စာရင်း — ဥပမာ `['system-ui', 'arial']`။
- **`adjustFontFallback`** — [Cumulative Layout Shift](https://web.dev/cls/) လျှော့ချဖို့ automatic fallback font သုံးမလား — google အတွက် default `true`၊ local အတွက် default `'Arial'` (ပိတ်ချင်ရင် `false`)။
- **`variable`** — CSS variable method နဲ့ style သက်ရောက်ဖို့ CSS variable နာမည် သတ်မှတ်ခြင်း — ဥပမာ `variable: '--my-font'`။
- **`declarations`** (local) — generated `@font-face` ကို ထပ်ဆင့် သတ်မှတ်ဖို့ descriptor key-value pairs — ဥပမာ `[{ prop: 'ascent-override', value: '90%' }]`။

Font တစ်မျိုးထဲ မဟုတ်ဘဲ font အမျိုးမျိုး (ဥပမာ headings အတွက် တစ်မျိုး, body အတွက် တစ်မျိုး) သုံးချင်ရင်လည်း — function တစ်ခုစီကနေ loader တစ်ခုစီ ခေါ်ပြီး သက်ဆိုင်ရာ `className` (သို့) CSS variables တွေကို element အလိုက် သုံးနိုင်ပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Image Optimization](/docs/nextjs/image) — images တွေကို optimize လုပ်ခြင်း
- [CSS](/docs/nextjs/css) — Tailwind CSS နဲ့ အခြား styling နည်းလမ်းများ
- [Font API Reference](https://nextjs.org/docs/app/api-reference/components/font) — options အားလုံးရဲ့ အသေးစိတ်
