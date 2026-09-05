---
title: "TypeScript for Java/C# Programmers (Java/C# Programmer များအတွက် TypeScript)"
description: "Java/C# programmer များအတွက် TypeScript မိတ်ဆက် — class နှင့် types အပေါ် ချဉ်းကပ်ပုံ ကွာခြားချက်များ, structural typing, types တွေကို sets အဖြစ် မြင်ခြင်းနှင့် reflection"
order: 42
source: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html"
status: translated
updated: 2026-09-05
---

TypeScript က C# နဲ့ Java လိုမျိုး — static typing ပါတဲ့ တခြား language တွေကို ကျင့်သားရနေပြီးသား programmer တွေအတွက် ရေပန်းစားတဲ့ ရွေးချယ်မှုတစ်ခုပါ။

TypeScript ရဲ့ type system က — ပိုကောင်းတဲ့ code completion, error တွေကို စောစီးစွာ သိရှိခြင်း, ပြီးတော့ သင့် program ရဲ့ အစိတ်အပိုင်းတွေကြား ပိုရှင်းလင်းတဲ့ ဆက်သွယ်မှု စတဲ့ — အကျိုးကျေးဇူး တူညီတာတွေကို အများကြီး ပေးပါတယ်။
TypeScript က ဒီ developer တွေအတွက် အကျွမ်းတဝင် ရှိတဲ့ feature တွေ အများကြီး ပေးပေမယ့် — JavaScript (ဒါကြောင့် TypeScript) က ရိုးရာ OOP language တွေနဲ့ ဘယ်လို ကွာခြားလဲဆိုတာကို ခဏ နောက်ဆုတ်ပြီး ကြည့်ဖို့ ထိုက်တန်ပါတယ်။
ဒီကွာခြားချက်တွေကို နားလည်ထားတာက — ပိုကောင်းတဲ့ JavaScript code တွေ ရေးဖို့ရော — C#/Java ကနေ TypeScript ဆီ တိုက်ရိုက် ကူးပြောင်းလာတဲ့ programmer တွေ ကျရောက်တတ်တဲ့ အဖြစ်များတဲ့ ထောင်ချောက်တွေကို ရှောင်ရှားဖို့ပါ — ကူညီပေးပါလိမ့်မယ်။

## Co-learning JavaScript (JavaScript ကို တွဲဖက် သင်ယူခြင်း)

သင်ဟာ JavaScript နဲ့ အကျွမ်းတဝင် ရှိပြီးသားပေမယ့် — အဓိကအားဖြင့် Java ဒါမှမဟုတ် C# programmer တစ်ယောက်ဆိုရင် — ဒီနိဒါန်း page က သင်ဖြစ်နိုင်ခြေ ရှိနိုင်တဲ့ အဖြစ်များတဲ့ အထင်အမြင်လွဲမှားမှုတွေနဲ့ ထောင်ချောက်တချို့ကို ရှင်းပြဖို့ ကူညီပေးနိုင်ပါတယ်။
TypeScript က types တွေကို ပုံစံထုတ်ပုံ (model လုပ်ပုံ) နည်းလမ်းတချို့က Java ဒါမှမဟုတ် C# နဲ့ အတော်လေး ကွာခြားပါတယ် — TypeScript သင်ယူတဲ့အခါ ဒါတွေကို စိတ်ထဲမှာ ထားထားဖို့ အရေးကြီးပါတယ်။

JavaScript တစ်ခုလုံးကို အသစ်စစ စတင်မယ့် Java ဒါမှမဟုတ် C# programmer တစ်ယောက်ဆိုရင် — JavaScript ရဲ့ runtime behaviors တွေကို နားလည်ဖို့ — types _မပါပဲ_ JavaScript ကို နည်းနည်းအရင်လေ့လာဖို့ အကြံပြုပါတယ်။
TypeScript က သင့် code _run_ ပုံကို မပြောင်းလဲပေးတာမို့ — တကယ် အလုပ်လုပ်တဲ့ code တွေ ရေးဖို့ဆိုရင် — JavaScript ဘယ်လို အလုပ်လုပ်လဲဆိုတာကို သင်ယူဖို့ လိုနေဦးမှာပါ!

TypeScript က JavaScript နဲ့ _runtime_ အတူတူကိုပဲ သုံးတယ်ဆိုတာ မှတ်ထားဖို့ အရေးကြီးပါတယ် — ဒါကြောင့် — တိကျတဲ့ runtime behavior တစ်ခုကို ဘယ်လို ပြီးမြောက်အောင် လုပ်မလဲ (string တစ်ခုကို number အဖြစ် ပြောင်းခြင်း, alert တစ်ခု ပြသခြင်း, file တစ်ခုကို disk ပေါ် ရေးခြင်း စသဖြင့်) ဆိုတဲ့ ရင်းမြစ်တွေ အားလုံးက — TypeScript program တွေအတွက်ပါ အမြဲတမ်း အညီအမျှ အသုံးဝင်ပါတယ်။
TypeScript အတွက်သီးသန့် ရင်းမြစ်တွေပဲ ဆိုပြီး ကိုယ့်ကိုယ်ကို ကန့်သတ်မထားပါနဲ့!

## Rethinking the Class (Class အကြောင်း ပြန်လည် စဉ်းစားခြင်း)

C# နဲ့ Java တို့ကို _mandatory OOP_ (မဖြစ်မနေ OOP သုံးရတဲ့) language တွေလို့ ခေါ်လို့ရပါတယ်။
ဒီ language တွေမှာ — _class_ က code စုစည်းမှုရဲ့ အခြေခံ ယူနစ်ဖြစ်ပြီး — runtime မှာ data _နဲ့_ behavior အားလုံးရဲ့ အခြေခံ သိုလှောင်ရာလည်း ဖြစ်ပါတယ်။
Functionality တွေနဲ့ data အားလုံးကို classes တွေထဲမှာပဲ ထားဖို့ တွန်းအားပေးတာက — ပြဿနာ တချို့အတွက် ကောင်းမွန်တဲ့ domain model တစ်ခု ဖြစ်နိုင်ပေမယ့် — domain တိုင်း ဒီနည်းနဲ့ပဲ ကိုယ်စားပြုဖို့ _မလိုအပ်ပါဘူး_။

### Free Functions and Data (Free Functions နဲ့ Data)

JavaScript မှာ — functions တွေက နေရာတိုင်းမှာ နေထိုင်နိုင်ပြီး — data တွေကိုလည်း ကြိုသတ်မှတ်ထားတဲ့ `class` ဒါမှမဟုတ် `struct` တစ်ခုထဲမှာ မထည့်ဘဲ — လွတ်လပ်စွာ ပေးပို့ ဖြတ်သန်းနိုင်ပါတယ်။ ဒီလို ပြောင်းလွယ်ပြင်လွယ် ရှိမှုက အလွန် စွမ်းပါတယ်။
OOP အဆင့်ဆင့် ဖွဲ့စည်းပုံ (hierarchy) မပါပဲ — data တွေအပေါ် အလုပ်လုပ်တဲ့ "free" functions တွေ (class တစ်ခုနဲ့ ဆက်စပ်မထားတဲ့ functions) က — JavaScript မှာ program တွေ ရေးသားဖို့ ဦးစားပေး နှစ်သက်ရာ ပုံစံ ဖြစ်တတ်ပါတယ်။

### Static Classes (Static Classes များ)

ထပ်ပြီးတော့ — C# နဲ့ Java က singletons နဲ့ static classes လိုမျိုး တည်ဆောက်ပုံ (constructs) တချို့က TypeScript မှာတော့ မလိုအပ်ပါဘူး။

## OOP in TypeScript (TypeScript ထဲက OOP)

ဒါပေမဲ့ — ကြိုက်နှစ်သက်ရင် classes တွေကို ဆက်သုံးလို့ ရပါသေးတယ်!
ပြဿနာ တချို့က ရိုးရာ OOP hierarchy နဲ့ ဖြေရှင်းဖို့ အတော်လေး သင့်တော်ပြီး — JavaScript classes တွေအတွက် TypeScript ရဲ့ ထောက်ပံ့မှုက ဒီလို models တွေကို ပိုပြီး စွမ်းဆောင်နိုင်စေပါတယ်။
TypeScript က interfaces တွေ implement လုပ်ခြင်း, inheritance (အမွေဆက်ခံခြင်း), static methods တွေလိုမျိုး — အဖြစ်များတဲ့ pattern တွေ အများကြီးကို ထောက်ပံ့ပါတယ်။

Classes တွေအကြောင်းကို ဒီ guide ထဲမှာ နောက်ပိုင်း ဆွေးနွေးသွားပါမယ်။

## Rethinking Types (Types အကြောင်း ပြန်လည် စဉ်းစားခြင်း)

TypeScript ရဲ့ _type_ တစ်ခုအပေါ် နားလည်မှုက C# ဒါမှမဟုတ် Java ရဲ့ နားလည်မှုနဲ့ တကယ့်ကို အတော်လေး ကွာခြားပါတယ်။ ကွာခြားချက်တချို့ကို စူးစမ်းကြည့်ရအောင်။

### Nominal Reified Type Systems (Nominal Reified Type Systems ဆိုတာ)

C# ဒါမှမဟုတ် Java မှာ — value ဒါမှမဟုတ် object တစ်ခုချင်းစီမှာ တိကျတဲ့ type တစ်ခုတည်း ရှိပါတယ် — `null` ဖြစ်စေ, primitive တစ်ခုဖြစ်စေ, ဒါမှမဟုတ် သိပြီးသား class type တစ်ခုဖြစ်စေပါ။
`value.GetType()` ဒါမှမဟုတ် `value.getClass()` လိုမျိုး methods တွေကို ခေါ်ပြီး — runtime မှာ တိကျတဲ့ type ကို မေးမြန်း စုံစမ်းနိုင်ပါတယ်။
ဒီ type ရဲ့ definition က နာမည်တစ်ခုနဲ့ တစ်နေရာရာမှာ ရှိတဲ့ class တစ်ခုထဲမှာ တည်ရှိပြီး — ထင်ရှားတဲ့ inheritance relationship (အမွေဆက်ခံမှု ဆက်စပ်မှု) ဒါမှမဟုတ် ဘုံအတူ implement လုပ်ထားတဲ့ interface တစ်ခု မရှိရင် — shape ဆင်တူတဲ့ class နှစ်ခုကို အချင်းချင်း အစားထိုး သုံးလို့ မရပါဘူး။

ဒီသွင်ပြင်လက္ခဏာတွေက _reified, nominal_ type system တစ်ခုကို ဖော်ပြနေပါတယ်။
Code ထဲမှာ ကျွန်တော်တို့ ရေးထားတဲ့ types တွေဟာ runtime မှာ ရှိနေပြီး — types တွေက သူတို့ရဲ့ structures တွေကြောင့် မဟုတ်ဘဲ — သူတို့ရဲ့ declarations တွေကနေ ဆက်စပ်နေပါတယ်။

### Types as Sets (Types တွေကို Sets အဖြစ် မြင်ခြင်း)

C# ဒါမှမဟုတ် Java မှာ — runtime types တွေနဲ့ သူတို့ရဲ့ compile-time declarations တွေကြားမှာ တစ်ခုနှင့်တစ်ခု တိုက်ရိုက် ဆက်စပ်မှု (one-to-one correspondence) ရှိတယ်လို့ တွေးဖို့က အဓိပ္ပာယ် ရှိပါတယ်။

TypeScript မှာတော့ — type တစ်ခုကို — တူညီတဲ့ အရာတစ်ခုခုကို မျှဝေထားတဲ့ _values တွေရဲ့ set (အစုအဝေး)_ တစ်ခုအနေနဲ့ တွေးကြည့်တာ ပိုကောင်းပါတယ်။
Types တွေက sets တွေ သက်သက်မို့ — value တစ်ခုက sets _အများကြီး_ ထဲကို တစ်ပြိုင်နက် ဝင်နိုင်ပါတယ်။

Types တွေကို sets အဖြစ် စတင် တွေးတတ်လာတာနဲ့ — operation တစ်ချို့က အရမ်းကို သဘာဝကျလာပါတယ်။
ဥပမာ — C# မှာ `string` _ဒါမှမဟုတ်_ `int` ဖြစ်နေတဲ့ value တစ်ခုကို ဖြတ်သန်း ပေးပို့တာက ကသိကအောက် ဖြစ်ရပါတယ် — ဘာလို့လဲဆိုတော့ — ဒီလိုမျိုး value တစ်ခုကို ကိုယ်စားပြုတဲ့ type တစ်ခုတည်း မရှိလို့ပါ။

TypeScript မှာတော့ — type တိုင်းက set တစ်ခု သက်သက်ဆိုတာ သဘောပေါက်လိုက်တာနဲ့ — ဒါက အရမ်းကို သဘာဝကျပါတယ်။
`string` set ထဲ ဒါမှမဟုတ် `number` set ထဲ ဝင်နေတဲ့ value တစ်ခုကို ဘယ်လို ဖော်ပြမလဲ? သူက ဒီ sets တွေရဲ့ _union_ (ပေါင်းစည်းမှု) ထဲကို ရိုးရိုးရှင်းရှင်း ဝင်သွားတာပါပဲ: `string | number` ပေါ့။

TypeScript က set-theoretic (set သဘောတရားအခြေပြု) နည်းလမ်းနဲ့ types တွေကို ကိုင်တွယ်ဖို့ ယန္တရားတွေ အများကြီး ပေးထားပါတယ် — types တွေကို sets အဖြစ် တွေးကြည့်ရင် — ဒါတွေကို ပိုပြီး အလိုလို နားလည်လွယ်တာ တွေ့ရပါလိမ့်မယ်။

### Erased Structural Types (Erased Structural Types ဆိုတာ)

TypeScript မှာ — objects တွေက တိကျတဲ့ type တစ်ခုတည်း မဟုတ်ပါဘူး။
ဥပမာ — interface တစ်ခုကို ကျေနပ်စေတဲ့ object တစ်ခု တည်ဆောက်လိုက်ရင် — နှစ်ခုကြားမှာ declarative relationship (ကြေညာထားတဲ့ ဆက်စပ်မှု) မရှိခဲ့ရင်တောင် — အဲဒီ interface ကို မျှော်လင့်တဲ့ နေရာမှာ ဒီ object ကို သုံးနိုင်ပါတယ်။

```ts twoslash
interface Pointlike {
  x: number;
  y: number;
}
interface Named {
  name: string;
}

function logPoint(point: Pointlike) {
  console.log("x = " + point.x + ", y = " + point.y);
}

function logName(x: Named) {
  console.log("Hello, " + x.name);
}

const obj = {
  x: 0,
  y: 0,
  name: "Origin",
};

logPoint(obj);
logName(obj);
```

TypeScript ရဲ့ type system က _structural_ (ဖွဲ့စည်းပုံအခြေပြု) ဖြစ်ပြီး — nominal မဟုတ်ပါဘူး: `obj` မှာ number ဖြစ်တဲ့ `x` နဲ့ `y` properties တွေ နှစ်ခုလုံး ရှိတာမို့ — သူ့ကို `Pointlike` အဖြစ် သုံးနိုင်ပါတယ်။
Types တွေကြားက ဆက်စပ်မှုတွေကို — သူတို့ ဘယ် relationship နဲ့ ကြေညာထားလဲဆိုတာထက် — သူတို့ထဲမှာ ပါဝင်တဲ့ properties တွေက ဆုံးဖြတ်ပေးပါတယ်။

TypeScript ရဲ့ type system က _not reified_ (runtime မှာ type ရုပ်လုံး ပေါ်မနေတဲ့) လည်း ဖြစ်ပါတယ်: `obj` က `Pointlike` ဖြစ်တယ်လို့ ပြောပြတဲ့အရာ runtime မှာ ဘာမှ မရှိပါဘူး။
တကယ်တော့ — `Pointlike` type က runtime မှာ _ဘယ်ပုံစံနဲ့မှ_ ရှိနေမှာ မဟုတ်ပါဘူး။

_types as sets_ (types တွေကို sets အဖြစ် မြင်ခြင်း) ဆိုတဲ့ အတွေးဆီ ပြန်သွားရင် — `obj` ကို `Pointlike` values တွေရဲ့ set ရော `Named` values တွေရဲ့ set ရော — နှစ်ခုလုံးရဲ့ member တစ်ခုအဖြစ် တွေးနိုင်ပါတယ်။

### Consequences of Structural Typing (Structural Typing ရဲ့ အကျိုးဆက်များ)

OOP programmer တွေဟာ structural typing ရဲ့ သွင်ပြင်လက္ခဏာ နှစ်ခုကို မကြာခဏ အံ့သြတတ်ကြပါတယ်။

#### Empty Types (Empty Types — properties လုံးဝမရှိသော Types)

ပထမတစ်ခုက — _empty type_ က မျှော်လင့်ချက်ကို ဆန့်ကျင်နေပုံ ရတာပါ:

```ts twoslash
class Empty {}

function fn(arg: Empty) {
  // do something?
}

// No error, but this isn't an 'Empty' ?
fn({ k: 10 });
```

ဒီမှာ `fn` ကို ခေါ်တာ မှန်ကန်မလားဆိုတာကို — ပေးလိုက်တဲ့ argument က တရားဝင်တဲ့ `Empty` ဟုတ်မဟုတ် ကြည့်ပြီး TypeScript က ဆုံးဖြတ်ပါတယ်။
သူက `{ k: 10 }` နဲ့ `class Empty { }` တို့ရဲ့ _structure_ (ဖွဲ့စည်းပုံ) ကို စစ်ဆေးခြင်းအားဖြင့် ဒီလို ဆုံးဖြတ်တာပါ။
`Empty` မှာ properties မရှိတာမို့ — `{ k: 10 }` မှာ `Empty` မှာရှိတဲ့ properties _အားလုံး_ ရှိတာကို မြင်နိုင်ပါတယ်။

ဒါကြောင့် — ဒါက တရားဝင်တဲ့ call တစ်ခုပါ!

ဒါက အံ့သြစရာ ထင်ရနိုင်ပေမယ့် — နောက်ဆုံးမှာတော့ — nominal OOP language တွေမှာ ကျင့်သုံးတဲ့ ဆက်စပ်မှုတစ်ခုနဲ့ အရမ်းကို ဆင်တူတဲ့ ဆက်စပ်မှုတစ်ခုပါ။
Subclass တစ်ခုက သူ့ရဲ့ base class ရဲ့ property တစ်ခုကို _ဖယ်ရှား_ လို့ မရပါဘူး — ဘာလို့လဲဆိုတော့ — အဲဒီလို လုပ်လိုက်ရင် derived class နဲ့ သူ့ရဲ့ base ကြားက သဘာဝ subtype relationship ကို ဖျက်ဆီးပစ်ရာ ရောက်လို့ပါ။
Structural type system တွေကတော့ — compatible types တွေရဲ့ properties တွေ ရှိခြင်းဆိုတဲ့ သတ်မှတ်ချက်နဲ့ subtypes တွေကို ဖော်ပြခြင်းအားဖြင့် — ဒီဆက်စပ်မှုကို သွယ်ဝိုက်၍ (implicitly) ခွဲခြား သိမြင်စေပါတယ်။

#### Identical Types (Identical Types — တူညီသော Types)

နောက်ထပ် မကြာခဏ အံ့သြစရာ အရင်းအမြစ်တစ်ခုက — identical types (တူညီတဲ့ types) တွေနဲ့ လာပါတယ်:

```ts
class Car {
  drive() {
    // hit the gas
  }
}
class Golfer {
  drive() {
    // hit the ball far
  }
}

// No error?
let w: Car = new Golfer();
```

ဒါကလည်း error မဟုတ်ပါဘူး — ဘာလို့လဲဆိုတော့ — ဒီ classes တွေရဲ့ _structures_ တွေက အတူတူပဲ မို့ပါ။
ဒါက ရှုပ်ထွေးမှု ဖြစ်စေနိုင်တဲ့ အရင်းအမြစ်တစ်ခုလို ထင်ရနိုင်ပေမယ့် — လက်တွေ့မှာတော့ — မဆက်စပ်သင့်ဘဲ structure တူညီနေတဲ့ classes တွေက အဖြစ်များလှတော့ မဟုတ်ပါဘူး။

Classes တွေ အချင်းချင်း ဘယ်လို ဆက်စပ်လဲဆိုတာကို Classes အခန်းမှာ ပိုပြီး လေ့လာရပါမယ်။

### Reflection (Reflection ဆိုတာ)

OOP programmer တွေက — generic type တစ်ခုတောင် အပါအဝင် — value ဘယ်ဟာမဆိုရဲ့ type ကို မေးမြန်း စုံစမ်းနိုင်တာကို ကျင့်သားရနေပါတယ်:

```csharp
// C#
static void LogType<T>() {
    Console.WriteLine(typeof(T).Name);
}
```

TypeScript ရဲ့ type system က လုံးဝ erase လုပ်ခံရတာမို့ — ဥပမာ — generic type parameter တစ်ခုရဲ့ instantiation (ပုံစံချခြင်း) အကြောင်း သတင်းအချက်အလက်တွေက runtime မှာ မရနိုင်ပါဘူး။

JavaScript မှာ `typeof` နဲ့ `instanceof` လိုမျိုး အကန့်အသတ်ရှိတဲ့ primitives တချို့တော့ ရှိပါတယ် — ဒါပေမယ့် ဒီ operators တွေက type-erased ဖြစ်ပြီးသား output code ထဲမှာ တည်ရှိနေတဲ့ values တွေအပေါ်မှာပဲ အလုပ်လုပ်နေတာ သတိရပါ။
ဥပမာ — `typeof (new Car())` က `"object"` ဖြစ်ပါမယ် — `Car` ဒါမှမဟုတ် `"Car"` မဟုတ်ပါဘူး။

## Next Steps (နောက်ထပ် ဆက်လုပ်ရန် အဆင့်များ)

ဒါဟာ နေ့စဉ် TypeScript မှာ သုံးတဲ့ syntax နဲ့ tools တွေရဲ့ အကျဉ်းချုပ် ခြုံငုံသုံးသပ်ချက်ပါ။ ဒီကနေ သင်လုပ်နိုင်တာတွေက:

- Handbook တစ်အုပ်လုံးကို [အစအဆုံး](/docs/typescript/getting-started) ဖတ်ရှုပါ
- [Playground ဥပမာများ](https://www.typescriptlang.org/play) ကို စူးစမ်းလေ့လာပါ
