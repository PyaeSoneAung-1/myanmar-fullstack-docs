---
title: "TypeScript 4.3 (TypeScript 4.3 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 4.3 ၏ ပြောင်းလဲမှုအသစ်များ — properties များအတွက် သီးခြား read/write types များ၊ `override` keyword နှင့် `noImplicitOverride` flag၊ template string type တိုးတက်မှုများ၊ `#private` class elements များ၊ generic type narrowing နှင့် static index signatures အပါအဝင် breaking changes များ"
order: 83
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html"
status: translated
updated: 2026-09-05
---

## Separate Write Types on Properties (Properties များပေါ်မှ သီးခြား Write Types များ)

JavaScript မှာ — APIs တွေက ထည့်သွင်းလာတဲ့ values တွေကို သိမ်းဆည်းခင် အရင်ဆုံး ပြောင်းလဲ (convert) လုပ်လေ့ ရှိပါတယ်။
ဒါက getters နဲ့ setters တွေမှာလည်း မကြာခဏ ဖြစ်တတ်ပါတယ်။
ဥပမာ — value တစ်ခုကို private field တစ်ခုထဲ မသိမ်းခင် အမြဲတမ်း `number` အဖြစ် ပြောင်းလဲပေးတဲ့ setter တစ်ခု ပါတဲ့ class တစ်ခု ရှိတယ်လို့ မြင်ယောင်ကြည့်ရအောင်။

```js twoslash
class Thing {
  #size = 0;

  get size() {
    return this.#size;
  }
  set size(value) {
    let num = Number(value);

    // Don't allow NaN and stuff.
    if (!Number.isFinite(num)) {
      this.#size = 0;
      return;
    }

    this.#size = num;
  }
}
```

ဒီ JavaScript code ကို TypeScript မှာ ဘယ်လို type လုပ်မလဲ?
နည်းပညာအရ ဒီမှာ အထူး တစ်ခုခု လုပ်စရာ မလိုပါဘူး — explicit types တွေ မပါဘဲနဲ့တင် TypeScript က ဒါကို ကြည့်ပြီး — `size` က number တစ်ခုဆိုတာ တွက်ဆနိုင်ပါတယ်။

ပြဿနာက — `size` က `number` တွေထက် ပိုပြီး တခြားဟာတွေကိုပါ assign လုပ်ခွင့် ပေးနေတာပါ။
ဒီ snippet ထဲမှာလိုမျိုး — `size` မှာ `unknown` ဒါမှမဟုတ် `any` type ရှိတယ်လို့ ပြောခြင်းအားဖြင့် ဒါကို ရှောင်လွှဲနိုင်ပါတယ်:

```ts
class Thing {
  // ...
  get size(): unknown {
    return this.#size;
  }
}
```

ဒါပေမယ့် ဒါက မကောင်းပါဘူး — `unknown` က `size` ကို ဖတ်သူတွေကို type assertion တစ်ခု လုပ်ခိုင်းပြီး — `any` က ဘယ် mistake ကိုမှ ဖမ်းမပေးနိုင်ပါဘူး။
Values တွေကို ပြောင်းလဲပေးတဲ့ APIs တွေကို တကယ် model လုပ်ချင်ရင် — TypeScript ရဲ့ အရင်ဗားရှင်းတွေက — တိကျခြင်း (value ဖတ်ရတာ လွယ်ပြီး ရေးရတာ ခက်စေတဲ့) နဲ့ လျော့ရဲရဲ (value ရေးရတာ လွယ်ပြီး ဖတ်ရတာ ခက်စေတဲ့) — နှစ်ခုထဲက တစ်ခုကို ရွေးခိုင်းပါတယ်။

ဒါကြောင့်ပဲ TypeScript 4.3 က — properties တွေကို ဖတ်ခြင်းနဲ့ ရေးသားခြင်းအတွက် types တွေကို သီးခြား သတ်မှတ်ခွင့် ပြုလိုက်ပါတယ်။

```ts twoslash
class Thing {
  #size = 0;

  get size(): number {
    return this.#size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // Don't allow NaN and stuff.
    if (!Number.isFinite(num)) {
      this.#size = 0;
      return;
    }

    this.#size = num;
  }
}
```

အပေါ်က ဥပမာမှာ — ကျွန်တော်တို့ရဲ့ `set` accessor က ပိုကျယ်ပြန့်တဲ့ types အစုတစ်ခု (`string` တွေ၊ `boolean` တွေနဲ့ `number` တွေ) ကို လက်ခံပြီး — `get` accessor ကတော့ အမြဲတမ်း `number` တစ်ခု ဖြစ်မယ်လို့ အာမခံပါတယ်။
အခုတော့ နောက်ဆုံးမှာ ဒီ properties တွေဆီ တခြား types တွေကို error မရှိဘဲ assign လုပ်နိုင်ပါပြီ!

```ts twoslash
class Thing {
  #size = 0;

  get size(): number {
    return this.#size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // Don't allow NaN and stuff.
    if (!Number.isFinite(num)) {
      this.#size = 0;
      return;
    }

    this.#size = num;
  }
}
// ---cut---
let thing = new Thing();

// Assigning other types to `thing.size` works!
thing.size = "hello";
thing.size = true;
thing.size = 42;

// Reading `thing.size` always produces a number!
let mySize: number = thing.size;
```

နာမည်တူ properties နှစ်ခု အချင်းချင်း ဘယ်လို ဆက်စပ်လဲဆိုတာ စဉ်းစားတဲ့အခါ — TypeScript က "reading" type (ဥပမာ အပေါ်က `get` accessor ပေါ်က type) ကိုပဲ သုံးပါတယ်။
"Writing" types တွေကို property တစ်ခုဆီ တိုက်ရိုက် ရေးသားတဲ့အခါမှာသာ ထည့်သွင်း စဉ်းစားပါတယ်။

သတိပြုရမှာက — ဒါက classes တွေအတွက်သာ ကန့်သတ်ထားတဲ့ ပုံစံတစ်ခု မဟုတ်ပါဘူး။
Object literals တွေထဲမှာလည်း — types မတူညီတဲ့ getters နဲ့ setters တွေကို ရေးနိုင်ပါတယ်။

```ts
function makeThing(): Thing {
  let size = 0;
  return {
    get size(): number {
      return size;
    },
    set size(value: string | number | boolean) {
      let num = Number(value);

      // Don't allow NaN and stuff.
      if (!Number.isFinite(num)) {
        size = 0;
        return;
      }

      size = num;
    },
  };
}
```

တကယ်တော့ — properties တွေပေါ်မှာ မတူညီတဲ့ reading/writing types တွေကို ထောက်ပံ့ဖို့ — interfaces/object types တွေဆီ syntax ကို ကျွန်တော်တို့ ထည့်ပေးထားပါတယ်။

```ts
// Now valid!
interface Thing {
    get size(): number
    set size(value: number | string | boolean);
}
```

Properties တွေကို ဖတ်ခြင်းနဲ့ ရေးသားခြင်းအတွက် types မတူညီတာ သုံးခြင်းရဲ့ ကန့်သတ်ချက်တစ်ခုက — property တစ်ခုကို ဖတ်တဲ့ type က — သင် ရေးသားနေတဲ့ type ဆီ assignable ဖြစ်ရပါမယ်။
တစ်နည်းပြောရရင် — getter type က setter ဆီ assignable ဖြစ်ရပါတယ်။
ဒါက ညီညွတ်မှု အဆင့်တစ်ခုကို သေချာစေပါတယ် — property တစ်ခုက သူ့ဟာသူဆီ အမြဲ assignable ဖြစ်နေဖို့ပါ။

ဒီ feature အကြောင်း ပိုပြီး သိချင်ရင် — [အကောင်အထည်ဖော်တဲ့ pull request](https://github.com/microsoft/TypeScript/pull/42425) ကို ကြည့်ပါ။

## `override` and the `--noImplicitOverride` Flag (`override` နှင့် `--noImplicitOverride` Flag)

JavaScript မှာ classes တွေကို extend လုပ်တဲ့အခါ — language က methods တွေကို override လုပ်တာ အလွန် လွယ်ကူစေပါတယ် (pun ရည်ရွယ်ထားပါတယ်) — ဒါပေမယ့် ကံမကောင်းစွာနဲ့ပဲ — သင်ကြုံတွေ့နိုင်တဲ့ mistake တချို့ ရှိပါတယ်။

အကြီးမားဆုံးတစ်ခုက နာမည်ပြောင်းမှု လွတ်သွားတာပါ။
ဥပမာ — အောက်က classes တွေကို ကြည့်ပါ:

```ts
class SomeComponent {
  show() {
    // ...
  }
  hide() {
    // ...
  }
}

class SpecializedComponent extends SomeComponent {
  show() {
    // ...
  }
  hide() {
    // ...
  }
}
```

`SpecializedComponent` က `SomeComponent` ကို subclass လုပ်ပြီး — `show` နဲ့ `hide` methods တွေကို override လုပ်ပါတယ်။
တစ်ယောက်ယောက်က `show` နဲ့ `hide` တွေကို ဖယ်ထုတ်ပြီး — method တစ်ခုတည်းနဲ့ အစားထိုးဖို့ ဆုံးဖြတ်လိုက်ရင် ဘာဖြစ်မလဲ?

```diff
 class SomeComponent {
-    show() {
-        // ...
-    }
-    hide() {
-        // ...
-    }
+    setVisible(value: boolean) {
+        // ...
+    }
 }
 class SpecializedComponent extends SomeComponent {
     show() {
         // ...
     }
     hide() {
         // ...
     }
 }
```

_အို မဖြစ်တော့ဘူး!_
ကျွန်တော်တို့ရဲ့ `SpecializedComponent` က အပ်ဒိတ် မလုပ်မိခဲ့ပါဘူး။
အခု သူက — ခေါ်ယူခံရဖို့ မဖြစ်နိုင်တဲ့ — အသုံးမဝင်တဲ့ `show` နဲ့ `hide` methods နှစ်ခုကိုသာ ထပ်ဖြည့်နေပါတယ်။

ဒီမှာ ပြဿနာရဲ့ တစ်စိတ်တစ်ပိုင်းက — method အသစ်တစ်ခု ထည့်ချင်တာလား၊ ဒါမှမဟုတ် ရှိပြီးသားတစ်ခုကို override လုပ်ချင်တာလားဆိုတာ သုံးစွဲသူအနေနဲ့ ရှင်းရှင်းလင်းလင်း ဖော်ပြလို့ မရတာပါ။
ဒါကြောင့်ပဲ TypeScript 4.3 က `override` keyword ကို ထည့်ပေးလိုက်တာပါ။

```ts
class SpecializedComponent extends SomeComponent {
    override show() {
        // ...
    }
    override hide() {
        // ...
    }
}
```

Method တစ်ခုကို `override` နဲ့ မှတ်သားထားတဲ့အခါ — TypeScript က base class ထဲမှာ နာမည်တူ method တစ်ခု ရှိနေဖို့ အမြဲတမ်း သေချာ လုပ်ပါလိမ့်မယ်။

```ts twoslash
// @noImplicitOverride
// @errors: 4113
class SomeComponent {
    setVisible(value: boolean) {
        // ...
    }
}
class SpecializedComponent extends SomeComponent {
    override show() {

    }
}
```

ဒါက တိုးတက်မှု ကြီးတစ်ခုပါ — ဒါပေမယ့် method တစ်ခုပေါ်မှာ `override` ရေးဖို့ _မေ့သွားရင်တော့_ အထောက်အကူ မဖြစ်ပါဘူး — ပြီးတော့ ဒါကလည်း သုံးစွဲသူတွေ ကြုံရနိုင်တဲ့ mistake ကြီးတစ်ခုပါ။

ဥပမာ — သင်သတိမထားမိဘဲ — base class တစ်ခုထဲမှာ ရှိနေတဲ့ method တစ်ခုကို မတော်တဆ "နင်းကျော်သွား" (trample over) မိနိုင်ပါတယ်။

```ts
class Base {
  someHelperMethod() {
    // ...
  }
}

class Derived extends Base {
  // Oops! We weren't trying to override here,
  // we just needed to write a local helper method.
  someHelperMethod() {
    // ...
  }
}
```

ဒါကြောင့်ပဲ TypeScript 4.3 က flag အသစ်တစ်ခုဖြစ်တဲ့ [`noImplicitOverride`](https://www.typescriptlang.org/tsconfig#noImplicitOverride) ကိုပါ _ထပ်ပြီး_ ပံ့ပိုးပေးပါတယ်။
ဒီ option ဖွင့်ထားတဲ့အခါ — `override` keyword တစ်ခုကို အတိအကျ သုံးထားခြင်း မရှိဘဲ — superclass ကနေ method တစ်ခုခုကို override လုပ်တာက error တစ်ခု ဖြစ်လာပါတယ်။
နောက်ဆုံး ဥပမာမှာ — TypeScript က [`noImplicitOverride`](https://www.typescriptlang.org/tsconfig#noImplicitOverride) အောက်မှာ error တက်ပြီး — `Derived` ထဲက method ကို နာမည်ပြောင်းဖို့ လိုနိုင်တယ်ဆိုတဲ့ သဲလွန်စတစ်ခုကို ပေးပါလိမ့်မယ်။

ဒီနေရာမှာ အကောင်အထည်ဖော်မှုအတွက် ကျွန်တော်တို့ရဲ့ community ကို ကျေးဇူးတင်ကြောင်း ဖော်ပြချင်ပါတယ်။
ဒီအလုပ်တွေကို [pull request](https://github.com/microsoft/TypeScript/pull/39669) တစ်ခုထဲမှာ [Wenlu Wang](https://github.com/Kingwl) က အကောင်အထည်ဖော်ခဲ့ပါတယ် — `override` keyword ကိုပဲ အရင်က အကောင်အထည်ဖော်ခဲ့တဲ့ [Paul Cody Johnston](https://github.com/pcj) ရဲ့ အစောပိုင်း pull request က ဦးတည်ချက်နဲ့ ဆွေးနွေးမှုအတွက် အခြေခံ အဖြစ် ဆောင်ရွက်ခဲ့ပါတယ်။
ဒီ features တွေအတွက် အချိန် ပေးခဲ့တာကို ကျေးဇူးတင်ကြောင်း ဖော်ပြပါတယ်။

## Template String Type Improvements (Template String Type များ တိုးတက်လာခြင်း)

မကြာသေးတဲ့ ဗားရှင်းတွေမှာ — TypeScript က type construct အသစ်တစ်ခုကို မိတ်ဆက်ခဲ့ပါတယ်: template string types တွေပါ။
ဒါတွေက string နဲ့တူတဲ့ types အသစ်တွေကို ပေါင်းစည်းခြင်းအားဖြင့် တည်ဆောက်တဲ့ types တွေ ဒါမှမဟုတ်...

```ts
type Color = "red" | "blue";
type Quantity = "one" | "two";

type SeussFish = `${Quantity | Color} fish`;
// same as
//   type SeussFish = "one fish" | "two fish"
//                  | "red fish" | "blue fish";
```

...ဒါမှမဟုတ် တခြား string နဲ့တူတဲ့ types တွေရဲ့ ပုံစံတွေနဲ့ ကိုက်ညီတဲ့ types တွေပါ။

```ts
declare let s1: `${number}-${number}-${number}`;
declare let s2: `1-2-3`;

// Works!
s1 = s2;
```

ကျွန်တော်တို့ လုပ်ခဲ့တဲ့ ပထမဆုံး ပြောင်းလဲမှုက — TypeScript က template string type တစ်ခုကို ဘယ်အချိန် infer လုပ်မလဲဆိုတာပါ။
Template string တစ်ခုကို string-literal နဲ့တူတဲ့ type တစ်ခုက _contextually typed_ လုပ်တဲ့အခါ (ဆိုလိုတာက — TypeScript က literal type တစ်ခု လက်ခံတဲ့ အရာတစ်ခုဆီ template string တစ်ခု ပို့နေတာကို မြင်တဲ့အခါ) — အဲဒီ expression ကို template type တစ်ခု ပေးဖို့ ကြိုးစားပါလိမ့်မယ်။

```ts
function bar(s: string): `hello ${string}` {
    // Previously an error, now works!
    return `hello ${s}`;
}
```

ဒါက — types တွေကို infer လုပ်တဲ့အခါနဲ့ type parameter က `extends string` ဖြစ်နေတဲ့အခါမှာလည်း အလုပ်လုပ်ပါတယ်

```ts
declare let s: string;
declare function f<T extends string>(x: T): T;

// Previously: string
// Now       : `hello ${string}`
let x2 = f(`hello ${s}`);
```

ဒီမှာ ဒုတိယမြောက် အဓိက ပြောင်းလဲမှုက — TypeScript က template string types မတူညီတာတွေကို အခု ပိုကောင်းကောင်း ဆက်စပ်နိုင်ပြီး — _အချင်းချင်း infer_ လုပ်နိုင်တာပါ။

ဒါကို မြင်ရဖို့ — အောက်က ဥပမာ code ကို ကြည့်ပါ:

```ts
declare let s1: `${number}-${number}-${number}`;
declare let s2: `1-2-3`;
declare let s3: `${number}-2-3`;

s1 = s2;
s1 = s3;
```

`s2` ပေါ်မှာလိုမျိုး string literal type တစ်ခုနဲ့ စစ်ဆေးတဲ့အခါ — TypeScript က string contents တွေနဲ့ ကိုက်ညီမှု ရှိမရှိ စစ်ပြီး — ပထမ assignment မှာ `s2` က `s1` နဲ့ compatible ဖြစ်တယ်ဆိုတာ တွက်ဆနိုင်ခဲ့ပါတယ်;
ဒါပေမယ့် — တခြား template string တစ်ခုကို မြင်တာနဲ့ — သူက လက်လျှော့လိုက်ပါတယ်။
အကျိုးဆက်အနေနဲ့ — `s3` ကနေ `s1` ဆီလို assignments တွေက အလုပ်မလုပ်ခဲ့ပါဘူး။

TypeScript က အခု — template string တစ်ခုရဲ့ အစိတ်အပိုင်း တစ်ခုချင်းစီ အောင်မြင်စွာ ကိုက်ညီနိုင်/မနိုင်ဆိုတာကို သက်သေပြဖို့ တကယ် အလုပ်လုပ်ပေးပါတယ်။
Substitutions မတူညီတဲ့ template strings တွေကို အခု ရော၍ ယှဉ်တွဲ သုံးနိုင်ပြီး — သူတို့ တကယ် compatible လားဆိုတာ TypeScript က ကောင်းကောင်း စစ်ဆေးပေးပါလိမ့်မယ်။

```ts
declare let s1: `${number}-${number}-${number}`;
declare let s2: `1-2-3`;
declare let s3: `${number}-2-3`;
declare let s4: `1-${number}-3`;
declare let s5: `1-2-${number}`;
declare let s6: `${number}-2-${number}`;

// Now *all of these* work!
s1 = s2;
s1 = s3;
s1 = s4;
s1 = s5;
s1 = s6;
```

ဒီအလုပ်ကို လုပ်ရင်း — ပိုကောင်းတဲ့ inference စွမ်းရည်တွေကိုလည်း ထည့်ဖို့ သေချာ လုပ်ခဲ့ပါတယ်။
ဒါတွေ အလုပ်လုပ်နေတဲ့ ဥပမာတစ်ခုကို ကြည့်နိုင်ပါတယ်:

```ts
declare function foo<V extends string>(arg: `*${V}*`): V;

function test<T extends string>(s: string, n: number, b: boolean, t: T) {
    let x1 = foo("*hello*");            // "hello"
    let x2 = foo("**hello**");          // "*hello*"
    let x3 = foo(`*${s}*` as const);    // string
    let x4 = foo(`*${n}*` as const);    // `${number}`
    let x5 = foo(`*${b}*` as const);    // "true" | "false"
    let x6 = foo(`*${t}*` as const);    // `${T}`
    let x7 = foo(`**${s}**` as const);  // `*${string}*`
}
```

နောက်ထပ် အချက်အလက်တွေအတွက် — [contextual types တွေကို အသုံးချခြင်းဆိုင်ရာ မူလ pull request](https://github.com/microsoft/TypeScript/pull/43376) နဲ့ — [template types တွေအကြား inference နဲ့ checking ကို တိုးတက်စေတဲ့ pull request](https://github.com/microsoft/TypeScript/pull/43361) တို့ကို ကြည့်ပါ။

## ECMAScript `#private` Class Elements (ECMAScript `#private` Class Elements များ)

TypeScript 4.3 က — class တစ်ခုထဲက ဘယ် elements တွေကို run-time မှာ တကယ် private ဖြစ်အောင် `#private` `#names` တွေ ပေးနိုင်လဲဆိုတာကို ချဲ့ထွင်ပေးပါတယ်။
Properties တွေအပြင် — methods နဲ့ accessors တွေကိုပါ private names တွေ ပေးနိုင်ပါပြီ။

```ts
class Foo {
  #someMethod() {
    //...
  }

  get #someValue() {
    return 100;
  }

  publicMethod() {
    // These work.
    // We can access private-named members inside this class.
    this.#someMethod();
    return this.#someValue;
  }
}

new Foo().#someMethod();
//        ~~~~~~~~~~~
// error!
// Property '#someMethod' is not accessible
// outside class 'Foo' because it has a private identifier.

new Foo().#someValue;
//        ~~~~~~~~~~
// error!
// Property '#someValue' is not accessible
// outside class 'Foo' because it has a private identifier.
```

ဒီထက်ပိုပြီး ကျယ်ကျယ်ပြန့်ပြန့် အနေနဲ့ — static members တွေမှာလည်း အခု private names တွေ ရှိနိုင်ပါပြီ။

```ts
class Foo {
  static #someMethod() {
    // ...
  }
}

Foo.#someMethod();
//  ~~~~~~~~~~~
// error!
// Property '#someMethod' is not accessible
// outside class 'Foo' because it has a private identifier.
```

ဒီ feature ကို Bloomberg က ကျွန်တော်တို့ရဲ့ သူငယ်ချင်းတွေက [pull request](https://github.com/microsoft/TypeScript/pull/42458) တစ်ခုမှာ ရေးသားခဲ့ပါတယ် — [Titian Cernicova-Dragomir](https://github.com/dragomirtitian) နဲ့ [Kubilay Kahveci](https://github.com/mkubilayk) တို့က ရေးသားပြီး — [Joey Watts](https://github.com/joeywatts), [Rob Palmer](https://github.com/robpalme) နဲ့ [Tim McClure](https://github.com/tim-mc) တို့ရဲ့ ပံ့ပိုးမှုနဲ့ ကျွမ်းကျင်မှုတွေ ပါဝင်ပါတယ်။
သူတို့အားလုံးကို ကျေးဇူးတင်ကြောင်း ဖော်ပြချင်ပါတယ်!

## `ConstructorParameters` Works on Abstract Classes (`ConstructorParameters` သည် Abstract Classes များတွင် အလုပ်လုပ်ခြင်း)

TypeScript 4.3 မှာ — `ConstructorParameters` ဆိုတဲ့ type helper က `abstract` classes တွေပေါ်မှာ အခု အလုပ်လုပ်ပါပြီ။

```ts
abstract class C {
  constructor(a: string, b: number) {
    // ...
  }
}

// Has the type '[a: string, b: number]'.
type CParams = ConstructorParameters<typeof C>;
```

ဒါက TypeScript 4.2 မှာ လုပ်ခဲ့တဲ့ အလုပ်ကြောင့်ပါ — အဲဒီမှာ construct signatures တွေကို abstract အဖြစ် မှတ်သားနိုင်ခဲ့ပါတယ်:

```ts
type MyConstructorOf<T> = {
    abstract new(...args: any[]): T;
}

// or using the shorthand syntax:

type MyConstructorOf<T> = abstract new (...args: any[]) => T;
```

ပြောင်းလဲမှုကို [GitHub ပေါ်မှာ ပိုပြီး အသေးစိတ် ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/43380).

## Contextual Narrowing for Generics (Generics များအတွက် Contextual Narrowing)

TypeScript 4.3 မှာ — generic values တွေပေါ်မှာ လုပ်ဆောင်တဲ့ type-narrowing logic နည်းနည်း ပိုတော်လာတာတွေ ပါဝင်ပါတယ်။
ဒါက TypeScript ကို ပုံစံတွေ ပိုများများ လက်ခံနိုင်စေပြီး — တစ်ခါတလေ mistakes တွေကိုတောင် ဖမ်းမိစေပါတယ်။

အကြောင်းရင်း အနေနဲ့ — `makeUnique` လို့ ခေါ်တဲ့ function တစ်ခုကို ရေးဖို့ ကြိုးစားနေတယ်လို့ ဆိုကြပါစို့။
သူက elements တွေရဲ့ `Set` တစ်ခု ဒါမှမဟုတ် `Array` တစ်ခုကို ယူပြီး — `Array` တစ်ခု ပေးလိုက်ရင် — အဲဒီ `Array` ကို စီပြီး — comparison function တစ်ခုအရ duplicate တွေကို ဖယ်ရှားပါလိမ့်မယ်။
ဒါတွေအားလုံး ပြီးရင် — မူလ collection ကိုပဲ ပြန်ပေးပါလိမ့်မယ်။

```ts
function makeUnique<T>(
  collection: Set<T> | T[],
  comparer: (x: T, y: T) => number
): Set<T> | T[] {
  // Early bail-out if we have a Set.
  // We assume the elements are already unique.
  if (collection instanceof Set) {
    return collection;
  }

  // Sort the array, then remove consecutive duplicates.
  collection.sort(comparer);
  for (let i = 0; i < collection.length; i++) {
    let j = i;
    while (
      j < collection.length &&
      comparer(collection[i], collection[j + 1]) === 0
    ) {
      j++;
    }
    collection.splice(i + 1, j - i);
  }
  return collection;
}
```

ဒီ function ရဲ့ အကောင်အထည်ဖော်မှုနဲ့ ပတ်သက်တဲ့ မေးခွန်းတွေကို ဘေးဖယ်ထားပြီး — ဒါက ပိုကျယ်ပြန့်တဲ့ application တစ်ခုရဲ့ လိုအပ်ချက်တွေကနေ ပေါ်ပေါက်လာတယ်လို့ ယူဆလိုက်ပါ။
သင်သတိထားမိနိုင်တာတစ်ခုက — signature က `collection` ရဲ့ မူလ type ကို ဖမ်းယူမထားပါဘူး။
ကျွန်တော်တို့ ရေးထားတဲ့ `Set<T> | T[]` နေရာမှာ `C` လို့ ခေါ်တဲ့ type parameter တစ်ခု ထည့်ခြင်းအားဖြင့် ဒါကို လုပ်နိုင်ပါတယ်။

```diff
- function makeUnique<T>(collection: Set<T> | T[], comparer: (x: T, y: T) => number): Set<T> | T[]
+ function makeUnique<T, C extends Set<T> | T[]>(collection: C, comparer: (x: T, y: T) => number): C
```

TypeScript 4.2 နဲ့ အစောပိုင်းတွေမှာ — ဒါကို ကြိုးစားလိုက်တာနဲ့ — error တွေ အများကြီးနဲ့ အဆုံးသတ်ရပါလိမ့်မယ်။

```ts
function makeUnique<T, C extends Set<T> | T[]>(
  collection: C,
  comparer: (x: T, y: T) => number
): C {
  // Early bail-out if we have a Set.
  // We assume the elements are already unique.
  if (collection instanceof Set) {
    return collection;
  }

  // Sort the array, then remove consecutive duplicates.
  collection.sort(comparer);
  //         ~~~~
  // error: Property 'sort' does not exist on type 'C'.
  for (let i = 0; i < collection.length; i++) {
    //                             ~~~~~~
    // error: Property 'length' does not exist on type 'C'.
    let j = i;
    while (
      j < collection.length &&
      comparer(collection[i], collection[j + 1]) === 0
    ) {
      //                    ~~~~~~
      // error: Property 'length' does not exist on type 'C'.
      //                                       ~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~
      // error: Element implicitly has an 'any' type because expression of type 'number'
      //        can't be used to index type 'Set<T> | T[]'.
      j++;
    }
    collection.splice(i + 1, j - i);
    //         ~~~~~~
    // error: Property 'splice' does not exist on type 'C'.
  }
  return collection;
}
```

အေး၊ errors တွေပါ!
TypeScript က ဘာလို့ ကျွန်တော်တို့ကို ဒီလောက် ကြမ်းနေတာလဲ?

ပြဿနာက — ကျွန်တော်တို့ လုပ်တဲ့ `collection instanceof Set` စစ်ဆေးမှုက — type guard တစ်ခုအနေနဲ့ လုပ်ဆောင်ပြီး — ကျွန်တော်တို့ ရောက်နေတဲ့ branch ပေါ် မူတည်ပြီး type ကို `Set<T> | T[]` ကနေ `Set<T>` နဲ့ `T[]` ဆီ narrow လုပ်ပေးမယ်လို့ မျှော်လင့်ထားတာပါ;
ဒါပေမယ့် — ကျွန်တော်တို့ ကိုင်တွယ်နေတာက `Set<T> | T[]` မဟုတ်ပါဘူး — type က `C` ဖြစ်နေတဲ့ generic value `collection` ကို narrow လုပ်ဖို့ ကြိုးစားနေတာပါ။

ဒါက အလွန် သိမ်မွေ့တဲ့ ခြားနားချက်တစ်ခုပါ — ဒါပေမယ့် ရလဒ်ကို ပြောင်းလဲစေပါတယ်။
TypeScript က `C` ရဲ့ constraint (ကန့်သတ်ချက် — `Set<T> | T[]` ဖြစ်တဲ့) ကို ယူပြီး အဲဒါကို narrow လုပ်လို့ မရပါဘူး။
TypeScript က `Set<T> | T[]` ကနေ တကယ် narrow လုပ်ဖို့ ကြိုးစားခဲ့ရင် — branch တစ်ခုချင်းစီမှာ `collection` က `C` တစ်ခုလည်း ဖြစ်တယ်ဆိုတာကို မေ့သွားစေပါလိမ့်မယ် — ဘာလို့လဲဆိုတော့ အဲဒီအချက်အလက်ကို ထိန်းသိမ်းဖို့ လွယ်ကူတဲ့ နည်းလမ်း မရှိလို့ပါ။
TypeScript က အဲဒီနည်းလမ်းကို စမ်းခဲ့ရင် — အပေါ်က ဥပမာကို နောက်တစ်နည်းနဲ့ ချိုးဖျက်မိပါလိမ့်မယ်။
Function က `C` type ရှိတဲ့ values တွေကို မျှော်လင့်တဲ့ return နေရာတွေမှာ — branch တစ်ခုချင်းစီက `Set<T>` တစ်ခုနဲ့ `T[]` တစ်ခု ရပြီး — TypeScript က အဲဒါတွေကို ငြင်းပယ်ပါလိမ့်မယ်။

```ts
function makeUnique<T>(
  collection: Set<T> | T[],
  comparer: (x: T, y: T) => number
): Set<T> | T[] {
  // Early bail-out if we have a Set.
  // We assume the elements are already unique.
  if (collection instanceof Set) {
    return collection;
    //     ~~~~~~~~~~
    // error: Type 'Set<T>' is not assignable to type 'C'.
    //          'Set<T>' is assignable to the constraint of type 'C', but
    //          'C' could be instantiated with a different subtype of constraint 'Set<T> | T[]'.
  }

  // ...

  return collection;
  //     ~~~~~~~~~~
  // error: Type 'T[]' is not assignable to type 'C'.
  //          'T[]' is assignable to the constraint of type 'C', but
  //          'C' could be instantiated with a different subtype of constraint 'Set<T> | T[]'.
}
```

ဒါဆို TypeScript 4.3 က အခြေအနေတွေကို ဘယ်လို ပြောင်းလဲပေးလဲ?
ကောင်းပြီ — အခြေခံအားဖြင့် — code ရေးတဲ့အခါ အဓိက နေရာအနည်းငယ်မှာ — type system အတွက် တကယ် အရေးကြီးတာက type တစ်ခုရဲ့ constraint ပဲ ဖြစ်ပါတယ်။
ဥပမာ — `collection.length` လို့ ရေးတဲ့အခါ — TypeScript က `collection` မှာ `C` type ရှိတယ်ဆိုတဲ့ အချက်ကို ဂရုမစိုက်ဘဲ — `T[] | Set<T>` ဆိုတဲ့ constraint ကနေ သတ်မှတ်လိုက်တဲ့ — ရရှိနိုင်တဲ့ properties တွေကိုပဲ ဂရုစိုက်ပါတယ်။

ဒီလိုကိစ္စမျိုးမှာ — TypeScript က constraint ရဲ့ narrowed type ကို ယူပါလိမ့်မယ် — ဘာလို့လဲဆိုတော့ အဲဒါက သင် ဂရုစိုက်တဲ့ အချက်အလက်ကို ပေးလို့ပါ;
ဒါပေမယ့် — တခြားကိစ္စတိုင်းမှာတော့ — မူလ generic type ကိုပဲ narrow လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ် (ပြီးတော့ မကြာခဏဆိုသလို — မူလ generic type နဲ့ပဲ အဆုံးသတ်ပါလိမ့်မယ်)။

တစ်နည်းပြောရရင် — generic value တစ်ခုကို သင်သုံးတဲ့ပုံစံပေါ် မူတည်ပြီး — TypeScript က သူ့ကို နည်းနည်း ကွဲပြားစွာ narrow လုပ်ပါလိမ့်မယ်။
နောက်ဆုံး ရလဒ်ကတော့ — အပေါ်က ဥပမာ တစ်ခုလုံးက type-checking errors မရှိဘဲ compile ဖြစ်သွားတာပါ။

အသေးစိတ်အတွက် — [GitHub ပေါ်က မူလ pull request ကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/43183).

## Always-Truthy Promise Checks (အမြဲ Truthy ဖြစ်နေသော Promise များအတွက် စစ်ဆေးမှုများ)

[`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) အောက်မှာ — conditional တစ်ခုထဲမှာ `Promise` တစ်ခု "truthy" ဟုတ်မဟုတ် စစ်ဆေးတာက error တစ်ခုကို ဖြစ်ပေါ်စေပါလိမ့်မယ်။

```ts
async function foo(): Promise<boolean> {
  return false;
}

async function bar(): Promise<string> {
  if (foo()) {
    //  ~~~~~
    // Error!
    // This condition will always return true since
    // this 'Promise<boolean>' appears to always be defined.
    // Did you forget to use 'await'?
    return "true";
  }
  return "false";
}
```

[ဒီပြောင်းလဲမှု](https://github.com/microsoft/TypeScript/pull/39175) ကို [Jack Works](https://github.com/Jack-Works) က ပံ့ပိုးပေးခဲ့ပြီး — သူ့ကို ကျေးဇူးတင်ကြောင်း ဖော်ပြပါတယ်!

## `static` Index Signatures (`static` Index Signatures များ)

Index signatures တွေက — type တစ်ခုက အတိအကျ ကြေညာထားတာထက် — value တစ်ခုပေါ်မှာ properties တွေ ပိုပြီး သတ်မှတ်နိုင်စေပါတယ်။

```ts
class Foo {
  hello = "hello";
  world = 1234;

  // This is an index signature:
  [propName: string]: string | number | undefined;
}

let instance = new Foo();

// Valid assignment
instance["whatever"] = 42;

// Has type 'string | number | undefined'.
let x = instance["something"];
```

အခုထိတော့ — index signature တစ်ခုကို class တစ်ခုရဲ့ instance ဘက်ခြမ်းမှာပဲ ကြေညာနိုင်ခဲ့ပါတယ်။
ဒါက [pull request](https://github.com/microsoft/TypeScript/pull/37797) တစ်ခုကြောင့် ဖြစ်လာတာပါ — [Wenlu Wang](https://github.com/microsoft/TypeScript/pull/37797) ဆီကပါ။
Index signatures တွေကို အခု `static` အဖြစ် ကြေညာနိုင်ပါပြီ။

```ts
class Foo {
  static hello = "hello";
  static world = 1234;

  static [propName: string]: string | number | undefined;
}

// Valid.
Foo["whatever"] = 42;

// Has type 'string | number | undefined'
let x = Foo["something"];
```

Class တစ်ခုရဲ့ static ဘက်ခြမ်းမှာ index signatures တွေအတွက် ကျင့်သုံးတဲ့ စည်းမျဉ်းတွေက instance ဘက်ခြမ်းအတွက်နဲ့ အတူတူပါပဲ — တစ်နည်းပြောရရင် — static property တိုင်းက index signature နဲ့ compatible ဖြစ်ရပါတယ်။

```ts
class Foo {
  static prop = true;
  //     ~~~~
  // Error! Property 'prop' of type 'boolean'
  // is not assignable to string index type
  // 'string | number | undefined'.

  static [propName: string]: string | number | undefined;
}
```

## `.tsbuildinfo` Size Improvements (`.tsbuildinfo` အရွယ်အစား တိုးတက်ကောင်းမွန်လာခြင်း)

TypeScript 4.3 မှာ — [`incremental`](https://www.typescriptlang.org/tsconfig#incremental) builds တွေရဲ့ တစ်စိတ်တစ်ပိုင်းအနေနဲ့ ထုတ်ပေးတဲ့ `.tsbuildinfo` files တွေက သိသိသာသာ သေးငယ်လာသင့်ပါတယ်။
ဒါက အတွင်းပိုင်း format ထဲက optimization တွေ အများကြီးကြောင့်ပါ — full paths နဲ့ အလားတူ အချက်အလက်တွေကို ထပ်ခါထပ်ခါ ရေးမယ့်အစား — file တစ်လျှောက်လုံး သုံးဖို့ numeric identifiers တွေပါတဲ့ tables တွေ ဖန်တီးပါတယ်။
ဒီအလုပ်ကို [Tobias Koppers](https://github.com/sokra) က [သူတို့ရဲ့ pull request](https://github.com/microsoft/TypeScript/pull/43079) မှာ ဦးဆောင်ခဲ့ပြီး — [နောက်ဆက်တွဲ pull request](https://github.com/microsoft/TypeScript/pull/43155) နဲ့ [နောက်ထပ် optimizations](https://github.com/microsoft/TypeScript/pull/43695) တွေအတွက် စေ့ဆော်မှု ဖြစ်ခဲ့ပါတယ်။

`.tsbuildinfo` file အရွယ်အစားတွေမှာ သိသိသာသာ လျှော့ချနိုင်ခဲ့တာတွေ မြင်ခဲ့ရပါတယ် — ဥပမာ

- 1MB to 411 KB
- 14.9MB to 1MB
- 1345MB to 467MB

ပြောစရာမလိုအောင် — ဒီလို အရွယ်အစား သက်သာမှုတွေက build times တွေကိုပါ နည်းနည်း မြန်စေပါတယ်။

## Lazier Calculations in `--incremental` and `--watch` Compilations (`--incremental` နှင့် `--watch` Compilations များတွင် ပိုမို နှောင့်နှေးသော တွက်ချက်မှုများ)

[`incremental`](https://www.typescriptlang.org/tsconfig#incremental) နဲ့ `--watch` modes တွေရဲ့ ပြဿနာတစ်ခုက — သူတို့က နောက်ပိုင်း compilations တွေကို မြန်အောင် လုပ်ပေးပေမယ့် — ကနဦး compilation ကတော့ နည်းနည်း နှေးနိုင်တာပါ — တချို့ကိစ္စတွေမှာ သိသိသာသာ နှေးပါတယ်။
ဒါက ဒီ modes တွေက လက်ရှိ project အကြောင်း အချက်အလက်တွေကို တွက်ချက်ပြီး — စာရင်းအင်း (book-keeping) တွေ အများကြီး လုပ်ရလို့ပါ — တစ်ခါတလေ အဲဒီအချက်အလက်တွေကို နောက်ပိုင်း builds တွေအတွက် `.tsbuildinfo` file တစ်ခုထဲမှာ သိမ်းပါတယ်။

ဒါကြောင့်ပဲ `.tsbuildinfo` အရွယ်အစား တိုးတက်မှုတွေအပြင် — TypeScript 4.3 က [`incremental`](https://www.typescriptlang.org/tsconfig#incremental) နဲ့ `--watch` modes တွေဆီ ပြောင်းလဲမှုတချို့ကိုပါ ထည့်ပေးပို့ပေးပါတယ် — ဒါတွေက ဒီ flags တွေနဲ့ project တစ်ခုရဲ့ ပထမဆုံး build ကို သာမန် build တစ်ခုလိုပဲ မြန်မြန် ဖြစ်စေပါတယ်!
ဒါကို လုပ်ဖို့ — သာမန်အားဖြင့် ကြိုတင် တွက်ချက်ထားမယ့် အချက်အလက် အများစုကို — နောက်ပိုင်း builds တွေအတွက် လိုအပ်ချက်အလိုက် (on-demand) လုပ်ဆောင်တဲ့ပုံစံအစား ပြောင်းလိုက်ပါတယ်။
ဒါက နောက်ဆက်တွဲ build တစ်ခုဆီ overhead နည်းနည်း ထပ်ဖြည့်နိုင်ပေမယ့် — TypeScript ရဲ့ [`incremental`](https://www.typescriptlang.org/tsconfig#incremental) နဲ့ `--watch` လုပ်ဆောင်ချက်တွေက ပုံမှန်အားဖြင့် သေးငယ်တဲ့ files အစုတစ်ခုပေါ်မှာပဲ အလုပ်လုပ်ပြီး — လိုအပ်တဲ့ အချက်အလက်တွေကို နောက်ပိုင်းမှာ သိမ်းဆည်းပေးပါလိမ့်မယ်။
တစ်နည်းပြောရရင် — [`incremental`](https://www.typescriptlang.org/tsconfig#incremental) နဲ့ `--watch` builds တွေက files တွေကို ခဏခဏ အပ်ဒိတ် လုပ်ပြီးတာနဲ့ — "warm up" ဖြစ်ပြီး — compile လုပ်ရတာ ပိုမြန်လာပါလိမ့်မယ်။

Files ပေါင်း 3000 ရှိတဲ့ repository တစ်ခုမှာ — **ဒါက ကနဦး build times တွေကို သုံးပုံတစ်ပုံနီးပါးအထိ လျှော့ချပေးခဲ့ပါတယ်**!

[ဒီအလုပ်ကို](https://github.com/microsoft/TypeScript/pull/42960) [Tobias Koppers](https://github.com/sokra) က စတင်ခဲ့ပြီး — သူ့ရဲ့ အလုပ်က ဒီလုပ်ဆောင်ချက်အတွက် [နောက်ဆုံး ပြောင်းလဲမှု](https://github.com/microsoft/TypeScript/pull/43314) ထဲအထိ ဆက်ဖြစ်ခဲ့ပါတယ်။
ဒီလို တိုးတက်မှု အခွင့်အလမ်းတွေ ရှာဖွေပေးတဲ့အတွက် Tobias ကို ကျေးဇူးအထူး တင်ပါတယ်!

## Import Statement Completions (Import Statement ဖြည့်စွက်မှုများ)

JavaScript မှာ import နဲ့ export statements တွေနဲ့ ပတ်သက်ပြီး သုံးစွဲသူတွေ ကြုံရတဲ့ အကြီးမားဆုံး နာကျင်စရာ အချက်တွေထဲက တစ်ခုက order (အစီအစဉ်) ပါ — အထူးသဖြင့် imports တွေကို

```ts
import { func } from "./module.js";
```

ဆိုတဲ့ပုံစံနဲ့ ရေးရတာပါ — အစား

```ts
from "./module.js" import { func };
```

ဆိုတဲ့ပုံစံ မဟုတ်ဘူးပေါ့။

ဒါက — import statement တစ်ခုလုံးကို အစအဆုံး ရေးတဲ့အခါ — auto-complete က မှန်ကန်စွာ အလုပ်မလုပ်နိုင်လို့ — နာကျင်စရာ ဖြစ်စေပါတယ်။
ဥပမာ — `import {` လိုမျိုး စရေးလိုက်ရင် — TypeScript က ဘယ် module ကနေ import လုပ်ဖို့ စီစဉ်ထားလဲဆိုတာ ဘာမှ မသိလို့ — ကျဉ်းမြောင်းထားတဲ့ (scoped-down) completions တွေ ပေးနိုင်မှာ မဟုတ်ပါဘူး။

ဒါကို သက်သာစေဖို့ — auto-imports တွေရဲ့ စွမ်းအားကို ကျွန်တော်တို့ အသုံးချထားပါတယ်!
Auto-imports တွေက — module တစ်ခုအတွင်းက completions တွေကို ကျဉ်းမြောင်းလို့ မရတဲ့ ပြဿနာကို ကတည်းက ကိုင်တွယ်ထားပါတယ် — သူတို့ရဲ့ တစ်ခုလုံး ရည်ရွယ်ချက်က — ဖြစ်နိုင်တဲ့ export တိုင်းကို ပံ့ပိုးပေးပြီး — သင့် file ရဲ့ ထိပ်မှာ import statement တစ်ခုကို အလိုအလျောက် ထည့်သွင်းဖို့ပါ။

ဒါကြောင့် — path တစ်ခု မပါတဲ့ `import` statement တစ်ခုကို အခု စရေးတဲ့အခါ — ဖြစ်နိုင်တဲ့ imports တွေရဲ့ စာရင်းတစ်ခုကို ကျွန်တော်တို့ ပံ့ပိုးပေးပါလိမ့်မယ်။
Completion တစ်ခုကို အတည်ပြုလိုက်တဲ့အခါ — သင် ရေးဖို့ စီစဉ်နေတဲ့ path အပါအဝင် — import statement အပြည့်အစုံကို ဖြည့်စွက်ပေးပါလိမ့်မယ်။

![Import statement ဖြည့်စွက်မှုများ](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/05/auto-import-statement-4-3.gif)

ဒီအလုပ်က feature ကို အထူး ထောက်ပံ့တဲ့ editors တွေ လိုအပ်ပါတယ်။
အသစ်ဆုံး [Insiders versions of Visual Studio Code](https://code.visualstudio.com/insiders/) တွေကို သုံးခြင်းအားဖြင့် ဒါကို စမ်းကြည့်နိုင်ပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် — [အကောင်အထည်ဖော်တဲ့ pull request](https://github.com/microsoft/TypeScript/pull/43149) ကို ကြည့်လိုက်ပါ!

## Editor Support for `@link` Tags (`@link` Tags များအတွက် Editor ပံ့ပိုးမှု)

TypeScript က အခု `@link` tags တွေကို နားလည်နိုင်ပြီး — သူတို့ ချိတ်ဆက်ထားတဲ့ (link to) declarations တွေကို ရှာဖွေဖြေရှင်းဖို့ ကြိုးစားပါလိမ့်မယ်။
ဒါရဲ့ အဓိပ္ပါယ်က — `@link` tags တွေထဲက နာမည်တွေပေါ်မှာ hover လုပ်ပြီး quick information ရနိုင်မယ်၊ ဒါမှမဟုတ် go-to-definition ဒါမှမဟုတ် find-all-references လို commands တွေကို သုံးနိုင်မယ်ဆိုတာပါ။

ဥပမာ — အောက်က ဥပမာထဲက `@link plantCarrot` ထဲက `plantCarrot` ပေါ်မှာ go-to-definition လုပ်နိုင်ပြီး — TypeScript ကို ထောက်ပံ့တဲ့ editor တစ်ခုက `plantCarrot` ရဲ့ function declaration ဆီ ခုန်သွားပါလိမ့်မယ်။

```ts
/**
 * To be called 70 to 80 days after {@link plantCarrot}.
 */
function harvestCarrot(carrot: Carrot) {}

/**
 * Call early in spring for best results. Added in v2.1.0.
 * @param seed Make sure it's a carrot seed!
 */
function plantCarrot(seed: Seed) {
  // TODO: some gardening
}
```

![`@link` tag ပေါ်တွင် definition ဆီ ခုန်ခြင်းနှင့် quick info တောင်းခံခြင်း](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/05/link-tag-4-3.gif)

နောက်ထပ် အချက်အလက်တွေအတွက် — [GitHub ပေါ်က pull request](https://github.com/microsoft/TypeScript/pull/41877) ကို ကြည့်ပါ!

## Go-to-Definition on Non-JavaScript File Paths (JavaScript မဟုတ်သော File Paths များပေါ်တွင် Go-to-Definition)

Loader အများစုက သုံးစွဲသူတွေကို JavaScript imports တွေကို သုံးပြီး — သူတို့ရဲ့ applications တွေထဲ assets တွေ ထည့်သွင်းခွင့် ပြုပါတယ်။
သူတို့ကို ပုံမှန်အားဖြင့် `import "./styles.css"` လိုမျိုး ရေးလေ့ ရှိပါတယ်။

အခုထိတော့ — TypeScript ရဲ့ editor လုပ်ဆောင်ချက်က ဒီ file ကို ဖတ်ဖို့တောင် ကြိုးစားမှာ မဟုတ်လို့ — go-to-definition က ပုံမှန်အားဖြင့် မအောင်မြင်ပါဘူး။
အကောင်းဆုံး အခြေအနေမှာတောင် — go-to-definition က အဲဒီလိုမျိုး တစ်ခုခု ရှာတွေ့နိုင်ရင် — `declare module "*.css"` လို declaration တစ်ခုဆီ ခုန်သွားပါလိမ့်မယ်။

TypeScript ရဲ့ language service က အခု — relative file paths တွေပေါ်မှာ go-to-definition လုပ်ဆောင်တဲ့အခါ — အဲဒါတွေက JavaScript ဒါမှမဟုတ် TypeScript files တွေ မဟုတ်ရင်တောင် — မှန်ကန်တဲ့ file ဆီ ခုန်ဖို့ ကြိုးစားပါလိမ့်မယ်!
CSS, SVGs, PNGs, font files, Vue files နဲ့ အခြားအရာတွေဆီ imports တွေနဲ့ စမ်းကြည့်ပါ။

နောက်ထပ် အချက်အလက်တွေအတွက် — [အကောင်အထည်ဖော်တဲ့ pull request](https://github.com/microsoft/TypeScript/pull/42539) ကို ကြည့်နိုင်ပါတယ်။

## Breaking Changes (နောက်ပြန်လိုက်ဖက်မှုကို ပျက်စေနိုင်သော အပြောင်းအလဲများ)

### `lib.d.ts` Changes (`lib.d.ts` ပြောင်းလဲမှုများ)

TypeScript ဗားရှင်းတိုင်းလိုပဲ — `lib.d.ts` အတွက် declarations တွေ (အထူးသဖြင့် web contexts တွေအတွက် ထုတ်ပေးတဲ့ declarations တွေ) ပြောင်းလဲသွားပါတယ်။
ဒီ release မှာ — ဘယ် browser မှ မအကောင်အထည်ဖော်တဲ့ APIs တွေကို ဖယ်ရှားဖို့ — ကျွန်တော်တို့ [Mozilla's browser-compat-data](https://github.com/mdn/browser-compat-data) ကို အသုံးချခဲ့ပါတယ်။
`Account`, `AssertionOptions`, `RTCStatsEventInit`, `MSGestureEvent`, `DeviceLightEvent`, `MSPointerEvent`, `ServiceWorkerMessageEvent` နဲ့ `WebAuthentication` လို APIs တွေကို သင်သုံးနေဖို့ မဖြစ်နိုင်ပေမယ့် — ဒါတွေ အားလုံးကို `lib.d.ts` ကနေ ဖယ်ရှားလိုက်ပါပြီ။
ဒါကို [ဒီမှာ အသေးစိတ် ဆွေးနွေးထားပါတယ်](https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/991).

https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/991

### `useDefineForClassFields` now defaults to true on `esnext` and eventually on `es2022` (`useDefineForClassFields` သည် `esnext` တွင် true အဖြစ် ပုံမှန် သတ်မှတ်လာပြီး နောက်ဆုံးတွင် `es2022` တွင်ပါ သက်ရောက်ခြင်း)

2021 ခုနှစ်မှာ class fields feature ကို JavaScript specification ထဲ — TypeScript က အကောင်အထည်ဖော်ခဲ့တဲ့ပုံစံနဲ့ ကွဲပြားတဲ့ အပြုအမူတစ်ခုနဲ့ ထည့်သွင်းခဲ့ပါတယ်။
ဒါအတွက် ကြိုတင်ပြင်ဆင်မှုအနေနဲ့ — TypeScript 3.7 မှာ — emit လုပ်လိုက်တဲ့ JavaScript ကို JavaScript standard ရဲ့ အပြုအမူနဲ့ ကိုက်ညီအောင် ပြောင်းရွှေ့ဖို့ — flag တစ်ခု ([`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)) ထည့်ပေးခဲ့ပါတယ်။

အခု အဲဒီ feature က JavaScript ထဲမှာ ရှိနေပြီဖြစ်လို့ — ES2022 နဲ့ အထက် (ESNext အပါအဝင်) တွေအတွက် default ကို `true` အဖြစ် ပြောင်းလဲနေပါတယ်။

### Errors on Always-Truthy Promise Checks (အမြဲ Truthy ဖြစ်နေသော Promise Checks များပေါ်က Errors)

[`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) အောက်မှာ — condition check တစ်ခုထဲမှာ အမြဲတမ်း defined ဖြစ်နေပုံရတဲ့ `Promise` တစ်ခုကို သုံးတာက အခု error တစ်ခုအဖြစ် သတ်မှတ်ပါတယ်။

```ts
declare var p: Promise<number>;

if (p) {
  //  ~
  // Error!
  // This condition will always return true since
  // this 'Promise<number>' appears to always be defined.
  //
  // Did you forget to use 'await'?
}
```

အသေးစိတ်အတွက် — [မူလ ပြောင်းလဲမှုကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/39175).

### Union Enums Cannot Be Compared to Arbitrary Numbers (Union Enums များကို Arbitrary Numbers များနှင့် နှိုင်းယှဉ်၍ မရခြင်း)

`enum` တချို့ကို — သူတို့ရဲ့ members တွေက အလိုအလျောက် ဖြည့်သွင်းခြင်း ခံရတဲ့အခါ ဒါမှမဟုတ် အသေးအဖွဲ ရေးသားထားတဲ့အခါ — _union `enum`s_ အဖြစ် သတ်မှတ်ပါတယ်။
ဒီလိုကိစ္စတွေမှာ — enum တစ်ခုက သူ ကိုယ်စားပြုနိုင်တဲ့ value တစ်ခုချင်းစီကို ပြန်မှတ်မိနိုင်ပါတယ်။

TypeScript 4.3 မှာ — union `enum` type တစ်ခုပါတဲ့ value တစ်ခုကို — သူနဲ့ ဘယ်တော့မှ မတူနိုင်တဲ့ numeric literal တစ်ခုနဲ့ နှိုင်းယှဉ်ရင် — type-checker က error တစ်ခု ထုတ်ပေးပါလိမ့်မယ်။

```ts
enum E {
  A = 0,
  B = 1,
}

function doSomething(x: E) {
  // Error! This condition will always return 'false' since the types 'E' and '-1' have no overlap.
  if (x === -1) {
    // ...
  }
}
```

အလုပ်ဖြေရှင်းနည်း (workaround) အနေနဲ့ — annotation တစ်ခုကို သင့်တော်တဲ့ literal type ပါအောင် ပြန်ရေးနိုင်ပါတယ်။

```ts
enum E {
  A = 0,
  B = 1,
}

// Include -1 in the type, if we're really certain that -1 can come through.
function doSomething(x: E | -1) {
  if (x === -1) {
    // ...
  }
}
```

Value ပေါ်မှာ type-assertion တစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။

```ts
enum E {
  A = 0,
  B = 1,
}

function doSomething(x: E) {
  // Use a type assertion on 'x' because we know we're not actually just dealing with values from 'E'.
  if ((x as number) === -1) {
    // ...
  }
}
```

တစ်နည်းအားဖြင့် — ဘယ် number မဆို အဲဒီ enum ဆီ assignable ရော နှိုင်းယှဉ်လို့ရပါစေဖို့ — သင့် enum ကို non-trivial initializer တစ်ခုနဲ့ ပြန်ကြေညာနိုင်ပါတယ်။ ဒါက — enum က လူသိများတဲ့ values အနည်းငယ်ကို သတ်မှတ်ဖို့သာ ရည်ရွယ်တယ်ဆိုရင် အသုံးဝင်နိုင်ပါတယ်။

```ts
enum E {
  // the leading + on 0 opts TypeScript out of inferring a union enum.
  A = +0,
  B = 1,
}
```

အသေးစိတ်အတွက် — [မူလ ပြောင်းလဲမှုကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/42472)
