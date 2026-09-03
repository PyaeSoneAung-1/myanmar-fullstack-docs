---
title: "Memory Usage Optimization (memory သုံးစွဲမှုကို အကောင်းဆုံးဖြစ်အောင် ပြုလုပ်ခြင်း)"
description: "Next.js application တွေရဲ့ memory သုံးစွဲမှုကို development နဲ့ production နှစ်ခုလုံးမှာ အကောင်းဆုံးဖြစ်အောင် ပြုလုပ်နည်း — dependencies လျှော့ချခြင်း, experimental.webpackMemoryOptimizations, --experimental-debug-memory-usage, heap profile/snapshot ခွဲခြမ်းစိတ်ဖြာခြင်း, Webpack build worker, cache နဲ့ source maps ပိတ်ခြင်း, preloadEntriesOnStart စတာတွေ အကြောင်း"
order: 127
source: "https://nextjs.org/docs/app/guides/memory-usage"
status: translated
updated: 2026-09-03
---

Applications တွေ ကြီးထွားလာပြီး feature တွေ ပိုများလာတာနဲ့အမျှ — local မှာ develop လုပ်တဲ့အခါ (သို့) production builds တွေ ပြုလုပ်တဲ့အခါ resources တွေ ပိုမို လိုအပ်လာနိုင်ပါတယ်။

ဒီ guide ထဲမှာ Next.js ရဲ့ memory ကို အကောင်းဆုံးဖြစ်အောင် ချိန်ညှိဖို့နဲ့ အဖြစ်များတဲ့ memory ပြဿနာတွေကို ဖြေရှင်းဖို့ — strategy တွေနဲ့ technique တွေကို လေ့လာကြည့်ရအောင်။

## Dependencies အရေအတွက် လျှော့ချခြင်း (Reduce Number of Dependencies)

Dependencies အများအပြား ပါဝင်တဲ့ applications တွေက memory ပိုမို သုံးစွဲပါတယ်။

[Bundle Analyzer](https://nextjs.org/docs/app/guides/package-bundling) က သင့် application ထဲက — performance နဲ့ memory usage တိုးတက်စေဖို့ ဖယ်ရှားနိုင်မယ့် — ကြီးမားတဲ့ dependencies တွေကို စုံစမ်းစစ်ဆေးဖို့ ကူညီပေးနိုင်ပါတယ်။

## `experimental.webpackMemoryOptimizations` ကို စမ်းသုံးကြည့်ခြင်း

`v15.0.0` ကစပြီး — သင့် `next.config.js` file ထဲမှာ `experimental.webpackMemoryOptimizations: true` ဆိုပြီး ထည့်နိုင်ပါတယ်။ ဒါက max memory usage ကို လျှော့ချပေးပေမယ့် compilation အချိန်ကို နည်းငယ် မြင့်တက်စေနိုင်တဲ့ Webpack အပြုအမူကို ပြောင်းလဲပေးပါတယ်။

> **သိထားသင့်သည်:** ဒီ feature က လက်ရှိမှာ experimental အဆင့်ဖြစ်လို့ project များစွာမှာ အရင် စမ်းသပ်ဖို့ ရည်ရွယ်ထားပါတယ် — ဒါပေမယ့် risk နည်းတယ်လို့ ယူဆထားပါတယ်။

## `next build` ကို `--experimental-debug-memory-usage` နဲ့ run လုပ်ခြင်း

`14.2.0` ကစပြီး — `next build --experimental-debug-memory-usage` ဆိုပြီး run လုပ်နိုင်ပါတယ်။ ဒီ mode မှာ Next.js က build တစ်လျှောက်လုံး memory usage အကြောင်း အချက်အလက်တွေ — ဥပမာ heap usage နဲ့ garbage collection statistics တွေလို — စဉ်ဆက်မပြတ် print ထုတ်ပေးပါတယ်။ Memory usage က သတ်မှတ်ထားတဲ့ limit နီးကပ်လာတဲ့အခါ heap snapshots တွေကိုလည်း အလိုအလျောက် ရိုက်ယူပေးပါတယ်။

> **သိထားသင့်သည်:** ဒီ feature က Webpack build worker option နဲ့ မတွဲဖက်နိုင်ပါဘူး — ဒီ option က သင့်မှာ custom webpack config မရှိရင် auto-enabled ဖြစ်နေတတ်ပါတယ်။

## Heap profile တစ်ခု မှတ်တမ်းတင်ခြင်း (Record a Heap Profile)

Memory ပြဿနာတွေကို ရှာဖွေဖို့ — Node.js ကနေ heap profile တစ်ခုကို မှတ်တမ်းတင်ပြီး Chrome DevTools ထဲမှာ load လုပ်ကာ — memory leaks တွေရဲ့ ဖြစ်နိုင်ချေရှိတဲ့ အရင်းအမြစ်တွေကို ဖော်ထုတ်နိုင်ပါတယ်။

သင့် terminal ထဲမှာ — Next.js build ကို စတင်တဲ့အခါ Node.js ဆီ `--heap-prof` flag ကို ထည့်ပေးပါ:

```sh
node --heap-prof node_modules/next/dist/bin/next build
```

Build ပြီးဆုံးတဲ့အခါ — Node.js က `.heapprofile` file တစ်ခုကို ဖန်တီးပေးပါလိမ့်မယ်။

Chrome DevTools ထဲမှာ Memory tab ကို ဖွင့်ပြီး "Load Profile" button ကို နှိပ်ကာ — ဒီ file ကို visualize လုပ်နိုင်ပါတယ်။

## Heap ရဲ့ snapshot တစ်ခုကို ခွဲခြမ်းစိတ်ဖြာခြင်း (Analyze a Snapshot of the Heap)

Application ရဲ့ memory usage ကို ခွဲခြမ်းစိတ်ဖြာဖို့ inspector tool တစ်ခုကို အသုံးပြုနိုင်ပါတယ်။

`next build` (သို့) `next dev` command run လုပ်တဲ့အခါ — command ရဲ့ အစမှာ `NODE_OPTIONS=--inspect` ကို ထည့်ပါ။ ဒါက inspector agent ကို default port ပေါ်မှာ ဖွင့်ပေးပါလိမ့်မယ်။ User code မစတင်ခင် ရပ်တန့်စေချင်တယ်ဆိုရင် — အဲဒီအစား `--inspect-brk` ကို သုံးနိုင်ပါတယ်။ Process run နေချိန်မှာ Chrome DevTools လိုမျိုး tool တစ်ခုနဲ့ debugging port ကို ချိတ်ဆက်ပြီး — heap ရဲ့ snapshot တစ်ခုကို မှတ်တမ်းတင်ကာ ဘာ memory တွေ ဆက်ထိန်းထားခံရလဲဆိုတာ ခွဲခြမ်းစိတ်ဖြာ ကြည့်ရှုနိုင်ပါတယ်။

`14.2.0` ကစပြီး — heap snapshots တွေ ရိုက်ယူဖို့ ပိုလွယ်ကူစေတဲ့ `--experimental-debug-memory-usage` flag နဲ့လည်း `next build` ကို run လုပ်နိုင်ပါတယ်။

ဒီ mode နဲ့ run နေစဉ်မှာ — process ဆီကို ဘယ်အချိန်မဆို `SIGUSR2` signal ပို့လိုက်ရင် — process က heap snapshot တစ်ခုကို ရိုက်ယူပါလိမ့်မယ်။

ဒီ heap snapshot ကို Next.js application ရဲ့ project root မှာ သိမ်းဆည်းပြီး — Chrome DevTools လို heap analyzer တစ်ခုခုနဲ့ load လုပ်ကာ — ဘာ memory တွေ ထိန်းသိမ်းထားခံရလဲ ကြည့်ရှုနိုင်ပါတယ်။ ဒီ mode က Webpack build workers တွေနဲ့တော့ မတွဲဖက်နိုင်သေးပါဘူး။

Heap snapshots တွေကို ဘယ်လို မှတ်တမ်းတင်ပြီး ခွဲခြမ်းစိတ်ဖြာရမလဲဆိုတာအတွက် [heap snapshots မှတ်တမ်းတင်ခြင်းနဲ့ ခွဲခြမ်းစိတ်ဖြာခြင်း](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots) ကို ကြည့်ပါ။

## Webpack build worker

Webpack build worker က Webpack compilations တွေကို Node.js worker သီးခြားတစ်ခုအတွင်းမှာ run လုပ်စေပြီး — builds လုပ်နေစဉ်အတွင်း application ရဲ့ memory usage ကို လျှော့ချပေးပါတယ်။

`v14.1.0` ကစပြီး — သင့် application မှာ custom Webpack configuration မရှိရင် ဒီ option ကို default အနေနဲ့ ဖွင့်ပေးထားပါတယ်။

သင့်က Next.js version အဟောင်းတစ်ခုကို သုံးနေတယ် (သို့) custom Webpack configuration ရှိနေတယ်ဆိုရင် — သင့် `next.config.js` ထဲမှာ `experimental.webpackBuildWorker: true` လို့ သတ်မှတ်ခြင်းဖြင့် ဒီ option ကို ဖွင့်နိုင်ပါတယ်။

> **သိထားသင့်သည်:** ဒီ feature က custom Webpack plugins အားလုံးနဲ့တော့ မတွဲဖက်နိုင်ပါဘူး။

## Webpack cache ကို ပိတ်ခြင်း (Disable Webpack Cache)

[Webpack cache](https://webpack.js.org/configuration/cache/) က ထုတ်လုပ်ထားပြီးသား Webpack modules တွေကို memory နဲ့/သို့မဟုတ် disk ပေါ်မှာ သိမ်းဆည်းပြီး — builds တွေရဲ့ အမြန်နှုန်းကို မြှင့်တင်ပေးပါတယ်။ ဒါက performance အတွက် အထောက်အကူပြုနိုင်ပေမယ့် — cached data တွေကို သိမ်းထားဖို့အတွက် application ရဲ့ memory usage ကိုလည်း မြင့်တက်စေပါတယ်။

သင့် application ထဲကို [custom Webpack configuration](/docs/nextjs/next-config-webpack) တစ်ခု ထည့်ခြင်းဖြင့် ဒီအပြုအမူကို ပိတ်နိုင်ပါတယ်:

```js filename="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: 'memory',
      })
    }
    // Important: return the modified config
    return config
  },
}

export default nextConfig
```

## Static analysis ကို ပိတ်ခြင်း (Disable Static Analysis)

Typechecking က memory အများကြီး လိုအပ်နိုင်ပါတယ် — အထူးသဖြင့် project ကြီးတွေမှာပါ။ ဒါပေမယ့် project အများစုမှာ ဒီအလုပ်တွေကို ကိုင်တွယ်ပေးနိုင်တဲ့ dedicated CI runner တစ်ခု ရှိပြီးသားပါ။ Build က "Running TypeScript" အဆင့်အတွင်းမှာ out-of-memory ပြဿနာတွေ ဖြစ်ပေါ်လာရင် — builds တွေအတွင်းမှာ ဒီအလုပ်ကို ပိတ်ထားနိုင်ပါတယ်:

```js filename="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

export default nextConfig
```

- [TypeScript Errors တွေကို လျစ်လျူရှုခြင်း (Ignoring TypeScript Errors)](https://nextjs.org/docs/app/api-reference/config/typescript#disabling-typescript-errors-in-production)

ဒါက type errors တွေကြောင့် မှားယွင်းတဲ့ deploys တွေ ဖြစ်စေနိုင်တာကို သတိပြုပါ။ Static analysis ပြီးမြောက်ပြီးမှသာ builds တွေကို production ဆီ တင်ဖို့ အခိုင်အမာ အကြံပြုပါတယ်။ Vercel ကို deploy လုပ်မယ်ဆိုရင် — custom tasks တွေ အောင်မြင်ပြီးမှ builds တွေကို production ဆီ ဘယ်လို promote လုပ်ရမလဲဆိုတဲ့ [staging deployments အတွက် လမ်းညွှန်](https://vercel.com/docs/deployments/managing-deployments#staging-and-promoting-a-production-deployment) ကို ကြည့်ရှုနိုင်ပါတယ်။

## Source maps ကို ပိတ်ခြင်း (Disable Source Maps)

Source maps တွေ ထုတ်လုပ်တာက build process အတွင်း memory အပိုစားပါတယ်။

သင့် Next.js configuration ထဲမှာ `productionBrowserSourceMaps: false` နဲ့ `experimental.serverSourceMaps: false` ဆိုပြီး ထည့်ခြင်းဖြင့် — source map ထုတ်လုပ်မှုကို ပိတ်နိုင်ပါတယ်။

Next.js က `next build` ရဲ့ prerender အဆင့်အတွင်းမှာ source maps တွေကို default အနေနဲ့ သုံးပါတယ်။ "Generating static pages" ပြီးနောက် ဖြစ်ပေါ်တဲ့ ဒီအဆင့်အတွင်းမှာ memory ပြဿနာတွေ အဆက်မပြတ် ကြုံနေရတယ်ဆိုရင် — သင့် Next.js configuration ထဲမှာ `enablePrerenderSourceMaps: false` ဆိုပြီး ထည့်ကာ ဒီအဆင့်အတွင်း source maps တွေကို ပိတ်ကြည့်နိုင်ပါတယ်။

> **သိထားသင့်သည်:** Plugin အချို့က source maps တွေကို ဖွင့်ပေးနိုင်ပြီး — ပိတ်ဖို့အတွက် custom configuration လိုအပ်နိုင်ပါတယ်။

## Edge runtime ရဲ့ memory ပြဿနာများ (Edge Memory Issues)

Next.js `v14.1.3` က Edge runtime သုံးတဲ့အခါ ဖြစ်ပွားခဲ့တဲ့ memory issue တစ်ခုကို ပြင်ဆင်ပေးခဲ့ပါတယ်။ ဒီ version (သို့) နောက်ပိုင်း version တစ်ခုကို update လုပ်ပြီး — သင့်ပြဿနာကို ဖြေရှင်းပေးမလားဆိုတာ ကြည့်ရှုပါ။

## Preloading Entries (entries များကို ကြိုတင် load လုပ်ခြင်း)

Next.js server စတင်တဲ့အခါ — page တစ်ခုချင်းစီရဲ့ JavaScript modules တွေကို request time အထိ စောင့်နေမယ့်အစား — memory ထဲကို ကြိုတင် load (preload) လုပ်ပါတယ်။

ဒီ optimization က ကနဦး memory footprint ပိုကြီးတာနဲ့ လဲလှယ်ပြီး — response time တွေကို ပိုမို မြန်ဆန်စေပါတယ်။

ဒီ optimization ကို ပိတ်ချင်ရင် — `experimental.preloadEntriesOnStart` flag ကို `false` လို့ သတ်မှတ်ပါ။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const config: NextConfig = {
  experimental: {
    preloadEntriesOnStart: false,
  },
}

export default config
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    preloadEntriesOnStart: false,
  },
}

export default config
```

Next.js က ဒီ JavaScript modules တွေကို unload မလုပ်ပါဘူး — ဆိုလိုတာက ဒီ optimization ကို ပိတ်ထားရင်တောင် — pages အားလုံးကို နောက်ဆုံးမှာ request လုပ်ဖြစ်မယ်ဆိုရင် — သင့် Next.js server ရဲ့ memory footprint က နောက်ဆုံးမှာ အတူတူပဲ ဖြစ်သွားပါလိမ့်မယ်။
