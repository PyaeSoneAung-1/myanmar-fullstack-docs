---
title: "Image Optimization (Images)"
description: "next/image ရဲ့ Image component သုံးပြီး images တွေကို optimize လုပ်ခြင်း — local/remote images, width/height, fill, sizes, quality, preload/priority, remotePatterns configuration နဲ့ WebP/AVIF အကြောင်း"
order: 20
source: "https://nextjs.org/docs/app/getting-started/images"
status: translated
updated: 2026-09-02
---

Next.js ရဲ့ [`<Image>`](https://nextjs.org/docs/app/api-reference/components/image) component က HTML ရဲ့ `<img>` element ကို ချဲ့ထွင်ထားပြီး အောက်ပါ အကျိုးကျေးဇူးတွေ ပေးပါတယ်:

- **Size optimization (အရွယ်အစား ပိုမိုကောင်းမွန်အောင်)** — device တစ်ခုချင်းစီအတွက် သင့်တော်တဲ့ အရွယ်အစား images တွေကို WebP လို ခေတ်မီ image formats တွေနဲ့ အလိုအလျောက် ပံ့ပိုးပေးပါတယ်။
- **Visual stability** — images တွေ loading ဖြစ်နေချိန်မှာ [layout shift](https://web.dev/articles/cls) မဖြစ်အောင် အလိုအလျောက် ကာကွယ်ပေးပါတယ်။
- **Faster page loads** — browser ရဲ့ native lazy loading ကို သုံးပြီး image က viewport ထဲ ဝင်လာမှသာ load လုပ်ပြီး — optional blur-up placeholders တွေလည်း ပံ့ပိုးပေးပါတယ်။
- **Asset flexibility** — remote servers တွေပေါ်က images တွေအပါအဝင် images တွေကို on-demand ပြန်လည် အရွယ်ပြောင်းပေးနိုင်ပါတယ်။

`<Image>` ကို စသုံးဖို့ — `next/image` ကနေ import လုပ်ပြီး component ထဲမှာ render လုပ်ရုံပါပဲ:

```tsx
import Image from 'next/image'

export default function Page() {
  return <Image src="" alt="" />
}
```

`src` property က local image (project ထဲက ပုံ) (သို့) remote image (ပြင်ပ URL က ပုံ) ဖြစ်နိုင်ပါတယ် — အောက်မှာ အသေးစိတ် ကြည့်ပါမယ်။ ဒါ့အပြင် `alt` property က **required** ဖြစ်ပြီး — screen readers နဲ့ search engines တွေအတွက် image ကို ဖော်ပြဖို့ သုံးပါတယ်။

## Local Images (Local ပုံများ)

Static files တွေ (images, fonts စသည်) ကို project root ထဲက `public` folder အောက်မှာ သိမ်းနိုင်ပြီး — base URL (`/`) ကစပြီး code ထဲကနေ ညွှန်းနိုင်ပါတယ်:

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

Image ကို **statically import** လုပ်ရင် Next.js က image ရဲ့ မူရင်း (intrinsic) [`width`](https://nextjs.org/docs/app/api-reference/components/image#width-and-height) နဲ့ [`height`](https://nextjs.org/docs/app/api-reference/components/image#width-and-height) တွေကို အလိုအလျောက် သိပါတယ် — ဒီတန်ဖိုးတွေက image ratio ကို တွက်ပြီး image loading အတွင်း [Cumulative Layout Shift](https://web.dev/articles/cls) မဖြစ်အောင် ကာကွယ်ပေးပါတယ်:

```tsx
import Image from 'next/image'
import ProfileImage from './profile.png'

export default function Page() {
  return (
    <Image
      src={ProfileImage}
      alt="Picture of the author"
      // width={500} automatically provided
      // height={500} automatically provided
      // blurDataURL="data:..." automatically provided
      // placeholder="blur" // Optional blur-up while loading
    />
  )
}
```

Static `import` သုံးလို့ မရတဲ့ အခြေအနေမှာဆိုရင် — Server Component ထဲမှာ dynamic `import()` သုံးပြီး `width`, `height`, `blurDataURL` တွေကို အလိုအလျောက် ရယူနိုင်ပါတယ်:

```tsx
import Image from 'next/image'

async function PostImage({
  imageFilename,
  alt,
}: {
  imageFilename: string
  alt: string
}) {
  const { default: image } = await import(
    `../content/blog/images/${imageFilename}`
  )
  // image contains width, height, and blurDataURL
  return <Image src={image} alt={alt} />
}
```

ဒီလိုနေရာမှာ path ကို တတ်နိုင်သမျှ **တိတိကျကျ** သတ်မှတ်ပေးဖို့ အရေးကြီးပါတယ် — ဘာလို့လဲဆိုတော့ အဲဒီ prefix နဲ့ ကိုက်ညီတဲ့ **files အားလုံး**ကို bundle လုပ်လို့ပါ။ သတ်မှတ်ထားတဲ့ directory ထဲက files တွေပဲ ပါဝင်တာမို့ external input တွေက အပြင်ကို ထွက်သွားလို့ မရပါဘူး။

[Path alias](https://www.typescriptlang.org/tsconfig/#paths) (ဥပမာ `@/`) configure လုပ်ထားရင် relative path အစား alias ကိုလည်း သုံးနိုင်ပါတယ်:

```tsx
const { default: image } = await import(
  `@/content/blog/images/${imageFilename}`
)
```

## Remote Images (Remote ပုံများ)

Remote image သုံးဖို့ — `src` property အတွက် URL string တစ်ခု ပေးရပါတယ်:

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://s3.amazonaws.com/my-bucket/profile.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

Build လုပ်ချိန်မှာ Next.js က remote files တွေဆီ ဝင်ရောက်ခွင့် မရှိလို့ — [`width`](https://nextjs.org/docs/app/api-reference/components/image#width-and-height), [`height`](https://nextjs.org/docs/app/api-reference/components/image#width-and-height) နဲ့ optional [`blurDataURL`](https://nextjs.org/docs/app/api-reference/components/image#blurdataurl) တွေကို ကိုယ်တိုင် ပေးရပါတယ်။ `width`/`height` တွေက image ရဲ့ aspect ratio ကို မှန်ကန်စွာ ခန့်မှန်းပြီး layout shift ရှောင်ဖို့ သုံးတာပါ။ တခြားနည်းကတော့ — image ကို parent element ရဲ့ အရွယ်အစားအတိုင်း ဖြည့်ပေးမယ့် [`fill`](#fill-property) property ကို သုံးတာပါ။

Remote servers တွေကနေ images တွေကို လုံခြုံစွာ ခွင့်ပြုဖို့ — `next.config.js` ထဲမှာ ခွင့်ပြုထားတဲ့ URL patterns စာရင်း သတ်မှတ်ပေးရပါတယ်။ Malicious usage တွေ မဖြစ်အောင် တတ်နိုင်သမျှ **တိကျအောင်** သတ်မှတ်ပါ — ဥပမာ အောက်ပါ configuration က AWS S3 bucket တစ်ခုတည်းကနေပဲ images တွေကို ခွင့်ပြုပါတယ်:

```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
}

export default config
```

`remotePatterns` ထဲမှာ `*` က path segment (သို့) subdomain တစ်ခုကို ကိုက်ညီပြီး `**` က နောက်ဆုံးမှာ ရှိတဲ့ path segments အများအပြား (သို့) အစမှာ ရှိတဲ့ subdomains တွေကို ကိုက်ညီပါတယ် (ဥပမာ `hostname: '**.example.com'` ဆိုရင် `image.example.com` လို subdomains တွေ ခွင့်ပြုပါတယ်)။ `search` property နဲ့ query strings တွေကိုလည်း တိကျစွာ ကန့်သတ်နိုင်ပြီး — ခွင့်ပြုချက် မရှိတဲ့ protocol, hostname, port (သို့) path တွေအတွက် `400` Bad Request ပြန်ပါတယ်။ သတိပြုရမှာက `protocol`, `port`, `pathname` (သို့) `search` တွေကို ချန်လိုက်ရင် `**` wildcard သွားသဘောမျိုး ဖြစ်ပြီး — မရည်ရွယ်တဲ့ urls တွေကို optimize လုပ်ခွင့် ဖြစ်သွားနိုင်လို့ အကြံမပြုပါဘူး။

## Image Sizing (width/height)

`width` နဲ့ `height` properties တွေက image ရဲ့ [intrinsic](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size) size (pixel နဲ့) ကို ကိုယ်စားပြုပြီး — browser တွေ loading အတွင်း layout shift မဖြစ်အောင် နေရာ ကြိုတင် သိမ်းထားနိုင်ဖို့ မှန်ကန်တဲ့ **aspect ratio** ကို ခန့်မှန်းဖို့ သုံးပါတယ်။ ဒါက image ရဲ့ *rendered size* ကို မသတ်မှတ်ပါဘူး — rendered size ကို CSS က ထိန်းချုပ်ပါတယ်။

အောက်ပါကိစ္စတွေကလွဲရင် `width` နဲ့ `height` **နှစ်ခုလုံး ထည့်ပေးရပါမယ်**:

- Image ကို statically import လုပ်ထားရင်
- Image မှာ [`fill` property](#fill-property) ရှိရင်

Height/width တွေ မသိဘူးဆိုရင် `fill` property ကို သုံးဖို့ အကြံပြုပါတယ်။

`style` prop နဲ့ image ကို CSS styles တွေ ထည့်နိုင်ပါတယ် — ဥပမာ `borderRadius: '50%'` နဲ့ avatar ပုံစံ လုပ်တာမျိုးပါ။ ဒီလိုနေရာမှာ `style` prop နဲ့ custom width သတ်မှတ်နေရင် — image ရဲ့ aspect ratio မပျက်အောင် `height: 'auto'` ကိုပါ တွဲထည့်ပေးဖို့ သတိပြုပါ။

Rendered size ကို CSS က ထိန်းချုပ်တာမို့ — မတူညီတဲ့ breakpoints တွေမှာ image ကို ဘယ်လောက် ကျယ်ပြန့်စွာ ပြချင်လဲဆိုတာကို CSS (media queries, `objectFit` စသည်) နဲ့ သတ်မှတ်နိုင်ပါတယ်။ Image loading လုပ်နေစဉ်အတွင်း layout မဆိုင်းစေဖို့ Next.js က `width`/`height` (သို့) `fill` ကနေ ရတဲ့ aspect ratio ကို သုံးပြီး — browser မှာ နေရာ ကြိုတင် သိမ်းထားပေးတာကို မှတ်ထားပါ။

## Fill Property

`fill` က boolean တစ်ခုဖြစ်ပြီး — image ကို **parent element ရဲ့ အရွယ်အစားအတိုင်း** ချဲ့ဖို့ ပြောတာပါ:

```jsx
<Image src="/profile.png" fill={true} />
```

`fill` သုံးတဲ့အခါ သတိထားရမှာတွေက:

- Parent element မှာ `position: "relative"`, `"fixed"` (သို့) `"absolute"` **သတ်မှတ်ပေးရပါမယ်** — default အနေနဲ့ `<img>` က `position: "absolute"` ဖြစ်နေလို့ပါ။
- Styles တွေ မထည့်ရင် image က container ပြည့်အောင် ဆန့်သွားပါတယ် — `objectFit` နဲ့ ထိန်းချုပ်နိုင်ပါတယ်: `"contain"` က aspect ratio ထိန်းပြီး container ထဲ အံဝင်အောင် ချုံ့ပေးပြီး `"cover"` က container ပြည့်အောင် ဖြည့်ပြီး ပိုနေတဲ့ အစွန်းတွေကို ဖြတ်ပေးပါတယ်။

## Responsive Images (sizes property)

CSS နဲ့ responsive လုပ်ထားတဲ့ images တွေအတွက် — `sizes` property နဲ့ breakpoints အလိုက် image အရွယ်အစားတွေကို သတ်မှတ်ပေးနိုင်ပါတယ်။ Browser က ဒီတန်ဖိုးကို သုံးပြီး generated `srcset` ထဲကနေ အကောင်းဆုံး အရွယ်အစားကို ရွေးချယ်ပါတယ်:

```tsx
import Image from 'next/image'

export default function Page() {
  return (
    <div className="grid-element">
      <Image
        fill
        src="/example.png"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

`sizes` ကို image မှာ `fill` prop သုံးထားရင် (သို့) CSS နဲ့ responsive လုပ်ထားရင် ထည့်သင့်ပါတယ်။ `sizes` မပါရင် browser က image ကို viewport လောက် ကျယ်မယ်လို့ (`100vw`) ယူဆပြီး — မလိုအပ်တဲ့ ကြီးမားတဲ့ images တွေ download ဖြစ်သွားနိုင်ပါတယ်။ `sizes` က `srcset` ထုတ်လုပ်ပုံကိုလည်း ပြောင်းလဲပေးပါတယ်: `sizes` မပါရင် fixed-size images တွေအတွက် သင့်တော်တဲ့ limited `srcset` (ဥပမာ 1x, 2x) ထုတ်ပြီး — `sizes` ပါရင် responsive layouts တွေအတွက် full `srcset` (ဥပမာ 640w, 750w, ...) ထုတ်ပေးပါတယ်။

## Quality (အရည်အသွေး)

`quality` က `1` ကနေ `100` ကြားက integer ဖြစ်ပြီး optimized image ရဲ့ အရည်အသွေးကို သတ်မှတ်ပါတယ် — default က `75` ပါ။ တန်ဖိုးမြင့်လေ file size နဲ့ visual fidelity မြင့်လေဖြစ်ပြီး — တန်ဖိုးနိမ့်ရင် file size ကျပေမယ့် ပြတ်သားမှု ထိခိုက်နိုင်ပါတယ်:

```tsx
// Default quality is 75
<Image quality={75} />
```

မူရင်း image က အရည်အသွေး နိမ့်ပြီးသားဆိုရင် quality မြှင့်လိုက်ရုံနဲ့ file size ပဲ တက်ပြီး ပုံပန်း တိုးတက်မလာတာကို သတိပြုပါ။

## Placeholder (Loading ကာလ နေရာထားပုံ)

`placeholder` prop က image loading ဖြစ်နေချိန်မှာ ဘာပြမလဲ သတ်မှတ်ပေးပြီး — perceived loading performance ကို ပိုကောင်းစေပါတယ်:

- `"empty"` — placeholder မရှိ (default)
- `"blur"` — image ရဲ့ မှုန်ဝါးနေတဲ့ version ကို placeholder အဖြစ် သုံး — [`blurDataURL`](https://nextjs.org/docs/app/api-reference/components/image#blurdataurl) property နဲ့ တွဲသုံးရပါတယ်
- `data:image/...` — [Data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) တစ်ခုကို placeholder အဖြစ် သုံး (shimmer/color effect တွေအတွက် သုံးလေ့ ရှိ)

Statically imported image တွေအတွက် `blurDataURL` ကို Next.js က အလိုအလျောက် ဖြည့်ပေးတာမို့ `placeholder="blur"` ကို တိုက်ရိုက် သုံးလို့ရပြီး — remote images တွေအတွက်တော့ `blurDataURL` ကို ကိုယ်တိုင် ပေးရပါတယ်။

## Preload နဲ့ Priority

Image က [Largest Contentful Paint (LCP)](https://nextjs.org/learn/seo/web-performance/lcp) element (အထက်ဆုံး above-the-fold မြင်ရတဲ့ image, ဥပမာ hero image) ဖြစ်နေရင် မြန်မြန် load ဖြစ်အောင် preload လုပ်ချင်ပါလိမ့်မယ်။ Next.js 16 မှာ — အပြုအမူကို ရှင်းရှင်းလင်းလင်း ဖြစ်စေဖို့ `priority` property ကို **deprecated** လုပ်ပြီး [`preload`](https://nextjs.org/docs/app/api-reference/components/image#preload) property ကို သုံးစေပါတယ်။ `preload={true}` ဆိုရင် image ကို `<head>` ထဲမှာ `<link>` ထည့်ပြီး preload လုပ်ပေးပြီး — default ကတော့ `false` ပါ။

အများစုမှာတော့ `preload` အစား `loading="eager"` (သို့) `fetchPriority="high"` ကို သုံးဖို့ အကြံပြုထားပါတယ် — `loading` prop က image ကို ဘယ်အချိန် စ load မလဲ ထိန်းချုပ်ပြီး default က `lazy` (viewport အနားကို ရောက်မှ load)၊ `eager` က page ထဲမှာ ဘယ်နေရာမှာပဲ ရှိရှိ ချက်ချင်း load လုပ်ပါတယ်။

## Configuration — Formats (WebP/AVIF)

Next.js က request ရဲ့ `Accept` header ကနေ browser ရဲ့ ပံ့ပိုးမှု ရှိတဲ့ image formats တွေကို အလိုအလျောက် စစ်ဆေးပြီး အကောင်းဆုံး output format ကို ရွေးပေးပါတယ်။ `formats` configuration နဲ့ ခွင့်ပြုမယ့် formats စာရင်း သတ်မှတ်နိုင်ပါတယ်:

```js
module.exports = {
  images: {
    // Default
    formats: ['image/webp'],
  },
}
```

**WebP က default** ဖြစ်ပြီး အသုံးအများဆုံး ကိစ္စတွေအတွက် WebP ကိုပဲ သုံးဖို့ အကြံပြုပါတယ်။ Browser က [AVIF](https://caniuse.com/avif) ပံ့ပိုးရင် ပိုကောင်းတဲ့ compression ရဖို့ AVIF ကိုလည်း ထည့်နိုင်ပါတယ်:

```js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

ဒီလိုဆိုရင် AVIF ပံ့ပိုးတဲ့ browsers တွေအတွက် AVIF ကို ဦးစားပေးပြီး — မပံ့ပိုးတဲ့ဟာတွေအတွက် WebP ကို fallback အဖြစ် သုံးပါတယ်။ သတိပြုစရာတွေက:

- AVIF က WebP ထက် **20% လောက် ပိုကျုံ့** နိုင်ပေမယ့် encode လုပ်ရတာ **50% လောက် ပိုကြာပါတယ်** — ဆိုလိုတာက ပထမဆုံး request က ပိုနှေးပေမယ့် နောက်ပိုင်း cached requests တွေက ပိုမြန်ပါတယ်။
- Formats အများအပြား သုံးရင် format တစ်ခုစီကို သီးခြား cache လုပ်လို့ storage ပိုလိုအပ်ပါတယ်။
- Next.js ရှေ့မှာ Proxy/CDN နဲ့ self-host လုပ်ရင် — Proxy က `Accept` header ကို forward လုပ်ဖို့ configure လုပ်ပေးရပါမယ်။
- `Accept` header နဲ့ ဘယ် format မှ မကိုက်ညီရင် (သို့) မူရင်း image က animated ဆိုရင် — မူရင်း format အတိုင်းပဲ သုံးပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Fonts](/docs/nextjs/fonts) — font optimization (next/font)
- [CSS](/docs/nextjs/css) — ပုံစံချမှု (styling) အခြေခံများ
- [Image Component API Reference](https://nextjs.org/docs/app/api-reference/components/image) — props နဲ့ configuration options အားလုံး
