---
title: "allowedDevOrigins (development အတွင်း ခွင့်ပြုထားသော origins)"
description: "allowedDevOrigins option — development mode အတွင်း dev-only assets/endpoints များဆီ cross-origin requests များ ခွင့်ပြုရန် သတ်မှတ်ချက်; wildcard (ဥပမာ `*.local-origin.dev`) ပုံစံများ ထောက်ပံ့"
order: 153
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins"
status: translated
updated: 2026-09-03
---

Next.js က development ကာလအတွင်း ခွင့်ပြုချက် မရှိဘဲ ဝင်ရောက်မှု (unauthorized access) တွေ မဖြစ်အောင် — dev-only ဖြစ်တဲ့ assets တွေနဲ့ endpoints တွေဆီကို cross-origin requests တွေကို default အားဖြင့် ပိတ်ပင်ထားပါတယ်။

Server ကို စတင်ချိန်မှာ သတ်မှတ်ထားတဲ့ hostname (`localhost` က default) ကလွဲပြီး — တခြား origins တွေကနေ requests တွေ လက်ခံဖို့ Next.js application တစ်ခုကို configure လုပ်ချင်ရင် `allowedDevOrigins` config option ကို သုံးပါ။

`allowedDevOrigins` က development mode မှာ dev server ကို request လုပ်နိုင်တဲ့ အပိုဆောင်း origins တွေကို သတ်မှတ်ပေးနိုင်ပါတယ်။ ဥပမာ — `localhost` တစ်ခုတည်း အစား `local-origin.dev` ကိုပါ သုံးချင်ရင် `next.config.js` ကို ဖွင့်ပြီး `allowedDevOrigins` config ထည့်ပါ:

```js filename="next.config.js"
module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}
```
