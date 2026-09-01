---
title: "Type Declarations (Type Declarations များ)"
description: "Type declarations အကြောင်း — .d.ts files, built-in type definitions, target/lib settings, external definitions (bundled types, DefinitelyTyped/@types, ကိုယ်ပိုင် definitions)"
order: 14
source: "https://www.typescriptlang.org/docs/handbook/2/type-declarations.html"
status: translated
updated: 2026-09-01
---

အခုထိ သင်ဖတ်ပြီးခဲ့တဲ့ sections တွေတစ်လျှောက်မှာ — JavaScript runtimes တွေအားလုံးမှာ ရှိတဲ့ built-in functions တွေကိုသုံးပြီး TypeScript ရဲ့ အခြေခံ concept တွေကို သရုပ်ပြခဲ့ပါတယ်။ ဒါပေမယ့် — ဒီနေ့ခေတ် JavaScript နီးပါးအားလုံးက သာမာန်အလုပ်တွေ ဆောင်ရွက်ဖို့ library တွေ အများကြီး ပါဝင်ပါတယ်။ သင့် application ထဲက _ကိုယ်ပိုင်_ code မဟုတ်တဲ့ အစိတ်အပိုင်းတွေအတွက် types တွေ ရှိနေတာက — သင့် TypeScript အတွေ့အကြုံကို များစွာ တိုးတက်စေပါလိမ့်မယ်။ ဒီ types တွေက ဘယ်ကနေ လာတာလဲ?

## Type Declarations တွေက ဘယ်လိုပုံစံလဲ

ဒီလိုမျိုး code တစ်ချို့ ရေးတယ် ဆိုပါစို့:

```ts
const k = Math.max(5, 6);
const j = Math.mix(7, 8);
```

`Math` ရဲ့ implementation က သင့် code ထဲမှာ မပါဘူးဆိုတောင် — TypeScript က `max` က ရှိပြီး `mix` က မရှိဘူးဆိုတာ ဘယ်လို သိတာလဲ?

အဖြေကတော့ — ဒီ built-in objects တွေကို ဖော်ပြတဲ့ _declaration files_ တွေ ရှိလို့ပါ။ Declaration file က — types တွေ ဒါမှမဟုတ် values တွေရဲ့ တည်ရှိမှုကို _declare_ (ကြေညာ) လုပ်ဖို့ နည်းလမ်း ပေးပါတယ် — အဲဒီ values တွေအတွက် implementations တွေ တကယ် ပေးစရာ မလိုပါဘူး။

## `.d.ts` Files

TypeScript မှာ ဖိုင် အဓိက နှစ်မျိုး ရှိပါတယ်။ `.ts` files တွေက — types တွေနဲ့ executable code တွေ ပါဝင်တဲ့ _implementation_ (အကောင်အထည်ဖော်) files တွေပါ။ ဒါတွေက `.js` outputs တွေ ထုတ်ပေးတဲ့ files တွေဖြစ်ပြီး — သင်ပုံမှန် code ရေးလေ့ရှိတဲ့ နေရာတွေလည်း ဖြစ်ပါတယ်။

`.d.ts` files တွေကတော့ — type information တွေကိုပဲ _သာ_ ပါဝင်တဲ့ _declaration_ (ကြေညာချက်) files တွေပါ။ ဒီ files တွေက `.js` outputs တွေ မထုတ်ပေးပါဘူး; typechecking အတွက်ပဲ သုံးပါတယ်။ ကိုယ်ပိုင် declaration files တွေ ဘယ်လို ရေးမလဲဆိုတာကို နောက်ပိုင်းမှာ ပိုပြီး လေ့လာပါမယ်။

## Built-in Type Definitions

TypeScript မှာ JavaScript runtimes တွေမှာ ရနိုင်တဲ့ standardized built-in APIs တွေ အားလုံးအတွက် declaration files တွေ ပါဝင်ပါတယ်။ အဲဒါတွေထဲမှာ — `string` ဒါမှမဟုတ် `function` လိုမျိုး built-in types တွေရဲ့ methods တွေနဲ့ properties တွေ ၊ `Math` နဲ့ `Object` လိုမျိုး top-level names တွေ ၊ ပြီးတော့ သူတို့နဲ့ ဆက်စပ်တဲ့ types တွေ ပါဝင်ပါတယ်။ Default အနေနဲ့ — TypeScript က browser ထဲမှာ run တဲ့အခါ ရနိုင်တဲ့အရာတွေအတွက် types တွေလည်း ထည့်သွင်းပေးပါတယ် — `window` နဲ့ `document` လိုမျိုးပေါ့။ ဒါတွေကို စုပေါင်းပြီး DOM APIs လို့ ခေါ်ပါတယ်။

TypeScript က ဒီ declaration files တွေကို `lib.[something].d.ts` ဆိုတဲ့ pattern နဲ့ နာမည်ပေးပါတယ်။ အဲဒီလို နာမည်ပါတဲ့ ဖိုင်တစ်ခုထဲကို ဝင်ကြည့်ရင် — ဒါက user code မဟုတ်ဘဲ platform ရဲ့ built-in အစိတ်အပိုင်းတစ်ခု ဆိုတာ သိရှိနိုင်ပါတယ်။

### `target` Setting

သင့်အတွက် ရနိုင်တဲ့ methods တွေ ၊ properties တွေ ၊ functions တွေက — သင့် code run နေတဲ့ JavaScript ရဲ့ _version_ ပေါ်မူတည်ပြီး တကယ်တော့ ကွဲပြားပါတယ်။ ဥပမာ — strings တွေရဲ့ `startsWith` method က _ECMAScript 6_ လို့ခေါ်တဲ့ JavaScript version ကစပြီးမှပဲ ရနိုင်ပါတယ်။

သင့် code က နောက်ဆုံး ဘယ် JavaScript version ပေါ်မှာ run မယ်ဆိုတာ သတိထားဖို့ အရေးကြီးပါတယ် — ဘာလို့လဲဆိုတော့ သင်ဖြန့်ချိ (deploy) တဲ့ platform ထက် အသစ်တဲ့ version ကလာတဲ့ APIs တွေကို မသုံးချင်လို့ပါ။ ဒါက [`target`](https://www.typescriptlang.org/tsconfig#target) compiler setting ရဲ့ လုပ်ဆောင်ချက်တစ်ခုပါ။

TypeScript က — သင့် [`target`](https://www.typescriptlang.org/tsconfig#target) setting ပေါ်မူတည်ပြီး default အနေနဲ့ ဘယ် `lib` files တွေ ပါဝင်မလဲ ပြောင်းလဲပေးခြင်းအားဖြင့် ဒီပြဿနာကို ဖြေရှင်းပေးပါတယ်။ ဥပမာ — [`target`](https://www.typescriptlang.org/tsconfig#target) က `ES5` ဆိုရင် `startsWith` method ကို သုံးဖို့ ကြိုးစားတဲ့အခါ error တက်ပါလိမ့်မယ် — ဘာလို့လဲဆိုတော့ အဲဒီ method က `ES6` ဒါမှမဟုတ် နောက်ပိုင်းမှပဲ ရနိုင်လို့ပါ။

### `lib` Setting

[`lib`](https://www.typescriptlang.org/tsconfig#lib) setting က — သင့် program ထဲမှာ ရနိုင်တယ်လို့ သတ်မှတ်ထားတဲ့ built-in declaration files တွေကို ပိုမို ချောမွေ့စွာ (fine-grained) ထိန်းချုပ်နိုင်စေပါတယ်။ အသေးစိတ် အချက်အလက်တွေအတွက် [`lib`](https://www.typescriptlang.org/tsconfig#lib) ရဲ့ documentation page ကို ကြည့်ပါ။

## External Definitions (ပြင်ပ Definitions)

Built-in မဟုတ်တဲ့ APIs တွေအတွက်တော့ — declaration files တွေ ရနိုင်တဲ့ နည်းလမ်း အမျိုးမျိုး ရှိပါတယ်။ ဘယ်လို လုပ်မလဲဆိုတာက — သင်ဘယ် library အတွက် types တွေ ယူနေလဲဆိုတာအပေါ် မူတည်ပါတယ်။

### Bundled Types (ပါဝင်ပြီးသား Types)

သင်သုံးနေတဲ့ library တစ်ခုက npm package အနေနဲ့ ဖြန့်ဝေထားတာဆိုရင် — သူ့ရဲ့ distribution ထဲမှာ type declaration files တွေ ပါပြီးသား ဖြစ်နိုင်ပါတယ်။ Project ရဲ့ documentation ကို ဖတ်ပြီး သိနိုင်သလို — ဒါမှမဟုတ် package ကို ရိုးရိုး import ကြည့်ပြီး TypeScript က types တွေကို အလိုအလျောက် resolve လုပ်ပေးနိုင်လားဆိုတာ ကြည့်လို့လည်း ရပါတယ်။

Package ရေးသားသူ (author) တစ်ယောက်အနေနဲ့ — သင့် package နဲ့အတူ type definitions တွေ ထည့်သွင်းဖို့ စဉ်းစားနေတယ်ဆိုရင် — [bundling type definitions](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package) ဆိုတဲ့ ကျွန်တော်တို့ရဲ့ guide ကို ဖတ်နိုင်ပါတယ်။

### DefinitelyTyped / `@types`

[DefinitelyTyped repository](https://github.com/DefinitelyTyped/DefinitelyTyped/) က — library ထောင်ပေါင်းများစွာရဲ့ declaration files တွေကို သိမ်းဆည်းထားတဲ့ centralized repo ပါ။ အသုံးများတဲ့ libraries တွေရဲ့ များပြားလှတဲ့ အများစုက DefinitelyTyped ပေါ်မှာ declaration files တွေ ရနိုင်ပါတယ်။

DefinitelyTyped ပေါ်က Definitions တွေကို `@types` scope အောက်မှာ npm ပေါ်ကို အလိုအလျောက် publish လုပ်ပေးပါတယ်။ Types package ရဲ့ နာမည်က အမြဲတမ်း အခြေခံ package ကိုယ်တိုင်၏ နာမည်နဲ့ အတူတူပါပဲ။ ဥပမာ — သင်က `react` npm package ကို install လုပ်ထားတယ်ဆိုရင် — သူ့ရဲ့ corresponding types တွေကို ဒီလို run ပြီး install လုပ်နိုင်ပါတယ်:

```sh
npm install --save-dev @types/react
```

TypeScript က `node_modules/@types` အောက်မှာ type definitions တွေကို အလိုအလျောက် ရှာတွေ့ပါတယ် — ဒါကြောင့် ဒီ types တွေ သင့် program ထဲမှာ ရနိုင်ဖို့ နောက်ထပ် ဘယ်အဆင့်မှ မလိုပါဘူး။

### ကိုယ်ပိုင် Definitions များ

Library တစ်ခုက ကိုယ်ပိုင် types တွေ bundle မလုပ်ထားဘဲ DefinitelyTyped ပေါ်မှာလည်း definition မရှိတဲ့ ရှားပါးတဲ့ အခြေအနေဆိုရင် — သင်ကိုယ်တိုင် declaration file တစ်ခု ရေးနိုင်ပါတယ်။ Guide အတွက် appendix ထဲက [Writing Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) ကို ကြည့်ပါ။

Declaration file တစ်ခု မရေးဘဲ — သီးခြား module တစ်ခုအကြောင်း warnings တွေကို တိတ်ဆိတ်စေချင်ရင် — သင့် project ထဲက `.d.ts` ဖိုင်တစ်ခုထဲမှာ အဲဒီ module အတွက် empty declaration တစ်ခု ထည့်ခြင်းအားဖြင့် module ကို type `any` အဖြစ် အမြန် (quick) declare လုပ်နိုင်ပါတယ်။ ဥပမာ — definitions တွေ မရှိဘဲ `some-untyped-module` လို့ခေါ်တဲ့ module တစ်ခုကို သုံးချင်တယ်ဆိုရင် — ဒီလို ရေးလိုက်ပါ:

```ts
declare module "some-untyped-module";
```
