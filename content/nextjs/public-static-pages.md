---
title: "Public (Static) Pages တည်ဆောက်ခြင်း (Building Public Pages)"
description: "User အားလုံးအတွက် တူညီတဲ့ content ကို ပြသပေးတဲ့ public pages (landing pages, product/list pages, marketing sites စသည်) တည်ဆောက်နည်း — prerendering, 'use cache' directive နဲ့ cache components, Suspense/streaming သုံးပြီး response မပိတ်ဆို့ဘဲ dynamic content ထည့်ခြင်း (partial prerendering) အဆင့်ဆင့်"
order: 129
source: "https://nextjs.org/docs/app/guides/public-static-pages"
status: translated
updated: 2026-09-03
---

Public pages တွေက user တိုင်းကို content တူတူပဲ ပြသပါတယ်။ အဖြစ်များတဲ့ ဥပမာတွေကတော့ landing pages, marketing pages နဲ့ product pages တွေပါ။

Data တွေကို မျှဝေသုံးစွဲလို့ — ဒီလို pages တွေကို ကြိုတင်ပြီး [prerender](https://nextjs.org/docs/app/glossary#prerendering) လုပ်ထားနိုင်ပြီး ပြန်လည် သုံးစွဲနိုင်ပါတယ်။ ဒါက page load တွေ ပိုမြန်စေပြီး — server ကုန်ကျစရိတ်တွေကိုလည်း လျှော့ချပေးပါတယ်။

ဒီ guide က user တွေကြားမှာ data မျှဝေတဲ့ public pages တွေကို ဘယ်လို တည်ဆောက်မလဲဆိုတာ ပြသပါလိမ့်မယ်။

## ဥပမာ (Example)

ဥပမာအနေနဲ့ — product list page တစ်ခုကို တည်ဆောက်ကြည့်ပါမယ်။

Static header တစ်ခုနဲ့ စတင်ပြီး — async external data တွေပါတဲ့ product list တစ်ခု ထည့်ကာ — response ကို မပိတ်ဆို့ဘဲ ဘယ်လို render လုပ်ရမလဲဆိုတာ လေ့လာပါမယ်။ နောက်ဆုံးမှာတော့ — page တစ်ခုလုံးကို [dynamic rendering](https://nextjs.org/docs/app/glossary#dynamic-rendering) အဖြစ် ပြောင်းစရာ မလိုဘဲ — user တစ်ဦးချင်းစီအတွက် သီးသန့် promotion banner တစ်ခုကို ထည့်ပါမယ်။

ဒီဥပမာမှာ သုံးထားတဲ့ resources တွေကို ဒီမှာ တွေ့နိုင်ပါတယ်:

- [Video](https://youtu.be/F6romq71KtI)
- [Demo](https://cache-components-public-pages.labs.vercel.dev/)
- [Code](https://github.com/vercel-labs/cache-components-public-pages)

### အဆင့် 1: Header ရိုးရိုးတစ်ခု ထည့်ခြင်း

Header ရိုးရိုးလေးတစ်ခုနဲ့ စတင်လိုက်ရအောင်။

```tsx filename="app/products/page.tsx"
// Static component
function Header() {
  return <h1>Shop</h1>
}

export default async function Page() {
  return (
    <>
      <Header />
    </>
  )
}
```

#### Static components (static အစိတ်အပိုင်းများ)

`<Header />` component က requests တွေကြားမှာ ပြောင်းလဲတတ်တဲ့ inputs တွေပေါ်မှာ မမူတည်ပါဘူး — ဥပမာ external data, request headers, route params, လက်ရှိအချိန် (သို့) random values တွေပေါ်မှာပေါ့။

> **သိထားသင့်သည်:** Locale အလိုက် ကွဲပြားတဲ့ dates (သို့) times တွေကို မြင်သာတဲ့ flash (မှိတ်တုတ်မှိတ်တုတ် ဖြစ်မှု) မရှိဘဲ ပြသဖို့ လိုအပ်ရင် — [hydration မတိုင်ခင် flash ကာကွယ်ခြင်း](https://nextjs.org/docs/app/guides/preventing-flash-before-hydration) ကို ကြည့်ပါ။

ဒီ component ရဲ့ output က ဘယ်တော့မှ မပြောင်းလဲပြီး — ကြိုတင် ဆုံးဖြတ်လို့ ရတာမို့ — ဒီလို component မျိုးကို **static** component လို့ ခေါ်ပါတယ်။ Request တစ်ခုကို စောင့်စရာ အကြောင်းမရှိတာကြောင့် — Next.js က page ကို [build time](https://nextjs.org/docs/app/glossary#build-time) မှာ လုံခြုံစွာ **prerender** လုပ်နိုင်ပါတယ်။

ဒါကို [`next build`](/docs/nextjs/next-cli) run လုပ်ပြီး အတည်ပြုနိုင်ပါတယ်။

```bash filename="Terminal"
Route (app)      Revalidate  Expire
┌ ○ /products           15m      1y
└ ○ /_not-found

○  (Static)  prerendered as static content
```

Product route က — ကျွန်ုပ်တို့ ဘာ explicit configuration မှ မထည့်ထားဘဲနဲ့တောင် — static အဖြစ် မှတ်သားထားတာကို သတိပြုပါ။

### အဆင့် 2: Product list ထည့်ခြင်း

အခု ကျွန်ုပ်တို့ရဲ့ product list ကို fetch လုပ်ပြီး render လုပ်ကြည့်ရအောင်။

```tsx filename="app/products/page.tsx"
import db from '@/db'
import { List } from '@/app/products/ui'

function Header() {}

// Dynamic component
async function ProductList() {
  const products = await db.product.findMany()
  return <List items={products} />
}

export default async function Page() {
  return (
    <>
      <Header />
      <ProductList />
    </>
  )
}
```

Header နဲ့ မတူဘဲ — product list က external data ပေါ်မှာ မူတည်ပါတယ်။

#### Dynamic components (dynamic အစိတ်အပိုင်းများ)

ဒီ data က အချိန်နဲ့အမျှ ပြောင်းလဲနိုင်လို့ — render လုပ်ထားတဲ့ output က ဘယ်တော့မှ တည်ငြိမ်နေမယ်လို့ အာမမခံနိုင်တော့ပါဘူး။ ဒါက product list ကို **dynamic** component တစ်ခု ဖြစ်စေပါတယ်။

Framework ကို လမ်းညွှန်ချက် မပေးဘူးဆိုရင် — user request တိုင်းမှာ data အသစ် (fresh) တွေကို fetch ချင်တယ်လို့ ယူဆပါတယ်။ ဒီဒီဇိုင်း ရွေးချယ်မှုက ပုံမှန် web behavior ကို ထင်ဟပ်စေပါတယ် — server request အသစ်တစ်ခုက page ကို render လုပ်ပေးတာပါ။

ဒါပေမယ့် — ဒီ component ကို request time မှာ render လုပ်မယ်ဆိုရင် — သူ့ရဲ့ data ကို fetch လုပ်တာက route **တစ်ခုလုံး**ရဲ့ response ကို နှောင့်နှေးစေပါလိမ့်မယ်။ Page ကို refresh လုပ်ကြည့်ရင် ဒါကို မြင်နိုင်ပါတယ်။

Header က ချက်ချင်း render ဖြစ်ပေမယ့် — product list ရဲ့ fetch ပြီးမချင်း — browser ဆီ ပို့လို့ မရပါဘူး။

ဒီ performance cliff (စွမ်းဆောင်ရည် ရုတ်တရက် ကျဆင်းမှု) ကနေ ကာကွယ်ဖို့ — ဒီ cache မလုပ်ထားတဲ့ data ကို ပထမဆုံးအကြိမ် **await** လုပ်တဲ့အခါ Next.js က [သတိပေးချက်](https://nextjs.org/docs/messages/blocking-prerender-dynamic) တစ်ခု ပြသပါတယ်: `<Suspense>` အပြင်ဘက်မှာ uncached data တွေကို ဝင်ရောက်သုံးတာက route ကို prerender မလုပ်နိုင်အောင် တားဆီးပါတယ်။

ဒီအချိန်မှာ — response ကို ဘယ်လို **မပိတ်ဆို့အောင်** (unblock) လုပ်မလဲဆိုတာ ဆုံးဖြတ်ရပါမယ်။ ဖြစ်နိုင်တာက:

- Component ကို [**cache**](https://nextjs.org/docs/app/glossary#cache-components) လုပ်ပြီး — သူက **တည်ငြိမ်** (stable) ဖြစ်ကာ page ကျန်တာတွေနဲ့အတူ prerender လုပ်လို့ရအောင် ပြုလုပ်ခြင်း။
- Component ကို [**stream**](https://nextjs.org/docs/app/glossary#streaming) လုပ်ပြီး — သူက **non-blocking** ဖြစ်ကာ page ရဲ့ ကျန်တဲ့အစိတ်အပိုင်းတွေ သူ့ကို မစောင့်ရတော့အောင် ပြုလုပ်ခြင်း။

ကျွန်ုပ်တို့ရဲ့ ကိစ္စမှာ — product catalog က user အားလုံးကြား မျှဝေထားလို့ — caching က မှန်ကန်တဲ့ ရွေးချယ်မှုပါ။

### Cache components (cache အစိတ်အပိုင်းများ)

[`'use cache'`](/docs/nextjs/use-cache) directive ကို သုံးပြီး function တစ်ခုကို cacheable အဖြစ် မှတ်သားနိုင်ပါတယ်။

```tsx filename="app/products/page.tsx"
import db from '@/db'
import { List } from '@/app/products/ui'

function Header() {}

// Cache component
async function ProductList() {
  'use cache'
  const products = await db.product.findMany()
  return <List items={products} />
}

export default async function Page() {
  return (
    <>
      <Header />
      <ProductList />
    </>
  )
}
```

ဒါက ဒီ function ကို [cache component](https://nextjs.org/docs/app/glossary#cache-components) တစ်ခု ဖြစ်စေပါတယ်။ ပထမဆုံးအကြိမ် run တဲ့အခါ — ကျွန်ုပ်တို့ return လုပ်တဲ့အရာကို cache လုပ်ပြီး ပြန်လည် သုံးစွဲပါလိမ့်မယ်။

Cache component တစ်ခုရဲ့ inputs တွေက request မရောက်ခင် **ကြိုတင်** ရရှိနိုင်တယ်ဆိုရင် — static component လိုပဲ သူ့ကို prerender လုပ်နိုင်ပါတယ်။

နောက်တစ်ခါ refresh လုပ်ကြည့်ရင် — cache component က response ကို မပိတ်ဆို့တာမို့ page က ချက်ချင်း load ဖြစ်တာကို မြင်ရပါမယ်။ ပြီးတော့ `next build` ကို နောက်တစ်ခါ run လုပ်ရင်လည်း — page က static အတိုင်း ဆက်ရှိနေတာကို အတည်ပြုနိုင်ပါတယ်:

```bash filename="Terminal"
Route (app)      Revalidate  Expire
┌ ○ /products           15m      1y
└ ○ /_not-found

○  (Static)  prerendered as static content
```

ဒါပေမယ့် — pages တွေက ထာဝရ static ဖြစ်နေခဲတယ်။

### အဆင့် 3: Dynamic promotion banner တစ်ခု ထည့်ခြင်း

ဘယ်လောက်ပဲ ရိုးရိုးရှင်းရှင်း page ဖြစ်ဖြစ် — ဒါမှမဟုတ် နောက်ပိုင်းမှာ dynamic content တချို့ လိုအပ်လာတတ်ပါတယ်။ ဒါကို သရုပ်ပြဖို့ — promotional banner တစ်ခု ထည့်ကြည့်ရအောင်:

```tsx filename="app/products/page.tsx"
import db from '@/db'
import { List, Promotion } from '@/app/products/ui'
import { getPromotion } from '@/app/products/data'

function Header() {}

async function ProductList() {}

// Dynamic component
async function PromotionContent() {
  const promotion = await getPromotion()
  return <Promotion data={promotion} />
}

export default async function Page() {
  return (
    <>
      <PromotionContent />
      <Header />
      <ProductList />
    </>
  )
}
```

ဒီတစ်ခါလည်း — ဒါက dynamic အဖြစ်ကနေ စပါတယ်။ အရင်ကလိုပဲ — blocking behavior တစ်ခု ထည့်လိုက်တာက Next.js ရဲ့ သတိပေးချက်ကို ဖြစ်ပေါ်စေပါတယ်။

အရင်တစ်ခါက — data တွေက မျှဝေထားလို့ cache လုပ်လို့ ရခဲ့ပါတယ်။ ဒီတစ်ခါမှာတော့ — promotion က user ရဲ့ location နဲ့ A/B tests တွေလို request-specific inputs တွေပေါ်မှာ မူတည်လို့ — blocking behavior ကနေ cache နဲ့ လွတ်အောင် မလုပ်နိုင်ပါဘူး။

### Partial prerendering (တစ်စိတ်တစ်ပိုင်း prerender ပြုလုပ်ခြင်း)

Dynamic content ထည့်လိုက်တာက — fully blocking render ဆီ ပြန်သွားရတယ်လို့ မဆိုလိုပါဘူး။ Streaming နဲ့ response ကို unblock လုပ်နိုင်ပါတယ်။

Next.js က streaming ကို default အနေနဲ့ ထောက်ပံ့ပေးပါတယ်။ [Suspense boundary](https://nextjs.org/docs/app/glossary#suspense-boundary) တစ်ခုကို သုံးပြီး — stream လုပ်ထားတဲ့ response ကို _အပိုင်းပိုင်း_ (chunks) အဖြစ် ဘယ်နေရာမှာ ဖြတ်မလဲ၊ content load ဖြစ်နေစဉ် ဘယ် fallback UI ကို ပြမလဲဆိုတာ framework ကို ပြောပြနိုင်ပါတယ်။

```tsx filename="app/products/page.tsx"
import { Suspense } from 'react'
import db from '@/db'
import { List, Promotion, PromotionSkeleton } from '@/app/products/ui'
import { getPromotion } from '@/app/products/data'

function Header() {}

async function ProductList() {}

// Dynamic component (streamed)
async function PromotionContent() {
  const promotion = await getPromotion()
  return <Promotion data={promotion} />
}

export default async function Page() {
  return (
    <>
      <Suspense fallback={<PromotionSkeleton />}>
        <PromotionContent />
      </Suspense>
      <Header />
      <ProductList />
    </>
  )
}
```

Fallback ကို ကျွန်ုပ်တို့ရဲ့ static နဲ့ cached content တွေ ကျန်တာတွေနဲ့အတူ prerender လုပ်ထားပါတယ်။ အတွင်းက component ကတော့ — သူ့ရဲ့ async အလုပ်တွေ ပြီးဆုံးတာနဲ့ — နောက်မှ stream ဝင်လာပါတယ်။

ဒီအပြောင်းအလဲနဲ့ဆိုရင် — Next.js က prerender လုပ်လို့ရတဲ့ အလုပ်တွေကို request-time အလုပ်တွေကနေ ခွဲထုတ်နိုင်ပြီး — route က [partially prerendered](https://nextjs.org/docs/app/glossary#partial-prerendering-ppr) ဖြစ်သွားပါတယ်။

နောက်တစ်ခါလည်း — `next build` run လုပ်ပြီး အတည်ပြုနိုင်ပါတယ်:

```bash filename="Terminal"
Route (app)      Revalidate  Expire
┌ ◐ /products    15m      1y
└ ◐ /_not-found

◐  (Partial Prerender)  Prerendered as static HTML with dynamic server-streamed content
```

[**Build time**](https://nextjs.org/docs/app/glossary#build-time) မှာ — header, product list နဲ့ promotion fallback အပါအဝင် page ရဲ့ အစိတ်အပိုင်း အများစုကို — render လုပ်ပြီး cache လုပ်ကာ content delivery network (CDN) ဆီ ပို့ပေးပါတယ်။

[**Request time**](https://nextjs.org/docs/app/glossary#dynamic-rendering) မှာတော့ — user နဲ့ နီးစပ်တဲ့ CDN node တစ်ခုကနေ prerender လုပ်ထားတဲ့ အပိုင်းကို ချက်ချင်း serve လုပ်ပါတယ်။

ဒါနဲ့ အပြိုင် — user အတွက် သီးသန့် promotion ကို server ပေါ်မှာ render လုပ်ပြီး client ဆီ stream လုပ်ကာ — fallback slot ထဲကို နေရာလဲလှယ် ထည့်သွင်းပေးပါတယ်။

Page ကို နောက်ဆုံးတစ်ခါ refresh လုပ်ကြည့်ရင် — page ရဲ့ အစိတ်အပိုင်း အများစုက ချက်ချင်း load ဖြစ်နေပြီး — dynamic အပိုင်းတွေက ရနိုင်တာနဲ့အမျှ stream ဝင်လာတာကို မြင်ရပါလိမ့်မယ်။

### Next steps (နောက်ထပ် အဆင့်များ)

Dynamic content တွေရဲ့ အစိတ်အပိုင်းတချို့ ပါဝင်တဲ့ — static လို့ ဆိုနိုင်တဲ့ pages တွေကို ဘယ်လို တည်ဆောက်ရမလဲဆိုတာ လေ့လာပြီးပါပြီ။

Static page တစ်ခုကနေ စတင်ပြီး — async အလုပ်တွေ ထည့်ကာ — prerender လုပ်လို့ရတာကို cache လုပ်ပြီး — မရတာကို stream လုပ်ခြင်းဖြင့် — blocking behavior ကို ဖြေရှင်းခဲ့ပါတယ်။

နောက်လာမယ့် guides တွေမှာ အောက်ပါတွေကို လေ့လာပါမယ်:

- Prerender လုပ်ထားတဲ့ pages (သို့) cached data တွေကို revalidate လုပ်ခြင်း။
- Route params တွေနဲ့ page တစ်ခုတည်းရဲ့ မူကွဲ (variants) တွေ ဖန်တီးခြင်း။
- User ကိုယ်ပိုင် data တွေနဲ့ private pages တွေ ဖန်တီးခြင်း။
