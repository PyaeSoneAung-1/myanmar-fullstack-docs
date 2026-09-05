---
title: "Modules: Choosing Compiler Options (Compiler Options ရွေးချယ်ခြင်း)"
description: "Modules series — app ရော library ရော ရေးသူတွေအတွက် module-related compiler options (module ၊ moduleResolution ၊ esModuleInterop စသည်) ရွေးချယ်နည်း လမ်းညွှန်"
order: 50
source: "https://www.typescriptlang.org/docs/handbook/modules/guides/choosing-compiler-options.html"
status: translated
updated: 2026-09-05
---

## I’m writing an app (App တစ်ခု ရေးနေသူများအတွက်)

tsconfig.json တစ်ခုတည်းက environment တစ်ခုတည်းကိုပဲ ကိုယ်စားပြုနိုင်ပါတယ် — ရရှိနိုင်တဲ့ globals တွေအရရော modules တွေ ဘယ်လို ပြုမူမယ်ဆိုတာနဲ့ ပတ်သက်ပြီးရော နှစ်မျိုးလုံးမှာ ဖြစ်ပါတယ်။ သင့် app ထဲမှာ server code ၊ DOM code ၊ web worker code ၊ test code နဲ့ ဒါတွေအားလုံး မျှဝေသုံးမယ့် code တွေ ပါနေမယ်ဆိုရင် — အဲဒီ code တစ်မျိုးစီအတွက် ကိုယ်ပိုင် tsconfig.json တစ်ခုစီ ထားရှိပြီး [project references](https://www.typescriptlang.org/docs/handbook/project-references.html#handbook-content) တွေနဲ့ ချိတ်ဆက်ထားသင့်ပါတယ်။ ပြီးရင် tsconfig.json တစ်ခုချင်းစီအတွက် ဒီ guide ကို တစ်ခါစီ သုံးပါ။ App တစ်ခုထဲမှာ ရှိတဲ့ library ပုံစံ project တွေ — အထူးသဖြင့် runtime environments အများကြီးမှာ run ဖို့ လိုအပ်တာမျိုး — အတွက်ကတော့ “[I’m writing a library](https://www.typescriptlang.org/docs/handbook/modules/guides)” section ကို သုံးပါ။

### I’m using a bundler (Bundler သုံးနေသူများအတွက်)

အောက်က settings တွေကို ကျင့်သုံးတာအပြင် — bundler projects တွေမှာ `{ "type": "module" }` ကို set လုပ်တာ ဒါမှမဟုတ် `.mts` files တွေ သုံးတာကို လောလောဆယ် _မလုပ်ဖို့_ အကြံပြုထားပါတယ်။ [bundlers တချို့](https://andrewbranch.github.io/interop-test/#synthesizing-default-exports-for-cjs-modules) က ဒီလိုအခြေအနေတွေမှာ မတူညီတဲ့ ESM/CJS interop အပြုအမူတွေကို ကျင့်သုံးတတ်ပြီး — TypeScript က အဲဒါတွေကို `"moduleResolution": "bundler"` နဲ့ လောလောဆယ် analyze လုပ်လို့ မရပါဘူး။ အသေးစိတ်ကို [issue #54102](https://github.com/microsoft/TypeScript/issues/54102) မှာ ကြည့်ရှုနိုင်ပါတယ်။

```json5
{
  "compilerOptions": {
    // This is not a complete template; it only
    // shows relevant module-related settings.
    // Be sure to set other important options
    // like `target`, `lib`, and `strict`.

    // Required
    "module": "esnext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,

    // Consult your bundler’s documentation
    "customConditions": ["module"],

    // Recommended
    "noEmit": true, // or `emitDeclarationOnly`
    "allowImportingTsExtensions": true,
    "allowArbitraryExtensions": true,
    "verbatimModuleSyntax": true, // or `isolatedModules`
  }
}
```

### I’m compiling and running the outputs in Node.js (Node.js မှာ compile ပြီး run လုပ်နေသူများအတွက်)

ES modules တွေကို emit လုပ်ဖို့ ရည်ရွယ်ထားရင် `"type": "module"` ကို set လုပ်တာ ဒါမှမဟုတ် `.mts` files တွေ သုံးတာကို သတိရပါ။

```json5
{
  "compilerOptions": {
    // This is not a complete template; it only
    // shows relevant module-related settings.
    // Be sure to set other important options
    // like `target`, `lib`, and `strict`.

    // Required
    "module": "nodenext",

    // Implied by `"module": "nodenext"`:
    // "moduleResolution": "nodenext",
    // "esModuleInterop": true,
    // "target": "esnext",

    // Recommended
    "verbatimModuleSyntax": true,
  }
}
```

### I’m using ts-node (ts-node သုံးနေသူများအတွက်)

ts-node က [Node.js မှာ JS outputs တွေကို compile ပြီး run လုပ်ခြင်း](https://www.typescriptlang.org/docs/handbook/modules/guides) အတွက် သုံးလို့ရတဲ့ code မျိုးနဲ့ tsconfig.json settings မျိုးတွေနဲ့ပဲ compatible ဖြစ်အောင် ကြိုးစားပါတယ်။ အသေးစိတ်ကို [ts-node documentation](https://typestrong.org/ts-node/) မှာ ကြည့်ရှုနိုင်ပါတယ်။

### I’m using tsx (tsx သုံးနေသူများအတွက်)

ts-node က default အားဖြင့် Node.js ရဲ့ module system ကို အနည်းငယ်သာ ပြုပြင်မွမ်းမံတာနဲ့ မတူဘဲ — [tsx](https://github.com/esbuild-kit/tsx) က bundler တစ်ခုလိုပဲ ပြုမူပြီး — extensionless/index module specifiers တွေနဲ့ ESM ၊ CJS နှစ်မျိုးလုံးကို လွတ်လပ်စွာ ရောနှောသုံးတာမျိုးတွေကို ခွင့်ပြုပါတယ်။ tsx အတွက်လည်း [bundler တစ်ခုအတွက် သုံးမယ့်ပုံစံ](https://www.typescriptlang.org/docs/handbook/modules/guides) အတိုင်း settings တွေကိုပဲ သုံးပါ။

### I’m writing ES modules for the browser, with no bundler or module compiler (Bundler ရော module compiler ရော မသုံးဘဲ browser အတွက် ES modules ရေးနေသူများအတွက်)

TypeScript မှာ ဒီအခြေအနေမျိုးအတွက် သီးသန့် options တွေ လောလောဆယ် မရှိသေးပေမယ့် — `nodenext` ရဲ့ ESM module resolution algorithm ကို `paths` နဲ့ တွဲသုံးပြီး — URL တွေနဲ့ import maps တွေရဲ့ ထောက်ပံ့မှုနေရာမှာ အစားထိုးအနေနဲ့ အနီးစပ်ဆုံး ပုံဖော်နိုင်ပါတယ်။

```json5
// tsconfig.json
{
  "compilerOptions": {
    // This is not a complete template; it only
    // shows relevant module-related settings.
    // Be sure to set other important options
    // like `target`, `lib`, and `strict`.

    // Combined with `"type": "module"` in a local package.json,
    // this enforces including file extensions on relative path imports.
    "module": "nodenext",
    "paths": {
      // Point TS to local types for remote URLs:
      "https://esm.sh/lodash@4.17.21": ["./node_modules/@types/lodash/index.d.ts"],
      // Optional: point bare specifier imports to an empty file
      // to prohibit importing from node_modules specifiers not listed here:
      "*": ["./empty-file.ts"]
    }
  }
}
```

ဒီ setup က — စာရင်းထဲမှာ အတိအကျ ဖော်ပြထားတဲ့ HTTPS imports တွေကို စက်ထဲမှာ ထည့်သွင်းထားတဲ့ type declaration files တွေကို သုံးခွင့်ပေးပြီး — node_modules ထဲမှာ ပုံမှန် resolve ဖြစ်လေ့ရှိတဲ့ imports တွေကိုတော့ error တက်စေပါတယ်:

```ts
import {} from "lodash";
//             ^^^^^^^^
// File '/project/empty-file.ts' is not a module. ts(2306)
```

တစ်နည်းအနေနဲ့ — [import maps](https://github.com/WICG/import-maps) ကို သုံးပြီး browser ထဲမှာ bare specifiers စာရင်းတစ်ခုကို URLs တွေဆီ အတိအကျ မြေပုံဆွဲထားနိုင်ပါတယ် — `nodenext` ရဲ့ default node_modules lookups တွေကို အားကိုးတာ ဒါမှမဟုတ် အဲဒီ bare specifier imports တွေအတွက် type declaration files တွေဆီ TypeScript ကို ညွှန်ပေးဖို့ `paths` ကို သုံးတာတွေနဲ့ တွဲဖက်ပြီး သုံးနိုင်ပါတယ်:

```html
<script type="importmap">
{
  "imports": {
    "lodash": "https://esm.sh/lodash@4.17.21"
  }
}
</script>
```

```ts
import {} from "lodash";
// Browser: https://esm.sh/lodash@4.17.21
// TypeScript: ./node_modules/@types/lodash/index.d.ts
```

## I’m writing a library (Library တစ်ခု ရေးနေသူများအတွက်)

Library author တစ်ယောက်အနေနဲ့ compilation settings တွေ ရွေးချယ်ခြင်းက — app author တစ်ယောက်အနေနဲ့ ရွေးချယ်ခြင်းနဲ့ အခြေခံအားဖြင့် မတူညီတဲ့ လုပ်ငန်းစဉ်တစ်ခုပါ။ App တစ်ခု ရေးတဲ့အခါ — runtime environment ဒါမှမဟုတ် bundler ကို ထင်ဟပ်စေမယ့် settings တွေကို ရွေးချယ်ပါတယ် — ပုံမှန်အားဖြင့် အပြုအမူကို သိပြီးသား entity တစ်ခုတည်းပါ။ Library တစ်ခု ရေးတဲ့အခါမှာတော့ — ဖြစ်နိုင်ရင် — library consumer တွေရဲ့ compilation settings _အားလုံးအောက်မှာ_ သင့် code ကို check လုပ်သင့်ပါတယ်။ ဒါက လက်တွေ့မကျလှတာမို့ — အဲဒီအစား တတ်နိုင်သမျှ strictest ဖြစ်တဲ့ settings တွေကို သုံးနိုင်ပါတယ် — အဲဒါတွေကို ကျေနပ်လောက်အောင် လုပ်နိုင်ရင် — ကျန်တဲ့ settings အားလုံးကိုပါ ကျေနပ်အောင် လုပ်နိုင်လေ့ ရှိလို့ပါ။

```json5
{
  "compilerOptions": {
    "module": "node18",
    "target": "es2020", // set to the *lowest* target you support
    "strict": true,
    "verbatimModuleSyntax": true,
    "declaration": true,
    "sourceMap": true,
    "declarationMap": true,
    "rootDir": "src",
    "outDir": "dist"
  }
}
```

ဒီ settings တစ်ခုချင်းစီကို ဘာကြောင့် ရွေးခဲ့လဲ ဆန်းစစ်ကြည့်ရအောင်:

- **`module: "node18"`**. Codebase တစ်ခုက Node.js ရဲ့ module system နဲ့ compatible ဖြစ်နေရင် — bundlers တွေမှာလည်း အမြဲလိုလို အလုပ်လုပ်တတ်ပါတယ်။ ESM outputs တွေကို emit လုပ်ဖို့ third-party emitter တစ်ခု သုံးနေတယ်ဆိုရင် — TypeScript က သင့် code ကို ESM အနေနဲ့ check လုပ်နိုင်ဖို့ package.json ထဲမှာ `"type": "module"` ကို set လုပ်ထားဖို့ သေချာပါစေ — Node.js မှာ CommonJS ထက် ပိုတင်းကျပ်တဲ့ module resolution algorithm ကို သုံးတာမို့ပါ။ ဥပမာအနေနဲ့ — library တစ်ခုက `"moduleResolution": "bundler"` နဲ့ compile လုပ်ရင် ဘာဖြစ်မလဲ ကြည့်ရအောင်:

  ```ts
  export * from "./utils";
  ```

  `./utils.ts` (ဒါမှမဟုတ် `./utils/index.ts`) ရှိနေတယ်ဆိုရင် — bundler တစ်ခုအတွက် ဒီ code က အဆင်ပြေတာမို့ `"moduleResolution": "bundler"` က ဘာမှ မပြောပါဘူး။ `"module": "esnext"` နဲ့ compile လုပ်မယ်ဆိုရင် — ဒီ export statement အတွက် output JavaScript က input နဲ့ အတိအကျ တူနေမှာ ဖြစ်ပါတယ်။ အဲဒီ JavaScript ကို npm ပေါ် publish လုပ်လိုက်ရင် — bundler သုံးတဲ့ projects တွေမှာ သုံးလို့ရမှာ ဖြစ်ပေမယ့် — Node.js မှာ run လိုက်တဲ့အခါ error တက်စေမှာ ဖြစ်ပါတယ်:

  ```
  Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../node_modules/dependency/utils' imported from .../node_modules/dependency/index.js
  Did you mean to import ./utils.js?
  ```

  တစ်ဖက်မှာတော့ — ဒီလို ရေးခဲ့မယ်ဆိုရင်:

  ```ts
  export * from "./utils.js";
  ```

  ဒီလိုဆို ထွက်လာတဲ့ output က Node.js ရော bundlers တွေမှာပါ _နှစ်ခုလုံးမှာ_ အလုပ်လုပ်ပါတယ်။

  အတိုချုပ်ပြောရရင် — `"moduleResolution": "bundler"` က infectious (ကူးစက်တတ်) ဖြစ်ပြီး — bundlers တွေထဲမှာပဲ အလုပ်လုပ်နိုင်တဲ့ code တွေ ထုတ်လုပ်မိနိုင်စေပါတယ်။ အလားတူပဲ — `"moduleResolution": "nodenext"` က output က Node.js မှာ အလုပ်လုပ်လားဆိုတာကိုပဲ စစ်ဆေးပေးပေမယ့် — ကိစ္စအများစုမှာ Node.js မှာ အလုပ်လုပ်တဲ့ module code က တခြား runtimes တွေရော bundlers တွေမှာပါ အလုပ်လုပ်နိုင်ပါတယ်။
- **``target: "es2020"``**. ဒီ value ကို — သင်ထောက်ပံ့ပေးဖို့ ရည်ရွယ်ထားတဲ့ _အနိမ့်ဆုံး_ ECMAScript version အဖြစ် သတ်မှတ်ထားခြင်းက — emit လုပ်လိုက်တဲ့ code ထဲမှာ နောက်ပိုင်း version တွေမှာ စတင်မိတ်ဆက်ခဲ့တဲ့ language features တွေ မပါဝင်စေဖို့ သေချာစေပါတယ်။ `target` က `lib` အတွက် သက်ဆိုင်တဲ့ value တစ်ခုကိုပါ ဆက်စပ်ပါဝင်စေတာမို့ — environment အဟောင်းတွေမှာ မရနိုင်တဲ့ globals တွေကို သင် ဝင်ရောက်သုံးစွဲမိတာမျိုး မဖြစ်စေဖို့လည်း သေချာစေပါတယ်။
- **`strict: true`**. ဒါမရှိရင် — သင့် output `.d.ts` files တွေထဲ ရောက်သွားပြီး — consumer တစ်ယောက်က `strict` enable လုပ်ပြီး compile လုပ်တဲ့အခါ error တက်စေမယ့် type-level code တွေကို ရေးမိနိုင်ပါတယ်။ ဥပမာ — ဒီ `extends` clause က:
  ```ts
  export interface Super {
    foo: string;
  }
  export interface Sub extends Super {
    foo: string | undefined;
  }
  ```
  `strictNullChecks` အောက်မှာမှပဲ error ဖြစ်တာပါ။ တစ်ဖက်မှာတော့ — `strict` ကို _disable_ လုပ်ထားမှပဲ error ဖြစ်စေတဲ့ code ရေးဖို့က အရမ်း ခက်ခဲတာမို့ — libraries တွေအတွက် `strict` နဲ့ compile လုပ်ဖို့ အထူးပင် အကြံပြုလိုပါတယ်။
- **`verbatimModuleSyntax: true`**. ဒီ setting က — library consumers တွေအတွက် ပြဿနာတွေ ဖြစ်စေနိုင်တဲ့ module-related pitfalls (ချောက်ချားစရာများ) တချို့ကနေ ကာကွယ်ပေးပါတယ်။ ပထမအချက် — သုံးစွဲသူရဲ့ `esModuleInterop` ဒါမှမဟုတ် `allowSyntheticDefaultImports` value ပေါ် မူတည်ပြီး ရှုပ်ထွေးစွာ အဓိပ္ပာယ်ကောက်လို့ရမယ့် import statements တွေ ရေးသားခြင်းကို တားဆီးပေးပါတယ်။ အရင်တုန်းက — libraries တွေက `esModuleInterop` မပါဘဲ compile လုပ်ဖို့ မကြာခဏ အကြံပြုခဲ့ကြပါတယ် — libraries တွေထဲမှာ သုံးထားရင် users တွေကိုပါ အဲဒါကို လိုက်နာကျင့်သုံးစေရတာမျိုး ဖြစ်နိုင်လို့ပါ။ ဒါပေမယ့် — `esModuleInterop` _မပါဘဲ_ မှပဲ အလုပ်လုပ်တဲ့ imports တွေလည်း ရေးလို့ရတာမို့ — ဒီ setting ရဲ့ value ဘယ်လိုပဲ ထားထား libraries တွေအတွက် portability (သယ်ဆောင်သုံးစွဲနိုင်မှု) ကို အာမခံပေးနိုင်တာ မဟုတ်ပါဘူး။ `verbatimModuleSyntax` ကတော့ အဲဒီလို အာမခံချက်ကို တကယ် ပေးစွမ်းနိုင်ပါတယ်.[^1] ဒုတိယအချက် — CommonJS အဖြစ် emit လုပ်မယ့် modules တွေထဲမှာ `export default` သုံးခြင်းကို တားဆီးပေးပါတယ် — အဲဒါက bundler users တွေရော Node.js ESM users တွေရော module ကို မတူညီတဲ့ နည်းလမ်းတွေနဲ့ စားသုံးကြရမယ့် အခြေအနေ ဖြစ်စေနိုင်လို့ပါ။ အသေးစိတ်ကို [ESM/CJS Interop](/docs/typescript/modules-esm-cjs-interop) appendix မှာ ကြည့်ရှုနိုင်ပါတယ်။
- **`declaration: true`** က output JavaScript တွေနဲ့အတူ type declaration files တွေကို emit လုပ်ပေးပါတယ်။ Library ရဲ့ consumers တွေ type information တစ်စုံတစ်ရာ ရရှိနိုင်ဖို့ ဒါ လိုအပ်ပါတယ်။
- **`sourceMap: true`** နဲ့ **`declarationMap: true`** တို့က output JavaScript နဲ့ type declaration files တွေအတွက် source maps တွေကို အသီးသီး emit လုပ်ပေးပါတယ်။ Library က သူ့ရဲ့ source (`.ts`) files တွေကိုပါ တွဲဖြန့်ဝေမှသာ ဒါတွေက အသုံးဝင်ပါတယ်။ Source maps ရော source files တွေပါ ဖြန့်ဝေထားခြင်းအားဖြင့် — library ရဲ့ consumers တွေ library code ကို ပိုလွယ်ကူစွာ debug လုပ်နိုင်မှာ ဖြစ်ပြီး — declaration maps ရော source files တွေပါ ဖြန့်ဝေထားခြင်းအားဖြင့် — libraries တွေကနေ imports တွေအပေါ် Go To Definition လုပ်တဲ့အခါ မူရင်း TypeScript sources တွေကို မြင်တွေ့နိုင်မှာ ဖြစ်ပါတယ်။ ဒီနှစ်ခုလုံးက developer experience နဲ့ library size ကြားက tradeoff (အပြန်အလှန် ပေးဆပ်မှု) တစ်ခုကို ကိုယ်စားပြုတာမို့ — ထည့်သွင်းမထည့်သွင်း ဆုံးဖြတ်ရတာက သင့်အပေါ်မှာ မူတည်ပါတယ်။
- **`rootDir: "src"`** နဲ့ **`outDir: "dist"`** တို့ပါ။ သီးခြား output directory တစ်ခု သုံးခြင်းက အမြဲတမ်း ကောင်းမွန်တဲ့ အလေ့အကျင့်တစ်ခုပါ — ဒါပေမယ့် သူတို့ရဲ့ input files တွေကို publish လုပ်တဲ့ libraries တွေအတွက်တော့ ဒါက _မဖြစ်မနေ_ လိုအပ်ပါတယ်။ မလုပ်ထားရင် — [extension substitution (extension အစားထိုးခြင်း)](/docs/typescript/modules-reference) ကြောင့် library ရဲ့ consumers တွေက `.d.ts` files တွေအစား library ရဲ့ `.ts` files တွေကို load မိသွားပြီး — type errors တွေရော performance ပြဿနာတွေပါ ဖြစ်စေနိုင်လို့ပါ။

### Considerations for bundling libraries (Libraries တွေကို bundling လုပ်ခြင်းအတွက် ထည့်သွင်းစဉ်းစားစရာများ)

သင့် library ကို emit လုပ်ဖို့ bundler တစ်ခု သုံးနေတယ်ဆိုရင် — သင့်ရဲ့ (externalize မလုပ်ထားတဲ့) imports တွေ အားလုံးကို — သုံးစွဲသူတွေရဲ့ မသိနိုင်တဲ့ environments တွေက မဟုတ်ဘဲ — bundler က သိပြီးသား အပြုအမူတွေနဲ့ process လုပ်သွားမှာ ဖြစ်ပါတယ်။ ဒီကိစ္စမှာ — `"module": "esnext"` နဲ့ `"moduleResolution": "bundler"` ကို သုံးလို့ရပေမယ့် — သတိထားရမယ့် အချက်နှစ်ချက် ရှိပါတယ်:

1. TypeScript က — files တချို့ကို bundled လုပ်ပြီး တချို့ကို externalized လုပ်တဲ့အခါ module resolution ကို model လုပ်နိုင်စွမ်း မရှိပါဘူး။ Dependencies တွေပါတဲ့ libraries တွေကို bundling လုပ်တဲ့အခါ — first-party library source code ကို ဖိုင်တစ်ခုတည်းထဲ ပေါင်းထည့်ပြီး — external dependencies တွေရဲ့ imports တွေကိုတော့ bundled output ထဲမှာ တကယ့် imports အဖြစ် ချန်ထားတာ ပုံမှန် ဖြစ်ပါတယ်။ ဒါက အခြေခံအားဖြင့် — module resolution က bundler ရော end user ရဲ့ environment ကြားမှာ ခွဲခြမ်းထားသလို ဖြစ်နေတယ်လို့ ဆိုလိုပါတယ်။ ဒါကို TypeScript မှာ model လုပ်ဖို့ဆိုရင် — bundled imports တွေကို `"moduleResolution": "bundler"` နဲ့ ရော externalized imports တွေကို `"moduleResolution": "nodenext"` နဲ့ပါ process လုပ်ချင်လိမ့်မယ် (ဒါမှမဟုတ် — end-user environments အမျိုးမျိုးမှာ အကုန်အလုပ်ဖြစ်မဖြစ် စစ်ဆေးဖို့ options အများကြီးနဲ့)။ ဒါပေမယ့် TypeScript ကို compilation တစ်ခုတည်းထဲမှာ module resolution settings နှစ်မျိုး သုံးဖို့ configure လုပ်လို့ မရပါဘူး။ အကျိုးဆက်အနေနဲ့ — `"moduleResolution": "bundler"` သုံးခြင်းက bundler တစ်ခုမှာ အလုပ်လုပ်ပေမယ့် Node.js မှာ မလုံခြုံတဲ့ externalized dependencies imports တွေကို ခွင့်ပြုမိနိုင်ပါတယ်။ တစ်ဖက်မှာ — `"moduleResolution": "nodenext"` သုံးခြင်းက bundled imports တွေအပေါ် မလိုအပ်ဘဲ တင်းကျပ်လွန်းတဲ့ လိုအပ်ချက်တွေ ချမှတ်မိနိုင်ပါတယ်။
2. သင့်ရဲ့ declaration files တွေကိုပါ bundling လုပ်ဖို့ သေချာစေရပါမယ်။ Declaration files တွေရဲ့ [ပထမဆုံး စည်းမျဉ်း](/docs/typescript/modules-theory) ကို ပြန်သတိရပါ: declaration file တိုင်းက JavaScript file တစ်ခုတည်းကိုပဲ ကိုယ်စားပြုရပါတယ်။ `"moduleResolution": "bundler"` ကို သုံးပြီး ESM bundle တစ်ခုကို bundler နဲ့ emit လုပ်နေချိန်မှာ `tsc` နဲ့ declaration files အများကြီးကို emit လုပ်နေတယ်ဆိုရင် — သင့်ရဲ့ declaration files တွေက `"module": "nodenext"` အောက်မှာ consume လုပ်တဲ့အခါ errors တွေ ဖြစ်စေနိုင်ပါတယ်။ ဥပမာ — ဒီလို input file တစ်ခုက:

   ```ts
   import { Component } from "./extensionless-relative-import";
   ```

   JS bundler က သူ့ရဲ့ import ကို ဖျက်ပစ်မှာ ဖြစ်ပေမယ့် — declaration file တစ်ခုထဲမှာတော့ import statement က အတိအကျ ပုံတူ ပါဝင်နေမှာ ဖြစ်ပါတယ်။ ဒါပေမယ့် — အဲဒီ import statement ထဲက module specifier က Node.js မှာ — file extension မပါတာမို့ — invalid (မမှန်ကန်တဲ့) တစ်ခု ဖြစ်နေပါလိမ့်မယ်။ Node.js users တွေအတွက်ဆိုရင် — TypeScript က declaration file အပေါ်မှာ error တက်စေပြီး — dependency က runtime မှာ crash ဖြစ်မယ်လို့ ယူဆကာ — `Component` ကို ရည်ညွှန်းတဲ့ types တွေကို `any` နဲ့ infect (ကူးစက်) လုပ်ပါလိမ့်မယ်။

   သင့် TypeScript bundler က bundled declaration files တွေ ထုတ်ပေးမှု မရှိဘူးဆိုရင် — သင့် declaration files တွေထဲမှာ ထိန်းသိမ်းထားတဲ့ imports တွေက end users တွေရဲ့ TypeScript settings တွေနဲ့ compatible ဖြစ်စေဖို့ `"moduleResolution": "nodenext"` ကို သုံးပါ။ ပိုကောင်းတာက — သင့် library ကို bundling မလုပ်တော့ဘူးလို့တောင် စဉ်းစားကြည့်ပါ။

### Notes on dual-emit solutions (Dual-emit ဖြေရှင်းနည်းများဆိုင်ရာ မှတ်စုများ)

TypeScript compilation တစ်ခုတည်း (emit လုပ်သည်ဖြစ်စေ type checking သက်သက် ဖြစ်စေ) က input file တစ်ခုစီကနေ output file တစ်ခုတည်းပဲ ထွက်လာမယ်လို့ ယူဆပါတယ်။ `tsc` က ဘာမှ emit မလုပ်နေရင်တောင် — imported names တွေအပေါ် သူလုပ်ဆောင်တဲ့ type checking က — tsconfig.json ထဲမှာ သတ်မှတ်ထားတဲ့ module- နဲ့ emit-related options တွေကို အခြေခံပြီး — output file က runtime မှာ ဘယ်လို ပြုမူမယ်ဆိုတဲ့ အသိပညာအပေါ် မှီခိုနေပါတယ်။ Third-party emitters တွေက — `tsc` ကို တခြား emitter က ဘာတွေ emit လုပ်မယ်ဆိုတာ နားလည်အောင် configure လုပ်ထားနိုင်သရွေ့ — `tsc` type checking နဲ့ တွဲသုံးရတာ ယေဘုယျအားဖြင့် အန္တရာယ်ကင်းပေမယ့် — module formats မတူညီတဲ့ output အစုနှစ်စုကို emit လုပ်ပြီး type checking ကိုတော့ တစ်ခါပဲ လုပ်တဲ့ ဖြေရှင်းနည်းတိုင်းက output တစ်ခုကို (အနည်းဆုံး) check မလုပ်ရဘဲ ချန်ထားခဲ့ပါတယ်။ External dependencies တွေက CommonJS နဲ့ ESM consumers တွေကို မတူညီတဲ့ APIs တွေ ထုတ်ဖော်ပြနိုင်တာမို့ — compilation တစ်ခုတည်းထဲမှာ output နှစ်ခုလုံး type-safe ဖြစ်တယ်လို့ အာမခံနိုင်တဲ့ configuration ဆိုတာ မရှိပါဘူး။ လက်တွေ့မှာတော့ — dependencies အများစုက best practices တွေကို လိုက်နာကြပြီး — dual-emit outputs တွေ အလုပ်ဖြစ်ကြပါတယ်။ Publish မလုပ်ခင် output bundles အားလုံးကို tests တွေရော [static analysis](https://npmjs.com/package/@arethetypeswrong/cli) ရော run လုပ်ထားခြင်းက — ပြင်းထန်တဲ့ ပြဿနာတစ်ခု သတိမထားမိဘဲ လွတ်သွားနိုင်ခြေကို သိသိသာသာ လျှော့ချပေးပါတယ်။

[^1]: `verbatimModuleSyntax` က — JS emitter က `tsc` က tsconfig.json ၊ source file extension ၊ package.json ရဲ့ `"type"` တို့ကို ကြည့်ပြီး emit လုပ်မယ့် module kind အတိုင်းပဲ emit လုပ်မှသာ အလုပ်လုပ်နိုင်ပါတယ်။ ဒီ option က — ရေးထားတဲ့ `import`/`require` နဲ့ emit လုပ်လိုက်တဲ့ `import`/`require` တွေ ထပ်တူညီနေအောင် အတင်းအကျပ် လုပ်ဆောင်ခြင်းအားဖြင့် အလုပ်လုပ်ပါတယ်။ Source file တစ်ခုတည်းကနေ ESM output ရော CJS output ရော နှစ်ခုလုံး ထွက်စေတဲ့ configuration တိုင်းက `verbatimModuleSyntax` နဲ့ အခြေခံအားဖြင့် မလိုက်ဖက်ပါဘူး — သူ့ရဲ့ ရည်ရွယ်ချက်တစ်ခုလုံးက — `require` တစ်ခု emit လုပ်မယ့်နေရာမှာ `import` ရေးမိတာမျိုး မဖြစ်အောင် တားဆီးဖို့ ဖြစ်လို့ပါ။ `verbatimModuleSyntax` ကို — third-party emitter တစ်ခုကို `tsc` နဲ့ မတူညီတဲ့ module kind emit လုပ်ဖို့ configure လုပ်ခြင်းအားဖြင့်လည်း ပျက်ပြယ်စေနိုင်ပါတယ် — ဥပမာ — tsconfig.json ထဲမှာ `"module": "esnext"` ကို set လုပ်ထားချိန်မှာ Babel ကို CommonJS emit လုပ်ဖို့ configure လုပ်ထားတာမျိုးပါ။
