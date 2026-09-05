---
title: "Typeof Type Operator (typeof type operator ဆိုတာ)"
description: "Type context ထဲမှာ `typeof` operator ကို သုံးပြီး variable ဒါမှမဟုတ် property တစ်ခုရဲ့ type ကို ရည်ညွှန်းနည်း — `ReturnType<T>` နဲ့ တွဲသုံးပုံ နဲ့ `typeof` သုံးလို့ရတဲ့ နေရာတွေရဲ့ ကန့်သတ်ချက်များ (Limitations)"
order: 27
source: "https://www.typescriptlang.org/docs/handbook/2/typeof-types.html"
status: translated
updated: 2026-09-05
---

## `typeof` Type Operator (typeof type operator ဆိုတာ)

JavaScript မှာ — _expression_ (ဖော်ပြချက်) context တစ်ခုထဲမှာ သုံးလို့ရတဲ့ `typeof` operator တစ်ခု ရှိပြီးသားပါ:

```ts twoslash
// Prints "string"
console.log(typeof "Hello world");
```

TypeScript က — _type_ context တစ်ခုထဲမှာ သုံးလို့ရတဲ့ `typeof` operator တစ်ခုကို ထပ်ဖြည့်ပေးပါတယ် — variable တစ်ခု ဒါမှမဟုတ် property တစ်ခုရဲ့ _type_ ကို ရည်ညွှန်းဖို့ပါ:

```ts twoslash
let s = "hello";
let n: typeof s;
//  ^?
```

ဒါက basic types တွေအတွက်တော့ သိပ်ပြီး အသုံးမဝင်ပါဘူး — ဒါပေမယ့် တခြား type operators တွေနဲ့ တွဲသုံးလိုက်တဲ့အခါ — `typeof` ကို သုံးပြီး pattern များစွာကို အဆင်ပြေပြေ ဖော်ပြနိုင်ပါတယ်။ ဥပမာတစ်ခု အနေနဲ့ — ကြိုတင် သတ်မှတ်ထားတဲ့ (predefined) `ReturnType<T>` type ကနေ စလိုက်ရအောင်။ ဒါက _function type_ တစ်ခုကို ယူပြီး သူ့ရဲ့ return type ကို ထုတ်ပေးပါတယ်:

```ts twoslash
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
//   ^?
```

`ReturnType` ကို function name တစ်ခုပေါ်မှာ သုံးကြည့်ရင် — သင်ခန်းစာ ရစေမယ့် error တစ်ခု တွေ့ရပါတယ်:

```ts twoslash
// @errors: 2749
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;
```

_values_ (တန်ဖိုးများ) နဲ့ _types_ (အမျိုးအစားများ) က အတူတူ မဟုတ်ဘူးဆိုတာ သတိရပါ။ _value `f`_ မှာ ရှိတဲ့ _type_ ကို ရည်ညွှန်းဖို့ — `typeof` ကို သုံးပါတယ်:

```ts twoslash
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
//   ^?
```

## ကန့်သတ်ချက်များ (Limitations)

TypeScript က `typeof` ကို သုံးလို့ရတဲ့ expressions အမျိုးအစားတွေကို ရည်ရွယ်ချက်ရှိရှိ ကန့်သတ်ထားပါတယ်။

တိတိကျကျ ဆိုရရင် — `typeof` ကို identifiers (နာမည်များ — variable နာမည်တွေ) ဒါမှမဟုတ် သူတို့ရဲ့ properties တွေပေါ်မှာပဲ သုံးလို့ရပါတယ်။ ဒါက — သင်က code တွေ run ဖြစ်နေတယ်လို့ ထင်ရပေမယ့် တကယ်တော့ မဟုတ်ဘူးဆိုတဲ့ ရှုပ်ထွေးစေတတ်တဲ့ ထောင်ချောက် (trap) ကို ရှောင်ရှားပေးပါတယ်:

```ts twoslash
// @errors: 1005
declare const msgbox: (prompt: string) => boolean;
// type msgbox = any;
// ---cut---
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
```
