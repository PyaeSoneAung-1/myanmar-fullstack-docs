---
title: "How Revalidation Works (Revalidation ဘယ်လို အလုပ်လုပ်သလဲ)"
description: "Next.js မှာ cached content တွေကို ဘယ်လို revalidate လုပ်လဲ ဆိုတဲ့ နက်ရှိုင်းသော ရှင်းလင်းချက် — time-based (stale-while-revalidate) နဲ့ on-demand revalidation, HTML/RSC payload နှစ်ခုလုံး ပြန်ထုတ်လုပ်ပုံ, cache consistency, explicit/soft tag system (_N_T_), multi-instance coordination (updateTags/refreshTags), graceful degradation — custom cache handlers ရေးသားသူတွေနဲ့ platform engineers များအတွက်"
order: 125
source: "https://nextjs.org/docs/app/guides/how-revalidation-works"
status: translated
updated: 2026-09-03
---

[Caching](/docs/nextjs/caching) page မှာ `use cache`, `cacheTag` နဲ့ `cacheLife` တွေကို ဘယ်လို သုံးရမလဲ ဖော်ပြထားပါတယ်။ ဒီ page ကတော့ **revalidation က အတွင်းပိုင်းမှာ ဘယ်လို အလုပ်လုပ်လဲ** ဆိုတာကို ရှင်းပြပါတယ် — [custom cache handlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) တွေ အကောင်အထည်ဖော်ဖို့ (သို့) revalidation အပြုအမူတွေကို debug လုပ်ဖို့ စနစ်ကို နားလည်ထားရန် လိုအပ်တဲ့ platform engineers တွေနဲ့ အဆင့်မြင့် (advanced) users တွေအတွက်ပါ။

## Revalidation Model (Revalidation ပုံစံ)

Next.js ထဲက routes အများစုကို on demand revalidate လုပ်နိုင်ပါတယ်။ App Router routes တွေရော — ISR/prerender cache entries တွေ ထုတ်လုပ်တဲ့ Pages Router routes တွေပါ အပါအဝင်ပါ။ အလိုအလျောက် statically optimized ဖြစ်တဲ့ Pages Router routes တွေ (pure static output) ကတော့ on demand revalidate မလုပ်ပါဘူး။ Redeploy မလုပ်ဘဲ cached content တွေကို update လုပ်နိုင်တဲ့ စွမ်းရည်က Next.js ရဲ့ [rendering model](/docs/nextjs/rendering-philosophy) ရဲ့ အဓိက အစိတ်အပိုင်းတစ်ခုပါ။

Revalidation အမျိုးအစား နှစ်မျိုး ရှိပါတယ်:

- **Time-based revalidation** က stale-while-revalidate pattern ကို သုံးပါတယ်။ Cache လုပ်ထားတဲ့ content ကို ချက်ချင်း ပေးဝေပြီး — content ရဲ့ သက်တမ်းက [`cacheLife`](/docs/nextjs/cache-life) (သို့) `revalidate` ကြာချိန်ကို ကျော်လွန်သွားတာနဲ့ နောက်ခံမှာ regeneration တစ်ခု စတင်ပါတယ်။ Fresh content အသင့်မဖြစ်မချင်း stale content ကို ဆက်ပေးနေပါတယ်။
- **On-demand revalidation** က [`revalidateTag()`](/docs/nextjs/revalidate-tag) (သို့) [`revalidatePath()`](/docs/nextjs/revalidate-path) တွေကို ခေါ်ပြီး cache လုပ်ထားတဲ့ content တွေကို တိကျစွာ invalidate လုပ်ပါတယ်။ အဲဒီ content ဆီ နောက်ထပ် request တစ်ခု ရောက်လာရင် fresh render တစ်ခု စတင်ပါတယ်။

> **သိထားသင့်သည်:** Pages Router ရဲ့ on-demand ISR APIs (ဥပမာ `res.revalidate()` နဲ့ `x-prerender-revalidate` flow) တွေကို ဆက်လက် ထောက်ပံ့ပြီး — server cache handler (`cacheHandler` — singular) ကို သုံးပါတယ်။ `cacheHandlers` option (plural) ကတော့ `'use cache'` directives တွေအတွက်ပါ။

## ဘာတွေကို Revalidate လုပ်သလဲ (What Gets Revalidated)

Route တစ်ခုကို revalidate လုပ်တဲ့အခါ Next.js က တူညီတဲ့ React component tree ကနေ — HTML response ရော RSC payload (React Server Components payload) ပါ **နှစ်ခုလုံးကို** ပြန်လည် ထုတ်လုပ်ပါတယ်။ Artifacts နှစ်ခုလုံးကို cache entry တစ်ခုတည်းထဲမှာ အတူတကွ သိမ်းဆည်းပါတယ်။

ဒီ consistency က အရေးကြီးပါတယ် — ဘာလို့လဲဆိုတော့ RSC payload ကို client-side navigations တွေမှာ သုံးလို့ပါ။ Browser navigations ရော client-side navigations ပါ တူညီတဲ့ content တွေကို ကိုင်ဆောင်ထားသင့်ပါတယ်။

### Sync မကိုက်တော့ရင် ဘာဖြစ်မလဲ (What Happens If They Get Out of Sync)

Platform တစ်ခုရဲ့ cache က HTML ကို render တစ်ခုကနေ၊ RSC payload ကို မတူညီတဲ့ render တစ်ခုကနေ ပေးဝေနေရင် — user တွေက client-side navigation အတွင်းမှာ stale (သို့) မကိုက်ညီတဲ့ content တွေ မြင်ရနိုင်ပါတယ်။ အဓိက လျော့ပါးစေတဲ့ နည်းကတော့ — HTML နဲ့ RSC responses တွေကို တူညီတဲ့ TTL နဲ့ invalidation policy နဲ့အတူ အတူတကွ cache လုပ်ပြီး — Next.js က သတ်မှတ်ထားတဲ့ [`Vary` header](/docs/nextjs/cdn-caching) ကို လိုက်နာဖို့ပါ။ အသေးစိတ်အတွက် [CDN Caching](/docs/nextjs/cdn-caching) ကို ကြည့်ပါ။

သီးခြားပေမယ့် ဆက်စပ်နေတဲ့ ပြဿနာတစ်ခုကတော့ **cross-deployment skew** ပါ — rolling deployments တွေအတွင်း deploy A နဲ့ တည်ဆောက်ထားတဲ့ client တစ်ခုက deploy B ပေါ်မှာ run နေတဲ့ server တစ်ခုဆီက responses တွေ လက်ခံရရှိနိုင်ပါတယ်။ [`deploymentId`](https://nextjs.org/docs/app/api-reference/config/next-config-js/deploymentId) က ဒါကို လျော့ပါးစေပါတယ် — client က server နဲ့ မတူညီတဲ့ deployment ID တစ်ခုကို တွေ့ရှိရင် — consistent content တွေ ရယူဖို့ hard navigation တစ်ခုကို စတင်ပါတယ်။

## Tag System Architecture (Tag စနစ်၏ တည်ဆောက်ပုံ)

Next.js က ဘယ် cached content တွေကို invalidate လုပ်ဖို့ လိုအပ်လဲ ခြေရာခံဖို့ tag-based စနစ်တစ်ခုကို သုံးပါတယ်။ Tag အမျိုးအစား နှစ်မျိုး ရှိပါတယ်:

### Explicit tags (ရှင်းလင်းစွာ သတ်မှတ်ထားသော Tags)

Explicit tags တွေကို developer က `use cache` function တစ်ခုအတွင်းမှာ [`cacheTag()`](/docs/nextjs/cache-tag) သုံးပြီး (သို့) `fetch` call တစ်ခုပေါ်မှာ `next: { tags: [...] }` ကနေတစ်ဆင့် သတ်မှတ်ပါတယ်။ [`revalidateTag('my-tag', 'max')`](/docs/nextjs/revalidate-tag) ကို ခေါ်လိုက်တဲ့အခါ — အဲဒီ tag ပါဝင်တဲ့ cache entries အားလုံး invalidate ဖြစ်ပါတယ်။

### Soft tags (အလိုအလျောက် ထုတ်ပေးသော Tags)

Soft tags တွေကို Next.js က route path အပေါ် မူတည်ပြီး အလိုအလျောက် ထုတ်ပေးပါတယ် — `_N_T_` နဲ့ ရှေ့ဆက်ထားပါတယ်။ ဥပမာ — `/blog/hello` route က `_N_T_/layout`, `_N_T_/blog/layout`, `_N_T_/blog/hello/layout` နဲ့ `_N_T_/blog/hello` လို soft tags တွေကို ထုတ်ပေးပါတယ်။ Path ထဲက segment တစ်ခုစီအတွက် layout tag တစ်ခုစီ ရရှိပြီး — leaf route ကိုယ်တိုင်ကလည်း ပါဝင်ပါတယ်။

Soft tags တွေက [`revalidatePath()`](/docs/nextjs/revalidate-path) ကို တူညီတဲ့ tag-based စနစ်ကနေတစ်ဆင့် အလုပ်လုပ်နိုင်စေပါတယ်။ `revalidatePath('/blog/hello')` ကို ခေါ်လိုက်တဲ့အခါ — အဲဒီ path ရဲ့ leaf route tag နဲ့ ၎င်းရဲ့ ရှေ့ဆက်ဘိုးဘေး (ancestor) layout soft tags တွေနဲ့ ဆက်စပ်နေတဲ့ cache entries တွေကို invalidate လုပ်ပါတယ် (ဥပမာ `_N_T_/layout`, `_N_T_/blog/layout`, `_N_T_/blog/hello/layout` နဲ့ `_N_T_/blog/hello`)။

[cache handler API](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) ထဲမှာ soft tags တွေကို `get()` method ဆီ `softTags` parameter အနေနဲ့ ပေးပို့ပါတယ်။ သင့် handler က cache entry ရဲ့ timestamp နောက်မှာ soft tag တစ်ခုခု invalidate ဖြစ်ခဲ့လားဆိုတာ စစ်ဆေးသင့်ပါတယ်။ `getExpiration()` method က ပေးထားတဲ့ tags အားလုံးထဲက နောက်ဆုံး revalidation timestamp ကို ပြန်ပေးပြီး — ဘယ်ဟာမှ revalidate မဖြစ်ခဲ့ရင် `0` ကို ပြန်ပေးပါတယ်။ Soft tags တွေကို `get()` ဆီ ပို့ပြီး အဲဒီမှာ expiration စစ်ဆေးသင့်ကြောင်း အချက်ပြဖို့ `Infinity` ကိုလည်း ပြန်ပေးနိုင်ပါတယ်။ ပြန်ပေးလာတဲ့ timestamp က entry ရဲ့ ကိုယ်ပိုင် timestamp ထက် ပိုသစ်နေရင် — entry ကို stale အဖြစ် သဘောထားသင့်ပါတယ်။ Semantics အပြည့်အစုံအတွက် [cache handler API reference](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers#getexpiration) ကို ကြည့်ပါ။

## Multi-Instance ထည့်သွင်းစဉ်းစားစရာများ (Multi-Instance Considerations)

Load balancer တစ်ခုရဲ့ နောက်မှာ Next.js instance အများအပြား run လုပ်နေတဲ့အခါ — revalidation events တွေက default အားဖြင့် local သက်သက်ပါ။ Instance A ပေါ်မှာ `revalidateTag()` ခေါ်လိုက်ရင် အဲဒီ instance ရဲ့ cache ကိုပဲ invalidate လုပ်ပါတယ်။ တခြား instances တွေက invalidation အကြောင်း မသိရှိမချင်း stale content တွေကို ဆက်ပေးဝေနေပါတယ်။

Cache handler API က distributed coordination (ဖြန့်ကျက် ချိန်ညှိမှု) အတွက် hooks နှစ်ခု ပေးထားပါတယ်:

- **`updateTags()`** — `revalidateTag()` ကို ခေါ်လိုက်တဲ့အခါ ဒါကို ခေါ်ပါတယ်။ သင့် handler က invalidation event ကို shared storage (ဥပမာ Redis (သို့) database) ထဲ ရေးသိမ်းသင့်ပြီး — တခြား instances တွေ ရှာဖွေ တွေ့ရှိနိုင်စေပါတယ်။
- **`refreshTags()`** — အချိန်အခါအလိုက် ခေါ်ပေမယ့် request အသစ်တစ်ခု စတင်ခါနီးမှာ အမြဲ ခေါ်ပါတယ်။ သင့် handler က shared storage ထဲမှာ မကြာသေးတဲ့ invalidation events တွေ ရှိမရှိ စစ်ဆေးပြီး — သူ့ရဲ့ local tag state ကို အဲဒီအတိုင်း update လုပ်သင့်ပါတယ်။

အကောင်အထည်ဖော်ပုံ အသေးစိတ်နဲ့ Redis ဥပမာတစ်ခုအတွက် [Custom Cache Handlers](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheHandlers) ကို ကြည့်ပါ။

## Platforms အတွက် အကောင်အထည်ဖော်မှု ပုံစံများ (Implementation Patterns for Platforms)

### Single instance (Instance တစ်ခုတည်း)

Default file-system cache က consistency ကို အလိုအလျောက် ကိုင်တွယ်ပါတယ်။ Local filesystem ပေါ်မှာ cache writes တွေက atomic ဖြစ်ပြီး — tag state ကို memory ထဲမှာ ထိန်းသိမ်းပါတယ်။ နောက်ထပ် configuration မလိုအပ်ပါဘူး။

### Shared cache ဖြင့် Multi-instance (Multi-Instance with Shared Cache)

ချိန်ညှိမှု မရှိရင် instance တစ်ခုစီက သူ့ရဲ့ local cache ကိုပဲ သုံးပြီး content တွေကို သီးခြား ပေးဝေကာ revalidation တွေကို ကိုင်တွယ်ပါတယ်။ ဘယ် instance က request ကို ဖြေကြားလဲဆိုတာပေါ် မူတည်ပြီး user တွေ မတူညီတဲ့ content တွေ မြင်ရနိုင်ပြီး — on-demand revalidation က call ကို လက်ခံရရှိတဲ့ instance ပေါ်မှာပဲ အကျိုးသက်ရောက်ပါတယ်။

ဒီအချိန်ကွာဟချက် (window) ကို လျှော့ချပြီး revalidation တွေ instance တွေကြား ပျံ့နှံ့ဖို့:

1. Tag invalidation timestamps တွေကို shared service တစ်ခုထဲ (Redis, DynamoDB, (သို့) ရိုးရှင်းတဲ့ HTTP API) သိမ်းဆည်းပါ။
2. Shared service ဆီ ရေးသိမ်းဖို့ `updateTags()` ကို အကောင်အထည်ဖော်ပါ။
3. Shared service ကနေ ဖတ်ယူဖို့ `refreshTags()` ကို အကောင်အထည်ဖော်ပါ။ သင့် handler က `refreshTags()` ထဲမှာ errors တွေကို ဖမ်းယူရပါမယ် — ဒါက throw ဖြစ်ရင် exception က request failure အဖြစ် ပျံ့နှံ့သွားလို့ပါ။ Error ကို ဖမ်းထားရင် requests တွေက နောက်ဆုံး သိထားတဲ့ local tag state နဲ့ ဆက်လုပ်သွားပြီး — ချိတ်ဆက်မှု ပြန်လည် ရရှိလာတဲ့အထိ ဖြစ်နိုင်ချေရှိတဲ့ stale content တွေကို ဆက်ပေးဝေနိုင်ပါတယ်။
4. Cache entries တွေ (HTML + RSC payload) ကို shared storage ထဲမှာ သိမ်းဆည်းပါ။ Atomic writes တွေက mismatch window ကို ပိုမို လျှော့ချပေးပေမယ့် — မှန်ကန်မှုအတွက်တော့ မလိုအပ်ပါဘူး။

### CDN integration (CDN ပေါင်းစပ်မှု)

CDN တစ်ခုက Next.js responses တွေကို cache လုပ်မယ်ဆိုရင် — Next.js က သတ်မှတ်ထားတဲ့ `Vary` header နဲ့ `Cache-Control` directives တွေကို လိုက်နာသင့်ပါတယ်။ HTML နဲ့ RSC payload responses တွေကို မတူညီတဲ့ TTLs တွေနဲ့ သီးခြားစီ cache မလုပ်ပါနဲ့။ အသေးစိတ်အတွက် [CDN Caching](/docs/nextjs/cdn-caching) ကို ကြည့်ပါ။

## Graceful Degradation (ချောမွေ့စွာ စွမ်းဆောင်ရည် ကျဆင်းခြင်း)

Revalidation စနစ်က တင်းကျပ်တဲ့ consistency ထက် availability (ရရှိနိုင်မှု) ကို ဦးစားပေးပါတယ်။ Infrastructure ရဲ့ အာမခံချက်တွေ အပြည့်အဝ မပြည့်မီတော့တဲ့အခါမှာတောင် content တွေကို အမြဲ ပေးဝေပါတယ်:

- **Cache write failure (ရေးသိမ်းမှု မအောင်မြင်ခြင်း)** — writes တွေက asynchronous ဖြစ်လို့ response ကို user ဆီ ဆက်ပေးဝေနေပါတယ်။ Cache entry က ဆုံးရှုံးသွားပြီး — နောက်ထပ် request တစ်ခုက fresh render တစ်ခုကို စတင်ပါတယ်။
- **Cache read failure (ဖတ်ယူမှု မအောင်မြင်ခြင်း)** — သင့် handler က internal errors တွေကို ဖမ်းပြီး `undefined` (cache miss အချက်ပြ) ကို ပြန်ပေးသင့်ပါတယ်။ အဲဒါဆိုရင် route ကို fresh အနေနဲ့ server-render လုပ်ပါတယ်။ Throw ဖြစ်တဲ့ error ကို cache miss အဖြစ် သတ်မှတ်မပေးပါဘူး — ဒါက render error အဖြစ် ပျံ့နှံ့သွားလို့ — miss ဖြစ်ကြောင်း အချက်ပြဖို့ `undefined` ကို အမြဲ ပြန်ပေးပါ။
- **HTML/RSC cache inconsistency (HTML/RSC cache မကိုက်ညီမှု)** — CDN တစ်ခုက HTML နဲ့ RSC responses တွေကို မတူညီတဲ့ TTLs (သို့) invalidation အချိန်အခါတွေနဲ့ cache လုပ်ရင် — user တွေက client-side navigation အတွင်းမှာ မကိုက်ညီတဲ့ content တွေ မြင်ရနိုင်ပါတယ်။ ဒါမဖြစ်အောင် သူတို့ကို အတူတကွ cache လုပ်ပြီး `Vary` header ကို လိုက်နာပါ။
- **Cross-deployment skew** — rolling deployments တွေအတွင်း build ID ပြောင်းလဲမှုတစ်ခုက consistent content တွေ ရယူဖို့ hard navigation တစ်ခုကို စတင်နိုင်အောင် [`deploymentId`](https://nextjs.org/docs/app/api-reference/config/next-config-js/deploymentId) ကို configure လုပ်ပါ။

Cache failures တွေက စွမ်းဆောင်ရည် ကျဆင်းမှု (stale content တွေ၊ render အပိုတွေ) ကိုပဲ ဖြစ်စေပြီး — application တွေ ပျက်စီးစေတာ မဟုတ်ပါဘူး။
