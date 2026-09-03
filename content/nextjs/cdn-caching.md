---
title: "CDN Caching (CDN Cache အသုံးပြုခြင်း)"
description: "Next.js နဲ့ CDN caching — route ရဲ့ rendering strategy အလိုက် Cache-Control headers တွေ (static, ISR, dynamic), static assets နဲ့ PPR-enabled static prefetches, rsc/next-router-state-tree စတဲ့ custom headers တွေကြောင့် CDN caching စိန်ခေါ်မှုတွေနဲ့ Vary, _rsc cache key, pathname-based cache keying ဆီ ဦးတည်ချက်"
order: 124
source: "https://nextjs.org/docs/app/guides/cdn-caching"
status: translated
updated: 2026-09-03
---

Next.js က CDNs တွေ response တွေကို edge မှာ cache လုပ်ဖို့ သုံးနိုင်တဲ့ standard `Cache-Control` headers တွေကို သတ်မှတ်ပေးပါတယ်။ ဒီ page က လက်ရှိ ဘာတွေ အလုပ်လုပ်လဲ၊ CDN caching က ဘယ်နေရာတွေမှာ စိန်ခေါ်မှု ရှိလဲ၊ ပြီးတော့ custom-header dependencies တွေကို ဖယ်ရှားဖို့ ဦးတည်ချက်အကြောင်း ဖော်ပြပါတယ်။

## လက်ရှိ အလုပ်လုပ်နေသော အရာများ (What Works Today)

### Cache-Control headers (Cache-Control ခေါင်းစီးများ)

Next.js က `Cache-Control` headers တွေကို route တစ်ခုစီရဲ့ rendering strategy အပေါ် မူတည်ပြီး သတ်မှတ်ပါတယ်:

- **Static pages** (revalidation မရှိ): `s-maxage=31536000` (တစ်နှစ်)
- **ISR pages** (time-based revalidation): `s-maxage={revalidate}, stale-while-revalidate={expire - revalidate}`။ Default `expire` က တစ်နှစ်ဖြစ်လို့ — `stale-while-revalidate` ကို response header ထဲမှာ default အားဖြင့် ထည့်သွင်းပေးပါတယ်။ ဒါကို [`cacheLife`](/docs/nextjs/cache-life) နဲ့ စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။
- **Dynamic pages** (caching မရှိ): `private, no-cache, no-store, max-age=0, must-revalidate`

`s-maxage` နဲ့ `stale-while-revalidate` တွေကို လေးစား လိုက်နာတဲ့ CDNs တွေက static နဲ့ ISR pages တွေကို edge မှာ cache လုပ်နိုင်ပါတယ်။ ဒါပေမယ့် CDN-level caching သက်သက်က on-demand revalidation ([`revalidateTag()`](/docs/nextjs/revalidate-tag) / [`revalidatePath()`](/docs/nextjs/revalidate-path)) ကို ထောက်ပံ့မပေးပါဘူး — အဲဒီ calls တွေက Next.js server cache ကို invalidate လုပ်ပေးပေမယ့် CDN ကတော့ `s-maxage` TTL ကုန်ဆုံးတဲ့အထိ သူ့ရဲ့ cached copy ကို ဆက်ပေးနေပါလိမ့်မယ်။ On-demand revalidation ကို CDN ဆီ ပျံ့နှံ့စေဖို့ သင့်ရဲ့ revalidation call နဲ့အတူ CDN purges တွေကို စတင်လုပ်ပါ။ အသုံးများတဲ့ pattern ကတော့ — Next.js server cache ကို invalidate လုပ်ဖို့ `revalidateTag()`/`revalidatePath()` ကို ခေါ်ပြီး — သက်ရောက်မှုရှိတဲ့ keys တွေ (HTML ရော RSC variants ပါ အပါအဝင်) အတွက် CDN purge API ကို ခေါ်တာပါ။

### Static assets (Static ပိုင်ဆိုင်မှုများ)

`/_next/static/` ကနေ ပေးဝေတဲ့ static assets တွေ (JavaScript, CSS, images, fonts) က သူတို့ရဲ့ filenames တွေထဲမှာ content hashes တွေ ပါဝင်ပြီး — တစ်နှစ် `max-age` နဲ့ `immutable` directive ပါပါတယ်: `public, max-age=31536000, immutable`

Static assets တွေကို မတူညီတဲ့ domain (သို့) CDN origin တစ်ခုကနေ ပေးဝေချင်ရင် [`assetPrefix`](/docs/nextjs/next-config-asset-prefix) ကို သုံးနိုင်ပါတယ်။

### Static prefetches (PPR-enabled routes များ)

Route တစ်ခုမှာ Partial Prerendering ဖွင့်ထားပြီး `next-router-prefetch` header ပါလာရင် (static prefetch ဖြစ်ကြောင်း ဖော်ပြတာ) — response က deterministic (ကြိုတင် သေချာသော) ဖြစ်ပါတယ် — client ရဲ့ router state ဘယ်လိုပဲ ရှိရှိ တူညီတဲ့ prerendered content ကို ပြန်ပေးပါတယ်။ ဒီ requests တွေအတွက် `next-router-state-tree` header ကို parse မလုပ်တော့ဘဲ — response ကို သက်ရောက်မှု မရှိပါဘူး။

PPR-enabled routes တွေအတွက် CDN တစ်ခုက အောက်ပါအချက်တွေ ပြည့်မီရင် static prefetch responses တွေကို cache လုပ်နိုင်ပါတယ်:

1. Cache key ထဲမှာ `_rsc` search parameter ကို ထည့်သွင်းခြင်း (prefetch variants တွေကို HTML responses တွေကနေ ခွဲခြားဖို့)။
2. Next.js က response ပေါ်မှာ သတ်မှတ်ထားတဲ့ `Cache-Control` headers တွေကို လိုက်နာခြင်း။

> **သိထားသင့်သည်:** PPR မရှိတဲ့ routes တွေအတွက် — prefetch requests တွေမှာ ဘယ် segments တွေ ထည့်သွင်းမလဲ ဆုံးဖြတ်ဖို့ `next-router-state-tree` header ကို ဖတ်ပြီး — ဒါက လက်ရှိ router state ကို သယ်ဆောင်ပေးတာမို့ cache ရဲ့ `vary` ကို များပြားစေပါတယ်။ Cache Components ဖွင့်ထားတဲ့အခါ segment-level prefetches တွေက pathname-based routes (ဥပမာ `/page.segments/_tree.segment.rsc`) တွေကို သုံးနှင့်ပြီးသား ဖြစ်လို့ — CDNs တွေက ဒါတွေကို standard pathname-based cache keys တွေနဲ့ cache လုပ်နိုင်ပါတယ်။

## CDN Caching စိန်ခေါ်မှုများ ရှိရာနေရာများ (Where CDN Caching Is Challenging)

App Router responses တွေက custom request headers အများအပြားပေါ် မူတည်ပြီး ကွဲပြားနိုင်ပါတယ်။ Next.js က ဒါကို CDNs တွေကို အချက်ပြဖို့ responses တွေပေါ်မှာ `Vary` header တစ်ခု သတ်မှတ်ပေးပါတယ်:

- `rsc` — request က HTML အစား React Server Components (RSC) payload ကို ပြန်ပေးသင့်သလား
- `next-router-state-tree` — client ရဲ့ လက်ရှိ router state — dynamic navigations တွေအတွင်း ပစ်မှတ်ထားတဲ့ segment updates တွေအတွက် သုံးသည်
- `next-router-prefetch` — ဒါ prefetch request ဟုတ်မဟုတ်
- `next-router-segment-prefetch` — prefetch လုပ်နေတဲ့ တိကျတဲ့ segment
- `next-url` — [interception routes](/docs/nextjs/intercepting-routes) သုံးတဲ့ routes တွေအတွက်ပဲ ထည့်သွင်းပြီး — intercept လုပ်ခံထားရတဲ့ URL ကို သယ်ဆောင်သည်

> **သိထားသင့်သည်:** [`proxy.js`](/docs/nextjs/file-conventions-proxy) (ယခင် Middleware) က CDN cache ရဲ့ ရှေ့မှာ run သင့်ပါတယ် — auth, redirects နဲ့ rewrites တွေအတွက် စစ်မှန်တဲ့ အရင်းအမြစ် (source of truth) အဖြစ် ဆက်ရှိနေဖို့ပါ။ သင့်ရဲ့ deployment က `proxy.js` ကို CDN ရဲ့ နောက်မှာ ထားရင် — `proxy.js` ရဲ့ ဆုံးဖြတ်ချက်တွေပေါ် မူတည်တဲ့ routes တွေအတွက် caching ကို ကျော်လွှားနိုင်အောင် (bypass) cache layer ကို configure လုပ်ပါ။

CDN အများအပြားက နောက်ထပ် configuration မရှိဘဲ `Vary` ကို ထောက်ပံ့မပေးပါဘူး။ Next.js က ဒါကို `_rsc` search parameter နဲ့ ဖြေရှင်းပါတယ် — ဒါက ဆက်စပ်နေတဲ့ request header values တွေရဲ့ hash တစ်ခုဖြစ်ပြီး cache-key အနေနဲ့ လုပ်ဆောင်ကာ — response variants တစ်ခုစီကို မတူညီတဲ့ cache keys တွေ ရရှိစေပါတယ်။ ဒါက `Vary` ကို လျစ်လျူရှုတဲ့ CDNs တွေမှာတောင် မှန်ကန်တဲ့ responses တွေ ရရှိစေပါတယ်။

## CDN မှာ Headers များ ကိုင်တွယ်ခြင်း (Handling Headers at the CDN)

### လုံခြုံစွာ လျစ်လျူရှုနိုင်သော အရာများ (What You Can Safely Ignore)

ဒီ headers တွေကို တိကျတဲ့ အခြေအနေတွေမှာ protocol errors တွေ မဖြစ်စေဘဲ ချန်လှပ်ထားနိုင်ပါတယ်။ Server က parse လုပ်လို့ရတဲ့ response တစ်ခုကို ဆက်ပြန်ပေးဦးမှာပါ — ဒါပေမယ့် response က ပိုကြီးနိုင်သလို၊ တိကျတဲ့ navigation အတွက် ပစ်မှတ်ထားမှု နည်းနိုင်ပါတယ်:

**`next-router-state-tree`** — non-prefetch RSC requests တွေမှာ ချန်လှပ်ထားရင် server က targeted segment update အစား full payload တစ်ခုကို ပြန်ပေးပါတယ်။

**`next-router-segment-prefetch`** — prefetch requests တွေမှာ ချန်လှပ်ထားရင် server က segment-specific payload အစား ပိုကျယ်ပြန့်တဲ့ prefetch payload တစ်ခုဆီ ပြန်ကျပါတယ်။

**`next-url`** — [interception routes](/docs/nextjs/intercepting-routes) တွေမှာ referring page အပေါ် မူတည်ပြီး response ကွဲပြားစေဖို့ သုံးပါတယ်။ ဒါကို ချန်လှပ်ထားရင် interception routes တွေ ထောက်ပံ့မှု မရှိတော့ပါဘူး — server က ဘယ်မူရင်း path နဲ့ ကိုက်ညီအောင် ယှဉ်ရမလဲ မသိတော့လို့ပါ။ `next-url` ချန်လှပ်ထားတဲ့အခါ ပြန်ပေးတဲ့ response က ပုံမှန် navigation အတွက် ဖြစ်ပြီး — user က intercepted target page အစား ပုံမှန် target page ကို မြင်ရပါတယ်။

### မဖြစ်မနေ ထိန်းသိမ်းရမည့် အရာများ (What You Must Preserve)

**`rsc` header** ကို client ကနေ server ဆီ မဖြစ်မနေ ပို့ပေးရပါမယ်။ ဒီ header က server ကို HTML အစား RSC payload ပြန်ပို့ဖို့ ပြောပါတယ်။ CDN တစ်ခုက ဒါကို ဖယ်ရှားလိုက်ရင် — client-side router က RSC data မျှော်လင့်နေချိန်မှာ server က HTML ပြန်ပို့တာမို့ client-side navigation တွေ ပျက်စီးပြီး — browser navigations တွေအဖြစ် ပြောင်းသွားစေပါတယ်။ `Vary` header နဲ့ `_rsc` parameter တွေက CDNs တွေ RSC request တစ်ခုကို cached HTML response နဲ့ ဖြေကြားတာ (ဒါမှမဟုတ် အပြန်အလှန်) မဖြစ်အောင် တားဆီးဖို့ပဲ သီးသန့် ရှိနေတာပါ။

**`next-router-prefetch` ပါနေရင် — prefetch header ရော `_rsc` search parameter ပါ နှစ်ခုလုံးကို ထိန်းသိမ်းပါ။** Prefetch flows တွေအတွက် `_rsc` က cache-busting (cache မှားယွင်းမသုံးမိစေရန်) discriminator တစ်ခုအနေနဲ့ လိုအပ်ပြီး — mandatory (မဖြစ်မနေ) အဖြစ် သဘောထားသင့်ပါတယ်။

**`_rsc` search parameter** ကို cache key ထဲမှာ မဖြစ်မနေ ထည့်သွင်းရပါမယ်။ ဒါက response variants တွေ (HTML vs. RSC, prefetch အမျိုးအစား အမျိုးမျိုး) ကို ခွဲခြားပေးပါတယ်။ သင့် CDN က cache keys တွေကနေ query parameters တွေကို ဖယ်ရှားမပစ်ဖို့ သေချာပါစေ — CDN အချို့က ဒါကို default အနေနဲ့ လုပ်တတ်လို့ပါ။ Default အားဖြင့် — မှန်ကန်တဲ့ `_rsc` တန်ဖိုး မပါတဲ့ RSC request တစ်ခု ရောက်လာရင် server က မှန်ကန်တဲ့ hash ပါတဲ့ URL ဆီ **307 redirect** နဲ့ ပြန်ဖြေပါတယ်။ ဒီအပြုအမူကို `experimental.validateRSCRequestHeaders` ကို `false` လို့ သတ်မှတ်ပြီး ပိတ်ထားနိုင်ပါတယ်။ CDNs တွေက ဒီ redirect ကို လိုက်နာသင့်ပါတယ်။ Hash ကို upstream မှာ တွက်ချက်နိုင်တဲ့ platforms တွေက — နောက်ထပ် round trip တစ်ခု မဖြစ်ရအောင် forward မလုပ်ခင် request တွေကို မှန်ကန်တဲ့ `_rsc` ပါဝင်အောင် rewrite လုပ်နိုင်ပါတယ်။

> **သိထားသင့်သည်:** လက်ရှိတွင် `next-url` က static prefetches တွေအတွင်းမှာတောင် `_rsc` hash ထဲမှာ ပါဝင်ပါတယ်။ ဆိုလိုတာက လက်ရှိ စနစ်အောက်မှာ ဒါကို လျစ်လျူရှုလိုက်ရင် — cache misses တွေ ဖြစ်နိုင်ခြေ ရှိလို့ လုံခြုံမှု မရှိပါဘူး။ အောက်မှာ ဖော်ပြထားတဲ့ pathname-based ဦးတည်ချက်က ဒီကွာဟချက်ကို ဖြေရှင်းပေးပါတယ်။

## ဦးတည်ချက်: Pathname-Based Cache Keying (Pathname အခြေခံ Cache Key သတ်မှတ်ခြင်း)

Next.js team က cache ကို သက်ရောက်မှုရှိတဲ့ inputs အားလုံးကို URL pathname ထဲကို ရွှေ့ပြောင်းဖို့ လုပ်ဆောင်နေပါတယ် — custom headers တွေပေါ်မှာ `Vary` လိုအပ်ချက်ကို ဖယ်ရှားပြီး `_rsc` search parameter ကိုပါ ဖျက်သိမ်းသွားမှာပါ။ ဒါက အထက်မှာ ဖော်ပြခဲ့တဲ့ CDN caching စိန်ခေါ်မှုတွေကို ဖြေရှင်းပေးပါတယ်။

### ဘယ်လို အလုပ်လုပ်သလဲ (How It Works)

ဒီချဉ်းကပ်ပုံက [`output: 'export'`](/docs/nextjs/static-exports) နဲ့ segment prefetches တွေ လက်ရှိ သုံးနှင့်ပြီးသား routing scheme ကို တိုးချဲ့ပါတယ်။ Pathname ထဲက file extensions တွေက response အမျိုးအစားကို ဖော်ပြပါတယ်:

- **Full page RSC** — `/my/page.rsc` က page တစ်ခုလုံးအတွက် RSC payload ကို ပြန်ပေးသည်
- **Segment RSC** — `/my/page.segments/path/to/segment.segment.rsc` က တိကျတဲ့ segment တစ်ခုအတွက် RSC payload ကို ပြန်ပေးသည်

ဒီ model အောက်မှာ:

- **Pathname က cache key ကို ဆုံးဖြတ်ပါတယ်။** Pathname ထဲမှာ ပါဝင်တဲ့အရာတိုင်းက ဘယ် response variant ပြန်ပေးမလဲဆိုတာကို သက်ရောက်ပါတယ်။
- **Search parameters တွေကို လုံခြုံစွာ ဖျက်ပစ်နိုင်ပါတယ်** — ပြန်ပေးတဲ့ responses တွေကို သက်ရောက်မှု မရှိဘဲ။
- **Standard HTTP cache headers** (`Cache-Control`, `max-age`, စသည်) တွေကို ပုံမှန်အတိုင်း လိုက်နာပါတယ်။
- **CDN ဆီက `Vary` support မလိုအပ်ပါဘူး။**

CDN တစ်ခုက pathname ကို cache key အဖြစ် သုံးပြီး — search parameters တွေကို လျစ်လျူရှုကာ standard `Cache-Control` headers တွေကို လိုက်နာရင်း Next.js responses တွေကို cache လုပ်နိုင်မှာပါ။ `Vary` ကို နားလည်စရာ၊ custom headers တွေကို စစ်ဆေးစရာ၊ edge logic တွေ program လုပ်စရာ မလိုပါဘူး။

### Interception Routes အတွက် ပြောင်းလဲမှုများ (What Changes for Interception Routes)

လက်ရှိ စနစ်အောက်မှာ `next-url` က `_rsc` hash ထဲကို ပံ့ပိုးတာမို့ ဒါကို ဖျက်လိုက်ရင် cache misses တွေ ဖြစ်စေပါတယ်။ Pathname-based စနစ်အောက်မှာတော့ interception ရဲ့ ကွဲပြားမှုကို search parameter ထဲမှာ (pathname မဟုတ်ဘဲ) encode လုပ်မှာပါ:

- CDN တစ်ခုက search params တွေကို ထိန်းသိမ်းနိုင်ရင် interception က မှန်ကန်စွာ အလုပ်လုပ်ပါတယ်။
- CDN တစ်ခုက search params တွေကို ဖျက်ပစ်ရင် interception ကို ထောက်ပံ့မှာ မဟုတ်ပါဘူး။ Non-intercepted page ဆီ ချောမွေ့စွာ degrade လုပ်သွားမှာ ဖြစ်ပြီး — client-side navigations တွေ ပျက်စီးမှာ မဟုတ်ပါဘူး။

ဒါက interception route support ကို မဖြစ်မနေ လိုအပ်ချက်တစ်ခု မဟုတ်ဘဲ — CDN ရဲ့ opt-in (ဆန္ဒအလျောက် ရွေးချယ်သုံးနိုင်သော) capability တစ်ခု ဖြစ်စေပါတယ်။

### လက်ရှိ အခြေအနေ (Current Status)

ဒီဦးတည်ချက်က codebase ထဲမှာ လုပ်ဆောင်နှင့်ပြီးသား patterns တွေ (segment prefetch paths, `output: 'export'` mode) ကို တိုးချဲ့တာပါ။ လက်ရှိမှာ active design (ဒီဇိုင်းချနေဆဲ) အဆင့်မှာ ရှိပါတယ်။

## CDN Feature Compatibility (CDN Feature လိုက်ဖက်ညီမှု)

CDN အဓိက တစ်ခုစီမှာ ရရှိနိုင်တဲ့ infrastructure primitives တွေ (edge compute, key-value storage, blob storage, PPR resuming) ပါဝင်တဲ့ ဇယား အပြည့်အစုံအတွက် [Deploying to Platforms](/docs/nextjs/deploying-to-platforms) ကို ကြည့်ပါ။
