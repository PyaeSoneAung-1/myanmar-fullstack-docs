---
title: "TypeScript 5.3 (TypeScript 5.3 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 5.3 ရဲ့ အဓိကပြောင်းလဲမှုတွေ — import attributes, `resolution-mode` ပံ့ပိုးမှု, `switch (true)` narrowing, boolean နှိုင်းယှဉ်မှုနှင့် `Symbol.hasInstance` narrowing များ, `super` property access စစ်ဆေးမှုများ, editor feature များ, performance optimizations, package size လျှော့ချမှုနဲ့ breaking changes အကြောင်း"
order: 93
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-3.html"
status: translated
updated: 2026-09-05
---

## Import Attributes (Import Attribute များ)

TypeScript 5.3 က [import attributes](https://github.com/tc39/proposal-import-attributes) proposal ရဲ့ နောက်ဆုံး အပ်ဒိတ်တွေကို ပံ့ပိုးပါတယ်။

import attributes တွေရဲ့ use-case တစ်ခုက — module တစ်ခုရဲ့ မျှော်လင့်ထားတဲ့ format အကြောင်း အချက်အလက်တွေကို runtime ဆီ ပေးဖို့ပါ။

```ts
// We only want this to be interpreted as JSON,
// not a runnable/malicious JavaScript file with a `.json` extension.
import obj from "./something.json" with { type: "json" };
```

ဒီ attributes တွေရဲ့ အကြောင်းအရာတွေက host-သီးသန့် ဖြစ်တာမို့ TypeScript က စစ်ဆေးမပေးပါဘူး — ရိုးရိုးရှင်းရှင်းပဲ ထားခဲ့လိုက်တာမို့ — browser တွေနဲ့ runtime တွေက သူတို့ကို ကိုင်တွယ်နိုင်ပါတယ် (error လည်း ဖြစ်နိုင်ပါတယ်)။

```ts
// TypeScript is fine with this.
// But your browser? Probably not.
import * as foo from "./foo.js" with { type: "fluffy bunny" };
```

Dynamic `import()` call တွေကလည်း — second argument တစ်ခုကတစ်ဆင့် — import attributes တွေကို သုံးနိုင်ပါတယ်။

```ts
const obj = await import("./something.json", {
    with: { type: "json" }
});
```

အဲဒီ second argument ရဲ့ မျှော်လင့်ထားတဲ့ type ကို `ImportCallOptions` လို့ခေါ်တဲ့ type တစ်ခုက သတ်မှတ်ပေးပြီး — default အနေနဲ့ `with` လို့ခေါ်တဲ့ property တစ်ခုကိုပဲ မျှော်လင့်ပါတယ်။

import attributes တွေက ["import assertions" လို့ခေါ်ပြီး TypeScript 4.5 မှာ အကောင်အထည်ဖော်ခဲ့တဲ့](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#import-assertions) အစောပိုင်း proposal တစ်ခုရဲ့ ဆင့်ကဲပြောင်းလဲမှု တစ်ခုဆိုတာ သတိပြုပါ။
အထင်ရှားဆုံး ကွာခြားချက်က — `assert` keyword အစား `with` keyword ကို သုံးတာပါ။
ဒါပေမယ့် — သိပ်မမြင်ရတဲ့ ကွာခြားချက်ကတော့ — runtime တွေက import path တွေရဲ့ resolution နဲ့ interpretation တွေကို လမ်းညွှန်ဖို့ attributes တွေကို အခုဆို လွတ်လပ်စွာ သုံးနိုင်ပြီး — import assertions တွေကတော့ module တစ်ခု load လုပ်ပြီးမှ လက္ခဏာတစ်ချို့ကိုပဲ assert လုပ်နိုင်ခဲ့တာပါ။

အချိန်ကြာလာတာနဲ့အမျှ — TypeScript က import assertions တွေရဲ့ syntax အဟောင်းကို — import attributes တွေရဲ့ အဆိုပြုထားတဲ့ syntax ကို မျက်နှာသာပေးပြီး — deprecate လုပ်သွားမှာပါ။
`assert` သုံးထားတဲ့ ရှိပြီးသား code တွေက `with` keyword ဆီ ရွှေ့ပြောင်းသင့်ပါတယ်။
import attribute တစ်ခု လိုအပ်တဲ့ code အသစ်တွေက `with` ကိုပဲ သီးသန့် သုံးသင့်ပါတယ်။

[ဒီ proposal ကို အကောင်အထည်ဖော်ပေးခဲ့တဲ့](https://github.com/microsoft/TypeScript/pull/54242) [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ကို ကျေးဇူးတင်ပါတယ်!
ပြီးတော့ — [import assertions](https://github.com/microsoft/TypeScript/pull/40698) တွေရဲ့ အကောင်အထည်ဖော်မှုအတွက် [Wenlu Wang](https://github.com/Kingwl) ကိုလည်း အသိအမှတ်ပြု ပြောကြားချင်ပါတယ်!

## Stable Support `resolution-mode` in Import Types (Import Type များတွင် `resolution-mode` ကို တည်ငြိမ်စွာ ပံ့ပိုးခြင်း)

TypeScript 4.7 မှာ — TypeScript က `/// <reference types="..." />` ထဲမှာ `resolution-mode` attribute တစ်ခုကို — specifier တစ်ခုကို `import` ဒါမှမဟုတ် `require` semantics တွေနဲ့ resolve လုပ်သင့်လားဆိုတာကို ထိန်းချုပ်ဖို့ — ပံ့ပိုးမှု ထပ်ဖြည့်ခဲ့ပါတယ်။

```ts
/// <reference types="pkg" resolution-mode="require" />

// or

/// <reference types="pkg" resolution-mode="import" />
```

type-only import တွေပေါ်က import assertions တွေထဲမှာလည်း သက်ဆိုင်ရာ field တစ်ခု ထည့်သွင်းခဲ့ပါတယ်;
ဒါပေမယ့် — TypeScript ရဲ့ nightly ဗားရှင်းတွေမှာပဲ ပံ့ပိုးခဲ့ပါတယ်။
ဆင်ခြင်ရတဲ့ အကြောင်းပြချက်က — စိတ်ဓာတ်အရ — import *assertions* တွေက module resolution ကို လမ်းညွှန်ဖို့ ရည်ရွယ်ထားတာ မဟုတ်လို့ပါ။
ဒါကြောင့် ဒီ feature ကို နောက်ထပ် တုံ့ပြန်ချက် ရဖို့ — nightly-only mode တစ်ခုမှာ experimental အနေနဲ့ တင်ပို့ခဲ့ပါတယ်။

ဒါပေမယ့် — *[import attributes](#import-attributes)* တွေက resolution ကို လမ်းညွှန်နိုင်တာ၊ ကျိုးကြောင်းဆီလျော်တဲ့ use-case တွေကို ကျွန်တော်တို့ မြင်ခဲ့ရတာမို့ — TypeScript 5.3 က `import type` အတွက် `resolution-mode` attribute ကို အခုဆို ပံ့ပိုးပါတယ်။

```ts
// Resolve `pkg` as if we were importing with a `require()`
import type { TypeFromRequire } from "pkg" with {
    "resolution-mode": "require"
};

// Resolve `pkg` as if we were importing with an `import`
import type { TypeFromImport } from "pkg" with {
    "resolution-mode": "import"
};

export interface MergedType extends TypeFromRequire, TypeFromImport {}
```

ဒီ import attributes တွေကို `import()` types တွေပေါ်မှာလည်း သုံးနိုင်ပါတယ်။

```ts
export type TypeFromRequire =
    import("pkg", { with: { "resolution-mode": "require" } }).TypeFromRequire;

export type TypeFromImport =
    import("pkg", { with: { "resolution-mode": "import" } }).TypeFromImport;

export interface MergedType extends TypeFromRequire, TypeFromImport {}
```

နောက်ထပ် အချက်အလက်အတွက် — [ဒီနေရာက ပြောင်းလဲမှုကို စစ်ဆေးကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/55725)

## `resolution-mode` Supported in All Module Modes (`resolution-mode` ကို Module Mode အားလုံးတွင် ပံ့ပိုးခြင်း)

အရင်က — `resolution-mode` သုံးတာကို `node16` နဲ့ `nodenext` ဆိုတဲ့ `moduleResolution` option တွေအောက်မှာပဲ ခွင့်ပြုခဲ့ပါတယ်။
module တွေကို type ရည်ရွယ်ချက်တွေအတွက် သီးသန့် ရှာဖွေဖို့ ပိုလွယ်ကူစေဖို့ — `resolution-mode` က `bundler`, `node10` လိုမျိုး တခြား `moduleResolution` option တွေအားလုံးမှာ အခုဆို သင့်လျော်စွာ အလုပ်လုပ်ပြီး — `classic` အောက်မှာတော့ error မဖြစ်တော့ပါဘူး။

နောက်ထပ် အချက်အလက်အတွက် — [အကောင်အထည်ဖော်တဲ့ pull request ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/55725)။

## `switch (true)` Narrowing (`switch (true)` ဖြင့် Narrowing ပြုလုပ်ခြင်း)

TypeScript 5.3 က `switch (true)` တစ်ခုထဲက `case` clause တစ်ခုချင်းစီရဲ့ conditions တွေအပေါ် အခြေခံပြီး narrowing လုပ်ဆောင်နိုင်ပါပြီ။

```ts
function f(x: unknown) {
    switch (true) {
        case typeof x === "string":
            // 'x' is a 'string' here
            console.log(x.toUpperCase());
            // falls through...

        case Array.isArray(x):
            // 'x' is a 'string | any[]' here.
            console.log(x.length);
            // falls through...

        default:
          // 'x' is 'unknown' here.
          // ...
    }
}
```

ဒီ [feature](https://github.com/microsoft/TypeScript/pull/55991) ကို [Mateusz Burzyński](https://github.com/Andarist) ရဲ့ [ကနဦး အလုပ်](https://github.com/microsoft/TypeScript/pull/53681) ကနေ ဦးဆောင် အကောင်အထည်ဖော်ခဲ့ပါတယ်။
ဒီပံ့ပိုးမှုအတွက် "ကျေးဇူးတင်ပါတယ်!" လို့ ပြောကြားချင်ပါတယ်။

## Narrowing On Comparisons to Booleans (Booleans များနှင့် နှိုင်းယှဉ်မှုများအပေါ် Narrowing)

ရံဖန်ရံခါ — condition တစ်ခုထဲမှာ `true` ဒါမှမဟုတ် `false` နဲ့ တိုက်ရိုက် နှိုင်းယှဉ်မှု တစ်ခုကို လုပ်မိတာမျိုး သင်ကိုယ်တိုင် တွေ့နိုင်ပါတယ်။
ပုံမှန်အားဖြင့် ဒါတွေက မလိုအပ်တဲ့ နှိုင်းယှဉ်မှုတွေပါ — ဒါပေမယ့် style တစ်ခုအနေနဲ့ ဒါမှမဟုတ် JavaScript ရဲ့ truthiness နဲ့ ပတ်သက်တဲ့ ပြဿနာတစ်ချို့ကို ရှောင်ဖို့ — သင်က ဒါကို ပိုနှစ်သက်နိုင်ပါတယ်။
ဘာပဲဖြစ်ဖြစ် — အရင်က TypeScript က narrowing လုပ်ဆောင်တဲ့အခါ ဒီပုံစံမျိုးတွေကို မှတ်မိမှု မရှိခဲ့ပါဘူး။

TypeScript 5.3 က variable တွေကို narrowing လုပ်တဲ့အခါ ဒီ expression တွေကို အခုဆို လိုက်မီပြီး နားလည်ပါတယ်။

```ts
interface A {
    a: string;
}

interface B {
    b: string;
}

type MyType = A | B;

function isA(x: MyType): x is A {
    return "a" in x;
}

function someFn(x: MyType) {
    if (isA(x) === true) {
        console.log(x.a); // works!
    }
}
```

ဒါကို အကောင်အထည်ဖော်ပေးခဲ့တဲ့ [pull request](https://github.com/microsoft/TypeScript/pull/53681) အတွက် [Mateusz Burzyński](https://github.com/Andarist) ကို ကျေးဇူးတင်ပါတယ်။

## `instanceof` Narrowing Through `Symbol.hasInstance` (`Symbol.hasInstance` မှတစ်ဆင့် `instanceof` Narrowing)

JavaScript ရဲ့ နည်းနည်း ထူးဆန်းတဲ့ feature တစ်ခုက — `instanceof` operator ရဲ့ အပြုအမူကို override လုပ်ဖို့ ဖြစ်နိုင်တာပါ။
ဒါလုပ်ဖို့ — `instanceof` operator ရဲ့ ညာဘက်ခြမ်းက value မှာ `Symbol.hasInstance` လို့ အမည်ပေးထားတဲ့ တိကျတဲ့ method တစ်ခု ရှိဖို့ လိုအပ်ပါတယ်။

```js
class Weirdo {
    static [Symbol.hasInstance](testedValue) {
        // wait, what?
        return testedValue === undefined;
    }
}

// false
console.log(new Thing() instanceof Weirdo);

// true
console.log(undefined instanceof Weirdo);
```

ဒီအပြုအမူကို `instanceof` ထဲမှာ ပိုကောင်းအောင် ပုံစံထုတ်ဖို့ — TypeScript က အခုဆို ဒီလို `[Symbol.hasInstance]` method တစ်ခု ရှိမရှိ၊ type predicate function တစ်ခုအနေနဲ့ ကြေညာထားလားဆိုတာကို စစ်ဆေးပါတယ်။
ရှိတယ်ဆိုရင် — `instanceof` operator ရဲ့ ဘယ်ဘက်ခြမ်းက စမ်းသပ်ခံရတဲ့ value ကို အဲဒီ type predicate အတိုင်း သင့်လျော်စွာ narrow လုပ်ပါလိမ့်မယ်။

```ts
interface PointLike {
    x: number;
    y: number;
}

class Point implements PointLike {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distanceFromOrigin() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    static [Symbol.hasInstance](val: unknown): val is PointLike {
        return !!val && typeof val === "object" &&
            "x" in val && "y" in val &&
            typeof val.x === "number" &&
            typeof val.y === "number";
    }
}

function f(value: unknown) {
    if (value instanceof Point) {
        // Can access both of these - correct!
        value.x;
        value.y;

        // Can't access this - we have a 'PointLike',
        // but we don't *actually* have a 'Point'.
        value.distanceFromOrigin();
    }
}
```

ဒီဥပမာမှာ မြင်ရတဲ့အတိုင်း — `Point` က သူ့ရဲ့ ကိုယ်ပိုင် `[Symbol.hasInstance]` method ကို သတ်မှတ်ပါတယ်။
ဒါက တကယ်တော့ `PointLike` လို့ခေါ်တဲ့ သီးခြား type တစ်ခုအပေါ် custom type guard တစ်ခုအနေနဲ့ ပြုမူပါတယ်။
`f` function ထဲမှာ — `value` ကို `instanceof` နဲ့ `PointLike` အဖြစ်အထိ narrow လုပ်နိုင်ခဲ့ပေမယ့် — `Point` အဖြစ်တော့ *မဟုတ်ပါဘူး*။
ဒါကြောင့် `x` နဲ့ `y` property တွေကို ဝင်ရောက်ကြည့်ရှုနိုင်ပေမယ့် — `distanceFromOrigin` method ကိုတော့ မရပါဘူး။

နောက်ထပ် အချက်အလက်အတွက် — [ဒီနေရာက ပြောင်းလဲမှုအကြောင်း ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/55052)။

## Checks for `super` Property Accesses on Instance Fields (Instance Field များပေါ်ရှိ `super` Property Access များအတွက် စစ်ဆေးမှုများ)

JavaScript မှာ — base class တစ်ခုထဲက declaration တစ်ခုကို `super` keyword ကတစ်ဆင့် ဝင်ရောက်ကြည့်ရှုနိုင်ပါတယ်။

```js
class Base {
    someMethod() {
        console.log("Base method called!");
    }
}

class Derived extends Base {
    someMethod() {
        console.log("Derived method called!");
        super.someMethod();
    }
}

new Derived().someMethod();
// Prints:
//   Derived method called!
//   Base method called!
```

ဒါက `this.someMethod()` လိုမျိုး ရေးတာနဲ့ မတူပါဘူး — အကြောင်းကတော့ အဲဒါက override လုပ်ထားတဲ့ method တစ်ခုကို ခေါ်မိနိုင်လို့ပါ။
ဒါက သိမ်မွေ့တဲ့ ခြားနားချက်တစ်ခုဖြစ်ပြီး — declaration တစ်ခုကို ဘယ်တော့မှ override မလုပ်ဘူးဆိုရင် ဒီနှစ်ခုက မကြာခဏ အပြန်အလှန် အစားထိုးလို့ရတာမို့ — ပိုပြီး သိမ်မွေ့လာပါတယ်။

```js
class Base {
    someMethod() {
        console.log("someMethod called!");
    }
}

class Derived extends Base {
    someOtherMethod() {
        // These act identically.
        this.someMethod();
        super.someMethod();
    }
}

new Derived().someOtherMethod();
// Prints:
//   someMethod called!
//   someMethod called!
```

ပြဿနာက — သူတို့ကို အပြန်အလှန် အစားထိုး သုံးတာက — `super` က prototype ပေါ်မှာ ကြေညာထားတဲ့ member တွေပေါ်မှာပဲ အလုပ်လုပ်တာမို့ပါ — *instance property တွေပေါ်မှာ မဟုတ်ပါဘူး*။
ဒါကြောင့် — `super.someMethod()` လို့ ရေးလိုက်ပေမယ့် — `someMethod` ကို field တစ်ခုအနေနဲ့ သတ်မှတ်ထားရင် — runtime error တစ်ခု ရပါလိမ့်မယ်!

```ts
class Base {
    someMethod = () => {
        console.log("someMethod called!");
    }
}

class Derived extends Base {
    someOtherMethod() {
        super.someMethod();
    }
}

new Derived().someOtherMethod();
// 💥
// Doesn't work because 'super.someMethod' is 'undefined'.
```

TypeScript 5.3 က `super` property access/method call တွေက class fields တွေနဲ့ ကိုက်ညီမှု ရှိမရှိ — အခုဆို ပိုနီးကပ်စွာ စစ်ဆေးပါတယ်။
ရှိတယ်ဆိုရင် — type-checking error တစ်ခု အခုဆို ရပါလိမ့်မယ်။

[ဒီစစ်ဆေးမှု](https://github.com/microsoft/TypeScript/pull/54056) ကို [Jack Works](https://github.com/Jack-Works) ရဲ့ ကျေးဇူးကြောင့် ပံ့ပိုးနိုင်ခဲ့ပါတယ်!

## Interactive Inlay Hints for Types (Type များအတွက် Interactive Inlay Hint များ)

TypeScript ရဲ့ inlay hints တွေက types တွေရဲ့ definition တွေဆီ ခုန်ကူးတာကို အခုဆို ပံ့ပိုးပါတယ်!
ဒါက သင့် code ကို ပေါ့ပါးစွာ သွားလာကြည့်ရှုတာကို ပိုလွယ်ကူစေပါတယ်။

![parameter type တစ်ခုရဲ့ definition ဆီ ခုန်ကူးဖို့ inlay hint တစ်ခုကို Ctrl-click လုပ်နေပုံ။](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/10/clickable-inlay-hints-for-types-5-3-beta.gif)

နောက်ထပ်ကို [ဒီနေရာက အကောင်အထည်ဖော်မှုမှာ ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/55141)။

## Settings to Prefer `type` Auto-Imports (`type` Auto-Import များကို ဦးစားပေးရန် Setting များ)

အရင်က — TypeScript က type position တစ်ခုထဲက တစ်ခုခုအတွက် auto-import တွေ ထုတ်ပေးတဲ့အခါ — သင့် setting တွေပေါ် အခြေခံပြီး `type` modifier တစ်ခု ထည့်ပေးပါတယ်။
ဥပမာ — အောက်ပါထဲက `Person` ပေါ်မှာ auto-import တစ်ခု ရတဲ့အခါ:

```ts
export let p: Person
```

TypeScript ရဲ့ editing experience က ပုံမှန်အားဖြင့် `Person` အတွက် import တစ်ခုကို ဒီလိုမျိုး ထည့်ပေးပါလိမ့်မယ်:

```ts
import { Person } from "./types";

export let p: Person
```

ပြီးတော့ `verbatimModuleSyntax` လိုမျိုး setting တစ်ချို့အောက်မှာ — `type` modifier ကို ထည့်ပေးပါလိမ့်မယ်:

```ts
import { type Person } from "./types";

export let p: Person
```

ဒါပေမယ့် — သင့် codebase က ဒီ option တစ်ချို့ကို သုံးနိုင်စွမ်း မရှိနိုင်သလို; ဒါမှမဟုတ် ဖြစ်နိုင်ရင် explicit `type` imports တွေကို သင်က ပိုနှစ်သက်တာမျိုး ဖြစ်နိုင်ပါတယ်။

[မကြာသေးခင်က ပြောင်းလဲမှုတစ်ခုနဲ့အတူ](https://github.com/microsoft/TypeScript/pull/56090) — TypeScript က ဒါကို editor-သီးသန့် option တစ်ခု ဖြစ်အောင် လုပ်ပေးနိုင်ပါပြီ။
Visual Studio Code မှာ — UI ထဲက "TypeScript › Preferences: Prefer Type Only Auto Imports" အောက်မှာ ဒါကို enable လုပ်နိုင်သလို — `typescript.preferences.preferTypeOnlyAutoImports` ဆိုတဲ့ JSON configuration option အဖြစ်လည်း သုံးနိုင်ပါတယ်

## Optimizations by Skipping JSDoc Parsing (JSDoc Parsing ကို ကျော်လိုက်ခြင်းဖြင့် Optimization များ)

`tsc` ကတစ်ဆင့် TypeScript ကို run တဲ့အခါ — compiler က JSDoc ကို parse လုပ်တာကို အခုဆို ရှောင်ကြဉ်ပါလိမ့်မယ်။
ဒါက parse အချိန်ကို သူ့ဘာသာသူ လျှော့ချပေးရုံတင်မက — comment တွေကို သိမ်းဆည်းဖို့ သုံးတဲ့ memory သုံးစွဲမှုရော garbage collection မှာ ကုန်ဆုံးတဲ့ အချိန်ကိုပါ လျှော့ချပေးပါတယ်။
ခြုံပြောရရင် — compile နည်းနည်း ပိုမြန်တာနဲ့ `--watch` mode မှာ တုံ့ပြန်မှု ပိုမြန်တာကို သင်တွေ့ရပါလိမ့်မယ်။

[တိကျတဲ့ ပြောင်းလဲမှုတွေကို ဒီမှာ ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/52921)။

TypeScript ကို သုံးတဲ့ tool တိုင်းက JSDoc ကို သိမ်းဆည်းဖို့ မလိုတာမို့ (ဥပမာ — typescript-eslint နဲ့ Prettier) — ဒီ parsing strategy ကို API ရဲ့ အစိတ်အပိုင်းတစ်ခုအဖြစ် ထုတ်ပြထားပါတယ်။
ဒါက ဒီ tool တွေကို — TypeScript compiler ဆီ ကျွန်တော်တို့ ယူဆောင်လာခဲ့တဲ့ — memory နဲ့ speed တိုးတက်မှု အလားတူမျိုး ရနိုင်စေပါတယ်။
Comment parsing strategy အတွက် option အသစ်တွေကို `JSDocParsingMode` ထဲမှာ ဖော်ပြထားပါတယ်။
နောက်ထပ် အချက်အလက်ကို [ဒီ pull request](https://github.com/microsoft/TypeScript/pull/55739) ပေါ်မှာ ရနိုင်ပါတယ်။

## Optimizations by Comparing Non-Normalized Intersections (Non-Normalized Intersection များကို နှိုင်းယှဉ်ခြင်းဖြင့် Optimization များ)

TypeScript မှာ — unions နဲ့ intersections တွေက အမြဲတမ်း တိကျတဲ့ ပုံစံတစ်ခုကို လိုက်နာပြီး — intersections တွေက union types တွေ မပါဝင်နိုင်ပါဘူး။
ဒါကြောင့် `A & (B | C)` လိုမျိုး union တစ်ခုအပေါ်မှာ intersection တစ်ခု ဖန်တီးတဲ့အခါ — အဲဒီ intersection ကို `(A & B) | (A & C)` အဖြစ် normalize လုပ်ခံရပါတယ်။
ဒါပေမယ့် — တစ်ချို့ကိစ္စတွေမှာ type system က ပြသမှု ရည်ရွယ်ချက်တွေအတွက် မူရင်း ပုံစံကို ထိန်းသိမ်းထားပါတယ်။

ဖြစ်သွားတာက — မူရင်း ပုံစံကို type တွေကြားက နှိုင်းယှဉ်မှုတွေအတွက် လိမ္မာပါးနပ်တဲ့ fast-path တစ်ချို့မှာ သုံးလို့ရတာပါ။

ဥပမာ — `SomeType & (Type1 | Type2 | ... | Type99999NINE)` ရှိပြီး — အဲဒါက `SomeType` ဆီ assignable ဟုတ်မဟုတ် ကြည့်ချင်တယ်ဆိုပါစို့။
ကျွန်တော်တို့ရဲ့ source type က တကယ်တော့ intersection မဟုတ်ဘူးဆိုတာ သတိရပါ — ငါတို့မှာ `(SomeType & Type1) | (SomeType & Type2) | ... |(SomeType & Type99999NINE)` လိုမျိုး ကြည့်ရတဲ့ union တစ်ခု ရှိတာပါ။
union တစ်ခုက target type တစ်ခုဆီ assignable ဟုတ်မဟုတ် စစ်ဆေးတဲ့အခါ — union ရဲ့ *member တိုင်း* က target type ဆီ assignable ဖြစ်မဖြစ် စစ်ဆေးရပြီး — အဲဒါက အရမ်း နှေးကွေးနိုင်ပါတယ်။

TypeScript 5.3 မှာ — ကျွန်တော်တို့ သိမ်းထားနိုင်ခဲ့တဲ့ မူရင်း intersection ပုံစံကို ချောင်းကြည့်ပါတယ်။
type တွေကို နှိုင်းယှဉ်တဲ့အခါ — target က source intersection ရဲ့ constituent တစ်ခုခုထဲမှာ ရှိမရှိ အမြန် စစ်ဆေးတာတစ်ခု လုပ်ပါတယ်။

နောက်ထပ် အချက်အလက်အတွက် — [ဒီ pull request ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/55851)။

## Consolidation Between `tsserverlibrary.js` and `typescript.js` (`tsserverlibrary.js` နှင့် `typescript.js` ပေါင်းစည်းခြင်း)

TypeScript ကိုယ်တိုင်က library file နှစ်ခုကို တင်ပို့ပါတယ်: `tsserverlibrary.js` နဲ့ `typescript.js`။
`tsserverlibrary.js` မှာပဲ ရနိုင်တဲ့ API တစ်ချို့ ရှိပါတယ် (ဥပမာ — `ProjectService` API) — အဲဒါတွေက import လုပ်သူတစ်ချို့အတွက် အသုံးဝင်နိုင်ပါတယ်။
ဒါပေမယ့် — နှစ်ခုက ထပ်နေမှု အများကြီးရှိတဲ့ သီးခြား bundle တွေဖြစ်ပြီး — package ထဲမှာ code တွေ ထပ်နေစေပါတယ်။
ဒါ့အပြင် — auto-imports ဒါမှမဟုတ် ကျင့်သားရနေတဲ့ အလေ့အကျင့်တွေကြောင့် — တစ်ခုကို တစ်ခုထက် တသမတ်တည်း သုံးဖို့ စိန်ခေါ်မှု ရှိနိုင်ပါတယ်။
module နှစ်ခုလုံးကို မတော်တဆ load လုပ်မိတာက အလွန်လွယ်ကူပြီး — code က API ရဲ့ မတူညီတဲ့ instance တစ်ခုပေါ်မှာ ကောင်းကောင်း အလုပ်မလုပ်နိုင်ပါဘူး။
အလုပ်လုပ်တယ်ဆိုရင်တောင် — bundle ဒုတိယတစ်ခုကို load လုပ်တာက resource သုံးစွဲမှုကို တိုးစေပါတယ်။

ဒါကို ထည့်သွင်းစဉ်းစားပြီး — ကျွန်တော်တို့ နှစ်ခုကို ပေါင်းစည်းဖို့ ဆုံးဖြတ်ခဲ့ပါတယ်။
`typescript.js` ထဲမှာ `tsserverlibrary.js` မှာ အရင်က ပါဝင်ခဲ့တာတွေ အခုဆို ပါဝင်လာပြီး — `tsserverlibrary.js` က `typescript.js` ကို ရိုးရိုးရှင်းရှင်း re-export လုပ်ပါတယ်။
ဒီပေါင်းစည်းမှုရဲ့ မတိုင်ခင်/ပြီးနောက် နှိုင်းယှဉ်ကြည့်တဲ့အခါ — package size မှာ အောက်ပါ လျှော့ချမှုကို ကျွန်တော်တို့ မြင်ခဲ့ရပါတယ်:

|  | မပြောင်းမီ | ပြောင်းပြီး | ကွာခြားချက် | ကွာခြားချက် (ရာခိုင်နှုန်း) |
| - | - | - | - | - |
| Packed | 6.90 MiB | 5.48 MiB | -1.42 MiB | -20.61% |
| Unpacked | 38.74 MiB | 30.41 MiB | -8.33 MiB | -21.50% |

|  | မပြောင်းမီ | ပြောင်းပြီး | ကွာခြားချက် | ကွာခြားချက် (ရာခိုင်နှုန်း) |
| - | - | - | - | - |
| `lib/tsserverlibrary.d.ts` | 570.95 KiB | 865.00 B | -570.10 KiB | -99.85% |
| `lib/tsserverlibrary.js` | 8.57 MiB | 1012.00 B | -8.57 MiB | -99.99% |
| `lib/typescript.d.ts` | 396.27 KiB | 570.95 KiB | +174.68 KiB | +44.08% |
| `lib/typescript.js` | 7.95 MiB | 8.57 MiB | +637.53 KiB | +7.84% |

တစ်နည်းပြောရရင် — ဒါက package size ရဲ့ 20.5% ကျော် လျှော့ချမှုတစ်ခုပါ။

နောက်ထပ် အချက်အလက်အတွက် — [ဒီနေရာမှာ ပါဝင်ပတ်သက်တဲ့ အလုပ်ကို ကြည့်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/55273)။

## Breaking Changes and Correctness Improvements (Breaking Changes နှင့် Correctness တိုးတက်မှုများ)

### `lib.d.ts` Changes (`lib.d.ts` ပြောင်းလဲမှုများ)

DOM အတွက် ထုတ်ပေးတဲ့ type တွေက သင့် codebase အပေါ် သက်ရောက်မှု ရှိနိုင်ပါတယ်။
နောက်ထပ် အချက်အလက်အတွက် — [TypeScript 5.3 အတွက် DOM အပ်ဒိတ်တွေကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/55798)။

### Checks for `super` Accesses on Instance Properties (Instance Property များပေါ်ရှိ `super` Access များအတွက် စစ်ဆေးမှုများ)

TypeScript 5.3 က `super.` property access တစ်ခုက ရည်ညွှန်းတဲ့ declaration က class field တစ်ခု ဖြစ်နေရင် — အခုဆို detect လုပ်ပြီး error တစ်ခု ထုတ်ပေးပါတယ်။
ဒါက runtime မှာ ဖြစ်နိုင်တဲ့ error တွေကို ကာကွယ်ပေးပါတယ်။

[ဒီပြောင်းလဲမှုအကြောင်း ဒီမှာ ပိုကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/54056)။
