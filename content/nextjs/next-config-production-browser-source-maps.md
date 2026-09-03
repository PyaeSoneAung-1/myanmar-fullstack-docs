---
title: "productionBrowserSourceMaps (production build တွင် source maps)"
description: "productionBrowserSourceMaps option — production build အတွင်း browser source map ထုတ်လုပ်ခြင်း ဖွင့်ရန် သတ်မှတ်ချက်; build အချိန်နှင့် memory အသုံးပြုမှုကို တိုးစေနိုင်"
order: 159
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/productionBrowserSourceMaps"
status: translated
updated: 2026-09-03
---

Source maps တွေကို development ကာလအတွင်း default အားဖြင့် ဖွင့်ထားပါတယ်။ Production builds တွေမှာတော့ — configuration flag နဲ့ သီးသန့် opt-in မလုပ်ထားရင် client ဘက်မှာ သင့် source ပေါက်ကြားမှု မဖြစ်အောင် ၎င်းတို့ကို ပိတ်ထားပါတယ်။

Production build ကာလအတွင်း browser source map ထုတ်လုပ်ခြင်းကို ဖွင့်ဖို့ သုံးနိုင်တဲ့ configuration flag တစ်ခုကို Next.js က ပေးထားပါတယ်:

```js filename="next.config.js"
module.exports = {
  productionBrowserSourceMaps: true,
}
```

`productionBrowserSourceMaps` option ကို ဖွင့်ထားတဲ့အခါ — source maps တွေက JavaScript files တွေရှိတဲ့ directory ထဲမှာပဲ output ဖြစ်ပါလိမ့်မယ်။ ဒီ files တွေကို request လုပ်တဲ့အခါ Next.js က အလိုအလျောက် serve လုပ်ပေးပါတယ်။

- Source maps ထည့်လိုက်တာက `next build` အချိန်ကို တိုးစေနိုင်ပါတယ်
- `next build` ကာလအတွင်း memory အသုံးပြုမှုကို မြင့်တက်စေပါတယ်
