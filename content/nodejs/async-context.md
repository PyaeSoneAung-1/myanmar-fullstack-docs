---
title: "Asynchronous context tracking"
description: "node:async_hooks — AsyncLocalStorage နဲ့ AsyncResource — asynchronous operations နဲ့ promise chains တွေတစ်လျှောက် state တွေကို ဆက်စပ်ဖြန့်ဝေခြင်း (async context tracking)"
order: 121
source: "https://nodejs.org/api/async_context.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

## နိဒါန်း (Introduction)

ဒီ classes တွေက state (အခြေအနေ/ဒေတာ) တွေကို ဆက်စပ်သိမ်းဆည်းပြီး — callbacks နဲ့ promise chains တွေတစ်လျှောက် ဖြန့်ဝေဖို့ သုံးပါတယ်။ Web request တစ်ခု သို့မဟုတ် အခြား asynchronous duration (ကြာချိန်) တစ်ခုခုရဲ့ သက်တမ်းတစ်လျှောက်လုံး data တွေကို သိမ်းဆည်းနိုင်အောင် ဒါတွေက ခွင့်ပြုပေးပါတယ်။ တခြား programming languages တွေမှာ ရှိတဲ့ thread-local storage နဲ့ ဆင်တူပါတယ်။

`AsyncLocalStorage` နဲ့ `AsyncResource` classes တွေက `node:async_hooks` module ရဲ့ အစိတ်အပိုင်း ဖြစ်ပါတယ်:

```mjs
import { AsyncLocalStorage, AsyncResource } from 'node:async_hooks';
```

```cjs
const { AsyncLocalStorage, AsyncResource } = require('node:async_hooks');
```

## Class: `AsyncLocalStorage`

ဒီ class က asynchronous operations တွေတစ်လျှောက် ညီညွတ်မှု (coherent) ရှိနေတဲ့ stores တွေကို ဖန်တီးပေးပါတယ်။

`node:async_hooks` module ပေါ်မှာ ကိုယ်ပိုင် implementation တစ်ခု ရေးနိုင်ပေမယ့် — `AsyncLocalStorage` ကို ဦးစားပေး သုံးသင့်ပါတယ်။ ဘာလို့လဲဆိုတော့ ဒါက အကောင်အထည်ဖော်ဖို့ မသိသာတဲ့ သိသာထင်ရှားတဲ့ optimizations (ပိုမိုကောင်းမွန်အောင် ပြုပြင်မှုများ) တွေ ပါဝင်တဲ့ — performant ဖြစ်ပြီး memory-safe ဖြစ်တဲ့ implementation တစ်ခု ဖြစ်လို့ပါ။

အောက်က ဥပမာက `AsyncLocalStorage` ကို သုံးပြီး — ဝင်လာတဲ့ HTTP requests တွေကို IDs တွေ သတ်မှတ်ပေးပြီး request တစ်ခုချင်းစီအတွင်း log လုပ်တဲ့ messages တွေထဲမှာ အဲဒီ IDs တွေ ပါဝင်အောင် လုပ်ပေးတဲ့ ရိုးရှင်းတဲ့ logger တစ်ခုကို တည်ဆောက်ထားတာပါ။

```mjs
import http from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   0: finish
//   1: start
//   1: finish
```

```cjs
const http = require('node:http');
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}

let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    // Imagine any chain of async operations here
    setImmediate(() => {
      logWithId('finish');
      res.end();
    });
  });
}).listen(8080);

http.get('http://localhost:8080');
http.get('http://localhost:8080');
// Prints:
//   0: start
//   0: finish
//   1: start
//   1: finish
```

`AsyncLocalStorage` ရဲ့ instance တစ်ခုချင်းစီက လွတ်လပ်တဲ့ (independent) storage context တစ်ခုကို ထိန်းသိမ်းထားပါတယ်။ Instance အများအပြားက တစ်ပြိုင်နက် ဘေးကင်းစွာ တည်ရှိနိုင်ပြီး — တစ်ခုနဲ့တစ်ခုရဲ့ data တွေကို ဝင်ရောက် နှောင့်ယှက်နိုင်တဲ့ အန္တရာယ် မရှိပါဘူး။

### `new AsyncLocalStorage([options])`

* `options` {Object}
  * `defaultValue` {any} store တစ်ခုမှ မပေးထားတဲ့အခါ သုံးမယ့် default တန်ဖိုး။
  * `name` {string} `AsyncLocalStorage` တန်ဖိုးအတွက် နာမည်တစ်ခု။

`AsyncLocalStorage` ရဲ့ instance အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ Store ကို `run()` ခေါ်မှုတစ်ခုရဲ့ အတွင်းမှာ (သို့) `enterWith()` ခေါ်မှုတစ်ခုရဲ့ နောက်မှာပဲ ပံ့ပိုးပေးပါတယ်။

### Static method: `AsyncLocalStorage.bind(fn)`

* `fn` {Function} လက်ရှိ execution context နဲ့ bind (ချိတ်ဆက်) လုပ်မယ့် function။
* Returns: {Function} ဖမ်းယူထားတဲ့ (captured) execution context အတွင်းမှာ `fn` ကို ခေါ်ပေးမယ့် function အသစ်တစ်ခု။

ပေးထားတဲ့ function ကို လက်ရှိ execution context နဲ့ bind လုပ်ပါတယ်။

### Static method: `AsyncLocalStorage.snapshot()`

* Returns: {Function} `(fn: (...args) : R, ...args) : R` ဆိုတဲ့ signature ရှိတဲ့ function အသစ်တစ်ခု။

လက်ရှိ execution context ကို ဖမ်းယူပြီး — function တစ်ခုကို argument အနေနဲ့ လက်ခံတဲ့ function တစ်ခုကို ပြန်ပေးပါတယ်။ ပြန်ပေးလိုက်တဲ့ function ကို ခေါ်လိုက်တိုင်း — ဖမ်းယူထားတဲ့ context အတွင်းမှာ သူ့ဆီ ပေးလိုက်တဲ့ function ကို ခေါ်ပေးပါတယ်။

```js
const asyncLocalStorage = new AsyncLocalStorage();
const runInAsyncScope = asyncLocalStorage.run(123, () => AsyncLocalStorage.snapshot());
const result = asyncLocalStorage.run(321, () => runInAsyncScope(() => asyncLocalStorage.getStore()));
console.log(result);  // returns 123
```

`AsyncLocalStorage.snapshot()` က ရိုးရှင်းတဲ့ async context tracking ရည်ရွယ်ချက်တွေအတွက် `AsyncResource` သုံးစရာ မလိုအောင် အစားထိုးပေးနိုင်ပါတယ်။ ဥပမာ:

```js
class Foo {
  #runInAsyncScope = AsyncLocalStorage.snapshot();

  get() { return this.#runInAsyncScope(() => asyncLocalStorage.getStore()); }
}

const foo = asyncLocalStorage.run(123, () => new Foo());
console.log(asyncLocalStorage.run(321, () => foo.get())); // returns 123
```

### `asyncLocalStorage.disable()`

> Stability: 1 - Experimental

`AsyncLocalStorage` ရဲ့ instance ကို disable လုပ်ပါတယ်။ `asyncLocalStorage.run()` (သို့) `asyncLocalStorage.enterWith()` ကို နောက်တစ်ကြိမ် ခေါ်လိုက်တဲ့အထိ — `asyncLocalStorage.getStore()` ဆီကို နောက်ပိုင်း ခေါ်မှုအားလုံးက `undefined` ကို ပြန်ပေးပါလိမ့်မယ်။

`asyncLocalStorage.disable()` ကို ခေါ်လိုက်တဲ့အခါ — instance နဲ့ ချိတ်ဆက်ထားတဲ့ လက်ရှိ contexts တွေ အားလုံးကို ထွက်သွား (exit) စေပါတယ်။

`asyncLocalStorage` ကို garbage collected ဖြစ်အောင် မလုပ်နိုင်ခင် `asyncLocalStorage.disable()` ကို ခေါ်ဖို့ လိုအပ်ပါတယ်။ ဒါက `asyncLocalStorage` က ပံ့ပိုးပေးတဲ့ stores တွေကိုတော့ အကျုံးမဝင်ပါဘူး — အဲဒီ objects တွေက သက်ဆိုင်ရာ async resources တွေနဲ့အတူ garbage collected ဖြစ်သွားလို့ပါ။

`asyncLocalStorage` ကို လက်ရှိ process ထဲမှာ နောက်ထပ် အသုံးမပြုတော့တဲ့အခါ ဒီ method ကို သုံးပါ။

### `asyncLocalStorage.getStore()`

* Returns: {any}

လက်ရှိ store ကို ပြန်ပေးပါတယ်။
`asyncLocalStorage.run()` (သို့) `asyncLocalStorage.enterWith()` ကို ခေါ်ပြီး စတင်လိုက်တဲ့ asynchronous context တစ်ခုရဲ့ အပြင်ဘက်မှာ ခေါ်ရင် — `undefined` ကို ပြန်ပေးပါတယ်။

### `asyncLocalStorage.enterWith(store)`

> Stability: 1 - Experimental

* `store` {any}

လက်ရှိ synchronous execution ရဲ့ ကျန်တဲ့ အပိုင်းအတွက် context ထဲကို ဝင်ရောက်ပြီး — နောက်က လိုက်လာတဲ့ asynchronous calls တွေကတစ်ဆင့် store ကို ဆက်လက် ထိန်းသိမ်းထားပါတယ်။

ဥပမာ:

```js
const store = { id: 1 };
// Replaces previous store with the given store object
asyncLocalStorage.enterWith(store);
asyncLocalStorage.getStore(); // Returns the store object
someAsyncOperation(() => {
  asyncLocalStorage.getStore(); // Returns the same object
});
```

ဒီအကူးအပြောင်း (transition) က synchronous execution တစ်ခုလုံးအတွက် ဆက်ဖြစ်နေပါလိမ့်မယ်။ ဆိုလိုတာက — ဥပမာ၊ context ကို event handler တစ်ခုအတွင်းမှာ ဝင်ရောက်လိုက်တယ်ဆိုရင် — နောက်ဆက်တွဲ event handlers တွေကလည်း `AsyncResource` တစ်ခုနဲ့ တခြား context တစ်ခုဆီကို အတိအကျ bind မလုပ်ထားဘူးဆိုရင် အဲဒီ context အတွင်းမှာပဲ run ပါလိမ့်မယ်။ ဒါကြောင့်ပဲ — နောက် method ကို သုံးဖို့ ခိုင်လုံတဲ့ အကြောင်းပြချက်တွေ မရှိဘူးဆိုရင် `enterWith()` ထက် `run()` ကို ဦးစားပေး သုံးသင့်ပါတယ်။

```js
const store = { id: 1 };

emitter.on('my-event', () => {
  asyncLocalStorage.enterWith(store);
});
emitter.on('my-event', () => {
  asyncLocalStorage.getStore(); // Returns the same object
});

asyncLocalStorage.getStore(); // Returns undefined
emitter.emit('my-event');
asyncLocalStorage.getStore(); // Returns the same object
```

### `asyncLocalStorage.name`

* Type: {string}

ပေးထားခဲ့မယ်ဆိုရင် `AsyncLocalStorage` instance ရဲ့ နာမည်ပါ။

### `asyncLocalStorage.run(store, callback[, ...args])`

* `store` {any}
* `callback` {Function}
* `...args` {any}

Context တစ်ခုအတွင်းမှာ function တစ်ခုကို synchronously run ပြီး — သူ့ရဲ့ return value ကို ပြန်ပေးပါတယ်။ Store က callback function ရဲ့ အပြင်ဘက်မှာ ဝင်ရောက်လို့ မရပါဘူး။ Store ကိုတော့ callback အတွင်းမှာ ဖန်တီးလိုက်တဲ့ asynchronous operations တွေအားလုံးက ဝင်ရောက်နိုင်ပါတယ်။

Optional ဖြစ်တဲ့ `args` တွေကို callback function ဆီ ပို့ပေးပါတယ်။

Callback function က error တစ်ခု throw လုပ်ခဲ့မယ်ဆိုရင် — အဲဒီ error ကို `run()` ကလည်း throw လုပ်ပါတယ်။ ဒီခေါ်မှုကြောင့် stacktrace ကို ထိခိုက်မှု မရှိဘဲ context ကို ထွက်သွားစေပါတယ်။

ဥပမာ:

```js
const store = { id: 2 };
try {
  asyncLocalStorage.run(store, () => {
    asyncLocalStorage.getStore(); // Returns the store object
    setTimeout(() => {
      asyncLocalStorage.getStore(); // Returns the store object
    }, 200);
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Returns undefined
  // The error will be caught here
}
```

### `asyncLocalStorage.exit(callback[, ...args])`

> Stability: 1 - Experimental

* `callback` {Function}
* `...args` {any}

Context တစ်ခုရဲ့ အပြင်ဘက်မှာ function တစ်ခုကို synchronously run ပြီး — သူ့ရဲ့ return value ကို ပြန်ပေးပါတယ်။ Store က callback function အတွင်း (သို့) callback အတွင်းမှာ ဖန်တီးထားတဲ့ asynchronous operations တွေထဲမှာ ဝင်ရောက်လို့ မရပါဘူး။ Callback function အတွင်းမှာ လုပ်တဲ့ `getStore()` ခေါ်မှုတိုင်းက အမြဲတမ်း `undefined` ကို ပြန်ပေးပါလိမ့်မယ်။

Optional ဖြစ်တဲ့ `args` တွေကို callback function ဆီ ပို့ပေးပါတယ်။

Callback function က error တစ်ခု throw လုပ်ခဲ့မယ်ဆိုရင် — အဲဒီ error ကို `exit()` ကလည်း throw လုပ်ပါတယ်။ ဒီခေါ်မှုကြောင့် stacktrace ကို ထိခိုက်မှု မရှိဘဲ context ထဲကို ပြန်ဝင်ရောက် (re-enter) သွားပါတယ်။

ဥပမာ:

```js
// Within a call to run
try {
  asyncLocalStorage.getStore(); // Returns the store object or value
  asyncLocalStorage.exit(() => {
    asyncLocalStorage.getStore(); // Returns undefined
    throw new Error();
  });
} catch (e) {
  asyncLocalStorage.getStore(); // Returns the same object or value
  // The error will be caught here
}
```

### `asyncLocalStorage.withScope(store)`

> Stability: 1 - Experimental

* `store` {any}
* Returns: {RunScope}

ပေးထားတဲ့ store ထဲကို ဝင်ရောက်ပြီး — scope ကို dispose (စွန့်ပစ်) လုပ်လိုက်တဲ့အခါ အရင် store တန်ဖိုးကို အလိုအလျောက် ပြန်လည် သတ်မှတ်ပေးတဲ့ disposable scope တစ်ခုကို ဖန်တီးပါတယ်။ ဒီ method က JavaScript ရဲ့ explicit resource management (`using` syntax) နဲ့ အလုပ်လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်။

ဥပမာ:

```mjs
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

{
  using _ = asyncLocalStorage.withScope('my-store');
  console.log(asyncLocalStorage.getStore()); // Prints: my-store
}

console.log(asyncLocalStorage.getStore()); // Prints: undefined
```

```cjs
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

{
  using _ = asyncLocalStorage.withScope('my-store');
  console.log(asyncLocalStorage.getStore()); // Prints: my-store
}

console.log(asyncLocalStorage.getStore()); // Prints: undefined
```

`withScope()` method က block တစ်ခုကနေ ထွက်တဲ့အခါ — error တစ်ခု throw ဖြစ်ခဲ့ရင်တောင် အရင် store တန်ဖိုး ပြန်လည် သတ်မှတ်ခံရအောင် သေချာစေချင်တဲ့ synchronous code တွေမှာ context ကို စီမံခန့်ခွဲဖို့ အထူး အသုံးဝင်ပါတယ်။

```mjs
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

try {
  using _ = asyncLocalStorage.withScope('my-store');
  console.log(asyncLocalStorage.getStore()); // Prints: my-store
  throw new Error('test');
} catch (e) {
  // Store is automatically restored even after error
  console.log(asyncLocalStorage.getStore()); // Prints: undefined
}
```

```cjs
const { AsyncLocalStorage } = require('node:async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

try {
  using _ = asyncLocalStorage.withScope('my-store');
  console.log(asyncLocalStorage.getStore()); // Prints: my-store
  throw new Error('test');
} catch (e) {
  // Store is automatically restored even after error
  console.log(asyncLocalStorage.getStore()); // Prints: undefined
}
```

**အရေးကြီးချက်:** async functions တွေထဲမှာ ပထမ `await` မရောက်ခင် `withScope()` ကို သုံးတဲ့အခါ — scope အပြောင်းအလဲက caller ရဲ့ context ကို ထိခိုက်စေနိုင်တာ သတိထားပါ။ Async function တစ်ခုရဲ့ synchronous အပိုင်း (ပထမ `await` မရောက်ခင်) က ခေါ်လိုက်တာနဲ့ ချက်ချင်း run ပြီး — ပထမ `await` ဆီ ရောက်တဲ့အခါ promise ကို caller ဆီ ပြန်ပေးပါတယ်။ အဲဒီအချိန်မှာ scope အပြောင်းအလဲက caller ရဲ့ context ထဲမှာ မြင်နိုင်ဖြစ်လာပြီး — တခြားအရာတစ်ခုခုက scope တန်ဖိုးကို မပြောင်းမချင်း နောက်ဆက်တွဲ synchronous code တွေထဲမှာ ဆက်တည်ရှိနေပါလိမ့်မယ်။ Async operations တွေအတွက်တော့ — async boundaries တွေကိုဖြတ်ပြီး context ကို သင့်လျော်စွာ သီးခြားခွဲပေးတဲ့ `run()` ကို သုံးတာ ပိုကောင်းပါတယ်။

```mjs
import { AsyncLocalStorage } from 'node:async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

async function example() {
  using _ = asyncLocalStorage.withScope('my-store');
  console.log(asyncLocalStorage.getStore()); // Prints: my-store
  await someAsyncOperation(); // Function pauses here and returns promise
  console.log(asyncLocalStorage.getStore()); // Prints: my-store
}

// Calling without await
example(); // Synchronous portion runs, then pauses at first await
// After the promise is returned, the scope 'my-store' is now active in caller!
console.log(asyncLocalStorage.getStore()); // Prints: my-store (unexpected!)
```

### `async/await` ဖြင့် အသုံးပြုခြင်း (Usage with `async/await`)

Async function တစ်ခုအတွင်းမှာ context တစ်ခုအတွင်း `await` ခေါ်မှု တစ်ခုတည်းပဲ run စေချင်တယ်ဆိုရင် အောက်က pattern ကို သုံးသင့်ပါတယ်:

```js
async function fn() {
  await asyncLocalStorage.run(new Map(), () => {
    asyncLocalStorage.getStore().set('key', value);
    return foo(); // The return value of foo will be awaited
  });
}
```

ဒီဥပမာမှာ store က callback function ထဲမှာရော `foo` က ခေါ်တဲ့ functions တွေထဲမှာပဲ ရနိုင်ပါတယ်။ `run` ရဲ့ အပြင်ဘက်မှာ `getStore` ကို ခေါ်ရင် `undefined` ကို ပြန်ပေးပါလိမ့်မယ်။

### ပြဿနာရှာဖွေခြင်း: Context ပျောက်ဆုံးခြင်း (Troubleshooting: Context loss)

ကိစ္စအများစုမှာ `AsyncLocalStorage` က ပြဿနာ မရှိဘဲ အလုပ်လုပ်ပါတယ်။ ရှားပါးတဲ့ အခြေအနေတွေမှာ — asynchronous operations တွေထဲက တစ်ခုမှာ လက်ရှိ store ပျောက်ဆုံးသွားတတ်ပါတယ်။

သင့် code က callback-based ဆိုရင် — native promises တွေနဲ့ အလုပ်လုပ်နိုင်အောင် [`util.promisify()`][] နဲ့ promisify (promise အဖြစ် ပြောင်းလဲခြင်း) လုပ်လိုက်ရင် လုံလောက်ပါတယ်။

Callback-based API တစ်ခုကို သုံးဖို့ လိုနေရင် (သို့) သင့် code က custom thenable implementation တစ်ခုကို ယူဆထားရင် — asynchronous operation ကို မှန်ကန်တဲ့ execution context နဲ့ ချိတ်ဆက်ဖို့ [`AsyncResource`][] class ကို သုံးပါ။ Context ပျောက်ဆုံးမှုအတွက် တာဝန်ရှိတဲ့ function call ကို ရှာဖွေဖို့ — ပျောက်ဆုံးမှုအတွက် တာဝန်ရှိနိုင်တယ်လို့ သံသယရှိတဲ့ calls တွေရဲ့ နောက်မှာ `asyncLocalStorage.getStore()` ရဲ့ အကြောင်းအရာကို log လုပ်ကြည့်ပါ။ Code က `undefined` လို့ log တက်တဲ့အခါ — နောက်ဆုံး ခေါ်လိုက်တဲ့ callback က context ပျောက်ဆုံးမှုအတွက် တာဝန်ရှိနိုင်ပါတယ်။

## Class: `RunScope`

> Stability: 1 - Experimental

[`asyncLocalStorage.withScope()`][] က ပြန်ပေးတဲ့ disposable scope တစ်ခုပါ — dispose လုပ်လိုက်တဲ့အခါ အရင် store တန်ဖိုးကို အလိုအလျောက် ပြန်လည် သတ်မှတ်ပေးပါတယ်။ ဒီ class က [Explicit Resource Management][] protocol ကို အကောင်အထည်ဖော်ပြီး — JavaScript ရဲ့ `using` syntax နဲ့ အလုပ်လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်။

`using` block က ထွက်သွားတဲ့အခါ — ပုံမှန် ပြီးဆုံးမှုကနေ ဖြစ်စေ၊ error တစ်ခု throw လုပ်လို့ ဖြစ်စေ — scope က အရင် store တန်ဖိုးကို အလိုအလျောက် ပြန်လည် သတ်မှတ်ပေးပါတယ်။

### `scope.dispose()`

Scope ကို အတိအကျ အဆုံးသတ်ပြီး — အရင် store တန်ဖိုးကို ပြန်လည် သတ်မှတ်ပေးပါတယ်။ ဒီ method က idempotent (အကြိမ်မည်မျှ ထပ်ခေါ်ခေါ် ရလဒ် တူညီခြင်း) ဖြစ်ပါတယ်: အကြိမ်များစွာ ခေါ်လည်း တစ်ကြိမ် ခေါ်သလိုပဲ ရလဒ် တူညီပါတယ်။

`[Symbol.dispose]()` method က `dispose()` ဆီကို လွှဲအပ် (defer) လုပ်ဆောင်ပေးပါတယ်။

`withScope()` ကို `using` keyword မပါဘဲ ခေါ်ထားရင် — အရင် store တန်ဖိုးကို ပြန်လည် သတ်မှတ်ဖို့ `dispose()` ကို ကိုယ်တိုင် ခေါ်ရပါမယ်။ `dispose()` ခေါ်ဖို့ မေ့သွားရင် store တန်ဖိုးက လက်ရှိ execution context ရဲ့ ကျန်တဲ့ အပိုင်းအတွက် ဆက်တည်ရှိနေပါလိမ့်မယ်:

```mjs
import { AsyncLocalStorage } from 'node:async_hooks';

const storage = new AsyncLocalStorage();

// Without using, the scope must be disposed manually
const scope = storage.withScope('my-store');
// storage.getStore() === 'my-store' here

scope.dispose(); // Restore previous value
// storage.getStore() === undefined here
```

```cjs
const { AsyncLocalStorage } = require('node:async_hooks');

const storage = new AsyncLocalStorage();

// Without using, the scope must be disposed manually
const scope = storage.withScope('my-store');
// storage.getStore() === 'my-store' here

scope.dispose(); // Restore previous value
// storage.getStore() === undefined here
```

## Class: `AsyncResource`

`AsyncResource` class က embedder ရဲ့ async resources တွေက extend လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားတာ ဖြစ်ပါတယ်။ ဒါကို သုံးပြီး users တွေက ကိုယ်ပိုင် resources တွေရဲ့ lifetime events တွေကို လွယ်ကူစွာ ဖြစ်ပေါ်စေနိုင်ပါတယ်။

`AsyncResource` instance တစ်ခုကို စတင် ဖန်တီးတဲ့အခါ `init` hook က trigger ဖြစ်ပါလိမ့်မယ်။

အောက်မှာ `AsyncResource` API ရဲ့ ခြုံငုံ သုံးသပ်ချက် ဖြစ်ပါတယ်။

```mjs
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() is meant to be extended. Instantiating a
// new AsyncResource() also triggers init. If triggerAsyncId is omitted then
// async_hook.executionAsyncId() is used.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Run a function in the execution context of the resource. This will
// * establish the context of the resource
// * trigger the AsyncHooks before callbacks
// * call the provided function `fn` with the supplied arguments
// * trigger the AsyncHooks after callbacks
// * restore the original execution context
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Call AsyncHooks destroy callbacks.
asyncResource.emitDestroy();

// Return the unique ID assigned to the AsyncResource instance.
asyncResource.asyncId();

// Return the trigger ID for the AsyncResource instance.
asyncResource.triggerAsyncId();
```

```cjs
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

// AsyncResource() is meant to be extended. Instantiating a
// new AsyncResource() also triggers init. If triggerAsyncId is omitted then
// async_hook.executionAsyncId() is used.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false },
);

// Run a function in the execution context of the resource. This will
// * establish the context of the resource
// * trigger the AsyncHooks before callbacks
// * call the provided function `fn` with the supplied arguments
// * trigger the AsyncHooks after callbacks
// * restore the original execution context
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Call AsyncHooks destroy callbacks.
asyncResource.emitDestroy();

// Return the unique ID assigned to the AsyncResource instance.
asyncResource.asyncId();

// Return the trigger ID for the AsyncResource instance.
asyncResource.triggerAsyncId();
```

### `new AsyncResource(type[, options])`

* `type` {string} async event ရဲ့ အမျိုးအစား။
* `options` {Object}
  * `triggerAsyncId` {number} ဒီ async event ကို ဖန်တီးခဲ့တဲ့ execution context ရဲ့ ID။ **Default:** `executionAsyncId()`။
  * `requireManualDestroy` {boolean} `true` လို့ သတ်မှတ်ထားရင် — object ကို garbage collected လုပ်တဲ့အခါ `emitDestroy` ကို disable လုပ်ပါတယ်။ ဒါက ပုံမှန်အားဖြင့် သတ်မှတ်ဖို့ မလိုပါဘူး (`emitDestroy` ကို ကိုယ်တိုင် ခေါ်နေရင်တောင်) — resource ရဲ့ `asyncId` ကို ပြန်ယူပြီး sensitive API ရဲ့ `emitDestroy` ကို အဲဒီ id နဲ့ ခေါ်နေတာမျိုးကလွဲလို့ပါ။ `false` လို့ သတ်မှတ်ထားရင် — garbage collection ပေါ်မှာ `emitDestroy` ခေါ်မှုက active ဖြစ်နေတဲ့ `destroy` hook အနည်းဆုံး တစ်ခု ရှိနေမှသာ ဖြစ်ပေါ်ပါလိမ့်မယ်။ **Default:** `false`။

ဥပမာ အသုံးပြုမှု:

```js
class DBQuery extends AsyncResource {
  constructor(db) {
    super('DBQuery');
    this.db = db;
  }

  getInfo(query, callback) {
    this.db.get(query, (err, data) => {
      this.runInAsyncScope(callback, null, err, data);
    });
  }

  close() {
    this.db = null;
    this.emitDestroy();
  }
}
```

### Static method: `AsyncResource.bind(fn[, type[, thisArg]])`

* `fn` {Function} လက်ရှိ execution context နဲ့ bind လုပ်မယ့် function။
* `type` {string} အောက်ခံ (underlying) `AsyncResource` နဲ့ ဆက်စပ်ဖို့ optional နာမည်တစ်ခု။
* `thisArg` {any}

ပေးထားတဲ့ function ကို လက်ရှိ execution context နဲ့ bind လုပ်ပါတယ်။

### `asyncResource.bind(fn[, thisArg])`

* `fn` {Function} လက်ရှိ `AsyncResource` နဲ့ bind လုပ်မယ့် function။
* `thisArg` {any}

ပေးထားတဲ့ function ကို ဒီ `AsyncResource` ရဲ့ scope ထဲမှာ execute ဖြစ်အောင် bind လုပ်ပါတယ်။

### `asyncResource.runInAsyncScope(fn[, thisArg, ...args])`

* `fn` {Function} ဒီ async resource ရဲ့ execution context ထဲမှာ ခေါ်မယ့် function။
* `thisArg` {any} function call အတွက် သုံးမယ့် receiver။
* `...args` {any} function ဆီ ပို့ဖို့ optional arguments တွေ။

ပေးထားတဲ့ function ကို async resource ရဲ့ execution context ထဲမှာ ပေးထားတဲ့ arguments တွေနဲ့ ခေါ်ပါတယ်။ ဒါက context ကို တည်ဆောက် (establish) ပြီး — AsyncHooks ရဲ့ before callbacks တွေကို trigger လုပ်၊ function ကို ခေါ်၊ AsyncHooks ရဲ့ after callbacks တွေကို trigger လုပ်ပြီး — နောက်ဆုံးမှာ မူလ execution context ကို ပြန်လည် သတ်မှတ်ပေးပါတယ်။

### `asyncResource.emitDestroy()`

* Returns: {AsyncResource} `asyncResource` ဆီကို ရည်ညွှန်းတဲ့ reference။

`destroy` hooks တွေ အားလုံးကို ခေါ်ပါတယ်။ ဒါကို တစ်ကြိမ်တည်းပဲ ခေါ်သင့်ပါတယ်။ တစ်ကြိမ်ထက် ပိုပြီး ခေါ်ရင် error တစ်ခု throw လုပ်ပါလိမ့်မယ်။ ဒါကို **ကိုယ်တိုင်ပဲ** ခေါ်ရပါမယ် (must be manually called)။ Resource ကို GC က စုဆောင်းဖို့ ချန်ထားခဲ့မယ်ဆိုရင် — `destroy` hooks တွေကို ဘယ်တော့မှ ခေါ်မှာ မဟုတ်ပါဘူး။

### `asyncResource.asyncId()`

* Returns: {number} resource ကို သတ်မှတ်ပေးထားတဲ့ unique `asyncId`။

### `asyncResource.triggerAsyncId()`

* Returns: {number} `AsyncResource` constructor ဆီ ပေးလိုက်တဲ့ `triggerAsyncId` နဲ့ တူညီတဲ့ တန်ဖိုး။

### `AsyncResource` ကို `Worker` thread pool အတွက် အသုံးပြုခြင်း (Using `AsyncResource` for a `Worker` thread pool)

အောက်က ဥပမာက `AsyncResource` class ကို သုံးပြီး [`Worker`][] pool တစ်ခုအတွက် async tracking ကို မှန်ကန်စွာ ပံ့ပိုးပေးနည်းကို ပြပါတယ်။ Database connection pools လိုမျိုး တခြား resource pools တွေကလည်း အလားတူ ပုံစံမျိုး လိုက်နိုင်ပါတယ်။

Task က ဂဏန်းနှစ်လုံး ပေါင်းခြင်းလို့ ယူဆပြီး — `task_processor.js` ဆိုတဲ့ နာမည်ရှိ file တစ်ခုထဲမှာ အောက်ပါ အကြောင်းအရာတွေ ပါပါတယ်:

```mjs
import { parentPort } from 'node:worker_threads';
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```

```cjs
const { parentPort } = require('node:worker_threads');
parentPort.on('message', (task) => {
  parentPort.postMessage(task.a + task.b);
});
```

အဲဒါကို ဝန်းရံထားတဲ့ Worker pool တစ်ခုက အောက်ပါ structure ကို သုံးနိုင်ပါတယ်:

```mjs
import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

export default class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(new URL('task_processor.js', import.meta.url));
    worker.on('message', (result) => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}
```

```cjs
const { AsyncResource } = require('node:async_hooks');
const { EventEmitter } = require('node:events');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
  constructor(callback) {
    super('WorkerPoolTaskInfo');
    this.callback = callback;
  }

  done(err, result) {
    this.runInAsyncScope(this.callback, null, err, result);
    this.emitDestroy();  // `TaskInfo`s are used only once.
  }
}

class WorkerPool extends EventEmitter {
  constructor(numThreads) {
    super();
    this.numThreads = numThreads;
    this.workers = [];
    this.freeWorkers = [];
    this.tasks = [];

    for (let i = 0; i < numThreads; i++)
      this.addNewWorker();

    // Any time the kWorkerFreedEvent is emitted, dispatch
    // the next task pending in the queue, if any.
    this.on(kWorkerFreedEvent, () => {
      if (this.tasks.length > 0) {
        const { task, callback } = this.tasks.shift();
        this.runTask(task, callback);
      }
    });
  }

  addNewWorker() {
    const worker = new Worker(path.resolve(__dirname, 'task_processor.js'));
    worker.on('message', (result) => {
      // In case of success: Call the callback that was passed to `runTask`,
      // remove the `TaskInfo` associated with the Worker, and mark it as free
      // again.
      worker[kTaskInfo].done(null, result);
      worker[kTaskInfo] = null;
      this.freeWorkers.push(worker);
      this.emit(kWorkerFreedEvent);
    });
    worker.on('error', (err) => {
      // In case of an uncaught exception: Call the callback that was passed to
      // `runTask` with the error.
      if (worker[kTaskInfo])
        worker[kTaskInfo].done(err, null);
      else
        this.emit('error', err);
      // Remove the worker from the list and start a new Worker to replace the
      // current one.
      this.workers.splice(this.workers.indexOf(worker), 1);
      this.addNewWorker();
    });
    this.workers.push(worker);
    this.freeWorkers.push(worker);
    this.emit(kWorkerFreedEvent);
  }

  runTask(task, callback) {
    if (this.freeWorkers.length === 0) {
      // No free threads, wait until a worker thread becomes free.
      this.tasks.push({ task, callback });
      return;
    }

    const worker = this.freeWorkers.pop();
    worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
    worker.postMessage(task);
  }

  close() {
    for (const worker of this.workers) worker.terminate();
  }
}

module.exports = WorkerPool;
```

`WorkerPoolTaskInfo` objects တွေက ထည့်ပေးတဲ့ explicit tracking မရှိဘူးဆိုရင် — callbacks တွေက `Worker` object တစ်ခုချင်းစီနဲ့ ဆက်စပ်နေသလို ပေါ်နေပါလိမ့်မယ်။ ဒါပေမယ့် — `Worker` တွေရဲ့ ဖန်တီးမှုက tasks တွေရဲ့ ဖန်တီးမှုနဲ့ ဆက်စပ်မထားဘဲ — tasks တွေကို ဘယ်အချိန် schedule လုပ်ခဲ့လဲဆိုတဲ့ အချက်အလက်ကိုလည်း မပေးပါဘူး။

ဒီ pool ကို အောက်ပါအတိုင်း သုံးနိုင်ပါတယ်:

```mjs
import WorkerPool from './worker_pool.js';
import os from 'node:os';

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```

```cjs
const WorkerPool = require('./worker_pool.js');
const os = require('node:os');

const pool = new WorkerPool(os.availableParallelism());

let finished = 0;
for (let i = 0; i < 10; i++) {
  pool.runTask({ a: 42, b: 100 }, (err, result) => {
    console.log(i, err, result);
    if (++finished === 10)
      pool.close();
  });
}
```

### `AsyncResource` ကို `EventEmitter` နဲ့ ပေါင်းစည်းခြင်း (Integrating `AsyncResource` with `EventEmitter`)

[`EventEmitter`][] က trigger လုပ်တဲ့ event listeners တွေက — `eventEmitter.on()` ကို ခေါ်ခဲ့တဲ့အချိန်က active ဖြစ်နေတဲ့ execution context နဲ့ မတူညီတဲ့ execution context တစ်ခုမှာ run သွားနိုင်ပါတယ်။

အောက်က ဥပမာက `AsyncResource` class ကို သုံးပြီး event listener တစ်ခုကို မှန်ကန်တဲ့ execution context နဲ့ သင့်လျော်စွာ ချိတ်ဆက်နည်းကို ပြပါတယ်။ အလားတူ နည်းလမ်းကို [`Stream`][] (သို့) အလားတူ event-driven class တစ်ခုပေါ်မှာလည်း အသုံးချနိုင်ပါတယ်။

```mjs
import { createServer } from 'node:http';
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
  });
  res.end();
}).listen(3000);
```

```cjs
const { createServer } = require('node:http');
const { AsyncResource, executionAsyncId } = require('node:async_hooks');

const server = createServer((req, res) => {
  req.on('close', AsyncResource.bind(() => {
    // Execution context is bound to the current outer scope.
  }));
  req.on('close', () => {
    // Execution context is bound to the scope that caused 'close' to emit.
  });
  res.end();
}).listen(3000);
```

[Explicit Resource Management]: https://github.com/tc39/proposal-explicit-resource-management
[`AsyncResource`]: #class-asyncresource
[`EventEmitter`]: events.md#class-eventemitter
[`Stream`]: stream.md#stream
[`Worker`]: worker_threads.md#class-worker
[`asyncLocalStorage.withScope()`]: #asynclocalstoragewithscopestore
[`util.promisify()`]: util.md#utilpromisifyoriginal
