---
title: "Mixins (Mixin များ)"
description: "Class တွေကို reusable components ကနေ တည်ဆောက်တဲ့ mixin pattern အကြောင်း — class expression pattern, constrained mixins, alternative pattern, constraints နဲ့ edge cases (decorators, static property mixins)"
order: 59
source: "https://www.typescriptlang.org/docs/handbook/mixins.html"
status: translated
updated: 2026-09-05
---

ပုံမှန် OO (object-oriented) hierarchies (အဆင့်ဆင့် ဖွဲ့စည်းပုံများ) တွေနဲ့အတူ — class တွေကို reusable components (ပြန်လည်သုံးလို့ရတဲ့ အစိတ်အပိုင်းများ) တွေကနေ တည်ဆောက်တဲ့ နောက်ထပ် လူကြိုက်များတဲ့ နည်းလမ်းတစ်ခုကတော့ — ရိုးရှင်းတဲ့ partial classes (တစ်စိတ်တစ်ပိုင်း class များ) တွေကို ပေါင်းစပ်ပြီး class အသစ်တွေ တည်ဆောက်ခြင်း ဖြစ်ပါတယ်။
Scala လိုမျိုး languages တွေမှာ ရှိတဲ့ mixins ဒါမှမဟုတ် traits ဆိုတဲ့ အယူအဆနဲ့ သင်ရင်းနှီးပြီးသား ဖြစ်နိုင်ပါတယ် — ဒီ pattern က JavaScript community ထဲမှာလည်း အတော်လေး လူကြိုက်များလာခဲ့ပါတယ်။

## How Does A Mixin Work? (Mixin က ဘယ်လို အလုပ်လုပ်သလဲ)

ဒီ pattern က — base class တစ်ခုကို extension လုပ်ဖို့ — generics တွေကို class inheritance (class အမွေဆက်ခံခြင်း) နဲ့ တွဲသုံးပါတယ်။
TypeScript မှာ mixin အတွက် အကောင်းဆုံး ပံ့ပိုးမှုကတော့ class expression pattern ကနေ ရရှိပါတယ်။
ဒီ pattern က JavaScript မှာ ဘယ်လို အလုပ်လုပ်လဲဆိုတာကို [ဒီမှာ](https://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) ဖတ်ရှုနိုင်ပါတယ်။

စလိုက်ဖို့အတွက် — mixins တွေကို အပေါ်ကနေ အသုံးချမယ့် class တစ်ခု လိုပါမယ်:

```ts twoslash
class Sprite {
  name = "";
  x = 0;
  y = 0;

  constructor(name: string) {
    this.name = name;
  }
}
```

ပြီးတော့ — base class ကို extend လုပ်တဲ့ class expression တစ်ခုကို ပြန်ပေးတဲ့ — type တစ်ခုနဲ့ factory function (စက်ရုံကဲ့သို့ ထုတ်လုပ်ပေးသော function) တစ်ခု လိုပါမယ်။

```ts twoslash
// To get started, we need a type which we'll use to extend
// other classes from. The main responsibility is to declare
// that the type being passed in is a class.

type Constructor = new (...args: any[]) => {};

// This mixin adds a scale property, with getters and setters
// for changing it with an encapsulated private property:

function Scale<TBase extends Constructor>(Base: TBase) {
  return class Scaling extends Base {
    // Mixins may not declare private/protected properties
    // however, you can use ES2020 private fields
    _scale = 1;

    setScale(scale: number) {
      this._scale = scale;
    }

    get scale(): number {
      return this._scale;
    }
  };
}
```

ဒါတွေ အားလုံး အဆင်သင့်ဖြစ်သွားရင် — mixins တွေ အသုံးချပြီးသား base class တစ်ခုကို ကိုယ်စားပြုတဲ့ class တစ်ခုကို ဖန်တီးနိုင်ပါပြီ:

```ts twoslash
class Sprite {
  name = "";
  x = 0;
  y = 0;

  constructor(name: string) {
    this.name = name;
  }
}
type Constructor = new (...args: any[]) => {};
function Scale<TBase extends Constructor>(Base: TBase) {
  return class Scaling extends Base {
    // Mixins may not declare private/protected properties
    // however, you can use ES2020 private fields
    _scale = 1;

    setScale(scale: number) {
      this._scale = scale;
    }

    get scale(): number {
      return this._scale;
    }
  };
}
// ---cut---
// Compose a new class from the Sprite class,
// with the Mixin Scale applier:
const EightBitSprite = Scale(Sprite);

const flappySprite = new EightBitSprite("Bird");
flappySprite.setScale(0.8);
console.log(flappySprite.scale);
```

## Constrained Mixins (Constraint ချထားသော Mixins)

အပေါ်က ပုံစံမှာ — mixins တွေက သူတို့ အသုံးချမယ့် class အကြောင်း ဘာမှ မသိကြတာမို့ — သင်လိုချင်တဲ့ ဒီဇိုင်းကို ဖန်တီးဖို့ ခက်ခဲစေနိုင်ပါတယ်။

ဒါကို ပုံစံထုတ်ဖို့ — original constructor type ကို generic argument တစ်ခု လက်ခံနိုင်အောင် ပြုပြင်လိုက်ပါမယ်။

```ts twoslash
// This was our previous constructor:
type Constructor = new (...args: any[]) => {};
// Now we use a generic version which can apply a constraint on
// the class which this mixin is applied to
type GConstructor<T = {}> = new (...args: any[]) => T;
```

ဒါက — constraint ချထားတဲ့ base classes တွေနဲ့ပဲ အလုပ်လုပ်တဲ့ classes တွေကို ဖန်တီးနိုင်စေပါတယ်:

```ts twoslash
type GConstructor<T = {}> = new (...args: any[]) => T;
class Sprite {
  name = "";
  x = 0;
  y = 0;

  constructor(name: string) {
    this.name = name;
  }
}
// ---cut---
type Positionable = GConstructor<{ setPos: (x: number, y: number) => void }>;
type Spritable = GConstructor<Sprite>;
type Loggable = GConstructor<{ print: () => void }>;
```

ပြီးရင် — တည်ဆောက်ဖို့ အတွက် တိကျတဲ့ base class တစ်ခု ရှိမှပဲ အလုပ်လုပ်နိုင်တဲ့ mixins တွေကို ဖန်တီးနိုင်ပါတယ်:

```ts twoslash
type GConstructor<T = {}> = new (...args: any[]) => T;
class Sprite {
  name = "";
  x = 0;
  y = 0;

  constructor(name: string) {
    this.name = name;
  }
}
type Positionable = GConstructor<{ setPos: (x: number, y: number) => void }>;
type Spritable = GConstructor<Sprite>;
type Loggable = GConstructor<{ print: () => void }>;
// ---cut---

function Jumpable<TBase extends Positionable>(Base: TBase) {
  return class Jumpable extends Base {
    jump() {
      // This mixin will only work if it is passed a base
      // class which has setPos defined because of the
      // Positionable constraint.
      this.setPos(0, 20);
    }
  };
}
```

## Alternative Pattern (အခြားနည်းလမ်းတစ်ခု)

ဒီ document ရဲ့ အရင်ဗားရှင်းတွေက — runtime နဲ့ type hierarchies တွေကို သပ်သပ်စီ ဖန်တီးပြီး — နောက်ဆုံးမှာ ပေါင်းစပ်လိုက်တဲ့ — mixins ရေးနည်းတစ်မျိုးကို အကြံပြုခဲ့ပါတယ်:

```ts twoslash
// @strict: false
// Each mixin is a traditional ES class
class Jumpable {
  jump() {}
}

class Duckable {
  duck() {}
}

// Including the base
class Sprite {
  x = 0;
  y = 0;
}

// Then you create an interface which merges
// the expected mixins with the same name as your base
interface Sprite extends Jumpable, Duckable {}
// Apply the mixins into the base class via
// the JS at runtime
applyMixins(Sprite, [Jumpable, Duckable]);

let player = new Sprite();
player.jump();
console.log(player.x, player.y);

// This can live anywhere in your codebase:
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}
```

ဒီ pattern က compiler အပေါ် အားကိုးမှု နည်းပြီး — runtime ရော type-system ရော နှစ်ခုလုံး မှန်ကန်စွာ sync (ကိုက်ညီ) နေအောင် — သင့် codebase ပေါ်မှာ ပိုပြီး မှီခိုပါတယ်။

## Constraints (ကန့်သတ်ချက်များ)

Mixin pattern ကို TypeScript compiler ထဲမှာ code flow analysis (code စီးဆင်းမှု ခွဲခြမ်းစိတ်ဖြာခြင်း) အားဖြင့် — native (အခြေခံအားဖြင့်) ပံ့ပိုးထားပါတယ်။
Native ပံ့ပိုးမှုရဲ့ အစွန်းအဖျားတွေကို ထိမိနိုင်တဲ့ cases အနည်းငယ် ရှိပါတယ်။

#### Decorators and Mixins [`#4881`](https://github.com/microsoft/TypeScript/issues/4881) (Decorators နဲ့ Mixins)

Decorators တွေကို code flow analysis ကနေ mixins တွေ ဖြည့်ဆည်းဖို့ သုံးလို့ မရပါဘူး:

```ts twoslash
// @experimentalDecorators
// @errors: 2339
// A decorator function which replicates the mixin pattern:
const Pausable = (target: typeof Player) => {
  return class Pausable extends target {
    shouldFreeze = false;
  };
};

@Pausable
class Player {
  x = 0;
  y = 0;
}

// The Player class does not have the decorator's type merged:
const player = new Player();
player.shouldFreeze;

// The runtime aspect could be manually replicated via
// type composition or interface merging.
type FreezablePlayer = Player & { shouldFreeze: boolean };

const playerTwo = (new Player() as unknown) as FreezablePlayer;
playerTwo.shouldFreeze;
```

#### Static Property Mixins [`#17829`](https://github.com/microsoft/TypeScript/issues/17829) (Static Property Mixins)

ဒါက constraint ထက် gotcha (သတိထားရမယ့် အကွက်လေး) လို့ ပြောရမှာ ဖြစ်ပါတယ်။
Class expression pattern က singletons (တစ်ခုတည်းသော instance များ) တွေကို ဖန်တီးတာမို့ — မတူညီတဲ့ variable types တွေကို ပံ့ပိုးဖို့ type system မှာ map (ဆက်စပ်ဖော်ပြ) လုပ်လို့ မရပါဘူး။

ဒါကို — generic တစ်ခုကို မူတည်ပြီး ကွဲပြားတဲ့ classes တွေကို ပြန်ပေးတဲ့ functions တွေ သုံးပြီး ရှောင်လွှဲနိုင်ပါတယ်:

```ts twoslash
function base<T>() {
  class Base {
    static prop: T;
  }
  return Base;
}

function derived<T>() {
  class Derived extends base<T>() {
    static anotherProp: T;
  }
  return Derived;
}

class Spec extends derived<string>() {}

Spec.prop; // string
Spec.anotherProp; // string
```
