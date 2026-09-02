---
title: "Poor Performance (Performance နှေးကွေးခြင်း)"
description: "Node.js process တစ်ခုကို profiling လုပ်နည်း — latency မြင့်နေပြီး dependencies ကြောင့် မဟုတ်ဘူးလို့ သေချာတဲ့အခါ CPU cycles အများဆုံး သုံးနေတဲ့ code အပိုင်းကို ရှာဖွေခြင်း"
order: 50
source: "https://nodejs.org/learn/diagnostics/poor-performance"
status: translated
updated: 2026-09-02
---

## Poor Performance (Performance နှေးကွေးခြင်း)

ဒီ document ထဲမှာ Node.js process တစ်ခုကို profiling (စွမ်းဆောင်ရည် တိုင်းတာ ဆန်းစစ်ခြင်း) လုပ်နည်းအကြောင်း လေ့လာနိုင်မှာ ဖြစ်ပါတယ်။

## Application ရဲ့ Performance ညံ့ဖျင်းနေခြင်း

### Symptoms (လက္ခဏာများ)

ကိုယ့် application ရဲ့ latency မြင့်နေပြီး — bottleneck က database ဒါမှမဟုတ် downstream services လိုမျိုး ကိုယ့်ရဲ့ dependencies တွေကြောင့် မဟုတ်ဘူးဆိုတာ သေချာအောင် စစ်ဆေးပြီးသား ဖြစ်ပါတယ်။ ဒါကြောင့် ကိုယ့် application က code run တာ ဒါမှမဟုတ် အချက်အလက်တွေ process လုပ်တာမှာ အချိန် သိသိသာသာ ကုန်နေတယ်လို့ သံသယ ရှိပါတယ်။

Application ရဲ့ performance ကို ယေဘုယျအားဖြင့် ကျေနပ်ပေမယ့် — ဘယ်အပိုင်းကို မြှင့်တင်ရင် ပိုမြန် (ဒါမှမဟုတ်) ပိုထိရောက်အောင် run နိုင်မလဲဆိုတာကိုလည်း နားလည်ချင်ပါတယ်။ User experience တိုးတက်အောင် လုပ်ချင်တဲ့အခါ ဒါမှမဟုတ် computation cost တွေ သက်သာစေချင်တဲ့အခါမျိုးမှာ ဒါက အသုံးဝင်ပါတယ်။

### Debugging (စစ်ဆေး ဖော်ထုတ်ခြင်း)

ဒီ use case မှာ တခြားအပိုင်းတွေထက် CPU cycles ပိုသုံးနေတဲ့ code အပိုင်းတွေကို စိတ်ဝင်စားပါတယ်။ ဒါကို local မှာ လုပ်တဲ့အခါ — ပုံမှန်အားဖြင့် code ကို optimize လုပ်ဖို့ ကြိုးစားကြည့်လေ့ ရှိပါတယ်။

ဒီ document က Node.js application တစ်ခုကို profiling လုပ်ဖို့ နည်းလမ်း ရိုးရိုးရှင်းရှင်း နှစ်ခုကို ဖော်ပြထားပါတယ်:

- [V8 Sampling Profiler အသုံးပြုခြင်း](/docs/nodejs/profiling) — Node.js ရဲ့ built-in profiler (`--prof`) နဲ့ CPU အသုံးပြုမှုကို sample လုပ်ပြီး ဆန်းစစ်ခြင်း
- [Linux Perf အသုံးပြုခြင်း (Using Linux Perf)](/docs/nodejs/using-linux-perf) — Linux Perf နဲ့ low-level CPU profiling (JavaScript, native နဲ့ OS level frames အပါအဝင်)

Profiling ရလဒ်တွေကို မြင်သာအောင် [Flame Graphs (Flame Graph ဖန်တီးခြင်း)](/docs/nodejs/flame-graphs) နဲ့ ကြည့်ရှုနိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Node.js Application တွေကို Profiling လုပ်ခြင်း](/docs/nodejs/profiling) — V8 Sampling Profiler အသေးစိတ်
- [Flame Graphs (Flame Graph ဖန်တီးခြင်း)](/docs/nodejs/flame-graphs) — perf output ကနေ flame graph ဖန်တီးခြင်း
- [Live Debugging (App Run နေစဉ် အမှားရှာပြင်ခြင်း)](/docs/nodejs/live-debugging) — application logic နဲ့ correctness ကို စစ်ဆေးခြင်း
