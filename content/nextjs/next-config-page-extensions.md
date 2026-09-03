---
title: "pageExtensions (page extensions သတ်မှတ်ချက်)"
description: "pageExtensions option — Next.js က page များအတွက် လက်ခံသော file extensions (.tsx, .ts, .jsx, .js) စာရင်းကို တိုးချဲ့/ပြုပြင်ရန် သတ်မှတ်ချက်; markdown (.md, .mdx) ကဲ့သို့ အခြား extensions များ ထည့်နိုင်"
order: 166
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/pageExtensions"
status: translated
updated: 2026-09-03
---

Default အားဖြင့် Next.js က အောက်ပါ extensions တွေပါတဲ့ files တွေကို လက်ခံပါတယ်: `.tsx`, `.ts`, `.jsx`, `.js`။ ဒါကို markdown (`.md`, `.mdx`) လို အခြား extensions တွေ ခွင့်ပြုနိုင်အောင် ပြုပြင်နိုင်ပါတယ်။

```js filename="next.config.js"
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

module.exports = withMDX(nextConfig)
```
