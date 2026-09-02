---
title: "generateMetadata function (dynamic metadata ထုတ်လုပ်ခြင်း)"
description: "Metadata API — `metadata` object (static) နဲ့ `generateMetadata` function (dynamic) သုံးပြီး SEO နဲ့ web shareability အတွက် title, description, Open Graph, robots, icons, twitter စတဲ့ metadata fields အားလုံး သတ်မှတ်နည်း"
order: 45
source: "https://nextjs.org/docs/app/api-reference/functions/generate-metadata"
status: translated
updated: 2026-09-02
---

Metadata ကို `metadata` object နဲ့ဖြစ်စေ၊ `generateMetadata` function နဲ့ဖြစ်စေ သတ်မှတ်နိုင်ပါတယ်။

<a id="the-metadata-object"></a>

## `metadata` object (static metadata)

Static metadata သတ်မှတ်ဖို့ — `layout.js` (သို့) `page.js` file ကနေ [`Metadata` object](#metadata-fields) တစ်ခုကို export လုပ်ပါ။

```jsx
// app/layout.js | app/page.js
export const metadata = {
  title: '...',
  description: '...',
}

export default function Page() {}
```

> ပံ့ပိုးထားတဲ့ options တွေ အားလုံးအတွက် [Metadata Fields](#metadata-fields) ကို ကြည့်ပါ။

## `generateMetadata` function (dynamic metadata)

**Dynamic information** တွေပေါ် မူတည်တဲ့ metadata — ဥပမာ လက်ရှိ route ရဲ့ parameters, external data, (သို့) parent segments တွေရဲ့ metadata — ကို [`Metadata` object](#metadata-fields) တစ်ခု ပြန်ပေးတဲ့ `generateMetadata` function ကို export လုပ်ခြင်းဖြင့် သတ်မှတ်နိုင်ပါတယ်။

`generateMetadata` ကို resolve လုပ်တာက page ကို render လုပ်တဲ့အဆင့်ရဲ့ အစိတ်အပိုင်းတစ်ခုပါ။ Page ကို prerender လုပ်လို့ရပြီး `generateMetadata` က dynamic behavior မဖြစ်စေဘူးဆိုရင် — ရလာတဲ့ metadata က page ရဲ့ initial HTML ထဲမှာ ပါဝင်ပါတယ်။ မဟုတ်ရင် `generateMetadata` ကနေ resolve လုပ်လိုက်တဲ့ metadata တွေကို initial UI ပို့ပြီးမှ [stream လုပ်ပြီး ပို့နိုင်ပါတယ်](#streaming-metadata)။

```tsx
// app/products/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { id } = await params

  // fetch data
  const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

export default function Page({ params, searchParams }: Props) {}
```

`params` နဲ့ `searchParams` တို့ရဲ့ type completion ရဖို့ — pages တွေမှာ [`PageProps<'/route'>`](https://nextjs.org/docs/app/api-reference/file-conventions/page#page-props-helper), layouts တွေမှာ [`LayoutProps<'/route'>`](https://nextjs.org/docs/app/api-reference/file-conventions/layout#layout-props-helper) တွေနဲ့ first argument ကို type လုပ်နိုင်ပါတယ်။

> **သိထားသင့်သည်:**
>
> - Metadata ကို `layout.js` နဲ့ `page.js` file တွေမှာ ထည့်နိုင်ပါတယ်။ Next.js က metadata ကို အလိုအလျောက် resolve လုပ်ပြီး page အတွက် သင့်တော်တဲ့ `<head>` tags တွေ ဖန်တီးပေးပါတယ်။
> - `metadata` object နဲ့ `generateMetadata` function exports တွေက **Server Components တွေမှာပဲ** ထောက်ပံ့ပါတယ်။
> - Route segment တစ်ခုတည်းကနေ `metadata` object ရော `generateMetadata` function ရော နှစ်ခုလုံး export လုပ်လို့ မရပါဘူး။
> - `generateMetadata` ထဲက `fetch` requests တွေက `generateMetadata`, `generateStaticParams`, Layouts, Pages, Server Components တွေကြားမှာ တူညီတဲ့ data အတွက် အလိုအလျောက် [memoized](https://nextjs.org/docs/app/glossary#memoization) ဖြစ်ပါတယ်။ `fetch` မရရှိနိုင်ရင် React [`cache`](https://react.dev/reference/react/cache) ကို သုံးနိုင်ပါတယ်။
> - [File-based metadata](https://nextjs.org/docs/app/api-reference/file-conventions/metadata) က priority ပိုမြင့်ပြီး — `metadata` object နဲ့ `generateMetadata` function ကို override လုပ်ပါတယ်။

## Server Components တွေမှာပဲ ဘာကြောင့် အလုပ်လုပ်လဲ

`generateMetadata` နဲ့ `metadata` export တွေက Server Components တွေမှာပဲ ထောက်ပံ့ပါတယ် — အကြောင်းကတော့ page component ကို render မလုပ်ခင် metadata ကို server ပေါ်မှာ resolve လုပ်ပြီးသား ဖြစ်နေရမှာ ဖြစ်လို့ပါ။ ဒါမှသာ Next.js က metadata ကို initial HTML response ထဲမှာ ထည့်နိုင်မှာပါ။

Client Component features တွေ သုံးဖို့ လိုအပ်ရင် — သင့် `page.tsx` ကို Server Component အဖြစ် ထားပြီး Client Component logic တွေကို သီးခြား file တစ်ခုဆီ ရွှေ့ပါ:

```tsx
// app/page.tsx
import type { Metadata } from 'next'
import { InteractiveComponent } from './interactive-component'

export const metadata: Metadata = {
  title: 'My Page',
}

export default function Page() {
  return <InteractiveComponent />
}
```

```tsx
// app/interactive-component.tsx
'use client'

export function InteractiveComponent() {
  // Client-side interactivity (hooks, event handlers, etc.)
}
```

## Reference

### Parameters

`generateMetadata` function က အောက်ပါ parameters တွေကို လက်ခံပါတယ်:

- `props` — လက်ရှိ route ရဲ့ parameters တွေ ပါဝင်တဲ့ object တစ်ခု:
  - `params` — `generateMetadata` ကို ခေါ်ထားတဲ့ segment အထိ root segment ကနေ ဆင်းလာတဲ့ [dynamic route parameters](/docs/nextjs/dynamic-routes) object တစ်ခုပါ။

    | Route                           | URL         | `params`                  |
    | ------------------------------- | ----------- | ------------------------- |
    | `app/shop/[slug]/page.js`       | `/shop/1`   | `{ slug: '1' }`           |
    | `app/shop/[tag]/[item]/page.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
    | `app/shop/[...slug]/page.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

  - `searchParams` — လက်ရှိ URL ရဲ့ [search params](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#parameters) တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

    | URL             | `searchParams`       |
    | --------------- | -------------------- |
    | `/shop?a=1`     | `{ a: '1' }`         |
    | `/shop?a=1&b=2` | `{ a: '1', b: '2' }` |
    | `/shop?a=1&a=2` | `{ a: ['1', '2'] }`  |

- `parent` — parent route segments တွေကနေ resolve လုပ်ပြီးသား metadata ရဲ့ promise တစ်ခုပါ။

### Returns

`generateMetadata` က field တစ်ခု (သို့) အများအပြား ပါဝင်နိုင်တဲ့ [`Metadata` object](#metadata-fields) တစ်ခုကို ပြန်ပေးရပါမယ်။

> **သိထားသင့်သည်:**
>
> - Metadata က request information ပေါ် မမူတည်ဘူးဆိုရင် — `generateMetadata` အစား static [`metadata` object](#the-metadata-object) ကို သုံးသင့်ပါတယ်။
> - `fetch` requests တွေက `generateMetadata`, `generateStaticParams`, Layouts, Pages, Server Components တွေကြားမှာ တူညီတဲ့ data အတွက် အလိုအလျောက် memoized ဖြစ်ပါတယ်။ `fetch` မရရှိနိုင်ရင် React [`cache`](https://react.dev/reference/react/cache) ကို သုံးနိုင်ပါတယ်။
> - `searchParams` တွေကို `page.js` segments တွေမှာပဲ ရနိုင်ပါတယ်။
> - `generateMetadata` အတွင်းမှာလည်း Next.js ရဲ့ [`redirect()`](/docs/nextjs/redirect) နဲ့ [`notFound()`](/docs/nextjs/not-found) methods တွေ သုံးနိုင်ပါတယ်။

<a id="metadata-fields"></a>

### Metadata Fields

အောက်ပါ fields တွေကို ထောက်ပံ့ပေးပါတယ်:

#### `title`

`title` field က document ရဲ့ ခေါင်းစဉ်ကို သတ်မှတ်ပါတယ်။ Simple [string](#string) (သို့) [template object](#template) အနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။

##### String

```jsx
// app/layout.js | app/page.js
export const metadata = {
  title: 'Next.js',
}
```

```html
<!-- <head> output -->
<title>Next.js</title>
```

##### `default`

`title.default` ကို သုံးပြီး — ကိုယ်ပိုင် `title` မသတ်မှတ်ထားတဲ့ **child route segments** တွေအတွက် **fallback title** တစ်ခု ပေးနိုင်ပါတယ်။

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Acme',
  },
}
```

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {}

// Output: <title>Acme</title>
```

##### `template`

`title.template` ကို သုံးပြီး — **child** route segments တွေမှာ သတ်မှတ်ထားတဲ့ `title` တွေအတွက် prefix (သို့) suffix တစ်ခု ထည့်နိုင်ပါတယ်။

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Acme',
    default: 'Acme', // a default is required when creating a template
  },
}
```

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

// Output: <title>About | Acme</title>
```

> **သိထားသင့်သည်:**
>
> - `title.template` က **child** route segments တွေကို သက်ရောက်ပြီး — သူ့ကိုယ်တိုင် သတ်မှတ်ထားတဲ့ segment ကိုတော့ မသက်ရောက်ပါဘူး။ ဒါကြောင့်:
>   - `title.template` ထည့်တဲ့အခါ `title.default` က **မဖြစ်မနေ လိုအပ်ပါတယ်**။
>   - `layout.js` ထဲက `title.template` က route segment တစ်ခုတည်းရဲ့ `page.js` ထဲက `title` ကို သက်ရောက်မှာ မဟုတ်ပါဘူး။
>   - `page.js` ထဲက `title.template` က အကျိုးသက်ရောက်မှု မရှိပါဘူး — page က အမြဲတမ်း terminating segment ဖြစ်လို့ပါ (သူ့အောက်မှာ child route segments တွေ မရှိတော့လို့)။
> - Route တစ်ခုက `title` (သို့) `title.default` မသတ်မှတ်ထားရင် `title.template` က **အကျိုးသက်ရောက်မှု မရှိပါဘူး**။

##### `absolute`

`title.absolute` ကို သုံးပြီး — parent segments တွေမှာ သတ်မှတ်ထားတဲ့ `title.template` ကို **လျစ်လျူရှုပြီး** သုံးမယ့် title တစ်ခု ပေးနိုင်ပါတယ်။

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Acme',
  },
}
```

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'About',
  },
}

// Output: <title>About</title>
```

အချုပ်အားဖြင့် — `layout.js` မှာဆိုရင် `title` (string) နဲ့ `title.default` တို့က ကိုယ်ပိုင် `title` မရှိတဲ့ child segments တွေအတွက် default title ဖြစ်ပြီး၊ `title.absolute` က parent ရဲ့ `title.template` ကို လျစ်လျူရှုတဲ့ default title ဖြစ်ကာ၊ `title.template` က child segments တွေအတွက် title template အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ `page.js` မှာတော့ — page က ကိုယ်ပိုင် title မရှိရင် အနီးဆုံး parent ရဲ့ resolved title ကို သုံးပြီး၊ `title` (string) က route ရဲ့ title ဖြစ်ကာ၊ `title.absolute` က `title.template` တွေကို လျစ်လျူရှုပါတယ်။ `title.template` ကတော့ `page.js` မှာ အကျိုးသက်ရောက်မှု မရှိပါဘူး — page က route ရဲ့ terminating segment အမြဲ ဖြစ်လို့ပါ။

#### `description`

```jsx
// app/layout.js | app/page.js
export const metadata = {
  description: 'The React Framework for the Web',
}
```

```html
<!-- <head> output -->
<meta name="description" content="The React Framework for the Web" />
```

#### အခြား basic fields

`generator`, `applicationName`, `referrer`, `keywords`, `authors`, `creator`, `publisher`, `formatDetection` စတဲ့ fields တွေလည်း ရှိပါတယ်:

```jsx
// app/layout.js | app/page.js
export const metadata = {
  generator: 'Next.js',
  applicationName: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'JavaScript'],
  authors: [{ name: 'Seb' }, { name: 'Josh', url: 'https://nextjs.org' }],
  creator: 'Jiachi Liu',
  publisher: 'Sebastian Markbåge',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}
```

ဒီကနေ `<meta name="application-name">`, `<meta name="author">`, `<link rel="author">`, `<meta name="generator">`, `<meta name="keywords">`, `<meta name="referrer">`, `<meta name="creator">`, `<meta name="publisher">`, `<meta name="format-detection">` စတဲ့ tags တွေ ထုတ်ပေးပါတယ်။

#### `metadataBase`

`metadataBase` က fully qualified URL လိုအပ်တဲ့ `metadata` fields တွေအတွက် base URL prefix တစ်ခု သတ်မှတ်ပေးတဲ့ convenience option ပါ။ ဒါကြောင့် — **လက်ရှိ route segment နဲ့ အောက်ပိုင်း** မှာ သတ်မှတ်ထားတဲ့ URL-based `metadata` fields တွေက absolute URL အစား **relative path** တွေ သုံးလို့ရပါတယ် — field ရဲ့ relative path ကို `metadataBase` နဲ့ ပေါင်းပြီး fully qualified URL အဖြစ် ဖွဲ့ပေးပါတယ်။

```jsx
// app/layout.js | app/page.js
export const metadata = {
  metadataBase: new URL('https://acme.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: '/og-image.png',
  },
}
```

ဒီကနေ `<link rel="canonical" href="https://acme.com">`, hreflang alternate links တွေ, `<meta property="og:image" content="https://acme.com/og-image.png">` စတဲ့ absolute tags တွေ ထုတ်ပေးပါတယ်။

> **သိထားသင့်သည်:**
>
> - `metadataBase` ကို root `app/layout.js` မှာ သတ်မှတ်လေ့ ရှိပြီး — routes အားလုံးရဲ့ URL-based `metadata` fields တွေကို သက်ရောက်စေပါတယ်။
> - `generateMetadata` မှာ `'use cache'` သုံးရင် — ပြန်ပေးတဲ့ တန်ဖိုးက serializable ဖြစ်ရပါမယ်။ `URL` instances တွေက Cache Functions တွေမှာ မထောက်ပံ့ပါဘူး — ဒါကြောင့် `metadataBase` လိုမျိုး တန်ဖိုးတွေကို string အနေနဲ့ ပြန်ပို့သင့်ပါတယ် (ဥပမာ `url.toString()` နဲ့)။ [`use cache` serialization requirements](https://nextjs.org/docs/app/api-reference/directives/use-cache#serialization) ကို ကြည့်ပါ။
> - Absolute URL လိုအပ်တဲ့ URL-based `metadata` fields တွေအားလုံးကို `metadataBase` option နဲ့ configure လုပ်နိုင်ပါတယ်။
> - `metadataBase` မှာ subdomain (ဥပမာ `https://app.acme.com`) (သို့) base path (ဥပမာ `https://acme.com/start/from/here`) ပါ ပါဝင်နိုင်ပါတယ်။
> - Metadata field တစ်ခုက absolute URL ပေးထားရင် `metadataBase` ကို လျစ်လျူရှုပါတယ်။
> - `metadataBase` မသတ်မှတ်ဘဲ URL-based `metadata` field တစ်ခုမှာ relative path သုံးရင် build error ဖြစ်ပါတယ်။
> - Next.js က `metadataBase` (ဥပမာ `https://acme.com/`) နဲ့ relative field (ဥပမာ `/path`) ကြားက duplicate slashes တွေကို single slash တစ်ခုတည်းအဖြစ် normalize လုပ်ပါတယ်။

#### URL Composition (URL ဖွဲ့စည်းပုံ)

URL composition က default directory traversal semantics တွေထက် developer ရဲ့ ရည်ရွယ်ချက်ကို ဦးစားပေးပါတယ်:

- `metadataBase` နဲ့ `metadata` fields တွေကြားက trailing slashes တွေကို normalize လုပ်ပါတယ်။
- `metadata` field ထဲက "absolute" path တစ်ခု (ပုံမှန်ဆို URL path တစ်ခုလုံးကို အစားထိုးမယ့်ဟာ) ကို "relative" path အဖြစ် သဘောထားပြီး — `metadataBase` ရဲ့ အဆုံးကနေ စတင်ပါတယ်။

ဥပမာ — အပေါ်က `metadataBase: new URL('https://acme.com')` ရှိနေတုန်း ကိုယ်ပိုင် value သတ်မှတ်တဲ့ field တွေကို အောက်ပါအတိုင်း resolve လုပ်ပါတယ်:

| `metadata` field               | Resolved URL                     |
| ------------------------------ | -------------------------------- |
| `/`                            | `https://acme.com`               |
| `./`                           | `https://acme.com`               |
| `payments`                     | `https://acme.com/payments`      |
| `/payments`                    | `https://acme.com/payments`      |
| `./payments`                   | `https://acme.com/payments`      |
| `../payments`                  | `https://acme.com/payments`      |
| `https://beta.acme.com/payments` | `https://beta.acme.com/payments` |

#### `openGraph`

Social networks (Facebook, LinkedIn စသဖြင့်) တွေပေါ်မှာ link တစ်ခု မျှဝေတဲ့အခါ ပြသမယ့် Open Graph protocol data တွေကို သတ်မှတ်ပါတယ်:

```jsx
// app/layout.js | app/page.js
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
    siteName: 'Next.js',
    images: [
      {
        url: 'https://nextjs.org/og.png', // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: 'https://nextjs.org/og-alt.png', // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ],
    videos: [
      {
        url: 'https://nextjs.org/video.mp4', // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    audio: [
      {
        url: 'https://nextjs.org/audio.mp3', // Must be an absolute URL
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
```

ဒီကနေ `og:title`, `og:description`, `og:url`, `og:site_name`, `og:image` (+ `og:image:width`/`height`/`alt`), `og:video`, `og:audio`, `og:locale`, `og:type` စတဲ့ `<meta property="og:...">` tags တွေ ထုတ်ပေးပါတယ်။ `type: 'article'` သုံးရင် — `publishedTime`, `authors` စတဲ့ fields တွေပါ ထည့်နိုင်ပြီး `article:published_time` နဲ့ `article:author` tags တွေ ထုတ်ပေးပါတယ်။

> **သိထားသင့်သည်:** Open Graph images တွေအတွက်တော့ [file-based Metadata API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#image-files-jpg-png-gif) က ပိုအဆင်ပြေပါတယ် — config export တွေကို တကယ့် files တွေနဲ့ ကိုက်ညီအောင် ထိန်းစရာ မလိုဘဲ file-based API က သင့်တော်တဲ့ metadata တွေကို အလိုအလျောက် ထုတ်ပေးလို့ပါ။

#### `robots`

Search engine crawlers တွေ page ကို ဘယ်လို index လုပ်သင့်လဲ ဆိုတာ ထိန်းချုပ်ပါတယ်:

```tsx
// app/layout.tsx | app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

ဒီကနေ `<meta name="robots" content="index, follow" />` နဲ့ `<meta name="googlebot" content="...">` tags တွေ ထုတ်ပေးပါတယ်။ [`robots` file convention](/docs/nextjs/robots) နဲ့လည်း robots.txt generate လုပ်နိုင်ပါတယ်။

#### `icons`

Browser tab, PWA စတဲ့နေရာတွေအတွက် icon files တွေကို ညွှန်ပြပါတယ်:

```jsx
// app/layout.js | app/page.js
export const metadata = {
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
}
```

ဒီကနေ `<link rel="shortcut icon">`, `<link rel="icon">`, `<link rel="apple-touch-icon">`, `<link rel="apple-touch-icon-precomposed">` tags တွေ ထုတ်ပေးပါတယ်။ ဒါတွေကို arrays အနေနဲ့လည်း သတ်မှတ်နိုင်ပြီး — entry တစ်ခုချင်းစီမှာ `url`, `media` (ဥပမာ `'(prefers-color-scheme: dark)'`), `sizes`, `type` စတဲ့ fields တွေ ထည့်နိုင်ပြီး `new URL()` instances တွေပါ သုံးနိုင်ပါတယ်။

> **သိထားသင့်သည်:** Icons တွေအတွက် [file-based Metadata API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png) ကို သုံးဖို့ အကြံပြုပါတယ်။ `msapplication-*` meta tags တွေကတော့ Microsoft Edge ရဲ့ Chromium builds တွေမှာ မထောက်ပံ့တော့ဘဲ — နောက်ထပ် မလိုအပ်တော့ပါဘူး။

#### `themeColor` (deprecated)

> **Deprecated:** `metadata` ထဲက `themeColor` option က Next.js 14 ကစပြီး deprecated ဖြစ်ပါတယ်။ အစား [`viewport` configuration](/docs/nextjs/generate-viewport) ကို သုံးပါ။

#### `colorScheme` (deprecated)

> **Deprecated:** `metadata` ထဲက `colorScheme` option က Next.js 14 ကစပြီး deprecated ဖြစ်ပါတယ်။ အစား [`viewport` configuration](/docs/nextjs/generate-viewport) ကို သုံးပါ။

#### `manifest`

[Web Application Manifest specification](https://developer.mozilla.org/docs/Web/Manifest) အရ သတ်မှတ်ထားတဲ့ web application manifest ကို ညွှန်ပြပါတယ်:

```jsx
// app/layout.js | app/page.js
export const metadata = {
  manifest: 'https://nextjs.org/manifest.json',
}
```

```html
<!-- <head> output -->
<link rel="manifest" href="https://nextjs.org/manifest.json" />
```

#### `twitter`

Twitter Card markup တွေကို သတ်မှတ်ပါတယ် — ဒီ specification ကို X (နောက်ပိုင်း Twitter) တင်မက အခြားနေရာတွေမှာပါ သုံးလေ့ ရှိပါတယ်။ [Twitter Card markup reference](https://developer.x.com/en/docs/twitter-for-websites/cards/overview/markup) ကို ကြည့်ပါ။

```jsx
// app/layout.js | app/page.js
export const metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: ['https://nextjs.org/og.png'], // Must be an absolute URL
  },
}
```

ဒီကနေ `twitter:card`, `twitter:site:id`, `twitter:creator`, `twitter:creator:id`, `twitter:title`, `twitter:description`, `twitter:image` စတဲ့ `<meta name="twitter:...">` tags တွေ ထုတ်ပေးပါတယ်။ `card: 'app'` သုံးရင် — `app` object ထဲမှာ app name, platform ids (iphone/ipad/googleplay) နဲ့ urls တွေ သတ်မှတ်ပြီး `twitter:app:*` tags တွေ ထုတ်ပေးနိုင်ပါတယ်။ `images` ကို object တစ်ခုအနေနဲ့လည်း သတ်မှတ်နိုင်ပြီး `alt` text ပါ ထည့်နိုင်ပါတယ်။

#### `viewport` (deprecated)

> **Deprecated:** `metadata` ထဲက `viewport` option က Next.js 14 ကစပြီး deprecated ဖြစ်ပါတယ်။ အစား [`viewport` configuration](/docs/nextjs/generate-viewport) ကို သုံးပါ။

#### `verification`

Site တစ်ခုရဲ့ ပိုင်ဆိုင်မှုကို search engines (သို့) third-party services တွေဆီ သက်သေပြဖို့ verification codes တွေ သတ်မှတ်ပါတယ်:

```jsx
// app/layout.js | app/page.js
export const metadata = {
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
    other: {
      me: ['my-email', 'my-link'],
    },
  },
}
```

ဒီကနေ `<meta name="google-site-verification">`, `<meta name="y_key">`, `<meta name="yandex-verification">` နဲ့ custom `<meta name="me">` tags တွေ ထုတ်ပေးပါတယ်။

#### `appleWebApp`

Apple platform တွေပေါ်မှာ web app ကို standalone app လိုမျိုး ပြုမူစေဖို့ သတ်မှတ်ချက်တွေပါ:

```jsx
// app/layout.js | app/page.js
export const metadata = {
  itunes: {
    appId: 'myAppStoreID',
    appArgument: 'myAppArgument',
  },
  appleWebApp: {
    title: 'Apple Web App',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/assets/startup/apple-touch-startup-image-768x1004.png',
      {
        url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
}
```

ဒီကနေ `apple-itunes-app`, `mobile-web-app-capable`, `apple-mobile-web-app-title`, `apple-touch-startup-image` links, `apple-mobile-web-app-status-bar-style` စတဲ့ meta tags တွေ ထုတ်ပေးပါတယ်။

#### `alternates`

ဒီ page ရဲ့ အခြားရွေးချယ်စရာ ဗားရှင်းတွေကို ညွှန်ပြပါတယ်:

```jsx
// app/layout.js | app/page.js
export const metadata = {
  alternates: {
    canonical: 'https://nextjs.org',
    languages: {
      'en-US': 'https://nextjs.org/en-US',
      'de-DE': 'https://nextjs.org/de-DE',
    },
    media: {
      'only screen and (max-width: 600px)': 'https://nextjs.org/mobile',
    },
    types: {
      'application/rss+xml': 'https://nextjs.org/rss',
    },
  },
}
```

ဒီကနေ `<link rel="canonical">` နဲ့ `rel="alternate"` (hreflang, media, type တွေနဲ့အတူ) tags တွေ ထုတ်ပေးပါတယ်။

#### `appLinks`

App Links ကို သုံးပြီး — app ကို deep link လုပ်တဲ့ metadata တွေ သတ်မှတ်နိုင်ပါတယ်:

```jsx
// app/layout.js | app/page.js
export const metadata = {
  appLinks: {
    ios: {
      url: 'https://nextjs.org/ios',
      app_store_id: 'app_store_id',
    },
    android: {
      package: 'com.example.android/package',
      app_name: 'app_name_android',
    },
    web: {
      url: 'https://nextjs.org/web',
      should_fallback: true,
    },
  },
}
```

ဒီကနေ `<meta property="al:ios:url">`, `al:ios:app_store_id`, `al:android:package`, `al:android:app_name`, `al:web:url`, `al:web:should_fallback` စတဲ့ `<meta property="al:...">` tags တွေ ထုတ်ပေးပါတယ်။

#### `archives`

သမိုင်းဝင် စိတ်ဝင်စားဖွယ် မှတ်တမ်း/document/material တွေရဲ့ collection တစ်ခုကို ဖော်ပြပါတယ် ([source](https://www.w3.org/TR/2011/WD-html5-20110113/links.html#rel-archives)) — `<link rel="archives" href="https://nextjs.org/13" />` tag တစ်ခု ထုတ်ပေးပါတယ်။

```jsx
// app/layout.js | app/page.js
export const metadata = {
  archives: ['https://nextjs.org/13'],
}
```

#### `assets`

Page နဲ့ ဆက်စပ်နေတဲ့ assets တွေကို ညွှန်ပြပါတယ် — `<link rel="assets" href="https://nextjs.org/assets" />` tag တစ်ခု ထုတ်ပေးပါတယ်။

```jsx
// app/layout.js | app/page.js
export const metadata = {
  assets: ['https://nextjs.org/assets'],
}
```

#### `bookmarks`

Bookmarks အတွက် အခြားရွေးချယ်စရာ link တွေ ပေးပါတယ် — `<link rel="bookmarks" href="https://nextjs.org/13" />` tag တစ်ခု ထုတ်ပေးပါတယ်။

```jsx
// app/layout.js | app/page.js
export const metadata = {
  bookmarks: ['https://nextjs.org/13'],
}
```

#### `pagination`

Pagination လုပ်ထားတဲ့ sequence တစ်ခုရဲ့ ရှေ့/နောက် စာမျက်နှာတွေကို ဖော်ပြပါတယ် — `<link rel="prev">` နဲ့ `<link rel="next">` tags တွေ ထုတ်ပေးပါတယ်။

```jsx
// app/layout.js | app/page.js
export const metadata = {
  pagination: {
    previous: 'https://nextjs.org/blog?page=1',
    next: 'https://nextjs.org/blog?page=3',
  },
}
```

#### `category`

Page ရဲ့ category ကို သတ်မှတ်ပါတယ် — `<meta name="category" content="technology" />` tag တစ်ခု ထုတ်ပေးပါတယ်။

```jsx
// app/layout.js | app/page.js
export const metadata = {
  category: 'technology',
}
```

#### `facebook`

Facebook app တစ်ခု (သို့) account တစ်ခုကို သင့် webpage နဲ့ ချိတ်ဆက်ဖို့ သုံးပါတယ် — [Facebook Social Plugins](https://developers.facebook.com/docs/plugins/comments/#moderation-setup-instructions) တွေအတွက် ဖြစ်ပါတယ်။

> **သိထားသင့်သည်:** `appId` (သို့) `admins` — တစ်ခုခုကိုပဲ သတ်မှတ်လို့ရပါတယ်၊ နှစ်ခုလုံး မသတ်မှတ်ရပါဘူး။

```jsx
// app/layout.js | app/page.js
export const metadata = {
  facebook: {
    appId: '12345678',
  },
}
```

`fb:admins` meta tags အများအပြား generate ချင်ရင် array value သုံးနိုင်ပါတယ် — `admins: ['12345678', '87654321']` ဆိုရင် `<meta property="fb:admins">` နှစ်ခု ထွက်ပါတယ်။

#### `pinterest`

Page ပေါ်မှာ [Pinterest Rich Pins](https://developers.pinterest.com/docs/web-features/rich-pins-overview/) ကို ဖွင့်/ပိတ် လုပ်နိုင်ပါတယ်:

```jsx
// app/layout.js | app/page.js
export const metadata = {
  pinterest: {
    richPin: true,
  },
}
```

```html
<!-- <head> output -->
<meta name="pinterest-rich-pin" content="true" />
```

#### `other`

Built-in support တွေက metadata options တွေ အားလုံးကို လွှမ်းခြုံထားပါတယ်။ ဒါပေမယ့် — သင့် site အတွက် သီးသန့် custom metadata tags တွေ (သို့) အသစ်ထွက်လာတဲ့ metadata tags တွေ ရှိနိုင်ပါတယ်။ ဘယ် custom metadata tag မဆို render လုပ်ဖို့ `other` option ကို သုံးနိုင်ပါတယ်။

```jsx
// app/layout.js | app/page.js
export const metadata = {
  other: {
    custom: 'meta',
  },
}
```

Key တစ်ခုတည်းအတွက် meta tags အများအပြား generate ချင်ရင် array value သုံးပါ — `custom: ['meta1', 'meta2']` ဆိုရင် `<meta name="custom" content="meta1" />` နဲ့ `<meta name="custom" content="meta2" />` နှစ်ခုလုံး ထွက်ပါတယ်။

#### Types (type safety)

`Metadata` type ကို သုံးပြီး metadata တွေကို type-safe လုပ်နိုင်ပါတယ်။ IDE မှာ [built-in TypeScript plugin](https://nextjs.org/docs/app/api-reference/config/typescript) သုံးနေရင် type ကို ကိုယ်တိုင် ထည့်စရာ မလိုပါဘူး — လိုချင်ရင်တော့ ထည့်နိုင်ပါတယ်။

```tsx
// app/layout.tsx | app/page.tsx
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: 'Next.js',
  }
}
```

Regular (non-async) function အနေနဲ့လည်း ရေးနိုင်သလို — JavaScript projects တွေမှာ JSDoc နဲ့လည်း type safety ရနိုင်ပါတယ်:

```js
// app/layout.js | app/page.js
/** @type {import("next").Metadata} */
export const metadata = {
  title: 'Next.js',
}
```

#### Unsupported Metadata (built-in မပါတဲ့ metadata)

အောက်ပါ metadata types တွေက လောလောဆယ် built-in support မရှိပါဘူး — ဒါပေမယ့် layout (သို့) page ထဲမှာ ကိုယ်တိုင် render လုပ်နိုင်ပါတယ်:

| Metadata                        | အကြံပြုချက်                                                                                                                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `<meta http-equiv="...">`       | [`redirect()`](/docs/nextjs/redirect), [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#nextresponse), [Security Headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers) တွေနဲ့ သင့်တော်တဲ့ HTTP Headers တွေ သုံးပါ |
| `<base>`                        | Tag ကို layout (သို့) page ထဲမှာ ကိုယ်တိုင် render လုပ်ပါ                                                                           |
| `<noscript>`                    | Tag ကို layout (သို့) page ထဲမှာ ကိုယ်တိုင် render လုပ်ပါ                                                                           |
| `<style>`                       | [Next.js မှာ styling](https://nextjs.org/docs/app/getting-started/css) အကြောင်း လေ့လာပါ                                             |
| `<script>`                      | [Scripts သုံးနည်း](https://nextjs.org/docs/app/guides/scripts) ကို လေ့လာပါ                                                         |
| `<link rel="stylesheet" />`     | Stylesheets တွေကို layout (သို့) page ထဲမှာ တိုက်ရိုက် `import` လုပ်ပါ                                                             |
| `<link rel="preload" />`        | ReactDOM `preload` method ကို သုံးပါ                                                                                  |
| `<link rel="preconnect" />`     | ReactDOM `preconnect` method ကို သုံးပါ                                                                            |
| `<link rel="dns-prefetch" />`   | ReactDOM `prefetchDNS` method ကို သုံးပါ                                                                             |

#### Resource hints (preload/preconnect/dns-prefetch)

`<link>` element ရဲ့ `rel` keywords တွေကို သုံးပြီး — external resource တစ်ခု မကြာခင် လိုအပ်တော့မယ်ဆိုတာ browser ကို အချက်ပြနိုင်ပါတယ်။ Browser က keyword အလိုက် preloading optimizations တွေ သက်ရောက်ပါတယ်။ Metadata API က ဒီ hints တွေကို တိုက်ရိုက် မထောက်ပံ့ပေမယ့် — React ရဲ့ [ReactDOM methods](https://github.com/facebook/react/pull/26237) အသစ်တွေနဲ့ document ရဲ့ `<head>` ထဲကို လုံခြုံစွာ ထည့်နိုင်ပါတယ်။

```tsx
// app/preload-resources.tsx
'use client'

import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('...', { as: '...' })
  ReactDOM.preconnect('...', { crossOrigin: '...' })
  ReactDOM.prefetchDNS('...')

  return '...'
}
```

- **`<link rel="preload">`** — Page rendering (browser) lifecycle အစောပိုင်းမှာ resource တစ်ခုကို စောစော load စပါတယ်။ `ReactDOM.preload(href, { as })` က `<link rel="preload" href="..." as="..." />` ကို ထုတ်ပေးပါတယ်။ [MDN Docs](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/preload)
- **`<link rel="preconnect">`** — Origin တစ်ခုဆီ connection တစ်ခုကို ကြိုတင် စတင်ပါတယ်။ `ReactDOM.preconnect(href, options)` က `<link rel="preconnect" href="..." crossorigin />` ကို ထုတ်ပေးပါတယ်။ [MDN Docs](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/preconnect)
- **`<link rel="dns-prefetch">`** — Resources တွေ မတောင်းခင် domain name တစ်ခုကို ကြိုတင် resolve လုပ်ပါတယ်။ `ReactDOM.prefetchDNS(href)` က `<link rel="dns-prefetch" href="..." />` ကို ထုတ်ပေးပါတယ်။ [MDN Docs](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/dns-prefetch)

> **သိထားသင့်သည်:**
>
> - ဒီ methods တွေက လောလောဆယ် Client Components တွေမှာပဲ ထောက်ပံ့ပါတယ် — Client Components တွေက initial page load မှာ Server Side Render ဖြစ်နေဆဲပါ။
> - `next/font`, `next/image`, `next/script` လိုမျိုး Next.js ရဲ့ built-in features တွေက သက်ဆိုင်ရာ resource hints တွေကို အလိုအလျောက် ကိုင်တွယ်ပေးပါတယ်။

## Behavior (အပြုအမူများ)

### Default Fields

Route တစ်ခုက metadata မသတ်မှတ်ထားရင်တောင် — meta tags နှစ်ခုက အမြဲတမ်း ထည့်ပေးပါတယ်:

- [meta charset tag](https://developer.mozilla.org/docs/Web/HTML/Element/meta#attr-charset) — website ရဲ့ character encoding ကို သတ်မှတ်တာ။
- [meta viewport tag](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) — device အမျိုးမျိုးအတွက် viewport width နဲ့ scale ကို သတ်မှတ်တာ။

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

> **သိထားသင့်သည်:** Default [`viewport`](/docs/nextjs/generate-viewport) meta tag ကို သင်ကိုယ်တိုင် overwrite လုပ်နိုင်ပါတယ်။

<a id="streaming-metadata"></a>

### Streaming metadata

Streaming metadata က Next.js ကို `generateMetadata` ပြီးစီးဖို့ မစောင့်ဘဲ — initial UI ကို render လုပ်ပြီး browser ဆီ ပို့နိုင်စေပါတယ်။

`generateMetadata` resolve ဖြစ်တဲ့အခါ — ရလာတဲ့ metadata tags တွေကို `<body>` tag ရဲ့ အဆုံးမှာ ထပ်ထည့်ပါတယ်။ JavaScript execute လုပ်ပြီး full DOM ကို စစ်ဆေးတဲ့ bots တွေ (ဥပမာ `Googlebot`) က metadata ကို မှန်ကန်စွာ ဖတ်နိုင်တာ စစ်ဆေးပြီးပါပြီ။

JavaScript execute လုပ်လို့မရတဲ့ **HTML-limited bots** တွေ (ဥပမာ `facebookexternalhit`) အတွက်တော့ — metadata က page rendering ကို ဆက်ပြီး ပိတ်ဆို့ထားပြီး၊ ရလာတဲ့ metadata ကို `<head>` tag ထဲမှာ ရရှိမှာ ဖြစ်ပါတယ်။

Next.js က User Agent header ကို ကြည့်ပြီး **HTML-limited bots** တွေကို အလိုအလျောက် ရှာဖွေ သိရှိပါတယ်။ ပုံမှန် [User Agent list](https://github.com/vercel/next.js/blob/canary/packages/next/src/shared/lib/router/utils/html-bots.ts) ကို override လုပ်ချင်ရင် — သင့် Next.js config file ထဲမှာ [`htmlLimitedBots`](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots) option ကို သုံးနိုင်ပါတယ်။

Streaming metadata ကို လုံးဝ ပိတ်ပစ်ချင်ရင်:

```ts
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  htmlLimitedBots: /.*/,
}

export default config
```

Streaming metadata က [TTFB](https://developer.mozilla.org/docs/Glossary/Time_to_first_byte) ကို လျှော့ချပေးပြီး [LCP](https://developer.mozilla.org/docs/Glossary/Largest_contentful_paint) time ကိုပါ နိမ့်စေနိုင်လို့ — perceived performance (အသုံးပြုသူ ခံစားရတဲ့ မြန်ဆန်မှု) ကို ပိုကောင်းစေပါတယ်။ `htmlLimitedBots` ကို override လုပ်တာက response times ပိုရှည်စေနိုင်ပါတယ် — streaming metadata က advanced feature တစ်ခုဖြစ်ပြီး အများစုအတွက် default နဲ့တင် လုံလောက်ပါတယ်။

### Cache Components နဲ့ဆို

[Cache Components](https://nextjs.org/docs/app/getting-started/caching) enabled ဖြစ်နေရင် — `generateMetadata` က တခြား components တွေလိုပဲ တူညီတဲ့ စည်းမျဉ်းတွေကို လိုက်နာပါတယ်။ Metadata က runtime data (`cookies()`, `headers()`, `params`, `searchParams`) တွေကို ဝင်ရောက်နေရင် (သို့) uncached data fetching တွေ လုပ်နေရင် — request time အထိ ရွှေ့ဆိုင်းလိုက်ပါတယ်။

ကျန် page ရဲ့ အခြေအနေပေါ် မူတည်ပြီး Next.js က အောက်ပါအတိုင်း ကိုင်တွယ်ပါတယ်:

- **တခြား အစိတ်အပိုင်းတွေပါ request time ထိ ရွှေ့ဆိုင်းနေရင်:** Prerendering က static shell တစ်ခုကို ထုတ်ပေးပြီး — metadata က တခြား deferred content တွေနဲ့အတူ stream လုပ်ပါတယ်။
- **Page (သို့) layout က ကျန်တာတွေ လုံးဝ prerender လုပ်လို့ရနေရင်:** Next.js က ရှင်းလင်းတဲ့ ရွေးချယ်မှုတစ်ခု လိုပါတယ် — ဖြစ်နိုင်ရင် data ကို cache လုပ်ပါ၊ မဟုတ်ရင် deferred rendering က ရည်ရွယ်ချက်ရှိရှိ လုပ်တာဆိုတာ အချက်ပြပါ။

Page တစ်ခုလုံး prerender လုပ်လို့ရနေချိန်မှာ runtime မှာ metadata stream လုပ်တာက အဖြစ်များတာ မဟုတ်ပါဘူး။ ဒါကို ရည်ရွယ်ချက်ရှိရှိ လုပ်တာဖြစ်ကြောင်း သေချာစေဖို့ — ဘယ် page (သို့) layout ကို ကိုင်တွယ်ရမယ်ဆိုတာ ညွှန်ပြတဲ့ error တစ်ခု တက်ပါတယ်။ ဖြေရှင်းဖို့ option နှစ်ခု ရှိပါတယ်:

Metadata က external data ပေါ်မှာပဲ မူတည်ပြီး runtime data ပေါ် မမူတည်ဘူးဆိုရင် — `use cache` ကို သုံးပါ:

```tsx
// app/page.tsx
export async function generateMetadata() {
  'use cache'
  const { title, description } = await db.query('site-metadata')
  return { title, description }
}
```

Metadata က တကယ်ပဲ runtime data လိုအပ်နေရင်တော့ — သင့် page မှာ dynamic marker component တစ်ခု ထည့်ပါ။ `DynamicMarker` ဆိုတဲ့ component က ဘာမှ render မလုပ်ဘဲ — `<Suspense>` ထဲမှာ `await connection()` လုပ်ပြီး page မှာ ရည်ရွယ်ချက်ရှိတဲ့ dynamic content ရှိတယ်ဆိုတာ Next.js ကို အသိပေးပါတယ်။ ဒါကြောင့် static content တွေက ပုံမှန်အတိုင်း prerender ဖြစ်နေဆဲပါ။ အပြည့်အစုံ fix options နဲ့ trade-offs တွေအတွက် [Next.js encountered runtime data in `generateMetadata()`](https://nextjs.org/docs/messages/blocking-prerender-metadata-runtime) နဲ့ [Next.js encountered uncached data in `generateMetadata()`](https://nextjs.org/docs/messages/blocking-prerender-metadata-dynamic) တွေကို ကြည့်ပါ။

### Ordering (အစီအစဉ်)

Metadata ကို root segment ကနေ စပြီး နောက်ဆုံး `page.js` segment နဲ့ အနီးဆုံး segment အထိ — အစီအစဉ်တကျ အကဲဖြတ်ပါတယ်။ ဥပမာ:

1. `app/layout.tsx` (Root Layout)
2. `app/blog/layout.tsx` (Nested Blog Layout)
3. `app/blog/[slug]/page.tsx` (Blog Page)

### Merging (ပေါင်းစပ်ခြင်း)

အကဲဖြတ်တဲ့ အစီအစဉ်အတိုင်း — route တစ်ခုတည်းထဲက segments အများအပြားကနေ export လုပ်ထားတဲ့ Metadata objects တွေကို route ရဲ့ နောက်ဆုံး metadata output အဖြစ် **shallowly** ပေါင်းစပ်ပါတယ်။ Duplicate keys တွေကို အစီအစဉ်အလိုက် **အစားထိုး** ပါတယ်။

ဒါကြောင့် — [`openGraph`](#opengraph) နဲ့ [`robots`](#robots) လိုမျိုး nested fields ပါတဲ့ metadata တွေကို အစောပိုင်း segment တစ်ခုမှာ သတ်မှတ်ထားရင် — နောက်ဆုံး သတ်မှတ်တဲ့ segment က **overwrite** လုပ်လိုက်ပါတယ်။

#### Fields တွေ overwrite လုပ်ခြင်း

```jsx
// app/layout.js
export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}
```

```jsx
// app/blog/page.js
export const metadata = {
  title: 'Blog',
  openGraph: {
    title: 'Blog',
  },
}

// Output:
// <title>Blog</title>
// <meta property="og:title" content="Blog" />
```

အပေါ်က ဥပမာမှာ — `app/layout.js` ရဲ့ `title` ကို `app/blog/page.js` ရဲ့ `title` က **အစားထိုး** ပြီး၊ `app/blog/page.js` က `openGraph` metadata သတ်မှတ်လို့ `app/layout.js` ရဲ့ `openGraph` fields အားလုံးကိုပါ **အစားထိုး** သွားပါတယ် (သတိပြုပါ — `openGraph.description` မရှိတော့ပါဘူး)။

Segments တွေကြားမှာ nested fields အချို့ မျှဝေချင်ပြီး အချို့ overwrite ချင်ရင် — သူတို့ကို သီးခြား variable တစ်ခုထဲ ထုတ်ပြီး spread လုပ်နိုင်ပါတယ်:

```jsx
// app/shared-metadata.js
export const openGraphImage = { images: ['http://...'] }
```

```jsx
// app/page.js
import { openGraphImage } from './shared-metadata'

export const metadata = {
  openGraph: {
    ...openGraphImage,
    title: 'Home',
  },
}
```

ဒီနည်းနဲ့ — OG image ကို segments နှစ်ခုကြားမှာ မျှဝေပြီး titles တွေကတော့ မတူညီဘဲ ထားနိုင်ပါတယ်။

#### Fields တွေ အမွေဆက်ခံခြင်း

```jsx
// app/layout.js
export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}
```

```jsx
// app/about/page.js
export const metadata = {
  title: 'About',
}

// Output:
// <title>About</title>
// <meta property="og:title" content="Acme" />
// <meta property="og:description" content="Acme is a..." />
```

ဒီမှာ — `app/layout.js` ရဲ့ `title` ကို `app/about/page.js` ရဲ့ `title` က **အစားထိုး** ပြီး၊ `app/about/page.js` က `openGraph` metadata မသတ်မှတ်လို့ `app/layout.js` ရဲ့ `openGraph` fields အားလုံးကို **အမွေဆက်ခံ** လိုက်ပါတယ်။

## Version History

| Version   | အပြောင်းအလဲ                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `v15.2.0` | `generateMetadata` အတွက် streaming support စတင် မိတ်ဆက်                                                        |
| `v14.0.0` | `viewport`, `themeColor`, `colorScheme` တွေကို [`viewport` configuration](/docs/nextjs/generate-viewport) အစားထိုးဖို့ deprecated လုပ် |
| `v13.2.0` | `metadata` နဲ့ `generateMetadata` စတင် မိတ်ဆက်                                                                    |
