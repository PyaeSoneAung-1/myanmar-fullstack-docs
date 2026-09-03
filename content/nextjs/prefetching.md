---
title: "Prefetching (routes များကို ကြိုတင် ယူဆောင်ခြင်း)"
description: "Next.js ရဲ့ route prefetching အလုပ်လုပ်ပုံ — static/dynamic routes, automatic prefetch, prefetch scheduling, client cache, `<Link>` prefetch ထိန်းချုပ်နည်း, Partial Prefetching နဲ့ App Shell အကြောင်း"
order: 185
source: "https://nextjs.org/docs/app/guides/prefetching"
status: translated
updated: 2026-09-03
---

Prefetching က routes တွေကြားက navigation ကို ချက်ချင်း (instant) ဖြစ်စေပါတယ်။ Default အနေနဲ့ Next.js က သင့် application code ထဲက links တွေကို အခြေခံပြီး routes တွေကို prefetch (ကြိုတင် ယူဆောင်) လုပ်ပေးပါတယ်။

ဒီ guide မှာ — prefetching က ဘယ်လို အလုပ်လုပ်လဲ၊ Next.js က သင့်အတွက် ဘာတွေကို prefetch လုပ်ပေးလဲ၊ ပြီးတော့ အဲဒါကို ဘယ်လို ထိန်းချုပ်မလဲ ဆိုတာတွေကို ရှင်းပြထားပါတယ်:

- Prefetching က ဘယ်လို အလုပ်လုပ်လဲ
- Next.js က ဘာတွေကို အလိုအလျောက် prefetch လုပ်လဲ
- Prefetching ကို ထိန်းချုပ်ခြင်း
- Troubleshooting (ပြဿနာရှာဖွေဖြေရှင်းခြင်း)

> **Partial Prefetching သုံးနေလား?** [`partialPrefetching`](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) enable လုပ်ထားရင် — `<Link>` က page အပြည့်အစား — route တစ်ခုချင်းစီရဲ့ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) ကို default အနေနဲ့ prefetch လုပ်ပါတယ်။ အောက်က Partial Prefetching နဲ့ [Adopting Partial Prefetching](/docs/nextjs/adopting-partial-prefetching) မှာ adoption လုပ်နည်းကို ကြည့်ပါ။

## Prefetching က ဘယ်လို အလုပ်လုပ်လဲ

Routes တစ်ခုကနေ နောက်တစ်ခုကို သွားတဲ့အခါ — browser က HTML နဲ့ JavaScript file တွေလို page အတွက် လိုအပ်တဲ့ assets တွေကို ယူပါတယ်။ **Prefetching** ဆိုတာ ဒီ resources တွေကို — route အသစ်တစ်ခုဆီ မသွားခင် — _ကြိုတင်ပြီး_ ယူထားတဲ့ လုပ်ငန်းစဉ်ပါ။

Next.js က သင့် application ကို routes တွေပေါ် အခြေခံပြီး JavaScript chunks သေးသေးလေးတွေ အဖြစ် အလိုအလျောက် ခွဲပါတယ်။ ရိုးရာ SPA တွေလို code အားလုံးကို အစမှာ တင်မယ့်အစား — လက်ရှိ route အတွက် လိုအပ်တဲ့ code ကိုပဲ တင်ပါတယ်။ ဒါက ကနဦး load time ကို လျှော့ချပေးပြီး — app ရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းတွေကို နောက်ခံမှာ တင်ပေးပါတယ်။ Link ကို နှိပ်တဲ့အချိန်မှာတော့ — route အသစ်အတွက် resources တွေက browser cache ထဲမှာ ရောက်နေပါပြီ။

Page အသစ်ကို သွားတဲ့အခါ — page တစ်ခုလုံး ပြန်တင်တာ (full page reload) ဖြစ်ဖြစ် browser ရဲ့ loading spinner ဖြစ်ဖြစ် မရှိတော့ပါဘူး။ အဲဒီအစား Next.js က [client-side transition](/docs/nextjs/linking) ကို လုပ်ဆောင်လို့ — page navigation က ချက်ချင်း ဖြစ်သလို ခံစားရပါတယ်။

## Next.js က ဘာတွေကို အလိုအလျောက် prefetch လုပ်လဲ

Next.js က production မှာ အလိုအလျောက် prefetch လုပ်ပါတယ်။ `<Link>` တစ်ခုချင်းစီက viewport ထဲ ဝင်လာတာနဲ့ — Next.js က အဲဒီ link နောက်က route ကို prefetch လုပ်ပြီး — links တွေ ပြည့်နေတဲ့ page တစ်ခုက network ကို မလွှမ်းမိုးအောင် အလုပ်တွေကို စီစဉ်ပေးပါတယ်။ Route တစ်ခုစီရဲ့ ဘယ်လောက်ကို prefetch လုပ်လဲဆိုတာ — အဲဒီ route က static လား dynamic လားပေါ် မူတည်ပြီး — Partial Prefetching enable လုပ်ထားရင် ပြောင်းလဲသွားပါတယ်။

### Static နဲ့ dynamic routes တွေကို prefetching လုပ်ခြင်း

Cache Components မရှိဘဲ — static route တစ်ခုကို အပြည့်အစုံ prefetch လုပ်ပြီး — dynamic route ကတော့ [`loading.js`](/docs/nextjs/file-conventions-loading) boundary မရှိရင် ကျော်လိုက်ပါတယ်။

|                                              | **Static page**                                     | **Dynamic page**                                                                       |
| -------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Prefetched**                               | ဟုတ်တယ် — route အပြည့်အစုံ                         | မဟုတ်ဘူး — [`loading.js`](/docs/nextjs/file-conventions-loading) မရှိရင်              |
| [**Client Cache TTL**](https://nextjs.org/docs/app/glossary#client-cache)   | 5 min (default)                                     | ပိတ်ထား — [enable](/docs/nextjs/next-config-stale-times) လုပ်ထားမှသာ                  |
| **Server roundtrip (click လုပ်တဲ့အခါ)**    | မလိုဘူး                                            | လိုတယ် — [shell](/docs/nextjs/caching) ပြီးနောက် stream လုပ်                          |

> **သိထားသင့်သည်:** ပထမဆုံး navigation အတွင်းမှာ — browser က HTML, JavaScript နဲ့ React Server Components (RSC) Payload တွေကို ယူပါတယ်။ နောက်ပိုင်း navigations တွေမှာတော့ — browser က Server Components အတွက် RSC Payload နဲ့ Client Components အတွက် JS bundle ကို ယူပါတယ်။

### အလိုအလျောက် prefetch (Automatic prefetch)

```tsx filename="app/ui/nav-link.tsx" switcher
import Link from 'next/link'

export default function NavLink() {
  return <Link href="/about">About</Link>
}
```

```jsx filename="app/ui/nav-link.js" switcher
import Link from 'next/link'

export default function NavLink() {
  return <Link href="/about">About</Link>
}
```

| **Context (အခြေအနေ)**      | **Prefetched payload (prefetch လုပ်တဲ့ အကြောင်းအရာ)** | **Client Cache TTL**                                                                                 |
| ---------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `loading.js` မရှိ            | Page တစ်ခုလုံး                                           | 5 min ([`staleTimes.static`](/docs/nextjs/next-config-stale-times))                                  |
| `loading.js` ရှိ             | Layout ကနေ ပထမဆုံး loading boundary အထိ                | Off by default ([`staleTimes.dynamic`](/docs/nextjs/next-config-stale-times))                        |

အလိုအလျောက် prefetching က production မှာပဲ run လုပ်ပါတယ်။ `prefetch={false}` နဲ့ ပိတ်လို့ရပြီး — Disabled Prefetch ဆိုတဲ့ အောက်က section မှာပြထားတဲ့ wrapper ကိုလည်း သုံးနိုင်ပါတယ်။

### Prefetch scheduling (prefetch စီစဉ်ခြင်း)

Next.js က task queue ငယ်တစ်ခုကို ထိန်းသိမ်းထားပြီး — အောက်ပါ အတိုင်း prefetch လုပ်ပါတယ်:

1. Viewport ထဲမှာ ရှိတဲ့ links
2. User intent ပြနေတဲ့ links (hover (သို့) touch)
3. Link အသစ်တွေက အဟောင်းတွေကို အစားထိုးပါတယ်
4. Screen ပြင်ဘက် scroll လုပ်ထားတဲ့ links တွေကို ဖျက်လိုက်ပါတယ်

Scheduler က ဖြစ်နိုင်ခြေ များတဲ့ navigations တွေကို ဦးစားပေးပြီး — အသုံးမဝင်တဲ့ downloads တွေကို အနည်းဆုံး ဖြစ်အောင် လုပ်ပါတယ်။

> **သိထားသင့်သည်:** **experimental** [`useOffline`](https://nextjs.org/docs/app/guides/offline-support) config ကို enable လုပ်ထားရင် — app က connectivity ပြတ်တောက်မှုကနေ ပြန်ကောင်းလာတဲ့အခါ — ဆိုင်းငံ့ထားတဲ့ prefetches တွေက ဒီ queue ကနေတစ်ဆင့် ဆက်လုပ်ဆောင်ပါတယ်။

### Client cache

Next.js က prefetch လုပ်ထားတဲ့ React Server Component payloads တွေကို route segments တွေနဲ့ key လုပ်ပြီး memory ထဲမှာ သိမ်းပါတယ်။ Sibling routes တွေကြား (ဥပမာ `/dashboard/settings` → `/dashboard/analytics`) သွားတဲ့အခါ — Next.js က parent layout ကို ပြန်သုံးပြီး — update ဖြစ်တဲ့ leaf page ကိုပဲ ယူပါတယ်။

### Partial Prefetching (တစ်စိတ်တစ်ပိုင်း prefetching)

[Partial Prefetching](https://nextjs.org/docs/app/glossary#partial-prefetching) ကို [`partialPrefetching`](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) config ကနေတစ်ဆင့် enable လုပ်ထားရင် (ဒါက [Cache Components](/docs/nextjs/caching) လိုအပ်ပါတယ်) — prefetching က အပေါ်က ဖော်ပြခဲ့တဲ့ all-or-nothing ပုံစံကနေ — route တစ်ခုချင်းစီရဲ့ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) ကို prefetch လုပ်တဲ့ ပုံစံဆီ ပြောင်းသွားပါတယ်:

- **Route တစ်ခုစီအတွက် shell တစ်ခု — links အားလုံးကြားမှာ share လုပ်။** `<Link>` က route ရဲ့ App Shell ကို prefetch လုပ်ပါတယ် — အဲဒီ shell ထဲမှာ route ရဲ့ static နဲ့ session output တွေ ပါဝင်ပါတယ်။ Route တစ်ခုတည်းကို ညွှန်တဲ့ links ဘယ်လောက်ပဲ ရှိရှိ — အဲဒီ shell တစ်ခုတည်းကိုပဲ ပြန်သုံးပြီး — ပထမဆုံး link က viewport ထဲ ဝင်လာတာနဲ့ တစ်ကြိမ်ပဲ ယူပါတယ်။ ဒါကြောင့် links အများကြီး ပါတဲ့ page တစ်ခုက — route တစ်ခုချင်းစီကို အပြည့်အစုံ prefetch လုပ်တာထက် — prefetch requests ပိုနည်းပါတယ်။
- **ကျန်တာတွေက stream ဝင်လာပါတယ်။** Uncached data တွေက navigation အပြီးမှာ — shell ရဲ့ `<Suspense>` boundaries တွေရဲ့ နောက်ကနေ stream လုပ်ဝင်ပါတယ်။ Link တစ်ခုက သူ့ရဲ့ URL data (`searchParams`, `params`) တွေကိုလည်း [`prefetch={true}`](/docs/nextjs/optimizing-prefetching) နဲ့ prefetch time မှာ ဖြေရှင်းနိုင်ပါတယ်။
- **Invalidations တွေက prefetches တွေကို refresh လုပ်ပါတယ်။** Data invalidations (`revalidateTag`, `revalidatePath`) တွေက ဆက်စပ်နေတဲ့ prefetches တွေကို silently refresh လုပ်ပါတယ်။

အပြုအမူ အပြောင်းအလဲနဲ့ အကြံပြုထားတဲ့ adoption လမ်းကြောင်းအတွက် [Adopting Partial Prefetching](/docs/nextjs/adopting-partial-prefetching) ကို ကြည့်ပါ။ Navigation မလုပ်ခင် cached URL-specific content တွေကို `prefetch={true}` နဲ့ ဖြေရှင်းဖို့ — [Optimizing prefetching](/docs/nextjs/optimizing-prefetching) ကို ကြည့်ပါ။

## Prefetching ကို ထိန်းချုပ်ခြင်း

Next.js က default settings တွေနဲ့ prefetch လုပ်ပါတယ်။ အဲဒီ defaults တွေက သင့် resource budget (သို့) navigation patterns တွေနဲ့ မကိုက်ညီတဲ့အခါ — link တစ်ခုချင်းစီအလိုက် ချိန်ညှိနိုင်ပါတယ်။

### Manual prefetch (ကိုယ်တိုင် prefetch လုပ်ခြင်း)

ကိုယ်တိုင် prefetch လုပ်ဖို့ — `next/navigation` ကနေ `useRouter` hook ကို import လုပ်ပြီး — viewport အပြင်ဘက်က routes တွေ (သို့) analytics, hover, scroll တွေကို တုံ့ပြန်တဲ့အနေနဲ့ routes တွေကို နွေးထားဖို့ (warm) `router.prefetch()` ကို ခေါ်ပါ။

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { CustomLink } from '@components/link'

export function PricingCard() {
  const router = useRouter()

  return (
    <div onMouseEnter={() => router.prefetch('/pricing')}>
      {/* other UI elements */}
      <CustomLink href="/pricing">View Pricing</CustomLink>
    </div>
  )
}
```

Component တစ်ခု load ဖြစ်တဲ့အခါ URL တစ်ခုကို prefetch လုပ်ဖို့ — Extending or ejecting link ဆိုတဲ့ အောက်က section ကို ကြည့်ပါ။

### Hover-triggered prefetch (hover လုပ်မှ prefetch လုပ်ခြင်း)

> **သတိထားပြီး ဆောင်ရွက်ပါ:** `Link` ကို ချဲ့ထွင်ခြင်းက — prefetching, cache invalidation နဲ့ accessibility ဆိုင်ရာ တာဝန်တွေကို သင့်လက်ထဲ ယူလိုက်တာပါ။ Defaults တွေ မလုံလောက်မှသာ ဒါကို လုပ်ပါ။

Default အနေနဲ့ `<Link>` က viewport ထဲ ဝင်လာတာနဲ့ prefetch လုပ်ပါတယ်။ User သွားဖို့ များတဲ့ links တွေကိုပဲ prefetch လုပ်ချင်ရင် — user က link ပေါ်မှာ hover လုပ်တဲ့အထိ စောင့်ပြီး prefetch လုပ်နိုင်ပါတယ်:

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

export function HoverPrefetchLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

`prefetch={null}` က user intent ပြတာနဲ့ — default (static) prefetching ကို ပြန်ထားပေးပါတယ်။

### Link ကို ချဲ့ထွင်ခြင်း (သို့) eject လုပ်ခြင်း (Extending or ejecting link)

`<Link>` component ကို ချဲ့ပြီး — ကိုယ်ပိုင် custom prefetching strategy တွေ ဖန်တီးနိုင်ပါတယ်။ ဥပမာ — user ရဲ့ cursor ဦးတည်ရာကို ခန့်မှန်းပြီး links တွေကို prefetch လုပ်ပေးတဲ့ [ForesightJS](https://foresightjs.com/docs/integrations/nextjs) library ကို သုံးနိုင်ပါတယ်။

တစ်နည်းအားဖြင့် — native `<Link>` အပြုအမူ တချို့ကို ပြန်ဖန်တီးဖို့ [`useRouter`](/docs/nextjs/use-router) ကို သုံးနိုင်ပါတယ်။ ဒါပေမယ့် — ဒါက prefetching နဲ့ cache invalidation တွေကို ကိုယ်တိုင် ထိန်းသိမ်းရတဲ့ တာဝန် ဝင်လာတာ သတိပြုပါ။

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function ManualPrefetchLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    const poll = () => {
      if (!cancelled) router.prefetch(href, { onInvalidate: poll })
    }
    poll()
    return () => {
      cancelled = true
    }
  }, [href, router])

  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault()
        router.push(href)
      }}
    >
      {children}
    </a>
  )
}
```

Next.js က cached data က stale ဖြစ်နေပြီလို့ သံသယရှိတဲ့အခါ [`onInvalidate`](/docs/nextjs/use-router) ကို ခေါ်ပေးလို့ — သင်က prefetch ကို refresh လုပ်နိုင်ပါတယ်။

> **သိထားသင့်သည်:** `a` tag က page တစ်ခုလုံးကို navigation လုပ်ပါတယ်။ အဲဒါကို တားဖို့ `onClick` ကို သုံးပြီး — client ဘက်မှာ သွားဖို့ `router.push` ကို ခေါ်ပါ။

### Disabled prefetch (prefetch ပိတ်ခြင်း)

Resource consumption အပေါ် ပိုပြီး ချိန်ညှိနိုင်ဖို့ — route တချို့အတွက် prefetching ကို လုံးဝ ပိတ်ထားနိုင်ပါတယ်။

```tsx
'use client'

import Link, { LinkProps } from 'next/link'

function NoPrefetchLink({
  prefetch,
  ...rest
}: LinkProps & { children: React.ReactNode }) {
  return <Link {...rest} prefetch={false} />
}
```

ဥပမာ — app တစ်ခုလုံးမှာ `<Link>` ကို တစ်ပြေးညီ သုံးချင်ပေမယ့် — footer ထဲက links တွေက viewport ထဲ ဝင်လာတဲ့အခါ prefetch လုပ်စရာ မလိုဘူးဆိုရင် ဒီလို လုပ်နိုင်ပါတယ်။

## Troubleshooting (ပြဿနာရှာဖွေဖြေရှင်းခြင်း)

### Prefetching အတွင်းမှာ မလိုချင်တဲ့ side-effects တွေ ဖြစ်ပေါ်ခြင်း

သင့် layouts (သို့) pages တွေက [pure](https://react.dev/learn/keeping-components-pure#purity-components-as-formulas) မဟုတ်ဘဲ — side-effects တွေ (ဥပမာ analytics tracking) ရှိနေရင် — Next.js က user က page ကို လာလည်တဲ့အခါ မဟုတ်ဘဲ — route ကို prefetch လုပ်တဲ့အခါမှာ အဲဒါတွေကို run လုပ်နိုင်ပါတယ်။

ဒါကို ရှောင်ဖို့ — side-effects တွေကို `useEffect` hook တစ်ခု (သို့) Client Component တစ်ခုကနေ စတင်လိုက်တဲ့ Server Action ထဲကို ရွှေ့ပါ။

**မပြောင်းခင် (Before)**:

```tsx filename="app/dashboard/layout.tsx" switcher
import { trackPageView } from '@/lib/analytics'

export default function Layout({ children }: { children: React.ReactNode }) {
  // ဒါက prefetch လုပ်ချိန်မှာ run ပါတယ်
  trackPageView()

  return <div>{children}</div>
}
```

```jsx filename="app/dashboard/layout.js" switcher
import { trackPageView } from '@/lib/analytics'

export default function Layout({ children }) {
  // ဒါက prefetch လုပ်ချိန်မှာ run ပါတယ်
  trackPageView()

  return <div>{children}</div>
}
```

**ပြောင်းပြီးနောက် (After)**:

```tsx filename="app/ui/analytics-tracker.tsx" switcher
'use client'

import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export function AnalyticsTracker() {
  useEffect(() => {
    trackPageView()
  }, [])

  return null
}
```

```jsx filename="app/ui/analytics-tracker.js" switcher
'use client'

import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export function AnalyticsTracker() {
  useEffect(() => {
    trackPageView()
  }, [])

  return null
}
```

```tsx filename="app/dashboard/layout.tsx" switcher
import { AnalyticsTracker } from '@/app/ui/analytics-tracker'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AnalyticsTracker />
      {children}
    </div>
  )
}
```

```jsx filename="app/dashboard/layout.js" switcher
import { AnalyticsTracker } from '@/app/ui/analytics-tracker'

export default function Layout({ children }) {
  return (
    <div>
      <AnalyticsTracker />
      {children}
    </div>
  )
}
```

### Prefetch အများကြီး ဖြစ်မသွားအောင် တားဆီးခြင်း

`<Link>` component ကို သုံးတဲ့အခါ Next.js က viewport ထဲက links တွေကို အလိုအလျောက် prefetch လုပ်ပါတယ်။

ဒါကို မလိုအပ်တဲ့ resource usage မဖြစ်အောင် တားချင်နိုင်ပါတယ် — ဥပမာ links အများကြီးကို render လုပ်နေတဲ့အခါမျိုးမှာ (infinite scroll table လိုမျိုး)။

`<Link>` component ရဲ့ `prefetch` prop ကို `false` ပေးပြီး prefetching ကို ပိတ်နိုင်ပါတယ်။

```tsx filename="app/ui/no-prefetch-link.tsx" switcher
<Link prefetch={false} href={`/blog/${post.id}`}>
  {post.title}
</Link>
```

ဒါပေမယ့် — ဒါဆိုရင် static routes တွေက click လုပ်မှပဲ ယူမှာ ဖြစ်ပြီး — dynamic routes တွေကလည်း server က render လုပ်ပြီးမှသာ navigation ဖြစ်ဖို့ စောင့်ရပါမယ်။

Prefetch ကို လုံးဝ မပိတ်ဘဲ resource usage လျှော့ချင်ရင် — user က link ပေါ်မှာ hover လုပ်တဲ့အထိ prefetching ကို ရွှေ့ဆိုင်းထားနိုင်ပါတယ်။ ဒါက user သွားဖို့ များတဲ့ links တွေကိုပဲ ရွေးချယ် ပစ်မှတ်ထားပါတယ်။

```tsx filename="app/ui/hover-prefetch-link.tsx" switcher
'use client'

import Link from 'next/link'
import { useState } from 'react'

export function HoverPrefetchLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

```jsx filename="app/ui/hover-prefetch-link.js" switcher
'use client'

import Link from 'next/link'
import { useState } from 'react'

export function HoverPrefetchLink({ href, children }) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```
