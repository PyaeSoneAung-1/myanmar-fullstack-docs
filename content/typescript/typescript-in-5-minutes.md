---
title: "TypeScript for JavaScript Programmers (JavaScript Programmer များအတွက် TypeScript)"
description: "JavaScript programmer များအတွက် TypeScript မိတ်ဆက် — type inference, interfaces, unions, generics နှင့် structural type system တို့ကို အဓိက ထား၍ ၅ မိနစ်အတွင်း ခြုံငုံ သုံးသပ်ချက်"
order: 41
source: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html"
status: translated
updated: 2026-09-05
---

TypeScript က JavaScript နဲ့ ထူးခြားတဲ့ ဆက်စပ်မှုတစ်ခုထဲမှာ ရပ်တည်နေပါတယ်။ TypeScript က JavaScript ရဲ့ feature တွေ အားလုံးကို ပေးဆောင်ပြီး — ဒါတွေရဲ့ အပေါ်မှာ နောက်ထပ် အလွှာတစ်ခုကိုပါ ထပ်ဖြည့်ပေးပါတယ်: TypeScript ရဲ့ type system ပါ။

ဥပမာ — JavaScript က `string` နဲ့ `number` လိုမျိုး language primitives တွေ ပေးပေမယ့် — ဒါတွေကို သင်တစိုက်မတ်မတ် assign လုပ်ထားလားဆိုတာကို မစစ်ဆေးပေးပါဘူး။ TypeScript ကတော့ စစ်ဆေးပေးပါတယ်။

ဒါကြောင့် — သင်ရေးထားတဲ့ အလုပ်လုပ်နေတဲ့ JavaScript code တွေဟာ TypeScript code တွေလည်း ဖြစ်ပါတယ်။ TypeScript ရဲ့ အဓိက အကျိုးကျေးဇူးကတော့ — သင့် code ထဲက မမျှော်လင့်ထားတဲ့ အပြုအမူတွေကို မီးမောင်းထိုးပြနိုင်တာမို့ — bug တွေ ဖြစ်နိုင်ခြေကို လျှော့ချပေးပါတယ်။

ဒီ tutorial က TypeScript အကြောင်း — အဓိကအားဖြင့် သူ့ရဲ့ type system ကို ဗဟိုပြုတဲ့ — အကျဉ်းချုပ် ခြုံငုံသုံးသပ်ချက် တစ်ခုကို ပေးပါတယ်။

## Types by Inference (Inference အားဖြင့် Type များ)

TypeScript က JavaScript language ကို နားလည်ထားပြီး — အခြေအနေ အများစုမှာ သင့်အတွက် types တွေကို generate လုပ်ပေးပါတယ်။
ဥပမာ — variable တစ်ခု ဖန်တီးပြီး value တစ်ခုကို assign လုပ်လိုက်တဲ့အခါ — TypeScript က အဲဒီ value ကိုပဲ သူ့ရဲ့ type အဖြစ် သုံးပါတယ်။

```ts twoslash
let helloWorld = "Hello World";
//  ^?
```

JavaScript ဘယ်လို အလုပ်လုပ်လဲဆိုတာကို နားလည်ထားခြင်းအားဖြင့် — TypeScript က JavaScript code တွေကို လက်ခံပေမယ့် types တွေပါတဲ့ type system တစ်ခုကို တည်ဆောက်နိုင်ပါတယ်။ ဒါက — သင့် code ထဲမှာ types တွေကို ထင်ရှားအောင် ဖော်ပြဖို့ စာလုံးအပိုတွေ ထည့်စရာ မလိုတဲ့ type system တစ်ခုကို ပေးပါတယ်။ ဒါကြောင့်ပဲ — အပေါ်က ဥပမာမှာ `helloWorld` က `string` ဖြစ်တယ်ဆိုတာကို TypeScript က သိတာပါ။

သင်ဟာ Visual Studio Code ထဲမှာ JavaScript ရေးဖူးပြီး — editor ရဲ့ auto-completion ကို အသုံးပြုဖူးမှာပါ။ Visual Studio Code က JavaScript နဲ့ အလုပ်လုပ်ရတာ လွယ်ကူစေဖို့ — နောက်ကွယ်မှာ TypeScript ကို အသုံးပြုထားပါတယ်။

## Defining Types (Type များ သတ်မှတ်ခြင်း)

JavaScript မှာ design patterns (ဒီဇိုင်းပုံစံ) အမျိုးမျိုးကို သုံးနိုင်ပါတယ်။ ဒါပေမယ့် — design pattern တစ်ချို့က types တွေကို အလိုအလျောက် infer လုပ်ဖို့ ခက်ခဲစေပါတယ် (ဥပမာ — dynamic programming သုံးတဲ့ patterns တွေပါ)။ ဒီလို အခြေအနေတွေကို ဖုံးအုပ်ဖို့ — TypeScript က JavaScript language ရဲ့ extension တစ်ခုကို ထောက်ပံ့ပေးပါတယ် — အဲဒီမှာ types တွေက ဘာဖြစ်သင့်လဲဆိုတာကို TypeScript ကို ပြောပြဖို့ နေရာတွေ ပေးထားပါတယ်။

ဥပမာ — `name: string` နဲ့ `id: number` ပါဝင်တဲ့ inferred type ရှိတဲ့ object တစ်ခု ဖန်တီးဖို့ — ဒီလို ရေးနိုင်ပါတယ်:

```ts twoslash
const user = {
  name: "Hayes",
  id: 0,
};
```

ဒီ object ရဲ့ shape (ပုံသဏ္ဍာန်) ကို `interface` declaration တစ်ခု သုံးပြီး — ထင်ရှားစွာ ဖော်ပြနိုင်ပါတယ်:

```ts twoslash
interface User {
  name: string;
  id: number;
}
```

ပြီးရင် — variable declaration တစ်ခုရဲ့ နောက်မှာ `: TypeName` လိုမျိုး syntax သုံးပြီး — JavaScript object တစ်ခုက သင့် `interface` အသစ်ရဲ့ shape နဲ့ ကိုက်ညီတယ်လို့ ကြေညာနိုင်ပါတယ်:

```ts twoslash
interface User {
  name: string;
  id: number;
}
// ---cut---
const user: User = {
  name: "Hayes",
  id: 0,
};
```

သင်ပေးလိုက်တဲ့ interface နဲ့ မကိုက်ညီတဲ့ object တစ်ခုကို ထည့်ပေးလိုက်ရင် — TypeScript က သတိပေးပါလိမ့်မယ်:

```ts twoslash
// @errors: 2322
interface User {
  name: string;
  id: number;
}

const user: User = {
  username: "Hayes",
  id: 0,
};
```

JavaScript က classes တွေနဲ့ object-oriented programming ကို ထောက်ပံ့ထားတာမို့ — TypeScript ကလည်း ထောက်ပံ့ပါတယ်။ Interface declaration တစ်ခုကို classes တွေနဲ့တွဲ သုံးနိုင်ပါတယ်:

```ts twoslash
interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

const user: User = new UserAccount("Murphy", 1);
```

Interfaces တွေကို function တွေရဲ့ parameters နဲ့ return values တွေကို annotate လုပ်ဖို့လည်း သုံးနိုင်ပါတယ်:

```ts twoslash
// @noErrors
interface User {
  name: string;
  id: number;
}
// ---cut---
function deleteUser(user: User) {
  // ...
}

function getAdminUser(): User {
  //...
}
```

JavaScript မှာ primitive types အစုအဝေး အနည်းငယ် ရှိပြီးသားပါ: `boolean`, `bigint`, `null`, `number`, `string`, `symbol`, နဲ့ `undefined` — ဒါတွေကို interface တစ်ခုထဲမှာ သုံးနိုင်ပါတယ်။ TypeScript က ဒီစာရင်းကို နောက်ထပ် အနည်းငယ် ထပ်တိုးပေးပါတယ် — `any` (ဘာကိုမဆို ခွင့်ပြုသည်), [`unknown`](https://www.typescriptlang.org/play) (ဒီ type ကို သုံးသူတစ်ယောက်က type က ဘာလဲဆိုတာ ကြေညာဖို့ သေချာစေသည်), [`never`](https://www.typescriptlang.org/play) (ဒီ type မျိုး ဖြစ်ပွားဖို့ မဖြစ်နိုင်ပါ), နဲ့ `void` (`undefined` ကို return လုပ်တဲ့ ဒါမှမဟုတ် return value လုံးဝမရှိတဲ့ function) တို့ ဖြစ်ပါတယ်။

Types တွေ တည်ဆောက်ဖို့ syntax နှစ်မျိုး ရှိတာကို သင်တွေ့ရပါလိမ့်မယ်: [Interfaces and Types](https://www.typescriptlang.org/play/?e=83) ပါ။ `interface` ကို ဦးစားပေး သုံးသင့်ပါတယ်။ တိကျတဲ့ feature တွေ လိုအပ်တဲ့အခါမှသာ `type` ကို သုံးပါ။

## Composing Types (Type များ ပေါင်းစပ်ခြင်း)

TypeScript နဲ့ဆိုရင် — ရိုးရှင်းတဲ့ types တွေကို ပေါင်းစပ်ပြီး ရှုပ်ထွေးတဲ့ types တွေကို ဖန်တီးနိုင်ပါတယ်။ ဒီလို လုပ်ဖို့ လူကြိုက်များတဲ့ နည်းလမ်း နှစ်ခု ရှိပါတယ်: unions နဲ့ generics ပါ။

### Unions (Union များ)

Union တစ်ခုနဲ့ဆိုရင် — type တစ်ခုဟာ types အများကြီးထဲက တစ်ခု ဖြစ်နိုင်တယ်လို့ ကြေညာနိုင်ပါတယ်။ ဥပမာ — `boolean` type တစ်ခုကို `true` ဒါမှမဟုတ် `false` ဖြစ်တယ်လို့ ဖော်ပြနိုင်ပါတယ်:

```ts twoslash
type MyBool = true | false;
```

_မှတ်ချက်:_ အပေါ်က `MyBool` အပေါ်မှာ hover လုပ်ကြည့်ရင် — သူ့ကို `boolean` အဖြစ် သတ်မှတ်ထားတာ တွေ့ရပါလိမ့်မယ်။ ဒါက Structural Type System ရဲ့ ဂုဏ်သတ္တိတစ်ခုပါ။ ဒီအကြောင်းကို အောက်မှာ ဆက်ပြောပါမယ်။

Union types တွေရဲ့ လူကြိုက်များတဲ့ အသုံးအနှုန်းတစ်ခုက — value တစ်ခု ဖြစ်ခွင့်ရှိတဲ့ `string` ဒါမှမဟုတ် `number` [literals](/docs/typescript/everyday-types) တွေရဲ့ အစုအဝေးကို ဖော်ပြဖို့ပါ:

```ts twoslash
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type PositiveOddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
```

Unions တွေက type အမျိုးမျိုးကို ကိုင်တွယ်ဖို့ နည်းလမ်းတစ်ခုလည်း ပေးပါတယ်။ ဥပမာ — `array` တစ်ခု ဒါမှမဟုတ် `string` တစ်ခုကို လက်ခံတဲ့ function တစ်ခု သင့်မှာ ရှိနိုင်ပါတယ်:

```ts twoslash
function getLength(obj: string | string[]) {
  return obj.length;
}
```

Variable တစ်ခုရဲ့ type ကို သိရှိဖို့ — `typeof` ကို သုံးပါ:

| Type      | Predicate                          |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| boolean   | `typeof b === "boolean"`           |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |

ဥပမာ — function တစ်ခုကို string ဖြစ်ဖြစ် array ဖြစ်ဖြစ် ပို့လိုက်တာပေါ် မူတည်ပြီး — မတူညီတဲ့ values တွေ return လုပ်တဲ့ function တစ်ခု ဖန်တီးနိုင်ပါတယ်:

```ts twoslash
function wrapInArray(obj: string | string[]) {
  if (typeof obj === "string") {
    return [obj];
//          ^?
  }
  return obj;
}
```

### Generics (Generics များ)

Generics တွေက types တွေအတွက် variables တွေကို ပေးပါတယ်။ အဖြစ်များတဲ့ ဥပမာက array ပါ။ Generics မပါတဲ့ array တစ်ခုက ဘာကိုမဆို ထည့်ထားနိုင်ပါတယ်။ Generics ပါတဲ့ array တစ်ခုကတော့ — array ထဲမှာ ဘာ values တွေ ပါတယ်ဆိုတာကို ဖော်ပြနိုင်ပါတယ်။

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
```

Generics တွေကို သုံးတဲ့ ကိုယ်ပိုင် types တွေကိုလည်း ကြေညာနိုင်ပါတယ်:

```ts twoslash
// @errors: 2345
interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

// This line is a shortcut to tell TypeScript there is a
// constant called `backpack`, and to not worry about where it came from.
declare const backpack: Backpack<string>;

// object is a string, because we declared it above as the variable part of Backpack.
const object = backpack.get();

// Since the backpack variable is a string, you can't pass a number to the add function.
backpack.add(23);
```

## Structural Type System (ဖွဲ့စည်းပုံအခြေပြု Type System)

TypeScript ရဲ့ အဓိက နိယာမတစ်ခုက — type checking က values တွေမှာ ရှိတဲ့ _shape_ (ပုံသဏ္ဍာန်) ကို ဗဟိုပြုတာပါ။ ဒါကို တစ်ခါတလေ "duck typing" ဒါမှမဟုတ် "structural typing" လို့ ခေါ်ပါတယ်။

Structural type system တစ်ခုမှာ — object နှစ်ခုမှာ shape တူညီနေရင် — သူတို့ကို type တစ်ခုတည်း ရှိတယ်လို့ သတ်မှတ်ပါတယ်။

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// logs "12, 26"
const point = { x: 12, y: 26 };
logPoint(point);
```

`point` variable ကို `Point` type ဖြစ်တယ်လို့ ဘယ်တော့မှ ကြေညာထားတာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — type-check လုပ်တဲ့အခါ TypeScript က `point` ရဲ့ shape ကို `Point` ရဲ့ shape နဲ့ နှိုင်းယှဉ်ပါတယ်။ Shape တွေ တူညီတာမို့ — code က အောင်မြင်စွာ ဖြတ်သန်းသွားပါတယ်။

Shape ကိုက်ညီမှုအတွက် — object ရဲ့ field တွေထဲက အစိတ်အပိုင်း (subset) တစ်ခုသာ ကိုက်ညီဖို့ လိုအပ်ပါတယ်။

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---cut---
const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3); // logs "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // logs "33, 3"

const color = { hex: "#187ABF" };
logPoint(color);
```

Classes တွေနဲ့ objects တွေ shapes တွေနဲ့ ကိုက်ညီပုံမှာ ဘာကွာခြားမှုမှ မရှိပါဘူး:

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---cut---
class VirtualPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const newVPoint = new VirtualPoint(13, 56);
logPoint(newVPoint); // logs "13, 56"
```

Object ဒါမှမဟုတ် class တစ်ခုမှာ လိုအပ်တဲ့ properties အားလုံး ရှိနေရင် — implementation ရဲ့ အသေးစိတ်တွေ ဘယ်လိုပဲ ဖြစ်နေပါစေ — TypeScript က ကိုက်ညီတယ်လို့ ဆိုပါလိမ့်မယ်။

## Next Steps (နောက်ထပ် ဆက်လုပ်ရန် အဆင့်များ)

ဒါဟာ နေ့စဉ် TypeScript မှာ သုံးတဲ့ syntax နဲ့ tools တွေရဲ့ အကျဉ်းချုပ် ခြုံငုံသုံးသပ်ချက်ပါ။ ဒီကနေ သင်လုပ်နိုင်တာတွေက:

- Handbook တစ်အုပ်လုံးကို [အစအဆုံး](/docs/typescript/getting-started) ဖတ်ရှုပါ
- [Playground ဥပမာများ](https://www.typescriptlang.org/play) ကို စူးစမ်းလေ့လာပါ
