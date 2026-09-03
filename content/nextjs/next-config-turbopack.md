---
title: "turbopack (Turbopack-specific options သတ်မှတ်ချက်များ)"
description: "turbopack option (ယခင် experimental.turbo) — Turbopack ဖြင့် file အမျိုးမျိုးကို transform လုပ်ခြင်းနှင့် modules များ resolve လုပ်ပုံ ပြောင်းလဲရန် သတ်မှတ်ချက်များ; root, rules (webpack loaders), resolveAlias, resolveExtensions, debugIds options များ ပါဝင်"
order: 220
source: "https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack"
status: translated
updated: 2026-09-03
---

`turbopack` option က [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) ကို customize လုပ်ပြီး — file အမျိုးမျိုးကို transform လုပ်တဲ့ပုံနဲ့ modules တွေကို resolve လုပ်တဲ့ပုံတွေကို ပြောင်းလဲနိုင်စေပါတယ်။

> **သိထားသင့်သည် (Good to know):** `turbopack` option ကို အရင်က Next.js 13.0.0 ကနေ 15.2.x အထိ versions တွေမှာ `experimental.turbo` လို့ ခေါ်ခဲ့ပါတယ် — အဲဒီ option က alias အနေနဲ့ အလုပ်လုပ်နေဆဲ ဖြစ်ပေမယ့် — configuration အသစ်တွေမှာတော့ top-level `turbopack` option ကို သုံးသင့်ပါတယ်။
>
> Next.js ရဲ့ ဗားရှင်းအဟောင်း တစ်ခုခု သုံးနေတယ်ဆိုရင် — `npx @next/codemod@latest next-experimental-turbo-to-turbopack .` ကို run လုပ်ပြီး သင့် configuration ကို အလိုအလျောက် migrate လုပ်နိုင်ပါတယ်။

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    // ...
  },
}

export default nextConfig
```

```js filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // ...
  },
}

module.exports = nextConfig
```

> **သိထားသင့်သည် (Good to know):**
>
> - Next.js အတွက် Turbopack က built-in functionality တွေအတွက် loaders (သို့) loader configuration တွေ မလိုအပ်ပါဘူး။ Turbopack မှာ CSS နဲ့ modern JavaScript တွေကို compile လုပ်တဲ့ built-in support ပါလို့ — `@babel/preset-env` သုံးနေတယ်ဆိုရင် `css-loader`, `postcss-loader` (သို့) `babel-loader` တွေ မလိုအပ်တော့ပါဘူး။

## Reference

### Options

`turbopack` configuration အတွက် အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Option              | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `root`              | Application ရဲ့ root directory ကို သတ်မှတ်သည်။ Absolute path ဖြစ်ရမည်။                             |
| `rules`             | Turbopack နဲ့ run လုပ်တဲ့အခါ အသုံးပြုရန် supported webpack loaders များစာရင်း။                          |
| `resolveAlias`      | Aliased imports တွေကို နေရာတွင် load လုပ်ရန် modules များဆီ map လုပ်ခြင်း။                           |
| `resolveExtensions` | Files တွေ import လုပ်တဲ့အခါ resolve လုပ်ရန် extensions များစာရင်း။                                     |
| `debugIds`          | JavaScript bundles နဲ့ source maps တွေထဲမှာ [debug IDs](https://github.com/tc39/ecma426/blob/main/proposals/debug-id.md) ထုတ်လုပ်ခြင်းကို ဖွင့်ခြင်း။ |

### Supported loaders

အောက်ပါ loaders တွေက Turbopack ရဲ့ webpack loader implementation နဲ့ အလုပ်လုပ်ဖို့ စမ်းသပ်ပြီးသား ဖြစ်ပါတယ် — ဒါပေမယ့် ဒီစာရင်းထဲမှာ မပါတဲ့ webpack loaders အများအပြားလည်း အလုပ်လုပ်နိုင်ပါသေးတယ်:

- [`babel-loader`](https://www.npmjs.com/package/babel-loader) [_(Babel configuration file တစ်ခု တွေ့ရင် အလိုအလျောက် configure လုပ်ပေးသည်)_](https://nextjs.org/docs/app/api-reference/turbopack#language-features)
- [`@svgr/webpack`](https://www.npmjs.com/package/@svgr/webpack)
- [`svg-inline-loader`](https://www.npmjs.com/package/svg-inline-loader)
- [`yaml-loader`](https://www.npmjs.com/package/yaml-loader)
- [`string-replace-loader`](https://www.npmjs.com/package/string-replace-loader)
- [`raw-loader`](https://www.npmjs.com/package/raw-loader)
- [`sass-loader`](https://www.npmjs.com/package/sass-loader) [_(အလိုအလျောက် configure လုပ်ပေးသည်)_](https://nextjs.org/docs/app/api-reference/turbopack#css-and-styling)
- [`graphql-tag/loader`](https://www.npmjs.com/package/graphql-tag)

#### Missing Webpack loader features (Webpack loader features ပျောက်ဆုံးမှုများ)

Turbopack က webpack loaders တွေကို execute လုပ်ဖို့ [`loader-runner`](https://github.com/webpack/loader-runner) library ကို သုံးပါတယ် — ဒါက standard loader API အများစုကို ပေးစွမ်းပါတယ်။ ဒါပေမယ့် features အချို့ကိုတော့ ထောက်ပံ့မထားပါဘူး:

**Module loading:**

- [`importModule`](https://webpack.js.org/api/loaders/#thisimportmodule) — ထောက်ပံ့မထားပါ
- [`loadModule`](https://webpack.js.org/api/loaders/#thisloadmodule) — ထောက်ပံ့မထားပါ

**File system and output:**

- [`fs`](https://webpack.js.org/api/loaders/#thisfs) — Partial support: လက်ရှိမှာ `fs.readFile` တစ်ခုတည်းပဲ implement လုပ်ထားပါတယ်။
- [`emitFile`](https://webpack.js.org/api/loaders/#thisemitfile) — ထောက်ပံ့မထားပါ

**Context properties:**

- [`version`](https://webpack.js.org/api/loaders/#thisversion) — ထောက်ပံ့မထားပါ
- [`mode`](https://webpack.js.org/api/loaders/#thismode) — ထောက်ပံ့မထားပါ
- [`target`](https://webpack.js.org/api/loaders/#thistarget) — ထောက်ပံ့မထားပါ

**Utilities:**

- [`utils`](https://webpack.js.org/api/loaders/#thisutils) — ထောက်ပံ့မထားပါ
- [`resolve`](https://webpack.js.org/api/loaders/#thisresolve) — ထောက်ပံ့မထားပါ ([`getResolve`](https://webpack.js.org/api/loaders/#thisgetresolve) ကို သုံးပါ)

ဒီ features တွေထဲက တစ်ခုပေါ်မှာ အလွန်အမင်း မှီခိုနေတဲ့ loader တစ်ခု သင့်မှာ ရှိရင် — issue တစ်ခု တင်ပေးပါ။

## Examples

### Root directory သတ်မှတ်ခြင်း

Turbopack က modules တွေကို resolve လုပ်ဖို့ root directory ကို သုံးပါတယ်။ Project root ရဲ့ အပြင်ဘက်က files တွေကိုတော့ resolve လုပ်မှာ မဟုတ်ပါဘူး။

Project root အပြင်ဘက်က files တွေကို resolve မလုပ်ရတဲ့ အကြောင်းရင်းက — cache validation ပိုကောင်းစေဖို့၊ filesystem watching ရဲ့ overhead လျှော့ချဖို့နဲ့ resolving steps အရေအတွက် လျှော့ချဖို့ ဖြစ်ပါတယ်။

Next.js က သင့် project ရဲ့ root directory ကို အလိုအလျောက် ရှာဖွေတွေ့ရှိပါတယ်။ အောက်ပါ files တွေထဲက တစ်ခုကို ရှာဖွေပြီး လုပ်ဆောင်ပါတယ်:

- `pnpm-lock.yaml`
- `package-lock.json`
- `yarn.lock`
- `bun.lock`
- `bun.lockb`

သင့်မှာ တခြား project structure ရှိနေရင် — ဥပမာ workspaces မသုံးဘူးဆိုရင် — `root` option ကို ကိုယ်တိုင် သတ်မှတ်နိုင်ပါတယ်:

```js filename="next.config.js"
const path = require('path')
module.exports = {
  turbopack: {
    root: path.join(__dirname, '..'),
  },
}
```

`npm link`, `yarn link`, `pnpm link` စတာတွေကတစ်ဆင့် project root အပြင်ဘက်က linked dependencies တွေကနေ files တွေကို resolve လုပ်နိုင်ဖို့ — project ရော linked dependencies တွေရဲ့ပါ parent directory ကို `turbopack.root` မှာ သတ်မှတ်ပေးရပါမယ်။

ဒါက filesystem watching ရဲ့ scope ကို ကျယ်စေပေမယ့် — linked packages တွေနဲ့ တက်ကြွစွာ အလုပ်လုပ်နေချိန် development ကာလအတွင်းမှာပဲ ယေဘုယျအားဖြင့် လိုအပ်ပါတယ်။

### Webpack loaders များ ပြင်ဆင်သတ်မှတ်ခြင်း

Built-in ထက် ပိုတဲ့ loader support လိုအပ်ရင် — webpack loaders အများအပြားက Turbopack နဲ့ အလုပ်လုပ်ပြီးသား ဖြစ်ပါတယ်။ လက်ရှိမှာ ကန့်သတ်ချက်အချို့ ရှိပါတယ်:

- Webpack loader API ရဲ့ core subset တစ်ခုပဲ implement လုပ်ထားပါတယ်။ လက်ရှိမှာ နာမည်ကြီး loaders အချို့အတွက် လုံလောက်တဲ့ လွှမ်းခြုံမှု ရှိပြီး — အနာဂတ်မှာ API support ကို ချဲ့ထွင်သွားပါမယ်။
- JavaScript code တွေ ပြန်ပေးတဲ့ loaders တွေကိုပဲ ထောက်ပံ့ပါတယ်။ Stylesheets (သို့) images လို files တွေကို transform လုပ်တဲ့ loaders တွေကိုတော့ လက်ရှိမှာ ထောက်ပံ့မထားပါဘူး။
- Webpack loaders တွေဆီ ပေးတဲ့ options တွေက plain JavaScript primitives, objects နဲ့ arrays တွေ ဖြစ်ရပါမယ်။ ဥပမာ — `require()` လုပ်ထားတဲ့ plugin modules တွေကို option values အဖြစ် ပေးလို့ မရပါဘူး။

Loaders တွေကို configure လုပ်ဖို့ — သင် install လုပ်ထားတဲ့ loaders တွေရဲ့ နာမည်တွေနဲ့ options တွေကို `next.config.js` ထဲမှာ ထည့်ပြီး — file extensions တွေကို loader စာရင်းတစ်ခုနဲ့ map လုပ်ပါ။ Rules တွေကို order အတိုင်း အကဲဖြတ်ပါတယ်။

`.svg` files တွေကို import လုပ်ပြီး React components တွေအနေနဲ့ render လုပ်နိုင်စေတဲ့ [`@svgr/webpack`](https://www.npmjs.com/package/@svgr/webpack) loader ကို သုံးတဲ့ ဥပမာကို အောက်မှာ ပြထားပါတယ်:

```js filename="next.config.js"
module.exports = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}
```

> **သိထားသင့်သည် (Good to know):** `rules` object ထဲက globs တွေက file name အပေါ် မူတည်ပြီး ကိုက်ညီမှု စစ်ဆေးပါတယ် — glob ထဲမှာ `/` character ပါနေရင်တော့ project-relative file path အပြည့်အစုံပေါ် မူတည်ပြီး ကိုက်ညီမှု စစ်ဆေးပါတယ်။ Windows file paths တွေကို unix-style `/` path separators သုံးဖို့ normalize လုပ်ပါတယ်။
>
> Turbopack က [Rust `globset` library](https://docs.rs/globset/latest/globset/) ရဲ့ ပြုပြင်ထားတဲ့ version တစ်ခုကို သုံးပါတယ်။

Configuration options လိုအပ်တဲ့ loaders တွေအတွက် — string အစား object format တစ်ခုကို သုံးနိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
}
```

> **သိထားသင့်သည် (Good to know):** Next.js 13.4.4 မတိုင်ခင် — `turbopack.rules` ကို `turbo.loaders` လို့ ခေါ်ပြီး `*.mdx` အစား `.mdx` လို file extensions တွေကိုပဲ လက်ခံခဲ့ပါတယ်။

### Advanced webpack loader conditions

ပိုတိကျတဲ့ `condition` syntax ကို သုံးပြီး loader တစ်ခု ဘယ်မှာ run လုပ်မလဲ ဆိုတာကို ထပ်ပြီး ကန့်သတ်နိုင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  turbopack: {
    rules: {
      // '*' က file paths အားလုံးနဲ့ ကိုက်ညီပေမယ့် condition တစ်ခုနဲ့
      // ကျွန်ုပ်တို့ရဲ့ rule run မယ့်နေရာကို ကန့်သတ်ထားပါတယ်
      '*': {
        condition: {
          all: [
            // 'foreign' က built-in condition တစ်ခုပါ
            { not: 'foreign' },
            // 'path' က RegExp (သို့) glob string ဖြစ်နိုင်ပါတယ်။ RegExp က
            // project-relative file path အပြည့်အစုံထဲက ဘယ်နေရာမှာမဆို ကိုက်ညီပါတယ်
            { path: /^img\/[0-9]{3}\// },
            {
              any: [
                { path: '*.svg' },
                // 'query' က query string အပြည့်အစုံထဲက ဘယ်နေရာမှာမဆို ကိုက်ညီပြီး
                // အဲဒါက ဗလာ ဖြစ်နိုင်သလို `?` နဲ့ စတင်နိုင်ပါတယ်
                { query: /[?&]svgr(?=&|$)/ },
                // 'content' ကတော့ အမြဲတမ်း RegExp ဖြစ်ပြီး file ထဲက
                // ဘယ်နေရာမှာမဆို ကိုက်ညီနိုင်ပါတယ်
                { content: /\<svg\W/ },
              ],
            },
          ],
        },
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}
```

- Supported boolean operators တွေက `{all: [...]}`, `{any: [...]}` နဲ့ `{not: ...}` တို့ ဖြစ်ပါတယ်။
- Supported customizable operators တွေက `{path: string | RegExp}`, `{content: RegExp}`, `{query: string | RegExp}` နဲ့ `{contentType: string | RegExp}` တို့ ဖြစ်ပါတယ်။ Object တစ်ခုတည်းထဲမှာ operators အများအပြား သတ်မှတ်ထားရင် implicit `and` အနေနဲ့ သက်ရောက်ပါတယ်။
  - `path` က project-relative file path နဲ့ ကိုက်ညီမှု စစ်ဆေးပါတယ်။ String ကို glob pattern အဖြစ် သဘောထားပြီး — RegExp ကတော့ path ကို တစ်စိတ်တစ်ပိုင်း ကိုက်ညီဖို့ သုံးနိုင်ပါတယ်။
  - `content` က file content ထဲက ဘယ်နေရာမှာမဆို ကိုက်ညီမှု စစ်ဆေးပါတယ်။
  - `query` က import ရဲ့ query string နဲ့ ကိုက်ညီမှု စစ်ဆေးပါတယ် (ဥပမာ `import './file?foo'` ထဲက `?foo`)။ String က တိကျစွာ ကိုက်ညီရမှာ ဖြစ်ပြီး — RegExp ကတော့ query string ကို တစ်စိတ်တစ်ပိုင်း ကိုက်ညီဖို့ သုံးနိုင်ပါတယ်။
  - `contentType` က resource ရဲ့ MIME content type နဲ့ ကိုက်ညီမှု စစ်ဆေးပါတယ် (ဥပမာ `data:text/plain,...` လို data URLs တွေကနေ)။ String ကို glob pattern အဖြစ် သဘောထားပြီး (ဥပမာ `text/*`, `image/*`) — RegExp ကတော့ content type ကို တစ်စိတ်တစ်ပိုင်း ကိုက်ညီဖို့ သုံးနိုင်ပါတယ်။

ဒါ့အပြင် built-in conditions အများအပြားကိုလည်း ထောက်ပံ့ပါတယ်:

- `browser`: Client ပေါ်မှာ execute ဖြစ်မယ့် code တွေနဲ့ ကိုက်ညီပါတယ်။ Server code တွေကို `{not: 'browser'}` သုံးပြီး ကိုက်ညီစေနိုင်ပါတယ်။
- `foreign`: `node_modules` ထဲက code တွေနဲ့ Next.js internals အချို့နဲ့ ကိုက်ညီပါတယ်။ ပုံမှန်အားဖြင့် loaders တွေကို `{not: 'foreign'}` နဲ့ ကန့်သတ်ချင်ပါလိမ့်မယ် — ဒါက loader ကို invoke လုပ်ရတဲ့ files အရေအတွက် လျှော့ချပေးလို့ performance တိုးတက်စေနိုင်ပါတယ်။
- `development`: `next dev` သုံးတဲ့အခါ ကိုက်ညီပါတယ်။
- `production`: `next build` သုံးတဲ့အခါ ကိုက်ညီပါတယ်။
- `node`: Default Node.js runtime ပေါ်မှာ run မယ့် code တွေနဲ့ ကိုက်ညီပါတယ်။
- `edge-light`: [Edge runtime](https://nextjs.org/docs/app/api-reference/edge) ပေါ်မှာ run မယ့် code တွေနဲ့ ကိုက်ညီပါတယ် (deprecated)။

Rules တွေက object တစ်ခု (သို့) objects တွေရဲ့ array တစ်ခု ဖြစ်နိုင်ပါတယ်။ Array တစ်ခုက သီးခြားဖြစ်တဲ့ (disjoint) conditions တွေကို ပုံစံထုတ်ဖို့ မကြာခဏ အသုံးဝင်ပါတယ်:

```js filename="next.config.js"
module.exports = {
  turbopack: {
    rules: {
      '*.svg': [
        {
          condition: 'browser',
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
        {
          condition: { not: 'browser' },
          loaders: [require.resolve('./custom-svg-loader.js')],
          as: '*.js',
        },
      ],
    },
  },
}
```

> **သိထားသင့်သည် (Good to know):** ကိုက်ညီတဲ့ rules တွေ အားလုံးကို order အတိုင်း execute လုပ်ပါတယ်။

### Module types (Module အမျိုးအစားများ)

Loader မသုံးဘဲ module type ကို တိုက်ရိုက် သတ်မှတ်နိုင်ပါတယ်။ ဒါက files တွေကို process လုပ်တဲ့ပုံ ပြောင်းလဲဖို့ အသုံးဝင်ပြီး — webpack ရဲ့ [`type`](https://webpack.js.org/configuration/module/#ruletype) option နဲ့ ဆင်တူပါတယ်။

```js filename="next.config.js"
module.exports = {
  turbopack: {
    rules: {
      '*.svg': {
        type: 'asset',
      },
    },
  },
}
```

`type: 'asset'` သုံးထားရင် — file ကို import လုပ်တာက သူ့ရဲ့ URL ကို ပြန်ပေးပါတယ်:

```tsx filename="app/page.tsx"
import svgUrl from './icon.svg'

export default function Page() {
  return <img src={svgUrl} alt="Icon" />
}
```

`type` option ကို `loaders` နဲ့ တွဲသုံးလို့ရပါတယ် — loaders တွေ အရင်ဆုံး run ပြီး — ရလဒ်ကို သတ်မှတ်ထားတဲ့ type အလိုက် process လုပ်ပါတယ်။

ရနိုင်တဲ့ module types တွေ:

| Type         | Description                                              |
| ------------ | -------------------------------------------------------- |
| `asset`      | File ကို emit လုပ်ပြီး URL ပြန်ပေးသည် (webpack `asset/resource` လိုမျိုး) |
| `ecmascript` | JavaScript အဖြစ် process လုပ်သည်                       |
| `typescript` | TypeScript အဖြစ် process လုပ်သည်                      |
| `css`        | CSS အဖြစ် process လုပ်သည်                              |
| `css-module` | CSS module အဖြစ် process လုပ်သည်                       |
| `wasm`       | WebAssembly အဖြစ် process လုပ်သည်                      |
| `raw`        | Raw contents များကို string အဖြစ် ပြန်ပေးသည်           |
| `bytes`      | Contents များကို bytes အဖြစ် inline လုပ်သည်            |

### Import attributes ဖြင့် inline loader configuration

`with` clause (import attributes) ကို သုံးပြီး import တစ်ခုချင်းစီအတွက် Turbopack loader တစ်ခုကို အသုံးပြုနိုင်ပါတယ်။ ဒါက `turbopack.rules` ကတစ်ဆင့် global အနေနဲ့ သတ်မှတ်တာ မဟုတ်ဘဲ — import တစ်ခုချင်းစီအလိုက် သတ်မှတ်တာ ဖြစ်ပါတယ်။

ဒါက အဲဒီအမျိုးအစားရဲ့ file အားလုံးကို မထိခိုက်စေဘဲ — import တစ်ခုတည်းကိုပဲ loader တစ်ခု သုံးချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

```tsx filename="app/page.tsx"
// .txt file တစ်ခုကို JavaScript module အဖြစ် import လုပ်ဖို့ raw loader တစ်ခု အသုံးပြုပါ
import rawText from '../data.txt' with { turbopackLoader: 'raw-loader', turbopackAs: '*.js' }

export default function Page() {
  return <p>{rawText}</p>
}
```

အောက်ပါ import attributes တွေကို ထောက်ပံ့ပါတယ်:

| Attribute                | Description                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `turbopackLoader`        | အသုံးပြုရမယ့် loader (ဥပမာ `'raw-loader'`)။                                                                                      |
| `turbopackLoaderOptions` | Loader options တွေရဲ့ JSON string (ဥပမာ `'{"search":"X","replace":"Y"}'`)။                                                       |
| `turbopackAs`            | Output အတွက် rename pattern (`turbopack.rules[].as` နဲ့ အတူတူ)။ ဥပမာ — `'*.js'` က loader output ကို JavaScript အဖြစ် သဘောထားစေပါတယ်။ |
| `turbopackModuleType`    | Output အတွက် module type သတ်မှတ်ခြင်း (`turbopack.rules[].type` နဲ့ အတူတူ)။                                                   |

Options ပါတဲ့ loaders တွေက `turbopackLoaderOptions` ကတစ်ဆင့် JSON-encoded string တစ်ခု ပို့ပေးပါတယ်:

```tsx filename="app/page.tsx"
import value from '../data.js' with { turbopackLoader: 'string-replace-loader', turbopackLoaderOptions: '{"search":"PLACEHOLDER","replace":"replaced value"}' }
```

> **သိထားသင့်သည် (Good to know):** `turbopackLoader` ပါတဲ့ import attributes တွေက Turbopack-specific ဖြစ်ပြီး — webpack က ထောက်ပံ့မထားပါဘူး။ ဒီ feature က သင့် import statements တွေထဲမှာ `with` keyword (တစ်နည်း — `assert` မဟုတ်) လိုအပ်ပါတယ်။

### Aliases resolve လုပ်ခြင်း (Resolving aliases)

Turbopack ကို webpack ရဲ့ [`resolve.alias`](https://webpack.js.org/configuration/resolve/#resolvealias) configuration နဲ့ ဆင်တူတဲ့ aliases တွေကတစ်ဆင့် module resolution ပြုပြင်မွမ်းမံဖို့ configure လုပ်နိုင်ပါတယ်။

Resolve aliases တွေကို configure လုပ်ဖို့ — imported patterns တွေကို သူတို့ရဲ့ နေရာအသစ်ဆီ map လုပ်ပြီး `next.config.js` ထဲမှာ သတ်မှတ်ပါ:

```js filename="next.config.js"
module.exports = {
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
      mocha: { browser: 'mocha/browser-entry.js' },
    },
  },
}
```

ဒါက `underscore` package ရဲ့ imports တွေကို `lodash` package ဆီ alias လုပ်ပေးပါတယ်။ တစ်နည်းပြောရရင် — `import underscore from 'underscore'` က `underscore` အစား `lodash` module ကို load လုပ်ပါလိမ့်မယ်။

Turbopack က ဒီ field ကတစ်ဆင့် conditional aliasing ကိုလည်း ထောက်ပံ့ပါတယ် — Node.js ရဲ့ [conditional exports](https://nodejs.org/docs/latest-v18.x/api/packages.html#conditional-exports) နဲ့ ဆင်တူပါတယ်။ လက်ရှိမှာ `browser` condition တစ်ခုတည်းကိုပဲ ထောက်ပံ့ပါတယ်။ အပေါ်က ဥပမာမှာ — Turbopack က browser environments တွေကို ပစ်မှတ်ထားတဲ့အခါ `mocha` module ရဲ့ imports တွေကို `mocha/browser-entry.js` ဆီ alias လုပ်ပါလိမ့်မယ်။

### Custom extensions resolve လုပ်ခြင်း (Resolving custom extensions)

Turbopack ကို webpack ရဲ့ [`resolve.extensions`](https://webpack.js.org/configuration/resolve/#resolveextensions) configuration နဲ့ ဆင်တူတဲ့ — custom extensions ပါတဲ့ modules တွေ resolve လုပ်ဖို့ configure လုပ်နိုင်ပါတယ်။

Resolve extensions တွေကို configure လုပ်ဖို့ — `next.config.js` ထဲမှာ `resolveExtensions` field ကို သုံးပါ:

```js filename="next.config.js"
module.exports = {
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
}
```

ဒါက original resolve extensions တွေကို ပေးထားတဲ့ list နဲ့ အစားထိုး (overwrite) လိုက်ပါတယ်။ Default extensions တွေ ပါဝင်ဖို့ သေချာစေပါ။

Webpack ကနေ Turbopack ဆီ သင့် app ကို ဘယ်လို migrate လုပ်ရမလဲ ဆိုတဲ့ အချက်အလက်နဲ့ လမ်းညွှန်တွေအတွက် — [Turbopack ရဲ့ webpack compatibility documentation](https://turbo.build/pack/docs/migrating-from-webpack) ကို ကြည့်ပါ။

### Debug IDs

Turbopack ကို JavaScript bundles နဲ့ source maps တွေထဲမှာ [debug IDs](https://github.com/tc39/ecma426/blob/main/proposals/debug-id.md) တွေ generate လုပ်ဖို့ configure လုပ်နိုင်ပါတယ်။

Debug IDs တွေကို configure လုပ်ဖို့ — `next.config.js` ထဲမှာ `debugIds` field ကို သုံးပါ:

```js filename="next.config.js"
module.exports = {
  turbopack: {
    debugIds: true,
  },
}
```

ဒီ option က compatibility သေချာစေဖို့ debug IDs အတွက် polyfill တစ်ခုကို JavaScript bundle ထဲကို အလိုအလျောက် ထည့်ပေးပါတယ်။ Debug IDs တွေကို `globalThis._debugIds` global variable ထဲမှာ ရနိုင်ပါတယ်။

## Version History

| Version  | အပြောင်းအလဲ                                          |
| -------- | ------------------------------------------------------ |
| `16.2.0` | `turbopackLoader` import attributes တွေ ထပ်ဖြည့်ခဲ့။ |
| `16.2.0` | `turbopack.rules.*.type` ထပ်ဖြည့်ခဲ့။                 |
| `16.2.0` | `turbopack.rules.*.condition.contentType` ထပ်ဖြည့်ခဲ့။ |
| `16.2.0` | `turbopack.rules.*.condition.query` ထပ်ဖြည့်ခဲ့။      |
| `16.0.0` | `turbopack.debugIds` ထပ်ဖြည့်ခဲ့။                     |
| `16.0.0` | `turbopack.rules.*.condition` ထပ်ဖြည့်ခဲ့။            |
| `15.3.0` | `experimental.turbo` ကို `turbopack` အဖြစ် ပြောင်းလဲခဲ့။ |
| `13.0.0` | `experimental.turbo` စတင် မိတ်ဆက်ခဲ့။                  |
