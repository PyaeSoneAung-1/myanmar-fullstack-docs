---
title: "TypeScript 5.4 (TypeScript 5.4 ထုတ်ပြန်မှုမှတ်စု)"
description: "TypeScript 5.4 ရဲ့ အဓိကပြောင်းလဲမှုတွေ — closures များတွင် narrowing ထိန်းသိမ်းခြင်း, `NoInfer` utility type, `Object.groupBy`/`Map.groupBy`, `--module preserve`, import attributes စစ်ဆေးခြင်း, quick fix အသစ်, 5.0 deprecation များ၏ နောက်ဆုံးအဆင့်နဲ့ notable behavioral changes အကြောင်း"
order: 94
source: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-4.html"
status: translated
updated: 2026-09-05
---

## Preserved Narrowing in Closures Following Last Assignments (နောက်ဆုံး Assignment များပြီးနောက် Closure များတွင် Narrowing ထိန်းသိမ်းခြင်း)

TypeScript က သင်လုပ်ဆောင်နိုင်တဲ့ စစ်ဆေးမှုတွေအပေါ် အခြေခံပြီး — variable တစ်ခုအတွက် ပိုတိကျတဲ့ type တစ်ခုကို ပုံမှန်အားဖြင့် တွက်ထုတ်နိုင်ပါတယ်။
ဒီလုပ်ငန်းစဉ်ကို narrowing လို့ ခေါ်ပါတယ်။

```ts
function uppercaseStrings(x: string | number) {
    if (typeof x === "string") {
        // TypeScript knows 'x' is a 'string' here.
        return x.toUpperCase();
    }
}
```

အဖြစ်များတဲ့ စိတ်ညစ်စရာ တစ်ခုက — ဒီ narrow လုပ်ထားတဲ့ type တွေက function closure တွေထဲမှာ အမြဲတမ်း ထိန်းသိမ်းမထားခဲ့တာပါ။

```ts
function getUrls(url: string | URL, names: string[]) {
    if (typeof url === "string") {
        url = new URL(url);
    }

    return names.map(name => {
        url.searchParams.set("name", name)
        //  ~~~~~~~~~~~~
        // error!
        // Property 'searchParams' does not exist on type 'string | URL'.

        return url.toString();
    });
}
```

ဒီမှာ — `url` က တခြားနေရာတွေမှာ mutate လုပ်ခံထားရလို့ — ကျွန်တော်တို့ရဲ့ callback function ထဲမှာ `url` က *တကယ်တော့* `URL` object တစ်ခုလို့ ယူဆတာက "လုံခြုံ" မှု မရှိဘူးလို့ TypeScript က ဆုံးဖြတ်ခဲ့ပါတယ်;
ဒါပေမယ့် — ဒီဥပမာမှာ — အဲဒီ arrow function က `url` ဆီ အဲဒီ assignment လုပ်ပြီးတဲ့နောက်မှာ *အမြဲတမ်း* ဖန်တီးခံရပြီး — `url` ဆီ လုပ်တဲ့ *နောက်ဆုံး* assignment လည်း ဖြစ်ပါတယ်။

TypeScript 5.4 က narrowing ကို နည်းနည်း ပိုလိမ္မာစေဖို့ ဒါကို အခွင့်ကောင်းယူပါတယ်။
Parameter တွေနဲ့ `let` variable တွေကို [hoisted](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting) မဟုတ်တဲ့ function တွေထဲမှာ သုံးထားတဲ့အခါ — type-checker က နောက်ဆုံး assignment point တစ်ခုကို ရှာဖွေပါလိမ့်မယ်။
တစ်ခုကို တွေ့ရင် — TypeScript က ပါဝင်တဲ့ function ရဲ့ အပြင်ဘက်ကနေ လုံခြုံစွာ narrow လုပ်နိုင်ပါတယ်။
ဒါက ဘာကို ဆိုလိုလဲဆိုရင် — အပေါ်က ဥပမာက အခုဆို ရိုးရိုးရှင်းရှင်း အလုပ်လုပ်သွားတာပါ။

variable တစ်ခုကို nested function တစ်ခုထဲမှာ ဘယ်နေရာမှာမဆို assign လုပ်ထားရင် narrowing analysis က ဝင်မလုပ်ဘူးဆိုတာ သတိပြုပါ။
ဒါက — အဲဒီ function ကို နောက်ပိုင်းမှာ ခေါ်ခံရမှာ ဟုတ်မဟုတ်ဆိုတာကို သေချာမသိနိုင်လို့ပါ။

```ts
function printValueLater(value: string | undefined) {
    if (value === undefined) {
        value = "missing!";
    }

    setTimeout(() => {
        // Modifying 'value', even in a way that shouldn't affect
        // its type, will invalidate type refinements in closures.
        value = value;
    }, 500);

    setTimeout(() => {
        console.log(value.toUpperCase());
        //          ~~~~~
        // error! 'value' is possibly 'undefined'.
    }, 1000);
}
```

ဒါက ပုံမှန် JavaScript code တွေ အများကြီးကို ဖော်ပြရတာ ပိုလွယ်ကူစေသင့်ပါတယ်။
[ဒီပြောင်းလဲမှုအကြောင်း GitHub ပေါ်မှာ ပိုဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/56908)။

## The `NoInfer` Utility Type (`NoInfer` Utility Type အကြောင်း)

Generic function တွေကို ခေါ်တဲ့အခါ — TypeScript က သင်ထည့်ပေးလိုက်တဲ့အရာကနေ type argument တွေကို infer လုပ်နိုင်ပါတယ်။

```ts
function doSomething<T>(arg: T) {
    // ...
}

// We can explicitly say that 'T' should be 'string'.
doSomething<string>("hello!");

// We can also just let the type of 'T' get inferred.
doSomething("hello!");
```

ဒါပေမယ့် — စိန်ခေါ်မှုတစ်ခုက — infer လုပ်ဖို့ "အကောင်းဆုံး" type က ဘာလဲဆိုတာ အမြဲတမ်း ရှင်းရှင်းလင်းလင်း မသိရတာပါ။
ဒါက TypeScript ကို — တရားဝင်တဲ့ call တွေကို ပယ်ချတာ၊ သံသယဖြစ်စရာ call တွေကို လက်ခံတာ၊ ဒါမှမဟုတ် bug တစ်ခုကို ဖမ်းမိတဲ့အခါ ပိုဆိုးတဲ့ error message တွေ အစီရင်ခံတာတွေ ဖြစ်စေနိုင်ပါတယ်။

ဥပမာ — color name တွေရဲ့ စာရင်းတစ်ခု၊ ပြီးတော့ optional default color တစ်ခုကို ယူတဲ့ `createStreetLight` function တစ်ခုကို စိတ်ကူးကြည့်ပါ။

```ts
function createStreetLight<C extends string>(colors: C[], defaultColor?: C) {
    // ...
}

createStreetLight(["red", "yellow", "green"], "red");
```

မူရင်း `colors` array ထဲမှာ မပါတဲ့ `defaultColor` တစ်ခုကို ထည့်ပေးလိုက်ရင် ဘာဖြစ်မလဲ?
ဒီ function ထဲမှာ — `colors` က "အရင်းအမြစ်တရား (source of truth)" ဖြစ်ပြီး — `defaultColor` ဆီ ဘာတွေ ထည့်လို့ရလဲဆိုတာကို ဖော်ပြဖို့ ရည်ရွယ်ပါတယ်။

```ts
// Oops! This is undesirable, but is allowed!
createStreetLight(["red", "yellow", "green"], "blue");
```

ဒီcall မှာ — type inference က `"blue"` က `"red"` ဒါမှမဟုတ် `"yellow"` ဒါမှမဟုတ် `"green"` တို့လိုပဲ တရားဝင် type တစ်ခုလို့ ဆုံးဖြတ်လိုက်ပါတယ်။
ဒါကြောင့် — call ကို ပယ်ချမယ့်အစား — TypeScript က `C` ရဲ့ type ကို `"red" | "yellow" | "green" | "blue"` အနေနဲ့ infer လုပ်လိုက်ပါတယ်။
Inference က ကျွန်တော်တို့ မျက်နှာကို ပြာသွားအောင် လုပ်လိုက်တယ်လို့ သင်ပြောနိုင်ပါတယ်!

လူတွေ လောလောဆယ် ဒါကို ကိုင်တွယ်တဲ့ နည်းလမ်းတစ်ခုက — ရှိပြီးသား type parameter နဲ့ နယ်နိမိတ်ချင်း ထိစပ်ထားတဲ့ (bounded) type parameter သီးခြားတစ်ခုကို ထပ်ထည့်တာပါ။

```ts
function createStreetLight<C extends string, D extends C>(colors: C[], defaultColor?: D) {
}

createStreetLight(["red", "yellow", "green"], "blue");
//                                            ~~~~~~
// error!
// Argument of type '"blue"' is not assignable to parameter of type '"red" | "yellow" | "green" | undefined'.
```

ဒါက အလုပ်လုပ်ပေမယ့် — နည်းနည်း ကြမ်းတမ်းပါတယ် — `D` က `createStreetLight` ရဲ့ signature ထဲမှာ တခြားနေရာတွေမှာ သုံးဖို့ မဖြစ်နိုင်လောက်လို့ပါ။
ဒီကိစ္စမှာ *မဆိုးဘူးဆိုပေမယ့်* — type parameter တစ်ခုကို signature တစ်ခုထဲမှာ တစ်ကြိမ်ပဲ သုံးတာက မကြာခဏ code smell တစ်ခုပါ။

ဒါကြောင့်မို့ TypeScript 5.4 က `NoInfer<T>` utility type အသစ်တစ်ခုကို မိတ်ဆက်ပေးတာပါ။
Type တစ်ခုကို `NoInfer<...>` ထဲမှာ ထုပ်ပိုးလိုက်တာက — TypeScript ကို အတွင်းထဲက type တွေနဲ့ ကိုက်ညီမှု ရှာဖွေပြီး — type inference အတွက် candidate တွေ ရှာမယ့်အစား — မလုပ်ဖို့ signal တစ်ခု ပေးလိုက်တာပါ။

`NoInfer` ကို သုံးပြီး — `createStreetLight` ကို ဒီလိုမျိုး ပြန်ရေးနိုင်ပါတယ်:

```ts
function createStreetLight<C extends string>(colors: C[], defaultColor?: NoInfer<C>) {
    // ...
}

createStreetLight(["red", "yellow", "green"], "blue");
//                                            ~~~~~~
// error!
// Argument of type '"blue"' is not assignable to parameter of type '"red" | "yellow" | "green" | undefined'.
```

`defaultColor` ရဲ့ type ကို inference အတွက် စူးစမ်းခြင်းကနေ ဖယ်ထုတ်လိုက်တာက — `"blue"` က inference candidate အဖြစ် ဘယ်တော့မှ အဆုံးမသတ်စေဘဲ — type-checker က သူ့ကို ပယ်ချနိုင်ပါတယ်။

[အကောင်အထည်ဖော်တဲ့ pull request](https://github.com/microsoft/TypeScript/pull/56794) ထဲမှာ တိကျတဲ့ ပြောင်းလဲမှုတွေကို ကြည့်နိုင်သလို — [ကနဦး အကောင်အထည်ဖော်မှု](https://github.com/microsoft/TypeScript/pull/52968) ကတော့ [Mateusz Burzyński](https://github.com/Andarist) ရဲ့ ကျေးဇူးကြောင့် ရရှိနိုင်ခဲ့ပါတယ်!

## `Object.groupBy` and `Map.groupBy` (`Object.groupBy` နှင့် `Map.groupBy`)

TypeScript 5.4 က JavaScript ရဲ့ `Object.groupBy` နဲ့ `Map.groupBy` static method အသစ်တွေအတွက် declaration တွေကို ထပ်ဖြည့်ပေးပါတယ်။

`Object.groupBy` က iterable တစ်ခုနဲ့ — element တစ်ခုချင်းစီကို ဘယ် "group" ထဲ ထားသင့်လဲဆိုတာကို ဆုံးဖြတ်ပေးတဲ့ function တစ်ခုကို ယူပါတယ်။
အဲဒီ function က group တစ်ခုစီအတွက် "key" တစ်ခု ဖန်တီးပေးဖို့ လိုအပ်ပြီး — `Object.groupBy` က အဲဒီ key ကို သုံးပြီး — key တိုင်းက မူရင်း element ပါဝင်တဲ့ array တစ်ခုဆီ map လုပ်ထားတဲ့ object တစ်ခုကို ဖန်တီးပေးပါတယ်။

ဒါကြောင့် အောက်ပါ JavaScript က:

```js
const array = [0, 1, 2, 3, 4, 5];

const myObj = Object.groupBy(array, (num, index) => {
    return num % 2 === 0 ? "even": "odd";
});
```

အခြေခံအားဖြင့် ဒါကို ရေးတာနဲ့ တူညီပါတယ်:

```js
const myObj = {
    even: [0, 2, 4],
    odd: [1, 3, 5],
};
```

`Map.groupBy` က အလားတူပါ — ဒါပေမယ့် plain object တစ်ခုအစား `Map` တစ်ခုကို ထုတ်ပေးပါတယ်။
`Map` တွေရဲ့ အာမခံချက်တွေ လိုအပ်ရင်၊ `Map` တွေကို မျှော်လင့်တဲ့ API တွေနဲ့ အလုပ်လုပ်နေရင်၊ ဒါမှမဟုတ် JavaScript မှာ property name အဖြစ် သုံးလို့ရတဲ့ key တွေတင်မက — ဘယ်လို key မျိုးကိုမဆို group လုပ်ဖို့ သုံးဖို့ လိုအပ်ရင် — ဒါက ပိုနှစ်သက်ဖွယ် ဖြစ်နိုင်ပါတယ်။

```js
const myObj = Map.groupBy(array, (num, index) => {
    return num % 2 === 0 ? "even" : "odd";
});
```

ပြီးတော့ အရင်ကလိုပဲ — `myObj` ကို တူညီတဲ့ နည်းလမ်းနဲ့ ဖန်တီးနိုင်ခဲ့ပါတယ်:

```js
const myObj = new Map();

myObj.set("even", [0, 2, 4]);
myObj.set("odd", [1, 3, 5]);
```

အပေါ်က `Object.groupBy` ဥပမာမှာ — ထုတ်လုပ်လိုက်တဲ့ object က optional property တွေ အားလုံး သုံးထားတာကို သတိပြုပါ။

```ts
interface EvenOdds {
    even?: number[];
    odd?: number[];
}

const myObj: EvenOdds = Object.groupBy(...);

myObj.even;
//    ~~~~
// Error to access this under 'strictNullChecks'.
```

ဒါက — `groupBy` က key တွေ *အားလုံး* ထုတ်ပေးခဲ့တယ်ဆိုတာကို ယေဘုယျ နည်းလမ်းတစ်ခုနဲ့ အာမခံဖို့ နည်းလမ်း မရှိလို့ပါ။

ဒီ method တွေကို သင့် `target` ကို `esnext` အဖြစ် configure လုပ်ခြင်း ဒါမှမဟုတ် သင့် `lib` setting တွေကို ချိန်ညှိခြင်းအားဖြင့်သာ ဝင်ရောက်ကြည့်ရှုနိုင်တာကိုလည်း သတိပြုပါ။
သူတို့က နောက်ဆုံးမှာတော့ တည်ငြိမ်တဲ့ `es2024` target တစ်ခုအောက်မှာ ရနိုင်လာဖို့ မျှော်လင့်ပါတယ်။

ဒီ `groupBy` method တွေဆီ [declaration တွေ ထပ်ဖြည့်ပေးခဲ့တဲ့](https://github.com/microsoft/TypeScript/pull/56805) [Kevin Gibbons](https://github.com/bakkot) ကို ကျေးဇူးတင်ကြောင်း ပြောကြားချင်ပါတယ်။

## Support for `require()` calls in `--moduleResolution bundler` and `--module preserve` (`--moduleResolution bundler` နှင့် `--module preserve` တို့တွင် `require()` ခေါ်ဆိုမှုများ ပံ့ပိုးခြင်း)

TypeScript မှာ `bundler` လို့ခေါ်တဲ့ `moduleResolution` option တစ်ခု ရှိပြီး — ခေတ်မီ bundler တွေက import path တစ်ခုက ဘယ် file ကို ရည်ညွှန်းလဲဆိုတာကို ဘယ်လို တွက်ဆလဲဆိုတာကို ပုံစံထုတ်ဖို့ ရည်ရွယ်ပါတယ်။
ဒီoption ရဲ့ ကန့်သတ်ချက်တစ်ခုက — သူ့ကို `--module esnext` နဲ့ တွဲသုံးရမှာမို့ — `import ... = require(...)` syntax ကို သုံးလို့ မဖြစ်အောင် လုပ်ခဲ့တာပါ။

```ts
// previously errored
import myModule = require("module/path");
```

သင်က standard ECMAScript `import` တွေပဲ ရေးဖို့ စီစဉ်ထားရင် ဒါက သိပ်ကြီးကျယ်တဲ့ ကိစ္စလို မထင်ရပေမယ့် — [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) ပါတဲ့ package တစ်ခုကို သုံးတဲ့အခါ ကွာခြားချက် ရှိပါတယ်။

TypeScript 5.4 မှာ — `module` setting ကို `preserve` လို့ခေါ်တဲ့ option အသစ်တစ်ခုအဖြစ် သတ်မှတ်တဲ့အခါ — `require()` ကို အခုဆို သုံးနိုင်ပါပြီ။

`--module preserve` နဲ့ `--moduleResolution bundler` ကြားမှာ — ဒီနှစ်ခုက bundler တွေနဲ့ Bun လိုမျိုး runtime တွေ ဘာတွေကို ခွင့်ပြုမလဲ၊ module lookup တွေကို ဘယ်လို လုပ်ဆောင်မလဲဆိုတာကို ပိုတိကျစွာ ပုံစံထုတ်ပေးပါတယ်။
တကယ်တော့ — `--module preserve` သုံးတဲ့အခါ — `bundler` option ကို `--moduleResolution` အတွက် (`--esModuleInterop` နဲ့ `--resolveJsonModule` တို့နဲ့အတူ) သွယ်ဝိုက်ပြီး သတ်မှတ်ပေးပါလိမ့်မယ်

```json5
{
    "compilerOptions": {
        "module": "preserve",
        // ^ also implies:
        // "moduleResolution": "bundler",
        // "esModuleInterop": true,
        // "resolveJsonModule": true,

        // ...
    }
}
```

`--module preserve` အောက်မှာ — ECMAScript `import` တစ်ခုက ရှိသလိုပဲ အမြဲ emit လုပ်ခံရပြီး — `import ... = require(...)` က `require()` call တစ်ခုအနေနဲ့ emit လုပ်ခံရပါလိမ့်မယ် (လက်တွေ့မှာတော့ သင့် code အတွက် bundler တစ်ခုကို သုံးဖွယ် ရှိတာမို့ — TypeScript ကို emit အတွက် သင်လုံးဝ မသုံးရတာတောင် ဖြစ်နိုင်ပါတယ်)။
ဒါက file ရဲ့ extension ဘာပဲဖြစ်ဖြစ် အမြဲတမ်း မှန်ကန်ပါတယ်။
ဒါကြောင့် ဒီ code ရဲ့ output က:

```ts
import * as foo from "some-package/foo";
import bar = require("some-package/bar");
```

ဒီလိုမျိုး ဖြစ်သင့်ပါတယ်:

```js
import * as foo from "some-package/foo";
var bar = require("some-package/bar");
```

ဒါက ဘာကို ဆိုလိုလဲဆိုရင် — သင်ရွေးချယ်လိုက်တဲ့ syntax က [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) တွေကို ဘယ်လို ကိုက်ညီစေလဲဆိုတာကို လမ်းညွှန်ပေးပါတယ်။
ဒါကြောင့် အပေါ်က ဥပမာမှာ — `some-package` ရဲ့ `package.json` က ဒီလိုမျိုး ဆိုရင်:

```json5
{
  "name": "some-package",
  "version": "0.0.1",
  "exports": {
    "./foo": {
        "import": "./esm/foo-from-import.mjs",
        "require": "./cjs/foo-from-require.cjs"
    },
    "./bar": {
        "import": "./esm/bar-from-import.mjs",
        "require": "./cjs/bar-from-require.cjs"
    }
  }
}
```

TypeScript က ဒီ path တွေကို `[...]/some-package/esm/foo-from-import.mjs` နဲ့ `[...]/some-package/cjs/bar-from-require.cjs` အဖြစ် resolve လုပ်ပါလိမ့်မယ်။

နောက်ထပ် အချက်အလက်အတွက် — [ဒီ setting အသစ်တွေအကြောင်း ဒီမှာ ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/56785)။

## Checked Import Attributes and Assertions (Import Attributes နှင့် Assertions များကို စစ်ဆေးခြင်း)

Import attributes နဲ့ assertions တွေကို global `ImportAttributes` type နဲ့ အခုဆို စစ်ဆေးပါတယ်။
ဒါက runtime တွေက import attributes တွေကို ပိုတိကျစွာ ဖော်ပြနိုင်တယ်လို့ ဆိုလိုပါတယ်

```ts
// In some global file.
interface ImportAttributes {
    type: "json";
}

// In some other module
import * as ns from "foo" with { type: "not-json" };
//                                     ~~~~~~~~~~
// error!
//
// Type '{ type: "not-json"; }' is not assignable to type 'ImportAttributes'.
//  Types of property 'type' are incompatible.
//    Type '"not-json"' is not assignable to type '"json"'.
```

[ဒီပြောင်းလဲမှု](https://github.com/microsoft/TypeScript/pull/56034) ကို [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ရဲ့ ကျေးဇူးကြောင့် ရရှိနိုင်ခဲ့ပါတယ်။

## Quick Fix for Adding Missing Parameters (ပျောက်နေသော Parameter များ ထည့်သွင်းရန် Quick Fix)

TypeScript မှာ — argument တွေ အများကြီးနဲ့ ခေါ်ခံထားရတဲ့ function တွေဆီ parameter အသစ်တစ်ခု ထည့်ဖို့ quick fix တစ်ခု အခုဆို ရှိပါတယ်။

![someFunction က someHelperFunction ကို မျှော်လင့်ထားတာထက် argument ၂ ခု ပိုပြီး ခေါ်ထားတဲ့အခါ quick fix တစ်ခု ကမ်းလှမ်းခံရပုံ။](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2024/01/add-missing-params-5-4-beta-before.png)

![quick fix ကို အသုံးပြုပြီးတဲ့နောက် someHelperFunction ဆီ ပျောက်နေတဲ့ argument တွေကို ထည့်သွင်းပြီးသွားပုံ။](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2024/01/add-missing-params-5-4-beta-after.png)

ဒါက — argument အသစ်တစ်ခုကို ရှိပြီးသား function များစွာကတစ်ဆင့် ချည်မျှင်လိုမျိုး ထည့်သွင်းသွားရတဲ့အခါ အသုံးဝင်နိုင်ပါတယ် — ဒီနေ့ခေတ်မှာ အဲဒါက အတော်လေး ပင်ပန်းစရာ ကောင်းနိုင်လို့ပါ။

[ဒီ quick fix](https://github.com/microsoft/TypeScript/pull/56411) ကို [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) ရဲ့ ကျေးဇူးကြောင့် ရရှိနိုင်ခဲ့ပါတယ်။

## Upcoming Changes from TypeScript 5.0 Deprecations (TypeScript 5.0 Deprecation များမှ လာမည့် ပြောင်းလဲမှုများ)

TypeScript 5.0 က အောက်ပါ option တွေနဲ့ အပြုအမူတွေကို deprecate လုပ်ခဲ့ပါတယ်:

 * `charset`
 * `target: ES3`
 * `importsNotUsedAsValues`
 * `noImplicitUseStrict`
 * `noStrictGenericChecks`
 * `keyofStringsOnly`
 * `suppressExcessPropertyErrors`
 * `suppressImplicitAnyIndexErrors`
 * `out`
 * `preserveValueImports`
 * project references တွေထဲက `prepend`
 * OS အလိုက် သွယ်ဝိုက် ကွဲပြားတဲ့ `newLine`

သူတို့ကို ဆက်သုံးနိုင်ဖို့ — TypeScript 5.0 နဲ့ တခြား မကြာသေးခင်က ဗားရှင်းတွေ သုံးနေတဲ့ developer တွေက `ignoreDeprecations` လို့ခေါ်တဲ့ option အသစ်တစ်ခုကို `"5.0"` တန်ဖိုးနဲ့ သတ်မှတ်ပေးရပါတယ်။

ဒါပေမယ့် — TypeScript 5.4 က ဒါတွေ ပုံမှန်အတိုင်း ဆက်လက် လုပ်ဆောင်နေမယ့် နောက်ဆုံး ဗားရှင်း ဖြစ်ပါလိမ့်မယ်။
TypeScript 5.5 (ဖြစ်နိုင်ခြေအရ 2024 ခုနှစ် ဇွန်လ) ရောက်တဲ့အခါ — ဒါတွေက hard errors တွေ ဖြစ်လာပြီး — သူတို့ကို သုံးထားတဲ့ code တွေကို ရွှေ့ပြောင်းဖို့ လိုအပ်ပါလိမ့်မယ်။

နောက်ထပ် အချက်အလက်အတွက် — သင့် codebase ကို အကောင်းဆုံး ဘယ်လို လိုက်လျောညီထွေ ဖြစ်အောင် လုပ်ရမလဲဆိုတဲ့ အကြံပြုချက်တွေ ပါဝင်တဲ့ — [GitHub ပေါ်က ဒီအစီအစဉ်အကြောင်း ဒီမှာ ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/issues/51909)။

## Notable Behavioral Changes (သတိပြုသင့်သော Behavioral Change များ)

ဒီအပိုင်းက — upgrade တစ်ခုခုရဲ့ အစိတ်အပိုင်းအနေနဲ့ အသိအမှတ်ပြုပြီး နားလည်ထားသင့်တဲ့ — သတိပြုထိုက်တဲ့ ပြောင်းလဲမှုအစုတစ်စုကို မီးမောင်းထိုးပြပါတယ်။
တစ်ခါတစ်ရံ deprecations, removals, နဲ့ ကန့်သတ်ချက်အသစ်တွေကို မီးမောင်းထိုးပြပါတယ်။
အဲဒါက — လုပ်ဆောင်ချက်အရ တိုးတက်မှုတွေဖြစ်ပေမယ့် — error အသစ်တွေ မိတ်ဆက်ခြင်းအားဖြင့် ရှိပြီးသား build တစ်ခုကိုပါ သက်ရောက်မှု ရှိနိုင်တဲ့ — bug fixes တွေလည်း ပါဝင်နိုင်ပါတယ်။

### `lib.d.ts` Changes (`lib.d.ts` ပြောင်းလဲမှုများ)

DOM အတွက် ထုတ်ပေးတဲ့ type တွေက သင့် codebase ကို type-check လုပ်တာအပေါ် သက်ရောက်မှု ရှိနိုင်ပါတယ်။
နောက်ထပ် အချက်အလက်အတွက် — [TypeScript 5.4 အတွက် DOM အပ်ဒိတ်တွေကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/57027)။

### More Accurate Conditional Type Constraints (ပိုမိုတိကျသော Conditional Type Constraint များ)

အောက်ပါ code က `foo` function ထဲမှာ variable declaration ဒုတိယတစ်ခုကို နောက်တော့ ခွင့်မပြုတော့ပါဘူး။

```ts
type IsArray<T> = T extends any[] ? true : false;

function foo<U extends object>(x: IsArray<U>) {
    let first: true = x;    // Error
    let second: false = x;  // Error, but previously wasn't
}
```

အရင်က — TypeScript က `second` အတွက် initializer ကို စစ်ဆေးတဲ့အခါ — `IsArray<U>` က unit type `false` ဆီ assignable ဟုတ်မဟုတ် ဆုံးဖြတ်ဖို့ လိုအပ်ခဲ့ပါတယ်။
`IsArray<U>` က ထင်ရှားတဲ့ နည်းလမ်းတစ်ခုနဲ့ compatible မဖြစ်ဘူးဆိုပေမယ့် — TypeScript က အဲဒီ type ရဲ့ *constraint* ကိုပါ ကြည့်ပါတယ်။
`T extends Foo ? TrueBranch : FalseBranch` လိုမျိုး conditional type တစ်ခုမှာ — `T` က generic ဖြစ်တဲ့အခါ — type system က `T` ရဲ့ constraint ကို ကြည့်ပြီး — `T` ကိုယ်တိုင်အတွက် အစားထိုး ထည့်ကာ — true ဒါမှမဟုတ် false branch ပေါ်မှာ ဆုံးဖြတ်ပါတယ်။

ဒါပေမယ့် — ဒီအပြုအမူက မမှန်ကန်ပါဘူး — အကြောင်းကတော့ အလွန်အကျွံ စိတ်အားထက်သန်နေလို့ပါ။
`T` ရဲ့ constraint က `Foo` ဆီ assignable မဟုတ်ဘူးဆိုတာက — သူ့ကို assignable ဖြစ်တဲ့အရာတစ်ခုနဲ့ instantiate လုပ်မှာ မဟုတ်ဘူးလို့ မဆိုလိုပါဘူး။
ဒါကြောင့် — `T` က `Foo` ကို *ဘယ်တော့မှ* ဒါမှမဟုတ် *အမြဲတမ်း* extend လုပ်တယ်ဆိုတာ သက်သေပြလို့ မရတဲ့ ကိစ္စတွေမှာ — conditional type ရဲ့ constraint အတွက် union type တစ်ခု ထုတ်ပေးတာက ပိုမှန်ကန်တဲ့ အပြုအမူပါ။

TypeScript 5.4 က ဒီပိုတိကျတဲ့ အပြုအမူကို ကျင့်သုံးပါတယ်။
လက်တွေ့မှာ ဒါက ဘာကို ဆိုလိုလဲဆိုရင် — conditional type instance တစ်ချို့က သူတို့ရဲ့ branches တွေနဲ့ နောက်တော့ compatible မဖြစ်တော့တာကို စတင် တွေ့ရှိလာနိုင်ပါတယ်။

[တိကျတဲ့ ပြောင်းလဲမှုတွေအကြောင်း ဒီမှာ ဖတ်နိုင်ပါတယ်](https://github.com/microsoft/TypeScript/pull/56004)။

### More Aggressive Reduction of Intersections Between Type Variables and Primitive Types (Type Variable များနှင့် Primitive Type များကြား Intersection များကို ပိုမိုပြင်းထန်စွာ လျှော့ချခြင်း)

TypeScript က type variable တွေရဲ့ constraint က primitive type တွေနဲ့ ဘယ်လို ထပ်နေလဲဆိုတာအပေါ် မူတည်ပြီး — type variable တွေနဲ့ primitive တွေကြားက intersections တွေကို အခုဆို ပိုပြင်းထန်စွာ လျှော့ချပါတယ်။

```ts
declare function intersect<T, U>(x: T, y: U): T & U;

function foo<T extends "abc" | "def">(x: T, str: string, num: number) {

    // Was 'T & string', now is just 'T'
    let a = intersect(x, str);

    // Was 'T & number', now is just 'never'
    let b = intersect(x, num)

    // Was '(T & "abc") | (T & "def")', now is just 'T'
    let c = Math.random() < 0.5 ?
        intersect(x, "abc") :
        intersect(x, "def");
}
```

နောက်ထပ် အချက်အလက်အတွက် — [ဒီနေရာက ပြောင်းလဲမှုကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/56515)။

### Improved Checking Against Template Strings with Interpolations (Interpolation များပါသော Template String များကို ပိုမိုကောင်းမွန်အောင် စစ်ဆေးခြင်း)

TypeScript က string တွေက template string type တစ်ခုရဲ့ placeholder slot တွေဆီ assignable ဟုတ်မဟုတ်ကို အခုဆို ပိုတိကျစွာ စစ်ဆေးပါတယ်။

```ts
function a<T extends {id: string}>() {
    let x: `-${keyof T & string}`;
    
    // Used to error, now doesn't.
    x = "-id";
}
```

ဒီအပြုအမူက ပိုနှစ်လိုဖွယ် ကောင်းပေမယ့် — conditional types လိုမျိုး တည်ဆောက်ပုံတွေ သုံးထားတဲ့ code တွေမှာ — ဒီစည်းမျဉ်း ပြောင်းလဲမှုတွေကို မြင်လွယ်တာမို့ — breaks တွေ ဖြစ်စေနိုင်ပါတယ်။

အသေးစိတ်အတွက် [ဒီပြောင်းလဲမှုကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/56598)။

### Errors When Type-Only Imports Conflict with Local Values (Type-Only Import များ Local Value များနှင့် ထိပ်တိုက်တွေ့သည့်အခါ Error များ)

အရင်က — `Something` ဆီ လုပ်တဲ့ import က type တစ်ခုကိုပဲ ရည်ညွှန်းတယ်ဆိုရင် — TypeScript က `isolatedModules` အောက်မှာ အောက်ပါ code ကို ခွင့်ပြုခဲ့ပါတယ်။

```ts
import { Something } from "./some/path";

let Something = 123;
```

ဒါပေမယ့် — runtime မှာ fail ဖို့ အာမခံထားတဲ့ code ဖြစ်ရင်တောင် — single-file compiler တွေအတွက် import ကို ပစ်ချတာ "လုံခြုံ" လားဆိုတာ ယူဆဖို့ မလုံခြုံပါဘူး။
TypeScript 5.4 မှာ — ဒီ code က အောက်ပါလို error တစ်ခုကို ဖြစ်ပေါ်စေပါလိမ့်မယ်:

```
Import 'Something' conflicts with local value, so must be declared with a type-only import when 'isolatedModules' is enabled.
```

ဖြေရှင်းနည်းက — local rename တစ်ခု လုပ်ဖို့ ဒါမှမဟုတ် — error က ပြောထားသလိုပဲ — import ဆီ `type` modifier ထည့်ဖို့ပါ:

```ts
import type { Something } from "./some/path";

// or

import { type Something } from "./some/path";
```

[ပြောင်းလဲမှုကိုယ်တိုင်အကြောင်း ဒီမှာ ပိုကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/56354)။

### New Enum Assignability Restrictions (Enum Assignability ကန့်သတ်ချက်အသစ်များ)

enum နှစ်ခုမှာ တူညီတဲ့ declared names တွေနဲ့ enum member names တွေ ရှိတဲ့အခါ — သူတို့က အရင်က အမြဲတမ်း compatible လို့ သတ်မှတ်ခဲ့ပါတယ်;
ဒါပေမယ့် — တန်ဖိုးတွေကို သိရတဲ့အခါ — TypeScript က တန်ဖိုးတွေ ကွဲပြားနေတာကို တိတ်တဆိတ် ခွင့်ပြုနေခဲ့ပါတယ်။

TypeScript 5.4 က — တန်ဖိုးတွေကို သိရတဲ့အခါ — တန်ဖိုးတွေ တူညီဖို့ လိုအပ်ခြင်းအားဖြင့် ဒီကန့်သတ်ချက်ကို တင်းကျပ်စေပါတယ်။

```ts
namespace First {
    export enum SomeEnum {
        A = 0,
        B = 1,
    }
}

namespace Second {
    export enum SomeEnum {
        A = 0,
        B = 2,
    }
}

function foo(x: First.SomeEnum, y: Second.SomeEnum) {
    // Both used to be compatible - no longer the case,
    // TypeScript errors with something like:
    //
    //  Each declaration of 'SomeEnum.B' differs in its value, where '1' was expected but '2' was given.
    x = y;
    y = x;
}
```

ထို့အပြင် — enum member တစ်ခုမှာ statically သိရတဲ့ တန်ဖိုး မရှိတဲ့အခါအတွက် ကန့်သတ်ချက်အသစ်တွေလည်း ရှိပါတယ်။
ဒီလိုကိစ္စတွေမှာ — တခြား enum က အနည်းဆုံး implicitly numeric (ဥပမာ — statically resolve လုပ်ထားတဲ့ initializer မရှိဘူးလို့ ဆိုလိုတာပါ) ဒါမှမဟုတ် explicitly numeric (ဆိုလိုတာက TypeScript က တန်ဖိုးကို numeric တစ်ခုခုအဖြစ် resolve လုပ်နိုင်တယ်လို့ ဆိုလိုတာပါ) ဖြစ်ရပါမယ်။
လက်တွေ့ကျကျ ပြောရရင် — ဒါက string enum member တွေက တူညီတဲ့ တန်ဖိုးရှိတဲ့ တခြား string enum တွေနဲ့ပဲ compatible ဖြစ်တော့မယ်လို့ ဆိုလိုပါတယ်။

```ts
namespace First {
    export declare enum SomeEnum {
        A,
        B,
    }
}

namespace Second {
    export declare enum SomeEnum {
        A,
        B = "some known string",
    }
}

function foo(x: First.SomeEnum, y: Second.SomeEnum) {
    // Both used to be compatible - no longer the case,
    // TypeScript errors with something like:
    //
    //  One value of 'SomeEnum.B' is the string '"some known string"', and the other is assumed to be an unknown numeric value.
    x = y;
    y = x;
}
```

နောက်ထပ် အချက်အလက်အတွက် — [ဒီပြောင်းလဲမှုကို မိတ်ဆက်ပေးတဲ့ pull request ကို ကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/55924)။

### Name Restrictions on Enum Members (Enum Member များပေါ်ရှိ နာမည် ကန့်သတ်ချက်များ)

TypeScript က enum member တွေကို `Infinity`, `-Infinity`, ဒါမှမဟုတ် `NaN` ဆိုတဲ့ နာမည်တွေ သုံးခွင့် မပေးတော့ပါဘူး။

```ts
// Errors on all of these:
//
//  An enum member cannot have a numeric name.
enum E {
    Infinity = 0,
    "-Infinity" = 1,
    NaN = 2,
}
```

[ဒီမှာ အသေးစိတ် ပိုကြည့်ပါ](https://github.com/microsoft/TypeScript/pull/56161)။

### Better Mapped Type Preservation Over Tuples with `any` Rest Elements (`any` Rest Element များပါသော Tuple များအပေါ် Mapped Type ထိန်းသိမ်းမှု ပိုမိုကောင်းမွန်လာခြင်း)

အရင်က — `any` ပါတဲ့ mapped type တစ်ခုကို tuple တစ်ခုပေါ်မှာ သုံးတာက `any` element type တစ်ခုကို ဖန်တီးပေးခဲ့ပါတယ်။
ဒါက မနှစ်လိုဖွယ် ဖြစ်ပြီး — အခုဆို ပြင်ဆင်ပြီးပါပြီ။

```ts
Promise.all(["", ...([] as any)])
    .then((result) => {
        const head = result[0];       // 5.3: any, 5.4: string
        const tail = result.slice(1); // 5.3 any, 5.4: any[]
    });
```

နောက်ထပ် အချက်အလက်အတွက် — [ဒီပြင်ဆင်မှု](https://github.com/microsoft/TypeScript/pull/57031) ကို ကြည့်ပြီး — [behavioral changes တွေနဲ့ ပတ်သက်တဲ့ နောက်ဆက်တွဲ ဆွေးနွေးမှု](https://github.com/microsoft/TypeScript/issues/57389) နဲ့ [နောက်ထပ် tweaks](https://github.com/microsoft/TypeScript/issues/57389) တွေနဲ့အတူ ကြည့်ပါ။

### Emit Changes (Emit ပြောင်းလဲမှုများ)

တစ်ခုတည်းအတွက် breaking change တစ်ခု မဟုတ်ပေမယ့် — developer တွေက TypeScript ရဲ့ JavaScript ဒါမှမဟုတ် declaration emit outputs တွေပေါ်မှာ သွယ်ဝိုက်ပြီး မှီခိုနေမိနိုင်ပါတယ်။
အောက်ပါတို့က သတိပြုထိုက်တဲ့ ပြောင်းလဲမှုတွေပါ။

* [Shadowed ဖြစ်နေတဲ့အခါ type parameter နာမည်တွေကို ပိုမကြာခဏ ထိန်းသိမ်းခြင်း](https://github.com/microsoft/TypeScript/pull/55820)
* [Async function ရဲ့ ရှုပ်ထွေးတဲ့ parameter list များကို downlevel generator body ထဲ ရွှေ့ပြောင်းခြင်း](https://github.com/microsoft/TypeScript/pull/56296)
* [Function declaration များထဲမှာ binding alias ကို မဖယ်ရှားခြင်း](https://github.com/microsoft/TypeScript/pull/57020)
* [ImportTypeNode တစ်ခုထဲမှာ ImportAttributes က emit phase အလားတူမျိုး ဖြတ်သန်းသင့်ခြင်း](https://github.com/microsoft/TypeScript/pull/56395)
