---
title: "deploymentId (deployment identifier သတ်မှတ်ချက်)"
description: "deploymentId option — rolling deployments အတွင်း version skew ကာကွယ်မှုနှင့် cache busting အတွက် deployment identifier သတ်မှတ်ရန်; NEXT_DEPLOYMENT_ID env variable ဖြင့်လည်း သတ်မှတ်နိုင်; asset URLs တွင် ?dpl= query, x-deployment-id header, data-dpl-id attribute နှင့် 'use cache' cache key တို့အပေါ် သက်ရောက်မှု"
order: 207
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/deploymentId"
status: translated
updated: 2026-09-03
---

`deploymentId` option က သင့် deployment အတွက် identifier တစ်ခု သတ်မှတ်နိုင်စေပါတယ်။ ဒီ identifier ကို rolling deployments အတွင်း [version skew](/docs/nextjs/self-hosting) ကာကွယ်မှုနဲ့ cache busting တွေအတွက် သုံးပါတယ်။

```js filename="next.config.js"
module.exports = {
  deploymentId: 'my-deployment-id',
}
```

ဒါ့အပြင် `NEXT_DEPLOYMENT_ID` environment variable ကို သုံးပြီးလည်း deployment ID ကို သတ်မှတ်နိုင်ပါတယ်:

```bash
NEXT_DEPLOYMENT_ID=my-deployment-id next build
```

> **သိထားသင့်သည်:** နှစ်ခုလုံး သတ်မှတ်ထားရင် — `next.config.js` ထဲက `deploymentId` တန်ဖိုးက `NEXT_DEPLOYMENT_ID` environment variable ထက် ဦးစားပေး အသုံးပြုပါတယ်။

## ဘယ်လို အလုပ်လုပ်လဲ (How it works)

`deploymentId` သတ်မှတ်ထားတဲ့အခါ Next.js က:

1. Static asset URLs (JavaScript, CSS, images) တွေမှာ `?dpl=<deploymentId>` ကို ထပ်ဖြည့်ပေးပါတယ်
2. Client-side navigation requests တွေမှာ `x-deployment-id` header တစ်ခု ထည့်ပေးပါတယ်
3. Navigation responses တွေမှာ `x-nextjs-deployment-id` header တစ်ခု ထည့်ပေးပါတယ်
4. `<html>` element ပေါ်မှာ `data-dpl-id` attribute တစ်ခု ထည့်သွင်းပေးပါတယ်
5. [`'use cache'` cache key](/docs/nextjs/use-cache) ထဲမှာ `deploymentId` ကို ထည့်သွင်းပြီး — deployment ID ပြောင်းလဲတဲ့အခါ cache entries တွေကို invalidate လုပ်ပါတယ်

Client က သူ့ရဲ့ deployment ID နဲ့ server ရဲ့ဟာ (response header ကနေ) မကိုက်ညီတာကို သိရှိတဲ့အခါ — client-side navigation အစား hard navigation (page အပြည့် reload) တစ်ခုကို စတင်ပါတယ်။ ဒါက users တွေ assets နဲ့ Server Functions တွေကို တသမတ်တည်း ရှိတဲ့ deployment version တစ်ခုကနေ အမြဲ လက်ခံရရှိစေပါတယ်။

> **သိထားသင့်သည်:** Next.js က incoming requests တွေမှာ `?dpl=` query parameter ကို ဖတ်မပေးပါဘူး။ အဲဒီ query parameter က routing အတွက် မဟုတ်ဘဲ — cache busting (browsers နဲ့ CDNs တွေ fresh assets တွေကို fetch လုပ်ကြောင်း သေချာစေခြင်း) အတွက်ပါ။ Version-aware routing လိုအပ်ရင် — deployment-based routing ကို အကောင်အထည်ဖော်ဖို့ သင့် hosting provider (သို့) CDN ရဲ့ documentation ကို တိုင်ပင်ပါ။

## အသုံးပြုပုံများ (Use cases)

### Rolling deployments (အဆင့်လိုက် deploy လုပ်ခြင်း)

Rolling deployment အတွင်း server instance အချို့က version အသစ်ကို run နေချိန် တချို့က version အဟောင်းကို run နေတုန်း ဖြစ်နိုင်ပါတယ်။ Deployment ID မရှိဘဲနဲ့ဆို — users တွေက assets အဟောင်း/အသစ် ရောနှောပြီး ရရှိကာ errors တွေ ဖြစ်စေနိုင်ပါတယ်။

Deployment တစ်ခုစီမှာ တသမတ်တည်း `deploymentId` တစ်ခု သတ်မှတ်ထားခြင်းက အောက်ပါတို့ကို သေချာစေပါတယ်:

- Clients တွေက matching deployment version တစ်ခုကနေ assets တွေကို အမြဲတမ်း request လုပ်ပါတယ်
- Mismatch တွေက မှန်ကန်တဲ့ assets တွေကို fetch လုပ်ဖို့ full reload တစ်ခု ဖြစ်ပေါ်စေပါတယ်
- Server Functions တွေက deployment boundaries တွေကိုဖြတ်ပြီး မှန်ကန်စွာ အလုပ်လုပ်ပါတယ်

### Server အများအပြား ပတ်ဝန်းကျင်များ (Multi-server environments)

Load balancer တစ်ခုနောက်မှာ သင့် Next.js application ရဲ့ instance အများအပြား run နေတဲ့အခါ — deployment တစ်ခုတည်းအတွက် instance တွေအားလုံးက `deploymentId` တစ်ခုတည်းကို သုံးသင့်ပါတယ်။

```js filename="next.config.js"
module.exports = {
  deploymentId: process.env.DEPLOYMENT_VERSION || process.env.GIT_SHA,
}
```

Per-deployment တန်ဖိုးတစ်ခုက requests တွေကိုလည်း deployment အလိုက် route လုပ်မှသာ skew တွေကို ရှောင်ရှားနိုင်ပါတယ်။ Next.js က `?dpl=` ပေါ်မှာ route လုပ်မပေးလို့ — အဲဒီ routing က သင့် host (သို့) CDN ကနေ လာရပါတယ်။ အဲဒါမရှိဘဲနဲ့ဆို rollout အတွင်း တခြား deployment တစ်ခုရဲ့ instance ဆီ ရောက်သွားတဲ့ clients တွေက — navigation လုပ်မယ့်အစား reload လုပ်ရပါလိမ့်မယ်။

## Version History

| Version    | Changes                                                                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v16.2.0`  | Pages Router က response header ကနေ version skew ကို ရှာဖွေတွေ့ရှိပြီး — `deploymentId` သတ်မှတ်ထားတဲ့အခါ build ID က constant ဖြစ်နေပါတယ်။ |
| `v14.1.4`  | `deploymentId` က top-level config option အဖြစ် stable ဖြစ်လာ။                                                                                                  |
| `v13.4.10` | `experimental.deploymentId` စတင် မိတ်ဆက်။                                                                                                                   |

## Related (ဆက်စပ်စာမျက်နှာများ)

- [Self-Hosting - Version Skew](/docs/nextjs/self-hosting)
- [generateBuildId](https://nextjs.org/docs/app/api-reference/config/next-config-js/generateBuildId)
