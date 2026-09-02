---
title: "images (next/image loader သတ်မှတ်ချက်)"
description: "images option — built-in Image Optimization API အစား cloud provider ဖြင့် images များကို optimize လုပ်ရန် custom loader/loaderFile သတ်မှတ်ချက်နှင့် provider ဥပမာများ"
order: 92
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/images"
status: translated
updated: 2026-09-02
---

Next.js ရဲ့ built-in Image Optimization API အစား cloud provider တစ်ခုကို သုံးပြီး images တွေကို optimize လုပ်ချင်ရင် — `next.config.js` ကို အောက်ပါအတိုင်း configure လုပ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my/image/loader.js',
  },
}
```

ဒီ `loaderFile` က သင့် Next.js application ရဲ့ root နဲ့ ဆက်စပ်တဲ့ (relative) file တစ်ခုကို ညွှန်ပြရပါမယ်။ အဲဒီ file က string တစ်ခုကို ပြန်ပေးတဲ့ default function တစ်ခုကို export လုပ်ရပါမယ် — ဥပမာ:

```js filename="my/image/loader.js"
'use client'

export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

တနည်းအားဖြင့် — `next/image` ရဲ့ instance တစ်ခုစီဆီ function ကို ပို့ဖို့ [`loader` prop](/docs/nextjs/component-image#loader) ကို သုံးနိုင်ပါတယ်။

> **သိထားသင့်သည်:** Function တစ်ခုကို လက်ခံတဲ့ image loader file ကို customize လုပ်တာက — ပေးထားတဲ့ function ကို serialize လုပ်ဖို့ [Client Components](/docs/nextjs/server-client-components) တွေ သုံးဖို့ လိုအပ်ပါတယ်။

Built-in [Image Optimization API](https://nextjs.org/docs/app/api-reference/components/image) နဲ့ [Image Component](https://nextjs.org/docs/app/api-reference/components/image) တွေရဲ့ အပြုအမူကို configure လုပ်ခြင်းအကြောင်း ပိုသိချင်ရင် — ရနိုင်တဲ့ options တွေအတွက် [Image Configuration Options](/docs/nextjs/component-image#configuration-options) ကို ကြည့်ပါ။

## Loader configuration ဥပမာများ

- [Akamai](#akamai)
- [AWS CloudFront](#aws-cloudfront)
- [Cloudinary](#cloudinary)
- [Cloudflare](#cloudflare)
- [Contentful](#contentful)
- [Fastly](#fastly)
- [Gumlet](#gumlet)
- [ImageEngine](#imageengine)
- [Imgix](#imgix)
- [PixelBin](#pixelbin)
- [Sanity](#sanity)
- [Sirv](#sirv)
- [Supabase](#supabase)
- [Thumbor](#thumbor)
- [ImageKit.io](#imagekitio)
- [Nitrogen AIO](#nitrogen-aio)

### Akamai

```js
// Docs: https://techdocs.akamai.com/ivm/reference/test-images-on-demand
export default function akamaiLoader({ src, width, quality }) {
  return `https://example.com/${src}?imwidth=${width}`
}
```

### AWS CloudFront

```js
// Docs: https://aws.amazon.com/developer/application-security-performance/articles/image-optimization
export default function cloudfrontLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('format', 'auto')
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}
```

### Cloudinary

```js
// Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
export default function cloudinaryLoader({ src, width, quality }) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://example.com/${params.join(',')}${src}`
}
```

### Cloudflare

```js
// Docs: https://developers.cloudflare.com/images/transform-images
export default function cloudflareLoader({ src, width, quality }) {
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto']
  return `https://example.com/cdn-cgi/image/${params.join(',')}/${src}`
}
```

### Contentful

```js
// Docs: https://www.contentful.com/developers/docs/references/images-api/
export default function contentfulLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('fm', 'webp')
  url.searchParams.set('w', width.toString())
  url.searchParams.set('q', (quality || 75).toString())
  return url.href
}
```

### Fastly

```js
// Docs: https://developer.fastly.com/reference/io/
export default function fastlyLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('auto', 'webp')
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}
```

### Gumlet

```js
// Docs: https://docs.gumlet.com/reference/image-transform-size
export default function gumletLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('format', 'auto')
  url.searchParams.set('w', width.toString())
  url.searchParams.set('q', (quality || 75).toString())
  return url.href
}
```

### ImageEngine

```js
// Docs: https://support.imageengine.io/hc/en-us/articles/360058880672-Directives
export default function imageengineLoader({ src, width, quality }) {
  const compression = 100 - (quality || 50)
  const params = [`w_${width}`, `cmpr_${compression}`]
  return `https://example.com${src}?imgeng=/${params.join('/')}`
}
```

### Imgix

```js
// Demo: https://static.imgix.net/daisy.png?format=auto&fit=max&w=300
export default function imgixLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  const params = url.searchParams
  params.set('auto', params.getAll('auto').join(',') || 'format')
  params.set('fit', params.get('fit') || 'max')
  params.set('w', params.get('w') || width.toString())
  params.set('q', (quality || 50).toString())
  return url.href
}
```

### PixelBin

```js
// Doc (Resize): https://www.pixelbin.io/docs/transformations/basic/resize/#width-w
// Doc (Optimise): https://www.pixelbin.io/docs/optimizations/quality/#image-quality-when-delivering
// Doc (Auto Format Delivery): https://www.pixelbin.io/docs/optimizations/format/#automatic-format-selection-with-f_auto-url-parameter
export default function pixelBinLoader({ src, width, quality }) {
  const name = '<your-cloud-name>'
  const opt = `t.resize(w:${width})~t.compress(q:${quality || 75})`
  return `https://cdn.pixelbin.io/v2/${name}/${opt}/${src}?f_auto=true`
}
```

### Sanity

```js
// Docs: https://www.sanity.io/docs/image-urls
export default function sanityLoader({ src, width, quality }) {
  const prj = 'zp7mbokg'
  const dataset = 'production'
  const url = new URL(`https://cdn.sanity.io/images/${prj}/${dataset}${src}`)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'max')
  url.searchParams.set('w', width.toString())
  if (quality) {
    url.searchParams.set('q', quality.toString())
  }
  return url.href
}
```

### Sirv

```js
// Docs: https://sirv.com/help/articles/dynamic-imaging/
export default function sirvLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  const params = url.searchParams
  params.set('format', params.getAll('format').join(',') || 'optimal')
  params.set('w', params.get('w') || width.toString())
  params.set('q', (quality || 85).toString())
  return url.href
}
```

### Supabase

```js
// Docs: https://supabase.com/docs/guides/storage/image-transformations#nextjs-loader
export default function supabaseLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}
```

### Thumbor

```js
// Docs: https://thumbor.readthedocs.io/en/latest/
export default function thumborLoader({ src, width, quality }) {
  const params = [`${width}x0`, `filters:quality(${quality || 75})`]
  return `https://example.com${params.join('/')}${src}`
}
```

### ImageKit.io

```js
// Docs: https://imagekit.io/docs/image-transformation
export default function imageKitLoader({ src, width, quality }) {
  const params = [`w-${width}`, `q-${quality || 80}`]
  return `https://ik.imagekit.io/your_imagekit_id/${src}?tr=${params.join(',')}`
}
```

### Nitrogen AIO

```js
// Docs: https://docs.n7.io/aio/intergrations/
export default function aioLoader({ src, width, quality }) {
  const url = new URL(src, window.location.href)
  const params = url.searchParams
  const aioParams = params.getAll('aio')
  aioParams.push(`w-${width}`)
  if (quality) {
    aioParams.push(`q-${quality.toString()}`)
  }
  params.set('aio', aioParams.join(';'))
  return url.href
}
```
