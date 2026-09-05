---
title: "Linking & Navigating (Link ချိတ်ခြင်းနဲ့ Navigation)"
description: "Next.js မှာ navigation ဘယ်လို အလုပ်လုပ်လဲ ဆိုတဲ့ ရှင်းလင်းချက် — server rendering (prerendering/dynamic rendering), prefetching, streaming နဲ့ client-side transitions တွေက routes တွေကြား သွားလာမှုကို မြန်ဆန်၊ ချောမွေ့အောင် ဘယ်လို လုပ်ပေးလဲ။ Dynamic routes တွေနဲ့ network နှေးတဲ့အခါ transition နှေးစေတဲ့ အကြောင်းရင်းတွေ (loading.tsx, generateStaticParams, prefetching ပိတ်ခြင်း, hydration), useLinkStatus နဲ့ feedback ပြသခြင်းအပြင် native History API (pushState/replaceState) အသုံးပြုပုံတွေလည်း ပါဝင်ပါတယ်။"
order: 4
source: "https://nextjs.org/docs/app/getting-started/linking-and-navigating"
status: translated
updated: 2026-09-05
---

Next.js မှာ routes တွေကို default အားဖြင့် server ပေါ်မှာ render လုပ်ပါတယ်။ ဒါကြောင့် route အသစ်တစ်ခုကို ပြသနိုင်ဖို့ client က server ရဲ့ response ကို စောင့်ဆိုင်းရတတ်ပါတယ်။ Next.js မှာ [prefetching](#prefetching), [streaming](#streaming) နဲ့ [client-side transitions](#client-side-transitions) စတဲ့ built-in အားသာချက်တွေ ပါဝင်ပြီး — navigation က မြန်ဆန်ပြီး responsive ဖြစ်နေစေပါတယ်။

ဒီ guide က Next.js မှာ navigation ဘယ်လို အလုပ်လုပ်သလဲ ဆိုတာနဲ့ — [dynamic routes](#dynamic-routes-without-loadingtsx) နဲ့ [network နှေးကွေးတဲ့ အခြေအနေတွေ](#slow-networks) အတွက် ဘယ်လို optimize လုပ်နိုင်လဲ ဆိုတာကို ရှင်းပြပါတယ်။

## Navigation ဘယ်လို အလုပ်လုပ်သလဲ (How Navigation Works)

Next.js မှာ navigation ဘယ်လို အလုပ်လုပ်လဲ ဆိုတာ နားလည်ဖို့ အောက်ပါ concepts တွေကို သိထားဖို့ အထောက်အကူ ဖြစ်ပါတယ်:

- [Server Rendering (Server ပေါ်မှာ Render လုပ်ခြင်း)](#server-rendering)
- [Prefetching (ကြိုတင် ဖတ်ယူခြင်း)](#prefetching)
- [Streaming (အပိုင်းလိုက် ပို့ဆောင်ခြင်း)](#streaming)
- [Client-side transitions (Client ဘက်မှ Transition များ)](#client-side-transitions)

### Server Rendering (Server ပေါ်မှာ Render လုပ်ခြင်း)

Next.js မှာ [Layouts နဲ့ Pages](/docs/nextjs/pages-layouts) တွေက default အားဖြင့် [React Server Components](https://react.dev/reference/rsc/server-components) တွေ ဖြစ်ပါတယ်။ ကနဦး (initial) နဲ့ နောက်ဆက်တွဲ navigations တွေမှာ [Server Component Payload](/docs/nextjs/server-client-components) ကို client ဆီ မပို့ခင် server ပေါ်မှာ ဦးစွာ generate လုပ်ပါတယ်။

ဘယ်အချိန်မှာ ဖြစ်ပွားသလဲ ဆိုတာပေါ် မူတည်ပြီး server rendering မှာ အမျိုးအစား နှစ်မျိုး ရှိပါတယ်:

- **Prerendering** — build time (သို့) [revalidation](/docs/nextjs/revalidating) ကာလအတွင်းမှာ ဖြစ်ပြီး — ရလဒ်ကို cache လုပ်ပါတယ်။
- **Dynamic Rendering** — client request တစ်ခုကို တုံ့ပြန်တဲ့ request time မှာ ဖြစ်ပါတယ်။

Server rendering ရဲ့ အားနည်းချက်က — route အသစ်ကို မပြသနိုင်ခင် client က server ရဲ့ response ကို စောင့်ရပါတယ်။ Next.js က user သွားဖွယ်ရှိတဲ့ routes တွေကို [prefetching](#prefetching) လုပ်ပြီး [client-side transitions](#client-side-transitions) တွေ လုပ်ဆောင်ခြင်းအားဖြင့် ဒီနှောင့်နှေးမှုကို ဖြေရှင်းပေးပါတယ်။

> **သိထားသင့်သည်:** ကနဦး ဝင်ရောက်မှု (initial visit) အတွက်လည်း HTML ကို generate လုပ်ပါတယ်။

### Prefetching (ကြိုတင် ဖတ်ယူခြင်း)

Prefetching ဆိုတာ — user က route တစ်ခုဆီ navigation မလုပ်ခင် နောက်ခံမှာ အဲဒီ route ကို ကြိုတင် ဖတ်ယူထားတဲ့ လုပ်ငန်းစဉ်ပါ။ ဒါက သင့် application ထဲက routes တွေကြား navigation ကို instant (ချက်ချင်း) လို့ ခံစားရစေပါတယ် — ဘာလို့လဲဆိုတော့ user က link တစ်ခုကို click လုပ်တဲ့အချိန်မှာ နောက် route ကို render လုပ်ဖို့လိုတဲ့ data က client ဘက်မှာ အသင့် ရှိနေပြီ ဖြစ်လို့ပါ။

Next.js က user ရဲ့ viewport ထဲ ရောက်ရှိလာတဲ့ [`<Link>` component](/docs/nextjs/component-link) နဲ့ ချိတ်ထားတဲ့ routes တွေကို အလိုအလျောက် prefetch လုပ်ပါတယ်။

```tsx filename="app/layout.tsx" switcher
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          {/* Prefetched when the link is hovered or enters the viewport */}
          <Link href="/blog">Blog</Link>
          {/* No prefetching */}
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

```jsx filename="app/layout.js" switcher
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <nav>
          {/* Prefetched when the link is hovered or enters the viewport */}
          <Link href="/blog">Blog</Link>
          {/* No prefetching */}
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

Route တစ်ခုကို ဘယ်လောက်အထိ prefetch လုပ်လဲ ဆိုတာက — အဲဒီ route က static လား dynamic လားပေါ် မူတည်ပါတယ်:

- **Static Route**: route တစ်ခုလုံးကို prefetch လုပ်ပါတယ်။
- **Dynamic Route**: prefetching ကို ကျော်လိုက်ပြီး — [`loading.tsx`](/docs/nextjs/file-conventions-loading) ရှိနေရင်တော့ route ကို တစ်စိတ်တစ်ပိုင်း prefetch လုပ်ပါတယ်။

Dynamic routes တွေကို ကျော်လိုက်တာ (သို့) တစ်စိတ်တစ်ပိုင်းပဲ prefetch လုပ်တာက — user တွေ ဘယ်တော့မှ မသွားနိုင်တဲ့ routes တွေအတွက် server ပေါ်မှာ မလိုအပ်တဲ့ အလုပ်တွေ မဖြစ်အောင် ရှောင်ရှားပေးပါတယ်။ ဒါပေမယ့် — navigation မလုပ်ခင် server response ကို စောင့်ရတာက app က တုံ့ပြန်မှု မရှိတော့ဘူးလို့ user တွေကို ထင်စေနိုင်ပါတယ်။

> **သိထားသင့်သည်:** Link တစ်ခုချင်းစီအတွက် prefetching ကို ထိန်းချုပ်နည်း၊ [Partial Prefetching](/docs/nextjs/adopting-partial-prefetching) ကို လက်ခံကျင့်သုံးတဲ့အခါ အပြုအမူ ဘယ်လို ပြောင်းလဲလဲ အပါအဝင် — အပြုအမူ အပြည့်အစုံအတွက် [Prefetching guide](/docs/nextjs/prefetching) ကို ကြည့်ပါ။

Dynamic routes တွေဆီ navigation အတွေ့အကြုံကို မြှင့်တင်ဖို့ [streaming](#streaming) ကို သုံးနိုင်ပါတယ်။

### Streaming (အပိုင်းလိုက် ပို့ဆောင်ခြင်း)

Streaming က — route တစ်ခုလုံး render ပြီးတာကို မစောင့်ဘဲ — dynamic route ရဲ့ အစိတ်အပိုင်းတွေ အသင့်ဖြစ်တာနဲ့ server ကနေ client ဆီ ပို့ပေးနိုင်စေပါတယ်။ ဆိုလိုတာက — page ရဲ့ အစိတ်အပိုင်းတချို့ loading ဖြစ်နေတုန်းမှာတောင် user တွေက အကြောင်းအရာ တစ်ခုခုကို စောစော မြင်ရပါတယ်။ Next.js မှာ streaming ဘယ်လို အလုပ်လုပ်လဲ ဆိုတာကို နက်ရှိုင်းစွာ လေ့လာဖို့ [Streaming guide](/docs/nextjs/streaming) ကို ကြည့်ပါ။

Dynamic routes တွေအတွက်ဆိုရင် — သူတို့ကို **တစ်စိတ်တစ်ပိုင်း prefetch** လုပ်လို့ ရပါတယ်။ ဆိုလိုတာက shared layouts တွေနဲ့ loading skeletons တွေကို ကြိုတင် request လုပ်ထားနိုင်ပါတယ်။

Streaming သုံးဖို့ — သင့် route folder ထဲမှာ `loading.tsx` တစ်ခု ဖန်တီးပါ:

```tsx filename="app/dashboard/loading.tsx" switcher
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <LoadingSkeleton />
}
```

```jsx filename="app/dashboard/loading.js" switcher
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <LoadingSkeleton />
}
```

နောက်ကွယ်မှာ Next.js က `page.tsx` ရဲ့ အကြောင်းအရာတွေကို `<Suspense>` boundary တစ်ခုအတွင်းမှာ အလိုအလျောက် wrap လုပ်ပေးပါတယ်။ Route loading ဖြစ်နေချိန်မှာ prefetch လုပ်ထားတဲ့ fallback UI ကို ပြသပြီး — အသင့်ဖြစ်တာနဲ့ တကယ့် content နဲ့ အစားထိုးပါတယ်။

> **သိထားသင့်သည်:** Nested components တွေအတွက် loading UI ဖန်တီးဖို့ [`<Suspense>`](https://react.dev/reference/react/Suspense) ကိုလည်း သုံးနိုင်ပါတယ်။

`loading.tsx` ရဲ့ အကျိုးကျေးဇူးတွေ:

- User အတွက် ချက်ချင်း navigation နဲ့ visual feedback (မြင်သာတဲ့ တုံ့ပြန်မှု)။
- Shared layouts တွေက interactive ဖြစ်နေပြီး — navigation ကို ကြားဖြတ် ရပ်တန့်နိုင်ပါတယ်။
- Core Web Vitals တိုးတက်လာခြင်း: [TTFB](https://web.dev/articles/ttfb), [FCP](https://web.dev/articles/fcp), [TTI](https://web.dev/articles/tti)။

Navigation အတွေ့အကြုံကို ထပ်မံ မြှင့်တင်ဖို့ — Next.js က `<Link>` component နဲ့ [client-side transition](#client-side-transitions) တစ်ခုကို လုပ်ဆောင်ပါတယ်။

### Client-side Transitions (Client ဘက်မှ Transition ပြုလုပ်ခြင်း)

အစဉ်အလာအရ — server-rendered page တစ်ခုဆီ navigation လုပ်တာက page တစ်ခုလုံး ပြန်တင်ခြင်း (full page load) ကို ဖြစ်စေပါတယ်။ ဒါက state တွေကို ရှင်းပစ်၊ scroll position ကို ပြန်စကာ — interactivity ကို ပိတ်ဆို့ပါတယ်။

Next.js က `<Link>` component ကို သုံးတဲ့ client-side transitions တွေနဲ့ ဒါကို ရှောင်ရှားပါတယ်။ Page ကို ပြန်လည် မတင်ဘဲ — အောက်ပါအတိုင်း content ကို dynamic ဖြစ်အောင် update လုပ်ပါတယ်:

- Shared layouts တွေနဲ့ UI တွေကို ထိန်းသိမ်းထားခြင်း။
- လက်ရှိ page ကို prefetch လုပ်ထားတဲ့ loading state (သို့) ရနိုင်ရင် page အသစ်နဲ့ အစားထိုးခြင်း။

Client-side transitions တွေက server-rendered apps တွေကို client-rendered apps တွေလို ခံစားရစေပါတယ်။ [Prefetching](#prefetching) နဲ့ [streaming](#streaming) တို့နဲ့ တွဲသုံးတဲ့အခါ — dynamic routes တွေမှာတောင် မြန်ဆန်တဲ့ transitions တွေ ဖြစ်စေပါတယ်။

Next.js က client-side transitions တွေအတွင်း [page အပေါ်ဆုံးဆီ scroll လုပ်ခြင်း](/docs/nextjs/component-link#scroll) ကိုလည်း ကိုင်တွယ်ပေးပါတယ်။ Navigation ပြီးနောက် content က sticky (သို့) fixed header ရဲ့ နောက်မှာ ဝင်နေရင် — CSS [`scroll-padding-top`](/docs/nextjs/component-link) နဲ့ ပြုပြင်နိုင်ပါတယ်။

## Transition တွေ ဘာကြောင့် နှေးစေနိုင်သလဲ (What Can Make Transitions Slow?)

ဒီ Next.js optimizations တွေက navigation ကို မြန်ဆန်ပြီး responsive ဖြစ်စေပါတယ်။ ဒါပေမယ့် — အချို့သော အခြေအနေတွေမှာ transitions တွေက နှေးတယ်လို့ ခံစားရနိုင်ပါသေးတယ်။ အောက်မှာ အဖြစ်များတဲ့ အကြောင်းရင်းတွေနဲ့ — user အတွေ့အကြုံကို မြှင့်တင်နိုင်တဲ့ နည်းလမ်းတွေ ဖြစ်ပါတယ်:

### `loading.tsx` မပါတဲ့ Dynamic Routes (Dynamic Routes Without `loading.tsx`)

Dynamic route တစ်ခုဆီ navigation လုပ်တဲ့အခါ — ရလဒ်ကို မပြသခင် client က server response ကို စောင့်ရပါတယ်။ ဒါက app က တုံ့ပြန်မှု မရှိဘူးလို့ user တွေကို ထင်စေနိုင်ပါတယ်။

Dynamic routes တွေမှာ `loading.tsx` ထည့်ဖို့ အကြံပြုပါတယ် — ဒါက partial prefetching ကို ဖွင့်ပေး၊ navigation ကို ချက်ချင်း စတင်စေပြီး — route render ဖြစ်နေချိန်မှာ loading UI ကို ပြသပေးပါတယ်။

```tsx filename="app/blog/[slug]/loading.tsx" switcher
export default function Loading() {
  return <LoadingSkeleton />
}
```

```jsx filename="app/blog/[slug]/loading.js" switcher
export default function Loading() {
  return <LoadingSkeleton />
}
```

> **သိထားသင့်သည်:** Development mode မှာ route က static လား dynamic လား ခွဲခြားသိဖို့ Next.js Devtools ကို သုံးနိုင်ပါတယ်။ အသေးစိတ်အတွက် [`devIndicators`](/docs/nextjs/next-config-dev-indicators) ကို ကြည့်ပါ။

### `generateStaticParams` မပါတဲ့ Dynamic Segments (Dynamic Segments Without `generateStaticParams`)

Dynamic segment တစ်ခုက prerender လုပ်လို့ ရနေပေမယ့် — [`generateStaticParams`](/docs/nextjs/generate-static-params) မပါတာကြောင့် မလုပ်ဖြစ်ရင် — route က request time မှာ dynamic rendering ဆီ fallback လုပ်ပါလိမ့်မယ်။

[`generateStaticParams`](/docs/nextjs/generate-static-params) ထည့်ပြီး route ကို build time မှာ statically generate ဖြစ်အောင် သေချာ လုပ်ပါ:

```tsx filename="app/blog/[slug]/page.tsx" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({ params }) {
  const { slug } = await params
  // ...
}
```

### Network နှေးကွေးခြင်း (Slow Networks)

Network နှေးတဲ့ (သို့) မတည်မငြိမ် ဖြစ်နေတဲ့အခါ — user က link ကို click မလုပ်ခင် prefetching ပြီးဆုံးချင်မှ ပြီးဆုံးနိုင်ပါတယ်။ ဒါက static ရော dynamic routes တွေကိုပါ သက်ရောက်နိုင်ပါတယ်။ ဒီလို အခြေအနေတွေမှာ — `loading.js` fallback ကို ကြိုတင် prefetch မလုပ်ရသေးလို့ ချက်ချင်း ပေါ်လာချင်မှ ပေါ်လာပါလိမ့်မယ်။

ခံစားရတဲ့ စွမ်းဆောင်ရည် (perceived performance) ကို မြှင့်တင်ဖို့ — transition ဖြစ်ပွားနေချိန်မှာ ချက်ချင်း feedback ပြသဖို့ [`useLinkStatus` hook](/docs/nextjs/use-link-status) ကို သုံးနိုင်ပါတယ်။

```tsx filename="app/ui/loading-indicator.tsx" switcher
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

```jsx filename="app/ui/loading-indicator.js" switcher
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

Hint ကို "debounce" လုပ်ဖို့ — ကနဦး animation delay (ဥပမာ — 100ms) ထည့်ပြီး invisible (ဥပမာ — `opacity: 0`) အနေနဲ့ စတင်စေနိုင်ပါတယ်။ ဆိုလိုတာက — navigation က သတ်မှတ်ထားတဲ့ delay ထက် ပိုကြာမှသာ loading indicator ကို ပြသမှာ ဖြစ်ပါတယ်။ CSS ဥပမာတစ်ခုအတွက် [`useLinkStatus` reference](/docs/nextjs/use-link-status) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:** **experimental** [`useOffline`](/docs/nextjs/next-config-use-offline) hook က connectivity ပြတ်တောက်နေချိန်မှာတောင် prefetch လုပ်ထားတဲ့ routes တွေကို navigable ဖြစ်နေစေနိုင်ပါတယ်။ [offline support guide](/docs/nextjs/offline-support) ကို ကြည့်ပါ။

> **သိထားသင့်သည်:** Progress bar လို တခြား visual feedback ပုံစံတွေကိုလည်း သုံးနိုင်ပါတယ်။ ဥပမာတစ်ခုကို [ဒီမှာ](https://github.com/vercel/react-transition-progress) ကြည့်ပါ။

### Prefetching ပိတ်ခြင်း (Disabling Prefetching)

`<Link>` component ပေါ်မှာ `prefetch` prop ကို `false` လို့ သတ်မှတ်ခြင်းအားဖြင့် prefetching ကနေ ထွက်လို့ ရပါတယ်။ Link တွေ အများကြီး ပါတဲ့ lists တွေ (ဥပမာ — infinite scroll table) render လုပ်တဲ့အခါ resource တွေ မလိုအပ်ဘဲ မကုန်အောင် ဒါက အသုံးဝင်ပါတယ်။

```tsx
<Link prefetch={false} href="/blog">
  Blog
</Link>
```

ဒါပေမယ့် — prefetching ကို ပိတ်ထားတာက အားသာချက်/အားနည်းချက် (trade-offs) တွေ ပါလာပါတယ်:

- **Static routes** တွေကို user က link ကို click လုပ်မှသာ fetch လုပ်ပါလိမ့်မယ်။
- **Dynamic routes** တွေက client က navigation မလုပ်ခင် server ပေါ်မှာ အရင် render လုပ်ထားဖို့ လိုပါလိမ့်မယ်။

Prefetch ကို လုံးဝ မပိတ်ဘဲ resource သုံးစွဲမှု လျှော့ချဖို့ — hover လုပ်တဲ့အခါမှသာ prefetch လုပ်နိုင်ပါတယ်။ ဒါက viewport ထဲက link အားလုံး မဟုတ်ဘဲ — user သွားဖွယ်ရှိတဲ့ routes တွေကိုပဲ prefetching လုပ်ဖို့ ကန့်သတ်ပေးပါတယ်။

```tsx filename="app/ui/hover-prefetch-link.tsx" switcher
'use client'

import Link from 'next/link'
import { useState } from 'react'

function HoverPrefetchLink({
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

function HoverPrefetchLink({ href, children }) {
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

### Hydration မပြီးမြောက်ခြင်း (Hydration Not Completed)

`<Link>` က Client Component တစ်ခု ဖြစ်ပြီး — routes တွေကို prefetch မလုပ်ခင် hydrate လုပ်ပြီးသား ဖြစ်ရပါမယ်။ ကနဦး ဝင်ရောက်မှုမှာ JavaScript bundles တွေ ကြီးနေရင် hydration နှောင့်နှေးပြီး — prefetching က ချက်ချင်း မစတင်နိုင်အောင် တားဆီးနိုင်ပါတယ်။

React က Selective Hydration နဲ့ ဒါကို လျော့ပါးစေပြီး — အောက်ပါတို့နဲ့ ထပ်မံ မြှင့်တင်နိုင်ပါတယ်:

- ကြီးမားတဲ့ dependencies တွေကို ဖယ်ရှားပြီး bundle size ကို ဖော်ထုတ် လျှော့ချဖို့ [`@next/bundle-analyzer`](/docs/nextjs/package-bundling) plugin ကို သုံးခြင်း။
- ဖြစ်နိုင်ရင် logic တွေကို client ကနေ server ဆီ ရွှေ့ခြင်း။ လမ်းညွှန်ချက်အတွက် [Server and Client Components](/docs/nextjs/server-client-components) docs ကို ကြည့်ပါ။

## ဥပမာများ (Examples)

### Native History API (Browser ၏ မူရင်း History API)

Next.js က page ကို ပြန်လည် မတင်ဘဲ browser ရဲ့ history stack ကို update လုပ်ဖို့ — native [`window.history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) နဲ့ [`window.history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) methods တွေကို သုံးခွင့် ပြုပါတယ်။

`pushState` နဲ့ `replaceState` calls တွေက Next.js Router ထဲ ပေါင်းစပ် ဝင်ရောက်ပြီး — [`usePathname`](/docs/nextjs/use-pathname) နဲ့ [`useSearchParams`](/docs/nextjs/use-search-params) တို့နဲ့ sync လုပ်နိုင်စေပါတယ်။

#### `window.history.pushState`

Browser ရဲ့ history stack ထဲကို entry အသစ်တစ်ခု ထည့်ဖို့ သုံးပါတယ်။ User က ယခင် state ဆီ ပြန်သွားလို့ ရပါတယ်။ ဥပမာ — product list တစ်ခုကို sort လုပ်ဖို့:

```tsx fileName="app/ui/sort-products.tsx" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

```jsx fileName="app/ui/sort-products.js" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

#### `window.history.replaceState`

Browser ရဲ့ history stack ပေါ်မှာ လက်ရှိ entry ကို အစားထိုးဖို့ သုံးပါတယ်။ User က ယခင် state ဆီ ပြန်မသွားနိုင်ပါဘူး။ ဥပမာ — application ရဲ့ locale ကို ပြောင်းဖို့:

```tsx fileName="app/ui/locale-switcher.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```

```jsx fileName="app/ui/locale-switcher.js" switcher
'use client'

import { usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```

