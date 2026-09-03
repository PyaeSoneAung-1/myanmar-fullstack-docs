---
title: "Sass ကို ဘယ်လို သုံးမလဲ (Using Sass)"
description: "Next.js မှာ Sass သုံးနည်း — sass package install လုပ်ခြင်း၊ .scss/.sass extensions တွေနဲ့ CSS Modules (.module.scss/.module.sass)၊ sassOptions (additionalData, implementation) customize လုပ်ခြင်းနဲ့ CSS Module files တွေကနေ Sass variables export လုပ်ခြင်း"
order: 115
source: "https://nextjs.org/docs/app/guides/sass"
status: translated
updated: 2026-09-03
---

Next.js မှာ [`sass`](https://github.com/sass/sass) package ကို install လုပ်ပြီးတာနဲ့ — `.scss` ရော `.sass` extensions နှစ်ခုလုံးအတွက် built-in support ရှိပါတယ်။ Component-level Sass ကို CSS Modules နဲ့ `.module.scss` (သို့) `.module.sass` extension တွေကတစ်ဆင့်လည်း သုံးနိုင်ပါတယ်။

ပထမဆုံး [`sass`](https://github.com/sass/sass) ကို install လုပ်ပါ:

```bash package="pnpm"
pnpm add -D sass
```

```bash package="npm"
npm install --save-dev sass
```

```bash package="yarn"
yarn add -D sass
```

```bash package="bun"
bun add -D sass
```

> **Good to know**:
>
> Sass မှာ [syntax နှစ်မျိုး](https://sass-lang.com/documentation/syntax) ကို ထောက်ပံ့ထားပြီး — တစ်မျိုးချင်းစီမှာ ကိုယ်ပိုင် extension တွေ ရှိပါတယ်။
> `.scss` extension က [SCSS syntax](https://sass-lang.com/documentation/syntax#scss) ကို သုံးဖို့ လိုအပ်ပြီး၊
> `.sass` extension ကတော့ [Indented Syntax ("Sass")](https://sass-lang.com/documentation/syntax#the-indented-syntax) ကို သုံးဖို့ လိုအပ်ပါတယ်။
>
> ဘယ်ဟာကို ရွေးရမှန်း မသေချာရင် — `.scss` extension နဲ့ စပါ။ သူက CSS ရဲ့ superset ဖြစ်ပြီး Indented Syntax ("Sass") ကို သင်ယူစရာ မလိုပါဘူး။

### Sass Options တွေကို customize လုပ်ခြင်း (Customizing Sass Options)

Sass options တွေကို configure လုပ်ချင်ရင် `next.config` ထဲမှာ `sassOptions` ကို သုံးပါ။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `$var: red;`,
  },
}

export default nextConfig
```

```js filename="next.config.js"
/** @type {import('next').NextConfig} */

const nextConfig = {
  sassOptions: {
    additionalData: `$var: red;`,
  },
}

module.exports = nextConfig
```

#### Implementation (အကောင်အထည်ဖော်မှု)

Sass implementation တစ်ခုကို သတ်မှတ်ဖို့ `implementation` property ကို သုံးနိုင်ပါတယ်။ ပုံမှန်အားဖြင့် Next.js က [`sass`](https://www.npmjs.com/package/sass) package ကို သုံးပါတယ်။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: 'sass-embedded',
  },
}

export default nextConfig
```

```js filename="next.config.js"
/** @type {import('next').NextConfig} */

const nextConfig = {
  sassOptions: {
    implementation: 'sass-embedded',
  },
}

module.exports = nextConfig
```

### Sass Variables

Next.js က CSS Module files တွေကနေ export လုပ်ထားတဲ့ Sass variables တွေကို ထောက်ပံ့ပေးပါတယ်။

ဥပမာ — export လုပ်ထားတဲ့ `primaryColor` Sass variable ကို သုံးတာပါ:

```scss filename="app/variables.module.scss"
$primary-color: #64ff00;

:export {
  primaryColor: $primary-color;
}
```

```jsx filename="app/page.js"
// maps to root `/` URL

import variables from './variables.module.scss'

export default function Page() {
  return <h1 style={{ color: variables.primaryColor }}>Hello, Next.js!</h1>
}
```
