---
title: "React App တစ်ခုကို အစကနေ တည်ဆောက်ခြင်း (Build from Scratch)"
description: "Framework မသုံးဘဲ React app တစ်ခုကို အစကနေ တည်ဆောက်ခြင်း — build tool (Vite/Parcel/Rsbuild) တပ်ဆင်ခြင်း၊ routing ၊ data fetching ၊ code-splitting စတဲ့ အသုံးများတဲ့ application pattern များ"
order: 41
source: "https://react.dev/learn/build-a-react-app-from-scratch"
status: translated
updated: 2026-09-02
---

သင့် app မှာ — ရှိပြီးသား frameworks တွေနဲ့ ကောင်းကောင်း မဖြည့်ဆည်းနိုင်တဲ့ ကန့်သတ်ချက်တွေ ရှိနေရင်၊ ကိုယ်ပိုင် framework တစ်ခု တည်ဆောက်ချင်ရင်၊ ဒါမှမဟုတ် — React app တစ်ခုရဲ့ အခြေခံတွေကိုပဲ လေ့လာချင်ရင် — React app တစ်ခုကို အစကနေ (from scratch) တည်ဆောက်နိုင်ပါတယ်။

#### Framework တစ်ခု သုံးဖို့ စဉ်းစားပါ

အစကနေ စတင်တာက React သုံးဖို့ လွယ်ကူတဲ့ နည်းလမ်းတစ်ခုပါ — ဒါပေမယ့် — သတိထားရမယ့် အဓိက အပေးအယူတစ်ခုက — ဒီလမ်းကြောင်းကို လိုက်တာက — ကိုယ်ပိုင် adhoc framework တစ်ခု တည်ဆောက်နေတာနဲ့ မကြာခဏ တူညီနေတာပါ။ သင့်လိုအပ်ချက်တွေ ပြောင်းလဲလာတာနဲ့အမျှ — အကြံပြုထားတဲ့ frameworks တွေမှာ ကောင်းကောင်း ဖွံ့ဖြိုးပြီး ပံ့ပိုးထားပြီးသား ဖြေရှင်းနည်းတွေ ရှိတဲ့ — framework ပုံစံ ပြဿနာတွေ ပိုပိုပြီး ဖြေရှင်းရနိုင်ပါတယ်။

ဥပမာ — နောင်မှာ သင့် app က server-side rendering (SSR)၊ static site generation (SSG) နဲ့/ဒါမှမဟုတ် React Server Components (RSC) တွေကို ပံ့ပိုးဖို့ လိုအပ်လာရင် — အဲဒါတွေကို ကိုယ်တိုင် အကောင်အထည်ဖော်ရပါလိမ့်မယ်။ အလားတူပဲ — framework level မှာ ပေါင်းစပ်ဖို့ လိုအပ်တဲ့ — နောင် React features တွေကိုလည်း — သုံးချင်ရင် — ကိုယ်တိုင်ပဲ အကောင်အထည်ဖော်ရပါလိမ့်မယ်။

အကြံပြုထားတဲ့ frameworks တွေက — ပိုကောင်းတဲ့ performance ရှိတဲ့ apps တွေ တည်ဆောက်ဖို့လည်း ကူညီပါတယ်။ ဥပမာ — network request တွေရဲ့ waterfalls တွေကို လျှော့ချတာ ဒါမှမဟုတ် ဖယ်ရှားတာက — user experience ပိုကောင်းစေပါတယ်။ Toy project တစ်ခု တည်ဆောက်နေတုန်းတော့ ဒါက ဦးစားပေးစရာ မဟုတ်သေးပေမယ့် — သင့် app မှာ user တွေ ရှိလာရင်တော့ — performance ကို မြှင့်တင်ချင်ပါလိမ့်မယ်။

ဒီလမ်းကြောင်းက — support ရဖို့လည်း ပိုခက်ခဲစေပါတယ် — ဘာလို့လဲဆိုတော့ — routing၊ data-fetching စတဲ့ features တွေကို သင် ဖွံ့ဖြိုးတဲ့ နည်းလမ်းက သင့်အခြေအနေအတွက်ပဲ ထူးခြားနေလို့ပါ။ ဒီပြဿနာတွေကို ကိုယ်တိုင် ဖြေရှင်းဖို့ အဆင်သင့်ဖြစ်နေမှ ဒါမှမဟုတ် — ဒီ features တွေ ဘယ်တော့မှ မလိုအပ်ဘူးဆိုတာ ယုံကြည်မှု ရှိမှပဲ — ဒီ option ကို ရွေးသင့်ပါတယ်။

အကြံပြုထားတဲ့ frameworks တွေရဲ့ စာရင်းအတွက် — [Creating a React App](/docs/react/creating-a-react-app) ကို ကြည့်ပါ။

## အဆင့် 1: Build Tool တစ်ခု တပ်ဆင်ခြင်း

ပထမဆုံး အဆင့်က — `vite`၊ `parcel` ဒါမှမဟုတ် `rsbuild` လိုမျိုး — build tool တစ်ခု တပ်ဆင်ဖို့ပါ။ ဒီ build tools တွေက — source code တွေကို package လုပ်ပြီး run ဖို့၊ local development အတွက် development server တစ်ခု ပေးဖို့၊ သင့် app ကို production server တစ်ခုဆီ deploy လုပ်ဖို့ build command တစ်ခု ပေးဖို့ — စတဲ့ features တွေ ပံ့ပိုးပေးပါတယ်။

### Vite

[Vite](https://vite.dev/) က — ခေတ်မီ web projects တွေအတွက် — ပိုမြန်ဆန်ပြီး ပေါ့ပါးတဲ့ development experience တစ်ခု ရည်ရွယ်ပေးတဲ့ — build tool တစ်ခုပါ။

```bash
npm create vite@latest my-app -- --template react-ts
```

Vite က opinionated ဖြစ်ပြီး — box ထဲက ထွက်တာနဲ့ — သင့်တော်တဲ့ defaults တွေ ပါလာပါတယ်။ Vite မှာ — fast refresh၊ JSX၊ Babel/SWC နဲ့ တခြား အသုံးများတဲ့ features တွေကို ပံ့ပိုးဖို့ — plugin ecosystem ကြွယ်ဝပါတယ်။ စတင်ဖို့ Vite ရဲ့ [React plugin](https://vite.dev/plugins/#vitejs-plugin-react) ဒါမှမဟုတ် [React SWC plugin](https://vite.dev/plugins/#vitejs-plugin-react-swc) နဲ့ [React SSR example project](https://vite.dev/guide/ssr.html#example-projects) တို့ကို ကြည့်ပါ။

Vite ကို အကြံပြုထားတဲ့ [frameworks](/docs/react/creating-a-react-app) တွေထဲက တစ်ခုဖြစ်တဲ့ — [React Router](https://reactrouter.com/start/framework/installation) မှာလည်း — build tool အဖြစ် သုံးထားပြီးသားပါ။

### Parcel

[Parcel](https://parceljs.org/) က — out-of-the-box development experience ကောင်းတစ်ခုကို — project ကို စတင်ခါစကနေ ကြီးမားတဲ့ production applications တွေအထိ ယူဆောင်သွားနိုင်တဲ့ — scalable architecture တစ်ခုနဲ့ ပေါင်းစပ်ပေးပါတယ်။

```bash
npm install --save-dev parcel
```

Parcel က fast refresh၊ JSX၊ TypeScript၊ Flow နဲ့ styling တွေကို out of the box ပံ့ပိုးပါတယ်။ စတင်ဖို့ [Parcel ရဲ့ React recipe](https://parceljs.org/recipes/react/#getting-started) ကို ကြည့်ပါ။

### Rsbuild

[Rsbuild](https://rsbuild.dev/) က — Rspack ကို အားပြုထားတဲ့ — React applications တွေအတွက် ချောမွေ့တဲ့ development experience တစ်ခု ပေးစွမ်းတဲ့ — build tool တစ်ခုပါ။ ဂရုတစိုက် ချိန်ညှိထားတဲ့ defaults တွေနဲ့ — spot ready performance optimizations တွေ ပါလာပါတယ်။

```bash
npx create-rsbuild --template react
```

Rsbuild မှာ — fast refresh၊ JSX၊ TypeScript နဲ့ styling လိုမျိုး React features တွေအတွက် — built-in support ပါဝင်ပါတယ်။ စတင်ဖို့ [Rsbuild ရဲ့ React guide](https://rsbuild.dev/guide/framework/react) ကို ကြည့်ပါ။

> **မှတ်ချက် — React Native အတွက် Metro**
>
> React Native နဲ့ အစကနေ စတင်နေတယ်ဆိုရင် — React Native အတွက် JavaScript bundler ဖြစ်တဲ့ [Metro](https://metrobundler.dev/) ကို သုံးရပါလိမ့်မယ်။ Metro က iOS နဲ့ Android လိုမျိုး platforms တွေအတွက် bundling ကို ပံ့ပိုးပေမယ့် — ဒီမှာရှိတဲ့ tools တွေနဲ့ ယှဉ်ရင် — features အများကြီး ချို့တဲ့ပါတယ်။ သင့် project က React Native ပံ့ပိုးမှု မလိုအပ်ဘူးဆိုရင် — Vite၊ Parcel ဒါမှမဟုတ် Rsbuild နဲ့ စတင်ဖို့ အကြံပြုပါတယ်။

## အဆင့် 2: အသုံးများတဲ့ Application Patterns တွေ တည်ဆောက်ခြင်း

အထက်မှာ ဖော်ပြထားတဲ့ build tools တွေက — client-only, single-page app (SPA) တစ်ခုနဲ့ စတင်ပေးပါတယ် — ဒါပေမယ့် — routing၊ data fetching ဒါမှမဟုတ် styling လိုမျိုး — အသုံးများတဲ့ လုပ်ဆောင်ချက်တွေအတွက် နောက်ထပ် ဖြေရှင်းနည်းတွေတော့ မပါဝင်ပါဘူး။

React ecosystem ထဲမှာ ဒီပြဿနာတွေအတွက် tools အများကြီး ရှိပါတယ်။ စတင်ဖို့ နေရာအဖြစ် အသုံးများတဲ့ tools အနည်းငယ်ကို စာရင်းပြုထားပါတယ် — ဒါပေမယ့် — သင့်အတွက် ပိုအဆင်ပြေမယ့် တခြား tools တွေကိုလည်း လွတ်လပ်စွာ ရွေးချယ်နိုင်ပါတယ်။

### Routing

Routing က — user တစ်ယောက်က URL တစ်ခုခုကို လာလည်တဲ့အခါ — ဘယ် content ဒါမှမဟုတ် ဘယ်စာမျက်နှာတွေကို ပြရမလဲဆိုတာ ဆုံးဖြတ်ပေးပါတယ်။ URLs တွေကို သင့် app ရဲ့ အစိတ်အပိုင်း မတူညီတာတွေနဲ့ မြေပုံဆွဲဖို့ — router တစ်ခု setup လုပ်ဖို့ လိုပါတယ်။ Nested routes တွေ၊ route parameters တွေ၊ query parameters တွေကိုလည်း ကိုင်တွယ်ဖို့ လိုပါလိမ့်မယ်။ Routers တွေကို သင့် code ထဲမှာ configure လုပ်နိုင်သလို — သင့် component folder/file structures တွေအပေါ် အခြေခံပြီးလည်း သတ်မှတ်နိုင်ပါတယ်။

Routers တွေက ခေတ်မီ applications တွေရဲ့ အဓိက အစိတ်အပိုင်းဖြစ်ပြီး — မကြာခဏဆိုသလို — data fetching (စာမျက်နှာတစ်ခုလုံးအတွက် data ကို ပိုမြန်အောင် load လုပ်ဖို့ prefetching အပါအဝင်)၊ code splitting (client bundle sizes တွေ အနည်းဆုံးဖြစ်အောင်) နဲ့ page rendering ချဉ်းကပ်နည်းတွေ (စာမျက်နှာတစ်ခ်စီကို ဘယ်လို generate လုပ်မလဲ ဆုံးဖြတ်ဖို့) — တို့နဲ့ ပေါင်းစပ်ထားလေ့ ရှိပါတယ်။

ဒါတွေကို သုံးဖို့ အကြံပြုပါတယ်:

- [React Router](https://reactrouter.com/start/data/custom)
- [Tanstack Router](https://tanstack.com/router/latest)

### Data Fetching

Server တစ်ခု ဒါမှမဟုတ် တခြား data source တစ်ခုကနေ data တွေ ဆွဲယူတာက — application အများစုရဲ့ အဓိက အစိတ်အပိုင်းပါ။ ဒါကို မှန်ကန်စွာ လုပ်ဖို့ — loading states တွေ၊ error states တွေ၊ fetch လုပ်ထားတဲ့ data တွေကို caching လုပ်တာတွေ ကိုင်တွယ်ဖို့ လိုပြီး — ဒါတွေက ရှုပ်ထွေးနိုင်ပါတယ်။

ရည်ရွယ်ချက်နဲ့ တည်ဆောက်ထားတဲ့ data fetching libraries တွေက — data တွေကို fetch လုပ်ပြီး cache လုပ်တဲ့ အလုပ်ကို သင့်အတွက် လုပ်ပေးလို့ — သင့် app က ဘယ် data တွေ လိုအပ်လဲ၊ သူတို့ကို ဘယ်လို ပြသမလဲဆိုတာကိုပဲ အာရုံစိုက်နိုင်ပါတယ်။ ဒီ libraries တွေကို ပုံမှန်အားဖြင့် သင့် components တွေထဲမှာ တိုက်ရိုက် သုံးပေမယ့် — ပိုမြန်တဲ့ pre-fetching နဲ့ performance ပိုကောင်းဖို့ routing loaders တွေထဲမှာရော — server rendering ထဲမှာပါ — ပေါင်းစပ်နိုင်ပါတယ်။

Components တွေထဲမှာ data တွေကို တိုက်ရိုက် fetch လုပ်တာက — network request waterfalls တွေကြောင့် — loading အချိန် ပိုနှေးစေနိုင်တာ သတိပြုပါ — ဒါကြောင့် — router loaders တွေ ဒါမှမဟုတ် server ပေါ်မှာ — တတ်နိုင်သမျှ data တွေကို prefetch လုပ်ဖို့ အကြံပြုပါတယ်! ဒါက စာမျက်နှာတစ်ခုရဲ့ data တွေကို — စာမျက်နှာ ပြသနေချိန်မှာ — တစ်ပြိုင်နက်တည်း fetch လုပ်နိုင်စေပါတယ်။

Backends အများစု ဒါမှမဟုတ် REST-style APIs တွေကနေ data fetch လုပ်နေရင် — ဒါတွေကို သုံးဖို့ အကြံပြုပါတယ်:

- [TanStack Query](https://tanstack.com/query/)
- [SWR](https://swr.vercel.app/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)

GraphQL API တစ်ခုကနေ data fetch လုပ်နေရင်တော့ — ဒါတွေကို အကြံပြုပါတယ်:

- [Apollo](https://www.apollographql.com/docs/react)
- [Relay](https://relay.dev/)

### Code-Splitting

Code-splitting က — သင့် app ကို — လိုအပ်တဲ့အခါမှပဲ load လုပ်လို့ရတဲ့ — bundle ငယ်ငယ်လေးတွေအဖြစ် ခွဲထုတ်တဲ့ လုပ်ငန်းစဉ်ပါ။ App တစ်ခုရဲ့ code အရွယ်အစားက — feature အသစ်တိုင်းနဲ့ dependency အပိုတိုင်းနဲ့အတူ — တိုးလာပါတယ်။ App တစ်ခုလုံးရဲ့ code အားလုံးကို မသုံးခင် ပို့ပေးရတာမို့ — Apps တွေက load ဖို့ နှေးကွေးလာနိုင်ပါတယ်။ Caching လုပ်တာ၊ features/dependencies တွေ လျှော့ချတာ၊ code တစ်ချို့ကို server ပေါ်မှာ run ဖို့ ရွှေ့တာတွေက နှေးကွေးတဲ့ loading ကို သက်သာစေနိုင်ပေမယ့် — အလွန်အကျွံ သုံးရင် လုပ်ဆောင်ချက်တွေ စတေးရတဲ့ — မပြည့်စုံတဲ့ ဖြေရှင်းနည်းတွေပါ။

အလားတူပဲ — သင်အသုံးပြုနေတဲ့ framework က code ကို split လုပ်ပေးမယ်လို့ အားကိုးနေရင် — code splitting လုံးဝ မလုပ်တာထက် — loading က ပိုနှေးသွားတဲ့ အခြေအနေတွေလည်း ကြုံရနိုင်ပါတယ်။ ဥပမာ — chart တစ်ခုကို [lazily loading](https://react.dev/reference/react/lazy) လုပ်တာက — chart ကို render လုပ်ဖို့ လိုအပ်တဲ့ code ပို့ပေးတာကို နှောင့်နှေးစေပြီး — chart code ကို app ရဲ့ ကျန်အပိုင်းကနေ ခွဲထုတ်လိုက်ပါတယ်။ [Parcel က React.lazy နဲ့ code splitting ကို ပံ့ပိုးပါတယ်](https://parceljs.org/recipes/react/#code-splitting)။ ဒါပေမယ့် — chart က ကနဦး render ပြီးမှ — သူ့ရဲ့ data ကို *ပြီးမှ* load လုပ်ရင် — သင်က နှစ်ခါ စောင့်နေရပါပြီ။ ဒါက waterfall တစ်ခုပါ: chart အတွက် data fetch လုပ်တာနဲ့ သူ့ကို render လုပ်ဖို့ code ပို့တာကို တစ်ပြိုင်နက် လုပ်မယ့်အစား — အဆင့်တစ်ခုချင်းစီ တစ်ခုပြီးတစ်ခု ပြီးဆုံးတာကို စောင့်နေရလို့ပါ။

Code ကို route အလိုက် split လုပ်တာက — bundling နဲ့ data fetching တို့နဲ့ ပေါင်းစပ်လိုက်တဲ့အခါ — သင့် app ရဲ့ ကနဦး load အချိန်ကိုရော — app ရဲ့ အကြီးဆုံး မြင်ရတဲ့ content render ဖြစ်ဖို့ ကြာတဲ့ အချိန် ([Largest Contentful Paint](https://web.dev/articles/lcp)) ကိုပါ — လျှော့ချပေးနိုင်ပါတယ်။

Code-splitting ညွှန်ကြားချက်တွေအတွက် — သင့် build tool ရဲ့ docs တွေကို ကြည့်ပါ:

- [Vite build optimizations](https://vite.dev/guide/features.html#build-optimizations)
- [Parcel code splitting](https://parceljs.org/features/code-splitting/)
- [Rsbuild code splitting](https://rsbuild.dev/guide/optimization/code-splitting)

### Application Performance မြှင့်တင်ခြင်း

သင်ရွေးထားတဲ့ build tool က single page apps (SPAs) တွေကိုပဲ ပံ့ပိုးလို့ — server-side rendering (SSR)၊ static site generation (SSG) နဲ့/ဒါမှမဟုတ် React Server Components (RSC) လိုမျိုး — [rendering patterns](https://www.patterns.dev/vanilla/rendering-patterns) တွေကို တခြားဟာတွေအနေနဲ့ သင်ကိုယ်တိုင် အကောင်အထည်ဖော်ဖို့ လိုပါလိမ့်မယ်။ အစပိုင်းမှာ ဒီ features တွေ မလိုအပ်ရင်တောင် — နောင်မှာ SSR၊ SSG ဒါမှမဟုတ် RSC တွေကနေ အကျိုးရှိနိုင်မယ့် routes တချို့ ရှိလာနိုင်ပါတယ်။

- **Single-page apps (SPA)** တွေက HTML စာမျက်နှာ တစ်ခုတည်းကို load လုပ်ပြီး — user က app နဲ့ interaction လုပ်တာနဲ့အမျှ — စာမျက်နှာကို dynamic ဖြစ်အောင် update လုပ်ပါတယ်။ SPAs တွေက စတင်ဖို့ ပိုလွယ်ပေမယ့် — ကနဦး load အချိန် ပိုနှေးနိုင်ပါတယ်။ SPAs တွေက build tools အများစုရဲ့ default architecture ပါ။
- **Streaming Server-side rendering (SSR)** က server ပေါ်မှာ စာမျက်နှာတစ်ခုကို render လုပ်ပြီး — render ပြီးသွားတဲ့ စာမျက်နှာကို client ဆီ ပို့ပေးပါတယ်။ SSR က performance ကို မြှင့်တင်နိုင်ပေမယ့် — single-page app တစ်ခုထက် setup လုပ်ပြီး ထိန်းသိမ်းဖို့ ပိုရှုပ်ထွေးနိုင်ပါတယ်။ Streaming ပါ ထပ်လိုက်တဲ့အခါ — SSR က setup လုပ်ပြီး ထိန်းသိမ်းဖို့ အရမ်းရှုပ်ထွေးသွားနိုင်ပါတယ်။ [Vite ရဲ့ SSR guide](https://vite.dev/guide/ssr) ကို ကြည့်ပါ။
- **Static site generation (SSG)** က build အချိန်မှာ သင့် app အတွက် static HTML files တွေကို generate လုပ်ပေးပါတယ်။ SSG က performance ကို မြှင့်တင်နိုင်ပေမယ့် — server-side rendering ထက် setup လုပ်ပြီး ထိန်းသိမ်းဖို့ ပိုရှုပ်ထွေးနိုင်ပါတယ်။ [Vite ရဲ့ SSG guide](https://vite.dev/guide/ssr.html#pre-rendering-ssg) ကို ကြည့်ပါ။
- **React Server Components (RSC)** က build-time၊ server-only နဲ့ interactive components တွေကို — React tree တစ်ခုတည်းထဲမှာ ရောနှောခွင့်ပြုပါတယ်။ RSC က performance ကို မြှင့်တင်နိုင်ပေမယ့် — လောလောဆယ် setup လုပ်ပြီး ထိန်းသိမ်းဖို့ နက်နက်ရှိုင်းရှိုင်း ကျွမ်းကျင်မှု လိုအပ်ပါတယ်။ [Parcel ရဲ့ RSC examples](https://github.com/parcel-bundler/rsc-examples) တွေကို ကြည့်ပါ။

သင့် rendering strategies တွေက သင့် router နဲ့ ပေါင်းစပ်ဖို့ လိုပါတယ် — ဒါမှ သင့် framework နဲ့ တည်ဆောက်ထားတဲ့ apps တွေက route တစ်ခုချင်းစီအလိုက် rendering strategy ကို ရွေးနိုင်မှာပါ။ ဒါက — app တစ်ခုလုံးကို ပြန်ရေးစရာ မလိုဘဲ — rendering strategy မတူညီတာတွေကို သုံးနိုင်စေပါလိမ့်မယ်။ ဥပမာ — သင့် app ရဲ့ landing page က static အနေနဲ့ generate (SSG) လုပ်တာကနေ အကျိုးရှိနိုင်ပြီး — content feed တစ်ခုပါတဲ့ စာမျက်နှာတစ်ခုကတော့ — server-side rendering နဲ့ အကောင်းဆုံး performance ရနိုင်ပါတယ်။

Route တစ်ခ်စီအတွက် မှန်ကန်တဲ့ rendering strategy ကို သုံးခြင်းက — content ရဲ့ ပထမဆုံး byte ရောက်ဖို့ ကြာတဲ့ အချိန် ([Time to First Byte](https://web.dev/articles/ttfb))၊ render ဖြစ်တဲ့ ပထမဆုံး content ([First Contentful Paint](https://web.dev/articles/fcp)) နဲ့ render ဖြစ်တဲ့ အကြီးဆုံး မြင်ရတဲ့ content ([Largest Contentful Paint](https://web.dev/articles/lcp)) — တွေအတွက် လိုအပ်တဲ့ အချိန်တွေကို လျှော့ချပေးနိုင်ပါတယ်။

### နောက်ထပ် အကြောင်းအရာတွေ…

ဒါတွေက — အစကနေ တည်ဆောက်တဲ့အခါ — app အသစ်တစ်ခု ထည့်သွင်းစဉ်းစားဖို့ လိုတဲ့ features တွေရဲ့ ဥပမာ အနည်းငယ်ပဲ ဖြစ်ပါတယ်။ ပြဿနာတစ်ခုချင်းစီက တခြားပြဿနာတွေနဲ့ ရောယှက်နေပြီး — သင်မရင်းနှီးတဲ့ နယ်ပယ်တွေမှာ နက်နက်ရှိုင်းရှိုင်း ကျွမ်းကျင်မှု လိုအပ်နိုင်လို့ — သင်ကြုံရမယ့် ကန့်သတ်ချက် အများအပြားကို ဖြေရှင်းဖို့ ခက်ခဲနိုင်ပါတယ်။

ဒီပြဿနာတွေကို ကိုယ်တိုင် မဖြေရှင်းချင်ဘူးဆိုရင် — ဒီ features တွေကို out of the box ပေးထားတဲ့ [framework တစ်ခုနဲ့ စတင်နိုင်ပါတယ်](/docs/react/creating-a-react-app)။
