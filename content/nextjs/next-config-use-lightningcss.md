---
title: "useLightningcss (Lightning CSS သုံးရန် သတ်မှတ်ချက်)"
description: "experimental.useLightningcss option — webpack ဖြင့် Lightning CSS (Rust-based မြန်ဆန်သော CSS transformer/minifier) သုံးရန်; lightningCssFeatures (include/exclude) ဖြင့် transpile လုပ်မည့် features များကို override နိုင်; Turbopack တွင် အကျိုးသက်ရောက်မှု မရှိ"
order: 215
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/useLightningcss"
status: translated
updated: 2026-09-03
---

webpack နဲ့တွဲပြီး [Lightning CSS](https://lightningcss.dev) သုံးဖို့ experimental ပံ့ပိုးမှုပါ။ Lightning CSS က Rust နဲ့ ရေးထားတဲ့ မြန်ဆန်တဲ့ CSS transformer နဲ့ minifier တစ်ခုပါ။

ဒီ option ကို မသတ်မှတ်ထားရင် — webpack ပေါ်က Next.js က default အနေနဲ့ [PostCSS](https://postcss.org/) ကို [`postcss-preset-env`](https://www.npmjs.com/package/postcss-preset-env) နဲ့တွဲ သုံးပါတယ်။

Turbopack ကတော့ Next 14.2 ကစပြီး Lightning CSS ကို default အနေနဲ့ သုံးပါတယ်။ ဒီ configuration option က Turbopack အပေါ် သက်ရောက်မှု မရှိပါဘူး။ Turbopack က Lightning CSS ကိုပဲ အမြဲ သုံးပါတယ်။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useLightningcss: false, // default — Turbopack မှာ ignored ဖြစ်သည်
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useLightningcss: true, // webpack မှာ PostCSS ကို ပိတ်သည်
  },
}

module.exports = nextConfig
```

## lightningCssFeatures

Default အားဖြင့် Lightning CSS က ဘယ် CSS features တွေကို transpile လုပ်မလဲဆိုတာကို သင့် [browserslist](https://browsersl.ist/) targets တွေအပေါ် မူတည်ပြီး ဆုံးဖြတ်ပါတယ်။ `lightningCssFeatures` option က — browser support ဘယ်လိုပဲ ရှိရှိ သီးခြား features တွေကို အမြဲ transpile လုပ်ဖို့ (`include`) (သို့) ဘယ်တော့မှ transpile မလုပ်ဖို့ (`exclude`) အတင်းသတ်မှတ်ပြီး ဒါကို override လုပ်ခွင့် ပေးပါတယ်။

ဒါက webpack (`useLightningcss` ဖွင့်ထားတဲ့အခါ) ရော Turbopack ရော နှစ်ခုလုံးမှာ သက်ရောက်ပါတယ်။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useLightningcss: true,
    lightningCssFeatures: {
      // Targets တွေက ပံ့ပိုးထားရင်တောင် ဒီ features တွေကို အမြဲ transpile လုပ်မယ်
      include: ['light-dark', 'oklab-colors'],
      // Targets တွေက မပံ့ပိုးထားရင်တောင် ဒီ features တွေကို ဘယ်တော့မှ transpile မလုပ်ဘူး
      exclude: ['nesting'],
    },
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useLightningcss: true,
    lightningCssFeatures: {
      // Targets တွေက ပံ့ပိုးထားရင်တောင် ဒီ features တွေကို အမြဲ transpile လုပ်မယ်
      include: ['light-dark', 'oklab-colors'],
      // Targets တွေက မပံ့ပိုးထားရင်တောင် ဒီ features တွေကို ဘယ်တော့မှ transpile မလုပ်ဘူး
      exclude: ['nesting'],
    },
  },
}

module.exports = nextConfig
```

### Options

| Option    | Type       | Description                                                          |
| --------- | ---------- | -------------------------------------------------------------------- |
| `include` | `string[]` | Browser targets တွေ ဘယ်လိုပဲ ဖြစ်နေနေ — အမြဲ transpile လုပ်ရမယ့် features တွေ။ |
| `exclude` | `string[]` | Browser targets တွေက လိုအပ်နေရင်တောင် — ဘယ်တော့မှ transpile မလုပ်ရမယ့် features တွေ။ |

### Available features (ရရှိနိုင်သော features)

တစ်ခုချင်းစီ features (Individual features):

| Feature name                        | Description                                                |
| ----------------------------------- | ---------------------------------------------------------- |
| `nesting`                           | [CSS Nesting](https://drafts.csswg.org/css-nesting/)       |
| `not-selector-list`                 | Selectors အများအပြား ပါဝင်တဲ့ `:not`                    |
| `dir-selector`                      | `:dir()` selector                                          |
| `lang-selector-list`                | ဘာသာစကား အများအပြား ပါဝင်တဲ့ `:lang()`                 |
| `is-selector`                       | `:is()` selector                                           |
| `text-decoration-thickness-percent` | `text-decoration-thickness` ထဲမှာ percentage တန်ဖိုးများ |
| `media-interval-syntax`             | Media query range interval syntax                          |
| `media-range-syntax`                | Media query range syntax (`width >= 600px`)                |
| `custom-media-queries`              | `@custom-media` rules                                      |
| `clamp-function`                    | `clamp()` function                                         |
| `color-function`                    | `color()` function                                         |
| `oklab-colors`                      | `oklab()` နဲ့ `oklch()` colors                             |
| `lab-colors`                        | `lab()` နဲ့ `lch()` colors                                 |
| `p3-colors`                         | Display P3 colors                                          |
| `hex-alpha-colors`                  | Alpha ပါတဲ့ 4 နဲ့ 8 လုံး hex colors                       |
| `space-separated-color-notation`    | Space-separated color notation (`rgb(0 0 0)`)              |
| `font-family-system-ui`             | `system-ui` font family                                    |
| `double-position-gradients`         | Double-position gradient stops                             |
| `vendor-prefixes`                   | Vendor-prefixed properties နဲ့ values တွေ                |
| `logical-properties`                | Logical properties နဲ့ values တွေ                       |
| `light-dark`                        | `light-dark()` color function                              |

ပေါင်းစည်းထားသော groups (Composite groups) — features အများအပြားကို တစ်ပြိုင်နက် ဖွင့်ဖို့ အတိုကောက် နည်းလမ်းများ:

| Group name      | Includes (ပါဝင်သော features)                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| `selectors`     | `nesting`, `not-selector-list`, `dir-selector`, `lang-selector-list`, `is-selector`                             |
| `media-queries` | `media-interval-syntax`, `media-range-syntax`, `custom-media-queries`                                           |
| `colors`        | `color-function`, `oklab-colors`, `lab-colors`, `p3-colors`, `hex-alpha-colors`, `space-separated-color-notation`, `light-dark` |

## Version History

| Version  | Changes                                                                                                                                              |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `16.2.0` | `lightningCssFeatures` ကို ထည့်သွင်းခဲ့သည်။                                                                                                         |
| `15.1.0` | Turbopack ကနေ `useSwcCss` အတွက် ပံ့ပိုးမှု ဖယ်ရှားခဲ့သည်။                                                                                          |
| `14.2.0` | Turbopack ရဲ့ default CSS processor ကို `@swc/css` ကနေ Lightning CSS အဖြစ် ပြောင်းခဲ့သည်။ `useLightningcss` က Turbopack မှာ ignored ဖြစ်လာပြီး — legacy `experimental.turbo.useSwcCss` option တစ်ခု ထည့်သွင်းခဲ့သည်။ |
