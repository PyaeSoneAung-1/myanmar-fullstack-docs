---
title: "Classes"
description: "Class fields နဲ့ type, readonly, constructors, methods, getters/setters, implements, extends, public/private/protected, static members, abstract classes"
order: 6
source: "https://www.typescriptlang.org/docs/handbook/2/classes.html"
status: translated
updated: 2026-09-01
---

## Class fields, readonly နဲ့ constructors

TypeScript က ES2015 ကစပြီး JavaScript မှာ ပါလာတဲ့ `class` keyword ကို အပြည့်အဝ ထောက်ပံ့ပါတယ်။ Class field တစ်ခုချင်းစီမှာ type annotation ထည့်လို့ရပြီး — initializer ပါရင် အဲဒီကနေ type ကို အလိုအလျောက် မှန်းပေးပါတယ်။ `readonly` modifier ထည့်ထားရင် constructor ထဲမှာပဲ assign လို့ရပြီး — အပြင်ကနေ ပြောင်းလို့မရပါဘူး။ Constructor က function တွေနဲ့ ဆင်တူပြီး parameter type annotation, default value စတာတွေ သုံးလို့ရပါတယ် — ဒါပေမယ့် constructor မှာ type parameter နဲ့ return type annotation မထည့်နိုင်ပါဘူး။ Base class ရှိရင် `this` မသုံးခင် `super()` ကို အရင် ခေါ်ရပါတယ်:

```ts
class Point {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Greeter {
  readonly name: string = "world";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    this.name = "not ok";  // Error: Cannot assign to 'name' because it is a read-only property
  }
}
```

Field ကို constructor ထဲမှာတင် initialize လုပ်ရမယ်လို့ သတ်မှတ်ထားတာ `strictPropertyInitialization` option နဲ့ ထိန်းချုပ်ပါတယ် — ဒီ option ဖွင့်ထားရင် initialize မလုပ်ထားတဲ့ field တွေကို error ပြပါတယ်။

## Methods နဲ့ getters/setters

Class ထဲက function property ကို method လို့ ခေါ်ပြီး — function တွေမှာ သုံးတဲ့ type annotation တွေအတိုင်းပဲ သုံးလို့ရပါတယ်။ Method body ထဲမှာ class field တွေကို `this.` နဲ့ပဲ ဝင်ရောက်ရပါတယ် — `this` မပါဘဲ ရေးရင် အပြင်က variable ကို ရည်ညွှန်းတာဖြစ်လို့ မကြာခဏ မှားတတ်ပါတယ်။ `get`/`set` keyword တွေနဲ့ accessor တွေလည်း ရေးလို့ရပြီး — `get` တစ်ခုတည်းပဲ ရှိရင် property က အလိုအလျောက် `readonly` ဖြစ်သွားပါတယ်:

```ts
class Point {
  x = 10;
  y = 10;

  scale(n: number): void {
    this.x *= n;
    this.y *= n;
  }
}

class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```

## implements နဲ့ extends — class heritage

`implements` clause နဲ့ class တစ်ခုက interface တစ်ခုကို လိုက်နာမှု ရှိမရှိ စစ်လို့ရပါတယ် — interface ထဲက member တွေ မပါရင် error တက်ပါတယ်။ `implements` က class ကို interface type အနေနဲ့ သဘောထားလို့ရလားဆိုတာကိုပဲ စစ်တာဖြစ်ပြီး — class ရဲ့ type ကိုတော့ ပြောင်းမပေးဘူးဆိုတာ သတိထားပါ။ Interface တစ်ခုထက်ပိုပြီးလည်း implement လုပ်လို့ရပါတယ် — `class C implements A, B` လိုမျိုး။ `extends` ကတော့ base class တစ်ခုကနေ ဆင်းသက်လာတဲ့ class (derived class) ဖန်တီးဖို့ ဖြစ်ပြီး — base class ရဲ့ property နဲ့ method တွေ အားလုံး အလိုအလျောက် ရပါတယ်။ Derived class ထဲမှာ member အသစ်တွေ ထပ်ထည့်လို့ရသလို base class ရဲ့ method ကို override လုပ်လို့လည်း ရပါတယ် — override လုပ်တဲ့အခါ base class ရဲ့ ကတိ (contract) ကို လိုက်နာရပါတယ်။ Derived class instance ကို base class reference ကနေ အမြဲ သုံးလို့ရတာမို့ method signature က base နဲ့ ကိုက်ညီရမှာ ဖြစ်ပါတယ်:

```ts
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}

class Ball implements Pingable {
  pong() {
    console.log("pong!");  // Error: Class 'Ball' incorrectly implements interface 'Pingable'
  }
}

class Animal {
  move() {
    console.log("Moving along!");
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("woof!");
    }
  }
}

const d = new Dog();
d.move();   // Base class method
d.woof(3);  // Derived class method
```

## public, private, protected — member မြင်နိုင်မှု

Class member တွေရဲ့ မြင်နိုင်မှုကို modifier သုံးခုနဲ့ ထိန်းချုပ်လို့ရပါတယ် — `public` (နေရာတိုင်းက ဝင်ရောက်လို့ရ၊ default ဖြစ်တယ်), `protected` (class နဲ့ subclass ထဲမှာပဲ သုံးလို့ရ), `private` (class ထဲမှာပဲ သုံးလို့ရ — subclass မှာတောင် မရပါဘူး)။ ဒီ modifier တွေက type checking အတွက်ပဲ ဖြစ်ပြီး — runtime မှာ JavaScript ရဲ့ `in` operator ဒါမှမဟုတ် property lookup နဲ့တော့ ဝင်ရောက်လို့ရပါသေးတယ်။ Static member တွေကတော့ instance တစ်ခုချင်းစီနဲ့ မသက်ဆိုင်ဘဲ class ကိုယ်တိုင်ကနေ ဝင်ရောက်ပါတယ်:

```ts
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "hi";
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    // OK to access protected member here
    console.log("Howdy, " + this.getName());
  }
}

const g = new SpecialGreeter();
g.greet();  // OK
// g.getName();  // Error: Property 'getName' is protected

class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x);
MyClass.printX();
```

Static member တွေကိုလည်း `public`, `protected`, `private` modifier တွေ ထည့်လို့ရပြီး — subclass တွေကိုပါ အမွေဆက်ခံပေးပါတယ်။

## Abstract classes

Abstract class ဆိုတာ — ကိုယ်တိုင် `new` နဲ့ instantiate လို့မရဘဲ subclass တွေအတွက် အခြေခံပုံစံ (blueprint) သက်သက် ဖြစ်ပါတယ်။ `abstract` keyword နဲ့ သတ်မှတ်ထားတဲ့ member တွေက implementation မပါဘဲ — subclass တွေမှာ မဖြစ်မနေ implement လုပ်ရပါတယ်။ `abstract class Base { abstract getName(): string; }` လိုမျိုး ရေးပြီး `class Derived extends Base { getName() { return "world"; } }` လိုမျိုး implement လုပ်ပါတယ်။ Abstract member တွေကို implement လုပ်ဖို့ မေ့ရင် compile error တက်ပြီး — ဒါက class တွေရဲ့ "ပုံစံ" ကို မဖြစ်မနေ လိုက်နာစေတဲ့ ပုံစံ ဖြစ်ပါတယ်။

## ဆက်လက်လေ့လာရန်

- [Generics](/docs/typescript/generics) — generic classes နဲ့ constraints
- [Type Narrowing](/docs/typescript/narrowing) — instanceof နဲ့ class တွေ ပေါင်းသုံးခြင်း
- [နေ့စဉ်သုံး Types](/docs/typescript/everyday-types) — interfaces နဲ့ type aliases
