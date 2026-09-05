---
title: "Compiler Options (tsc CLI Option များ)"
description: "tsc command line interface ရဲ့ compiler options အားလုံးကို စုစည်းဖော်ပြထားတဲ့ ကိုးကားချက် — CLI Commands, Build Options, Watch Options နဲ့ Compiler Flags အုပ်စုတွေအောက်မှာ flag အမည်, type, default တန်ဖိုးနဲ့ ရှင်းလင်းချက်တွေကို ဇယားပုံစံနဲ့ ဖော်ပြထားပါတယ်"
order: 69
source: "https://www.typescriptlang.org/docs/handbook/compiler-options.html"
status: translated
updated: 2026-09-05
---

## Using the CLI (CLI ကို အသုံးပြုခြင်း)

`tsc` ကို local မှာ run လိုက်တဲ့အခါ — `tsconfig.json` တစ်ခုနဲ့ သတ်မှတ်ထားတဲ့ အနီးဆုံး project ကို compile လုပ်ပေးမှာ ဖြစ်ပြီး — သင်လိုချင်တဲ့ files တွေရဲ့ glob pattern တစ်ခုကို ဖြတ်ပေးခြင်းအားဖြင့် TypeScript files အစုတစ်ခုကိုလည်း compile လုပ်နိုင်ပါတယ်။ Command line မှာ input files တွေ သတ်မှတ်ပေးထားရင် — `tsconfig.json` files တွေကို လျစ်လျူရှုပါတယ်။

```sh
# Run a compile based on a backwards look through the fs for a tsconfig.json
tsc

# Emit JS for just the index.ts with the compiler defaults
tsc index.ts

# Emit JS for any .ts files in the folder src, with the default settings
tsc src/*.ts

# Emit files referenced in with the compiler settings from tsconfig.production.json
tsc --project tsconfig.production.json

# Emit d.ts files for a js file with showing compiler options which are booleans
tsc index.js --declaration --emitDeclarationOnly

# Emit a single .js file from two files via compiler options which take string arguments
tsc app.ts util.ts --target esnext --outfile index.js
```

## Compiler Options (Compiler Option များ)

**tsconfig တစ်ခုထဲက compiler options တွေအကြောင်း ပိုပြီး အသေးစိတ် သိချင်ရင် — [TSConfig Reference](https://www.typescriptlang.org/tsconfig) ကို ကြည့်ရှုပါ။**

### CLI Commands (CLI Command များ)

| Flag | Type | Description |
|---|---|---|
| `--all` | `boolean` | Compiler options အားလုံးကို ပြသပါ။ |
| `--help` | `boolean` | CLI နဲ့ ပတ်သက်တဲ့ help (အကူအညီ) အချက်အလက်တွေကို local မှာ ပြသပေးပါ။ |
| `--ignoreConfig` | `boolean` | တွေ့ရှိထားတဲ့ tsconfig ကို လျစ်လျူရှုပြီး — command line options နဲ့ files တွေကို သုံးပြီး build လုပ်ပါ။ |
| `--init` | `boolean` | TypeScript project တစ်ခုကို စတင်သတ်မှတ်ပြီး tsconfig.json file တစ်ခု ဖန်တီးပေးပါ။ |
| `--listFilesOnly` | `boolean` | Compilation ထဲ ပါဝင်တဲ့ files တွေရဲ့ အမည်တွေကို print ထုတ်ပြီး — လုပ်ဆောင်မှုကို ရပ်လိုက်ပါ။ |
| `--locale` | `string` | TypeScript ကနေ ထွက်တဲ့ message တွေရဲ့ ဘာသာစကားကို သတ်မှတ်ပါ။ ဒါက emit ကို သက်ရောက်မှု မရှိပါ။ |
| `--project` | `string` | သူ့ရဲ့ configuration file ဆီ ဒါမှမဟုတ် 'tsconfig.json' ပါတဲ့ folder တစ်ခုဆီ ပေးထားတဲ့ path ရဲ့ project ကို compile လုပ်ပါ။ |
| `--showConfig` | `boolean` | Build လုပ်မယ့်အစား — နောက်ဆုံး configuration ကို print ထုတ်ပါ။ |
| `--version` | `boolean` | Compiler ရဲ့ version ကို print ထုတ်ပါ။ |

### Build Options (Build Option များ)

| Flag | Type | Description |
|---|---|---|
| `--build` | `boolean` | Project တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ project တွေကို — outdated ဖြစ်နေရင် — သူတို့ရဲ့ dependencies တွေနဲ့အတူ build လုပ်ပါ။ |
| `--clean` | `boolean` | Project အားလုံးရဲ့ outputs တွေကို ဖျက်ပစ်ပါ။ |
| `--dry` | `boolean` | '--clean' နဲ့ တွဲသတ်မှတ်ထားရင် — ဘာတွေ build လုပ်မယ် (ဒါမှမဟုတ် ဘာတွေ ဖျက်ပစ်မယ်) ဆိုတာကို ပြသပါ။ |
| `--force` | `boolean` | Up to date (နောက်ဆုံး အခြေအနေရှိ) ပုံရတဲ့ project တွေ အပါအဝင် — project အားလုံးကို build လုပ်ပါ။ |
| `--verbose` | `boolean` | Verbose logging (အသေးစိတ် log မှတ်တမ်း) ကို ဖွင့်ပေးပါ။ |

### Watch Options (Watch Option များ)

| Flag | Type | Description |
|---|---|---|
| `--excludeDirectories` | `list` | Watch process ကနေ directories စာရင်းတစ်ခုကို ဖယ်ထုတ်ပါ။ |
| `--excludeFiles` | `list` | Watch mode ရဲ့ processing ကနေ files စာရင်းတစ်ခုကို ဖယ်ထုတ်ပါ။ |
| `--fallbackPolling` | `fixedinterval`, `priorityinterval`, `dynamicpriority`, သို့မဟုတ် `fixedchunksize` | System မှာ native file watchers တွေ ကုန်သွားရင် — watcher က ဘယ် approach (နည်းလမ်း) ကို သုံးရမလဲ သတ်မှတ်ပါ။ |
| `--synchronousWatchDirectory` | `boolean` | Recursive watching (ထပ်ဆင့် စောင့်ကြည့်မှု) ကို natively မပံ့ပိုးတဲ့ platforms တွေမှာ — callbacks တွေကို synchronously (တစ်ပြိုင်တည်း) ခေါ်ယူပြီး directory watchers တွေရဲ့ state ကို update လုပ်ပါ။ |
| `--watch` | `boolean` | Input files တွေကို စောင့်ကြည့် (watch) ပါ။ |
| `--watchDirectory` | `usefsevents`, `fixedpollinginterval`, `dynamicprioritypolling`, သို့မဟုတ် `fixedchunksizepolling` | Recursive file-watching functionality (ထပ်ဆင့် file စောင့်ကြည့်ခြင်း လုပ်ဆောင်ချက်) မရှိတဲ့ systems တွေမှာ — directories တွေကို ဘယ်လို စောင့်ကြည့်ရမလဲ သတ်မှတ်ပါ။ |
| `--watchFile` | `fixedpollinginterval`, `prioritypollinginterval`, `dynamicprioritypolling`, `fixedchunksizepolling`, `usefsevents`, သို့မဟုတ် `usefseventsonparentdirectory` | TypeScript watch mode က ဘယ်လို အလုပ်လုပ်မလဲ သတ်မှတ်ပါ။ |

### Compiler Flags (Compiler Flag များ)

| Flag | Type | Default | Description |
|---|---|---|---|
| `--allowArbitraryExtensions` | `boolean` | `false` | Declaration file တစ်ခု ရှိနေတယ်ဆိုရင် — extension မည်သည့်အမျိုးအစားမဆို ရှိတဲ့ files တွေကို import လုပ်ခွင့်ပြုပါ။ |
| `--allowImportingTsExtensions` | `boolean` | `rewriteRelativeImportExtensions` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | Imports တွေမှာ TypeScript file extensions တွေ ပါဝင်ခွင့်ပြုပါ။ |
| `--allowJs` | `boolean` | `checkJs` သတ်မှတ်ထားရင် မှလွဲပြီး `false` ။ | JavaScript files တွေကို သင့် program ရဲ့ အစိတ်အပိုင်း ဖြစ်ခွင့်ပြုပါ။ ဒီ files တွေကနေ errors တွေ ရဖို့ `checkJS` option ကို သုံးပါ။ |
| `--allowSyntheticDefaultImports` | `boolean` | `esModuleInterop` ဖွင့်ထားတာ၊ `module` က `system` ဖြစ်တာ၊ ဒါမှမဟုတ် `moduleResolution` က `bundler` ဖြစ်တာ တစ်ခုခု မှန်နေရင် `true` ၊ မဟုတ်ရင် `false` ။ | Module တစ်ခုမှာ default export မရှိရင်တောင် 'import x from y' ကို ခွင့်ပြုပါ။ |
| `--allowUmdGlobalAccess` | `boolean` | `false` | Modules တွေကနေ UMD globals တွေကို ဝင်ရောက် (access) လုပ်ခွင့်ပြုပါ။ |
| `--allowUnreachableCode` | `boolean` | | ရောက်ရှိလို့မရတဲ့ (unreachable) code အတွက် error တင်ပြခြင်းကို ပိတ်ထားပါ။ |
| `--allowUnusedLabels` | `boolean` | | အသုံးမပြုတဲ့ labels တွေအတွက် error တင်ပြခြင်းကို ပိတ်ထားပါ။ |
| `--alwaysStrict` | `boolean` | `strict` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | 'use strict' ကို အမြဲတမ်း ထုတ်လွှတ်ကြောင်း သေချာစေပါ။ |
| `--assumeChangesOnlyAffectDirectDependencies` | `boolean` | `false` | `incremental` နဲ့ `watch` mode သုံးထားတဲ့ projects တွေမှာ — file တစ်ခုထဲက အပြောင်းအလဲတွေက အဲဒီ file ကို တိုက်ရိုက် မှီခိုတဲ့ files တွေကိုသာ သက်ရောက်မယ်လို့ ယူဆပြီး recompile လုပ်ပါ။ |
| `--baseUrl` | `string` | | Bare specifier module names တွေကို ရှာဖွေဖို့ base directory ကို သတ်မှတ်ပါ။ |
| `--charset` | `string` | `utf8` | နောက်ထပ် ပံ့ပိုးမှု မရှိတော့ပါ။ အစောပိုင်း versions တွေမှာ — files တွေ ဖတ်တဲ့အခါ text encoding ကို ကိုယ်တိုင် သတ်မှတ်ပေးခဲ့ရပါတယ်။ |
| `--checkJs` | `boolean` | `false` | Type-checked လုပ်ထားတဲ့ JavaScript files တွေထဲမှာ error တင်ပြခြင်းကို ဖွင့်ပေးပါ။ |
| `--composite` | `boolean` | `false` | TypeScript project တစ်ခုကို project references တွေနဲ့ သုံးနိုင်အောင် — ကန့်သတ်ချက်တွေ (constraints) ကို ဖွင့်ပေးပါ။ |
| `--customConditions` | `list` | | Imports တွေ resolve လုပ်တဲ့အခါ — resolver-specific default conditions တွေအပြင် ထပ်သတ်မှတ်ရမယ့် conditions တွေ ဖြစ်ပါတယ်။ |
| `--declaration` | `boolean` | `composite` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | သင့် project ထဲက TypeScript နဲ့ JavaScript files တွေကနေ .d.ts files တွေ ထုတ်ပေးပါ။ |
| `--declarationDir` | `string` | | ထုတ်ပေးလိုက်တဲ့ declaration files တွေအတွက် output directory ကို သတ်မှတ်ပါ။ |
| `--declarationMap` | `boolean` | `false` | d.ts files တွေအတွက် sourcemaps တွေ ဖန်တီးပါ။ |
| `--diagnostics` | `boolean` | `false` | Build ပြီးတဲ့အခါ — compiler performance (လုပ်ဆောင်စွမ်း) အချက်အလက်တွေကို output ထုတ်ပါ။ |
| `--disableReferencedProjectLoad` | `boolean` | `false` | TypeScript က အလိုအလျောက် load လုပ်တဲ့ projects အရေအတွက်ကို လျှော့ချပါ။ |
| `--disableSizeLimit` | `boolean` | `false` | TypeScript language server ထဲမှာ JavaScript files တွေရဲ့ စုစုပေါင်း source code size အတွက် 20mb ကန့်သတ်ချက်ကို ဖယ်ရှားပါ။ |
| `--disableSolutionSearching` | `boolean` | `false` | Editing လုပ်နေစဉ်မှာ — project တစ်ခုကို multi-project reference checking ကနေ ဖယ်ထုတ်လိုက်ပါ။ |
| `--disableSourceOfProjectReferenceRedirect` | `boolean` | `false` | Composite projects တွေကို reference လုပ်တဲ့အခါ — declaration files တွေအစား source files တွေကို ဦးစားပေးခြင်းကို ပိတ်ထားပါ။ |
| `--downlevelIteration` | `boolean` | `false` | Iteration (ထပ်ကာတလဲလဲ လုပ်ဆောင်မှု) တွေအတွက် — ပိုပြီး လိုက်နာမှုရှိတဲ့ပေမယ့် — ရှည်လျားပြီး performance ပိုနည်းတဲ့ JavaScript ကို ထုတ်လွှတ်ပါ။ |
| `--emitBOM` | `boolean` | `false` | Output files တွေရဲ့ အစမှာ UTF-8 Byte Order Mark (BOM) တစ်ခု ထုတ်လွှတ်ပါ။ |
| `--emitDeclarationOnly` | `boolean` | `false` | JavaScript files တွေ မဟုတ်ဘဲ — d.ts files တွေကိုသာ output လုပ်ပါ။ |
| `--emitDecoratorMetadata` | `boolean` | `false` | Source files တွေထဲက decorated declarations တွေအတွက် design-type metadata ကို ထုတ်လွှတ်ပါ။ |
| `--erasableSyntaxOnly` | `boolean` | `false` | ECMAScript ရဲ့ အစိတ်အပိုင်း မဟုတ်တဲ့ — runtime constructs (runtime လုပ်ဆောင်ချက်များ) တွေကို ခွင့်မပြုပါ။ |
| `--esModuleInterop` | `boolean` | `module` က `node16` ၊ `nodenext` ဒါမှမဟုတ် `preserve` ဖြစ်ရင် `true` ၊ မဟုတ်ရင် `false` ။ | CommonJS modules တွေကို import လုပ်တာ ပိုလွယ်ကူစေဖို့ နောက်ထပ် JavaScript တွေ ထုတ်လွှတ်ပါ။ ဒါက type compatibility အတွက် `allowSyntheticDefaultImports` ကို ဖွင့်ပေးပါတယ်။ |
| `--exactOptionalPropertyTypes` | `boolean` | `false` | Optional property types တွေကို `undefined` ထပ်ဖြည့်မယ့်အစား — ရေးထားတဲ့အတိုင်း အတိအကျ အနက်ဖွင့်ပါ။ |
| `--experimentalDecorators` | `boolean` | `false` | TC39 stage 2 draft decorators တွေအတွက် experimental (စမ်းသပ်ဆဲ) ပံ့ပိုးမှုကို ဖွင့်ပေးပါ။ |
| `--explainFiles` | `boolean` | `false` | Compilation အတွင်း ဖတ်ခဲ့တဲ့ files တွေကို — ဘာကြောင့် ထည့်သွင်းခဲ့လဲဆိုတာနဲ့တကွ — print ထုတ်ပါ။ |
| `--extendedDiagnostics` | `boolean` | `false` | Build ပြီးတဲ့အခါ — ပိုပြီး အသေးစိတ်တဲ့ compiler performance အချက်အလက်တွေကို output ထုတ်ပါ။ |
| `--forceConsistentCasingInFileNames` | `boolean` | `true` | Imports တွေထဲမှာ casing (စာလုံး အကြီး/အသေး) မှန်ကန်ကြောင်း သေချာစေပါ။ |
| `--generateCpuProfile` | `string` | `profile.cpuprofile` | Debugging အတွက် — compiler run ရဲ့ v8 CPU profile တစ်ခုကို ထုတ်လွှတ်ပါ။ |
| `--generateTrace` | `string` | | Event trace တစ်ခုနဲ့ types စာရင်းတစ်ခုကို ထုတ်ပေးပါ။ |
| `--importHelpers` | `boolean` | `false` | Helper functions တွေကို file တစ်ခုချင်းစီမှာ ထည့်သွင်းမယ့်အစား — project တစ်ခုလျှင် တစ်ကြိမ် tslib ကနေ import လုပ်ခွင့်ပြုပါ။ |
| `--importsNotUsedAsValues` | `remove`, `preserve`, သို့မဟုတ် `error` | `remove` | Types တွေအတွက်သာ သုံးတဲ့ imports တွေအတွက် emit/checking အပြုအမူကို သတ်မှတ်ပါ။ |
| `--incremental` | `boolean` | `composite` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | Projects တွေကို incremental compilation လုပ်နိုင်ဖို့ .tsbuildinfo files တွေကို သိမ်းဆည်းပါ။ |
| `--inlineSourceMap` | `boolean` | `false` | ထုတ်လွှတ်လိုက်တဲ့ JavaScript ထဲမှာ sourcemap files တွေ ထည့်သွင်းပါ။ |
| `--inlineSources` | `boolean` | `false` | ထုတ်လွှတ်လိုက်တဲ့ JavaScript ထဲက sourcemaps တွေထဲမှာ source code ကို ထည့်သွင်းပါ။ |
| `--isolatedDeclarations` | `boolean` | `false` | တခြား tools တွေက declaration files တွေကို လွယ်ကူစွာ ထုတ်လုပ်နိုင်အောင် — exports တွေမှာ လုံလောက်တဲ့ annotation တွေ ပါဝင်ဖို့ လိုအပ်ပါတယ်။ |
| `--isolatedModules` | `boolean` | `verbatimModuleSyntax` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | File တစ်ခုချင်းစီက — တခြား imports တွေကို အားမကိုးဘဲ — လုံခြုံစွာ transpile လုပ်လို့ရအောင် သေချာစေပါ။ |
| `--jsx` | `preserve`, `react`, `react-native`, `react-jsx`, သို့မဟုတ် `react-jsxdev` | | ဘယ်လို JSX code မျိုး ထုတ်လုပ်မလဲ သတ်မှတ်ပါ။ |
| `--jsxFactory` | `string` | `React.createElement` | React JSX emit ကို target လုပ်တဲ့အခါ သုံးမယ့် JSX factory function ကို သတ်မှတ်ပါ — ဥပမာ 'React.createElement' ဒါမှမဟုတ် 'h'။ |
| `--jsxFragmentFactory` | `string` | `React.Fragment` | React JSX emit ကို target လုပ်တဲ့အခါ — fragments တွေအတွက် သုံးမယ့် JSX Fragment reference ကို သတ်မှတ်ပါ — ဥပမာ 'React.Fragment' ဒါမှမဟုတ် 'Fragment'။ |
| `--jsxImportSource` | `string` | `react` | `jsx: react-jsx*` သုံးတဲ့အခါ — JSX factory functions တွေကို import လုပ်ဖို့ သုံးမယ့် module specifier ကို သတ်မှတ်ပါ။ |
| `--keyofStringsOnly` | `boolean` | `false` | Keyof က string, numbers ဒါမှမဟုတ် symbols တွေအစား — strings တွေကိုသာ ပြန်ပေးစေပါ။ Legacy (အဟောင်း) option တစ်ခုပါ။ |
| `--lib` | `list` | | Target runtime environment (ပစ်မှတ် runtime ပတ်ဝန်းကျင်) ကို ဖော်ပြတဲ့ bundled library declaration files အစုတစ်ခုကို သတ်မှတ်ပါ။ |
| `--libReplacement` | `boolean` | `false` | Default `lib` files တွေကို ကိုယ်ပိုင် (custom) files တွေနဲ့ အစားထိုးခြင်းကို ဖွင့်ပေးပါ။ |
| `--listEmittedFiles` | `boolean` | `false` | Compilation တစ်ခု ပြီးတဲ့အခါ — emitted files တွေရဲ့ အမည်တွေကို print ထုတ်ပါ။ |
| `--listFiles` | `boolean` | `false` | Compilation အတွင်း ဖတ်ခဲ့တဲ့ files အားလုံးကို print ထုတ်ပါ။ |
| `--mapRoot` | `string` | | Debugger က map files တွေကို — ထုတ်ပေးထားတဲ့ နေရာတွေအစား — ရှာဖွေရမယ့် တည်နေရာကို သတ်မှတ်ပါ။ |
| `--maxNodeModuleJsDepth` | `number` | `0` | JavaScript files တွေကို `node_modules` ကနေ စစ်ဆေးတဲ့အခါ သုံးမယ့် — အမြင့်ဆုံး folder depth ကို သတ်မှတ်ပါ။ `allowJs` နဲ့ဆိုရင်သာ သက်ရောက်ပါတယ်။ |
| `--module` | `none`, `commonjs`, `amd`, `umd`, `system`, `es6` / `es2015`, `es2020`, `es2022`, `esnext`, `node16`, `node18`, `node20`, `nodenext`, သို့မဟုတ် `preserve` | `target` က `ES5` ဆိုရင် `CommonJS` ၊ မဟုတ်ရင် `ES6` / `ES2015` ။ | ဘယ်လို module code မျိုး ထုတ်လုပ်မလဲ သတ်မှတ်ပါ။ |
| `--moduleDetection` | `legacy`, `auto`, သို့မဟုတ် `force` | "auto": imports, exports, import.meta, jsx (jsx: react-jsx နဲ့ဆိုရင်) ဒါမှမဟုတ် esm format (module: node16+ နဲ့ဆိုရင်) ပါဝင်တဲ့ files တွေကို modules အဖြစ် သတ်မှတ်ပါတယ်။ | File တစ်ခုက script လား module လားဆိုတာ သိရှိဖို့ သုံးမယ့် method ကို သတ်မှတ်ပါ။ |
| `--moduleResolution` | `classic`, `node10` / `node`, `node16`, `nodenext`, သို့မဟုတ် `bundler` | `module` က `CommonJS` ဆိုရင် `Node10` ၊ `module` က `Node16` ၊ `Node18` ဒါမှမဟုတ် `Node20` ဆိုရင် `Node16` ၊ `module` က `NodeNext` ဆိုရင် `NodeNext` ၊ `module` က `Preserve` ဆိုရင် `Bundler` ၊ မဟုတ်ရင် `Classic` ။ | TypeScript က module specifier တစ်ခုကနေ file တစ်ခုကို ဘယ်လို ရှာဖွေရမလဲ သတ်မှတ်ပါ။ |
| `--moduleSuffixes` | `list` | | Module တစ်ခု resolve လုပ်တဲ့အခါ ရှာဖွေရမယ့် file name suffixes တွေရဲ့ စာရင်းပါ။ |
| `--newLine` | `crlf` သို့မဟုတ် `lf` | `lf` | Files တွေ ထုတ်လွှတ်တဲ့အခါ သုံးရမယ့် newline character ကို သတ်မှတ်ပါ။ |
| `--noCheck` | `boolean` | `false` | Full type checking ကို ပိတ်ထားပါ (critical ဖြစ်တဲ့ parse နဲ့ emit errors တွေကိုသာ တင်ပြပါလိမ့်မယ်)။ |
| `--noEmit` | `boolean` | `false` | Compilation တစ်ခုကနေ files ထုတ်လွှတ်ခြင်းကို ပိတ်ထားပါ။ |
| `--noEmitHelpers` | `boolean` | `false` | Compiled output ထဲမှာ `__extends` လိုမျိုး custom helper functions တွေ ထုတ်လုပ်ခြင်းကို ပိတ်ထားပါ။ |
| `--noEmitOnError` | `boolean` | `false` | Type checking errors တစ်ခုခု တင်ပြခံရရင် — files တွေ ထုတ်လွှတ်ခြင်းကို ပိတ်ထားပါ။ |
| `--noErrorTruncation` | `boolean` | `false` | Error messages တွေထဲမှာ types တွေကို အတိုချုံး (truncate) လုပ်တာကို ပိတ်ထားပါ။ |
| `--noFallthroughCasesInSwitch` | `boolean` | `false` | Switch statements တွေထဲက fallthrough cases (အောက်ကို ဆက်စီးဆင်းသွားတဲ့ case များ) တွေအတွက် error တင်ပြခြင်းကို ဖွင့်ပေးပါ။ |
| `--noImplicitAny` | `boolean` | `strict` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | Expressions နဲ့ declarations တွေထဲမှာ သွယ်ဝိုက်နေတဲ့ (implied) `any` type ရှိရင် error တင်ပြခြင်းကို ဖွင့်ပေးပါ။ |
| `--noImplicitOverride` | `boolean` | `false` | Derived classes တွေထဲမှာ override လုပ်တဲ့ members တွေကို override modifier တစ်ခုနဲ့ အမှတ်အသား ပြုလုပ်ထားကြောင်း သေချာစေပါ။ |
| `--noImplicitReturns` | `boolean` | `false` | Function တစ်ခုထဲမှာ အတိအကျ return မလုပ်တဲ့ code paths တွေအတွက် error တင်ပြခြင်းကို ဖွင့်ပေးပါ။ |
| `--noImplicitThis` | `boolean` | `strict` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | `this` ကို `any` type ပေးထားတဲ့အခါ error တင်ပြခြင်းကို ဖွင့်ပေးပါ။ |
| `--noImplicitUseStrict` | `boolean` | `false` | ထုတ်လွှတ်လိုက်တဲ့ JavaScript files တွေထဲမှာ 'use strict' directives တွေ ထည့်သွင်းတာကို ပိတ်ထားပါ။ |
| `--noLib` | `boolean` | `false` | Default lib.d.ts အပါအဝင် — library files ဘယ်ဟာကိုမှ ထည့်သွင်းခြင်း မပြုပါ။ |
| `--noPropertyAccessFromIndexSignature` | `boolean` | `false` | Indexed type တစ်ခုနဲ့ ကြေညာထားတဲ့ keys တွေအတွက် — indexed accessors (index နဲ့ ဝင်ရောက်ခြင်းများ) တွေကိုသာ သုံးစေရန် အတင်းအကျပ် လုပ်ပါ။ |
| `--noResolve` | `boolean` | `false` | `import`s ၊ `require`s ဒါမှမဟုတ် `<reference>`s တွေကြောင့် — TypeScript က project တစ်ခုထဲ ထည့်သွင်းရမယ့် file အရေအတွက် တိုးလာတာကို ခွင့်မပြုပါ။ |
| `--noStrictGenericChecks` | `boolean` | `false` | Function types တွေထဲက generic signatures တွေကို strict စစ်ဆေးခြင်း မပြုပါ။ |
| `--noUncheckedIndexedAccess` | `boolean` | `false` | Index တစ်ခုနဲ့ ဝင်ရောက် (access) တဲ့အခါ — type တစ်ခုထဲ `undefined` ကို ထည့်ပေးပါ။ |
| `--noUncheckedSideEffectImports` | `boolean` | `true` | Side effect imports တွေကို check လုပ်ပါ။ |
| `--noUnusedLocals` | `boolean` | `false` | Local variables တွေကို ဖတ်မသုံးတဲ့အခါ error တင်ပြခြင်းကို ဖွင့်ပေးပါ။ |
| `--noUnusedParameters` | `boolean` | `false` | Function parameter တစ်ခုကို ဖတ်မသုံးတဲ့အခါ error တစ်ခု တင်ပါ။ |
| `--out` | `string` | | Deprecated (အသုံးမပြုတော့သော) setting တစ်ခု ဖြစ်ပါတယ် — `outFile` ကို အစားထိုး သုံးပါ။ |
| `--outDir` | `string` | | ထုတ်လွှတ်လိုက်တဲ့ files တွေ အားလုံးအတွက် output folder တစ်ခု သတ်မှတ်ပါ။ |
| `--outFile` | `string` | | Output အားလုံးကို JavaScript file တစ်ခုတည်းထဲ စုစည်းပေးမယ့် file တစ်ခုကို သတ်မှတ်ပါ။ `declaration` က true ဆိုရင် — .d.ts output အားလုံးကိုပါ စုစည်းပေးမယ့် file အဖြစ်လည်း သတ်မှတ်ပေးပါတယ်။ |
| `--paths` | `object` | | Imports တွေကို နောက်ထပ် lookup နေရာတွေဆီ ပြန်ညွှန်းပေးမယ့် entries အစုတစ်ခုကို သတ်မှတ်ပါ။ |
| `--plugins` | `list` | | ထည့်သွင်းရမယ့် language service plugins တွေရဲ့ စာရင်းတစ်ခုကို သတ်မှတ်ပါ။ |
| `--preserveConstEnums` | `boolean` | `isolatedModules` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | ထုတ်လုပ်လိုက်တဲ့ code ထဲမှာ `const enum` declarations တွေကို ဖျက်ပစ်တာ မလုပ်ပါ။ |
| `--preserveSymlinks` | `boolean` | `false` | Symlinks တွေကို သူတို့ရဲ့ realpath အဖြစ် ဖြေရှင်းတာ မလုပ်ပါ။ ဒါက node ထဲက flag တစ်ခုနဲ့ ဆက်စပ်နေပါတယ်။ |
| `--preserveValueImports` | `boolean` | `false` | မဟုတ်ရင် ဖယ်ရှားခံရမယ့် — အသုံးမပြုတဲ့ imported values တွေကို JavaScript output ထဲမှာ ထိန်းသိမ်းထားပါ။ |
| `--preserveWatchOutput` | `boolean` | `false` | Watch mode မှာ console ကို ရှင်းပစ်တာကို ပိတ်ထားပါ။ |
| `--pretty` | `boolean` | `true` | Compiler errors တွေကို ပိုပြီး ဖတ်ရလွယ်အောင် — TypeScript ရဲ့ output မှာ color နဲ့ formatting ကို ဖွင့်ပေးပါ။ |
| `--reactNamespace` | `string` | `React` | `createElement` အတွက် ခေါ်ယူမယ့် object ကို သတ်မှတ်ပါ။ ဒါက `react` JSX emit ကို target လုပ်တဲ့အခါမှသာ သက်ရောက်ပါတယ်။ |
| `--removeComments` | `boolean` | `false` | Comments (မှတ်ချက်များ) တွေ ထုတ်လွှတ်တာကို ပိတ်ထားပါ။ |
| `--resolveJsonModule` | `boolean` | `false` | .json files တွေကို import လုပ်ခြင်းကို ဖွင့်ပေးပါ။ |
| `--resolvePackageJsonExports` | `boolean` | `moduleResolution` က `node16` ၊ `nodenext` ဒါမှမဟုတ် `bundler` ဖြစ်ရင် `true` ၊ မဟုတ်ရင် `false` ။ | Package imports တွေ resolve လုပ်တဲ့အခါ — package.json ထဲက 'exports' field ကို သုံးပါ။ |
| `--resolvePackageJsonImports` | `boolean` | `moduleResolution` က `node16` ၊ `nodenext` ဒါမှမဟုတ် `bundler` ဖြစ်ရင် `true` ၊ မဟုတ်ရင် `false` ။ | Imports တွေ resolve လုပ်တဲ့အခါ — package.json ထဲက 'imports' field ကို သုံးပါ။ |
| `--rewriteRelativeImportExtensions` | `boolean` | `false` | Relative import paths တွေထဲက `.ts` ၊ `.tsx` ၊ `.mts` နဲ့ `.cts` file extensions တွေကို — output files တွေထဲမှာ သူတို့ရဲ့ JavaScript နဲ့ ညီမျှတဲ့ extensions အဖြစ် ပြန်ရေးပါ။ |
| `--rootDir` | `string` | Input files တွေရဲ့ စာရင်းကနေ တွက်ချက် သတ်မှတ်ပေးပါတယ်။ | သင့် source files တွေရဲ့ အတွင်းမှာ ရှိတဲ့ root folder ကို သတ်မှတ်ပါ။ |
| `--rootDirs` | `list` | Input files တွေရဲ့ စာရင်းကနေ တွက်ချက် သတ်မှတ်ပေးပါတယ်။ | Modules တွေ resolve လုပ်တဲ့အခါ — folders အများအပြားကို တစ်ခုတည်းအဖြစ် သဘောထားခွင့်ပြုပါ။ |
| `--skipDefaultLibCheck` | `boolean` | `false` | TypeScript နဲ့အတူ ပါလာတဲ့ .d.ts files တွေကို type checking လုပ်တာ ကျော်လိုက်ပါ။ |
| `--skipLibCheck` | `boolean` | `false` | .d.ts files တွေ အားလုံးကို type checking လုပ်တာ ကျော်လိုက်ပါ။ |
| `--sourceMap` | `boolean` | `false` | ထုတ်လွှတ်လိုက်တဲ့ JavaScript files တွေအတွက် source map files တွေ ဖန်တီးပါ။ |
| `--sourceRoot` | `string` | | Debuggers တွေ reference source code ကို ရှာတွေ့နိုင်ဖို့ root path ကို သတ်မှတ်ပါ။ |
| `--stableTypeOrdering` | `boolean` | `false` | Types တွေကို compilations တစ်လျှောက် — တည်ငြိမ်ပြီး ကြိုတင် ခန့်မှန်းလို့ရတဲ့အတိုင်း — အစဉ်လိုက် စီစဉ်ကြောင်း သေချာစေပါ။ |
| `--stopBuildOnErrors` | `boolean` | | Upstream project မှာ error ရှိနေရင် — downstream projects တွေကို build လုပ်တာ ကျော်လိုက်ပါ။ |
| `--strict` | `boolean` | `true` | Strict type-checking options (တင်းကျပ်တဲ့ type စစ်ဆေးမှု ရွေးချယ်စရာများ) တွေ အားလုံးကို ဖွင့်ပေးပါ။ |
| `--strictBindCallApply` | `boolean` | `strict` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | `bind` ၊ `call` နဲ့ `apply` methods တွေရဲ့ arguments တွေက မူရင်း function နဲ့ ကိုက်ညီမှုရှိမရှိ စစ်ဆေးပါ။ |
| `--strictBuiltinIteratorReturn` | `boolean` | `strict` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | Built-in iterators တွေကို — any အစား — undefined ဖြစ်တဲ့ TReturn type တစ်ခုနဲ့ စတင် (instantiate) လုပ်ပါတယ်။ |
| `--strictFunctionTypes` | `boolean` | `strict` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | Functions တွေ assign လုပ်တဲ့အခါ — parameters တွေနဲ့ return values တွေ subtype-compatible (subtype အဖြစ် ကိုက်ညီမှု) ရှိမရှိ စစ်ဆေးပါ။ |
| `--strictNullChecks` | `boolean` | `strict` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | Type checking လုပ်တဲ့အခါ `null` နဲ့ `undefined` တွေကို ထည့်သွင်း စဉ်းစားပါ။ |
| `--strictPropertyInitialization` | `boolean` | `strict` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | ကြေညာထားပေမယ့် constructor ထဲမှာ မသတ်မှတ်ထားတဲ့ class properties တွေကို စစ်ဆေးပါ။ |
| `--stripInternal` | `boolean` | `false` | သူတို့ရဲ့ JSDoc comments တွေထဲမှာ `@internal` ပါတဲ့ declarations တွေ ထုတ်လွှတ်ခြင်းကို ပိတ်ထားပါ။ |
| `--suppressExcessPropertyErrors` | `boolean` | `false` | Object literals တွေ ဖန်တီးနေစဉ်အတွင်း excess property errors (ပိုနေတဲ့ property တွေရဲ့ error) တင်ပြခြင်းကို ပိတ်ထားပါ။ |
| `--suppressImplicitAnyIndexErrors` | `boolean` | `false` | Index signatures မရှိတဲ့ objects တွေကို index လုပ်တဲ့အခါ `noImplicitAny` errors တွေ တင်ပြခြင်းကို ရပ်ထားပါ။ |
| `--target` | `es3`, `es5`, `es6` / `es2015`, `es2016`, `es2017`, `es2018`, `es2019`, `es2020`, `es2021`, `es2022`, `es2023`, `es2024`, `es2025`, သို့မဟုတ် `esnext` | `module` က `node20` ဆိုရင် `es2023` ၊ `module` က `nodenext` ဆိုရင် `esnext` ၊ မဟုတ်ရင် `ES5` ။ | ထုတ်လွှတ်လိုက်တဲ့ JavaScript အတွက် JavaScript language version ကို သတ်မှတ်ပြီး — လိုက်ဖက်ညီတဲ့ library declarations တွေကိုပါ ထည့်သွင်းပါ။ |
| `--traceResolution` | `boolean` | `false` | `moduleResolution` process အတွင်း သုံးခဲ့တဲ့ paths တွေကို log လုပ်ပါ။ |
| `--tsBuildInfoFile` | `string` | `.tsbuildinfo` | `.tsbuildinfo` incremental build အချက်အလက်တွေကို သိမ်းဆည်းရမယ့် file ဖြစ်ပါတယ်။ |
| `--typeRoots` | `list` | | `./node_modules/@types` လိုမျိုး ဆောင်ရွက်ပေးမယ့် folders အများအပြားကို သတ်မှတ်ပါ။ |
| `--types` | `list` | | Source file တစ်ခုထဲမှာ reference မလုပ်ရဘဲ ထည့်သွင်းရမယ့် type package အမည်တွေကို သတ်မှတ်ပါ။ |
| `--useDefineForClassFields` | `boolean` | `target` က `ES2022` ဒါမှမဟုတ် ဒီထက် ပိုမြင့်တဲ့ version (`ESNext` အပါအဝင်) ဆိုရင် `true` ၊ မဟုတ်ရင် `false` ။ | ECMAScript standard နဲ့ ကိုက်ညီတဲ့ class fields တွေကို ထုတ်လွှတ်ပါ။ |
| `--useUnknownInCatchVariables` | `boolean` | `strict` ဖွင့်ထားရင် `true` ၊ မဟုတ်ရင် `false` ။ | Catch clause variables တွေကို `any` အစား `unknown` အဖြစ် default သတ်မှတ်ပါ။ |
| `--verbatimModuleSyntax` | `boolean` | `false` | Type-only အဖြစ် အမှတ်အသား မပြုထားတဲ့ imports တွေနဲ့ exports တွေကို — transform (ပုံပျက်) လုပ်ခြင်း ဒါမှမဟုတ် ဖယ်ရှားခြင်း မလုပ်ဘဲ — 'module' setting ကို အခြေခံတဲ့ output file format နဲ့ ရေးသားကြောင်း သေချာစေပါ။ |

## Related (ဆက်စပ်လင့်များ)

- Option တိုင်းကို [TSConfig Reference](https://www.typescriptlang.org/tsconfig) မှာ အပြည့်အစုံ ရှင်းပြထားပါတယ်။
- [`tsconfig.json`](/docs/typescript/tsconfig-json) file တစ်ခုကို ဘယ်လို သုံးရမလဲ ဆိုတာ လေ့လာပါ။
- [MSBuild project](/docs/typescript/compiler-options-in-msbuild) တစ်ခုထဲမှာ ဘယ်လို အလုပ်လုပ်ရမလဲ ဆိုတာ လေ့လာပါ။
