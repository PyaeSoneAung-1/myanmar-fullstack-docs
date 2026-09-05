---
title: "Type Checking JavaScript Files (JavaScript Files များကို Type Check လုပ်ခြင်း)"
description: "`.ts` files တွေနဲ့ ယှဉ်ရင် `.js` files တွေမှာ TypeScript က check လုပ်ပုံ ကွာခြားချက်များ — class body assignments ကနေ property inference, constructor functions, CommonJS modules, namespaces, open-ended object literals, optional parameters စတဲ့ JS-specific behaviors တွေ"
order: 46
source: "https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html"
status: translated
updated: 2026-09-05
---

`.ts` files တွေနဲ့ ယှဉ်ရင် — `.js` files တွေမှာ checking (type စစ်ဆေးခြင်း) ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ ထင်ရှားတဲ့ ကွာခြားချက်တစ်ချို့ကို ဒီမှာ ဖော်ပြထားပါတယ်။

## Properties are inferred from assignments in class bodies (Class body တွင်းက assignments တွေကနေ Properties တွေကို ခန့်မှန်းခြင်း)

ES2015 မှာ classes တွေပေါ်မှာ properties တွေကို ကြေညာ (declare) လုပ်ဖို့ နည်းလမ်း မပါပါဘူး။ Properties တွေကို object literals တွေလိုပဲ — dynamic ပုံစံနဲ့ assign (သတ်မှတ်) လုပ်ပါတယ်။

`.js` file တစ်ခုထဲမှာ — compiler က class body (class ကိုယ်ထည်) တွင်းက property assignments တွေကနေ properties တွေကို infer (ခန့်မှန်း) လုပ်ပါတယ်။ Property တစ်ခုရဲ့ type က — constructor ထဲမှာ သတ်မှတ်ပေးထားတဲ့ type ပါ။ ဒါပေမယ့် constructor ထဲမှာ သတ်မှတ်မထားဘူး၊ ဒါမှမဟုတ် constructor ထဲက type က undefined ဒါမှမဟုတ် null ဖြစ်နေရင်တော့ မဟုတ်ပါဘူး။ အဲဒီလိုအခါမျိုးမှာ — type က အဲဒီ assignments တွေထဲက right-hand values (ညာဘက်တန်ဖိုးများ) အားလုံးရဲ့ types တွေရဲ့ union (ပေါင်းစု) ဖြစ်ပါတယ်။ Constructor ထဲမှာ သတ်မှတ်ထားတဲ့ properties တွေက အမြဲ ရှိနေတယ်လို့ ယူဆပြီး — methods, getters ဒါမှမဟုတ် setters တွေထဲမှာပဲ သတ်မှတ်ထားတဲ့ဟာတွေကတော့ optional (မဖြစ်မနေ မလိုအပ်) အဖြစ် သတ်မှတ်ပါတယ်။

```js twoslash
// @checkJs
// @errors: 2322
class C {
  constructor() {
    this.constructorOnly = 0;
    this.constructorUnknown = undefined;
  }
  method() {
    this.constructorOnly = false;
    this.constructorUnknown = "plunkbat"; // ok, constructorUnknown is string | undefined
    this.methodOnly = "ok"; // ok, but methodOnly could also be undefined
  }
  method2() {
    this.methodOnly = true; // also, ok, methodOnly's type is string | boolean | undefined
  }
}
```

Properties တွေကို class body ထဲမှာ ဘယ်တော့မှ သတ်မှတ်မထားဘူးဆိုရင် — သူတို့ကို unknown (မသိရသေး) အဖြစ် သတ်မှတ်ပါတယ်။ ကိုယ့် class မှာ ဖတ်ရုံပဲ လုပ်တဲ့ properties တွေ ရှိတယ်ဆိုရင် — constructor ထဲမှာ declaration တစ်ခု ထည့်ပြီး JSDoc နဲ့ annotate (မှတ်ချက်တပ်) လုပ်ကာ type ကို သတ်မှတ်ပေးပါ။ နောက်မှ initialize (ကနဦးတန်ဖိုး သတ်မှတ်) လုပ်မယ်ဆိုရင် — value တစ်ခု ပေးစရာတောင် မလိုပါဘူး:

```js twoslash
// @checkJs
// @errors: 2322
class C {
  constructor() {
    /** @type {number | undefined} */
    this.prop = undefined;
    /** @type {number | undefined} */
    this.count;
  }
}

let c = new C();
c.prop = 0; // OK
c.count = "string";
```

## Constructor functions are equivalent to classes (Constructor functions တွေက classes တွေနဲ့ ညီမျှခြင်း)

ES2015 မတိုင်ခင် — JavaScript က classes အစား constructor functions တွေကို သုံးပါတယ်။ Compiler က ဒီ pattern ကို ပံ့ပိုးပြီး — constructor functions တွေကို ES2015 classes တွေနဲ့ ညီမျှတဲ့အရာအဖြစ် နားလည်ပါတယ်။ အပေါ်မှာ ဖော်ပြခဲ့တဲ့ property inference စည်းမျဉ်းတွေက — အတိအကျ တူညီတဲ့ ပုံစံအတိုင်း အလုပ်လုပ်ပါတယ်။

```js twoslash
// @checkJs
// @errors: 2683 2322
function C() {
  this.constructorOnly = 0;
  this.constructorUnknown = undefined;
}
C.prototype.method = function () {
  this.constructorOnly = false;
  this.constructorUnknown = "plunkbat"; // OK, the type is string | undefined
};
```

## CommonJS modules are supported (CommonJS modules တွေကို ပံ့ပိုးထားခြင်း)

`.js` file တစ်ခုထဲမှာ — TypeScript က CommonJS module format ကို နားလည်ပါတယ်။ `exports` နဲ့ `module.exports` တွေဆီ လုပ်တဲ့ assignments တွေကို export declarations (export ကြေညာချက်များ) အဖြစ် အသိအမှတ် ပြုပါတယ်။ အလားတူပဲ — `require` function calls တွေကို module imports အဖြစ် အသိအမှတ် ပြုပါတယ်။ ဥပမာ:

```js
// same as `import module "fs"`
const fs = require("fs");

// same as `export function readFile`
module.exports.readFile = function (f) {
  return fs.readFileSync(f);
};
```

JavaScript ရဲ့ module support က TypeScript ရဲ့ module support ထက် syntax ပိုင်းမှာ အများကြီး ပိုပြီး လိုက်လျောညီထွေ ရှိပါတယ်။ Assignments နဲ့ declarations တွေရဲ့ ပေါင်းစပ်မှု အများစုကို ပံ့ပိုးပါတယ်။

## Classes, functions, and object literals are namespaces (Classes, functions နဲ့ object literals တွေက namespaces များ)

`.js` files တွေမှာ — classes တွေက namespaces တွေပါ။ ဒါကို classes တွေ nest (အသိုက်အမြုံ) လုပ်ဖို့ သုံးနိုင်ပါတယ် — ဥပမာ:

```js twoslash
class C {}
C.D = class {};
```

ပြီးတော့ pre-ES2015 code တွေအတွက်ဆိုရင် — static methods တွေကို အတုယူ ဖန်တီးဖို့ သုံးနိုင်ပါတယ်:

```js twoslash
function Outer() {
  this.y = 2;
}

Outer.Inner = function () {
  this.yy = 2;
};

Outer.Inner();
```

ရိုးရှင်းတဲ့ namespaces တွေ ဖန်တီးဖို့လည်း သုံးနိုင်ပါတယ်:

```js twoslash
var ns = {};
ns.C = class {};
ns.func = function () {};

ns;
```

တခြား variant (ပုံစံကွဲ) တွေကိုလည်း ခွင့်ပြုပါတယ်:

```js twoslash
// IIFE
var ns = (function (n) {
  return n || {};
})();
ns.CONST = 1;

// defaulting to global
var assign =
  assign ||
  function () {
    // code goes here
  };
assign.extra = 1;
```

## Object literals are open-ended (Object literals တွေက open-ended ဖြစ်ခြင်း)

`.ts` file တစ်ခုထဲမှာ — variable declaration တစ်ခုကို initialize လုပ်တဲ့ object literal က — သူ့ရဲ့ type ကို အဲဒီ declaration ဆီ ပေးပါတယ်။ မူရင်း literal ထဲမှာ သတ်မှတ်မထားတဲ့ members အသစ်တွေကို ထပ်ထည့်လို့ မရပါဘူး။ `.js` file တစ်ခုမှာတော့ — ဒီစည်းမျဉ်းက လျော့ပေါ့ပါတယ်: object literals တွေမှာ open-ended type (index signature) ရှိတာမို့ — မူလက သတ်မှတ်မထားတဲ့ properties တွေကိုတောင် ထပ်ထည့်လို့ရပြီး ရှာဖွေကြည့်လို့လည်း ရပါတယ်။ ဥပမာ:

```js twoslash
var obj = { a: 1 };
obj.b = 2; // Allowed
```

Object literals တွေက `[x:string]: any` ဆိုတဲ့ index signature ရှိသလို ပြုမူတာမို့ — closed objects (ပိတ်ထားတဲ့ object များ) အစား open maps (ပွင့်နေတဲ့ map များ) အနေနဲ့ သဘောထားလို့ ရပါတယ်။

တခြား အထူး JS checking behaviors တွေလိုပဲ — ဒီအပြုအမူကိုလည်း variable အတွက် JSDoc type တစ်ခု သတ်မှတ်ပေးခြင်းအားဖြင့် ပြောင်းလဲနိုင်ပါတယ်။ ဥပမာ:

```js twoslash
// @checkJs
// @errors: 2339
/** @type {{a: number}} */
var obj = { a: 1 };
obj.b = 2;
```

## null, undefined, and empty array initializers are of type any or any[] (null, undefined နဲ့ empty array initializers တွေရဲ့ type က any သို့မဟုတ် any[])

null ဒါမှမဟုတ် undefined နဲ့ initialize လုပ်ထားတဲ့ variable, parameter ဒါမှမဟုတ် property တိုင်းက — strict null checks ဖွင့်ထားရင်တောင် — type `any` ရှိပါလိမ့်မယ်။ `[]` နဲ့ initialize လုပ်ထားတဲ့ variable, parameter ဒါမှမဟုတ် property တိုင်းကလည်း — strict null checks ဖွင့်ထားရင်တောင် — type `any[]` ရှိပါလိမ့်မယ်။ တစ်ခုတည်းသော ခြွင်းချက်ကတော့ — အပေါ်မှာ ဖော်ပြခဲ့သလို initializers အများအပြား ရှိတဲ့ properties တွေပါ။

```js twoslash
function Foo(i = null) {
  if (!i) i = 1;
  var j = undefined;
  j = 2;
  this.l = [];
}

var foo = new Foo();
foo.l.push(foo.i);
foo.l.push("end");
```

## Function parameters are optional by default (Function parameters တွေက default အားဖြင့် optional)

Pre-ES2015 JavaScript မှာ parameters တွေရဲ့ optional ဖြစ်မှုကို သတ်မှတ်ဖို့ နည်းလမ်း မရှိတာမို့ — `.js` file ထဲက function parameters တွေ အားလုံးကို optional အဖြစ် သတ်မှတ်ပါတယ်။ ကြေညာထားတဲ့ parameters အရေအတွက်ထက် arguments နည်းနည်းနဲ့ ခေါ်တာကို ခွင့်ပြုပါတယ်။

Arguments တွေ များလွန်းအောင် function တစ်ခုကို ခေါ်တာက error တစ်ခု ဖြစ်တယ်ဆိုတာ သတိပြုဖို့ အရေးကြီးပါတယ်။

ဥပမာ:

```js twoslash
// @checkJs
// @strict: false
// @errors: 7006 7006 2554
function bar(a, b) {
  console.log(a + " " + b);
}

bar(1); // OK, second argument considered optional
bar(1, 2);
bar(1, 2, 3); // Error, too many arguments
```

JSDoc နဲ့ annotate လုပ်ထားတဲ့ functions တွေကတော့ ဒီစည်းမျဉ်းကနေ ဖယ်ထုတ်ထားပါတယ်။ Optional ဖြစ်မှုကို ဖော်ပြဖို့ — JSDoc ရဲ့ optional parameter syntax (`[` `]`) ကို သုံးပါ။ ဥပမာ:

```js twoslash
/**
 * @param {string} [somebody] - Somebody's name.
 */
function sayHello(somebody) {
  if (!somebody) {
    somebody = "John Doe";
  }
  console.log("Hello " + somebody);
}

sayHello();
```

## Var-args parameter declaration inferred from use of `arguments` (`arguments` သုံးမှုကနေ Var-args parameter declaration ကို ခန့်မှန်းခြင်း)

Body ထဲမှာ `arguments` object ကို ရည်ညွှန်းသုံးထားတဲ့ function တစ်ခုကို — var-arg parameter (ဆိုလိုတာက `(...arg: any[]) => any`) ရှိတယ်လို့ implicit ပုံစံနဲ့ သတ်မှတ်ပါတယ်။ Arguments တွေရဲ့ type ကို သတ်မှတ်ဖို့ — JSDoc ရဲ့ var-arg syntax ကို သုံးပါ။

```js twoslash
/** @param {...number} args */
function sum(/* numbers */) {
  var total = 0;
  for (var i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
```

## Unspecified type parameters default to `any` (သတ်မှတ်မထားတဲ့ type parameters တွေက `any` ဆီ default ဖြစ်ခြင်း)

JavaScript မှာ generic type parameters တွေကို သတ်မှတ်ဖို့ သဘာဝကျတဲ့ syntax မရှိတာမို့ — သတ်မှတ်မထားတဲ့ type parameter တစ်ခုက `any` ဆီ default (ပုံမှန်) ဖြစ်သွားပါတယ်။

### In extends clause (extends clause ထဲမှာ)

ဥပမာ — `React.Component` ကို type parameters နှစ်ခု — `Props` နဲ့ `State` — ရှိတဲ့အရာအဖြစ် သတ်မှတ်ထားပါတယ်။ `.js` file တစ်ခုမှာ — extends clause ထဲမှာ ဒါတွေကို သတ်မှတ်ဖို့ တရားဝင် (legal) နည်းလမ်း မရှိပါဘူး။ Default အနေနဲ့ type arguments တွေက `any` ဖြစ်ပါလိမ့်မယ်:

```js
import { Component } from "react";

class MyComponent extends Component {
  render() {
    this.props.b; // Allowed, since this.props is of type any
  }
}
```

Types တွေကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ဖို့ — JSDoc `@augments` ကို သုံးပါ။ ဥပမာ:

```js
import { Component } from "react";

/**
 * @augments {Component<{a: number}, State>}
 */
class MyComponent extends Component {
  render() {
    this.props.b; // Error: b does not exist on {a:number}
  }
}
```

### In JSDoc references (JSDoc references တွေထဲမှာ)

JSDoc ထဲမှာ သတ်မှတ်မထားတဲ့ type argument တစ်ခုက `any` ဆီ default ဖြစ်သွားပါတယ်:

```js twoslash
/** @type{Array} */
var x = [];

x.push(1); // OK
x.push("string"); // OK, x is of type Array<any>

/** @type{Array.<number>} */
var y = [];

y.push(1); // OK
y.push("string"); // Error, string is not assignable to number
```

### In function calls (Function calls တွေထဲမှာ)

Generic function တစ်ခုကို ခေါ်တဲ့အခါ — arguments တွေကို သုံးပြီး type parameters တွေကို infer လုပ်ပါတယ်။ တစ်ခါတလေ — အဓိကအားဖြင့် inference sources (ခန့်မှန်းရန် အရင်းအမြစ်များ) မရှိတာကြောင့် — ဒီလုပ်ငန်းစဉ်က type တစ်ခုမှ မရအောင် ဖြစ်တတ်ပါတယ်။ အဲဒီလိုအခါမျိုးမှာ type parameters တွေက `any` ဆီ default ဖြစ်သွားပါတယ်။ ဥပမာ:

```js
var p = new Promise((resolve, reject) => {
  reject();
});

p; // Promise<any>;
```

JSDoc မှာ ရနိုင်တဲ့ features တွေ အားလုံးကို လေ့လာဖို့ — [reference](/docs/typescript/jsdoc-reference) ကို ကြည့်ပါ။
