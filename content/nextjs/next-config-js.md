---
title: "next.config.js (Next.js ကို configure လုပ်ခြင်း)"
description: "next.config.js ဖြင့် Next.js application ကို configure လုပ်နည်း — default export, ECMAScript Modules (next.config.mjs), function/async function နဲ့ phase ပေါ်မူတည်တဲ့ configuration, TypeScript (next.config.ts) နဲ့ unit testing (experimental)"
order: 265
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js"
status: translated
updated: 2026-09-05
---

Next.js ကို သင့် project directory ရဲ့ root မှာ (ဥပမာ — `package.json` ဘေးမှာ) ရှိတဲ့ `next.config.js` file တစ်ခုကနေ — default export တစ်ခုနဲ့ configure လုပ်နိုင်ပါတယ်။

```js filename="next.config.js"
// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
}

module.exports = nextConfig
```

## ECMAScript Modules

`next.config.js` က JSON file မဟုတ်ဘဲ — သာမန် Node.js module တစ်ခု ဖြစ်ပါတယ်။ ၎င်းကို Next.js server နဲ့ build phases တွေမှာ အသုံးပြုပြီး — browser build ထဲမှာတော့ မပါဝင်ပါဘူး။

[ECMAScript modules](https://nodejs.org/api/esm.html) လိုအပ်ရင် `next.config.mjs` ကို သုံးနိုင်ပါတယ်:

```js filename="next.config.mjs"
// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
}

export default nextConfig
```

> **သိထားသင့်သည်**: `.cjs` (သို့) `.cts` extension တွေနဲ့ `next.config` ကို လက်ရှိမှာ **မထောက်ပံ့ပါဘူး**။

## Function အနေနဲ့ Configuration လုပ်ခြင်း (Configuration as a Function)

Function တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်:

```js filename="next.config.mjs"
// @ts-check

export default (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    /* config options here */
  }
  return nextConfig
}
```

### Async Configuration (ပြိုင်တူ ဆောင်ရွက်သော Configuration)

Next.js 12.1.0 ကစပြီး — async function တစ်ခုကို သုံးနိုင်ပါတယ်:

```js filename="next.config.js"
// @ts-check

module.exports = async (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    /* config options here */
  }
  return nextConfig
}
```

### Phase

`phase` က configuration ကို load လုပ်နေတဲ့ လက်ရှိ context (ကာလအခြေအနေ) ဖြစ်ပါတယ်။ [ရနိုင်တဲ့ phases](https://github.com/vercel/next.js/blob/5e6b008b561caf2710ab7be63320a3d549474a5b/packages/next/shared/lib/constants.ts#L19-L23) တွေကို ကြည့်နိုင်ပါတယ်။ Phases တွေကို `next/constants` ကနေ import လုပ်နိုင်ပါတယ်:

```js filename="next.config.js"
// @ts-check

const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* development only config options here */
    }
  }

  return {
    /* config options for all phases except development here */
  }
}
```

## TypeScript

သင့် project မှာ TypeScript သုံးနေတယ်ဆိုရင် — configuration ထဲမှာ TypeScript သုံးဖို့ `next.config.ts` ကို သုံးနိုင်ပါတယ်:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}

export default nextConfig
```

Comment လုပ်ထားတဲ့ (ရေးချ မထားတဲ့) lines တွေက `next.config.js` က ခွင့်ပြုထားတဲ့ configs တွေ ထည့်လို့ရတဲ့ နေရာတွေ ဖြစ်ပြီး — [ဒီ file ထဲမှာ သတ်မှတ်ထားပါတယ်](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/config-shared.ts)။

ဒါပေမယ့် — configs တွေထဲက ဘယ်ဟာမှ မဖြစ်မနေ လိုအပ်တာ မဟုတ်သလို — config တစ်ခုချင်းစီက ဘာလုပ်လဲ နားလည်ထားဖို့လည်း မလိုပါဘူး။ အဲဒီအစား — ဒီ section ထဲမှာ သင် enable (သို့) ပြုပြင်ချင်တဲ့ features တွေကို ရှာကြည့်ပါ — ဘယ်လို လုပ်ရမလဲ ဖော်ပြပေးပါလိမ့်မယ်။

> သင့် target Node.js version မှာ မရနိုင်တဲ့ JavaScript features အသစ်တွေကို သုံးတာ ရှောင်ပါ။ `next.config.js` ကို Webpack (သို့) Babel က parse (ခွဲခြမ်းစိတ်ဖြာ) လုပ်မှာ မဟုတ်ပါဘူး။

ဒီ page က ရနိုင်တဲ့ configuration options အားလုံးကို မှတ်တမ်းပြုထားပါတယ်:

## Unit Testing (experimental — စမ်းသပ်ဆဲ)

Next.js 15.1 ကစပြီး — `next/experimental/testing/server` package ထဲမှာ `next.config.js` files တွေကို unit test လုပ်ဖို့ ကူညီပေးတဲ့ utilities တွေ ပါဝင်ပါတယ်။

`unstable_getResponseFromNextConfig` function က `next.config.js` ထဲက [`headers`](/docs/nextjs/next-config-headers), [`redirects`](/docs/nextjs/next-config-redirects) နဲ့ [`rewrites`](/docs/nextjs/next-config-rewrites) functions တွေကို — ပေးထားတဲ့ request information နဲ့အတူ run လုပ်ပြီး — routing ရဲ့ ရလဒ်တွေပါတဲ့ `NextResponse` တစ်ခုကို ပြန်ပေးပါတယ်။

> `unstable_getResponseFromNextConfig` ကနေ ရတဲ့ response က `next.config.js` ထဲက fields တွေကိုပဲ ထည့်သွင်း စဉ်းစားပြီး — proxy (သို့) filesystem routes တွေကို မစဉ်းစားတာမို့ — production မှာ ရလဒ်က unit test နဲ့ မတူညီနိုင်ပါဘူး။

```js
import {
  getRedirectUrl,
  unstable_getResponseFromNextConfig,
} from 'next/experimental/testing/server'

const response = await unstable_getResponseFromNextConfig({
  url: 'https://nextjs.org/test',
  nextConfig: {
    async redirects() {
      return [{ source: '/test', destination: '/test2', permanent: false }]
    },
  },
})
expect(response.status).toEqual(307)
expect(getRedirectUrl(response)).toEqual('https://nextjs.org/test2')
```
