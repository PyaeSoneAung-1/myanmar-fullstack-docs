---
title: "Instant Navigation (navigations များကို ချက်ချင်း ဖြစ်စေခြင်း)"
description: "Instant navigation ဆိုတာ ဘာလဲ — static shell, caching directives (`use cache`), `<Suspense>` fallbacks, App Shell, per-link prefetching, validation (`instant`), Navigation Inspector နဲ့ e2e tests (`instant()`) တွေသုံးပြီး page loads နဲ့ client navigations တွေကို ချက်ချင်း ဖြစ်အောင် တည်ဆောက်ခြင်း"
order: 225
source: "https://nextjs.org/docs/app/guides/instant-navigation"
status: translated
updated: 2026-09-03
---

ဒီ guide က — instant navigation ဆိုတာ ဘာလဲ နားလည်ခြင်း၊ ချက်ချင်း navigate လုပ်တဲ့ route တစ်ခု ရေးခြင်း၊ initial UI (ကနဦး UI) ထဲမှာ ဘာတွေ ပါဝင်လဲ မြင်ယောင်ကြည့်ခြင်း၊ ပြီးတော့ end-to-end tests တွေနဲ့ အဲဒီအပြုအမူကို သော့ခတ် (lock in) လုပ်ခြင်း ဆိုတာတွေကို ရှင်းပြပေးပါတယ်။

## "Instant" ဆိုတာ ဘာကို ဆိုလိုလဲ

Navigation တစ်ခုက **instant** (ချက်ချင်း) ဖြစ်တယ်ဆိုတာ — user က click လုပ်လိုက်တာနဲ့ browser က page အသစ်ကို ချက်ချင်း စတင် render လုပ်နိုင်ပြီး — static, cached နဲ့ fallback content တွေ ချက်ချင်း ပေါ်လာကာ — ကျန်နေတဲ့ content တွေကို server က fallback တွေထဲကို stream လုပ်နေချိန်မှာ ဖြစ်ပါတယ်။

> **သိထားသင့်သည်:** ဒီအဓိပ္ပာယ်ဖွင့်ဆိုချက်က caches တွေ နွေးနေပြီးသား (warm) လို့ ယူဆပါတယ်။ Cold caches တွေမှာတော့ — server က cached result ကို တစ်ကြိမ် တွက်ချက်ပေးရဦးမှာ ဖြစ်လို့ — route တစ်ခုဆီ ပထမဆုံး navigation ကတော့ စောင့်ရဦးမယ် ဖြစ်ပါတယ်။

Route တစ်ခုတည်းကို တိုက်ရိုက် visit (တိုက်ရိုက် ဝင်ရောက်ခြင်း) လုပ်တာနဲ့ client navigation လုပ်တာက — initial UI မတူညီတာ ထွက်နိုင်ပါတယ်။ **တိုက်ရိုက် visits** တွေက [**static shell**](https://nextjs.org/docs/app/glossary#static-shell) ကို HTML အနေနဲ့ — ပုံမှန်အားဖြင့် CDN ကနေ — ရရှိပါတယ်။ **Client navigations** တွေကတော့ — လက်ရှိ route နဲ့ destination route တွေ share လုပ်ထားတဲ့ layout ရဲ့ အောက်ဘက်ကိုပဲ ပြန် render လုပ်လို့ — အဲဒီနေရာရဲ့ အပေါ်မှာ ရှိတဲ့ `<Suspense>` boundary တစ်ခုက သတ်မှတ်ထားတဲ့ fallback UI ကို transition အတွင်းမှာ သုံးလို့ မရပါဘူး။

Page အသစ်က ချက်ချင်း ပေါ်လားဆိုတာက — shared layout ရဲ့ အောက်မှာ ရှိနေတဲ့ `<Suspense>` boundaries တွေနဲ့ caching ပေါ်မှာ မူတည်ပါတယ်။

<details>
<summary>Page loads နဲ့ client navigations တွေက ဘာကြောင့် initial UI မတူညီတာလဲ</summary>

Page load တစ်ခုမှာ — page တစ်ခုလုံးကို document root ကနေ render လုပ်ပါတယ်။ Component တိုင်း server ပေါ်မှာ run လုပ်ပြီး — suspend ဖြစ်တဲ့ဟာ ဘာမဆို — tree တစ်ခုလုံးထဲက အနီးဆုံး `<Suspense>` boundary က ဖမ်းယူပါတယ်။

`/store/shoes` ကနေ `/store/hats` ကို client navigation လုပ်တဲ့အခါ — `/store` layout ရဲ့ အောက်က components တွေပဲ ပြန် render လုပ်ပါတယ်။ Root layout ထဲက `<Suspense>` boundary တစ်ခုက page load တစ်ခုမှာ အရာအားလုံးကို ဖုံးအုပ်ပေးပေမယ့် — ဒီ navigation မှာတော့ — အဲဒါက re-render ဖြစ်တဲ့ နေရာရဲ့ အပေါ်မှာ ရှိနေလို့ trigger မဖြစ်ပါဘူး။

ဒါကြောင့်ပဲ client-side hooks တွေရဲ့ အပြုအမူတွေလည်း ကွဲပြားနေတာပါ။ `useSearchParams()` က server rendering အတွင်းမှာ suspend လုပ်ပါတယ် — search params တွေက build time မှာ မရနိုင်လို့ပါ။ ဒါပေမယ့် client navigation တစ်ခုမှာတော့ — router က params တွေကို URL ကနေ ရပြီးသား ဖြစ်လို့ — hook က synchronously (တစ်ပြိုင်နက်) ဖြေရှင်းပါတယ်။ Component တစ်ခုတည်းက client navigation တစ်ခုမှာ ချက်ချင်း render ဖြစ်နိုင်ပေမယ့် — page load တစ်ခုမှာတော့ fallback တစ်ခုရဲ့ နောက်မှာ ရှိနေနိုင်ပါတယ်။

</details>

`prefetch={true}` နဲ့ဆိုရင် — per-link prefetching က link တစ်ခုရဲ့ URL data (`searchParams` နဲ့ `params`) တွေကို navigation မလုပ်ခင် ဖြေရှင်းပေးပါတယ်။ အရင်ဆုံး route ကို သူ့ရဲ့ App Shell နဲ့ instant ဖြစ်အောင် လုပ်ပါ။ Per-link prefetching က — အဲဒါ မရှိဘဲ block ဖြစ်နေတဲ့ route တစ်ခုကို ပြင်ဆင်ပေးလို့ မရပါဘူး။ Patterns တွေအတွက် [Optimizing prefetching](/docs/nextjs/optimizing-prefetching) ကို ကြည့်ပါ။

## အမြန် စတင်ခြင်း (Quick start)

Instant Navigation ကနေ အကျိုးအများဆုံး ရဖို့ — [Cache Components](/docs/nextjs/migrating-to-cache-components) နဲ့ [Partial Prefetching](/docs/nextjs/adopting-partial-prefetching) တွေကို enable လုပ်ပြီး — ပေါ်လာတဲ့ validation errors တွေကို လိုက်နာရပါမယ်:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
```

ဒီလုပ်ငန်းစဉ်ကို agent တစ်ခုနဲ့ အလိုအလျောက် လုပ်ချင်ရင် — အပိုင်းတစ်ခုစီအတွက် Skill တစ်ခုစီ ရှိပါတယ်: [next-cache-components-adoption](https://www.skills.sh/vercel/next.js/next-cache-components-adoption) နဲ့ [next-partial-prefetching-adoption](https://www.skills.sh/vercel/next.js/next-partial-prefetching-adoption)။ အရာအားလုံးကို enable လုပ်ချင်ရင်တော့ — သင့် agent ကို ဒီ prompt ပေးလိုက်ပါ:

```prompt
Adopt Cache Components and Partial Prefetching in this app so its navigations become instant. There is a Skill for each migration.

1. Before you change anything, explain to me in plain terms what Instant Navigation is and what adopting it will change.

2. Install the Skills you need, then verify your changes against a running dev server with next-dev-loop and agent-browser as you go:
   - next-cache-components-adoption: https://www.skills.sh/vercel/next.js/next-cache-components-adoption
   - next-partial-prefetching-adoption: https://www.skills.sh/vercel/next.js/next-partial-prefetching-adoption
   - next-dev-loop: https://www.skills.sh/vercel/next.js/next-dev-loop

3. Each Skill leaves decisions to me, like how much of the work lands in each pull request. Put those questions to me and wait for my answers instead of deciding on my behalf. Adopt Cache Components first, then Partial Prefetching, following the workflow each Skill lays out. Don't rush to a passing build.

4. When you finish a step, show me a table of the routes you touched and what changed on each, and talk me through what it means for the app. Keep it to the outcome, not the implementation details.
```

ဒီ guide ရဲ့ ကျန်တဲ့အပိုင်းတွေက — ဒီ migrations တွေ သုံးတဲ့ tools တွေ၊ block ဖြစ်တဲ့ navigation တစ်ခုကို instant အဖြစ် ပြောင်းတဲ့ လမ်းကြောင်း၊ initial UI ထဲ ဘာတွေ ရောက်လဲ စစ်ဆေးခြင်း၊ ပြီးတော့ end-to-end tests တွေနဲ့ ရလဒ်ကို သော့ခတ်ခြင်း ဆိုတာတွေကို ဖော်ပြပါတယ်။

## Tools တွေ

### Static shell ကို တည်ဆောက်ခြင်း

Cache Components နဲ့ဆိုရင် — **caching directives** (`"use cache"` နဲ့ ၎င်းရဲ့ variants တွေ) က async function တစ်ခုရဲ့ ရလဒ်ကို lifetime (သက်တမ်း) တစ်ခု သတ်မှတ်ပေးပါတယ် — ဒါကပဲ Next.js ကို အဲဒါကို static shell ထဲ ထည့်နိုင်စေတာပါ။

> **သိထားသင့်သည်:** [`"use cache: private"`](/docs/nextjs/use-cache-private) က — `cookies()` နဲ့ `headers()` လို runtime APIs တွေကို ဖတ်တဲ့ functions တွေကို cache လုပ်ဖို့အတွက် variant တစ်ခုပါ။ ရလဒ်ကို browser ထဲမှာပဲ cache လုပ်ပြီး — server ပေါ်မှာ မဟုတ်ပါဘူး။ **ဒါက static shell ရဲ့ အစိတ်အပိုင်း မဖြစ်နိုင်ပါဘူး။** Prefetching နဲ့ ဘယ်လို တွဲဖက် အလုပ်လုပ်လဲဆိုတာကို Optimizing prefetching guide ထဲက [`"use cache: private"`](/docs/nextjs/optimizing-prefetching#use-cache-private) မှာ ကြည့်ပါ။

**`<Suspense>`** က — uncached data (သို့) `cookies()` နဲ့ `headers()` လို runtime APIs တွေကို ဖတ်တဲ့ tree အပိုင်းတွေအတွက် fallback UI ကို ကြေညာပေးပြီး — content က ဖြေရှင်းပြီးတာနဲ့ fallback ထဲကို stream လုပ်ဝင်ပါတယ်။

> **သိထားသင့်သည်:** Fallback တစ်ခုက `cookies()`, `headers()` (သို့) URL အပြည့်အစုံကို ဝင်ရောက်သုံးနိုင်ပါတယ်။ Build time မှာ fallback ကိုယ်တိုင်က suspend ဖြစ်လို့ — tree ရဲ့ အပေါ်မှာ နောက်ထပ် `<Suspense>` boundary တစ်ခု လိုအပ်ပါတယ်။ `prefetch={true}` ရှိတဲ့ link တစ်ခုအတွက်တော့ — [per-link prefetching](/docs/nextjs/optimizing-prefetching) က URL data တွေကို navigation မလုပ်ခင် ရနိုင်စေလို့ — fallback က prefetch လုပ်ထားတဲ့ UI ရဲ့ အစိတ်အပိုင်း ဖြစ်လာနိုင်ပါတယ်။ Timestamps (သို့) data fetches လို cached values တွေက fallback ထဲမှာ တိုက်ရိုက် ထိုင်နိုင်ပါတယ်။

Next.js က route တစ်ခုချင်းစီအတွက် [**App Shell**](https://nextjs.org/docs/app/glossary#app-shell) တစ်ခုကိုလည်း generate လုပ်နိုင်ပြီး — အဲဒါက client navigations အတွင်းမှာ render လုပ်ပေးကာ — ကျန်တဲ့ content တွေက stream ဝင်ပါတယ်။ Partial Prefetching က App Shell ကို default `<Link>` prefetch အဖြစ် သုံးပါတယ်။ `prefetch={true}` ရှိတဲ့ link တစ်ခုက — အဲဒီ link ရဲ့ URL data ပေါ် မူတည်တဲ့ cached content တွေကိုလည်း ဖြေရှင်းနိုင်ပါတယ်။

### Link တစ်ခုအတွက် URL data ကို prefetch လုပ်ခြင်း

Partial Prefetching အောက်မှာ — visible `<Link>` တစ်ခုချင်းစီက destination ရဲ့ App Shell ကို default အနေနဲ့ prefetch လုပ်ပါတယ်။ Route တစ်ခုတည်းကို ညွှန်တဲ့ links တွေက — link တစ်ခုချင်းစီအတွက် App Shell request သီးခြားစီ လုပ်မယ့်အစား — App Shell တစ်ခုတည်းကို share လုပ်ပါတယ်။

Link တစ်ခုချင်းစီအတွက် shell နဲ့အတူ page content ကိုပါ prefetch လုပ်ချင်ရင် — [`prefetch={true}`](/docs/nextjs/component-link#prefetch) ကို သတ်မှတ်ပါ:

```tsx
<Link href="/checkout" prefetch>
  Checkout
</Link>
```

Partial Prefetching enable လုပ်ထားရင် — `prefetch={true}` က link ကို per-link prefetching ထဲလည်း ဝင်စေပြီး — per-link URL data (`params`, `searchParams`, URL အပြည့်အစုံ) တွေကို click မလုပ်ခင် ဖြေရှင်းပေးပါတယ်။

### Instant navigation ကို validate လုပ်ခြင်း

**Default** (`validationLevel: 'warning'`) အနေနဲ့ — Cache Components apps တွေက Page နဲ့ Default segment တိုင်းကို development မှာ validate လုပ်ပါတယ်။ Validation က — segment တစ်ခုထဲကို ဝင်တဲ့ navigations တွေကို instant မဖြစ်အောင် ဘာတွေက တားဆီးနေလဲ ဆိုတာကို ပေါ်လွင်စေပါတယ် — ဘယ် navigations တွေ block ဖြစ်မလဲ၊ `<Suspense>` boundary တစ်ခု ဘယ်နေရာမှာ ပျောက်နေလဲ၊ ပြီးတော့ ဘယ် data တွေ cache မလုပ်ဘဲ user ဆီ ရောက်နေလဲ ဆိုတာတွေပါ။

အလိုအလျောက် validation ကနေ ဖယ်ထုတ်ပြီး — `instant` ကို ရှင်းရှင်းလင်းလင်း export လုပ်ထားတဲ့ segments တွေကိုပဲ validate လုပ်ချင်ရင် — [`validationLevel`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant#configuring-validation-defaults) ကို `'manual-warning'` လို့ သတ်မှတ်ပါ:

```ts filename="next.config.ts" highlight={7}
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    instantInsights: {
      validationLevel: 'manual-warning',
    },
  },
}

export default nextConfig
```

<details>
<summary>Validation က မတူညီတဲ့ navigations တွေကို ဘယ်လို simulate လုပ်လဲ</summary>

Validated route တစ်ခုချင်းစီအတွက် — Next.js က ကနဦး page load ရော route hierarchy ထဲက နေရာအမျိုးမျိုးမှာ ရှိတဲ့ client navigations တွေကိုပါ စစ်ဆေးပါတယ်။

`/shop/[slug]` လို route တစ်ခုအတွက်ဆိုရင် — validation က ဒါတွေကို စစ်ဆေးပါတယ်:

- **Page load**: Tree တစ်ခုလုံးကို root ကနေ render လုပ်ပါတယ်။ Root layout ရဲ့ `<Suspense>` က အရာအားလုံးကို ဖမ်းယူပါတယ်။
- **Client navigation** (ဥပမာ — `/shop/shoes` ကနေ `/shop/hats` ကို): `/shop` layout က mount လုပ်ပြီးသား ဖြစ်လို့ — သူ့အောက်က page ပဲ ပြန် render လုပ်ပါတယ်။ Root layout ထဲက `<Suspense>` boundary တစ်ခုက ဒီ navigation ကို ဖုံးအုပ်မပေးပါဘူး။

Case တစ်ခုချင်းစီကို သီးခြားစီ validate လုပ်ပါတယ်။ Navigation path တစ်ခုကို ဖုံးအုပ်တဲ့ `<Suspense>` boundary တစ်ခုက — နောက်တစ်ခုကို ဖုံးအုပ်ချင်မှ ဖုံးအုပ်ပါလိမ့်မယ်။ ဒါကြောင့် page တစ်ခုက page load check ကို အောင်နိုင်ပေမယ့် — client navigations တွေအတွက်တော့ ကျရှုံးနိုင်ပြီး — routes အရေအတွက် များလာလေလေ ဒီပြဿနာတွေကို လက်နဲ့ ဖမ်းမိဖို့ ခက်လေလေ ဖြစ်တာပါ။

</details>

### CI မှာ test လုပ်ခြင်း

`@next/playwright` package က — navigation လုပ်ချိန်မှာ ချက်ချင်း ရနိုင်တဲ့ UI ပေါ်ကိုပဲ သင့် assertions တွေကို ကန့်သတ်ပေးတဲ့ [`instant()`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant#testing-instant-navigation) helper တစ်ခု ပေးပါတယ် — ဒါကြောင့် regressions တွေက CI မှာ ပေါ်လာပါတယ်။ Pattern အတွက် အောက်က Prevent regressions with e2e tests section ကို ကြည့်ပါ။

### Loading states တွေကို စစ်ဆေးခြင်း

Next.js DevTools ထဲက **Navigation Inspector** က page ကို သူ့ရဲ့ ကနဦး loading state မှာ အေးခဲထားပြီး — တိုက်ရိုက် visits တွေမှာ static shell ကို ပြသကာ — client navigations တွေမှာတော့ prefetch လုပ်ထားတဲ့ destination ကို ပြပါတယ်။ Shell ထဲကို အဓိပ္ပာယ်ရှိတဲ့ content ဘယ်လောက် ရောက်လဲ ကြည့်ဖို့ Inspector ကို သုံးပါ။

ဒါကို React DevTools ရဲ့ Suspense panel နဲ့ တွဲသုံးပြီး — boundary တစ်ခုချင်းစီက page ရဲ့ ဘယ်အပိုင်းကို ဖုံးအုပ်ထားလဲ တိတိကျကျ မြင်နိုင်ပါတယ်။ လုပ်ငန်းစဉ်အတွက် အောက်က Next.js DevTools နဲ့ loading states တွေကို မြင်ယောင်ကြည့်ခြင်း section ကို ကြည့်ပါ။

Fallback coverage လျှော့ချပြီး — content တွေကို shell ထဲ ပိုဆွဲထည့်ဖို့အတွက် [Maximizing the static shell](/docs/nextjs/caching#maximizing-the-static-shell) ကို ကြည့်ပါ။

## Instant အနေနဲ့ navigate လုပ်တဲ့ page တစ်ခု

ဒီ primitives တွေ အလုပ်လုပ်ပုံကို ကြည့်ဖို့ — store app ငယ်တစ်ခုကို စဉ်းစားပါ။ Product တစ်ခုချင်းစီမှာ `/store/[slug]` မှာ ကိုယ်ပိုင် page တစ်ခု ရှိပြီး — homepage ရော အခြား product pages တွေကနေပါ ရောက်လို့ရပါတယ်။ ရည်မှန်းချက်က — products တွေဆီ ရောက်တာရော products တွေကြားမှာ navigate လုပ်တာပါ instant ဖြစ်ဖို့ပါ။

Product page က data နှစ်မျိုး ယူပါတယ်: product details (နာမည်၊ ဈေးနှုန်း) နဲ့ live inventory (ပစ္စည်း လက်ကျန် အခြေအနေ)။

- `generateStaticParams` မရှိလို့ — `slug` ကို request time မှာပဲ သိရပါတယ်
- Component နှစ်ခုလုံးက `slug` ရဖို့ `params` ကို await လုပ်ပြီး — ဒါက suspend ဖြစ်စေပါတယ်။ တစ်ခုချင်းစီမှာ ကိုယ်ပိုင် `<Suspense>` boundary တစ်ခုစီ ရှိပါတယ်
- **Product info** က ခဲခဲယဉ်းယဉ်းပဲ ပြောင်းလဲလို့ — cached function တစ်ခုနဲ့ db ကနေ query လုပ်ထားပါတယ်
- **Inventory** က request တိုင်းမှာ fresh ဖြစ်ရပါတယ်။ Db query က `<Suspense>` boundary တစ်ခုအတွင်းမှာ ရှိပါတယ်

```tsx filename="app/store/[slug]/page.tsx" highlight={7-12,31}
import { Suspense } from 'react'
import { db } from '@/lib/db'

export default function ProductPage(props: PageProps<'/store/[slug]'>) {
  return (
    <div>
      <Suspense fallback={<p>Loading product...</p>}>
        <ProductInfo params={props.params} />
      </Suspense>
      <Suspense fallback={<p>Checking availability...</p>}>
        <Inventory params={props.params} />
      </Suspense>
    </div>
  )
}

type Params = PageProps<'/store/[slug]'>['params']

async function ProductInfo({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  return (
    <>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </>
  )
}

async function getProduct(slug: string) {
  'use cache'
  return db.products.findBySlug(slug)
}

async function Inventory({ params }: { params: Params }) {
  const { slug } = await params
  const item = await db.inventory.findBySlug(slug)
  return <p>{item.count} in stock</p>
}
```

Cache Components က ဒီ route ကို development မှာ အလိုအလျောက် validate လုပ်ပါတယ်။ တစ်ခုခုက navigation တစ်ခုကို block ဖြစ်စေမယ်ဆိုရင် — dev overlay က ပြဿနာရှိတဲ့ component ကို နာမည်နဲ့တကွ ဖော်ပြပြီး — ဒီ fixes တွေဆီ ညွှန်တဲ့ **blocking-route** insight တစ်ခုကို ပြပါတယ်:

> **Component (သို့) data ကို cache လုပ်ပါ**
>
> ```tsx
> async function Posts() {
>   "use cache"
>   return <List items={…} />
> }
> ```
>
> **Suspense ထဲမှာ wrap လုပ်ပါ (သို့) ရွှေ့ထည့်ပါ**
>
> ```tsx
> <Suspense fallback={…}>
>   <DataChild />
> </Suspense>
> ```
>
> Fix card တစ်ခုချင်းစီက patterns, code samples နဲ့ trade-offs ပါတဲ့ အသေးစိတ် walkthrough တစ်ခုဆီ ချိတ်ဆက်ပေးပါတယ်။ Card တစ်ခုကို နှိပ်ပြီး အသေးစိတ် လေ့လာနိုင်သလို — **Copy prompt** ကို သုံးပြီး fix ကို သင့် agent ဆီ အပ်နှံလို့လည်း ရပါတယ်။ ဒီ loop အတွက် အောက်က AI workflow section ကို ကြည့်ပါ။

Validation က page load တိုင်းမှာ — သင့် browser ရဲ့ တကယ့် request ကို သုံးပြီး run လုပ်လို့ — `[slug]` လို dynamic params တွေကို သင် navigate လုပ်တဲ့အခါ တကယ့် values တွေနဲ့ စစ်ဆေးပါတယ်။

### Client Component Pages

ထိပ်မှာ `"use client"` ပါတဲ့ page တစ်ခုဆီ လုပ်တဲ့ soft navigation (client-side မှာပဲ ပြောင်းတဲ့ navigation) က single-page app transition တစ်ခုလို ပြုမူပြီး — navigation လုပ်ချိန်မှာ server render မရှိတာမို့ — instant ဖြစ်ပါတယ်။ Dev overlay ကတော့ ဒါကို သူ့ရဲ့ fix cards တွေထဲ မထည့်ပါဘူး — ဘာလို့လဲဆိုတော့ အကြံပြုထားတဲ့ နည်းလမ်းတွေ (page ကို server-component model ထဲမှာ ထားတဲ့နည်းလမ်းတွေ) ထက် သက်ရောက်မှု ပိုကြီးလို့ပါ။ Page က လုံးဝ interactive ဖြစ်ပြီး client component တစ်ခု ဖြစ်ရမယ်ဆိုရင်တော့ `"use client"` ကို သုံးပါ။

> **သိထားသင့်သည်:** `"use client"` က static shell အတွက် validation ကို မကျော်လိုက်ပါဘူး။ `useSearchParams()` လို hooks တွေက `<Suspense>` boundary တစ်ခု ဆက်လို လိုအပ်ပါတယ်။

## Next.js DevTools နဲ့ loading states တွေကို မြင်ယောင်ကြည့်ခြင်း

Route တစ်ခုကို develop လုပ်နေစဉ်မှာ — Next.js DevTools က dynamic data တွေ stream မဝင်ခင် page loads နဲ့ client navigations တွေမှာ သင့် users တွေ မြင်ရမယ့်အရာကို ကြည့်စေပါတယ်။ သင့် loading states တွေ မှန်မမှန် စစ်ဆေးဖို့၊ မျှော်လင့်ထားတဲ့ content တွေ ချက်ချင်း ပေါ်လာတာ အတည်ပြုဖို့၊ ပြီးတော့ `<Suspense>` boundaries တွေ ထားရမယ့်နေရာတွေကို ပြန်လည် စမ်းသပ်ဖို့ (iterate) ဒါကို သုံးပါ။

React DevTools ရဲ့ Suspense panel က ဒါကို ဖြည့်စွက်ပေးပါတယ်: tree ထဲက `<Suspense>` boundaries တွေကို စာရင်းပြပြီး — တစ်ခုချင်းစီကို fallback နဲ့ resolved state ကြားမှာ toggle လုပ်နိုင်တာမို့ — boundary တစ်ခုချင်းစီက page ရဲ့ ဘယ်အပိုင်းကို ဖုံးအုပ်ထားလဲ တိတိကျကျ မြင်နိုင်ပါတယ်။

Navigation Inspector က Cache Components enable ဖြစ်နေချိန်မှာ ရနိုင်ပါတယ်:

```ts filename="next.config.ts" highlight={4}
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

Next.js DevTools ကို ဖွင့်ပြီး **Navigation Inspector** ကို ရွေးကာ — **Pause on navigations** ကို ဖွင့်ပါ။ Panel က **Awaiting navigation...** ဆိုပြီး ပြပါတယ်။ Toggle ဖွင့်ထားချိန်မှာ — နောက် refresh (သို့) link click တစ်ခုက page ကို အေးခဲစေလို့ — shell ကို စစ်ဆေးနိုင်ပါတယ်။

Product page ကို refresh လုပ်ပါ။ Inspector က အေးခဲသွားပြီး — target URL နဲ့အတူ **Page load** လို့ တံဆိပ်ကပ်ထားတဲ့ **Loading shell** ကို ပြပါတယ်။ App ထဲမှာ fallback နှစ်ခု ပေါ်လာပါတယ်: "Loading product..." နဲ့ "Checking availability..."။ ပထမဆုံး visit မှာ cache က cold ဖြစ်နေလို့ — နှစ်ခုလုံး မြင်ရပါတယ်။

_Page refresh လုပ်ပြီးနောက်။_

Navigation ကို အပြီးသတ်ဖို့ **Resume** ကို နှိပ်ပါ။ နောက်တစ်ခါ refresh လုပ်ရင် — product ရဲ့ နာမည်က cache ကနေ ချက်ချင်း ပေါ်လာပါတယ်။

အခု `/store/shoes` ကနေ `/store/hats` ဆီ link တစ်ခုကို နှိပ်ပါ။ Inspector က source ရော target URL နှစ်ခုလုံးနဲ့အတူ **Client nav** လို့ တံဆိပ်ကပ်ထားတဲ့ **Loading shell** ကို ပြပါတယ်။ App ထဲမှာ product ရဲ့ နာမည်နဲ့ ဈေးနှုန်းက (cache ကနေ) ချက်ချင်း ပေါ်လာပါတယ်။ "Checking availability..." ကတော့ inventory ဘယ်နေရာမှာ stream ဝင်မလဲဆိုတာ ပြပါတယ်။

_Client navigation လုပ်ပြီးနောက်။_

Loading states တွေကို စစ်ဆေးပြီးတာနဲ့ — **Pause on navigations** ကို ပိတ်လိုက်ပါ။ Toggle ဖွင့်ထားသရွေ့ navigation တိုင်း pause ဖြစ်နေပါလိမ့်မယ်။

> **သိထားသင့်သည်:** Page loads နဲ့ client navigations တွေက shells အမျိုးမျိုး ထုတ်နိုင်ပါတယ်။ `useSearchParams` လို client-side hooks တွေက page loads တွေမှာ suspend ဖြစ်ပြီး (search params တွေက build time မှာ မသိရသေးလို့) — client navigations တွေမှာတော့ synchronously ဖြေရှင်းပါတယ် (router က params တွေကို ရပြီးသားမို့)။

## E2E tests တွေနဲ့ regressions တွေကို ကာကွယ်ခြင်း

Validation က development ကာလအတွင်း structural ပြဿနာတွေကို ဖမ်းမိပေမယ့် — codebase ကြီးထွားလာတာနဲ့အမျှ — structural checks တွေက shell တစ်ခု ရှိတယ်ဆိုတာကိုပဲ ပြောနိုင်တော့တာပါ။ Shell ထဲမှာ content မှန်မှန် ပါလားဆိုတာကိုတော့ မပြောနိုင်ပါဘူး။ E2E tests တွေက ဒီကွာဟချက်ကို ပိတ်ပေးပါတယ်: navigation ပြီးတဲ့အခါ user က တကယ် မြင်ရတာကို သူတို့က assert လုပ်ပြီး — regressions တွေ ship မဖြစ်ခင် ဖမ်းမိပါတယ်။

ဒီအတွက် `@next/playwright` package ထဲမှာ `instant()` helper တစ်ခု ပါဝင်ပါတယ်။ `@playwright/test` နဲ့အတူ တပ်ဆင်ပါ:

```bash package="pnpm"
pnpm add -D @next/playwright @playwright/test
```

```bash package="npm"
npm install -D @next/playwright @playwright/test
```

```bash package="yarn"
yarn add -D @next/playwright @playwright/test
```

```bash package="bun"
bun add -D @next/playwright @playwright/test
```

Route တစ်ခုကို နည်း နှစ်မျိုးနဲ့ ရောက်လို့ရပြီး — `<Suspense>` boundary တစ်ခုက တစ်မျိုးကို ဖုံးအုပ်ပေးပေမယ့် — နောက်တစ်မျိုးကို မဖုံးအုပ်နိုင်ပါဘူး:

- **Initial page load**: `page.goto()` ကို သုံးပြီး document response ကနေ static UI ကို test လုပ်ပါ။
- **Client navigation**: `<Link>` တစ်ခုကို နှိပ်ပြီး destination ရဲ့ prefetched UI ကို test လုပ်ပါ။ [Per-link prefetching](/docs/nextjs/optimizing-prefetching) က request-specific content တွေကို ဒီ UI ထဲ ထည့်နိုင်ပါတယ်။

```typescript filename="e2e/navigation.test.ts" highlight={6-14,20-25}
import { test, expect } from '@playwright/test'
import { instant } from '@next/playwright'

test.describe('Product page (/store/[slug])', () => {
  test('is instant on an initial page load', async ({ page, baseURL }) => {
    await instant(
      page,
      async () => {
        await page.goto('/store/hats')
        await expect(page.locator('h1')).toContainText('Baseball Cap')
        await expect(page.getByText('In stock')).toHaveCount(0)
      },
      { baseURL }
    )
    await expect(page.getByText('In stock')).toBeVisible()
  })

  test('is instant on a client navigation', async ({ page }) => {
    await page.goto('/store/shoes')
    await instant(page, async () => {
      await page.click('a[href="/store/hats"]')
      await page.waitForURL((url) => url.pathname === '/store/hats')
      await expect(page.locator('h1')).toContainText('Baseball Cap')
      await expect(page.getByText('In stock')).toHaveCount(0)
    })
    await expect(page.getByText('In stock')).toBeVisible()
  })
})
```

`page.goto()` က ပထမဆုံး navigation ဖြစ်ရင် — Playwright ရဲ့ `baseURL` ကို `instant()` ဆီ ပေးပါ။ Helper က document ကို request မလုပ်ခင် origin လိုအပ်ပါတယ်။

Callback ထဲမှာ — ကနဦး page load တစ်ခုက static UI ကို ပြပြီး — client navigation တစ်ခုက destination ရဲ့ prefetched UI ကို ပြပါတယ်။ အခြား dynamic content တွေက callback ပြီးမြောက်တဲ့အထိ block ဖြစ်နေပါတယ်။

> **သိထားသင့်သည်:** `instant()` scope ရဲ့ စတင်ချိန်က Navigation Inspector ထဲက **Pause on navigations** ကို ဖွင့်လိုက်တာနဲ့ တူညီပြီး — scope ရဲ့ အဆုံးက **Resume** လုပ်သလိုပဲ pause ကို လွှတ်ပေးပါတယ်။

Client navigations တွေအတွက် — သူ့ UI ကို assert မလုပ်ခင် destination URL ကို စောင့်ပါ။ မဟုတ်ရင် — shared selector တစ်ခုက destination commit မဖြစ်ခင် source page ကို ကိုက်ညီသွားနိုင်ပါတယ်။ Prefetched destination က commit မလုပ်နိုင်ရင် — URL wait က timeout ဖြစ်ပြီး test က ကျရှုံးပါတယ်။

ဒါတွေကို `next dev` ပေါ်မှာ run လုပ်ပါ — testing API က အဲဒီမှာ အလိုအလျောက် enable ဖြစ်နေလို့ပါ။ Production build တစ်ခုကို ဆန့်ကျင်ပြီး CI မှာ run ချင်ရင်တော့ — `next start` က API တစ်ခုတည်းကို ထုတ်ပြနိုင်အောင် `exposeTestingApiInProductionBuild` ကို သတ်မှတ်ပါ:

```ts filename="next.config.ts" highlight={5}
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: { exposeTestingApiInProductionBuild: true },
}

export default nextConfig
```

ဒီ tests တွေကို အရေးအကြီးဆုံး user flows တွေပေါ်မှာ အာရုံစိုက်ပါ။

## Block ဖြစ်နေတဲ့ navigation တစ်ခုကို ပြုပြင်ခြင်း

အခြား route တစ်ခုကို ကြည့်ပါ — `/products/[slug]` — ဒါက public API တစ်ခုကနေ product data တွေကို ယူပြီး — featured list တစ်ခုကို ဘေးမှာ ပြပါတယ်:

```tsx filename="app/products/[slug]/page.tsx"
export default async function ProductPage(
  props: PageProps<'/products/[slug]'>
) {
  const featured = await getFeatured()
  const { slug } = await props.params
  const res = await fetch(`https://next-recipe-api.vercel.dev/products/${slug}`)
  const product = await res.json()

  return (
    <div>
      <FeaturedSection items={featured} />
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <p>{product.description}</p>
    </div>
  )
}

async function getFeatured() {
  const res = await fetch('https://next-recipe-api.vercel.dev/products?limit=3')
  return res.json()
}
```

`fetch()` call နှစ်ခုက top level မှာ block ဖြစ်နေပါတယ်: featured-list အတွက် cache မလုပ်ထားတဲ့ fetch တစ်ခုနဲ့ — per-slug product fetch တစ်ခု (`params` ကိုလည်း await လုပ်တဲ့ဟာ)။ နှစ်ခုလုံးက Instant validation errors အဖြစ် — တစ်ခုပြီးတစ်ခု — ပေါ်လာပါလိမ့်မယ်။

### အဆင့် ၁: slug ပေါ် မူတည်တဲ့ အလုပ်ကို Suspense ထဲ ရွှေ့ပါ

Validation က per-slug product fetch ကို အရင်ဆုံး ပေါ်လွင်စေပါတယ်။

slug ပေါ် မူတည်တဲ့ အလုပ်ကို sub-component တစ်ခုထဲ ထုတ်ပြီး — `<Suspense>` နဲ့ wrap လုပ်ပါ:

```tsx filename="app/products/[slug]/page.tsx" highlight={21-23}
import { Suspense } from 'react'

async function ProductInfo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const res = await fetch(`https://next-recipe-api.vercel.dev/products/${slug}`)
  const product = await res.json()
  return (
    <>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <p>{product.description}</p>
    </>
  )
}

export default async function ProductPage(
  props: PageProps<'/products/[slug]'>
) {
  const featured = await getFeatured()
  return (
    <div>
      <FeaturedSection items={featured} />
      <Suspense fallback={<p>Loading product...</p>}>
        <ProductInfo params={props.params} />
      </Suspense>
    </div>
  )
}
```

အခုဆိုရင် `await props.params` ရော product fetch ပါ အတူတူ suspend ဖြစ်ပါတယ်။ Product-fetch error က ရှင်းသွားပြီး — validation က နောက် blocker ဆီ ဆက်သွားပါတယ်။

### အဆင့် ၂: Featured fetch ကို cache လုပ်ပါ

Validation က အခု `getFeatured()` ပေါ်မှာ ထွက်ပါတယ်။

Fetching function ထဲ `"use cache"` directive ထည့်ပါ:

```tsx filename="app/products/[slug]/page.tsx"
async function getFeatured() {
  'use cache'
  const res = await fetch('https://next-recipe-api.vercel.dev/products?limit=3')
  return res.json()
}
```

ရလဒ်ကို fetch level မှာ cache လုပ်ပါတယ်။ Featured list က App Shell နဲ့အတူ ပါသွားပါတယ်။

> **သိထားသင့်သည်:** Serverless deployments တွေမှာ — `"use cache"` နဲ့ in-memory caching က instances တွေကြားမှာ မတည်မြဲပါဘူး။ Persistent caching အတွက် [`"use cache: remote"`](/docs/nextjs/use-cache-remote) ကို သုံးစဉ်းစားပါ။

Validation က အောင်ပါတယ်။ DevTools ကို ဖွင့်ပြီး client navigation တစ်ခု စမ်းကြည့်ပါ။ Featured section က ချက်ချင်း ပေါ်လာပြီး — **"Loading product..."** က product details တွေ ဘယ်နေရာမှာ stream ဝင်မလဲဆိုတာ ပြပါတယ်။

### Loading states တွေကို ထပ်ခါထပ်ခါ စမ်းသပ်ခြင်း (Iterate)

Validation အောင်တာက navigation က instant ဖြစ်တယ်လို့ ဆိုလိုတာပါ။ Loading states တွေ ကောင်းနေတယ်လို့တော့ မဆိုလိုပါဘူး။ Tree ရဲ့ အမြင့်မှာ ထားထားတဲ့ `<Suspense>` boundary တစ်ခု (ဥပမာ — page တစ်ခုလုံးကို wrap လုပ်ထားတဲ့ဟာ) က validation ကို ကျေနပ်စေနိုင်ပေမယ့် — navigation တိုင်းမှာ page ရဲ့ အများစုကို fallback တစ်ခုတည်းနဲ့ အစားထိုးပစ်ပါတယ်။

အကောင်းဆုံး loading states တွေက — တကယ့် cached content တွေကို တတ်နိုင်သမျှ များများ မြင်နေစေပြီး — data တကယ် ရောက်နေတုန်း (in flight) ဖြစ်တဲ့ နေရာတွေမှာပဲ fallbacks တွေကို ပြပါတယ်။ Header, image နဲ့ description ကို မြင်နေရပြီး — ဈေးနှုန်းနဲ့ ရနိုင်မှု အခြေအနေပဲ fallback နောက်မှာ ရှိတဲ့ product page တစ်ခုက — စုစုပေါင်း load time အတူတူဆိုတောင် — page တစ်ခုလုံး skeleton ပြတာထက် ပိုမြန်တယ်လို့ ခံစားရပါတယ်။

သင့် users တွေ မြင်ရတာကို ကြည့်ဖို့ DevTools ကို သုံးပါ — (သို့) agent တစ်ခုနဲ့ ဒီ loop ကို အလိုအလျောက် လုပ်ဖို့ အောက်က AI workflow section ကို ကြည့်ပါ။

## AI workflow (AI နဲ့ လုပ်ဆောင်ပုံ)

အကြမ်းဖျင်း ပြောရရင် — agent တစ်ခုက navigation တစ်ခုတည်းကို ဒီလို optimize လုပ်ပါတယ်:

- **Observe**: Validation insights တွေကို ဖတ်ပြီး — ချက်ချင်း ပေါ်သင့်တဲ့ တိကျတဲ့ navigation နဲ့ UI ကို ရွေးချယ်ပါတယ်။
- **Test**: Target UI က ပုံမှန် render ဖြစ်တာ အတည်ပြုပြီး — route ကို မပြောင်းခင် `instant()` test တစ်ခု ရေးကာ — အဲဒါ fail ဖြစ်တာ စစ်ဆေးပါတယ်။
- **Fix**: Validation errors တွေက component တစ်ခုကို နာမည်နဲ့တကွ ဖော်ပြပြီး — fix တစ်ခု အကြံပြုပါတယ် (`use cache` (သို့) `<Suspense>`)။ Agent က fix ကို သုံးပြီး — validation ကို ပြန် run လုပ်ပါတယ်။
- **Verify**: Test ကို production နဲ့တူတဲ့ build တစ်ခုပေါ်မှာ run လုပ်ပြီး — အောင်တဲ့ test ကို regression guard အဖြစ် သိမ်းထားပါတယ်။

Agent က caching model တစ်ခုလုံးကို နားလည်စရာ မလိုပါဘူး — insights နဲ့ errors တွေ မကျန်တဲ့အထိ လိုက်နာရုံပါပဲ။ ဒါပေမယ့် — သင့် app နဲ့ သက်ဆိုင်တဲ့ ရည်ရွယ်ချက် (app-specific intent) တော့ လိုပါတယ်။ ဘာတွေက ချက်ချင်း ပေါ်သင့်လဲ၊ ဘာတွေက stream ဝင်လို့ရလဲ၊ ဘာတွေက အမြဲ fresh ဖြစ်နေရမလဲဆိုတာ ပြောပြပါ။ Caching ဆုံးဖြတ်ချက်တစ်ခု မရှင်းလင်းတဲ့အခါ — cache lifetime တစ်ခုကို မှန်းဆတာထက် — data ကို `<Suspense>` နောက်မှာ fresh အနေနဲ့ ထားပါ။

Loading states တွေကို ပြန်လည် စမ်းသပ်ဖို့အတွက် — "maximize my content, and reduce the amount that needs to be behind a spinner" လို prompt တစ်ခုက — boundaries တွေကို အောက်ကို ရွှေ့ဖို့ ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။

Cache Components route တစ်ခုမှာ အလုပ်လုပ်တဲ့ agents တွေက ပုံမှန်အားဖြင့် lever သုံးခုကို သုံးပါတယ်:

- **Push down**: I/O တွေကို Suspense နဲ့ wrap ထားတဲ့ child တစ်ခုထဲ ထုတ်ပြီး — parent က static ဖြစ်နေကာ — static siblings တွေက shell ထဲကို တက်လာစေပါတယ်။
- **Cache**: `'use cache'` ကို [`cacheLife`](/docs/nextjs/cache-life) နဲ့ တွဲပြီး — freshness profile (အသစ်ဆန်မှု ပုံစံ) တစ်ခု သတ်မှတ်ပါတယ်။
- **Per-link prefetching** (nav-only): Route တစ်ခုက URL data (`searchParams` (သို့) `params`) တွေကို ဖတ်နေရင် — အဲဒါကို [per-link prefetching](/docs/nextjs/optimizing-prefetching) ထဲ ဝင်စေပြီး — framework က အဲဒီ data ကို link-prefetch time မှာ ဖြေရှင်းပေးပါတယ်။ `cookies()` (သို့) `headers()` ကနေရတဲ့ session data တွေကတော့ — ဒါမလိုဘဲ App Shell ထဲ ရောက်နေပြီးသားပါ။

Refactor တစ်ခုချင်းစီကို before/after capture (မပြောင်းခင်/ပြောင်းပြီး ဖမ်းယူမှု) တွေနဲ့ တွဲပြီး — အပြောင်းအလဲ တကယ် သက်ရောက်လားဆိုတာ စစ်ဆေးပါ။ Capture တွေ အတူတူကြည့်နေရင် — refactor က အကျိုးသက်ရောက်မှု မရှိဘူးလို့ ဆိုလိုပါတယ်။

Agents တွေက သူတို့ ပြောင်းလဲမှုတွေ တကယ် ဘာ render ဖြစ်လဲ မြင်နိုင်ဖို့ — ဒါကို [agent-browser](https://github.com/vercel-labs/agent-browser) နဲ့ တွဲပါ။ React DevTools enable လုပ်ထားရင် — component tree နဲ့ ဘယ် `<Suspense>` boundaries တွေ ဆက်ပြီး pending (စောင့်ဆိုင်းနေဆဲ) လဲဆိုတာကို report လုပ်လို့ — agent က အပြောင်းအလဲ လုပ်ပြီး — shell ကို snapshot ယူကာ — ဘာတွေ ရောက်လဲ စစ်ပြီး ချိန်ညှိနိုင်ပါတယ်။ Setup အတွက် AI agents guide ထဲက [Runtime visibility](/docs/nextjs/ai-agents#step-2-give-agents-runtime-visibility) ကို ကြည့်ပါ။

[`next-cache-components-optimizer`](/docs/nextjs/ai-agents#next-cache-components-optimizer) Skill က ဒီ loop ကို package လုပ်ထားပါတယ်။ သူက target UI ပုံမှန် render ဖြစ်တာ အတည်ပြုပြီး — fix မတိုင်ခင် fail ဖြစ်တဲ့ `instant()` test တစ်ခု ရေးကာ — production နဲ့တူတဲ့ build တစ်ခုပေါ်မှာ green ဖြစ်အောင် အလုပ်လုပ်ပြီး — regression guard အဖြစ် ship လုပ်ပါတယ်။ ကနဦး load (hard navigation), client-side navigation (soft navigation) — ဒါမှမဟုတ် နှစ်ခုလုံးအတွက် သုံးပါ။

## Opting out (validation မှ ဖယ်ထုတ်ခြင်း)

Layout (သို့) page တိုင်း instant ဖြစ်နိုင်တာ (သို့) ဖြစ်သင့်တာ မဟုတ်ပါဘူး။ Structural fix က လုပ်ရကျိုးနပ်မှု မရှိတဲ့အခါ (သို့) route တစ်ခုက instant navigation အတွက် ဦးစားပေး မဟုတ်တဲ့အခါ — scope နှစ်မျိုးထဲက တစ်မျိုးနဲ့ validation ကို ချိန်ညှိနိုင်ပါတယ်။

Dev overlay က ဒါကို insight တိုင်းနဲ့အတူ **Block** fix အဖြစ် ပြပါတယ်:

> **Block ဖြစ်တဲ့ route ကို ခွင့်ပြုပါ**
>
> ```tsx
> // page.tsx (သို့) layout.tsx
> export const instant = false
> ```

Page (သို့) layout file ပေါ်မှာ `instant = false` သတ်မှတ်ပါ။ ဒါက segment ကို validation feedback ကနေ ဖယ်ထုတ်လိုက်တာပါ။ Segment က — သူ့ structure က ထောက်ပံ့နိုင်ရင် — instant အနေနဲ့ ဆက် navigate လုပ်နိုင်ပါသေးတယ်; framework ကပဲ သူ့အတွက် insights တွေကို မပြတော့တာပါ။ အောက်က sibling segments တွေကြားက navigations တွေကတော့ ဆက်ပြီး validate လုပ်ခံရပါတယ်။

```tsx filename="app/dashboard/layout.tsx"
export const instant = false
```

`/dashboard/layout.tsx` ပေါ်မှာ `false` ထားရင် — validation က အပြင်ကနေ `/dashboard` ထဲကို ဝင်တဲ့ navigations တွေကို မပြတော့ပါဘူး; `/dashboard/a` နဲ့ `/dashboard/b` ကြားက navigations တွေကတော့ ဆက်စစ်ဆေးခံရပါတယ်။

ဖယ်ထုတ်ထားတဲ့ (opted-out) segments တွေအတွက် — navigation က server ပေါ်မှာ block ဖြစ်ပါတယ်။ Content က cookies (သို့) headers ပေါ် မှီခိုပေမယ့် — သေချာတဲ့ cache lifetime တစ်ခု ရှိနေရင် — opt out လုပ်မယ့်အစား [`use cache: private`](/docs/nextjs/use-cache-private) နဲ့ cache လုပ်ခြင်းက App Shell ကို — သူ့ရဲ့ [`stale`](/docs/nextjs/cache-life#stale) time က အနည်းဆုံး ၅ မိနစ် ရှိနေသရွေ့ — click မလုပ်ခင် အဲဒီ content ကို သယ်ဆောင်စေပါတယ်။

## နောက်တစ်ဆင့်တွေ

- [Adopting Partial Prefetching](/docs/nextjs/adopting-partial-prefetching) — အကြံပြုထားတဲ့ `<Link>` defaults တွေနဲ့ `unstable_eager` ကနေ ပြောင်းရွှေ့တဲ့ လမ်းကြောင်းအတွက်
- [`instant` API reference](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant) — configuration အပြည့်အစုံအတွက်
- [Optimizing prefetching](/docs/nextjs/optimizing-prefetching) — သင့် route ရဲ့ အစိတ်အပိုင်းတွေက URL data (`searchParams` (သို့) `params`) ပေါ် မှီခိုပြီး — navigation မလုပ်ခင် ဖြေရှင်းသင့်တဲ့အခါ
- [Caching](/docs/nextjs/caching) — `use cache`, Suspense နဲ့ Partial Prerendering အကြောင်း နောက်ခံအချက်အလက်တွေအတွက်
- [Revalidating](/docs/nextjs/revalidating) — `cacheLife` နဲ့ `updateTag` သုံးပြီး cached data တွေကို ဘယ်လို expire လုပ်လဲဆိုတာအတွက်
