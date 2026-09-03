---
title: "exportPathMap (export လုပ်မည့် path များ သတ်မှတ်ခြင်း)"
description: "exportPathMap option — next export အတွင်း request paths များကို page destinations များနှင့် မြေပုံဆွဲရန်; next dev တွင်လည်း routes သတ်မှတ်ရန် သုံး; getStaticPaths (pages) / generateStaticParams (app) တို့ကြောင့် deprecated; page + query fields, defaultPathMap ၊ dev/dir/outDir/distDir/buildId arguments; legacy"
order: 208
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/exportPathMap"
status: translated
updated: 2026-09-03
---

> **မှတ်ချက်:** ဒီ feature က `next export` အတွက်ပဲ သီးသန့်ဖြစ်ပြီး — `pages` နဲ့ဆို `getStaticPaths`၊ `app` နဲ့ဆို `generateStaticParams` တို့ရဲ့ မျက်နှာသာရပြီး လောလောဆယ် **deprecated** (အသုံးပြုမှု ရပ်ဆိုင်းရန် စီစဉ်ထား) ဖြစ်ပါတယ်။

`exportPathMap` က export လုပ်ချိန်မှာ သုံးဖို့ request paths တွေကို page destinations တွေနဲ့ မြေပုံဆွဲပေးတဲ့ mapping တစ်ခုကို သတ်မှတ်နိုင်စေပါတယ်။ `exportPathMap` ထဲမှာ သတ်မှတ်ထားတဲ့ paths တွေကို [`next dev`](/docs/nextjs/next-cli) သုံးတဲ့အခါမှာလည်း ရနိုင်ပါမယ်။

အောက်ပါ pages တွေပါတဲ့ app တစ်ခုအတွက် custom `exportPathMap` တစ်ခု ဖန်တီးတဲ့ ဥပမာကနေ စလိုက်ရအောင်:

- `pages/index.js`
- `pages/about.js`
- `pages/post.js`

`next.config.js` ကို ဖွင့်ပြီး အောက်ပါ `exportPathMap` config ကို ထည့်ပါ:

```js filename="next.config.js"
module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
      '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
      '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
    }
  },
}
```

> **သိထားသင့်သည် (Good to know):** `exportPathMap` ထဲက `query` field ကို [automatically statically optimized pages](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization) (သို့) [`getStaticProps` pages](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props) တွေနဲ့တွဲ သုံးလို့ မရပါဘူး — သူတို့က build-time မှာ HTML files တွေအဖြစ် render လုပ်ခံရပြီး `next export` အတွင်း နောက်ထပ် query information တွေ ထည့်ပေးလို့ မရလို့ပါ။

ဥပမာ `/about` က `/about.html` ဖြစ်လာမယ့်ပုံ — pages တွေကို HTML files တွေအဖြစ် export လုပ်ပါလိမ့်မယ်။

`exportPathMap` က arguments ၂ ခု လက်ခံတဲ့ `async` function တစ်ခုပါ: ပထမတစ်ခုက `defaultPathMap` — Next.js က သုံးတဲ့ default map ပါ။ ဒုတိယ argument က အောက်ပါတို့ ပါဝင်တဲ့ object တစ်ခုပါ:

- `dev` — development မှာ `exportPathMap` ကို ခေါ်နေတဲ့အခါ `true`။ `next export` run နေတဲ့အခါ `false`။ Development မှာ `exportPathMap` ကို routes တွေ သတ်မှတ်ဖို့ သုံးပါတယ်။
- `dir` — project directory ရဲ့ absolute path
- `outDir` — `out/` directory ရဲ့ absolute path (`-o` နဲ့ configure လုပ်နိုင် — အောက်တွင် ကြည့်ပါ)။ `dev` က `true` ဆိုရင် `outDir` ရဲ့ တန်ဖိုးက `null` ဖြစ်ပါလိမ့်မယ်။
- `distDir` — `.next/` directory ရဲ့ absolute path ([`distDir`](/docs/nextjs/next-config-dist-dir) config နဲ့ configure လုပ်နိုင်)
- `buildId` — generate လုပ်ထားတဲ့ build id

Return ပြန်တဲ့ object က pages တွေရဲ့ map တစ်ခုပါ — `key` က `pathname` ဖြစ်ပြီး `value` ကတော့ အောက်ပါ fields တွေ လက်ခံတဲ့ object တစ်ခု ဖြစ်ပါတယ်:

- `page`: `String` — render လုပ်ဖို့ `pages` directory ထဲက page
- `query`: `Object` — prerendering လုပ်ချိန်မှာ `getInitialProps` ဆီ ပေးပို့တဲ့ query object။ Default က `{}`

Export လုပ်ထားတဲ့ `pathname` က filename တစ်ခုလည်း ဖြစ်နိုင်ပါတယ် (ဥပမာ — `/readme.md`)။ ဒါပေမယ့် extension က `.html` မဟုတ်ဘူးဆိုရင် — အဲဒီ content ကို serve လုပ်တဲ့အခါ `Content-Type` header ကို `text/html` အဖြစ် သတ်မှတ်ဖို့ လိုအပ်နိုင်ပါတယ်။

## Trailing slash ထည့်သွင်းခြင်း (Adding a trailing slash)

Next.js ကို pages တွေကို `index.html` files တွေအဖြစ် export ပြီး trailing slashes တွေ လိုအပ်အောင် configure လုပ်နိုင်ပါတယ် — `/about` က `/about/index.html` ဖြစ်ပြီး `/about/` ကနေ ဝင်ရောက်နိုင်ပါတယ်။ ဒါက Next.js 9 မတိုင်ခင်က default အပြုအမူပါ။

ပြန်ပြောင်းပြီး trailing slash ထည့်ချင်ရင် `next.config.js` ကို ဖွင့်ပြီး `trailingSlash` config ကို ဖွင့်ပါ:

```js filename="next.config.js"
module.exports = {
  trailingSlash: true,
}
```

## Output directory ပြောင်းလဲသတ်မှတ်ခြင်း (Customizing the output directory)

[`next export`](/docs/nextjs/static-exports) က `out` ကို default output directory အဖြစ် သုံးပါလိမ့်မယ် — အောက်ပါအတိုင်း `-o` argument သုံးပြီး customize လုပ်နိုင်ပါတယ်:

```bash filename="Terminal"
next export -o outdir
```

> **သတိပေးချက် (Warning):** `exportPathMap` သုံးတာက deprecated ဖြစ်ပြီး — `pages` ထဲက `getStaticPaths` က ဒါကို override လုပ်ပါတယ်။ နှစ်ခုကို အတူတူ သုံးဖို့ အကြံမပြုပါဘူး။
