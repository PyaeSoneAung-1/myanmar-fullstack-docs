---
title: "Offline Support (Connectivity ပြတ်တောက်မှုကို ကိုင်တွယ်ခြင်း)"
description: "Network ပြတ်တောက်မှုကို ကိုင်တွယ်ခြင်း — failed navigation, data fetch (သို့) Server Action တွေကို connection ပြန်ရတဲ့အခါ retry လုပ်ပုံနဲ့ `useOffline` hook သုံးပြီး offline state ကို user ဆီ အသိပေးပုံ"
order: 227
source: "https://nextjs.org/docs/app/guides/offline-support"
status: translated
updated: 2026-09-03
---

Soft navigation တစ်ခု၊ data fetch တစ်ခု (သို့) mutation တစ်ခု အတွင်းမှာ network failure ဖြစ်သွားရင် client ဘက်မှာ errors တွေ throw ဖြစ်ပါတယ်။ ရှင်းလင်းတဲ့ ကိုင်တွယ်မှု (explicit handling) မရှိရင် — UI က ပျက်သွားတာ ဖြစ်ဖြစ်၊ user ကို retry လုပ်ဖို့ တောင်းဆိုတဲ့ fallback UI တစ်ခု ကိုယ်တိုင် ဆောက်ရတာ ဖြစ်ဖြစ် — ဒီနှစ်မျိုးထဲက တစ်မျိုး ကြုံရပါတယ်။

[`experimental.useOffline`](/docs/nextjs/next-config-use-offline) ကို enable လုပ်ထားရင် — network ပြတ်နေချိန်မှာ မအောင်မြင်တဲ့ navigation၊ RSC data fetch၊ prefetch (သို့) Server Action တစ်ခုက နောက်တော့ throw မဖြစ်တော့ပါဘူး။ Next.js က အဲဒါကို pending အနေနဲ့ ထားပြီး — connection ပြန်ရတာနဲ့ တစ်ခါ ပြန် retry လုပ်ပါတယ်။

Request pending ဖြစ်နေချိန်မှာ UI က သူ့ရဲ့ loading state ထဲမှာပဲ ရှိနေပါတယ် — Suspense fallback တစ်ခု (သို့) Server Action တစ်ခုအတွက် pending transition — ဒါက server တစ်လုံး နှေးနေတာနဲ့ တူညီတဲ့ ပုံစံပါ။ App offline ဖြစ်နေတဲ့အခါ user တွေကို feedback ပေးဖို့ [`useOffline`](/docs/nextjs/use-offline) hook ကို သုံးပါ။

Client Component တစ်ခုထဲမှာ `fetch()` နဲ့ တိုက်ရိုက် (သို့) React Query နဲ့ SWR လို client-side data library တစ်ခုကနေတစ်ဆင့် သင်ကိုယ်တိုင် လွှတ်လိုက်တဲ့ requests တွေကတော့ — အဲဒီ library ရဲ့ ကိုယ်ပိုင် retry policy အောက်မှာပဲ ရှိနေပါတယ်။ Framework ရဲ့ detection နဲ့ polling အပြုအမူအကြောင်း — [How retry works](/docs/nextjs/next-config-use-offline) ကို ကြည့်ပါ။

## ဥပမာ (Example)

Request တိုင်းမှာ data အသစ် fetch လုပ်တဲ့ live-metrics page တစ်ခု၊ ပြီးတော့ Server Action တစ်ခုကို ခေါ်တဲ့ ping form တစ်ခုကို အတူတူ ဆောက်ကြည့်ပါမယ်။

- Source: [github.com/vercel-labs/use-offline](https://github.com/vercel-labs/use-offline)
- Live demo: [use-offline.labs.vercel.dev](https://use-offline.labs.vercel.dev)

ပူးတွဲ demo မှာ ဒီ dashboard ရဲ့ ဗားရှင်း နှစ်မျိုး ပါပါတယ် — `/without-feedback` က generic loading fallback ကို သုံးပြီး — `/with-feedback` ကတော့ connectivity ကို သိမြင်နိုင်တဲ့ (connectivity-aware) fallback တစ်ခုကို သုံးပါတယ်။ ဒီ guide ရဲ့ နောက် sections တွေမှာ တစ်ခုချင်းစီ ဘယ်လို ဆောက်ရမလဲ ဆိုတာကို တစ်ဆင့်ချင်း ဖြတ်သန်း ရှင်းပြသွားပါမယ်။

## Offline detection ဖွင့်ခြင်းနဲ့ default အပြုအမူ ကြည့်ရှုခြင်း

`experimental.useOffline` ကို ဖွင့်ပါ။ ဒီ guide က [Cache Components](/docs/nextjs/next-config-cache-components) နဲ့ [Partial Prefetching](/docs/nextjs/next-config-partial-prefetching) တွေကိုလည်း enable လုပ်ထားပါတယ်။ Cache Components က Suspense boundary ကို uncached data နဲ့ အနီးဆုံး ဖြစ်နိုင်တဲ့ နေရာမှာ ထားနိုင်စေပြီး — အဲဒီပတ်လည်မှာ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) ကို render လုပ်ပေးပါတယ်။ Partial Prefetching ကတော့ အဲဒီ App Shell ကို `<Link>` တစ်ခု prefetch လုပ်တဲ့ unit ဖြစ်စေလို့ — offline မှာ navigation ဖြစ်တဲ့အခါ render လုပ်ဖို့ အသင့်ဖြစ်နေပါတယ်။

Cache Components မရှိရင် — route-level [`loading.tsx`](/docs/nextjs/file-conventions-loading) က segment level မှာ အလားတူ offline အပြုအမူကို ပေးပါတယ်။ အောက်က Without Cache Components section ကို ကြည့်ပါ။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    useOffline: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
module.exports = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    useOffline: true,
  },
}
```

ပြီးတော့ — dashboard ဆီ `<Link>` တစ်ခု ပါတဲ့ source page တစ်ခုလည်း လိုပါတယ်။ Next.js က viewport ထဲ ဝင်လာတဲ့ `<Link>` တိုင်းရဲ့ App Shell ကို prefetch လုပ်ပြီး — အဲဒီ prefetch ကမှ shell ကို offline မှာ ရနိုင်စေတာပါ။

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Home() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Home() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  )
}
```

ဒီနောက် dashboard ကိုယ်တိုင် ဆောက်ပါ — static shell တစ်ခုနဲ့ `<Suspense>` boundary တစ်ခုအတွင်းက uncached data section တစ်ခုပါ။ `getLiveMetrics` က endpoint တစ်ခုဆီ fetch request တစ်ခု လုပ်တဲ့ uncached function တစ်ခုဖြစ်ပြီး — call တိုင်း network ကို ထိပါတယ်။

```tsx filename="app/dashboard/page.tsx" switcher
import { Suspense } from 'react'
import { getLiveMetrics } from '../lib/data'

export default function Dashboard() {
  return (
    <section>
      <h1>Live metrics</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <MetricsTable />
      </Suspense>
    </section>
  )
}

async function MetricsTable() {
  const { services } = await getLiveMetrics()
  // services တွေကို render လုပ်ပါ
}
```

```jsx filename="app/dashboard/page.js" switcher
import { Suspense } from 'react'
import { getLiveMetrics } from '../lib/data'

export default function Dashboard() {
  return (
    <section>
      <h1>Live metrics</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <MetricsTable />
      </Suspense>
    </section>
  )
}

async function MetricsTable() {
  const { services } = await getLiveMetrics()
  // services တွေကို render လုပ်ပါ
}
```

Home page ကို load လုပ်ပါ။ `<Link>` က viewport ထဲမှာ ရှိနေတာနဲ့ — dashboard ရဲ့ static shell ကို prefetch လုပ်ပါတယ်။ Offline သွားပါ (Testing ကို အောက်မှာ ကြည့်ပါ) ပြီးတော့ `/dashboard` ဆီ click လုပ်ပြီး ဝင်ကြည့်ပါ။

Title နဲ့ container တွေက static shell ကနေ render လုပ်ပါတယ်။ `Loading...` fallback က uncached ဖြစ်တဲ့ `getLiveMetrics()` call က ပြီးမြောက်လို့ မရလို့ — screen ပေါ်မှာ အကန့်အသတ်မရှိ ဆက်ရှိနေပါတယ်။ User က server နှေးနေချိန်မှာ မြင်ရမယ့် spinner အတိုင်းပဲ မြင်ရပါတယ်။

**Online** ဆီ ပြန်ပြောင်းကြည့်ပါ။ Metrics table က အလိုအလျောက် stream ဝင်လာပါတယ်။ Next.js က request ကို ကိုယ်တိုင် retry လုပ်လိုက်တာပါ — client code တစ်ကြောင်းမှ မပါဘူး။

> **သိထားသင့်သည်:** ဒီ feature က prefetch လုပ်ထားတဲ့ routes တွေဆီက soft navigations တွေနဲ့ — လက်ရှိ page ကနေ ခေါ်တဲ့ Server Action calls တွေမှာပဲ သက်ရောက်ပါတယ်။ Offline ဖြစ်နေချိန်မှာ full page reload တစ်ခုကတော့ ဆက်ပြီး fail ဖြစ်နေဦးမှာပါ — browser က HTML ကို ပို့ပေးဖို့ network လိုလို့ပါ။ Offline မှာ အပြည့်အဝ load လုပ်နိုင်ဖို့ဆိုရင် service worker တစ်ခု လိုပါလိမ့်မယ် ([Progressive Web Apps](/docs/nextjs/progressive-web-apps) guide ကို ကြည့်ပါ)။

ဒီနောက် — generic fallback UI အစား connectivity state ကို ဖတ်နိုင်တဲ့ fallback တစ်ခုနဲ့ အစားထိုးပါမယ်။

## Suspense fallback ထဲမှာ connectivity အခြေအနေ ဖော်ပြခြင်း

`useOffline` က browser က `offline` event တစ်ခု fire လုပ်တဲ့အခါ **ဒါမှမဟုတ်** navigation၊ prefetch (သို့) Server Action fetch တစ်ခု fail ဖြစ်တဲ့အခါ `true` ကို return လုပ်ပါတယ်။ နောက်ခံမှာ connectivity check တစ်ခု အောင်မြင်တာနဲ့ `false` ဆီ ပြန်လှည့်ပါတယ်။ ဒါက `navigator.onLine` ထက် ပိုပြီး စိတ်ချရပါတယ် — `navigator.onLine` က OS ရဲ့ network interface ကိုပဲ ထင်ဟပ်ပြီး — upstream internet မရှိတဲ့ WiFi နဲ့ ချိတ်ထားတဲ့ device တစ်ခုမှာတောင် `true` လို့ ပြန်နေတတ်လို့ပါ။

Hook ကို အခြေခံပြီး message ကို ရွေးချယ်ပြတဲ့ client component တစ်ခု ဖန်တီးပါ။

```tsx filename="app/dashboard/connectivity-fallback.tsx" switcher
'use client'

import { useOffline } from 'next/offline'

export function ConnectivityFallback() {
  const isOffline = useOffline()

  return (
    <p>
      {isOffline
        ? 'Waiting for connection to load this section...'
        : 'Loading...'}
    </p>
  )
}
```

```jsx filename="app/dashboard/connectivity-fallback.js" switcher
'use client'

import { useOffline } from 'next/offline'

export function ConnectivityFallback() {
  const isOffline = useOffline()

  return (
    <p>
      {isOffline
        ? 'Waiting for connection to load this section...'
        : 'Loading...'}
    </p>
  )
}
```

> **သိထားသင့်သည်:** `useOffline` က server-side rendering နဲ့ ကနဦး hydration အတွင်းမှာ `false` ကို return လုပ်ပါတယ်။ ပထမဆုံး တိကျတဲ့ တန်ဖိုးက — app mount ဖြစ်ပြီးနောက် browser က သတင်းပို့တဲ့ အရာပဲ ဖြစ်ပါတယ်။

အဲဒါကို Suspense fallback အနေနဲ့ ထည့်လိုက်ပါ။

```tsx filename="app/dashboard/page.tsx" highlight={3,9} switcher
import { Suspense } from 'react'
import { getLiveMetrics } from '../lib/data'
import { ConnectivityFallback } from './connectivity-fallback'

export default function Dashboard() {
  return (
    <section>
      <h1>Live metrics</h1>
      <Suspense fallback={<ConnectivityFallback />}>
        <MetricsTable />
      </Suspense>
    </section>
  )
}
```

```jsx filename="app/dashboard/page.js" highlight={3,9} switcher
import { Suspense } from 'react'
import { getLiveMetrics } from '../lib/data'
import { ConnectivityFallback } from './connectivity-fallback'

export default function Dashboard() {
  return (
    <section>
      <h1>Live metrics</h1>
      <Suspense fallback={<ConnectivityFallback />}>
        <MetricsTable />
      </Suspense>
    </section>
  )
}
```

Offline ဖြစ်နေချိန်မှာ dashboard ဆီ navigate လုပ်ရင် — fallback က အခု "Waiting for connection to load this section..." ဆိုပြီး ဖတ်ပြနေပါလိမ့်မယ်။ Connectivity ပြန်ရတာနဲ့ fallback ပျောက်သွားပြီး metrics တွေ stream ဝင်လာပါတယ်။

Fallback က ဒီ page ပေါ်မှာပဲ ပေါ်ပြီး — သူ့ရဲ့ Suspense boundary က စောင့်နေချိန်မှာပဲ ပေါ်ပါတယ်။ ဒီ app မှာ connectivity state ကို နေရာတိုင်းမှာ မြင်ရအောင် root layout ထဲမှာ banner တစ်ခု ထည့်ပါမယ်။

```tsx filename="app/offline-banner.tsx" switcher
'use client'

import { useOffline } from 'next/offline'

export function OfflineBanner() {
  const isOffline = useOffline()

  if (!isOffline) {
    return null
  }

  return (
    <div role="status">
      Offline. Pending requests will retry once you are back online.
    </div>
  )
}
```

```jsx filename="app/offline-banner.js" switcher
'use client'

import { useOffline } from 'next/offline'

export function OfflineBanner() {
  const isOffline = useOffline()

  if (!isOffline) {
    return null
  }

  return (
    <div role="status">
      Offline. Pending requests will retry once you are back online.
    </div>
  )
}
```

Root layout ထဲမှာ ထည့်ပါ။

```tsx filename="app/layout.tsx" highlight={1,7} switcher
import { OfflineBanner } from './offline-banner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <OfflineBanner />
        {children}
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" highlight={1,7} switcher
import { OfflineBanner } from './offline-banner'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <OfflineBanner />
        {children}
      </body>
    </html>
  )
}
```

Banner က offline ဖြစ်နေချိန်မှာ route တိုင်းပေါ်မှာ ပေါ်ပြီး — connectivity ပြန်ရတာနဲ့ ပျောက်သွားပါတယ်။

App အများစုအတွက် pending loading state က လုံလောက်ပါတယ်။ App တစ်ခုလုံးမှာ connectivity state ကို ဆက်သွယ်ပြနိုင်ဖို့ root layout ထဲမှာ banner တစ်ခု ထည့်ပါ။ Content တကယ် load ဖြစ်နေတဲ့ နေရာမှာပဲ အဲဒီ state ကို ပေါ်စေချင်ရင် — route ရဲ့ Suspense fallback ကိုယ်တိုင်ကို `useOffline` နဲ့ offline-aware ဖြစ်အောင် လုပ်ပါ။

ဒီ pattern က parameterized routes တွေမှာလည်း သက်ရောက်ပါတယ်။ `/chats/[id]` လို route တစ်ခုက — offline ဖြစ်နေချိန်မှာ `/chats/42` ဆီ navigate လုပ်ရင် သူ့ရဲ့ shared [App Shell](https://nextjs.org/docs/app/glossary#app-shell) ကို render လုပ်ပြီး — `<Suspense>` boundary နောက်က dynamic messages တွေက connection ပြန်ရတဲ့အခါ load ဖြစ်ပါတယ်။

Route က click မလုပ်ခင် link တစ်ခုချင်းစီရဲ့ URL data တွေကိုပါ prefetch လုပ်ထားရင် — `/chats/42` က သူ့ရဲ့ messages တွေကို connection ပြန်ရဖို့ မစောင့်ဘဲ — offline မှာတောင် အဲဒီ prefetch ကနေ ချက်ချင်း render လုပ်ပါတယ်။ အသေးစိတ်ကို [Optimizing prefetching](/docs/nextjs/optimizing-prefetching) မှာ ကြည့်ပါ။

## Network ပြန်ရပြီးနောက် Server Actions တွေကို retry လုပ်ခြင်း

Flag မရှိရင် — network မရှိဘဲ ခေါ်လိုက်တဲ့ Server Action တစ်ခုက fetch error တစ်ခု throw လုပ်ပြီး — await လုပ်ထားတဲ့ promise က reject ဖြစ်ပါတယ်။ သင့် form က rejection ကို ဖမ်းပြီး ဘာလုပ်ရမလဲ ဆုံးဖြတ်ရပါမယ် — error ပြမလား၊ retry လုပ်မလား၊ နေရာတစ်ခုမှာ queue လုပ်ထားမလား ဆိုတာပါ။

`experimental.useOffline` enable လုပ်ထားရင်တော့ — အဲဒီ failure က သင့် code ဆီ လုံးဝ မရောက်ပါဘူး။ Call က connection ပြန်ရတဲ့အထိ pending ဖြစ်နေပြီး — request က နောက်တစ်ခါ run လုပ်ကာ — await လုပ်ထားတဲ့ promise က server ရဲ့ response နဲ့ resolve ဖြစ်ပါတယ်။ Component ထဲမှာ try/catch မလို၊ retry loop မလို၊ reconnection handler မလိုပါဘူး။

ဒါပေမယ့် button ကတော့ အေးခဲနေတဲ့ပုံ ပေါ်နေဦးမှာပါ။ `useTransition` ကို `useOffline` နဲ့ တွဲပြီး — offline-aware label တစ်ခု ပေးလိုက်ပါ။

```ts filename="app/ping/actions.ts" switcher
'use server'

export async function ping(): Promise<string> {
  return new Date().toISOString()
}
```

```js filename="app/ping/actions.js" switcher
'use server'

export async function ping() {
  return new Date().toISOString()
}
```

```tsx filename="app/ping/ping-form.tsx" switcher
'use client'

import { useState, useTransition } from 'react'
import { useOffline } from 'next/offline'
import { ping } from './actions'

export function PingForm() {
  const [pongs, setPongs] = useState<string[]>([])
  const [pending, startTransition] = useTransition()
  const isOffline = useOffline()

  function handleSubmit() {
    startTransition(async () => {
      const pong = await ping()
      setPongs((prev) => [pong, ...prev])
    })
  }

  const label = pending
    ? isOffline
      ? 'Pinging (offline, will retry)...'
      : 'Pinging...'
    : 'Ping'

  return (
    <form action={handleSubmit}>
      <button type="submit" disabled={pending}>
        {label}
      </button>
      <ul>
        {pongs.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </form>
  )
}
```

```jsx filename="app/ping/ping-form.js" switcher
'use client'

import { useState, useTransition } from 'react'
import { useOffline } from 'next/offline'
import { ping } from './actions'

export function PingForm() {
  const [pongs, setPongs] = useState([])
  const [pending, startTransition] = useTransition()
  const isOffline = useOffline()

  function handleSubmit() {
    startTransition(async () => {
      const pong = await ping()
      setPongs((prev) => [pong, ...prev])
    })
  }

  const label = pending
    ? isOffline
      ? 'Pinging (offline, will retry)...'
      : 'Pinging...'
    : 'Ping'

  return (
    <form action={handleSubmit}>
      <button type="submit" disabled={pending}>
        {label}
      </button>
      <ul>
        {pongs.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </form>
  )
}
```

Offline ဖြစ်နေချိန်မှာ **Ping** ကို click လုပ်ရင် — button က disabled ဖြစ်ပြီး label က "Pinging (offline, will retry)..." ဆိုပြီး ပြောင်းပါတယ်။ Connectivity ပြန်ရတာနဲ့ — await လုပ်ထားတဲ့ `ping()` call က resolve ဖြစ်ပြီး timestamp ကို list ထဲ ထည့်ကာ — label က "Ping" ဆီ ပြန်ပြောင်းသွားပါတယ်။ ဒုတိယအကြိမ် click မလို၊ client-side retry code မလိုပါဘူး။

> **သိထားသင့်သည်:** Offline ဖြစ်နေချိန်မှာ — pending Server Action တစ်ခုရဲ့ အတွင်းမှာ link တစ်ခုကို click လုပ်ရင် ဘာမှ မဖြစ်သလို ပေါ်နိုင်ပါတယ်။ Link ရဲ့ navigation ကလည်း network လိုတာမို့ — action နဲ့အတူ တူညီတဲ့ connectivity signal ရဲ့ နောက်မှာ queue တက်နေတာပါ။ နှစ်ခုလုံးက connection ပြန်ရတဲ့အခါ resolve ဖြစ်ပါတယ်။

## Testing (စမ်းသပ်ခြင်း)

ဒီ feature ကို `next build && next start` နဲ့ စမ်းသပ်ပါ။ Dev mode က offline အပြုအမူအတွက် စိတ်ချရတဲ့ reference မဟုတ်ပါဘူး။

Chrome မှာ [DevTools > Network > **Offline**](https://developer.chrome.com/docs/devtools/network/reference#offline) ကို သုံးပါ — Firefox မှာတော့ [Network Monitor ရဲ့ throttling menu](https://firefox-source-docs.mozilla.org/devtools-user/network_monitor/throttling/index.html) ကို သုံးပါ။ လက်တွေ့ ကမ္ဘာမှာ စမ်းသပ်ဖို့ဆိုရင် — laptop (သို့) phone မှာ airplane mode ဖွင့်ကြည့်ပါ၊ WiFi ဖြုတ်ပါ (သို့) network cable ကို နုတ်ပစ်ပါ။

## Cache Components မရှိဘဲ (Without Cache Components)

Route-level [`loading.tsx`](/docs/nextjs/file-conventions-loading) က ဒီအလုပ်ကို အတူတူ လုပ်ပေးပါတယ်။ အဲဒါက Next.js ကို route ရဲ့ shell အဖြစ် prefetch လုပ်ဖို့ boundary တစ်ခု ပေးလို့ — shell က offline မှာ render ဖြစ်ပြီး network ပြန်ရတာနဲ့ page က ဆက်ပြီး ပြီးမြောက်ပါတယ်။ `loading.tsx` prefetching ဘယ်လို အလုပ်လုပ်လဲဆိုတာကို [Prefetching](/docs/nextjs/prefetching) မှာ ကြည့်ပါ။ `useOffline` hook၊ banner နဲ့ Server Action retry တွေက တူညီတဲ့ ပုံစံအတိုင်းပဲ အလုပ်လုပ်ပါတယ်။

## နောက်ထပ် အဆင့်များ (Next steps)

- [`useOffline` hook reference](/docs/nextjs/use-offline)
- [`experimental.useOffline` config reference](/docs/nextjs/next-config-use-offline)
- [`loading.tsx` file convention](/docs/nextjs/file-conventions-loading)
- Service-worker အခြေပြု offline caching အတွက် [Progressive Web Apps guide](/docs/nextjs/progressive-web-apps)
