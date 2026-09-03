---
title: "Playwright စနစ်ထည့်သွင်းခြင်း (Testing with Playwright)"
description: "Playwright ကို သုံးပြီး Next.js မှာ End-to-End (E2E) Testing စနစ်ထည့်သွင်းနည်း — Chromium, Firefox, WebKit ထောက်ပံ့မှု; quickstart, manual setup, ပထမဆုံး E2E test, CI မှာ run လုပ်ခြင်း"
order: 173
source: "https://nextjs.org/docs/app/guides/testing/playwright"
status: translated
updated: 2026-09-03
---

Playwright က Chromium, Firefox နဲ့ WebKit တွေကို API တစ်ခုတည်းနဲ့ automate လုပ်နိုင်စေတဲ့ testing framework တစ်ခုပါ။ ဒါကို သုံးပြီး **End-to-End (E2E)** testing တွေ ရေးနိုင်ပါတယ်။ ဒီ guide မှာ Playwright ကို Next.js နဲ့ ဘယ်လို စနစ်ထည့်သွင်းမလဲ နဲ့ သင့် ပထမဆုံး tests တွေ ဘယ်လို ရေးမလဲဆိုတာ ပြသပေးပါမယ်။

## လျင်မြန်စွာ စတင်ခြင်း (Quickstart)

စတင်ဖို့ အမြန်ဆုံး နည်းလမ်းက `create-next-app` ကို [with-playwright example](https://github.com/vercel/next.js/tree/canary/examples/with-playwright) နဲ့ သုံးတာပါ။ ဒါက Playwright configure လုပ်ပြီးသား Next.js project တစ်ခုကို ဖန်တီးပေးပါလိမ့်မယ်။

```bash package="pnpm"
pnpm create next-app --example with-playwright with-playwright-app
```

```bash package="npm"
npx create-next-app@latest --example with-playwright with-playwright-app
```

```bash package="yarn"
yarn create next-app --example with-playwright with-playwright-app
```

```bash package="bun"
bun create next-app --example with-playwright with-playwright-app
```

## ကိုယ်တိုင် စနစ်ထည့်သွင်းခြင်း (Manual setup)

Playwright ကို install လုပ်ဖို့ အောက်ပါ command ကို run ပါ:

```bash package="pnpm"
pnpm create playwright
```

```bash package="npm"
npm init playwright
```

```bash package="yarn"
yarn create playwright
```

```bash package="bun"
bun create playwright
```

ဒါက သင့် project အတွက် Playwright ကို စနစ်ထည့်သွင်း ပြင်ဆင်ဖို့ — `playwright.config.ts` file တစ်ခု ထည့်ပေးတာ အပါအဝင် — prompts စုံတစ်ခုကို ဖြတ်သန်းစေပါလိမ့်မယ်။ အဆင့်ဆင့် လမ်းညွှန်အတွက် [Playwright installation guide](https://playwright.dev/docs/intro#installation) ကို ကိုးကားပါ။

## ပထမဆုံး Playwright E2E test ဖန်တီးခြင်း

Next.js pages အသစ် နှစ်ခု ဖန်တီးပါ:

```tsx filename="app/page.tsx"
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

```tsx filename="app/about/page.tsx"
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

ပြီးရင် သင့် navigation မှန်ကန်စွာ အလုပ်လုပ်နေလားဆိုတာ အတည်ပြုဖို့ test တစ်ခု ထည့်ပါ:

```ts filename="tests/example.spec.ts"
import { test, expect } from '@playwright/test'

test('should navigate to the about page', async ({ page }) => {
  // Index page ကနေ စတင်ပါ (playwright.config.ts ထဲက webServer ကနေ baseURL ကို သတ်မှတ်ထားပါတယ်)
  await page.goto('http://localhost:3000/')
  // 'About' ဆိုတဲ့ text ပါတဲ့ element ကို ရှာပြီး click လုပ်ပါ
  await page.click('text=About')
  // URL အသစ်က "/about" ဖြစ်သင့်ပါတယ် (အဲဒီမှာ baseURL ကို သုံးပါတယ်)
  await expect(page).toHaveURL('http://localhost:3000/about')
  // Page အသစ်မှာ "About" ဆိုတဲ့ h1 ပါဝင်သင့်ပါတယ်
  await expect(page.locator('h1')).toContainText('About')
})
```

> **သိထားသင့်သည်:** `playwright.config.ts` [configuration file](https://playwright.dev/docs/test-configuration) ထဲမှာ [`"baseURL": "http://localhost:3000"`](https://playwright.dev/docs/api/class-testoptions#test-options-base-url) ကို ထည့်ထားရင် — `page.goto("http://localhost:3000/")` အစား `page.goto("/")` ကို သုံးနိုင်ပါတယ်။

### Playwright tests များ run လုပ်ခြင်း (Running your Playwright tests)

Playwright က Chromium, Firefox နဲ့ WebKit ဆိုတဲ့ browser သုံးခုကို သုံးပြီး သင့် application ကို လည်ပတ်နေတဲ့ user တစ်ယောက်ကို အတုယူပါလိမ့်မယ် — ဒါအတွက် သင့် Next.js server က run နေဖို့ လိုအပ်ပါတယ်။ သင့် application ဘယ်လို ပြုမူမလဲဆိုတာကို ပိုတိကျစွာ တုပဖို့ — production code ပေါ်မှာ tests တွေကို run ဖို့ အကြံပြုပါတယ်။

`npm run build` နဲ့ `npm run start` တွေကို run ပြီး — Playwright tests တွေကို run လုပ်ဖို့ အခြား terminal window တစ်ခုမှာ `npx playwright test` ကို run ပါ။

> **သိထားသင့်သည်:** တနည်းအားဖြင့် — Playwright ကိုယ်တိုင် development server ကို စတင်စေပြီး အပြည့်အဝ အသင့်ဖြစ်တဲ့အထိ စောင့်ဆိုင်းစေဖို့ [`webServer`](https://playwright.dev/docs/test-webserver/) feature ကို သုံးနိုင်ပါတယ်။

### Continuous Integration (CI) ပေါ်မှာ Playwright run လုပ်ခြင်း

Playwright က သင့် tests တွေကို default အနေနဲ့ [headless mode](https://playwright.dev/docs/ci#running-headed) မှာ run ပါလိမ့်မယ်။ Playwright dependencies တွေ အားလုံးကို install လုပ်ဖို့ — `npx playwright install-deps` ကို run ပါ။

Playwright နဲ့ Continuous Integration အကြောင်း ဒီ resources တွေကနေ ပိုလေ့လာနိုင်ပါတယ်:

- [Next.js with Playwright example](https://github.com/vercel/next.js/tree/canary/examples/with-playwright)
- [Playwright on your CI provider](https://playwright.dev/docs/ci)
- [Playwright Discord](https://discord.com/invite/playwright-807756831384403968)
