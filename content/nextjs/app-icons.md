---
title: "favicon, icon နှင့် apple-icon (app icons file conventions)"
description: "favicon/icon/apple-icon file conventions — image files (.ico/.jpg/.png) (သို့) code (.js/.ts/.tsx) နဲ့ app icons သတ်မှတ်နည်း — browser tabs, phone home screens, search results တွေမှာ ပေါ်လာတဲ့ icons အတွက်"
order: 52
source: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons"
status: translated
updated: 2026-09-02
---

`favicon`, `icon` (သို့) `apple-icon` file conventions တွေက သင့် application အတွက် icons တွေ သတ်မှတ်ပေးနိုင်ပါတယ်။

ဒါတွေက web browser tabs, phone home screens, search engine results စတဲ့ နေရာတွေမှာ ပေါ်လာတဲ့ app icons တွေ ထည့်ဖို့ အသုံးဝင်ပါတယ်။

App icons သတ်မှတ်ဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:

- [Image files (.ico, .jpg, .png) သုံးခြင်း](#image-files-ico-jpg-png)
- [Code နဲ့ icon generate လုပ်ခြင်း (.js, .ts, .tsx)](#generate-icons-using-code-js-ts-tsx)

## Image files (.ico, .jpg, .png)

`/app` directory ထဲမှာ `favicon`, `icon` (သို့) `apple-icon` image file တစ်ခု ထားခြင်းဖြင့် app icon ကို သတ်မှတ်နိုင်ပါတယ်။ `favicon` image က `app/` ရဲ့ အပေါ်ဆုံး level မှာပဲ တည်ရှိလို့ ရပါတယ်။

Next.js က file ကို စစ်ဆေးပြီး သင့် app ရဲ့ `<head>` element ထဲကို သင့်တော်တဲ့ tags တွေကို အလိုအလျောက် ထည့်ပေးပါတယ်။

| File convention        | Supported file types                    | တည်ရှိနိုင်တဲ့ နေရာ |
| ---------------------- | --------------------------------------- | --------------- |
| [`favicon`](#favicon)  | `.ico`                                  | `app/`          |
| [`icon`](#icon)        | `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg` | `app/**/*`      |
| [`apple-icon`](#apple-icon) | `.jpg`, `.jpeg`, `.png`             | `app/**/*`      |

### `favicon`

Root `/app` route segment မှာ `favicon.ico` image file တစ်ခု ထည့်ပါ။

```html
<!-- <head> output -->
<link rel="icon" href="/favicon.ico" sizes="any" />
```

### `icon`

`icon.(ico|jpg|jpeg|png|svg)` image file တစ်ခု ထည့်ပါ။

```html
<!-- <head> output -->
<link
  rel="icon"
  href="/icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

### `apple-icon`

`apple-icon.(jpg|jpeg|png)` image file တစ်ခု ထည့်ပါ။

```html
<!-- <head> output -->
<link
  rel="apple-touch-icon"
  href="/apple-icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

> **သိထားသင့်သည်:**
>
> - File name မှာ number suffix ထည့်ပြီး icons အများအပြား သတ်မှတ်နိုင်ပါတယ် — ဥပမာ `icon1.png`, `icon2.png` စသဖြင့်။ Numbered files တွေကို lexically (နံပါတ်စဉ်အလိုက်) စီပါတယ်။
> - Favicon တွေက root `/app` segment မှာပဲ သတ်မှတ်လို့ ရပါတယ်။ ပိုပြီး အကွက်ကျယ်ချင်ရင် [`icon`](#icon) ကို သုံးပါ။
> - `rel`, `href`, `type`, `sizes` စတဲ့ သင့်တော်တဲ့ `<link>` tags နဲ့ attributes တွေကို icon type နဲ့ file ရဲ့ metadata အပေါ် မူတည်ပြီး ဆုံးဖြတ်ပါတယ်။
> - ဥပမာ — 32 x 32px ရှိတဲ့ `.png` file တစ်ခုဆို `type="image/png"` နဲ့ `sizes="32x32"` attributes တွေ ပါပါလိမ့်မယ်။
> - File extension က `.svg` ဖြစ်ရင် (သို့) file ရဲ့ image size ကို မသေချာရင် `sizes="any"` ကို icons တွေမှာ ထည့်ပေးပါတယ်။ အသေးစိတ်ကို ဒီ [favicon handbook](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs) မှာ ကြည့်ပါ။

## Generate icons using code (.js, .ts, .tsx)

[Image files](#image-files-ico-jpg-png) သုံးတာအပြင် — code နဲ့ icons တွေကို programmatically **generate** လုပ်နိုင်ပါတယ်။

Default export function တစ်ခု ပါတဲ့ `icon` (သို့) `apple-icon` route တစ်ခု ဖန်တီးခြင်းဖြင့် app icon တစ်ခု generate လုပ်ပါ။

| File convention | Supported file types |
| --------------- | -------------------- |
| `icon`          | `.js`, `.ts`, `.tsx` |
| `apple-icon`    | `.js`, `.ts`, `.tsx` |

Icon generate လုပ်ဖို့ အလွယ်ဆုံးနည်းကတော့ — `next/og` ကနေ [`ImageResponse`](https://nextjs.org/docs/app/api-reference/functions/image-response) API ကို သုံးတာပါ။

```tsx
// app/icon.tsx
import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}
```

JavaScript project တွေမှာလည်း type import မလိုဘဲ အလားတူ code မျိုး ရေးနိုင်ပါတယ်။ Output `<head>` ကတော့ အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```html
<!-- <head> output -->
<link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
```

> **သိထားသင့်သည်:**
>
> - Generate လုပ်ထားတဲ့ icons တွေက default အားဖြင့် [**statically optimized**](https://nextjs.org/docs/app/glossary#prerendering) (build time မှာ generate ပြီး cache လုပ်) ဖြစ်ပါတယ် — [Request-time APIs](https://nextjs.org/docs/app/glossary#request-time-apis) (သို့) uncached data တွေ မသုံးရင်။
> - File တစ်ခုတည်းမှာ icons အများအပြား generate လုပ်ချင်ရင် [`generateImageMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata) ကို သုံးပါ။
> - `favicon` icon ကိုတော့ generate လုပ်လို့ မရပါဘူး။ [`icon`](#icon) (သို့) [favicon.ico](#favicon) file ကို သုံးပါ။
> - App icons တွေက special Route Handlers တွေပါ — [Request-time API](https://nextjs.org/docs/app/glossary#request-time-apis) (သို့) [dynamic config](https://nextjs.org/docs/app/guides/caching-without-cache-components#dynamic) option ကို မသုံးရင် default အားဖြင့် cache လုပ်ပါတယ်။

### Props

Default export function က အောက်ပါ props တွေကို လက်ခံပါတယ်:

#### `params` (optional)

`icon` (သို့) `apple-icon` ရှိနေတဲ့ root segment ကနေ အဲဒီ segment အထိ [dynamic route parameters](/docs/nextjs/dynamic-routes) object ပါတဲ့ promise တစ်ခု။

> **သိထားသင့်သည်:** [`generateImageMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata) ကို သုံးထားရင် — function က `generateImageMetadata` ပြန်ပေးတဲ့ items တစ်ခုရဲ့ `id` value ကို resolve လုပ်ပေးတဲ့ promise တစ်ခုဖြစ်တဲ့ `id` prop ကိုပါ လက်ခံရရှိပါတယ်။

```tsx
// app/shop/[slug]/icon.tsx
export default async function Icon({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

| Route                           | URL         | `params`                   |
| ------------------------------- | ----------- | -------------------------- |
| `app/shop/icon.js`              | `/shop`     | `undefined`                |
| `app/shop/[slug]/icon.js`       | `/shop/1`   | `Promise<{ slug: '1' }>`   |
| `app/shop/[tag]/[item]/icon.js` | `/shop/1/2` | `Promise<{ tag: '1', item: '2' }>` |

### Returns

Default export function က `Blob` | `ArrayBuffer` | `TypedArray` | `DataView` | `ReadableStream` | `Response` — ဒါတွေထဲက တစ်ခုကို ပြန်ပေးရပါမယ်။

> **သိထားသင့်သည်:** `ImageResponse` က ဒီ return type ကို ပြည့်မီပါတယ်။

### Config exports

`icon` (သို့) `apple-icon` route ကနေ `size` နဲ့ `contentType` variables တွေ export လုပ်ပြီး icon ရဲ့ metadata ကို optionally configure လုပ်နိုင်ပါတယ်။

| Option                        | Type                                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [`size`](#size)               | `{ width: number; height: number }`                                                                             |
| [`contentType`](#contenttype) | `string` — [image MIME type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types) |

#### `size`

```tsx
// icon.tsx | apple-icon.tsx
export const size = { width: 32, height: 32 }

export default function Icon() {}
```

```html
<!-- <head> output -->
<link rel="icon" sizes="32x32" />
```

#### `contentType`

```tsx
// icon.tsx | apple-icon.tsx
export const contentType = 'image/png'

export default function Icon() {}
```

```html
<!-- <head> output -->
<link rel="icon" type="image/png" />
```

#### Route Segment Config

`icon` နဲ့ `apple-icon` တွေက specialized [Route Handlers](/docs/nextjs/route-handlers) တွေပါ — Pages နဲ့ Layouts တွေလိုပဲ [route segment configuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) options တွေကို သုံးနိုင်ပါတယ်။

## Version History

| Version   | အပြောင်းအလဲ                                                       |
| --------- | ---------------------------------------------------------------- |
| `v16.0.0` | `params` က object တစ်ခုကို resolve လုပ်ပေးတဲ့ promise ဖြစ်လာပါတယ် |
| `v13.3.0` | `favicon`, `icon` နဲ့ `apple-icon` စတင် မိတ်ဆက်                 |
