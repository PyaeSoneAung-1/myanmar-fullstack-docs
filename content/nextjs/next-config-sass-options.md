---
title: "sassOptions (Sass compiler သတ်မှတ်ချက်)"
description: "sassOptions option — Sass compiler (ဥပမာ additionalData, implementation) ကို configure လုပ်ရန် သတ်မှတ်ချက်များ; functions property သည် webpack တွင်သာ ရနိုင်"
order: 99
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/sassOptions"
status: translated
updated: 2026-09-02
---

`sassOptions` က Sass compiler ကို configure လုပ်နိုင်စေပါတယ်။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const sassOptions = {
  additionalData: `
    $var: red;
  `,
}

const nextConfig: NextConfig = {
  sassOptions: {
    ...sassOptions,
    implementation: 'sass-embedded',
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */

const sassOptions = {
  additionalData: `
    $var: red;
  `,
}

const nextConfig = {
  sassOptions: {
    ...sassOptions,
    implementation: 'sass-embedded',
  },
}

module.exports = nextConfig
```

> **သိထားသင့်သည်:**
>
> - `implementation` ကလွဲရင် `sassOptions` တွေကို typed မလုပ်ထားပါဘူး — ဘာလို့လဲဆိုတော့ Next.js က အခြား ဖြစ်နိုင်တဲ့ properties တွေကို ထိန်းသိမ်း မထားလို့ပါ။
> - Custom Sass functions တွေ သတ်မှတ်ဖို့အတွက် `functions` property ကို webpack နဲ့ပဲ ထောက်ပံ့ပါတယ်။ Turbopack သုံးတဲ့အခါ custom Sass functions တွေ မရနိုင်ပါဘူး — ဘာလို့လဲဆိုတော့ Turbopack ရဲ့ Rust-based architecture က ဒီ option ကနေ ပို့လိုက်တဲ့ JavaScript functions တွေကို တိုက်ရိုက် execute လုပ်လို့ မရလို့ပါ။
