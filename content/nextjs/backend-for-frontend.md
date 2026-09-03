---
title: "Backend for Frontend (frontend အတွက် backend အဖြစ် Next.js ကို အသုံးပြုခြင်း)"
description: "Next.js ကို သင့် frontend ရဲ့ backend အဖြစ် သုံးနည်း — Route Handlers, proxy နဲ့ rewrites တွေကနေ HTTP requests ကိုင်တွယ်ပြီး JSON, XML, images စတဲ့ content types အမျိုးမျိုး ပြန်ပို့ခြင်း, data ပြောင်းလဲခြင်း, security နဲ့ caveats"
order: 222
source: "https://nextjs.org/docs/app/guides/backend-for-frontend"
status: translated
updated: 2026-09-03
---

Next.js က "Backend for Frontend" pattern ကို ပံ့ပိုးပေးပါတယ်။ ဒါက သင့်ကို — HTTP requests တွေ ကိုင်တွယ်ဖို့ နဲ့ HTML တင် မဟုတ်ဘဲ content type မရွေး ဘာအမျိုးအစားကိုမဆို ပြန်ပို့နိုင်တဲ့ — public endpoints တွေ ဖန်တီးနိုင်စေပါတယ်။ ဒါ့အပြင် data sources တွေဆီ ဝင်ရောက်ပြီး — remote data တွေကို update လုပ်တာလို side effects တွေကိုပါ လုပ်ဆောင်နိုင်ပါတယ်။

ပရောဂျက်အသစ်တစ်ခု စတင်နေတယ်ဆိုရင် — `create-next-app` ကို `--api` flag နဲ့ သုံးတာက သင့်ပရောဂျက်ရဲ့ `app/` folder ထဲမှာ API endpoint တစ်ခုကို ဘယ်လို ဖန်တီးရမလဲဆိုတာ ပြသထားတဲ့ ဥပမာ `route.ts` တစ်ခုကို အလိုအလျောက် ထည့်သွင်းပေးပါတယ်။

```bash package="pnpm"
pnpm create next-app --api
```

```bash package="npm"
npx create-next-app@latest --api
```

```bash package="yarn"
yarn create next-app --api
```

```bash package="bun"
bun create next-app --api
```

> **သိထားသင့်သည်:** Next.js ရဲ့ backend စွမ်းဆောင်ချက်တွေက backend တစ်ခုလုံးရဲ့ အစားထိုးတော့ မဟုတ်ပါဘူး။ ၎င်းတို့က API layer တစ်ခုအနေနဲ့ ဆောင်ရွက်ပြီး —
>
> - အများပြည်သူ ဝင်ရောက်လို့ရတယ်
> - HTTP request မရွေး ကိုင်တွယ်နိုင်တယ်
> - content type မရွေး ပြန်ပို့နိုင်တယ်

ဒီ pattern ကို အကောင်အထည်ဖော်ဖို့ သုံးပါ:

- [Route Handlers](/docs/nextjs/file-conventions-route)
- [`proxy`](/docs/nextjs/file-conventions-proxy)
- Pages Router မှာ [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)

## Public Endpoints (အများသုံး endpoints)

Route Handlers တွေက public HTTP endpoints တွေပါ — client မရွေး ဝင်ရောက်လို့ရပါတယ်။

`route.ts` (သို့) `route.js` file convention ကို သုံးပြီး Route Handler တစ်ခု ဖန်တီးပါ:

```ts filename="/app/api/route.ts" switcher
export function GET(request: Request) {}
```

```js filename="/app/api/route.js" switcher
export function GET(request) {}
```

ဒါက `/api` ဆီ ပို့လိုက်တဲ့ `GET` requests တွေကို ကိုင်တွယ်ပါတယ်။

Exception (ခြွင်းချက်) ဖြစ်နိုင်ခြေရှိတဲ့ လုပ်ဆောင်ချက်တွေအတွက် `try/catch` blocks တွေကို သုံးပါ:

```ts filename="/app/api/route.ts" switcher
import { submit } from '@/lib/submit'

export async function POST(request: Request) {
  try {
    await submit(request)
    return new Response(null, { status: 204 })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error'

    return new Response(message, { status: 500 })
  }
}
```

```js filename="/app/api/route.js" switcher
import { submit } from '@/lib/submit'

export async function POST(request) {
  try {
    await submit(request)
    return new Response(null, { status: 204 })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error'

    return new Response(message, { status: 500 })
  }
}
```

Client ဆီ ပို့တဲ့ error messages တွေထဲမှာ ထိခိုက်လွယ်တဲ့ (sensitive) အချက်အလက်တွေ ဖော်ပြမိအောင် ရှောင်ပါ။

ဝင်ရောက်ခွင့် ကန့်သတ်ဖို့အတွက် authentication နဲ့ authorization ကို အကောင်အထည်ဖော်ပါ။ [Authentication](/docs/nextjs/authentication) ကို ကြည့်ပါ။

## Content types (content အမျိုးအစားများ)

Route Handlers တွေကို သုံးပြီး — JSON, XML, images, files နဲ့ plain text အပါအဝင် — UI မဟုတ်တဲ့ (non-UI) responses တွေကိုပါ ပြန်ပို့လို့ရပါတယ်။

Next.js က အသုံးများတဲ့ endpoints တွေအတွက် file conventions တွေကို သုံးပါတယ်:

- [`sitemap.xml`](/docs/nextjs/sitemap)
- [`opengraph-image.jpg`, `twitter-image`](/docs/nextjs/opengraph-image)
- [favicon, app icon နဲ့ apple-icon](/docs/nextjs/app-icons)
- [`manifest.json`](/docs/nextjs/manifest)
- [`robots.txt`](/docs/nextjs/robots)

ဒါ့အပြင် ကိုယ်ပိုင် custom တွေလည်း သတ်မှတ်လို့ရပါတယ်၊ ဥပမာ:

- `llms.txt`
- `rss.xml`
- `.well-known`

ဥပမာ — `app/rss.xml/route.ts` က `rss.xml` အတွက် Route Handler တစ်ခုကို ဖန်တီးပေးပါတယ်။

```ts filename="/app/rss.xml/route.ts" switcher
export async function GET(request: Request) {
  const rssResponse = await fetch(/* rss endpoint */)
  const rssData = await rssResponse.json()

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
 <title>${rssData.title}</title>
 <description>${rssData.description}</description>
 <link>${rssData.link}</link>
 <copyright>${rssData.copyright}</copyright>
 ${rssData.items.map((item) => {
   return `<item>
    <title>${item.title}</title>
    <description>${item.description}</description>
    <link>${item.link}</link>
    <pubDate>${item.publishDate}</pubDate>
    <guid isPermaLink="false">${item.guid}</guid>
 </item>`
 })}
</channel>
</rss>`

  const headers = new Headers({ 'content-type': 'application/xml' })

  return new Response(rssFeed, { headers })
}
```

```js filename="/app/rss.xml/route.js" switcher
export async function GET(request) {
  const rssResponse = await fetch(/* rss endpoint */)
  const rssData = await rssResponse.json()

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
 <title>${rssData.title}</title>
 <description>${rssData.description}</description>
 <link>${rssData.link}</link>
 <copyright>${rssData.copyright}</copyright>
 ${rssData.items.map((item) => {
   return `<item>
    <title>${item.title}</title>
    <description>${item.description}</description>
    <link>${item.link}</link>
    <pubDate>${item.publishDate}</pubDate>
    <guid isPermaLink="false">${item.guid}</guid>
 </item>`
 })}
</channel>
</rss>`

  const headers = new Headers({ 'content-type': 'application/xml' })

  return new Response(rssFeed, { headers })
}
```

Markup ထုတ်လုပ်ဖို့ သုံးတဲ့ input တွေကို sanitize (သန့်စင်) လုပ်ပါ။

### Content negotiation (content အမျိုးအစား ညှိနှိုင်းခြင်း)

Request ရဲ့ `Accept` header ကို အခြေခံပြီး — URL တစ်ခုတည်းကနေ content type အမျိုးမျိုး ပြန်ပို့ဖို့ [rewrites](/docs/nextjs/next-config-rewrites) ကို header matching နဲ့တွဲ သုံးနိုင်ပါတယ်။ ဒါကို [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) လို့ ခေါ်ပါတယ်။

ဥပမာ — documentation site တစ်ခုက `/docs/…` URL တစ်ခုတည်းကနေ — browser တွေဆီ HTML pages တွေ ပို့ပြီး — AI agents တွေဆီတော့ raw Markdown ကို ပို့နိုင်ပါတယ်။

**1. `Accept` header နဲ့ ကိုက်ညီတဲ့ rewrite တစ်ခု configure လုပ်ပါ:**

```js filename="next.config.js"
module.exports = {
  async rewrites() {
    return [
      {
        source: '/docs/:slug*',
        destination: '/docs/md/:slug*',
        has: [
          {
            type: 'header',
            key: 'accept',
            value: '(.*)text/markdown(.*)',
          },
        ],
      },
    ]
  },
}
```

`/docs/getting-started` ဆီ request တစ်ခုမှာ `Accept: text/markdown` ပါလာရင် — rewrite က အဲဒီ request ကို `/docs/md/getting-started` ဆီ လမ်းကြောင်းပြောင်း ပို့ပါတယ်။ အဲဒီ path မှာရှိတဲ့ Route Handler က Markdown response ကို ပြန်ပို့ပါတယ်။ `Accept` header ထဲမှာ `text/markdown` မပါတဲ့ clients တွေကတော့ ပုံမှန် HTML page ကိုပဲ ဆက်လက် ရရှိပါတယ်။

**2. Markdown response အတွက် Route Handler တစ်ခု ဖန်တီးပါ:**

```ts filename="app/docs/md/[...slug]/route.ts" switcher
import { getDocsMd, generateDocsStaticParams } from '@/lib/docs'

export async function generateStaticParams() {
  return generateDocsStaticParams()
}

export async function GET(_: Request, ctx: RouteContext<'/docs/md/[...slug]'>) {
  const { slug } = await ctx.params
  const mdDoc = await getDocsMd({ slug })

  if (mdDoc == null) {
    return new Response(null, { status: 404 })
  }

  return new Response(mdDoc, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
    },
  })
}
```

```js filename="app/docs/md/[...slug]/route.js" switcher
import { getDocsMd, generateDocsStaticParams } from '@/lib/docs'

export async function generateStaticParams() {
  return generateDocsStaticParams()
}

export async function GET(_, { params }) {
  const { slug } = await params
  const mdDoc = await getDocsMd({ slug })

  if (mdDoc == null) {
    return new Response(null, { status: 404 })
  }

  return new Response(mdDoc, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
    },
  })
}
```

[`Vary: Accept`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) response header က caches တွေကို — response body က `Accept` request header ပေါ်မှာ မူတည်တယ်ဆိုတာ — အသိပေးပါတယ်။ ဒါမပါဘဲနဲ့ — shared cache တစ်ခုက cached Markdown response ကို browser တစ်ခုဆီ (သို့) အပြန်အလှန်အားဖြင့် ပေးမိနိုင်ပါတယ်။ Hosting providers အများစုက `Accept` header ကို သူတို့ရဲ့ cache key ထဲမှာ ထည့်ပြီးသား ဖြစ်ပေမယ့် — `Vary` ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ထားခြင်းက CDN တွေနဲ့ proxy caches အားလုံးမှာ မှန်ကန်တဲ့ အပြုအမူ ဖြစ်စေဖို့ အာမခံပါတယ်။

`generateStaticParams` က Markdown variants တွေကို build time မှာ ကြိုတင် render (pre-render) လုပ်နိုင်စေလို့ — request တိုင်းမှာ origin server ကို မထိဘဲ — edge ကနေ ပြန်ပို့လို့ရပါတယ်။

**3. `curl` နဲ့ စမ်းသပ်ကြည့်ပါ:**

```bash
# Markdown ပြန်ပို့သည်
curl -H "Accept: text/markdown" https://example.com/docs/getting-started

# ပုံမှန် HTML page ပြန်ပို့သည်
curl https://example.com/docs/getting-started
```

> **သိထားသင့်သည်:**
>
> - `/docs/md/...` route က rewrite မပါဘဲလည်း တိုက်ရိုက် ဝင်ရောက်လို့ရနေပါသေးတယ်။ သူ့ကို rewrite ကနေတစ်ဆင့်ပဲ သုံးစေချင်တယ်ဆိုရင် — မျှော်လင့်ထားတဲ့ `Accept` header မပါတဲ့ တိုက်ရိုက် requests တွေကို ပိတ်ဆို့ဖို့ [`proxy`](/docs/nextjs/file-conventions-proxy) ကို သုံးပါ။
> - ပိုပြီး အဆင့်မြင့်တဲ့ negotiation logic တွေအတွက်ဆိုရင် — rewrites အစား ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် ဖြစ်တဲ့ [`proxy`](/docs/nextjs/file-conventions-proxy) ကို သုံးနိုင်ပါတယ်။

### Consuming request payloads (request body များကို ဖတ်ယူခြင်း)

Request body ကို ဝင်ရောက်ဖို့ — `.json()`, `.formData()` (သို့) `.text()` လို Request [instance methods](https://developer.mozilla.org/en-US/docs/Web/API/Request#instance_methods) တွေကို သုံးပါ။

`GET` နဲ့ `HEAD` requests တွေမှာ body မပါပါဘူး။

```ts filename="/app/api/echo-body/route.ts" switcher
export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ res })
}
```

```js filename="/app/api/echo-body/route.js" switcher
export async function POST(request) {
  const res = await request.json()
  return Response.json({ res })
}
```

> **သိထားသင့်သည်:** တခြား systems တွေဆီ မပို့ခင် data တွေကို validate (စစ်ဆေးအတည်ပြု) လုပ်ပါ။

```ts filename="/app/api/send-email/route.ts" switcher
import { sendMail, validateInputs } from '@/lib/email-transporter'

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = formData.get('email')
  const contents = formData.get('contents')

  try {
    await validateInputs({ email, contents })
    const info = await sendMail({ email, contents })

    return Response.json({ messageId: info.messageId })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

```js filename="/app/api/send-email/route.js" switcher
import { sendMail, validateInputs } from '@/lib/email-transporter'

export async function POST(request) {
  const formData = await request.formData()
  const email = formData.get('email')
  const contents = formData.get('contents')

  try {
    await validateInputs({ email, contents })
    const info = await sendMail({ email, contents })

    return Response.json({ messageId: info.messageId })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

Request body ကို တစ်ခါပဲ ဖတ်လို့ရပါတယ်။ နောက်တစ်ခါ ပြန်ဖတ်ဖို့ လိုရင် — request ကို clone လုပ်ပါ:

```ts filename="/app/api/clone/route.ts" switcher
export async function POST(request: Request) {
  try {
    const clonedRequest = request.clone()

    await request.text()
    await clonedRequest.text()
    await request.text() // Error ဖြစ်စေသည်

    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 500 })
  }
}
```

```js filename="/app/api/clone/route.js" switcher
export async function POST(request) {
  try {
    const clonedRequest = request.clone()

    await request.text()
    await clonedRequest.text()
    await request.text() // Error ဖြစ်စေသည်

    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 500 })
  }
}
```

## Data များကို ပြောင်းလဲ ခြယ်လှယ်ခြင်း (Manipulating data)

Route Handlers တွေက source တစ်ခု (သို့) အများကနေ data တွေကို transform (ပုံစံပြောင်း), filter (စစ်ထုတ်) နဲ့ aggregate (စုစည်း) လုပ်နိုင်ပါတယ်။ ဒါက logic တွေကို frontend ပြင်ပမှာ ထားနိုင်စေပြီး — internal systems တွေကို ထိတွေ့ခြင်းကနေ ရှောင်ရှားနိုင်ပါတယ်။

ဒါ့အပြင် — လေးလံတဲ့ တွက်ချက်မှုတွေကို server ဆီ လွှဲပြောင်းလိုက်လို့ — client ရဲ့ battery နဲ့ data usage ကို လျှော့ချနိုင်ပါတယ်။

```ts file="/app/api/weather/route.ts" switcher
import { parseWeatherData } from '@/lib/weather'

export async function POST(request: Request) {
  const body = await request.json()
  const searchParams = new URLSearchParams({ lat: body.lat, lng: body.lng })

  try {
    const weatherResponse = await fetch(`${weatherEndpoint}?${searchParams}`)

    if (!weatherResponse.ok) {
      /* error ကို ကိုင်တွယ်ပါ */
    }

    const weatherData = await weatherResponse.text()
    const payload = parseWeatherData.asJSON(weatherData)

    return new Response(payload, { status: 200 })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

```js file="/app/api/weather/route.js" switcher
import { parseWeatherData } from '@/lib/weather'

export async function POST(request) {
  const body = await request.json()
  const searchParams = new URLSearchParams({ lat: body.lat, lng: body.lng })

  try {
    const weatherResponse = await fetch(`${weatherEndpoint}?${searchParams}`)

    if (!weatherResponse.ok) {
      /* error ကို ကိုင်တွယ်ပါ */
    }

    const weatherData = await weatherResponse.text()
    const payload = parseWeatherData.asJSON(weatherData)

    return new Response(payload, { status: 200 })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

> **သိထားသင့်သည်:** ဒီဥပမာက geo-location data တွေကို URL ထဲ မထည့်ဖို့ `POST` ကို သုံးထားပါတယ်။ `GET` requests တွေကို cache (သို့) log လုပ်ခံရနိုင်လို့ — sensitive info တွေ ပေါက်ကြားသွားနိုင်ပါတယ်။

## Backend တစ်ခုဆီ proxy လုပ်ခြင်း (Proxying to a backend)

Route Handler တစ်ခုကို တခြား backend တစ်ခုဆီ ဦးတည်တဲ့ `proxy` အဖြစ် သုံးနိုင်ပါတယ်။ Request ကို ရှေ့ဆက် မပို့ခင် validation logic တွေ ထည့်ပါ။

```ts filename="/app/api/[...slug]/route.ts" switcher
import { isValidRequest } from '@/lib/utils'

export async function POST(request: Request, { params }) {
  const clonedRequest = request.clone()
  const isValid = await isValidRequest(clonedRequest)

  if (!isValid) {
    return new Response(null, { status: 400, statusText: 'Bad Request' })
  }

  const { slug } = await params
  const pathname = slug.join('/')
  const proxyURL = new URL(pathname, 'https://nextjs.org')
  const proxyRequest = new Request(proxyURL, request)

  try {
    return fetch(proxyRequest)
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

```js filename="/app/api/[...slug]/route.js" switcher
import { isValidRequest } from '@/lib/utils'

export async function POST(request, { params }) {
  const clonedRequest = request.clone()
  const isValid = await isValidRequest(clonedRequest)

  if (!isValid) {
    return new Response(null, { status: 400, statusText: 'Bad Request' })
  }

  const { slug } = await params
  const pathname = slug.join('/')
  const proxyURL = new URL(pathname, 'https://nextjs.org')
  const proxyRequest = new Request(proxyURL, request)

  try {
    return fetch(proxyRequest)
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

ဒါမှမဟုတ် ဒါတွေလည်း သုံးနိုင်ပါတယ်:

- `proxy` နဲ့ [rewrites](#proxy) လုပ်ခြင်း
- `next.config.js` ထဲမှာ [`rewrites`](/docs/nextjs/next-config-rewrites) သုံးခြင်း

## NextRequest နဲ့ NextResponse

Next.js က အသုံးများတဲ့ လုပ်ဆောင်ချက်တွေကို ရိုးရှင်းစေမယ့် methods တွေနဲ့ [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) နဲ့ [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) Web APIs တွေကို တိုးချဲ့ပေးပါတယ်။ ဒီ extensions တွေက Route Handlers ရော Proxy ထဲမှာပါ ရနိုင်ပါတယ်။

နှစ်ခုလုံးက cookies တွေကို ဖတ်ခြင်း နဲ့ ပြောင်းလဲခြင်းအတွက် methods တွေ ပံ့ပိုးပေးပါတယ်။

`NextRequest` မှာ incoming request ကနေ parse လုပ်ထားတဲ့ တန်ဖိုးတွေကို ထုတ်ပေးတဲ့ [`nextUrl`](/docs/nextjs/next-request#nexturl) property ပါဝင်ပါတယ် — ဥပမာ request ရဲ့ pathname နဲ့ search params တွေကို ပိုပြီး လွယ်ကူစွာ ဝင်ရောက်နိုင်စေပါတယ်။

`NextResponse` ကတော့ `next()`, `json()`, `redirect()` နဲ့ `rewrite()` လို helpers တွေ ပံ့ပိုးပေးပါတယ်။

`NextRequest` ကို `Request` မျှော်လင့်ထားတဲ့ function မရွေး ထည့်ပေးလို့ရသလို — `Response` မျှော်လင့်တဲ့နေရာမှာလည်း `NextResponse` ကို return လုပ်လို့ရပါတယ်။

```ts filename="/app/echo-pathname/route.ts" switcher
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const nextUrl = request.nextUrl

  if (nextUrl.searchParams.get('redirect')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (nextUrl.searchParams.get('rewrite')) {
    return NextResponse.rewrite(new URL('/', request.url))
  }

  return NextResponse.json({ pathname: nextUrl.pathname })
}
```

```js filename="/app/echo-pathname/route.js" switcher
import { NextResponse } from 'next/server'

export async function GET(request) {
  const nextUrl = request.nextUrl

  if (nextUrl.searchParams.get('redirect')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (nextUrl.searchParams.get('rewrite')) {
    return NextResponse.rewrite(new URL('/', request.url))
  }

  return NextResponse.json({ pathname: nextUrl.pathname })
}
```

[`NextRequest`](/docs/nextjs/next-request) နဲ့ [`NextResponse`](/docs/nextjs/next-response) အကြောင်း ထပ်မံ လေ့လာပါ။

## Webhooks နဲ့ callback URLs

Third-party applications တွေကနေ event notifications တွေ လက်ခံဖို့ Route Handlers တွေကို သုံးပါ။

ဥပမာ — CMS တစ်ခုမှာ content ပြောင်းလဲတဲ့အခါ route တစ်ခုကို revalidate လုပ်ဖို့ပါ။ CMS ကို အပြောင်းအလဲတွေ ဖြစ်တဲ့အခါ သတ်မှတ်ထားတဲ့ endpoint တစ်ခုကို ခေါ်ဖို့ configure လုပ်ပါ။

```ts filename="/app/webhook/route.ts" switcher
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (token !== process.env.REVALIDATE_SECRET_TOKEN) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get('tag')

  if (!tag) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  revalidateTag(tag, 'max')

  return NextResponse.json({ success: true })
}
```

```js filename="/app/webhook/route.js" switcher
import { NextResponse } from 'next/server'

export async function GET(request) {
  const token = request.nextUrl.searchParams.get('token')

  if (token !== process.env.REVALIDATE_SECRET_TOKEN) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get('tag')

  if (!tag) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  revalidateTag(tag, 'max')

  return NextResponse.json({ success: true })
}
```

Callback URLs တွေက နောက်ထပ် အသုံးပြုပုံ တစ်ခုပါ။ User တစ်ယောက်က third-party flow တစ်ခု ပြီးဆုံးတဲ့အခါ — third party က သူ့ကို callback URL တစ်ခုဆီ ပြန်ပို့ပါတယ်။ Response ကို အတည်ပြုပြီး — user ကို ဘယ်နေရာကို redirect လုပ်ရမလဲ ဆုံးဖြတ်ဖို့ Route Handler တစ်ခုကို သုံးပါ။

```ts filename="/app/auth/callback/route.ts" switcher
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('session_token')
  const redirectUrl = request.nextUrl.searchParams.get('redirect_url')

  const destination = new URL(redirectUrl ?? '/', request.url)
  // Open redirects တွေ ကာကွယ်ရန်: same-origin destinations တွေကိုပဲ ခွင့်ပြုပါ
  if (destination.origin !== request.nextUrl.origin) {
    return new Response('Invalid redirect', { status: 400 })
  }

  const response = NextResponse.redirect(destination)

  response.cookies.set({
    value: token,
    name: '_token',
    path: '/',
    secure: true,
    httpOnly: true,
    expires: undefined, // session cookie
  })

  return response
}
```

```js filename="/app/auth/callback/route.js" switcher
import { NextResponse } from 'next/server'

export async function GET(request) {
  const token = request.nextUrl.searchParams.get('session_token')
  const redirectUrl = request.nextUrl.searchParams.get('redirect_url')

  const destination = new URL(redirectUrl ?? '/', request.url)
  // Open redirects တွေ ကာကွယ်ရန်: same-origin destinations တွေကိုပဲ ခွင့်ပြုပါ
  if (destination.origin !== request.nextUrl.origin) {
    return new Response('Invalid redirect', { status: 400 })
  }

  const response = NextResponse.redirect(destination)

  response.cookies.set({
    value: token,
    name: '_token',
    path: '/',
    secure: true,
    httpOnly: true,
    expires: undefined, // session cookie
  })

  return response
}
```

## Redirects (ပြန်ညွှန်းခြင်း)

```ts filename="app/api/route.ts" switcher
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  redirect('https://nextjs.org/')
}
```

```js filename="app/api/route.js" switcher
import { redirect } from 'next/navigation'

export async function GET(request) {
  redirect('https://nextjs.org/')
}
```

Redirects အကြောင်း ထပ်မံ လေ့လာရန် — [`redirect`](/docs/nextjs/redirect) နဲ့ [`permanentRedirect`](/docs/nextjs/permanent-redirect) ကို ကြည့်ပါ။

## Proxy

ပရောဂျက်တစ်ခုမှာ `proxy` file တစ်ခုပဲ ခွင့်ပြုပါတယ်။ သတ်မှတ်ထားတဲ့ paths တွေကို ပစ်မှတ်ထားဖို့ `config.matcher` ကို သုံးပါ။ [`proxy`](/docs/nextjs/file-conventions-proxy) အကြောင်း ထပ်မံ လေ့လာပါ။

Request တစ်ခုက route path တစ်ခုဆီ မရောက်ခင် — `proxy` ကို သုံးပြီး response တစ်ခု ထုတ်ပေးနိုင်ပါတယ်။

```ts filename="proxy.ts" switcher
import { isAuthenticated } from '@lib/auth'

export const config = {
  matcher: '/api/:function*',
}

export function proxy(request: Request) {
  if (!isAuthenticated(request)) {
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

```js filename="proxy.js" switcher
import { isAuthenticated } from '@lib/auth'

export const config = {
  matcher: '/api/:function*',
}

export function proxy(request) {
  if (!isAuthenticated(request)) {
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

`proxy` ကို သုံးပြီး requests တွေကိုလည်း proxy လုပ်လို့ရပါတယ်:

```ts filename="proxy.ts" switcher
import { NextResponse } from 'next/server'

export function proxy(request: Request) {
  if (request.nextUrl.pathname === '/proxy-this-path') {
    const rewriteUrl = new URL('https://nextjs.org')
    return NextResponse.rewrite(rewriteUrl)
  }
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  if (request.nextUrl.pathname === '/proxy-this-path') {
    const rewriteUrl = new URL('https://nextjs.org')
    return NextResponse.rewrite(rewriteUrl)
  }
}
```

`proxy` ကနေ ထုတ်လုပ်နိုင်တဲ့ နောက်ထပ် response အမျိုးအစားတစ်ခုကတော့ redirects တွေပါ:

```ts filename="proxy.ts" switcher
import { NextResponse } from 'next/server'

export function proxy(request: Request) {
  if (request.nextUrl.pathname === '/v1/docs') {
    request.nextUrl.pathname = '/v2/docs'
    return NextResponse.redirect(request.nextUrl)
  }
}
```

```js filename="proxy.js" switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  if (request.nextUrl.pathname === '/v1/docs') {
    request.nextUrl.pathname = '/v2/docs'
    return NextResponse.redirect(request.nextUrl)
  }
}
```

## Security (လုံခြုံရေး)

### Working with headers (headers များနှင့် အလုပ်လုပ်ခြင်း)

Headers တွေ ဘယ်နေရာကို သွားလဲဆိုတာကို သေချာ စဉ်းစားပါ — incoming request headers တွေကို outgoing response ဆီ တိုက်ရိုက် လွှဲပြောင်းတာမျိုး ရှောင်ပါ။

- **Upstream request headers**: Proxy ထဲမှာ — `NextResponse.next({ request: { headers } })` က သင့် server လက်ခံရရှိတဲ့ headers တွေကို ပြုပြင်ပေးပြီး — client ဆီတော့ ထိတွေ့မပြပါဘူး။
- **Response headers**: `new Response(..., { headers })`, `NextResponse.json(..., { headers })`, `NextResponse.next({ headers })` (သို့) `response.headers.set(...)` တွေက headers တွေကို client ဆီ ပြန်ပို့ပါတယ်။ ဒီ headers တွေထဲမှာ sensitive တန်ဖိုးတွေ ထည့်ထားရင် — clients တွေ မြင်နိုင်မှာ ဖြစ်ပါတယ်။

[NextResponse headers in Proxy](/docs/nextjs/next-response#next) မှာ ထပ်မံ လေ့လာပါ။

### Rate limiting (request နှုန်း ကန့်သတ်ခြင်း)

သင့် Next.js backend မှာ rate limiting ကို အကောင်အထည်ဖော်နိုင်ပါတယ်။ Code-based checks တွေအပြင် — သင့် host က ပံ့ပိုးပေးထားတဲ့ rate limiting features တွေကိုပါ enable လုပ်ထားပါ။

```ts filename="/app/resource/route.ts" switcher
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const { rateLimited } = await checkRateLimit(request)

  if (rateLimited) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  return new Response(null, { status: 204 })
}
```

```js filename="/app/resource/route.js" switcher
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request) {
  const { rateLimited } = await checkRateLimit(request)

  if (rateLimited) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  return new Response(null, { status: 204 })
}
```

### Verify payloads (payloads များကို စိစစ်ခြင်း)

Incoming request data တွေကို ဘယ်တော့မှ မယုံကြည်ပါနဲ့။ Content type နဲ့ size ကို validate လုပ်ပြီး — မသုံးခင် XSS တွေကနေ ကာကွယ်ဖို့ sanitize လုပ်ပါ။

အလွဲသုံးစားမှုတွေနဲ့ server resources တွေ ကာကွယ်ဖို့ timeouts တွေကို သုံးပါ။

User-generated static assets တွေကို သီးသန့် services တွေမှာ သိမ်းဆည်းပါ။ ဖြစ်နိုင်ရင် — browser ကနေ တိုက်ရိုက် upload လုပ်ပြီး — request size လျှော့ချဖို့ ပြန်ရလာတဲ့ URI ကို database ထဲမှာ သိမ်းပါ။

### Access to protected resources (ကာကွယ်ထားသော resources များသို့ ဝင်ရောက်ခြင်း)

ဝင်ရောက်ခွင့် မပေးခင် credentials တွေကို အမြဲ စစ်ဆေးပါ။ Authentication နဲ့ authorization အတွက် proxy တစ်ခုတည်းကိုပဲ အားမကိုးပါနဲ့။

Responses နဲ့ backend logs တွေကနေ sensitive (သို့) မလိုအပ်တဲ့ data တွေကို ဖယ်ရှားပါ။

Credentials တွေနဲ့ API keys တွေကို ပုံမှန် rotate (လှည့်ပတ်) လုပ်ပါ။

## Preflight Requests (ကြိုတင် စစ်ဆေးသည့် Requests)

Preflight requests တွေက `OPTIONS` method ကို သုံးပြီး — origin, method နဲ့ headers တွေကို အခြေခံပြီး request တစ်ခု ခွင့်ပြုလို့ရမရကို server ကို မေးပါတယ်။

`OPTIONS` ကို သတ်မှတ်မထားရင် — Next.js က ၎င်းကို အလိုအလျောက် ထည့်သွင်းပြီး — သတ်မှတ်ထားတဲ့ တခြား methods တွေကို အခြေခံပြီး `Allow` header ကို သတ်မှတ်ပေးပါတယ်။

- [CORS](/docs/nextjs/file-conventions-route#cors)

## Library patterns (library ပုံစံများ)

Community libraries တွေက Route Handlers တွေအတွက် factory pattern ကို အသုံးပြုလေ့ ရှိပါတယ်။

```ts filename="/app/api/[...path]/route.ts"
import { createHandler } from 'third-party-library'

const handler = createHandler({
  /* library အတွက် သီးသန့် options */
})

export const GET = handler
// သို့မဟုတ်
export { handler as POST }
```

ဒါက `GET` နဲ့ `POST` requests တွေအတွက် shared handler တစ်ခုကို ဖန်တီးပေးပါတယ်။ Library က request ထဲက `method` နဲ့ `pathname` ကို အခြေခံပြီး အပြုအမူကို စိတ်ကြိုက် ပြုပြင်ပေးပါတယ်။

Libraries တွေက `proxy` factory တစ်ခုကိုလည်း ပံ့ပိုးပေးနိုင်ပါတယ်။

```ts filename="proxy.ts"
import { createMiddleware } from 'third-party-library'

export default createMiddleware()
```

> **သိထားသင့်သည်:** Third-party libraries တချို့က `proxy` ကို `middleware` လို့ ရည်ညွှန်းနေဆဲ ဖြစ်နိုင်ပါတယ်။

## နောက်ထပ် ဥပမာများ (More examples)

[Router Handlers](/docs/nextjs/file-conventions-route) နဲ့ [`proxy`](/docs/nextjs/file-conventions-proxy) ရဲ့ API references တွေမှာ နောက်ထပ် အသုံးပြုပုံ ဥပမာတွေကို ကြည့်ပါ။

ဒီဥပမာတွေထဲမှာ — [Cookies](/docs/nextjs/file-conventions-route#cookies), [Headers](/docs/nextjs/file-conventions-route#headers), [Streaming](/docs/nextjs/file-conventions-route#streaming) တွေနဲ့ အလုပ်လုပ်ခြင်း၊ Proxy ရဲ့ [negative matching](/docs/nextjs/file-conventions-proxy#negative-matching) နဲ့ တခြား အသုံးဝင်တဲ့ code snippets တွေ ပါဝင်ပါတယ်။

## Caveats (သတိပြုစရာများ)

### Server Components

Server Components တွေမှာ data တွေကို Route Handlers ကနေတစ်ဆင့် မဟုတ်ဘဲ — သူ့ရဲ့ source ကနေ တိုက်ရိုက် fetch လုပ်ပါ။

Build time မှာ pre-render လုပ်ထားတဲ့ Server Components တွေအတွက် — Route Handlers တွေကို သုံးရင် build step က ကျရှုံးပါလိမ့်မယ်။ အကြောင်းကတော့ — build လုပ်နေချိန်မှာ ဒီ requests တွေကို နားထောင်နေတဲ့ server မရှိလို့ပါ။

On-demand render လုပ်တဲ့ Server Components တွေအတွက်ဆိုရင်လည်း — handler နဲ့ render process ကြားက HTTP round trip အပိုတစ်ခု ရှိနေလို့ — Route Handlers ကနေ fetch လုပ်တာက ပိုနှေးပါတယ်။

> Server side `fetch` request တစ်ခုက absolute URLs တွေကို သုံးပါတယ်။ ဆိုလိုတာက — external server တစ်ခုဆီ HTTP round trip တစ်ခု ရှိပါတယ်။ Development အတွင်းမှာ — သင့်ကိုယ်ပိုင် development server က external server အဖြစ် ဆောင်ရွက်ပါတယ်။ Build time မှာတော့ server မရှိဘူး — runtime မှာတော့ server ကို သင့် public facing domain ကနေတစ်ဆင့် ရနိုင်ပါတယ်။

Server Components တွေက data-fetching လိုအပ်ချက် အများစုကို ဖြည့်ဆည်းပေးပါတယ်။ ဒါပေမယ့် — data တွေကို client ဘက်ကနေ fetch လုပ်ဖို့ လိုအပ်နိုင်တဲ့ အခြေအနေတွေလည်း ရှိပါတယ်:

- Client-only Web APIs တွေပေါ်မှာ မူတည်နေတဲ့ data:
  - Geo-location API
  - Storage API
  - Audio API
  - File API
- မကြာခဏ poll (စစ်ဆေး) လုပ်နေရတဲ့ data

ဒါတွေအတွက် — [`swr`](https://swr.vercel.app/) (သို့) [`react-query`](https://tanstack.com/query/latest/docs/framework/react/overview) လို community libraries တွေကို သုံးပါ။

### Server Actions

[Server Actions](/docs/nextjs/server-actions) တွေက client ကနေ server-side code တွေကို run လုပ်စေပါတယ်။ သူတို့ရဲ့ အဓိက ရည်ရွယ်ချက်က — သင့် frontend client ကနေ data တွေကို mutate (ပြောင်းလဲ) လုပ်ဖို့ပါ။

Server Actions တွေကို queue (တန်းစီ) လုပ်ထားပါတယ်။ Data fetching အတွက် သူတို့ကို သုံးမယ်ဆိုရင် — sequential execution (တစ်ခုပြီးတစ်ခု ဆောင်ရွက်ခြင်း) ဖြစ်သွားပါလိမ့်မယ်။

### `export` mode

`export` mode က runtime server မပါဘဲ — static site တစ်ခုကို output လုပ်ပါတယ်။ Next.js runtime လိုအပ်တဲ့ features တွေက [ပံ့ပိုးမပေးပါဘူး](/docs/nextjs/static-exports#unsupported-features) — အကြောင်းကတော့ ဒီ mode က static site တစ်ခုကို ထုတ်လုပ်ပြီး — runtime server မရှိလို့ပါ။

`export mode` ထဲမှာ — [`dynamic`](/docs/nextjs/caching-without-cache-components#dynamic) route segment config ကို `'force-static'` လို့ သတ်မှတ်ထားတာနဲ့ တွဲပြီး — `GET` Route Handlers တွေကိုပဲ ပံ့ပိုးပါတယ်။

ဒါကို static HTML, JSON, TXT (သို့) တခြား files တွေ ထုတ်လုပ်ဖို့ သုံးနိုင်ပါတယ်။

```js filename="app/hello-world/route.ts"
export const dynamic = 'force-static'

export function GET() {
  return new Response('Hello World', { status: 200 })
}
```

### Deployment environment (deployment ပတ်ဝန်းကျင်)

Host တချို့က Route Handlers တွေကို lambda functions တွေအနေနဲ့ deploy လုပ်ပါတယ်။ ဆိုလိုတာက:

- Route Handlers တွေက requests တွေကြား data တွေကို မျှဝေလို့ မရပါဘူး။
- Environment က File System ထဲ ရေးသားခြင်းကို ပံ့ပိုးပေးချင်မှ ပေးနိုင်ပါတယ်။
- Long-running handlers တွေက timeouts တွေကြောင့် ရပ်တန့်သွားနိုင်ပါတယ်။
- WebSockets တွေ အလုပ်လုပ်မှာ မဟုတ်ပါဘူး — အကြောင်းကတော့ connection က timeout ဖြစ်ချိန် (သို့) response ထုတ်ပြီးချိန်မှာ ပိတ်သွားလို့ပါ။
