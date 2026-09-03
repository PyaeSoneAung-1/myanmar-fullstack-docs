---
title: "mdxRs (Rust compiler ဖြင့် MDX compile လုပ်ခြင်း)"
description: "mdxRs option — experimental; `@next/mdx` နှင့် တွဲ၍ Rust compiler အသစ်ဖြင့် MDX files များကို compile လုပ်ရန် သတ်မှတ်ချက်"
order: 157
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/mdxRs"
status: translated
updated: 2026-09-03
---

`@next/mdx` နဲ့ တွဲပြီး experimental အဖြစ် သုံးရန် ဖြစ်ပါတယ်။ ဒီ option က Rust compiler အသစ်ကို သုံးပြီး MDX files တွေကို compile လုပ်ပါတယ်။

```js filename="next.config.js"
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },
}

module.exports = withMDX(nextConfig)
```
