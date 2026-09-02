---
title: "Heap Profiler အသုံးပြုခြင်း (Using Heap Profiler)"
description: "Heap Profiler သုံးပြီး allocation တွေကို အချိန်နဲ့အမျှ ခြေရာခံခြင်း — Allocation Timeline နဲ့ Sampling Heap Profiler ကို --inspect flag + Chrome DevTools ရဲ့ Memory tab ကနေ သုံးပုံ၊ stacktrace အလိုက် allocation summary ကို ဆန်းစစ်ခြင်း"
order: 55
source: "https://nodejs.org/learn/diagnostics/memory/using-heap-profiler"
status: translated
updated: 2026-09-02
---

## Heap Profiler အသုံးပြုခြင်း (Using Heap Profiler)

Heap profiler က V8 အပေါ်မှာ အလုပ်လုပ်ပြီး — အချိန်နဲ့အမျှ allocation တွေကို ဖမ်းယူပေးပါတယ်။ ဒီ document ထဲမှာ အောက်ပါတို့ကို သုံးပြီး memory profiling လုပ်နည်းကို လေ့လာပါမယ်:

- Allocation Timeline
- Sampling Heap Profiler

[Using Heap Snapshot](https://nodejs.org/learn/diagnostics/memory/using-heap-snapshot) guide မှာ ဖော်ပြခဲ့တဲ့ heap dumps (heap တစ်ခုလုံးရဲ့ ပုံရိပ်ချ) နဲ့ မတူဘဲ — real-time profiling သုံးခြင်းရဲ့ ရည်ရွယ်ချက်က အချိန်ကာလတစ်ခုအတွင်း allocation တွေ ဖြစ်ပေါ်ပုံကို နားလည်ဖို့ ဖြစ်ပါတယ်။

## Heap Profiler — Allocation Timeline

Heap Profiler က Sampling Heap Profiler နဲ့ ဆင်တူပေမယ့် — allocation တိုင်းကို ခြေရာခံပါတယ်။ ဒါကြောင့် Sampling Heap Profiler ထက် overhead ပိုများပြီး — production မှာ သုံးဖို့ အကြံပြုလို့ မရပါဘူး။

Profiler ကို programmatically စတင်/ရပ်ဖို့ [`@mmarchini/observe`](https://www.npmjs.com/package/@mmarchini/observe) ကို သုံးနိုင်ပါတယ်။

### ဘယ်လို လုပ်ဆောင်မလဲ (How To)

Application ကို စတင်ပါ:

```bash
node --inspect index.js
```

Script တွေအတွက်တော့ `--inspect-brk` က ပိုကောင်းတဲ့ ရွေးချယ်မှုပါ။

Chrome ထဲက dev-tools instance ဆီ ချိတ်ဆက်ပြီး:

- `Memory` tab ကို ရွေးပါ။
- `Allocation instrumentation timeline` ကို ရွေးပါ။
- Profiling စတင်ပါ။

Heap profiling run နေချိန်မှာ — memory issue တွေကို ဖော်ထုတ်နိုင်ဖို့ sample တွေ run ဖို့ အခိုင်အမာ အကြံပြုပါတယ်။ ဥပမာ — web application တစ်ခုကို heap profiling လုပ်နေတယ်ဆိုရင် — load ဖန်တီးဖို့ `Apache Benchmark` ကို သုံးနိုင်ပါတယ်:

```bash
$ ab -n 1000 -c 5 http://localhost:3000
```

Load ပြီးသွားတဲ့အခါ stop ခလုတ်ကို နှိပ်ပါ။

နောက်ဆုံးမှာတော့ snapshot data ကို ကြည့်ပါ။

Memory ဆိုင်ရာ ဝေါဟာရ (terminology) အကြောင်း ပိုသိချင်ရင် — အောက်က useful links section ကို ကြည့်ပါ။

## Sampling Heap Profiler

Sampling Heap Profiler က memory allocation pattern နဲ့ reserved space တွေကို အချိန်နဲ့အမျှ ခြေရာခံပါတယ်။ Sampling (နမူနာ ကောက်ယူခြင်း) အခြေခံမို့ — overhead နည်းပြီး production system တွေမှာ သုံးလို့ ရပါတယ်။

Heap profiler ကို programmatically စတင်/ရပ်ဖို့ [`heap-profiler`](https://www.npmjs.com/package/heap-profiler) module ကို သုံးနိုင်ပါတယ်။

### ဘယ်လို လုပ်ဆောင်မလဲ (How To)

Application ကို စတင်ပါ:

```bash
$ node --inspect index.js
```

Script တွေအတွက်တော့ `--inspect-brk` က ပိုကောင်းတဲ့ ရွေးချယ်မှုပါ။

Dev-tools instance ဆီ ချိတ်ဆက်ပြီး:

- `Memory` tab ကို ရွေးပါ။
- `Allocation sampling` ကို ရွေးပါ။
- Profiling စတင်ပါ။

Load တချို့ ဖန်တီးပြီး profiler ကို ရပ်လိုက်ပါ။ ဒါက — သူတို့ရဲ့ stacktraces တွေပေါ် အခြေခံထားတဲ့ allocations ပါတဲ့ summary တစ်ခုကို ထုတ်ပေးပါလိမ့်မယ်။ Heap allocations အများဆုံး ဖြစ်နေတဲ့ function တွေကို အာရုံစိုက်ကြည့်နိုင်ပါတယ် — ဥပမာကို အပေါ်က ပုံတွေမှာ မြင်ရပါတယ်။

## Useful Links (အသုံးဝင်သော လင့်များ)

- [Memory 101](https://developer.chrome.com/docs/devtools/memory-problems/memory-101/) — Chrome DevTools ရဲ့ memory ဝေါဟာရနဲ့ အခြေခံသဘောတရား
- [Allocation Profiler](https://developer.chrome.com/docs/devtools/memory-problems/allocation-profiler/) — DevTools မှာ allocation profiling သုံးပုံ အသေးစိတ်

## ဆက်ဖတ်ရန်

- [Heap Snapshot အသုံးပြုခြင်း (Using Heap Snapshot)](https://nodejs.org/learn/diagnostics/memory/using-heap-snapshot) — heap တစ်ခုလုံးရဲ့ snapshot ယူပြီး memory leak ရှာဖွေခြင်း
- [Memory ပြဿနာများကို Debugging လုပ်ခြင်း (Memory)](https://nodejs.org/learn/diagnostics/memory) — memory ပြဿနာများရဲ့ symptoms နဲ့ debugging နည်းလမ်းများ
