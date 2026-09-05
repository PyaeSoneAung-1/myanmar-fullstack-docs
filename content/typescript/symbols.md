---
title: "Symbols (Symbol များ)"
description: "`symbol` ဆိုတဲ့ primitive data type အကြောင်း — unique symbol type, well-known built-in symbols (Symbol.iterator စသည်) တွေရဲ့ အလုပ်လုပ်ပုံ"
order: 62
source: "https://www.typescriptlang.org/docs/handbook/symbols.html"
status: translated
updated: 2026-09-05
---

ECMAScript 2015 ကစပြီး — `symbol` က `number` နဲ့ `string` တွေလိုပဲ — primitive data type (အခြေခံ ဒေတာအမျိုးအစား) တစ်ခု ဖြစ်လာပါတယ်။

`symbol` values တွေကို `Symbol` constructor ကို ခေါ်ပြီး ဖန်တီးပါတယ်။

```ts
let sym1 = Symbol();

let sym2 = Symbol("key"); // optional string key
```

Symbols တွေက immutable (ပြောင်းလဲ၍မရ) ဖြစ်ပြီး — unique (တစ်ခုတည်းသော) လည်း ဖြစ်ပါတယ်။

```ts
let sym2 = Symbol("key");
let sym3 = Symbol("key");

sym2 === sym3; // false, symbols are unique
```

Strings တွေလိုပဲ — symbols တွေကို object properties တွေရဲ့ keys (သော့များ) အဖြစ် သုံးနိုင်ပါတယ်။

```ts
const sym = Symbol();

let obj = {
  [sym]: "value",
};

console.log(obj[sym]); // "value"
```

Symbols တွေကို computed property declarations တွေနဲ့ ပေါင်းစပ်ပြီး — object properties နဲ့ class members တွေကို ကြေညာဖို့လည်း သုံးနိုင်ပါတယ်။

```ts
const getClassNameSymbol = Symbol();

class C {
  [getClassNameSymbol](https://www.typescriptlang.org/docs/handbook) {
    return "C";
  }
}

let c = new C();
let className = c[getClassNameSymbol](https://www.typescriptlang.org/docs/handbook); // "C"
```

## `unique symbol`

Symbols တွေကို unique literals တွေအနေနဲ့ သဘောထားနိုင်စေဖို့ — `unique symbol` ဆိုတဲ့ အထူး type တစ်ခု ရနိုင်ပါတယ်။ `unique symbol` က `symbol` ရဲ့ subtype (မျိုးကွဲ) တစ်ခု ဖြစ်ပြီး — `Symbol()` ဒါမှမဟုတ် `Symbol.for()` ကို ခေါ်တာကနေ ဒါမှမဟုတ် ရှင်းလင်းတဲ့ type annotations (ကြေညာချက်များ) ကနေသာ ထွက်ပေါ်လာပါတယ်။ ဒီ type ကို `const` declarations တွေနဲ့ `readonly static` properties တွေမှာပဲ ခွင့်ပြုပြီး — တိကျတဲ့ unique symbol တစ်ခုကို ရည်ညွှန်းဖို့ဆိုရင် `typeof` operator ကို သုံးရပါလိမ့်မယ်။ Unique symbol တစ်ခုကို ရည်ညွှန်းမှုတိုင်းက — ပေးထားတဲ့ declaration တစ်ခုနဲ့ ချိတ်ဆက်ထားတဲ့ လုံးဝထူးခြားတဲ့ identity (သီးခြားတည်ရှိမှု) တစ်ခုကို ဆိုလိုပါတယ်။

```ts twoslash
// @errors: 1332
declare const sym1: unique symbol;

// sym2 can only be a constant reference.
let sym2: unique symbol = Symbol();

// Works - refers to a unique symbol, but its identity is tied to 'sym1'.
let sym3: typeof sym1 = sym1;

// Also works.
class C {
  static readonly StaticSymbol: unique symbol = Symbol();
}
```

`unique symbol` တစ်ခုချင်းစီမှာ လုံးဝ သီးခြား identity ရှိတာမို့ — `unique symbol` types နှစ်ခုက တစ်ခုနဲ့တစ်ခု assignable (အစားထိုးလက်ခံနိုင်) လည်း မဟုတ်သလို — နှိုင်းယှဉ်လို့လည်း မရပါဘူး။

```ts twoslash
// @errors: 2367
const sym2 = Symbol();
const sym3 = Symbol();

if (sym2 === sym3) {
  // ...
}
```

## Well-known Symbols (Built-in Symbols များ)

သုံးစွဲသူ သတ်မှတ်ထားတဲ့ symbols တွေအပြင် — well-known built-in symbols (ကြိုတင်သတ်မှတ်ထားသော built-in symbols) တွေလည်း ရှိပါတယ်။
Built-in symbols တွေက အတွင်းပိုင်း language behaviors (ဘာသာစကားရဲ့ အတွင်းပိုင်း အပြုအမူများ) တွေကို ကိုယ်စားပြုဖို့ သုံးပါတယ်။

Well-known symbols တွေရဲ့ စာရင်းက ဒီမှာပါ:

### `Symbol.asyncIterator`

Object တစ်ခုအတွက် async iterator (ထပ်ကာထပ်ကာ ယူနိုင်သော async အရာဝတ္ထု) တစ်ခုကို ပြန်ပေးတဲ့ method တစ်ခု — for await..of loop နဲ့ တွဲသုံးဖို့ သင့်လျော်ပါတယ်။

### `Symbol.hasInstance`

Constructor object တစ်ခုက — object တစ်ခုကို သူ့ရဲ့ instances တွေထဲက တစ်ခုအဖြစ် အသိအမှတ်ပြုလား ဆုံးဖြတ်ပေးတဲ့ method တစ်ခု။ instanceof operator ရဲ့ semantics (အဓိပ္ပါယ်ဖွင့်ဆိုချက်) အရ ခေါ်ဝေါ်ပါတယ်။

### `Symbol.isConcatSpreadable`

Object တစ်ခုကို Array.prototype.concat က သူ့ရဲ့ array elements တွေအဖြစ် ဖြန့်ချ (flatten) သင့်လားဆိုတာကို ညွှန်ပြတဲ့ Boolean တန်ဖိုးတစ်ခု။

### `Symbol.iterator`

Object တစ်ခုအတွက် ပုံမှန် (default) iterator တစ်ခုကို ပြန်ပေးတဲ့ method တစ်ခု။ for-of statement ရဲ့ semantics အရ ခေါ်ဝေါ်ပါတယ်။

### `Symbol.match`

Regular expression တစ်ခုကို string တစ်ခုနဲ့ တိုက်စစ်ဆေးပေးတဲ့ regular expression method တစ်ခု။ `String.prototype.match` method က ခေါ်ဝေါ်ပါတယ်။

### `Symbol.replace`

String တစ်ခုထဲက ကိုက်ညီတဲ့ substrings တွေကို အစားထိုးပေးတဲ့ regular expression method တစ်ခု။ `String.prototype.replace` method က ခေါ်ဝေါ်ပါတယ်။

### `Symbol.search`

String တစ်ခုထဲမှာ regular expression နဲ့ ကိုက်ညီတဲ့ index (နေရာ) ကို ပြန်ပေးတဲ့ regular expression method တစ်ခု။ `String.prototype.search` method က ခေါ်ဝေါ်ပါတယ်။

### `Symbol.species`

Derived objects (ဆင်းသက်လာသော objects) တွေကို ဖန်တီးဖို့ သုံးတဲ့ constructor function ဖြစ်တဲ့ — function တန်ဖိုး ဆောင်ထားတဲ့ property တစ်ခု။

### `Symbol.split`

Regular expression နဲ့ ကိုက်ညီတဲ့ နေရာတွေမှာ string တစ်ခုကို ပိုင်းဖြတ်ပေးတဲ့ regular expression method တစ်ခု။
`String.prototype.split` method က ခေါ်ဝေါ်ပါတယ်။

### `Symbol.toPrimitive`

Object တစ်ခုကို သက်ဆိုင်ရာ primitive value (အခြေခံတန်ဖိုး) တစ်ခုအဖြစ် ပြောင်းလဲပေးတဲ့ method တစ်ခု။
`ToPrimitive` ဆိုတဲ့ abstract operation က ခေါ်ဝေါ်ပါတယ်။

### `Symbol.toStringTag`

Object တစ်ခုရဲ့ ပုံမှန် (default) string ဖော်ပြချက်ကို ဖန်တီးရာမှာ သုံးတဲ့ String တန်ဖိုးတစ်ခု။
Built-in method ဖြစ်တဲ့ `Object.prototype.toString` က ခေါ်ဝေါ်ပါတယ်။

### `Symbol.unscopables`

ကိုယ်ပိုင် property names တွေက — ဆက်စပ်နေတဲ့ objects တွေရဲ့ 'with' environment bindings တွေကနေ ဖယ်ထုတ်ထားတဲ့ property names တွေ ဖြစ်တဲ့ Object တစ်ခု။
