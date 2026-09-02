---
title: "Memory ပြဿနာများကို Debugging လုပ်ခြင်း (Memory)"
description: "Node.js app တွေမှာ memory ပြဿနာတွေကို debug လုပ်နည်း — out-of-memory crash နဲ့ memory သုံးစွဲမှု မထိရောက်မှုရဲ့ symptoms / side effects၊ heap profiler, heap snapshot, GC traces တွေနဲ့ စုံစမ်းပုံ"
order: 52
source: "https://nodejs.org/learn/diagnostics/memory"
status: translated
updated: 2026-09-02
---

## Memory — Memory ပြဿနာများကို Debugging လုပ်ခြင်း

ဒီ document ထဲမှာ memory နဲ့ ပတ်သက်တဲ့ ပြဿနာတွေကို debug (ရှာဖွေ ဖြေရှင်း) လုပ်နည်း အကြောင်း လေ့လာနိုင်မှာ ဖြစ်ပါတယ်။

## Process က Memory ကုန်သွားတာ (Process Runs Out of Memory)

Node.js (JavaScript) က garbage collected language တစ်ခု ဖြစ်လို့ — retainers တွေကတစ်ဆင့် memory leak (မမ်မိုရီ ယိုစိမ့်မှု) ဖြစ်နိုင်ပါတယ်။ Node.js application တွေက ပုံမှန်အားဖြင့် multi-tenant ဖြစ်ပြီး business-critical (စီးပွားရေးအရ အရေးပါတဲ့)၊ long-running (ကြာမြင့်စွာ run နေတဲ့) application တွေ ဖြစ်လို့ — memory leak ကို ရှာဖွေဖို့ လွယ်ကူပြီး ထိရောက်တဲ့ နည်းလမ်းတွေ ရှိဖို့က မရှိမဖြစ် အရေးကြီးပါတယ်။

ထို့အပြင် ကိုယ်လိုချင်တဲ့ ရလဒ်တွေ ရအောင် memory ကို အသေးစိတ် ချိန်ညှိ (fine-tune) လုပ်လို့လည်း ရပါတယ်။ အသေးစိတ်အတွက် [Understanding and Tuning Memory (Memory ကို နားလည်၍ ချိန်ညှိခြင်း)](https://nodejs.org/learn/diagnostics/memory/understanding-and-tuning-memory) ကို ကြည့်ပါ။

### Symptoms (လက္ခဏာများ)

User အနေနဲ့ — memory usage က တဖြည်းဖြည်း ဆက်တိုက် တက်နေတာကို မြင်ရပါတယ် (မြန်မြန် ဒါမှမဟုတ် နှေးနှေး — ရက်ပေါင်းများစွာ ဒါမှမဟုတ် ရက်သတ္တပတ်တွေအထိ ကြာနိုင်ပါတယ်)။ နောက်ဆုံးမှာတော့ process က crash ဖြစ်ပြီး process manager က ပြန် restart လုပ်နေတာကို တွေ့ရပါတယ်။ Process က အရင်ကထက် နှေးကွေးနေနိုင်ပြီး — restart တွေကြောင့် request တချို့ မအောင်မြင်တာ (load balancer က 502 ပြန်ပေးတာ) မျိုးလည်း ဖြစ်နိုင်ပါတယ်။

### Side Effects (ဘေးထွက် ဆိုးကျိုးများ)

- Memory ကုန်လို့ process restart ဖြစ်ပြီး — request တွေ ပျက်ကွက် ကျဆုံးသွားတာ
- GC activity များလာလို့ CPU usage မြင့်တက်ပြီး response time နှေးကွေးလာတာ
- GC က [Event Loop](/docs/nodejs/event-loop) ကို ပိတ်ဆို့လို့ application နှေးကွေးလာတာ
- Memory swapping များလာလို့ (GC activity ကြောင့်) process နှေးကွေးလာတာ
- Heap Snapshot ယူဖို့ လုံလောက်တဲ့ memory မရှိတော့တာမျိုး ဖြစ်နိုင်တာ

## Process က Memory ကို ထိရောက်မှု မရှိဘဲ သုံးနေတာ (Process Utilizes Memory Inefficiently)

### Symptoms (လက္ခဏာများ)

Application က မျှော်လင့်မထားတဲ့ memory ပမာဏ သုံးနေတာ ဒါမှမဟုတ် garbage collector ရဲ့ လုပ်ဆောင်မှု (activity) မြင့်မားနေတာကို သတိပြုမိပါတယ်။

### Side Effects (ဘေးထွက် ဆိုးကျိုးများ)

- Page faults အရေအတွက် မြင့်မားနေတာ
- GC activity နဲ့ CPU usage မြင့်မားနေတာ

## Debugging (ရှာဖွေ ဖြေရှင်းခြင်း)

Memory ပြဿနာ အများစုကို — ကိုယ့်ရဲ့ object type တစ်ခုချင်းစီက နေရာ ဘယ်လောက် ယူသလဲ၊ ဘယ် variable တွေက အဲဒီ object တွေကို garbage collected မဖြစ်အောင် တားထားလဲဆိုတာကို ဆုံးဖြတ်ခြင်းဖြင့် ဖြေရှင်းလို့ ရပါတယ်။ ကိုယ့် program ရဲ့ allocation pattern (object တွေ ဖန်တီးနေပုံ) ကို အချိန်နဲ့အမျှ သိထားတာကလည်း အထောက်အကူ ဖြစ်ပါတယ်။ အောက်ပါ နည်းလမ်းတွေကို သုံးနိုင်ပါတယ်:

- [Heap Profiler အသုံးပြုခြင်း (Using Heap Profiler)](https://nodejs.org/learn/diagnostics/memory/using-heap-profiler) — application run နေစဉ် allocation တွေကို အချိန်နဲ့အမျှ ခြေရာခံပြီး — memory issue ဖြစ်စေတဲ့ code ကို ဖော်ထုတ်ခြင်း။ `--inspect` နဲ့ စတင်ပြီး Chrome DevTools ရဲ့ Memory tab ကနေ Allocation Timeline ဒါမှမဟုတ် Allocation sampling ကို သုံးပါတယ်။
- [Heap Snapshot အသုံးပြုခြင်း (Using Heap Snapshot)](https://nodejs.org/learn/diagnostics/memory/using-heap-snapshot) — run နေတဲ့ app ရဲ့ heap တစ်ခုလုံးရဲ့ ပုံရိပ် (snapshot) ကို ယူပြီး — object တွေကို ဘယ်သူတွေက ကိုင်ထားလဲ (retainers)၊ ဘယ်အရာတွေက နေရာ အများဆုံး ယူနေလဲ စစ်ဆေးခြင်း။ Snapshot နှစ်ခုကို ယှဉ်ပြီး memory leak ရှာဖို့လည်း သုံးပါတယ်။
- [GC Traces (Tracing Garbage Collection)](https://nodejs.org/learn/diagnostics/memory/using-gc-traces) — `--trace-gc` flag နဲ့ garbage collection event တွေကို ခြေရာခံပြီး — GC က ဘယ်နှစ်ကြိမ်၊ ဘယ်လောက်ကြာကြာ run နေလဲ၊ code execution ကို ဘယ်လောက် ထိခိုက်နေလဲ ဆန်းစစ်ခြင်း။

## ဆက်ဖတ်ရန်

- [Live Debugging (App Run နေစဉ် အမှားရှာပြင်ခြင်း)](/docs/nodejs/live-debugging) — application logic နဲ့ correctness ပြဿနာများ
- [Poor Performance (Performance နှေးကွေးခြင်း)](/docs/nodejs/poor-performance) — latency မြင့်ခြင်း / CPU usage များခြင်း ပြဿနာများ
- [Node.js Debugging (အမှားရှာပြင်ခြင်း)](/docs/nodejs/debugging) — `--inspect` နဲ့ Inspector ဖွင့်ခြင်း၊ Inspector clients များ
