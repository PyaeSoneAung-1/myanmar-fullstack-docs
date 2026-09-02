---
title: "sitemap.xml (search engine indexing အတွက် sitemap)"
description: "sitemap.(xml|js|ts) file convention — Sitemaps XML format နဲ့ ကိုက်ညီအောင် site ရဲ့ sitemap ကို static file ဒါမှမဟုတ် code နဲ့ generate လုပ်ပြီး search engine crawlers တွေ ထိရောက်စွာ index လုပ်နိုင်အောင် ကူညီနည်း"
order: 50
source: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap"
status: translated
updated: 2026-09-02
---

`sitemap.(xml|js|ts)` က [Sitemaps XML format](https://www.sitemaps.org/protocol.html) နဲ့ ကိုက်ညီတဲ့ special file တစ်ခုပါ — search engine crawlers တွေ သင့် site ကို ပိုပြီး ထိရောက်စွာ index လုပ်နိုင်အောင် ကူညီပေးပါတယ်။

### Sitemap files (.xml)

သေးငယ်တဲ့ applications တွေအတွက် — `sitemap.xml` file တစ်ခု ဖန်တီးပြီး သင့် `app` directory ရဲ့ root မှာ ထားနိုင်ပါတယ်။

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### Code သုံးပြီး sitemap generate လုပ်ခြင်း (.js, .ts)

`sitemap.(js|ts)` file convention ကို သုံးပြီး — URLs တွေရဲ့ array တစ်ခုကို ပြန်ပေးတဲ့ default function ကို export လုပ်ခြင်းဖြင့် sitemap တစ်ခုကို programmatically **generate** လုပ်နိုင်ပါတယ်။ TypeScript သုံးရင် [`Sitemap`](#returns) type တစ်ခု ရနိုင်ပါတယ်။

> **သိထားသင့်သည်:** `sitemap.js` က special Route Handler တစ်ခုပါ — [Request-time API](https://nextjs.org/docs/app/glossary#request-time-apis) (သို့) [dynamic config](https://nextjs.org/docs/app/guides/caching-without-cache-components#dynamic) option မသုံးရင် default အားဖြင့် cache လုပ်ပါတယ်။

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
```

Output က အပေါ်က static `sitemap.xml` နဲ့ တူညီတဲ့ XML format ပဲ ဖြစ်ပါတယ်။

### Image Sitemaps

`images` property ကို သုံးပြီး image sitemaps တွေ ဖန်တီးနိုင်ပါတယ်။ အသေးစိတ်အတွက် [Google Developer Docs](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps) ကို ကြည့်ပါ။

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: '2021-01-01',
      changeFrequency: 'weekly',
      priority: 0.5,
      images: ['https://example.com/image.jpg'],
    },
  ]
}
```

Output XML မှာ `xmlns:image` namespace ပါဝင်ပြီး — url entry တစ်ခုစီအတွက် `<image:image>` tag တွေ ထုတ်ပေးပါတယ်။

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  <url>
    <loc>https://example.com</loc>
    <image:image>
      <image:loc>https://example.com/image.jpg</image:loc>
    </image:image>
    <lastmod>2021-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### Video Sitemaps

`videos` property ကို သုံးပြီး video sitemaps တွေ ဖန်တီးနိုင်ပါတယ်။ အသေးစိတ်အတွက် [Google Developer Docs](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps) ကို ကြည့်ပါ။

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: '2021-01-01',
      changeFrequency: 'weekly',
      priority: 0.5,
      videos: [
        {
          title: 'example',
          thumbnail_loc: 'https://example.com/image.jpg',
          description: 'this is the description',
        },
      ],
    },
  ]
}
```

Output XML မှာ `xmlns:video` namespace နဲ့ `<video:video>` tags တွေ ထုတ်ပေးပါတယ်။

### Localized Sitemap (alternates.languages)

ဘာသာစကားမျိုးစုံ ရှိတဲ့ site တွေအတွက် — `alternates.languages` ကို သုံးပြီး စာမျက်နှာတစ်ခုချင်းစီရဲ့ ဘာသာပြန် (hreflang) ဗားရှင်းတွေကို ညွှန်ပြနိုင်ပါတယ်။

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es',
          de: 'https://acme.com/de',
        },
      },
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/about',
          de: 'https://acme.com/de/about',
        },
      },
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/blog',
          de: 'https://acme.com/de/blog',
        },
      },
    },
  ]
}
```

Output XML မှာ `xmlns:xhtml` namespace ပါဝင်ပြီး — url entry တစ်ခုစီအတွက် `<xhtml:link rel="alternate" hreflang="..." />` tags တွေ ထုတ်ပေးပါတယ်။

### Sitemap အများအပြား generate လုပ်ခြင်း

Sitemap တစ်ခုတည်းက application အများစုအတွက် လုံလောက်ပါတယ်။ ဒါပေမယ့် — ကြီးမားတဲ့ web applications တွေအတွက်တော့ sitemap ကို file အများအပြားအဖြစ် ခွဲဖို့ လိုနိုင်ပါတယ်။

Sitemap အများအပြား ဖန်တီးဖို့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:

- Route segments အများအပြားအတွင်းမှာ `sitemap.(xml|js|ts)` တွေကို nested လုပ်ခြင်း — ဥပမာ `app/sitemap.xml` နဲ့ `app/products/sitemap.xml`။
- [`generateSitemaps`](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps) function ကို သုံးခြင်း။

ဥပမာ — `generateSitemaps` သုံးပြီး sitemap ကို ခွဲဖို့ sitemap ရဲ့ `id` ပါတဲ့ objects တွေရဲ့ array တစ်ခုကို ပြန်ပေးပြီး၊ `id` ကို သုံးပြီး unique sitemaps တစ်ခုချင်းစီကို generate လုပ်ပါ။

```ts
// app/product/sitemap.ts
import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

ဒီနည်းနဲ့ generate လုပ်ထားတဲ့ sitemaps တွေကို `/.../sitemap/[id].xml` မှာ ရနိုင်ပါတယ် — ဥပမာ `/product/sitemap/1.xml`။ အသေးစိတ်အတွက် [`generateSitemaps` API reference](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps) ကို ကြည့်ပါ။

## Returns

`sitemap.(xml|ts|js)` ကနေ export လုပ်ထားတဲ့ default function က အောက်ပါ properties တွေ ပါဝင်တဲ့ objects တွေရဲ့ array တစ်ခုကို ပြန်ပေးရပါမယ်:

```tsx
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
  alternates?: {
    languages?: Languages<string>
  }
  images?: string[]
  videos?: Videos[]
}>
```

## Version History

| Version    | အပြောင်းအလဲ                                            |
| ---------- | ----------------------------------------------------- |
| `v16.0.0`  | `id` က `string` တစ်ခုကို resolve လုပ်ပေးတဲ့ promise ဖြစ်လာ |
| `v14.2.0`  | Localizations (hreflang) support ထည့်သွင်း            |
| `v13.4.14` | Sitemaps တွေမှာ `changeFrequency` နဲ့ `priority` attributes တွေ ထည့်သွင်း |
| `v13.3.0`  | `sitemap` စတင် မိတ်ဆက်                                 |
