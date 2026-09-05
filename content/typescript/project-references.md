---
title: "Project References (Project References)"
description: "TypeScript program တွေကို project ငယ်များ ခွဲ၍ ဖွဲ့စည်းနိုင်စေသည့် project references အကြောင်း — build မြန်ဆန်စေခြင်း၊ composite နဲ့ declarationMap settings များ၊ tsc --build build mode နဲ့ ဖွဲ့စည်းပုံ လမ်းညွှန်များ"
order: 72
source: "https://www.typescriptlang.org/docs/handbook/project-references.html"
status: translated
updated: 2026-09-05
---

Project references က သင့် TypeScript programs တွေကို — TypeScript 3.0 နဲ့ ၎င်းနောက်ပိုင်း versions တွေမှာ ရနိုင်တဲ့ — အပိုင်းအငယ်လေးတွေ အဖြစ် ဖွဲ့စည်းနိုင်စေပါတယ်။

ဒီလိုလုပ်ခြင်းအားဖြင့် — build လုပ်ချိန်တွေကို သိသိသာသာ မြှင့်တင်နိုင်ပြီး — components တွေကြားမှာ ယုတ္တိကျတဲ့ ခွဲခြားမှု (logical separation) ကို တွန်းအားပေးနိုင်ကာ — သင့် code ကို နည်းလမ်းသစ်တွေ၊ ပိုကောင်းတဲ့နည်းတွေနဲ့ စုစည်းနိုင်ပါတယ်။

`tsc` အတွက် mode အသစ်တစ်ခုဖြစ်တဲ့ `--build` flag ကိုလည်း မိတ်ဆက်ပေးနေပါတယ် — ဒါက project references တွေနဲ့ တွဲဖက် အလုပ်လုပ်ပြီး — TypeScript builds တွေကို ပိုမြန်အောင် လုပ်ပေးပါတယ်။

## An Example Project (ဥပမာ Project တစ်ခု)

ပုံမှန် program တစ်ခုကို ကြည့်ပြီး — project references တွေက ဒါကို ပိုကောင်းအောင် စုစည်းဖို့ ဘယ်လို ကူညီပေးနိုင်လဲ ဆိုတာ ကြည့်ရအောင်။
`converter` နဲ့ `units` ဆိုတဲ့ module နှစ်ခု ပါတဲ့ project တစ်ခု ရှိပြီး — တစ်ခုချင်းစီအတွက် သက်ဆိုင်တဲ့ test file တစ်ခုစီ ရှိတယ်လို့ မြင်ကြည့်ပါ:

```
/
├── src/
│   ├── converter.ts
│   └── units.ts
├── test/
│   ├── converter-tests.ts
│   └── units-tests.ts
└── tsconfig.json
```

Test files တွေက implementation files တွေကို import လုပ်ပြီး စမ်းသပ်မှုတချို့ လုပ်ပါတယ်:

```ts
// converter-tests.ts
import * as converter from "../src/converter";

assert.areEqual(converter.celsiusToFahrenheit(0), 32);
```

အရင်တုန်းကဆိုရင် — single tsconfig file တစ်ခုတည်းနဲ့ ဆိုရင် — ဒီဖွဲ့စည်းပုံက အလုပ်လုပ်ဖို့ အတော်လေး ခက်ခဲပါတယ်:

- Implementation files တွေက test files တွေကို import လုပ်ဖို့ ဖြစ်နိုင်ခဲ့တယ်
- `test` နဲ့ `src` တွေကို — `src` က output folder ရဲ့ နာမည်ထဲမှာ ပါမသွားဘဲ — တစ်ချိန်တည်း build လုပ်ဖို့ မဖြစ်နိုင်ခဲ့ဘူး (အဲဒါမျိုး သင်ဖြစ်ချင်မှာ မဟုတ်ဘူးလေ)
- Implementation files တွေထဲက _internals_ (အတွင်းပိုင်း အသေးစိတ်တွေ) ကိုပဲ ပြောင်းလိုက်တာတောင် — error အသစ်တွေ ဘယ်တော့မှ မဖြစ်စေနိုင်ပေမယ့် — tests တွေကို နောက်တစ်ကြိမ် _typechecking_ လုပ်ရတယ်
- Tests တွေကိုပဲ ပြောင်းလိုက်ရင်လည်း — ဘာမှ မပြောင်းလဲဘူးဆိုရင်တောင် — implementation ကို နောက်တစ်ကြိမ် typechecking လုပ်ရတယ်

ဒီပြဿနာတွေထဲက _တချို့_ ကို ဖြေရှင်းဖို့ tsconfig files အများကြီး သုံးနိုင်ပေမယ့် — ပြဿနာအသစ်တွေ ပေါ်လာပါတယ်:

- Up-to-date ဖြစ်မဖြစ် စစ်ဆေးပေးတဲ့ built-in စနစ် မရှိလို့ — `tsc` ကို နှစ်ကြိမ်တိုင်တိုင် run ရတော့တယ်
- `tsc` ကို နှစ်ကြိမ် run ရတာက startup time overhead (စတင်ချိန် နှေးကွေးမှု) ပိုများစေတယ်
- `tsc -w` က config files အများကြီးကို တစ်ပြိုင်နက် run လို့ မရဘူး

Project references က ဒီပြဿနာတွေ အားလုံးကို — နောက်ထပ် အခြားအရာတွေပါ — ဖြေရှင်းနိုင်ပါတယ်။

## What is a Project Reference? (Project Reference ဆိုတာ ဘာလဲ?)

`tsconfig.json` files တွေမှာ [`references`](https://www.typescriptlang.org/tsconfig) ဆိုတဲ့ top-level property အသစ်တစ်ခု ရှိပါတယ် — ဒါက reference လုပ်ရမယ့် projects တွေကို သတ်မှတ်ပေးတဲ့ objects တွေရဲ့ array တစ်ခုပါ:

```js tsconfig
{
    "compilerOptions": {
        // The usual
    },
    "references": [
        { "path": "../src" }
    ]
}
```

Reference တစ်ခုချင်းစီရဲ့ `path` property က — `tsconfig.json` file တစ်ခု ပါဝင်တဲ့ directory တစ်ခုဆီ ဒါမှမဟုတ် — config file ကိုယ်တိုင်ဆီ (နာမည် ဘယ်လိုပဲ ဖြစ်ဖြစ်) — ညွှန်ပြနိုင်ပါတယ်။

Project တစ်ခုကို reference လုပ်လိုက်တဲ့အခါ — အသစ်တွေ ဖြစ်လာပါတယ်:

- Referenced project တစ်ခုကနေ modules တွေ import လုပ်တဲ့အခါ — သူ့ရဲ့ _output_ declaration file (`.d.ts`) ကို load လုပ်မယ်
- Referenced project က [`outFile`](https://www.typescriptlang.org/tsconfig) တစ်ခု ထုတ်ပေးတယ်ဆိုရင် — အဲဒီ output `.d.ts` file ရဲ့ declarations တွေက ဒီ project ထဲမှာ မြင်ရမယ်
- Build mode (အောက်မှာ ကြည့်ပါ) က လိုအပ်ရင် referenced project ကို အလိုအလျောက် build လုပ်ပေးမယ်

Project တွေကို အများကြီး ခွဲလိုက်ခြင်းအားဖြင့် — typechecking နဲ့ compiling ရဲ့ အမြန်နှုန်းကို သိသိသာသာ မြှင့်တင်နိုင်ပြီး — editor သုံးတဲ့အခါ memory အသုံးပြုမှုကို လျှော့ချနိုင်ကာ — သင့် program ရဲ့ ယုတ္တိကျတဲ့ အုပ်စုဖွဲ့မှုတွေကို ပိုမို တွန်းအားပေးနိုင်ပါတယ်။

## `composite`

Referenced projects တွေမှာ [`composite`](https://www.typescriptlang.org/tsconfig) setting အသစ်ကို ဖွင့်ထားရပါမယ်။
ဒီ setting က — TypeScript က referenced project ရဲ့ outputs တွေ ဘယ်မှာ ရှိတယ်ဆိုတာကို လျင်မြန်စွာ ဆုံးဖြတ်နိုင်ဖို့ လိုအပ်ပါတယ်။
[`composite`](https://www.typescriptlang.org/tsconfig) flag ကို ဖွင့်လိုက်တာက အချက်တချို့ကို ပြောင်းလဲစေပါတယ်:

- [`rootDir`](https://www.typescriptlang.org/tsconfig) setting ကို အတိအကျ မသတ်မှတ်ရင် — `tsconfig` file ပါတဲ့ directory ကို default အဖြစ် သုံးမယ်
- Implementation files အားလုံးက [`include`](https://www.typescriptlang.org/tsconfig) pattern တစ်ခုနဲ့ ကိုက်ညီရမယ် ဒါမှမဟုတ် [`files`](https://www.typescriptlang.org/tsconfig) array ထဲမှာ စာရင်းပြုရမယ် — ဒီကန့်သတ်ချက်ကို ချိုးဖောက်မိရင် — `tsc` က ဘယ် files တွေ သတ်မှတ်မထားဘူးဆိုတာ အသိပေးပါလိမ့်မယ်
- [`declaration`](https://www.typescriptlang.org/tsconfig) ကို ဖွင့်ထားရမယ်

## `declarationMap`

[Declaration source maps](https://github.com/Microsoft/TypeScript/issues/14479) အတွက် ပံ့ပိုးမှုကိုလည်း ထည့်ပေးထားပါတယ်။
[`declarationMap`](https://www.typescriptlang.org/tsconfig) ကို ဖွင့်ထားရင် — supported editors တွေမှာ "Go to Definition" နဲ့ Rename လိုမျိုး editor features တွေကို သုံးပြီး — project boundaries တွေကို ဖြတ်ကာ code တွေကို ပွင့်လင်းမြင်သာစွာ သွားလာ တည်းဖြတ်နိုင်ပါလိမ့်မယ်။

## Caveats for Project References (Project References အတွက် သတိထားစရာများ)

Project references တွေမှာ သင်သတိထားသင့်တဲ့ trade-offs (အားနည်းချက်လေးတချို့) ရှိပါတယ်။

Dependent projects တွေက သူတို့ရဲ့ dependencies တွေကနေ build လုပ်ထားတဲ့ `.d.ts` files တွေကို သုံးတာမို့ — editor ထဲမှာ project ကို — spurious errors (မဆိုင်ဘဲ ပေါ်လာတဲ့ errors) တွေ မမြင်ရဘဲ သွားလာကြည့်ရှုနိုင်ဖို့ဆိုရင် — build outputs တချို့ကို check in လုပ်ရမယ် _ဒါမှမဟုတ်_ project ကို clone လုပ်ပြီးနောက် build လုပ်ရပါလိမ့်မယ်။

VS Code ကို သုံးတဲ့အခါ (TS 3.7 ကစပြီး) — ဒါကို လျော့ပါးစေနိုင်တဲ့ behind-the-scenes (နောက်ကွယ်မှာ အလုပ်လုပ်တဲ့) in-memory `.d.ts` generation process တစ်ခု ရှိပါတယ် — ဒါပေမယ့် performance အပေါ် သက်ရောက်မှု တချို့ ရှိပါတယ်။ Composite project ကြီးတွေအတွက်တော့ — [disableSourceOfProjectReferenceRedirect option](https://www.typescriptlang.org/tsconfig) ကို သုံးပြီး ဒါကို ပိတ်ထားချင်ရင်လည်း ရပါတယ်။

ဒါ့အပြင် — ရှိပြီးသား build workflows တွေနဲ့ လိုက်ဖက်ညီမှုကို ထိန်းသိမ်းဖို့ — `tsc` က `--build` switch နဲ့ ခေါ်မှသာ dependencies တွေကို အလိုအလျောက် build လုပ်မှာ မဟုတ်ပါဘူး။
`--build` အကြောင်း ပိုပြီး လေ့လာကြည့်ရအောင်။

## Build Mode for TypeScript (TypeScript အတွက် Build Mode)

ကြာမြင့်စွာ စောင့်မျှော်ခဲ့ရတဲ့ feature တစ်ခုကတော့ — TypeScript projects တွေအတွက် smart incremental builds (ပြောင်းလဲမှုရှိတာကိုသာ ပြန်တည်ဆောက်ခြင်း) ပါ။
3.0 မှာ `tsc` နဲ့အတူ `--build` flag ကို သုံးနိုင်ပါတယ်။
ဒါက — ရိုးရိုး compiler တစ်ခုထက် — build orchestrator (build တွေကို ညှိနှိုင်း စီစဉ်ပေးသူ) တစ်ခုလိုမျိုး ပြုမူတဲ့ `tsc` အတွက် entry point အသစ်တစ်ခု ဖြစ်ပါတယ်။

`tsc --build` (`tsc -b` လို့ အတိုခေါ်) ကို run လုပ်တာက အောက်ပါအတိုင်း လုပ်ပါလိမ့်မယ်:

- Referenced projects တွေ အားလုံးကို ရှာဖွေမယ်
- သူတို့ up-to-date ဖြစ်မဖြစ် စစ်ဆေးမယ်
- Up-to-date မဟုတ်တဲ့ projects တွေကို အစီအစဉ်မှန်မှန် build လုပ်မယ်

`tsc -b` ကို config file paths အများကြီးနဲ့ ပေးနိုင်ပါတယ် (ဥပမာ — `tsc -b src test`)
`tsc -p` လိုပဲ — config file ရဲ့ နာမည်က `tsconfig.json` ဆိုရင် — file နာမည်ကိုယ်တိုင် သတ်မှတ်စရာ မလိုပါဘူး။

### `tsc -b` Commandline (`tsc -b` Commandline အသုံးပြုပုံ)

Config files ဘယ်နှစ်ခုကိုမဆို သတ်မှတ်နိုင်ပါတယ်:

```shell
 > tsc -b                            # Use the tsconfig.json in the current directory
 > tsc -b src                        # Use src/tsconfig.json
 > tsc -b foo/prd.tsconfig.json bar  # Use foo/prd.tsconfig.json and bar/tsconfig.json
```

Commandline မှာ သင်ပေးလိုက်တဲ့ files တွေရဲ့ အစီအစဉ်အတွက် စိတ်ပူစရာ မလိုပါဘူး — dependencies တွေ အရင်ဆုံး build ဖြစ်အောင် — `tsc` က လိုအပ်ရင် သူတို့ကို ပြန်စီစဉ်ပေးပါလိမ့်မယ်။

`tsc -b` နဲ့ သက်ဆိုင်တဲ့ သီးခြား flags တချို့လည်း ရှိပါတယ်:

- [`--verbose`](https://www.typescriptlang.org/tsconfig): ဘာတွေ ဖြစ်နေလဲ ရှင်းပြဖို့ verbose logging တွေ ထုတ်ပေးပါတယ် (အခြား flag ဘယ်ဟာနဲ့မဆို တွဲသုံးလို့ရပါတယ်)
- `--dry`: ဘာတွေ လုပ်ပေးမယ်ဆိုတာကို ပြပါတယ် — ဒါပေမယ့် ဘာကိုမှ တကယ် build မလုပ်ပါဘူး
- `--clean`: သတ်မှတ်ထားတဲ့ projects တွေရဲ့ outputs တွေကို ဖျက်ပစ်ပါတယ် (`--dry` နဲ့ တွဲသုံးလို့ရပါတယ်)
- [`--force`](https://www.typescriptlang.org/tsconfig): Projects တွေ အားလုံး up-to-date မဟုတ်သလို သရုပ်ဆောင်ပါတယ်
- `--watch`: Watch mode ပါ ([`--verbose`](https://www.typescriptlang.org/tsconfig) ကလွဲလို့ — အခြား flag ဘယ်ဟာနဲ့မှ တွဲသုံးလို့ မရပါဘူး)

## Caveats (သတိထားစရာများ)

ပုံမှန်အားဖြင့် — `tsc` က [`noEmitOnError`](https://www.typescriptlang.org/tsconfig) ဖွင့်ထားမှသာ — syntax ဒါမှမဟုတ် type errors တွေ ရှိနေရင်တောင် — outputs (`.js` နဲ့ `.d.ts`) တွေကို ထုတ်ပေးပါတယ်။
Incremental build system တစ်ခုမှာ ဒီလိုလုပ်တာက အရမ်းဆိုးပါတယ် — သင့်ရဲ့ up-to-date မဟုတ်တဲ့ dependencies တစ်ခုမှာ error အသစ်တစ်ခု ပေါ်လာရင် — နောက် build က အခု up-to-date ဖြစ်နေတဲ့ project ကို ကျော်သွားလို့ — အဲဒီ error ကို _တစ်ခါပဲ_ မြင်ရမှာမို့ပါ။
ဒါကြောင့် — `tsc -b` က projects အားလုံးအတွက် [`noEmitOnError`](https://www.typescriptlang.org/tsconfig) ကို ဖွင့်ထားသလိုမျိုး ထိရောက်စွာ ပြုမူပါတယ်။

Build outputs တွေ (`.js`, `.d.ts`, `.d.ts.map`, စသဖြင့်) ကို check in လုပ်ထားရင် — သင့် source control tool က local copy နဲ့ remote copy ကြားမှာ timestamps တွေကို ထိန်းသိမ်းမထားဘူးဆိုရင် — source control operations တချို့ လုပ်ပြီးနောက် [`--force`](https://www.typescriptlang.org/tsconfig) build တစ်ခု run ဖို့ လိုအပ်နိုင်ပါတယ်။

## MSBuild

သင့်မှာ msbuild project တစ်ခု ရှိရင် — အောက်ပါအတိုင်း ထည့်ခြင်းအားဖြင့် build mode ကို ဖွင့်နိုင်ပါတယ်:

```xml
    <TypeScriptBuildMode>true</TypeScriptBuildMode>
```

ဒါကို သင့် proj file ထဲကို ထည့်လိုက်ပါ — ဒါက automatic incremental build အပြင် cleaning ကိုပါ ဖွင့်ပေးပါလိမ့်မယ်။

`tsconfig.json` / `-p` နဲ့ ဆိုသလိုပဲ — ရှိပြီးသား TypeScript project properties တွေကို ထည့်သွင်း စဉ်းစားမှာ မဟုတ်ပါဘူး — settings အားလုံးကို သင့် tsconfig file နဲ့ပဲ စီမံသင့်ပါတယ်။

အသင်းအချို့က — tsconfig files တွေမှာ သူတို့ တွဲထားတဲ့ managed projects တွေနဲ့ တူညီတဲ့ _implicit_ graph ordering (သွယ်ဝိုက်တဲ့ စဉ်တန်းစီစဉ်မှု) ရှိတဲ့ msbuild-based workflows တွေကို ထားရှိကြပါတယ်။
သင့် solution က ဒီလိုမျိုးဆိုရင် — project references တွေနဲ့အတူ `msbuild` ကို `tsc -p` နဲ့ ဆက်ပြီး သုံးနိုင်ပါတယ် — ဒါတွေက လုံးဝ အပြန်အလှန် အလုပ်လုပ်လို့ရပါတယ်။

## Guidance (လမ်းညွှန်ချက်များ)

### Overall Structure (ဖွဲ့စည်းပုံ အလုံးစုံ)

`tsconfig.json` files တွေ ပိုများလာတာနဲ့အမျှ — သင့် common compiler options တွေကို ဗဟိုတစ်နေရာတည်းမှာ စုစည်းဖို့ [Configuration file inheritance](/docs/typescript/tsconfig-json) ကို သုံးချင်လာပါလိမ့်မယ်။
ဒီလိုဆိုရင် — files အများကြီးကို တည်းဖြတ်စရာ မလိုဘဲ — setting တစ်ခုကို file တစ်ခုထဲမှာပဲ ပြောင်းလို့ရပါတယ်။

နောက်ထပ် ကောင်းတဲ့ အလေ့အကျင့်တစ်ခုကတော့ — "solution" `tsconfig.json` file တစ်ခု ထားပြီး — ဒါက သင့် leaf-node projects တွေ အားလုံးဆီ [`references`](https://www.typescriptlang.org/tsconfig) တွေ ထားကာ — [`files`](https://www.typescriptlang.org/tsconfig) ကို empty array အဖြစ် သတ်မှတ်ထားတာပါ (မဟုတ်ရင် solution file က files တွေကို နှစ်ခါ compile ဖြစ်စေပါလိမ့်မယ်)။ 3.0 ကစပြီး — `tsconfig.json` file တစ်ခုထဲမှာ `reference` အနည်းဆုံး တစ်ခု ရှိနေရင် empty [`files`](https://www.typescriptlang.org/tsconfig) array တစ်ခု ရှိတာက error မဟုတ်တော့ဘူးဆိုတာ သတိပြုပါ။

ဒါက ရိုးရှင်းတဲ့ entry point တစ်ခုကို ပေးပါတယ် — ဥပမာ TypeScript repo ထဲမှာ ကျွန်တော်တို့က `src/tsconfig.json` ထဲမှာ subprojects တွေ အားလုံးကို စာရင်းပြုထားလို့ — endpoints တွေ အားလုံးကို build ဖို့ `tsc -b src` ကိုပဲ run လုပ်ပါတယ်

ဒီပုံစံတွေကို TypeScript repo ထဲမှာ မြင်နိုင်ပါတယ် — key examples အဖြစ် `src/tsconfig-base.json`၊ `src/tsconfig.json` နဲ့ `src/tsc/tsconfig.json` တွေကို ကြည့်ပါ။

### Structuring for relative modules (Relative modules များအတွက် ဖွဲ့စည်းပုံ)

ယေဘုယျအားဖြင့် — relative modules တွေ သုံးတဲ့ repo တစ်ခုကို ပြောင်းဖို့ဆိုရင် သိပ်မလိုအပ်ပါဘူး။
မိဘ folder တစ်ခုရဲ့ subdirectory တိုင်းမှာ `tsconfig.json` file တစ်ခုစီ ထားလိုက်ပြီး — program ရဲ့ ရည်ရွယ်ထားတဲ့ အလွှာခွဲမှုနဲ့ ကိုက်ညီအောင် — ဒီ config files တွေဆီ `reference`s တွေ ထည့်လိုက်ရုံပါပဲ။
[`outDir`](https://www.typescriptlang.org/tsconfig) ကို output folder ရဲ့ ရှင်းလင်းတဲ့ subfolder တစ်ခုအဖြစ် သတ်မှတ်ရမယ် ဒါမှမဟုတ် — project folders တွေ အားလုံးရဲ့ common root ကို [`rootDir`](https://www.typescriptlang.org/tsconfig) အဖြစ် သတ်မှတ်ရပါလိမ့်မယ်။

### Structuring for outFiles (outFiles များအတွက် ဖွဲ့စည်းပုံ)

[`outFile`](https://www.typescriptlang.org/tsconfig) သုံးတဲ့ compilations တွေရဲ့ layout က ပိုပြီး လိုက်လျောညီထွေ ရှိပါတယ် — ဘာလို့လဲဆိုတော့ relative paths တွေက အဲဒီလောက် အရေးမကြီးလို့ပါ။
TypeScript repo ကိုယ်တိုင်က ဒီနေရာမှာ နမူနာကောင်းတစ်ခုပါ — ကျွန်တော်တို့မှာ "library" projects တချို့နဲ့ "endpoint" projects တချို့ ရှိပါတယ် — "endpoint" projects တွေကို တတ်နိုင်သမျှ သေးသေးလေးတွေ ထားပြီး — သူတို့ လိုအပ်တဲ့ libraries တွေကိုသာ ဆွဲယူပါတယ်။

