---
title: "Declaration Reference (Declaration Files ဥပမာများ)"
description: "အရည်အသွေးမြင့် declaration files (.d.ts) ရေးနည်း — API pattern တစ်ခုချင်းစီအတွက် usage နမူနာနဲ့ ကိုက်ညီတဲ့ declaration ကို အတွဲလိုက် ဥပမာပြထားခြင်း"
order: 20
source: "https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html"
status: translated
updated: 2026-09-02
---

ဒီ guide ရဲ့ ရည်ရွယ်ချက်က — အရည်အသွေးမြင့် (high-quality) definition file (type definitions တွေ ပါဝင်တဲ့ `.d.ts` ဖိုင်) တစ်ခုကို ဘယ်လို ရေးမလဲ သင်ပေးဖို့ပါ။ ဒီ guide ကို — API တစ်ခုရဲ့ documentation နဲ့အတူ အဲဒီ API ကို သုံးတဲ့ နမူနာ (sample usage) တွေကို ပြပြီး — ကိုက်ညီမယ့် declaration (ကြေညာချက်) ကို ဘယ်လို ရေးရမလဲ ရှင်းပြတဲ့ ပုံစံနဲ့ တည်ဆောက်ထားပါတယ်။

ဒီ examples တွေကို — ရှုပ်ထွေးမှု တဖြည်းဖြည်း မြင့်တက်သွားတဲ့ အစီအစဉ် (approximately increasing order of complexity) အတိုင်း စီစဉ်ထားပါတယ်။

## Property တွေပါတဲ့ Objects (Objects with Properties)

**Documentation (API ဖော်ပြချက်)**

> Global variable `myLib` မှာ — greeting (နှုတ်ခွန်းဆက်စကား) တွေ ဖန်တီးဖို့ `makeGreeting` ဆိုတဲ့ function တစ်ခု ရှိပြီး — အခုထိ ဖန်တီးပြီးသား greeting အရေအတွက်ကို ဖော်ပြတဲ့ `numberOfGreetings` ဆိုတဲ့ property တစ်ခုလည်း ရှိပါတယ်။

**Code (သုံးစွဲပုံ နမူနာ)**

```ts
let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);

let count = myLib.numberOfGreetings;
```

**Declaration (ကြေညာချက်)**

`declare namespace` ကို သုံးပြီး — dot notation (`.` နဲ့ ဆင့်ကာ ဝင်ရောက်သုံးတဲ့ပုံစံ) နဲ့ သုံးစွဲရတဲ့ types တွေ ဒါမှမဟုတ် values တွေကို ဖော်ပြနိုင်ပါတယ်။

```ts
declare namespace myLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}
```

## Overload လုပ်ထားတဲ့ Functions (Overloaded Functions)

**Documentation (API ဖော်ပြချက်)**

`getWidget` function က — number တစ်ခု လက်ခံရင် Widget တစ်ခုကို ပြန်ပေးပြီး — string တစ်ခု လက်ခံရင်တော့ Widget array တစ်ခုကို ပြန်ပေးပါတယ်။

**Code (သုံးစွဲပုံ နမူနာ)**

```ts
let x: Widget = getWidget(43);

let arr: Widget[] = getWidget("all of them");
```

**Declaration (ကြေညာချက်)**

```ts
declare function getWidget(n: number): Widget;
declare function getWidget(s: string): Widget[];
```

## ပြန်သုံးလို့ရတဲ့ Types — Interfaces (Reusable Types)

**Documentation (API ဖော်ပြချက်)**

> Greeting တစ်ခုကို သတ်မှတ်တဲ့အခါ — `GreetingSettings` object တစ်ခုကို ထည့်ပေးရပါတယ်။ ဒီ object မှာ အောက်ပါ properties တွေ ရှိပါတယ်:
>
> 1 - greeting: Mandatory string (မဖြစ်မနေ ထည့်ရမယ့် string)
>
> 2 - duration: Optional (ထည့်ချင်မှ ထည့်ရတဲ့) ကြာချိန် — milliseconds နဲ့
>
> 3 - color: Optional string, ဥပမာ '#ff00ff'

**Code (သုံးစွဲပုံ နမူနာ)**

```ts
greet({
  greeting: "hello world",
  duration: 4000
});
```

**Declaration (ကြေညာချက်)**

Property တွေပါတဲ့ type တစ်ခုကို သတ်မှတ်ဖို့ `interface` (ပုံသဏ္ဌာန် သတ်မှတ်ချက်) ကို သုံးပါတယ်။

```ts
interface GreetingSettings {
  greeting: string;
  duration?: number;
  color?: string;
}

declare function greet(setting: GreetingSettings): void;
```

## ပြန်သုံးလို့ရတဲ့ Types — Type Aliases (Reusable Types)

**Documentation (API ဖော်ပြချက်)**

> Greeting တစ်ခုကို မျှော်လင့်ထားတဲ့ နေရာမှန်သမျှ — `string` တစ်ခု၊ `string` ပြန်ပေးတဲ့ function တစ်ခု၊ ဒါမှမဟုတ် `Greeter` instance (class ကနေ ဖန်တီးထားတဲ့ object) တစ်ခု ပေးလို့ရပါတယ်။

**Code (သုံးစွဲပုံ နမူနာ)**

```ts
function getGreeting() {
  return "howdy";
}
class MyGreeter extends Greeter {}

greet("hello");
greet(getGreeting);
greet(new MyGreeter());
```

**Declaration (ကြေညာချက်)**

Type alias (type တစ်ခုအတွက် နာမည်တစ်ခု သတ်မှတ်ပေးတဲ့ပုံစံ) ကို သုံးပြီး — type တစ်ခုအတွက် အတိုကောက် (shorthand) ဖန်တီးနိုင်ပါတယ်:

```ts
type GreetingLike = string | (() => string) | MyGreeter;

declare function greet(g: GreetingLike): void;
```

## Types စုစည်းခြင်း (Organizing Types)

**Documentation (API ဖော်ပြချက်)**

> `greeter` object က file တစ်ခုထဲကို log (မှတ်တမ်း) ရေးနိုင်သလို — alert (သတိပေးချက်) တစ်ခုကိုလည်း ပြသနိုင်ပါတယ်။ `.log(...)` ကို LogOptions တွေနဲ့ သုံးနိုင်ပြီး — `.alert(...)` ကိုတော့ alert options တွေနဲ့ သုံးနိုင်ပါတယ်။

**Code (သုံးစွဲပုံ နမူနာ)**

```ts
const g = new Greeter("Hello");
g.log({ verbose: true });
g.alert({ modal: false, title: "Current Greeting" });
```

**Declaration (ကြေညာချက်)**

Types တွေကို စနစ်တကျ စုစည်းဖို့ namespaces (နာမည်စုတွေကို အုပ်စုဖွဲ့ထားတဲ့ နေရာ) တွေကို သုံးပါတယ်။

```ts
declare namespace GreetingLib {
  interface LogOptions {
    verbose?: boolean;
  }
  interface AlertOptions {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

Nested namespaces (အထပ်လိုက် namespaces) တွေကိုလည်း declaration တစ်ခုထဲမှာတင် ဖန်တီးနိုင်ပါတယ်:

```ts
declare namespace GreetingLib.Options {
  // Refer to via GreetingLib.Options.Log
  interface Log {
    verbose?: boolean;
  }
  interface Alert {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

## Classes

**Documentation (API ဖော်ပြချက်)**

> `Greeter` object ကို instantiate (class ကနေ object အသစ် ဖန်တီး) လုပ်ပြီး greeter တစ်ခု ဖန်တီးနိုင်သလို — အဲဒီကနေ extend (အမွေခံ ချဲ့ထွင်) လုပ်ပြီး ကိုယ်ပိုင်ပုံစံ greeter တစ်ခုကိုလည်း ဖန်တီးနိုင်ပါတယ်။

**Code (သုံးစွဲပုံ နမူနာ)**

```ts
const myGreeter = new Greeter("hello, world");
myGreeter.greeting = "howdy";
myGreeter.showGreeting();

class SpecialGreeter extends Greeter {
  constructor() {
    super("Very special greetings");
  }
}
```

**Declaration (ကြေညာချက်)**

`declare class` ကို သုံးပြီး — class တစ်ခု ဒါမှမဟုတ် class ပုံစံ object တစ်ခုကို ဖော်ပြနိုင်ပါတယ်။ Classes တွေမှာ — constructor တစ်ခုအပြင် properties တွေနဲ့ methods တွေလည်း ပါဝင်နိုင်ပါတယ်။

```ts
declare class Greeter {
  constructor(greeting: string);

  greeting: string;
  showGreeting(): void;
}
```

## Global Variables (နေရာတိုင်းက သုံးလို့ရတဲ့ Variables)

**Documentation (API ဖော်ပြချက်)**

> Global variable `foo` ထဲမှာ — အခုလက်ရှိ ရှိနေတဲ့ widgets အရေအတွက်ကို သိမ်းဆည်းထားပါတယ်။

**Code (သုံးစွဲပုံ နမူနာ)**

```ts
console.log("Half the number of widgets is " + foo / 2);
```

**Declaration (ကြေညာချက်)**

Variables တွေကို ကြေညာဖို့ `declare var` ကို သုံးပါတယ်။ Variable က read-only (ဖတ်ရုံပဲ ရပြီး ပြန်ရေးလို့မရတဲ့) ဆိုရင် — `declare const` ကို သုံးနိုင်ပါတယ်။ Variable က block-scoped (block `{}` ထဲမှာပဲ သက်တမ်းရှိတဲ့) ဆိုရင်တော့ `declare let` ကိုလည်း သုံးနိုင်ပါတယ်။

```ts
/** The number of widgets present */
declare var foo: number;
```

## Global Functions (နေရာတိုင်းက ခေါ်လို့ရတဲ့ Functions)

**Documentation (API ဖော်ပြချက်)**

> `greet` function ကို string တစ်ခုနဲ့ ခေါ်လိုက်ရင် — user ကို greeting တစ်ခု ပြသနိုင်ပါတယ်။

**Code (သုံးစွဲပုံ နမူနာ)**

```ts
greet("hello, world");
```

**Declaration (ကြေညာချက်)**

Functions တွေကို ကြေညာဖို့ `declare function` ကို သုံးပါတယ်။

```ts
declare function greet(greeting: string): void;
```

## ဆက်လက်လေ့လာရန်

- [Type Declarations](/docs/typescript/type-declarations) — `.d.ts` files တွေနဲ့ type definitions တွေ ဘယ်ကလာလဲဆိုတဲ့ အခြေခံ
- [နေ့စဉ်သုံး Types](/docs/typescript/everyday-types) — interfaces နဲ့ type aliases
- [Classes](/docs/typescript/classes) — class တွေနဲ့ သူတို့ရဲ့ type ပုံစံတွေ
