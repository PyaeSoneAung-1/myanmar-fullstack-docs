---
title: "Redirecting"
description: "Next.js မှာ redirect တွေကို ကိုင်တွယ်တဲ့ နည်းလမ်းများ — redirect, permanentRedirect functions, useRouter hook, next.config.js redirects, Proxy ထဲက NextResponse.redirect နဲ့ redirect အများအပြားကို စီမံခန့်ခွဲခြင်း"
order: 14
source: "https://nextjs.org/docs/app/guides/redirecting"
status: translated
updated: 2026-09-01
---

Next.js မှာ redirect တွေကို ကိုင်တွယ်ဖို့ နည်းလမ်းအနည်းငယ် ရှိပါတယ်။ ဒီ page မှာ option တစ်ခုချင်းစီ, use cases တွေနဲ့ redirect အများအပြားကို ဘယ်လို စီမံခန့်ခွဲမလဲဆိုတာ ဖော်ပြသွားပါမယ်။

| API                                                           | Purpose                                           | Where                                               | Status Code                            |
| ------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------- | -------------------------------------- |
| [`redirect`](#redirect-function)                              | Mutation (သို့) event တစ်ခု အပြီးမှာ user ကို redirect လုပ်ခြင်း           | Server Components, Server Functions, Route Handlers | 307 (Temporary) or 303 (Server Action) |
| [`permanentRedirect`](#permanentredirect-function)            | Mutation (သို့) event တစ်ခု အပြီးမှာ user ကို redirect လုပ်ခြင်း           | Server Components, Server Functions, Route Handlers | 308 (Permanent)                        |
| [`useRouter`](#userouter-hook)                                | Client-side navigation လုပ်ဆောင်ခြင်း                  | Event Handlers in Client Components                 | N/A                                    |
| [`redirects` in `next.config.js`](#redirects-in-nextconfigjs) | Path တစ်ခုပေါ် မူတည်ပြီး incoming request ကို redirect လုပ်ခြင်း      | `next.config.js` file                               | 307 (Temporary) or 308 (Permanent)     |
| [`NextResponse.redirect`](#nextresponseredirect-in-proxy)     | Condition တစ်ခုပေါ် မူတည်ပြီး incoming request ကို redirect လုပ်ခြင်း | Proxy                                               | Any                                    |

## `redirect` function

`redirect` function က user ကို တခြား URL တစ်ခုဆီ redirect လုပ်နိုင်စေပါတယ်။ [Server Components](/docs/nextjs/server-client-components), [Route Handlers](/docs/nextjs/route-handlers) နဲ့ [Server Functions](/docs/nextjs/mutating-data) တွေမှာ `redirect` ကို ခေါ်နိုင်ပါတယ်။

`redirect` ကို mutation (သို့) event တစ်ခု အပြီးမှာ မကြာခဏ သုံးပါတယ်။ ဥပမာ — post တစ်ခု ဖန်တီးတဲ့အခါ:

```ts
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(id: string) {
  try {
    // Database ကို ခေါ်ပါ
  } catch (error) {
    // Errors တွေကို ကိုင်တွယ်ပါ
  }

  revalidatePath('/posts') // Cached posts တွေကို update လုပ်ပါ
  redirect(`/post/${id}`) // Post အသစ် page ဆီ သွားပါ
}
```

> **သိထားသင့်သည်**:
>
> - Server Action တစ်ခုထဲမှာ — JavaScript ရနိုင်ရင် `redirect` က client-side navigation ကို လုပ်ဆောင်ပါတယ်။ JavaScript မရှိရင် form submission က 303 (See Other) ကို သုံးပါတယ်။ တခြား context တွေမှာတော့ `redirect` က 307 (Temporary Redirect) ကို သုံးပါတယ်။
> - `redirect` က error တစ်ခုကို throw လုပ်တာမို့ — `try/catch` သုံးတဲ့အခါ `try` block ရဲ့ **အပြင်**မှာ ခေါ်သင့်ပါတယ်။
> - `redirect` ကို rendering process ကာလအတွင်း Client Components တွေမှာ ခေါ်လို့ရပေမယ့် event handlers တွေမှာတော့ မရပါဘူး။ အဲဒီအစား [`useRouter` hook](#userouter-hook) ကို သုံးနိုင်ပါတယ်။
> - `redirect` က absolute URLs တွေကိုလည်း လက်ခံပြီး — external links တွေဆီ redirect လုပ်ဖို့ သုံးနိုင်ပါတယ်။
> - Render process မစခင် redirect လုပ်ချင်ရင် — [`next.config.js`](#redirects-in-nextconfigjs) (သို့) [Proxy](#nextresponseredirect-in-proxy) ကို သုံးပါ။

အသေးစိတ်အတွက် [`redirect` API reference](/docs/nextjs/redirect) ကို ကြည့်ပါ။

## `permanentRedirect` function

`permanentRedirect` function က user ကို တခြား URL တစ်ခုဆီ **အမြဲတမ်း (permanently)** redirect လုပ်နိုင်စေပါတယ်။ [Server Components](/docs/nextjs/server-client-components), [Route Handlers](/docs/nextjs/route-handlers) နဲ့ [Server Functions](/docs/nextjs/mutating-data) တွေမှာ `permanentRedirect` ကို ခေါ်နိုင်ပါတယ်။

`permanentRedirect` ကို entity တစ်ခုရဲ့ canonical URL ကို ပြောင်းလဲစေတဲ့ mutation (သို့) event တစ်ခု အပြီးမှာ မကြာခဏ သုံးပါတယ် — ဥပမာ user တစ်ယောက် သူ့ရဲ့ username ပြောင်းပြီးနောက် profile URL ကို update လုပ်တာမျိုးပါ:

```ts
'use server'

import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function updateUsername(username: string, formData: FormData) {
  try {
    // Database ကို ခေါ်ပါ
  } catch (error) {
    // Errors တွေကို ကိုင်တွယ်ပါ
  }

  revalidateTag('username', 'max') // Username ရဲ့ references အားလုံးကို update လုပ်ပါ
  permanentRedirect(`/profile/${username}`) // User profile အသစ်ဆီ သွားပါ
}
```

> **သိထားသင့်သည်**:
>
> - Server Action တစ်ခုထဲမှာ — JavaScript ရနိုင်ရင် `permanentRedirect` က client-side navigation ကို လုပ်ဆောင်ပါတယ်။ JavaScript မရှိရင် form submission က 303 (See Other) ကို သုံးပါတယ်။ တခြား context တွေမှာတော့ `permanentRedirect` က 308 (Permanent Redirect) ကို သုံးပါတယ်။
> - `permanentRedirect` က absolute URLs တွေကိုလည်း လက်ခံပြီး — external links တွေဆီ redirect လုပ်ဖို့ သုံးနိုင်ပါတယ်။
> - Render process မစခင် redirect လုပ်ချင်ရင် — [`next.config.js`](#redirects-in-nextconfigjs) (သို့) [Proxy](#nextresponseredirect-in-proxy) ကို သုံးပါ။

အသေးစိတ်အတွက် [`permanentRedirect` API reference](/docs/nextjs/permanent-redirect) ကို ကြည့်ပါ။

## `useRouter()` hook

Client Component တစ်ခုရဲ့ event handler ထဲမှာ redirect လုပ်ဖို့ လိုအပ်ရင် — `useRouter` hook ကနေ `push` method ကို သုံးနိုင်ပါတယ်။ ဥပမာ:

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

> **သိထားသင့်သည်**:
>
> - User ကို programmatically navigate လုပ်စရာ မလိုဘူးဆိုရင် — [`<Link>`](/docs/nextjs/link) component ကို သုံးသင့်ပါတယ်။

အသေးစိတ်အတွက် [`useRouter` API reference](/docs/nextjs/use-router) ကို ကြည့်ပါ။

## `next.config.js` ထဲက `redirects`

`next.config.js` file ထဲက `redirects` option က incoming request path တစ်ခုကို မတူညီတဲ့ destination path တစ်ခုဆီ redirect လုပ်နိုင်စေပါတယ်။ Pages တွေရဲ့ URL structure ကို ပြောင်းတဲ့အခါ (သို့) အချိန်မတိုင်ခင် သိထားပြီးသား redirect စာရင်းတစ်ခု ရှိတဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။

`redirects` က [path](/docs/nextjs/redirects#path-matching), [header, cookie နဲ့ query matching](/docs/nextjs/redirects#header-cookie-and-query-matching) တွေကို support လုပ်ပြီး — incoming request တစ်ခုပေါ် မူတည်ပြီး user တွေကို redirect လုပ်ဖို့ လိုအပ်တဲ့ ပြောင်းလွယ်ပြင်လွယ် ပေးပါတယ်။

`redirects` သုံးဖို့ — option ကို သင့် `next.config.js` file ထဲ ထည့်ပါ:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // အခြေခံ redirect
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      // Wildcard path matching
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
```

အသေးစိတ်အတွက် [`redirects` API reference](/docs/nextjs/redirects) ကို ကြည့်ပါ။

> **သိထားသင့်သည်**:
>
> - `redirects` က `permanent` option နဲ့အတူ 307 (Temporary Redirect) (သို့) 308 (Permanent Redirect) status code ကို ပြန်ပေးနိုင်ပါတယ်။
> - `redirects` က platforms တွေမှာ limit ရှိနိုင်ပါတယ်။ ဥပမာ — Vercel ပေါ်မှာ redirect 1,024 ခုအထိ limit ရှိပါတယ်။ Redirect အများအပြား (1000+) ကို စီမံဖို့ — [Proxy](/docs/nextjs/proxy) ကို သုံးပြီး custom solution တစ်ခု ဖန်တီးစဉ်းစားပါ။ အသေးစိတ်အတွက် [redirects တွေကို scale နဲ့ စီမံခန့်ခွဲခြင်း](#managing-redirects-at-scale-advanced) ကို ကြည့်ပါ။
> - `redirects` က Proxy ထက် **အရင်** run လုပ်ပါတယ်။

## Proxy ထဲက `NextResponse.redirect`

Proxy က request တစ်ခု ပြီးမြောက်ခင် code run လုပ်နိုင်စေပါတယ်။ ပြီးတော့ — incoming request ပေါ် မူတည်ပြီး `NextResponse.redirect` ကို သုံးကာ URL တစ်ခုဆီ redirect လုပ်ပါတယ်။ User တွေကို condition တစ်ခုပေါ် မူတည်ပြီး redirect လုပ်ချင်ရင် (ဥပမာ — authentication, session management စသဖြင့်) (သို့) [redirect အများအပြား](#managing-redirects-at-scale-advanced) ရှိတဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။

ဥပမာ — user က authenticate မလုပ်ရသေးရင် `/login` page ဆီ redirect လုပ်ဖို့:

```ts
import { NextResponse, NextRequest } from 'next/server'
import { authenticate } from 'auth-provider'

export function proxy(request: NextRequest) {
  const isAuthenticated = authenticate(request)

  // User က authenticated ဖြစ်ရင် ပုံမှန်အတိုင်း ဆက်လုပ်ပါ
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // Authenticated မဟုတ်ရင် login page ဆီ redirect လုပ်ပါ
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

> **သိထားသင့်သည်**:
>
> - Proxy က `next.config.js` ထဲက `redirects` **ပြီးမှ** run လုပ်ပြီး — rendering ထက် **အရင်** run လုပ်ပါတယ်။

အသေးစိတ်အတွက် [Proxy](/docs/nextjs/proxy) documentation ကို ကြည့်ပါ။

## Redirects အများအပြားကို စီမံခန့်ခွဲခြင်း (အဆင့်မြင့်)

Redirect အများအပြား (1000+) ကို စီမံဖို့ — Proxy ကို သုံးပြီး custom solution တစ်ခု ဖန်တီးစဉ်းစားနိုင်ပါတယ်။ ဒါက သင့် application ကို redeploy လုပ်စရာ မလိုဘဲ redirect တွေကို programmatically ကိုင်တွယ်နိုင်စေပါတယ်။

ဒါလုပ်ဖို့ — အောက်ပါတို့ကို စဉ်းစားဖို့ လိုပါတယ်:

1. Redirect map တစ်ခု ဖန်တီးပြီး သိမ်းဆည်းခြင်း။
2. Data lookup performance ကို optimize လုပ်ခြင်း။

> **Next.js ဥပမာ** — အောက်က recommendations တွေရဲ့ implementation တစ်ခုအတွက် ကျွန်တော်တို့ရဲ့ [Proxy with Bloom filter](https://redirects-bloom-filter.vercel.app/) ဥပမာကို ကြည့်ပါ။

### 1. Redirect map တစ်ခု ဖန်တီးပြီး သိမ်းဆည်းခြင်း

Redirect map ဆိုတာ database (များသောအားဖြင့် key-value store) (သို့) JSON file တစ်ခုမှာ သိမ်းထားနိုင်တဲ့ redirect စာရင်းတစ်ခုပါ။

အောက်ပါ data structure ကို စဉ်းစားကြည့်ပါ:

```json
{
  "/old": {
    "destination": "/new",
    "permanent": true
  },
  "/blog/post-old": {
    "destination": "/blog/post-new",
    "permanent": true
  }
}
```

[Proxy](/docs/nextjs/proxy) ထဲမှာ — Vercel ရဲ့ [Global Config](https://vercel.com/docs/global-config/get-started) (သို့) [Redis](https://vercel.com/docs/redis) လို database တစ်ခုကနေ ဖတ်ပြီး — incoming request ပေါ် မူတည်ကာ user ကို redirect လုပ်နိုင်ပါတယ်:

```ts
import { NextResponse, NextRequest } from 'next/server'
import { get } from '@vercel/global-config'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const redirectData = await get(pathname)

  if (redirectData && typeof redirectData === 'string') {
    const redirectEntry: RedirectEntry = JSON.parse(redirectData)
    const statusCode = redirectEntry.permanent ? 308 : 307
    return NextResponse.redirect(redirectEntry.destination, statusCode)
  }

  // Redirect မတွေ့ရင် redirect မလုပ်ဘဲ ဆက်လုပ်ပါ
  return NextResponse.next()
}
```

### 2. Data lookup performance ကို optimize လုပ်ခြင်း

Incoming request တိုင်းအတွက် dataset အကြီးကြီးတစ်ခုကို ဖတ်တာက နှေးပြီး စရိတ်ကြီးနိုင်ပါတယ်။ Data lookup performance ကို optimize လုပ်ဖို့ နည်းလမ်း နှစ်ခု ရှိပါတယ်:

- မြန်မြန်ဖတ်နိုင်အောင် optimize လုပ်ထားတဲ့ database တစ်ခု သုံးပါ
- [Bloom filter](https://en.wikipedia.org/wiki/Bloom_filter) လို data lookup strategy တစ်ခု သုံးပြီး — redirects file (သို့) database အကြီးကြီးကို မဖတ်ခင် redirect တစ်ခု ရှိမရှိကို ထိရောက်စွာ စစ်ဆေးပါ

အရင်က ဥပမာကို စဉ်းစားရင် — generated bloom filter file တစ်ခုကို Proxy ထဲ import လုပ်ပြီး — incoming request ရဲ့ pathname က bloom filter ထဲမှာ ရှိမရှိ စစ်ဆေးနိုင်ပါတယ်။

ရှိတယ်ဆိုရင် — request ကို [Route Handler](/docs/nextjs/route-handlers) တစ်ခုဆီ ပို့ပြီး အဲဒီမှာ တကယ့် file ကို စစ်ဆေးကာ user ကို သင့်တော်တဲ့ URL ဆီ redirect လုပ်ပါတယ်။ ဒါက redirects file အကြီးကြီးကို Proxy ထဲ import လုပ်တာကို ရှောင်ရှားပေးလို့ — incoming request တိုင်းကို နှေးစေတဲ့ အခြေအနေ မဖြစ်စေပါဘူး။

```ts
import { NextResponse, NextRequest } from 'next/server'
import { ScalableBloomFilter } from 'bloom-filters'
import GeneratedBloomFilter from './redirects/bloom-filter.json'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

// Generated JSON file ကနေ bloom filter ကို initialize လုပ်ပါ
const bloomFilter = ScalableBloomFilter.fromJSON(GeneratedBloomFilter as any)

export async function proxy(request: NextRequest) {
  // Incoming request အတွက် path ကို ယူပါ
  const pathname = request.nextUrl.pathname

  // Path က bloom filter ထဲမှာ ရှိမရှိ စစ်ဆေးပါ
  if (bloomFilter.has(pathname)) {
    // Pathname ကို Route Handler ဆီ ပို့ပါ
    const api = new URL(
      `/api/redirects?pathname=${encodeURIComponent(request.nextUrl.pathname)}`,
      request.nextUrl.origin
    )

    try {
      // Route Handler ကနေ redirect data ကို ယူပါ
      const redirectData = await fetch(api)

      if (redirectData.ok) {
        const redirectEntry: RedirectEntry | undefined =
          await redirectData.json()

        if (redirectEntry) {
          // Status code ကို ဆုံးဖြတ်ပါ
          const statusCode = redirectEntry.permanent ? 308 : 307

          // Destination ဆီ redirect လုပ်ပါ
          return NextResponse.redirect(redirectEntry.destination, statusCode)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Redirect မတွေ့ရင် redirect မလုပ်ဘဲ request ကို ဆက်လုပ်ပါ
  return NextResponse.next()
}
```

ပြီးတော့ — Route Handler ထဲမှာ:

```ts
import { NextRequest, NextResponse } from 'next/server'
import redirects from '@/app/redirects/redirects.json'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return new Response('Bad Request', { status: 400 })
  }

  // redirects.json file ကနေ redirect entry ကို ယူပါ
  const redirect = (redirects as Record<string, RedirectEntry>)[pathname]

  // Bloom filter false positives တွေအတွက် ထည့်တွက်ပါ
  if (!redirect) {
    return new Response('No redirect', { status: 400 })
  }

  // Redirect entry ကို ပြန်ပေးပါ
  return NextResponse.json(redirect)
}
```

> **သိထားသင့်သည်**:
>
> - Bloom filter တစ်ခု generate လုပ်ဖို့ — [`bloom-filters`](https://www.npmjs.com/package/bloom-filters) လို library တစ်ခုကို သုံးနိုင်ပါတယ်။
> - Malicious requests တွေကို ကာကွယ်ဖို့ — သင့် Route Handler ဆီ လုပ်တဲ့ requests တွေကို validate လုပ်သင့်ပါတယ်။
