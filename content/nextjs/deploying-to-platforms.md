---
title: "Deploying to Platforms (Platform အမျိုးမျိုးဆီ Deploy လုပ်ခြင်း)"
description: "Next.js ကို platform အမျိုးမျိုးဆီ deploy လုပ်ခြင်း — Node.js server အနည်းဆုံး လိုအပ်ချက်, functional fidelity နဲ့ performance fidelity ကွာခြားပုံ, feature support matrix (Streaming, Shared Cache, Edge Stitching), CDN infrastructure compatibility ဇယား, verified adapters နဲ့ Deployment Adapter API အကြောင်း"
order: 123
source: "https://nextjs.org/docs/app/guides/deploying-to-platforms"
status: translated
updated: 2026-09-03
---

Next.js က static နဲ့ dynamic content တွေကို [spectrum (ဆက်တိုက် ဖြစ်နိုင်တဲ့ အနေအထားများ) တစ်ခုအနေနဲ့](/docs/nextjs/rendering-philosophy) — component အဆင့်မှာ သတ်မှတ်ပါတယ်။ ဒီ model ထဲက feature တစ်ခုစီက platform ရဲ့ မတူညီတဲ့ စွမ်းဆောင်ရည်တွေ လိုအပ်ပါတယ်။ ဒီ page က သင့် platform က ဘာတွေ ထောက်ပံ့ဖို့ လိုအပ်လဲ၊ သင့်ရဲ့ deployment ကို ဘယ်လို configure လုပ်ရမလဲ နားလည်စေဖို့ ကူညီပေးပါတယ်။

## အနည်းဆုံး လိုအပ်ချက်များ (Minimum Requirements)

Next.js run လုပ်ဖို့ သင့် platform မှာ **Node.js server တစ်ခု** လိုအပ်ပါတယ်။ ဒီလောက်ပါပဲ။

`next start` process တစ်ခုတည်းက Next.js feature တိုင်းကို မှန်ကန်စွာ ကိုင်တွယ်နိုင်ပါတယ် — Server Components, ISR, PPR, Cache Components, Server Actions, Proxy နဲ့ `after()` တွေ အပါအဝင်ပါ။ PPR နဲ့ Server Components လို features တွေက content တွေကို တဖြည်းဖြည်း (progressively) ပို့ဆောင်နိုင်ဖို့ streaming support လိုအပ်ပါတယ် (အဲဒါ မရှိရင် responses တွေကို buffer လုပ်ပြီး တစ်စုတစ်ဝေးတည်း ပို့ပါတယ် — အလုပ်ကတော့ လုပ်နေဦးမှာဖြစ်ပေမယ့် streaming ရဲ့ performance အကျိုးကျေးဇူး ဆုံးရှုံးသွားပါတယ်)။ နောက်ထပ် infrastructure တွေ (CDN caching, edge compute, shared cache) က အဓိကအားဖြင့် performance နဲ့ multi-instance consistency ကို တိုးတက်စေပါတယ်။ Multi-instance deployments တွေမှာ shared cache နဲ့ tag coordination က instance တွေကြားက stale divergence (သက်တမ်းလွန် ကွာဟမှု) တွေကို လျှော့ချပေးပါတယ်။ တစ်ခုတည်းသော နောက်ထပ် dependency ကတော့ [Image Optimization](/docs/nextjs/component-image) အတွက် လိုအပ်တဲ့ `sharp` package ပါ။

## Functional Fidelity နဲ့ Performance Fidelity (Functional vs. Performance Fidelity)

Next.js အတွက် platform support ကို အကဲဖြတ်တဲ့အခါ အဆင့် နှစ်ခုကို ခွဲခြားကြည့်တာ အထောက်အကူ ဖြစ်ပါတယ်:

**Functional fidelity (လုပ်ဆောင်ချက် ပြည့်စုံမှု)** ဆိုတာ Next.js feature တိုင်း မှန်ကန်စွာ အလုပ်လုပ်တာကို ဆိုလိုပါတယ်။ [Adapter test suite](https://nextjs.org/docs/app/api-reference/adapters/testing-adapters) က စာချုပ် (contract) သဘောပါ — platform တစ်ခုရဲ့ adapter က စမ်းသပ်မှုတွေ အောင်ရင် အဲဒီ platform က Next.js ကို ထောက်ပံ့တယ်လို့ ဆိုပါတယ်။ ဒါက binary ဖြစ်ပါတယ် — အောင်တယ် ဒါမှမဟုတ် မအောင်ဘူးပဲ။

**Performance fidelity (စွမ်းဆောင်ရည် ပြည့်စုံမှု)** ဆိုတာ features တွေက သူတို့ရဲ့ အကောင်းဆုံး performance အခြေအနေတွေ ရရှိတာကို ဆိုလိုပါတယ်။ ဥပမာတွေကတော့ — PPR ရဲ့ static shell ကို origin latency မဟုတ်ဘဲ CDN latency နဲ့ ပေးဝေတာ၊ ဒါမှမဟုတ် ISR က stale content ကို ချက်ချင်း ပေးပြီး revalidation ကို sub-second (တစ်စက္ကန့်အောက်) အတွင်း ပျံ့နှံ့စေတာမျိုးပါ။ Performance fidelity က spectrum တစ်ခုဖြစ်ပြီး — platform တစ်ခုစီက သူ့ရဲ့ architecture အလိုက် မတူညီစွာ ရောက်ရှိပါလိမ့်မယ်။

Functional fidelity ရရှိတဲ့ platform က Next.js အတွက် အပြည့်အဝ ထောက်ပံ့တဲ့ deployment target ပါ။ Performance fidelity ကတော့ platforms တွေ အချင်းချင်း ကွဲပြားပေါ်လွင်တဲ့ နေရာဖြစ်ပြီး — အချိန်ကြာလာတာနဲ့အမျှ တဖြည်းဖြည်း တိုးတက်ပါတယ်။

အောက်က feature matrix ကို ဒီရှုထောင့်ကနေ ကြည့်ပါ — "Streaming Required" နဲ့ "Shared Cache Recommended" တွေက functional fidelity အတွက် ဘာတွေ လိုအပ်လဲ ဖော်ပြပြီး, "Edge Stitching" ကတော့ performance fidelity အတွက် optimization တစ်ခုပါ။

## Feature Support Matrix (Feature ထောက်ပံ့မှု ဇယား)

Feature တစ်ခုစီက မတူညီတဲ့ infrastructure စွမ်းဆောင်ရည်တွေ လိုအပ်ပါတယ်။ "Edge Stitching" column က **performance optimization** တစ်ခုဖြစ်ပြီး — မှန်ကန်မှု အတွက် လိုအပ်ချက် မဟုတ်ပါဘူး။ Feature အားလုံးက origin server တစ်ခုတည်းကနေ မှန်ကန်စွာ အလုပ်လုပ်ပါတယ်။

| Feature                        | Streaming | Shared Cache | Edge Stitching | Notes                                                                                            |
| ------------------------------ | --------- | ------------ | -------------- | ------------------------------------------------------------------------------------------------ |
| Server Components              | လိုအပ်     | မလို         | မလို           | အခြေခံ streaming support                                                                       |
| ISR (time-based)               | မလို       | အကြံပြု       | မလို           | Shared cache မရှိဘဲ instance တစ်ခုချင်းစီမှာ အလုပ်လုပ်သည်                                   |
| ISR (on-demand)                | မလို       | အကြံပြု       | မလို           | [Tag propagation](/docs/nextjs/how-revalidation-works) က multi-instance အတွက် shared cache လိုအပ် |
| Partial Prerendering           | လိုအပ်     | အကြံပြု       | ရွေးချယ်နိုင်   | [PPR Platform Guide ကို ကြည့်ပါ](https://nextjs.org/docs/app/guides/ppr-platform-guide)        |
| Cache Components (`use cache`) | လိုအပ်     | အကြံပြု       | မလို           | Shared cache က cross-instance consistency ကို ဖြစ်စေသည်                                     |
| Proxy / Middleware             | မလို       | မလို         | မလို           | Edge (သို့) origin မှာ run သည်                                                                |
| Server Actions                 | လိုအပ်     | မလို         | မလို           | Streaming response ပါတဲ့ POST requests                                                         |
| `after()`                      | မလို       | မလို         | မလို           | [Graceful shutdown](https://nextjs.org/docs/app/guides/self-hosting#after) support လိုအပ်သည်   |

**Streaming Required** ဆိုတာ — platform က chunked transfer encoding (သို့) HTTP/2 streaming ကို ထောက်ပံ့ရမယ်ဆိုတဲ့ အပြင် — response ကို client ဆီ မပို့ခင် buffer မလုပ်ရပါဘူး။

**Shared Cache Recommended** ဆိုတာ — server instance အများအပြားက ချိန်ညှိ လုပ်ဆောင်ဖို့ shared cache backends တွေ ရှိရင် အကျိုးရှိပါတယ်။ ISR နဲ့ server response caching အတွက် [`cacheHandler`](https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath) ကို သုံးပါ။ `'use cache'` entries တွေအတွက်တော့ [`cacheHandlers`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) ကို သုံးပါ။ Shared cache မရှိရင် instance တစ်ခုစီက သူ့ကိုယ်ပိုင် cache ကို သီးခြား ထိန်းသိမ်းပါတယ် — feature တွေက instance တစ်ခုစီမှာ မှန်ကန်စွာ အလုပ်လုပ်နေဆဲ ဖြစ်ပေမယ့် — revalidation events တွေက instance တွေကြား ပျံ့နှံ့မသွားပါဘူး။

## CDN Infrastructure Compatibility (CDN Infrastructure လိုက်ဖက်ညီမှု)

အောက်ပါ ဇယားက CDN အဓိက တစ်ခုစီအတွက် infrastructure primitives တွေကို ဖော်ပြထားပါတယ်။ ဒါတွေက ရရှိနိုင်တဲ့ တည်ဆောက်ရေး အခြေခံအစိတ်အပိုင်းတွေ (building blocks) ဖြစ်ပြီး — အပြီးသတ် integrations တွေ မဟုတ်ပါဘူး:

| CDN               | Edge Compute | Key-Value / Tags | Blob Storage   | PPR Resuming    |
| ----------------- | ------------ | ---------------- | -------------- | --------------- |
| Cloudflare        | Workers      | KV               | R2             | ရသည် (worker) |
| Akamai            | EdgeWorkers  | EdgeKV           | Object Storage | ရသည် (worker) |
| Amazon CloudFront | Lambda@Edge  | KeyValueStore    | S3             | ရသည် (Lambda) |
| Fastly            | Compute      | KV Store         | Object Storage | ရသည် (WASM)   |
| Azure             | Functions    | Managed Redis    | Blob Storage   | ရသည် (server) |
| Google Cloud      | Cloud Run    | Various KV       | Cloud Storage  | ရသည် (server) |

ဒါတွေက ရရှိနိုင်တဲ့ တည်ဆောက်ရေး အခြေခံအစိတ်အပိုင်းတွေ ဖြစ်ပြီး — အပြီးသတ် integrations တွေ မဟုတ်ပါဘူး။ ဒီနေ့ ရှိနေတဲ့ community adapters အများစုက Next.js ကို Docker container (သို့) Node.js server အနေနဲ့ deploy လုပ်ပြီး — edge KV (သို့) PPR resuming လို CDN-specific primitives တွေကို အသုံးမချပါဘူး။ Adapters ရဲ့ လက်ရှိ စာရင်းအတွက် [Deploying](/docs/nextjs/deploying) page ကို ကြည့်ပါ။ CDN နဲ့ ဆိုင်တဲ့ caching ထည့်သွင်းစဉ်းစားစရာတွေ (custom headers တွေမှာ `Vary` နဲ့ ပတ်သက်တဲ့ သိထားပြီးသား ကန့်သတ်ချက်တွေ အပါအဝင်) အတွက် [CDN Caching](/docs/nextjs/cdn-caching) ကို ကြည့်ပါ။

## Adapters (Adapter များ)

Next.js က [Deployment Adapter API](https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath) တစ်ခု ပေးထားပါတယ် — ဒါက platforms တွေကို သူတို့ရဲ့ infrastructure အတွက် Next.js applications တွေကို ဘယ်လို build လုပ်၊ deploy လုပ်မလဲ စိတ်ကြိုက် ပြင်ဆင်နိုင်စေပါတယ်။ Adapters တွေက build time မှာ run ပြီး — standard Next.js build ကနေ platform-specific output တွေ ထုတ်လုပ်ပေးပါတယ်။ ဘယ်သူမဆို အထူး access မလိုဘဲ public API ကို သုံးပြီး adapter တစ်ခု တည်ဆောက်နိုင်ပါတယ်။

Adapter API နဲ့ Next.js ရဲ့ caching interfaces တွေ ပေါင်းပြီး platform integration ရဲ့ မျက်နှာပြင် အပြည့်အစုံ ဖြစ်ပါတယ်။ Adapter က build-time output ကို ကိုင်တွယ်ပြီး — `cacheHandler` နဲ့ `cacheHandlers` တွေက runtime caching paths အမျိုးမျိုးကို လွှမ်းခြုံပါတယ်။ `cacheHandler` (singular) က ISR, route handlers, patched `fetch`/`unstable_cache` နဲ့ image optimization လို server cache paths တွေကို လွှမ်းခြုံပြီး — `cacheHandlers` (plural) က `'use cache'` directive ရဲ့ backends တွေကို configure လုပ်ပါတယ်။

### Verified Adapters (အတည်ပြုထားသော Adapters)

**Verified adapter (အတည်ပြုထားသော adapter)** ဆိုတာ လိုအပ်ချက် နှစ်ခု ပြည့်မီတဲ့ adapter တစ်ခုပါ:

1. **Open source (ပွင့်လင်းရင်းမြစ်)။** Adapter ရဲ့ source code ကို လူအများ ကြည့်ရှုနိုင်အောင် ဖွင့်ထားပြီး — community ရော Next.js team ပါ စစ်ဆေး၊ ပံ့ပိုး၊ အတည်ပြုနိုင်ပါတယ်။
2. **Compatibility test suite ကို run လုပ်နိုင်ခြင်း။** Platform က သူ့ရဲ့ adapter နဲ့ [Next.js compatibility test suite](https://nextjs.org/docs/app/api-reference/adapters/testing-adapters) အပြည့်အစုံကို run လုပ်နိုင်တဲ့ နည်းလမ်း ပေးထားပါတယ်။ ဒါက ဘယ် features တွေ အလုပ်လုပ်လဲ၊ ဘယ်ဟာတွေ လုပ်ဆောင်ဆဲလဲ၊ ဘယ်နေရာတွေမှာ ကွာဟချက်တွေ ကျန်နေလဲဆိုတာ မြင်နိုင်စေပါတယ်။

Verified adapters တွေကို [Next.js GitHub organization](https://github.com/nextjs) အောက်မှာ ထားရှိပြီး — Next.js documentation ထဲမှာ supported deployment targets အဖြစ် စာရင်းသွင်းပါတယ်။ သက်ဆိုင်ရာ platform teams တွေက ထိန်းသိမ်းပါတယ်။ သီးသန့် framework hooks (သို့) integration paths တွေ မရှိပါဘူး — Vercel ရဲ့ adapter က တခြား adapter တိုင်းလိုပဲ တူညီတဲ့ public API ကို သုံးပါတယ်။

Verified adapters တွေနဲ့ — [Ecosystem Working Group](https://nextjs.org/ecosystem-working-group) ကနေတစ်ဆင့် verified status ဆီ ဦးတည် လုပ်ဆောင်နေတဲ့ platforms တွေအတွက် Next.js team က အောက်ပါအတိုင်း ကတိပြုပါတယ်:

- **ညှိနှိုင်း စမ်းသပ်ခြင်း (Coordinated testing)။** Major releases တွေ မထွက်ခင် platform teams တွေနဲ့ ပူးပေါင်းပြီး compatibility test suite ကို run ကာ — ပြဿနာတွေကို စောစောစီးစီး ဖော်ထုတ်ပါတယ်။
- **Early access (အစောပိုင်း ဝင်ရောက်သုံးခွင့်)။** Adapter authors တွေက RFCs နဲ့ release candidates ကာလတွေမှာ API အပြောင်းအလဲတွေကို စောစော ဝင်ရောက်သုံးခွင့် ရရှိပါတယ်။
- **တိုက်ရိုက် ပံ့ပိုးမှု (Direct support)။** Adapter contract ကို update လုပ်ဖို့ လိုအပ်လာရင် adapter teams တွေနဲ့ တိုက်ရိုက် ပူးပေါင်း ဆောင်ရွက်ပါတယ်။

> **သိထားသင့်သည်:** Platforms တွေက တူညီတဲ့ public API နဲ့ test suite ပေါ်မှာ closed-source adapters တွေကို တည်ဆောက်နိုင်ပါတယ်။ ဒါပေမယ့် closed-source adapters တွေကိုတော့ verified အဖြစ် စာရင်းသွင်းမှာ မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ Next.js team က မစစ်ဆေးနိုင်တာကို အတည်ပြုလို့ မရလို့ပါ။

## Infrastructure လိုအပ်ချက်များဆိုင်ရာ မှတ်ချက် (A Note on Infrastructure Requirements)

Next.js ရဲ့ [rendering model](/docs/nextjs/rendering-philosophy) က static/dynamic နယ်နိမိတ်ကို route အဆင့်မှာ မဟုတ်ဘဲ component အဆင့်မှာ ထားပါတယ်။ ပိုနုနယ်တဲ့ နယ်နိမိတ်တွေက developer တွေအတွက် ပိုပြီး လွတ်လပ်မှု ပေးစွမ်းပေမယ့် — hosting platforms တွေအတွက်တော့ ပိုကျယ်ပြန့်တဲ့ လိုအပ်ချက်တွေနဲ့ အတူ လာပါတယ်။ ဒါက တမင်ချည်း ပြုလုပ်ထားတဲ့ အပေးအယူတစ်ခုပါ — ဒီ page ပေါ်က infrastructure လိုအပ်ချက်တွေ ရှိနေတာက rendering model ရဲ့ ပေးစွမ်းနိုင်မှုကြောင့်ပဲ ဖြစ်ပါတယ်။
