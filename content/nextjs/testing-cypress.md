---
title: "Cypress စနစ်ထည့်သွင်းခြင်း (Testing with Cypress)"
description: "Cypress ကို Next.js နဲ့ စနစ်ထည့်သွင်းနည်း — End-to-End (E2E) နဲ့ Component Testing အတွက်; quickstart, manual setup, ပထမဆုံး E2E/component test ရေးနည်း, Continuous Integration (CI) မှာ headless run လုပ်ခြင်း"
order: 171
source: "https://nextjs.org/docs/app/guides/testing/cypress"
status: translated
updated: 2026-09-03
---

[Cypress](https://www.cypress.io/) က **End-to-End (E2E)** နဲ့ **Component Testing** တွေအတွက် သုံးတဲ့ test runner တစ်ခုပါ။ ဒီ page မှာ Cypress ကို Next.js နဲ့ ဘယ်လို စနစ်ထည့်သွင်းမလဲ နဲ့ သင့် ပထမဆုံး tests တွေ ဘယ်လို ရေးမလဲဆိုတာ ပြသပေးပါမယ်။

> **သတိပေးချက် (Warning):**
>
> - Cypress version 13.6.3 အောက်က versions တွေက `moduleResolution:"bundler"` နဲ့ [TypeScript version 5](https://github.com/cypress-io/cypress/issues/27731) ကို ထောက်ပံ့မပေးပါဘူး။ ဒါပေမယ့် ဒီ issue က Cypress version 13.6.3 နဲ့ နောက်ပိုင်းမှာ ဖြေရှင်းပြီးပါပြီ။ [cypress v13.6.3](https://docs.cypress.io/guides/references/changelog#13-6-3)

## လျင်မြန်စွာ စတင်ခြင်း (Quickstart)

`create-next-app` ကို [with-cypress example](https://github.com/vercel/next.js/tree/canary/examples/with-cypress) နဲ့ တွဲသုံးပြီး အမြန် စတင်နိုင်ပါတယ်:

```bash package="pnpm"
pnpm create next-app --example with-cypress with-cypress-app
```

```bash package="npm"
npx create-next-app@latest --example with-cypress with-cypress-app
```

```bash package="yarn"
yarn create next-app --example with-cypress with-cypress-app
```

```bash package="bun"
bun create next-app --example with-cypress with-cypress-app
```

## ကိုယ်တိုင် စနစ်ထည့်သွင်းခြင်း (Manual setup)

Cypress ကို ကိုယ်တိုင် စနစ်ထည့်သွင်းဖို့ — `cypress` ကို dev dependency အနေနဲ့ install လုပ်ပါ:

```bash package="pnpm"
pnpm add -D cypress
```

```bash package="npm"
npm install -D cypress
```

```bash package="yarn"
yarn add -D cypress
```

```bash package="bun"
bun add -D cypress
```

Cypress ရဲ့ `open` command ကို `package.json` ရဲ့ scripts field ထဲ ထည့်ပါ:

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "cypress:open": "cypress open"
  }
}
```

Cypress ကို ပထမဆုံးအကြိမ် run လုပ်ပြီး Cypress testing suite ကို ဖွင့်ကြည့်ပါ:

```bash package="pnpm"
pnpm cypress:open
```

```bash package="npm"
npm run cypress:open
```

```bash package="yarn"
yarn cypress:open
```

```bash package="bun"
bun run cypress:open
```

**E2E Testing** နဲ့/သို့မဟုတ် **Component Testing** ကို configure လုပ်ဖို့ ရွေးချယ်နိုင်ပါတယ်။ ဒီ options တွေထဲက တစ်ခုခုကို ရွေးလိုက်ရင် — သင့် project ထဲမှာ `cypress.config.js` file နဲ့ `cypress` folder တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးပါလိမ့်မယ်။

## ပထမဆုံး Cypress E2E test ဖန်တီးခြင်း

သင့် `cypress.config` file မှာ အောက်ပါ configuration ပါဝင်နေဖို့ သေချာပါစေ:

```ts filename="cypress.config.ts" switcher
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
})
```

```js filename="cypress.config.js" switcher
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
})
```

ပြီးရင် Next.js files အသစ် နှစ်ခု ဖန်တီးပါ:

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

```jsx filename="app/about/page.js"
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>About</h1>
      <Link href="/">Home</Link>
    </div>
  )
}
```

သင့် navigation မှန်ကန်စွာ အလုပ်လုပ်နေလားဆိုတာ စစ်ဆေးဖို့ test တစ်ခု ထည့်ပါ:

```js filename="cypress/e2e/app.cy.js"
describe('Navigation', () => {
  it('should navigate to the about page', () => {
    // Index page ကနေ စတင်ပါ
    cy.visit('http://localhost:3000/')

    // "about" ပါတဲ့ href attribute ရှိတဲ့ link ကို ရှာပြီး click လုပ်ပါ
    cy.get('a[href*="about"]').click()

    // URL အသစ်မှာ "/about" ပါဝင်သင့်ပါတယ်
    cy.url().should('include', '/about')

    // Page အသစ်မှာ "About" ဆိုတဲ့ h1 ပါဝင်သင့်ပါတယ်
    cy.get('h1').contains('About')
  })
})
```

### E2E Tests run လုပ်ခြင်း (Running E2E Tests)

Cypress က သင့် application ကို လည်ပတ်နေတဲ့ user တစ်ယောက်ကို အတုယူပါလိမ့်မယ် — ဒါအတွက် သင့် Next.js server က run နေဖို့ လိုအပ်ပါတယ်။ သင့် application ဘယ်လို ပြုမူမလဲဆိုတာကို ပိုတိကျစွာ တုပဖို့ — production code ပေါ်မှာ tests တွေကို run ဖို့ အကြံပြုပါတယ်။

သင့် Next.js application ကို build လုပ်ဖို့ `npm run build && npm run start` ကို run ပြီး — Cypress ကို စတင်ကာ E2E Testing suite ကို run လုပ်ဖို့ အခြား terminal window တစ်ခုမှာ `npm run cypress:open` ကို run ပါ။

> **သိထားသင့်သည်:**
>
> - `cypress.config.js` configuration file ထဲမှာ `baseUrl: 'http://localhost:3000'` ထည့်လိုက်ရင် — `cy.visit("http://localhost:3000/")` အစား `cy.visit("/")` ကို သုံးနိုင်ပါတယ်။
> - တနည်းအားဖြင့် — Next.js production server ကို Cypress နဲ့ တွဲပြီး run လုပ်ဖို့ [`start-server-and-test`](https://www.npmjs.com/package/start-server-and-test) package ကို install လုပ်နိုင်ပါတယ်။ Install ပြီးရင် သင့် `package.json` ရဲ့ scripts field ထဲမှာ `"test": "start-server-and-test start http://localhost:3000 cypress"` ကို ထည့်ပါ။ အပြောင်းအလဲတွေ လုပ်ပြီးတိုင်း application ကို ပြန် build လုပ်ဖို့ မမေ့ပါနဲ့။

## ပထမဆုံး Cypress component test ဖန်တီးခြင်း

Component tests တွေက application တစ်ခုလုံးကို bundle လုပ်စရာ (သို့) server တစ်ခု စတင်စရာ မလိုဘဲ — သတ်မှတ်ထားတဲ့ component တစ်ခုကို build လုပ်ပြီး mount လုပ်ပေးပါတယ်။

Cypress app ထဲမှာ **Component Testing** ကို ရွေးပြီး — front-end framework အဖြစ် **Next.js** ကို ရွေးပါ။ ဒါဆိုရင် သင့် project ထဲမှာ `cypress/component` folder တစ်ခု ဖန်တီးခံရပြီး — Component Testing ကို enable လုပ်ဖို့ `cypress.config.js` file ကို update လုပ်ပေးပါလိမ့်မယ်။

သင့် `cypress.config` file မှာ အောက်ပါ configuration ပါဝင်နေဖို့ သေချာပါစေ:

```ts filename="cypress.config.ts" switcher
import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

```js filename="cypress.config.js" switcher
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

အပေါ်က section ထဲက components တွေကိုပဲ သုံးပြီး — component တစ်ခုက မျှော်လင့်ထားတဲ့ output ကို render လုပ်နေလားဆိုတာ စစ်ဆေးဖို့ test တစ်ခု ထည့်ပါ:

```tsx filename="cypress/component/about.cy.tsx"
import Page from '../../app/page'

describe('<Page />', () => {
  it('should render and display expected content', () => {
    // Home page အတွက် React component ကို mount လုပ်ပါ
    cy.mount(<Page />)

    // Page အသစ်မှာ "Home" ဆိုတဲ့ h1 ပါဝင်သင့်ပါတယ်
    cy.get('h1').contains('Home')

    // မျှော်လင့်ထားတဲ့ URL ပါတဲ့ link တစ်ခု ရှိနေကြောင်း စစ်ဆေးပါ
    // Link ကို လိုက်ကြည့်တာမျိုးက E2E test အတွက် ပိုသင့်တော်ပါတယ်
    cy.get('a[href="/about"]').should('be.visible')
  })
})
```

> **သိထားသင့်သည်:**
>
> - Cypress က လက်ရှိမှာ `async` Server Components တွေအတွက် Component Testing ကို မထောက်ပံ့ပါဘူး။ E2E testing ကို သုံးဖို့ အကြံပြုပါတယ်။
> - Component tests တွေက Next.js server မလိုအပ်တာမို့ — server ရနေဖို့ မှီခိုတဲ့ `<Image />` လို features တွေက out-of-the-box (ဘာမှ ပြင်စရာမလိုဘဲ) အလုပ်မလုပ်နိုင်ပါဘူး။

### Component Tests run လုပ်ခြင်း (Running Component Tests)

Cypress ကို စတင်ပြီး Component Testing suite ကို run လုပ်ဖို့ သင့် terminal ထဲမှာ `npm run cypress:open` ကို run ပါ။

## Continuous Integration (CI)

Interactive testing အပြင် — CI environments တွေအတွက် ပိုသင့်တော်တဲ့ `cypress run` command ကို သုံးပြီး Cypress ကို headless အနေနဲ့လည်း run နိုင်ပါတယ်:

```json filename="package.json"
{
  "scripts": {
    //...
    "e2e": "start-server-and-test dev http://localhost:3000 \"cypress open --e2e\"",
    "e2e:headless": "start-server-and-test dev http://localhost:3000 \"cypress run --e2e\"",
    "component": "cypress open --component",
    "component:headless": "cypress run --component"
  }
}
```

Cypress နဲ့ Continuous Integration အကြောင်း ဒီ resources တွေကနေ ပိုလေ့လာနိုင်ပါတယ်:

- [Next.js with Cypress example](https://github.com/vercel/next.js/tree/canary/examples/with-cypress)
- [Cypress Continuous Integration Docs](https://docs.cypress.io/guides/continuous-integration/introduction)
- [Cypress GitHub Actions Guide](https://on.cypress.io/github-actions)
- [Official Cypress GitHub Action](https://github.com/cypress-io/github-action)
- [Cypress Discord](https://discord.com/invite/cypress)
