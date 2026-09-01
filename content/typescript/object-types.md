---
title: "Object Types (Object Type များ)"
description: "Object type တွေအကြောင်း — property modifiers, optional နဲ့ readonly properties, index signatures, excess property checks, extending types, intersection types, generic object types, Array/ReadonlyArray နဲ့ tuple types"
order: 7
source: "https://www.typescriptlang.org/docs/handbook/2/objects.html"
status: translated
updated: 2026-09-01
---

## Object Type တွေဆိုတာ ဘာလဲ

JavaScript မှာ data တွေကို စုစည်းပြီး ပေးပို့ဖို့ အခြေခံအကျဆုံး နည်းလမ်းက object တွေပါ။ TypeScript မှာ အဲဒါတွေကို _object type_ တွေနဲ့ ကိုယ်စားပြုပါတယ်။

မြင်ပြီးသား အတိုင်း — object type တွေက anonymous (အမည်မဲ့) ဖြစ်နိုင်ပါတယ်:

```ts
function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}
```

ဒါမှမဟုတ် interface ကိုသုံးပြီး အမည်ပေးလို့လည်း ရပါတယ်:

```ts
interface Person {
  name: string;
  age: number;
}

function greet(person: Person) {
  return "Hello " + person.name;
}
```

ဒါမှမဟုတ် type alias နဲ့လည်း ရပါတယ်:

```ts
type Person = {
  name: string;
  age: number;
};

function greet(person: Person) {
  return "Hello " + person.name;
}
```

အပေါ်က ဥပမာ သုံးခုစလုံးမှာ — `name` property (`string` ဖြစ်ရမယ်) နဲ့ `age` property (`number` ဖြစ်ရမယ်) ပါတဲ့ object တွေကို လက်ခံတဲ့ function တွေ ရေးထားပါတယ်။

## Quick Reference (အမြန်ကိုးကားချက်)

နေ့စဉ်သုံး အရေးကြီးတဲ့ syntax တွေကို တစ်ချက်ကြည့်ရုံနဲ့ မြင်ချင်ရင် — [`type` နဲ့ `interface` နှစ်ခုစလုံးအတွက် cheat-sheets](https://www.typescriptlang.org/cheatsheets) တွေ ရှိပါတယ်။

## Property Modifiers (Property အမျိုးအစားခွဲများ)

Object type ထဲက property တစ်ခုချင်းစီမှာ အချက်တချို့ သတ်မှတ်နိုင်ပါတယ် — type ၊ property က optional ဟုတ်မဟုတ် ၊ ပြီးတော့ property ကို ပြန်ရေးလို့ရလား (writable) ဆိုတာ။

### Optional Properties (Optional Property များ)

အများစုမှာ — property တစ်ခုခု ရှိချင်မှ ရှိနိုင်တဲ့ object တွေကို ကိုင်တွယ်ရပါတယ်။ အဲဒီလို အခြေအနေမှာ property နာမည်ရဲ့ အဆုံးမှာ question mark (`?`) ထည့်ပြီး အဲဒီ property တွေကို _optional_ အဖြစ် မှတ်သားလို့ရပါတယ်။

```ts
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

function paintShape(opts: PaintOptions) {
  // ...
}

const shape = getShape();
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });
```

ဒီဥပမာမှာ `xPos` ရော `yPos` ရော နှစ်ခုလုံး optional ပါ။ ဘယ်ဟာကိုမဆို ရွေးထည့်လို့ရတာမို့ — အပေါ်က `paintShape` ခေါ်တာတွေ အားလုံး မှန်ကန်ပါတယ်။ Optional ဆိုတာရဲ့ အဓိပ္ပာယ်က — property ကို set လုပ်မယ်ဆိုရင် တိကျတဲ့ type တစ်ခုနဲ့ပဲ ဖြစ်ရမယ်ဆိုတာပါပဲ။

ဒီ property တွေကို ဖတ်လို့လည်း ရပါတယ် — ဒါပေမယ့် [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) အောက်မှာ ဖတ်ရင် TypeScript က သူတို့က `undefined` ဖြစ်နိုင်တယ်လို့ ပြောပါလိမ့်မယ်။

```ts
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos;
  let yPos = opts.yPos;
  // ...
}
```

JavaScript မှာ — property ကို တစ်ခါမှ set မလုပ်ထားရင်တောင် access လုပ်လို့ရပြီး `undefined` ဆိုတဲ့ value ပဲ ပြန်ရပါတယ်။ `undefined` ဖြစ်မဖြစ် check လုပ်ပြီး သီးခြား ကိုင်တွယ်လို့ရပါတယ်:

```ts
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos === undefined ? 0 : opts.xPos;
  let yPos = opts.yPos === undefined ? 0 : opts.yPos;
  // ...
}
```

သတ်မှတ်မထားတဲ့ value တွေအတွက် default ထားတဲ့ ဒီပုံစံက အရမ်းအသုံးများလို့ — JavaScript မှာ ကိုယ်ပိုင် syntax ရှိပါတယ်:

```ts
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log("x coordinate at", xPos);
  console.log("y coordinate at", yPos);
  // ...
}
```

ဒီမှာ `paintShape` ရဲ့ parameter အတွက် [destructuring pattern](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) ကိုသုံးပြီး `xPos` နဲ့ `yPos` အတွက် [default values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Default_values) တွေ ပေးထားပါတယ်။ အခုဆိုရင် `xPos` ရော `yPos` ရော `paintShape` ရဲ့ body ထဲမှာ သေချာပေါက် ရှိနေပြီး — caller တွေအတွက်ကတော့ optional ပဲ ဖြစ်နေပါတယ်။

> သတိပြုရန် — destructuring pattern ထဲမှာ type annotation ထည့်ဖို့ လောလောဆယ် နည်းလမ်း မရှိပါဘူး။
> ဘာလို့လဲဆိုတော့ အောက်ပါ syntax တွေက JavaScript မှာ တခြား အဓိပ္ပာယ်တွေ ရှိနေလို့ပါ။
>
> ```ts
> interface Shape {}
> declare function render(x: unknown);
>
> function draw({ shape: Shape, xPos: number = 100 /*...*/ }) {
>   render(shape);
>   render(xPos);
> }
> ```
>
> Object destructuring pattern မှာ `shape: Shape` ဆိုတာ "`shape` property ကို ယူပြီး `Shape` ဆိုတဲ့ variable အသစ်အနေနဲ့ ပြန်သတ်မှတ်တာ" ကို ဆိုလိုပါတယ်။ အလားတူပဲ `xPos: number` က parameter ရဲ့ `xPos` ကို အခြေခံတဲ့ `number` ဆိုတဲ့ variable တစ်ခုကို ဖန်တီးပါတယ်။

### `readonly` Properties (readonly Property များ)

Property တွေကို TypeScript အတွက် `readonly` အဖြစ်လည်း မှတ်သားလို့ရပါတယ်။ Runtime မှာ အပြုအမူ ဘာမှ မပြောင်းပေမယ့် — `readonly` လို့ မှတ်ထားတဲ့ property ကို type-checking လုပ်ချိန်မှာ ပြန်ရေးလို့ မရပါဘူး။

```ts
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  // 'obj.prop' ကို ဖတ်လို့ရပါတယ်
  console.log(`prop has the value '${obj.prop}'.`);

  // ဒါပေမယ့် ပြန်သတ်မှတ် (re-assign) လို့မရပါဘူး
  obj.prop = "hello";
}
```

`readonly` modifier သုံးထားတာနဲ့ — value က လုံးဝ immutable (အတွင်းထဲက အကြောင်းအရာတွေကိုပါ မပြောင်းလဲနိုင်) ဆိုတာ မဟုတ်ပါဘူး။ Property ကိုယ်တိုင်ကို ပြန်မရေးလို့မရတာပဲ ဖြစ်ပါတယ်။

```ts
interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  // 'home.resident' ရဲ့ property တွေကို ဖတ်လို့ရော update လုပ်လို့ရော ရပါတယ်
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++;
}

function evict(home: Home) {
  // ဒါပေမယ့် 'Home' ရဲ့ 'resident' property ကိုယ်တိုင်ကိုတော့ ပြန်ရေးလို့မရပါဘူး
  home.resident = {
    name: "Victor the Evictor",
    age: 42,
  };
}
```

`readonly` ရဲ့ အဓိပ္ပာယ်ကို မျှော်လင့်ချက် မှန်မှန် ထားဖို့ အရေးကြီးပါတယ်။ Development ကာလအတွင်း object တစ်ခုကို ဘယ်လို သုံးစေချင်လဲဆိုတဲ့ intent ကို TypeScript ကို အချက်ပြဖို့ အသုံးဝင်ပါတယ်။ TypeScript က type နှစ်ခု compatible လားဆိုတာ စစ်တဲ့အခါ property တွေရဲ့ `readonly` ဖြစ်မဖြစ်ကို ထည့်မတွက်ပါဘူး — ဒါကြောင့် `readonly` property တွေက aliasing ကတစ်ဆင့် ပြောင်းလဲသွားနိုင်ပါသေးတယ်။

```ts
interface Person {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};

// အလုပ်လုပ်ပါတယ်
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // '42' ကို ပြပါတယ်
writablePerson.age++;
console.log(readonlyPerson.age); // '43' ကို ပြပါတယ်
```

[mapping modifiers](/docs/typescript/mapped-types) ကိုသုံးပြီး `readonly` attribute တွေကို ဖယ်ရှားလို့လည်း ရပါတယ်။

### Index Signatures (Index Signature များ)

တစ်ခါတလေ — type ရဲ့ property အားလုံးရဲ့ နာမည်တွေကို ကြိုမသိပေမယ့် value တွေရဲ့ ပုံစံ (shape) ကိုတော့ သိပါတယ်။

အဲဒီလို အခြေအနေမှာ ဖြစ်နိုင်တဲ့ value တွေရဲ့ type တွေကို ဖော်ပြဖို့ index signature ကို သုံးလို့ရပါတယ်၊ ဥပမာ:

```ts
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = getStringArray();
const secondItem = myArray[1];
```

အပေါ်မှာ index signature ပါတဲ့ `StringArray` interface ရှိပါတယ်။ ဒီ index signature က — `StringArray` ကို `number` နဲ့ index လုပ်လိုက်ရင် `string` ပြန်ပေးမယ်လို့ ဖော်ပြပါတယ်။

Index signature property တွေအတွက် ခွင့်ပြုထားတဲ့ type က နည်းပါးပါတယ်: `string` ၊ `number` ၊ `symbol` ၊ template string patterns တွေ ၊ ပြီးတော့ ဒီ type တွေပဲ ပါဝင်တဲ့ union types တွေပဲ ဖြစ်ပါတယ်။

Indexer အမျိုးအစား အများကြီးကို ထောက်ပံ့ဖို့လည်း ဖြစ်နိုင်ပါတယ်။ `number` ရော `string` ရော indexer နှစ်ခုလုံး သုံးတဲ့အခါ — numeric indexer က ပြန်ပေးတဲ့ type က string indexer က ပြန်ပေးတဲ့ type ရဲ့ subtype ဖြစ်ရမယ်ဆိုတာ သတိပြုပါ။ ဘာလို့လဲဆိုတော့ — `number` နဲ့ index လုပ်တဲ့အခါ JavaScript က object ထဲ index မလုပ်ခင် အဲဒါကို `string` အဖြစ် အမှန်တကယ် ပြောင်းပေးလို့ပါ။ ဆိုလိုတာက `100` (`number`) နဲ့ index လုပ်တာက `"100"` (`string`) နဲ့ index လုပ်တာနဲ့ အတူတူပဲ ဖြစ်လို့ — နှစ်ခု ကိုက်ညီမှု ရှိဖို့ လိုပါတယ်။

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Error: numeric string နဲ့ index လုပ်ရင် လုံးဝ မတူတဲ့ Animal type တစ်ခု ရနိုင်ပါတယ်!
interface NotOkay {
  [x: number]: Animal;
  [x: string]: Dog;
}
```

String index signatures တွေက "dictionary" ပုံစံကို ဖော်ပြဖို့ အစွမ်းထက်တဲ့ နည်းလမ်းဖြစ်ပေမယ့် — property အားလုံးက သူတို့ရဲ့ return type နဲ့ ကိုက်ညီဖို့ကိုလည်း တွန်းအားပေးပါတယ်။ ဘာလို့လဲဆိုတော့ string index က `obj.property` ဆိုတာ `obj["property"]` အနေနဲ့လည်း ရနိုင်တယ်လို့ ကြေညာတာနဲ့ တူလို့ပါ။ အောက်က ဥပမာမှာ — `name` ရဲ့ type က string index ရဲ့ type နဲ့ မကိုက်လို့ type checker က error ပေးပါတယ်:

```ts
interface NumberDictionary {
  [index: string]: number;

  length: number; // ok
  name: string;
}
```

ဒါပေမယ့် — index signature က property type တွေရဲ့ union ဖြစ်နေရင်တော့ type မတူတဲ့ property တွေကို ထားလို့ရပါတယ်:

```ts
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length က number
  name: string; // ok, name က string
}
```

နောက်ဆုံးအနေနဲ့ — index တွေဆီ assign လုပ်တာကို တားဆီးဖို့ index signatures တွေကို `readonly` လုပ်လို့ရပါတယ်:

```ts
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = getReadOnlyStringArray();
myArray[2] = "Mallory";
```

`myArray[2]` ကို set လို့မရပါဘူး — ဘာလို့လဲဆိုတော့ index signature က `readonly` ဖြစ်နေလို့ပါ။

## Excess Property Checks (Excess Property Checks ဆိုတာ)

Object တစ်ခုကို type တစ်ခုဆီ assign လုပ်တဲ့နေရာနဲ့ နည်းလမ်းက type system မှာ ကွာခြားချက် ဖြစ်စေနိုင်ပါတယ်။ အဓိက ဥပမာတစ်ခုက excess property checking ပါ — object ကို ဖန်တီးပြီး object type တစ်ခုဆီ assign လုပ်ချိန်မှာ ပိုစေ့စပ်စွာ စစ်ဆေးပေးတဲ့ ယန္တရားပါ။

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}

let mySquare = createSquare({ colour: "red", width: 100 });
```

သတိပြုမိလား — `createSquare` ဆီ ပေးလိုက်တဲ့ argument က `color` အစား _`colour`_ လို့ စာလုံးပေါင်း ကွဲနေပါတယ်။ သာမာန် JavaScript မှာဆိုရင် ဒီလိုအမှားမျိုးက တိတ်တဆိတ် ကျော်သွားပါတယ်။

"ဒီ program က type မှန်ပါတယ်" လို့ ငြင်းခုံလို့လည်း ရပါတယ် — `width` property တွေက ကိုက်ညီပြီး `color` property မရှိတာကြောင့် ပိုနေတဲ့ `colour` property က အရေးမကြီးဘူးလေ။

ဒါပေမယ့် TypeScript ကတော့ ဒီ code ထဲမှာ bug ရှိနိုင်တယ်လို့ ယူဆပါတယ်။ Object literals တွေက အထူး ဆက်ဆံမှု ခံရပြီး — တခြား variable တွေဆီ assign လုပ်တဲ့အခါ ဒါမှမဟုတ် argument အနေနဲ့ ပို့တဲ့အခါ _excess property checking_ လုပ်ခံရပါတယ်။ Object literal ထဲမှာ "target type" မှာ မရှိတဲ့ property တစ်ခုခု ရှိနေရင် error တက်ပါတယ်:

```ts
let mySquare = createSquare({ colour: "red", width: 100 });
```

ဒီ check တွေကို ရှောင်ဖို့က တကယ်တော့ လွယ်ပါတယ်။ အလွယ်ဆုံး နည်းလမ်းက type assertion သုံးတာပါ:

```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

ဒါပေမယ့် — object မှာ အထူးနည်းလမ်းနဲ့ သုံးတဲ့ property အပိုတွေ ရှိနိုင်တယ်လို့ သေချာရင်တော့ string index signature ထည့်တာက ပိုကောင်းတဲ့ နည်းလမ်း ဖြစ်နိုင်ပါတယ်။ `SquareConfig` မှာ အပေါ်က type တွေနဲ့ `color` နဲ့ `width` property တွေ ရှိနိုင်ပေမယ့် — တခြား property တွေ အများကြီးလည်း ရှိနိုင်တယ်ဆိုရင် ဒီလို သတ်မှတ်နိုင်ပါတယ်:

```ts
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: unknown;
}
```

ဒီမှာ `SquareConfig` မှာ property အရေအတွက် ဘယ်လောက်ပဲ ရှိရှိ ရနိုင်ပြီး — `color` ဒါမှမဟုတ် `width` မဟုတ်ဘူးဆိုရင် သူတို့ရဲ့ type တွေက အရေးမကြီးဘူးလို့ ပြောနေတာပါ။

ဒီ check တွေကို ရှောင်ဖို့ နောက်ဆုံး နည်းလမ်းတစ်ခု — နည်းနည်း အံ့သြစရာကောင်းပေမယ့် — object ကို တခြား variable တစ်ခုဆီ assign လုပ်တာပါ: `squareOptions` ကို assign လုပ်တာက excess property checks မလုပ်ခံရလို့ compiler က error မပေးပါဘူး:

```ts
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

အပေါ်က workaround က — `squareOptions` နဲ့ `SquareConfig` ကြားမှာ common property တစ်ခုခု ရှိနေသရွေ့ အလုပ်လုပ်ပါတယ်။ ဒီဥပမာမှာတော့ `width` ပါ။ ဒါပေမယ့် — variable မှာ common object property လုံးဝ မရှိရင်တော့ မအောင်မြင်ပါဘူး၊ ဥပမာ:

```ts
let squareOptions = { colour: "red" };
let mySquare = createSquare(squareOptions);
```

အပေါ်က လိုမျိုး ရိုးရှင်းတဲ့ code တွေမှာ ဒီ check တွေကို "ရှောင်ဖို့" ကြိုးစားတာ မသင့်ဘူးဆိုတာ သတိရပါ။ Methods တွေပါပြီး state ကိုင်ထားတဲ့ ပိုရှုပ်ထွေးတဲ့ object literals တွေမှာတော့ ဒီနည်းလမ်းတွေ သတိထားဖို့ လိုနိုင်ပေမယ့် — excess property error အများစုက တကယ်တော့ bug တွေပါပဲ။

ဆိုလိုတာက — option bags တွေလိုမျိုးမှာ excess property checking ပြဿနာ တွေ့နေရရင် type declaration တချို့ကို ပြန်ပြင်ဖို့ လိုနိုင်ပါတယ်။ ဒီကိစ္စမှာ — `createSquare` ဆီ `color` ရော `colour` ရော property ပါတဲ့ object ကို ပို့တာ အဆင်ပြေတယ်ဆိုရင် `SquareConfig` ရဲ့ အဓိပ္ပာယ်ကို အဲဒါ ထင်ဟပ်အောင် ပြင်သင့်ပါတယ်။

## Extending Types (Type တွေကို တိုးချဲ့ခြင်း)

Type တွေဟာ တခြား type တွေရဲ့ ပိုတိကျတဲ့ ဗားရှင်းတွေ ဖြစ်နေတာ မကြာခဏ တွေ့ရပါတယ်။ ဥပမာ — အမေရိကန်မှာ စာတွေ နဲ့ ပါဆယ်တွေ ပို့ဖို့ လိုအပ်တဲ့ field တွေကို ဖော်ပြတဲ့ `BasicAddress` type တစ်ခု ရှိတယ် ဆိုပါစို့:

```ts
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

တချို့ အခြေအနေတွေမှာ အဲဒါ လုံလောက်ပါတယ် — ဒါပေမယ့် လိပ်စာတစ်ခုမှာ building က unit အများကြီး ရှိနေရင် unit number ပါ ဆက်စပ်နေတတ်ပါတယ်။ အဲဒါဆိုရင် `AddressWithUnit` ကို ဒီလို ဖော်ပြနိုင်ပါတယ်:

```ts
interface AddressWithUnit {
  name?: string;
  unit: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

ဒါက အလုပ်ဖြစ်ပေမယ့် — အားနည်းချက်က ကျွန်တော်တို့ရဲ့ ပြောင်းလဲမှုက ထပ်ဖြည့်တာချည်းပဲ ဖြစ်နေတဲ့ကြားမှ `BasicAddress` ရဲ့ တခြား field တွေ အားလုံးကို ပြန်ရေးနေရတာပါ။ အဲဒီအစား — မူရင်း `BasicAddress` type ကို extend လုပ်ပြီး `AddressWithUnit` အတွက် ထူးခြားတဲ့ field အသစ်တွေပဲ ထပ်ထည့်လို့ရပါတယ်:

```ts
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}
```

`interface` ပေါ်က `extends` keyword က — တခြား named types တွေရဲ့ member တွေကို ထိရောက်စွာ ကူးယူပြီး ကိုယ်လိုချင်တဲ့ member အသစ်တွေကို ထပ်ထည့်နိုင်စေပါတယ်။ ဒါက type declaration တွေ ထပ်ခါထပ်ခါ ရေးရတဲ့ boilerplate ကို လျှော့ချဖို့ ရော — တူညီတဲ့ property ရဲ့ declaration အမျိုးမျိုး ဆက်စပ်နေနိုင်တယ်ဆိုတဲ့ intent ကို အချက်ပြဖို့ ရော အသုံးဝင်ပါတယ်။ ဥပမာ — `AddressWithUnit` က `street` property ကို ပြန်ရေးစရာ မလိုတော့ဘဲ — `street` က `BasicAddress` ကလာတာမို့ ဒီ type နှစ်ခု ဆက်စပ်နေတယ်ဆိုတာကို ဖတ်သူ သိပါတယ်။

`interface` တွေက type အများကြီးကနေလည်း extend လုပ်လို့ရပါတယ်:

```ts
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```

## Intersection Types (Intersection Type များ)

`interface` တွေက extend လုပ်ခြင်းအားဖြင့် type အသစ်တွေ တည်ဆောက်နိုင်စေပါတယ်။ TypeScript မှာ _intersection types_ လို့ခေါ်တဲ့ နောက်ထပ် construct တစ်ခုလည်း ရှိပြီး — အဓိကအားဖြင့် ရှိပြီးသား object types တွေကို ပေါင်းစပ်ဖို့ သုံးပါတယ်။

Intersection type ကို `&` operator နဲ့ သတ်မှတ်ပါတယ်:

```ts
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;
```

ဒီမှာ `Colorful` နဲ့ `Circle` ကို intersect လုပ်ပြီး — `Colorful` ရော `Circle` ရဲ့ member တွေ အားလုံး ရှိတဲ့ type အသစ်တစ်ခု ထုတ်လိုက်ပါတယ်:

```ts
function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}

// အဆင်ပြေပါတယ်
draw({ color: "blue", radius: 42 });

// ဟုတ်ပါပြီ — error ပါ
draw({ color: "red", raidus: 42 });
```

## Interface Extension vs. Intersection (ဘယ်ဟာ ဘယ်အခါ သုံးမလဲ)

Type တွေကို ပေါင်းစပ်ဖို့ နည်းလမ်း နှစ်ခုကို ကြည့်ပြီးပြီ — ဆင်တူပေမယ့် တကယ်တော့ သိမ်မွေ့စွာ ကွဲပြားပါတယ်။ Interface တွေနဲ့ဆိုရင် `extends` clause သုံးပြီး တခြား type တွေကနေ တိုးချဲ့လို့ရပြီး — intersections တွေနဲ့လည်း အလားတူ လုပ်လို့ရပြီး result ကို type alias နဲ့ နာမည်ပေးလို့ရပါတယ်။ နှစ်ခုရဲ့ အဓိက ကွာခြားချက်က **conflict တွေကို ဘယ်လို ကိုင်တွယ်လဲ** ဆိုတာပါ — ပြီးတော့ ဒီကွာခြားချက်ကြောင့်ပဲ interface နဲ့ intersection type ရဲ့ type alias ကြားမှာ တစ်ခုကို ရွေးချယ်ကြတာ များပါတယ်။

Interface နှစ်ခုကို နာမည်တူနဲ့ သတ်မှတ်ရင် — property တွေ compatible ဖြစ်ရင် TypeScript က merge လုပ်ဖို့ ကြိုးစားပါတယ်။ Property တွေ compatible မဖြစ်ရင် (ဥပမာ property နာမည်တူပေမယ့် type မတူ) TypeScript က error တက်စေပါတယ်။

Intersection types တွေမှာတော့ — type မတူတဲ့ property တွေကို အလိုအလျောက် ပေါင်းစပ်လိုက်ပါတယ်။ နောက်ပိုင်း type ကို သုံးတဲ့အခါ TypeScript က property က နှစ်ခုစလုံးကို တစ်ပြိုင်နက် ကျေနပ်စေဖို့ မျှော်လင့်ပါတယ် — ဒါက မမျှော်လင့်တဲ့ ရလဒ်တွေ ဖြစ်စေနိုင်ပါတယ်။

ဥပမာ — အောက်ပါ code က property တွေ incompatible ဖြစ်လို့ error တက်ပါတယ်:

```ts
interface Person {
  name: string;
}

interface Person {
  name: number;
}
```

ဆန့်ကျင်ဘက်အနေနဲ့ — အောက်ပါ code က compile ဖြစ်ပေမယ့် `never` type ကို ဖြစ်စေပါတယ်:

```ts
interface Person1 {
  name: string;
}

interface Person2 {
  name: number;
}

type Staff = Person1 & Person2;

declare const staffer: Staff;
staffer.name;
```

ဒီကိစ္စမှာ `Staff` က `name` property ကို string ရော number ရော နှစ်ခုလုံး ဖြစ်ဖို့ တောင်းဆိုတာမို့ — property က `never` type ဖြစ်သွားပါတယ်။

## Generic Object Types (Generic Object Type များ)

`Box` type တစ်ခုကို မြင်ယောင်ကြည့်ရအောင် — ဘာ value မဆို ထည့်လို့ရတဲ့ type ပါ — `string` တွေ ၊ `number` တွေ ၊ `Giraffe` တွေ ၊ ဘာဖြစ်ဖြစ်ပေါ့။

```ts
interface Box {
  contents: any;
}
```

အခုလောလောဆယ် `contents` property ကို `any` လို့ သတ်မှတ်ထားပါတယ် — အလုပ်ဖြစ်ပေမယ့် နောက်ပိုင်းမှာ မတော်တဆ အမှားတွေ ဖြစ်စေနိုင်ပါတယ်။

`unknown` ကိုလည်း သုံးလို့ရပါတယ် — ဒါပေမယ့် `contents` ရဲ့ type ကို ကြိုသိပြီးသား အခြေအနေတွေမှာ ကြိုတင်ကာကွယ်တဲ့ check တွေ လုပ်ရပါမယ်၊ ဒါမှမဟုတ် error ဖြစ်နိုင်ခြေ ရှိတဲ့ type assertions တွေ သုံးရပါမယ်:

```ts
interface Box {
  contents: unknown;
}

let x: Box = {
  contents: "hello world",
};

// 'x.contents' ကို check လုပ်လို့ရပါတယ်
if (typeof x.contents === "string") {
  console.log(x.contents.toLowerCase());
}

// ဒါမှမဟုတ် type assertion သုံးလို့လည်း ရပါတယ်
console.log((x.contents as string).toLowerCase());
```

Type-safe ဖြစ်တဲ့ နည်းလမ်းတစ်ခုက — `contents` ရဲ့ type တစ်ခုချင်းစီအတွက် `Box` type အမျိုးမျိုး သီးခြား ဆောက်တာပါ:

```ts
interface NumberBox {
  contents: number;
}

interface StringBox {
  contents: string;
}

interface BooleanBox {
  contents: boolean;
}
```

ဒါပေမယ့် အဲဒါဆိုရင် — ဒီ type တွေနဲ့ အလုပ်လုပ်ဖို့ function တွေ ဒါမှမဟုတ် function overloads တွေ အများကြီး ဖန်တီးရပါမယ်:

```ts
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
  box.contents = newContents;
}
```

Boilerplate တွေ အများကြီးပါ။ နောက်ပြီး နောက်ပိုင်း type အသစ်တွေ နဲ့ overload အသစ်တွေ ထည့်ဖို့ လိုလာနိုင်ပါသေးတယ်။ Box types တွေရော overloads တွေရော အကုန်လုံး တကယ်တော့ အတူတူပဲ ဖြစ်နေတာမို့ — ဒါက စိတ်ညစ်စရာပါ။

အဲဒီအစား — _type parameter_ ကြေညာထားတဲ့ _generic_ `Box` type တစ်ခု လုပ်လို့ရပါတယ်:

```ts
interface Box<Type> {
  contents: Type;
}
```

ဒါကို "`Type` ရဲ့ `Box` ဆိုတာ `contents` တွေရဲ့ type က `Type` ဖြစ်တဲ့ အရာ" လို့ ဖတ်လို့ရပါတယ်။ နောက်ပိုင်း `Box` ကို ရည်ညွှန်းတဲ့အခါ — `Type` နေရာမှာ _type argument_ ပေးရပါတယ်:

```ts
let box: Box<string>;
```

`Box` ကို တကယ့် type တစ်ခုအတွက် template သဖွယ် မြင်ယောင်ပါ — `Type` က တခြား type တစ်ခုနဲ့ အစားထိုးခံရမယ့် placeholder ပါ။ TypeScript က `Box<string>` ကို မြင်တဲ့အခါ — `Box<Type>` ထဲက `Type` နေရာတိုင်းကို `string` နဲ့ အစားထိုးပြီး `{ contents: string }` လိုမျိုး ပုံစံမျိုးနဲ့ အလုပ်လုပ်ပါတယ်။ တစ်နည်းပြောရရင် `Box<string>` က အစောပိုင်းက `StringBox` နဲ့ အတူတူပဲ အလုပ်လုပ်ပါတယ်:

```ts
interface Box<Type> {
  contents: Type;
}
interface StringBox {
  contents: string;
}

let boxA: Box<string> = { contents: "hello" };
boxA.contents;

let boxB: StringBox = { contents: "world" };
boxB.contents;
```

`Box` က reusable ဖြစ်ပြီး — `Type` နေရာမှာ ဘာနဲ့မဆို အစားထိုးလို့ရပါတယ်။ ဆိုလိုတာက type အသစ်တစ်ခုအတွက် box လိုတဲ့အခါ `Box` type အသစ် ကြေညာစရာ လုံးဝ မလိုပါဘူး (လိုချင်ရင်တော့ ရပါတယ်)။

```ts
interface Box<Type> {
  contents: Type;
}

interface Apple {
  // ...
}

// '{ contents: Apple }' နဲ့ အတူတူပါ
type AppleBox = Box<Apple>;
```

ဒါက — [generic functions](/docs/typescript/functions) တွေကိုသုံးခြင်းအားဖြင့် overloads တွေကို လုံးဝ ရှောင်လွှဲနိုင်တယ်လို့လည်း ဆိုလိုပါတယ်:

```ts
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```

Type aliases တွေလည်း generic ဖြစ်နိုင်တာ သတိပြုသင့်ပါတယ်။ ကျွန်တော်တို့ရဲ့ `Box<Type>` interface အသစ်ကို — type alias နဲ့လည်း သတ်မှတ်လို့ရပါတယ်:

```ts
type Box<Type> = {
  contents: Type;
};
```

Type aliases တွေက interfaces တွေနဲ့ မတူဘဲ object types တွေထက် ပိုပြီး ဖော်ပြနိုင်တာမို့ — တခြား generic helper types တွေကိုလည်း ရေးလို့ရပါတယ်:

```ts
type OrNull<Type> = Type | null;

type OneOrMany<Type> = Type | Type[];

type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;

type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
```

Type aliases အကြောင်းကို နည်းနည်းကြာရင် ပြန်လာပါမယ်။

### `Array` Type

Generic object types တွေက အများအားဖြင့် — သူတို့ထဲ ပါတဲ့ elements တွေရဲ့ type နဲ့ သီးခြား အလုပ်လုပ်တဲ့ container types တွေပါ။ Data structures တွေ ဒီလိုမျိုး ဖြစ်နေတာ အကောင်းဆုံးပါ — ဘာလို့လဲဆိုတော့ data type အမျိုးမျိုးကြားမှာ ပြန်သုံးလို့ရလို့ပါ။

ဒီ handbook တစ်လျှောက်လုံး ကျွန်တော်တို့ ဒီလို type မျိုးနဲ့ပဲ အလုပ်လုပ်နေခဲ့တာ တွေ့ရပါမယ် — `Array` type ပါ။ `number[]` ဒါမှမဟုတ် `string[]` လိုမျိုး types တွေ ရေးတိုင်း — အဲဒါတွေက တကယ်တော့ `Array<number>` နဲ့ `Array<string>` ရဲ့ အတိုကောက်ပါ။

```ts
function doSomething(value: Array<string>) {
  // ...
}

let myArray: string[] = ["hello", "world"];

// ဒီနှစ်ခုလုံး အလုပ်လုပ်ပါတယ်!
doSomething(myArray);
doSomething(new Array("hello", "world"));
```

အပေါ်က `Box` type လိုပဲ — `Array` ကိုယ်တိုင်လည်း generic type တစ်ခုပါ:

```ts
interface Array<Type> {
  /**
   * Array ရဲ့ length ကို ယူခြင်း သို့မဟုတ် သတ်မှတ်ခြင်း
   */
  length: number;

  /**
   * Array ရဲ့ နောက်ဆုံး element ကို ဖယ်ရှားပြီး ပြန်ပေးပါတယ်
   */
  pop(): Type | undefined;

  /**
   * Array ထဲကို elements အသစ်တွေ ထည့်ပြီး ထည့်ပြီးသော array ရဲ့ အသစ်ဖြစ်တဲ့ length ကို ပြန်ပေးပါတယ်
   */
  push(...items: Type[]): number;

  // ...
}
```

ခေတ်မီ JavaScript မှာ generic ဖြစ်တဲ့ တခြား data structures တွေလည်း ရှိပါတယ် — `Map<K, V>` ၊ `Set<T>` ၊ နဲ့ `Promise<T>` လိုမျိုးပါ။ ဆိုလိုတာက — `Map` ၊ `Set` ၊ `Promise` တွေရဲ့ အပြုအမူကြောင့် သူတို့က type အုပ်စု ဘယ်လိုနဲ့မဆို အလုပ်လုပ်လို့ရပါတယ်။

### `ReadonlyArray` Type

`ReadonlyArray` က ပြောင်းလဲလို့ မရသင့်တဲ့ arrays တွေကို ဖော်ပြတဲ့ အထူး type တစ်ခုပါ:

```ts
function doStuff(values: ReadonlyArray<string>) {
  // 'values' ကနေ ဖတ်လို့ရပါတယ်...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...ဒါပေမယ့် 'values' ကို ပြောင်းလဲလို့ (mutate) မရပါဘူး
  values.push("hello!");
}
```

Property တွေရဲ့ `readonly` modifier လိုပဲ — ဒါက အဓိကအားဖြင့် intent ဖော်ပြဖို့ သုံးတဲ့ tool ပါ။ `ReadonlyArray` တွေ ပြန်ပေးတဲ့ function ကို မြင်ရင် — contents တွေကို လုံးဝ မပြောင်းလဲစေချင်ဘူးလို့ သိရပြီး — `ReadonlyArray` တွေကို လက်ခံတဲ့ function ကိုမြင်ရင် — contents တွေ ပြောင်းသွားမှာ စိုးရိမ်စရာမလိုဘဲ ဘယ် array ကိုမဆို ပို့လို့ရတယ်လို့ သိရပါတယ်။

`Array` နဲ့ မတူတာက — သုံးလို့ရတဲ့ `ReadonlyArray` constructor မရှိပါဘူး:

```ts
new ReadonlyArray("red", "green", "blue");
```

အဲဒီအစား — သာမန် `Array` တွေကို `ReadonlyArray` ဆီ assign လုပ်လို့ရပါတယ်:

```ts
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```

TypeScript က `Array<Type>` အတွက် `Type[]` ဆိုတဲ့ shorthand ပေးထားသလို — `ReadonlyArray<Type>` အတွက်လည်း `readonly Type[]` ဆိုတဲ့ shorthand ရှိပါတယ်:

```ts
function doStuff(values: readonly string[]) {
  // 'values' ကနေ ဖတ်လို့ရပါတယ်...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...ဒါပေမယ့် 'values' ကို mutate လုပ်လို့မရပါဘူး
  values.push("hello!");
}
```

နောက်ဆုံး သတိပြုရမှာက — `readonly` property modifier နဲ့ မတူဘဲ — သာမန် `Array` တွေနဲ့ `ReadonlyArray` တွေကြားမှာ assignability က နှစ်ဖက် မညီပါဘူး:

```ts
let x: readonly string[] = [];
let y: string[] = [];

x = y;
y = x;
```

### Tuple Types (Tuple Type များ)

_tuple type_ ဆိုတာ — ဘယ်နှစ်ခု element ပါဝင်လဲ အတိအကျ သိတဲ့ ၊ ပြီးတော့ ဘယ် position မှာ ဘယ် types တွေ ပါလဲ အတိအကျ သိတဲ့ `Array` type တစ်မျိုးပါ:

```ts
type StringNumberPair = [string, number];
```

ဒီမှာ `StringNumberPair` က `string` နဲ့ `number` ရဲ့ tuple type ပါ။ `ReadonlyArray` လိုပဲ — runtime မှာ ကိုယ်စားပြုမှု မရှိပေမယ့် TypeScript အတွက်တော့ အဓိပ္ပာယ် ရှိပါတယ်။ Type system အတွက်ဆိုရင် `StringNumberPair` က — `0` index မှာ `string` ပါပြီး `1` index မှာ `number` ပါတဲ့ arrays တွေကို ဖော်ပြပါတယ်:

```ts
function doSomething(pair: [string, number]) {
  const a = pair[0];
  const b = pair[1];
  // ...
}

doSomething(["hello", 42]);
```

Element အရေအတွက်ထက် ကျော်ပြီး index လုပ်ဖို့ ကြိုးစားရင် error တက်ပါတယ်:

```ts
function doSomething(pair: [string, number]) {
  // ...

  const c = pair[2];
}
```

JavaScript ရဲ့ array destructuring ကိုသုံးပြီး tuples တွေကို [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) လုပ်လို့လည်း ရပါတယ်:

```ts
function doSomething(stringHash: [string, number]) {
  const [inputString, hash] = stringHash;

  console.log(inputString);
  console.log(hash);
}
```

> Tuple types တွေက convention တွေပေါ် အခြေခံပြီး element တစ်ခုချင်းစီရဲ့ အဓိပ္ပာယ်က "သိသာထင်ရှား" တဲ့ APIs တွေမှာ အသုံးဝင်ပါတယ်။
> ဒါက destructure လုပ်တဲ့အခါ variable တွေကို ကိုယ်ကြိုက်တဲ့ နာမည် ပေးနိုင်တဲ့ လွတ်လပ်မှု ပေးပါတယ်။
> အပေါ်က ဥပမာမှာ element `0` နဲ့ `1` ကို ကိုယ်ကြိုက်တဲ့ နာမည် ဘာမဆို ပေးနိုင်ပါတယ်။
>
> ဒါပေမယ့် — ဘာက "သိသာထင်ရှား" လဲဆိုတာ user တိုင်း တူညီတဲ့ အမြင် မရှိနိုင်လို့ — descriptive property နာမည်တွေပါတဲ့ objects တွေကို သုံးတာ သင့် API အတွက် ပိုကောင်းလားဆိုတာ ပြန်စဉ်းစားသင့်ပါတယ်။

ဒီ length checks တွေကလွဲရင် — ဒီလို ရိုးရှင်းတဲ့ tuple types တွေက — specific indexes တွေအတွက် properties တွေ ကြေညာထားပြီး `length` ကို numeric literal type နဲ့ ကြေညာထားတဲ့ `Array` ဗားရှင်းတွေနဲ့ ညီမျှပါတယ်:

```ts
interface StringNumberPair {
  // အထူးပြု properties များ
  length: 2;
  0: string;
  1: number;

  // တခြား 'Array<string | number>' members များ...
  slice(start?: number, end?: number): Array<string | number>;
}
```

နောက်ထပ် စိတ်ဝင်စားစရာက — tuples တွေမှာ element ရဲ့ type နောက်မှာ question mark (`?`) ရေးခြင်းအားဖြင့် optional properties တွေ ထည့်လို့ရတာပါ။ Optional tuple elements တွေက အဆုံးမှာပဲ ရှိနိုင်ပြီး — `length` ရဲ့ type ကိုလည်း သက်ရောက်မှု ရှိပါတယ်:

```ts
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord;

  console.log(`Provided coordinates had ${coord.length} dimensions`);
}
```

Tuples တွေမှာ rest elements တွေလည်း ရှိနိုင်ပြီး — အဲဒါတွေက array/tuple type ဖြစ်ရပါတယ်:

```ts
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

- `StringNumberBooleans` က ပထမ element နှစ်ခုက `string` နဲ့ `number` ဖြစ်ပြီး နောက်မှာ `boolean` တွေ ဘယ်နှစ်ခုမဆို ပါနိုင်တဲ့ tuple ကို ဖော်ပြပါတယ်။
- `StringBooleansNumber` က ပထမ element က `string` ၊ ပြီးတော့ `boolean` တွေ ဘယ်နှစ်ခုမဆို ၊ နောက်ဆုံးမှာ `number` နဲ့ အဆုံးသတ်တဲ့ tuple ကို ဖော်ပြပါတယ်။
- `BooleansStringNumber` က အစမှာ `boolean` တွေ ဘယ်နှစ်ခုမဆို ပြီး `string` ပြီးတော့ `number` နဲ့ အဆုံးသတ်တဲ့ tuple ကို ဖော်ပြပါတယ်။

Rest element ပါတဲ့ tuple မှာ သတ်မှတ်ထားတဲ့ "length" မရှိပါဘူး — position အမျိုးမျိုးမှာ သိထားပြီးသား elements တချို့ပဲ ရှိပါတယ်:

```ts
const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["beautiful", 2, true];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];
```

Optional နဲ့ rest elements တွေ ဘာကြောင့် အသုံးဝင်သလဲ? ဒါက TypeScript ကို tuples တွေကို parameter lists တွေနဲ့ ဆက်စပ်စေလို့ပါ။ Tuple types တွေကို [rest parameters and arguments](/docs/typescript/functions) တွေမှာ သုံးလို့ရတာမို့ — အောက်ပါဟာ:

```ts
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // ...
}
```

အခြေခံအားဖြင့် ဒီဟာနဲ့ ညီမျှပါတယ်:

```ts
function readButtonInput(name: string, version: number, ...input: boolean[]) {
  // ...
}
```

ဒါက rest parameter နဲ့ argument အရေအတွက် အမျိုးမျိုး လက်ခံချင်ပြီး — အနည်းဆုံး elements အရေအတွက် တစ်ခုတော့ လိုအပ်ပေမယ့် ကြားခံ variables တွေ မိတ်ဆက်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

### `readonly` Tuple Types (readonly Tuple Type များ)

Tuple types အကြောင်း နောက်ဆုံး မှတ်ချက် — tuple types တွေမှာ `readonly` ဗားရှင်းတွေ ရှိပြီး — array shorthand syntax လိုပဲ ရှေ့မှာ `readonly` modifier ကပ်ပြီး သတ်မှတ်ပါတယ်:

```ts
function doSomething(pair: readonly [string, number]) {
  // ...
}
```

မျှော်လင့်ထားသလိုပဲ — `readonly` tuple ရဲ့ property ဘယ်ဟာကိုမဆို ရေးလို့ မရပါဘူး:

```ts
function doSomething(pair: readonly [string, number]) {
  pair[0] = "hello!";
}
```

Tuples တွေက code အများစုမှာ ဖန်တီးပြီး မပြောင်းလဲဘဲ ထားတတ်တာမို့ — ဖြစ်နိုင်ရင် types တွေကို `readonly` tuples အဖြစ် မှတ်သားတာက ကောင်းတဲ့ default ပါ။ `const` assertions ပါတဲ့ array literals တွေကို `readonly` tuple types တွေအဖြစ် infer လုပ်မှာမို့ — ဒါက ပိုအရေးကြီးပါတယ်:

```ts
let point = [3, 4] as const;

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point);
```

ဒီမှာ `distanceFromOrigin` က သူ့ရဲ့ elements တွေကို ဘယ်တော့မှ မပြောင်းလဲပေမယ့် — mutable tuple တစ်ခုကိုပဲ မျှော်လင့်ပါတယ်။ `point` ရဲ့ type ကို `readonly [3, 4]` လို့ infer လုပ်ထားတာမို့ — `[number, number]` နဲ့ compatible မဖြစ်ပါဘူး — ဘာလို့လဲဆိုတော့ အဲဒီ type က `point` ရဲ့ elements တွေ မပြောင်းလဲဘူးဆိုတာ အာမခံလို့မရလို့ပါ။
