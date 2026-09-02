---
title: "React Compiler — Installation (တပ်ဆင်ခြင်းနှင့် ပြင်ဆင်သတ်မှတ်ခြင်း)"
description: "React Compiler ကို install လုပ်ပြီး configure လုပ်နည်း — Babel, Vite, Next.js, React Router, Webpack, Expo, Metro, Rspack, Rsbuild စတဲ့ build tools များ၊ ESLint integration နဲ့ setup စစ်ဆေးနည်း"
order: 121
source: "https://react.dev/learn/react-compiler/installation"
status: translated
updated: 2026-09-02
---

ဒီ guide က သင့် React application ထဲမှာ React Compiler ကို install လုပ်ပြီး configure လုပ်ဖို့ ကူညီပေးပါလိမ့်မယ်။

ဒီ page မှာ အောက်ပါတွေကို လေ့လာရပါမယ်:

- React Compiler ကို install လုပ်နည်း
- Build tools အမျိုးမျိုးအတွက် အခြေခံ configuration
- သင့် setup အလုပ်လုပ်နေလား စစ်ဆေးနည်း

## ကြိုတင်လိုအပ်ချက်များ (Prerequisites)

React Compiler က React 19 နဲ့ တွဲသုံးရင် အကောင်းဆုံး အလုပ်လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားပေမယ့် — React 17 နဲ့ 18 တွေကိုလည်း ပံ့ပိုးပါတယ်။ [React version compatibility](https://react.dev/reference/react-compiler/target) အကြောင်း ပိုလေ့လာပါ။

## Installation

React Compiler ကို `devDependency` တစ်ခုအနေနဲ့ install လုပ်ပါ:

```bash
npm install -D babel-plugin-react-compiler@latest
```

ဒါမှမဟုတ် Yarn နဲ့:

```bash
yarn add -D babel-plugin-react-compiler@latest
```

ဒါမှမဟုတ် pnpm နဲ့:

```bash
pnpm install -D babel-plugin-react-compiler@latest
```

## အခြေခံ Setup

React Compiler က configuration ဘာမှ မပါဘဲ default အနေနဲ့ အလုပ်လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်။ ဒါပေမယ့် — အထူး အခြေအနေတွေမှာ (ဥပမာ — React 19 အောက်က versions တွေကို target လုပ်ဖို့) configure လုပ်ဖို့ လိုအပ်ရင် — [compiler options reference](https://react.dev/reference/react-compiler/configuration) ကို ကြည့်ပါ။

Setup လုပ်ငန်းစဉ်က သင့် build tool အပေါ် မူတည်ပါတယ်။ React Compiler မှာ သင့် build pipeline နဲ့ ပေါင်းစည်းပေးတဲ့ Babel plugin တစ်ခု ပါဝင်ပါတယ်။

> **သတိပြုရန်** — React Compiler က သင့် Babel plugin pipeline ထဲမှာ **ပထမဆုံး** run ရပါမယ်။ Compiler က မှန်ကန်တဲ့ analysis အတွက် မူရင်း source information လိုအပ်လို့ — တခြား transformations တွေ မလုပ်ခင် သင့် code ကို အရင်ဆုံး process လုပ်ရပါတယ်။

### Babel

သင့် `babel.config.js` ကို ဖန်တီးပါ ဒါမှမဟုတ် update လုပ်ပါ:

```js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // must run first!
    // ... other plugins
  ],
  // ... other config
};
```

### Vite

သင်က `@vitejs/plugin-react` ရဲ့ version 6.0.0 ဒါမှမဟုတ် အထက်နဲ့ Vite ကို သုံးနေရင် — `reactCompilerPreset` ကို သုံးနိုင်ပါတယ်:

```bash
npm install -D @rolldown/plugin-babel
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()]
    }),
  ],
});
```

> **မှတ်ချက်** — `@vitejs/plugin-react@6.0.0` မှာ inline Babel option ကို ဖယ်ရှားလိုက်ပါတယ်။ သင်က အဟောင်း version တစ်ခုကို သုံးနေရင် — ဒီလို သုံးနိုင်ပါတယ်:
>
> ```js
> // vite.config.js
> import { defineConfig } from 'vite';
> import react from '@vitejs/plugin-react';
>
> export default defineConfig({
>   plugins: [
>     react({
>       babel: {
>         plugins: ['babel-plugin-react-compiler'],
>       },
>     }),
>   ],
> });
> ```

တစ်နည်းအားဖြင့် — Babel plugin ကို `@rolldown/plugin-babel` နဲ့ တိုက်ရိုက် သုံးနိုင်ပါတယ်:

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    babel({
      plugins: ['babel-plugin-react-compiler'],
    }),
  ],
});
```

### Next.js

ပိုပြီး အသေးစိတ် သိရဖို့ [Next.js docs](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) ကို ကြည့်ပါ။

### React Router

`vite-plugin-babel` ကို install လုပ်ပြီး — compiler ရဲ့ Babel plugin ကို အဲဒီထဲ ထည့်ပါ:

```bash
npm install vite-plugin-babel
```

```js
// vite.config.js
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // if you use TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack

Community webpack loader တစ်ခုကို [ဒီမှာ ရနိုင်ပါပြီ](https://github.com/SukkaW/react-compiler-webpack)။

### Expo

Expo apps တွေမှာ React Compiler ကို enable လုပ်ပြီး သုံးဖို့ [Expo ရဲ့ docs](https://docs.expo.dev/guides/react-compiler/) ကို ကြည့်ပါ။

### Metro (React Native)

React Native က Babel ကို Metro ကနေ သုံးပါတယ် — ဒါကြောင့် installation instructions တွေအတွက် [Usage with Babel](#babel) section ကို ကြည့်ပါ။

### Rspack

Rspack apps တွေမှာ React Compiler ကို enable လုပ်ပြီး သုံးဖို့ [Rspack ရဲ့ docs](https://rspack.dev/guide/tech/react#react-compiler) ကို ကြည့်ပါ။

### Rsbuild

Rsbuild apps တွေမှာ React Compiler ကို enable လုပ်ပြီး သုံးဖို့ [Rsbuild ရဲ့ docs](https://rsbuild.dev/guide/framework/react#react-compiler) ကို ကြည့်ပါ။

## ESLint Integration

React Compiler မှာ — optimize လုပ်လို့မရတဲ့ code တွေကို ခွဲခြားသိရှိစေဖို့ ကူညီတဲ့ ESLint rule တစ်ခု ပါဝင်ပါတယ်။ ESLint rule က error တစ်ခု သတင်းပို့တဲ့အခါ — compiler က အဲဒီ component ဒါမှမဟုတ် hook တစ်ခုချင်းအလိုက်ကို optimize လုပ်တာ ကျော်သွားမယ်လို့ ဆိုလိုပါတယ်။ ဒါက ဘေးကင်းပါတယ် — compiler က သင့် codebase ရဲ့ တခြား အစိတ်အပိုင်းတွေကို optimize လုပ်နေဦးမှာ ဖြစ်လို့ပါ။ Violations တွေ အားလုံးကို ချက်ချင်း ပြင်စရာ မလိုပါဘူး။ သင့်အရှိန်နဲ့သင် ဖြေရှင်းသွားပြီး — optimize လုပ်ထားတဲ့ components အရေအတွက်ကို တဖြည်းဖြည်း မြှင့်တင်နိုင်ပါတယ်။

ESLint plugin ကို install လုပ်ပါ:

```bash
npm install -D eslint-plugin-react-hooks@latest
```

သင်က eslint-plugin-react-hooks ကို မသတ်မှတ်ရသေးရင် — [readme ထဲက installation instructions](https://github.com/react/react/blob/main/packages/eslint-plugin-react-hooks/README.md#installation) တွေကို လိုက်နာပါ။ Compiler rules တွေကို `recommended-latest` preset ထဲမှာ ရနိုင်ပါတယ်။

ESLint rule က အောက်ပါတွေကို လုပ်ပေးပါလိမ့်မယ်:

- [Rules of React](https://react.dev/reference/rules) တွေကို ချိုးဖောက်မှုတွေကို ခွဲခြားသိရှိခြင်း
- ဘယ် components တွေ optimize လုပ်လို့မရလဲ ပြသခြင်း
- ပြဿနာတွေ ပြင်ဆင်ဖို့ အထောက်အကူဖြစ်တဲ့ error messages တွေ ပေးခြင်း

## သင့် Setup ကို စစ်ဆေးခြင်း (Verify Your Setup)

Installation ပြီးရင် — React Compiler မှန်ကန်စွာ အလုပ်လုပ်နေလား စစ်ဆေးပါ။

### React DevTools ကို စစ်ဆေးခြင်း

React Compiler နဲ့ optimize လုပ်ထားတဲ့ components တွေက React DevTools ထဲမှာ "Memo ✨" badge ပြပါလိမ့်မယ်:

1. [React Developer Tools](/docs/react/react-developer-tools) browser extension ကို install လုပ်ပါ
2. သင့် app ကို development mode မှာ ဖွင့်ပါ
3. React DevTools ကို ဖွင့်ပါ
4. Component နာမည်တွေဘေးမှာ ✨ emoji ကို ရှာပါ

Compiler အလုပ်လုပ်နေရင်:

- Components တွေက React DevTools ထဲမှာ "Memo ✨" badge ပြပါလိမ့်မယ်
- စျေးကြီးတဲ့ တွက်ချက်မှုတွေက အလိုအလျောက် memoize လုပ်ခံရပါလိမ့်မယ်
- Manual `useMemo` မလိုအပ်တော့ပါဘူး

### Build Output ကို စစ်ဆေးခြင်း

သင့် build output ကို ကြည့်ပြီးလည်း compiler run နေလား စစ်ဆေးနိုင်ပါတယ်။ Compiled code ထဲမှာ compiler က အလိုအလျောက် ထည့်ပေးတဲ့ automatic memoization logic ပါဝင်ပါလိမ့်မယ်။

```js
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```

## Troubleshooting

### Component တစ်ခုချင်းစီကို opt out လုပ်ခြင်း

Component တစ်ခုက compilation ပြီးနောက် ပြဿနာတွေ ဖြစ်စေနေရင် — `"use no memo"` directive ကို သုံးပြီး ခဏတာ opt out လုပ်နိုင်ပါတယ်:

```js
function ProblematicComponent() {
  "use no memo";
  // Component code here
}
```

ဒါက compiler ကို ဒီ component တစ်ခုချင်းအလိုက်အတွက် optimization ကျော်သွားဖို့ ပြောပါတယ်။ သင်က နောက်ခံပြဿနာကို ဖြေရှင်းပြီး — ပြီးတာနဲ့ directive ကို ဖယ်ရှားသင့်ပါတယ်။

နောက်ထပ် troubleshooting အကူအညီတွေအတွက် — [debugging guide](/docs/react/react-compiler-debugging) ကို ကြည့်ပါ။

## နောက်အဆင့်များ (Next Steps)

အခု React Compiler ကို install လုပ်ပြီးပြီဆိုတော့ — နောက်ထပ် ဒီအကြောင်းတွေ လေ့လာပါ:

- React 17 နဲ့ 18 တွေအတွက် [React version compatibility](https://react.dev/reference/react-compiler/target)
- Compiler ကို customize လုပ်ဖို့ [Configuration options](https://react.dev/reference/react-compiler/configuration)
- ရှိပြီးသား codebases တွေအတွက် [incremental adoption strategies](/docs/react/react-compiler-incremental-adoption)
- Troubleshooting ပြဿနာတွေအတွက် [debugging techniques](/docs/react/react-compiler-debugging)
- သင့် React library compile လုပ်ဖို့ [Compiling Libraries guide](https://react.dev/reference/react-compiler/compiling-libraries)
