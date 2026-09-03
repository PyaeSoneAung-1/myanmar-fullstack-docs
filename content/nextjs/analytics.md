---
title: "Analytics တပ်ဆင်သုံးစွဲခြင်း (Adding Analytics to Your Next.js Application)"
description: "Next.js application မှာ page performance ကို တိုင်းတာ၊ ခြေရာခံနည်း — useReportWebVitals hook နဲ့ ကိုယ်တိုင် report လုပ်ခြင်း, Vercel Speed Insights, instrumentation-client.js|ts နဲ့ client-side monitoring, Web Vitals metrics (TTFB, FCP, LCP, FID, CLS, INP) များနဲ့ external systems (Google Analytics အပါအဝင်) ဆီ ရလဒ်ပို့ခြင်း"
order: 130
source: "https://nextjs.org/docs/app/guides/analytics"
status: translated
updated: 2026-09-03
---

Next.js မှာ performance metrics တွေကို တိုင်းတာပြီး အစီရင်ခံဖို့ built-in support ပါဝင်ပါတယ်။ Report လုပ်တာကို သင်ကိုယ်တိုင် စီမံချင်ရင် — [`useReportWebVitals`](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals) hook ကို သုံးနိုင်ပြီး — တစ်နည်းအားဖြင့် Vercel ရဲ့ [managed service](https://vercel.com/analytics?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) က metrics တွေကို သင့်အတွက် အလိုအလျောက် စုဆောင်းပြီး visualize လုပ်ပေးပါတယ်။

## Client Instrumentation (client ဘက်တွင် စနစ်ထည့်သွင်းခြင်း)

ပိုအဆင့်မြင့်တဲ့ analytics နဲ့ monitoring လိုအပ်ချက်တွေအတွက် — Next.js က သင့် application ရဲ့ frontend code မစတင်ခင် run တဲ့ `instrumentation-client.js|ts` file တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ Global analytics, error tracking (သို့) performance monitoring tools တွေကို တပ်ဆင်ဖို့ ဒါက အကောင်းဆုံး နေရာပါ။

သုံးဖို့ဆိုရင် — သင့် application ရဲ့ root directory ထဲမှာ `instrumentation-client.js` (သို့) `instrumentation-client.ts` file တစ်ခု ဖန်တီးပါ:

```js filename="instrumentation-client.js"
// Initialize analytics before the app starts
console.log('Analytics initialized')

// Set up global error tracking
window.addEventListener('error', (event) => {
  // Send to your error tracking service
  reportError(event.error)
})
```

## Build Your Own (ကိုယ်တိုင် တည်ဆောက်ခြင်း)

```jsx filename="app/_components/web-vitals.js"
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })
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

> `useReportWebVitals` hook က `'use client'` directive လိုအပ်တာမို့ — စွမ်းဆောင်ရည် အမြင့်ဆုံး နည်းလမ်းကတော့ root layout က import လုပ်တဲ့ component သီးခြားတစ်ခုကို ဖန်တီးပြီး — client boundary ကို `WebVitals` component ထဲမှာပဲ ကန့်သတ်ထားတာပါ။

နောက်ထပ် အချက်အလက်တွေအတွက် [API Reference](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals) ကို ကြည့်ပါ။

## Web Vitals

[Web Vitals](https://web.dev/vitals/) တွေဆိုတာ — web page တစ်ခုရဲ့ user experience ကို ဖမ်းယူနိုင်ဖို့ ရည်ရွယ်ထားတဲ့ အသုံးဝင်တဲ့ metrics အစုတစ်စုပါ။ အောက်ပါ web vitals တွေ အားလုံး ပါဝင်ပါတယ်:

- [Time to First Byte](https://developer.mozilla.org/docs/Glossary/Time_to_first_byte) (TTFB)
- [First Contentful Paint](https://developer.mozilla.org/docs/Glossary/First_contentful_paint) (FCP)
- [Largest Contentful Paint](https://web.dev/lcp/) (LCP)
- [First Input Delay](https://web.dev/fid/) (FID)
- [Cumulative Layout Shift](https://web.dev/cls/) (CLS)
- [Interaction to Next Paint](https://web.dev/inp/) (INP)

ဒီ metrics တွေအားလုံးရဲ့ ရလဒ်တွေကို `name` property ကို သုံးပြီး ကိုင်တွယ်နိုင်ပါတယ်။

```tsx filename="app/_components/web-vitals.tsx" switcher
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP': {
        // handle FCP results
      }
      case 'LCP': {
        // handle LCP results
      }
      // ...
    }
  })
}
```

```jsx filename="app/_components/web-vitals.js" switcher
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP': {
        // handle FCP results
      }
      case 'LCP': {
        // handle LCP results
      }
      // ...
    }
  })
}
```

## ရလဒ်များကို External Systems များဆီ ပို့ခြင်း (Sending Results to External Systems)

သင့် site ပေါ်က တကယ့် user performance တွေကို တိုင်းတာ၊ ခြေရာခံဖို့ — ရလဒ်တွေကို endpoint မည်သည့်နေရာကိုမဆို ပို့နိုင်ပါတယ်။ ဥပမာ:

```js
useReportWebVitals((metric) => {
  const body = JSON.stringify(metric)
  const url = 'https://example.com/analytics'

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
})
```

> **သိထားသင့်သည်:** [Google Analytics](https://analytics.google.com/analytics/web/) ကို သုံးတယ်ဆိုရင် — `id` value ကို သုံးပြီး metric distributions တွေကို ကိုယ်တိုင် တည်ဆောက်နိုင်ပါတယ် (percentiles တွေ တွက်ချက်ဖို့ စသည်)။

> ```js
> useReportWebVitals((metric) => {
>   // Use `window.gtag` if you initialized Google Analytics as this example:
>   // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics
>   window.gtag('event', metric.name, {
>     value: Math.round(
>       metric.name === 'CLS' ? metric.value * 1000 : metric.value
>     ), // values must be integers
>     event_label: metric.id, // id unique to current page load
>     non_interaction: true, // avoids affecting bounce rate.
>   })
> })
> ```
>
> [Google Analytics ဆီ ရလဒ်တွေ ပို့ခြင်း](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics) အကြောင်း ပိုမို ဖတ်ရှုပါ။
