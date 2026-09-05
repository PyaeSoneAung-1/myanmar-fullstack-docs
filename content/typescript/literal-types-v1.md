---
title: "Literal Types (Literal Type များ)"
description: "Literal type များ၏ သဘောတရား — literal narrowing ဖြစ်စဉ်၊ string/numeric/boolean literal types များနှင့် union types, overloads, config values တို့တွင် အသုံးပြုပုံ"
order: 79
source: "https://www.typescriptlang.org/docs/handbook/literal-types.html"
status: translated
updated: 2026-09-05
---

Literal ဆိုတာ — စုပေါင်း (collective) type တစ်ခုရဲ့ ပိုပြီး ခိုင်မာတိကျတဲ့ sub-type တစ်ခုပါ။
ဆိုလိုတာက — type system ထဲမှာ `"Hello World"` က `string` တစ်ခု ဖြစ်ပေမယ့် — `string` တစ်ခုက `"Hello World"` မဟုတ်ပါဘူး။

TypeScript မှာ ဒီနေ့ ရရှိနိုင်တဲ့ literal types အစု သုံးစု ရှိပါတယ်: strings, numbers နဲ့ booleans တွေပါ။
Literal types တွေကို သုံးခြင်းအားဖြင့် — string, number ဒါမှမဟုတ် boolean တစ်ခုမှာ ရှိရမယ့် အတိအကျ value တစ်ခုကို ခွင့်ပြုနိုင်ပါတယ်။

## Literal Narrowing (Literal Type ကျဉ်းမြောင်းလာခြင်း)

`var` ဒါမှမဟုတ် `let` နဲ့ variable တစ်ခုကို ကြေညာတဲ့အခါ — ဒီ variable က သူ့ရဲ့ contents တွေ ပြောင်းလဲနိုင်တယ်ဆိုတဲ့ အလားအလာ ရှိတယ်လို့ compiler ကို ပြောနေတာပါ။
အပြန်အလှန်အားဖြင့် — `const` နဲ့ variable တစ်ခုကို ကြေညာတာက — ဒီ object က ဘယ်တော့မှ ပြောင်းလဲမှာ မဟုတ်ဘူးလို့ TypeScript ကို အသိပေးတာပါ။

```ts twoslash
// We're making a guarantee that this variable
// helloWorld will never change, by using const.

// So, TypeScript sets the type to be "Hello World", not string
const helloWorld = "Hello World";

// On the other hand, a let can change, and so the compiler declares it a string
let hiWorld = "Hi World";
```

ဖြစ်နိုင်ခြေ case အရေအတွက် အကန့်အသတ်မဲ့ (ဖြစ်နိုင်တဲ့ string values တွေက အဆုံးမရှိပါ) ကနေ — ပိုသေးငယ်ပြီး အကန့်အသတ်ရှိတဲ့ case အရေအတွက်ဆီ (`helloWorld` ရဲ့ အခြေအနေမှာ: 1) ကို သွားတဲ့ ဖြစ်စဉ်ကိုတော့ narrowing လို့ ခေါ်ပါတယ်။

## String Literal Types (String Literal Type များ)

လက်တွေ့မှာ — string literal types တွေက union types, type guards နဲ့ type aliases တွေနဲ့ ကောင်းကောင်း ပေါင်းစပ်ပါတယ်။
ဒီ features တွေကို တွဲသုံးခြင်းအားဖြင့် — strings တွေနဲ့ enum နဲ့တူတဲ့ အပြုအမူမျိုး ရနိုင်ပါတယ်။

```ts twoslash
// @errors: 2345
type Easing = "ease-in" | "ease-out" | "ease-in-out";

class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
    if (easing === "ease-in") {
      // ...
    } else if (easing === "ease-out") {
    } else if (easing === "ease-in-out") {
    } else {
      // It's possible that someone could reach this
      // by ignoring your types though.
    }
  }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy");
```

ခွင့်ပြုထားတဲ့ string သုံးခုထဲက ဘယ်ဟာကိုမဆို ထည့်လို့ရပြီး — တခြား string တစ်ခုခု ထည့်လိုက်ရင်တော့ အောက်ပါ error ကို ရပါလိမ့်မယ်

```
Argument of type '"uneasy"' is not assignable to parameter of type '"ease-in" | "ease-out" | "ease-in-out"'
```

String literal types တွေကို overloads တွေကို ခွဲခြားဖို့လည်း အလားတူ နည်းနဲ့ သုံးနိုင်ပါတယ်:

```ts
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... more overloads ...
function createElement(tagName: string): Element {
  // ... code goes here ...
}
```

## Numeric Literal Types (Numeric Literal Type များ)

TypeScript မှာ numeric literal types တွေလည်း ရှိပါတယ် — သူတို့က အပေါ်က string literals တွေလိုပဲ အလုပ်လုပ်ပါတယ်။

```ts twoslash
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
}

const result = rollDice();
```

သူတို့ကို သုံးလေ့ရှိတဲ့ နေရာတစ်ခုကတော့ — config values တွေကို ဖော်ပြဖို့ပါ:

```ts twoslash
/** Creates a map centered at loc/lat */
declare function setupMap(config: MapConfig): void;
// ---cut---
interface MapConfig {
  lng: number;
  lat: number;
  tileSize: 8 | 16 | 32;
}

setupMap({ lng: -73.935242, lat: 40.73061, tileSize: 16 });
```

## Boolean Literal Types (Boolean Literal Type များ)

TypeScript မှာ boolean literal types တွေလည်း ရှိပါတယ်။
Properties တွေ အချင်းချင်း ဆက်စပ်နေတဲ့ object values တွေကို ကန့်သတ်ဖို့ ဒါတွေကို သုံးနိုင်ပါတယ်။

```ts twoslash
interface ValidationSuccess {
  isValid: true;
  reason: null;
}

interface ValidationFailure {
  isValid: false;
  reason: string;
}

type ValidationResult = ValidationSuccess | ValidationFailure;
```
