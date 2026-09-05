---
title: "The Basics (အခြေခံ သဘောတရားများ)"
description: "TypeScript ရဲ့ ပထမဆုံး ခြေလှမ်း — static type-checking, type annotations, `tsc` compiler, downleveling နဲ့ strictness settings (noImplicitAny, strictNullChecks) တို့ရဲ့ အခြေခံ"
order: 26
source: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html"
status: translated
updated: 2026-09-05
---

JavaScript ထဲက value (တန်ဖိုး) တိုင်းမှာ — မတူညီတဲ့ operations (လုပ်ဆောင်ချက်များ) run လုပ်ကြည့်ခြင်းအားဖြင့် လေ့လာလို့ရတဲ့ behaviors (အပြုအမူများ) အစုတစ်စု ရှိပါတယ်။ ဒါက စိတ္တဇ (abstract) ဆန်ပုံ ရပေမယ့် — ဥပမာ မြန်မြန် ကြည့်ကြည့်ရအောင် — `message` ဆိုတဲ့ variable တစ်ခုပေါ်မှာ run လုပ်နိုင်မယ့် operations တစ်ချို့ကို စဉ်းစားကြည့်ပါ။

```js
// Accessing the property 'toLowerCase'
// on 'message' and then calling it
message.toLowerCase();

// Calling 'message'
message();
```

ပိုင်းခြားကြည့်ရရင် — ပထမ run လို့ရတဲ့ code ကြောင်းက `toLowerCase` ဆိုတဲ့ property တစ်ခုကို ဝင်ရောက်ကြည့်ပြီး အဲဒါကို ခေါ်ပါတယ်။ ဒုတိယကြောင်းကတော့ `message` ကို တိုက်ရိုက် ခေါ်ဖို့ ကြိုးစားပါတယ်။

ဒါပေမယ့် `message` ရဲ့ value ကို မသိဘူးလို့ ယူဆလိုက်ရင် — ဒါက တော်တော်လေး အဖြစ်များတဲ့ အခြေအနေပါ — ဒီ code တွေထဲက တစ်ခုခုကို run လုပ်ကြည့်ရင် ဘယ်လို ရလဒ်တွေ ရမယ်ဆိုတာ ယုံကြည်စိတ်ချစွာ ပြောလို့ မရပါဘူး။ Operation တစ်ခုချင်းစီရဲ့ အပြုအမူဟာ — မူလက ဘာ value ရှိခဲ့လဲဆိုတာပေါ်မှာပဲ လုံးလုံး မူတည်နေလို့ပါ။

- `message` ကို ခေါ်လို့ရလား (callable)?
- သူ့အပေါ်မှာ `toLowerCase` ဆိုတဲ့ property တစ်ခု ရှိလား?
- ရှိတယ်ဆိုရင် — `toLowerCase` ကိုကော ခေါ်လို့ရလား?
- ဒီ value နှစ်ခုလုံး ခေါ်လို့ရတယ်ဆိုရင် — သူတို့က ဘာတွေ ပြန်ပေးကြလဲ?

ဒီမေးခွန်းတွေရဲ့ အဖြေတွေက JavaScript ရေးတဲ့အခါ ကိုယ့်ခေါင်းထဲမှာ သိမ်းထားရတဲ့ အချက်တွေ ဖြစ်ပြီး — အသေးစိတ်တိုင်း မှန်ကန်နေဖို့တော့ မျှော်လင့်နေရုံပဲ ရှိပါတယ်။

`message` ကို အောက်ပါအတိုင်း သတ်မှတ်ထားတယ်လို့ ဆိုကြပါစို့။

```js
const message = "Hello World!";
```

ခန့်မှန်းကြည့်လို့ ရတဲ့အတိုင်းပဲ — `message.toLowerCase()` ကို run လုပ်ကြည့်ရင် — စာလုံးအသေး (lower-case) ပြောင်းထားတဲ့ string ကိုပဲ ပြန်ရမှာပါ။

ဒုတိယ code ကြောင်းကျတော့ရော? JavaScript နဲ့ ရင်းနှီးပြီးသားဆိုရင် — ဒါက exception (ခြွင်းချက်) တစ်ခုနဲ့ ကျရှုံးမယ်ဆိုတာ သိပါလိမ့်မယ်:

```txt
TypeError: message is not a function
```

ဒီလို အမှားမျိုးတွေကို ရှောင်နိုင်ရင် ကောင်းမှာပဲ။

Code run လုပ်တဲ့အခါ — JavaScript runtime က ဘာဆက်လုပ်ရမယ်ဆိုတာ ဆုံးဖြတ်တဲ့နည်းကတော့ — value ရဲ့ _type_ (အမျိုးအစား) ကို ခွဲခြားသိရှိခြင်းအားဖြင့်ပါ — ဆိုလိုတာက အဲဒီ value မှာ ဘယ်လို behaviors တွေနဲ့ စွမ်းဆောင်နိုင်မှုတွေ ရှိလဲဆိုတာကို သိခြင်းပါ။ ဒါက `TypeError` ရည်ညွှန်းနေတဲ့ အဓိပ္ပါယ်ရဲ့ တစ်စိတ်တစ်ပိုင်းပါ — `"Hello World!"` ဆိုတဲ့ string ကို function တစ်ခုအနေနဲ့ ခေါ်လို့မရဘူးလို့ ပြောနေတာပါ။

`string` နဲ့ `number` လို primitive values တွေလိုမျိုး value တစ်ချို့အတွက်တော့ — `typeof` operator ကို သုံးပြီး runtime မှာ သူတို့ရဲ့ type ကို ခွဲခြားသိလို့ရပါတယ်။ ဒါပေမယ့် functions တွေလို တခြားအရာတွေအတွက်ကတော့ — type တွေကို ခွဲခြားဖို့ သက်ဆိုင်တဲ့ runtime ယန္တရား (mechanism) မရှိပါဘူး။ ဥပမာ — ဒီ function ကို ကြည့်ပါ:

```js
function fn(x) {
  return x.flip();
}
```

Code ဖတ်ကြည့်ရုံနဲ့ — ဒီ function က ခေါ်လို့ရတဲ့ `flip` property တစ်ခု ပါတဲ့ object တစ်ခုကို ပေးမှသာ အလုပ်လုပ်မယ်ဆိုတာ _သတိပြုမိ_ နိုင်ပါတယ်။ ဒါပေမယ့် JavaScript ကတော့ ဒီအချက်အလက်ကို — code run နေတုန်း စစ်ဆေးလို့ရတဲ့ပုံစံနဲ့ — ထုတ်ပြ မပေးပါဘူး။ Pure JavaScript မှာ `fn` က value တစ်ခုကို ဘာလုပ်ပေးမလဲဆိုတာ သိဖို့ တစ်ခုတည်းသော နည်းလမ်းက — အဲဒါကို ခေါ်ကြည့်ပြီး ဘာဖြစ်မလဲ ကြည့်တာပါပဲ။ ဒီလို အပြုအမူမျိုးက code ကို run မလုပ်ခင် ဘာတွေ လုပ်မယ်ဆိုတာ ကြိုတွက်ရခက်စေပြီး — ဆိုလိုတာက code ရေးနေတုန်းမှာ ကိုယ့် code က ဘာဖြစ်သွားမယ်ဆိုတာ သိဖို့ ပိုခက်စေပါတယ်။

ဒီရှုထောင့်ကနေ ကြည့်ရင် — _type_ ဆိုတာ ဘယ် values တွေကို `fn` ဆီ ပို့လို့ရမယ်၊ ဘယ်ဟာတွေက crash (ပျက်စီး) သွားမယ်ဆိုတာကို ဖော်ပြတဲ့ အယူအဆပါ။ JavaScript က တကယ်တော့ _dynamic_ typing ကိုပဲ ပေးပါတယ် — code ကို run လုပ်ပြီးမှ ဘာဖြစ်လဲ ကြည့်ရတဲ့ ပုံစံပါ။

အခြားရွေးချယ်စရာကတော့ — _static_ type system ကို သုံးပြီး code ကို run မလုပ်ခင် _ကြိုတင်၍_ code က ဘာလုပ်ဖို့ မျှော်လင့်ထားလဲ ခန့်မှန်းတာပါ။

## Static Type-Checking (Static Type စစ်ဆေးခြင်း)

အစောပိုင်းက `string` တစ်ခုကို function အနေနဲ့ ခေါ်ဖို့ ကြိုးစားလို့ ရခဲ့တဲ့ `TypeError` အကြောင်း ပြန်စဉ်းစားကြည့်ပါ။ _လူအများစု_ က code run လုပ်တဲ့အခါ error ဘယ်လိုမျိုးကိုမဆို ရတာကို မကြိုက်ကြပါဘူး — အဲဒါတွေကို bugs (ချွတ်ယွင်းချက်များ) တွေလို့ သတ်မှတ်ကြလို့ပါ! ပြီးတော့ code အသစ်တွေ ရေးတဲ့အခါ — bug အသစ်တွေ မပါဝင်အောင် အတတ်နိုင်ဆုံး ကြိုးစားပါတယ်။

Code နည်းနည်းပဲ ထပ်ဖြည့်ပြီး file ကို save လုပ်၊ code ကို ပြန် run လုပ်လိုက်တာနဲ့ error ကို ချက်ချင်း မြင်ရရင် — ပြဿနာကို မြန်မြန် သီးခြားခွဲထုတ်နိုင်ပါတယ်။ ဒါပေမယ့် အမြဲတော့ မဟုတ်ပါဘူး။ Feature တစ်ခုကို သေချာကျန မစမ်းသပ်ဖြစ်တာမျိုး ရှိနိုင်လို့ — ဖြစ်လာနိုင်တဲ့ error တစ်ခုကို တကယ်တော့ ဘယ်တော့မှ မကြုံရဘဲ ဖြစ်နေနိုင်ပါတယ်! ဒါမှမဟုတ် error ကို ကံကောင်းထောက်မစွာ မြင်လိုက်ရရင်တောင် — refactoring (ဖွဲ့စည်းပုံ ပြန်စီစဉ်ခြင်း) အကြီးကြီးတွေ လုပ်ပြီး ရှာဖွေဖတ်ရှုရမယ့် code အမျိုးမျိုး အများကြီး ထပ်ထည့်မိနေတာ ဖြစ်နိုင်ပါတယ်။

အကောင်းဆုံးကတော့ — code run မလုပ်ခင် _ကြိုတင်_ bug တွေကို ရှာဖွေပေးနိုင်တဲ့ tool တစ်ခု ရှိရင် ကောင်းမှာပါ။ ဒါက TypeScript လို static type-checker (static type စစ်ဆေးကိရိယာ) တစ်ခု လုပ်ပေးတဲ့အရာပဲ ဖြစ်ပါတယ်။ _Static type systems_ တွေက — program တွေ run လုပ်တဲ့အခါ ကိုယ့်ရဲ့ values တွေက ဘယ်လို shapes (ပုံသဏ္ဌာန်များ) တွေနဲ့ behaviors တွေ ရှိမယ်ဆိုတာကို ဖော်ပြပါတယ်။ TypeScript လို type-checker တစ်ခုက အဲဒီအချက်အလက်တွေကို သုံးပြီး — အရာတွေ လွဲချော်နေနိုင်တဲ့အချိန်တွေမှာ ကျွန်တော်တို့ကို ပြောပြပေးပါတယ်။

```ts twoslash
// @errors: 2349
const message = "hello!";

message();
```

အဲဒီနောက်ဆုံး နမူနာကို TypeScript နဲ့ run လုပ်ကြည့်ရင် — code ကို မဖွင့်မီကတည်းက (run မလုပ်ခင်ကတည်းက) error message တစ်ခု ရပါလိမ့်မယ်။

## Exception မဟုတ်တဲ့ ကျရှုံးမှုများ (Non-Exception Failures)

ဒီအထိ ဆွေးနွေးခဲ့တာတွေက runtime errors တွေလို အရာတွေပါ — JavaScript runtime က တစ်ခုခု အဓိပ္ပါယ်မဲ့နေတယ်လို့ သူ ယူဆကြောင်း ကျွန်တော်တို့ကို ပြောပြတဲ့ အခြေအနေတွေပါ။ ဒီအခြေအနေတွေ ပေါ်ပေါက်လာရတာက — [ECMAScript specification](https://tc39.github.io/ecma262/) မှာ language က မမျှော်လင့်ထားတဲ့အရာတစ်ခုကို ကြုံတွေ့တဲ့အခါ ဘယ်လို ပြုမူရမယ်ဆိုတဲ့ တိကျတဲ့ ညွှန်ကြားချက်တွေ ပါဝင်နေလို့ပါ။

ဥပမာ — specification အရ ဆိုရင် ခေါ်လို့မရတဲ့အရာတစ်ခုကို ခေါ်ဖို့ ကြိုးစားရင် error တစ်ခု throw (ပစ်တင်) လုပ်သင့်ပါတယ်။ ဒါက "သိသာထင်ရှားတဲ့ အပြုအမူ" လို့ ထင်ရနိုင်ပေမယ့် — object တစ်ခုပေါ်မှာ မရှိတဲ့ property တစ်ခုကို ဝင်ရောက်ကြည့်ရင်လည်း error ပစ်သင့်တယ်လို့ စိတ်ကူးကြည့်နိုင်ပါတယ်။ ဒါပေမယ့် JavaScript ကတော့ မတူတဲ့ အပြုအမူကို ပြသပြီး `undefined` ဆိုတဲ့ value ကို ပြန်ပေးပါတယ်:

```js
const user = {
  name: "Daniel",
  age: 26,
};

user.location; // returns undefined
```

အဆုံးစွန်အားဖြင့် — static type system တစ်ခုက သူ့စနစ်ထဲမှာ ဘယ် code ကို error အဖြစ် အလံပြ (flag) ရမလဲဆိုတာ ဆုံးဖြတ်ပေးရပါတယ် — ချက်ချင်း error မပစ်တဲ့ "တရားဝင် (valid)" JavaScript ဖြစ်နေရင်တောင် ဖြစ်ပါတယ်။ TypeScript မှာတော့ အောက်ပါ code က `location` ကို သတ်မှတ်မထားဘူးဆိုတဲ့ error တစ်ခု ထုတ်ပေးပါတယ်:

```ts twoslash
// @errors: 2339
const user = {
  name: "Daniel",
  age: 26,
};

user.location;
```

တစ်ခါတလေ ဒါက ဖော်ပြနိုင်တဲ့အရာတွေမှာ trade-off (အပေးအယူ) တစ်ခု ဖြစ်စေနိုင်ပေမယ့် — ရည်ရွယ်ချက်က program တွေထဲက တကယ့် bugs တွေကို ဖမ်းမိဖို့ပါ။ ပြီးတော့ TypeScript က legitimate bugs တွေကို _အများကြီး_ ဖမ်းမိပါတယ်။

ဥပမာ — စာလုံး ပေါင်းသတ်မှားတာ (typos) တွေ၊

```ts twoslash
// @noErrors
const announcement = "Hello World!";

// How quickly can you spot the typos?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();

// We probably meant to write this...
announcement.toLocaleLowerCase();
```

မခေါ်ရသေးတဲ့ functions တွေ (uncalled functions)၊

```ts twoslash
// @noUnusedLocals
// @errors: 2365
function flipCoin() {
  // Meant to be Math.random()
  return Math.random < 0.5;
}
```

ဒါမှမဟုတ် အခြေခံ logic errors (ယုတ္တိ အမှားများ) တွေပါ။

```ts twoslash
// @errors: 2367
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
  // ...
} else if (value === "b") {
  // Oops, unreachable
}
```

## Tooling အတွက် Types (Types for Tooling)

TypeScript က code ထဲမှာ အမှားတွေ လုပ်မိတဲ့အခါ bugs တွေကို ဖမ်းမိနိုင်ပါတယ်။ ဒါက ကောင်းပါတယ်။ ဒါပေမယ့် TypeScript က အဲဒီအမှားတွေကို ပထမနေရာကတည်းက မလုပ်မိအောင်လည်း _ကာကွယ်_ ပေးနိုင်ပါတယ်။

Type-checker မှာ — variable တွေနဲ့ property တွေပေါ်မှာ မှန်ကန်တဲ့ properties တွေကို ဝင်ရောက်နေသလားဆိုတာလို အရာတွေကို စစ်ဆေးဖို့ အချက်အလက်တွေ ရှိပါတယ်။ အဲဒီအချက်အလက်တွေ ရပြီဆိုတာနဲ့ — ဘယ် properties တွေကို သင်သုံးချင်လောက်မလဲဆိုတာကိုလည်း _အကြံပြု_ ပေးနိုင်ပါတော့တယ်။

ဆိုလိုတာက TypeScript ကို code တည်းဖြတ်ရာမှာလည်း အသုံးချနိုင်ပြီး — core type-checker က editor ထဲမှာ စာရိုက်နေတုန်း error messages တွေနဲ့ code completion (ကုဒ် အလိုအလျောက် ဖြည့်ပေးခြင်း) တွေကို ပေးစွမ်းနိုင်ပါတယ်။ ဒါက TypeScript မှာ tooling အကြောင်း ပြောဆိုကြတဲ့အခါ လူတွေ မကြာခဏ ရည်ညွှန်းလေ့ရှိတဲ့အရာရဲ့ တစ်စိတ်တစ်ပိုင်းပါ။

```ts twoslash
// @noErrors
// @esModuleInterop
import express from "express";
const app = express();

app.get("/", function (req, res) {
  res.sen
//       ^|
});

app.listen(3000);
```

TypeScript က tooling ကို အလေးအနက် သဘောထားပါတယ် — ပြီးတော့ ဒါက စာရိုက်နေတုန်း ရတဲ့ completions တွေနဲ့ errors တွေထက် ပိုပါသေးတယ်။ TypeScript ကို ပံ့ပိုးတဲ့ editor တစ်ခုက — errors တွေကို အလိုအလျောက် ပြင်ပေးတဲ့ "quick fixes" (အမြန် ပြင်ဆင်ချက်များ)၊ code တွေကို လွယ်ကူစွာ ပြန်ဖွဲ့စည်းဖို့ refactorings (ဖွဲ့စည်းပုံ ပြန်စီစဉ်ခြင်းများ)၊ ပြီးတော့ variable တစ်ခုရဲ့ definition (သတ်မှတ်ရာနေရာ) ဆီ ခုန်သွားဖို့ ဒါမှမဟုတ် variable တစ်ခုကို ရည်ညွှန်းထားတဲ့ နေရာအားလုံးကို ရှာဖွေဖို့ အသုံးဝင်တဲ့ navigation features တွေကို ပေးစွမ်းနိုင်ပါတယ်။ ဒါအားလုံးက type-checker ပေါ်မှာ တည်ဆောက်ထားပြီး platform အားလုံးမှာ အပြည့်အဝ အလုပ်လုပ်တာမို့ — [သင့်အကြိုက်ဆုံး editor တွေမှာ TypeScript support ရရှိနိုင်ဖို့ များပါတယ်](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support)။

## `tsc` — TypeScript Compiler (TypeScript Code ကို Compile လုပ်ပေးသည့် Tool)

ဒီအထိ type-checking အကြောင်း ပြောနေခဲ့ပေမယ့် — ကိုယ့်ရဲ့ type-_checker_ ကိုတော့ မသုံးရသေးပါဘူး။ မိတ်ဆွေအသစ်ဖြစ်တဲ့ `tsc` — TypeScript compiler နဲ့ ရင်းနှီးအောင် လုပ်ကြည့်ရအောင်။ ပထမဆုံး npm ကနေ ဒါကို ရယူဖို့ လိုပါမယ်။

```sh
npm install -g typescript
```

> ဒါက TypeScript Compiler `tsc` ကို global အနေနဲ့ install လုပ်ပေးပါတယ်။
> `tsc` ကို local `node_modules` package ကနေ run ချင်တယ်ဆိုရင်တော့ — `npx` ဒါမှမဟုတ် အလားတူ tools တွေကို သုံးနိုင်ပါတယ်။

အခု folder အလွတ်တစ်ခုဆီ ရွှေ့ပြီး — ကိုယ့်ရဲ့ ပထမဆုံး TypeScript program ဖြစ်တဲ့ `hello.ts` ကို ရေးကြည့်ရအောင်:

```ts twoslash
// Greets the world.
console.log("Hello world!");
```

ဒီမှာ အပိုတန်ဆာပလာ (frills) တွေ မပါတာ သတိပြုပါ — ဒီ "hello world" program က JavaScript မှာ "hello world" program တစ်ခု ရေးမယ်ဆိုရင် ရေးရမယ့်ပုံစံနဲ့ တစ်ထပ်တည်း တူညီပါတယ်။ အခုတော့ — `typescript` package က ကျွန်တော်တို့အတွက် install လုပ်ပေးထားတဲ့ `tsc` command ကို run လုပ်ပြီး type-check လုပ်ကြည့်ရအောင်။

```sh
tsc hello.ts
```

တာဒါ! ခဏစောင့် — "တာဒါ" ဆိုတာ _ဘာအတွက်_ လဲ? `tsc` ကို run လုပ်လိုက်တာ — ဘာမှ မဖြစ်ခဲ့ပါလား! ကောင်းပြီ — type errors တွေ မရှိခဲ့လို့ — အစီရင်ခံစရာ ဘာမှ မရှိတဲ့အတွက် console ထဲမှာ output ဘာမှ မရခဲ့တာပါ။

ဒါပေမယ့် နောက်တစ်ခါ ပြန်စစ်ကြည့်ပါ — ကျွန်တော်တို့ ရခဲ့တာက _file_ output တစ်ခုပါ။ လက်ရှိ directory ထဲကို ကြည့်ရင် — `hello.ts` ဘေးမှာ `hello.js` ဆိုတဲ့ file တစ်ခု တွေ့ရပါမယ်။ ဒါက `tsc` က `hello.ts` ကို _compile_ (စုစည်း) လုပ် ဒါမှမဟုတ် _transform_ (ပြောင်းလဲ) လုပ်ပြီး — ရိုးရိုး JavaScript file အဖြစ် ထုတ်ပေးလိုက်တဲ့ ရလဒ်ပါ။ ပြီးတော့ contents တွေကို စစ်ကြည့်ရင် — TypeScript က `.ts` file တစ်ခုကို process လုပ်ပြီးနောက် ဘာတွေ ထုတ်ပေးလဲ မြင်ရပါမယ်:

```js
// Greets the world.
console.log("Hello world!");
```

ဒီကိစ္စမှာတော့ TypeScript အတွက် transform လုပ်စရာ နည်းလွန်းလို့ — ကျွန်တော်တို့ ရေးထားတာနဲ့ တစ်ထပ်တည်း တူနေပါတယ်။ Compiler က — လူတစ်ယောက် ရေးလိုက်တာနဲ့ တူတဲ့ သပ်ရပ်ပြီး ဖတ်ရလွယ်တဲ့ code ကို emit (ထုတ်လွှတ်) ဖို့ ကြိုးစားပါတယ်။ အဲဒါ အမြဲတော့ မလွယ်ပေမယ့် — TypeScript က indent (အကွက်ချ) ခြင်းကို တသမတ်တည်း လုပ်ဆောင်ပြီး — code က line အမျိုးမျိုးပေါ် ဖြန့်ကျက်နေတဲ့အခါ ဂရုစိုက်ပြီး — comments တွေကိုလည်း ထိန်းသိမ်းထားဖို့ ကြိုးစားပါတယ်။

ကျွန်တော်တို့ type-checking error တစ်ခုကို _တကယ်_ ထည့်ကြည့်ရင်ရော? `hello.ts` ကို ပြန်ရေးကြည့်ရအောင်:

```ts twoslash
// @noErrors
// This is an industrial-grade general-purpose greeter function:
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan");
```

`tsc hello.ts` ကို နောက်တစ်ခါ run လုပ်ရင် — command line ပေါ်မှာ error တစ်ခု ရတာ သတိပြုပါ!

```txt
Expected 2 arguments, but got 1.
```

TypeScript က `greet` function ဆီ argument တစ်ခု ပို့ဖို့ မေ့နေတယ်လို့ ပြောနေတာပါ — ပြီးတော့ ဒါက မှန်ကန်တဲ့ ပြောဆိုမှုပါ။ ဒီအထိ ကျွန်တော်တို့ ရေးခဲ့တာတွေက standard JavaScript ချည်းပဲ ဖြစ်ပေမယ့် — type-checking က ကိုယ့် code ထဲက ပြဿနာတွေကို ရှာတွေ့နိုင်ခဲ့ပါတယ်။ TypeScript ကို ကျေးဇူးပါ!

## Errors ရှိနေလျက် Emit လုပ်ခြင်း (Emitting with Errors)

နောက်ဆုံး ဥပမာကနေ သတိမထားမိလိုက်တဲ့ အချက်တစ်ချက်က — ကိုယ့်ရဲ့ `hello.js` file က နောက်တစ်ခါ ပြောင်းလဲသွားတာပါ။ အဲဒီ file ကို ဖွင့်ကြည့်ရင် — contents တွေက ကျွန်တော်တို့ရဲ့ input file နဲ့ အခြေခံအားဖြင့် အတူတူပဲ ရှိနေတာ တွေ့ရပါမယ်။ `tsc` က ကိုယ့် code အကြောင်း error တစ်ခု သတင်းပို့ခဲ့တာမို့ ဒါက နည်းနည်း အံ့သြစရာ ကောင်းနိုင်ပေမယ့် — ဒါက TypeScript ရဲ့ core values (အဓိက တန်ဖိုးများ) ထဲက တစ်ခုပေါ်မှာ အခြေခံထားတာပါ — အချိန်အများစုမှာ TypeScript ထက် _သင်က_ ပိုသိနေတတ်လို့ပါ။

အစောပိုင်းကလို ထပ်ပြောရရင် — type-checking လုပ်ထားတဲ့ code က run လို့ရတဲ့ program အမျိုးအစားတွေကို ကန့်သတ်လိုက်တာမို့ — type-checker တစ်ခုက ဘယ်လိုအရာတွေကို လက်ခံနိုင်တယ်လို့ ယူဆလဲဆိုတာမှာ trade-off တစ်ခု ရှိပါတယ်။ အများစုသော အချိန်တွေမှာ ဒါက အဆင်ပြေပေမယ့် — အဲဒီ checks တွေက အနှောင့်အယှက် ဖြစ်လာတဲ့ အခြေအနေတွေလည်း ရှိပါတယ်။

ဥပမာ — JavaScript code တွေကို TypeScript ဆီ migrate (ပြောင်းရွှေ့) လုပ်ပြီး type-checking errors တွေ ဝင်လာတဲ့ အခြေအနေကို စိတ်ကူးကြည့်ပါ။ နောက်ဆုံးတော့ type-checker အတွက် အရာတွေကို ရှင်းလင်းဖို့ အချိန်ရလာမှာပါ — ဒါပေမယ့် မူလ JavaScript code က အလုပ်ဖြစ်နေပြီးသားပဲ မဟုတ်လား! TypeScript ဆီ ပြောင်းလိုက်လို့ — ဒါကို run လုပ်ခွင့် ဘာလို့ ရပ်တန့်စေရမှာလဲ?

ဒါကြောင့် TypeScript က သင့်ကို အနှောင့်အယှက် မဖြစ်စေပါဘူး။ တကယ်တော့ အချိန်ကြာလာတာနဲ့အမျှ — အမှားတွေကို နည်းနည်း ပိုကာကွယ်ချင်ပြီး TypeScript ကို နည်းနည်း ပိုတင်းကျပ်စွာ ပြုမူစေချင်လာနိုင်ပါတယ်။ အဲဒီလိုအခါမျိုးမှာ — [`noEmitOnError`](https://www.typescriptlang.org/tsconfig#noEmitOnError) compiler option ကို သုံးနိုင်ပါတယ်။ `hello.ts` file ကို ပြောင်းပြီး — အဲဒီ flag နဲ့ `tsc` ကို run လုပ်ကြည့်ပါ:

```sh
tsc --noEmitOnError hello.ts
```

`hello.js` က ဘယ်တော့မှ update မဖြစ်တော့တာ သင်သတိပြုမိပါလိမ့်မယ်။

## ထင်ရှားစွာ သတ်မှတ်တဲ့ Types (Explicit Types)

ဒီအထိ — `person` နဲ့ `date` က ဘာလဲဆိုတာ TypeScript ကို မပြောပြရသေးပါဘူး။ `person` က `string` ဖြစ်ပြီး `date` က `Date` object တစ်ခု ဖြစ်သင့်တယ်လို့ TypeScript ကို ပြောပြဖို့ code ကို တည်းဖြတ်ကြည့်ရအောင်။ `date` ပေါ်မှာ `toDateString()` method ကိုလည်း သုံးပါမယ်။

```ts twoslash
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

ကျွန်တော်တို့ လုပ်ခဲ့တာက — `person` နဲ့ `date` ပေါ်မှာ _type annotations_ (type မှတ်ချက်များ) ထည့်ပြီး — `greet` ကို ဘယ်လို type တွေရဲ့ values တွေနဲ့ ခေါ်လို့ရလဲ ဖော်ပြထားတာပါ။ အဲဒီ signature ကို ဒီလို ဖတ်လို့ရပါတယ် — "`greet` က type `string` ဖြစ်တဲ့ `person` တစ်ခုနဲ့ type `Date` ဖြစ်တဲ့ `date` တစ်ခုကို လက်ခံတယ်"။

ဒါနဲ့ဆို — `greet` ကို မှားယွင်းစွာ ခေါ်မိနိုင်တဲ့ တခြား အခြေအနေတွေအကြောင်းကိုလည်း TypeScript က ပြောပြနိုင်ပါပြီ။ ဥပမာ...

```ts twoslash
// @errors: 2345
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", Date());
```

ဟမ်? TypeScript က ကျွန်တော်တို့ရဲ့ ဒုတိယ argument ပေါ်မှာ error တစ်ခု သတင်းပို့တယ် — ဒါပေမယ့် ဘာကြောင့်လဲ?

အံ့သြစရာ ကောင်းနိုင်ပေမယ့် — JavaScript မှာ `Date()` ကို ခေါ်ရင် `string` တစ်ခု ပြန်ပေးပါတယ်။ တစ်ဖက်မှာ — `new Date()` နဲ့ `Date` တစ်ခုကို construct (တည်ဆောက်) လုပ်ရင်တော့ ကျွန်တော်တို့ မျှော်လင့်ထားတဲ့အတိုင်း တကယ်ကို ရပါတယ်။

ဘယ်လိုပဲဖြစ်ဖြစ် — error ကို မြန်မြန် ပြင်လို့ရပါတယ်:

```ts twoslash {4}
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

သတိထားစရာက — explicit type annotations တွေကို အမြဲတမ်း ရေးစရာ မလိုပါဘူး။ ကိစ္စ အများစုမှာ — annotations တွေ ချန်လိုက်ရင်တောင် TypeScript က types တွေကို ကျွန်တော်တို့အတွက် _infer_ (ခန့်မှန်း) လုပ် (ဒါမှမဟုတ် "သူ့ဘာသာ တွက်ဆ") ပေးနိုင်ပါတယ်။

```ts twoslash
let msg = "hello there!";
//  ^?
```

`msg` မှာ `string` ဆိုတဲ့ type ရှိတယ်လို့ TypeScript ကို မပြောပြထားဘဲနဲ့တောင် — အဲဒါကို သူ ရှာဖွေတွက်ဆနိုင်ခဲ့ပါတယ်။ ဒါက feature တစ်ခုပါ — ပြီးတော့ type system က တူညီတဲ့ type ကို ဘာပဲဖြစ်ဖြစ် infer လုပ်မှာမို့ — အဲဒီလိုနေရာမျိုးမှာ annotations တွေ ထည့်မနေတာ အကောင်းဆုံးပါ။

> မှတ်ချက်: ဒီအပေါ်က code နမူနာထဲက message bubble (အကြံပြုစာ ပူဖောင်း) က — စာလုံးပေါ်မှာ mouse ကို hover (ညွှန်ပြ) လုပ်ကြည့်ရင် သင့် editor က ပြမယ့်အရာပါ။

## ဖျက်ပစ်ခံရတဲ့ Types (Erased Types)

အပေါ်က `greet` function ကို `tsc` နဲ့ compile လုပ်ပြီး JavaScript ထုတ်တဲ့အခါ ဘာတွေ ဖြစ်လဲ ကြည့်ရအောင်:

```ts twoslash
// @showEmit
// @target: es5
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

ဒီမှာ အချက်နှစ်ချက် သတိပြုပါ:

1. ကိုယ့်ရဲ့ `person` နဲ့ `date` parameters တွေမှာ type annotations တွေ မရှိတော့ဘူး။
2. ကိုယ့်ရဲ့ "template string" — backticks (`` ` `` ဆိုတဲ့ စာလုံး) တွေ သုံးထားတဲ့ string — ကို concatenations (ဆက်စပ်မှုများ) ပါတဲ့ ရိုးရိုး strings တွေအဖြစ် ပြောင်းလဲသွားတယ်။

ဒုတိယ အချက်အကြောင်း နောက်မှ ထပ်ပြောပါမယ် — အခုတော့ ပထမ အချက်ကို အာရုံစိုက်ကြည့်ရအောင်။ Type annotations တွေက JavaScript ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါဘူး (တိတိကျကျ ပြောရရင် ECMAScript ရဲ့ မဟုတ်ပါဘူး) — ဒါကြောင့် TypeScript ကို ပြင်ဆင်မှု မရှိဘဲ တိုက်ရိုက် run လို့ရတဲ့ browser ဒါမှမဟုတ် တခြား runtimes တွေ တကယ်တော့ မရှိပါဘူး။ ဒါကြောင့်ပဲ TypeScript မှာ compiler တစ်ခု လိုအပ်နေတာပါ — TypeScript-specific code တွေကို ဖယ်ထုတ် (strip out) ဖို့ ဒါမှမဟုတ် transform လုပ်ဖို့ နည်းလမ်းတစ်ခုခု လိုပြီး — အဲဒါမှ သင်က run လို့ရမှာမို့ပါ။ TypeScript-specific code အများစုက ဖျက်ပစ်ခံရပြီး — ဒီမှာလည်း ကိုယ့်ရဲ့ type annotations တွေက အလားတူ လုံးဝ ဖျက်ပစ်ခံခဲ့ရပါတယ်။

> **သတိရပါ**: Type annotations တွေက သင့် program ရဲ့ runtime behavior ကို ဘယ်တော့မှ ပြောင်းလဲပေးမှာ မဟုတ်ပါဘူး။

## Downleveling (ECMAScript Version ဟောင်းများဆီ Code ပြန်ရေးခြင်း)

အပေါ်က ဥပမာမှာ နောက်ထပ် ကွာခြားချက်တစ်ခုက — ကိုယ့်ရဲ့ template string ကို အောက်ပါအတိုင်းကနေ ပြန်ရေးခဲ့တာပါ

```js
`Hello ${person}, today is ${date.toDateString()}!`;
```

ဒီပုံစံဆီ ပြောင်းခဲ့တာပါ:

```js
"Hello ".concat(person, ", today is ").concat(date.toDateString(), "!");
```

ဒါ ဘာကြောင့် ဖြစ်ရတာလဲ?

Template strings တွေက ECMAScript 2015 လို့ ခေါ်တဲ့ ECMAScript ဗားရှင်းတစ်ခုရဲ့ feature တစ်ခုပါ (နောက်ထပ် နာမည်တွေကတော့ ECMAScript 6, ES2015, ES6 စသဖြင့်ပါ — _မမေးနဲ့ဦး_)။ TypeScript မှာ — ECMAScript ရဲ့ အသစ်တဲ့ ဗားရှင်းတွေကနေ ECMAScript 3 ဒါမှမဟုတ် ECMAScript 5 (a.k.a. ES5) လို အဟောင်းတွေဆီ code တွေကို ပြန်ရေးနိုင်တဲ့ စွမ်းရည် ရှိပါတယ်။ ECMAScript ရဲ့ အသစ် ဒါမှမဟုတ် "မြင့်တဲ့" ဗားရှင်းကနေ အဟောင်း ဒါမှမဟုတ် "နိမ့်တဲ့" ဗားရှင်းဆီ ရွှေ့ပြောင်းတဲ့ ဒီလုပ်ငန်းစဉ်ကို တစ်ခါတလေ _downleveling_ လို့ ခေါ်ပါတယ်။

ပုံမှန်အားဖြင့် TypeScript က ES5 ကို target (ပစ်မှတ်ထား) ပါတယ် — ECMAScript ရဲ့ အလွန် ဟောင်းတဲ့ ဗားရှင်းတစ်ခုပါ။ ပိုမကြာသေးတဲ့အရာတစ်ခုကို ရွေးချယ်ချင်ရင်တော့ [`target`](https://www.typescriptlang.org/tsconfig#target) option ကို သုံးနိုင်ပါတယ်။ `--target es2015` နဲ့ run လုပ်ရင် TypeScript က ECMAScript 2015 ကို target လုပ်ဖို့ ပြောင်းလဲသွားပြီး — ဆိုလိုတာက ECMAScript 2015 ကို ပံ့ပိုးတဲ့ နေရာတိုင်းမှာ code က run လို့ရမှာ ဖြစ်ပါတယ်။ ဒါကြောင့် `tsc --target es2015 hello.ts` ကို run လုပ်ရင် အောက်ပါ output ကို ရပါတယ်:

```js
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```

> ပုံမှန် target က ES5 ဖြစ်ပေမယ့် — လက်ရှိ browser တွေရဲ့ အများစုက ES2015 ကို ပံ့ပိုးပါတယ်။
> ဒါကြောင့် developer အများစုက — ရှေးကျတဲ့ browser တစ်ချို့နဲ့ လိုက်ဖက်ညီမှုက အရေးကြီးမှ လွဲရင် — ES2015 ဒါမှမဟုတ် အထက်ကို target အဖြစ် သတ်မှတ်တာ လုံခြုံပါတယ်။

## Strictness (တင်းကျပ်မှု ဆက်တင်များ)

သုံးစွဲသူ အမျိုးမျိုးက type-checker တစ်ခုထဲမှာ မတူညီတဲ့အရာတွေ ရှာဖွေပြီး TypeScript ဆီ လာကြပါတယ်။ တစ်ချို့လူတွေက ပိုလျော့ရဲတဲ့ opt-in အတွေ့အကြုံမျိုး ရှာကြပါတယ် — program ရဲ့ အစိတ်အပိုင်းတစ်ချို့ကိုပဲ validate (စိစစ်) လုပ်ပေးနိုင်ပြီး tooling ကောင်းကောင်းလည်း ရှိနေတာမျိုးပါ။ ဒါက TypeScript ရဲ့ ပုံမှန် (default) အတွေ့အကြုံပါ — types တွေက optional ဖြစ်ပြီး inference က အလျော့ပေးဆုံး types တွေကို ယူပြီး — `null`/`undefined` ဖြစ်နိုင်တဲ့ values တွေအတွက် စစ်ဆေးမှု မရှိပါဘူး။ `tsc` က errors တွေ ရှိနေလျက်နဲ့ emit လုပ်သလိုပဲ — ဒီ defaults တွေက သင့်ကို အနှောင့်အယှက် မဖြစ်စေဖို့ ထားထားတာပါ။ ရှိပြီးသား JavaScript ကို ပြောင်းရွှေ့နေတယ်ဆိုရင် — အဲဒါက နှစ်လိုဖွယ် ပထမဆင့်တစ်ခု ဖြစ်နိုင်ပါတယ်။

ဆန့်ကျင်ဘက်အနေနဲ့ — သုံးစွဲသူ အများအပြားက TypeScript ကို တတ်နိုင်သမျှ အများကြီး ချက်ချင်း validate လုပ်ပေးတာကို ပိုနှစ်သက်ကြပြီး — ဒါကြောင့်ပဲ ဒီ language မှာ strictness settings (တင်းကျပ်မှု ဆက်တင်များ) တွေကိုပါ ပံ့ပိုးပေးထားတာပါ။ ဒီ strictness settings တွေက static type-checking ကို — switch (code စစ်လား မစစ်ဘူးလားပဲ ရှိတဲ့ပုံစံ) ကနေ — dial (အဆင့်ညှိလို့ရတဲ့ပုံစံ) တစ်ခုနဲ့ ပိုနီးစပ်တဲ့အရာအဖြစ် ပြောင်းလဲပေးပါတယ်။ ဒီ dial ကို ဘယ်လောက် တိုးလှည့်လေ — TypeScript က သင့်အတွက် အဲဒီလောက် ပိုစစ်ဆေးပေးလေပါပဲ။ ဒါက နည်းနည်း အလုပ်ပိုလိုနိုင်ပေမယ့် — ယေဘုယျအားဖြင့်တော့ ရေရှည်မှာ ကိုယ့်ဘာသာ အကျိုးရှိစေပြီး — ပိုစေ့စပ်တဲ့ checks တွေနဲ့ ပိုတိကျတဲ့ tooling တွေကို ရရှိစေပါတယ်။ ဖြစ်နိုင်ရင် codebase အသစ်တစ်ခုဟာ ဒီ strictness checks တွေကို အမြဲတမ်း ဖွင့်ထားသင့်ပါတယ်။

TypeScript မှာ ဖွင့်လို့ရ ပိတ်လို့ရတဲ့ type-checking strictness flags တွေ အများကြီး ရှိပြီး — ကျွန်တော်တို့ရဲ့ ဥပမာတွေ အားလုံးကို — သီးခြား ဖော်ပြထားခြင်း မရှိရင် — အားလုံး enable လုပ်ထားတဲ့အနေနဲ့ ရေးသားပါမယ်။ CLI ထဲက [`strict`](https://www.typescriptlang.org/tsconfig#strict) flag ဒါမှမဟုတ် [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) ထဲက `"strict": true` က — အဲဒါတွေ အားလုံးကို တစ်ပြိုင်နက်တည်း ဖွင့်ပေးပြီး — တစ်ခုချင်းစီအနေနဲ့တော့ opt out (ဖယ်ထွက်) လုပ်လို့ရပါတယ်။ သင်သိထားသင့်တဲ့ အကြီးဆုံး နှစ်ခုကတော့ [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) နဲ့ [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) ပါ။

## `noImplicitAny` (Implicit `any` Type တွေကို Error အဖြစ် ပြခြင်း)

သတိရစရာ — တစ်ချို့နေရာတွေမှာ TypeScript က types တွေကို ကျွန်တော်တို့အတွက် infer လုပ်ဖို့ မကြိုးစားဘဲ — အလျော့ပေးဆုံး type ဖြစ်တဲ့ `any` ဆီ ပြန်ကျ (falls back) သွားပါတယ်။ ဒါက ဖြစ်နိုင်တာတွေထဲ အဆိုးဆုံးတော့ မဟုတ်ပါဘူး — တကယ်တော့ `any` ဆီ ပြန်ကျတာက ရိုးရိုး JavaScript ရဲ့ အတွေ့အကြုံပဲ ဖြစ်လို့ပါ။

ဒါပေမယ့် — `any` ကို သုံးနေတာက TypeScript သုံးရတဲ့ ရည်ရွယ်ချက်ကိုပဲ မကြာခဏ ဖျက်ဆီးပစ်ပါတယ်။ Program က ဘယ်လောက် typed (type သတ်မှတ်ထားမှု များ) လေလေ — validation နဲ့ tooling ပိုရလေလေပါ — ဆိုလိုတာက code ရေးရင်း bug နည်းနည်းပဲ ကြုံရလေပါတယ်။ [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) flag ကို ဖွင့်လိုက်ရင် — type ကို implicit ပုံစံနဲ့ `any` လို့ infer လုပ်ခံရတဲ့ variable တွေ အားလုံးပေါ်မှာ error တစ်ခု ထုတ်ပေးပါလိမ့်မယ်။

## `strictNullChecks` (Null/Undefined ကိုင်တွယ်မှုကို ပိုတင်းကျပ်စွာ စစ်ဆေးခြင်း)

ပုံမှန်အားဖြင့် — `null` နဲ့ `undefined` လို values တွေက တခြား type တိုင်းဆီ assign (ထည့်သွင်း) လုပ်လို့ရပါတယ်။ ဒါက code တစ်ချို့ ရေးရတာ ပိုလွယ်စေနိုင်ပေမယ့် — `null` နဲ့ `undefined` ကို ကိုင်တွယ်ဖို့ မေ့နေတာက ကမ္ဘာပေါ်မှာ မရေမတွက်နိုင်တဲ့ bugs တွေရဲ့ အကြောင်းရင်းပါ — တစ်ချို့က ဒါကို [billion dollar mistake](https://www.youtube.com/watch?v=ybrQvs4x0Ps) (ဘီလျံဒေါ်လာတန် အမှား) လို့တောင် သတ်မှတ်ကြပါတယ်! [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) flag က `null` နဲ့ `undefined` ကို ကိုင်တွယ်တာကို ပိုပြီး တိတိကျကျ ဖြစ်စေပြီး — `null` နဲ့ `undefined` ကို ကိုင်တွယ်ဖို့ _မေ့သွားလား_ ဆိုတဲ့ ပူပန်မှုကနေ ကျွန်တော်တို့ကို _လွတ်မြောက်_ စေပါတယ်။
