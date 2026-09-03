---
title: "useTypeScriptCli (TypeScript CLI checker အသုံးပြုမှု)"
description: "useTypeScriptCli option — production builds အတွင်း type checking လုပ်ရန် project-local TypeScript CLI (`tsc`) ကို TypeScript JavaScript compiler API အစား သုံးစေသည့် experimental သတ်မှတ်ချက်; default ဖွင့်ထားပြီး TypeScript 6/7 ကို ထောက်ပံ့"
order: 200
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/useTypeScriptCli"
status: translated
updated: 2026-09-03
---

Default အားဖြင့် — `next build` က TypeScript JavaScript compiler API ကို load လုပ်မယ့်အစား project ထဲက local `tsc` command ကို run ပါတယ်။ ဒါက TypeScript 6 ကို ထောက်ပံ့ပေးပြီး — [TypeScript 7](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) ကိုလည်း ၎င်းရဲ့ JavaScript API မရသေးချိန်မှာ ဖွင့်ပေးနိုင်ပါတယ်။

သင့် project ထဲမှာ TypeScript 7 ကို install လုပ်ပါ:

```bash package="pnpm"
pnpm add -D typescript@^7
```

```bash package="npm"
npm install -D typescript@^7
```

```bash package="yarn"
yarn add -D typescript@^7
```

```bash package="bun"
bun add -D typescript@^7
```

CLI checker က default အားဖြင့် ဖွင့်ထားပါတယ်။ TypeScript JavaScript compiler API ကို ပြန်လည် အသုံးပြုချင်ရင်တော့ — `experimental.useTypeScriptCli` ကို `false` လို့ သတ်မှတ်ပါ:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: false,
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useTypeScriptCli: false,
  },
}

module.exports = nextConfig
```

TypeScript 7 သုံးနေတုန်း opt out လုပ်လိုက်ရင် — TypeScript JavaScript compiler API မရှိတာမို့ `next build` က ထွက်သွား (exit) ပါလိမ့်မယ်။

## အပြုအမူ (Behavior)

- Next.js က checker run လုပ်ခင် `next-env.d.ts` နဲ့ route types တွေကို ဆက်လက် ထုတ်လုပ်ပြီး — ၎င်းရဲ့ အကြံပြုထားတဲ့ `tsconfig` settings တွေကိုလည်း ဆက်လက် အသုံးပြုပါတယ်။
- TypeScript diagnostics တွေကို `tsc` ကနေ တိုက်ရိုက် print လုပ်ပါတယ်။ Next.js-specific code frames တွေနဲ့ error rewriting တွေကို အသုံးမပြုပါဘူး။
- Configure လုပ်ထားတဲ့ `tsconfig` file က ရွေးချယ်ထားတဲ့ project တစ်ခုလုံးကို စစ်ဆေးပါတယ် — test files တွေနဲ့ ပါဝင်တဲ့အခါ `.next/dev/types` အပါအဝင် ဖြစ်ပါတယ်။ [`--debug-build-paths`](https://nextjs.org/docs/app/api-reference/cli/next#next-build-options) option က ဒီအစုကို ကန့်သတ်မပေးဘဲ — CLI checker နဲ့ တွဲသုံးတဲ့အခါ warning တစ်ခု ထုတ်ပေးပါတယ်။
- [`typescript.tsconfigPath`](https://nextjs.org/docs/app/api-reference/config/typescript#custom-tsconfig-path) က `tsc` ဆီ ပို့မယ့် project ကို ရွေးချယ်ပေးပါတယ်။
- [`typescript.ignoreBuildErrors`](https://nextjs.org/docs/app/api-reference/config/typescript#disabling-typescript-errors-in-production) က CLI checker အပါအဝင် type-checking အဆင့်ကို ကျော်သွားစေပါတယ်။

Next.js နဲ့အတူ [TypeScript 7 အသုံးပြုခြင်း](https://nextjs.org/docs/app/api-reference/config/typescript#using-typescript-7) အကြောင်း ပိုမို လေ့လာပါ။
