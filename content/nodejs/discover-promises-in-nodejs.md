---
title: "Node.js မှာ Promises အကြောင်း လေ့လာခြင်း"
description: "Promise ဆိုတာ ဘာလဲ၊ promise states (pending/fulfilled/rejected)၊ .then()/.catch()/.finally()၊ chaining၊ async/await နဲ့ top-level await၊ Promise-based Node.js APIs၊ Promise.all/allSettled/race/any/try/withResolvers နဲ့ event loop ထဲက task scheduling (queueMicrotask/process.nextTick/setImmediate)"
order: 23
source: "https://nodejs.org/en/learn/asynchronous-work/discover-promises-in-nodejs"
status: translated
updated: 2026-09-01
---

## Node.js မှာ Promises အကြောင်း လေ့လာခြင်း

**Promise** ဆိုတာ JavaScript ထဲက အထူး object တစ်မျိုးပါ — asynchronous operation တစ်ခုရဲ့ နောက်ဆုံး ပြီးမြောက်မှု (ဒါမှမဟုတ် မအောင်မြင်မှု) နဲ့ အဲဒီကရလာတဲ့ တန်ဖိုးကို ကိုယ်စားပြုပါတယ်။ အခြေခံအားဖြင့် Promise ဆိုတာ — အခုချိန်မှာ မရသေးပေမယ့် နောက်နောင်မှာ ရလာမယ့် တန်ဖိုးတစ်ခုအတွက် နေရာလွတ်တစ်ခု (placeholder) ပါ။

Promise ကို pizza မှာယူတာနဲ့ ဥပမာပေးလို့ ရပါတယ်: သင်က pizza ကို ချက်ချင်း မရပါဘူး — ဒါပေမယ့် delivery လုပ်သူက နောက်မှ ယူလာပေးဖို့ ကတိပေးထားပါတယ်။ ဘယ်အချိန် အတိအကျ ရောက်မလဲ မသိပေမယ့် — ရလဒ်က "pizza ရောက်လာမယ်" ဒါမှမဟုတ် "တစ်ခုခု မှားသွားတယ်" ဆိုတဲ့ နှစ်မျိုးထဲက တစ်မျိုးပဲ ဖြစ်မယ်ဆိုတာ သင်သိပါတယ်။

## Promise States

Promise တစ်ခုက state သုံးမျိုးထဲက တစ်မျိုးမှာ ရှိနိုင်ပါတယ်:

- **Pending**: ကနဦး state — asynchronous operation က ဆက်လက် run နေဆဲ ဖြစ်ပါတယ်။

- **Fulfilled**: Operation က အောင်မြင်စွာ ပြီးဆုံးပြီး — Promise က value တစ်ခုနဲ့ resolved ဖြစ်သွားပါပြီ။

- **Rejected**: Operation က မအောင်မြင်ခဲ့ပါဘူး — Promise က reason (များသောအားဖြင့် error) တစ်ခုနဲ့ settled ဖြစ်သွားပါပြီ။

Pizza မှာယူတဲ့အခါ — သင်က pending state ထဲမှာ၊ ဆာလောင်ပြီး မျှော်လင့်ချက်တွေနဲ့ ရှိနေပါတယ်။ Pizza က ပူပူနွေးနွေး ဒိန်ခဲတွေနဲ့ ရောက်လာရင် — fulfilled state ထဲ ရောက်သွားပါပြီ။ ဒါပေမယ့် စားသောက်ဆိုင်က သင့် pizza ကို ကြမ်းပြင်ပေါ် ပစ်ချမိကြောင်း ပြောဆိုရင် — rejected state ထဲ ရောက်သွားပါတယ်။

ညစာက ဝမ်းသာစရာနဲ့ အဆုံးသတ်ဖြစ်ဖြစ်၊ စိတ်ပျက်စရာနဲ့ အဆုံးသတ်ဖြစ်ဖြစ် — နောက်ဆုံး ရလဒ်တစ်ခု ထွက်ပြီးတာနဲ့ Promise က **settled** ဖြစ်တယ်လို့ သတ်မှတ်ပါတယ်။

## Promise တစ်ခုရဲ့ အခြေခံ Syntax

Promise ဖန်တီးဖို့ အသုံးအများဆုံး နည်းလမ်းတွေထဲက တစ်ခုက `new Promise()` constructor ကို သုံးတာပါ။ Constructor က parameter နှစ်ခုပါတဲ့ function တစ်ခုကို ယူပါတယ်: `resolve` နဲ့ `reject`။ ဒီ functions တွေက Promise ကို **pending** state ကနေ **fulfilled** ဒါမှမဟုတ် **rejected** ဆီ ကူးပြောင်းဖို့ သုံးပါတယ်။

Executor function ထဲမှာ error တစ်ခု throw ဖြစ်ရင် — Promise က အဲဒီ error နဲ့ rejected ဖြစ်သွားပါတယ်။
Executor function ရဲ့ return value ကိုတော့ လျစ်လျူရှုပါတယ်: Promise ကို settle လုပ်ဖို့ `resolve` ဒါမှမဟုတ် `reject` ကိုပဲ သုံးသင့်ပါတယ်။

```js
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve('Operation was successful!');
  } else {
    reject('Something went wrong.');
  }
});
```

အပေါ်က ဥပမာမှာ:

- `success` condition က `true` ဆိုရင် — Promise က fulfilled ဖြစ်ပြီး `'Operation was successful!'` ဆိုတဲ့ တန်ဖိုးကို `resolve` function ဆီ ပို့ပေးပါတယ်။

- `success` condition က `false` ဆိုရင် — Promise က rejected ဖြစ်ပြီး `'Something went wrong.'` ဆိုတဲ့ error ကို `reject` function ဆီ ပို့ပေးပါတယ်။

## Promises တွေကို `.then()`, `.catch()` နဲ့ `.finally()` နဲ့ ကိုင်တွယ်ခြင်း

Promise တစ်ခု ဖန်တီးပြီးတာနဲ့ — `.then()`, `.catch()` နဲ့ `.finally()` methods တွေကို သုံးပြီး ရလဒ်ကို ကိုင်တွယ်နိုင်ပါတယ်။

- `.then()` က fulfilled ဖြစ်တဲ့ Promise ကို ကိုင်တွယ်ပြီး သူ့ရဲ့ result ကို ရယူဖို့ သုံးပါတယ်။

- `.catch()` က rejected ဖြစ်တဲ့ Promise ကို ကိုင်တွယ်ပြီး ဖြစ်ပေါ်လာနိုင်တဲ့ errors တွေကို ဖမ်းယူဖို့ သုံးပါတယ်။

- `.finally()` က settled ဖြစ်တဲ့ Promise ကို ကိုင်တွယ်ပါတယ် — Promise က resolved ဖြစ်ဖြစ် rejected ဖြစ်ဖြစ် မခွဲခြားဘဲ run ပါတယ်။

```js
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve('Operation was successful!');
  } else {
    reject('Something went wrong.');
  }
});

myPromise
  .then(result => {
    console.log(result); // This will run if the Promise is fulfilled
  })
  .catch(error => {
    console.error(error); // This will run if the Promise is rejected
  })
  .finally(() => {
    console.log('The promise has completed'); // This will run when the Promise is settled
  });
```

## Promises တွေကို ဆက်တန်း (Chaining) လုပ်ခြင်း

Promises တွေရဲ့ ကောင်းမွန်တဲ့ အင်္ဂါရပ်တွေထဲက တစ်ခုက — asynchronous operations အများကြီးကို အတူတူ ဆက်တန်း ချိတ်ဆက်လို့ ရတာပါ။ Promises တွေကို chain လုပ်တဲ့အခါ — `.then()` block တစ်ခုချင်းစီက သူ့အလှည့် မရောက်ခင် ရှေ့ကတစ်ခု ပြီးစီးတာကို စောင့်ပါတယ်။

```js
const { setTimeout: delay } = require('node:timers/promises');

const promise = delay(1000).then(() => 'First task completed');

promise
  .then(result => {
    console.log(result); // 'First task completed'
    return delay(1000).then(() => 'Second task completed'); // Return a second Promise
  })
  .then(result => {
    console.log(result); // 'Second task completed'
  })
  .catch(error => {
    console.error(error); // If any Promise is rejected, catch the error
  });
```

## Promises တွေနဲ့ Async/Await သုံးခြင်း

ခေတ်သစ် JavaScript မှာ Promises တွေနဲ့ အလုပ်လုပ်ဖို့ အကောင်းဆုံး နည်းလမ်းတွေထဲက တစ်ခုက **async/await** သုံးတာပါ။ ဒါက synchronous ပုံစံနဲ့ တူတဲ့ asynchronous code ရေးလို့ ရစေပြီး — ဖတ်ရတာ၊ ထိန်းသိမ်းရတာ ပိုလွယ်ကူစေပါတယ်။

- `async` က Promise တစ်ခုကို return ပေးတဲ့ function တစ်ခုကို သတ်မှတ်ဖို့ သုံးပါတယ်။

- `await` က `async` function ထဲမှာ Promise တစ်ခု settle မဖြစ်မချင်း execution ကို ခဏရပ်ထားဖို့ သုံးပါတယ်။

```js
async function performTasks() {
  try {
    const result1 = await promise1;
    console.log(result1); // 'First task completed'

    const result2 = await promise2;
    console.log(result2); // 'Second task completed'
  } catch (error) {
    console.error(error); // Catches any rejection or error
  }
}

performTasks();
```

`performTasks` function မှာ `await` keyword က — နောက် statement ကို မရွေ့ခင် Promise တစ်ခုချင်းစီ settle ဖြစ်ကြောင်း အာမခံပါတယ်။ ဒါက asynchronous code ရဲ့ စီးဆင်းမှုကို ပိုပြီး linear ဖြစ်ပြီး ဖတ်ရလွယ်အောင် လုပ်ပေးပါတယ်။

အခြေခံအားဖြင့် — အပေါ်က code က ဒီလို ရေးထားသလိုပဲ execute ဖြစ်ပါတယ်:

```js
promise1
  .then(function (result1) {
    console.log(result1);
    return promise2;
  })
  .then(function (result2) {
    console.log(result2);
  })
  .catch(function (error) {
    console.log(error);
  });
```

### Top-Level Await

[ECMAScript Modules](https://nodejs.org/api/esm.html) သုံးတဲ့အခါ — module ကိုယ်တိုင်က asynchronous operations တွေကို သဘာဝအလျောက် ပံ့ပိုးပေးတဲ့ top-level scope တစ်ခုအဖြစ် သတ်မှတ်ခံရပါတယ်။ ဆိုလိုတာက — `async` function မလိုဘဲ top level မှာ `await` ကို သုံးလို့ရပါတယ်။

```js
import { setTimeout as delay } from 'node:timers/promises';

await delay(1000);
```

Async/await က ဒီမှာ ပြထားတဲ့ ရိုးရှင်းတဲ့ ဥပမာတွေထက် အများကြီး ပိုရှုပ်ထွေးနိုင်ပါတယ်။ Node.js Technical Steering Committee အဖွဲ့ဝင် James Snell ရဲ့ — Promises နဲ့ async/await ရဲ့ ရှုပ်ထွေးမှုတွေကို လေ့လာထားတဲ့ [အသေးစိတ် presentation](https://www.youtube.com/watch?v=XV-u_Ow47s0) တစ်ခု ရှိပါတယ်။

## Promise-based Node.js APIs

Node.js က core APIs အများစုရဲ့ **Promise-based versions** တွေကို ပေးထားပါတယ် — အထူးသဖြင့် asynchronous operations တွေကို ရှေးရိုးအတိုင်း callbacks တွေနဲ့ ကိုင်တွယ်ခဲ့တဲ့ နေရာမျိုးတွေမှာပါ။ ဒါက Node.js APIs တွေနဲ့ Promises တွေကို အတူသုံးရတာ ပိုလွယ်ကူစေပြီး — "callback hell" ဖြစ်နိုင်ခြေကိုလည်း လျှော့ချပေးပါတယ်။

ဥပမာ — `fs` (file system) module မှာ `fs.promises` အောက်မှာ Promise-based API တစ်ခု ရှိပါတယ်:

```js
const fs = require('node:fs').promises;
// Or, you can import the promisified version directly:
// const fs = require('node:fs/promises');

async function readFile() {
  try {
    const data = await fs.readFile('example.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}

readFile();
```

ဒီ ဥပမာမှာ `fs.readFile()` က Promise တစ်ခုကို return ပေးပြီး — ကျွန်တော်တို့က `async/await` syntax သုံးပြီး file ရဲ့ အကြောင်းအရာတွေကို asynchronously ဖတ်ပါတယ်။

## အဆင့်မြင့် Promise Methods

JavaScript ရဲ့ `Promise` global က asynchronous tasks အများကြီးကို ပိုထိရောက်စွာ စီမံခန့်ခွဲဖို့ ကူညီပေးတဲ့ — အစွမ်းထက် methods တွေ အများကြီး ပေးထားပါတယ်:

### Promise.all

`Promise.all(): void`

ဒီ method က Promises array တစ်ခုကို လက်ခံပြီး — Promises အားလုံး fulfilled ဖြစ်တာနဲ့ resolve ဖြစ်တဲ့ Promise အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။ တစ်ခုခု rejected ဖြစ်ရင် — `Promise.all()` က ချက်ချင်း reject လုပ်ပါလိမ့်မယ်။ ဒါပေမယ့် rejection ဖြစ်သွားတာတောင် — Promises တွေက ဆက်ပြီး execute လုပ်နေမှာ ဖြစ်ပါတယ်။ Promises အများကြီးကို ကိုင်တွယ်တဲ့အခါ — အထူးသဖြင့် batch processing မှာ — ဒီ function ကို သုံးတာက system ရဲ့ memory ကို ဖိစီးစေနိုင်ပါတယ်။

```js
const { setTimeout: delay } = require('node:timers/promises');

const fetchData1 = delay(1000).then(() => 'Data from API 1');
const fetchData2 = delay(2000).then(() => 'Data from API 2');

Promise.all([fetchData1, fetchData2])
  .then(results => {
    console.log(results); // ['Data from API 1', 'Data from API 2']
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### Promise.allSettled

`Promise.allSettled(): void`

ဒီ method က promises အားလုံး resolve ဖြစ်ဖြစ် reject ဖြစ်ဖြစ် — အားလုံး settle ဖြစ်တာအထိ စောင့်ပြီး — Promise တစ်ခုချင်းစီရဲ့ ရလဒ်ကို ဖော်ပြတဲ့ objects array တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const promise1 = Promise.resolve('Success');
const promise2 = Promise.reject('Failed');

Promise.allSettled([promise1, promise2]).then(results => {
  console.log(results);
  // [ { status: 'fulfilled', value: 'Success' }, { status: 'rejected', reason: 'Failed' } ]
});
```

`Promise.all()` နဲ့ မတူတာက — `Promise.allSettled()` က failure မှာ short-circuit မလုပ်ပါဘူး။ တချို့ reject ဖြစ်နေရင်တောင် — promises အားလုံး settle ဖြစ်တာအထိ စောင့်ပါတယ်။ ဒါက batch operations တွေအတွက် ပိုကောင်းတဲ့ error handling ကို ပေးပါတယ် — ဘယ်ဟာ အောင်မြင်၊ ဘယ်ဟာ မအောင်မြင်ဆိုတာ အားလုံးရဲ့ အခြေအနေကို သိချင်တဲ့နေရာမျိုးမှာပေါ့။

### Promise.race

`Promise.race(): void`

ဒီ method က — ပထမဆုံး settle ဖြစ်တဲ့ Promise နဲ့အတူ — resolve ဖြစ်ဖြစ် reject ဖြစ်ဖြစ် ချက်ချင်း လုပ်ဆောင်ပါတယ်။ ဘယ် promise က အရင် settle ဖြစ်ဖြစ် — promises အားလုံးက လုံးဝ execute ဖြစ်ပြီးသားပါ။

```js
const { setTimeout: delay } = require('node:timers/promises');

const task1 = delay(2000).then(() => 'Task 1 done');
const task2 = delay(1000).then(() => 'Task 2 done');

Promise.race([task1, task2]).then(result => {
  console.log(result); // 'Task 2 done' (since task2 finishes first)
});
```

### Promise.any

`Promise.any(): void`

ဒီ method က Promises ထဲက တစ်ခုက resolve ဖြစ်တာနဲ့ ချက်ချင်း resolve လုပ်ပါတယ်။ Promises အားလုံး rejected ဖြစ်ရင်တော့ — `AggregateError` တစ်ခုနဲ့ reject လုပ်ပါလိမ့်မယ်။

```js
const { setTimeout: delay } = require('node:timers/promises');

const api1 = delay(2000).then(() => 'API 1 success');
const api2 = delay(1000).then(() => 'API 2 success');
const api3 = delay(1500).then(() => 'API 3 success');

Promise.any([api1, api2, api3])
  .then(result => {
    console.log(result); // 'API 2 success' (since it resolves first)
  })
  .catch(error => {
    console.error('All promises rejected:', error);
  });
```

### `Promise.reject()` နဲ့ `Promise.resolve()`

ဒီ methods တွေက rejected ဒါမှမဟုတ် resolved ဖြစ်နေတဲ့ Promise တစ်ခုကို တိုက်ရိုက် ဖန်တီးပေးပါတယ်။

```js
Promise.resolve('Resolved immediately').then(result => {
  console.log(result); // 'Resolved immediately'
});
```

### Promise.try

`Promise.try(): void`

`Promise.try()` က — synchronous ဖြစ်ဖြစ် asynchronous ဖြစ်ဖြစ် — ပေးထားတဲ့ function တစ်ခုကို execute လုပ်ပြီး ရလဒ်ကို promise တစ်ခုအနေနဲ့ ထုပ်ပိုးပေးတဲ့ method တစ်ခုပါ။ Function က error တစ်ခု throw လုပ်ရင် ဒါမှမဟုတ် rejected promise တစ်ခုကို return ပေးရင် — `Promise.try()` က rejected promise တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ Function က အောင်မြင်စွာ ပြီးဆုံးရင် — return လုပ်လိုက်တဲ့ promise က သူ့ရဲ့ value နဲ့ fulfilled ဖြစ်ပါလိမ့်မယ်။

ဒါက promise chains တွေကို တသမတ်တည်း စတင်ဖို့ အထူး အသုံးဝင်ပါတယ် — အထူးသဖြင့် synchronously error တွေ throw လုပ်နိုင်တဲ့ code တွေနဲ့ အလုပ်လုပ်တဲ့အခါမျိုးမှာပါ။

```js
function mightThrow() {
  if (Math.random() > 0.5) {
    throw new Error('Oops, something went wrong!');
  }
  return 'Success!';
}

Promise.try(mightThrow)
  .then(result => {
    console.log('Result:', result);
  })
  .catch(err => {
    console.error('Caught error:', err.message);
  });
```

ဒီ ဥပမာမှာ `Promise.try()` က — `mightThrow()` က error တစ်ခု throw လုပ်ရင် `.catch()` block ထဲမှာ ဖမ်းမိစေဖို့ အာမခံပေးပါတယ် — ဒါကြောင့် sync နဲ့ async errors နှစ်မျိုးလုံးကို နေရာတစ်ခုတည်းမှာ ကိုင်တွယ်ရတာ ပိုလွယ်ကူပါတယ်။

### Promise.withResolvers

`Promise.withResolvers(): void`

ဒီ method က promise အသစ်တစ်ခုကို သူ့ရဲ့ ဆက်စပ်နေတဲ့ resolve နဲ့ reject functions တွေနဲ့အတူ ဖန်တီးပြီး — အဆင်ပြေတဲ့ object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ ဥပမာ — executor function ရဲ့ အပြင်ဘက်ကနေ နောက်မှ resolve ဒါမှမဟုတ် reject လုပ်ဖို့ လိုအပ်တဲ့အခါမျိုးမှာ သုံးပါတယ်။

```js
const { promise, resolve, reject } = Promise.withResolvers();

setTimeout(() => {
  resolve('Resolved successfully!');
}, 1000);

promise.then(value => {
  console.log('Success:', value);
});
```

ဒီ ဥပမာမှာ `Promise.withResolvers()` က — promise ကို ဘယ်အချိန်၊ ဘယ်လို resolve ဒါမှမဟုတ် reject လုပ်မလဲဆိုတာကို executor function ကို inline သတ်မှတ်စရာမလိုဘဲ — သင့်ကို အပြည့်အဝ ထိန်းချုပ်ခွင့် ပေးပါတယ်။ ဒီ pattern က event-driven programming တွေ၊ timeouts တွေ ဒါမှမဟုတ် non-promise-based APIs တွေနဲ့ ပေါင်းစပ်လုပ်ဆောင်တဲ့အခါမျိုးမှာ အသုံးများပါတယ်။

## Promises တွေနဲ့ Error Handling

Promises တွေမှာ errors တွေကို ကိုင်တွယ်တာက — မမျှော်လင့်တဲ့ အခြေအနေတွေမှာ သင့် application က မှန်ကန်စွာ ပြုမူနေဖို့ အာမခံပေးပါတယ်။

- Promises တွေ execute လုပ်နေစဉ်မှာ ဖြစ်ပေါ်လာတဲ့ errors တွေ ဒါမှမဟုတ် rejections တွေကို ကိုင်တွယ်ဖို့ `.catch()` ကို သုံးနိုင်ပါတယ်။

```js
myPromise
  .then(result => console.log(result))
  .catch(error => console.error(error)) // Handles the rejection
  .finally(() => console.log('Promise completed')); // Runs regardless of promise resolution
```

- တနည်းအားဖြင့် — `async/await` သုံးတဲ့အခါ — errors တွေကို ဖမ်းပြီး ကိုင်တွယ်ဖို့ `try/catch` block တစ်ခုကို သုံးနိုင်ပါတယ်။

```js
async function performTask() {
  try {
    const result = await myPromise;
    console.log(result);
  } catch (error) {
    console.error(error); // Handles any errors
  } finally {
    // This code is executed regardless of failure
    console.log('performTask() completed');
  }
}

performTask();
```

## Event Loop ထဲမှာ Tasks တွေ စီစဉ်ခြင်း

Promises တွေအပြင် — Node.js က event loop ထဲမှာ tasks တွေ စီစဉ်ဖို့ တခြား ယန္တရားတွေလည်း အများကြီး ပေးထားပါတယ်:

### queueMicrotask

`queueMicrotask(): void`

`queueMicrotask()` က microtask တစ်ခုကို စီစဉ်ဖို့ သုံးပါတယ် — microtask ဆိုတာက လက်ရှိ execute ဖြစ်နေတဲ့ script ပြီးတာနဲ့ — တခြား I/O events တွေ ဒါမှမဟုတ် timers တွေ မလုပ်ခင် run တဲ့ ပေါ့ပါးတဲ့ task တစ်ခုပါ။ Microtasks တွေထဲမှာ Promise resolutions တွေလိုမျိုး — ပုံမှန် tasks တွေထက် ဦးစားပေး လုပ်ဆောင်ခံရတဲ့ — တခြား asynchronous operations တွေလည်း ပါဝင်ပါတယ်။

```js
queueMicrotask(() => {
  console.log('Microtask is executed');
});

console.log('Synchronous task is executed');
```

အပေါ်က ဥပမာမှာ "Microtask is executed" က "Synchronous task is executed" ပြီးမှ log ဖြစ်ပေမယ့် — timers လိုမျိုး I/O operations တွေ မလုပ်ခင် log ဖြစ်ပါလိမ့်မယ်။

### process.nextTick

`process.nextTick(): void`

`process.nextTick()` က — လက်ရှိ operation ပြီးစီးပြီးချင်း ချက်ချင်း execute လုပ်ဖို့ callback တစ်ခုကို စီစဉ်ဖို့ သုံးပါတယ်။ ဒါက callback တစ်ခုကို တတ်နိုင်သမျှ အမြန်ဆုံး — ဒါပေမယ့် လက်ရှိ execution context ပြီးမှပဲ — execute ဖြစ်စေချင်တဲ့ အခြေအနေတွေအတွက် အသုံးဝင်ပါတယ်။

```js
process.nextTick(() => {
  console.log('Next tick callback');
});

console.log('Synchronous task executed');
```

### setImmediate

`setImmediate(): void`

`setImmediate()` က — Node.js event loop ရဲ့ check phase မှာ execute ဖြစ်ဖို့ callback တစ်ခုကို စီစဉ်ပေးပါတယ်။ Check phase က poll phase ပြီးမှ run ပြီး — အဲဒီမှာ I/O callbacks အများစုကို လုပ်ဆောင်ပါတယ်။

```js
setImmediate(() => {
  console.log('Immediate callback');
});

console.log('Synchronous task executed');
```

### ဘယ်အချိန်မှာ ဘယ်ဟာ သုံးမလဲ

- `queueMicrotask()` ကို — လက်ရှိ script ပြီးပြီးချင်း၊ I/O ဒါမှမဟုတ် timer callbacks တွေ မလုပ်ခင် ချက်ချင်း run ဖို့ လိုတဲ့ tasks တွေအတွက် သုံးပါ — ပုံမှန်အားဖြင့် Promise resolutions တွေအတွက်ပါ။

- `process.nextTick()` ကို — I/O events တွေ မလုပ်ခင် execute သင့်တဲ့ tasks တွေအတွက် သုံးပါ — operations တွေကို ရွှေ့ဆိုင်းခြင်း ဒါမှမဟုတ် errors တွေကို synchronously ကိုင်တွယ်ခြင်းအတွက် မကြာခဏ အသုံးဝင်ပါတယ်။

- `setImmediate()` ကို — poll phase ပြီးနောက်၊ I/O callbacks အများစု လုပ်ဆောင်ပြီးတာနဲ့ run သင့်တဲ့ tasks တွေအတွက် သုံးပါ။

ဒီ tasks တွေက လက်ရှိ synchronous flow ရဲ့ အပြင်ဘက်မှာ execute လုပ်လို့ — ဒီ callbacks တွေထဲမှာ ဖမ်းမမိတဲ့ exceptions တွေက ပတ်ဝန်းကျင်က `try/catch` blocks တွေနဲ့ ဖမ်းလို့ မရပါဘူး။ ကောင်းကောင်း စီမံမထားရင် (ဥပမာ — Promises တွေဆီ `.catch()` တွဲပေးတာ ဒါမှမဟုတ် `process.on('uncaughtException')` လိုမျိုး global error handlers တွေ သုံးတာမျိုး မလုပ်ရင်) — application က crash ဖြစ်သွားနိုင်ပါတယ်။

Event Loop အကြောင်းနဲ့ အဆင့်အမျိုးမျိုးရဲ့ execution order အကြောင်း ပိုသိချင်ရင် — ဆက်စပ် ဆောင်းပါးဖြစ်တဲ့ [The Node.js Event Loop](/docs/nodejs/event-loop) ကို ကြည့်ပါ။
