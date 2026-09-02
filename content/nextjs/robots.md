---
title: "robots.txt (search engine crawlers ထိန်းချုပ်ခြင်း)"
description: "robots.txt — `app` directory root မှာ static file ထည့်ခြင်း (သို့) robots.js|ts နဲ့ Robots object ပြန်ပေးခြင်းဖြင့် search engine crawlers တွေ ဘယ် URL တွေကို ဝင်ရောက်လို့ရမလဲ သတ်မှတ်နည်း"
order: 49
source: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots"
status: translated
updated: 2026-09-02
---

`app` directory ရဲ့ **root** မှာ [Robots Exclusion Standard](https://en.wikipedia.org/wiki/Robots.txt#Standard) နဲ့ ကိုက်ညီတဲ့ `robots.txt` file တစ်ခု ထည့်ပြီး — search engine crawlers တွေ သင့် site ပေါ်က ဘယ် URL တွေကို ဝင်ရောက်လို့ရမလဲ ဆိုတာကို ပြောပြနိုင်ပါတယ်။

## Static `robots.txt`

`app/robots.txt` file ရဲ့ content အနေနဲ့ အောက်ပါအတိုင်း ရေးနိုင်ပါတယ်:

```txt
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

## Robots file generate လုပ်ခြင်း

[`Robots` object](#robots-object) တစ်ခု ပြန်ပေးတဲ့ `robots.js` (သို့) `robots.ts` file ကို ထည့်ပါ။

> **သိထားသင့်သည်:** `robots.js` က special Route Handler တစ်ခုပါ — [Request-time API](https://nextjs.org/docs/app/glossary#request-time-apis) (သို့) [dynamic config](https://nextjs.org/docs/app/guides/caching-without-cache-components#dynamic) option ကို မသုံးရင် default အားဖြင့် cache လုပ်ပါတယ်။

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

JavaScript project တွေမှာ TypeScript type import မလိုဘဲ object တစ်ခုကို တိုက်ရိုက် ပြန်ပေးရုံပါပဲ။ Output က အောက်ပါအတိုင်း ထုတ်ပေးပါတယ်:

```txt
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

### သီးခြား user agents တွေအတွက် customize လုပ်ခြင်း

Search engine bot တစ်ခုချင်းစီအလိုက် crawl လုပ်ပုံ ကွဲပြားအောင် — `rules` property မှာ user agents တွေရဲ့ array တစ်ခုကို ပေးနိုင်ပါတယ်။ ဥပမာ:

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: '/private/',
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        disallow: ['/'],
      },
    ],
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

Output:

```txt
User-Agent: Googlebot
Allow: /
Disallow: /private/

User-Agent: Applebot
Disallow: /

User-Agent: Bingbot
Disallow: /

Sitemap: https://acme.com/sitemap.xml
```

### Non-standard directives (စံမဟုတ်သော ညွှန်ကြားချက်များ)

Search engine အချို့က [Robots Exclusion Standard](https://en.wikipedia.org/wiki/Robots.txt#Standard) ထဲမှာ မပါတဲ့ directives တွေကို ထောက်ပံ့ပါတယ် — ဥပမာ `Request-Rate` (Seznam) (သို့) `Clean-param` (Yandex)။ ဒါတွေကို rule ရဲ့ `other` field ကနေ ပို့နိုင်ပါတယ်။ Keys တွေက သူတို့ရဲ့ casing အတိုင်း ထိန်းသိမ်းထားပြီး — array values တွေက entry တစ်ခုစီအတွက် rule ရဲ့ `User-Agent` block အောက်မှာ စာကြောင်းတစ်ကြောင်းစီ ထုတ်ပေးပါတယ်။

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: 'SeznamBot',
        allow: '/',
        other: {
          'Request-Rate': '10/1m',
        },
      },
    ],
  }
}
```

Output:

```txt
User-Agent: *
Allow: /

User-Agent: SeznamBot
Allow: /
Request-Rate: 10/1m
```

> **သိထားသင့်သည်:** `other` ထဲက values တွေကို မူရင်းအတိုင်း (verbatim) ထည့်ပေးပါတယ် — directive name/value တွေကို Next.js က validate မလုပ်ပါဘူး။ ဒါကြောင့် အတိအကျ syntax အတွက် သက်ဆိုင်ရာ search engine ရဲ့ documentation ကို ကိုးကားပါ။

## Robots object

```tsx
type Robots = {
  rules:
    | {
        userAgent?: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
        other?: Record<string, string | number | Array<string | number>>
      }
    | Array<{
        userAgent: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
        other?: Record<string, string | number | Array<string | number>>
      }>
  sitemap?: string | string[]
  host?: string
}
```

## Version History

| Version   | အပြောင်းအလဲ                                              |
| --------- | ------------------------------------------------------- |
| `v16.3.0` | Agent တစ်ခုချင်းစီအတွက် non-standard directives ရဖို့ `other` field ထည့်သွင်း |
| `v13.3.0` | `robots` စတင် မိတ်ဆက်                                   |
