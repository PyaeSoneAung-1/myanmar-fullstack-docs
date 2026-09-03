---
title: "Version 14 သို့ ပြောင်းရွှေ့ခြင်း (How to upgrade to version 14)"
description: "သင့် Next.js application ကို Version 13 ကနေ 14 ဆီ upgrade လုပ်နည်း — package manager အလိုက် install commands, TypeScript types upgrade, v14 အကျဉ်းချုပ် (Node.js minimum version, next export → output: 'export', ImageResponse → next/og, @next/font → next/font, next-swc WASM target ဖယ်ရှားခြင်း)"
order: 237
source: "https://nextjs.org/docs/app/guides/upgrading/version-14"
status: translated
updated: 2026-09-03
---

## Version 13 ကနေ 14 သို့ upgrade လုပ်ခြင်း (Upgrading from 13 to 14)

Next.js version 14 ဆီ update လုပ်ဖို့ — သင့်ကြိုက်နှစ်သက်ရာ package manager ကို သုံးပြီး အောက်ပါ command ကို run လုပ်ပါ:

```bash filename="Terminal"
npm i next@next-14 react@18 react-dom@18 && npm i eslint-config-next@next-14 -D
```

```bash filename="Terminal"
yarn add next@next-14 react@18 react-dom@18 && yarn add eslint-config-next@next-14 -D
```

```bash filename="Terminal"
pnpm i next@next-14 react@18 react-dom@18 && pnpm i eslint-config-next@next-14 -D
```

```bash filename="Terminal"
bun add next@next-14 react@18 react-dom@18 && bun add eslint-config-next@next-14 -D
```

> **သိထားသင့်သည်:** TypeScript သုံးနေတယ်ဆိုရင် — `@types/react` နဲ့ `@types/react-dom` တွေကိုပါ ၎င်းတို့ရဲ့ နောက်ဆုံး versions တွေဆီ upgrade လုပ်ထားကြောင်း သေချာပါစေ။

### v14 အကျဉ်းချုပ် (v14 Summary)

- Node.js ရဲ့ အနည်းဆုံး version ကို 16.14 ကနေ 18.17 ဆီ မြှင့်တင်လိုက်ပါတယ် — 16.x က end-of-life (ပံ့ပိုးမှု ကုန်ဆုံး) ဖြစ်သွားလို့ပါ။
- `next export` command ကို ဖယ်ရှားပြီး — `output: 'export'` config ကို သုံးစေပါတယ်။ အသေးစိတ်အတွက် [docs](/docs/nextjs/static-exports) ကို ကြည့်ပါ။
- `ImageResponse` အတွက် `next/server` import ကို `next/og` လို့ အမည်ပြောင်းလိုက်ပါတယ်။ Imports တွေကို လုံခြုံစွာ အလိုအလျောက် အမည်ပြောင်းပေးဖို့ [codemod တစ်ခု ရနိုင်ပါတယ်](/docs/nextjs/upgrading-codemods)။
- `@next/font` package ကို လုံးဝ ဖယ်ရှားပြီး — built-in `next/font` ကို သုံးစေပါတယ်။ Imports တွေကို လုံခြုံစွာ အလိုအလျောက် အမည်ပြောင်းပေးဖို့ [codemod တစ်ခု ရနိုင်ပါတယ်](/docs/nextjs/upgrading-codemods)။
- `next-swc` အတွက် WASM target ကို ဖယ်ရှားလိုက်ပါတယ်။
