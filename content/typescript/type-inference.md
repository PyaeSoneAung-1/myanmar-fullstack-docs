---
title: "Type Inference (Type Inference — Type ခန့်မှန်းခြင်း)"
description: "Explicit type annotation မပါဘဲ TypeScript က type တွေကို inference (ခန့်မှန်း) လုပ်တဲ့ နေရာများအကြောင်း — best common type နဲ့ contextual typing ဥပမာများ"
order: 65
source: "https://www.typescriptlang.org/docs/handbook/type-inference.html"
status: translated
updated: 2026-09-05
---

TypeScript မှာ — explicit type annotation (တိကျတဲ့ type သတ်မှတ်ချက်) မရှိတဲ့အခါ — type ဆိုင်ရာ အချက်အလက်တွေကို ဖြည့်ဆည်းပေးဖို့ type inference (type ခန့်မှန်းခြင်း) ကို သုံးတဲ့ နေရာများစွာ ရှိပါတယ်။ ဥပမာ — ဒီ code ထဲမှာ

```ts twoslash
let x = 3;
//  ^?
```

`x` variable ရဲ့ type ကို `number` အဖြစ် inference (ခန့်မှန်း) လုပ်ပါတယ်။
ဒီလို inference မျိုးက — variables နဲ့ members တွေကို initializing (ကနဦးတန်ဖိုး စတင်သတ်မှတ်) လုပ်တဲ့အခါ၊ parameter default values (parameter ရဲ့ ပုံသေတန်ဖိုးများ) သတ်မှတ်တဲ့အခါ၊ ပြီးတော့ function return types (function က ပြန်ပေးတဲ့ type များ) ကို ဆုံးဖြတ်တဲ့အခါတွေမှာ ဖြစ်ပေါ်ပါတယ်။

အများစုမှာ — type inference က ရိုးရှင်းပါတယ်။
အောက်က sections တွေမှာ — types တွေကို ဘယ်လို inference လုပ်လဲဆိုတဲ့ — သိမ်မွေ့နက်နဲတဲ့ အချက်လေးတွေ (nuances) တစ်ချို့ကို လေ့လာကြည့်ရအောင်။

## Best common type (Best Common Type — အကောင်းဆုံး ဘုံ Type)

Type inference တစ်ခုကို expressions (ဖော်ပြချက်များ) အများအပြားကနေ ပြုလုပ်တဲ့အခါ — အဲဒီ expressions တွေရဲ့ types တွေကို သုံးပြီး "best common type" (အကောင်းဆုံး ဘုံ type) ကို တွက်ချက်ပါတယ်။ ဥပမာ —

```ts twoslash
let x = [0, 1, null];
//  ^?
```

အပေါ်က ဥပမာမှာ `x` ရဲ့ type ကို inference လုပ်ဖို့ — array element တစ်ခုချင်းစီရဲ့ type ကို ထည့်သွင်း စဉ်းစားရပါမယ်။
ဒီမှာ array ရဲ့ type အတွက် ရွေးစရာ နှစ်ခု ပေးထားပါတယ်: `number` နဲ့ `null`။
Best common type algorithm က — candidate type (ကိုယ်စားလှယ် type) တစ်ခုချင်းစီကို စဉ်းစားပြီး — တခြား candidates တွေ အားလုံးနဲ့ compatible (လိုက်ဖက်) တဲ့ type ကို ရွေးချယ်ပါတယ်။

Best common type ကို ပေးထားတဲ့ candidate types တွေထဲကပဲ ရွေးရတာမို့ — types တွေက common structure (ဘုံ ဖွဲ့စည်းပုံ) တစ်ခုကို မျှဝေထားပေမယ့် — candidates အားလုံးရဲ့ super type (အားလုံးကို လွှမ်းခြုံသော type) ဖြစ်တဲ့ type တစ်ခုတည်း မရှိတဲ့ cases တွေ ရှိပါတယ်။ ဥပမာ:

```ts twoslash
// @strict: false
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
// ---cut---
let zoo = [new Rhino(), new Elephant(), new Snake()];
//    ^?
```

အကောင်းဆုံးကတော့ — `zoo` ကို `Animal[]` အဖြစ် inference လုပ်ချင်ကြမှာပါ — ဒါပေမယ့် array ထဲမှာ အတိအကျ `Animal` type ဖြစ်တဲ့ object တစ်ခုမှ မရှိတာမို့ — array element type အကြောင်း inference ဘာမှ မလုပ်ပါဘူး။
ဒါကို ပြုပြင်ဖို့ — candidates တွေ အားလုံးရဲ့ super type ဖြစ်တဲ့ type တစ်ခုတည်း မရှိတဲ့အခါ — type ကို တိကျစွာ (explicitly) ပေးလိုက်ပါ:

```ts twoslash
// @strict: false
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
// ---cut---
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
//    ^?
```

Best common type တစ်ခုမှ မတွေ့ရတဲ့အခါ — ရလာတဲ့ inference က union array type — `(Rhino | Elephant | Snake)[]` — ဖြစ်ပါတယ်။

## Contextual Typing (Contextual Typing — Context အလိုက် Type သတ်မှတ်ခြင်း)

TypeScript မှာ type inference က တစ်ချို့ cases တွေမှာ "ပြောင်းပြန် ဦးတည်ချက်" အနေနဲ့လည်း အလုပ်လုပ်ပါတယ်။
ဒါကို "contextual typing" (context — နေရာပတ်ဝန်းကျင် — အလိုက် type သတ်မှတ်ခြင်း) လို့ ခေါ်ပါတယ်။ Expression တစ်ခုရဲ့ type ကို — သူ့ရဲ့ တည်နေရာ (location) ကနေ ဆင့်ပွား သိရှိနိုင်တဲ့အခါ — contextual typing ဖြစ်ပေါ်ပါတယ်။ ဥပမာ:

```ts twoslash
// @errors: 2339
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button);
  console.log(mouseEvent.kangaroo);
};
```

ဒီမှာ TypeScript ရဲ့ type checker က — assignment ရဲ့ ညာဘက်ခြမ်းမှာရှိတဲ့ function expression ရဲ့ type ကို inference လုပ်ဖို့ — `Window.onmousedown` function ရဲ့ type ကို သုံးပါတယ်။
အဲဒီလို လုပ်တဲ့အခါ — `mouseEvent` parameter ရဲ့ [type](https://developer.mozilla.org/docs/Web/API/MouseEvent) ကိုပါ inference လုပ်နိုင်ခဲ့ပါတယ် — ဒီ type မှာ `button` property ပါဝင်ပေမယ့် — `kangaroo` property ကတော့ မပါဝင်ပါဘူး။

ဒါ အလုပ်လုပ်တာက — window ရဲ့ type မှာ `onmousedown` ကို ကြေညာပြီးသား ဖြစ်လို့ပါ:

```ts
// Declares there is a global variable called 'window'
declare var window: Window & typeof globalThis;

// Which is declared as (simplified):
interface Window extends GlobalEventHandlers {
  // ...
}

// Which defines a lot of known handler events
interface GlobalEventHandlers {
  onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  // ...
}
```

TypeScript က တခြား contexts တွေမှာပါ types တွေကို inference လုပ်လောက်အောင် လိမ္မာပါတယ်:

```ts twoslash
// @errors: 2339
window.onscroll = function (uiEvent) {
  console.log(uiEvent.button);
};
```

အပေါ်က function ကို `Window.onscroll` ဆီ assign လုပ်နေတာမို့ — `uiEvent` က အရင်ဥပမာက [MouseEvent](https://developer.mozilla.org/docs/Web/API/MouseEvent) မဟုတ်ဘဲ — [UIEvent](https://developer.mozilla.org/docs/Web/API/UIEvent) ဖြစ်တယ်ဆိုတာ TypeScript က သိပါတယ်။ `UIEvent` objects တွေမှာ `button` property မပါဝင်တာမို့ — TypeScript က error တစ်ခု ပစ်လိုက်မှာ ဖြစ်ပါတယ်။

ဒီ function က contextually typed ဖြစ်တဲ့ နေရာမှာ မရှိဘူးဆိုရင် — function ရဲ့ argument က implicitly (သွယ်ဝိုက်၍) `any` type ရှိမှာ ဖြစ်ပြီး — error တစ်ခုမှ ထုတ်ပေးမှာ မဟုတ်ပါဘူး ([`noImplicitAny`](https://www.typescriptlang.org/tsconfig) option သုံးနေတယ်ဆိုရင်တော့ လွဲပါတယ်):

```ts twoslash
// @noImplicitAny: false
const handler = function (uiEvent) {
  console.log(uiEvent.button); // <- OK
};
```

ပြီးတော့ — contextual type တစ်ခုခုကို override (ကျော်လွန်၍ အစားထိုး) လုပ်ဖို့ — function ရဲ့ argument ကို type အချက်အလက်တွေ တိကျစွာ ပေးနိုင်ပါတယ်:

```ts twoslash
window.onscroll = function (uiEvent: any) {
  console.log(uiEvent.button); // <- Now, no error is given
};
```

ဒါပေမယ့် — `uiEvent` မှာ `button` လို့ခေါ်တဲ့ property မရှိတာမို့ — ဒီ code က `undefined` ကို log လုပ်မှာ ဖြစ်ပါတယ်။

Contextual typing က cases တော်တော်များများမှာ အကျုံးဝင်ပါတယ်။
အသုံးများတဲ့ cases တွေထဲမှာ — function calls တွေရဲ့ arguments တွေ၊ assignments တွေရဲ့ ညာဘက်ခြမ်းတွေ၊ type assertions (type အတည်ပြုချက်များ)၊ object နဲ့ array literals တွေရဲ့ members တွေ၊ ပြီးတော့ return statements တွေ ပါဝင်ပါတယ်။
Contextual type က best common type ထဲမှာ candidate type တစ်ခုအနေနဲ့လည်း ဆောင်ရွက်ပါတယ်။ ဥပမာ:

```ts twoslash
// @strict: false
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
// ---cut---
function createZoo(): Animal[] {
  return [new Rhino(), new Elephant(), new Snake()];
}
```

ဒီဥပမာမှာ — best common type အတွက် candidate လေးခု ရှိပါတယ်: `Animal`, `Rhino`, `Elephant`, နဲ့ `Snake`။
ဒါတွေထဲကမှ — `Animal` ကို best common type algorithm က ရွေးချယ်နိုင်ပါတယ်။
