---
title: "cssChunking (CSS files ခွဲဝေခြင်း သတ်မှတ်ချက်)"
description: "experimental.cssChunking option — သင့် application ၏ CSS files များကို chunks အဖြစ် ခွဲဝေ/ပြန်စီပြီး route တစ်ခုစီက လိုအပ်သော CSS နီးပါးကိုသာ load လုပ်စေရန်; true (default), false, 'strict' (webpack) နှင့် 'graph' (Turbopack) တို့ ရွေးချယ်နိုင်; requestCost/weightDistribution ဖြင့် ချိန်ညှိနိုင်"
order: 216
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/cssChunking"
status: translated
updated: 2026-09-03
---

CSS Chunking က သင့် web application ရဲ့ performance ကို ပိုကောင်းစေဖို့ — CSS files တွေကို chunks တွေအဖြစ် ခွဲထုတ်ပြီး အစီအစဉ် ပြန်ညှိပေးတဲ့ strategy တစ်ခုပါ။ ဒါက route တစ်ခုကို application ရဲ့ CSS အားလုံးကို တစ်ပြိုင်နက် load လုပ်နေမယ့်အစား — သူလိုအပ်တဲ့ CSS နီးပါးကိုပဲ load လုပ်နိုင်စေပါတယ်။

သင့် `next.config.js` file ထဲက `experimental.cssChunking` option ကို သုံးပြီး CSS files တွေ ဘယ်လို chunk လုပ်မလဲ ထိန်းချုပ်နိုင်ပါတယ်:

```tsx filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig = {
  experimental: {
    cssChunking: true, // default
  },
} satisfies NextConfig

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cssChunking: true, // default
  },
}

module.exports = nextConfig
```

## Options

- **`true` (default)** (**webpack နဲ့ Turbopack**): Next.js က တတ်နိုင်သမျှ CSS files တွေကို ပေါင်းစည်း (merge) ဖို့ ကြိုးစားပါတယ် — import order ကနေ files တွေကြားက explicit နဲ့ implicit dependencies တွေကို ဆုံးဖြတ်ပြီး chunks အရေအတွက် (ဒါကြောင့် requests အရေအတွက်ပါ) ကို လျှော့ချပါတယ်။
- **`false`** (**webpack မှာပဲ**): Next.js က သင့် CSS files တွေကို merge (သို့) ပြန်စီဖို့ မကြိုးစားပါဘူး။
- **`'strict'`** (**webpack မှာပဲ**): Next.js က CSS files တွေကို သင့် files တွေထဲမှာ import လုပ်ထားတဲ့ အစီအစဉ်အတိုင်း load လုပ်ပါတယ် — chunks နဲ့ requests တွေ ပိုများစေနိုင်ပါတယ်။
- **`'graph'`** (**Turbopack မှာပဲ**): Next.js က routes တွေအနှံ့ CSS တွေကို စုစည်းဖို့ cost-based graph algorithm တစ်ခုကို သုံးပြီး — route တစ်ခုစီ download လုပ်တဲ့ bytes နဲ့ သူလုပ်တဲ့ requests တွေကို ချိန်ခွင်လျှာ ညှိပါတယ်။

## Strategy တစ်ခု ရွေးချယ်ခြင်း (Choosing a strategy)

App အများစုအတွက်တော့ default (`true`) က bundler နှစ်ခုလုံးမှာ မှန်ကန်တဲ့ ရွေးချယ်မှုပါ: CSS တွေကို ပေါင်းစည်းပြီး requests တွေ နည်းအောင် လုပ်ပေးပါတယ်။ တခြား strategy တစ်ခုကို — တိကျတဲ့ အကြောင်းပြချက် ရှိမှပဲ လှမ်းသုံးပါ။

Turbopack မှာတော့ အဲဒီအကြောင်းပြချက်က များသောအားဖြင့် performance ပါ။ CSS တွေကို routes တွေကြားမှာ ဘယ်လို share လုပ်မလဲ ချိန်ညှိဖို့ `graph` ကို ပြောင်းသုံးပါ — route တစ်ခုက download လုပ်တဲ့ unused CSS တွေကို ဖြတ်တောက်ပေးပေမယ့် requests တွေ ပိုများစေပါတယ် (အောက်က Balancing requests and grouping section မှာ ကြည့်ပါ)။

webpack မှာတော့ အဲဒီအကြောင်းပြချက်က များသောအားဖြင့် correctness (မှန်ကန်မှု) ပါ။ မထင်မှတ်ထားတဲ့ CSS အပြုအမူတွေ ကြုံရရင် `'strict'` ကို ပြောင်းပါ။ ဥပမာ — မတူညီတဲ့ files တွေထဲမှာ `import` order မတူညီစွာနဲ့ (`a` ကို `b` ရှေ့ (သို့) `b` ကို `a` ရှေ့) `a.css` နဲ့ `b.css` ကို import လုပ်ရင် — `true` က သူတို့ကြားမှာ dependencies မရှိဘူးလို့ ယူဆပြီး ဘယ်လို order နဲ့မဆို merge လုပ်ပါတယ်; `b.css` က `a.css` ပေါ် မှီခိုနေရင် — `'strict'` က merge မလုပ်ဘဲ import order အတိုင်း load စေပြီး chunks နဲ့ requests တွေ ပိုများစေပါတယ်။ Merge ကို လုံးဝ ပိတ်ချင်ရင်တော့ `false` ကို သုံးပါ။

## Route တစ်ခုက တကယ် သုံးတဲ့ CSS တွေကို စစ်ဆေးခြင်း (Debugging what a route actually uses)

Unused CSS တချို့က လက်ခံနိုင်စရာ ဖြစ်ပြီး app အများစုက ဘာမှ ပြောင်းစရာ မလိုပေမယ့် — render-blocking CSS ကို ထိန်းချုပ်ထားဖို့တော့ ထိုက်တန်ပါတယ်။ [Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/unused-css-rules) က ဒါကို estimated saving တစ်ခုနဲ့အတူ **Reduce unused CSS** opportunity အဖြစ် မှတ်သားပြီး — Chrome DevTools ရဲ့ [Coverage panel](https://developer.chrome.com/docs/devtools/coverage) မှာတော့ stylesheet တစ်ခုချင်းစီအလိုက် ပြသပေးပါတယ် — usage bar တစ်ခုက stylesheet တစ်ခုစီရဲ့ သက်ရောက်နေတဲ့ (applied) CSS ကို အစိမ်းရောင်နဲ့လည်းကောင်း၊ unused CSS ကို မီးခိုးရောင်နဲ့လည်းကောင်း ပြပါတယ်။

Report ဖတ်တဲ့အခါ — interaction ပေါ်မှပဲ သက်ရောက်တဲ့ styles တွေ (`:hover`, `:focus` (သို့) menus နဲ့ modals တွေအတွက် JavaScript က toggle လုပ်ပေးတဲ့ classes တွေလိုမျိုး) ကို သတိထားပါ — Coverage က သူတို့ကို သင် trigger မလုပ်မချင်း unused အဖြစ် ရေတွက်လို့ပါ။

ဒီ unused CSS တွေရဲ့ ရင်းမြစ်က နှစ်မျိုးထဲက တစ်မျိုးပါ။ ပထမတစ်မျိုးက — သင့် route က import လုပ်တဲ့ stylesheet တစ်ခုထဲက dead CSS (အသုံးမဝင်တော့တဲ့ CSS) — ဒါကို မသုံးတဲ့ rules တွေ ဖယ်ရှားပြီး (သို့) အဲဒီ rules တွေကိုပဲ သုံးတဲ့ routes တွေက import လုပ်တဲ့ stylesheet တစ်ခုဆီ ရွှေ့ပြီး သင့် source မှာ ဖြေရှင်းနိုင်ပါတယ် ([CSS Modules](/docs/nextjs/css) က styles တွေကို import လုပ်တဲ့ component ထဲမှာပဲ scope ချပေးလို့ ဒါကို သဘာဝကျကျ ဖြစ်စေပါတယ်)။

ဒါမှမဟုတ် — bundler က တခြား stylesheet တစ်ခုကို သင့် route က load လုပ်တဲ့ shared chunk တစ်ခုထဲ merge လုပ်လိုက်လို့ပါ။ အဲဒါကို သင်ရွေးချယ်ထားတဲ့ chunking strategy က ထိန်းချုပ်ပါတယ် (အထက်က section မှာ ကြည့်ပါ)။ Turbopack မှာဆိုရင် graph mode က CSS တွေ ဘယ်လောက် ပြင်းပြင်းထန်ထန် merge လုပ်မလဲ အသေးစိတ် ချိန်ညှိပေးနိုင်ပါတယ် (အောက်က section မှာ ကြည့်ပါ)။

## Requests နဲ့ grouping ချိန်ညှိခြင်း (Balancing requests and grouping)

`graph` strategy က CSS တွေကို shared chunks တွေအဖြစ် စုစည်းပြီး requests တွေ လျှော့ချပေးပါတယ်။ Default tuning ကို သုံးတဲ့ string ပုံစံနဲ့ ဖွင့်နိုင်ပါတယ်:

```tsx filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig = {
  experimental: {
    cssChunking: 'graph',
  },
} satisfies NextConfig

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cssChunking: 'graph',
  },
}

module.exports = nextConfig
```

အဲဒီ ချိန်ခွင်လျှာကို ပြောင်းချင်ရင် — object တစ်ခု ပေးလိုက်ပါ။ `requestCost` ရော `weightDistribution` ရော နှစ်ခုလုံး optional ဖြစ်လို့ သင်ပြောင်းချင်တဲ့ တစ်ခုကိုပဲ ထည့်ပါ:

```tsx filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig = {
  experimental: {
    cssChunking: {
      type: 'graph',
      requestCost: 100000,
      weightDistribution: 0.1,
    },
  },
} satisfies NextConfig

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cssChunking: {
      type: 'graph',
      requestCost: 100000,
      weightDistribution: 0.1,
    },
  },
}

module.exports = nextConfig
```

- **`requestCost`** (default `20000`): CSS request တစ်ခုစီ ထပ်တိုးတိုင်း ကုန်ကျမယ့် estimated cost (bytes နဲ့)။ တန်ဖိုး ကြီးလေလေ — ပိုကြီးတဲ့ shared chunks တွေ နည်းနည်းနဲ့၊ requests စုစုပေါင်း နည်းနည်းနဲ့ ဖြစ်ဖို့ ဦးတည်လေလေပါ။
- **`weightDistribution`** (default `0.1`): Shared chunk တစ်ခုရဲ့ cost ကို အဲဒါကို load လုပ်တဲ့ routes တွေကြားမှာ ဘယ်လို ခွဲဝေမလဲ ထိန်းချုပ်ပါတယ် — route တစ်ခုစီက import လုပ်တဲ့ CSS ဘယ်လောက် ရှိလဲပေါ် အလေးချိန် လိုက်ပါတယ်။ `0` ဆိုရင် route တိုင်းကို ညီတူညီမျှ အလေးချိန် ပေးပြီး — တန်ဖိုး မြင့်လေလေ CSS နည်းနည်းပဲ import လုပ်တဲ့ routes တွေကို အလေးချိန် ပိုပေးလေလေပါ — အဲဒါကြောင့် algorithm က CSS နည်းတဲ့ routes တွေကို ဦးစားပေးပြီး — route ကြီးကြီးတွေမှာ အပို CSS က သိသာမှု နည်းတယ်လို့ ယူဆပါတယ်။

## `graph` က ဘာတွေ merge လုပ်ရမလဲ ဆုံးဖြတ်ပုံ (How `graph` decides what to merge)

CSS တွေကို shared chunks တွေအဖြစ် merge လုပ်တာက default (`true`) က လုပ်ပြီးသား အလုပ်ပါ; `graph` က merge နဲ့ split ကြားမှာ ဘယ်နေရာမှာ မျဉ်းဆွဲမလဲ ဆိုတာကိုပဲ ထိန်းချုပ်ခွင့် ပေးတာပါ။

Stylesheet တစ်ခုကို မျှဝေသုံးတဲ့ route နှစ်ခုကို ကြည့်ကြည့်ပါ:

```txt
/a → [shared.css, only-a.css]
/b → [shared.css]
```

ဒီမှာ `/b` က `only-a.css` ကို ဘယ်တော့မှ import မလုပ်ပါဘူး — ဒါကြောင့် ဆုံးဖြတ်စရာ တစ်ခုပဲ ကျန်ပါတယ်: `only-a.css` ကို shared chunk ထဲမှာ ဆက်ထားမလား၊ သူ့ချည်း သီးသန့် chunk တစ်ခု ပေးမလား။

Merge လုပ်ထားထားရင် `/a` က သူ့ရဲ့ CSS အားလုံးကို request တစ်ခုတည်းနဲ့ load လို့ ရပါတယ်။ အဲဒီအတွက် ကုန်ကျစရိတ်က — အဲဒီ shared chunk ကိုပါ load လုပ်နေရတဲ့ `/b` က `only-a.css` ကို ဘယ်တော့မှ import မလုပ်ဖူးပေမယ့် download လုပ်လိုက်ရတာပါ။

Split လုပ်လိုက်ရင် `/b` အတွက် အဲဒီ bytes တွေ သက်သာသွားပေမယ့် — အခု `/a` က requests နှစ်ခု လုပ်ရပါတော့မယ်။ Default က ဒီနှစ်ခုကြားမှာ fixed heuristic တစ်ခုနဲ့ ရွေးချယ်ပါတယ်။

`requestCost` option က `graph` က အဲဒီ trade-off ကို ဘယ်လို တန်ဖိုးသတ်မှတ်လဲ ဆိုတာပါ: request တစ်ခု ပိုလုပ်ရတာနဲ့ ထိုက်တန်တဲ့ un-imported CSS ရဲ့ ပမာဏ။ `only-a.css` က `requestCost` အောက်မှာ ရှိနေသရွေ့ merge ထားပြီး — request တစ်ခုရဲ့ တန်ဖိုးကို ကျော်လွန်လောက်အောင် ကြီးလာတာနဲ့ split လုပ်လိုက်ပါတယ်။

ဆုံးဖြတ်ချက်ကို မောင်းနှင်တာက — merge လုပ်တာက route တစ်ခုပေါ်ကို တွန်းတင်လိုက်မယ့် un-imported CSS ရဲ့ အရွယ်အစားပါ — သူဝင်ဆက်လိုက်တဲ့ shared chunk ရဲ့ အရွယ်အစားထက် အများကြီး ပိုအရေးပါပါတယ်။ Default `requestCost` (20 KB ဝန်းကျင်) နဲ့ဆို — `only-a.css` က သူ့ကိုယ်ပိုင် chunk ရဖို့ အဲဒီ အရွယ်အစားလောက် ကျော်လွန်ရမှာမို့ — stylesheet သေးသေးလေးတွေက merge ဖြစ်နေပါတယ်။

<details>
  <summary>Graph algorithm overview (graph algorithm အကျဉ်းချုပ်)</summary>

High level ကြည့်ရင် — algorithm က CSS file တစ်ခုချင်းစီနဲ့ အလုပ်လုပ်ပါတယ်။ Route တစ်ခုစီက import လုပ်တဲ့ CSS တွေရဲ့ အစီအစဉ်ရှိ list ကနေ စတင်ပါတယ်:

```txt
/dashboard  → [reset.css, theme.css, layout.css, dashboard.css]
/settings   → [reset.css, theme.css, layout.css, settings.css]
/login      → [reset.css, login.css]
```

အဲဒီကနေ weighted graph တစ်ခု တည်ဆောက်ပါတယ် — CSS file နှစ်ခုကို routes တွေ ပိုများတဲ့နေရာမှာ တူညီတဲ့ order နဲ့ import လုပ်လေလေ ဒါတွေကြားက edge က ပိုလေးလေလေပါ။ အဲဒီ graph ကို မကြာခဏ တွဲနေတဲ့ files တွေ ကပ်နေစေမယ့် မျဉ်းတစ်ကြောင်းတည်း (single line) အဖြစ် ပြားချပြီး — အဲဒီမျဉ်းကို chunks တွေအဖြစ် ပိုင်းလိုက်တဲ့ _cuts_ (ဖြတ်တောက်မှုတွေ) ကို နေရာချပါတယ်။ ဥပမာ:

```txt
reset theme layout │ dashboard │ settings │ login
└──── chunk 1 ────┘   chunk 2     chunk 3    chunk 4
```

Route တစ်ခုက — သူ import လုပ်တဲ့ file တစ်ခု ပါဝင်တဲ့ chunk တိုင်းကို load လုပ်လို့ `/dashboard` က chunks 1 နဲ့ 2 ကို load လုပ်ပြီး `/login` က chunks 1 နဲ့ 4 ကို load ပါတယ်။

Algorithm က routes အားလုံးရဲ့ စုစုပေါင်း download cost အနည်းဆုံး ဖြစ်အောင် — bytes နဲ့ requests ကို ချိန်ညှိပြီး chunks တွေ ဘယ်မှာ ခွဲမလဲ ရွေးချယ်ပါတယ်။ Route တစ်ခုချင်းစီအတွက် မဟုတ်ဘဲ စုစုပေါင်းကို optimize လုပ်လို့ — စုစုပေါင်း cost နည်းနေစေဖို့ဆိုရင် route တစ်ခုက သူ ဘယ်တော့မှ import မလုပ်ဖူးတဲ့ CSS တချို့ ပါသွားတာမျိုး ဖြစ်နိုင်ပါတယ်။ Options နှစ်ခုက အလေးချိန် ချိန်ညှိပေးပါတယ်:

- **`requestCost`**: `reset.css`, `theme.css` နဲ့ `layout.css` တွေက chunk တစ်ခုတည်း မျှဝေလို့ — အဲဒါတွေ လိုအပ်တဲ့ route တစ်ခုက request သုံးခုအစား တစ်ခုပဲ လုပ်ရပါတယ်။ `requestCost` က request တစ်ခုရဲ့ တန်ဖိုးကို bytes နဲ့ ဖော်ပြတာပါ: မြှင့်လိုက်ရင် algorithm က ဒီလိုမျိုး ပိုပြီး merge လုပ်ကာ — download ပိုကြီးစေပေမယ့် requests တွေ နည်းစေပါတယ်; `0` ဆီ နှိမ့်လိုက်ရင် chunks တွေ ကွဲထွက်ပြီး — routes တွေက သူတို့ import လုပ်တာနဲ့ နီးစပ်တာပဲ download လုပ်ပေမယ့် requests တွေ ပိုများစေပါတယ်။
- **`weightDistribution`**: `/login` က chunk 1 ကနေ `reset.css` ကိုပဲ လိုပေမယ့် — အဲဒီ chunk ကို မျှဝေထားလို့ `theme.css` နဲ့ `layout.css` တွေပါ download လုပ်ရပါတယ်။ ဒီ option က algorithm က ဒါကို ဘယ်လောက် ဂရုစိုက်မလဲ ဆုံးဖြတ်ပေးပါတယ်။ `0` မှာ `/login` နဲ့ `/dashboard` တွေက ညီတူ ရေတွက်လို့ အပိုတွေ ပါသွားတာ ခွင့်ပြုထားပါတယ်; မြှင့်လိုက်ရင် `/login` လို CSS နည်းနည်းပဲ import လုပ်တဲ့ routes တွေက ပိုအရေးပါလာပြီး — algorithm က သူတို့အတွက် ဘယ်တော့မှ import မလုပ်ဖူးတဲ့ CSS တွေ မပါအောင် ကြိုးစားပေးပေမယ့် — requests အရေအတွက် စုစုပေါင်း ပိုများစေပါတယ်။

</details>
