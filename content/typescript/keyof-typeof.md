---
title: "keyof Type Operator"
description: "keyof operator က object type တစ်ခုရဲ့ key တွေကို string/numeric literal union အဖြစ် ဘယ်လို ပြောင်းပေးလဲ ဆိုတာအကြောင်း"
order: 8
source: "https://www.typescriptlang.org/docs/handbook/2/keyof-types.html"
status: translated
updated: 2026-09-01
---

## `keyof` Type Operator (keyof type operator ဆိုတာ)

`keyof` operator က object type တစ်ခုကို ယူပြီး — သူ့ရဲ့ key တွေရဲ့ string ဒါမှမဟုတ် numeric literal union ကို ထုတ်ပေးပါတယ်။ အောက်က `P` type က `type P = "x" | "y"` နဲ့ အတူတူပါ:

```ts
type Point = { x: number; y: number };
type P = keyof Point;
```

Type မှာ `string` ဒါမှမဟုတ် `number` index signature ရှိရင် — `keyof` က အဲဒီ type တွေကို ပြန်ပေးပါတယ်:

```ts
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
```

ဒီဥပမာမှာ `M` က `string | number` ဖြစ်တာ သတိပြုပါ — ဘာလို့လဲဆိုတော့ JavaScript မှာ object key တွေက အမြဲတမ်း string ဆီ coerced (ပြောင်းလဲ) လုပ်ခံရလို့ပါ — ဒါကြောင့် `obj[0]` က `obj["0"]` နဲ့ အမြဲတမ်း အတူတူပဲ ဖြစ်ပါတယ်။

`keyof` types တွေက mapped types တွေနဲ့ တွဲသုံးတဲ့အခါ အထူး အသုံးဝင်ပါတယ် — နောက်ပိုင်းမှာ လေ့လာရပါမယ်။
