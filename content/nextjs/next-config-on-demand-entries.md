---
title: "onDemandEntries (development page ထိန်းသိမ်းမှု သတ်မှတ်ချက်များ)"
description: "onDemandEntries options — development အတွင်း built pages များကို server က memory ထဲ ထိန်းသိမ်းမည်/ဖျက်ပစ်မည့် အပြုအမူ (maxInactiveAge, pagesBufferLength) အတွက် သတ်မှတ်ချက်များ"
order: 158
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/onDemandEntries"
status: translated
updated: 2026-09-03
---

Next.js က development ကာလအတွင်း — server က တည်ဆောက်ပြီးသား (built) pages တွေကို memory ထဲမှာ ထိန်းသိမ်းထားမယ့် (သို့) ဖျက်ပစ်မယ့် ပုံစံကို ထိန်းချုပ်နိုင်တဲ့ options အချို့ကို ပေးထားပါတယ်။

Default တန်ဖိုးတွေကို ပြောင်းချင်ရင် — `next.config.js` ကို ဖွင့်ပြီး `onDemandEntries` config ထည့်ပါ:

```js filename="next.config.js"
module.exports = {
  onDemandEntries: {
    // server က pages တွေကို buffer ထဲမှာ ထိန်းထားမယ့် ကြာချိန် (ms နဲ့)
    maxInactiveAge: 25 * 1000,
    // တစ်ပြိုင်နက် ဖျက်ပစ်ခြင်း မခံရဘဲ ထိန်းသိမ်းထားရမယ့် pages အရေအတွက်
    pagesBufferLength: 2,
  },
}
```
