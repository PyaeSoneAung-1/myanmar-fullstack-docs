---
title: "Turbopack (Next.js ရဲ့ incremental bundler)"
description: "Turbopack အကြောင်း — Next.js ရဲ့ default bundler; supported features (language, React, CSS, assets, module resolution), magic comments, import.meta.env/import.meta.glob, webpack နဲ့ ကွာခြားချက်များ, configuration နဲ့ မပံ့ပိုးရသေးတဲ့ feature များ"
order: 242
source: "https://nextjs.org/docs/app/api-reference/turbopack"
status: translated
updated: 2026-09-03
---

Turbopack ဆိုတာ **incremental bundler** (တစ်စိတ်တစ်ပိုင်းချင်း တိုးတိုးတက်တက် စုစည်းတဲ့ bundler) တစ်ခုဖြစ်ပြီး — JavaScript နဲ့ TypeScript အတွက် optimize လုပ်ထားကာ — Rust နဲ့ ရေးသားထားပြီး **Next.js** ထဲမှာ built-in ပါဝင်ပါတယ်။ Pages Router ရော App Router မှာပါ Turbopack ကို သုံးနိုင်ပြီး — local development အတွေ့အကြုံကို **သိသိသာသာ မြန်ဆန်**စေပါတယ်။

## ဘာကြောင့် Turbopack လဲ?

Next.js ရဲ့ performance ကို မြှင့်တင်ဖို့အတွက် ကျွန်တော်တို့ Turbopack ကို တည်ဆောက်ခဲ့ပါတယ်၊ ဥပမာ:

- **Unified Graph (ပေါင်းစည်းထားသော graph):** Next.js က output environments အများအပြားကို (ဥပမာ — client နဲ့ server) support လုပ်ပါတယ်။ Compiler အများကြီးကို စီမံပြီး bundles တွေကို ချုပ်ရတာက ငြီးငွေ့စရာ ဖြစ်နိုင်ပါတယ်။ Turbopack က environments အားလုံးအတွက် **single, unified graph** (တစ်ခုတည်းသော ပေါင်းစည်းထားသည့် graph) တစ်ခုကို သုံးပါတယ်။
- **Bundling vs Native ESM:** တချို့ tools တွေက development မှာ bundling ကို ကျော်လိုက်ပြီး — browser ရဲ့ native ESM ကို အားကိုးပါတယ်။ ဒါက app ငယ်တွေအတွက် ကောင်းပေမယ့် — network requests တွေ အလွန်အကျွံ ဖြစ်လို့ — app ကြီးတွေမှာ နှေးကွေးစေနိုင်ပါတယ်။ Turbopack က dev မှာ **bundling** ကို လုပ်ပေးပြီး — app ကြီးတွေ မြန်နေစေဖို့ optimized ပုံစံနဲ့ လုပ်ပါတယ်။
- **Incremental Computation (တစ်ဆင့်ချင်း တွက်ချက်ခြင်း):** Turbopack က အလုပ်တွေကို cores တွေပေါ်မှာ parallel လုပ်ပြီး — function အဆင့်အထိ results တွေကို **cache** လုပ်ပါတယ်။ အလုပ်တစ်ခု ပြီးသွားရင် Turbopack က အဲဒါကို ပြန်မလုပ်တော့ပါဘူး။ Results တွေက run တစ်ခုနဲ့တစ်ခုကြားမှာ disk ပေါ် ဆက်လက် သိမ်းဆည်းထားပါတယ်။
- **Lazy Bundling:** Turbopack က dev server က တကယ် request လုပ်တဲ့အရာကိုပဲ bundle လုပ်ပါတယ်။ ဒီ lazy ပုံစံက ကနဦး compile time နဲ့ memory usage ကို လျှော့ချပေးနိုင်ပါတယ်။

## Supported platforms (ပံ့ပိုးထားသော platform များ)

Turbopack က platform-specific native bindings တွေ လိုအပ်ပါတယ်။ အောက်ပါ platform တွေကို လက်ရှိ support လုပ်ထားပါတယ်:

| Platform       | Architecture |
| -------------- | ------------ |
| macOS (Darwin) | x64, ARM64   |
| Windows        | x64, ARM64   |
| Linux (glibc)  | x64, ARM64   |
| Linux (musl)   | x64, ARM64   |

Native bindings မရှိတဲ့ platform တွေမှာ (ဥပမာ — FreeBSD, OpenBSD) — Next.js က WebAssembly (WASM) bindings တွေဆီ ပြန်ကျပါတယ်။ WASM bindings တွေက compilation နဲ့ minification လို core SWC feature တွေကို support လုပ်ပေးပေမယ့် — **Turbopack ကိုတော့ support မလုပ်ပါဘူး**။ ဒီ platform တွေမှာ `--webpack` flag ကို သုံးပါ:

```bash
next dev --webpack
next build --webpack
```

## Getting started (စတင်အသုံးပြုခြင်း)

Turbopack က အခုဆို Next.js ရဲ့ **default bundler** ဖြစ်ပါတယ်။ Turbopack သုံးဖို့ configuration ဘာမှ မလိုအပ်ပါဘူး:

```json filename="package.json" highlight={3}
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### Webpack ကို ပြန်သုံးချင်ရင် (Using Webpack instead)

Turbopack အစား Webpack ကို သုံးဖို့ လိုအပ်ရင် — `--webpack` flag နဲ့ opt-in လုပ်နိုင်ပါတယ်:

```json filename="package.json"
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start"
  }
}
```

## Supported features (ပံ့ပိုးထားသော feature များ)

Next.js ထဲက Turbopack က အသုံးများတဲ့ use cases တွေအတွက် **zero-configuration** (ဘာမှ configure လုပ်စရာ မလို) ဖြစ်ပါတယ်။ အောက်မှာ out of the box support လုပ်ထားတဲ့အရာတွေရဲ့ အကျဉ်းချုပ်နဲ့ — လိုအပ်ရင် Turbopack ကို ထပ်ပြီး configure လုပ်နိုင်တဲ့ နည်းလမ်းတွေဆီ ကိုးကားချက်တွေကို ဖော်ပြထားပါတယ်။

### Language features (ဘာသာစကားဆိုင်ရာ feature များ)

| Feature                     | Status        | Notes                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **JavaScript & TypeScript** | **Supported** | SWC ကို အတွင်းပိုင်းမှာ အသုံးပြုပါတယ်။ Type-checking ကို Turbopack က မလုပ်ပေးပါဘူး (type checks အတွက် `tsc --watch` ကို run ပါ (သို့) သင့် IDE ကို အားကိုးပါ)။                                                                                                                                                                                                                                                |
| **ECMAScript (ESNext)**     | **Supported** | Turbopack က SWC ရဲ့ coverage နဲ့ ကိုက်ညီအောင် — ECMAScript feature အသစ်ဆုံးတွေကို support လုပ်ပါတယ်။                                                                                                                                                                                                                                             |
| **CommonJS**                | **Supported** | `require()` syntax ကို out of the box ကိုင်တွယ်ပေးပါတယ်။                                                                                                                                                                                                                                                                                                                                                           |
| **ESM**                     | **Supported** | Static ရော dynamic `import` ကိုပါ အပြည့်အဝ support လုပ်ပါတယ်။                                                                                                                                                                                                                                                                                                                                                      |
| **Babel**                   | **Supported** | Next.js 16 ကစပြီး — Turbopack က [Babel configuration file](https://babeljs.io/docs/config-files) တစ်ခုကို detect တွေ့ရင် Babel ကို အလိုအလျောက် သုံးပါတယ်။ Webpack နဲ့ မတူတဲ့အချက်က — Next.js ရဲ့ internal transforms နဲ့ ECMAScript ဗားရှင်းဟောင်းတွေဆီ downleveling လုပ်တာတွေအတွက် SWC ကို အမြဲတမ်း သုံးပါတယ်။ Webpack သုံးတဲ့ Next.js ကတော့ Babel configuration file ရှိနေရင် SWC ကို disable လုပ်ပါတယ်။ `node_modules` ထဲက files တွေကိုတော့ ချန်လှပ်ထားပြီး — [`babel-loader` ကို ကိုယ်တိုင် configure](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#configuring-webpack-loaders) လုပ်ထားမှသာ ချွင်းချက်ဖြစ်ပါတယ်။ |

### Framework နဲ့ React feature များ

| Feature                           | Status        | Notes                                                                                                                  |
| --------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **JSX / TSX**                     | **Supported** | SWC က JSX/TSX compilation ကို ကိုင်တွယ်ပါတယ်။                                                                       |
| **Fast Refresh**                  | **Supported** | Configuration ဘာမှ မလိုပါဘူး။                                                                                       |
| **React Server Components (RSC)** | **Supported** | Next.js App Router အတွက်ပါ။ Turbopack က server/client bundling မှန်ကန်စွာ ဖြစ်အောင် သေချာ လုပ်ပေးပါတယ်။      |
| **Root layout creation**          | Unsupported   | App Router မှာ root layout တစ်ခုကို အလိုအလျောက် ဖန်တီးပေးတာကိုတော့ support မလုပ်ပါဘူး။ Turbopack က root layout ကို ကိုယ်တိုင် ဖန်တီးဖို့ သင့်ကို ညွှန်ကြားပါလိမ့်မယ်။ |

### CSS နဲ့ Styling

| Feature            | Status                  | Notes                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Global CSS**     | **Supported**           | `.css` files တွေကို သင့် application ထဲ တိုက်ရိုက် import လုပ်နိုင်ပါတယ်။                                                                                                                                                                                                                                                                          |
| **CSS Modules**    | **Supported**           | `.module.css` files တွေက native အနေနဲ့ အလုပ်လုပ်ပါတယ် (Lightning CSS)။                                                                                                                                                                                                                                                                              |
| **CSS Nesting**    | **Supported**           | Lightning CSS က [modern CSS nesting](https://lightningcss.dev/) ကို support လုပ်ပါတယ်။                                                                                                                                                                                                                                                               |
| **@import syntax** | **Supported**           | CSS files အများအပြားကို ပေါင်းစပ်နိုင်ပါတယ်။                                                                                                                                                                                                                                                                                                           |
| **PostCSS**        | **Supported**           | PostCSS config files (`postcss.config.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`) တွေကို Node.js worker pool ထဲမှာ အလိုအလျောက် process လုပ်ပါတယ်။ Tailwind, Autoprefixer စတာတွေအတွက် အသုံးဝင်ပါတယ်။                                                                                                                                       |
| **Sass / SCSS**    | **Supported** (Next.js) | Next.js အတွက်တော့ — Sass ကို out of the box support လုပ်ပါတယ်။ Custom Sass functions (`sassOptions.functions`) တွေကိုတော့ support မလုပ်ပါဘူး — အကြောင်းကတော့ Turbopack ရဲ့ Rust-based architecture က webpack ရဲ့ Node.js environment လိုမဟုတ်ဘဲ — JavaScript functions တွေကို တိုက်ရိုက် execute လုပ်လို့ မရလို့ပါ။ ဒီ feature လိုအပ်ရင် webpack ကို သုံးပါ။ နောင်မှာ — Turbopack standalone အသုံးပြုမှုအတွက် loader config တစ်ခု လိုအပ်နိုင်ပါတယ်။ |
| **Less**           | Planned via plugins     | Default အနေနဲ့တော့ မရသေးပါဘူး။ Custom loaders တွေ တည်ငြိမ်သွားတာနဲ့ — loader config တစ်ခု လိုအပ်နိုင်ပါတယ်။                                                                                                                                                                                                                                     |
| **Lightning CSS**  | **In Use**              | CSS transformations တွေကို ကိုင်တွယ်ပါတယ်။ အသုံးနည်းတဲ့ CSS Modules feature တချို့ (`:local/:global` ကို standalone pseudo-classes အနေနဲ့ သုံးတာလိုမျိုး) ကိုတော့ support မလုပ်ရသေးပါဘူး။ အောက်မှာ နောက်ထပ် အသေးစိတ် ကြည့်ပါ။                                                                                                                                                                          |

### Assets (ဖိုင်အရင်းအမြစ်များ)

| Feature                           | Status        | Notes                                                                                                                      |
| --------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Static Assets** (images, fonts) | **Supported** | `import img from './img.png'` လို import လုပ်တာက out of the box အလုပ်လုပ်ပါတယ်။ Next.js မှာတော့ — `<Image />` component အတွက် object တစ်ခုကို return လုပ်ပါတယ်။ |
| **JSON Imports**                  | **Supported** | `.json` ကနေ named (သို့) default imports တွေကို support လုပ်ပါတယ်။                                                                       |

### Module resolution (module ရှာဖွေဖြေရှင်းခြင်း)

| Feature               | Status              | Notes                                                                                                                                                           |
| --------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Path Aliases**      | **Supported**       | `tsconfig.json` ရဲ့ `paths` နဲ့ `baseUrl` တွေကို ဖတ်ပြီး — Next.js ရဲ့ အပြုအမူနဲ့ ကိုက်ညီပါတယ်။                                                                                       |
| **Manual Aliases**    | **Supported**       | [`next.config.js` ထဲမှာ `resolveAlias` ကို configure လုပ်ပါ](/docs/nextjs/next-config-turbopack) (`webpack.resolve.alias` နဲ့ ဆင်တူပါတယ်)။ |
| **Custom Extensions** | **Supported**       | [`next.config.js` ထဲမှာ `resolveExtensions` ကို configure လုပ်ပါ](/docs/nextjs/next-config-turbopack)။                       |
| **AMD**               | Partially Supported | အခြေခံ transforms တွေ အလုပ်လုပ်ပြီး — အဆင့်မြင့် AMD အသုံးပြုမှုတွေကတော့ အကန့်အသတ်ရှိပါတယ်။                                                                                                           |

### Performance နဲ့ Fast Refresh

| Feature                  | Status        | Notes                                                                                                                                                       |
| ------------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fast Refresh**         | **Supported** | JavaScript, TypeScript နဲ့ CSS တွေကို full refresh မလိုဘဲ update လုပ်ပေးပါတယ်။                                                                                             |
| **Incremental Bundling** | **Supported** | Turbopack က dev server က request လုပ်တဲ့အရာကိုပဲ lazily build လုပ်ပြီး — app ကြီးတွေကို မြန်ဆန်စေပါတယ်।                                                                    |
| **FileSystem Cache**     | **Supported** | Compiler artifacts တွေကို run တစ်ခုနဲ့တစ်ခုကြားမှာ disk ပေါ် သိမ်းဆည်းထားပါတယ်။ [`turbopackFileSystemCache`](/docs/nextjs/next-config-turbopack-file-system-cache) ကို ကြည့်ပါ။ |

### Magic Comments

Turbopack က import အပြုအမူကို ထိန်းချုပ်ဖို့ — webpack-compatible magic comments တွေကို support လုပ်ပါတယ်။ ဒီ comments တွေက dynamic `import()`, `require()`, `require.resolve()` နဲ့ `new Worker()` expressions တွေနဲ့ အလုပ်လုပ်ပါတယ် (static `import` statements တွေနဲ့တော့ မဟုတ်ပါဘူး)။

| Comment                   | Webpack | Turbopack | Description                    |
| ------------------------- | ------- | --------- | ------------------------------ |
| `webpackIgnore: true`     | ✓       | ✓         | Bundling ကို ကျော်ပြီး import ကို ထိန်းသိမ်းပါ |
| `turbopackIgnore: true`   | ✗       | ✓         | Bundling ကို ကျော်ပါ (Turbopack မှာပဲ) |
| `turbopackOptional: true` | ✗       | ✓         | Resolve errors တွေကို ဖိနှိပ်ပါ        |
| `webpackOptional: true`   | ✗       | ✗         | Support မလုပ်ပါ                  |

အသုံးပြုပုံ ဥပမာတွေအတွက် [Lazy Loading](/docs/nextjs/lazy-loading) ကို ကြည့်ပါ။

## import.meta.env

Turbopack က `import.meta.env` ကနေတစ်ဆင့် built-in environment metadata တွေကို support လုပ်ပါတယ်:

| Property   | Type      | Value                                                              |
| ---------- | --------- | ------------------------------------------------------------------ |
| `DEV`      | `boolean` | `MODE` က `"production"` မဟုတ်လားဆိုတာ                               |
| `PROD`     | `boolean` | `MODE` က `"production"` လားဆိုတာ                                   |
| `MODE`     | `string`  | Compile-time `NODE_ENV` ဖြစ်ပြီး — default က `"development"` ပါ         |
| `BASE_URL` | `string`  | Next.js ရဲ့ `basePath` ဖြစ်ပြီး — trailing slash ပါဝင်ပါတယ် (default က `"/"`)   |
| `SSR`      | `boolean` | Server bundles တွေမှာ `true` ဖြစ်ပြီး — browser နဲ့ client bundles တွေမှာ `false` ပါ |

ဒီ values တွေကို statically analyze လုပ်လို့ — Turbopack က unreachable branches တွေကို ဖယ်ရှားနိုင်ပါတယ်:

```ts filename="app/example.ts"
if (import.meta.env.DEV) {
  console.log('development mode')
}
```

Object တစ်ခုလုံးကို ဖတ်တာ၊ destructure လုပ်တာ (သို့) static bracket access သုံးတာတွေလည်း လုပ်နိုင်ပါတယ်:

```ts filename="app/example.ts"
const { MODE, SSR } = import.meta.env
const baseUrl = import.meta.env['BASE_URL']
```

> **သိထားသင့်သည်:** `import.meta.env` က Turbopack လိုအပ်ပါတယ်။ Custom `VITE_*` variables တွေ၊ Vite custom modes တွေ၊ `envPrefix` နဲ့ `envDir` တွေကိုတော့ support မလုပ်ပါဘူး။ `BASE_URL` က Next.js ရဲ့ [`basePath`](/docs/nextjs/next-config-base-path) configuration ကို ထင်ဟပ်ပြီး — Vite ရဲ့ format နဲ့ ကိုက်ညီအောင် trailing slash တစ်ခု ပါဝင်ပါတယ်။

## import.meta.glob

Turbopack က `import.meta.glob()` ကို support လုပ်ပါတယ် — ဒါက glob patterns တွေ သုံးပြီး modules အများအပြားကို တစ်ပြိုင်နက် import လုပ်ဖို့အတွက် Vite-compatible API တစ်ခုပါ။ Result ကတော့ — calling file နဲ့ နှိုင်းယှဉ်ထားတဲ့ (relative) file path တွေကို key အဖြစ် သုံးထားတဲ့ object တစ်ခုပါ။

```js
const modules = import.meta.glob('./dir/*.js')
// {
//   './dir/foo.js': () => import('./dir/foo.js'),
//   './dir/bar.js': () => import('./dir/bar.js'),
// }
```

> **သိထားသင့်သည်:** `import.meta.glob` က Turbopack လိုအပ်ပါတယ်။ Webpack သုံးတဲ့အခါ မရနိုင်ပါဘူး။

### Lazy loading (default)

Default အနေနဲ့ — result object ထဲက value တစ်ခုချင်းစီဟာ thunk (module အတွက် `Promise` တစ်ခုကို return လုပ်တဲ့ function) တစ်ခုပါ။ ဒါက lazy loading ကို ဖြစ်စေပါတယ်:

```js
const modules = import.meta.glob('./dir/*.js')

for (const path in modules) {
  const module = await modules[path]()
  console.log(path, module)
}
```

### Eager loading

Modules အားလုံးကို အစမှာ ချက်ချင်း import လုပ်ဖို့ `{ eager: true }` ကို ပေးပါ။ Value တစ်ခုချင်းစီက thunk အစား — module object ကို တိုက်ရိုက် ဖြစ်ပါတယ်:

```js
const modules = import.meta.glob('./dir/*.js', { eager: true })

for (const path in modules) {
  console.log(path, modules[path].default)
}
```

### Named imports

Module တစ်ခုချင်းစီကနေ သတ်မှတ်ထားတဲ့ named export တစ်ခုကို ရွေးဖို့ `import` option ကို သုံးပါ။ ဒါက lazy ရော eager mode နှစ်ခုလုံးမှာ အလုပ်လုပ်ပါတယ်:

```js
// Lazy: each value is () => Promise<exportValue>
const defaults = import.meta.glob('./dir/*.js', { import: 'default' })

// Eager: each value is the export value directly
const setups = import.meta.glob('./dir/*.js', { import: 'setup', eager: true })
```

### Query strings

`query` option ကို သုံးပြီး import request တိုင်းမှာ query string တစ်ခု ထပ်ထည့်နိုင်ပါတယ်။ Files တွေကို raw strings (သို့) URLs အနေနဲ့ load လုပ်ဖို့ အသုံးဝင်ပါတယ်:

```js
const rawFiles = import.meta.glob('./dir/*.txt', { query: '?raw' })
const urls = import.meta.glob('./dir/*.png', { query: '?url' })
```

`query` option က object တစ်ခုကိုလည်း လက်ခံပါတယ်။ Keys နဲ့ values တွေကို URL-encode လုပ်ပြီး query string တစ်ခုအဖြစ် ပေါင်းစပ်လိုက်ပါတယ်:

```js
const modules = import.meta.glob('./*.ts', {
  query: { bar: 'foo', raw: true },
})
// equivalent to: { query: '?bar=foo&raw=true' }
```

### Patterns အများအပြားနဲ့ Negation (ဖယ်ထုတ်ခြင်း)

ပထမ argument အနေနဲ့ glob patterns တစ်ခုရဲ့ array ကို ပေးပါ။ ကိုက်ညီတဲ့ files တွေကို ဖယ်ထုတ်ဖို့ pattern တစ်ခုရဲ့ ရှေ့မှာ `!` ကို ထည့်ပါ:

```js
// Directories အများအပြားကို ပေါင်းစပ်ရန်
const modules = import.meta.glob(['./dir/*.js', './other/*.js'])

// သတ်မှတ်ထားသော files များကို ဖယ်ထုတ်ရန်
const withoutTests = import.meta.glob(['./src/**/*.js', '!**/*.test.js'])
```

### TypeScript

`import.meta.glob` အတွက် TypeScript types တွေက Next.js ထဲမှာ ပါဝင်ပါတယ်။ သင့် `tsconfig.json` ထဲမှာ `"moduleResolution": "bundler"` (သို့) `"node16"` / `"nodenext"` သတ်မှတ်ထားရင် — အလိုအလျောက် ရနိုင်ပါတယ်။ ဒါက Next.js project အသစ်တွေအတွက် default ဖြစ်ပါတယ်။

Return type က `eager` option ပေါ် မူတည်ပြီး ကွဲပြားပါတယ်:

```ts
// Lazy (default) — Record<string, () => Promise<unknown>>
const lazy = import.meta.glob('./dir/*.ts')

// Eager — Record<string, unknown>
const eager = import.meta.glob('./dir/*.ts', { eager: true })
```

### Options ကိုးကားချက် (Options reference)

| Option          | Type                                          | Default     | Description                                                                |
| --------------- | --------------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| `eager`         | `boolean`                                     | `false`     | Thunks တွေ return လုပ်မယ့်အစား — modules တွေကို synchronously import လုပ်ပါတယ်။                  |
| `import`        | `string`                                      | `undefined` | Module တစ်ခုချင်းစီကနေ ရွေးထုတ်မယ့် named export (ဥပမာ — `'default'`)။        |
| `query`         | `string \| Record<string, string \| boolean>` | `undefined` | Import တစ်ခုချင်းစီဆီ ထပ်ထည့်မယ့် query string (သို့) object။                         |
| `base`          | `string`                                      | `undefined` | Patterns တွေကို resolve လုပ်တာနဲ့ results တွေကို key လုပ်တာမှာ သုံးတဲ့ base path ကို override လုပ်ပါတယ်။     |
| `caseSensitive` | `boolean`                                     | `true`      | Glob patterns တွေကို case-sensitive အနေနဲ့ ကိုက်ညီစေပါတယ်။ ASCII case ကို လျစ်လျူရှုဖို့ `false` သတ်မှတ်ပါ။ |

> **မှတ်ချက်:** `as` option (Vite 5 မှာ deprecated ဖြစ်ခဲ့တဲ့) ကိုတော့ support မလုပ်ပါဘူး။ အဲဒီအစား `query: '?raw'` (သို့) `query: '?url'` ကို သုံးပါ။ Legacy `import.meta.globEager()` API ကိုလည်း support မလုပ်ပါဘူး — `import.meta.glob('...', { eager: true })` ကို သုံးပါ။

## Webpack နဲ့ ကွာဟချက်များ (Known gaps with webpack)

Application တစ်ခုကို migrate လုပ်တဲ့အခါ သတိထားသင့်တဲ့ — webpack နဲ့ Turbopack အကြားမှာ သိသာထင်ရှားတဲ့ (non-trivial) behavior ကွာခြားချက်တွေ အများအပြား ရှိပါတယ်။ ယေဘုယျအားဖြင့် — ဒါတွေက application အသစ်တွေအတွက်တော့ စိုးရိမ်စရာ သိပ်မဟုတ်ပါဘူး။

### Filesystem Root

Turbopack က modules တွေကို resolve လုပ်ဖို့ root directory ကို သုံးပါတယ်။ Project root ရဲ့ အပြင်ဘက်က files တွေကိုတော့ resolve လုပ်မပေးပါဘူး။

ဥပမာ — project root ရဲ့ အပြင်ဘက်မှာ ရှိတဲ့ dependencies တွေကို link လုပ်တဲ့အခါ (`npm link`, `yarn link`, `pnpm link` စတာတွေကနေတစ်ဆင့်) — အဲဒီ linked files တွေကို default အနေနဲ့ resolve လုပ်မပေးပါဘူး။ ဒီ files တွေကို resolve လုပ်ဖို့ — project ရော linked dependencies နှစ်ခုလုံးရဲ့ parent directory ကို root option အဖြစ် configure လုပ်ရပါမယ်။

`next.config.js` ထဲက [turbopack.root](/docs/nextjs/next-config-turbopack) option ကို သုံးပြီး filesystem root ကို configure လုပ်နိုင်ပါတယ်။

### CSS Module အစီအစဉ် (Ordering)

Turbopack က — ကျန်တဲ့နည်းနဲ့ စီစဉ်မထားတဲ့ [CSS modules](/docs/nextjs/css#css-modules) တွေကို JS import order အတိုင်း လိုက်ပြီး စီစဉ်ပေးပါတယ်။ ဥပမာ:

```jsx filename="components/BlogPost.jsx"
import utilStyles from './utils.module.css'
import buttonStyles from './button.module.css'
export default function BlogPost() {
  return (
    <div className={utilStyles.container}>
      <button className={buttonStyles.primary}>Click me</button>
    </div>
  )
}
```

ဒီဥပမာမှာ — Turbopack က import order အတိုင်း လိုက်ပြီး — ထွက်လာတဲ့ CSS chunk ထဲမှာ `utils.module.css` က `button.module.css` ရဲ့ ရှေ့မှာ ပေါ်လာစေဖို့ သေချာ လုပ်ပေးပါတယ်။

Webpack ကလည်း ယေဘုယျအားဖြင့် ဒီလိုပဲ လုပ်ပေးပေမယ့် — ဥပမာ JS file က side-effect-free လို့ ဆုံးဖြတ်မိတဲ့အခါမျိုးမှာ — JS ကနေ ကောက်ချက်ချလို့ရတဲ့ ordering ကို လျစ်လျူရှုတဲ့ အခြေအနေတွေ ရှိပါတယ်။

Applications တွေက မတိကျတဲ့ ordering တစ်ခုကို မှီခိုနေတယ်ဆိုရင် — Turbopack ကို ပြောင်းသုံးတဲ့အခါ သိမ်မွေ့တဲ့ rendering အပြောင်းအလဲတွေ ဖြစ်လာနိုင်ပါတယ်။ ယေဘုယျအားဖြင့် ဖြေရှင်းနည်းက လွယ်ပါတယ် — ဥပမာ ordering ကို အတင်းအကျပ် သတ်မှတ်ဖို့ `button.module.css` ထဲမှာ `@import utils.module.css` လုပ်တာ (သို့) ပဋိပက္ခဖြစ်နေတဲ့ rules တွေကို ရှာပြီး — properties တစ်ခုတည်းကို ပစ်မှတ်မထားတော့အောင် ပြောင်းလဲတာမျိုး လုပ်နိုင်ပါတယ်။

### Sass node_modules imports

Turbopack က `node_modules` ထဲက Sass files တွေကို import လုပ်တာကို out of the box support လုပ်ပါတယ်။ Webpack ကတော့ ဒီအတွက် legacy tilde `~` syntax ကို support လုပ်ပေးထားပေမယ့် — အဲဒါကိုတော့ Turbopack က support မလုပ်ပါဘူး။

**မပြောင်းခင် (From)**:

```scss filename="styles/globals.scss"
@import '~bootstrap/dist/css/bootstrap.min.css';
```

**ပြောင်းပြီးနောက် (To)**:

```scss filename="styles/globals.scss"
@import 'bootstrap/dist/css/bootstrap.min.css';
```

Imports တွေကို update မလုပ်နိုင်ဘူးဆိုရင် — `~` syntax ကို တကယ့် path ဆီ map လုပ်ဖို့ `turbopack.resolveAlias` configuration တစ်ခု ထည့်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  turbopack: {
    resolveAlias: {
      '~*': '*',
    },
  },
}
```

### CSS / Sass / SCSS ဒသမကိန်း တိကျမှု (decimal precision)

Turbopack က CSS compile လုပ်ဖို့ [Lightning CSS](https://lightningcss.dev/) ကို သုံးပါတယ်။ Lightning CSS က numeric CSS values တွေအတွက် ဒသမ ၅ လုံး (5 digits) ထိ တိကျမှုကို သုံးပြီး — webpack ကတော့ ဒသမ ၁၀ လုံး သုံးပါတယ်။ ဒါက plain CSS ရော Sass/SCSS output နှစ်ခုလုံးနဲ့ သက်ဆိုင်ပါတယ်။ ဥပမာ — `25/17` လို့ တွက်ရတဲ့ value တစ်ခုက အောက်ပါအတိုင်း ထွက်ပါတယ်:

- **Webpack:** `line-height: 1.4705882353` (ဒသမ ၁၀ လုံး)
- **Turbopack:** `line-height: 1.47059` (ဒသမ ၅ လုံး)

ဒါက webpack ကနေ Turbopack ဆီ migrate လုပ်တဲ့အခါ — အထူးသဖြင့် `line-height`, `letter-spacing` လို properties တွေ (သို့) တိကျမှု မြင့်မားမှု အရေးပါတဲ့ တွက်ချက်ထားတဲ့ (calculated) values တွေမှာ — သိမ်မွေ့တဲ့ rendering ကွာခြားချက်တွေ ဖြစ်စေနိုင်ပါတယ်။

### Webpack plugins

Turbopack က webpack plugins တွေကို support မလုပ်ပါဘူး။ ဒါက integration အတွက် webpack ရဲ့ plugin system ကို မှီခိုနေတဲ့ third-party tools တွေကို သက်ရောက်ပါတယ်။ [Webpack loaders](/docs/nextjs/next-config-turbopack) တွေကိုတော့ support လုပ်ပါတယ်။ Webpack plugins တွေကို မှီခိုနေတယ်ဆိုရင် — Turbopack-compatible အစားထိုးနည်းလမ်းတွေ ရှာရပါမယ် (သို့) ညီမျှတဲ့ လုပ်ဆောင်နိုင်စွမ်း မရမချင်း webpack ကို ဆက်သုံးနေရပါမယ်။

## မပံ့ပိုးရသေးသော နဲ့ စီစဉ်မထားသော feature များ (Unsupported and unplanned features)

Feature တချို့က လက်ရှိ မရေးသားရသေးသလို (သို့) စီစဉ်ထားခြင်း မရှိပါဘူး:

- **Legacy CSS Modules features**
  - Standalone `:local` နဲ့ `:global` pseudo-classes တွေ (function ပုံစံ `:global(...)` ကိုပဲ support လုပ်ပါတယ်)။
  - `@value` rule (CSS variables တွေက အစားထိုးလိုက်ပြီ)။
  - `:import` နဲ့ `:export` ICSS rules တွေ။
  - `.module.css` တစ်ခုထဲမှာ `.css` file တစ်ခုကို compose လုပ်တဲ့ `composes` ။ Webpack မှာဆိုရင် `.css` file ကို CSS Module အဖြစ် သဘောထားပေမယ့် — Turbopack မှာတော့ `.css` file က အမြဲတမ်း global ဖြစ်ပါတယ်။ ဆိုလိုတာက — CSS Module တစ်ခုထဲမှာ `composes` သုံးချင်ရင် `.css` file ကို `.module.css` file အဖြစ် ပြောင်းရပါမယ်။
  - CSS Modules တွေထဲမှာ `.css` file တစ်ခုကို CSS Module အဖြစ် import လုပ်တဲ့ `@import` ။ Webpack မှာဆိုရင် `.css` file ကို CSS Module အဖြစ် သဘောထားပေမယ့် — Turbopack မှာတော့ `.css` file က အမြဲတမ်း global ဖြစ်ပါတယ်။ ဆိုလိုတာက — CSS Module တစ်ခုထဲမှာ `@import` သုံးချင်ရင် `.css` file ကို `.module.css` file အဖြစ် ပြောင်းရပါမယ်။
- **`sassOptions.functions`**
  `sassOptions.functions` ထဲမှာ သတ်မှတ်ထားတဲ့ Custom Sass functions တွေကို support မလုပ်ပါဘူး။ ဒီ feature က — compilation အတွင်း Sass code ကနေ ခေါ်လို့ရတဲ့ JavaScript functions တွေကို သတ်မှတ်ခွင့် ပေးပါတယ်။ Turbopack ရဲ့ Rust-based architecture က — JavaScript ပေါ်မှာ လုံးလုံး run တဲ့ webpack ရဲ့ Node.js-based sass-loader နဲ့ မတူဘဲ — `sassOptions.functions` ကနေတစ်ဆင့် ပို့လိုက်တဲ့ JavaScript functions တွေကို တိုက်ရိုက် execute လုပ်လို့ မရပါဘူး။ Custom Sass functions တွေ သုံးနေတယ်ဆိုရင် — Turbopack အစား webpack ကို သုံးရပါမယ်။
- **`next.config.js` ထဲက `webpack()` configuration**
  Turbopack က webpack ကို အစားထိုးလို့ — `webpack()` configs တွေကို အသိအမှတ် မပြုပါဘူး။ အဲဒီအစား [`turbopack` config](/docs/nextjs/next-config-turbopack) ကို သုံးပါ။
- **Yarn PnP**
  Next.js မှာ Turbopack support အတွက် စီစဉ်ထားခြင်း မရှိပါဘူး။
- **`experimental.urlImports`**
  Turbopack အတွက် စီစဉ်ထားခြင်း မရှိပါဘူး။
- **`experimental.esmExternals`**
  စီစဉ်ထားခြင်း မရှိပါဘူး။ Turbopack က Next.js ထဲက legacy `esmExternals` configuration ကို support မလုပ်ပါဘူး။
- **Next.js Experimental Flags အချို့**
  - `experimental.nextScriptWorkers`
  - `experimental.fallbackNodePolyfills`
    ဒါတွေကို နောင်မှာ implement လုပ်ဖို့ စီစဉ်ထားပါတယ်။

Feature flag တစ်ခုချင်းစီရဲ့ status အပြည့်အစုံနဲ့ အသေးစိတ် ခွဲခြမ်းစိတ်ဖြာမှုအတွက် — [Turbopack API Reference](/docs/nextjs/next-config-turbopack) ကို ကြည့်ပါ။

## Configuration (ပြင်ဆင်သတ်မှတ်ချက်)

Turbopack ကို `next.config.js` (သို့) `next.config.ts` ထဲက `turbopack` key အောက်မှာ configure လုပ်နိုင်ပါတယ်။ Configuration options တွေကတော့:

- **`rules`**
  File transformations တွေအတွက် [webpack loaders](/docs/nextjs/next-config-turbopack) အပိုတွေကို သတ်မှတ်ပါတယ်။
- **`resolveAlias`**
  Manual aliases တွေကို ဖန်တီးပါတယ် (webpack ထဲက `resolve.alias` လိုမျိုး)။
- **`resolveExtensions`**
  Module resolution အတွက် file extensions တွေကို ပြောင်းလဲ (သို့) တိုးချဲ့ပါတယ်။
- **[`ignoreIssue`](/docs/nextjs/next-config-turbopack-ignore-issue)**
  Turbopack ရဲ့ errors နဲ့ warnings အချို့ကို CLI output နဲ့ error overlay ကနေ ဖိနှိပ်ပေးပါတယ်။

ထို့အပြင် — အောက်ပါ experimental options တွေကို `next.config.js` ထဲက `experimental` အောက်မှာ ရနိုင်ပါတယ်:

| Option                                                                                                       | Description                                                                                                                                  | Default (dev) | Default (build)               |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------- |
| [`turbopackFileSystemCacheForDev`](/docs/nextjs/next-config-turbopack-file-system-cache)                      | Dev server အတွက် filesystem cache ကို enable လုပ်ပါတယ်။                                                                                 | `true`        | N/A                           |
| [`turbopackFileSystemCacheForBuild`](/docs/nextjs/next-config-turbopack-file-system-cache)                    | Builds တွေအတွက် filesystem cache ကို enable လုပ်ပါတယ်။                                                                                  | N/A           | `true`<sup>1</sup>            |
| `turbopackMinify`                                                                                             | Minification ကို enable လုပ်ပါတယ်။                                                                                                        | `false`       | `true`                        |
| `turbopackSourceMaps`                                                                                         | Source maps တွေကို enable လုပ်ပါတယ်။                                                                                                      | `true`        | `productionBrowserSourceMaps` |
| `turbopackInputSourceMaps`                                                                                    | Input files တွေကနေ source maps တွေ ထုတ်ယူတာကို enable လုပ်ပါတယ်။                                                                        | `true`        | `true`                        |
| `turbopackModuleFragments`                                                                                    | လက်ရှိ တက်ကြွစွာ ဖွံ့ဖြိုးဆဲ ဖြစ်ပါတယ်။ ဒါက modules တွေကို fragments တွေအဖြစ် ခွဲပြီး — chunks တွေက module တွေရဲ့ သုံးထားတဲ့ fragments တွေကိုပဲ import လုပ်ပါတယ်။ | `false`       | `false`                       |
| `turbopackRemoveUnusedImports`                                                                                | Unused imports တွေကို ဖယ်ရှားတာကို enable လုပ်ပါတယ်။ `turbopackRemoveUnusedExports` လိုအပ်ပါတယ်။                                     | `false`       | `true`                        |
| `turbopackRemoveUnusedExports`                                                                                | Unused exports တွေကို ဖယ်ရှားတာကို enable လုပ်ပါတယ်။                                                                                    | `false`       | `true`                        |
| `turbopackInferModuleSideEffects`                                                                             | Tree shaking ပိုကောင်းအောင် — side-effect-free modules တွေကို ခန့်မှန်းဖို့ local analysis ကို enable လုပ်ပါတယ်။                     | `true`        | `true`                        |
| `turbopackScopeHoisting`                                                                                      | Scope hoisting ကို enable လုပ်ပါတယ်။ Dev mode မှာတော့ အမြဲတမ်း disabled ပါ။                                                         | `false`       | `true`                        |
| `turbopackClientSideNestedAsyncChunking`                                                                      | Client-side assets တွေအတွက် nested async chunking ကို enable လုပ်ပါတယ်။                                                                 | `false`       | `true`                        |
| `turbopackServerSideNestedAsyncChunking`                                                                      | Server-side assets တွေအတွက် nested async chunking ကို enable လုပ်ပါတယ်။                                                                 | `false`       | `false`                       |
| `turbopackImportTypeBytes`                                                                                    | ESM imports တွေအတွက် `with {type: "bytes"}` ကို support လုပ်တာကို enable လုပ်ပါတယ်။                                                   | `false`       | `false`                       |
| `turbopackUseBuiltinBabel`                                                                                    | Babel config file တစ်ခု ရှိနေတဲ့အခါ — automatic Babel loader configuration ကို enable လုပ်ပါတယ်။                                      | `true`        | `true`                        |
| `turbopackUseBuiltinSass`                                                                                     | Automatic Sass loader configuration ကို enable လုပ်ပါတယ်။                                                                                | `true`        | `true`                        |
| `turbopackModuleIds`                                                                                          | Module ID strategy: `'named'` (သို့) `'deterministic'` ။                                                                                    | `'named'`     | `'deterministic'`             |
| [`turbopackLocalPostcssConfig`](/docs/nextjs/next-config-turbopack-local-postcss-config)                      | `postcss.config.js` ကို CSS file ရဲ့ directory ကနေ အရင်ရှာပြီး — မတွေ့ရင် project root ကနေ ရှာပါတယ်။                                | `false`       | `false`                       |
| `turbopackWorkerAssetPrefix`                                                                                  | Web Worker URLs တွေအတွက် (entrypoint + module chunks) — `assetPrefix` ကို ကျော်လွှားတဲ့ custom asset prefix တစ်ခုပါ။ Webpack ရဲ့ `output.workerPublicPath` ကို ထင်ဟပ်ပါတယ်။ | `undefined`   | `undefined`                   |

**Table notes:**

1. Default အနေနဲ့ enable ထားပါတယ်။ Build environment က builds တွေကြားမှာ `.next/cache` directory ကို မထိန်းသိမ်းထားဘူးဆိုရင် — option ကို `false` သတ်မှတ်ပါ။

ဥပမာ — `turbopack` key အောက်မှာ alias တစ်ခုနဲ့ custom file extension တစ်ခုကို configure လုပ်ဖို့:

```js filename="next.config.js"
module.exports = {
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
}
```

ပိုပြီး အသေးစိတ်ကျတဲ့ configuration ဥပမာတွေအတွက် — [Turbopack config documentation](/docs/nextjs/next-config-turbopack) ကို ကြည့်ပါ။

## Performance debugging အတွက် trace files ထုတ်လုပ်ခြင်း

Performance (သို့) memory ပြဿနာတွေ ကြုံရပြီး Next.js team ကို ရောဂါရှာဖွေ ကူညီချင်တယ်ဆိုရင် — သင့် dev command ထဲမှာ `--internal-trace` flag ကို ထည့်ပြီး trace file တစ်ခု ထုတ်လုပ်နိုင်ပါတယ်:

```bash
next dev --internal-trace
```

ဒါက `.next-profiles/trace-turbopack.bin` file တစ်ခုကို ထုတ်ပေးပါလိမ့်မယ်။ ကျွန်တော်တို့ စူးစမ်းလေ့လာနိုင်ဖို့ — [Next.js repo](https://github.com/vercel/next.js) ပေါ်မှာ GitHub issue တစ်ခု ဖန်တီးတဲ့အခါ အဲဒီ file ကို ထည့်သွင်းပေးပါ။

## Summary (အကျဉ်းချုပ်)

Turbopack ဆိုတာ — **Rust-based**, **incremental** bundler တစ်ခုဖြစ်ပြီး — အထူးသဖြင့် application ကြီးတွေအတွက် — local development နဲ့ builds တွေကို မြန်ဆန်စေဖို့ ဒီဇိုင်းထုတ်ထားတာပါ။ Next.js ထဲမှာ integrated ဖြစ်ပြီး — zero-config အနေနဲ့ CSS, React နဲ့ TypeScript support တွေကို ပေးအပ်ပါတယ်။

## Version အပြောင်းအလဲများ (Version Changes)

| Version   | Changes                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| `v16.0.0` | Turbopack က Next.js ရဲ့ default bundler ဖြစ်လာပါတယ်။ Configuration file တစ်ခု တွေ့ရှိတဲ့အခါ Babel အတွက် အလိုအလျောက် support လုပ်ပါတယ်။ |
| `v15.5.0` | `build` အတွက် Turbopack support — beta                                                                                 |
| `v15.3.0` | `build` အတွက် experimental support                                                                                   |
| `v15.0.0` | `dev` အတွက် Turbopack — stable                                                                                         |
