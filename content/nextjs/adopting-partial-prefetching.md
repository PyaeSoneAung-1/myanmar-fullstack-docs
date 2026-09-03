---
title: "Adopting Partial Prefetching (Partial Prefetching ကို လက်ခံကျင့်သုံးခြင်း)"
description: "Partial Prefetching ကို ဘယ်လို enable လုပ်မလဲ၊ `<Link>` အတွက် ဘာတွေ ပြောင်းလဲလဲ — `<Link prefetch={true}>` calls တွေနဲ့ URL data အတွက် routes တွေကို audit လုပ်ခြင်း၊ URL data prefetching အပါအဝင်"
order: 187
source: "https://nextjs.org/docs/app/guides/adopting-partial-prefetching"
status: translated
updated: 2026-09-03
---

[Partial Prefetching](https://nextjs.org/docs/app/glossary#partial-prefetching) က Cache Components route တစ်ခုအတွက် `<Link>` တစ်ခု ဒေါင်းလုဒ်လုပ်တဲ့ အရာကို ပြောင်းလဲပေးပါတယ်။ Partial Prefetching enable လုပ်ထားရင် — `<Link>` တစ်ခုက route ရဲ့ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) ကို prefetch လုပ်ပါတယ်: ဆိုလိုတာက route ရဲ့ static content နဲ့ URL ပေါ် မမူတည်တဲ့ cached content ပါ။ Next.js က route တစ်ခုချင်းစီအတွက် App Shell တစ်ခု တည်ဆောက်ပြီး — အရင်ကလို link တစ်ခုချင်းစီကို သီးခြားစီ prefetch လုပ်ခဲ့သလို မဟုတ်ဘဲ — အဲဒီ route ဆီ ညွှန်တဲ့ link တိုင်းအတွက် ပြန်သုံးပါတယ်။

App Shell ထက်ပိုပြီး prefetch လုပ်ချင်ရင် — link တစ်ခုက [`<Link prefetch={true}>`](/docs/nextjs/component-link) နဲ့ [per-link prefetching](/docs/nextjs/optimizing-prefetching) ကို opt in လုပ်နိုင်ပါတယ်။ အဲဒီအခါ prefetch က `params`, `searchParams` (သို့) URL အပြည့်အစုံပေါ် မူတည်တဲ့ URL-specific content တွေကိုပါ ဖြေရှင်းပေးပါတယ်။

ဒီလမ်းကြောင်းတစ်လျှောက် — Next.js က development မှာ [instant navigation](https://nextjs.org/docs/app/guides/instant-navigation) insights တွေကို ပေါ်လွင်စေပြီး — ဘယ် link (သို့) route ကို ပြောင်းရမယ်ဆိုတာ နာမည်နဲ့တကွ ညွှန်ပြပါတယ်။

> **သိထားသင့်သည်:** Partial Prefetching က [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) enable လုပ်ထားမှပဲ အလုပ်လုပ်ပါတယ်။

## Adoption skill ကို သုံးပါ (အကြံပြုထား)

[`next-partial-prefetching-adoption`](https://github.com/vercel/next.js/tree/canary/skills/next-partial-prefetching-adoption) skill က coding agent တစ်ခုနဲ့အတူ ဒီ adoption ကို ဆောင်ရွက်ပေးပါတယ်။ သင့် `<Link prefetch={true}>` calls တွေကို သင်နဲ့အတူ audit လုပ်ပြီး — flag ကို enable လုပ်ကာ — ဒီ guide ထဲက insights တွေအတွက် route တိုင်းကို လှည့်လည် စစ်ဆေးပေးပါတယ်။

Skill ကို install လုပ်ပါ:

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-partial-prefetching-adoption
```

ပြီးရင် agent ကို ဒီ prompt ပေးပါ:

```prompt
Adopt Partial Prefetching in this project using the next-partial-prefetching-adoption skill.
```

## ဒါမှမဟုတ် ကိုယ်တိုင် adopt လုပ်ခြင်း

ရှိပြီးသား app တစ်ခုကို ကိုယ်တိုင် adopt လုပ်တာက — `next dev` မှာ Next.js က ပေါ်လွင်စေတဲ့ [instant navigation](https://nextjs.org/docs/app/guides/instant-navigation) insights နှစ်ခုကို လိုက်နာရပါတယ်:

1. `partialPrefetching` ကို enable လုပ်ပြီး — `<Link prefetch={true}>` calls တိုင်းကို audit လုပ်ကာ — သူ့ရဲ့ prefetch က ပေးအပ်ခဲ့တာတွေကို ထိန်းသိမ်းဖို့ destination တစ်ခုချင်းစီအတွက် ဆုံးဖြတ်ပါ။ Adoption က ကြီးလွန်းလို့ reviewers တွေက သေးငယ်တဲ့ diffs တွေ လိုအပ်တဲ့အခါ (သို့) adopted routes တွေက ကျန်တာတွေထက် အရင် users ဆီ ရောက်သင့်တဲ့အခါ — flag ကို ပိတ်ထားပြီး [dynamic data during prefetching](https://nextjs.org/docs/messages/instant-link-prefetch-partial) insight ရဲ့ လမ်းညွှန်မှုနဲ့အတူ — တစ်ဆင့်ချင်း (incrementally) adopt လုပ်နိုင်ပါတယ်။
2. URL data အတွက် routes တွေကို audit လုပ်ပြီး — [URL data outside of Suspense](https://nextjs.org/docs/messages/instant-shell-url-data) insight ကို ဖြေရှင်းပါ။
3. Optional အနေနဲ့ — navigation အပြီးမှာ stream လုပ်တာ မလုံလောက်တဲ့ routes တွေမှာ URL data ကို prefetch လုပ်ပါ။

Insights နှစ်ခုလုံးက development အတွက်ပဲ ဖြစ်ပြီး — build ကို ဘယ်တော့မှ မပိတ်ဆို့ပါဘူး။ သူတို့က dev overlay ထဲမှာ fix cards တွေနဲ့အတူ ပေါ်လာပြီး — fix တစ်ခုချင်းစီအတွက် docs page ဆီ ချိတ်ဆက်ပေးပါတယ်။ Route တစ်ခုက adopt လုပ်ဖို့ အသင့်မဖြစ်သေးရင် — သူ့ရဲ့ page (သို့) layout ကနေ [`instant = false`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant) export လုပ်ပြီး — အဲဒီ route ကို instant-navigation validation ကနေ ဖယ်ထားနိုင်ပြီး — နောက်မှ ပြန်လုပ်နိုင်ပါတယ်။

## Partial Prefetching ကို enable လုပ်ခြင်း

`next.config.ts` ထဲမှာ [`partialPrefetching`](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) ကို enable လုပ်ပါ:

```ts filename="next.config.ts" highlight={5}
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
```

Flag ကို enable လုပ်ပြီးနောက် — `<Link>` တိုင်းက သူ့ destination ရဲ့ App Shell ကို prefetch လုပ်ပြီး — `<Link prefetch={true}>` ကတော့ route ရဲ့ dynamic content တွေကို မပါဝင်တော့ပါဘူး။ သူတို့ ပေးအပ်ခဲ့တာတွေကို ထိန်းသိမ်းဖို့ အဲဒီ links တွေကို နောက်တစ်ဆင့်မှာ audit လုပ်ပါ။ Project အသစ်တစ်ခုမှာတော့ audit လုပ်စရာ legacy links တွေ မရှိလို့ — ဒီနေရာမှာပဲ ပြီးပါတယ်။

## `<Link>` အတွက် ဘာတွေ ပြောင်းလဲသွားလဲ

| `<Link>` prop                       | Before (Cache Components default)                                    | Partial Prefetching ပြီးနောက်                                                                                                   |
| ----------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `<Link href="/x">`                  | Cached page render ကို prefetch လုပ်ခဲ့တယ်                          | `/x` အတွက် shared App Shell ကို load လုပ်တယ်                                                                                  |
| `<Link href="/x" prefetch>`         | Cached page render **နဲ့** dynamic content တွေကိုပါ prefetch လုပ်ခဲ့တယ် | App Shell ကို load လုပ်ပြီး — `/x` က ဖတ်တဲ့အခါ [per-link prefetching](/docs/nextjs/optimizing-prefetching) ကနေတစ်ဆင့် URL-specific content တွေပါ ပါဝင်တယ် |
| `<Link href="/x" prefetch={false}>` | ဒီ link အတွက် prefetching ကို ပိတ်ထားခဲ့တယ်                       | မပြောင်းပါဘူး — ဆက်ပြီး ပိတ်ထားဆဲပါ                                                                                          |

App Shell က dynamic params ဘယ်လိုပဲ ရှိရှိ — route တစ်ခုဆီ ညွှန်တဲ့ link တိုင်းကြားမှာ share လုပ်လို့ — destination တစ်ခုတည်းကို ညွှန်တဲ့ `<Link>` အများကြီး render လုပ်တာက အလုပ်တွေကို မများစေပါဘူး။

## `<Link prefetch={true}>` calls တွေကို audit လုပ်ခြင်း

`<Link prefetch={true}>` တစ်ခုချင်းစီက — အရင်က destination ရဲ့ dynamic content တွေကို page နဲ့အတူ prefetch လုပ်ခဲ့ပါတယ်။ Flag ဖွင့်ထားချိန်မှာ — ဒါက တခြား link တွေလိုပဲ App Shell ကို load လုပ်ပြီး — အဲဒါက အရင် full prefetch ထက် ပိုပါးလွှာနိုင်ပါတယ်။ တစ်ခုချင်းစီကို သွားကြည့်ပြီး — destination က ဘာတွေကို ဆက် prefetch လုပ်သင့်လဲ ဆုံးဖြတ်ပါ:

> **သိထားသင့်သည်:** `cookies()` နဲ့ `headers()` တွေက prefetch တစ်ခုကို URL တစ်ခုနဲ့ ချည်နှောင်မထားပါဘူး။ သူတို့က session တစ်ခုချင်းစီအလိုက် ပြောင်းလဲတာ ဖြစ်ပြီး — link တစ်ခုချင်းစီအလိုက် မဟုတ်ပါဘူး။ ဒါကြောင့် App Shell က session content တွေကို ဆက်သယ်ဆောင်ပါတယ်။ `params` နဲ့ `searchParams` တွေကပဲ [URL data](https://nextjs.org/docs/app/glossary#url-data) ဖြစ်ပြီး — link တစ်ခုချင်းစီအလိုက် ပြောင်းလဲတာမို့ — shared App Shell ထဲမှာ မထည့်နိုင်ပါဘူး။

| Destination                                                                 | Recommendation (အကြံပြုချက်)                                                    |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Static အပြည့်အစုံ (သို့) content က cache ဖြစ်ပြီးသား                        | အခု မလိုတော့တဲ့ `prefetch={true}` ကို ဖယ်ပါ                                       |
| Click မလုပ်ခင် ရှေ့မှာ ထားချင်တဲ့ uncached content တွေ ပေးအပ်နေတာ           | `use cache` နဲ့ cache လုပ်ပြီး — `prefetch={true}` ကို ဖယ်ပါ                      |
| `cookies()` (သို့) `headers()` ပေါ် မူတည်တဲ့ content တွေ ပေးအပ်နေတာ         | Session value ရဲ့ နောက်မှာ lookup ကို cache လုပ်ပြီး — `prefetch={true}` ကို ဖယ်ပါ |
| URL data ဖတ်တာ (သို့) အဲဒါပေါ် မူတည်တဲ့ cached content ရှိတာ                | Content ကို click မလုပ်ခင် ဖြေရှင်းဖို့ `prefetch={true}` ကို ထားပါ               |
| Request တိုင်းမှာ အသစ် ဖြစ်နေရတဲ့ real-time content တွေ ပေးအပ်နေတာ          | `prefetch={true}` ဖယ်ပြီး — content ကို stream ဝင်ခွင့်ပြုပါ                       |

### Static (သို့) cached content

Output က App Shell ထဲမှာ ရှိပြီးသားပါ။ အခု မလိုတော့တဲ့ `prefetch={true}` ကို ဖယ်လိုက်ပါ:

```tsx filename="app/nav.tsx"
// Before
<Link href="/about" prefetch={true}>About</Link>
// After
<Link href="/about">About</Link>
```

### Uncached content

`use cache` နဲ့ cache လုပ်လိုက်ရင် App Shell ထဲ ပါဝင်သွားပြီး — links တွေကနေ `prefetch={true}` ကို ဖယ်လိုက်ပါ:

```tsx filename="app/products/page.tsx" switcher
// Before
export default async function Page() {
  const res = await fetch('https://api.example.com/products')
  return <ProductList products={await res.json()} />
}
```

```jsx filename="app/products/page.js" switcher
// Before
export default async function Page() {
  const res = await fetch('https://api.example.com/products')
  return <ProductList products={await res.json()} />
}
```

```tsx filename="app/products/page.tsx" switcher
// After - cached ဖြစ်လို့ App Shell က သယ်ဆောင်သွားတယ်
async function getProducts() {
  'use cache'
  const res = await fetch('https://api.example.com/products')
  return res.json()
}

export default async function Page() {
  return <ProductList products={await getProducts()} />
}
```

```jsx filename="app/products/page.js" switcher
// After - cached ဖြစ်လို့ App Shell က သယ်ဆောင်သွားတယ်
async function getProducts() {
  'use cache'
  const res = await fetch('https://api.example.com/products')
  return res.json()
}

export default async function Page() {
  return <ProductList products={await getProducts()} />
}
```

> **သိထားသင့်သည်:** App Shell က [`stale`](/docs/nextjs/cache-life) time အနည်းဆုံး ၅ မိနစ် ရှိတဲ့ cached content တွေကို သယ်ဆောင်ပါတယ် — အပေါ်မှာ သုံးထားတဲ့ `default` profile နဲ့ `seconds` ကလွဲပြီး preset တိုင်းအတွက် ဒါက မှန်ပါတယ်။ သက်တမ်း ပိုတိုတဲ့ content တွေကတော့ navigation အပြီးမှာ stream ဝင်ပါတယ်။ [Prerendering behavior](/docs/nextjs/cache-life) ကို ကြည့်ပါ။

### Session content

[`cookies()`](/docs/nextjs/cookies) (သို့) [`headers()`](/docs/nextjs/headers) နောက်မှာ ရှိတဲ့ content တွေက session တစ်ခုချင်းစီအလိုက် ပြောင်းလဲပြီး — link တစ်ခုချင်းစီအလိုက် မဟုတ်ပါဘူး။ [Session data က App Shell ထဲမှာ ဖြေရှင်းပါတယ်](/docs/nextjs/optimizing-prefetching) — ဒါကြောင့် cached session content တွေ ဆက်ပါဝင်နေပါတယ်။ Session value ကို cached function ရဲ့ အပြင်မှာ ဖတ်ပြီး — ထဲကို ထည့်ပေးပါ — ပြီးရင် links တွေကနေ `prefetch={true}` ကို ဖယ်လိုက်ပါ:

```tsx filename="app/dashboard/page.tsx" switcher
// Before
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function TeamTopics() {
  const team = (await cookies()).get('team')?.value
  const topics = await db.topics.forTeam(team)
  return <TopicList topics={topics} />
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <TeamTopics />
    </Suspense>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
// Before
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function TeamTopics() {
  const team = (await cookies()).get('team')?.value
  const topics = await db.topics.forTeam(team)
  return <TopicList topics={topics} />
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <TeamTopics />
    </Suspense>
  )
}
```

```tsx filename="app/dashboard/page.tsx" switcher
// After - lookup ကို session value ရဲ့ နောက်မှာ cache လုပ်ထားတယ်
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function getTopics(team: string | undefined) {
  'use cache'
  return db.topics.forTeam(team)
}

async function TeamTopics() {
  const team = (await cookies()).get('team')?.value
  return <TopicList topics={await getTopics(team)} />
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <TeamTopics />
    </Suspense>
  )
}
```

```jsx filename="app/dashboard/page.js" switcher
// After - lookup ကို session value ရဲ့ နောက်မှာ cache လုပ်ထားတယ်
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function getTopics(team) {
  'use cache'
  return db.topics.forTeam(team)
}

async function TeamTopics() {
  const team = (await cookies()).get('team')?.value
  return <TopicList topics={await getTopics(team)} />
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <TeamTopics />
    </Suspense>
  )
}
```

### URL data

[URL data](https://nextjs.org/docs/app/glossary#url-data) (`params`, `searchParams`) က link တစ်ခုချင်းစီအလိုက် ပြောင်းလဲတာမို့ — အဲဒါပေါ် မူတည်တဲ့ content တွေက shared App Shell ထဲမှာ မထည့်နိုင်ဘဲ — သူ့ရဲ့ `<Suspense>` boundary ရဲ့ နောက်ကနေ navigation အပြီးမှာ stream ဝင်ပါတယ်။ Links တွေက `prefetch={true}` ကို ဆက်ထားပြီး — အောက်က URL data ကို prefetch လုပ်ခြင်း ဆိုတဲ့ section မှာ click မလုပ်ခင် content တွေကို prefetch လုပ်နည်း အကျုံးဝင်ပါတယ်။

### Real-time content

Real-time content တစ်ခုရဲ့ prefetch က click လုပ်တဲ့အချိန်မှာ stale ဖြစ်နေမှာမို့ — ထိန်းသိမ်းစရာ ဘာမှ မရှိပါဘူး။ `prefetch={true}` ကို ဖယ်ပြီး — content ကို သူ့ရဲ့ `<Suspense>` boundary ရဲ့ နောက်ကနေ stream ဝင်ခွင့်ပြုပါ။

## တစ်ဆင့်ချင်း (Incrementally) adopt လုပ်ခြင်း

Adoption က တစ်ခါတည်း ပြောင်းလဲမှုတစ်ခုတည်းနဲ့ ဖြစ်စရာ မလိုပါဘူး။ [`prefetch = 'partial'`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/prefetch#partial) က global flag ကို route တစ်ခုတည်းနဲ့ scope လုပ်ထားတာပါ — ဒါကြောင့် global flag ကို ပိတ်ထားဆဲနဲ့ — destination တစ်ခုချင်းစီကို သီးခြား adopt လုပ်ပြီး deploy လုပ်နိုင်ပါတယ်။

Flag ပိတ်ထားချိန်မှာ — `prefetch={true}` က legacy full prefetch ကို ဆက်လုပ်ဆောင်ပါတယ်။ Development မှာ ဒီ links တွေထဲက တစ်ခုကနေတစ်ဆင့် navigate လုပ်တာက — destination ရဲ့ နာမည်နဲ့အတူ — သူ့ရဲ့ fixes တွေကို ညွှန်ပြတဲ့ [dynamic data during prefetching](https://nextjs.org/docs/messages/instant-link-prefetch-partial) insight ကို ပေါ်လွင်စေပါတယ်:

**Partial Prefetching ကို opt in လုပ်ပါ** — [instant-link-prefetch-partial message](https://nextjs.org/docs/messages/instant-link-prefetch-partial#opt-into-partial-prefetching) ကို ကြည့်ပါ:

```tsx
// page.tsx or layout.tsx
export const prefetch = 'partial'
```

**Default prefetch ကို သုံးပါ** — [instant-link-prefetch-partial message](https://nextjs.org/docs/messages/instant-link-prefetch-partial#use-the-default-prefetch) ကို ကြည့်ပါ:

```tsx
<Link href="/dashboard">
  Dashboard
</Link>
```

Card တစ်ခုချင်းစီက click လုပ်လို့ရပြီး — patterns, code samples နဲ့ trade-offs တွေ ပါတဲ့ page တစ်ခုကို ဖွင့်ပေးပါတယ်။

1. Destination တစ်ခုကို audit လုပ်ပြီး — သူ့ရဲ့ prefetch က ပေးအပ်ခဲ့တာတွေကို ထိန်းသိမ်းကာ — အပေါ်က ဇယားအတိုင်း သူ့ links တွေရဲ့ `prefetch={true}` ကို update လုပ်ပါ။ ပြီးရင် — သူ့ page (သို့) layout မှာ `export const prefetch = 'partial'` ထည့်ပြီး adopt လုပ်လိုက်ပါ — ဒါက အဲဒီ route ကို ညွှန်တဲ့ link တိုင်းအတွက် insight ကို ရှင်းလင်းပေးပါတယ်:

   ```tsx filename="app/dashboard/page.tsx" switcher
   // Before
   export default function Page() {
     return <Dashboard />
   }
   ```

   ```jsx filename="app/dashboard/page.js" switcher
   // Before
   export default function Page() {
     return <Dashboard />
   }
   ```

   ```tsx filename="app/dashboard/page.tsx" switcher
   // After - global flag မပါဘဲ adopt လုပ်ပြီးပြီ
   export const prefetch = 'partial'

   export default function Page() {
     return <Dashboard />
   }
   ```

   ```jsx filename="app/dashboard/page.js" switcher
   // After - global flag မပါဘဲ adopt လုပ်ပြီးပြီ
   export const prefetch = 'partial'

   export default function Page() {
     return <Dashboard />
   }
   ```

2. အပြောင်းအလဲကို deploy လုပ်ပါ။ Adopt လုပ်ထားတဲ့ destination ဆီက links တွေက App Shell ကို load လုပ်ပြီး — မရောက်ရသေးတဲ့ destinations တွေအတွက်တော့ insight က ဆက်ပေါ်နေပါတယ်။
3. Scope ထဲက destination တိုင်း adopt ဖြစ်တဲ့အထိ ထပ်လုပ်ပါ — ပြီးရင် အပေါ်က Partial Prefetching ကို enable လုပ်ခြင်း ဆိုတဲ့ section အတိုင်း flag ကို enable လုပ်ပါ။

Per-route `prefetch = 'partial'` exports တွေက အခု မလိုတော့ပါဘူး။ [`remove-partial-prefetch`](/docs/nextjs/upgrading-codemods) codemod နဲ့ — `page` နဲ့ `layout` တိုင်းကနေ `export const prefetch = 'partial'` တွေကို ဖယ်ရှားပြီး — တစ်ခါတည်း ရှင်းလင်းလိုက်ပါ:

```bash filename="Terminal"
npx @next/codemod@canary remove-partial-prefetch ./app
```

> **သိထားသင့်သည်:** `src/` project တစ်ခုမှာဆိုရင် `./src/app` ကို ပေးပါ။ Path မှားရင် fail ဖြစ်မယ့်အစား `0 ok` လို့ ပြလို့ — file အရေအတွက်ကို စစ်ဆေးပါ။

Codemod က `'partial'` တန်ဖိုးကိုပဲ ဖယ်ရှားပြီး — `prefetch = 'force-disabled'` လို တခြား values တွေကို နေရာမှာ ဆက်ထားပါတယ်။

## URL data အတွက် routes တွေကို audit လုပ်ခြင်း

Flag enable လုပ်ထားချိန်မှာ — development မှာ သင် navigate လုပ်တဲ့အခါ Next.js က App Shell တစ်ခုချင်းစီကို validate လုပ်ပါတယ်။ App Shell က route တစ်ခုဆီ ညွှန်တဲ့ link တိုင်းကြားမှာ share လုပ်တာမို့ — URL တစ်ခုတည်းနဲ့ သက်ဆိုင်တဲ့ data တွေ မပါဝင်နိုင်ပါဘူး။ [`params`](/docs/nextjs/file-conventions-page) (သို့) [`searchParams`](/docs/nextjs/file-conventions-page) တွေကို [`<Suspense>`](https://react.dev/reference/react/Suspense) boundary ရဲ့ အပြင်မှာ ဖတ်တာက — shell ကို link ရဲ့ URL နဲ့ ချည်နှောင်ပြီး — route ရဲ့ နာမည်နဲ့အတူ သူ့ရဲ့ fixes တွေကို ညွှန်ပြတဲ့ [URL data outside of Suspense](https://nextjs.org/docs/messages/instant-shell-url-data) insight ကို ပေါ်လွင်စေပါတယ်:

**Suspense ထဲမှာ wrap လုပ်ပါ (သို့) Suspense ထဲကို ရွှေ့ပါ** — [instant-shell-url-data message](https://nextjs.org/docs/messages/instant-shell-url-data#wrap-in-or-move-into-suspense) ကို ကြည့်ပါ:

```tsx
<Suspense fallback={…}>
  <Details params={params} />
</Suspense>
```

**Route ကို blocking ဖြစ်ခွင့်ပြုပါ** — [instant-shell-url-data message](https://nextjs.org/docs/messages/instant-shell-url-data#allow-blocking-route) ကို ကြည့်ပါ:

```tsx
// page.tsx or layout.tsx
export const instant = false
```

Insight က build ကို ဘယ်တော့မှ မပိတ်ဆို့တာမို့ — ဒီ pass ကို flag ဖွင့်ပြီးနောက် ဘယ်အချိန်မဆို လုပ်နိုင်ပါတယ်။ စစ်ဆေးဖို့ — `next dev` မှာ route တိုင်းကို load လုပ်ကြည့်ပါ။

ဖြေရှင်းနည်းကတော့ — route ရဲ့ URL-independent အစိတ်အပိုင်းတွေကို boundary ရဲ့ အပြင်မှာ ထားပြီး — `params` (သို့) `searchParams` ဖတ်တာကို `<Suspense>` ထဲမှာ wrap ထားတဲ့ child တစ်ခုဆီ ရွှေ့လိုက်ပါ:

```tsx filename="app/products/[slug]/page.tsx" switcher
// Before - ထိပ်မှာ params ကို await လုပ်တာက App Shell ကို URL တစ်ခုတည်းနဲ့ ချည်နှောင်တယ်
export default async function Page({ params }: PageProps<'/products/[slug]'>) {
  const { slug } = await params
  const product = await getProduct(slug)
  return (
    <ProductLayout>
      <Details product={product} />
    </ProductLayout>
  )
}
```

```jsx filename="app/products/[slug]/page.js" switcher
// Before - ထိပ်မှာ params ကို await လုပ်တာက App Shell ကို URL တစ်ခုတည်းနဲ့ ချည်နှောင်တယ်
export default async function Page({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  return (
    <ProductLayout>
      <Details product={product} />
    </ProductLayout>
  )
}
```

```tsx filename="app/products/[slug]/page.tsx" switcher
// After - promise ကို await မလုပ်ဘဲ အောက်ကို ပို့လိုက်တယ်
import { Suspense } from 'react'
import { ProductDetails } from './product-details'

export default function Page({ params }: PageProps<'/products/[slug]'>) {
  return (
    <ProductLayout>
      <Suspense fallback={<DetailsSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    </ProductLayout>
  )
}
```

```jsx filename="app/products/[slug]/page.js" switcher
// After - promise ကို await မလုပ်ဘဲ အောက်ကို ပို့လိုက်တယ်
import { Suspense } from 'react'
import { ProductDetails } from './product-details'

export default function Page({ params }) {
  return (
    <ProductLayout>
      <Suspense fallback={<DetailsSkeleton />}>
        <ProductDetails params={params} />
      </Suspense>
    </ProductLayout>
  )
}
```

Child က promise ကို boundary ရဲ့ အတွင်းမှာ await လုပ်ပါတယ်:

```tsx filename="app/products/[slug]/product-details.tsx" switcher
export async function ProductDetails({
  params,
}: Pick<PageProps<'/products/[slug]'>, 'params'>) {
  const { slug } = await params
  const product = await getProduct(slug)
  return <Details product={product} />
}
```

```jsx filename="app/products/[slug]/product-details.js" switcher
export async function ProductDetails({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  return <Details product={product} />
}
```

Boundary ရဲ့ အပြင်မှာရှိတဲ့ အရာအားလုံးက shared App Shell ထဲမှာ ဆက်ရှိနေပြီး — URL-specific ဖြစ်တဲ့ အပိုင်းကပဲ navigation တစ်ခုချင်းစီမှာ render ဖြစ်ပါတယ်။ Insight ပျောက်သွားပြီး — page က အဓိပ္ပာယ်ရှိတဲ့ UI ကို ဆက်ပြသနေသေးလားဆိုတာ အတည်ပြုဖို့ — route ကို ပြန် load (သို့) navigate လုပ်ကြည့်ပါ။

> **သိထားသင့်သည်:** [`generateMetadata`](/docs/nextjs/generate-metadata) ထဲမှာ `params` (သို့) `searchParams` ဖတ်တာက — [URL data in `generateMetadata()`](https://nextjs.org/docs/messages/blocking-prerender-metadata-runtime) အဖြစ် ပေါ်လာပါတယ်။

## URL data ကို prefetch လုပ်ခြင်း

[URL data](https://nextjs.org/docs/app/glossary#url-data) (`params`, `searchParams`) ပေါ် မူတည်တဲ့ content တွေက shared App Shell ထဲမှာ မထည့်နိုင်လို့ — navigation အပြီးမှာ stream ဝင်ပါတယ်။ [`prefetch={true}`](https://nextjs.org/docs/app/guides/optimizing-prefetching) ပါတဲ့ links တွေအတွက်တော့ [per-link prefetching](/docs/nextjs/optimizing-prefetching) က — prefetchable link တစ်ခုချင်းစီအတွက် server invocation တစ်ခု ကုန်ကျမှုနဲ့အတူ — click မလုပ်ခင် အဲဒါတွေကို ဖြေရှင်းပေးပါတယ်။ Content ကို prefetch time မှာ ဖြေရှင်းလို့ရအောင် — ဖတ်တဲ့နေရာရဲ့ နောက်မှာ [`use cache`](/docs/nextjs/use-cache) နဲ့ cache လုပ်ပါ။ `searchParams` ကို ဖတ်တဲ့ search page တစ်ခုအတွက်:

```tsx filename="app/search/page.tsx" switcher
// Before - ရလဒ်တွေက navigation အပြီးမှာ stream ဝင်တယ်
import { Suspense } from 'react'

async function getResults(query: string) {
  const res = await fetch(`https://api.example.com/search?q=${query}`)
  return res.json()
}

async function Results({
  searchParams,
}: Pick<PageProps<'/search'>, 'searchParams'>) {
  const { q } = await searchParams
  return <ResultList results={await getResults(q)} />
}

export default function Page({ searchParams }: PageProps<'/search'>) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Results searchParams={searchParams} />
    </Suspense>
  )
}
```

```jsx filename="app/search/page.js" switcher
// Before - ရလဒ်တွေက navigation အပြီးမှာ stream ဝင်တယ်
import { Suspense } from 'react'

async function getResults(query) {
  const res = await fetch(`https://api.example.com/search?q=${query}`)
  return res.json()
}

async function Results({ searchParams }) {
  const { q } = await searchParams
  return <ResultList results={await getResults(q)} />
}

export default function Page({ searchParams }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Results searchParams={searchParams} />
    </Suspense>
  )
}
```

```tsx filename="app/search/page.tsx" switcher
// After - ရလဒ်တွေကို cache လုပ်ပြီး ဖြေရှင်းပြီးသား searchParams ရဲ့ နောက်မှာ prefetch လုပ်ထားတယ်
import { Suspense } from 'react'

async function getResults(query: string) {
  'use cache'
  const res = await fetch(`https://api.example.com/search?q=${query}`)
  return res.json()
}

async function Results({
  searchParams,
}: Pick<PageProps<'/search'>, 'searchParams'>) {
  const { q } = await searchParams
  return <ResultList results={await getResults(q)} />
}

export default function Page({ searchParams }: PageProps<'/search'>) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Results searchParams={searchParams} />
    </Suspense>
  )
}
```

```jsx filename="app/search/page.js" switcher
// After - ရလဒ်တွေကို cache လုပ်ပြီး ဖြေရှင်းပြီးသား searchParams ရဲ့ နောက်မှာ prefetch လုပ်ထားတယ်
import { Suspense } from 'react'

async function getResults(query) {
  'use cache'
  const res = await fetch(`https://api.example.com/search?q=${query}`)
  return res.json()
}

async function Results({ searchParams }) {
  const { q } = await searchParams
  return <ResultList results={await getResults(q)} />
}

export default function Page({ searchParams }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Results searchParams={searchParams} />
    </Suspense>
  )
}
```

[Optimizing prefetching guide](/docs/nextjs/optimizing-prefetching) မှာ — ဒီကုန်ကျစရိတ် ဘယ်အခါမှာ တန်လဲ၊ runtime reads တွေရဲ့ နောက်ကွယ်က caching patterns တွေအကြောင်းကို အကျယ်တဝင့် ဖော်ပြထားပါတယ်။
