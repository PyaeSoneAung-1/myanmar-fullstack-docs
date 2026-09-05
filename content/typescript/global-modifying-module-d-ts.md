---
title: "Global: Modifying Module (Global Scope ကို Modify လုပ်တဲ့ Module များ)"
description: "import လုပ်လိုက်တာနဲ့ global scope ထဲက existing values တွေကို ပြုပြင် (modify) ပေးတဲ့ global-modifying module တွေအတွက် .d.ts template — declare global ကို သုံးပြီး built-in types တွေကို ချဲ့ထွင်နည်း"
order: 35
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html"
status: translated
updated: 2026-09-05
---

## Global Scope ကို ပြုပြင်ပေးတဲ့ Modules (Global-modifying Modules)

_Global-modifying module_ ဆိုတာက — import လုပ်လိုက်တာနဲ့ global scope ထဲမှာ ရှိနေတဲ့ existing values တွေကို ပြုပြင် (modify) ပေးတဲ့ module ပါ။ ဥပမာ — import လုပ်လိုက်တာနဲ့ `String.prototype` ထဲကို members အသစ်တွေ ထည့်ပေးတဲ့ library မျိုး ရှိနိုင်ပါတယ်။ ဒီ pattern က runtime မှာ conflicts (ပဋိပက္ခများ) ဖြစ်နိုင်ခြေ ရှိတာမို့ အနည်းငယ် အန္တရာယ်များပါတယ် — ဒါပေမယ့် သူ့အတွက် declaration file တစ်ခုကိုတော့ ရေးသားနိုင်ပါသေးတယ်။

## Global-modifying modules တွေကို ခွဲခြား သိရှိခြင်း (Identifying global-modifying modules)

Global-modifying modules တွေက ပုံမှန်အားဖြင့် သူတို့ရဲ့ documentation ကနေ ခွဲခြား သိရှိဖို့ လွယ်ကူပါတယ်။ ယေဘုယျအားဖြင့် သူတို့က global plugins တွေနဲ့ ဆင်တူပြီး — သူတို့ရဲ့ သက်ရောက်မှုတွေ သက်ဝင်လာဖို့ `require` call တစ်ခု လိုအပ်ပါတယ်။

ဒီလိုမျိုး documentation ကို သင်တွေ့ရနိုင်ပါတယ်:

```js
// 'require' call that doesn't use its return value
var unused = require("magic-string-time");
/* or */
require("magic-string-time");

var x = "hello, world";
// Creates new methods on built-in types
console.log(x.startsWithHello());

var y = [1, 2, 3];
// Creates new methods on built-in types
console.log(y.reverseAndSort());
```

ဥပမာတစ်ခုက ဒီလိုပါ:

```ts
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ This is the global-modifying module template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ Note: If your global-modifying module is callable or constructable, you'll
 *~ need to combine the patterns here with those in the module-class or module-function
 *~ template files
 */
declare global {
  /*~ Here, declare things that go in the global namespace, or augment
   *~ existing declarations in the global namespace
   */
  interface String {
    fancyFormat(opts: StringFormatOptions): string;
  }
}

/*~ If your module exports types or values, write them as usual */
export interface StringFormatOptions {
  fancinessLevel: number;
}

/*~ For example, declaring a method on the module (in addition to its global side effects) */
export function doSomething(): void;

/*~ If your module exports nothing, you'll need this line. Otherwise, delete it */
export {};
```
