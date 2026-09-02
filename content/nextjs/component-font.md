---
title: "font"
description: "next/font — fonts များကို built-in automatic self-hosting ဖြင့် optimize လုပ်ခြင်း; next/font/google နှင့် next/font/local loaders များ၊ options အားလုံး (src, weight, style, subsets, axes, display, preload, fallback, adjustFontFallback, variable, declarations) နှင့် ဥပမာများ"
order: 73
source: "https://nextjs.org/docs/app/api-reference/components/font"
status: translated
updated: 2026-09-02
---

[`next/font`](https://nextjs.org/docs/app/api-reference/components/font) module က သင့် fonts တွေကို (custom fonts အပါအဝင်) အလိုအလျောက် optimize လုပ်ပေးပြီး — privacy နဲ့ performance ပိုကောင်းအောင် **external network requests တွေကို ဖယ်ရှားပေးပါတယ်**။

ဘယ် font file မဆို **built-in automatic self-hosting** (ကိုယ့် server ပေါ်မှာ ကိုယ်တိုင် host လုပ်ခြင်း) ပါဝင်ပါတယ်။ ဆိုလိုတာက — [layout shift](https://web.dev/articles/cls) မရှိဘဲ web fonts တွေကို အကောင်းဆုံး ပုံစံနဲ့ load လုပ်နိုင်ပါတယ်။

[Google Fonts](https://fonts.google.com/) အားလုံးကိုလည်း အဆင်ပြေပြေ သုံးနိုင်ပါတယ်။ CSS နဲ့ font files တွေကို build လုပ်ချိန်မှာ download လုပ်ပြီး — ကျန်တဲ့ static assets တွေနဲ့အတူ self-host လုပ်ပါတယ်။ **Browser ကနေ Google ဆီ request တွေ ဘာမှ ပို့မှာ မဟုတ်ပါဘူး။**

ဥပမာ — `Inter` font ကို root layout ထဲမှာ တင်ပြီး app တစ်ခုလုံးကို သက်ရောက်စေတာကို ကြည့်ပါ:

```tsx filename="app/layout.tsx" switcher
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

> **🎥 ကြည့်ရှုရန် (Watch):** `next/font` အသုံးပြုပုံအကြောင်း ထပ်လေ့လာရန် → [YouTube (6 မိနစ်)](https://www.youtube.com/watch?v=L8_98i_bMMA).

## Reference

အောက်ပါ table က loader function တစ်ခုစီမှာ ရရှိနိုင်တဲ့ options တွေရဲ့ အကျဉ်းချုပ် ဖြစ်ပါတယ် (✓ = ထောက်ပံ့သည်၊ ✗ = မထောက်ပံ့ပါ):

| Key                                         | `font/google`       | `font/local`        | Type                       | Required          |
| ------------------------------------------- | ------------------- | ------------------- | -------------------------- | ----------------- |
| [`src`](#src)                               | ✗                   | ✓                   | String or Array of Objects | Yes               |
| [`weight`](#weight)                         | ✓                   | ✓                   | String or Array            | Required/Optional |
| [`style`](#style)                           | ✓                   | ✓                   | String or Array            | -                 |
| [`subsets`](#subsets)                       | ✓                   | ✗                   | Array of Strings           | -                 |
| [`axes`](#axes)                             | ✓                   | ✗                   | Array of Strings           | -                 |
| [`display`](#display)                       | ✓                   | ✓                   | String                     | -                 |
| [`preload`](#preload)                       | ✓                   | ✓                   | Boolean                    | -                 |
| [`fallback`](#fallback)                     | ✓                   | ✓                   | Array of Strings           | -                 |
| [`adjustFontFallback`](#adjustfontfallback) | ✓                   | ✓                   | Boolean or String          | -                 |
| [`variable`](#variable)                     | ✓                   | ✓                   | String                     | -                 |
| [`declarations`](#declarations)             | ✗                   | ✓                   | Array of Objects           | -                 |

### `src`

Font file ရဲ့ path ဖြစ်ပြီး — font loader function ကို ခေါ်တဲ့ directory နဲ့ ဆက်စပ်တဲ့ (relative) string တစ်ခု (သို့) objects တွေရဲ့ array (type `Array<{path: string, weight?: string, style?: string}>`) အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။

`next/font/local` မှာ သုံးသည်

- မဖြစ်မနေ ထည့်ရန် (Required)

ဥပမာများ (Examples):

- `src:'./fonts/my-font.woff2'` — `my-font.woff2` ကို `app` directory ထဲက `fonts` ဆိုတဲ့ directory တစ်ခုထဲမှာ ထားတဲ့အခါ
- `src:[{path: './inter/Inter-Thin.ttf', weight: '100',},{path: './inter/Inter-Regular.ttf',weight: '400',},{path: './inter/Inter-Bold-Italic.ttf', weight: '700',style: 'italic',},]`
- Font loader function ကို `app/page.tsx` ထဲမှာ `src:'../styles/fonts/my-font.ttf'` နဲ့ ခေါ်ထားရင် — `my-font.ttf` ကို project ရဲ့ root မှာ ရှိတဲ့ `styles/fonts` ထဲမှာ ထားရပါတယ်

### `weight`

Font ရဲ့ [weight](https://fonts.google.com/knowledge/glossary/weight) ဖြစ်ပြီး — အောက်ပါ ပုံစံတွေနဲ့ သတ်မှတ်နိုင်ပါတယ်:

- သက်ဆိုင်ရာ font အတွက် ရနိုင်တဲ့ weights တွေထဲက value string တစ်ခု (သို့) [variable](https://fonts.google.com/variablefonts) font ဖြစ်ရင် value range တစ်ခု
- Font က [variable google font](https://fonts.google.com/variablefonts) မဟုတ်ရင် — weight values တွေရဲ့ array တစ်ခု။ `next/font/google` မှာပဲ သက်ဆိုင်ပါတယ်

`next/font/google` နဲ့ `next/font/local` မှာ သုံးသည်

- Font က [variable](https://fonts.google.com/variablefonts) မဟုတ်ရင် မဖြစ်မနေ ထည့်ရန် (Required)

ဥပမာများ (Examples):

- `weight: '400'`: Single weight value အတွက် string — [`Inter`](https://fonts.google.com/specimen/Inter?query=inter) font ဆိုရင် ရနိုင်တဲ့ values တွေက `'100'`, `'200'`, `'300'`, `'400'`, `'500'`, `'600'`, `'700'`, `'800'`, `'900'` (သို့) `'variable'` ဖြစ်ပြီး — default က `'variable'` ပါ)
- `weight: '100 900'`: Variable font တစ်ခုအတွက် `100` နဲ့ `900` ကြားက range ကို ကိုယ်စားပြုတဲ့ string
- `weight: ['100','400','900']`: Variable မဟုတ်တဲ့ font တစ်ခုအတွက် ဖြစ်နိုင်တဲ့ values ၃ ခုရဲ့ array

### `style`

Font ရဲ့ [style](https://developer.mozilla.org/docs/Web/CSS/font-style) ဖြစ်ပြီး — အောက်ပါ ပုံစံတွေနဲ့ သတ်မှတ်နိုင်ပါတယ်:

- Default value `'normal'` ရှိတဲ့ string [value](https://developer.mozilla.org/docs/Web/CSS/font-style#values) တစ်ခု
- Font က [variable google font](https://fonts.google.com/variablefonts) မဟုတ်ရင် — style values တွေရဲ့ array တစ်ခု။ `next/font/google` မှာပဲ သက်ဆိုင်ပါတယ်

`next/font/google` နဲ့ `next/font/local` မှာ သုံးသည်

- ထည့်စရာ မလို (Optional)

ဥပမာများ (Examples):

- `style: 'italic'`: String — `next/font/google` အတွက် `normal` (သို့) `italic` ဖြစ်နိုင်ပါတယ်
- `style: 'oblique'`: String — `next/font/local` မှာ ဘယ် value မဆို ရနိုင်ပေမယ့် [standard font styles](https://developer.mozilla.org/docs/Web/CSS/font-style) ကနေ လာတာ ဖြစ်သင့်ပါတယ်
- `style: ['italic','normal']`: `next/font/google` အတွက် values ၂ ခုရဲ့ array — values တွေက `normal` နဲ့ `italic` ကနေ လာပါတယ်

### `subsets`

Font ရဲ့ [subsets](https://fonts.google.com/knowledge/glossary/subsetting) — [preload](#specifying-a-subset) လုပ်ချင်တဲ့ subset တစ်ခုစီရဲ့ နာမည်တွေကို string values တွေရဲ့ array အနေနဲ့ သတ်မှတ်ပါတယ်။ [`preload`](#preload) option က `true` ဖြစ်နေရင် (default ကလည်း ဒါပါ) — `subsets` နဲ့ သတ်မှတ်ထားတဲ့ fonts တွေအတွက် `<head>` ထဲကို link preload tag တစ်ခု inject လုပ်ပေးပါတယ်။

`next/font/google` မှာ သုံးသည်

- ထည့်စရာ မလို (Optional)

ဥပမာများ (Examples):

- `subsets: ['latin']`: `latin` subset ပါတဲ့ array

သင့် font အတွက် subsets အားလုံးရဲ့ စာရင်းကို အဲဒီ font ရဲ့ Google Fonts page မှာ တွေ့နိုင်ပါတယ်။

### `axes`

Variable fonts တချို့မှာ ထည့်လို့ရတဲ့ အပို `axes` တွေ ရှိပါတယ်။ Default အနေနဲ့ကတော့ — file size သေးအောင် font weight ကိုပဲ ထည့်ပါတယ်။ `axes` ရဲ့ ဖြစ်နိုင်တဲ့ values တွေက font တစ်ခုချင်းစီအပေါ် မူတည်ပါတယ်။

`next/font/google` မှာ သုံးသည်

- ထည့်စရာ မလို (Optional)

ဥပမာများ (Examples):

- `axes: ['slnt']`: `Inter` variable font အတွက် `slnt` value ပါတဲ့ array — `Inter` မှာ `slnt` က [ဒီမှာ ပြထားသလို](https://fonts.google.com/variablefonts?vfquery=inter#font-families) အပို `axes` တစ်ခုအနေနဲ့ ပါပါတယ်။ သင့် font အတွက် ဖြစ်နိုင်တဲ့ `axes` values တွေကို [Google variable fonts page](https://fonts.google.com/variablefonts#font-families) ပေါ်က filter သုံးပြီး — `wght` ကလွဲပြီး တခြား axes တွေကို ရှာကြည့်နိုင်ပါတယ်

### `display`

Font ရဲ့ [display](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) — ဖြစ်နိုင်တဲ့ string [values](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#values) တွေက `'auto'`, `'block'`, `'swap'`, `'fallback'` (သို့) `'optional'` ဖြစ်ပြီး — default က `'swap'` ပါ။

`next/font/google` နဲ့ `next/font/local` မှာ သုံးသည်

- ထည့်စရာ မလို (Optional)

ဥပမာများ (Examples):

- `display: 'optional'`: `optional` value ကို ပေးထားတဲ့ string

### `preload`

Font ကို [preload](#preloading) လုပ်မလုပ် ဆိုတာကို သတ်မှတ်တဲ့ boolean value ပါ။ Default က `true` ဖြစ်ပါတယ်။

`next/font/google` နဲ့ `next/font/local` မှာ သုံးသည်

- ထည့်စရာ မလို (Optional)

ဥပမာများ (Examples):

- `preload: false`

### `fallback`

Font ကို load လုပ်လို့ မရရင် သုံးမယ့် fallback font ပါ။ Default မရှိဘဲ — fallback fonts တွေရဲ့ strings array အနေနဲ့ သတ်မှတ်ပါတယ်။

`next/font/google` နဲ့ `next/font/local` မှာ သုံးသည်

- ထည့်စရာ မလို (Optional)

ဥပမာများ (Examples):

- `fallback: ['system-ui', 'arial']`: Fallback fonts တွေကို `system-ui` (သို့) `arial` အဖြစ် သတ်မှတ်ပေးတဲ့ array

### `adjustFontFallback`

- `next/font/google` အတွက် — [Cumulative Layout Shift](https://web.dev/cls/) လျှော့ချဖို့ automatic fallback font ကို သုံးမလား ဆိုတဲ့ boolean value ပါ။ Default က `true` ပါ။
- `next/font/local` အတွက် — [Cumulative Layout Shift](https://web.dev/cls/) လျှော့ချဖို့ automatic fallback font ကို သုံးမလား ဆိုတာကို သတ်မှတ်တဲ့ string (သို့) boolean `false` value ပါ။ ဖြစ်နိုင်တဲ့ values တွေက `'Arial'`, `'Times New Roman'` (သို့) `false` — default က `'Arial'` ပါ။

`next/font/google` နဲ့ `next/font/local` မှာ သုံးသည်

- ထည့်စရာ မလို (Optional)

ဥပမာများ (Examples):

- `adjustFontFallback: false`: `next/font/google` အတွက်
- `adjustFontFallback: 'Times New Roman'`: `next/font/local` အတွက်

### `variable`

Style ကို [CSS variable method](#css-variables) နဲ့ သက်ရောက်မယ်ဆိုရင် သုံးမယ့် CSS variable နာမည်ကို သတ်မှတ်တဲ့ string value ပါ။

`next/font/google` နဲ့ `next/font/local` မှာ သုံးသည်

- ထည့်စရာ မလို (Optional)

ဥပမာများ (Examples):

- `variable: '--my-font'`: `--my-font` ဆိုတဲ့ CSS variable ကို declare လုပ်ပါတယ်

### `declarations`

Generated `@font-face` ကို ထပ်ဆင့် သတ်မှတ်ပေးတဲ့ — font face [descriptor](https://developer.mozilla.org/docs/Web/CSS/@font-face#descriptors) key-value pairs တွေရဲ့ array ပါ။

`next/font/local` မှာ သုံးသည်

- ထည့်စရာ မလို (Optional)

ဥပမာများ (Examples):

- `declarations: [{ prop: 'ascent-override', value: '90%' }]`

## ဥပမာများ (Examples)

## Google Fonts

Google font တစ်ခု သုံးဖို့ — `next/font/google` ကနေ function တစ်ခုအနေနဲ့ import လုပ်ပါ။ Performance နဲ့ flexibility အကောင်းဆုံး ဖြစ်ဖို့ [variable fonts](https://fonts.google.com/variablefonts) ကို သုံးဖို့ အကြံပြုပါတယ်။

```tsx filename="app/layout.tsx" switcher
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { Inter } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

Variable font သုံးလို့ မရရင် — **weight တစ်ခု သတ်မှတ်ပေးဖို့ လိုပါလိမ့်မယ်**:

```tsx filename="app/layout.tsx" switcher
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
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

```jsx filename="app/layout.js" switcher
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

Array တစ်ခုကို သုံးပြီး weights နဲ့/ဒါမှမဟုတ် styles အများအပြားကိုလည်း သတ်မှတ်နိုင်ပါတယ်:

```jsx filename="app/layout.js"
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})
```

> **သိထားသင့်သည်:** စာလုံးပေါင်း တစ်ခုထက်ပို ပါဝင်တဲ့ font နာမည်တွေအတွက် underscore (\_) ကို သုံးပါ။ ဥပမာ — `Roboto Mono` ကို `Roboto_Mono` အနေနဲ့ import လုပ်သင့်ပါတယ်။

### Specifying a subset

Google Fonts တွေကို အလိုအလျောက် [subset](https://fonts.google.com/knowledge/glossary/subsetting) လုပ်ပေးပါတယ်။ ဒါက font file ရဲ့ size ကို လျှော့ချပေးပြီး — performance တိုးတက်စေပါတယ်။ ဒီ subsets တွေထဲက ဘယ်ဟာတွေကို preload လုပ်ချင်လဲ ဆိုတာကို ကိုယ်တိုင် သတ်မှတ်ပေးရပါမယ်။ [`preload`](#preload) က `true` ဖြစ်နေချိန်မှာ subset တစ်ခုမှ မသတ်မှတ်ထားရင် warning တစ်ခု ထွက်ပါလိမ့်မယ်။

ဒါကို function call ထဲမှာ ထည့်ပြီး လုပ်နိုင်ပါတယ်:

```tsx filename="app/layout.tsx" switcher
const inter = Inter({ subsets: ['latin'] })
```

```jsx filename="app/layout.js" switcher
const inter = Inter({ subsets: ['latin'] })
```

အသေးစိတ်အတွက် [Font API Reference](#reference) ကို ကြည့်ပါ။

## Fonts အများအပြား သုံးခြင်း (Using Multiple Fonts)

Application ထဲမှာ fonts အများအပြားကို import လုပ်ပြီး သုံးနိုင်ပါတယ်။ ချဉ်းကပ်နည်း နှစ်မျိုး ရှိပါတယ်။

ပထမနည်းက — font တစ်ခုကို export လုပ်ပေးတဲ့ utility function တစ်ခု ဖန်တီးပြီး — လိုအပ်တဲ့နေရာတွေမှာ import လုပ်ကာ သူ့ရဲ့ `className` ကို သက်ရောက်စေတာပါ။ ဒါက font ကို သူ render ဖြစ်မှသာ preload လုပ်ဖို့ သေချာစေပါတယ်:

```ts filename="app/fonts.ts" switcher
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

```js filename="app/fonts.js" switcher
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

```tsx filename="app/layout.tsx" switcher
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

```jsx filename="app/layout.js" switcher
import { inter } from './fonts'

export default function Layout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```tsx filename="app/page.tsx" switcher
import { roboto_mono } from './fonts'

export default function Page() {
  return (
    <>
      <h1 className={roboto_mono.className}>My page</h1>
    </>
  )
}
```

```jsx filename="app/page.js" switcher
import { roboto_mono } from './fonts'

export default function Page() {
  return (
    <>
      <h1 className={roboto_mono.className}>My page</h1>
    </>
  )
}
```

အထက်ပါ ဥပမာမှာ — `Inter` ကို တစ်နေရာလုံး (globally) သက်ရောက်စေပြီး — `Roboto Mono` ကိုတော့ လိုအပ်သလို import လုပ်ပြီး သက်ရောက်စေနိုင်ပါတယ်။

တနည်းအားဖြင့် — [CSS variable](#variable) တစ်ခုကို ဖန်တီးပြီး ကိုယ်ကြိုက်တဲ့ CSS solution နဲ့ တွဲသုံးနိုင်ပါတယ်:

```tsx filename="app/layout.tsx" switcher
import { Inter, Roboto_Mono } from 'next/font/google'
import styles from './global.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>
        <h1>My App</h1>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>
        <h1>My App</h1>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```css filename="app/global.css"
html {
  font-family: var(--font-inter);
}

h1 {
  font-family: var(--font-roboto-mono);
}
```

အထက်ပါ ဥပမာမှာ — `Inter` ကို တစ်နေရာလုံး သက်ရောက်စေပြီး — `<h1>` tags တိုင်းကို `Roboto Mono` နဲ့ style လုပ်ပါလိမ့်မယ်။

> **အကြံပြုချက် (Recommendation):** Font အသစ်တိုင်းက client က download လုပ်ရမယ့် resource အပိုတစ်ခု ဖြစ်လို့ — fonts အများအပြားကို သတိထားပြီးမှ သုံးပါ။

### Local Fonts (Local font များ)

`next/font/local` ကို import လုပ်ပြီး — ကိုယ့် local font file ရဲ့ `src` ကို သတ်မှတ်ပါ။ Performance နဲ့ flexibility အကောင်းဆုံး ဖြစ်ဖို့ [variable fonts](https://fonts.google.com/variablefonts) ကို သုံးဖို့ အကြံပြုပါတယ်။

```tsx filename="app/layout.tsx" switcher
import localFont from 'next/font/local'

// Font files can be colocated inside of `app`
const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
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

```jsx filename="app/layout.js" switcher
import localFont from 'next/font/local'

// Font files can be colocated inside of `app`
const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

Font family တစ်ခုတည်းအတွက် files အများအပြား သုံးချင်ရင် — `src` ကို array အနေနဲ့ ပေးနိုင်ပါတယ်:

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

အသေးစိတ်အတွက် [Font API Reference](#reference) ကို ကြည့်ပါ။

### Tailwind CSS နဲ့ တွဲသုံးခြင်း

`next/font` က [Tailwind CSS](https://tailwindcss.com/) နဲ့ [CSS variables](#css-variables) ကတစ်ဆင့် ချောမွေ့စွာ ပေါင်းစပ်လို့ ရပါတယ်။

အောက်ပါ ဥပမာမှာ `next/font/google` ကနေ `Inter` နဲ့ `Roboto_Mono` fonts တွေကို သုံးထားပါတယ် (ဘယ် Google Font (သို့) Local Font မဆို သုံးနိုင်ပါတယ်)။ ဒီ fonts တွေအတွက် CSS variable နာမည်တွေ သတ်မှတ်ဖို့ `variable` option ကို သုံးပါ — အသီးသီး `inter` နဲ့ `roboto_mono` လိုမျိုးပါ။ ပြီးရင် — HTML document ထဲမှာ ဒီ CSS variables တွေ ပါဝင်စေဖို့ `inter.variable` နဲ့ `roboto_mono.variable` တွေကို သက်ရောက်စေပါ။

> **သိထားသင့်သည်:** ဒီ variables တွေကို ကိုယ့် preference, styling လိုအပ်ချက် (သို့) project requirements အပေါ် မူတည်ပြီး `<html>` (သို့) `<body>` tag ပေါ်မှာ ထည့်နိုင်ပါတယ်။

```tsx filename="app/layout.tsx" switcher
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

```jsx filename="app/layout.js" switcher
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

export default function RootLayout({ children }) {
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

နောက်ဆုံးအနေနဲ့ — CSS variable ကို သင့် [Tailwind CSS config](/docs/nextjs/css#tailwind-css) ထဲ ထည့်ပါ:

```css filename="global.css"
@import 'tailwindcss';

@theme inline {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-roboto-mono);
}
```

### Tailwind CSS v3

```js filename="tailwind.config.js"
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

အခုဆိုရင် `font-sans` နဲ့ `font-mono` utility classes တွေကို သုံးပြီး — သင့် elements တွေကို font သက်ရောက်စေနိုင်ပါပြီ:

```html
<p class="font-sans ...">The quick brown fox ...</p>
<p class="font-mono ...">The quick brown fox ...</p>
```

### Font Style သက်ရောက်ပုံ (Applying Styles)

Font styles တွေကို နည်း သုံးမျိုးနဲ့ သက်ရောက်နိုင်ပါတယ်:

- [`className`](#classname)
- [`style`](#style-1)
- [CSS Variables](#css-variables)

#### `className`

Loaded font အတွက် read-only CSS `className` တစ်ခုကို ပြန်ပေးပြီး — HTML element တစ်ခုကို ထည့်ဖို့ သုံးပါတယ်။

```tsx
<p className={inter.className}>Hello, Next.js!</p>
```

#### `style`

Loaded font အတွက် read-only CSS `style` object တစ်ခုကို ပြန်ပေးပြီး — HTML element တစ်ခုကို ထည့်ဖို့ သုံးပါတယ်။ Font family နာမည်နဲ့ fallback fonts တွေကို ရယူဖို့ `style.fontFamily` အပါအဝင် ပါဝင်ပါတယ်။

```tsx
<p style={inter.style}>Hello World</p>
```

#### CSS Variables

Styles တွေကို external style sheet တစ်ခုထဲမှာ ထားပြီး — အဲဒီမှာ အပို options တွေ သတ်မှတ်ချင်ရင် CSS variable method ကို သုံးပါ။

Font ကို import လုပ်တာအပြင် — CSS variable သတ်မှတ်ထားတဲ့ CSS file ကိုပါ import လုပ်ပြီး font loader object ရဲ့ `variable` option ကို အောက်ပါအတိုင်း သတ်မှတ်ပါ:

```tsx filename="app/page.tsx" switcher
import { Inter } from 'next/font/google'
import styles from '../styles/component.module.css'

const inter = Inter({
  variable: '--font-inter',
})
```

```jsx filename="app/page.js" switcher
import { Inter } from 'next/font/google'
import styles from '../styles/component.module.css'

const inter = Inter({
  variable: '--font-inter',
})
```

Font ကို သုံးဖို့ — style လုပ်ချင်တဲ့ text ရဲ့ parent container ရဲ့ `className` ကို font loader ရဲ့ `variable` value နဲ့ သတ်မှတ်ပြီး — text ရဲ့ `className` ကိုတော့ external CSS file ကနေ လာတဲ့ `styles` property နဲ့ သတ်မှတ်ပါ။

```tsx filename="app/page.tsx" switcher
<main className={inter.variable}>
  <p className={styles.text}>Hello World</p>
</main>
```

```jsx filename="app/page.js" switcher
<main className={inter.variable}>
  <p className={styles.text}>Hello World</p>
</main>
```

`component.module.css` CSS file ထဲမှာ `text` selector class ကို အောက်ပါအတိုင်း သတ်မှတ်ပါ:

```css filename="styles/component.module.css"
.text {
  font-family: var(--font-inter);
  font-weight: 200;
  font-style: italic;
}
```

အထက်ပါ ဥပမာမှာ — `Hello World` text ကို `Inter` font နဲ့ generated font fallback ကို သုံးပြီး — `font-weight: 200` နဲ့ `font-style: italic` နဲ့ style လုပ်ထားပါတယ်။

### Font definitions file သုံးခြင်း (Using a font definitions file)

`localFont` (သို့) Google font function တစ်ခုကို ခေါ်တိုင်း — အဲဒီ font ကို သင့် application ထဲမှာ instance တစ်ခုအနေနဲ့ host လုပ်ပါတယ်။ ဒါကြောင့် — font တစ်ခုတည်းကို နေရာ အများအပြားမှာ သုံးချင်ရင် — နေရာတစ်ခုတည်းမှာ load လုပ်ပြီး လိုအပ်တဲ့နေရာတွေမှာ သက်ဆိုင်ရာ font object ကို import လုပ်ပါ။ ဒါကို font definitions file တစ်ခုနဲ့ လုပ်ပါတယ်။

ဥပမာ — သင့် app directory ရဲ့ root မှာ ရှိတဲ့ `styles` folder ထဲမှာ `fonts.ts` file တစ်ခု ဖန်တီးပါ။

ပြီးရင် — သင့် font definitions တွေကို အောက်ပါအတိုင်း သတ်မှတ်ပါ:

```ts filename="styles/fonts.ts" switcher
import { Inter, Lora, Source_Sans_3 } from 'next/font/google'
import localFont from 'next/font/local'

// define your variable fonts
const inter = Inter()
const lora = Lora()
// define 2 weights of a non-variable font
const sourceCodePro400 = Source_Sans_3({ weight: '400' })
const sourceCodePro700 = Source_Sans_3({ weight: '700' })
// define a custom local font where GreatVibes-Regular.ttf is stored in the styles folder
const greatVibes = localFont({ src: './GreatVibes-Regular.ttf' })

export { inter, lora, sourceCodePro400, sourceCodePro700, greatVibes }
```

```js filename="styles/fonts.js" switcher
import { Inter, Lora, Source_Sans_3 } from 'next/font/google'
import localFont from 'next/font/local'

// define your variable fonts
const inter = Inter()
const lora = Lora()
// define 2 weights of a non-variable font
const sourceCodePro400 = Source_Sans_3({ weight: '400' })
const sourceCodePro700 = Source_Sans_3({ weight: '700' })
// define a custom local font where GreatVibes-Regular.ttf is stored in the styles folder
const greatVibes = localFont({ src: './GreatVibes-Regular.ttf' })

export { inter, lora, sourceCodePro400, sourceCodePro700, greatVibes }
```

ဒီ definitions တွေကို ကုဒ်ထဲမှာ အောက်ပါအတိုင်း သုံးနိုင်ပါပြီ:

```tsx filename="app/page.tsx" switcher
import { inter, lora, sourceCodePro700, greatVibes } from '../styles/fonts'

export default function Page() {
  return (
    <div>
      <p className={inter.className}>Hello world using Inter font</p>
      <p style={lora.style}>Hello world using Lora font</p>
      <p className={sourceCodePro700.className}>
        Hello world using Source_Sans_3 font with weight 700
      </p>
      <p className={greatVibes.className}>My title in Great Vibes font</p>
    </div>
  )
}
```

```jsx filename="app/page.js" switcher
import { inter, lora, sourceCodePro700, greatVibes } from '../styles/fonts'

export default function Page() {
  return (
    <div>
      <p className={inter.className}>Hello world using Inter font</p>
      <p style={lora.style}>Hello world using Lora font</p>
      <p className={sourceCodePro700.className}>
        Hello world using Source_Sans_3 font with weight 700
      </p>
      <p className={greatVibes.className}>My title in Great Vibes font</p>
    </div>
  )
}
```

Font definitions တွေကို ကုဒ်ထဲမှာ ပိုမို လွယ်ကူစွာ ရယူနိုင်ဖို့ — `tsconfig.json` (သို့) `jsconfig.json` files ထဲမှာ path alias တစ်ခု သတ်မှတ်နိုင်ပါတယ်:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "paths": {
      "@/fonts": ["./styles/fonts"]
    }
  }
}
```

အခုဆိုရင် ဘယ် font definition ကိုမဆို အောက်ပါအတိုင်း import လုပ်နိုင်ပါပြီ:

```tsx filename="app/about/page.tsx" switcher
import { greatVibes, sourceCodePro400 } from '@/fonts'
```

```jsx filename="app/about/page.js" switcher
import { greatVibes, sourceCodePro400 } from '@/fonts'
```

### Preloading

Font function တစ်ခုကို site ရဲ့ page တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် — အဲဒီ font က တစ်နေရာလုံးမှာ ရနိုင်ပြီး routes အားလုံးပေါ်မှာ preload လုပ်တာ မဟုတ်ပါဘူး။ အဲဒီအစား — font ကို သုံးတဲ့ file အမျိုးအစားပေါ် မူတည်ပြီး ဆက်စပ်တဲ့ routes တွေမှာပဲ preload လုပ်ပါတယ်:

- [Unique page](/docs/nextjs/file-conventions-page) တစ်ခုမှာ သုံးရင် — အဲဒီ page ရဲ့ unique route မှာ preload လုပ်ပါတယ်။
- [Layout](/docs/nextjs/file-conventions-layout) တစ်ခုမှာ သုံးရင် — layout က wrap လုပ်ထားတဲ့ routes အားလုံးမှာ preload လုပ်ပါတယ်။
- [Root layout](/docs/nextjs/file-conventions-layout#root-layout) မှာ သုံးရင် — routes အားလုံးမှာ preload လုပ်ပါတယ်။

## Version Changes

| Version   | အပြောင်းအလဲ                                                                     |
| --------- | -------------------------------------------------------------------------------- |
| `v13.2.0` | `@next/font` ကို `next/font` လို့ နာမည်ပြောင်းခဲ့ပြီး — installation မလိုအပ်တော့ပါ။ |
| `v13.0.0` | `@next/font` ကို ထည့်သွင်းခဲ့သည်။                                              |
