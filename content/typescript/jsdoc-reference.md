---
title: "JSDoc Reference (JSDoc ကိုးကားချက်)"
description: "JavaScript files တွေမှာ JSDoc annotations နဲ့ type information ပေးတဲ့အခါ TypeScript က ပံ့ပိုးထားတဲ့ constructs တွေရဲ့ ကိုးကားချက် — @type, @import, @param, @returns, @typedef, @callback, @template, @satisfies, class modifiers, @deprecated, @see, @link, @enum, @author စတာတွေ ဥပမာများနဲ့တကွ"
order: 47
source: "https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html"
status: translated
updated: 2026-09-05
---

အောက်က စာရင်းမှာ — JavaScript files တွေထဲမှာ JSDoc annotations တွေနဲ့ type information (type အချက်အလက်များ) ပေးတဲ့အခါ — လက်ရှိ ပံ့ပိုးထားတဲ့ constructs (တည်ဆောက်ပုံများ) တွေကို ဖော်ပြထားပါတယ်။

မှတ်ချက်:

- အောက်မှာ အတိအကျ စာရင်းမပါတဲ့ tags တွေ (ဥပမာ `@async`) ကိုတော့ မပံ့ပိုးသေးပါဘူး။
- TypeScript files တွေမှာတော့ documentation tags တွေကိုပဲ ပံ့ပိုးပါတယ်။ ကျန်တဲ့ tags တွေကို JavaScript files တွေမှာပဲ ပံ့ပိုးပါတယ်။

#### Types (Type များ)

- [`@type`](https://www.typescriptlang.org/docs/handbook)
- [`@import`](https://www.typescriptlang.org/docs/handbook)
- [`@param`](https://www.typescriptlang.org/docs/handbook) (သို့မဟုတ် [`@arg`](https://www.typescriptlang.org/docs/handbook) သို့မဟုတ် [`@argument`](https://www.typescriptlang.org/docs/handbook))
- [`@returns`](https://www.typescriptlang.org/docs/handbook) (သို့မဟုတ် [`@return`](https://www.typescriptlang.org/docs/handbook))
- [`@typedef`](https://www.typescriptlang.org/docs/handbook)
- [`@callback`](https://www.typescriptlang.org/docs/handbook)
- [`@template`](https://www.typescriptlang.org/docs/handbook)
- [`@satisfies`](https://www.typescriptlang.org/docs/handbook)

#### Classes (Class များ)

- [Property Modifiers (Property ပြင်ဆင်မှုများ)](https://www.typescriptlang.org/docs/handbook) `@public`, `@private`, `@protected`, `@readonly`
- [`@override`](https://www.typescriptlang.org/docs/handbook)
- [`@extends`](https://www.typescriptlang.org/docs/handbook) (သို့မဟုတ် [`@augments`](https://www.typescriptlang.org/docs/handbook))
- [`@implements`](https://www.typescriptlang.org/docs/handbook)
- [`@class`](https://www.typescriptlang.org/docs/handbook) (သို့မဟုတ် [`@constructor`](https://www.typescriptlang.org/docs/handbook))
- [`@this`](https://www.typescriptlang.org/docs/handbook)

#### Documentation (Documentation tags များ)

Documentation tags တွေက TypeScript ရော JavaScript မှာပါ အလုပ်လုပ်ပါတယ်။

- [`@deprecated`](https://www.typescriptlang.org/docs/handbook)
- [`@see`](https://www.typescriptlang.org/docs/handbook)
- [`@link`](https://www.typescriptlang.org/docs/handbook)

#### Other (အခြားအရာများ)

- [`@enum`](https://www.typescriptlang.org/docs/handbook)
- [`@author`](https://www.typescriptlang.org/docs/handbook)
- [Other supported patterns (အခြား ပံ့ပိုးထားသော patterns)](https://www.typescriptlang.org/docs/handbook)
- [Unsupported patterns (မပံ့ပိုးထားသော patterns)](https://www.typescriptlang.org/docs/handbook)
- [Unsupported tags (မပံ့ပိုးထားသော tags)](https://www.typescriptlang.org/docs/handbook)

[jsdoc.app](https://jsdoc.app) မှာ ဖော်ပြထားတဲ့ tag တစ်ခုရဲ့ အဓိပ္ပါယ်နဲ့ ယှဉ်ရင် — ဒီမှာက အဓိပ္ပါယ် တူညီတာ ဒါမှမဟုတ် အဲဒါထက် ပိုကျယ်ပြန့်တဲ့ superset ဖြစ်တာ များပါတယ်။ အောက်က code တွေက ကွာခြားချက်တွေကို ဖော်ပြပြီး — tag တစ်ခုချင်းစီရဲ့ သုံးပုံသုံးနည်း ဥပမာတစ်ချို့ကို ပေးထားပါတယ်။

**မှတ်ချက်:** [JSDoc support ကို စမ်းသပ်ကြည့်ဖို့ playground](https://www.typescriptlang.org/play?useJavaScript=truee=4) ကို သုံးနိုင်ပါတယ်။

## Types (Type များ)

### `@type`

`@type` tag နဲ့ types တွေကို ရည်ညွှန်းလို့ရပါတယ်။ Type က အောက်ပါတို့ ဖြစ်နိုင်ပါတယ်:

1. Primitive (အခြေခံ) type — `string` ဒါမှမဟုတ် `number` လိုမျိုး။
2. TypeScript declaration တစ်ခုမှာ ကြေညာထားတဲ့ type — global ဖြစ်ဖြစ် import လုပ်ထားတာဖြစ်ဖြစ်။
3. JSDoc ရဲ့ [`@typedef`](https://www.typescriptlang.org/docs/handbook) tag မှာ ကြေညာထားတဲ့ type။

JSDoc type syntax အများစုနဲ့ TypeScript syntax မှန်သမျှကို — [အခြေခံအကျဆုံး `string` လိုမျိုး](/docs/typescript/basic-types)ကစလို့ [အဆင့်မြင့်ဆုံး conditional types လိုမျိုး](/docs/typescript/conditional-types)အထိ — သုံးနိုင်ပါတယ်။

```js twoslash
/**
 * @type {string}
 */
var s;

/** @type {Window} */
var win;

/** @type {PromiseLike<string>} */
var promisedString;

// You can specify an HTML Element with DOM properties
/** @type {HTMLElement} */
var myElement = document.querySelector(selector);
element.dataset.myData = "";
```

`@type` က union type (ပေါင်းစည်းထားသော type) တစ်ခုကိုလည်း သတ်မှတ်နိုင်ပါတယ် &mdash; ဥပမာ — တစ်ခုခုက string ဒါမှမဟုတ် boolean ဖြစ်နိုင်တာမျိုးပါ။

```js twoslash
/**
 * @type {string | boolean}
 */
var sb;
```

Array types တွေကို syntax အမျိုးမျိုးနဲ့ သတ်မှတ်နိုင်ပါတယ်:

```js twoslash
/** @type {number[]} */
var ns;
/** @type {Array.<number>} */
var jsdoc;
/** @type {Array<number>} */
var nas;
```

Object literal types တွေကိုလည်း သတ်မှတ်နိုင်ပါတယ်။ ဥပမာ — properties `'a'` (string) နဲ့ `'b'` (number) ရှိတဲ့ object တစ်ခုက အောက်ပါ syntax ကို သုံးပါတယ်:

```js twoslash
/** @type {{ a: string, b: number }} */
var var9;
```

Map ပုံစံ နဲ့ array ပုံစံ objects တွေကို string နဲ့ number index signatures သုံးပြီး — standard JSDoc syntax ဖြစ်ဖြစ် TypeScript syntax ဖြစ်ဖြစ်နဲ့ သတ်မှတ်နိုင်ပါတယ်။

```js twoslash
/**
 * A map-like object that maps arbitrary `string` properties to `number`s.
 *
 * @type {Object.<string, number>}
 */
var stringToNumber;

/** @type {Object.<number, object>} */
var arrayLike;
```

အပေါ်က type နှစ်ခုက TypeScript types ဖြစ်တဲ့ `{ [x: string]: number }` နဲ့ `{ [x: number]: any }` တို့နဲ့ ညီမျှပါတယ်။ Compiler က syntax နှစ်ခုလုံးကို နားလည်ပါတယ်။

Function types တွေကို TypeScript ဒါမှမဟုတ် Google Closure syntax နဲ့ သတ်မှတ်နိုင်ပါတယ်:

```js twoslash
/** @type {function(string, boolean): number} Closure syntax */
var sbn;
/** @type {(s: string, b: boolean) => number} TypeScript syntax */
var sbn2;
```

ဒါမှမဟုတ် သတ်မှတ်ချက်မရှိတဲ့ `Function` type ကိုပဲ သုံးလိုက်ရုံလည်း ရပါတယ်:

```js twoslash
/** @type {Function} */
var fn7;
/** @type {function} */
var fn6;
```

Closure ကနေ လာတဲ့ တခြား types တွေလည်း အလုပ်လုပ်ပါတယ်:

```js twoslash
/**
 * @type {*} - can be 'any' type
 */
var star;
/**
 * @type {?} - unknown type (same as 'any')
 */
var question;
```

#### Casts (Cast လုပ်ခြင်း)

TypeScript က cast syntax ကို Google Closure ကနေ ငှားယူထားပါတယ်။ ဒါကြောင့် — parentheses စကားခွေ (parenthesized expression) တစ်ခုရဲ့ ရှေ့မှာ `@type` tag ထည့်ပြီး — types တွေကို တခြား types တွေဆီ cast (ပြောင်းလဲ) လုပ်နိုင်ပါတယ်။

```js twoslash
/**
 * @type {number | string}
 */
var numberOrString = Math.random() < 0.5 ? "hello" : 100;
var typeAssertedNumber = /** @type {number} */ (numberOrString);
```

TypeScript မှာလိုပဲ — `const` ဆီတောင် cast လုပ်နိုင်ပါတယ်:

```js twoslash
let one = /** @type {const} */(1);
```

#### Import types (Import type များ)

Import types တွေကို သုံးပြီး — တခြား files တွေကနေ declarations တွေကို import လုပ်နိုင်ပါတယ်။ ဒီ syntax က TypeScript အတွက်သီးသန့် ဖြစ်ပြီး — JSDoc standard နဲ့ ကွဲပြားပါတယ်:

```js twoslash
// @filename: types.d.ts
export type Pet = {
  name: string,
};

// @filename: main.js
/**
 * @param {import("./types").Pet} p
 */
function walk(p) {
  console.log(`Walking ${p.name}...`);
}
```

Module တစ်ခုကနေ value တစ်ခုရဲ့ type ကို ရဖို့ import types တွေကို သုံးနိုင်ပါတယ် — type ကို မသိဘူးဆိုရင်၊ ဒါမှမဟုတ် type က ကြီးပြီး ရိုက်ရတာ စိတ်ညစ်စရာ ကောင်းနေရင် ပေါ့:

```js twoslash
// @types: node
// @filename: accounts.d.ts
export const userAccount = {
  name: "Name",
  address: "An address",
  postalCode: "",
  country: "",
  planet: "",
  system: "",
  galaxy: "",
  universe: "",
};
// @filename: main.js
// ---cut---
/**
 * @type {typeof import("./accounts").userAccount}
 */
var x = require("./accounts").userAccount;
```

### `@import`

`@import` tag က — တခြား files တွေရဲ့ exports တွေကို ရည်ညွှန်းနိုင်အောင် လုပ်ပေးပါတယ်။

```js twoslash
// @filename: types.d.ts
export type Pet = {
  name: string,
};
// @filename: main.js
// ---cut---
/**
 * @import {Pet} from "./types"
 */

/**
 * @type {Pet}
 */
var myPet;
myPet.name;
```

ဒီ tags တွေက runtime မှာ files တွေကို တကယ် import လုပ်ပေးတာ မဟုတ်ပါဘူး — သူတို့ scope ထဲ ခေါ်သွင်းပေးတဲ့ symbols တွေကို type-checking အတွက် JSDoc comments တွေထဲမှာပဲ သုံးလို့ရပါတယ်။

```js twoslash
// @filename: dog.js
export class Dog {
  woof() {
    console.log("Woof!");
  }
}

// @filename: main.js
/** @import { Dog } from "./dog.js" */

const d = new Dog(); // error!
```

### `@param` and `@returns` (@param နဲ့ @returns tags)

`@param` က `@type` နဲ့ တူညီတဲ့ type syntax ကို သုံးပြီး — parameter name (parameter အမည်) တစ်ခု ထပ်ထည့်ပါတယ်။ Parameter ကို optional အဖြစ်လည်း ကြေညာနိုင်ပါတယ် — name ကို square brackets (`[` `]`) နဲ့ ဝိုင်းထားရုံပါပဲ:

```js twoslash
// Parameters may be declared in a variety of syntactic forms
/**
 * @param {string}  p1 - A string param.
 * @param {string=} p2 - An optional param (Google Closure syntax)
 * @param {string} [p3] - Another optional param (JSDoc syntax).
 * @param {string} [p4="test"] - An optional param with a default value
 * @returns {string} This is the result
 */
function stringsStringStrings(p1, p2, p3, p4) {
  // TODO
}
```

အလားတူပဲ — function တစ်ခုရဲ့ return type အတွက်:

```js twoslash
/**
 * @return {PromiseLike<string>}
 */
function ps() {}

/**
 * @returns {{ a: string, b: number }} - May use '@returns' as well as '@return'
 */
function ab() {}
```

### `@typedef`, `@callback`, and `@param` (@typedef, @callback နဲ့ @param tags များ)

`@typedef` နဲ့ complex types (ရှုပ်ထွေးသော types) တွေကို သတ်မှတ်နိုင်ပါတယ်။ `@param` မှာလည်း အလားတူ syntax တွေ အလုပ်လုပ်ပါတယ်။

```js twoslash
/**
 * @typedef {Object} SpecialType - creates a new type named 'SpecialType'
 * @property {string} prop1 - a string property of SpecialType
 * @property {number} prop2 - a number property of SpecialType
 * @property {number=} prop3 - an optional number property of SpecialType
 * @prop {number} [prop4] - an optional number property of SpecialType
 * @prop {number} [prop5=42] - an optional number property of SpecialType with default
 */

/** @type {SpecialType} */
var specialTypeObject;
specialTypeObject.prop3;
```

ပထမဆုံး line မှာ `object` ဒါမှမဟုတ် `Object` — ဘယ်ဟာကိုမဆို သုံးနိုင်ပါတယ်။

```js twoslash
/**
 * @typedef {object} SpecialType1 - creates a new type named 'SpecialType1'
 * @property {string} prop1 - a string property of SpecialType1
 * @property {number} prop2 - a number property of SpecialType1
 * @property {number=} prop3 - an optional number property of SpecialType1
 */

/** @type {SpecialType1} */
var specialTypeObject1;
```

`@param` က — တစ်ခါသုံး (one-off) type သတ်မှတ်ချက်တွေအတွက် အလားတူ syntax ကို ခွင့်ပြုပါတယ်။ Nested property names တွေက parameter ရဲ့ name နဲ့ ရှေ့ဆ (prefix) ထားရမယ်ဆိုတာ သတိပြုပါ:

```js twoslash
/**
 * @param {Object} options - The shape is the same as SpecialType above
 * @param {string} options.prop1
 * @param {number} options.prop2
 * @param {number=} options.prop3
 * @param {number} [options.prop4]
 * @param {number} [options.prop5=42]
 */
function special(options) {
  return (options.prop4 || 1001) + options.prop5;
}
```

`@callback` က `@typedef` နဲ့ ဆင်တူပေမယ့် — object type အစား function type တစ်ခုကို သတ်မှတ်ပါတယ်:

```js twoslash
/**
 * @callback Predicate
 * @param {string} data
 * @param {number} [index]
 * @returns {boolean}
 */

/** @type {Predicate} */
const ok = (s) => !(s.length % 2);
```

တကယ်တော့ ဒီ types တွေထဲက ဘယ်ဟာကိုမဆို — line တစ်ကြောင်းတည်းပါတဲ့ `@typedef` ထဲမှာ TypeScript syntax နဲ့ ကြေညာလို့ရပါတယ်:

```js
/** @typedef {{ prop1: string, prop2: string, prop3?: number }} SpecialType */
/** @typedef {(data: string, index?: number) => boolean} Predicate */
```

### `@template` (@template — generic type parameters ကြေညာခြင်း)

`@template` tag နဲ့ type parameters တွေကို ကြေညာနိုင်ပါတယ်။ ဒါက functions, classes ဒါမှမဟုတ် types တွေကို generic ဖြစ်အောင် လုပ်ပေးနိုင်ပါတယ်:

```js twoslash
/**
 * @template T
 * @param {T} x - A generic parameter that flows through to the return type
 * @returns {T}
 */
function id(x) {
  return x;
}

const a = id("string");
const b = id(123);
const c = id({});
```

Type parameters အများအပြားကို ကြေညာဖို့ — comma ခြားပြီး ဖြစ်ဖြစ် tags အများအပြား သုံးပြီး ဖြစ်ဖြစ် လုပ်နိုင်ပါတယ်:

```js
/**
 * @template T,U,V
 * @template W,X
 */
```

Type parameter name ရဲ့ ရှေ့မှာ type constraint (type ကန့်သတ်ချက်) တစ်ခုကိုလည်း သတ်မှတ်နိုင်ပါတယ်။ စာရင်းထဲက ပထမဆုံး type parameter တစ်ခုတည်းကိုပဲ constrain လုပ်လို့ရပါတယ်:

```js twoslash
/**
 * @template {string} K - K must be a string or string literal
 * @template {{ serious(): string }} Seriousalizable - must have a serious method
 * @param {K} key
 * @param {Seriousalizable} object
 */
function seriousalize(key, object) {
  // ????
}
```

နောက်ဆုံးအနေနဲ့ — type parameter တစ်ခုအတွက် default (ပုံမှန်တန်ဖိုး) တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်:

```js twoslash
/** @template [T=object] */
class Cache {
    /** @param {T} initial */
    constructor(initial) {
    }
}
let c = new Cache()
```

### `@satisfies` (@satisfies — type နဲ့ ကိုက်ညီမှု စစ်ဆေးခြင်း)

`@satisfies` က TypeScript ထဲက postfix [operator `satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html) ကို သုံးခွင့်ပေးပါတယ်။ Satisfies က — value တစ်ခုက type တစ်ခုကို implement (လိုက်နာ) လုပ်ကြောင်း ကြေညာဖို့ သုံးပြီး — value ရဲ့ type ကိုတော့ မထိခိုက်ပါဘူး။

```js twoslash
// @errors: 1360
// @ts-check
/**
 * @typedef {"hello world" | "Hello, world"} WelcomeMessage
 */

/** @satisfies {WelcomeMessage} */
const message = "hello world"
//     ^?

/** @satisfies {WelcomeMessage} */
const failingMessage = "Hello world!"

/** @type {WelcomeMessage} */
const messageUsingType = "hello world"
//     ^?
```

## Classes (Class များ)

Classes တွေကို ES6 classes အဖြစ် ကြေညာလို့ရပါတယ်။

```js twoslash
class C {
  /**
   * @param {number} data
   */
  constructor(data) {
    // property types can be inferred
    this.name = "foo";

    // or set explicitly
    /** @type {string | null} */
    this.title = null;

    // or simply annotated, if they're set elsewhere
    /** @type {number} */
    this.size;

    this.initialize(data); // Should error, initializer expects a string
  }
  /**
   * @param {string} s
   */
  initialize = function (s) {
    this.size = s.length;
  };
}

var c = new C(0);

// C should only be called with new, but
// because it is JavaScript, this is allowed and
// considered an 'any'.
var result = C(1);
```

သူတို့ကို constructor functions အဖြစ်လည်း ကြေညာနိုင်ပါတယ် — ဒီအတွက် [`@constructor`](https://www.typescriptlang.org/docs/handbook) ကို [`@this`](https://www.typescriptlang.org/docs/handbook) နဲ့ တွဲသုံးပါ။

### Property Modifiers (Property ပြင်ဆင်မှုများ)

<div id="jsdoc-property-modifiers"></div>

`@public`, `@private` နဲ့ `@protected` တွေက TypeScript ထဲက `public`, `private` နဲ့ `protected` တွေလို အတိအကျ အလုပ်လုပ်ပါတယ်:

```js twoslash
// @errors: 2341
// @ts-check

class Car {
  constructor() {
    /** @private */
    this.identifier = 100;
  }

  printIdentifier() {
    console.log(this.identifier);
  }
}

const c = new Car();
console.log(c.identifier);
```

- `@public` က အမြဲ implicit (သွယ်ဝိုက်) ဖြစ်နေပြီး ချန်လိုက်လို့ရပါတယ် — ဒါပေမယ့် property တစ်ခုကို ဘယ်ကနေမဆို ဝင်ရောက်လို့ရတယ်လို့ အဓိပ္ပါယ်ရပါတယ်။
- `@private` က — property တစ်ခုကို ပါဝင်တဲ့ (containing) class အတွင်းမှာပဲ သုံးလို့ရတယ်လို့ အဓိပ္ပါယ်ရပါတယ်။
- `@protected` က — property တစ်ခုကို ပါဝင်တဲ့ class နဲ့ ဆင်းသက်လာတဲ့ (derived) subclasses တွေ အားလုံးရဲ့ အတွင်းမှာပဲ သုံးလို့ရပြီး — ပါဝင်တဲ့ class ရဲ့ မတူညီတဲ့ instances တွေပေါ်မှာတော့ မသုံးနိုင်ဘူးလို့ အဓိပ္ပါယ်ရပါတယ်။

`@public`, `@private` နဲ့ `@protected` တွေက constructor functions တွေထဲမှာ အလုပ်မလုပ်ပါဘူး။

### `@readonly`

`@readonly` modifier က — property တစ်ခုကို initialization (ကနဦးတန်ဖိုး သတ်မှတ်ချိန်) အတွင်းမှာပဲ ရေးလို့ရအောင် သေချာ လုပ်စေပါတယ်။

```js twoslash
// @errors: 2540
// @ts-check

class Car {
  constructor() {
    /** @readonly */
    this.identifier = 100;
  }

  printIdentifier() {
    console.log(this.identifier);
  }
}

const c = new Car();
console.log(c.identifier);
```

### `@override`

`@override` က TypeScript ထဲမှာလိုပဲ အလုပ်လုပ်ပါတယ် — base class တစ်ခုကနေ override လုပ်တဲ့ methods တွေပေါ်မှာ သုံးပါ:

```js twoslash
export class C {
  m() { }
}
class D extends C {
  /** @override */
  m() { }
}
```

Overrides တွေကို စစ်ဆေးဖို့ tsconfig ထဲမှာ `noImplicitOverride: true` ကို သတ်မှတ်ပါ။

### `@extends`

JavaScript classes တွေက generic base class တစ်ခုကို extend လုပ်တဲ့အခါ — type argument တစ်ခု ပေးဖို့ JavaScript syntax မရှိပါဘူး။ `@extends` tag က ဒါကို ခွင့်ပြုပါတယ်:

```js twoslash
/**
 * @template T
 * @extends {Set<T>}
 */
class SortableSet extends Set {
  // ...
}
```

`@extends` က classes တွေနဲ့ပဲ အလုပ်လုပ်တယ်ဆိုတာ သတိပြုပါ။ လက်ရှိမှာ constructor function တစ်ခုက class တစ်ခုကို extend လုပ်ဖို့ နည်းလမ်း မရှိသေးပါဘူး။

### `@implements`

အလားတူပဲ — TypeScript interface တစ်ခုကို implement လုပ်ဖို့ JavaScript syntax မရှိပါဘူး။ `@implements` tag က TypeScript ထဲမှာလိုပဲ အလုပ်လုပ်ပါတယ်:

```js twoslash
/** @implements {Print} */
class TextBook {
  print() {
    // TODO
  }
}
```

### `@constructor`

Compiler က this-property assignments တွေကို အခြေခံပြီး constructor functions တွေကို infer လုပ်ပါတယ် — ဒါပေမယ့် `@constructor` tag တစ်ခု ထည့်ပေးရင် checking ပိုတင်းကျပ်ပြီး suggestions (အကြံပြုချက်များ) တွေလည်း ပိုကောင်းလာပါတယ်:

```js twoslash
// @checkJs
// @errors: 2345 2348
/**
 * @constructor
 * @param {number} data
 */
function C(data) {
  // property types can be inferred
  this.name = "foo";

  // or set explicitly
  /** @type {string | null} */
  this.title = null;

  // or simply annotated, if they're set elsewhere
  /** @type {number} */
  this.size;

  this.initialize(data);
}
/**
 * @param {string} s
 */
C.prototype.initialize = function (s) {
  this.size = s.length;
};

var c = new C(0);
c.size;

var result = C(1);
```

> မှတ်ချက်: Error messages တွေက — [JSConfig](/docs/typescript/tsconfig-json) နဲ့ [`checkJs`](https://www.typescriptlang.org/tsconfig) ဖွင့်ထားတဲ့ JS codebases တွေမှာပဲ ပေါ်လာပါတယ်။

`@constructor` နဲ့ဆိုရင် — constructor function `C` ရဲ့ အတွင်းမှာ `this` ကို check လုပ်ပြီး — `initialize` method အတွက် suggestions တွေ ရမှာ ဖြစ်သလို — number တစ်ခု ပို့လိုက်ရင်လည်း error ရပါလိမ့်မယ်။ `C` ကို construct လုပ်မယ့်အစား ခေါ်လိုက်ရင် — ကိုယ့် editor က warning တွေလည်း ပြနိုင်ပါတယ်။

ကံမကောင်းစွာပဲ — ဒါက ခေါ်လို့လည်းရတဲ့ (callable) constructor functions တွေက `@constructor` ကို သုံးလို့မရဘူးလို့ ဆိုလိုပါတယ်။

### `@this`

Compiler က — context (အခြေအနေ) တစ်ခုခု ရှိနေရင် `this` ရဲ့ type ကို အများအားဖြင့် ရှာဖွေတွက်ဆနိုင်ပါတယ်။ မရနိုင်တဲ့အခါ — `@this` နဲ့ `this` ရဲ့ type ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်နိုင်ပါတယ်:

```js twoslash
/**
 * @this {HTMLElement}
 * @param {*} e
 */
function callbackForLater(e) {
  this.clientHeight = parseInt(e); // should be fine!
}
```

## Documentation (Documentation tags များ)

### `@deprecated`

<div id="deprecated-comments"></div>

Function, method ဒါမှမဟုတ် property တစ်ခု deprecated (အသုံးမပြုတော့ဖို့ ရည်ရွယ်ထားသော) ဖြစ်နေရင် — `/** @deprecated */` JSDoc comment နဲ့ မှတ်သားပြီး သုံးစွဲသူတွေကို အသိပေးနိုင်ပါတယ်။ အဲဒီအချက်အလက်က completion lists တွေထဲမှာရော — editors တွေက အထူး ကိုင်တွယ်လို့ရတဲ့ suggestion diagnostic (အကြံပြုချက် ရောဂါရှာဖွေမှု) အနေနဲ့ပါ ပေါ်လာပါတယ်။ VS Code လို editor တစ်ခုမှာဆိုရင် — deprecated values တွေကို ~~ဒီလိုမျိုး~~ strike-through (စာကြောင်းကြား မျဉ်းကြောင်း) ပုံစံနဲ့ ပြလေ့ရှိပါတယ်။

```js twoslash
// @noErrors
/** @deprecated */
const apiV1 = {};
const apiV2 = {};

apiV;
// ^|


```

### `@see`

`@see` က program ထဲက တခြား names တွေဆီ link လုပ်ပေးပါတယ်:

```ts twoslash
type Box<T> = { t: T }
/** @see Box for implementation details */
type Boxify<T> = { [K in keyof T]: Box<T> };
```

Editor တစ်ချို့က `Box` ကို link အဖြစ် ပြောင်းပေးတာမို့ — အဲဒီကို သွားလို့၊ ပြန်လို့ လွယ်ကူပါတယ်။

### `@link`

`@link` က `@see` နဲ့ ဆင်တူပြီး — တခြား tags တွေရဲ့ အတွင်းမှာပါ သုံးလို့ရတာက ကွာခြားချက်ပါ:

```ts twoslash
type Box<T> = { t: T }
/** @returns A {@link Box} containing the parameter. */
function box<U>(u: U): Box<U> {
  return { t: u };
}
```

Property တစ်ခုကိုလည်း link လုပ်နိုင်ပါတယ်:

```ts twoslash 
type Pet = {
  name: string
  hello: () => string
}

/**
 * Note: you should implement the {@link Pet.hello} method of Pet.
 */
function hello(p: Pet) {
  p.hello()
}
```

ဒါမှမဟုတ် optional name (ရွေးချယ်နိုင်သော အမည်) တစ်ခုနဲ့:

```ts twoslash
type Pet = {
  name: string
  hello: () => string
}

/**
 * Note: you should implement the {@link Pet.hello | hello} method of Pet.
 */
function hello(p: Pet) {
  p.hello()
}
```

## Other (အခြားအရာများ)

### `@enum`

`@enum` tag က — members တွေ အားလုံး သတ်မှတ်ထားတဲ့ type တစ်ခုတည်း ဖြစ်တဲ့ object literal တစ်ခုကို ဖန်တီးခွင့်ပေးပါတယ်။ JavaScript ထဲက object literals အများစုနဲ့ မတူဘဲ — တခြား members တွေကို ခွင့်မပြုပါဘူး။ `@enum` က Google Closure ရဲ့ `@enum` tag နဲ့ လိုက်ဖက်ညီမှုအတွက် ရည်ရွယ်ထားပါတယ်။

```js twoslash
/** @enum {number} */
const JSDocState = {
  BeginningOfLine: 0,
  SawAsterisk: 1,
  SavingComments: 2,
};

JSDocState.SawAsterisk;
```

`@enum` က TypeScript ရဲ့ `enum` နဲ့ တော်တော် ကွဲပြားပြီး — အများကြီး ပိုရိုးရှင်းတယ်ဆိုတာ သတိပြုပါ။ ဒါပေမယ့် TypeScript ရဲ့ enums တွေနဲ့ မတူဘဲ — `@enum` က type မဆို ယူနိုင်ပါတယ်:

```js twoslash
/** @enum {function(number): number} */
const MathFuncs = {
  add1: (n) => n + 1,
  id: (n) => -n,
  sub1: (n) => n - 1,
};

MathFuncs.add1;
```

### `@author`

Item တစ်ခုရဲ့ author (ရေးသားသူ) ကို `@author` နဲ့ သတ်မှတ်နိုင်ပါတယ်:

```ts twoslash
/**
 * Welcome to awesome.ts
 * @author Ian Awesome <i.am.awesome@example.com>
 */
```

Email address ကို angle brackets (`<` `>`) နဲ့ ဝိုင်းထားဖို့ သတိရပါ။ မလုပ်ရင် — `@example` ကို tag အသစ်တစ်ခုအနေနဲ့ parse (ခွဲခြမ်းစိတ်ဖြာ) လုပ်သွားပါလိမ့်မယ်။

### Other supported patterns (အခြား ပံ့ပိုးထားသော patterns)

```js twoslash
// @types: react
class Foo {}
// ---cut---
var someObj = {
  /**
   * @param {string} param1 - JSDocs on property assignments work
   */
  x: function (param1) {},
};

/**
 * As do jsdocs on variable assignments
 * @return {Window}
 */
let someFunc = function () {};

/**
 * And class methods
 * @param {string} greeting The greeting to use
 */
Foo.prototype.sayHi = (greeting) => console.log("Hi!");

/**
 * And arrow function expressions
 * @param {number} x - A multiplier
 */
let myArrow = (x) => x * x;

/**
 * Which means it works for function components in JSX too
 * @param {{a: string, b: number}} props - Some param
 */
var fc = (props) => <div>{props.a.charAt(0)}</div>;

/**
 * A parameter can be a class constructor, using Google Closure syntax.
 *
 * @param {{new(...args: any[]): object}} C - The class to register
 */
function registerClass(C) {}

/**
 * @param {...string} p1 - A 'rest' arg (array) of strings. (treated as 'any')
 */
function fn10(p1) {}

/**
 * @param {...string} p1 - A 'rest' arg (array) of strings. (treated as 'any')
 */
function fn9(p1) {
  return p1.join();
}
```

### Unsupported patterns (မပံ့ပိုးထားသော patterns)

Object literal type တစ်ခုထဲက property type တစ်ခုပေါ်မှာ postfix equals (နောက်ကပ် `=`) က optional property တစ်ခုကို သတ်မှတ်ပေးတာ မဟုတ်ပါဘူး:

```js twoslash
/**
 * @type {{ a: string, b: number= }}
 */
var wrong;
/**
 * Use postfix question on the property name instead:
 * @type {{ a: string, b?: number }}
 */
var right;
```

Nullable types တွေက [`strictNullChecks`](https://www.typescriptlang.org/tsconfig) ဖွင့်ထားမှပဲ အဓိပ္ပါယ်ရှိပါတယ်:

```js twoslash
/**
 * @type {?number}
 * With strictNullChecks: true  -- number | null
 * With strictNullChecks: false -- number
 */
var nullable;
```

TypeScript မူရင်းပုံစံ syntax ကတော့ union type ပါ:

```js twoslash
/**
 * @type {number | null}
 * With strictNullChecks: true  -- number | null
 * With strictNullChecks: false -- number
 */
var unionNullable;
```

Non-nullable types တွေက အဓိပ္ပါယ် မရှိဘဲ — သူတို့ရဲ့ မူရင်း type အတိုင်းပဲ သဘောထားခံရပါတယ်:

```js twoslash
/**
 * @type {!number}
 * Just has type number
 */
var normal;
```

JSDoc ရဲ့ type system နဲ့ မတူဘဲ — TypeScript က types တွေကို null ပါဝင်တဲ့ type ဒါမှမဟုတ် မပါဝင်တဲ့ type အဖြစ်ပဲ မှတ်သားခွင့်ပြုပါတယ်။ ထင်ရှားတဲ့ non-nullability (null မဟုတ်ကြောင်း သတ်မှတ်ချက်) ဆိုတာ မရှိပါဘူး -- strictNullChecks ဖွင့်ထားရင် `number` က nullable မဟုတ်ပါဘူး။ ပိတ်ထားရင်တော့ — `number` က nullable ဖြစ်ပါတယ်။

### Unsupported tags (မပံ့ပိုးထားသော tags)

TypeScript က မပံ့ပိုးထားတဲ့ JSDoc tags တွေကို လျစ်လျူရှုပါတယ်။ အောက်ပါ tags တွေကို ပံ့ပိုးဖို့အတွက် open issues (ဖွင့်ထားသော ကိစ္စများ) ရှိနေပါတယ်:

- `@memberof` ([issue #7237](https://github.com/Microsoft/TypeScript/issues/7237))
- `@yields` ([issue #23857](https://github.com/Microsoft/TypeScript/issues/23857))
- `@member` ([issue #56674](https://github.com/microsoft/TypeScript/issues/56674))

### Legacy type synonyms (ရှေးဟောင်း type synonyms များ)

Common types တစ်ချို့ကို — JavaScript code အဟောင်းတွေနဲ့ လိုက်ဖက်ညီမှုအတွက် aliases (အမည်ပြောင်းများ) ပေးထားပါတယ်။ Aliases တစ်ချို့က ရှိပြီးသား types တွေနဲ့ တူညီပေမယ့် — အများစုကိုတော့ ရံဖန်ရံခါပဲ သုံးကြပါတယ်။ ဥပမာ — `String` ကို `string` ရဲ့ alias အဖြစ် သဘောထားပါတယ်။ `String` က TypeScript မှာ type တစ်ခု ဖြစ်ပေမယ့် — JSDoc အဟောင်းတွေမှာ `string` ကို ဆိုလိုဖို့ မကြာခဏ သုံးလေ့ရှိပါတယ်။ ဒါ့အပြင် TypeScript မှာ — primitive types တွေရဲ့ စာလုံးကြီးနဲ့ ရေးတဲ့ ဗားရှင်းတွေက wrapper types (ထုပ်ပိုး type များ) ဖြစ်ပြီး — သုံးမိရင် အမြဲလိုလို အမှားတစ်ခုပါ။ ဒါကြောင့် compiler က — JSDoc အဟောင်းတွေထဲက အသုံးပြုမှုကို အခြေခံပြီး ဒီ types တွေကို synonyms အဖြစ် သဘောထားပါတယ်:

- `String -> string`
- `Number -> number`
- `Boolean -> boolean`
- `Void -> void`
- `Undefined -> undefined`
- `Null -> null`
- `function -> Function`
- `array -> Array<any>`
- `promise -> Promise<any>`
- `Object -> any`
- `object -> any`

နောက်ဆုံး aliases လေးခုက `noImplicitAny: true` ဖြစ်နေရင် ပိတ်သွားပါတယ်:

- `object` နဲ့ `Object` တွေက built-in types တွေပါ — `Object` ကို ရံဖန်ရံခါပဲ သုံးပေမယ့် ပေါ့။
- `array` နဲ့ `promise` တွေက built-in မဟုတ်ပေမယ့် — ကိုယ့် program ထဲက တစ်နေရာရာမှာ ကြေညာထားနိုင်ပါတယ်။
