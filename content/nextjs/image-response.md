---
title: "ImageResponse (JSX နဲ့ CSS သုံးပြီး dynamic images ဖန်တီးခြင်း)"
description: "ImageResponse constructor — JSX နဲ့ CSS သုံးပြီး dynamic images (Open Graph images, Twitter cards စသည်) ဖန်တီးနည်း; parameters, ထောက်ပံ့ပေးတဲ့ HTML/CSS features, Route Handlers, file-based metadata နဲ့ custom fonts ဥပမာများ"
order: 67
source: "https://nextjs.org/docs/app/api-reference/functions/image-response"
status: translated
updated: 2026-09-02
---

`ImageResponse` constructor က JSX နဲ့ CSS သုံးပြီး dynamic images တွေ ဖန်တီးနိုင်စေပါတယ်။ Open Graph images, Twitter cards စတဲ့ social media images တွေ ဖန်တီးဖို့ အသုံးဝင်ပါတယ်။

## Reference

### Parameters

`ImageResponse` အတွက် ရနိုင်တဲ့ parameters တွေကတော့:

```jsx
import { ImageResponse } from 'next/og'

new ImageResponse(
  element: ReactElement,
  options: {
    width?: number = 1200
    height?: number = 630
    emoji?: 'twemoji' | 'blobmoji' | 'noto' | 'openmoji' = 'twemoji',
    fonts?: {
      name: string,
      data: ArrayBuffer,
      weight: number,
      style: 'normal' | 'italic'
    }[]
    debug?: boolean = false

    // Options that will be passed to the HTTP response
    status?: number = 200
    statusText?: string
    headers?: Record<string, string>
  },
)
```

> ဥပမာတွေကို [Vercel OG Playground](https://og-playground.vercel.app/) မှာ ကြည့်ရှုနိုင်ပါတယ်။

### ထောက်ပံ့ပေးတဲ့ HTML နဲ့ CSS features

`ImageResponse` က flexbox နဲ့ absolute positioning, custom fonts, text wrapping, centering, nested images အပါအဝင် အသုံးများတဲ့ CSS properties တွေကို ထောက်ပံ့ပေးပါတယ်။

ထောက်ပံ့ပေးတဲ့ HTML နဲ့ CSS features တွေရဲ့ စာရင်းအပြည့်အစုံအတွက် [Satori ရဲ့ documentation](https://github.com/vercel/satori#css) ကို ကိုးကားပါ။

## အပြုအမူ (Behavior)

- `ImageResponse` က [@vercel/og](https://vercel.com/docs/og-image-generation), [Satori](https://github.com/vercel/satori) နဲ့ Resvg တို့ကို သုံးပြီး HTML နဲ့ CSS တွေကို PNG အဖြစ် ပြောင်းပေးပါတယ်။
- Flexbox နဲ့ CSS properties တစ်စိတ်တစ်ပိုင်းကိုပဲ ထောက်ပံ့ပေးပါတယ်။ ပိုရှုပ်ထွေးတဲ့ layouts တွေ (ဥပမာ `display: grid`) ကတော့ အလုပ်မလုပ်ပါဘူး။
- Bundle size အများဆုံး `500KB` ပါ။ Bundle size ထဲမှာ သင့် JSX, CSS, fonts, images နဲ့ အခြား assets တွေ အားလုံး ပါဝင်ပါတယ်။ ဒီကန့်သတ်ချက် ကျော်သွားရင် — assets တစ်ခုခုရဲ့ အရွယ်အစား လျှော့ချတာ (သို့) runtime မှာ fetch လုပ်တာ စဉ်းစားပါ။
- `ttf`, `otf`, နဲ့ `woff` font formats တွေကိုပဲ ထောက်ပံ့ပေးပါတယ်။ Font parsing မြန်ဆန်မှု အများဆုံး ရဖို့ — `woff` ထက် `ttf` (သို့) `otf` တွေကို ဦးစားပေးပါ။

## ဥပမာများ

### Route Handlers

`ImageResponse` ကို Route Handlers တွေမှာ သုံးပြီး — request time မှာ images တွေကို dynamically ဖန်တီးနိုင်ပါတယ်။

```js filename="app/api/route.js"
import { ImageResponse } from 'next/og'

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              color: 'black',
              textAlign: 'center',
            }}
          >
            Welcome to My Site
          </div>
          <div
            style={{
              fontSize: 30,
              color: '#666',
              marginTop: '20px',
            }}
          >
            Generated with Next.js ImageResponse
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
```

### File-based Metadata

[`opengraph-image.tsx`](/docs/nextjs/opengraph-image) file တစ်ခုထဲမှာ `ImageResponse` ကို သုံးပြီး — Open Graph images တွေကို build time မှာ (သို့) request time မှာ dynamically ဖန်တီးနိုင်ပါတယ်။

```tsx filename="app/opengraph-image.tsx"
import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'My site'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

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
        My site
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}
```

### Custom fonts

`ImageResponse` ထဲမှာ options ရဲ့ `fonts` array တစ်ခုကို ထည့်ပေးခြင်းဖြင့် custom fonts တွေ သုံးနိုင်ပါတယ်။ Font က request data အပေါ် မမူတည်လို့ — module scope မှာ တစ်ကြိမ်တည်း ဖတ်ထားပါ။ [Predictable values](/docs/nextjs/caching) ကို ကြည့်ပါ။

```tsx filename="app/opengraph-image.tsx"
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Image metadata
export const alt = 'My site'
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
      // ...
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

## Version History

| Version   | အပြောင်းအလဲ                                              |
| --------- | -------------------------------------------------------- |
| `v14.0.0` | `ImageResponse` ကို `next/server` ကနေ `next/og` ဆီ ရွှေ့လိုက်ပါတယ်။ |
| `v13.3.0` | `ImageResponse` ကို `next/server` ကနေ import လုပ်နိုင်ပါတယ်။ |
| `v13.0.0` | `ImageResponse` ကို `@vercel/og` package ကနေတစ်ဆင့် စတင် မိတ်ဆက်။ |
