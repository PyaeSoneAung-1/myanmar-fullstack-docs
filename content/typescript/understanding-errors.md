---
title: "Understanding Errors (Error တွေကို နားလည်ခြင်း)"
description: "TypeScript error message တွေကို ဘယ်လို ဖတ်ရမလဲ — assignable to terminology, error elaborations, extra properties နဲ့ union assignments ဥပမာများ"
order: 15
source: "https://www.typescriptlang.org/docs/handbook/2/understanding-errors.html"
status: translated
updated: 2026-09-01
---

TypeScript က error တစ်ခု တွေ့တိုင်း — ဘာတွေ မှားသွားလဲဆိုတာကို တတ်နိုင်သမျှ အသေးစိတ် ရှင်းပြဖို့ ကြိုးစားပါတယ်။ သူ့ရဲ့ type system က structural (ဖွဲ့စည်းပုံအခြေပြု) ဖြစ်တာမို့ — ပြဿနာ ဘယ်မှာ တွေ့တယ်ဆိုတာကို နည်းနည်း ရှည်လျားတဲ့ ဖော်ပြချက်တွေနဲ့ ဖော်ပြလေ့ ရှိပါတယ်။

## Terminology (ဝေါဟာရများ)

Error messages တွေထဲမှာ မကြာခဏ တွေ့ရမယ့် — နားလည်ထားဖို့ အသုံးဝင်တဲ့ terminology တစ်ချို့ ရှိပါတယ်။

#### _assignable to_

TypeScript က — type တစ်ခုက တခြား type တစ်ခုအတွက် လက်ခံနိုင်လောက်တဲ့ အစားထိုး (substitute) ဖြစ်နေရင် — အဲဒီ type က နောက် type တစ်ခုဆီ _assignable to_ လို့ သတ်မှတ်ပါတယ်။ တစ်နည်းပြောရရင် — `Cat` တစ်ကောင်က `Animal` တစ်ကောင်အတွက် လက်ခံနိုင်လောက်တဲ့ အစားထိုး ဖြစ်လို့ — `Cat` က `Animal` ဆီ _assignable to_ ပါ။

နာမည်က ဖော်ပြသလိုပဲ — ဒီဆက်စပ်မှုကို `t` နဲ့ `s` ရဲ့ types တွေကို စစ်ဆေးခြင်းအားဖြင့် `t = s;` ဆိုတဲ့ assignment တစ်ခုရဲ့ မှန်ကန်မှုကို စစ်ဆေးဖို့ သုံးပါတယ်။ Type နှစ်ခု အပြန်အလှန် ထိတွေ့တဲ့ နေရာအများစုမှာလည်း သုံးပါတယ်။ ဥပမာ — function တစ်ခုကို ခေါ်တဲ့အခါ — argument တစ်ခုချင်းစီရဲ့ type က parameter ရဲ့ ကြေညာထားတဲ့ type ဆီ _assignable to_ ဖြစ်ရပါတယ်။

အလွတ်သဘော ပြောရရင် — `T is not assignable to S` လို့ မြင်ရရင် — TypeScript က "_`T` နဲ့ `S` က compatible မဟုတ်ဘူး_" လို့ ပြောနေတာလို့ ထင်မှတ်နိုင်ပါတယ်။ ဒါပေမယ့် — ဒါက _directional_ (ဦးတည်ချက်ရှိတဲ့) ဆက်စပ်မှုတစ်ခုဆိုတာ သတိပြုပါ: `S` က `T` ဆီ assignable ဖြစ်တာက `T` က `S` ဆီ assignable ဖြစ်တယ်လို့ မဆိုလိုပါဘူး။

## ဥပမာများ

Error message ဥပမာတစ်ချို့ကို ကြည့်ပြီး — ဘာတွေ ဖြစ်နေလဲဆိုတာ နားလည်ကြည့်ရအောင်။

### Error Elaborations (Error ရှင်းလင်းချက်များ)

Error တစ်ခုချင်းစီက ဦးဆောင် message တစ်ခုနဲ့ စတင်ပြီး — တစ်ခါတလေ sub-messages တွေ နောက်ကလိုက်ပါတယ်။ Sub-message တစ်ခုချင်းစီကို — အပေါ်က message အကြောင်း "ဘာလို့လဲ?" ဆိုတဲ့ မေးခွန်းကို ဖြေပေးနေတာလို့ ထင်မှတ်နိုင်ပါတယ်။ လက်တွေ့မှာ ဘယ်လို အလုပ်လုပ်လဲဆိုတာ သိဖို့ ဥပမာတစ်ချို့ကို ဖြတ်သန်းကြည့်ရအောင်။

ဥပမာကိုယ်တိုင်ထက် ပိုရှည်တဲ့ error message ထုတ်ပေးတဲ့ ဥပမာတစ်ခု ဒီမှာ ပါပါတယ်:

```ts
let a: { m: number[] };
let b = { m: [""] };
a = b;
```

TypeScript က နောက်ဆုံး line ကို check လုပ်တဲ့အခါ error တစ်ခု တွေ့ပါတယ်။ Error ထုတ်ပေးတဲ့ သူ့ရဲ့ logic က — assignment က အဆင်ပြေလားဆိုတာ ဆုံးဖြတ်တဲ့ logic ကနေ ဆင့်ပွား လာပါတယ်:

1. `b` ရဲ့ type က `a` ရဲ့ type ဆီ assignable လား? မဟုတ်ဘူး။ ဘာလို့လဲ?
2. `m` property ရဲ့ type က incompatible (မကိုက်ညီ) လို့ပါ။ ဘာလို့လဲ?
3. `b` ရဲ့ `m` property (`string[]`) က `a` ရဲ့ `m` property (`number[]`) ဆီ assignable မဟုတ်လို့ပါ။ ဘာလို့လဲ?
4. Array တစ်ခုရဲ့ element type (`string`) က နောက်တစ်ခု (`number`) ဆီ assignable မဟုတ်လို့ပါ

### Extra Properties (အပို Properties)

```ts
type A = { m: number };
const a: A = { m: 10, n: "" };
```

ဒီမှာ `a` ကို `A` type နဲ့ ကြေညာထားပေမယ့် — object literal ထဲမှာ `A` မှာ မရှိတဲ့ `n` ဆိုတဲ့ property အပို ပါဝင်နေလို့ error တက်ပါတယ် (error 2322)။

### Union Assignments (Union Assignment များ)

```ts
type Thing = "none" | { name: string };

const a: Thing = { name: 0 };
```

ဒီမှာ `Thing` က union type — `"none"` ဒါမှမဟုတ် `{ name: string }` ပါ။ `{ name: 0 }` က `name` property မှာ `number` ပါနေလို့ — `Thing` ဆီ assignable မဟုတ်တာမို့ error တက်ပါတယ် (error 2322)။
