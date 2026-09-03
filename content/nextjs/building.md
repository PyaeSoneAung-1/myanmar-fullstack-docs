---
title: "Building (application တည်ဆောက်ခြင်း)"
description: "`next build` run လုပ်တဲ့အခါ ဘာတွေ ဖြစ်လဲ၊ route table အပါအဝင် build output ကို ဘယ်လို ဖတ်မလဲ၊ prerender-blocking errors တွေကို ဘယ်လို ဖြေရှင်းမလဲ"
order: 224
source: "https://nextjs.org/docs/app/guides/building"
status: translated
updated: 2026-09-03
---

`next build` ကို run လုပ်လိုက်တာနဲ့ သင့် application ကို production အတွက် compile လုပ်ပေးပါတယ်။ သင့် code တွေကို bundle လုပ်ပြီး optimize လုပ်ကာ — တတ်နိုင်တဲ့ route တိုင်းကို [prerender](https://nextjs.org/docs/app/glossary#prerendering) (ကြိုတင် render လုပ်ခြင်း) လုပ်ပြီး — URL တစ်ခုချင်းစီကို ဘယ်လို ပို့ဆောင်ပေးလဲ ပြသတဲ့ route table တစ်ခုကို print ထုတ်ပေးပါတယ်။

ဒီ guide က — route table နဲ့ prerender-blocking errors တွေ အပါအဝင် — build output ကို ဘယ်လို ဖတ်ရမလဲဆိုတာ ပြသပေးပါလိမ့်မယ်။

> ဒီ page ပေါ်က output နဲ့ errors တွေက [Cache Components](/docs/nextjs/next-config-cache-components) enable လုပ်ထားတဲ့ အခြေအနေကို ပြတာပါ — သင့် `next.config.ts` file ထဲမှာ `cacheComponents: true` ဆိုပြီး သတ်မှတ်ထားတာပါ။ ဒီ guide ရဲ့ အများစုက ဒါမပါဘဲလည်း အကျုံးဝင်ပါတယ် — ဒါပေမယ့် route table ထဲက symbols တွေနဲ့ prerender-blocking errors တွေကတော့ ကွဲပြားပါတယ်။ Setup အတွက် [Cache Components enable လုပ်ခြင်း](/docs/nextjs/caching) ကို ကြည့်ပါ။

## `next build` က ဘာတွေ လုပ်လဲ

`next build` ကို run လုပ်တဲ့အခါ — build က အောက်ပါ အဆင့်တွေ (phases) တစ်လျှောက် ရွေ့လျားပါတယ်:

1. **Setup (ပြင်ဆင်မှု).** [Environment variables](/docs/nextjs/environment-variables) (`.env` files) တွေကို load လုပ်ပြီး — သင့် [`next.config`](https://nextjs.org/docs/app/api-reference/config/next-config-js) ကို validate ကာ — [build ID](/docs/nextjs/next-config-generate-build-id) တစ်ခု generate လုပ်ပါတယ်။
2. **Route discovery (route ရှာဖွေခြင်း).** Routes တွေအတွက် `app/` နဲ့ `pages/` directories တွေကို scan လုပ်ပြီး — [`proxy`](/docs/nextjs/file-conventions-proxy) နဲ့ [`instrumentation`](/docs/nextjs/instrumentation) လို root-level convention files တွေကို ရှာဖွေ တွေ့ရှိပါတယ်။ TypeScript route definitions တွေကို generate လုပ်ပါတယ်။
3. **Compilation (compile လုပ်ခြင်း).** [Turbopack](/docs/nextjs/turbopack) (သို့) webpack နဲ့ client, server နဲ့ edge code တွေကို bundle လုပ်ပါတယ်။ TypeScript နဲ့ JSX တွေကို transpile လုပ်ပြီး — မသုံးတဲ့ code တွေကို tree-shake (ဖယ်ရှား) ကာ — CSS နဲ့ fonts တွေကို optimize လုပ်ပါတယ်။ Type checking က အပြိုင် (in parallel) run လုပ်ပါတယ်။
4. **Static analysis (static ခွဲခြမ်းစိတ်ဖြာခြင်း).** Route တစ်ခုချင်းစီကို prerendering (ကြိုတင် render လုပ်ခြင်း) နဲ့ on-demand rendering (လိုအပ်မှသာ render လုပ်ခြင်း) ဆိုပြီး ခွဲခြား သတ်မှတ်ပါတယ်။ [`generateStaticParams`](/docs/nextjs/generate-static-params) ရဲ့ output တွေကို စုဆောင်းပြီး — [prerender-blocking errors](https://nextjs.org/docs/messages/blocking-prerender-dynamic) တွေ ရှိမရှိ စစ်ဆေးပါတယ်။
5. **Prerendering (ကြိုတင် render လုပ်ခြင်း).** Static pages တွေနဲ့ PPR shells တွေကို HTML အဖြစ် prerender လုပ်ပါတယ်။ Client-side navigation အတွက် [RSC payloads](/docs/nextjs/server-client-components) တွေကို generate လုပ်ပါတယ်။
6. **Output (ရလဒ်ထုတ်ပေးခြင်း).** Build ရလဒ်ကို `.next/` ထဲ ရေးသား သိမ်းဆည်းပါတယ်။ [`output: 'standalone'`](/docs/nextjs/self-hosting) အတွက်ဆိုရင် — runtime မှာ လိုအပ်တဲ့ files တွေကိုပဲ bundle လုပ်ပါတယ်။ [`output: 'export'`](/docs/nextjs/static-exports) အတွက်ဆိုရင် — static site အပြည့်အစုံ တစ်ခုကို generate လုပ်ပြီး — route table ကို print ထုတ်ပေးပါတယ်။

## Build output ကို ဖတ်ခြင်း

Build command က သင့် package manager ပေါ် မူတည်ပါတယ်:

```bash package="pnpm"
pnpm build
```

```bash package="npm"
npm run build
```

```bash package="yarn"
yarn build
```

```bash package="bun"
bun run build
```

Build အောင်မြင်ပြီးတဲ့နောက် — Next.js က route တစ်ခုချင်းစီရဲ့ ဘေးမှာ — အဲဒီ route ကို ဘယ်လို ပို့ဆောင်ပေးလဲ ပြသတဲ့ symbol တစ်ခုပါတဲ့ route table တစ်ခုကို print ထုတ်ပေးပါတယ်:

| Symbol | Name (အမည်)        | Behavior (အပြုအမူ)                                                                         |
| ------ | ------------------- | -------------------------------------------------------------------------------------------- |
| `○`    | Static              | Build time မှာ အပြည့်အဝ prerender လုပ်ထားပြီး — server rendering မလိုဘဲ ပို့ဆောင်ပေးတယ်။ |
| `◐`    | Partial Prerender   | Static shell ကို ချက်ချင်း ပို့ဆောင်ပေးပြီး — dynamic content တွေက request time မှာ stream ဝင်လာတယ်။ |
| `●`    | SSG                 | `generateStaticParams` (သို့) `getStaticProps` ကနေ ရတဲ့ prerender လုပ်ထားတဲ့ static HTML။ |
| `ƒ`    | Dynamic             | Request တစ်ခုချင်းစီအတွက် server ပေါ်မှာ on-demand render လုပ်တယ်။                      |

`○` Static, `●` SSG နဲ့ `ƒ` Dynamic တွေက Next.js applications တွေ — Pages Router အပါအဝင် — အမြဲတမ်း render လုပ်ခဲ့တဲ့ modes တွေပါ: route တစ်ခုချင်းစီက static HTML အဖြစ် prerender လုပ်ခံရတာ (သို့) request တစ်ခုချင်းစီအတွက် server ပေါ်မှာ on-demand render လုပ်ခံရတာပါ။

[Cache Components](/docs/nextjs/next-config-cache-components) က `◐` Partial Prerender ကို ထပ်ဖြည့်ပေးပြီး — [Partial Prerendering](/docs/nextjs/caching) ကို default rendering model ဖြစ်စေပါတယ်။ Route တစ်ခုချင်းစီကို — build time မှာ prerender လုပ်ထားတဲ့ static shell နဲ့ request time မှာ stream ဝင်လာတဲ့ dynamic အပိုင်းတွေဆိုပြီး — ပိုင်းခြားလိုက်ပါတယ်။ Routes တွေက အပြည့်အဝ static (`○`) ကနေ တစ်စိတ်တစ်ပိုင်း prerender (`◐`) အထိ — spectrum (အဆင့်အမျိုးမျိုး) တစ်ခုပေါ်မှာ တည်ရှိပြီး — အပြည့်အဝ server-render လုပ်တာ မရှိတော့ပါဘူး: route တစ်ခုက `ƒ` ပြဖို့ဆိုရင် — request ပေါ် မှီခိုတဲ့ [Route Handlers](/docs/nextjs/file-conventions-route)၊ Proxy (Middleware) နဲ့ `icon` (သို့) `opengraph-image` လို dynamic [metadata](/docs/nextjs/generate-metadata) တွေလိုမျိုး — prerender လုပ်စရာ ဘာမှ မရှိတဲ့အခါမှပဲ ဖြစ်ပါတယ်။

Symbol က route က prerender လုပ်ချိန်မှာ ဘာလုပ်လဲဆိုတာကို ထင်ဟပ်ပြတာပါ — သူ export လုပ်ထားတဲ့ validation configs (ဥပမာ [`instant`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant)) တွေ မဟုတ်ပါဘူး။ Cache Components မရှိရင် (သို့) Pages Router ပေါ်မှာဆိုရင် — prerender လုပ်ထားတဲ့ pages တွေက `●` (SSG) ကိုလည်း ပြနိုင်ပါတယ်။

## ဥပမာ (Example)

Prerender validation က production builds တွေ မအောင်မြင်ရတဲ့ အဖြစ်အများဆုံး အကြောင်းရင်းတွေထဲက တစ်ခုပါ။ ဒါက အကာအကွယ် (safeguard) တစ်ခုပါ: Cache Components က uncached နဲ့ runtime data တွေကို — production မှာ သင့် app ကို နှေးကွေးစေနိုင်ချိန် မရောက်ခင် — build time မှာတင် ဖမ်းမိပါတယ်။ ဒီ guide ရဲ့ ကျန်တဲ့ အပိုင်းတွေက — မအောင်မြင်တဲ့ build ကနေ ဖြေရှင်းချက်အထိ — ဒီလို error တစ်မျိုးကို တစ်ဆင့်ချင်း လျှောက်ပြပါတယ်။

ဒီဥပမာက — id အလိုက် data တွေ load လုပ်တဲ့ dynamic product page တစ်ခု ပါတဲ့ store app တစ်ခုကို သုံးပါတယ်:

```txt
app/
├── layout.tsx
├── page.tsx
└── products/
    └── [id]/
        └── page.tsx
```

ကျွန်တော်တို့က `app/products/[id]/page.tsx` ထဲမှာ အလုပ်လုပ်ပါမယ်:

```tsx filename="app/products/[id]/page.tsx" switcher
export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

```jsx filename="app/products/[id]/page.js" switcher
export default async function Page({ params }) {
  const { id } = await params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

Build လုပ်နေချိန်မှာ — Next.js က route တစ်ခုချင်းစီကို [build time](https://nextjs.org/docs/app/glossary#build-time) (build ပြုလုပ်ချိန်) မှာ တတ်နိုင်သမျှ များများ prerender လုပ်ပါတယ်။ [Runtime data](https://nextjs.org/docs/app/glossary#request-time-apis) ([`params`](/docs/nextjs/file-conventions-page), [`searchParams`](/docs/nextjs/file-conventions-page), [`cookies()`](/docs/nextjs/cookies), [`headers()`](/docs/nextjs/headers)) နဲ့ uncached data (`fetch()`, database calls) တွေကတော့ အဲဒီ pass အတွင်း မရနိုင်ပါဘူး။ Runtime reads တွေကို [`<Suspense>`](https://react.dev/reference/react/Suspense) ထဲမှာ wrap လုပ်ပြီး — data access တွေကို [`use cache`](/docs/nextjs/use-cache) နဲ့ cache လုပ်ပါ (ဒါမှမဟုတ် `<Suspense>` ထဲမှာပဲ wrap လုပ်ပါ)။ မဟုတ်ရင် — build က [`blocking-prerender-runtime`](https://nextjs.org/docs/messages/blocking-prerender-runtime) (သို့) [`blocking-prerender-dynamic`](https://nextjs.org/docs/messages/blocking-prerender-dynamic) error နဲ့ မအောင်မြင်ပါဘူး။ `Math.random()` (သို့) `new Date()` လို [Random values နဲ့ timestamps တွေ](/docs/nextjs/caching) ကလည်း build ကို မအောင်မြင်စေနိုင်ပါတယ်။

`next build` ကို run လုပ်ကြည့်ပါ။ `params` ဖတ်တာနဲ့ uncached `fetch` က `<Suspense>` boundary ရဲ့ အပြင်မှာ run နေလို့ — prerender-blocking error နဲ့ မအောင်မြင်ပါဘူး:

```bash filename="Terminal"
Error: Route "/products/[id]": Next.js encountered uncached or runtime data during prerendering.

`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
    at body (<anonymous>)
    at html (<anonymous>)
To get a more detailed stack trace and pinpoint the issue, try one of the following:
  - Start the app in development mode by running `next dev`, then open "/products/[id]" in your browser to investigate the error.
  - Rerun the production build with `next build --debug-prerender` to generate better stack traces.
Error occurred prerendering page "/products/[id]".
```

### Build errors တွေကို debug လုပ်ခြင်း

Production builds တွေက server code တွေကို minify လုပ်ပြီး — အဲဒါအတွက် source maps တွေ generate မလုပ်ပေးတာမို့ — တစ်ခါတစ်ရံ error က လုံလောက်တဲ့ အချက်အလက်တွေ မပေးနိုင်ပါဘူး။ Build ကို [`--debug-prerender`](/docs/nextjs/next-cli) နဲ့ ပြန် run လုပ်ကြည့်ပါ:

```bash filename="Terminal"
next build --debug-prerender
```

ဒါက minification ကို ပိတ်ပြီး — server bundles တွေအတွက် source maps တွေ ဖွင့်ပေးကာ — ပထမဆုံး failure ကို ကျော်လွန်ပြီး ဆက်လုပ်လို့ — ကျန်နေတဲ့ ပြဿနာတွေက run တစ်ကြိမ်တည်းနဲ့ ပေါ်လာပါတယ်။ ဒါက prerendering အတွင်း throw ဖြစ်တဲ့ error ဘယ်ဟာမဆို — blocking ones တွေတင်မကဘဲ — အထောက်အကူ ဖြစ်စေပါတယ်။ Stack trace က အခုဆို page ထဲက ပထမဆုံး blocked access ဖြစ်တဲ့ `params` ဖတ်တာကို ညွှန်ပြနေပါပြီ:

```bash filename="Terminal"
Error: Route "/products/[id]": Next.js encountered uncached or runtime data during prerendering.
  ...
    at Page (app/products/[id]/page.tsx:2:30)
  1 | export default async function Page(props: PageProps<'/products/[id]'>) {
> 2 |   const { id } = await props.params
    |                              ^
  3 |   const res = await fetch(`https://api.example.com/products/${id}`)
  4 |   const product = await res.json()
```

> **သတိပေးချက်:** `--debug-prerender` နဲ့ ထုတ်လုပ်ထားတဲ့ builds တွေကို deploy မလုပ်ပါနဲ့။ အဲဒါတွေက production မှာ လိုအပ်တဲ့ optimizations တွေကို ကျော်လိုက်လို့ပါ။

Route ကို `next dev` ထဲမှာ run လုပ်ရင် — component နဲ့ line ကို ကြိုပြီး ဖော်ထုတ်ပြီးသား အခြေအနေနဲ့ — error အပြည့်အစုံကို ချက်ချင်း ပြသပါတယ်။ ဒီလို errors တွေနဲ့ အသေးစိတ် အလုပ်လုပ်ဖို့ [instant navigation guide](/docs/nextjs/instant-navigation) ကို ကြည့်ပါ။

အကြောင်းရင်း ရှာတွေ့ပြီဆိုတော့ — fix တစ်ခုချင်းစီကို အသုံးပြုပြီး build output ဘယ်လို ပြောင်းလဲလဲ ကြည့်ကြရအောင်။

### Streaming route တစ်ခု

Error ရဲ့ ပထမဆုံး အကြံပြုချက် `[stream]` က — data access ရဲ့ ပတ်လည်မှာ placeholder (နေရာခံ) တစ်ခု ပေးဖို့ပါ။ Segment တစ်ခုလုံးကို `<Suspense>` boundary တစ်ခုနဲ့ wrap လုပ်ဖို့ [`loading.js`](/docs/nextjs/file-conventions-loading) file တစ်ခု ထည့်ပါ။ Next.js က fallback ကို route ရဲ့ static shell အဖြစ် prerender လုပ်ပြီး — params နဲ့ data အလုပ်တွေက request time မှာ run ပါတယ်။ တခြား boundary နေရာချထားမှုတွေအတွက် — [Streaming](/docs/nextjs/streaming) ကို ကြည့်ပါ:

```tsx filename="app/products/[id]/loading.tsx" switcher
export default function Loading() {
  return <div>Loading...</div>
}
```

```jsx filename="app/products/[id]/loading.js" switcher
export default function Loading() {
  return <div>Loading...</div>
}
```

Build ကို run လုပ်ကြည့်ပါ။ အောင်မြင်သွားပြီး — route က [partially prerendered](https://nextjs.org/docs/app/glossary#partial-prerendering-ppr) (တစ်စိတ်တစ်ပိုင်း ကြိုတင် render လုပ်ခံရ) ဖြစ်ပါတယ်:

```bash filename="Terminal"
Route (app)
┌ ○ /                   # Prerendered at build time
├ ○ /_not-found
└   /products/[id]
  └ ◐ /products/[id]    # Shell prerendered, content streams on request

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

Product URLs တွေက အခုဆို prerender လုပ်ထားတဲ့ shell ကို ချက်ချင်း ပို့ဆောင်ပေးပြီး — page content တွေကို ဆက်ပြီး stream လုပ်ပေးပါတယ်။

### Routes အတိအကျ (specific routes) build လုပ်ခြင်း

ပိုကြီးတဲ့ app တစ်ခုမှာ ဒီ route တစ်ခုတည်းကိုပဲ ထပ်ခါထပ်ခါ စမ်းနေတယ်ဆိုရင် — အရာအားလုံးကို ပြန် rebuild လုပ်မယ့်အစား — build တစ်ခုချင်းစီကို အဲဒီ route အတွက်ပဲ ကန့်သတ်ထားလို့လည်း ရပါတယ်။ ထည့်သွင်းချင်တဲ့ route files တွေနဲ့အတူ [`--debug-build-paths`](/docs/nextjs/next-cli) ကို ပေးလိုက်ပါ:

```bash filename="Terminal"
next build --debug-build-paths="app/products/[id]/page.tsx"
```

Next.js က ကိုက်ညီတဲ့ routes တွေကိုပဲ compile လုပ်ပြီး prerender လုပ်ကာ — app ရဲ့ ကျန်တဲ့ အစိတ်အပိုင်းတွေကို ကျော်သွားပါတယ်။ ဒီ option က comma နဲ့ ခြားထားတဲ့ paths တွေနဲ့ glob patterns တွေကို လက်ခံပြီး — `!` prefix နဲ့ ဖယ်ထုတ်လို့ရကာ — debugging လုပ်ချိန်မှာ `--debug-prerender` နဲ့လည်း တွဲသုံးလို့ရပါတယ်။ ကျွန်တော်တို့ store မှာ routes နည်းနည်းပဲ ရှိတာမို့ — app တစ်ခုလုံးကိုပဲ ဆက်ပြီး build လုပ်သွားပါမယ်။

### Prerender လုပ်ထားတဲ့ params

[Dynamic segment](https://nextjs.org/docs/app/glossary#dynamic-route-segments) က fallback row တစ်ခုတည်းကိုပဲ ပြပါတယ် — ဘာကြောင့်လဲဆိုတော့ param values တွေ ဘာတွေ ရှိလဲဆိုတာ Next.js က မသိသေးလို့ပါ။ အဲဒါတွေကို စာရင်းပြုစုဖို့ `generateStaticParams` ကို export လုပ်ပါ:

```tsx filename="app/products/[id]/page.tsx" switcher
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  return products.map((product) => ({ id: product.id }))
}

export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

```jsx filename="app/products/[id]/page.js" switcher
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  return products.map((product) => ({ id: product.id }))
}

export default async function Page({ params }) {
  const { id } = await params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

Build ကို ထပ်ပြီး run လုပ်လိုက်ရင် — `/products/[id]` route ရဲ့ အောက်မှာ စာရင်းပြုစုထားတဲ့ param တစ်ခုချင်းစီအတွက် row တစ်ခုစီ ထပ်ပေါင်းထည့်ပါတယ်:

```bash filename="Terminal"
Route (app)
┌ ○ /
├ ○ /_not-found
└   /products/[id]
  ├ ◐ /products/[id]
  ├ ◐ /products/1       # Params known, data still uncached
  ├ ◐ /products/2       # Params known, data still uncached
  └ ◐ /products/3       # Params known, data still uncached

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

> **သိထားသင့်သည်:** `generateStaticParams` က param အနည်းဆုံး တစ်ခုတော့ return လုပ်ပေးရပါမယ်။ Array အလွတ်ဆိုရင် [build error](https://nextjs.org/docs/messages/empty-generate-static-params) တစ်ခု ဖြစ်စေပါတယ်။

Row အသစ်တွေက `○` မဟုတ်ဘဲ `◐` ပြနေပါတယ်။ Params တွေကို စာရင်းပြုစုလိုက်တာက ဘယ် pages တွေ ရှိတယ်ဆိုတာ Next.js ကို ပြောပြတာပါ — ဒါပေမယ့် သူတို့ရဲ့ content တွေကတော့ request time မှာပဲ run လုပ်တဲ့ uncached lookup ကနေ ဆက်ပြီး လာပါတယ်။ Page တစ်ခုချင်းစီက static shell ကို ပို့ဆောင်ပေးပြီး — သူ့ရဲ့ content ကို stream လုပ်ပါတယ်။

> **သိထားသင့်သည်:** ဒီနေရာမှာ `fetch` က prerendering အတွင်းမှာ run တာမို့ — data ပြန်ပေးတဲ့ အလုပ်လုပ်နေတဲ့ endpoint (သို့) fake async source တစ်ခုကို ညွှန်ပြထားပါ။ `◐` rows တွေက lookup က တကယ့် uncached I/O ဖြစ်မှပဲ ပေါ်လာပါတယ်; synchronous in-memory value တစ်ခုကတော့ static အနေနဲ့ သတ်မှတ်ခံရပြီး — param တစ်ခုချင်းစီကို `○` အဖြစ် prerender လုပ်လိုက်ပါတယ်။

### Cache လုပ်ထားတဲ့ data

Error ရဲ့ `[cache]` ဖြေရှင်းနည်းက lookup ကို build time ဆီ ရွှေ့လိုက်တာပါ။ Prerendering အတွင်း run လို့ရအောင် `use cache` ထည့်လိုက်ပါ:

```tsx filename="app/products/[id]/page.tsx" switcher
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  return products.map((product) => ({ id: product.id }))
}

async function getProduct(id: string) {
  'use cache'
  const res = await fetch(`https://api.example.com/products/${id}`)
  return res.json()
}

export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const product = await getProduct(id)
  return <div>{product.name}</div>
}
```

```jsx filename="app/products/[id]/page.js" switcher
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  return products.map((product) => ({ id: product.id }))
}

async function getProduct(id) {
  'use cache'
  const res = await fetch(`https://api.example.com/products/${id}`)
  return res.json()
}

export default async function Page({ params }) {
  const { id } = await params
  const product = await getProduct(id)
  return <div>{product.name}</div>
}
```

Build ကို ထပ်ပြီး run လုပ်လိုက်ရင် စာရင်းပြုစုထားတဲ့ params တွေက `○` အဖြစ် ပြပါတယ်။ သူတို့ရဲ့ params တွေကို သိပြီး data တွေကိုလည်း cache လုပ်ထားလို့ — Next.js က page တစ်ခုချင်းစီကို အပြည့်အဝ prerender လုပ်ပါတယ်။ စာရင်းထဲ မပါတဲ့ params တွေအတွက်တော့ `◐` row က ကျန်နေပြီး — သူတို့ရဲ့ content တွေ stream ဝင်နေချိန်မှာ static shell ကို ပို့ဆောင်ပေးပါတယ်:

```bash filename="Terminal"
Route (app)
┌ ○ /
├ ○ /_not-found
└   /products/[id]
  ├ ◐ /products/[id]    # Unlisted params stream on demand
  ├ ○ /products/1       # Prerendered in full at build time
  ├ ○ /products/2       # Prerendered in full at build time
  └ ○ /products/3       # Prerendered in full at build time

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

`cookies()`, `headers()` (သို့) `searchParams` တွေကို ဖတ်တဲ့ pages တွေက `◐` အဖြစ် ဆက်ရှိနေပြီး — visit တစ်ခုချင်းစီမှာ အဲဒီ အစိတ်အပိုင်းတွေကို shell ထဲ stream လုပ်ဝင်ပါတယ်။

User တစ်ယောက်က စာရင်းမပါတဲ့ param တစ်ခုကို visit လုပ်တဲ့အခါ — Next.js က content တွေ stream ဝင်နေချိန်မှာ static shell ကို ချက်ချင်း ပို့ဆောင်ပေးပြီး — page ကို နောက်ခံမှာ upgrade လုပ်ပါတယ်။ [Cache Components နဲ့ Incremental Static Regeneration](/docs/nextjs/incremental-static-regeneration-cache-components) ကို ကြည့်ပါ။

Table ထဲ ဝင်ဆံ့တာထက် prerendered paths တွေ ပိုများနေရင် — Next.js က `[+N more paths]` နဲ့ အဆုံးသတ်တဲ့ စာရင်းတိုလေး တစ်ခုကို print ထုတ်ပါတယ်။

Cached functions (သို့) components တွေ ပါဝင်တဲ့ routes တွေက `Revalidate` နဲ့ `Expire` columns တွေကိုလည်း ပြပါတယ်။ Route တစ်ခုက သူ့ထဲမှာ ပါဝင်တဲ့ caches အားလုံးရဲ့ အတိုဆုံး `revalidate` နဲ့ `expire` တန်ဖိုးတွေကို ဖော်ပြပါတယ်။ Caches တွေက [`default` profile](/docs/nextjs/cache-life) ကို သုံးတာမို့ — ရှင်းရှင်းလင်းလင်း [`cacheLife`](/docs/nextjs/cache-life) call တစ်ခု မပါဘဲနဲ့တောင် ဒါက အကျုံးဝင်ပါတယ်။ တူညီတဲ့ cached product data တွေကို render လုပ်တဲ့ `/products` listing page တစ်ခု ထည့်ကြည့်ရအောင်:

```bash filename="Terminal"
Route (app)           Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /products                15m      1y
└   /products/[id]
  ├ ◐ /products/[id]
  ├ ○ /products/1            15m      1y
  ├ ○ /products/2            15m      1y
  └ ○ /products/3            15m      1y
```

Routes တွေက မိနစ် ၁၅ ကြာတိုင်း — `default` profile ရဲ့ တန်ဖိုးအတိုင်း — [revalidate](/docs/nextjs/revalidating) (ပြန်လည် စစ်ဆေး) လုပ်ပါတယ်။ ဒီ profile က ဘယ်တော့မှ expire မဖြစ်ဘဲ — `Expire` column က တစ်နှစ်မှာ အထွတ်အထိတ် (cap) ရပ်သွားပြီး `1y` အဖြစ် ပြပါတယ်။ Table က ဘယ် cache က ဒီတန်ဖိုးတွေ ထုတ်ပေးတယ်ဆိုတာ မပြပါဘူး — ဒါကြောင့် route တစ်ခုထဲမှာ caches အများကြီး ရှိနေရင် — သူတို့ရဲ့ `cacheLife` calls တွေကို စစ်ကြည့်ပါ။

### Blocking route တစ်ခု

Error ရဲ့ နောက်ဆုံး အကြံပြုချက် `[block]` က အပေါ်က ဖြေရှင်းနည်းတွေရဲ့ ရွေးချယ်စရာ တစ်ခုပါ။ အပေါ်က fix တွေကို ဖယ်ထားပြီး — မူရင်း page ပေါ်မှာ `instant = false` ကိုပဲ သတ်မှတ်ထားတယ်ဆိုပါစို့။ ဒါက route ရဲ့ render လုပ်ပုံကို မပြောင်းလဲပါဘူး။ Validation ကနေ ရည်ရွယ်ချက်ရှိရှိ ထွက်လိုက်ခြင်း (opt out) အားဖြင့် blocking route တစ်ခုကို ခွင့်ပြုလိုက်တာပဲ ဖြစ်ပါတယ်:

```tsx filename="app/products/[id]/page.tsx" switcher
export const instant = false

export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

```jsx filename="app/products/[id]/page.js" switcher
export const instant = false

export default async function Page({ params }) {
  const { id } = await params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

Build က အောင်မြင်ပြီး — output က streaming route နဲ့ အတူတူပဲ ကြည့်ရပါတယ်။ Dynamic segments တွေက — အဓိပ္ပာယ်ရှိတဲ့ အရာ ဘာမှ prerender မလုပ်ရသေးတဲ့အခါမှာတောင် — `◐` fallback row တစ်ခုကို ပြပါတယ်:

```bash filename="Terminal"
Route (app)
┌ ○ /
├ ○ /_not-found
└   /products/[id]
  └ ◐ /products/[id]    # Renders on demand, blocking on the lookup

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

Streaming route နဲ့ မတူဘဲ — fallback UI ဆိုတာ မရှိပါဘူး: lookup ပြီးမြောက်တဲ့အထိ users တွေ ဘာမှ မမြင်ရပါဘူး။ ဒါက ဘယ်အခါ သင့်လျော်လဲဆိုတာအတွက် — [Opting out](/docs/nextjs/instant-navigation) ကို ကြည့်ပါ။

## နောက်ထပ် အဆင့်များ (Next steps)

Production build တစ်ခု run လုပ်နည်း၊ route table ဖတ်နည်းနဲ့ prerender-blocking errors တွေကို နားလည်နည်းတွေကို လေ့လာပြီးပါပြီ။ နောက်ထပ် ဒါတွေကို လေ့လာပါ:

- [သင့် application ကို Deploy လုပ်ခြင်း](/docs/nextjs/deploying)
- [Data နဲ့ UI တွေကို Cache လုပ်ခြင်း](/docs/nextjs/caching)
- [Cache လုပ်ထားတဲ့ routes တွေကို ISR နဲ့ Revalidate လုပ်ခြင်း](/docs/nextjs/incremental-static-regeneration-cache-components)
- [CI build caching ကို Configure လုပ်ခြင်း](/docs/nextjs/ci-build-caching)
