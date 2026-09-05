---
title: "proxy.js (Proxy)"
description: "proxy.js|ts file convention — request မပြီးခင်မှာ server ပေါ်မှာ code run လုပ်ခြင်း; matcher, NextRequest/NextFetchEvent params, NextResponse (rewrite/redirect/headers/cookies), execution order, CORS, migration to proxy အကြောင်း"
order: 77
source: "https://nextjs.org/docs/app/api-reference/file-conventions/proxy"
status: translated
updated: 2026-09-02
---

> **မှတ်ချက်**: `middleware` file convention က deprecated ဖြစ်ပြီး `proxy` ဆိုပြီး အမည်ပြောင်းသွားပါပြီ။ အသေးစိတ်အတွက် [Migration to Proxy](#migration-to-proxy) ကို ကြည့်ပါ။

`proxy.js|ts` file ကို [Proxy](/docs/nextjs/proxy-guide) တစ်ခု ရေးဖို့နဲ့ — request တစ်ခု ပြီးမြောက်ခင် server ပေါ်မှာ code တွေ run လုပ်ဖို့ သုံးပါတယ်။ ပြီးရင် — incoming request ပေါ် မူတည်ပြီး rewriting, redirecting, request (သို့) response headers တွေ ပြုပြင်ခြင်း (သို့) တိုက်ရိုက် response ပြန်ခြင်း စတာတွေနဲ့ — response ကို ပြုပြင်နိုင်ပါတယ်။

Proxy က routes တွေ render မလုပ်ခင် execute လုပ်ပါတယ်။ Authentication, logging (သို့) redirects တွေကို ကိုင်တွယ်တာလိုမျိုး — custom server-side logic တွေ အကောင်အထည်ဖော်ဖို့ အထူး အသုံးဝင်ပါတယ်။

> **သိထားသင့်သည်:**
>
> Proxy ကို သင့် render code နဲ့ သီးခြားစီ ခေါ်ယူဖို့ ရည်ရွယ်ပြီး — အကောင်းဆုံး အခြေအနေတွေမှာ မြန်ဆန်တဲ့ redirect/rewrite handling အတွက် သင့် CDN ဆီ deploy လုပ်ဖို့ ဖြစ်ပါတယ်။ Shared modules (သို့) globals တွေကို အားကိုးဖို့ မကြိုးစားသင့်ပါဘူး။
>
> Proxy ကနေ သင့် application ဆီ အချက်အလက်တွေ ပို့ဖို့ — [headers](#setting-headers), [cookies](#using-cookies), [rewrites](https://nextjs.org/docs/app/api-reference/functions/next-response#rewrite), [redirects](https://nextjs.org/docs/app/api-reference/functions/next-response#redirect) (သို့) URL ကို သုံးပါ။

Project root မှာ (ဒါမှမဟုတ် သက်ဆိုင်ရင် `src` ထဲမှာ) `pages` (သို့) `app` တွေနဲ့ အတူတူ level မှာ ရောက်အောင် — `proxy.ts` (သို့) `.js` file တစ်ခု ဖန်တီးပါ။

[`pageExtensions`](https://nextjs.org/docs/app/api-reference/config/next-config-js/pageExtensions) ကို ဥပမာ `.page.ts` (သို့) `.page.js` ဆိုပြီး customize လုပ်ထားရင် — သင့် file ကို `proxy.page.ts` (သို့) `proxy.page.js` ဆိုပြီး အဲဒီအတိုင်း နာမည်ပေးပါ။

```tsx filename="proxy.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ဒီ function ကို အတွင်းမှာ `await` သုံးရင် `async` အဖြစ် မှတ်သားနိုင်ပါတယ်
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

// ဒီ function ကို အတွင်းမှာ `await` သုံးရင် `async` အဖြစ် မှတ်သားနိုင်ပါတယ်
export function proxy(request) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

## Exports

### Proxy function

File က function တစ်ခုတည်းကိုပဲ export လုပ်ရပါမယ် — default export အဖြစ်ဖြစ်စေ၊ `proxy` ဆိုပြီး named export အဖြစ်ဖြစ်စေ ဖြစ်ပါတယ်။ သတိပြုရန် — file တစ်ခုတည်းကနေ proxy အများအပြားကို ထောက်ပံ့မပေးပါဘူး။

```js filename="proxy.js"
// Default export ရဲ့ ဥပမာ
export default function proxy(request) {
  // Proxy logic
}
```

### Config object (optional)

Proxy function နဲ့အတူ — config object တစ်ခုကိုလည်း optionally export လုပ်နိုင်ပါတယ်။ ဒီ object ထဲမှာ Proxy ကို ဘယ် paths တွေမှာ အသုံးချမယ်ဆိုတာ သတ်မှတ်ဖို့ [matcher](#matcher) ပါဝင်ပါတယ်။

### Matcher

`matcher` option က Proxy ကို ဘယ် specific paths တွေပေါ်မှာ run လုပ်စေချင်လဲ ဦးတည်ချက်ထားနိုင်စေပါတယ်။

`matcher` မပါရင် — Proxy က **request တိုင်းပေါ်မှာ** run လုပ်ပါတယ် — static files (`_next/static`), image optimizations (`_next/image`) နဲ့ `public/` folder ထဲက assets တွေ အပါအဝင်ပါ။ CSS, JS (သို့) images တွေ load ဖြစ်တာကို auth logic (သို့) redirects တွေက မရည်ရွယ်ဘဲ ပိတ်ဆို့နိုင်လို့ — ဒီ paths တွေကို ဖယ်ထုတ်ဖို့ [negative match pattern](#negative-matching) တစ်ခုကို သုံးစဉ်းစားပါ။

Paths တွေကို နည်းလမ်းမျိုးစုံနဲ့ သတ်မှတ်နိုင်ပါတယ်:

- Path တစ်ခုတည်းအတွက်: Path ကို သတ်မှတ်ဖို့ string တစ်ခုကို တိုက်ရိုက် သုံးပါ — ဥပမာ `'/about'`။
- Paths အများအပြားအတွက်: Paths အများအပြားကို စာရင်းပြုစုဖို့ array တစ်ခုကို သုံးပါ — ဥပမာ `matcher: ['/about', '/contact']` ဆိုရင် `/about` ရော `/contact` နှစ်ခုလုံးပေါ်မှာ Proxy ကို အသုံးချပါတယ်။

```js filename="proxy.js"
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}
```

ထပ်ပြီး — `matcher` option က regular expressions တွေသုံးပြီး ရှုပ်ထွေးတဲ့ path specifications တွေကိုပါ ထောက်ပံ့ပါတယ်။ ဥပမာ — regular expression matcher တစ်ခုနဲ့ တချို့ paths တွေကို ဖယ်ထုတ်နိုင်ပါတယ်:

```js filename="proxy.js"
export const config = {
  matcher: [
    // API routes, static files, image optimizations, နဲ့ .png files တွေကို ဖယ်ထုတ်သည်
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
```

ဒါက ဘယ် paths တွေကို ထည့်မယ်/ဖယ်မယ်ဆိုတာ တိကျတဲ့ ထိန်းချုပ်မှု ရစေပါတယ်။

`matcher` option က အောက်ပါ keys တွေပါတဲ့ objects array တစ်ခုကို လက်ခံပါတယ်:

- `source`: Request paths တွေနဲ့ ကိုက်ညီဖို့ သုံးတဲ့ path (သို့) pattern။ တိုက်ရိုက် path matching အတွက် string (သို့) ပိုရှုပ်ထွေးတဲ့ matching အတွက် pattern တစ်ခု ဖြစ်နိုင်ပါတယ်။
- `locale` (optional): `false` ဆိုရင် — path matching ထဲမှာ locale-based routing ကို လျစ်လျူရှုတဲ့ boolean တစ်ခု။
- `has` (optional): Headers, query parameters (သို့) cookies လိုမျိုး request elements တချို့ ရှိနေမှုအပေါ် အခြေခံတဲ့ အခြေအနေတွေကို သတ်မှတ်သည်။
- `missing` (optional): Headers (သို့) cookies လိုမျိုး request elements တချို့ မရှိတဲ့ အခြေအနေတွေကို အာရုံစိုက်သည်။

```js filename="proxy.js"
export const config = {
  matcher: [
    {
      source: '/api/:path*',
      locale: false,
      has: [
        { type: 'header', key: 'Authorization', value: 'Bearer Token' },
        { type: 'query', key: 'userId', value: '123' },
      ],
      missing: [{ type: 'cookie', key: 'session', value: 'active' }],
    },
  ],
}
```

`source` path patterns တွေရဲ့ စည်းမျဉ်းတွေ:

1. `/` နဲ့ စရမည်
2. Named parameters တွေ ပါဝင်နိုင်သည်: `/about/:path` က `/about/a` နဲ့ `/about/b` တွေနဲ့ ကိုက်ညီပြီး `/about/a/c` နဲ့တော့ မကိုက်ညီပါဘူး
3. Named parameters တွေပေါ်မှာ modifiers တွေ ရှိနိုင်သည် (`:` နဲ့ စတင်): `/about/:path*` က `/about/a/b/c` နဲ့ ကိုက်ညီပါတယ် — `*` က _zero or more_ ဖြစ်လို့ပါ။ `?` က _zero or one_ ဖြစ်ပြီး `+` က _one or more_ ဖြစ်ပါတယ်
4. Parenthesis ထဲမှာ ထည့်ထားတဲ့ regular expression တွေကို သုံးနိုင်သည်: `/about/(.*)` က `/about/:path*` နဲ့ အတူတူပါ
5. Path ရဲ့ အစမှာ anchored ဖြစ်သည်: `/about` က `/about` နဲ့ `/about/team` တို့နဲ့ ကိုက်ညီပြီး `/blog/about` နဲ့တော့ မကိုက်ညီပါဘူး

အသေးစိတ်တွေကို [path-to-regexp](https://github.com/pillarjs/path-to-regexp#path-to-regexp-1) documentation မှာ ဖတ်ပါ။

> **သိထားသင့်သည်:**
>
> - `matcher` တန်ဖိုးတွေက build-time မှာ statically analyze လုပ်နိုင်ဖို့ constants တွေ ဖြစ်ရပါမယ်။ Variables လိုမျိုး dynamic values တွေကို လျစ်လျူရှုပါလိမ့်မယ်။
> - Backward compatibility အတွက် — Next.js က `/public` ကို `/public/index` အဖြစ် အမြဲ သတ်မှတ်ပါတယ်။ ဒါကြောင့် `/public/:path` ဆိုတဲ့ matcher တစ်ခုက ကိုက်ညီပါလိမ့်မယ်။
## Params

Next.js က Proxy function ကို arguments နှစ်ခုနဲ့ ခေါ်ပါတယ် — [`request`](#request) နဲ့ [`event`](#event) — အဲဒီ order အတိုင်းပါ။ ကိုယ်သုံးတဲ့ဟာကိုပဲ ကြေညာပါ။

### `request`

ပထမဆုံး parameter က incoming HTTP request ကို ကိုယ်စားပြုတဲ့ `NextRequest` instance တစ်ခုပါ။

```tsx filename="proxy.ts" switcher
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Proxy logic ဒီမှာ ရေးပါ
}
```

```js filename="proxy.js" switcher
export function proxy(request) {
  // Proxy logic ဒီမှာ ရေးပါ
}
```

### `event`

ဒုတိယ parameter က `NextFetchEvent` instance တစ်ခုပါ။ ဒါက `waitUntil(promise)` ဆိုတဲ့ method တစ်ခုတည်းကို ထုတ်ဖော်ပြီး — promise ပြီးမြောက်တဲ့အထိ Proxy invocation ကို ရှင်သန်နေစေပါတယ်။ ဒါကြောင့် logging (သို့) analytics လိုမျိုး background အလုပ်တွေက response ပို့ပြီးတဲ့နောက်မှာပါ ပြီးစီးနိုင်ပါတယ်။ ဥပမာအပြည့်အစုံအတွက် [`waitUntil` နဲ့ `NextFetchEvent`](#waituntil-and-nextfetchevent) ကို ကြည့်ပါ။

```tsx filename="proxy.ts" switcher
import type { NextFetchEvent, NextRequest } from 'next/server'

export function proxy(request: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch('https://example.com/log', {
      method: 'POST',
      body: JSON.stringify({ pathname: request.nextUrl.pathname }),
    })
  )
}
```

```js filename="proxy.js" switcher
export function proxy(request, event) {
  event.waitUntil(
    fetch('https://example.com/log', {
      method: 'POST',
      body: JSON.stringify({ pathname: request.nextUrl.pathname }),
    })
  )
}
```

### `NextProxy` type

ပိုတိုတောင်းတဲ့ ပုံစံ ကြိုက်ရင် — `NextProxy` type ကို သုံးနိုင်ပါတယ်။ ဒါက `request` (`NextRequest`) ရော `event` (`NextFetchEvent`) နှစ်ခုလုံးအတွက် parameter types တွေကို အလိုအလျောက် ခန့်မှန်းပေးပါတယ်:

```tsx filename="proxy.ts"
import type { NextProxy } from 'next/server'

export const proxy: NextProxy = (request, event) => {
  event.waitUntil(Promise.resolve())
  return Response.json({ pathname: request.nextUrl.pathname })
}
```

> **သိထားသင့်သည်:**
>
> - `NextRequest` က Next.js Proxy ထဲမှာ incoming HTTP requests တွေကို ကိုယ်စားပြုတဲ့ type တစ်ခု ဖြစ်ပြီး — [`NextResponse`](#nextresponse) ကတော့ HTTP responses တွေကို ကိုင်တွယ်ပြီး ပြန်ပို့ဖို့ သုံးတဲ့ class တစ်ခု ဖြစ်ပါတယ်။

## NextResponse

`NextResponse` API နဲ့ အောက်ပါတွေကို လုပ်နိုင်ပါတယ်:

- Incoming request ကို URL တစ်ခုမတူညီတဲ့နေရာဆီ `redirect` လုပ်ခြင်း
- ပေးထားတဲ့ URL တစ်ခုကို ပြသခြင်းဖြင့် response ကို `rewrite` လုပ်ခြင်း
- API Routes, `getServerSideProps`, နဲ့ `rewrite` destinations တွေအတွက် request headers တွေ သတ်မှတ်ခြင်း
- Response cookies တွေ သတ်မှတ်ခြင်း
- Response headers တွေ သတ်မှတ်ခြင်း

Proxy ကနေ response တစ်ခု ထုတ်လုပ်ဖို့:

1. Response တစ်ခု ထုတ်လုပ်ပေးတဲ့ route တစ်ခုဆီ ([Page](/docs/nextjs/file-conventions-page) (သို့) [Route Handler](/docs/nextjs/file-conventions-route)) `rewrite` လုပ်ပါ
2. `NextResponse` တစ်ခုကို တိုက်ရိုက် return လုပ်ပါ။ [Producing a Response](#producing-a-response) ကို ကြည့်ပါ

> **သိထားသင့်သည်:** Redirects တွေအတွက် — `NextResponse.redirect` အစား `Response.redirect` ကိုလည်း သုံးနိုင်ပါတယ်။

## Execution order

Proxy ကို သင့် project ထဲက **route တိုင်းအတွက်** invoke လုပ်ပါလိမ့်မယ်။ ဒါကြောင့် — specific routes တွေကို တိကျစွာ ဦးတည်ချက်ထားဖို့ (သို့) ဖယ်ထုတ်ဖို့ [matchers](#matcher) တွေကို သုံးတာ အရေးကြီးပါတယ်။ အောက်ပါအတိုင်း execution order ဖြစ်ပါတယ်:

1. `next.config.js` ကနေ `headers`
2. `next.config.js` ကနေ `redirects`
3. Proxy (`rewrites`, `redirects`, စသည်)
4. `next.config.js` ကနေ `beforeFiles` (`rewrites`)
5. Filesystem routes (`public/`, `_next/static/`, `pages/`, `app/`, စသည်)
6. `next.config.js` ကနေ `afterFiles` (`rewrites`)
7. Dynamic Routes (`/blog/[slug]`)
8. `next.config.js` ကနေ `fallback` (`rewrites`)

> **သိထားသင့်သည်:** [Server Functions](/docs/nextjs/use-server) တွေက ဒီ chain ထဲမှာ သီးခြား routes တွေ မဟုတ်ပါဘူး။ သူတို့ သုံးထားတဲ့ route ဆီ POST requests အဖြစ် ကိုင်တွယ်ခံရတာမို့ — path တစ်ခုကို ဖယ်ထုတ်တဲ့ Proxy matcher တစ်ခုက အဲဒီ path ပေါ်က Server Function calls တွေကိုပါ ကျော်သွားပါလိမ့်မယ်။
>
> Matcher အပြောင်းအလဲ (သို့) Server Function တစ်ခုကို route တစ်ခုမတူညီတဲ့နေရာဆီ ရွှေ့တဲ့ refactor တစ်ခုက — Proxy coverage ကို တိတ်တဆိတ် ဖယ်ရှားပစ်နိုင်ပါတယ်။ Proxy တစ်ခုတည်းကိုပဲ အားကိုးမယ့်အစား — Server Function တစ်ခုချင်းစီ အတွင်းမှာ authentication နဲ့ authorization တွေကို အမြဲ verify လုပ်ပါ။ အကြံပြုထားတဲ့ patterns တွေအတွက် [Data Security guide](https://nextjs.org/docs/app/guides/data-security#authentication-and-authorization) ကို ကြည့်ပါ။

## Runtime

Proxy က default အနေနဲ့ Node.js runtime ကို သုံးပါတယ်။ [`runtime`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/runtime) config option ကို Proxy files တွေထဲမှာ မရနိုင်ပါဘူး။ Proxy ထဲမှာ `runtime` config option ကို သတ်မှတ်ရင် — error ထွက်ပါလိမ့်မယ်။
## Advanced Proxy flags

Next.js ရဲ့ `v13.1` မှာ — advanced use cases တွေကို ကိုင်တွယ်ဖို့ proxy အတွက် flags နှစ်ခု ထပ်ထည့်ခဲ့ပါတယ် — `skipProxyUrlNormalize` (အရင်က `skipMiddlewareUrlNormalize`) နဲ့ `skipTrailingSlashRedirect` တို့ပါ။

`skipTrailingSlashRedirect` က trailing slashes တွေ ထည့်ခြင်း/ဖယ်ခြင်းအတွက် Next.js redirects တွေကို ပိတ်ပေးပါတယ်။ ဒါက path တချို့အတွက် trailing slash ကို ထိန်းထားပြီး တချို့အတွက်တော့ မထားဘူးဆိုတဲ့ — proxy အတွင်းမှာ custom handling တွေကို ခွင့်ပြုပေးလို့ — incremental migrations တွေ ပိုလွယ်ကူစေပါတယ်။

```js filename="next.config.js"
module.exports = {
  skipTrailingSlashRedirect: true,
}
```

```js filename="proxy.js"
const legacyPrefixes = ['/docs', '/blog']

export default async function proxy(req) {
  const { pathname } = req.nextUrl

  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // apply trailing slash handling
  if (
    !pathname.endsWith('/') &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
  ) {
    return NextResponse.redirect(
      new URL(`${req.nextUrl.pathname}/`, req.nextUrl)
    )
  }
}
```

`skipProxyUrlNormalize` က direct visits တွေနဲ့ client-transitions တွေကို အတူတူ ကိုင်တွယ်ဖို့ — Next.js ထဲက URL normalization ကို ပိတ်ခွင့်ပြုပါတယ်။ Advanced cases တချို့မှာ — ဒီ option က original URL ကို သုံးပြီး အပြည့်အဝ ထိန်းချုပ်မှု ပေးပါတယ်။

```js filename="next.config.js"
module.exports = {
  skipProxyUrlNormalize: true,
}
```

```js filename="proxy.js"
export default async function proxy(req) {
  const { pathname } = req.nextUrl

  // GET /_next/data/build-id/hello.json

  console.log(pathname)
  // flag နဲ့ဆို အခု /_next/data/build-id/hello.json
  // flag မရှိရင် ဒါကို /hello ဆိုပြီး normalize လုပ်မှာ
}
```

## ဥပမာများ (Examples)

### Conditional Statements

```ts filename="proxy.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```

### Using Cookies

Cookies တွေက ပုံမှန် headers တွေပါ။ `Request` တစ်ခုပေါ်မှာဆို — `Cookie` header ထဲမှာ သိမ်းထားပြီး — `Response` တစ်ခုပေါ်မှာဆို `Set-Cookie` header ထဲမှာ ရှိပါတယ်။ Next.js က `NextRequest` နဲ့ `NextResponse` တို့ပေါ်က `cookies` extension ကနေ — ဒီ cookies တွေကို အလွယ်တကူ ဝင်ရောက်/ကိုင်တွယ်နိုင်တဲ့ နည်းလမ်းတစ်ခု ပေးပါတယ်။

1. Incoming requests တွေအတွက် — `cookies` မှာ အောက်ပါ method တွေ ပါဝင်ပါတယ်: `get`, `getAll`, `set`, နဲ့ `delete` cookies။ Cookie တစ်ခု ရှိမရှိ `has` နဲ့ စစ်နိုင်သလို — cookies အားလုံးကို `clear` နဲ့ ဖယ်ရှားနိုင်ပါတယ်။
2. Outgoing responses တွေအတွက် — `cookies` မှာ `get`, `getAll`, `set`, နဲ့ `delete` ဆိုတဲ့ methods တွေ ပါဝင်ပါတယ်။

```ts filename="proxy.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Incoming request မှာ "Cookie:nextjs=fast" header တစ်ခု ရှိနေတယ်လို့ ယူဆပါ
  // `RequestCookies` API သုံးပြီး request ကနေ cookies တွေ ရယူခြင်း
  let cookie = request.cookies.get('nextjs')
  console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll()
  console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs') // => true
  request.cookies.delete('nextjs')
  request.cookies.has('nextjs') // => false

  // `ResponseCookies` API သုံးပြီး response ပေါ်မှာ cookies တွေ သတ်မှတ်ခြင်း
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // Outgoing response မှာ `Set-Cookie:vercel=fast;path=/` header တစ်ခု ပါလာမယ်။

  return response
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  // Incoming request မှာ "Cookie:nextjs=fast" header တစ်ခု ရှိနေတယ်လို့ ယူဆပါ
  // `RequestCookies` API သုံးပြီး request ကနေ cookies တွေ ရယူခြင်း
  let cookie = request.cookies.get('nextjs')
  console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll()
  console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs') // => true
  request.cookies.delete('nextjs')
  request.cookies.has('nextjs') // => false

  // `ResponseCookies` API သုံးပြီး response ပေါ်မှာ cookies တွေ သတ်မှတ်ခြင်း
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // Outgoing response မှာ `Set-Cookie:vercel=fast;path=/` header တစ်ခု ပါလာမယ်။

  return response
}
```

### Setting Headers

`NextResponse` API ကို သုံးပြီး — request ရော response headers တွေပါ သတ်မှတ်နိုင်ပါတယ် (_request_ headers တွေ သတ်မှတ်တာက Next.js v13.0.0 ကစပြီး ရနိုင်ပါတယ်)။

```ts filename="proxy.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Request headers တွေကို clone လုပ်ပြီး header အသစ်တစ်ခု `x-hello-from-proxy1` သတ်မှတ်ပါ
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-proxy1', 'hello')

  // NextResponse.next ထဲမှာလည်း request headers တွေ သတ်မှတ်နိုင်ပါတယ်
  const response = NextResponse.next({
    request: {
      // Request headers အသစ်များ
      headers: requestHeaders,
    },
  })

  // Response header အသစ်တစ်ခု `x-hello-from-proxy2` သတ်မှတ်ပါ
  response.headers.set('x-hello-from-proxy2', 'hello')
  return response
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  // Request headers တွေကို clone လုပ်ပြီး header အသစ်တစ်ခု `x-hello-from-proxy1` သတ်မှတ်ပါ
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-proxy1', 'hello')

  // NextResponse.next ထဲမှာလည်း request headers တွေ သတ်မှတ်နိုင်ပါတယ်
  const response = NextResponse.next({
    request: {
      // Request headers အသစ်များ
      headers: requestHeaders,
    },
  })

  // Response header အသစ်တစ်ခု `x-hello-from-proxy2` သတ်မှတ်ပါ
  response.headers.set('x-hello-from-proxy2', 'hello')
  return response
}
```

Snippet ထဲမှာ အောက်ပါတွေကို သုံးထားတာ သတိပြုပါ:

- `NextResponse.next({ request: { headers: requestHeaders } })` — `requestHeaders` ကို upstream မှာ ရနိုင်အောင် လုပ်ပေးတယ်
- **မဟုတ်ဘဲ** — `NextResponse.next({ headers: requestHeaders })` — ဒါကတော့ `requestHeaders` ကို clients တွေဆီ ရနိုင်စေတာပါ

[Proxy ထဲက NextResponse headers](/docs/nextjs/next-response) အကြောင်း ပိုလေ့လာပါ။

> **သိထားသင့်သည်:** Headers တွေ အကြီးကြီး သတ်မှတ်တာကို ရှောင်ပါ — သင့် backend web server configuration ပေါ် မူတည်ပြီး [431 Request Header Fields Too Large](https://developer.mozilla.org/docs/Web/HTTP/Status/431) error ဖြစ်စေနိုင်လို့ပါ။

#### RSC requests နဲ့ rewrites

RSC requests တွေအတွင်း — Next.js က Proxy ထဲက `request` instance ကနေ internal Flight headers တွေကို ဖယ်ထုတ်ပါတယ်။ ဥပမာ — `rsc`, `next-router-state-tree`, နဲ့ `next-router-prefetch` လိုမျိုး headers တွေက `request.headers` ကနေ ထုတ်ပြလို့ မရပါဘူး။ ဒါက RSC request တစ်ခုကို HTML request နဲ့ မတူညီတဲ့ပုံစံနဲ့ မရည်ရွယ်ဘဲ ကိုင်တွယ်မိခြင်းကနေ ကာကွယ်ဖို့ပါ — နှစ်ခုလုံး ညှိထားဖို့ လိုအပ်လို့ပါ။

`NextResponse.rewrite()` ကို သုံးတဲ့အခါ — Next.js က လိုအပ်တဲ့ RSC rewrite headers တွေကို upstream ဆီ အလိုအလျောက် ဖြန့်ပေးပါတယ်။

`NextResponse.rewrite()` အစား `fetch()` နဲ့ custom rewrite logic တစ်ခု အကောင်အထည်ဖော်ရင် — RSC headers တွေကို ကိုယ်တိုင် forward မလုပ်ရင် ပျောက်ဆုံးနိုင်ပါတယ်။

Custom `fetch` rewrite setups တွေအတွက် — သင့် rewrite logic က လိုအပ်တဲ့ URL shape နဲ့ RSC headers တွေကို ပေးထားတဲ့ request object ကနေ လက်ခံရရှိနိုင်အောင် — `next.config.js` ထဲမှာ `skipProxyUrlNormalize` ကိုလည်း ဖွင့်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  skipProxyUrlNormalize: true,
}
```
### CORS

Cross-origin requests တွေကို ခွင့်ပြုဖို့ — Proxy ထဲမှာ CORS headers တွေ သတ်မှတ်နိုင်ပါတယ် — [simple](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests) ရော [preflighted](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests) requests နှစ်မျိုးလုံး အပါအဝင်ပါ။

```tsx filename="proxy.ts" switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const allowedOrigins = ['https://acme.com', 'https://my-app.org']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function proxy(request: NextRequest) {
  // Request ကနေ origin ကို စစ်ဆေးပါ
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // Preflighted requests တွေကို ကိုင်တွယ်ပါ
  const isPreflight = request.method === 'OPTIONS'

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  // Simple requests တွေကို ကိုင်တွယ်ပါ
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

```jsx filename="proxy.js" switcher
import { NextResponse } from 'next/server'

const allowedOrigins = ['https://acme.com', 'https://my-app.org']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function proxy(request) {
  // Request ကနေ origin ကို စစ်ဆေးပါ
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)

  // Preflighted requests တွေကို ကိုင်တွယ်ပါ
  const isPreflight = request.method === 'OPTIONS'

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  // Simple requests တွေကို ကိုင်တွယ်ပါ
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: '/api/:path*',
}
```

> **သိထားသင့်သည်:** Route တစ်ခုချင်းစီအတွက် CORS headers တွေကို [Route Handlers](/docs/nextjs/file-conventions-route#cors) ထဲမှာလည်း configure လုပ်နိုင်ပါတယ်။

### Producing a response

`Response` (သို့) `NextResponse` instance တစ်ခုကို return လုပ်ပြီး — Proxy ကနေ တိုက်ရိုက် response ပြန်နိုင်ပါတယ်။ (ဒါက [Next.js v13.1.0](https://nextjs.org/blog/next-13-1#nextjs-advanced-proxy) ကစပြီး ရနိုင်ပါတယ်)

```ts filename="proxy.ts" switcher
import type { NextRequest } from 'next/server'
import { isAuthenticated } from '@lib/auth'

// Proxy ကို `/api/` နဲ့ စတင်တဲ့ paths တွေပေါ်မှာပဲ ကန့်သတ်ပါ
export const config = {
  matcher: '/api/:function*',
}

export function proxy(request: NextRequest) {
  // Request ကို စစ်ဆေးဖို့ ကျွန်ုပ်တို့ရဲ့ authentication function ကို ခေါ်ပါ
  if (!isAuthenticated(request)) {
    // Error message ဖော်ပြတဲ့ JSON နဲ့ response ပြန်ပါ
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

```js filename="proxy.js" switcher
import { isAuthenticated } from '@lib/auth'

// Proxy ကို `/api/` နဲ့ စတင်တဲ့ paths တွေပေါ်မှာပဲ ကန့်သတ်ပါ
export const config = {
  matcher: '/api/:function*',
}

export function proxy(request) {
  // Request ကို စစ်ဆေးဖို့ ကျွန်ုပ်တို့ရဲ့ authentication function ကို ခေါ်ပါ
  if (!isAuthenticated(request)) {
    // Error message ဖော်ပြတဲ့ JSON နဲ့ response ပြန်ပါ
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

### Negative matching

`matcher` config က full regex ကို ထောက်ပံ့တာမို့ — negative lookaheads (သို့) character matching လိုမျိုး matching တွေကို ထောက်ပံ့ပါတယ်။ Specific paths တွေကလွဲပြီး အားလုံးနဲ့ ကိုက်ညီဖို့ negative lookahead တစ်ခုရဲ့ ဥပမာကို ဒီမှာ ကြည့်နိုင်ပါတယ်:

```js filename="proxy.js"
export const config = {
  matcher: [
    /*
     * အောက်ပါတွေနဲ့ စတင်တာတွေကလွဲပြီး request paths အားလုံးနဲ့ ကိုက်ညီသည်:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

`missing` (သို့) `has` arrays တွေ (သို့) နှစ်ခုလုံးရဲ့ ပေါင်းစပ်မှုကို သုံးပြီးလည်း — request တချို့အတွက် Proxy ကို bypass လုပ်နိုင်ပါတယ်:

```js filename="proxy.js"
export const config = {
  matcher: [
    /*
     * အောက်ပါတွေနဲ့ စတင်တာတွေကလွဲပြီး request paths အားလုံးနဲ့ ကိုက်ညီသည်:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      has: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },

    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      has: [{ type: 'header', key: 'x-present' }],
      missing: [{ type: 'header', key: 'x-missing', value: 'prefetch' }],
    },
  ],
}
```

> **သိထားသင့်သည်:**
>
> Negative matcher pattern တစ်ခုထဲမှာ `_next/data` ကို ဖယ်ထုတ်ထားရင်တောင် — `_next/data` routes တွေအတွက် proxy ကို invoke လုပ်နေဦးမှာပါ။ ဒါက page တစ်ခုကို ကာကွယ်ပြီး သက်ဆိုင်တဲ့ data route ကို ကာကွယ်ဖို့ မေ့နေတာလိုမျိုး — မရည်ရွယ်တဲ့ security issues တွေ မဖြစ်အောင် ကာကွယ်တဲ့ ရည်ရွယ်ချက်ရှိရှိ အပြုအမူတစ်ခုပါ။

```js filename="proxy.js"
export const config = {
  matcher:
    '/((?!api|_next/data|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
}

// ဖယ်ထုတ်ထားပေမယ့် Proxy က /_next/data/* routes တွေအတွက် run နေဦးမှာပါ
```

### `waitUntil` နဲ့ `NextFetchEvent`

`NextFetchEvent` object က native [`FetchEvent`](https://developer.mozilla.org/docs/Web/API/FetchEvent) object ကို ချဲ့ထွင်ထားပြီး — [`waitUntil()`](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil) method ပါဝင်ပါတယ်။

`waitUntil()` method က argument တစ်ခုအနေနဲ့ promise တစ်ခုကို လက်ခံပြီး — promise ပြီးမြောက်တဲ့အထိ Proxy ရဲ့ lifetime ကို ရှည်စေပါတယ်။ Background မှာ အလုပ်တွေ လုပ်ဖို့ အသုံးဝင်ပါတယ်။

```ts filename="proxy.ts"
import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'

export function proxy(req: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch('https://my-analytics-platform.com', {
      method: 'POST',
      body: JSON.stringify({ pathname: req.nextUrl.pathname }),
    })
  )

  return NextResponse.next()
}
```

### Unit testing (experimental)

Next.js 15.1 ကစပြီး — `next/experimental/testing/server` package ထဲမှာ proxy files တွေကို unit test လုပ်ဖို့ ကူညီတဲ့ utilities တွေ ပါဝင်ပါတယ်။ Proxy ကို unit test လုပ်တာက — လိုချင်တဲ့ paths တွေပေါ်မှာပဲ run ဖြစ်ပြီး custom routing logic တွေ ရည်ရွယ်ထားတဲ့အတိုင်း အလုပ်လုပ်ကြောင်း — code က production မရောက်ခင် သေချာစေပါတယ်။

`unstable_doesProxyMatch` function ကို သုံးပြီး — ပေးထားတဲ့ URL, headers နဲ့ cookies တွေအတွက် proxy run ဖြစ်မဖြစ် assert လုပ်နိုင်ပါတယ်။

```js
import { unstable_doesProxyMatch } from 'next/experimental/testing/server'

expect(
  unstable_doesProxyMatch({
    config,
    nextConfig,
    url: '/test',
  })
).toEqual(false)
```

Proxy function တစ်ခုလုံးကိုလည်း test လုပ်နိုင်ပါတယ်။

```js
import { isRewrite, getRewrittenUrl } from 'next/experimental/testing/server'

const request = new NextRequest('https://nextjs.org/docs')
const response = await proxy(request)
expect(isRewrite(response)).toEqual(true)
expect(getRewrittenUrl(response)).toEqual('https://other-domain.com/docs')
// Response က redirect တစ်ခုဆိုရင် getRedirectUrl ကိုလည်း သုံးနိုင်ပါတယ်
```

## Platform support

| Deployment Option                                                   | Supported         |
| ------------------------------------------------------------------- | ----------------- |
| [Node.js server](/docs/nextjs/deploying#nodejs-server) | Yes               |
| [Docker container](/docs/nextjs/deploying#docker)      | Yes               |
| [Static export](/docs/nextjs/deploying#static-export)  | No                |
| [Adapters](/docs/nextjs/deploying#adapters)            | Platform-specific |

Next.js ကို self-host လုပ်တဲ့အခါ [Proxy ကို configure လုပ်နည်း](https://nextjs.org/docs/app/guides/self-hosting#proxy) ကို လေ့လာပါ။

## Migration to Proxy

### အဘယ်ကြောင့် အပြောင်းအလဲ လုပ်ရသလဲ

`middleware` ကို အမည်ပြောင်းရတဲ့ အကြောင်းရင်းက — "middleware" ဆိုတဲ့ အသုံးအနှုန်းက Express.js middleware နဲ့ မကြာခဏ ရောထွေးတတ်ပြီး — သူ့ရဲ့ ရည်ရွယ်ချက်ကို အဓိပ္ပာယ် လွဲမှားစေနိုင်လို့ပါ။ ဒါ့အပြင် Middleware က အစွမ်းအစ မြင့်မားလွန်းတာမို့ — အသုံးပြုမှုကို အားပေးသလို ဖြစ်နိုင်ပေမယ့် — ဒီ feature ကို နောက်ဆုံး နည်းလမ်းတစ်ခုအနေနဲ့ပဲ သုံးဖို့ အကြံပြုထားပါတယ်။

Next.js က developers တွေ Middleware မလိုဘဲ သူတို့ရဲ့ ရည်မှန်းချက်တွေကို အောင်မြင်နိုင်အောင် — ergonomics ပိုကောင်းတဲ့ APIs တွေ ပိုပေးဖို့ ရှေ့ကို ရွေ့လျားနေပါတယ်။ ဒါကပဲ `middleware` ကို အမည်ပြောင်းရတဲ့ အကြောင်းရင်းပါ။

### အဘယ်ကြောင့် "Proxy" လဲ

Proxy ဆိုတဲ့ နာမည်က Middleware က ဘာတွေ လုပ်နိုင်လဲ ဆိုတာကို ရှင်းလင်းစေပါတယ်။ "proxy" ဆိုတဲ့ အသုံးအနှုန်းက app ရှေ့မှာ ရှိတဲ့ network boundary တစ်ခုကို ဆိုလိုပြီး — ဒီ feature က အဲဒီလို အပြုအမူမျိုး ရှိပါတယ်။ ဒါက သင့် application ရဲ့ အဓိက runtime ရဲ့ အပြင်ဘက်မှာ run လုပ်ပြီး — requests တွေ သင့် app ဆီ မရောက်ခင် ကိုင်တွယ်နိုင်ပါတယ်။ ဒီလက္ခဏာတွေက "proxy" ဆိုတဲ့ အသုံးအနှုန်းနဲ့ ပိုကိုက်ညီပြီး — feature အတွက် ပိုရှင်းလင်းတဲ့ ရည်ရွယ်ချက်တစ်ခု ပေးပါတယ်။

### ဘယ်လို Migrate လုပ်မလဲ

တခြား options တွေ မရှိမှသာ Middleware ကို အားမကိုးဖို့ အကြံပြုပါတယ်။ သူတို့ရဲ့ ရည်မှန်းချက်တွေကို Middleware မလိုဘဲ အောင်မြင်နိုင်အောင် — ergonomics ပိုကောင်းတဲ့ APIs တွေ ပေးဖို့ပါ။

"middleware" ဆိုတဲ့ အသုံးအနှုန်းက users တွေကို Express.js middleware နဲ့ မကြာခဏ ရောထွေးစေပြီး — အလွဲသုံးစားမှုကို အားပေးနိုင်ပါတယ်။ ကျွန်ုပ်တို့ရဲ့ ဦးတည်ချက်ကို ရှင်းလင်းဖို့ — file convention ကို "proxy" ဆိုပြီး အမည်ပြောင်းနေပါတယ်။ ဒါက Middleware ကနေ ဝေးရာကို ရွေ့နေကြောင်း၊ overloaded ဖြစ်နေတဲ့ features တွေကို ဖြိုဖျက်နေကြောင်း၊ ပြီးတော့ Proxy ရဲ့ ရည်ရွယ်ချက်ကို ရှင်းရှင်းလင်းလင်း ဖြစ်စေကြောင်း မီးမောင်းထိုးပြပါတယ်။

Next.js က `middleware.ts` ကနေ `proxy.ts` ဆီ migrate လုပ်ဖို့ codemod တစ်ခု ပေးထားပါတယ်။ Migrate လုပ်ဖို့ အောက်ပါ command ကို run နိုင်ပါတယ်:

```bash
npx @next/codemod@canary middleware-to-proxy .
```

Codemod က file နဲ့ function name နှစ်ခုလုံးကို `middleware` ကနေ `proxy` အဖြစ် အမည်ပြောင်းပေးပါလိမ့်မယ်။

```diff
// middleware.ts -> proxy.ts

- export function middleware() {
+ export function proxy() {
```

## Version history

| Version   | အပြောင်းအလဲ                                                                                       |
| --------- | --------------------------------------------------------------------------------------------- |
| `v16.0.0` | Middleware ကို deprecated လုပ်ပြီး Proxy အဖြစ် အမည်ပြောင်း။ Proxy က Node.js runtime ကို default သုံးသည်          |
| `v15.5.0` | Middleware က Node.js runtime ကို သုံးနိုင်ပြီ (stable)                                           |
| `v15.2.0` | Middleware က Node.js runtime ကို သုံးနိုင်ပြီ (experimental)                                     |
| `v13.1.0` | Advanced Middleware flags တွေ ထည့်သွင်း                                                               |
| `v13.0.0` | Middleware က request headers, response headers တွေ ပြုပြင်နိုင်ပြီး responses တွေ ပို့နိုင်ပြီ                   |
| `v12.2.0` | Middleware က stable ဖြစ်ပြီ — [upgrade guide](https://nextjs.org/docs/messages/middleware-upgrade-guide) ကို ကြည့်ပါ |
| `v12.0.9` | Edge Runtime ထဲမှာ absolute URLs တွေကို enforce လုပ်သည် ([PR](https://github.com/vercel/next.js/pull/33410))    |
| `v12.0.0` | Middleware (Beta) ထည့်သွင်း                                                                       |
