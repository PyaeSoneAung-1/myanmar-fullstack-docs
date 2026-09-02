---
title: "loading.js (Loading UI)"
description: "loading.js file convention — route segment ရဲ့ content stream ဝင်လာနေချိန်မှာ instant loading state (Suspense fallback) ပြသပေးတဲ့ special file"
order: 27
source: "https://nextjs.org/docs/app/api-reference/file-conventions/loading"
status: translated
updated: 2026-09-02
---

Special file `loading.js` က [React Suspense](https://react.dev/reference/react/Suspense) နဲ့တွဲပြီး — အဓိပ္ပာယ်ရှိတဲ့ **Loading UI** တွေ ဖန်တီးဖို့ ကူညီပေးပါတယ်။ ဒီ convention နဲ့ဆိုရင် route segment တစ်ခုရဲ့ content တွေ server ကနေ stream (အပိုင်းလိုက် ပို့ခြင်း) ဝင်လာနေချိန်မှာ [instant loading state](#instant-loading-states) ကို server ဘက်ကတည်းက ပြသနိုင်ပြီး — content အပြည့်အစုံ ရောက်တာနဲ့ အသစ်ကို အလိုအလျောက် နေရာမှာ လဲလှယ်ပေးပါတယ်။

```tsx
// app/feed/loading.tsx
export default function Loading() {
  // Or a custom loading skeleton component
  return <p>Loading...</p>
}
```

`loading.js` file ထဲမှာ ပေါ့ပါးတဲ့ (light-weight) loading UI မှန်သမျှ ထည့်လို့ရပါတယ်။ Suspense boundaries တွေကို လက်နဲ့ ဖွင့်ပိတ် စမ်းကြည့်ချင်ရင် [React Developer Tools](https://react.dev/learn/react-developer-tools) ကို သုံးတာ အဆင်ပြေပါတယ်။

ပုံမှန်အားဖြင့် ဒီ file က [Server Component](/docs/nextjs/server-client-components) တစ်ခုပါ — ဒါပေမယ့် `"use client"` directive နဲ့ဆို Client Component အဖြစ်လည်း သုံးလို့ရပါတယ်။

## Reference

### Parameters

Loading UI components တွေက parameter ဘာမှ လက်ခံပါဘူး။

## အလုပ်လုပ်ပုံ (Behavior)

### Navigation

- Fallback UI ကို [prefetched](/docs/nextjs/linking) (ကြိုတင် ယူထား) လုပ်ထားတာမို့ — prefetching မပြီးသေးတဲ့ အခြေအနေမျိုးကလွဲရင် navigation က ချက်ချင်း (immediate) ဖြစ်ပါတယ်။
- Navigation က **ကြားဖြတ်လို့ရတယ် (interruptible)** — ဆိုလိုတာက route တစ်ခုရဲ့ content တွေ အပြည့်အစုံ load မဖြစ်သေးဘဲနဲ့တောင် အခြား route တစ်ခုဆီ ပြောင်းသွားလို့ရပါတယ်။
- Route segment အသစ်တွေ load လုပ်နေချိန်မှာလည်း — shared layouts တွေက interactive အနေနဲ့ ဆက်ရှိနေပါတယ်။

### Instant Loading States

Instant loading state ဆိုတာက — navigation လုပ်လိုက်တာနဲ့ ချက်ချင်း ပြသလိုက်တဲ့ fallback UI ပါ။ Loading indicators တွေ (ဥပမာ skeleton, spinner) ကို ကြိုတင် render လုပ်ထားနိုင်သလို — နောက်လာမယ့် screen ရဲ့ အသေးစား ဒါပေမယ့် အဓိပ္ပာယ်ရှိတဲ့ အစိတ်အပိုင်း (cover photo, title စသည်) တွေကိုလည်း ပြနိုင်ပါတယ်။ ဒါက app က တုံ့ပြန်နေပြီဆိုတာ user ကို နားလည်စေပြီး — ပိုကောင်းတဲ့ user experience ရစေပါတယ်။

Loading state တစ်ခု ဖန်တီးဖို့ folder တစ်ခုထဲမှာ `loading.js` file ထည့်ရုံပါပဲ:

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />
}
```

တူညီတဲ့ folder ထဲမှာ `loading.js` က `layout.js` ရဲ့ အတွင်းမှာ နေရာယူပြီး — `page.js` file နဲ့ အောက်က children တွေကို `<Suspense>` boundary တစ်ခုအတွင်း အလိုအလျောက် wrap လုပ်ပေးပါတယ်။

[Component hierarchy](/docs/nextjs/project-structure) အရ — `loading.js` က `not-found.js`, `page.js` နဲ့ nested `layout.js` files တွေကို `<Suspense>` boundary အတွင်းမှာ wrap လုပ်ပါတယ်။ တူညီတဲ့ segment ထဲက `layout.js`, `template.js` (သို့) `error.js` တွေကိုတော့ **wrap မလုပ်ပါဘူး**။

> **သိထားသင့်သည်:** Layout က uncached (cache မလုပ်ထား) သို့မဟုတ် runtime data တွေ (ဥပမာ `cookies()`, `headers()`, (သို့) uncached fetches) ကို ဝင်ရောက်ဖတ်နေရင် — `loading.js` က အဲဒါအတွက် fallback ပြသပေးမှာ မဟုတ်ပါဘူး။
>
> - **[Cache Components](/docs/nextjs/caching) မသုံးထားရင်:** Layout က render လုပ်ပြီးမှသာ navigation က ဆက်ဖြစ်ပါတယ် (block ဖြစ်နေမယ်)။
> - **[Cache Components](/docs/nextjs/caching) သုံးထားရင်:** Layout ထဲက uncached (သို့) runtime data access တွေကို `<Suspense>` ထဲမှာ ရှင်းရှင်းလင်းလင်း wrap လုပ်ထားရပါမယ် — မဟုတ်ရင် Next.js က build time မှာ error နဲ့ လမ်းညွှန်ပေးပါတယ်။ Static shell က အရင်ဆုံး stream လုပ်ပြီး — uncached content တွေက နောက်မှ ဖြည့်သွင်းပေးပါတယ်။
>
> Navigation ကို ချက်ချင်း ဖြစ်စေချင်ရင် — uncached data fetching တွေကို `layout.js` ကနေ `page.js` ထဲ ရွှေ့ပါ (သို့) layout ထဲက runtime data access တွေကို ကိုယ်ပိုင် `<Suspense>` boundary တစ်ခုနဲ့ wrap လုပ်ပါ။ အသေးစိတ်နဲ့ ဥပမာတွေအတွက် [layout.js Caveats](https://nextjs.org/docs/app/api-reference/file-conventions/layout#interaction-with-loadingjs) ကို ကြည့်ပါ။

### SEO

- Static HTML ကိုပဲ ဖတ်ပြီး JavaScript မလည်ပတ်နိုင်တဲ့ bots တွေ (ဥပမာ Twitterbot) အတွက် — Next.js က UI ကို stream မလုပ်ခင် [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) ကို အရင်ဖြေရှင်းပြီး metadata တွေကို ကနဦး HTML ရဲ့ `<head>` ထဲမှာ ထည့်ပေးပါတယ်။
- ကျန်တဲ့ အခြေအနေတွေမှာ [streaming metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#streaming-metadata) ကို သုံးနိုင်ပါတယ်။ Blocking လား streaming လား ဆုံးဖြတ်ဖို့ — Next.js က user agents တွေကို အလိုအလျောက် စစ်ဆေးပေးပါတယ်။
- Streaming က server-rendered ဖြစ်လို့ — SEO ကို ထိခိုက်မှု မရှိပါဘူး။ Google ရဲ့ [Rich Results Test](https://search.google.com/test/rich-results) tool နဲ့ — သင့် page က Google crawlers တွေဆီ ဘယ်လို ပေါ်နေလဲ၊ serialized HTML ([source](https://web.dev/rendering-on-the-web/#seo-considerations)) ကို ဘယ်လိုလဲ ကြည့်လို့ရပါတယ်။

### Status Codes

Streaming လုပ်တဲ့အခါ — request အောင်မြင်ကြောင်း ပြသဖို့ `200` status code ကို ပြန်ပို့ပါတယ်။

ဒါပေမယ့် — stream လုပ်ထားတဲ့ content ထဲမှာတင် server က error (သို့) ပြဿနာတွေကို client ဆီ ဆက်သွယ်ပြောပြနိုင်ပါသေးတယ် — ဥပမာ [`redirect`](https://nextjs.org/docs/app/api-reference/functions/redirect) (သို့) [`notFound`](https://nextjs.org/docs/app/api-reference/functions/not-found) ကို သုံးတာမျိုးပါ။ Response headers တွေက client ဆီ ပို့ပြီးသွားလို့ — response ရဲ့ status code ကို နောက်ထပ် ပြင်လို့ မရတော့ပါဘူး။

ဥပမာ — 404 page တစ်ခုကို client ဆီ stream လုပ်တဲ့အခါ Next.js က stream လုပ်ထားတဲ့ HTML ထဲမှာ `<meta name="robots" content="noindex">` tag ကို ထည့်ပေးပါတယ်။ ဒါက HTTP status က 200 ဖြစ်နေတာတောင် — search engines တွေ အဲဒီ URL ကို index မလုပ်အောင် တားဆီးပေးပါတယ်။ Google ရဲ့ [`robots` meta tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) လမ်းညွှန်ချက်ကို ကြည့်ပါ။

အချို့ crawlers တွေက ဒီလို responses တွေကို "soft 404s" လို့ သတ်မှတ်တတ်ပါတယ်။ Streaming ကိစ္စမှာတော့ — page က HTML ထဲမှာ `noindex` လို့ ရှင်းရှင်းလင်းလင်း မှတ်သားထားလို့ indexation ဖြစ်စဉ် မရှိပါဘူး။

Compliance (စည်းကမ်း လိုက်နာမှု) (သို့) analytics အတွက် 404 status ကို တကယ်လိုအပ်ရင် — response body ကို stream မလုပ်ခင် resource ရှိမရှိ သေချာ စစ်ဆေးထားပါ။ အဲဒီလိုဆို server က HTTP status code ကို ကြိုပြီး သတ်မှတ်နိုင်မှာပါ။

ဒီစစ်ဆေးမှုကို [`proxy`](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) ထဲမှာ လုပ်ပြီး — မရှိတဲ့ slugs တွေကို not-found route ဆီ rewrite လုပ်နိုင်သလို၊ [404 response တစ်ခု ထုတ်ပေးတာ](https://nextjs.org/docs/app/api-reference/file-conventions/proxy#producing-a-response) မျိုးလည်း လုပ်နိုင်ပါတယ်။ Proxy ထဲက စစ်ဆေးမှုတွေကို မြန်မြန် လုပ်ထားပြီး — အဲဒီမှာ content အပြည့်အစုံ fetch လုပ်တာမျိုး ရှောင်ပါ။

**Response body ကို ဘယ်အချိန်မှာ stream လုပ်လဲ?** — Suspense fallback တစ်ခု render ဖြစ်တဲ့အခါ (ဥပမာ `loading.tsx`) (သို့) Server Component တစ်ခုက `Suspense` boundary အောက်မှာ suspend ဖြစ်တဲ့အခါမှာ response body က စတင် stream လုပ်ပါတယ်။ `notFound()` ကို အဲဒီ boundaries တွေရဲ့ ရှေ့မှာ၊ ပြီးတော့ suspend ဖြစ်စေနိုင်တဲ့ `await` တွေရဲ့ ရှေ့မှာ ထားပါ။ Streaming စဖို့ response headers တွေ သတ်မှတ်ပြီးသား ဖြစ်ရပါမယ် — ဒါကြောင့်မို့ streaming စပြီးတဲ့နောက်မှာ status code ပြောင်းလို့ မရတာပါ။

### Browser limits

[အချို့ browsers](https://bugs.webkit.org/show_bug.cgi?id=252413) တွေက streaming response တွေကို buffer လုပ်ပါတယ်။ Response က bytes 1024 ထက် ကျော်မှ စမြင်ရတာမျိုး ဖြစ်တတ်ပါတယ် — ဒါက "hello world" လို အသေးစား app တွေမှာပဲ အများအားဖြင့် သက်ရောက်ပြီး တကယ့် application တွေမှာ မဖြစ်တတ်ပါဘူး။

## Platform Support

| Deployment Option | Supported |
|---|---|
| [Node.js server](/docs/nextjs/deploying) | ရပါတယ် |
| [Docker container](/docs/nextjs/deploying) | ရပါတယ် |
| [Static export](/docs/nextjs/deploying) | မရပါဘူး |
| [Adapters](/docs/nextjs/deploying) | Platform အလိုက် ကွာခြားပါတယ် |

Next.js ကို ကိုယ်တိုင် self-host လုပ်တဲ့အခါ [streaming ကို configure လုပ်နည်း](https://nextjs.org/docs/app/guides/self-hosting#streaming-and-suspense) ကို လေ့လာပါ။

## ဥပမာများ

### Suspense နဲ့ Streaming

`loading.js` အပြင် — ကိုယ်ပိုင် UI components တွေအတွက် Suspense Boundaries တွေကို လက်နဲ့ပါ ဖန်တီးနိုင်ပါတယ်။ App Router က [Suspense](https://react.dev/reference/react/Suspense) နဲ့ streaming ကို ထောက်ပံ့ပေးပါတယ်။ Streaming ဘယ်လို အလုပ်လုပ်လဲ — granular Suspense patterns, Route Handler streaming, infrastructure ထည့်တွက်စရာတွေ အပါအဝင် — [Streaming guide](/docs/nextjs/streaming) မှာ ဆက်ဖတ်ပါ။

`<Suspense>` က asynchronous အလုပ်တစ်ခု လုပ်နေတဲ့ component တစ်ခုကို wrap လုပ်ပြီး — အလုပ်လုပ်နေချိန်မှာ fallback UI (ဥပမာ skeleton, spinner) ပြပေးကာ၊ အလုပ်ပြီးတာနဲ့ component အစစ်ကို နေရာမှာ ထည့်လဲပေးတဲ့ သဘောပါ:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { PostFeed, Weather } from './Components'

export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  )
}
```

Suspense သုံးခြင်းရဲ့ အကျိုးကျေးဇူးတွေက:

1. **Streaming Server Rendering** — HTML တွေကို server ကနေ client ဆီ တဖြည်းဖြည်း (progressively) render လုပ်ပို့ခြင်း။
2. **Selective Hydration** — user ရဲ့ အပြန်အလှန်တုံ့ပြန်မှုပေါ်မူတည်ပြီး — React က ဘယ် components တွေကို အရင်ဆုံး interactive ဖြစ်အောင် လုပ်မလဲ ဦးစားပေး ရွေးချယ်ပေးပါတယ်။

နောက်ထပ် Suspense ဥပမာတွေနဲ့ use cases တွေအတွက် — [React Documentation](https://react.dev/reference/react/Suspense) ကို ကြည့်ပါ။

## Version History

| Version | အပြောင်းအလဲ |
|---|---|
| `v13.0.0` | `loading` စတင် မိတ်ဆက်။ |

## နောက်တစ်ဆင့်တွေ

- [Streaming](/docs/nextjs/streaming) — streaming အလုပ်လုပ်ပုံ အသေးစိတ်
- [Pages & Layouts](/docs/nextjs/pages-layouts) — `layout.js` နဲ့ `page.js` အပြန်အလှန် ဆက်စပ်ပုံ
- [Lazy Loading](/docs/nextjs/lazy-loading) — client-side မှာ component တွေ နှောင့်နှေးတင်ခြင်း
