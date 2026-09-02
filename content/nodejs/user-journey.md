---
title: "User Journey — Diagnostics (ရောဂါရှာဖွေခြင်း) လမ်းညွှန်"
description: "Diagnostics section ရဲ့ အဝင်လမ်းညွှန် — စုံစမ်းစစ်ဆေးမှု မစတင်မီ မှတ်တမ်းတင်ရမယ့် အချက်အလက်တွေနဲ့ symptom အလိုက် ရွေးချယ်ရမယ့် လမ်းကြောင်း (Live Debugging / Memory / Poor Performance)"
order: 57
source: "https://nodejs.org/learn/diagnostics/user-journey"
status: translated
updated: 2026-09-02
---

## User Journey — Diagnostics (ရောဂါရှာဖွေခြင်း) လမ်းညွှန်

Diagnostics (ရောဂါရှာဖွေခြင်း) ဆိုတာ — application တစ်ခုရဲ့ မျှော်လင့်မထားတဲ့ အပြုအမူ၊ memory ပြဿနာ ဒါမှမဟုတ် performance ညံ့ဖျင်းမှုရဲ့ အကြောင်းရင်းကို ဖော်ထုတ်ဖို့ — application အကြောင်း အချက်အလက်တွေကို စုဆောင်း ဆန်းစစ်တဲ့ လုပ်ငန်းစဉ်ပဲ ဖြစ်ပါတယ်။ ဒီ guides တွေက ဒီလုပ်ငန်းစဉ်ကို အဖြစ်များတဲ့ symptoms (လက္ခဏာများ) တွေ ပတ်လည်မှာ စုစည်းပြီး — အဲဒါတွေကို စုံစမ်းစစ်ဆေးဖို့ ကူညီနိုင်တဲ့ tools နဲ့ နည်းစနစ်တွေဆီ ချိတ်ဆက်ပေးပါတယ်။

## မစတင်မီ (Before You Begin)

စုံစမ်းစစ်ဆေးမှု မစတင်ခင် အောက်ပါ အချက်အလက်တွေကို မှတ်တမ်းတင်ထားပါ:

- Node.js version နဲ့ operating system
- တွေ့ရှိရတဲ့ symptoms တွေနဲ့ ဘယ်အချိန်တွေမှာ ဖြစ်ပွားလဲ
- ပြဿနာကို reproduce (ပြန်လည် ဖြစ်ပေါ်စေ) ဖို့ လိုအပ်တဲ့ အဆင့်တွေ
- Application ဒါမှမဟုတ် သူ့ရဲ့ environment ထဲမှာ မကြာသေးခင်က ပြုလုပ်ခဲ့တဲ့ အပြောင်းအလဲတွေ

## Diagnostic လမ်းကြောင်း တစ်ခု ရွေးချယ်ခြင်း (Choose a Diagnostic Path)

ကိုယ့် symptoms တွေနဲ့ အသင့်တော်ဆုံး guide ကနေ စတင်ပါ:

- Application ရဲ့ အပြုအမူ မှားယွင်းနေတာ ဒါမှမဟုတ် မျှော်လင့်မထားတဲ့ ပုံစံ ဖြစ်နေရင် → [Live Debugging (App Run နေစဉ် အမှားရှာပြင်ခြင်း)](/docs/nodejs/live-debugging) ကို ကြည့်ပါ။
- Memory usage တိုးလာနေတာ၊ out-of-memory crash တွေ ဒါမှမဟုတ် garbage collection မကြာခဏ ဖြစ်နေရင် → [Memory (Memory ပြဿနာများကို Debugging လုပ်ခြင်း)](https://nodejs.org/learn/diagnostics/memory) ကို ကြည့်ပါ။
- Latency မြင့်နေတာ ဒါမှမဟုတ် CPU usage များနေရင် → [Poor Performance (Performance နှေးကွေးခြင်း)](/docs/nodejs/poor-performance) ကို ကြည့်ပါ။

Guide တစ်ခုချင်းစီမှာ ပိုပြီး တိကျတဲ့ symptoms တွေနဲ့ — သက်ဆိုင်ရာ diagnostic tools နဲ့ နည်းစနစ်တွေဆီ လင့်ခ်တွေ ပါဝင်ပါတယ်။

ဒီ guides တွေကို [Diagnostics Working Group](https://github.com/nodejs/diagnostics) နဲ့ [Node.js Website Team](https://github.com/nodejs/nodejs.org) တို့က ဖန်တီးထားပါတယ်။

## ဆက်ဖတ်ရန်

- [Node.js Debugging (အမှားရှာပြင်ခြင်း)](/docs/nodejs/debugging) — `--inspect` flag နဲ့ Inspector ဖွင့်ခြင်း၊ Inspector clients များ
- [Node.js Application တွေကို Profiling လုပ်ခြင်း](/docs/nodejs/profiling) — built-in profiler (`--prof`) အသုံးပြု၍ performance ဆန်းစစ်ခြင်း
