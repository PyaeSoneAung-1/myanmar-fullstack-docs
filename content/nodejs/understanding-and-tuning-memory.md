---
title: "Memory ကို နားလည်၍ ချိန်ညှိခြင်း (Understanding and Tuning Memory)"
description: "V8 က memory ကို ဘယ်လို စီမံသလဲ — heap (New Space / Old Space) နဲ့ stack၊ generational garbage collection၊ process.memoryUsage() နဲ့ monitoring လုပ်ခြင်း၊ command-line flags တွေနဲ့ memory ချိန်ညှိခြင်း"
order: 53
source: "https://nodejs.org/learn/diagnostics/memory/understanding-and-tuning-memory"
status: translated
updated: 2026-09-02
---

## Memory ကို နားလည်၍ ချိန်ညှိခြင်း (Understanding and Tuning Memory)

Node.js က Google ရဲ့ V8 JavaScript engine ပေါ်မှာ တည်ဆောက်ထားတဲ့ — server side မှာ JavaScript run ဖို့ စွမ်းဆောင်နိုင်တဲ့ runtime တစ်ခု ဖြစ်ပါတယ်။ ဒါပေမယ့် application တွေ ကြီးထွားလာတာနဲ့အမျှ — performance ကောင်းကောင်း ထိန်းထားနိုင်ဖို့နဲ့ memory leak (မမ်မိုရီ ယိုစိမ့်မှု) ဒါမှမဟုတ် crash တွေလိုမျိုး ပြဿနာတွေကို စီမံဖို့အတွက် — memory ကို စီမံခန့်ခွဲတာက အရေးကြီးတဲ့ အလုပ်တစ်ခု ဖြစ်လာပါတယ်။ ဒီ article ထဲမှာ Node.js ထဲက memory usage ကို ဘယ်လို monitor, manage နဲ့ optimize လုပ်မလဲဆိုတာ လေ့လာပါမယ်။ Heap နဲ့ garbage collection လိုမျိုး အရေးကြီးတဲ့ V8 concept တွေအကြောင်းလည်း ပြောပြီး — command-line flags တွေနဲ့ memory အပြုအမူကို အသေးစိတ် ချိန်ညှိနည်းကိုပါ ဆွေးနွေးသွားပါမယ်။

## V8 က Memory ကို ဘယ်လို စီမံသလဲ (How V8 Manages Memory)

အနှစ်သာရအားဖြင့် V8 က memory ကို အပိုင်းများစွာ ခွဲထားပြီး — အဓိက နေရာ နှစ်ခုကတော့ **heap** နဲ့ **stack** ပဲ ဖြစ်ပါတယ်။ ဒီ space တွေကို နားလည်ထားတာ — အထူးသဖြင့် heap ကို ဘယ်လို စီမံသလဲဆိုတာ — ကိုယ့် app ရဲ့ memory usage ကို မြှင့်တင်ဖို့ အဓိက သော့ချက် ဖြစ်ပါတယ်။

### Heap

V8 ရဲ့ memory management က **generational hypothesis** — object အများစုက ငယ်ရွယ်စဉ်မှာပဲ "သေ" (အသုံးမလိုတော့) ဆိုတဲ့ အယူအဆပေါ် အခြေခံပါတယ်။ ဒါကြောင့် garbage collection ကို optimize လုပ်ဖို့ — heap ကို generations (မျိုးဆက်များ) ခွဲထားပါတယ်:

- **New Space**: ဒီနေရာမှာ အသစ်၊ သက်တမ်းတိုတဲ့ object တွေကို allocate လုပ်ပါတယ်။ ဒီမှာရှိတဲ့ object တွေက "ငယ်ငယ်နဲ့ သေ" မယ်လို့ မျှော်လင့်ရလို့ — garbage collection က မကြာခဏ ဖြစ်ပွားပြီး memory ကို မြန်မြန် ပြန်လည် ရယူနိုင်ပါတယ်။

  ဥပမာ — တစ်စက္ကန့်ကို request ၁၀၀၀ လက်ခံတဲ့ API တစ်ခု ရှိတယ် ဆိုပါစို့။ Request တစ်ခုချင်းစီက `{ name: 'John', age: 30 }` လိုမျိုး ယာယီ object တစ်ခုကို ဖန်တီးပြီး — request ကို process လုပ်ပြီးတာနဲ့ စွန့်ပစ်လိုက်ပါတယ်။ New Space size ကို default အတိုင်း ထားထားရင် — V8 က ဒီ object အသေးစားတွေကို ရှင်းဖို့ minor garbage collection တွေကို မကြာခဏ လုပ်ပေးပြီး — memory usage ကို ထိန်းနိုင်အောင် လုပ်ပေးပါတယ်။

- **Old Space**: New Space ထဲမှာ garbage collection cycle အကြိမ်များစွာကို လွတ်မြောက်ခဲ့တဲ့ object တွေကို Old Space ဆီ promote (ရာထူးတိုး) လုပ်ပါတယ်။ ဒါတွေက ပုံမှန်အားဖြင့် သက်တမ်းရှည်တဲ့ object တွေ ဖြစ်ကြတယ် — ဥပမာ user sessions, cache data (ကက်ရှ်ဒေတာ) ဒါမှမဟုတ် persistent state တွေပါ။ ဒီ object တွေက ကြာကြာ နေထိုင်တတ်လို့ — ဒီ space ထဲမှာ garbage collection က မကြာခဏတော့ မဖြစ်ပေမယ့် — ဖြစ်တဲ့အခါတိုင်း resource ပိုသုံးပါတယ်။

  ဥပမာ — user sessions တွေကို ခြေရာခံနေတဲ့ application တစ်ခု run နေတယ် ဆိုပါစို့။ Session တစ်ခုချင်းစီက `{ userId: 'abc123', timestamp: '2025-04-10T12:00:00', sessionData: {...} }` လိုမျိုး ဒေတာတွေ သိမ်းထားပြီး — user က active ဖြစ်နေသမျှ memory ထဲမှာ ဆက်နေဖို့ လိုပါတယ်။ Concurrent user အရေအတွက် တိုးလာတာနဲ့အမျှ Old Space က ပြည့်သွားပြီး — out-of-memory error တွေ ဒါမှမဟုတ် garbage collection cycle တွေ မထိရောက်လို့ response time နှေးလာတာမျိုး ဖြစ်စေနိုင်ပါတယ်။

V8 မှာ JavaScript object, array နဲ့ function တွေရဲ့ memory ကို **heap** ထဲမှာ allocate လုပ်ပါတယ်။ Heap ရဲ့ size က ပုံသေ မဟုတ်ဘဲ — ရနိုင်တဲ့ memory ထက် ကျော်သုံးမိရင် "out-of-memory" error ဖြစ်ပြီး application crash ကျနိုင်ပါတယ်။

လက်ရှိ heap size limit ကို စစ်ကြည့်ဖို့ `v8` module ကို သုံးနိုင်ပါတယ်:

```js
const v8 = require('node:v8');
const { heap_size_limit } = v8.getHeapStatistics();
const heapSizeInGB = heap_size_limit / (1024 * 1024 * 1024);

console.log(`${heapSizeInGB} GB`);
```

ဒါက maximum heap size ကို gigabytes နဲ့ ထုတ်ပေးပြီး — ကိုယ့် system ရဲ့ ရနိုင်တဲ့ memory ပေါ် အခြေခံပါတယ်။

### Stack

Heap အပြင် V8 က memory စီမံခန့်ခွဲမှုအတွက် **stack** ကိုလည်း သုံးပါတယ်။ Stack ဆိုတာ local variable တွေနဲ့ function call အချက်အလက်တွေကို သိမ်းဖို့ သုံးတဲ့ memory နေရာတစ်ခုပါ။ Heap ကို V8 ရဲ့ garbage collector က စီမံပေမယ့် — stack ကတော့ Last In, First Out (LIFO) နိယာမနဲ့ အလုပ်လုပ်ပါတယ်။

Function တစ်ခုကို ခေါ်လိုက်တိုင်း — frame အသစ်တစ်ခုကို stack ပေါ် push တင်ပါတယ်။ Function က return ပြန်တဲ့အခါ — သူ့ရဲ့ frame ကို pop ချလိုက်ပါတယ်။ Stack က heap ထက် size သေးပေမယ့် — memory allocate / deallocate လုပ်ရတာ ပိုမြန်ပါတယ်။ ဒါပေမယ့် stack မှာ size အကန့်အသတ် ရှိလို့ — memory ကို အလွန်အကျွံ သုံးတာ (ဥပမာ အလွန်နက်တဲ့ recursion) က **stack overflow** ဖြစ်စေနိုင်ပါတယ်။

## Memory Usage ကို စောင့်ကြည့်ခြင်း (Monitoring Memory Usage)

Memory ကို ချိန်ညှိခြင်းမတိုင်ခင် — ကိုယ့် application က memory ဘယ်လောက် သုံးနေလဲဆိုတာ နားလည်ထားဖို့ အရေးကြီးပါတယ်။ Node.js နဲ့ V8 က memory usage စောင့်ကြည့်ဖို့ tool အများအပြား ပေးထားပါတယ်။

### `process.memoryUsage()` အသုံးပြုခြင်း

`process.memoryUsage()` method က ကိုယ့် Node.js process က memory ဘယ်လောက် သုံးနေလဲဆိုတဲ့ အချက်အလက်တွေကို ပေးပါတယ်။ သူက အောက်ပါအတိုင်း အသေးစိတ် ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်:

- **`rss`** (Resident Set Size): Process အတွက် allocate လုပ်ထားတဲ့ စုစုပေါင်း memory — heap အပါအဝင် တခြားနေရာတွေပါ။
- **`heapTotal`**: Heap အတွက် allocate လုပ်ထားတဲ့ စုစုပေါင်း memory။
- **`heapUsed`**: Heap ထဲမှာ လက်ရှိ သုံးနေတဲ့ memory။
- **`external`**: C++ library တွေဆီ binding လုပ်ထားတာလိုမျိုး external resource တွေ သုံးတဲ့ memory။
- **`arrayBuffers`**: Buffer သဖွယ် object အမျိုးမျိုးအတွက် allocate လုပ်ထားတဲ့ memory။

`process.memoryUsage()` ကို ကိုယ့် application ထဲမှာ ဒီလို သုံးနိုင်ပါတယ်:

```js
console.log(process.memoryUsage());
```

Output က နေရာတစ်ခုစီမှာ memory ဘယ်လောက် သုံးနေလဲ ပြပါလိမ့်မယ်:

```json
{
  "rss": 25837568,
  "heapTotal": 5238784,
  "heapUsed": 3666120,
  "external": 1274076,
  "arrayBuffers": 10515
}
```

ဒီတန်ဖိုးတွေကို အချိန်ကြာကြာ စောင့်ကြည့်ခြင်းဖြင့် — memory usage က မမျှော်လင့်ဘဲ တိုးလာနေလားဆိုတာ ဖော်ထုတ်နိုင်ပါတယ်။ ဥပမာ `heapUsed` က မလွှတ်ဘဲ တည်ငြိမ်စွာ ကြီးထွားနေရင် — ကိုယ့် application မှာ memory leak ရှိနေတာကို ညွှန်ပြနိုင်ပါတယ်။

## Memory ချိန်ညှိရန် Command-Line Flags များ (Command-Line Flags for Memory Tuning)

Node.js က memory နဲ့ ပတ်သက်တဲ့ setting တွေကို အသေးစိတ် ချိန်ညှိနိုင်ဖို့ command-line flags အများအပြား ပေးထားပါတယ်။

### `--max-old-space-size`

ဒီ flag က V8 heap ထဲက **Old Space** — သက်တမ်းရှည် object တွေ သိမ်းတဲ့နေရာ — ရဲ့ size ကို ကန့်သတ်ပေးပါတယ်။ ကိုယ့် application က memory ပမာဏ များများ သုံးရင် — ဒီ limit ကို ချိန်ညှိဖို့ လိုနိုင်ပါတယ်။

ဥပမာ — ဝင်လာတဲ့ request တွေကို စဉ်ဆက်မပြတ် လက်ခံနေပြီး request တစ်ခုချင်းစီက object ကြီးကြီးတွေ ဖန်တီးတဲ့ application တစ်ခု ဆိုပါစို့။ အချိန်ကြာလာတာနဲ့အမျှ ဒီ object တွေ မရှင်းလင်းရင် Old Space က ပြည့်လာပြီး — crash ဒါမှမဟုတ် response time နှေးလာတာမျိုး ဖြစ်စေနိုင်ပါတယ်။

`--max-old-space-size` flag ကို သတ်မှတ်ပြီး Old Space size ကို မြှင့်နိုင်ပါတယ်:

```bash
node --max-old-space-size=4096 app.js
```

ဒါက Old Space size ကို 4096 MB (4 GB) သတ်မှတ်ပေးပြီး — caching ဒါမှမဟုတ် user session အချက်အလက်လိုမျိုး persistent data ပမာဏ များများ ကိုင်တွယ်နေတဲ့ application အတွက် အထူး အသုံးဝင်ပါတယ်။

### `--max-semi-space-size`

ဒီ flag က V8 heap ထဲက **New Space** ရဲ့ size ကို ထိန်းချုပ်ပါတယ်။ New Space ဆိုတာ အသစ်ဖန်တီးတဲ့ object တွေကို allocate လုပ်ပြီး မကြာခဏ garbage collected လုပ်တဲ့နေရာ ဖြစ်ပါတယ်။ ဒီ size ကို မြှင့်ပေးခြင်းက minor garbage collection cycle တွေရဲ့ အကြိမ်ရေကို လျော့ကျစေနိုင်ပါတယ်။

ဥပမာ — request အများအပြား လက်ခံပြီး request တစ်ခုချင်းစီက `{ name: 'Alice', action: 'login' }` လိုမျိုး object အသေးစားတွေ ဖန်တီးတဲ့ API တစ်ခု ရှိတယ် ဆိုပါစို့။ Garbage collection မကြာခဏ ဖြစ်လို့ performance ကျဆင်းတာကို သတိထားမိနိုင်ပါတယ်။ New Space size ကို မြှင့်ပေးခြင်းဖြင့် — ဒီ collection တွေရဲ့ အကြိမ်ရေကို လျော့ပြီး ခြုံငုံ performance တိုးတက်စေနိုင်ပါတယ်:

```bash
node --max-semi-space-size=64 app.js
```

ဒါက New Space ကို 64 MB အထိ မြှင့်ပေးလို့ — garbage collection မစတင်ခင် object တွေ ပိုများများ memory ထဲမှာ နေနိုင်ပါတယ်။ Object တွေ ဖန်တီး ဖျက်ဆီးမှု မကြာခဏ ဖြစ်တဲ့ high-throughput (အဝင်အထွက် များတဲ့) environment တွေမှာ အထူး အသုံးဝင်ပါတယ်။

### `--gc-interval`

ဒီ flag က garbage collection cycle တွေ ဘယ်လောက် မကြာခဏ ဖြစ်မလဲဆိုတာကို ချိန်ညှိပေးပါတယ်။ Default အနေနဲ့ V8 က အကောင်းဆုံး interval ကို ဆုံးဖြတ်ပေးပေမယ့် — memory ရှင်းလင်းမှုကို ပိုထိန်းချုပ်ချင်တဲ့ အခြေအနေတချို့မှာ ဒီ setting ကို override လုပ်နိုင်ပါတယ်။

ဥပမာ — stock trading platform လိုမျိုး real-time application တစ်ခုမှာ garbage collection ရဲ့ သက်ရောက်မှုကို အနည်းဆုံး ဖြစ်အောင် — collection အကြိမ်ရေကို လျှော့ချပြီး application က သိသာတဲ့ pause တွေ မရှိဘဲ ဒေတာ process လုပ်နိုင်အောင် လုပ်ချင်နိုင်ပါတယ်:

```bash
node --gc-interval=100 app.js
```

ဒီ setting က V8 ကို allocation ၁၀၀ တိုင်းမှာ garbage collection ကြိုးစားလုပ်ဖို့ အတင်းလုပ်ပါတယ်။ ကိုယ့် use case အတွက် interval ကို ချိန်ညှိဖို့ လိုနိုင်ပေမယ့် — သတိထားပါ: interval ကို သိပ်နိမ့်လွန်းအောင် ထားရင် garbage collection cycle တွေ အလွန်အကျွံ ဖြစ်ပြီး performance ကျဆင်းစေနိုင်ပါတယ်။

### `--expose-gc`

`--expose-gc` flag နဲ့ဆိုရင် — ကိုယ့် application code ထဲကနေ garbage collection ကို ကိုယ်တိုင် (manually) trigger လုပ်နိုင်ပါတယ်။ ဒါက ဒေတာအများကြီး process လုပ်ပြီးချိန်မှာ — နောက်ထပ် အလုပ်တွေ ဆက်မလုပ်ခင် memory ပြန်ရယူချင်တဲ့ အခြေအနေမျိုးမှာ အသုံးဝင်ပါတယ်။

`gc` ကို expose လုပ်ဖို့ app ကို ဒီလို စတင်ပါ:

```bash
node --expose-gc app.js
```

ပြီးတော့ application code ထဲမှာ `global.gc()` ကို ခေါ်ပြီး garbage collection ကို ကိုယ်တိုင် trigger လုပ်နိုင်ပါတယ်:

```js
global.gc();
```

သတိထားရမှာ — garbage collection ကို ကိုယ်တိုင် trigger လုပ်တာက ပုံမှန် GC algorithm ကို **ပိတ်ပစ်တာ မဟုတ်ပါဘူး**။ V8 က လိုအပ်သလို automatic garbage collection ကို ဆက်လုပ်နေဦးမှာ ဖြစ်ပါတယ်။ Manual call တွေက ဖြည့်စွက် (supplemental) သဘောသာ ဖြစ်ပြီး — အလွန်အကျွံ သုံးရင် performance ကို ဆိုးကျိုး သက်ရောက်စေနိုင်လို့ သတိနဲ့ သုံးသင့်ပါတယ်။

## ထပ်ဆောင်း အရင်းအမြစ်များ (Additional Resources)

V8 က memory ကို ဘယ်လို ကိုင်တွယ်လဲဆိုတာ ပိုနက်ရှိုင်းစွာ လေ့လာချင်ရင် — V8 team ရဲ့ ဒီ post တွေကို ကြည့်ပါ:

- [Trash talk: the Orinoco garbage collector](https://v8.dev/blog/trash-talk) — Orinoco garbage collector အကြောင်း
- [Orinoco: young generation garbage collection](https://v8.dev/blog/orinoco-parallel-scavenger) — young generation garbage collection အကြောင်း

## အားလုံး ပေါင်းစပ်ခြင်း (Putting It All Together)

Old Space နဲ့ New Space size တွေကို ချိန်ညှိခြင်း၊ garbage collection ကို ရွေးချယ် ဖြစ်စေခြင်း နဲ့ heap limits တွေကို configure လုပ်ခြင်းအားဖြင့် — ကိုယ့် application ရဲ့ memory usage ကို optimize လုပ်ပြီး ခြုံငုံ performance မြှင့်တင်နိုင်ပါတယ်။ ဒီ tools တွေက demand များတဲ့ အခြေအနေတွေမှာ memory ကို ပိုကောင်းကောင်း စီမံနိုင်စွမ်း ပေးပြီး — application တွေ scale ဖြစ်လာတာနဲ့အမျှ တည်ငြိမ်မှုကို ထိန်းထားနိုင်စေပါတယ်။

## ဆက်ဖတ်ရန်

- [Memory ပြဿနာများကို Debugging လုပ်ခြင်း (Memory)](https://nodejs.org/learn/diagnostics/memory) — memory ပြဿနာများရဲ့ symptoms နဲ့ debugging နည်းလမ်းများ
