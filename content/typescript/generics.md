---
title: "Generics"
description: "Generics ဆိုတာ ဘာလဲ — type variable, identity function, inference, constraints, generic interfaces/classes, keyof နဲ့ indexed access"
order: 5
source: "https://www.typescriptlang.org/docs/handbook/2/generics.html"
status: translated
updated: 2026-09-01
---

## Generics ဆိုတာ ဘာလဲ

Software component တွေ ရေးတဲ့အခါ — type တစ်မျိုးတည်းအတွက် မဟုတ်ဘဲ type အမျိုးမျိုးနဲ့ အလုပ်လုပ်နိုင်တဲ့ reusable component တွေ ရေးချင်ပါတယ်။ C# နဲ့ Java လို language တွေမှာ အဲဒါအတွက် သုံးတာက **generics** ပါ — type တစ်မျိုးစီအတွက် သီးခြား ရေးစရာမလိုဘဲ type အမျိုးမျိုးနဲ့ အလုပ်လုပ်တဲ့ component ကို ဖန်တီးနိုင်ပါတယ်။ Generics ရဲ့ "hello world" က identity function (ဘာပေးလဲ အဲဒါပဲ ပြန်ပေးတဲ့ function) ပါ။ `number` type အတွက်ပဲ ရေးထားရင် ပြန်သုံးလို့မရဘဲ — `any` သုံးရင်လည်း input type အကြောင်း အချက်အလက် ဆုံးရှုံးသွားပါတယ်။ ဖြေရှင်းနည်းက **type variable** — type တွေအတွက် variable လိုမျိုး အလုပ်လုပ်တဲ့ အထူး variable ပါ:

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}

let output1 = identity<string>("myString");  // Explicit type argument
let output2 = identity("myString");          // Type argument inference
```

`<Type>` က user ပေးလိုက်တဲ့ type (ဥပမာ `string`) ကို ဖမ်းယူပြီး return type မှာ ပြန်သုံးပါတယ် — အဲဒါကြောင့် input နဲ့ output type တူတယ်ဆိုတာ TypeScript က သေချာစေပါတယ်။ `identity<string>("myString")` လိုမျိုး angle bracket ထဲမှာ type argument ကို ရှင်းရှင်းလင်းလင်း ပေးလို့ရသလို — `identity("myString")` လို ချန်ထားရင်လည်း compiler က argument ရဲ့ type ကြည့်ပြီး အလိုအလျောက် မှန်းပေးပါတယ် (type argument inference)။ Inference က code ပိုတိုပြီး ဖတ်ရလွယ်စေပေမယ့် — complex case တွေမှာ compiler မမှန်းနိုင်ရင် type argument ကို ကိုယ်တိုင် ပေးရပါတယ်။

## Generic constraints — extends

Generic function ကို type တိုင်းနဲ့ မဟုတ်ဘဲ — သီးခြား လက္ခဏာရှိတဲ့ type တွေနဲ့ပဲ အလုပ်လုပ်ချင်ရင် constraint ထည့်ပါတယ်။ `Type extends Lengthwise` လိုမျိုး `extends` clause နဲ့ — `Type` မှာ အနည်းဆုံး `.length` property ရှိရမယ်လို့ သတ်မှတ်လိုက်တာပါ။ အဲဒါဆိုရင် function body ထဲမှာ `.length` ကို error မရှိဘဲ သုံးလို့ရပြီး — constraint နဲ့ မကိုက်တဲ့ type ပို့ရင်တော့ error တက်ပါတယ်:

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length);  // Now we know it has a .length property
  return arg;
}

loggingIdentity({ length: 10, value: 3 });  // OK
loggingIdentity(3);  // Error: number doesn't have a length property
```

Constraint သုံးတဲ့အခါ သတိထားစရာက — function က input ပေးတဲ့ type အတိုင်း ပြန်ပေးမယ်လို့ ကတိပေးထားတာမို့ constraint နဲ့ ကိုက်တဲ့ object အသစ်တစ်ခုကို return လုပ်တာမျိုး မလုပ်သင့်ပါဘူး (constraint ကို ကျေနပ်တိုင်း input type နဲ့ တူတာ မဟုတ်လို့)။ Generics ရဲ့ အဓိက ရည်ရွယ်ချက်က value နှစ်ခု ဒါမှမဟုတ် နှစ်ခုထက်ပိုကြား type ဆက်စပ်မှုကို ထိန်းသိမ်းတာပါ — [Functions အသေးစိတ်](/docs/typescript/functions) မှာလည်း generic function နဲ့ constraint အကြောင်း ထပ်တွေ့ရပါမယ်။

## Generic interfaces နဲ့ classes

Interface နဲ့ class တွေကိုလည်း generic လုပ်လို့ရပါတယ် — class name နောက်မှာ `<>` နဲ့ type parameter ထည့်ပါတယ်။ ဒါဆိုရင် class ထဲက member အားလုံးက တူညီတဲ့ type ကို သုံးတာ သေချာစေပါတယ်။ Generic class က instance side မှာပဲ generic ဖြစ်ပြီး — static member တွေကတော့ class ရဲ့ type parameter ကို သုံးလို့မရပါဘူး:

```ts
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};

let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
```

`new GenericNumber<number>()` လိုမျိုး type argument ပေးပြီး instantiate လုပ်ပါတယ် — ဒါကြောင့် `myGenericNumber` ထဲက member တွေက `number` type နဲ့ အလုပ်လုပ်ပြီး `stringNumeric` ကတော့ `string` type နဲ့ အလုပ်လုပ်ပါတယ်။ ဒီ example မှာ field တွေကို constructor ထဲမှာ initialize မလုပ်ထားတာမို့ — `strictPropertyInitialization` ဖွင့်ထားတဲ့ project မှာ error ပြနိုင်တာ သတိပြုပါ။ Generic classes အကြောင်း အသေးစိတ်ကို [Classes](/docs/typescript/classes) မှာ လေ့လာနိုင်ပါတယ်။

## keyof — property name တွေကို type အဖြစ်

`keyof` operator က object type တစ်ခုရဲ့ property name တွေ အားလုံးကို union type အဖြစ် ပြောင်းပေးပါတယ်။ Generics နဲ့ တွဲသုံးတဲ့အခါ — object ရဲ့ key တစ်ခုကို argument အနေနဲ့ လက်ခံတဲ့ function မှာ key မှားရိုက်တာကို compile time မှာတင် ဖမ်းနိုင်ပါတယ်:

```ts
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");  // OK
getProperty(x, "m");  // Error: Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'
```

`Key extends keyof Type` ဆိုတာ `Key` က `Type` ရဲ့ property name တွေထဲက တစ်ခု ဖြစ်ရမယ်လို့ သတ်မှတ်တာပါ။ Indexed access type ဖြစ်တဲ့ `Type[Key]` ကိုလည်း — object ရဲ့ value type ကို key ကနေတစ်ဆင့် ထုတ်ယူဖို့ သုံးလို့ရပါတယ်။

## Generics ကို ဘယ်အခါ သုံးမလဲ

Generics က type တွေကြား ဆက်စပ်မှုကို ဖော်ပြဖို့ ဖြစ်ပြီး — type parameter က function signature ထဲမှာ နှစ်နေရာ ဒါမှမဟုတ် ပိုပြီး ပေါ်ရပါမယ်။ Type parameter တစ်ခုတည်း တစ်နေရာတည်းမှာ ပေါ်ရင် generic မလိုပါဘူး — ဥပမာ `function greet<Str extends string>(s: Str)` ဆိုတာထက် `function greet(s: string)` ဆိုတာ ပိုရိုးရှင်းပါတယ်။ Type parameter အရေအတွက်လည်း တတ်နိုင်သမျှ နည်းနည်းပဲ သုံးပြီး — constraint ကို မလိုအပ်ဘဲ မထည့်ပါနဲ့။ Inference ကို ခက်ခဲစေလို့ပါ။ ရိုးရိုးရှင်းရှင်း စဉ်းစားရင် — "ဒီ function က type အမျိုးမျိုးနဲ့ အလုပ်လုပ်ပြီး type တွေကြား ဆက်စပ်မှုကို ထိန်းသိမ်းဖို့ လိုသလား" ဆိုတဲ့ မေးခွန်းရဲ့ အဖြေ yes ဆိုမှသာ generics ကို သုံးပါ။

## ဆက်လက်လေ့လာရန်

- [Functions အသေးစိတ်](/docs/typescript/functions) — generic functions နဲ့ constraints
- [နေ့စဉ်သုံး Types](/docs/typescript/everyday-types) — type alias နဲ့ union types
- [Classes](/docs/typescript/classes) — generic classes
