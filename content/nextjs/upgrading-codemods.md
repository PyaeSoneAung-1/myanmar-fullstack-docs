---
title: "Codemods (Next.js codebase ကို အလိုအလျောက် upgrade လုပ်ခြင်း)"
description: "Codemods — APIs တွေ update (သို့) deprecated ဖြစ်တဲ့အခါ Next.js codebase ကို programmatically ပြောင်းလဲပေးတဲ့ transformations; `upgrade` command သုံးပုံ, options များ နဲ့ version အလိုက် codemods (16.3, 16.0, 15.0, 14.0, 13.2, 13.0, 11, 10, 9, 8, 6) အသေးစိတ်"
order: 181
source: "https://nextjs.org/docs/app/guides/upgrading/codemods"
status: translated
updated: 2026-09-03
---

Codemods တွေက သင့် codebase ပေါ်မှာ programmatically (ကုဒ်ဖြင့် အလိုအလျောက်) run လုပ်ပေးတဲ့ transformations (ပြောင်းလဲမှုများ) ဖြစ်ပါတယ်။ ဒါက file တိုင်းကို ကိုယ်တိုင် ဖြတ်သန်းစရာ မလိုဘဲ — ပြောင်းလဲမှု အများအပြားကို programmatically လုပ်ဆောင်နိုင်စေပါတယ်။

Next.js က API တစ်ခု update (သို့) deprecated ဖြစ်တဲ့အခါ — သင့် Next.js codebase ကို upgrade လုပ်ဖို့ ကူညီပေးတဲ့ Codemod transformations တွေကို ပေးပါတယ်။

## အသုံးပြုပုံ (Usage)

သင့် terminal မှာ သင့် project ရဲ့ folder ထဲကို `cd` လုပ်ပြီး run လုပ်ပါ:

```bash filename="Terminal"
npx @next/codemod <transform> <path>
```

`<transform>` နဲ့ `<path>` တွေကို သင့်တော်တဲ့ တန်ဖိုးတွေနဲ့ အစားထိုးပါ။

- `transform` — transform ရဲ့ နာမည်
- `path` — transform လုပ်ရမယ့် files (သို့) directory
- `--dry` — Dry-run လုပ်တာဖြစ်ပြီး code ကို ဘာမှ ပြင်ဆင်မှာ မဟုတ်ပါဘူး
- `--print` — နှိုင်းယှဉ်ကြည့်ဖို့ ပြောင်းလဲပြီးသား output ကို ပြသပါတယ်

## Upgrade

သင့် Next.js application ကို upgrade လုပ်ပြီး — codemods တွေကို အလိုအလျောက် run လုပ်ကာ Next.js, React နဲ့ React DOM တွေကိုပါ update လုပ်ပေးပါတယ်။

```bash filename="Terminal"
npx @next/codemod upgrade [revision]
```

### Options (ရွေးချယ်စရာများ)

- `revision` (optional): Upgrade အမျိုးအစား (`patch`, `minor`, `major`) ၊ NPM dist tag (ဥပမာ — `latest`, `canary`, `rc`) (သို့) တိကျတဲ့ version (ဥပမာ — `15.0.0`) တစ်ခုကို သတ်မှတ်ပါ။ Stable versions တွေအတွက် default က `minor` ဖြစ်ပါတယ်။
- `--verbose`: Upgrade လုပ်ငန်းစဉ်အတွင်း ပိုအသေးစိတ်တဲ့ output ကို ပြသပါတယ်။
- `-y, --yes`: Interactive prompt တိုင်းကို ကျော်ပြီး ၎င်းရဲ့ default ကို လက်ခံပါတယ် (React ကို 18 ကျော်အထိ upgrade လုပ်ခြင်း, Turbopack ဖွင့်ခြင်း, အကြံပြုထားတဲ့ codemods တွေ အားလုံး သုံးခြင်း, React 19 codemods တွေ run လုပ်ခြင်း)။ ဒါ့အပြင် — stdin က TTY မဟုတ်တဲ့အခါ (CI, AI coding agent (သို့) non-interactive shell မှန်သမျှ) auto-enabled ဖြစ်လို့ — သင်က ၎င်းကို ကိုယ်တိုင် ထည့်ပေးစရာ မလိုတတ်ပါဘူး။

ဥပမာ:

```bash filename="Terminal"
# Upgrade to the latest patch (e.g. 16.0.7 -> 16.0.8)
npx @next/codemod upgrade patch

# Upgrade to the latest minor (e.g. 15.3.7 -> 15.4.8). This is the default.
npx @next/codemod upgrade minor

# Upgrade to the latest major (e.g. 15.5.7 -> 16.0.7)
npx @next/codemod upgrade major

# Upgrade to a specific version
npx @next/codemod upgrade 16

# Upgrade to the canary release
npx @next/codemod upgrade canary

# Run from an agent or CI: skip every prompt
npx @next/codemod upgrade canary --yes
```

> **သိထားသင့်သည်**:
>
> - Target version က သင့် လက်ရှိ version နဲ့ တူညီ (သို့) ပိုနိမ့်နေရင် — command က ဘာမှ မပြောင်းလဲဘဲ ထွက်သွားပါတယ်။
> - Upgrade လုပ်နေစဉ်မှာ — ဘယ် Next.js codemods တွေကို သုံးမလဲ ရွေးချယ်ဖို့ prompt တွေ ထွက်လာနိုင်ပြီး React ကို upgrade လုပ်မယ်ဆိုရင် React 19 codemods တွေကိုပါ run လုပ်ဖို့ မေးနိုင်ပါတယ်။
> - AI coding agent (သို့) CI (stdin က TTY မဟုတ်တဲ့ နေရာမှန်သမျှ) ကနေ ခေါ်လိုက်တဲ့အခါ — upgrade က non-interactively run ဖြစ်ပြီး default တိုင်းကို လက်ခံပါတယ်။ Terminal ကနေ ဖြစ်ရင်တောင် ဒီအပြုအမူကို အတင်းအကျပ် လုပ်ချင်ရင် `--yes` ကို ပေးပါ။

## Codemods

### 16.3

#### Route တိုင်းကို Cache Components validation ကနေ opt out လုပ်ခြင်း

##### `cache-components-instant-false`

```bash filename="Terminal"
npx @next/codemod@canary cache-components-instant-false ./app
```

ဒီ codemod က သင့် app directory ထဲက `instant` ကို export မလုပ်ရသေးတဲ့ `{page,layout,default}` file တိုင်းမှာ `export const instant = false` ကို ထည့်ပေးပါတယ် — ဒါမှ သင် [`cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) ကို ဖွင့်ပြီး route အလိုက် opt-outs တွေကို နောက်ပိုင်းမှာ ဖယ်ရှားနိုင်မှာ ဖြစ်ပါတယ်။ ၎င်းက Client Components (`"use client"`) တွေနဲ့ `instant` ကို ကြေညာပြီးသား files တွေကို ကျော်သွားပါတယ်။

> **သိထားသင့်သည်**: `src/` project တစ်ခုမှာ `./src/app` ကို ပေးပါ။ Path မှားရင် fail ဖြစ်မယ့်အစား `0 ok` လို့ အစီရင်ခံတာမို့ — file count ကို စစ်ဆေးပါ။

```diff filename="app/page.tsx"
+ // TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
+ // See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
+ export const instant = false
+
  export default function Page() {
    return <h1>Hello</h1>
  }
```

အပြည့်အစုံ adoption path အတွက် [Migrating to Cache Components](https://nextjs.org/docs/app/guides/migrating-to-cache-components) guide ကို ကြည့်ပါ။

#### Partial Prefetching ဖွင့်ပြီးနောက် `prefetch = 'partial'` Route Segment Config ကို ဖယ်ရှားခြင်း

##### `remove-partial-prefetch`

```bash filename="Terminal"
npx @next/codemod@canary remove-partial-prefetch ./app
```

ဒီ codemod က သင့် app directory ထဲက `{page,layout}` files တွေကနေ `export const prefetch = 'partial'` ကို ဖယ်ရှားပေးပါတယ် — ဒါမှ သင် [`partialPrefetching`](https://nextjs.org/docs/app/api-reference/config/next-config-js/partialPrefetching) ကို globally ဖွင့်ပြီး အခု မလိုအပ်တော့တဲ့ per-route opt-ins တွေကို ဖယ်ရှားနိုင်မှာ ဖြစ်ပါတယ်။ ၎င်းက `'partial'` value ကိုပဲ ဖယ်ရှားပြီး — `prefetch = 'force-disabled'` လိုမျိုး တခြား values တွေကိုတော့ နေရာမှာ ဆက်ထားပေးပါတယ်။

> **သိထားသင့်သည်**: `src/` project တစ်ခုမှာ `./src/app` ကို ပေးပါ။ Path မှားရင် fail ဖြစ်မယ့်အစား `0 ok` လို့ အစီရင်ခံတာမို့ — file count ကို စစ်ဆေးပါ။

```diff filename="app/products/[slug]/page.tsx"
- export const prefetch = 'partial'
```

အပြည့်အစုံ adoption path အတွက် [Adopting Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching) guide ကို ကြည့်ပါ။

### 16.0

#### App Router pages နဲ့ layouts တွေကနေ `experimental_ppr` Route Segment Config ကို ဖယ်ရှားခြင်း

##### `remove-experimental-ppr`

```bash filename="Terminal"
npx @next/codemod@latest remove-experimental-ppr .
```

ဒီ codemod က App Router pages နဲ့ layouts တွေကနေ `experimental_ppr` Route Segment Config ကို ဖယ်ရှားပေးပါတယ်။

```diff filename="app/page.tsx"
- export const experimental_ppr = true;
```

#### Stabilized API တွေကနေ `unstable_` prefix ကို ဖယ်ရှားခြင်း

##### `remove-unstable-prefix`

```bash filename="Terminal"
npx @next/codemod@latest remove-unstable-prefix .
```

ဒီ codemod က stabilized ဖြစ်သွားတဲ့ APIs တွေကနေ `unstable_` prefix ကို ဖယ်ရှားပေးပါတယ်။

ဥပမာ:

```ts
import { unstable_cacheTag as cacheTag } from 'next/cache'

cacheTag()
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```ts
import { cacheTag } from 'next/cache'

cacheTag()
```

#### Deprecated `middleware` convention ကနေ `proxy` ဆီ ပြောင်းရွှေ့ခြင်း

##### `middleware-to-proxy`

```bash filename="Terminal"
npx @next/codemod@latest middleware-to-proxy .
```

ဒီ codemod က deprecated ဖြစ်နေတဲ့ `middleware` convention ကို သုံးနေတဲ့ projects တွေကို `proxy` convention သုံးအောင် ပြောင်းရွှေ့ပေးပါတယ်။ ၎င်းက:

- `middleware.<extension>` တွေကို `proxy.<extension>` အဖြစ် အမည်ပြောင်းပေးပါတယ် (ဥပမာ — `middleware.ts` → `proxy.ts`)
- Named export `middleware` ကို `proxy` အဖြစ် အမည်ပြောင်းပေးပါတယ်
- Next.js config property `experimental.middlewarePrefetch` ကို `experimental.proxyPrefetch` အဖြစ် အမည်ပြောင်းပေးပါတယ်
- Next.js config property `experimental.middlewareClientMaxBodySize` ကို `experimental.proxyClientMaxBodySize` အဖြစ် အမည်ပြောင်းပေးပါတယ်
- Next.js config property `experimental.externalMiddlewareRewritesResolve` ကို `experimental.externalProxyRewritesResolve` အဖြစ် အမည်ပြောင်းပေးပါတယ်
- Next.js config property `skipMiddlewareUrlNormalize` ကို `skipProxyUrlNormalize` အဖြစ် အမည်ပြောင်းပေးပါတယ်

ဥပမာ:

```ts filename="middleware.ts"
import { NextResponse } from 'next/server'

export function middleware() {
  return NextResponse.next()
}
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```ts filename="proxy.ts"
import { NextResponse } from 'next/server'

export function proxy() {
  return NextResponse.next()
}
```

#### `next lint` ကနေ ESLint CLI ဆီ ပြောင်းရွှေ့ခြင်း

##### `next-lint-to-eslint-cli`

```bash filename="Terminal"
npx @next/codemod@canary next-lint-to-eslint-cli .
```

ဒီ codemod က `next lint` ကို သုံးနေတဲ့ projects တွေကို — သင့် local ESLint config နဲ့အတူ ESLint CLI သုံးအောင် ပြောင်းရွှေ့ပေးပါတယ်။ ၎င်းက:

- Next.js recommended configurations ပါတဲ့ `eslint.config.mjs` file တစ်ခုကို ဖန်တီးပေးပါတယ်
- `package.json` scripts တွေကို `next lint` အစား `eslint .` သုံးအောင် update လုပ်ပေးပါတယ်
- လိုအပ်တဲ့ ESLint dependencies တွေကို `package.json` ထဲမှာ ထည့်ပေးပါတယ်
- တွေ့ရှိရတဲ့ လက်ရှိ ESLint configurations တွေကို ထိန်းသိမ်းပေးပါတယ်

ဥပမာ:

```json filename="package.json"
{
  "scripts": {
    "lint": "next lint"
  }
}
```

ဒီပုံစံ အဖြစ် ဖြစ်သွားပါတယ်:

```json filename="package.json"
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

ပြီးတော့ ဒီ file ကို ဖန်တီးပေးပါတယ်:

```js filename="eslint.config.mjs"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
]

export default eslintConfig
```

### 15.0

#### App Router Route Segment Config `runtime` value ကို `experimental-edge` ကနေ `edge` အဖြစ် ပြောင်းလဲခြင်း

##### `app-dir-runtime-config-experimental-edge`

> **မှတ်ချက်**: ဒီ codemod က App Router အတွက်သာ သီးသန့် ဖြစ်ပါတယ်။

```bash filename="Terminal"
npx @next/codemod@latest app-dir-runtime-config-experimental-edge .
```

ဒီ codemod က [Route Segment Config `runtime`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/runtime) ရဲ့ value `experimental-edge` ကို `edge` အဖြစ် ပြောင်းလဲပေးပါတယ်။

ဥပမာ:

```ts
export const runtime = 'experimental-edge'
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```ts
export const runtime = 'edge'
```

#### Async Dynamic APIs ဆီ ပြောင်းရွှေ့ခြင်း

Dynamic rendering ထဲ opt in လုပ်ခဲ့ကြတဲ့ — အရင်က synchronous access ကို ထောက်ပံ့ခဲ့တဲ့ APIs တွေက အခု asynchronous ဖြစ်သွားပါပြီ။ ဒီ breaking change အကြောင်း [upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-15) မှာ ပိုဖတ်နိုင်ပါတယ်။

##### `next-async-request-api`

```bash filename="Terminal"
npx @next/codemod@latest next-async-request-api .
```

ဒီ codemod က အခု asynchronous ဖြစ်သွားတဲ့ dynamic APIs တွေ (`next/headers` ကနေ `cookies()`, `headers()` နဲ့ `draftMode()`) ကို — သင့်တော်ရင် စနစ်တကျ await လုပ်ဖို့ (သို့) `React.use()` နဲ့ wrap လုပ်ဖို့ ပြောင်းလဲပေးပါတယ်။
Automatic migration မဖြစ်နိုင်တဲ့အခါ — codemod က ၎င်းကို ကိုယ်တိုင် ပြန်လည် သုံးသပ်ပြီး update လုပ်ဖို့ လိုအပ်ကြောင်း အသိပေးတဲ့ typecast (TypeScript file ဆိုရင်) (သို့) comment တစ်ခုကို ထည့်ပေးပါလိမ့်မယ်။

ဥပမာ:

```tsx
import { cookies, headers } from 'next/headers'
const token = cookies().get('token')

function useToken() {
  const token = cookies().get('token')
  return token
}

export default function Page() {
  const name = cookies().get('name')
}

function getHeader() {
  return headers().get('x-foo')
}
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```tsx
import { use } from 'react'
import {
  cookies,
  headers,
  type UnsafeUnwrappedCookies,
  type UnsafeUnwrappedHeaders,
} from 'next/headers'
const token = (cookies() as unknown as UnsafeUnwrappedCookies).get('token')

function useToken() {
  const token = use(cookies()).get('token')
  return token
}

export default async function Page() {
  const name = (await cookies()).get('name')
}

function getHeader() {
  return (headers() as unknown as UnsafeUnwrappedHeaders).get('x-foo')
}
```

ကျွန်တော်တို့က page / route entries (`page.js`, `layout.js`, `route.js` (သို့) `default.js`) (သို့) `generateMetadata` / `generateViewport` APIs တွေထဲမှာ `params` (သို့) `searchParams` props တွေပေါ်မှာ property access တစ်ခု ရှိနေတာကို တွေ့ရှိရင် — callsite ကို sync function ကနေ async function အဖြစ် ပြောင်းလဲပြီး property access ကို await လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ Async ဖြစ်အောင် မလုပ်နိုင်ရင် (Client Component တစ်ခုမှာ ဖြစ်သလိုမျိုး) — promise ကို ဖြေဖို့ `React.use` ကို သုံးပါလိမ့်မယ်။

ဥပမာ:

```tsx
// page.tsx
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { value } = searchParams
  if (value === 'foo') {
    // ...
  }
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params
  return {
    title: `My Page - ${slug}`,
  }
}
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```tsx
// page.tsx
export default async function Page(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const { value } = searchParams
  if (value === 'foo') {
    // ...
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const { slug } = params
  return {
    title: `My Page - ${slug}`,
  }
}
```

> **သိထားသင့်သည်:** ဒီ codemod က manual intervention (လူကိုယ်တိုင် ဝင်ရောက်စွက်ဖက်မှု) လိုအပ်နိုင်တဲ့ နေရာတစ်ခုကို ရှာတွေ့ပေမယ့် — အတိအကျ ဖြေရှင်းချက်ကို ဆုံးဖြတ်နိုင်စွမ်း မရှိတဲ့အခါ — ကိုယ်တိုင် update လုပ်ဖို့ လိုအပ်ကြောင်း အသိပေးတဲ့ comment (သို့) typecast တစ်ခုကို code ထဲမှာ ထည့်ပေးပါလိမ့်မယ်။ ဒီ comments တွေက **@next/codemod** နဲ့ prefix လုပ်ထားပြီး typecasts တွေက `UnsafeUnwrapped` နဲ့ prefix လုပ်ထားပါတယ်။
> ဒီ comments တွေကို ရှင်းရှင်းလင်းလင်း ဖယ်ရှားတဲ့အထိ — သင့် build က error ဖြစ်နေပါလိမ့်မယ်။ [ပိုဖတ်ပါ](https://nextjs.org/docs/messages/sync-dynamic-apis)။

#### `NextRequest` ရဲ့ `geo` နဲ့ `ip` properties တွေကို `@vercel/functions` နဲ့ အစားထိုးခြင်း

##### `next-request-geo-ip`

```bash filename="Terminal"
npx @next/codemod@latest next-request-geo-ip .
```

ဒီ codemod က `@vercel/functions` ကို တပ်ဆင်ပြီး `NextRequest` ရဲ့ `geo` နဲ့ `ip` properties တွေကို သက်ဆိုင်ရာ `@vercel/functions` features တွေနဲ့ ပြောင်းလဲပေးပါတယ်။

ဥပမာ:

```ts
import type { NextRequest } from 'next/server'

export function GET(req: NextRequest) {
  const { geo, ip } = req
}
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```ts
import type { NextRequest } from 'next/server'
import { geolocation, ipAddress } from '@vercel/functions'

export function GET(req: NextRequest) {
  const geo = geolocation(req)
  const ip = ipAddress(req)
}
```

### 14.0

#### `ImageResponse` imports တွေကို ပြောင်းရွှေ့ခြင်း

##### `next-og-import`

```bash filename="Terminal"
npx @next/codemod@latest next-og-import .
```

ဒီ codemod က [Dynamic OG Image Generation](https://nextjs.org/docs/app/getting-started/metadata-and-og-images) အတွက် `next/server` ကနေ `next/og` ဆီ imports တွေကို ပြောင်းလဲပေးပါတယ်။

ဥပမာ:

```js
import { ImageResponse } from 'next/server'
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```js
import { ImageResponse } from 'next/og'
```

#### `viewport` export ကို သုံးခြင်း

##### `metadata-to-viewport-export`

```bash filename="Terminal"
npx @next/codemod@latest metadata-to-viewport-export .
```

ဒီ codemod က viewport metadata အချို့ကို `viewport` export ဆီ ပြောင်းရွှေ့ပေးပါတယ်။

ဥပမာ:

```js
export const metadata = {
  title: 'My App',
  themeColor: 'dark',
  viewport: {
    width: 1,
  },
}
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```js
export const metadata = {
  title: 'My App',
}

export const viewport = {
  width: 1,
  themeColor: 'dark',
}
```

### 13.2

#### Built-in Font ကို သုံးခြင်း

##### `built-in-next-font`

```bash filename="Terminal"
npx @next/codemod@latest built-in-next-font .
```

ဒီ codemod က `@next/font` package ကို uninstall လုပ်ပြီး `@next/font` imports တွေကို built-in `next/font` အဖြစ် ပြောင်းလဲပေးပါတယ်။

ဥပမာ:

```js
import { Inter } from '@next/font/google'
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```js
import { Inter } from 'next/font/google'
```

### 13.0

#### Next Image Imports တွေကို အမည်ပြောင်းခြင်း

##### `next-image-to-legacy-image`

```bash filename="Terminal"
npx @next/codemod@latest next-image-to-legacy-image .
```

လက်ရှိ Next.js 10, 11 (သို့) 12 applications တွေထဲက `next/image` imports တွေကို Next.js 13 မှာ `next/legacy/image` အဖြစ် ဘေးကင်းစွာ အမည်ပြောင်းပေးပါတယ်။ `next/future/image` တွေကိုလည်း `next/image` အဖြစ် အမည်ပြောင်းပေးပါတယ်။

ဥပမာ:

```jsx filename="pages/index.js"
import Image1 from 'next/image'
import Image2 from 'next/future/image'

export default function Home() {
  return (
    <div>
      <Image1 src="/test.jpg" width="200" height="300" />
      <Image2 src="/test.png" width="500" height="400" />
    </div>
  )
}
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```jsx filename="pages/index.js"
// 'next/image' becomes 'next/legacy/image'
import Image1 from 'next/legacy/image'
// 'next/future/image' becomes 'next/image'
import Image2 from 'next/image'

export default function Home() {
  return (
    <div>
      <Image1 src="/test.jpg" width="200" height="300" />
      <Image2 src="/test.png" width="500" height="400" />
    </div>
  )
}
```

#### New Image Component ဆီ ပြောင်းရွှေ့ခြင်း

##### `next-image-experimental`

```bash filename="Terminal"
npx @next/codemod@latest next-image-experimental .
```

Inline styles တွေ ထည့်ပြီး အသုံးမပြုတော့တဲ့ props တွေကို ဖယ်ရှားခြင်းအားဖြင့် — `next/legacy/image` ကနေ `next/image` အသစ်ဆီ အန္တရာယ်ရှိနိုင်ချေရှိစွာ (dangerously) ပြောင်းရွှေ့ပေးပါတယ်။

- `layout` prop ကို ဖယ်ရှားပြီး `style` ထည့်ပေးပါတယ်။
- `objectFit` prop ကို ဖယ်ရှားပြီး `style` ထည့်ပေးပါတယ်။
- `objectPosition` prop ကို ဖယ်ရှားပြီး `style` ထည့်ပေးပါတယ်။
- `lazyBoundary` prop ကို ဖယ်ရှားပါတယ်။
- `lazyRoot` prop ကို ဖယ်ရှားပါတယ်။

#### Link Components တွေကနေ `<a>` Tags တွေကို ဖယ်ရှားခြင်း

##### `new-link`

```bash filename="Terminal"
npx @next/codemod@latest new-link .
```

[Link Components](/docs/nextjs/component-link) တွေထဲက `<a>` tags တွေကို ဖယ်ရှားပါ။

ဥပမာ:

```jsx
<Link href="/about">
  <a>About</a>
</Link>
// transforms into
<Link href="/about">
  About
</Link>

<Link href="/about">
  <a onClick={() => console.log('clicked')}>About</a>
</Link>
// transforms into
<Link href="/about" onClick={() => console.log('clicked')}>
  About
</Link>
```

### 11

#### CRA ကနေ ပြောင်းရွှေ့ခြင်း

##### `cra-to-next`

```bash filename="Terminal"
npx @next/codemod cra-to-next
```

Create React App project တစ်ခုကို Next.js ဆီ ပြောင်းရွှေ့ပေးပြီး — အပြုအမူ ကိုက်ညီဖို့ Pages Router တစ်ခုနဲ့ လိုအပ်တဲ့ configuration တွေကို ဖန်တီးပေးပါတယ်။ SSR ကာလအတွင်း `window` အသုံးပြုမှုကြောင့် compatibility မပျက်အောင် ကနဦးမှာ client-side rendering သက်သက်ကို အသုံးချပြီး — Next.js ရဲ့ သီးသန့် features တွေကို တဖြည်းဖြည်း လက်ခံကျင့်သုံးနိုင်အောင် ချောမွေ့စွာ ဖွင့်နိုင်ပါတယ်။

ဒီ transform နဲ့ ပတ်သက်တဲ့ တုံ့ပြန်ချက် (feedback) တွေကို [ဒီ discussion](https://github.com/vercel/next.js/discussions/25858) မှာ မျှဝေပေးပါ။

### 10

#### React imports တွေ ထည့်သွင်းခြင်း

##### `add-missing-react-import`

```bash filename="Terminal"
npx @next/codemod add-missing-react-import
```

React ကို import မလုပ်ထားတဲ့ files တွေကို — [React JSX transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) အသစ် အလုပ်လုပ်နိုင်ဖို့ import ပါဝင်အောင် ပြောင်းလဲပေးပါတယ်။

ဥပမာ:

```jsx filename="my-component.js"
export default class Home extends React.Component {
  render() {
    return <div>Hello World</div>
  }
}
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```jsx filename="my-component.js"
import React from 'react'
export default class Home extends React.Component {
  render() {
    return <div>Hello World</div>
  }
}
```

### 9

#### Anonymous Components တွေကို Named Components အဖြစ် ပြောင်းလဲခြင်း

##### `name-default-component`

```bash filename="Terminal"
npx @next/codemod name-default-component
```

**Versions 9 နဲ့ အထက်။**

Anonymous components တွေကို — [Fast Refresh](https://nextjs.org/blog/next-9-4#fast-refresh) နဲ့ အလုပ်လုပ်ကြောင်း သေချာစေဖို့ named components အဖြစ် ပြောင်းလဲပေးပါတယ်။

ဥပမာ:

```jsx filename="my-component.js"
export default function () {
  return <div>Hello World</div>
}
```

ဒီပုံစံ အဖြစ် ပြောင်းလဲသွားပါတယ်:

```jsx filename="my-component.js"
export default function MyComponent() {
  return <div>Hello World</div>
}
```

Component က file ရဲ့ နာမည်အပေါ် မူတည်ပြီး camel-cased နာမည်တစ်ခု ရပါလိမ့်မယ် — arrow functions တွေနဲ့လည်း အလုပ်လုပ်ပါတယ်။

### 8

> **မှတ်ချက်**: Built-in AMP support နဲ့ ဒီ codemod ကို Next.js 16 မှာ ဖယ်ရှားလိုက်ပါပြီ။

#### AMP HOC ကို page config အဖြစ် ပြောင်းလဲခြင်း

##### `withamp-to-config`

```bash filename="Terminal"
npx @next/codemod withamp-to-config
```

`withAmp` HOC ကို Next.js 9 ရဲ့ page configuration အဖြစ် ပြောင်းလဲပေးပါတယ်။

ဥပမာ:

```js
// Before
import { withAmp } from 'next/amp'

function Home() {
  return <h1>My AMP Page</h1>
}

export default withAmp(Home)
```

```js
// After
export default function Home() {
  return <h1>My AMP Page</h1>
}

export const config = {
  amp: true,
}
```

### 6

#### `withRouter` ကို သုံးခြင်း

##### `url-to-withrouter`

```bash filename="Terminal"
npx @next/codemod url-to-withrouter
```

Top level pages တွေပေါ်မှာ deprecated ဖြစ်နေတဲ့ အလိုအလျောက် ထိုးသွင်းပေးတဲ့ (automatically injected) `url` property ကို — `withRouter` နဲ့ ၎င်းက ထိုးသွင်းပေးတဲ့ `router` property သုံးအောင် ပြောင်းလဲပေးပါတယ်။ ဒီမှာ ပိုဖတ်ပါ: [https://nextjs.org/docs/messages/url-deprecated](https://nextjs.org/docs/messages/url-deprecated)

ဥပမာ:

```js filename="From"
import React from 'react'
export default class extends React.Component {
  render() {
    const { pathname } = this.props.url
    return <div>Current pathname: {pathname}</div>
  }
}
```

```js filename="To"
import React from 'react'
import { withRouter } from 'next/router'
export default withRouter(
  class extends React.Component {
    render() {
      const { pathname } = this.props.router
      return <div>Current pathname: {pathname}</div>
    }
  }
)
```

ဒါက ဖြစ်ရပ် (case) တစ်ခုပဲ ဖြစ်ပါတယ်။ ပြောင်းလဲခံရတဲ့ (စမ်းသပ်ပြီးသား) case တွေ အားလုံးကို [`__testfixtures__` directory](https://github.com/vercel/next.js/tree/canary/packages/next-codemod/transforms/__testfixtures__/url-to-withrouter) ထဲမှာ တွေ့နိုင်ပါတယ်။
