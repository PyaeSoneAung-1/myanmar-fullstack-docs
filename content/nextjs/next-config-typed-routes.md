---
title: "typedRoutes (statically typed links)"
description: "typedRoutes option — routes များအတွက် statically typed links ပံ့ပိုးမှု ဖွင့်ရန် သတ်မှတ်ချက်; TypeScript လိုအပ်"
order: 94
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/typedRoutes"
status: translated
updated: 2026-09-02
---

> **မှတ်ချက်:** ဒီ option က stable အဖြစ် သတ်မှတ်ထားပြီးပြီ — ဒါကြောင့် `experimental.typedRoutes` အစား `typedRoutes` ကို သုံးသင့်ပါတယ်။

[Statically typed links](https://nextjs.org/docs/app/api-reference/config/typescript#statically-typed-links) အတွက် ပံ့ပိုးမှုပါ။ ဒီ feature က သင့် project ထဲမှာ TypeScript သုံးဖို့ လိုအပ်ပါတယ်။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
}

module.exports = nextConfig
```
