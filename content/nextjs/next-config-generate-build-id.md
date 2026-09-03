---
title: "generateBuildId (build ID ထုတ်လုပ်ခြင်း)"
description: "generateBuildId option — containers များကြားတွင် တစ်သမတ်တည်း (consistent) ဖြစ်သည့် build ID တစ်ခု ထုတ်လုပ်ရန် `next build` အတွင်း အသုံးပြုသည့် function သတ်မှတ်ချက်"
order: 193
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/generateBuildId"
status: translated
updated: 2026-09-03
---

Next.js က `next build` ပြုလုပ်နေစဉ်အတွင်း — သင့် application ရဲ့ ဘယ် version ကို serve လုပ်နေတယ်ဆိုတာ ခွဲခြားသိရှိနိုင်ဖို့ ID တစ်ခုကို ထုတ်လုပ်ပါတယ်။ Build တစ်ခုတည်းကိုပဲ containers အများအပြားမှာ သုံးပြီး boot up လုပ်သင့်ပါတယ်။

သင့် environment ရဲ့ stage တစ်ခုချင်းစီအတွက် ပြန်ပြန် build လုပ်နေရတယ်ဆိုရင် — containers တွေကြားမှာ သုံးဖို့ တစ်သမတ်တည်း ဖြစ်တဲ့ build ID တစ်ခုကို ထုတ်လုပ်ဖို့ လိုအပ်ပါတယ်။ `next.config.js` ထဲမှာ `generateBuildId` function ကို သုံးပါ:

```jsx filename="next.config.js"
module.exports = {
  generateBuildId: async () => {
    // ဒါက ဘာမဆို ဖြစ်နိုင်ပါတယ် — ဥပမာ နောက်ဆုံး git hash ကို သုံးမယ်ဆိုရင်
    return process.env.GIT_HASH
  },
}
```

> **သိထားသင့်သည် (Good to know):** [`deploymentId`](https://nextjs.org/docs/app/api-reference/config/next-config-js/deploymentId) ကို သတ်မှတ်ထားတဲ့အခါ — Next.js က constant build ID တစ်ခုကို သုံးပြီး `generateBuildId` က သက်ရောက်မှု မရှိတော့ပါဘူး။ [Version skew](/docs/nextjs/self-hosting) (version အမျိုးမျိုး ရောနှော ဖြစ်ပေါ်နေခြင်း) ကို deployment ID ကနေ ခွဲခြား သိရှိပါတယ်။
