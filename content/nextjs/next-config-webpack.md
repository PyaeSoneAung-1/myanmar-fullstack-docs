---
title: "webpack (Custom Webpack Config)"
description: "webpack option — Next.js သုံးသည့် webpack config ကို ချဲ့ထွင်ရန် custom function သတ်မှတ်ချက်; buildId, dev, isServer, nextRuntime, defaultLoaders arguments များ"
order: 97
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/webpack"
status: translated
updated: 2026-09-02
---

> **သိထားသင့်သည်:** webpack config ရဲ့ အပြောင်းအလဲတွေကို semver နဲ့ မဖုံးအုပ်ထားပါဘူး — ဒါကြောင့် ကိုယ့်ဘာသာ သုံးရင် ကိုယ့်တာဝန်ပါ။

သင့် application ဆီ custom webpack configuration တွေ မထည့်ခင် — သင့် use-case ကို Next.js က ပြီးသား မပံ့ပိုးထားဘူးဆိုတာ သေချာအောင် ဦးစွာ စစ်ဆေးပါ:

- [CSS imports](/docs/nextjs/css)
- [CSS modules](/docs/nextjs/css#css-modules)
- [Sass/SCSS imports](https://nextjs.org/docs/app/guides/sass)
- [Sass/SCSS modules](https://nextjs.org/docs/app/guides/sass)

တောင်းဆိုလေ့ရှိတဲ့ feature တချို့ကို plugins တွေအနေနဲ့ ရနိုင်ပါတယ်:

- [@next/mdx](https://github.com/vercel/next.js/tree/canary/packages/next-mdx)
- [@next/bundle-analyzer](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer)

webpack အသုံးပြုမှုကို ချဲ့ထွင်ဖို့ — `next.config.js` ထဲမှာ config ကို ချဲ့ထွင်တဲ့ function တစ်ခုကို အောက်ပါအတိုင်း သတ်မှတ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    return config
  },
}
```

> `webpack` function ကို သုံးကြိမ် execute လုပ်ပါတယ် — server အတွက် နှစ်ကြိမ် (nodejs / edge runtime) နဲ့ client အတွက် တစ်ကြိမ်ပါ။ ဒါက `isServer` property ကို သုံးပြီး client နဲ့ server configuration တွေကို ခွဲခြားနိုင်စေပါတယ်။

`webpack` function ရဲ့ ဒုတိယ argument က အောက်ပါ properties တွေ ပါတဲ့ object တစ်ခုပါ:

- `buildId`: `String` — Build id ဖြစ်ပြီး builds တွေကြားမှာ unique identifier အဖြစ် သုံးပါတယ်။
- `dev`: `Boolean` — Compilation ကို development မှာ လုပ်မလား ဆိုတာ ညွှန်ပြပါတယ်။
- `isServer`: `Boolean` — Server-side compilation အတွက် `true` ဖြစ်ပြီး client-side compilation အတွက် `false` ပါ။
- `nextRuntime`: `String | undefined` — Server-side compilation ရဲ့ target runtime — `"edge"` (သို့) `"nodejs"` ဖြစ်ပြီး client-side compilation အတွက် `undefined` ပါ။
- `defaultLoaders`: `Object` — Next.js က အတွင်းပိုင်းမှာ သုံးတဲ့ default loaders တွေပါ:
  - `babel`: `Object` — Default `babel-loader` configuration ပါ။

`defaultLoaders.babel` ကို သုံးတဲ့ ဥပမာ:

```js
// Example config for adding a loader that depends on babel-loader
// This source was taken from the @next/mdx plugin source:
// https://github.com/vercel/next.js/tree/canary/packages/next-mdx
module.exports = {
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.mdx/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: pluginOptions.options,
        },
      ],
    })

    return config
  },
}
```

#### `nextRuntime`

`nextRuntime` က `"edge"` (သို့) `"nodejs"` ဖြစ်တဲ့အခါ `isServer` က `true` ဖြစ်တာ သတိပြုပါ — `nextRuntime` `"edge"` က လက်ရှိမှာ proxy နဲ့ edge runtime ထဲက Server Components တွေအတွက်ပဲ ဖြစ်ပါတယ်။
