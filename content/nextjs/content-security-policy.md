---
title: "Content Security Policy (CSP) သတ်မှတ်ခြင်း"
description: "CSP (Content Security Policy) — cross-site scripting (XSS), clickjacking စတဲ့ code injection attacks တွေကနေ Next.js application ကို ကာကွယ်ဖို့ policy သတ်မှတ်နည်း; nonce ထည့်သွင်းခြင်း (Proxy ဖြင့်)၊ dynamic rendering လိုအပ်ချက်၊ SRI (Subresource Integrity) နဲ့ troubleshooting အကြောင်း"
order: 233
source: "https://nextjs.org/docs/app/guides/content-security-policy"
status: translated
updated: 2026-09-03
---

[Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP) က သင့် Next.js application ကို cross-site scripting (XSS), clickjacking, နဲ့ တခြား code injection attacks တွေလို လုံခြုံရေး ခြိမ်းခြောက်မှု အမျိုးမျိုးကနေ ကာကွယ်ဖို့ အရေးကြီးပါတယ်။

CSP ကို သုံးခြင်းအားဖြင့် developer တွေက content sources, scripts, stylesheets, images, fonts, objects, media (audio, video), iframes စတာတွေအတွက် — ဘယ် origins (ရင်းမြစ်များ) တွေကို ခွင့်ပြုမလဲ သတ်မှတ်နိုင်ပါတယ်။

<details>
  <summary>ဥပမာများ (Examples)</summary>

- [Strict CSP](https://github.com/vercel/next.js/tree/canary/examples/with-strict-csp)

</details>

## Nonces (nonce ထည့်သွင်း အသုံးပြုခြင်း)

A [nonce](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/nonce) ဆိုတာ — တစ်ကြိမ်တည်း အသုံးပြုဖို့အတွက် ဖန်တီးထားတဲ့ ထူးခြားပြီး ကျပန်း (random) ဖြစ်တဲ့ စာလုံးတန်း (string) တစ်ခုပါ။ သူ့ကို CSP နဲ့ တွဲသုံးပြီး — တင်းကျပ်တဲ့ CSP directives တွေကို ကျော်လွန်၍ — တချို့သော inline scripts (သို့) styles တွေကိုပဲ ရွေးချယ်ပြီး run ခွင့်ပြုပါတယ်။

### ဘာကြောင့် nonce သုံးသလဲ (Why use a nonce?)

CSP က attacks တွေကို ကာကွယ်ဖို့ — inline ရော external scripts တွေကိုပါ block လုပ်နိုင်ပါတယ်။ Nonce ကတော့ သတ်မှတ်ထားတဲ့ scripts တချို့ကို — သူတို့မှာ ကိုက်ညီတဲ့ nonce value ပါမှသာ — ဘေးကင်းစွာ run ခွင့်ပြုပါတယ်။

Attacker တစ်ယောက်က သင့် page ထဲကို script တစ်ခု ထည့်သွင်းချင်ရင် — သူဟာ nonce value ကို မှန်းဆ (guess) နိုင်ဖို့ လိုပါတယ်။ ဒါကြောင့် nonce က request တိုင်းအတွက် ကြိုတင် ခန့်မှန်းလို့ မရနိုင်တဲ့ (unpredictable) ပြီး ထူးခြားတဲ့ (unique) တန်ဖိုး ဖြစ်ရပါမယ်။

### Proxy နဲ့ nonce ထည့်သွင်းခြင်း (Adding a nonce with Proxy)

[Proxy](/docs/nextjs/file-conventions-proxy) က page ကို render မလုပ်ခင် — headers တွေ ထည့်သွင်းနိုင်ပြီး nonces တွေ ထုတ်ပေးနိုင်အောင် လုပ်ပေးပါတယ်။

Page တစ်ခုကို ကြည့်ရှုလိုက်တိုင်း — nonce အသစ်တစ်ခု ထုတ်ပေးသင့်ပါတယ်။ ဆိုလိုတာက nonces တွေ ထည့်သွင်းဖို့ — **[dynamic rendering](https://nextjs.org/docs/app/glossary#dynamic-rendering) ကို သေချာပေါက် သုံးရပါမယ်**။

ဥပမာ:

> **သိထားသင့်သည်:** Development မှာ `'unsafe-eval'` လိုအပ်ပါတယ် — ဘာကြောင့်လဲဆိုတော့ React က server-side error stacks တွေကို browser ထဲမှာ ပြန်လည် တည်ဆောက်ပြသခြင်းလို — ပိုကောင်းတဲ့ debugging information တွေ ပေးဖို့ `eval` ကို သုံးလို့ပါ။ Production အတွက်တော့ `unsafe-eval` မလိုအပ်ပါဘူး။ React ရော Next.js ရော — default အနေနဲ့ production မှာ `eval` ကို မသုံးပါဘူး။

```ts filename="proxy.ts" switcher
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  return response
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  return response
}
```

Default အနေနဲ့ Proxy က requests အားလုံးပေါ်မှာ run ပါတယ်။ [`matcher`](/docs/nextjs/file-conventions-proxy#matcher) ကို သုံးပြီး — Proxy ကို သတ်မှတ်ထားတဲ့ paths တွေပေါ်မှာပဲ run အောင် စစ်ထုတ် (filter) လုပ်နိုင်ပါတယ်။

`next/link` ကနေ လာတဲ့ ကိုက်ညီနေတဲ့ (matching) prefetches နဲ့ — CSP header မလိုအပ်တဲ့ static assets တွေကို ချန်လှပ်ထားဖို့ အကြံပြုပါတယ်။

```ts filename="proxy.ts" switcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

```js filename="proxy.js" switcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

### Next.js မှာ nonces အလုပ်လုပ်ပုံ (How nonces work in Next.js)

Nonce သုံးဖို့ဆိုရင် — သင့် page က **dynamically render** လုပ်ရပါမယ်။ ဘာကြောင့်လဲဆိုတော့ Next.js က nonces တွေကို **server-side rendering** ကာလအတွင်းမှာ — request ထဲမှာ ပါဝင်တဲ့ CSP header ကို အခြေခံပြီး ထည့်ပေးလို့ပါ။ Static pages တွေက build time မှာ ထုတ်လုပ်တာမို့ — အဲဒီအချိန်မှာ request headers ရော response headers ရော မရှိသေးပါဘူး — ဒါကြောင့် nonce ကို ထည့်သွင်းလို့ မရနိုင်ပါဘူး။

Dynamically rendered page တစ်ခုမှာ nonce support အလုပ်လုပ်ပုံက ဒီလိုပါ:

1. **Proxy က nonce တစ်ခု ထုတ်ပေးသည်**: သင့် proxy က request အတွက် ထူးခြားတဲ့ nonce တစ်ခု ဖန်တီးပြီး — သင့် `Content-Security-Policy` header ထဲကို ထည့်ကာ — custom `x-nonce` header တစ်ခုထဲမှာလည်း သတ်မှတ်ပေးပါတယ်။
2. **Next.js က nonce ကို ထုတ်ယူသည်**: Rendering ကာလအတွင်း Next.js က `Content-Security-Policy` header ကို parse လုပ်ပြီး — `'nonce-{value}'` pattern ကို သုံးကာ nonce ကို ထုတ်ယူပါတယ်။
3. **Nonce ကို အလိုအလျောက် သက်ရောက်စေသည်**: Next.js က nonce ကို အောက်ပါတို့မှာ ထည့်ပေးပါတယ်:
   - Framework scripts (React, Next.js runtime)
   - Page တစ်ခုချင်းစီအတွက် JavaScript bundles
   - Next.js က ထုတ်လုပ်တဲ့ inline styles နဲ့ scripts
   - `nonce` prop ကို သုံးထားတဲ့ `<Script>` components တွေ

ဒီလို အလိုအလျောက် လုပ်ဆောင်ပေးတာမို့ — tag တစ်ခုချင်းစီဆီ nonce ကို ကိုယ်တိုင် ထည့်စရာ မလိုပါဘူး။

### Dynamic rendering ကို အတင်းအကျပ် သုံးစေခြင်း (Forcing dynamic rendering)

Nonces သုံးနေရင် — pages တွေကို dynamic rendering ထဲ အတိအကျ (explicitly) ထည့်သွင်းဖို့ လိုအပ်နိုင်ပါတယ်:

```tsx filename="app/page.tsx" switcher
import { connection } from 'next/server'

export default async function Page() {
  // wait for an incoming request to render this page
  await connection()
  // Your page content
}
```

```jsx filename="app/page.jsx" switcher
import { connection } from 'next/server'

export default async function Page() {
  // wait for an incoming request to render this page
  await connection()
  // Your page content
}
```

### Nonce ကို ဖတ်ယူခြင်း (Reading the nonce)

Nonce ကို [Server Component](/docs/nextjs/server-client-components) တစ်ခုထဲကနေ [`headers`](/docs/nextjs/headers) ကို သုံးပြီး ဖတ်နိုင်ပါတယ်:

```tsx filename="app/page.tsx" switcher
import { headers } from 'next/headers'
import Script from 'next/script'

export default async function Page() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js"
      strategy="afterInteractive"
      nonce={nonce}
    />
  )
}
```

```jsx filename="app/page.jsx" switcher
import { headers } from 'next/headers'
import Script from 'next/script'

export default async function Page() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js"
      strategy="afterInteractive"
      nonce={nonce}
    />
  )
}
```

## Static vs Dynamic Rendering (CSP နဲ့အတူ)

Nonces သုံးခြင်းက — သင့် Next.js application ရဲ့ rendering ပုံစံအပေါ် အရေးပါတဲ့ သက်ရောက်မှုတွေ ရှိပါတယ်:

### Dynamic Rendering လိုအပ်ချက်

သင့် CSP ထဲမှာ nonces သုံးတဲ့အခါ — **pages အားလုံး dynamically render လုပ်ရပါမယ်**။ ဆိုလိုတာက:

- Pages တွေက အောင်မြင်စွာ build ဖြစ်ပေမယ့် — dynamic rendering အတွက် မှန်ကန်စွာ configure မလုပ်ထားရင် runtime errors တွေ ကြုံရနိုင်ပါတယ်
- Request တစ်ခုစီက — nonce အသစ်တစ်ခုနဲ့ page အသစ်တစ်ခုကို ထုတ်ပေးပါတယ်
- Static optimization နဲ့ Incremental Static Regeneration (ISR) တွေက disable ဖြစ်သွားပါတယ်
- နောက်ထပ် configuration မပါဘဲ — pages တွေကို CDNs တွေမှာ cache လုပ်လို့ မရပါဘူး
- **Partial Prerendering (PPR) က nonce-based CSP နဲ့ မလိုက်ဖက်ပါဘူး** — static shell ရဲ့ scripts တွေက nonce ကို ဝင်ရောက်ခွင့် မရှိလို့ပါ

### Performance အပေါ် သက်ရောက်မှုများ (Performance Implications)

Static ကနေ dynamic rendering ကို ပြောင်းလိုက်တာက performance အပေါ် သက်ရောက်မှု ရှိပါတယ်:

- **ကနဦး page loads တွေ ပိုနှေးခြင်း**: Pages တွေကို request တိုင်းမှာ ထုတ်လုပ်ရပါတယ်
- **Server load များလာခြင်း**: Request တိုင်းအတွက် server-side rendering လိုအပ်ပါတယ်
- **CDN caching မရှိခြင်း**: Dynamic pages တွေကို default အနေနဲ့ edge မှာ cache လုပ်လို့ မရပါဘူး
- **Hosting စရိတ် ပိုများခြင်း**: Dynamic rendering အတွက် server resources တွေ ပိုလိုအပ်ပါတယ်

### Nonces ကို ဘယ်အချိန် သုံးမလဲ (When to use nonces)

ဒီအခြေအနေတွေမှာ nonces သုံးဖို့ စဉ်းစားပါ:

- `'unsafe-inline'` ကို တားမြစ်ထားတဲ့ တင်းကျပ်တဲ့ လုံခြုံရေး လိုအပ်ချက်တွေ ရှိတဲ့အခါ
- သင့် application က ထိလွယ်ရှလွယ် (sensitive) data တွေကို ကိုင်တွယ်တဲ့အခါ
- အခြား scripts တွေကို block လုပ်ထားပြီး — တချို့သော inline scripts တွေကိုပဲ ခွင့်ပြုဖို့ လိုအပ်တဲ့အခါ
- စည်းကမ်း လိုက်နာမှု (compliance) လိုအပ်ချက်တွေက တင်းကျပ်တဲ့ CSP ကို မဖြစ်မနေ လိုအပ်တဲ့အခါ

## Nonces မပါဘဲ (Without Nonces)

Nonces မလိုအပ်တဲ့ applications တွေအတွက် — CSP header ကို သင့် [`next.config.js`](https://nextjs.org/docs/app/api-reference/config/next-config-js) file ထဲမှာ တိုက်ရိုက် သတ်မှတ်နိုင်ပါတယ်:

```js filename="next.config.js"
const isDev = process.env.NODE_ENV === 'development'

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}
```

## Subresource Integrity (SRI) (Experimental — စမ်းသပ်ဆဲ)

Nonces တွေရဲ့ အခြားရွေးချယ်စရာ တစ်ခုအနေနဲ့ — Next.js က Subresource Integrity (SRI) ကို သုံးတဲ့ hash-based CSP အတွက် experimental (စမ်းသပ်ဆဲ) support ကို ပေးပါတယ်။ ဒီနည်းလမ်းက တင်းကျပ်တဲ့ CSP ရှိနေဆဲနဲ့ပဲ — static generation ကို ဆက်ထိန်းထားနိုင်စေပါတယ်။

> **သိထားသင့်သည်:** ဒီ feature က experimental ဖြစ်ပြီး — App Router applications တွေမှာပဲ ရနိုင်ပါတယ်။

### SRI အလုပ်လုပ်ပုံ (How SRI works)

Nonces သုံးမယ့်အစား — SRI က build time မှာ သင့် JavaScript files တွေရဲ့ cryptographic hashes တွေကို ထုတ်ပေးပါတယ်။ ဒီ hashes တွေကို script tags တွေရဲ့ `integrity` attributes တွေအနေနဲ့ ထည့်ပေးလို့ — files တွေက ပို့ဆောင်မှု ကာလအတွင်း ပြောင်းလဲခြင်း ရှိမရှိ browser တွေက စစ်ဆေးနိုင်ပါတယ်။

### SRI ကို ဖွင့်သုံးခြင်း (Enabling SRI)

Experimental SRI configuration ကို သင့် `next.config.js` ထဲ ထည့်ပါ:

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    sri: {
      algorithm: 'sha256', // or 'sha384' or 'sha512'
    },
  },
}

module.exports = nextConfig
```

### SRI နဲ့ CSP configuration ပြင်ဆင်ခြင်း

SRI ဖွင့်ထားရင် — သင့် လက်ရှိ CSP policies တွေကို ဆက်သုံးနိုင်ပါတယ်။ SRI က သင့် assets တွေဆီ `integrity` attributes တွေ ထည့်ပေးခြင်းအားဖြင့် — သီးခြား (independently) အလုပ်လုပ်ပါတယ်:

> **သိထားသင့်သည်:** Dynamic rendering လိုအပ်တဲ့ အခြေအနေတွေအတွက်ဆို — SRI integrity attributes ရော nonce-based CSP နည်းလမ်းရော ပေါင်းစပ်ပြီး — proxy နဲ့ nonces တွေကို ဆက်လက် ထုတ်ပေးနိုင်ပါတယ်။

```js filename="next.config.js"
const isDev = process.env.NODE_ENV === 'development'

const cspHeader = `
    default-src 'self';
    script-src 'self'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

module.exports = {
  experimental: {
    sri: {
      algorithm: 'sha256',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}
```

### Nonces တွေထက် SRI ရဲ့ အားသာချက်များ (Benefits of SRI over nonces)

- **Static generation**: Pages တွေကို statically generate လုပ်ပြီး cache လုပ်နိုင်ပါတယ်
- **CDN နဲ့ လိုက်ဖက်မှု**: Static pages တွေက CDN caching နဲ့ အလုပ်လုပ်ပါတယ်
- **Performance ပိုကောင်းခြင်း**: Request တိုင်းအတွက် server-side rendering မလိုအပ်ပါဘူး
- **Build-time လုံခြုံရေး**: Hashes တွေကို build time မှာ ထုတ်ပေးလို့ — integrity ကို အာမခံပါတယ်

### SRI ရဲ့ ကန့်သတ်ချက်များ (Limitations of SRI)

- **Experimental (စမ်းသပ်ဆဲ)**: Feature က ပြောင်းလဲခြင်း (သို့) ဖယ်ရှားခြင်း ဖြစ်နိုင်ပါတယ်
- **App Router အတွက်သာ**: Pages Router မှာ မထောက်ပံ့ပါဘူး
- **Build-time အတွက်သာ**: Dynamic ဖြစ်တဲ့ scripts တွေကို ကိုင်တွယ်လို့ မရပါဘူး

## Development နဲ့ Production ဆိုင်ရာ ထည့်သွင်းစဉ်းစားချက်များ (Development vs Production Considerations)

CSP အကောင်အထည်ဖော်မှုက development နဲ့ production environments တွေကြားမှာ ကွဲပြားပါတယ်:

### Development Environment (development ပတ်ဝန်းကျင်တွင်)

Development မှာ — `'unsafe-eval'` ကို ဖွင့်ပေးဖို့ လိုပါမယ်။ ဘာကြောင့်လဲဆိုတော့ React က server ပေါ်မှာ errors တွေ ဘယ်ကစတင်ခဲ့လဲ ပြသဖို့ — server-side error stacks တွေကို browser ထဲမှာ ပြန်လည် တည်ဆောက်တာလို ပိုကောင်းတဲ့ debugging information တွေ ပေးဖို့ `eval` ကို သုံးလို့ပါ:

```ts filename="proxy.ts" switcher
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

  // Rest of proxy implementation
}
```

```js filename="proxy.js" switcher
export function proxy(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

  // Rest of proxy implementation
}
```

### Production Deployment (production သို့ လွှင့်တင်ခြင်း)

Production မှာ အဖြစ်များတဲ့ ပြဿနာတွေက:

- **Nonce သက်ရောက်မှု မရှိခြင်း**: သင့် proxy က လိုအပ်တဲ့ routes အားလုံးပေါ်မှာ run ကြောင်း သေချာပါစေ
- **Static assets တွေ block ခံရခြင်း**: သင့် CSP က Next.js ရဲ့ static assets တွေကို ခွင့်ပြုကြောင်း စစ်ဆေးပါ
- **Third-party scripts**: လိုအပ်တဲ့ domains တွေကို သင့် CSP policy ထဲ ထည့်ပါ

## Troubleshooting (ပြဿနာဖြေရှင်းခြင်း)

### Third-party Scripts

CSP နဲ့အတူ third-party scripts တွေ သုံးတဲ့အခါ:

```tsx filename="app/layout.tsx" switcher
import { GoogleTagManager } from '@next/third-parties/google'
import { headers } from 'next/headers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = (await headers()).get('x-nonce')

  return (
    <html lang="en">
      <body>
        {children}
        <GoogleTagManager gtmId="GTM-XYZ" nonce={nonce} />
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.jsx" switcher
import { GoogleTagManager } from '@next/third-parties/google'
import { headers } from 'next/headers'

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get('x-nonce')

  return (
    <html lang="en">
      <body>
        {children}
        <GoogleTagManager gtmId="GTM-XYZ" nonce={nonce} />
      </body>
    </html>
  )
}
```

Third-party domains တွေကို ခွင့်ပြုဖို့ သင့် CSP ကို update လုပ်ပါ:

```ts filename="proxy.ts" switcher
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com;
  connect-src 'self' https://www.google-analytics.com;
  img-src 'self' data: https://www.google-analytics.com;
`
```

```js filename="proxy.js" switcher
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com;
  connect-src 'self' https://www.google-analytics.com;
  img-src 'self' data: https://www.google-analytics.com;
`
```

### မကြာခဏ ကြုံရတဲ့ CSP ချိုးဖောက်မှုများ (Common CSP Violations)

1. **Inline styles**: Nonces တွေကို ထောက်ပံ့တဲ့ CSS-in-JS libraries တွေကို သုံးပါ (သို့) styles တွေကို external files တွေဆီ ရွှေ့ပါ
2. **Dynamic imports**: သင့် `script-src` policy ထဲမှာ dynamic imports တွေကို ခွင့်ပြုထားကြောင်း သေချာပါစေ
3. **WebAssembly**: WebAssembly သုံးနေရင် `'wasm-unsafe-eval'` ကို ထည့်ပါ
4. **Service workers**: Service worker scripts တွေအတွက် သင့်လျော်တဲ့ policies တွေ ထည့်ပါ

## Version History

| Version    | အပြောင်းအလဲ                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v14.0.0`  | Hash-based CSP အတွက် experimental SRI support ကို ထည့်သွင်းခဲ့သည်                                                                               |
| `v13.4.20` | Nonce ကိုင်တွယ်မှုနဲ့ CSP header parsing မှန်ကန်စေရန် အကြံပြုထားသော ဗားရှင်း                                                                    |
