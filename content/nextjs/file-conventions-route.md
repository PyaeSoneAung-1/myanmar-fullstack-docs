---
title: "route.js (Route Handlers — custom request handlers)"
description: "route.js|ts file convention — Web Request/Response APIs နဲ့ route တစ်ခုအတွက် custom request handlers (GET/POST/...), params/context typing, caching, revalidation, streaming, CORS စတာတွေ"
order: 46
source: "https://nextjs.org/docs/app/api-reference/file-conventions/route"
status: translated
updated: 2026-09-02
---

Route Handlers တွေက Web [Request](https://developer.mozilla.org/docs/Web/API/Request) နဲ့ [Response](https://developer.mozilla.org/docs/Web/API/Response) APIs တွေကို သုံးပြီး — route တစ်ခုအတွက် custom request handlers တွေ ဖန်တီးနိုင်စေပါတယ်။

```ts
// app/api/route.ts
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

## Reference

### HTTP Methods

**route** file တစ်ခုက အောက်ပါ [HTTP methods](https://developer.mozilla.org/docs/Web/HTTP/Methods) တွေကို ထောက်ပံ့ပါတယ်: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`။

```ts
// app/api/route.ts
export async function GET(request: Request) {}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and set the appropriate Response `Allow` header depending on the other methods defined in the Route Handler.
export async function OPTIONS(request: Request) {}
```

### Parameters

#### `request` (optional)

`request` object က [NextRequest](https://nextjs.org/docs/app/api-reference/functions/next-request) object တစ်ခုပါ — Web [Request](https://developer.mozilla.org/docs/Web/API/Request) API ရဲ့ extension ဖြစ်ပြီး incoming request အပေါ် ပိုပြီး ထိန်းချုပ်နိုင်စေပါတယ်။ `cookies` တွေကို လွယ်လွယ်ကူကူ ဝင်ရောက်နိုင်သလို — parse လုပ်ပြီးသား URL object `nextUrl` ကိုပါ ရရှိပါတယ်။

```ts
// app/api/route.ts
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl
}
```

#### `context` (optional)

- **`params`**: လက်ရှိ route ရဲ့ [dynamic route parameters](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) တွေ ပါဝင်တဲ့ object တစ်ခုကို resolve လုပ်ပေးတဲ့ promise တစ်ခုပါ။

```ts
// app/dashboard/[team]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ team: string }> }
) {
  const { team } = await params
}
```

| ဥပမာ                            | URL            | `params`                           |
| -------------------------------- | -------------- | ---------------------------------- |
| `app/dashboard/[team]/route.js`  | `/dashboard/1` | `Promise<{ team: '1' }>`           |
| `app/shop/[tag]/[item]/route.js` | `/shop/1/2`    | `Promise<{ tag: '1', item: '2' }>` |
| `app/blog/[...slug]/route.js`    | `/blog/1/2`    | `Promise<{ slug: ['1', '2'] }>`    |

#### Route Context Helper

`RouteContext` ကို သုံးပြီး route literal တစ်ခုကနေ `params` တွေကို strongly typed ရယူနိုင်ပါတယ် — `RouteContext` က global အနေနဲ့ ရရှိနိုင်တဲ့ helper တစ်ခုပါ။

```ts
// app/users/[id]/route.ts
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/users/[id]'>) {
  const { id } = await ctx.params
  return Response.json({ id })
}
```

> **သိထားသင့်သည်:**
>
> - Types တွေကို `next dev`, `next build` (သို့) `next typegen` လုပ်ချိန်မှာ generate လုပ်ပါတယ်။
> - Type generation ပြီးရင် `RouteContext` helper က global ရနိုင်ပါပြီ — import လုပ်စရာ မလိုပါဘူး။

## ဥပမာများ

### Cookies

`next/headers` ကနေ [`cookies`](/docs/nextjs/cookies) ကို သုံးပြီး cookies တွေ ဖတ်/သတ်မှတ်နိုင်ပါတယ်။

```ts
// app/api/route.ts
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  const a = cookieStore.get('a')
  const b = cookieStore.set('b', '1')
  const c = cookieStore.delete('c')
}
```

တနည်းအားဖြင့် — [`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie) header ပါတဲ့ `Response` အသစ်တစ်ခုကို ပြန်ပို့နိုင်ပါတယ်။

```ts
// app/api/route.ts
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token.value}` },
  })
}
```

Web APIs အခြေခံကို သုံးချင်ရင်လည်း — request ကနေ cookies တွေကို တိုက်ရိုက် ဖတ်နိုင်ပါတယ် ([`NextRequest`](https://nextjs.org/docs/app/api-reference/functions/next-request)):

```ts
// app/api/route.ts
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')
}
```

### Headers

`next/headers` ကနေ [`headers`](/docs/nextjs/headers) ကို သုံးပြီး headers တွေ ဖတ်နိုင်ပါတယ်။ ဒီ `headers` instance က **read-only** ပါ — headers တွေ သတ်မှတ်ချင်ရင် `headers` အသစ်ပါတဲ့ `Response` အသစ်တစ်ခုကို ပြန်ပို့ရပါမယ်။

```ts
// app/api/route.ts
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const headersList = await headers()
  const referer = headersList.get('referer')

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  })
}
```

### Cached Data များ Revalidate လုပ်ခြင်း

`revalidate` route segment config option ကို သုံးပြီး [cached data တွေကို revalidate](https://nextjs.org/docs/app/guides/incremental-static-regeneration) လုပ်နိုင်ပါတယ်:

```ts
// app/posts/route.ts
export const revalidate = 60

export async function GET() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()

  return Response.json(posts)
}
```

### Redirects

```ts
// app/api/route.ts
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  redirect('https://nextjs.org/')
}
```

### Dynamic Route Segments

Route Handlers တွေက [Dynamic Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) တွေကို သုံးပြီး dynamic data ကနေ request handlers တွေ ဖန်တီးနိုင်ပါတယ်။

```ts
// app/items/[slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params // 'a', 'b', or 'c'
}
```

#### `generateStaticParams` နဲ့ static generation

[`generateStaticParams`](/docs/nextjs/generate-static-params) ကို dynamic Route Handlers တွေနဲ့ တွဲသုံးပြီး — သတ်မှတ်ထားတဲ့ params တွေအတွက် responses တွေကို build time မှာ statically generate လုပ်နိုင်ပြီး၊ ကျန် params တွေကို request time မှာ dynamically ကိုင်တွယ်နိုင်ပါတယ်။ [Cache Components](https://nextjs.org/docs/app/getting-started/caching) သုံးနေရင် — `generateStaticParams` ကို `use cache` နဲ့ တွဲပြီး prerendered ရော runtime params အတွက်ပါ data caching ဖွင့်နိုင်ပါတယ်။ ဥပမာတွေအတွက် [Route Handlers နဲ့ generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params#with-route-handlers) documentation ကို ကြည့်ပါ။

### URL Query Parameters

Route Handler ဆီ ပို့လိုက်တဲ့ request object က `NextRequest` instance ဖြစ်လို့ — query parameters တွေကို ပိုလွယ်ကူစွာ ကိုင်တွယ်နိုင်တဲ့ [convenience methods](https://nextjs.org/docs/app/api-reference/functions/next-request#nexturl) တွေ ပါဝင်ပါတယ်။

```ts
// app/api/search/route.ts
import { type NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  // query is "hello" for /api/search?query=hello
}
```

### Streaming

Streaming ကို Large Language Models (LLMs) တွေနဲ့ တွဲသုံးလေ့ ရှိပါတယ် — ဥပမာ OpenAI လိုမျိုး AI-generated content တွေအတွက်။ [AI SDK](https://sdk.vercel.ai/docs/introduction) အကြောင်း ပိုလေ့လာပါ။

```ts
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai'
import { StreamingTextResponse, streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })

  return new StreamingTextResponse(result.toAIStream())
}
```

ဒီ abstractions တွေက stream တစ်ခု ဖန်တီးဖို့ Web APIs တွေကို သုံးပါတယ်။ အခြေခံ Web APIs တွေကိုလည်း တိုက်ရိုက် သုံးနိုင်ပါတယ် — ဥပမာ async iterator တစ်ခုကို [`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream) အဖြစ် ပြောင်းပြီး `Response` အဖြစ် ပြန်ပို့တာမျိုးပါ။

### Request Body

Standard Web API methods တွေကို သုံးပြီး `Request` body ကို ဖတ်နိုင်ပါတယ်:

```ts
// app/items/route.ts
export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ res })
}
```

### Request Body FormData

`request.formData()` function ကို သုံးပြီး `FormData` ကို ဖတ်နိုင်ပါတယ်:

```ts
// app/items/route.ts
export async function POST(request: Request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return Response.json({ name, email })
}
```

`formData` ရဲ့ data တွေက string တွေအားလုံး ဖြစ်လို့ — request ကို validate လုပ်ပြီး ကိုယ်လိုချင်တဲ့ format နဲ့ (ဥပမာ `number`) ရယူချင်ရင် [`zod-form-data`](https://www.npmjs.com/zod-form-data) ကို သုံးနိုင်ပါတယ်။

### CORS

Standard Web API methods တွေကို သုံးပြီး Route Handler တစ်ခုအတွက် CORS headers တွေ သတ်မှတ်နိုင်ပါတယ်:

```ts
// app/api/route.ts
export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

> **သိထားသင့်သည်:** Route Handlers အများအပြားအတွက် CORS headers တွေ ထည့်ချင်ရင် — [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#cors) (သို့) [`next.config.js` file](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers#cors) ကို သုံးနိုင်ပါတယ်။

### Webhooks

Third-party services တွေဆီက webhooks တွေ လက်ခံဖို့ Route Handler ကို သုံးနိုင်ပါတယ်:

```ts
// app/api/route.ts
export async function POST(request: Request) {
  try {
    const text = await request.text()
    // Process the webhook payload
  } catch (error) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    })
  }

  return new Response('Success!', {
    status: 200,
  })
}
```

ထူးခြားချက် — Pages Router ရဲ့ API Routes တွေနဲ့ မတူဘဲ၊ ဒီမှာ `bodyParser` (သို့) အပိုဆောင်း configuration တွေ သုံးစရာ မလိုပါဘူး။

### UI မဟုတ်တဲ့ Responses

Route Handlers တွေကို UI မဟုတ်တဲ့ content တွေ ပြန်ပို့ဖို့လည်း သုံးနိုင်ပါတယ် — [`sitemap.xml`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts), [`robots.txt`](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file), [app icons](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx), [open graph images](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) တွေက built-in support ရှိတာ သတိပြုပါ။

```ts
// app/rss.xml/route.ts
export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">

<channel>
  <title>Next.js Documentation</title>
  <link>https://nextjs.org/docs</link>
  <description>The React Framework for the Web</description>
</channel>

</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
  )
}
```

### Segment Config Options

Route Handlers တွေက pages နဲ့ layouts တွေလိုပဲ — တူညီတဲ့ [route segment configuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) options တွေကို သုံးပါတယ်။

```ts
// app/items/route.ts
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto' // deprecated
```

## Version History

| Version      | အပြောင်းအလဲ                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| `v15.0.0-RC` | `context.params` က promise ဖြစ်လာ။ [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#150) ရနိုင်ပါတယ် |
| `v15.0.0-RC` | `GET` handlers တွေရဲ့ default caching ကို static ကနေ dynamic အဖြစ် ပြောင်း                       |
| `v13.2.0`    | Route Handlers စတင် မိတ်ဆက်                                                                            |
