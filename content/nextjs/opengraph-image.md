---
title: "opengraph-image နှင့် twitter-image (social sharing images)"
description: "opengraph-image/twitter-image file conventions — route segment တစ်ခုအတွက် Open Graph နဲ့ Twitter images တွေ image files (.jpg/.png/.gif) ဒါမှမဟုတ် code (.js/.ts/.tsx) နဲ့ သတ်မှတ်နည်း"
order: 48
source: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image"
status: translated
updated: 2026-09-02
---

`opengraph-image` နဲ့ `twitter-image` file conventions တွေက route segment တစ်ခုအတွက် Open Graph နဲ့ Twitter images တွေ သတ်မှတ်နိုင်စေပါတယ်။

User တစ်ယောက်က သင့် site ရဲ့ link တစ်ခုကို မျှဝေလိုက်တဲ့အခါ — social networks တွေနဲ့ messaging apps တွေပေါ်မှာ ပေါ်လာမယ့် images တွေကို သတ်မှတ်ဖို့ အသုံးဝင်ပါတယ်။

Open Graph နဲ့ Twitter images တွေ သတ်မှတ်ဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:

- **Image files (.jpg, .png, .gif) သုံးခြင်း**
- **Code (.js, .ts, .tsx) သုံးပြီး images generate လုပ်ခြင်း**

## Image files (.jpg, .png, .gif)

Segment တစ်ခုရဲ့ shared image ကို သတ်မှတ်ဖို့ — `opengraph-image` (သို့) `twitter-image` image file ကို အဲဒီ segment ထဲမှာ ထားပါ။ Next.js က file ကို အကဲဖြတ်ပြီး သင့် app ရဲ့ `<head>` element ထဲကို သင့်တော်တဲ့ tags တွေ အလိုအလျောက် ထည့်ပေးပါတယ်။

| File convention                   | Supported file types            |
| --------------------------------- | ------------------------------- |
| `opengraph-image`                 | `.jpg`, `.jpeg`, `.png`, `.gif` |
| `twitter-image`                   | `.jpg`, `.jpeg`, `.png`, `.gif` |
| `opengraph-image.alt`             | `.txt`                          |
| `twitter-image.alt`               | `.txt`                          |

> **သိထားသင့်သည်:**
>
> `twitter-image` file ရဲ့ size က [5MB](https://developer.x.com/en/docs/x-for-websites/cards/overview/summary) ထက် မကျော်ရပါဘူး၊ `opengraph-image` ကတော့ [8MB](https://developers.facebook.com/docs/sharing/webmasters/images) ထက် မကျော်ရပါဘူး။ ဒီကန့်သတ်ချက်တွေ ကျော်ရင် build က fail ဖြစ်ပါလိမ့်မယ်။

### `opengraph-image`

ဘယ် route segment မဆို `opengraph-image.(jpg|jpeg|png|gif)` image file တစ်ခု ထည့်ပါ။

```html
<!-- <head> output -->
<meta property="og:image" content="<generated>" />
<meta property="og:image:type" content="<generated>" />
<meta property="og:image:width" content="<generated>" />
<meta property="og:image:height" content="<generated>" />
```

### `twitter-image`

ဘယ် route segment မဆို `twitter-image.(jpg|jpeg|png|gif)` image file တစ်ခု ထည့်ပါ။

```html
<!-- <head> output -->
<meta name="twitter:image" content="<generated>" />
<meta name="twitter:image:type" content="<generated>" />
<meta name="twitter:image:width" content="<generated>" />
<meta name="twitter:image:height" content="<generated>" />
```

### `opengraph-image.alt.txt`

`opengraph-image.(jpg|jpeg|png|gif)` image ရှိတဲ့ route segment ထဲမှာပဲ — သူ့ရဲ့ alt text အတွက် `opengraph-image.alt.txt` file ကို တွဲ ထည့်ပါ။ `opengraph-image.alt.txt` ရဲ့ content က:

```txt
About Acme
```

```html
<!-- <head> output -->
<meta property="og:image:alt" content="About Acme" />
```

### `twitter-image.alt.txt`

အလားတူပဲ — `twitter-image` ရဲ့ alt text အတွက် `twitter-image.alt.txt` file ကို တွဲ ထည့်ပါ။ `twitter-image.alt.txt` ရဲ့ content က:

```txt
About Acme
```

```html
<!-- <head> output -->
<meta name="twitter:image:alt" content="About Acme" />
```

## Code သုံးပြီး images generate လုပ်ခြင်း (.js, .ts, .tsx)

အပေါ်က **Image files** နည်းလမ်း သုံးတာအပြင် — code နဲ့ images တွေကို programmatically **generate** လုပ်နိုင်ပါတယ်။ Route segment တစ်ခုရဲ့ shared image ကို generate လုပ်ဖို့ — default function တစ်ခုကို export လုပ်တဲ့ `opengraph-image` (သို့) `twitter-image` route တစ်ခု ဖန်တီးပါ။

| File convention   | Supported file types |
| ----------------- | -------------------- |
| `opengraph-image` | `.js`, `.ts`, `.tsx` |
| `twitter-image`   | `.js`, `.ts`, `.tsx` |

> **သိထားသင့်သည်:**
>
> - Default အနေနဲ့ — generate လုပ်ထားတဲ့ images တွေက [**statically optimized**](https://nextjs.org/docs/app/glossary#prerendering) ဖြစ်ပါတယ် (build time မှာ generate လုပ်ပြီး cache လုပ်တာ) — [Request-time APIs](https://nextjs.org/docs/app/glossary#request-time-apis) (သို့) uncached data တွေ မသုံးဘူးဆိုရင်ပေါ့။
> - File တစ်ခုထဲမှာ images အများအပြား generate လုပ်ချင်ရင် [`generateImageMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata) ကို သုံးနိုင်ပါတယ်။
> - `opengraph-image.js` နဲ့ `twitter-image.js` တွေက special Route Handlers တွေပါ — [Request-time API](https://nextjs.org/docs/app/glossary#request-time-apis) (သို့) [dynamic config](https://nextjs.org/docs/app/guides/caching-without-cache-components#dynamic) option မသုံးရင် default အားဖြင့် cache လုပ်ပါတယ်။

Image တစ်ခု generate လုပ်ဖို့ အလွယ်ဆုံးနည်းလမ်းက — `next/og` ကန့် [ImageResponse](https://nextjs.org/docs/app/api-reference/functions/image-response) API ကို သုံးတာပါ။

```tsx
// app/about/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Image metadata
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

const interSemiBold = await readFile(
  join(process.cwd(), 'assets/Inter-SemiBold.ttf')
)

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
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
        About Acme
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

JavaScript project တွေမှာလည်း type import မလိုဘဲ အလားတူ code မျိုး ရေးနိုင်ပါတယ်။ Output `<head>` ကတော့ အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```html
<!-- <head> output -->
<meta property="og:image" content="<generated>" />
<meta property="og:image:alt" content="About Acme" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### Props

Default export function က အောက်ပါ props တွေကို လက်ခံပါတယ်:

#### `params` (optional)

`opengraph-image` (သို့) `twitter-image` တည်ရှိတဲ့ segment အထိ — root segment ကနေ ဆင်းလာတဲ့ [dynamic route parameters](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) object တစ်ခုကို resolve လုပ်ပေးတဲ့ promise တစ်ခုပါ။

> **သိထားသင့်သည်:** [`generateImageMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata) သုံးနေရင် — function က `generateImageMetadata` ပြန်ပေးတဲ့ items တစ်ခုထဲက `id` value ကို resolve လုပ်ပေးတဲ့ `id` prop တစ်ခုပါ လက်ခံပါလိမ့်မယ်။

```tsx
// app/shop/[slug]/opengraph-image.tsx
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

| Route                                      | URL         | `params`                           |
| ------------------------------------------ | ----------- | ---------------------------------- |
| `app/shop/opengraph-image.js`              | `/shop`     | `undefined`                        |
| `app/shop/[slug]/opengraph-image.js`       | `/shop/1`   | `Promise<{ slug: '1' }>`           |
| `app/shop/[tag]/[item]/opengraph-image.js` | `/shop/1/2` | `Promise<{ tag: '1', item: '2' }>` |

### Returns

Default export function က `Response` တစ်ခု ပြန်ပေးရပါမယ်။

> **သိထားသင့်သည်:** `ImageResponse` က ဒီ return type ကို ကျေနပ်စေပါတယ်။

### Config exports

`alt`, `size`, `contentType` variables တွေကို `opengraph-image` (သို့) `twitter-image` route ကနေ export လုပ်ပြီး image ရဲ့ metadata ကို configure လုပ်နိုင်ပါတယ်။

| Option       | Type                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| `alt`        | `string`                                                                                                        |
| `size`       | `{ width: number; height: number }`                                                                             |
| `contentType`| `string` — [image MIME type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types) |

#### `alt`

```tsx
// opengraph-image.tsx | twitter-image.tsx
export const alt = 'My images alt text'

export default function Image() {}
```

```html
<!-- <head> output -->
<meta property="og:image:alt" content="My images alt text" />
```

#### `size`

```tsx
// opengraph-image.tsx | twitter-image.tsx
export const size = { width: 1200, height: 630 }

export default function Image() {}
```

```html
<!-- <head> output -->
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

#### `contentType`

```tsx
// opengraph-image.tsx | twitter-image.tsx
export const contentType = 'image/png'

export default function Image() {}
```

```html
<!-- <head> output -->
<meta property="og:image:type" content="image/png" />
```

#### Route Segment Config

`opengraph-image` နဲ့ `twitter-image` တွေက specialized [Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route) တွေပါ — Pages နဲ့ Layouts တွေလိုပဲ တူညီတဲ့ [route segment configuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) options တွေကို သုံးနိုင်ပါတယ်။

### ဥပမာများ

#### External data သုံးခြင်း

ဒီဥပမာက `params` object နဲ့ external data တွေကို သုံးပြီး image ကို generate လုပ်ပါတယ်။

> **သိထားသင့်သည်:** Default အနေနဲ့ ဒီ generate လုပ်ထားတဲ့ image က statically optimized ဖြစ်ပါတယ်။ ဒီအပြုအမူ ပြောင်းချင်ရင် `fetch` ရဲ့ individual [`options`](https://nextjs.org/docs/app/api-reference/functions/fetch) (သို့) route segment ရဲ့ [options](https://nextjs.org/docs/app/guides/caching-without-cache-components#route-segment-config-revalidate) တွေကို configure လုပ်နိုင်ပါတယ်။

```tsx
// app/posts/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetch(`https://.../posts/${slug}`).then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
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
    ),
    {
      ...size,
    }
  )
}
```

#### Node.js runtime + local assets သုံးခြင်း

ဒီဥပမာတွေက Node.js runtime ကို သုံးပြီး — file system ကနေ local image တစ်ခုကို ဖတ်ကာ `<img>` ရဲ့ `src` attribute ဆီ base64 string (သို့) `ArrayBuffer` အနေနဲ့ ပို့ပါတယ်။ Local asset ကို project root နဲ့ ယှဉ်ပြီး ထားပါ — ဥပမာ source file နဲ့ မဟုတ်ဘဲ။

Asset က request data ပေါ် မမူတည်လို့ — module scope မှာ တစ်ကြိမ်တည်း ဖတ်ထားပါ။ [Predictable values](https://nextjs.org/docs/app/getting-started/caching#predictable-values) ကို ကြည့်ပါ။

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

const logoData = await readFile(join(process.cwd(), 'logo.png'), 'base64')
const logoSrc = `data:image/png;base64,${logoData}`

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

`<img>` element ရဲ့ `src` attribute ဆီ `ArrayBuffer` ပို့တာက HTML spec အရတော့ မပါပါဘူး။ `next/og` သုံးတဲ့ rendering engine က ထောက်ပံ့ပေမယ့် — TypeScript definitions တွေက spec ကို လိုက်နာလို့၊ ဒီ [feature](https://github.com/vercel/satori/issues/606#issuecomment-2144000453) ကို သုံးဖို့ `@ts-expect-error` directive (သို့) အလားတူတစ်ခုခု လိုပါတယ်။

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

const logoData = await readFile(join(process.cwd(), 'logo.png'))
const logoSrc = Uint8Array.from(logoData).buffer

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* @ts-expect-error Satori accepts ArrayBuffer/typed arrays for <img src> at runtime */}
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

## Version History

| Version   | အပြောင်းအလဲ                                              |
| --------- | ------------------------------------------------------- |
| `v16.0.0` | `params` က object တစ်ခုကို resolve လုပ်ပေးတဲ့ promise ဖြစ်လာ |
| `v13.3.0` | `opengraph-image` နဲ့ `twitter-image` စတင် မိတ်ဆက်       |
