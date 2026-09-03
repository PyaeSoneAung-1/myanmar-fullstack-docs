---
title: "ESLint Plugin (Next.js မှာ ESLint အသုံးပြုခြင်း)"
description: "Next.js ရဲ့ ESLint configuration package (eslint-config-next) — setup လုပ်နည်း, core-web-vitals နဲ့ typescript configs, rules များ, monorepo ထဲ rootDir သတ်မှတ်ခြင်း, rules disable လုပ်ခြင်း, Prettier, lint-staged နဲ့ ရှိပြီးသား config ပြောင်းရွှေ့ခြင်း အကြောင်း"
order: 244
source: "https://nextjs.org/docs/app/api-reference/config/eslint"
status: translated
updated: 2026-09-03
---

Next.js က [`eslint-config-next`](https://www.npmjs.com/package/eslint-config-next) ဆိုတဲ့ ESLint configuration package တစ်ခုကို ပေးပါတယ် — အဲဒါက သင့် application ထဲက အဖြစ်များတဲ့ ပြဿနာတွေကို ရှာဖွေဖို့ လွယ်ကူစေပါတယ်။ သူ့ထဲမှာ [`@next/eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next) plugin နဲ့အတူ — [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react) နဲ့ [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) တို့ကနေ recommended rule-sets တွေလည်း ပါဝင်ပါတယ်။

ဒီ package က main configurations နှစ်ခု ပေးပါတယ်:

- **`eslint-config-next`**: Next.js, React, React Hooks rules တွေပါတဲ့ base configuration ဖြစ်ပြီး — JavaScript ရော TypeScript files တွေကိုပါ ထောက်ပံ့ပါတယ်။
- **`eslint-config-next/core-web-vitals`**: Base config ထဲက အကုန်လုံး ပါဝင်ပြီး — [Core Web Vitals](https://web.dev/vitals/) တွေကို သက်ရောက်မှုရှိတဲ့ rules တွေကို warnings ကနေ errors အဖြစ် အဆင့်မြှင့်ပေးပါတယ်။ Project အများစုအတွက် အကြံပြုထားပါတယ်။

ဒါ့အပြင် TypeScript projects တွေအတွက်:

- **`eslint-config-next/typescript`**: [`typescript-eslint`](https://typescript-eslint.io/) ကနေ TypeScript-specific linting rules တွေ ထည့်ပေးပါတယ်။ Base (သို့) core-web-vitals config တွေနဲ့ တွဲဖက် သုံးပါ။

## ESLint setup လုပ်ခြင်း (Setup ESLint)

ESLint CLI (flat config) နဲ့ linting ကို မြန်မြန် အလုပ်ဖြစ်အောင် လုပ်နိုင်ပါတယ်:

1. ESLint နဲ့ Next.js config ကို တပ်ဆင်ပါ:

   ```bash package="pnpm"
   pnpm add -D eslint eslint-config-next
   ```

   ```bash package="npm"
   npm i -D eslint eslint-config-next
   ```

   ```bash package="yarn"
   yarn add --dev eslint eslint-config-next
   ```

   ```bash package="bun"
   bun add -d eslint eslint-config-next
   ```

2. Next.js config ပါတဲ့ `eslint.config.mjs` ကို ဖန်တီးပါ:

   ```js filename="eslint.config.mjs"
   import { defineConfig, globalIgnores } from 'eslint/config'
   import nextVitals from 'eslint-config-next/core-web-vitals'

   const eslintConfig = defineConfig([
     ...nextVitals,
     // Override default ignores of eslint-config-next.
     globalIgnores([
       // Default ignores of eslint-config-next:
       '.next/**',
       'out/**',
       'build/**',
       'next-env.d.ts',
     ]),
   ])

   export default eslintConfig
   ```

3. ESLint ကို run လုပ်ပါ:

   ```bash package="pnpm"
   pnpm exec eslint .
   ```

   ```bash package="npm"
   npx eslint .
   ```

   ```bash package="yarn"
   yarn eslint .
   ```

   ```bash package="bun"
   bunx eslint .
   ```

## ကိုးကားချက်များ (Reference)

`eslint-config-next` package ထဲမှာ အောက်ပါ ESLint plugins တွေရဲ့ `recommended` rule-sets တွေ ပါဝင်ပါတယ်:

- [`eslint-plugin-react`](https://www.npmjs.com/package/eslint-plugin-react)
- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [`@next/eslint-plugin-next`](https://www.npmjs.com/package/@next/eslint-plugin-next)

### Rules များ (Rules)

ပါဝင်တဲ့ `@next/eslint-plugin-next` rules တွေကတော့:

| Recommended config တွင် enabled | Rule                                                                                                                     | ဖော်ပြချက် (Description)                                                                                   |
| :---------------------------: | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
|             ✓                 | [@next/next/google-font-display](https://nextjs.org/docs/messages/google-font-display)                                   | Google Fonts တွေနဲ့ font-display အပြုအမူကို လိုက်နာစေပါတယ်။                                              |
|             ✓                 | [@next/next/google-font-preconnect](https://nextjs.org/docs/messages/google-font-preconnect)                             | Google Fonts တွေနဲ့ `preconnect` ကို သုံးထားကြောင်း သေချာစေပါတယ်။                                      |
|             ✓                 | [@next/next/inline-script-id](https://nextjs.org/docs/messages/inline-script-id)                                         | Inline content ပါတဲ့ `next/script` components တွေမှာ `id` attribute ကို လိုက်နာစေပါတယ်။                 |
|             ✓                 | [@next/next/next-script-for-ga](https://nextjs.org/docs/messages/next-script-for-ga)                                     | Google Analytics အတွက် inline script သုံးမယ့်အစား `next/script` component ကို ဦးစားပေး သုံးပါ။         |
|             ✓                 | [@next/next/no-assign-module-variable](https://nextjs.org/docs/messages/no-assign-module-variable)                       | `module` variable ကို ပြန်လည် သတ်မှတ်ခြင်း (assignment) မဖြစ်အောင် တားဆီးပါတယ်။                       |
|             ✓                 | [@next/next/no-async-client-component](https://nextjs.org/docs/messages/no-async-client-component)                       | Client Components တွေ async functions တွေ မဖြစ်အောင် တားဆီးပါတယ်။                                       |
|             ✓                 | [@next/next/no-before-interactive-script-outside-document](https://nextjs.org/docs/messages/no-before-interactive-script-outside-document) | `pages/_document.js` အပြင်ဘက်မှာ `next/script` ရဲ့ `beforeInteractive` strategy ကို သုံးခြင်း မဖြစ်အောင် တားဆီးပါတယ်။ |
|             ✓                 | [@next/next/no-css-tags](https://nextjs.org/docs/messages/no-css-tags)                                                   | Manual stylesheet tags တွေ မသုံးဖို့ တားဆီးပါတယ်။                                                        |
|             ✓                 | [@next/next/no-document-import-in-page](https://nextjs.org/docs/messages/no-document-import-in-page)                     | `pages/_document.js` အပြင်ဘက်မှာ `next/document` ကို import လုပ်ခြင်း မဖြစ်အောင် တားဆီးပါတယ်။          |
|             ✓                 | [@next/next/no-duplicate-head](https://nextjs.org/docs/messages/no-duplicate-head)                                       | `pages/_document.js` ထဲမှာ `<Head>` ကို ထပ်ခါထပ်ခါ သုံးခြင်း မဖြစ်အောင် တားဆီးပါတယ်။                 |
|             ✓                 | [@next/next/no-head-element](https://nextjs.org/docs/messages/no-head-element)                                           | `<head>` element သုံးခြင်း မဖြစ်အောင် တားဆီးပါတယ်။                                                      |
|             ✓                 | [@next/next/no-head-import-in-document](https://nextjs.org/docs/messages/no-head-import-in-document)                     | `pages/_document.js` ထဲမှာ `next/head` သုံးခြင်း မဖြစ်အောင် တားဆီးပါတယ်။                                 |
|             ✓                 | [@next/next/no-html-link-for-pages](https://nextjs.org/docs/messages/no-html-link-for-pages)                             | Next.js ရဲ့ internal pages တွေဆီ သွားဖို့ `<a>` elements တွေ သုံးခြင်း မဖြစ်အောင် တားဆီးပါတယ်။          |
|             ✓                 | [@next/next/no-img-element](https://nextjs.org/docs/messages/no-img-element)                                             | LCP ပိုနှေးစေပြီး bandwidth ပိုသုံးစေတာမို့ `<img>` element သုံးခြင်း မဖြစ်အောင် တားဆီးပါတယ်။            |
|             ✓                 | [@next/next/no-page-custom-font](https://nextjs.org/docs/messages/no-page-custom-font)                                   | Page တစ်ခုတည်းအတွက်ပဲ သုံးတဲ့ custom fonts တွေ မဖြစ်အောင် တားဆီးပါတယ်။                                  |
|             ✓                 | [@next/next/no-script-component-in-head](https://nextjs.org/docs/messages/no-script-component-in-head)                   | `next/head` component ထဲမှာ `next/script` သုံးခြင်း မဖြစ်အောင် တားဆီးပါတယ်။                              |
|             ✓                 | [@next/next/no-styled-jsx-in-document](https://nextjs.org/docs/messages/no-styled-jsx-in-document)                       | `pages/_document.js` ထဲမှာ `styled-jsx` သုံးခြင်း မဖြစ်အောင် တားဆီးပါတယ်။                                |
|             ✓                 | [@next/next/no-sync-scripts](https://nextjs.org/docs/messages/no-sync-scripts)                                           | Synchronous scripts တွေ မသုံးဖို့ တားဆီးပါတယ်။                                                            |
|             ✓                 | [@next/next/no-title-in-document-head](https://nextjs.org/docs/messages/no-title-in-document-head)                       | `next/document` ကနေ `Head` component နဲ့ `<title>` သုံးခြင်း မဖြစ်အောင် တားဆီးပါတယ်။                    |
|             ✓                 | @next/next/no-typos                                                                                                      | [Next.js ရဲ့ data fetching functions](https://nextjs.org/docs/pages/building-your-application/data-fetching) တွေထဲမှာ အဖြစ်များတဲ့ စာလုံးပေါင်း အမှားတွေကို တားဆီးပါတယ်။ |
|             ✓                 | [@next/next/no-unwanted-polyfillio](https://nextjs.org/docs/messages/no-unwanted-polyfillio)                             | Polyfill.io ကနေ duplicate polyfills တွေ မဖြစ်အောင် တားဆီးပါတယ်။                                          |

Development ကာလအတွင်း warnings နဲ့ errors တွေကို သင့် code editor ထဲမှာ တိုက်ရိုက် မြင်နိုင်ဖို့ — သင့်တော်တဲ့ [integration](https://eslint.org/docs/user-guide/integrations#editors) တစ်ခုကို သုံးဖို့ အကြံပြုပါတယ်။

<details>
  <summary>`next lint` ဖယ်ရှားခြင်း (`next lint` removal)</summary>

Next.js 16 ကစပြီး `next lint` ကို ဖယ်ရှားလိုက်ပါပြီ။

ဒီဖယ်ရှားမှုရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ — သင့် Next config file ထဲက `eslint` option က မလိုအပ်တော့ပဲ — ဘေးကင်းစွာ ဖယ်ရှားနိုင်ပါပြီ။

</details>

## ဥပမာများ (Examples)

### Monorepo တစ်ခုအတွင်း root directory သတ်မှတ်ခြင်း (Specifying a root directory within a monorepo)

`@next/eslint-plugin-next` ကို Next.js က root directory မှာ တပ်ဆင်မထားတဲ့ project (monorepo လို) တစ်ခုမှာ သုံးနေရင် — `eslint.config.mjs` ထဲက `settings` property ကို သုံးပြီး `@next/eslint-plugin-next` ကို သင့် Next.js application ဘယ်မှာ ရှာရမလဲ ပြောပြနိုင်ပါတယ်:

```js filename="eslint.config.mjs"
import { defineConfig } from 'eslint/config'
import eslintNextPlugin from '@next/eslint-plugin-next'

const eslintConfig = defineConfig([
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': eslintNextPlugin,
    },
    settings: {
      next: {
        rootDir: 'packages/my-app/',
      },
    },
  },
])

export default eslintConfig
```

`rootDir` က path (relative ဖြစ်ဖြစ် absolute ဖြစ်ဖြစ်)၊ glob (ဥပမာ — `"packages/*/"`) (သို့) paths နဲ့/သို့မဟုတ် globs တွေရဲ့ array တစ်ခု ဖြစ်နိုင်ပါတယ်။

### Rules များကို disable လုပ်ခြင်း (Disabling rules)

ထောက်ပံ့ထားတဲ့ plugins (`react`, `react-hooks`, `next`) တွေက ပေးတဲ့ rules တွေကို ပြုပြင် (သို့) disable လုပ်ချင်ရင် — `eslint.config.mjs` ထဲက `rules` property ကို သုံးပြီး တိုက်ရိုက် ပြောင်းလဲနိုင်ပါတယ်:

```js filename="eslint.config.mjs"
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
```

### Core Web Vitals နဲ့အတူ (With Core Web Vitals)

သင့် ESLint config ထဲမှာ `eslint-config-next/core-web-vitals` configuration ကို enable လုပ်ပါ။

```js filename="eslint.config.mjs"
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
```

`eslint-config-next/core-web-vitals` က `@next/eslint-plugin-next` ထဲက lint rules တချို့ကို warnings ကနေ errors အဖြစ် အဆင့်မြှင့်ပေးပြီး — သင့် [Core Web Vitals](https://web.dev/vitals/) metrics တွေ တိုးတက်ကောင်းမွန်အောင် ကူညီပေးပါတယ်။

> [Create Next App](/docs/nextjs/create-next-app) နဲ့ တည်ဆောက်ထားတဲ့ application အသစ်တွေအတွက် `eslint-config-next/core-web-vitals` configuration က အလိုအလျောက် ပါဝင်ပါတယ်။

### TypeScript နဲ့အတူ (With TypeScript)

Next.js ရဲ့ ESLint rules တွေအပြင် — `create-next-app --typescript` က သင့် config ထဲကို `eslint-config-next/typescript` နဲ့ TypeScript-specific lint rules တွေကိုပါ ထည့်ပေးပါလိမ့်မယ်:

```js filename="eslint.config.mjs"
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
```

ဒီ rules တွေက [`plugin:@typescript-eslint/recommended`](https://typescript-eslint.io/linting/configs#recommended) ကို အခြေခံထားပါတယ်။ အသေးစိတ်အတွက် [typescript-eslint > Configs](https://typescript-eslint.io/linting/configs) ကို ကြည့်ပါ။

### Prettier နဲ့အတူ (With Prettier)

ESLint ထဲမှာ code formatting rules တွေလည်း ပါဝင်ပြီး — အဲဒါတွေက သင့် ရှိပြီးသား [Prettier](https://prettier.io/) setup နဲ့ ဆန့်ကျင် ကွဲလွဲနိုင်ပါတယ်။ ESLint နဲ့ Prettier ကို အတူတကွ အလုပ်လုပ်နိုင်အောင် [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) ကို သင့် ESLint config ထဲ ထည့်ဖို့ အကြံပြုပါတယ်။

ပထမဆုံး dependency ကို တပ်ဆင်ပါ:

```bash package="pnpm"
pnpm add -D eslint-config-prettier
```

```bash package="npm"
npm i -D eslint-config-prettier
```

```bash package="yarn"
yarn add --dev eslint-config-prettier
```

```bash package="bun"
bun add -d eslint-config-prettier
```

ပြီးရင် သင့် ရှိပြီးသား ESLint config ထဲကို `prettier` ထည့်ပါ:

```js filename="eslint.config.mjs"
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
```

### Staged files တွေပေါ်မှာ lint run လုပ်ခြင်း (Running lint on staged files)

[lint-staged](https://github.com/okonet/lint-staged) နဲ့ ESLint ကို staged git files တွေပေါ်မှာ run လုပ်ဖို့ သုံးချင်ရင် — သင့် project ရဲ့ root မှာရှိတဲ့ `.lintstagedrc.js` file ထဲကို အောက်ပါအတိုင်း ထည့်ပါ:

```js filename=".lintstagedrc.js"
const path = require('path')

const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
```

## ရှိပြီးသား config ကို ပြောင်းရွှေ့ခြင်း (Migrating existing config)

သင့် application ထဲမှာ ESLint ကို configure လုပ်ထားပြီးသားဆိုရင် — သင့် setup ပေါ် မူတည်ပြီး Next.js linting rules တွေ ပေါင်းစပ်ဖို့ နည်းလမ်း နှစ်ခု ရှိပါတယ်။

#### Plugin ကို တိုက်ရိုက် သုံးခြင်း (Using the plugin directly)

အောက်ပါတွေထဲက တစ်ခုခုကို configure လုပ်ထားပြီးသားဆိုရင် `@next/eslint-plugin-next` ကို တိုက်ရိုက် သုံးပါ:

- သီးခြား (သို့) အခြား config တစ်ခု (ဥပမာ — `airbnb` (သို့) `react-app`) ကတစ်ဆင့် တပ်ဆင်ထားတဲ့ conflicting plugins တွေ:
  - `react`
  - `react-hooks`
  - `jsx-a11y`
  - `import`
- Next.js ရဲ့ defaults တွေနဲ့ မတူတဲ့ Custom `parserOptions` ([Babel configuration ကို customize လုပ်ထားရင်](https://nextjs.org/docs/pages/guides/babel))
- Custom Node.js နဲ့/သို့မဟုတ် TypeScript [resolvers](https://github.com/benmosher/eslint-plugin-import#resolvers) တွေ ပါတဲ့ `eslint-plugin-import`

ဒီလိုအခြေအနေတွေမှာ conflicts တွေ မဖြစ်အောင် `@next/eslint-plugin-next` ကို တိုက်ရိုက် သုံးပါ:

ပထမဆုံး plugin ကို တပ်ဆင်ပါ:

```bash package="pnpm"
pnpm add -D @next/eslint-plugin-next
```

```bash package="npm"
npm i -D @next/eslint-plugin-next
```

```bash package="yarn"
yarn add --dev @next/eslint-plugin-next
```

```bash package="bun"
bun add -d @next/eslint-plugin-next
```

ပြီးရင် သင့် ESLint config ထဲကို ထည့်ပါ:

```js filename="eslint.config.mjs"
import { defineConfig } from 'eslint/config'
import nextPlugin from '@next/eslint-plugin-next'

const eslintConfig = defineConfig([
  // Your other configurations...
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
    },
  },
])

export default eslintConfig
```

ဒီနည်းလမ်းက — config အများအပြားမှာ တူညီတဲ့ plugins (သို့) parsers တွေကို import လုပ်တဲ့အခါ ဖြစ်ပေါ်လာနိုင်တဲ့ collisions (ထိပ်တိုက်တွေ့မှုများ) (သို့) errors တွေရဲ့ အန္တရာယ်ကို ဖယ်ရှားပေးပါတယ်။

#### ရှိပြီးသား config ထဲ ထည့်သွင်းခြင်း (Adding to existing config)

Next.js ကို ရှိပြီးသား ESLint setup တစ်ခုထဲ ထည့်သွင်းနေတယ်ဆိုရင် — Next.js config ကို သင့် array ထဲ spread လုပ်ပါ:

```js filename="eslint.config.mjs"
import nextConfig from 'eslint-config-next/core-web-vitals'
// Your other config imports...

const eslintConfig = [
  // Your other configurations...
  ...nextConfig,
]

export default eslintConfig
```

`...nextConfig` ကို spread လုပ်တဲ့အခါ — file patterns, plugins, rules, ignores နဲ့ parser settings တွေ ပါဝင်တဲ့ config objects အများအပြားကို ထည့်ပေးပါတယ်။ ESLint က configs တွေကို အစီအစဉ်လိုက် apply လုပ်တာမို့ — နောက်ပိုင်း rules တွေက ကိုက်ညီတဲ့ files တွေအတွက် အစောပိုင်း rules တွေကို override လုပ်နိုင်ပါတယ်။

> **သိထားသင့်သည်:** ဒီနည်းလမ်းက ရိုးရှင်းတဲ့ setups တွေအတွက် ကောင်းစွာ အလုပ်လုပ်ပါတယ်။ သင့်မှာ conflicting ဖြစ်နေတဲ့ specific file patterns (သို့) plugin configurations တွေ ပါတဲ့ ရှုပ်ထွေးတဲ့ config တစ်ခု ရှိနေရင်တော့ — ပိုပြီး ချောမွေ့တဲ့ ထိန်းချုပ်မှုအတွက် plugin ကို တိုက်ရိုက် (အထက်မှာ ပြထားသလို) သုံးဖို့ စဉ်းစားပါ။

| Version   | အပြောင်းအလဲ                                                                                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v16.0.0` | `next lint` နဲ့ `next.config.js` ထဲက `eslint` option တွေကို — ESLint CLI ကို ဦးစားပေးဖို့ — ဖယ်ရှားလိုက်ပါပြီ။ ပြောင်းရွှေ့ဖို့ ကူညီပေးတဲ့ [codemod](/docs/nextjs/upgrading-codemods) တစ်ခု ရနိုင်ပါတယ်။ |
