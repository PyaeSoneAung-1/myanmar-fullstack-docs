---
title: "Functions အသေးစိတ်"
description: "Function type expressions, generic functions, constraints, optional/default/rest parameters, overloads, this parameter, never return type"
order: 4
source: "https://www.typescriptlang.org/docs/handbook/2/functions.html"
status: translated
updated: 2026-09-01
---

## Function type expressions

Function ကိုယ်တိုင်ရဲ့ type ကို ဖော်ပြချင်ရင် — arrow function နဲ့ ပုံစံတူတဲ့ function type expression ကို သုံးပါတယ်။ `(a: string) => void` ဆိုတာ parameter `a` တစ်ခု ရှိပြီး `string` type ဖြစ်တယ်၊ return value မရှိတဲ့ function လို့ အဓိပ္ပါယ် ရပါတယ်။ Parameter name က မဖြစ်မနေ လိုအပ်ပြီး — `(string) => void` ဆိုရင် `string` ဆိုတဲ့ နာမည်ရှိတဲ့ parameter (type ကတော့ `any`) လို့ မှတ်ယူတာမို့ သတိထားပါ။ Function type ကိုလည်း type alias နဲ့ နာမည်ပေးလို့ရပါတယ်:

```ts
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);

// Using a type alias to name a function type
type GreetFunction = (a: string) => void;
```

## Generic functions နဲ့ constraints

Function ရဲ့ input type နဲ့ output type ဆက်စပ်နေတဲ့အခါ — generic (type parameter) ကို သုံးပါတယ်။ ဥပမာ array ရဲ့ ပထမဆုံး element ကို ပြန်တဲ့ function — `any[]` သုံးရင် return type က `any` ဖြစ်ပြီး အချက်အလက် ဆုံးရှုံးပါတယ်။ `<Type>` လို့ type parameter ထည့်လိုက်ရင် input နဲ့ output ကြား ဆက်စပ်မှုကို TypeScript က နားလည်ပြီး — call လုပ်တဲ့အခါ array ထဲက element type ကို အလိုအလျောက် မှန်းပေးပါတယ် (inference)။

Type parameter ကို ကန့်သတ်ချင်ရင် `extends` clause နဲ့ constraint ထည့်ပါတယ် — `Type extends { length: number }` ဆိုရင် `length` property ရှိတဲ့ type တွေပဲ လက်ခံတော့တာမို့ function body ထဲမှာ `.length` ကို လုံခြုံစွာ သုံးလို့ရပါတယ်:

```ts
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}

// s is of type 'string'
const s = firstElement(["a", "b", "c"]);

function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

const longerArray = longest([1, 2], [1, 2, 3]);  // type 'number[]'
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
```

Generic function ရေးတဲ့အခါ သတိထားစရာတွေ ရှိပါတယ် — type parameter က signature ထဲမှာ နှစ်နေရာ ဒါမှမဟုတ် ပိုပြီး ပေါ်ရမှာ ဖြစ်ပြီး တစ်နေရာတည်းမှာပဲ ပေါ်ရင် generic မလိုပါဘူး။ Constraint ကိုလည်း မလိုအပ်ဘဲ မထည့်ပါနဲ့ — inference ကို ခက်ခဲစေပါတယ်။ Generics အကြောင်း အသေးစိတ်ကို [Generics](/docs/typescript/generics) မှာ လေ့လာနိုင်ပါတယ်။

## Optional parameters, default values နဲ့ rest parameters

JavaScript function တွေက argument အရေအတွက် အမျိုးမျိုးနဲ့ ခေါ်လို့ရပါတယ်။ Parameter name နောက်မှာ `?` ထည့်ရင် optional parameter ဖြစ်ပြီး — မပို့ဘဲလည်း ခေါ်လို့ရပါတယ်။ ဒါပေမယ့် optional parameter ရဲ့ type က `number | undefined` ဖြစ်တာကို သတိထားပါ။ `= defaultValue` နဲ့ default value ထည့်ရင်တော့ — argument မပို့တဲ့အခါ default တန်ဖိုးကို သုံးပြီး parameter ထဲမှာ `number` type အတိုင်း လုံခြုံစွာ သုံးလို့ရပါတယ်။ Argument အရေအတွက် ကန့်သတ်မထားချင်ရင် `...` နဲ့ rest parameter ကို သုံးပါတယ် — rest parameter က ကျန် argument တွေ အားလုံးကို array အဖြစ် စုပေးပါတယ်:

```ts
function f(x?: number) {
  // ...
}
f();    // OK
f(10);  // OK

function g(x = 10) {
  // ...
}

function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

Rest parameter ရဲ့ type annotation က `T[]` ဒါမှမဟုတ် `Array<T>` ပုံစံ ဖြစ်ရပါတယ်။ Callback ရဲ့ function type ရေးတဲ့အခါ — optional parameter ကို မရည်ရွယ်ဘဲ မထည့်ပါနဲ့။ `(arg: any, index?: number) => void` ဆိုတာ "callback ကို argument တစ်ခုတည်းနဲ့လည်း ခေါ်နိုင်တယ်" လို့ အဓိပ္ပါယ် ရတာမို့ callback ထဲမှာ `index` ကို `number` အနေနဲ့ သုံးရင် error တက်ပါတယ်။

## Function overloads

Function တစ်ခုကို argument ပုံစံ အမျိုးမျိုးနဲ့ ခေါ်နိုင်အောင် — overload signature များစွာ ရေးပြီး နောက်ဆုံးမှာ implementation ရေးပါတယ်။ Overload signature တွေက function ကို ဘယ်လိုခေါ်လို့ရလဲ ပြင်ပကနေ မြင်ရတဲ့ ပုံစံတွေ ဖြစ်ပြီး — implementation signature ကတော့ ပြင်ပကနေ တိုက်ရိုက် ခေါ်လို့မရပါဘူး။ ဥပမာ `Date` တစ်ခု ဆောက်တဲ့ function — timestamp တစ်ခုတည်း ဒါမှမဟုတ် လ/ရက်/နှစ် သုံးခုနဲ့ ခေါ်လို့ရအောင် ရေးကြည့်ရအောင်:

```ts
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);  // Error: no overload expects 2 arguments
```

Overloads သုံးတဲ့အခါ — union type နဲ့ ရေးလို့ရတဲ့ နေရာမှာ overload ကို ဦးစားမပေးပါနဲ့။ Union type က caller အတွက် ပိုလွယ်ကူပြီး — overload က argument ပုံစံတွေ သိသိသာသာ ကွာတဲ့အခါမှသာ သုံးသင့်ပါတယ်။

## this parameter နဲ့ never return type

`this` ရဲ့ type ကို function ရဲ့ ပထမဆုံး parameter အနေနဲ့ သတ်မှတ်လို့ရပါတယ် — `function f(this: User, x: number)` လိုမျိုး။ ဒါက callback ပုံစံ API တွေမှာ အသုံးဝင်ပြီး — arrow function မဟုတ်ဘဲ `function` keyword နဲ့ ရေးမှသာ အလုပ်လုပ်ပါတယ်။ Return type `never` ကတော့ function က ဘယ်တော့မှ return မလုပ်တဲ့ အခြေအနေတွေ — exception throw လုပ်တာ၊ program terminate လုပ်တာ — အတွက် ဖြစ်ပါတယ်။ `function fail(msg: string): never { throw new Error(msg); }` လိုမျိုး သုံးပါတယ်။ `never` က union တစ်ခုထဲက ဖြစ်နိုင်ခြေ အားလုံး ကုန်သွားတဲ့အခါမှာလည်း ပေါ်လာပါတယ် — [Type Narrowing](/docs/typescript/narrowing) မှာ `never` အကြောင်း ထပ်လေ့လာနိုင်ပါတယ်။

Function assignability မှာ ထူးခြားချက်တစ်ခုက — `() => void` type နဲ့ ကိုက်ညီဖို့ function က value တစ်ခုခု return လုပ်ထားရင်တောင် ရပါတယ် (return value ကို ignore လုပ်မယ်)။ ဒါကြောင့် `[1, 2, 3].forEach((el) => dst.push(el))` လိုမျိုး — `push` က number return လုပ်ပေမယ့် `forEach` က void မျှော်လင့်တဲ့ callback အနေနဲ့ ရေးလို့ရပါတယ်။ Literal function definition မှာတော့ `void` return type ရှိရင် ဘာမှ ပြန်မပေးရပါဘူး။

## ဆက်လက်လေ့လာရန်

- [Generics](/docs/typescript/generics) — generic functions, constraints, keyof
- [Type Narrowing](/docs/typescript/narrowing) — union type တွေကို narrowing လုပ်ခြင်း
- [နေ့စဉ်သုံး Types](/docs/typescript/everyday-types) — function annotation အခြေခံ
