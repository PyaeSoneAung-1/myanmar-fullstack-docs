---
title: "partialPrefetching (link prefetching အပြုအမူ သတ်မှတ်ချက်)"
description: "partialPrefetching option — route တစ်ခုစီ၏ static အစိတ်အပိုင်းများကိုသာ prefetch လုပ်မည့် default link prefetch အပြုအမူကို app အဆင့်တွင် ဖွင့်ရန်; cacheComponents flag လိုအပ်; App Shell ပြန်သုံးခြင်း, per-link prefetch ဖြင့် params/searchParams စသည်တို့ ထပ်မံ ဖြေရှင်းခြင်း; v16.3.0"
order: 202
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching"
status: translated
updated: 2026-09-03
---

`partialPrefetching` က app အဆင့်မှာ Partial Prefetching ကို ဖွင့်ပေးပါတယ်။ Framework က route တစ်ခုစီရဲ့ static အစိတ်အပိုင်းတွေကို default အားဖြင့် prefetch လုပ်ပါတယ် — link တစ်ခုချင်းစီမှာ `prefetch={true}` သတ်မှတ်ပြီး [per-link prefetching](https://nextjs.org/docs/app/guides/optimizing-prefetching) ကို သုံးကာ ပိုမို သိမ်းယူနိုင်ပါတယ်။

## Usage (အသုံးပြုပုံ)

```ts filename="next.config.ts" highlight={5} switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
```

```js filename="next.config.js" highlight={3} switcher
module.exports = {
  cacheComponents: true,
  partialPrefetching: true,
}
```

`partialPrefetching` က [`cacheComponents`](/docs/nextjs/next-config-cache-components) လိုအပ်ပါတယ်။ အဲဒါမရှိဘဲနဲ့ဆို `next dev` နဲ့ `next build` တွေက config validation မှာ error throw ဖြစ်ပါလိမ့်မယ်။

## Reference

| Value   | Description                              |
| ------- | ---------------------------------------- |
| `true`  | App တစ်ခုလုံးမှာ Partial Prefetching ဖွင့်ပေးသည်။ |
| `false` | Default။ Prefetch အပြုအမူကို မပြောင်းလဲပါ။          |

## Prefetch တွေ ဘယ်လို ဖြေရှင်းလဲ (How prefetches resolve)

Partial Prefetching မတိုင်ခင်က Next.js က မြင်နေရတဲ့ link တစ်ခုချင်းစီအတွက် prefetch လုပ်ပါတယ်: routes N ခုဆီ ညွှန်တဲ့ link N ခုပါတဲ့ page တစ်ခုက — အဲဒီ links တွေ viewport ထဲ ဝင်လာတာနဲ့ prefetch ~N ခု ဖြစ်ပေါ်စေပါတယ်။

`partialPrefetching: true` နဲ့ဆိုရင် Next.js က route တစ်ခုစီအတွက် ပြန်သုံးလို့ရတဲ့ [App Shell](https://nextjs.org/docs/app/glossary#app-shell) တစ်ခုကိုပဲ prefetch လုပ်ပါတယ်။ App Shell ထဲမှာ link ရဲ့ URL အပေါ် မမူတည်တဲ့ rendered output တွေ ပါဝင်ပါတယ်။ `params` (သို့) `searchParams` အပေါ် မူတည်တဲ့ content အပါအဝင် URL-specific content တွေက default အားဖြင့် navigation ပြီးမှ ဖြေရှင်းပါတယ်။ App Shells တွေကို client မှာ cache လုပ်ထားလို့ — route တစ်ခုတည်းဆီ ညွှန်တဲ့ links တွေက prefetch တစ်ခုတည်းကို ပြန်သုံးကြပါတယ်။

ဒီ pattern က single-page apps တွေမှာ per-route code splitting နဲ့ ဆင်တူပါတယ်: route တစ်ခုစီအတွက် artifact တစ်ခု — အဲဒါကို ညွှန်တဲ့ link တိုင်းက မျှဝေသုံးပါတယ်။

> **သိထားသင့်သည် (Good to know):** Routes တွေက `cookies()` (သို့) `headers()` ကို ဖတ်နေတယ်ဆိုရင် — session data အပါအဝင် App Shell တစ်ခု ထုတ်ပေးပါတယ်။ Framework က ဒါကို အလိုအလျောက် ရှာဖွေပြီး shell ကို session တစ်ခုစီအလိုက် client မှာ cache လုပ်ပါတယ်။

Link တစ်ခုက [`<Link prefetch={true}>`](/docs/nextjs/component-link) နဲ့ App Shell ထက်ပိုပြီး တောင်းဆိုနိုင်ပါတယ်။ ဒီလိုဆို prefetch က `params`, `searchParams`, full URL စတဲ့ URL data တွေနဲ့ သူ့နောက်က cache လုပ်ထားတဲ့ content တွေကိုပါ ဖြေရှင်းပေးပါတယ်။ [Optimizing prefetching](https://nextjs.org/docs/app/guides/optimizing-prefetching) ကို ကြည့်ပါ။

> **သိထားသင့်သည် (Good to know):** `<Link prefetch={true}>` ကို Partial Prefetching ထဲ မဝင်ရသေးတဲ့ route တစ်ခုဆီ သုံးရင် — dev console ထဲမှာ `partialPrefetching` ကို app တစ်ခုလုံးမှာ (သို့) segment မှာ `prefetch = 'partial'` အဖြစ် ဖွင့်ဖို့ အကြံပြုတဲ့ error တစ်ခု ပေါ်ပါလိမ့်မယ်။ [dev warning Insight](https://nextjs.org/docs/messages/instant-link-prefetch-partial) မှာ fix တစ်ခုချင်းစီအကြောင်း အသေးစိတ် ဖော်ပြထားပါတယ်။

## Per-segment overrides (segment အလိုက် ပြန်လည်သတ်မှတ်ခြင်း)

တိကျတဲ့ [`prefetch`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/prefetch) တန်ဖိုးတစ်ခုကို export လုပ်ထားတဲ့ segment တစ်ခုက — အဲဒီ route အတွက် app-level default ကို override လုပ်ပါတယ်။

## Version History

| Version | Changes                                                                 |
| ------- | ----------------------------------------------------------------------- |
| 16.3.0  | `partialPrefetching` စတင် မိတ်ဆက်။ `cacheComponents` ဖွင့်ထားဖို့ လိုအပ်သည်။ |
