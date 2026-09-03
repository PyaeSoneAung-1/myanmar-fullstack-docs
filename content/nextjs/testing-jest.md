---
title: "Jest စနစ်ထည့်သွင်းခြင်း (Testing with Jest)"
description: "Jest နဲ့ React Testing Library ကို သုံးပြီး Next.js မှာ Unit Testing နဲ့ Snapshot Testing စနစ်ထည့်သွင်းနည်း; next/jest configuration, module path aliases, custom matchers (jest-dom), ပထမဆုံး test ရေးနည်း"
order: 172
source: "https://nextjs.org/docs/app/guides/testing/jest"
status: translated
updated: 2026-09-03
---

Jest နဲ့ React Testing Library တို့ကို **Unit Testing** နဲ့ **Snapshot Testing** တွေအတွက် မကြာခဏ တွဲသုံးကြပါတယ်။ ဒီ guide မှာ Jest ကို Next.js နဲ့ ဘယ်လို စနစ်ထည့်သွင်းမလဲ နဲ့ သင့် ပထမဆုံး tests တွေ ဘယ်လို ရေးမလဲဆိုတာ ပြသပေးပါမယ်။

> **သိထားသင့်သည်:** `async` Server Components တွေက React ecosystem အတွက် အသစ်မို့ — Jest က လက်ရှိမှာ သူတို့ကို မထောက်ပံ့ပါဘူး။ Synchronous Server နဲ့ Client Components တွေအတွက် **unit tests** တွေတော့ run လို့ရပါသေးတယ် — ဒါပေမယ့် `async` components တွေအတွက်တော့ **E2E tests** တွေကို သုံးဖို့ အကြံပြုပါတယ်။

## လျင်မြန်စွာ စတင်ခြင်း (Quickstart)

`create-next-app` ကို Next.js ရဲ့ [with-jest](https://github.com/vercel/next.js/tree/canary/examples/with-jest) example နဲ့ တွဲသုံးပြီး အမြန် စတင်နိုင်ပါတယ်:

```bash package="pnpm"
pnpm create next-app --example with-jest with-jest-app
```

```bash package="npm"
npx create-next-app@latest --example with-jest with-jest-app
```

```bash package="yarn"
yarn create next-app --example with-jest with-jest-app
```

```bash package="bun"
bun create next-app --example with-jest with-jest-app
```

## ကိုယ်တိုင် စနစ်ထည့်သွင်းခြင်း (Manual setup)

[Next.js 12](https://nextjs.org/blog/next-12) ထွက်ရှိကတည်းက — Next.js မှာ Jest အတွက် built-in configuration ပါဝင်ပါတယ်။

Jest ကို စနစ်ထည့်သွင်းဖို့ — `jest` နဲ့ အောက်ပါ packages တွေကို dev dependencies အဖြစ် install လုပ်ပါ:

```bash package="pnpm"
pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

```bash package="npm"
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

```bash package="yarn"
yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

```bash package="bun"
bun add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

အောက်ပါ command ကို run ပြီး အခြေခံ Jest configuration file တစ်ခုကို generate လုပ်ပါ:

```bash package="pnpm"
pnpm create jest@latest
```

```bash package="npm"
npm init jest@latest
```

```bash package="yarn"
yarn create jest@latest
```

```bash package="bun"
bun create jest@latest
```

ဒါက သင့် project အတွက် Jest ကို စနစ်ထည့်သွင်းဖို့ — `jest.config.ts|js` file တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးတာ အပါအဝင် — prompts စုံတစ်ခုကို ဖြတ်သန်းစေပါလိမ့်မယ်။

သင့် config file ကို `next/jest` သုံးအောင် update လုပ်ပါ။ ဒီ transformer မှာ Jest က Next.js နဲ့ အလုပ်လုပ်ဖို့ လိုအပ်တဲ့ configuration options တွေ အားလုံး ပါဝင်ပါတယ်:

```ts filename="jest.config.ts" switcher
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Test environment မှာ next.config.js နဲ့ .env files တွေကို load လုပ်ဖို့ သင့် Next.js app ရဲ့ path ကို ပေးပါ
  dir: './',
})

// Jest ဆီ ပို့မယ့် custom config တွေ ရှိရင် ဒီမှာ ထည့်ပါ
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Test တစ်ခုစီ run လုပ်ခင် ထပ်ထည့်ချင်တဲ့ setup options တွေ
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// Next.js config က async ဖြစ်လို့ next/jest က ၎င်းကို load လုပ်နိုင်ဖို့ createJestConfig ကို ဒီပုံစံအတိုင်း export လုပ်ပါ
export default createJestConfig(config)
```

```js filename="jest.config.js" switcher
const nextJest = require('next/jest')

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Test environment မှာ next.config.js နဲ့ .env files တွေကို load လုပ်ဖို့ သင့် Next.js app ရဲ့ path ကို ပေးပါ
  dir: './',
})

// Jest ဆီ ပို့မယ့် custom config တွေ ရှိရင် ဒီမှာ ထည့်ပါ
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Test တစ်ခုစီ run လုပ်ခင် ထပ်ထည့်ချင်တဲ့ setup options တွေ
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// Next.js config က async ဖြစ်လို့ next/jest က ၎င်းကို load လုပ်နိုင်ဖို့ createJestConfig ကို ဒီပုံစံအတိုင်း export လုပ်ပါ
module.exports = createJestConfig(config)
```

နောက်ကွယ်မှာ `next/jest` က Jest ကို သင့်အတွက် အလိုအလျောက် configure လုပ်ပေးပါတယ် — အောက်ပါတို့ အပါအဝင်ပါ:

- [Next.js Compiler](https://nextjs.org/docs/architecture/nextjs-compiler) ကို သုံးပြီး `transform` ကို စနစ်ထည့်သွင်းပေးခြင်း။
- Stylesheets (`.css`, `.module.css`, နဲ့ သူတို့ရဲ့ scss variants တွေ), image imports တွေနဲ့ [`next/font`](/docs/nextjs/component-font) တွေကို auto mock လုပ်ပေးခြင်း။
- `.env` (နဲ့ variant အားလုံး) တွေကို `process.env` ထဲ load လုပ်ပေးခြင်း။
- Test resolving နဲ့ transforms တွေကနေ `node_modules` ကို ချန်လှပ်ပေးခြင်း။
- Test resolving ကနေ `.next` ကို ချန်လှပ်ပေးခြင်း။
- SWC transforms တွေကို enable လုပ်တဲ့ flags တွေအတွက် `next.config.js` ကို load လုပ်ပေးခြင်း။

> **သိထားသင့်သည်:** Environment variables တွေကို တိုက်ရိုက် စမ်းသပ်ဖို့ — သီးခြား setup script တစ်ခုမှာ (သို့) သင့် `jest.config.ts` file ထဲမှာ သူတို့ကို ကိုယ်တိုင် load လုပ်ပါ။ အသေးစိတ်အတွက် [Test Environment Variables](/docs/nextjs/environment-variables) ကို ကြည့်ပါ။

## Module Path Aliases နဲ့ Absolute Imports ကိုင်တွယ်ခြင်း (Optional)

သင့် project က [Module Path Aliases](https://nextjs.org/docs/app/getting-started/installation#set-up-absolute-imports-and-module-path-aliases) သုံးနေတယ်ဆိုရင် — `jsconfig.json` file ထဲက `paths` option နဲ့ `jest.config.js` file ထဲက `moduleNameMapper` option ကို ကိုက်ညီအောင် လုပ်ပြီး imports တွေကို resolve လုပ်နိုင်အောင် Jest ကို configure လုပ်ဖို့ လိုပါလိမ့်မယ်။ ဥပမာ:

```json filename="tsconfig.json or jsconfig.json"
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "baseUrl": "./",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

```js filename="jest.config.js"
moduleNameMapper: {
  // ...
  '^@/components/(.*)$': '<rootDir>/components/$1',
}
```

## Custom matchers တွေနဲ့ Jest ကို တိုးချဲ့ခြင်း (Optional)

`@testing-library/jest-dom` မှာ tests တွေ ရေးရ ပိုလွယ်ကူစေတဲ့ `.toBeInTheDocument()` လို အဆင်ပြေတဲ့ [custom matchers](https://github.com/testing-library/jest-dom#custom-matchers) အစုတစ်ခု ပါဝင်ပါတယ်။ Jest configuration file ထဲမှာ အောက်ပါ option ကို ထည့်ပြီး — test တိုင်းအတွက် custom matchers တွေကို import လုပ်နိုင်ပါတယ်:

```ts filename="jest.config.ts" switcher
setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
```

```js filename="jest.config.js" switcher
setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
```

ပြီးရင် `jest.setup` ထဲမှာ အောက်ပါ import ကို ထည့်ပါ:

```ts filename="jest.setup.ts" switcher
import '@testing-library/jest-dom'
```

```js filename="jest.setup.js" switcher
import '@testing-library/jest-dom'
```

> **သိထားသင့်သည်:** [`extend-expect` ကို `v6.0` မှာ ဖယ်ရှားလိုက်ပါပြီ](https://github.com/testing-library/jest-dom/releases/tag/v6.0.0) — ဒါကြောင့် version 6 မတိုင်ခင် `@testing-library/jest-dom` ကို သုံးနေတယ်ဆိုရင် — အဲဒီအစား `@testing-library/jest-dom/extend-expect` ကို import လုပ်ဖို့ လိုပါလိမ့်မယ်။

Test တစ်ခုစီ မတိုင်ခင် setup options တွေ ထပ်ထည့်ဖို့ လိုရင် — အပေါ်က `jest.setup` file ထဲမှာ ထည့်နိုင်ပါတယ်။

## `package.json` ထဲ test script ထည့်ခြင်း

နောက်ဆုံးအနေနဲ့ — သင့် `package.json` file ထဲမှာ Jest ရဲ့ `test` script တစ်ခု ထည့်ပါ:

```json filename="package.json" highlight={6-7}
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

`jest --watch` က file တစ်ခု ပြောင်းလဲတိုင်း tests တွေကို ပြန် run ပေးပါလိမ့်မယ်။ Jest CLI options တွေ ပိုသိချင်ရင် [Jest Docs](https://jestjs.io/docs/cli#reference) ကို ကြည့်ပါ။

### ပထမဆုံး test ဖန်တီးခြင်း

အခု သင့် project က tests run လုပ်ဖို့ အသင့်ဖြစ်ပါပြီ။ သင့် project ရဲ့ root directory ထဲမှာ `__tests__` ဆိုတဲ့ folder တစ်ခု ဖန်တီးပါ။

ဥပမာ — `<Page />` component တစ်ခုက heading တစ်ခုကို အောင်မြင်စွာ render လုပ်လားဆိုတာ စစ်ဆေးမယ့် test တစ်ခု ထည့်နိုင်ပါတယ်:

```jsx filename="app/page.js"
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
```

```jsx filename="__tests__/page.test.jsx"
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />)

    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toBeInTheDocument()
  })
})
```

ထပ်ဆောင်းအနေနဲ့ — သင့် component ထဲမှာ မမျှော်လင့်ထားတဲ့ အပြောင်းအလဲတွေကို ခြေရာခံဖို့ [snapshot test](https://jestjs.io/docs/snapshot-testing) တစ်ခုကိုလည်း ထည့်နိုင်ပါတယ်:

```jsx filename="__tests__/snapshot.js"
import { render } from '@testing-library/react'
import Page from '../app/page'

it('renders homepage unchanged', () => {
  const { container } = render(<Page />)
  expect(container).toMatchSnapshot()
})
```

## Tests များ run လုပ်ခြင်း (Running your tests)

ပြီးရင် သင့် tests တွေကို run လုပ်ဖို့ အောက်ပါ command ကို run ပါ:

```bash package="pnpm"
pnpm test
```

```bash package="npm"
npm run test
```

```bash package="yarn"
yarn test
```

```bash package="bun"
bun run test
```

## ထပ်ဆောင်း အရင်းအမြစ်များ (Additional Resources)

ထပ်ဆောင်း လေ့လာဖို့ အောက်ပါ resources တွေက အထောက်အကူ ဖြစ်စေနိုင်ပါတယ်:

- [Next.js with Jest example](https://github.com/vercel/next.js/tree/canary/examples/with-jest)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Playground](https://testing-playground.com/) — elements တွေကို match လုပ်ဖို့ ကောင်းမွန်တဲ့ testing practices တွေကို သုံးပါ။
