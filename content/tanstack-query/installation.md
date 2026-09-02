---
title: "Installation (တပ်ဆင်ခြင်း)"
description: "React Query ကို ဘယ်လို install လုပ်မလဲ — NPM/pnpm/yarn/bun/deno, CDN (ESM.sh) ကနေ script tag နဲ့ သုံးနည်း, browser လိုအပ်ချက်များ, ESLint Plugin Query အကြံပြုချက်"
order: 61
source: "https://tanstack.com/query/latest/docs/framework/react/installation"
status: translated
updated: 2026-09-02
---

React Query ကို [NPM](https://npmjs.com/) ကနေ ဒါမှမဟုတ် — [ESM.sh](https://esm.sh/) ကနေ `<script>` tag ကောင်းကောင်းတစ်ခုနဲ့ တပ်ဆင်နိုင်ပါတယ်။

## NPM ဖြင့် တပ်ဆင်ခြင်း

```bash
npm i @tanstack/react-query
```

သို့မဟုတ်

```bash
pnpm add @tanstack/react-query
```

သို့မဟုတ်

```bash
yarn add @tanstack/react-query
```

သို့မဟုတ်

```bash
bun add @tanstack/react-query
```

သို့မဟုတ်

```bash
deno add @tanstack/react-query
```

React Query က React v18+ နဲ့ compatible ဖြစ်ပြီး — ReactDOM ရော React Native မှာပါ အလုပ်လုပ်ပါတယ်။

> Download မလုပ်ခင် အရင်စမ်းကြည့်ချင်လား? [simple](https://tanstack.com/query/latest/docs/framework/react/examples/simple) ဒါမှမဟုတ် [basic](https://tanstack.com/query/latest/docs/framework/react/examples/basic) ဥပမာတွေကို စမ်းကြည့်လိုက်ပါ!

## CDN (ESM.sh) ဖြင့်

Module bundler ဒါမှမဟုတ် package manager မသုံးဘူးဆိုရင် — ESM-compatible CDN တစ်ခု (ဥပမာ [ESM.sh](https://esm.sh/)) ကနေလည်း ဒီ library ကို သုံးနိုင်ပါတယ်။ သင့် HTML file ရဲ့ အောက်ဆုံးမှာ `<script type="module">` tag တစ်ခု ထည့်ရုံပါပဲ:

```html
<script type="module">
  import React from 'https://esm.sh/react@18.2.0'
  import ReactDOM from 'https://esm.sh/react-dom@18.2.0'
  import { QueryClient } from 'https://esm.sh/@tanstack/react-query'
</script>
```

> JSX မသုံးဘဲ React ကို ဘယ်လို သုံးမလဲဆိုတဲ့ ညွှန်ကြားချက်တွေကို [ဒီမှာ](https://react.dev/reference/react/createElement#creating-an-element-without-jsx) တွေ့နိုင်ပါတယ်။

## Requirements (လိုအပ်ချက်များ)

React Query က modern browsers တွေအတွက် optimize လုပ်ထားပါတယ်။ အောက်ပါ browser config နဲ့ compatible ဖြစ်ပါတယ်:

```
Chrome >= 91
Firefox >= 90
Edge >= 91
Safari >= 15
iOS >= 15
Opera >= 77
```

> သင့် environment ပေါ် မူတည်ပြီး — polyfills ထည့်ဖို့ လိုနိုင်ပါတယ်။ ပိုဟောင်းတဲ့ browsers တွေကို support လုပ်ချင်ရင် — library ကို `node_modules` ကနေ ကိုယ်တိုင် transpile လုပ်ဖို့ လိုပါတယ်။

## Recommendations (အကြံပြုချက်များ)

Code ရေးနေစဉ်မှာ bugs နဲ့ inconsistencies တွေကို ဖမ်းမိစေဖို့ — ကျွန်ုပ်တို့ရဲ့ [ESLint Plugin Query](https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query) ကိုပါ သုံးဖို့ အကြံပြုပါတယ်။ ဒါကို install လုပ်ဖို့:

```bash
npm i -D @tanstack/eslint-plugin-query
```

သို့မဟုတ်

```bash
pnpm add -D @tanstack/eslint-plugin-query
```

သို့မဟုတ်

```bash
yarn add -D @tanstack/eslint-plugin-query
```

သို့မဟုတ်

```bash
bun add -D @tanstack/eslint-plugin-query
```
