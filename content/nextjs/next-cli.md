---
title: "next CLI"
description: "next CLI — development, build, start, lint, typegen, upgrade စတဲ့ command တွေ; next dev/build/start/info/telemetry/typegen/upgrade/experimental-analyze တို့ရဲ့ options အားလုံးနဲ့ ဥပမာများ"
order: 79
source: "https://nextjs.org/docs/app/api-reference/cli/next"
status: translated
updated: 2026-09-02
---

Next.js CLI က သင့် application ကို develop, build, start လုပ်တာနဲ့ အခြားအရာတွေ လုပ်နိုင်စေပါတယ်။

အခြေခံ အသုံးပြုပုံ:

```bash package="pnpm"
pnpm next [command] [options]
```

```bash package="npm"
npx next [command] [options]
```

```bash package="yarn"
yarn next [command] [options]
```

```bash package="bun"
bunx next [command] [options]
```

> **သိထားသင့်သည်:** `npm run` သုံးတဲ့အခါ — npm က flags တွေကို `next` ဆီ ပို့ပေးနိုင်ဖို့ CLI flags တွေရဲ့ ရှေ့မှာ `--` ထည့်ပါ။ `pnpm`, `yarn`, (သို့) `bun` တွေအတွက်တော့ ဒါ မလိုအပ်ပါဘူး။

## Reference

အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Options             | Description                        |
| ------------------- | ---------------------------------- |
| `-h` or `--help`    | ရနိုင်တဲ့ options အားလုံးကို ပြသသည်        |
| `-v` or `--version` | Next.js version နံပါတ်ကို ပြသသည် |

### Commands

အောက်ပါ commands တွေ ရနိုင်ပါတယ်:

| Command                                                      | Description                                                                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| [`dev`](#next-dev-options)                                   | Hot Module Reloading, error reporting စတာတွေနဲ့ development mode မှာ Next.js ကို စတင်သည်။                      |
| [`build`](#next-build-options)                               | သင့် application ရဲ့ optimized production build တစ်ခု ဖန်တီးသည်။ Route တစ်ခုချင်းစီအကြောင်း အချက်အလက် ပြသသည်။           |
| [`start`](#next-start-options)                               | Production mode မှာ Next.js ကို စတင်သည်။ Application ကို အရင် `next build` နဲ့ compile လုပ်ထားရပါမယ်။                |
| [`info`](#next-info-options)                                 | Next.js bugs တွေ report လုပ်ဖို့ သုံးနိုင်တဲ့ လက်ရှိ system အကြောင်း သက်ဆိုင်ရာ အချက်အလက်တွေကို ပြသသည်။                    |
| [`telemetry`](#next-telemetry-options)                       | Next.js ရဲ့ လုံးဝ anonymous ဖြစ်တဲ့ telemetry collection ကို enable/disable လုပ်ခွင့်ပေးသည်။                           |
| [`typegen`](#next-typegen-options)                           | Build အပြည့်အစုံ မလုပ်ဘဲ — routes, pages, layouts နဲ့ route handlers တွေအတွက် TypeScript definitions တွေကို generate လုပ်သည်။ |
| [`upgrade`](#next-upgrade-options)                           | သင့် Next.js application ကို နောက်ဆုံး version ဆီ upgrade လုပ်သည်။                                                      |
| [`experimental-analyze`](#next-experimental-analyze-options) | Turbopack သုံးပြီး bundle output ကို ခွဲခြမ်းစိတ်ဖြာသည်။ Build artifacts တွေကို မထုတ်လုပ်ပါဘူး။                                     |

> **သိထားသင့်သည်:** Command မပါဘဲ `next` ကို run ရင် — `next dev` ရဲ့ alias ဖြစ်ပါတယ်။

### `next dev` options

`next dev` က Hot Module Reloading (HMR), error reporting စတာတွေနဲ့ — development mode မှာ application ကို စတင်ပေးပါတယ်။

> **သိထားသင့်သည်:** Development builds တွေက `.next` အစား `.next/dev` ဆီ output ထုတ်ပါတယ်။ ဒါကြောင့် `next dev` နဲ့ `next build` တွေကို conflict မဖြစ်ဘဲ တစ်ပြိုင်နက် run နိုင်ပါတယ်။

`next dev` run လုပ်တဲ့အခါ အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Option                                   | Description                                                                                                                                          |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-h, --help`                             | ရနိုင်တဲ့ options အားလုံးကို ပြသသည်။                                                                                                                          |
| `[directory]`                            | Application ကို build လုပ်ရမယ့် directory။ မပေးရင် — လက်ရှိ directory ကို သုံးမယ်။                                                           |
| `--turbopack`                            | [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) ကို force enable လုပ်သည် (default ဖွင့်ထား)။ `--turbo` အဖြစ်လည်း ရနိုင်သည်။                                       |
| `--webpack`                              | Development အတွက် default [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) bundler အစား Webpack ကို သုံးသည်။                                           |
| `-p` or `--port <port>`                  | Application စတင်ရမယ့် port နံပါတ်ကို သတ်မှတ်သည်။ Default: 3000, env: PORT                                                                    |
| `-H`or `--hostname <hostname>`           | Application စတင်ရမယ့် hostname ကို သတ်မှတ်သည်။ Network ထဲက တခြား devices တွေအတွက် application ရနိုင်အောင် အသုံးဝင်သည်။ Default: 0.0.0.0 |
| `--experimental-https`                   | Server ကို HTTPS နဲ့ စတင်ပြီး self-signed certificate တစ်ခု generate လုပ်သည်။                                                                                |
| `--experimental-https-key <path>`        | HTTPS key file ဆီ path တစ်ခု။                                                                                                                            |
| `--experimental-https-cert <path>`       | HTTPS certificate file ဆီ path တစ်ခု။                                                                                                                    |
| `--experimental-https-ca <path>`         | HTTPS certificate authority file ဆီ path တစ်ခု။                                                                                                          |
| `--experimental-upload-trace <traceUrl>` | Debugging trace ရဲ့ အစိတ်အပိုင်းတစ်ချို့ကို remote HTTP URL တစ်ခုဆီ report လုပ်သည်။                                                                                        |
| `--experimental-cpu-prof`                | V8 ရဲ့ inspector သုံးပြီး CPU profiling ကို ဖွင့်သည်။ Profiles တွေက exit လုပ်ချိန်မှာ `.next-profiles/` ဆီ သိမ်းသည်။                                                         |

### `next build` options

`next build` က သင့် application ရဲ့ optimized production build တစ်ခု ဖန်တီးပေးပါတယ်။ Output ထဲမှာ route တစ်ခုချင်းစီအကြောင်း အချက်အလက် ပြသပါတယ်။ ဥပမာ:

```bash filename="Terminal"
Route (app)
┌ ○ /_not-found
└ ƒ /products/[id]

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

Output ကို ဘယ်လို ဖတ်ရမလဲ၊ dynamic routes တွေကို ဘယ်လို prerender လုပ်ရမလဲ၊ build errors တွေကို ဘယ်လို debug လုပ်ရမလဲ ဆိုတာ သိဖို့ — [Building guide](https://nextjs.org/docs/app/guides/building) ကို ကြည့်ပါ။

`next build` command အတွက် အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Option                             | Description                                                                                                                                   |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `-h, --help`                       | ရနိုင်တဲ့ options အားလုံးကို ပြသသည်။                                                                                                                   |
| `[directory]`                      | Application ကို build လုပ်ရမယ့် directory။ မပေးရင် — လက်ရှိ directory ကို သုံးမယ်။                                           |
| `--turbopack`                      | [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) ကို force enable လုပ်သည် (default ဖွင့်ထား)။ `--turbo` အဖြစ်လည်း ရနိုင်သည်။                                |
| `--webpack`                        | Webpack သုံးပြီး build လုပ်သည်။                                                                                                                          |
| `-d` or `--debug`                  | ပိုပြီး အသေးစိတ်ကျတဲ့ build output ကို ဖွင့်သည်။ ဒီ flag ဖွင့်ထားရင် rewrites, redirects, headers လိုမျိုး နောက်ထပ် build output တွေပါ ပြမယ်။      |
| `--profile`                        | Production [React profiling](https://react.dev/reference/react/Profiler) ကို ဖွင့်သည်။                                                         |
| `--no-mangling`                    | [Mangling](https://en.wikipedia.org/wiki/Name_mangling) ကို ပိတ်သည်။ Performance ကို ထိခိုက်နိုင်လို့ debugging အတွက်ပဲ သုံးသင့်သည်။ |
| `--experimental-app-only`          | App Router routes တွေကိုပဲ build လုပ်သည်။                                                                                                                |
| `--experimental-build-mode [mode]` | Experimental build mode တစ်ခုကို သုံးသည်။ (choices: "compile", "generate", default: "default")                                                         |
| `--debug-prerender`                | Development မှာ prerender errors တွေကို debug လုပ်သည်။                                                                                                        |
| `--debug-build-paths=<patterns>`   | Debugging အတွက် specific routes တွေကိုပဲ build လုပ်သည်။                                                                                                     |
| `--experimental-cpu-prof`          | V8 ရဲ့ inspector သုံးပြီး CPU profiling ကို ဖွင့်သည်။ Profiles တွေက exit လုပ်ချိန်မှာ `.next-profiles/` ဆီ သိမ်းသည်။                                                  |
### `next start` options

`next start` က production mode မှာ application ကို စတင်ပေးပါတယ်။ Application ကို အရင် [`next build`](#next-build-options) နဲ့ compile လုပ်ထားရပါမယ်။

`next start` command အတွက် အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Option                                  | Description                                                                                                     |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `-h` or `--help`                        | ရနိုင်တဲ့ options အားလုံးကို ပြသသည်။                                                                                     |
| `[directory]`                           | Application ကို စတင်ရမယ့် directory။ directory မပေးရင် — လက်ရှိ directory ကို သုံးမယ်။ |
| `-p` or `--port <port>`                 | Application စတင်ရမယ့် port နံပါတ်ကို သတ်မှတ်သည်။ (default: 3000, env: PORT)                             |
| `-H` or `--hostname <hostname>`         | Application စတင်ရမယ့် hostname ကို သတ်မှတ်သည် (default: 0.0.0.0)。                                        |
| `--keepAliveTimeout <keepAliveTimeout>` | Inactive connections တွေကို မပိတ်ခင် စောင့်ရမယ့် အများဆုံး ကြာချိန် (milliseconds) ကို သတ်မှတ်သည်。                     |
| `--experimental-cpu-prof`               | V8 ရဲ့ inspector သုံးပြီး CPU profiling ကို ဖွင့်သည်။ Profiles တွေက exit လုပ်ချိန်မှာ `.next-profiles/` ဆီ သိမ်းသည်။                    |

### `next info` options

`next info` က [GitHub issue](https://github.com/vercel/next.js/issues) တစ်ခု ဖွင့်တဲ့အခါ Next.js bugs တွေ report လုပ်ဖို့ သုံးနိုင်တဲ့ — လက်ရှိ system အကြောင်း သက်ဆိုင်ရာ အချက်အလက်တွေကို ပြသပါတယ်။ ဒီထဲမှာ Operating System platform/arch/version, Binaries (Node.js, npm, Yarn, pnpm), package versions (`next`, `react`, `react-dom`) စတာတွေ ပါဝင်ပါတယ်။

Output က ဒီလိုပုံ ရှိပါတယ်:

```bash filename="Terminal"
Operating System:
  Platform: darwin
  Arch: arm64
  Version: Darwin Kernel Version 23.6.0
  Available memory (MB): 65536
  Available CPU cores: 10
Binaries:
  Node: 20.12.0
  npm: 10.5.0
  Yarn: 1.22.19
  pnpm: 9.6.0
Relevant Packages:
  next: 15.0.0-canary.115 // Latest available version is detected (15.0.0-canary.115).
  eslint-config-next: 14.2.5
  react: 19.0.0-rc
  react-dom: 19.0.0
  typescript: 5.5.4
Next.js Config:
  output: N/A
```

`next info` command အတွက် အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Option           | Description                                    |
| ---------------- | ---------------------------------------------- |
| `-h` or `--help` | ရနိုင်တဲ့ options အားလုံးကို ပြသသည်                     |
| `--verbose`      | Debugging အတွက် နောက်ထပ် အချက်အလက်တွေ စုဆောင်းသည်。 |

### `next telemetry` options

Next.js က အသုံးပြုမှု အထွေထွေအကြောင်း — **လုံးဝ anonymous** ဖြစ်တဲ့ telemetry data တွေကို စုဆောင်းပါတယ်။ ဒီ anonymous program မှာ ပါဝင်တာက optional ဖြစ်ပြီး — အချက်အလက် မျှဝေချင်မှ မျှဝေဘူးဆိုရင် opt-out လုပ်နိုင်ပါတယ်။

`next telemetry` command အတွက် အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Option       | Description                             |
| ------------ | --------------------------------------- |
| `-h, --help` | ရနိုင်တဲ့ options အားလုံးကို ပြသသည်。             |
| `--enable`   | Next.js ရဲ့ telemetry collection ကို ဖွင့်သည်。  |
| `--disable`  | Next.js ရဲ့ telemetry collection ကို ပိတ်သည်။ |

[Telemetry](/telemetry) အကြောင်း ပိုလေ့လာပါ။

### `next typegen` options

`next typegen` က build အပြည့်အစုံ မလုပ်ဘဲ — သင့် application ရဲ့ routes တွေအတွက် TypeScript definitions တွေကို generate လုပ်ပါတယ်။ IDE autocomplete နဲ့ route အသုံးပြုမှုတွေရဲ့ CI type-checking တွေအတွက် အသုံးဝင်ပါတယ်။

အရင်က route types တွေကို `next dev` (သို့) `next build` လုပ်ချိန်မှာပဲ generate လုပ်တာမို့ — `tsc --noEmit` ကို တိုက်ရိုက် run ရင် သင့် route types တွေကို validate လုပ်မှာ မဟုတ်ပါဘူး။ အခုတော့ types တွေကို သီးခြား generate လုပ်ပြီး externally validate လုပ်နိုင်ပါပြီ:

```bash filename="Terminal"
# Route types တွေကို အရင် generate လုပ်ပြီးမှ TypeScript နဲ့ validate လုပ်ပါ
next typegen && tsc --noEmit

# ဒါမှမဟုတ် build မလုပ်ဘဲ type checking အတွက် CI workflows တွေမှာ
next typegen && npm run type-check
```

`next typegen` command အတွက် အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Option        | Description                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------- |
| `-h, --help`  | ရနိုင်တဲ့ options အားလုံးကို ပြသသည်။                                                                                  |
| `[directory]` | Types တွေကို generate လုပ်ရမယ့် directory။ မပေးရင် — လက်ရှိ directory ကို သုံးမယ်။ |

Output files တွေကို `<distDir>/types` ဆီ ရေးပါတယ် (ပုံမှန်အားဖြင့်: development မှာ `.next/dev/types` (သို့) production မှာ `.next/types`):

```bash filename="Terminal"
next typegen
# ဒါမှမဟုတ် specific app တစ်ခုအတွက်
next typegen ./apps/web
```

ထပ်ပြီး — `next typegen` က `next-env.d.ts` file တစ်ခုကိုပါ generate လုပ်ပါတယ်။ `next-env.d.ts` ကို သင့် `.gitignore` file ထဲ ထည့်ဖို့ အကြံပြုပါတယ်။

`next-env.d.ts` file ကို သင့် project ထဲ Next.js types တွေ ရနိုင်အောင် — သင့် `tsconfig.json` file ထဲမှာ ထည့်သွင်းပေးထားပါတယ်။

Type-checking မလုပ်ခင် `next-env.d.ts` ရှိနေဖို့ သေချာစေချင်ရင် — `next typegen` ကို run ပါ။ `next dev` နဲ့ `next build` commands တွေကလည်း `next-env.d.ts` file ကို generate လုပ်ပါတယ် — ဒါပေမယ့် CI/CD environments တွေလိုနေရာမှာ type-check လုပ်ဖို့ပဲ ဒါတွေကို run ရတာက မကြာခဏ မလိုလားအပ်ပါဘူး။

> **သိထားသင့်သည်:** `next typegen` က သင့် Next.js config (`next.config.js`, `next.config.mjs`, (သို့) `next.config.ts`) ကို production build phase သုံးပြီး load လုပ်ပါတယ်။ Config ကို မှန်ကန်စွာ load လုပ်နိုင်ဖို့ — လိုအပ်တဲ့ environment variables တွေနဲ့ dependencies တွေ ရှိနေဖို့ သေချာပါစေ။

### `next upgrade` options

`next upgrade` က သင့် Next.js application ကို နောက်ဆုံး version ဆီ upgrade လုပ်ပေးပါတယ်။

`next upgrade` command အတွက် အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Option                  | Description                                                                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-h, --help`            | ရနိုင်တဲ့ options အားလုံးကို ပြသသည်။                                                                                                                        |
| `[directory]`           | Upgrade လုပ်ရမယ့် Next.js application ပါတဲ့ directory။ မပေးရင် — လက်ရှိ directory ကို သုံးမယ်。                                          |
| `--revision <revision>` | Upgrade လုပ်မယ့် Next.js version (သို့) tag တစ်ခုကို သတ်မှတ်သည် (ဥပမာ — `latest`, `canary`, `15.0.0`)。 လက်ရှိ install ထားတဲ့ release channel ကို default အနေနဲ့ သုံးသည်။ |
| `--verbose`             | Upgrade လုပ်ငန်းစဉ်အတွင်း verbose output ကို ပြသသည်။                                                                                                    |

### `next experimental-analyze` options

`next experimental-analyze` က [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack) သုံးပြီး သင့် application ရဲ့ bundle output ကို ခွဲခြမ်းစိတ်ဖြာပါတယ်။ ဒီ command က JavaScript, CSS နဲ့ တခြား assets တွေ အပါအဝင် — သင့် bundles တွေရဲ့ အရွယ်အစားနဲ့ ဖွဲ့စည်းပုံကို နားလည်စေဖို့ ကူညီပါတယ်။ ဒီ command က application build တစ်ခုကို မထုတ်လုပ်ပါဘူး။

```bash package="pnpm"
pnpm next experimental-analyze
```

```bash package="npm"
npx next experimental-analyze
```

```bash package="yarn"
yarn next experimental-analyze
```

```bash package="bun"
bunx next experimental-analyze
```

Default အနေနဲ့ — ဒီ command က ခွဲခြမ်းစိတ်ဖြာမှု ပြီးသွားတဲ့အခါ local server တစ်ခုကို စတင်ပေးပြီး — browser ထဲမှာ သင့် bundle ဖွဲ့စည်းပုံကို စူးစမ်းနိုင်စေပါတယ်။ Analyzer နဲ့ အောက်ပါတွေကို လုပ်နိုင်ပါတယ်:

- Route အလိုက် bundles တွေကို filter လုပ်ပြီး client/server views တွေကြား ပြောင်းကြည့်ခြင်း
- Module တစ်ခု ဘာကြောင့် ပါဝင်လဲ ဆိုတာပြတဲ့ import chain အပြည့်အစုံကို ကြည့်ခြင်း
- Server-to-client component boundaries တွေနဲ့ dynamic imports တွေကို ဖြတ်ပြီး imports တွေကို ခြေရာခံခြင်း

Optimization strategies တွေအတွက် [Package Bundling](https://nextjs.org/docs/app/guides/package-bundling#optimizing-large-bundles) ကို ကြည့်ပါ။

Server မစတင်ဘဲ ခွဲခြမ်းစိတ်ဖြာမှု output ကို disk ပေါ် ရေးချင်ရင် — `--output` flag ကို သုံးပါ။ Output ကို `.next/diagnostics/analyze` ဆီ ရေးပြီး — တခြားနေရာ ကူးယူဖို့ (သို့) တခြားသူတွေနဲ့ မျှဝေဖို့ သင့်တော်တဲ့ static files တွေ ပါဝင်ပါတယ်:

```bash filename="Terminal"
# Output ကို .next/diagnostics/analyze ဆီ ရေးပါ
npx next experimental-analyze --output

# နောင် ခွဲခြမ်းစိတ်ဖြာမှုတွေနဲ့ ယှဉ်ဖို့ output ကို ကူးယူပါ
cp -r .next/diagnostics/analyze ./analyze-before-refactor
```

`next experimental-analyze` command အတွက် အောက်ပါ options တွေ ရနိုင်ပါတယ်:

| Option          | Description                                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `-h, --help`    | ရနိုင်တဲ့ options အားလုံးကို ပြသသည်။                                                                                                                   |
| `[directory]`   | Application ကို ခွဲခြမ်းစိတ်ဖြာရမယ့် directory။ မပေးရင် — လက်ရှိ directory ကို သုံးမယ်။                                         |
| `--no-mangling` | [Mangling](https://en.wikipedia.org/wiki/Name_mangling) ကို ပိတ်သည်။ Performance ကို ထိခိုက်နိုင်လို့ debugging အတွက်ပဲ သုံးသင့်သည်။ |
| `--profile`     | Production [React profiling](https://react.dev/reference/react/Profiler) ကို ဖွင့်သည်။ Performance ကို ထိခိုက်နိုင်ပါတယ်။                            |
| `-o, --output`  | Server မစတင်ဘဲ ခွဲခြမ်းစိတ်ဖြာမှု files တွေကို disk ပေါ် ရေးသည်။ Output ကို `.next/diagnostics/analyze` ဆီ ရေးသည်。                                   |
| `--port <port>` | Analyzer ကို serve လုပ်ဖို့ port နံပါတ်ကို သတ်မှတ်သည်။ (default: 4000, env: PORT)                                                                    |
## ဥပမာများ (Examples)

### Prerender errors တွေကို debug လုပ်ခြင်း

`next build` လုပ်ချိန်မှာ prerendering errors တွေ ကြုံရရင် — ပိုပြီး အသေးစိတ် output ရဖို့ `--debug-prerender` flag ကို ပေးနိုင်ပါတယ်:

```bash filename="Terminal"
next build --debug-prerender
```

ဒါက debugging ပိုလွယ်အောင် experimental options တချို့ကို ဖွင့်ပေးပါတယ်:

- Server code minification ကို ပိတ်သည်:
  - `experimental.serverMinification = false`
  - `experimental.turbopackMinify = false`
- Server bundles တွေအတွက် source maps တွေ generate လုပ်သည်:
  - `experimental.serverSourceMaps = true`
- ပထမဆုံး prerender error ပြီးနောက်မှာလည်း — ပြဿနာအားလုံးကို တစ်ပြိုင်နက် မြင်နိုင်အောင် build ကို ဆက်လုပ်သည်:
  - `experimental.prerenderEarlyExit = false`

ဒါတွေက build output ထဲမှာ ပိုရှင်းလင်းတဲ့ stack traces တွေနဲ့ code frames တွေကို မြင်နိုင်စေပါတယ်။

> **သတိပေးချက်:** `--debug-prerender` က development မှာ debugging လုပ်ဖို့ပဲ ဖြစ်ပါတယ်။ `--debug-prerender` နဲ့ generate လုပ်ထားတဲ့ builds တွေကို production ဆီ deploy မလုပ်ပါနဲ့ — performance ကို ထိခိုက်စေနိုင်လို့ပါ။

### Specific routes တွေကိုပဲ build လုပ်ခြင်း

App နဲ့ Pages Routers နှစ်ခုလုံးမှာ — `--debug-build-paths` option ကို သုံးပြီး specific routes တွေကိုပဲ build လုပ်နိုင်ပါတယ်။ Application အကြီးကြီးတွေနဲ့ အလုပ်လုပ်တဲ့အခါ မြန်မြန် debug လုပ်ဖို့ အသုံးဝင်ပါတယ်။ `--debug-build-paths` option က comma-separated file paths တွေကို လက်ခံပြီး — glob patterns တွေကို ထောက်ပံ့ကာ — `!` နဲ့ အစပြုတဲ့ path ဘယ်ဟာကိုမဆို ဖယ်ထုတ်ပါတယ်:

```bash filename="Terminal"
# Route တစ်ခုကိုပဲ build လုပ်ရန်
next build --debug-build-paths="app/page.tsx"

# Route တစ်ခုထက်ပိုပြီး build လုပ်ရန်
next build --debug-build-paths="app/page.tsx,pages/index.tsx"

# Route group folders တွေ path ထဲ ထည့်ရန်
next build --debug-build-paths="app/(marketing)/about/page.tsx"

# Glob patterns သုံးရန်
next build --debug-build-paths="app/**/page.tsx"
next build --debug-build-paths="pages/*.tsx"

# ! prefix နဲ့ routes တွေကို ဖယ်ထုတ်ရန်
next build --debug-build-paths="app/**/page.tsx,!app/admin/**"
```

Routes တွေကို `src/` အောက်မှာ ထားတဲ့ projects တွေမှာ — paths တွေက `src/` prefix ပါပါ မပါပါ နှစ်မျိုးလုံးနဲ့ resolve လုပ်လို့ — `app/page.tsx` ရော `src/app/page.tsx` ပါ route တစ်ခုတည်းကို ကိုက်ညီပါတယ်။

### Default port ကို ပြောင်းခြင်း

Default အနေနဲ့ — Next.js က development နဲ့ `next start` လုပ်တဲ့အခါ `http://localhost:3000` ကို သုံးပါတယ်။ `-p` option နဲ့ default port ကို ပြောင်းနိုင်ပါတယ်:

```bash filename="Terminal"
next dev -p 4000
```

ဒါမှမဟုတ် `PORT` environment variable ကို သုံးပြီး:

```bash filename="Terminal"
PORT=4000 next dev
```

> **သိထားသင့်သည်:** HTTP server က တခြား code ဘာမှ မစတင်ခင် boot ဖြစ်တာမို့ — `PORT` ကို `.env` ထဲမှာ သတ်မှတ်လို့ မရပါဘူး။

### Development မှာ HTTPS သုံးခြင်း

Webhooks (သို့) authentication လိုမျိုး use cases တချို့အတွက် — `localhost` ပေါ်မှာ လုံခြုံတဲ့ environment ရဖို့ [HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS) ကို သုံးနိုင်ပါတယ်။ Next.js က `--experimental-https` flag နဲ့ `next dev` ကို သုံးပြီး — self-signed certificate တစ်ခု generate လုပ်ပေးနိုင်ပါတယ်:

```bash filename="Terminal"
next dev --experimental-https
```

Generated certificate နဲ့ဆို — Next.js development server က `https://localhost:3000` မှာ ရှိပါမယ်။ `-p`, `--port`, (သို့) `PORT` နဲ့ port သတ်မှတ်မထားရင် — default port `3000` ကို သုံးပါတယ်။

`--experimental-https-key` နဲ့ `--experimental-https-cert` တွေနဲ့ custom certificate နဲ့ key တွေကိုလည်း ပေးနိုင်ပါတယ်။ Optional အနေနဲ့ — `--experimental-https-ca` နဲ့ custom CA certificate တစ်ခုလည်း ပေးနိုင်ပါတယ်:

```bash filename="Terminal"
next dev --experimental-https --experimental-https-key ./certificates/localhost-key.pem --experimental-https-cert ./certificates/localhost.pem
```

`next dev --experimental-https` က development အတွက်ပဲ ရည်ရွယ်ပြီး — [`mkcert`](https://github.com/FiloSottile/mkcert) နဲ့ locally trusted certificate တစ်ခု ဖန်တီးပေးပါတယ်။ Production မှာတော့ — trusted authorities တွေက ထုတ်ပေးတဲ့ certificate တွေကို သုံးပါ။

### Downstream proxies တွေအတွက် timeout တစ်ခု configure လုပ်ခြင်း

Downstream proxy တစ်ခုရဲ့ နောက်မှာ Next.js ကို deploy လုပ်တဲ့အခါ (ဥပမာ — AWS ELB/ALB လိုမျိုး load-balancer) — Next ရဲ့ အောက်ခံ HTTP server ကို downstream proxy ရဲ့ timeouts တွေထက် _ပိုကြီးတဲ့_ [keep-alive timeouts](https://nodejs.org/api/http.html#http_server_keepalivetimeout) တွေနဲ့ configure လုပ်ဖို့ အရေးကြီးပါတယ်။ မလုပ်ရင် — TCP connection တစ်ခုအတွက် keep-alive timeout ရောက်တာနဲ့ — Node.js က downstream proxy ကို အသိမပေးဘဲ အဲဒီ connection ကို ချက်ချင်း ဖြတ်ပစ်ပါတယ်။ ဒါကြောင့် — Node.js က ဖြတ်ပြီးသား connection တစ်ခုကို proxy က ပြန်သုံးဖို့ ကြိုးစားတိုင်း proxy error ဖြစ်စေပါတယ်။

Production Next.js server အတွက် timeout values တွေ configure လုပ်ဖို့ — `next start` ဆီ `--keepAliveTimeout` (milliseconds) ကို ပေးပါ:

```bash filename="Terminal"
next start --keepAliveTimeout 70000
```

### Node.js arguments တွေ ပေးပို့ခြင်း

`next` commands တွေဆီ [node arguments](https://nodejs.org/api/cli.html#cli_node_options_options) ဘယ်ဟာကိုမဆို ပေးနိုင်ပါတယ်။ ဥပမာ:

```bash filename="Terminal"
NODE_OPTIONS='--throw-deprecation' next
NODE_OPTIONS='-r esm' next
NODE_OPTIONS='--inspect' next
```

### CPU profiling

သင့် Next.js application ထဲက performance bottlenecks တွေကို ခွဲခြမ်းစိတ်ဖြာဖို့ — CPU profiles တွေကို ဖမ်းယူနိုင်ပါတယ်။ `--experimental-cpu-prof` flag က V8 ရဲ့ built-in CPU profiler ကို ဖွင့်ပေးပြီး — process က exit လုပ်တဲ့အခါ profiles တွေကို `.next-profiles/` ဆီ သိမ်းပေးပါတယ်:

```bash filename="Terminal"
# Build process ကို profile လုပ်ရန်
next build --experimental-cpu-prof

# Dev server ကို profile လုပ်ရန် (Ctrl+C (သို့) SIGTERM ပေါ်မှာ သိမ်းသည်)
next dev --experimental-cpu-prof

# Production server ကို profile လုပ်ရန်
next start --experimental-cpu-prof
```

Generated `.cpuprofile` files တွေကို Chrome DevTools (Performance tab → Load profile) (သို့) တခြား V8-compatible profiling tools တွေထဲမှာ ဖွင့်နိုင်ပါတယ်။

> **သိထားသင့်သည်:** Profile files တွေကို ဖော်ပြချက်ပါတဲ့ prefix နဲ့ timestamp တစ်ခုနဲ့ နာမည်ပေးပါတယ်။ Generate ဖြစ်တဲ့ profiles တွေက command ပေါ် မူတည်ပါတယ်:
>
> **`next dev`:**
>
> - `dev-main-*` — Parent process (dev server orchestration)
> - `dev-server-*` — Child server process (request handling နဲ့ rendering) — ပုံမှန်အားဖြင့် ဒါကို ခွဲခြမ်းစိတ်ဖြာချင်လေ့ ရှိပါတယ်
>
> **`next build` (Turbopack):**
>
> - `build-main-*` — Main build orchestration process
> - `build-turbopack-*` — Turbopack compilation worker
>
> **`next build` (Webpack):**
>
> - `build-main-*` — Main build orchestration process
> - `build-webpack-client-*` — Client bundle compilation worker
> - `build-webpack-server-*` — Server bundle compilation worker
> - `build-webpack-edge-server-*` — Edge runtime compilation worker
>
> **`next start`:**
>
> - `start-main-*` — Production server process

| Version   | အပြောင်းအလဲ                                                                         |
| --------- | ------------------------------------------------------------------------------- |
| `v16.1.0` | `next upgrade` command ထည့်သွင်း                                                  |
| `v16.1.0` | `next experimental-analyze` command ထည့်သွင်း                                     |
| `v16.0.0` | JS bundle size metrics တွေကို `next build` ကနေ ဖယ်ရှား                  |
| `v15.5.0` | `next typegen` command ထည့်သွင်း                                                  |
| `v15.4.0` | Prerender errors တွေ debug လုပ်ဖို့ `next build` အတွက် `--debug-prerender` option ထည့်သွင်း |
