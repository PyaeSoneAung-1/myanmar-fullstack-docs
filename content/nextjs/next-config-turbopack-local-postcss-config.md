---
title: "turbopackLocalPostcssConfig (local PostCSS config)"
description: "turbopackLocalPostcssConfig option — Turbopack မှ `postcss.config.js` ဖြေရှင်းသည့် အစဉ်ကို ပြောင်းလဲပေးသော experimental သတ်မှတ်ချက်; CSS file ၏ directory ရှိ config ကို project root config ထက် ဦးစားပေးစေနိုင်"
order: 199
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackLocalPostcssConfig"
status: translated
updated: 2026-09-03
---

`turbopackLocalPostcssConfig` option က Turbopack က `postcss.config.js` files တွေကို ဘယ်လို ဖြေရှင်း (resolve) လဲ ဆိုတာကို ပြောင်းလဲပေးပါတယ်။ ဖွင့်ထားတဲ့အခါ — Turbopack က CSS file ရဲ့ ကိုယ်ပိုင် directory ကနေ စတင်ပြီး config ကို ရှာဖွေကာ — မတွေ့ရင် project root ဆီ ပြန်ဆုတ်ကြည့်ပါတယ်။ Default အားဖြင့်တော့ Turbopack က project root ကို အရင်စစ်လို့ — root အဆင့်က `postcss.config.js` က subdirectories တွေထဲက configs တွေထက် အမြဲတမ်း ဦးစားပေး (precedence) ခံရပါတယ်။

ဒီ option က Turbopack (`next dev` (သို့) `next build`) သုံးနေတဲ့အခါမှပဲ သက်ဆိုင်ပါတယ်။

## အသုံးပြုပုံ (Usage)

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackLocalPostcssConfig: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackLocalPostcssConfig: true,
  },
}

module.exports = nextConfig
```

## အပြုအမူ (Behavior)

| Setting           | Config ဖြေရှင်းသည့် အစဉ် (Config resolution order) |
| ----------------- | ---------------------------------------- |
| `false` (default) | Project root → CSS file ၏ directory       |
| `true`            | CSS file ၏ directory → project root       |

Default အပြုအမူနဲ့ဆိုရင် — project root က `postcss.config.js` ကို CSS files အားလုံးအတွက် သုံးပြီး — root config မရှိမှသာ per-directory configs တွေကို အသုံးပြုပါတယ်။ `turbopackLocalPostcssConfig` ကို ဖွင့်လိုက်ရင် ဒါက ပြောင်းပြန် ဖြစ်သွားပါတယ်: per-directory configs တွေက ဦးစားပေး ခံရပြီး — root config က fallback အဖြစ် ဆောင်ရွက်ပါတယ်။

## ဥပမာ (Example)

Apps အများအပြားပါတဲ့ monorepo (သို့) design system packages တွေလိုမျိုး — directory အသီးသီးမှာ မတူညီတဲ့ PostCSS transforms တွေ လိုအပ်တဲ့ projects တွေအတွက် ဒါက အသုံးဝင်ပါတယ်:

```
my-app/
├── postcss.config.js          ← fallback (local config မတွေ့ရင် သုံးမယ့်ဟာ)
├── app/
│   └── page.module.css        ← root config ကို သုံးသည်
└── packages/
    └── ui/
        ├── postcss.config.js  ← ဒီ directory ထဲက files တွေအတွက် ဦးစားပေးသည်
        └── button.module.css  ← packages/ui/postcss.config.js ကို သုံးသည်
```

## Version History

| Version   | အပြောင်းအလဲ                             |
| --------- | ------------------------------------- |
| `v16.3.0` | `turbopackLocalPostcssConfig` မိတ်ဆက်။ |
