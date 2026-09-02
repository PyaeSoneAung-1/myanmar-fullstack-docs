---
title: "generateViewport function (viewport options ထုတ်လုပ်ခြင်း)"
description: "generateViewport() — Server Components ကနေ page ရဲ့ viewport (themeColor, colorScheme, width စသည်) ကို dynamic ထုတ်လုပ်ပေးတဲ့ function; static viewport object နဲ့ နှိုင်းယှဉ်ချက်"
order: 43
source: "https://nextjs.org/docs/app/api-reference/functions/generate-viewport"
status: translated
updated: 2026-09-02
---

Page ရဲ့ ကနဦး (initial) viewport ကို static `viewport` object နဲ့ဖြစ်စေ — dynamic `generateViewport` function နဲ့ဖြစ်စေ စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။

> **သိထားသင့်သည်:**
>
> - `viewport` object နဲ့ `generateViewport` function exports တွေကို **Server Components တွေမှာပဲ** ထောက်ပံ့ပေးပါတယ်။
> - Route segment တစ်ခုတည်းကနေ `viewport` object ရော `generateViewport` function ရော နှစ်ခုလုံး export လုပ်လို့ မရပါဘူး။
> - `metadata` exports တွေကနေ ပြောင်းရွှေ့လာတာဆိုရင် — [metadata-to-viewport-export codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#metadata-to-viewport-export) ကို သုံးပြီး ပြောင်းလဲနိုင်ပါတယ်။

## `viewport` object

Viewport options တွေ သတ်မှတ်ဖို့ — `layout.jsx` (သို့) `page.jsx` file တစ်ခုကနေ `viewport` object တစ်ခုကို export လုပ်ပါ။

```tsx
// layout.tsx (သို့) page.tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}

export default function Page() {}
```

## `generateViewport` function

`generateViewport` က viewport field တစ်ခု (သို့) တစ်ခုထက်ပို ပါဝင်တဲ့ Viewport object တစ်ခုကို ပြန်ပေးရပါတယ်။

```tsx
// layout.tsx (သို့) page.tsx
export function generateViewport({ params }) {
  return {
    themeColor: '...',
  }
}
```

TypeScript မှာ — `generateViewport` ကို ဘယ်နေရာမှာ သတ်မှတ်လဲပေါ် မူတည်ပြီး `params` argument ကို [`PageProps<'/route'>`](https://nextjs.org/docs/app/api-reference/file-conventions/page#page-props-helper) (သို့) [`LayoutProps<'/route'>`](https://nextjs.org/docs/app/api-reference/file-conventions/layout#layout-props-helper) နဲ့ type လုပ်နိုင်ပါတယ်။ JavaScript projects တွေမှာတော့ type annotations တွေ မပါဘဲ function ကို export လုပ်ပါတယ်။

> **သိထားသင့်သည်:**
>
> - Viewport က request information ပေါ်မှာ မမှီခိုဘူးဆိုရင် — `generateViewport` မသုံးဘဲ static [`viewport` object](#viewport-object) နဲ့ သတ်မှတ်သင့်ပါတယ်။

## Viewport Fields များ

### `themeColor`

[`theme-color`](https://developer.mozilla.org/docs/Web/HTML/Element/meta/name/theme-color) အကြောင်း ပိုလေ့လာပါ။

**Simple theme color**

```tsx
// layout.tsx (သို့) page.tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}
```

```html
<!-- <head> output -->
<meta name="theme-color" content="black" />
```

**Media attribute ဖြင့်**

```tsx
// layout.tsx (သို့) page.tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}
```

```html
<!-- <head> output -->
<meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
```

### `width`, `initialScale`, `maximumScale` နဲ့ `userScalable`

> **သိထားသင့်သည်:** `viewport` meta tag ကို အလိုအလျောက် သတ်မှတ်ပေးပြီးသားမို့ — manual configuration က ပုံမှန် မလိုအပ်ပါဘူး။ ဒါပေမယ့် ပြည့်စုံမှုအတွက် အောက်မှာ ဖော်ပြပေးထားပါတယ်။

```tsx
// layout.tsx (သို့) page.tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // ထောက်ပံ့ပေးပေမယ့် သိပ်မသုံးကြပါဘူး
  // interactiveWidget: 'resizes-visual',
}
```

```html
<!-- <head> output -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
/>
```

### `colorScheme`

[`color-scheme`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name#:~:text=color%2Dscheme%3A%20specifies,of%20the%20following%3A) အကြောင်း ပိုလေ့လာပါ။

```tsx
// layout.tsx (သို့) page.tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  colorScheme: 'dark',
}
```

```html
<!-- <head> output -->
<meta name="color-scheme" content="dark" />
```

## Cache Components နဲ့အတူ

[Cache Components](/docs/nextjs/caching) enable လုပ်ထားတဲ့အခါ — `generateViewport` က အခြား components တွေနဲ့ အတူတူပဲ စည်းမျဉ်းတွေ လိုက်နာပါတယ်။ Viewport က runtime data (`cookies()`, `headers()`, `params`, `searchParams`) တွေကို ဝင်ရောက်ဖတ်ရင် (သို့) cache မလုပ်ထားတဲ့ data fetching လုပ်ရင် — request time အထိ ရွှေ့ဆိုင်းပေးပါတယ် (defers to request time)။

Metadata နဲ့ မတူဘဲ — viewport က ကနဦး page load UI ကို သက်ရောက်လို့ stream လုပ်လို့ မရပါဘူး။ `generateViewport` က request time အထိ ရွှေ့ဆိုင်းရင် — page က ဖြေရှင်းပြီးတဲ့အထိ block ဖြစ်နေရပါမယ်။

Viewport က external data ပေါ်မှာ မှီခိုပေမယ့် — runtime data ပေါ်မှာ မဟုတ်ဘူးဆိုရင် `use cache` ကို သုံးပါ:

```tsx
// app/layout.tsx
export async function generateViewport() {
  'use cache'
  const { width, initialScale } = await db.query('viewport-size')
  return { width, initialScale }
}
```

Viewport က တကယ့် runtime data လိုအပ်နေတယ်ဆိုရင် — document ရဲ့ `<body>` ကို [`<Suspense>`](https://react.dev/reference/react/Suspense) boundary တစ်ခုအတွင်းမှာ wrap လုပ်ပြီး route တစ်ခုလုံး dynamic ဖြစ်ကြောင်း အချက်ပြပါ။ Shell က ချက်ချင်း ပို့ပေးပြီး — viewport ဖြေရှင်းပြီးတာနဲ့ document က stream လုပ်ပါတယ်:

```tsx
// app/layout.tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'

export async function generateViewport() {
  const cookieJar = await cookies()
  return {
    themeColor: cookieJar.get('theme-color')?.value,
  }
}

export default function RootLayout({ children }) {
  return (
    <Suspense>
      <html>
        <body>{children}</body>
      </html>
    </Suspense>
  )
}
```

တစ်နည်းအားဖြင့် — [`instant = false`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant) နဲ့ segment ကို instant-navigation validation ကနေ ဖယ်ထုတ်နိုင်ပါတယ်။ Route က request တိုင်းမှာ render ဖြစ်ပြီး — navigation က render ပြီးတဲ့အထိ block ဖြစ်နေပါတယ်:

```tsx
// app/dashboard/layout.tsx
import { cookies } from 'next/headers'

export const instant = false

export async function generateViewport() {
  const cookieJar = await cookies()
  return {
    themeColor: cookieJar.get('theme-color')?.value,
  }
}

export default function DashboardLayout({ children }) {
  return <section>{children}</section>
}
```

`instant = false` သတ်မှတ်တာက export လုပ်ထားတဲ့ segment ကိုပဲ ဖယ်ထုတ်ပေးပါတယ် — အောက်က (descendant) segments တွေကတော့ global default နဲ့ပဲ ဆက်စစ်ဆေးခံရပါတယ်။ ဖြေရှင်းနည်း options အပြည့်အစုံ၊ trade-offs နဲ့ subtree တစ်ခုလုံး opt-out အကြောင်း — [Next.js encountered runtime data in `generateViewport()`](https://nextjs.org/docs/messages/blocking-prerender-viewport-runtime) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:** တစ်ချို့ routes တွေအတွက်ပဲ fully dynamic viewport လိုအပ်ပြီး — ကျန်တဲ့ routes တွေကတော့ static shell ထုတ်လုပ်ချင်တယ်ဆိုရင် [multiple root layouts](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layout) ကို သုံးပြီး dynamic viewport ကို သီးသန့် routes တွေမှာ ခွဲထားနိုင်ပါတယ်။

## Types

`Viewport` type ကို သုံးပြီး သင့် viewport object ကို type-safe ဖြစ်စေနိုင်ပါတယ်။ IDE ထဲမှာ [built-in TypeScript plugin](https://nextjs.org/docs/app/api-reference/config/typescript) သုံးနေရင် type ကို လက်နဲ့ ထည့်စရာ မလိုပါဘူး — ဒါပေမယ့် လိုချင်ရင် ထင်ရှားစွာ (explicitly) ထည့်လို့လည်း ရပါတယ်။

### `viewport` object

```tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}
```

### `generateViewport` function

#### Regular function

```tsx
import type { Viewport } from 'next'

export function generateViewport(): Viewport {
  return {
    themeColor: 'black',
  }
}
```

#### Segment props ဖြင့်

```tsx
import type { Viewport } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export function generateViewport({ params, searchParams }: Props): Viewport {
  return {
    themeColor: 'black',
  }
}

export default function Page({ params, searchParams }: Props) {}
```

#### JavaScript Projects

JavaScript projects တွေအတွက် — JSDoc သုံးပြီး type safety ထည့်နိုင်ပါတယ်။

```js
/** @type {import("next").Viewport} */
export const viewport = {
  themeColor: 'black',
}
```

## Version History

| Version   | အပြောင်းအလဲ                               |
| --------- | --------------------------------------- |
| `v14.0.0` | `viewport` နဲ့ `generateViewport` စတင် မိတ်ဆက် |
