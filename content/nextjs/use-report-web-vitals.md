---
title: "useReportWebVitals hook (Web Vitals တိုင်းတာမှုများကို report ပြုလုပ်ခြင်း)"
description: "useReportWebVitals() — Core Web Vitals (TTFB, FCP, LCP, FID, CLS, INP) နှင့် metric object (id, name, delta, entries, navigationType, rating, value) တို့ကို သင့် analytics service ဆီ report ပို့ရန် Client Component တစ်ခုထဲတွင် အသုံးပြုသော hook; root layout တွင် ထည့်သွင်းပုံနှင့် external systems ဆီ ရလဒ်များ ပို့နည်း"
order: 149
source: "https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals"
status: translated
updated: 2026-09-03
---

`useReportWebVitals` hook က [Core Web Vitals](https://web.dev/vitals/) တွေကို report လုပ်နိုင်စေပြီး — သင့် analytics service နဲ့ တွဲသုံးနိုင်ပါတယ်။

`useReportWebVitals` ဆီ ထည့်လိုက်တဲ့ function အသစ်တွေကို — အဲဒီအချိန်အထိ ရရှိနိုင်တဲ့ metrics တွေနဲ့အတူ ခေါ်ပေးပါတယ်။ Data အလျဉ်းမှား နှစ်ကြိမ် report မဖြစ်အောင် — callback function ရဲ့ reference က မပြောင်းလဲဘူးဆိုတာ သေချာစေပါ (အောက်က code ဥပမာတွေမှာ ပြထားသလို)။

```jsx filename="app/_components/web-vitals.js"
'use client'

import { useReportWebVitals } from 'next/web-vitals'

const logWebVitals = (metric) => {
  console.log(metric)
}

export function WebVitals() {
  useReportWebVitals(logWebVitals)

  return null
}
```

```jsx filename="app/layout.js"
import { WebVitals } from './_components/web-vitals'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

> `useReportWebVitals` hook က `'use client'` directive လိုအပ်တာမို့ — root layout က import လုပ်မယ့် component သပ်သပ်တစ်ခု ဖန်တီးတာက စွမ်းဆောင်ရည် အမြင့်ဆုံး နည်းလမ်းပါ။ ဒါက client boundary ကို `WebVitals` component ထဲမှာပဲ သီးသန့် ကန့်သတ်ထားနိုင်ပါတယ်။

## useReportWebVitals

Hook ရဲ့ argument အဖြစ် ထည့်ပေးလိုက်တဲ့ `metric` object မှာ properties တစ်ချို့ ပါဝင်ပါတယ်:

- `id`: လက်ရှိ page load ရဲ့ context အတွင်းမှာ metric အတွက် ထူးခြားတဲ့ (unique) identifier တစ်ခု။
- `name`: Performance metric ရဲ့ နာမည်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေထဲမှာ — web application တစ်ခုနဲ့ သက်ဆိုင်တဲ့ [Web Vitals](#web-vitals) metric တွေရဲ့ နာမည်တွေ (TTFB, FCP, LCP, FID, CLS) ပါဝင်ပါတယ်။
- `delta`: Metric ရဲ့ လက်ရှိ တန်ဖိုးနဲ့ အရင် တန်ဖိုးကြားက ကွာခြားချက်။ တန်ဖိုးက ပုံမှန်အားဖြင့် milliseconds နဲ့ ဖြစ်ပြီး — အချိန်နဲ့အမျှ metric ရဲ့ တန်ဖိုး ပြောင်းလဲမှုကို ကိုယ်စားပြုပါတယ်။
- `entries`: Metric နဲ့ ဆက်စပ်နေတဲ့ [Performance Entries](https://developer.mozilla.org/docs/Web/API/PerformanceEntry) တွေရဲ့ array တစ်ခု။ ဒီ entries တွေက metric နဲ့ ဆိုင်တဲ့ performance events တွေရဲ့ အသေးစိတ် အချက်အလက်တွေကို ပေးပါတယ်။
- `navigationType`: Metric collection ကို စတင်စေတဲ့ navigation type ကို ညွှန်ပြပါတယ်။ တန်ဖိုးတွေက [PerformanceNavigationTiming.type](https://developer.mozilla.org/docs/Web/API/PerformanceNavigationTiming/type) ကနေ ဆင်းသက်လာပြီး — `"navigate"`, `"reload"`, `"prerender"`, `"back-forward"` (`"back_forward"` ကနေ ပုံမှန် ပြောင်းထားတာ), `"back-forward-cache"` (BFCache restore), နဲ့ `"restore"` (page ကို discard လုပ်ပြီးနောက် ပြန်လည် ထားရှိခြင်း) တို့ ပါဝင်နိုင်ပါတယ်။
- `rating`: Metric တန်ဖိုးရဲ့ အရည်အသွေး အဆင့်သတ်မှတ်ချက် — performance အပေါ် အကဲဖြတ်ချက် တစ်ခု ပေးပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေက `"good"`, `"needs-improvement"`, နဲ့ `"poor"` ပါ။ Rating ကို ပုံမှန်အားဖြင့် — metric တန်ဖိုးကို ကြိုတင် သတ်မှတ်ထားတဲ့ thresholds (လက်ခံနိုင်/မနိုင် ခွဲခြားပေးတဲ့ သတ်မှတ်ချက်များ) နဲ့ ယှဉ်ပြီး ဆုံးဖြတ်ပါတယ်။
- `value`: Performance entry ရဲ့ တကယ့် တန်ဖိုး (သို့) ကြာချိန် — ပုံမှန်အားဖြင့် milliseconds နဲ့။ ဒီတန်ဖိုးက metric က ခြေရာခံနေတဲ့ performance ရဲ့ သွင်ပြင်ကို ပမာဏအလိုက် (quantitative) တိုင်းတာပေးပါတယ်။ တန်ဖိုးရဲ့ အရင်းအမြစ်က တိုင်းတာနေတဲ့ metric အပေါ် မူတည်ပြီး — [Performance API](https://developer.mozilla.org/docs/Web/API/Performance_API) အမျိုးမျိုးကနေ လာနိုင်ပါတယ်။

## Web Vitals

[Web Vitals](https://web.dev/vitals/) တွေက — web page တစ်ခုရဲ့ user experience ကို ဖမ်းယူနိုင်ဖို့ ရည်ရွယ်ထားတဲ့ အသုံးဝင်တဲ့ metrics အစုတစ်ခုပါ။ အောက်ပါ web vitals တွေက အားလုံး ပါဝင်ပါတယ်:

- [Time to First Byte](https://developer.mozilla.org/docs/Glossary/Time_to_first_byte) (TTFB)
- [First Contentful Paint](https://developer.mozilla.org/docs/Glossary/First_contentful_paint) (FCP)
- [Largest Contentful Paint](https://web.dev/lcp/) (LCP)
- [First Input Delay](https://web.dev/fid/) (FID)
- [Cumulative Layout Shift](https://web.dev/cls/) (CLS)
- [Interaction to Next Paint](https://web.dev/inp/) (INP)

ဒီ metrics တွေရဲ့ ရလဒ်အားလုံးကို `name` property ကို သုံးပြီး ကိုင်တွယ်နိုင်ပါတယ်။

```tsx filename="app/components/web-vitals.tsx" switcher
'use client'

import { useReportWebVitals } from 'next/web-vitals'

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0]

const handleWebVitals: ReportWebVitalsCallback = (metric) => {
  switch (metric.name) {
    case 'FCP': {
      // handle FCP results
    }
    case 'LCP': {
      // handle LCP results
    }
    // ...
  }
}

export function WebVitals() {
  useReportWebVitals(handleWebVitals)
}
```

```jsx filename="app/components/web-vitals.js" switcher
'use client'

import { useReportWebVitals } from 'next/web-vitals'

const handleWebVitals = (metric) => {
  switch (metric.name) {
    case 'FCP': {
      // handle FCP results
    }
    case 'LCP': {
      // handle LCP results
    }
    // ...
  }
}

export function WebVitals() {
  useReportWebVitals(handleWebVitals)
}
```

## ရလဒ်တွေကို external systems ဆီ ပို့ခြင်း (Sending results to external systems)

သင့် site ပေါ်က real user performance တွေကို တိုင်းတာ ခြေရာခံနိုင်ဖို့ — ရလဒ်တွေကို endpoint ဘယ်နေရာကိုမဆို ပို့နိုင်ပါတယ်။ ဥပမာ:

```js
function postWebVitals(metric) {
  const body = JSON.stringify(metric)
  const url = 'https://example.com/analytics'

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
}

useReportWebVitals(postWebVitals)
```

> **သိထားသင့်သည်:** [Google Analytics](https://analytics.google.com/analytics/web/) သုံးမယ်ဆိုရင် — `id` တန်ဖိုးကို သုံးပြီး metric distributions တွေကို ကိုယ်တိုင် တည်ဆောက်နိုင်ပါတယ် (percentiles တွေ တွက်ချက်ဖို့ စသည်ဖြင့်)။

> ```js
> useReportWebVitals(metric => {
>   // Use `window.gtag` if you initialized Google Analytics as this example:
>   // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics
>   window.gtag('event', metric.name, {
>     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // values must be integers
>     event_label: metric.id, // id unique to current page load
>     non_interaction: true, // avoids affecting bounce rate.
>   });
> }
> ```
>
> [ရလဒ်တွေကို Google Analytics ဆီ ပို့ခြင်း](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics) အကြောင်း ပိုပြီး ဖတ်ရှုပါ။
