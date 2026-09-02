---
title: "ပထမဆုံး Node-API Project (Your First Project)"
description: "ပထမဆုံး Node-API hello-world addon — node-addon-examples ကနေ ကူးယူခြင်း (သို့) manual setup, src/hello_world.cc ဖွဲ့စည်းပုံ, lib/binding.js, test လုပ်ခြင်း"
order: 75
source: "https://nodejs.org/learn/node-api/getting-started/your-first-project"
status: translated
updated: 2026-09-02
---

မစတင်ခင် — လိုအပ်တဲ့ [ကြိုတင်လိုအပ်ချက်များ](/docs/nodejs/node-api-prerequisites) နဲ့ [Tools များ](/docs/nodejs/node-api-tools) ကို install လုပ်ပြီးကြောင်း သေချာပါစေ။ ပြီးရင် [Node-API Project တစ်ခုရဲ့ ဖွဲ့စည်းပုံ](/docs/nodejs/node-api-project-structure) ကို ဖတ်ပြီး — `node-addon-api` project တွေ အားလုံးမှာ တူညီတဲ့ layout နဲ့ configuration files တွေကို နားလည်ထားပါ။

ဒီ tutorial က C++ wrapper အဆင့်မှာ `node-addon-api` ကို သုံးပါတယ်။

## Project တစ်ခု ဖန်တီးခြင်း

အလုပ်လုပ်တဲ့ project တစ်ခု ရဖို့ အမြန်ဆုံး နည်းလမ်းက — [node-addon-examples](https://github.com/nodejs/node-addon-examples) repository ထဲက Hello World ဥပမာကို ကူးယူတာပါ:

```bash
git clone https://github.com/nodejs/node-addon-examples.git
cp -r node-addon-examples/src/1-getting-started/a-first-project/node-addon-api hello-world
cd hello-world
npm install
```

တစ်နည်းအားဖြင့် — project ကို ကိုယ်တိုင် manual အနေနဲ့လည်း တည်ဆောက်နိုင်ပါတယ်:

```bash
mkdir hello-world
cd hello-world
npm init -y
npm install node-addon-api
```

ပြီးရင် အောက်မှာ ဖော်ပြမယ့် source files တွေကို ဖန်တီးပါ။ Project ပြီးတာနဲ့ — အရာအားလုံး အလုပ်လုပ်ကြောင်း ဒီ command နဲ့ စစ်ဆေးနိုင်ပါတယ်:

```bash
npm test
```

## src/hello_world.cc

[`hello_world.cc`](https://github.com/nodejs/node-addon-examples/blob/main/src/1-getting-started/a-first-project/node-addon-api/src/hello_world.cc) က သင်ရေးလို့ရတဲ့ အရိုးရှင်းဆုံး အသုံးဝင်တဲ့ Node-API file တွေထဲက တစ်ခုပါ။

ဒီ file က `Napi::CallbackInfo&` argument တစ်ခုတည်း လက်ခံတဲ့ C++ `Method` function တစ်ခုကို သတ်မှတ်ပါတယ်။ ဒီ `info` object က JavaScript environment ထဲကို ဝင်ရောက်ခွင့် ပေးပြီး — JavaScript ကနေ ပို့လိုက်တဲ့ arguments တွေလည်း ပါဝင်ပါတယ်။

> `info` က JavaScript arguments တွေရဲ့ array တစ်ခုလိုပဲ ပြုမူပါတယ်။

`Method` က `info` ကို သုံးပြီး `Napi::Env` တစ်ခုကို ရယူကာ — `"world"` ဆိုတဲ့ တန်ဖိုးနဲ့ `Napi::String` တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

`Init` function က ဒီ module ကနေ export လုပ်မယ့် တစ်ခုတည်းသော အရာကို register လုပ်ပါတယ်: `"HelloWorld"` ဆိုတဲ့ နာမည်က `Method` function ကို ညွှန်းပါတယ်။

အောက်ဆုံးက `NODE_API_MODULE` macro က module ကို load လုပ်တဲ့အခါ `Init` ကို ခေါ်ပေးဖို့ သေချာစေပါတယ်။

## lib/binding.js

[`binding.js`](https://github.com/nodejs/node-addon-examples/blob/main/src/1-getting-started/a-first-project/node-addon-api/lib/binding.js) က compile ပြီးသား binary ကို load လုပ်ပြီး — သူ့ရဲ့ ပါဝင်ပစ္စည်းတွေကို ပြန် export လုပ်ပါတယ်။ Binary ကနေ export လုပ်တဲ့ တစ်ခုတည်းသော အရာက `HelloWorld` function ပါ။

## test/test_binding.js

[`test_binding.js`](https://github.com/nodejs/node-addon-examples/blob/main/src/1-getting-started/a-first-project/node-addon-api/test/test_binding.js) က `require` ကို သုံးပြီး `binding.js` ကနေ `HelloWorld` function ကို ယူပါတယ်။ `testBasic` function က ၎င်းကို ခေါ်ပြီး ရလဒ်ကို အတည်ပြုပါတယ်။

## နိဂုံး (Conclusion)

ဒီ project က — function တစ်ခုတည်းကို export လုပ်တဲ့ အနည်းငယ်မျှသော Node-API module တစ်ခုကို သရုပ်ပြပါတယ်။ နောက်ထပ် စမ်းကြည့်လို့ရတဲ့ အချက်တချို့:

- `test_binding.js` ကို သင့် debugger ထဲမှာ run ပါ။ Code ကို step by step လျှောက်ကြည့်ပြီး — C++ code က ဖန်တီးလိုက်တဲ့ JavaScript object ထဲကို ဘယ်လောက်အထိ မြင်ရလဲဆိုတာ လေ့လာပါ။
- `test_binding.js` ကို ပြင်ပြီး `binding.js` ကနေ သွားစရာ မလိုဘဲ — compile ပြီးသား binary ကို တိုက်ရိုက် `require` လုပ်ကြည့်ပါ။ Debugger ထဲမှာ step လျှောက်ပြီး ကွာခြားချက်ကို မှတ်သားပါ။
- `hello_world.cc` ကို ပြင်ပြီး — JavaScript ကနေ ပို့လိုက်တဲ့ arguments တွေကို ဖတ်နိုင်အောင် လုပ်ကြည့်ပါ။ [`node-addon-api` ဥပမာများ](https://github.com/nodejs/node-addon-api#examples) က ကောင်းတဲ့ ကိုးကားချက် ဖြစ်ပါတယ်။
