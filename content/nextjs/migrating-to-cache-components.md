---
title: "Cache Components သို့ ပြောင်းရွှေ့ခြင်း (Migrating to Cache Components)"
description: "Route segment configs (`dynamic`, `revalidate`, `fetchCache`) တွေကနေ Cache Components (`use cache`, `cacheLife`) ဆီ ဘယ်လို ပြောင်းရွှေ့မလဲ — validation, adoption skill နဲ့ config/API တစ်ခုချင်းစီအတွက် လမ်းညွှန်ချက်တွေ"
order: 234
source: "https://nextjs.org/docs/app/guides/migrating-to-cache-components"
status: translated
updated: 2026-09-03
---

[Cache Components](/docs/nextjs/next-config-cache-components) enable လုပ်ထားရင် — `dynamic`, `revalidate`, `fetchCache` လို route segment configs တွေကို [`use cache`](/docs/nextjs/use-cache) နဲ့ [`cacheLife`](/docs/nextjs/cache-life) တို့နဲ့ အစားထိုးလိုက်ပါတယ်။

ဒီပြောင်းရွှေ့မှုကို **instant navigation validation** (ချက်ချင်း navigation စစ်ဆေးခြင်း) ကနေ မောင်းနှင်ပါတယ်။ Cache Components နဲ့ဆို — Next.js က development မှာ route တစ်ခုချင်းစီဆီ ဝင်တဲ့အခါ ချက်ချင်း (instantly) render ဖြစ်မဖြစ် စစ်ဆေးပြီး — အဲဒါကို တားဆီးမယ့် code တွေကို error (သို့) insight အဖြစ် ပြသပါတယ်။

## Adoption skill ကို သုံးခြင်း (Use the adoption skill, recommended)

[`next-cache-components-adoption`](https://github.com/vercel/next.js/tree/canary/skills/next-cache-components-adoption) skill က ဒီပြောင်းရွှေ့မှုကို coding agent တစ်ခုနဲ့အတူ — feature တစ်ခုချင်းစီကို တစ်ကြိမ်မှာ တစ်ခုစီ — လုပ်ဆောင်ပေးပြီး — feature boundary တိုင်းမှာ check-in လုပ်ပါတယ်။ Mode နှစ်မျိုး support လုပ်ပါတယ်:

- **Incremental (တစ်ဆင့်ချင်း)** — route တိုင်းကို validation ကနေ opt out လုပ်ထားတဲ့ mechanical PR တစ်ခုတည်းကို ဖွင့်ပြီး — feature တစ်ခုချင်းစီကို follow-up PR တွေအနေနဲ့ တင်ပို့ပါတယ်။ ဒါက အောက်က Adopting incrementally (တစ်ဆင့်ချင်း လက်ခံကျင့်သုံးခြင်း) flow ကို အလိုအလျောက် လုပ်ပေးတာပါ။
- **Direct (တိုက်ရိုက်)** — branch တစ်ခုတည်းပေါ်မှာ route အားလုံးကို နေရာတိုင်းမှာ (in place) adopt လုပ်ပါတယ်။

Skill ကို install လုပ်ရန်:

```bash filename="Terminal"
npx skills add vercel/next.js --skill next-cache-components-adoption
```

ပြီးရင် agent ကို ဒီ prompt ပေးလိုက်ပါ:

```prompt
Adopt Cache Components in this project using the next-cache-components-adoption skill.
```

## ဒါမှမဟုတ် ကိုယ်တိုင် migrate လုပ်ခြင်း (Migrate by hand)

ရှိပြီးသား app တစ်ခုကို ကိုယ်တိုင် migrate လုပ်တာက အောက်က အဆင့်တွေအတိုင်း အစဉ်လိုက် သွားပါတယ်:

1. `next.config.ts` ထဲမှာ Cache Components ကို enable လုပ်ပါ။
2. သင့်နည်းလမ်းကို ဆုံးဖြတ်ပါ: route အားလုံးကို အခုတင် ပြောင်းမလား — ဒါမှမဟုတ် ပထမဆုံး routes တွေကို validation ကနေ opt out လုပ်ပြီး — တစ်ခုချင်းစီ ပြောင်းတဲ့ incremental နည်းကို သုံးမလား။
3. သူ့ဆီက ထွက်လာတဲ့ validation errors နဲ့ insights တွေကို လိုက်လုပ်ပါ — route segment config တစ်ခုချင်းစီကို Cache Components နဲ့ ညီမျှတဲ့ဟာနဲ့ အစားထိုးပြီး — uncached data တွေကို [`use cache`](/docs/nextjs/use-cache) နဲ့ cache လုပ်ပါ (သို့) runtime data တွေကို [`<Suspense>`](https://react.dev/reference/react/Suspense) ထဲမှာ wrap လုပ်ပါ။ အောက်က key တစ်ခုချင်းစီအတွက် section တွေက config နဲ့ API တိုင်းကို အကျုံးဝင်အောင် ဖော်ပြထားပါတယ်။

သင့်မှာ ရှိပြီးသား `fetch` နဲ့ `unstable_cache` caching တွေက သီးခြား layer တစ်ခုအနေနဲ့ ဆက်အလုပ်လုပ်နေဦးမှာမို့ — ဘာတွေကို ပြောင်းရမလဲဆိုတာ insights နဲ့ errors တွေ ညွှန်တဲ့အတိုင်း လိုက်လုပ်ပါ။

အချို့နေရာတွေမှာတော့ ကိုယ်ပိုင် အဆင့်တွေ ရှိပါတယ်:

- Dynamic params ပါတဲ့ routes တွေအတွက် — အောက်က `generateStaticParams` နဲ့ `dynamicParams` လမ်းညွှန်ချက်အတိုင်း လုပ်ပါ။
- Metadata အတွက် — အောက်က `generateMetadata` နဲ့ `generateViewport` လမ်းညွှန်ချက်အတိုင်း လုပ်ပါ။

အောက်က sections တွေမှာ — Cache Components အောက်မှာ config နဲ့ API တစ်ခုချင်းစီကို ဘာလုပ်ရမလဲဆိုတာ အပြည့်အစုံ ဖော်ပြထားပါတယ်။

## Cache Components ကို enable လုပ်ခြင်း (Enable Cache Components)

Cache Components က Next.js 16 လိုအပ်ပါတယ်။ Next.js 15 ဒါမှမဟုတ် ဒီထက်စောတဲ့ version သုံးနေရင် — [version 16 upgrade guide](/docs/nextjs/upgrading-version-16) အတိုင်း အရင်ဆုံး upgrade လုပ်ပါ။ ပိုအဟောင်းဖြစ်တဲ့ version တစ်ခုကနေ လာတာဆိုရင် — 16 ကို မရောက်ခင် [upgrade guides](/docs/nextjs/upgrading) တွေကို အစဉ်လိုက် ဖြတ်ကျော်ပြီးမှ ဆက်လုပ်ပါ။

ပြီးရင် `next.config.ts` ထဲမှာ [`cacheComponents`](/docs/nextjs/next-config-cache-components) flag ကို enable လုပ်ပါ:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

> **သိထားသင့်သည်**: `experimental.dynamicIO` (သို့) `experimental.useCache` သုံးနေတယ်ဆိုရင် — `cacheComponents` က အဲဒါတွေကို အစားထိုးလိုက်ပါတယ်။ [version 16 upgrade guide](/docs/nextjs/upgrading-version-16) မှာ ကြည့်ပါ။

Flag ကို enable လုပ်ပြီးတဲ့နောက် — `dynamic`, `revalidate`, (သို့) `fetchCache` တွေကို ဆက်ပြီး export လုပ်ထားတဲ့ route segments တွေက error တက်ပါလိမ့်မယ်။ အဲဒီ configs တွေကို အစားထိုးတာကနေ စတင်ပါ။ ဘယ်တစ်ခုအတွက် ဘာလုပ်ရမလဲဆိုတာ အောက်က sections တွေမှာ ရှင်းပြထားပါတယ်။

## Validation ကနေ opt out လုပ်ခြင်း (Opting out of validation)

Validation insight (သို့) error တစ်ခုက route တစ်ခုက ချက်ချင်း render ဖြစ်မှာ မဟုတ်ဘူးဆိုတာ ပြောပါတယ်။ အကြံပြုချက်အတိုင်း လိုက်လုပ်ပြီး ဖြေရှင်းပါ: data ကို [`use cache`](/docs/nextjs/use-cache) နဲ့ cache လုပ်ပါ (သို့) [`<Suspense>`](https://react.dev/reference/react/Suspense) ထဲမှာ wrap လုပ်ပါ။ အခုချိန်မှာ မဖြေရှင်းနိုင်သေးဘူးဆိုရင် — error တက်စေတဲ့ segment (layout တစ်ခု၊ page တစ်ခု၊ (သို့) parallel slot တစ်ခု) ပေါ်မှာ [`instant`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant) config ကို `false` လို့ သတ်မှတ်ပြီး — နောက်မှ ပြန်လုပ်ပါ။

```tsx filename="app/dashboard/layout.tsx"
export const instant = false
```

> **သိထားသင့်သည်**: `instant = false` က segment တစ်ခုကို _block လုပ်ခွင့်ရှိသည် (allowed to block)_ လို့ မှတ်သားပေးတာပါ။ Route ကို dynamic ဖြစ်အောင် အတင်းအကျပ် မလုပ်ပါဘူး — ဒါကြောင့် တကယ် prerender လုပ်လို့ရတဲ့ route ဆိုရင် static shell ကို ဆက်ပြီး ထုတ်ပေးပါတယ်။ Synchronous IO build errors တွေကိုလည်း ရှင်းမပေးပါဘူး: `new Date()`, `Math.random()`, `crypto.randomUUID()` လို ခေါ်ဆိုမှုတွေက prerender ကို ဆက်ပြီး fail ဖြစ်စေပါတယ်။ အောက်က Adopting incrementally (တစ်ဆင့်ချင်း လက်ခံကျင့်သုံးခြင်း) အပိုင်းကို ကြည့်ပါ။

## တစ်ဆင့်ချင်း လက်ခံကျင့်သုံးခြင်း (Adopting incrementally)

Route အားလုံးကို တစ်ပြိုင်နက် migrate လုပ်စရာ မလိုပါဘူး။ `instant = false` က app တစ်ခုလုံးကို အရင်ဆုံး build ဖြစ်ပြီး run နိုင်အောင် လုပ်ပေးပြီး — နောက်မှ route တွေကို တစ်ခုချင်းစီ ပြောင်းလို့ရပါတယ်:

1. **Flag ကို enable လုပ်ပြီး route segment configs တွေကို ဖယ်ရှားပါ** (`dynamic`, `revalidate`, `fetchCache`)။ ချက်ချင်း render ဖြစ်နေဆဲ routes တွေက နောက်ထပ် အလုပ်မလိုပါဘူး။
2. **အသင့်မဖြစ်သေးတဲ့ routes တွေကို opt out လုပ်ပါ**။ Insight (သို့) error ပေါ်တဲ့နေရာတိုင်းမှာ — အဲဒါကို တက်စေတဲ့ segment ပေါ်မှာ `instant = false` သတ်မှတ်ပါ။ App တစ်ခုလုံးကို တစ်ခါတည်း လုပ်ဖို့ဆိုရင် — [`cache-components-instant-false`](/docs/nextjs/upgrading-codemods) codemod ကို run ပါ။ ဒါက `instant` ကို ကြေညာထားပြီးသား `page`, `layout`, `default` တိုင်းကလွဲပြီး — ကျန်တာအားလုံးကို opt-out ထည့်ပေးပါတယ်:

   ```bash filename="Terminal"
   npx @next/codemod@canary cache-components-instant-false ./app
   ```

   > **သိထားသင့်သည်**: `src/` project ဆိုရင် `./src/app` ကို ပေးပါ။ Path မှားရင် fail ဖြစ်မယ့်အစား `0 ok` လို့ ပြတာမို့ — file count ကို စစ်ကြည့်ပါ။

   App က validation ရွှေ့ဆိုင်းထားတဲ့ (opted-out) routes တွေနဲ့အတူ — ဆက်ပြီး build ဖြစ်ပြီး serve လုပ်နေပါတယ်။

3. **Synchronous IO တွေကို ပြင်ပါ။ ဒါတွေကို ရွှေ့ဆိုင်းလို့ မရပါဘူး။** Prerender လုပ်ချိန်မှာ `new Date()`, `Date.now()`, `Math.random()`, `crypto.randomUUID()` လို ခေါ်ဆိုမှုတွေက `instant = false` နဲ့မှ မရှင်းနိုင်တဲ့ build error တစ်ခု ထွက်စေပါတယ် — ဒါကြောင့် အဲဒါတွေ သုံးထားတဲ့ route က opt-out လုပ်ထားလည်း မလုပ်ထားလည်း — မပြင်မချင်း build ဖြစ်မှာ မဟုတ်ပါဘူး။ ခေါ်ဆိုမှုကို prerendered shell ရဲ့ အပြင်ဘက်ကို ရွှေ့ပြီး request အချိန်မှာ run အောင် လုပ်ပါ: အဲဒါ လိုအပ်တဲ့ အပိုင်းကို [`<Suspense>`](https://react.dev/reference/react/Suspense) ထဲမှာ wrap လုပ်ပြီး — ခေါ်ဆိုမှုမတိုင်ခင် [`connection()`](/docs/nextjs/connection) ကို ခေါ်ပါ (သို့) Client Component တစ်ခုထဲကို ရွှေ့ပါ။
4. **Route တစ်ခုချင်းစီကို ပြောင်းပါ။** Route တစ်ခုကနေ `instant = false` ကို ဖယ်ပြီး — data တွေကို [`use cache`](/docs/nextjs/use-cache) နဲ့ cache လုပ်တာ (သို့) runtime data တွေကို [`<Suspense>`](https://react.dev/reference/react/Suspense) ထဲမှာ wrap လုပ်တာကနေ သူ့ရဲ့ insights တွေကို ဖြေရှင်းပါ။ Opt-out လုပ်ထားတဲ့ route မကျန်တဲ့အထိ ထပ်ခါထပ်ခါ လုပ်ပါ။

## Validation ကို လိုက်လုပ်ခြင်း (Following validation)

Cache Components က သင့် routes တွေကို development မှာ validate လုပ်ပြီး — dev overlay ထဲမှာ errors နဲ့ insights တွေကို ပြသပါတယ်။ တစ်ချို့က ဒီလိုပုံစံမျိုး — ထိခိုက်တဲ့ component ကို နာမည်နဲ့ ဖော်ပြပြီး ဖြေရှင်းနည်းဆီ ညွှန်ပြပါတယ်:

- **Component (သို့) data ကို cache လုပ်ပါ** — ဥပမာ code: `async function Posts() { 'use cache' return <List items={…} /> }` — [ဖြေရှင်းနည်းကြည့်ရန်](https://nextjs.org/docs/messages/blocking-prerender-dynamic#cache-the-component-or-data)
- **Suspense ထဲမှာ wrap လုပ်ပါ (သို့) Suspense ထဲကို ရွှေ့ပါ** — ဥပမာ code: `<Suspense fallback={…}> <DataChild /> </Suspense>` — [ဖြေရှင်းနည်းကြည့်ရန်](https://nextjs.org/docs/messages/blocking-prerender-dynamic#wrap-in-or-move-into-suspense)

Card တစ်ခုချင်းစီက နှိပ်လို့ရပြီး — ပုံစံများ (patterns), code နမူနာတွေနဲ့ trade-offs တွေပါတဲ့ page တစ်ခုကို ဖွင့်ပေးပါတယ်။ Insights နဲ့ errors တွေ အကုန်ပျောက်သည်အထိ တစ်ခုချင်း ဖြေရှင်းသွားပါ။ Validation workflow အပြည့်အစုံ၊ DevTools နဲ့ CI testing တွေအတွက် — [instant navigation guide](/docs/nextjs/instant-navigation) ကို ကြည့်ပါ။

Insights တွေက HTTP response ထဲမှာ မပေါ်ပါဘူး။ ပြဿနာရှိတဲ့ route က dev မှာ render လုပ်ပြီးသား HTML နဲ့ `200` ကို ဆက်ပြန်ပါတယ်။ Insight က dev overlay၊ dev-server log (သို့) [MCP `get_errors` tool](/docs/nextjs/mcp) ထဲမှာပဲ ပေါ်ပါတယ်။ အဲဒါတွေကို မြင်ဖို့ — overlay ကို ဖတ်ပါ (သို့) MCP ကို query လုပ်ပါ။

## `dynamic = "force-dynamic"`

**မလိုအပ်တော့ပါ။** Page အားလုံးက default အနေနဲ့ dynamic ဖြစ်နေပါတယ်။

```tsx filename="app/page.tsx" switcher
// Before - No longer needed
export const dynamic = 'force-dynamic'

export default function Page() {
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// Before - No longer needed
export const dynamic = 'force-dynamic'

export default function Page() {
  return <div>...</div>
}
```

```tsx filename="app/page.tsx" switcher
// After - Just remove it
export default function Page() {
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// After - Just remove it
export default function Page() {
  return <div>...</div>
}
```

## `dynamic = "force-static"`

အရင်ဆုံး ဖယ်ရှားလိုက်ပါ။ Development နဲ့ build ချိန်မှာ — မကိုင်တွယ်ရသေးတဲ့ uncached data (သို့) runtime data access တွေကို တွေ့ရင် Next.js က error တက်စေပါတယ်။ မဟုတ်ရင် — prerendering အဆင့်က static HTML shell ကို အလိုအလျောက် ထုတ်ယူပေးပါတယ်။

Uncached data access အတွက်ဆိုရင် — cached အပြုအမူကို ဆက်ထိန်းနိုင်ဖို့ `'max'` လို ကြာရှည်တဲ့ [`cacheLife`](/docs/nextjs/cache-life) တစ်ခုနဲ့အတူ — data access နဲ့ အနီးဆုံး နေရာမှာ [`use cache`](/docs/nextjs/use-cache) ထည့်ပါ။ လိုအပ်ရင် page (သို့) layout ရဲ့ ထိပ်မှာ ထည့်နိုင်ပါတယ်။

Runtime data access (`cookies()`, `headers()` စသည်) တွေအတွက်တော့ — errors တွေက `<Suspense>` နဲ့ wrap လုပ်ဖို့ ညွှန်ပါလိမ့်မယ်။ `force-static` သုံးပြီး စတင်ထားတာမို့ — request time အလုပ်တွေ မဖြစ်အောင် runtime data access တွေကို ဖယ်ရှားပစ်ရပါမယ်။

```tsx filename="app/page.tsx" switcher
// Before
export const dynamic = 'force-static'

export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// Before
export const dynamic = 'force-static'

export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>...</div>
}
```

```tsx filename="app/page.tsx" switcher
import { cacheLife } from 'next/cache'

// After - Use 'use cache' instead
export default async function Page() {
  'use cache'
  cacheLife('max')
  const data = await fetch('https://api.example.com/data')
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
import { cacheLife } from 'next/cache'

// After - Use 'use cache' instead
export default async function Page() {
  'use cache'
  cacheLife('max')
  const data = await fetch('https://api.example.com/data')
  return <div>...</div>
}
```

## `revalidate`

**`cacheLife` နဲ့ အစားထိုးပါ။** Route segment config အစား — cache duration (cache သက်တမ်း) သတ်မှတ်ဖို့ `cacheLife` function ကို သုံးပါ။

```tsx filename="app/page.tsx" switcher
// Before
export const revalidate = 3600 // 1 hour

export default async function Page() {
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// Before
export const revalidate = 3600 // 1 hour

export default async function Page() {
  return <div>...</div>
}
```

```tsx filename="app/page.tsx" switcher
// After - Use cacheLife
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// After - Use cacheLife
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')
  return <div>...</div>
}
```

> **သိထားသင့်သည်**: သင့် `revalidate` တန်ဖိုးက built-in [`cacheLife`](/docs/nextjs/cache-life) profile တစ်ခုနဲ့ (`'seconds'`, `'minutes'`, `'hours'`, `'days'`, `'weeks'`, `'max'`) မကိုက်ညီဘူးဆိုရင် — အနီးစပ်ဆုံးတစ်ခုကို ရွေးပါ (သို့) သင့် conventions နဲ့ ကိုက်ညီဖို့ [custom profile](/docs/nextjs/cache-life) တစ်ခု သတ်မှတ်ပါ။ Built-in profile တစ်ခုရဲ့ timings တွေက သင့် application ရဲ့ caching လိုအပ်ချက်နဲ့ မကိုက်ညီရင် — `default` အပါအဝင် [built-in profile တွေကိုလည်း ပြန်သတ်မှတ်](/docs/nextjs/cache-life) လို့ရပါတယ်။

## `fetchCache`

**မလိုအပ်တော့ပါ။** `use cache` နဲ့ဆို — cached scope တစ်ခုအတွင်းက data fetching အားလုံးကို အလိုအလျောက် cache လုပ်ပေးလို့ — `fetchCache` မလိုအပ်တော့ပါဘူး။

```tsx filename="app/page.tsx" switcher
// Before
export const fetchCache = 'force-cache'
```

```jsx filename="app/page.js" switcher
// Before
export const fetchCache = 'force-cache'
```

```tsx filename="app/page.tsx" switcher
// After - Use 'use cache' to control caching behavior
export default async function Page() {
  'use cache'
  // All fetches here are cached
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// After - Use 'use cache' to control caching behavior
export default async function Page() {
  'use cache'
  // All fetches here are cached
  return <div>...</div>
}
```

## `fetch` cache options

**`cache` နဲ့ `next` options တွေကို `use cache` ဆီ ရွှေ့ပါ။**

Cache Components မရှိရင် — request တစ်ခုကို `cache: 'force-cache'` နဲ့ cache လုပ်ပြီး — `next: { revalidate, tags }` နဲ့ ညှိပါတယ်။

Cache Components နဲ့ဆို — fetch ကို [`use cache`](/docs/nextjs/use-cache) function တစ်ခုထဲမှာ wrap လုပ်ပါ။ အဲဒီ scope ထဲက fetches တွေကို အလိုအလျောက် cache လုပ်ပေးပြီး — `revalidate` နဲ့ `tags` တွေက [`cacheLife`](/docs/nextjs/cache-life) နဲ့ [`cacheTag`](/docs/nextjs/cache-tag) အဖြစ် ပြောင်းသွားပါတယ်။

```tsx filename="app/page.tsx" switcher
// Before
export default async function Page() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache',
    next: { revalidate: 3600, tags: ['data'] },
  })
  const data = await res.json()
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// Before
export default async function Page() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache',
    next: { revalidate: 3600, tags: ['data'] },
  })
  const data = await res.json()
  return <div>...</div>
}
```

```tsx filename="app/page.tsx" switcher
// After
import { cacheLife, cacheTag } from 'next/cache'

async function getData() {
  'use cache'
  cacheLife('hours')
  cacheTag('data')
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// After
import { cacheLife, cacheTag } from 'next/cache'

async function getData() {
  'use cache'
  cacheLife('hours')
  cacheTag('data')
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>...</div>
}
```

Persistence (တည်မြဲမှု) ကွာခြားချက်ကို သတိပြုပါ။ `fetch` Data Cache က cached responses တွေကို deployments တွေကြားမှာရော serverless instances တွေကြားမှာပါ ထိန်းသိမ်းပေးပါတယ်။

`use cache` က default အနေနဲ့ in-memory storage ကို သုံးလို့ — serverless instance တစ်ခု ဖျက်ဆီးခံရတဲ့အခါ သူ့ရဲ့ entries တွေ စွန့်ပစ်ခံရပြီး — deployment တစ်ခုတည်းအတွက်ပဲ သက်ဆိုင်ပါတယ်။ Instance teardown နောက်မှာ ဆက်ရှင်နေတဲ့ storage အတွက် — [`use cache: remote`](/docs/nextjs/use-cache-remote) (သို့) [cache handler](/docs/nextjs/next-config-cache-handlers) တစ်ခုကို သုံးပါ။ Durable storage သုံးထားရင်တောင် — deployment အသစ်တစ်ခု ပြီးတဲ့အခါ cached values တွေ ပြန်တွက်ချက်ခံရမယ်လို့ မျှော်လင့်ထားပါ။

## `unstable_cache`

**`use cache` နဲ့ အစားထိုးပါ။**

`unstable_cache` ကို [`use cache`](/docs/nextjs/use-cache) directive နဲ့ အစားထိုးလိုက်ပါတယ်။

Wrap လုပ်ထားတဲ့ function ကို `'use cache'` directive ပါတဲ့ function တစ်ခု အဖြစ် ပြောင်းပါ။ Cache key က arguments တွေကနေ အလိုအလျောက် ဆင်းသက်လာလို့ — key-parts array မလိုအပ်တော့ပါဘူး။ `options` object ကတော့ [`cacheLife`](/docs/nextjs/cache-life) နဲ့ [`cacheTag`](/docs/nextjs/cache-tag) ဆီ map လုပ်ပါတယ်။

```tsx filename="app/lib/data.ts" switcher
// Before
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

export const getUser = unstable_cache(
  async (id: string) => {
    return db.query.users.findFirst({ where: eq(users.id, id) })
  },
  ['user'], // cache key prefix
  { tags: ['users'], revalidate: 3600 }
)
```

```js filename="app/lib/data.js" switcher
// Before
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

export const getUser = unstable_cache(
  async (id) => {
    return db.query.users.findFirst({ where: eq(users.id, id) })
  },
  ['user'], // cache key prefix
  { tags: ['users'], revalidate: 3600 }
)
```

```tsx filename="app/lib/data.ts" switcher
// After
import { cacheLife, cacheTag } from 'next/cache'
import { db } from '@/lib/db'

export async function getUser(id: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('users')
  return db.query.users.findFirst({ where: eq(users.id, id) })
}
```

```js filename="app/lib/data.js" switcher
// After
import { cacheLife, cacheTag } from 'next/cache'
import { db } from '@/lib/db'

export async function getUser(id) {
  'use cache'
  cacheLife('hours')
  cacheTag('users')
  return db.query.users.findFirst({ where: eq(users.id, id) })
}
```

`fetch` Data Cache လိုပဲ — `unstable_cache` က cached values တွေကို deployments နဲ့ serverless instances တွေကြားမှာ ထိန်းသိမ်းပေးပြီး — `use cache` ကတော့ မထိန်းသိမ်းပါဘူး။ Storage အသေးစိတ်အတွက် — အထက်က `fetch` cache options အပိုင်းကို ကြည့်ပါ။

## On-demand revalidation (`revalidateTag`, `revalidatePath`, `updateTag`)

On-demand invalidation က ဆက်ပြီး အလုပ်လုပ်ပါတယ် — cached data တွေကို tag လုပ်ပြီး — event တစ်ခု ပြီးနောက် သက်တမ်းကုန်စေတာပါ။ `fetch` ရဲ့ `next.tags` option အစား — `use cache` function တစ်ခုအတွင်းမှာ [`cacheTag`](/docs/nextjs/cache-tag) နဲ့ data တွေကို tag လုပ်ပြီး — သင်လိုချင်တဲ့ အပြုအမူပေါ် မူတည်ပြီး invalidation API ကို ရွေးပါ:

- [`updateTag`](/docs/nextjs/update-tag): mutation တစ်ခုရဲ့ ရလဒ်ကို user က ချက်ချင်း မြင်ရမယ့် (read-your-own-writes — ကိုယ်ရေးထားတာ ကိုယ်ပြန်ဖတ်) ကိစ္စတွေအတွက်ပါ။ Server Action တစ်ခုကနေ ခေါ်လိုက်ရင် — tag ကို သက်တမ်းကုန်စေပြီး — နောက် request က stale content အစား fresh data ကို စောင့်ပြီး ရယူပါတယ်။
- [`revalidateTag`](/docs/nextjs/revalidate-tag): stale-while-revalidate (နောက်ခံမှာ refresh လုပ်နေစဉ် ဟောင်းနေသော data ကို ဆက်ပြသခြင်း) အတွက်ပါ။ ဒုတိယ argument အနေနဲ့ cache profile တစ်ခု **လိုအပ်ပါတယ်** — ဥပမာ `'max'` သုံးရင် — နောက်ခံမှာ ပြန်ဆန်းသစ်နေချိန် cached data ကို ဆက်ပြသနိုင်ပါတယ်။ Server Actions ရော Route Handlers တွေမှာပါ အလုပ်လုပ်ပါတယ်။
- [`revalidatePath`](/docs/nextjs/revalidate-path): အရင် caching model ကအတိုင်း မပြောင်းလဲပါဘူး။

`updateTag` က Cache Components အတွက်ပဲ ဖြစ်တာ မဟုတ်ပါဘူး (အရင် caching model နဲ့လည်း အလုပ်လုပ်ပါတယ်) — ဒါပေမယ့် migrate လုပ်ချိန်ဟာ ဒါကို စတင်ကျင့်သုံးဖို့ အချိန်ကောင်းပါ။ Server Action တစ်ခုထဲမှာ mutation တစ်ခု လုပ်ပြီးတဲ့နောက် — user က သူတို့ရဲ့ ကိုယ်ပိုင် ပြောင်းလဲမှုကို ချက်ချင်း မြင်သင့်တဲ့အခါ ဒါကို သုံးပါ။

```tsx filename="app/actions.ts" switcher
'use server'
import { updateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  // Create the post, then show it immediately on the next request
  updateTag('posts')
}
```

```js filename="app/actions.js" switcher
'use server'
import { updateTag } from 'next/cache'

export async function createPost(formData) {
  // Create the post, then show it immediately on the next request
  updateTag('posts')
}
```

> **သိထားသင့်သည်**: `updateTag` ကို Server Action တစ်ခုကနေပဲ ခေါ်လို့ရပြီး — တခြားနေရာကနေ ခေါ်ရင် throw လုပ်ပါတယ်။ Route Handlers (သို့) webhooks တွေမှာတော့ — cache profile တစ်ခုနဲ့အတူ `revalidateTag` ကို သုံးပါ။

`revalidateTag` ရဲ့ ဒုတိယ argument အဖြစ် `'max'` ကို ပေးလိုက်ရင် — tag ကို stale-while-revalidate semantics တွေနဲ့ သက်တမ်းကုန်စေပါတယ်:

```tsx filename="app/api/webhook/route.ts" switcher
// Before
import { revalidateTag } from 'next/cache'

export async function POST() {
  revalidateTag('posts')
  return Response.json({ ok: true })
}
```

```js filename="app/api/webhook/route.js" switcher
// Before
import { revalidateTag } from 'next/cache'

export async function POST() {
  revalidateTag('posts')
  return Response.json({ ok: true })
}
```

```tsx filename="app/api/webhook/route.ts" switcher
// After - Pass a cache profile
import { revalidateTag } from 'next/cache'

export async function POST() {
  revalidateTag('posts', 'max')
  return Response.json({ ok: true })
}
```

```js filename="app/api/webhook/route.js" switcher
// After - Pass a cache profile
import { revalidateTag } from 'next/cache'

export async function POST() {
  revalidateTag('posts', 'max')
  return Response.json({ ok: true })
}
```

## `unstable_noStore`

**မလိုအပ်တော့ပါ။** `unstable_noStore` (`noStore()`) က component တစ်ခုကို caching ကနေ ဖယ်ထုတ်ပေးတာပါ။ Cache Components နဲ့ဆို — `use cache` ထည့်မှသာ cache လုပ်တာမို့ — ဒါကို ဖယ်ရှားလိုက်လို့ရပါတယ်။ Component တစ်ခုက request အချိန်မှာ run ရမယ်ဆိုရင် — အလုပ်မစခင် [`connection()`](/docs/nextjs/connection) ကို ခေါ်ပြီး `<Suspense>` ထဲမှာ wrap လုပ်ပါ။

```tsx filename="app/page.tsx" switcher
// Before
import { unstable_noStore as noStore } from 'next/cache'

export default async function Page() {
  noStore()
  const data = await db.query('...')
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// Before
import { unstable_noStore as noStore } from 'next/cache'

export default async function Page() {
  noStore()
  const data = await db.query('...')
  return <div>...</div>
}
```

```tsx filename="app/page.tsx" switcher
// After - uncached by default, just remove noStore()
export default async function Page() {
  const data = await db.query('...')
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// After - uncached by default, just remove noStore()
export default async function Page() {
  const data = await db.query('...')
  return <div>...</div>
}
```

## `generateStaticParams` နဲ့ `dynamicParams`

Cache Components က [dynamic routes](/docs/nextjs/dynamic-routes) တွေ params တွေကို ကိုင်တွယ်ပုံကို ပြောင်းလဲစေပါတယ်။

### `generateStaticParams` က param အနည်းဆုံး တစ်ခု return လုပ်ရမည်

**Array အလွတ် return လုပ်ရင် အခုဆို error ဖြစ်ပါတယ်။** Cache Components မရှိရင် `[]` return လုပ်တာက path တိုင်းကို ပထမဆုံး runtime visit အထိ ရွှေ့ဆိုင်းလိုက်တာပါ။ Cache Components နဲ့ဆို — [`generateStaticParams`](/docs/nextjs/generate-static-params) က param အနည်းဆုံး တစ်ခုတော့ return လုပ်ပေးရမှာ ဖြစ်ပြီး — အဲဒါမှ route ကို prerender လုပ်ပြီး [static shell](https://nextjs.org/docs/app/glossary#static-shell) အလွတ် မဟုတ်ဘဲ ထွက်လာတာ validate လုပ်လို့ရမှာပါ။ Array အလွတ်ဆိုရင် [`empty-generate-static-params`](https://nextjs.org/docs/messages/empty-generate-static-params) error တက်ပါတယ်။

```tsx filename="app/blog/[slug]/page.tsx" switcher
// Before - defer all paths to runtime
export async function generateStaticParams() {
  return []
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
// Before - defer all paths to runtime
export async function generateStaticParams() {
  return []
}
```

```tsx filename="app/blog/[slug]/page.tsx" switcher
// After - return at least one param to prerender
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
  return posts.slice(0, 1).map((post) => ({ slug: post.slug }))
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
// After - return at least one param to prerender
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
  return posts.slice(0, 1).map((post) => ({ slug: post.slug }))
}
```

သင် return မလုပ်ထားတဲ့ paths တွေကိုလည်း ဆက်ပြီး serve လုပ်ပါတယ်။ မသိရသေးတဲ့ params တွေအတွက် Next.js က static shell တစ်ခုကို prerender လုပ်ပြီး — ကျန်တာကို request အချိန်မှာ stream လုပ်ပါတယ်။ Prerender-a-subset workflow အပြည့်အစုံအတွက် — [ISR with Cache Components](/docs/nextjs/incremental-static-regeneration-cache-components) ကို ကြည့်ပါ။

### `dynamicParams` ကို support မလုပ်တော့ပါ

**Export ကို ဖျက်လိုက်ပါ။** Cache Components enable ထားချိန်မှာ `dynamicParams` export လုပ်ထားရင် — build က ဒီ error message နဲ့ fail ဖြစ်ပါတယ်:

> Route segment config "dynamicParams" is not compatible with `nextConfig.cacheComponents`.

`generateStaticParams` က return မလုပ်ထားတဲ့ params တွေကိုတော့ request အချိန်မှာ render လုပ်ပါတယ်။ အဲဒါတွေကို ပယ်ချဖို့ `dynamicParams: false` သုံးထားတယ်ဆိုရင် — param က တကယ့် data တစ်ခုကို မညွှန်တဲ့အခါ page ထဲမှာ [`notFound()`](/docs/nextjs/not-found) ကို ခေါ်ပါ။

### `params` ကို `<Suspense>` ထဲမှာ await လုပ်ပါ

Static shell ထုတ်လုပ်နိုင်ဖို့ — `params` promise ကို component ရဲ့ ထိပ်မှာ await လုပ်မယ့်အစား — [`<Suspense>`](/docs/nextjs/file-conventions-loading) boundary တစ်ခုထဲကို ထည့်ပေးလိုက်ပါ — ဒါဆို မသိရသေးတဲ့ params တွေနဲ့ပါ ဆက်ပြီး prerender လုပ်လို့ရပါတယ်။

```tsx filename="app/blog/[slug]/page.tsx" switcher
// Before - awaiting params at the top blocks the shell
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <Post slug={slug} />
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
// Before - awaiting params at the top blocks the shell
export default async function Page({ params }) {
  const { slug } = await params
  return <Post slug={slug} />
}
```

```tsx filename="app/blog/[slug]/page.tsx" switcher
import { Suspense } from 'react'

// After - await inside Suspense so the shell can prerender
export default function Page({ params }: PageProps<'/blog/[slug]'>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Post params={params} />
    </Suspense>
  )
}

async function Post({ params }: Pick<PageProps<'/blog/[slug]'>, 'params'>) {
  const { slug } = await params
  // ...
}
```

```jsx filename="app/blog/[slug]/page.js" switcher
import { Suspense } from 'react'

// After - await inside Suspense so the shell can prerender
export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Post params={params} />
    </Suspense>
  )
}

async function Post({ params }) {
  const { slug } = await params
  // ...
}
```

Route ကို ဖတ်တဲ့ client hooks တွေအတွက်လည်း အလားတူပဲ အသုံးပြုပါတယ်။ Route ရဲ့ pathname က အပြည့်အစုံ သိပြီးသားဆိုရင် — အဲဒါတွေက prerendering ကာလမှာ resolve ဖြစ်ပြီး — boundary မလိုပါဘူး။ မသိရသေးတဲ့ dynamic params တွေပေါ် မူတည်နေရင်တော့ — component ဘယ်နေရာမှာ ထိုင်နေပါစေ — suspend ဖြစ်ပါတယ်။ ဥပမာ — shared layout တစ်ခုထဲက nav (သို့) breadcrumb တစ်ခုက — အောက်မှာ dynamic params ပါတဲ့ route တစ်ခုခုအတွက် Next.js က static shell ထုတ်နေချိန်မှာ suspend ဖြစ်ပါတယ်။ Hook ကို ဖတ်တဲ့ component ကို `<Suspense>` ထဲမှာ wrap လုပ်ပါ (ကျန်တဲ့အပိုင်းတွေ prerender ဖြစ်နေဖို့ — ဖတ်တာကို အသေးဆုံး leaf ဆီ ရွှေ့ချပါ) — မဟုတ်ရင် build က fail ဖြစ်ပါတယ်:

- [`usePathname`](/docs/nextjs/use-pathname)
- [`useParams`](/docs/nextjs/use-params)
- [`useSelectedLayoutSegment`](/docs/nextjs/use-selected-layout-segment)
- [`useSelectedLayoutSegments`](/docs/nextjs/use-selected-layout-segments)

[`useSearchParams`](/docs/nextjs/use-search-params) hook ကတော့ — search params တွေကို request အချိန်မှာပဲ သိရလို့ — အမြဲတမ်း `<Suspense>` boundary တစ်ခု လိုအပ်ပါတယ်။ ဖြေရှင်းနည်းတွေအတွက် — [Next.js encountered URL data in a Client Component outside of Suspense](https://nextjs.org/docs/messages/blocking-prerender-client-hook) ကို ကြည့်ပါ။

## `cookies`, `headers`, နဲ့ `searchParams`

**Runtime data access တွေကို `<Suspense>` ထဲမှာ wrap လုပ်ပါ။** Cache Components မရှိရင် — [`cookies()`](/docs/nextjs/cookies), [`headers()`](/docs/nextjs/headers), (သို့) [`searchParams`](/docs/nextjs/file-conventions-page) တွေကို ဖတ်လိုက်တာနဲ့ — route တစ်ခုလုံးကို dynamic rendering ထဲ ရောက်သွားစေပါတယ်။ Cache Components နဲ့ဆို — [`<Suspense>`](https://react.dev/reference/react/Suspense) boundary ရဲ့ အပြင်မှာ ဝင်ရောက်သုံးရင် — [**blocking-prerender-runtime** insight](https://nextjs.org/docs/messages/blocking-prerender-runtime) ပေါ်လာပါတယ်။ Access ကို `<Suspense>` နဲ့ wrap လုပ်ထားတဲ့ component တစ်ခုထဲကို ရွှေ့လိုက်ပါ — ဒါဆို page ရဲ့ ကျန်တဲ့အပိုင်း က static shell အနေနဲ့ prerender ဖြစ်ပြီး — dynamic အပိုင်းက request အချိန်မှာ stream ဝင်လာပါတယ်။

```tsx filename="app/page.tsx" switcher
import { cookies } from 'next/headers'

// Before - reading cookies at the top makes the whole route dynamic
export default async function Page() {
  const theme = (await cookies()).get('theme')?.value
  return <Dashboard theme={theme} />
}
```

```jsx filename="app/page.js" switcher
import { cookies } from 'next/headers'

// Before - reading cookies at the top makes the whole route dynamic
export default async function Page() {
  const theme = (await cookies()).get('theme')?.value
  return <Dashboard theme={theme} />
}
```

```tsx filename="app/page.tsx" switcher
import { cookies } from 'next/headers'
import { Suspense } from 'react'

// After - the page prerenders; only Dashboard streams at request time
export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Dashboard />
    </Suspense>
  )
}

async function Dashboard() {
  const theme = (await cookies()).get('theme')?.value
  // ...
}
```

```jsx filename="app/page.js" switcher
import { cookies } from 'next/headers'
import { Suspense } from 'react'

// After - the page prerenders; only Dashboard streams at request time
export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Dashboard />
    </Suspense>
  )
}

async function Dashboard() {
  const theme = (await cookies()).get('theme')?.value
  // ...
}
```

သင့် page က `params` နဲ့ `searchParams` တွေကို props အနေနဲ့ ရရှိပြီး — နှစ်ခုလုံးက promises တွေပါ။ အလားတူ ပုံစံကိုပဲ သုံးပါ: promise ကို `<Suspense>`-wrapped component ဆီ prop အနေနဲ့ တိုက်ရိုက် ပေးပို့ပြီး — page ရဲ့ ထိပ်မှာ မဟုတ်ဘဲ — အဲဒီမှာ await လုပ်ပါ။ တနည်းအားဖြင့် — promise ကို `.then()` နဲ့ inline မှာ ဖြေပြီး — plain value တစ်ခုအနေနဲ့ အောက်ကို ပေးပို့လို့လည်း ရပါတယ်။ အလားတူ ပုံစံတစ်ခုအတွက် — [Streaming](/docs/nextjs/streaming) ကို ကြည့်ပါ။

```tsx filename="app/page.tsx" switcher
import { Suspense } from 'react'

export default function Page({ searchParams }: PageProps<'/'>) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Results searchParams={searchParams} />
    </Suspense>
  )
}

async function Results({ searchParams }: Pick<PageProps<'/'>, 'searchParams'>) {
  const { query } = await searchParams
  // ...
}
```

```jsx filename="app/page.js" switcher
import { Suspense } from 'react'

export default function Page({ searchParams }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Results searchParams={searchParams} />
    </Suspense>
  )
}

async function Results({ searchParams }) {
  const { query } = await searchParams
  // ...
}
```

> **သိထားသင့်သည်**: Root layout ထဲက `<html>` element ပေါ်က attribute တစ်ခု (`lang`, `dir`, `data-theme` စသည်) ကို cookie (သို့) header value တစ်ခုနဲ့ မောင်းနှင်နေတယ်ဆိုရင် — server မှာ အဲဒါကို ဖတ်လိုက်တာနဲ့ subtree တစ်ခုလုံး request-bound ဖြစ်သွားလို့ — `<Suspense>` ထဲမှာ wrap လုပ်ဖို့ child မကျန်တော့ပါဘူး။ Paint မဖြစ်ခင် attribute ကို သတ်မှတ်ပေးတဲ့ `<head>` ထဲက inline `<script>` တစ်ခုက shell ကို static အတိုင်း ဆက်ထားနိုင်ပါတယ် — ဒီပုံစံအတွက် [Preventing flash before hydration](/docs/nextjs/preventing-flash-before-hydration) ကို ကြည့်ပါ။

## Route Handlers (`GET`)

**`dynamic = 'force-static'` ကို `use cache` နဲ့ အစားထိုးပါ။**

Cache Components မရှိရင် — `GET` [Route Handler](/docs/nextjs/file-conventions-route) တစ်ခုက `export const dynamic = 'force-static'` နဲ့ caching ထဲ ဝင်လိုက်မှသာ static ဖြစ်ပြီး — မဟုတ်ရင် dynamic ပါ။ Cache Components နဲ့ဆို — `GET` handlers တွေက pages တွေနဲ့ တူညီတဲ့ model ကို လိုက်နာပါတယ်: uncached data (သို့) runtime data တွေကို မဝင်ရောက်ရင် prerender ဖြစ်ပြီး — uncached data တွေကို `use cache` နဲ့ cache လုပ်ပါတယ်။ `dynamic` config ကို ဖယ်ပြီး — data access ကို `use cache` နဲ့ မှတ်သားထားတဲ့ သီးခြား function တစ်ခုထဲကို ရွှေ့ပါ။ Directive ကို `GET` export ကိုယ်တိုင်ပေါ်မှာ တိုက်ရိုက် သုံးလို့မရလို့ — handler က cached helper တစ်ခုကို ခေါ်ပါတယ်။

```ts filename="app/api/products/route.ts" switcher
// Before
export const dynamic = 'force-static'

export async function GET() {
  const products = await db.query('SELECT * FROM products')
  return Response.json(products)
}
```

```js filename="app/api/products/route.js" switcher
// Before
export const dynamic = 'force-static'

export async function GET() {
  const products = await db.query('SELECT * FROM products')
  return Response.json(products)
}
```

```ts filename="app/api/products/route.ts" switcher
// After
import { cacheLife } from 'next/cache'

export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}

async function getProducts() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM products')
}
```

```js filename="app/api/products/route.js" switcher
// After
import { cacheLife } from 'next/cache'

export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}

async function getProducts() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM products')
}
```

> **သိထားသင့်သည်**: `GET` handler တစ်ခုထဲမှာ uncached (သို့) runtime data တွေကို ဖတ်တာက — **throw** လုပ်ပြီး prerendering ကနေ ထွက်သွားစေပါတယ်။ တခြား operations တွေအတွက် ရှိပြီးသား `try/catch` တစ်ခုက အဲဒီ bail-out ကို ဖမ်းမိပါလိမ့်မယ်။ `catch` block က error ကို log လုပ်ရင် — build output ထဲမှာ noise တွေ ထပ်လာပါတယ်။ Bail-out ပြီးနောက် ထွက်တဲ့ logs တွေကို ဖျောက်ဖို့ `experimental.hideLogsAfterAbort: true` ကို သတ်မှတ်ပါ။

## `generateMetadata` နဲ့ `generateViewport`

**External data တွေကို `use cache` နဲ့ cache လုပ်ပါ (သို့) ရည်ရွယ်ချက်ရှိရှိ dynamic ဖြစ်တဲ့ pages တွေလို့ မှတ်သားပါ။** Cache Components အောက်မှာ — [`generateMetadata`](/docs/nextjs/generate-metadata) နဲ့ [`generateViewport`](/docs/nextjs/generate-viewport) တွေက components တွေနဲ့ တူညီတဲ့ စည်းမျဉ်းတွေကို လိုက်နာပါတယ်။ သူတို့က runtime data (`cookies()`, `headers()`, `params`, `searchParams`) တွေကို ဖတ်ရင် (သို့) uncached data တွေကို fetch လုပ်ပြီး — page ရဲ့ ကျန်တဲ့အပိုင်း က prerender လုပ်လို့ရနေတုန်းဆိုရင် — Next.js က error တက်စေပြီး ရွေးချယ်မှုကို ရှင်းရှင်းလင်းလင်း ဖြစ်စေပါတယ်။ Metadata က runtime data မဟုတ်ဘဲ — external data ပေါ်ပဲ မူတည်တယ်ဆိုရင် — `use cache` ထည့်ပါ။

```tsx filename="app/page.tsx" switcher
// Before
export async function generateMetadata() {
  const { title, description } = await db.query('site-metadata')
  return { title, description }
}
```

```tsx filename="app/page.tsx" switcher
// After - cache external data
export async function generateMetadata() {
  'use cache'
  const { title, description } = await db.query('site-metadata')
  return { title, description }
}
```

Metadata က တကယ်ပဲ runtime data လိုအပ်နေရင်တော့ — `generateMetadata` ကို `<Suspense>` ထဲမှာ wrap လုပ်လို့ မရပါဘူး။ အဲဒီအစား — page ထဲကို dynamic marker component တစ်ခု ထည့်ပါ — ဒါဆို static content တွေ ဆက်ပြီး prerender ဖြစ်နေချိန်မှာ metadata က stream ဝင်လာပါတယ်။

```tsx filename="app/page.tsx" switcher
import { Suspense } from 'react'
import { connection } from 'next/server'

export async function generateMetadata() {
  // reads runtime data
  return { title: 'Personalized Title' }
}

async function DynamicMarker() {
  return (
    <Suspense>
      <Connection />
    </Suspense>
  )
}

async function Connection() {
  await connection()
  return null
}

export default function Page() {
  return (
    <>
      <article>Static content</article>
      <DynamicMarker />
    </>
  )
}
```

Fix options နဲ့ trade-offs အပြည့်အစုံအတွက် — [`generateMetadata` with Cache Components](/docs/nextjs/generate-metadata) နဲ့ [`generateViewport` with Cache Components](/docs/nextjs/generate-viewport) တွေကို ကြည့်ပါ။

## `runtime = 'edge'`

**Support မလုပ်ပါ။** Cache Components က Node.js runtime လိုအပ်ပါတယ်။ [deprecated](https://nextjs.org/docs/messages/edge-runtime-deprecated) ဖြစ်နေတဲ့ `runtime = 'edge'` export ကို ဖယ်ရှားပြီး — Node.js runtime (default) ကို ပြောင်းပါ။ သီးခြား routes တွေအတွက် edge behavior လိုအပ်ရင် — [Proxy](/docs/nextjs/file-conventions-proxy) ကို သုံးပါ။

## `experimental_ppr`

**ဖယ်ရှားလိုက်ပြီ။ အဲဒီအစား `cacheComponents` ကို enable လုပ်ပါ။** Next.js 16 က experimental Partial Prerendering flag (`experimental.ppr`) နဲ့ `experimental_ppr` route segment config ကို ဖယ်ရှားလိုက်ပါတယ်။ Partial Prerendering က အခုဆို [Cache Components](/docs/nextjs/next-config-cache-components) ရဲ့ အစိတ်အပိုင်းတစ်ခု ဖြစ်လို့ — `next.config` ကနေ `experimental.ppr` ကိုရော — segments တွေကနေ `experimental_ppr` ကိုပါ ဖယ်ရှားပါ။ [Codemod](/docs/nextjs/upgrading-codemods) တစ်ခုက segment config ကို သင့်အတွက် ဖယ်ရှားပေးပါတယ်။

```tsx filename="app/page.tsx" switcher
// Before - no longer needed
export const experimental_ppr = true

export default function Page() {
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// Before - no longer needed
export const experimental_ppr = true

export default function Page() {
  return <div>...</div>
}
```

```tsx filename="app/page.tsx" switcher
// After - remove it; cacheComponents enables Partial Prerendering
export default function Page() {
  return <div>...</div>
}
```

```jsx filename="app/page.js" switcher
// After - remove it; cacheComponents enables Partial Prerendering
export default function Page() {
  return <div>...</div>
}
```

## UI state ထိန်းသိမ်းခြင်း (UI state preservation)

**Component state တွေက အခုဆို navigations တွေကြားမှာ ဆက်တည်မြဲနေပါတယ်။** Cache Components နဲ့ဆို — Next.js က routes တွေကို unmount လုပ်မယ့်အစား — React ရဲ့ [`<Activity>`](https://react.dev/reference/react/Activity) component ကို [`"hidden"`](https://react.dev/reference/react/Activity#activity) mode နဲ့ သုံးပြီး ထိန်းသိမ်းပါတယ်။ Effects တွေက ပုံမှန်အတိုင်း cleanup ဖြစ်ပြီး ပြန် run ပါတယ် — ဒါပေမယ့် `useState` values တွေ၊ form inputs တွေနဲ့ scroll position တွေက — ဝေးရာကို သွားပြီး ပြန်လာတဲ့အခါ ပြန်မစပဲ ကျန်နေတော့ပါတယ်။

သင့် code က state ရှင်းဖို့ unmounting ကို အားကိုးထားတယ်ဆိုရင် — ရှင်းလင်းချက် (reset) logic တစ်ခုကို ရှင်းရှင်းလင်းလင်း ထည့်ဖို့ လိုနိုင်ပါတယ်:

- **Dropdowns နဲ့ popovers** — နောက်ကို ပြန်သွားလာတဲ့အခါ ဖွင့်ထားတဲ့အတိုင်း ကျန်နေပါလိမ့်မယ်။ `useLayoutEffect` cleanup function တစ်ခုထဲမှာ ပိတ်ပေးပါ။
- **Initialization logic ပါတဲ့ dialogs** — dialog state ပေါ် မူတည်တဲ့ effects တွေ (ဥပမာ input ကို focus လုပ်တာ) က state ထိန်းသိမ်းခံထားရရင် ပြန် run မှာ မဟုတ်ပါဘူး။ Dialog state ကို URL ကနေ ဆင်းသက်အောင် (derive) လုပ်ပါ။
- **Submit လုပ်ပြီးနောက် forms** — input values တွေနဲ့ `useActionState` ရလဒ်တွေ (success/error messages) က ပြန်လာတဲ့အခါ ဆက်တည်မြဲနေပါတယ်။ ဖြစ်နိုင်ရင် submit handler (သို့) user action ထဲမှာ reset လုပ်ပါ — မဖြစ်နိုင်ရင် cleanup effect တစ်ခု သုံးပါ။

ပုံစံတစ်ခုချင်းစီရဲ့ ဥပမာအသေးစိတ်တွေအတွက် — [Preserving UI state across navigations](/docs/nextjs/preserving-ui-state) ကို ကြည့်ပါ။
