---
title: "Garbage Collection (GC) ကို ခြေရာခံခြင်း (Tracing Garbage Collection)"
description: "--trace-gc flag သုံးပြီး GC events တွေကို ခြေရာခံ လေ့လာခြင်း — trace output အနက်ဖော်ခြင်း၊ Scavenge / Mark-sweep event တွေ၊ memory leak သံသယ စစ်ဆေးပုံ၊ v8 module နဲ့ performance hooks သုံးပြီး programmatically ခြေရာခံခြင်း"
order: 54
source: "https://nodejs.org/learn/diagnostics/memory/using-gc-traces"
status: translated
updated: 2026-09-02
---

## Garbage Collection (GC) ကို ခြေရာခံခြင်း (Tracing Garbage Collection)

ဒီ guide က garbage collection traces (အမှိုက်သိမ်းခြင်း ခြေရာများ) ရဲ့ အခြေခံတွေကို ဖြတ်သန်း လေ့လာစေမှာ ဖြစ်ပါတယ်။

ဒီ guide ပြီးဆုံးတဲ့အခါ သင်လုပ်နိုင်မှာ:

- ကိုယ့် Node.js application မှာ GC traces ဖွင့်နိုင်ခြင်း
- Traces တွေကို အနက်ဖော် (interpret) နိုင်ခြင်း
- ကိုယ့် Node.js application ထဲက ဖြစ်နိုင်ခြေရှိတဲ့ memory issue တွေကို ဖော်ထုတ်နိုင်ခြင်း

Garbage collector ဘယ်လို အလုပ်လုပ်လဲဆိုတာ လေ့လာစရာ အများကြီး ရှိပါတယ်။ ဒါပေမယ့် တစ်ခုတည်းကို မှတ်ထားရမယ်ဆိုရင် — **GC run နေချိန်မှာ ကိုယ့် code က run မနေပါဘူး**။ ဒါကြောင့် garbage collection က ဘယ်နှစ်ကြိမ်၊ ဘယ်လောက်ကြာကြာ run လဲ၊ ရလဒ်က ဘာလဲဆိုတာကို သိချင်စရာ ကောင်းပါတယ်။

## Setup (ပြင်ဆင်မှု)

ဒီ guide အတွက် အောက်ပါ script ကို သုံးပါမယ်:

```js
// script.mjs

import os from 'node:os';

let len = 1_000_000;
const entries = new Set();

function addEntry() {
  const entry = {
    timestamp: Date.now(),
    memory: os.freemem(),
    totalMemory: os.totalmem(),
    uptime: os.uptime(),
  };

  entries.add(entry);
}

function summary() {
  console.log(`Total: ${entries.size} entries`);
}

// execution
(() => {
  while (len > 0) {
    addEntry();
    process.stdout.write(`~~> ${len} entries to record\r`);
    len--;
  }

  summary();
})();
```

ဒီဥပမာမှာ leak က သိသာပေမယ့် — real-world application တစ်ခုရဲ့ ရှေ့မှောက်မှာတော့ leak ရဲ့ အရင်းအမြစ်ကို ရှာရတာ အင်မတန် ခက်ခဲနိုင်ပါတယ်။

မှတ်ချက် — ဒီ လေ့ကျင့်ခန်းရဲ့ source code ကို [Node.js Diagnostics repository](https://github.com/nodejs/diagnostics/tree/main/documentation/memory/step3/exercise) မှာ ရှာတွေ့နိုင်ပါတယ်။

## Garbage Collection Traces နဲ့ Run လုပ်ခြင်း

`--trace-gc` flag ကို သုံးရင် — ကိုယ့် process ရဲ့ console output မှာ garbage collection အတွက် traces တွေကို မြင်ရပါတယ်:

```bash
$ node --trace-gc script.mjs
```

Output က ဒီလိုမျိုး ထွက်ပါလိမ့်မယ်:

```text
[39067:0x158008000]     2297 ms: Scavenge 117.5 (135.8) -> 102.2 (135.8) MB, 0.8 / 0.0 ms  (average mu = 0.994, current mu = 0.994) allocation failure
[39067:0x158008000]     2375 ms: Scavenge 120.0 (138.3) -> 104.7 (138.3) MB, 0.9 / 0.0 ms  (average mu = 0.994, current mu = 0.994) allocation failure
[39067:0x158008000]     2453 ms: Scavenge 122.4 (140.8) -> 107.1 (140.8) MB, 0.7 / 0.0 ms  (average mu = 0.994, current mu = 0.994) allocation failure
[39067:0x158008000]     2531 ms: Scavenge 124.9 (143.3) -> 109.6 (143.3) MB, 0.7 / 0.0 ms  (average mu = 0.994, current mu = 0.994) allocation failure
[39067:0x158008000]     2610 ms: Scavenge 127.1 (145.5) -> 111.8 (145.5) MB, 0.7 / 0.0 ms  (average mu = 0.994, current mu = 0.994) allocation failure
[39067:0x158008000]     2688 ms: Scavenge 129.6 (148.0) -> 114.2 (148.0) MB, 0.8 / 0.0 ms  (average mu = 0.994, current mu = 0.994) allocation failure
[39067:0x158008000]     2766 ms: Scavenge 132.0 (150.5) -> 116.7 (150.5) MB, 1.1 / 0.0 ms  (average mu = 0.994, current mu = 0.994) allocation failure
Total: 1000000 entries
```

ဖတ်ရ ခက်နေသလား။ Concept အနည်းငယ်ကို ပြန်သုံးသပ်ပြီး `--trace-gc` flag ရဲ့ output တွေကို ရှင်းပြလိုက်ရအောင်။

### `--trace-gc` Trace တစ်ခုကို စစ်ဆေးခြင်း

`--trace-gc` (ဒါမှမဟုတ် `--trace_gc` — ဘယ်ဟာဖြစ်ဖြစ် ရပါတယ်) flag က garbage collection event တိုင်းကို console မှာ ထုတ်ပေးပါတယ်။

စာကြောင်းတစ်ကြောင်းချင်းစီရဲ့ ဖွဲ့စည်းပုံကို ဒီလို ဖော်ပြနိုင်ပါတယ်:

```text
[13973:0x110008000]       44 ms: Scavenge 2.4 (3.2) -> 2.0 (4.2) MB, 0.5 / 0.0 ms  (average mu = 1.000, current mu = 1.000) allocation failure
```

| Token (ကုဒ်အပိုင်း) | အဓိပ္ပာယ် |
| --- | --- |
| `13973` | Run နေတဲ့ process ရဲ့ PID |
| `0x110008000` | Isolate (JS heap instance) |
| `44 ms` | Process စတင်ပြီးနောက် ကြာချိန် (ms) |
| `Scavenge` | GC ရဲ့ type / phase |
| `2.4` | GC မလုပ်မီ heap used (MB) |
| `(3.2)` | GC မလုပ်မီ total heap (MB) |
| `2.0` | GC ပြီးနောက် heap used (MB) |
| `(4.2)` | GC ပြီးနောက် total heap (MB) |
| `0.5 / 0.0 ms` (နောက်က `average mu` / `current mu` တန်ဖိုးတွေနဲ့) | GC မှာ ကုန်ကျချိန် (ms) |
| `allocation failure` | GC ဖြစ်ရတဲ့ အကြောင်းရင်း |

ဒီ guide မှာ event နှစ်ခုကိုပဲ အဓိက အာရုံစိုက်ပါမယ်:

- Scavenge
- Mark-sweep

Heap ကို *spaces* (နေရာများ) ခွဲထားပါတယ်။ အဲဒီထဲမှာ "new" space လို့ ခေါ်တဲ့ နေရာတစ်ခုနဲ့ "old" space လို့ ခေါ်တဲ့ နေရာတစ်ခု ပါဝင်ပါတယ်။

👉 တကယ့် heap structure က ဒီထက် နည်းနည်း ကွဲပြားပါတယ် — ဒါပေမယ့် ဒီ article အတွက် ရိုးရှင်းတဲ့ version ကိုပဲ သုံးပါမယ်။ အသေးစိတ် သိချင်ရင် — Orinoco အကြောင်း [Peter Marshall ရဲ့ ဟောပြောချက်](https://v8.dev/blog/trash-talk) ကို ကြည့်ဖို့ တိုက်တွန်းပါတယ်။

#### Scavenge

Scavenge ဆိုတာ — new space ထဲမှာ garbage collection လုပ်ဆောင်တဲ့ algorithm တစ်ခုရဲ့ နာမည်ပါ။ New space ဆိုတာ object တွေ ဖန်တီးရာ နေရာ ဖြစ်ပြီး — garbage collection အတွက် သေးငယ်ပြီး မြန်ဆန်အောင် ဒီဇိုင်းလုပ်ထားပါတယ်။

Scavenge အခြေအနေတစ်ခုကို စိတ်ကူးကြည့်ရအောင်:

- `A`, `B`, `C` နဲ့ `D` တို့ကို allocate လုပ်ပြီးပြီ ဆိုပါစို့။

```text
| A | B | C | D | <unallocated> |
```

- `E` ကို allocate လုပ်ချင်ပါတယ်
- နေရာ မလုံလောက်လို့ memory ကုန်သွားပါတယ်
- ဒါကြောင့် (garbage) collection တစ်ခု ဖြစ်ပေါ်ပါတယ်
- Dead object တွေကို စုဆောင်းဖယ်ရှားပြီး — living object တွေ ကျန်နေပါတယ်
- `B` နဲ့ `D` က dead ဖြစ်တယ် ဆိုပါစို့

```text
| A | C | <unallocated> |
```

- အခု `E` ကို allocate လုပ်လို့ရပါပြီ

```text
| A | C | E | <unallocated> |
```

V8 က Scavenge နှစ်ကြိမ် ပြီးတဲ့အထိ garbage collected မဖြစ်တဲ့ object တွေကို old space ဆီ promote (ရာထူးတိုး) လုပ်ပါတယ်။

👉 [ပြည့်စုံတဲ့ Scavenge scenario ဥပမာ](https://github.com/thlorenz/v8-perf/blob/master/gc.md#sample-scavenge-scenario)

#### Mark-sweep

Mark-sweep ကို old space ထဲက object တွေကို စုဆောင်းဖို့ သုံးပါတယ်။ Old space ဆိုတာ — new space မှာ လွတ်မြောက်ခဲ့တဲ့ object တွေ နေထိုင်ရာ နေရာပါ။

ဒီ algorithm က အဆင့် နှစ်ဆင့် ပါဝင်ပါတယ်:

- **Mark (အမှတ်အသား)**: အသက်ရှင်နေဆဲ object တွေကို black အနေနဲ့၊ ကျန်တာတွေကို white အနေနဲ့ အမှတ်အသား လုပ်ပါတယ်။
- **Sweep (လှည်းကျင်း)**: White object တွေကို ရှာပြီး free space (လွတ်နေရာ) တွေ အဖြစ် ပြောင်းပေးပါတယ်။

👉 တကယ်တော့ Mark နဲ့ Sweep အဆင့်တွေက ဒီထက် အနည်းငယ် ရှုပ်ထွေးပါတယ်။ [ဒီ document](https://github.com/thlorenz/v8-perf/blob/master/gc.md#marking-state) ကို ဖတ်ပါ။

## `--trace-gc` လက်တွေ့ သုံးကြည့်ခြင်း

### Memory leak (မမ်မိုရီ ယိုစိမ့်မှု)

အခု ခုနက terminal window ဆီ ပြန်သွားကြည့်ရင် — console မှာ `Mark-sweep` event တွေ အများကြီး တွေ့ရပါလိမ့်မယ်။ Event ပြီးနောက် စုဆောင်းရရှိတဲ့ memory ပမာဏကလည်း မထင်ရှားဘူးဆိုတာ မြင်ရပါလိမ့်မယ်။

အခု garbage collection အကြောင်း ကျွမ်းကျင်သွားပြီမို့ — ဘာကို ကောက်ချက်ချနိုင်မလဲ?

ကျွန်တော်တို့မှာ memory leak ရှိနေဖို့ များပါတယ်! ဒါပေမယ့် ဒါကို ဘယ်လို သေချာအောင် လုပ်မလဲ? (သတိရပါ — ဒီဥပမာမှာတော့ သိသာပါတယ်၊ ဒါပေမယ့် real-world application တစ်ခုမှာကော?)

ဒါဆို context ကို ဘယ်လို ရှာဖွေတွေ့ရှိမလဲ?

### Bad allocations တွေရဲ့ Context ရယူနည်း

- Old space က ဆက်တိုက် တိုးနေတာကို သတိပြုမိပြီ ဆိုပါစို့။
- `--max-old-space-size` ကို လျှော့လိုက်ပြီး total heap က limit နဲ့ နီးကပ်အောင် လုပ်ပါ။
- Out of memory ဖြစ်တဲ့အထိ program ကို run ပါ။
- ထွက်လာတဲ့ log က failing context ကို ပြပါလိမ့်မယ်။
- OOM ဖြစ်ခဲ့ရင် heap size ကို ၁၀% ခန့် တိုးပြီး နှစ်ခါလောက် ထပ်စမ်းကြည့်ပါ။ Pattern အတူတူပဲ ဖြစ်နေရင် — memory leak ရှိနေကြောင်း ညွှန်ပြပါတယ်။
- OOM မဖြစ်ဘူးဆိုရင် heap size ကို အဲဒီတန်ဖိုးမှာပဲ ထားလိုက်ပါ — packed heap (ကျပ်ကျပ် ဖြည့်ထားတဲ့ heap) က memory footprint နဲ့ computation latency ကို လျော့ကျစေလို့ပါ။

ဥပမာ — `script.mjs` ကို အောက်ပါ command နဲ့ run ကြည့်ပါ:

```bash
node --trace-gc --max-old-space-size=50 script.mjs
```

OOM (out of memory) ဖြစ်တာကို ကြုံရပါလိမ့်မယ်:

```text
[...]
<--- Last few GCs --->
[40928:0x148008000]      509 ms: Mark-sweep 46.8 (65.8) -> 40.6 (77.3) MB, 6.4 / 0.0 ms  (+ 1.4 ms in 11 steps since start of marking, biggest step 0.2 ms, walltime since start of marking 24 ms) (average mu = 0.977, current mu = 0.977) finalize incrementa[40928:0x148008000]      768 ms: Mark-sweep 56.3 (77.3) -> 47.1 (83.0) MB, 35.9 / 0.0 ms  (average mu = 0.927, current mu = 0.861) allocation failure scavenge might not succeed
<--- JS stacktrace --->
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory [...]
```

အခု 100 MB နဲ့ စမ်းကြည့်ပါ:

```bash
node --trace-gc --max-old-space-size=100 script.mjs
```

အလားတူမျိုးပဲ ကြုံရမှာ ဖြစ်ပြီး — ကွာခြားချက်က နောက်ဆုံး GC trace ထဲမှာ heap size ပိုကြီးတဲ့ တန်ဖိုး ပါလာမှာ ဖြစ်ပါတယ်:

```text
<--- Last few GCs --->
[40977:0x128008000]     2066 ms: Mark-sweep (reduce) 99.6 (102.5) -> 99.6 (102.5) MB, 46.7 / 0.0 ms  (+ 0.0 ms in 0 steps since start of marking, biggest step 0.0 ms, walltime since start of marking 47 ms) (average mu = 0.154, current mu = 0.155) allocati[40977:0x128008000]     2123 ms: Mark-sweep (reduce) 99.6 (102.5) -> 99.6 (102.5) MB, 47.7 / 0.0 ms  (+ 0.0 ms in 0 steps since start of marking, biggest step 0.0 ms, walltime since start of marking 48 ms) (average mu = 0.165, current mu = 0.175) allocati
```

မှတ်ချက် — real application တစ်ခုရဲ့ ရှေ့မှောက်မှာ code ထဲက leaked object ကို ရှာရတာ ခက်ခဲနိုင်ပါတယ်။ Heap snapshot က အဲဒါကို ရှာဖို့ ကူညီပေးနိုင်ပါတယ်။ [Heap snapshot အကြောင်း သီးသန့် guide](https://nodejs.org/learn/diagnostics/memory/using-heap-snapshot#how-to-find-a-memory-leak-with-heap-snapshots) ကို ဝင်ကြည့်ပါ။

### နှေးကွေးခြင်း (Slowness)

Garbage collection တွေ များလွန်းနေလား ဒါမှမဟုတ် overhead ဖြစ်စေနေလားဆိုတာကို ဘယ်လို ဆုံးဖြတ်မလဲ?

- Trace data ထဲက — collection နှစ်ခု ဆက်တိုက်ကြားက အချိန်ကို သုံးသပ်ပါ။
- Trace data ထဲက — GC မှာ ကုန်ကျတဲ့ အချိန်ကိုလည်း သုံးသပ်ပါ။
- GC နှစ်ခုကြားက အချိန်က GC မှာ ကုန်တဲ့အချိန်ထက် နည်းနေရင် — application က ဆိုးဆိုးရွားရွား "ငတ်မွတ်" (starving) နေတာပါ။
- GC နှစ်ခုကြားက အချိန်ရော GC မှာ ကုန်တဲ့အချိန်ရော မြင့်နေရင် — application က ပိုသေးတဲ့ heap ကို သုံးနိုင်ဖို့ များပါတယ်။
- GC နှစ်ခုကြားက အချိန်က GC မှာ ကုန်တဲ့အချိန်ထက် အများကြီး ပိုများနေရင် — application က အတော်အသင့် ကျန်းမာနေပါတယ်။

## Leak ကို ပြုပြင်ခြင်း (Fix the Leak)

အခု leak ကို ပြုပြင်ကြည့်ရအောင်။ Object တစ်ခုထဲမှာ entries တွေ သိမ်းမယ့်အစား — file တစ်ခုထဲမှာ သိမ်းလို့ ရပါတယ်။

Script ကို နည်းနည်း ပြင်ကြည့်ရအောင်:

```js
// script-fix.mjs
import fs from 'node:fs/promises';
import os from 'node:os';

let len = 1_000_000;
const fileName = `entries-${Date.now()}`;

async function addEntry() {
  const entry = {
    timestamp: Date.now(),
    memory: os.freemem(),
    totalMemory: os.totalmem(),
    uptime: os.uptime(),
  };
  await fs.appendFile(fileName, JSON.stringify(entry) + '\n');
}

async function summary() {
  const stats = await fs.lstat(fileName);
  console.log(`File size ${stats.size} bytes`);
}

// execution
(async () => {
  await fs.writeFile(fileName, '----START---\n');
  while (len > 0) {
    await addEntry();
    process.stdout.write(`~~> ${len} entries to record\r`);
    len--;
  }

  await summary();
})();
```

ဒေတာ သိမ်းဖို့ `Set` သုံးတာက မကောင်းတဲ့ အလေ့အကျင့် လုံးဝ မဟုတ်ပါဘူး — ကိုယ့် program ရဲ့ memory footprint ကိုပဲ သတိထားဖို့ လိုတာပါ။

မှတ်ချက် — ဒီ လေ့ကျင့်ခန်းရဲ့ source code ကို [Node.js Diagnostics repository](https://github.com/nodejs/diagnostics/tree/main/documentation/memory/step3/exercise) မှာ ရှာတွေ့နိုင်ပါတယ်။

အခု ဒီ script ကို run ကြည့်ရအောင်:

```bash
node --trace-gc script-fix.mjs
```

အချက် နှစ်ချက် သတိပြုမိပါလိမ့်မယ်:

- Mark-sweep event တွေ ပိုနည်းလာတာ
- Memory footprint က ပထမ script ရဲ့ 130 MB ကျော်နဲ့ ယှဉ်ရင် 25 MB ထက် မကျော်တော့တာ

ဒါက ကျိုးကြောင်းဆီလျော်ပါတယ် — version အသစ်က memory ပေါ် ဖိအား သက်ရောက်မှု နည်းလို့ပါ။

**အဓိက သင်ခန်းစာ**: ဒီ script ကို ဘယ်လို ပိုကောင်းအောင် လုပ်မလဲဆိုတာ စဉ်းစားကြည့်ပါဦး။ Version အသစ်က နှေးတယ်ဆိုတာ သင်မြင်မိပါလိမ့်မယ်။ `Set` ကို ပြန်သုံးပြီး — memory က သတ်မှတ်ထားတဲ့ size တစ်ခု ရောက်မှသာ သူ့ရဲ့ content တွေကို file ထဲ ရေးမယ်ဆိုရင်ကော? [`getHeapStatistics` API](https://nodejs.org/api/v8.html#v8getheapstatistics) က ဒီမှာ အကူအညီ ဖြစ်နိုင်ပါတယ်။

## Bonus: Garbage Collection ကို Programmatically ခြေရာခံခြင်း

### `v8` module အသုံးပြုခြင်း

ကိုယ့် process ရဲ့ သက်တမ်းတစ်ခုလုံးအတွက် traces တွေ မလိုချင်ဘူးဆိုရင် — process အတွင်းကနေ flag ကို သတ်မှတ်လို့ ရပါတယ်။ `v8` module က flag တွေကို ချက်ချင်း သတ်မှတ်နိုင်တဲ့ API တစ်ခုကို ထုတ်ပေးထားပါတယ်:

```js
import v8 from 'v8';

// enabling trace-gc
v8.setFlagsFromString('--trace-gc');

// disabling trace-gc
v8.setFlagsFromString('--notrace-gc');
```

### Performance hooks အသုံးပြုခြင်း

Node.js မှာ garbage collection ကို ခြေရာခံဖို့ performance hooks တွေကို သုံးနိုင်ပါတယ်:

```js
const { PerformanceObserver } = require('node:perf_hooks');

// Create a performance observer
const obs = new PerformanceObserver(list => {
  const entry = list.getEntries()[0];
  /*
  The entry is an instance of PerformanceEntry containing
  metrics of a single garbage collection event.
  For example:
  PerformanceEntry {
    name: 'gc',
    entryType: 'gc',
    startTime: 2820.567669,
    duration: 1.315709,
    kind: 1
  }
  */
});

// Subscribe to notifications of GCs
obs.observe({ entryTypes: ['gc'] });

// Stop subscription
obs.disconnect();
```

### Performance hooks နဲ့ Trace တစ်ခုကို စစ်ဆေးခြင်း

`PerformanceObserver` ထဲက callback ကနေ GC statistics တွေကို `PerformanceEntry` အနေနဲ့ ရယူနိုင်ပါတယ်။ ဥပမာ:

```json
{
  "name": "gc",
  "entryType": "gc",
  "startTime": 2820.567669,
  "duration": 1.315709,
  "kind": 1
}
```

| Property | အဓိပ္ပာယ် |
| --- | --- |
| `name` | Performance entry ရဲ့ နာမည် |
| `entryType` | Performance entry ရဲ့ type |
| `startTime` | Performance entry ရဲ့ စတင်ချိန်ကို မှတ်သားတဲ့ high-resolution millisecond timestamp |
| `duration` | ဒီ entry အတွက် ကုန်ကျခဲ့တဲ့ စုစုပေါင်း milliseconds |
| `kind` | ဖြစ်ပွားခဲ့တဲ့ garbage collection operation ရဲ့ type |
| `flags` | GC အကြောင်း ထပ်ဆောင်း အချက်အလက် |

ပိုပြီး အသေးစိတ် သိချင်ရင် — [performance hooks အကြောင်း documentation](https://nodejs.org/api/perf_hooks.html) ကို ကိုးကားနိုင်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Heap Snapshot အသုံးပြုခြင်း (Using Heap Snapshot)](https://nodejs.org/learn/diagnostics/memory/using-heap-snapshot) — heap snapshot တွေနဲ့ memory leak ရှာဖွေခြင်း
- [Memory ကို နားလည်၍ ချိန်ညှိခြင်း (Understanding and Tuning Memory)](https://nodejs.org/learn/diagnostics/memory/understanding-and-tuning-memory) — V8 memory စီမံခန့်ခွဲမှုနဲ့ tuning flags များ
