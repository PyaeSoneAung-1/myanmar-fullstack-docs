---
title: "Modules: TypeScript"
description: "Node.js မှာ TypeScript runtime ပံ့ပိုးမှု — type stripping (built-in) နဲ့ tsx လိုမျိုး third-party packages တွေနဲ့ full support အကြောင်း"
order: 133
source: "https://nodejs.org/api/typescript.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

## TypeScript ဖွင့်သုံးခြင်း (Enabling)

Node.js မှာ runtime TypeScript support ကို ဖွင့်သုံးဖို့ နည်းလမ်း နှစ်ခု ရှိပါတယ်:

1. TypeScript ရဲ့ syntax နဲ့ features အားလုံးအတွက် [full support][] ရဖို့ — TypeScript version မဆို သုံးနိုင်ဖို့ အပါအဝင် — third-party package တစ်ခုကို သုံးပါ။

2. ပေါ့ပါးတဲ့ support အတွက်ဆိုရင်တော့ — [type stripping][] အတွက် built-in support ကို သုံးနိုင်ပါတယ်။

## TypeScript support အပြည့်အဝ (Full TypeScript support)

TypeScript ကို — `tsconfig.json` အပါအဝင် TypeScript features အားလုံးကို အပြည့်အဝ support နဲ့ သုံးချင်တယ်ဆိုရင် third-party package တစ်ခုကို သုံးနိုင်ပါတယ်။ ဒီညွှန်ကြားချက်တွေမှာ [`tsx`][] ကို ဥပမာအနေနဲ့ သုံးထားပြီး — အလားတူ libraries တွေ အများကြီး ရနိုင်ပါတယ်။

1. သင့် project အတွက် သုံးနေတဲ့ package manager နဲ့ပဲ package ကို development dependency အဖြစ် install လုပ်ပါ။ ဥပမာ — `npm` နဲ့ဆိုရင်:

   ```bash
   npm install --save-dev tsx
   ```

2. ပြီးရင် သင့် TypeScript code ကို အောက်ပါအတိုင်း run နိုင်ပါတယ်:

   ```bash
   npx tsx your-file.ts
   ```

   ဒါမှမဟုတ် — `node` နဲ့ အောက်ပါအတိုင်းလည်း run နိုင်ပါတယ်:

   ```bash
   node --import=tsx your-file.ts
   ```

## Type stripping (type များ ဖယ်ရှားခြင်း)

ပုံမှန်အားဖြင့် Node.js က — erasable (ဖျက်ပစ်နိုင်သော) TypeScript syntax တွေပဲ ပါဝင်တဲ့ TypeScript files တွေကို execute လုပ်ပါတယ်။ Node.js က TypeScript syntax တွေကို whitespace (နေရာလွတ်) တွေနဲ့ အစားထိုးလိုက်ပြီး — type checking (အမျိုးအစား စစ်ဆေးခြင်း) တစ်ခုမှ မလုပ်ဆောင်ပါဘူး။ ဒီ feature ကို ပိတ်ချင်ရင် [`--no-strip-types`][] flag ကို သုံးပါ။

Node.js က `tsconfig.json` files တွေကို လျစ်လျူရှုပါတယ်။ ဒါကြောင့် — `tsconfig.json` ထဲက settings တွေပေါ် မူတည်နေတဲ့ features တွေ — ဥပမာ paths (သို့) JavaScript syntax အသစ်တွေကို အဟောင်း standards တွေဆီ ပြောင်းပေးတာမျိုး — ကို ရည်ရွယ်ချက်ရှိရှိ support မလုပ်ပါဘူး။ TypeScript support အပြည့်အဝ ရချင်ရင် [Full TypeScript support][] ကို ကြည့်ပါ။

Type stripping feature က ပေါ့ပါးအောင် ဒီဇိုင်းထုတ်ထားတာပါ။ JavaScript code generation လိုအပ်တဲ့ syntaxes တွေကို ရည်ရွယ်ချက်ရှိရှိ support မလုပ်ဘဲ — inline types တွေကို whitespace တွေနဲ့ အစားထိုးခြင်းအားဖြင့် — Node.js က source maps တွေ မလိုပဲ TypeScript code တွေကို run နိုင်ပါတယ်။

Type stripping က TypeScript version အများစုနဲ့ လိုက်ဖက်မှု ရှိပေမယ့် — version 5.8 (သို့) အသစ်တွေကို အောက်ပါ `tsconfig.json` settings တွေနဲ့ တွဲသုံးဖို့ အကြံပြုပါတယ်:

```json
{
  "compilerOptions": {
     "noEmit": true, // Optional - see note below
     "target": "esnext",
     "module": "nodenext",
     "rewriteRelativeImportExtensions": true,
     "erasableSyntaxOnly": true,
     "verbatimModuleSyntax": true
  }
}
```

`*.ts` files တွေကိုပဲ execute လုပ်ဖို့ ရည်ရွယ်ထားရင် (ဥပမာ — build script တစ်ခု) `noEmit` option ကို သုံးပါ။ `*.js` files တွေကို distribute လုပ်ဖို့ ရည်ရွယ်ထားရင်တော့ ဒီ flag မလိုအပ်ပါဘူး။

### Module system သတ်မှတ်ခြင်း (Determining module system)

Node.js က TypeScript files တွေထဲမှာ [CommonJS][] ရော [ES Modules][] syntax နှစ်မျိုးလုံးကို support လုပ်ပါတယ်။ Node.js က module system တစ်ခုကနေ နောက်တစ်ခုဆီကို ပြောင်းပေးမှာ မဟုတ်ပါဘူး — သင့် code ကို ES module အနေနဲ့ run ချင်ရင် `import` နဲ့ `export` syntax တွေကို သုံးရပြီး — CommonJS အနေနဲ့ run ချင်ရင် `require` နဲ့ `module.exports` တွေကို သုံးရပါတယ်။

* `.ts` files တွေရဲ့ module system ကို [`.js` files တွေနဲ့ အတူတူ နည်းလမ်းအတိုင်း][the same way as `.js` files.] ဆုံးဖြတ်ပါတယ်။ `import` နဲ့ `export` syntax တွေ သုံးဖို့ — အနီးဆုံး parent `package.json` ထဲမှာ `"type": "module"` ကို ထည့်ပါ။
* `.mts` files တွေက `.mjs` files တွေလိုပဲ — အမြဲတမ်း ES modules အနေနဲ့ run ပါတယ်။
* `.cts` files တွေက `.cjs` files တွေလိုပဲ — အမြဲတမ်း CommonJS modules အနေနဲ့ run ပါတယ်။
* `.tsx` files တွေကိုတော့ support မလုပ်ပါဘူး။

JavaScript files တွေလိုပဲ — `import` statements တွေနဲ့ `import()` expressions တွေမှာ [file extensions တွေက မဖြစ်မနေ လိုအပ်][file extensions are mandatory] ပါတယ်: `import './file.ts'` — `import './file'` မဟုတ်ပါဘူး။ Backward compatibility ကြောင့် — `require()` calls တွေမှာလည်း file extensions တွေ မဖြစ်မနေ လိုအပ်ပါတယ်: `require('./file.ts')` — `require('./file')` မဟုတ်ပါဘူး။ ဒါက CommonJS files တွေထဲက `require` calls တွေမှာ `.cjs` extension မဖြစ်မနေ လိုအပ်သလိုမျိုးပါ။

`tsconfig.json` ရဲ့ `allowImportingTsExtensions` option က TypeScript compiler `tsc` ကို — `.ts` extension ပါတဲ့ `import` specifiers ပါတဲ့ files တွေကို type-check လုပ်ခွင့် ပေးပါလိမ့်မယ်။

### TypeScript features များ (TypeScript features)

Node.js က inline types တွေကိုပဲ ဖယ်ရှားတာမို့ — TypeScript syntax တွေကို JavaScript syntax အသစ်တွေနဲ့ _အစားထိုးခြင်း_ ပါဝင်တဲ့ TypeScript features တွေက error ဖြစ်ပါလိမ့်မယ်။

Transformation (ပုံစံပြောင်းလဲခြင်း) လိုအပ်တဲ့ အထင်ရှားဆုံး features တွေကတော့:

* `Enum` declarations
* `namespace` with runtime code
* parameter properties
* import aliases

Runtime code မပါဝင်တဲ့ `namespace` တွေကိုတော့ support လုပ်ပါတယ်။ ဒီဥပမာက မှန်မှန်ကန်ကန် အလုပ်လုပ်ပါလိမ့်မယ်:

```ts
// This namespace is exporting a type
namespace TypeOnly {
   export type A = string;
}
```

ဒါကတော့ [`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`][] error ကို ဖြစ်စေပါလိမ့်မယ်:

```ts
// This namespace is exporting a value
namespace A {
   export let x = 1
}
```

Decorators တွေက လောလောဆယ် [TC39 Stage 3 proposal](https://github.com/tc39/proposal-decorators) တစ်ခု ဖြစ်နေတာမို့ — ၎င်းတို့ကို transform မလုပ်ဘဲ parser error ကို ဖြစ်စေပါလိမ့်မယ်။ Node.js က polyfills တွေ ပံ့ပိုးမပေးတာမို့ — JavaScript မှာ native အနေနဲ့ support မဖြစ်မချင်း decorators တွေကို support လုပ်မှာ မဟုတ်ပါဘူး။

ထို့အပြင် — Node.js က `tsconfig.json` files တွေကို ဖတ်မပေးတဲ့အပြင် — `tsconfig.json` ထဲက settings တွေပေါ် မူတည်နေတဲ့ features တွေ — ဥပမာ paths (သို့) JavaScript syntax အသစ်တွေကို အဟောင်း standards တွေဆီ ပြောင်းပေးတာမျိုး — ကိုလည်း support မလုပ်ပါဘူး။

### `type` keyword မပါဘဲ types များ import လုပ်ခြင်း (Importing types without `type` keyword)

Type stripping ရဲ့ သဘောသဘာဝအရ — type imports တွေကို မှန်မှန်ကန်ကန် strip လုပ်ဖို့ `type` keyword က မဖြစ်မနေ လိုအပ်ပါတယ်။ `type` keyword မပါဘဲနဲ့ — Node.js က import ကို value import အနေနဲ့ သတ်မှတ်ပြီး — runtime error တစ်ခု ဖြစ်စေပါလိမ့်မယ်။ tsconfig ရဲ့ [`verbatimModuleSyntax`][] option ကို ဒီအပြုအမူနဲ့ ကိုက်ညီအောင် သုံးနိုင်ပါတယ်။

ဒီဥပမာက မှန်မှန်ကန်ကန် အလုပ်လုပ်ပါလိမ့်မယ်:

```ts
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```

ဒါကတော့ runtime error တစ်ခု ဖြစ်စေပါလိမ့်မယ်:

```ts
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```

### File မဟုတ်သော input ပုံစံများ (Non-file forms of input)

`--eval` နဲ့ STDIN အတွက် type stripping ကို enable လုပ်နိုင်ပါတယ်။ Module system ကို JavaScript မှာ လုပ်သလိုပဲ — `--input-type` နဲ့ ဆုံးဖြတ်ပါတယ်။

REPL, `--check`, နဲ့ `inspect` တွေမှာတော့ TypeScript syntax ကို support မလုပ်ပါဘူး။

### Source maps (source map များ)

Inline types တွေကို whitespace တွေနဲ့ အစားထိုးတာမို့ — stack traces တွေထဲက မှန်ကန်တဲ့ line numbers တွေအတွက် source maps တွေ မလိုအပ်ပါဘူး — Node.js က ၎င်းတို့ကို generate လည်း မလုပ်ပါဘူး။

### Dependencies များအတွင်း type stripping (Type stripping in dependencies)

Package authors တွေကို TypeScript နဲ့ ရေးထားတဲ့ packages တွေ publish မလုပ်ဖို့ တွန်းအားပေးဖို့အတွက် — Node.js က `node_modules` path အောက်က folders တွေထဲမှာ ရှိတဲ့ TypeScript files တွေကို ကိုင်တွယ်ဖို့ ငြင်းဆန်ပါတယ်။

### Paths aliases (path alias များ)

[`tsconfig` "paths"][] တွေကို transform လုပ်မှာ မဟုတ်တာမို့ — error တစ်ခု ဖြစ်စေပါတယ်။ ရရှိနိုင်တဲ့ အနီးစပ်ဆုံး feature ကတော့ [subpath imports][] ပါ — ၎င်းတို့က `#` နဲ့ စတင်ဖို့ လိုအပ်တဲ့ ကန့်သတ်ချက်တစ်ခု ရှိပါတယ်။

[CommonJS]: modules.md
[ES Modules]: esm.md
[Full TypeScript support]: #full-typescript-support
[`--no-strip-types`]: cli.md#--no-strip-types
[`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`]: errors.md#err_unsupported_typescript_syntax
[`tsconfig` "paths"]: https://www.typescriptlang.org/tsconfig/#paths
[`tsx`]: https://tsx.hirok.io/
[`verbatimModuleSyntax`]: https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax
[file extensions are mandatory]: esm.md#mandatory-file-extensions
[full support]: #full-typescript-support
[subpath imports]: packages.md#subpath-imports
[the same way as `.js` files.]: packages.md#determining-module-system
[type stripping]: #type-stripping
