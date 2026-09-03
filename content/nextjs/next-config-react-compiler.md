---
title: "reactCompiler (React Compiler ဖွင့်ရန် သတ်မှတ်ချက်)"
description: "reactCompiler option — React Compiler ဖြင့် component rendering များကို အလိုအလျောက် optimize လုပ်ရန် ဖွင့်ပေးခြင်း; babel-plugin-react-compiler install လိုအပ်; SWC-based optimization ဖြင့် build မြန်စေ; compilationMode: 'annotation' ('use memo'/'use no memo') ပံ့ပိုး"
order: 213
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler"
status: translated
updated: 2026-09-03
---

Next.js မှာ [React Compiler](https://react.dev/learn/react-compiler/introduction) အတွက် ပံ့ပိုးမှု ပါဝင်ပါတယ် — component rendering တွေကို အလိုအလျောက် optimize လုပ်ပြီး performance တိုးတက်စေဖို့ ဒီဇိုင်းထုတ်ထားတဲ့ tool တစ်ခုပါ။ ဒါက `useMemo` နဲ့ `useCallback` သုံးပြီး manual memoization လုပ်နေရတာတွေကို လျှော့ချပေးပါတယ်။

Next.js မှာ React Compiler ကို ပိုထိရောက်စေဖို့ SWC နဲ့ ရေးထားတဲ့ custom performance optimization တစ်ခုလည်း ပါဝင်ပါတယ်။ Compiler ကို file တိုင်းမှာ run မယ့်အစား — Next.js က သင့် project ကို ခွဲခြမ်းစိတ်ဖြာပြီး React Compiler ကို သက်ဆိုင်ရာ files တွေမှာပဲ သုံးပါတယ်။ ဒါက Babel plugin ကို တစ်ခုတည်း သုံးတာထက် အလုပ်အပိုတွေ ရှောင်နိုင်ပြီး build တွေ ပိုမြန်စေပါတယ်။

## ဘယ်လို အလုပ်လုပ်လဲ (How It Works)

React Compiler က Babel plugin တစ်ခုကနေ run ပါတယ်။ Build တွေ မြန်နေစေဖို့ — Next.js က custom SWC optimization ကို သုံးပြီး React Compiler ကို JSX (သို့) React Hooks ပါတဲ့ file တွေလိုမျိုး — သက်ဆိုင်ရာ files တွေမှာပဲ သုံးပါတယ်။

ဒါက အရာအားလုံးကို compile လုပ်တာကို ရှောင်ပြီး performance cost ကို အနည်းဆုံး ဖြစ်အောင် ထားပါတယ်။ Default Rust-based compiler နဲ့ ယှဉ်ရင် build တွေ နည်းနည်း နှေးနေတာ သတိထားမိနိုင်ပေမယ့် — impact က သေးငယ်ပြီး သီးသန့် နေရာလေးမှာပဲ ဖြစ်ပါတယ်။

သုံးဖို့ဆို `babel-plugin-react-compiler` ကို install လုပ်ပါ:

```bash package="pnpm"
pnpm add -D babel-plugin-react-compiler
```

```bash package="npm"
npm install -D babel-plugin-react-compiler
```

```bash package="yarn"
yarn add -D babel-plugin-react-compiler
```

```bash package="bun"
bun add -D babel-plugin-react-compiler
```

ပြီးရင် `next.config.js` ထဲမှာ `reactCompiler` option ကို ထည့်ပါ:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
}

module.exports = nextConfig
```

## Annotations (annotation mode ဖြင့် opt-in လုပ်ခြင်း)

Compiler ကို "opt-in" mode နဲ့ run ဖို့ — အောက်ပါအတိုင်း configure လုပ်နိုင်ပါတယ်:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: {
    compilationMode: 'annotation',
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: {
    compilationMode: 'annotation',
  },
}

module.exports = nextConfig
```

ပြီးရင် React ရဲ့ `"use memo"` directive နဲ့ သီးခြား components (သို့) hooks တွေကို annotate လုပ်ပြီး opt-in လုပ်နိုင်ပါတယ်:

```ts filename="app/page.tsx" switcher
export default function Page() {
  'use memo'
  // ...
}
```

```js filename="app/page.js" switcher
export default function Page() {
  'use memo'
  // ...
}
```

> **မှတ်ချက်:** ဆန့်ကျင်ဘက် အာနိသင်အတွက် — component (သို့) hook တစ်ခုကို opt-out လုပ်ဖို့ React ရဲ့ `"use no memo"` directive ကိုလည်း သုံးနိုင်ပါတယ်။
