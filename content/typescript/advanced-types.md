---
title: "Advanced Types (အဆင့်မြင့် Type များ)"
description: "Type guards, nullable types, type aliases, mapped types, conditional types အစရှိတဲ့ အဆင့်မြင့် type ပုံစံဖော်ခြင်း (modeling) နည်းလမ်းများ — ဥပမာများနဲ့တကွ"
order: 53
source: "https://www.typescriptlang.org/docs/handbook/advanced-types.html"
status: translated
updated: 2026-09-05
---

ဒီ page မှာ types တွေကို model လုပ်တဲ့ (ပုံစံဖော်တဲ့) နည်းလမ်းတွေထဲက ပိုပြီး အဆင့်မြင့်တဲ့ နည်းလမ်းတချို့ကို ဖော်ပြထားပါတယ် — TypeScript ထဲမှာ ပါဝင်ပြီး နေရာတိုင်းမှာ သုံးလို့ရတဲ့ types တွေ ပါဝင်တဲ့ [Utility Types](/docs/typescript/utility-types) doc နဲ့ တွဲဖတ်ဖို့ သင့်တော်ပါတယ်။

## Type Guards and Differentiating Types (Type Guards နဲ့ Type တွေကို ခွဲခြားခြင်း)

Union types တွေက — တန်ဖိုးတွေ ယူနိုင်တဲ့ types တွေ ထပ်နေနိုင်တဲ့ (overlap ဖြစ်နိုင်တဲ့) အခြေအနေတွေကို model လုပ်ဖို့ အသုံးဝင်ပါတယ်။ ကျွန်တော်တို့မှာ `Fish` တစ်ကောင် ရှိမရှိကို အတိအကျ သိဖို့ လိုအပ်လာတဲ့အခါ ဘာဖြစ်မလဲ? JavaScript မှာ ဖြစ်နိုင်တဲ့ တန်ဖိုးနှစ်ခုကို ခွဲခြားဖို့ သုံးလေ့ရှိတဲ့ နည်းတစ်နည်းကတော့ — member တစ်ခု ရှိမရှိကို စစ်ဆေးတာပါ။ အစောပိုင်းမှာ ပြောခဲ့သလိုပဲ — union type ထဲက constituent (အဖွဲ့ဝင် type) တိုင်းမှာ သေချာပေါက် ရှိတယ်လို့ အာမခံနိုင်တဲ့ members တွေကိုပဲ သင်ဝင်ရောက်လို့ ရပါတယ်။

```ts twoslash
// @errors: 2339
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
// ---cut---
let pet = getSmallPet();

// You can use the 'in' operator to check
if ("swim" in pet) {
  pet.swim();
}
// However, you cannot use property access
if (pet.fly) {
  pet.fly();
}
```

အဲဒီ code ကိုပဲ property accessors ကနေတစ်ဆင့် အလုပ်လုပ်အောင် လုပ်ဖို့ဆိုရင် — type assertion (type တစ်ခုကို အခြား type အဖြစ် သတ်မှတ်ပေးခြင်း) ကို သုံးဖို့ လိုပါလိမ့်မယ်:

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
// ---cut---
let pet = getSmallPet();
let fishPet = pet as Fish;
let birdPet = pet as Bird;

if (fishPet.swim) {
  fishPet.swim();
} else if (birdPet.fly) {
  birdPet.fly();
}
```

ဒါပေမယ့် — ဒီလိုမျိုး code ကတော့ သင့် codebase ထဲမှာ ထည့်ချင်စရာ code မျိုး မဟုတ်ပါဘူး။

## User-Defined Type Guards (User ကိုယ်တိုင် သတ်မှတ်သော Type Guards)

Check လုပ်လိုက်တာနဲ့ — branch တစ်ခုချင်းစီထဲမှာ `pet` ရဲ့ type က ဘာလဲဆိုတာကို သိသွားရင် ပိုကောင်းမှာပေါ့။

ကံကောင်းတာက — TypeScript မှာ _type guard_ လို့ ခေါ်တဲ့ အရာတစ်ခု ရှိပါတယ်။ Type guard ဆိုတာ — scope (နယ်ပယ်) တစ်ခုအတွင်းမှာ type ကို အာမခံပေးတဲ့ runtime check (run ချိန်မှာ စစ်ဆေးမှု) တစ်ခုကို လုပ်ဆောင်ပေးတဲ့ expression တစ်ခုပါ။

### Using type predicates (Type Predicates သုံးခြင်း)

Type guard တစ်ခုကို သတ်မှတ်ဖို့ဆိုရင် — return type က _type predicate_ ဖြစ်တဲ့ function တစ်ခုကို ရေးရုံပါပဲ:

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
// ---cut---
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

ဒီဥပမာထဲမှာ `pet is Fish` က ကျွန်တော်တို့ရဲ့ type predicate ပါ။ Predicate တစ်ခုက `parameterName is Type` ဆိုတဲ့ ပုံစံမျိုး ဖြစ်ပြီး — `parameterName` က လက်ရှိ function signature ထဲက parameter တစ်ခုရဲ့ နာမည် ဖြစ်ရပါမယ်။

`isFish` ကို variable တစ်ခုနဲ့ ခေါ်လိုက်တိုင်း — မူရင်း type က compatible (လိုက်ဖက်ညီ) ဖြစ်နေရင် — TypeScript က အဲဒီ variable ကို သတ်မှတ်ထားတဲ့ type ဆီ _narrow_ (ကျဉ်းမြောင်းသွားအောင် ပြုလုပ်) လုပ်ပေးပါလိမ့်မယ်။

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

`if` branch ထဲမှာ `pet` က `Fish` ဖြစ်တယ်ဆိုတာကိုသာ TypeScript က သိတာ မဟုတ်ပါဘူး — `else` branch ထဲမှာ သင့်မှာ `Fish` _မရှိ_ ဘူးဆိုတာကိုလည်း သိတာမို့ — `Bird` ပဲ ဖြစ်ရမယ်ဆိုတာကို သိပါတယ်။

`Fish | Bird` တွေ ပါဝင်တဲ့ array တစ်ခုကို `isFish` ဆိုတဲ့ type guard နဲ့ filter လုပ်ပြီး — `Fish` တွေပဲ ပါတဲ့ array တစ်ခုကို ရယူလို့ ရပါတယ်:

```ts twoslash
// @errors: 2345
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter<Fish>(isFish);
const underWater3: Fish[] = zoo.filter<Fish>((pet) => isFish(pet));
```

### Using the `in` operator (`in` Operator သုံးခြင်း)

`in` operator ကလည်း types တွေအတွက် narrowing expression တစ်ခုအနေနဲ့ ဆောင်ရွက်ပါတယ်။

`n in x` ဆိုတဲ့ expression တစ်ခုမှာ — `n` က string literal ဒါမှမဟုတ် string literal type ဖြစ်ပြီး `x` က union type ဖြစ်တဲ့အခါ — "true" branch က `n` ဆိုတဲ့ property ကို optional ဒါမှမဟုတ် required အနေနဲ့ ပါဝင်တဲ့ types တွေဆီ narrow လုပ်ပြီး — "false" branch ကတော့ `n` ဆိုတဲ့ property ကို optional အဖြစ် ဒါမှမဟုတ် လုံးဝမပါဝင်တဲ့ types တွေဆီ narrow လုပ်ပါတယ်။

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
// ---cut---
function move(pet: Fish | Bird) {
  if ("swim" in pet) {
    return pet.swim();
  }
  return pet.fly();
}
```

## `typeof` type guards (`typeof` Type Guards များ)

Union types သုံးထားတဲ့ `padLeft` version တစ်ခုအတွက် code ကို ပြန်သွားပြီး ရေးကြည့်ရအောင်။ Type predicates တွေနဲ့ဆိုရင် ဒီလို ရေးလို့ ရပါတယ်:

```ts twoslash
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}

function padLeft(value: string, padding: string | number) {
  if (isNumber(padding)) {
    return Array(padding + 1).join(" ") + value;
  }
  if (isString(padding)) {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

ဒါပေမယ့် — type တစ်ခုက primitive လားဆိုတာ သိဖို့ function တစ်ခုကို သတ်မှတ်ရတာက တော်တော် ဒုက္ခရောက်စရာပါ။ ကံကောင်းတာက — TypeScript က `typeof x === "number"` ကို သူ့ဘာသာသူ type guard အဖြစ် အသိအမှတ်ပြုတာမို့ — ဒါကို ကိုယ်ပိုင် function အဖြစ် abstract လုပ်ဖို့ မလိုပါဘူး။ ဆိုလိုတာက — ဒီ check တွေကို inline အနေနဲ့ တန်းရေးလို့ ရပါတယ်။

```ts twoslash
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

ဒီ _`typeof` type guards_ တွေကို ပုံစံ နှစ်မျိုးနဲ့ အသိအမှတ်ပြုပါတယ်: `typeof v === "typename"` နဲ့ `typeof v !== "typename"` — ဒီမှာ `"typename"` က [`typeof` operator ရဲ့ return values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#Description) တွေထဲက တစ်ခုခု ဖြစ်နိုင်ပါတယ် (`"undefined"`, `"number"`, `"string"`, `"boolean"`, `"bigint"`, `"symbol"`, `"object"`, ဒါမှမဟုတ် `"function"`)။ TypeScript က တခြား strings တွေနဲ့ နှိုင်းယှဉ်တာကို တားမြစ်မှာ မဟုတ်ပေမယ့် — အဲဒီလို expressions တွေကိုတော့ language က type guards အဖြစ် အသိအမှတ် ပြုမှာ မဟုတ်ပါဘူး။

## `instanceof` type guards (`instanceof` Type Guards များ)

`typeof` type guards အကြောင်း ဖတ်ပြီးပြီဆိုရင် — JavaScript ထဲက `instanceof` operator နဲ့လည်း ရင်းနှီးနေတယ်ဆိုရင် — ဒီ section မှာ ဘာအကြောင်း ပြောမယ်ဆိုတာ ခန့်မှန်းလို့ ရနေပါပြီ။

_`instanceof` type guards_ တွေက — constructor function တွေကို သုံးပြီး types တွေကို narrow လုပ်တဲ့ နည်းလမ်းတစ်ခုပါ။ ဥပမာအနေနဲ့ — အစောပိုင်းက ကျွန်တော်တို့ရဲ့ industrial strength string-padder ဥပမာကိုပဲ ပြန်သုံးကြည့်ရအောင်:

```ts twoslash
interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value;
  }
}

function getRandomPadder() {
  return Math.random() < 0.5
    ? new SpaceRepeatingPadder(4)
    : new StringPadder("  ");
}

let padder: Padder = getRandomPadder();
//       ^?

if (padder instanceof SpaceRepeatingPadder) {
  padder;
  //   ^?
}
if (padder instanceof StringPadder) {
  padder;
  //   ^?
}
```

`instanceof` ရဲ့ ညာဘက်ခြမ်းက constructor function တစ်ခု ဖြစ်ရမှာ ဖြစ်ပြီး — TypeScript က အောက်ပါအတိုင်း အစဉ်လိုက် narrow လုပ်ပါလိမ့်မယ်:

1. function ရဲ့ `prototype` property ရဲ့ type က `any` မဟုတ်ရင် — အဲဒီ `prototype` property ရဲ့ type
2. အဲဒီ type ရဲ့ construct signatures တွေက return လုပ်တဲ့ types တွေရဲ့ union

## Nullable types (Nullable Types များ)

TypeScript မှာ အထူး types နှစ်ခု — `null` နဲ့ `undefined` — ရှိပြီး — အဲဒီ types တွေမှာ null နဲ့ undefined ဆိုတဲ့ တန်ဖိုးတွေ အသီးသီး ရှိပါတယ်။ ဒါတွေကို [the Basic Types section](https://www.typescriptlang.org/docs/handbook/basic-types.html) မှာ အကျဉ်းချုံး ဖော်ပြခဲ့ပြီးပါပြီ။

ပုံမှန်အားဖြင့် — type checker က `null` နဲ့ `undefined` ကို ဘယ်အရာဆီမဆို assign လုပ်လို့ရတဲ့ (assignable) အနေနဲ့ သတ်မှတ်ပါတယ်။ လက်တွေ့အားဖြင့် — `null` နဲ့ `undefined` တွေက type တိုင်းရဲ့ တရားဝင် တန်ဖိုးတွေ ဖြစ်နေပါတယ်။ ဆိုလိုတာက — သင်တားဆီးချင်တဲ့ အခြေအနေမျိုးမှာတောင် — သူတို့ကို ဘယ် type ဆီမဆို assign လုပ်တာကို _တားဆီး_ ဖို့ မဖြစ်နိုင်ပါဘူး။ `null` ကို တီထွင်ခဲ့တဲ့ Tony Hoare ကတော့ ဒါကို သူ့ရဲ့ ["billion dollar mistake"](https://wikipedia.org/wiki/Null_pointer#History) လို့ ခေါ်ပါတယ်။

[`strictNullChecks`](https://www.typescriptlang.org/tsconfig) flag ကတော့ ဒါကို ပြင်ဆင်ပေးပါတယ်: variable တစ်ခုကို ကြေညာတဲ့အခါ — `null` ဒါမှမဟုတ် `undefined` ကို အလိုအလျောက် မပါဝင်တော့ပါဘူး။ သူတို့ကို union type သုံးပြီး ကိုယ်တိုင် ထည့်သွင်းလို့ ရပါတယ်:

```ts twoslash
// @errors: 2322
let exampleString = "foo";
exampleString = null;

let stringOrNull: string | null = "bar";
stringOrNull = null;

stringOrNull = undefined;
```

`null` နဲ့ `undefined` ကို TypeScript က JavaScript ရဲ့ semantics (အဓိပ္ပာယ်ဖွင့်ဆိုချက်) နဲ့ ကိုက်ညီအောင် — မတူညီတဲ့ types တွေအနေနဲ့ သဘောထားတယ်ဆိုတာ သတိပြုပါ။ `string | null` က `string | undefined` နဲ့ မတူညီတဲ့ type တစ်ခု ဖြစ်ပြီး — `string | undefined | null` နဲ့လည်း မတူပါဘူး။

TypeScript 3.7 ကစပြီး — nullable types တွေနဲ့ အလုပ်လုပ်ရတာ လွယ်ကူအောင် [optional chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html) ကို သုံးလို့ ရပါတယ်။

### Optional parameters and properties (Optional Parameters နဲ့ Properties များ)

[`strictNullChecks`](https://www.typescriptlang.org/tsconfig) ဖွင့်ထားရင် — optional parameter တစ်ခုက `| undefined` ကို အလိုအလျောက် ထည့်ပေးပါတယ်:

```ts twoslash
// @errors: 2345
function f(x: number, y?: number) {
  return x + (y ?? 0);
}

f(1, 2);
f(1);
f(1, undefined);
f(1, null);
```

Optional properties တွေအတွက်လည်း အလားတူပါပဲ:

```ts twoslash
// @strict: false
// @strictNullChecks: true
// @errors: 2322
class C {
  a: number;
  b?: number;
}

let c = new C();

c.a = 12;
c.a = undefined;
c.b = 13;
c.b = undefined;
c.b = null;
```

### Type guards and type assertions (Type Guards နဲ့ Type Assertions များ)

Nullable types တွေကို union နဲ့ အကောင်အထည်ဖော်ထားတာမို့ — `null` ကို ဖယ်ရှားဖို့ type guard တစ်ခုကို သုံးဖို့ လိုပါတယ်။ ကံကောင်းတာက — ဒါက JavaScript မှာ သင်ရေးလေ့ရှိတဲ့ code အတိုင်းပဲ ဖြစ်ပါတယ်:

```ts twoslash
function f(stringOrNull: string | null): string {
  if (stringOrNull === null) {
    return "default";
  } else {
    return stringOrNull;
  }
}
```

ဒီမှာ `null` ကို ဖယ်ရှားလိုက်တာက သိသာပေမယ့် — ပိုပြီး တိုတိုတုတ်တုတ် operators တွေလည်း သုံးလို့ ရပါတယ်:

```ts twoslash
function f(stringOrNull: string | null): string {
  return stringOrNull ?? "default";
}
```

Compiler က `null` ဒါမှမဟုတ် `undefined` ကို ဖယ်ရှားလို့ မရတဲ့ အခြေအနေတွေမှာ — type assertion operator ကို သုံးပြီး လက်နဲ့ ဖယ်ရှားနိုင်ပါတယ်။ အဲဒါရဲ့ syntax က postfix `!` ဖြစ်ပြီး — `identifier!` က `identifier` ရဲ့ type ထဲကနေ `null` နဲ့ `undefined` တွေကို ဖယ်ရှားပေးပါတယ်:

```ts twoslash
// @errors: 2532 18048
function getUser(id: string): UserAccount | undefined {
  return {} as any;
}
// ---cut---
interface UserAccount {
  id: number;
  email?: string;
}

const user = getUser("admin");
user.id;

if (user) {
  user.email.length;
}

// Instead if you are sure that these objects or fields exist, the
// postfix ! lets you short circuit the nullability
user!.email!.length;
```

## Type Aliases (Type Aliases များ)

Type aliases တွေက type တစ်ခုအတွက် နာမည်အသစ် တစ်ခုကို ဖန်တီးပေးပါတယ်။ Type aliases တွေက interfaces တွေနဲ့ တခါတရံ ဆင်တူပေမယ့် — primitives, unions, tuples စတဲ့ — တခြားနည်းဆိုရင် လက်နဲ့ပဲ ရေးရမယ့် type တွေကိုပါ နာမည်ပေးလို့ ရပါတယ်။

```ts twoslash
type Second = number;

let timeInSecond: number = 10;
let time: Second = 10;
```

Aliasing လုပ်တာက type အသစ် တစ်ခုကို တကယ် ဖန်တီးပေးတာ မဟုတ်ပါဘူး — အဲဒီ type ကို ရည်ညွှန်းဖို့ _နာမည်အသစ်_ တစ်ခုကို ဖန်တီးပေးတာပါ။ Primitive တစ်ခုကို alias လုပ်တာက သိပ်အသုံးမဝင်လှပေမယ့် — documentation (မှတ်တမ်း) ပုံစံတစ်မျိုးအနေနဲ့တော့ သုံးလို့ ရပါတယ်။

Interfaces တွေလိုပဲ — type aliases တွေလည်း generic ဖြစ်နိုင်ပါတယ် — type parameters တွေကို ထည့်ပြီး — alias declaration ရဲ့ ညာဘက်ခြမ်းမှာ သုံးရုံပါပဲ:

```ts
type Container<T> = { value: T };
```

Type alias တစ်ခုကို property တစ်ခုထဲမှာ သူ့ဘာသာသူ ရည်ညွှန်းတာမျိုးလည်း လုပ်နိုင်ပါတယ်:

```ts
type Tree<T> = {
  value: T;
  left?: Tree<T>;
  right?: Tree<T>;
};
```

[intersection](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html) types တွေနဲ့ တွဲသုံးရင် — တော်တော် စိတ်ဝင်စားစရာကောင်းတဲ့ types တွေကိုပါ ဖန်တီးလို့ ရပါတယ်:

```ts twoslash
declare function getDriversLicenseQueue(): LinkedList<Person>;
// ---cut---
type LinkedList<Type> = Type & { next: LinkedList<Type> };

interface Person {
  name: string;
}

let people = getDriversLicenseQueue();
people.name;
people.next.name;
people.next.next.name;
people.next.next.next.name;
//                  ^?
```

## Interfaces vs. Type Aliases (Interfaces နဲ့ Type Aliases များ)

အစောပိုင်းမှာ ပြောခဲ့သလိုပဲ — type aliases တွေက interfaces တွေလိုမျိုး ဆောင်ရွက်နိုင်ပါတယ်; ဒါပေမယ့် — သိမ်မွေ့တဲ့ ကွဲပြားချက်တချို့တော့ ရှိပါတယ်။

`interface` ရဲ့ features (လုပ်ဆောင်ချက်များ) အားလုံးနီးပါးက `type` မှာလည်း ရနိုင်ပါတယ် — အဓိက ကွာခြားချက်ကတော့ — type တစ်ခုက နောက်ထပ် properties အသစ်တွေ ထည့်ဖို့ ပြန်ဖွင့်လို့ မရဘူး ဆိုတာပါ — interface ကတော့ အမြဲတမ်း extend လုပ်လို့ ရပါတယ်။

<div class='table-container'>
<table class='full-width-table'>
  <tbody>
    <tr>
      <th><code>Interface</code></th>
      <th><code>Type</code></th>
    </tr>
    <tr>
      <td>
        <p>Interface တစ်ခုကို extend လုပ်ခြင်း</p>
        <code><pre>
interface Animal {
  name: string
}<br/>
interface Bear extends Animal {
  honey: boolean
}<br/>
const bear = getBear() 
bear.name
bear.honey
        </pre></code>
      </td>
      <td>
        <p>Type တစ်ခုကို intersections ကနေတစ်ဆင့် extend လုပ်ခြင်း</p>
        <code><pre>
type Animal = {
  name: string
}<br/>
type Bear = Animal & { 
  honey: Boolean 
}<br/>
const bear = getBear();
bear.name;
bear.honey;
        </pre></code>
      </td>
    </tr>
    <tr>
      <td>
        <p>ရှိပြီးသား interface တစ်ခုကို fields အသစ်တွေ ထည့်ခြင်း</p>
        <code><pre>
interface Window {
  title: string
}<br/>
interface Window {
  ts: import("typescript")
}<br/>
const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
        </pre></code>
      </td>
      <td>
        <p>Type တစ်ခုကို ဖန်တီးပြီးတာနဲ့ ပြောင်းလဲလို့ မရတော့ခြင်း</p>
        <code><pre>
type Window = {
  title: string
}<br/>
type Window = {
  ts: import("typescript")
}<br/>
// Error: Duplicate identifier 'Window'.<br/>
        </pre></code>
      </td>
    </tr>
    </tbody>
</table>
</div>

Interface တစ်ခုက JavaScript objects တွေ အလုပ်လုပ်ပုံနဲ့ — [extension အတွက် ပွင့်လင်းထားတဲ့ သဘောသဘာဝ](https://wikipedia.org/wiki/Open/closed_principle) ရှိတာကြောင့် — ပိုပြီး နီးစပ်စွာ ကိုက်ညီတာမို့ — ဖြစ်နိုင်ရင် type alias ထက် interface ကို သုံးဖို့ အကြံပြုပါတယ်။

တစ်ဖက်မှာလည်း — shape (ပုံသဏ္ဍာန်) တစ်ခုကို interface နဲ့ ဖော်ပြလို့ မရဘဲ — union ဒါမှမဟုတ် tuple type တစ်ခုကို သုံးဖို့ လိုအပ်နေရင် — type aliases တွေက ပုံမှန်အားဖြင့် သွားရမယ့် လမ်းပါပဲ။

## Enum Member Types (Enum Member Types များ)

[enum တွေအကြောင်း ကျွန်တော်တို့ရဲ့ section](/docs/typescript/enums) မှာ ဖော်ပြခဲ့သလိုပဲ — member တိုင်းကို literal နဲ့ initialize လုပ်ထားတဲ့အခါ — enum members တွေမှာ types တွေ ရှိပါတယ်။

"singleton types" အကြောင်း ပြောတဲ့အခါ အများစုမှာ — enum member types တွေရော numeric/string literal types တွေရော နှစ်ခုလုံးကို ရည်ညွှန်းတာပါ — ဒါပေမယ့် သုံးစွဲသူ အများစုကတော့ "singleton types" နဲ့ "literal types" ကို တူညီတဲ့ အဓိပ္ပာယ်နဲ့ သုံးလေ့ ရှိကြပါတယ်။

## Polymorphic `this` types (Polymorphic `this` Types များ)

Polymorphic `this` type ဆိုတာ — ပါဝင်တဲ့ class ဒါမှမဟုတ် interface ရဲ့ _subtype_ (အမျိုးအစားခွဲ) ဖြစ်တဲ့ type တစ်ခုကို ကိုယ်စားပြုပါတယ်။ ဒါကို _F_-bounded polymorphism လို့ ခေါ်ပြီး — လူအများစုကတော့ [fluent API](https://en.wikipedia.org/wiki/Fluent_interface) pattern လို့ သိကြပါတယ်။ ဒါက အထက်အောက် အဆင့်ဆင့် (hierarchical) ရှိတဲ့ fluent interfaces တွေကို ဖော်ပြရတာ ပိုလွယ်ကူစေပါတယ်။ ဥပမာ — operation တစ်ခုစီ ပြီးတိုင်း `this` ကို return လုပ်တဲ့ calculator အသေးစားတစ်ခုကို ကြည့်ရအောင်:

```ts twoslash
class BasicCalculator {
  public constructor(protected value: number = 0) {}
  public currentValue(): number {
    return this.value;
  }
  public add(operand: number): this {
    this.value += operand;
    return this;
  }
  public multiply(operand: number): this {
    this.value *= operand;
    return this;
  }
  // ... other operations go here ...
}

let v = new BasicCalculator(2).multiply(5).add(1).currentValue();
```

Class က `this` types တွေကို သုံးထားတာမို့ — သင်က ၎င်းကို extend လုပ်လိုက်ရင် — class အသစ်က method အဟောင်းတွေကို ဘာမှ မပြောင်းလဲဘဲ သုံးနိုင်ပါတယ်။

```ts twoslash
class BasicCalculator {
  public constructor(protected value: number = 0) {}
  public currentValue(): number {
    return this.value;
  }
  public add(operand: number): this {
    this.value += operand;
    return this;
  }
  public multiply(operand: number): this {
    this.value *= operand;
    return this;
  }
  // ... other operations go here ...
}
// ---cut---
class ScientificCalculator extends BasicCalculator {
  public constructor(value = 0) {
    super(value);
  }
  public sin() {
    this.value = Math.sin(this.value);
    return this;
  }
  // ... other operations go here ...
}

let v = new ScientificCalculator(2).multiply(5).sin().add(1).currentValue();
```

`this` types တွေ မရှိရင် — `ScientificCalculator` က `BasicCalculator` ကို extend လုပ်ပြီး fluent interface ကို ဆက်ထိန်းထားနိုင်မှာ မဟုတ်ပါဘူး။ `multiply` က `BasicCalculator` ကို return လုပ်မိမှာ ဖြစ်ပြီး — အဲဒီမှာ `sin` method မရှိပါဘူး။ ဒါပေမယ့် — `this` types တွေနဲ့ဆိုရင် — `multiply` က `this` ကို return လုပ်ပြီး — ဒီနေရာမှာ အဲဒါက `ScientificCalculator` ပါ။
## Index types (Index Types များ)

Index types တွေနဲ့ဆိုရင် — dynamic property names (ပြောင်းလဲနေတဲ့ property နာမည်များ) သုံးထားတဲ့ code တွေကို compiler နဲ့ စစ်ဆေးခိုင်းလို့ ရပါတယ်။ ဥပမာ — JavaScript မှာ အသုံးများတဲ့ pattern တစ်ခုကတော့ — object တစ်ခုထဲက properties တစ်ချို့ကို ရွေးထုတ်တာပါ:

```js
function pluck(o, propertyNames) {
  return propertyNames.map((n) => o[n]);
}
```

TypeScript မှာတော့ — **index type query** နဲ့ **indexed access** operators တွေကို သုံးပြီး — ဒီ function ကို ဒီလို ရေးပြီး သုံးနိုင်ပါတယ်:

```ts twoslash
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map((n) => o[n]);
}

interface Car {
  manufacturer: string;
  model: string;
  year: number;
}

let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014,
};

// Manufacturer and model are both of type string,
// so we can pluck them both into a typed string array
let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);

// If we try to pluck model and year, we get an
// array of a union type: (string | number)[]
let modelYear = pluck(taxi, ["model", "year"]);
```

Compiler က `manufacturer` နဲ့ `model` တွေက `Car` ပေါ်မှာ တကယ် properties တွေ ဟုတ်မဟုတ်ကို စစ်ဆေးပါတယ်။ ဒီဥပမာက type operators အသစ် နှစ်ခုကို မိတ်ဆက်ပေးပါတယ်။ ပထမတစ်ခုက `keyof T` — **index type query operator** ပါ။ Type `T` တိုင်းအတွက် — `keyof T` က `T` ရဲ့ သိထားတဲ့ public property names တွေရဲ့ union ဖြစ်ပါတယ်။ ဥပမာ:

```ts twoslash
interface Car {
  manufacturer: string;
  model: string;
  year: number;
}
// ---cut---
let carProps: keyof Car;
//         ^?
```

`keyof Car` က `"manufacturer" | "model" | "year"` နဲ့ လုံးဝ အပြန်အလှန် အစားထိုးလို့ ရပါတယ်။ ကွာခြားချက်ကတော့ — `Car` ကို property အသစ်တစ်ခု — ဥပမာ `ownersAddress: string` — ထပ်ထည့်လိုက်ရင် — `keyof Car` က `"manufacturer" | "model" | "year" | "ownersAddress"` ဖြစ်အောင် အလိုအလျောက် update ဖြစ်သွားမှာပါ။ ပြီးတော့ — property names တွေကို ကြိုတင် မသိနိုင်တဲ့ `pluck` လိုမျိုး generic context တွေမှာလည်း `keyof` ကို သုံးနိုင်ပါတယ်။ ဆိုလိုတာက — `pluck` ဆီကို မှန်ကန်တဲ့ property names အစုကို ပို့ကြောင်း compiler က စစ်ဆေးပေးမှာ ဖြစ်ပါတယ်:

```ts
// error, Type '"unknown"' is not assignable to type '"manufacturer" | "model" | "year"'
pluck(taxi, ["year", "unknown"]);
```

ဒုတိယ operator ကတော့ `T[K]` — **indexed access operator** ပါ။ ဒီနေရာမှာ type syntax က expression syntax ကို ရောင်ပြန်ဟပ်ပါတယ်။ ဆိုလိုတာက — `taxi["manufacturer"]` မှာ `Car["manufacturer"]` ဆိုတဲ့ type ရှိပြီး — ဒီဥပမာမှာ အဲဒါက `string` ပဲ ဖြစ်ပါတယ်။ ဒါပေမယ့် — index type queries တွေလိုပဲ — `T[K]` ကို generic context မှာ သုံးလို့ ရပြီး — အဲဒီနေရာမှာမှ ၎င်းရဲ့ တကယ့် အစွမ်းက ပေါ်လာပါတယ်။ Type variable `K extends keyof T` ဖြစ်အောင်တော့ သေချာ လုပ်ထားဖို့ လိုပါတယ်။ `getProperty` လို့ ခေါ်တဲ့ function တစ်ခုပါတဲ့ နောက်ထပ် ဥပမာတစ်ခု ဒီမှာ ရှိပါတယ်:

```ts
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName]; // o[propertyName] is of type T[K]
}
```

`getProperty` ထဲမှာ — `o: T` ဖြစ်ပြီး `propertyName: K` ဖြစ်တာမို့ — `o[propertyName]: T[K]` လို့ ဆိုလိုပါတယ်။ `T[K]` result ကို return လုပ်လိုက်တာနဲ့ — compiler က key ရဲ့ တကယ့် type ကို instantiate (သက်ဝင်အောင် ဖော်ဆောင်) လုပ်မှာမို့ — `getProperty` ရဲ့ return type က သင်တောင်းဆိုတဲ့ property ပေါ် မူတည်ပြီး ပြောင်းလဲပါလိမ့်မယ်။

```ts twoslash
// @errors: 2345
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName]; // o[propertyName] is of type T[K]
}
interface Car {
  manufacturer: string;
  model: string;
  year: number;
}
let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014,
};
// ---cut---
let manufacturer: string = getProperty(taxi, "manufacturer");
let year: number = getProperty(taxi, "year");

let unknown = getProperty(taxi, "unknown");
```

## Index types and index signatures (Index Types နဲ့ Index Signatures များ)

`keyof` နဲ့ `T[K]` တို့က index signatures တွေနဲ့ ဆက်စပ် အလုပ်လုပ်ပါတယ်။ Index signature တစ်ခုရဲ့ parameter type က 'string' ဒါမှမဟုတ် 'number' ဖြစ်ရပါမယ်။ String index signature ပါတဲ့ type တစ်ခု ရှိရင် — `keyof T` က `string | number` ဖြစ်မှာပါ (JavaScript မှာ object property တစ်ခုကို strings (`object["42"]`) ဒါမှမဟုတ် numbers (`object[42]`) — ဘယ်ဟာနဲ့မဆို ဝင်ရောက်လို့ ရလို့ — `string` တစ်ခုတည်း မဟုတ်ပါဘူး)။ ပြီးတော့ `T[string]` က index signature ရဲ့ type ပဲ ဖြစ်ပါတယ်:

```ts twoslash
interface Dictionary<T> {
  [key: string]: T;
}
let keys: keyof Dictionary<number>;
//     ^?
let value: Dictionary<number>["foo"];
//      ^?
```

Number index signature ပါတဲ့ type တစ်ခု ရှိရင်တော့ — `keyof T` က `number` ပဲ ဖြစ်မှာပါ။

```ts twoslash
// @errors: 2339
interface Dictionary<T> {
  [key: number]: T;
}

let keys: keyof Dictionary<number>;
//     ^?
let numberValue: Dictionary<number>[42];
//     ^?
let value: Dictionary<number>["foo"];
```

## Mapped types (Mapped Types များ)

လုပ်လေ့ရှိတဲ့ အလုပ်တစ်ခုကတော့ — ရှိပြီးသား type တစ်ခုကို ယူပြီး — ၎င်းရဲ့ property တစ်ခုချင်းစီကို optional ဖြစ်အောင် လုပ်တာပါ:

```ts
interface PersonSubset {
  name?: string;
  age?: number;
}
```

ဒါမှမဟုတ် — readonly version တစ်ခုကို လိုချင်တာမျိုးလည်း ဖြစ်နိုင်ပါတယ်:

```ts
interface PersonReadonly {
  readonly name: string;
  readonly age: number;
}
```

ဒီလိုအခြေအနေမျိုးက JavaScript မှာ မကြာခဏ ဖြစ်တတ်တာမို့ — TypeScript က type အဟောင်းတွေကို အခြေခံပြီး type အသစ်တွေ ဖန်တီးနိုင်တဲ့ နည်းလမ်းတစ်ခု — **mapped types** — ကို ထောက်ပံ့ပေးထားပါတယ်။ Mapped type တစ်ခုထဲမှာ — type အသစ်က type အဟောင်းထဲက property တစ်ခုချင်းစီကို တစ်နည်းတည်းနဲ့ အသွင်ပြောင်းပေးပါတယ်။ ဥပမာ — properties အားလုံးကို optional ဖြစ်အောင် ဒါမှမဟုတ် `readonly` type ဖြစ်အောင် လုပ်နိုင်ပါတယ်။ ဥပမာ နှစ်ခုကို ကြည့်ရအောင်:

```ts twoslash
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// @noErrors
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

ပြီးတော့ သုံးဖို့ဆိုရင်:

```ts twoslash
type Person = {
  name: string;
  age: number;
};
// ---cut---
type PersonPartial = Partial<Person>;
//   ^?
type ReadonlyPerson = Readonly<Person>;
//   ^?
```

ဒီ syntax က member တစ်ခုထက် type တစ်ခုကို ဖော်ပြတယ်ဆိုတာ သတိပြုပါ။ Members တွေ ထပ်ထည့်ချင်ရင် — intersection type တစ်ခုကို သုံးနိုင်ပါတယ်:

```ts twoslash
// @errors: 2693 1005 1128 7061
// Use this:
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
} & { newMember: boolean }

// This is an error!
type WrongPartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
  newMember: boolean;
}
```

အရိုးရှင်းဆုံး mapped type တစ်ခုနဲ့ ၎င်းရဲ့ အစိတ်အပိုင်းတွေကို ကြည့်ရအောင်:

```ts twoslash
type Keys = "option1" | "option2";
type Flags = { [K in Keys]: boolean };
```

ဒီ syntax က — အတွင်းမှာ `for .. in` ပါတဲ့ index signatures တွေရဲ့ syntax နဲ့ ဆင်တူပါတယ်။ အစိတ်အပိုင်း သုံးခု ပါဝင်ပါတယ်:

1. Type variable `K` — property တစ်ခုချင်းစီကို အလှည့်ကျ ချိတ်ဆက် (bind) ခံရတဲ့ variable ပါ။
2. String literal union `Keys` — iterate လုပ်ရမယ့် properties တွေရဲ့ နာမည်တွေ ပါဝင်ပါတယ်။
3. Property ရဲ့ ရလဒ် (resulting) type ပါ။

ဒီရိုးရှင်းတဲ့ ဥပမာမှာ — `Keys` က property names တွေရဲ့ hard-coded စာရင်းဖြစ်ပြီး — property type က အမြဲတမ်း `boolean` ဖြစ်တာမို့ — ဒီ mapped type က အောက်ပါအတိုင်း ရေးတာနဲ့ ညီမျှပါတယ်:

```ts twoslash
type Flags = {
  option1: boolean;
  option2: boolean;
};
```

ဒါပေမယ့် — လက်တွေ့ application တွေမှာတော့ — အပေါ်က `Readonly` ဒါမှမဟုတ် `Partial` လိုမျိုးပါ။ သူတို့က ရှိပြီးသား type တစ်ခုကို အခြေခံပြီး — properties တွေကို တစ်နည်းနည်းနဲ့ အသွင်ပြောင်းပါတယ်။ အဲဒီနေရာမှာ `keyof` နဲ့ indexed access types တွေ ပါဝင်လာတာပါ:

```ts twoslash
type Person = {
  name: string;
  age: number;
};
// ---cut---
type NullablePerson = { [P in keyof Person]: Person[P] | null };
//   ^?
type PartialPerson = { [P in keyof Person]?: Person[P] };
//   ^?
```

ဒါပေမယ့် — ယေဘုယျ (general) version တစ်ခု ရှိတာက ပိုပြီး အသုံးဝင်ပါတယ်။

```ts
type Nullable<T> = { [P in keyof T]: T[P] | null };
type Partial<T> = { [P in keyof T]?: T[P] };
```

ဒီဥပမာတွေထဲမှာ — properties စာရင်းက `keyof T` ဖြစ်ပြီး — ရလဒ် type က `T[P]` ရဲ့ ပုံစံကွဲတစ်မျိုးပါ။ ဒါက mapped types တွေကို ယေဘုယျ သုံးတဲ့ နေရာတိုင်းအတွက် ကောင်းတဲ့ ပုံစံပြင် (template) တစ်ခုပါ။ ဘာလို့လဲဆိုတော့ — ဒီလို အသွင်ပြောင်းမှုမျိုးက [homomorphic](https://wikipedia.org/wiki/Homomorphism) (တစ်ထပ်တည်းကျသော) ဖြစ်ပြီး — mapping က `T` ရဲ့ properties တွေပေါ်မှာပဲ သက်ရောက်ပြီး — တခြားဘာပေါ်မှာမှ မသက်ရောက်လို့ပါ။ Compiler က property modifiers အသစ်တွေ မထည့်ခင် — ရှိပြီးသား property modifiers အားလုံးကို ကူးယူနိုင်တယ်ဆိုတာ သိပါတယ်။ ဥပမာ — `Person.name` က readonly ဖြစ်ခဲ့ရင် — `Partial<Person>.name` က readonly ရော optional ရော ဖြစ်နေမှာပါ။

နောက်ထပ် ဥပမာတစ်ခုက — `T[P]` ကို `Proxy<T>` class တစ်ခုထဲမှာ ထုပ်ပိုးထားတာပါ:

```ts twoslash
// @noErrors
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};

type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};

function proxify<T>(o: T): Proxify<T> {
  // ... wrap proxies ...
}

let props = { rooms: 4 };
let proxyProps = proxify(props);
//  ^?
```

`Readonly<T>` နဲ့ `Partial<T>` တွေက အရမ်း အသုံးဝင်တာမို့ — `Pick` နဲ့ `Record` တို့နဲ့အတူ TypeScript ရဲ့ standard library ထဲမှာ ထည့်သွင်းထားတယ်ဆိုတာ သတိပြုပါ:

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

`Readonly`, `Partial` နဲ့ `Pick` တို့က homomorphic ဖြစ်ပြီး — `Record` ကတော့ မဟုတ်ပါဘူး။ `Record` က homomorphic မဟုတ်ဘူးဆိုတဲ့ သဲလွန်စတစ်ခုက — properties တွေကို ကူးယူဖို့ input type တစ်ခုကို မယူပါဘူး ဆိုတာပါ:

```ts twoslash
type ThreeStringProps = Record<"prop1" | "prop2" | "prop3", string>;
```

Non-homomorphic types တွေက မူလအားဖြင့် properties အသစ်တွေကို ဖန်တီးနေတာမို့ — property modifiers တွေကို ဘယ်ကမှ ကူးယူလို့ မရပါဘူး။

`keyof any` က object တစ်ခုရဲ့ index အဖြစ် သုံးလို့ရတဲ့ ဘယ် value မဆိုရဲ့ type ကို ကိုယ်စားပြုတယ်ဆိုတာ သတိပြုပါ။ တစ်နည်းပြောရရင် — `keyof any` က လက်ရှိမှာ `string | number | symbol` နဲ့ ညီမျှပါတယ်။

## Inference from mapped types (Mapped Types တွေကနေ Inference လုပ်ခြင်း)

Type တစ်ခုရဲ့ properties တွေကို ဘယ်လို ထုပ်ပိုးရမလဲဆိုတာ သိပြီးပြီဆိုရင် — နောက်တစ်ဆင့်မှာ သူတို့ကို ဖြည်ချင်လာပါလိမ့်မယ်။ ကံကောင်းတာက — အဲဒါက တော်တော် လွယ်ပါတယ်:

```ts twoslash
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};

type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};

function proxify<T>(o: T): Proxify<T> {
  return {} as any;
}

let props = { rooms: 4 };
let proxyProps = proxify(props);
// ---cut---
function unproxify<T>(t: Proxify<T>): T {
  let result = {} as T;
  for (const k in t) {
    result[k] = t[k].get();
  }
  return result;
}

let originalProps = unproxify(proxyProps);
//  ^?
```

ဒီ unwrapping inference က homomorphic mapped types တွေပေါ်မှာပဲ အလုပ်လုပ်တယ်ဆိုတာ သတိပြုပါ။ Mapped type က homomorphic မဟုတ်ရင်တော့ — သင့် unwrapping function ကို type parameter တစ်ခု အတိအကျ ပေးဖို့ လိုပါလိမ့်မယ်။

## Conditional Types (Conditional Types များ)

Conditional type တစ်ခုက — type relationship test (type ဆက်စပ်မှု စမ်းသပ်ချက်) အနေနဲ့ ဖော်ပြထားတဲ့ condition တစ်ခုကို အခြေခံပြီး — ဖြစ်နိုင်တဲ့ type နှစ်ခုထဲက တစ်ခုကို ရွေးချယ်ပေးပါတယ်:

```ts
T extends U ? X : Y
```

အပေါ်က type ရဲ့ အဓိပ္ပာယ်က — `T` က `U` ဆီ assignable ဖြစ်တဲ့အခါ type က `X` ဖြစ်ပြီး — မဟုတ်ရင် type က `Y` ဖြစ်ပါတယ်။

Conditional type `T extends U ? X : Y` တစ်ခုက `X` ဒါမှမဟုတ် `Y` ဆီ _resolved_ (အဖြေထွက်) ဖြစ်မယ် — ဒါမှမဟုတ် — condition က type variable တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ type variables တွေအပေါ် မှီခိုနေလို့ _deferred_ (ဆိုင်းငံ့) ဖြစ်နေနိုင်ပါတယ်။ `T` ဒါမှမဟုတ် `U` ထဲမှာ type variables တွေ ပါနေတဲ့အခါ — `X` ဒါမှမဟုတ် `Y` ဆီ resolve လုပ်မလား၊ defer လုပ်မလားဆိုတာက — `T` က `U` ဆီ အမြဲတမ်း assignable ဖြစ်တယ်လို့ ကောက်ချက်ချဖို့ type system မှာ အချက်အလက် လုံလောက်မှု ရှိမရှိပေါ် မူတည်ပါတယ်။

ချက်ချင်း resolve ဖြစ်သွားတဲ့ types တချို့ရဲ့ ဥပမာအနေနဲ့ — အောက်ပါ ဥပမာကို ကြည့်နိုင်ပါတယ်:

```ts twoslash
declare function f<T extends boolean>(x: T): T extends true ? string : number;

// Type is 'string | number'
let x = f(Math.random() < 0.5);
//  ^?
```

နောက်ထပ် ဥပမာတစ်ခုကတော့ — nested conditional types တွေကို သုံးထားတဲ့ `TypeName` type alias ပါ:

```ts twoslash
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

type T0 = TypeName<string>;
//   ^?
type T1 = TypeName<"a">;
//   ^?
type T2 = TypeName<true>;
//   ^?
type T3 = TypeName<() => void>;
//   ^?
type T4 = TypeName<string[]>;
//   ^?
```

ဒါပေမယ့် — conditional types တွေ deferred ဖြစ်နေတဲ့ နေရာတစ်ခုရဲ့ ဥပမာအနေနဲ့ — branch တစ်ခုကို ရွေးမယ့်အစား ချိတ်ဆွဲထားသလို ကျန်နေတာမျိုး — အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```ts twoslash
interface Foo {
  propA: boolean;
  propB: boolean;
}

declare function f<T>(x: T): T extends Foo ? string : number;

function foo<U>(x: U) {
  // Has type 'U extends Foo ? string : number'
  let a = f(x);

  // This assignment is allowed though!
  let b: string | number = a;
}
```

အပေါ်မှာ — variable `a` မှာ branch တစ်ခုကို မရွေးရသေးတဲ့ conditional type တစ်ခု ရှိပါတယ်။ တခြား code တစ်စိတ်တစ်ပိုင်းက `foo` ကို ခေါ်လိုက်တဲ့အခါ — `U` နေရာမှာ တခြား type တစ်ခုနဲ့ အစားထိုးပြီး — TypeScript က conditional type ကို ပြန်အကဲဖြတ်ပြီး — branch တစ်ခုကို တကယ် ရွေးလို့ ရမရ ဆုံးဖြတ်ပါလိမ့်မယ်။

အဲဒီအချိန်မှာ — conditional ရဲ့ branch တစ်ခုချင်းစီက အဲဒီ target ဆီ assignable ဖြစ်နေသရွေ့ — conditional type တစ်ခုကို တခြား target type ဘယ်ဟာဆီမဆို assign လုပ်နိုင်ပါတယ်။ ဒါကြောင့် အပေါ်က ဥပမာမှာ — conditional က ဘာပဲ အဖြေထွက်ထွက် — `string` ဒါမှမဟုတ် `number` ဖြစ်မယ်ဆိုတာ သေချာတာမို့ — `U extends Foo ? string : number` ကို `string | number` ဆီ assign လုပ်နိုင်ခဲ့တာပါ။

## Distributive conditional types (Distributive Conditional Types များ)

Check လုပ်ခံရတဲ့ type က naked type parameter (တစ်ခုတည်း သီးသန့် type parameter) ဖြစ်နေတဲ့ conditional types တွေကို _distributive conditional types_ လို့ ခေါ်ပါတယ်။ Distributive conditional types တွေက — instantiation (သက်ဝင် ဖော်ဆောင်ချိန်) မှာ union types တွေအပေါ်ကို အလိုအလျောက် ဖြန့်ဝေ (distribute) ပေးပါတယ်။ ဥပမာ — `T` အတွက် type argument `A | B | C` ပါတဲ့ `T extends U ? X : Y` ရဲ့ instantiation တစ်ခုကို `(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)` အနေနဲ့ resolve လုပ်ပါတယ်။

#### Example (ဥပမာ)

```ts twoslash
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";
// ---cut---
type T5 = TypeName<string | (() => void)>;
//   ^?
type T6 = TypeName<string | string[] | undefined>;
//   ^?
type T7 = TypeName<string[] | number[]>;
//   ^?
```

Distributive conditional type `T extends U ? X : Y` ရဲ့ instantiations တွေထဲမှာ — conditional type အတွင်းက `T` ကို ရည်ညွှန်းတာတွေက union type ရဲ့ သီးခြား constituent တစ်ခုချင်းစီဆီ resolve လုပ်ပါတယ် (ဆိုလိုတာက — conditional type ကို union type အပေါ် ဖြန့်ဝေပြီးတဲ့ _နောက်မှာ_ `T` က constituent တစ်ခုချင်းစီကို ရည်ညွှန်းတာပါ)။ ထို့အပြင် — `X` အတွင်းက `T` ကို ရည်ညွှန်းတာတွေမှာ နောက်ထပ် type parameter constraint `U` တစ်ခု ရှိပါတယ် (ဆိုလိုတာက — `X` အတွင်းမှာ `T` ကို `U` ဆီ assignable အဖြစ် သတ်မှတ်ပါတယ်)။

#### Example (ဥပမာ)

```ts twoslash
type BoxedValue<T> = { value: T };
type BoxedArray<T> = { array: T[] };
type Boxed<T> = T extends any[] ? BoxedArray<T[number]> : BoxedValue<T>;

type T1 = Boxed<string>;
//   ^?
type T2 = Boxed<number[]>;
//   ^?
type T3 = Boxed<string | number[]>;
//   ^?
```

`Boxed<T>` ရဲ့ true branch အတွင်းမှာ `T` မှာ `any[]` ဆိုတဲ့ constraint အပိုတစ်ခု ရှိတာကြောင့် — array ရဲ့ element type ကို `T[number]` အနေနဲ့ ရည်ညွှန်းလို့ ရတယ်ဆိုတာ သတိပြုပါ။ နောက်ဆုံး ဥပမာမှာ conditional type ကို union type အပေါ် ဖြန့်ဝေထားပုံကိုလည်း သတိပြုပါ။

Conditional types တွေရဲ့ distributive (ဖြန့်ဝေနိုင်သော) ဂုဏ်သတ္တိကို — union types တွေကို _filter_ (စစ်ထုတ်) ဖို့ အဆင်ပြေစွာ သုံးနိုင်ပါတယ်:

```ts twoslash
// @errors: 2300 2322
// Remove types from T that are assignable to U
type Diff<T, U> = T extends U ? never : T;
// Remove types from T that are not assignable to U
type Filter<T, U> = T extends U ? T : never;

type T1 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;
//   ^?
type T2 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "a" | "c"
//   ^?
type T3 = Diff<string | number | (() => void), Function>; // string | number
//   ^?
type T4 = Filter<string | number | (() => void), Function>; // () => void
//   ^?

// Remove null and undefined from T
type NotNullable<T> = Diff<T, null | undefined>;

type T5 = NotNullable<string | number | undefined>;
//   ^?
type T6 = NotNullable<string | string[] | null | undefined>;
//   ^?

function f1<T>(x: T, y: NotNullable<T>) {
  x = y;
  y = x;
}

function f2<T extends string | undefined>(x: T, y: NotNullable<T>) {
  x = y;
  y = x;
  let s1: string = x;
  let s2: string = y;
}
```

Conditional types တွေက mapped types တွေနဲ့ တွဲသုံးတဲ့အခါ အထူးသဖြင့် အသုံးဝင်ပါတယ်:

```ts twoslash
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void;
}

type T1 = FunctionPropertyNames<Part>;
//   ^?
type T2 = NonFunctionPropertyNames<Part>;
//   ^?
type T3 = FunctionProperties<Part>;
//   ^?
type T4 = NonFunctionProperties<Part>;
//   ^?
```

Conditional types တွေက သူတို့ကိုယ်သူတို့ recursively (ထပ်ခါထပ်ခါ) ရည်ညွှန်းတာကို ခွင့်မပြုဘူးဆိုတာ သတိပြုပါ။ ဥပမာ — အောက်ပါအတိုင်းဆိုရင် error ပါ။

#### Example (ဥပမာ)

```ts twoslash
// @errors: 2456 2315
type ElementType<T> = T extends any[] ? ElementType<T[number]> : T; // Error
```

## Type inference in conditional types (Conditional Types များထဲမှာ Type Inference လုပ်ခြင်း)

Conditional type တစ်ခုရဲ့ `extends` clause အတွင်းမှာ — infer လုပ်ရမယ့် type variable တစ်ခုကို မိတ်ဆက်ပေးတဲ့ `infer` declarations တွေ ထည့်လို့ ရပါတယ်။ အဲဒီလို inferred type variables တွေကို conditional type ရဲ့ true branch ထဲမှာ ရည်ညွှန်းလို့ ရပါတယ်။ Type variable တစ်ခုတည်းအတွက် `infer` နေရာ အများအပြား ထားလို့လည်း ရပါတယ်။

ဥပမာ — အောက်ပါအတိုင်းဆိုရင် function type တစ်ခုရဲ့ return type ကို ထုတ်ယူပေးပါတယ်:

```ts twoslash
// @noErrors
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

Conditional types တွေကို nested လုပ်ပြီး — အစဉ်လိုက် အကဲဖြတ်ခံရတဲ့ pattern matches (ပုံစံကိုက်ညီမှုများ) အစုတစ်ခု ဖွဲ့စည်းလို့ ရပါတယ်:

```ts twoslash
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

type T0 = Unpacked<string>;
//   ^?
type T1 = Unpacked<string[]>;
//   ^?
type T2 = Unpacked<() => string>;
//   ^?
type T3 = Unpacked<Promise<string>>;
//   ^?
type T4 = Unpacked<Promise<string>[]>;
//   ^?
type T5 = Unpacked<Unpacked<Promise<string>[]>>;
//   ^?
```

အောက်ပါ ဥပမာက — co-variant (အတူပြောင်းလဲ) နေရာတွေမှာ type variable တစ်ခုတည်းအတွက် candidate အများအပြား ရှိနေရင် — union type တစ်ခုကို infer လုပ်သွားပုံကို သရုပ်ပြပါတယ်:

```ts twoslash
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;

type T1 = Foo<{ a: string; b: string }>;
//   ^?
type T2 = Foo<{ a: string; b: number }>;
//   ^?
```

အလားတူပဲ — contra-variant (ဆန့်ကျင်ဘက် ပြောင်းလဲ) နေရာတွေမှာ type variable တစ်ခုတည်းအတွက် candidate အများအပြား ရှိနေရင်တော့ — intersection type တစ်ခုကို infer လုပ်သွားပါတယ်:

```ts twoslash
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;

type T1 = Bar<{ a: (x: string) => void; b: (x: string) => void }>;
//   ^?
type T2 = Bar<{ a: (x: string) => void; b: (x: number) => void }>;
//   ^?
```

Call signatures အများအပြား ရှိတဲ့ type တစ်ခုကနေ (overloaded function တစ်ခုရဲ့ type လိုမျိုး) infer လုပ်တဲ့အခါ — inferences တွေက _နောက်ဆုံး_ signature ကနေ ပြုလုပ်ပါတယ် (အဲဒါက — ထင်ရှားတာကတော့ — အရှိဆုံး permissive ဖြစ်တဲ့ catch-all case ဖြစ်ပါတယ်)။ Argument types တွေရဲ့ စာရင်းတစ်ခုကို အခြေခံပြီး overload resolution (overload ရွေးချယ်ခြင်း) လုပ်ဖို့ကတော့ မဖြစ်နိုင်ပါဘူး။

```ts twoslash
declare function foo(x: string): number;
declare function foo(x: number): string;
declare function foo(x: string | number): string | number;

type T1 = ReturnType<typeof foo>;
//   ^?
```

သာမန် type parameters တွေရဲ့ constraint clauses တွေထဲမှာ `infer` declarations တွေကို သုံးဖို့က မဖြစ်နိုင်ပါဘူး:

```ts twoslash
// @errors: 1338 2304
type ReturnedType<T extends (...args: any[]) => infer R> = R;
```

ဒါပေမယ့် — constraint ထဲက type variables တွေကို ဖယ်ရှားပြီး — အဲဒီအစား conditional type တစ်ခုကို သတ်မှတ်ခြင်းအားဖြင့် — သိပ်မကွာတဲ့ ရလဒ်မျိုးကို ရနိုင်ပါတယ်:

```ts twoslash
// @noErrors
type AnyFunction = (...args: any[]) => any;
type ReturnType<T extends AnyFunction> = T extends (...args: any[]) => infer R
  ? R
  : any;
```

## Predefined conditional types (Predefined Conditional Types များ)

TypeScript က predefined conditional types အများအပြားကို ထပ်ဖြည့်ထားပြီး — အပြည့်အစုံ စာရင်းနဲ့ ဥပမာတွေကို [Utility Types](/docs/typescript/utility-types) မှာ တွေ့နိုင်ပါတယ်။
