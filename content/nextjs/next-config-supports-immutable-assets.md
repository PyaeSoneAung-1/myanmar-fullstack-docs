---
title: "supportsImmutableAssets (immutable static assets ပံ့ပိုးမှု)"
description: "supportsImmutableAssets option — adapter ရေးသားသူများအတွက် immutable static assets (filename အားဖြင့် content-addressed ဖြစ်သော static assets) ပံ့ပိုးမှုမှ opt out လုပ်ရန်; `?dpl` query parameter ချန်လှပ်နိုင်၍ browser များ ကြာရှည် cache လုပ်နိုင်"
order: 194
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/supportsImmutableAssets"
status: translated
updated: 2026-09-03
---

> **သတိပြုရန် (Attention):** ဒီ option က အဓိကအားဖြင့် [adapter](https://nextjs.org/docs/app/api-reference/adapters) တွေ ရေးသားသူတွေအတွက် ရည်ရွယ်ပါတယ်။ App developer တွေအနေနဲ့ — adapter နဲ့ ဆိုင်တဲ့ ပြဿနာတွေကို ဖြေရှင်းနေချိန်မှာသာ ဒီ option ကို သတ်မှတ်သင့်ပါတယ်။
>
> **သင့် provider (သို့) adapter က မထောက်ပံ့ဘဲနဲ့ ဒီ feature ကို ဖွင့်မိရင် — deployments တွေ ပျက်စီး (broken) သွားနိုင်ပါတယ်။**

Skew protection (version အမျိုးမျိုး ရောနှောမှု ကာကွယ်ခြင်း) ဖွင့်ထားတဲ့အခါ — static asset requests တွေမှာ deployment-specific ဖြစ်တဲ့ query parameter တစ်ခု ပါဝင်ပါတယ်။ ဥပမာ:

```plain
GET https://foo.com/_next/static/chunks/0d_ks0ow7ur6m.js?dpl=<unique-deployment-id>
```

ဒီနည်းလမ်းရဲ့ အားနည်းချက်တစ်ခုက — deployment အသစ်တိုင်း ပြီးတိုင်း browser တွေက static assets တွေကို ပြန်လည် download လုပ်ရပါတယ်။ Assets တွေ မပြောင်းလဲဘူးဆိုတောင် ဖြစ်ပါတယ်။

Immutable static assets တွေက — သူတို့ရဲ့ filename အားဖြင့် မပြောင်းလဲနိုင်တဲ့ (immutable) နဲ့ content-addressed ဖြစ်တယ်လို့ အာမခံထားတဲ့ static assets တွေအတွက် `?dpl` query parameter ကို ချန်လှပ်နိုင်စေပါတယ်။ ဒါက browser တွေကို အဲဒီ assets တွေကို အကန့်အသတ်မရှိ cache လုပ်နိုင်စေပြီး — နောက်ဆက်တွဲ deployments တွေမှာ files တွေ upload လုပ်တဲ့အခါ မပြောင်းလဲတဲ့ static assets တွေကို ကျော်သွားနိုင်စေပါတယ်:

```plain
GET https://foo.com/_next/static/immutable/chunks/0d_ks0ow7ur6m.js
```

သင့် adapter က immutable static assets အတွက် ပံ့ပိုးမှု ဖွင့်ထားတယ်ဆိုရင် — ဒီ config option ကို သုံးပြီး အဲဒီကနေ ထွက် (opt out) လို့ရပါတယ်။ Adapter က ဒီ feature ကို မဖွင့်ထားဘူးဆိုရင်တော့ — ဒီ option က သက်ရောက်မှု မရှိပါဘူး:

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  supportsImmutableAssets: false,
}

module.exports = nextConfig
```

Adapter တစ်ခုထဲမှာ ဒီ feature ကို ဘယ်လို ပံ့ပိုးရမလဲဆိုတဲ့ အသေးစိတ်အတွက် — [Supporting immutable static assets](https://nextjs.org/docs/app/api-reference/adapters/immutable-static-assets) ကို ကြည့်ပါ။

## Version History

| Version   | အပြောင်းအလဲ                                     |
| --------- | --------------------------------------------- |
| `v16.3.0` | Immutable static assets အတွက် ပံ့ပိုးမှု ထည့်သွင်း။ |
