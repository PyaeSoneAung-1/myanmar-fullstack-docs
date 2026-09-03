---
title: "Cache Components နဲ့ Incremental Static Regeneration (ISR)"
description: "Cache Components နဲ့ ISR — generateStaticParams နဲ့ စာရင်းပြုစုထားတဲ့ dynamic routes တစ်ချို့ကို prerender လုပ်ပြီး ကျန်တဲ့ URLs တွေအတွက် App Shell တွေ ပေးဝေကာ ပထမဆုံး visit အပြီးမှာ upgrade လုပ်နည်း — Partial Prefetching, Suspense boundaries, build time/runtime အပြုအမူ နဲ့ Pages Router ကနေ ပြောင်းရွှေ့လာသူများအတွက်"
order: 184
source: "https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components"
status: translated
updated: 2026-09-03
---

[`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) နဲ့ [Partial Prefetching](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) တို့နဲ့ တွဲသုံးထားတဲ့ [Incremental Static Regeneration (ISR)](https://nextjs.org/docs/app/glossary#incremental-static-regeneration-isr) က — build ထဲမှာ မပါဝင်ခဲ့တဲ့ URLs တွေအတွက်တောင် route တိုင်းရဲ့ ပထမဆုံး visit ကို ချက်ချင်း (instant) ဖြစ်စေပါတယ်။

Build ကာလအတွင်းမှာ Partial Prerendering က render တစ်ခုစီကို အပိုင်းနှစ်ပိုင်း ခွဲပါတယ်:

- **App Shell** — URL data ပေါ်မှာ မမှီခိုတဲ့ page ရဲ့ generic, ပြန်သုံးလို့ရတဲ့ အပိုင်း
- ကျန်တဲ့ statically render လုပ်လို့ရတဲ့ content — [`generateStaticParams`](/docs/nextjs/generate-static-params) ထဲမှာ သင်စာရင်းပြုစုထားတဲ့ URLs တွေအတွက် param-specific prerenders

`generateStaticParams` ထဲမှာ params တွေ ပါဝင်ခဲ့တဲ့ URL တစ်ခုကို visit လုပ်တဲ့အခါ — Next.js က အပြည့်အဝ prerender လုပ်ထားတဲ့ page ကို cache ကနေ ပေးပါတယ်။ Params တွေ မပါဝင်ခဲ့တဲ့ URL တစ်ခုကို visit လုပ်တဲ့အခါ — Next.js က App Shell ကို ချက်ချင်း ပေးပြီး အခု သိပြီဖြစ်တဲ့ params တွေနဲ့ နောက်ခံမှာ upgrade လုပ်ပါတယ်။ အဲဒီ URL ကို နောက်ထပ် visit တွေကတော့ cache ကနေ upgrade လုပ်ပြီးသား ရလဒ်ကို ရရှိပြီး — App Shell ကို လုံးဝ ကျော်သွားပါတယ်။

Pages Router မှာ [ISR](/docs/nextjs/incremental-static-regeneration) (သို့) [`fallback: true`](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-true) ကို သုံးဖူးတယ်ဆိုရင် — ဒါက Cache Components နဲ့ ညီမျှတဲ့အရာပါ။

[`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ရော [Partial Prefetching](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) ရော နှစ်ခုလုံးကို enable လုပ်ပါ။ Cache Components က App Shell ကို ထုတ်လုပ်ပေးပြီး — Partial Prefetching က params တွေ သိလာတာနဲ့ အဲဒါကို route အပြည့်အစုံဆီ upgrade လုပ်ပေးပါတယ်။

```ts filename="next.config.ts" highlight={4-5}
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
```

## ဥပမာ (Example)

[Recipe API](https://next-recipe-api.vercel.dev/) ကို သုံးပြီး category layouts တွေနဲ့ product detail pages တွေပါတဲ့ product catalog တစ်ခုကို တည်ဆောက်ကြည့်ပါမယ်။ ဒီဥပမာထဲမှာ သုံးထားတဲ့ resources တွေကို ဒီနေရာတွေမှာ ရှာနိုင်ပါတယ်:

- [Demo](https://partial-fallbacks.labs.vercel.dev/)
- [Code](https://github.com/vercel-labs/partial-fallbacks)

### Routes တွေကို ပြင်ဆင်ခြင်း (Prepare your routes)

ဘယ် param values တွေကို prerender လုပ်မလဲ သတ်မှတ်ဖို့ [`generateStaticParams`](/docs/nextjs/generate-static-params) ကို သုံးပါ။ ဒီ routes တွေကို render လုပ်တဲ့အခါ param values တွေက build time မှာ သိပြီးသား ဖြစ်ပါတယ်။ Prerender လုပ်ငန်းစဉ်က runtime APIs (သို့) uncached data တွေကို မထိမချင်း static shell တစ်ခုကို တည်ဆောက်ပါတယ်။ အသေးစိတ်အတွက် [Prerendering](/docs/nextjs/caching) ကို ကြည့်ပါ။

Category layout က category နှစ်ခုကို prerender လုပ်ပါတယ်:

```tsx filename="app/[category]/layout.tsx" highlight={5-8}
import Link from 'next/link'
import { Suspense } from 'react'
import { getCategory, getTopCategories } from '../lib/data'

export async function generateStaticParams() {
  const categories = await getTopCategories()
  return categories.map((c) => ({ category: c.slug }))
}

async function CategoryHeader({
  params,
}: Pick<LayoutProps<'/[category]'>, 'params'>) {
  const { category } = await params
  const data = await getCategory(category)

  return (
    <div>
      <Link href="/">&larr; All categories</Link>
      <h1>{data?.name ?? 'Category'}</h1>
      {data?.description && <p>{data.description}</p>}
    </div>
  )
}

export default function CategoryLayout(props: LayoutProps<'/[category]'>) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryHeader params={props.params} />
      </Suspense>
      {props.children}
    </div>
  )
}
```

`CategoryLayout` က `props.params` ကို ကိုယ်တိုင် `await` မလုပ်ဘဲ — `<Suspense>` အတွင်းမှာ `CategoryHeader` ဆီ `params` promise ကို ပို့ထားတာကို သတိပြုပါ။ `await` က boundary အတွင်းမှာ ဖြစ်လို့ — category မသိတဲ့ (unknown) ကိစ္စတွေအတွက်တောင် Next.js က App Shell ကို generate လုပ်နိုင်ပါသေးတယ်။ `generateStaticParams` က ဖုံးအုပ်ထားတဲ့ categories တွေအတွက်တောင် — read ကို boundary အတွင်းမှာပဲ ထားပါ။ Statically သိပြီးသား param တစ်ခုက URL တစ်ခုတည်းနဲ့ပဲ သက်ဆိုင်လို့ — Suspense boundary ရဲ့ အထက်မှာ await လုပ်မိရင် ဒီ layout ရဲ့ App Shell က အဲဒီ URL နဲ့ တွဲညှိ (tie) သွားပါလိမ့်မယ်။ Routes တွေကို ဒီပုံစံအတိုင်း တည်ဆောက်ဖို့ [Instant navigation](https://nextjs.org/docs/app/guides/instant-navigation) ကို ကြည့်ပါ။

Product page က category တစ်ခုစီအတွက် product တစ်ခုကို prerender လုပ်ပါတယ်။ `generateStaticParams` က parent `category` param ကို လက်ခံရရှိပါတယ်:

```tsx filename="app/[category]/[product]/page.tsx" highlight={5-12}
import { Suspense } from 'react'
import Link from 'next/link'
import { getProduct, getPopularProducts } from '../../lib/data'

export async function generateStaticParams({
  params,
}: {
  params: { category: string }
}) {
  const products = await getPopularProducts(params.category)
  return products.map((p) => ({ product: p.slug }))
}

async function ProductDetails(props: PageProps<'/[category]/[product]'>) {
  const { category, product } = await props.params
  const data = await getProduct(category, product)

  if (!data) {
    return <p>Product not found.</p>
  }

  return (
    <>
      <Link href={`/${category}`}>&larr; Back to products</Link>
      <h2>{data.name}</h2>
      <p>${data.price}</p>
      <p>{data.description}</p>
    </>
  )
}

export default function ProductPage(props: PageProps<'/[category]/[product]'>) {
  return (
    <div>
      <Suspense fallback={<div>Loading product...</div>}>
        <ProductDetails {...props} />
      </Suspense>
    </div>
  )
}
```

> **သိထားသင့်သည်:** JSX ထဲက `<Suspense>` အစား [`loading.tsx`](/docs/nextjs/file-conventions-loading) files တွေကိုလည်း သုံးနိုင်ပါတယ်။ `loading.tsx` က boundary ကို segment ရဲ့ အစွန်းမှာ ချပေးပြီး — inline `<Suspense>` ကတော့ tree ထဲက ဘယ်နေရာမှာမဆို ချထားနိုင်ပါတယ်။

Data helpers တွေက exported functions အားလုံး cached ဖြစ်အောင် module level မှာ `'use cache'` ကို သုံးပါတယ်။ ဒါက သူတို့ရဲ့ ရလဒ်တွေကို static shell ထဲမှာ ပါဝင်စေပါတယ်:

```ts filename="app/lib/data.ts" highlight={1}
'use cache'

const API = 'https://next-recipe-api.vercel.dev'

export async function getCategory(slug: string) {
  const res = await fetch(`${API}/categories/${slug}`)
  if (!res.ok) return null
  return res.json()
}

export async function getProduct(category: string, slug: string) {
  const res = await fetch(`${API}/products/${category}/${slug}`)
  if (!res.ok) return null
  return res.json()
}

export async function getTopCategories() {
  const res = await fetch(`${API}/categories`)
  const categories = await res.json()
  return categories.slice(0, 2)
}

export async function getPopularProducts(category: string) {
  const res = await fetch(`${API}/products?category=${category}`)
  const products = await res.json()
  return products.slice(0, 1)
}
```

သင့် components တွေက `cookies` (သို့) `headers` လို runtime APIs တွေကို ဝင်ရောက်သုံးနေတယ်ဆိုရင် — `<Suspense>` ထဲမှာ wrap လုပ်ပါ။ သူတို့ရဲ့ fallback UI က static shell ထဲမှာ ပါဝင်သွားပါလိမ့်မယ်။

### Build time မှာ

`next build` run လုပ်တဲ့အခါ — Next.js က သိထားတဲ့ category တစ်ခုချင်းစီ (`tops`, `shorts`) အတွက် layout ကို prerender လုပ်ပြီး — `await params` က suspend ဖြစ်တဲ့ render တစ်ခုကိုပါ ထည့်ပြီး `[category]` အတွက် App Shell ကို ထုတ်လုပ်ပါတယ်။

Category တစ်ခုစီအောက်က သိထားတဲ့ product တစ်ခုချင်းစီ (`tops` အောက်က `tee`, `shorts` အောက်က `joggers`) အတွက်လည်း page ကို prerender လုပ်ပြီး — `await params` က suspend ဖြစ်တဲ့ render တစ်ခုကိုပါ ထည့်ကာ `[product]` အတွက် App Shell ကို ထုတ်လုပ်ပါတယ်။

ဒါတွေကို အောက်ပါအတိုင်း ပေါင်းစပ်ပါတယ်:

- `/tops/tee`, `/shorts/joggers`: params နှစ်ခုလုံး သိထားလို့ အပြည့်အဝ static pages
- `/tops/[product]`, `/shorts/[product]`: category header render ပြီးသား၊ product က fallback ပြနေသည်
- `/[category]/[product]`: နှစ်ခုလုံး fallback ပြနေသည်

### Runtime မှာ

Visitor တစ်ယောက်က `/tops/tee` ဆီ သွားပါတယ်။ Params နှစ်ခုလုံး prerender လုပ်ပြီးသား မို့ — အပြည့်အဝ static page တစ်ခုကို ရရှိပါတယ်။

`/tops/overshirt` ကို ပထမဆုံး visit လုပ်တယ်ဆိုပါစို့။ `overshirt` product က မသိရသေးပေမယ့် `tops` category ကတော့ prerender လုပ်ပြီးသားပါ။ Next.js က category header အဆင်သင့် render လုပ်ပြီးသား `/tops/[product]` အတွက် App Shell ကို ပေးပါတယ်။ Product ကတော့ stream လုပ်ဝင်ပါတယ်။

`/shoes/basketball-shoes` ကို ပထမဆုံး visit လုပ်တယ်ဆိုပါစို့။ Param နှစ်ခုလုံး prerender မလုပ်ရသေးပါဘူး။ Next.js က `/[category]/[product]` အတွက် generic App Shell ကို ပေးပါတယ်။ Category ရော product ပါ stream လုပ်ဝင်ပါတယ်။

ပထမဆုံး visit အပြီးမှာ — Next.js က အခု သိပြီဖြစ်တဲ့ params တွေနဲ့ ဒီ routes တွေကို နောက်ခံမှာ render လုပ်ပါတယ်။ တူညီတဲ့ URLs တွေဆီ နောက် visitor က upgraded ရလဒ်ကို ရရှိပါတယ်။

Prefetch တစ်ခုက ပထမဆုံး visit အဖြစ် ရေတွက်ပါတယ်။ စာရင်းမသွင်းထားတဲ့ URL တစ်ခုဆီ ညွှန်တဲ့ [`<Link>`](/docs/nextjs/component-link) တစ်ခု viewport ထဲ ဝင်လာတဲ့အခါ (သို့) [`router.prefetch`](/docs/nextjs/use-router) ကို ခေါ်လိုက်တဲ့အခါ — Next.js က click မလုပ်ခင် နောက်ခံ upgrade ကို စတင်လို့ navigation က upgraded ရလဒ်ပေါ်ကို ရောက်သွားပါတယ်။

> **သိထားသင့်သည်**: စာရင်းမသွင်းထားတဲ့ (unlisted) params တွေအတွက် App Shell ကို Next.js 16.3 ကစပြီး ပေးပါတယ်။ အစောပိုင်း versions တွေကတော့ response မပို့ခင် server render အပြည့်အစုံကို စောင့်ပါတယ်။

### Upgrade က ဘာတွေ ထုတ်လုပ်ပေးလဲ

ပထမဆုံး visit အပြီးမှာ — Next.js က သိပြီးသား params တွေနဲ့ page ကို နောက်ခံမှာ render လုပ်ပြီး static boundary ကို component tree ရဲ့ အောက်ဆုံး ဖြစ်နိုင်သမျှအထိ တွန်းချဖို့ ကြိုးစားပါတယ်:

- Data access တိုင်း cached ဖြစ်ပြီး params အားလုံး ဖြေရှင်းပြီးသားဆိုရင် — upgrade က **အပြည့်အဝ static page တစ်ခု** ကို ထုတ်လုပ်ပါတယ်။
- Params အားလုံး ဖြေရှင်းပြီးပေမယ့် — render က `<Suspense>` boundaries တွေထဲမှာ wrap ထားတဲ့ uncached data (သို့) runtime APIs (`cookies`, `headers`) တွေကို ဆက်ထိမိနေရင် — upgrade က **အဲဒီ fallbacks တွေပါတဲ့ cached page တစ်ခု** ကို ထုတ်လုပ်ပါတယ်။ Uncached (သို့) runtime အပိုင်းတွေက request time မှာ stream လုပ်ဝင်ပါတယ်။
- Params တွေကို route အစီအစဉ်အတိုင်း ဖြေရှင်းပါတယ်။ `generateStaticParams` က ပြန်မပေးတဲ့ param value တစ်ခုက unresolved အတိုင်း ကျန်နေပြီး — ပိုနက်တဲ့ params တွေ upgrade မဖြစ်အောင် တားဆီးပါတယ်။

## ဘာတွေကို Prerender လုပ်မလဲ ရွေးချယ်ခြင်း

Route တိုင်း prerender လုပ်စရာ မလိုပါဘူး။ သင်က prerender လုပ်တဲ့ page တိုင်းက build အလုပ်တွေ တိုးစေပြီး — သိမ်းဆည်း ဖြန့်ကျက်ရမယ့် output တွေကိုပါ ထုတ်ပေးပါတယ်။ Route အများအပြားက နောက် deployment တစ်ခု မတိုင်ခင် ဘယ်တော့မှ visit မခံရနိုင်လို့ — အဲဒီအလုပ်တွေက မလိုအပ်ဘဲ ဖြစ်နေနိုင်ပါတယ်။

အဲဒီအစား — ကြိုတင် အသင့်ဖြစ်ထားရင် အကျိုးအရှိဆုံး routes တွေကို [`generateStaticParams`](/docs/nextjs/generate-static-params) နဲ့ prerender လုပ်ပါ။ ဥပမာ — လူကြိုက်များတဲ့ pages တွေ (သို့) ကြိုတင်ခန့်မှန်းလို့ရတဲ့ content တွေမျိုးပါ။ မကြာခဏ visit မခံရတဲ့ routes တွေကိုတော့ on-demand အနေနဲ့ generate လုပ်ပြီး သူတို့ရဲ့ ပထမဆုံး visit အပြီးမှာ upgrade လုပ်ပါတယ် — ဒါကြောင့် request မခံရနိုင်တဲ့ pages တွေအတွက် build အချိန်နဲ့ storage တွေ မကုန်စေပါဘူး။

## Pages Router ကနေ ပြောင်းရွှေ့လာသူများအတွက်

Pages Router ကနေ ပြောင်းရွှေ့နေတယ်ဆိုရင်:

- `getStaticPaths` ထဲက `fallback: true` က အခုဆိုရင် `cacheComponents` နဲ့ဆို default အပြုအမူ ဖြစ်ပါတယ်။ Visitors တွေက `<Suspense>` fallback တစ်ခုကို ချက်ချင်း ရရှိပြီး content တွေ stream လုပ်ဝင်ပါတယ်။
- `router.isFallback` က မလိုအပ်တော့ပါဘူး။ Prerendering အဆင့်က static shell တစ်ခုကို generate လုပ်ပြီး — `'use cache'` နဲ့ ထပ်ပြီး ကြီးထွားအောင် လုပ်နိုင်ပါတယ်။
- `revalidate` ပါတဲ့ `getStaticProps` က [`cacheLife`](/docs/nextjs/cache-life) ပါတဲ့ `'use cache'` ဆီ မြေပုံဆွဲပါတယ်။
- `getStaticPaths` က [`generateStaticParams`](/docs/nextjs/generate-static-params) ဆီ မြေပုံဆွဲပါတယ်။

## နောက်ထပ် ဆက်လုပ်ရမည့်အရာများ (Next steps)

- Caching model အပြည့်အစုံအတွက် [Cache Components နဲ့ Caching](/docs/nextjs/caching)
- ဘယ် param ပေါင်းစပ်မှုတွေကို prerender လုပ်မလဲ ထိန်းချုပ်ဖို့ [`generateStaticParams`](/docs/nextjs/generate-static-params)
- App Shells တွေထဲမှာ skeleton UI တွေ ပေးဖို့ [`loading.tsx`](/docs/nextjs/file-conventions-loading)
- Data တွေ ရနိုင်လာတာနဲ့အမျှ UI တွေကို တဖြည်းဖြည်း render လုပ်နည်းအတွက် [Streaming](/docs/nextjs/streaming)
- `'use cache'` အတွက် [`cacheHandlers`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) တွေနဲ့အတူ ရှိပြီးသား ISR [`cacheHandler`](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath) တစ်ခုကို ထိန်းသိမ်းထားဖို့ [Self-hosting](/docs/nextjs/self-hosting)
