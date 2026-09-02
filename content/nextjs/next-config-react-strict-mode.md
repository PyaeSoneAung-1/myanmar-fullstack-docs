---
title: "reactStrictMode (Strict Mode ဖွင့်ရန် သတ်မှတ်ချက်)"
description: "reactStrictMode option — React ရဲ့ Strict Mode (development mode မှာ ဖြစ်နိုင်ချေ ပြဿနာများကို မီးမောင်းထိုးပြတဲ့ feature) ကို opt-in လုပ်ရန်; app router တွင် v13.5.1 မှစ၍ default true"
order: 81
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/reactStrictMode"
status: translated
updated: 2026-09-02
---

> **သိထားသင့်သည်:** Next.js 13.5.1 ကစပြီး `app` router မှာ Strict Mode က default အားဖြင့် `true` ဖြစ်နေလို့ — ဒီ configuration က `pages` router အတွက်ပဲ လိုအပ်ပါတယ်။ `reactStrictMode: false` လို့ သတ်မှတ်ပြီး Strict Mode ကို ပိတ်ထားလို့တော့ ရပါသေးတယ်။

> **အကြံပြုချက်:** သင့် Next.js application ထဲမှာ Strict Mode ဖွင့်ထားဖို့ အခိုင်အမာ အကြံပြုပါတယ် — ဒါက သင့် application ကို React ရဲ့ အနာဂတ် အတွက် ပိုကောင်းအောင် ကြိုတင် ပြင်ဆင်ပေးနိုင်လို့ပါ။

React ရဲ့ [Strict Mode](https://react.dev/reference/react/StrictMode) က application ထဲက ဖြစ်နိုင်ချေ ပြဿနာတွေကို မီးမောင်းထိုးပြတဲ့ **development mode အတွက်ပဲ** သုံးတဲ့ feature တစ်ခုပါ။ မလုံခြုံတဲ့ lifecycles တွေ၊ legacy API အသုံးပြုမှုတွေနဲ့ အခြား feature များစွာကို ဖော်ထုတ်ဖို့ ကူညီပေးပါတယ်။

Next.js runtime က Strict Mode နဲ့ လိုက်ဖက်ညီ (compliant) ပါ။ Strict Mode ကို opt-in လုပ်ဖို့ — သင့် `next.config.js` ထဲမှာ အောက်ပါ option ကို သတ်မှတ်ပါ:

```js filename="next.config.js"
module.exports = {
  reactStrictMode: true,
}
```

သင် (သို့) သင့်အဖွဲ့က application တစ်ခုလုံးမှာ Strict Mode ကို သုံးဖို့ အဆင်သင့် မဖြစ်သေးရင်လည်း ရပါတယ်! `<React.StrictMode>` ကို သုံးပြီး page တစ်ခုချင်းစီ အလိုက် တဖြည်းဖြည်း (incrementally) migrate လုပ်နိုင်ပါတယ်။
