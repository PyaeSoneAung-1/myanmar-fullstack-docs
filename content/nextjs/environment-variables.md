---
title: "Environment Variables"
description: "Next.js app မှာ environment variables (ပတ်ဝန်းကျင် ကိန်းရှင်များ) ထည့်သွင်း၊ ဝင်ရောက်သုံးစွဲပုံ — .env files, @next/env, NEXT_PUBLIC_ prefix, browser bundling, runtime/test variables နဲ့ load order"
order: 13
source: "https://nextjs.org/docs/app/guides/environment-variables"
status: translated
updated: 2026-09-01
---

Next.js မှာ environment variables အတွက် built-in support ပါဝင်ပါတယ် — ဒါက အောက်ပါတို့ကို လုပ်ဆောင်နိုင်စေပါတယ်:

- [`.env` ကို သုံးပြီး environment variables တွေကို load လုပ်ခြင်း](#loading-environment-variables)
- [`NEXT_PUBLIC_` နဲ့ prefix တပ်ပြီး browser အတွက် environment variables တွေကို bundle လုပ်ခြင်း](#bundling-environment-variables-for-the-browser)

> **သတိပြုရန်** — Default `create-next-app` template က `.env` files အားလုံးကို သင့် `.gitignore` ထဲ ထည့်ပေးပါတယ်။ ဒီ files တွေကို repository ထဲ commit လုပ်ဖို့ ဘယ်တော့မှ မဖြစ်သင့်ပါဘူး။

## Environment Variables Load လုပ်ခြင်း

Next.js မှာ `.env*` files တွေကနေ environment variables တွေကို `process.env` ထဲကို load လုပ်တဲ့ built-in support ပါဝင်ပါတယ်:

```txt
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

> **မှတ်ချက်** — Next.js က သင့် `.env*` files တွေထဲမှာ multiline variables တွေကိုလည်း support လုပ်ပါတယ်:
>
> ```bash
> # .env
>
> # line breaks တွေနဲ့ ရေးနိုင်ပါတယ်
> PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
> ...
> Kh9NV...
> ...
> -----END DSA PRIVATE KEY-----"
>
> # (သို့) double quotes ထဲမှာ `\n` သုံးပြီးလည်း ရေးနိုင်ပါတယ်
> PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nKh9NV...\n-----END DSA PRIVATE KEY-----\n"
> ```

> **မှတ်ချက်** — `/src` folder သုံးနေရင် — Next.js က `.env` files တွေကို **parent folder ကနေပဲ** load လုပ်ပြီး `/src` folder ကနေ **မဟုတ်ဘူး** ဆိုတာ သတိပြုပါ။

ဒါက `process.env.DB_HOST`, `process.env.DB_USER` နဲ့ `process.env.DB_PASS` တွေကို Node.js environment ထဲကို အလိုအလျောက် load လုပ်ပေးပြီး — [Route Handlers](/docs/nextjs/route-handlers) တွေမှာ သုံးနိုင်စေပါတယ်။

ဥပမာ:

```js
export async function GET() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

### `@next/env` နဲ့ Environment Variables Load လုပ်ခြင်း

ORM (သို့) test runner အတွက် root config file လိုမျိုး — Next.js runtime ပြင်ပမှာ environment variables တွေကို load လုပ်ဖို့ လိုအပ်ရင် `@next/env` package ကို သုံးနိုင်ပါတယ်။

ဒီ package ကို Next.js က `.env*` files တွေကနေ environment variables တွေ load လုပ်ဖို့ အတွင်းပိုင်းမှာ ကိုယ်တိုင် သုံးပါတယ်။

သုံးဖို့ — package ကို install လုပ်ပြီး environment variables တွေကို load လုပ်ဖို့ `loadEnvConfig` function ကို သုံးပါ:

```bash
pnpm add @next/env
```

```tsx
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)
```

ပြီးတော့ လိုအပ်တဲ့နေရာမှာ configuration ကို import လုပ်နိုင်ပါတယ်။ ဥပမာ:

```tsx
import './envConfig.ts'

export default defineConfig({
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
})
```

### တခြား Variables တွေကို ကိုးကားခြင်း

Next.js က `$` သုံးပြီး တခြား variables တွေကို ကိုးကားတဲ့ variables တွေကို အလိုအလျောက် expand လုပ်ပါတယ် — ဥပမာ သင့် `.env*` files တွေထဲမှာ `$VARIABLE` လိုမျိုးပါ။ ဒါက တခြား secrets တွေကို ကိုးကားနိုင်စေပါတယ်။ ဥပမာ:

```txt
TWITTER_USER=nextjs
TWITTER_URL=https://x.com/$TWITTER_USER
```

အပေါ်က ဥပမာမှာ — `process.env.TWITTER_URL` က `https://x.com/nextjs` အဖြစ် သတ်မှတ်ခံရပါမယ်။

> **သိထားသင့်သည်** — တကယ့် value ထဲမှာ `$` ပါတဲ့ variable ကို သုံးဖို့ လိုရင် escape လုပ်ရပါမယ် — ဥပမာ `\$` လိုမျိုးပါ။

## Browser အတွက် Environment Variables Bundling လုပ်ခြင်း

`NEXT_PUBLIC_` နဲ့ မစတင်တဲ့ environment variables တွေက Node.js environment မှာပဲ ရနိုင်ပြီး — browser ကနေ ဝင်ရောက်လို့ မရပါဘူး (client က မတူညီတဲ့ _environment_ တစ်ခုမှာ run လုပ်လို့ပါ)။

Environment variable တစ်ခုရဲ့ value ကို browser မှာ ဝင်ရောက်သုံးနိုင်အောင် — Next.js က build time မှာ value တစ်ခုကို client ဆီ ပို့တဲ့ js bundle ထဲကို "inline" လုပ်ပြီး — `process.env.[variable]` ကိုးကားချက်အားလုံးကို hard-coded value တစ်ခုနဲ့ အစားထိုးပါတယ်။ ဒါလုပ်ဖို့ — variable ကို `NEXT_PUBLIC_` နဲ့ prefix တပ်ပေးရုံပါပဲ။ ဥပမာ:

```txt
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

ဒါက Next.js ကို Node.js environment ထဲက `process.env.NEXT_PUBLIC_ANALYTICS_ID` ကိုးကားချက်အားလုံးကို — သင်က `next build` run လုပ်တဲ့ environment ကရတဲ့ value နဲ့ အစားထိုးစေပြီး — သင့် code ထဲ နေရာမရွေး သုံးနိုင်စေပါတယ်။ ဒါက browser ဆီ ပို့တဲ့ JavaScript ထဲမှာ inline လုပ်ခံရပါမယ်။

> **မှတ်ချက်** — Build လုပ်ပြီးတာနဲ့ — သင့် app က ဒီ environment variables တွေရဲ့ အပြောင်းအလဲတွေကို ဆက်ပြီး တုံ့ပြန်မှာ မဟုတ်ပါဘူး။ ဥပမာ — Heroku pipeline ကို သုံးပြီး environment တစ်ခုမှာ build လုပ်ထားတဲ့ slugs တွေကို တခြား environment တစ်ခုဆီ promote လုပ်တာ (သို့) Docker image တစ်ခုတည်းကို environment အများအပြားမှာ build ပြီး deploy လုပ်တာဆိုရင် — `NEXT_PUBLIC_` variables အားလုံးက build time မှာ အကဲဖြတ်ထားတဲ့ value နဲ့ပဲ ခဲနေပါလိမ့်မယ်။ ဒါကြောင့် ဒီ values တွေကို project build လုပ်တဲ့အခါ သင့်တော်အောင် သတ်မှတ်ထားဖို့ လိုပါတယ်။ Runtime environment values တွေ လိုအပ်ရင် — client ဆီ ပေးဖို့ (on demand ဖြစ်ဖြစ်, initialization မှာ ဖြစ်ဖြစ်) ကိုယ်ပိုင် API တစ်ခု တည်ဆောက်ရပါမယ်။

```js
import setupAnalyticsService from '../lib/my-analytics-service'

// 'NEXT_PUBLIC_ANALYTICS_ID' ကို 'NEXT_PUBLIC_' နဲ့ prefix တပ်ထားလို့ ဒီနေရာမှာ သုံးနိုင်ပါတယ်။
// Build time မှာ `setupAnalyticsService('abcdefghijk')` အဖြစ် ပြောင်းလဲခံရပါမယ်။
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)

function HomePage() {
  return <h1>Hello World</h1>
}

export default HomePage
```

Dynamic lookups တွေကတော့ inline လုပ်ခံရမှာ မဟုတ်ဘူးဆိုတာ သတိပြုပါ:

```js
// variable တစ်ခု သုံးထားလို့ ဒါကို inline လုပ်မှာ မဟုတ်ပါဘူး
const varName = 'NEXT_PUBLIC_ANALYTICS_ID'
setupAnalyticsService(process.env[varName])

// variable တစ်ခု သုံးထားလို့ ဒါကို inline လုပ်မှာ မဟုတ်ပါဘူး
const env = process.env
setupAnalyticsService(env.NEXT_PUBLIC_ANALYTICS_ID)
```

### Runtime Environment Variables

Next.js က build time ရော runtime environment variables နှစ်မျိုးလုံးကို support လုပ်နိုင်ပါတယ်။

**Default အနေနဲ့ environment variables တွေက server ပေါ်မှာပဲ ရနိုင်ပါတယ်**။ Environment variable တစ်ခုကို browser ဆီ ဖော်ထုတ်ဖို့ — `NEXT_PUBLIC_` နဲ့ prefix တပ်ရပါမယ်။ ဒါပေမယ့် ဒီ public environment variables တွေက `next build` ကာလအတွင်း JavaScript bundle ထဲ inline လုပ်ခံရပါမယ်။

Dynamic rendering ကာလအတွင်း server ပေါ်မှာ environment variables တွေကို စိတ်ချစွာ ဖတ်နိုင်ပါတယ်:

```tsx
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  // cookies, headers နဲ့ တခြား Request-time APIs တွေကလည်း
  // dynamic rendering ကို opt in လုပ်မယ်ဆိုတော့
  // ဒီ env variable ကို runtime မှာ အကဲဖြတ်ပါတယ်
  const value = process.env.MY_VALUE
  // ...
}
```

ဒါက environment အမျိုးမျိုးမှာ value မတူညီတာတွေနဲ့ promote လုပ်နိုင်တဲ့ Docker image တစ်ခုတည်းကို သုံးနိုင်စေပါတယ်။

**သိထားသင့်သည်:**

- Server startup မှာ code run လုပ်ဖို့ [`register` function](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation) ကို သုံးနိုင်ပါတယ်။

## Test Environment Variables

`development` နဲ့ `production` environments တွေအပြင် — 3 ခုမြောက် option တစ်ခုလည်း ရှိပါတယ်: `test`။ Development (သို့) production environments တွေအတွက် defaults တွေ သတ်မှတ်နိုင်သလိုပဲ — `testing` environment အတွက် `.env.test` file တစ်ခုနဲ့လည်း လုပ်နိုင်ပါတယ် (ဒါပေမယ့် ဒီဟာက အရင်နှစ်ခုလောက် အသုံးမများပါဘူး)။ `testing` environment မှာ Next.js က `.env.development` (သို့) `.env.production` ကနေ environment variables တွေကို load လုပ်မှာ မဟုတ်ပါဘူး။

`jest` (သို့) `cypress` လို tools တွေနဲ့ tests တွေ run လုပ်တဲ့အခါ — testing အတွက်ပဲ သတ်မှတ်ထားတဲ့ environment vars တွေ လိုအပ်တဲ့အခါ ဒါက အသုံးဝင်ပါတယ်။ `NODE_ENV` ကို `test` အဖြစ် သတ်မှတ်ထားရင် test default values တွေ load ခံရပါမယ် — ဒါပေမယ့် testing tools တွေက သင့်အတွက် ကိုင်တွယ်ပေးလို့ ဒါကို ကိုယ်တိုင် လုပ်ဖို့ မလိုပါဘူး။

`test` environment နဲ့ `development`, `production` နှစ်ခုကြားမှာ သတိထားရမယ့် ကွာခြားချက်လေးတစ်ခု ရှိပါတယ်: `.env.local` ကို load လုပ်မှာ မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ tests တွေက လူတိုင်းအတွက် တူညီတဲ့ ရလဒ်တွေ ထုတ်ပေးဖို့ မျှော်လင့်ထားလို့ပါ။ ဒါနဲ့ test execution တိုင်းက သင့် `.env.local` (default ကို override လုပ်ဖို့ ရည်ရွယ်ထားတဲ့ file) ကို လျစ်လျူရှုပြီး — execution တွေကြားမှာ တူညီတဲ့ env defaults တွေကို သုံးပါလိမ့်မယ်။

> **သိထားသင့်သည်** — Default Environment Variables တွေလိုပဲ — `.env.test` file ကို repository ထဲ ထည့်သင့်ပြီး `.env.test.local` ကိုတော့ မထည့်သင့်ပါဘူး — `.env*.local` files တွေက `.gitignore` ကနေ လျစ်လျူရှုဖို့ ရည်ရွယ်ထားလို့ပါ။

Unit tests တွေ run လုပ်နေစဉ် — `@next/env` package ကနေ `loadEnvConfig` function ကို သုံးပြီး environment variables တွေကို Next.js လုပ်သလိုမျိုးပဲ load လုပ်ဖို့ သေချာစေနိုင်ပါတယ်:

```js
// ဒါကို Jest global setup file (သို့) အလားတူ testing set-up မှာ သုံးနိုင်ပါတယ်
import { loadEnvConfig } from '@next/env'

export default async () => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}
```

## Environment Variable Load Order (Load လုပ်သည့် အစီအစဉ်)

Environment variables တွေကို အောက်ပါနေရာတွေမှာ — အစီအစဉ်အတိုင်း ရှာဖွေပြီး variable တွေ့တာနဲ့ ရပ်လိုက်ပါတယ်:

1. `process.env`
1. `.env.$(NODE_ENV).local`
1. `.env.local` (`NODE_ENV` က `test` ဆိုရင် စစ်ဆေးမှာ မဟုတ်ပါဘူး)
1. `.env.$(NODE_ENV)`
1. `.env`

ဥပမာ — `NODE_ENV` က `development` ဖြစ်ပြီး variable တစ်ခုကို `.env.development.local` ရော `.env` ရော နှစ်နေရာလုံးမှာ သတ်မှတ်ထားရင် — `.env.development.local` ထဲက value ကို သုံးပါလိမ့်မယ်။

> **သိထားသင့်သည်** — `NODE_ENV` အတွက် ခွင့်ပြုထားတဲ့ values တွေက `production`, `development` နဲ့ `test` ပါ။

## သိထားသင့်သည်

- [`/src` directory](https://nextjs.org/docs/app/building-your-application/configuring/src-directory) သုံးနေရင် — `.env.*` files တွေက သင့် project ရဲ့ root မှာ ရှိနေသင့်ပါတယ်။
- `NODE_ENV` environment variable ကို သတ်မှတ်မထားရင် — Next.js က `next dev` command run လုပ်တဲ့အခါ `development` ကို အလိုအလျောက် သတ်မှတ်ပြီး — တခြား commands တွေအတွက်တော့ `production` ကို သတ်မှတ်ပါတယ်။

## Version History (ဗားရှင်း မှတ်တမ်း)

| Version  | Changes                                       |
| -------- | --------------------------------------------- |
| `v9.4.0` | Support `.env` and `NEXT_PUBLIC_` introduced. |
