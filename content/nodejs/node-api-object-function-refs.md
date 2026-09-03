---
title: "Object နဲ့ Function References (Object and Function References)"
description: "JavaScript objects တွေကို garbage collector က စောလွန်းစွာ ပြန်လည် သိမ်းယူမသွားအောင် ကာကွယ်ပေးတဲ့ `ObjectReference` နဲ့ `FunctionReference` classes — Persistent နဲ့ Weak references, Reference ၏ Ref/Unref, ObjectReference ၏ Get/Set, FunctionReference ၏ Call methods နဲ့ ဥပမာ"
order: 85
source: "https://nodejs.org/en/learn/node-api/special-topics/object-function-refs"
status: translated
updated: 2026-09-03
---

JavaScript က dynamic memory model (ရွေ့လျားနေသော memory ပုံစံ) တစ်ခုကို အကောင်အထည် ဖော်ပါတယ်။ Objects တွေဆီ လက်လှမ်းမမှီနိုင်တော့တဲ့အခါ — ၎င်းတို့ဟာ နောက်ခံမှာ run နေတဲ့ garbage collector က ပြန်လည် သိမ်းယူဖို့ (reclaim) အဆင်သင့် ဖြစ်လာပါတယ်။

သင့်ရဲ့ Node-API code က ဖန်တီးထားတဲ့ objects တွေ — ခွဲဝေချထားပြီးသား အနေအထားမှာ ဆက်ရှိနေဖို့ သေချာစေရမယ့် အခြေအနေတွေ ရှိပါတယ်။ ဒီလိုကိစ္စမျိုးမှာ — ၎င်းတို့ဆီ reference (ကိုးကားချက်) တစ်ခုကို တိကျစွာ (explicitly) ဖန်တီးဖို့ လိုအပ်ပါတယ်။ `ObjectReference` နဲ့ `FunctionReference` classes တွေရဲ့ ရည်ရွယ်ချက်က ဒါပဲ ဖြစ်ပါတယ်။

## Persistent Reference

Object နဲ့ function references တွေကို `Weak` ဒါမှမဟုတ် `Persistent` အနေနဲ့ instantiate လုပ်နိုင်ပါတယ်။

`Persistent` reference တစ်ခုက internal reference count ကို one အဖြစ် စတင် သတ်မှတ်ပြီး — ဒါက garbage collector က object ရဲ့ memory ကို ပြန်လည် သိမ်းယူတာကို တားဆီးပါတယ်။ Reference လုပ်ထားတဲ့ object က `Persistent` reference ရဲ့ သက်တမ်း တစ်လျှောက်လုံး memory ထဲမှာ ဆက်ရှိနေမှာ ဖြစ်ပါတယ်။

`Persistent` reference ကို သုံးတာက — reference ရဲ့ ကြာချိန် (duration) ကို ကြိုတင် သိထားတဲ့ ကိစ္စမျိုးမှာ အဓိပ္ပာယ် ရှိပါတယ်။ `Persistent` reference ကို ဖျက်လိုက်တဲ့အခါ internal reference count ကို လျှော့ချပါတယ်။ Internal reference count က zero ကို ရောက်သွားရင် — reference လုပ်ထားတဲ့ object က ဖျက်ပစ်ဖို့ အဆင်သင့် ဖြစ်လာပါလိမ့်မယ်။

`Persistent` reference ကို သုံးတဲ့ အဖြစ်အများဆုံး ကိစ္စကတော့ — သင့်ရဲ့ Node-API code ထဲမှာ JavaScript class တစ်ခုကို ဖန်တီးပြီး — ၎င်းရဲ့ constructor ကို JavaScript runtime engine က ခွဲဝေချထားထားတဲ့ အနေအထားမှာ ဆက်ရှိနေအောင် သေချာစေချင်တဲ့အခါ ဖြစ်ပါတယ်။

## Weak Reference

Reference လုပ်ထားတဲ့ object ကို AsyncWorkers အများအပြားက မှီခိုနေရတဲ့ ပိုရှုပ်ထွေးတဲ့ implementation တွေအတွက်တော့ — internal reference count ကို zero အဖြစ် စတင် သတ်မှတ်တဲ့ `Weak` reference ကို သုံးတာက ပိုပြီး အဓိပ္ပာယ် ရှိနိုင်ပါတယ်။ Reference count ကို `Reference` ရဲ့ `Ref` နဲ့ `Unref` methods တွေကို သုံးပြီး ထိန်းသိမ်းနိုင်ပါတယ်။

`Weak` reference ရဲ့ အသုံးအများဆုံး ကိစ္စကတော့ — သင့်ရဲ့ Node-API code ထဲမှာ ဖန်တီးထားတဲ့ JavaScript object တစ်ခုကို garbage collector က ဘယ်အချိန်မှာ ပြန်လွှတ်ပေးလဲဆိုတာ စောင့်ကြည့်ဖို့ လိုအပ်တဲ့အခါ ဖြစ်ပါတယ်။

## ObjectReference

`ObjectReference` class က `Reference` class ကနေ အမွေဆက်ခံ (inherits) ပါတယ်။ ၎င်းက ထပ်ဖြည့်ပေးတာက — reference လုပ်ထားတဲ့ object ရဲ့ properties တွေကို ခြယ်လှယ်ပေးတဲ့ `Get` နဲ့ `Set` methods အစုတစ်ခုပါ။

## FunctionReference

`ObjectReference` လိုပဲ — `FunctionReference` class က `Reference` class ကနေ အမွေဆက်ခံပါတယ်။ `ObjectReference` class က `Get` နဲ့ `Set` methods တွေကို ထပ်ဖြည့်ပေးတဲ့အခါ — `FunctionReference` class ကတော့ function ဆီ ခေါ်ဆိုမှုတွေ (calls) ကို အကောင်အထည် ဖော်ပေးတဲ့ `Call` methods အစုတစ်ခုကို ထပ်ဖြည့်ပေးပါတယ်။

## ဥပမာ (Example)

ဒီဥပမာ code က `FunctionReference` class ကို ဘယ်လို သုံးရမယ်ဆိုတာ ပြသပါတယ်။

### src/native-addon.h

[**native-addon.h**](https://github.com/nodejs/node-addon-examples/blob/main/src/4-references-and-handle-scope/function-reference-demo/node-addon-api/src/native-addon.h) က — constructor ထဲမှာ ဖြည့်သွင်းခံရတဲ့ data member နှစ်ခု ပါဝင်တဲ့ `NativeAddon` C++ class ကို ကြေညာပါတယ်:

- `Napi::FunctionReference jsFnRef`
- `Napi::Function jsFn`

### src/native-addon.cc

[**native-addon.cc**](https://github.com/nodejs/node-addon-examples/blob/main/src/4-references-and-handle-scope/function-reference-demo/node-addon-api/src/native-addon.cc) မှာ `NativeAddon` ရဲ့ implementation ပါဝင်ပါတယ်။ JavaScript ကနေ ခေါ်ဆိုခံရတဲ့ constructor က function argument နှစ်ခုကို လက်ခံပါတယ်။ ပထမ argument ကို `Napi::FunctionReference` အဖြစ် သိမ်းဆည်းပြီး — ဒုတိယ argument ကို `Napi::Function` အဖြစ် သိမ်းဆည်းပါတယ်။

> _ဒီ code ထဲမှာ ရည်ရွယ်ချက်ရှိရှိ ချန်ထားတဲ့ error တစ်ခု ပါဝင်ပါတယ် (deliberate error)._

ဒုတိယ function ကို `Napi::Function jsFn` data member ထဲမှာ သိမ်းဆည်းထားပါတယ်။ **ဒါက error တစ်ခုပါ** — ဘာလို့လဲဆိုတော့ — ဒုတိယ argument ရဲ့ သက်တမ်းက constructor ရဲ့ သက်တမ်းနဲ့ပဲ အကန့်အသတ် ရှိလို့ပါ။ Constructor ပြန်လာပြီးနောက်မှာ `jsFn` data member ရဲ့ တန်ဖိုးက မမှန်ကန်တော့ပါဘူး။ ပထမ argument ကိုတော့ `Napi::FunctionReference jsFnRef` ထဲမှာ သိမ်းဆည်းထားပါတယ်။ `Napi::FunctionReference` ကို သုံးထားလို့ — constructor ပြန်လာပြီးနောက်မှာလည်း `jsFnRef` ရဲ့ တန်ဖိုးက မှန်ကန်နေဦးမှာ ဖြစ်ပါတယ်။

`NativeAddon` class က JavaScript ကနေ ခေါ်ဆိုလို့ရတဲ့ method နှစ်ခုကို implement လုပ်ပါတယ်: `TryCallByStoredReference` နဲ့ `TryCallByStoredFunction`။ `Call` method ကို `jsFnRef` ရော `jsFn` data member နှစ်ခုလုံးအတွက်ပါ တစ်နည်းတည်းနဲ့ သုံးထားတာ သတိပြုပါ။

### src/binding.cc

[**binding.cc**](https://github.com/nodejs/node-addon-examples/blob/main/src/4-references-and-handle-scope/function-reference-demo/node-addon-api/src/binding.cc) က `NativeAddon` class ကို Node-API နဲ့ register လုပ်ပေးတဲ့ ပုံမှန် (standard) binding file တစ်ခု ဖြစ်ပါတယ်။

### index.js

[**index.js**](https://github.com/nodejs/node-addon-examples/blob/main/src/4-references-and-handle-scope/function-reference-demo/node-addon-api/index.js) က JavaScript ဘက်ကနေ `NativeAddon` class ကို သုံးပုံကို ပြသပါတယ်။ Native `tryCallByStoredFunction` method ကို ခေါ်တာက မအောင်မြင်တာ သတိပြုပါ — ဘာလို့လဲဆိုတော့ — ၎င်း မှီခိုနေတဲ့ data member က မမှန်ကန်တော့လို့ပါ။
