---
title: "နေ့စဉ်သုံး Types"
description: "Primitive types, array, any, function annotation, object types, union types, type alias, interface, type assertion, literal types, null နဲ့ undefined — TypeScript ရဲ့ အသုံးအများဆုံး type တွေ"
order: 2
source: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html"
status: translated
updated: 2026-09-01
---

## Primitive types — string, number, boolean

JavaScript မှာ အသုံးအများဆုံး primitive value တွေက `string`, `number`, `boolean` သုံးမျိုးပါ။ TypeScript မှာလည်း ဒီသုံးမျိုးအတွက် နာမည်တူ type တွေ ရှိပြီး — JavaScript ရဲ့ `typeof` operator ပြန်ပေးတဲ့ နာမည်တွေနဲ့လည်း ကိုက်ညီပါတယ်။ JavaScript မှာ integer နဲ့ float ခွဲမထားတာမို့ `int` ဒါမှမဟုတ် `float` ဆိုတာ မရှိဘဲ — ကိန်းအားလုံးကို `number` တစ်မျိုးတည်းနဲ့ပဲ ကိုယ်စားပြုပါတယ်။ Capital letter နဲ့ စတဲ့ `String`, `Number`, `Boolean` ဆိုတာတွေက သီးခြား built-in type တွေကို ရည်ညွှန်းတာမို့ — type ရေးတဲ့အခါ `string`, `number`, `boolean` ကိုပဲ အမြဲ သုံးပါ။

Array type ကတော့ `number[]` လိုမျိုး element type နောက်မှာ `[]` ထည့်ပြီး ရေးပါတယ် — `Array<number>` ဆိုပြီးလည်း ရေးလို့ရပြီး အဓိပ္ပါယ် အတူတူပါပဲ။ TypeScript မှာ `any` ဆိုတဲ့ အထူး type တစ်ခုလည်း ရှိပြီး — value တစ်ခုကို type check မလုပ်ချင်တဲ့အခါ သုံးပါတယ်။ `any` သုံးထားရင် property ဘာကိုမဆို ခေါ်လို့ရပြီး type error လုံးဝ မဖြစ်တော့ပါဘူး:

```ts
let myName: string = "Alice";
let age: number = 25;
let isActive: boolean = true;

const scores: number[] = [90, 85, 92];
const tags: Array<string> = ["react", "typescript"];

let obj: any = { x: 0 };   // Using `any` disables all further type checking
obj.foo();
obj.bar = 100;
obj = "hello";
```

`any` က မကြာခဏ အသုံးဝင်ပေမယ့် type safety အားလုံး ဆုံးရှုံးတာမို့ — type မသတ်မှတ်ဘဲ TypeScript က `any` လို့ အလိုအလျောက် မှန်းတဲ့အခါ error အဖြစ် ပြဖို့ `noImplicitAny` ဆိုတဲ့ compiler option ကို ဖွင့်ထားတာ ပိုကောင်းပါတယ်။

## Functions — parameter နဲ့ return type

Function တစ်ခုရဲ့ parameter တစ်ခုချင်းစီနဲ့ return value ရဲ့ type တွေကို annotation နဲ့ သတ်မှတ်လို့ရပါတယ် — parameter name နောက်မှာ `: type` ရေးပြီး return type ကို parameter list ရဲ့ နောက်မှာ ရေးပါတယ်။ Parameter မှာ type annotation ပါရင် argument တွေကိုပါ စစ်ဆေးပေးပြီး — မှားတဲ့ type ပို့ရင် compile error တက်ပါတယ်။ Return type annotation မရေးဘဲလည်း TypeScript က `return` statement တွေ ကြည့်ပြီး အလိုအလျောက် မှန်းပေးတာမို့ — အများအားဖြင့် မလိုအပ်ပါဘူး။

Anonymous function (နာမည်မဲ့ function) တွေမှာတော့ TypeScript က function ကို ဘယ်လိုခေါ်မယ်ဆိုတဲ့ context ကြည့်ပြီး parameter type တွေကို ကိုယ်တိုင် သတ်မှတ်ပေးပါတယ် (contextual typing)။ အောက်က `forEach` ထဲက callback မှာ `s` ကို annotation မရေးထားပေမယ့် — array က `string[]` ဆိုတာ သိထားလို့ `s` ကို `string` အနေနဲ့ အလိုအလျောက် ယူဆပါတယ်:

```ts
// Parameter type annotation
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}

// Return type annotation
function getFavoriteNumber(): number {
  return 26;
}

// Would be a runtime error if executed!
greet(42);

const names = ["Alice", "Bob", "Eve"];

// Contextual typing — parameter s inferred to have type string
names.forEach((s) => {
  console.log(s.toUpperCase());
});
```

## Object types နဲ့ optional properties

Object type ဆိုတာ property တွေနဲ့ ဖွဲ့စည်းထားတဲ့ JavaScript value တွေရဲ့ type ပါ — `{ x: number; y: number }` လိုမျိုး property name နဲ့ type စာရင်း ရေးပြီး သတ်မှတ်ပါတယ်။ Property name နောက်မှာ `?` ထည့်ရင် optional property ဖြစ်ပြီး — အဲဒီ property မပါဘဲလည်း value တစ်ခုကို ပေးလို့ရပါတယ်။ Optional property ကို ဖတ်တဲ့အခါ `undefined` ဖြစ်နေနိုင်လို့ — method မခေါ်ခင် `undefined` ဖြစ်မဖြစ် စစ်ဖို့ လိုပါတယ်:

```ts
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });

function printName(obj: { first: string; last?: string }) {
  // ...
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

## Union types

Union type ဆိုတာ type နှစ်ခု ဒါမှမဟုတ် နှစ်ခုထက်ပိုပြီး ပေါင်းထားတဲ့ type ဖြစ်ပြီး — value က အဲဒီ type တွေထဲက ဘယ်တစ်ခုဖြစ်ဖြစ် ဖြစ်နိုင်ပါတယ်။ `number | string` လိုမျိုး `|` နဲ့ ပိုင်းပြီး ရေးပါတယ်။ Union type ရဲ့ value တစ်ခုကို သုံးတဲ့အခါ — member အားလုံးမှာ ရှိတဲ့ property ကိုပဲ တိုက်ရိုက် သုံးလို့ရပြီး member တစ်ခုတည်းမှာပဲ ရှိတဲ့ method ကိုတော့ narrowing လုပ်ပြီးမှ သုံးလို့ရပါတယ်။ Narrowing အကြောင်းကို [Type Narrowing](/docs/typescript/narrowing) မှာ အသေးစိတ် လေ့လာပါမယ်။

## Type aliases နဲ့ interfaces

တူတူ သုံးနေတဲ့ type တစ်ခုကို နာမည်ပေးပြီး ပြန်သုံးချင်ရင် `type` keyword နဲ့ type alias ဖန်တီးပါတယ်။ Object type ကို နာမည်ပေးတဲ့ နောက်တစ်နည်းကတော့ `interface` ပါ။ နှစ်ခုလုံးက ဖွဲ့စည်းပုံ (structure) ကိုပဲ ကြည့်တာမို့ — interface နဲ့ ကိုက်ညီတဲ့ property တွေ ရှိတဲ့ object မှန်သမျှ လက်ခံပါတယ် (structural typing)။ အဓိက ကွာခြားချက်က — interface က `extends` နဲ့ ချဲ့လို့ရပြီး နောက်ထပ် property တွေ ထပ်ထည့်လို့ရတယ်။ type alias ကတော့ တစ်ခါ သတ်မှတ်ပြီးရင် ပြန်ပြင်/ထပ်ထည့်လို့ မရပါဘူး။ နှစ်ခုလုံးက ရွေးချယ်လို့ရပြီး — `type` ရဲ့ feature တွေ လိုအပ်မှ `type` သုံးပြီး ဒါမှမဟုတ်ရင် `interface` သုံးတာ ပုံမှန် ချဉ်းကပ်နည်းပါ:

```ts
type Point = {
  x: number;
  y: number;
};

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
}

// Interfaces can extend other interfaces
interface Animal {
  name: string;
}
interface Bear extends Animal {
  honey: boolean;
}
```

## Type assertions

Value တစ်ခုရဲ့ type အကြောင်း TypeScript မသိတဲ့ အချက်ကို သင်က သိနေရင် — `as` keyword နဲ့ type assertion လုပ်ပြီး ပိုတိကျတဲ့ type ကို ပြောပြနိုင်ပါတယ်။ ဥပမာ `document.getElementById` က `HTMLElement` ပဲ ပြန်ပေးတယ်လို့ TypeScript က သိပေမယ့် — သင်က canvas element ဖြစ်တာ သေချာရင် `document.getElementById("main_canvas") as HTMLCanvasElement` လို့ ပြောင်းလို့ရပါတယ်။ Type assertion က compile လုပ်တဲ့အခါ ဖျက်ပစ်တာမို့ runtime မှာ သက်ရောက်မှု မရှိဘဲ runtime check လည်း မရှိပါဘူး — `"hello" as number` လို မဖြစ်နိုင်တဲ့ ပြောင်းလဲမှုတွေကိုတော့ TypeScript က တားမြစ်ပါတယ်။

## Literal types

`string` လို ယေဘုယျ type တွေ အပြင် — တိကျတဲ့ string နဲ့ number တန်ဖိုးတွေကိုလည်း type အနေနဲ့ သုံးလို့ရပါတယ် (literal types)။ `const` နဲ့ သတ်မှတ်ထားတဲ့ variable က literal type ရှိပြီး `let` က ဘယ် string မဆို ဖြစ်နိုင်လို့ `string` type ပဲ ရှိပါတယ်။ Literal type တစ်ခုတည်းက သိပ်အသုံးမဝင်ပေမယ့် — union နဲ့ ပေါင်းလိုက်ရင် function က ခွင့်ပြုထားတဲ့ တန်ဖိုးစာရင်း သတ်မှတ်လို့ရပါတယ်။ `alignment: "left" | "right" | "center"` ဆိုရင် အဲဒီတန်ဖိုးသုံးခုကလွဲရင် တခြားတန်ဖိုး ပို့လို့မရတော့ပါဘူး။ Object ရဲ့ property တွေကို literal type ဖြစ်စေချင်ရင်တော့ `as const` ကို သုံးပါတယ်။

## null နဲ့ undefined

JavaScript မှာ "တန်ဖိုးမရှိ" ဆိုတာကို ပြတဲ့ value နှစ်ခု ရှိပါတယ် — `null` နဲ့ `undefined`။ TypeScript မှာလည်း ဒီနာမည်တွေနဲ့ type နှစ်ခု ရှိပြီး — `strictNullChecks` option ဖွင့်ထားရင် `null` ဖြစ်နိုင်တဲ့ value ကို method မခေါ်ခင် စစ်ဖို့ လိုပါတယ်။ `string | null` type ကို `if (x === null)` လိုမျိုး narrowing လုပ်ပြီးမှ သုံးပါတယ်။ `x!` ဆိုတဲ့ non-null assertion operator နဲ့လည်း `null`/`undefined` မဟုတ်ဘူးလို့ ပြောပြလို့ရပေမယ့် — runtime check မလုပ်တာမို့ value ရှိတယ်ဆိုတာ သေချာတဲ့အခါမှသာ သုံးသင့်ပါတယ်။

## ဆက်လက်လေ့လာရန်

- [Type Narrowing](/docs/typescript/narrowing) — union type တွေကို ဘယ်လို ကျဉ်းမြောင်းအောင် လုပ်မလဲ
- [Functions အသေးစိတ်](/docs/typescript/functions) — function type expressions, generics, overloads
- [TypeScript မိတ်ဆက်](/docs/typescript/getting-started) — TypeScript အခြေခံ
