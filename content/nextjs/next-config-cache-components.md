---
title: "cacheComponents (component/function-level caching ဖွင့်ရန် သတ်မှတ်ချက်)"
description: "cacheComponents option — 'use cache' directive ဖြင့် component နှင့် function-level caching ကို ဖွင့်ရန်; data fetching ကို default dynamic အဖြစ်ထားပြီး သင်ရွေးချယ်သည့်အရာကိုသာ cache လုပ်; static HTML shell ကို ချက်ချင်း ပို့ပြီး dynamic content များ stream ဝင်ရောက်; App Router တွင် Partial Prerendering (PPR) ကို default အပြုအမူအဖြစ် အကောင်အထည်ဖော်ပေး; Node.js runtime လိုအပ်"
order: 201
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents"
status: translated
updated: 2026-09-03
---

Cache Components က [`use cache`](/docs/nextjs/use-cache) directive ကို သုံးပြီး component-level နဲ့ function-level caching (page, component, function အဆင့်အလိုက် caching) ကို ဖွင့်ပေးပါတယ်။ Data fetching က default အားဖြင့် dynamic ဖြစ်ပြီး — page, component (သို့) function အဆင့်မှာ ဘာကို cache လုပ်မလဲဆိုတာ သင်ကိုယ်တိုင် ရွေးချယ်ရပါတယ်။ Next.js က static HTML shell တစ်ခုကို prerender လုပ်ပြီး ချက်ချင်း ပို့ပေးပါတယ် — dynamic content တွေက အဆင်သင့်ဖြစ်တဲ့အခါ stream လုပ်ပြီး ဝင်လာပါတယ်။ ဒါကြောင့် route တစ်ခုတည်းအတွင်းမှာ static နဲ့ dynamic content တွေကို ရောနှောသုံးလို့ ရပါတယ်။

## Usage (အသုံးပြုပုံ)

`cacheComponents` flag ကို ဖွင့်ဖို့ — သင့် `next.config.ts` file ထဲမှာ `true` အဖြစ် သတ်မှတ်ပါ:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

> **သိထားသင့်သည် (Good to know):** Cache Components က Node.js runtime လိုအပ်ပါတယ်။ Deprecated ဖြစ်နေတဲ့ `runtime = 'edge'` export ကို သတ်မှတ်ထားတဲ့ routes တွေကို migrate လုပ်ပါ — တခြား server-side JavaScript runtimes တွေက အလုပ်လုပ်မယ်လို့ အာမခံထားတာ မဟုတ်ပါဘူး။ [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components#runtime--edge) ကို ကြည့်ပါ။

`cacheComponents` ဖွင့်ထားတဲ့အခါ အောက်ပါ cache functions နဲ့ configurations တွေကို သုံးနိုင်ပါတယ်:

- [`use cache` directive](/docs/nextjs/use-cache)
- [`use cache` နဲ့တွဲသုံးတဲ့ `cacheLife` function](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife)
- [`cacheTag` function](/docs/nextjs/cache-tag)

> **သိထားသင့်သည် (Good to know):** `experimental.useCache` (သို့) `experimental.dynamicIO` ကို အရင်က သုံးခဲ့တယ်ဆိုရင် — [Version 16 upgrade guide](/docs/nextjs/upgrading-version-16) ကို သုံးပြီး migrate လုပ်ပါ။ Route segment configs တွေနဲ့ တခြား caching patterns တွေကို migrate လုပ်ဖို့ — [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components) ကို ကြည့်ပါ။

ဒါ့အပြင် `cacheComponents` က App Router မှာ **[Partial Prerendering (PPR)](https://nextjs.org/docs/app/glossary#partial-prerendering-ppr)** ကို default အပြုအမူအဖြစ် အကောင်အထည်ဖော်ပေးပါတယ်။ ဆိုလိုတာက — `experimental.ppr` configuration flag နဲ့ `experimental_ppr` route segment configuration တွေ မလိုအပ်တော့ဘဲ ဖယ်ရှားလိုက်ပါပြီ။

Static shell နဲ့ streaming တွေ ဘယ်လို ပေါင်းစပ်အလုပ်လုပ်လဲဆိုတာကို [Prerendering](/docs/nextjs/caching) မှာ ဖတ်ပါ။

> **သိထားသင့်သည် (Good to know):** Next.js 15 မှာ experimental PPR ကို သုံးခဲ့တယ်ဆိုရင် — migrate လုပ်တဲ့အခါ Version 16 upgrade guide ရဲ့ [Partial Prerendering (PPR)](https://nextjs.org/docs/app/guides/upgrading/version-16#partial-prerendering-ppr) section ကို ကိုးကားပါ။

## Activity နဲ့အတူ Navigation (Navigation with Activity)

`cacheComponents` ဖွင့်ထားတဲ့အခါ Next.js က React ရဲ့ [`<Activity>`](https://react.dev/reference/react/Activity) component ကို သုံးပြီး client-side navigation အတွင်း component state တွေကို ထိန်းသိမ်းပေးပါတယ်။

သင် navigate လုပ်ပြီး ထွက်သွားတဲ့အခါ အရင် route ကို unmount လုပ်မယ့်အစား — Next.js က Activity mode ကို [`"hidden"`](https://react.dev/reference/react/Activity#activity) အဖြစ် သတ်မှတ်လိုက်ပါတယ်။ ဆိုလိုတာက:

- Routes တွေကြား navigation လုပ်တဲ့အခါ component state တွေ ထိန်းသိမ်းခံရပါတယ်
- နောက်ပြန် navigate လုပ်တဲ့အခါ အရင် route က သူ့ရဲ့ state တွေနဲ့အတူ ပြန်ပေါ်လာပါတယ်
- Route တစ်ခု hidden ဖြစ်သွားတဲ့အခါ effects တွေကို cleanup လုပ်ပြီး — ပြန်မြင်ရတဲ့အခါ အသစ်ပြန်ဖန်တီးပေးပါတယ်

ဒီအပြုအမူက UI state တွေ (form inputs (သို့) ဖွင့်ထားတဲ့ sections လိုမျိုး) ကို users တွေ routes တွေကြား နောက်ပြန်/ရှေ့သွားလာတဲ့အခါ ထိန်းသိမ်းပေးခြင်းအားဖြင့် navigation အတွေ့အကြုံကို ပိုကောင်းစေပါတယ်။

> **သိထားသင့်သည် (Good to know):** Next.js က heuristics တွေ သုံးပြီး မကြာသေးခင်က သွားခဲ့တဲ့ routes အနည်းငယ်ကိုပဲ `"hidden"` အဖြစ် ထားပါတယ် — အဟောင်းဆုံး routes တွေကို DOM ကနေ ဖယ်ရှားပြီး အလွန်အကျွံ ကြီးထွားမသွားအောင် ကာကွယ်ပါတယ်။

Components တွေက unmount မဖြစ်ဘဲ mounted ဖြစ်နေတဲ့အခါ UI patterns အချို့က ခြားနားစွာ ပြုမူပါတယ်။ Dropdowns, dialogs နဲ့ testing လိုမျိုး အသုံးများတဲ့ patterns တွေကို ကိုင်တွယ်ဖို့ — [Preserving UI state guide](https://nextjs.org/docs/app/guides/preserving-ui-state) ကို ကြည့်ပါ။

## Version History

| Version | အပြောင်းအလဲ                                                                                                                                          |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 16.0.0  | `cacheComponents` စတင် မိတ်ဆက်။ ဒီ flag က `ppr`, `useCache`, `dynamicIO` flags တွေကို ပေါင်းစည်းထားတဲ့ configuration တစ်ခုတည်းအဖြစ် ထိန်းချုပ်ပေးပါတယ်။ |
