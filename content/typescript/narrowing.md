---
title: "Type Narrowing"
description: "Narrowing ဆိုတာ ဘာလဲ — typeof guards, truthiness, equality, in operator, instanceof, discriminated union နဲ့ never type & exhaustiveness checking"
order: 3
source: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html"
status: translated
updated: 2026-09-01
---

## Narrowing ဆိုတာ ဘာလဲ

Union type တစ်ခုရဲ့ value ကို ကိုင်တွယ်တဲ့အခါ — TypeScript က code ရဲ့ ပုံစံ ကြည့်ပြီး value ရဲ့ type ကို ပိုတိကျတဲ့ type တစ်ခုအဖြစ် ကျဉ်းမြောင်းပေးပါတယ် (narrowing)။ `if (typeof padding === "number")` လိုမျိုး check တွေကို type guard လို့ ခေါ်ပြီး — TypeScript က guard တွေကို လိုက်ပြီး branch တစ်ခုချင်းစီမှာ ဖြစ်နိုင်တဲ့ type ကို တွက်ပေးပါတယ်။ အဓိကအချက်က — TypeScript code က JavaScript နဲ့ ပုံစံတူ ရေးရုံပဲ ဖြစ်ပြီး type system က သူ့အလိုလို ပိုလုံခြုံစေတာပါ။ `padLeft` function ကို ကြည့်ကြည့်ရအောင် — `padding` က `number` ဆိုရင် space တွေ ရှေ့ကထည့်ပြီး `string` ဆိုရင် သူ့အတိုင်း ရှေ့ကထည့်တဲ့ function ပါ:

```ts
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

`padding` က `number | string` union ဖြစ်လို့ — `typeof` check မလုပ်ဘဲ `" ".repeat(padding)` လို့ သုံးရင် error တက်ပါတယ် (`repeat` က `number` ပဲ လက်ခံလို့)။ `if` branch ထဲမှာ `padding` က `number` ဖြစ်ပြီး — ကျန်တဲ့ code တွေမှာ `string` ဖြစ်တာကို TypeScript က သိပါတယ်။ TypeScript က `if/else`, ternary, loop, truthiness check စတဲ့ runtime control flow တွေပေါ်မှာ type analysis ကို ထပ်ဆင့် လုပ်ပေးတာပါ။

## typeof type guards

`typeof` operator က runtime မှာ value ရဲ့ အခြေခံ type ကို ပြန်ပေးပြီး — TypeScript က ဒီ result ကို branch တွေမှာ narrowing လုပ်ဖို့ သုံးပါတယ်။ `typeof` က `"string"`, `"number"`, `"boolean"`, `"object"`, `"function"` စသဖြင့် ပြန်ပေးပါတယ်။ သတိထားစရာက — JavaScript မှာ `typeof null` က `"object"` ပဲ ပြန်တာမို့ `typeof strs === "object"` ဆိုတဲ့ check က `null` ကို မဖယ်ပေးနိုင်ပါဘူး။ ဒါကြောင့် `null` ဖြစ်နိုင်တဲ့ value တွေမှာ truthiness check (value ရှိမရှိ စစ်တာ) နဲ့ ပေါင်းသုံးတာ မကြာခဏ တွေ့ရပါတယ် — `0`, `NaN`, `""`, `null`, `undefined` တွေက falsy ဖြစ်ပြီး ကျန်တဲ့ value တွေက truthy ဖြစ်ပါတယ်:

```ts
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

Truthiness narrowing က အဆင်ပြေပေမယ့် — `""` (empty string) နဲ့ `0` လို falsy ဖြစ်တဲ့ ပုံမှန် value တွေကို မတော်တဆ ဖယ်ပစ်တတ်လို့ သတိထားပါ။ Empty string ကိုပါ ကိုင်တွယ်ချင်ရင် `strs !== null` လိုမျိုး equality check နဲ့ စစ်တာ ပိုတိကျပါတယ်။ Equality narrowing မှာ TypeScript က `===`, `!==`, `==`, `!=` နဲ့ `switch` တွေကို နားလည်ပြီး — `x === y` ဆိုရင် `x` နဲ့ `y` ရဲ့ type တွေ တူရမှာမို့ နှစ်ခုစလုံးမှာ ရှိတဲ့ common type ကိုပဲ ကျန်စေပါတယ်။ JavaScript ရဲ့ `== null` က `null` ရော `undefined` ရော နှစ်ခုလုံးကို စစ်ပေးတဲ့ လက္ခဏာကိုလည်း TypeScript က နားလည်ပြီး narrowing လုပ်ပေးပါတယ်။

## in operator နဲ့ instanceof

Object တစ်ခုမှာ property ရှိမရှိ စစ်တဲ့ `in` operator ကိုလည်း narrowing အတွက် သုံးလို့ရပါတယ် — `"swim" in animal` ဆိုရင် true branch မှာ `swim` property ရှိတဲ့ type တွေ ကျန်ခဲ့ပြီး false branch မှာ ကျန် type တွေ ဖြစ်သွားပါတယ်။ Class instance တွေအတွက်ကတော့ `instanceof` ကို သုံးပါတယ် — `x instanceof Date` ဆိုရင် `x` က `Date` ဖြစ်တယ်လို့ TypeScript က သိပြီး သူ့ branch ထဲမှာ `Date` ရဲ့ method တွေကို လုံခြုံစွာ သုံးလို့ရပါတယ်။ ဒီနှစ်ခုစလုံးက JavaScript ရဲ့ native operator တွေမို့ — သီးခြား code တစ်ခုခု မလိုဘဲ type-safe ဖြစ်စေပါတယ်။

## Discriminated union — type field နဲ့ narrowing

Object တွေမှာ literal type ရှိတဲ့ property တစ်ခု (ဥပမာ `kind`) ပါရင် — union member တွေကို ရှင်းရှင်းလင်းလင်း ခွဲခြားလို့ရပါတယ် (discriminated union)။ `kind` နဲ့ `radius?` လိုမျိုး optional property တွေ ရောထားတဲ့ ပုံစံထက် — interface တစ်ခုချင်းစီမှာ `kind` နဲ့ သက်ဆိုင်ရာ property တွေ ထည့်ပြီး union အဖြစ် ပေါင်းတာ ပိုကောင်းပါတယ်။ အဲဒါဆိုရင် TypeScript က `kind` ကို check လုပ်တာနဲ့ပဲ member တွေကို ခွဲခြားပေးနိုင်ပါတယ်:

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
  }
}
```

`kind` ကို discriminant (ခွဲခြားပေးတဲ့ property) လို့ ခေါ်ပြီး — `switch` မှာပဲ ဖြစ်ဖြစ် `if` မှာပဲ ဖြစ်ဖြစ် `shape.kind === "circle"` စစ်လိုက်တာနဲ့ ကျန် member တွေကို TypeScript က ဖယ်ပစ်ပြီး `shape` ကို `Circle` type အနေနဲ့ သုံးပေးနိုင်ပါတယ်။ ဒီလို encoding လုပ်နည်းက circle/square လို shape တွေအတွက်သာမက — network message တွေ၊ state management ရဲ့ action တွေလိုမျိုး "ပုံစံအမျိုးမျိုးနဲ့ လာနိုင်တဲ့ data" တွေမှာ အသုံးဝင်ပါတယ်။

## never type နဲ့ exhaustiveness checking

Narrowing လုပ်တဲ့အခါ — union ထဲက ဖြစ်နိုင်ခြေ အားလုံးကို ဖယ်ပြီးသွားရင် TypeScript က `never` type ကို သုံးပါတယ်။ `never` က "မဖြစ်နိုင်တော့တဲ့ state" ကို ကိုယ်စားပြုပြီး — `never` ကို ဘယ် type မဆို assign လို့ရပေမယ့် `never` ဆီကို တခြား type ကတော့ assign လို့မရပါဘူး။ ဒီလက္ခဏာကို သုံးပြီး switch statement တွေမှာ case အားလုံး ဖုံးအားပြီးသားလား စစ်လို့ရပါတယ် (exhaustiveness checking) — default case မှာ value ကို `never` ဆီ assign လုပ်ကြည့်ပြီး error တက်ရင် case တစ်ခုခု ကျန်နေသေးတာ ဖြစ်ပါတယ်:

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

နောက်ပိုင်း `Shape` union ထဲကို `Triangle` လို member အသစ် ထည့်လိုက်ရင် — `switch` ထဲမှာ `triangle` case မရှိတော့ default မှာ `shape` က `never` မဟုတ်တော့ဘဲ error တက်ပြီး မေ့ကျန်နေတဲ့ case ရှိတာကို သိစေပါတယ်။ ဒါက discriminated union နဲ့ တွဲသုံးရင် အရမ်းအသုံးဝင်တဲ့ ပုံစံပါ။

## ဆက်လက်လေ့လာရန်

- [နေ့စဉ်သုံး Types](/docs/typescript/everyday-types) — union types, type aliases, literal types အခြေခံ
- [Functions အသေးစိတ်](/docs/typescript/functions) — generic functions, overloads, never return type
- [Classes](/docs/typescript/classes) — instanceof နဲ့ class တွေ ပေါင်းသုံးခြင်း
