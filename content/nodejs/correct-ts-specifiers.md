---
title: "TypeScript Specifiers များကို ပြုပြင်ခြင်း (Correct TypeScript Specifiers)"
description: "တကယ်တော့ TypeScript files တွေဆီ ညွှန်ပြနေတဲ့ import specifiers တွေမှာ သုံးထားတဲ့ .js extension ဟောင်းတွေကို .ts/.mts/.cts/.d.ts စသည်ဖြင့် ပြုပြင်ပေးတဲ့ codemod — Node.js လို standards-compliant software တွေနဲ့ run လို့ရအောင်"
order: 69
source: "https://nodejs.org/learn/userland-migrations/correct-ts-specifiers"
status: translated
updated: 2026-09-02
---

ဒီ codemod က import specifiers တွေကို — `tsc` (TypeScript ရဲ့ compiler) က source code ထဲမှာ `.js` file extensions တွေသုံးဖို့ အရင်က လိုအပ်ခဲ့တဲ့ ပုံစံကနေ — တကယ်တော့ TypeScript ဖြစ်နေတဲ့ files တွေကို ညွှန်ပြတဲ့ specifiers တွေအဖြစ် ပြောင်းလဲပေးပါတယ်။ ပြုပြင်ပြီးသား specifiers တွေက — source code ကို Node.js လို standards-compliant software တွေနဲ့ run လို့ရအောင် လုပ်ပေးပါတယ်။ ဒါက တစ်ခါလုပ်ရင် ပြီးတဲ့ (one-and-done) လုပ်ငန်းစဉ်တစ်ခုဖြစ်ပြီး — update လုပ်ထားတဲ့ source code ကို သင့် version control (ဥပမာ git) ထဲ commit လုပ်ထားသင့်ပါတယ်။ ဒါပြီးရင် — source code ရဲ့ import statements တွေကို ECMAScript (JavaScript) standard နဲ့ ကိုက်ညီအောင် ရေးသားသွားရမှာ ဖြစ်ပါတယ်။

ပံ့ပိုးထားတဲ့ (supported) ကိစ္စတွေ:

- file extension မပါတာ → `.cts`, `.mts`, `.js`, `.ts`, `.d.cts`, `.d.mts` (သို့) `.d.ts`
- `.cjs` → `.cts`, `.mjs` → `.mts`, `.js` → `.ts`
- `.js` → `.d.cts`, `.d.mts` (သို့) `.d.ts`
- [Package.json subpath imports](https://nodejs.org/api/packages.html#subpath-imports)
- [tsconfig paths](https://www.typescriptlang.org/tsconfig/#paths) ([`@nodejs-loaders/alias`](https://github.com/JakobJingleheimer/nodejs-loaders/blob/main/packages/alias?tab=readme-ov-file) ကတစ်ဆင့်)
  - ဒါပြီးမှ node နဲ့ run နိုင်ဖို့ဆိုရင် — ဒီ loader (ဒါမှမဟုတ် တခြား loader တစ်ခု) ကို သင့် project ထဲ ထည့်သွင်းဖို့ လိုပါမယ်။ ဒါမှမဟုတ် [subpath imports](https://nodejs.org/api/packages.html#subpath-imports) ဆီ ပြောင်းသုံးပါ။
- CommonJS နဲ့ ဆင်တူတဲ့ directory specifiers များ

## အသုံးပြုပုံ (Usage)

> **သတိထားရန်:** ဒါက သင့် source code ကို ပြောင်းလဲပစ်မှာ ဖြစ်ပါတယ်။ ဒီ package ကို run လုပ်ခင် — မသိမ်းရသေးတဲ့ (unsaved) အပြောင်းအလဲတွေကို commit လုပ်ထားပါ။

> **အရေးကြီး:** [`--experimental-import-meta-resolve`](https://nodejs.org/api/cli.html#--experimental-import-meta-resolve) ကို enable လုပ်ထားရမှာ ဖြစ်ပါတယ်။ ဒီ feature က တကယ်တော့ experimental မဟုတ်ပါဘူး — browsers တွေနဲ့ မသက်ဆိုင်လို့ nonstandard ဖြစ်နေတာပါ။

ဒီ codemod ကို ဒီလို run ပါ:

```sh
NODE_OPTIONS="--experimental-import-meta-resolve" \
  npx codemod @nodejs/correct-ts-specifiers
```

### Monorepos

အကောင်းဆုံး ရလဒ်ရဖို့ဆိုရင် — monorepo ထဲက workspace တစ်ခုချင်းစီရဲ့ *အတွင်းမှာ* run ပါ။

```text
project-root/
  ├ workspaces/
    ├ foo/ ←--------- RUN HERE
      ├ …
      ├ package.json
      └ tsconfig.json
    └ bar/ ←--------- RUN HERE
      ├ …
      ├ package.json
      └ tsconfig.json
  └ utils/ ←--------- RUN HERE
    ├ qux.js
    └ zed.js
```

## ဥပမာများ

Import specifiers တွေ ဘယ်လို ပြောင်းသွားလဲဆိုတာကို ဒီ diff မှာ ကြည့်ရအောင်:

```diff
 import { URL } from 'node:url';

 import { bar } from '@dep/bar';
 import { foo } from 'foo';

-import { Bird } from './Bird';
+import { Bird } from './Bird/index.ts';
 import { Cat } from './Cat.ts';
-import { Dog } from '…/Dog/index.mjs';
+import { Dog } from '…/Dog/index.mts';
 import { baseUrl } from '#config.js';
-import { qux } from './qux.js';
+import { qux } from './qux.js/index.ts';

-export { Zed } from './zed';
+export type { Zed } from './zed.d.ts';

-const nil = await import('./nil.js');
+const nil = await import('./nil.ts');
```

> **အကြံပြုချက်:** `tsc` ကို compile လုပ်ဖို့ သုံးသူတွေက [`rewriteRelativeImportExtensions`](https://www.typescriptlang.org/tsconfig/#rewriteRelativeImportExtensions) ကို enable လုပ်ဖို့ လိုပါလိမ့်မယ်။ `tsc` ကို type checking အတွက်ပဲ သုံးတဲ့သူတွေ (ဥပမာ `npm run test:types` လို lint/test step တစ်ခုကနေ) ကတော့ [`allowImportingTsExtensions`](https://www.typescriptlang.org/tsconfig/#allowImportingTsExtensions) လိုပါတယ် (နောက်ထပ် compile options တချို့လည်း လိုနိုင်တယ် — ကိုးကားထားတဲ့ documentation မှာ ကြည့်ပါ)။

## မှတ်ချက်များ (Notes)

ဒီ package က specifiers တွေထဲက file extensions တွေကို မျက်စိမှိတ် ရှာပြီး အစားထိုးလိုက်ရုံပဲ လုပ်တာ မဟုတ်ပါဘူး — အစားထိုးမယ့် specifier က တကယ်ရှိမရှိကို အတည်ပြုပါတယ်။ ရှင်းလင်းမှုမရှိတဲ့ (ambiguous) ကိစ္စတွေမှာ — (ဥပမာ နေရာတစ်ခုတည်းမှာ basename တူပြီး file extensions ချင်း မတူတဲ့ `/tmp/foo.js` နဲ့ `/tmp/foo.ts` လို files နှစ်ခု ရှိနေတာ) — error တစ်ခု log လုပ်ပြီး — အဲဒီ specifier ကို ကျော်ကာ — ကျန်တဲ့ လုပ်ငန်းစဉ်ကို ဆက်လုပ်ပါတယ်။

> **သတိထားရန်:** ဒီ package က imported modules တွေမှာ လိုချင်တဲ့ export(s) တွေ ပါဝင်တယ်ဆိုတာကိုတော့ အတည်ပြုမပေးပါဘူး။ ဒါက တကယ်တော့ ဘယ်တော့မှ ပြဿနာ မဖြစ်စေသင့်ပါဘူး — ambiguous ဖြစ်တဲ့ ကိစ္စတွေကို ကျော်သွားလို့ပါ (ဒါကြောင့် ပြဿနာရှိရင် အဲဒါက migration မစခင် ကတည်းက ရှိခဲ့တာပါ)။ Migration ပြီးတဲ့အခါ သင့် source code ကို run ကြည့်ရုံနဲ့ အဆင်ပြေမပြေ အတည်ပြုနိုင်ပါတယ် (ပြဿနာရှိရင် node က error တွေ ထုတ်ပြ ပြလိမ့်မယ်)။

> **အကြံပြုချက်:** Node.js က type imports တွေမှာ `type` keyword ပါဝင်ဖို့ လိုအပ်ပါတယ်။ ကိုယ်ပိုင် code အတွက်ဆိုရင် ဒီ package က အများအားဖြင့် အဲဒါကို စီစဉ်ပေးပါတယ်။ ဒါပေမယ့် — ကိစ္စတချို့နဲ့ node modules တွေအတွက်တော့ မလုပ်ပေးနိုင်ပါဘူး။ ဒါကို အလိုအလျောက် ပြုပြင်ပေးနိုင်တဲ့ ခိုင်မာတဲ့ tool တွေ ရှိပြီးသားပါ:
>
> - biome ကနေ [`use-import-type`](https://biomejs.dev/linter/rules/use-import-type/)
> - oxlint ကနေ [`typescript/no-import-type-side-effects`](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-import-type-side-effects)
> - typescript-eslint ကနေ [`consistent-type-imports`](https://typescript-eslint.io/rules/consistent-type-imports)
>
> သင့် source code မှာ အဲဒါ လိုအပ်ရင် — ဒီ codemod ကို အရင်ဆုံး run ပြီးမှ — အဲဒီ fixers တွေထဲက တစ်ခုကို run ပါ။

### ကန့်သတ်ချက်များ (Limitations)

လမ်းကြောင်း (path) တစ်ခုတည်းမှာ `.js` file ရော သက်ဆိုင်တဲ့ `.ts` file ရော နှစ်ခုလုံး ရှိနေရင် — codemod က specifier က ဘယ်ဟာကို ရည်ညွှန်းတယ်ဆိုတာ ဆုံးဖြတ်လို့ မရနိုင်ပါဘူး။ အဲဒီအခါ — error တစ်ခု log လုပ်ပြီး — specifier ကို မပြောင်းဘဲ ထားကာ — file ရဲ့ ကျန်တဲ့ အပိုင်းတွေကို ဆက်လုပ်ဆောင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Userland Migrations မိတ်ဆက်](/docs/nodejs/userland-migrations) — Node.js ရဲ့ official codemods များအကြောင်း
- [TypeScript Native အသုံးပြုခြင်း](/docs/nodejs/running-typescript-natively) — Node.js မှာ type stripping နဲ့ တိုက်ရိုက် run ခြင်း
