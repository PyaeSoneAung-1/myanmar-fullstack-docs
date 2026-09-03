---
title: "expireTime (stale-while-revalidate သက်တမ်း)"
description: "expireTime option — ISR (Incremental Static Regeneration) enabled pages များအတွက် `Cache-Control` header တွင် CDN များ သုံးစွဲမည့် custom stale-while-revalidate expire time သတ်မှတ်ရန်"
order: 192
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/expireTime"
status: translated
updated: 2026-09-03
---

ISR (Incremental Static Regeneration) ဖွင့်ထားတဲ့ pages တွေအတွက် — `Cache-Control` header ထဲမှာ CDN တွေ သုံးစွဲနိုင်မယ့် ကိုယ်ပိုင် `stale-while-revalidate` expire time ကို သတ်မှတ်နိုင်ပါတယ်။

`next.config.js` ထဲမှာ အောက်ပါအတိုင်း `expireTime` config ကို ထည့်ပါ:

```js filename="next.config.js"
module.exports = {
  // တစ်နာရီကို စက္ကန့်ဖြင့် ဖော်ပြသည်
  expireTime: 3600,
}
```

အခု `Cache-Control` header ပို့တဲ့အခါ — expire time က သတ်မှတ်ထားတဲ့ revalidate period အလိုက် တွက်ချက်ပါလိမ့်မယ်။

ဥပမာ — route တစ်ခုမှာ revalidate ကို 15 မိနစ် သတ်မှတ်ထားပြီး expire time က တစ်နာရီဆိုရင် — ထုတ်လုပ်လိုက်တဲ့ `Cache-Control` header က `s-maxage=900, stale-while-revalidate=2700` ဖြစ်လာမှာ ဖြစ်လို့ — configure လုပ်ထားတဲ့ expire time ထက် 15 မိနစ် လျော့နည်းတဲ့ အချိန်အထိ stale (ဒေတာဟောင်း) အဖြစ် ဆက်ရှိနေနိုင်ပါတယ်။
