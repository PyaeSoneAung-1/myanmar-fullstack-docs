---
title: "Node-API မိတ်ဆက် (What is Node-API?)"
description: "Node-API ဆိုတာ ဘာလဲ — Node.js မှာ built-in ဖြစ်တဲ့ stable C API, NAN အစား ဘာကြောင့် သုံးသလဲ, အသုံးများတဲ့ ကိစ္စရပ်များနဲ့ node-addon-api package"
order: 72
source: "https://nodejs.org/learn/node-api"
status: translated
updated: 2026-09-02
---

**Node-API** က Node.js ထဲမှာ တည်ဆောက်ပြီးသား (built-in) ဖြစ်တဲ့ **stable C API** တစ်ခုပါ — C/C++ code တွေက JavaScript values တွေကို JavaScript ကိုယ်တိုင် ဖန်တီးထားသလိုမျိုး ဖန်တီး၊ ဖတ်၊ ခြယ်လှယ်နိုင်အောင် လုပ်ပေးပါတယ်။ Node.js 8.0.0 မှာ experimental အနေနဲ့ စတင် မိတ်ဆက်ခဲ့ပြီး — Node.js 8/10 ကာလမှာ stable (flag နောက်ကွယ်မှာ မဟုတ်တော့ဘဲ) ဖြစ်လာခဲ့ပါတယ်။

Node-API က Node.js ရဲ့ အစိတ်အပိုင်းတစ်ခု ဖြစ်တာမို့ — သီးခြား install လုပ်စရာ မလိုပါဘူး။

## NAN အစား Node-API ကို ဘာကြောင့် သုံးသလဲ (Why Node-API instead of NAN?)

Node-API မပေါ်ခင်ကာလမှာ — native addon တွေ တည်ဆောက်တဲ့ နေရာမှာ အဓိက နည်းလမ်းက [Native Abstractions for Node.js (NAN)](https://github.com/nodejs/nan) ဖြစ်ခဲ့ပါတယ်။ NAN က [V8](https://developers.google.com/v8/) API ထဲကို တိုက်ရိုက် ဝင်ရောက် ခေါ်ဆိုပြီး အလုပ်လုပ်ပါတယ် — V8 API ကတော့ V8 major release တိုင်းမှာ ပြောင်းလဲပါတယ်။ ဆိုလိုတာက — Node.js က V8 version အသစ်တစ်ခု ထုတ်လိုက်တိုင်း NAN-based addon တွေကို ပြန် compile လုပ်ရပြီး — တစ်ခါတစ်ရံမှာ code ပါ ပြင်ဆင်ရလေ့ ရှိပါတယ်။

Node-API ကတော့ JavaScript engine ကို တည်ငြိမ်တဲ့ interface တစ်ခုရဲ့ နောက်ကွယ်မှာ ထားပြီး abstract လုပ်ပါတယ်။ ဒါက အရေးကြီးတဲ့ အာမခံချက် (guarantee) နှစ်ခုကို ပေးပါတယ်:

1. **Backward compatibility (နောက်ပြန် လိုက်ဖက်ညီမှု)** — ဒီနေ့ တည်ဆောက်ထားတဲ့ module တစ်ခုက အနာဂတ် Node.js version တွေ အားလုံးမှာ — ပြန် compile လုပ်စရာ၊ code ပြောင်းစရာ မလိုဘဲ — run လို့ ရနေမှာ ဖြစ်ပါတယ်။
2. **ABI တည်ငြိမ်မှု (ABI stability)** — API က ABI-stable ဖြစ်တာမို့ — compile ပြီးသား `.node` binary ကိုယ်တိုင်က Node.js releases တွေကို ဖြတ်ကျော်ပြီး ဆက် အလုပ်လုပ်နေပါတယ်။ ([ABI stability အကြောင်း အသေးစိတ်](/docs/nodejs/abi-stability))

## အသုံးများတဲ့ ကိစ္စရပ်များ (Common Use Cases)

### ရှိပြီးသား C/C++ library တစ်ခုကို wrap လုပ်ခြင်း

Native addon တစ်ခု ရေးရတဲ့ အဖြစ်အများဆုံး အကြောင်းရင်းကတော့ — ရှိပြီးသား C/C++ library တစ်ခုကို JavaScript developer တွေ သုံးနိုင်အောင် ဖော်ထုတ်ပေးဖို့ပါ။ Node-API က သင့်ရဲ့ C/C++ code ကို သီးခြား ထိန်းသိမ်းထားနိုင်ပြီး — JavaScript bindings တွေကိုလည်း အားစိုက်မှု အနည်းငယ်နဲ့ပဲ အမြဲ ကိုက်ညီနေအောင် ထားနိုင်စေပါတယ်။

### OS အရင်းအမြစ်များကို ဝင်ရောက်ခြင်း

[Electron](https://electronjs.org) ဒါမှမဟုတ် [NW.js](https://nwjs.io) နဲ့ တည်ဆောက်ထားတဲ့ application တချို့လိုမျိုး — Node.js က ဖော်မထုတ်ပေးတဲ့ system APIs တွေကို လိုအပ်တဲ့ application တွေ ရှိပါတယ်။ Node-API က အဲဒီ အရင်းအမြစ်တွေဆီ ရောက်ရှိဖို့ hook တွေ ပေးပါတယ်။

### တွက်ချက်မှု ပြင်းထန်တဲ့ အလုပ်များ (Computationally Intensive Work)

Compute-heavy အလုပ်တွေအတွက် — hot path ကို C ဒါမှမဟုတ် C++ နဲ့ ရေးပြီး Node-API ကနေ JavaScript က ခေါ်သုံးတာက စွမ်းဆောင်ရည် သိသိသာသာ တိုးစေနိုင်ပါတယ်။ JIT-compile လုပ်တဲ့ JavaScript နဲ့ မတူဘဲ — compile ပြီးသား C/C++ binary က warm-up အဆင့် မလိုဘဲ Node.js အတွက် ချက်ချင်း ရနေလို့ ဖြစ်ပါတယ်။

## node-addon-api

Node-API ရဲ့ အရေးပါတဲ့ အဖော် (companion) တစ်ခုက — npm package ဖြစ်တဲ့ [`node-addon-api`](https://www.npmjs.com/package/node-addon-api) ပါ။ ၎င်းက C API ကို idiomatic (သဘာဝကျတဲ့) C++ object model တစ်ခုအဖြစ် wrap လုပ်ပေးပြီး — boilerplate (ထပ်ခါထပ်ခါ ရေးရတဲ့ code) တွေကို လျှော့ချပေးကာ — C++ objects တွေကို JavaScript objects အဖြစ် wrap လုပ်တာလို အသုံးများတဲ့ pattern တွေကို ပိုပြီး လွယ်ကူ သက်တောင့်သက်သာ ဖြစ်စေပါတယ်။ Node-API ရဲ့ ABI-stability guarantee အပြည့်အဝကိုလည်း ထိန်းသိမ်းထားပါတယ်။

ဒီ site ပေါ်က ဥပမာ အများစုက `node-addon-api` ကို သုံးထားပါတယ်။

## ဒီ section ထဲက ဆောင်းပါးများ

C/C++ addon တွေ စတင် တည်ဆောက်ဖို့အတွက် Getting Started ဆောင်းပါးတွေကို အောက်ပါအတိုင်း ဖတ်ရှုနိုင်ပါတယ်:

- [Node-API ကြိုတင်လိုအပ်ချက်များ (Prerequisites)](/docs/nodejs/node-api-prerequisites) — ဘာတွေ သိထားဖို့ လိုလဲ
- [Node-API Tools များ (Tools)](/docs/nodejs/node-api-tools) — toolchain install လုပ်နည်း
- [Node-API Project တစ်ခုရဲ့ ဖွဲ့စည်းပုံ (Anatomy of a Node-API Project)](/docs/nodejs/node-api-project-structure) — project တိုင်းမှာ ပါတဲ့ ဖိုင်တွေနဲ့ layout
- [ပထမဆုံး Project (Your First Project)](/docs/nodejs/node-api-your-first-project) — hello-world addon အဆုံးထိ
- [Node-API သို့ ပြောင်းရွှေ့ခြင်း (Migrating to Node-API)](/docs/nodejs/node-api-migration) — NAN module တွေကို ပြောင်းရွှေ့ခြင်း

ဆက်စပ် ဆောင်းပါးများ: [ABI တည်ငြိမ်မှု](/docs/nodejs/abi-stability) နဲ့ [Node-API package ထုတ်ဝေခြင်း](/docs/nodejs/publishing-node-api-modules)
