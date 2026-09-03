---
title: "သင့် Platform ပေါ်မှာ Partial Prerendering အကောင်အထည်ဖော်ခြင်း"
description: "Platform engineers တွေအတွက် PPR support အကောင်အထည်ဖော်နည်း လမ်းညွှန် — အခြေခံ origin rendering ကနေ optimized CDN integration အထိ — static HTML shell, postponedState, resume protocol, CDN Shell + Origin Compute နဲ့ implementation checklist အကြောင်း"
order: 189
source: "https://nextjs.org/docs/app/guides/ppr-platform-guide"
status: translated
updated: 2026-09-03
---

Partial Prerendering (PPR) က static နဲ့ dynamic rendering တို့ကို route တစ်ခုတည်းထဲမှာ ပေါင်းစပ်ပေးပါတယ်။ Build time မှာ Next.js က PPR-enabled route တစ်ခုစီအတွက် — static HTML shell တစ်ခုနဲ့ `postponedState` blob တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ Request time မှာ shell ကို ချက်ချင်း serve လုပ်ပြီး — dynamic အစိတ်အပိုင်းတွေကို render လုပ်ကာ client ဆီ stream လုပ်ပါတယ်။

ဒီ page က platforms တွေ PPR support ကို ကျွမ်းကျင်မှု အဆင့် အမျိုးမျိုးနဲ့ ဘယ်လို အကောင်အထည်ဖော်နိုင်လဲဆိုတာကို ရှင်းပြပေးပါတယ်။

## PPR ဘယ်လို အလုပ်လုပ်လဲ

### Build time (build လုပ်ချိန်)

PPR route တစ်ခုစီအတွက် Next.js က အောက်ပါတို့ကို ထုတ်လုပ်ပေးပါတယ်:

- **Static HTML shell** — prerender လုပ်လို့ရတဲ့ content အားလုံး ပါဝင်ပြီး — dynamic content ပေါ်လာမယ့် နေရာတွေမှာ [Suspense](/docs/nextjs/streaming) fallbacks တွေ ပါပါတယ်။
- **`postponedState`** တန်ဖိုး — serialize လုပ်ထားတဲ့ string တစ်ခုပါ။ ဒါကို opaque (ဖတ်ရှု၍ မရသော) အဖြစ် သဘောထားပါ: parse (ခွဲခြမ်း) လုပ်ခြင်း (သို့) ပြုပြင်ခြင်း မရှိဘဲ ဖြတ်ပို့လိုက်ရုံပါပဲ။ `postponedState` ကို ပြောင်းလဲလိုက်ရင် မှားယွင်းတဲ့ dynamic rendering output တွေ ထွက်လာပါတယ်။
- Page ရဲ့ static အစိတ်အပိုင်းတွေအတွက် **RSC payload** တစ်ခု။

### Request time (request ဝင်ချိန်)

PPR route တစ်ခုဆီ request တစ်ခု ရောက်လာတဲ့အခါ:

1. Server က static HTML shell ကို client ဆီ ချက်ချင်း ပို့ပေးပါတယ်။
2. Server က postponed state ကို သုံးပြီး dynamic အစိတ်အပိုင်းတွေရဲ့ rendering ကို ပြန်လည် စတင် (resume) လုပ်ပါတယ်။
3. Dynamic content တွေကို client ဆီ stream လုပ်ပြီး — React က ရွှေ့ဆိုင်းထားတဲ့ (deferred) Suspense boundaries တွေကို hydrate လုပ်နိုင်စေပါတယ်။

Client က static shell ကို ချက်ချင်း မြင်ရပြီး — dynamic content တွေက ဖြေရှင်းလို့ ပြီးသွားတာနဲ့ ပေါ်လာပါတယ်။

## PPR Artifacts တွေကို သိမ်းဆည်းခြင်း

PPR route တစ်ခုစီအတွက် artifacts နှစ်ခုကို အတူတကွ သိမ်းဆည်းထားရပါတယ်:

1. Static HTML shell ။
2. `postponedState` blob ။

ဒါတွေကို atomic ဖြစ်အောင် (တစ်ပြိုင်နက်တည်း ပြည့်စုံအောင်) သိမ်းဆည်း ပြီး update လုပ်ရပါမယ်။ PPR route တစ်ခုကို revalidate လုပ်တဲ့အခါ ([time-based](/docs/nextjs/incremental-static-regeneration) (သို့) [on-demand revalidation](/docs/nextjs/revalidate-tag) ကနေဖြစ်ဖြစ်) — Next.js က shell ရော postponed state ပါ နှစ်ခုလုံးကို အတူတကွ ပြန်ထုတ်လုပ်ပေးပါတယ်။ Shell အသစ်တစ်ခုကို postponed state အဟောင်းနဲ့ တွဲပြီး serve လုပ်တာ (သို့) အပြန်အစီး လုပ်တာမျိုးက မှားယွင်းတဲ့ dynamic content တွေကို ဖြစ်စေပါတယ်။

Cache updates တွေကို စောင့်ကြည့်ပြီး သင့် storage backend ဆီ ပို့ဆောင်ဖို့ — သင့် adapter ထဲမှာ [`requestMeta.onCacheEntryV2`](https://nextjs.org/docs/app/api-reference/adapters/implementing-ppr-in-an-adapter) ကို အသုံးပြုပါ။

## Origin-Only Implementation (origin သီးသန့် အကောင်အထည်ဖော်မှု)

**ဒါက အရိုးရှင်းဆုံး နည်းလမ်းဖြစ်ပြီး — streaming HTTP responses တွေကို ထောက်ပံ့တဲ့ platform တိုင်းမှာ အလုပ်လုပ်ပါတယ်။**

Requests အားလုံးက Next.js server ဆီ တိုက်ရိုက် သွားပါတယ်။ Server က shell ကို သူ့ရဲ့ local cache ကနေ ဖတ်ပြီး ပို့ပေးကာ — dynamic content တွေကို render လုပ်ပြီး stream လုပ်ပါတယ်။ `next start` က default အနေနဲ့ လုပ်တာ ဒါပဲ ဖြစ်ပါတယ်။

နောက်ထပ် infrastructure ဘာမှ မလိုအပ်ပါဘူး။ သင့် platform က streaming HTTP responses တွေကို ထောက်ပံ့နိုင်တယ်ဆိုရင် — PPR ကိုလည်း ထောက်ပံ့နိုင်ပါတယ်။

## CDN Shell + Origin Compute

TTFB ပိုကောင်းအောင် — static HTML shell ကို CDN edge မှာ cache လုပ်ထားနိုင်ပါတယ်။ Request တစ်ခု ရောက်လာတဲ့အခါ:

1. CDN က cache လုပ်ထားတဲ့ shell ကို ချက်ချင်း serve လုပ်ပါတယ် (edge latency နဲ့)။
2. CDN က origin server ဆီ resume request တစ်ခု ပို့ပါတယ် (ဖြစ်နိုင်ရင် shell ကို stream လုပ်နေတာနဲ့ အပြိုင်)။
3. Origin server က dynamic အစိတ်အပိုင်းတွေကိုပဲ render လုပ်ပြီး — ပြန် stream လုပ်ပါတယ်။
4. CDN က shell နဲ့ dynamic content တို့ကို client ဆီ single streaming response တစ်ခုအဖြစ် ပေါင်းစပ်ပေးပါတယ်။

ဒါအတွက် CDN က cached နဲ့ dynamic content တို့ကို streaming response တစ်ခုတည်းထဲမှာ ပေါင်းစပ်နိုင်တဲ့ mechanism တစ်ခုကို ထောက်ပံ့ပေးဖို့ လိုအပ်ပါတယ်။ Static shell ရဲ့ TTFB က edge latency အထိ ကျဆင်းသွားပြီး — dynamic content တွေကတော့ origin ကနေ ဆက်ပြီး stream လုပ်နေပါတယ်။

Latency အနိမ့်ဆုံး ရဖို့ဆိုရင် — shell ကို CDN cache ကနေ မဟုတ်ဘဲ edge storage (ဥပမာ — `onBuildComplete` အတွင်းမှာ ဖြည့်ပေးတဲ့ KV store တစ်ခု) ကနေ serve လုပ်နိုင်ပါတယ်။ ဒါက platform architecture ရဲ့ ဆုံးဖြတ်ချက်တစ်ခုဖြစ်ပြီး — Next.js application မှာ ဘာမှ ပြောင်းလဲစရာ မလိုပါဘူး။

## Resume Protocol (ပြန်လည် စတင်ခြင်း Protocol)

**Resume protocol** က Next.js handler ကို shell ကို ကျော်ပြီး — dynamic အစိတ်အပိုင်းတွေကိုပဲ render လုပ်ဖို့ ပြောပေးပါတယ်။ ဒါကို CDN-to-origin architectures တွေနဲ့ shell ကို သီးခြား serve လုပ်တဲ့ adapter-based deployments တွေမှာ အသုံးပြုပါတယ်။

Standard `next start` မှာတော့ server က shell ရော dynamic render ပါ ဖြတ်သန်းမှု (pass) တစ်ခုတည်းနဲ့တင် အလိုအလျောက် ကိုင်တွယ်ပေးပါတယ်။

### CDN-to-origin

CDN က သီးခြား Next.js origin ဆီ HTTP request တစ်ခု လုပ်တဲ့အခါ:

- `next-resume: 1` header ပါတဲ့ **POST** request တစ်ခုကို route ဆီ ပို့ပါ။
- `postponedState` blob ကို **request body** အဖြစ် ထည့်ပေးပါ။
- Server က ရွှေ့ဆိုင်းထားတဲ့ (deferred) Suspense boundaries တွေကိုပဲ render လုပ်ပြီး — ရလဒ်ကို stream လုပ်ပေးပါလိမ့်မယ်။

> **သိထားသင့်သည်:** POST request တစ်ခုက Server Action တစ်ခုနဲ့ PPR resume ကို ပေါင်းစပ်လိုက်တဲ့အခါ — request body ထဲမှာ postponed state ပြီးတော့ action body ပါ ပါဝင်ပါတယ်။ `x-next-resume-state-length` header က postponed state prefix ရဲ့ byte length ကို သယ်ဆောင်ပေးပြီး — handler က နှစ်ခုကို ခွဲထုတ်နိုင်စေပါတယ်။ Pure PPR resume (အများအားဖြင့် ဖြစ်တတ်တဲ့ ကိစ္စ) အတွက်တော့ — request body တစ်ခုလုံးက postponed state ဖြစ်လို့ ဒီ header မလိုအပ်ပါဘူး။

### Adapter-based (Adapter အခြေပြု)

Platform က handler function ကို တိုက်ရိုက် invoke လုပ်တဲ့အခါ:

- Entrypoint handler ကို `req.method` ကို `'POST'` အနေနဲ့ သတ်မှတ်ပြီး — request ပေါ်မှာ `next-resume: 1` header နဲ့ — `postponedState` ကို request body အဖြစ်နဲ့ ခေါ်ပါ။ (တနည်းအားဖြင့် handler invocation ရဲ့ တတိယ argument အဖြစ် `requestMeta: { postponed: postponedState }` ကို ပေးပို့နိုင်ပါတယ် — ဒါက equivalent ဖြစ်ပြီး HTTP layer ကို လုံးဝ ရှောင်ကွင်းလိုက်တာပါ။)
- Handler က ရွှေ့ဆိုင်းထားတဲ့ Suspense boundaries တွေကိုပဲ render လုပ်ပြီး — ရလဒ်ကို `res` ဆီ stream လုပ်ပါတယ်။
- HTTP round-trip မလိုအပ်ပါဘူး: handler ကို in-process အနေနဲ့ invoke လုပ်တာပါ။

### Build output ထဲမှာ PPR routes ရှာဖွေခြင်း

[Adapter output](https://nextjs.org/docs/app/api-reference/adapters/output-types) ထဲမှာ — PPR routes တွေကို prerenders array ထဲက `renderingMode: 'PARTIALLY_STATIC'` နဲ့ ခွဲခြားသတ်မှတ်ပါတယ်။ ဒီ entries တွေကို ရှာဖို့ `outputs.prerenders` ကို လှည့်ကြည့်ပြီး — `fallback.postponedState` ကို ဖတ်ပါ။

`pprChain.headers` ထဲမှာ resume protocol အတွက် လိုအပ်တဲ့ headers တွေ ပါဝင်ပါတယ်: `{ 'next-resume': '1' }` ။

Code ဥပမာတွေနဲ့ အသေးစိတ် အကောင်အထည်ဖော်မှုအတွက် — [Implementing PPR in an Adapter](https://nextjs.org/docs/app/api-reference/adapters/implementing-ppr-in-an-adapter) ကို ကြည့်ပါ။

## အကောင်အထည်ဖော်မှု စစ်ဆေးစာရင်း (Implementation Checklist)

1. **Build time မှာ PPR outputs တွေကို ဖတ်ပါ။** သင့် adapter ရဲ့ `onBuildComplete` ထဲမှာ — `renderingMode: 'PARTIALLY_STATIC'` ပါတဲ့ prerenders တွေကို ခွဲခြားသတ်မှတ်ပြီး — shell HTML နဲ့ `postponedState` ကို သင့် cache ထဲမှာ သိမ်းပါ။

2. **Request time မှာ shell ကို serve လုပ်ပါ။** PPR routes တွေဆီ ဝင်လာတဲ့ requests တွေအတွက် — cache လုပ်ထားတဲ့ shell ကို ချက်ချင်း serve လုပ်ပြီး streaming စတင်ပါ။

3. **Dynamic rendering ကို resume လုပ်ပါ။** CDN-to-origin အတွက်: `next-resume: 1` header နဲ့ postponed state ကို body အဖြစ် ထည့်ပြီး Next.js handler ဆီ POST request တစ်ခု ပို့ပါ။ Adapter-based အတွက်: POST method နဲ့ request body ထဲမှာ postponed state ပါအောင် handler ကို တိုက်ရိုက် ခေါ်ပါ (သို့) handler ဆီ `requestMeta: { postponed: postponedState }` ကို ပေးပို့ပါ။ Response ကို client ဆီ stream လုပ်ပါ။

4. **Cache updates တွေကို ကိုင်တွယ်ပါ။** Revalidation အပြီးမှာ shell + postponed state အတွဲအသစ်တွေကို ဖမ်းယူပြီး — သင့် cache ကို atomic ဖြစ်အောင် update လုပ်ဖို့ `requestMeta.onCacheEntryV2` ကို အသုံးပြုပါ။

5. **Graceful degradation (ချောမွေ့စွာ အဆင့်လျှော့ခြင်း) ကို ထောက်ပံ့ပါ။** Postponed state က မရနိုင်တော့တာ (သို့) သက်တမ်းကုန်နေတယ်ဆိုရင် — full server render ဆီ ပြန်ကျသွားပါစေ။ User က shell-first optimization မပါဘဲ — page အပြည့်အစုံကို ရရှိပါလိမ့်မယ်။

Adapter API ရည်ညွှန်းချက် အပြည့်အစုံနဲ့ အကောင်အထည်ဖော်မှု ဥပမာတွေအတွက် — [Deployment Adapter API](https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath) ကို ကြည့်ပါ။
