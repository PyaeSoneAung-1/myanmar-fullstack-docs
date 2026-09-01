---
title: "TypeScript Tooling in 5 minutes (၅ မိနစ်အတွင်း TypeScript Tooling)"
description: "TypeScript နဲ့ ရိုးရှင်းတဲ့ web application တစ်ခု တည်ဆောက်နည်း — TypeScript install လုပ်ခြင်း, ပထမဆုံး TypeScript file, compile လုပ်ခြင်း, type annotations, interfaces နဲ့ classes"
order: 19
source: "https://www.typescriptlang.org/docs/handbook/tooling-in-5-minutes.html"
status: translated
updated: 2026-09-01
---

TypeScript နဲ့ ရိုးရှင်းတဲ့ web application တစ်ခု တည်ဆောက်ခြင်းဖြင့် စတင်လိုက်ရအောင်။

## TypeScript Install လုပ်ခြင်း

သင့် project ထဲကို TypeScript ထည့်ဖို့ အဓိက နည်းလမ်း နှစ်ခု ရှိပါတယ်:

- npm (Node.js package manager) ကတစ်ဆင့်
- TypeScript ရဲ့ Visual Studio plugins တွေ install လုပ်ခြင်းအားဖြင့်

Visual Studio 2017 နဲ့ Visual Studio 2015 Update 3 တွေမှာ TypeScript language support ကို default အနေနဲ့ ပါဝင်ပေမယ့် — TypeScript compiler ဖြစ်တဲ့ `tsc` တော့ မပါဝင်ပါဘူး။
Visual Studio နဲ့ TypeScript install မလုပ်ထားရင် — [ဒီကနေ download](https://www.typescriptlang.org/download) လုပ်နိုင်ပါသေးတယ်။

npm သုံးသူတွေအတွက်:

```shell
> npm install -g typescript
```

## ပထမဆုံး TypeScript File ရေးဆွဲခြင်း

သင့် editor ထဲမှာ — `greeter.ts` ထဲ အောက်ပါ JavaScript code ကို ရိုက်ထည့်ပါ:

```ts
function greeter(person) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## Code ကို Compile လုပ်ခြင်း

ကျွန်တော်တို့ `.ts` extension ကို သုံးခဲ့ပေမယ့် — ဒီ code က JavaScript သက်သက်ပါ။
ရှိပြီးသား JavaScript app တစ်ခုကနေ copy/paste လုပ်ထားတာလည်း ဖြစ်နိုင်ပါတယ်။

Command line မှာ TypeScript compiler ကို run ပါ:

```shell
tsc greeter.ts
```

ရလဒ်အနေနဲ့ — သင်ထည့်လိုက်တဲ့ JavaScript အတိုင်းပဲ ပါဝင်တဲ့ `greeter.js` ဖိုင်တစ်ခု ထွက်လာပါလိမ့်မယ်။
ကျွန်တော်တို့ရဲ့ JavaScript app ထဲမှာ TypeScript ကို သုံးနေပါပြီ!

အခုတော့ TypeScript က ပေးတဲ့ tool အသစ်တချို့ရဲ့ အကျိုးကျေးဇူးတွေ စတင် ခံစားလို့ရပါပြီ။
ဒီမှာပြထားသလို — `person` function parameter ဆီ `: string` type annotation တစ်ခု ထည့်ကြည့်ပါ:

```ts
function greeter(person: string) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## Type Annotations

Type annotations တွေက TypeScript မှာ — function ဒါမှမဟုတ် variable တစ်ခုရဲ့ ရည်ရွယ်ထားတဲ့ contract ကို မှတ်တမ်းတင်ဖို့ ပေါ့ပါးတဲ့ နည်းလမ်းတွေပါ။
ဒီကိစ္စမှာ — greeter function ကို string parameter တစ်ခုတည်းနဲ့ ခေါ်ဖို့ ရည်ရွယ်ပါတယ်။
ဒီ greeter call ကို array တစ်ခု ပို့ဖို့ ပြောင်းကြည့်နိုင်ပါတယ်:

```ts
function greeter(person: string) {
  return "Hello, " + person;
}

let user = [0, 1, 2];

document.body.textContent = greeter(user);
```

ပြန် compile လုပ်ကြည့်ရင် — error တစ်ခု တွေ့ရပါလိမ့်မယ်:

```shell
error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

အလားတူ — greeter call ရဲ့ arguments တွေ အားလုံးကို ဖယ်ရှားကြည့်ပါ။
TypeScript က ဒီ function ကို မမျှော်လင့်ထားတဲ့ argument အရေအတွက်နဲ့ ခေါ်ထားတယ်လို့ သိစေပါလိမ့်မယ်။
အခြေအနေ နှစ်ခုစလုံးမှာ — TypeScript က သင့် code ရဲ့ structure ရော သင်ပေးထားတဲ့ type annotations ရော နှစ်ခုလုံးကို အခြေခံပြီး static analysis ပေးနိုင်ပါတယ်။

Error တွေ ရှိနေပေမယ့် — `greeter.js` ဖိုင်က ဖန်တီးပြီးသား ဖြစ်နေတာ သတိပြုပါ။
သင့် code ထဲမှာ errors တွေ ရှိနေရင်တောင် TypeScript ကို သုံးနိုင်ပါတယ်။ ဒါပေမယ့် ဒီကိစ္စမှာ — သင့် code က မျှော်လင့်ထားသလို run ဖြစ်ဖို့ မလွယ်နိုင်ဘူးလို့ TypeScript က သတိပေးနေတာပါ။

## Interfaces

ကျွန်တော်တို့ရဲ့ ဥပမာကို နောက်ထပ် ဆက်တိုးချဲ့ကြည့်ရအောင်။ ဒီမှာ firstName နဲ့ lastName field တွေ ရှိတဲ့ objects တွေကို ဖော်ပြတဲ့ interface တစ်ခု သုံးပါတယ်။
TypeScript မှာ — type နှစ်ခုက သူတို့ရဲ့ အတွင်းပိုင်း structure တွေ compatible ဖြစ်ရင် — type နှစ်ခု compatible လို့ သတ်မှတ်ပါတယ်။
ဒါက — explicit `implements` clause မပါဘဲ — interface က လိုအပ်တဲ့ shape ရှိရုံနဲ့ interface တစ်ခုကို implement လုပ်ခွင့် ပေးပါတယ်။

```ts
interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };

document.body.textContent = greeter(user);
```

## Classes

နောက်ဆုံးအနေနဲ့ — ဥပမာကို classes တွေနဲ့ နောက်တစ်ကြိမ် ထပ်တိုးချဲ့ကြည့်ရအောင်။
TypeScript က class-based object-oriented programming ကို ထောက်ပံ့တာလိုမျိုး — JavaScript ထဲက features အသစ်တွေကို ထောက်ပံ့ပါတယ်။

ဒီမှာ constructor တစ်ခုနဲ့ public fields အနည်းငယ်ပါတဲ့ `Student` class တစ်ခု ဖန်တီးပါမယ်။
Classes နဲ့ interfaces တွေက ကောင်းကောင်း အလုပ်လုပ်တာကို သတိပြုပါ — programmer ကို သင့်တင့်တဲ့ abstraction အဆင့်ကို ရွေးချယ်ခွင့် ပေးပါတယ်။

နောက်ထပ် သတိပြုစရာက — constructor ရဲ့ parameters တွေပေါ်မှာ `public` သုံးတာက — အဲဒီနာမည်နဲ့ properties တွေကို အလိုအလျောက် ဖန်တီးပေးတဲ့ shorthand တစ်ခုပါ။

```ts
class Student {
  fullName: string;
  constructor(
    public firstName: string,
    public middleInitial: string,
    public lastName: string
  ) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.textContent = greeter(user);
```

`tsc greeter.ts` ကို ပြန် run ကြည့်ရင် — ထွက်လာတဲ့ JavaScript က အစောပိုင်း code နဲ့ အတူတူပဲ ဆိုတာ တွေ့ရပါလိမ့်မယ်။
TypeScript ထဲက Classes တွေက JavaScript မှာ မကြာခဏ သုံးနေကျ ဖြစ်တဲ့ prototype-based OO ရဲ့ shorthand တစ်ခုပဲ ဖြစ်ပါတယ်။

## TypeScript Web App ကို Run လုပ်ခြင်း

အခု `greeter.html` ထဲမှာ အောက်ပါအတိုင်း ရိုက်ထည့်ပါ:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>TypeScript Greeter</title>
  </head>
  <body>
    <script src="greeter.js"></script>
  </body>
</html>
```

သင့်ရဲ့ ပထမဆုံး ရိုးရှင်းတဲ့ TypeScript web application ကို run ဖို့ — browser ထဲမှာ `greeter.html` ကို ဖွင့်ပါ!

Optional: `greeter.ts` ကို Visual Studio ထဲမှာ ဖွင့်ပါ၊ ဒါမှမဟုတ် code ကို TypeScript playground ထဲကို ကူးယူပါ။
Identifiers တွေအပေါ်မှာ hover လုပ်ပြီး သူတို့ရဲ့ types တွေကို ကြည့်လို့ရပါတယ်။
တချို့ကိစ္စတွေမှာ ဒီ types တွေကို သင့်အတွက် အလိုအလျောက် infer လုပ်ပေးတာ သတိပြုပါ။
နောက်ဆုံး line ကို ပြန်ရိုက်ကြည့်ပြီး — DOM elements တွေရဲ့ types တွေကို အခြေခံတဲ့ completion lists နဲ့ parameter help တွေကို ကြည့်ပါ။
greeter function ရဲ့ reference ပေါ်မှာ cursor ထားပြီး — သူ့ရဲ့ definition ကိုသွားဖို့ F12 ကို နှိပ်ပါ။
Symbol တစ်ခုပေါ်မှာ right-click လုပ်ပြီး — refactoring နဲ့ rename လုပ်လို့လည်း ရတာ သတိပြုပါ။

ပေးထားတဲ့ type information တွေက tools တွေနဲ့ တွဲပြီး — application scale မှာ JavaScript နဲ့ အလုပ်လုပ်ဖို့ ကူညီပေးပါတယ်။
TypeScript နဲ့ ဖြစ်နိုင်တာတွေရဲ့ ဥပမာတွေ ပိုမိုသိရှိဖို့ — website ရဲ့ Samples section ကို ကြည့်ပါ။

![Visual Studio picture](https://www.typescriptlang.org/images/docs/greet_person.png)
