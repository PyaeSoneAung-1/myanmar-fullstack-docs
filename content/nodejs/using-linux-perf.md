---
title: "Linux Perf အသုံးပြုခြင်း (Using Linux Perf)"
description: "Linux Perf နဲ့ Node.js application ကို CPU profiling လုပ်နည်း — --perf-basic-prof flags, perf record နဲ့ sample ဖမ်းခြင်း, flame graph အတွက် perfs.out ထုတ်ခြင်း"
order: 51
source: "https://nodejs.org/learn/diagnostics/poor-performance/using-linux-perf"
status: translated
updated: 2026-09-02
---

## Linux Perf အသုံးပြုခြင်း (Using Linux Perf)

Linux Perf က JavaScript, native နဲ့ OS level frames တွေ အပါအဝင် — low-level CPU profiling ကို ပေးစွမ်းပါတယ်။

**အရေးကြီးချက်**: ဒီ tutorial က Linux ပေါ်မှာပဲ ရနိုင်ပါတယ်။

## ဘယ်လို လုပ်ဆောင်မလဲ (How To)

Linux Perf ကို ပုံမှန်အားဖြင့် `linux-tools-common` package ကနေတစ်ဆင့် ရနိုင်ပါတယ်။ `--perf-basic-prof` (ဒါမှမဟုတ်) `--perf-basic-prof-only-functions` ဆိုတဲ့ flags တွေထဲက တစ်ခုခုကနေတစ်ဆင့် — *perf_events* ကို support လုပ်တဲ့ Node.js application တစ်ခုကို စတင်နိုင်ပါတယ်။

`--perf-basic-prof` က file တစ်ခုဆီ (/tmp/perf-PID.map) အမြဲ ရေးသားပါတယ် — ဒါက disk ကို အဆုံးမဲ့ ကြီးထွားစေနိုင်ပါတယ်။ အဲဒါကို စိုးရိမ်တယ်ဆိုရင် — [linux-perf](https://www.npmjs.com/package/linux-perf) module ကို သုံးပါ (ဒါမှမဟုတ်) `--perf-basic-prof-only-functions` ကို သုံးပါ။

ဒီနှစ်ခုကြားက အဓိက ကွာခြားချက်က — `--perf-basic-prof-only-functions` က output နည်းပါးတာမို့ production profiling အတွက် သင့်တော်တဲ့ option တစ်ခု ဖြစ်ပါတယ်။

Application ကို စတင်ပြီး PID ကို ရယူပါ:

```bash
# Application ကို launch လုပ်ပြီး PID ရယူပါ
$ node --perf-basic-prof-only-functions index.js &
[1] 3870
```

ပြီးရင် လိုချင်တဲ့ frequency အရ events တွေကို မှတ်တမ်းတင်ပါ:

```bash
$ sudo perf record -F 99 -p 3870 -g
```

ဒီအဆင့်မှာ — ပိုစိတ်ချရတဲ့ analysis အတွက် records အများကြီး ထုတ်ဖို့ application ပေါ်ကို load test တစ်ခု သုံးချင်သုံးနိုင်ပါတယ်။ အလုပ်ပြီးသွားရင် — command ဆီ SIGINT (Ctrl-C) ပို့ပြီး perf process ကို ပိတ်ပါ။

`perf` က `/tmp` folder ထဲမှာ — ပုံမှန်အားဖြင့် `/tmp/perf-PID.map` (အပေါ်က ဥပမာမှာဆိုရင် `/tmp/perf-3870.map`) ဆိုတဲ့ file တစ်ခုကို ထုတ်ပေးပါလိမ့်မယ်။ ဒီ file ထဲမှာ function တစ်ခုချင်းစီအတွက် ခေါ်ဆိုမှု traces တွေ ပါဝင်ပါတယ်။

ဒီရလဒ်တွေကို သတ်မှတ်ထားတဲ့ file တစ်ခုထဲ စုစည်းဖို့:

```bash
$ sudo perf script > perfs.out
```

Raw output က နားလည်ဖို့ နည်းနည်း ခက်တတ်လို့ — ပုံမှန်အားဖြင့် ဒီ raw file ကို ပိုကောင်းတဲ့ မြင်သာမှုအတွက် flame graphs တွေ ထုတ်ဖို့ သုံးပါတယ်။

ဒီရလဒ်ကနေ flamegraph ထုတ်ဖို့ — [flame graphs tutorial ရဲ့ step 6 ကစပြီး လိုက်လုပ်ပါ](/docs/nodejs/flame-graphs)။

`perf` output က Node.js-specific tool တစ်ခု မဟုတ်တာမို့ — Node.js မှာ JavaScript code တွေကို optimize လုပ်တဲ့ပုံနဲ့ ပတ်သက်ပြီး ပြဿနာ တချို့ ရှိနိုင်ပါတယ်။ နောက်ထပ် ကိုးကားချက်အတွက် [perf output ပြဿနာများ](/docs/nodejs/flame-graphs) section ကို ကြည့်ပါ။

## အသုံးဝင်တဲ့ Links များ

- [Flame Graphs (Flame Graph ဖန်တီးခြင်း)](/docs/nodejs/flame-graphs)
- [Node Flame Graphs on Linux (Brendan Gregg)](https://www.brendangregg.com/blog/2014-09-17/node-flame-graphs-on-linux.html)
- [perf wiki](https://perf.wiki.kernel.org/index.php/Main_Page)
- [Node CPU Profiler (Rafael GSS)](https://blog.rafaelgss.com.br/node-cpu-profiler)
