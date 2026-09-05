---
title: "tsconfig.json (tsconfig.json ဖိုင်)"
description: "tsconfig.json ဆိုတာ ဘာလဲ — TypeScript project တစ်ခုရဲ့ root files နဲ့ compiler options တွေကို သတ်မှတ်ပေးပုံ၊ ဥပမာ configurations များနဲ့ TSConfig bases အကြောင်း"
order: 68
source: "https://www.typescriptlang.org/docs/handbook/tsconfig-json.html"
status: translated
updated: 2026-09-05
---

## Overview (ခြုံငုံသုံးသပ်ချက်)

Directory တစ်ခုထဲမှာ `tsconfig.json` file ရှိနေတာက — အဲဒီ directory ဟာ TypeScript project တစ်ခုရဲ့ root (အခြေခံနေရာ) ဖြစ်ကြောင်း ညွှန်ပြပါတယ်။ `tsconfig.json` file က project ကို compile လုပ်ဖို့ လိုအပ်တဲ့ root files တွေနဲ့ compiler options တွေကို သတ်မှတ်ပေးပါတယ်။

JavaScript projects တွေကတော့ ဒီနေရာမှာ `jsconfig.json` file ကို အသုံးပြုနိုင်ပါတယ် — ၎င်းက နီးပါး တူညီစွာ အလုပ်လုပ်ပေးပေမယ့် JavaScript နဲ့ ဆက်စပ်တဲ့ compiler flags တစ်ချို့ကို default အနေနဲ့ ဖွင့်ထားပေးတာ ကွာခြားပါတယ်။

Project တစ်ခုကို အောက်ပါ နည်းလမ်းတွေထဲက တစ်ခုခုနဲ့ compile လုပ်ပါတယ်:

## Using `tsconfig.json` or `jsconfig.json` (tsconfig.json သို့မဟုတ် jsconfig.json ကို အသုံးပြုခြင်း)

- Input files တွေ မပါဘဲ `tsc` ကို ခေါ်ခြင်းအားဖြင့် — ဒီအခါ compiler က လက်ရှိ directory ကစပြီး parent directory တွေဆီ တစ်ဆင့်ပြီးတစ်ဆင့် တက်သွားကာ `tsconfig.json` file ကို ရှာဖွေပါတယ်။
- Input files တွေ မပါဘဲ — `tsconfig.json` file ပါဝင်တဲ့ directory တစ်ခုရဲ့ path ကို ဒါမှမဟုတ် configuration တွေ ပါဝင်တဲ့ valid `.json` file တစ်ခုရဲ့ path ကို သတ်မှတ်ပေးတဲ့ `--project` (သို့မဟုတ် `-p`) command line option နဲ့ `tsc` ကို ခေါ်ခြင်းအားဖြင့် ဖြစ်ပါတယ်။

Command line မှာ input files တွေကို သတ်မှတ်ပေးထားရင် — `tsconfig.json` files တွေကို လျစ်လျူရှုပါတယ်။

## Examples (ဥပမာများ)

`tsconfig.json` file ဥပမာများ:

- [`files`](https://www.typescriptlang.org/tsconfig) property ကို အသုံးပြုခြင်း

  ```json tsconfig
  {
    "compilerOptions": {
      "module": "commonjs",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "sourceMap": true
    },
    "files": [
      "core.ts",
      "sys.ts",
      "types.ts",
      "scanner.ts",
      "parser.ts",
      "utilities.ts",
      "binder.ts",
      "checker.ts",
      "emitter.ts",
      "program.ts",
      "commandLineParser.ts",
      "tsc.ts",
      "diagnosticInformationMap.generated.ts"
    ]
  }
  ```

- [`include`](https://www.typescriptlang.org/tsconfig) နဲ့ [`exclude`](https://www.typescriptlang.org/tsconfig) properties တွေကို အသုံးပြုခြင်း

  ```json  tsconfig
  {
    "compilerOptions": {
      "module": "system",
      "noImplicitAny": true,
      "removeComments": true,
      "preserveConstEnums": true,
      "outFile": "../../built/local/tsc.js",
      "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["**/*.spec.ts"]
  }
  ```

## TSConfig Bases (Base Config များ)

သင့် code ကို run လုပ်မယ့် JavaScript runtime environment ပေါ် မူတည်ပြီး — [github.com/tsconfig/bases](https://github.com/tsconfig/bases/) မှာ သုံးလို့ရတဲ့ base configuration တစ်ခု ရှိနိုင်ပါတယ်။ ဒါတွေက သင့် project က extends (ဆက်ခံ) လုပ်နိုင်တဲ့ `tsconfig.json` files တွေပါ — runtime support ကို စီမံပေးလို့ သင့် `tsconfig.json` ကို ရိုးရှင်းစေပါတယ်။

ဥပမာ — Node.js version 12 နဲ့ အထက်ကို သုံးတဲ့ project တစ်ခု ရေးနေတယ်ဆိုရင် — npm module [`@tsconfig/node12`](https://www.npmjs.com/package/@tsconfig/node12) ကို သုံးနိုင်ပါတယ်:

```json tsconfig
{
  "extends": "@tsconfig/node12/tsconfig.json",

  "compilerOptions": {
    "preserveConstEnums": true
  },

  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts"]
}
```

ဒါက သင့် `tsconfig.json` ကို — runtime ရဲ့ ယန္တရား (mechanics) အားလုံး မဟုတ်ဘဲ — သင့် project အတွက် ထူးခြားတဲ့ ရွေးချယ်မှုတွေပေါ်မှာပဲ အာရုံစိုက်နိုင်အောင် လုပ်ပေးပါတယ်။ tsconfig bases တစ်ချို့ ရှိပြီးသားဖြစ်ပြီး — မတူညီတဲ့ environment တွေအတွက် community က နောက်ထပ် ထပ်ဖြည့်ပေးမယ်လို့ ကျွန်တော်တို့ မျှော်လင့်ပါတယ်။

## Details (အသေးစိတ်များ)

`"compilerOptions"` property ကို ချန်လိုက်လို့ ရပါတယ် — ဒီအခါ compiler ရဲ့ default options တွေကို အသုံးပြုပါတယ်။ Support လုပ်ထားတဲ့ [Compiler Options](https://www.typescriptlang.org/tsconfig) တွေရဲ့ အပြည့်အစုံ list ကို ကြည့်ပါ။

## TSConfig Reference (TSConfig ရည်ညွှန်းချက်)

Configuration options ရာပေါင်းများစွာအကြောင်း ပိုမိုလေ့လာချင်ရင် — [TSConfig Reference](https://www.typescriptlang.org/tsconfig) ကို ကြည့်ပါ။

## Schema (Schema ဖွဲ့စည်းပုံ)

`tsconfig.json` ရဲ့ Schema ကို [JSON Schema Store](https://json.schemastore.org/tsconfig) မှာ ရှာတွေ့နိုင်ပါတယ်။
