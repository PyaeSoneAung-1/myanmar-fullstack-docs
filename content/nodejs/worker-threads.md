---
title: "Worker threads"
description: "node:worker_threads module — JavaScript ကို parallel လုပ်ဆောင်နိုင်တဲ့ threads (Worker) များ — Worker, parentPort, workerData, MessagePort, BroadcastChannel, locks စသည်"
order: 122
source: "https://nodejs.org/api/worker_threads.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:worker_threads` module က JavaScript ကို parallel (တစ်ပြိုင်နက်) အနေနဲ့ execute လုပ်နိုင်တဲ့ threads တွေကို အသုံးပြုနိုင်အောင် ပံ့ပိုးပေးပါတယ်။ ဝင်ရောက်သုံးဖို့အတွက်:

```mjs
import worker_threads from 'node:worker_threads';
```

```cjs
const worker_threads = require('node:worker_threads');
```

Workers (threads) တွေက CPU-intensive ဖြစ်တဲ့ JavaScript operations တွေကို လုပ်ဆောင်ဖို့ အသုံးဝင်ပါတယ်။ I/O-intensive အလုပ်တွေအတွက်တော့ သိပ်ပြီး အကျိုးမထူးပါဘူး။ Node.js ရဲ့ built-in asynchronous I/O operations တွေက Workers တွေထက် ပိုပြီး ထိရောက်မှု ရှိပါတယ်။

`child_process` (သို့) `cluster` တို့နဲ့ မတူဘဲ — `worker_threads` က memory ကို မျှဝေသုံးစွဲနိုင်ပါတယ်။ `ArrayBuffer` instances တွေကို transfer လုပ်ခြင်း ဒါမှမဟုတ် `SharedArrayBuffer` instances တွေကို မျှဝေခြင်းအားဖြင့် ဒီလို လုပ်ဆောင်ပါတယ်။

```mjs
import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from 'node:worker_threads';

if (!isMainThread) {
  const { parse } = await import('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}

export default function parseJSAsync(script) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), {
      workerData: script,
    });
    worker.on('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
};
```

```cjs
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require('node:worker_threads');

if (isMainThread) {
  module.exports = function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script,
      });
      worker.on('message', resolve);
      worker.once('error', reject);
      worker.once('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const { parse } = require('some-js-parsing-library');
  const script = workerData;
  parentPort.postMessage(parse(script));
}
```

အပေါ်က ဥပမာက `parseJSAsync()` ခေါ်မှုတိုင်းအတွက် Worker thread တစ်ခုစီကို spawn (စတင်ဖွင့်) လုပ်ပါတယ်။ လက်တွေ့မှာတော့ ဒီလိုလုပ်ငန်းမျိုးတွေအတွက် Workers တွေရဲ့ pool (ကြိုတင်စုထားသော အစုအဝေး) ကို သုံးသင့်ပါတယ်။ မဟုတ်ရင် — Workers တွေကို ဖန်တီးခြင်းရဲ့ overhead (အပိုကုန်ကျစရိတ်) က သူတို့ရဲ့ အကျိုးကျေးဇူးထက် ပိုနေနိုင်ပါတယ်။

Worker pool တစ်ခုကို အကောင်အထည်ဖော်တဲ့အခါ — task တွေနဲ့ သူတို့ရဲ့ ရလဒ်တွေကြားက ဆက်စပ်မှုအကြောင်း diagnostic tools တွေကို အသိပေးနိုင်ဖို့ (ဥပမာ — asynchronous stack traces တွေ ပေးနိုင်ဖို့) [`AsyncResource`][] API ကို အသုံးပြုပါ။ ဥပမာ အကောင်အထည်ဖော်မှုတစ်ခုအတွက် `async_hooks` documentation ထဲက ["Using `AsyncResource` for a `Worker` thread pool"][async-resource-worker-pool] ကို ကြည့်ပါ။

Worker threads တွေက process-specific မဟုတ်တဲ့ options တွေကို မူလအားဖြင့် အမွေဆက်ခံပါတယ်။ Worker thread options တွေ — အထူးသဖြင့် `argv` နဲ့ `execArgv` options တွေကို — ဘယ်လို customize လုပ်ရမလဲဆိုတာ သိရှိရန် [`Worker constructor options`][] ကို ကြည့်ပါ။

## `worker_threads.getEnvironmentData(key)`

* `key` {any} {Map} key တစ်ခုအနေနဲ့ သုံးလို့ရတဲ့ မည်သည့် clone လုပ်နိုင်သော (cloneable) JavaScript value မဆို။
* Returns: {any}

Worker thread တစ်ခုအတွင်းမှာ `worker.getEnvironmentData()` က — worker ကို spawn လုပ်တဲ့ thread ရဲ့ `worker.setEnvironmentData()` ဆီ ပေးလိုက်တဲ့ data ရဲ့ clone တစ်ခုကို ပြန်ပေးပါတယ်။ `Worker` အသစ်တိုင်းက environment data ရဲ့ ကိုယ်ပိုင် copy တစ်ခုကို အလိုအလျောက် ရရှိပါတယ်။

```mjs
import {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} from 'node:worker_threads';

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(new URL(import.meta.url));
} else {
  console.log(getEnvironmentData('Hello'));  // Prints 'World!'.
}
```

```cjs
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('node:worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // Prints 'World!'.
}
```

## `worker_threads.isInternalThread`

* Type: {boolean}

ဒီ code က internal [`Worker`][] thread တစ်ခု (ဥပမာ — loader thread) အတွင်းမှာ run နေတယ်ဆိုရင် `true` ဖြစ်ပါတယ်။

```bash
node --experimental-loader ./loader.js main.js
```

```mjs
// loader.js
import { isInternalThread } from 'node:worker_threads';
console.log(isInternalThread);  // true
```

```cjs
// loader.js
const { isInternalThread } = require('node:worker_threads');
console.log(isInternalThread);  // true
```

```mjs
// main.js
import { isInternalThread } from 'node:worker_threads';
console.log(isInternalThread);  // false
```

```cjs
// main.js
const { isInternalThread } = require('node:worker_threads');
console.log(isInternalThread);  // false
```

## `worker_threads.isMainThread`

* Type: {boolean}

ဒီ code က [`Worker`][] thread တစ်ခုအတွင်းမှာ run နေတာမဟုတ်ဘူးဆိုရင် `true` ဖြစ်ပါတယ်။

```mjs
import { Worker, isMainThread } from 'node:worker_threads';

if (isMainThread) {
  // This re-loads the current file inside a Worker instance.
  new Worker(new URL(import.meta.url));
} else {
  console.log('Inside Worker!');
  console.log(isMainThread);  // Prints 'false'.
}
```

```cjs
const { Worker, isMainThread } = require('node:worker_threads');

if (isMainThread) {
  // This re-loads the current file inside a Worker instance.
  new Worker(__filename);
} else {
  console.log('Inside Worker!');
  console.log(isMainThread);  // Prints 'false'.
}
```

## `worker_threads.markAsUntransferable(object)`

* `object` {any} မည်သည့် JavaScript value မဆို။

Object တစ်ခုကို transfer မလုပ်နိုင်အောင် mark လုပ်ပါတယ်။ [`port.postMessage()`][] ခေါ်မှုတစ်ခုရဲ့ transfer list ထဲမှာ `object` ပါသွားခဲ့ရင် — error တစ်ခု throw လုပ်ပါတယ်။ `object` က primitive value တစ်ခုဆိုရင်တော့ ဒါက no-op (ဘာမှမလုပ်ခြင်း) ဖြစ်ပါတယ်။

အထူးသဖြင့် — transfer လုပ်ခြင်းထက် clone လုပ်လို့ရတဲ့၊ ပြီးတော့ ပို့လိုက်တဲ့ဘက်မှာ တခြား objects တွေက သုံးနေတဲ့ objects တွေအတွက် ဒါက အဓိပ္ပာယ်ရှိပါတယ်။ ဥပမာ — Node.js က [`Buffer` pool][`Buffer.allocUnsafe()`] အတွက် သုံးတဲ့ `ArrayBuffer`s တွေကို ဒီနည်းနဲ့ mark လုပ်ပါတယ်။ ဒီလို array buffer instances တွေပေါ်မှာ `ArrayBuffer.prototype.transfer()` ကို သုံးလို့ မရပါဘူး။

ဒီလုပ်ဆောင်ချက်ကို ပြန်ပြင် (undo) လုပ်လို့ မရပါဘူး။

```mjs
import { MessageChannel, markAsUntransferable } from 'node:worker_threads';

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // This will throw an error, because pooledBuffer is not transferable.
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// The following line prints the contents of typedArray1 -- it still owns
// its memory and has not been transferred. Without
// `markAsUntransferable()`, this would print an empty Uint8Array and the
// postMessage call would have succeeded.
// typedArray2 is intact as well.
console.log(typedArray1);
console.log(typedArray2);
```

```cjs
const { MessageChannel, markAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
const typedArray1 = new Uint8Array(pooledBuffer);
const typedArray2 = new Float64Array(pooledBuffer);

markAsUntransferable(pooledBuffer);

const { port1 } = new MessageChannel();
try {
  // This will throw an error, because pooledBuffer is not transferable.
  port1.postMessage(typedArray1, [ typedArray1.buffer ]);
} catch (error) {
  // error.name === 'DataCloneError'
}

// The following line prints the contents of typedArray1 -- it still owns
// its memory and has not been transferred. Without
// `markAsUntransferable()`, this would print an empty Uint8Array and the
// postMessage call would have succeeded.
// typedArray2 is intact as well.
console.log(typedArray1);
console.log(typedArray2);
```

ဒီ API နဲ့ ညီမျှတဲ့ ဘာမှ browsers တွေမှာ မရှိပါဘူး။

## `worker_threads.isMarkedAsUntransferable(object)`

* `object` {any} မည်သည့် JavaScript value မဆို။
* Returns: {boolean}

Object တစ်ခုကို [`markAsUntransferable()`][] နဲ့ transfer မလုပ်နိုင်အောင် mark လုပ်ထားလားဆိုတာ စစ်ဆေးပါတယ်။

```mjs
import { markAsUntransferable, isMarkedAsUntransferable } from 'node:worker_threads';

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // Returns true.
```

```cjs
const { markAsUntransferable, isMarkedAsUntransferable } = require('node:worker_threads');

const pooledBuffer = new ArrayBuffer(8);
markAsUntransferable(pooledBuffer);

isMarkedAsUntransferable(pooledBuffer);  // Returns true.
```

ဒီ API နဲ့ ညီမျှတဲ့ ဘာမှ browsers တွေမှာ မရှိပါဘူး။

## `worker_threads.markAsUncloneable(object)`

* `object` {any} မည်သည့် JavaScript value မဆို။

Object တစ်ခုကို clone မလုပ်နိုင်အောင် mark လုပ်ပါတယ်။ `object` ကို [`port.postMessage()`][] ခေါ်မှုတစ်ခုမှာ [`message`](#event-message) အနေနဲ့ သုံးခဲ့ရင် — error တစ်ခု throw လုပ်ပါတယ်။ `object` က primitive value တစ်ခုဆိုရင် ဒါက no-op (ဘာမှမလုပ်ခြင်း) ဖြစ်ပါတယ်။

ဒါက `ArrayBuffer`, (သို့) `Buffer` လိုမျိုး objects တွေအပေါ်မှာတော့ သက်ရောက်မှု မရှိပါဘူး။

ဒီလုပ်ဆောင်ချက်ကို ပြန်ပြင် (undo) လုပ်လို့ မရပါဘူး။

```mjs
import { markAsUncloneable } from 'node:worker_threads';

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // This will throw an error, because anyObject is not cloneable.
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```

```cjs
const { markAsUncloneable } = require('node:worker_threads');

const anyObject = { foo: 'bar' };
markAsUncloneable(anyObject);
const { port1 } = new MessageChannel();
try {
  // This will throw an error, because anyObject is not cloneable.
  port1.postMessage(anyObject);
} catch (error) {
  // error.name === 'DataCloneError'
}
```

ဒီ API နဲ့ ညီမျှတဲ့ ဘာမှ browsers တွေမှာ မရှိပါဘူး။

## `worker_threads.moveMessagePortToContext(port, contextifiedSandbox)`

* `port` {MessagePort} transfer လုပ်မယ့် message port ပါ။

* `contextifiedSandbox` {Object} `vm.createContext()` method က ပြန်ပေးတဲ့ [contextified][] object တစ်ခု။

* Returns: {MessagePort}

`MessagePort` တစ်ခုကို မတူညီတဲ့ [`vm`][] Context တစ်ခုဆီကို transfer လုပ်ပါတယ်။ မူရင်း `port` object က အသုံးမပြုနိုင်တော့ဘဲ — ပြန်ပေးလိုက်တဲ့ `MessagePort` instance က သူ့နေရာကို ဆက်ခံပါတယ်။

ပြန်ပေးလိုက်တဲ့ `MessagePort` က target context ထဲက object တစ်ခု ဖြစ်ပြီး — အဲဒီ context ရဲ့ global `Object` class ကနေ အမွေဆက်ခံပါတယ်။ [`port.onmessage()`][] listener ဆီ ပေးလိုက်တဲ့ objects တွေကလည်း target context ထဲမှာ ဖန်တီးခံရပြီး — ၎င်းတို့ရဲ့ global `Object` class ကနေ အမွေဆက်ခံပါတယ်။

ဒါပေမယ့် — ဖန်တီးလိုက်တဲ့ `MessagePort` က {EventTarget} ကနေ နောက်ထပ် အမွေမဆက်ခံတော့ဘဲ — events တွေကို လက်ခံဖို့ [`port.onmessage()`][] တစ်ခုတည်းကိုပဲ သုံးလို့ ရပါတော့တယ်။

## `worker_threads.parentPort`

* Type: {null|MessagePort}

ဒီ thread က [`Worker`][] တစ်ခုဆိုရင် — ဒါက parent thread နဲ့ ဆက်သွယ်ဖို့ ခွင့်ပြုတဲ့ [`MessagePort`][] တစ်ခုပါ။ `parentPort.postMessage()` ကို သုံးပြီး ပို့လိုက်တဲ့ messages တွေကို parent thread ထဲမှာ `worker.on('message')` ကို သုံးပြီး ရယူနိုင်ပြီး — parent thread ကနေ `worker.postMessage()` နဲ့ ပို့လိုက်တဲ့ messages တွေကိုတော့ ဒီ thread ထဲမှာ `parentPort.on('message')` ကို သုံးပြီး ရယူနိုင်ပါတယ်။

```mjs
import { Worker, isMainThread, parentPort } from 'node:worker_threads';

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url));
  worker.once('message', (message) => {
    console.log(message);  // Prints 'Hello, world!'.
  });
  worker.postMessage('Hello, world!');
} else {
  // When a message from the parent thread is received, send it back:
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```

```cjs
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once('message', (message) => {
    console.log(message);  // Prints 'Hello, world!'.
  });
  worker.postMessage('Hello, world!');
} else {
  // When a message from the parent thread is received, send it back:
  parentPort.once('message', (message) => {
    parentPort.postMessage(message);
  });
}
```

## `worker_threads.postMessageToThread(threadId, value[, transferList][, timeout])`

> Stability: 1.1 - Active development

* `threadId` {number} ပစ်မှတ် thread ရဲ့ ID ပါ။ Thread ID က မမှန်ကန်ဘူးဆိုရင် — [`ERR_WORKER_MESSAGING_FAILED`][] error တစ်ခု throw လုပ်ပါလိမ့်မယ်။ ပစ်မှတ် thread ID က လက်ရှိ thread ရဲ့ ID ကိုယ်တိုင် ဖြစ်နေရင် — [`ERR_WORKER_MESSAGING_SAME_THREAD`][] error တစ်ခု throw လုပ်ပါလိမ့်မယ်။
* `value` {any} ပို့လိုတဲ့ တန်ဖိုးပါ။
* `transferList` {Object\[]} `value` ထဲမှာ `MessagePort`-နဲ့တူတဲ့ objects တစ်ခု (သို့) တစ်ခုထက်ပို ပါသွားရင် — အဲဒီ items တွေအတွက် `transferList` တစ်ခု လိုအပ်ပြီး မပါရင် [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`][] throw လုပ်ပါတယ်။ အသေးစိတ်အတွက် [`port.postMessage()`][] ကို ကြည့်ပါ။
* `timeout` {number} message ပို့ဆောင်ပေးဖို့ စောင့်ဆိုင်းရမယ့် အချိန်ကို millisecond နဲ့ ဖော်ပြပါတယ်။ မူလအားဖြင့် `undefined` ဖြစ်ပြီး — ဒါက အကြာကြီး (ထာဝရ) စောင့်ဆိုင်းမယ်လို့ ဆိုလိုပါတယ်။ Operation က အချိန်ကုန်သွားရင် (timeout) — [`ERR_WORKER_MESSAGING_TIMEOUT`][] error တစ်ခု throw လုပ်ပါတယ်။
* Returns: {Promise} message ကို ပစ်မှတ် thread က အောင်မြင်စွာ လုပ်ဆောင်နိုင်ခဲ့ရင် fulfilled (ပြည့်စုံ) ဖြစ်တဲ့ promise တစ်ခု။

တခြား worker တစ်ခုဆီကို — သူ့ရဲ့ thread ID နဲ့ ခွဲခြားသတ်မှတ်ပြီး — value တစ်ခု ပို့ပေးပါတယ်။

ပစ်မှတ် thread မှာ `workerMessage` event အတွက် listener မရှိဘူးဆိုရင် — ဒီလုပ်ဆောင်ချက်က [`ERR_WORKER_MESSAGING_FAILED`][] error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ပစ်မှတ် thread က `workerMessage` event ကို လုပ်ဆောင်နေစဉ် error တစ်ခု throw လုပ်ခဲ့ရင် — ဒီလုပ်ဆောင်ချက်က [`ERR_WORKER_MESSAGING_ERRORED`][] error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ပစ်မှတ် thread က လက်ရှိ thread ရဲ့ တိုက်ရိုက် parent (သို့) child မဟုတ်တဲ့အခါ ဒီ method ကို သုံးသင့်ပါတယ်။ Thread နှစ်ခု က parent-child ဖြစ်နေရင်တော့ — thread တွေ ဆက်သွယ်ဖို့ [`require('node:worker_threads').parentPort.postMessage()`][] နဲ့ [`worker.postMessage()`][] ကို သုံးပါ။

အောက်က ဥပမာက `postMessageToThread` ရဲ့ အသုံးပြုပုံကို ပြပါတယ်: ဒါက nested threads ၁၀ ခုကို ဖန်တီးပြီး — နောက်ဆုံး thread က main thread နဲ့ ဆက်သွယ်ဖို့ ကြိုးစားပါလိမ့်မယ်။

```mjs
import process from 'node:process';
import {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} from 'node:worker_threads';

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(new URL(import.meta.url), {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  await postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

```cjs
const {
  postMessageToThread,
  threadId,
  workerData,
  Worker,
} = require('node:worker_threads');

const channel = new BroadcastChannel('sync');
const level = workerData?.level ?? 0;

if (level < 10) {
  const worker = new Worker(__filename, {
    workerData: { level: level + 1 },
  });
}

if (level === 0) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    postMessageToThread(source, { message: 'pong' });
  });
} else if (level === 10) {
  process.on('workerMessage', (value, source) => {
    console.log(`${source} -> ${threadId}:`, value);
    channel.postMessage('done');
    channel.close();
  });

  postMessageToThread(0, { message: 'ping' });
}

channel.onmessage = channel.close;
```

## `worker_threads.receiveMessageOnPort(port)`

* `port` {MessagePort|BroadcastChannel}

* Returns: {Object|undefined}

ပေးထားတဲ့ `MessagePort` တစ်ခုကနေ message တစ်ခုတည်းကို လက်ခံပါတယ်။ Message မရနိုင်ဘူးဆိုရင် — `undefined` ကို ပြန်ပေးပြီး — မဟုတ်ရင် `MessagePort` ရဲ့ queue ထဲက ရှေးအကျဆုံး (အစောဆုံး) message နဲ့ ကိုက်ညီတဲ့ — message payload ပါဝင်တဲ့ `message` property တစ်ခုတည်း ရှိတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { MessageChannel, receiveMessageOnPort } from 'node:worker_threads';
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// Prints: { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// Prints: undefined
```

```cjs
const { MessageChannel, receiveMessageOnPort } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world' });

console.log(receiveMessageOnPort(port2));
// Prints: { message: { hello: 'world' } }
console.log(receiveMessageOnPort(port2));
// Prints: undefined
```

ဒီ function ကို သုံးတဲ့အခါ — `'message'` event ကို emit မလုပ်တော့ဘဲ — `onmessage` listener ကိုလည်း ခေါ်မပေးပါဘူး။

## `worker_threads.resourceLimits`

* Type: {Object}
  * `maxYoungGenerationSizeMb` {number}
  * `maxOldGenerationSizeMb` {number}
  * `codeRangeSizeMb` {number}
  * `stackSizeMb` {number}

ဒီ Worker thread အတွင်းမှာ ရှိတဲ့ JS engine resource constraints (အရင်းအမြစ် ကန့်သတ်ချက်များ) အစုကို ပေးပါတယ်။ [`Worker`][] constructor ဆီ `resourceLimits` option ကို ပေးခဲ့တယ်ဆိုရင် — ဒါက သူ့ရဲ့ တန်ဖိုးတွေနဲ့ ကိုက်ညီပါတယ်။

ဒါကို main thread ထဲမှာ သုံးမယ်ဆိုရင် — သူ့ရဲ့ တန်ဖိုးက empty object တစ်ခုပါ။

## `worker_threads.SHARE_ENV`

* Type: {symbol}

[`Worker`][] constructor ရဲ့ `env` option အနေနဲ့ ပေးလို့ရတဲ့ အထူး တန်ဖိုးတစ်ခုပါ — လက်ရှိ thread နဲ့ Worker thread တို့က environment variables တွေရဲ့ တူညီတဲ့ အစုကို ဖတ်ရှုခြင်းနဲ့ ရေးသားခြင်း နှစ်ခုစလုံးကို မျှဝေသုံးစွဲသင့်တယ်ဆိုတာ ဖော်ပြဖို့ပါ။

```mjs
import process from 'node:process';
import { Worker, SHARE_ENV } from 'node:worker_threads';
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .once('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // Prints 'foo'.
  });
```

```cjs
const { Worker, SHARE_ENV } = require('node:worker_threads');
new Worker('process.env.SET_IN_WORKER = "foo"', { eval: true, env: SHARE_ENV })
  .once('exit', () => {
    console.log(process.env.SET_IN_WORKER);  // Prints 'foo'.
  });
```

## `worker_threads.setEnvironmentData(key[, value])`

* `key` {any} {Map} key တစ်ခုအနေနဲ့ သုံးလို့ရတဲ့ မည်သည့် clone လုပ်နိုင်သော JavaScript value မဆို။
* `value` {any} clone လုပ်ပြီး `Worker` instance အသစ်တိုင်းဆီကို အလိုအလျောက် ပေးပို့မယ့် မည်သည့် clone လုပ်နိုင်သော JavaScript value မဆို။ `value` ကို `undefined` အနေနဲ့ ပေးလိုက်ရင် — `key` အတွက် အရင်က သတ်မှတ်ထားတဲ့ တန်ဖိုးကို ဖျက်ပစ်ပါတယ်။

`worker.setEnvironmentData()` API က — လက်ရှိ thread နဲ့ လက်ရှိ context ကနေ spawn လုပ်လိုက်တဲ့ `Worker` instance အသစ်တွေထဲက `worker.getEnvironmentData()` ရဲ့ ပါဝင်မှုကို သတ်မှတ်ပေးပါတယ်။

## `worker_threads.threadId`

* Type: {integer}

လက်ရှိ thread အတွက် integer identifier တစ်ခုပါ။ သက်ဆိုင်ရာ worker object ပေါ်မှာလည်း (ရှိခဲ့ရင်) — [`worker.threadId`][] အနေနဲ့ ရနိုင်ပါတယ်။ ဒီတန်ဖိုးက process တစ်ခုတည်းအတွင်းက [`Worker`][] instance တစ်ခုချင်းစီအတွက် unique (ထူးခြား) ပါတယ်။

## `worker_threads.threadName`

* {string|null}

လက်ရှိ thread အတွက် string identifier တစ်ခု ဖြစ်ပြီး — thread က run မနေဘူးဆိုရင် `null` ပါ။ သက်ဆိုင်ရာ worker object ပေါ်မှာလည်း (ရှိခဲ့ရင်) — [`worker.threadName`][] အနေနဲ့ ရနိုင်ပါတယ်။

## `worker_threads.workerData`

ဒီ thread ရဲ့ `Worker` constructor ဆီ ပေးလိုက်တဲ့ data ရဲ့ clone တစ်ခုကို ပါဝင်တဲ့ မည်သည့် JavaScript value မဆို။

Data ကို [HTML structured clone algorithm][] အရ — [`postMessage()`][`port.postMessage()`] သုံးသလိုမျိုး — clone လုပ်ပါတယ်။

```mjs
import { Worker, isMainThread, workerData } from 'node:worker_threads';

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url), { workerData: 'Hello, world!' });
} else {
  console.log(workerData);  // Prints 'Hello, world!'.
}
```

```cjs
const { Worker, isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: 'Hello, world!' });
} else {
  console.log(workerData);  // Prints 'Hello, world!'.
}
```

## `worker_threads.locks`

> Stability: 1 - Experimental

* {LockManager}

Process တစ်ခုတည်းအတွင်းက threads အများအပြားကြားမှာ မျှဝေထားနိုင်တဲ့ resources တွေဆီ ဝင်ရောက်မှုကို ညှိနှိုင်းပေးဖို့ သုံးလို့ရတဲ့ [`LockManager`][LockManager] instance တစ်ခုပါ။ ဒီ API က [browser `LockManager`][] ရဲ့ semantics တွေကို လိုက်နာပါတယ်။

### Class: `Lock`

`Lock` interface က [`locks.request()`][locks.request()] ကနေတစ်ဆင့် ပေးအပ်ခဲ့တဲ့ lock တစ်ခုအကြောင်း အချက်အလက်တွေကို ပေးပါတယ်။

#### `lock.name`

* {string}

Lock ရဲ့ နာမည်ပါ။

#### `lock.mode`

* {string}

Lock ရဲ့ mode ပါ။ `shared` (မျှဝေ) သို့မဟုတ် `exclusive` (သီးသန့်) နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။

### Class: `LockManager`

`LockManager` interface က locks တွေကို တောင်းဆိုခြင်းနဲ့ စူးစမ်းလေ့လာခြင်း (introspect) လုပ်ခြင်းအတွက် methods တွေကို ပေးပါတယ်။ `LockManager` instance တစ်ခု ရယူဖို့ အောက်ပါအတိုင်း သုံးပါ:

```mjs
import { locks } from 'node:worker_threads';
```

```cjs
const { locks } = require('node:worker_threads');
```

ဒီ အကောင်အထည်ဖော်မှုက [browser `LockManager`][] API နဲ့ ကိုက်ညီပါတယ်။

#### `locks.request(name[, options], callback)`

* `name` {string}
* `options` {Object}
  * `mode` {string} `'exclusive'` (သီးသန့်) သို့မဟုတ် `'shared'` (မျှဝေ) နှစ်ခုအနက် တစ်ခု။ **Default:** `'exclusive'`။
  * `ifAvailable` {boolean} `true` ဆိုရင် — lock ကို လောလောဆယ် တစ်ယောက်ယောက် ကိုင်ထားပြီးသား မဟုတ်မှသာ တောင်းဆိုချက်ကို ပေးအပ်ပါလိမ့်မယ်။ ပေးအပ်လို့ မရဘူးဆိုရင် — `callback` ကို `Lock` instance အစား `null` နဲ့အတူ ခေါ်ပါလိမ့်မယ်။ **Default:** `false`။
  * `steal` {boolean} `true` ဆိုရင် — နာမည်တူ ရှိနေတဲ့ locks တွေကို လွှတ်ပေးလိုက်ပြီး — တန်းစီစောင့်ဆိုင်းနေတဲ့ (queued) တောင်းဆိုချက်တွေကို ကျော်လွှားပြီး — တောင်းဆိုချက်ကို ချက်ချင်း ပေးအပ်ပါတယ်။ **Default:** `false`။
  * `signal` {AbortSignal} pending (ပေးအပ်ရသေးမဟုတ်တဲ့) lock တောင်းဆိုချက်တစ်ခုကို abort လုပ်ဖို့ သုံးနိုင်တဲ့ signal ပါ။
* `callback` {Function} lock ပေးအပ်ပြီးတာနဲ့ ခေါ်ပါတယ် (`ifAvailable` က `true` ဖြစ်ပြီး lock မရနိုင်ဘူးဆိုရင် `null` နဲ့အတူ ချက်ချင်း ခေါ်ပါတယ်)။ Function က ပြန်လာတဲ့အခါ — ဒါမှမဟုတ် function က promise တစ်ခုကို ပြန်ပေးတယ်ဆိုရင် အဲဒီ promise settle ဖြစ်တဲ့အခါ — lock ကို အလိုအလျောက် လွှတ်ပေးပါတယ်။
* Returns: {Promise} Lock ကို လွှတ်ပေးလိုက်တာနဲ့ resolve ဖြစ်ပါတယ်။

```mjs
import { locks } from 'node:worker_threads';

await locks.request('my_resource', async (lock) => {
  // The lock has been acquired.
});
// The lock has been released here.
```

```cjs
const { locks } = require('node:worker_threads');

locks.request('my_resource', async (lock) => {
  // The lock has been acquired.
}).then(() => {
  // The lock has been released here.
});
```

#### `locks.query()`

* Returns: {Promise}

လက်ရှိ process အတွက် လောလောဆယ် ကိုင်ထားတဲ့ (held) နဲ့ pending ဖြစ်နေတဲ့ locks တွေကို ဖော်ပြတဲ့ `LockManagerSnapshot` တစ်ခုနဲ့ resolve ဖြစ်ပါတယ်။

```mjs
import { locks } from 'node:worker_threads';

const snapshot = await locks.query();
for (const lock of snapshot.held) {
  console.log(`held lock: name ${lock.name}, mode ${lock.mode}`);
}
for (const pending of snapshot.pending) {
  console.log(`pending lock: name ${pending.name}, mode ${pending.mode}`);
}
```

```cjs
const { locks } = require('node:worker_threads');

locks.query().then((snapshot) => {
  for (const lock of snapshot.held) {
    console.log(`held lock: name ${lock.name}, mode ${lock.mode}`);
  }
  for (const pending of snapshot.pending) {
    console.log(`pending lock: name ${pending.name}, mode ${pending.mode}`);
  }
});
```

## Class: `BroadcastChannel extends EventTarget`

`BroadcastChannel` instances တွေက — channel နာမည် တစ်ခုတည်းနဲ့ ချိတ်ထားတဲ့ တခြား `BroadcastChannel` instances တွေ အားလုံးနဲ့ — asynchronous one-to-many (တစ်ခုမှ အများသို့) ဆက်သွယ်မှုကို ခွင့်ပြုပါတယ်။

```mjs
import {
  isMainThread,
  BroadcastChannel,
  Worker,
} from 'node:worker_threads';

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(new URL(import.meta.url));
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```

```cjs
const {
  isMainThread,
  BroadcastChannel,
  Worker,
} = require('node:worker_threads');

const bc = new BroadcastChannel('hello');

if (isMainThread) {
  let c = 0;
  bc.onmessage = (event) => {
    console.log(event.data);
    if (++c === 10) bc.close();
  };
  for (let n = 0; n < 10; n++)
    new Worker(__filename);
} else {
  bc.postMessage('hello from every worker');
  bc.close();
}
```

### `new BroadcastChannel(name)`

* `name` {any} ချိတ်ဆက်ဖို့ channel ရဲ့ နာမည်ပါ။ `` `${name}` `` သုံးပြီး string တစ်ခုအဖြစ် ပြောင်းလို့ရတဲ့ မည်သည့် JavaScript value မဆို ခွင့်ပြုပါတယ်။

### `broadcastChannel.close()`

`BroadcastChannel` connection ကို ပိတ်ပါတယ်။

### `broadcastChannel.onmessage`

* Type: {Function} message တစ်ခု လက်ခံရရှိတဲ့အခါ `MessageEvent` argument တစ်ခုတည်းနဲ့အတူ ခေါ်ပါတယ်။

### `broadcastChannel.onmessageerror`

* Type: {Function} လက်ခံရရှိတဲ့ message တစ်ခုကို deserialize မလုပ်နိုင်တဲ့အခါ ခေါ်ပါတယ်။

### `broadcastChannel.postMessage(message)`

* `message` {any} မည်သည့် clone လုပ်နိုင်သော JavaScript value မဆို။

### `broadcastChannel.ref()`

`unref()` ရဲ့ ဆန့်ကျင်ဘက်ပါ။ အရင်က `unref()` လုပ်ထားတဲ့ BroadcastChannel တစ်ခုပေါ်မှာ `ref()` ကို ခေါ်တာက — program ထဲမှာ ကျန်ရှိတဲ့ တစ်ခုတည်းသော active handle ဖြစ်နေရင်တောင် — program ကို ထွက်မသွားစေပါဘူး (ဒါက default အပြုအမူပါ)။ Port က `ref()` လုပ်ပြီးသားဆိုရင် — `ref()` ကို ထပ်ခေါ်တာက သက်ရောက်မှု မရှိပါဘူး။

### `broadcastChannel.unref()`

BroadcastChannel တစ်ခုပေါ်မှာ `unref()` ကို ခေါ်တာက — event system ထဲမှာ ဒါပဲ ကျန်ရှိတဲ့ active handle ဖြစ်နေရင် — thread ကို ထွက်ခွင့်ပြုပါတယ်။ BroadcastChannel က `unref()` လုပ်ပြီးသားဆိုရင် `unref()` ကို ထပ်ခေါ်တာက သက်ရောက်မှု မရှိပါဘူး။

## Class: `MessageChannel`

`worker.MessageChannel` class ရဲ့ instances တွေက asynchronous, two-way (နှစ်လမ်းသွား) ဆက်သွယ်ရေး channel တစ်ခုကို ကိုယ်စားပြုပါတယ်။ `MessageChannel` မှာ ကိုယ်ပိုင် methods တွေ မရှိပါဘူး။ `new MessageChannel()` က — ချိတ်ဆက်ထားတဲ့ (linked) [`MessagePort`][] instances တွေကို ရည်ညွှန်းတဲ့ `port1` နဲ့ `port2` properties တွေ ပါတဲ့ object တစ်ခုကို ထုတ်ပေးပါတယ်။

```mjs
import { MessageChannel } from 'node:worker_threads';

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('received', message));
port2.postMessage({ foo: 'bar' });
// Prints: received { foo: 'bar' } from the `port1.on('message')` listener
```

```cjs
const { MessageChannel } = require('node:worker_threads');

const { port1, port2 } = new MessageChannel();
port1.on('message', (message) => console.log('received', message));
port2.postMessage({ foo: 'bar' });
// Prints: received { foo: 'bar' } from the `port1.on('message')` listener
```

## Class: `MessagePort`

* Extends: {EventTarget}

`worker.MessagePort` class ရဲ့ instances တွေက asynchronous, two-way (နှစ်လမ်းသွား) ဆက်သွယ်ရေး channel တစ်ခုရဲ့ အဆုံးတစ်ဖက် (one end) ကို ကိုယ်စားပြုပါတယ်။ [`Worker`][] တွေ အမျိုးမျိုးကြားမှာ structured data, memory regions (မှတ်ဉာဏ် နေရာများ) နဲ့ တခြား `MessagePort`s တွေကို transfer လုပ်ဖို့ သုံးနိုင်ပါတယ်။

ဒီ အကောင်အထည်ဖော်မှုက [browser `MessagePort`][]s တွေနဲ့ ကိုက်ညီပါတယ်။

### Event: `'close'`

Channel ရဲ့ ဘယ်ဘက်ခြမ်းက ဖြစ်စေ တစ်ဖက်ဖက် ပြတ်တောက် (disconnect) သွားတာနဲ့ `'close'` event ကို emit လုပ်ပါတယ်။

```mjs
import { MessageChannel } from 'node:worker_threads';
const { port1, port2 } = new MessageChannel();

// Prints:
//   foobar
//   closed!
port2.on('message', (message) => console.log(message));
port2.once('close', () => console.log('closed!'));

port1.postMessage('foobar');
port1.close();
```

```cjs
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

// Prints:
//   foobar
//   closed!
port2.on('message', (message) => console.log(message));
port2.once('close', () => console.log('closed!'));

port1.postMessage('foobar');
port1.close();
```

### Event: `'message'`

* `value` {any} ပို့လိုက်တဲ့ တန်ဖိုးပါ။

ဝင်လာတဲ့ message တိုင်းအတွက် — [`port.postMessage()`][] ရဲ့ clone လုပ်ထားတဲ့ input ပါဝင်ပြီး — `'message'` event ကို emit လုပ်ပါတယ်။

ဒီ event ပေါ်က listeners တွေက — `postMessage()` ဆီ ပေးလိုက်တဲ့အတိုင်း `value` parameter ရဲ့ clone တစ်ခုကို ရရှိပြီး — နောက်ထပ် arguments တွေ မရရှိပါဘူး။

### Event: `'messageerror'`

* `error` {Error} Error object တစ်ခုပါ။

Message တစ်ခုကို deserialize လုပ်တဲ့အခါ မအောင်မြင်တဲ့အခါ `'messageerror'` event ကို emit လုပ်ပါတယ်။

လောလောဆယ်တော့ — ပို့လိုက်တဲ့ JS object ကို လက်ခံဘက်မှာ instantiate (စတင်ဖန်တီး) လုပ်နေစဉ် error တစ်ခု ဖြစ်ပွားတဲ့အခါ ဒီ event ကို emit လုပ်ပါတယ်။ ဒီလို အခြေအနေမျိုးက ရှားပါးပေမယ့် — ဥပမာ — တချို့ Node.js API objects တွေကို `vm.Context` တစ်ခုထဲမှာ လက်ခံရရှိတဲ့အခါ (Node.js APIs တွေ လောလောဆယ် မရနိုင်တဲ့ နေရာမျိုး) ဖြစ်နိုင်ပါတယ်။

### `port.close()`

Connection ရဲ့ ဘယ်ဘက်ခြမ်းကနေ ဖြစ်စေ နောက်ထပ် messages တွေ ပို့ခြင်းကို ပိတ်ပါတယ်။ ဒီ `MessagePort` ပေါ်မှာ နောက်ထပ် ဆက်သွယ်မှု တစ်ခုမှ ဖြစ်တော့မှာ မဟုတ်ဘူးဆိုရင် ဒီ method ကို ခေါ်နိုင်ပါတယ်။

Channel ရဲ့ အစိတ်အပိုင်း ဖြစ်တဲ့ `MessagePort` instance နှစ်ခုလုံးပေါ်မှာ [`'close'` event][] ကို emit လုပ်ပါတယ်။

### `port.postMessage(value[, transferList])`

* `value` {any}
* `transferList` {Object\[]}

ဒီ channel ရဲ့ လက်ခံဘက်ကို JavaScript value တစ်ခု ပို့ပါတယ်။ `value` ကို [HTML structured clone algorithm][] နဲ့ လိုက်ဖက်ညီတဲ့ နည်းနဲ့ transfer လုပ်ပါတယ်။

အထူးသဖြင့် — `JSON` နဲ့ သိသာတဲ့ ကွာခြားချက်တွေကတော့:

* `value` မှာ circular references (သူ့ဘာသာသူ ပြန်ညွှန်းမှုများ) ပါဝင်နိုင်ပါတယ်။
* `value` မှာ `RegExp`s, `BigInt`s, `Map`s, `Set`s စတဲ့ builtin JS types တွေရဲ့ instances တွေ ပါဝင်နိုင်ပါတယ်။
* `value` မှာ `ArrayBuffer`s ရော `SharedArrayBuffer`s ပါ သုံးထားတဲ့ typed arrays တွေ ပါဝင်နိုင်ပါတယ်။
* `value` မှာ [`WebAssembly.Module`][] instances တွေ ပါဝင်နိုင်ပါတယ်။
* `value` မှာ အောက်ပါတွေကလွဲရင် — native (C++-backed) objects တွေ ပါဝင်လို့ မရပါဘူး:
  * {CryptoKey}s,
  * {FileHandle}s,
  * {Histogram}s,
  * {KeyObject}s,
  * {MessagePort}s,
  * {net.BlockList}s,
  * {net.Server}s (TCP အတွက်သာ, `transferList` ထဲမှာ စာရင်းသွင်းထားတဲ့အခါ),
  * {net.Socket}s (TCP အတွက်သာ, `transferList` ထဲမှာ စာရင်းသွင်းထားတဲ့အခါ),
  * {net.SocketAddress}es,
  * {X509Certificate}s.

```mjs
import { MessageChannel } from 'node:worker_threads';
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// Prints: { foo: [Circular] }
port2.postMessage(circularData);
```

```cjs
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const circularData = {};
circularData.foo = circularData;
// Prints: { foo: [Circular] }
port2.postMessage(circularData);
```

`transferList` က {ArrayBuffer}, [`MessagePort`][], [`FileHandle`][], {net.Server}, နဲ့ {net.Socket} objects တွေရဲ့ စာရင်းတစ်ခု ဖြစ်နိုင်ပါတယ်။ Transfer လုပ်ပြီးတဲ့နောက်မှာ — ၎င်းတို့က channel ရဲ့ ပို့လိုက်တဲ့ဘက်မှာ နောက်ထပ် အသုံးမပြုနိုင်တော့ပါဘူး (`value` ထဲမှာ မပါဝင်ဘူးဆိုရင်တောင်)။

{net.Server} တစ်ခုကို transfer လုပ်တာက — ၎င်းရဲ့ listening socket ကို — accept queue ထဲက pending connections တွေနဲ့အတူ — လက်ခံတဲ့ thread ရဲ့ event loop ဆီကို ရွှေ့ပြောင်းပေးပါတယ်။ {net.Socket} တစ်ခုကို transfer လုပ်တာက connection တစ်ခုတည်းကို ရွှေ့ပေးပါတယ်; socket က — ခုနက လက်ခံလိုက်တဲ့ (သို့) ဖန်တီးလိုက်တဲ့၊ ဖတ်ရှုခြင်း မစတင်ရသေးတဲ့၊ buffered data မရှိသေးတဲ့ TCP connection တစ်ခု ဖြစ်ရပါမယ် — မဟုတ်ရင် `postMessage()` က `ERR_WORKER_HANDLE_NOT_TRANSFERABLE` ကို throw လုပ်ပါတယ်။ ဒါက — thread တစ်ခုပေါ်မှာ connections တွေကို လက်ခံပြီး — worker threads တွေရဲ့ pool တစ်ခုပေါ်ကို ဖြန့်ဝေပေးဖို့ ဖြစ်နိုင်စေပါတယ်။ TCP handles တွေကိုပဲ support လုပ်ပါတယ်။

`value` ထဲမှာ {SharedArrayBuffer} instances တွေ ပါဝင်နေရင် — ၎င်းတို့ကို thread နှစ်ခုလုံးကနေ ဝင်ရောက်လို့ ရပါတယ်။ ၎င်းတို့ကို `transferList` ထဲမှာ စာရင်းသွင်းလို့ မရပါဘူး။

`value` ထဲမှာ `transferList` ထဲ မပါတဲ့ `ArrayBuffer` instances တွေ ဆက်ပြီး ပါဝင်နိုင်ပါသေးတယ်; အဲဒီအခါ — နောက်ခံ memory ကို ရွှေ့ပြောင်းခြင်း မဟုတ်ဘဲ — copy (ကူးယူ) လုပ်ပါတယ်။

```mjs
import { MessageChannel } from 'node:worker_threads';
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// This posts a copy of `uint8Array`:
port2.postMessage(uint8Array);
// This does not copy data, but renders `uint8Array` unusable:
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// The memory for the `sharedUint8Array` is accessible from both the
// original and the copy received by `.on('message')`:
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// This transfers a freshly created message port to the receiver.
// This can be used, for example, to create communication channels between
// multiple `Worker` threads that are children of the same parent thread.
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```

```cjs
const { MessageChannel } = require('node:worker_threads');
const { port1, port2 } = new MessageChannel();

port1.on('message', (message) => console.log(message));

const uint8Array = new Uint8Array([ 1, 2, 3, 4 ]);
// This posts a copy of `uint8Array`:
port2.postMessage(uint8Array);
// This does not copy data, but renders `uint8Array` unusable:
port2.postMessage(uint8Array, [ uint8Array.buffer ]);

// The memory for the `sharedUint8Array` is accessible from both the
// original and the copy received by `.on('message')`:
const sharedUint8Array = new Uint8Array(new SharedArrayBuffer(4));
port2.postMessage(sharedUint8Array);

// This transfers a freshly created message port to the receiver.
// This can be used, for example, to create communication channels between
// multiple `Worker` threads that are children of the same parent thread.
const otherChannel = new MessageChannel();
port2.postMessage({ port: otherChannel.port1 }, [ otherChannel.port1 ]);
```

Message object ကို ချက်ချင်း clone လုပ်ပါတယ် — ဒါကြောင့် post လုပ်ပြီးတဲ့နောက် ပြုပြင်မွမ်းမံလိုက်ရင်တောင် ဘေးထွက်ဆိုးကျိုး (side effects) မရှိပါဘူး။

ဒီ API ရဲ့ နောက်ကွယ်က serialization နဲ့ deserialization mechanism တွေအကြောင်း ပိုမိုသိရှိရန် — [serialization API of the `node:v8` module][v8.serdes] ကို ကြည့်ပါ။

#### TypedArrays နဲ့ Buffers တွေကို transfer လုပ်သည့်အခါ ထည့်သွင်းစဉ်းစားစရာများ (Considerations when transferring TypedArrays and Buffers)

{TypedArray|Buffer} instance တိုင်းက နောက်ခံ {ArrayBuffer} တစ်ခုအပေါ်က view (ကြည့်ရှုသည့် အလွှာ) တစ်ခုပါ။ ဆိုလိုတာက — raw data ကို တကယ် သိမ်းဆည်းပေးတာက `ArrayBuffer` ဖြစ်ပြီး — `TypedArray` နဲ့ `Buffer` objects တွေက data ကို ကြည့်ရှုခြင်းနဲ့ ကိုင်တွယ်ခြင်းအတွက် နည်းလမ်းတစ်ခုကို ပေးတာပါ။ `ArrayBuffer` instance တစ်ခုတည်းအပေါ်မှာ views အများအပြား ဖန်တီးထားတာက ဖြစ်နိုင်ပြီး အဖြစ်များပါတယ်။ Transfer list တစ်ခုကို သုံးပြီး `ArrayBuffer` တစ်ခုကို transfer လုပ်တဲ့အခါ — အဲဒီ `ArrayBuffer` တစ်ခုတည်းကို မျှဝေသုံးနေတဲ့ `TypedArray` နဲ့ `Buffer` instance အားလုံး အသုံးမပြုနိုင်တော့တာမို့ — အထူး သတိထားရပါမယ်။

```js
const ab = new ArrayBuffer(10);

const u1 = new Uint8Array(ab);
const u2 = new Uint16Array(ab);

console.log(u2.length);  // prints 5

port.postMessage(u1, [u1.buffer]);

console.log(u2.length);  // prints 0
```

`Buffer` instances တွေအတွက် — အထူးသဖြင့် — နောက်ခံ `ArrayBuffer` ကို transfer လုပ်လို့ ရမရ/ clone လုပ်ရမရဆိုတာ — instances တွေကို ဘယ်လို ဖန်တီးခဲ့လဲဆိုတာအပေါ် လုံးဝ မူတည်ပါတယ် — အဲဒါကို ယုံကြည်စိတ်ချလို့ မရတတ်တာ မကြာခဏပါ။

`ArrayBuffer` တစ်ခုကို — အမြဲတမ်း clone လုပ်ပြီး ဘယ်တော့မှ transfer မလုပ်သင့်ဘူးလို့ ဖော်ပြဖို့ — [`markAsUntransferable()`][] နဲ့ mark လုပ်နိုင်ပါတယ်။

`Buffer` instance တစ်ခုကို ဘယ်လို ဖန်တီးခဲ့လဲဆိုတာပေါ် မူတည်ပြီး — ၎င်းက ၎င်းရဲ့ နောက်ခံ `ArrayBuffer` ကို ပိုင်ဆိုင်မယ် (သို့) မပိုင်ဆိုင်ဘူး။ `Buffer` instance က ၎င်းကို ပိုင်ဆိုင်တယ်လို့ သေချာမသိရဘူးဆိုရင် — `ArrayBuffer` တစ်ခုကို transfer မလုပ်ရပါဘူး။ အထူးသဖြင့် — internal `Buffer` pool ကနေ ဖန်တီးထားတဲ့ `Buffer`s တွေ (ဥပမာ — `Buffer.from()` (သို့) `Buffer.allocUnsafe()` သုံးထားတာ) ကို transfer လုပ်လို့ မရပါဘူး — ၎င်းတို့က အမြဲတမ်း clone လုပ်ခံရပြီး — `Buffer` pool တစ်ခုလုံးရဲ့ copy တစ်ခုကို ပို့လိုက်တာပါ။ ဒီအပြုအမူက မရည်ရွယ်ဘဲ memory သုံးစွဲမှု ပိုများစေပြီး — ဖြစ်နိုင်ခြေရှိတဲ့ လုံခြုံရေး စိုးရိမ်မှုတွေလည်း ပါဝင်နိုင်ပါတယ်။

`Buffer` pooling အကြောင်း အသေးစိတ်အတွက် [`Buffer.allocUnsafe()`][] ကို ကြည့်ပါ။

`Buffer.alloc()` (သို့) `Buffer.allocUnsafeSlow()` သုံးပြီး ဖန်တီးထားတဲ့ `Buffer` instances တွေရဲ့ `ArrayBuffer`s တွေကို အမြဲတမ်း transfer လုပ်လို့ ရပေမယ့် — ဒီလိုလုပ်တာက အဲဒီ `ArrayBuffer`s တွေရဲ့ တခြား ရှိပြီးသား views တွေ အားလုံးကို အသုံးမပြုနိုင်အောင် ဖြစ်စေပါတယ်။

#### Prototypes, classes နဲ့ accessors ပါဝင်တဲ့ objects တွေကို clone လုပ်သည့်အခါ ထည့်သွင်းစဉ်းစားစရာများ (Considerations when cloning objects with prototypes, classes, and accessors)

Object cloning က [HTML structured clone algorithm][] ကို သုံးတာမို့ — non-enumerable properties, property accessors, နဲ့ object prototypes တွေကို ထိန်းသိမ်းမပေးပါဘူး။ အထူးသဖြင့် — {Buffer} objects တွေကို လက်ခံဘက်မှာ သာမန် {Uint8Array}s တွေအနေနဲ့ ဖတ်ရှုရမှာ ဖြစ်ပြီး — JavaScript classes တွေရဲ့ instances တွေကိုတော့ သာမန် JavaScript objects တွေအနေနဲ့ clone လုပ်ပါလိမ့်မယ်။

```js
const b = Symbol('b');

class Foo {
  #a = 1;
  constructor() {
    this[b] = 2;
    this.c = 3;
  }

  get d() { return this.#a + 3; }
}

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => console.log(data);

port2.postMessage(new Foo());

// Prints: { c: 3 }
```

Built-in objects တချို့ကို လုံးဝ clone လုပ်လို့ မရပါဘူး။ ဥပမာ — `URL` object တစ်ခုကို post လုပ်တာက `DataCloneError` တစ်ခုကို throw လုပ်ပါတယ်:

```js
const { port1, port2 } = new MessageChannel();

port2.postMessage(new URL('https://example.org'));
// Throws DataCloneError: Cannot clone object of unsupported type.
```

### `port.hasRef()`

* Returns: {boolean}

`true` ဆိုရင် — `MessagePort` object က Node.js event loop ကို active ဖြစ်နေအောင် ထိန်းထားပါလိမ့်မယ်။

### `port.ref()`

`unref()` ရဲ့ ဆန့်ကျင်ဘက်ပါ။ အရင်က `unref()` လုပ်ထားတဲ့ port တစ်ခုပေါ်မှာ `ref()` ကို ခေါ်တာက — program ထဲမှာ ကျန်ရှိတဲ့ တစ်ခုတည်းသော active handle ဖြစ်နေရင်တောင် — program ကို ထွက်မသွားစေပါဘူး (ဒါက default အပြုအမူပါ)။ Port က `ref()` လုပ်ပြီးသားဆိုရင် — `ref()` ကို ထပ်ခေါ်တာက သက်ရောက်မှု မရှိပါဘူး။

`.on('message')` သုံးပြီး listeners တွေကို ထည့်တာ (သို့) ဖယ်တာ လုပ်မယ်ဆိုရင် — event အတွက် listeners တွေ ရှိမရှိပေါ် မူတည်ပြီး — port ကို `ref()` (သို့) `unref()` အလိုအလျောက် လုပ်ပေးပါတယ်။

### `port.start()`

ဒီ `MessagePort` ပေါ်မှာ messages တွေ လက်ခံတာကို စတင်ပါတယ်။ ဒီ port ကို event emitter တစ်ခုအနေနဲ့ သုံးတဲ့အခါ — `'message'` listeners တွေ ချိတ်တာနဲ့ ဒါကို အလိုအလျောက် ခေါ်ပါတယ်။

ဒီ method က Web `MessagePort` API နဲ့ တူညီအောင် (parity) ရှိဖို့ ရှိနေတာပါ။ Node.js မှာတော့ — event listener မရှိတဲ့အခါ messages တွေကို လျစ်လျူရှုဖို့အတွက်သာ အသုံးဝင်ပါတယ်။ Node.js က `.onmessage` ကို ကိုင်တွယ်ပုံမှာလည်း ကွဲပြားပါတယ်။ ဒါကို သတ်မှတ်လိုက်တာက `.start()` ကို အလိုအလျောက် ခေါ်ပေမယ့် — ဖျက်သိမ်းလိုက်တာကတော့ handler အသစ်တစ်ခု သတ်မှတ်တဲ့အထိ (သို့) port ကို စွန့်ပစ်လိုက်တဲ့အထိ — messages တွေကို queue ထဲမှာ စောင့်စေပါတယ်။

### `port.unref()`

Port တစ်ခုပေါ်မှာ `unref()` ကို ခေါ်တာက — event system ထဲမှာ ဒါပဲ ကျန်ရှိတဲ့ active handle ဖြစ်နေရင် — thread ကို ထွက်ခွင့်ပြုပါတယ်။ Port က `unref()` လုပ်ပြီးသားဆိုရင် `unref()` ကို ထပ်ခေါ်တာက သက်ရောက်မှု မရှိပါဘူး။

`.on('message')` သုံးပြီး listeners တွေကို ထည့်တာ (သို့) ဖယ်တာ လုပ်မယ်ဆိုရင် — event အတွက် listeners တွေ ရှိမရှိပေါ် မူတည်ပြီး — port ကို `ref()` (သို့) `unref()` အလိုအလျောက် လုပ်ပေးပါတယ်။

## Class: `Worker`

* Extends: {EventEmitter}

`Worker` class က လွတ်လပ်တဲ့ JavaScript execution thread တစ်ခုကို ကိုယ်စားပြုပါတယ်။ Node.js APIs အများစုက ၎င်းအတွင်းမှာ ရနိုင်ပါတယ်။

Worker environment တစ်ခုအတွင်းမှာ သိသာတဲ့ ကွာခြားချက်တွေကတော့:

* [`process.stdin`][], [`process.stdout`][], နဲ့ [`process.stderr`][] streams တွေကို parent thread က ပြန်ညွှန်း (redirect) လုပ်နိုင်ပါတယ်။
* [`require('node:worker_threads').isMainThread`][] property ကို `false` အဖြစ် သတ်မှတ်ထားပါတယ်။
* [`require('node:worker_threads').parentPort`][] message port က ရနိုင်ပါတယ်။
* [`process.exit()`][] က program တစ်ခုလုံးကို မရပ်တန့်စေဘဲ — thread တစ်ခုတည်းကိုပဲ ရပ်တန့်စေပြီး — [`process.abort()`][] ကိုတော့ မရနိုင်ပါဘူး။
* [`process.chdir()`][] နဲ့ group (သို့) user ids တွေကို သတ်မှတ်ပေးတဲ့ `process` methods တွေက မရနိုင်ပါဘူး။
* [`process.env`][] က parent thread ရဲ့ environment variables တွေရဲ့ copy တစ်ခုပါ — တခြားနည်း သတ်မှတ်မထားဘူးဆိုရင်။ Copy တစ်ခုထဲက ပြောင်းလဲမှုတွေက တခြား threads တွေမှာ မမြင်ရဘဲ — native add-ons တွေမှာလည်း မမြင်ရပါဘူး ([`worker.SHARE_ENV`][] ကို [`Worker`][] constructor ရဲ့ `env` option အနေနဲ့ ပေးထားတာ မဟုတ်ရင်)။ Windows မှာ — main thread နဲ့ မတူဘဲ — environment variables တွေရဲ့ copy တစ်ခုက case-sensitive (စာလုံးကြီး/သေး ခွဲခြား) ပုံစံနဲ့ အလုပ်လုပ်ပါတယ်။
* [`process.title`][] ကို ပြုပြင်မွမ်းမံလို့ မရပါဘူး။
* Signals တွေကို [`process.on('...')`][Signals events] ကနေတစ်ဆင့် ပို့မပေးပါဘူး။
* Execution က [`worker.terminate()`][] ကို ခေါ်လိုက်တာရဲ့ ရလဒ်အနေနဲ့ — ဘယ်အချိန်မဆို ရပ်တန့်သွားနိုင်ပါတယ်။
* Parent processes တွေကနေ လာတဲ့ IPC channels တွေကို ဝင်ရောက်လို့ မရပါဘူး။
* [`trace_events`][] module ကို support မလုပ်ပါဘူး။
* Native add-ons တွေကို — [အချို့သော အခြေအနေတွေ][Addons worker support] ပြည့်မီမှသာ — threads အများအပြားကနေ load လုပ်နိုင်ပါတယ်။

တခြား `Worker`s တွေအတွင်းမှာ `Worker` instances တွေ ဖန်တီးတာက ဖြစ်နိုင်ပါတယ်။

[Web Workers][] တွေနဲ့ [`node:cluster` module][] လိုပဲ — thread ချင်း (inter-thread) message passing ကနေတစ်ဆင့် — two-way ဆက်သွယ်မှုကို ရရှိနိုင်ပါတယ်။ အတွင်းပိုင်းမှာ — `Worker` တစ်ခုမှာ — `Worker` ကို ဖန်တီးလိုက်တဲ့အခါ ကတည်းက တစ်ခုနဲ့တစ်ခု ဆက်စပ်ပြီးသား ဖြစ်တဲ့ — built-in [`MessagePort`][] တွဲတစ်တွဲ ပါရှိပါတယ်။ Parent ဘက်က `MessagePort` object ကို တိုက်ရိုက် ထုတ်ပြမထားပေမယ့် — ၎င်းရဲ့ လုပ်ဆောင်ချက်တွေကို parent thread အတွက် `Worker` object ပေါ်က [`worker.postMessage()`][] နဲ့ [`worker.on('message')`][] event ကနေတစ်ဆင့် ထုတ်ဖော်ပေးပါတယ်။

Custom messaging channels တွေ ဖန်တီးဖို့ (ဒါက default global channel ကို သုံးတာထက် ပိုပြီး အားပေးခံရတာပါ — ဘာလို့လဲဆိုတော့ ဒါက ဆိုင်ရာကိစ္စတွေကို သီးခြားခွဲထားလို့ ရလို့ပါ) — user တွေက thread တစ်ခုခုပေါ်မှာ `MessageChannel` object တစ်ခုကို ဖန်တီးပြီး — အဲဒီ `MessageChannel` ပေါ်က `MessagePort`s တစ်ခုကို — global channel လိုမျိုး ကြိုရှိပြီးသား channel တစ်ခုကနေတစ်ဆင့် — တခြား thread ဆီ ပေးပို့နိုင်ပါတယ်။

Messages တွေကို ဘယ်လို ပို့ဆောင်လဲ၊ thread barrier (thread စည်းခြား) ကိုဖြတ်ပြီး ဘယ်လို JavaScript values တွေကို အောင်မြင်စွာ သယ်ဆောင်လို့ ရလဲဆိုတာတွေအကြောင်း ပိုမိုသိရှိရန် [`port.postMessage()`][] ကို ကြည့်ပါ။

```mjs
import assert from 'node:assert';
import {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} from 'node:worker_threads';
if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url));
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

```cjs
const assert = require('node:assert');
const {
  Worker, MessageChannel, MessagePort, isMainThread, parentPort,
} = require('node:worker_threads');
if (isMainThread) {
  const worker = new Worker(__filename);
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  parentPort.once('message', (value) => {
    assert(value.hereIsYourPort instanceof MessagePort);
    value.hereIsYourPort.postMessage('the worker is sending this');
    value.hereIsYourPort.close();
  });
}
```

### `new Worker(filename[, options])`

* `filename` {string|URL} Worker ရဲ့ main script (သို့) module ဆီက path ပါ။ Absolute path တစ်ခု ဖြစ်ရမယ်၊ ဒါမှမဟုတ် `./` (သို့) `../` နဲ့ စတင်တဲ့ relative path (ဆိုလိုတာက လက်ရှိ working directory နဲ့ ဆက်စပ်တဲ့ path) တစ်ခု ဖြစ်ရမယ်၊ ဒါမှမဟုတ် `file:` (သို့) `data:` protocol သုံးထားတဲ့ WHATWG `URL` object တစ်ခု ဖြစ်ရပါမယ်။ [`data:` URL][] တစ်ခုကို သုံးတဲ့အခါ — data ကို [ECMAScript module loader][] သုံးပြီး MIME type အပေါ် မူတည်ပြီး အနက်ဖွင့်ပါတယ်။ `options.eval` က `true` ဆိုရင် — ဒါက path တစ်ခု မဟုတ်ဘဲ JavaScript code တွေ ပါဝင်တဲ့ string တစ်ခုပါ။
* `options` {Object}
  * `argv` {any\[]} String အဖြစ် ပြောင်းပြီး worker ထဲက `process.argv` ဆီ ထပ်ဖြည့်ပေးမယ့် arguments တွေရဲ့ စာရင်းပါ။ ဒါက `workerData` နဲ့ အတော်လေး ဆင်ပေမယ့် — တန်ဖိုးတွေက script ဆီ CLI options တွေအနေနဲ့ ပေးထားသလိုမျိုး — global `process.argv` ပေါ်မှာ ရနိုင်ပါတယ်။
  * `env` {Object} သတ်မှတ်ထားရင် — Worker thread အတွင်းက `process.env` ရဲ့ ကနဦး တန်ဖိုးကို သတ်မှတ်ပေးပါတယ်။ အထူးတန်ဖိုးတစ်ခုအနေနဲ့ — parent thread နဲ့ child thread တို့က သူတို့ရဲ့ environment variables တွေကို မျှဝေသင့်တယ်ဆိုတာ သတ်မှတ်ဖို့ [`worker.SHARE_ENV`][] ကို သုံးနိုင်ပါတယ်; အဲဒီအခါ — thread တစ်ခုရဲ့ `process.env` object ထဲက ပြောင်းလဲမှုတွေက တခြား thread ကိုပါ သက်ရောက်ပါတယ်။ **Default:** `process.env`။
  * `eval` {boolean} `true` ဖြစ်ပြီး ပထမ argument က `string` တစ်ခုဆိုရင် — constructor ရဲ့ ပထမ argument ကို — worker online ဖြစ်တာနဲ့ execute လုပ်ရမယ့် script တစ်ခုအနေနဲ့ အနက်ဖွင့်ပါတယ်။
  * `execArgv` {string\[]} Worker ဆီ ပေးပို့တဲ့ node CLI options တွေရဲ့ စာရင်းပါ။ V8 options (ဥပမာ — `--max-old-space-size`) နဲ့ process ကို သက်ရောက်တဲ့ options (ဥပမာ — `--title`) တွေကိုတော့ support မလုပ်ပါဘူး။ သတ်မှတ်ထားရင် — ဒါကို worker အတွင်းမှာ [`process.execArgv`][] အနေနဲ့ ပေးပါတယ်။ မူလအားဖြင့် — options တွေကို parent thread ကနေ အမွေဆက်ခံပါတယ်။
  * `stdin` {boolean} ဒါကို `true` အဖြစ် သတ်မှတ်ထားရင် — `worker.stdin` က — Worker အတွင်းမှာ `process.stdin` အနေနဲ့ ပေါ်လာမယ့် ပါဝင်မှုတွေ ရှိတဲ့ writable stream တစ်ခုကို ပေးပါတယ်။ မူလအားဖြင့် — data တစ်ခုမှ မပေးပါဘူး။
  * `stdout` {boolean} ဒါကို `true` အဖြစ် သတ်မှတ်ထားရင် — `worker.stdout` ကို parent ထဲက `process.stdout` ဆီကို အလိုအလျောက် pipe မလုပ်တော့ပါဘူး။
  * `stderr` {boolean} ဒါကို `true` အဖြစ် သတ်မှတ်ထားရင် — `worker.stderr` ကို parent ထဲက `process.stderr` ဆီကို အလိုအလျောက် pipe မလုပ်တော့ပါဘူး။
  * `workerData` {any} clone လုပ်ပြီး [`require('node:worker_threads').workerData`][] အနေနဲ့ ရနိုင်အောင် လုပ်ပေးမယ့် မည်သည့် JavaScript value မဆို။ Cloning ကို [HTML structured clone algorithm][] မှာ ဖော်ပြထားတဲ့အတိုင်း လုပ်ဆောင်ပြီး — object ကို clone မလုပ်နိုင်ဘူးဆိုရင် (ဥပမာ — `function`s တွေ ပါဝင်နေလို့) — error တစ်ခု throw လုပ်ပါတယ်။
  * `trackUnmanagedFds` {boolean} ဒါကို `true` အဖြစ် သတ်မှတ်ထားရင် — Worker က [`fs.open()`][] နဲ့ [`fs.close()`][] ကနေတစ်ဆင့် စီမံခန့်ခွဲတဲ့ raw file descriptors တွေကို ခြေရာခံပြီး — Worker ထွက်သွားတဲ့အခါ — network sockets (သို့) [`FileHandle`][] API ကနေတစ်ဆင့် စီမံခန့်ခွဲတဲ့ file descriptors တွေလိုမျိုး တခြား resources တွေလိုပဲ — ၎င်းတို့ကို ပိတ်ပါတယ်။ ဒီ option ကို nested `Worker`s အားလုံးက အလိုအလျောက် အမွေဆက်ခံပါတယ်။ **Default:** `true`။
  * `transferList` {Object\[]} `workerData` ထဲမှာ `MessagePort`-နဲ့တူတဲ့ objects တစ်ခု (သို့) တစ်ခုထက်ပို ပါသွားရင် — အဲဒီ items တွေအတွက် `transferList` တစ်ခု လိုအပ်ပြီး မပါရင် [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`][] throw လုပ်ပါတယ်။ အသေးစိတ်အတွက် [`port.postMessage()`][] ကို ကြည့်ပါ။
  * `resourceLimits` {Object} JS engine instance အသစ်အတွက် optional resource limits (အရင်းအမြစ် ကန့်သတ်ချက်များ) အစုတစ်ခုပါ။ ဒီ limits တွေ ရောက်ရှိသွားတာက `Worker` instance ကို terminate (ရပ်စဲ) လုပ်ဖို့ ဦးတည်ပါတယ်။ ဒီ limits တွေက JS engine ကိုပဲ သက်ရောက်မှု ရှိပြီး — `ArrayBuffer`s တွေ အပါအဝင် — ပြင်ပ data တစ်ခုခုကိုတော့ မသက်ရောက်ပါဘူး။ ဒီ limits တွေ သတ်မှတ်ထားရင်တောင် — process က global out-of-memory အခြေအနေ တစ်ခုကို ကြုံရပါသေးရင် — abort ဖြစ်နိုင်ပါသေးတယ်။
    * `maxOldGenerationSizeMb` {number} Main heap ရဲ့ အများဆုံး အရွယ်အစားကို MB နဲ့ ဖော်ပြပါတယ်။ Command-line argument [`--max-old-space-size`][] ကို သတ်မှတ်ထားရင် — ဒါက ဒီသတ်မှတ်ချက်ကို override လုပ်ပါတယ်။
    * `maxYoungGenerationSizeMb` {number} မကြာသေးခင်က ဖန်တီးထားတဲ့ objects တွေအတွက် heap space တစ်ခုရဲ့ အများဆုံး အရွယ်အစားပါ။ Command-line argument [`--max-semi-space-size`][] ကို သတ်မှတ်ထားရင် — ဒါက ဒီသတ်မှတ်ချက်ကို override လုပ်ပါတယ်။
    * `codeRangeSizeMb` {number} Generated code တွေအတွက် သုံးတဲ့ ကြိုတင်ခွဲဝေထားတဲ့ (pre-allocated) memory range တစ်ခုရဲ့ အရွယ်အစားပါ။
    * `stackSizeMb` {number} Thread အတွက် default အများဆုံး stack size ပါ။ တန်ဖိုးငယ်တွေက အသုံးမပြုနိုင်တဲ့ `Worker` instances တွေကို ဖြစ်စေနိုင်ပါတယ်။ **Default:** `4`။
  * `name` {string} Thread name နဲ့ worker title ထဲမှာ debugging/identification (ခြေရာခံ/ခွဲခြားသိမှု) ရည်ရွယ်ချက်တွေအတွက် အစားထိုးထည့်မယ့် optional `name` တစ်ခုပါ — နောက်ဆုံး title က `[worker ${id}] ${name}` ပုံစံ ဖြစ်သွားပါတယ်။ ဒီ parameter မှာ operating system ပေါ် မူတည်တဲ့ အများဆုံး ခွင့်ပြုထားတဲ့ အရွယ်အစား တစ်ခု ရှိပါတယ်။ ပေးလိုက်တဲ့ name က ကန့်သတ်ချက်ကို ကျော်လွန်နေရင် — ဖြတ်တောက် (truncate) ခံရပါလိမ့်မယ်။
    * အများဆုံး အရွယ်အစားများ:
      * Windows: စာလုံးရေ 32,767
      * macOS: စာလုံးရေ 64
      * Linux: စာလုံးရေ 16
      * NetBSD: `PTHREAD_MAX_NAMELEN_NP` နဲ့ ကန့်သတ်ထား
      * FreeBSD နဲ့ OpenBSD: `MAXCOMLEN` နဲ့ ကန့်သတ်ထား
        **Default:** `'WorkerThread'`။

### Event: `'error'`

* `err` {any}

Worker thread က uncaught exception တစ်ခုကို throw လုပ်ခဲ့ရင် `'error'` event ကို emit လုပ်ပါတယ်။ အဲဒီအခါ — worker ကို terminate လုပ်ပါတယ်။

### Event: `'exit'`

* `exitCode` {integer}

Worker ရပ်တန့်သွားတာနဲ့ `'exit'` event ကို emit လုပ်ပါတယ်။ Worker က [`process.exit()`][] ကို ခေါ်ပြီး ထွက်သွားခဲ့တယ်ဆိုရင် — `exitCode` parameter က ပေးလိုက်တဲ့ exit code ဖြစ်ပါတယ်။ Worker ကို terminate လုပ်ခဲ့တယ်ဆိုရင် — `exitCode` parameter က `1` ပါ။

ဒါက `Worker` instance တိုင်းက emit လုပ်တဲ့ နောက်ဆုံး event ပါ။

### Event: `'message'`

* `value` {any} ပို့လိုက်တဲ့ တန်ဖိုးပါ။

Worker thread က [`require('node:worker_threads').parentPort.postMessage()`][] ကို ခေါ်လိုက်တဲ့အခါ `'message'` event ကို emit လုပ်ပါတယ်။ အသေးစိတ်အတွက် [`port.on('message')`][] event ကို ကြည့်ပါ။

Worker thread ကနေ ပို့လိုက်တဲ့ messages တွေ အားလုံးကို — `Worker` object ပေါ်မှာ [`'exit'` event][] ကို emit မလုပ်ခင် — emit လုပ်ပါတယ်။

### Event: `'messageerror'`

* `error` {Error} Error object တစ်ခုပါ။

Message တစ်ခုကို deserialize လုပ်တဲ့အခါ မအောင်မြင်တဲ့အခါ `'messageerror'` event ကို emit လုပ်ပါတယ်။

### Event: `'online'`

Worker thread က JavaScript code တွေ စတင် execute လုပ်တဲ့အခါ `'online'` event ကို emit လုပ်ပါတယ်။

### `worker.cpuUsage([prev])`

* Returns: {Promise}

ဒီ method က — [`process.threadCpuUsage()`][] နဲ့ တူညီတဲ့ object တစ်ခုနဲ့ resolve ဖြစ်မယ့် `Promise` တစ်ခုကို ပြန်ပေးပြီး — worker က ဆက်ပြီး run မနေတော့ဘူးဆိုရင် — [`ERR_WORKER_NOT_RUNNING`][] error တစ်ခုနဲ့ reject ဖြစ်ပါတယ်။ ဒီ method က statistics တွေကို တကယ့် thread ရဲ့ အပြင်ဘက်ကနေ လေ့လာကြည့်ရှုနိုင်အောင် ခွင့်ပြုပါတယ်။

### `worker.getHeapSnapshot([options])`

* `options` {Object}
  * `exposeInternals` {boolean} `true` ဆိုရင် — heap snapshot ထဲမှာ internals တွေကို ထုတ်ပြပါတယ်။ **Default:** `false`။
  * `exposeNumericValues` {boolean} `true` ဆိုရင် — artificial fields တွေထဲမှာ numeric values တွေကို ထုတ်ပြပါတယ်။ **Default:** `false`။
* Returns: {Promise} V8 heap snapshot တစ်ခု ပါဝင်တဲ့ Readable Stream တစ်ခုအတွက် promise တစ်ခု။

Worker ရဲ့ လက်ရှိ အခြေအနေအတွက် V8 snapshot တစ်ခုရဲ့ readable stream တစ်ခုကို ပြန်ပေးပါတယ်။ အသေးစိတ်အတွက် [`v8.getHeapSnapshot()`][] ကို ကြည့်ပါ။

Worker thread က ဆက်ပြီး run မနေတော့ဘူးဆိုရင် — [`'exit'` event][] မထွက်ခင်မှာတောင် ဖြစ်နိုင်တာပါ — ပြန်ပေးလိုက်တဲ့ `Promise` ကို [`ERR_WORKER_NOT_RUNNING`][] error တစ်ခုနဲ့ ချက်ချင်း reject လုပ်ပါတယ်။

### `worker.getHeapStatistics()`

* Returns: {Promise}

ဒီ method က — [`v8.getHeapStatistics()`][] နဲ့ တူညီတဲ့ object တစ်ခုနဲ့ resolve ဖြစ်မယ့် `Promise` တစ်ခုကို ပြန်ပေးပြီး — worker က ဆက်ပြီး run မနေတော့ဘူးဆိုရင် — [`ERR_WORKER_NOT_RUNNING`][] error တစ်ခုနဲ့ reject ဖြစ်ပါတယ်။ ဒီ method က statistics တွေကို တကယ့် thread ရဲ့ အပြင်ဘက်ကနေ လေ့လာကြည့်ရှုနိုင်အောင် ခွင့်ပြုပါတယ်။

### `worker.performance`

Worker instance တစ်ခုကနေ performance အချက်အလက်တွေကို မေးမြန်းစုံစမ်းဖို့ သုံးလို့ရတဲ့ object တစ်ခုပါ။

#### `performance.eventLoopUtilization([utilization1[, utilization2]])`

* `utilization1` {Object} `eventLoopUtilization()` ဆီကို အရင် ခေါ်မှုတစ်ခုရဲ့ ရလဒ်ပါ။
* `utilization2` {Object} `utilization1` မတိုင်ခင် `eventLoopUtilization()` ဆီကို ခေါ်မှုတစ်ခုရဲ့ ရလဒ်ပါ။
* Returns: {Object}
  * `idle` {number}
  * `active` {number}
  * `utilization` {number}

[`perf_hooks` `eventLoopUtilization()`][] နဲ့ တူညီတဲ့ ခေါ်မှုပါ — ဒါပေမယ့် worker instance ရဲ့ တန်ဖိုးတွေကို ပြန်ပေးပါတယ်။

ကွာခြားချက်တစ်ခုကတော့ — main thread နဲ့ မတူဘဲ — worker တစ်ခုအတွင်းမှာ bootstrapping ကို event loop အတွင်းမှာ လုပ်ဆောင်ပါတယ်။ ဒါကြောင့် — worker ရဲ့ script စတင် execute လုပ်တာနဲ့ — event loop utilization က ချက်ချင်း ရနိုင်ပါတယ်။

တိုးမလာတဲ့ `idle` အချိန်က worker က bootstrap ထဲမှာ ညှပ်နေတယ်လို့ မဆိုလိုပါဘူး။ အောက်က ဥပမာက — worker ရဲ့ တစ်သက်တာလုံးမှာ `idle` အချိန် ဘယ်တော့မှ စုမလာဘူးဆိုပေမယ့် — messages တွေကို ဆက်ပြီး လုပ်ဆောင်နိုင်တယ်ဆိုတာကို ပြပါတယ်။

```mjs
import { Worker, isMainThread, parentPort } from 'node:worker_threads';

if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url));
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
} else {
  parentPort.on('message', () => console.log('msg')).unref();
  (function r(n) {
    if (--n < 0) return;
    const t = Date.now();
    while (Date.now() - t < 300);
    setImmediate(r, n);
  })(10);
}
```

```cjs
const { Worker, isMainThread, parentPort } = require('node:worker_threads');

if (isMainThread) {
  const worker = new Worker(__filename);
  setInterval(() => {
    worker.postMessage('hi');
    console.log(worker.performance.eventLoopUtilization());
  }, 100).unref();
} else {
  parentPort.on('message', () => console.log('msg')).unref();
  (function r(n) {
    if (--n < 0) return;
    const t = Date.now();
    while (Date.now() - t < 300);
    setImmediate(r, n);
  })(10);
}
```

Worker တစ်ခုရဲ့ event loop utilization ကို [`'online'` event][] emit ပြီးမှသာ ရနိုင်ပြီး — ဒါမတိုင်ခင် (သို့) [`'exit'` event][] ပြီးတဲ့နောက်မှာ ခေါ်ရင် — properties အားလုံးက `0` တန်ဖိုး ရှိပါတယ်။

### `worker.postMessage(value[, transferList])`

* `value` {any}
* `transferList` {Object\[]}

[`require('node:worker_threads').parentPort.on('message')`][] ကနေတစ်ဆင့် လက်ခံရရှိတဲ့ worker ဆီကို message တစ်ခု ပို့ပါတယ်။ အသေးစိတ်အတွက် [`port.postMessage()`][] ကို ကြည့်ပါ။

### `worker.ref()`

`unref()` ရဲ့ ဆန့်ကျင်ဘက်ပါ — အရင်က `unref()` လုပ်ထားတဲ့ worker တစ်ခုပေါ်မှာ `ref()` ကို ခေါ်တာက — program ထဲမှာ ကျန်ရှိတဲ့ တစ်ခုတည်းသော active handle ဖြစ်နေရင်တောင် — program ကို ထွက်မသွားစေပါဘူး (ဒါက default အပြုအမူပါ)။ Worker က `ref()` လုပ်ပြီးသားဆိုရင် — `ref()` ကို ထပ်ခေါ်တာက သက်ရောက်မှု မရှိပါဘူး။

### `worker.resourceLimits`

* Type: {Object}
  * `maxYoungGenerationSizeMb` {number}
  * `maxOldGenerationSizeMb` {number}
  * `codeRangeSizeMb` {number}
  * `stackSizeMb` {number}

ဒီ Worker thread အတွက် JS engine resource constraints (အရင်းအမြစ် ကန့်သတ်ချက်များ) အစုကို ပေးပါတယ်။ [`Worker`][] constructor ဆီ `resourceLimits` option ကို ပေးခဲ့တယ်ဆိုရင် — ဒါက သူ့ရဲ့ တန်ဖိုးတွေနဲ့ ကိုက်ညီပါတယ်။

Worker ရပ်တန့်သွားပြီဆိုရင် — ပြန်ပေးတဲ့ တန်ဖိုးက empty object တစ်ခုပါ။

### `worker.startCpuProfile([options])`

* `options` {Object}
  * `sampleInterval` {number} တောင်းဆိုထားတဲ့ sampling interval ကို millisecond နဲ့ ဖော်ပြပါတယ်။ **Default:** `0`။
  * `maxBufferSize` {integer} သိမ်းဆည်းထားမယ့် samples အရေအတွက် အများဆုံးပါ။ **Default:** `4294967295`။
* Returns: {Promise}

CPU profile တစ်ခုကို စတင်ပြီး — error တစ်ခု (သို့) `CPUProfileHandle` object တစ်ခုနဲ့အတူ fulfill ဖြစ်တဲ့ Promise တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ API က `await using` syntax ကို support လုပ်ပါတယ်။

```cjs
const { Worker } = require('node:worker_threads');

const worker = new Worker(`
  const { parentPort } = require('worker_threads');
  parentPort.on('message', () => {});
  `, { eval: true });

worker.on('online', async () => {
  const handle = await worker.startCpuProfile({ sampleInterval: 1 });
  const profile = await handle.stop();
  console.log(profile);
  worker.terminate();
});
```

`await using` ဥပမာ။

```cjs
const { Worker } = require('node:worker_threads');

const w = new Worker(`
  const { parentPort } = require('node:worker_threads');
  parentPort.on('message', () => {});
  `, { eval: true });

w.on('online', async () => {
  // Stop profile automatically when return and profile will be discarded
  await using handle = await w.startCpuProfile();
});
```

### `worker.startHeapProfile([options])`

* `options` {Object}
  * `sampleInterval` {number} ပျမ်းမျှ sampling interval ကို bytes နဲ့ ဖော်ပြပါတယ်။ **Default:** `524288` (512 KiB)။
  * `stackDepth` {integer} Samples တွေအတွက် အများဆုံး stack depth ပါ။ **Default:** `16`။
  * `forceGC` {boolean} Profile မယူခင် garbage collection ကို အတင်းလုပ်ခိုင်းပါတယ်။ **Default:** `false`။
  * `includeObjectsCollectedByMajorGC` {boolean} Major GC က စုဆောင်းလိုက်တဲ့ objects တွေကို ထည့်သွင်းပါတယ်။ **Default:** `false`။
  * `includeObjectsCollectedByMinorGC` {boolean} Minor GC က စုဆောင်းလိုက်တဲ့ objects တွေကို ထည့်သွင်းပါတယ်။ **Default:** `false`။
* Returns: {Promise}

Heap profile တစ်ခုကို စတင်ပြီး — error တစ်ခု (သို့) `HeapProfileHandle` object တစ်ခုနဲ့အတူ fulfill ဖြစ်တဲ့ Promise တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ API က `await using` syntax ကို support လုပ်ပါတယ်။

```cjs
const { Worker } = require('node:worker_threads');

const worker = new Worker(`
  const { parentPort } = require('worker_threads');
  parentPort.on('message', () => {});
  `, { eval: true });

worker.on('online', async () => {
  const handle = await worker.startHeapProfile();
  const profile = await handle.stop();
  console.log(profile);
  worker.terminate();
});
```

```mjs
import { Worker } from 'node:worker_threads';

const worker = new Worker(`
  const { parentPort } = require('node:worker_threads');
  parentPort.on('message', () => {});
  `, { eval: true });

worker.on('online', async () => {
  const handle = await worker.startHeapProfile();
  const profile = await handle.stop();
  console.log(profile);
  worker.terminate();
});
```

`await using` ဥပမာ။

```cjs
const { Worker } = require('node:worker_threads');

const w = new Worker(`
  const { parentPort } = require('node:worker_threads');
  parentPort.on('message', () => {});
  `, { eval: true });

w.on('online', async () => {
  // Stop profile automatically when return and profile will be discarded
  await using handle = await w.startHeapProfile();
});
```

```mjs
import { Worker } from 'node:worker_threads';

const w = new Worker(`
  const { parentPort } = require('node:worker_threads');
  parentPort.on('message', () => {});
  `, { eval: true });

w.on('online', async () => {
  // Stop profile automatically when return and profile will be discarded
  await using handle = await w.startHeapProfile();
});
```

### `worker.stderr`

* Type: {stream.Readable}

Worker thread အတွင်းမှာ [`process.stderr`][] ဆီ ရေးလိုက်တဲ့ data တွေ ပါဝင်တဲ့ readable stream တစ်ခုပါ။ [`Worker`][] constructor ဆီ `stderr: true` ကို မပေးခဲ့ဘူးဆိုရင် — data ကို parent thread ရဲ့ [`process.stderr`][] stream ဆီ pipe လုပ်ပါတယ်။

### `worker.stdin`

* Type: {null|stream.Writable}

[`Worker`][] constructor ဆီ `stdin: true` ကို ပေးခဲ့တယ်ဆိုရင် — ဒါက writable stream တစ်ခုပါ။ ဒီ stream ဆီ ရေးလိုက်တဲ့ data ကို worker thread အတွင်းမှာ [`process.stdin`][] အနေနဲ့ ရနိုင်အောင် လုပ်ပေးပါတယ်။

### `worker.stdout`

* Type: {stream.Readable}

Worker thread အတွင်းမှာ [`process.stdout`][] ဆီ ရေးလိုက်တဲ့ data တွေ ပါဝင်တဲ့ readable stream တစ်ခုပါ။ [`Worker`][] constructor ဆီ `stdout: true` ကို မပေးခဲ့ဘူးဆိုရင် — data ကို parent thread ရဲ့ [`process.stdout`][] stream ဆီ pipe လုပ်ပါတယ်။

### `worker.terminate()`

* Returns: {Promise}

Worker thread ထဲက JavaScript execution အားလုံးကို တတ်နိုင်သမျှ မြန်မြန် ရပ်တန့်ပါတယ်။ [`'exit'` event][] emit ဖြစ်တဲ့အခါ fulfill ဖြစ်တဲ့ exit code အတွက် Promise တစ်ခုကို ပြန်ပေးပါတယ်။

### `worker.threadId`

* Type: {integer}

ရည်ညွှန်းထားတဲ့ thread အတွက် integer identifier တစ်ခုပါ။ Worker thread အတွင်းမှာ — [`require('node:worker_threads').threadId`][] အနေနဲ့ ရနိုင်ပါတယ်။ ဒီတန်ဖိုးက process တစ်ခုတည်းအတွင်းက `Worker` instance တစ်ခုချင်းစီအတွက် unique (ထူးခြား) ပါတယ်။

### `worker.threadName`

* {string|null}

ရည်ညွှန်းထားတဲ့ thread အတွက် string identifier တစ်ခု ဖြစ်ပြီး — thread က run မနေဘူးဆိုရင် `null` ပါ။ Worker thread အတွင်းမှာ — [`require('node:worker_threads').threadName`][] အနေနဲ့ ရနိုင်ပါတယ်။

### `worker.unref()`

Worker တစ်ခုပေါ်မှာ `unref()` ကို ခေါ်တာက — event system ထဲမှာ ဒါပဲ ကျန်ရှိတဲ့ active handle ဖြစ်နေရင် — thread ကို ထွက်ခွင့်ပြုပါတယ်။ Worker က `unref()` လုပ်ပြီးသားဆိုရင် `unref()` ကို ထပ်ခေါ်တာက သက်ရောက်မှု မရှိပါဘူး။

### `worker[Symbol.asyncDispose]()`

Dispose scope ကနေ ထွက်သွားတဲ့အခါ [`worker.terminate()`][] ကို ခေါ်ပါတယ်။

```js
async function example() {
  await using worker = new Worker('for (;;) {}', { eval: true });
  // Worker is automatically terminate when the scope is exited.
}
```

## မှတ်စုများ (Notes)

### stdio ၏ synchronous blocking ဖြစ်မှု (Synchronous blocking of stdio)

`Worker`s တွေက `stdio` နဲ့ ထိတွေ့ဆက်ဆံမှုတွေကို အကောင်အထည်ဖော်ဖို့ {MessagePort} ကနေတစ်ဆင့် message passing ကို အသုံးပြုပါတယ်။ ဆိုလိုတာက — `Worker` တစ်ခုကနေ ထွက်လာတဲ့ `stdio` output က — Node.js event loop ကို block လုပ်နေတဲ့ — လက်ခံဘက်က synchronous code ကြောင့် — ပိတ်ဆို့ခံရ (blocked) နိုင်ပါတယ်။

```mjs
import {
  Worker,
  isMainThread,
} from 'node:worker_threads';

if (isMainThread) {
  new Worker(new URL(import.meta.url));
  for (let n = 0; n < 1e10; n++) {
    // Looping to simulate work.
  }
} else {
  // This output will be blocked by the for loop in the main thread.
  console.log('foo');
}
```

```cjs
const {
  Worker,
  isMainThread,
} = require('node:worker_threads');

if (isMainThread) {
  new Worker(__filename);
  for (let n = 0; n < 1e10; n++) {
    // Looping to simulate work.
  }
} else {
  // This output will be blocked by the for loop in the main thread.
  console.log('foo');
}
```

### Preload scripts များမှ worker threads များကို စတင်ခြင်း (Launching worker threads from preload scripts)

Preload scripts တွေ (ဆိုလိုတာက `-r` command line flag သုံးပြီး load လုပ်ပြီး run လုပ်တဲ့ scripts တွေ) ကနေ worker threads တွေကို စတင်တဲ့အခါ သတိထားပါ။ `execArgv` option ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်မထားဘူးဆိုရင် — Worker thread အသစ်တွေက run နေတဲ့ process ကနေ command line flags တွေကို အလိုအလျောက် အမွေဆက်ခံပြီး — main thread လိုပဲ preload scripts တွေကို အလိုအလျောက် preload လုပ်ပါလိမ့်မယ်။ Preload script က ခြွင်းချက်မရှိ worker thread တစ်ခုကို စတင်နေတယ်ဆိုရင် — spawn လုပ်လိုက်တဲ့ thread တိုင်းက နောက်ထပ် thread တစ်ခုကို ထပ်ပြီး spawn လုပ်နေမှာ ဖြစ်ပြီး — application crash မဖြစ်မချင်း ဆက်ဖြစ်နေပါလိမ့်မယ်။

[Addons worker support]: addons.md#worker-support
[ECMAScript module loader]: esm.md#data-imports
[HTML structured clone algorithm]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
[LockManager]: #class-lockmanager
[Signals events]: process.md#signal-events
[Web Workers]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
[`'close'` event]: #event-close
[`'exit'` event]: #event-exit
[`'online'` event]: #event-online
[`--max-old-space-size`]: cli.md#--max-old-space-sizesize-in-mib
[`--max-semi-space-size`]: cli.md#--max-semi-space-sizesize-in-mib
[`AsyncResource`]: async_hooks.md#class-asyncresource
[`Buffer.allocUnsafe()`]: buffer.md#static-method-bufferallocunsafesize-alignment
[`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`]: errors.md#err_missing_message_port_in_transfer_list
[`ERR_WORKER_MESSAGING_ERRORED`]: errors.md#err_worker_messaging_errored
[`ERR_WORKER_MESSAGING_FAILED`]: errors.md#err_worker_messaging_failed
[`ERR_WORKER_MESSAGING_SAME_THREAD`]: errors.md#err_worker_messaging_same_thread
[`ERR_WORKER_MESSAGING_TIMEOUT`]: errors.md#err_worker_messaging_timeout
[`ERR_WORKER_NOT_RUNNING`]: errors.md#err_worker_not_running
[`FileHandle`]: fs.md#class-filehandle
[`MessagePort`]: #class-messageport
[`WebAssembly.Module`]: https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Module
[`Worker constructor options`]: #new-workerfilename-options
[`Worker`]: #class-worker
[`data:` URL]: https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data
[`fs.close()`]: fs.md#fsclosefd-callback
[`fs.open()`]: fs.md#fsopenpath-flags-mode-callback
[`markAsUntransferable()`]: #worker_threadsmarkasuntransferableobject
[`node:cluster` module]: cluster.md
[`perf_hooks` `eventLoopUtilization()`]: perf_hooks.md#perf_hookseventlooputilizationutilization1-utilization2
[`port.on('message')`]: #event-message
[`port.onmessage()`]: https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/message_event
[`port.postMessage()`]: #portpostmessagevalue-transferlist
[`process.abort()`]: process.md#processabort
[`process.chdir()`]: process.md#processchdirdirectory
[`process.env`]: process.md#processenv
[`process.execArgv`]: process.md#processexecargv
[`process.exit()`]: process.md#processexitcode
[`process.stderr`]: process.md#processstderr
[`process.stdin`]: process.md#processstdin
[`process.stdout`]: process.md#processstdout
[`process.threadCpuUsage()`]: process.md#processthreadcpuusagepreviousvalue
[`process.title`]: process.md#processtitle
[`require('node:worker_threads').isMainThread`]: #worker_threadsismainthread
[`require('node:worker_threads').parentPort.on('message')`]: #event-message
[`require('node:worker_threads').parentPort.postMessage()`]: #workerpostmessagevalue-transferlist
[`require('node:worker_threads').parentPort`]: #worker_threadsparentport
[`require('node:worker_threads').threadId`]: #worker_threadsthreadid
[`require('node:worker_threads').threadName`]: #worker_threadsthreadname
[`require('node:worker_threads').workerData`]: #worker_threadsworkerdata
[`trace_events`]: tracing.md
[`v8.getHeapSnapshot()`]: v8.md#v8getheapsnapshotoptions
[`v8.getHeapStatistics()`]: v8.md#v8getheapstatistics
[`vm`]: vm.md
[`worker.SHARE_ENV`]: #worker_threadsshare_env
[`worker.on('message')`]: #event-message_1
[`worker.postMessage()`]: #workerpostmessagevalue-transferlist
[`worker.terminate()`]: #workerterminate
[`worker.threadId`]: #workerthreadid
[`worker.threadName`]: #workerthreadname
[async-resource-worker-pool]: async_context.md#using-asyncresource-for-a-worker-thread-pool
[browser `LockManager`]: https://developer.mozilla.org/en-US/docs/Web/API/LockManager
[browser `MessagePort`]: https://developer.mozilla.org/en-US/docs/Web/API/MessagePort
[contextified]: vm.md#what-does-it-mean-to-contextify-an-object
[locks.request()]: #locksrequestname-options-callback
[v8.serdes]: v8.md#serialization-api
