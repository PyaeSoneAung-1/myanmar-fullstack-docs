---
title: "Namespaces and Modules (Namespace နဲ့ Modules)"
description: "TypeScript မှာ modules နဲ့ namespaces သုံးပြီး code စုစည်းခြင်း၊ သုံးတဲ့အခါ ကြုံရတတ်တဲ့ အဖြစ်များသော ပြဿနာများနဲ့ ရှောင်နည်းများ"
order: 61
source: "https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html"
status: translated
updated: 2026-09-05
---

ဒီ post က TypeScript မှာ modules နဲ့ namespaces တွေကို သုံးပြီး — သင့် code ကို စနစ်တကျ စုစည်းနိုင်တဲ့ နည်းလမ်းအမျိုးမျိုးကို အကျဉ်းချုပ် ဖော်ပြထားပါတယ်။
Namespaces နဲ့ modules တွေကို ဘယ်လို သုံးရမလဲဆိုတဲ့ အဆင့်မြင့် (advanced) အကြောင်းအရာတချို့ကိုလည်း ဖြတ်သန်းသွားမှာ ဖြစ်ပြီး — TypeScript မှာ သူတို့ကို သုံးတဲ့အခါ ကြုံရတတ်တဲ့ အဖြစ်များသော ပြဿနာတချို့ကိုလည်း ဖြေရှင်းပေးသွားပါမယ်။

ES Modules အကြောင်း ပိုမိုသိရှိလိုပါက [Modules](https://www.typescriptlang.org/docs/handbook/modules.html) documentation ကို ကြည့်ပါ။
TypeScript namespaces အကြောင်း ပိုမိုသိရှိလိုပါက [Namespaces](/docs/typescript/namespaces) documentation ကို ကြည့်ပါ။

မှတ်ချက်: TypeScript ရဲ့ _အလွန်_ ရှေးကျတဲ့ version တွေမှာ namespaces တွေကို 'Internal Modules' လို့ ခေါ်ခဲ့ပြီး — ဒါတွေက JavaScript module systems တွေ မပေါ်ခင်ကတည်းက တည်ရှိခဲ့တာတွေ ဖြစ်ပါတယ်။

## Using Modules (Modules သုံးခြင်း)

Modules တွေမှာ code တွေရော declarations တွေရော နှစ်မျိုးလုံး ပါဝင်နိုင်ပါတယ်။

Modules တွေက module loader (ဥပမာ — CommonJs/Require.js စသည်) တစ်ခု ဒါမှမဟုတ် ES Modules တွေကို ပံ့ပိုးတဲ့ runtime တစ်ခုအပေါ်မှာလည်း မှီခိုပါတယ်။
Modules တွေက code ကို ပြန်လည်အသုံးပြုမှု ပိုကောင်းစေပြီး — အထီးကျန်မှု (isolation) ပိုခိုင်မာစေကာ — bundling လုပ်ဖို့ tooling အကူအညီတွေလည်း ပိုကောင်းစေပါတယ်။

သတိပြုသင့်တာက — Node.js applications တွေအတွက်ဆိုရင် modules တွေက ပုံမှန် (default) ဖြစ်ပြီး — **ခေတ်သစ် code တွေမှာ namespaces တွေထက် modules တွေကိုပဲ သုံးဖို့ အကြံပြုပါတယ်**။

ECMAScript 2015 ကစပြီး — modules တွေက language ရဲ့ မွေးရာပါ အစိတ်အပိုင်း ဖြစ်လာပြီး — စံချိန်စံညွှန်းနဲ့ ကိုက်ညီတဲ့ engine implementations တိုင်းမှာ ပံ့ပိုးပေးသင့်ပါတယ်။
ဒါကြောင့် — project အသစ်တွေအတွက်ဆိုရင် modules တွေက ထောက်ခံထားတဲ့ code စုစည်းမှု ယန္တရား ဖြစ်ပါတယ်။

## Using Namespaces (Namespaces သုံးခြင်း)

Namespaces တွေက TypeScript အတွက် သီးသန့် ဖြစ်တဲ့ code စုစည်းနည်းတစ်ခုပါ။  
Namespaces တွေဆိုတာ — global namespace ထဲက ရိုးရိုး အမည်ပေးထားတဲ့ JavaScript objects တွေပါပဲ။
ဒါက namespaces တွေကို သုံးရ အလွန်လွယ်ကူတဲ့ construct တစ်ခု ဖြစ်စေပါတယ်။
Modules တွေနဲ့ မတူဘဲ — သူတို့က file အများကြီးကို လွှမ်းခြုံနိုင်ပြီး — [`outFile`](https://www.typescriptlang.org/tsconfig) သုံးပြီး ပေါင်းစပ်နိုင်ပါတယ်။
Namespaces တွေက — dependencies အားလုံးကို သင့် HTML page ထဲမှာ `<script>` tags တွေအနေနဲ့ ထည့်သွင်းထားတဲ့ Web Application တစ်ခုမှာ code တွေကို ဖွဲ့စည်းဖို့ ကောင်းမွန်တဲ့ နည်းလမ်းတစ်ခု ဖြစ်နိုင်ပါတယ်။

Global namespace pollution (global namespace ထဲကို အမည်တွေ အလွန်အကျွံ ပြန့်ကျဲစေခြင်း) အားလုံးလိုပဲ — component dependencies တွေကို ဖော်ထုတ်ဖို့ ခက်ခဲစေနိုင်ပြီး — အထူးသဖြင့် application ကြီးတစ်ခုမှာဆိုရင် ပိုဆိုးပါတယ်။

## Pitfalls of Namespaces and Modules (Namespaces နဲ့ Modules ရဲ့ ထောင်ချောက်များ)

ဒီ section မှာ — namespaces နဲ့ modules တွေ သုံးတဲ့အခါ ကြုံရတတ်တဲ့ အဖြစ်များတဲ့ ပြဿနာမျိုးစုံနဲ့ — အဲဒါတွေကို ဘယ်လို ရှောင်ရမလဲဆိုတာ ဖော်ပြသွားပါမယ်။

### `/// <reference>`-ing a module (Module တစ်ခုကို reference လုပ်ခြင်း)

အဖြစ်များတဲ့ အမှားတစ်ခုက — `import` statement သုံးမယ့်အစား — module file တစ်ခုကို ရည်ညွှန်းဖို့ `/// <reference ... />` syntax ကို သုံးဖို့ ကြိုးစားတာပါ။
ဒီနှစ်ခုရဲ့ ကွာခြားချက်ကို နားလည်ဖို့ — compiler က module တစ်ခုရဲ့ type အချက်အလက်တွေကို `import` တစ်ခုရဲ့ path (ဥပမာ — `import x from "...";`, `import x = require("...");` စတာတွေထဲက `...`) အပေါ် အခြေခံပြီး ဘယ်လို ရှာဖွေတယ်ဆိုတာကို အရင်နားလည်ထားဖို့ လိုပါတယ်။

Compiler က သင့်တင့်တဲ့ path နဲ့ `.ts`, `.tsx` ပြီးတော့ `.d.ts` file တစ်ခုကို အရင်ရှာပါလိမ့်မယ်။
တိကျတဲ့ file တစ်ခုကို ရှာမတွေ့ဘူးဆိုရင် — compiler က _ambient module declaration_ (implementation မပါဘဲ သရုပ်ဖော်ရုံသာ ကြေညာထားသော module) တစ်ခုကို ရှာဖွေပါလိမ့်မယ်။
ဒါတွေကို `.d.ts` file တစ်ခုထဲမှာ ကြေညာထားဖို့ လိုတယ်ဆိုတာ သတိရပါ။

- `myModules.d.ts`

  ```ts
  // In a .d.ts file or .ts file that is not a module:
  declare module "SomeModule" {
    export function fn(): string;
  }
  ```

- `myOtherModule.ts`

  ```ts
  /// <reference path="myModules.d.ts" />
  import * as m from "SomeModule";
  ```

ဒီမှာ reference tag က — ambient module ရဲ့ declaration ပါဝင်တဲ့ declaration file ကို ရှာဖွေနိုင်အောင် ကူညီပေးပါတယ်။
TypeScript နမူနာတွေ အများကြီးမှာ သုံးတဲ့ `node.d.ts` file ကို ဒီလိုမျိုးနဲ့ပဲ သုံးစွဲကြတာပါ။

### Needless Namespacing (မလိုအပ်တဲ့ Namespacing)

သင်က program တစ်ခုကို namespaces ကနေ modules ဆီ ပြောင်းနေတယ်ဆိုရင် — အောက်ပါအတိုင်း ဖြစ်နေတဲ့ file မျိုးနဲ့ အဆုံးသတ်မိဖို့ လွယ်ပါတယ်:

- `shapes.ts`

  ```ts
  export namespace Shapes {
    export class Triangle {
      /* ... */
    }
    export class Square {
      /* ... */
    }
  }
  ```

ဒီမှာ top-level namespace ဖြစ်တဲ့ `Shapes` က `Triangle` နဲ့ `Square` တို့ကို — အကြောင်းပြချက် မရှိဘဲ ထုပ်ပိုးထားပါတယ်။
ဒါက သင့် module ရဲ့ consumers (အသုံးပြုသူများ) အတွက် ရှုပ်ထွေးပြီး စိတ်ညစ်စရာ ကောင်းပါတယ်:

- `shapeConsumer.ts`

  ```ts
  import * as shapes from "./shapes";
  let t = new shapes.Shapes.Triangle(); // shapes.Shapes?
  ```

TypeScript မှာ modules တွေရဲ့ အဓိကအင်္ဂါရပ်တစ်ခုက — မတူညီတဲ့ module နှစ်ခုက တူညီတဲ့ scope တစ်ခုထဲကို နာမည်တွေ ဘယ်တော့မှ ပံ့ပိုးပေးမှာ မဟုတ်ဘူးဆိုတာပါ။
Module တစ်ခုရဲ့ consumer က အဲဒီ module ကို ဘာနာမည်နဲ့ သုံးမယ်ဆိုတာ သူ့ဘာသာ ဆုံးဖြတ်တာမို့ — exported symbols တွေကို namespace တစ်ခုထဲ ကြိုတင် ထုပ်ပိုးဖို့ မလိုအပ်ပါဘူး။

ဘာကြောင့် module ရဲ့ ပါဝင်ပစ္စည်းတွေကို namespace လုပ်ဖို့ မကြိုးစားသင့်လဲဆိုတာ ထပ်ပြောရရင် — namespacing ရဲ့ ယေဘုယျ ရည်ရွယ်ချက်က constructs တွေကို ယုတ္တိကျကျ အုပ်စုဖွဲ့ဖို့ နဲ့ နာမည်တူ ထိပ်တိုက်တွေ့မှုတွေကို တားဆီးဖို့ ဖြစ်ပါတယ်။
Module file ကိုယ်တိုင်က ယုတ္တိကျတဲ့ အုပ်စုတစ်ခု ဖြစ်နေပြီး — သူ့ရဲ့ top-level name ကို import လုပ်တဲ့ code က သတ်မှတ်တာမို့ — exported objects တွေအတွက် namespace အလွှာ တစ်ခု ထပ်ထည့်ဖို့ မလိုအပ်ပါဘူး။

ဒီမှာ ပြန်ပြင်ထားတဲ့ ဥပမာတစ်ခုပါ:

- `shapes.ts`

  ```ts
  export class Triangle {
    /* ... */
  }
  export class Square {
    /* ... */
  }
  ```

- `shapeConsumer.ts`

  ```ts
  import * as shapes from "./shapes";
  let t = new shapes.Triangle();
  ```

### Trade-offs of Modules (Modules များ၏ ချိန်ဆမှုများ)

JS files တွေနဲ့ modules တွေကြားမှာ တစ်ခုနဲ့တစ်ခု ကိုက်ညီမှု (one-to-one correspondence) ရှိသလိုပဲ — TypeScript မှာလည်း module source files တွေနဲ့ သူတို့ကနေ emit လုပ်ထားတဲ့ JS files တွေကြားမှာ တစ်ခုနဲ့တစ်ခု ကိုက်ညီမှု ရှိပါတယ်။
ဒါရဲ့ သက်ရောက်မှုတစ်ခုက — သင်ပစ်မှတ်ထားတဲ့ module system အပေါ် မူတည်ပြီး module source files အများကြီးကို ပေါင်းစပ်လို့ မရနိုင်တာပါ။
ဥပမာ — `commonjs` (သို့) `umd` ကို ပစ်မှတ်ထားတုန်း [`outFile`](https://www.typescriptlang.org/tsconfig) option ကို သုံးလို့ မရပါဘူး — ဒါပေမယ့် TypeScript 1.8 နဲ့ ၎င်းနောက်ပိုင်းမှာတော့ `amd` (သို့) `system` ကို ပစ်မှတ်ထားတဲ့အခါ [`outFile`](https://www.typescriptlang.org/tsconfig) ကို [သုံးလို့ ရပါတယ်](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-8.html)။
