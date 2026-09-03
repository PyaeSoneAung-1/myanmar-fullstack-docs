---
title: "Metadata နဲ့ OG Images (Metadata and Open Graph images)"
description: "Metadata APIs တွေသုံးပြီး SEO နဲ့ web shareability အတွက် page metadata တွေ နဲ့ dynamic OG images တွေ ထည့်သွင်းနည်း — static metadata, generateMetadata, streaming metadata, file-based metadata (favicons, OG images) နဲ့ ImageResponse"
order: 245
source: "https://nextjs.org/docs/app/getting-started/metadata-and-og-images"
status: translated
updated: 2026-09-03
---

Metadata APIs တွေကို သုံးပြီး သင့် application ရဲ့ metadata တွေကို — SEO နဲ့ web shareability (လူမှုကွန်ရက်ပေါ်မှာ မျှဝေလို့ရလွယ်ခြင်း) ပိုကောင်းအောင် သတ်မှတ်နိုင်ပြီး — အောက်ပါတို့ ပါဝင်ပါတယ်:

1. Static `metadata` object
2. Dynamic `generateMetadata` function
3. Favicons (သို့) OG images တွေလို static (သို့) dynamic ဖြစ်တဲ့ ဖိုင်တွေကို ထည့်သွင်းဖို့ သုံးလို့ရတဲ့ special [file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)

အပေါ်က option တွေ အားလုံးနဲ့ဆို — Next.js က သင့် page အတွက် သက်ဆိုင်ရာ `<head>` tags တွေကို အလိုအလျောက် generate လုပ်ပေးပြီး — browser ရဲ့ developer tools ထဲမှာ စစ်ဆေးကြည့်လို့ ရပါတယ်။

`metadata` object နဲ့ `generateMetadata` function exports တွေက Server Components တွေမှာပဲ ထောက်ပံ့ပါတယ်။

## Default fields (မူရင်း fields)

Route တစ်ခုက metadata မသတ်မှတ်ထားရင်တောင် — meta tags နှစ်ခုက အမြဲတမ်း ထည့်သွင်းပေးပါတယ်:

- [meta charset tag](https://developer.mozilla.org/docs/Web/HTML/Element/meta#attr-charset) က website ရဲ့ character encoding ကို သတ်မှတ်ပေးပါတယ်။
- [meta viewport tag](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) က website ရဲ့ viewport width နဲ့ scale ကို သတ်မှတ်ပေးပြီး — စက်ပစ္စည်း အမျိုးမျိုးနဲ့ လိုက်လျောညီထွေ ဖြစ်စေပါတယ်။

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

ကျန်တဲ့ metadata fields တွေကိုတော့ `Metadata` object (static metadata အတွက်) (သို့) `generateMetadata` function (generated metadata အတွက်) နဲ့ သတ်မှတ်နိုင်ပါတယ်။

## Static metadata (ပုံသေ metadata)

Static metadata သတ်မှတ်ဖို့ — static ဖြစ်တဲ့ [`layout.js`](/docs/nextjs/file-conventions-layout) (သို့) [`page.js`](/docs/nextjs/file-conventions-page) file တစ်ခုကနေ [`Metadata` object](/docs/nextjs/generate-metadata) ကို export လုပ်ပါ။ ဥပမာ — blog route ဆီ title နဲ့ description ထည့်ဖို့:

```tsx filename="app/blog/layout.tsx" switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: '...',
}

export default function Layout() {}
```

```jsx filename="app/blog/layout.js" switcher
export const metadata = {
  title: 'My Blog',
  description: '...',
}

export default function Layout() {}
```

ရနိုင်တဲ့ option တွေ စာရင်းအပြည့်အစုံကို [`generateMetadata` documentation](/docs/nextjs/generate-metadata) မှာ ကြည့်နိုင်ပါတယ်။

## Generated metadata (ဒေတာပေါ်မူတည်၍ ထုတ်ပေးသော metadata)

[`generateMetadata`](/docs/nextjs/generate-metadata) function ကို သုံးပြီး — data ပေါ် မူတည်တဲ့ metadata တွေကို `fetch` လုပ်နိုင်ပါတယ်။ ဥပမာ — blog post တစ်ပုဒ်ချင်းစီအတွက် title နဲ့ description ကို fetch လုပ်ဖို့:

```tsx filename="app/blog/[slug]/page.tsx" switcher
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug

  // post အချက်အလက်တွေကို fetch လုပ်ပါ
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  )

  return {
    title: post.title,
    description: post.description,
  }
}

export default function Page({ params, searchParams }: Props) {}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export async function generateMetadata({ params, searchParams }, parent) {
  const slug = (await params).slug

  // post အချက်အလက်တွေကို fetch လုပ်ပါ
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  )

  return {
    title: post.title,
    description: post.description,
  }
}

export default function Page({ params, searchParams }) {}
```

### Streaming metadata

Dynamically render လုပ်တဲ့ pages တွေအတွက် — Next.js က metadata ကို သပ်သပ်စီ stream လုပ်ပြီး — `generateMetadata` ပြီးမြောက်တာနဲ့ UI rendering ကို မပိတ်ဆို့ဘဲ HTML ထဲ inject လုပ်ပါတယ်။

Streaming metadata က visual content တွေကို အရင်ဆုံး stream လုပ်လို့ — perceived performance (အသုံးပြုသူ ခံစားရတဲ့ မြန်ဆန်မှု) ကို ပိုကောင်းစေပါတယ်။

Streaming metadata က metadata ကို `<head>` tag ထဲမှာ ရှိမယ်လို့ မျှော်လင့်တဲ့ bots နဲ့ crawlers တွေ (ဥပမာ `Twitterbot`, `Slackbot`, `Bingbot`) အတွက်တော့ **disable** ထားပါတယ်။ ဒါတွေကို incoming request ရဲ့ User Agent header ကိုကြည့်ပြီး ရှာဖွေ သိရှိပါတယ်။

Streaming metadata ကို သင့် Next.js config file ထဲက [`htmlLimitedBots`](https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots) option နဲ့ customize (သို့) လုံးဝ **disable** လုပ်နိုင်ပါတယ်။

Prerender လုပ်ထားတဲ့ pages တွေက — metadata ကို build time မှာ ဖြေရှင်းပြီးသားမို့ — streaming ကို မသုံးပါဘူး။

[Streaming metadata](/docs/nextjs/generate-metadata) အကြောင်း ပိုလေ့လာပါ။

### Data requests တွေကို memoize လုပ်ခြင်း (Memoizing data requests)

Metadata ရော page ကိုယ်တိုင်ရော — data တစ်ခုတည်းကို fetch လုပ်ဖို့ လိုအပ်တဲ့ အခြေအနေတွေ ရှိနိုင်ပါတယ်။ Request နှစ်ခါ မဖြစ်အောင် — React ရဲ့ [`cache` function](https://react.dev/reference/react/cache) ကို သုံးပြီး return value ကို memoize လုပ်ကာ — data ကို တစ်ကြိမ်ပဲ fetch လုပ်နိုင်ပါတယ်။ ဥပမာ — metadata ရော page ရောအတွက် blog post အချက်အလက်တွေကို fetch လုပ်ဖို့:

```ts filename="app/lib/data.ts" highlight={5} switcher
import { cache } from 'react'
import { db } from '@/app/lib/db'

// getPost ကို နှစ်ကြိမ် သုံးမယ်ဆိုပေမယ့် — တစ်ကြိမ်ပဲ run ပါမယ်
export const getPost = cache(async (slug: string) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  return res
})
```

```js filename="app/lib/data.js" highlight={5} switcher
import { cache } from 'react'
import { db } from '@/app/lib/db'

// getPost ကို နှစ်ကြိမ် သုံးမယ်ဆိုပေမယ့် — တစ်ကြိမ်ပဲ run ပါမယ်
export const getPost = cache(async (slug) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  return res
})
```

```tsx filename="app/blog/[slug]/page.tsx" switcher
import { getPost } from '@/app/lib/data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: post.title,
    description: post.description,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  return <div>{post.title}</div>
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
import { getPost } from '@/app/lib/data'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: post.title,
    description: post.description,
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  return <div>{post.title}</div>
}
```

## File-based metadata (file ပုံစံဖြင့် metadata)

Metadata အတွက် အောက်ပါ special files တွေကို ရနိုင်ပါတယ်:

- [favicon.ico, apple-icon.jpg, နဲ့ icon.jpg](/docs/nextjs/app-icons)
- [opengraph-image.jpg နဲ့ twitter-image.jpg](/docs/nextjs/opengraph-image)
- [robots.txt](/docs/nextjs/robots)
- [sitemap.xml](/docs/nextjs/sitemap)

ဒါတွေကို static metadata အဖြစ် သုံးနိုင်သလို — code နဲ့ programmatically လည်း generate လုပ်နိုင်ပါတယ်။

## Favicons

Favicons ဆိုတာ — bookmarks နဲ့ search results တွေထဲမှာ သင့် site ကို ကိုယ်စားပြုတဲ့ အိုင်ကွန် အသေးစားလေးတွေပါ။ သင့် application ထဲ favicon ထည့်ဖို့ — `favicon.ico` ကို ဖန်တီးပြီး app folder ရဲ့ အမြစ် (root) မှာ ထည့်ပါ။

> Favicons တွေကို code သုံးပြီး programmatically လည်း ထုတ်လုပ်နိုင်ပါတယ်။ အသေးစိတ်အတွက် [favicon docs](/docs/nextjs/app-icons) ကို ကြည့်ပါ။

## Static Open Graph images (ပုံသေ OG images)

Open Graph (OG) images ဆိုတာ — လူမှုကွန်ရက်တွေပေါ်မှာ သင့် site ကို ကိုယ်စားပြုတဲ့ ပုံတွေပါ။ Static OG image တစ်ခု ထည့်ဖို့ — `opengraph-image.jpg` file တစ်ခုကို app folder ရဲ့ အမြစ်မှာ ဖန်တီးပါ။

Route တစ်ခုချင်းစီအတွက် သီးသန့် OG images တွေကိုလည်း — folder တည်ဆောက်ပုံထဲ ပိုနက်တဲ့နေရာမှာ `opengraph-image.jpg` ဖန်တီးပြီး ထည့်နိုင်ပါတယ်။ ဥပမာ — `/blog` route အတွက် သီးသန့် OG image တစ်ခု ဖန်တီးဖို့ `blog` folder ထဲမှာ `opengraph-image.jpg` file တစ်ခု ထည့်ပါ။

Folder တည်ဆောက်ပုံထဲက အပေါ်ပိုင်းက OG images တွေထက် — ပိုတိကျတဲ့ (specific) image က ဦးစားပေး အသုံးပြုပါတယ်။

> `jpeg`, `png`, `gif` စတဲ့ တခြား image formats တွေကိုလည်း ထောက်ပံ့ပါတယ်။ အသေးစိတ်အတွက် [Open Graph Image docs](/docs/nextjs/opengraph-image) ကို ကြည့်ပါ။

## Generated Open Graph images (ဒေတာပေါ်မူတည်၍ ထုတ်လုပ်သော OG images)

[`ImageResponse` constructor](/docs/nextjs/image-response) က JSX နဲ့ CSS သုံးပြီး dynamic images တွေကို ထုတ်လုပ်နိုင်စေပါတယ်။ Data ပေါ် မူတည်တဲ့ OG images တွေအတွက် အသုံးဝင်ပါတယ်။

ဥပမာ — blog post တစ်ပုဒ်ချင်းစီအတွက် သီးသန့် OG image တစ်ခု ထုတ်လုပ်ဖို့ — `blog/[slug]` folder ထဲမှာ `opengraph-image.tsx` file တစ်ခု ထည့်ပြီး — `next/og` ကနေ `ImageResponse` constructor ကို import လုပ်ပါ:

```tsx filename="app/blog/[slug]/opengraph-image.tsx" switcher
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'

// Image ရဲ့ metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image ထုတ်လုပ်ခြင်း
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(
    (
      // ImageResponse ရဲ့ JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    )
  )
}
```

```jsx filename="app/blog/[slug]/opengraph-image.js" switcher
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'

// Image ရဲ့ metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image ထုတ်လုပ်ခြင်း
export default async function Image({ params }) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(
    (
      // ImageResponse ရဲ့ JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    )
  )
}
```

`ImageResponse` က flexbox နဲ့ absolute positioning, custom fonts, text wrapping, centering, nested images အပါအဝင် — သာမန် CSS properties တွေကို ထောက်ပံ့ပါတယ်။ [ထောက်ပံ့တဲ့ CSS properties တွေရဲ့ စာရင်းအပြည့်အစုံကို ကြည့်ပါ](/docs/nextjs/image-response)။

> **သိထားသင့်သည်:**
>
> - ဥပမာတွေကို [Vercel OG Playground](https://og-playground.vercel.app/) မှာ ကြည့်နိုင်ပါတယ်။
> - `ImageResponse` က [`@vercel/og`](https://vercel.com/docs/og-image-generation), [`satori`](https://github.com/vercel/satori), နဲ့ `resvg` တွေကို သုံးပြီး HTML နဲ့ CSS တွေကို PNG အဖြစ် ပြောင်းပေးပါတယ်။
> - Flexbox နဲ့ CSS properties ရဲ့ အစိတ်အပိုင်း (subset) တစ်ခုကိုပဲ ထောက်ပံ့ပါတယ်။ ပိုရှုပ်ထွေးတဲ့ layouts တွေ (ဥပမာ `display: grid`) က အလုပ်မလုပ်ပါဘူး။
