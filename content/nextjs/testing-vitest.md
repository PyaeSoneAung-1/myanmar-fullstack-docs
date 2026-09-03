---
title: "Vitest စနစ်ထည့်သွင်းခြင်း (Testing with Vitest)"
description: "Vitest နဲ့ React Testing Library ကို သုံးပြီး Next.js မှာ Unit Testing စနစ်ထည့်သွင်းနည်း; vitest.config setup, package.json script, ပထမဆုံး unit test ရေးနည်း, async Server Components ဆိုင်ရာ မှတ်ချက်"
order: 174
source: "https://nextjs.org/docs/app/guides/testing/vitest"
status: translated
updated: 2026-09-03
---

Vitest နဲ့ React Testing Library တို့ကို **Unit Testing** အတွက် မကြာခဏ တွဲသုံးကြပါတယ်။ ဒီ guide မှာ Vitest ကို Next.js နဲ့ ဘယ်လို စနစ်ထည့်သွင်းမလဲ နဲ့ သင့် ပထမဆုံး tests တွေ ဘယ်လို ရေးမလဲဆိုတာ ပြသပေးပါမယ်။

> **သိထားသင့်သည်:** `async` Server Components တွေက React ecosystem အတွက် အသစ်မို့ — Vitest က လက်ရှိမှာ သူတို့ကို မထောက်ပံ့ပါဘူး။ Synchronous Server နဲ့ Client Components တွေအတွက် **unit tests** တွေတော့ run လို့ရပါသေးတယ် — ဒါပေမယ့် `async` components တွေအတွက်တော့ **E2E tests** တွေကို သုံးဖို့ အကြံပြုပါတယ်။

## လျင်မြန်စွာ စတင်ခြင်း (Quickstart)

`create-next-app` ကို Next.js ရဲ့ [with-vitest](https://github.com/vercel/next.js/tree/canary/examples/with-vitest) example နဲ့ တွဲသုံးပြီး အမြန် စတင်နိုင်ပါတယ်:

```bash package="pnpm"
pnpm create next-app --example with-vitest with-vitest-app
```

```bash package="npm"
npx create-next-app@latest --example with-vitest with-vitest-app
```

```bash package="yarn"
yarn create next-app --example with-vitest with-vitest-app
```

```bash package="bun"
bun create next-app --example with-vitest with-vitest-app
```

## ကိုယ်တိုင် စနစ်ထည့်သွင်းခြင်း (Manual setup)

Vitest ကို ကိုယ်တိုင် စနစ်ထည့်သွင်းဖို့ — `vitest` နဲ့ အောက်ပါ packages တွေကို dev dependencies အဖြစ် install လုပ်ပါ:

```bash package="pnpm"
# TypeScript သုံးရင်
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# JavaScript သုံးရင်
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

```bash package="npm"
# TypeScript သုံးရင်
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# JavaScript သုံးရင်
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

```bash package="yarn"
# TypeScript သုံးရင်
yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# JavaScript သုံးရင်
yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

```bash package="bun"
# TypeScript သုံးရင်
bun add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# JavaScript သုံးရင်
bun add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

သင့် project ရဲ့ root မှာ `vitest.config.mts|js` file တစ်ခု ဖန်တီးပြီး အောက်ပါ options တွေကို ထည့်ပါ:

```ts filename="vitest.config.mts" switcher
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
  },
})
```

```js filename="vitest.config.js" switcher
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
```

Vitest ကို configure လုပ်ခြင်းအကြောင်း ပိုသိချင်ရင် [Vitest Configuration](https://vitest.dev/config/#configuration) docs ကို ကိုးကားပါ။

ပြီးရင် သင့် `package.json` ထဲမှာ `test` script တစ်ခု ထည့်ပါ:

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest"
  }
}
```

`npm run test` ကို run လိုက်တဲ့အခါ — Vitest က သင့် project ထဲက အပြောင်းအလဲတွေကို default အနေနဲ့ **watch** လုပ်ပါလိမ့်မယ်။

## ပထမဆုံး Vitest Unit Test ဖန်တီးခြင်း

`<Page />` component တစ်ခုက heading တစ်ခုကို အောင်မြင်စွာ render လုပ်လားဆိုတာ စစ်ဆေးမယ့် test တစ်ခု ဖန်တီးပြီး — အရာအားလုံး အလုပ်လုပ်နေလားဆိုတာ စစ်ဆေးကြည့်ပါ:

```tsx filename="app/page.tsx" switcher
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

```jsx filename="app/page.jsx" switcher
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

```tsx filename="__tests__/page.test.tsx" switcher
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Page', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})
```

```jsx filename="__tests__/page.test.jsx" switcher
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Page', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})
```

> **သိထားသင့်သည်:** အပေါ်က ဥပမာက အသုံးများတဲ့ `__tests__` convention ကို သုံးထားပါတယ် — ဒါပေမယ့် test files တွေကို `app` router ထဲမှာလည်း တွဲထည့်ထားနိုင်ပါတယ်။

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

အောက်ပါ resources တွေက အထောက်အကူ ဖြစ်စေနိုင်ပါတယ်:

- [Next.js with Vitest example](https://github.com/vercel/next.js/tree/canary/examples/with-vitest)
- [Vitest Docs](https://vitest.dev/guide/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
