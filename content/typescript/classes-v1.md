---
title: "Classes (Class များ)"
description: "Handbook (v1) ရဲ့ Classes စာမျက်နှာ — object-oriented, class-based ချဉ်းကပ်နည်း၊ inheritance၊ public/private/protected modifiers၊ readonly၊ parameter properties၊ accessors၊ static members၊ abstract classes၊ constructor functions နဲ့ class တစ်ခုကို interface အဖြစ် သုံးခြင်းအထိ ဥပမာများစွာနဲ့ ရှင်းပြထားချက်"
order: 75
source: "https://www.typescriptlang.org/docs/handbook/classes.html"
status: translated
updated: 2026-09-05
---

ရိုးရာ JavaScript မှာတော့ — reusable (ပြန်လည် သုံးလို့ရတဲ့) components တွေ တည်ဆောက်ဖို့ functions တွေနဲ့ prototype-based inheritance (prototype အခြေပြု အမွေဆက်ခံခြင်း) တွေကို သုံးပါတယ် — ဒါပေမယ့် classes တွေက functionality တွေကို အမွေဆက်ခံပြီး objects တွေကို အဲဒီ classes တွေကနေ တည်ဆောက်တဲ့ object-oriented (object ဦးတည်) ချဉ်းကပ်နည်းနဲ့ ပိုပြီး အကျွမ်းဝင်နေတဲ့ programmer တွေအတွက်တော့ — ဒီနည်းလမ်းက နည်းနည်း ကသိကအောက် ဖြစ်စေနိုင်ပါတယ်။

ECMAScript 6 လို့လည်း သိကြတဲ့ ECMAScript 2015 ကစပြီး — JavaScript programmer တွေဟာ ဒီ object-oriented, class-based ချဉ်းကပ်နည်းကို သုံးပြီး သူတို့ရဲ့ applications တွေကို တည်ဆောက်နိုင်ခဲ့ပါတယ်။

TypeScript မှာတော့ developer တွေကို ဒီနည်းစနစ်တွေကို အခုတည်းက သုံးခွင့် ပေးထားပြီး — JavaScript ရဲ့ နောက်ထွက်မယ့် version ကို စောင့်စရာ မလိုဘဲ — browser နဲ့ platform အဓိက အားလုံးမှာ အလုပ်လုပ်နိုင်တဲ့ JavaScript အဖြစ် compile လုပ်ချပေးပါတယ်။

## Classes (Class များ)

Class-based (class အခြေပြု) ချဉ်းကပ်နည်း ဥပမာ ရိုးရိုးလေးတစ်ခုကို ကြည့်ရအောင်:

```ts twoslash
class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter = new Greeter("world");
```

C# ဒါမှမဟုတ် Java ကို အရင်က သုံးဖူးရင် ဒီ syntax က အကျွမ်းဝင်နေမှာပါ။ ကျွန်တော်တို့ဟာ class အသစ်တစ်ခုဖြစ်တဲ့ `Greeter` ကို ကြေညာထားပါတယ်။ ဒီ class မှာ member သုံးခု ရှိပါတယ်: `greeting` လို့ခေါ်တဲ့ property တစ်ခု၊ constructor တစ်ခု၊ ပြီးတော့ `greet` ဆိုတဲ့ method တစ်ခုပါ။

Class ထဲမှာ — class ရဲ့ member တစ်ခုခုကို ရည်ညွှန်းတဲ့အခါ — `this.` ကို ရှေ့ကနေ ထည့်ထားတာ သတိပြုမိပါလိမ့်မယ်။ ဒါက member access (member တစ်ခုဆီ ဝင်ရောက်ခြင်း) ဖြစ်ကြောင်း ဖော်ပြတာပါ။

နောက်ဆုံး line မှာတော့ `new` ကို သုံးပြီး `Greeter` class ရဲ့ instance တစ်ခုကို တည်ဆောက်ပါတယ်။ ဒါက အစောပိုင်းက သတ်မှတ်ထားတဲ့ constructor ထဲကို ဝင်ရောက် ခေါ်ပြီး — `Greeter` ပုံသဏ္ဌာန်နဲ့ object အသစ်တစ်ခုကို ဖန်တီးကာ — အဲဒါကို initialize (ကနဦး စတင်သတ်မှတ်) လုပ်ဖို့ constructor ကို run လုပ်ပေးပါတယ်။

## Inheritance (အမွေဆက်ခံခြင်း)

TypeScript မှာ ကျွန်တော်တို့ဟာ အသုံးများတဲ့ object-oriented patterns တွေကို သုံးနိုင်ပါတယ်။ Class-based programming ထဲမှာ အခြေခံအကျဆုံး patterns တွေထဲက တစ်ခုကတော့ — inheritance ကို သုံးပြီး ရှိပြီးသား classes တွေကို တိုးချဲ့ကာ class အသစ်တွေ ဖန်တီးနိုင်တာပဲ ဖြစ်ပါတယ်။

ဥပမာတစ်ခုကို ကြည့်ရအောင်:

```ts twoslash
class Animal {
  move(distanceInMeters: number = 0) {
    console.log(`Animal moved ${distanceInMeters}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

ဒီဥပမာက inheritance ရဲ့ အခြေခံအကျဆုံး feature ကို ပြသပါတယ်: classes တွေဟာ base classes တွေဆီကနေ properties နဲ့ methods တွေကို အမွေဆက်ခံပါတယ်။ ဒီမှာ `Dog` က `extends` keyword ကို သုံးပြီး `Animal` ဆိုတဲ့ _base_ class ကနေ ဆင်းသက်လာတဲ့ _derived_ class တစ်ခုပါ။ Derived classes တွေကို _subclasses_ လို့လည်း ခေါ်လေ့ရှိပြီး — base classes တွေကိုတော့ _superclasses_ လို့ ခေါ်လေ့ရှိပါတယ်။

`Dog` က `Animal` ဆီကနေ functionality တွေကို extends (တိုးချဲ့) ထားတာမို့ — `bark()` ရော `move()` ရော နှစ်ခုလုံး လုပ်နိုင်တဲ့ `Dog` instance တစ်ခုကို ဖန်တီးနိုင်ခဲ့ပါတယ်။

အခုတော့ ပိုရှုပ်ထွေးတဲ့ ဥပမာတစ်ခုကို ကြည့်ရအောင်။

```ts twoslash
class Animal {
  name: string;
  constructor(theName: string) {
    this.name = theName;
  }
  move(distanceInMeters: number = 0) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}

class Snake extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 5) {
    console.log("Slithering...");
    super.move(distanceInMeters);
  }
}

class Horse extends Animal {
  constructor(name: string) {
    super(name);
  }
  move(distanceInMeters = 45) {
    console.log("Galloping...");
    super.move(distanceInMeters);
  }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

ဒီဥပမာက အရင်က မဖော်ပြခဲ့တဲ့ feature တချို့ကိုပါ လွှမ်းခြုံထားပါတယ်။ `Animal` ရဲ့ subclass အသစ်နှစ်ခုဖြစ်တဲ့ `Horse` နဲ့ `Snake` ကို ဖန်တီးဖို့ `extends` keywords တွေကို သုံးထားတာကိုလည်း ထပ်တွေ့ရပါတယ်။

အရင်ဥပမာနဲ့ ကွာခြားချက်တစ်ခုကတော့ — constructor function ပါဝင်တဲ့ derived class တစ်ခုစီတိုင်းဟာ base class ရဲ့ constructor ကို run လုပ်ပေးမယ့် `super()` ကို _မဖြစ်မနေ_ ခေါ်ရပါတယ်။ ဒါ့အပြင် constructor body ထဲမှာ `this` ပေါ်က property တစ်ခုကို _ဘယ်တော့မဆို_ ဝင်ရောက်ကြည့်ခင် `super()` ကို _ခေါ်ပြီးသား_ ဖြစ်ရပါမယ်။ ဒါက TypeScript က လိုက်လံ စစ်ဆေးပေးမယ့် အရေးကြီးတဲ့ စည်းကမ်းတစ်ခုပါ။

ဒီဥပမာက — subclass တစ်ခုစီအတွက် အထူးပြုထားတဲ့ methods တွေနဲ့ base class ထဲက methods တွေကို ဘယ်လို override (အစားထိုး) လုပ်မလဲဆိုတာကိုလည်း ပြသပါတယ်။ ဒီမှာ `Snake` ရော `Horse` ရော — `Animal` ဆီကနေ လာတဲ့ `move` ကို override လုပ်တဲ့ — class တစ်ခုချင်းစီအတွက် သီးသန့် functionality တွေ ပါတဲ့ — `move` method တစ်ခုစီ ဖန်တီးထားပါတယ်။ `tom` ကို `Animal` အနေနဲ့ ကြေညာထားပေမယ့် — သူ့ရဲ့ value က `Horse` ဖြစ်နေတာမို့ — `tom.move(34)` ကို ခေါ်လိုက်ရင် `Horse` ထဲက overriding method ကို ခေါ်သွားမှာ ဖြစ်ကြောင်း သတိပြုပါ:

```
Slithering...
Sammy the Python moved 5m.
Galloping...
Tommy the Palomino moved 34m.
```

## Public, private, and protected modifiers (Public, private နှင့် protected Modifiers များ)

### Public by default (ပုံမှန်အားဖြင့် Public)

ကျွန်တော်တို့ရဲ့ ဥပမာတွေထဲမှာ — program တစ်လျှောက် ကြေညာထားတဲ့ members တွေကို လွတ်လပ်စွာ ဝင်ရောက်နိုင်ခဲ့ပါတယ်။ တခြား languages တွေထဲက classes တွေနဲ့ ရင်းနှီးပြီးသားဆိုရင် — အပေါ်က ဥပမာတွေမှာ ဒါမျိုး လုပ်ဖို့ `public` ဆိုတဲ့ စကားလုံးကို သုံးစရာ မလိုခဲ့တာ သတိပြုမိလောက်ပါတယ်; ဥပမာ — C# မှာတော့ member တစ်ခုချင်းစီ မြင်ရဖို့ `public` လို့ အတိအကျ သတ်မှတ်ပေးရပါတယ်။ TypeScript မှာတော့ member တိုင်းဟာ ပုံမှန်အားဖြင့် `public` ဖြစ်ပါတယ်။

Member တစ်ခုကို `public` လို့ အတိအကျ အမှတ်အသား လုပ်ချင်လည်း ရပါသေးတယ်။ အရင် section က `Animal` class ကို အောက်ပါအတိုင်းလည်း ရေးနိုင်ခဲ့ပါတယ်:

```ts twoslash
class Animal {
  public name: string;

  public constructor(theName: string) {
    this.name = theName;
  }

  public move(distanceInMeters: number) {
    console.log(`${this.name} moved ${distanceInMeters}m.`);
  }
}
```

### ECMAScript Private Fields (ECMAScript Private Fields များ)

TypeScript 3.8 ကစပြီး TypeScript က private fields တွေအတွက် JavaScript syntax အသစ်ကို ပံ့ပိုးပေးပါတယ်:

```ts twoslash
// @errors: 18013
class Animal {
  #name: string;
  constructor(theName: string) {
    this.#name = theName;
  }
}

new Animal("Cat").#name;
```

ဒီ syntax က JavaScript runtime ထဲမှာ တည်ဆောက်ပြီးသား ဖြစ်လို့ — private field တစ်ခုချင်းစီရဲ့ သီးခြား ခွဲထားမှု (isolation) နဲ့ ပတ်သက်ပြီး ပိုကောင်းတဲ့ အာမခံချက်တွေ ရနိုင်ပါတယ်။ လောလောဆယ် ဒီ private fields တွေအတွက် အကောင်းဆုံး documentation ကတော့ TypeScript 3.8 ရဲ့ [ထုတ်ပြန်မှုမှတ်စု](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#ecmascript-private-fields) ထဲမှာပါ။

### Understanding TypeScript's `private` (TypeScript ရဲ့ `private` ကို နားလည်ခြင်း)

TypeScript မှာလည်း member တစ်ခုကို `private` အနေနဲ့ အမှတ်အသားပြုဖို့ ကိုယ်ပိုင် နည်းလမ်း ရှိပါတယ် — `private` လို့ အမှတ်အသားလုပ်ထားတဲ့ member ကို သူပါဝင်တဲ့ class ရဲ့ အပြင်ကနေ ဝင်ရောက်လို့ မရတော့ပါဘူး။ ဥပမာ:

```ts twoslash
// @errors: 2341
class Animal {
  private name: string;

  constructor(theName: string) {
    this.name = theName;
  }
}

new Animal("Cat").name;
```

TypeScript က structural (ဖွဲ့စည်းပုံအခြေပြု) type system တစ်ခုပါ။ Type နှစ်ခုကို ယှဉ်ကြည့်တဲ့အခါ — ဘယ်ကနေ လာလာပဲ — members အားလုံးရဲ့ types တွေ compatible (ကိုက်ညီ) နေရင် — types တွေကိုယ်တိုင်လည်း compatible လို့ သတ်မှတ်ပါတယ်။

ဒါပေမယ့် `private` နဲ့ `protected` members တွေ ပါဝင်တဲ့ types တွေကို ယှဉ်ကြည့်တဲ့အခါမှာတော့ ဒီ types တွေကို မတူညီတဲ့ နည်းနဲ့ ကိုင်တွယ်ပါတယ်။ Type နှစ်ခု compatible လို့ သတ်မှတ်ဖို့ဆိုရင် — တစ်ခုမှာ `private` member တစ်ခု ရှိနေရင် — နောက်တစ်ခုမှာလည်း — declaration (ကြေညာချက်) တစ်ခုတည်းကနေ စတင်လာတဲ့ — `private` member တစ်ခု ရှိရပါမယ်။ `protected` members တွေအတွက်လည်း အလားတူပဲ သက်ရောက်ပါတယ်။

လက်တွေ့မှာ ဒါက ဘယ်လို ဖြစ်လဲ ပိုရှင်းအောင် ဥပမာတစ်ခု ကြည့်ရအောင်:

```ts twoslash
// @errors: 2322
class Animal {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

class Rhino extends Animal {
  constructor() {
    super("Rhino");
  }
}

class Employee {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee;
```

ဒီဥပမာမှာ `Animal` တစ်ခုနဲ့ `Rhino` တစ်ခု ရှိပြီး — `Rhino` က `Animal` ရဲ့ subclass တစ်ခုပါ။ ပုံသဏ္ဌာန် (shape) အားဖြင့် `Animal` နဲ့ တစ်ထပ်တည်း တူတဲ့ class အသစ်တစ်ခုဖြစ်တဲ့ `Employee` လည်း ရှိပါတယ်။ ဒီ classes တွေရဲ့ instances တစ်ချို့ကို ဖန်တီးပြီး — ဘာဖြစ်သွားမလဲ ကြည့်ဖို့ — တစ်ခုကို တစ်ခု assign (ထည့်သွင်း) လုပ်ကြည့်ပါတယ်။

`Animal` နဲ့ `Rhino` က — `Animal` ထဲက `private name: string` ဆိုတဲ့ declaration တစ်ခုတည်းကနေ သူတို့ရဲ့ shape ရဲ့ `private` ဘက်ခြမ်းကို အတူ မျှဝေထားတာမို့ — သူတို့က compatible ဖြစ်ပါတယ်။ ဒါပေမယ့် `Employee` အတွက်တော့ ဒီလို မဟုတ်ပါဘူး။ `Employee` တစ်ခုကနေ `Animal` ဆီ assign လုပ်ဖို့ ကြိုးစားတဲ့အခါ — ဒီ types တွေ compatible မဟုတ်ဘူးဆိုတဲ့ error တစ်ခု ရပါတယ်။ `Employee` မှာလည်း `name` လို့ခေါ်တဲ့ `private` member တစ်ခု ရှိနေပေမယ့် — အဲဒါက `Animal` ထဲမှာ ကျွန်တော်တို့ ကြေညာထားတဲ့ member မဟုတ်လို့ပါ။

### Understanding `protected` (`protected` ကို နားလည်ခြင်း)

`protected` modifier က `private` modifier နဲ့ တော်တော်လေး ဆင်တူပြီး — ကွာခြားချက်ကတော့ `protected` လို့ ကြေညာထားတဲ့ members တွေကို ဆင်းသက်လာတဲ့ (deriving) classes တွေထဲကနေလည်း ဝင်ရောက်လို့ ရနေတာပါ။ ဥပမာ,

```ts twoslash
// @errors: 2445
class Person {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name);
```

`Person` ရဲ့ အပြင်ကနေ `name` ကို သုံးလို့ မရပေမယ့် — `Employee` က `Person` ကနေ ဆင်းသက်လာတာမို့ — `Employee` ရဲ့ instance method တစ်ခုထဲကနေတော့ သုံးလို့ ရသေးတာ သတိပြုပါ။

Constructor တစ်ခုကိုလည်း `protected` လို့ အမှတ်အသား လုပ်နိုင်ပါတယ်။ ဆိုလိုတာက — အဲဒီ class ကို သူပါဝင်တဲ့ class ရဲ့ အပြင်ဘက်ကနေ instance ဖန်တီးလို့ မရတော့ဘဲ — extends (တိုးချဲ့) လုပ်လို့တော့ ရပါတယ်။ ဥပမာ,

```ts twoslash
// @errors: 2674
class Person {
  protected name: string;
  protected constructor(theName: string) {
    this.name = theName;
  }
}

// Employee can extend Person
class Employee extends Person {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getElevatorPitch() {
    return `Hello, my name is ${this.name} and I work in ${this.department}.`;
  }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John");
```

## Readonly modifier (Readonly Modifier)

`readonly` keyword ကို သုံးပြီး properties တွေကို readonly ဖြစ်အောင် လုပ်နိုင်ပါတယ်။ Readonly properties တွေကို သူတို့ရဲ့ declaration နေရာမှာ ဒါမှမဟုတ် constructor ထဲမှာ initialize (ကနဦး သတ်မှတ်) လုပ်ပြီးသား ဖြစ်ရပါမယ်။

```ts twoslash
// @errors: 2540
class Octopus {
  readonly name: string;
  readonly numberOfLegs: number = 8;

  constructor(theName: string) {
    this.name = theName;
  }
}

let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit";
```

## Parameter properties (Parameter Properties များ)

နောက်ဆုံး ဥပမာမှာ `Octopus` class ထဲမှာ readonly member `name` တစ်ခုနဲ့ constructor parameter `theName` တစ်ခုကို ကြေညာခဲ့ရပါတယ်။ `Octopus` constructor run လုပ်ပြီးနောက်မှာလည်း `theName` ရဲ့ value ကို ဝင်ရောက်လို့ ရနေဖို့ ဒါတွေ လိုအပ်ပါတယ်။ _Parameter properties_ တွေကတော့ member တစ်ခုကို ဖန်တီးခြင်းနဲ့ initialize လုပ်ခြင်းကို နေရာတစ်ခုတည်းမှာ လုပ်ခွင့် ပေးပါတယ်။ ဒီမှာ parameter property တစ်ခုကို သုံးထားတဲ့ အရင် `Octopus` class ရဲ့ နောက်ထပ် ပြန်ပြင်ဆင်ထားတဲ့ ဗားရှင်းတစ်ခု ပါပါတယ်:

```ts twoslash
class Octopus {
  readonly numberOfLegs: number = 8;
  constructor(readonly name: string) {}
}

let dad = new Octopus("Man with the 8 strong legs");
dad.name;
```

`theName` ကို လုံးဝ ဖယ်ပစ်လိုက်ပြီး — `name` member ကို ဖန်တီးဖို့နဲ့ initialize လုပ်ဖို့ — constructor ပေါ်မှာ အတိုချုံးထားတဲ့ `readonly name: string` parameter ကိုပဲ သုံးထားတာ သတိပြုပါ။ Declaration တွေနဲ့ assignment ကို နေရာတစ်ခုတည်းမှာ စုစည်းလိုက်ပါပြီ။

Parameter properties တွေကို constructor parameter တစ်ခုရဲ့ ရှေ့မှာ accessibility modifier တစ်ခု ဒါမှမဟုတ် `readonly` — ဒါမှမဟုတ် နှစ်ခုလုံး — ထည့်ရေးခြင်းအားဖြင့် ကြေညာပါတယ်။ Parameter property တစ်ခုအတွက် `private` ကို သုံးရင် private member တစ်ခုကို ကြေညာပြီး initialize လုပ်ပေးပါတယ်; `public`, `protected`, နဲ့ `readonly` တွေအတွက်လည်း အလားတူပဲ လုပ်ဆောင်ပေးပါတယ်။

## Accessors (Accessors များ)

TypeScript က — object တစ်ခုရဲ့ member တစ်ခုဆီ ဝင်ရောက်မှုတွေကို ကြားဖြတ် ထိန်းချုပ်ဖို့ နည်းလမ်းတစ်ခုအနေနဲ့ — getters/setters တွေကို ပံ့ပိုးပေးပါတယ်။ ဒါက object တစ်ခုချင်းစီပေါ်မှာ member တစ်ခုကို ဘယ်လို ဝင်ရောက်မလဲဆိုတာကို ပိုမို ချောမွေ့တဲ့ အဆင့်ဆင့် (finer-grained) ထိန်းချုပ်နိုင်ဖို့ နည်းလမ်းတစ်ခု ပေးပါတယ်။

class ရိုးရိုးတစ်ခုကို `get` နဲ့ `set` သုံးတဲ့ ပုံစံဆီ ပြောင်းကြည့်ရအောင်။ ပထမဆုံး getters နဲ့ setters မပါတဲ့ ဥပမာတစ်ခုကနေ စလိုက်ရအောင်။

```ts twoslash
// @strict: false
class Employee {
  fullName: string;
}

let employee = new Employee();
employee.fullName = "Bob Smith";

if (employee.fullName) {
  console.log(employee.fullName);
}
```

လူတွေကို `fullName` ကို တိုက်ရိုက် လွတ်လပ်စွာ သတ်မှတ်ခွင့် ပြုထားတာက တော်တော် အဆင်ပြေပေမယ့် — `fullName` သတ်မှတ်လိုက်တဲ့အခါမှာ ကန့်သတ်ချက်တစ်ချို့ကိုလည်း စစ်ဆေးချင်စိတ် ရှိနိုင်ပါတယ်။

ဒီ version မှာ `newName` ရဲ့ အလျားကို စစ်ဆေးတဲ့ setter တစ်ခု ထည့်ထားပါတယ် — နောက်ခံ database field ရဲ့ max-length (အများဆုံး အလျား) နဲ့ ကိုက်ညီမှု ရှိမရှိ သေချာစေဖို့ပါ။ မကိုက်ညီရင် — တစ်ခုခု မှားသွားပြီဆိုတာကို client code ကို အသိပေးဖို့ — error တစ်ခု throw (ပစ်တင်) လုပ်ပါတယ်။

ရှိပြီးသား functionality တွေ မပျက်စီးစေဖို့ — `fullName` ကို ပြုပြင်မှု မရှိဘဲ ပြန်ယူပေးတဲ့ getter ရိုးရိုးတစ်ခုကိုလည်း ထည့်ထားပါတယ်။

```ts twoslash
// @strict: false
const fullNameMaxLength = 10;

class Employee {
  private _fullName: string = "";

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (newName && newName.length > fullNameMaxLength) {
      throw new Error("fullName has a max length of " + fullNameMaxLength);
    }

    this._fullName = newName;
  }
}

let employee = new Employee();
employee.fullName = "Bob Smith";

if (employee.fullName) {
  console.log(employee.fullName);
}
```

ကျွန်တော်တို့ရဲ့ accessor က အခု values တွေရဲ့ အလျားကို တကယ် စစ်ဆေးနေလားဆိုတာ ကိုယ်တိုင် သက်သေပြဖို့ — စာလုံး ၁၀ လုံးထက် ပိုရှည်တဲ့ နာမည်တစ်ခုကို assign လုပ်ကြည့်ပြီး error တစ်ခု ရတာ အတည်ပြုနိုင်ပါတယ်။

Accessors တွေနဲ့ ပတ်သက်ပြီး သတိပြုစရာ အချက်တစ်ချို့ ရှိပါတယ်:

ပထမ — accessors တွေက compiler ကို ECMAScript 5 ဒါမှမဟုတ် အထက်ကို output ထုတ်ဖို့ သတ်မှတ်ပေးထားဖို့ လိုပါတယ်။ ECMAScript 3 ဆီ downleveling (ဗားရှင်းဟောင်းဆီ ပြန်ရေးခြင်း) ကတော့ ပံ့ပိုးမထားပါဘူး။ ဒုတိယ — `get` တစ်ခုပဲ ရှိပြီး `set` မပါတဲ့ accessors တွေကို `readonly` လို့ အလိုအလျောက် infer (ခန့်မှန်း) လုပ်ပါတယ်။ ဒါက ကိုယ့် code ကနေ `.d.ts` file တစ်ခု generate (ထုတ်လုပ်) တဲ့အခါ အသုံးဝင်ပါတယ် — property ကို သုံးမယ့်သူတွေက အဲဒါကို ပြောင်းလို့ မရဘူးဆိုတာ မြင်နိုင်လို့ပါ။

## Static Properties (Static Properties များ)

ဒီအထိ class ရဲ့ _instance_ members တွေအကြောင်းပဲ ပြောခဲ့ပါတယ် — instance ဖန်တီးလိုက်တဲ့အခါ object ပေါ်မှာ ပေါ်လာတဲ့ member တွေပါ။ Class တစ်ခုရဲ့ _static_ members တွေကိုလည်း ဖန်တီးနိုင်ပါတယ် — instances တွေပေါ်မှာ မဟုတ်ဘဲ class ကိုယ်တိုင်ပေါ်မှာ မြင်ရတဲ့ member တွေပါ။ ဒီဥပမာမှာ origin က grids အားလုံးအတွက် ယေဘုယျ value တစ်ခုဖြစ်လို့ — origin ပေါ်မှာ `static` ကို သုံးထားပါတယ်။ Instance တစ်ခုချင်းစီဟာ class ရဲ့ နာမည်ကို ရှေ့ကနေ ထည့်ပြီး ဒီ value ကို ဝင်ရောက်ပါတယ်။ Instance accesses တွေရဲ့ ရှေ့မှာ `this.` ထည့်သလိုပဲ — static accesses တွေရဲ့ ရှေ့မှာ `Grid.` ကို ထည့်ပါတယ်။

```ts twoslash
class Grid {
  static origin = { x: 0, y: 0 };

  calculateDistanceFromOrigin(point: { x: number; y: number }) {
    let xDist = point.x - Grid.origin.x;
    let yDist = point.y - Grid.origin.y;
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
  }

  constructor(public scale: number) {}
}

let grid1 = new Grid(1.0); // 1x scale
let grid2 = new Grid(5.0); // 5x scale

console.log(grid1.calculateDistanceFromOrigin({ x: 10, y: 10 }));
console.log(grid2.calculateDistanceFromOrigin({ x: 10, y: 10 }));
```

## Abstract Classes (Abstract Classes များ)

Abstract classes တွေက — တခြား classes တွေ ဆင်းသက်လာလို့ရတဲ့ — base classes တွေပါ။ သူတို့ကိုတော့ တိုက်ရိုက် instance ဖန်တီးလို့ မရပါဘူး။ Interface တစ်ခုနဲ့ မတူဘဲ — abstract class တစ်ခုဟာ သူ့ရဲ့ members တွေအတွက် implementation အသေးစိတ်တွေ ပါဝင်နိုင်ပါတယ်။ `abstract` keyword ကို abstract classes တွေကိုရော — abstract class တစ်ခုထဲက abstract methods တွေကိုပါ — သတ်မှတ်ဖို့ သုံးပါတယ်။

```ts twoslash
abstract class Animal {
  abstract makeSound(): void;

  move(): void {
    console.log("roaming the earth...");
  }
}
```

Abstract class တစ်ခုထဲမှာ abstract လို့ အမှတ်အသား လုပ်ထားတဲ့ methods တွေက implementation မပါဝင်ဘဲ — derived classes တွေထဲမှာ implement (အကောင်အထည်ဖော်) လုပ်ပေးရပါမယ်။ Abstract methods တွေက interface methods တွေနဲ့ syntax ဆင်တူပါတယ်။ နှစ်ခုလုံးက method body မပါဝင်ဘဲ method တစ်ခုရဲ့ signature ကိုပဲ သတ်မှတ်ပေးပါတယ်။ ဒါပေမယ့် abstract methods တွေမှာ `abstract` keyword ပါဝင်ရမှာ ဖြစ်ပြီး — access modifiers တွေကတော့ ရွေးချယ်ပြီးမှ ထည့်လို့ ရပါတယ်။

```ts twoslash
// @errors: 2511 2339
abstract class Department {
  constructor(public name: string) {}

  printName(): void {
    console.log("Department name: " + this.name);
  }

  abstract printMeeting(): void; // must be implemented in derived classes
}

class AccountingDepartment extends Department {
  constructor() {
    super("Accounting and Auditing"); // constructors in derived classes must call super()
  }

  printMeeting(): void {
    console.log("The Accounting Department meets each Monday at 10am.");
  }

  generateReports(): void {
    console.log("Generating accounting reports...");
  }
}

let department: Department; // ok to create a reference to an abstract type
department = new Department(); // error: cannot create an instance of an abstract class
department = new AccountingDepartment(); // ok to create and assign a non-abstract subclass
department.printName();
department.printMeeting();
department.generateReports(); // error: department is not of type AccountingDepartment, cannot access generateReports
```

## Advanced Techniques (အဆင့်မြင့် နည်းစနစ်များ)

## Constructor functions (Constructor Functions များ)

TypeScript မှာ class တစ်ခုကို ကြေညာတဲ့အခါ — တကယ်တော့ declaration အများအပြားကို တစ်ပြိုင်နက်တည်း ဖန်တီးနေတာပါ။ ပထမတစ်ခုက class ရဲ့ _instance_ ရဲ့ type ပါ။

```ts twoslash
class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    return "Hello, " + this.greeting;
  }
}

let greeter: Greeter;
greeter = new Greeter("world");
console.log(greeter.greet()); // "Hello, world"
```

ဒီမှာ `let greeter: Greeter` လို့ ရေးတဲ့အခါ — `Greeter` class ရဲ့ instances တွေရဲ့ type အနေနဲ့ `Greeter` ကို သုံးနေတာပါ။ တခြား object-oriented languages တွေကနေ လာတဲ့ programmer တွေအတွက်တော့ ဒါက သိပ်ကို သဘာဝကျတဲ့ အရာတစ်ခုပါ။

ကျွန်တော်တို့က _constructor function_ လို့ ခေါ်တဲ့ value နောက်တစ်ခုကိုလည်း ဖန်တီးနေပါတယ်။ ဒါက class ရဲ့ instances တွေကို `new` နဲ့ တည်ဆောက်တဲ့အခါ ခေါ်လိုက်တဲ့ function ပါ။ လက်တွေ့မှာ ဒါက ဘယ်လိုပုံ ရှိလဲ မြင်ဖို့ — အပေါ်က ဥပမာကနေ ဖန်တီးလာတဲ့ JavaScript ကို ကြည့်ရအောင်:

```ts twoslash
// @strict: false
let Greeter = (function () {
  function Greeter(message) {
    this.greeting = message;
  }

  Greeter.prototype.greet = function () {
    return "Hello, " + this.greeting;
  };

  return Greeter;
})();

let greeter;
greeter = new Greeter("world");
console.log(greeter.greet()); // "Hello, world"
```

ဒီမှာ `let Greeter` က constructor function ကို လက်ခံရရှိမှာပါ။ `new` ကို ခေါ်ပြီး ဒီ function ကို run လုပ်တဲ့အခါ class ရဲ့ instance တစ်ခုကို ရပါတယ်။ Constructor function ထဲမှာ class ရဲ့ static members အားလုံးလည်း ပါဝင်ပါတယ်။ Class တစ်ခုချင်းစီမှာ _instance_ ဘက်ခြမ်းတစ်ခုနဲ့ _static_ ဘက်ခြမ်းတစ်ခု ဆိုပြီး ရှိတယ်လို့လည်း တွေးကြည့်လို့ ရပါတယ်။

ဒီကွာခြားချက်ကို ပြသဖို့ ဥပမာကို နည်းနည်း ပြင်ကြည့်ရအောင်:

```ts twoslash
// @strict: false
class Greeter {
  static standardGreeting = "Hello, there";
  greeting: string;
  greet() {
    if (this.greeting) {
      return "Hello, " + this.greeting;
    } else {
      return Greeter.standardGreeting;
    }
  }
}

let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet()); // "Hello, there"

let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";

let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet()); // "Hey there!"

let greeter3: Greeter;
greeter3 = new Greeter();
console.log(greeter3.greet()); // "Hey there!"
```

ဒီဥပမာမှာ `greeter1` က အရင်ကလိုပဲ အလုပ်လုပ်ပါတယ်။ `Greeter` class ကို instance ဖန်တီးပြီး ဒီ object ကို သုံးပါတယ်။ ဒါမျိုးကို အရင်က မြင်ဖူးပြီးသားပါ။

နောက်တစ်ဆင့်မှာတော့ class ကို တိုက်ရိုက် သုံးပါတယ်။ ဒီမှာ `greeterMaker` လို့ခေါ်တဲ့ variable အသစ်တစ်ခု ဖန်တီးပါတယ်။ ဒီ variable က class ကိုယ်တိုင်ကို သိမ်းထားမှာပါ — တစ်နည်းပြောရရင် သူ့ရဲ့ constructor function ကို သိမ်းထားတာပါ။ ဒီမှာ `typeof Greeter` ကို သုံးထားပါတယ် — ဆိုလိုတာက instance type အစား "`Greeter` class ကိုယ်တိုင် ရဲ့ type ကို ပေးပါ" လို့ ဆိုနေတာပါ။ ဒါမှမဟုတ် ပိုတိကျပြောရရင် — "`Greeter` လို့ခေါ်တဲ့ symbol ရဲ့ type ကို ပေးပါ" — ဆိုတာ constructor function ရဲ့ type ပဲ ဖြစ်ပါတယ်။

ဒီ type ထဲမှာ — `Greeter` class ရဲ့ instances တွေကို ဖန်တီးပေးတဲ့ constructor နဲ့အတူ — Greeter ရဲ့ static members တွေ အားလုံး ပါဝင်ပါမယ်။ ဒါကို `greeterMaker` ပေါ်မှာ `new` သုံးပြီး — `Greeter` ရဲ့ instances အသစ်တွေ ဖန်တီးကာ — အရင်ကလိုပဲ ခေါ်သုံးခြင်းအားဖြင့် ပြသထားပါတယ်။ Static property တစ်ခုကို ပြောင်းလဲတာက မကောင်းတဲ့ အလေ့အထအဖြစ် မှတ်ယူခံရတယ်ဆိုတာကိုလည်း ပြောထားသင့်ပါတယ် — ဒီမှာ `greeter3` ရဲ့ `standardGreeting` မှာ `"Hello, there"` အစား `"Hey there!"` ဖြစ်နေတာ တွေ့ရပါတယ်။

## Using a class as an interface (Class တစ်ခုကို Interface အဖြစ် အသုံးပြုခြင်း)

အရင် section မှာ ပြောခဲ့သလို — class declaration တစ်ခုက အရာနှစ်ခုကို ဖန်တီးပါတယ်: class ရဲ့ instances တွေကို ကိုယ်စားပြုတဲ့ type တစ်ခုနဲ့ constructor function တစ်ခုပါ။ Classes တွေက types တွေကို ဖန်တီးပေးတာမို့ — interfaces တွေ သုံးလို့ရမယ့် နေရာတွေမှာပဲ သူတို့ကိုလည်း သုံးနိုင်ပါတယ်။

```ts twoslash
// @strict: false
class Point {
  x: number;
  y: number;
}

interface Point3d extends Point {
  z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
```
