---
title: "inlineCss (CSS ကို <head> အတွင်း inline လုပ်ရန် သတ်မှတ်ချက်)"
description: "inlineCss option — experimental; ပုံမှန် <link> tag အစား <style> tag များဖြင့် CSS ကို <head> အတွင်း inline လုပ်ရန် ဖွင့်ချက်; atomic CSS (Tailwind) နှင့် first-load performance အတွက် အကျိုးရှိ; development mode တွင် မရဘဲ production builds တွင်သာ အလုပ်လုပ်"
order: 204
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/inlineCss"
status: translated
updated: 2026-09-03
---

`<head>` ထဲမှာ CSS တွေကို inline လုပ်တာအတွက် experimental ထောက်ပံ့မှုပါ။ ဒီ flag ဖွင့်ထားတဲ့အခါ — ပုံမှန်အားဖြင့် `<link>` tag တစ်ခု generate လုပ်တဲ့ နေရာတိုင်းမှာ `<style>` tag တစ်ခု generate လုပ်ပါလိမ့်မယ်။

## Usage (အသုံးပြုပုံ)

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    inlineCss: true,
  },
}

module.exports = nextConfig
```

## Trade-Offs (အားသာချက်နှင့် အားနည်းချက်)

- **ဖွင့်ထားသင့်သည်** — atomic CSS (Tailwind လိုမျိုး) သုံးပြီး visitors အသစ်တွေအတွက် first-load performance ကို optimize လုပ်ချင်တယ်ဆိုရင်
- **မသုံးသင့်ပါ** — ပြန်ပြန်လာတဲ့ visitors (returning visitors) တွေ များပြီး သူတို့ကို cached stylesheets တွေရဲ့ အကျိုးခံစားစေချင်တယ်ဆိုရင်

### Inline CSS က ဘယ်အခါ အကျိုးရှိလဲ

ပုံမှန်အားဖြင့် browser က HTML ကို download လုပ်ပြီး parse လုပ်ရပါတယ် — CSS `<link>` tags တွေကို ရှာဖွေပြီးမှ stylesheets တွေကို request လုပ်ပြီးမှသာ render လုပ်နိုင်ပါတယ်။ Inline လုပ်ခြင်းက [ဒီ request waterfall ကို ဖယ်ရှားပေး](https://web.dev/learn/performance/optimize-resource-loading#inline_critical_css)တာမို့ — styles တွေက HTML နဲ့အတူ ရောက်ရှိပြီး browser က ချက်ချင်း render လုပ်နိုင်ပါတယ်။

ဒီအကျိုးကျေးဇူးက အောက်ပါတို့နဲ့ အထင်ရှားဆုံးပါ:

- **ပထမဆုံး လာလည်သူများ (First-time visitors)**: CSS files တွေက render-blocking ဖြစ်လို့ — inline လုပ်ခြင်းက ပထမဆုံး လာလည်သူတွေ ခံစားရတဲ့ ကနဦး download နှောင့်နှေးမှုကို ဖယ်ရှားပေးပါတယ်။ Stylesheets တွေကို cache လုပ်ပြီးသား ပြန်လာလည်တဲ့သူတွေကတော့ ဒီအကျိုးကို မရပါဘူး။

- **Performance metrics**: CSS files တွေအတွက် network request တွေ ထပ်မလုပ်ရတော့တာမို့ inline လုပ်ခြင်းက [First Contentful Paint (FCP)](https://web.dev/articles/fcp) နဲ့ [Largest Contentful Paint (LCP)](https://web.dev/articles/lcp) တွေကို သိသိသာသာ ပိုကောင်းမွန်စေနိုင်ပါတယ်။

- **နှေးကွေးတဲ့ ချိတ်ဆက်မှုများ (Slow connections)**: high-latency networks တွေမှာ request တစ်ခုချင်းစီက နှောင့်နှေးမှု ထပ်တိုးစေပါတယ်။ Inline လုပ်ခြင်းက round trips တွေကို လျှော့ချပေးပြီး — ချိတ်ဆက်မှု နှေးတဲ့အခါ အဲဒါက အရေးအကြီးဆုံး ဖြစ်ပါတယ်။

- **Atomic CSS (Tailwind)**: Utility-first frameworks တွေက သင်သုံးတဲ့ classes တွေကိုပဲ generate လုပ်လို့ CSS က သေးငယ်နေပါတယ်။ Page တစ်ခုရဲ့ styles တွေက page ရဲ့ ရှုပ်ထွေးမှုနဲ့အချိုးကျ မကြီးထွားပါဘူး — UI ဘယ်လောက်ပဲ တည်ဆောက်ပါစေ ပုံမှန်အားဖြင့် compact ဖြစ်နေပါတယ်။ ဒါက inline လုပ်တာကို လက်တွေ့ကျကျ ဖြစ်စေပါတယ် — HTML ကို သိသိသာသာ မဖောင်းပွစေဘဲ performance အကျိုးကျေးဇူး ရနိုင်လို့ပါ။

### External CSS က ဘယ်အခါ ပိုကောင်းလဲ

Inline လုပ်ထားတဲ့ styles တွေကို HTML ကနေ သီးခြား cache လုပ်လို့ မရပါဘူး။ Page load တိုင်းမှာ တူညီတဲ့ CSS ကို ပြန်လည် download လုပ်ရပါတယ်။

ဒီအပေးအယူ (trade-off) က အောက်ပါတို့နဲ့ အထင်ရှားဆုံးပါ:

- **ပြန်လာလည်သူများ (Returning visitors)**: Site ကို ထပ်ခါထပ်ခါ လာလည်တဲ့ users တွေက cached external stylesheets တွေရဲ့ အကျိုးကို ရနိုင်ပါတယ်။ Inline လုပ်ထားရင်တော့ သူတို့က visit တိုင်းမှာ styles တွေကို ပြန် download လုပ်ရပါတယ်။

- **ကြီးမားတဲ့ CSS bundles**: External stylesheets တွေက သီးခြား cache ဖြစ်ပြီး ခေတ်မီ infrastructure တွေမှာ ထိရောက်စွာ load လုပ်ပါတယ်။ Inline CSS က HTML response တိုင်းနဲ့အတူ ပါလာလို့ [Time to First Byte (TTFB)](https://web.dev/articles/ttfb) ကို တိုးစေပြီး browser တွေ styles တွေကို သီးခြား cache လုပ်တာကို တားဆီးပါတယ်။ ဒီအပေးအယူက CSS သေးငယ်တဲ့အခါ (Tailwind လို atomic frameworks) အလုပ်ဖြစ်ပေမယ့် — bundle ကြီးတွေမှာ (Bootstrap (သို့) Material UI လို component libraries) overhead ထပ်တိုးစေပါတယ်။

- **Styles တွေကို မျှဝေသုံးတဲ့ pages အများအပြား**: Page တစ်ခုမှာ cache လုပ်ထားတဲ့ external stylesheets တွေက တခြား pages တွေဆီ navigation ကို မြန်စေပါတယ်။ Inline styles တွေကတော့ cross-page caching အကျိုးကျေးဇူး မပေးပါဘူး။

> **သိထားသင့်သည် (Good to know):**
>
> ဒီ feature က လောလောဆယ် experimental ဖြစ်ပြီး သိထားတဲ့ ကန့်သတ်ချက်အချို့ ရှိပါတယ်:
>
> - CSS inlining ကို global အနေနဲ့ သက်ရောက်စေပြီး — page တစ်ခုချင်းစီအလိုက် configure လုပ်လို့ မရပါဘူး
> - ကနဦး page load မှာ styles တွေ နှစ်ကြိမ် ထပ်နေပါတယ် — SSR အတွက် `<style>` tags တွေထဲမှာ တစ်ခါ၊ RSC payload ထဲမှာ တစ်ခါ
> - Prerendered pages တွေဆီ navigation လုပ်တဲ့အခါ — ထပ်နေတာတွေ မဖြစ်အောင် inline CSS အစား `<link>` tags တွေကို သုံးပါလိမ့်မယ်
> - ဒီ feature က development mode မှာ မရနိုင်ပါဘူး — production builds တွေမှာပဲ အလုပ်လုပ်ပါတယ်
