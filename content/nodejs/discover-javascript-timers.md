---
title: "JavaScript Timers အကြောင်း လေ့လာခြင်း"
description: "setTimeout (zero delay အပါအဝင်), clearTimeout, setInterval, clearInterval နဲ့ recursive setTimeout — function execution ကို delay လုပ်ခြင်း နဲ့ periodic ဖြစ်အောင် လုပ်ခြင်း"
order: 18
source: "https://nodejs.org/en/learn/asynchronous-work/discover-javascript-timers"
status: translated
updated: 2026-09-01
---

## setTimeout

`setTimeout(): void`

JavaScript code ရေးတဲ့အခါ — function တစ်ခုရဲ့ execution ကို နှောင့်နှေးစေချင်တဲ့ အခြေအနေတွေ ရှိနိုင်ပါတယ်။

ဒါက `setTimeout` ရဲ့ အလုပ်ပါ။ နောက်မှ execute လုပ်မယ့် callback function တစ်ခုနဲ့ — ဘယ်လောက် ကြာကြာ စောင့်ပြီးမှ run စေချင်လဲဆိုတဲ့ milliseconds တန်ဖိုးတစ်ခုကို သတ်မှတ်ပေးပါတယ်:

```js
setTimeout(() => {
  // runs after 2 seconds
}, 2000);

setTimeout(() => {
  // runs after 50 milliseconds
}, 50);
```

ဒီ syntax က function အသစ်တစ်ခုကို သတ်မှတ်ပါတယ်။ အဲဒီထဲမှာ သင်လိုချင်တဲ့ တခြား function ဘယ်ဟာကိုမဆို ခေါ်နိုင်သလို — ရှိပြီးသား function name တစ်ခုနဲ့ parameter အစုတစ်ခုကိုလည်း ပေးနိုင်ပါတယ်:

```js
const myFunction = (firstParam, secondParam) => {
  // do something
};

// runs after 2 seconds
setTimeout(myFunction, 2000, firstParam, secondParam);
```

`setTimeout` က Node.js မှာ `Timeout` instance တစ်ခုကို ပြန်ပေးပြီး — browser တွေမှာတော့ numeric timer ID တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ object ဒါမှမဟုတ် ID ကို သုံးပြီး — စီစဉ်ထားတဲ့ function execution ကို ပယ်ဖျက်နိုင်ပါတယ်:

```js
const timeout = setTimeout(() => {
  // should run after 2 seconds
}, 2000);

// I changed my mind
clearTimeout(timeout);
```

### Zero delay

Timeout delay ကို `0` လို့ သတ်မှတ်ရင် — callback function က လက်ရှိ function ရဲ့ execution ပြီးတာနဲ့ — တတ်နိုင်သမျှ အမြန်ဆုံး execute လုပ်ပါလိမ့်မယ်:

```js
setTimeout(() => {
  console.log('after ');
}, 0);

console.log(' before ');
```

ဒီ code က ဒီလို print လုပ်ပေးပါလိမ့်မယ်

```
before
after
```

ဒါက လေးလံတဲ့ (intensive) tasks တွေပေါ်မှာ CPU ကို block မဖြစ်အောင် ရှောင်ရှားဖို့ အထူး အသုံးဝင်ပါတယ် — scheduler ထဲမှာ functions တွေကို queue လုပ်ခြင်းဖြင့် — လေးလံတဲ့ တွက်ချက်မှု တစ်ခု လုပ်နေစဉ်မှာတောင် တခြား functions တွေကို execute ဖြစ်စေနိုင်ပါတယ်။

Browser တချို့ (IE နဲ့ Edge) က ဒီလိုမျိုး အတိအကျ လုပ်ဆောင်ချက်တစ်ခုဖြစ်တဲ့ `setImmediate()` method ကို implement လုပ်ထားပေမယ့် — ဒါက standard မဟုတ်ဘဲ [တခြား browser တွေမှာ မရနိုင်ပါဘူး](https://caniuse.com/#feat=setimmediate)။ ဒါပေမယ့် Node.js မှာတော့ ဒါက standard function တစ်ခုပါ။

## setInterval

`setInterval(): void`

`setInterval` က `setTimeout` နဲ့ ဆင်တူတဲ့ function တစ်ခုပါ — ကွာတာက: callback function ကို တစ်ခါပဲ run မယ့်အစား — သင်သတ်မှတ်တဲ့ အချိန်ကာလ (milliseconds) အလိုက် — အမြဲတမ်း run နေမှာ ဖြစ်ပါတယ်:

```js
setInterval(() => {
  // runs every 2 seconds
}, 2000);
```

အပေါ်က function က 2 စက္ကန့် တိုင်း run နေမှာ ဖြစ်ပြီး — `setInterval` က ပြန်ပေးလိုက်တဲ့ interval id ကို သူ့ဆီ ပေးပြီး `clearInterval` သုံးကာ ရပ်တန့်စေနိုင်ပါတယ်:

```js
const timeout = setInterval(() => {
  // runs every 2 seconds
}, 2000);

clearInterval(timeout);
```

`clearInterval` ကို setInterval callback function ထဲမှာ ခေါ်ပြီး — ထပ်ပြီး run သင့်လား ရပ်သင့်လား သူ့ဘာသာ ဆုံးဖြတ်စေတာ အသုံးများပါတယ်။ ဥပမာ — ဒီ code က `App.somethingIWait` မှာ `arrived` တန်ဖိုး ရှိနေရင် ကလွဲလို့ — တစ်ခုခုကို run ပေးပါတယ်:

```js
const interval = setInterval(() => {
  if (App.somethingIWait === 'arrived') {
    clearInterval(interval);
  }
  // otherwise do things
}, 100);
```

## Recursive setTimeout

`setInterval` က function တစ်ခု သူ့ရဲ့ execution ဘယ်တော့ ပြီးလဲဆိုတာကို ဘာမှ ထည့်မစဉ်းစားဘဲ — n milliseconds တိုင်း function တစ်ခုကို စတင်ပေးပါတယ်။

Function က အချိန် တူတူပဲ အမြဲ ကြာမယ်ဆိုရင် — အားလုံး အဆင်ပြေပါတယ်:

```
0         1000        2000        3000
|          |           |           |
|          |           |           |
|       [██████████]   |           |
|       [exe script]   |           |
|       [██████████]   |           |
|          |  [██████████]         |
|          |  [exe script]         |
|          |  [██████████]         |
|          |           |  [██████████]
|          |           |  [exe script]
|          |           |  [██████████]
|__________|___________|___________|____
```

ဥပမာ — network conditions တွေပေါ် မူတည်ပြီး — function က execution ကြာချိန် မတူညီတာတွေ ဖြစ်နိုင်ပါတယ်:

```
0         1000        2000        3000
|          |           |           |
|          |           |           |
|       [██████████]   |           |
|       [exe script]   |           |
|       [██████████]   |           |
|          |  [████████████████████]
|          |  [  execute script    ]
|          |  [████████████████████]
|          |           |     [██████████]
|          |           |     [exe script]
|          |           |     [██████████]
|__________|___________|___________|____
```

ပြီးတော့ execution ကြာတာ တစ်ခုက နောက်တစ်ခုအပေါ် ထပ်နေတာမျိုးလည်း ဖြစ်နိုင်ပါတယ်:

```
0         1000        2000        3000        4000
|          |           |           |           |
|     [████████████████████]       |           |
|     [    execute script  ]       |           |
|     [████████████████████]       |           |
|          [███████████████████████████]       |
|          [      execute script       ]       |
|          [███████████████████████████]       |
|          |           |           [██████████████]
|          |           |           [execute script]
|          |           |           [██████████████]
|__________|___________|___________|___________|__
```

ဒါကို ရှောင်ဖို့ — callback function ပြီးတဲ့အခါ ခေါ်ဖို့ recursive setTimeout တစ်ခုကို စီစဉ်နိုင်ပါတယ်:

```js
const myFunction = () => {
  // do something

  setTimeout(myFunction, 1000);
};

setTimeout(myFunction, 1000);
```

ဒီပုံစံကို ရရှိစေဖို့ပါ:

```
0         1000         2000        3000
|          |            |           |
|     [█████████████]   |    [█████████████]
|     [ exec script ]>──1s──<[ exec script ]
|     [█████████████]   |    [█████████████]
|          |            |           |
|__________|____________|___________|__________
```

`setTimeout` နဲ့ `setInterval` တွေက Node.js မှာ — [Timers module](https://nodejs.org/api/timers.html) ကနေ တစ်ဆင့် ရနိုင်ပါတယ်။

Node.js မှာ `setImmediate()` လည်း ပါဝင်ပြီး — event loop ရဲ့ check phase အတွင်းမှာ execute ဖြစ်ဖို့ callback တစ်ခုကို စီစဉ်ပေးပါတယ်။ `setTimeout(() => {}, 0)` နဲ့တော့ ယေဘုယျအားဖြင့် ညီမျှမှု မရှိပါဘူး — ဘာလို့လဲဆိုတော့ သူတို့ရဲ့ callbacks တွေက event loop ရဲ့ မတူတည်းသော phases တွေမှာ execute လုပ်ပြီး — သူတို့ရဲ့ execution order က execution context ပေါ် မူတည်လို့ပါ။

## ဆက်ဖတ်ရန်

- [Async Programming](/docs/nodejs/async-programming) — callback/promise/async-await ကွာခြားပုံ
- [Event Loop](/docs/nodejs/event-loop) — I/O operation တွေကို ဘယ်လို စီမံပေးသလဲ
