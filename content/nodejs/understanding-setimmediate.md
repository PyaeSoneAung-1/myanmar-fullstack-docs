---
title: "setImmediate() ကို နားလည်ခြင်း"
description: "setImmediate() သုံးနည်း၊ setTimeout(() => {}, 0) ၊ process.nextTick() နဲ့ Promise.then() တို့နဲ့ ကွာခြားချက်၊ nextTick queue / microtask queue / macrotask queue အစီအစဉ် (CommonJS နဲ့ ES Modules မှာ မတူညီပုံ)"
order: 22
source: "https://nodejs.org/en/learn/asynchronous-work/understanding-setimmediate"
status: translated
updated: 2026-09-01
---

## setImmediate() ကို နားလည်ခြင်း

Code တစ်ချို့ကို asynchronously — ဒါပေမယ့် တတ်နိုင်သမျှ အမြန်ဆုံး execute လုပ်စေချင်တဲ့အခါ — ရွေးစရာတစ်ခုက Node.js က ပေးထားတဲ့ `setImmediate()` function ကို သုံးတာပါ:

```js
setImmediate(() => {
  // run something
});
```

`setImmediate()` ရဲ့ argument အဖြစ် ပေးလိုက်တဲ့ function တိုင်းက callback တစ်ခုဖြစ်ပြီး — event loop ရဲ့ နောက် iteration မှာ execute လုပ်ခံရပါတယ်။

`setImmediate()` က `setTimeout(() => {}, 0)` (0ms timeout ပေးတာ) နဲ့ရော — `process.nextTick()` နဲ့ရော `Promise.then()` နဲ့ရော ဘယ်လို ကွာခြားသလဲ?

`process.nextTick()` ဆီ ပေးလိုက်တဲ့ function က — event loop ရဲ့ လက်ရှိ iteration ပေါ်မှာ၊ လက်ရှိ operation ပြီးဆုံးပြီးနောက် execute လုပ်ခံရမှာ ဖြစ်ပါတယ်။ ဆိုလိုတာက အဲဒါက `setTimeout` နဲ့ `setImmediate` ထက် အမြဲတမ်း အရင် execute ဖြစ်မှာပါ။

0ms delay ရှိတဲ့ `setTimeout()` callback က `setImmediate()` နဲ့ အရမ်း ဆင်တူပါတယ်။ Execution order က အချက်အမျိုးမျိုးပေါ် မူတည်ပါတယ် — ဒါပေမယ့် နှစ်ခုလုံးက event loop ရဲ့ နောက် iteration မှာ run ကြမှာ ဖြစ်ပါတယ်။

`process.nextTick` callback ကို `process.nextTick queue` ထဲ ထည့်ပါတယ်။ `Promise.then()` callback ကို `promises microtask queue` ထဲ ထည့်ပါတယ်။ `setTimeout`၊ `setImmediate` callback တွေကို `macrotask queue` ထဲ ထည့်ပါတယ်။

Event loop က `process.nextTick queue` ထဲက tasks တွေကို အရင်ဆုံး execute လုပ်ပြီး — ပြီးမှ `promises microtask queue` ကို execute လုပ်ပြီး — နောက်ဆုံးမှ `macrotask queue` ကို execute လုပ်ပါတယ်။

`setImmediate()`၊ `process.nextTick()` နဲ့ `Promise.then()` တို့ကြားက order ကို ပြတဲ့ ဥပမာတစ်ခု ဒီမှာပါ:

```js
const baz = () => console.log('baz');
const foo = () => console.log('foo');
const zoo = () => console.log('zoo');

const start = () => {
  console.log('start');
  setImmediate(baz);
  new Promise((resolve, reject) => {
    resolve('bar');
  }).then(resolve => {
    console.log(resolve);
    process.nextTick(zoo);
  });
  process.nextTick(foo);
};

start();

// start foo bar zoo baz
```

ဒီ code က ပထမဆုံး `start()` ကို ခေါ်ပြီး — `process.nextTick queue` ထဲက `foo()` ကို ခေါ်ပါတယ်။ အဲဒီနောက် `promises microtask queue` ကို ကိုင်တွယ်ပြီး — `bar` ကို print လုပ်ကာ တစ်ချိန်တည်းမှာ `zoo()` ကို `process.nextTick queue` ထဲ ထည့်ပါတယ်။ ပြီးတော့ အခုမှ ထည့်လိုက်တဲ့ `zoo()` ကို ခေါ်ပါတယ်။ နောက်ဆုံးမှ `macrotask queue` ထဲက `baz()` ကို ခေါ်ပါတယ်။

အပေါ်က နိယာမက CommonJS ကိစ္စတွေမှာ မှန်ပါတယ် — ဒါပေမယ့် ES Modules တွေမှာ (ဥပမာ `mjs` files) execution order က မတူညီဘူးဆိုတာ သတိထားပါ:

```js
// start bar foo zoo baz
```

ဒါဖြစ်ရတဲ့ အကြောင်းရင်းက — ES Module ကို load လုပ်တာက asynchronous operation တစ်ခုအနေနဲ့ ထုပ်ပိုးထားလို့ပါ။ ဒါကြောင့် script တစ်ခုလုံးက တကယ်တော့ `promises microtask queue` ထဲမှာ ရှိနေပြီးသားပါ။ ဒါကြောင့် promise က ချက်ချင်း resolved ဖြစ်တဲ့အခါ — သူ့ရဲ့ callback ကို `microtask` queue ထဲ ထပ်ထည့်ပေးပါတယ်။ Node.js က တခြား queue ကို မရွှေ့ခင် queue ကို ရှင်းလင်းဖို့ ကြိုးစားမှာ ဖြစ်လို့ — `bar` ကို အရင်ဆုံး ထွက်တာ တွေ့ရမှာပါ။
