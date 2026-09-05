---
title: "Library Structures (Library ဖွဲ့စည်းပုံများ)"
description: "Library တစ်ခုကို ဘယ်လို သုံးစွဲလဲဆိုတာပေါ် မူတည်ပြီး declaration file (.d.ts) တွေ ဘယ်လို တည်ဆောက်ရမလဲ — modular, global, UMD libraries တွေကို ခွဲခြားသိရှိခြင်း၊ templates များနှင့် dependencies များ သုံးစွဲခြင်း"
order: 29
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html"
status: translated
updated: 2026-09-05
---

အကျယ်ပြန့်အားဖြင့် — သင့် declaration file ကို _ဖွဲ့စည်းပုံ_ (structure) လုပ်တဲ့ နည်းလမ်းက library ကို ဘယ်လို သုံးစွဲ (consume) ခံရလဲဆိုတာပေါ် မူတည်ပါတယ်။ JavaScript မှာ library တစ်ခုကို သုံးစွဲမှုအတွက် ကမ်းလှမ်းဖို့ နည်းလမ်း အမျိုးမျိုး ရှိပြီး — အဲဒါနဲ့ ကိုက်ညီအောင် သင့် declaration file ကို ရေးဖို့ လိုအပ်ပါတယ်။ ဒီ guide က အသုံးများတဲ့ library patterns တွေကို ဘယ်လို ခွဲခြားသိရှိမလဲ၊ အဲဒီ pattern တစ်ခုချင်းစီနဲ့ ကိုက်ညီတဲ့ declaration files တွေ ဘယ်လို ရေးမလဲဆိုတာကို လွှမ်းခြုံ ဖော်ပြပါတယ်။

Library ဖွဲ့စည်းပုံ pattern အဓိက အမျိုးအစားတိုင်းအတွက် — [Templates](/docs/typescript/declaration-templates) section ထဲမှာ သက်ဆိုင်ရာ file တစ်ခုစီ ရှိပါတယ်။ ဒီ templates တွေကနေ စတင်ခြင်းအားဖြင့် — ပိုမြန်မြန် စတင်လုပ်ဆောင်နိုင်ပါတယ်။

## Libraries အမျိုးအစားများကို ခွဲခြားခြင်း (Identifying Kinds of Libraries)

ပထမဆုံး — TypeScript declaration files တွေ ကိုယ်စားပြု (represent) နိုင်တဲ့ library အမျိုးအစားတွေကို ပြန်လည် သုံးသပ်ကြည့်ရအောင်။ Library အမျိုးအစားတစ်ခုချင်းစီကို ဘယ်လို _သုံးစွဲ_ လဲ၊ ဘယ်လို _ရေးသား_ လဲဆိုတာကို အကျဉ်းချုပ် ပြသပြီး — လက်တွေ့ကမ္ဘာ (real world) ထဲက ဥပမာ library တစ်ချို့ကိုလည်း စာရင်းပြုစုပေးပါမယ်။

Library တစ်ခုရဲ့ structure ကို ခွဲခြားသတ်မှတ်ခြင်းက — သူ့ရဲ့ declaration file ကို ရေးသားရာမှာ ပထမဆုံး အဆင့်ပါ။ Structure ကို ဘယ်လို ခွဲခြားမလဲဆိုတာအတွက် — library ရဲ့ _အသုံးပြုပုံ (usage)_ နဲ့ _code_ နှစ်မျိုးလုံးကို အခြေခံတဲ့ အရိပ်အမြွက် (hint) တွေ ပေးပါမယ်။ Library ရဲ့ documentation နဲ့ စနစ်ကျမှု (organization) ပေါ် မူတည်ပြီး — တစ်ခုက တစ်ခုထက် ပိုလွယ်ကူနိုင်ပါတယ်။ ကိုယ့်အတွက် ပိုအဆင်ပြေတာကို သုံးဖို့ အကြံပြုပါတယ်။

### ဘာတွေ ရှာဖွေကြည့်သင့်သလဲ (What should you look for?)

သင် typing (type သတ်မှတ်) လုပ်နေတဲ့ library တစ်ခုကို ကြည့်တဲ့အခါ ကိုယ့်ကိုယ်ကို မေးရမယ့် မေးခွန်းတွေပါ။

1. Library ကို ဘယ်လို ရယူလဲ?

   ဥပမာ — npm ကနေပဲ ရလို့ရတာလား၊ CDN ကနေပဲ ရတာလား?

2. အဲဒါကို ဘယ်လို import လုပ်မလဲ?

   Global object တစ်ခုကို ထည့်ပေးတာလား? `require` ဒါမှမဟုတ် `import`/`export` statements တွေ သုံးတာလား?

### Library အမျိုးအစား အမျိုးမျိုးအတွက် နမူနာငယ်များ (Smaller samples for different types of libraries)

### Modular Libraries (Module ပုံစံ Libraries)

ခေတ်ပေါ် (modern) Node.js libraries တွေ အားလုံးနီးပါးက module မိသားစုထဲက ဖြစ်ပါတယ်။ ဒီ library အမျိုးအစားတွေက module loader တစ်ခု ရှိတဲ့ JS environment မှာမှပဲ အလုပ်လုပ်ပါတယ်။ ဥပမာ — `express` က Node.js မှာပဲ အလုပ်လုပ်ပြီး — CommonJS ရဲ့ `require` function နဲ့ပဲ load လုပ်ရပါတယ်။

ECMAScript 2015 (ES2015၊ ECMAScript 6 နဲ့ ES6 လို့လည်း ခေါ်)၊ CommonJS နဲ့ RequireJS တွေမှာ — _module_ တစ်ခုကို _import_ လုပ်ခြင်းဆိုတဲ့ အလားတူ အယူအဆတွေ ရှိပါတယ်။ ဥပမာ — JavaScript CommonJS (Node.js) မှာ ဒီလို ရေးပါတယ်:

```js
var fs = require("fs");
```

TypeScript ဒါမှမဟုတ် ES6 မှာတော့ `import` keyword က အလားတူ ရည်ရွယ်ချက်ကို ဆောင်ရွက်ပါတယ်:

```ts
import * as fs from "fs";
```

Modular libraries တွေရဲ့ documentation ထဲမှာ ဒီ line တွေထဲက တစ်ခုခုကို အများအားဖြင့် တွေ့ရပါလိမ့်မယ်:

```js
var someLib = require("someLib");
```

ဒါမှမဟုတ်

```js
define(..., ['someLib'], function(someLib) {

});
```

Global modules တွေလိုပဲ — ဒီဥပမာမျိုးတွေကို [UMD](#umd) module တစ်ခုရဲ့ documentation ထဲမှာလည်း တွေ့နိုင်ပါတယ် — ဒါကြောင့် code ရော documentation ရော သေချာ စစ်ဆေးဖို့ မမေ့ပါနဲ့။

#### Module Library တစ်ခုကို Code ကနေ ခွဲခြားခြင်း (Identifying a Module Library from Code)

Modular libraries တွေမှာ ပုံမှန်အားဖြင့် အောက်ပါတို့ထဲက အနည်းဆုံး တစ်ချို့ ပါဝင်ပါလိမ့်မယ်:

- `require` ဒါမှမဟုတ် `define` တွေကို unconditional (အခြေအနေ မခွဲခြားဘဲ) ခေါ်ဆိုမှုတွေ
- `import * as a from 'b';` ဒါမှမဟုတ် `export c;` လိုမျိုး declarations
- `exports` ဒါမှမဟုတ် `module.exports` တွေဆီ assignment (တန်ဖိုးသတ်မှတ်) လုပ်မှုတွေ

ဒါတွေကတော့ ရှားပါလိမ့်မယ်:

- `window` ဒါမှမဟုတ် `global` ရဲ့ properties တွေဆီ assignment လုပ်မှုတွေ

#### Modules အတွက် Templates (Templates For Modules)

Modules တွေအတွက် template လေးခု ရနိုင်ပါတယ် — [`module.d.ts`](/docs/typescript/module-d-ts)၊ [`module-class.d.ts`](/docs/typescript/module-class-d-ts)၊ [`module-function.d.ts`](/docs/typescript/module-function-d-ts) နဲ့ [`module-plugin.d.ts`](/docs/typescript/module-plugin-d-ts) တို့ပါ။

ဒါတွေ အားလုံး ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ ခြုံငုံသုံးသပ်ချက် (overview) အတွက် — [`module.d.ts`](/docs/typescript/module-d-ts) ကို အရင်ဆုံး ဖတ်သင့်ပါတယ်။

ပြီးတော့ — သင့် module ကို function တစ်ခုလိုမျိုး _ခေါ်ဆို (call)_ လို့ရတယ်ဆိုရင် [`module-function.d.ts`](/docs/typescript/module-function-d-ts) template ကို သုံးပါ:

```js
const x = require("foo");
// Note: calling 'x' as a function
const y = x(42);
```

သင့် module ကို `new` သုံးပြီး _တည်ဆောက် (construct)_ လို့ရတယ်ဆိုရင် [`module-class.d.ts`](/docs/typescript/module-class-d-ts) template ကို သုံးပါ:

```js
const x = require("bar");
// Note: using 'new' operator on the imported variable
const y = new x("hello");
```

Import လုပ်လိုက်တာနဲ့ တခြား modules တွေကို ပြောင်းလဲမှု (make changes) ဖြစ်စေတဲ့ module တစ်ခု ရှိရင်တော့ [`module-plugin.d.ts`](/docs/typescript/module-plugin-d-ts) template ကို သုံးပါ:

```js
const jest = require("jest");
require("jest-matchers-files");
```

### Global Libraries (Global ပုံစံ Libraries)

_Global_ library ဆိုတာ — global scope (import ပုံစံ တစ်မျိုးမျိုး မသုံးဘဲ) ကနေ တိုက်ရိုက် ဝင်ရောက်သုံးလို့ရတဲ့ library ပါ။ Library တော်တော်များများက global variables တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ထုတ်ဖော် (expose) လုပ်ထားရုံပါပဲ။ ဥပမာ — [jQuery](https://jquery.com/) ကို သုံးနေတယ်ဆိုရင် `$` variable ကို ရိုးရိုး ရည်ညွှန်းရုံနဲ့ သုံးလို့ရပါတယ်:

```ts
$(() => {
  console.log("hello!");
});
```

Global library တစ်ခုရဲ့ documentation ထဲမှာ — HTML script tag တစ်ခုနဲ့ ဘယ်လို သုံးရမလဲဆိုတဲ့ လမ်းညွှန်ချက်မျိုးကို ပုံမှန်အားဖြင့် တွေ့ရပါလိမ့်မယ်:

```html
<script src="http://a.great.cdn.for/someLib.js"></script>
```

ဒီနေ့ခေတ်မှာ — လူကြိုက်များတဲ့ globally-accessible libraries တွေ အများစုက တကယ်တော့ UMD libraries (အောက်မှာ ကြည့်ပါ) အဖြစ် ရေးသားထားကြပါတယ်။ UMD library ရဲ့ documentation က global library ရဲ့ documentation နဲ့ ခွဲခြားရ ခက်ခဲပါတယ်။ Global declaration file မရေးခင် — library က UMD မဟုတ်ဘူးဆိုတာ သေချာအောင် စစ်ဆေးပါ။

#### Global Library တစ်ခုကို Code ကနေ ခွဲခြားခြင်း (Identifying a Global Library from Code)

Global library code က ပုံမှန်အားဖြင့် အလွန်ရိုးရှင်းပါတယ်။ Global "Hello, world" library တစ်ခုက ဒီလိုပုံ ရှိနိုင်ပါတယ်:

```js
function createGreeting(s) {
  return "Hello, " + s;
}
```

ဒါမှမဟုတ် ဒီလိုမျိုး:

```js
// Web
window.createGreeting = function (s) {
  return "Hello, " + s;
};

// Node
global.createGreeting = function (s) {
  return "Hello, " + s;
};

// Potentially any runtime
globalThis.createGreeting = function (s) {
  return "Hello, " + s;
};
```

Global library တစ်ခုရဲ့ code ကို ကြည့်တဲ့အခါ — ပုံမှန်အားဖြင့် ဒါတွေကို တွေ့ရပါလိမ့်မယ်:

- Top-level `var` statements ဒါမှမဟုတ် `function` declarations
- `window.someName` တွေဆီ assignment တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး လုပ်မှု
- `document` ဒါမှမဟုတ် `window` လိုမျိုး DOM primitives တွေ ရှိနေတယ်လို့ ယူဆချက် (assumption) တွေ

ဒါတွေကတော့ _မတွေ့ရပါဘူး_:

- `require` ဒါမှမဟုတ် `define` လိုမျိုး module loaders တွေကို စစ်ဆေးမှု ဒါမှမဟုတ် အသုံးပြုမှု
- `var fs = require("fs");` ပုံစံ CommonJS/Node.js-style imports
- `define(...)` ခေါ်ဆိုမှုတွေ
- Library ကို ဘယ်လို `require` ဒါမှမဟုတ် import လုပ်ရမလဲ ဖော်ပြတဲ့ documentation

#### Global Libraries ဥပမာများ (Examples of Global Libraries)

Global library တစ်ခုကို UMD library အဖြစ် ပြောင်းလဲရတာ ပုံမှန်အားဖြင့် လွယ်ကူလို့ — လူကြိုက်များတဲ့ libraries တွေထဲက အနည်းငယ်ကသာ global ပုံစံနဲ့ ရေးထားဆဲ ဖြစ်ပါတယ်။ ဒါပေမယ့် — သေးငယ်ပြီး DOM လိုအပ်တဲ့ (ဒါမှမဟုတ် ဘာမှ _မမှီခိုတဲ့_) libraries တွေကတော့ global ပုံစံအတိုင်း ဆက်ရှိနေနိုင်ပါတယ်။

#### Global Library Template (Global Library နမူနာပုံစံ)

Template file [`global.d.ts`](/docs/typescript/global-d-ts) က — `myLib` ဆိုတဲ့ ဥပမာ library တစ်ခုကို သတ်မှတ်ဖော်ပြထားပါတယ်။ [“Preventing Name Conflicts” အောက်ခြေမှတ်စု](#နာမည်-ထိပ်တိုက်တွေ့မှုများကို-ကာကွယ်ခြင်း-preventing-name-conflicts) ကိုလည်း သေချာ ဖတ်ထားဖို့ မမေ့ပါနဲ့။

### _UMD_

A _UMD_ module က — module အနေနဲ့လည်း (import ကတစ်ဆင့်) သုံးလို့ရသလို — module loader မရှိတဲ့ environment မှာ run တဲ့အခါ global အနေနဲ့လည်း သုံးလို့ရပါတယ်။ [Moment.js](https://momentjs.com/) လိုမျိုး လူကြိုက်များတဲ့ libraries တွေ အများကြီးက ဒီပုံစံနဲ့ ရေးသားထားကြပါတယ်။ ဥပမာ — Node.js ဒါမှမဟုတ် RequireJS ကို သုံးတဲ့အခါ ဒီလို ရေးပါတယ်:

```ts
import moment = require("moment");
console.log(moment.format());
```

ရိုးရိုး vanilla browser environment တစ်ခုမှာတော့ — ဒီလို ရေးပါတယ်:

```js
console.log(moment.format());
```

#### UMD library တစ်ခုကို ခွဲခြားခြင်း (Identifying a UMD library)

[UMD modules](https://github.com/umdjs/umd) တွေက module loader environment တစ်ခု ရှိ/မရှိကို စစ်ဆေးပါတယ်။ ဒါက အလွယ်တကူ မြင်နိုင်တဲ့ pattern တစ်ခု ဖြစ်ပြီး — ပုံစံက ဒီလိုမျိုးပါ:

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

Library ရဲ့ code ထဲမှာ — `typeof define`၊ `typeof window` ဒါမှမဟုတ် `typeof module` စစ်ဆေးမှုတွေကို တွေ့ရတယ်၊ အထူးသဖြင့် file ရဲ့ ထိပ်ပိုင်းမှာဆိုရင် — အဲဒါက UMD library တစ်ခု ဖြစ်လေ့ ဖြစ်ထ ရှိပါတယ်။

UMD libraries တွေရဲ့ documentation တွေမှာလည်း — `require` ကို ပြသထားတဲ့ "Using in Node.js" ဥပမာတစ်ခုနဲ့ — `<script>` tag သုံးပြီး load လုပ်ပြတဲ့ "Using in the browser" ဥပမာတစ်ခု နှစ်မျိုးလုံးကို မကြာခဏ တွေ့ရပါလိမ့်မယ်။

#### UMD libraries ဥပမာများ (Examples of UMD libraries)

လူကြိုက်များတဲ့ libraries တွေ အများစုက အခုတော့ UMD packages အဖြစ် ရနိုင်ပါပြီ။ ဥပမာတွေထဲမှာ [jQuery](https://jquery.com/)၊ [Moment.js](https://momentjs.com/)၊ [lodash](https://lodash.com/) စတာတွေ အများကြီး ပါဝင်ပါတယ်။

#### Template (နမူနာပုံစံ)

UMD library တစ်ခုရဲ့ declaration အတွက် — [`module-plugin.d.ts`](/docs/typescript/module-plugin-d-ts) template ကို သုံးပါ။

## Dependencies တွေကို သုံးစွဲခြင်း (Consuming Dependencies)

သင့် library မှာ မှီခိုနေတဲ့ (depend) dependencies အမျိုးအစား အနည်းငယ် ရှိနိုင်ပါတယ်။ ဒီ section က — အဲဒါတွေကို declaration file ထဲကို ဘယ်လို import လုပ်ရမလဲ ပြသပါတယ်။

### Global Libraries ပေါ်က Dependencies (Dependencies on Global Libraries)

သင့် library က global library တစ်ခုပေါ် မှီခိုနေတယ်ဆိုရင် — `/// <reference types="..." />` directive ကို သုံးပါ:

```ts
/// <reference types="someLib" />

function getThing(): someLib.thing;
```

### Modules ပေါ်က Dependencies (Dependencies on Modules)

သင့် library က module တစ်ခုပေါ် မှီခိုနေတယ်ဆိုရင် — `import` statement ကို သုံးပါ:

```ts
import * as moment from "moment";

function getThing(): moment;
```

### UMD Libraries ပေါ်က Dependencies (Dependencies on UMD libraries)

#### Global Library တစ်ခုကနေ (From a Global Library)

သင့် global library က UMD module တစ်ခုပေါ် မှီခိုနေတယ်ဆိုရင် — `/// <reference types` directive ကို သုံးပါ:

```ts
/// <reference types="moment" />

function getThing(): moment;
```

#### Module ဒါမှမဟုတ် UMD Library ကနေ (From a Module or UMD Library)

သင့် module ဒါမှမဟုတ် UMD library က UMD library တစ်ခုပေါ် မှီခိုနေတယ်ဆိုရင် — `import` statement ကို သုံးပါ:

```ts
import * as someLib from "someLib";
```

UMD library တစ်ခုဆီကို dependency ကြေညာဖို့ `/// <reference` directive ကို _မသုံးပါနဲ့_!

## Footnotes (အောက်ခြေ မှတ်စုများ)

### နာမည် ထိပ်တိုက်တွေ့မှုများကို ကာကွယ်ခြင်း (Preventing Name Conflicts)

Global declaration file တစ်ခု ရေးတဲ့အခါ — global scope ထဲမှာ types တွေ အများကြီး သတ်မှတ်နိုင်တာ သတိပြုပါ။ Project တစ်ခုထဲမှာ declaration files တွေ အများကြီး ရှိတဲ့အခါ — ဒါက ဖြေရှင်းလို့မရတဲ့ (unresolvable) name conflicts (နာမည် ထိပ်တိုက်တွေ့မှုများ) တွေ ဖြစ်ပေါ်စေနိုင်လို့ — အဲဒါကို ကျွန်တော်တို့ အပြင်းအထန် မထောက်ခံပါဘူး။

လိုက်နာရလွယ်တဲ့ စည်းမျဉ်းတစ်ခုကတော့ — library က သတ်မှတ်တဲ့ global variable နဲ့ _namespace ပြုထားတဲ့ (namespaced)_ types တွေကိုပဲ declare လုပ်ဖို့ပါ။ ဥပမာ — library က 'cats' ဆိုတဲ့ global value ကို သတ်မှတ်တယ်ဆိုရင် — ဒီလို ရေးသင့်ပါတယ်:

```ts
declare namespace cats {
  interface KittySettings {}
}
```

ဒါပေမယ့် ဒီလိုတော့ _မရေးပါနဲ့_:

```ts
// at top-level
interface CatsKittySettings {}
```

ဒီလမ်းညွှန်ချက်က — library ကို နောက်ပိုင်းမှာ UMD အဖြစ် ပြောင်းလဲခဲ့ရင်တောင် — declaration file သုံးစွဲသူတွေကို မထိခိုက်စေဘဲ ပြောင်းလဲနိုင်အောင်လည်း သေချာစေပါတယ်။

### ES6 ရဲ့ Module Call Signatures အပေါ် သက်ရောက်မှု (The Impact of ES6 on Module Call Signatures)

Express လိုမျိုး လူကြိုက်များတဲ့ libraries တွေ အများကြီးက — import လုပ်လိုက်တဲ့အခါ callable function (တိုက်ရိုက် ခေါ်လို့ရတဲ့ function) တစ်ခုအနေနဲ့ ကိုယ့်ကိုယ်ကို ထုတ်ဖော်ပါတယ်။ ဥပမာ — Express ရဲ့ ပုံမှန် အသုံးပြုပုံက ဒီလိုပါ:

```ts
import exp = require("express");
var app = exp();
```

ES6-compliant module loaders တွေမှာ — top-level object (ဒီနေရာမှာ `exp` အနေနဲ့ import လုပ်ထားတဲ့) က properties တွေပဲ ရှိနိုင်ပြီး — top-level module object က ဘယ်တော့မှ callable မဖြစ်နိုင်ပါဘူး။

အသုံးအများဆုံး ဖြေရှင်းနည်းကတော့ — callable/constructable object တစ်ခုအတွက် `default` export တစ်ခု သတ်မှတ်ဖို့ပါ; module loaders တွေက ဒီအခြေအနေမျိုးကို အများအားဖြင့် အလိုအလျောက် သိရှိပြီး — top-level object ကို `default` export နဲ့ အစားထိုးပေးပါတယ်။ သင့် tsconfig.json ထဲမှာ [`"esModuleInterop": true`](https://www.typescriptlang.org/tsconfig/#esModuleInterop) ရှိမယ်ဆိုရင် — TypeScript က ဒါကို သင့်အတွက် စီမံပေးနိုင်ပါတယ်။
