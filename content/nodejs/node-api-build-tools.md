---
title: "Native Addon တည်ဆောက်ရေး Tools များ (Build Tools)"
description: "Native addon တည်ဆောက်ရာမှာ သုံးတဲ့ build tools တွေရဲ့ ခြုံငုံသုံးသပ်ချက် — user machine ပေါ်မှာ compile လုပ်ခြင်းနဲ့ pre-built binaries ဖြန့်ချီခြင်း နှစ်မျိုး၊ node-gyp / CMake.js / node-pre-gyp မိတ်ဆက်"
order: 79
source: "https://nodejs.org/learn/node-api/build-tools"
status: translated
updated: 2026-09-02
---

Native Node.js addon တစ်ခု တည်ဆောက်ဖို့ဆိုရင် — C/C++ source code တွေကို Node.js က runtime မှာ load လုပ်နိုင်တဲ့ `.node` binary file အဖြစ် compile လုပ်ရပါတယ်။ ဒီ section မှာ သင်သုံးနိုင်တဲ့ build tools တွေနဲ့ — ၎င်းတို့ကြားက trade-off (အကျိုးအန္တရာယ် ချိန်ဆမှု) တွေကို လွှမ်းခြုံ ဖော်ပြထားပါတယ်။

## Install လုပ်ချိန်မှာ compile လုပ်ခြင်းနဲ့ pre-built binaries ဖြန့်ချီခြင်း

Native addon တစ်ခုကို ဖြန့်ချီရာမှာ ကျယ်ပြန့်တဲ့ နည်းလမ်း နှစ်မျိုး ရှိပါတယ်:

**သုံးစွဲသူရဲ့ machine ပေါ်မှာ compile လုပ်ခြင်း** — သုံးစွဲသူတစ်ယောက်က `npm install` လုပ်တဲ့အခါ — build tool က သင့်ရဲ့ C/C++ source တွေကို သူတို့ရဲ့ system ပေါ်မှာ compile လုပ်ပေးပါတယ်။ ဒါက စနစ်ထည့်သွင်းရတာ ရိုးရှင်းပေမယ့် — သုံးစွဲသူ တိုင်းမှာ အလုပ်လုပ်တဲ့ C/C++ toolchain တစ်ခု install လုပ်ထားဖို့ လိုအပ်ပါတယ်။

**Pre-built binaries ဖြန့်ချီခြင်း** — သင်က ထောက်ပံ့လိုတဲ့ platform နဲ့ architecture တစ်ခုချင်းစီအတွက် binaries တွေကို ကြိုတင် compile လုပ်ပြီး — သုံးစွဲသူတွေ download လုပ်နိုင်တဲ့ နေရာတစ်ခုခုမှာ upload လုပ်ပါတယ်။ ကိုက်ညီတဲ့ binary ကို download လုပ်တဲ့ သုံးစွဲသူတွေကတော့ compile အဆင့်ကို လုံးဝ ကျော်သွားပြီး — ကျန်တဲ့သူတွေက ကိုယ့် machine ပေါ်မှာ ပြန် compile လုပ်ရပါတယ်။

## ဒီ section မှာ ဖော်ပြထားတဲ့ Build Tools

- [node-gyp](/docs/nodejs/node-api-node-gyp) — npm နဲ့အတူ ပါလာတဲ့ ပုံမှန် (default) build tool; Google ရဲ့ GYP format ကို သုံးပြီး — Node ecosystem မှာ နီးပါး အားလုံးက ထောက်ပံ့ထားပါတယ်
- [CMake.js](/docs/nodejs/node-api-cmake-js) — CMake-based အခြားနည်းလမ်း; CMake ကို သုံးနေပြီးသား project တွေအတွက် သင့်တော်ပါတယ်
- [node-pre-gyp](https://nodejs.org/learn/node-api/build-tools/node-pre-gyp) — pre-built binaries တွေကို Amazon S3 ကနေတစ်ဆင့် ဖြန့်ချီဖို့ node-gyp အပေါ်မှာ ထပ်ဆင့် တည်ဆောက်ထားတဲ့ အလွှာတစ်ခု
