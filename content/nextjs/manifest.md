---
title: "manifest.json (web app manifest သတ်မှတ်ခြင်း)"
description: "manifest.(json|webmanifest) file convention — `app` directory root မှာ static file ထည့်ခြင်း (သို့) manifest.js|ts နဲ့ Manifest object ပြန်ပေးခြင်းဖြင့် browser အတွက် web application manifest သတ်မှတ်နည်း"
order: 51
source: "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest"
status: translated
updated: 2026-09-02
---

`app` directory ရဲ့ **root** မှာ [Web Manifest Specification](https://developer.mozilla.org/docs/Web/Manifest) နဲ့ ကိုက်ညီတဲ့ `manifest.(json|webmanifest)` file တစ်ခုကို ထည့်ခြင်း (သို့) generate လုပ်ခြင်းဖြင့် — သင့် web application အကြောင်း အချက်အလက်တွေ (app name, icons, start URL စသည်) ကို browser ကို ပေးနိုင်ပါတယ်။

## Static manifest file

```json
// app/manifest.json | app/manifest.webmanifest
{
  "name": "My Next.js Application",
  "short_name": "Next.js App",
  "description": "An application built with Next.js",
  "start_url": "/"
  // ...
}
```

## Manifest file generate လုပ်ခြင်း

[`Manifest` object](#manifest-object) တစ်ခု ပြန်ပေးတဲ့ `manifest.js` (သို့) `manifest.ts` file တစ်ခု ထည့်ပါ။

> **သိထားသင့်သည်:** `manifest.js` က special Route Handler တစ်ခုပါ — [Request-time API](https://nextjs.org/docs/app/glossary#request-time-apis) (သို့) [dynamic config](https://nextjs.org/docs/app/guides/caching-without-cache-components#dynamic) option ကို မသုံးရင် default အားဖြင့် cache လုပ်ပါတယ်။

```ts
// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js App',
    short_name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

JavaScript project တွေမှာ TypeScript type import မလိုဘဲ object တစ်ခုကို တိုက်ရိုက် ပြန်ပေးရုံပါပဲ — ဥပမာ `export default function manifest() { return { ... } }` ပုံစံပါ။

### Manifest object

Manifest object မှာ option များစွာ ပါဝင်ပြီး — web standards အသစ်တွေကြောင့် အချိန်နဲ့အမျှ ထပ်တိုးပြောင်းလဲနိုင်ပါတယ်။ လက်ရှိ option အားလုံးအကြောင်း သိချင်ရင် — [TypeScript](https://nextjs.org/docs/app/api-reference/config/typescript#ide-plugin) သုံးထားရင် code editor ထဲက `MetadataRoute.Manifest` type ကို ကြည့်ပါ (သို့) [MDN docs](https://developer.mozilla.org/docs/Web/Manifest) ကို ဖတ်ပါ။
