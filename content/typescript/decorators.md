---
title: "Decorators (Decorator များ)"
description: "Classes နဲ့ class members တွေကို annotate လုပ်ပြီး ပြုပြင်ဖို့ သုံးတဲ့ decorators — factories, composition, evaluation order, class/method/accessor/property/parameter decorators နဲ့ experimental metadata အကြောင်း"
order: 54
source: "https://www.typescriptlang.org/docs/handbook/decorators.html"
status: translated
updated: 2026-09-05
---

> မှတ်ချက်&nbsp; ဒီ document က experimental (စမ်းသပ်ဆဲ) stage 2 decorators implementation ကို ရည်ညွှန်းထားပါတယ် — Stage 3 decorator support ကိုတော့ Typescript 5.0 ကစပြီး ရနိုင်ပါပြီ။
> ကြည့်ရန်: [Decorators in Typescript 5.0](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators)

## Introduction (နိဒါန်း)

TypeScript နဲ့ ES6 တွေမှာ Classes တွေ စတင် မိတ်ဆက်လာတာနဲ့အမျှ — classes တွေနဲ့ class members တွေကို annotate (မှတ်စုတပ်ခြင်း) လုပ်ဖို့ ဒါမှမဟုတ် ပြုပြင်မွမ်းမံဖို့ — နောက်ထပ် features တွေ လိုအပ်တဲ့ အခြေအနေတချို့ ပေါ်ပေါက်လာပါတယ်။ Decorators တွေက class declarations တွေနဲ့ members တွေအတွက် — annotations တွေရော meta-programming syntax (program တွေကို ရေးသားတဲ့ program ပုံစံ syntax) ရော နှစ်မျိုးလုံး ထည့်နိုင်တဲ့ နည်းလမ်းတစ်ခုကို ပေးပါတယ်။

> ထပ်ဆင့် လေ့လာရန် (stage 2): [A Complete Guide to TypeScript Decorators](https://saul-mirone.github.io/a-complete-guide-to-typescript-decorator/)

Decorators တွေအတွက် experimental support ကို ဖွင့်ဖို့ဆိုရင် — [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig) compiler option ကို command line မှာ ဖြစ်ဖြစ် — သင့် `tsconfig.json` ထဲမှာ ဖြစ်ဖြစ် ဖွင့်ထားဖို့ လိုပါတယ်:

**Command Line**:

```shell
tsc --target ES5 --experimentalDecorators
```

**tsconfig.json**:

```json tsconfig
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

## Decorators (Decorators များ)

_Decorator_ ဆိုတာ — [class declaration](https://www.typescriptlang.org/docs/handbook) တစ်ခု၊ [method](https://www.typescriptlang.org/docs/handbook) တစ်ခု၊ [accessor](https://www.typescriptlang.org/docs/handbook) တစ်ခု၊ [property](https://www.typescriptlang.org/docs/handbook) တစ်ခု ဒါမှမဟုတ် [parameter](https://www.typescriptlang.org/docs/handbook) တစ်ခုပေါ်မှာ တွဲဆက်လို့ရတဲ့ အထူး declaration အမျိုးအစားတစ်ခုပါ။ Decorators တွေက `@expression` ဆိုတဲ့ ပုံစံကို သုံးပြီး — `expression` က — decorate လုပ်ခံရတဲ့ declaration အကြောင်း အချက်အလက်တွေနဲ့အတူ runtime မှာ ခေါ်ယူခံရမယ့် function တစ်ခုအဖြစ် အကဲဖြတ်လို့ ရရမှာ ဖြစ်ပါတယ်။

ဥပမာ — `@sealed` ဆိုတဲ့ decorator အတွက် `sealed` function ကို ဒီလို ရေးနိုင်ပါတယ်:

```ts
function sealed(target) {
  // do something with 'target' ...
}
```

## Decorator Factories (Decorator Factories များ)

Decorator တစ်ခုကို declaration တစ်ခုပေါ်မှာ ဘယ်လို အသုံးချမလဲဆိုတာကို စိတ်ကြိုက် ပြင်ဆင်ချင်ရင် — decorator factory တစ်ခုကို ရေးနိုင်ပါတယ်။ _Decorator Factory_ ဆိုတာ — runtime မှာ decorator က ခေါ်ယူမယ့် expression တစ်ခုကို return လုပ်ပေးတဲ့ function တစ်ခုပဲ ဖြစ်ပါတယ်။

Decorator factory တစ်ခုကို ဒီပုံစံအတိုင်း ရေးနိုင်ပါတယ်:

```ts
function color(value: string) {
  // this is the decorator factory, it sets up
  // the returned decorator function
  return function (target) {
    // this is the decorator
    // do something with 'target' and 'value'...
  };
}
```

## Decorator Composition (Decorator Composition များ)

Declaration တစ်ခုပေါ်မှာ decorator အများအပြားကို အသုံးချနိုင်ပါတယ် — ဥပမာ — line တစ်ကြောင်းတည်းပေါ်မှာ:

```ts twoslash
// @experimentalDecorators
// @noErrors
function f() {}
function g() {}
// ---cut---
@f @g x
```

Line အများအပြားပေါ်မှာဆိုရင်:

```ts twoslash
// @experimentalDecorators
// @noErrors
function f() {}
function g() {}
// ---cut---
@f
@g
x
```

Decorator အများအပြားကို declaration တစ်ခုတည်းပေါ်မှာ အသုံးချတဲ့အခါ — သူတို့ရဲ့ evaluation (အကဲဖြတ်ပုံ) က [သင်္ချာမှာ function composition](https://wikipedia.org/wiki/Function_composition) နဲ့ ဆင်တူပါတယ်။ ဒီ model မှာ — function _f_ နဲ့ _g_ တွေကို ပေါင်းစပ်တဲ့အခါ — ရလာတဲ့ composite (_f_ ∘ _g_)(_x_) က _f_(_g_(_x_)) နဲ့ ညီမျှပါတယ်။

ဒါကြောင့် — TypeScript မှာ declaration တစ်ခုတည်းပေါ်က decorator အများအပြားကို အကဲဖြတ်တဲ့အခါ — အောက်ပါ အဆင့်တွေ လုပ်ဆောင်ပါတယ်:

1. Decorator တစ်ခုချင်းစီရဲ့ expressions တွေကို အပေါ်ကနေ အောက်ကို အစဉ်လိုက် အကဲဖြတ်ပါတယ်။
2. ပြီးတော့ ရလာတဲ့ results တွေကို အောက်ကနေ အပေါ်ကို functions တွေအနေနဲ့ ခေါ်ယူပါတယ်။

[decorator factories](https://www.typescriptlang.org/docs/handbook) တွေကို သုံးမယ်ဆိုရင် — ဒီ evaluation order (အကဲဖြတ် အစီအစဉ်) ကို အောက်ပါ ဥပမာနဲ့ လေ့လာလို့ ရပါတယ်:

```ts twoslash
// @experimentalDecorators
function first() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called");
  };
}

class ExampleClass {
  @first()
  @second()
  method() {}
}
```

အဲဒါက console ပေါ်မှာ ဒီ output ကို ရိုက်ထုတ်ပေးမှာပါ:

```shell
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
```

## Decorator Evaluation (Decorator Evaluation လုပ်ခြင်း)

Class တစ်ခုအတွင်းက declaration အမျိုးမျိုးပေါ်မှာ decorators တွေကို အသုံးချတဲ့အခါ — သေချာသတ်မှတ်ထားတဲ့ အစီအစဉ်တစ်ခု ရှိပါတယ်:

1. Instance member တစ်ခုချင်းစီအတွက် — _Parameter Decorators_ တွေ၊ ပြီးတော့ _Method_, _Accessor_, ဒါမှမဟုတ် _Property Decorators_ တွေကို အသုံးချပါတယ်။
2. Static member တစ်ခုချင်းစီအတွက် — _Parameter Decorators_ တွေ၊ ပြီးတော့ _Method_, _Accessor_, ဒါမှမဟုတ် _Property Decorators_ တွေကို အသုံးချပါတယ်။
3. Constructor အတွက် _Parameter Decorators_ တွေကို အသုံးချပါတယ်။
4. Class အတွက် _Class Decorators_ တွေကို အသုံးချပါတယ်။

## Class Decorators (Class Decorators များ)

_Class Decorator_ တစ်ခုကို class declaration တစ်ခုရဲ့ ရှေ့မှာ တန်းပြီး ကြေညာပါတယ်။ Class decorator ကို class ရဲ့ constructor ပေါ်မှာ အသုံးချပြီး — class definition တစ်ခုကို လေ့လာဖို့၊ ပြုပြင်ဖို့ ဒါမှမဟုတ် အစားထိုးဖို့ သုံးနိုင်ပါတယ်။ Class decorator တစ်ခုကို declaration file တစ်ခုထဲမှာ ဒါမှမဟုတ် — တခြား ambient context (ပတ်ဝန်းကျင် အခြေအနေ) တစ်ခုခုမှာ (`declare` class တစ်ခုပေါ်မှာ လိုမျိုး) — သုံးလို့ မရပါဘူး။

Class decorator ရဲ့ expression ကို runtime မှာ function တစ်ခုအနေနဲ့ ခေါ်ယူပြီး — decorate လုပ်ခံရတဲ့ class ရဲ့ constructor ကိုပဲ တစ်ခုတည်းသော argument အဖြစ် လက်ခံပါတယ်။

Class decorator က value တစ်ခု return လုပ်ရင် — ပေးလိုက်တဲ့ constructor function နဲ့ class declaration ကို အစားထိုးလိုက်ပါလိမ့်မယ်။

> မှတ်ချက်&nbsp; Constructor function အသစ်တစ်ခုကို return လုပ်ဖို့ ရွေးချယ်မယ်ဆိုရင် — မူရင်း prototype ကို ထိန်းသိမ်းထားဖို့ သေချာ ဂရုစိုက်ရပါမယ်။
> Runtime မှာ decorators တွေကို အသုံးချပေးတဲ့ logic က ဒါကို သင့်အတွက် **လုပ်ပေးမှာ မဟုတ်ပါဘူး**။

အောက်ပါဟာက — `BugReport` class တစ်ခုပေါ်မှာ အသုံးချထားတဲ့ class decorator (`@sealed`) ရဲ့ ဥပမာတစ်ခုပါ:

```ts twoslash
// @experimentalDecorators
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
// ---cut---
@sealed
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}
```

`@sealed` decorator ကို အောက်ပါ function declaration နဲ့ သတ်မှတ်နိုင်ပါတယ်:

```ts
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
```

`@sealed` ကို run လုပ်တဲ့အခါ — constructor ရော ၎င်းရဲ့ prototype ရော နှစ်ခုလုံးကို seal (တံဆိပ်ခတ်) လုပ်ပြီး — ဒါကြောင့် — runtime မှာ `BugReport.prototype` ကို ဝင်ရောက်ခြင်း ဒါမှမဟုတ် `BugReport` ပေါ်မှာကိုယ်တိုင် properties တွေ သတ်မှတ်ခြင်းအားဖြင့် — ဒီ class ကို နောက်ထပ် လုပ်ဆောင်ချက်တွေ ထပ်ထည့်တာ ဒါမှမဟုတ် ဖယ်ရှားတာတွေ မဖြစ်အောင် တားဆီးပေးပါတယ် (ES2015 classes တွေက တကယ်တော့ prototype-based constructor functions တွေရဲ့ syntactic sugar (ရေးရလွယ်ကူအောင် လုပ်ထားတဲ့ syntax) သက်သက်ပါ)။ ဒီ decorator က `BugReport` ကို sub-classing (ဆင့်ပွား class ဆောက်ခြင်း) လုပ်တာကိုတော့ **တားဆီးမှာ မဟုတ်ပါဘူး**။

နောက်တစ်ခုက — new defaults (ပုံမှန် တန်ဖိုးအသစ်များ) သတ်မှတ်ဖို့ constructor ကို override လုပ်ပုံ ဥပမာတစ်ခုပါ။

```ts twoslash
// @errors: 2339
// @experimentalDecorators
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    reportingURL = "http://www...";
  };
}

@reportableClassDecorator
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

const bug = new BugReport("Needs dark mode");
console.log(bug.title); // Prints "Needs dark mode"
console.log(bug.type); // Prints "report"

// Note that the decorator _does not_ change the TypeScript type
// and so the new property `reportingURL` is not known
// to the type system:
bug.reportingURL;
```

## Method Decorators (Method Decorators များ)

_Method Decorator_ တစ်ခုကို method declaration တစ်ခုရဲ့ ရှေ့မှာ တန်းပြီး ကြေညာပါတယ်။ Decorator ကို method ရဲ့ _Property Descriptor_ (property ရဲ့ ဂုဏ်သတ္တိ ဖော်ပြချက်) ပေါ်မှာ အသုံးချပြီး — method definition တစ်ခုကို လေ့လာဖို့၊ ပြုပြင်ဖို့ ဒါမှမဟုတ် အစားထိုးဖို့ သုံးနိုင်ပါတယ်။ Method decorator တစ်ခုကို declaration file တစ်ခုထဲမှာ၊ overload တစ်ခုပေါ်မှာ ဒါမှမဟုတ် — တခြား ambient context တစ်ခုခုမှာ (`declare` class တစ်ခုထဲမှာ လိုမျိုး) — သုံးလို့ မရပါဘူး။

Method decorator ရဲ့ expression ကို runtime မှာ function တစ်ခုအနေနဲ့ ခေါ်ယူပြီး — အောက်ပါ argument သုံးခုကို လက်ခံပါတယ်:

1. Static member တစ်ခုအတွက်ဆိုရင် class ရဲ့ constructor function — instance member တစ်ခုအတွက်ဆိုရင် class ရဲ့ prototype။
2. Member ရဲ့ နာမည်။
3. Member ရဲ့ _Property Descriptor_။

> မှတ်ချက်&emsp; သင့် script target က `ES5` ထက် နိမ့်နေရင် — _Property Descriptor_ က `undefined` ဖြစ်နေပါလိမ့်မယ်။

Method decorator က value တစ်ခု return လုပ်ရင် — အဲဒါကို method ရဲ့ _Property Descriptor_ အဖြစ် သုံးပါလိမ့်မယ်။

> မှတ်ချက်&emsp; သင့် script target က `ES5` ထက် နိမ့်နေရင် — return value ကို လျစ်လျူရှုပါတယ်။

အောက်ပါဟာက — `Greeter` class ပေါ်က method တစ်ခုမှာ အသုံးချထားတဲ့ method decorator (`@enumerable`) ရဲ့ ဥပမာတစ်ခုပါ:

```ts twoslash
// @experimentalDecorators
function enumerable(value: boolean) {
  return function (target: any,propertyKey: string,descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}
// ---cut---
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

`@enumerable` decorator ကို အောက်ပါ function declaration နဲ့ သတ်မှတ်နိုင်ပါတယ်:

```ts twoslash
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}
```

ဒီမှာ `@enumerable(false)` decorator က [decorator factory](https://www.typescriptlang.org/docs/handbook) တစ်ခုပါ။ `@enumerable(false)` decorator ကို ခေါ်ယူတဲ့အခါ — property descriptor ရဲ့ `enumerable` property ကို ပြုပြင်ပေးပါတယ်။

## Accessor Decorators (Accessor Decorators များ)

_Accessor Decorator_ တစ်ခုကို accessor declaration တစ်ခုရဲ့ ရှေ့မှာ တန်းပြီး ကြေညာပါတယ်။ Accessor decorator ကို accessor ရဲ့ _Property Descriptor_ ပေါ်မှာ အသုံးချပြီး — accessor ရဲ့ definitions တွေကို လေ့လာဖို့၊ ပြုပြင်ဖို့ ဒါမှမဟုတ် အစားထိုးဖို့ သုံးနိုင်ပါတယ်။ Accessor decorator တစ်ခုကို declaration file တစ်ခုထဲမှာ ဒါမှမဟုတ် — တခြား ambient context တစ်ခုခုမှာ (`declare` class တစ်ခုထဲမှာ လိုမျိုး) — သုံးလို့ မရပါဘူး။

> မှတ်ချက်&emsp; TypeScript က member တစ်ခုတည်းအတွက် `get` ရော `set` ရော accessor နှစ်ခုလုံးကို decorate လုပ်တာကို ခွင့်မပြုပါဘူး။
> အဲဒီအစား — member အတွက် decorators အားလုံးကို — document order အရ ပထမဆုံး သတ်မှတ်ထားတဲ့ accessor ပေါ်မှာပဲ အသုံးချရပါမယ်။
> ဘာလို့လဲဆိုတော့ — decorators တွေက `get` နဲ့ `set` accessor နှစ်ခုလုံးကို ပေါင်းစပ်ထားတဲ့ _Property Descriptor_ တစ်ခုပေါ်မှာ အသုံးချတာမို့ — declaration တစ်ခုချင်းစီအလိုက် သီးခြား အသုံးချတာ မဟုတ်လို့ပါ။

Accessor decorator ရဲ့ expression ကို runtime မှာ function တစ်ခုအနေနဲ့ ခေါ်ယူပြီး — အောက်ပါ argument သုံးခုကို လက်ခံပါတယ်:

1. Static member တစ်ခုအတွက်ဆိုရင် class ရဲ့ constructor function — instance member တစ်ခုအတွက်ဆိုရင် class ရဲ့ prototype။
2. Member ရဲ့ နာမည်။
3. Member ရဲ့ _Property Descriptor_။

> မှတ်ချက်&emsp; သင့် script target က `ES5` ထက် နိမ့်နေရင် — _Property Descriptor_ က `undefined` ဖြစ်နေပါလိမ့်မယ်။

Accessor decorator က value တစ်ခု return လုပ်ရင် — အဲဒါကို member ရဲ့ _Property Descriptor_ အဖြစ် သုံးပါလိမ့်မယ်။

> မှတ်ချက်&emsp; သင့် script target က `ES5` ထက် နိမ့်နေရင် — return value ကို လျစ်လျူရှုပါတယ်။

အောက်ပါဟာက — `Point` class ရဲ့ member တစ်ခုပေါ်မှာ အသုံးချထားတဲ့ accessor decorator (`@configurable`) ရဲ့ ဥပမာတစ်ခုပါ:

```ts twoslash
// @experimentalDecorators
function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}
// ---cut---
class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}
```

`@configurable` decorator ကို အောက်ပါ function declaration နဲ့ သတ်မှတ်နိုင်ပါတယ်:

```ts
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}
```

## Property Decorators (Property Decorators များ)

_Property Decorator_ တစ်ခုကို property declaration တစ်ခုရဲ့ ရှေ့မှာ တန်းပြီး ကြေညာပါတယ်။ Property decorator တစ်ခုကို declaration file တစ်ခုထဲမှာ ဒါမှမဟုတ် — တခြား ambient context တစ်ခုခုမှာ (`declare` class တစ်ခုထဲမှာ လိုမျိုး) — သုံးလို့ မရပါဘူး။

Property decorator ရဲ့ expression ကို runtime မှာ function တစ်ခုအနေနဲ့ ခေါ်ယူပြီး — အောက်ပါ argument နှစ်ခုကို လက်ခံပါတယ်:

1. Static member တစ်ခုအတွက်ဆိုရင် class ရဲ့ constructor function — instance member တစ်ခုအတွက်ဆိုရင် class ရဲ့ prototype။
2. Member ရဲ့ နာမည်။

> မှတ်ချက်&emsp; TypeScript မှာ property decorators တွေကို initialize လုပ်ပုံကြောင့် — _Property Descriptor_ တစ်ခုကို property decorator တစ်ခုဆီ argument အနေနဲ့ ပေးအပ်တာ မဟုတ်ပါဘူး။
> ဘာလို့လဲဆိုတော့ — လက်ရှိမှာ prototype တစ်ခုရဲ့ members တွေကို သတ်မှတ်တဲ့အခါ instance property တစ်ခုကို ဖော်ပြနိုင်တဲ့ ယန္တရား မရှိသေးသလို — property တစ်ခုရဲ့ initializer (ကနဦး တန်ဖိုးသတ်မှတ်ချက်) ကို လေ့လာဖို့ ဒါမှမဟုတ် ပြုပြင်ဖို့ နည်းလမ်းလည်း မရှိသေးလို့ပါ။ Return value ကိုလည်း လျစ်လျူရှုပါတယ်။
> ဒါကြောင့် — property decorator တစ်ခုကို — class တစ်ခုအတွက် နာမည်တိကျတဲ့ property တစ်ခု ကြေညာထားကြောင်း လေ့လာဖို့ပဲ သုံးနိုင်ပါတယ်။

ဒီအချက်အလက်ကို သုံးပြီး — property အကြောင်း metadata (ဒေတာအကြောင်း ဒေတာ) တွေကို မှတ်တမ်းတင်နိုင်ပါတယ် — အောက်ပါ ဥပမာမှာ ကြည့်ရအောင်:

```ts
class Greeter {
  @format("Hello, %s")
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    let formatString = getFormat(this, "greeting");
    return formatString.replace("%s", this.greeting);
  }
}
```

ပြီးတော့ `@format` decorator နဲ့ `getFormat` functions တွေကို အောက်ပါ function declarations တွေနဲ့ သတ်မှတ်နိုင်ပါတယ်:

```ts
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
```

ဒီမှာ `@format("Hello, %s")` decorator က [decorator factory](https://www.typescriptlang.org/docs/handbook) တစ်ခုပါ။ `@format("Hello, %s")` ကို ခေါ်ယူတဲ့အခါ — `reflect-metadata` library ကနေ `Reflect.metadata` function ကို သုံးပြီး — property အတွက် metadata entry (metadata မှတ်တမ်းဝင်) တစ်ခုကို ထည့်ပေးပါတယ်။ `getFormat` ကို ခေါ်ယူတဲ့အခါ — format အတွက် metadata value ကို ဖတ်ပေးပါတယ်။

> မှတ်ချက်&emsp; ဒီဥပမာက `reflect-metadata` library လိုအပ်ပါတယ်။
> `reflect-metadata` library အကြောင်း ပိုမို သိရှိရန် [Metadata](https://www.typescriptlang.org/docs/handbook) ကို ကြည့်ပါ။

## Parameter Decorators (Parameter Decorators များ)

_Parameter Decorator_ တစ်ခုကို parameter declaration တစ်ခုရဲ့ ရှေ့မှာ တန်းပြီး ကြေညာပါတယ်။ Parameter decorator ကို class constructor ဒါမှမဟုတ် method declaration တစ်ခုရဲ့ function ပေါ်မှာ အသုံးချပါတယ်။ Parameter decorator တစ်ခုကို declaration file တစ်ခုထဲမှာ၊ overload တစ်ခုပေါ်မှာ ဒါမှမဟုတ် — တခြား ambient context တစ်ခုခုမှာ (`declare` class တစ်ခုထဲမှာ လိုမျိုး) — သုံးလို့ မရပါဘူး။

Parameter decorator ရဲ့ expression ကို runtime မှာ function တစ်ခုအနေနဲ့ ခေါ်ယူပြီး — အောက်ပါ argument သုံးခုကို လက်ခံပါတယ်:

1. Static member တစ်ခုအတွက်ဆိုရင် class ရဲ့ constructor function — instance member တစ်ခုအတွက်ဆိုရင် class ရဲ့ prototype။
2. Member ရဲ့ နာမည်။
3. Function ရဲ့ parameter list ထဲမှာ အဲဒီ parameter ရဲ့ နေရာအစဉ် (ordinal index)။

> မှတ်ချက်&emsp; Parameter decorator တစ်ခုကို — method တစ်ခုပေါ်မှာ parameter တစ်ခု ကြေညာထားကြောင်း လေ့လာဖို့ပဲ သုံးနိုင်ပါတယ်။

Parameter decorator ရဲ့ return value ကိုတော့ လျစ်လျူရှုပါတယ်။

အောက်ပါဟာက — `BugReport` class ရဲ့ member တစ်ခုရဲ့ parameter တစ်ခုပေါ်မှာ အသုံးချထားတဲ့ parameter decorator (`@required`) ရဲ့ ဥပမာတစ်ခုပါ:

```ts twoslash
// @experimentalDecorators
function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {}
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {}
// ---cut---
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }

  @validate
  print(@required verbose: boolean) {
    if (verbose) {
      return `type: ${this.type}\ntitle: ${this.title}`;
    } else {
     return this.title; 
    }
  }
}
```

ပြီးတော့ `@required` နဲ့ `@validate` decorators တွေကို အောက်ပါ function declarations တွေနဲ့ သတ်မှတ်နိုင်ပါတယ်:

```ts twoslash
// @experimentalDecorators
// @emitDecoratorMetadata
import "reflect-metadata";
const requiredMetadataKey = Symbol("required");

function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata( requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  let method = descriptor.value!;

  descriptor.value = function () {
    let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
          throw new Error("Missing required argument.");
        }
      }
    }
    return method.apply(this, arguments);
  };
}
```

`@required` decorator က parameter ကို required အဖြစ် မှတ်သားပေးတဲ့ metadata entry တစ်ခုကို ထည့်ပေးပါတယ်။ ပြီးတော့ `@validate` decorator က — မူရင်း method ကို မခေါ်ခင် arguments တွေကို စစ်ဆေးပေးတဲ့ function တစ်ခုထဲမှာ — ရှိပြီးသား `print` method ကို ထုပ်ပိုးပေးပါတယ်။

> မှတ်ချက်&emsp; ဒီဥပမာက `reflect-metadata` library လိုအပ်ပါတယ်။
> `reflect-metadata` library အကြောင်း ပိုမို သိရှိရန် [Metadata](https://www.typescriptlang.org/docs/handbook) ကို ကြည့်ပါ။

## Metadata (Metadata)

ဥပမာတချို့က [experimental metadata API](https://github.com/rbuckton/ReflectDecorators) တစ်ခုအတွက် polyfill (support မရှိသေးတဲ့ feature ကို ဖြည့်ဆည်းပေးတဲ့ code) တစ်ခုကို ထည့်ပေးတဲ့ `reflect-metadata` library ကို သုံးပါတယ်။ ဒီ library က ECMAScript (JavaScript) standard ရဲ့ အစိတ်အပိုင်း မဖြစ်သေးပါဘူး။ ဒါပေမယ့် — decorators တွေကို ECMAScript standard ရဲ့ အစိတ်အပိုင်းအဖြစ် တရားဝင် လက်ခံကျင့်သုံးလိုက်တာနဲ့ — ဒီ extensions တွေကိုပါ လက်ခံကျင့်သုံးဖို့ အဆိုပြုသွားပါလိမ့်မယ်။

ဒီ library ကို npm ကနေတစ်ဆင့် install လုပ်နိုင်ပါတယ်:

```shell
npm i reflect-metadata --save
```

TypeScript မှာ — decorators တွေ ပါဝင်တဲ့ declarations တွေအတွက် metadata အမျိုးအစားတချို့ကို emit (ထုတ်လွှတ်) လုပ်ဖို့ experimental support ပါဝင်ပါတယ်။ ဒီ experimental support ကို ဖွင့်ဖို့ဆိုရင် — [`emitDecoratorMetadata`](https://www.typescriptlang.org/tsconfig) compiler option ကို command line မှာ ဖြစ်ဖြစ် — သင့် `tsconfig.json` ထဲမှာ ဖြစ်ဖြစ် သတ်မှတ်ထားဖို့ လိုပါတယ်:

**Command Line**:

```shell
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata
```

**tsconfig.json**:

```json tsconfig
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

ဖွင့်ထားတဲ့အခါ — `reflect-metadata` library ကို import လုပ်ထားသရွေ့ — design-time (ဒီဇိုင်းဆွဲချိန်) type information တွေ ထပ်ဆောင်း ရရှိနိုင်ပြီး — runtime မှာ ဖော်ထုတ်ပေးမှာ ဖြစ်ပါတယ်။

ဒါကို လက်တွေ့မှာ အောက်ပါ ဥပမာနဲ့ ကြည့်နိုင်ပါတယ်:

```ts twoslash
// @emitDecoratorMetadata
// @experimentalDecorators
// @strictPropertyInitialization: false
import "reflect-metadata";

class Point {
  constructor(public x: number, public y: number) {}
}

class Line {
  private _start: Point;
  private _end: Point;

  @validate
  set start(value: Point) {
    this._start = value;
  }

  get start() {
    return this._start;
  }

  @validate
  set end(value: Point) {
    this._end = value;
  }

  get end() {
    return this._end;
  }
}

function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
  let set = descriptor.set!;
  
  descriptor.set = function (value: T) {
    let type = Reflect.getMetadata("design:type", target, propertyKey);

    if (!(value instanceof type)) {
      throw new TypeError(`Invalid type, got ${typeof value} not ${type.name}.`);
    }

    set.call(this, value);
  };
}

const line = new Line()
line.start = new Point(0, 0)

// @ts-ignore
// line.end = {}

// Fails at runtime with:
// > Invalid type, got object not Point

```

TypeScript compiler က `@Reflect.metadata` decorator ကို သုံးပြီး — design-time type information တွေကို ထည့်သွင်းပေးမှာ ဖြစ်ပါတယ်။ အဲဒါကို အောက်ပါ TypeScript နဲ့ ညီမျှတယ်လို့ မှတ်ယူနိုင်ပါတယ်:

```ts
class Line {
  private _start: Point;
  private _end: Point;

  @validate
  @Reflect.metadata("design:type", Point)
  set start(value: Point) {
    this._start = value;
  }
  get start() {
    return this._start;
  }

  @validate
  @Reflect.metadata("design:type", Point)
  set end(value: Point) {
    this._end = value;
  }
  get end() {
    return this._end;
  }
}
```

> မှတ်ချက်&emsp; Decorator metadata က experimental feature တစ်ခု ဖြစ်ပြီး — နောင်ထွက်ရှိမယ့် versions တွေမှာ breaking changes (နောက်ပြန် မလိုက်ဖက်တဲ့ အပြောင်းအလဲများ) တွေ ဖြစ်စေနိုင်ပါတယ်။
