---
title: "Interfaces (Interface များ)"
description: "Interface တွေကို သုံးပြီး object shapes, function types, indexable types တွေကို ဘယ်လို ဖော်ပြမလဲ — optional/readonly properties, excess property checks, class types, extending interfaces နဲ့ hybrid types အထိ ဥပမာများနဲ့တကွ ရှင်းလင်းချက်"
order: 78
source: "https://www.typescriptlang.org/docs/handbook/interfaces.html"
status: translated
updated: 2026-09-05
---

TypeScript ရဲ့ အဓိက နိယာမတွေထဲက တစ်ခုက — type checking က values တွေရဲ့ _shape_ (ပုံသဏ္ဍာန်) ကို အာရုံစိုက်တာပါ။ ဒါကို တစ်ခါတစ်ရံ "duck typing" ဒါမှမဟုတ် "structural subtyping" လို့ ခေါ်ပါတယ်။ TypeScript မှာ — interfaces တွေက ဒီ types တွေကို နာမည်ပေးခြင်း အခန်းကဏ္ဍကို ဖြည့်ဆည်းပေးပြီး — သင့် code အတွင်းက contracts တွေအပြင် — သင့် project အပြင်ဘက်က code တွေနဲ့ပါ contracts တွေကို သတ်မှတ်ဖို့ အစွမ်းထက်တဲ့ နည်းလမ်းတစ်ခု ဖြစ်ပါတယ်။

## Our First Interface (ပထမဆုံး Interface)

Interfaces တွေ ဘယ်လို အလုပ်လုပ်လဲဆိုတာ မြင်ဖို့ အလွယ်ဆုံး နည်းလမ်းက — ရိုးရှင်းတဲ့ ဥပမာတစ်ခုနဲ့ စတင်ခြင်းပါ:

```ts twoslash
function printLabel(labeledObj: { label: string }) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

Type checker က `printLabel` ဆီ ခေါ်ဆိုမှုကို စစ်ဆေးပါတယ်။ `printLabel` function မှာ — ထည့်လိုက်တဲ့ object မှာ `string` type ရှိတဲ့ `label` ဆိုတဲ့ property ပါဖို့ လိုအပ်တဲ့ parameter တစ်ခုတည်း ရှိပါတယ်။ ကျွန်တော်တို့ရဲ့ object မှာ ဒီထက် ပိုတဲ့ properties တွေ တကယ်ပဲ ရှိတာကို သတိပြုပါ — ဒါပေမယ့် compiler က _အနည်းဆုံး_ လိုအပ်တဲ့ properties တွေ ရှိနေပြီး — ၎င်းတို့က လိုအပ်တဲ့ types တွေနဲ့ ကိုက်ညီမညီကိုပဲ စစ်ဆေးပါတယ်။ TypeScript က ဒီလောက် လျော့ပေါ့မပေးတဲ့ အခြေအနေတစ်ချို့လည်း ရှိပါတယ် — နည်းနည်းကြာရင် ဖော်ပြပါမယ်။

ဒီဥပမာကိုပဲ — ဒီတစ်ခါ `label` property ကို string တစ်ခုအဖြစ် ပါရှိဖို့ လိုအပ်ချက်ကို ဖော်ပြဖို့ interface တစ်ခုကို သုံးပြီး ထပ်ရေးကြည့်ရအောင်:

```ts twoslash
interface LabeledValue {
  label: string;
}

function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

`LabeledValue` interface က — အရင် ဥပမာထဲက လိုအပ်ချက်ကို ဖော်ပြဖို့ အခု သုံးနိုင်မယ့် နာမည်တစ်ခုပါ။ ၎င်းက `string` type ဖြစ်တဲ့ `label` ဆိုတဲ့ property တစ်ခုတည်း ရှိနေခြင်းကိုပဲ ကိုယ်စားပြုဆဲပါ။ `printLabel` ဆီ ထည့်လိုက်တဲ့ object က ဒီ interface ကို implements လုပ်တယ်လို့ — တခြား languages တွေမှာ ပြောရနိုင်သလို — ရှင်းရှင်းလင်းလင်း ပြောစရာ မလိုခဲ့တာ သတိပြုပါ။ ဒီမှာ shape ပဲ အရေးကြီးပါတယ်။ Function ဆီ ထည့်လိုက်တဲ့ object က စာရင်းပြုထားတဲ့ လိုအပ်ချက်တွေကို ပြည့်မီရင် — ခွင့်ပြုပါတယ်။

Type checker က ဒီ properties တွေ ဘယ်လို အစီအစဉ်မျိုးနဲ့မဆို ပါလာဖို့ မလိုအပ်ဘဲ — interface က လိုအပ်တဲ့ properties တွေ ရှိနေဖို့နဲ့ ၎င်းတို့မှာ လိုအပ်တဲ့ type တွေ ရှိဖို့ပဲ လိုအပ်တယ်ဆိုတာ ထောက်ပြဖို့ ထိုက်တန်ပါတယ်။

## Optional Properties (Optional Properties များ)

Interface တစ်ခုရဲ့ properties တွေ အားလုံး မလိုအပ်ဘဲ ဖြစ်နိုင်ပါတယ်။ တစ်ချို့ဟာတွေက အခြေအနေတစ်ချို့အောက်မှာပဲ ရှိပြီး — တစ်ချို့ဟာတွေက လုံးဝ မရှိတာလည်း ဖြစ်နိုင်ပါတယ်။ ဒီ optional properties တွေက — properties အနည်းငယ်ပဲ ဖြည့်ထားတဲ့ object တစ်ခုကို function တစ်ခုဆီ ပေးပို့တဲ့ "option bags" လို patterns တွေ ဖန်တီးတဲ့အခါ ရေပန်းစားပါတယ်။

ဒီ pattern ရဲ့ ဥပမာတစ်ခု ဒီမှာ ပါပါတယ်:

```ts twoslash
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: "black" });
```

Optional properties ပါတဲ့ interfaces တွေကို — တခြား interfaces တွေနဲ့ ဆင်တူစွာ ရေးပြီး — optional property တစ်ခုချင်းစီကို declaration ထဲက property နာမည်ရဲ့ အဆုံးမှာ `?` နဲ့ ဖော်ပြပါတယ်။

Optional properties တွေရဲ့ အားသာချက်က — ဖြစ်နိုင်ခြေရှိတဲ့ ဒီ properties တွေကို ဖော်ပြနိုင်သလို — interface ရဲ့ အစိတ်အပိုင်း မဟုတ်တဲ့ properties တွေကို သုံးခြင်းကိုလည်း တစ်ချိန်တည်းမှာ တားဆီးထားနိုင်တာပါ။ ဥပမာ — `createSquare` ထဲက `color` property ရဲ့ နာမည်ကို စာလုံးပေါင်း မှားခဲ့ရင် — အသိပေးတဲ့ error message တစ်ခု ရပါလိမ့်မယ်:

```ts twoslash
// @errors: 2551
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.clor) {
    // Error: Property 'clor' does not exist on type 'SquareConfig'
    newSquare.color = config.clor;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: "black" });
```

## Readonly properties (Readonly Properties များ)

Properties တစ်ချို့ဟာ object ကို ပထမဆုံး ဖန်တီးတဲ့အခါမှာပဲ ပြုပြင်မွမ်းမံလို့ ရစေချင်ပါတယ်။ ဒါကို property ရဲ့ နာမည်ရှေ့မှာ `readonly` ထည့်ခြင်းအားဖြင့် သတ်မှတ်နိုင်ပါတယ်:

```ts twoslash
interface Point {
  readonly x: number;
  readonly y: number;
}
```

Object literal တစ်ခုကို assign လုပ်ခြင်းအားဖြင့် `Point` တစ်ခုကို တည်ဆောက်နိုင်ပါတယ်။ Assignment ပြီးတာနဲ့ — `x` နဲ့ `y` တွေကို ပြောင်းလဲလို့ မရတော့ပါဘူး။

```ts twoslash
// @errors: 2540
interface Point {
  readonly x: number;
  readonly y: number;
}
// ---cut---
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```

TypeScript မှာ — mutating methods (ပြောင်းလဲစေသော method များ) အားလုံးကို ဖယ်ထားတဲ့ `Array<T>` နဲ့ တူညီတဲ့ `ReadonlyArray<T>` type တစ်ခု ပါရှိပါတယ် — ဒါကြောင့် သင့်ရဲ့ arrays တွေကို ဖန်တီးပြီးနောက် မပြောင်းလဲကြောင်း သေချာစေနိုင်ပါတယ်:

```ts twoslash
// @errors: 2542 2339 2540 4104
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;

ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

Snippet ရဲ့ နောက်ဆုံး line မှာ — `ReadonlyArray` တစ်ခုလုံးကို ပုံမှန် array တစ်ခုဆီ ပြန် assign လုပ်တာတောင် တရားမဝင်ကြောင်း တွေ့နိုင်ပါတယ်။ ဒါပေမယ့် — type assertion တစ်ခုနဲ့တော့ ၎င်းကို ကျော်လွှားနိုင်ပါသေးတယ်:

```ts twoslash
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;

a = ro as number[];
```

### `readonly` vs `const` (`readonly` နဲ့ `const`)

`readonly` လား `const` လား သုံးရမလဲဆိုတာ မှတ်မိဖို့ အလွယ်ဆုံး နည်းလမ်းက — ဒါကို variable တစ်ခုပေါ်မှာလား property တစ်ခုပေါ်မှာလား သုံးနေလဲဆိုတာ ကိုယ့်ကိုယ်ကို မေးကြည့်ခြင်းပါ။ Variables တွေက `const` ကို သုံးပြီး — properties တွေကတော့ `readonly` ကို သုံးပါတယ်။

## Excess Property Checks (Excess Property Checks များ)

Interfaces တွေသုံးတဲ့ ကျွန်တော်တို့ရဲ့ ပထမဆုံး ဥပမာမှာ — TypeScript က `{ label: string; }` တစ်ခုကိုပဲ မျှော်လင့်ထားတဲ့ အရာတစ်ခုဆီ `{ size: number; label: string; }` ကို ထည့်ပေးခွင့် ပြုခဲ့ပါတယ်။ ပြီးတော့ — optional properties တွေအကြောင်းနဲ့ — "option bags" လို့ ခေါ်တဲ့အရာတွေကို ဖော်ပြတဲ့အခါ ၎င်းတို့ ဘယ်လို အသုံးဝင်လဲဆိုတာကိုလည်း လေ့လာခဲ့ပါပြီ။

ဒါပေမယ့် — နှစ်ခုကို နုံအတာနဲ့ ပေါင်းစပ်လိုက်ရင် error တစ်ခု တိတ်တဆိတ် ဝင်လာနိုင်ပါတယ်။ ဥပမာ — `createSquare` သုံးထားတဲ့ ကျွန်တော်တို့ရဲ့ နောက်ဆုံး ဥပမာကို ယူကြည့်ရအောင်:

```ts twoslash
// @errors: 2345 2739
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

`createSquare` ဆီ ပေးထားတဲ့ argument က `color` အစား _`colour`_ လို့ စာလုံးပေါင်းထားတာ သတိပြုပါ။ ရိုးရိုး JavaScript မှာဆိုရင် — ဒီလိုအရာမျိုးက တိတ်တဆိတ် ကျရှုံးပါတယ်။

`width` properties တွေ compatible ဖြစ်ပြီး — `color` property မရှိတာကြောင့်ရော — အပို `colour` property က အရေးမပါတာကြောင့်ရော — ဒီ program က မှန်ကန်စွာ typed လုပ်ထားတာပဲလို့ သင်က ငြင်းခုံနိုင်ပါတယ်။

ဒါပေမယ့် — TypeScript ကတော့ ဒီ code ထဲမှာ bug တစ်ခု ဖြစ်နိုင်တယ်ဆိုတဲ့ ရပ်တည်ချက်ကို ယူပါတယ်။ Object literals တွေက အထူး ဆက်ဆံမှု ခံရပြီး — တခြား variables တွေဆီ assign လုပ်တဲ့အခါ ဒါမှမဟုတ် arguments အဖြစ် ပေးပို့တဲ့အခါ — _excess property checking_ (ပိုလျှံနေသော properties စစ်ဆေးခြင်း) ကို ခံရပါတယ်။ Object literal တစ်ခုမှာ "target type" မှာ မရှိတဲ့ properties တွေ ပါနေရင် — error တစ်ခု ရပါလိမ့်မယ်:

```ts twoslash
// @errors: 2345 2739
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
// ---cut---
let mySquare = createSquare({ colour: "red", width: 100 });
```

ဒီ checks တွေကို ရှောင်ကွင်းတာက တကယ်တော့ အရမ်း ရိုးရှင်းပါတယ်။ အလွယ်ဆုံး နည်းလမ်းက type assertion တစ်ခုကို သုံးရုံပါပဲ:

```ts twoslash
// @errors: 2345 2739
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
// ---cut---
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

ဒါပေမယ့် — object မှာ တစ်နည်းနည်းနဲ့ အသုံးပြုတဲ့ အပို properties တစ်ချို့ ရှိနိုင်တာကို သေချာရင် — string index signature တစ်ခု ထည့်တာက ပိုကောင်းတဲ့ ချဉ်းကပ်နည်း ဖြစ်နိုင်ပါတယ်။ `SquareConfig` မှာ အပေါ်က types တွေနဲ့ `color` နဲ့ `width` properties တွေ ရှိနိုင်ပေမယ့် — တခြား properties တွေ ဘယ်နှစ်ခုမဆို _လည်း_ ရှိနိုင်မယ်ဆိုရင် — ၎င်းကို ဒီလိုမျိုး သတ်မှတ်နိုင်ပါတယ်:

```ts twoslash
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}
```

Index signatures တွေကို နည်းနည်းကြာရင် ဆွေးနွေးပါမယ် — ဒါပေမယ့် ဒီမှာ `SquareConfig` တစ်ခုက properties ဘယ်နှစ်ခုမဆို ရှိနိုင်ပြီး — ၎င်းတို့က `color` ဒါမှမဟုတ် `width` မဟုတ်သရွေ့ — သူတို့ရဲ့ types တွေက အရေးမကြီးဘူးလို့ ပြောနေတာပါ။

ဒီ checks တွေကို ရှောင်ကွင်းဖို့ နောက်ဆုံး နည်းလမ်းတစ်ခုကတော့ — နည်းနည်း အံ့သြစရာ ကောင်းနိုင်ပေမယ့် — object ကို တခြား variable တစ်ခုဆီ assign လုပ်ခြင်းပါ: `squareOptions` က excess property checks တွေကို မခံရတာမို့ — compiler က error ပေးမှာ မဟုတ်ပါဘူး။

```ts twoslash
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}
// ---cut---
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

အပေါ်က ရှောင်ကွင်းနည်းက — `squareOptions` နဲ့ `SquareConfig` အကြားမှာ ဘုံ (common) property တစ်ခု ရှိနေသရွေ့ အလုပ်လုပ်ပါတယ်။ ဒီဥပမာမှာ — ၎င်းက `width` property ပါ။ ဒါပေမယ့် — variable မှာ ဘယ်ဘုံ object property မှ မရှိရင်တော့ ကျရှုံးပါလိမ့်မယ်။ ဥပမာ:

```ts twoslash
// @errors: 2559
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
// ---cut---
let squareOptions = { colour: "red" };
let mySquare = createSquare(squareOptions);
```

အပေါ်ကလို ရိုးရှင်းတဲ့ code တွေအတွက်ဆိုရင် — ဒီ checks တွေကို "ရှောင်ကွင်း" ဖို့ မကြိုးစားသင့်ဘူးဆိုတာ စိတ်ထဲမှာ ထားပါ။ Methods တွေ ပါပြီး state တွေ ထိန်းထားတဲ့ ပိုရှုပ်ထွေးတဲ့ object literals တွေအတွက်တော့ — ဒီနည်းလမ်းတွေကို စိတ်ထဲမှာ ထားဖို့ လိုနိုင်ပါတယ် — ဒါပေမယ့် excess property errors အများစုက တကယ်တော့ bugs တွေပါ။ ဆိုလိုတာက — option bags လိုအရာတွေအတွက် excess property checking ပြဿနာတွေ ကြုံနေရရင် — သင့်ရဲ့ type declarations တစ်ချို့ကို ပြန်ပြီး ပြင်ဆင်ဖို့ လိုနိုင်ပါတယ်။ ဒီအခြေအနေမှာ — `color` ဒါမှမဟုတ် `colour` property နှစ်ခုလုံးထဲက တစ်ခုခုပါတဲ့ object ကို `createSquare` ဆီ ထည့်ပေးတာ အဆင်ပြေတယ်ဆိုရင် — အဲဒါကို ထင်ဟပ်စေဖို့ `SquareConfig` ရဲ့ အဓိပ္ပါယ်ဖွင့်ဆိုချက်ကို ပြင်ဆင်သင့်ပါတယ်။

## Function Types (Function Types များ)

Interfaces တွေက — JavaScript objects တွေ ယူနိုင်တဲ့ ကျယ်ပြန့်တဲ့ shapes (ပုံသဏ္ဍာန်များ) တွေကို ဖော်ပြနိုင်စွမ်း ရှိပါတယ်။ Properties တွေပါတဲ့ object တစ်ခုကို ဖော်ပြတာအပြင် — interfaces တွေက function types တွေကိုလည်း ဖော်ပြနိုင်စွမ်း ရှိပါတယ်။

Interface တစ်ခုနဲ့ function type တစ်ခုကို ဖော်ပြဖို့ — interface ကို call signature တစ်ခု ပေးပါတယ်။ ဒါက — parameter list နဲ့ return type ကိုပဲ ပေးထားတဲ့ function declaration တစ်ခုနဲ့ တူပါတယ်။ Parameter list ထဲက parameter တစ်ခုချင်းစီမှာ — နာမည်ရော type ပါ နှစ်ခုလုံး လိုအပ်ပါတယ်။

```ts twoslash
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

သတ်မှတ်ပြီးတာနဲ့ — ဒီ function type interface ကို တခြား interfaces တွေလိုပဲ သုံးနိုင်ပါတယ်။ ဒီမှာ — function type တစ်ခုရဲ့ variable တစ်ခုကို ဖန်တီးပြီး — type တူညီတဲ့ function value တစ်ခုကို ၎င်းဆီ ဘယ်လို assign လုပ်မလဲဆိုတာ ပြထားပါတယ်။

```ts twoslash
interface SearchFunc {
  (source: string, subString: string): boolean;
}
// ---cut---
let mySearch: SearchFunc;

mySearch = function (source: string, subString: string): boolean {
  let result = source.search(subString);
  return result > -1;
};
```

Function types တွေ မှန်ကန်စွာ type check ဖြစ်ဖို့ — parameters တွေရဲ့ နာမည်တွေ တူညီနေဖို့ မလိုပါဘူး။ ဥပမာ — အပေါ်က ဥပမာကို ဒီလိုမျိုးလည်း ရေးနိုင်ခဲ့ပါတယ်:

```ts twoslash
interface SearchFunc {
  (source: string, subString: string): boolean;
}
// ---cut---
let mySearch: SearchFunc;

mySearch = function (src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
};
```

Function parameters တွေကို တစ်ခုချင်းစီ စစ်ဆေးပြီး — တစ်ခုနဲ့တစ်ခု သက်ဆိုင်တဲ့ parameter နေရာတွေက types တွေကို အပြန်အလှန် စစ်ဆေးပါတယ်။ Types တွေကို လုံးဝ သတ်မှတ်ချင်မှာ မဟုတ်ဘူးဆိုရင် — function value ကို `SearchFunc` type ရဲ့ variable တစ်ခုဆီ တိုက်ရိုက် assign လုပ်ထားတာမို့ — TypeScript ရဲ့ contextual typing က argument types တွေကို infer လုပ်နိုင်ပါတယ်။ ဒီမှာ — function expression ရဲ့ return type ကလည်း — ၎င်း return လုပ်တဲ့ values တွေ (ဒီမှာ `false` နဲ့ `true`) ကနေ အနုအငြမ်း သိရှိနိုင်ပါတယ်။

```ts twoslash
interface SearchFunc {
  (source: string, subString: string): boolean;
}
// ---cut---
let mySearch: SearchFunc;

mySearch = function (src, sub) {
  let result = src.search(sub);
  return result > -1;
};
```

Function expression က numbers ဒါမှမဟုတ် strings တွေကို return လုပ်ခဲ့မယ်ဆိုရင် — type checker က return type ဟာ `SearchFunc` interface ထဲမှာ ဖော်ပြထားတဲ့ return type နဲ့ မကိုက်ညီဘူးဆိုတဲ့ error တစ်ခုကို ပေးခဲ့မှာပါ။

```ts twoslash
// @errors: 2322
interface SearchFunc {
  (source: string, subString: string): boolean;
}
// ---cut---
let mySearch: SearchFunc;

mySearch = function (src, sub) {
  let result = src.search(sub);
  return "string";
};
```

## Indexable Types (Indexable Types များ)

Function types တွေကို ဖော်ပြဖို့ interfaces တွေ သုံးနိုင်သလိုပဲ — `a[10]` ဒါမှမဟုတ် `ageMap["daniel"]` လို "index လုပ်ဝင်ရောက်လို့ရတဲ့" types တွေကိုလည်း ဖော်ပြနိုင်ပါတယ်။ Indexable types တွေမှာ — object ထဲကို index လုပ်ဖို့ သုံးနိုင်တဲ့ types တွေကို — index လုပ်တဲ့အခါ သက်ဆိုင်တဲ့ return types တွေနဲ့တကွ ဖော်ပြတဲ့ _index signature_ တစ်ခု ရှိပါတယ်။

ဥပမာတစ်ခု ကြည့်ရအောင်:

```ts twoslash
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

အပေါ်မှာ — index signature ပါတဲ့ `StringArray` interface တစ်ခု ရှိပါတယ်။ ဒီ index signature က — `StringArray` တစ်ခုကို `number` တစ်ခုနဲ့ index လုပ်တဲ့အခါ — `string` တစ်ခုကို return လုပ်မယ်လို့ ဖော်ပြထားပါတယ်။

ထောက်ပံ့ထားတဲ့ index signatures တွေမှာ type လေးမျိုး ရှိပါတယ်: string, number, symbol နဲ့ template strings တို့ပါ။ Indexers အမျိုးမျိုးကို ထောက်ပံ့ဖို့ ဖြစ်နိုင်ပေမယ့် — numeric indexer တစ်ခုကနေ return လုပ်တဲ့ type က string indexer ကနေ return လုပ်တဲ့ type ရဲ့ subtype ဖြစ်ရပါတယ်။

ဒါက — `number` တစ်ခုနဲ့ index လုပ်တဲ့အခါ — JavaScript က object ထဲကို index မလုပ်ခင် အဲဒါကို `string` တစ်ခုအဖြစ် တကယ်တမ်း ပြောင်းလိုက်လို့ပါ။ ဆိုလိုတာက — `100` (a `number`) နဲ့ index လုပ်တာက `"100"` (a `string`) နဲ့ index လုပ်တာနဲ့ အတူတူပဲ ဖြစ်လို့ — နှစ်ခုက တစ်သမတ်တည်း ဖြစ်ဖို့ လိုပါတယ်။

```ts twoslash
// @errors: 2413
// @strictPropertyInitialization: false
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Error: indexing with a numeric string might get you a completely separate type of Animal!
interface NotOkay {
  [x: number]: Animal;
  [x: string]: Dog;
}
```

String index signatures တွေက "dictionary" pattern ကို ဖော်ပြဖို့ အစွမ်းထက်တဲ့ နည်းလမ်းတစ်ခု ဖြစ်ပေမယ့် — properties တွေ အားလုံး ၎င်းတို့ရဲ့ return type နဲ့ ကိုက်ညီဖို့လည်း ၎င်းတို့က အတင်းအကျပ် စစ်ဆေးပါတယ်။ ဒါက — string index တစ်ခုက `obj.property` ကို `obj["property"]` အနေနဲ့လည်း ရနိုင်တယ်လို့ ကြေညာလို့ပါ။ အောက်က ဥပမာမှာ — `name` ရဲ့ type က string index ရဲ့ type နဲ့ မကိုက်ညီလို့ — type checker က error ပေးပါတယ်:

```ts twoslash
// @errors: 2411
interface NumberDictionary {
  [index: string]: number;

  length: number; // ok, length is a number
  name: string; // error, the type of 'name' is not a subtype of the indexer
}
```

ဒါပေမယ့် — index signature က property types တွေရဲ့ union တစ်ခုဆိုရင်တော့ — type အမျိုးမျိုးရှိတဲ့ properties တွေက လက်ခံနိုင်ပါတယ်:

```ts twoslash
interface NumberOrStringDictionary {
  [index: string]: number | string;

  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```

နောက်ဆုံးအနေနဲ့ — index signatures တွေကို `readonly` လုပ်ထားခြင်းအားဖြင့် ၎င်းတို့ရဲ့ indices တွေဆီ assign လုပ်ခြင်းကို တားဆီးနိုင်ပါတယ်:

```ts twoslash
// @errors: 2542
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // error!
```

Index signature က `readonly` ဖြစ်လို့ — `myArray[2]` ကို သတ်မှတ်လို့ မရပါဘူး။

### Indexable Types with Template Strings (Template Strings ပါသော Indexable Types)

Template string တစ်ခုကို — တိကျတဲ့ pattern တစ်ခုကို ခွင့်ပြုကြောင်း — ဒါပေမယ့် အားလုံးကို မဟုတ်ဘူးဆိုတာ ဖော်ပြဖို့ သုံးနိုင်ပါတယ်။ ဥပမာ — HTTP headers object တစ်ခုမှာ သိထားတဲ့ headers တွေရဲ့ သတ်မှတ်ထားတဲ့ စာရင်းတစ်ခု ရှိနိုင်ပြီး — `x-` နဲ့ ရှေ့ဆွဲထားတဲ့ [ကိုယ်ပိုင် သတ်မှတ်ထားသော properties](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) တွေကိုလည်း ထောက်ပံ့နိုင်ပါတယ်။

```ts twoslash
// @errors: 2339

interface HeadersResponse {
  "content-type": string,
  date: string,
  "content-length": string

  // Permit any property starting with 'x-'.
  [headerName: `x-${string}`]: string;
}

function handleResponse(r: HeadersResponse) {
  // Handle known, and x- prefixed
  const type = r["content-type"]
  const poweredBy = r["x-powered-by"]

  // Unknown keys without the prefix raise errors
  const origin = r.origin
}
```

## Class Types (Class Types များ)

### Implementing an interface (Interface တစ်ခုကို Implement လုပ်ခြင်း)

C# နဲ့ Java လို languages တွေမှာ interfaces တွေရဲ့ အသုံးအများဆုံး နည်းလမ်းတွေထဲက တစ်ခုဖြစ်တဲ့ — class တစ်ခုက သတ်မှတ်ထားတဲ့ contract တစ်ခုကို ပြည့်မီကြောင်း ရှင်းရှင်းလင်းလင်း အတင်းအကျပ် စစ်ဆေးခြင်းကို — TypeScript မှာလည်း လုပ်နိုင်ပါတယ်။

```ts twoslash
interface ClockInterface {
  currentTime: Date;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  constructor(h: number, m: number) {}
}
```

Interface တစ်ခုထဲမှာ — အောက်က ဥပမာမှာ `setTime` နဲ့ လုပ်ထားသလို — class ထဲမှာ implement လုပ်တဲ့ methods တွေကိုလည်း ဖော်ပြနိုင်ပါတယ်:

```ts twoslash
// @strictPropertyInitialization: false
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
```

Interfaces တွေက class ရဲ့ public side နဲ့ private side နှစ်ခုလုံးကို မဟုတ်ဘဲ — public side ကိုပဲ ဖော်ပြပါတယ်။ ဒါက — class instance ရဲ့ private side အတွက် သတ်မှတ်ထားတဲ့ types တွေ class မှာ ရှိမရှိ စစ်ဆေးဖို့ — interfaces တွေကို သုံးခြင်းကနေ တားဆီးပါတယ်။

### Difference between the static and instance sides of classes (Classes များရဲ့ Static နဲ့ Instance Sides အကြား ကွာခြားချက်)

Classes နဲ့ interfaces တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — class တစ်ခုမှာ type _နှစ်မျိုး_ ရှိတယ်ဆိုတာ စိတ်ထဲမှာ ထားထားဖို့ အထောက်အကူ ဖြစ်ပါတယ်: static side ရဲ့ type နဲ့ instance side ရဲ့ type ပါ။ Construct signature တစ်ခုပါတဲ့ interface တစ်ခုကို ဖန်တီးပြီး — ဒီ interface ကို implements တဲ့ class တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားရင် error တစ်ခု ရတာကို သတိထားမိနိုင်ပါတယ်:

```ts twoslash
// @errors: 7013 2420 2564
// @strictPropertyInitialization: false
// @noImplicitAny: false
interface ClockConstructor {
  new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
  currentTime: Date;
  constructor(h: number, m: number) {}
}
```

ဒါက — class တစ်ခုက interface တစ်ခုကို implements လုပ်တဲ့အခါ — class ရဲ့ instance side ကိုပဲ စစ်ဆေးလို့ပါ။ Constructor က static side မှာ ရှိတာမို့ — ဒီစစ်ဆေးမှုထဲမှာ မပါဝင်ပါဘူး။

အစား — class ရဲ့ static side နဲ့ တိုက်ရိုက် အလုပ်လုပ်ဖို့ လိုပါတယ်။ ဒီဥပမာမှာ — constructor အတွက် `ClockConstructor` နဲ့ instance methods တွေအတွက် `ClockInterface` ဆိုတဲ့ interfaces နှစ်ခုကို သတ်မှတ်ပါတယ်။ ပြီးတော့ — အဆင်ပြေစေဖို့ — ကိုယ့်ဆီ ပေးပို့လိုက်တဲ့ type ရဲ့ instances တွေကို ဖန်တီးပေးတဲ့ constructor function `createClock` တစ်ခုကို သတ်မှတ်ပါတယ်:

```ts twoslash
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
  tick(): void;
}

function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
}

class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

`createClock` ရဲ့ ပထမ parameter က `ClockConstructor` type ဖြစ်တာမို့ — `createClock(AnalogClock, 7, 32)` ထဲမှာ — `AnalogClock` မှာ မှန်ကန်တဲ့ constructor signature ရှိမရှိ စစ်ဆေးပါတယ်။

နောက်ထပ် ရိုးရှင်းတဲ့ နည်းလမ်းတစ်ခုက class expressions တွေကို သုံးခြင်းပါ:

```ts twoslash
// @strictPropertyInitialization: false
// @noImplicitAny: false
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
  tick(): void;
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
};

let clock = new Clock(12, 17);
clock.tick();
```

## Extending Interfaces (Interfaces များကို Extend လုပ်ခြင်း)

Classes တွေလိုပဲ — interfaces တွေက တစ်ခုကိုတစ်ခု extend လုပ်နိုင်ပါတယ်။ ဒါက — interface တစ်ခုရဲ့ members တွေကို နောက်တစ်ခုဆီ ကူးယူနိုင်စေပြီး — interfaces တွေကို reusable components တွေအဖြစ် ခွဲခြားတဲ့နေရာမှာ ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် ဖြစ်စေပါတယ်။

```ts twoslash
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
```

Interface တစ်ခုက interfaces အများကြီးကို extend လုပ်ပြီး — interfaces တွေ အားလုံးရဲ့ ပေါင်းစပ်မှုတစ်ခုကို ဖန်တီးနိုင်ပါတယ်။

```ts twoslash
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

## Hybrid Types (Hybrid Types များ)

အစောပိုင်းမှာ ဖော်ပြခဲ့သလိုပဲ — interfaces တွေက လက်တွေ့ကမ္ဘာ့ JavaScript ထဲမှာ ရှိနေတဲ့ ကြွယ်ဝတဲ့ types တွေကို ဖော်ပြနိုင်ပါတယ်။ JavaScript ရဲ့ dynamic ဖြစ်ပြီး ပြောင်းလွယ်ပြင်လွယ် ရှိတဲ့ သဘောသဘာဝကြောင့် — အပေါ်မှာ ဖော်ပြခဲ့တဲ့ types တစ်ချို့ရဲ့ ပေါင်းစပ်မှုတစ်ခုအနေနဲ့ အလုပ်လုပ်တဲ့ object တစ်ခုကို ရံဖန်ရံခါ ကြုံတွေ့နိုင်ပါတယ်။

ဒီလိုဥပမာတစ်ခုက — function တစ်ခုရော object တစ်ခုရော နှစ်ခုလုံးအနေနဲ့ ပြုမူပြီး — အပို properties တွေပါ ပါတဲ့ object တစ်ခုပါ:

```ts twoslash
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function (start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function () {};
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

3rd-party (တတိယပါတီ) JavaScript တွေနဲ့ အပြန်အလှန် ဆက်သွယ်တဲ့အခါ — type ရဲ့ shape ကို အပြည့်အဝ ဖော်ပြဖို့ အပေါ်ကလို patterns တွေကို သုံးဖို့ လိုအပ်နိုင်ပါတယ်။

## Interfaces Extending Classes (Classes များကို Extend လုပ်သော Interfaces)

Interface type တစ်ခုက class type တစ်ခုကို extend လုပ်တဲ့အခါ — class ရဲ့ members တွေကို အမွေဆက်ခံပေမယ့် — ၎င်းတို့ရဲ့ implementations တွေကိုတော့ မရပါဘူး။ Interface က class ရဲ့ members တွေ အားလုံးကို implementation တစ်ခုမှ မပေးဘဲ ကြေညာထားသလိုမျိုးပါ။ Interfaces တွေက base class တစ်ခုရဲ့ private နဲ့ protected members တွေတောင် အမွေဆက်ခံပါတယ်။ ဆိုလိုတာက — private ဒါမှမဟုတ် protected members တွေပါတဲ့ class တစ်ခုကို extend တဲ့ interface တစ်ခုကို ဖန်တီးတဲ့အခါ — အဲဒီ interface type ကို အဲဒီ class ဒါမှမဟုတ် ၎င်းရဲ့ subclass တစ်ခုကပဲ implement လုပ်နိုင်ပါတယ်။

ကြီးမားတဲ့ inheritance hierarchy (အမွေဆက်ခံမှု အဆင့်ဆင့်) တစ်ခု ရှိပြီး — သင့်ရဲ့ code က properties တစ်ချို့ ရှိတဲ့ subclasses တွေနဲ့ပဲ အလုပ်လုပ်ဖို့ သတ်မှတ်ချင်တဲ့အခါ ဒါ အသုံးဝင်ပါတယ်။ Subclasses တွေက base class ကနေ အမွေဆက်ခံတာအပြင် တစ်ခုနဲ့တစ်ခု ဆက်စပ်နေဖို့ မလိုပါဘူး။ ဥပမာ:

```ts twoslash
// @errors: 2300 2420 2300
class Control {
  private state: any;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select() {}
}

class TextBox extends Control {
  select() {}
}

class ImageControl implements SelectableControl {
  private state: any;
  select() {}
}
```

အပေါ်က ဥပမာမှာ — `SelectableControl` က private `state` property အပါအဝင် `Control` ရဲ့ members တွေ အားလုံး ပါဝင်ပါတယ်။ `state` က private member ဖြစ်တာမို့ — `SelectableControl` ကို `Control` ရဲ့ descendants (ဆင်းသက်လာသော class များ) တွေကပဲ implement လုပ်နိုင်ပါတယ်။ ဒါက — private members တွေ compatible ဖြစ်ဖို့ လိုအပ်ချက်ဖြစ်တဲ့ — တူညီတဲ့ declaration ကနေ ဆင်းသက်လာတဲ့ `state` private member တစ်ခု — `Control` ရဲ့ descendants တွေမှာပဲ ရှိလို့ပါ။

`Control` class အတွင်းမှာတော့ — `SelectableControl` ရဲ့ instance တစ်ခုကတစ်ဆင့် `state` private member ကို ဝင်ရောက်နိုင်ပါတယ်။ ထိရောက်စွာ ပြောရရင် — `SelectableControl` က `select` method ရှိတယ်လို့ သိထားရတဲ့ `Control` တစ်ခုလို ပြုမူပါတယ်။ `Button` နဲ့ `TextBox` classes တွေက `SelectableControl` ရဲ့ subtypes တွေပါ (သူတို့ နှစ်ခုလုံးက `Control` ကနေ အမွေဆက်ခံပြီး `select` method ရှိလို့ပါ)။ `ImageControl` class ကတော့ `Control` ကို extend လုပ်တာမဟုတ်ဘဲ ကိုယ်ပိုင် `state` private member ရှိတာမို့ — `SelectableControl` ကို implement လုပ်လို့ မရပါဘူး။
