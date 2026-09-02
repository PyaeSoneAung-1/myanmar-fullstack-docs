---
title: "Inspector အသုံးပြုခြင်း (Using Inspector)"
description: "Local environment မှာ debugger ကို attach လုပ်ပြီး breakpoints ထား၍ code ကို step through လုပ်ကာ heap ကို စစ်ဆေးခြင်း — production မှာ live debugger သုံးဖို့ ဘာကြောင့် မသင့်လဲ"
order: 48
source: "https://nodejs.org/learn/diagnostics/live-debugging/using-inspector"
status: translated
updated: 2026-09-02
---

## Inspector အသုံးပြုခြင်း (Using Inspector)

Local environment တစ်ခုမှာ live debugging လို့ ပြောလိုက်ရင် ပုံမှန်အားဖြင့် — ကိုယ့် application ဆီ debugger တစ်ခုကို attach (ချိတ်ဆက်) လုပ်ပြီး program ရဲ့ execution ကို ရပ်နားထားဖို့ breakpoints တွေ ထားတာကို ဆိုလိုပါတယ်။ ပြီးတော့ code path တွေကို step by step လျှောက်ကြည့်ရင်း — အဆင့်တစ်ခုချင်းစီမှာ heap ထဲက အခြေအနေတွေကို စစ်ဆေးပါတယ်။

Production မှာတော့ live debugger သုံးတာက ပုံမှန်အားဖြင့် ရွေးချယ်စရာ မဟုတ်ပါဘူး — machine ဆီ access က အကန့်အသတ်ရှိတတ်ပြီး — business-critical (စီးပွားရေးအရ အရေးပါတဲ့) workload တစ်ခုကို ကိုင်တွယ်နေတဲ့ application ရဲ့ execution ကို ရပ်တန့်လိုက်လို့လည်း မဖြစ်လို့ပါ။

## ဘယ်လို လုပ်ဆောင်မလဲ (How To)

Node.js application တစ်ခုကို Inspector နဲ့ debug လုပ်တာကို စတင်ဖို့ — debugger တစ်ခုနဲ့ ချိတ်ဆက်လို့ရအောင် application ကို `--inspect` flag နဲ့ စတင်ပြီး — Chrome DevTools, Visual Studio Code စတဲ့ Inspector client တစ်ခုကနေ attach လုပ်ပါ။

အသေးစိတ် လမ်းညွှန်ချက်တွေအတွက်:

- [Node.js Debugging (အမှားရှာပြင်ခြင်း)](/docs/nodejs/debugging) — Inspector ကို ဖွင့်ခြင်း၊ security သတိပြုချက်များ နဲ့ Inspector clients များ
- [Inspector API documentation](https://nodejs.org/api/inspector.html) — Node.js inspector module ရဲ့ official API reference

Production လိုမျိုး execution ကို ရပ်တန့်လို့မရတဲ့ နေရာတွေမှာ app ရဲ့ အပြုအမူကို စစ်ဆေးချင်ရင်တော့ — live debugging အစား [Poor Performance (Performance နှေးကွေးခြင်း)](/docs/nodejs/poor-performance) လို profiling နည်းလမ်းတွေကို ကြည့်နိုင်ပါတယ်။
