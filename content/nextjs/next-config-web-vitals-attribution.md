---
title: "webVitalsAttribution (Web Vitals attribution သတ်မှတ်ချက်)"
description: "webVitalsAttribution option — experimental; Web Vitals ပြဿနာများ၏ အရင်းအမြစ်ကို အတိအကျ ဖော်ထုတ်နိုင်ရန် attribution ကို metric အလိုက် (ဥပမာ CLS, LCP) ဖွင့်ရန် သတ်မှတ်ချက်"
order: 160
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/webVitalsAttribution"
status: translated
updated: 2026-09-03
---

Web Vitals နဲ့ ပတ်သက်တဲ့ ပြဿနာတွေကို debug လုပ်တဲ့အခါ — ပြဿနာရဲ့ အရင်းအမြစ် (source) ကို အတိအကျ ထောက်ပြနိုင်ရင် မကြာခဏ အသုံးဝင်ပါတယ်။ ဥပမာ — Cumulative Layout Shift (CLS) ကိစ္စမှာ အကြီးဆုံး layout shift ဖြစ်ပွားချိန်မှာ ပထမဆုံး ရွေ့လျားသွားတဲ့ element က ဘာလဲ ဆိုတာကို သိချင်နိုင်ပါတယ်။ ဒါမှမဟုတ် — Largest Contentful Paint (LCP) ကိစ္စမှာဆိုရင် page အတွက် LCP နဲ့ ကိုက်ညီတဲ့ element က ဘယ်ဟာလဲ ဆိုတာကို ဖော်ထုတ်ချင်နိုင်ပါတယ်။ LCP element က image တစ်ခုဆိုရင် — image resource ရဲ့ URL ကို သိထားခြင်းက ကျွန်တော်တို့ optimize လုပ်ဖို့ လိုအပ်တဲ့ asset ကို ရှာဖွေဖို့ ကူညီပေးနိုင်ပါတယ်။

Web Vitals score ရဲ့ အကြီးမားဆုံး ပံ့ပိုးပေးနေသူ (contributor) ကို အတိအကျ ထောက်ပြနိုင်ခြင်း — [attribution](https://github.com/GoogleChrome/web-vitals/blob/4ca38ae64b8d1e899028c692f94d4c56acfc996c/README.md#attribution) လို့ ခေါ်ပါတယ် — က [PerformanceEventTiming](https://developer.mozilla.org/docs/Web/API/PerformanceEventTiming), [PerformanceNavigationTiming](https://developer.mozilla.org/docs/Web/API/PerformanceNavigationTiming) နဲ့ [PerformanceResourceTiming](https://developer.mozilla.org/docs/Web/API/PerformanceResourceTiming) တို့အတွက် entries တွေလို ပိုမို နက်ရှိုင်းတဲ့ အချက်အလက်တွေကို ရရှိစေပါတယ်။

Attribution ကို Next.js မှာ default အားဖြင့် ပိတ်ထားပြီး — `next.config.js` ထဲမှာ အောက်ပါအတိုင်း သတ်မှတ်ခြင်းဖြင့် **metric အလိုက်** ဖွင့်နိုင်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
}
```

တရားဝင် (valid) attribution values တွေကတော့ [`NextWebVitalsMetric`](https://github.com/vercel/next.js/blob/442378d21dd56d6e769863eb8c2cb521a463a2e0/packages/next/shared/lib/utils.ts#L43) type ထဲမှာ သတ်မှတ်ထားတဲ့ `web-vitals` metrics တွေ အားလုံး ဖြစ်ပါတယ်။
