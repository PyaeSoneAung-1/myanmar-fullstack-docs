---
title: "Runtime Integration (runtime ပေါင်းစပ်မှု)"
description: "build-time adapter နှင့် runtime cache interfaces တွဲလုပ်ပုံ — handler context, PPR chain headers"
order: 253
source: "https://nextjs.org/docs/app/api-reference/adapters/runtime-integration"
status: translated
updated: 2026-09-03
---

Deployment Adapter API က **build-time** (build ပြုလုပ်ချိန်) interface တစ်ခု ဖြစ်ပါတယ်။ ဘာတွေ build လုပ်ထားလဲ၊ requests တွေကို ဘယ်လို route လုပ်ရမလဲဆိုတာ သင့် platform ကို အသိပေးပါတယ်။ **Runtime** (run နေချိန်) အပြုအမူတွေ (request ကိုင်တွယ်မှု, streaming, caching) ကိုတော့ — Next.js server ကိုယ်တိုင်နဲ့ [`cacheHandler`](/docs/nextjs/next-config-incremental-cache-handler-path)၊ [`cacheHandlers`](/docs/nextjs/next-config-cache-handlers) ဆိုတဲ့ cache interfaces တွေက ကိုင်တွယ်ပါတယ်။

Adapter နဲ့ cache interfaces တွေ ပေါင်းစပ်ပြီး — platform integration ရဲ့ မျက်နှာပြင် အပြည့်အစုံ (complete platform integration surface) ကို ဖွဲ့စည်းလိုက်ပါတယ်:

- **Adapter** (build-time): Build outputs တွေကို process လုပ်ပြီး — routing ကို configure လုပ်ကာ — platform-specific infrastructure တွေကို ပြင်ဆင်ပေးပါတယ်။
- **Cache Interfaces** (runtime): `cacheHandler` က instances တွေကြားမှာ ISR/server cache storage နဲ့ revalidation တွေကို စီမံပေးပြီး — `cacheHandlers` က `'use cache'` directive ရဲ့ backends တွေနဲ့ tag coordination ကို configure လုပ်ပါတယ်။

## Handler Context (handlers ဆီ ပေးပို့သော context object)

Entrypoints တွေကို invoke လုပ်တဲ့အခါ — adapters တွေက `ctx` object တစ်ခုကို Next.js handler ဆီ ပေးပို့ပါတယ်။ အဓိက fields တွေကတော့:

- **`ctx.waitUntil`**: Promise တစ်ခုကို လက်ခံတဲ့ function တစ်ခုပါ။ Response ပို့ပြီးသွားပြီးနောက်မှာ serverless function ကို ဆက် အသက်ဝင်နေစေဖို့ သုံးပါတယ် — ဒါမှ cache revalidation လို background အလုပ်တွေ ပြီးမြောက်နိုင်မှာ ဖြစ်ပါတယ်။
- **`requestMeta.onCacheEntryV2`** (`addRequestMeta` ကနေတစ်ဆင့် သတ်မှတ်ပေးရတာ): Cache entry တစ်ခုကို ထုတ်လုပ်တဲ့အခါ (သို့) ရှာဖွေကြည့်တဲ့အခါ fire လုပ်တဲ့ callback တစ်ခုပါ။ Cache operations အားလုံး (PPR တစ်ခုတည်း မဟုတ်ဘဲ) ကို စောင့်ကြည့်ပြီး — သင့် platform ရဲ့ storage backend ဆီ cache updates တွေကို propagate (ပျံ့နှံ့စေခြင်း) လုပ်ဖို့ သုံးပါတယ်။ ဒီ callback က request ကို ကိုင်တွယ်ခဲ့တဲ့ instance ပေါ်မှာပဲ fire လုပ်ပါတယ်။ Multi-instance deployments တွေမှာဆိုရင် — သင့် adapter က shared storage ဆီ updates တွေကို propagate လုပ်ပေးရပါမယ်။ Coordination patterns တွေအတွက် [How Revalidation Works](/docs/nextjs/how-revalidation-works) ကို ကြည့်ပါ။

## PPR Chain Headers (PPR ကွင်းဆက် headers)

[prerenders output type](/docs/nextjs/adapter-output-types) ထဲမှာ — `pprChain.headers` က [resume protocol](/docs/nextjs/adapter-ppr) (ပြန်လည် စတင်ခြင်း protocol) အတွက် လိုအပ်တဲ့ headers တွေ ပါဝင်ပါတယ်။ အတိအကျ ဆိုရရင် — `{ 'next-resume': '1' }` ကို ပါဝင်ပါတယ်။

သင့် adapter က cached static shell တစ်ခုပါတဲ့ PPR-enabled route တစ်ခုကို detect တွေ့ရှိတဲ့အခါ:

1. Next.js handler ဆီ ပို့မယ့် internal request ပေါ်မှာ `pprChain.headers` ကို သတ်မှတ်ပါ။
2. Request ကို — `postponedState` ကို request body အဖြစ်နဲ့ — **POST** အနေနဲ့ ပို့ပါ။
3. Handler က ရွှေ့ဆိုင်းထားတဲ့ (deferred) Suspense boundaries တွေကိုပဲ render လုပ်ပြီး — ရလဒ်ကို stream လုပ်ပေးပါလိမ့်မယ်။

> **သိထားသင့်သည်:** Standard `next start` မှာတော့ server က shell ရော dynamic render ပါ ဖြတ်သန်းမှု (pass) တစ်ခုတည်းနဲ့တင် အလိုအလျောက် ကိုင်တွယ်ပေးပါတယ်။ Resume protocol က — shell ကို သီးခြား serve လုပ်ချင်တဲ့ adapter-based deployments တွေနဲ့ CDN-to-origin architectures တွေအတွက် — အသုံးဝင်ပါတယ်။ အကောင်အထည်ဖော်မှု ဆက်စပ် အကြောင်းအရာ အပြည့်အစုံအတွက် [PPR Platform Guide](/docs/nextjs/ppr-platform-guide) ကို ကြည့်ပါ။
