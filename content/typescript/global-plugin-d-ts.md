---
title: "Global Plugin (Global Plugin များ)"
description: "Global plugin တွေအတွက် .d.ts ရေးနည်း — UMD modules ခွဲခြားသိခြင်း, module/UMD/global plugins, global-modifying modules, dependencies သုံးစွဲပုံ, name conflicts ကာကွယ်ခြင်းနဲ့ ES6 ရဲ့ သက်ရောက်မှုများ"
order: 36
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-plugin-d-ts.html"
status: translated
updated: 2026-09-05
---

## _UMD_ (UMD Module များ)

`_UMD_` module ဆိုတာ — module အနေနဲ့ဖြစ်စေ (import တစ်ခုကနေတစ်ဆင့်)၊ global အနေနဲ့ဖြစ်စေ (module loader မရှိတဲ့ environment တစ်ခုထဲမှာ run တဲ့အခါ) — နှစ်မျိုးလုံးအနေနဲ့ သုံးလို့ရတဲ့ module ပါ။
[Moment.js](http://momentjs.com/) လိုမျိုး လူကြိုက်များတဲ့ library တွေ အများကြီးက ဒီပုံစံနဲ့ ရေးထားကြပါတယ်။
ဥပမာ — Node.js ထဲမှာ ဒါမှမဟုတ် RequireJS ကို သုံးတဲ့အခါ ဒီလိုမျိုး ရေးမှာပါ:

```ts
import moment = require("moment");
console.log(moment.format());
```

သာမန် (vanilla) browser environment တစ်ခုထဲမှာတော့ ဒီလိုမျိုး ရေးပါလိမ့်မယ်:

```js
console.log(moment.format());
```

### UMD Library တစ်ခုကို ခွဲခြားသိရှိခြင်း (Identifying a UMD Library)

[UMD modules](https://github.com/umdjs/umd) တွေက module loader environment တစ်ခု ရှိ/မရှိကို စစ်ဆေးကြည့်ပါတယ်။ ဒါက လွယ်လွယ်နဲ့ မြင်နိုင်တဲ့ pattern တစ်ခုဖြစ်ပြီး — ပုံစံက ဒီလိုမျိုး ရှိပါတယ်:

```js
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["libName"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("libName"));
    } else {
        root.returnExports = factory(root.libName);
    }
}(this, function (b) {
```

Library တစ်ခုရဲ့ code ထဲမှာ — အထူးသဖြင့် ဖိုင်ရဲ့ ထိပ်ပိုင်းမှာ — `typeof define`, `typeof window`, ဒါမှမဟုတ် `typeof module` တွေအတွက် စစ်ဆေးမှုတွေ တွေ့ရရင် အဲဒါက UMD library တစ်ခုပဲ ဆိုတာ နီးပါး သေချာပါတယ်။

UMD libraries တွေရဲ့ documentation တွေမှာလည်း — `require` ပြသထားတဲ့ "Using in Node.js" ဥပမာတစ်ခုနဲ့ — script ကို load လုပ်ဖို့ `<script>` tag တစ်ခု သုံးပြသထားတဲ့ "Using in the browser" ဥပမာတစ်ခုကို မကြာခဏ ပြသလေ့ ရှိပါတယ်။

### UMD Libraries များ၏ ဥပမာများ (Examples of UMD Libraries)

လူကြိုက်များတဲ့ library အများစုက အခု UMD packages တွေအနေနဲ့ ရရှိနိုင်ပါပြီ။
[jQuery](https://jquery.com/), [Moment.js](http://momentjs.com/), [lodash](https://lodash.com/) စတာတွေက ဥပမာတွေပါ — နောက်ထပ်လည်း အများကြီး ရှိပါသေးတယ်။

### Template (Template ပုံစံ)

Modules တွေအတွက် template သုံးမျိုး ရနိုင်ပါတယ် —
[`module.d.ts`](/docs/typescript/module-d-ts), [`module-class.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html) နဲ့ [`module-function.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html) တို့ပါ။

သင့် module ကို function တစ်ခုလိုမျိုး _ခေါ်လို့ (call)_ ရတယ်ဆိုရင် — [`module-function.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html) ကို သုံးပါ:

```js
var x = require("foo");
// Note: calling 'x' as a function
var y = x(42);
```

["The Impact of ES6 on Module Call Signatures" ဆိုတဲ့ footnote](#the-impact-of-es6-on-module-plugins) ကို ဖတ်ဖို့ သေချာပါစေ

သင့် module ကို `new` သုံးပြီး _အသစ် ဖန်တီးလို့ (construct)_ ရတယ်ဆိုရင် — [`module-class.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html) ကို သုံးပါ:

```js
var x = require("bar");
// Note: using 'new' operator on the imported variable
var y = new x("hello");
```

ဒီ modules တွေအတွက်လည်း အဲဒီ [footnote](#the-impact-of-es6-on-module-plugins) က အတူတူပဲ သက်ရောက်ပါတယ်။

သင့် module က callable မဟုတ်သလို constructable လည်း မဟုတ်ဘူးဆိုရင် — [`module.d.ts`](/docs/typescript/module-d-ts) ဖိုင်ကို သုံးပါ။

## Module Plugin ဒါမှမဟုတ် UMD Plugin (_Module Plugin_ or _UMD Plugin_)

`_module plugin_` ဆိုတာ တခြား module တစ်ခုရဲ့ (UMD ဖြစ်ဖြစ် module ဖြစ်ဖြစ်) ပုံသဏ္ဍာန်ကို ပြောင်းလဲပေးတဲ့ plugin ပါ။
ဥပမာ — Moment.js မှာ `moment-range` က `moment` object ထဲကို `range` method အသစ်တစ်ခု ထည့်ပေးပါတယ်။

Declaration file တစ်ခု ရေးတဲ့ ရည်ရွယ်ချက်အတွက်ကတော့ — ပြုပြင်ခံရမယ့် module က ရိုးရိုး module လား UMD module လားဆိုတာ မသက်ဆိုင်ဘဲ — code အတူတူပဲ ရေးရမှာ ဖြစ်ပါတယ်။

### Template (Template ပုံစံ)

[`module-plugin.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html) template ကို သုံးပါ။

## _Global Plugin_ (Global Plugin များ)

`_global plugin_` ဆိုတာ global တစ်ခုခုရဲ့ ပုံသဏ္ဍာန်ကို ပြောင်းလဲပေးတဲ့ global code ပါ။
`_global-modifying modules_` တွေလိုပဲ — ဒါတွေက runtime conflict (လည်ပတ်နေချိန် ပဋိပက္ခ) ဖြစ်နိုင်ခြေကို မြင့်တက်စေပါတယ်။

ဥပမာ — library တချို့က `Array.prototype` ဒါမှမဟုတ် `String.prototype` တွေထဲကို function အသစ်တွေ ထည့်ပေးပါတယ်။

### Global Plugins များကို ခွဲခြားသိရှိခြင်း (Identifying Global Plugins)

Global plugins တွေက ယေဘုယျအားဖြင့် သူတို့ရဲ့ documentation ကနေ ခွဲခြားသိဖို့ လွယ်ပါတယ်။

ဒီလိုမျိုး ဥပမာတွေ တွေ့ရပါလိမ့်မယ်:

```js
var x = "hello, world";
// Creates new methods on built-in types
console.log(x.startsWithHello());

var y = [1, 2, 3];
// Creates new methods on built-in types
console.log(y.reverseAndSort());
```

### Template (Template ပုံစံ)

[`global-plugin.d.ts`](/docs/typescript/global-plugin-d-ts) template ကို သုံးပါ။

## _Global-modifying Modules_ (Global-modifying Modules များ)

`_global-modifying module_` ဆိုတာ import လုပ်လိုက်တဲ့အခါ global scope ထဲက ရှိပြီးသား values တွေကို ပြုပြင်ပြောင်းလဲပေးတဲ့ module ပါ။
ဥပမာ — import လုပ်လိုက်တာနဲ့ `String.prototype` ထဲကို member အသစ်တွေ ထည့်ပေးတဲ့ library တစ်ခု ရှိနိုင်ပါတယ်။
ဒီပုံစံက runtime conflicts ဖြစ်နိုင်ခြေ ရှိလို့ အနည်းငယ် အန္တရာယ်များပေမယ့် — သူ့အတွက် declaration file တစ်ခုတော့ ရေးနိုင်ပါသေးတယ်။

### Global-modifying Modules များကို ခွဲခြားသိရှိခြင်း (Identifying Global-modifying Modules)

Global-modifying modules တွေက ယေဘုယျအားဖြင့် သူတို့ရဲ့ documentation ကနေ ခွဲခြားသိဖို့ လွယ်ပါတယ်။
ယေဘုယျအားဖြင့် — သူတို့က global plugins တွေနဲ့ ဆင်ပေမယ့် — သူတို့ရဲ့ အကျိုးသက်ရောက်မှုတွေ စတင်ဖို့ `require` call တစ်ခု လိုအပ်ပါတယ်။

ဒီလိုမျိုး documentation မျိုး တွေ့ရနိုင်ပါတယ်:

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

### Template (Template ပုံစံ)

[`global-modifying-module.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html) template ကို သုံးပါ။

## Dependencies များ သုံးစွဲခြင်း (Consuming Dependencies)

သင့် library မှာ ရှိနိုင်တဲ့ dependencies အမျိုးအစား အနည်းငယ် ရှိပါတယ်။
ဒီ section က — အဲဒါတွေကို declaration file ထဲကို ဘယ်လို import လုပ်မလဲ ပြသပေးပါတယ်။

### Global Libraries များအပေါ် Dependencies (Dependencies on Global Libraries)

သင့် library က global library တစ်ခုပေါ် မှီခိုနေတယ်ဆိုရင် — `/// <reference types="..." />` directive တစ်ခုကို သုံးပါ:

```ts
/// <reference types="someLib" />

function getThing(): someLib.thing;
```

### Modules များအပေါ် Dependencies (Dependencies on Modules)

သင့် library က module တစ်ခုပေါ် မှီခိုနေတယ်ဆိုရင် — `import` statement တစ်ခုကို သုံးပါ:

```ts
import * as moment from "moment";

function getThing(): moment;
```

### UMD Libraries များအပေါ် Dependencies (Dependencies on UMD Libraries)

#### Global Library တစ်ခုကနေဆိုရင် (From a Global Library)

သင့် global library က UMD module တစ်ခုပေါ် မှီခိုနေတယ်ဆိုရင် — `/// <reference types` directive တစ်ခုကို သုံးပါ:

```ts
/// <reference types="moment" />

function getThing(): moment;
```

#### Module (သို့) UMD Library တစ်ခုကနေဆိုရင် (From a Module or UMD Library)

သင့် module (သို့) UMD library က UMD library တစ်ခုပေါ် မှီခိုနေတယ်ဆိုရင် — `import` statement တစ်ခုကို သုံးပါ:

```ts
import * as someLib from "someLib";
```

UMD library တစ်ခုဆီကို dependency ကြေညာဖို့ `/// <reference` directive တစ်ခုကို _မသုံးပါနဲ့!_

## အောက်ခြေ မှတ်စုများ (Footnotes)

### Name Conflicts များကို ကာကွယ်ခြင်း (Preventing Name Conflicts)

Global declaration file တစ်ခု ရေးတဲ့အခါ global scope ထဲမှာ types အများအပြားကို သတ်မှတ်လို့ ရနိုင်တာ သတိပြုပါ။
Project တစ်ခုထဲမှာ declaration files အများကြီး ရှိနေတဲ့အခါ ဖြေရှင်းလို့မရတဲ့ name conflicts (နာမည် ပဋိပက္ခများ) တွေ ဖြစ်စေနိုင်လို့ — ဒီလိုလုပ်တာကို ကျွန်တော်တို့ အပြင်းအထန် အားမပေးပါဘူး။

လိုက်နာဖို့ ရိုးရှင်းတဲ့ စည်းမျဉ်းတစ်ခုကတော့ — library က သတ်မှတ်ပေးတဲ့ global variable တစ်ခုခုနဲ့ _namespace လုပ်ထားတဲ့_ types တွေကိုပဲ declare လုပ်ဖို့ပါ။
ဥပမာ — library က 'cats' ဆိုတဲ့ global value တစ်ခုကို သတ်မှတ်ပေးတယ်ဆိုရင် — ဒီလို ရေးသင့်ပါတယ်:

```ts
declare namespace cats {
  interface KittySettings {}
}
```

ဒါပေမယ့် _ဒီလိုတော့ မဟုတ်ပါဘူး_:

```ts
// at top-level
interface CatsKittySettings {}
```

ဒီ လမ်းညွှန်ချက်က library ကို declaration file သုံးစွဲသူတွေ မပျက်စီးစေဘဲ UMD အဖြစ် ပြောင်းရွှေ့လို့ ရနိုင်စေဖို့လည်း သေချာစေပါတယ်။

### ES6 ရဲ့ Module Plugins အပေါ် သက်ရောက်မှု (The Impact of ES6 on Module Plugins)

Plugin တချို့က ရှိပြီးသား modules တွေပေါ်မှာ top-level exports တွေကို ထည့်တာ ဒါမှမဟုတ် ပြုပြင်တာတွေ လုပ်ပါတယ်။
ဒါက CommonJS နဲ့ တခြား loader တွေမှာတော့ တရားဝင်ပေမယ့် — ES6 modules တွေကို immutable (ပြောင်းလဲလို့မရသော) လို့ သတ်မှတ်ထားတာမို့ — ဒီပုံစံ မဖြစ်နိုင်တော့ပါဘူး။
TypeScript က loader-agnostic (loader မရွေး အလုပ်လုပ်နိုင်သော) ဖြစ်လို့ compile-time မှာ ဒီမူဝါဒကို အတင်းအကျပ် လုပ်ဆောင်ပေးတာ မရှိပါဘူး — ဒါပေမယ့် ES6 module loader တစ်ခုဆီ ပြောင်းရွှေ့ဖို့ ရည်ရွယ်ထားတဲ့ developers တွေကတော့ ဒါကို သတိထားသင့်ပါတယ်။

### ES6 ရဲ့ Module Call Signatures အပေါ် သက်ရောက်မှု (The Impact of ES6 on Module Call Signatures)

Express လိုမျိုး လူကြိုက်များတဲ့ library တွေ အများကြီးက import လုပ်လိုက်တဲ့အခါ — ကိုယ့်ကိုယ်ကို callable function (ခေါ်လို့ရတဲ့ function) အနေနဲ့ ဖော်ထုတ်ပါတယ်။
ဥပမာ — Express ရဲ့ ပုံမှန် အသုံးပြုပုံက ဒီလိုမျိုးပါ:

```ts
import exp = require("express");
var app = exp();
```

ES6 module loaders တွေမှာ top-level object (ဒီမှာ `exp` အနေနဲ့ import လုပ်ထားတဲ့) က properties တွေပဲ ရှိနိုင်ပြီး — top-level module object က _ဘယ်တော့မှ_ callable မဟုတ်ပါဘူး။
ဒီနေရာမှာ အသုံးအများဆုံး ဖြေရှင်းနည်းကတော့ — callable/constructable object တစ်ခုအတွက် `default` export တစ်ခုကို သတ်မှတ်ပေးတာပါ;
module loader shim တချို့က ဒီအခြေအနေကို အလိုအလျောက် သိရှိပြီး — top-level object ကို `default` export နဲ့ အစားထိုးပေးပါတယ်။

### Library ရဲ့ File Layout (Library File Layout)

သင့် declaration files တွေရဲ့ layout (ဖွဲ့စည်းပုံ) က library ရဲ့ layout ကို ထင်ဟပ်နေသင့်ပါတယ်။

Library တစ်ခုက module အများအပြား ပါဝင်နိုင်ပါတယ် — ဥပမာ:

```
myLib
  +---- index.js
  +---- foo.js
  +---- bar
         +---- index.js
         +---- baz.js
```

ဒါတွေကို ဒီလိုမျိုး import လုပ်နိုင်ပါတယ်:

```js
var a = require("myLib");
var b = require("myLib/foo");
var c = require("myLib/bar");
var d = require("myLib/bar/baz");
```

ဒါကြောင့် သင့် declaration files တွေက ဒီလိုမျိုး ရှိသင့်ပါတယ်:

```
@types/myLib
  +---- index.d.ts
  +---- foo.d.ts
  +---- bar
         +---- index.d.ts
         +---- baz.d.ts
```

```ts
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ This template shows how to write a global plugin. */

/*~ Write a declaration for the original type and add new members.
 *~ For example, this adds a 'toBinaryString' method with overloads to
 *~ the built-in number type.
 */
interface Number {
  toBinaryString(opts?: MyLibrary.BinaryFormatOptions): string;

  toBinaryString(
    callback: MyLibrary.BinaryFormatCallback,
    opts?: MyLibrary.BinaryFormatOptions
  ): string;
}

/*~ If you need to declare several types, place them inside a namespace
 *~ to avoid adding too many things to the global namespace.
 */
declare namespace MyLibrary {
  type BinaryFormatCallback = (n: number) => string;
  interface BinaryFormatOptions {
    prefix?: string;
    padding: number;
  }
}
```
