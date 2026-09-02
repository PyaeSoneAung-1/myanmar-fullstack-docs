---
title: "instrumentation-client.js"
description: "instrumentation-client.js|ts file convention — application interactive မဖြစ်ခင်မှာ run လုပ်တဲ့ client-side monitoring/analytics code; onRouterTransitionStart hook, performance စဉ်းစားစရာများနဲ့ execution timing အကြောင်း"
order: 78
source: "https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client"
status: translated
updated: 2026-09-02
---

`instrumentation-client.js|ts` file က သင့် application interactive မဖြစ်ခင်မှာ run လုပ်တဲ့ — monitoring, analytics code နဲ့ တခြား side-effects တွေကို ထည့်သွင်းနိုင်စေပါတယ်။ Performance tracking, error monitoring, polyfills (သို့) တခြား client-side observability tools တွေ စနစ်ထည့်သွင်းဖို့ အသုံးဝင်ပါတယ်။

သုံးဖို့အတွက် — file ကို သင့် application ရဲ့ **root** မှာ (သို့) `src` folder တစ်ခုရဲ့ အတွင်းမှာ ထားပါ။

## အသုံးပြုပုံ (Usage)

[Server-side instrumentation](/docs/app/api-reference/file-conventions/instrumentation) နဲ့ မတူဘဲ — ဒီမှာက specific function တွေ export လုပ်စရာ မလိုပါဘူး။ သင့် monitoring code တွေကို file ထဲမှာ တိုက်ရိုက် ရေးနိုင်ပါတယ်:

```ts filename="instrumentation-client.ts" switcher
// Performance monitoring စနစ်ထည့်သွင်းခြင်း
performance.mark('app-init')

// Analytics စတင်ခြင်း
console.log('Analytics initialized')

// Error tracking စနစ်ထည့်သွင်းခြင်း
window.addEventListener('error', (event) => {
  // သင့် error tracking service ဆီ ပို့ပါ
  reportError(event.error)
})
```

```js filename="instrumentation-client.js" switcher
// Performance monitoring စနစ်ထည့်သွင်းခြင်း
performance.mark('app-init')

// Analytics စတင်ခြင်း
console.log('Analytics initialized')

// Error tracking စနစ်ထည့်သွင်းခြင်း
window.addEventListener('error', (event) => {
  // သင့် error tracking service ဆီ ပို့ပါ
  reportError(event.error)
})
```

**Error handling:** ခိုင်မာတဲ့ monitoring ရဖို့ — သင့် instrumentation code တွေကို try-catch blocks တွေနဲ့ ထုပ်ပေးပါ။ ဒါက tracking failure တစ်ခုချင်းစီက တခြား instrumentation features တွေကို မထိခိုက်အောင် ကာကွယ်ပေးပါတယ်။

## Router navigation tracking

App Router navigations တွေရဲ့ အစကို စောင့်ကြည့်ဖို့ — `onRouterTransitionStart` ကို export လုပ်နိုင်ပါတယ်:

```ts filename="instrumentation-client.ts"
export function onRouterTransitionStart(
  url: string,
  navigationType: 'push' | 'replace' | 'traverse'
) {
  console.log(url, navigationType)
}
```

နောက်ထပ် router transition information တွေကတော့ experimental ပါ။ ဒါကို ဖွင့်ပြီး တတိယမြောက် `event` argument တစ်ခုကို လက်ခံရယူနိုင်ပါတယ်:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    instrumentationClientRouterTransitionEvents: true,
  },
}

export default nextConfig
```

Event ထဲမှာ navigation ကို dispatch လုပ်တဲ့အခါ သိထားရတဲ့ — transition metadata နဲ့ source context တွေ ပါဝင်ပါတယ်:

```ts filename="instrumentation-client.ts" switcher
import type { RouterTransitionStartEvent, RouterTransitionType } from 'next'

export function onRouterTransitionStart(
  url: string,
  navigationType: RouterTransitionType,
  { id, timestamp, fromRoutes, prefetchIntent }: RouterTransitionStartEvent
) {
  console.log(id, timestamp, url, navigationType, fromRoutes, prefetchIntent)
}
```

```js filename="instrumentation-client.js" switcher
export function onRouterTransitionStart(url, navigationType, event) {
  console.log(
    event.id,
    event.timestamp,
    url,
    navigationType,
    event.fromRoutes,
    event.prefetchIntent
  )
}
```

`onRouterTransitionStart` က အောက်ပါတွေကို လက်ခံရရှိပါတယ်:

- `url: string` — သွားရောက်နေတဲ့ URL
- `navigationType: 'push' | 'replace' | 'traverse'` — navigation ရဲ့ အမျိုးအစား
- `event.id` — ဒီ transition အတွက် events တွေ အားလုံးက မျှဝေသုံးတဲ့ opaque ID တစ်ခု
- `event.timestamp` — Framework က ဖမ်းယူထားတဲ့ Unix timestamp (milliseconds)
- `event.fromRoutes` — Navigation မလုပ်ခင် မြင်နေရတဲ့ route patterns တွေ။ Primary `children` route က ပထမဆုံး လာပြီး — parallel slots တွေက deterministic order နဲ့ နောက်မှာ လိုက်ပါတယ်
- `event.prefetchIntent` — Link navigations တွေအတွက် — click လုပ်ထားတဲ့ link က full prefetching (`full`) တောင်းခံခဲ့လား၊ automatic prefetching (`auto`) သုံးခဲ့လား၊ prefetching မတောင်းခံခဲ့ဘူးလား (`none`) ဆိုတာ ဖော်ပြပါတယ်။ Link နဲ့ မသက်ဆိုင်တဲ့ navigations တွေ (programmatic `router.push()`/`router.replace()` (သို့) browser back/forward) အတွက်တော့ — link prefetch intent မရှိလို့ `null` ဖြစ်ပါတယ်

Route entries တွေက filesystem-style patterns တွေကို သုံးတာမို့ — `/blog/hello` ကနေ ထွက်ခွာတဲ့ navigation တစ်ခုက `/blog/[slug]` ဆိုပြီး report လုပ်နိုင်ပါတယ်။

Hook errors တွေက သီးခြားစီ ခွဲထားလို့ — navigation ကို ဖြစ်စေ၊ တခြား hooks တွေကို ဖြစ်စေ မထိခိုက်ပါဘူး။

## Performance စဉ်းစားစရာများ

Instrumentation code ကို ပေါ့ပါးအောင် ထားပါ။

Next.js က development မှာ initialization time ကို စောင့်ကြည့်ပြီး — 16ms ထက် ပိုကြာရင် page loading ကို ထိခိုက်နိုင်လို့ warning log လုပ်ပါတယ်။

## Execution timing

`instrumentation-client.js` file က application lifecycle ထဲက တိကျတဲ့ အချိန်တစ်ခုမှာ execute လုပ်ပါတယ်:

1. HTML document ကို load **လုပ်ပြီးချိန်မှာ**
2. React hydration စတင်**ချိန်မတိုင်ခင်**
3. User interactions ဖြစ်နိုင်တဲ့ **အချိန်မတိုင်ခင်**

ဒီ timing ကြောင့် — early application lifecycle events တွေကို ဖမ်းယူဖို့ လိုတဲ့ error tracking, analytics နဲ့ performance monitoring တွေ စနစ်ထည့်သွင်းဖို့ အကောင်းဆုံး ဖြစ်ပါတယ်။

Hydration မတိုင်ခင် အပြည့်အဝ ပြီးစီးဖို့ အာမခံချက် ရှိတာက synchronous, top-level code တွေပဲ ဖြစ်ပါတယ်။ ဒီနေရာမှာ စတင်လိုက်တဲ့ asynchronous အလုပ်တွေ (a `Promise`, `import()`, (သို့) top-level `await`) ကို await မလုပ်ပါဘူး — hydration စတင်ပြီးမှ resolve ဖြစ်နိုင်လို့ fire-and-forget အဖြစ် သဘောထားပါ။ သင့် components တွေ run မလုပ်ခင် တစ်ခုခု အဆင်သင့်ဖြစ်နေဖို့ လိုရင် — [Polyfills](#polyfills) ထဲက synchronous patterns တွေထဲက တစ်ခုကို သုံးပါ။

## ဆက်စပ်ကြည့်ရှုရန် (See also)

`next.config.js` plugins တွေ (ဥပမာ — `withSentry` လိုမျိုး wrappers) က [`instrumentationClientInject`](https://nextjs.org/docs/app/api-reference/config/next-config-js/instrumentationClientInject) option ကနေ — ကိုယ်ပိုင် client instrumentation module တွေကို register လုပ်နိုင်ပါတယ်။ Injected modules တွေက ဒီ file မတိုင်ခင် — array order အတိုင်း run လုပ်ပြီး — router transition start hook ကို export လုပ်နိုင်ပါတယ်။ Application code ကတော့ ဒီ file convention ကို တိုက်ရိုက် ဆက်သုံးသင့်ပါတယ်။

## ဥပမာများ (Examples)

### Error tracking

React မစတင်ခင် error tracking ကို initialize လုပ်ပြီး — debugging context ပိုကောင်းဖို့ navigation breadcrumbs တွေ ထည့်ပါ။

```ts filename="instrumentation-client.ts" switcher
import Monitor from './lib/monitoring'

Monitor.initialize()

export function onRouterTransitionStart(url: string) {
  Monitor.pushEvent({
    message: `Navigation to ${url}`,
    category: 'navigation',
  })
}
```

```js filename="instrumentation-client.js" switcher
import Monitor from './lib/monitoring'

Monitor.initialize()

export function onRouterTransitionStart(url) {
  Monitor.pushEvent({
    message: `Navigation to ${url}`,
    category: 'navigation',
  })
}
```

### Analytics tracking

Analytics ကို initialize လုပ်ပြီး — user behavior ခွဲခြမ်းစိတ်ဖြာဖို့ အသေးစိတ် metadata တွေနဲ့ navigation events တွေကို ခြေရာခံပါ။

```ts filename="instrumentation-client.ts" switcher
import { analytics } from './lib/analytics'

analytics.init()

export function onRouterTransitionStart(url: string, navigationType: string) {
  analytics.track('page_navigation', {
    url,
    type: navigationType,
    timestamp: Date.now(),
  })
}
```

```js filename="instrumentation-client.js" switcher
import { analytics } from './lib/analytics'

analytics.init()

export function onRouterTransitionStart(url, navigationType) {
  analytics.track('page_navigation', {
    url,
    type: navigationType,
    timestamp: Date.now(),
  })
}
```

### Performance monitoring

Performance Observer API နဲ့ performance marks တွေကို သုံးပြီး — Time to Interactive နဲ့ navigation performance ကို ခြေရာခံပါ။

```ts filename="instrumentation-client.ts" switcher
const startTime = performance.now()

const observer = new PerformanceObserver(
  (list: PerformanceObserverEntryList) => {
    for (const entry of list.getEntries()) {
      if (entry instanceof PerformanceNavigationTiming) {
        console.log('Time to Interactive:', entry.loadEventEnd - startTime)
      }
    }
  }
)

observer.observe({ entryTypes: ['navigation'] })

export function onRouterTransitionStart(url: string) {
  performance.mark(`nav-start-${url}`)
}
```

```js filename="instrumentation-client.js" switcher
const startTime = performance.now()

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry instanceof PerformanceNavigationTiming) {
      console.log('Time to Interactive:', entry.loadEventEnd - startTime)
    }
  }
})

observer.observe({ entryTypes: ['navigation'] })

export function onRouterTransitionStart(url) {
  performance.mark(`nav-start-${url}`)
}
```

### Polyfills

[Execution timing](#execution-timing) မှာ ဖော်ပြခဲ့သလို — ဒီနေရာက synchronous, top-level code တွေပဲ hydration မတိုင်ခင် run လို့ — conditional `import()` (သို့) top-level `await` တစ်ခုက hydration စတင်ပြီးမှ resolve ဖြစ်နိုင်ပါတယ်။

Polyfill တစ်ခုကို သင့် components တွေ run မလုပ်ခင် အသုံးချဖို့ အာမခံချင်ရင် — polyfill ကို statically import လုပ်ပြီး feature detection လုပ်ပြီးတာနဲ့ synchronously အသုံးချပါ။ Import က static ဖြစ်တာမို့ — polyfill က visitor တိုင်းဆီ ပို့ပေးပါတယ်:

```ts filename="instrumentation-client.ts"
import ResizeObserverPolyfill from './lib/polyfills/resize-observer'

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserverPolyfill
}
```

ဒီနေရာမှာ conditional `import()` နဲ့ polyfill တစ်ခုကို load လုပ်တာကို ရှောင်ပါ။ Import က fire-and-forget ဖြစ်လို့ — polyfill က hydration စတင်ပြီးမှ အသုံးချဖြစ်နိုင်ပြီး — သင့် components တွေအတွက် နောက်ကျသွားနိုင်ပါတယ်:

```ts filename="instrumentation-client.ts"
// ရှောင်ရန်: dynamic import က fire-and-forget ဖြစ်လို့ `ResizeObserver`
// က သင့် components တွေ run ချိန်မှာ undefined ဖြစ်နေနိုင်ပါသေးတယ်။
if (!window.ResizeObserver) {
  import('./lib/polyfills/resize-observer').then((mod) => {
    window.ResizeObserver = mod.default
  })
}
```

On-demand အနေနဲ့ load လုပ်တဲ့ ဘာမဆိုအတွက် — feature ကို သုံးတဲ့ code ထဲမှာ polyfill လုပ်တာက ပိုကောင်းပါတယ်။ ဒါနဲ့ တခြား strategies တွေအတွက် [Custom Polyfills](https://nextjs.org/docs/architecture/supported-browsers#custom-polyfills) ကို ကြည့်ပါ။

Next.js က လိုအပ်တဲ့ browsers တွေအတွက် — ကျယ်ကျယ်ပြန့်ပြန့် သုံးနေတဲ့ [polyfills](https://nextjs.org/docs/architecture/supported-browsers#polyfills) အခြေခံအဆင့် (ဥပမာ `fetch`, `URL`, `Object.assign`) တွေကို ကြိုထည့်ပေးထားလို့ — အဲဒီ baseline အပြင်ဘက်က features တွေအတွက်ပဲ polyfills တွေ ထပ်ထည့်ဖို့ လိုပါတယ်။

## Version history

| Version   | အပြောင်းအလဲ                                               |
| --------- | ----------------------------------------------------- |
| `v16.3.0` | Experimental router transition start event စတင် မိတ်ဆက် |
| `v15.3`   | `instrumentation-client` စတင် မိတ်ဆက်                   |
