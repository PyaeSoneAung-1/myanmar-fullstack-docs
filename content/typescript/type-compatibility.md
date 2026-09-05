---
title: "Type Compatibility (Type လိုက်ဖက်ညီမှု)"
description: "TypeScript ရဲ့ structural typing စနစ်ပေါ် အခြေခံတဲ့ type compatibility — functions, enums, classes, generics များကို နှိုင်းယှဉ်ခြင်းနဲ့ abstract type များ၏ assignability ဇယား"
order: 64
source: "https://www.typescriptlang.org/docs/handbook/type-compatibility.html"
status: translated
updated: 2026-09-05
---

TypeScript မှာ type compatibility (type လိုက်ဖက်ညီမှု) က structural subtyping (ဖွဲ့စည်းပုံအခြေပြု subtype ပြုလုပ်ခြင်း) ပေါ်မှာ အခြေခံပါတယ်။ Structural typing ဆိုတာ type တွေကို သူတို့ရဲ့ members (အဖွဲ့ဝင် properties/methods များ) ပေါ်ကိုသာ ကြည့်ပြီး ဆက်စပ်မှု သတ်မှတ်တဲ့ နည်းလမ်းတစ်ခုပါ။ ဒါက nominal typing (နာမည်အခြေပြု typing) နဲ့ ဆန့်ကျင်ဘက် ဖြစ်ပါတယ်။ အောက်ပါ code ကို ကြည့်ပါ:

```ts
interface Pet {
  name: string;
}

class Dog {
  name: string;
}

let pet: Pet;
// OK, because of structural typing
pet = new Dog();
```

C# ဒါမှမဟုတ် Java လို nominally-typed (နာမည်အခြေပြု type စနစ် သုံးတဲ့) language တွေမှာဆိုရင် — ဒီနေရာနဲ့ ညီမျှတဲ့ code က error ဖြစ်ပါလိမ့်မယ် — `Dog` class က သူ့ဟာသူ `Pet` interface ရဲ့ implementer (အကောင်အထည်ဖော်သူ) ဖြစ်ကြောင်း အတိအကျ မဖော်ပြထားလို့ပါ။

TypeScript ရဲ့ structural type system ကို JavaScript code တွေ ပုံမှန် ရေးသားကြတဲ့ ပုံစံပေါ် အခြေခံပြီး ဒီဇိုင်းဆွဲထားတာပါ။ JavaScript က function expressions တွေ၊ object literals တွေလို anonymous object (နာမည်မဲ့ object) တွေကို နေရာအနှံ့ သုံးတာမို့ — JavaScript libraries တွေထဲမှာ တွေ့ရတတ်တဲ့ ဆက်စပ်မှုမျိုးတွေကို nominal system ထက် structural type system နဲ့ ဖော်ပြတာက ပိုပြီး သဘာဝကျပါတယ်။

## A Note on Soundness (Soundness အကြောင်း မှတ်ချက်)

TypeScript ရဲ့ type system က compile-time (ကွန်ပိုင်းချိန်) မှာ လုံခြုံကြောင်း အာမခံလို့ မရတဲ့ operation အချို့ကို ခွင့်ပြုထားပါတယ်။ Type system တစ်ခုမှာ ဒီလို ဂုဏ်သတ္တိ ရှိနေရင် အဲဒီ system ကို "sound" (ယုတ္တိကျနခြင်း) မဟုတ်ဘူးလို့ ဆိုပါတယ်။ TypeScript က unsound (ယုတ္တိကျနမှု မရှိတဲ့) အပြုအမူတွေကို ခွင့်ပြုထားတဲ့ နေရာတွေကို သေချာ စဉ်းစားထားပါတယ် — ဒီစာရွက်စာတမ်း တစ်လျှောက်မှာ အဲဒီနေရာတွေက ဘယ်မှာ ဖြစ်ပွားလဲ၊ ဘယ်လို ရည်ရွယ်ချက်တွေကြောင့် ဖြစ်လဲဆိုတာကို ရှင်းပြသွားပါမယ်။

## Starting out (စတင်ခြင်း)

TypeScript ရဲ့ structural type system ရဲ့ အခြေခံ စည်းမျဉ်းကတော့ — `y` မှာ `x` မှာရှိတဲ့ members တွေနဲ့ အနည်းဆုံး တူညီတဲ့ members တွေ ရှိနေရင် `x` က `y` နဲ့ compatible (လိုက်ဖက်) ပါတယ်။ ဥပမာ — `name` property ပါတဲ့ `Pet` ဆိုတဲ့ interface တစ်ခု ပါဝင်တဲ့ အောက်က code ကို ကြည့်ပါ:

```ts
interface Pet {
  name: string;
}

let pet: Pet;
// dog's inferred type is { name: string; owner: string; }
let dog = { name: "Lassie", owner: "Rudd Weatherwax" };
pet = dog;
```

`dog` ကို `pet` ဆီ assign (သတ်မှတ်ပေးအပ်) လုပ်လို့ ရလားဆိုတာ စစ်ဆေးဖို့ — compiler က `pet` ရဲ့ property တစ်ခုချင်းစီအတွက် `dog` ထဲမှာ ကိုက်ညီတဲ့ property ရှိမရှိ ရှာဖွေ စစ်ဆေးပါတယ်။ ဒီကိစ္စမှာ `dog` မှာ string ဖြစ်တဲ့ `name` ဆိုတဲ့ member ရှိရပါမယ်။ ရှိတာမို့ — assignment ကို ခွင့်ပြုလိုက်ပါတယ်။

Function ခေါ်ဆိုမှုတစ်ခုရဲ့ arguments တွေကို စစ်ဆေးတဲ့အခါမှာလည်း ဒီ assignment စည်းမျဉ်း တစ်ခုတည်းကိုပဲ သုံးပါတယ်:

```ts
interface Pet {
  name: string;
}

let dog = { name: "Lassie", owner: "Rudd Weatherwax" };

function greet(pet: Pet) {
  console.log("Hello, " + pet.name);
}
greet(dog); // OK
```

`dog` မှာ `owner` ဆိုတဲ့ အပို property ပါနေပေမယ့် ဒါက error မဖြစ်စေဘူးဆိုတာ သတိပြုပါ။ Compatibility စစ်ဆေးတဲ့အခါ target type (ဒီနေရာမှာဆို `Pet`) ရဲ့ members တွေကိုပဲ ထည့်သွင်း စဉ်းစားပါတယ်။ ဒီ နှိုင်းယှဉ်မှု လုပ်ငန်းစဉ်က member တစ်ခုချင်းစီနဲ့ sub-member တစ်ခုချင်းစီရဲ့ type တွေကို စူးစမ်းရင်း — ကိုယ်တိုင်ထပ်ခါထပ်ခါ (recursively) ဆက်လက် လုပ်ဆောင်သွားပါတယ်။

ဒါပေမယ့် — object literals တွေဟာ [လူသိများတဲ့ properties များကိုသာ သတ်မှတ်ခွင့်ရှိသည်](/docs/typescript/object-types) ဆိုတာ သတိထားပါ။ ဥပမာ — `dog` က `Pet` type လို့ အတိအကျ သတ်မှတ်ထားတာမို့ အောက်က code က မမှန်ကန်ပါဘူး:

```ts
let dog: Pet = { name: "Lassie", owner: "Rudd Weatherwax" }; // Error
```

## Comparing two functions (Function နှစ်ခု နှိုင်းယှဉ်ခြင်း)

Primitive types နဲ့ object types တွေကို နှိုင်းယှဉ်တာက အတော်လေး ရိုးရှင်းပေမယ့် — ဘယ်လို functions တွေကို compatible လို့ သတ်မှတ်သင့်လဲဆိုတဲ့ မေးခွန်းကတော့ နည်းနည်း ပိုရှုပ်ထွေးပါတယ်။ Parameter lists တွေမှာပဲ ကွဲပြားတဲ့ function နှစ်ခုရဲ့ အခြေခံ ဥပမာတစ်ခုနဲ့ စလိုက်ရအောင်:

```ts
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

`x` က `y` ဆီ assignable လားဆိုတာ စစ်ဆေးဖို့ ပထမဆုံး parameter list ကို ကြည့်ပါတယ်။ `x` ထဲက parameter တစ်ခုချင်းစီအတွက် `y` ထဲမှာ compatible type ရှိတဲ့ သက်ဆိုင်ရာ parameter ရှိရပါမယ်။ Parameter တွေရဲ့ နာမည်တွေကို ထည့်သွင်း စဉ်းစားတာ မဟုတ်ဘူး — type တွေကိုပဲ စဉ်းစားတာဆိုတာ သတိပြုပါ။ ဒီနေရာမှာ `x` ရဲ့ parameter တိုင်းက `y` ထဲမှာ ကိုက်ညီတဲ့ parameter ရှိတာမို့ — assignment ကို ခွင့်ပြုပါတယ်။

ဒုတိယ assignment ကတော့ error ပါ — `y` မှာ `x` မှာ မရှိတဲ့ မဖြစ်မနေ လိုအပ်တဲ့ ဒုတိယ parameter ပါနေလို့ assignment ကို ခွင့်မပြုပါဘူး။

`y = x` ဆိုတဲ့ ဥပမာလိုမျိုး parameters တွေကို 'လျစ်လျူရှုခြင်း' (discarding) ကို ဘာလို့ ခွင့်ပြုထားလဲဆိုတာ သင်တွေးမိနေနိုင်ပါတယ်။ ဒီ assignment ကို ခွင့်ပြုရတဲ့ အကြောင်းရင်းက — function တစ်ခုရဲ့ အပို parameters တွေကို လျစ်လျူရှုလိုက်တာက JavaScript မှာ တကယ့်ကို အသုံးများလို့ပါ။ ဥပမာ — `Array#forEach` က callback function ကို parameter သုံးခု ပေးပါတယ်: array element၊ ၎င်းရဲ့ index နဲ့ ၎င်း ပါဝင်နေတဲ့ array တို့ပါ။ ဒါပေမယ့် — ပထမ parameter တစ်ခုတည်းကိုပဲ သုံးတဲ့ callback တစ်ခုကို ပေးနိုင်တာက အရမ်း အသုံးဝင်ပါတယ်:

```ts
let items = [1, 2, 3];

// Don't force these extra parameters
items.forEach((item, index, array) => console.log(item));

// Should be OK!
items.forEach((item) => console.log(item));
```

အခု return types တွေကို ဘယ်လို သဘောထားလဲ ကြည့်ကြရအောင် — return type မှာပဲ ကွဲပြားတဲ့ function နှစ်ခုကို သုံးပြီး ကြည့်ပါမယ်:

```ts
let x = () => ({ name: "Alice" });
let y = () => ({ name: "Alice", location: "Seattle" });

x = y; // OK
y = x; // Error, because x() lacks a location property
```

Type system က source function ရဲ့ return type ဟာ target type ရဲ့ return type ရဲ့ subtype ဖြစ်ရမယ်လို့ သတ်မှတ် ပြဋ္ဌာန်းပါတယ်။

### Function Parameter Bivariance (Function Parameter Bivariance သဘောတရား)

Function parameters တွေရဲ့ types တွေကို နှိုင်းယှဉ်တဲ့အခါ — source parameter က target parameter ဆီ assignable ဖြစ်ရင် ဒါမှမဟုတ် အပြန်အလှန်အားဖြင့် ဖြစ်ရင် assignment က အောင်မြင်ပါတယ်။ ဒါက unsound ပါ — ဘာလို့လဲဆိုတော့ caller တစ်ယောက်က ပိုပြီး အသေးစိတ်ကျတဲ့ (specialized) type ကို လက်ခံတဲ့ function တစ်ခုကို ရသွားပြီး — အဲဒီ function ကို ပိုပြီး ယေဘုယျကျတဲ့ type နဲ့ ခေါ်မိနိုင်လို့ပါ။ လက်တွေ့မှာ ဒီလို error မျိုးက ရှားပါတယ် — ပြီးတော့ ဒါကို ခွင့်ပြုထားခြင်းက JavaScript ရဲ့ အသုံးများတဲ့ patterns တွေ အများကြီးကို ရေးလို့ရစေပါတယ်။ ဥပမာအကျဉ်းတစ်ခု ကြည့်ရအောင်:

```ts
enum EventType {
  Mouse,
  Keyboard,
}

interface Event {
  timestamp: number;
}
interface MyMouseEvent extends Event {
  x: number;
  y: number;
}
interface MyKeyEvent extends Event {
  keyCode: number;
}

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
  /* ... */
}

// Unsound, but useful and common
listenEvent(EventType.Mouse, (e: MyMouseEvent) => console.log(e.x + "," + e.y));

// Undesirable alternatives in presence of soundness
listenEvent(EventType.Mouse, (e: Event) =>
  console.log((e as MyMouseEvent).x + "," + (e as MyMouseEvent).y)
);
listenEvent(EventType.Mouse, ((e: MyMouseEvent) =>
  console.log(e.x + "," + e.y)) as (e: Event) => void);

// Still disallowed (clear error). Type safety enforced for wholly incompatible types
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

ဒီလို ဖြစ်ရပ်မျိုးမှာ TypeScript ကို error တက်စေချင်ရင် — [`strictFunctionTypes`](https://www.typescriptlang.org/tsconfig) ဆိုတဲ့ compiler flag ကို သုံးနိုင်ပါတယ်။

### Optional Parameters and Rest Parameters (Optional Parameters နဲ့ Rest Parameters)

Functions တွေကို compatibility အတွက် နှိုင်းယှဉ်တဲ့အခါ — optional နဲ့ required parameters တွေက အပြန်အလှန် လဲလှယ်သုံးလို့ ရပါတယ်။ Source type ထဲမှာ optional parameters အပိုတွေ ပါနေတာက error မဟုတ်သလို — target type ရဲ့ optional parameters တွေအတွက် source type ထဲမှာ သက်ဆိုင်ရာ parameters တွေ မရှိတာလည်း error မဟုတ်ပါဘူး။

Function တစ်ခုမှာ rest parameter ရှိနေရင် — အဲဒါကို optional parameters တွေ အဆုံးမရှိ ဆက်တန်းစီနေတာနဲ့ တူတယ်လို့ သဘောထားပါတယ်။

ဒါက type system ရှုထောင့်ကနေ ကြည့်ရင် unsound ဖြစ်ပေမယ့် — runtime ရှုထောင့်ကနေ ကြည့်ရင် optional parameter ဆိုတဲ့ အယူအဆကို ယေဘုယျအားဖြင့် သေချာ ပြဋ္ဌာန်း မထားတတ်ပါဘူး — အဲဒီ နေရာမှာ `undefined` ပေးလိုက်တာက function အများစုအတွက် အတူတူပဲ ဖြစ်လို့ပါ။

ဒီအတွက် ရည်ရွယ်ချက်ရှိတဲ့ ဥပမာကတော့ — callback တစ်ခုကို လက်ခံပြီး arguments အရေအတွက် တစ်ခုနဲ့ ခေါ်ပေးတဲ့ function တစ်ခုရဲ့ အသုံးများတဲ့ pattern ပါ — အဲဒီ arguments အရေအတွက်က programmer အတွက်တော့ ကြိုသိနိုင်ပေမယ့် type system အတွက်တော့ မသိနိုင်ပါဘူး:

```ts
function invokeLater(args: any[], callback: (...args: any[]) => void) {
  /* ... Invoke callback with 'args' ... */
}

// Unsound - invokeLater "might" provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ", " + y));

// Confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ", " + y));
```

### Functions with overloads (Overloads ရှိသော Functions)

Function တစ်ခုမှာ overloads (မတူညီသော signatures များဖြင့် ကြေညာချက်များ) တွေ ရှိတဲ့အခါ — target type ထဲက overload တစ်ခုချင်းစီကို source type ပေါ်က compatible signature တစ်ခုနဲ့ ကိုက်ညီစေရပါမယ်။ ဒါက target function ကို ခေါ်လို့ရတဲ့ ကိစ္စတိုင်းမှာ source function ကိုလည်း ခေါ်လို့ရအောင် သေချာ စေပါတယ်။

## Enums (Enum များ)

Enums တွေက numbers တွေနဲ့ compatible ဖြစ်ပြီး — numbers တွေကလည်း enums တွေနဲ့ compatible ပါ။ မတူညီတဲ့ enum types တွေကြားက enum values တွေကတော့ incompatible (မလိုက်ဖက်) လို့ သတ်မှတ်ပါတယ်။ ဥပမာ —

```ts
enum Status {
  Ready,
  Waiting,
}
enum Color {
  Red,
  Blue,
  Green,
}

let status = Status.Ready;
status = Color.Green; // Error
```

## Classes (Classes များ)

Classes တွေက object literal types တွေနဲ့ interfaces တွေနဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ် — ခြွင်းချက်တစ်ခုကတော့ သူတို့မှာ static type ရော instance type ပါ နှစ်မျိုးလုံး ရှိပါတယ်။ Class type တစ်ခုရဲ့ object နှစ်ခုကို နှိုင်းယှဉ်တဲ့အခါ — instance ရဲ့ members တွေကိုပဲ နှိုင်းယှဉ်ပါတယ်။ Static members တွေနဲ့ constructors တွေက compatibility ကို သက်ရောက်မှု မရှိပါဘူး။

```ts
class Animal {
  feet: number;
  constructor(name: string, numFeet: number) {}
}

class Size {
  feet: number;
  constructor(numFeet: number) {}
}

let a: Animal;
let s: Size;

a = s; // OK
s = a; // OK
```

### Private and protected members in classes (Classes ထဲက Private နဲ့ Protected Members)

Class တစ်ခုထဲက private နဲ့ protected members တွေက သူတို့ရဲ့ compatibility ကို သက်ရောက်မှု ရှိပါတယ်။ Class တစ်ခုရဲ့ instance ကို compatibility စစ်ဆေးတဲ့အခါ — target type ထဲမှာ private member ပါနေရင် source type ထဲမှာလည်း class တစ်ခုတည်းကနေ ဆင်းသက်လာတဲ့ private member တစ်ခု ပါဝင်ရပါမယ်။ Protected member ပါတဲ့ instance တစ်ခုအတွက်လည်း အလားတူပဲ ဖြစ်ပါတယ်။ ဒါက class တစ်ခုကို သူ့ရဲ့ super class နဲ့ကတော့ assignment compatible ဖြစ်စေပြီး — ပုံသဏ္ဍာန် (shape) တူညီပေမယ့် မတူညီတဲ့ inheritance hierarchy (အမွေဆက်ခံမှု သစ်ပင်) တစ်ခုကနေ ဆင်းသက်လာတဲ့ classes တွေနဲ့ကတော့ _မဖြစ်_ စေပါဘူး။

## Generics (Generics များ)

TypeScript က structural type system ဖြစ်တာမို့ — type parameters တွေက member တစ်ခုရဲ့ type ရဲ့ အစိတ်အပိုင်းအဖြစ် ပါဝင် သုံးစွဲတဲ့အခါမှသာ ရလဒ် type ကို သက်ရောက်မှု ရှိပါတယ်။ ဥပမာ —

```ts
interface Empty<T> {}
let x: Empty<number>;
let y: Empty<string>;

x = y; // OK, because y matches structure of x
```

အပေါ်က ဥပမာမှာ `x` နဲ့ `y` တို့က compatible ပါ — သူတို့ရဲ့ structures တွေက type argument ကို ခြားနားချက် ဖြစ်စေမယ့် နည်းနဲ့ မသုံးထားလို့ပါ။ `Empty<T>` ကို member တစ်ခု ထပ်ဖြည့်ပြီး ဒီဥပမာကို ပြောင်းကြည့်ရင် ဘယ်လို အလုပ်လုပ်လဲ မြင်ရပါမယ်:

```ts
interface NotEmpty<T> {
  data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y; // Error, because x and y are not compatible
```

ဒီနည်းနဲ့ — type arguments တွေ အတိအကျ သတ်မှတ်ထားတဲ့ generic type တစ်ခုက non-generic type တစ်ခုလိုပဲ ပြုမူပါတယ်။

Type arguments တွေ မသတ်မှတ်ထားတဲ့ generic types တွေအတွက်ကတော့ — မသတ်မှတ်ထားတဲ့ type arguments တွေ အားလုံးရဲ့ နေရာမှာ `any` ထည့်သွင်းပြီး compatibility ကို စစ်ဆေးပါတယ်။ ပြီးရင် ရလာတဲ့ types တွေကို non-generic ကိစ္စမှာလိုပဲ compatibility အတွက် စစ်ဆေးပါတယ်။

ဥပမာ —

```ts
let identity = function <T>(x: T): T {
  // ...
};

let reverse = function <U>(y: U): U {
  // ...
};

identity = reverse; // OK, because (x: any) => any matches (y: any) => any
```

## Advanced Topics (အဆင့်မြင့် အကြောင်းအရာများ)

### Subtype vs Assignment (Subtype နဲ့ Assignment)

အခုထိ ကျွန်တော်တို့ "compatible" ဆိုတဲ့ စကားလုံးကို သုံးခဲ့ပါတယ် — ဒါက language spec ထဲမှာ သတ်မှတ်ထားတဲ့ term တစ်ခု မဟုတ်ပါဘူး။ TypeScript မှာ compatibility နှစ်မျိုး ရှိပါတယ်: subtype နဲ့ assignment ပါ။ ဒီနှစ်ခု ကွာခြားတာက — assignment က subtype compatibility ကို `any` ကနေနဲ့ `any` ဆီ၊ ကိုက်ညီတဲ့ numeric values တွေ ရှိတဲ့ `enum` ကနေနဲ့ `enum` ဆီ assign လုပ်ခွင့် ပြုတဲ့ စည်းမျဉ်းတွေနဲ့ တိုးချဲ့ထားတာပဲ ဖြစ်ပါတယ်။

Language ထဲက နေရာ အမျိုးမျိုးမှာ အခြေအနေပေါ် မူတည်ပြီး ဒီ compatibility ယန္တရား နှစ်ခုထဲက တစ်ခုကို သုံးပါတယ်။ လက်တွေ့ ရည်ရွယ်ချက်တွေအတွက်တော့ type compatibility ကို assignment compatibility က အုပ်ချုပ်ပါတယ် — `implements` နဲ့ `extends` clauses တွေရဲ့ ကိစ္စတွေမှာတောင် ဒီအတိုင်းပဲ ဖြစ်ပါတယ်။

## `any`, `unknown`, `object`, `void`, `undefined`, `null`, and `never` assignability (ဤ abstract types များအကြား assignable ဖြစ်မှု)

အောက်က ဇယားက abstract types အချို့အကြား assignability ကို အကျဉ်းချုပ် ဖော်ပြပါတယ်။ Rows တွေက type တစ်ခုစီက ဘာဆီ assign လုပ်လို့ရလဲဆိုတာကို ပြပြီး — columns တွေက ဘာတွေက သူ့ဆီ assign လုပ်လို့ရလဲဆိုတာကို ပြပါတယ်။ "<span class='black-tick'>✓</span>" က [`strictNullChecks`](https://www.typescriptlang.org/tsconfig) ပိတ်ထားမှသာ compatible ဖြစ်တဲ့ ပေါင်းစပ်မှုတစ်ခုကို ညွှန်ပြပါတယ်။

<table class="data">
<thead>
<tr>
<th></th>
<th align="center">any</th>
<th align="center">unknown</th>
<th align="center">object</th>
<th align="center">void</th>
<th align="center">undefined</th>
<th align="center">null</th>
<th align="center">never</th>
</tr>
</thead>
<tbody>
<tr>
<td>any →</td>
<td align="center"></td>
<td align="center"><span class="blue-tick" style="
    color: #007aff;
">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>unknown →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>object →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>void →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>undefined →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="black-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"></td>
<td align="center"><span class="black-tick">✓</span></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>null →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="black-tick">✓</span></td>
<td align="center"><span class="black-tick">✓</span></td>
<td align="center"><span class="black-tick">✓</span></td>
<td align="center"></td>
<td align="center"><span class="red-cross">✕</span></td>
</tr>
<tr>
<td>never →</td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"><span class="blue-tick">✓</span></td>
<td align="center"></td>
</tr>
</tbody>
</table>

အခု [The Basics (အခြေခံများ)](/docs/typescript/basic-types) က အချက်တွေကို ပြန်ဆိုရရင်:

- အရာအားလုံးက သူ့ဘာသာသူဆီ assignable ပါ။
- `any` နဲ့ `unknown` တို့က သူတို့ဆီ ဘာတွေ assignable လဲဆိုတဲ့ အပိုင်းမှာ တူညီပြီး — `unknown` က `any` ကလွဲလို့ ဘာဆီမှ assignable မဟုတ်တဲ့ အပိုင်းမှာ ကွဲပြားပါတယ်။
- `unknown` နဲ့ `never` တို့ကတော့ တစ်ခုနဲ့တစ်ခု ပြောင်းပြန် (inverse) သဖွယ်ပါပဲ။
  အရာအားလုံးက `unknown` ဆီ assignable ဖြစ်ပြီး — `never` ကတော့ အရာအားလုံးဆီ assignable ပါ။
  `never` ဆီကိုတော့ ဘာမှ assignable မဟုတ်သလို — `unknown` ကလည်း (`any` ကလွဲပြီး) ဘာဆီမှ assignable မဟုတ်ပါဘူး။
- `void` က ဘာဆီမှ ရော ဘာကနေမှ ပါ assignable မဟုတ်ပါဘူး — အောက်ပါတို့ကလွဲလို့: `any`၊ `unknown`၊ `never`၊ `undefined` နဲ့ `null` ([`strictNullChecks`](https://www.typescriptlang.org/tsconfig) ပိတ်ထားရင် — အသေးစိတ်ကို ဇယားမှာ ကြည့်ပါ)။
- [`strictNullChecks`](https://www.typescriptlang.org/tsconfig) ပိတ်ထားတဲ့အခါ — `null` နဲ့ `undefined` တို့က `never` နဲ့ ဆင်ပါတယ်: type အများစုဆီ assignable ဖြစ်ပြီး — type အများစုကတော့ သူတို့ဆီ assignable မဟုတ်ပါဘူး။
  သူတို့ နှစ်ခုကတော့ တစ်ခုနဲ့တစ်ခု assignable ပါ။
- [`strictNullChecks`](https://www.typescriptlang.org/tsconfig) ဖွင့်ထားတဲ့အခါ — `null` နဲ့ `undefined` တို့က `void` လို ပိုပြီး ပြုမူပါတယ်: `any`၊ `unknown` နဲ့ `void` ကလွဲလို့ ဘာဆီမှ ရော ဘာကနေမှ ပါ assignable မဟုတ်ပါဘူး (`undefined` ကတော့ `void` ဆီ အမြဲတမ်း assignable ပါ)။
