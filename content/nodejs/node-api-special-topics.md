---
title: "အထူးအကြောင်းအရာများ (Special Topics)"
description: "Native addon တစ်ခု ရိုးရှင်းတဲ့ synchronous function call ထက် ကျော်လွန် ကြီးထွားလာတဲ့အခါ ကြုံတွေ့ရမယ့် အဆင့်မြင့် Node-API pattern များ — object/function references, AsyncWorker, thread-safe functions နဲ့ context awareness အကျဉ်းချုပ်"
order: 82
source: "https://nodejs.org/en/learn/node-api/special-topics"
status: translated
updated: 2026-09-03
---

ဒီ section က — သင့်ရဲ့ native addon က ရိုးရှင်းတဲ့ synchronous function call တစ်ခုထက် ကျော်လွန် ကြီးထွားလာတဲ့အခါ ကြုံတွေ့ရမယ့် အဆင့်မြင့် (advanced) Node-API pattern တွေကို အကျုံးဝင်ပါတယ်။

## အကျုံးဝင်သော အကြောင်းအရာများ (Topics Covered)

- [Object နဲ့ Function References](/docs/nodejs/node-api-object-function-refs) — JavaScript objects တွေကို call boundaries (ခေါ်ဆိုမှု နယ်နိမိတ်များ) တွေကို ဖြတ်ကျော်ပြီး ဆက်လက် ရှင်သန်နေစေဖို့ `ObjectReference` နဲ့ `FunctionReference` တွေကို သုံးခြင်း — ဒါဆို garbage collector က ၎င်းတို့ကို စောလွန်းစွာ ပြန်လည် သိမ်းယူမှာ မဟုတ်ပါဘူး
- [AsyncWorker](/docs/nodejs/node-api-asyncworker) — `node-addon-api` ရဲ့ `AsyncWorker` class ကို သုံးပြီး — ကြာမြင့်ချိန် ရှည်လျားတဲ့ C/C++ operations တွေကို background thread တစ်ခုပေါ်မှာ run လုပ်ခြင်း — Node ရဲ့ event loop ကို မပိတ်ဆို့အောင် ထားပေးပါတယ်
- [Thread-safe functions](/docs/nodejs/node-api-thread-safe-functions) — Node.js ရဲ့ main thread မဟုတ်တဲ့ native threads တွေကနေ — thread-safe function API ကို သုံးပြီး JavaScript ထဲကို ပြန်လည် ခေါ်ဆိုခြင်း
- [Context awareness](/docs/nodejs/node-api-context-awareness) — [Worker Threads](https://nodejs.org/api/worker_threads.html) တွေ ရှိနေတဲ့အခါ — instance data နဲ့ cleanup hooks တွေ အပါအဝင် — မှန်ကန်စွာ load/unload ဖြစ်တဲ့ addon တွေ ရေးသားခြင်း

## ဒီအကြောင်းအရာတွေက ဘယ်အချိန်မှာ သက်ဆိုင်သလဲ (When Do These Topics Apply?)

| Topic | ဘယ်အချိန်မှာ လိုအပ်သလဲ |
| -------------------------- | ------------------------------------------------------------------------------------- |
| Object/function references | JS callback သို့မဟုတ် object တစ်ခုကို — လက်ရှိ call ထက် သက်တမ်း ပိုရှည်တဲ့ C++ data member တစ်ခုမှာ သိမ်းဆည်းတဲ့အခါ |
| AsyncWorker | CPU-bound (သို့) blocking I/O အလုပ်တွေကို main thread ပေါ်ကနေ ဖယ်ရှား လွှဲပြောင်းတဲ့အခါ |
| Thread-safe functions | သင်ကိုယ်တိုင် စီမံခန့်ခွဲတဲ့ native threads တွေကနေ JS callbacks တွေကို ခေါ်ဆိုတဲ့အခါ |
| Context awareness | သင့်ရဲ့ addon ကို Worker Thread environments တွေမှာ သုံးတဲ့အခါ (သို့) အကြိမ်များစွာ load/unload လုပ်ခံရတဲ့အခါ |
