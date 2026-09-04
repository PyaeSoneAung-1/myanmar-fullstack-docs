---
title: "Timers"
description: "node:timers module — setTimeout/setInterval/setImmediate နဲ့ Timeout/Immediate classes။"
order: 103
source: "https://nodejs.org/api/timers.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:timers` module က အနာဂတ် အချိန်ကာလ တစ်ခုမှာ ခေါ်ဖို့ functions တွေကို schedule လုပ်ပေးတဲ့ global API တစ်ခုကို ထုတ်ဖော်ပေးပါတယ်။ Timer functions တွေက globals တွေ ဖြစ်တာမို့ — API ကို သုံးဖို့ `require('node:timers')` ကို ခေါ်စရာ မလိုပါဘူး။

Node.js ထဲက timer functions တွေက Web Browsers တွေ ပေးတဲ့ timers API နဲ့ ဆင်တူတဲ့ API တစ်ခုကို implement လုပ်ထားပေမယ့် — Node.js ရဲ့ [Event Loop][] ကို ဗဟိုပြုပြီး တည်ဆောက်ထားတဲ့ မတူညီတဲ့ internal implementation တစ်ခုကို သုံးပါတယ်။

## Class: `Immediate`

ဒီ object ကို internally ဖန်တီးပြီး — [`setImmediate()`][] ကနေ ပြန်ပေးပါတယ်။ Schedule လုပ်ထားတဲ့ လုပ်ဆောင်မှုတွေကို ပယ်ဖျက်ဖို့ [`clearImmediate()`][] ဆီ ပေးပို့နိုင်ပါတယ်။

ပုံမှန်အားဖြင့် immediate တစ်ခုကို schedule လုပ်လိုက်တဲ့အခါ — immediate active ဖြစ်နေသရွေ့ Node.js event loop က ဆက်လက် run နေပါလိမ့်မယ်။ [`setImmediate()`][] က ပြန်ပေးတဲ့ `Immediate` object က ဒီပုံမှန် အပြုအမူကို ထိန်းချုပ်ဖို့ သုံးနိုင်တဲ့ `immediate.ref()` နဲ့ `immediate.unref()` functions နှစ်ခုလုံးကို export လုပ်ပါတယ်။

### `immediate.hasRef()`

* Returns: {boolean}

`true` ဆိုရင် `Immediate` object က Node.js event loop ကို active ဖြစ်နေအောင် ထိန်းထားပါလိမ့်မယ်။

### `immediate.ref()`

* Returns: {Immediate} `immediate` ဆီကို reference တစ်ခု

ခေါ်လိုက်တဲ့အခါ — `Immediate` active ဖြစ်နေသရွေ့ Node.js event loop ကို exit မလုပ်ဖို့ တောင်းဆိုပါတယ်။ `immediate.ref()` ကို အကြိမ်များစွာ ခေါ်လိုက်ရင် သက်ရောက်မှု မရှိပါဘူး။

ပုံမှန်အားဖြင့် `Immediate` objects တွေ အားလုံးက "ref'ed" ဖြစ်နေတာမို့ — အရင်က `immediate.unref()` ကို ခေါ်ထားတာ မဟုတ်ရင် `immediate.ref()` ကို ခေါ်စရာ မလိုအပ်ပါဘူး။

### `immediate.unref()`

* Returns: {Immediate} `immediate` ဆီကို reference တစ်ခု

ခေါ်လိုက်တဲ့အခါ — active ဖြစ်နေတဲ့ `Immediate` object က Node.js event loop ကို active ဖြစ်နေအောင် ထားဖို့ မလိုအပ်တော့ပါဘူး။ Event loop ကို run နေအောင် ထိန်းထားတဲ့ တခြား လုပ်ဆောင်မှု မရှိဘူးဆိုရင် — `Immediate` object ရဲ့ callback ကို မခေါ်ရသေးခင် process က exit ဖြစ်သွားနိုင်ပါတယ်။ `immediate.unref()` ကို အကြိမ်များစွာ ခေါ်လိုက်ရင် သက်ရောက်မှု မရှိပါဘူး။

### `immediate[Symbol.dispose]()`

Immediate ကို ပယ်ဖျက်ပါတယ်။ ဒါက `clearImmediate()` ကို ခေါ်တာနဲ့ ဆင်တူပါတယ်။

## Class: `Timeout`

ဒီ object ကို internally ဖန်တီးပြီး — [`setTimeout()`][] နဲ့ [`setInterval()`][] တို့ကနေ ပြန်ပေးပါတယ်။ Schedule လုပ်ထားတဲ့ လုပ်ဆောင်မှုတွေကို ပယ်ဖျက်ဖို့ [`clearTimeout()`][] (သို့) [`clearInterval()`][] ဆီ ပေးပို့နိုင်ပါတယ်။

ပုံမှန်အားဖြင့် [`setTimeout()`][] (သို့) [`setInterval()`][] ကို သုံးပြီး timer တစ်ခုကို schedule လုပ်လိုက်တဲ့အခါ — timer active ဖြစ်နေသရွေ့ Node.js event loop က ဆက်လက် run နေပါလိမ့်မယ်။ ဒီ functions တွေက ပြန်ပေးတဲ့ `Timeout` objects တစ်ခုချင်းစီတိုင်းက ဒီပုံမှန် အပြုအမူကို ထိန်းချုပ်ဖို့ သုံးနိုင်တဲ့ `timeout.ref()` နဲ့ `timeout.unref()` functions နှစ်ခုလုံးကို export လုပ်ပါတယ်။

### `timeout.close()`

> Stability: 3 - Legacy: Use [`clearTimeout()`][] instead.

* Returns: {Timeout} `timeout` ဆီကို reference တစ်ခု

Timeout ကို ပယ်ဖျက်ပါတယ်။

### `timeout.hasRef()`

* Returns: {boolean}

`true` ဆိုရင် `Timeout` object က Node.js event loop ကို active ဖြစ်နေအောင် ထိန်းထားပါလိမ့်မယ်။

### `timeout.ref()`

* Returns: {Timeout} `timeout` ဆီကို reference တစ်ခု

ခေါ်လိုက်တဲ့အခါ — `Timeout` active ဖြစ်နေသရွေ့ Node.js event loop ကို exit မလုပ်ဖို့ တောင်းဆိုပါတယ်။ `timeout.ref()` ကို အကြိမ်များစွာ ခေါ်လိုက်ရင် သက်ရောက်မှု မရှိပါဘူး။

ပုံမှန်အားဖြင့် `Timeout` objects တွေ အားလုံးက "ref'ed" ဖြစ်နေတာမို့ — အရင်က `timeout.unref()` ကို ခေါ်ထားတာ မဟုတ်ရင် `timeout.ref()` ကို ခေါ်စရာ မလိုအပ်ပါဘူး။

### `timeout.refresh()`

* Returns: {Timeout} `timeout` ဆီကို reference တစ်ခု

Timer ရဲ့ start time ကို လက်ရှိ အချိန်အဖြစ် သတ်မှတ်ပြီး — timer ကို လက်ရှိ အချိန်နဲ့ ချိန်ညှိထားတဲ့ အရင်က သတ်မှတ်ထားတဲ့ duration မှာ callback ခေါ်ဖို့ ပြန် schedule လုပ်ပါတယ်။ ဒါက JavaScript object အသစ်တစ်ခု ခွဲဝေပေးစရာ မလိုဘဲ timer တစ်ခုကို refresh လုပ်ဖို့ အသုံးဝင်ပါတယ်။

Callback ကို ခေါ်ပြီးသွားပြီဖြစ်တဲ့ timer တစ်ခုပေါ်မှာ ဒါကို သုံးလိုက်ရင် timer ကို ပြန်လည် activate လုပ်ပါလိမ့်မယ်။

### `timeout.unref()`

* Returns: {Timeout} `timeout` ဆီကို reference တစ်ခု

ခေါ်လိုက်တဲ့အခါ — active ဖြစ်နေတဲ့ `Timeout` object က Node.js event loop ကို active ဖြစ်နေအောင် ထားဖို့ မလိုအပ်တော့ပါဘူး။ Event loop ကို run နေအောင် ထိန်းထားတဲ့ တခြား လုပ်ဆောင်မှု မရှိဘူးဆိုရင် — `Timeout` object ရဲ့ callback ကို မခေါ်ရသေးခင် process က exit ဖြစ်သွားနိုင်ပါတယ်။ `timeout.unref()` ကို အကြိမ်များစွာ ခေါ်လိုက်ရင် သက်ရောက်မှု မရှိပါဘူး။

### `timeout[Symbol.toPrimitive]()`

* Returns: {integer} ဒီ `timeout` ကို reference လုပ်ဖို့ သုံးနိုင်တဲ့ ဂဏန်း တစ်ခု

`Timeout` တစ်ခုကို primitive တစ်ခုအဖြစ် coerce (ပြောင်းလဲ) လုပ်ပါတယ်။ အဲဒီ primitive ကို `Timeout` ကို clear လုပ်ဖို့ သုံးနိုင်ပါတယ်။ Primitive ကို timeout ကို ဖန်တီးခဲ့တဲ့ thread တစ်ခုတည်းမှာပဲ သုံးလို့ရပါတယ်။ ဒါကြောင့် [`worker_threads`][] ကြားမှာ သုံးဖို့ဆိုရင် — အရင်ဆုံး မှန်ကန်တဲ့ thread ဆီ ပေးပို့ထားရပါမယ်။ ဒါက browser ရဲ့ `setTimeout()` နဲ့ `setInterval()` implementations တွေနဲ့ ပိုကောင်းတဲ့ လိုက်ဖက်ညီမှု (compatibility) ကို ရစေပါတယ်။

### `timeout[Symbol.dispose]()`

Timeout ကို ပယ်ဖျက်ပါတယ်။

## Timer များ စီစဉ်ခြင်း (Scheduling timers)

Node.js ထဲက timer တစ်ခုက — အချိန်ကာလ တစ်ခု ကျော်လွန်ပြီးတဲ့အခါ ပေးထားတဲ့ function တစ်ခုကို ခေါ်ပေးတဲ့ internal construct တစ်ခု ဖြစ်ပါတယ်။ Timer တစ်ခုရဲ့ function ကို ဘယ်အချိန် ခေါ်လဲဆိုတာ — timer ကို ဖန်တီးဖို့ ဘယ် method ကို သုံးခဲ့လဲ၊ Node.js event loop က တခြား ဘယ်လို အလုပ်တွေ လုပ်နေလဲ ဆိုတာတွေပေါ်မှာ မူတည်ပါတယ်။

### `setImmediate(callback[, ...args])`

* `callback` {Function} Node.js [Event Loop][] ရဲ့ ဒီ turn (အလှည့်) ရဲ့ အဆုံးမှာ ခေါ်မယ့် function
* `...args` {any} `callback` ကို ခေါ်တဲ့အခါ ထည့်ပေးဖို့ optional arguments
* Returns: {Immediate} [`clearImmediate()`][] နဲ့ သုံးဖို့

I/O events တွေရဲ့ callbacks တွေ ပြီးသွားပြီးတဲ့နောက်မှာ `callback` ရဲ့ "immediate" execution ကို schedule လုပ်ပါတယ်။

`setImmediate()` ကို အကြိမ်များစွာ ခေါ်ထားရင် — `callback` functions တွေကို ဖန်တီးခဲ့တဲ့ အစီအစဉ်အတိုင်း execution အတွက် queue ထဲ ထည့်ပါတယ်။ Callback queue တစ်ခုလုံးကို event loop iteration (အကြိမ်) တိုင်းမှာ process လုပ်ပါတယ်။ Execution ဖြစ်နေတဲ့ callback တစ်ခုရဲ့ အတွင်းကနေ immediate timer တစ်ခုကို queue ထဲ ထည့်လိုက်ရင် — အဲဒီ timer က နောက် event loop iteration မရောက်မချင်း trigger ဖြစ်မှာ မဟုတ်ပါဘူး။

`callback` က function မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဒီ method မှာ promises အတွက် custom variant တစ်ခု ရှိပြီး — [`timersPromises.setImmediate()`][] ကို သုံးပြီး ရနိုင်ပါတယ်။

### `setInterval(callback[, delay[, ...args]])`

* `callback` {Function} Timer ရဲ့ အချိန် ကုန်ဆုံးတဲ့အခါ ခေါ်မယ့် function
* `delay` {number} `callback` ကို မခေါ်ခင် စောင့်ရမယ့် milliseconds အရေအတွက်။ **Default:** `1`။
* `...args` {any} `callback` ကို ခေါ်တဲ့အခါ ထည့်ပေးဖို့ optional arguments
* Returns: {Timeout} [`clearInterval()`][] နဲ့ သုံးဖို့

`callback` ကို `delay` milliseconds တိုင်းမှာ ထပ်ခါထပ်ခါ execute လုပ်ဖို့ schedule လုပ်ပါတယ်။

`delay` က `2147483647` ထက် ကြီးနေရင် (သို့) `1` ထက် ငယ်နေရင် (သို့) `NaN` ဖြစ်နေရင် — `delay` ကို `1` အဖြစ် သတ်မှတ်ပါလိမ့်မယ်။ Integer မဟုတ်တဲ့ delays တွေကို integer အဖြစ် ဖြတ်တောက် (truncate) ပါတယ်။

`callback` က function မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဒီ method မှာ promises အတွက် custom variant တစ်ခု ရှိပြီး — [`timersPromises.setInterval()`][] ကို သုံးပြီး ရနိုင်ပါတယ်။

### `setTimeout(callback[, delay[, ...args]])`

* `callback` {Function} Timer ရဲ့ အချိန် ကုန်ဆုံးတဲ့အခါ ခေါ်မယ့် function
* `delay` {number} `callback` ကို မခေါ်ခင် စောင့်ရမယ့် milliseconds အရေအတွက်။ **Default:** `1`။
* `...args` {any} `callback` ကို ခေါ်တဲ့အခါ ထည့်ပေးဖို့ optional arguments
* Returns: {Timeout} [`clearTimeout()`][] နဲ့ သုံးဖို့

`delay` milliseconds ကြာပြီးတဲ့နောက်မှာ `callback` တစ်ခါပဲ ခေါ်မယ့် execution ကို schedule လုပ်ပါတယ်။

`callback` က အတိအကျ `delay` milliseconds မှာ ခေါ်ခံရမယ်လို့တော့ မမျှော်လင့်ပါနဲ့။ Node.js က callbacks တွေ ဘယ်အချိန် အတိအကျ fire ဖြစ်မယ်၊ အစီအစဉ် ဘယ်လို ရှိမယ်ဆိုတာတွေကို အာမခံချက် မပေးပါဘူး။ Callback ကို သတ်မှတ်ထားတဲ့ အချိန်နဲ့ အတတ်နိုင်ဆုံး နီးကပ်တဲ့ အချိန်မှာ ခေါ်ပါလိမ့်မယ်။

`delay` က `2147483647` ထက် ကြီးနေရင် (သို့) `1` ထက် ငယ်နေရင် (သို့) `NaN` ဖြစ်နေရင် — `delay` ကို `1` အဖြစ် သတ်မှတ်ပါလိမ့်မယ်။ Integer မဟုတ်တဲ့ delays တွေကို integer အဖြစ် ဖြတ်တောက် (truncate) ပါတယ်။

`callback` က function မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဒီ method မှာ promises အတွက် custom variant တစ်ခု ရှိပြီး — [`timersPromises.setTimeout()`][] ကို သုံးပြီး ရနိုင်ပါတယ်။

## Timer များ ပယ်ဖျက်ခြင်း (Cancelling timers)

[`setImmediate()`][], [`setInterval()`][] နဲ့ [`setTimeout()`][] methods တွေက — schedule လုပ်ထားတဲ့ timers တွေကို ကိုယ်စားပြုတဲ့ objects တွေကို အသီးသီး ပြန်ပေးပါတယ်။ အဲဒါတွေကို timer ကို ပယ်ဖျက်ပြီး trigger မဖြစ်အောင် တားဆီးဖို့ သုံးနိုင်ပါတယ်။

[`setImmediate()`][] နဲ့ [`setTimeout()`][] တို့ရဲ့ promisified variants တွေအတွက်ဆိုရင် — timer ကို ပယ်ဖျက်ဖို့ [`AbortController`][] တစ်ခုကို သုံးနိုင်ပါတယ်။ ပယ်ဖျက်လိုက်တဲ့အခါ ပြန်ပေးထားတဲ့ Promises တွေကို `'AbortError'` တစ်ခုနဲ့ reject လုပ်ပါလိမ့်မယ်။

`setImmediate()` အတွက်:

```mjs
import { setImmediate as setImmediatePromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// We do not `await` the promise so `ac.abort()` is called concurrently.
setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```

```cjs
const { setImmediate: setImmediatePromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The immediate was aborted');
  });

ac.abort();
```

`setTimeout()` အတွက်:

```mjs
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';

const ac = new AbortController();
const signal = ac.signal;

// We do not `await` the promise so `ac.abort()` is called concurrently.
setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```

```cjs
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.error('The timeout was aborted');
  });

ac.abort();
```

### `clearImmediate(immediate)`

* `immediate` {Immediate} [`setImmediate()`][] က ပြန်ပေးတဲ့ `Immediate` object တစ်ခု။

[`setImmediate()`][] နဲ့ ဖန်တီးထားတဲ့ `Immediate` object တစ်ခုကို ပယ်ဖျက်ပါတယ်။

### `clearInterval(timeout)`

* `timeout` {Timeout|string|number} [`setInterval()`][] က ပြန်ပေးတဲ့ `Timeout` object တစ်ခု (သို့) `Timeout` object ရဲ့ [primitive][] ကို string (သို့) number အနေနဲ့။

[`setInterval()`][] နဲ့ ဖန်တီးထားတဲ့ `Timeout` object တစ်ခုကို ပယ်ဖျက်ပါတယ်။

### `clearTimeout(timeout)`

* `timeout` {Timeout|string|number} [`setTimeout()`][] က ပြန်ပေးတဲ့ `Timeout` object တစ်ခု (သို့) `Timeout` object ရဲ့ [primitive][] ကို string (သို့) number အနေနဲ့။

[`setTimeout()`][] နဲ့ ဖန်တီးထားတဲ့ `Timeout` object တစ်ခုကို ပယ်ဖျက်ပါတယ်။

## Timer Promise API များ (Timers Promises API)

`timers/promises` API က `Promise` objects တွေကို ပြန်ပေးတဲ့ timer functions တွေရဲ့ အခြားရွေးချယ်စရာ set တစ်ခုကို ပေးပါတယ်။ API ကို `require('node:timers/promises')` ကနေ ဝင်ရောက်နိုင်ပါတယ်။

```mjs
import {
  setTimeout,
  setImmediate,
  setInterval,
} from 'node:timers/promises';
```

```cjs
const {
  setTimeout,
  setImmediate,
  setInterval,
} = require('node:timers/promises');
```

### `timersPromises.setTimeout([delay[, value[, options]]])`

* `delay` {number} Promise ကို fulfill မလုပ်ခင် စောင့်ရမယ့် milliseconds အရေအတွက်။ **Default:** `1`။
* `value` {any} Promise ကို fulfill လုပ်မယ့် တန်ဖိုး။
* `options` {Object}
  * `ref` {boolean} Schedule လုပ်ထားတဲ့ `Timeout` က Node.js event loop ကို active ဖြစ်နေအောင် မလိုအပ်ကြောင်း ဖော်ပြဖို့ `false` လို့ သတ်မှတ်ပါ။ **Default:** `true`။
  * `signal` {AbortSignal} Schedule လုပ်ထားတဲ့ `Timeout` ကို ပယ်ဖျက်ဖို့ သုံးနိုင်တဲ့ optional `AbortSignal` တစ်ခု။

```mjs
import {
  setTimeout,
} from 'node:timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // Prints 'result'
```

```cjs
const {
  setTimeout,
} = require('node:timers/promises');

setTimeout(100, 'result').then((res) => {
  console.log(res);  // Prints 'result'
});
```

### `timersPromises.setImmediate([value[, options]])`

* `value` {any} Promise ကို fulfill လုပ်မယ့် တန်ဖိုး။
* `options` {Object}
  * `ref` {boolean} Schedule လုပ်ထားတဲ့ `Immediate` က Node.js event loop ကို active ဖြစ်နေအောင် မလိုအပ်ကြောင်း ဖော်ပြဖို့ `false` လို့ သတ်မှတ်ပါ။ **Default:** `true`။
  * `signal` {AbortSignal} Schedule လုပ်ထားတဲ့ `Immediate` ကို ပယ်ဖျက်ဖို့ သုံးနိုင်တဲ့ optional `AbortSignal` တစ်ခု။

```mjs
import {
  setImmediate,
} from 'node:timers/promises';

const res = await setImmediate('result');

console.log(res);  // Prints 'result'
```

```cjs
const {
  setImmediate,
} = require('node:timers/promises');

setImmediate('result').then((res) => {
  console.log(res);  // Prints 'result'
});
```

### `timersPromises.setInterval([delay[, value[, options]]])`

`delay` ms ကြားကာလ (interval) တစ်ခုမှာ values တွေကို ထုတ်ပေးတဲ့ async iterator တစ်ခုကို ပြန်ပေးပါတယ်။ `ref` က `true` ဆိုရင် — event loop ကို alive ဖြစ်နေအောင် ထားဖို့ async iterator ရဲ့ `next()` ကို explicitly (တိုက်ရိုက်) ဖြစ်စေ implicitly (သွယ်ဝိုက်၍) ဖြစ်စေ ခေါ်ဖို့ လိုပါတယ်။

* `delay` {number} Iterations (အကြိမ်များ) ကြားမှာ စောင့်ရမယ့် milliseconds အရေအတွက်။ **Default:** `1`။
* `value` {any} Iterator က ပြန်ပေးမယ့် တန်ဖိုး။
* `options` {Object}
  * `ref` {boolean} Iterations တွေကြားက schedule လုပ်ထားတဲ့ `Timeout` က Node.js event loop ကို active ဖြစ်နေအောင် မလိုအပ်ကြောင်း ဖော်ပြဖို့ `false` လို့ သတ်မှတ်ပါ။ **Default:** `true`။
  * `signal` {AbortSignal} Operations တွေကြားက schedule လုပ်ထားတဲ့ `Timeout` ကို ပယ်ဖျက်ဖို့ သုံးနိုင်တဲ့ optional `AbortSignal` တစ်ခု။

```mjs
import {
  setInterval,
} from 'node:timers/promises';

const interval = 100;
for await (const startTime of setInterval(interval, Date.now())) {
  const now = Date.now();
  console.log(now);
  if ((now - startTime) > 1000)
    break;
}
console.log(Date.now());
```

```cjs
const {
  setInterval,
} = require('node:timers/promises');
const interval = 100;

(async function() {
  for await (const startTime of setInterval(interval, Date.now())) {
    const now = Date.now();
    console.log(now);
    if ((now - startTime) > 1000)
      break;
  }
  console.log(Date.now());
})();
```

### `timersPromises.scheduler.wait(delay[, options])`

> Stability: 1 - Experimental

* `delay` {number} Promise ကို resolve မလုပ်ခင် စောင့်ရမယ့် milliseconds အရေအတွက်။
* `options` {Object}
  * `ref` {boolean} Schedule လုပ်ထားတဲ့ `Timeout` က Node.js event loop ကို active ဖြစ်နေအောင် မလိုအပ်ကြောင်း ဖော်ပြဖို့ `false` လို့ သတ်မှတ်ပါ။ **Default:** `true`။
  * `signal` {AbortSignal} စောင့်ဆိုင်းနေတာကို ပယ်ဖျက်ဖို့ သုံးနိုင်တဲ့ optional `AbortSignal` တစ်ခု။
* Returns: {Promise}

Standard Web Platform API တစ်ခုအနေနဲ့ တည်ဆောက်ဆဲ ဖြစ်တဲ့ [Scheduling APIs][] draft specification မှာ သတ်မှတ်ထားတဲ့ experimental API တစ်ခု ဖြစ်ပါတယ်။

`timersPromises.scheduler.wait(delay, options)` ကို ခေါ်တာက `timersPromises.setTimeout(delay, undefined, options)` ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

```mjs
import { scheduler } from 'node:timers/promises';

await scheduler.wait(1000); // Wait one second before continuing
```

### `timersPromises.scheduler.yield()`

> Stability: 1 - Experimental

* Returns: {Promise}

Standard Web Platform API တစ်ခုအနေနဲ့ တည်ဆောက်ဆဲ ဖြစ်တဲ့ [Scheduling APIs][] draft specification မှာ သတ်မှတ်ထားတဲ့ experimental API တစ်ခု ဖြစ်ပါတယ်။

`timersPromises.scheduler.yield()` ကို ခေါ်တာက argument တွေ မပါဘဲ `timersPromises.setImmediate()` ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

[Event Loop]: https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick#setimmediate-vs-settimeout
[Scheduling APIs]: https://github.com/WICG/scheduling-apis
[`AbortController`]: globals.md#class-abortcontroller
[`TypeError`]: errors.md#class-typeerror
[`clearImmediate()`]: #clearimmediateimmediate
[`clearInterval()`]: #clearintervaltimeout
[`clearTimeout()`]: #cleartimeouttimeout
[`setImmediate()`]: #setimmediatecallback-args
[`setInterval()`]: #setintervalcallback-delay-args
[`setTimeout()`]: #settimeoutcallback-delay-args
[`timersPromises.setImmediate()`]: #timerspromisessetimmediatevalue-options
[`timersPromises.setInterval()`]: #timerspromisessetintervaldelay-value-options
[`timersPromises.setTimeout()`]: #timerspromisessettimeoutdelay-value-options
[`worker_threads`]: worker_threads.md
[primitive]: #timeoutsymboltoprimitive
