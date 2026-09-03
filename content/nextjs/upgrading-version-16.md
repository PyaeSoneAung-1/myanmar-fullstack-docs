---
title: "Version 16 သို့ ပြောင်းရွှေ့ခြင်း (How to upgrade to version 16)"
description: "သင့် Next.js application ကို Version 15 ကနေ 16 ဆီ upgrade လုပ်နည်း — AI agent သုံးနည်း, codemod, Turbopack default, Async Request APIs, React 19.2, caching APIs အသစ်များ, PPR, middleware → proxy, next/image ပြောင်းလဲမှုများ နဲ့ removals များ"
order: 110
source: "https://nextjs.org/docs/app/guides/upgrading/version-16"
status: translated
updated: 2026-09-03
---

## AI agent တစ်ခုကို သုံးခြင်း (အကြံပြုသည်)

AI coding agent တစ်ခုက upgrade ရဲ့ mechanical အပိုင်းတွေကို run လုပ်ခြင်း၊ diff ကို စစ်ဆေးခြင်း၊ နောက်ဆက်တွဲ ဖြစ်ပေါ်လာတဲ့ breakages တွေကို ပြုပြင်ခြင်းနဲ့ app ကို verify လုပ်ခြင်း စတာတွေ လုပ်နိုင်ပါတယ်။ အောက်က prompt က agent ကို — version နဲ့ ကိုက်ညီတဲ့ docs တွေ ဖတ်ဖို့၊ သင့်တော်တဲ့နေရာတွေမှာ codemods တွေ သုံးဖို့၊ အရေးကြီးတဲ့ အပြောင်းအလဲတွေကို ရှင်းပြဖို့နဲ့ ရလဒ်ကို verify လုပ်ဖို့ တောင်းဆိုထားပါတယ်။ Runtime verification tools တချို့က app ကို upgrade လုပ်ပြီးမှပဲ ရနိုင်ပါတယ်။

Agent ကို ဒီ prompt ပေးပါ:

```prompt
Upgrade this app to Next.js 16.

Before editing code, make sure AGENTS.md points at version-matched Next.js docs. If it is missing or outdated, follow [Set up AI agent docs](/docs/app/guides/upgrading/version-16#set-up-ai-agent-docs), then read AGENTS.md.

Then follow the [Next.js 16 upgrade guide](/docs/app/guides/upgrading/version-16) as the source of truth for the migration. Use the [codemod](/docs/app/guides/upgrading/version-16#using-the-codemod) when you're ready to run the mechanical upgrade.

Briefly explain the upgrade plan in user-facing language before making broad changes. Follow the documented defaults and keep moving unless the guide requires a project-specific decision, the change is destructive, credentials or environment setup are missing, or the correct migration is ambiguous. Keep the migration scoped to the upgrade, inspect the diff, run the relevant checks, and fix remaining breaking changes.

After the app is upgraded, use the runtime verification flow from the [AI Coding Agents guide](/docs/app/guides/ai-agents) to confirm it still works. Prefer the `next-dev-loop` skill when it is available (Next.js 16.3 or later with Turbopack); otherwise fall back to the best available `next dev`, browser, and build checks. Open the key interactive UI states and check the Next dev indicator plus browser and server logs. Summarize what changed, what was verified, and what could not be verified.

Before finishing, repeat the post-upgrade check in [Set up AI agent docs](/docs/app/guides/upgrading/version-16#set-up-ai-agent-docs) so the project is ready for future agent work.
```

## သို့မဟုတ် ကိုယ်တိုင် ပြောင်းရွှေ့ခြင်း (Manually)

ကိုယ်တိုင် upgrade လုပ်တာက အဆင့်အနည်းငယ် ပါဝင်ပြီး — အစီအစဉ်လိုက် လုပ်ရပါတယ်:

1. အခု (သို့) နောက်ပိုင်းမှာ assistant (သို့) AI agent သုံးဖို့ စီစဉ်ထားရင် — [AI agent docs တွေ စနစ်ထည့်သွင်းပါ](#set-up-ai-agent-docs)။
2. [Upgrade codemod ကို run လုပ်ပါ](#using-the-codemod)။
3. Codemod run လုပ်ချင်မှာ မဟုတ်ဘူးဆိုရင် — [packages တွေကို ကိုယ်တိုင် တပ်ဆင်ပါ](#install-packages-manually)။
4. အောက်က breaking changes တွေ တစ်ခုချင်းစီ ဖြတ်သန်းပြီး — သက်ဆိုင်ရာ checks တွေ run လုပ်ကာ ကျန်နေတဲ့ ပြဿနာတွေကို ပြုပြင်ပါ။

## Set up AI agent docs (AI agent docs စနစ်ထည့်သွင်းခြင်း)

အထက်က prompt က agent ကို — code မပြင်ခင် ဒါကို လုပ်ဖို့ တောင်းဆိုပါတယ်။ ဒါမှမဟုတ် upgrade မစခင် ကိုယ်တိုင် ကိုယ့် project ကို ပြင်ဆင်ထားနိုင်ပါတယ်။ အပြည့်အစုံ စနစ်ထည့်သွင်းနည်းအတွက် [AI Coding Agents guide](https://nextjs.org/docs/app/guides/ai-agents) ကို ကြည့်ပါ။

```bash filename="Terminal"
npx @next/codemod@canary agents-md
```

Upgrade လုပ်ပြီးနောက် — `AGENTS.md` က တပ်ဆင်ထားတဲ့ Next.js version ရဲ့ docs တွေကို ညွှန်ပြနေသေးလား စစ်ဆေးပါ။ Next.js 16.2 နဲ့ အထက်မှာ — အဲဒါက `node_modules/next/dist/docs/` ထဲမှာ bundled လုပ်ထားတဲ့ docs တွေ ဖြစ်သင့်ပါတယ်။ Pre-upgrade setup က docs တွေကို `.next-docs/` ထဲ download လုပ်ထားခဲ့တယ်ဆိုရင် — `AGENTS.md` ကို bundled docs တွေဆီ ညွှန်ပြအောင် update လုပ်ပြီး — ဘာကမှ ရည်ညွှန်းတော့မှာ မဟုတ်တဲ့အခါ `.next-docs/` ကို ဖယ်ရှားပါ။

Managed block က ဒီလိုပုံ ဖြစ်သင့်ပါတယ်:

```md filename="AGENTS.md"
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
```

## Using the codemod (codemod သုံးခြင်း)

Next.js version 16 ဆီ update လုပ်ဖို့ — `upgrade` [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#160) ကို သုံးနိုင်ပါတယ်:

```bash package="pnpm"
pnpm dlx @next/codemod@canary upgrade latest
```

```bash package="npm"
npx @next/codemod@canary upgrade latest
```

```bash package="yarn"
yarn dlx @next/codemod@canary upgrade latest
```

```bash package="bun"
bunx @next/codemod@canary upgrade latest
```

[Codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#160) က အောက်ပါတို့ကို လုပ်နိုင်ပါတယ်:

- `next.config.js` ကို `turbopack` configuration အသစ် သုံးအောင် update လုပ်ခြင်း
- `next lint` ကနေ ESLint CLI ဆီ ပြောင်းရွှေ့ခြင်း
- Deprecated ဖြစ်နေတဲ့ `middleware` convention ကနေ `proxy` ဆီ ပြောင်းရွှေ့ခြင်း
- Stabilized ဖြစ်သွားတဲ့ APIs တွေဆီက `unstable_` prefix တွေကို ဖယ်ရှားခြင်း
- Pages နဲ့ layouts တွေကနေ `experimental_ppr` Route Segment Config ကို ဖယ်ရှားခြင်း

`upgrade` codemod က migration codemod တိုင်းကို run လုပ်တာ မဟုတ်ပါဘူး။ သင့် app က Next.js 15 compatibility ကာလက synchronous `params`, `searchParams`, `cookies()`, `headers()`, (သို့) `draftMode()` access တွေကို သုံးနေသေးတယ်ဆိုရင် — async Request APIs codemod ကိုပါ run လုပ်ပါ:

```bash filename="Terminal"
npx @next/codemod@canary next-async-request-api .
```

## Install packages manually (packages တွေကို ကိုယ်တိုင် တပ်ဆင်ခြင်း)

ကိုယ်တိုင် လုပ်ချင်တယ်ဆိုရင် — နောက်ဆုံး Next.js နဲ့ React versions တွေကို တပ်ဆင်ပါ:

```bash package="pnpm"
pnpm add next@latest react@latest react-dom@latest
```

```bash package="npm"
npm install next@latest react@latest react-dom@latest
```

```bash package="yarn"
yarn add next@latest react@latest react-dom@latest
```

```bash package="bun"
bun add next@latest react@latest react-dom@latest
```

TypeScript သုံးနေတယ်ဆိုရင် — `@types/react` နဲ့ `@types/react-dom` တွေကိုပါ နောက်ဆုံး versions တွေဆီ upgrade လုပ်ထားကြောင်း သေချာပါစေ။

## Node.js runtime နဲ့ browser ထောက်ပံ့မှု

| Requirement   | Change / Details                                                   |
| ------------- | ------------------------------------------------------------------ |
| Node.js 20.9+ | Minimum version က အခု `20.9.0` (LTS) ဖြစ်ပါတယ်; Node.js 18 ကို ထောက်ပံ့တော့မှာ မဟုတ်ပါဘူး |
| TypeScript 5+ | Minimum version က အခု `5.1.0` ဖြစ်ပါတယ်                            |
| Browsers      | Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+                  |

## Turbopack က default ဖြစ်လာခြင်း

**Next.js 16** ကစပြီး — Turbopack က stable ဖြစ်ပြီး `next dev` နဲ့ `next build` တွေမှာ default အနေနဲ့ သုံးပါတယ်။

အရင်က Turbopack ကို `--turbopack` (သို့) `--turbo` နဲ့ ဖွင့်ပေးရပါတယ်။

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start"
  }
}
```

ဒါတွေ မလိုအပ်တော့ပါဘူး။ သင့် `package.json` scripts တွေကို update လုပ်နိုင်ပါတယ်:

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

သင့် project မှာ [custom `webpack`](/docs/nextjs/next-config-webpack) configuration ရှိပြီး — `next build` (အခု default အနေနဲ့ Turbopack သုံးနေတဲ့) run လုပ်ရင် — misconfiguration ပြဿနာတွေ မဖြစ်အောင် build က **fail** ဖြစ်ပါလိမ့်မယ်။

ဒါကို ဖြေရှင်းဖို့ နည်းလမ်း အနည်းငယ် ရှိပါတယ်:

- **Turbopack ကို ဆက်သုံးပါ:** `next build --turbopack` နဲ့ run ပြီး — Turbopack သုံးကာ သင့် `webpack` config ကို လျစ်လျူရှုပါ။
- **Turbopack ဆီ အပြည့်အဝ ပြောင်းပါ:** သင့် `webpack` config ကို Turbopack-compatible options တွေဆီ ပြောင်းရွှေ့ပါ။
- **Webpack ကို ဆက်သုံးပါ:** Turbopack ကနေ opt out လုပ်ဖို့ `--webpack` flag ကို သုံးပြီး Webpack နဲ့ build လုပ်ပါ။

> **သိထားသင့်သည်**: `webpack` configuration တစ်ခု တွေ့လို့ build fail ဖြစ်နေပေမယ့် — ကိုယ်တိုင် သတ်မှတ်ထားတာ မဟုတ်ဘူးဆိုရင် plugin တစ်ခုက `webpack` option ကို ထည့်နေတာ ဖြစ်နိုင်ပါတယ်။

### Turbopack ကနေ Opt out လုပ်ခြင်း

Webpack ကို ဆက်သုံးဖို့ လိုအပ်ရင် — `--webpack` flag နဲ့ opt out လုပ်နိုင်ပါတယ်။ ဥပမာ — development မှာ Turbopack သုံးပြီး production builds တွေအတွက် Webpack သုံးချင်ရင်:

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev",
    "build": "next build --webpack",
    "start": "next start"
  }
}
```

Development ရော production အတွက်ပါ Turbopack သုံးဖို့ အကြံပြုပါတယ်။ Turbopack ဆီ ပြောင်းလို့ မရဘူးဆိုရင် — ဒီ [thread](https://github.com/vercel/next.js/discussions/77721) မှာ comment ပေးပါ။

### Turbopack configuration နေရာ

`experimental.turbopack` configuration က experimental အဆင့်ကနေ ထွက်သွားပါပြီ။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

// Next.js 15 - experimental.turbopack
const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      // options
    },
  },
}

export default nextConfig
```

ဒါကို top-level `turbopack` option အဖြစ် သုံးနိုင်ပါတယ်:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

// Next.js 16 - turbopack at the top level of nextConfig
const nextConfig: NextConfig = {
  turbopack: {
    // options
  },
}

export default nextConfig
```

`Turbopack` configuration [options တွေကို ပြန်လည် သုံးသပ်ဖို့ မမေ့ပါနဲ့](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)။ **Next.js 16** မှာ တိုးတက်မှုတွေနဲ့ options အသစ်တွေ အများအပြား ပါဝင်လာပါတယ်၊ ဥပမာ:

- [Advanced Webpack loader conditions](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#advanced-webpack-loader-conditions)
- [debugIds](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#debug-ids)

### Resolve alias fallback

Project တချို့မှာ — client-side code တွေက Node.js native modules တွေ ပါတဲ့ files တွေကို import လုပ်နိုင်ပါတယ်။ ဒါက `Module not found: Can't resolve 'fs'` လို error တွေ ဖြစ်စေပါလိမ့်မယ်။

ဒီလိုဖြစ်ရင် — သင့် client-side bundles တွေက ဒီ Node.js native modules တွေကို ရည်ညွှန်းမနေအောင် code ကို refactor လုပ်သင့်ပါတယ်။

ဒါပေမယ့် — တချို့ case တွေမှာ ဒါ မဖြစ်နိုင်ပါဘူး။ Webpack မှာ `resolve.fallback` option ကို error ကို **တိတ်ဆိတ်စေဖို့** ပုံမှန် သုံးပါတယ်။ Turbopack မှာတော့ `turbopack.resolveAlias` ဆိုတဲ့ အလားတူ option တစ်ခု ရှိပါတယ်။ ဒီကိစ္စမှာ — browser အတွက် `fs` ကို တောင်းဆိုလာတဲ့အခါ empty module တစ်ခုကို load လုပ်ဖို့ Turbopack ကို ပြောပါ။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      fs: {
        browser: './empty.ts', // We recommend to fix code imports before using this method
      },
    },
  },
}

export default nextConfig
```

သင့် modules တွေကို — client code က Node.js native modules တွေ သုံးတဲ့ modules တွေကနေ ဘယ်တော့မှ import မလုပ်အောင် — refactor လုပ်တာက ပိုကောင်းပါတယ်။

### Sass node_modules imports

Turbopack က `node_modules` ကနေ Sass files တွေ import လုပ်တာကို အပြည့်အဝ ထောက်ပံ့ပါတယ်။ Webpack က legacy tilde (`~`) prefix ကို ခွင့်ပြုခဲ့ပေမယ့် — Turbopack ကတော့ ဒီ syntax ကို မထောက်ပံ့ပါဘူးဆိုတာ သတိပြုပါ။

Webpack မှာ:

```scss filename="styles/globals.scss"
@import '~bootstrap/dist/css/bootstrap.min.css';
```

Turbopack မှာ:

```scss filename="styles/globals.scss"
@import 'bootstrap/dist/css/bootstrap.min.css';
```

Imports တွေကို ပြောင်းလို့ မရဘူးဆိုရင် — `turbopack.resolveAlias` ကို သုံးနိုင်ပါတယ်။ ဥပမာ:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '~*': '*',
    },
  },
}

export default nextConfig
```

### Turbopack File System Caching

Turbopack က run တစ်ခုနဲ့တစ်ခု အကြားမှာ compiler artifacts တွေကို disk ပေါ်မှာ သိမ်းဆည်းထားပြီး — restart လုပ်တွေကြားမှာတောင် compile times တွေ သိသိသာသာ မြန်ဆန်စေပါတယ်။ Filesystem caching က `next dev` ရော `next build` အတွက်ပါ default အနေနဲ့ ဖွင့်ထားပြီး — `experimental.turbopackFileSystemCacheForDev` နဲ့ `experimental.turbopackFileSystemCacheForBuild` တွေကတစ်ဆင့် ထိန်းချုပ်ပါတယ်။ တစ်ခုခုကို configure (သို့) disable လုပ်ဖို့ [Turbopack FileSystem Caching](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache) ကို ကြည့်ပါ။

## Async Request APIs (Breaking change)

Version 15 မှာ [Async Request APIs](https://nextjs.org/docs/app/guides/upgrading/version-15#async-request-apis-breaking-change) တွေကို — **ယာယီ** synchronous compatibility နဲ့အတူ — breaking change အဖြစ် မိတ်ဆက်ခဲ့ပါတယ်။

**Next.js 16** ကစပြီး — synchronous access တွေကို လုံးဝ ဖယ်ရှားလိုက်ပါပြီ။ ဒီ APIs တွေကို asynchronous အနေနဲ့ပဲ ဝင်ရောက်နိုင်ပါတော့တယ်။

- [`cookies`](/docs/nextjs/cookies)
- [`headers`](/docs/nextjs/headers)
- [`draftMode`](/docs/nextjs/draft-mode)
- [`layout.js`](/docs/nextjs/file-conventions-layout), [`page.js`](/docs/nextjs/file-conventions-page), [`route.js`](/docs/nextjs/file-conventions-route), [`default.js`](/docs/nextjs/file-conventions-default), [`opengraph-image`](/docs/nextjs/opengraph-image), [`twitter-image`](/docs/nextjs/opengraph-image), [`icon`](/docs/nextjs/app-icons), နဲ့ [`apple-icon`](/docs/nextjs/app-icons) တွေထဲက `params`
- [`page.js`](/docs/nextjs/file-conventions-page) ထဲက `searchParams`

Async Request-time APIs တွေဆီ ပြောင်းဖို့ [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#migrate-to-async-dynamic-apis) ကို သုံးပါ။

### Async Request-time APIs အတွက် types တွေ ပြောင်းရွှေ့ခြင်း

Async `params` နဲ့ `searchParams` တွေဆီ ပြောင်းဖို့ ကူညီချက်အနေနဲ့ — ဒီ globally available type helpers တွေကို အလိုအလျောက် generate လုပ်ဖို့ [`npx next typegen`](https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options) ကို run လုပ်နိုင်ပါတယ်:

- [`PageProps`](/docs/nextjs/file-conventions-page)
- [`LayoutProps`](/docs/nextjs/file-conventions-layout)
- [`RouteContext`](/docs/nextjs/file-conventions-route)

> **သိထားသင့်သည်**: `typegen` ကို Next.js 15.5 မှာ မိတ်ဆက်ခဲ့ပါတယ်။

ဒါက async API pattern အသစ်ဆီ type-safe ဖြစ်တဲ့ ပြောင်းရွှေ့မှုကို ရိုးရှင်းစေပြီး — သင့် components တွေကို type safety အပြည့်နဲ့ update လုပ်နိုင်စေပါတယ်။ ဥပမာ:

```tsx filename="/app/blog/[slug]/page.tsx"
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
  return <h1>Blog Post: {slug}</h1>
}
```

ဒီနည်းလမ်းက `props.params` (အဲဒီထဲမှာ `slug` ပါ) နဲ့ `searchParams` တွေကို — သင့် page ထဲမှာ တိုက်ရိုက် — type safety အပြည့် ဝင်ရောက်နိုင်စေပါတယ်။

## Icon နဲ့ open-graph Image အတွက် Async parameters (Breaking change)

> `opengraph-image`, `twitter-image`, `icon`, နဲ့ `apple-icon` တွေထဲက image generating functions တွေဆီ ပို့တဲ့ props တွေက အခု Promises တွေ ဖြစ်သွားပါပြီ။

အရင် versions တွေမှာ — `Image` (image generation function) ရော `generateImageMetadata` ပါ `params` object တစ်ခုကို လက်ခံခဲ့ပါတယ်။ `generateImageMetadata` က ပြန်ပေးတဲ့ `id` ကို image generation function ဆီ string အနေနဲ့ ပို့ပေးခဲ့ပါတယ်။

```js filename="app/shop/[slug]/opengraph-image.js"
// Next.js 15 - synchronous params access
export function generateImageMetadata({ params }) {
  const { slug } = params
  return [{ id: '1' }, { id: '2' }]
}

// Next.js 15 - synchronous params and id access
export default function Image({ params, id }) {
  const slug = params.slug
  const imageId = id // string
  // ...
}
```

**Next.js 16** ကစပြီး — [Async Request APIs](#async-request-apis-breaking-change) ပြောင်းလဲမှုနဲ့ ကိုက်ညီအောင် — image generating function က `params` နဲ့ `id` တွေကို promises အနေနဲ့ လက်ခံရရှိပါတယ်။ `generateImageMetadata` function ကတော့ synchronous `params` တွေကို ဆက်လက် လက်ခံပါတယ်။

```js filename="app/shop/[slug]/opengraph-image.js"
export async function generateImageMetadata({ params }) {
  const { slug } = params
  return [{ id: '1' }, { id: '2' }]
}

// Next.js 16 - asynchronous params and id access
export default async function Image({ params, id }) {
  const { slug } = await params // params now async
  const imageId = await id // id is now Promise<string> when using generateImageMetadata
  // ...
}
```

## `sitemap` အတွက် Async `id` parameter (Breaking change)

အရင်က — [`generateSitemaps`](/docs/nextjs/generate-sitemaps) ကနေ ပြန်ပေးတဲ့ `id` values တွေကို `sitemap` generating function ဆီ တိုက်ရိုက် ပို့ပေးခဲ့ပါတယ်။

```js filename="app/product/sitemap.js"
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

// Next.js 15 - synchronous id access
export default async function sitemap({ id }) {
  const start = id * 50000 // id is a number
  // ...
}
```

**Next.js 16** ကစပြီး — `sitemap` generating function က `id` ကို promise အနေနဲ့ လက်ခံရရှိပါတယ်။

```js filename="app/product/sitemap.js"
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

// Next.js 16 - asynchronous id access
export default async function sitemap({ id }) {
  const resolvedId = await id // id is now Promise<string>
  const start = Number(resolvedId) * 50000
  // ...
}
```

## React 19.2

**Next.js 16** ထဲက App Router က နောက်ဆုံး React [Canary release](https://react.dev/blog/2023/05/03/react-canaries) ကို သုံးပါတယ် — အဲဒီထဲမှာ အသစ်ထွက်ရှိထားတဲ့ React 19.2 features တွေနဲ့ တဖြည်းဖြည်း stabilized ဖြစ်နေတဲ့ တခြား features တွေ ပါဝင်ပါတယ်။ အထူးချွန်ဆုံးတွေကတော့:

- **[View Transitions](https://react.dev/reference/react/ViewTransition)**: Transition (သို့) navigation တစ်ခုအတွင်းမှာ update ဖြစ်တဲ့ elements တွေကို animate လုပ်ခြင်း
- **[`useEffectEvent`](https://react.dev/reference/react/useEffectEvent)**: Effects တွေကနေ non-reactive logic တွေကို ပြန်သုံးလို့ရတဲ့ Effect Event functions တွေအဖြစ် ထုတ်ယူခြင်း
- **[Activity](https://react.dev/reference/react/Activity)**: UI တွေကို `display: none` နဲ့ ဖျောက်ထားပြီး — state တွေကို ထိန်းသိမ်းကာ Effects တွေကို ရှင်းလင်းပေးတဲ့ "background activity" တွေကို render လုပ်ခြင်း

[React 19.2 ကြေညာချက်](https://react.dev/blog/2025/10/01/react-19-2) မှာ ပိုလေ့လာနိုင်ပါတယ်။

## React Compiler အတွက် ထောက်ပံ့မှု

React Compiler ရဲ့ 1.0 release ပြီးနောက် — **Next.js 16** မှာ React Compiler အတွက် built-in ထောက်ပံ့မှုက stable ဖြစ်သွားပါပြီ။ React Compiler က components တွေကို အလိုအလျောက် memoize လုပ်ပြီး — manual code changes ဘာမှ မလိုဘဲ unnecessary re-renders တွေကို လျှော့ချပေးပါတယ်။

`reactCompiler` configuration option က experimental ကနေ stable အဆင့်ကို တိုးမြှင့်လိုက်ပါပြီ။ Application အမျိုးအစား အမျိုးမျိုးမှာ build performance data တွေ ဆက်စုဆောင်းနေတာမို့ — default အနေနဲ့တော့ မဖွင့်ထားပါဘူး။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
}

export default nextConfig
```

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
}

module.exports = nextConfig
```

React Compiler plugin ရဲ့ နောက်ဆုံး version ကို တပ်ဆင်ပါ:

```bash package="pnpm"
pnpm add -D babel-plugin-react-compiler
```

```bash package="npm"
npm install -D babel-plugin-react-compiler
```

```bash package="yarn"
yarn add -D babel-plugin-react-compiler
```

```bash package="bun"
bun add -D babel-plugin-react-compiler
```

> **သိထားသင့်သည်:** ဒီ option ကို ဖွင့်ထားရင် — React Compiler က Babel ပေါ်မှာ မှီခိုနေလို့ development ရော builds တွေမှာပါ compile times တွေ ပိုမြင့်လာနိုင်တာ မျှော်လင့်ပါ။

## Caching APIs

### revalidateTag

[`revalidateTag`](/docs/nextjs/revalidate-tag) က အခု — [`cacheLife`](/docs/nextjs/cache-life) profile တစ်ခုကို သတ်မှတ်တဲ့ ဒုတိယ argument တစ်ခု လိုအပ်ပါတယ်။ Argument တစ်ခုတည်း သုံးတဲ့ပုံစံက deprecated ဖြစ်ပြီး — TypeScript error တစ်ခု ထွက်ပါလိမ့်မယ်။

```ts
// Before
revalidateTag('posts')

// After
revalidateTag('posts', 'max')
```

Stale-while-revalidate မလိုဘဲ ချက်ချင်း expiration လိုအပ်ရင် — Server Actions တွေထဲမှာ [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag) ကို သုံးပါ။

```ts filename="app/actions.ts"
'use server'

import { revalidateTag } from 'next/cache'

export async function updateArticle(articleId: string) {
  // Mark article data as stale - article readers see stale data while it revalidates
  revalidateTag(`article-${articleId}`, 'max')
}
```

```js filename="app/actions.js"
'use server'

import { revalidateTag } from 'next/cache'

export async function updateArticle(articleId) {
  // Mark article data as stale - article readers see stale data while it revalidates
  revalidateTag(`article-${articleId}`, 'max')
}
```

Blog posts, product catalogs (သို့) documentation လို — update မှာ slight delay လက်ခံနိုင်တဲ့ content တွေအတွက် `revalidateTag` ကို သုံးပါ။ Fresh data တွေ background မှာ load လုပ်နေတုန်း — users တွေက stale content ကို ရကြပါတယ်။

### updateTag

[`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag) က Server Actions တွေမှာပဲ သုံးလို့ရတဲ့ API အသစ်တစ်ခုဖြစ်ပြီး — **read-your-writes** semantics တွေ ပေးပါတယ် — ဆိုလိုတာက user တစ်ယောက် အပြောင်းအလဲတစ်ခု လုပ်လိုက်ရင် stale data မဟုတ်ဘဲ ပြောင်းလဲမှုကို UI ထဲမှာ ချက်ချင်း မြင်ရပါတယ်။

ဒါက request တစ်ခုတည်းအတွင်းမှာ data တွေကို expire လုပ်ပြီး ချက်ချင်း refresh လုပ်ခြင်းအားဖြင့် လုပ်ဆောင်ပါတယ်။

```ts filename="app/actions.ts"
'use server'

import { updateTag } from 'next/cache'

export async function updateUserProfile(userId: string, profile: Profile) {
  await db.users.update(userId, profile)

  // Expire cache and refresh immediately - user sees their changes right away
  updateTag(`user-${userId}`)
}
```

```js filename="app/actions.js"
'use server'

import { updateTag } from 'next/cache'

export async function updateUserProfile(userId, profile) {
  await db.users.update(userId, profile)

  // Expire cache and refresh immediately - user sees their changes right away
  updateTag(`user-${userId}`)
}
```

ဒါက interactive features တွေ ပြောင်းလဲမှုတွေကို ချက်ချင်း ထင်ဟပ်စေကြောင်း သေချာစေပါတယ်။ Forms, user settings နဲ့ — users တွေ သူတို့ရဲ့ updates တွေကို ချက်ချင်း မြင်ရမယ်လို့ မျှော်လင့်တဲ့ workflow တိုင်းအတွက် သင့်တော်ပါတယ်။

`updateTag` (သို့) `revalidateTag` ကို ဘယ်အခါ သုံးသင့်လဲ ဆိုတာ [ဒီမှာ](https://nextjs.org/docs/app/api-reference/functions/updateTag#when-to-use-updatetag) လေ့လာနိုင်ပါတယ်။

### refresh

[`refresh`](/docs/nextjs/refresh) က Server Action တစ်ခုအတွင်းကနေ client router ကို refresh လုပ်နိုင်စေပါတယ်။

```ts filename="app/actions.ts"
'use server'

import { refresh } from 'next/cache'

export async function markNotificationAsRead(notificationId: string) {
  // Update the notification in the database
  await db.notifications.markAsRead(notificationId)

  // Refresh the notification count displayed in the header
  refresh()
}
```

```js filename="app/actions.js"
'use server'

import { refresh } from 'next/cache'

export async function markNotificationAsRead(notificationId) {
  // Update the notification in the database
  await db.notifications.markAsRead(notificationId)

  // Refresh the notification count displayed in the header
  refresh()
}
```

Action တစ်ခု လုပ်ဆောင်ပြီးနောက် client router ကို refresh လုပ်ဖို့ လိုအပ်တဲ့အခါ သုံးပါ။

### cacheLife နဲ့ cacheTag

[`cacheLife`](/docs/nextjs/cache-life) နဲ့ [`cacheTag`](/docs/nextjs/cache-tag) တွေက အခု stable ဖြစ်သွားပါပြီ။ `unstable_` prefix မလိုအပ်တော့ပါဘူး။

ဒီလို aliased imports တွေ သုံးထားတဲ့နေရာတိုင်းမှာ:

```ts
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache'
```

သင့် imports တွေကို ဒီလို update လုပ်နိုင်ပါတယ်:

```ts
import { cacheLife, cacheTag } from 'next/cache'
```

## Routing နဲ့ Navigation မြှင့်တင်မှုများ

**Next.js 16** မှာ routing နဲ့ navigation စနစ်ကို လုံးလုံး ပြန်လည် ပြင်ဆင်ထားပြီး — page transitions တွေကို ပိုပြီး ပေါ့ပါး၊ မြန်ဆန်စေပါတယ်။ ဒါက Next.js က navigation data တွေကို prefetch လုပ်ပြီး cache လုပ်တဲ့ နည်းလမ်းကို optimize လုပ်ပါတယ်:

- **Layout deduplication**: Shared layout တစ်ခုပါတဲ့ URLs အများအပြားကို prefetch လုပ်တဲ့အခါ — layout ကို တစ်ခါပဲ download လုပ်ပါတယ်။
- **Incremental prefetching**: Next.js က page တစ်ခုလုံး မဟုတ်ဘဲ — cache ထဲမှာ မရှိသေးတဲ့ အပိုင်းတွေကိုပဲ prefetch လုပ်ပါတယ်။

ဒီပြောင်းလဲမှုတွေက **code ပြင်စရာ ဘာမှ မလိုဘဲ** — app အားလုံးရဲ့ performance ကို မြှင့်တင်ဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်။

ဒါပေမယ့် — total transfer size တွေ အများကြီး ပိုနည်းပြီး prefetch request တစ်ခုချင်း အရေအတွက် ပိုများတာကို သင်တွေ့ရနိုင်ပါတယ်။ ဒါက app တွေအားလုံးနီးပါးအတွက် မှန်ကန်တဲ့ trade-off လို့ ကျွန်တော်တို့ ယုံကြည်ပါတယ်။

Request အရေအတွက် များလာတာက ပြဿနာ ဖြစ်စေတယ်ဆိုရင် — [issue](https://github.com/vercel/next.js/issues) (သို့) [discussion](https://github.com/vercel/next.js/discussions) item တစ်ခု ဖန်တီးပြီး ကျွန်တော်တို့ကို အသိပေးပါ။

## Partial Prerendering (PPR)

**Next.js 16** မှာ experimental **Partial Prerendering (PPR)** flag နဲ့ configuration options တွေကို ဖယ်ရှားလိုက်ပါပြီ — route level segment `experimental_ppr` အပါအဝင်ပါ။

**Next.js 16** ကစပြီး — [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) configuration ကို သုံးပြီး PPR ထဲ opt in လုပ်နိုင်ပါတယ်။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
}

module.exports = nextConfig
```

**Next.js 16** ထဲက PPR က **Next.js 15** canaries တွေထဲကနဲ့ မတူညီပါဘူး။ အခု PPR သုံးနေတယ်ဆိုရင် — သင်သုံးနေတဲ့ လက်ရှိ Next.js 15 canary မှာပဲ ဆက်နေပါ။ Migration patterns တွေအတွက် [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components) ကို ကြည့်ပါ။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  // If you are using PPR today
  // stay in the current Next.js 15 canary
  experimental: {
    ppr: true,
  },
}

module.exports = nextConfig
```

## `middleware` ကနေ `proxy` သို့

`middleware` filename က deprecated ဖြစ်ပြီး — network boundary နဲ့ routing focus ကို ရှင်းလင်းစေဖို့ `proxy` လို့ အမည်ပြောင်းလိုက်ပါပြီ။

`edge` runtime ကို `proxy` မှာ **မထောက်ပံ့ပါဘူး**။ `proxy` ရဲ့ runtime က `nodejs` ဖြစ်ပြီး — configure လုပ်လို့ မရပါဘူး။ `edge` runtime ကို ဆက်သုံးချင်တယ်ဆိုရင် — `middleware` ကိုပဲ ဆက်သုံးပါ။ Minor release တစ်ခုမှာ `edge` runtime အတွက် နောက်ထပ် ညွှန်ကြားချက်တွေ ထပ်ပေးပါမယ်။

```bash filename="Terminal"
# Rename your middleware file
mv middleware.ts proxy.ts
# or
mv middleware.js proxy.js
```

Named export `middleware` လည်း deprecated ဖြစ်ပါတယ်။ သင့် function ကို `proxy` လို့ အမည်ပြောင်းပါ။

```ts filename="proxy.ts"
export function proxy(request: Request) {}
```

```js filename="proxy.js"
export function proxy(request) {}
```

Default export သုံးနေရင်တောင် — function name ကို `proxy` လို့ ပြောင်းဖို့ အကြံပြုပါတယ်။

`middleware` နာမည် ပါဝင်တဲ့ configuration flags တွေလည်း အမည်ပြောင်းသွားပါပြီ။ ဥပမာ — `skipMiddlewareUrlNormalize` က အခု `skipProxyUrlNormalize` ဖြစ်သွားပါပြီ။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  skipProxyUrlNormalize: true,
}

export default nextConfig
```

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  skipProxyUrlNormalize: true,
}

module.exports = nextConfig
```

Version 16 [codemod](https://nextjs.org/docs/app/guides/upgrading/codemods#160) က ဒီ flags တွေကိုပါ update လုပ်နိုင်ပါတယ်။

## `next/image` ပြောင်းလဲမှုများ

### Query Strings ပါတဲ့ Local Images (Breaking change)

Query strings ပါတဲ့ local image sources တွေက enumeration attacks တွေ မဖြစ်အောင် — အခု `images.localPatterns.search` configuration လိုအပ်ပါတယ်။

```tsx filename="app/page.tsx"
import Image from 'next/image'

export default function Page() {
  return <Image src="/assets/photo?v=1" alt="Photo" width="100" height="100" />
}
```

Local images တွေနဲ့ query strings သုံးဖို့ လိုအပ်ရင် — သင့် configuration ထဲမှာ pattern ကို ထည့်ပါ:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '?v=1',
      },
    ],
  },
}

export default nextConfig
```

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/assets/**',
        search: '?v=1',
      },
    ],
  },
}

module.exports = nextConfig
```

### `minimumCacheTTL` Default (Breaking change)

`images.minimumCacheTTL` ရဲ့ default value က `60 seconds` ကနေ `4 hours` (14400 seconds) ကို ပြောင်းသွားပါပြီ။ ဒါက cache-control headers မပါတဲ့ images တွေအတွက် revalidation စရိတ်ကို လျှော့ချပေးပါတယ်။

Next.js users တချို့မှာ — အထက်က upstream source images တွေက `cache-control` header တစ်ခု လွဲနေတာကြောင့် — image revalidation တွေ မကြာခဏ ဖြစ်နေခဲ့ပါတယ်။ ဒါက revalidation တွေကို `60` စက္ကန့်တိုင်း ဖြစ်စေပြီး — CPU အသုံးပြုမှုနဲ့ စရိတ်တွေ တိုးစေပါတယ်။

Images အများစုက မကြာခဏ မပြောင်းတာမို့ — ဒီတိုတောင်းတဲ့ interval က မစံပြပါဘူး။ Default ကို 4 နာရီ ထားလိုက်တာက — လိုအပ်ရင် images တွေ တစ်နေ့ကို အကြိမ်အနည်းငယ် update ဖြစ်နေဆဲ ခွင့်ပြုရင်းနဲ့ — ပိုကြာရှည်ခံတဲ့ cache တစ်ခုကို default အနေနဲ့ ပေးပါတယ်။

အရင်အပြုအမူ လိုအပ်ရင် — `minimumCacheTTL` ကို ပိုနိမ့်တဲ့ value တစ်ခုဆီ ပြောင်းပါ၊ ဥပမာ `60` စက္ကန့်ဆီ:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60,
  },
}

export default nextConfig
```

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 60,
  },
}

module.exports = nextConfig
```

### `imageSizes` Default (Breaking change)

`16` ဆိုတဲ့ value ကို default `images.imageSizes` array ထဲကနေ ဖယ်ရှားလိုက်ပါပြီ။

Request analytics တွေကို ကြည့်ပြီးတော့ — 16 pixels အကျယ် images တွေကို ဆာဗာလုပ်တဲ့ projects တွေ အလွန်နည်းတာကို တွေ့ခဲ့ရပါတယ်။ ဒီ setting ကို ဖယ်လိုက်တာက — `next/image` က browser ဆီ ပို့တဲ့ `srcset` attribute ရဲ့ အရွယ်အစားကို လျှော့ချပေးပါတယ်။

16px images တွေကို ထောက်ပံ့ဖို့ လိုအပ်ရင်:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

export default nextConfig
```

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

module.exports = nextConfig
```

Developer အသုံးပြုမှု မရှိလို့ မဟုတ်ဘဲ — `devicePixelRatio: 2` က retina displays တွေမှာ မှုန်ဝါးမှု မဖြစ်အောင် 32px image တစ်ခုကို တကယ် fetch လုပ်တာမို့ — 16 pixels width images တွေက ပိုနည်းလာတာ ဖြစ်တယ်လို့ ကျွန်တော်တို့ ယုံကြည်ပါတယ်။

### `qualities` Default (Breaking change)

`images.qualities` ရဲ့ default value က qualities အားလုံး ခွင့်ပြုတာကနေ `[75]` တစ်ခုတည်းကို ပြောင်းသွားပါပြီ။

Quality levels အများအပြား ထောက်ပံ့ဖို့ လိုအပ်ရင်:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    qualities: [50, 75, 100],
  },
}

export default nextConfig
```

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [50, 75, 100],
  },
}

module.exports = nextConfig
```

`image.qualities` array ထဲမှာ မပါတဲ့ `quality` prop တစ်ခုကို သတ်မှတ်ရင် — quality ကို `images.qualities` ထဲက အနီးဆုံး value ဆီ coerced လုပ်ပါလိမ့်မယ်။ ဥပမာ — အထက်က configuration နဲ့ဆို `quality` prop 80 က 75 ဆီ coerced ဖြစ်သွားပါတယ်။

### Local IP Restriction (Breaking change)

Security restriction အသစ်တစ်ခုက local IP optimization တွေကို default အနေနဲ့ ပိတ်ထားပါတယ်။ Private networks တွေအတွက်ပဲ — `images.dangerouslyAllowLocalIP` ကို `true` လို့ သတ်မှတ်ပါ။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true, // Only for private networks
  },
}

export default nextConfig
```

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowLocalIP: true, // Only for private networks
  },
}

module.exports = nextConfig
```

Split-horizon DNS ပါတဲ့ VPC တစ်ခုမှာ Next.js ကို host လုပ်ပြီး status 400 Bad Request တွေ ရနေတယ်ဆိုရင် ဒါ လိုအပ်နိုင်ပါတယ်။ SSRF risk ကို နားလည်ပြီးမှပဲ ဖွင့်ပါ။

### Maximum Redirects (Breaking change)

`images.maximumRedirects` ရဲ့ default က အကန့်အသတ်မရှိ ကနေ redirect 3 ခု အများဆုံးဆီ ပြောင်းသွားပါပြီ။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    maximumRedirects: 0, // Disable redirects
    // or
    maximumRedirects: 5, // Increase for edge cases
  },
}

export default nextConfig
```

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    maximumRedirects: 0, // Disable redirects
    // or
    maximumRedirects: 5, // Increase for edge cases
  },
}

module.exports = nextConfig
```

### `next/legacy/image` Component (deprecated)

`next/legacy/image` component က deprecated ဖြစ်ပါတယ်။ အဲဒီအစား `next/image` ကို သုံးပါ:

```tsx
// Before
import Image from 'next/legacy/image'

// After
import Image from 'next/image'
```

### `images.domains` Configuration (deprecated)

`images.domains` config က deprecated ဖြစ်ပါတယ်။

```js filename="next.config.js"
// image.domains is deprecated
module.exports = {
  images: {
    domains: ['example.com'],
  },
}
```

Security ပိုကောင်းအောင် `images.remotePatterns` ကို သုံးပါ:

```js filename="next.config.js"
// Use image.remotePatterns instead
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
}
```

## Concurrent `dev` နဲ့ `build`

`next dev` နဲ့ `next build` တွေက အခု output directories သီးခြားစီ သုံးပြီး — တစ်ပြိုင်နက် run လုပ်နိုင်ပါတယ်။ `next dev` command က `.next/dev` ဆီ output လုပ်ပါတယ်။

ဒါ့အပြင် — lockfile ယန္တရားတစ်ခုက project တစ်ခုတည်းမှာ `next dev` (သို့) `next build` instance အများအပြား run မဖြစ်အောင် ကာကွယ်ပေးပါတယ်။

[Turbopack tracing command](https://nextjs.org/docs/app/guides/local-development#turbopack-tracing) က ဒီလို ဖြစ်သင့်ပါတယ်:

```bash package="pnpm"
pnpm next internal trace .next-profiles/trace-turbopack.bin
```

```bash package="npm"
npx next internal trace .next-profiles/trace-turbopack.bin
```

```bash package="yarn"
yarn next internal trace .next-profiles/trace-turbopack.bin
```

```bash package="bun"
bunx next internal trace .next-profiles/trace-turbopack.bin
```

## Parallel Routes ရဲ့ `default.js` လိုအပ်ချက်

[Parallel route](/docs/nextjs/parallel-routes) slot တိုင်းမှာ အခု explicit `default.js` files တွေ လိုအပ်ပါပြီ။ ဒါတွေ မရှိရင် builds တွေ fail ဖြစ်ပါလိမ့်မယ်။

အရင်အပြုအမူကို ထိန်းသိမ်းဖို့ — `notFound()` ကို ခေါ်တဲ့ (သို့) `null` ပြန်တဲ့ [`default.js`](/docs/nextjs/file-conventions-default) file တစ်ခု ဖန်တီးပါ။

```tsx filename="app/@modal/default.tsx"
import { notFound } from 'next/navigation'

export default function Default() {
  notFound()
}
```

သို့မဟုတ် `null` ပြန်ပါ:

```tsx filename="app/@modal/default.tsx"
export default function Default() {
  return null
}
```

## ESLint Flat Config

`@next/eslint-plugin-next` က အခု ESLint Flat Config format ကို default အနေနဲ့ သုံးပါတယ် — legacy config support တွေကို ဖျက်သိမ်းမယ့် ESLint v10 နဲ့ ကိုက်ညီအောင်ပါ။

[`@next/eslint-plugin-next`](https://nextjs.org/docs/app/api-reference/config/eslint#setup-eslint) plugin အတွက် ကျွန်တော်တို့ရဲ့ API reference ကို ပြန်လည် သုံးသပ်ဖို့ မမေ့ပါနဲ့။

Legacy `.eslintrc` format သုံးနေတယ်ဆိုရင် — flat config format ဆီ ပြောင်းရွှေ့ဖို့ စဉ်းစားပါ။ အသေးစိတ်အတွက် [ESLint migration guide](https://eslint.org/docs/latest/use/configure/migration-guide) ကို ကြည့်ပါ။

## Scroll Behavior Override

**Next.js ရဲ့ အရင် versions တွေမှာ** — CSS ကနေ `<html>` element ပေါ်မှာ `scroll-behavior: smooth` ကို globally သတ်မှတ်ထားရင် — Next.js က SPA route transitions တွေအတွင်း ဒါကို override လုပ်ပါတယ်:

1. `scroll-behavior` ကို `auto` ဆီ ယာယီ သတ်မှတ်ပြီး
2. Navigation ကို လုပ်ဆောင်ပြီး (ထိပ်ဆုံးဆီ ချက်ချင်း scroll ဖြစ်စေပြီး)
3. မူရင်း `scroll-behavior` value ကို ပြန်ထားပေးပါတယ်။

ဒါက in-page navigation အတွက် smooth scrolling ဖွင့်ထားရင်တောင် — page navigation တွေ အမြဲ မြန်ဆန် ချက်ချင်း ဖြစ်နေစေပါတယ်။ ဒါပေမယ့် — ဒီ manipulation က navigation တိုင်းရဲ့ အစမှာ စရိတ်ကြီးနိုင်ပါတယ်။

**Next.js 16** မှာတော့ ဒီအပြုအမူ ပြောင်းသွားပါပြီ။ Default အားဖြင့် — Next.js က navigation အတွင်း သင့် `scroll-behavior` setting ကို **နောက်တော့ override မလုပ်တော့ပါဘူး**။

**Next.js ကို ဒီ override လုပ်စေချင်တယ်ဆိုရင်** (အရင် default အပြုအမူ) — သင့် `<html>` element ဆီ `data-scroll-behavior="smooth"` attribute ကို ထည့်ပါ:

```tsx filename="app/layout.tsx"
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
```

## Performance မြှင့်တင်မှုများ

`next dev` နဲ့ `next start` commands တွေအတွက် သိသိသာသာ performance optimizations တွေ — ရှင်းလင်းတဲ့ formatting, ပိုကောင်းတဲ့ error messages နဲ့ မြှင့်တင်ထားတဲ့ performance metrics တွေပါတဲ့ terminal output တွေနဲ့အတူ — ပါဝင်ပါတယ်။

**Next.js 16** က `next build` output ထဲက `size` နဲ့ `First Load JS` metrics တွေကို ဖယ်ရှားပါတယ်။ React Server Components တွေသုံးတဲ့ server-driven architectures တွေမှာ ဒါတွေက မမှန်ကန်ဘူးလို့ တွေ့ခဲ့ရပါတယ်။ Turbopack ရော Webpack implementations တွေမှာပါ ပြဿနာတွေ ရှိခဲ့ပြီး — Client Components payload တွေကို ဘယ်လို တွက်ရမလဲဆိုတာမှာ သဘောထား ကွဲလွဲခဲ့ပါတယ်။

တကယ့် route performance ကို တိုင်းတာဖို့ အထိရောက်ဆုံး နည်းလမ်းကတော့ — Core Web Vitals နဲ့ downloaded resource sizes တွေကို အာရုံစိုက်တဲ့ [Chrome Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) (သို့) Vercel Analytics လို tools တွေပဲ ဖြစ်ပါတယ်။

### `next dev` config load

အရင် versions တွေမှာ Next config file ကို development ကာလအတွင်း နှစ်ခါ load လုပ်ခဲ့ပါတယ်:

- `next dev` command ကို run လုပ်တဲ့အခါ
- `next dev` command က Next.js server ကို စတင်တဲ့အခါ

`next dev` command က Next.js server စတင်ဖို့ config file မလိုအပ်တာမို့ — ဒါက မထိရောက်ပါဘူး။

ဒီပြောင်းလဲမှုရဲ့ နောက်ဆက်တွဲတစ်ခုက — `next dev` run လုပ်တဲ့အခါ သင့် Next.js config file ထဲမှာ `process.argv` ထဲ `'dev'` ပါမပါ စစ်ဆေးရင် `false` ပြန်ပါလိမ့်မယ်။

> **သိထားသင့်သည်**: `typegen` နဲ့ `build` commands တွေကတော့ `process.argv` ထဲမှာ မြင်ရဆဲ ဖြစ်ပါတယ်။

`next dev` ပေါ်မှာ side-effects trigger လုပ်တဲ့ plugins တွေအတွက် ဒါက အထူး အရေးကြီးပါတယ်။ အဲဒီလိုဆိုရင် — `NODE_ENV` က `development` ဖြစ်မဖြစ် စစ်ဆေးတာက လုံလောက်နိုင်ပါတယ်။

```js filename="next.config.js"
import { startServer } from 'docs-lib/dev-server'

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  startServer()
}

const nextConfig = {
  /* Your config options */
}

module.exports = nextConfig
```

တနည်းအားဖြင့် — configuration ကို load လုပ်တဲ့ [`phase`](https://nextjs.org/docs/app/api-reference/config/next-config-js#phase) ကို သုံးပါ။

## Build Adapters API (alpha)

[Build Adapters RFC](https://github.com/vercel/next.js/discussions/77740) ပြီးနောက်မှာ — Build Adapters API ရဲ့ ပထမဆုံး alpha version ကို အခု ရနိုင်ပါပြီ။

Build Adapters တွေက သင့်ကို — build process ထဲကို hook ဝင်တဲ့ custom adapters တွေ ဖန်တီးနိုင်စေပြီး — deployment platforms နဲ့ custom build integrations တွေက Next.js configuration တွေကို ပြုပြင် (သို့) build output တွေကို process လုပ်နိုင်စေပါတယ်။

```js filename="next.config.js"
const nextConfig = {
  experimental: {
    adapterPath: require.resolve('./my-adapter.js'),
  },
}

module.exports = nextConfig
```

`adapterPath` ကို 16.2.0 မှာ stable, top-level option အဖြစ် မြှင့်တင်လိုက်ပါပြီ။ လက်ရှိ API reference အတွက် [`adapterPath`](https://nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath) ကို ကြည့်ပါ။

## Modern Sass API

`sass-loader` ကို v16 ဆီ bump လုပ်ထားပြီး — [modern Sass syntax](https://sass-lang.com/documentation/js-api/#md:usage) တွေနဲ့ features အသစ်တွေကို ထောက်ပံ့ပါတယ်။

## ဖယ်ရှားမှုများ (Removals)

ဒီ features တွေက အရင်က deprecated ဖြစ်ခဲ့ပြီး — အခု လုံးဝ ဖယ်ရှားလိုက်ပါပြီ:

### AMP Support

AMP ရဲ့ အသုံးပြုမှုက သိသိသာသာ ကျဆင်းသွားပြီး — ဒီ feature ကို ထိန်းသိမ်းတာက framework ကို ရှုပ်ထွေးစေတာမို့ — AMP APIs နဲ့ configurations အားလုံးကို ဖယ်ရှားလိုက်ပါပြီ:

- သင့် Next config file ကနေ `amp` configuration
- `next/amp` hook imports နဲ့ အသုံးပြုမှု (`useAmp`)

```tsx
// Removed
import { useAmp } from 'next/amp'

// Removed
export const config = { amp: true }
```

- Pages တွေကနေ `export const config = { amp: true }`

```js filename="next.config.js"
const nextConfig = {
  // Removed
  amp: {
    canonicalBase: 'https://example.com',
  },
}

module.exports = nextConfig
```

သင့် use case အတွက် AMP က မလိုအပ်တော့ဘူးလား ဆုံးဖြတ်ပါ။ Performance အကျိုးကျေးဇူး အများစုကို အခု Next.js ရဲ့ built-in optimizations တွေနဲ့ ခေတ်မီ web standards တွေကနေ ရနိုင်ပါပြီ။

### `next lint` Command

`next lint` command ကို ဖယ်ရှားလိုက်ပါပြီ။ Biome (သို့) ESLint ကို တိုက်ရိုက် သုံးပါ။ `next build` က linting တွေ ဆက်မလုပ်တော့ပါဘူး။

Migration ကို အလိုအလျောက် လုပ်ဖို့ codemod တစ်ခု ရနိုင်ပါတယ်:

```bash package="pnpm"
pnpm dlx @next/codemod@canary next-lint-to-eslint-cli .
```

```bash package="npm"
npx @next/codemod@canary next-lint-to-eslint-cli .
```

```bash package="yarn"
yarn dlx @next/codemod@canary next-lint-to-eslint-cli .
```

```bash package="bun"
bunx @next/codemod@canary next-lint-to-eslint-cli .
```

Next.js config file ထဲက `eslint` option ကိုလည်း ဖယ်ရှားလိုက်ပါပြီ။

```js filename="next.config.mjs"
/** @type {import('next').NextConfig} */
const nextConfig = {
  // No longer supported
  // eslint: {},
}

export default nextConfig
```

### Runtime Configuration

`serverRuntimeConfig` နဲ့ `publicRuntimeConfig` တွေကို ဖယ်ရှားလိုက်ပါပြီ။ အဲဒီအစား environment variables တွေကို သုံးပါ။

**Before (Next.js 15):**

```js filename="next.config.js"
module.exports = {
  serverRuntimeConfig: {
    dbUrl: process.env.DATABASE_URL,
  },
  publicRuntimeConfig: {
    apiUrl: '/api',
  },
}
```

```tsx filename="pages/index.tsx"
import getConfig from 'next/config'

export default function Page() {
  const { publicRuntimeConfig } = getConfig()
  return <p>API URL: {publicRuntimeConfig.apiUrl}</p>
}
```

**After (Next.js 16):**

Server-only values တွေအတွက် — Server Components တွေထဲမှာ environment variables တွေကို တိုက်ရိုက် ဝင်ရောက်ပါ:

```tsx filename="app/page.tsx"
async function fetchData() {
  const dbUrl = process.env.DATABASE_URL
  // Use for server-side operations only
  return await db.query(dbUrl, 'SELECT * FROM users')
}

export default async function Page() {
  const data = await fetchData()
  return <div>{/* render data */}</div>
}
```

> **သိထားသင့်သည်**: Sensitive server values တွေကို Client Components တွေဆီ မတော်တဆ မပို့မိအောင် [taint API](https://nextjs.org/docs/app/api-reference/config/next-config-js/taint) ကို သုံးပါ။

Client-accessible values တွေအတွက် — `NEXT_PUBLIC_` prefix ကို သုံးပါ:

```bash filename=".env.local"
NEXT_PUBLIC_API_URL="/api"
```

```tsx filename="app/components/client-component.tsx"
'use client'

export default function ClientComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return <p>API URL: {apiUrl}</p>
}
```

Environment variables တွေကို build time မှာ bundle လုပ်ခံရတာမဟုတ်ဘဲ — runtime မှာ ဖတ်ကြောင်း သေချာဖို့ — `process.env` ကနေ မဖတ်ခင် [`connection()`](/docs/nextjs/connection) function ကို သုံးပါ:

```tsx filename="app/page.tsx"
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  const config = process.env.RUNTIME_CONFIG
  return <p>{config}</p>
}
```

[Environment variables](/docs/nextjs/environment-variables) အကြောင်း ပိုလေ့လာပါ။

### `devIndicators` Options

အောက်ပါ options တွေကို [`devIndicators`](/docs/nextjs/next-config-dev-indicators) ကနေ ဖယ်ရှားလိုက်ပါပြီ:

- `appIsrStatus`
- `buildActivity`
- `buildActivityPosition`

Indicator ကိုယ်တိုင်ကတော့ ရနေဆဲ ဖြစ်ပါတယ်။

### `experimental.dynamicIO` နဲ့ `experimental.useCache`

`experimental.dynamicIO` နဲ့ `experimental.useCache` flags တွေကို ဖယ်ရှားလိုက်ပါပြီ။

```js filename="next.config.js"
// Before: experimental.useCache
module.exports = {
  experimental: {
    useCache: true,
  },
}
```

```js filename="next.config.js"
// Before: experimental.dynamicIO
module.exports = {
  experimental: {
    dynamicIO: true,
  },
}
```

ဒီ flags တွေကို တက်ကြွစွာ သုံးနေတယ်ဆိုရင် — top-level [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ဆီ ပြောင်းရွှေ့ပါ:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

// After
const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

```js filename="next.config.js"
// After
module.exports = {
  cacheComponents: true,
}
```

Cache Components တွေကို တက်ကြွစွာ လက်ခံကျင့်သုံးနေတာ မဟုတ်ဘူးဆိုရင် — flags တွေကို ဖယ်ရှားလိုက်ရုံပါပဲ။ `cacheComponents` ဖွင့်တာက အမည်ပြောင်းရုံသက်သက် ပြောင်းလဲမှု မဟုတ်ပါဘူး: `<Suspense>` အပြင်ဘက်မှာ uncached data တွေအတွက် build errors တွေ ပေါ်လာနိုင်ပြီး — Cache Components model ကို လက်ခံကျင့်သုံးဖို့ လိုအပ်ပါတယ်။

အပြည့်အစုံ migration path အတွက် — [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components) ကို ကြည့်ပါ။

### `unstable_rootParams`

`unstable_rootParams` function ကို ဖယ်ရှားလိုက်ပါပြီ။ အဲဒီအစား [`next/root-params`](https://nextjs.org/docs/app/api-reference/functions/next-root-params) ကို သုံးပါ။
