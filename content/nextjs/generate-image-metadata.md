---
title: "generateImageMetadata (route segment တစ်ခုအတွက် images အများအပြား ထုတ်လုပ်ခြင်း)"
description: "generateImageMetadata() — Metadata API special files (icon, opengraph-image စသည်) တွေမှာ params နဲ့ external data သုံးပြီး images အများအပြား/ဗားရှင်းမျိုးစုံ ထုတ်လုပ်နည်း; return array ထဲက id/alt/size/contentType object များ, image generation function ရဲ့ id/params props များ"
order: 144
source: "https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata"
status: translated
updated: 2026-09-03
---

`generateImageMetadata` ကို သုံးပြီး — image တစ်ခုရဲ့ ဗားရှင်း အမျိုးမျိုးကို ထုတ်လုပ်နိုင်သလို — route segment တစ်ခုအတွက် images အများအပြားကိုလည်း ပြန်ပေးနိုင်ပါတယ်။ Icons လိုမျိုးနေရာမှာ metadata values တွေကို hard-code (တိုက်ရိုက် ရေးသွင်းခြင်း) မလုပ်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

## Parameters

`generateImageMetadata` function က အောက်ပါ parameters တွေကို လက်ခံပါတယ်:

#### `params` (optional)

(root segment ကနေ `generateImageMetadata` ကို ခေါ်ထားတဲ့ segment အထိ) [dynamic route parameters](/docs/nextjs/file-conventions-dynamic-routes) object ပါဝင်တဲ့ object တစ်ခုပါ။

```tsx filename="icon.tsx" switcher
export function generateImageMetadata({
  params,
}: {
  params: { slug: string }
}) {
  // ...
}
```

```jsx filename="icon.js" switcher
export function generateImageMetadata({ params }) {
  // ...
}
```

| Route                           | URL         | `params`                  |
| ------------------------------- | ----------- | ------------------------- |
| `app/shop/icon.js`              | `/shop`     | `undefined`               |
| `app/shop/[slug]/icon.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/icon.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |

## Returns

`generateImageMetadata` function က — image ရဲ့ `alt` နဲ့ `size` လိုမျိုး metadata တွေ ပါဝင်တဲ့ object တွေရဲ့ `array` (စာရင်း) တစ်ခုကို ပြန်ပေးရပါမယ်။ ဒါ့အပြင် — item တစ်ခုစီမှာ `id` တန်ဖိုး **မဖြစ်မနေ** ပါဝင်ရပါတယ် — ဒီ `id` ကို image ထုတ်လုပ်တဲ့ function ရဲ့ props တွေဆီ promise တစ်ခုအနေနဲ့ ပေးပို့ပါတယ်။

| Image Metadata Object | Type                                |
| --------------------- | ----------------------------------- |
| `id`                  | `string` (required)                 |
| `alt`                 | `string`                            |
| `size`                | `{ width: number; height: number }` |
| `contentType`         | `string`                            |

```tsx filename="icon.tsx" switcher
import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const iconId = await id
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: '#000',
          color: '#fafafa',
        }}
      >
        Icon {iconId}
      </div>
    )
  )
}
```

```jsx filename="icon.js" switcher
import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}

export default async function Icon({ id }) {
  const iconId = await id
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: '#000',
          color: '#fafafa',
        }}
      >
        Icon {iconId}
      </div>
    )
  )
}
```

## Image generation function ရဲ့ props

`generateImageMetadata` ကို သုံးတဲ့အခါ — default export image generation function က အောက်ပါ props တွေကို လက်ခံရရှိပါတယ်:

#### `id`

`generateImageMetadata` က ပြန်ပေးတဲ့ items တွေထဲက item တစ်ခုရဲ့ `id` တန်ဖိုးဆီ resolve ဖြစ်တဲ့ promise တစ်ခုပါ။ `generateImageMetadata` ကနေ ဘာပြန်ပေးလဲပေါ် မူတည်ပြီး — `id` က `string` (သို့) `number` ဖြစ်ပါလိမ့်မယ်။

```tsx filename="icon.tsx" switcher
export default async function Icon({ id }: { id: Promise<string | number> }) {
  const iconId = await id
  // Use iconId to generate the image
}
```

```jsx filename="icon.js" switcher
export default async function Icon({ id }) {
  const iconId = await id
  // Use iconId to generate the image
}
```

#### `params` (optional)

Image တည်ရှိတဲ့ segment အထိ — root segment ကနေ [dynamic route parameters](/docs/nextjs/file-conventions-dynamic-routes) တွေ ပါဝင်တဲ့ object ဆီ resolve ဖြစ်တဲ့ promise တစ်ခုပါ။

```tsx filename="icon.tsx" switcher
export default async function Icon({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // Use slug to generate the image
}
```

```jsx filename="icon.js" switcher
export default async function Icon({ params }) {
  const { slug } = await params
  // Use slug to generate the image
}
```

### ဥပမာများ

#### External data တွေ သုံးခြင်း

ဒီဥပမာက — route segment တစ်ခုအတွက် [Open Graph images](/docs/nextjs/opengraph-image) အများအပြား ထုတ်လုပ်ဖို့ `params` object နဲ့ external data တွေကို သုံးပါတယ်။

```tsx filename="app/products/[id]/opengraph-image.tsx" switcher
import { ImageResponse } from 'next/og'
import { getCaptionForImage, getOGImages } from '@/app/utils/images'

export async function generateImageMetadata({
  params,
}: {
  params: { id: string }
}) {
  const images = await getOGImages(params.id)

  return images.map((image, idx) => ({
    id: idx,
    size: { width: 1200, height: 600 },
    alt: image.text,
    contentType: 'image/png',
  }))
}

export default async function Image({
  params,
  id,
}: {
  params: Promise<{ id: string }>
  id: Promise<number>
}) {
  const productId = (await params).id
  const imageId = await id
  const text = await getCaptionForImage(productId, imageId)

  return new ImageResponse(
    (
      <div
        style={
          {
            // ...
          }
        }
      >
        {text}
      </div>
    )
  )
}
```

```jsx filename="app/products/[id]/opengraph-image.js" switcher
import { ImageResponse } from 'next/og'
import { getCaptionForImage, getOGImages } from '@/app/utils/images'

export async function generateImageMetadata({ params }) {
  const images = await getOGImages(params.id)

  return images.map((image, idx) => ({
    id: idx,
    size: { width: 1200, height: 600 },
    alt: image.text,
    contentType: 'image/png',
  }))
}

export default async function Image({ params, id }) {
  const productId = (await params).id
  const imageId = await id
  const text = await getCaptionForImage(productId, imageId)

  return new ImageResponse(
    (
      <div
        style={
          {
            // ...
          }
        }
      >
        {text}
      </div>
    )
  )
}
```

## Version History

| Version   | အပြောင်းအလဲ                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `v16.0.0` | Image generation function ဆီ ပေးတဲ့ `id` က `string` (သို့) `number` ဆီ resolve ဖြစ်တဲ့ promise တစ်ခု ဖြစ်လာ။ |
| `v16.0.0` | Image generation function ဆီ ပေးတဲ့ `params` က object တစ်ခုဆီ resolve ဖြစ်တဲ့ promise တစ်ခု ဖြစ်လာ။       |
| `v13.3.0` | `generateImageMetadata` ကို စတင် မိတ်ဆက်။                                                                  |
