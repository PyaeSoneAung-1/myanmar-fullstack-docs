---
title: "after function (response ပြီးနောက် background အလုပ်များ စီစဉ်ခြင်း)"
description: "after() — response (သို့) prerender ပြီးဆုံးပြီးမှ လုပ်ဆောင်ရမယ့် tasks/side effects (logging, analytics စသည်) တွေကို စီစဉ်ပေးနည်း; Server Components, Server Functions, Route Handlers, Proxy တွေမှာ အသုံးပြုပုံ၊ request APIs နဲ့ Cache Components အပြုအမူ၊ serverless waitUntil အကြောင်း"
order: 61
source: "https://nextjs.org/docs/app/api-reference/functions/after"
status: translated
updated: 2026-09-02
---

`after` က response (သို့) prerender ပြီးဆုံးသွားပြီးမှ လုပ်ဆောင်ရမယ့် အလုပ်တွေကို စီစဉ် (schedule) ပေးနိုင်ပါတယ်။ Response ကို မပိတ်ဆို့သင့်တဲ့ tasks တွေနဲ့ အခြား side effects တွေ — ဥပမာ logging နဲ့ analytics လိုမျိုးတွေအတွက် အသုံးဝင်ပါတယ်။

ဒါကို [Server Components](/docs/nextjs/server-client-components) (အပါအဝင် [`generateMetadata`](/docs/nextjs/generate-metadata)), [Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data), [Route Handlers](/docs/nextjs/route-handlers) နဲ့ [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) တွေမှာ သုံးနိုင်ပါတယ်။

ဒီ function က response (သို့) prerender ပြီးဆုံးပြီးမှ လုပ်ဆောင်မယ့် callback တစ်ခုကို လက်ခံပါတယ်:

```tsx filename="app/layout.tsx" switcher
import { after } from 'next/server'
// Custom logging function
import { log } from '@/app/utils'

export default function Layout({ children }: { children: React.ReactNode }) {
  after(() => {
    // Execute after the layout is rendered and sent to the user
    log()
  })
  return <>{children}</>
}
```

```jsx filename="app/layout.jsx" switcher
import { after } from 'next/server'
// Custom logging function
import { log } from '@/app/utils'

export default function Layout({ children }) {
  after(() => {
    // Execute after the layout is rendered and sent to the user
    log()
  })
  return <>{children}</>
}
```

> **သိထားသင့်သည်:** `after` က [Request-time API](https://nextjs.org/docs/app/glossary#request-time-apis) မဟုတ်ပါဘူး — ဒါကို ခေါ်လိုက်လို့ route တစ်ခု dynamic ဖြစ်မသွားပါဘူး။ Static page တစ်ခုအတွင်းမှာ သုံးမယ်ဆိုရင် callback က build time မှာ (သို့) page ကို revalidate လုပ်တဲ့အခါတိုင်းမှာ လုပ်ဆောင်ပါလိမ့်မယ်။

## Reference

### Parameters

- Response (သို့) prerender ပြီးဆုံးပြီးမှ လုပ်ဆောင်မယ့် callback function တစ်ခု။

### Duration (ကြာချိန်)

`after` က သင့် route ရဲ့ platform ပုံမှန် (သို့) သတ်မှတ်ထားတဲ့ max duration အတွင်းမှာ run ပါလိမ့်မယ်။ Platform က ထောက်ပံ့ပေးနိုင်တယ်ဆိုရင် — timeout limit ကို [`maxDuration`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/maxDuration) route segment config သုံးပြီး သတ်မှတ်နိုင်ပါတယ်။

## သိထားသင့်သည် (Good to know)

- Response က အောင်မြင်စွာ မပြီးဆုံးခဲ့ဘူးဆိုရင်တောင် `after` က လုပ်ဆောင်ပါလိမ့်မယ်။ Error တစ်ခု throw ဖြစ်တာ၊ `notFound` (သို့) `redirect` ခေါ်လိုက်တာတွေမှာလည်း အပါအဝင်ပါ။
- `after` အတွင်းမှာ ခေါ်ထားတဲ့ functions တွေကို deduplicate လုပ်ဖို့ React `cache` ကို သုံးနိုင်ပါတယ်။
- `after` တွေကို အခြား `after` calls တွေအတွင်းမှာ nesting လုပ်နိုင်ပါတယ် — ဥပမာ `after` calls တွေကို wrap လုပ်ပြီး နောက်ထပ် လုပ်ဆောင်ချက်တွေ ထည့်ပေးတဲ့ utility functions တွေ ဖန်တီးနိုင်ပါတယ်။

## ဥပမာများ

### Request APIs တွေနဲ့အတူ

[`cookies`](/docs/nextjs/cookies) နဲ့ [`headers`](/docs/nextjs/headers) လိုမျိုး request APIs တွေကို `after` အတွင်းမှာ သုံးလို့ရမရဆိုတာက — `after` ကို ဘယ်နေရာကနေ ခေါ်လဲဆိုတဲ့အပေါ် မူတည်ပါတယ်။

#### Route Handlers နဲ့ Server Functions တွေထဲမှာ

[Route Handlers](/docs/nextjs/route-handlers) နဲ့ [Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data) တွေမှာ သုံးတဲ့အခါ `after` callback အတွင်းမှာ `cookies` နဲ့ `headers` တွေကို တိုက်ရိုက် ခေါ်နိုင်ပါတယ်။ Mutation (သို့) API request တစ်ခုပြီးနောက် လုပ်ဆောင်ချက်တွေကို log လုပ်ဖို့ အသုံးဝင်ပါတယ်။ ဥပမာ:

```ts filename="app/api/route.ts" highlight={2,10-16} switcher
import { after } from 'next/server'
import { cookies, headers } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  // ...

  // Log user activity for analytics
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie =
      (await cookies()).get('session-id')?.value || 'anonymous'

    logUserAction({ sessionCookie, userAgent })
  })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

```js filename="app/api/route.js" highlight={2,10-16} switcher
import { after } from 'next/server'
import { cookies, headers } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request) {
  // Perform mutation
  // ...

  // Log user activity for analytics
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie =
      (await cookies()).get('session-id')?.value || 'anonymous'

    logUserAction({ sessionCookie, userAgent })
  })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

#### Server Components (pages နဲ့ layouts) တွေထဲမှာ

[Server Components](/docs/nextjs/server-client-components) (pages, layouts, `generateMetadata` အပါအဝင်) တွေက `after` အတွင်းမှာ `cookies`, `headers` (သို့) အခြား Request-time APIs တွေကို **မသုံးနိုင်**ပါဘူး။ ဘာကြောင့်လဲဆိုတော့ — [Partial Prerendering](https://nextjs.org/docs/app/glossary#partial-prerendering-ppr) နဲ့ [Cache Components](/docs/nextjs/caching) တွေကို ထောက်ပံ့ဖို့ component tree ရဲ့ ဘယ်အစိတ်အပိုင်းက request data တွေ သုံးလဲဆိုတာ Next.js က သိထားဖို့ လိုပေမယ့် — `after` က React ရဲ့ rendering lifecycle ပြီးမှသာ run လို့ပါ။

Server Component တစ်ခုထဲက `after` callback အတွင်းမှာ request data လိုအပ်ရင် — အရင်ကတည်းက ဖတ်ထားပြီး တန်ဖိုးတွေကို ထည့်ပေးလိုက်ပါ:

```tsx filename="app/page.tsx" highlight={8-10,12} switcher
import { after } from 'next/server'
import { cookies, headers } from 'next/headers'
import { logUserAction } from '@/app/utils'

export default async function Page() {
  // Read request data before `after` — this is allowed
  // These calls will be read during the component's rendering lifecycle
  const userAgent = (await headers()).get('user-agent') || 'unknown'
  const sessionCookie =
    (await cookies()).get('session-id')?.value || 'anonymous'

  after(() => {
    // Use the values read above
    logUserAction({ sessionCookie, userAgent })
  })

  return <h1>My Page</h1>
}
```

```jsx filename="app/page.jsx" highlight={8-10,12} switcher
import { after } from 'next/server'
import { cookies, headers } from 'next/headers'
import { logUserAction } from '@/app/utils'

export default async function Page() {
  // Read request data before `after` — this is allowed
  // These calls will be read during the component's rendering lifecycle
  const userAgent = (await headers()).get('user-agent') || 'unknown'
  const sessionCookie =
    (await cookies()).get('session-id')?.value || 'anonymous'

  after(() => {
    // Use the values read above
    logUserAction({ sessionCookie, userAgent })
  })

  return <h1>My Page</h1>
}
```

Server Component တစ်ခုထဲက `after` callback အတွင်းမှာ `cookies()` (သို့) `headers()` ခေါ်လိုက်ရင် runtime error တစ်ခု throw ဖြစ်ပါလိမ့်မယ်။

#### Cache Components တွေနဲ့အတူ

[Cache Components](/docs/nextjs/caching) သုံးနေတဲ့အခါ — `cookies` (သို့) `headers` လိုမျိုး request data တွေကို သုံးတဲ့ components တွေကို page ရဲ့ ကျန်တဲ့အစိတ်အပိုင်းတွေ static shell အဖြစ် prerender လုပ်လို့ရအောင် [`<Suspense>`](https://react.dev/reference/react/Suspense) နဲ့ wrap လုပ်ထားရပါမယ်။

ဒီ pattern ကို `after` နဲ့ ပေါင်းသုံးနိုင်ပါတယ် — dynamic component တစ်ခုထဲမှာ request data ကို ဖတ်ပြီး `after` ထဲကို ထည့်ပေးလိုက်ရုံပါပဲ:

```tsx filename="app/page.tsx" highlight={18-19,22-24} switcher
import { Suspense } from 'react'
import { after } from 'next/server'
import { cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export default function Page() {
  return (
    <>
      <h1>Part of the static shell</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <DynamicContent />
      </Suspense>
    </>
  )
}

async function DynamicContent() {
  const sessionCookie =
    (await cookies()).get('session-id')?.value || 'anonymous'

  // Schedule work after the response is sent
  after(() => {
    logUserAction({ sessionCookie })
  })

  return <p>Your session: {sessionCookie}</p>
}
```

```jsx filename="app/page.jsx" highlight={18-19,22-24} switcher
import { Suspense } from 'react'
import { after } from 'next/server'
import { cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export default function Page() {
  return (
    <>
      <h1>Part of the static shell</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <DynamicContent />
      </Suspense>
    </>
  )
}

async function DynamicContent() {
  const sessionCookie =
    (await cookies()).get('session-id')?.value || 'anonymous'

  // Schedule work after the response is sent
  after(() => {
    logUserAction({ sessionCookie })
  })

  return <p>Your session: {sessionCookie}</p>
}
```

ဒီဥပမာမှာ `<h1>` နဲ့ `<Suspense>` ရဲ့ fallback က static shell ထဲမှာ ပါဝင်ပါတယ်။ `DynamicContent` က rendering လုပ်ချိန်မှာ cookie ကို ဖတ်ပြီး closure ကနေတစ်ဆင့် `after` ထဲကို ထည့်ပေးပါတယ်။ `cookies()` ကို `after` callback ရဲ့ **အပြင်**ဘက် (component ရဲ့ render လုပ်ချိန်အတွင်း) မှာ ခေါ်ထားလို့ — ဒါက မှန်ကန်စွာ အလုပ်လုပ်ပါတယ်။

## Platform ထောက်ပံ့မှု (Platform Support)

| Deployment Option                                    | ထောက်ပံ့မှု        |
| ---------------------------------------------------- | ------------------ |
| [Node.js server](/docs/nextjs/deploying#nodejs-server) | ရသည်              |
| [Docker container](/docs/nextjs/deploying#docker)      | ရသည်              |
| [Static export](/docs/nextjs/deploying#static-export)  | မရပါ              |
| [Adapters](/docs/nextjs/deploying#adapters)            | Platform အလိုက် ကွဲပြားသည် |

Next.js ကို self-host လုပ်တဲ့အခါ [`after` ကို configure လုပ်နည်း](https://nextjs.org/docs/app/guides/self-hosting#after) ကို လေ့လာပါ။

<details id="after-serverless">
  <summary>Reference — serverless platforms တွေမှာ `after` ကို ထောက်ပံ့ပေးခြင်း</summary>

Serverless context တစ်ခုမှာ `after` ကို သုံးဖို့ဆိုရင် — response ပို့ပြီးနောက်မှာ asynchronous tasks တွေ ပြီးဆုံးတဲ့အထိ စောင့်ဆိုင်းနိုင်ဖို့ လိုအပ်ပါတယ်။ Next.js နဲ့ Vercel မှာ ဒါကို `waitUntil(promise)` ဆိုတဲ့ primitive တစ်ခုနဲ့ လုပ်ဆောင်ပါတယ် — ဒါက serverless invocation တစ်ခုရဲ့ သက်တမ်းကို [`waitUntil`](https://vercel.com/docs/functions/functions-api-reference#waituntil) ဆီ ပေးထားတဲ့ promises တွေ အားလုံး settle မဖြစ်မချင်း သက်တမ်းတိုးပေးပါတယ်။

သင့် users တွေ `after` ကို run နိုင်စေချင်တယ်ဆိုရင် — အလားတူ အပြုအမူမျိုး ရှိတဲ့ ကိုယ်ပိုင် `waitUntil` implementation တစ်ခုကို ထောက်ပံ့ပေးဖို့ လိုပါလိမ့်မယ်။

`after` ကို ခေါ်လိုက်တဲ့အခါ Next.js က `waitUntil` ကို ဒီလိုမျိုး ဝင်ရောက်သုံးပါတယ်:

```jsx
const RequestContext = globalThis[Symbol.for('@next/request-context')]
const contextValue = RequestContext?.get()
const waitUntil = contextValue?.waitUntil
```

ဆိုလိုတာက `globalThis[Symbol.for('@next/request-context')]` မှာ ဒီလိုပုံစံ object တစ်ခု ပါဝင်နေဖို့ မျှော်လင့်ပါတယ်:

```tsx
type NextRequestContext = {
  get(): NextRequestContextValue | undefined
}

type NextRequestContextValue = {
  waitUntil?: (promise: Promise<any>) => void
}
```

ဒီမှာ implementation ရဲ့ ဥပမာတစ်ခုပါ။

```tsx
import { AsyncLocalStorage } from 'node:async_hooks'

const RequestContextStorage = new AsyncLocalStorage<NextRequestContextValue>()

// Define and inject the accessor that next.js will use
const RequestContext: NextRequestContext = {
  get() {
    return RequestContextStorage.getStore()
  },
}
globalThis[Symbol.for('@next/request-context')] = RequestContext

const handler = (req, res) => {
  const contextValue = { waitUntil: YOUR_WAITUNTIL }
  // Provide the value
  return RequestContextStorage.run(contextValue, () => nextJsHandler(req, res))
}
```

</details>

## Version History

| Version      | အပြောင်းအလဲ                    |
| ------------ | ------------------------------ |
| `v15.1.0`    | `after` က stable (တည်ငြိမ်) ဖြစ်လာ။ |
| `v15.0.0-rc` | `unstable_after` ကို စတင် မိတ်ဆက်။ |
