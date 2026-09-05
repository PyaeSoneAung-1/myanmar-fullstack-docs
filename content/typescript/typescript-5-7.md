---
title: "TypeScript 5.7 (TypeScript 5.7 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 5.7 ရဲ့ ထုတ်ပြန်မှုမှတ်စု — never-initialized variables စစ်ဆေးမှု, `--rewriteRelativeImportExtensions`, `--target es2024`/`--lib es2024`, ancestor tsconfig ရှာဖွေမှု, composite project ownership checks, JSON import validation, V8 compile caching နဲ့ notable behavioral changes အကြောင်း"
order: 97
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html"
status: translated
updated: 2026-09-05
---

## Checks for Never-Initialized Variables (Never-Initialized Variable များအတွက် စစ်ဆေးမှုများ)

ကာလကြာမြင့်စွာကတည်းက — variable တစ်ခုက ယခင် branches တွေ အားလုံးထဲမှာ initialized မဖြစ်သေးတဲ့အခါ — ဖြစ်ပေါ်လာနိုင်တဲ့ ပြဿနာတွေကို TypeScript က ဖမ်းမိနိုင်ခဲ့ပါတယ်။

```ts
let result: number
if (someCondition()) {
    result = doSomeWork();
}
else {
    let temporaryWork = doSomeWork();
    temporaryWork *= 2;
    // forgot to assign to 'result'
}

console.log(result); // error: Variable 'result' is used before being assigned.
```

ကံမကောင်းစရာက — ဒီ analysis အလုပ်မလုပ်တဲ့ နေရာတစ်ချို့ ရှိပါတယ်။
ဥပမာ — variable တစ်ခုကို သီးခြား function တစ်ခုထဲမှာ ဝင်ရောက်အသုံးပြုနေရင် — function ကို ဘယ်အချိန် ခေါ်မယ်ဆိုတာ type system က မသိနိုင်တာမို့ — variable က initialized ဖြစ်သွားမယ်ဆိုတဲ့ "အကောင်းမြင်တဲ့" (optimistic) အမြင်တစ်ခုကို ယူလိုက်ပါတယ်။

```ts
function foo() {
    let result: number
    if (someCondition()) {
        result = doSomeWork();
    }
    else {
        let temporaryWork = doSomeWork();
        temporaryWork *= 2;
        // forgot to assign to 'result'
    }

    printResult();

    function printResult() {
        console.log(result); // no error here.
    }
}
```

TypeScript 5.7 က *ဖြစ်နိုင်ခြေရှိ*ပြီး initialized ဖြစ်နေတဲ့ variables တွေအပေါ်မှာတော့ ဆက်ပြီး လျော့ပေါ့ထားပေမယ့် — variables တွေက *လုံးဝ* initialized မဖြစ်သေးတဲ့အခါ — type system က errors တွေကို သတင်းပို့နိုင်ပါပြီ။

```ts
function foo() {
    let result: number
    
    // do work, but forget to assign to 'result'

    function printResult() {
        console.log(result); // error: Variable 'result' is used before being assigned.
    }
}
```

ဒီ [ပြောင်းလဲမှု](https://github.com/microsoft/TypeScript/pull/55887) ကို GitHub user [Zzzen](https://github.com/Zzzen) ရဲ့ အလုပ်အတွက် ကျေးဇူးတင်စွာဖြင့် ပံ့ပိုးနိုင်ခဲ့ပါတယ်!

## Path Rewriting for Relative Paths (Relative Paths များအတွက် Path Rewriting)

TypeScript code တွေကို "in-place" အနေနဲ့ run လုပ်ခွင့်ပြုတဲ့ tools နဲ့ runtimes အများအပြား ရှိပါတယ် — ဆိုလိုတာက output JavaScript files တွေ ထုတ်ပေးတဲ့ build step တစ်ခု မလိုအပ်ဘူးလို့ ဆိုလိုတာပါ။
ဥပမာ — ts-node, tsx, Deno နဲ့ Bun တွေက `.ts` files တွေကို တိုက်ရိုက် run လုပ်တာကို အားလုံး ပံ့ပိုးပါတယ်။
မကြာသေးခင်ကတော့ — Node.js က `--experimental-strip-types` (မကြာခင် unflag လုပ်တော့မယ့်!) နဲ့ `--experimental-transform-types` တွေနဲ့ အဲဒီလို ပံ့ပိုးမှုမျိုးကို စူးစမ်းနေပါတယ်။
ဒါက အလွန် အဆင်ပြေပါတယ် — build task တစ်ခုကို ပြန်ပြန် run စရာမလိုဘဲ ပိုမြန်မြန် iterate လုပ်နိုင်လို့ပါ။

ဒါပေမယ့် ဒီ modes တွေကို သုံးတဲ့အခါ သတိထားရမယ့် ရှုပ်ထွေးမှုတစ်ချို့ ရှိပါတယ်။
ဒီ tools တွေ အားလုံးနဲ့ အမြင့်ဆုံး သဟဇာတဖြစ်ဖို့ — "in-place" အနေနဲ့ import လုပ်ခံရတဲ့ TypeScript file တစ်ခုကို runtime မှာ သင့်လျော်တဲ့ TypeScript extension နဲ့ **ဖြစ်ရပါမယ်**။
ဥပမာ — `foo.ts` လို့ခေါ်တဲ့ file တစ်ခုကို import လုပ်ဖို့ — Node ရဲ့ experimental support အသစ်ထဲမှာ အောက်ပါအတိုင်း ရေးရပါတယ်:

```ts
// main.ts

import * as foo from "./foo.ts"; // <- we need foo.ts here, not foo.js
```

ပုံမှန်အားဖြင့် — ဒီလိုလုပ်ရင် TypeScript က error တစ်ခု ထုတ်ပေးပါလိမ့်မယ် — ၎င်းက *output file* ကို import လုပ်ဖို့ မျှော်လင့်ထားလို့ပါ။
Tools တစ်ချို့က `.ts` imports တွေကို ခွင့်ပြုတာမို့ — TypeScript က `--allowImportingTsExtensions` လို့ခေါ်တဲ့ option တစ်ခုနဲ့ ဒီ import ပုံစံကို ခဏတစ်ကြာ ပံ့ပိုးထားပြီးသားပါ။
ဒါက အဆင်ပြေပါတယ် — ဒါပေမယ့် ဒီ `.ts` files တွေကနေ `.js` files တွေကို တကယ်တမ်း ထုတ်လုပ်ဖို့ လိုအပ်ရင် ဘာဖြစ်မလဲ?
`.js` files တွေကိုပဲ ဖြန့်ဝေနိုင်ဖို့ လိုအပ်မယ့် library authors တွေအတွက် ဒါက လိုအပ်ချက်တစ်ခုပါ — ဒါပေမယ့် အခုထိ TypeScript က paths တစ်ခုခုကို ပြန်ရေးတာကို ရှောင်ခဲ့ပါတယ်။

ဒီအခြေအနေကို ပံ့ပိုးဖို့ — `--rewriteRelativeImportExtensions` လို့ခေါ်တဲ့ compiler option အသစ်တစ်ခုကို ထပ်ဖြည့်ထားပါတယ်။
Import path တစ်ခုက *relative* (`./` ဒါမှမဟုတ် `../` နဲ့ စတင်) ဖြစ်ပြီး — TypeScript extension (`.ts`, `.tsx`, `.mts`, `.cts`) တစ်ခုနဲ့ အဆုံးသတ်ပြီး — non-declaration file တစ်ခု ဖြစ်နေရင် — compiler က path ကို သက်ဆိုင်ရာ JavaScript extension (`.js`, `.jsx`, `.mjs`, `.cjs`) အဖြစ် ပြန်ရေးပါလိမ့်မယ်။

```ts
// Under --rewriteRelativeImportExtensions...

// these will be rewritten.
import * as foo from "./foo.ts";
import * as bar from "../someFolder/bar.mts";

// these will NOT be rewritten in any way.
import * as a from "./foo";
import * as b from "some-package/file.ts";
import * as c from "@some-scope/some-package/file.ts";
import * as d from "#/file.ts";
import * as e from "./file.js";
```

ဒါက — in-place မှာ run လို့ရပြီး — အဆင်သင့်ဖြစ်တဲ့အခါ JavaScript အဖြစ် compile လုပ်လို့ရတဲ့ TypeScript code တွေကို ရေးနိုင်စေပါတယ်။

အခုတော့ — TypeScript က ယေဘုယျအားဖြင့် paths တွေကို ပြန်ရေးတာကို ရှောင်ခဲ့တာ သတိပြုခဲ့ပါတယ်။
ဒါအတွက် အကြောင်းရင်း အများအပြား ရှိပေမယ့် — အထင်ရှားဆုံးကတော့ dynamic imports တွေပါ။
Developer တစ်ယောက်က အောက်ပါအတိုင်း ရေးလိုက်ရင် — `import` က လက်ခံရရှိတဲ့ path ကို ကိုင်တွယ်ဖို့ မလွယ်ပါဘူး။
တကယ်တော့ — dependencies တစ်ခုခုအတွင်းမှာ `import` ရဲ့ အပြုအမူကို override လုပ်ဖို့ မဖြစ်နိုင်ပါဘူး။

```ts
function getPath() {
    if (Math.random() < 0.5) {
        return "./foo.ts";
    }
    else {
        return "./foo.js";
    }
}

let myImport = await import(getPath());
```

နောက်ပြဿနာတစ်ခုက — (အပေါ်မှာ မြင်ခဲ့သလိုပဲ) *relative* paths တွေကိုပဲ ပြန်ရေးပြီး — သူတို့ကို "နုံအတိုင်း" (naively) ပြန်ရေးတာပါ။
ဆိုလိုတာက TypeScript ရဲ့ `baseUrl` နဲ့ `paths` တွေကို မှီခိုနေတဲ့ path တစ်ခုခုက ပြန်ရေးခံရမှာ မဟုတ်ဘူးလို့ ဆိုလိုပါတယ်:

```json5
// tsconfig.json

{
    "compilerOptions": {
        "module": "nodenext",
        // ...
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

```ts
// Won't be transformed, won't work.
import * as utilities from "@/utilities.ts";
```

ပြီးတော့ `package.json` တစ်ခုရဲ့ [`exports`](https://nodejs.org/api/packages.html#exports) နဲ့ [`imports`](https://nodejs.org/api/packages.html#imports) fields တွေကနေတစ်ဆင့် resolve ဖြစ်နိုင်တဲ့ path တစ်ခုခုကလည်း ပြန်ရေးခံရမှာ မဟုတ်ပါဘူး။

```json5
// package.json
{
    "name": "my-package",
    "imports": {
        "#root/*": "./dist/*"
    }
}
```

```ts
// Won't be transformed, won't work.
import * as utilities from "#root/utilities.ts";
```

ရလဒ်အနေနဲ့ — package အများအပြား တစ်ခုကိုတစ်ခု ရည်ညွှန်းနေတဲ့ workspace-style layout တစ်ခုကို သုံးနေရင် — ဒါကို အလုပ်ဖြစ်အောင် [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) တွေကို [scoped custom conditions](https://nodejs.org/api/packages.html#resolving-user-conditions) တွေနဲ့တွဲပြီး သုံးဖို့ လိုအပ်နိုင်ပါတယ်:

```json5
// my-package/package.json

{
    "name": "my-package",
    "exports": {
        ".": {
            "@my-package/development": "./src/index.ts",
            "import": "./lib/index.js"
        },
        "./*": {
            "@my-package/development": "./src/*.ts",
            "import": "./lib/*.js"
        }
    }
}
```

`.ts` files တွေကို import လုပ်ချင်တဲ့ အခါတိုင်း — `node --conditions=@my-package/development` နဲ့ run လုပ်နိုင်ပါတယ်။

`@my-package/development` condition အတွက် ကျွန်တော်တို့ သုံးထားတဲ့ "namespace" ဒါမှမဟုတ် "scope" ကို သတိပြုပါ။
ဒါက `development` condition ကိုပါ သုံးနိုင်တဲ့ dependencies တွေကနေ conflicts (ထိပ်တိုက်မှုတွေ) ရှောင်ဖို့ ယာယီ ဖြေရှင်းနည်း (makeshift solution) တစ်ခု အနည်းငယ်ပါ။
လူတိုင်းက သူတို့ရဲ့ package ထဲမှာ `development` တစ်ခု ထည့်ပို့ရင် — resolution က `.ts` file တစ်ခုဆီ resolve ဖို့ ကြိုးစားနိုင်ပြီး — အဲဒါက သေချာပေါက် အလုပ်ဖြစ်ချင်မှ ဖြစ်ပါလိမ့်မယ်။
ဒီအယူအဆက Colin McDonnell ရဲ့ *[Live types in a TypeScript monorepo](https://colinhacks.com/essays/live-types-typescript-monorepo#:~:text=custom%20conditions)* စာစုထဲမှာ ဖော်ပြထားတာနဲ့ — [source ကနေ loading လုပ်ဖို့ tshy ရဲ့ လမ်းညွှန်ချက်](https://github.com/isaacs/tshy#loading-from-source) နဲ့ ဆင်တူပါတယ်။

ဒီ feature က ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ ပိုတိကျတဲ့အချက်တွေအတွက် — [ဒီပြောင်းလဲမှုအကြောင်း ဒီမှာ ဖတ်ပါ](https://github.com/microsoft/TypeScript/pull/59767)။

## Support for `--target es2024` and `--lib es2024` (`--target es2024` နှင့် `--lib es2024` အတွက် ပံ့ပိုးမှု)

TypeScript 5.7 က `--target es2024` ကို ယခုဆို ပံ့ပိုးပြီး — အသုံးပြုသူတွေကို ECMAScript 2024 runtimes တွေကို target ထားခွင့် ပြုပါတယ်။
ဒီ target က အဓိကအားဖြင့် `--lib es2024` အသစ်ကို သတ်မှတ်ခွင့် ပြုပါတယ် — ၎င်းထဲမှာ `SharedArrayBuffer` နဲ့ `ArrayBuffer`, `Object.groupBy`, `Map.groupBy`, `Promise.withResolvers` စတာတွေအတွက် feature အများအပြား ပါဝင်ပါတယ်။
ပြီးတော့ `Atomics.waitAsync` ကို `--lib es2022` ကနေ `--lib es2024` ဆီ ရွှေ့ပေးထားပါတယ်။

`SharedArrayBuffer` နဲ့ `ArrayBuffer` တွေရဲ့ ပြောင်းလဲမှုတွေရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ — နှစ်ခုက ယခုဆို နည်းနည်း ကွဲပြားသွားတာ သတိပြုပါ။
ကွာဟချက်ကို ပေါင်းကူးပြီး — underlying buffer type ကို ထိန်းသိမ်းဖို့ — `TypedArrays` အားလုံး (`Uint8Array` နဲ့ အခြားဟာတွေလို) [ယခုဆို generic တွေလည်း ဖြစ်ပါတယ်](https://github.com/microsoft/TypeScript/pull/59417)။

```ts
interface Uint8Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    // ...
}
```

`TypedArray` တစ်ခုချင်းစီမှာ ယခုဆို `TArrayBuffer` လို့ခေါ်တဲ့ type parameter တစ်ခု ပါဝင်ပြီး — အဲဒီ type parameter မှာ default type argument တစ်ခု ရှိတာမို့ — `Int32Array<ArrayBufferLike>` လို့ ရှင်းရှင်းလင်းလင်း ရေးစရာမလိုဘဲ `Int32Array` ကို ဆက်လက် ရည်ညွှန်းနိုင်ပါတယ်။

ဒီအပ်ဒိတ်ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ ပြဿနာတစ်ခုခု ကြုံရရင် — `@types/node` ကို update လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။

ဒီ [အလုပ်](https://github.com/microsoft/TypeScript/pull/58573) ကို အဓိကအားဖြင့် [Kenta Moriuchi](https://github.com/petamoriken) ရဲ့ ကျေးဇူးကြောင့် ရရှိနိုင်ခဲ့ပါတယ်!

## Searching Ancestor Configuration Files for Project Ownership (Project Ownership အတွက် Ancestor Configuration Files များကို ရှာဖွေခြင်း)

TSServer ကို သုံးတဲ့ editor တစ်ခု (Visual Studio ဒါမှမဟုတ် VS Code လိုမျိုး) ထဲမှာ TypeScript file တစ်ခုကို load လုပ်တဲ့အခါ — editor က file ကို "ပိုင်ဆိုင်"တဲ့ သက်ဆိုင်ရာ `tsconfig.json` file တစ်ခုကို ရှာဖွေဖို့ ကြိုးစားပါလိမ့်မယ်။
ဒါကို လုပ်ဖို့ — ၎င်းက တည်းဖြတ်နေတဲ့ file ကနေ directory tree တစ်လျှောက် အပေါ်ကို တက်သွားပြီး — `tsconfig.json` လို့ အမည်ရှိတဲ့ file တစ်ခုခုကို ရှာဖွေပါတယ်။

အရင်က — ဒီရှာဖွေမှုက ပထမဆုံး တွေ့ရတဲ့ `tsconfig.json` file မှာ ရပ်တန့်သွားပါတယ်;
ဒါပေမယ့် — အောက်ပါလို project တည်ဆောက်ပုံတစ်ခုကို စိတ်ကူးကြည့်ပါ:

```
project/
├── src/
│   ├── foo.ts
│   ├── foo-test.ts
│   ├── tsconfig.json
│   └── tsconfig.test.json
└── tsconfig.json
```

ဒီမှာ — ရည်ရွယ်ချက်က `src/tsconfig.json` က project အတွက် "main" configuration file ဖြစ်ပြီး — `src/tsconfig.test.json` က tests တွေ run လုပ်ဖို့အတွက် configuration file တစ်ခု ဖြစ်ပါတယ်။

```json5
// src/tsconfig.json
{
    "compilerOptions": {
        "outDir": "../dist"
    },
    "exclude": ["**/*.test.ts"]
}
```

```json5
// src/tsconfig.test.json
{
    "compilerOptions": {
        "outDir": "../dist/test"
    },
    "include": ["**/*.test.ts"],
    "references": [
        { "path": "./tsconfig.json" }
    ]
}
```

```json5
// tsconfig.json
{
    // This is a "workspace-style" or "solution-style" tsconfig.
    // Instead of specifying any files, it just references all the actual projects.
    "files": [],
    "references": [
        { "path": "./src/tsconfig.json" },
        { "path": "./src/tsconfig.test.json" },
    ]
}
```

ဒီမှာ ပြဿနာက — `foo-test.ts` ကို တည်းဖြတ်တဲ့အခါ — editor က `project/src/tsconfig.json` ကို "ပိုင်ဆိုင်တဲ့" (owning) configuration file အဖြစ် တွေ့ပါလိမ့်မယ် — ဒါပေမယ့် အဲဒါက ကျွန်တော်တို့ လိုချင်တဲ့ဟာ မဟုတ်ပါဘူး!
ဒီနေရာမှာ လမ်းလျှောက်တာ (walk) ရပ်တန့်သွားရင် — ဒါက နှစ်လိုဖွယ် မကောင်းနိုင်ပါဘူး။
အရင်က ဒါကို ရှောင်ဖို့ တစ်ခုတည်းသော နည်းလမ်းက `src/tsconfig.json` ကို `src/tsconfig.src.json` လိုမျိုး နာမည်ပြောင်းပြီး — file အားလုံးက ဖြစ်နိုင်တဲ့ project တိုင်းကို ရည်ညွှန်းထားတဲ့ အပေါ်ဆုံးအဆင့် `tsconfig.json` ကို ထိမှာပါ။

```
project/
├── src/
│   ├── foo.ts
│   ├── foo-test.ts
│   ├── tsconfig.src.json
│   └── tsconfig.test.json
└── tsconfig.json
```

Developer တွေကို ဒီလိုလုပ်ဖို့ အတင်းအကျပ် မလုပ်တော့ဘဲ — TypeScript 5.7 က ယခုဆို editor အခြေအနေတွေအတွက် အခြား သင့်လျော်တဲ့ `tsconfig.json` files တွေကို ရှာဖွေဖို့ — directory tree တစ်လျှောက် အပေါ်ကို ဆက်ပြီး တက်သွားပါတယ်။
ဒါက projects တွေကို စုစည်းပုံနဲ့ configuration files တွေကို တည်ဆောက်ပုံအတွက် ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် ဖြစ်စေနိုင်ပါတယ်။

Implementation ရဲ့ ပိုတိကျတဲ့အချက်တွေကို GitHub ပေါ်မှာ [ဒီနေရာ](https://github.com/microsoft/TypeScript/pull/57196) နဲ့ [ဒီနေရာ](https://github.com/microsoft/TypeScript/pull/59688) မှာ ရနိုင်ပါတယ်။

## Faster Project Ownership Checks in Editors for Composite Projects (Composite Projects များအတွက် Editor များတွင် Project Ownership Checks ပိုမိုမြန်ဆန်လာခြင်း)

အောက်ပါ တည်ဆောက်ပုံရှိတဲ့ codebase ကြီးတစ်ခုကို စိတ်ကူးကြည့်ပါ:

```
packages
├── graphics/
│   ├── tsconfig.json
│   └── src/
│       └── ...
├── sound/
│   ├── tsconfig.json
│   └── src/
│       └── ...
├── networking/
│   ├── tsconfig.json
│   └── src/
│       └── ...
├── input/
│   ├── tsconfig.json
│   └── src/
│       └── ...
└── app/
    ├── tsconfig.json
    ├── some-script.js
    └── src/
        └── ...
```

`packages` ထဲက directory တစ်ခုချင်းစီက သီးခြား TypeScript project တစ်ခုစီ ဖြစ်ပြီး — `app` directory က တခြား project အားလုံးအပေါ် မှီခိုနေတဲ့ အဓိက project ပါ။

```json5
// app/tsconfig.json
{
    "compilerOptions": {
        // ...
    },
    "include": ["src"],
    "references": [
        { "path": "../graphics/tsconfig.json" },
        { "path": "../sound/tsconfig.json" },
        { "path": "../networking/tsconfig.json" },
        { "path": "../input/tsconfig.json" }
    ]
}
```

အခု `app` directory ထဲမှာ `some-script.js` ဆိုတဲ့ file တစ်ခု ရှိတာကို သတိပြုပါ။
Editor ထဲမှာ `some-script.js` ကို ဖွင့်လိုက်တဲ့အခါ — TypeScript language service (JavaScript files တွေအတွက် editor အတွေ့အကြုံကိုပါ ကိုင်တွယ်ပေးတဲ့ဟာ!) က file က ဘယ် project ထဲက ဖြစ်လဲဆိုတာ ရှာဖွေဖို့ လိုပါတယ် — မှန်ကန်တဲ့ settings တွေကို အသုံးချနိုင်ဖို့ပါ။

ဒီကိစ္စမှာ — အနီးဆုံး `tsconfig.json` က `some-script.js` ကို *မပါဝင်*စေပါဘူး — ဒါပေမယ့် TypeScript က "`app/tsconfig.json` က *ရည်ညွှန်း*ထားတဲ့ project တစ်ခုခုက `some-script.js` ကို ပါဝင်စေနိုင်လား?" လို့ ဆက်မေးသွားပါလိမ့်မယ်။
ဒါကိုလုပ်ဖို့ — TypeScript က အရင်က project တစ်ခုချင်းစီကို တစ်ခုပြီးတစ်ခု load လုပ်ပြီး — `some-script.js` ပါဝင်တဲ့ project တစ်ခုကို တွေ့တာနဲ့ ရပ်တန့်ခဲ့ပါတယ်။
`some-script.js` က file တွေရဲ့ root set ထဲမှာ မပါဝင်ရင်တောင် — project တစ်ခုအတွင်းက files တွေ အားလုံးကို TypeScript က parse လုပ်နေဦးမှာပါ — root set ထဲက file တစ်ချို့က `some-script.js` ကို *transitively* ရည်ညွှန်းနိုင်သေးလို့ပါ။

အချိန်ကြာလာတာနဲ့အမျှ ကျွန်တော်တို့ တွေ့ရှိခဲ့တာက — ဒီအပြုအမူက codebase ကြီးတွေထဲမှာ လွန်ကဲပြီး ကြိုတင်ခန့်မှန်းလို့မရတဲ့ အပြုအမူတွေကို ဖြစ်စေတာပါ။
Developer တွေက လမ်းလွဲနေတဲ့ (stray) script files တွေကို ဖွင့်လိုက်ပြီး — သူတို့ရဲ့ codebase တစ်ခုလုံး ဖွင့်ပြီးမြောက်ဖို့ စောင့်နေရတာမျိုး ကြုံရပါတယ်။

ကံကောင်းတာက — တခြား (non-workspace) project တစ်ခုက ရည်ညွှန်းနိုင်တဲ့ project တိုင်းက `composite` လို့ခေါ်တဲ့ flag တစ်ခုကို enable လုပ်ထားရပါတယ် — ၎င်းက input source files အားလုံးကို ကြိုတင် (up-front) သိထားရမယ်ဆိုတဲ့ စည်းမျဉ်းတစ်ခုကို အတည်ပြုပေးပါတယ်။
ဒါကြောင့် `composite` project တစ်ခုကို probe လုပ်တဲ့အခါ — TypeScript 5.7 က file တစ်ခုက အဲဒီ project ရဲ့ *root set of files* ထဲမှာ ပါဝင်လားဆိုတာကိုပဲ စစ်ဆေးပါလိမ့်မယ်။
ဒါက ဒီအဖြစ်များတဲ့ အဆိုးဆုံး အခြေအနေကို ရှောင်ရှားနိုင်စေမှာပါ။

နောက်ထပ် အချက်အလက်အတွက် — [ဒီပြောင်းလဲမှုကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/59688)။

### Validated JSON Imports in `--module nodenext` (`--module nodenext` တွင် JSON Imports များကို စိစစ်ခြင်း)

`--module nodenext` အောက်မှာ `.json` file တစ်ခုကနေ import လုပ်တဲ့အခါ — runtime errors တွေ မဖြစ်အောင် TypeScript က ယခုဆို စည်းမျဉ်းတစ်ချို့ကို အတည်ပြုပါလိမ့်မယ်။

ပထမတစ်ချက်က — JSON file import တစ်ခုခုအတွက် `type: "json"` ပါဝင်တဲ့ import attribute တစ်ခု ရှိနေဖို့ လိုအပ်ပါတယ်။

```ts
import myConfig from "./myConfig.json";
//                   ~~~~~~~~~~~~~~~~~
// ❌ error: Importing a JSON file into an ECMAScript module requires a 'type: "json"' import attribute when 'module' is set to 'NodeNext'.

import myConfig from "./myConfig.json" with { type: "json" };
//                                          ^^^^^^^^^^^^^^^^
// ✅ This is fine because we provided `type: "json"`
```

ဒီ validation အပြင် — TypeScript က "named" exports တွေကို ထုတ်ပေးမှာ မဟုတ်ဘဲ — JSON import တစ်ခုရဲ့ ပါဝင်မှုတွေကို default တစ်ခုကနေတစ်ဆင့်သာ ဝင်ရောက်နိုင်မှာပါ။

```ts
// ✅ This is okay:
import myConfigA from "./myConfig.json" with { type: "json" };
let version = myConfigA.version;

///////////

import * as myConfigB from "./myConfig.json" with { type: "json" };

// ❌ This is not:
let version = myConfig.version;

// ✅ This is okay:
let version = myConfig.default.version;
```

ဒီပြောင်းလဲမှုအပေါ် နောက်ထပ် အချက်အလက်အတွက် — [ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/60019)။

## Support for V8 Compile Caching in Node.js (Node.js တွင် V8 Compile Caching ပံ့ပိုးမှု)

Node.js 22 က [`module.enableCompileCache()` လို့ခေါ်တဲ့ API အသစ်တစ်ခု](https://github.com/nodejs/node/pull/54501) ကို ပံ့ပိုးပါတယ်။
ဒီ API က runtime ကို — tool တစ်ခုရဲ့ ပထမဆုံး run ပြီးနောက် လုပ်ဆောင်ခဲ့တဲ့ parsing နဲ့ compilation အလုပ်တစ်ချို့ကို ပြန်လည် အသုံးပြုခွင့် ပြုပါတယ်။

TypeScript 5.7 က အသုံးဝင်တဲ့ အလုပ်တွေကို ပိုစောစော စတင်နိုင်ဖို့ ဒီ API ကို ယခုဆို အခွင့်ကောင်းယူပါတယ်။
ကျွန်တော်တို့ရဲ့ ကိုယ်ပိုင် စမ်းသပ်မှုတချို့မှာ — `tsc --version` run လုပ်တာမှာ 2.5x လောက် မြန်ဆန်တာကို တွေ့ခဲ့ရပါတယ်။

```
Benchmark 1: node ./built/local/_tsc.js --version (*without* caching)
  Time (mean ± σ):     122.2 ms ±   1.5 ms    [User: 101.7 ms, System: 13.0 ms]
  Range (min … max):   119.3 ms … 132.3 ms    200 runs
 
Benchmark 2: node ./built/local/tsc.js --version  (*with* caching)
  Time (mean ± σ):      48.4 ms ±   1.0 ms    [User: 34.0 ms, System: 11.1 ms]
  Range (min … max):    45.7 ms …  52.8 ms    200 runs
 
Summary
  node ./built/local/tsc.js --version ran
    2.52 ± 0.06 times faster than node ./built/local/_tsc.js --version
```

နောက်ထပ် အချက်အလက်အတွက် — [pull request ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/59720)။
## Notable Behavioral Changes (ထင်ရှားသော Behavioral Changes များ)

ဒီ section က — upgrade တစ်ခုခုရဲ့ အစိတ်အပိုင်းအနေနဲ့ အသိအမှတ်ပြု နားလည်ထားသင့်တဲ့ မှတ်သားထိုက်သော ပြောင်းလဲမှုအစုတစ်ခုကို မီးမောင်းထိုးပြပါတယ်။
တစ်ခါတစ်ရံ deprecations, removals တွေနဲ့ ကန့်သတ်ချက်အသစ်တွေကို မီးမောင်းထိုးပြပါလိမ့်မယ်။
ထို့အပြင် — လုပ်ဆောင်နိုင်စွမ်းအရ တိုးတက်မှုတွေ ဖြစ်ပေမယ့် — error အသစ်တွေ မိတ်ဆက်ခြင်းအားဖြင့် ရှိပြီးသား build တစ်ခုကိုပါ ထိခိုက်စေနိုင်တဲ့ bug fixes တွေလည်း ပါဝင်နိုင်ပါတယ်။

### `lib.d.ts`

DOM အတွက် ထုတ်လုပ်ထားတဲ့ Types တွေက သင့် codebase ကို type-check လုပ်တာကို သက်ရောက်မှု ရှိနိုင်ပါတယ်။
နောက်ထပ် အချက်အလက်အတွက် — [ဒီ TypeScript ဗားရှင်းအတွက် DOM နဲ့ `lib.d.ts` updates တွေနဲ့ ဆက်စပ်တဲ့ issues တွေကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/60061)။

### `TypedArray`s Are Now Generic Over `ArrayBufferLike` (`TypedArray` များသည် `ArrayBufferLike` အပေါ် ယခုဆို Generic ဖြစ်လာခြင်း)

ECMAScript 2024 မှာ — `SharedArrayBuffer` နဲ့ `ArrayBuffer` တွေမှာ နည်းနည်း ကွဲပြားသွားတဲ့ types တွေ ရှိပါတယ်။
ကွာဟချက်ကို ပေါင်းကူးပြီး — underlying buffer type ကို ထိန်းသိမ်းဖို့ — `TypedArrays` အားလုံး (`Uint8Array` နဲ့ အခြားဟာတွေလို) [ယခုဆို generic တွေလည်း ဖြစ်ပါတယ်](https://github.com/microsoft/TypeScript/pull/59417)။

```ts
interface Uint8Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    // ...
}
```

`TypedArray` တစ်ခုချင်းစီမှာ ယခုဆို `TArrayBuffer` လို့ခေါ်တဲ့ type parameter တစ်ခု ပါဝင်ပြီး — အဲဒီ type parameter မှာ default type argument တစ်ခု ရှိတာမို့ — အသုံးပြုသူတွေက `Int32Array<ArrayBufferLike>` လို့ ရှင်းရှင်းလင်းလင်း ရေးစရာမလိုဘဲ `Int32Array` ကို ဆက်လက် ရည်ညွှန်းနိုင်ပါတယ်။

ဒီအပ်ဒိတ်ရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ အောက်ပါလို ပြဿနာတွေ ကြုံရရင်

```
error TS2322: Type 'Buffer' is not assignable to type 'Uint8Array<ArrayBufferLike>'.
error TS2345: Argument of type 'Buffer' is not assignable to parameter of type 'Uint8Array<ArrayBufferLike>'.
error TS2345: Argument of type 'ArrayBufferLike' is not assignable to parameter of type 'ArrayBuffer'.
error TS2345: Argument of type 'Buffer' is not assignable to parameter of type 'string | ArrayBufferView | Stream | Iterable<string | ArrayBufferView> | AsyncIterable<string | ArrayBufferView>'.
```

`@types/node` ကို update လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။

[ဒီပြောင်းလဲမှုရဲ့ အသေးစိတ်တွေကို GitHub ပေါ်မှာ ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/59417)။

### Creating Index Signatures from Non-Literal Method Names in Classes (Classes များတွင် Non-Literal Method Names များမှ Index Signatures ဖန်တီးခြင်း)

Classes တွေထဲက methods တွေကို non-literal computed property names တွေနဲ့ ကြေညာတဲ့အခါ — TypeScript က ယခုဆို ပိုပြီး တသမတ်တည်း ဖြစ်တဲ့ အပြုအမူတစ်ခု ရှိပါတယ်။
ဥပမာ — အောက်ပါတို့မှာ:

```ts
declare const symbolMethodName: symbol;

export class A {
    [symbolMethodName]() { return 1 };
}
```

အရင်က TypeScript က class ကို အောက်ပါလိုမျိုး ရှုမြင်ခဲ့ပါတယ်:

```ts
export class A {
}
```

တစ်နည်းပြောရရင် — type system ရဲ့ ရှုထောင့်ကနေကြည့်ရင် — `[symbolMethodName]` က `A` ရဲ့ type ဆီကို ဘာမှ ပံ့ပိုးမှု မရှိခဲ့ပါဘူး

TypeScript 5.7 က `[symbolMethodName]() {}` method ကို ယခုဆို ပိုပြီး အဓိပ္ပာယ်ရှိရှိ ရှုမြင်ပြီး — index signature တစ်ခုကို ထုတ်ပေးပါတယ်။
ရလဒ်အနေနဲ့ — အပေါ်က code ကို အောက်ပါလို code မျိုးအနေနဲ့ အဓိပ္ပာယ်ကောက်ယူပါတယ်:

```ts
export class A {
    [x: symbol]: () => number;
}
```

ဒါက object literals တွေထဲက properties နဲ့ methods တွေနဲ့ တသမတ်တည်း ဖြစ်တဲ့ အပြုအမူတစ်ခုကို ပေးပါတယ်။

[ဒီပြောင်းလဲမှုအကြောင်း ဒီမှာ ပိုပြီး ဖတ်ပါ](https://github.com/microsoft/TypeScript/pull/59860)။

### More Implicit `any` Errors on Functions Returning `null` and `undefined` (`null` နှင့် `undefined` ပြန်ပေးသော Functions များပေါ်တွင် Implicit `any` Errors ပိုများလာခြင်း)

Function expression တစ်ခုကို generic type တစ်ခုကို ပြန်ပေးတဲ့ signature တစ်ခုက contextually type သတ်မှတ်ပေးတဲ့အခါ — TypeScript က `noImplicitAny` အောက်မှာ implicit `any` error တစ်ခုကို ယခုဆို သင့်လျော်စွာ ပေးပါတယ် — ဒါပေမယ့် `strictNullChecks` ရဲ့ အပြင်ဘက်မှာပါ။

```ts
declare var p: Promise<number>;
const p2 = p.catch(() => null);
//                 ~~~~~~~~~~
// error TS7011: Function expression, which lacks return-type annotation, implicitly has an 'any' return type.
```

[ဒီပြောင်းလဲမှုကို အသေးစိတ်အတွက် ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/59661)။
