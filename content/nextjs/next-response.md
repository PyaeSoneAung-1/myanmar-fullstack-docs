---
title: "NextResponse (Web Response API ကို convenience methods များဖြင့် တိုးချဲ့ခြင်း)"
description: "NextResponse class — Web Response API ကို တိုးချဲ့ထားပုံ: response cookies စီမံခြင်း (set, get, getAll, has, delete), json(), redirect(), rewrite(), next() methods များနဲ့ proxy မှာ headers forward လုပ်ရာတွင် သတိထားရမည့်အချက်များ"
order: 142
source: "https://nextjs.org/docs/app/api-reference/functions/next-response"
status: translated
updated: 2026-09-03
---

NextResponse က [Web Response API](https://developer.mozilla.org/docs/Web/API/Response) ကို အပိုဆောင်း convenience methods (အသုံးပြုရ လွယ်ကူစေတဲ့ method များ) တွေနဲ့ တိုးချဲ့ပါတယ်။

## `cookies`

Response ရဲ့ [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) header ကို ဖတ်ခြင်း (သို့) ပြောင်းလဲခြင်း (mutate) ပြုလုပ်ပါတယ်။

### `set(name, value)`

Name တစ်ခု ပေးလိုက်ရင် — response ပေါ်မှာ ပေးထားတဲ့ value နဲ့ cookie တစ်ခုကို set လုပ်ပါတယ်။

```ts
// Given incoming request /home
let response = NextResponse.next()
// Set a cookie to hide the banner
response.cookies.set('show-banner', 'false')
// Response will have a `Set-Cookie:show-banner=false;path=/home` header
return response
```

### `get(name)`

Cookie name တစ်ခု ပေးလိုက်ရင် — cookie ရဲ့ value ကို ပြန်ပေးပါတယ်။ Cookie ကို မတွေ့ရရင် `undefined` ပြန်ပေးပါတယ်။ Cookies အများအပြား တွေ့ရရင် — ပထမဆုံး တစ်ခုကို ပြန်ပေးပါတယ်။

```ts
// Given incoming request /home
let response = NextResponse.next()
// { name: 'show-banner', value: 'false', Path: '/home' }
response.cookies.get('show-banner')
```

### `getAll()`

Cookie name တစ်ခု ပေးလိုက်ရင် — cookie ရဲ့ values တွေ အားလုံးကို ပြန်ပေးပါတယ်။ Name မပေးထားဘူးဆိုရင် — response ပေါ်က cookies အားလုံးကို ပြန်ပေးပါတယ်။

```ts
// Given incoming request /home
let response = NextResponse.next()
// [
//   { name: 'experiments', value: 'new-pricing-page', Path: '/home' },
//   { name: 'experiments', value: 'winter-launch', Path: '/home' },
// ]
response.cookies.getAll('experiments')
// Alternatively, get all cookies for the response
response.cookies.getAll()
```

### `has(name)`

Cookie name တစ်ခု ပေးလိုက်ရင် — cookie က response ပေါ်မှာ တည်ရှိမယ်ဆိုရင် `true` ပြန်ပေးပါတယ်။

```ts
// Given incoming request /home
let response = NextResponse.next()
// Returns true if cookie exists, false if it does not
response.cookies.has('experiments')
```

### `delete(name)`

Cookie name တစ်ခု ပေးလိုက်ရင် — response ကနေ cookie ကို ဖျက်ပစ်ပါတယ်။

```ts
// Given incoming request /home
let response = NextResponse.next()
// Returns true for deleted, false if nothing is deleted
response.cookies.delete('experiments')
```

## `json()`

ပေးထားတဲ့ JSON body နဲ့ response တစ်ခုကို ထုတ်လုပ်ပါတယ်။

```ts filename="app/api/route.ts" switcher
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
```

```js filename="app/api/route.js" switcher
import { NextResponse } from 'next/server'

export async function GET(request) {
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
```

## `redirect()`

[URL](https://developer.mozilla.org/docs/Web/API/URL) တစ်ခုဆီ redirect လုပ်တဲ့ response တစ်ခုကို ထုတ်လုပ်ပါတယ်။

```ts
import { NextResponse } from 'next/server'

return NextResponse.redirect(new URL('/new', request.url))
```

[URL](https://developer.mozilla.org/docs/Web/API/URL) ကို `NextResponse.redirect()` method ထဲမှာ မသုံးခင် — အရင်ဆုံး ဖန်တီးပြီး ပြင်ဆင်လို့ ရပါတယ်။ ဥပမာ — လက်ရှိ URL ကို ရဖို့ `request.nextUrl` property ကို သုံးပြီး — အခြား URL တစ်ခုဆီ redirect လုပ်ဖို့ ပြင်ဆင်နိုင်ပါတယ်။

```ts
import { NextResponse } from 'next/server'

// Given an incoming request...
const loginUrl = new URL('/login', request.url)
// Add ?from=/incoming-url to the /login URL
loginUrl.searchParams.set('from', request.nextUrl.pathname)
// And redirect to the new URL
return NextResponse.redirect(loginUrl)
```

## `rewrite()`

မူရင်း URL ကို ထိန်းသိမ်းထားချိန်မှာ — ပေးထားတဲ့ [URL](https://developer.mozilla.org/docs/Web/API/URL) ကို rewrite (proxy) လုပ်တဲ့ response တစ်ခုကို ထုတ်လုပ်ပါတယ်။

```ts
import { NextResponse } from 'next/server'

// Incoming request: /about, browser shows /about
// Rewritten request: /proxy, browser shows /about
return NextResponse.rewrite(new URL('/proxy', request.url))
```

## `next()`

`next()` method က Proxy အတွက် အသုံးဝင်ပါတယ် — စောစောက ပြန်ထွက်ပြီး routing ကို ဆက်လုပ်ဖို့ ခွင့်ပြုပေးလို့ပါ။

```ts
import { NextResponse } from 'next/server'

return NextResponse.next()
```

Response ထုတ်လုပ်တဲ့အခါ `NextResponse.next({ request: { headers } })` ကို သုံးပြီး — `headers` တွေကို upstream ဆီ forward (ထပ်ဆင့်ပို့) လုပ်နိုင်ပါတယ်:

```ts
import { NextResponse } from 'next/server'

// Given an incoming request...
const newHeaders = new Headers(request.headers)
// Add a new header
newHeaders.set('x-version', '123')
// Forward the modified request headers upstream
return NextResponse.next({
  request: {
    // New request headers
    headers: newHeaders,
  },
})
```

ဒါက `newHeaders` တွေကို target page, route (သို့) server action ဆီ upstream ပို့ပေးပြီး — client ကို မပြပါဘူး။ ဒီ pattern က data တွေကို upstream ပို့ဖို့ အသုံးဝင်ပေမယ့် — ဒီ data တွေ ပါဝင်တဲ့ headers တွေက external services တွေဆီ ထပ်ဆင့် ပို့ခံရနိုင်လို့ — သတိထားပြီးမှ သုံးသင့်ပါတယ်။

ဆန့်ကျင်ဘက်အနေနဲ့ — `NextResponse.next({ headers })` က headers တွေကို proxy ကနေ client ဆီ ပို့တဲ့ shorthand (အတိုကောက် နည်းလမ်း) တစ်ခုပါ။ ဒါက **ကောင်းမွန်တဲ့ အလေ့အကျင့် မဟုတ်ဘဲ** ရှောင်ကြဉ်သင့်ပါတယ်။ အကြောင်းရင်းတွေထဲမှာ — `Content-Type` လိုမျိုး response headers တွေကို သတ်မှတ်လိုက်တာက framework ရဲ့ မျှော်လင့်ချက်တွေကို လွှမ်းမိုးသွားစေနိုင်လို့ပါ (ဥပမာ — Server Actions တွေ သုံးတဲ့ `Content-Type`) — အဲဒါက submissions တွေ မအောင်မြင်တာ (သို့) streaming responses တွေ ပျက်စီးတာအထိ ဖြစ်စေနိုင်ပါတယ်။

```ts
import { type NextRequest, NextResponse } from 'next/server'

async function proxy(request: NextRequest) {
  const headers = await injectAuth(request.headers)
  // DO NOT forward headers like this
  return NextResponse.next({ headers })
}
```

ယေဘုယျအားဖြင့် — incoming request headers တွေ အားလုံးကို ကူးယူတာကို ရှောင်ကြဉ်ပါ — ဒီလိုလုပ်တာက sensitive data တွေကို clients (သို့) upstream services တွေဆီ ပေါက်ကြားစေနိုင်လို့ပါ။

Allow-list (ခွင့်ပြုစာရင်း) သုံးပြီး incoming request headers တွေရဲ့ subset တစ်ခုကို ဖန်တီးတဲ့ defensive approach (ကာကွယ်ရေး နည်းလမ်း) ကို ဦးစားပေးပါ။ ဥပမာ — custom `x-*` headers တွေကို ပယ်ပြီး လုံခြုံတယ်လို့ သိထားတဲ့ headers တွေကိုပဲ forward လုပ်နိုင်ပါတယ်:

```ts
import { type NextRequest, NextResponse } from 'next/server'

function proxy(request: NextRequest) {
  const incoming = new Headers(request.headers)
  const forwarded = new Headers()

  for (const [name, value] of incoming) {
    const headerName = name.toLowerCase()
    // Keep only known-safe headers, discard custom x-* and other sensitive ones
    if (
      !headerName.startsWith('x-') &&
      headerName !== 'authorization' &&
      headerName !== 'cookie'
    ) {
      // Preserve original header name casing
      forwarded.set(name, value)
    }
  }

  return NextResponse.next({
    request: {
      headers: forwarded,
    },
  })
}
```
