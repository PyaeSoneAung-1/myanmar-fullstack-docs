---
title: "Streaming"
description: "Streaming က Next.js မှာ ဘယ်လို အလုပ်လုပ်လဲ — loading.js နဲ့ <Suspense> သုံးပြီး data ရလာတာနဲ့အမျှ UI ကို အဆင့်ဆင့် render လုပ်ခြင်း, Route Handlers မှာ streaming, Web Vitals, HTTP contract နဲ့ streaming ကို သက်ရောက်စေတဲ့အချက်များ"
order: 15
source: "https://nextjs.org/docs/app/guides/streaming"
status: translated
updated: 2026-09-01
---

## Streaming ဆိုတာ ဘာလဲ

သမားရိုးကျ server-side rendering မှာ — server က ဘာမှ မပို့ခင် HTML document အပြည့်အစုံကို ထုတ်လုပ်ပါတယ်။ Database query (သို့) API call တစ်ခုတည်း နှေးနေရင် page တစ်ခုလုံး ပိတ်သွားနိုင်ပါတယ်။ Streaming က [chunked transfer encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding) ကို သုံးပြီး — response ရဲ့ အပိုင်းတွေကို အသင့်ဖြစ်တာနဲ့ ပို့ပေးခြင်းအားဖြင့် ဒါကို ပြောင်းလဲပေးပါတယ်။ Server က ကျန်တဲ့ အစိတ်အပိုင်းတွေကို ထုတ်လုပ်နေချိန်မှာပဲ browser က HTML ကို စတင် render လုပ်ပါတယ်။

ဒါက မြန်တဲ့ static content တွေ (headers, navigation, layout) နဲ့ နှေးတဲ့ dynamic content တွေ (personalized data, analytics, recommendations) ကို ပေါင်းစပ်ထားတဲ့ pages တွေအတွက် အထူးသက်ရောက်မှု ကြီးပါတယ်။ Static အပိုင်းတွေကို prerender လုပ်ပြီး CDN ကနေ ပေးနိုင်လို့ — ချက်ချင်း ပေါ်လာပြီး — dynamic အပိုင်းတွေကတော့ အသင့်ဖြစ်တာနဲ့ server ကနေ stream လုပ်ဝင်ပါတယ်။

React ရဲ့ server renderer က HTML ကို `<Suspense>` boundaries တွေနဲ့ ညှိထားတဲ့ chunks တွေအနေနဲ့ ထုတ်လုပ်ပါတယ်။ Next.js က ဒါကို App Router ထဲ ပေါင်းစပ်ထားလို့ — နောက်ထပ် configuration မလိုဘဲ streaming အလုပ်လုပ်ပါတယ်။

## ဥပမာ

တွဲဖက်ဖြစ်တဲ့ [streaming demo](https://streaming-demo.labs.vercel.dev/) ([source](https://github.com/vercel-labs/streaming-demo)) က ဒီ guide ထဲက concept တစ်ခုချင်းစီကို လက်တွေ့ မြင်နိုင်စေပါတယ်:

- `loading.tsx` နဲ့ Page-level streaming (skeleton က ချက်ချင်း ပေါ်ပြီး content က ~2 စက္ကန့် အကြာမှာ stream လုပ်ဝင်ပါတယ်)
- တစ်ခုနဲ့တစ်ခု သီးခြားစီ ဖြေရှင်းကြတဲ့ sibling `<Suspense>` boundaries တွေနဲ့ Granular streaming
- Hydration နှိုင်းယှဉ်ချက်: blocking pass တစ်ခုတည်းနဲ့ vs Suspense boundaries တွေနဲ့ split hydration
- Route Handler တစ်ခုမှာ raw HTML streaming — early CSS discovery နဲ့အတူ
- Chunk sizes နဲ့ browser buffering တွေကို စမ်းသပ်ဖို့ configurable `ReadableStream` API endpoint တစ်ခု

## App Router က page တစ်ခုကို ဘယ်လို ပို့ဆောင်လဲ

Browser က page တစ်ခုကို request လုပ်တဲ့အခါ — ကနဦး page load ကာလအတွင်းမှာ stream နှစ်ခု အတူတကွ အလုပ်လုပ်ပါတယ်:

### HTML stream

React ရဲ့ server renderer က progressive HTML chunks တွေကို ထုတ်လုပ်ပါတယ်။ သင့် page ရဲ့ static အစိတ်အပိုင်းတွေ (layouts, navigation, Suspense fallbacks) က အရင်ဆုံး render လုပ်ပြီး ချက်ချင်း ပို့ပေးပါတယ်။ `<Suspense>` boundary တစ်ခုရဲ့ content အသင့်ဖြစ်တဲ့အခါ — ဥပမာ async [Server Component](/docs/nextjs/glossary#server-component) တစ်ခု ဖြေရှင်းပြီးတဲ့အခါ — React က ပြီးစီးသွားတဲ့ HTML ကို inline `<script>` tags တွေနဲ့အတူ stream လုပ်ပါတယ်: တစ်ခုက fallback DOM node ကို content အသစ်နဲ့ လဲလှယ်ပေးပြီး — နောက်တစ်ခုက React က နောက်ပိုင်းမှာ hydrate လုပ်နိုင်အောင် [component payload](#the-component-payload) ကို သယ်ဆောင်ပေးပါတယ်။ Browser က page ရဲ့ JavaScript bundle တင်လာတာ (သို့) hydration ပြီးတာကို မစောင့်ဘဲ — swap ကို ချက်ချင်း လုပ်ဆောင်ပါတယ်။ ဒါက user ကို _မြင်ရတဲ့_ အရာပါ: page က section တစ်ခုချင်းစီ အလိုက် တဖြည်းဖြည်း ပေါ်လာပါတယ်။

### Component payload

Component payload ဆိုတာ React က page ကို [hydrate](/docs/nextjs/glossary#hydration) လုပ်ပြီး client-side updates တွေကို ကိုင်တွယ်ဖို့ သုံးတဲ့ component tree ရဲ့ serialized လုပ်ထားတဲ့ ပုံစံတစ်ခုပါ။ ကနဦး load မှာ — ဒါက HTML stream ထဲမှာ ပါဝင်လာပါတယ် (အပေါ်မှာ ဖော်ပြခဲ့သလိုပါ)။ **Client-side navigation** မှာတော့ — component payload တစ်ခုတည်းကိုပဲ ယူပြီး (`rsc: 1` request header နဲ့) HTML ကို လုံးဝ မလွှဲပြောင်းပါဘူး။ React က ဒါကို သုံးပြီး component tree ကို နေရာတွင်းမှာ update လုပ်ပါတယ်။

### Static shell

Async အလုပ်တွေ မဖြေရှင်းခင်အထိ render ဖြစ်တဲ့ အရာအားလုံးကို **static shell** လို့ ခေါ်ပါတယ်: သင့် layouts, navigation နဲ့ သင့် `<Suspense>` boundaries တွေက သတ်မှတ်ပေးထားတဲ့ fallback UI တွေပါ။ ဒါတွေကို ချက်ချင်း ပို့ပေးလို့ — dynamic content တွေ stream လုပ်ဝင်နေချိန်မှာ user က ကြည့်လို့, ထိတွေ့လို့ရတဲ့ အရာတစ်ခုခု ရရှိပါတယ်။ [Cache Components](/docs/nextjs/caching) နဲ့ဆိုရင် — static shell က build time မှာ prerender လုပ်ပြီး edge ကနေ ချက်ချင်း ပေးပို့ပါတယ်။

`<Suspense>` boundary တစ်ခုချင်းစီက သီးခြား streaming point တစ်ခုပါ။ Boundaries အမျိုးမျိုးထဲက components တွေက သီးခြားစီ ဖြေရှင်းပြီး stream လုပ်ပါတယ်။ တစ်ခုက တစ်ခုကို မပိတ်ဆို့ပါဘူး။

## `loading.js` နဲ့ Page-level streaming

Streaming ထည့်ဖို့ အရိုးရှင်းဆုံး နည်းလမ်းက `loading.js` file တစ်ခုပါ။ ဒါကို သင့် `page.js` ဘေးမှာ ထားလိုက်ရင် — Next.js က page content ကို `<Suspense>` boundary တစ်ခုထဲ အလိုအလျောက် wrap လုပ်ပြီး — သင့် loading component ကို fallback အဖြစ် သုံးပါတယ်။

```tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
      <div className="h-4 w-full bg-gray-200 rounded mb-2" />
      <div className="h-4 w-full bg-gray-200 rounded mb-2" />
      <div className="h-4 w-2/3 bg-gray-200 rounded" />
    </div>
  )
}
```

နောက်ကွယ်မှာ — `loading.js` က `layout.js` ထဲမှာ nested ဖြစ်ပြီး `page.js` ကို `<Suspense>` boundary တစ်ခုထဲ wrap လုပ်ပါတယ်။ ဒါက ဆိုလိုတာက:

- Layout က static shell ရဲ့ အစိတ်အပိုင်းအနေနဲ့ ချက်ချင်း render လုပ်ပါတယ်။
- Loading skeleton က Suspense fallback အနေနဲ့ ချက်ချင်း ပေါ်ပါတယ်။
- Page component က loading ပြီးတာနဲ့ — သူ့ရဲ့ HTML က skeleton ကို အစားထိုးပါတယ်။

Page ရဲ့ data တွေ ဖြေရှင်းမပြီးခင်အထိ ပြသစရာ အဓိပ္ပာယ်ရှိတဲ့အရာ မရှိတဲ့အခါ `loading.js` က အသုံးဝင်ပါတယ်။ Page က ဘာမှ render မလုပ်ခင် data ကို await လုပ်ရမယ်ဆိုရင် — page တစ်ခုလုံးအတွက် skeleton တစ်ခုက ကျိုးကြောင်းဆီလျော်တဲ့ fallback တစ်ခုပါ။

အသေးစိတ်အတွက် [`loading.js` API reference](/docs/nextjs/loading) ကို ကြည့်ပါ။

## `<Suspense>` နဲ့ Granular streaming

`<Suspense>` က page ရဲ့ ဘယ်အပိုင်းတွေကို သီးခြားစီ stream လုပ်မလဲဆိုတာကို တိကျစွာ ထိန်းချုပ်နိုင်စေပါတယ်။ Page တစ်ခုလုံးအတွက် skeleton အစား — fallbacks တွေကို section အလိုက် အောက်ကို ရွှေ့လိုက်လို့ static shell ထဲမှာ တကယ့် content တွေ ပိုပြီး ပါဝင်လာနိုင်ပါတယ်။

### Sibling boundaries တွေနဲ့ Parallel streaming

Components အများအပြားက async အလုပ်တွေ (data fetching, database ကနေ ဖတ်ခြင်း) လုပ်နေတဲ့အခါ — တစ်ခုချင်းစီကို ကိုယ်ပိုင် `<Suspense>` boundary တစ်ခုချင်းစီထဲ wrap လုပ်ပါ။ Boundary တစ်ခုချင်းစီက သူ့ရဲ့ async အလုပ် ပြီးတာနဲ့ — ဘယ်အစီအစဉ်နဲ့ ပြီးပြီး အဲဒီအတိုင်း — တစ်ခုကိုတစ်ခု မပိတ်ဆို့ဘဲ သီးခြားစီ stream လုပ်ပါတယ်:

```tsx
import { Suspense } from 'react'
import { Revenue } from './revenue'
import { RecentOrders } from './recent-orders'
import { Recommendations } from './recommendations'

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<p>Loading revenue...</p>}>
          <Revenue />
        </Suspense>
        <Suspense fallback={<p>Loading orders...</p>}>
          <RecentOrders />
        </Suspense>
      </div>
      <Suspense fallback={<p>Loading recommendations...</p>}>
        <Recommendations />
      </Suspense>
    </div>
  )
}
```

ဒီဥပမာမှာ — `Revenue` က 200ms နဲ့, `RecentOrders` က 1s နဲ့, `Recommendations` က 3s နဲ့ ဖြေရှင်းရင် — user က section တစ်ခုချင်းစီရဲ့ data အသင့်ဖြစ်တာနဲ့ အဲဒီ section ပေါ်လာတာကို မြင်ရပါတယ်။

### Progressive detail အတွက် Nested boundaries

`<Suspense>` boundaries တွေကို nested လုပ်ပြီး — အလွှာလိုက် loading အတွေ့အကြုံတစ်ခု ဖန်တီးနိုင်ပါတယ်။ ဥပမာ — product page တစ်ခုက header ကို ချက်ချင်း stream လုပ်ပြီး — product details တွေကို နောက်တစ်ဆင့်မှာ, reviews တွေကို နောက်ဆုံးမှာ stream လုပ်နိုင်ပါတယ်:

```tsx
import { Suspense } from 'react'
import { ProductDetails } from './product-details'
import { Reviews } from './reviews'

export async function generateStaticParams() {
  const products = await getTopProducts()
  return products.map((product) => ({ id: product.id }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div>
      <h1>Product</h1>
      <Suspense fallback={<p>Loading product details...</p>}>
        <ProductDetails id={id} />
        <Suspense fallback={<p>Loading reviews...</p>}>
          <Reviews productId={id} />
        </Suspense>
      </Suspense>
    </div>
  )
}
```

အပြင်ဘက် boundary က `ProductDetails` မဖြေရှင်းခင်အထိ "Loading product details..." ကို ပြပါတယ်။ ပြီးတာနဲ့ — အတွင်းဘက် boundary မြင်ရပြီး `Reviews` မဖြေရှင်းခင်အထိ "Loading reviews..." ကို ပြပါတယ်။ ဒါက progressive reveal (တစ်ဆင့်ချင်း ဖော်ပြခြင်း) တစ်ခု ဖန်တီးပေးပါတယ်။

### Dynamic access တွေကို အောက်ကို ရွှေ့ခြင်း

ချက်ချင်း stream လုပ်တဲ့အရာကို အများဆုံး ဖြစ်အောင် လုပ်ဖို့ အဓိကသော့ချက်က — dynamic data access တွေကို တကယ်လိုအပ်တဲ့ component ဆီ အပ်နှံခြင်းပါ။ ဒါက `params`, `searchParams`, `cookies()`, `headers()` နဲ့ data fetches တွေအားလုံးကို သက်ရောက်ပါတယ်။ ဒီအထဲက တစ်ခုခုကို layout (သို့) page တစ်ခုရဲ့ ထိပ်မှာ `await` လုပ်လိုက်ရင် — အဲဒီအောက်က အရာအားလုံး dynamic ဖြစ်သွားပြီး static shell ရဲ့ အစိတ်အပိုင်းအနေနဲ့ prerender လုပ်လို့ မရတော့ပါဘူး။

အဲဒီအစား — promise ကို အောက်ကို ပို့ပြီး သုံးတဲ့ component က `<Suspense>` boundary တစ်ခုထဲမှာ ဖြေရှင်းပါစေ:

```tsx
import { Suspense } from 'react'
import { Nav } from './nav'
import { UserMenu } from './user-menu'
import { cookies } from 'next/headers'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies() // အလုပ်ကို စပါ၊ ဒါပေမယ့် await မလုပ်ပါနဲ့

  return (
    <div>
      <Nav>
        <Suspense fallback={<p>Loading user...</p>}>
          <UserMenu cookiePromise={cookieStore} />
        </Suspense>
      </Nav>
      {children}
    </div>
  )
}
```

ဒီဥပမာမှာ — layout ထဲမှာ ဘာမှ await မလုပ်လို့ `<Nav>` နဲ့ `{children}` တွေက static shell ရဲ့ အစိတ်အပိုင်းအနေနဲ့ render လုပ်ပါတယ်။ `<UserMenu>` ပဲ cookie promise ကို ဖြေရှင်းတဲ့အခါ suspend လုပ်ပါတယ်။ Layout က ထိပ်မှာ `await cookies()` လို့ ခေါ်ခဲ့မယ်ဆိုရင် — layout တစ်ခုလုံးနဲ့ သူ့ရဲ့ children တွေအားလုံး prerendering ကနေ ပိတ်ဆို့ခံရမှာပါ။

ဒီနိယာမက `params` နဲ့ `searchParams` တွေကိုလည်း သက်ရောက်ပါတယ်။ Page level မှာ destructure လုပ်မယ့်အစား — promise ကို value လိုအပ်တဲ့ component ဆီ ပို့ပါ:

```tsx
import { Suspense } from 'react'
import { Hero } from './hero'
import { ProductGrid } from './product-grid'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ category: c.slug }))
}

export default function ShopPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  return (
    <div>
      <Hero />
      <Suspense fallback={<p>Loading products...</p>}>
        <ProductGrid paramsPromise={params} />
      </Suspense>
    </div>
  )
}
```

`<Hero />` က static shell ရဲ့ အစိတ်အပိုင်းအနေနဲ့ ပေါ်လာပါတယ်။ `<ProductGrid>` က category လိုအပ်တဲ့အခါမှ `params` ကို ဖြေရှင်းပြီး — သူ့ boundary ထဲမှာပဲ suspend လုပ်ပါတယ်။

Promise ကို `.then()` နဲ့ inline မှာလည်း ဖြေရှင်းလို့ရပြီး — child component က promise အစား plain value တစ်ခုကို လက်ခံရရှိပါတယ်:

```tsx
<Suspense fallback={<p>Loading products...</p>}>
  {params.then(({ category }) => (
    <ProductGrid category={category} />
  ))}
</Suspense>
```

ဒါက `ProductGrid` ကို ရိုးရှင်းအောင် ထားပေးပြီး (သူက `Promise` မဟုတ်ဘဲ `string` တစ်ခုကို လက်ခံပါတယ်) — `params` access ကို Suspense boundary အတွင်းမှာပဲ ရွှေ့ဆိုင်းထားပါတယ်။

### `loading.js` vs `<Suspense>` — ဘယ်အခါ ဘာကို သုံးမလဲ

|                | `loading.js`                             | `<Suspense>`                     |
| -------------- | ---------------------------------------- | -------------------------------- |
| **Scope (နယ်ပယ်)**      | Page တစ်ခုလုံး                              | Component မရွေး                    |
| **Setup (ပြင်ဆင်မှု)**      | File တစ်ခု ထည့်လိုက်ရုံပါပဲ                           | Components တွေကို ရှင်းရှင်းလင်းလင်း wrap လုပ်ရပါတယ်       |
| **Navigation** | Instant fallback အဖြစ် prefetch လုပ်ပါတယ်           | Default အနေနဲ့ prefetch မလုပ်ပါဘူး        |
| **အကောင်းဆုံး အသုံး**   | Data မရှိရင် ဘာမှ render မလုပ်တဲ့ pages တွေ | Granular control လိုချင်တဲ့ pages အများစု |

Dynamic access နဲ့ နီးကပ်တဲ့ နေရာမှာ ရှင်းရှင်းလင်းလင်း `<Suspense>` boundaries တွေကို သုံးပါ။ Prerenderer က dynamic အလုပ်တစ်ခုကို တွေ့တဲ့အခါ — အနီးဆုံး Suspense boundary ကို ရှာပြီး tree ပေါ် တက်လာပါတယ်။ ဘာမှ မတွေ့ရင် — build က [blocking route error](/docs/nextjs/blocking-prerender-dynamic) နဲ့ ကျရှုံးပါတယ်။ Tree ရဲ့ မြင့်တဲ့နေရာမှာ `loading.js` တစ်ခု ရှိနေရင် ဒါက boundary အဖြစ် အသုံးဝင်လို့ framework က ဒါကို တွေ့ပြီး ရပ်ပါတယ် — ဒါပေမယ့် အခုဆို page တစ်ခုလုံးက granular အနေနဲ့ stream လုပ်မယ့်အစား page တစ်ခုလုံးအတွက် skeleton တစ်ခုဆီ fallback ဖြစ်သွားပါတယ်။

### Stream အလယ်မှာ error ကိုင်တွယ်ခြင်း

Streaming စတင်ပြီးနောက် component တစ်ခုက error တစ်ခု throw လုပ်ရင် — အနီးဆုံး [`error.js`](/docs/nextjs/error) boundary က ဒါကို ဖမ်းပြီး — ကျရှုံးသွားတဲ့ component နေရာမှာ error UI ကို render လုပ်ပါတယ်။ Page ရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းတွေက မပျက်မစီး ရှိနေပြီး — error ဖြစ်တဲ့ section တစ်ခုတည်းကိုပဲ အစားထိုးပါတယ်။

HTTP status code (`200 OK`) က ပထမဆုံး chunk နဲ့အတူ ပို့ပြီးသွားလို့ — ဒါကို `4xx` (သို့) `5xx` အဖြစ် ပြောင်းလို့ မရတော့ပါဘူး။ Error ကို stream လုပ်ထားတဲ့ HTML ထဲမှာပဲ အပြည့်အဝ ကိုင်တွယ်ပါတယ်။ ဒီ constraint အကြောင်း အသေးစိတ်အတွက် [HTTP contract](#the-http-contract) ကို ကြည့်ပါ။

## Client ဆီကို data streaming လုပ်ခြင်း

[Server Component](/docs/nextjs/glossary#server-component) တစ်ခုထဲမှာ fetch တစ်ခု စတင်ပြီး — မဖြေရှင်းရသေးတဲ့ promise ကို prop အနေနဲ့ [Client Component](/docs/nextjs/glossary#client-component) တစ်ခုဆီ ပို့နိုင်ပါတယ်။ Promise ကို အလွှာဘယ်လောက်ပဲ ရှိ ဖြတ်သွားလို့ ရပါတယ်။ Value ကို ဖတ်ဖို့ React ရဲ့ [`use`](https://react.dev/reference/react/use) API ကို ခေါ်တဲ့ component တစ်ခုတည်းကိုပဲ သူ့ပတ်လည်မှာ `<Suspense>` boundary တစ်ခု လိုပါတယ်:

```tsx
import { Suspense } from 'react'
import { StatsChart } from './stats-chart'

type Stats = { revenue: number; orders: number }

async function getStats(): Promise<Stats> {
  const res = await fetch('https://api.example.com/stats')
  return res.json()
}

export default function Dashboard() {
  // Server render ကာလအတွင်း fetch ကို စတင်ပါ၊ await မလုပ်ပါနဲ့
  const statsPromise = getStats()

  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <StatsChart dataPromise={statsPromise} />
    </Suspense>
  )
}
```

```tsx
'use client'

import { use } from 'react'

type Stats = { revenue: number; orders: number }

export function StatsChart({ dataPromise }: { dataPromise: Promise<Stats> }) {
  const stats = use(dataPromise)

  return <div>{/* chart ကို stats တွေနဲ့ render လုပ်ပါ */}</div>
}
```

Fallback ကို static shell နဲ့အတူ ချက်ချင်း ပို့ပေးပါတယ်။ Promise ဖြေရှင်းပြီးတာနဲ့ — React က ပြီးစီးသွားတဲ့ HTML ကို page ထဲ stream လုပ်ပါတယ်။

### Promise တစ်ခုကို tree တစ်ခုလုံးမှာ share လုပ်ခြင်း

Components အများအပြားက data တစ်ခုတည်း လိုအပ်တဲ့အခါ — fetch ကို တစ်ခါတည်း စတင်ပြီး — subtree ထဲက component မဆို `use()` နဲ့ ဖြေရှင်းနိုင်အောင် context provider တစ်ခုကနေ promise ကို ဖြတ်ပို့ပါ:

```tsx
import { getUser } from '@/lib/data'
// Subtree အတွက် promise ကို React context ထဲမှာ သိမ်းဆည်းပါတယ်
import { UserProvider } from './user-provider'

export default function Layout({ children }: { children: React.ReactNode }) {
  const userPromise = getUser()

  return <UserProvider userPromise={userPromise}>{children}</UserProvider>
}
```

ပုံစံအပြည့်အစုံအတွက် [React ရဲ့ `use` ကို Context Provider ထဲမှာ သုံးခြင်း](/docs/nextjs/single-page-applications#using-reacts-use-within-a-context-provider) ကို ကြည့်ပါ။

## Route Handlers တွေမှာ Streaming

အပေါ်က ပုံစံတွေက UI stream လုပ်ဖို့ React နဲ့ Suspense တွေကို အားကိုးပါတယ်။ React rendering ပြင်ပမှာ — [Route Handlers](/docs/nextjs/route-handlers) တွေက Web Streams API ကို သုံးပြီး raw responses တွေကို stream လုပ်နိုင်ပါတယ်။ Server-Sent Events, large file generation (သို့) data ကို တဖြည်းဖြည်း ရောက်စေချင်တဲ့ response မဆိုအတွက် ဒါက အသုံးဝင်ပါတယ်:

```ts
export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(`Chunk ${i + 1}\n`))
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
```

ဒီ route ကို browser မှာ တိုက်ရိုက် (သို့) `curl` နဲ့ ဝင်ကြည့်ပါ — chunks တွေ တစ်ခုပြီးတစ်ခု ရောက်လာတာကို မြင်ရပါမယ်:

```bash
curl http://localhost:3000/api/stream
```

Files တွေကို memory ထဲ အပြည့်အဝ မတင်ဘဲလည်း stream လုပ်နိုင်ပါတယ်။ File တစ်ခုကနေ Web `ReadableStream` တစ်ခုကို တိုက်ရိုက်ရဖို့ `FileHandle.readableWebStream()` ကို သုံးပါ:

```ts
import { open } from 'node:fs/promises'

export async function GET() {
  const file = await open('/path/to/large-file.csv')

  return new Response(file.readableWebStream(), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="data.csv"',
    },
  })
}
```

Streaming endpoints တွေ တည်ဆောက်ခြင်းအကြောင်း အသေးစိတ်အတွက် [Route Handler API reference](/docs/nextjs/route-handlers) ကို ကြည့်ပါ။

## Streaming နဲ့ Web Vitals

[Web Vitals](https://web.dev/articles/vitals) တွေက Google က user experience ကို တိုင်းတာဖို့ သုံးတဲ့ metrics တွေပါ။ Streaming က ဒီထဲက အများအပြားကို တိုက်ရိုက် သက်ရောက်ပါတယ်။

### TTFB နဲ့ FCP

Streaming မရှိရင် — server က data အားလုံးကို မရခင်အထိ HTML မပို့ဘဲ စောင့်လို့ — TTFB က အနှေးဆုံး query ရဲ့ အချိန်နဲ့ ညီပါတယ်။ Streaming နဲ့ဆိုရင် — server က static shell ကို အသင့်ဖြစ်တာနဲ့ ပို့လို့ TTFB က သင့် layouts နဲ့ fallbacks တွေ render လုပ်ဖို့လိုတဲ့ အချိန်အထိ ကျဆင်းသွားပါတယ်။ Browser က static shell ကို ချက်ချင်း ပန်းချီဆွဲလို့ — FCP က သင့် data fetching အချိန်ကနေ သီးခြား ဖြစ်သွားပါတယ်။

### LCP (Largest Contentful Paint)

သင့် LCP element (hero image, main heading, product photo) က Suspense boundary တစ်ခုထဲမှာ ရှိနေရင် — အဲဒီ boundary ရဲ့ content swap လုပ်မချင်း ပန်းချီဆွဲလို့ မရပါဘူး။ အဲဒီအခါ element က သင့် ကနဦး server response အချိန်ပေါ်မှာ မမူတည်ဘဲ — server က ဒါကို render လုပ်ဖို့ လုပ်တဲ့ အလုပ်ပေါ်မှာ မှီခိုပါတယ်။ Client ပေါ်မှာလည်း စရိတ်ရှိပါတယ် — React က boundary ရဲ့ HTML နဲ့အတူ inline script သေးသေးလေးတစ်ခုကို stream လုပ်ပြီး — အဲဒီ script run မှပဲ content ပေါ်လို့ပါ။

Data fetching တစ်ခုတည်းကပဲ သင့် LCP element ကို boundary က နှောင့်နှေးစေတာ မဟုတ်ပါဘူး။ React က boundary အကြီးကြီးတစ်ခုကိုလည်း ထိန်းထားပါတယ် — သူ့ရဲ့ HTML ပို့ဖို့ အချိန်ယူရလို့ပါ။ [Suspense boundary တစ်ခုကို ဘာတွေက activate လုပ်လဲ](https://react.dev/reference/react/Suspense#what-activates-a-suspense-boundary) ကို ကြည့်ပါ။

> **သိထားသင့်သည်** — စည်းမျဉ်းအကြမ်းအနေနဲ့ — Suspense boundary တစ်ခု ရှိနေရင် React က ဒါကို သုံးဖို့ ဖြစ်နိုင်ပါတယ်။ Network နှေးတာ (သို့) CPU မအားတဲ့အခါ — concurrent rendering က မမျှော်လင့်ထားတဲ့အခါမှာတောင် ဒါကို fallback အဖြစ် သုံးနိုင်ပါတယ်။ Boundary တစ်ခု ထည့်လိုက်တာက ဒါကို လက်ခံလိုက်တာပါ — ဒါကြောင့် မလိုအပ်တဲ့ boundary တစ်ခုကို မထည့်ပါနဲ့။

LCP ကို မြန်အောင် ထားဖို့:

- LCP elements တွေကို Suspense boundaries တွေရဲ့ **အပြင်** (သို့) **အပေါ်မှာ** ထားပါ — ဒါဆို static shell ရဲ့ အစိတ်အပိုင်းအနေနဲ့ render လုပ်ပါတယ်။
- LCP images တွေအတွက် `next/image` ပေါ်မှာ [`preload`](/docs/nextjs/image#preload) prop ကို သုံးပါ။ ဒါက `<head>` ထဲ `<link rel="preload">` တစ်ခုကို ထည့်ပေးလို့ — `<img>` tag က HTML ထဲမှာ မပေါ်ခင် ပထမဆုံး chunk ကတည်းက browser က image ကို စတင် fetch လုပ်ပါတယ်။ ဒါက image ကို ဘယ်အချိန် fetch လုပ်မလဲဆိုတာကို ထိန်းချုပ်ပြီး — ဘယ်အချိန် ပန်းချီဆွဲမလဲဆိုတာ မဟုတ်ပါဘူး။ Boundary ထဲက image တစ်ခုက swap ဖြစ်တာကို ဆက်စောင့်ရပါတယ်။
- Image မဟုတ်တဲ့ LCP elements တွေအတွက် (text, headings) — Suspense boundaries တွေရဲ့ အပြင်မှာ render လုပ်ပါ။

### CLS (Cumulative Layout Shift)

Suspense fallback တစ်ခုကို ဖြေရှင်းပြီးသား content နဲ့ အစားထိုးတဲ့အခါ — browser က page ကို reflow လုပ်ပါတယ်။ Fallback နဲ့ ဖြေရှင်းပြီးသား content တွေရဲ့ အရွယ်အစား မတူညီရင် — ပတ်လည်က layout က ရွေ့ပြောင်းပါတယ်။ CLS ကို အနည်းဆုံး ဖြစ်အောင်:

- သူတို့ ကိုယ်စားပြုတဲ့ content ရဲ့ **အတိုင်းအတာတွေနဲ့ ကိုက်ညီတဲ့** skeleton fallbacks တွေကို ဒီဇိုင်းလုပ်ပါ။ နောက်ဆုံး card grid ရဲ့ height နဲ့ width အတိုင်းပဲ ရှိတဲ့ skeleton တစ်ခုက shifts တွေကို ကာကွယ်ပေးပါတယ်။
- Suspense boundaries တွေပတ်လည်မှာ fixed (သို့) min-height containers တွေ သုံးပြီး — content မရောက်ခင် space ကို ကြိုတင် ထားပါ။

### INP (Interaction to Next Paint)

Streaming က [selective hydration](https://react.dev/reference/react-dom/client/hydrateRoot) ကို enable လုပ်ပေးပါတယ်: React က components တွေကို stream လုပ်ဝင်လာတာနဲ့အမျှ သီးခြားစီ hydrate လုပ်ပြီး — user က ထိတွေ့နေတဲ့အရာကို ဦးစားပေး hydrate လုပ်ပါတယ်။ `<Suspense>` boundary တစ်ခုချင်းစီက hydration unit တစ်ခုပါ။ ဒါတွေ မရှိရင် — React က page တစ်ခုလုံးကို blocking pass တစ်ခုတည်းနဲ့ hydrate လုပ်ပါတယ်။ ရှိနေရင်တော့ — hydration က browser ကို yield လုပ်ပေးတဲ့ အလုပ်ငယ်တွေအဖြစ် ခွဲလိုက်လို့ main thread က တုံ့ပြန်မှု ရှိနေပါတယ်။ [တွဲဖက် demo](https://streaming-demo.labs.vercel.dev/hydration-single) က blocking hydration pass တစ်ခုတည်းကို — Suspense boundaries တွေနဲ့ [split hydration](https://streaming-demo.labs.vercel.dev/hydration-split) နဲ့ နှိုင်းယှဉ်ကြည့်နိုင်စေပါတယ်။

### Resource တွေကို စောစော ရှာဖွေတွေ့ရှိခြင်း

Static shell မှာ `<link>` နဲ့ `<script>` tags တွေက ပထမဆုံး HTML chunk ထဲမှာပဲ ပါဝင်ပါတယ်။ Server က content တွေ ထုတ်လုပ်နေချိန်မှာပဲ — browser က CSS, JavaScript နဲ့ fonts တွေကို ချက်ချင်း ရှာဖွေပြီး fetch လုပ်ပါတယ်။ Resources တွေကို server ရဲ့ စဉ်းစားချိန် (think time) ပြီးမှ မဟုတ်ဘဲ — အတွင်းမှာပဲ fetch လုပ်ပါတယ်။

အပေါ်က [dashboard ဥပမာ](#parallel-streaming-with-sibling-boundaries) မှာ — `<h1>` က shell ထဲမှာ render လုပ်ပြီး (LCP အတွက် ကောင်းပါတယ်) — data section တစ်ခုချင်းစီက ကိုယ်ပိုင် Suspense boundary နောက်မှာ သီးခြားစီ stream လုပ်ပြီး (hydration က split ဖြစ်လို့ INP အတွက် ကောင်းပါတယ်) — skeleton fallbacks တွေက space တွေကို ကြိုတင် ထားပေးပါတယ် (CLS အတွက် ကောင်းပါတယ်)။

## HTTP contract

Streaming စတင်တာနဲ့ — HTTP response headers တွေ (status code အပါအဝင်) က client ဆီ ပို့ပြီးသွားပါပြီ။ **Streaming စတင်ပြီးနောက် status code (သို့) headers တွေကို ပြောင်းလို့ မရတော့ပါဘူး။** ဒီ section ထဲက အရာအားလုံးက ဒီအခြေခံကျတဲ့ constraint ကနေ ဆင်းသက်လာတာပါ။

### Status codes များ

`<Suspense>` fallback တစ်ခု render လုပ်တဲ့အခါ (သို့) component တစ်ခု suspend လုပ်တဲ့အခါ — server က HTML stream စတင်ပို့ဖို့ `200 OK` ကို ကတိပြုရပါတယ်။ [`notFound()`](/docs/nextjs/not-found) တစ်ခုက stream အလယ်မှာ fire လုပ်ရင် — Next.js က နောက်ကြောင်းပြန်ပြီး status ကို 404 အဖြစ် ပြောင်းလို့ မရပါဘူး။ အဲဒီအစား — search engines တွေက page ကို index မလုပ်အောင် stream လုပ်ထားတဲ့ HTML ထဲ `<meta name="robots" content="noindex">` ကို ထည့်ပေးပါတယ်။ အလားတူပဲ — stream အလယ်မှာ [`redirect()`](/docs/nextjs/redirect) တစ်ခုက HTTP redirect header မဟုတ်ဘဲ client-side redirect ဖြစ်သွားပါတယ်။

### Streaming က ဘယ်အချိန်မှာ စတင်လဲ

Response body က — Suspense fallback တစ်ခု render လုပ်တဲ့အခါ (ဥပမာ `loading.tsx`) (သို့) component တစ်ခု `<Suspense>` boundary အောက်မှာ suspend လုပ်တဲ့အခါ stream စတင်ပါတယ်။ Errors တွေအတွက် HTTP status code အစစ် ရဖို့ — `notFound()` ကို `await` (သို့) `<Suspense>` boundary တစ်ခုရဲ့ **အရင်** နေရာချပါ:

```tsx
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PostContent } from './post-content'

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const exists = await checkSlugExists(slug) // မြန်မြန်ဆန်ဆန် ရှိမရှိ စစ်ဆေးခြင်း
  if (!exists) notFound() // Suspense boundary မရှိခင် တကယ့် 404

  return (
    <Suspense fallback={<p>Loading post...</p>}>
      <PostContent slug={slug} />
    </Suspense>
  )
}
```

> **သိထားသင့်သည်** — Requests တွေကို စောစော reject လုပ်ဖို့ [`proxy`](/docs/nextjs/proxy) (redirects, rewrites (သို့) response တစ်ခု ပြန်ပို့ဖို့) (သို့) [`next.config.js` redirects](/docs/nextjs/redirects) တွေကိုလည်း သုံးနိုင်ပါတယ်။ နှစ်ခုလုံးက page render မလုပ်ခင် run လုပ်လို့ — HTTP status codes တွေ ရနေဆဲပါ။

### Bots နဲ့ crawlers တွေ

HTML-only bots နဲ့ crawlers တွေက ကနဦး HTML ရဲ့ `<head>` ထဲမှာ metadata ရှိဖို့ လိုပါတယ်။ Next.js က သူတို့ရဲ့ user agent နဲ့ ခွဲခြားပြီး — page content ကို stream မလုပ်ခင် [`generateMetadata`](/docs/nextjs/generate-metadata) ဖြေရှင်းတာကို စောင့်ပါတယ်။ Full browsers နဲ့ DOM-capable crawlers တွေကတော့ page content နဲ့အတူ [streaming metadata](/docs/nextjs/generate-metadata#streaming-metadata) ကို ရရှိနိုင်ပါတယ်။

ဘယ် bots တွေက blocking metadata ရမလဲဆိုတာကို [`htmlLimitedBots`](/docs/nextjs/htmlLimitedBots) configuration option နဲ့ စိတ်ကြိုက် ပြောင်းလဲနိုင်ပါတယ်။ အသေးစိတ်အတွက် [`loading.js` SEO section](/docs/nextjs/loading#seo) ကို ကြည့်ပါ။

#### Cache Components

[Cache Components](/docs/nextjs/caching) နဲ့ဆိုရင် — visitors နဲ့ DOM-capable crawlers တွေက prerendered shell ကို ချက်ချင်း ရရှိပြီး — dynamic content တွေက ဖြေရှင်းတာနဲ့အမျှ stream လုပ်ဝင်ပါတယ်။ HTML-limited bots တွေကတော့ prerendered shell ကို ကျော်ပြီး — metadata ကို `<head>` ထဲမှာ ထားနိုင်အောင် page ကို dynamic အနေနဲ့ render လုပ်ပါတယ်။ Metadata ဖြေရှင်းပြီးတာနဲ့ — ကျန်တဲ့ page content တွေက ဆက်ပြီး stream လုပ်နိုင်ပါတယ်။

သင့် prerendered shell က prerendering ကာလအတွင်းမှာပဲ ရှိတဲ့ inputs တွေပေါ် မှီခိုနေရင် — build-time data (သို့) request-time environment မှာ မရနိုင်တဲ့ values တွေလိုမျိုး — ဒါကို သတိထားပါ။ Visitors နဲ့ DOM-capable crawlers တွေက အဲဒီ code ကို ပြန်မလည်ပတ်ဘဲ shell ကို ရရှိပြီး — HTML-limited bot တစ်ခုကတော့ ဒါကို dynamic အနေနဲ့ ပြန် render လုပ်လို့ — လူတစ်ယောက်အတွက် load ဖြစ်တဲ့ page တစ်ခုက crawler တစ်ခုအတွက်တော့ render မဖြစ်နိုင်ပါဘူး။ Shell မှီခိုနေတဲ့ data က request time မှာလည်း ရနိုင်အောင် သေချာလုပ်ပါ။

## Streaming ကို ဘာတွေက သက်ရောက်နိုင်လဲ

သင့် server နဲ့ client ကြားက layer မဆို — response ကို buffer လုပ်တယ်ဆိုရင် — streaming ရဲ့ အကျိုးကျေးဇူးတွေကို လျော့ပါးစေနိုင်ပါတယ်။ HTML က server ပေါ်မှာ progressive အနေနဲ့ အပြည့်အဝ ထုတ်လုပ်နေပေမယ့် — proxy, CDN (သို့) client ကိုယ်တိုင်က chunks အားလုံးကို render မလုပ်ခင် စုစည်းထားရင် — user က progressive rendering အစား နှောင့်နှေးတဲ့ response တစ်ခုတည်းကိုပဲ မြင်ရပါတယ်။

### Reverse proxies များ

Nginx နဲ့ အလားတူ reverse proxies တွေက responses တွေကို default အနေနဲ့ buffer လုပ်ပါတယ်။ `X-Accel-Buffering` header ကို `no` အဖြစ် သတ်မှတ်ပြီး buffering ကို disable လုပ်ပါ:

```js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ]
  },
}
```

### CDNs များ

Content Delivery Networks တွေက client ဆီ မပို့ခင် responses တစ်ခုလုံးကို buffer လုပ်နိုင်ပါတယ်။ Streaming support အတွက် သင့် CDN provider ရဲ့ documentation ကို စစ်ဆေးပါ။ အချို့က chunked responses တွေ ဖြတ်သွားဖို့ — specific configuration (သို့) plan tiers တွေ လိုအပ်ပါတယ်။

### Serverless platforms များ

Serverless environments တိုင်းက streaming ကို support မလုပ်ပါဘူး။ AWS Lambda က ဥပမာ — [response streaming mode](https://docs.aws.amazon.com/lambda/latest/dg/configuration-response-streaming.html) ကို ရှင်းရှင်းလင်းလင်း enable လုပ်ဖို့ လိုပါတယ် (default မဟုတ်ပါဘူး)။ Vercel ကတော့ streaming ကို native အနေနဲ့ support လုပ်ပါတယ်။

### Compression (ဖိချုံ့ခြင်း)

Gzip နဲ့ Brotli compression တွေက — compression algorithm က ထိရောက်စွာ ဖိချုံ့ဖို့ data အလုံအလောက် လိုလို့ — flush မလုပ်ခင် chunks တွေကို အတွင်းပိုင်းမှာ buffer လုပ်နိုင်ပါတယ်။ ဒါက ပထမဆုံး မြင်ရတဲ့ chunk ဆီ latency ထည့်ပေးနိုင်ပါတယ်။ Streaming နှောင့်နှေးမှုတွေ သတိထားမိရင် — သင့် compression layer က လုံလောက်အောင် ပြင်းပြင်းထန်ထန် flush လုပ်မလုပ်ဆိုတာ စစ်ဆေးပါ။

### Clients များ

Buffering က client ပေါ်မှာလည်း ဖြစ်ပါတယ်။ [Safari/WebKit](https://bugs.webkit.org/show_bug.cgi?id=252413) က bytes 1024 ရောက်တဲ့အထိ streaming responses တွေကို buffer လုပ်ပြီး — response သေးသေးလေးတွေက progressive အစား တစ်ခါတည်း ပေါ်လာပါတယ်။ Real applications တွေက ဒီ threshold ကို လွယ်လွယ်နဲ့ ကျော်လွန်လို့ (layouts, styles, scripts) — ဒါက minimal demos (သို့) Route Handler response သေးသေးလေးတွေကိုပဲ သက်ရောက်ပါတယ်။

`curl` လို command-line tools တွေကလည်း default အနေနဲ့ buffer လုပ်ပါတယ်။ `-N` flag က output buffering ကို disable လုပ်ပေးပေမယ့် — `curl` က terminal ဆီ lines တွေ flush လုပ်ဖို့ newline characters တွေကို ဆက်ပြီး အားကိုးပါတယ်။ Newlines မပါတဲ့ chunks တွေ ပို့တဲ့ stream တစ်ခုက `-N` သုံးထားတာတောင် ရပ်နေသလို ပေါ်နိုင်ပါတယ်။

### Streaming အလုပ်လုပ်ကြောင်း စစ်ဆေးခြင်း

ဒီ section က HTTP response က သင့် infrastructure ကနေ တကယ်ပဲ chunks အနေနဲ့ ရောက်လား ဆိုတာကို အတည်ပြုဖို့ပါ။ အဓိပ္ပာယ်ရှိတဲ့ loading states တွေ ဒီဇိုင်းလုပ်ခြင်းနဲ့ Suspense boundaries တွေကို ထိရောက်စွာ နေရာချခြင်းအတွက် — [`<Suspense>` နဲ့ Granular streaming](#granular-streaming-with-suspense) နဲ့ [Cache Components](/docs/nextjs/caching) guide ကို ကြည့်ပါ။

**Network tab ကို စစ်ဆေးပါ။** Chrome DevTools ထဲမှာ — document request ကို ရွေးပြီး "Timing" breakdown ကို ကြည့်ပါ။ "Content Download" phase ရှည်နေပြီး "Time to First Byte" စောနေရင် — response က တစ်ခါတည်း မဟုတ်ဘဲ stream လုပ်နေတယ်လို့ အတည်ပြုပါတယ်။

**Raw chunks တွေကို ကြည့်ပါ။** Server က ဘာကို ဘယ်အချိန် ပို့လဲဆိုတာ အတိအကျ မြင်ဖို့ — response ကို stream အနေနဲ့ ဖတ်တဲ့ script သေးသေးလေးတစ်ခု သုံးပါ။ `curl` မှာ ကိုယ်ပိုင် buffering အပြုအမူ ရှိလို့ — timed chunks တွေ ကြည့်ဖို့ `curl` ထက် ဒါက ပိုစိတ်ချရပါတယ်:

```js
const res = await fetch(
  'https://streaming-demo.labs.vercel.dev/suspense-demo',
  {
    headers: { 'Accept-Encoding': 'identity' },
  }
)

const reader = res.body.getReader()
const decoder = new TextDecoder()
let i = 0
const start = Date.now()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  console.log(`\nchunk ${i++} (+${Date.now() - start}ms)\n`)
  console.log(decoder.decode(value))
}
```

`node stream-observer.mjs` နဲ့ run လုပ်ပါ။ Sibling Suspense boundaries နှစ်ခု ပါတဲ့ page တစ်ခုအတွက် ([တွဲဖက် demo ရဲ့ Suspense page](https://streaming-demo.labs.vercel.dev/suspense-demo) လိုမျိုး) — အောက်ပါအတိုင်း output တွေ မြင်ရပါမယ်:

```text
chunk 0 (+0ms)    # Static shell: <head>, CSS, nav, fallback skeletons,
                  # <template id="B:0"> နဲ့ <template id="B:1"> placeholders,
                  # bootstrap scripts
chunk 1 (+170ms)  # Hydration အတွက် component payload (self.__next_f.push)
chunk 2 (+1000ms) # Weather widget: payload + <div hidden id="S:0"> (B:0 ကို swap လုပ်တယ်)
chunk 3 (+3000ms) # Analytics dashboard: payload + <div hidden id="S:1"> (B:1 ကို swap လုပ်တယ်)
```

`<template id="B:0">` markers တွေက Suspense fallback placeholders တွေပါ။ Boundary တစ်ခု ဖြေရှင်းတဲ့အခါ — React က ပြီးစီးသွားတဲ့ HTML ပါတဲ့ `<div hidden id="S:0">` တစ်ခုနဲ့ ဒါကို page ထဲ swap လုပ်တဲ့ script တစ်ခုကို stream လုပ်ပါတယ်။ Timestamps တွေက boundary တစ်ခုချင်းစီ သီးခြားစီ ဖြေရှင်းတာကို ပြပါတယ်။

> **သိထားသင့်သည်** — `Accept-Encoding: identity` header က compression ကို disable လုပ်လို့ — chunks တွေက compression layer ကနေ buffer လုပ်ခံရမှာ မဟုတ်ပါဘူး။

**Bot request တစ်ခုနဲ့ နှိုင်းယှဉ်ပါ။** တူညီတဲ့ script မှာ bot user agent တစ်ခု ထည့်ပါ — `headers: { 'User-Agent': 'Twitterbot/1.0', 'Accept-Encoding': 'identity' }` လိုမျိုး။ အခုဆို `await fetch()` ကိုယ်တိုင်က full render ပြီးတဲ့အထိ ပိတ်ဆို့ထားပါတယ် (ဒီ page အတွက် 3 စက္ကန့်လောက်) — ဘာလို့လဲဆိုတော့ server က ပြီးစီးတဲ့ document ရတဲ့အထိ response ကို ထိန်းထားလို့ပါ။ Body က ပြီးတော့ တစ်ခါတည်း ရောက်လာပြီး — နှောင့်နှေးနေတဲ့ `+1000ms` / `+3000ms` timestamps တွေ လုံးဝ မရှိပါဘူး:

```text
chunk 0 (+0ms) # fetch() က စောင့်ပြီးသားမို့ document တစ်ခုလုံး burst တစ်ခုတည်းနဲ့ ရောက်လာတယ်
```

ဒါက [bots နဲ့ crawlers](#bots-and-crawlers) အပြုအမူပါ: server က full render ကို စောင့်ပြီး — streaming မလုပ်ဘဲ HTML document အပြည့်အစုံ တစ်ခုတည်း ပို့ပေးပါတယ်။

### Platform support

| Deployment Option                                                   | Supported         |
| ------------------------------------------------------------------- | ----------------- |
| [Node.js server](/docs/nextjs/deploying#nodejs-server) | Yes               |
| [Docker container](/docs/nextjs/deploying#docker)      | Yes               |
| [Static export](/docs/nextjs/deploying#static-export)  | No                |
| [Adapters](/docs/nextjs/deploying#adapters)            | Platform-specific |

အသေးစိတ် configuration ညွှန်ကြားချက်တွေအတွက် [Self-Hosting guide](/docs/nextjs/self-hosting#streaming-and-suspense) ကို ကြည့်ပါ။

## အကျဉ်းချုပ်

Trigger က **သင့် code** ပါ: async အလုပ်, non-deterministic output (သို့) runtime data တွေပါ။ Framework က ဒါတွေကို တွေ့တဲ့အခါ — fallback အဖြစ် သုံးဖို့ `<Suspense>` boundary တစ်ခုကို ရှာပြီး tree ပေါ် တက်လာပါတယ်။ အဲဒီ boundaries တွေရဲ့ အပေါ်က အရာအားလုံးက [static shell](#the-static-shell) ကို ဖွဲ့စည်းပြီး — ချက်ချင်း ပို့ပေးပါတယ်။ Boundary တစ်ခုချင်းစီ ဖြေရှင်းတာနဲ့ — React က ရလဒ်ကို page ထဲ stream လုပ်ပါတယ်။

အဓိက ဆုံးဖြတ်ချက်တွေက **ဘာကို cache လုပ်မလဲ** နဲ့ **Suspense boundaries တွေကို ဘယ်မှာ ထားမလဲ** ဆိုတာပါ။ Static shell ကို ကြီးထွားစေဖို့ သင်တတ်နိုင်သလောက် [`"use cache"`](/docs/nextjs/use-cache) နဲ့ cache လုပ်ပါ။ Dynamic access တွေကို လိုအပ်တဲ့ components တွေဆီ ရွှေ့ပြီး — ဒါတွေကို `<Suspense>` ထဲ wrap လုပ်ပါ။ ကျန်တာအားလုံးက shell ရဲ့ အစိတ်အပိုင်း ဖြစ်သွားပါတယ်။

## ထပ်ဆင့် ဖတ်ရှုရန်

- [RSC Explorer](https://rscexplorer.dev/) — component payload format ကို စူးစမ်းပြီး React က streamed chunks တွေကနေ tree ကို ဘယ်လို ပြန်တည်ဆောက်လဲ ကြည့်ဖို့ interactive tool တစ်ခု
- [Streams API on web.dev](https://web.dev/articles/streams) — Route Handlers တွေမှာ streaming ကို အခြေခံတဲ့ Web Streams API ရဲ့ မိတ်ဆက်
- [Chunked transfer encoding (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding) — streaming responses တွေကို enable လုပ်တဲ့ HTTP/1.1 mechanism
- [browser.engineering](https://browser.engineering/) — browsers တွေက network responses, rendering နဲ့ progressive display တွေကို ဘယ်လို ကိုင်တွယ်လဲဆိုတဲ့ နက်ရှိုင်းတဲ့ လေ့လာမှု
- [Hydration မတိုင်ခင် flash ကာကွယ်ခြင်း](/docs/nextjs/preventing-flash-before-hydration) — browser မပန်းချီဆွဲခင် client-specific values တွေ (locale, theme, persisted state) နဲ့ server-rendered HTML ကို ဘယ်လို update လုပ်မလဲ
