---
title: "Declaration Merging (Declaration ပေါင်းစပ်ခြင်း)"
description: "Declaration merging (အမည်တူ declaration များ တစ်ခုတည်း ပေါင်းစပ်ခြင်း) အကြောင်း — interfaces, namespaces, classes/functions/enums တို့နဲ့ merging, disallowed merges နဲ့ module/global augmentation"
order: 55
source: "https://www.typescriptlang.org/docs/handbook/declaration-merging.html"
status: translated
updated: 2026-09-05
---

## Introduction (နိဒါန်း)

TypeScript မှာ ထူးခြားတဲ့ အယူအဆတစ်ချို့က — JavaScript objects တွေရဲ့ ပုံသဏ္ဌာန်ကို type level (type အဆင့်) မှာ ဖော်ပြပါတယ်။
TypeScript အတွက် အထူးထူးခြားတဲ့ ဥပမာတစ်ခုကတော့ 'declaration merging' (declaration ပေါင်းစပ်ခြင်း) ဆိုတဲ့ အယူအဆ ဖြစ်ပါတယ်။
ဒီအယူအဆကို နားလည်ထားခြင်းက — ရှိပြီးသား JavaScript တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — သင့်ကို အားသာချက် တစ်ခု ပေးပါလိမ့်မယ်။
ဒါ့အပြင် ပိုပြီး အဆင့်မြင့်တဲ့ abstraction (စိတ္တဇ ဖော်ပြချက်) အယူအဆတွေဆီ လမ်းဖွင့်ပေးပါတယ်။

ဒီဆောင်းပါးမှာ "declaration merging" ဆိုတာ — compiler က အမည်တူ သီးခြား declaration နှစ်ခုကို — definition တစ်ခုတည်းအဖြစ် ပေါင်းစပ်လိုက်တာကို ဆိုလိုပါတယ်။
ဒီလို ပေါင်းစပ်ထားတဲ့ definition မှာ — မူရင်း declaration နှစ်ခုလုံးရဲ့ အင်္ဂါရပ်တွေ ပါဝင်ပါတယ်။
Declaration ဘယ်နှစ်ခုကိုမဆို ပေါင်းစပ်လို့ ရပါတယ် — declaration နှစ်ခုပဲ လို့ ကန့်သတ်မထားပါဘူး။

## Basic Concepts (အခြေခံ သဘောတရားများ)

TypeScript မှာ — declaration တစ်ခုက entity တွေကို အနည်းဆုံး အုပ်စု သုံးစုထဲက တစ်ခုမှာ ဖန်တီးပါတယ်: namespace, type, ဒါမှမဟုတ် value။
Namespace ဖန်တီးတဲ့ declarations တွေက namespace တစ်ခုကို ဖန်တီးပြီး — အဲဒီထဲမှာ dotted notation (အစက်ခံ သင်္ကေတ) နဲ့ ဝင်ရောက်လို့ရတဲ့ အမည်တွေ ပါဝင်ပါတယ်။
Type ဖန်တီးတဲ့ declarations တွေကတော့ နာမည်အတိုင်းပဲ — ကြေညာထားတဲ့ ပုံသဏ္ဌာန်နဲ့ မြင်နိုင်ပြီး — ပေးထားတဲ့ အမည်နဲ့ ချိတ်ဆက်ထားတဲ့ type တစ်ခုကို ဖန်တီးပါတယ်။
နောက်ဆုံး — value ဖန်တီးတဲ့ declarations တွေကတော့ output JavaScript ထဲမှာ မြင်နိုင်တဲ့ values တွေကို ဖန်တီးပါတယ်။

| Declaration Type | Namespace | Type | Value |
| ---------------- | :-------: | :--: | :---: |
| Namespace        |     X     |      |   X   |
| Class            |           |  X   |   X   |
| Enum             |           |  X   |   X   |
| Interface        |           |  X   |       |
| Type Alias       |           |  X   |       |
| Function         |           |      |   X   |
| Variable         |           |      |   X   |

Declaration တစ်ခုချင်းစီနဲ့အတူ ဘာတွေ ဖန်တီးလဲဆိုတာ နားလည်ထားခြင်းက — declaration merge တစ်ခု လုပ်တဲ့အခါ — ဘာတွေ ပေါင်းစပ်သွားလဲဆိုတာကို နားလည်ဖို့ ကူညီပေးပါလိမ့်မယ်။

## Merging Interfaces (Interface များ ပေါင်းစပ်ခြင်း)

အရိုးရှင်းဆုံး၊ ဖြစ်နိုင်ခြေ အများဆုံး — declaration merging အမျိုးအစားကတော့ interface merging ဖြစ်ပါတယ်။
အခြေခံအကျဆုံး အဆင့်မှာ — merge လုပ်ခြင်းက declaration နှစ်ခုလုံးရဲ့ members တွေကို — အမည်တူ interface တစ်ခုတည်းအဖြစ် — စက်ပိုင်းဆိုင်ရာ ပေါင်းစည်းလိုက်ပါတယ်။

```ts
interface Box {
  height: number;
  width: number;
}

interface Box {
  scale: number;
}

let box: Box = { height: 5, width: 6, scale: 10 };
```

Interfaces တွေရဲ့ non-function members တွေက တစ်ခုချင်းစီ ထူးခြားနေရပါမယ် (တူနေလို့ မရပါဘူး)။
တူနေတယ်ဆိုရင် — type ချင်း တူညီနေရပါမယ်။
Interfaces နှစ်ခုလုံးက — အမည်တူ ဒါပေမယ့် type မတူတဲ့ non-function member တစ်ခုကို ကြေညာထားရင် — compiler က error ထုတ်ပေးပါလိမ့်မယ်။

Function members တွေကျတော့ — အမည်တူ function member တစ်ခုချင်းစီကို — function တစ်ခုတည်းရဲ့ overload (ဝန်ပို အဓိပ္ပာယ်ဖွင့်ဆိုချက်) တစ်ခုကို ဖော်ပြနေတာအဖြစ် သဘောထားပါတယ်။
အထူးသတိပြုရမှာက — interface `A` က နောက်ထပ် interface `A` တစ်ခုနဲ့ ပေါင်းစပ်တဲ့အခါ — ဒုတိယ interface က ပထမ interface ထက် ဦးစားပေး အဆင့် (precedence) ပိုမြင့်ပါတယ်။

ဆိုလိုတာက — ဒီဥပမာမှာ:

```ts
interface Cloner {
  clone(animal: Animal): Animal;
}

interface Cloner {
  clone(animal: Sheep): Sheep;
}

interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}
```

Interface သုံးခုက ပေါင်းစပ်ပြီး — ဒီလို declaration တစ်ခုတည်း ဖြစ်သွားပါတယ်:

```ts
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```

အုပ်စုတစ်ခုချင်းစီရဲ့ element တွေက သူတို့ရဲ့ အစဉ်အတိုင်း တည်မြဲနေပေမယ့် — အုပ်စုတွေကိုယ်တိုင်ကတော့ — နောက်မှ ပေါင်းလိုက်တဲ့ overload sets တွေ ရှေ့ရောက်အောင် — ပေါင်းစပ်သွားတာကို သတိပြုပါ။

ဒီစည်းမျဉ်းရဲ့ ခြွင်းချက်တစ်ခုကတော့ specialized signatures (အထူးပြု signature များ) တွေ ဖြစ်ပါတယ်။
Signature တစ်ခုမှာ — type က _string literal type တစ်ခုတည်း_ ဖြစ်တဲ့ parameter (ဥပမာ — string literals တွေရဲ့ union တစ်ခု မဟုတ်ဘဲ) ပါနေရင် — အဲဒီ signature ကို ပေါင်းစပ်ထားတဲ့ overload list ရဲ့ ထိပ်ဆီ ပူဖောင်းလို တက်လာစေပါတယ်။

ဥပမာ — အောက်က interfaces တွေ အတူတူ ပေါင်းစပ်သွားပါလိမ့်မယ်:

```ts
interface Document {
  createElement(tagName: any): Element;
}
interface Document {
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
  createElement(tagName: string): HTMLElement;
  createElement(tagName: "canvas"): HTMLCanvasElement;
}
```

`Document` ရဲ့ ရလဒ် ပေါင်းစပ်ထားတဲ့ declaration က အောက်ပါအတိုင်း ဖြစ်ပါလိမ့်မယ်:

```ts
interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement;
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
  createElement(tagName: string): HTMLElement;
  createElement(tagName: any): Element;
}
```

## Merging Namespaces (Namespace များ ပေါင်းစပ်ခြင်း)

Interfaces တွေလိုပဲ — အမည်တူ namespaces တွေကလည်း — သူတို့ရဲ့ members တွေကို ပေါင်းစပ်ပါတယ်။
Namespaces တွေက namespace တစ်ခုရော value တစ်ခုရော — နှစ်ခုလုံး ဖန်တီးတာမို့ — နှစ်ခုလုံး ဘယ်လို ပေါင်းစပ်လဲဆိုတာ နားလည်ဖို့ လိုပါတယ်။

Namespaces တွေကို ပေါင်းစပ်ဖို့ — namespace တစ်ခုချင်းစီထဲမှာ ကြေညာထားတဲ့ exported interfaces တွေကနေ လာတဲ့ type definitions တွေကို ကိုယ်တိုင် ပေါင်းစပ်ပြီး — အထဲမှာ merged interface definitions တွေပါတဲ့ namespace တစ်ခုတည်း ဖြစ်သွားပါတယ်။

Namespace ရဲ့ value ကို ပေါင်းစပ်ဖို့ကျတော့ — declaration site (ကြေညာသည့်နေရာ) တစ်ခုချင်းစီမှာ — အဲဒီအမည်နဲ့ namespace တစ်ခု ရှိပြီးသားဆိုရင် — ရှိပြီးသား namespace ကို အခြေခံပြီး — ဒုတိယ namespace ရဲ့ exported members တွေကို ပထမ namespace ဆီ ထပ်ဖြည့်ခြင်းအားဖြင့် — ထပ်ပြီး extension လုပ်ပါတယ်။

ဒီဥပမာထဲက `Animals` ရဲ့ declaration merge က:

```ts
namespace Animals {
  export class Zebra {}
}

namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }
  export class Dog {}
}
```

ဒီတစ်ခုနဲ့ ညီမျှပါတယ်:

```ts
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }

  export class Zebra {}
  export class Dog {}
}
```

Namespace merging ရဲ့ ဒီပုံစံက အထောက်အကူဖြစ်စေတဲ့ အစပြုနေရာတစ်ခု ဖြစ်ပေမယ့် — non-exported members တွေမှာ ဘာတွေ ဖြစ်သွားလဲဆိုတာလည်း နားလည်ဖို့ လိုပါသေးတယ်။
Non-exported members တွေကို မူရင်း (merge မလုပ်ရသေးတဲ့) namespace ထဲမှာပဲ မြင်ရပါတယ်။ ဆိုလိုတာက — merge ပြီးနောက်မှာ — တခြား declarations တွေကနေ လာတဲ့ members တွေက — non-exported members တွေကို မမြင်နိုင်ပါဘူး။

ဒါကို ဒီဥပမာမှာ ပိုရှင်းရှင်းလင်းလင်း မြင်နိုင်ပါတယ်:

```ts
namespace Animal {
  let haveMuscles = true;

  export function animalsHaveMuscles() {
    return haveMuscles;
  }
}

namespace Animal {
  export function doAnimalsHaveMuscles() {
    return haveMuscles; // Error, because haveMuscles is not accessible here
  }
}
```

`haveMuscles` က export လုပ်ထားတာ မဟုတ်တာမို့ — သူနဲ့ အတူတူ merge မလုပ်ရသေးတဲ့ namespace ထဲမှာ ရှိတဲ့ `animalsHaveMuscles` function ကပဲ — အဲဒီ symbol ကို မြင်နိုင်ပါတယ်။
`doAnimalsHaveMuscles` function က — merge လုပ်ပြီးသား `Animal` namespace ရဲ့ အစိတ်အပိုင်း ဖြစ်နေပေမယ့် — ဒီ un-exported member ကို မမြင်နိုင်ပါဘူး။

## Merging Namespaces with Classes, Functions, and Enums (Namespaces များကို Classes, Functions နဲ့ Enums တို့နဲ့ ပေါင်းစပ်ခြင်း)

Namespaces တွေက — တခြား declaration အမျိုးအစားတွေနဲ့လည်း ပေါင်းစပ်လောက်အောင် ပြောင်းလွယ်ပါတယ်။
အဲဒီလို လုပ်ဖို့ — namespace declaration က သူနဲ့ ပေါင်းစပ်မယ့် declaration ရဲ့ နောက်မှာ လိုက်ရပါမယ်။ ရလာတဲ့ declaration မှာ — declaration အမျိုးအစား နှစ်ခုလုံးရဲ့ အင်္ဂါရပ်တွေ ပါဝင်ပါတယ်။
TypeScript က ဒီစွမ်းရည်ကို — JavaScript ရော တခြား programming languages တွေရဲ့ pattern တစ်ချို့ကို ပုံစံထုတ်ဖို့ သုံးပါတယ်။

### Merging Namespaces with Classes (Namespaces များကို Classes တွေနဲ့ ပေါင်းစပ်ခြင်း)

ဒါက — inner classes (အတွင်းပိုင်း class များ) တွေကို ဖော်ပြနိုင်တဲ့ နည်းလမ်းတစ်ခုကို သုံးစွဲသူအား ပေးပါတယ်။

```ts
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {}
}
```

Merged members တွေအတွက် မြင်နိုင်မှု (visibility) စည်းမျဉ်းတွေက — [Merging Namespaces](https://www.typescriptlang.org/docs/handbook) section မှာ ဖော်ပြခဲ့သလိုပဲ — ဖြစ်လို့ — merged class က မြင်နိုင်ဖို့ `AlbumLabel` class ကို export လုပ်ဖို့ လိုအပ်ပါတယ်။
နောက်ဆုံးရလဒ်က — တခြား class တစ်ခုရဲ့ အတွင်းမှာ စီမံခန့်ခွဲထားတဲ့ class တစ်ခု ဖြစ်ပါတယ်။
ပြီးတော့ — ရှိပြီးသား class တစ်ခုဆီ static members တွေ ထပ်ထည့်ဖို့လည်း namespaces တွေကို သုံးနိုင်ပါတယ်။

Inner classes တွေရဲ့ pattern အပြင် — function တစ်ခုကို ဖန်တီးပြီး — အဲဒီ function ပေါ်ကို properties တွေ ထပ်ဖြည့်ခြင်းအားဖြင့် function ကို ထပ်ပြီး extension လုပ်တဲ့ — JavaScript ရဲ့ အလေ့အကျင့်နဲ့လည်း သင်ရင်းနှီးပြီးသား ဖြစ်နိုင်ပါတယ်။
TypeScript က — ဒီလို definitions တွေကို type-safe (type ဘေးကင်းမှုရှိသော) နည်းလမ်းနဲ့ တည်ဆောက်ဖို့ declaration merging ကို သုံးပါတယ်။

```ts
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}

console.log(buildLabel("Sam Smith"));
```

အလားတူပဲ — namespaces တွေကို enums တွေကို static members တွေနဲ့ extension လုပ်ဖို့လည်း သုံးနိုင်ပါတယ်:

```ts
enum Color {
  red = 1,
  green = 2,
  blue = 4,
}

namespace Color {
  export function mixColor(colorName: string) {
    if (colorName == "yellow") {
      return Color.red + Color.green;
    } else if (colorName == "white") {
      return Color.red + Color.green + Color.blue;
    } else if (colorName == "magenta") {
      return Color.red + Color.blue;
    } else if (colorName == "cyan") {
      return Color.green + Color.blue;
    }
  }
}
```

## Disallowed Merges (ပေါင်းစပ်ခွင့်မရှိသော အရာများ)

Merge အားလုံးကိုတော့ TypeScript မှာ ခွင့်မပြုပါဘူး။
လောလောဆယ် — classes တွေက တခြား classes တွေ ဒါမှမဟုတ် variables တွေနဲ့ merge လုပ်လို့ မရပါဘူး။
Class merging ကို အတုယူဖို့ အချက်အလက်တွေအတွက် — [Mixins in TypeScript](/docs/typescript/mixins) section ကို ကြည့်ပါ။

## Module Augmentation (Module ဖြည့်စွက်ခြင်း)

JavaScript modules တွေက merging ကို ပံ့ပိုးမပေးပေမယ့် — သင် import လုပ်ပြီး update လုပ်ခြင်းအားဖြင့် — ရှိပြီးသား objects တွေကို patch (ဖာထေး) လုပ်နိုင်ပါတယ်။
ဥပမာအသေးစား Observable တစ်ခုကို ကြည့်ရအောင်:

```ts
// observable.ts
export class Observable<T> {
  // ... implementation left as an exercise for the reader ...
}

// map.ts
import { Observable } from "./observable";
Observable.prototype.map = function (f) {
  // ... another exercise for the reader
};
```

ဒါက TypeScript မှာလည်း အဆင်ပြေပြေ အလုပ်လုပ်ပါတယ် — ဒါပေမယ့် compiler က `Observable.prototype.map` အကြောင်း မသိပါဘူး။
ဒါကို compiler ကို အသိပေးဖို့ — module augmentation (module ဖြည့်စွက်ခြင်း) ကို သုံးနိုင်ပါတယ်:

```ts
// observable.ts
export class Observable<T> {
  // ... implementation left as an exercise for the reader ...
}

// map.ts
import { Observable } from "./observable";
declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>;
  }
}
Observable.prototype.map = function (f) {
  // ... another exercise for the reader
};

// consumer.ts
import { Observable } from "./observable";
import "./map";
let o: Observable<number>;
o.map((x) => x.toFixed());
```

Module အမည်ကို — `import`/`export` တွေထဲက module specifiers တွေကို ဖြေရှင်းသလိုမျိုးပဲ — ဖြေရှင်းပါတယ်။
အသေးစိတ်အတွက် [Modules](https://www.typescriptlang.org/docs/handbook/modules.html) ကို ကြည့်ပါ။
ပြီးတော့ — augmentation ထဲက declarations တွေကို — မူရင်း (original) နဲ့ အတူတူ file ထဲမှာ ကြေညာထားသလိုမျိုး — merge လုပ်ပါတယ်။

ဒါပေမယ့် — သတိထားရမယ့် ကန့်သတ်ချက် နှစ်ခု ရှိပါတယ်:

1. Augmentation ထဲမှာ top-level declarations အသစ်တွေ ကြေညာလို့ မရပါဘူး — ရှိပြီးသား declarations တွေကို patch လုပ်ရုံပဲ ရပါတယ်။
2. Default exports တွေကိုလည်း augment လုပ်လို့ မရပါဘူး — named exports တွေပဲ ရပါတယ် (ဘာလို့လဲဆိုတော့ export တစ်ခုကို သူ့ရဲ့ exported name နဲ့ augment လုပ်ဖို့ လိုအပ်ပြီး — `default` က reserved word (သိမ်းထားသော စကားလုံး) ဖြစ်လို့ပါ — အသေးစိတ်အတွက် [#14080](https://github.com/Microsoft/TypeScript/issues/14080) ကို ကြည့်ပါ)

### Global augmentation (Global ဖြည့်စွက်ခြင်း)

Module တစ်ခုရဲ့ အတွင်းကနေ — global scope (ကမ္ဘာ့နယ်ပယ်) ဆီ declarations တွေ ထပ်ထည့်နိုင်ပါတယ်:

```ts
// observable.ts
export class Observable<T> {
  // ... still no implementation ...
}

declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}

Array.prototype.toObservable = function () {
  // ...
};
```

Global augmentations တွေမှာ — module augmentations တွေနဲ့ အတူတူပဲ အပြုအမူနဲ့ ကန့်သတ်ချက်တွေ ရှိပါတယ်။
