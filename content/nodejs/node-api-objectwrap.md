---
title: "C++ Object များကို JavaScript Object အဖြစ် wrap လုပ်ခြင်း (Object Wrap)"
description: "Your First Project ရဲ့ အခြားနည်းလမ်း — node-addon-api ရဲ့ ObjectWrap class နဲ့ stateful C++ object တစ်ခုကို JavaScript object အဖြစ် ဖော်ထုတ်ခြင်း"
order: 78
source: "https://nodejs.org/learn/node-api/getting-started/objectwrap"
status: translated
updated: 2026-09-02
---

ဒီ tutorial က [ပထမဆုံး Project](/docs/nodejs/node-api-your-first-project) ရဲ့ အခြားနည်းလမ်း (alternative) တစ်ခုပါ။ သာမန် function တစ်ခုကို export လုပ်မယ့်အစား — `node-addon-api` ရဲ့ `ObjectWrap` class ကို သုံးပြီး C++ object တစ်ခုကို JavaScript object အဖြစ် ဘယ်လို ဖော်ထုတ်လဲဆိုတာ သရုပ်ပြပါတယ်။

မစတင်ခင် — လိုအပ်တဲ့ [ကြိုတင်လိုအပ်ချက်များ](/docs/nodejs/node-api-prerequisites) နဲ့ [Tools များ](/docs/nodejs/node-api-tools) ကို install လုပ်ပြီးကြောင်း သေချာပါစေ။ ပြီးရင် [Node-API Project တစ်ခုရဲ့ ဖွဲ့စည်းပုံ](/docs/nodejs/node-api-project-structure) ကို ဖတ်ပြီး — `node-addon-api` project တွေ အားလုံးမှာ တူညီတဲ့ layout နဲ့ configuration files တွေကို နားလည်ထားပါ။

## Project တစ်ခု ဖန်တီးခြင်း

Object Wrap ဥပမာကို [node-addon-examples](https://github.com/nodejs/node-addon-examples) repository ကနေ ကူးယူပါ:

```bash
git clone https://github.com/nodejs/node-addon-examples.git
cp -r node-addon-examples/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api object-wrap-demo
cd object-wrap-demo
npm install
```

တစ်နည်းအားဖြင့် — project ကို ကိုယ်တိုင် manual အနေနဲ့လည်း တည်ဆောက်နိုင်ပါတယ်:

```bash
mkdir object-wrap-demo
cd object-wrap-demo
npm init -y
npm install node-addon-api
```

ပြီးရင် အောက်မှာ ဖော်ပြမယ့် source files တွေကို ဖန်တီးပါ။ Project ပြီးတာနဲ့ — အရာအားလုံး အလုပ်လုပ်ကြောင်း ဒီ command နဲ့ စစ်ဆေးနိုင်ပါတယ်:

```bash
npm test
```

## binding.gyp

ဒီ project ရဲ့ [**binding.gyp**](https://github.com/nodejs/node-addon-examples/blob/main/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api/binding.gyp) က standard format အတိုင်းပဲ ဖြစ်ပါတယ် — `binding.gyp` format ရဲ့ ရှင်းလင်းချက် အပြည့်အစုံနဲ့ `node-gyp` က ၎င်းကို ဘယ်လို အသုံးပြုလဲဆိုတာကို [Node-API Project တစ်ခုရဲ့ ဖွဲ့စည်းပုံ](/docs/nodejs/node-api-project-structure#bindinggyp) မှာ ကြည့်နိုင်ပါတယ်။

## src/object_wrap_demo.h နဲ့ src/object_wrap_demo.cc

[**object_wrap_demo.h**](https://github.com/nodejs/node-addon-examples/blob/main/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api/src/object_wrap_demo.h) နဲ့ [**object_wrap_demo.cc**](https://github.com/nodejs/node-addon-examples/blob/main/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api/src/object_wrap_demo.cc) တို့က ဒီ project ရဲ့ အဓိက အစိတ်အပိုင်း (heart) ဖြစ်ပါတယ်။ `napi.h` header က `node-addon-api` ကနေ လာပြီး — JavaScript values တွေကို ကိုယ်စားပြုတဲ့ C++ classes တွေကို ကြေညာ (declare) ပေးပါတယ်။

`object_wrap_demo.cc` က `ObjectWrapDemo` ဆိုတဲ့ C++ class ကို သတ်မှတ်ပါတယ်:

- **constructor** က JavaScript string တစ်ခုတည်းကို လက်ခံပြီး — private member ဖြစ်တဲ့ `_greeterName` ထဲမှာ သိမ်းဆည်းပါတယ်။
- **`Greet` method** က JavaScript string တစ်ခုကို လက်ခံပြီး — stdout ပေါ်ကို စာကြောင်း နှစ်ကြောင်း ရိုက်ထုတ်ကာ — constructor ဆီကို မူလ ပို့ခဲ့တဲ့ တန်ဖိုးကိုပဲ ပြန်ပေးပါတယ်။
- **`GetClass` static method** က class descriptor တစ်ခုကို ပြန်ပေးပါတယ် — JavaScript ကနေ C++ methods တွေဆီကို calls တွေ ဘယ်လို ပို့ပေးရမယ်ဆိုတာ Node-API က သိရှိဖို့ ဒီ descriptor က လိုအပ်ပါတယ်။

`Init` function က `ObjectWrapDemo::GetClass` ကို ခေါ်ပြီး `ObjectWrapDemo` class ကို export လုပ်ပါတယ်။ အောက်ဆုံးက `NODE_API_MODULE` macro က module ကို load လုပ်တဲ့အခါ `Init` ကို ခေါ်ပေးဖို့ သေချာစေပါတယ်။

## lib/binding.js

[**binding.js**](https://github.com/nodejs/node-addon-examples/blob/main/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api/lib/binding.js) က native binary ကို wrap လုပ်တဲ့ `ObjectWrapDemo` class တစ်ခုကို သတ်မှတ်ပါတယ်။ `new ObjectWrapDemo(value)` လို့ ခေါ်လိုက်တဲ့အခါ — အောက်ခံ C++ object ကို ဖန်တီးပြီး `_addonInstance` အနေနဲ့ သိမ်းဆည်းပါတယ်။ JavaScript ဘက်က `greet` method က C++ object ပေါ်က အလားတူ method ဆီကို လွှဲပြောင်း (delegate) လုပ်ပေးပါတယ်။

## test/test_binding.js

[**test_binding.js**](https://github.com/nodejs/node-addon-examples/blob/main/src/2-js-to-native-conversion/object-wrap-demo/node-addon-api/test/test_binding.js) က `lib/binding.js` ကနေ ရလာတဲ့ `ObjectWrapDemo` JavaScript class ကို ဘယ်လို သုံးရမယ်ဆိုတာ ပြသပါတယ်။ `greet` ကို ခေါ်လိုက်တဲ့အခါ — C++ code ထဲက `printf` calls တွေရဲ့ side-effect အနေနဲ့ stdout ပေါ်မှာ စာကြောင်း နှစ်ကြောင်း ထွက်လာတာ သတိပြုပါ။

## နိဂုံး (Conclusion)

ဒီ project က — stateful C++ object တစ်ခုကို JavaScript object အဖြစ် ဖော်ထုတ်ဖို့ `ObjectWrap` ကို ဘယ်လို သုံးရမယ်ဆိုတာ သရုပ်ပြပါတယ်။ နောက်ထပ် စမ်းကြည့်လို့ရတဲ့ အချက်တချို့:

- `test_binding.js` ကို သင့် debugger ထဲမှာ run ပါ။ Code ကို step by step လျှောက်ကြည့်ပြီး — JavaScript object က debugger ရဲ့ ရှုထောင့်ကနေ ဘယ်လိုပုံ ပေါက်နေလဲ လေ့လာပါ။
- `test_binding.js` ကို ပြင်ပြီး `binding.js` ကနေ သွားစရာ မလိုဘဲ — compile ပြီးသား binary ကို တိုက်ရိုက် `require` လုပ်ကြည့်ပါ။ Debugger ထဲမှာ ကွာခြားချက်ကို မှတ်သားပါ။
- `object_wrap_demo.cc` ကို ချဲ့ပြီး — `ObjectWrapDemo` class ပေါ်မှာ method (သို့) property အသစ်တွေ ထပ်ထည့် export လုပ်ကြည့်ပါ။
