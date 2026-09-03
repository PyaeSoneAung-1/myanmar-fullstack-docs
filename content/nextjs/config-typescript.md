---
title: "TypeScript (Next.js မှာ TypeScript အသုံးပြုခြင်း)"
description: "Next.js ရဲ့ TypeScript ပံ့ပိုးမှု — create-next-app နဲ့ built-in TypeScript, ရှိပြီးသား project ထဲ ထည့်နည်း, TypeScript 7, IDE Plugin, end-to-end type safety, route-aware type helpers, next-env.d.ts, statically typed links, typed environment variables, next.config.ts type checking, incremental type checking, tsconfigPath, ignoreBuildErrors နဲ့ version history အကြောင်း"
order: 243
source: "https://nextjs.org/docs/app/api-reference/config/typescript"
status: translated
updated: 2026-09-03
---

Next.js မှာ built-in TypeScript ပါဝင်ပါတယ် — `create-next-app` နဲ့ project အသစ်တစ်ခု ဖန်တီးတဲ့အခါ လိုအပ်တဲ့ packages တွေကို အလိုအလျောက် install လုပ်ပြီး — သင့်တော်တဲ့ settings တွေကိုပါ configure လုပ်ပေးပါတယ်။

Project တစ်ခုထဲကို TypeScript ထည့်ဖို့ — file တစ်ခုကို `.ts` / `.tsx` လို့ အမည်ပြောင်းပါ။ ပြီးရင် `next dev` နဲ့ `next build` ကို run လုပ်လိုက်ရင် — လိုအပ်တဲ့ dependencies တွေကို အလိုအလျောက် install လုပ်ပြီး — recommended config options တွေပါတဲ့ `tsconfig.json` file တစ်ခုကို ဖန်တီးပေးပါတယ်။

> **သိထားသင့်သည်:** `jsconfig.json` file တစ်ခု ရှိပြီးသားဆိုရင် — `jsconfig.json` အဟောင်းထဲက `paths` compiler option ကို `tsconfig.json` အသစ်ထဲကို ကူးယူပြီး — `jsconfig.json` အဟောင်းကို ဖျက်လိုက်ပါ။

## TypeScript 7 ကို အသုံးပြုခြင်း (Using TypeScript 7)

[TypeScript 7](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) က လက်ရှိမှာ JavaScript compiler API ကို မပံ့ပိုးရသေးပါဘူး။ `next build` အတွင်း TypeScript 7 ကို သုံးချင်ရင် — သင့် project ထဲမှာ install လုပ်ပါ:

```bash package="pnpm"
pnpm add -D typescript@^7
```

```bash package="npm"
npm install -D typescript@^7
```

```bash package="yarn"
yarn add -D typescript@^7
```

```bash package="bun"
bun add -D typescript@^7
```

Next.js က project ထဲက local `tsc` CLI ကို default အနေနဲ့ သုံးတာမို့ — နောက်ထပ် configuration တစ်ခုခု လိုအပ်မှာ မဟုတ်ပါဘူး။ JavaScript compiler API ကို သုံးချင်ရင်တော့ [`experimental.useTypeScriptCli`](/docs/nextjs/next-config-use-type-script-cli) ကို `false` လို့ သတ်မှတ်ပါ။

> **သိထားသင့်သည်:**
>
> - CLI type checking က native `tsc` ရဲ့ diagnostics တွေကို print ထုတ်ပေးပါတယ်။ ဒါက routes, pages, layouts (သို့) route handlers တွေအတွက် Next.js-specific code frames တွေ (သို့) error rewrite တွေကို သက်ရောက်မှု မရှိပါဘူး။
> - CLI က သင့် `tsconfig` file က ရွေးချယ်ထားတဲ့ project တစ်ခုလုံးကို စစ်ဆေးပါတယ် — အဲဒီ configuration ထဲ ပါဝင်နေရင် test files တွေနဲ့ `.next/dev/types` တွေ အပါအဝင်ပါ။ [`next build --debug-build-paths`](https://nextjs.org/docs/app/api-reference/cli/next#next-build-options) က type check လုပ်မယ့် files တွေကို ကျဉ်းမြောင်းစေတာ မဟုတ်ဘဲ — ဒီ option နဲ့ တွဲသုံးရင် warning တစ်ခု ထုတ်ပေးပါတယ်။
> - `typescript.tsconfigPath` က `tsc` ဆီ ပို့ပေးမယ့် configuration ကို ဆက်လက် ရွေးချယ်ပေးပြီး — `typescript.ignoreBuildErrors` က CLI checker အပါအဝင် type-checking အဆင့်ကို ကျော်လိုက်ပါတယ်။
> - `experimental.useTypeScriptCli` က experimental (စမ်းသပ်ဆဲ) အဆင့် ဖြစ်ပြီး — ၎င်းရဲ့ အပြုအမူ ပြောင်းလဲနိုင်ပါတယ်။

## IDE Plugin (code editors တွေအတွက် TypeScript plugin)

Next.js မှာ custom TypeScript plugin နဲ့ type checker တစ်ခု ပါဝင်ပြီး — VSCode နဲ့ အခြား code editors တွေက အဆင့်မြင့် type-checking နဲ့ auto-completion တွေအတွက် သုံးနိုင်ပါတယ်။

VS Code မှာ plugin ကို ဒီလို ဖွင့်နိုင်ပါတယ်:

1. Command palette ကို ဖွင့်ပါ (`Ctrl/⌘` + `Shift` + `P`)
2. "TypeScript: Select TypeScript Version" ကို ရှာပါ
3. "Use Workspace Version" ကို ရွေးပါ

အခု — files တွေကို edit လုပ်တဲ့အခါ custom plugin က enable ဖြစ်နေပါပြီ။ `next build` run လုပ်တဲ့အခါမှာတော့ project ထဲက local `tsc` CLI ကို default အနေနဲ့ သုံးပါတယ်။ Custom type checker ကို သုံးချင်ရင် `experimental.useTypeScriptCli` ကို `false` လို့ သတ်မှတ်ပါ။

TypeScript plugin က အောက်ပါတို့မှာ ကူညီပေးနိုင်ပါတယ်:

- [Segment config options](/docs/nextjs/route-segment-config) တွေအတွက် invalid values တွေ ပေးရင် သတိပေးခြင်း
- ရနိုင်တဲ့ options တွေနဲ့ in-context documentation (နေရာတွင်းမှာ ဖော်ပြတဲ့ ရှင်းလင်းချက်) တွေကို ပြသခြင်း
- `'use client'` directive ကို မှန်ကန်စွာ သုံးထားကြောင်း သေချာစေခြင်း
- Client hooks တွေ (`useState` လိုမျိုး) ကို Client Components တွေထဲမှာပဲ သုံးကြောင်း သေချာစေခြင်း

> **🎥 ကြည့်ရှုရန်:** Built-in TypeScript plugin အကြောင်း လေ့လာပါ → [YouTube (၃ မိနစ်)](https://www.youtube.com/watch?v=pqMqn9fKEf8)

## End-to-End Type Safety (အစမှ အဆုံး type safety)

Next.js App Router မှာ **enhanced type safety** (မြှင့်တင်ထားတဲ့ type safety) ပါဝင်ပါတယ် — အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

1. **Data fetching function နဲ့ page အကြားမှာ data serialization မလိုအပ်ခြင်း:** Components, layouts နဲ့ pages တွေထဲမှာ server ပေါ်မှာ `fetch` ကို တိုက်ရိုက် ခေါ်နိုင်ပါတယ်။ ဒီ data က React မှာ သုံးစွဲဖို့ client side ဆီ ပို့တဲ့အခါ serialize (string အဖြစ် ပြောင်းလဲ) လုပ်စရာ _မလိုပါဘူး_။ `app` က Server Components တွေကို default အနေနဲ့ သုံးတာမို့ — `Date`, `Map`, `Set` စတဲ့ values တွေကို အပိုအဆင့်တွေ မလိုဘဲ သုံးနိုင်ပါတယ်။ အရင်တုန်းက server နဲ့ client ကြားက boundary ကို Next.js-specific types တွေနဲ့ ကိုယ်တိုင် type လုပ်ပေးရပါတယ်။
2. **Components အကြားမှာ ချောမွေ့တဲ့ data flow:** `_app` အစား root layouts တွေ သုံးလာတာကြောင့် — components နဲ့ pages အကြားက data flow ကို မြင်ယောင်ရ ပိုလွယ်ပါတယ်။ အရင်က `pages` တစ်ခုချင်းစီနဲ့ `_app` အကြားမှာ စီးဆင်းနေတဲ့ data တွေကို type လုပ်ရတာ ခက်ခဲပြီး — ရှုပ်ထွေးတဲ့ bugs တွေ ဖြစ်စေနိုင်ပါတယ်။ App Router မှာ [colocated data fetching](https://nextjs.org/docs/app/getting-started/fetching-data) နဲ့ဆိုရင် ဒီပြဿနာ မရှိတော့ပါဘူး။

[Data Fetching in Next.js](https://nextjs.org/docs/app/getting-started/fetching-data) က အခုဆို — သင့် database (သို့) content provider ရွေးချယ်မှုအပေါ် ဘာမှ မသတ်မှတ်ဘဲ — end-to-end type safety နီးပါး အပြည့်အဝ ရရှိစေနိုင်ပါတယ်။

Response data တွေကို TypeScript သာမန်အတိုင်း မျှော်လင့်ထားသလို type လုပ်နိုင်ပါတယ်။ ဥပမာ:

```tsx filename="app/page.tsx" switcher
async function getData() {
  const res = await fetch('https://api.example.com/...')
  // Return value က serialize လုပ်ထားတာ မဟုတ်ပါဘူး
  // Date, Map, Set စတာတွေကို return လုပ်လို့ရပါတယ်
  return res.json()
}

export default async function Page() {
  const name = await getData()

  return '...'
}
```

_အပြည့်အဝ_ end-to-end type safety ရဖို့ဆိုရင် — သင့် database (သို့) content provider က TypeScript ကို ထောက်ပံ့ဖို့လည်း လိုအပ်ပါတယ်။ [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) (သို့) type-safe query builder တစ်ခုကို သုံးပြီး ဒါကို ရနိုင်ပါတယ်။

## Route-Aware Type Helpers (route အလိုက် type helpers)

Next.js က App Router route types တွေအတွက် global helpers တွေကို generate လုပ်ပေးပါတယ်။ ဒါတွေက import မလုပ်ဘဲ ရနိုင်ပြီး — `next dev`, `next build` (သို့) [`next typegen`](/docs/nextjs/next-cli) လုပ်ဆောင်ချက်တွေအတွင်း generate လုပ်ပါတယ်:

- [`PageProps`](/docs/nextjs/file-conventions-page)
- [`LayoutProps`](/docs/nextjs/file-conventions-layout)
- [`RouteContext`](/docs/nextjs/file-conventions-route)

## `next-env.d.ts`

Next.js က သင့် project root မှာ `next-env.d.ts` file တစ်ခုကို generate လုပ်ပါတယ်။ ဒီ file က Next.js type definitions တွေကို ရည်ညွှန်းထားလို့ — TypeScript က non-code imports တွေ (images, stylesheets စသည်) နဲ့ Next.js-specific types တွေကို မှတ်မိနိုင်ပါတယ်။

`next dev`, `next build` (သို့) [`next typegen`](/docs/nextjs/next-cli) run လုပ်တိုင်း ဒီ file ကို ပြန်လည် generate လုပ်ပါတယ်။

> **သိထားသင့်သည်:**
>
> - `next-env.d.ts` ကို Next.js က စီမံခန့်ခွဲပါတယ်။ ၎င်းရဲ့ contents တွေက implementation detail တွေ ဖြစ်ပြီး — အချိန်နဲ့အမျှ ပြောင်းလဲနိုင်ပါတယ်။ ဒါကို `.gitignore` ထဲ ထည့်ပါ။ Project က file ကို track လုပ်ထားပြီးသားဆိုရင် Git ကနေ ဖယ်ရှားပါ။ ဒီ file ကို ကိုယ်တိုင် edit မလုပ်ပါနဲ့။
> - File က သင့် `tsconfig.json` ရဲ့ `include` array ထဲမှာ ရှိရပါမယ် (`create-next-app` က အလိုအလျောက် ထည့်ပေးပါတယ်)။

## ဥပမာများ (Examples)

### Next.js configuration files များကို type checking ပြုလုပ်ခြင်း (Type Checking Next.js Configuration Files)

`next.config.ts` ကို သုံးပြီး — သင့် Next.js configuration ထဲမှာ TypeScript သုံးကာ types တွေ import လုပ်နိုင်ပါတယ်။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}

export default nextConfig
```

`next.config.ts` ထဲက module resolution က လက်ရှိမှာ CommonJS အတွက်ပဲ ကန့်သတ်ထားပါတယ်။ ဒါပေမယ့် — Node.js v22.10.0 နဲ့ အထက်မှာ Node.js native TypeScript resolver ကို သုံးတဲ့အခါ ECMAScript Modules (ESM) syntax တွေကို ရနိုင်ပါတယ်။

`next.config.js` file သုံးတဲ့အခါ — သင့် IDE ထဲမှာ အောက်ပါအတိုင်း JSDoc ကို သုံးပြီး type checking တချို့ ထည့်နိုင်ပါတယ်:

```js filename="next.config.js"
// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
}

module.exports = nextConfig
```

### next.config.ts အတွက် Node.js Native TypeScript Resolver အသုံးပြုခြင်း

> **မှတ်ချက်:** Node.js v22.10.0+ မှာပဲ ရနိုင်ပြီး — feature ကို ဖွင့်ထားမှသာ အလုပ်လုပ်ပါတယ်။ Next.js က ဒါကို ကိုယ်တိုင် ဖွင့်မပေးပါဘူး။

Next.js က [Node.js native TypeScript resolver](https://nodejs.org/api/typescript.html) ကို [`process.features.typescript`](https://nodejs.org/api/process.html#processfeaturestypescript) ကနေတစ်ဆင့် detect လုပ်ပါတယ် — ဒါကို **v22.10.0** မှာ ထည့်သွင်းခဲ့ပါတယ်။ ဒီ feature ရှိနေရင် `next.config.ts` က native ESM ကို သုံးနိုင်ပြီး — top-level `await` နဲ့ dynamic `import()` တွေ အပါအဝင်ပါ။ ဒီယန္တရားက Node ရဲ့ resolver ရဲ့ စွမ်းရည်တွေနဲ့ ကန့်သတ်ချက်တွေကိုပဲ အမွေဆက်ခံပါတယ်။

Node.js **v22.18.0+** မှာ `process.features.typescript` က default အနေနဲ့ enable ဖြစ်နေပါတယ်။ **v22.10.0** ကနေ **22.17.x** ကြားက versions တွေမှာတော့ `NODE_OPTIONS=--experimental-transform-types` နဲ့ opt in လုပ်ပါ:

```bash filename="Terminal"
NODE_OPTIONS=--experimental-transform-types next <command>
```

#### CommonJS projects များအတွက် (Default)

`next.config.ts` က CommonJS projects တွေထဲမှာ native ESM syntax ကို ထောက်ပံ့ပေးပေမယ့် — Node.js က `next.config.ts` ကို default အနေနဲ့ CommonJS file တစ်ခုလို ယူဆဆဲ ဖြစ်ပါတယ်။ ရလဒ်အနေနဲ့ — module syntax တွေ့ရှိလိုက်တာနဲ့ Node.js က file ကို ESM အဖြစ် ပြန်လည် parse လုပ်ပါတယ်။ ဒါကြောင့် CommonJS projects တွေမှာ — `next.config.mts` file ကို သုံးပြီး ESM module တစ်ခု ဖြစ်ကြောင်း တိကျစွာ ဖော်ပြဖို့ အကြံပြုပါတယ်:

```ts filename="next.config.mts"
import type { NextConfig } from 'next'

// Top-level await and dynamic import are supported
const flags = await import('./flags.js').then((m) => m.default ?? m)

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: Boolean(flags?.typedRoutes),
}

export default nextConfig
```

#### ESM projects များအတွက်

သင့် `package.json` ထဲမှာ `"type"` ကို `"module"` လို့ သတ်မှတ်ထားရင် — သင့် project က ESM သုံးနေတာ ဖြစ်ပါတယ်။ ဒီ setting အကြောင်း [Node.js docs](https://nodejs.org/api/packages.html#type) မှာ ပိုလေ့လာနိုင်ပါတယ်။ ဒီကိစ္စမှာ `next.config.ts` ကို ESM syntax နဲ့ တိုက်ရိုက် ရေးနိုင်ပါတယ်။

> **သိထားသင့်သည်:** `package.json` ထဲမှာ `"type": "module"` သုံးထားရင် — project ထဲက `.js` နဲ့ `.ts` files အားလုံးကို default အနေနဲ့ ESM modules တွေလို သဘောထားပါတယ်။ CommonJS syntax သုံးထားတဲ့ files တွေကို လိုအပ်ရင် `.cjs` (သို့) `.cts` extensions တွေနဲ့ အမည်ပြောင်းဖို့ လိုနိုင်ပါတယ်။

### Statically Typed Links (static type ဖြင့် links စစ်ဆေးခြင်း)

Next.js က links တွေကို statically type လုပ်နိုင်ပြီး — `next/link` သုံးတဲ့အခါ စာလုံးပေါင်း အမှားတွေနဲ့ အခြား errors တွေကို ကာကွယ်ကာ — pages တွေကြား navigation လုပ်တဲ့အခါ type safety ကို မြှင့်တင်ပေးပါတယ်။

Pages Router ရော App Router နှစ်ခုလုံးမှာပါ `next/link` ရဲ့ `href` prop အတွက် အလုပ်လုပ်ပါတယ်။ App Router မှာ `next/navigation` ရဲ့ `push`, `replace`, `prefetch` လို methods တွေကိုပါ type လုပ်ပေးပါတယ်။ Pages Router ထဲက `next/router` methods တွေကိုတော့ type မလုပ်ပေးပါဘူး။

Literal `href` strings တွေကို validate လုပ်ပြီး — non-literal `href` တွေကတော့ `as Route` နဲ့ cast လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။

ဒီ feature ကို opt in လုပ်ဖို့ — `typedRoutes` ကို enable လုပ်ထားရပြီး project က TypeScript သုံးထားရပါမယ်။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typedRoutes: true,
}

export default nextConfig
```

Next.js က `.next/types` ထဲမှာ — သင့် application ထဲက ရှိရှိသမျှ routes တွေရဲ့ အချက်အလက်တွေ ပါဝင်တဲ့ link definition တစ်ခုကို generate လုပ်ပြီး — TypeScript က အဲဒါကို သုံးကာ invalid links တွေအကြောင်း သင့် editor ထဲမှာ feedback ပေးနိုင်ပါတယ်။

> **သိထားသင့်သည်:** `create-next-app` မသုံးဘဲ project တစ်ခုကို စနစ်ထည့်ထားတယ်ဆိုရင် — သင့် `tsconfig.json` ရဲ့ `include` array ထဲမှာ `.next/types/**/*.ts` ကို ထည့်ပြီး generated Next.js types တွေ ပါဝင်ကြောင်း သေချာပါစေ:

```json filename="tsconfig.json" highlight={4}
{
  "include": [
    "next-env.d.ts",
    ".next/types/**/*.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
```

လက်ရှိမှာ support ထဲမှာ string literal အားလုံး — dynamic segments အပါအဝင် — ပါဝင်ပါတယ်။ Non-literal strings တွေအတွက်တော့ `as Route` နဲ့ ကိုယ်တိုင် cast လုပ်ဖို့ လိုပါတယ်။ အောက်က ဥပမာက `next/link` ရော `next/navigation` သုံးပုံ နှစ်ခုလုံးကို ပြသထားပါတယ်:

```tsx filename="app/example-client.tsx"
'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Example() {
  const router = useRouter()
  const slug = 'nextjs'

  return (
    <>
      {/* Link: literal and dynamic */}
      <Link href="/about" />
      <Link href={`/blog/${slug}`} />
      <Link href={('/blog/' + slug) as Route} />
      {/* TypeScript error if href is not a valid route */}
      <Link href="/aboot" />

      {/* Router: literal and dynamic strings are validated */}
      <button onClick={() => router.push('/about')}>Push About</button>
      <button onClick={() => router.replace(`/blog/${slug}`)}>
        Replace Blog
      </button>
      <button onClick={() => router.prefetch('/contact')}>
        Prefetch Contact
      </button>

      {/* For non-literal strings, cast to Route */}
      <button onClick={() => router.push(('/blog/' + slug) as Route)}>
        Push Non-literal Blog
      </button>
    </>
  )
}
```

ဒါပဲ — proxy ကနေ redirect လုပ်ထားတဲ့ routes တွေအတွက်လည်း သက်ရောက်ပါတယ်:

```ts filename="proxy.ts"
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/proxy-redirect') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
```

```tsx filename="app/some/page.tsx"
import type { Route } from 'next'
import Link from 'next/link'

export default function Page() {
  return <Link href={'/proxy-redirect' as Route}>Link Text</Link>
}
```

`next/link` ကို wrap လုပ်ထားတဲ့ custom component တစ်ခုမှာ `href` ကို လက်ခံဖို့ — generic တစ်ခုကို သုံးပါ:

```tsx
import type { Route } from 'next'
import Link from 'next/link'

function Card<T extends string>({ href }: { href: Route<T> | URL }) {
  return (
    <Link href={href}>
      <div>My Card</div>
    </Link>
  )
}
```

ရိုးရှင်းတဲ့ data structure တစ်ခုကိုလည်း type လုပ်ပြီး — links တွေ render လုပ်ဖို့ iterate လုပ်နိုင်ပါတယ်:

```ts filename="components/nav-items.ts"
import type { Route } from 'next'

type NavItem<T extends string = string> = {
  href: T
  label: string
}

export const navItems: NavItem<Route>[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
]
```

ပြီးရင် items တွေကို map လုပ်ပြီး `Link` တွေ render လုပ်ပါ:

```tsx filename="components/nav.tsx"
import Link from 'next/link'
import { navItems } from './nav-items'

export function Nav() {
  return (
    <nav>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
```

> **ဘယ်လို အလုပ်လုပ်လဲ? (How does it work?)**
>
> `next typegen`, `next dev` (သို့) `next build` run လုပ်တဲ့အခါ — Next.js က `.next` ထဲမှာ hidden `.d.ts` file တစ်ခုကို generate လုပ်ပြီး — သင့် application ထဲက routes အားလုံးရဲ့ အချက်အလက်တွေ (`Link` ရဲ့ `href` type အဖြစ် valid routes အားလုံး) ပါဝင်ပါတယ်။ ဒီ `.d.ts` file က `tsconfig.json` ထဲမှာ ပါဝင်လို့ — TypeScript compiler က အဲဒီ `.d.ts` ကို စစ်ဆေးပြီး invalid links တွေအကြောင်း editor ထဲမှာ feedback ပေးပါတယ်။

### Environment Variables များအတွက် Type IntelliSense

Development ကာလအတွင်း — Next.js က `.next/types` ထဲမှာ load လုပ်ထားတဲ့ environment variables တွေရဲ့ အချက်အလက်တွေ ပါဝင်တဲ့ `.d.ts` file တစ်ခုကို generate လုပ်ပြီး — သင့် editor ရဲ့ IntelliSense အတွက် သုံးပါတယ်။ Environment variable key တစ်ခုတည်းကို file အများအပြားမှာ သတ်မှတ်ထားရင် — [Environment Variable Load Order](/docs/nextjs/environment-variables) အတိုင်း deduplicate လုပ်ပါတယ်။

ဒီ feature ကို opt in လုပ်ဖို့ — `experimental.typedEnv` ကို enable လုပ်ထားရပြီး project က TypeScript သုံးထားရပါမယ်။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    typedEnv: true,
  },
}

export default nextConfig
```

> **သိထားသင့်သည်:** Types တွေက development runtime မှာ load လုပ်ထားတဲ့ environment variables တွေကို အခြေခံပြီး generate လုပ်ပါတယ် — ဒါက `.env.production*` files တွေထဲက variables တွေကို default အနေနဲ့ ဖယ်ထုတ်ထားပါတယ်။ Production-specific variables တွေ ထည့်သွင်းဖို့ — `next dev` ကို `NODE_ENV=production` နဲ့ run လုပ်ပါ။

### Async Server Components များနဲ့ တွဲသုံးခြင်း (With Async Server Components)

`async` Server Component တစ်ခုကို TypeScript နဲ့ သုံးဖို့ — TypeScript `5.1.3` (သို့) အထက်နဲ့ `@types/react` `18.2.8` (သို့) အထက်တွေ သုံးနေကြောင်း သေချာပါစေ။

TypeScript ဗားရှင်းအဟောင်း တစ်ခုခု သုံးနေရင် — `'Promise<Element>' is not a valid JSX element` ဆိုတဲ့ type error ကို မြင်ရနိုင်ပါတယ်။ TypeScript နဲ့ `@types/react` တွေကို နောက်ဆုံး version ဆီ update လုပ်လိုက်ရင် ဒီပြဿနာ ဖြေရှင်းသွားပါလိမ့်မယ်။

### Incremental type checking (တစ်စိတ်တစ်ပိုင်းချင်းစီ type checking)

`v10.2.1` ကစပြီး — သင့် `tsconfig.json` ထဲမှာ enable လုပ်ထားရင် Next.js က [incremental type checking](https://www.typescriptlang.org/tsconfig#incremental) ကို ထောက်ပံ့ပါတယ် — ဒါက ကြီးမားတဲ့ applications တွေမှာ type checking တွေကို မြန်ဆန်စေနိုင်ပါတယ်။

### Custom tsconfig path (tsconfig path စိတ်ကြိုက် သတ်မှတ်ခြင်း)

တချို့ case တွေမှာ — builds (သို့) tooling အတွက် မတူညီတဲ့ TypeScript configuration တစ်ခုကို သုံးချင်နိုင်ပါတယ်။ ဒါလုပ်ဖို့ — `next.config.ts` ထဲမှာ `typescript.tsconfigPath` ကို သတ်မှတ်ပြီး Next.js ကို အခြား `tsconfig` file တစ်ခုဆီ ညွှန်ပါ။

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: 'tsconfig.build.json',
  },
}

export default nextConfig
```

ဥပမာ — production builds တွေအတွက် မတူညီတဲ့ config တစ်ခုဆီ ပြောင်းချင်ရင်:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: isProd ? 'tsconfig.build.json' : 'tsconfig.json',
  },
}

export default nextConfig
```

> **Build တွေအတွက် သီးခြား tsconfig တစ်ခု ဘာကြောင့် သုံးချင်နိုင်လဲ?**
>
> Monorepos လို အခြေအနေတွေမှာ — build က သင့် project ရဲ့ စံနှုန်းတွေနဲ့ မကိုက်ညီတဲ့ shared dependencies တွေကိုပါ validate လုပ်နေနိုင်ပါတယ်။ ဒါမှမဟုတ် — locally ပိုတင်းကျပ်တဲ့ TypeScript settings တွေဆီ migrate လုပ်နေချိန်မှာ CI ထဲက checks တွေကို ဖြေလျှော့ထားပြီး — IDE ကတော့ misuse တွေကို ဆက်ပြစေချင်တာမျိုး ဖြစ်နိုင်ပါတယ်။
>
> ဥပမာ — သင့် project က `useUnknownInCatchVariables` ကို သုံးထားပေမယ့် monorepo ထဲက dependencies တချို့က `any` လို့ပဲ ယူဆထားသေးတယ်ဆိုရင်:
>
> ```json filename="tsconfig.build.json"
> {
>   "extends": "./tsconfig.json",
>   "compilerOptions": {
>     "useUnknownInCatchVariables": false
>   }
> }
> ```
>
> ဒါက သင့် editor ကို `tsconfig.json` ကတစ်ဆင့် strict ဖြစ်စေပြီး — production build ကတော့ ဖြေလျှော့ထားတဲ့ settings တွေ သုံးခွင့် ရှိစေပါတယ်။

> **သိထားသင့်သည်:**
>
> - IDEs တွေက ပုံမှန်အားဖြင့် diagnostics နဲ့ IntelliSense အတွက် `tsconfig.json` ကိုပဲ ဖတ်ပါတယ် — ဒါကြောင့် production builds တွေက alternate config သုံးနေတုန်းမှာလည်း IDE warnings တွေကို ဆက်မြင်နေရနိုင်ပါတယ်။ Editor ထဲမှာပါ တူညီစေချင်ရင် အရေးကြီးတဲ့ options တွေကို mirror လုပ်ထားပါ။
> - Development မှာ `tsconfig.json` တစ်ခုတည်းကိုပဲ အပြောင်းအလဲတွေအတွက် စောင့်ကြည့်ပါတယ်။ `typescript.tsconfigPath` ကတစ်ဆင့် အခြား file name တစ်ခုကို edit လုပ်ရင် — အပြောင်းအလဲတွေ သက်ရောက်ဖို့ dev server ကို restart လုပ်ပါ။
> - Configure လုပ်ထားတဲ့ file ကို `next dev`, `next build`, `next typegen` တွေမှာ သုံးပါတယ်။

### TypeScript errors များကို production တွင် ပိတ်ထားခြင်း (Disabling TypeScript errors in production)

Project ထဲမှာ TypeScript errors တွေ ရှိနေရင် — Next.js က သင့် **production build** (`next build`) ကို fail လုပ်ပါတယ်။

Application မှာ errors တွေ ရှိနေတာတောင် production code တွေ ထွက်လာစေချင်တယ်ဆိုရင် — built-in type checking အဆင့်ကို disable လုပ်နိုင်ပါတယ်။

Disable လုပ်ထားရင် — type checks တွေကို သင့် build (သို့) deploy process ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ run နေကြောင်း သေချာပါစေ — မဟုတ်ရင် ဒါက အလွန် အန္တရာယ်ကြီးနိုင်ပါတယ်။

`next.config.ts` ကို ဖွင့်ပြီး [`typescript`](/docs/nextjs/next-config-typescript) config ထဲမှာ `ignoreBuildErrors` option ကို enable လုပ်ပါ:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // အန္တရာယ်ရှိနိုင်သည် — project မှာ type errors ရှိနေရင်တောင်
    // production builds တွေကို အောင်မြင်စွာ ပြီးဆုံးခွင့် ပြုထားခြင်း
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

export default nextConfig
```

> **သိထားသင့်သည်:** Build မလုပ်ခင် TypeScript errors တွေ ရှိမရှိ ကိုယ်တိုင် စစ်ဆေးချင်ရင် `tsc --noEmit` ကို run လုပ်နိုင်ပါတယ်။ Deploy မလုပ်ခင် TypeScript errors တွေကို စစ်ချင်တဲ့ CI/CD pipelines တွေအတွက် ဒါက အသုံးဝင်ပါတယ်။

### Custom type declarations (ကိုယ်ပိုင် type declarations)

Custom types တွေ ကြေညာဖို့ လိုအပ်တဲ့အခါ — `next-env.d.ts` ကို ပြင်ချင်စိတ် ဖြစ်နိုင်ပါတယ်။ ဒါပေမယ့် ဒီ file က အလိုအလျောက် generate လုပ်တာမို့ — သင် ပြုလုပ်လိုက်တဲ့ အပြောင်းအလဲတွေ အားလုံး ဖျောက်ဖျက်ခံရမှာ ဖြစ်ပါတယ်။ အဲဒီအစား — file အသစ်တစ်ခု ဖန်တီးပြီး `new-types.d.ts` လို့ နာမည်ပေးကာ သင့် `tsconfig.json` ထဲမှာ ရည်ညွှန်းပါ:

```json filename="tsconfig.json"
{
  "compilerOptions": {
    "skipLibCheck": true
    //...truncated...
  },
  "include": [
    "new-types.d.ts",
    "next-env.d.ts",
    ".next/types/**/*.ts",
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
```

## Version အပြောင်းအလဲများ (Version Changes)

| Version   | Changes                                                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `v15.0.0` | `next.config.ts` ကို TypeScript projects တွေအတွက် ထောက်ပံ့မှု ထည့်သွင်းခဲ့ပါတယ်။                                                    |
| `v13.2.0` | Statically typed links တွေကို beta အဆင့်မှာ ရရှိနိုင်ပါတယ်။                                                                            |
| `v12.0.0` | [SWC](https://nextjs.org/docs/architecture/nextjs-compiler) ကို TypeScript နဲ့ TSX တွေ compile လုပ်ပြီး builds တွေ ပိုမြန်စေဖို့ default အနေနဲ့ အခု သုံးပါတယ်။ |
| `v10.2.1` | သင့် `tsconfig.json` ထဲမှာ enable လုပ်ထားရင် [incremental type checking](https://www.typescriptlang.org/tsconfig#incremental) အတွက် ထောက်ပံ့မှု ထည့်သွင်းခဲ့ပါတယ်။ |
