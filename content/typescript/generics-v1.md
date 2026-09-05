---
title: "Generics (Generic များ)"
description: "Generic function တွေ, type variable တွေ, generic interfaces/classes တွေ ဆိုတာ ဘာလဲ — identity function ကစပြီး — constraints တွေနဲ့ class types တွေသုံးပြီး generic type တွေကို ကန့်သတ်ခြင်းအထိ ဥပမာများနဲ့တကွ ရှင်းလင်းချက်"
order: 77
source: "https://www.typescriptlang.org/docs/handbook/generics.html"
status: translated
updated: 2026-09-05
---

Software engineering ရဲ့ အဓိက အစိတ်အပိုင်းတစ်ခုက — ကောင်းကောင်း သတ်မှတ်ထားပြီး တစ်သမတ်တည်း ဖြစ်တဲ့ API တွေ ရှိရုံသာမက — ပြန်လည် အသုံးပြုလို့ရတဲ့ (reusable) components တွေကို တည်ဆောက်ခြင်းပါ။ ဒီနေ့ရဲ့ data တွေအပြင် နောက်နောင်ရဲ့ data တွေနဲ့ပါ အလုပ်လုပ်နိုင်တဲ့ components တွေက — ကြီးမားတဲ့ software systems တွေကို တည်ဆောက်ရာမှာ အလိုအပ်ဆုံး ပြောင်းလွယ်ပြင်လွယ် (flexible) စွမ်းရည်တွေကို သင့်အား ပေးပါလိမ့်မယ်။

C# နဲ့ Java လို languages တွေမှာ — reusable components တွေ ဖန်တီးဖို့ ကိရိယာ သေတ္တာထဲက အဓိက ကိရိယာတွေထဲက တစ်ခုက _generics_ ပါ — ဆိုလိုတာက type တစ်ခုတည်းအတွက်မဟုတ်ဘဲ type အမျိုးမျိုးနဲ့ အလုပ်လုပ်နိုင်တဲ့ component တစ်ခုကို ဖန်တီးနိုင်ခြင်းပါ။ ဒါက users တွေကို — ဒီ components တွေကို သုံးပြီး သူတို့ကိုယ်ပိုင် types တွေနဲ့ သုံးစွဲခွင့် ပေးပါတယ်။

## Hello World of Generics (Generics ရဲ့ Hello World)

စလိုက်ဖို့ — generics ရဲ့ "hello world" ဖြစ်တဲ့ identity function ကို လုပ်ကြည့်ရအောင်။ Identity function ဆိုတာ — ဘာပဲ ထည့်ပေးလဲ အဲဒါကိုပဲ ပြန်ပေးတဲ့ function တစ်ခုပါ။ ဒါကို `echo` command နဲ့ ဆင်တူတယ်လို့ ထင်မှတ်နိုင်ပါတယ်။

Generics မသုံးဘဲနဲ့ဆိုရင် — identity function ကို တိကျတဲ့ type တစ်ခု ပေးရပါမယ်:

```ts twoslash
function identity(arg: number): number {
  return arg;
}
```

ဒါမှမဟုတ် — `any` type ကို သုံးပြီး identity function ကို ဖော်ပြနိုင်ပါတယ်:

```ts twoslash
function identity(arg: any): any {
  return arg;
}
```

`any` သုံးတာက — function က `arg` ရဲ့ type အတွက် ဘယ် type ကိုမဆို လက်ခံဖို့ ဖြစ်စေတဲ့အတွက် generic ဆန်တာ အမှန်ပါပဲ — ဒါပေမယ့် — function က return လုပ်တဲ့အခါ အဲဒီ type က ဘာလဲဆိုတဲ့ အချက်အလက်ကို ကျွန်တော်တို့ တကယ်တမ်း ဆုံးရှုံးနေပါတယ်။ `number` တစ်ခု ထည့်လိုက်ရင် — ကျွန်တော်တို့မှာ ရှိတဲ့ တစ်ခုတည်းသော အချက်အလက်က — ဘယ် type မဆို return လုပ်နိုင်တယ်ဆိုတာပဲ ဖြစ်ပါတယ်။

ဒီအစား — argument ရဲ့ type ကို ဖမ်းယူပြီး — ဘာကို return လုပ်နေလဲ ဖော်ပြဖို့လည်း ပြန်သုံးနိုင်မယ့် နည်းလမ်းတစ်ခု လိုအပ်ပါတယ်။ ဒီမှာ — values တွေပေါ်မဟုတ်ဘဲ types တွေပေါ် အလုပ်လုပ်တဲ့ အထူး variable အမျိုးအစား — _type variable_ တစ်ခုကို သုံးပါမယ်။

```ts twoslash
function identity<T>(arg: T): T {
  return arg;
}
```

အခု identity function ထဲမှာ type variable `T` တစ်ခု ထည့်လိုက်ပါပြီ။ ဒီ `T` က — user က ပေးလိုက်တဲ့ type (ဥပမာ — `number`) ကို ဖမ်းယူနိုင်စေပြီး — အဲဒီ အချက်အလက်ကို နောက်မှ သုံးနိုင်စေပါတယ်။ ဒီမှာ `T` ကို return type အဖြစ် ထပ်သုံးပါတယ်။ စစ်ဆေးကြည့်ရင် — argument နဲ့ return type နှစ်ခုလုံးအတွက် type တစ်ခုတည်း သုံးထားတာကို အခု တွေ့နိုင်ပါတယ်။ ဒါက — function ရဲ့ တစ်ဖက်ကနေ ဝင်ပြီး နောက်တစ်ဖက်ကနေ ထွက်တဲ့ သယ်ယူပို့ဆောင်ရေးလမ်းကြောင်းလိုမျိုး — type အချက်အလက်ကို သယ်ဆောင်နိုင်စေပါတယ်။

ဒီ `identity` function version က — types အမျိုးမျိုးအပေါ် အလုပ်လုပ်တာမို့ generic ဖြစ်တယ်လို့ ပြောပါတယ်။ `any` သုံးတာနဲ့ မတူဘဲ — ဒါက argument နဲ့ return type အတွက် numbers တွေ သုံးခဲ့တဲ့ ပထမ `identity` function လိုပဲ — အတိအကျ (ဆိုလိုတာက — ဘာအချက်အလက်မှ မဆုံးရှုံးဘူး) ဖြစ်ပါတယ်။

Generic identity function ကို ရေးပြီးတာနဲ့ — နည်း နှစ်နည်းထဲက တစ်နည်းနဲ့ ၎င်းကို ခေါ်နိုင်ပါတယ်။ ပထမနည်းက — type argument အပါအဝင် arguments တွေ အားလုံးကို function ဆီ ပေးပို့တာပါ:

```ts twoslash
function identity<T>(arg: T): T {
  return arg;
}
// ---cut---
let output = identity<string>("myString");
//       ^?
```

ဒီမှာ function call ရဲ့ arguments တွေကို `()` မဟုတ်ဘဲ `<>` တွေနဲ့ ပတ်ပြီး — `T` ကို arguments တွေထဲက တစ်ခုအနေနဲ့ `string` အဖြစ် ရှင်းရှင်းလင်းလင်း (explicitly) သတ်မှတ်ထားပါတယ်။

ဒုတိယနည်းကတော့ ဖြစ်နိုင်ခြေ အများဆုံး နည်းလည်း ဖြစ်ပါတယ်။ ဒီမှာ _type argument inference_ ကို သုံးပါတယ် — ဆိုလိုတာက — ကျွန်တော်တို့ ထည့်လိုက်တဲ့ argument ရဲ့ type ကို အခြေခံပြီး compiler က `T` ရဲ့ တန်ဖိုးကို ကျွန်တော်တို့အတွက် အလိုအလျောက် သတ်မှတ်ပေးစေချင်တာပါ:

```ts twoslash
function identity<T>(arg: T): T {
  return arg;
}
// ---cut---
let output = identity("myString");
//       ^?
```

ကျွန်တော်တို့က angle brackets (`<>`) ထဲမှာ type ကို ရှင်းရှင်းလင်းလင်း ထည့်ပေးစရာ မလိုခဲ့တာ သတိပြုပါ — compiler က `"myString"` ဆိုတဲ့ တန်ဖိုးကို ကြည့်ပြီး `T` ကို ၎င်းရဲ့ type အဖြစ် သတ်မှတ်လိုက်ရုံပါပဲ။ Type argument inference က — code တွေကို ပိုတိုပြီး ပိုဖတ်လို့ကောင်းအောင် ထားဖို့ အသုံးဝင်တဲ့ ကိရိယာတစ်ခု ဖြစ်နိုင်ပေမယ့် — ပိုရှုပ်ထွေးတဲ့ ဥပမာတွေမှာ ဖြစ်လေ့ရှိသလို — compiler က type ကို infer လုပ်ဖို့ ပျက်ကွက်တဲ့အခါ — အရင်က ဥပမာမှာ လုပ်ခဲ့သလို type arguments တွေကို ရှင်းရှင်းလင်းလင်း ထည့်ပေးဖို့ လိုအပ်နိုင်ပါတယ်။

## Working with Generic Type Variables (Generic Type Variables များနဲ့ အလုပ်လုပ်ခြင်း)

Generics တွေကို စသုံးတဲ့အခါ — `identity` လို generic functions တွေ ဖန်တီးတဲ့အခါ — compiler က function ရဲ့ body ထဲမှာ generically typed parameters တွေကို မှန်မှန်ကန်ကန် သုံးဖို့ အတင်းအကျပ် စစ်ဆေးတာကို သတိထားမိပါလိမ့်မယ်။ ဆိုလိုတာက — ဒီ parameters တွေကို ဘယ် type မဆို ဖြစ်နိုင်သလိုမျိုး တကယ်တမ်း ဆက်ဆံဖို့ပါ။

အစောပိုင်းက ကျွန်တော်တို့ရဲ့ `identity` function ကို ပြန်ကြည့်ရအောင်:

```ts twoslash
function identity<T>(arg: T): T {
  return arg;
}
```

ခေါ်မှုတိုင်းမှာ argument `arg` ရဲ့ length ကိုပါ console မှာ log လုပ်ချင်ရင် ဘယ်လိုလုပ်မလဲ? ဒီလိုမျိုး ရေးချင်စိတ် ဖြစ်နိုင်ပါတယ်:

```ts twoslash
// @errors: 2339
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

ဒီလို လုပ်တဲ့အခါ — compiler က `arg` ရဲ့ `.length` member ကို သုံးနေတာမို့ error ပေးပါလိမ့်မယ် — ဒါပေမယ့် `arg` မှာ ဒီ member ရှိတယ်လို့ ဘယ်နေရာမှာမှ ကျွန်တော်တို့ မပြောထားပါဘူး။ အစောပိုင်းမှာ ပြောခဲ့သလိုပဲ — ဒီ type variables တွေက ဘယ် type မဆို ကိုယ်စားပြုတာမို့ — ဒီ function ကို သုံးတဲ့သူတစ်ယောက်က `.length` member မရှိတဲ့ `number` တစ်ခုကို အစား ထည့်လိုက်နိုင်တယ်ဆိုတာ သတိရပါ။

ဒီ function ကို `T` တိုက်ရိုက်ပေါ်မဟုတ်ဘဲ — `T` တွေရဲ့ arrays တွေပေါ်မှာ အလုပ်လုပ်ဖို့ ရည်ရွယ်ထားတယ်လို့ ဆိုကြပါစို့။ Arrays တွေနဲ့ အလုပ်လုပ်နေတာမို့ — `.length` member က ရရှိနိုင်သင့်ပါတယ်။ ဒါကို — types အခြားတစ်ခုရဲ့ arrays တွေ ဖန်တီးသလိုပဲ ဖော်ပြနိုင်ပါတယ်:

```ts twoslash
function loggingIdentity<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}
```

`loggingIdentity` ရဲ့ type ကို — "generic function `loggingIdentity` က type parameter `T` တစ်ခုနဲ့ — `T` တွေရဲ့ array တစ်ခု ဖြစ်တဲ့ argument `arg` ကို လက်ခံပြီး — `T` တွေရဲ့ array တစ်ခုကို return လုပ်တယ်" ဆိုပြီး ဖတ်နိုင်ပါတယ်။ Numbers တွေရဲ့ array တစ်ခု ထည့်လိုက်ရင် — `T` က `number` ကို bind (ဆက်စပ်) လုပ်တာမို့ — numbers တွေရဲ့ array တစ်ခုကို ပြန်ရပါလိမ့်မယ်။ ဒါက — ကျွန်တော်တို့ရဲ့ generic type variable `T` ကို — type တစ်ခုလုံးအဖြစ်မဟုတ်ဘဲ — အလုပ်လုပ်နေတဲ့ types တွေရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ သုံးနိုင်စေပြီး — ပိုပြီး ပြောင်းလွယ်ပြင်လွယ် ဖြစ်စေပါတယ်။

ဒီဥပမာကိုပဲ တခြားနည်းနဲ့လည်း ရေးနိုင်ပါတယ်:

```ts twoslash
function loggingIdentity<T>(arg: Array<T>): Array<T> {
  console.log(arg.length); // Array has a .length, so no more error
  return arg;
}
```

ဒီ style type ကို တခြား languages တွေကနေ သင်ရင်းနှီးပြီးသား ဖြစ်နိုင်ပါတယ်။ နောက် section မှာ — `Array<T>` လို ကိုယ်ပိုင် generic types တွေကို ဘယ်လို ဖန်တီးမလဲဆိုတာ ဖော်ပြပါမယ်။

## Generic Types (Generic Types များ)

အရင် sections တွေမှာ — types အမျိုးမျိုးအပေါ် အလုပ်လုပ်တဲ့ generic identity functions တွေကို ဖန်တီးခဲ့ပါတယ်။ ဒီ section မှာ — function တွေကိုယ်တိုင်ရဲ့ type နဲ့ — generic interfaces တွေကို ဘယ်လို ဖန်တီးမလဲဆိုတာကို လေ့လာပါမယ်။

Generic functions တွေရဲ့ type က — function declarations တွေမှာ ပြုလုပ်သလိုပဲ type parameters တွေကို ရှေ့ဆုံးမှာ စာရင်းပြုထားတဲ့ — non-generic functions တွေရဲ့ type တွေနဲ့ ဆင်တူပါတယ်:

```ts twoslash
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
```

Type variables အရေအတွက်နဲ့ — type variables တွေကို သုံးပုံတွေ ကိုက်ညီနေသရွေ့ — type ထဲမှာ generic type parameter အတွက် နာမည် အခြားတစ်ခုကိုလည်း သုံးနိုင်ပါတယ်။

```ts twoslash
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
```

Generic type ကို object literal type တစ်ခုရဲ့ call signature အဖြစ်လည်း ရေးနိုင်ပါတယ်:

```ts twoslash
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: { <T>(arg: T): T } = identity;
```

ဒါက ကျွန်တော်တို့ရဲ့ ပထမဆုံး generic interface ကို ရေးဖို့ ဦးတည်ပေးပါတယ်။ အရင် ဥပမာက object literal ကို ယူပြီး interface တစ်ခုဆီ ရွှေ့လိုက်ရအောင်:

```ts twoslash
interface GenericIdentityFn {
  <T>(arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

ဆင်တူတဲ့ ဥပမာတစ်ခုမှာ — generic parameter ကို interface တစ်ခုလုံးရဲ့ parameter ဖြစ်အောင် ရွှေ့ချင်နိုင်ပါတယ်။ ဒါက — ဘယ် type(တွေ) အပေါ်မှာ generic လုပ်နေလဲဆိုတာကို (ဥပမာ — `Dictionary` သက်သက်မဟုတ်ဘဲ `Dictionary<string>`) မြင်နိုင်စေပါတယ်။ ဒါက type parameter ကို interface ရဲ့ တခြား members တွေ အားလုံးအတွက် မြင်နိုင်စေပါတယ်။

```ts twoslash
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

ဥပမာက နည်းနည်း ကွဲပြားတဲ့ အရာတစ်ခု ဖြစ်သွားတာကို သတိပြုပါ။ Generic function တစ်ခုကို ဖော်ပြနေတာအစား — အခု ကျွန်တော်တို့မှာ generic type တစ်ခုရဲ့ အစိတ်အပိုင်း ဖြစ်တဲ့ non-generic function signature တစ်ခု ရှိနေပါတယ်။ `GenericIdentityFn` ကို သုံးတဲ့အခါ — သက်ဆိုင်တဲ့ type argument (ဒီမှာ — `number`) ကိုပါ သတ်မှတ်ပေးဖို့ လိုပြီး — အောက်ခံ call signature က ဘာသုံးမလဲဆိုတာကို ထိရောက်စွာ သော့ခတ်လိုက်တာနဲ့ တူပါတယ်။ Type parameter ကို ဘယ်အချိန်မှာ call signature ပေါ်မှာ တိုက်ရိုက် ထားရမလဲ၊ ဘယ်အချိန်မှာ interface ပေါ်မှာပဲ ထားရမလဲဆိုတာ နားလည်ထားခြင်းက — type တစ်ခုရဲ့ ဘယ်ကဏ္ဍတွေ generic ဖြစ်တယ်ဆိုတာကို ဖော်ပြရာမှာ အထောက်အကူ ဖြစ်ပါလိမ့်မယ်။

Generic interfaces တွေအပြင် — generic classes တွေကိုလည်း ဖန်တီးနိုင်ပါတယ်။ Generic enums နဲ့ namespaces တွေကတော့ ဖန်တီးလို့ မရနိုင်တာ သတိပြုပါ။

## Generic Classes (Generic Classes များ)

Generic class တစ်ခုက generic interface တစ်ခုနဲ့ ဆင်တူတဲ့ ပုံသဏ္ဍာန် ရှိပါတယ်။ Generic classes တွေမှာ — class ရဲ့ နာမည်နောက်မှာ angle brackets (`<>`) တွေနဲ့ ဝိုင်းထားတဲ့ generic type parameter စာရင်း ပါပါတယ်။

```ts twoslash
// @strict: false
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

ဒါက `GenericNumber` class ကို တိုက်ရိုက် အသုံးပြုထားတာပါ — ဒါပေမယ့် — `number` type တစ်ခုတည်း သုံးဖို့ပဲ ကန့်သတ်ထားတာ ဘာမှ မရှိတာကို သတိထားမိမှာပါ။ အစား `string` ဒါမှမဟုတ် ပိုရှုပ်ထွေးတဲ့ objects တွေကိုတောင် သုံးနိုင်ခဲ့ပါတယ်။

```ts twoslash
// @strict: false
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
// ---cut---
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
  return x + y;
};

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

Interface နဲ့ ဆင်တူစွာပဲ — type parameter ကို class ပေါ်မှာ တင်ထားခြင်းက — class ရဲ့ properties တွေ အားလုံး type တစ်ခုတည်းနဲ့ အလုပ်လုပ်နေတာကို သေချာစေပါတယ်။

Class တွေအကြောင်း [section](/docs/typescript/classes-v1) မှာ ဖော်ပြခဲ့သလိုပဲ — class တစ်ခုရဲ့ type မှာ ဘက်နှစ်ဘက် ရှိပါတယ်: static side နဲ့ instance side ပါ။ Generic classes တွေက — static side ပေါ်မဟုတ်ဘဲ instance side ပေါ်မှာပဲ generic ဖြစ်တာမို့ — classes တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — static members တွေက class ရဲ့ type parameter ကို သုံးလို့ မရပါဘူး။

## Generic Constraints (Generic Constraints များ)

အစောပိုင်း ဥပမာတစ်ခုကို မှတ်မိရင် — သင်က type အစုတစ်စုရဲ့ စွမ်းဆောင်နိုင်မှုတွေအကြောင်း တစ်စိတ်တစ်ပိုင်း သိထားတဲ့ type အစုတစ်စုအပေါ် အလုပ်လုပ်မယ့် generic function တစ်ခုကို တစ်ခါတစ်ရံ ရေးချင်နိုင်ပါတယ်။ ကျွန်တော်တို့ရဲ့ `loggingIdentity` ဥပမာမှာ — `arg` ရဲ့ `.length` property ကို ဝင်ရောက်နိုင်စေချင်ခဲ့ပေမယ့် — type တိုင်းမှာ `.length` property ရှိတယ်ဆိုတာကို compiler က သက်သေပြနိုင်ခြင်း မရှိခဲ့လို့ — ဒီယူဆချက် မလုပ်နိုင်ဘူးလို့ သတိပေးပါတယ်။

```ts twoslash
// @errors: 2339
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

ဘယ် type မဆိုနဲ့ အလုပ်လုပ်နေတာအစား — ဒီ function ကို `.length` property ပါတဲ့ types တွေနဲ့ပဲ အလုပ်လုပ်ဖို့ ကန့်သတ် (constrain) ချင်ပါတယ်။ Type မှာ ဒီ member ရှိနေသရွေ့ ခွင့်ပြုမှာပါ — ဒါပေမယ့် အနည်းဆုံး ဒီ member ရှိဖို့တော့ လိုအပ်ပါတယ်။ အဲဒီလိုလုပ်ဖို့ — T ဘာဖြစ်နိုင်လဲဆိုတာအပေါ် constraint (ကန့်သတ်ချက်) တစ်ခုအနေနဲ့ ကျွန်တော်တို့ရဲ့ လိုအပ်ချက်ကို စာရင်းပြုရပါမယ်။

အဲဒီလိုလုပ်ဖို့ — ကျွန်တော်တို့ရဲ့ constraint ကို ဖော်ပြတဲ့ interface တစ်ခုကို ဖန်တီးပါမယ်။ ဒီမှာ `.length` property တစ်ခုတည်း ပါတဲ့ interface တစ်ခုကို ဖန်တီးပြီး — ဒီ interface နဲ့ `extends` keyword ကို သုံးပြီး ကျွန်တော်တို့ရဲ့ constraint ကို ဖော်ပြပါမယ်:

```ts twoslash
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```

Generic function က အခု constrained (ကန့်သတ်ခံထားရ) တာမို့ — ဘယ် type မဆိုအပေါ် နောက်တော့ အလုပ်လုပ်တော့မှာ မဟုတ်ပါဘူး:

```ts twoslash
// @errors: 2345
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
// ---cut---
loggingIdentity(3);
```

အစား — type မှာ လိုအပ်တဲ့ properties တွေ အားလုံး ပါတဲ့ values တွေကိုပဲ ထည့်ပေးဖို့ လိုပါတယ်:

```ts twoslash
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
// ---cut---
loggingIdentity({ length: 10, value: 3 });
```

### Using Type Parameters in Generic Constraints (Generic Constraints များထဲမှာ Type Parameters သုံးခြင်း)

တခြား type parameter တစ်ခုအားဖြင့် ကန့်သတ်ခံထားရတဲ့ type parameter တစ်ခုကို ကြေညာနိုင်ပါတယ်။ ဥပမာ — ဒီမှာ object တစ်ခုကနေ ၎င်းရဲ့ နာမည်ကို ပေးပြီး property တစ်ခုကို ရယူချင်ပါတယ်။ `obj` မှာ မရှိတဲ့ property တစ်ခုကို မတော်တဆ ဖမ်းမိသွားတာမျိုး မဖြစ်စေချင်လို့ — type နှစ်ခုကြားမှာ constraint တစ်ခု ချထားပါမယ်:

```ts twoslash
// @errors: 2345
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");
```

### Using Class Types in Generics (Generics များထဲမှာ Class Types သုံးခြင်း)

TypeScript မှာ generics တွေသုံးပြီး factories တွေ ဖန်တီးတဲ့အခါ — class types တွေကို ၎င်းတို့ရဲ့ constructor functions တွေအားဖြင့် ရည်ညွှန်းဖို့ လိုအပ်ပါတယ်။ ဥပမာ —

```ts twoslash
function create<T>(c: { new (): T }): T {
  return new c();
}
```

ပိုအဆင့်မြင့်တဲ့ ဥပမာတစ်ခုကတော့ — constructor function နဲ့ class types တွေရဲ့ instance side အကြား ဆက်စပ်မှုတွေကို infer လုပ်ပြီး ကန့်သတ်ဖို့ prototype property ကို အသုံးပြုပါတယ်။

```ts twoslash
// @strict: false
class BeeKeeper {
  hasMask: boolean;
}

class ZooKeeper {
  nametag: string;
}

class Animal {
  numLegs: number;
}

class Bee extends Animal {
  keeper: BeeKeeper;
}

class Lion extends Animal {
  keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```
