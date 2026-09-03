---
title: "staleTimes (Client Cache သက်တမ်း သတ်မှတ်ချက်)"
description: "staleTimes option — Client Cache ထဲတွင် page segments များကို cache လုပ်ရန်နှင့် revalidation time (static/dynamic) ကို စက္ကန့်ဖြင့် သတ်မှတ်ရန် experimental feature; dynamic default 0 စက္ကန့်, static default 5 မိနစ်"
order: 165
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/staleTimes"
status: translated
updated: 2026-09-03
---

`staleTimes` က [Client Cache](https://nextjs.org/docs/app/glossary#client-cache) ထဲမှာ page segments တွေကို cache လုပ်နိုင်စေတဲ့ experimental feature တစ်ခုပါ။

ဒီ experimental feature ကို ဖွင့်ပြီး ကိုယ်ပိုင် revalidation times (ဒေတာ ပြန်လည်စစ်ဆေးသည့် အချိန်များ) တွေ သတ်မှတ်ဖို့ — experimental `staleTimes` flag ကို အောက်ပါအတိုင်း သတ်မှတ်ပါ:

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
}

module.exports = nextConfig
```

`static` နဲ့ `dynamic` properties တွေက [link prefetching](/docs/nextjs/component-link) အမျိုးအစား အမျိုးမျိုးအပေါ် မူတည်တဲ့ အချိန်ကာလ (စက္ကန့်နဲ့) တွေနဲ့ ကိုက်ညီပါတယ်။

- Page က statically generated မဟုတ်သလို အပြည့်အဝ prefetch လည်း မလုပ်ထားတဲ့အခါ (ဥပမာ — `prefetch={true}` နဲ့) `dynamic` property ကို သုံးပါတယ်။
  - Default: 0 စက္ကန့် (cache မလုပ်)
- Statically generated လုပ်ထားတဲ့ pages တွေ၊ (သို့) `Link` ရဲ့ `prefetch` prop ကို `true` လို့ သတ်မှတ်ထားတဲ့အခါ၊ (သို့) [`router.prefetch`](/docs/nextjs/use-router) ကို ခေါ်တဲ့အခါ `static` property ကို သုံးပါတယ်။
  - Default: 5 မိနစ်

> **သိထားသင့်သည် (Good to know):**
>
> - ဒီ configuration ထဲမှာ သတ်မှတ်ထားတဲ့ `static` ကာလအတွက် [Loading boundaries](/docs/nextjs/file-conventions-loading) တွေကို ပြန်သုံးလို့ရတဲ့အနေနဲ့ (reusable) သတ်မှတ်ပါတယ်။
> - ဒါက [partial rendering](https://nextjs.org/docs/app/getting-started/linking-and-navigating#client-side-transitions) ကို မသက်ရောက်ပါဘူး — **ဆိုလိုတာက shared layouts တွေက navigation တိုင်းမှာ အလိုအလျောက် ပြန် fetch မလုပ်တော့ဘဲ ပြောင်းလဲတဲ့ page segment ကိုပဲ ပြန် fetch လုပ်မှာ ဖြစ်ပါတယ်။**
> - ဒါက [back/forward caching](https://nextjs.org/docs/app/glossary#client-cache) ရဲ့ အပြုအမူကို မပြောင်းလဲပါဘူး — layout shift မဖြစ်အောင်နဲ့ browser ရဲ့ scroll position မပျောက်အောင် ကာကွယ်ဖို့ ဖြစ်ပါတယ်။

### Version History

| Version   | အပြောင်းအလဲ                                    |
| --------- | -------------------------------------------- |
| `v15.0.0` | `dynamic` `staleTimes` ရဲ့ default ကို 30s ကနေ 0s သို့ ပြောင်းလဲ။ |
| `v14.2.0` | Experimental `staleTimes` စတင် မိတ်ဆက်။        |
