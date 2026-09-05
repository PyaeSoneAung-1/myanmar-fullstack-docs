---
title: "Iterators and Generators (Iterator နဲ့ Generator များ)"
description: "Iterables (iterate လုပ်လို့ရတဲ့ အရာများ) အကြောင်း — `Iterable` interface, `for..of` နဲ့ `for..in` loops, ပြီးတော့ ES5 / ECMAScript 2015+ targets တွေအတွက် code generation"
order: 57
source: "https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html"
status: translated
updated: 2026-09-05
---

## Iterables (Iterables — Iterate လုပ်လို့ရတဲ့ အရာများ)

Object တစ်ခုမှာ [`Symbol.iterator`](/docs/typescript/symbols) property ရဲ့ implementation (အကောင်အထည်ဖော်မှု) ရှိနေရင် — အဲဒီ object ကို iterable (iterate လုပ်နိုင်သော အရာ) အဖြစ် သတ်မှတ်ပါတယ်။
`Array`, `Map`, `Set`, `String`, `Int32Array`, `Uint32Array` စတဲ့ built-in types (ကြိုတင်ပါဝင်ပြီးသား type များ) တစ်ချို့မှာ — သူတို့ရဲ့ `Symbol.iterator` property ကို ကြိုတင် အကောင်အထည်ဖော်ပြီးသား ဖြစ်ပါတယ်။
Object တစ်ခုပေါ်မှာရှိတဲ့ `Symbol.iterator` function ကတော့ — iterate လုပ်ရမယ့် values (တန်ဖိုးများ) စာရင်းကို ပြန်ပေးဖို့ တာဝန်ရှိပါတယ်။

### `Iterable` interface (`Iterable` Interface အကြောင်း)

`Iterable` ဆိုတာ — အပေါ်မှာ ဖော်ပြခဲ့တဲ့ — iterable ဖြစ်တဲ့ types တွေကို လက်ခံချင်တဲ့အခါ သုံးနိုင်တဲ့ type တစ်ခု ဖြစ်ပါတယ်။ ဥပမာ ကြည့်ရအောင်:

```ts
function toArray<X>(xs: Iterable<X>): X[] {
  return [...xs]
}
```

### `for..of` statements (`for..of` ကြေညာချက်များ)

`for..of` loop က iterable object တစ်ခုကို လှည့်ပတ်ပြီး — အဲဒီ object ပေါ်က `Symbol.iterator` property ကို ခေါ်ယူပါတယ်။
Array တစ်ခုပေါ်မှာ ရိုးရှင်းတဲ့ `for..of` loop လေး ဒီမှာ ကြည့်ရအောင်:

```ts
let someArray = [1, "string", false];

for (let entry of someArray) {
  console.log(entry); // 1, "string", false
}
```

### `for..of` vs. `for..in` statements (`for..of` နဲ့ `for..in` ကြေညာချက်များ)

`for..of` ရော `for..in` ရော — နှစ်ခုလုံးက lists တွေကို iterate လုပ်ကြပါတယ်; ဒါပေမယ့် iterate လုပ်ပြီး ရလာတဲ့ values တွေကတော့ မတူပါဘူး — `for..in` က iterate လုပ်နေတဲ့ object ပေါ်က _keys (သော့များ)_ စာရင်းကို ပြန်ပေးပြီး — `for..of` ကတော့ iterate လုပ်နေတဲ့ object ရဲ့ numeric properties တွေရဲ့ _values (တန်ဖိုးများ)_ စာရင်းကို ပြန်ပေးပါတယ်။

ဒီကွာခြားချက်ကို ပြသဖို့ ဥပမာတစ်ခု ဒီမှာ ပါပါတယ်:

```ts
let list = [4, 5, 6];

for (let i in list) {
  console.log(i); // "0", "1", "2",
}

for (let i of list) {
  console.log(i); // 4, 5, 6
}
```

နောက်ထပ် ကွာခြားချက်တစ်ခုက — `for..in` က object မည်သည့်အမျိုးအစားပေါ်မဆို အလုပ်လုပ်နိုင်ပြီး — object ရဲ့ properties တွေကို စစ်ဆေးကြည့်ဖို့ နည်းလမ်းတစ်ခုအနေနဲ့ ဆောင်ရွက်ပါတယ်။
`for..of` ကျတော့ — အဓိကအားဖြင့် iterable objects တွေရဲ့ values တွေကိုပဲ ဦးတည်ပါတယ်။ `Map` နဲ့ `Set` လို built-in objects တွေက `Symbol.iterator` property ကို အကောင်အထည်ဖော်ထားတာမို့ — သိမ်းထားတဲ့ values တွေဆီ access (ဝင်ရောက်) လုပ်လို့ ရပါတယ်။

```ts
let pets = new Set(["Cat", "Dog", "Hamster"]);
pets["species"] = "mammals";

for (let pet in pets) {
  console.log(pet); // "species"
}

for (let pet of pets) {
  console.log(pet); // "Cat", "Dog", "Hamster"
}
```

### Code generation (Code ထုတ်လုပ်ခြင်း)

#### Targeting ES5 (ES5 ကို Target ထားခြင်း)

ES5 နဲ့ ကိုက်ညီတဲ့ engine (JavaScript runtime) ကို target (ပစ်မှတ်) ထားတဲ့အခါ — iterators တွေကို `Array` type ရဲ့ values တွေမှာပဲ သုံးခွင့်ရှိပါတယ်။
`Array` မဟုတ်တဲ့ values တွေက `Symbol.iterator` property ကို အကောင်အထည်ဖော်ထားရင်တောင် — အဲဒီ values တွေပေါ်မှာ `for..of` loops သုံးတာက error ဖြစ်ပါတယ်။

Compiler က `for..of` loop တစ်ခုအတွက် ရိုးရှင်းတဲ့ `for` loop တစ်ခုကို ထုတ်ပေးပါတယ် — ဥပမာ:

```ts
let numbers = [1, 2, 3];
for (let num of numbers) {
  console.log(num);
}
```

ဒါကို ဒီလို ထုတ်လုပ်ပေးမှာ ဖြစ်ပါတယ်:

```js
var numbers = [1, 2, 3];
for (var _i = 0; _i < numbers.length; _i++) {
  var num = numbers[_i];
  console.log(num);
}
```

#### Targeting ECMAScript 2015 and higher (ECMAScript 2015 နဲ့ အထက်ကို Target ထားခြင်း)

ECMAScript 2015 နဲ့ ကိုက်ညီတဲ့ engine ကို target ထားတဲ့အခါ — compiler က `for..of` loops တွေကို — engine ထဲမှာ ပါဝင်တဲ့ built-in iterator implementation ကို သုံးစွဲမယ့်ပုံစံနဲ့ ထုတ်လုပ်ပေးပါတယ်။
