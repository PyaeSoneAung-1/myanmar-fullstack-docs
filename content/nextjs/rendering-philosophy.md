---
title: "Rendering Philosophy (Static နဲ့ Dynamic ကို Spectrum အဖြစ် သတ်မှတ်ပုံ)"
description: "Next.js ရဲ့ rendering philosophy — static နဲ့ dynamic ကို route အဆင့်မဟုတ်ဘဲ component အဆင့်မှာ spectrum (ဆက်တိုက်အနေအထားများ) တစ်ခုအနေနဲ့ သတ်မှတ်ခြင်း, PPR/Cache Components တွေ ဘာတွေ ဖြစ်နိုင်စေလဲ, trade-offs, infrastructure သက်ရောက်မှုများ, functional/performance fidelity နဲ့ CDN compatibility အကြောင်း"
order: 121
source: "https://nextjs.org/docs/app/guides/rendering-philosophy"
status: translated
updated: 2026-09-03
---

## Static နဲ့ Dynamic ကို Spectrum တစ်ခုအဖြစ် ရှုမြင်ခြင်း

Web framework အများစုက route အဆင့်မှာ static နဲ့ dynamic ကို သပ်သပ်ရပ်ရပ် ခြားထားပါတယ်။ Page တစ်ခုက build time မှာ ကြိုတင် render (prerender) လုပ်ထားတာ ဖြစ်ဖြစ်၊ request time မှာ server ကနေ render လုပ်တာ ဖြစ်ဖြစ်ပဲ။ ဒီ model က နားလည်ရလွယ်ပြီး deploy လုပ်ရလည်း လွယ်ပါတယ် — static files တွေကို CDN ပေါ် တင်ပြီး dynamic routes တွေကို server တစ်ခုဆီ ညွှန်လိုက်ရုံပါပဲ။

Next.js ကတော့ မတူညီတဲ့ ချဉ်းကပ်ပုံတစ်ခု သုံးပါတယ်: **static နဲ့ dynamic ကြားက နယ်နိမိတ်က route အဆင့်မှာ မဟုတ်ဘဲ component အဆင့်မှာ ရှိပါတယ်။** Page တစ်ခုတည်းမှာတင် — ချက်ချင်း load ဖြစ်တဲ့ static shell တစ်ခု၊ ပြီးတော့ ပြီးစီးသလောက် stream ဝင်လာတဲ့ dynamic sections တွေ ရှိနိုင်ပါတယ်။ Cached function တစ်ခုက dynamic route တစ်ခုထဲမှာ နေထိုင်နိုင်ပါတယ်။ Static page တစ်ခုကို redeploy မလုပ်ဘဲ update လုပ်နိုင်ပါတယ်။

ဒါတွေက Partial Prerendering, [Cache Components](/docs/nextjs/caching) (`use cache`) နဲ့ [on-demand revalidation](/docs/nextjs/revalidate-tag) တို့ ပေးစွမ်းနိုင်တဲ့ အရာတွေပါ။ ဒါတွေက သီးခြား incremental features တွေ မဟုတ်ပါဘူး — static နဲ့ dynamic ကို ရွေးချယ်စရာ နှစ်မျိုးထဲက တစ်ခု (binary choice) အနေနဲ့ မဟုတ်ဘဲ spectrum (ဆက်တိုက် ဖြစ်နိုင်တဲ့ အနေအထားများ) တစ်ခုအနေနဲ့ သဘောထားတဲ့ rendering model တစ်ခုကို ဒါတွေက ကိုယ်စားပြုပါတယ်။

## ဒါက ဘာတွေ ဖြစ်နိုင်စေလဲ (What This Enables)

ဒီ model က developer တွေရော user တွေကိုပါ လက်တွေ့ကျတဲ့ နည်းလမ်းတွေနဲ့ အကျိုးပြုပါတယ်:

- **ခံစားရတဲ့ load time ပိုမြန်ခြင်း (Faster perceived load times)။** Static shell က ချက်ချင်း render ဖြစ်ပြီး — dynamic content တွေ ဆက်တိုက် stream ဝင်လာပါတယ်။ User တွေက page တစ်ခုလုံး render ဖြစ်တာ စောင့်နေစရာ မလိုဘဲ အသုံးဝင်တဲ့ content တွေကို ချက်ချင်း မြင်ရပါတယ်။
- **Incremental caching (တဖြည်းဖြည်း ထည့်သွင်းနိုင်တဲ့ cache စနစ်)။** Developer တွေက route တစ်ခုက static လား dynamic လားဆိုတာကို build time မှာ ကြိုတင် မဆုံးဖြတ်ရဘဲ — caching နဲ့ revalidation တွေကို တဖြည်းဖြည်း ထည့်သွင်းနိုင်ပါတယ်။ Page ဘယ်ဟာမဆို on demand revalidate လုပ်လို့ရပြီး — function ဘယ်ဟာမဆို [`use cache`](/docs/nextjs/use-cache) နဲ့ cache လုပ်လို့ရပါတယ်။
- **Granular caching (အသေးစိတ်အဆင့် cache လုပ်ခြင်း)။** Route တစ်ခုကို မဟုတ်ဘဲ function တစ်ခုကို [`use cache`](/docs/nextjs/use-cache) နဲ့ cache လုပ်ပါ။ Deployment တစ်ခုကို မဟုတ်ဘဲ [tag](/docs/nextjs/revalidate-tag) တစ်ခုကို revalidate လုပ်ပါ။ ဆိုလိုတာက ဈေးကြီးတဲ့ database query တစ်ခုကို page ရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းတွေနဲ့ သီးခြား cache လုပ်ထားနိုင်ပါတယ်။

## Trade-Off (အပေးအယူ)

Web framework တွေက static နဲ့ dynamic content ကြားက နယ်နိမိတ်ကို ဘယ်နေရာမှာ ထားမလဲဆိုတာ ကွဲပြားပါတယ်။ ချဉ်းကပ်ပုံတစ်ခုစီက developer တွေအတွက် လွတ်လပ်မှု (flexibility) နဲ့ infrastructure ရှုပ်ထွေးမှုကြားမှာ မတူညီတဲ့ အပေးအယူတစ်ခုစီ လုပ်ပါတယ်။

### Build-time prerendering (Build time မှာ ကြိုတင် render လုပ်ခြင်း)

Page တိုင်းကို build time မှာ ထုတ်လုပ်ပါတယ်။ ရလာတဲ့ output က static files တွေဖြစ်ပြီး — runtime infrastructure လုံးဝ မလိုဘဲ CDN (သို့) file server ဘယ်ကနေမဆို ပေးဝေနိုင်ပါတယ်။ Dynamic content ရှိရင် page load ပြီးမှ client ဘက်က fetching (ပြန်ယူခြင်း) လုပ်ဖို့ လိုပါတယ်။ ဒါက deploy လုပ်ဖို့ အရိုးရှင်းဆုံး model ဖြစ်ပေမယ့် — content ပြောင်းလဲမှုတိုင်းအတွက် rebuild ရော redeploy ပါ လိုအပ်ပါတယ်။

### Route-level boundaries (Route အဆင့် နယ်နိမိတ်များ)

Route တစ်ခုစီက static လား dynamic လား ကိုယ်တိုင် ရွေးချယ်ပါတယ်။ Static routes တွေကို build time မှာ prerender လုပ်ပြီး — dynamic routes တွေကို request တစ်ခုစီအလိုက် server မှာ render လုပ်ပါတယ်။ Infrastructure က ရှင်းရှင်းလင်းလင်း ခွဲသွားပါတယ် — static files တွေက CDN ကို၊ dynamic routes တွေက server ကို ရောက်ပါတယ်။ ဒါက တွေးခေါ်ကြည့်ဖို့ ရိုးရှင်းပေမယ့် — route တစ်ခုအတွက် ရွေးချယ်မှုက အကုန်လုံး ဒါမှမဟုတ် ဘာမှမဟုတ် (all-or-nothing) ဖြစ်ပါတယ်။ Dynamic အစိတ်အပိုင်း တစ်ခုလောက်ပဲ ပါတဲ့ (user greeting လို၊ live price လိုမျိုး) အများစုအားဖြင့် static ဖြစ်တဲ့ page ဆိုရင် — လုံးဝ dynamic ဖြစ်ရမယ် ဒါမှမဟုတ် အဲဒီ အစိတ်အပိုင်းကို page load ပြီးမှ client ဘက်မှာ fetch လုပ်ရပါတယ်။

### Component-level boundaries (Component အဆင့် နယ်နိမိတ်များ)

ဒါက Next.js သုံးတဲ့ ချဉ်းကပ်ပုံပါ။ Static နဲ့ dynamic content တွေက streaming response တစ်ခုတည်းအတွင်းမှာ အတူယှဉ်တွဲ နေထိုင်ပါတယ်။ Page တစ်ခုမှာ — ချက်ချင်း load ဖြစ်တဲ့ static shell၊ သီးခြား revalidate ဖြစ်တဲ့ cached function နဲ့ ပြီးစီးသလောက် stream ဝင်လာတဲ့ dynamic section တစ်ခု ရှိနိုင်ပါတယ် — developer က သီးခြား routes တွေ (သို့) client-side fetches တွေအဖြစ် ဘာမှ ခွဲစရာ မလိုပါဘူး။

အပေးအယူကတော့ infrastructure ရှုပ်ထွေးမှုပါ။ ပိုနုနယ်တဲ့ (finer-grained) rendering နယ်နိမိတ်က ရှုပ်ထွေးမှုကို application code ထဲကနေ hosting platform ဆီ ရွှေ့ပြောင်းပေးပါတယ်။ အောက်မှာ ဖော်ပြထားတဲ့ infrastructure လိုအပ်ချက်တွေက ဒီရွေးချယ်မှုကြောင့်ပဲ ရှိနေတာပါ။

## Infrastructure အတွက် သက်ရောက်မှုများ (Infrastructure Implications)

Component-level rendering model က Next.js applications တွေကို host လုပ်တဲ့ platforms တွေအတွက် တိုက်ရိုက် သက်ရောက်မှုတွေ ရှိပါတယ်:

- **Streaming** — static နဲ့ dynamic content တွေကို response တစ်ခုတည်းနဲ့ ပို့ပေးရလို့ streaming က မဖြစ်မနေ လိုအပ်ပါတယ်။ Server က ကနဦး content ကို အရင်ပို့ပြီး — dynamic အပိုင်းတွေ ပြီးစီးသလောက် ဆက်ပြီး stream လုပ်ပေးပါတယ်။ အသေးစိတ်အတွက် [Streaming](/docs/nextjs/streaming) ကို ကြည့်ပါ။
- **Cache coordination** — instance အများအပြား run လုပ်တဲ့အခါ လိုအပ်ပါတယ် — ဘာလို့လဲဆိုတော့ cache လုပ်ထားတဲ့ content ဘယ်ဟာမဆို [`revalidateTag()`](/docs/nextjs/revalidate-tag) (သို့) [`revalidatePath()`](/docs/nextjs/revalidate-path) နဲ့ on demand invalidate လုပ်လို့ရလို့ပါ။ Architecture အကြောင်း [How Revalidation Works](/docs/nextjs/how-revalidation-works) မှာ ကြည့်ပါ။
- **Cache consistency** — revalidation က HTML response ရော RSC payload (client-side navigation အတွက် သုံးတဲ့ serialized React Server Components data) ရော နှစ်ခုလုံးကို ပြန်ထုတ်လုပ်လို့ အရေးကြီးပါတယ်။ ဒီနှစ်ခု ကိုက်ညီမှု မရှိတော့ရင် user တွေက navigation လုပ်နေစဉ်မှာ မကိုက်ညီတဲ့ data တွေ မြင်ရနိုင်ပါတယ်။ Consistency လိုအပ်ချက်တွေအတွက် [How Revalidation Works](/docs/nextjs/how-revalidation-works) ကို ကြည့်ပါ။
- **PPR shell ကို CDN latency နဲ့ ပို့ဆောင်ခြင်း** — static shell ကို သီးခြား သိမ်းဆည်းပြီး dynamic rendering ကို မှန်ကန်စွာ ပြန်လည် စတင်နိုင်ဖို့ နောက်ထပ် platform integration တွေ လိုအပ်နိုင်ပါတယ်။ အကောင်အထည်ဖော်ပုံ အသေးစိတ်အတွက် [PPR Platform Guide](https://nextjs.org/docs/app/guides/ppr-platform-guide) ကို ကြည့်ပါ။

ဒီ infrastructure လိုအပ်ချက် တစ်ခုစီက capability တစ်ခုစီနဲ့ တိုက်ရိုက် ဆက်စပ်နေပါတယ် — streaming က progressive delivery (တဖြည်းဖြည်း ပို့ဆောင်ခြင်း) ကို ဖြစ်နိုင်စေပြီး, cache coordination က invalidations တွေကို instance တွေကြား ပျံ့နှံ့စေပါတယ်။ Cache consistency က HTML နဲ့ RSC ကို လိုက်လျောညီထွေ ဖြစ်စေပြီး — edge မှာ PPR လုပ်တာက shell/resume integration အပိုတွေ မကြာခဏ လိုအပ်ပါတယ်။

## Portability နဲ့ Fidelity (ရွှေ့ပြောင်းသုံးနိုင်မှုနဲ့ ပြည့်စုံမှု)

Next.js က Node.js server process တစ်ခုအနေနဲ့ run လုပ်ပြီး — process တစ်ခုတည်းက feature တိုင်းကို မှန်ကန်စွာ ကိုင်တွယ်နိုင်ပါတယ်။ Streaming support က Server Components နဲ့ PPR တွေကို တဖြည်းဖြည်း (progressively) ပို့ဆောင်နိုင်စေပါတယ် — အဲဒါ မရှိရင် responses တွေကို buffer လုပ်ပြီး ပို့ပေမယ့် features တွေက ဆက်ပြီး အလုပ်လုပ်နေပါတယ်။ နောက်ထပ် infrastructure ရင်းနှီးမြှုပ်နှံမှုတွေ (CDN caching, edge compute, shared cache) က performance ကို တိုးတက်စေပြီး — multi-instance deployments တွေမှာ consistency ကွာဟချက်တွေကို လျှော့ချပေးပါတယ်။

ဒါကို ပိုပြီး လက်တွေ့ကျအောင် platform support အမျိုးအစား နှစ်မျိုးကို ခွဲခြားကြည့်ပါမယ်:

**Functional fidelity (လုပ်ဆောင်ချက် ပြည့်စုံမှု)** ဆိုတာ Next.js feature တိုင်း platform ပေါ်မှာ မှန်ကန်စွာ အလုပ်လုပ်တာကို ဆိုလိုပါတယ်။ [Adapter test suite](https://nextjs.org/docs/app/api-reference/adapters/testing-adapters) က စာချုပ် (contract) သဘောပါ — platform တစ်ခုရဲ့ adapter က စမ်းသပ်မှုတွေ အောင်ရင် အဲဒီ platform မှာ functional fidelity အပြည့်အစုံ ရှိတယ်လို့ ဆိုပါတယ်။ ဒါက binary ဖြစ်ပါတယ် — အောင်တယ် ဒါမှမဟုတ် မအောင်ဘူးပဲ။ ဒီ test suite က တရားမျှတပြီး ပြည့်စုံကြောင်း သေချာစေဖို့ platform partners တွေရဲ့ ပံ့ပိုးမှုတွေကို လက်ခံပါတယ်။

**Performance fidelity (စွမ်းဆောင်ရည် ပြည့်စုံမှု)** ဆိုတာ features တွေက သူတို့ရဲ့ အကောင်းဆုံး performance အခြေအနေတွေ ရရှိတာကို ဆိုလိုပါတယ်။ ဥပမာ — PPR ရဲ့ static shell ကို origin latency မဟုတ်ဘဲ CDN latency နဲ့ ပေးဝေနိုင်တာ၊ ဒါမှမဟုတ် ISR က stale content ကို ချက်ချင်း ပေးပြီး နောက်ခံမှာ sub-second propagation နဲ့ revalidate လုပ်တာမျိုးတွေပါ။ Performance fidelity က spectrum တစ်ခုပါ — platform တစ်ခုစီက သူ့ရဲ့ architecture အလိုက် မတူညီတဲ့ အဆင့်တွေ ရောက်ရှိပြီး platform တွေက အချိန်ကြာလာတာနဲ့အမျှ တိုးတက်လာပါလိမ့်မယ်။

Functional fidelity ရရှိတဲ့ platform က Next.js အတွက် အပြည့်အဝ ထောက်ပံ့တဲ့ deployment target တစ်ခုပါ။ Performance fidelity ကတော့ platforms တွေ အချင်းချင်း ကွဲပြားပေါ်လွင်တဲ့ နေရာပါ။ Feature compatibility matrix အပြည့်အစုံအတွက် [Deploying to Platforms](/docs/nextjs/deploying-to-platforms) ကို ကြည့်ပါ။

## CDN Feature Compatibility (CDN Feature လိုက်ဖက်ညီမှု)

CDN အများအပြားမှာ ပိုနက်ရှိုင်းတဲ့ Next.js integration အတွက် အသုံးဝင်တဲ့ primitives တွေ (edge compute, key-value storage, blob storage) ရှိပြီးသားပေမယ့် — end-to-end PPR resume support ကတော့ ပေါ်ထွက်စ အဆင့်မှာ ရှိပြီး platform အလိုက် သီးသန့် လုပ်ဆောင်မှုတွေ လိုအပ်နိုင်ပါတယ်။ ဒီနေ့ ရှိနေတဲ့ community adapters အများစုက Next.js ကို Node.js server အဖြစ် deploy လုပ်ပြီး — ဒီ CDN-specific primitives တွေကို အသုံးမချပါဘူး။ Adapters ရဲ့ လက်ရှိ စာရင်းအတွက် [Deploying](/docs/nextjs/deploying) page ကို ကြည့်ပါ။

CDN compatibility table အပြည့်အစုံအတွက် [Deploying to Platforms](/docs/nextjs/deploying-to-platforms) ကိုလည်းကောင်း၊ caching အပြုအမူ အသေးစိတ်အတွက် [CDN Caching](/docs/nextjs/cdn-caching) ကိုလည်းကောင်း ကြည့်ပါ။
