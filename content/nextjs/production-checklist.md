---
title: "Production Checklist (production အတွက် ပြင်ဆင်ခြင်း)"
description: "သင့် Next.js application ကို production မတင်ခင်မှာ အကောင်းဆုံး performance, user experience နဲ့ security ရဖို့ လိုက်နာသင့်တဲ့ optimizations နဲ့ patterns များ — automatic optimizations, development ကာလ စစ်ဆေးစရာများ, production မတိုင်ခင် ပြင်ဆင်ချက်များ"
order: 113
source: "https://nextjs.org/docs/app/guides/production-checklist"
status: translated
updated: 2026-09-03
---

သင့် Next.js application ကို production မတင်ခင်မှာ — အကောင်းဆုံး user experience, performance နဲ့ security ရဖို့ အောက်ပါ optimizations နဲ့ patterns တွေကို ထည့်သွင်း စဉ်းစားသင့်ပါတယ်။

ဒီ page က [application တည်ဆောက်နေစဉ်](#during-development) နဲ့ [production မတိုင်ခင်](#before-going-to-production) တွေမှာ reference အနေနဲ့ သုံးနိုင်တဲ့ best practices တွေ — သိထားသင့်တဲ့ [Next.js ရဲ့ automatic optimizations](#automatic-optimizations) တွေနဲ့အတူ — ဖော်ပြပေးပါတယ်။

## Automatic optimizations (အလိုအလျောက် ပြုလုပ်ပေးသော ပိုမိုကောင်းမွန်အောင် ပြုလုပ်ချက်များ)

ဒီ Next.js optimizations တွေက default အားဖြင့် ဖွင့်ထားပြီး — configuration ဘာမှ မလိုအပ်ပါဘူး:

- **[Server Components](/docs/nextjs/server-client-components):** Next.js က Server Components တွေကို default အနေနဲ့ သုံးပါတယ်။ Server Components တွေက server ပေါ်မှာ run ပြီး — client မှာ render လုပ်ဖို့ JavaScript မလိုအပ်ပါဘူး။ ဒါကြောင့် သင့် client-side JavaScript bundle တွေရဲ့ အရွယ်အစားကို သူတို့က ထိခိုက်စေမှာ မဟုတ်ပါဘူး။ Interactivity လိုအပ်တဲ့အခါမှာတော့ [Client Components](/docs/nextjs/server-client-components) တွေကို လိုအပ်သလို သုံးနိုင်ပါတယ်။
- **[Code-splitting](https://nextjs.org/docs/app/getting-started/linking-and-navigating#how-navigation-works):** Server Components တွေက route segments တစ်ခုချင်းစီအလိုက် code ကို အလိုအလျောက် ခွဲထုတ်ပေးနိုင်စေပါတယ်။ Client Components နဲ့ third-party libraries တွေကို သင့်တော်တဲ့နေရာတွေမှာ [lazy loading](/docs/nextjs/lazy-loading) လုပ်ဖို့လည်း စဉ်းစားနိုင်ပါတယ်။
- **[Prefetching](https://nextjs.org/docs/app/getting-started/linking-and-navigating#prefetching):** Route အသစ်တစ်ခုဆီက link တစ်ခုက user ရဲ့ viewport ထဲ ရောက်လာတဲ့အခါ — Next.js က အဲဒီ route ကို background မှာ prefetch လုပ်ပါတယ်။ ဒါက route အသစ်တွေဆီ သွားတာကို ချက်ချင်းနီးပါး ဖြစ်စေပါတယ်။ သင့်တော်တဲ့နေရာတွေမှာ prefetching ကို ပိတ်ထားနိုင်ပါတယ်။
- **[Prerendering](https://nextjs.org/docs/app/glossary#prerendering):** Next.js က Server နဲ့ Client Components တွေကို build အချိန်မှာ server ပေါ်တွင် prerender လုပ်ပြီး — သင့် application ရဲ့ performance ကို မြှင့်တင်ဖို့ render လုပ်ထားတဲ့ ရလဒ်ကို cache လုပ်ပါတယ်။ သင့်တော်တဲ့ route တွေအတွက်တော့ [Dynamic Rendering](https://nextjs.org/docs/app/glossary#dynamic-rendering) ကို opt in လုပ်နိုင်ပါတယ်။
- **[Caching](/docs/nextjs/caching):** Next.js က data requests, Server နဲ့ Client Components တွေရဲ့ rendered results, static assets စတာတွေကို cache လုပ်ပြီး — သင့် server, database နဲ့ backend services တွေဆီ ပို့ရတဲ့ network requests အရေအတွက်ကို လျှော့ချပေးပါတယ်။ သင့်တော်တဲ့နေရာတွေမှာ caching ကနေ opt out လုပ်နိုင်ပါတယ်။

ဒီ default တွေက သင့် application ရဲ့ performance ကို မြှင့်တင်ဖို့နဲ့ — network request တစ်ခုချင်းစီမှာ transfer လုပ်ရတဲ့ data ပမာဏနဲ့ စရိတ်ကို လျှော့ချဖို့ ရည်ရွယ်ပါတယ်။

## During development (Development ကာလအတွင်း)

Application တည်ဆောက်နေစဉ်မှာ — အကောင်းဆုံး performance နဲ့ user experience ရဖို့ အောက်ပါ features တွေကို သုံးဖို့ အကြံပြုပါတယ်:

### Routing နဲ့ Rendering

- **[Layouts](/docs/nextjs/file-conventions-layout):** Pages တွေအနှံ့ UI တွေကို မျှဝေဖို့နဲ့ navigation မှာ [partial rendering](https://nextjs.org/docs/app/getting-started/linking-and-navigating#client-side-transitions) ရအောင် layouts တွေကို သုံးပါ။
- **[`<Link>` component](/docs/nextjs/component-link):** [Client-side navigation နဲ့ prefetching](https://nextjs.org/docs/app/getting-started/linking-and-navigating#how-navigation-works) အတွက် `<Link>` component ကို သုံးပါ။
- **[Error Handling](/docs/nextjs/error-handling):** Production မှာ [catch-all errors တွေ](/docs/nextjs/error-handling) နဲ့ [404 errors တွေ](/docs/nextjs/not-found) ကို — custom error pages တွေ ဖန်တီးပြီး ချောမွေ့စွာ ကိုင်တွယ်ပါ။
- **[Client နဲ့ Server Components](/docs/nextjs/server-client-components):** Server နဲ့ Client Components တွေအတွက် အကြံပြုထားတဲ့ composition patterns တွေကို လိုက်နာပြီး — သင့် client-side JavaScript bundle ကို မလိုအပ်ဘဲ မကြီးအောင် [`"use client"` boundaries တွေရဲ့ နေရာချထားမှု](/docs/nextjs/server-client-components) ကို စစ်ဆေးပါ။
- **Request-time APIs:** [`cookies`](/docs/nextjs/cookies) နဲ့ [`searchParams`](/docs/nextjs/file-conventions-page) prop လို Request-time APIs တွေက route တစ်ခုလုံးကို [Dynamic Rendering](https://nextjs.org/docs/app/glossary#dynamic-rendering) ထဲ ထည့်သွားစေတယ်ဆိုတာ သတိထားပါ ([Root Layout](/docs/nextjs/file-conventions-layout) မှာ သုံးရင် သင့် application တစ်ခုလုံး ဖြစ်သွားနိုင်ပါတယ်)။ Request-time API သုံးတာတွေ ရည်ရွယ်ချက်ရှိရှိ ဖြစ်ကြောင်း သေချာစေပြီး — သင့်တော်တဲ့နေရာတွေမှာ `<Suspense>` boundaries တွေနဲ့ wrap လုပ်ပါ။

> **သိထားသင့်သည်**: [Partial Prerendering (experimental)](https://nextjs.org/blog/next-14#partial-prerendering-preview) က route တစ်ခုရဲ့ အစိတ်အပိုင်းတချို့ကို — route တစ်ခုလုံး dynamic rendering ထဲ မရောက်ဘဲ — dynamic ဖြစ်စေနိုင်ပါလိမ့်မယ်။

### Data Fetching နဲ့ Caching

- **[Server Components](/docs/nextjs/data-fetching):** Server Components တွေနဲ့ server ပေါ်မှာ data fetch လုပ်ခြင်းရဲ့ အကျိုးကျေးဇူးတွေကို အသုံးချပါ။
- **[Route Handlers](/docs/nextjs/file-conventions-route):** Client Components တွေကနေ သင့် backend resources တွေကို ဝင်ရောက်ဖို့ Route Handlers တွေကို သုံးပါ။ ဒါပေမယ့် — server request အပိုတစ်ခု မဖြစ်အောင် Server Components တွေကနေ Route Handlers တွေကို မခေါ်ပါနဲ့။
- **[Streaming](/docs/nextjs/file-conventions-loading):** Loading UI နဲ့ React Suspense ကို သုံးပြီး — UI တွေကို server ကနေ client ဆီ တဖြည်းဖြည်းချင်း ပို့ပေးကာ data fetch လုပ်နေချိန်မှာ route တစ်ခုလုံး ပိတ်မနေအောင် ကာကွယ်ပါ။
- **[Parallel Data Fetching](/docs/nextjs/data-fetching):** သင့်တော်တဲ့နေရာတွေမှာ data တွေကို တစ်ပြိုင်နက် fetch လုပ်ပြီး network waterfalls တွေကို လျှော့ချပါ။
- **[Data Caching](/docs/nextjs/caching):** သင့် data requests တွေ cache လုပ်ခံရလား မလုပ်ခံရဘူးလား စစ်ဆေးပြီး — သင့်တော်တဲ့နေရာတွေမှာ caching ကို opt in လုပ်ပါ။ `fetch` မသုံးတဲ့ requests တွေ [cache](https://nextjs.org/docs/app/api-reference/functions/unstable_cache) လုပ်ခံရကြောင်း သေချာပါစေ။
- **[Static Images](/docs/nextjs/file-conventions-public-folder):** `public` directory ကို သုံးပြီး — သင့် application ရဲ့ static assets တွေ (ဥပမာ images) ကို အလိုအလျောက် cache လုပ်ပါ။

### UI နဲ့ Accessibility

- **[Forms နဲ့ Validation](/docs/nextjs/forms):** Form submissions, server-side validation နဲ့ errors တွေကို ကိုင်တွယ်ဖို့ Server Actions တွေကို သုံးပါ။
- **[Global Error UI](/docs/nextjs/file-conventions-error):** သင့် app တစ်ခုလုံးမှာ ဖမ်းမိနိုင်ခြင်း မရှိတဲ့ (uncaught) errors တွေအတွက် — တသမတ်တည်း၊ accessible ဖြစ်တဲ့ fallback UI နဲ့ recovery ပေးဖို့ `app/global-error.tsx` ကို ထည့်ပါ။
- **[Global 404](/docs/nextjs/not-found):** သင့် app တစ်ခုလုံးမှာ မကိုက်ညီတဲ့ routes တွေအတွက် accessible 404 တစ်ခု ပေးဖို့ `app/global-not-found.tsx` ကို ထည့်ပါ။

- **[Font Module](/docs/nextjs/component-font):** Font Module ကို သုံးပြီး fonts တွေကို optimize လုပ်ပါ — ဒါက သင့် font files တွေကို တခြား static assets တွေနဲ့အတူ အလိုအလျောက် host လုပ်ပေးပြီး၊ external network requests တွေကို ဖယ်ရှားကာ [layout shift](https://web.dev/articles/cls) တွေကို လျှော့ချပေးပါတယ်။
- **[`<Image>` Component](/docs/nextjs/component-image):** Image Component ကို သုံးပြီး images တွေကို optimize လုပ်ပါ — ဒါက images တွေကို အလိုအလျောက် optimize လုပ်ပေးပြီး layout shift တွေကို ကာကွယ်ကာ WebP လို ခေတ်မီ format တွေနဲ့ ပို့ပေးပါတယ်။
- **[`<Script>` Component](https://nextjs.org/docs/app/guides/scripts):** Script Component ကို သုံးပြီး third-party scripts တွေကို optimize လုပ်ပါ — ဒါက scripts တွေကို အလိုအလျောက် defer လုပ်ပြီး main thread ကို မပိတ်ဆို့အောင် ကာကွယ်ပေးပါတယ်။
- **[ESLint](https://nextjs.org/docs/architecture/accessibility#linting):** Built-in `eslint-plugin-jsx-a11y` plugin ကို သုံးပြီး accessibility ပြဿနာတွေကို စောစောစီးစီး ဖမ်းမိပါစေ။

### Security

- **[Tainting](https://nextjs.org/docs/app/api-reference/config/next-config-js/taint):** Data objects နဲ့/သို့မဟုတ် တန်ဖိုး သီးသန့်တွေကို taint လုပ်ပြီး — sensitive data တွေ client ဆီ မရောက်အောင် ကာကွယ်ပါ။
- **[Server Actions](https://nextjs.org/docs/app/getting-started/mutating-data):** Action တစ်ခုချင်းစီ အတွင်းမှာ authentication နဲ့ authorization ကို verify လုပ်ပါ။ Proxy (သို့) layout (သို့) page level checks တစ်ခုတည်းကိုပဲ အားမကိုးပါနဲ့။ Database access တွေကို `server-only` [Data Access Layer](https://nextjs.org/docs/app/guides/data-security#data-access-layer) တစ်ခုဆီ ရွှေ့ပြီး — စရိတ်ကြီးတဲ့ operations တွေအတွက် [rate limiting](https://nextjs.org/docs/app/guides/backend-for-frontend#rate-limiting) ကို စဉ်းစားပါ။ အကြံပြုထားတဲ့ [security practices](https://nextjs.org/blog/security-nextjs-server-components-actions) တွေကို ပြန်လည် သုံးသပ်ပါ။

- **[Environment Variables](/docs/nextjs/environment-variables):** သင့် `.env.*` files တွေကို `.gitignore` ထဲ ထည့်ထားပြီး — public variables တွေကိုပဲ `NEXT_PUBLIC_` နဲ့ ရှေ့ဆွဲထားကြောင်း သေချာပါစေ။
- **[Content Security Policy](https://nextjs.org/docs/app/guides/content-security-policy):** Cross-site scripting, clickjacking နဲ့ တခြား code injection attacks တွေလို security အန္တရာယ်တွေကနေ သင့် application ကို ကာကွယ်ဖို့ Content Security Policy တစ်ခု ထည့်သွင်း စဉ်းစားပါ။

### Metadata နဲ့ SEO

- **[Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images):** Page titles, descriptions စတာတွေ ထည့်ပြီး — သင့် application ရဲ့ Search Engine Optimization (SEO) ကို မြှင့်တင်ဖို့ Metadata API ကို သုံးပါ။
- **[Open Graph (OG) images](/docs/nextjs/opengraph-image):** Social sharing အတွက် သင့် application ကို ပြင်ဆင်ဖို့ OG images တွေ ဖန်တီးပါ။
- **[Sitemaps](/docs/nextjs/generate-sitemaps) နဲ့ [Robots](/docs/nextjs/robots):** Sitemaps နဲ့ robots files တွေ generate လုပ်ပြီး — Search Engines တွေ သင့် pages တွေကို crawl လုပ်ပြီး index လုပ်နိုင်အောင် ကူညီပါ။

### Type safety

- **TypeScript နဲ့ [TS Plugin](https://nextjs.org/docs/app/api-reference/config/typescript):** TypeScript နဲ့ TypeScript plugin ကို သုံးပြီး — type-safety ပိုကောင်းအောင် လုပ်ကာ errors တွေကို စောစောစီးစီး ဖမ်းမိပါစေ။

## Before going to production (Production မတိုင်မီ)

Production မတင်ခင် — `next build` ကို run ပြီး သင့် application ကို local မှာ build လုပ်ကာ build errors တွေ ရှိမရှိ ဖမ်းမိနိုင်ပြီး — နောက်မှ `next start` ကို run ပြီး production နဲ့ ဆင်တူတဲ့ environment တစ်ခုမှာ သင့် application ရဲ့ performance ကို တိုင်းတာနိုင်ပါတယ်။

### Core Web Vitals

- **[Lighthouse](https://developers.google.com/web/tools/lighthouse):** Incognito mode မှာ Lighthouse ကို run ပြီး — သင့် site ကို user တွေ ဘယ်လို ခံစားရမလဲ ပိုနားလည်စေပြီး တိုးတက်အောင် လုပ်ရမယ့် နေရာတွေကို ဖော်ထုတ်နိုင်ပါတယ်။ ဒါက simulated test တစ်ခုဖြစ်လို့ — field data (Core Web Vitals လိုမျိုး) တွေကို ကြည့်တာနဲ့ တွဲသုံးသင့်ပါတယ်။
- **[`useReportWebVitals` hook](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals):** ဒီ hook ကို သုံးပြီး [Core Web Vitals](https://web.dev/articles/vitals) data တွေကို analytics tools တွေဆီ ပို့ပါ။

### Bundles တွေကို ခွဲခြမ်းစိတ်ဖြာခြင်း

သင့် JavaScript bundles တွေရဲ့ အရွယ်အစားကို ခွဲခြမ်းစိတ်ဖြာပြီး — သင့် application ရဲ့ performance ကို ထိခိုက်စေနိုင်တဲ့ large modules နဲ့ dependencies တွေကို ဖော်ထုတ်ဖို့ [`@next/bundle-analyzer` plugin](https://nextjs.org/docs/app/guides/package-bundling#nextbundle-analyzer-for-webpack) ကို သုံးပါ။

ဒါ့အပြင် အောက်ပါ tools တွေက သင့် application ဆီ dependency အသစ်တွေ ထည့်ခြင်းရဲ့ အကျိုးသက်ရောက်မှုကို နားလည်ဖို့ ကူညီနိုင်ပါတယ်:

- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
- [Package Phobia](https://packagephobia.com/)
- [Bundle Phobia](https://bundlephobia.com/)
- [bundlejs](https://bundlejs.com/)
