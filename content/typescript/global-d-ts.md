---
title: "Global .d.ts (Global Libraries များအတွက် .d.ts Template)"
description: "import လုပ်စရာမလိုဘဲ global scope ကနေ တိုက်ရိုက် သုံးလို့ရတဲ့ global library တွေအတွက် .d.ts ရေးနည်း — global library ကို code ကနေ ခွဲခြား သိရှိပုံ နဲ့ template ဥပမာ"
order: 34
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-d-ts.html"
status: translated
updated: 2026-09-05
---

## Global Libraries (နေရာတိုင်းက သုံးလို့ရတဲ့ Libraries)

_Global_ library ဆိုတာ — global scope ကနေ တိုက်ရိုက် ဝင်ရောက် သုံးစွဲလို့ရတဲ့ library ကို ခေါ်ပါတယ် (ဆိုလိုတာက `import` ပုံစံ တစ်မျိုးမျိုး သုံးစရာ မလိုဘူးဆိုတဲ့ သဘောပါ)။ Library အများစုက သုံးစွဲဖို့အတွက် global variable တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုပြီး ရိုးရှင်းစွာ ထုတ်ဖော်ထားတတ်ပါတယ်။ ဥပမာ — [jQuery](https://jquery.com/) ကို သုံးနေတယ်ဆိုရင် `$` variable ကို ရည်ညွှန်းရုံနဲ့တင် သုံးလို့ရပါတယ်:

```ts
$(() => {
  console.log("hello!");
});
```

Global library တစ်ခုရဲ့ documentation ထဲမှာ — အဲဒီ library ကို HTML script tag နဲ့ ဘယ်လို သုံးရမလဲဆိုတဲ့ လမ်းညွှန်ချက်တွေကို သင်တွေ့ရလေ့ရှိပါတယ်:

```html
<script src="http://a.great.cdn.for/someLib.js"></script>
```

ဒီနေ့ခေတ်မှာတော့ — လူကြိုက်များတဲ့ globally-accessible (နေရာတိုင်းက ဝင်ရောက်သုံးလို့ရတဲ့) libraries အများစုက တကယ်တော့ UMD libraries တွေအနေနဲ့ ရေးသားထားကြပါတယ် (အောက်မှာ ကြည့်ပါ)။ UMD library ရဲ့ documentation က global library ရဲ့ documentation နဲ့ ခွဲခြားဖို့ ခက်ခဲပါတယ်။ Global declaration file တစ်ခု မရေးခင်မှာ — သင်ရည်ရွယ်ထားတဲ့ library က တကယ်တော့ UMD မဟုတ်ဘူးဆိုတာ သေချာအောင် စစ်ဆေးပါ။

## Code ကနေ Global Library တစ်ခုကို ခွဲခြား သိရှိခြင်း (Identifying a Global Library from Code)

Global library ရဲ့ code က ပုံမှန်အားဖြင့် အလွန်ရိုးရှင်းပါတယ်။ Global "Hello, world" library တစ်ခုဆိုရင် အောက်ကလို ဖြစ်နိုင်ပါတယ်:

```js
function createGreeting(s) {
  return "Hello, " + s;
}
```

ဒါမှမဟုတ် ဒီလိုလည်း ဖြစ်နိုင်ပါတယ်:

```js
window.createGreeting = function (s) {
  return "Hello, " + s;
};
```

Global library တစ်ခုရဲ့ code ကို ကြည့်တဲ့အခါ — အောက်ပါတို့ကို သင်တွေ့ရလေ့ရှိပါတယ်:

- Top-level (အပေါ်ဆုံးအဆင့်) `var` statements တွေ ဒါမှမဟုတ် `function` declarations တွေ
- `window.someName` ဆီကို assignment (တန်ဖိုးသတ်မှတ်ခြင်း) တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပို
- `document` ဒါမှမဟုတ် `window` လိုမျိုး DOM primitives တွေ ရှိနေမယ်ဆိုတဲ့ ယူဆချက် (assumption) တွေ

ဒါတွေကတော့ _မတွေ့ရပါဘူး_:

- `require` ဒါမှမဟုတ် `define` လိုမျိုး module loaders တွေကို စစ်ဆေးခြင်း ဒါမှမဟုတ် အသုံးပြုခြင်း
- `var fs = require("fs");` ပုံစံ CommonJS/Node.js-style imports တွေ
- `define(...)` ခေါ်ဆိုမှုတွေ
- Library ကို `require` ဒါမှမဟုတ် import လုပ်နည်း ဖော်ပြထားတဲ့ documentation တွေ

## Global Libraries ဥပမာများ (Examples of Global Libraries)

Global library တစ်ခုကို UMD library အဖြစ် ပြောင်းလဲရတာ ပုံမှန်အားဖြင့် လွယ်ကူတာမို့ — လူကြိုက်များတဲ့ libraries တွေထဲမှာ global ပုံစံနဲ့ ရေးသားထားဆဲ ဖြစ်တာက အလွန်နည်းပါးပါတယ်။ ဒါပေမယ့် — သေးငယ်ပြီး DOM လိုအပ်တဲ့ (ဒါမှမဟုတ် dependency (မှီခိုမှု) _လုံးဝ မရှိတဲ့_) libraries တွေကတော့ global အနေနဲ့ ဆက်လက် တည်ရှိနေနိုင်ပါတယ်။

## Global Library Template (Global Library အတွက် .d.ts Template)

အောက်မှာ DTS ဥပမာ တစ်ခုကို ကြည့်နိုင်ပါတယ်:

```ts
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

/*~ If this library is callable (e.g. can be invoked as myLib(3)),
 *~ include those call signatures here.
 *~ Otherwise, delete this section.
 */
declare function myLib(a: string): string;
declare function myLib(a: number): number;

/*~ If you want the name of this library to be a valid type name,
 *~ you can do so here.
 *~
 *~ For example, this allows us to write 'var x: myLib';
 *~ Be sure this actually makes sense! If it doesn't, just
 *~ delete this declaration and add types inside the namespace below.
 */
interface myLib {
  name: string;
  length: number;
  extras?: string[];
}

/*~ If your library has properties exposed on a global variable,
 *~ place them here.
 *~ You should also place types (interfaces and type alias) here.
 */
declare namespace myLib {
  //~ We can write 'myLib.timeout = 50;'
  let timeout: number;

  //~ We can access 'myLib.version', but not change it
  const version: string;

  //~ There's some class we can create via 'let c = new myLib.Cat(42)'
  //~ Or reference e.g. 'function f(c: myLib.Cat) { ... }
  class Cat {
    constructor(n: number);

    //~ We can read 'c.age' from a 'Cat' instance
    readonly age: number;

    //~ We can invoke 'c.purr()' from a 'Cat' instance
    purr(): void;
  }

  //~ We can declare a variable as
  //~   'var s: myLib.CatSettings = { weight: 5, name: "Maru" };'
  interface CatSettings {
    weight: number;
    name: string;
    tailLength?: number;
  }

  //~ We can write 'const v: myLib.VetID = 42;'
  //~  or 'const v: myLib.VetID = "bob";'
  type VetID = string | number;

  //~ We can invoke 'myLib.checkCat(c)' or 'myLib.checkCat(c, v);'
  function checkCat(c: Cat, s?: VetID);
}
```
