---
title: "Event Loop"
description: "Event loop ဆိုတာ ဘာလဲ၊ call stack နဲ့ callback queue၊ macrotask/microtask၊ timers၊ process.nextTick နဲ့ setImmediate"
order: 3
source: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick"
status: translated
updated: 2026-09-01
---

## Event Loop ဆိုတာ ဘာလဲ

**Event loop** က Node.js ကို **single-threaded** ဖြစ်နေတာတောင် **non-blocking I/O** လုပ်နိုင်အောင် လုပ်ပေးတဲ့ အဓိက ယန္တရားပါ။ Node.js က I/O အလုပ်တွေ (file ဖတ်တာ၊ network request လုပ်တာ) ကို **system kernel** ဆီ လွှဲပေးပြီး — kernel က background မှာ အလုပ်လုပ်နေတုန်း JavaScript code တွေ ဆက်ပြီး run နေပါတယ်။ အလုပ်ပြီးတဲ့အခါ kernel က Node.js ကို အသိပေးပြီး သက်ဆိုင်ရာ **callback** ကို queue ထဲ ထည့်ပေးပါတယ်။ Event loop က အဲဒီ callback တွေကို တစ်ခုပြီးတစ်ခု run ပေးတာပါ။

ဒီ cycle ထဲမှာ phase တွေ ရှိပါတယ် — **timers, pending callbacks, poll, check, close callbacks** ဆိုပြီး အစီအစဉ်ကျ လည်ပတ်ပါတယ်။ Phase တစ်ခုစီမှာ သူ့ရဲ့ FIFO queue ရှိပြီး — queue ထဲက callback တွေ ကုန်တဲ့အထိ (သို့) အများဆုံး သတ်မှတ်ချက် ရောက်တဲ့အထိ run ပြီးမှ နောက် phase ကို ဆက်သွားပါတယ်။

## Call Stack နဲ့ Callback Queue

JavaScript က single-threaded မို့ **call stack** (လက်ရှိ run နေတဲ့ function တွေရဲ့ အစီအစဉ်) က တစ်ခုပဲ ရှိပါတယ် — တစ်ချိန်မှာ code တစ်ပိုင်းပဲ run ပါတယ်။ Async operation ပြီးတဲ့အခါ callback က **callback queue** (task queue) ထဲ ရောက်သွားပြီး — call stack လွတ်တဲ့အခါ event loop က callback ကို stack ပေါ် တင်ပေးပါတယ်။

ဒီနေရာမှာ priority ကွာခြားချက် နှစ်မျိုး ရှိပါတယ်:

- **Microtask** — Promise ရဲ့ `then` callback တွေ၊ `queueMicrotask` တွေပါ။ လက်ရှိ operation ပြီးတာနဲ့ timer တွေ မစောင့်ဘဲ ချက်ချင်း run ပါတယ်။
- **Macrotask** — `setTimeout`, `setInterval`, I/O callback စတာတွေပါ။ Microtask တွေ ပြီးမှ တစ်ဆင့်ချင်း run ပါတယ်။

## Timers — setTimeout နဲ့ setInterval

**`setTimeout()`** က သတ်မှတ်ထားတဲ့ အနည်းဆုံး အချိန် ပြည့်ပြီးမှ callback ကို run ပေးပြီး **`setInterval()`** က သတ်မှတ်ထားတဲ့ ကြားကာလတိုင်းမှာ ထပ်ခါထပ်ခါ run ပေးပါတယ်:

```js
setTimeout(() => {
  console.log('this runs after at least 100ms');
}, 100);

setInterval(() => {
  console.log('this runs every 1 second');
}, 1000);
```

သတိထားရမှာ — timer က "အတိအကျ အချိန်" ကို မဟုတ်ဘဲ **threshold (နောက်ဆုံး အနည်းဆုံး အချိန်)** ကိုပဲ သတ်မှတ်ပေးတာပါ။ Callback က တခြား အလုပ်တွေ၊ OS scheduling တွေကြောင့် နောက်ကျတတ်ပါတယ်။

## setImmediate — check phase

**`setImmediate()`** က poll phase ပြီးတာနဲ့ **check phase** မှာ callback ကို run ပေးပါတယ်။ `setTimeout(..., 0)` နဲ့ ဘယ်ဟာက အရင် run မလဲဆိုတာ — ဘယ်နေရာကနေ ခေါ်လဲပေါ် မူတည်ပါတယ်:

```js
// timeout_vs_immediate.js — main module ထဲကဆိုရင် order က သေချာမှု မရှိပါဘူး
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});
```

Main module ကနေ ခေါ်ရင် ဒီနှစ်ခုရဲ့ order က process ရဲ့ performance ပေါ်မူတည်ပြီး ပြောင်းနိုင်ပါတယ်။ ဒါပေမယ့် I/O cycle အတွင်းကနေ ခေါ်ရင်တော့ — **`setImmediate` က `setTimeout` ထက် အမြဲ အရင် run ပါတယ်**:

```js
// timeout_vs_immediate.js — I/O cycle ထဲကဆိုရင် immediate က အရင်ပြေးတယ်
const fs = require('node:fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});
```

## process.nextTick

**`process.nextTick()`** က technically တော့ event loop ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါဘူး — လက်ရှိ operation ပြီးတာနဲ့ phase မရွေး **nextTickQueue** ကို ချက်ချင်း ဆောင်ရွက်ပေးပါတယ်။ ဒါကြောင့် `process.nextTick` က microtask တွေထက်တောင် စောပြီး — `setImmediate` ထက်လည်း သေချာပေါက် အရင် run ပါတယ်:

```js
// argument မမှန်ရင် error ကို nextTick နဲ့ ပြန်ပို့ခြင်း
function apiCall(arg, callback) {
  if (typeof arg !== 'string') {
    return process.nextTick(callback, new TypeError('argument should be string'));
  }
}

apiCall(42, (err) => {
  console.error(err.message); // argument should be string
});
```

ဒီလို သုံးခြင်းရဲ့ ရည်ရွယ်ချက်က — error ကို event loop မဆက်ခင်မှာ ကိုင်တွယ်ခွင့် ပေးဖို့ပါ။ `process.nextTick()` နဲ့ `setImmediate()` က နာမည်တွေ ရှုပ်ထွေးတတ်ပြီး — အနှစ်သာရကတော့ nextTick က **တူညီတဲ့ phase ထဲမှာ** ချက်ချင်း၊ setImmediate က **နောက် iteration (tick)** မှာ run ပါတယ်။ Node.js ရဲ့ အကြံပြုချက်အရ ရှင်းရှင်းလင်းလင်း ဖြစ်အောင် `setImmediate()` ကို ဦးစားပေး သုံးသင့်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Async Programming](/docs/nodejs/async-programming) — event loop ပေါ်မှာ တည်ဆောက်ထားတဲ့ async pattern တွေ
- [File System](/docs/nodejs/file-system) — I/O လုပ်တဲ့အခါ event loop က ဘယ်လို အလုပ်လုပ်သလဲ
- [Modules အခြေခံ](/docs/nodejs/modules) — code ကို module အဖြစ် စုစည်းခြင်း
