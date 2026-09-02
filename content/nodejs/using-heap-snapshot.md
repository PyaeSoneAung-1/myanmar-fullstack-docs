---
title: "Heap Snapshot အသုံးပြုခြင်း (Using Heap Snapshot)"
description: "Run နေတဲ့ application ကနေ heap snapshot ယူပြီး Chrome DevTools မှာ စစ်ဆေးခြင်း — snapshot ရယူနည်း ၄ မျိုး (inspector, --heapsnapshot-signal, writeHeapSnapshot, inspector protocol) နဲ့ snapshots နှစ်ခု ယှဉ်ပြီး memory leak ရှာဖွေပုံ"
order: 56
source: "https://nodejs.org/learn/diagnostics/memory/using-heap-snapshot"
status: translated
updated: 2026-09-02
---

## Heap Snapshot အသုံးပြုခြင်း (Using Heap Snapshot)

Run နေတဲ့ application ကနေ Heap Snapshot ကို ယူပြီး — [Chrome Developer Tools](https://developer.chrome.com/docs/devtools/) ထဲကို load လုပ်ကာ variable တချို့ကို စစ်ဆေးခြင်း ဒါမှမဟုတ် retainer size (object တွေကို ကိုင်ထားသူတွေရဲ့ အရွယ်အစား) ကို စစ်ကြည့်နိုင်ပါတယ်။ Snapshot အများအပြားကိုလည်း ယှဉ်ပြီး — အချိန်နဲ့အမျှ ကွာခြားချက်တွေကို မြင်နိုင်ပါတယ်။

## သတိပေးချက် (Warning)

Snapshot တစ်ခု ဖန်တီးတဲ့အခါ — ကိုယ့် main thread ထဲက တခြား အလုပ်အားလုံး ရပ်တန့်သွားပါတယ်။ Heap ရဲ့ ပါဝင်မှုပေါ် မူတည်ပြီး — တစ်မိနစ်ထက် ပိုကြာနိုင်ပါတယ်။ Snapshot ကို memory ထဲမှာ တည်ဆောက်တာမို့ — heap size ကို နှစ်ဆ ဖြစ်စေနိုင်ပြီး — memory တစ်ခုလုံး ပြည့်သွားကာ app crash ဖြစ်နိုင်ပါတယ်။

Production မှာ heap snapshot ယူတော့မယ်ဆိုရင် — snapshot ယူမယ့် process က crash ဖြစ်သွားရင်တောင် ကိုယ့် application ရဲ့ availability (ရရှိနိုင်မှု) ကို မထိခိုက်စေဖို့ သေချာအောင် လုပ်ထားပါ။

## ဘယ်လို လုပ်ဆောင်မလဲ (How To)

### Heap Snapshot ရယူခြင်း

Heap snapshot ရဖို့ နည်းလမ်းများစွာ ရှိပါတယ်:

- inspector ကတစ်ဆင့်
- external signal နဲ့ command-line flag ကတစ်ဆင့်
- process အတွင်းက `writeHeapSnapshot` call ကတစ်ဆင့်
- inspector protocol ကတစ်ဆင့်

#### ၁။ Inspector မှာ memory profiling သုံးခြင်း

Node.js ရဲ့ ထိန်းသိမ်းထားတဲ့ (actively maintained) version အားလုံးမှာ အလုပ်လုပ်ပါတယ်။

Node ကို `--inspect` flag နဲ့ run ပြီး inspector ကို ဖွင့်ပါ။

Heap Snapshot ရဖို့ အလွယ်ဆုံးနည်းကတော့ — local မှာ run နေတဲ့ ကိုယ့် process ဆီ inspector တစ်ခုကို ချိတ်ဆက်ပြီး — Memory tab မှာ သွားကာ heap snapshot တစ်ခု ယူတာပါပဲ။

#### ၂။ `--heapsnapshot-signal` flag သုံးခြင်း

v12.0.0 နဲ့ နောက်ပိုင်းတွေမှာ အလုပ်လုပ်ပါတယ်။

Signal တစ်ခုကို တုံ့ပြန်ပြီး heap snapshot ဖန်တီးနိုင်အောင် — command-line flag တစ်ခုနဲ့ node ကို စတင်နိုင်ပါတယ်:

```bash
$ node --heapsnapshot-signal=SIGUSR2 index.js
```

အသေးစိတ်အတွက် — [heapsnapshot-signal flag ရဲ့ နောက်ဆုံး documentation](https://nodejs.org/api/cli.html#--heapsnapshot-signalsignal) ကို ကြည့်ပါ။

#### ၃။ `writeHeapSnapshot` function သုံးခြင်း

v11.13.0 နဲ့ နောက်ပိုင်းတွေမှာ အလုပ်လုပ်ပါတယ်။
အဟောင်းပိုင်း version တွေမှာတော့ `heapdump` package နဲ့ အလုပ်လုပ်နိုင်ပါတယ်။

Server ပေါ်မှာ run နေတဲ့ application လိုမျိုး — အလုပ်လုပ်နေတဲ့ process တစ်ခုကနေ snapshot လိုအပ်ရင် — အောက်ပါအတိုင်း သုံးပြီး ရယူနိုင်ပါတယ်:

```js
require('node:v8').writeHeapSnapshot();
```

File name options တွေအတွက် [`writeHeapSnapshot` docs](https://nodejs.org/api/v8.html#v8writeheapsnapshotfilenameoptions) ကို ကြည့်ပါ။

Process ကို မရပ်ဘဲ ခေါ်နိုင်တဲ့ နည်းလမ်းတစ်ခု ရှိဖို့ လိုပါတယ် — ဒါကြောင့် HTTP handler တစ်ခုထဲမှာ ဒါမှမဟုတ် operating system ဆီက signal တစ်ခုကို တုံ့ပြန်တဲ့အနေနဲ့ ခေါ်ဖို့ အကြံပြုပါတယ်။ Snapshot တစ်ခုကို trigger လုပ်တဲ့ HTTP endpoint ကို အများနဲ့ ထိတွေ့မိအောင် မလုပ်မိဖို့ သတိထားပါ — တခြားဘယ်သူမှ ဝင်ရောက်လို့ မရအောင် ဖြစ်ရပါမယ်။

Node.js v11.13.0 မတိုင်ခင် version တွေအတွက်တော့ — [heapdump package](https://www.npmjs.com/package/heapdump) ကို သုံးနိုင်ပါတယ်။

#### ၄။ Inspector protocol နဲ့ Heap Snapshot trigger လုပ်ခြင်း

Inspector protocol ကို သုံးပြီး process အပြင်ကနေ Heap Snapshot ကို trigger လုပ်နိုင်ပါတယ်။

API ကို သုံးဖို့ Chromium ကနေ တကယ့် inspector ကို run ဖို့တော့ မလိုအပ်ပါဘူး။

ဒီဥပမာက `websocat` နဲ့ `jq` ကို သုံးပြီး bash ထဲမှာ snapshot trigger လုပ်ပုံပါ:

```bash
#!/bin/bash
set -e

kill -USR1 "$1"
rm -f fifo out
mkfifo ./fifo
websocat -B 10000000000 "$(curl -s http://localhost:9229/json | jq -r '.[0].webSocketDebuggerUrl')" < ./fifo > ./out &
exec 3>./fifo
echo '{"method": "HeapProfiler.enable", "id": 1}' > ./fifo
echo '{"method": "HeapProfiler.takeHeapSnapshot", "id": 2}' > ./fifo
while jq -e "[.id != 2, .result != {}] | all" < <(tail -n 1 ./out); do
  sleep 1s
  echo "Capturing Heap Snapshot..."
done

echo -n "" > ./out.heapsnapshot
while read -r line; do
  f="$(echo "$line" | jq -r '.params.chunk')"
  echo -n "$f" >> out.heapsnapshot
  i=$((i+1))
done < <(cat out | tail -n +2 | head -n -1)

exec 3>&-
```

Inspector protocol နဲ့ တွဲသုံးလို့ရတဲ့ memory profiling tools တွေထဲက (ပြည့်စုံတဲ့ စာရင်း မဟုတ်ပါ):

- [OpenProfiling for Node.js](https://github.com/vmarchaud/openprofiling-node)

## Heap Snapshots တွေနဲ့ Memory Leak ရှာဖွေခြင်း

Snapshot နှစ်ခုကို ယှဉ်ခြင်းဖြင့် memory leak ကို ရှာနိုင်ပါတယ်။ Snapshots နှစ်ခုကြားက ကွာခြားချက်ထဲမှာ မလိုအပ်တဲ့ အချက်အလက်တွေ မပါဝင်မိဖို့ အရေးကြီးပါတယ်။ အောက်ပါ အဆင့်တွေက snapshots ကြားမှာ သန့်ရှင်းတဲ့ diff (ကွာခြားချက်) တစ်ခု ရရှိစေပါလိမ့်မယ်:

- Process က sources အားလုံးကို load ပြီး bootstrapping (စတင်တည်ဆောက်မှု) ပြီးအောင် လုပ်ထားပါ — စက္ကန့်အနည်းငယ်လောက်ပဲ ကြာသင့်ပါတယ်။
- Leak ဖြစ်နိုင်တယ်လို့ သံသယရှိတဲ့ functionality ကို စတင် အသုံးပြုပါ — သူက leak ဖြစ်နေတဲ့ဟာတွေ မဟုတ်တဲ့ initial allocations တချို့ လုပ်လာနိုင်ပါတယ်။
- Heap snapshot တစ်ခု ယူပါ။
- Functionality ကို ခဏကြာ ဆက် အသုံးပြုပါ — ကြားထဲမှာ တခြားဘာမှ run မလုပ်ဘဲ သုံးတာ ပိုကောင်းပါတယ်။
- နောက် heap snapshot တစ်ခု ယူပါ။ နှစ်ခုကြားက ကွာခြားချက်ထဲမှာ — leak ဖြစ်နေတဲ့အရာတွေပဲ အများအားဖြင့် ပါဝင်သင့်ပါတယ်။
- Chromium/Chrome dev tools ကို ဖွင့်ပြီး *Memory* tab ကို သွားပါ။
- အရင်ဆုံး အဟောင်း snapshot file ကို load လုပ်ပြီးမှ — အသစ် snapshot ကို load လုပ်ပါ။
- အသစ်ဆုံး snapshot ကို ရွေးပြီး — အပေါ်က dropdown မှာ mode ကို *Summary* ကနေ *Comparison* ကို ပြောင်းပါ။
- Large positive deltas (သိသိသာသာ တိုးလာတဲ့ ကွာခြားချက်တွေ) ကို ရှာပြီး — အောက်က panel ထဲမှာ အဲဒါတွေကို ဖြစ်စေတဲ့ references တွေကို စူးစမ်းကြည့်ပါ။

Heap snapshots ဖမ်းယူတာနဲ့ memory leak ရှာဖွေတာကို — [ဒီ heap snapshot လေ့ကျင့်ခန်း](https://github.com/naugtur/node-example-heapdump) နဲ့ လေ့ကျင့်နိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Heap Profiler အသုံးပြုခြင်း (Using Heap Profiler)](https://nodejs.org/learn/diagnostics/memory/using-heap-profiler) — allocation တွေကို အချိန်နဲ့အမျှ ခြေရာခံခြင်း
- [Garbage Collection (GC) ကို ခြေရာခံခြင်း (Tracing Garbage Collection)](https://nodejs.org/learn/diagnostics/memory/using-gc-traces) — `--trace-gc` flag နဲ့ GC events များကို လေ့လာခြင်း
