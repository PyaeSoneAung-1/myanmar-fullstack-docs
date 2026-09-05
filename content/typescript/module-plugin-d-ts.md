---
title: "Module: Plugin (Module Plugin များအတွက် .d.ts Template)"
description: "တခြား library (module) တစ်ခုရဲ့ exports တွေကို ချဲ့ထွင် (extend) ပေးတဲ့ module plugin တွေအတွက် .d.ts template — declaration merging သုံးနည်း နဲ့ ES6 ရဲ့ သက်ရောက်မှု အကြောင်း"
order: 33
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html"
status: translated
updated: 2026-09-05
---

ဥပမာ — တခြား library တစ်ခုကို ချဲ့ထွင် (extend) လုပ်ထားတဲ့ JavaScript code နဲ့ အလုပ်လုပ်ချင်တယ်ဆိုရင်:

```ts
import { greeter } from "super-greeter";

// Normal Greeter API
greeter(2);
greeter("Hello world");

// Now we extend the object with a new function at runtime
import "hyper-super-greeter";
greeter.hyperGreet();
```

"super-greeter" ရဲ့ definition ကတော့ ဒီလိုပါ:

```ts
/*~ This example shows how to have multiple overloads for your function */
export interface GreeterFunction {
  (name: string): void
  (time: number): void
}

/*~ This example shows how to export a function specified by an interface */
export const greeter: GreeterFunction;
```

ရှိပြီးသား module ကို အောက်ပါအတိုင်း ချဲ့ထွင်နိုင်ပါတယ်:

```ts
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ This is the module plugin template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ On this line, import the module which this module adds to */
import { greeter } from "super-greeter";

/*~ Here, declare the same module as the one you imported above
 *~ then we expand the existing declaration of the greeter function
 */
export module "super-greeter" {
  export interface GreeterFunction {
    /** Greets even better! */
    hyperGreet(): void;
  }
}
```

ဒီဥပမာက [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) (declaration များ ပေါင်းစပ်ခြင်း) ကို အသုံးပြုထားပါတယ်။

## ES6 က Module Plugins တွေအပေါ် သက်ရောက်မှု (The Impact of ES6 on Module Plugins)

Plugin တချို့က ရှိပြီးသား modules တွေရဲ့ top-level exports တွေကို ထပ်ဖြည့်တာ ဒါမှမဟုတ် ပြုပြင်တာတွေ လုပ်ပါတယ်။ ဒါက CommonJS နဲ့ တခြား loaders တွေမှာတော့ တရားဝင်ပေမယ့် — ES6 modules တွေကိုတော့ immutable (ပြောင်းလဲလို့မရတဲ့) အဖြစ် သတ်မှတ်ထားတာမို့ ဒီလို pattern မျိုး မဖြစ်နိုင်တော့ပါဘူး။ TypeScript က loader-agnostic (loader အမျိုးအစား မရွေး အလုပ်လုပ်နိုင်တဲ့) ဖြစ်တာမို့ — ဒီစည်းမျဉ်းကို compile-time မှာ စစ်ဆေး အတင်းအကျပ် (enforce) လုပ်တာမျိုး မရှိပါဘူး။ ဒါပေမယ့် — ES6 module loader တစ်ခုဆီ ပြောင်းရွှေ့ဖို့ ရည်ရွယ်ထားတဲ့ developers တွေအနေနဲ့တော့ ဒီအချက်ကို သတိထားသင့်ပါတယ်။
