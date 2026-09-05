---
title: "Route Handlers (API)"
description: "route.js|ts file တွေနဲ့ Route Handlers ဖန်တီးနည်း — Web Request/Response APIs, supported HTTP methods, NextRequest/NextResponse helpers, GET caching (force-static, Cache Components, use cache), special route handlers, route resolution နဲ့ RouteContext helper"
order: 6
source: "https://nextjs.org/docs/app/getting-started/route-handlers"
status: translated
updated: 2026-09-05
---

## Route Handlers ဆိုတာ ဘာလဲ

Route Handlers တွေက သတ်မှတ်ထားတဲ့ route တစ်ခုအတွက် — Web [Request](https://developer.mozilla.org/docs/Web/API/Request) နဲ့ [Response](https://developer.mozilla.org/docs/Web/API/Response) APIs တွေကို သုံးပြီး custom request handlers တွေ ဖန်တီးနိုင်စေပါတယ်။

> **သိထားသင့်သည်:** Route Handlers တွေကို `app` directory ထဲမှာပဲ ရနိုင်ပါတယ်။ သူတို့က `pages` directory ထဲက [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) တွေနဲ့ ညီမျှပါတယ် — ဆိုလိုတာက API Routes နဲ့ Route Handlers တွေကို အတူတူ သုံးစရာ **မလိုပါဘူး**။

### Convention (စည်းမျဉ်း)

Route Handlers တွေကို `app` directory ထဲမှာ [`route.js|ts` file](/docs/nextjs/file-conventions-route) အနေနဲ့ သတ်မှတ်ပါတယ်:

```ts filename="app/api/route.ts" switcher
export async function GET(request: Request) {}
```

```js filename="app/api/route.js" switcher
export async function GET(request) {}
```

Route Handlers တွေကို `app` directory ထဲမှာ ဘယ်နေရာမဆို — `page.js` နဲ့ `layout.js` တွေလိုပဲ — nested လုပ်ပြီး ထားနိုင်ပါတယ်။ ဒါပေမယ့် `page.js` နဲ့ **တူညီတဲ့ route segment level မှာ `route.js` file တစ်ခု မရှိနိုင်ပါဘူး**။

### Supported HTTP Methods (ထောက်ပံ့ထားသော HTTP Methods)

အောက်ပါ [HTTP methods](https://developer.mozilla.org/docs/Web/HTTP/Methods) တွေကို ထောက်ပံ့ပေးပါတယ်: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`။ မထောက်ပံ့တဲ့ method တစ်ခုနဲ့ ခေါ်ရင် — Next.js က `405 Method Not Allowed` response တစ်ခု ပြန်ပို့ပါတယ်။

### Extended `NextRequest` and `NextResponse` APIs

Native [Request](https://developer.mozilla.org/docs/Web/API/Request) နဲ့ [Response](https://developer.mozilla.org/docs/Web/API/Response) APIs တွေကို ထောက်ပံ့တာအပြင် — Next.js က အဆင့်မြင့် use cases တွေအတွက် အဆင်ပြေတဲ့ helpers တွေ ရရှိစေဖို့ [`NextRequest`](/docs/nextjs/next-request) နဲ့ [`NextResponse`](/docs/nextjs/next-response) တွေနဲ့ extend လုပ်ပေးပါတယ်။

### Caching

Route Handlers တွေကို default အနေနဲ့ cache မလုပ်ပါဘူး။ ဒါပေမယ့် — `GET` methods တွေအတွက်တော့ cache လုပ်ဖို့ opt in လုပ်နိုင်ပါတယ်။ တခြား supported HTTP methods တွေကိုတော့ **cache မလုပ်ပါဘူး**။ `GET` method တစ်ခုကို cache လုပ်ဖို့ — Route Handler file ထဲမှာ [route config option](/docs/nextjs/caching-without-cache-components#dynamic) တစ်ခု (ဥပမာ `export const dynamic = 'force-static'`) ကို သုံးပါ။

```ts filename="app/items/route.ts" switcher
export const dynamic = 'force-static'

export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()

  return Response.json({ data })
}
```

```js filename="app/items/route.js" switcher
export const dynamic = 'force-static'

export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()

  return Response.json({ data })
}
```

> **သိထားသင့်သည်:** တခြား supported HTTP methods တွေကိုတော့ — တူညီတဲ့ file ထဲမှာ cache လုပ်ထားတဲ့ `GET` method တစ်ခုရဲ့ ဘေးမှာ ထားထားရင်တောင် — **cache မလုပ်ပါဘူး**။

#### With Cache Components

[Cache Components](/docs/nextjs/caching) enable လုပ်ထားတဲ့အခါ — `GET` Route Handlers တွေက သင့် application ထဲက ပုံမှန် UI routes တွေနဲ့ တူညီတဲ့ model ကို လိုက်နာပါတယ်။ သူတို့က default အနေနဲ့ request time မှာ run ပြီး — uncached (သို့) runtime data တွေကို ဝင်ရောက် မသုံးဘူးဆိုရင် prerender လုပ်လို့ရပါတယ်။ Static response ထဲမှာ uncached data တွေ ထည့်သွင်းဖို့ `use cache` ကိုလည်း သုံးနိုင်ပါတယ်။

**Static ဥပမာ** — uncached (သို့) runtime data တွေကို မသုံးတာမို့ build time မှာ prerender လုပ်ပါလိမ့်မယ်:

```tsx filename="app/api/project-info/route.ts"
export async function GET() {
  return Response.json({
    projectName: 'Next.js',
  })
}
```

**Dynamic ဥပမာ** — non-deterministic (ကြိုတင် ခန့်မှန်းလို့မရတဲ့) operations တွေကို ဝင်ရောက် သုံးပါတယ်။ Build လုပ်ချိန်မှာ `Math.random()` ကို ခေါ်လိုက်တာနဲ့ prerendering ရပ်ပြီး — request-time rendering ဆီ လွှဲပေးလိုက်ပါတယ်:

```tsx filename="app/api/random-number/route.ts"
export async function GET() {
  return Response.json({
    randomNumber: Math.random(),
  })
}
```

**Runtime data ဥပမာ** — request-specific data တွေကို ဝင်ရောက် သုံးပါတယ်။ Prerendering က `headers()` လို runtime APIs တွေကို ခေါ်လိုက်တာနဲ့ ရပ်သွားပါတယ်:

```tsx filename="app/api/user-agent/route.ts"
import { headers } from 'next/headers'

export async function GET() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')

  return Response.json({ userAgent })
}
```

> **သိထားသင့်သည်:** `GET` handler က network requests, database queries, async file system operations, request object properties တွေ (`req.url`, `request.headers`, `request.cookies`, `request.body` လိုမျိုး), runtime APIs တွေ ([`cookies()`](/docs/nextjs/cookies), [`headers()`](/docs/nextjs/headers), [`connection()`](/docs/nextjs/connection) လိုမျိုး) (သို့) non-deterministic operations တွေကို ဝင်ရောက် သုံးရင် — prerendering ရပ်သွားပါတယ်။

**Cached ဥပမာ** — uncached data (database query) တစ်ခုကို ဝင်ရောက်ပေမယ့် `use cache` နဲ့ cache လုပ်ထားလို့ — prerendered response ထဲမှာ ထည့်သွင်းနိုင်ပါတယ်:

```tsx filename="app/api/products/route.ts"
import { cacheLife } from 'next/cache'

export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}

async function getProducts() {
  'use cache'
  cacheLife('hours')

  return await db.query('SELECT * FROM products')
}
```

> **သိထားသင့်သည်:** `use cache` ကို Route Handler body ထဲမှာ တိုက်ရိုက် သုံးလို့ မရပါဘူး — helper function တစ်ခုထဲကို ထုတ်ယူပါ။ Cached responses တွေက request အသစ်တစ်ခု ရောက်လာတဲ့အခါ `cacheLife` အတိုင်း revalidate လုပ်ပါတယ်။

### Special Route Handlers (အထူး Route Handlers)

[`sitemap.ts`](/docs/nextjs/sitemap), [`opengraph-image.tsx`](/docs/nextjs/opengraph-image), [`icon.tsx`](/docs/nextjs/app-icons) လို Special Route Handlers တွေနဲ့ တခြား [metadata files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata) တွေက — Request-time APIs (သို့) dynamic config options တွေ မသုံးရင် — default အနေနဲ့ static အဖြစ် ကျန်နေပါတယ်။

### Route Resolution (Route ဖြေရှင်းပုံ)

`route` ကို အနိမ့်ဆုံး level ရဲ့ routing primitive အဖြစ် သဘောထားနိုင်ပါတယ်။

- သူတို့က `page` လိုမျိုး layouts (သို့) client-side navigations တွေမှာ **ပါဝင် မလုပ်ပါဘူး**။
- `page.js` နဲ့ တူညီတဲ့ route မှာ `route.js` file တစ်ခု **မရှိနိုင်ပါဘူး**။

| Page | Route | Result |
| --- | --- | --- |
| `app/page.js` | `app/route.js` | Conflict |
| `app/page.js` | `app/api/route.js` | Valid |
| `app/[user]/page.js` | `app/api/route.js` | Valid |

`route.js` (သို့) `page.js` file တစ်ခုချင်းစီက အဲဒီ route အတွက် HTTP verbs အားလုံးကို ယူလွှဲ (take over) ပါတယ်။

```ts filename="app/page.ts" switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}

// Conflict
// `app/route.ts`
export async function POST(request: Request) {}
```

```js filename="app/page.js" switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}

// Conflict
// `app/route.js`
export async function POST(request) {}
```

Route Handlers တွေက သင့် [frontend application ကို ဘယ်လို ဖြည့်စွမ်းပေးလဲ](/docs/nextjs/backend-for-frontend) ဆိုတာ ပိုဖတ်ပါ — (သို့) Route Handlers ရဲ့ [API Reference](/docs/nextjs/file-conventions-route) ကို လေ့လာပါ။

### Route Context Helper

TypeScript မှာ — global အနေနဲ့ ရရှိနိုင်တဲ့ [`RouteContext`](/docs/nextjs/file-conventions-route#route-context-helper) helper ကို သုံးပြီး Route Handlers တွေရဲ့ `context` parameter ကို type လုပ်နိုင်ပါတယ်:

```ts filename="app/users/[id]/route.ts" switcher
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/users/[id]'>) {
  const { id } = await ctx.params
  return Response.json({ id })
}
```

> **သိထားသင့်သည်:**
>
> - Types တွေကို `next dev`, `next build` (သို့) `next typegen` လုပ်ချိန်မှာ generate လုပ်ပါတယ်။
