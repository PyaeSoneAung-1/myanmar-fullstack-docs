---
title: "reactMaxHeadersLength (React headers အများဆုံး အလျား)"
description: "reactMaxHeadersLength option — prerendering အတွင်း React မှ ထုတ်လွှတ်ပြီး response တွင် ထည့်သွင်းသည့် headers များ၏ အများဆုံး အလျား သတ်မှတ်ရန်; default 6000, App Router တွင်သာ ရနိုင်"
order: 191
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/reactMaxHeadersLength"
status: translated
updated: 2026-09-03
---

Prerendering (ကြိုတင် render လုပ်ခြင်း) ပြုလုပ်နေစဉ်အတွင်း — React က response ထဲ ထည့်သွင်းလို့ရတဲ့ headers တွေကို ထုတ်လွှတ်နိုင်ပါတယ်။ ဒီ headers တွေက browser ကို fonts, scripts နဲ့ stylesheets လိုမျိုး resources တွေကို ကြိုတင် load (preload) လုပ်နိုင်အောင် ခွင့်ပြုပေးခြင်းဖြင့် performance ကို မြှင့်တင်ဖို့ သုံးလို့ရပါတယ်။ Default တန်ဖိုးက `6000` ဖြစ်ပြီး — `next.config.js` ထဲမှာ `reactMaxHeadersLength` option ကို configure လုပ်ခြင်းဖြင့် ဒီတန်ဖိုးကို ပြောင်းလဲ (override) လုပ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  reactMaxHeadersLength: 1000,
}
```

> **သိထားသင့်သည် (Good to know):** ဒီ option က App Router မှာပဲ ရနိုင်ပါတယ်။

Browser နဲ့ server ကြားမှာရှိတဲ့ proxy အမျိုးအစားပေါ် မူတည်ပြီး — headers တွေ ဖြတ်တောက်ခံရ (truncated) နိုင်ပါတယ်။ ဥပမာ — ရှည်လျားတဲ့ headers တွေကို မထောက်ပံ့တဲ့ reverse proxy တစ်ခုကို သုံးနေရင် headers တွေ မဖြတ်တောက်ခံရအောင် ပိုနည်းတဲ့ တန်ဖိုးတစ်ခုကို သတ်မှတ်သင့်ပါတယ်။
