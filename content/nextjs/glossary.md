---
title: "Next.js Glossary (အသုံးအနှုန်းအဘိဓာန်)"
description: "Next.js documentation များမှာ အသုံးပြုတဲ့ အသုံးအနှုန်းများ၏ အဘိဓာန် — App Router, Cache Components, Server Actions, Turbopack စသည့် အသုံးအနှုန်းတွေရဲ့ အဓိပ္ပာယ်ဖွင့်ဆိုချက်များ"
order: 259
source: "https://nextjs.org/docs/app/glossary"
status: translated
updated: 2026-09-05
---

## A

### App Router

App Router ဆိုတာ React Server Components တွေပေါ်မှာ တည်ဆောက်ထားပြီး version 13 မှာ မိတ်ဆက်ခဲ့တဲ့ Next.js router ဖြစ်ပါတယ်။ File-system အခြေပြု routing ကို အသုံးပြုပြီး — layouts, nested routing (အထပ်လိုက် routing), loading states, error handling စတာတွေကို ထောက်ပံ့ပေးပါတယ်။ [App Router documentation](https://nextjs.org/docs/app) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### App Shell

App Shell ဆိုတာ URL data ပေါ်မှာ မမူတည်တဲ့ page ရဲ့ အစိတ်အပိုင်းတွေ ပါဝင်တဲ့ — route တစ်ခုစီအတွက် prerender လုပ်ထားတဲ့ အရာတစ်ခုပါ။ Shell ကို သက်တမ်းတိုတဲ့ content တွေ fresh ဖြစ်နေတာထက် ကြာကြာ ပြန်သုံးနေတာမို့ — `stale` time အနည်းဆုံး 5 မိနစ် ရှိတဲ့အခါ cache လုပ်ထားတဲ့ content ကို ထည့်သွင်းပါတယ်။ `cookies()` သို့မဟုတ် `headers()` တွေကို ဖတ်တဲ့ routes တွေကတော့ — client ဘက်မှာ session တစ်ခုစီအလိုက် cache လုပ်ထားတဲ့ session data ပါ ပါဝင်တဲ့ shell ကို ထုတ်လုပ်ပါတယ်။ ဒါကို client-side navigation တွေမှာ default prefetch payload အဖြစ်၊ [per-link prefetch](/docs/nextjs/optimizing-prefetching) အဆင်သင့် မဖြစ်သေးတဲ့အခါ loading state အဖြစ်၊ ပြီးတော့ [ISR with Cache Components](/docs/nextjs/incremental-static-regeneration-cache-components) အတွက် fallback အဖြစ် အသုံးပြုပါတယ်။

## B

### Build time

Build time ဆိုတာ သင့် application ကို compile လုပ်နေတဲ့ အဆင့်ပါ။ Build time အတွင်းမှာ Next.js က သင့် code တွေကို production အတွက် optimized files တွေအဖြစ် ပြောင်းလဲပေး၊ static pages တွေကို ထုတ်လုပ်ပေးပြီး — deployment အတွက် assets တွေကို ပြင်ဆင်ပေးပါတယ်။ [`next build` CLI reference](https://nextjs.org/docs/app/api-reference/cli/next) မှာ ကြည့်ပါ။

## C

### Cache Components

Cache Components ဆိုတာ [`"use cache"` directive](/docs/nextjs/use-cache) ကို သုံးပြီး component နဲ့ function အဆင့် caching လုပ်နိုင်စေတဲ့ feature တစ်ခုပါ။ Cache Components နဲ့ဆိုရင် — ချက်ချင်း serve လုပ်နိုင်တဲ့ static HTML shell တစ်ခုကို prerender လုပ်ပြီး — dynamic content တွေ အဆင်သင့်ဖြစ်တာနဲ့ stream ဝင်လာစေခြင်းဖြင့် route တစ်ခုတည်းထဲမှာ static, cached နဲ့ dynamic content တွေကို ရောနှောသုံးနိုင်ပါတယ်။ Cache ကြာချိန်ကို [`cacheLife()`](/docs/nextjs/cache-life) နဲ့ သတ်မှတ်ပြီး — cache လုပ်ထားတဲ့ data တွေကို [`cacheTag()`](/docs/nextjs/cache-tag) နဲ့ tag လုပ်ကာ — လိုအပ်သလို [`updateTag()`](/docs/nextjs/update-tag) နဲ့ invalidate (တရားဝင်မှု ပျက်ပြယ်စေခြင်း) လုပ်နိုင်ပါတယ်။ [Cache Components guide](/docs/nextjs/caching) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Catch-all Segments

Catch-all Segments တွေဆိုတာ `[...folder]/page.js` syntax ကို သုံးပြီး URL အပိုင်းအများအပြားကို ကိုက်ညီနိုင်တဲ့ dynamic route segments တွေပါ။ ဒီ segments တွေက ကျန်ရှိနေတဲ့ URL segments အားလုံးကို ဖမ်းယူလိုက်ပြီး — documentation sites (စာရွက်စာတမ်း ဆိုက်များ) သို့မဟုတ် file browsers လိုမျိုး feature တွေ အကောင်အထည်ဖော်ဖို့ အသုံးဝင်ပါတယ်။ [Dynamic Route Segments](/docs/nextjs/dynamic-routes) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Client Bundles

Client Bundles တွေဆိုတာ browser ဆီ ပို့လိုက်တဲ့ JavaScript bundles တွေပါ။ Next.js က [module graph](#module-graph) ကို အခြေခံပြီး ဒါတွေကို အလိုအလျောက် ခွဲထုတ်ပေးကာ — ကနဦး payload ရဲ့ အရွယ်အစားကို လျှော့ချပေးပြီး page တစ်ခုစီအတွက် လိုအပ်တဲ့ code တွေကိုပဲ load လုပ်ပါတယ်။

### Client Component

Client Component ဆိုတာ browser ထဲမှာ run တဲ့ React component ပါ။ Next.js မှာတော့ Client Components တွေကို ကနဦး page generation အတွင်း server ပေါ်မှာလည်း render လုပ်နိုင်ပါတယ်။ သူတို့က state, effects, event handlers နဲ့ browser APIs တွေကို သုံးနိုင်ပြီး — file တစ်ခုရဲ့ ထိပ်ဆုံးမှာ [`"use client"` directive](#use-client-directive) နဲ့ မှတ်သားထားပါတယ်။ [Server and Client Components](/docs/nextjs/server-client-components) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Client-side navigation

Client-side navigation ဆိုတာ page တစ်ခုလုံး ပြန်မတင်ဘဲ (full page reload မလုပ်ဘဲ) page content တွေကို dynamically update လုပ်တဲ့ navigation နည်းလမ်းပါ။ Next.js က [`<Link>` component](/docs/nextjs/component-link) နဲ့ client-side navigation ကို သုံးပြီး — shared layouts တွေကို interactive ဖြစ်နေစေကာ browser state တွေကို ထိန်းသိမ်းပေးပါတယ်။ [Linking and Navigating](/docs/nextjs/linking) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Client Cache

Client Cache ဆိုတာ browser ထဲက in-memory cache တစ်ခုဖြစ်ပြီး — သွားရောက်ခဲ့တဲ့ နဲ့ prefetch လုပ်ထားတဲ့ routes တွေအတွက် [RSC Payload](#rsc-payload) တွေကို သိမ်းဆည်းပေးပါတယ်။ [Client-side navigation](#client-side-navigation) အတွင်းမှာ Next.js က server request မလိုဘဲ cache လုပ်ထားတဲ့ [layouts](#layout) နဲ့ [loading states](#loading-ui) တွေကို ချက်ချင်း serve လုပ်ပါတယ်။ Pages တွေကိုတော့ default အနေနဲ့ cache မလုပ်ပေမယ့် — browser ရဲ့ back/forward navigation တွေမှာ ပြန်လည် အသုံးပြုပါတယ်။

Page တစ်ခုကို refresh လုပ်လိုက်ရင် client cache က ရှင်းသွားပါတယ်။ ဒါကို [`revalidateTag`](/docs/nextjs/revalidate-tag), [`revalidatePath`](/docs/nextjs/revalidate-path), [`updateTag`](/docs/nextjs/update-tag), [`router.refresh`](/docs/nextjs/use-router), [`cookies.set`](/docs/nextjs/cookies) (သို့) [`cookies.delete`](/docs/nextjs/cookies) တွေနဲ့ programmatically invalidate လုပ်နိုင်ပါတယ်။

Client cache ရဲ့ ကြာချိန်ကို [`staleTimes`](/docs/nextjs/next-config-stale-times) နဲ့ တစ်ကမ္ဘာလုံးအတိုင်းအတာ (globally) သတ်မှတ်နိုင်သလို — [`cacheLife`](/docs/nextjs/cache-life) ထဲက `stale` property ကနေတစ်ဆင့် route အလိုက်လည်း သတ်မှတ်နိုင်ပါတယ် (ဒါက အကြံပြုထားတဲ့ နည်းလမ်းပါ)။

### Code Splitting

Code Splitting ဆိုတာ routes တွေကို အခြေခံပြီး သင့် application ကို JavaScript chunks အသေးလေးတွေ အဖြစ် ပိုင်းခြားတဲ့ လုပ်ငန်းစဉ်ပါ။ Code အားလုံးကို အစကတည်းက load မလုပ်ဘဲ — လက်ရှိ route အတွက် လိုအပ်တဲ့ code တွေကိုပဲ load လုပ်တာမို့ — ကနဦး load ချိန်ကို လျှော့ချပေးပါတယ်။ Next.js က routes အလိုက် code splitting ကို အလိုအလျောက် လုပ်ဆောင်ပေးပါတယ်။ [Package Bundling guide](/docs/nextjs/package-bundling) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## D

### Dynamic rendering

Dynamic rendering ဆိုတာ component တစ်ခုကို [build time](#build-time) မှာ မဟုတ်ဘဲ request time (request ဝင်လာချိန်) မှာ render လုပ်တာပါ။ Component တစ်ခုက [Request-time APIs](#request-time-apis) တွေကို အသုံးပြုတဲ့အခါ dynamic ဖြစ်လာပါတယ်။

### Dynamic route segments

Dynamic route segments တွေဆိုတာ request time မှာ data တွေကနေ ထုတ်လုပ်တဲ့ [route segments](#route-segment) တွေပါ။ Folder name တစ်ခုကို square brackets ထဲမှာ ထည့်ပြီး ဖန်တီးပါတယ် (ဥပမာ — `[slug]`)။ ဒါက blog posts (ဘလော့ဂ် ပို့စ်များ) သို့မဟုတ် product pages လိုမျိုး dynamic data တွေကနေ routes တွေ ဖန်တီးနိုင်စေပါတယ်။ [Dynamic Route Segments](/docs/nextjs/dynamic-routes) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## E

### Environment Variables

Environment Variables တွေဆိုတာ build time သို့မဟုတ် request time မှာ ဝင်ရောက်ဖတ်ရှုနိုင်တဲ့ configuration တန်ဖိုးတွေပါ။ Next.js မှာ `NEXT_PUBLIC_` နဲ့ စတင်တဲ့ variables တွေကို browser ဆီ ထုတ်ဖော်ပေးပြီး — ကျန်တာတွေကတော့ server side မှာပဲ ရနိုင်ပါတယ်။ [Environment Variables](/docs/nextjs/environment-variables) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Error Boundary

Error Boundary ဆိုတာ သူ့ရဲ့ child component tree ထဲမှာ ဖြစ်ပေါ်တဲ့ JavaScript errors တွေကို ဖမ်းယူပြီး fallback UI တစ်ခု ပြသပေးတဲ့ React component ပါ။ Next.js မှာဆိုရင် [`error.js` file](/docs/nextjs/file-conventions-error) တစ်ခု ဖန်တီးလိုက်ရုံနဲ့ route segment တစ်ခုကို error boundary ထဲမှာ အလိုအလျောက် ထည့်သွင်းပေးပါတယ်။ [Error Handling](/docs/nextjs/error-handling) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## F

### Font Optimization

Font Optimization ဆိုတာ [`next/font`](/docs/nextjs/component-font) ကို သုံးပြီး font တွေကို အလိုအလျောက် ပိုမိုကောင်းမွန်အောင် ပြုလုပ်ပေးတာပါ။ Next.js က fonts တွေကို self-host လုပ်ပေး၊ layout shift (အပြင်အဆင် ရွေ့လျားမှု) တွေကို ဖယ်ရှားပေးပြီး — performance အတွက် အကောင်းဆုံး အလေ့အကျင့်တွေကို အသုံးချပေးပါတယ်။ Google Fonts နဲ့ local font files တွေမှာ အလုပ်လုပ်ပါတယ်။ [Fonts](/docs/nextjs/fonts) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### File-system caching

File-system caching ဆိုတာ Turbopack ရဲ့ feature တစ်ခုဖြစ်ပြီး — run တစ်ခုနဲ့တစ်ခုကြားမှာ compiler artifacts တွေကို disk ပေါ်မှာ သိမ်းဆည်းထားပေးကာ — `next dev` (သို့) `next build` commands တွေရဲ့ အလုပ်တွေကို လျှော့ချပေးလို့ compile ချိန် သိသိသာသာ မြန်ဆန်စေပါတယ်။ [Turbopack FileSystem Caching](/docs/nextjs/next-config-turbopack-file-system-cache) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## H

### Hydration

Hydration ဆိုတာ server မှာ render လုပ်ထားတဲ့ static HTML တွေကို interactive ဖြစ်စေဖို့ React က event handlers တွေကို DOM ပေါ်မှာ တွဲဆက်ပေးတဲ့ လုပ်ငန်းစဉ်ပါ။ Hydration အတွင်းမှာ React က server-rendered markup နဲ့ client-side JavaScript တို့ကို ပြန်လည် ညှိနှိုင်းပေါင်းစပ် (reconcile) ပေးပါတယ်။ [Server and Client Components](/docs/nextjs/server-client-components) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## I

### Import Aliases

Import Aliases တွေဆိုတာ မကြာခဏ သုံးတဲ့ directories တွေအတွက် အတိုကောက် ရည်ညွှန်းချက်တွေ ပေးစွမ်းတဲ့ custom path mappings တွေပါ။ Import aliases တွေက relative imports တွေရဲ့ ရှုပ်ထွေးမှုကို လျှော့ချပေးပြီး — code တွေကို ပိုပြီး ဖတ်ရလွယ်ကူ၊ ထိန်းသိမ်းရလွယ်ကူစေပါတယ်။ [Absolute Imports and Module Path Aliases](https://nextjs.org/docs/app/getting-started/installation) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Incremental Static Regeneration (ISR)

Incremental Static Regeneration (ISR) ဆိုတာ site တစ်ခုလုံးကို ပြန်လည် build မလုပ်ဘဲ static content တွေကို update လုပ်နိုင်စေတဲ့ နည်းလမ်းတစ်ခုပါ။ ISR နဲ့ဆိုရင် page အလိုက် static generation ကို သုံးနိုင်ပြီး — traffic တွေ ဝင်လာတာနဲ့အမျှ pages တွေကို နောက်ခံမှာ revalidate လုပ်ပေးပါတယ်။ [ISR guide](/docs/nextjs/incremental-static-regeneration) (သို့) Cache Components သုံးနေတယ်ဆိုရင် [ISR with Cache Components](/docs/nextjs/incremental-static-regeneration-cache-components) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

> **သိထားသင့်သည်:** Next.js မှာ ISR ကို [Revalidation](#revalidation) လို့လည်း ခေါ်ပါတယ်။

### Intercepting Routes

Intercepting Routes ဆိုတာ လက်ရှိ layout ထဲမှာပဲ သင့် application ရဲ့ အခြားအစိတ်အပိုင်းတစ်ခုကနေ route တစ်ခုကို load လုပ်နိုင်စေတဲ့ routing pattern တစ်ခုပါ။ User တွေ context မပြောင်းဘဲ content တွေ (modals လိုမျိုး) ပြသဖို့ အသုံးဝင်ပြီး — URL ကို share လုပ်လို့ရအောင် ထိန်းထားပေးပါတယ်။ [Intercepting Routes](/docs/nextjs/intercepting-routes) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Image Optimization

Image Optimization ဆိုတာ [`<Image>` component](/docs/nextjs/component-image) ကို သုံးပြီး images တွေကို အလိုအလျောက် optimize လုပ်ပေးတာပါ။ Next.js က images တွေကို on-demand optimize လုပ်ပေး၊ WebP လိုမျိုး ခေတ်မီ formats တွေနဲ့ serve လုပ်ပေးပြီး — lazy loading နဲ့ responsive sizing (မျက်နှာပြင်အရွယ်အစားအလိုက် ချိန်ညှိခြင်း) တွေကို အလိုအလျောက် ကိုင်တွယ်ပေးပါတယ်။ [Images](/docs/nextjs/image) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## L

### Layout

Layout ဆိုတာ pages အများအပြားကြားမှာ မျှဝေသုံးတဲ့ UI ပါ။ Layouts တွေက state တွေကို ထိန်းသိမ်းပေး၊ interactive ဖြစ်နေစေပြီး — navigation လုပ်တဲ့အခါ ပြန်လည် re-render မလုပ်ပါဘူး။ [`layout.js` file](/docs/nextjs/file-conventions-layout) တစ်ခုကနေ React component တစ်ခုကို export လုပ်ခြင်းဖြင့် သတ်မှတ်ပါတယ်။ [Layouts and Pages](/docs/nextjs/pages-layouts) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Loading UI

Loading UI ဆိုတာ [route segment](#route-segment) တစ်ခု loading ဖြစ်နေတုန်း ပြသပေးတဲ့ fallback UI ပါ။ Folder တစ်ခုထဲကို [`loading.js` file](/docs/nextjs/file-conventions-loading) တစ်ခု ထည့်လိုက်ရင် — page ကို [Suspense boundary](#suspense-boundary) ထဲမှာ အလိုအလျောက် ထည့်သွင်းပေးပါတယ်။ [Loading UI](/docs/nextjs/file-conventions-loading) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## M

### Module Graph

Module Graph ဆိုတာ သင့် app ထဲက file dependencies တွေရဲ့ graph တစ်ခုပါ။ File (module) တစ်ခုစီက node တစ်ခုဖြစ်ပြီး — import/export ဆက်သွယ်မှုတွေက edges (ချိတ်ဆက်မျဉ်းများ) အဖြစ် ဖွဲ့စည်းပါတယ်။ Next.js က ဒီ graph ကို ခွဲခြမ်းစိတ်ဖြာပြီး — အကောင်းဆုံး bundling နဲ့ code-splitting နည်းဗျူဟာတွေကို ဆုံးဖြတ်ပေးပါတယ်။ [Server and Client Components](/docs/nextjs/server-client-components) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Metadata

Metadata ဆိုတာ title, description, Open Graph images စတဲ့ browsers နဲ့ search engines တွေ အသုံးပြုတဲ့ page အကြောင်း အချက်အလက်တွေပါ။ Next.js မှာ layout (သို့) page files တွေထဲမှာ [`metadata` export](/docs/nextjs/generate-metadata) (သို့) [`generateMetadata` function](/docs/nextjs/generate-metadata) ကို သုံးပြီး metadata ကို သတ်မှတ်ပါတယ်။ [Metadata and OG Images](/docs/nextjs/metadata-and-og-images) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Memoization

Memoization ဆိုတာ function တစ်ခုရဲ့ return value ကို cache လုပ်ထားပြီး — render pass (request) တစ်ခုအတွင်း တူညီတဲ့ function ကို အကြိမ်ကြိမ် ခေါ်ရင်တောင် တစ်ကြိမ်ပဲ execute လုပ်တာပါ။ Next.js မှာ URL နဲ့ options တူညီတဲ့ `fetch` `GET` requests တွေကို Server Components, layouts, pages နဲ့ `generateMetadata`/`generateStaticParams` တွေကြားမှာ အလိုအလျောက် memoize လုပ်ပေးပါတယ် ([Route Handlers](/docs/nextjs/file-conventions-route) တွေကတော့ React component tree ရဲ့ အစိတ်အပိုင်း မဟုတ်လို့ memoize မလုပ်ပေးပါဘူး)။

`fetch` မဟုတ်တဲ့ လုပ်ဆောင်ချက်တွေအတွက်ကတော့ React ရဲ့ [`cache`](https://react.dev/reference/react/cache) function ကို သုံးပါ။ [`fetch` API reference](/docs/nextjs/fetch) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Middleware

[Proxy](#proxy) ကို ကြည့်ပါ။

## N

### Not Found

Not Found ဆိုတာ route တစ်ခု မရှိတဲ့အခါ (သို့) [`notFound()` function](/docs/nextjs/not-found-function) ကို ခေါ်လိုက်တဲ့အခါ ပြသပေးတဲ့ အထူး component တစ်ခုပါ။ သင့် app directory ထဲမှာ [`not-found.js` file](/docs/nextjs/not-found) တစ်ခု ထည့်ခြင်းဖြင့် ဖန်တီးပါတယ်။ [Error Handling](/docs/nextjs/error-handling) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## P

### Private Folders

Private Folders တွေဆိုတာ underscore (`_components` စသည်) နဲ့ စတင်တဲ့ folders တွေဖြစ်ပြီး — routing system ထဲကနေ ဖယ်ထုတ်ထားပါတယ်။ ဒီ folders တွေကို accessible routes တွေ မဖန်တီးဘဲ code တွေ စုစည်းဖို့နဲ့ shared utilities တွေအတွက် အသုံးပြုပါတယ်။ [Private Folders](/docs/nextjs/project-structure) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Page

Page ဆိုတာ route တစ်ခုအတွက် သီးသန့်ဖြစ်တဲ့ UI ပါ။ `app` directory ထဲမှာ [`page.js` file](/docs/nextjs/file-conventions-page) တစ်ခုကနေ React component တစ်ခုကို export လုပ်ခြင်းဖြင့် သတ်မှတ်ပါတယ်။ [Layouts and Pages](/docs/nextjs/pages-layouts) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Parallel Routes

Parallel Routes ဆိုတာ layout တစ်ခုတည်းထဲမှာ pages အများအပြားကို တစ်ပြိုင်နက် (သို့) အခြေအနေအလိုက် render လုပ်နိုင်စေတဲ့ pattern တစ်ခုပါ။ `@folder` convention နဲ့ named slots တွေကို သုံးပြီး ဖန်တီးပါတယ် — dashboards, modals နဲ့ ရှုပ်ထွေးတဲ့ layouts တွေအတွက် အသုံးဝင်ပါတယ်။ [Parallel Routes](/docs/nextjs/parallel-routes) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Partial Prefetching

Partial Prefetching ဆိုတာ [Cache Components](#cache-components) routes တွေအတွက် prefetching နည်းဗျူဟာတစ်ခုဖြစ်ပြီး — `<Link>` တစ်ခုက page အပြည့်အစုံ အစား route တစ်ခုစီရဲ့ [App Shell](#app-shell) ကို default အနေနဲ့ prefetch လုပ်ပါတယ်။ `next.config.ts` ထဲမှာ [`partialPrefetching: true`](/docs/nextjs/next-config-partial-prefetching) ဆိုပြီး ဖွင့်နိုင်ပါတယ်။ [Adopting Partial Prefetching guide](/docs/nextjs/adopting-partial-prefetching) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Partial Prerendering (PPR)

Partial Prerendering (PPR) ဆိုတာ prerendering နဲ့ dynamic rendering ကို route တစ်ခုတည်းထဲမှာ ပေါင်းစပ်ပေးတဲ့ rendering optimization တစ်ခုပါ။ Static shell ကို ချက်ချင်း serve လုပ်ပြီး — dynamic content တွေက အဆင်သင့်ဖြစ်တာနဲ့ stream ဝင်လာတာမို့ — rendering နည်းလမ်းနှစ်ခုလုံးရဲ့ အကောင်းဆုံး အကျိုးကျေးဇူးတွေကို ရရှိစေပါတယ်။ [Cache Components](/docs/nextjs/caching) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Prefetching

Prefetching ဆိုတာ user က route တစ်ခုဆီ မသွားခင် နောက်ခံမှာ route ကို ကြိုတင် load လုပ်ထားတာပါ။ Next.js က [`<Link>` component](/docs/nextjs/component-link) နဲ့ ချိတ်ဆက်ထားတဲ့ routes တွေ viewport ထဲ ရောက်လာတာနဲ့ အလိုအလျောက် prefetch လုပ်ပေးပြီး — navigation တွေကို ချက်ချင်း (instant) လို့ ခံစားရစေပါတယ်။ [Prefetching guide](/docs/nextjs/prefetching) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Prerendering

Prerendering ဆိုတာ component တစ်ခုကို [build time](#build-time) (သို့) [revalidation](#revalidation) အတွင်း နောက်ခံမှာ render လုပ်တာပါ။ ရလဒ်က HTML နဲ့ [RSC Payload](#rsc-payload) ဖြစ်ပြီး — cache လုပ်ကာ CDN ကနေ serve လုပ်နိုင်ပါတယ်။ [Request-time APIs](#request-time-apis) တွေကို မသုံးတဲ့ components တွေအတွက် Prerendering က default ဖြစ်ပါတယ်။

### Proxy

Proxy ဆိုတာ request မပြီးဆုံးခင် server ပေါ်မှာ code တွေ run စေတဲ့ file ([`proxy.js`](/docs/nextjs/file-conventions-proxy)) တစ်ခုပါ။ Logging, redirects နဲ့ rewrites လိုမျိုး server-side logic တွေ အကောင်အထည်ဖော်ဖို့ အသုံးပြုပါတယ်။ အရင်က Middleware လို့ ခေါ်ခဲ့ပါတယ်။ [Proxy guide](https://nextjs.org/docs/app/getting-started/proxy) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## R

### Redirect

Redirect ဆိုတာ users တွေကို URL တစ်ခုကနေ နောက်တစ်ခုဆီ ပို့ပေးတာပါ။ Next.js မှာ redirects တွေကို [`next.config.js`](/docs/nextjs/next-config-redirects) ထဲမှာ configure လုပ်နိုင်သလို — [Proxy](/docs/nextjs/file-conventions-proxy) ကနေ ပြန်ပို့နိုင်ကာ — [`redirect()` function](/docs/nextjs/redirect) နဲ့ programmatically လည်း စတင်နိုင်ပါတယ်။ [Redirecting](/docs/nextjs/redirecting) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Request-time APIs

Request-time APIs တွေဆိုတာ request-specific data တွေကို ဝင်ရောက်ဖတ်ရှုပြီး — component တစ်ခုကို [dynamic rendering](#dynamic-rendering) ထဲ ပါဝင်စေတဲ့ functions တွေပါ။ ဒါတွေ ပါဝင်ပါတယ်:

- [`cookies()`](/docs/nextjs/cookies) — request cookies တွေကို ဝင်ရောက်ဖတ်ရှုခြင်း
- [`headers()`](/docs/nextjs/headers) — request headers တွေကို ဝင်ရောက်ဖတ်ရှုခြင်း
- [`searchParams`](/docs/nextjs/file-conventions-page) — URL query parameters တွေကို ဝင်ရောက်ဖတ်ရှုခြင်း
- [`draftMode()`](/docs/nextjs/draft-mode) — draft mode ကို ဖွင့်ခြင်း သို့မဟုတ် စစ်ဆေးခြင်း

### Runtime rendering

[Dynamic rendering](#dynamic-rendering) ကို ကြည့်ပါ။

### Revalidation

Revalidation ဆိုတာ cache လုပ်ထားတဲ့ data တွေကို update လုပ်တဲ့ လုပ်ငန်းစဉ်ပါ။ Time-based (အချိန်အခြေပြု) ဖြစ်နိုင်ပြီး — [`cacheLife()`](/docs/nextjs/cache-life) ကို သုံးပြီး cache ကြာချိန် သတ်မှတ်နိုင်သလို — on-demand လည်း ဖြစ်နိုင်ပြီး — [`cacheTag()`](/docs/nextjs/cache-tag) နဲ့ data တွေကို tag လုပ်ကာ [`updateTag()`](/docs/nextjs/update-tag) နဲ့ invalidate လုပ်နိုင်ပါတယ်။ [Caching and Revalidating](/docs/nextjs/caching) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Rewrite

Rewrite ဆိုတာ browser ထဲက URL ကို မပြောင်းဘဲ ဝင်လာတဲ့ request path တစ်ခုကို အခြား destination path တစ်ခုဆီ မြေပုံဆွဲပေး (map) တာပါ။ [`next.config.js`](/docs/nextjs/next-config-rewrites) ထဲမှာ configure လုပ်နိုင်သလို — [Proxy](/docs/nextjs/file-conventions-proxy) ကနေလည်း ပြန်ပို့နိုင်ပါတယ်။ External services (ပြင်ပ ဝန်ဆောင်မှုများ) သို့မဟုတ် legacy URLs (အဟောင်း URLs များ) တွေဆီ proxy လုပ်ဖို့ အသုံးဝင်ပါတယ်။

### Route Groups

Route Groups တွေဆိုတာ URL structure ကို မထိခိုက်စေဘဲ routes တွေကို စုစည်းဖို့ နည်းလမ်းတစ်ခုပါ။ Folder name တစ်ခုကို parentheses ထဲမှာ ထည့်ပြီး ဖန်တီးပါတယ် (ဥပမာ — `(marketing)`)။ Route groups တွေက ဆက်စပ်တဲ့ routes တွေကို စုစည်းပေးပြီး — group အလိုက် [layouts](#layout) တွေ ဖန်တီးနိုင်စေပါတယ်။ [Route Groups](/docs/nextjs/file-conventions-route-groups) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Route Handler

Route Handler ဆိုတာ route တစ်ခုအတွက် HTTP requests တွေကို ကိုင်တွယ်ပေးတဲ့ function တစ်ခုဖြစ်ပြီး — [`route.js` file](/docs/nextjs/file-conventions-route) တစ်ခုထဲမှာ သတ်မှတ်ပါတယ်။ Route Handlers တွေက Web Request နဲ့ Response APIs တွေကို အသုံးပြုပြီး — `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` methods တွေကို ကိုင်တွယ်နိုင်ပါတယ်။ [Route Handlers](/docs/nextjs/route-handlers) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Route Segment

Route Segment ဆိုတာ `app` directory ထဲက folder တစ်ခုနဲ့ သတ်မှတ်ထားတဲ့ URL path ရဲ့ အစိတ်အပိုင်း (slash နှစ်ခုကြားက) တစ်ခုပါ။ Folder တစ်ခုစီက URL structure ထဲမှာ segment တစ်ခုကို ကိုယ်စားပြုပါတယ်။ [Project Structure](/docs/nextjs/project-structure) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### RSC Payload

RSC Payload (React Server Component Payload) ဆိုတာ render လုပ်ပြီးသား React Server Components tree ရဲ့ ကျစ်လျစ်တဲ့ binary ကိုယ်စားပြုမှု (representation) တစ်ခုပါ။ Server Components တွေရဲ့ render လုပ်ထားတဲ့ ရလဒ်၊ Client Components တွေအတွက် placeholders တွေ၊ ပြီးတော့ သူတို့ကြားမှာ ပေးပို့တဲ့ props တွေ ပါဝင်ပါတယ်။ [Server and Client Components](/docs/nextjs/server-client-components) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## S

### Server Component

Server Component ဆိုတာ App Router ထဲမှာ default component အမျိုးအစားပါ။ Server Components တွေက server ပေါ်မှာ render လုပ်ပြီး — data တွေကို တိုက်ရိုက် fetch လုပ်နိုင်ကာ — client ရဲ့ JavaScript bundle ထဲကို မထည့်ပါဘူး။ သူတို့က state သို့မဟုတ် browser APIs တွေကို မသုံးနိုင်ပါဘူး။ [Server and Client Components](/docs/nextjs/server-client-components) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Server Action

Server Action ဆိုတာ Client Component တစ်ခုဆီ prop အဖြစ် ပေးပို့တဲ့ (သို့) form action တစ်ခုနဲ့ ချိတ်ဆက်ထားတဲ့ [Server Function](#server-function) တစ်ခုပါ။ Server Actions တွေကို form submissions (ဖောင်တင်သွင်းမှုများ) နဲ့ data mutations (ဒေတာပြောင်းလဲမှုများ) တွေအတွက် အသုံးများပါတယ်။ [Server Actions and Mutations](/docs/nextjs/server-actions) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Server Function

Server Function ဆိုတာ [`"use server"` directive](/docs/nextjs/use-server) နဲ့ မှတ်သားထားပြီး — server ပေါ်မှာ run တဲ့ asynchronous function တစ်ခုပါ။ Server Functions တွေကို Client Components တွေကနေ invoke (ခေါ်ယူ) လုပ်နိုင်ပါတယ်။ Client Component တစ်ခုဆီ prop အဖြစ် ပေးပို့တဲ့အခါ (သို့) form action တစ်ခုနဲ့ ချိတ်ဆက်တဲ့အခါ — သူတို့ကို [Server Actions](#server-action) လို့ ခေါ်ပါတယ်။ [React Server Functions](https://react.dev/reference/rsc/server-functions) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Static Export

Static Export ဆိုတာ HTML, CSS နဲ့ JavaScript files တွေပါတဲ့ fully static site (လုံးဝ static ဆိုက်) တစ်ခုကို ထုတ်လုပ်ပေးတဲ့ deployment mode တစ်ခုပါ။ `next.config.js` ထဲမှာ `output: 'export'` ဆိုပြီး သတ်မှတ်ခြင်းဖြင့် ဖွင့်နိုင်ပါတယ်။ Static exports တွေကို Node.js server မလိုဘဲ ဘယ် static file server ပေါ်မှာမဆို host လုပ်နိုင်ပါတယ်။ [Static Exports](/docs/nextjs/static-exports) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Static rendering

[Prerendering](#prerendering) ကို ကြည့်ပါ။

### Static Assets

Static Assets တွေဆိုတာ images, fonts, videos စတဲ့ — processing (ပြုပြင်ခြင်း) မလုပ်ဘဲ တိုက်ရိုက် serve လုပ်တဲ့ media files တွေပါ။ Static assets တွေကို ပုံမှန်အားဖြင့် `public` directory ထဲမှာ သိမ်းဆည်းပြီး — သူတို့ရဲ့ relative paths တွေနဲ့ ရည်ညွှန်းပါတယ်။ [Static Assets](/docs/nextjs/file-conventions-public-folder) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Static Shell

Static Shell ဆိုတာ browser ဆီ ချက်ချင်း serve လုပ်တဲ့ page တစ်ခုရဲ့ prerender လုပ်ထားတဲ့ HTML တည်ဆောက်ပုံပါ။ [Partial Prerendering](#partial-prerendering-ppr) နဲ့ဆိုရင် — static shell ထဲမှာ statically render လုပ်လို့ရတဲ့ content အားလုံး ပါဝင်ပြီး — နောက်မှ stream ဝင်လာမယ့် dynamic content တွေအတွက် [Suspense boundary](#suspense-boundary) fallbacks တွေလည်း ပါဝင်ပါတယ်။

### Streaming

Streaming ဆိုတာ page တစ်ခုလုံး render ပြီးတဲ့အထိ မစောင့်ဘဲ — အစိတ်အပိုင်းတွေ အသင့်ဖြစ်လာတာနဲ့ server က client ဆီ ပို့ပေးတဲ့ နည်းလမ်းတစ်ခုပါ။ [`loading.js`](/docs/nextjs/file-conventions-loading) (သို့) ကိုယ်တိုင် ရေးတဲ့ `<Suspense>` boundaries တွေနဲ့ အလိုအလျောက် ဖွင့်ပေးပါတယ်။ [Streaming guide](/docs/nextjs/streaming) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Suspense boundary

Suspense boundary ဆိုတာ async content တွေကို ထုပ်ပိုးပြီး — load လုပ်နေချိန်မှာ fallback UI ပြသပေးတဲ့ React [`<Suspense>`](https://react.dev/reference/react/Suspense) component တစ်ခုပါ။ Next.js မှာ Suspense boundaries တွေက [static shell](#static-shell) ဘယ်မှာ ဆုံးပြီး — [streaming](#streaming) ဘယ်မှာ စတင်တယ်ဆိုတာကို သတ်မှတ်ပေးကာ — [Partial Prerendering](#partial-prerendering-ppr) ကို ဖြစ်နိုင်စေပါတယ်။

## T

### Turbopack

Turbopack ဆိုတာ Next.js အတွက် တည်ဆောက်ထားတဲ့ မြန်ဆန်တဲ့ Rust-based bundler တစ်ခုပါ။ Turbopack က `next dev` အတွက် default bundler ဖြစ်ပြီး — `next build` မှာလည်း ရနိုင်ပါတယ်။ Webpack နဲ့ ယှဉ်ရင် compile ချိန် သိသိသာသာ မြန်ဆန်စေပါတယ်။ [Turbopack](/docs/nextjs/turbopack) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### Tree Shaking

Tree Shaking ဆိုတာ build လုပ်ငန်းစဉ်အတွင်း သင့် JavaScript bundles တွေထဲက အသုံးမပြုတော့တဲ့ code တွေကို ဖယ်ရှားတဲ့ လုပ်ငန်းစဉ်ပါ။ Next.js က bundle sizes တွေ လျှော့ချဖို့ သင့် code တွေကို အလိုအလျောက် tree-shake လုပ်ပေးပါတယ်။ [Package Bundling guide](/docs/nextjs/package-bundling) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## U

### URL data

URL data ဆိုတာ pathname နဲ့ query parameters လိုမျိုး — URL တစ်ခုကို သတ်မှတ်ဖော်ပြတဲ့ data ပါ။ App Router မှာဆိုရင် ဒါက [`params`](/docs/nextjs/file-conventions-page) နဲ့ [`searchParams`](/docs/nextjs/file-conventions-page) တွေကို ဆိုလိုပြီး — သူတို့ကို ဖတ်တဲ့ [`usePathname`](/docs/nextjs/use-pathname) နဲ့ [`useSearchParams`](/docs/nextjs/use-search-params) လိုမျိုး client hooks တွေလည်း ပါဝင်ပါတယ်။ URL data က session အလိုက် မဟုတ်ဘဲ link အလိုက် ပြောင်းလဲတာမို့ — shared [App Shell](#app-shell) တစ်ခုရဲ့ အစိတ်အပိုင်း မဖြစ်နိုင်ပါဘူး။

### "use cache" Directive

`"use cache"` Directive ဆိုတာ component (သို့) function တစ်ခုကို cache လုပ်လို့ရတဲ့အရာ (cacheable) အဖြစ် မှတ်သားပေးတဲ့ directive တစ်ခုပါ။ File တစ်ခုရဲ့ ထိပ်ဆုံးမှာ ထားရင် — အဲဒီ file ထဲက exports အားလုံး cacheable ဖြစ်ကြောင်း ဖော်ပြတာဖြစ်ပြီး — function (သို့) component တစ်ခုရဲ့ ထိပ်မှာ inline ထားရင် — အဲဒီ scope တစ်ခုတည်းကိုပဲ cacheable အဖြစ် မှတ်သားပေးပါတယ်။ [`"use cache"` reference](/docs/nextjs/use-cache) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### "use client" Directive

`"use client"` Directive ဆိုတာ server နဲ့ client code ကြားက နယ်နိမိတ်ကို မှတ်သားပေးတဲ့ အထူး React directive တစ်ခုပါ။ ဒါကို file တစ်ခုရဲ့ ထိပ်ဆုံး — imports (သို့) အခြား code တွေ မတိုင်မီမှာ ထားရပါမယ်။ React Components, helper functions, variable declarations တွေနဲ့ import လုပ်ထားတဲ့ dependencies အားလုံးကို [client bundle](#client-bundles) ထဲမှာ ထည့်သွင်းသင့်ကြောင်း ဖော်ပြပါတယ်။ [`"use client"` reference](/docs/nextjs/use-client) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

### "use server" Directive

`"use server"` Directive ဆိုတာ function တစ်ခုကို client-side code ကနေ ခေါ်နိုင်တဲ့ [Server Function](#server-function) တစ်ခုအဖြစ် မှတ်သားပေးတဲ့ directive ပါ။ File တစ်ခုရဲ့ ထိပ်ဆုံးမှာ ထားရင် — file ထဲက exports အားလုံး Server Functions တွေ ဖြစ်ကြောင်း ဖော်ပြတာဖြစ်ပြီး — function တစ်ခုရဲ့ ထိပ်မှာ inline ထားရင် — အဲဒီ function တစ်ခုတည်းကိုပဲ မှတ်သားပေးပါတယ်။ [`"use server"` reference](/docs/nextjs/use-server) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။

## V

### Version skew

Version skew ဆိုတာ — သင့် application ရဲ့ version အသစ်တစ်ခုကို deploy လုပ်ပြီးတဲ့အခါ — အသုံးပြုနေဆဲ clients တွေက build အဟောင်းတစ်ခုရဲ့ JavaScript, CSS (သို့) data တွေကို ရည်ညွှန်းနေတာမျိုး ဖြစ်ပါတယ်။ Client နဲ့ server versions ကြားက ဒီမကိုက်ညီမှုကို version skew လို့ ခေါ်ပြီး — assets တွေ ပျောက်ဆုံးခြင်း၊ Server Action errors တွေနဲ့ navigation မအောင်မြင်ခြင်းတွေကို ဖြစ်စေနိုင်ပါတယ်။ Next.js က [`deploymentId`](/docs/nextjs/next-config-deployment-id) ကို သုံးပြီး version skew ကို ရှာဖွေဖော်ထုတ်ကာ ကိုင်တွယ်ပေးပါတယ်။ [Self-Hosting - Version Skew](/docs/nextjs/self-hosting) မှာ ဆက်လက်လေ့လာနိုင်ပါတယ်။
