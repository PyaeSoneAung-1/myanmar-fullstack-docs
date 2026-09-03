---
title: "turbopackRustReactCompiler (Rust React Compiler အသုံးပြုမှု)"
description: "turbopackRustReactCompiler option — React Compiler ၏ native Rust version ကို Babel transform အစား Turbopack အတွင်း native code အဖြစ် run ရန် experimental သတ်မှတ်ချက်; `reactCompiler` ဖွင့်ထားရန် လို၍ Turbopack တွင်သာ အလုပ်လုပ်"
order: 197
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackRustReactCompiler"
status: translated
updated: 2026-09-03
---

`experimental.turbopackRustReactCompiler` option က [React Compiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler) ရဲ့ native Rust version ကို ဖွင့်ပေးပါတယ်။ ဒါက standard Babel version မှာ Node.js ကတစ်ဆင့် လုပ်ဆောင်သလိုမဟုတ်ဘဲ — native code အနေနဲ့ Turbopack ထဲမှာ တိုက်ရိုက် run စေပါတယ်။ ဒါကြောင့် သိသာတဲ့ performance တိုးတက်မှု တစ်ခုကို ရရှိစေတတ်ပါတယ်။

ဒီ option ကို default မဖြစ်လာခင် feedback တွေ စုဆောင်းနိုင်ဖို့ experimental အဖြစ် ထုတ်ဝေထားပါတယ်။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React Compiler ကို ဖွင့်ပါ
  reactCompiler: true,
  experimental: {
    // Babel transform အစား Rust port ကို သုံးပါ
    turbopackRustReactCompiler: true,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Compiler ကို ဖွင့်ပါ
  reactCompiler: true,
  experimental: {
    // Babel transform အစား Rust port ကို သုံးပါ
    turbopackRustReactCompiler: true,
  },
}

module.exports = nextConfig
```

## သိထားသင့်သည် (Good to know)

> - ဒီ option က [`reactCompiler`](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler) ဖွင့်ထားဖို့ လိုအပ်ပါတယ်။ ဒါက ဘယ် implementation ကို run မလဲ ရွေးချယ်ပေးရုံပဲ ဖြစ်ပြီး — compiler ကို သူ့ဘာသာ ဖွင့်ပေးတာ မဟုတ်ပါဘူး။
> - ဒီ option က Turbopack နဲ့မှပဲ အလုပ်လုပ်ပါတယ်။ Webpack နဲ့ တွဲသုံးရင် error ပစ်ပါလိမ့်မယ်။
> - ဖွင့်ထားတဲ့အခါ — `babel-plugin-react-compiler` ကို install လုပ်စရာ မလိုပါဘူး။ Rust compiler က Turbopack ထဲမှာ natively run လုပ်ပါတယ်။

Compiler ကို ဘယ်လို သုံးရမလဲဆိုတဲ့ အသေးစိတ်အတွက် — [`reactCompiler` option documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler) ကို ကြည့်ပါ။

## Version History

| Version   | အပြောင်းအလဲ                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------ |
| `v16.3.0` | Native Rust React Compiler အတွက် experimental `turbopackRustReactCompiler` option ကို မိတ်ဆက်။         |
