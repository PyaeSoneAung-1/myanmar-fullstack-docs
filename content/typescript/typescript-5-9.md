---
title: "TypeScript 5.9 (TypeScript 5.9 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 5.9 ရဲ့ ထူးခြားချက်တွေ — ရိုးရှင်းပြီး ခေတ်မီတဲ့ `tsconfig.json` ထုတ်ပေးတဲ့ `tsc --init` အသစ်, `import defer` ပံ့ပိုးမှု, `--module node20` option, DOM APIs တွေမှာ summary descriptions, expandable hovers preview, hover length သတ်မှတ်နိုင်မှု, performance optimizations တွေနဲ့ `lib.d.ts`/type argument inference ပြောင်းလဲမှုတွေ အကြောင်း"
order: 99
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html"
status: translated
updated: 2026-09-05
---

## Minimal and Updated `tsc --init` (Minimal နှင့် Updated `tsc --init`)

ခဏတာကြာအောင် TypeScript compiler က — လက်ရှိ directory ထဲမှာ `tsconfig.json` တစ်ခု ဖန်တီးပေးနိုင်တဲ့ `--init` flag တစ်ခုကို ပံ့ပိုးပေးခဲ့ပါတယ်။
လွန်ခဲ့တဲ့ နှစ်အနည်းငယ်အတွင်း — `tsc --init` run လုပ်တာက comment ချထားတဲ့ settings တွေနဲ့ သူတို့ရဲ့ ဖော်ပြချက်တွေနဲ့ ပြည့်နေတဲ့ သိပ်ကို "ပြည့်စုံတဲ့ (full)" `tsconfig.json` တစ်ခုကို ဖန်တီးပေးခဲ့ပါတယ်။
ဒါကို options တွေ ရှာဖွေတွေ့ရှိရလွယ်ပြီး — ဖွင့်ပိတ်လုပ်ရလွယ်အောင် ရည်ရွယ်ချက်နဲ့ ကျွန်တော်တို့ ဒီဇိုင်းဆွဲခဲ့တာပါ။

ဒါပေမယ့် — ပြင်ပ feedback တွေ (နဲ့ ကိုယ်တိုင် အတွေ့အကြုံ) အရ — ဒီ `tsconfig.json` files အသစ်တွေရဲ့ အကြောင်းအရာ အများစုကို လူတွေက ချက်ချင်း ဖျက်ပစ်တာ အဖြစ်များတယ်ဆိုတာ တွေ့ခဲ့ရပါတယ်။
သုံးစွဲသူတွေ option အသစ်တွေ ရှာချင်တဲ့အခါ — သူတို့က editor ရဲ့ auto-complete ကို အားပြုတာ ဒါမှမဟုတ် [ကျွန်တော်တို့ website ပေါ်က tsconfig reference](https://www.typescriptlang.org/tsconfig/) ဆီ သွားတာမျိုး လုပ်တာကို တွေ့ရပါတယ် (ထုတ်ပေးလိုက်တဲ့ `tsconfig.json` ကလည်း အဲဒီ page ဆီ link ချိတ်ပေးထားပါတယ်!)။
Setting တစ်ခုချင်းစီ ဘာလုပ်လဲဆိုတာကိုလည်း အဲဒီ page ပေါ်မှာပဲ document လုပ်ထားပြီး — editor ရဲ့ hovers/tooltips/quick info တွေကနေလည်း ကြည့်နိုင်ပါတယ်။
Comment ချထားတဲ့ settings တစ်ချို့ကို ပြသထားတာ အထောက်အကူ ဖြစ်စေနိုင်ပေမယ့် — ထုတ်ပေးလိုက်တဲ့ `tsconfig.json` က မကြာခဏဆိုသလို အလွန်အကျွံ (overkill) လို့ ယူဆခံရပါတယ်။

ပြီးတော့ — `tsc --init` က ကျွန်တော်တို့ လောလောဆယ် enable လုပ်ထားတာထက် ပိုပြီး သတ်မှတ်ပေးလို့ရတဲ့ (prescriptive) settings အနည်းငယ်နဲ့ initialize လုပ်သင့်တဲ့ အချိန် ရောက်ပြီလို့လည်း ခံစားမိပါတယ်။
သုံးစွဲသူတွေ TypeScript project အသစ်တစ်ခု ဖန်တီးတဲ့အခါ ကြုံရလေ့ရှိတဲ့ နာကျင်မှုအချက်တွေ (pain points) နဲ့ သေးငယ်တဲ့ စိတ်ညစ်စရာတွေ (papercuts) တစ်ချို့ကိုလည်း ကျွန်တော်တို့ လေ့လာကြည့်ခဲ့ပါတယ်။
ဥပမာ — သုံးစွဲသူအများစုက modules (global scripts တွေ မဟုတ်ဘဲ) ထဲမှာ ရေးကြတာမို့ — `--moduleDetection` က TypeScript ကို implementation file တိုင်းကို module တစ်ခုအနေနဲ့ သတ်မှတ်စေနိုင်ပါတယ်။
Developer တွေက သူတို့ရဲ့ runtime ထဲမှာ နောက်ဆုံးပေါ် ECMAScript features တွေကို တိုက်ရိုက် သုံးချင်လေ့ရှိတာမို့ — `--target` ကို ပုံမှန်အားဖြင့် `esnext` လို့ သတ်မှတ်နိုင်ပါတယ်။
JSX သုံးစွဲသူတွေက `--jsx` ကို သတ်မှတ်ဖို့ ပြန်သွားရတာက မလိုအပ်တဲ့ friction (အနှောင့်အယှက်) တစ်ခုလို့ မကြာခဏ ခံစားရပြီး — အဲဒီ option ရဲ့ ရွေးစရာတွေကလည်း နည်းနည်း ရှုပ်ထွေးပါတယ်။
ပြီးတော့ — projects တွေက TypeScript တကယ် လိုအပ်တာထက် `node_modules/@types` ကနေ declaration files တွေ ပိုပြီး load လုပ်မိတတ်ပါတယ်။ ဒါပေမယ့် empty ဖြစ်တဲ့ `types` array တစ်ခု သတ်မှတ်ပေးခြင်းက ဒါကို ကန့်သတ်ဖို့ အထောက်အကူ ပြုနိုင်ပါတယ်။

TypeScript 5.9 မှာ — တခြား flags တွေ မပါတဲ့ ရိုးရိုး `tsc --init` တစ်ခုက အောက်ပါ `tsconfig.json` ကို ထုတ်ပေးပါလိမ့်မယ်:

```json5
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    // "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig_modules
    "module": "nodenext",
    "target": "esnext",
    "types": [],
    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}
```

အသေးစိတ်တွေအတွက် — [implementing pull request](https://github.com/microsoft/TypeScript/pull/61813) နဲ့ [discussion issue](https://github.com/microsoft/TypeScript/issues/58420) တို့ကို ကြည့်ပါ။

## Support for `import defer` (import defer အတွက် ပံ့ပိုးမှု)

TypeScript 5.9 က `import defer` syntax အသစ်ကို သုံးပြီး [ECMAScript ရဲ့ deferred module evaluation proposal](https://github.com/tc39/proposal-defer-import-eval/) အတွက် ပံ့ပိုးမှုကို မိတ်ဆက်ပါတယ်။
ဒီ feature က module တစ်ခုနဲ့ ၎င်းရဲ့ dependencies တွေကို ချက်ချင်း execute မလုပ်ဘဲ import လုပ်ခွင့်ပေးပြီး — အလုပ်တွေနဲ့ side-effects တွေ ဘယ်အချိန်မှာ ဖြစ်ပွားလဲဆိုတာအပေါ် ပိုကောင်းတဲ့ ထိန်းချုပ်မှု ပေးပါတယ်။

ဒီ syntax က namespace imports တွေကိုပဲ ခွင့်ပြုပါတယ်:

```ts
import defer * as feature from "./some-feature.js";
```

`import defer` ရဲ့ အဓိက အကျိုးကျေးဇူးက — module တစ်ခုကို ၎င်းရဲ့ export တစ်ခုခုကို ပထမဆုံး အကြိမ် ဝင်ရောက်သုံးစွဲတဲ့အခါမှသာ evaluate လုပ်တာ ဖြစ်ပါတယ်။
ဒီဥပမာကို သုံးသပ်ကြည့်ပါ:

```ts
// ./some-feature.ts
initializationWithSideEffects();

function initializationWithSideEffects() {
  // ...
  specialConstant = 42;

  console.log("Side effects have occurred!");
}

export let specialConstant: number;
```

`import defer` သုံးတဲ့အခါ — `initializationWithSideEffects()` function က import လုပ်ထားတဲ့ namespace ရဲ့ property တစ်ခုကို တကယ် ဝင်ရောက်သုံးစွဲတဲ့အထိ ခေါ်ဆိုခံရမှာ မဟုတ်ပါဘူး:

```ts
import defer * as feature from "./some-feature.js";

// No side effects have occurred yet

// ...

// As soon as `specialConstant` is accessed, the contents of the `feature`
// module are run and side effects have taken place.
console.log(feature.specialConstant); // 42
```

Module ရဲ့ evaluation က module ပေါ်က member တစ်ခုကို ဝင်ရောက်သုံးစွဲတဲ့အထိ ရွှေ့ဆိုင်းထားတာမို့ — `import defer` နဲ့ named imports တွေ ဒါမှမဟုတ် default imports တွေကို သုံးလို့ မရပါဘူး:

```ts
// ❌ Not allowed
import defer { doSomething } from "some-module";

// ❌ Not allowed  
import defer defaultExport from "some-module";

// ✅ Only this syntax is supported
import defer * as feature from "some-module";
```

`import defer` ရေးတဲ့အခါ — module နဲ့ ၎င်းရဲ့ dependencies တွေက အပြည့်အဝ load လုပ်ပြီး — execution အတွက် အသင့်ဖြစ်နေပြီဆိုတာ သတိပြုပါ။
ဆိုလိုတာက — module က တည်ရှိဖို့ လိုပြီး — file system ဒါမှမဟုတ် network resource တစ်ခုကနေ load လုပ်ခံရမှာ ဖြစ်ပါတယ်။
ပုံမှန် `import` နဲ့ `import defer` ကြားက အဓိက ကွာခြားချက်က — import လုပ်ထားတဲ့ namespace ရဲ့ property တစ်ခုကို ဝင်ရောက်သုံးစွဲတဲ့အထိ *statements နဲ့ declarations တွေရဲ့ execution* ကို ရွှေ့ဆိုင်းထားတာ ဖြစ်ပါတယ်။

ဒီ feature က ဈေးကြီးတဲ့ ဒါမှမဟုတ် platform-specific ဖြစ်တဲ့ initialization ရှိတဲ့ modules တွေကို conditional အနေနဲ့ load လုပ်ဖို့ အထူးသင့်လျော်ပါတယ်။
App features တွေအတွက် module evaluation ကို တကယ်လိုအပ်တဲ့အထိ ရွှေ့ဆိုင်းထားခြင်းအားဖြင့် startup performance ကိုလည်း တိုးတက်စေနိုင်ပါတယ်။

`import defer` ကို TypeScript က လုံးဝ transform လုပ်တာ ဒါမှမဟုတ် "downlevel" (ဗားရှင်းအဟောင်းဆီ ပြန်ချ) လုပ်တာ မလုပ်ဘူးဆိုတာ သတိပြုပါ။
ဒါက ဒီ feature ကို native အနေနဲ့ ပံ့ပိုးတဲ့ runtimes တွေမှာ ဒါမှမဟုတ် သင့်လျော်တဲ့ transformation ကို လုပ်ပေးနိုင်တဲ့ bundlers လိုမျိုး tools တွေမှာ သုံးဖို့ ရည်ရွယ်ထားပါတယ်။
ဆိုလိုတာက — `import defer` က `--module` modes ဖြစ်တဲ့ `preserve` နဲ့ `esnext` အောက်မှာပဲ အလုပ်လုပ်မှာ ဖြစ်ပါတယ်။

TC39 ထဲမှာ ဒီ proposal ကို ဦးဆောင်တင်ပြခဲ့ပြီး — [ဒီ feature အတွက် implementation](https://github.com/microsoft/TypeScript/pull/60757) ကိုပါ ပံ့ပိုးပေးခဲ့တဲ့ [Nicolò Ribaudo](https://github.com/nicolo-ribaudo) ကို ကျေးဇူးတင်ရှိပါတယ်။

## Support for `--module node20` (--module node20 အတွက် ပံ့ပိုးမှု)

TypeScript က `--module` နဲ့ `--moduleResolution` settings တွေအတွက် `node*` options အများအပြားကို ပေးထားပါတယ်။
မကြာသေးမီကပဲ — `--module nodenext` က CommonJS modules တွေကနေ ECMAScript modules တွေကို `require()` လုပ်နိုင်စွမ်းကို ပံ့ပိုးပြီး — standards နဲ့ ကိုက်ညီတဲ့ [import attributes](https://github.com/tc39/proposal-import-attributes) တွေကို ဦးစားပေးကာ import assertions တွေကို မှန်မှန်ကန်ကန် ငြင်းပယ်ပါတယ်။

TypeScript 5.9 က ဒီ settings တွေအတွက် Node.js v20 ရဲ့ အပြုအမူကို ပုံစံပြုဖို့ ရည်ရွယ်ထားတဲ့ `node20` လို့ခေါ်တဲ့ တည်ငြိမ်တဲ့ option တစ်ခုကို ယူဆောင်လာပါတယ်။
ဒီ option က `--module nodenext` ဒါမှမဟုတ် `--moduleResolution nodenext` တို့နဲ့ မတူဘဲ — အနာဂတ်မှာ အပြုအမူအသစ်တွေ ပါဝင်လာဖို့ မဖြစ်နိုင်လောက်ပါဘူး။
ပြီးတော့ — `nodenext` နဲ့ မတူဘဲ — `--module node20` ကို သတ်မှတ်လိုက်ရင် — တခြား configure မလုပ်ထားဘူးဆိုရင် `--target es2023` ကို အလိုလို ပါဝင်စေပါလိမ့်မယ်။
`--module nodenext` ကတော့ — ရေပေါ် (floating) သဘောရှိတဲ့ `--target esnext` ကို အလိုလို ပါဝင်စေပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [implementation ကို ဒီမှာ ကြည့်ရှုပါ](https://github.com/microsoft/TypeScript/pull/61805)။

## Summary Descriptions in DOM APIs (DOM APIs များတွင် Summary Descriptions)

အရင်က — TypeScript ထဲက DOM APIs တွေအများစုက အဲဒီ API အတွက် MDN documentation ဆီကိုပဲ link ချိတ်ပေးထားပါတယ်။
ဒီ links တွေက အသုံးဝင်ပေမယ့် — API က ဘာလုပ်လဲဆိုတဲ့ အမြန် အကျဉ်းချုပ် (quick summary) တစ်ခုကိုတော့ မပေးခဲ့ပါဘူး။
[Adam Naji](https://github.com/Bashamega) ရဲ့ ပြောင်းလဲမှု အနည်းငယ်ကြောင့် — TypeScript က ယခုဆို MDN documentation ကို အခြေခံပြီး DOM APIs အများအပြားအတွက် summary descriptions တွေ ထည့်သွင်းပေးထားပါတယ်။
ဒီပြောင်းလဲမှုတွေထဲက နောက်ထပ်တွေကို [ဒီမှာ](https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1993) နဲ့ [ဒီမှာ](https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1940) ကြည့်နိုင်ပါတယ်။

## Expandable Hovers (Preview) (ချဲ့ထွင်နိုင်သော Hovers — Preview)

*Quick Info* ("editor tooltips" နဲ့ "hovers" လို့လည်း ခေါ်တဲ့) က variables တွေကို ငုံ့ကြည့်ပြီး သူတို့ရဲ့ types တွေ မြင်ရဖို့ — ဒါမှမဟုတ် type aliases တွေကို ကြည့်ပြီး သူတို့ တကယ်ရည်ညွှန်းနေတာကို မြင်ရဖို့ — သိပ်ကို အသုံးဝင်နိုင်ပါတယ်။
ဒါပေမယ့် — quick info tooltip ထဲမှာ ပြသထားတာကနေ *ပိုနက်ရှိုင်းစွာ ဝင်ရောက်ပြီး* အသေးစိတ်တွေ ရယူချင်တာက လူတွေအတွက် အဖြစ်များပါတယ်။
ဥပမာ — အောက်ပါ ဥပမာထဲက `options` parameter အပေါ်မှာ mouse ကို hover လုပ်ကြည့်ရင်:

```ts
export function drawButton(options: Options): void
```

`(parameter) options: Options` ဆိုတာကိုပဲ မြင်ရပါလိမ့်မယ်။

![Tooltip for a parameter declared as `options` which just shows `options: Options`.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2025/06/bare-hover-5.8-01.png)

ဒီ value မှာ ဘယ် members တွေ ရှိလဲဆိုတာ ကြည့်ဖို့ — `Options` type ရဲ့ definition ဆီ တကယ်ပဲ ခုန်သွားဖို့ လိုအပ်ပါသလား?

အရင်က — တကယ်တမ်း အဲဒီလိုပဲ ဖြစ်ခဲ့ပါတယ်။
ဒီနေရာမှာ အကူအညီဖြစ်ဖို့ — TypeScript 5.9 က *expandable hovers* ဒါမှမဟုတ် "quick info verbosity" လို့ခေါ်တဲ့ feature တစ်ခုကို ယခု preview လုပ်နေပါတယ်။
VS Code လိုမျိုး editor တစ်ခုကို သုံးနေရင် — ဒီ hover tooltips တွေရဲ့ ဘယ်ဘက်မှာ `+` နဲ့ `-` ခလုတ်တွေကို အခုဆို မြင်ရပါလိမ့်မယ်။
`+` ခလုတ်ကို နှိပ်ရင် types တွေကို ပိုနက်ရှိုင်းစွာ ချဲ့ထွင်ပြသပြီး — `-` ခလုတ်ကို နှိပ်ရင်တော့ နောက်ဆုံး မြင်ကွင်းဆီ ပြန်ခေါက်သွားပါလိမ့်မယ်။

ဒီ feature က လက်ရှိမှာ preview အဆင့်မှာ ရှိပြီး — TypeScript နဲ့ Visual Studio Code ပေါ်က ကျွန်တော်တို့ရဲ့ partners တွေ နှစ်ခုလုံးအတွက် feedback တွေ ရှာဖွေနေပါတယ်။
အသေးစိတ်တွေအတွက် — [ဒီ feature အတွက် PR ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/59940)။

## Configurable Maximum Hover Length (Configure လုပ်နိုင်သော Maximum Hover Length)

ရံဖန်ရံခါ — quick info tooltips တွေက သိပ်ရှည်လွန်းလာတဲ့အခါ TypeScript က ပိုဖတ်ရလွယ်အောင် ၎င်းတို့ကို ဖြတ်တောက်ပစ်ပါတယ်။
ဒီမှာ ဆိုးကျိုးက — အရေးအကြီးဆုံး အချက်အလက်တွေက hover tooltip ကနေ မကြာခဏ ချန်လှပ်ပစ်ခံရတာမို့ — စိတ်ပျက်စရာ ဖြစ်စေနိုင်ပါတယ်။
ဒါကို ကူညီဖို့ — TypeScript 5.9 ရဲ့ language server က configure လုပ်နိုင်တဲ့ hover length တစ်ခုကို ပံ့ပိုးပြီး — VS Code မှာ `js/ts.hover.maximumLength` setting ကနေ configure လုပ်နိုင်ပါတယ်။

ထို့ပြင် — hover length ရဲ့ default အသစ်က အရင် default ထက် သိသိသာသာ ပိုကြီးပါတယ်။
ဆိုလိုတာက TypeScript 5.9 မှာ — default အနေနဲ့ ကိုယ့်ရဲ့ hover tooltips တွေထဲမှာ အချက်အလက် ပိုများများ မြင်ရမှာ ဖြစ်ပါတယ်။
အသေးစိတ်တွေအတွက် — [ဒီ feature အတွက် PR ကို ဒီမှာ](https://github.com/microsoft/TypeScript/pull/61662) နဲ့ [Visual Studio Code ဆီ သက်ဆိုင်ရာ ပြောင်းလဲမှုကို ဒီမှာ](https://github.com/microsoft/vscode/pull/248181) ကြည့်ပါ။

## Optimizations (Optimization များ)

### Cache Instantiations on Mappers (Mappers များပေါ်တွင် Cache Instantiations)

TypeScript က type parameters တွေကို specific type arguments တွေနဲ့ အစားထိုးတဲ့အခါ — တူညီတဲ့ intermediate types အများအပြားကို ထပ်ခါထပ်ခါ instantiate လုပ်မိတတ်ပါတယ်။
Zod နဲ့ tRPC လိုမျိုး ရှုပ်ထွေးတဲ့ libraries တွေမှာ — ဒါက performance ပြဿနာတွေရော — excessive type instantiation depth (type instantiation အနက် လွန်ကဲမှု) နဲ့ ပတ်သတ်တဲ့ errors တွေရော ဖြစ်ပေါ်စေနိုင်ပါတယ်။
[Mateusz Burzyński](https://github.com/Andarist) ရဲ့ [ပြောင်းလဲမှုတစ်ခု](https://github.com/microsoft/TypeScript/pull/61505) ကြောင့် — TypeScript 5.9 က specific type instantiation တစ်ခုအပေါ် အလုပ် စတင်နေပြီဆိုရင် intermediate instantiations အများအပြားကို cache လုပ်နိုင်ပါပြီ။
ဒါက မလိုအပ်တဲ့ အလုပ်တွေနဲ့ allocations တွေ အများကြီးကို ရှောင်ရှားပေးပါတယ်။

### Avoiding Closure Creation in `fileOrDirectoryExistsUsingSource` (fileOrDirectoryExistsUsingSource ထဲတွင် Closure ဖန်တီးခြင်းကို ရှောင်ကြဉ်ခြင်း)

JavaScript မှာ — function expression တစ်ခုက wrapper function က arguments တွေကို captured variables မရှိတဲ့ တခြား function တစ်ခုဆီ ရုံးသွင်းပေးနေရုံပဲ ဆိုတာတောင် — ပုံမှန်အားဖြင့် function object အသစ်တစ်ခုကို allocate လုပ်ပါတယ်။
File တည်ရှိမှု စစ်ဆေးချက်တွေ ဝန်းကျင်က code paths တွေမှာ — [Vincent Bailly](https://github.com/VincentBailly) က — အခြေခံ functions တွေက argument တစ်ခုတည်းပဲ လက်ခံတာတောင် — ဒီလို pass-through function ခေါ်ဆိုမှုတွေရဲ့ ဥပမာတွေကို ရှာဖွေတွေ့ရှိခဲ့ပါတယ်။
Project ကြီးတွေမှာ ဖြစ်ပွားနိုင်တဲ့ existence checks အရေအတွက်ကို ထည့်တွက်ရင် — သူက 11% ဝန်းကျင် မြန်ဆန်လာတယ်လို့ ကိုးကားဖော်ပြခဲ့ပါတယ်။
[ဒီပြောင်းလဲမှုအကြောင်း နောက်ထပ်ကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/61822/)။

## Notable Behavioral Changes (သတိပြုသင့်သော Behavioral Changes များ)

### `lib.d.ts` Changes (`lib.d.ts` ပြောင်းလဲမှုများ)

DOM အတွက် ထုတ်ပေးတဲ့ Types တွေက ကိုယ့် codebase ရဲ့ type-checking အပေါ် သက်ရောက်မှု ရှိနိုင်ပါတယ်။

ထို့ပြင် — မှတ်သားလောက်တဲ့ ပြောင်းလဲမှုတစ်ခုက — `ArrayBuffer` ကို `TypedArray` types အမျိုးမျိုးရဲ့ supertype မဟုတ်တော့အောင် ပြောင်းလဲလိုက်တာ ဖြစ်ပါတယ်။
ဒါက `UInt8Array` ရဲ့ subtypes တွေ — Node.js က `Buffer` လိုမျိုး — ပါ ပါဝင်ပါတယ်။
ရလဒ်အနေနဲ့ — အောက်ပါလိုမျိုး error messages အသစ်တွေကို မြင်ရပါလိမ့်မယ်:

```
error TS2345: Argument of type 'ArrayBufferLike' is not assignable to parameter of type 'BufferSource'.
error TS2322: Type 'ArrayBufferLike' is not assignable to type 'ArrayBuffer'.
error TS2322: Type 'Buffer' is not assignable to type 'Uint8Array<ArrayBufferLike>'.
error TS2322: Type 'Buffer' is not assignable to type 'ArrayBuffer'.
error TS2345: Argument of type 'Buffer' is not assignable to parameter of type 'string | Uint8Array<ArrayBufferLike>'.
```

`Buffer` နဲ့ ပြဿနာတွေ ကြုံရရင် — ပထမဆုံး `@types/node` package ရဲ့ နောက်ဆုံးဗားရှင်းကို သုံးနေလားဆိုတာ စစ်ဆေးကြည့်ချင်ပါလိမ့်မယ်။
ဒါက အောက်ပါအတိုင်း run လုပ်တာ ပါဝင်နိုင်ပါတယ်

```
npm update @types/node --save-dev
```

အများစုမှာ — default `ArrayBufferLike` သုံးမယ့်အစား ပိုတိကျတဲ့ underlying buffer type တစ်ခုကို သတ်မှတ်ပေးတာက ဖြေရှင်းနည်း ဖြစ်ပါတယ် (ဆိုလိုတာက — ရိုးရိုး `Uint8Array` အစား `Uint8Array<ArrayBuffer>` လို့ တိတိကျကျ ရေးထုတ်တာမျိုး)။
`Uint8Array` လိုမျိုး `TypedArray` တစ်ခုခုကို `ArrayBuffer` ဒါမှမဟုတ် `SharedArrayBuffer` မျှော်လင့်တဲ့ function တစ်ခုဆီ ပို့လိုက်တဲ့ အခြေအနေတွေမှာ — အောက်ပါဥပမာထဲကလိုပဲ — အဲဒီ `TypedArray` ရဲ့ `buffer` property ကို ဝင်ရောက်သုံးကြည့်လို့လည်း ရပါတယ်:

```diff
  let data = new Uint8Array([0, 1, 2, 3, 4]);
- someFunc(data)
+ someFunc(data.buffer)
```

## Type Argument Inference Changes (Type Argument Inference ပြောင်းလဲမှုများ)

Inference အတွင်းမှာ type variables တွေ "ယိုစိမ့်မှု (leaks)" ဖြစ်တာကို ပြုပြင်ဖို့ အားထုတ်မှုအနေနဲ့ — TypeScript 5.9 က codebases တစ်ချို့မှာ types တွေထဲမှာ ပြောင်းလဲမှုတွေနဲ့ ဖြစ်နိုင်ခြေရှိတဲ့ errors အသစ်တွေကို မိတ်ဆက်နိုင်ပါတယ်။
ဒါတွေက ကြိုတင် ခန့်မှန်းရခက်ပေမယ့် — generic function ခေါ်ဆိုမှုတွေဆီ type arguments တွေ ထည့်ပေးခြင်းအားဖြင့် မကြာခဏ ပြုပြင်နိုင်ပါတယ်။
[အသေးစိတ်တွေကို ဒီမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/61668)။
