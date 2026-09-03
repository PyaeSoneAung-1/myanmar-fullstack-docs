---
title: "Package Bundling (bundle များကို အကောင်းဆုံးဖြစ်အောင် ပြုလုပ်ခြင်း)"
description: "Turbopack အတွက် Next.js Bundle Analyzer နဲ့ Webpack အတွက် `@next/bundle-analyzer` plugin တွေသုံးပြီး — သင့် application ရဲ့ server နဲ့ client bundles တွေကို ခွဲခြမ်းစိတ်ဖြာ၍ ကြီးမားတဲ့ bundles တွေကို optimize လုပ်နည်း"
order: 228
source: "https://nextjs.org/docs/app/guides/package-bundling"
status: translated
updated: 2026-09-03
---

**Bundling** ဆိုတာ — သင့် application code နဲ့ ၎င်းရဲ့ dependencies တွေကို client နဲ့ server အတွက် အကောင်းဆုံးဖြစ်အောင် ပြုပြင်ထားတဲ့ output files တွေအဖြစ် ပေါင်းစည်းတဲ့ လုပ်ငန်းစဉ်ပါ။ Bundle တွေ သေးသေးလေး ဖြစ်လေလေ — load ပိုမြန်လေ၊ JavaScript execution time လျော့လေ၊ [Core Web Vitals](https://web.dev/articles/vitals) တွေ ပိုကောင်းလေ၊ server ရဲ့ cold start times တွေ ပိုနိမ့်လေပါ။

Next.js က code splitting, tree-shaking နဲ့ အခြား နည်းလမ်းတွေနဲ့ bundles တွေကို အလိုအလျောက် optimize လုပ်ပေးပါတယ်။ ဒါပေမယ့် — bundles တွေကို ကိုယ်တိုင် optimize လုပ်ဖို့ လိုအပ်တဲ့ အခြေအနေတချို့လည်း ရှိပါတယ်။

သင့် application ရဲ့ bundles တွေကို ခွဲခြမ်းစိတ်ဖြာဖို့ tool နှစ်ခု ရှိပါတယ်:

- Next.js Bundle Analyzer for Turbopack (experimental)
- Webpack အတွက် `@next/bundle-analyzer` plugin

ဒီ guide က — tool တစ်ခုချင်းစီ သုံးပုံနဲ့ ကြီးမားတဲ့ bundles တွေကို optimize လုပ်ပုံတွေကို လမ်းညွှန်ပေးပါတယ်။

## Next.js Bundle Analyzer (experimental)

> **သိထားသင့်သည်:** v16.1 နဲ့ ၎င်းနောက်ပိုင်းမှာ ရနိုင်ပါတယ်။ Feedback တွေကို [သီးသန့် GitHub discussion](https://github.com/vercel/next.js/discussions/86731) မှာ မျှဝေနိုင်ပြီး — demo ကို [turbopack-bundle-analyzer-demo.vercel.sh](https://turbopack-bundle-analyzer-demo.vercel.sh/) မှာ ကြည့်နိုင်ပါတယ်။

Next.js Bundle Analyzer က Turbopack ရဲ့ module graph နဲ့ ပေါင်းစည်းထားပါတယ်။ တိကျတဲ့ import tracing (import ခြေရာခံမှု) နဲ့ server ရော client modules တွေကိုပါ စစ်ဆေးလို့ — ကြီးမားတဲ့ dependencies တွေကို ရှာဖွေရတာ ပိုလွယ်ကူစေပါတယ်။ Module graph ကို စူးစမ်းကြည့်ဖို့ interactive Bundle Analyzer demo ကို ဖွင့်ကြည့်ပါ။

### အဆင့် ၁: Turbopack Bundle Analyzer ကို run လုပ်ခြင်း

စတင်ဖို့ — အောက်ပါ command ကို run လုပ်ပြီး သင့် browser ထဲမှာ interactive view ကို ဖွင့်ပါ။

```bash filename="Terminal" package="npm"
npx next experimental-analyze
```

```bash filename="Terminal" package="yarn"
yarn next experimental-analyze
```

```bash filename="Terminal" package="pnpm"
pnpm next experimental-analyze
```

```bash filename="Terminal" package="bun"
bunx next experimental-analyze
```

### အဆင့် ၂: Modules တွေကို စစ်ထုတ်ပြီး စစ်ဆေးခြင်း

UI ထဲမှာ — route, environment (client (သို့) server), type (JavaScript, CSS, JSON) အလိုက် စစ်ထုတ်နိုင်သလို — file နာမည်နဲ့လည်း ရှာနိုင်ပါတယ်:

_Next.js bundle analyzer UI ရဲ့ လုပ်ဆောင်ပုံကို ပြသထားတဲ့ video walkthrough။_

### အဆင့် ၃: Import chains တွေနဲ့ modules တွေကို ခြေရာခံခြင်း

Treemap ထဲမှာ module တစ်ခုချင်းစီကို rectangle (စတုဂံ) တစ်ခုအနေနဲ့ ပြပါတယ် — module ရဲ့ အရွယ်အစားကို rectangle ရဲ့ ဧရိယာနဲ့ ဖော်ပြပါတယ်။

Module တစ်ခုကို နှိပ်ရင် — သူ့ရဲ့ အရွယ်အစား၊ import chain အပြည့်အစုံနဲ့ သင့် application ထဲမှာ ဘယ်နေရာတွေမှာ သုံးထားလဲဆိုတာကို တိတိကျကျ ကြည့်နိုင်ပါတယ်:

_Module တစ်ခုရဲ့ import chain ကို ပြသထားတဲ့ Bundle Analyzer မြင်ကွင်း။_

### အဆင့် ၄: Sharing (သို့) diffing အတွက် output ကို disk ထဲ ရေးသိမ်းခြင်း

Analysis ကို teammates တွေနဲ့ မျှဝေချင်တာ (သို့) optimize လုပ်ခင်/ပြီး bundle sizes တွေကို ယှဉ်ကြည့်ချင်တာဆိုရင် — interactive view ကို ကျော်ပြီး analysis ကို `--output` flag နဲ့ static file တစ်ခုအနေနဲ့ သိမ်းနိုင်ပါတယ်:

```bash filename="Terminal" package="npm"
npx next experimental-analyze --output
```

```bash filename="Terminal" package="yarn"
yarn next experimental-analyze --output
```

```bash filename="Terminal" package="pnpm"
pnpm next experimental-analyze --output
```

```bash filename="Terminal" package="bun"
bunx next experimental-analyze --output
```

ဒီ command က output ကို `.next/diagnostics/analyze` ဆီ ရေးပေးပါတယ်။ ရလဒ်တွေကို ယှဉ်ကြည့်ဖို့ ဒီ directory ကို တခြားနေရာဆီ copy လုပ်နိုင်ပါတယ်:

```bash filename="Terminal"
cp -r .next/diagnostics/analyze ./analyze-before-refactor
```

> **သိထားသင့်သည်:** Bundle Analyzer အတွက် နောက်ထပ် options တွေ ရှိပါသေးတယ် — option အပြည့်အစုံအတွက် [Next.js CLI reference](/docs/nextjs/next-cli) docs ကို ကြည့်ပါ။

## Webpack အတွက် `@next/bundle-analyzer`

[`@next/bundle-analyzer`](https://www.npmjs.com/package/@next/bundle-analyzer) က သင့် application bundles တွေရဲ့ အရွယ်အစားကို စီမံခန့်ခွဲဖို့ ကူညီပေးတဲ့ plugin တစ်ခုပါ။ Package တစ်ခုချင်းစီနဲ့ ၎င်းတို့ရဲ့ dependencies တွေရဲ့ အရွယ်အစားကို မြင်သာစွာ ပြသပေးတဲ့ visual report တစ်ခုကို ထုတ်ပေးပါတယ်။ ဒီအချက်အလက်တွေကို သုံးပြီး — ကြီးမားတဲ့ dependencies တွေကို ဖယ်ရှားနိုင်သလို — code တွေကို ခွဲထုတ် (split) လုပ်နိုင်ကာ — [lazy-load](/docs/nextjs/lazy-loading) လုပ်နိုင်ပါတယ်။

### အဆင့် ၁: တပ်ဆင်ခြင်း (Installation)

Plugin ကို အောက်ပါ command နဲ့ တပ်ဆင်ပါ:

```bash package="pnpm"
pnpm add @next/bundle-analyzer
```

```bash package="npm"
npm install @next/bundle-analyzer
```

```bash package="yarn"
yarn add @next/bundle-analyzer
```

```bash package="bun"
bun add @next/bundle-analyzer
```

ပြီးရင် — bundle analyzer ရဲ့ settings တွေကို သင့် `next.config.js` ထဲ ထည့်ပါ။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

### အဆင့် ၂: Report တစ်ခု ထုတ်လုပ်ခြင်း

Bundles တွေကို ခွဲခြမ်းစိတ်ဖြာဖို့ အောက်ပါ command ကို run လုပ်ပါ:

```bash
ANALYZE=true npm run build
# or
ANALYZE=true yarn build
# or
ANALYZE=true pnpm build
```

Report က သင့် browser ထဲမှာ tab အသစ် သုံးခု ဖွင့်ပေးပါလိမ့်မယ် — အဲဒါတွေကို စစ်ဆေးကြည့်နိုင်ပါတယ်။

## ကြီးမားတဲ့ bundles တွေကို optimize လုပ်ခြင်း (Optimizing large bundles)

Module ကြီးတစ်ခုကို ဖော်ထုတ်ပြီးတာနဲ့ — ဖြေရှင်းနည်းက သင့် use case ပေါ်မှာ မူတည်ပါတယ်။ အောက်မှာ အဖြစ်များတဲ့ အကြောင်းရင်းတွေနဲ့ ပြုပြင်နည်းတွေပါ:

### Exports အများကြီး ရှိတဲ့ packages (Packages with many exports)

Modules ရာချီ ထုတ်ပေးတဲ့ package တစ်ခုကို သုံးနေရင် (icon နဲ့ utility libraries တွေလို) — `next.config.js` file ထဲက [`optimizePackageImports`](/docs/nextjs/next-config-optimize-package-imports) option နဲ့ အဲဒီ imports တွေကို ဖြေရှင်းပုံကို optimize လုပ်နိုင်ပါတယ်။ ဒီ option က သင်တကယ် သုံးတဲ့ modules တွေကိုပဲ load လုပ်ပေးပြီး — named exports အများကြီးပါတဲ့ import statements တွေ ရေးရတဲ့ အဆင်ပြေမှုကိုတော့ ဆက်လက် ပေးပါတယ်။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['icon-library'],
  },
}

module.exports = nextConfig
```

> **သိထားသင့်သည်:** Next.js က libraries တချို့ကိုလည်း အလိုအလျောက် optimize လုပ်ပေးလို့ — သူတို့ကို `optimizePackageImports` စာရင်းထဲ ထည့်စရာ မလိုပါဘူး။ Support လုပ်ထားတဲ့ packages တွေရဲ့ [စာရင်း အပြည့်အစုံ](/docs/nextjs/next-config-optimize-package-imports) ကို ကြည့်ပါ။

### Client ဘက်မှာ အလုပ်ရှုပ်တဲ့ workloads (Heavy client workloads)

Client bundles တွေ ကြီးရတဲ့ အဖြစ်များတဲ့ အကြောင်းရင်းတစ်ခုက — Client Components တွေထဲမှာ စရိတ်ကြီးတဲ့ (expensive) rendering အလုပ်တွေ လုပ်နေတာပါ။ Syntax highlighting, chart rendering (ဂရပ်ဖ် ရေးဆွဲခြင်း), markdown parsing လို — data တွေကို UI အဖြစ် ပြောင်းဖို့အတွက်ပဲ ရှိတဲ့ libraries တွေမှာ ဒါ အဖြစ်များပါတယ်။

အဲဒီအလုပ်က browser APIs (သို့) user interaction တွေ မလိုအပ်ဘူးဆိုရင် — Server Component တစ်ခုထဲမှာ run လုပ်လို့ ရပါတယ်။

ဒီဥပမာမှာ — prism အခြေခံတဲ့ highlighter တစ်ခုက Client Component တစ်ခုထဲမှာ run နေပါတယ်။ နောက်ဆုံး output က `<code>` block တစ်ခုပဲ ဖြစ်ပေမယ့် — highlighting library တစ်ခုလုံးက client JavaScript bundle ထဲ ထည့်သွင်းခံထားရပါတယ်:

```tsx filename="app/blog/[slug]/page.tsx"
'use client'

import Highlight from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/github'

export default function Page() {
  const code = `export function hello() {
    console.log("hi")
  }`

  return (
    <article>
      <h1>Blog Post Title</h1>

      {/* The prism package and its tokenization logic are shipped to the client */}
      <Highlight code={code} language="tsx" theme={theme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </article>
  )
}
```

ဒါက bundle size ကို ကြီးစေပါတယ် — ဘာလို့လဲဆိုတော့ — result က static HTML ဖြစ်နေတာတောင် client က highlighting library ကို download လုပ်ပြီး execute လုပ်ရလို့ပါ။

အဲဒီအစား — highlighting logic ကို Server Component တစ်ခုဆီ ရွှေ့ပြီး — နောက်ဆုံး HTML ကို server ပေါ်မှာ render လုပ်ပါ။ Client က render လုပ်ပြီးသား markup ကိုပဲ ရရှိမှာ ဖြစ်ပါတယ်။

```tsx filename="app/blog/[slug]/page.tsx"
import { codeToHtml } from 'shiki'

export default async function Page() {
  const code = `export function hello() {
    console.log("hi")
  }`

  // The Shiki package runs on the server and is never bundled for the client.
  const highlightedHtml = await codeToHtml(code, {
    lang: 'tsx',
    theme: 'github-dark',
  })

  return (
    <article>
      <h1>Blog Post Title</h1>

      {/* Client receives plain markup */}
      <pre>
        <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      </pre>
    </article>
  )
}
```

### Packages တချို့ကို bundling ကနေ ဖယ်ထုတ်ခြင်း (Opting specific packages out of bundling)

Server Components နဲ့ Route Handlers တွေထဲမှာ import လုပ်ထားတဲ့ packages တွေကို Next.js က အလိုအလျောက် bundle လုပ်ပါတယ်။

`next.config.js` ထဲက [`serverExternalPackages`](/docs/nextjs/next-config-server-external-packages) option ကို သုံးပြီး — packages တချို့ကို bundling ကနေ ဖယ်ထုတ် (opt out) လုပ်နိုင်ပါတယ်။

```js filename="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['package-name'],
}

module.exports = nextConfig
```
