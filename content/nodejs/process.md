---
title: "Process"
description: "node:process module — process object — process events (exit, uncaughtException, warning, signal events စသည်), process.argv/env/versions/cwd, process.nextTick, process.kill/exit/abort, umask, resource usage (cpuUsage/memoryUsage), permissions, child_process ဆိုင်ရာ properties, exit codes စသည်"
order: 151
source: "https://nodejs.org/api/process.html"
status: translated
updated: 2026-09-05
---

`process` object က လက်ရှိ (current) Node.js process အကြောင်း အချက်အလက်တွေကို ပေးအပ်ပြီး — ၎င်းကို ထိန်းချုပ်နိုင်စွမ်းကိုလည်း ပံ့ပိုးပေးပါတယ်။

```mjs
import process from 'node:process';
```

```cjs
const process = require('node:process');
```

## Process ၏ events များ (Process events)

`process` object က [`EventEmitter`][] ရဲ့ instance တစ်ခု ဖြစ်ပါတယ်။

### Event: `'beforeExit'`

`'beforeExit'` event က — Node.js ရဲ့ event loop ထဲက အလုပ်တွေ အားလုံး ပြီးသွားပြီး — ထပ်တိုး schedule လုပ်စရာ အလုပ်တွေ မရှိတော့တဲ့အခါ — emit လုပ်ပါတယ်။ ပုံမှန်အားဖြင့် — schedule လုပ်ထားတဲ့ အလုပ်တွေ မရှိတော့တဲ့အခါ — Node.js process က exit ဖြစ်သွားပါလိမ့်မယ်။ ဒါပေမယ့် — `'beforeExit'` event မှာ register လုပ်ထားတဲ့ listener တစ်ခုက asynchronous calls တွေကို လုပ်နိုင်ပြီး — အဲဒါကြောင့် Node.js process ကို ဆက်လက် လည်ပတ်နေစေနိုင်ပါတယ်။

Listener callback function ကို — [`process.exitCode`][] ရဲ့ တန်ဖိုးကို တစ်ခုတည်းသော argument အဖြစ် ဖြတ်သန်းပေးလျက် — ခေါ်ယူပါတယ်။

`'beforeExit'` event က — [`process.exit()`][] ကို ခေါ်တာ (သို့) uncaught exceptions တွေလိုမျိုး — explicit termination (တိုက်ရိုက် ရပ်စဲခြင်း) ဖြစ်စေတဲ့ အခြေအနေတွေမှာ emit လုပ်တာ _မဟုတ်_ပါဘူး။

`'beforeExit'` ကို — ထပ်ဆောင်း အလုပ်တွေ schedule လုပ်ဖို့ ရည်ရွယ်ချက် မရှိဘူးဆိုရင် — `'exit'` event ရဲ့ အစားထိုး (alternative) တစ်ခုအနေနဲ့ သုံးစွဲဖို့ _မသင့်_ပါဘူး။

```mjs
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```

```cjs
process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```

### Event: `'disconnect'`

Node.js process ကို IPC channel တစ်ခုနဲ့အတူ spawn လုပ်ထားခဲ့ရင် (အသေးစိတ်ကို [Child Process][] နဲ့ [Cluster][] documentation တွေမှာ ကြည့်ပါ) — IPC channel ပိတ်သွားတဲ့အခါ — `'disconnect'` event ကို emit လုပ်ပါလိမ့်မယ်။

### Event: `'exit'`

* `code` {integer}

`'exit'` event က — Node.js process က exit ဖြစ်တော့မယ့် အခါမှာ — အောက်ပါတို့ထဲက တစ်ခုခုရဲ့ ရလဒ်အနေနဲ့ emit လုပ်ပါတယ်:

* `process.exit()` method ကို တိုက်ရိုက် (explicitly) ခေါ်လိုက်ခြင်း;
* Node.js event loop မှာ လုပ်ဆောင်စရာ ထပ်ဆောင်း အလုပ်တွေ မရှိတော့ခြင်း။

ဒီအချိန်မှာ event loop ရဲ့ exit ဖြစ်မှုကို တားဆီးဖို့ နည်းလမ်း မရှိတော့ပါဘူး — ပြီးတော့ `'exit'` listeners တွေ အားလုံး လည်ပတ်ပြီးသွားတာနဲ့ — Node.js process က terminate ဖြစ်သွားပါလိမ့်မယ်။

Listener callback function ကို — [`process.exitCode`][] property ကနေ သတ်မှတ်ထားတဲ့ သို့မဟုတ် [`process.exit()`][] method ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ — `exitCode` argument ဖြစ်တဲ့ exit code နဲ့အတူ ခေါ်ယူပါတယ်။

```mjs
import process from 'node:process';

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```

```cjs
process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```

Listener functions တွေက **synchronous** operations တွေကိုသာ လုပ်ဆောင်ရပါမယ်။ `'exit'` event listeners တွေကို ခေါ်ပြီးတာနဲ့ — Node.js process က ချက်ချင်း exit ဖြစ်သွားတာမို့ — event loop ထဲမှာ စောင့်ဆိုင်းနေသေးတဲ့ (queued) ထပ်ဆောင်း အလုပ်တွေ အားလုံး စွန့်လွှတ်လိုက်ရပါတယ်။ ဥပမာ — အောက်က ဥပမာမှာ timeout က ဘယ်တော့မှ ဖြစ်ပေါ်လာမှာ မဟုတ်ပါဘူး:

```mjs
import process from 'node:process';

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

```cjs
process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

### Event: `'message'`

* `message` {Object|boolean|number|string|null} Parse လုပ်ပြီးသား JSON object (သို့) serialize လုပ်လို့ရတဲ့ primitive တန်ဖိုးတစ်ခုပါ။
* `sendHandle` {net.Server|net.Socket} [`net.Server`][] (သို့) [`net.Socket`][] object တစ်ခု သို့မဟုတ် undefined ပါ။

Node.js process ကို IPC channel တစ်ခုနဲ့အတူ spawn လုပ်ထားခဲ့ရင် (အသေးစိတ်ကို [Child Process][] နဲ့ [Cluster][] documentation တွေမှာ ကြည့်ပါ) — parent process က [`childprocess.send()`][] ကို သုံးပြီး ပို့လိုက်တဲ့ message တစ်ခုကို child process က လက်ခံရရှိတိုင်း — `'message'` event ကို emit လုပ်ပါတယ်။

Message က serialization နဲ့ parsing (ခွဲခြမ်းစိတ်ဖြာခြင်း) တွေကို ဖြတ်သန်းရပါတယ်။ ရလာတဲ့ message က မူရင်း ပို့လိုက်တဲ့အရာနဲ့ အတိအကျ တူချင်မှ တူပါလိမ့်မယ်။

Process ကို spawn လုပ်တဲ့အခါ `serialization` option ကို `advanced` အဖြစ် သတ်မှတ်ထားခဲ့ရင် — `message` argument ထဲမှာ JSON က ကိုယ်စားပြု (represent) လုပ်လို့ မရတဲ့ data တွေ ပါဝင်နိုင်ပါတယ်။ နောက်ထပ် အသေးစိတ်တွေအတွက် [Advanced serialization for `child_process`][] ကို ကြည့်ပါ။

### Event: `'rejectionHandled'`

* `promise` {Promise} နောက်ကျမှ ကိုင်တွယ်လိုက်တဲ့ (late handled) promise ပါ။

`'rejectionHandled'` event က — `Promise` တစ်ခု rejected ဖြစ်ခဲ့ပြီး — Node.js event loop ရဲ့ turn (အလှည့်) တစ်ခုထက် နောက်ကျမှ — ၎င်းဆီမှာ error handler တစ်ခု (ဥပမာ — [`promise.catch()`][] ကို သုံးပြီး) တွဲချိတ်လိုက်တဲ့အခါတိုင်း — emit လုပ်ပါတယ်။

ဒီ `Promise` object က အရင်က `'unhandledRejection'` event တစ်ခုထဲမှာ emit လုပ်ခံခဲ့ရပေမယ့် — processing လုပ်နေစဉ်အတွင်းမှာ rejection handler တစ်ခု ရရှိသွားတာ ဖြစ်ပါတယ်။

`Promise` chain တစ်ခုအတွက်မှာ — rejections တွေကို အမြဲတမ်း ကိုင်တွယ်နိုင်တဲ့ — top level (ထိပ်ဆုံး အဆင့်) ဆိုတာ မရှိပါဘူး။ `Promise` က သဘာဝအားဖြင့် asynchronous ဖြစ်တာမို့ — `Promise` rejection တစ်ခုကို — `'unhandledRejection'` event ကို emit လုပ်ဖို့ လိုအပ်တဲ့ event loop turn ထက် အများကြီး နောက်ကျနိုင်တဲ့ — အနာဂတ် အချိန်တစ်ချို့မှာ ကိုင်တွယ်နိုင်ပါတယ်။

နောက်တစ်နည်း ပြောရရင် — synchronous code တွေမှာ unhandled exceptions တွေရဲ့ စာရင်းက အမြဲတမ်း ကြီးထွားလာနေတတ်ပေမယ့် — Promises တွေနဲ့ဆိုရင် unhandled rejections တွေရဲ့ စာရင်းက ကြီးထွားလည်း ရှိ၊ ကျုံ့သွားလည်း ရှိနိုင်ပါတယ်။

Synchronous code တွေမှာ — unhandled exceptions တွေရဲ့ စာရင်း ကြီးထွားလာတဲ့အခါ — `'uncaughtException'` event ကို emit လုပ်ပါတယ်။

Asynchronous code တွေမှာတော့ — unhandled rejections တွေရဲ့ စာရင်း ကြီးထွားလာတဲ့အခါ `'unhandledRejection'` event ကို emit လုပ်ပြီး — စာရင်း ကျုံ့သွားတဲ့အခါ `'rejectionHandled'` event ကို emit လုပ်ပါတယ်။

```mjs
import process from 'node:process';

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```

```cjs
const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```

ဒီဥပမာမှာ — `unhandledRejections` `Map` က အချိန်နဲ့အမျှ ကြီးထွားလည်း ရှိ၊ ကျုံ့သွားလည်း ရှိပြီး — အစမှာ unhandled ဖြစ်ပြီး နောက်ပိုင်းမှာ handled ဖြစ်သွားတဲ့ rejections တွေကို ထင်ဟပ်ပြသပါတယ်။ အဲဒီလို errors တွေကို — အခါအားလျော်စွာ (periodically — အချိန်ကြာကြာ လည်ပတ်နေတဲ့ application တွေအတွက် အကောင်းဆုံး ဖြစ်နိုင်ပါတယ်) (သို့) process exit ဖြစ်ချိန်မှာ (scripts တွေအတွက် အဆင်အပြေဆုံး ဖြစ်နိုင်ပါတယ်) — error log တစ်ခုထဲမှာ မှတ်တမ်းတင်ထားနိုင်ပါတယ်။

### Event: `'workerMessage'`

* `value` {any} [`postMessageToThread()`][] ကို သုံးပြီး ပို့လွှတ်လိုက်တဲ့ (transmitted) တန်ဖိုးတစ်ခုပါ။
* `source` {number} ပို့လွှတ်နေတဲ့ worker thread ရဲ့ ID — main thread အတွက်တော့ `0` ဖြစ်ပါတယ်။

`'workerMessage'` event က — အခြားတစ်ဖက်က [`postMessageToThread()`][] ကို သုံးပြီး ပို့လိုက်တဲ့ incoming message တစ်ခုခု ရောက်ရှိလာတိုင်း — emit လုပ်ပါတယ်။

### Event: `'uncaughtException'`

* `err` {Error} Uncaught exception (ဖမ်းယူမရတဲ့ exception) ပါ။
* `origin` {string} Exception က unhandled rejection ကနေ လာတာလား သို့မဟုတ် synchronous error တစ်ခုကနေ လာတာလားဆိုတာကို ဖော်ပြပါတယ်။ `'uncaughtException'` (သို့) `'unhandledRejection'` ဆိုပြီး နှစ်မျိုးထဲက တစ်မျိုး ဖြစ်နိုင်ပါတယ်။ နောက်ဆုံး တစ်မျိုးကို — `Promise` အခြေခံတဲ့ async context တစ်ခုထဲမှာ exception ဖြစ်ပွားတဲ့အခါ (သို့) `Promise` တစ်ခု rejected ဖြစ်တဲ့အခါ — ပြီးတော့ [`--unhandled-rejections`][] flag ကို `strict` (သို့) `throw` (default ဖြစ်တဲ့) အဖြစ် သတ်မှတ်ထားပြီး rejection ကို ကိုင်တွယ်မထားဘူးဆိုရင် — သို့မဟုတ် — command line entry point ရဲ့ ES module static loading phase အတွင်းမှာ rejection ဖြစ်ပွားတဲ့အခါ — သုံးပါတယ်။

`'uncaughtException'` event က — uncaught JavaScript exception တစ်ခုက event loop ဆီအထိ ပြန်တက်လာတဲ့အခါ — emit လုပ်ပါတယ်။ Default အနေနဲ့ Node.js က အဲဒီလို exceptions တွေကို — stack trace ကို `stderr` မှာ print ပြီး — အရင်က သတ်မှတ်ထားခဲ့တဲ့ [`process.exitCode`][] ကို ကျော်လွှားကာ — code 1 နဲ့ exit လုပ်ခြင်းအားဖြင့် ကိုင်တွယ်ပါတယ်။ `'uncaughtException'` event အတွက် handler တစ်ခု ထည့်လိုက်တာက ဒီ default အပြုအမူကို ကျော်လွှား (override) လုပ်ပါတယ်။ တနည်းအားဖြင့် — `'uncaughtException'` handler ထဲမှာ [`process.exitCode`][] ကို ပြောင်းလဲလိုက်ရင် — process က ပေးလိုက်တဲ့ exit code နဲ့ exit ဖြစ်သွားပါလိမ့်မယ်။ ဒီလိုမဟုတ်ရင် — အဲဒီလို handler တစ်ခု ရှိနေတဲ့အခါ — process က 0 နဲ့ exit ဖြစ်ပါလိမ့်မယ်။

```mjs
import process from 'node:process';
import fs from 'node:fs';

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

```cjs
const fs = require('node:fs');

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}\n`,
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
```

`'uncaughtException'` events တွေကို — `'uncaughtExceptionMonitor'` listener တစ်ခု တပ်ဆင်ပြီး — process ကို exit ဖြစ်စေတဲ့ default အပြုအမူကို ကျော်လွှားစရာ မလိုပဲ — စောင့်ကြည့် (monitor) လုပ်နိုင်ပါတယ်။

#### Warning: Using `'uncaughtException'` correctly

`'uncaughtException'` က — နောက်ဆုံး အားကိုးစရာ (last resort) အဖြစ်သာ သုံးရန် ရည်ရွယ်ထားတဲ့ — ကြမ်းတမ်းတဲ့ (crude) exception handling ယန္တရားတစ်ခုပါ။ ဒီ event ကို `On Error Resume Next` ရဲ့ အစားထိုးတစ်ခုအနေနဲ့ သုံးစွဲဖို့ _မသင့်_ပါဘူး။ Unhandled exceptions တွေက ပင်ကိုယ်အားဖြင့် application တစ်ခုက undefined state (သတ်မှတ်မထားတဲ့ အခြေအနေ) ထဲမှာ ရှိနေတယ်လို့ ဆိုလိုပါတယ်။ Exception ကနေ စနစ်တကျ ပြန်လည် ကောင်းမွန်အောင် မလုပ်နိုင်ပဲ application code ကို ပြန်လည် စတင်ဖို့ ကြိုးစားတာက — နောက်ထပ် မျှော်လင့်မထားတဲ့ ပြဿနာတွေကို ဖြစ်စေနိုင်ပါတယ်။

Event handler အတွင်းကနေ throw လုပ်လိုက်တဲ့ exceptions တွေကို ဖမ်းယူမှာ မဟုတ်ပါဘူး။ အဲဒီအစား — process က non-zero exit code တစ်ခုနဲ့ exit ဖြစ်ပြီး — stack trace ကို print လုပ်ပါလိမ့်မယ်။ ဒါက infinite recursion (အဆုံးမဲ့ ထပ်ခါထပ်ခါ ပြန်ခေါ်မှု) ကို ရှောင်ရှားဖို့ အတွက်ပါ။

Uncaught exception တစ်ခုပြီးနောက် ပုံမှန်အတိုင်း ပြန်လည် စတင်ဖို့ ကြိုးစားတာက — computer တစ်လုံးကို upgrade လုပ်နေစဉ် ပါဝါကြိုး ဆွဲထုတ်လိုက်တာနဲ့ ဆင်တူနိုင်ပါတယ်။ ဆယ်ကြိမ်မှာ ကိုးကြိမ်က ဘာမှ မဖြစ်ပါဘူး။ ဒါပေမယ့် ဒသမမြောက် အကြိမ်မှာတော့ system က ပျက်စီးသွားပါတယ်။

`'uncaughtException'` ရဲ့ မှန်ကန်တဲ့ အသုံးပြုမှုကတော့ — process ကို ပိတ်ပစ်ခင် — ခွဲဝေထားတဲ့ (allocated) resources တွေ (ဥပမာ — file descriptors, handles စသည်) ကို synchronous ပုံစံနဲ့ ရှင်းလင်းဖို့ပါ။ **`'uncaughtException'` ပြီးနောက်မှာ ပုံမှန် လည်ပတ်မှုကို ပြန်လည် စတင်တာက မလုံခြုံပါဘူး။**

Crash ဖြစ်သွားတဲ့ application တစ်ခုကို ပိုစိတ်ချရတဲ့ နည်းလမ်းနဲ့ ပြန်စဖို့ဆိုရင် — `'uncaughtException'` emit ဖြစ်ဖြစ်၊ မဖြစ်ဖြစ် — application ရဲ့ failures တွေကို ထောက်လှမ်းပြီး — လိုအပ်သလို ပြန်လည် ကောင်းမွန်အောင် လုပ်တာ (သို့) ပြန်လည် စတင်ဖို့ — သီးခြား process တစ်ခုထဲမှာ external monitor (ပြင်ပ စောင့်ကြည့်စနစ်) တစ်ခုကို အသုံးပြုသင့်ပါတယ်။

### Event: `'uncaughtExceptionMonitor'`

* `err` {Error} Uncaught exception (ဖမ်းယူမရတဲ့ exception) ပါ။
* `origin` {string} Exception က unhandled rejection ကနေ လာတာလား သို့မဟုတ် synchronous errors တွေကနေ လာတာလားဆိုတာကို ဖော်ပြပါတယ်။ `'uncaughtException'` (သို့) `'unhandledRejection'` ဆိုပြီး နှစ်မျိုးထဲက တစ်မျိုး ဖြစ်နိုင်ပါတယ်။ နောက်ဆုံး တစ်မျိုးကို — `Promise` အခြေခံတဲ့ async context တစ်ခုထဲမှာ exception ဖြစ်ပွားတဲ့အခါ (သို့) `Promise` တစ်ခု rejected ဖြစ်တဲ့အခါ — ပြီးတော့ [`--unhandled-rejections`][] flag ကို `strict` (သို့) `throw` (default ဖြစ်တဲ့) အဖြစ် သတ်မှတ်ထားပြီး rejection ကို ကိုင်တွယ်မထားဘူးဆိုရင် — သို့မဟုတ် — command line entry point ရဲ့ ES module static loading phase အတွင်းမှာ rejection ဖြစ်ပွားတဲ့အခါ — သုံးပါတယ်။

`'uncaughtExceptionMonitor'` event က — `'uncaughtException'` event တစ်ခုကို emit မလုပ်ခင် သို့မဟုတ် [`process.setUncaughtExceptionCaptureCallback()`][] ကနေတစ်ဆင့် တပ်ဆင်ထားတဲ့ hook တစ်ခုကို မခေါ်ခင် — emit လုပ်ပါတယ်။

`'uncaughtExceptionMonitor'` listener တစ်ခု တပ်ဆင်ထားတာက — `'uncaughtException'` event တစ်ခု emit ဖြစ်ပြီးတာနဲ့ — အပြုအမူကို ပြောင်းလဲစေမှာ မဟုတ်ပါဘူး။ `'uncaughtException'` listener တစ်ခုမှ မတပ်ဆင်ထားဘူးဆိုရင် — process က ဆက်လက် crash ဖြစ်နေဦးမှာ ဖြစ်ပါတယ်။

```mjs
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
// Still crashes Node.js
```

```cjs
process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
// Still crashes Node.js
```

### Event: `'unhandledRejection'`

* `reason` {Error|any} Promise ကို rejected လုပ်ခဲ့တဲ့ object ပါ (ပုံမှန်အားဖြင့် [`Error`][] object တစ်ခု)။
* `promise` {Promise} Rejected ဖြစ်သွားတဲ့ promise ပါ။

`'unhandledRejection'` event က — `Promise` တစ်ခု rejected ဖြစ်ပြီး — event loop ရဲ့ turn (အလှည့်) တစ်ခုအတွင်းမှာ — အဲဒီ promise ပေါ်မှာ error handler တစ်ခုမှ တွဲချိတ်မထားဘူးဆိုရင် — emit လုပ်ပါတယ်။ Promises တွေနဲ့ ပရိုဂရမ်ရေးတဲ့အခါ — exceptions တွေကို "rejected promises" တွေအနေနဲ့ ထည့်သွင်း ဖော်ပြပါတယ်။ Rejections တွေကို [`promise.catch()`][] ကို သုံးပြီး ဖမ်းယူ ကိုင်တွယ်နိုင်ပြီး — `Promise` chain တစ်လျှောက် ဆက်လက် ပျံ့နှံ့သွားပါတယ်။ `'unhandledRejection'` event က — rejected ဖြစ်ခဲ့ပေမယ့် rejections တွေကို မကိုင်တွယ်ရသေးတဲ့ promises တွေကို ရှာဖွေတွေ့ရှိဖို့နဲ့ ခြေရာခံဖို့အတွက် အသုံးဝင်ပါတယ်။

```mjs
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Note the typo (`pasre`)
}); // No `.catch()` or `.then()`
```

```cjs
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // Note the typo (`pasre`)
}); // No `.catch()` or `.then()`
```

အောက်ပါတို့ကလည်း `'unhandledRejection'` event ကို emit ဖြစ်စေပါလိမ့်မယ်:

```mjs
import process from 'node:process';

function SomeResource() {
  // Initially set the loaded status to a rejected promise
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// no .catch or .then on resource.loaded for at least a turn
```

```cjs
function SomeResource() {
  // Initially set the loaded status to a rejected promise
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// no .catch or .then on resource.loaded for at least a turn
```

ဒီဥပမာမှာ — တခြား `'unhandledRejection'` events တွေမှာ ပုံမှန်အားဖြင့် ပြုလုပ်သလိုပဲ — rejection ကို developer error (developer ရဲ့ အမှား) တစ်ခုအနေနဲ့ ခြေရာခံနိုင်ပါတယ်။ အဲဒီလို မအောင်မြင်မှုတွေကို ဖြေရှင်းဖို့ — `resource.loaded` ပေါ်မှာ လုပ်ဆောင်ချက် (operation) မပါတဲ့ [`.catch(() => { })`][`promise.catch()`] handler တစ်ခုကို တွဲချိတ်ထားနိုင်ပြီး — အဲဒါက `'unhandledRejection'` event ကို emit မဖြစ်အောင် တားဆီးပေးပါလိမ့်မယ်။

`'unhandledRejection'` event တစ်ခုကို emit လုပ်ခဲ့ပေမယ့် ကိုင်တွယ်မထားဘူးဆိုရင် — ၎င်းက uncaught exception တစ်ခုအနေနဲ့ တင်ပြလာပါလိမ့်မယ်။ ဒါ့အပြင် `'unhandledRejection'` events တွေရဲ့ တခြား အပြုအမူတွေကို [`--unhandled-rejections`][] flag ကနေတစ်ဆင့် ပြောင်းလဲနိုင်ပါတယ်။

### Event: `'warning'`

* `warning` {Error} Warning ရဲ့ အဓိက properties တွေကတော့:
  * `name` {string} Warning ရဲ့ အမည်ပါ။ **Default:** `'Warning'`။
  * `message` {string} System က ထောက်ပံ့ပေးတဲ့ warning ရဲ့ ဖော်ပြချက် (description) ပါ။
  * `stack` {string} Warning ထုတ်ပေးခဲ့တဲ့ code ထဲက နေရာကို ညွှန်ပြတဲ့ stack trace တစ်ခုပါ။

`'warning'` event က — Node.js က process warning တစ်ခုကို emit လုပ်တိုင်း — emit လုပ်ပါတယ်။

Process warning တစ်ခုက — user ရဲ့ အာရုံစိုက်မှုကို ဆွဲဆောင်ဖို့ ယူဆောင်လာတဲ့ ထူးခြားတဲ့ (exceptional) အခြေအနေတွေကို ဖော်ပြတယ်ဆိုတဲ့ အချက်မှာ error တစ်ခုနဲ့ ဆင်တူပါတယ်။ ဒါပေမယ့် — warnings တွေက Node.js နဲ့ JavaScript ရဲ့ ပုံမှန် error handling စီးဆင်းမှု (flow) ရဲ့ အစိတ်အပိုင်း မဟုတ်ပါဘူး။ Node.js က — application ရဲ့ စွမ်းဆောင်ရည် ကျဆင်းစေနိုင်တဲ့၊ bugs (သို့) security vulnerabilities တွေ ဖြစ်စေနိုင်တဲ့ — မကောင်းတဲ့ coding practices (ရေးသားမှု အလေ့အထ) တွေကို ထောက်လှမ်းမိတိုင်း — warnings တွေကို emit လုပ်နိုင်ပါတယ်။

```mjs
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack);   // Print the stack trace
});
```

```cjs
process.on('warning', (warning) => {
  console.warn(warning.name);    // Print the warning name
  console.warn(warning.message); // Print the warning message
  console.warn(warning.stack);   // Print the stack trace
});
```

Default အနေနဲ့ — Node.js က process warnings တွေကို `stderr` မှာ print လုပ်ပါတယ်။ `--no-warnings` command-line option ကို သုံးပြီး default console output ကို ဖိနှိပ် (suppress) လုပ်နိုင်ပေမယ့် — `'warning'` event ကိုတော့ `process` object က ဆက်လက် emit လုပ်နေဦးမှာ ဖြစ်ပါတယ်။ လက်ရှိမှာ — deprecation warnings တွေကလွဲပြီး — တိကျတဲ့ warning types တွေကို ဖိနှိပ်ဖို့ မဖြစ်နိုင်သေးပါဘူး။ Deprecation warnings တွေကို ဖိနှိပ်ချင်ရင်တော့ [`--no-deprecation`][] flag ကို ကြည့်ပါ။

အောက်က ဥပမာက — event တစ်ခုမှာ listeners တွေ အများကြီး ထည့်လိုက်တဲ့အခါ `stderr` မှာ print လုပ်တဲ့ warning ကို သရုပ်ပြပါတယ်:

```console
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```

ဆန့်ကျင်ဘက်အနေနဲ့ — အောက်က ဥပမာက default warning output ကို ပိတ်ပြီး — `'warning'` event မှာ custom handler တစ်ခု ထည့်ပါတယ်:

```console
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```

`--trace-warnings` command-line option ကို သုံးပြီး — warnings တွေအတွက် default console output ထဲမှာ warning ရဲ့ stack trace အပြည့်အစုံ ပါဝင်စေနိုင်ပါတယ်။

`--throw-deprecation` command-line flag ကို သုံးပြီး Node.js ကို launch လုပ်လိုက်ရင် — custom deprecation warnings တွေကို exceptions တွေအနေနဲ့ throw လုပ်ပါလိမ့်မယ်။

`--trace-deprecation` command-line flag ကို သုံးလိုက်ရင် — custom deprecation ကို stack trace နဲ့အတူ `stderr` မှာ print လုပ်ပါလိမ့်မယ်။

`--no-deprecation` command-line flag ကို သုံးလိုက်ရင် — custom deprecation ရဲ့ အစီရင်ခံမှု (reporting) အားလုံးကို ဖိနှိပ်ပါလိမ့်မယ်။

`*-deprecation` command-line flags တွေက `'DeprecationWarning'` ဆိုတဲ့ အမည်ကို သုံးထားတဲ့ warnings တွေကိုသာ သက်ရောက်မှု ရှိပါတယ်။

#### Custom warnings များကို ထုတ်လွှတ်ခြင်း (Emitting custom warnings)

Custom (သို့) application-specific warnings တွေကို ထုတ်လွှတ်ဖို့အတွက် [`process.emitWarning()`][process_emit_warning] method ကို ကြည့်ပါ။

#### Node.js warning အမည်များ (Node.js warning names)

Node.js က emit လုပ်တဲ့ warning types တွေ (`name` property နဲ့ ခွဲခြားသတ်မှတ်ထားတဲ့) အတွက် တင်းကျပ်တဲ့ လမ်းညွှန်ချက်တွေ မရှိပါဘူး။ Warning types အသစ်တွေကို ဘယ်အချိန်မဆို ထည့်သွင်းနိုင်ပါတယ်။ အသုံးအများဆုံး warning types တစ်ချို့ကတော့:

* `'DeprecationWarning'` - Deprecated ဖြစ်နေတဲ့ Node.js API (သို့) feature တစ်ခုကို သုံးစွဲနေတယ်ဆိုတာကို ဖော်ပြပါတယ်။ အဲဒီလို warnings တွေမှာ [deprecation code][] ကို ခွဲခြားဖော်ပြတဲ့ `'code'` property တစ်ခု မဖြစ်မနေ ပါဝင်ရပါမယ်။

* `'ExperimentalWarning'` - Experimental (စမ်းသပ်ဆဲ) Node.js API (သို့) feature တစ်ခုကို သုံးစွဲနေတယ်ဆိုတာကို ဖော်ပြပါတယ်။ အဲဒီလို features တွေက ဘယ်အချိန်မဆို ပြောင်းလဲနိုင်ပြီး — supported features တွေလိုပဲ တင်းကျပ်တဲ့ semantic-versioning နဲ့ long-term support (ရေရှည် ပံ့ပိုးမှု) policies တွေကို မလိုက်နာရတာမို့ — သတိထားပြီးမှ သုံးစွဲရပါမယ်။

* `'MaxListenersExceededWarning'` - ပေးထားတဲ့ event တစ်ခုအတွက် listeners တွေ အများကြီးကို `EventEmitter` (သို့) `EventTarget` တစ်ခုပေါ်မှာ register လုပ်ထားတယ်ဆိုတာကို ဖော်ပြပါတယ်။ ဒါက မကြာခဏဆိုသလို memory leak (မှတ်ဉာဏ် ယိုစိမ့်မှု) တစ်ခုရဲ့ အရိပ်အယောင် ဖြစ်ပါတယ်။

* `'TimeoutOverflowWarning'` - 32-bit signed integer ထဲမှာ မဆန့်နိုင်တဲ့ numeric တန်ဖိုးတစ်ခုကို `setTimeout()` (သို့) `setInterval()` functions တွေထဲက တစ်ခုခုဆီကို ပေးလိုက်တယ်ဆိုတာကို ဖော်ပြပါတယ်။

* `'TimeoutNegativeWarning'` - အနှုတ် (negative) ဂဏန်းတစ်ခုကို `setTimeout()` (သို့) `setInterval()` functions တွေထဲက တစ်ခုခုဆီကို ပေးလိုက်တယ်ဆိုတာကို ဖော်ပြပါတယ်။

* `'TimeoutNaNWarning'` - ဂဏန်း မဟုတ်တဲ့ (not a number) တန်ဖိုးတစ်ခုကို `setTimeout()` (သို့) `setInterval()` functions တွေထဲက တစ်ခုခုဆီကို ပေးလိုက်တယ်ဆိုတာကို ဖော်ပြပါတယ်။

* `'UnsupportedWarning'` - Support မလုပ်တော့တဲ့ option (သို့) feature တစ်ခုကို သုံးစွဲနေတာကို ဖော်ပြပါတယ် — အဲဒါကို error အဖြစ် မသဘောမှတ်ပဲ လျစ်လျူရှုသွားပါလိမ့်မယ်။ ဥပမာတစ်ခုက — HTTP/2 compatibility API ကို သုံးတဲ့အခါ HTTP response status message ကို သုံးတာပါ။

### Event: `'worker'`

* `worker` {Worker} ဖန်တီးလိုက်တဲ့ {Worker} ပါ။

`'worker'` event က — {Worker} thread အသစ်တစ်ခု ဖန်တီးပြီးနောက်မှာ emit လုပ်ပါတယ်။

### Signal များနှင့် ပတ်သက်သော events (Signal events)

Signal events တွေက Node.js process က signal တစ်ခုကို လက်ခံရရှိတဲ့အခါ emit လုပ်ပါလိမ့်မယ်။ `'SIGINT'`, `'SIGHUP'` စတဲ့ standard POSIX signal names တွေရဲ့ စာရင်းအတွက် signal(7) ကို ရည်ညွှန်း ကြည့်ပါ။

Signals တွေက [`Worker`][] threads တွေပေါ်မှာ မရနိုင်ပါဘူး။

Signal handler က signal ရဲ့ အမည် (`'SIGINT'`, `'SIGTERM'` စသည်) ကို ပထမဆုံး argument အနေနဲ့ လက်ခံရရှိပါလိမ့်မယ်။

Event တစ်ခုချင်းစီရဲ့ အမည်က signal ရဲ့ စာလုံးကြီး (uppercase) common name ဖြစ်ပါလိမ့်မယ် (ဥပမာ — `SIGINT` signals တွေအတွက် `'SIGINT'`)။

```mjs
import process from 'node:process';

// Begin reading from stdin so the process does not exit.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Using a single function to handle multiple signals
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

```cjs
// Begin reading from stdin so the process does not exit.
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// Using a single function to handle multiple signals
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```

* `'SIGUSR1'` ကို [debugger][] ကို စတင်ဖို့အတွက် Node.js က သီးသန့် သိမ်းဆည်းထားပါတယ်။ Listener တစ်ခု တပ်ဆင်လို့ ရပေမယ့် — အဲဒီလို လုပ်တာက debugger ကို အနှောင့်အယှက် ဖြစ်စေနိုင်ပါတယ်။
* `'SIGTERM'` နဲ့ `'SIGINT'` တွေမှာ — non-Windows platforms တွေပေါ်မှာ — code `128 + signal number` နဲ့ exit မလုပ်ခင် terminal mode ကို ပြန်လည်သတ်မှတ် (reset) ပေးတဲ့ default handlers တွေ ရှိပါတယ်။ ဒီ signals တွေထဲက တစ်ခုပေါ်မှာ listener တစ်ခု တပ်ဆင်ထားရင် — ၎င်းရဲ့ default အပြုအမူကို ဖယ်ရှားလိုက်ပါလိမ့်မယ် (Node.js က နောက်ထပ် exit လုပ်တော့မှာ မဟုတ်ပါဘူး)။
* `'SIGPIPE'` ကို default အနေနဲ့ လျစ်လျူရှုပါတယ်။ ၎င်းပေါ်မှာ listener တစ်ခု တပ်ဆင်နိုင်ပါတယ်။
* `'SIGHUP'` က — Windows မှာ console window ပိတ်လိုက်တဲ့အခါ — တခြား platforms တွေမှာတော့ အလားတူ အခြေအနေအမျိုးမျိုးမှာ — ထုတ်ပေးပါတယ်။ signal(7) ကို ကြည့်ပါ။ ၎င်းပေါ်မှာ listener တစ်ခု တပ်ဆင်နိုင်ပေမယ့် — Windows က Node.js ကို စက္ကန့် ၁၀ လောက် ကြာပြီးနောက်မှာ ခြွင်းချက်မရှိ (unconditionally) terminate လုပ်ပါလိမ့်မယ်။ Non-Windows platforms တွေမှာတော့ `SIGHUP` ရဲ့ default အပြုအမူက Node.js ကို terminate လုပ်တာပါ — ဒါပေမယ့် listener တစ်ခု တပ်ဆင်လိုက်တာနဲ့ ၎င်းရဲ့ default အပြုအမူကို ဖယ်ရှားလိုက်ပါတယ်။
* `'SIGTERM'` ကို Windows မှာ support မလုပ်ပါဘူး — ဒါပေမယ့် ၎င်းကို listener တပ်ဆင်ပြီး နားထောင်လို့တော့ ရပါတယ်။
* Terminal ကနေ ရတဲ့ `'SIGINT'` ကို platform အားလုံးမှာ support လုပ်ပြီး — ပုံမှန်အားဖြင့် `Ctrl`+`C` နဲ့ ထုတ်ပေးနိုင်ပါတယ် (ဒါက ပြင်ဆင်သတ်မှတ်လို့ ရနိုင်ပေမယ့်)။ [terminal raw mode][] ကို ဖွင့်ထားပြီး `Ctrl`+`C` သုံးတဲ့အခါမှာတော့ ထုတ်ပေးမှာ မဟုတ်ပါဘူး။
* `'SIGBREAK'` က Windows မှာ `Ctrl`+`Break` နှိပ်လိုက်တဲ့အခါ ပို့ဆောင်ပေးပါတယ်။ Non-Windows platforms တွေမှာတော့ နားထောင်လို့ ရပေမယ့် — ၎င်းကို ပို့ဖို့ (သို့) ထုတ်ပေးဖို့ နည်းလမ်း မရှိပါဘူး။
* `'SIGWINCH'` က console ရဲ့ အရွယ်အစား ပြောင်းလဲလိုက်တဲ့အခါ ပို့ဆောင်ပေးပါတယ်။ Windows မှာတော့ — console ဆီကို ရေးသားတဲ့အခါ cursor ရွေ့လျားနေချိန် သို့မဟုတ် readable tty တစ်ခုကို raw mode မှာ သုံးနေချိန်မှာသာ — ဖြစ်ပွားပါတယ်။
* `'SIGKILL'` ပေါ်မှာ listener တစ်ခု တပ်ဆင်လို့ မရပါဘူး — ၎င်းက platform အားလုံးမှာ Node.js ကို ခြွင်းချက်မရှိ terminate လုပ်ပါလိမ့်မယ်။
* `'SIGSTOP'` ပေါ်မှာ listener တစ်ခု တပ်ဆင်လို့ မရပါဘူး။
* `'SIGBUS'`, `'SIGFPE'`, `'SIGSEGV'` နဲ့ `'SIGILL'` တွေက — kill(2) ကို သုံးပြီး အတုအယောင် ထုတ်ပေးတာ မဟုတ်ဘူးဆိုရင် — ပင်ကိုယ်အားဖြင့် process ကို — JS listeners တွေကို ခေါ်ဖို့ မလုံခြုံတဲ့ — အခြေအနေတစ်ခုထဲမှာ ထားခဲ့ပါတယ်။ အဲဒီလို လုပ်မိရင် process က တုံ့ပြန်မှု ရပ်တန့်သွားစေနိုင်ပါတယ်။
* Process တစ်ခု ရှိမရှိ စမ်းသပ်ဖို့ `0` ကို ပို့နိုင်ပါတယ် — process ရှိနေရင် ဘာအကျိုးသက်ရောက်မှုမှ မရှိပေမယ့် — process မရှိဘူးဆိုရင်တော့ error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

Windows က signals တွေကို support မလုပ်တာမို့ — signal နဲ့ terminate လုပ်ခြင်းရဲ့ ညီမျှတဲ့ ယန္တရားလည်း မရှိပါဘူး — ဒါပေမယ့် Node.js က [`process.kill()`][] နဲ့ [`subprocess.kill()`][] တို့နဲ့အတူ emulation (အတုယူ လုပ်ဆောင်မှု) အချို့ကို ပံ့ပိုးပေးပါတယ်:

* `SIGINT`, `SIGTERM` နဲ့ `SIGKILL` တွေကို ပို့လိုက်ရင် — target process ရဲ့ ခြွင်းချက်မရှိ terminate ဖြစ်မှုကို ဖြစ်စေပြီး — အဲဒီနောက်မှာ subprocess က process ကို signal နဲ့ terminate လုပ်ခဲ့တယ်လို့ အစီရင်ခံပါလိမ့်မယ်။
* Signal `0` ကို ပို့တာက — process တစ်ခု ရှိမရှိ စမ်းသပ်ဖို့ platform နဲ့ မသက်ဆိုင်တဲ့ (platform independent) နည်းလမ်းတစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်။

## `process.abort()`

`process.abort()` method က Node.js process ကို ချက်ချင်း exit ဖြစ်စေပြီး — core file တစ်ခု ထုတ်လုပ်ပေးပါတယ်။

ဒီ feature က [`Worker`][] threads တွေထဲမှာ မရနိုင်ပါဘူး။

## `process.addUncaughtExceptionCaptureCallback(fn)`

> Stability: 1 - Experimental

* `fn` {Function}

`process.addUncaughtExceptionCaptureCallback()` function က — uncaught exception တစ်ခု ဖြစ်ပွားတဲ့အခါ ခေါ်ယူမယ့် callback တစ်ခုကို ထည့်သွင်းပေးပြီး — exception ရဲ့ တန်ဖိုးကို ပထမဆုံး argument အဖြစ် လက်ခံရရှိပါတယ်။

[`process.setUncaughtExceptionCaptureCallback()`][] နဲ့ မတူပဲ — ဒီ function က callbacks အများအပြားကို register လုပ်ခွင့် ပြုပြီး — [`domain`][] module နဲ့လည်း ပဋိပက္ခ (conflict) မဖြစ်ပါဘူး။ Callbacks တွေကို register လုပ်ခဲ့တဲ့ အစီအစဉ်ရဲ့ ပြောင်းပြန် (နောက်ဆုံး register လုပ်ထားတဲ့ဟာ ပထမဆုံး) အနေနဲ့ ခေါ်ယူပါတယ်။ Callback တစ်ခုက `true` ပြန်ပေးခဲ့ရင် — နောက်ဆက်တွဲ callbacks တွေနဲ့ default uncaught exception handling တွေကို ကျော်လိုက်ပါတယ်။

```mjs
import process from 'node:process';

process.addUncaughtExceptionCaptureCallback((err) => {
  console.error('Caught exception:', err.message);
  return true; // Indicates exception was handled
});
```

```cjs
process.addUncaughtExceptionCaptureCallback((err) => {
  console.error('Caught exception:', err.message);
  return true; // Indicates exception was handled
});
```

## `process.allowedNodeEnvironmentFlags`

* Type: {Set}

`process.allowedNodeEnvironmentFlags` property က — [`NODE_OPTIONS`][] environment variable အတွင်းမှာ ခွင့်ပြုထားတဲ့ flags တွေ ပါဝင်တဲ့ — အထူး သီးသန့်၊ read-only `Set` တစ်ခုပါ။

`process.allowedNodeEnvironmentFlags` က `Set` ကို extend လုပ်ထားပေမယ့် — flag တွေရဲ့ ဖြစ်နိုင်တဲ့ ကိုယ်စားပြုပုံ (representation) အမျိုးမျိုးကို မှတ်မိစေဖို့ — `Set.prototype.has` ကို override လုပ်ထားပါတယ်။ `process.allowedNodeEnvironmentFlags.has()` က အောက်ပါ အခြေအနေတွေမှာ `true` ကို ပြန်ပေးပါလိမ့်မယ်:

* Flags တွေက ရှေ့ဆုံး single (`-`) (သို့) double (`--`) dashes တွေကို ချန်လှပ်ထားနိုင်ပါတယ်; ဥပမာ — `--inspect-brk` အတွက် `inspect-brk` (သို့) `-r` အတွက် `r` စသဖြင့်ပါ။
* V8 ဆီကို ဖြတ်သန်းပေးတဲ့ flags တွေ (`--v8-options` ထဲမှာ ဖော်ပြထားတဲ့အတိုင်း) က _ဦးဆောင်မဟုတ်တဲ့_ (non-leading) dashes တစ်ခု (သို့) တစ်ခုထက်ပိုတာကို underscore နဲ့ လဲလှယ်နိုင်ပြီး — အပြန်အလှန်လည်း ဖြစ်နိုင်ပါတယ်; ဥပမာ — `--perf_basic_prof`, `--perf-basic-prof`, `--perf_basic-prof` စသဖြင့်ပါ။
* Flags တွေမှာ equals (`=`) character တစ်ခု (သို့) တစ်ခုထက်ပိုတာ ပါဝင်နိုင်ပါတယ်; ပထမဆုံး equals အပါအဝင် ၎င်းနောက်မှာ ရှိတဲ့ character တွေ အားလုံးကို လျစ်လျူရှုပါလိမ့်မယ်; ဥပမာ — `--stack-trace-limit=100` စသဖြင့်ပါ။
* Flags တွေက [`NODE_OPTIONS`][] အတွင်းမှာ ခွင့်ပြုထားတဲ့ဟာတွေ ဖြစ်ရပါမယ်။

`process.allowedNodeEnvironmentFlags` ကို iterate (တစ်ခုချင်း ဖြတ်သန်း) လုပ်တဲ့အခါ — flags တွေက _တစ်ကြိမ်တည်း_ (once) သာ ပေါ်လာပြီး — တစ်ခုချင်းစီက dash တစ်ခု (သို့) တစ်ခုထက်ပိုတာနဲ့ စတင်ပါလိမ့်မယ်။ V8 ဆီကို ဖြတ်သန်းပေးတဲ့ flags တွေမှာတော့ non-leading dashes တွေအစား underscores တွေ ပါဝင်ပါလိမ့်မယ်:

```mjs
import { allowedNodeEnvironmentFlags } from 'node:process';

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```

```cjs
const { allowedNodeEnvironmentFlags } = require('node:process');

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
```

`process.allowedNodeEnvironmentFlags` ရဲ့ `add()`, `clear()` နဲ့ `delete()` methods တွေက ဘာမှ မလုပ်ပဲ — တိတ်တဆိတ် (silently) ရှုံးနိမ့်သွားပါတယ်။

Node.js ကို [`NODE_OPTIONS`][] support မပါပဲ compile လုပ်ထားခဲ့ရင် ([`process.config`][] မှာ ဖော်ပြထားတဲ့အတိုင်း) — `process.allowedNodeEnvironmentFlags` ထဲမှာ — ခွင့်ပြုခံရ_မယ့်ဟာ_ (would have been) တွေ ပါဝင်နေပါလိမ့်မယ်။

## `process.arch`

* Type: {string}

Node.js binary ကို compile လုပ်ထားတဲ့ operating system ရဲ့ CPU architecture ကို ဖော်ပြပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့: `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'`, နဲ့ `'x64'` တို့ပါ။

```mjs
import { arch } from 'node:process';

console.log(`This processor architecture is ${arch}`);
```

```cjs
const { arch } = require('node:process');

console.log(`This processor architecture is ${arch}`);
```

## `process.argv`

* Type: {string\[]}

`process.argv` property က — Node.js process ကို စတင်လိုက်တဲ့အခါ ဖြတ်သန်းပေးခဲ့တဲ့ command-line arguments တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ ပထမဆုံး element က [`process.execPath`][] ဖြစ်ပါလိမ့်မယ်။ `argv[0]` ရဲ့ မူရင်း တန်ဖိုးကို လိုအပ်ရင် `process.argv0` ကို ကြည့်ပါ။ [program entry point][] တစ်ခု ပေးထားခဲ့ရင် — ဒုတိယ element က ၎င်းဆီကို ညွှန်ပြတဲ့ absolute path ဖြစ်ပါလိမ့်မယ်။ ကျန်တဲ့ elements တွေကတော့ ထပ်ဆောင်း command-line arguments တွေပါ။

ဥပမာ — အောက်ပါ script ကို `process-args.js` အနေနဲ့ သိမ်းထားတယ်လို့ ယူဆကြည့်ပါ:

```mjs
import { argv } from 'node:process';

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

```cjs
const { argv } = require('node:process');

// print process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```

Node.js process ကို အောက်ပါအတိုင်း launch လုပ်လိုက်ရင်:

```bash
node process-args.js one two=three four
```

အောက်ပါ output ကို ထုတ်ပေးပါလိမ့်မယ်:

```text
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```

## `process.argv0`

* Type: {string}

`process.argv0` property က — Node.js စတင်တဲ့အခါ ဖြတ်သန်းပေးခဲ့တဲ့ `argv[0]` ရဲ့ မူရင်း တန်ဖိုးရဲ့ read-only copy တစ်ခုကို သိမ်းဆည်းထားပါတယ်။

```console
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

## `process.availableMemory()`

* Returns: {number}

Process အတွက် လက်ရှိ ရရှိနိုင်သေးတဲ့ free memory ပမာဏကို (byte နဲ့) ပြန်ပေးပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [`uv_get_available_memory`][uv_get_available_memory] ကို ကြည့်ပါ။

## `process.channel`

* Type: {Object}

Node.js process ကို IPC channel တစ်ခုနဲ့အတူ spawn လုပ်ထားခဲ့ရင် (အသေးစိတ်ကို [Child Process][] documentation မှာ ကြည့်ပါ) — `process.channel` property က IPC channel ဆီကို ညွှန်ပြတဲ့ reference တစ်ခု ဖြစ်ပါတယ်။ IPC channel မရှိဘူးဆိုရင် — ဒီ property က `undefined` ဖြစ်ပါတယ်။

### `process.channel.ref()`

ဒီ method က — `.unref()` ကို အရင်က ခေါ်ထားခဲ့ရင် — IPC channel ကို process ရဲ့ event loop ကို ဆက်လည်ပတ်နေစေမယ့် (keep running) အနေအထားမှာ ထားပေးပါတယ်။

ပုံမှန်အားဖြင့် — ဒါကို `process` object ပေါ်မှာရှိတဲ့ `'disconnect'` နဲ့ `'message'` listeners တွေရဲ့ အရေအတွက်ကနေတစ်ဆင့် စီမံပါတယ်။ ဒါပေမယ့် — တိကျတဲ့ အပြုအမူတစ်ခုကို တိုက်ရိုက် (explicitly) တောင်းဆိုဖို့ ဒီ method ကို သုံးနိုင်ပါတယ်။

### `process.channel.unref()`

ဒီ method က — IPC channel ကို process ရဲ့ event loop ကို ဆက်လည်ပတ်နေအောင် မလုပ်တော့ပဲ — channel ဖွင့်ထားဆဲ ဖြစ်ပေမယ့် — event loop ကို အပြီးသတ် (finish) ဖြစ်စေပါတယ်။

ပုံမှန်အားဖြင့် — ဒါကို `process` object ပေါ်မှာရှိတဲ့ `'disconnect'` နဲ့ `'message'` listeners တွေရဲ့ အရေအတွက်ကနေတစ်ဆင့် စီမံပါတယ်။ ဒါပေမယ့် — တိကျတဲ့ အပြုအမူတစ်ခုကို တိုက်ရိုက် (explicitly) တောင်းဆိုဖို့ ဒီ method ကို သုံးနိုင်ပါတယ်။

## `process.chdir(directory)`

* `directory` {string}

`process.chdir()` method က Node.js process ရဲ့ current working directory ကို ပြောင်းလဲပေးပါတယ် — ဒါမှမဟုတ် အဲဒီလို ပြောင်းလဲမှု မအောင်မြင်ဘူးဆိုရင် (ဥပမာ — သတ်မှတ်ထားတဲ့ `directory` မရှိဘူးဆိုရင်) exception တစ်ခုကို throw လုပ်ပါတယ်။

```mjs
import { chdir, cwd } from 'node:process';

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

```cjs
const { chdir, cwd } = require('node:process');

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```

ဒီ feature က [`Worker`][] threads တွေထဲမှာ မရနိုင်ပါဘူး။

## `process.config`

* Type: {Object}

`process.config` property က — လက်ရှိ Node.js executable ကို compile လုပ်ဖို့ သုံးခဲ့တဲ့ configure options တွေရဲ့ JavaScript ကိုယ်စားပြုမှု (representation) ပါဝင်တဲ့ — frozen (ပြောင်းလဲ၍မရသော) `Object` တစ်ခုကို ပြန်ပေးပါတယ်။ ဒါက `./configure` script ကို run လုပ်တဲ့အခါ ထုတ်လုပ်ခဲ့တဲ့ `config.gypi` file နဲ့ အတူတူပါ။

ဖြစ်နိုင်တဲ့ output တစ်ခုရဲ့ ဥပမာက အောက်မှာ ပြထားပါတယ်:

```json
{
  "target_defaults":
   { "cflags": [],
     "default_configuration": "Release",
     "defines": [],
     "include_dirs": [],
     "libraries": [] },
  "variables":
   {
     "host_arch": "x64",
     "napi_build_version": 5,
     "node_install_npm": "true",
     "node_prefix": "",
     "node_shared_cares": "false",
     "node_shared_http_parser": "false",
     "node_shared_libuv": "false",
     "node_shared_zlib": "false",
     "node_use_openssl": "true",
     "node_shared_openssl": "false",
     "target_arch": "x64",
     "v8_use_snapshot": 1
   }
}
```

## `process.connected`

* Type: {boolean}

Node.js process ကို IPC channel တစ်ခုနဲ့အတူ spawn လုပ်ထားခဲ့ရင် (အသေးစိတ်ကို [Child Process][] နဲ့ [Cluster][] documentation တွေမှာ ကြည့်ပါ) — IPC channel က ချိတ်ဆက်ထားသရွေ့ `process.connected` property က `true` ကို ပြန်ပေးပြီး — `process.disconnect()` ကို ခေါ်ပြီးနောက်မှာတော့ `false` ကို ပြန်ပေးပါလိမ့်မယ်။

`process.connected` က `false` ဖြစ်သွားတာနဲ့ — `process.send()` ကို သုံးပြီး IPC channel ပေါ်ကနေတစ်ဆင့် messages တွေ ပို့လို့ မရတော့ပါဘူး။

## `process.constrainedMemory()`

* Returns: {number}

OS က သတ်မှတ်ထားတဲ့ limits တွေအပေါ် အခြေခံပြီး — process အတွက် ရရှိနိုင်တဲ့ memory ပမာဏကို (byte နဲ့) ပြန်ပေးပါတယ်။ အဲဒီလို ကန့်သတ်ချက် (constraint) မရှိဘူးဆိုရင် (သို့) ကန့်သတ်ချက်ကို မသိရဘူးဆိုရင် — `0` ကို ပြန်ပေးပါတယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [`uv_get_constrained_memory`][uv_get_constrained_memory] ကို ကြည့်ပါ။

## `process.cpuUsage([previousValue])`

* `previousValue` {Object} `process.cpuUsage()` ကို ခေါ်ခဲ့စဉ်က ရခဲ့တဲ့ return တန်ဖိုး တစ်ခုပါ။
* Returns: {Object}
  * `user` {integer}
  * `system` {integer}

`process.cpuUsage()` method က လက်ရှိ process ရဲ့ user နဲ့ system CPU time အသုံးပြုမှုကို — `user` နဲ့ `system` properties တွေ ပါဝင်တဲ့ object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ် — တန်ဖိုးတွေက microsecond (စက္ကန့်ရဲ့ တစ်သန်းပုံတစ်ပုံ) တန်ဖိုးတွေ ဖြစ်ပါတယ်။ ဒီတန်ဖိုးတွေက user နဲ့ system code တွေမှာ အသီးသီး ကုန်ဆုံးခဲ့တဲ့ အချိန်ကို တိုင်းတာပြီး — CPU cores အများအပြားက ဒီ process အတွက် အလုပ်လုပ်နေရင် — တကယ် ကုန်ဆုံးသွားတဲ့ အချိန် (elapsed time) ထက် ကြီးနေနိုင်ပါတယ်။

`process.cpuUsage()` ဆီကို အရင်က ခေါ်ခဲ့လို့ ရခဲ့တဲ့ ရလဒ်ကို — diff reading (ကွာခြားချက် တန်ဖိုး) ရဖို့အတွက် — function ရဲ့ argument အဖြစ် ပြန်လည် ဖြတ်သန်းပေးနိုင်ပါတယ်။

```mjs
import { cpuUsage } from 'node:process';

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// spin the CPU for 500 milliseconds
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

```cjs
const { cpuUsage } = require('node:process');

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// spin the CPU for 500 milliseconds
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

## `process.cwd()`

* Returns: {string}

`process.cwd()` method က Node.js process ရဲ့ current working directory ကို ပြန်ပေးပါတယ်။

```mjs
import { cwd } from 'node:process';

console.log(`Current directory: ${cwd()}`);
```

```cjs
const { cwd } = require('node:process');

console.log(`Current directory: ${cwd()}`);
```

## `process.debugPort`

* Type: {number}

Node.js debugger ကို ဖွင့်ထားတဲ့အခါ အသုံးပြုတဲ့ port ပါ။

```mjs
import process from 'node:process';

process.debugPort = 5858;
```

```cjs
process.debugPort = 5858;
```

## `process.disconnect()`

Node.js process ကို IPC channel တစ်ခုနဲ့အတူ spawn လုပ်ထားခဲ့ရင် (အသေးစိတ်ကို [Child Process][] နဲ့ [Cluster][] documentation တွေမှာ ကြည့်ပါ) — `process.disconnect()` method က parent process ဆီကို သွားတဲ့ IPC channel ကို ပိတ်ပစ်ပြီး — child process ကို အသက်ဝင်နေစေတဲ့ (keeping it alive) တခြား connections တွေ မရှိတော့တာနဲ့ — ၎င်းက ပုံမှန် အေးဆေးစွာ (gracefully) exit ဖြစ်နိုင်စေပါတယ်။

`process.disconnect()` ကို ခေါ်ခြင်းရဲ့ အကျိုးသက်ရောက်မှုက — parent process ကနေ [`ChildProcess.disconnect()`][] ကို ခေါ်ခြင်းနဲ့ အတူတူပါ။

Node.js process ကို IPC channel တစ်ခုနဲ့ spawn လုပ်ထားခြင်း မရှိခဲ့ဘူးဆိုရင် — `process.disconnect()` က `undefined` ဖြစ်ပါလိမ့်မယ်။

## `process.dlopen(module, filename[, flags])`

* `module` {Object}
* `filename` {string}
* `flags` {os.constants.dlopen} **Default:** `os.constants.dlopen.RTLD_LAZY`

`process.dlopen()` method က shared objects တွေကို dynamically load လုပ်ခွင့် ပြုပါတယ်။ ၎င်းကို အဓိကအားဖြင့် C++ Addons တွေကို load လုပ်ဖို့ `require()` က သုံးပြီး — အထူး အခြေအနေတွေကလွဲလို့ — တိုက်ရိုက် သုံးစွဲဖို့ မသင့်ပါဘူး။ တစ်နည်းပြောရရင် — custom dlopen flags (သို့) ES modules တွေကနေ load လုပ်တာလိုမျိုး တိကျတဲ့ အကြောင်းပြချက်တွေ မရှိဘူးဆိုရင် — `process.dlopen()` ထက် [`require()`][] ကို ဦးစားပေး သုံးသင့်ပါတယ်။

`flags` argument က dlopen ရဲ့ အပြုအမူကို သတ်မှတ်ခွင့် ပြုတဲ့ integer တစ်ခုပါ။ အသေးစိတ်တွေအတွက် [`os.constants.dlopen`][] documentation ကို ကြည့်ပါ။

`process.dlopen()` ကို ခေါ်တဲ့အခါ အရေးကြီးတဲ့ လိုအပ်ချက်တစ်ခုက — `module` instance ကို ဖြတ်သန်းပေးရမှာ ဖြစ်ပါတယ်။ အဲဒီအခါမှာ C++ Addon က export လုပ်ထားတဲ့ functions တွေကို `module.exports` ကနေတစ်ဆင့် ဝင်ရောက်သုံးစွဲနိုင်ပါတယ်။

အောက်က ဥပမာက `foo` function တစ်ခုကို export လုပ်တဲ့ — `local.node` လို့ အမည်ရတဲ့ C++ Addon တစ်ခုကို ဘယ်လို load လုပ်မလဲဆိုတာကို ပြပါတယ်။ `RTLD_NOW` constant ကို ဖြတ်သန်းပေးလိုက်တာကြောင့် — call က ပြန်မလာခင် — symbols တွေ အားလုံးကို load လုပ်ပြီးသား ဖြစ်ပါတယ်။ ဒီဥပမာမှာ constant က ရနိုင်တယ်လို့ ယူဆထားပါတယ်။

```mjs
import { dlopen } from 'node:process';
import { constants } from 'node:os';
import { fileURLToPath } from 'node:url';

const module = { exports: {} };
dlopen(module, fileURLToPath(new URL('local.node', import.meta.url)),
       constants.dlopen.RTLD_NOW);
module.exports.foo();
```

```cjs
const { dlopen } = require('node:process');
const { constants } = require('node:os');
const { join } = require('node:path');

const module = { exports: {} };
dlopen(module, join(__dirname, 'local.node'), constants.dlopen.RTLD_NOW);
module.exports.foo();
```

## `process.emitWarning(warning[, options])`

* `warning` {string|Error} Emit လုပ်ရမယ့် warning ပါ။
* `options` {Object}
  * `type` {string} `warning` က `String` တစ်ခု ဖြစ်နေရင် — `type` က emit လုပ်နေတဲ့ warning ရဲ့ _type_ (အမျိုးအစား) အတွက် သုံးမယ့် အမည်ပါ။ **Default:** `'Warning'`။
  * `code` {string} Emit လုပ်နေတဲ့ warning instance အတွက် ထူးခြားတဲ့ (unique) identifier တစ်ခုပါ။
  * `ctor` {Function} `warning` က `String` တစ်ခု ဖြစ်နေရင် — `ctor` က ထုတ်ပေးလိုက်တဲ့ stack trace ကို ကန့်သတ်ဖို့ သုံးတဲ့ optional function တစ်ခုပါ။ **Default:** `process.emitWarning`။
  * `detail` {string} Error နဲ့အတူ ထည့်သွင်းရမယ့် ထပ်ဆောင်း စာသား (text) ပါ။

`process.emitWarning()` method ကို custom (သို့) application-specific process warnings တွေကို emit လုပ်ဖို့ သုံးနိုင်ပါတယ်။ ဒါတွေကို [`'warning'`][process_warning] event မှာ handler တစ်ခု ထည့်ပြီး နားထောင်နိုင်ပါတယ်။

```mjs
import { emitWarning } from 'node:process';

// Emit a warning with a code and additional detail.
emitWarning('Something happened!', {
  code: 'MY_WARNING',
  detail: 'This is some additional information',
});
// Emits:
// (node:56338) [MY_WARNING] Warning: Something happened!
// This is some additional information
```

```cjs
const { emitWarning } = require('node:process');

// Emit a warning with a code and additional detail.
emitWarning('Something happened!', {
  code: 'MY_WARNING',
  detail: 'This is some additional information',
});
// Emits:
// (node:56338) [MY_WARNING] Warning: Something happened!
// This is some additional information
```

ဒီဥပမာမှာ — `Error` object တစ်ခုကို `process.emitWarning()` က အတွင်းပိုင်းမှာ ထုတ်လုပ်ပြီး — [`'warning'`][process_warning] handler ဆီကို ဖြတ်သန်းပေးပါတယ်။

```mjs
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Something happened!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Stack trace
  console.warn(warning.detail);  // 'This is some additional information'
});
```

```cjs
process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Something happened!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Stack trace
  console.warn(warning.detail);  // 'This is some additional information'
});
```

`warning` ကို `Error` object တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးခဲ့ရင် — `options` argument ကို လျစ်လျူရှုပါတယ်။

## `process.emitWarning(warning[, type[, code]][, ctor])`

* `warning` {string|Error} Emit လုပ်ရမယ့် warning ပါ။
* `type` {string} `warning` က `String` တစ်ခု ဖြစ်နေရင် — `type` က emit လုပ်နေတဲ့ warning ရဲ့ _type_ (အမျိုးအစား) အတွက် သုံးမယ့် အမည်ပါ။ **Default:** `'Warning'`။
* `code` {string} Emit လုပ်နေတဲ့ warning instance အတွက် ထူးခြားတဲ့ (unique) identifier တစ်ခုပါ။
* `ctor` {Function} `warning` က `String` တစ်ခု ဖြစ်နေရင် — `ctor` က ထုတ်ပေးလိုက်တဲ့ stack trace ကို ကန့်သတ်ဖို့ သုံးတဲ့ optional function တစ်ခုပါ။ **Default:** `process.emitWarning`။

`process.emitWarning()` method ကို custom (သို့) application-specific process warnings တွေကို emit လုပ်ဖို့ သုံးနိုင်ပါတယ်။ ဒါတွေကို [`'warning'`][process_warning] event မှာ handler တစ်ခု ထည့်ပြီး နားထောင်နိုင်ပါတယ်။

```mjs
import { emitWarning } from 'node:process';

// Emit a warning using a string.
emitWarning('Something happened!');
// Emits: (node: 56338) Warning: Something happened!
```

```cjs
const { emitWarning } = require('node:process');

// Emit a warning using a string.
emitWarning('Something happened!');
// Emits: (node: 56338) Warning: Something happened!
```

```mjs
import { emitWarning } from 'node:process';

// Emit a warning using a string and a type.
emitWarning('Something Happened!', 'CustomWarning');
// Emits: (node:56338) CustomWarning: Something Happened!
```

```cjs
const { emitWarning } = require('node:process');

// Emit a warning using a string and a type.
emitWarning('Something Happened!', 'CustomWarning');
// Emits: (node:56338) CustomWarning: Something Happened!
```

```mjs
import { emitWarning } from 'node:process';

emitWarning('Something happened!', 'CustomWarning', 'WARN001');
// Emits: (node:56338) [WARN001] CustomWarning: Something happened!
```

```cjs
const { emitWarning } = require('node:process');

process.emitWarning('Something happened!', 'CustomWarning', 'WARN001');
// Emits: (node:56338) [WARN001] CustomWarning: Something happened!
```

အပေါ်က ဥပမာတွေ တစ်ခုချင်းစီမှာ — `Error` object တစ်ခုကို `process.emitWarning()` က အတွင်းပိုင်းမှာ ထုတ်လုပ်ပြီး — [`'warning'`][process_warning] handler ဆီကို ဖြတ်သန်းပေးပါတယ်။

```mjs
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```

```cjs
process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```

`warning` ကို `Error` object တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးခဲ့ရင် — ၎င်းကို ပြုပြင်မွမ်းမံမှု မရှိပဲ (unmodified) `'warning'` event handler ဆီကို ဖြတ်သန်းပေးပါလိမ့်မယ် (ပြီးတော့ optional ဖြစ်တဲ့ `type`, `code` နဲ့ `ctor` arguments တွေကို လျစ်လျူရှုပါလိမ့်မယ်):

```mjs
import { emitWarning } from 'node:process';

// Emit a warning using an Error object.
const myWarning = new Error('Something happened!');
// Use the Error name property to specify the type name
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Emits: (node:56338) [WARN001] CustomWarning: Something happened!
```

```cjs
const { emitWarning } = require('node:process');

// Emit a warning using an Error object.
const myWarning = new Error('Something happened!');
// Use the Error name property to specify the type name
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// Emits: (node:56338) [WARN001] CustomWarning: Something happened!
```

`warning` က string (သို့) `Error` object ကလွဲပြီး တခြားဟာ ဖြစ်နေရင် — `TypeError` တစ်ခုကို throw လုပ်ပါတယ်။

Process warnings တွေက `Error` objects တွေကို သုံးပေမယ့် — process warning ယန္တရားက ပုံမှန် error handling ယန္တရားတွေရဲ့ အစားထိုး တစ်ခု **မဟုတ်ပါဘူး**။

Warning ရဲ့ `type` က `'DeprecationWarning'` ဖြစ်နေရင် အောက်ပါ ထပ်ဆောင်း ကိုင်တွယ်မှုတွေကို အကောင်အထည်ဖော်ပါတယ်:

* `--throw-deprecation` command-line flag ကို သုံးထားရင် — deprecation warning ကို event အဖြစ် emit လုပ်မယ့်အစား — exception တစ်ခုအနေနဲ့ throw လုပ်ပါတယ်။
* `--no-deprecation` command-line flag ကို သုံးထားရင် — deprecation warning ကို ဖိနှိပ် (suppress) လုပ်ပါတယ်။
* `--trace-deprecation` command-line flag ကို သုံးထားရင် — deprecation warning ကို stack trace အပြည့်အစုံနဲ့အတူ `stderr` မှာ print လုပ်ပါတယ်။

### Warnings များ ထပ်တလဲလဲ ဖြစ်ခြင်းကို ရှောင်ကြဉ်ခြင်း (Avoiding duplicate warnings)

အကောင်းဆုံး လုပ်ဆောင်မှု (best practice) အနေနဲ့ — warnings တွေကို process တစ်ခုအတွက် တစ်ကြိမ်တည်းသာ emit လုပ်သင့်ပါတယ်။ အဲဒီလို လုပ်ဖို့ — `emitWarning()` ကို boolean တစ်ခုရဲ့ နောက်မှာ ထားပါ။

```mjs
import { emitWarning } from 'node:process';

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```

```cjs
const { emitWarning } = require('node:process');

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// Emits: (node: 56339) Warning: Only warn once!
emitMyWarning();
// Emits nothing
```

## `process.env`

* Type: {Object}

`process.env` property က user environment ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ environ(7) ကို ကြည့်ပါ။

ဒီ object ရဲ့ ဥပမာတစ်ခုက အောက်မှာ ပြထားပါတယ်:

```json
{
  "TERM": "xterm-256color",
  "SHELL": "/usr/local/bin/bash",
  "USER": "maciej",
  "PATH": "~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin",
  "PWD": "/Users/maciej",
  "EDITOR": "vim",
  "SHLVL": "1",
  "HOME": "/Users/maciej",
  "LOGNAME": "maciej",
  "_": "/usr/local/bin/node"
}
```

ဒီ object ကို ပြုပြင်မွမ်းမံလို့ ရနိုင်ပေမယ့် — အဲဒီလို ပြုပြင်မှုတွေက Node.js process ရဲ့ အပြင်ဘက်မှာ (သို့) (တိုက်ရိုက် တောင်းဆိုထားခြင်း မရှိရင်) တခြား [`Worker`][] threads တွေဆီမှာ ထင်ဟပ်မှာ မဟုတ်ပါဘူး။ တစ်နည်းပြောရရင် — အောက်က ဥပမာက အလုပ်လုပ်မှာ မဟုတ်ပါဘူး:

```bash
node -e 'process.env.foo = "bar"' && echo $foo
```

အောက်ပါကတော့ အလုပ်လုပ်ပါလိမ့်မယ်:

```mjs
import { env } from 'node:process';

env.foo = 'bar';
console.log(env.foo);
```

```cjs
const { env } = require('node:process');

env.foo = 'bar';
console.log(env.foo);
```

`process.env` ပေါ်မှာ property တစ်ခုကို တာဝန်ပေးလိုက်တာက — တန်ဖိုးကို string တစ်ခုအဖြစ် သွယ်ဝိုက်၍ (implicitly) ပြောင်းလဲပေးပါလိမ့်မယ်။ **ဒီအပြုအမူက deprecated (ခေတ်မမီတော့) ဖြစ်ပါတယ်။** Node.js ရဲ့ အနာဂတ် versions တွေမှာ — တန်ဖိုးက string, number (သို့) boolean မဟုတ်ဘူးဆိုရင် — error တစ်ခုကို throw လုပ်နိုင်ပါတယ်။

```mjs
import { env } from 'node:process';

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```

```cjs
const { env } = require('node:process');

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
```

`process.env` ကနေ property တစ်ခုကို ဖျက်ဖို့ `delete` ကို သုံးပါ။

```mjs
import { env } from 'node:process';

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```

```cjs
const { env } = require('node:process');

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
```

Windows operating systems တွေပေါ်မှာ environment variables တွေက case-insensitive (စာလုံးအကြီး/အသေး ခွဲခြားမှု မရှိ) ဖြစ်ပါတယ်။

```mjs
import { env } from 'node:process';

env.TEST = 1;
console.log(env.test);
// => 1
```

```cjs
const { env } = require('node:process');

env.TEST = 1;
console.log(env.test);
// => 1
```

[`Worker`][] instance တစ်ခုကို ဖန်တီးတဲ့အခါ တိုက်ရိုက် သတ်မှတ်ထားခြင်း မရှိရင် — [`Worker`][] thread တစ်ခုချင်းစီမှာ — ၎င်းရဲ့ parent thread ရဲ့ `process.env` (သို့) [`Worker`][] constructor ဆီကို `env` option အဖြစ် သတ်မှတ်ပေးထားတဲ့အရာပေါ် အခြေခံတဲ့ — ကိုယ်ပိုင် `process.env` copy တစ်ခုစီ ရှိပါတယ်။ `process.env` မှာ ပြောင်းလဲမှုတွေက [`Worker`][] threads တွေကြားမှာ မြင်ရမှာ မဟုတ်ပဲ — operating system (သို့) native add-ons တွေဆီမှာ မြင်ရတဲ့ ပြောင်းလဲမှုတွေကို main thread ကသာ လုပ်နိုင်ပါတယ်။ Windows မှာတော့ — [`Worker`][] instance တစ်ခုပေါ်က `process.env` copy က main thread နဲ့ မတူပဲ case-sensitive ပုံစံနဲ့ လည်ပတ်ပါတယ်။

## `process.execArgv`

* Type: {string\[]}

`process.execArgv` property က — Node.js process ကို စတင်လိုက်တဲ့အခါ ဖြတ်သန်းပေးခဲ့တဲ့ Node.js-specific command-line options တွေရဲ့ set ကို ပြန်ပေးပါတယ်။ ဒီ options တွေက [`process.argv`][] property က ပြန်ပေးတဲ့ array ထဲမှာ ပေါ်မလာပဲ — Node.js executable, script ရဲ့ အမည် (သို့) script အမည် နောက်မှာ ပါတဲ့ options တွေ မပါဝင်ပါဘူး။ ဒီ options တွေက — parent နဲ့ တူညီတဲ့ execution environment နဲ့ child processes တွေကို spawn လုပ်ဖို့အတွက် အသုံးဝင်ပါတယ်။

```bash
node --icu-data-dir=./foo --require ./bar.js script.js --version
```

ရလဒ်က `process.execArgv` ထဲမှာ ဒီလို ဖြစ်ပါတယ်:

```json
["--icu-data-dir=./foo", "--require", "./bar.js"]
```

ပြီးတော့ `process.argv` ကတော့:

```json
["/usr/local/bin/node", "script.js", "--version"]
```

ဒီ property နဲ့ပတ်သက်ပြီး worker threads တွေရဲ့ အသေးစိတ် အပြုအမူအတွက် [`Worker` constructor][] ကို ရည်ညွှန်း ကြည့်ပါ။

## `process.execPath`

* Type: {string}

`process.execPath` property က Node.js process ကို စတင်ခဲ့တဲ့ executable ရဲ့ absolute pathname ကို ပြန်ပေးပါတယ်။ Symbolic links တွေ ရှိခဲ့ရင် — ၎င်းတို့ကို resolve လုပ်ထားပါတယ်။

```json
"/usr/local/bin/node"
```
## `process.execve(file[, args[, env]])`

> Stability: 1 - Experimental

* `file` {string} Run လုပ်ရမယ့် executable file ရဲ့ အမည် သို့မဟုတ် path ပါ။
* `args` {string\[]} String arguments တွေရဲ့ စာရင်းပါ။ Argument တစ်ခုမှ null-byte (`\u0000`) ပါဝင်လို့ မရပါဘူး။
* `env` {Object} Environment key-value pairs များပါ။
  Key ရော value ရော null-byte (`\u0000`) ပါဝင်လို့ မရပါဘူး။
  **Default:** `process.env`.

လက်ရှိ process ကို process အသစ်တစ်ခုနဲ့ အစားထိုးပါတယ်။

ဒါကို `execve` POSIX function ကို သုံးပြီး ဆောင်ရွက်တာမို့ — standard input, standard output နဲ့ standard error file descriptor တွေကလွဲလို့ — လက်ရှိ process ရဲ့ memory (သို့) အခြား resources တွေ ဘာမျှ ထိန်းသိမ်းထားမှာ မဟုတ်ပါဘူး။

အောင်မြင်သွားတဲ့အခါ — processes တွေ လဲလှယ်ခံရတဲ့အချိန်မှာ — exit (သို့) close events တွေကို trigger လုပ်ခြင်း မရှိပဲ၊ JavaScript cleanup handler တစ်ခုခု (ဥပမာ `process.on('exit')`) ကို run လုပ်ခြင်း မရှိပဲ၊ ပြီးတော့ embedder API ကနေတစ်ဆင့် register လုပ်ထားတဲ့ native `AtExit` callbacks တွေကို ခေါ်ယူခြင်း မရှိပဲ — အခြား resources တွေ အားလုံးကို system က စွန့်ပစ်လိုက်ပါတယ်။ Cleanup logic တွေ run လုပ်ဖို့ လိုအပ်တဲ့ callers တွေက `process.execve()` ကို မခေါ်ခင် အဲဒီလို လုပ်ဆောင်ထားသင့်ပါတယ်။

ဒီ function က အောင်မြင်တဲ့အခါ ဘာမှ ပြန်မပေးပါဘူး။ အကယ်၍ underlying `execve(2)` system call က မအောင်မြင်ခဲ့ရင် — `file` မရှိတဲ့အခါ `'ENOENT'` လိုမျိုး — သက်ဆိုင်ရာ `errno` string ကို `code` property အဖြစ် သတ်မှတ်ထားတဲ့ `Error` တစ်ခုကို throw လုပ်ပြီး — `syscall` ကို `'execve'` အဖြစ်၊ `path` ကို `file` အဖြစ် သတ်မှတ်ပါတယ်။ `execve(2)` မအောင်မြင်တဲ့အခါ လက်ရှိ process က ၎င်းရဲ့ state မပြောင်းလဲပဲ ဆက်လက် run နေပါသေးတယ် — ဒါကြောင့် caller တစ်ယောက်က error ကို ကိုင်တွယ်ပြီး အခြားလုပ်ဆောင်ချက်တစ်ခုကို လုပ်ဆောင်နိုင်ပါတယ်။

ဒီ function က Windows သို့မဟုတ် IBM i မှာ မရနိုင်ပါဘူး။

## `process.exit([code])`

* `code` {integer|string|null|undefined} Exit code ပါ။ String type အတွက်ဆိုရင် integer strings (ဥပမာ — '1') တွေကိုသာ ခွင့်ပြုပါတယ်။ **Default:** `0`.

`process.exit()` method က — `code` ဆိုတဲ့ exit status တစ်ခုနဲ့ — process ကို synchronously terminate လုပ်ဖို့ Node.js ကို ညွှန်ကြားပါတယ်။ `code` ကို ချန်လှပ်ထားခဲ့ရင် — exit က 'success' code `0` ကို ဖြစ်စေ၊ `process.exitCode` သတ်မှတ်ထားပြီးသား ရှိရင် အဲဒီတန်ဖိုးကို ဖြစ်စေ သုံးပါတယ်။ [`'exit'`][] event listeners တွေ အားလုံး ခေါ်ယူခံရတဲ့အထိ Node.js က terminate လုပ်မှာ မဟုတ်ပါဘူး။

'failure' code တစ်ခုနဲ့ exit လုပ်ဖို့:

```mjs
import { exit } from 'node:process';

exit(1);
```

```cjs
const { exit } = require('node:process');

exit(1);
```

Node.js ကို execute လုပ်ခဲ့တဲ့ shell က exit code ကို `1` အနေနဲ့ မြင်ရပါလိမ့်မယ်။

`process.exit()` ကို ခေါ်လိုက်တာက — `process.stdout` နဲ့ `process.stderr` ဆီကို I/O operations တွေ အပါအဝင် — အပြည့်အဝ မပြီးမြောက်သေးတဲ့ asynchronous operations တွေ ဆိုင်းငံ့ (pending) ဖြစ်နေသေးရင်တောင် — process ကို တတ်နိုင်သမျှ မြန်မြန် exit ဖြစ်စေဖို့ တွန်းအားပေးပါလိမ့်မယ်။

အခြေအနေ အများစုမှာ `process.exit()` ကို တိုက်ရိုက် (explicitly) ခေါ်ဖို့ တကယ်တော့ မလိုအပ်ပါဘူး။ Event loop ထဲမှာ _ထပ်ဆောင်း ဆိုင်းငံ့ထားတဲ့ အလုပ်တွေ မရှိဘူးဆိုရင်_ — Node.js process က ၎င်းဘာသာ exit ဖြစ်သွားပါလိမ့်မယ်။ `process.exitCode` property ကို — process က အေးဆေးစွာ (gracefully) exit ဖြစ်တဲ့အခါ ဘယ် exit code ကို သုံးရမလဲဆိုတာ process ကို ပြောပြဖို့ — သတ်မှတ်ပေးနိုင်ပါတယ်။

ဥပမာ — အောက်က ဥပမာက stdout မှာ print လုပ်လိုက်တဲ့ data တွေ ဖြတ်တောက်ခံရပြီး ပျောက်ဆုံးသွားစေနိုင်တဲ့ — `process.exit()` method ရဲ့ _မှားယွင်းတဲ့ အသုံးပြုမှု_ (misuse) တစ်ခုကို သရုပ်ပြပါတယ်:

```mjs
import { exit } from 'node:process';

// This is an example of what *not* to do:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

```cjs
const { exit } = require('node:process');

// This is an example of what *not* to do:
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```

ဒါက ပြဿနာ ဖြစ်ရတဲ့ အကြောင်းရင်းက — Node.js မှာ `process.stdout` ဆီကို ရေးသားမှုတွေက တစ်ခါတစ်ရံ _asynchronous_ ဖြစ်ပြီး — Node.js event loop ရဲ့ ticks အများအပြားပေါ်မှာ ဖြစ်ပွားနိုင်လို့ပါ။ ဒါပေမယ့် `process.exit()` ကို ခေါ်လိုက်တာက — `stdout` ဆီကို အဲဒီ ထပ်ဆောင်း ရေးသားမှုတွေ မလုပ်ဆောင်နိုင်ခင် — process ကို exit ဖြစ်စေဖို့ တွန်းအားပေးလိုက်ပါတယ်။

`process.exit()` ကို တိုက်ရိုက် ခေါ်မယ့်အစား — code က `process.exitCode` ကို သတ်မှတ်ပြီး — event loop အတွက် ထပ်ဆောင်း အလုပ်တွေ schedule လုပ်တာကို ရှောင်ကြဉ်ခြင်းအားဖြင့် — process ကို သဘာဝအတိုင်း exit ဖြစ်စေဖို့ _သင့်_ပါတယ်:

```mjs
import process from 'node:process';

// How to properly set the exit code while letting
// the process exit gracefully.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

```cjs
// How to properly set the exit code while letting
// the process exit gracefully.
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```

Error အခြေအနေတစ်ခုကြောင့် Node.js process ကို terminate လုပ်ဖို့ လိုအပ်ရင် — `process.exit()` ကို ခေါ်တာထက် — _uncaught_ (ဖမ်းယူမရတဲ့) error တစ်ခုကို throw ပြီး process ကို လိုက်လျောညီထွေစွာ terminate ဖြစ်စေတာက ပိုလုံခြုံပါတယ်။

[`Worker`][] threads တွေမှာ ဒီ function က လက်ရှိ process မဟုတ်ပဲ လက်ရှိ thread ကို ရပ်တန့်စေပါတယ်။

## `process.exitCode`

* Type: {integer|string|null|undefined} Exit code ပါ။ String type အတွက်ဆိုရင် integer strings (ဥပမာ — '1') တွေကိုသာ ခွင့်ပြုပါတယ်။ **Default:** `undefined`.

Process က အေးဆေးစွာ exit ဖြစ်တဲ့အခါ (သို့) code တစ်ခု မသတ်မှတ်ပဲ [`process.exit()`][] ကနေတစ်ဆင့် exit လုပ်ခံရတဲ့အခါ — process ရဲ့ exit code ဖြစ်လာမယ့် ဂဏန်းတစ်ခုပါ။

`process.exitCode` ရဲ့ တန်ဖိုးကို — `process.exitCode` ဆီကို တန်ဖိုးတစ်ခု assign လုပ်ခြင်း (သို့) [`process.exit()`][] ဆီကို argument တစ်ခု ဖြတ်သန်းပေးခြင်းအားဖြင့် — နည်းလမ်းနှစ်မျိုးလုံးနဲ့ update လုပ်နိုင်ပါတယ်:

```console
$ node -e 'process.exitCode = 9'; echo $?
9
$ node -e 'process.exit(42)'; echo $?
42
$ node -e 'process.exitCode = 9; process.exit(42)'; echo $?
42
```

ပြန်လည် ကောင်းမွန်အောင် မလုပ်နိုင်တဲ့ (unrecoverable) errors တွေ ဖြစ်ပွားတဲ့အခါ (ဥပမာ — ဖြေရှင်းမရတဲ့ (unsettled) top-level await တစ်ခုကို ကြုံတွေ့တာမျိုး) — တန်ဖိုးကို Node.js က သွယ်ဝိုက်၍ (implicitly) လည်း သတ်မှတ်ပေးနိုင်ပါတယ်။ ဒါပေမယ့် exit code ကို တိုက်ရိုက် (explicitly) ပြုပြင်မှုတွေက implicit တွေထက် အမြဲတမ်း ဦးစားပေး ရရှိပါတယ်:

```console
$ node --input-type=module -e 'await new Promise(() => {})'; echo $?
13
$ node --input-type=module -e 'process.exitCode = 9; await new Promise(() => {})'; echo $?
9
```

## `process.features.cached_builtins`

* Type: {boolean}

လက်ရှိ Node.js build က builtin modules တွေကို caching (ကြားခံ သိမ်းဆည်းခြင်း) လုပ်နေတယ်ဆိုရင် `true` ဖြစ်တဲ့ boolean တန်ဖိုးတစ်ခုပါ။

## `process.features.debug`

* Type: {boolean}

လက်ရှိ Node.js build က debug build တစ်ခု ဖြစ်နေရင် `true` ဖြစ်တဲ့ boolean တန်ဖိုးတစ်ခုပါ။

## `process.features.inspector`

* Type: {boolean}

လက်ရှိ Node.js build မှာ inspector ပါဝင်နေရင် `true` ဖြစ်တဲ့ boolean တန်ဖိုးတစ်ခုပါ။

## `process.features.ipv6`

> Stability: 0 - Deprecated. This property is always true, and any checks based on it are
> redundant.

* Type: {boolean}

လက်ရှိ Node.js build မှာ IPv6 အတွက် support ပါဝင်နေရင် `true` ဖြစ်တဲ့ boolean တန်ဖိုးတစ်ခုပါ။

Node.js builds တွေ အားလုံးမှာ IPv6 support ရှိတာမို့ — ဒီတန်ဖိုးက အမြဲတမ်း `true` ပါ။

## `process.features.require_module`

* Type: {boolean}

လက်ရှိ Node.js build က [loading ECMAScript modules using `require()`][] (require() ကို သုံးပြီး ECMAScript modules တွေကို ဝန်ဆွဲတင်ခြင်း) ကို support လုပ်နေရင် `true` ဖြစ်တဲ့ boolean တန်ဖိုးတစ်ခုပါ။

## `process.features.tls`

* Type: {boolean}

လက်ရှိ Node.js build မှာ TLS အတွက် support ပါဝင်နေရင် `true` ဖြစ်တဲ့ boolean တန်ဖိုးတစ်ခုပါ။

## `process.features.tls_alpn`

> Stability: 0 - Deprecated. Use `process.features.tls` instead.

* Type: {boolean}

လက်ရှိ Node.js build မှာ TLS အတွင်းက ALPN အတွက် support ပါဝင်နေရင် `true` ဖြစ်တဲ့ boolean တန်ဖိုးတစ်ခုပါ။

Node.js 11.0.0 နဲ့ ၎င်းနောက်ပိုင်း versions တွေမှာ OpenSSL dependencies တွေက ခြွင်းချက်မရှိ ALPN support ကို ပံ့ပိုးပေးပါတယ်။ ဒါကြောင့် ဒီတန်ဖိုးက `process.features.tls` ရဲ့ တန်ဖိုးနဲ့ အတူတူပါ။

## `process.features.tls_ocsp`

> Stability: 0 - Deprecated. Use `process.features.tls` instead.

* Type: {boolean}

လက်ရှိ Node.js build မှာ TLS အတွင်းက OCSP အတွက် support ပါဝင်နေရင် `true` ဖြစ်တဲ့ boolean တန်ဖိုးတစ်ခုပါ။

Node.js 11.0.0 နဲ့ ၎င်းနောက်ပိုင်း versions တွေမှာ OpenSSL dependencies တွေက ခြွင်းချက်မရှိ OCSP support ကို ပံ့ပိုးပေးပါတယ်။ ဒါကြောင့် ဒီတန်ဖိုးက `process.features.tls` ရဲ့ တန်ဖိုးနဲ့ အတူတူပါ။

## `process.features.tls_sni`

> Stability: 0 - Deprecated. Use `process.features.tls` instead.

* Type: {boolean}

လက်ရှိ Node.js build မှာ TLS အတွင်းက SNI အတွက် support ပါဝင်နေရင် `true` ဖြစ်တဲ့ boolean တန်ဖိုးတစ်ခုပါ။

Node.js 11.0.0 နဲ့ ၎င်းနောက်ပိုင်း versions တွေမှာ OpenSSL dependencies တွေက ခြွင်းချက်မရှိ SNI support ကို ပံ့ပိုးပေးပါတယ်။ ဒါကြောင့် ဒီတန်ဖိုးက `process.features.tls` ရဲ့ တန်ဖိုးနဲ့ အတူတူပါ။

## `process.features.typescript`

> Stability: 1.2 - Release candidate

* Type: {boolean|string}

Default အနေနဲ့ `"strip"` ဖြစ်ပြီး — Node.js ကို `--no-strip-types` နဲ့ run လုပ်ထားရင် `false` ဖြစ်တဲ့ တန်ဖိုးတစ်ခုပါ။

## `process.features.uv`

> Stability: 0 - Deprecated. This property is always true, and any checks based on it are
> redundant.

* Type: {boolean}

လက်ရှိ Node.js build မှာ libuv အတွက် support ပါဝင်နေရင် `true` ဖြစ်တဲ့ boolean တန်ဖိုးတစ်ခုပါ။

Node.js ကို libuv မပါပဲ build လုပ်ဖို့ မဖြစ်နိုင်တာမို့ — ဒီတန်ဖိုးက အမြဲတမ်း `true` ပါ။

## `process.finalization.register(ref, callback)`

> Stability: 1.1 - Active Development

* `ref` {Object | Function} ခြေရာခံ (track) လုပ်ခံနေရတဲ့ resource ဆီကို ညွှန်ပြတဲ့ reference ပါ။
* `callback` {Function} Resource ကို finalize လုပ်တဲ့အခါ ခေါ်ယူရမယ့် callback function ပါ။
  * `ref` {Object | Function} ခြေရာခံ လုပ်ခံနေရတဲ့ resource ဆီကို ညွှန်ပြတဲ့ reference ပါ။
  * `event` {string} Finalization ကို trigger လုပ်ခဲ့တဲ့ event ပါ။ Default က 'exit' ဖြစ်ပါတယ်။

ဒီ function က — process က `exit` event ကို emit လုပ်တဲ့အခါ — `ref` object က garbage collected မဖြစ်ခဲ့ဘူးဆိုရင် — ခေါ်ယူရမယ့် callback တစ်ခုကို register လုပ်ပေးပါတယ်။ `ref` object က `exit` event ကို emit မလုပ်ခင် garbage collected ဖြစ်သွားခဲ့ရင် — callback ကို finalization registry ကနေ ဖယ်ရှားလိုက်ပြီး — process exit မှာ ခေါ်ယူတော့မှာ မဟုတ်ပါဘူး။

Callback ရဲ့ အတွင်းမှာ `ref` object က ခွဲဝေပေးထားတဲ့ (allocated) resources တွေကို လွှတ်ပေးနိုင်ပါတယ်။ `beforeExit` event မှာ သက်ရောက်မှု ရှိတဲ့ ကန့်သတ်ချက်တွေ အားလုံးက `callback` function မှာလည်း သက်ရောက်မှု ရှိတယ်ဆိုတာ သတိပြုပါ — ဆိုလိုတာက အထူး အခြေအနေတွေမှာ callback ကို မခေါ်ယူဖြစ်တော့တဲ့ ဖြစ်နိုင်ခြေတစ်ခု ရှိပါတယ်။

ဒီ function ရဲ့ ရည်ရွယ်ချက်က — process က exit စတင်လာတဲ့အခါ resources တွေကို လွှတ်ပေးဖို့ ကူညီပေးဖို့ ဖြစ်ပြီး — object ကို နောက်ထပ် အသုံးမပြုတော့ဘူးဆိုရင် garbage collected ဖြစ်ခွင့်လည်း ပြုပေးဖို့ ဖြစ်ပါတယ်။

ဥပမာ: buffer တစ်ခု ပါဝင်တဲ့ object တစ်ခုကို register လုပ်ထားတယ်ဆိုပါစို့ — process exit ဖြစ်တဲ့အခါ အဲဒီ buffer ကို လွှတ်ပေးပြီးသား ဖြစ်အောင် သေချာစေချင်တယ်၊ ဒါပေမယ့် object က process exit မဖြစ်ခင် garbage collected ဖြစ်သွားခဲ့ရင်တော့ buffer ကို လွှတ်ပေးစရာ မလိုတော့ပါဘူး — အဲဒီလို အခြေအနေမျိုးမှာ ဒီ callback ကို finalization registry ကနေ ဖယ်ရှားလိုက်ရုံပါပဲ။

```cjs
const { finalization } = require('node:process');

// Please make sure that the function passed to finalization.register()
// does not create a closure around unnecessary objects.
function onFinalize(obj, event) {
  // You can do whatever you want with the object
  obj.dispose();
}

function setup() {
  // This object can be safely garbage collected,
  // and the resulting shutdown function will not be called.
  // There are no leaks.
  const myDisposableObject = {
    dispose() {
      // Free your resources synchronously
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

```mjs
import { finalization } from 'node:process';

// Please make sure that the function passed to finalization.register()
// does not create a closure around unnecessary objects.
function onFinalize(obj, event) {
  // You can do whatever you want with the object
  obj.dispose();
}

function setup() {
  // This object can be safely garbage collected,
  // and the resulting shutdown function will not be called.
  // There are no leaks.
  const myDisposableObject = {
    dispose() {
      // Free your resources synchronously
    },
  };

  finalization.register(myDisposableObject, onFinalize);
}

setup();
```

အပေါ်က code က အောက်ပါ ယူဆချက်တွေပေါ်မှာ မှီခိုနေပါတယ်:

* arrow functions တွေကို ရှောင်ကြဉ်ထားပါတယ်
* regular functions တွေကို global context (root) အတွင်းမှာ ရှိစေဖို့ အကြံပြုထားပါတယ်

Regular functions တွေက `obj` နေထိုင်တဲ့ context ကို ရည်ညွှန်းမိနိုင်တာမို့ — `obj` ကို garbage collectible မဖြစ်အောင် လုပ်နိုင်ပါတယ်။

Arrow functions တွေကတော့ ယခင် context ကို ဆက်လက် ကိုင်ထားပါလိမ့်မယ်။ ဥပမာ — သုံးသပ်ကြည့်ပါ:

```js
class Test {
  constructor() {
    finalization.register(this, (ref) => ref.dispose());

    // Even something like this is highly discouraged
    // finalization.register(this, () => this.dispose());
  }
  dispose() {}
}
```

ဒီ object က garbage collected ဖြစ်ဖို့က အလွန် မဖြစ်နိုင်လောက်ပါဘူး (မဖြစ်နိုင်တာ မဟုတ်ပါဘူး) — ဒါပေမယ့် မဖြစ်ခဲ့ဘူးဆိုရင် — `process.exit` ကို ခေါ်တဲ့အခါ `dispose` ကို ခေါ်ယူပါလိမ့်မယ်။

အရေးကြီးတဲ့ (critical) resources တွေကို စွန့်လွှတ်ဖို့အတွက် ဒီ feature ကို အားကိုးတာကို ရှောင်ကြဉ်ပြီး သတိထားပါ — အခြေအနေ အားလုံးမှာ callback ကို ခေါ်ယူပါလိမ့်မယ်လို့ အာမခံချက် မရှိလို့ပါ။

## `process.finalization.registerBeforeExit(ref, callback)`

> Stability: 1.1 - Active Development

* `ref` {Object | Function} ခြေရာခံ လုပ်ခံနေရတဲ့
  resource ဆီကို ညွှန်ပြတဲ့ reference ပါ။
* `callback` {Function} Resource ကို finalize လုပ်တဲ့အခါ ခေါ်ယူရမယ့် callback function ပါ။
  * `ref` {Object | Function} ခြေရာခံ လုပ်ခံနေရတဲ့ resource ဆီကို ညွှန်ပြတဲ့ reference ပါ။
  * `event` {string} Finalization ကို trigger လုပ်ခဲ့တဲ့ event ပါ။ Default က 'beforeExit' ဖြစ်ပါတယ်။

ဒီ function က `register` နဲ့ အတိအကျ တူညီစွာ ပြုမူပါတယ် — ကွာတာက — `ref` object က garbage collected မဖြစ်ခဲ့ဘူးဆိုရင် — process က `beforeExit` event ကို emit လုပ်တဲ့အခါ callback ကို ခေါ်ယူမှာ ဖြစ်ပါတယ်။

`beforeExit` event မှာ သက်ရောက်မှု ရှိတဲ့ ကန့်သတ်ချက်တွေ အားလုံးက `callback` function မှာလည်း သက်ရောက်မှု ရှိတယ်ဆိုတာ သတိပြုပါ — ဆိုလိုတာက အထူး အခြေအနေတွေမှာ callback ကို မခေါ်ယူဖြစ်တော့တဲ့ ဖြစ်နိုင်ခြေတစ်ခု ရှိပါတယ်။

## `process.finalization.unregister(ref)`

> Stability: 1.1 - Active Development

* `ref` {Object | Function} အရင်က register လုပ်ခဲ့တဲ့
  resource ဆီကို ညွှန်ပြတဲ့ reference ပါ။

ဒီ function က object ရဲ့ registration ကို finalization registry ကနေ ဖယ်ရှားလိုက်လို့ — callback ကို နောက်ထပ် ခေါ်ယူတော့မှာ မဟုတ်ပါဘူး။

```cjs
const { finalization } = require('node:process');

// Please make sure that the function passed to finalization.register()
// does not create a closure around unnecessary objects.
function onFinalize(obj, event) {
  // You can do whatever you want with the object
  obj.dispose();
}

function setup() {
  // This object can be safely garbage collected,
  // and the resulting shutdown function will not be called.
  // There are no leaks.
  const myDisposableObject = {
    dispose() {
      // Free your resources synchronously
    },
  };

  finalization.register(myDisposableObject, onFinalize);

  // Do something

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

```mjs
import { finalization } from 'node:process';

// Please make sure that the function passed to finalization.register()
// does not create a closure around unnecessary objects.
function onFinalize(obj, event) {
  // You can do whatever you want with the object
  obj.dispose();
}

function setup() {
  // This object can be safely garbage collected,
  // and the resulting shutdown function will not be called.
  // There are no leaks.
  const myDisposableObject = {
    dispose() {
      // Free your resources synchronously
    },
  };

  // Please make sure that the function passed to finalization.register()
  // does not create a closure around unnecessary objects.
  function onFinalize(obj, event) {
    // You can do whatever you want with the object
    obj.dispose();
  }

  finalization.register(myDisposableObject, onFinalize);

  // Do something

  myDisposableObject.dispose();
  finalization.unregister(myDisposableObject);
}

setup();
```

## `process.getActiveResourcesInfo()`

* Returns: {string\[]}

`process.getActiveResourcesInfo()` method က — လက်ရှိ event loop ကို အသက်ဝင်နေအောင် (alive) ထိန်းသိမ်းထားတဲ့ — active resources တွေရဲ့ types တွေ ပါဝင်တဲ့ strings တွေရဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { getActiveResourcesInfo } from 'node:process';
import { setTimeout } from 'node:timers';

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Prints:
//   Before: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

```cjs
const { getActiveResourcesInfo } = require('node:process');
const { setTimeout } = require('node:timers');

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// Prints:
//   Before: [ 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

## `process.getBuiltinModule(id)`

* `id` {string} တောင်းဆိုခံနေရတဲ့ built-in module ရဲ့ ID ပါ။
* Returns: {Object|undefined}

`process.getBuiltinModule(id)` က built-in modules တွေကို globally ရရှိနိုင်တဲ့ function တစ်ခုအနေနဲ့ load လုပ်ဖို့ နည်းလမ်းတစ်ခုကို ပေးစွမ်းပါတယ်။ အခြား environments တွေကိုပါ support လုပ်ဖို့ လိုအပ်တဲ့ ES Modules တွေက — Node.js မဟုတ်တဲ့ environment တစ်ခုမှာ `import` က throw လုပ်နိုင်တဲ့ resolution error ကို ကိုင်တွယ်စရာ မလိုပဲ (သို့) — module ကို asynchronous module အဖြစ် ပြောင်းလဲစေတဲ့ ဒါမှမဟုတ် synchronous API တစ်ခုကို asynchronous အဖြစ် ပြောင်းလဲစေတဲ့ — dynamic `import()` ကို သုံးစရာ မလိုပဲ — Node.js မှာ run လုပ်တဲ့အခါ Node.js built-in တစ်ခုကို အခြေအနေအလိုက် (conditionally) load လုပ်ဖို့ ဒါကို သုံးနိုင်ပါတယ်။

```mjs
if (globalThis.process?.getBuiltinModule) {
  // Run in Node.js, use the Node.js fs module.
  const fs = globalThis.process.getBuiltinModule('fs');
  // If `require()` is needed to load user-modules, use createRequire()
  const module = globalThis.process.getBuiltinModule('module');
  const require = module.createRequire(import.meta.url);
  const foo = require('foo');
}
```

`id` က လက်ရှိ Node.js process မှာ ရရှိနိုင်တဲ့ built-in module တစ်ခုကို သတ်မှတ်ပေးရင် — `process.getBuiltinModule(id)` method က သက်ဆိုင်တဲ့ built-in module ကို ပြန်ပေးပါတယ်။ `id` က ဘယ် built-in module နဲ့မှ မကိုက်ညီဘူးဆိုရင် — `undefined` ကို ပြန်ပေးပါတယ်။

`process.getBuiltinModule(id)` က [`module.isBuiltin(id)`][] က အသိအမှတ်ပြုထားတဲ့ built-in module IDs တွေကို လက်ခံပါတယ်။ Built-in modules အချို့ကို `node:` prefix နဲ့သာ load လုပ်ရပါတယ် — [built-in modules with mandatory `node:` prefix][] ကို ကြည့်ပါ။ `process.getBuiltinModule(id)` က ပြန်ပေးတဲ့ references တွေက — users တွေက [`require.cache`][] ကို ပြုပြင်မွမ်းမံလို့ `require(id)` က တခြားဟာတစ်ခုကို ပြန်ပေးနေရင်တောင် — အမြဲတမ်း `id` နဲ့ သက်ဆိုင်တဲ့ built-in module ကိုသာ ညွှန်ပြနေပါလိမ့်မယ်။

## `process.getegid()`

`process.getegid()` method က Node.js process ရဲ့ numerical effective group identity (ကိန်းဂဏန်း သက်ရောက်မှုရှိ group ခွဲခြားမှတ်) ကို ပြန်ပေးပါတယ်။ (getegid(2) ကို ကြည့်ပါ။)

```mjs
import process from 'node:process';

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```

```cjs
if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```

ဒီ function က POSIX platforms တွေမှာသာ ရနိုင်ပါတယ် (ဆိုလိုတာက Windows သို့မဟုတ် Android မဟုတ်ပါဘူး)။

## `process.geteuid()`

* Returns: {Object}

`process.geteuid()` method က process ရဲ့ numerical effective user identity (ကိန်းဂဏန်း သက်ရောက်မှုရှိ user ခွဲခြားမှတ်) ကို ပြန်ပေးပါတယ်။ (geteuid(2) ကို ကြည့်ပါ။)

```mjs
import process from 'node:process';

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```

```cjs
if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```

ဒီ function က POSIX platforms တွေမှာသာ ရနိုင်ပါတယ် (ဆိုလိုတာက Windows သို့မဟုတ် Android မဟုတ်ပါဘူး)။

## `process.getgid()`

* Returns: {Object}

`process.getgid()` method က process ရဲ့ numerical group identity (ကိန်းဂဏန်း group ခွဲခြားမှတ်) ကို ပြန်ပေးပါတယ်။ (getgid(2) ကို ကြည့်ပါ။)

```mjs
import process from 'node:process';

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```

```cjs
if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```

ဒီ function က POSIX platforms တွေမှာသာ ရနိုင်ပါတယ် (ဆိုလိုတာက Windows သို့မဟုတ် Android မဟုတ်ပါဘူး)။

## `process.getgroups()`

* Returns: {integer\[]}

`process.getgroups()` method က supplementary group IDs တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ Effective group ID ပါဝင်မပါဝင်ဆိုတာကို POSIX က သတ်မှတ်မထားပေမယ့် — Node.js ကတော့ အမြဲတမ်း ပါဝင်စေဖို့ အာမခံပါတယ်။

```mjs
import process from 'node:process';

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```

```cjs
if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```

ဒီ function က POSIX platforms တွေမှာသာ ရနိုင်ပါတယ် (ဆိုလိုတာက Windows သို့မဟုတ် Android မဟုတ်ပါဘူး)။

## `process.getuid()`

* Returns: {integer}

`process.getuid()` method က process ရဲ့ numeric user identity (ကိန်းဂဏန်း user ခွဲခြားမှတ်) ကို ပြန်ပေးပါတယ်။ (getuid(2) ကို ကြည့်ပါ။)

```mjs
import process from 'node:process';

if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
```

```cjs
if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
```

ဒီ function က Windows မှာ မရနိုင်ပါဘူး။

## `process.hasUncaughtExceptionCaptureCallback()`

* Returns: {boolean}

[`process.setUncaughtExceptionCaptureCallback()`][] ကို သုံးပြီး callback တစ်ခု သတ်မှတ်ထားခြင်း ရှိ/မရှိကို ညွှန်ပြပါတယ်။

## `process.hrtime([time])`

> Stability: 3 - Legacy. Use [`process.hrtime.bigint()`][] instead.

* `time` {integer\[]} `process.hrtime()` ဆီကို ယခင် ခေါ်ခဲ့တုန်းက ရလဒ်တစ်ခုပါ
* Returns: {integer\[]}

ဒါက JavaScript မှာ `bigint` ကို မိတ်ဆက်မပေးရသေးခင် ကာလက [`process.hrtime.bigint()`][] ရဲ့ legacy (ခေတ်မမီတော့သော) version ပါ။

`process.hrtime()` method က လက်ရှိ high-resolution real time (ကြည်လင်ပြတ်သားမှု မြင့်မားတဲ့ အစစ်အမှန် အချိန်) ကို `[seconds, nanoseconds]` tuple `Array` တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ် — `nanoseconds` က စက္ကန့် အတိမ်းအကျ (precision) နဲ့ ကိုယ်စားပြုလို့ မရတဲ့ real time ရဲ့ ကျန်ရှိနေတဲ့ အပိုင်းပါ။

`time` က optional parameter တစ်ခု ဖြစ်ပြီး — လက်ရှိ အချိန်နဲ့ နှိုင်းယှဉ်ရန် (diff) — ယခင် `process.hrtime()` call တစ်ခုရဲ့ ရလဒ် ဖြစ်ရပါမယ်။ ဖြတ်သန်းပေးလိုက်တဲ့ parameter က tuple `Array` တစ်ခု မဟုတ်ဘူးဆိုရင် — `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ယခင် `process.hrtime()` call တစ်ခုရဲ့ ရလဒ်အစား — user က သတ်မှတ်ထားတဲ့ array တစ်ခုကို ဖြတ်သန်းပေးလိုက်ရင် — undefined behavior (သတ်မှတ်မထားတဲ့ အပြုအမူ) ကို ဦးတည်သွားပါလိမ့်မယ်။

ဒီ times တွေက အတိတ်ထဲက ကျပန်း (arbitrary) အချိန်တစ်ခုကို မှီငြမ်းထားပြီး — နေ့အချိန်နဲ့ မသက်ဆိုင်တာမို့ — clock drift (နာရီ ရွေ့လျားမှု) ရဲ့ သက်ရောက်မှုလည်း မရှိပါဘူး။ အဓိက အသုံးက interval တွေကြားက စွမ်းဆောင်ရည်ကို တိုင်းတာဖို့ပါ:

```mjs
import { hrtime } from 'node:process';

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
```

```cjs
const { hrtime } = require('node:process');

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // Benchmark took 1000000552 nanoseconds
}, 1000);
```

## `process.hrtime.bigint()`

* Returns: {bigint}

[`process.hrtime()`][] method ရဲ့ `bigint` version ဖြစ်ပြီး — လက်ရှိ high-resolution real time ကို nanoseconds အနေနဲ့ `bigint` တစ်ခုအဖြစ် ပြန်ပေးပါတယ်။

[`process.hrtime()`][] နဲ့ မတူပဲ — ကွာခြားချက်ကို `bigint` နှစ်ခုကို တိုက်ရိုက် နုတ်ယူခြင်းအားဖြင့် တွက်ချက်လို့ ရတာမို့ — ထပ်ဆောင်း `time` argument တစ်ခုကို support မလုပ်ပါဘူး။

```mjs
import { hrtime } from 'node:process';

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```

```cjs
const { hrtime } = require('node:process');

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // Benchmark took 1154389282 nanoseconds
}, 1000);
```

## `process.initgroups(user, extraGroup)`

* `user` {string|number} User အမည် သို့မဟုတ် numeric identifier ပါ။
* `extraGroup` {string|number} Group အမည် သို့မဟုတ် numeric identifier တစ်ခုပါ။

`process.initgroups()` method က `/etc/group` file ကို ဖတ်ပြီး — user က အဖွဲ့ဝင် ဖြစ်နေတဲ့ groups တွေ အားလုံးကို သုံးကာ — group access list ကို ကနဦး စတင်သတ်မှတ် (initialize) ပေးပါတယ်။ ဒါက privileged operation တစ်ခု ဖြစ်ပြီး — Node.js process မှာ `root` access (သို့) `CAP_SETGID` capability ရှိဖို့ လိုအပ်ပါတယ်။

အခွင့်အရေးတွေကို လျှော့ချတဲ့အခါ သတိထားပါ:

```mjs
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

```cjs
const { getgroups, initgroups, setgid } = require('node:process');

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // switch user
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // drop root gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```

ဒီ function က POSIX platforms တွေမှာသာ ရနိုင်ပါတယ် (ဆိုလိုတာက Windows သို့မဟုတ် Android မဟုတ်ပါဘူး)။
ဒီ feature က [`Worker`][] threads တွေမှာ မရနိုင်ပါဘူး။

## `process.kill(pid[, signal])`

* `pid` {number} Process ID တစ်ခုပါ
* `signal` {string|number} ပို့ပေးရမယ့် signal — string (သို့) number အနေနဲ့ ဖြစ်နိုင်ပါတယ်။ **Default:** `'SIGTERM'`။

`process.kill()` method က `pid` နဲ့ သတ်မှတ်ထားတဲ့ process ဆီကို `signal` ကို ပို့ပေးပါတယ်။

Signal names တွေက `'SIGINT'` (သို့) `'SIGHUP'` လိုမျိုး strings တွေပါ။ နောက်ထပ် အချက်အလက်တွေအတွက် [Signal Events][] နဲ့ kill(2) ကို ကြည့်ပါ။

Target `pid` မရှိဘူးဆိုရင် ဒီ method က error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ အထူး အခြေအနေတစ်ခုအနေနဲ့ — `0` ဆိုတဲ့ signal ကို process တစ်ခု ရှိ/မရှိ စမ်းသပ်ဖို့ သုံးနိုင်ပါတယ်။ Windows platforms တွေမှာတော့ `pid` ကို process group တစ်ခုကို kill လုပ်ဖို့ သုံးရင် error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဒီ function ရဲ့ အမည်က `process.kill()` ဖြစ်ပေမယ့် — တကယ်တော့ ဒါက `kill` system call လိုပဲ — signal ပို့ပေးတဲ့ဟာတစ်ခုသာ ဖြစ်ပါတယ်။ ပို့လိုက်တဲ့ signal က target process ကို kill လုပ်တာကလွဲလို့ တခြားအရာတစ်ခုကို လုပ်ဆောင်စေနိုင်ပါတယ်။

```mjs
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```

```cjs
process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```

Node.js process တစ်ခုက `SIGUSR1` ကို လက်ခံရရှိတဲ့အခါ — Node.js က debugger ကို စတင်ပါလိမ့်မယ်။ [Signal Events][] ကို ကြည့်ပါ။

## `process.loadEnvFile(path)`

* `path` {string | URL | Buffer | undefined}. **Default:** `'./.env'`

`.env` file ကို `process.env` ထဲကို ဝန်ဆွဲတင်ပေးပါတယ်။ `.env` file ထဲမှာ `NODE_OPTIONS` ကို သုံးထားတာက Node.js အပေါ်မှာ ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

```cjs
const { loadEnvFile } = require('node:process');
loadEnvFile();
```

```mjs
import { loadEnvFile } from 'node:process';
loadEnvFile();
```

## `process.mainModule`

> Stability: 0 - Deprecated: Use [`require.main`][] instead.

* Type: {Object}

`process.mainModule` property က [`require.main`][] ကို ပြန်လည် ရယူဖို့ နည်းလမ်းတစ်ခုကို ပေးစွမ်းပါတယ်။ ကွာခြားချက်က — main module က runtime မှာ ပြောင်းလဲသွားခဲ့ရင် — အဲဒီ ပြောင်းလဲမှု မဖြစ်ပွားခင် require လုပ်ခဲ့တဲ့ modules တွေထဲမှာ [`require.main`][] က မူရင်း main module ကိုပဲ ဆက်လက် ရည်ညွှန်းနေနိုင်ပါတယ်။ ယေဘုယျအားဖြင့် — နှစ်ခုလုံးက module တစ်ခုတည်းကိုပဲ ရည်ညွှန်းတယ်လို့ ယူဆလို့ ရပါတယ်။

[`require.main`][] လိုပဲ — entry script မရှိဘူးဆိုရင် — `process.mainModule` က `undefined` ဖြစ်ပါလိမ့်မယ်။

## `process.memoryUsage()`

* Returns: {Object}
  * `rss` {integer}
  * `heapTotal` {integer}
  * `heapUsed` {integer}
  * `external` {integer}
  * `arrayBuffers` {integer}

Node.js process ရဲ့ memory usage ကို bytes အနေနဲ့ ဖော်ပြတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { memoryUsage } from 'node:process';

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

```cjs
const { memoryUsage } = require('node:process');

console.log(memoryUsage());
// Prints:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
```

* `heapTotal` နဲ့ `heapUsed` တွေက V8 ရဲ့ memory usage ကို ရည်ညွှန်းပါတယ်။
* `external` က V8 က စီမံခန့်ခွဲတဲ့ JavaScript objects တွေနဲ့ ချိတ်ဆက်ထားတဲ့ C++ objects တွေရဲ့ memory usage ကို ရည်ညွှန်းပါတယ်။
* `rss` — Resident Set Size — ဆိုတာက process အတွက် main memory device ထဲမှာ နေရာယူထားတဲ့ နေရာ ပမာဏ (စုစုပေါင်း ခွဲဝေထားတဲ့ memory ရဲ့ အစိတ်အပိုင်းတစ်ခု) ဖြစ်ပြီး — C++ နဲ့ JavaScript objects တွေ၊ code တွေ အားလုံး ပါဝင်ပါတယ်။
* `arrayBuffers` က Node.js ရဲ့ [`Buffer`][] တွေ အားလုံး အပါအဝင် — `ArrayBuffer` တွေနဲ့ `SharedArrayBuffer` တွေအတွက် ခွဲဝေပေးထားတဲ့ memory ကို ရည်ညွှန်းပါတယ်။ ဒါက `external` တန်ဖိုးထဲမှာလည်း ပါဝင်ပါတယ်။ Node.js ကို embedded library တစ်ခုအနေနဲ့ သုံးတဲ့အခါ — အဲဒီလို အခြေအနေမျိုးမှာ `ArrayBuffer` တွေအတွက် ခွဲဝေမှုတွေကို ခြေရာခံ မလုပ်နိုင်တာမို့ — ဒီတန်ဖိုးက `0` ဖြစ်နိုင်ပါတယ်။

[`Worker`][] threads တွေကို သုံးတဲ့အခါ — `rss` က process တစ်ခုလုံးအတွက် သက်ဆိုင်တဲ့ တန်ဖိုးတစ်ခု ဖြစ်မှာဖြစ်ပြီး — ကျန်တဲ့ fields တွေကတော့ လက်ရှိ thread ကိုသာ ရည်ညွှန်းပါလိမ့်မယ်။

`process.memoryUsage()` method က — program ရဲ့ memory allocations အပေါ်မူတည်ပြီး နှေးကွေးနိုင်တဲ့ — memory usage အကြောင်း အချက်အလက်တွေ စုဆောင်းဖို့ page တစ်ခုချင်းစီကို iterate (တစ်ခုချင်း ဖြတ်သန်း) လုပ်ပါတယ်။

### Process memoryUsage အကြောင်း မှတ်ချက် (A note on process memoryUsage)

Linux (သို့) glibc ကို အသုံးများတဲ့ တခြား systems တွေမှာ — application တစ်ခုက — glibc `malloc` implementation ကြောင့် ဖြစ်ပေါ်တဲ့ fragmentation (အပိုင်းအစများ ကွဲထွက်မှု) ကြောင့် — `heapTotal` တည်ငြိမ်နေပေမယ့် — `rss` က ဆက်တိုက် ကြီးထွားနေတာ ကြုံရနိုင်ပါတယ်။ စွမ်းဆောင်ရည် ပြဿနာကို ဖြေရှင်းဖို့ အစားထိုး `malloc` implementation တစ်ခုဆီကို ဘယ်လို ပြောင်းလဲရမလဲဆိုတာအတွက် [nodejs/node#21973][] ကို ကြည့်ပါ။

## `process.memoryUsage.rss()`

* Returns: {integer}

`process.memoryUsage.rss()` method က Resident Set Size (RSS) ကို bytes အနေနဲ့ ကိုယ်စားပြုတဲ့ integer တစ်ခုကို ပြန်ပေးပါတယ်။

Resident Set Size ဆိုတာက process အတွက် main memory device ထဲမှာ နေရာယူထားတဲ့ နေရာ ပမာဏ (စုစုပေါင်း ခွဲဝေထားတဲ့ memory ရဲ့ အစိတ်အပိုင်းတစ်ခု) ဖြစ်ပြီး — C++ နဲ့ JavaScript objects တွေ၊ code တွေ အားလုံး ပါဝင်ပါတယ်။

ဒါက `process.memoryUsage()` က ပေးတဲ့ `rss` property နဲ့ တန်ဖိုးတူညီပေမယ့် — `process.memoryUsage.rss()` က ပိုမြန်ပါတယ်။

```mjs
import { memoryUsage } from 'node:process';

console.log(memoryUsage.rss());
// 35655680
```

```cjs
const { memoryUsage } = require('node:process');

console.log(memoryUsage.rss());
// 35655680
```

## `process.nextTick(callback[, ...args])`

> Stability: 3 - Legacy: Use [`queueMicrotask()`][] instead.

* `callback` {Function}
* `...args` {any} `callback` ကို ခေါ်ယူတဲ့အခါ ဖြတ်သန်းပေးရမယ့် ထပ်ဆောင်း arguments တွေပါ

`process.nextTick()` က `callback` ကို "next tick queue" ထဲကို ထည့်ပေးပါတယ်။ ဒီ queue က JavaScript stack ပေါ်က လက်ရှိ operation က အပြည့်အဝ run ပြီးမြောက်ပြီး — event loop ကို ဆက်လက် လုပ်ဆောင်ခွင့် မပြုခင် — အပြည့်အဝ drain လုပ်ပါတယ်။ `process.nextTick()` ကို ထပ်ခါထပ်ခါ (recursively) ခေါ်နေမယ်ဆိုရင် infinite loop (အဆုံးမဲ့ loop) တစ်ခုကို ဖန်တီးမိနိုင်ပါတယ်။ နောက်ထပ် နောက်ခံ အချက်အလက်တွေအတွက် [Event Loop][] guide ကို ကြည့်ပါ။

```mjs
import { nextTick } from 'node:process';

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

```cjs
const { nextTick } = require('node:process');

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// nextTick callback
```

ဒါက APIs တွေ develop လုပ်တဲ့အခါ — users တွေအား — object တစ်ခု တည်ဆောက်ပြီးနောက်၊ I/O တစ်ခုခု မဖြစ်ပွားခင် — event handlers တွေကို တာဝန်ပေးဖို့ အခွင့်အလမ်း ပေးနိုင်တာမို့ အရေးကြီးပါတယ်:

```mjs
import { nextTick } from 'node:process';

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() gets called now, not before.
```

```cjs
const { nextTick } = require('node:process');

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() gets called now, not before.
```

APIs တွေအတွက် 100% synchronous ဖြစ်စေ၊ 100% asynchronous ဖြစ်စေ ဖြစ်ဖို့က အလွန် အရေးကြီးပါတယ်။ ဒီဥပမာကို သုံးသပ်ကြည့်ပါ:

```js
// WARNING!  DO NOT USE!  BAD UNSAFE HAZARD!
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
```

ဒီ API က အန္တရာယ်ရှိပါတယ် — အကြောင်းကတော့ အောက်က အခြေအနေမှာ:

```js
const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
```

`foo()` နဲ့ `bar()` ထဲက ဘယ်ဟာကို အရင် ခေါ်မလဲဆိုတာ ရှင်းရှင်းလင်းလင်း မရှိပါဘူး။

အောက်က ချဉ်းကပ်နည်းကတော့ အများကြီး ပိုကောင်းပါတယ်:

```mjs
import { nextTick } from 'node:process';

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```

```cjs
const { nextTick } = require('node:process');

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
```

### When to use `queueMicrotask()` vs. `process.nextTick()`

[`queueMicrotask()`][] API က `process.nextTick()` ရဲ့ အစားထိုး (alternative) တစ်ခု ဖြစ်ပြီး — "next tick queue" ကို သုံးမယ့်အစား — resolved promises တွေရဲ့ then, catch နဲ့ finally handlers တွေကို execute လုပ်ဖို့ သုံးတဲ့ microtask queue ကိုယ်တိုင်ကိုပဲ သုံးပြီး function တစ်ခုရဲ့ execution ကို ရွှေ့ဆိုင်းပေးပါတယ်။

Node.js အတွင်းမှာ — "next tick queue" ကို drain လုပ်တိုင်း — microtask queue ကို ချက်ချင်း ဆက်၍ drain လုပ်ပါတယ်။

ဒါကြောင့် CJS modules တွေမှာ `process.nextTick()` callbacks တွေက `queueMicrotask()` callbacks တွေထက် အမြဲတမ်း အရင် run ပါတယ်။ ဒါပေမယ့် ESM modules တွေကတော့ microtask queue ရဲ့ အစိတ်အပိုင်းအနေနဲ့ ကိုင်တွယ်ပြီးသား ဖြစ်နေတာမို့ — Node.js က microtask queue ကို drain လုပ်နေတဲ့ ဖြစ်စဉ်ထဲမှာ ရှိနေပြီးသားဆိုတော့ — အဲဒီမှာ `queueMicrotask()` callbacks တွေက `process.nextTick()` callbacks တွေထက် အမြဲတမ်း အရင် execute လုပ်ပါတယ်။

```mjs
import { nextTick } from 'node:process';

Promise.resolve().then(() => console.log('resolve'));
queueMicrotask(() => console.log('microtask'));
nextTick(() => console.log('nextTick'));
// Output:
// resolve
// microtask
// nextTick
```

```cjs
const { nextTick } = require('node:process');

Promise.resolve().then(() => console.log('resolve'));
queueMicrotask(() => console.log('microtask'));
nextTick(() => console.log('nextTick'));
// Output:
// nextTick
// resolve
// microtask
```

Userland use cases အများစုအတွက် — `queueMicrotask()` API က — JavaScript platform environments အများအပြားမှာ အလုပ်လုပ်တဲ့ — portable ဖြစ်ပြီး ယုံကြည်စိတ်ချရတဲ့ execution ရွှေ့ဆိုင်းမှု ယန္တရားတစ်ခုကို ပေးစွမ်းတာမို့ — `process.nextTick()` ထက် ဦးစားပေး သုံးသင့်ပါတယ်။ ရိုးရှင်းတဲ့ အခြေအနေတွေမှာ `queueMicrotask()` က `process.nextTick()` အတွက် drop-in replacement (နေရာတွင် တိုက်ရိုက် အစားထိုး) တစ်ခု ဖြစ်နိုင်ပါတယ်။

```js
console.log('start');
queueMicrotask(() => {
  console.log('microtask callback');
});
console.log('scheduled');
// Output:
// start
// scheduled
// microtask callback
```

ဒီ APIs နှစ်ခုကြားက မှတ်သားလောက်တဲ့ ကွာခြားချက်တစ်ခုက — `process.nextTick()` က — ရွှေ့ဆိုင်းထားတဲ့ function ကို ခေါ်တဲ့အခါ arguments တွေအနေနဲ့ ဖြတ်သန်းပေးမယ့် — ထပ်ဆောင်း တန်ဖိုးတွေကို သတ်မှတ်ခွင့် ပြုပါတယ်။ `queueMicrotask()` နဲ့ အလားတူ ရလဒ်ကို ရဖို့ကတော့ closure တစ်ခု (သို့) bound function တစ်ခုကို သုံးဖို့ လိုအပ်ပါတယ်:

```js
function deferred(a, b) {
  console.log('microtask', a + b);
}

console.log('start');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('scheduled');
// Output:
// start
// scheduled
// microtask 3
```

Next tick queue နဲ့ microtask queue တွေရဲ့ အတွင်းကနေ ထွက်ပေါ်လာတဲ့ errors တွေကို ကိုင်တွယ်တဲ့ နည်းလမ်းမှာ သေးငယ်တဲ့ ကွာခြားချက်တွေ ရှိပါတယ်။ Queue တစ်ခုထဲ ထည့်ထားတဲ့ microtask callback တစ်ခုရဲ့ အတွင်းကနေ throw လုပ်လိုက်တဲ့ errors တွေကို — ဖြစ်နိုင်ရင် အဲဒီ queued callback ရဲ့ အတွင်းမှာတင် ကိုင်တွယ်သင့်ပါတယ်။ မကိုင်တွယ်နိုင်ရင် — `process.on('uncaughtException')` event handler ကို သုံးပြီး errors တွေကို ဖမ်းယူ ကိုင်တွယ်နိုင်ပါတယ်။

သေချာမသေချာ သံသယ ရှိနေရင် — `process.nextTick()` ရဲ့ တိကျတဲ့ စွမ်းဆောင်ရည်တွေ မလိုအပ်ဘူးဆိုရင် — `queueMicrotask()` ကို သုံးပါ။

## `process.noDeprecation`

* Type: {boolean}

`process.noDeprecation` property က လက်ရှိ Node.js process ပေါ်မှာ `--no-deprecation` flag သတ်မှတ်ထားခြင်း ရှိ/မရှိကို ညွှန်ပြပါတယ်။ ဒီ flag ရဲ့ အပြုအမူအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [`'warning'` event][process_warning] နဲ့ [`emitWarning()` method][process_emit_warning] တို့ရဲ့ documentation ကို ကြည့်ပါ။

## `process.permission`

* Type: {Object}

ဒီ API က [`--permission`][] (သို့) [`--permission-audit`][] flags တွေကနေတစ်ဆင့် ရရှိနိုင်ပါတယ်။

`process.permission` က — ၎င်းရဲ့ methods တွေကို လက်ရှိ process အတွက် permissions တွေကို စီမံခန့်ခွဲဖို့ သုံးတဲ့ — object တစ်ခုပါ။ ထပ်ဆောင်း documentation ကို [Permission Model][] မှာ ရရှိနိုင်ပါတယ်။

### `process.permission.has(scope[, reference])`

* `scope` {string}
* `reference` {string}
* Returns: {boolean}

Process က ပေးထားတဲ့ scope နဲ့ reference ကို ဝင်ရောက်နိုင် (access) နိုင်ကြောင်း စစ်ဆေး အတည်ပြုပါတယ်။ Reference ပေးမထားဘူးဆိုရင် — global scope တစ်ခုကို ယူဆပါတယ် — ဥပမာ — `process.permission.has('fs.read')` က process မှာ file system ဖတ်ရှုခြင်း permissions တွေ အားလုံး (ALL) ရှိမရှိကို စစ်ဆေးပါလိမ့်မယ်။

Audit mode ([`--permission-audit`][]) မှာ ဒီ method က တကယ့် permission status ကို ဆက်လက် ပြန်ပေးပါသေးတယ် — ဒါပေမယ့် ငြင်းပယ်ခံရတဲ့ operations တွေက `ERR_ACCESS_DENIED` ကို throw လုပ်တော့မှာ မဟုတ်ပါဘူး။

Reference က ပေးထားတဲ့ scope ပေါ်မူတည်ပြီး အဓိပ္ပာယ် တစ်ခုရှိပါတယ်။ ဥပမာ — scope က File System ဖြစ်တဲ့အခါ reference က files နဲ့ folders တွေကို ဆိုလိုပါတယ်။

ရရှိနိုင်တဲ့ scopes တွေကတော့:

* `fs` - File System တစ်ခုလုံး
* `fs.read` - File System ဖတ်ရှုခြင်း လုပ်ဆောင်မှုများ
* `fs.write` - File System ရေးသားခြင်း လုပ်ဆောင်မှုများ
* `child` - Child process spawn လုပ်ခြင်း လုပ်ဆောင်မှုများ
* `openssl.store` - OpenSSL STORE loaders တွေကနေတစ်ဆင့် keys တွေကို ဝန်ဆွဲတင်ခြင်း
* `worker` - Worker thread spawn လုပ်ခြင်း လုပ်ဆောင်မှု
* `ffi` - Foreign function interface လုပ်ဆောင်မှုများ

```js
// Check if the process has permission to read the README file
process.permission.has('fs.read', './README.md');
// Check if the process has read permission operations
process.permission.has('fs.read');
```

### `process.permission.drop(scope[, reference])`

> Stability: 1.1 - Active Development

* `scope` {string}
* `reference` {string}

လက်ရှိ process ကနေ သတ်မှတ်ထားတဲ့ permission ကို ပယ်ဖျက်ပါတယ်။ ဒီလုပ်ဆောင်မှုက **ပြန်ပြင်၍မရသော** (irreversible) ဖြစ်ပါတယ် — permission တစ်ခု ပယ်ဖျက်လိုက်တာနဲ့ — ဘယ် Node.js API ကနေတစ်ဆင့်မှ ပြန်လည် ပြန်ထားလို့ မရတော့ပါဘူး။

Audit mode ([`--permission-audit`][]) မှာ permission တစ်ခုကို ပယ်ဖျက်တာက အကျိုးသက်ရောက်မှု ရှိပါတယ် — ဒါပေမယ့် ငြင်းပယ်ခံရတဲ့ operations တွေက throw မလုပ်တာမို့ — သက်ရောက်မှုက `permission.has()` ရဲ့ return တန်ဖိုး ပြောင်းလဲခြင်းအထိသာ ကန့်သတ်ပါတယ်။

Reference ပေးမထားဘူးဆိုရင် — scope တစ်ခုလုံးကို ပယ်ဖျက်ပါတယ်။ ဥပမာ — `process.permission.drop('fs.read')` က file system ဖတ်ရှုခြင်း permissions တွေ အားလုံးကို ပြန်ရုပ်သိမ်း (revoke) ပါလိမ့်မယ်။

Reference တစ်ခု ပေးထားတဲ့အခါ — အဲဒီ တိကျတဲ့ resource အတွက် permission ကိုသာ ပယ်ဖျက်ပါတယ်။ ဥပမာ — `process.permission.drop('fs.read', '/etc/myapp')` က အဲဒီ directory ဆီကို ဖတ်ရှုခွင့်ကို ရုပ်သိမ်းပြီး — တခြား ဖတ်ရှုခြင်း permissions တွေကိုတော့ မပျက်မစီး ထိန်းသိမ်းထားပါလိမ့်မယ်။

**အရေးကြီး:** တိုက်ရိုက် (explicitly) ခွင့်ပြုထားခဲ့တဲ့ resource အတိအကျကိုသာ ပယ်ဖျက်နိုင်ပါတယ်။ `drop()` ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ reference က မူရင်း ခွင့်ပြုချက် (grant) နဲ့ ကိုက်ညီရပါမယ်:

* Permission တစ်ခုကို wildcard (`*`) နဲ့ ခွင့်ပြုထားခဲ့ရင် — `--allow-fs-read=*` လိုမျိုးပေါ့ — တစ်ခုချင်းစီသော paths တွေကို ပယ်ဖျက်လို့ မရပါဘူး — scope တစ်ခုလုံးကိုသာ (reference မပါပဲ `drop()` ကို ခေါ်ခြင်းအားဖြင့်) ပယ်ဖျက်နိုင်ပါတယ်။
* Directory တစ်ခုကို ခွင့်ပြုထားခဲ့ရင် (ဥပမာ — `--allow-fs-read=/my/folder`) — ၎င်းရဲ့ အတွင်းက file တစ်ခုချင်းစီဆီကို ဝင်ရောက်ခွင့်ကို ပယ်ဖျက်လို့ မရပါဘူး။ ခွင့်ပြုခဲ့တဲ့ directory ကိုယ်တိုင်ကိုပဲ ပယ်ဖျက်ရပါမယ်။ ကျန်ရှိနေတဲ့ grants တွေ အားလုံးက ဆက်လက် အကျိုးသက်ရောက်နေပါလိမ့်မယ်။

ရရှိနိုင်တဲ့ scopes တွေက [`process.permission.has()`][] နဲ့ အတူတူပါ:

* `fs` - File System တစ်ခုလုံး (ဖတ်ရှုခြင်းရော ရေးသားခြင်းပါ ပယ်ဖျက်ပါတယ်)
* `fs.read` - File System ဖတ်ရှုခြင်း လုပ်ဆောင်မှုများ
* `fs.write` - File System ရေးသားခြင်း လုပ်ဆောင်မှုများ
* `child` - Child process spawn လုပ်ခြင်း လုပ်ဆောင်မှုများ
* `openssl.store` - OpenSSL STORE loaders တွေကနေတစ်ဆင့် keys တွေကို ဝန်ဆွဲတင်ခြင်း
* `worker` - Worker thread spawn လုပ်ခြင်း လုပ်ဆောင်မှု
* `net` - Network လုပ်ဆောင်မှုများ
* `inspector` - Inspector လုပ်ဆောင်မှုများ
* `wasi` - WASI လုပ်ဆောင်မှုများ
* `addon` - Native addon လုပ်ဆောင်မှုများ

```js
const fs = require('node:fs');

// Read configuration during startup
const config = fs.readFileSync('/etc/myapp/config.json', 'utf8');

// Drop read access to the config directory after initialization
process.permission.drop('fs.read', '/etc/myapp');

// This will now throw ERR_ACCESS_DENIED
fs.readFileSync('/etc/myapp/config.json');
```

## `process.pid`

* Type: {integer}

`process.pid` property က process ရဲ့ PID ကို ပြန်ပေးပါတယ်။

```mjs
import { pid } from 'node:process';

console.log(`This process is pid ${pid}`);
```

```cjs
const { pid } = require('node:process');

console.log(`This process is pid ${pid}`);
```

## `process.platform`

* Type: {string}

`process.platform` property က Node.js binary ကို compile လုပ်ထားတဲ့ operating system platform ကို ခွဲခြားဖော်ပြတဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။

လက်ရှိ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့:

* `'aix'`
* `'darwin'`
* `'freebsd'`
* `'linux'`
* `'openbsd'`
* `'sunos'`
* `'win32'`

```mjs
import { platform } from 'node:process';

console.log(`This platform is ${platform}`);
```

```cjs
const { platform } = require('node:process');

console.log(`This platform is ${platform}`);
```

Node.js ကို Android operating system ပေါ်မှာ build လုပ်ထားရင် `'android'` ဆိုတဲ့ တန်ဖိုးလည်း ပြန်ပေးနိုင်ပါတယ်။ ဒါပေမယ့် Node.js မှာ Android support က [is experimental][Android building] ပါ။

## `process.ppid`

* Type: {integer}

`process.ppid` property က လက်ရှိ process ရဲ့ parent ရဲ့ PID ကို ပြန်ပေးပါတယ်။

```mjs
import { ppid } from 'node:process';

console.log(`The parent process is pid ${ppid}`);
```

```cjs
const { ppid } = require('node:process');

console.log(`The parent process is pid ${ppid}`);
```

## `process.ref(maybeRefable)`

> Stability: 1 - Experimental

* `maybeRefable` {any} "refable" ဖြစ်နိုင်တဲ့ object တစ်ခုပါ။

Object တစ်ခုက Node.js ရဲ့ "Refable protocol" ကို implement လုပ်ထားရင် အဲဒီ object က "refable" ဖြစ်ပါတယ်။ အထူးသဖြင့် — object က `Symbol.for('nodejs.ref')` နဲ့ `Symbol.for('nodejs.unref')` methods တွေကို implement လုပ်ထားတာကို ဆိုလိုပါတယ်။ "Ref'd" လုပ်ထားတဲ့ objects တွေက Node.js event loop ကို အသက်ဝင်နေအောင် ထိန်းသိမ်းပေးပြီး — "unref'd" လုပ်ထားတဲ့ objects တွေကတော့ မထိန်းသိမ်းပါဘူး။ သမိုင်းကြောင်းအရတော့ ဒါကို objects တွေပေါ်မှာ `ref()` နဲ့ `unref()` methods တွေကို တိုက်ရိုက် သုံးပြီး implement လုပ်ခဲ့ပါတယ်။ ဒါပေမယ့် ဒီ pattern က — `ref()` နဲ့ `unref()` methods တွေ ထည့်ဖို့ သူတို့ရဲ့ APIs တွေကို ပြုပြင်မွမ်းမံလို့ မရပေမယ့် အဲဒီအပြုအမူကို support လုပ်ဖို့ လိုအပ်နေတဲ့ — Web Platform API types တွေကို ပိုကောင်းမွန်စွာ support လုပ်နိုင်ဖို့ — "Refable protocol" ကို ဦးစားပေးဖို့အတွက် deprecated လုပ်ခံနေရပါတယ်။

## `process.release`

* Type: {Object}

`process.release` property က — source tarball နဲ့ headers-only tarball တွေအတွက် URLs တွေ အပါအဝင် — လက်ရှိ release နဲ့ ပတ်သက်တဲ့ metadata တွေ ပါဝင်တဲ့ `Object` တစ်ခုကို ပြန်ပေးပါတယ်။

`process.release` ထဲမှာ အောက်ပါ properties တွေ ပါဝင်ပါတယ်:

* `name` {string} အမြဲတမ်း `'node'` ဖြစ်မယ့် တန်ဖိုးတစ်ခုပါ။
* `sourceUrl` {string} လက်ရှိ release ရဲ့ source code ပါဝင်တဲ့ _`.tar.gz`_ file တစ်ခုကို ညွှန်ပြတဲ့ absolute URL တစ်ခုပါ။
* `headersUrl`{string} လက်ရှိ release အတွက် source header files တွေကိုသာ ပါဝင်တဲ့ _`.tar.gz`_ file တစ်ခုကို ညွှန်ပြတဲ့ absolute URL တစ်ခုပါ။ ဒီ file က source file အပြည့်အစုံထက် သိသိသာသာ သေးငယ်ပြီး — Node.js native add-ons တွေကို compile လုပ်ဖို့ သုံးနိုင်ပါတယ်။
* `libUrl` {string|undefined} လက်ရှိ release ရဲ့ architecture နဲ့ version နဲ့ ကိုက်ညီတဲ့ _`node.lib`_ file တစ်ခုကို ညွှန်ပြတဲ့ absolute URL တစ်ခုပါ။ ဒီ file ကို Node.js native add-ons တွေ compile လုပ်ဖို့ သုံးပါတယ်။ _ဒီ property က Windows builds တွေပေါ်မှာသာ ရှိပြီး — အခြား platforms တွေ အားလုံးမှာ ပျောက်ဆုံးနေမှာ ဖြစ်ပါတယ်။_
* `lts` {string|undefined} ဒီ release ရဲ့ [LTS][] label ကို ခွဲခြားဖော်ပြတဲ့ string label တစ်ခုပါ။ ဒီ property က LTS releases တွေအတွက်မှာသာ တည်ရှိပြီး — _Current_ releases တွေ အပါအဝင် — အခြား release types တွေ အားလုံးအတွက်တော့ `undefined` ဖြစ်ပါတယ်။ Valid values တွေထဲမှာ LTS Release code names (နောက်ထပ် support မလုပ်တော့တဲ့ဟာတွေ အပါအဝင်) တွေ ပါဝင်ပါတယ်။
  * `'Fermium'` ဆိုတာ 14.15.0 ကစတင်တဲ့ 14.x LTS line အတွက်ပါ။
  * `'Gallium'` ဆိုတာ 16.13.0 ကစတင်တဲ့ 16.x LTS line အတွက်ပါ။
  * `'Hydrogen'` ဆိုတာ 18.12.0 ကစတင်တဲ့ 18.x LTS line အတွက်ပါ။
    အခြား LTS Release code names တွေအတွက်တော့ [Node.js Changelog Archive](https://github.com/nodejs/node/blob/HEAD/doc/changelogs/CHANGELOG_ARCHIVE.md) ကို ကြည့်ပါ။

```json
{
  "name": "node",
  "lts": "Hydrogen",
  "sourceUrl": "https://nodejs.org/download/release/v18.12.0/node-v18.12.0.tar.gz",
  "headersUrl": "https://nodejs.org/download/release/v18.12.0/node-v18.12.0-headers.tar.gz",
  "libUrl": "https://nodejs.org/download/release/v18.12.0/win-x64/node.lib"
}
```

Source tree ရဲ့ non-release versions တွေကနေ ပြုလုပ်ထားတဲ့ custom builds တွေမှာ — `name` property သာလျှင် ပါဝင်နိုင်ပါတယ်။ ထပ်ဆောင်း properties တွေ တည်ရှိနေမယ်လို့ အားကိုးစရာ မလိုပါဘူး။

## `process.report`

* Type: {Object}

`process.report` က — ၎င်းရဲ့ methods တွေကို လက်ရှိ process အတွက် diagnostic reports (ရောဂါရှာဖွေ အစီရင်ခံစာများ) တွေ ထုတ်လုပ်ဖို့ သုံးတဲ့ — object တစ်ခုပါ။ ထပ်ဆောင်း documentation ကို [report documentation][] မှာ ရရှိနိုင်ပါတယ်။

### `process.report.compact`

* Type: {boolean}

Reports တွေကို compact format ဖြစ်တဲ့ single-line JSON အနေနဲ့ ရေးသားပါတယ် — လူတွေ ဖတ်ရှုဖို့ ဒီဇိုင်းထုတ်ထားတဲ့ default multi-line format ထက် log processing systems တွေအတွက် ပိုလွယ်ကူစွာ စားသုံးနိုင်ပါတယ်။

```mjs
import { report } from 'node:process';

console.log(`Reports are compact? ${report.compact}`);
```

```cjs
const { report } = require('node:process');

console.log(`Reports are compact? ${report.compact}`);
```

### `process.report.directory`

* Type: {string}

Report ကို ရေးသားမယ့် directory ပါ။ Default တန်ဖိုးက empty string ဖြစ်ပြီး — reports တွေကို Node.js process ရဲ့ current working directory မှာ ရေးသားတယ်လို့ ဖော်ပြပါတယ်။

```mjs
import { report } from 'node:process';

console.log(`Report directory is ${report.directory}`);
```

```cjs
const { report } = require('node:process');

console.log(`Report directory is ${report.directory}`);
```

### `process.report.filename`

* Type: {string}

Report ကို ရေးသားမယ့် filename ပါ။ Empty string အဖြစ် သတ်မှတ်ထားရင် — output filename က timestamp, PID နဲ့ sequence number တွေနဲ့ ဖွဲ့စည်းထားမှာ ဖြစ်ပါတယ်။ Default တန်ဖိုးက empty string ပါ။

`process.report.filename` ရဲ့ တန်ဖိုးကို `'stdout'` (သို့) `'stderr'` အဖြစ် သတ်မှတ်ထားရင် — report ကို process ရဲ့ stdout (သို့) stderr အသီးသီးဆီကို ရေးသားပါတယ်။

```mjs
import { report } from 'node:process';

console.log(`Report filename is ${report.filename}`);
```

```cjs
const { report } = require('node:process');

console.log(`Report filename is ${report.filename}`);
```

### `process.report.getReport([err])`

* `err` {Error} JavaScript stack ကို အစီရင်ခံဖို့ သုံးတဲ့ custom error တစ်ခုပါ။
* Returns: {Object}

Run လုပ်နေတဲ့ process အတွက် diagnostic report တစ်ခုရဲ့ JavaScript Object ကိုယ်စားပြုမှုကို ပြန်ပေးပါတယ်။ Report ရဲ့ JavaScript stack trace ကို — `err` ရှိနေရင် — ၎င်းကနေ ယူပါတယ်။

```mjs
import { report } from 'node:process';
import util from 'node:util';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Similar to process.report.writeReport()
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

```cjs
const { report } = require('node:process');
const util = require('node:util');

const data = report.getReport();
console.log(data.header.nodejsVersion);

// Similar to process.report.writeReport()
const fs = require('node:fs');
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
```

ထပ်ဆောင်း documentation ကို [report documentation][] မှာ ရရှိနိုင်ပါတယ်။

### `process.report.reportOnFatalError`

* Type: {boolean}

`true` ဆိုရင် — out of memory errors (မှတ်ဉာဏ် လုံလောက်မှု မရှိသော errors) (သို့) မအောင်မြင်တဲ့ C++ assertions တွေလိုမျိုး — fatal errors (ပြင်းထန် ဆိုးရွားသော errors) တွေ ဖြစ်ပွားတဲ့အခါ diagnostic report တစ်ခုကို ထုတ်လုပ်ပါတယ်။

```mjs
import { report } from 'node:process';

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```

```cjs
const { report } = require('node:process');

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
```

### `process.report.reportOnSignal`

* Type: {boolean}

`true` ဆိုရင် — process က `process.report.signal` မှာ သတ်မှတ်ထားတဲ့ signal ကို လက်ခံရရှိတဲ့အခါ diagnostic report တစ်ခုကို ထုတ်လုပ်ပါတယ်။

```mjs
import { report } from 'node:process';

console.log(`Report on signal: ${report.reportOnSignal}`);
```

```cjs
const { report } = require('node:process');

console.log(`Report on signal: ${report.reportOnSignal}`);
```

### `process.report.reportOnUncaughtException`

* Type: {boolean}

`true` ဆိုရင် — uncaught exception (ဖမ်းယူမရတဲ့ exception) ဖြစ်ပွားတဲ့အခါ diagnostic report တစ်ခုကို ထုတ်လုပ်ပါတယ်။

```mjs
import { report } from 'node:process';

console.log(`Report on exception: ${report.reportOnUncaughtException}`);
```

```cjs
const { report } = require('node:process');

console.log(`Report on exception: ${report.reportOnUncaughtException}`);
```

### `process.report.excludeEnv`

* Type: {boolean}

`true` ဆိုရင် — environment variables တွေ မပါဝင်ပဲ diagnostic report တစ်ခုကို ထုတ်လုပ်ပါတယ်။

### `process.report.signal`

* Type: {string}

Diagnostic report တစ်ခုရဲ့ ဖန်တီးမှုကို trigger လုပ်ဖို့ သုံးတဲ့ signal ပါ။ Default က `'SIGUSR2'` ဖြစ်ပါတယ်။

```mjs
import { report } from 'node:process';

console.log(`Report signal: ${report.signal}`);
```

```cjs
const { report } = require('node:process');

console.log(`Report signal: ${report.signal}`);
```

### `process.report.writeReport([filename][, err])`

* `filename` {string} Report ကို ရေးသားမယ့် file ရဲ့ အမည်ပါ။ ဒါက relative path တစ်ခု ဖြစ်သင့်ပြီး — `process.report.directory` မှာ သတ်မှတ်ထားတဲ့ directory ဆီကို ပေါင်းထည့်မှာ ဖြစ်ပါတယ် — သတ်မှတ်မထားရင်တော့ Node.js process ရဲ့ current working directory ကို သုံးပါတယ်။

* `err` {Error} JavaScript stack ကို အစီရင်ခံဖို့ သုံးတဲ့ custom error တစ်ခုပါ။

* Returns: {string} ထုတ်လုပ်လိုက်တဲ့ report ရဲ့ filename ကို ပြန်ပေးပါတယ်။

Diagnostic report တစ်ခုကို file တစ်ခုဆီကို ရေးသားပါတယ်။ `filename` ပေးမထားဘူးဆိုရင် — default filename ထဲမှာ date, time, PID နဲ့ sequence number တစ်ခု ပါဝင်ပါတယ်။ Report ရဲ့ JavaScript stack trace ကို — `err` ရှိနေရင် — ၎င်းကနေ ယူပါတယ်။

`filename` ရဲ့ တန်ဖိုးကို `'stdout'` (သို့) `'stderr'` အဖြစ် သတ်မှတ်ထားရင် — report ကို process ရဲ့ stdout (သို့) stderr အသီးသီးဆီကို ရေးသားပါတယ်။

```mjs
import { report } from 'node:process';

report.writeReport();
```

```cjs
const { report } = require('node:process');

report.writeReport();
```

ထပ်ဆောင်း documentation ကို [report documentation][] မှာ ရရှိနိုင်ပါတယ်။
## `process.resourceUsage()`

* Returns: {Object} လက်ရှိ process ရဲ့ resource usage (အရင်းအမြစ် အသုံးပြုမှု) ပါ။ ဒီတန်ဖိုးတွေ အားလုံးက [`uv_rusage_t` struct][uv_rusage_t] တစ်ခုကို ပြန်ပေးတဲ့ `uv_getrusage` call ကနေ ရရှိလာတာပါ။
  * `userCPUTime` {integer} `ru_utime` ဆီကို map လုပ်ထားပြီး — microsecond တွေနဲ့ တွက်ချက်ပါတယ်။ ၎င်းက [`process.cpuUsage().user`][process.cpuUsage] နဲ့ တန်ဖိုးတူညီပါတယ်။
  * `systemCPUTime` {integer} `ru_stime` ဆီကို map လုပ်ထားပြီး — microsecond တွေနဲ့ တွက်ချက်ပါတယ်။ ၎င်းက [`process.cpuUsage().system`][process.cpuUsage] နဲ့ တန်ဖိုးတူညီပါတယ်။
  * `maxRSS` {integer} `ru_maxrss` ဆီကို map လုပ်ထားပြီး — အဲဒါက kibibytes (1024 bytes) နဲ့ တိုင်းတာတဲ့ maximum resident set size (process က အသုံးပြုထားတဲ့ physical memory ပမာဏ အများဆုံး) ပါ။
  * `sharedMemorySize` {integer} `ru_ixrss` ဆီကို map လုပ်ထားပေမယ့် — platform တစ်ခုမှာမှ support မလုပ်ပါဘူး။
  * `unsharedDataSize` {integer} `ru_idrss` ဆီကို map လုပ်ထားပေမယ့် — platform တစ်ခုမှာမှ support မလုပ်ပါဘူး။
  * `unsharedStackSize` {integer} `ru_isrss` ဆီကို map လုပ်ထားပေမယ့် — platform တစ်ခုမှာမှ support မလုပ်ပါဘူး။
  * `minorPageFault` {integer} `ru_minflt` ဆီကို map လုပ်ထားပြီး — အဲဒါက process အတွက် minor page faults (အသေးစား page fault များ) အရေအတွက်ပါ — [this article for more details][wikipedia_minor_fault] ကို ကြည့်ပါ။
  * `majorPageFault` {integer} `ru_majflt` ဆီကို map လုပ်ထားပြီး — အဲဒါက process အတွက် major page faults (ကြီးမားသော page fault များ) အရေအတွက်ပါ — [this article for more details][wikipedia_major_fault] ကို ကြည့်ပါ။ ဒီ field ကို Windows မှာ support မလုပ်ပါဘူး။
  * `swappedOut` {integer} `ru_nswap` ဆီကို map လုပ်ထားပေမယ့် — platform တစ်ခုမှာမှ support မလုပ်ပါဘူး။
  * `fsRead` {integer} `ru_inblock` ဆီကို map လုပ်ထားပြီး — file system က input လုပ်ဆောင်ခဲ့ရတဲ့ အကြိမ်အရေအတွက်ပါ။
  * `fsWrite` {integer} `ru_oublock` ဆီကို map လုပ်ထားပြီး — file system က output လုပ်ဆောင်ခဲ့ရတဲ့ အကြိမ်အရေအတွက်ပါ။
  * `ipcSent` {integer} `ru_msgsnd` ဆီကို map လုပ်ထားပေမယ့် — platform တစ်ခုမှာမှ support မလုပ်ပါဘူး။
  * `ipcReceived` {integer} `ru_msgrcv` ဆီကို map လုပ်ထားပေမယ့် — platform တစ်ခုမှာမှ support မလုပ်ပါဘူး။
  * `signalsCount` {integer} `ru_nsignals` ဆီကို map လုပ်ထားပေမယ့် — platform တစ်ခုမှာမှ support မလုပ်ပါဘူး။
  * `voluntaryContextSwitches` {integer} `ru_nvcsw` ဆီကို map လုပ်ထားပြီး — process တစ်ခုက ၎င်းရဲ့ time slice (လုပ်ဆောင်ချိန် ခွဲဝေမှု) မပြည့်စုံခင် processor ကို မိမိဆန္ဒအလျောက် စွန့်လွှတ်လိုက်လို့ (ပုံမှန်အားဖြင့် resource တစ်ခု ရရှိနိုင်ဖို့ စောင့်ဆိုင်းနေရလို့) CPU context switch တစ်ခု ဖြစ်ပွားခဲ့တဲ့ အကြိမ်အရေအတွက်ပါ။ ဒီ field ကို Windows မှာ support မလုပ်ပါဘူး။
  * `involuntaryContextSwitches` {integer} `ru_nivcsw` ဆီကို map လုပ်ထားပြီး — priority ပိုမြင့်တဲ့ process တစ်ခု runnable (လည်ပတ်ရန် အသင့်) ဖြစ်လာလို့ သို့မဟုတ် လက်ရှိ process က ၎င်းရဲ့ time slice ကို ကျော်လွန်သွားလို့ CPU context switch တစ်ခု ဖြစ်ပွားခဲ့တဲ့ အကြိမ်အရေအတွက်ပါ။ ဒီ field ကို Windows မှာ support မလုပ်ပါဘူး။

```mjs
import { resourceUsage } from 'node:process';

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```

```cjs
const { resourceUsage } = require('node:process');

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
```

## `process.send(message[, sendHandle[, options]][, callback])`

* `message` {Object}
* `sendHandle` {net.Server|net.Socket}
* `options` {Object} handle အမျိုးအစား တစ်ချို့ကို ပို့ဆောင်ခြင်းကို parameterize (သတ်မှတ်) လုပ်ဖို့ သုံးပါတယ်။ `options` က အောက်ပါ properties တွေကို ထောက်ပံ့ပေးပါတယ်:
  * `keepOpen` {boolean} `net.Socket` instances တွေကို ဖြတ်သန်းပေးတဲ့အခါ သုံးနိုင်တဲ့ တန်ဖိုးတစ်ခုပါ။ `true` ဖြစ်နေရင် — socket ကို ပို့လွှတ်နေတဲ့ (sending) process ထဲမှာ ဖွင့်ထားဆဲ ထားရှိပါတယ်။ **Default:** `false`။
* `callback` {Function}
* Returns: {boolean}

Node.js ကို IPC channel တစ်ခုနဲ့အတူ spawn လုပ်ထားခဲ့ရင် — `process.send()` method ကို parent process ဆီကို messages ပို့ဖို့ သုံးနိုင်ပါတယ်။ Messages တွေကို parent ရဲ့ [`ChildProcess`][] object ပေါ်မှာ [`'message'`][] event တစ်ခုအနေနဲ့ လက်ခံရရှိပါလိမ့်မယ်။

Node.js ကို IPC channel တစ်ခုနဲ့အတူ spawn လုပ်ထားခြင်း မရှိခဲ့ဘူးဆိုရင် — `process.send` က `undefined` ဖြစ်ပါလိမ့်မယ်။

Message က serialization နဲ့ parsing (ခွဲခြမ်းစိတ်ဖြာခြင်း) တွေကို ဖြတ်သန်းရပါတယ်။ ရလာတဲ့ message က မူရင်း ပို့လိုက်တဲ့အရာနဲ့ အတိအကျ တူချင်မှ တူပါလိမ့်မယ်။

## `process.setegid(id)`

* `id` {string|number} Group တစ်ခုရဲ့ အမည် (သို့) ID ပါ

`process.setegid()` method က process ရဲ့ effective group identity (သက်ရောက်မှုရှိနေတဲ့ group သတ်မှတ်ချက်) ကို သတ်မှတ်ပေးပါတယ်။ (setegid(2) ကို ကြည့်ပါ။) `id` ကို numeric ID (ဂဏန်း ID) တစ်ခု သို့မဟုတ် group အမည် string တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးနိုင်ပါတယ်။ Group အမည်တစ်ခု သတ်မှတ်ပေးထားရင် — ဆက်စပ်နေတဲ့ numeric ID ကို ရှာဖွေဖြေရှင်းနေစဉ်အတွင်း ဒီ method က block (ရပ်တန့်စောင့်ဆိုင်း) လုပ်ပါတယ်။

```mjs
import process from 'node:process';

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```cjs
if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

ဒီ function က POSIX platforms တွေမှာပဲ ရနိုင်ပါတယ် (ဆိုလိုတာက Windows (သို့) Android မဟုတ်ပါဘူး)။
ဒီ feature က [`Worker`][] threads တွေထဲမှာ မရနိုင်ပါဘူး။

## `process.seteuid(id)`

* `id` {string|number} User တစ်ခုရဲ့ အမည် (သို့) ID ပါ

`process.seteuid()` method က process ရဲ့ effective user identity (သက်ရောက်မှုရှိနေတဲ့ user သတ်မှတ်ချက်) ကို သတ်မှတ်ပေးပါတယ်။ (seteuid(2) ကို ကြည့်ပါ။) `id` ကို numeric ID တစ်ခု သို့မဟုတ် username string တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးနိုင်ပါတယ်။ Username တစ်ခု သတ်မှတ်ပေးထားရင် — ဆက်စပ်နေတဲ့ numeric ID ကို ရှာဖွေဖြေရှင်းနေစဉ်အတွင်း ဒီ method က block လုပ်ပါတယ်။

```mjs
import process from 'node:process';

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```cjs
if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

ဒီ function က POSIX platforms တွေမှာပဲ ရနိုင်ပါတယ် (ဆိုလိုတာက Windows (သို့) Android မဟုတ်ပါဘူး)။
ဒီ feature က [`Worker`][] threads တွေထဲမှာ မရနိုင်ပါဘူး။

## `process.setgid(id)`

* `id` {string|number} Group အမည် (သို့) ID ပါ

`process.setgid()` method က process ရဲ့ group identity (group သတ်မှတ်ချက်) ကို သတ်မှတ်ပေးပါတယ်။ (setgid(2) ကို ကြည့်ပါ။) `id` ကို numeric ID တစ်ခု သို့မဟုတ် group အမည် string တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးနိုင်ပါတယ်။ Group အမည်တစ်ခု သတ်မှတ်ပေးထားရင် — ဆက်စပ်နေတဲ့ numeric ID ကို ရှာဖွေဖြေရှင်းနေစဉ်အတွင်း ဒီ method က block လုပ်ပါတယ်။

```mjs
import process from 'node:process';

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

```cjs
if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.error(`Failed to set gid: ${err}`);
  }
}
```

ဒီ function က POSIX platforms တွေမှာပဲ ရနိုင်ပါတယ် (ဆိုလိုတာက Windows (သို့) Android မဟုတ်ပါဘူး)။
ဒီ feature က [`Worker`][] threads တွေထဲမှာ မရနိုင်ပါဘူး။

## `process.setgroups(groups)`

* `groups` {integer\[]}

`process.setgroups()` method က Node.js process အတွက် supplementary group IDs (ထပ်ဆောင်း group IDs) တွေကို သတ်မှတ်ပေးပါတယ်။ ဒါက privileged (အခွင့်ထူး လိုအပ်တဲ့) လုပ်ဆောင်မှုတစ်ခု ဖြစ်ပြီး — Node.js process မှာ `root` (သို့) `CAP_SETGID` capability ရှိဖို့ လိုအပ်ပါတယ်။

`groups` array ထဲမှာ numeric group IDs တွေ၊ group အမည်တွေ သို့မဟုတ် နှစ်မျိုးလုံး ပါဝင်နိုင်ပါတယ်။

```mjs
import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```

```cjs
if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // new groups
  } catch (err) {
    console.error(`Failed to set groups: ${err}`);
  }
}
```

ဒီ function က POSIX platforms တွေမှာပဲ ရနိုင်ပါတယ် (ဆိုလိုတာက Windows (သို့) Android မဟုတ်ပါဘူး)။
ဒီ feature က [`Worker`][] threads တွေထဲမှာ မရနိုင်ပါဘူး။

## `process.setuid(id)`

* `id` {integer | string}

`process.setuid(id)` method က process ရဲ့ user identity (user သတ်မှတ်ချက်) ကို သတ်မှတ်ပေးပါတယ်။ (setuid(2) ကို ကြည့်ပါ။) `id` ကို numeric ID တစ်ခု သို့မဟုတ် username string တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးနိုင်ပါတယ်။ Username တစ်ခု သတ်မှတ်ပေးထားရင် — ဆက်စပ်နေတဲ့ numeric ID ကို ရှာဖွေဖြေရှင်းနေစဉ်အတွင်း ဒီ method က block လုပ်ပါတယ်။

```mjs
import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

```cjs
if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.error(`Failed to set uid: ${err}`);
  }
}
```

ဒီ function က POSIX platforms တွေမှာပဲ ရနိုင်ပါတယ် (ဆိုလိုတာက Windows (သို့) Android မဟုတ်ပါဘူး)။
ဒီ feature က [`Worker`][] threads တွေထဲမှာ မရနိုင်ပါဘူး။

## `process.setSourceMapsEnabled(val)`

> Stability: 1 - Experimental: Use [`module.setSourceMapsSupport()`][] instead.

* `val` {boolean}

ဒီ function က stack traces တွေအတွက် [Source Map][] support ကို ဖွင့် (enable) သို့မဟုတ် ပိတ် (disable) လုပ်ပေးပါတယ်။

၎င်းက Node.js process ကို `--enable-source-maps` command-line option နဲ့ launch လုပ်တာနဲ့ တူညီတဲ့ features တွေကို ပံ့ပိုးပေးပါတယ်။

Source maps ကို enable လုပ်ပြီးမှ load လုပ်လိုက်တဲ့ JavaScript files တွေထဲမှာ ရှိတဲ့ source maps တွေကိုသာ parse ပြီး load လုပ်ပါလိမ့်မယ်။

ဒါက `module.setSourceMapsSupport()` ကို `{ nodeModules: true, generatedCode: true }` option တစ်ခုနဲ့ ခေါ်ခြင်းနဲ့ တူညီပါတယ်။

## `process.setUncaughtExceptionCaptureCallback(fn)`

* `fn` {Function|null}

`process.setUncaughtExceptionCaptureCallback()` function က — uncaught exception တစ်ခု ဖြစ်ပွားတဲ့အခါ ခေါ်ယူမယ့် function တစ်ခုကို သတ်မှတ်ပေးပြီး — ၎င်းက exception ရဲ့ တန်ဖိုးကိုယ်တိုင်ကို ပထမဆုံး argument အဖြစ် လက်ခံရရှိပါတယ်။

အဲဒီလို function တစ်ခု သတ်မှတ်ထားရင် — [`'uncaughtException'`][] event ကို emit လုပ်မှာ မဟုတ်ပါဘူး။ `--abort-on-uncaught-exception` flag ကို command line ကနေ ဖြတ်သန်းပေးထားခဲ့ရင် သို့မဟုတ် [`v8.setFlagsFromString()`][] ကနေတစ်ဆင့် သတ်မှတ်ထားခဲ့ရင်တောင် — process က abort လုပ်မှာ မဟုတ်ပါဘူး။ Report တွေ ထုတ်လုပ်တာလိုမျိုး — exceptions တွေပေါ်မှာ လုပ်ဆောင်ဖို့ စီစဉ်ထားတဲ့ လုပ်ဆောင်ချက်တွေကလည်း သက်ရောက်မှု ခံရပါလိမ့်မယ်

Capture function ကို ဖယ်ရှားဖို့အတွက် — `process.setUncaughtExceptionCaptureCallback(null)` ကို သုံးနိုင်ပါတယ်။ တခြား capture function တစ်ခု သတ်မှတ်ထားချိန်မှာ ဒီ method ကို `null` မဟုတ်တဲ့ argument တစ်ခုနဲ့ ခေါ်လိုက်ရင် — error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

အတူတကွ တည်ရှိနိုင်တဲ့ callbacks အများအပြားကို register လုပ်ချင်ရင် — [`process.addUncaughtExceptionCaptureCallback()`][] ကို အသုံးပြုပါ။

## `process.sourceMapsEnabled`

> Stability: 1 - Experimental: Use [`module.getSourceMapsSupport()`][] instead.

* Type: {boolean}

`process.sourceMapsEnabled` property က stack traces တွေအတွက် [Source Map][] support ဖွင့်ထားလားဆိုတာကို ပြန်ပေးပါတယ်။

## `process.stderr`

* Type: {Stream}

`process.stderr` property က `stderr` (fd `2`) နဲ့ ချိတ်ဆက်ထားတဲ့ stream တစ်ခုကို ပြန်ပေးပါတယ်။ fd `2` က file တစ်ခုကို ရည်ညွှန်းနေတယ်ဆိုရင် [Writable][] stream တစ်ခု ဖြစ်ပြီး — မဟုတ်ရင်တော့ ([Duplex][] stream တစ်ခုလည်း ဖြစ်တဲ့) [`net.Socket`][] တစ်ခု ဖြစ်ပါတယ်။

`process.stderr` က တခြား Node.js streams တွေနဲ့ အရေးကြီးတဲ့ နည်းလမ်းတွေမှာ ကွဲပြားပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [note on process I/O][] ကို ကြည့်ပါ။

### `process.stderr.fd`

* Type: {number}

ဒီ property က `process.stderr` ရဲ့ အောက်ခြေခံ (underlying) file descriptor ရဲ့ တန်ဖိုးကို ရည်ညွှန်းပါတယ်။ တန်ဖိုးက `2` မှာ ပုံသေ သတ်မှတ်ထားပါတယ်။ [`Worker`][] threads တွေထဲမှာ — ဒီ field က မရှိပါဘူး။

## `process.stdin`

* Type: {Stream}

`process.stdin` property က `stdin` (fd `0`) နဲ့ ချိတ်ဆက်ထားတဲ့ stream တစ်ခုကို ပြန်ပေးပါတယ်။ fd `0` က file တစ်ခုကို ရည်ညွှန်းနေတယ်ဆိုရင် [Readable][] stream တစ်ခု ဖြစ်ပြီး — မဟုတ်ရင်တော့ ([Duplex][] stream တစ်ခုလည်း ဖြစ်တဲ့) [`net.Socket`][] တစ်ခု ဖြစ်ပါတယ်။

`stdin` ကနေ ဘယ်လို ဖတ်ရမလဲဆိုတဲ့ အသေးစိတ်တွေအတွက် [`readable.read()`][] ကို ကြည့်ပါ။

[Duplex][] stream တစ်ခုအနေနဲ့ — `process.stdin` ကို Node.js v0.10 မတိုင်ခင် ရေးသားထားတဲ့ scripts တွေနဲ့ လိုက်ဖက်ညီတဲ့ "old" mode မှာလည်း သုံးနိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [Stream compatibility][] ကို ကြည့်ပါ။

"old" streams mode ထဲမှာ `stdin` stream က default အနေနဲ့ pause လုပ်ထားတာမို့ — ၎င်းကနေ ဖတ်ဖို့ `process.stdin.resume()` ကို ခေါ်ပေးရပါမယ်။ `process.stdin.resume()` ကို ခေါ်လိုက်တာကိုယ်တိုင် stream ကို "old" mode ဆီကို ပြောင်းလဲစေမှာကိုလည်း သတိပြုပါ။

### `process.stdin.fd`

* Type: {number}

ဒီ property က `process.stdin` ရဲ့ အောက်ခြေခံ file descriptor ရဲ့ တန်ဖိုးကို ရည်ညွှန်းပါတယ်။ တန်ဖိုးက `0` မှာ ပုံသေ သတ်မှတ်ထားပါတယ်။ [`Worker`][] threads တွေထဲမှာ — ဒီ field က မရှိပါဘူး။

## `process.stdout`

* Type: {Stream}

`process.stdout` property က `stdout` (fd `1`) နဲ့ ချိတ်ဆက်ထားတဲ့ stream တစ်ခုကို ပြန်ပေးပါတယ်။ fd `1` က file တစ်ခုကို ရည်ညွှန်းနေတယ်ဆိုရင် [Writable][] stream တစ်ခု ဖြစ်ပြီး — မဟုတ်ရင်တော့ ([Duplex][] stream တစ်ခုလည်း ဖြစ်တဲ့) [`net.Socket`][] တစ်ခု ဖြစ်ပါတယ်။

ဥပမာ — `process.stdin` ကို `process.stdout` ဆီကို copy လုပ်ဖို့အတွက်:

```mjs
import { stdin, stdout } from 'node:process';

stdin.pipe(stdout);
```

```cjs
const { stdin, stdout } = require('node:process');

stdin.pipe(stdout);
```

`process.stdout` က တခြား Node.js streams တွေနဲ့ အရေးကြီးတဲ့ နည်းလမ်းတွေမှာ ကွဲပြားပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [note on process I/O][] ကို ကြည့်ပါ။

### `process.stdout.fd`

* Type: {number}

ဒီ property က `process.stdout` ရဲ့ အောက်ခြေခံ file descriptor ရဲ့ တန်ဖိုးကို ရည်ညွှန်းပါတယ်။ တန်ဖိုးက `1` မှာ ပုံသေ သတ်မှတ်ထားပါတယ်။ [`Worker`][] threads တွေထဲမှာ — ဒီ field က မရှိပါဘူး။

### Process I/O နှင့် ပတ်သက်သော မှတ်စု (A note on process I/O)

`process.stdout` နဲ့ `process.stderr` တို့က တခြား Node.js streams တွေနဲ့ အရေးကြီးတဲ့ နည်းလမ်းတွေမှာ ကွဲပြားပါတယ်:

1. ၎င်းတို့ကို [`console.log()`][] နဲ့ [`console.error()`][] တို့က အသီးသီး အတွင်းပိုင်းမှာ အသုံးပြုပါတယ်။
2. Writes (ရေးသားမှုများ) က — stream က ဘာနဲ့ ချိတ်ဆက်ထားလဲ၊ ပြီးတော့ system က Windows လား POSIX လားဆိုတာပေါ် မူတည်ပြီး — synchronous ဖြစ်နိုင်ပါတယ်:
   * Files: Windows နဲ့ POSIX မှာ _synchronous_
   * TTYs (Terminals): Windows မှာ _asynchronous_၊ POSIX မှာ _synchronous_
   * Pipes (နှင့် sockets): Windows မှာ _synchronous_၊ POSIX မှာ _asynchronous_

ဒီအပြုအမူတွေက တစ်စိတ်တစ်ပိုင်းအားဖြင့် သမိုင်းကြောင်း အကြောင်းပြချက်တွေကြောင့်ပါ — ၎င်းတို့ကို ပြောင်းလဲလိုက်ရင် backward incompatibility (နောက်ပြန် လိုက်ဖက်မှု မရှိခြင်း) တွေ ဖြစ်ပေါ်စေမှာမို့ပါ — ဒါပေမယ့် user တစ်ချို့ကလည်း ဒီအပြုအမူတွေကို မျှော်လင့်ထားကြပါတယ်။

Synchronous writes တွေက — `console.log()` (သို့) `console.error()` နဲ့ ရေးလိုက်တဲ့ output တွေ မမျှော်လင့်ပဲ ရောယှက်သွားတာ၊ ဒါမှမဟုတ် asynchronous write တစ်ခု မပြီးဆုံးခင်မှာ `process.exit()` ကို ခေါ်လိုက်လို့ output တွေ လုံးဝ မရေးဖြစ်တာလိုမျိုး ပြဿနာတွေကို ရှောင်ရှားပေးပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`process.exit()`][] ကို ကြည့်ပါ။

_**Warning**_: Synchronous writes တွေက write ပြီးဆုံးသည်အထိ event loop ကို block (ရပ်တန့်) လုပ်ထားပါတယ်။ File တစ်ခုဆီကို output လုပ်တဲ့ ကိစ္စမှာဆိုရင် ချက်ချင်းနီးပါး ပြီးဆုံးနိုင်ပေမယ့် — system load မြင့်မားနေချိန်၊ လက်ခံဘက်က ဖတ်မနေတဲ့ pipes တွေ၊ ဒါမှမဟုတ် နှေးကွေးတဲ့ terminals (သို့) file systems တွေနဲ့ဆိုရင် — event loop က မကြာခဏဆိုသလို ပြီးတော့ ကြာကြာ block ဖြစ်နေပြီး — စွမ်းဆောင်ရည်ကို ဆိုးရွားစွာ ထိခိုက်စေနိုင်ပါတယ်။ Interactive terminal session တစ်ခုဆီကို ရေးသားတဲ့အခါမှာတော့ ဒါက ပြဿနာ မဖြစ်နိုင်ပေမယ့် — process output streams တွေဆီကို production logging (ထုတ်လုပ်မှု မှတ်တမ်း) လုပ်တဲ့အခါမှာတော့ အထူး သတိထားပြီး စဉ်းစားပါ။

Stream တစ်ခုက [TTY][] context တစ်ခုနဲ့ ချိတ်ဆက်ထားလားဆိုတာ စစ်ဆေးဖို့ — `isTTY` property ကို စစ်ဆေးပါ။

ဥပမာ:

```console
$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
```

နောက်ထပ် အချက်အလက်တွေအတွက် [TTY][] documentation ကို ကြည့်ပါ။

## `process.throwDeprecation`

* Type: {boolean}

`process.throwDeprecation` ရဲ့ ကနဦး (initial) တန်ဖိုးက — လက်ရှိ Node.js process ပေါ်မှာ `--throw-deprecation` flag သတ်မှတ်ထားလားဆိုတာကို ဖော်ပြပါတယ်။ `process.throwDeprecation` က ပြောင်းလဲလို့ရတာမို့ — deprecation warnings တွေက errors တွေအဖြစ် ရလား မလာဆိုတာကို runtime မှာ ပြောင်းလဲနိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`'warning'` event][process_warning] နဲ့ [`emitWarning()` method][process_emit_warning] တို့ရဲ့ documentation တွေကို ကြည့်ပါ။

```console
$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
```

## `process.threadCpuUsage([previousValue])`

* `previousValue` {Object} `process.threadCpuUsage()` ကို ခေါ်ခဲ့စဉ်က ရခဲ့တဲ့ return တန်ဖိုး တစ်ခုပါ
* Returns: {Object}
  * `user` {integer}
  * `system` {integer}

`process.threadCpuUsage()` method က လက်ရှိ worker thread ရဲ့ user နဲ့ system CPU time အသုံးပြုမှုကို — `user` နဲ့ `system` properties တွေ ပါဝင်တဲ့ object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ် — တန်ဖိုးတွေက microsecond (စက္ကန့်ရဲ့ တစ်သန်းပုံတစ်ပုံ) တန်ဖိုးတွေ ဖြစ်ပါတယ်။

`process.threadCpuUsage()` ဆီကို အရင်က ခေါ်ခဲ့လို့ ရခဲ့တဲ့ ရလဒ်ကို — diff reading (ကွာခြားချက် တန်ဖိုး) ရဖို့အတွက် — function ရဲ့ argument အဖြစ် ဖြတ်သန်းပေးနိုင်ပါတယ်။

## `process.title`

* Type: {string}

`process.title` property က လက်ရှိ process ရဲ့ title ကို ပြန်ပေးပါတယ် (ဆိုလိုတာက `ps` ရဲ့ လက်ရှိ တန်ဖိုးကို ပြန်ပေးပါတယ်)။ `process.title` ကို တန်ဖိုးအသစ်တစ်ခု သတ်မှတ်လိုက်တာက `ps` ရဲ့ လက်ရှိ တန်ဖိုးကို ပြုပြင်မွမ်းမံပါတယ်။

တန်ဖိုးအသစ်တစ်ခု သတ်မှတ်လိုက်တဲ့အခါ — platform အမျိုးမျိုးက title အတွက် ကွဲပြားတဲ့ အများဆုံး အရှည် ကန့်သတ်ချက်တွေကို သတ်မှတ်ပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် အဲဒီလို ကန့်သတ်ချက်တွေက အတော်လေး ကျဉ်းမြောင်းပါတယ်။ ဥပမာ — Linux နဲ့ macOS တွေမှာ `process.title` ကို binary ရဲ့ အမည် အရွယ်အစား အပေါင်း command-line arguments တွေရဲ့ အလျားအထိသာ ကန့်သတ်ထားပါတယ် — `process.title` ကို သတ်မှတ်လိုက်တာက process ရဲ့ `argv` memory ကို ထပ်ရေး (overwrite) လုပ်လိုက်လို့ပါ။ Node.js 0.8 ကတော့ `environ` memory ကိုပါ ထပ်ရေးလိုက်ခြင်းအားဖြင့် ပိုရှည်တဲ့ process title strings တွေကို ခွင့်ပြုပေးခဲ့ပေမယ့် — အဲဒါက (အတော်လေး ထူးဆန်းတဲ့) အခြေအနေတစ်ချို့မှာ မလုံခြုံမှုနဲ့ ရှုပ်ထွေးမှုတွေ ဖြစ်စေနိုင်ခဲ့ပါတယ်။

`process.title` ကို တန်ဖိုးတစ်ခု သတ်မှတ်လိုက်တာက — macOS Activity Monitor (သို့) Windows Services Manager လိုမျိုး process manager applications တွေအတွင်းမှာ တိကျတဲ့ label (အညွှန်း) တစ်ခု ဖြစ်ချင်မှ ဖြစ်ပါလိမ့်မယ်။

## `process.traceDeprecation`

* Type: {boolean}

`process.traceDeprecation` property က — လက်ရှိ Node.js process ပေါ်မှာ `--trace-deprecation` flag သတ်မှတ်ထားလားဆိုတာကို ဖော်ပြပါတယ်။ ဒီ flag ရဲ့ အပြုအမူအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [`'warning'` event][process_warning] နဲ့ [`emitWarning()` method][process_emit_warning] တို့ရဲ့ documentation တွေကို ကြည့်ပါ။

## `process.traceProcessWarnings`

* {boolean}

`process.traceProcessWarnings` property က — လက်ရှိ Node.js process ပေါ်မှာ `--trace-warnings` flag သတ်မှတ်ထားလားဆိုတာကို ဖော်ပြပါတယ်။ ဒီ property က warnings တွေရဲ့ tracing အပေါ် programmatic ထိန်းချုပ်မှု ပေးစွမ်းနိုင်စေပြီး — warnings တွေအတွက် stack traces တွေကို runtime မှာ ဖွင့်/ပိတ် လုပ်နိုင်ပါတယ်။

```js
// Enable trace warnings
process.traceProcessWarnings = true;

// Emit a warning with a stack trace
process.emitWarning('Warning with stack trace');

// Disable trace warnings
process.traceProcessWarnings = false;
```

## `process.umask()`

> Stability: 0 - Deprecated. Calling `process.umask()` with no argument causes
> the process-wide umask to be written twice. This introduces a race condition
> between threads, and is a potential security vulnerability. There is no safe,
> cross-platform alternative API.

`process.umask()` က Node.js process ရဲ့ file mode creation mask (ဖိုင် mode ဖန်တီးရာတွင် သုံးသော mask) ကို ပြန်ပေးပါတယ်။ Child processes တွေက mask ကို parent process ကနေ အမွေဆက်ခံပါတယ်။

## `process.umask(mask)`

* `mask` {string|integer}

`process.umask(mask)` က Node.js process ရဲ့ file mode creation mask ကို သတ်မှတ်ပေးပါတယ်။ Child processes တွေက mask ကို parent process ကနေ အမွေဆက်ခံပါတယ်။ ယခင် mask အဟောင်းကို ပြန်ပေးပါတယ်။

```mjs
import { umask } from 'node:process';

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```

```cjs
const { umask } = require('node:process');

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`,
);
```

[`Worker`][] threads တွေထဲမှာ — `process.umask(mask)` က exception တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

## `process.unref(maybeRefable)`

> Stability: 1 - Experimental

* `maybeRefable` {any} "unref'd" လုပ်နိုင်မယ့် object တစ်ခုပါ

Object တစ်ခုက Node.js ရဲ့ "Refable protocol" ကို implement လုပ်ထားရင် ၎င်းကို "unrefable" လို့ သတ်မှတ်ပါတယ်။ တိတိကျကျ ဆိုရရင် — object က `Symbol.for('nodejs.ref')` နဲ့ `Symbol.for('nodejs.unref')` methods တွေကို implement လုပ်ထားတယ်လို့ ဆိုလိုပါတယ်။ "Ref'd" လုပ်ထားတဲ့ objects တွေက Node.js event loop ကို ဆက်လည်ပတ်နေစေပြီး — "unref'd" လုပ်ထားတဲ့ objects တွေကတော့ ဆက်လည်ပတ်နေအောင် မလုပ်ပါဘူး။ အရင်တုန်းကတော့ ဒါကို objects တွေပေါ်မှာ `ref()` နဲ့ `unref()` methods တွေကို တိုက်ရိုက် သုံးပြီး အကောင်အထည်ဖော်ခဲ့ပါတယ်။ ဒါပေမယ့် — ဒီ pattern ကို "Refable protocol" နဲ့ အစားထိုးဖို့အတွက် deprecated (ခေတ်မမီတော့) အဖြစ် သတ်မှတ်နေပါပြီ — အကြောင်းကတော့ APIs တွေကို `ref()` နဲ့ `unref()` methods တွေ ထည့်သွင်းဖို့ ပြုပြင်မွမ်းမံလို့ မရနိုင်ပေမယ့် — အဲဒီအပြုအမူကို ထောက်ပံ့ဖို့ လိုအပ်နေတဲ့ — Web Platform API types တွေကို ပိုကောင်းမွန်စွာ ထောက်ပံ့နိုင်ဖို့ပါ။

## `process.uptime()`

* Returns: {number}

`process.uptime()` method က လက်ရှိ Node.js process လည်ပတ်နေခဲ့တဲ့ စက္ကန့် အရေအတွက်ကို ပြန်ပေးပါတယ်။

ပြန်ပေးတဲ့ တန်ဖိုးထဲမှာ စက္ကန့်ရဲ့ အပိုင်းအစ (fraction) တွေလည်း ပါဝင်ပါတယ်။ စက္ကန့် အပြည့်အစုံ ရယူဖို့ `Math.floor()` ကို သုံးပါ။

## `process.version`

* Type: {string}

`process.version` property မှာ Node.js ရဲ့ version string ပါဝင်ပါတယ်။

```mjs
import { version } from 'node:process';

console.log(`Version: ${version}`);
// Version: v14.8.0
```

```cjs
const { version } = require('node:process');

console.log(`Version: ${version}`);
// Version: v14.8.0
```

ရှေ့ဆုံးက _v_ မပါပဲ version string ရယူချင်ရင် — `process.versions.node` ကို သုံးပါ။

## `process.versions`

* Type: {Object}

`process.versions` property က Node.js နဲ့ ၎င်းရဲ့ dependencies တွေရဲ့ version strings တွေကို စာရင်းပြုစုထားတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ `process.versions.modules` က လက်ရှိ ABI version ကို ဖော်ပြပြီး — C++ API တစ်ခု ပြောင်းလဲတိုင်း ဒီ version ကို တိုးမြှင့်ပါတယ်။ Node.js က — မတူညီတဲ့ module ABI version တစ်ခုနဲ့ compile လုပ်ထားတဲ့ modules တွေကို load လုပ်ဖို့ ငြင်းပယ်ပါလိမ့်မယ်။

```mjs
import { versions } from 'node:process';

console.log(versions);
```

```cjs
const { versions } = require('node:process');

console.log(versions);
```

အောက်ပါနဲ့ ဆင်တူတဲ့ object တစ်ခုကို ထုတ်ပေးပါလိမ့်မယ်:

```console
{ node: '26.0.0-pre',
  acorn: '8.15.0',
  ada: '3.4.1',
  amaro: '1.1.5',
  ares: '1.34.6',
  brotli: '1.2.0',
  merve: '1.0.0',
  cldr: '48.0',
  icu: '78.2',
  llhttp: '9.3.0',
  modules: '144',
  napi: '10',
  nbytes: '0.1.1',
  ncrypto: '0.0.1',
  nghttp2: '1.68.0',
  nghttp3: '',
  ngtcp2: '',
  openssl: '3.5.4',
  simdjson: '4.2.4',
  simdutf: '7.3.3',
  sqlite: '3.51.2',
  tz: '2025c',
  undici: '7.18.2',
  unicode: '17.0',
  uv: '1.51.0',
  uvwasi: '0.0.23',
  v8: '14.3.127.18-node.10',
  zlib: '1.3.1-e00f703',
  zstd: '1.5.7' }
```

## Exit code များ (Exit codes)

Node.js က ပုံမှန်အားဖြင့် — async operations တွေ ဆက်လုပ်ဆောင်စရာ မကျန်တော့တဲ့အခါ — `0` status code နဲ့ exit လုပ်ပါတယ်။ အောက်ပါ status codes တွေကို တခြား အခြေအနေတွေမှာ သုံးပါတယ်:

* `1` **Uncaught Fatal Exception**: Uncaught exception တစ်ခု ဖြစ်ပွားခဲ့ပြီး — ၎င်းကို domain တစ်ခု (သို့) [`'uncaughtException'`][] event handler တစ်ခုက ကိုင်တွယ်မထားခဲ့ပါဘူး။
* `2`: အသုံးမပြုပါဘူး (Bash က builtin တွေ မှားယွင်းစွာ သုံးမှုအတွက် သီးသန့် ထားရှိထားပါတယ်)
* `3` **Internal JavaScript Parse Error**: Node.js bootstrapping process ရဲ့ အတွင်းပိုင်း JavaScript source code က parse error တစ်ခုကို ဖြစ်ပေါ်စေခဲ့ပါတယ်။ ဒါက အလွန် ရှားပါးပြီး — ယေဘုယျအားဖြင့် Node.js ကိုယ်တိုင် ဖွံ့ဖြိုးတိုးတက်မှု (development) လုပ်နေစဉ်မှာသာ ဖြစ်ပွားနိုင်ပါတယ်။
* `4` **Internal JavaScript Evaluation Failure**: Node.js bootstrapping process ရဲ့ အတွင်းပိုင်း JavaScript source code က evaluation လုပ်တဲ့အခါ function တန်ဖိုးတစ်ခုကို ပြန်ပေးဖို့ ပျက်ကွက်ခဲ့ပါတယ်။ ဒါက အလွန် ရှားပါးပြီး — ယေဘုယျအားဖြင့် Node.js ကိုယ်တိုင် ဖွံ့ဖြိုးတိုးတက်မှု လုပ်နေစဉ်မှာသာ ဖြစ်ပွားနိုင်ပါတယ်။
* `5` **Fatal Error**: V8 ထဲမှာ ပြန်လည် ကောင်းမွန်အောင် မလုပ်နိုင်တဲ့ (unrecoverable) ပြင်းထန်တဲ့ error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။ ပုံမှန်အားဖြင့် `FATAL ERROR` ရှေ့ဆက်တပ်ထားတဲ့ message တစ်ခုကို stderr မှာ print လုပ်ပါလိမ့်မယ်။
* `6` **Non-function Internal Exception Handler**: Uncaught exception တစ်ခု ဖြစ်ပွားခဲ့ပေမယ့် — အတွင်းပိုင်း fatal exception handler function ကို တစ်နည်းနည်းနဲ့ non-function တစ်ခုအဖြစ် သတ်မှတ်မိခဲ့ပြီး — ခေါ်ယူလို့ မရတော့ပါဘူး။
* `7` **Internal Exception Handler Run-Time Failure**: Uncaught exception တစ်ခု ဖြစ်ပွားခဲ့ပြီး — ၎င်းကို ကိုင်တွယ်ဖို့ ကြိုးစားစဉ်မှာ အတွင်းပိုင်း fatal exception handler function ကိုယ်တိုင် error တစ်ခုကို throw လုပ်ခဲ့ပါတယ်။ ဥပမာ — [`'uncaughtException'`][] (သို့) `domain.on('error')` handler တစ်ခုက error တစ်ခုကို throw လုပ်တဲ့အခါ ဒါ ဖြစ်ပွားနိုင်ပါတယ်။
* `8`: အသုံးမပြုပါဘူး။ Node.js ရဲ့ ယခင် versions တွေမှာ — exit code 8 က တစ်ခါတစ်ရံ uncaught exception တစ်ခုကို ညွှန်ပြခဲ့ပါတယ်။
* `9` **Invalid Argument**: အမည်မသိ option တစ်ခု သတ်မှတ်ခဲ့တာ သို့မဟုတ် တန်ဖိုးတစ်ခု လိုအပ်တဲ့ option တစ်ခုကို တန်ဖိုး မပါပဲ ပေးခဲ့တာ ဖြစ်ပါတယ်။
* `10` **Internal JavaScript Run-Time Failure**: Node.js bootstrapping process ရဲ့ အတွင်းပိုင်း JavaScript source code က — bootstrapping function ကို ခေါ်ယူတဲ့အခါ — error တစ်ခုကို throw လုပ်ခဲ့ပါတယ်။ ဒါက အလွန် ရှားပါးပြီး — ယေဘုယျအားဖြင့် Node.js ကိုယ်တိုင် ဖွံ့ဖြိုးတိုးတက်မှု လုပ်နေစဉ်မှာသာ ဖြစ်ပွားနိုင်ပါတယ်။
* `12` **Invalid Debug Argument**: `--inspect` နဲ့/သို့မဟုတ် `--inspect-brk` options တွေကို သတ်မှတ်ထားပေမယ့် — ရွေးချယ်ထားတဲ့ port number က တရားဝင်မဟုတ်တာ (သို့) မရနိုင်တာ ဖြစ်ခဲ့ပါတယ်။
* `13` **Unsettled Top-Level Await**: Top-level code ထဲက function တစ်ခုရဲ့ အပြင်ဘက်မှာ `await` ကို သုံးခဲ့ပေမယ့် — ဖြတ်သန်းပေးလိုက်တဲ့ `Promise` က ဘယ်တော့မှ settle (ပြီးဆုံး) မဖြစ်ခဲ့ပါဘူး။
* `14` **Snapshot Failure**: V8 startup snapshot တစ်ခုကို တည်ဆောက်ဖို့ Node.js ကို စတင်ခဲ့ပေမယ့် — application ရဲ့ အခြေအနေအတွက် လိုအပ်ချက်တစ်ချို့ကို မပြည့်မီလို့ ပျက်ကွက်ခဲ့ပါတယ်။
* `>128` **Signal Exits**: Node.js က `SIGKILL` (သို့) `SIGHUP` လိုမျိုး fatal signal တစ်ခုကို လက်ခံရရှိခဲ့ရင် — ၎င်းရဲ့ exit code က `128` အပေါင်း signal code ရဲ့ တန်ဖိုး ဖြစ်ပါလိမ့်မယ်။ ဒါက standard POSIX အလေ့အထတစ်ခုပါ — exit codes တွေကို 7-bit integers တွေအဖြစ် သတ်မှတ်ထားပြီး — signal exits တွေက high-order bit ကို သတ်မှတ်ကာ — signal code ရဲ့ တန်ဖိုးကို ထည့်သွင်းထားလို့ပါ။ ဥပမာ — signal `SIGABRT` ရဲ့ တန်ဖိုးက `6` မို့ — မျှော်လင့်ရမယ့် exit code က `128` + `6` (ဆိုလိုတာက) `134` ဖြစ်ပါလိမ့်မယ်။

[Advanced serialization for `child_process`]: child_process.md#advanced-serialization
[Android building]: https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android
[Child Process]: child_process.md
[Cluster]: cluster.md
[Duplex]: stream.md#duplex-and-transform-streams
[Event Loop]: https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#understanding-processnexttick
[LTS]: https://github.com/nodejs/Release
[Permission Model]: permissions.md#permission-model
[Readable]: stream.md#readable-streams
[Signal Events]: #signal-events
[Source Map]: https://tc39.es/ecma426/
[Stream compatibility]: stream.md#compatibility-with-older-nodejs-versions
[TTY]: tty.md#tty
[Writable]: stream.md#writable-streams
[`'exit'`]: #event-exit
[`'message'`]: child_process.md#event-message
[`'uncaughtException'`]: #event-uncaughtexception
[`--no-deprecation`]: cli.md#--no-deprecation
[`--permission-audit`]: cli.md#--permission-audit
[`--permission`]: cli.md#--permission
[`--unhandled-rejections`]: cli.md#--unhandled-rejectionsmode
[`Buffer`]: buffer.md
[`ChildProcess.disconnect()`]: child_process.md#subprocessdisconnect
[`ChildProcess.send()`]: child_process.md#subprocesssendmessage-sendhandle-options-callback
[`ChildProcess`]: child_process.md#class-childprocess
[`Error`]: errors.md#class-error
[`EventEmitter`]: events.md#class-eventemitter
[`NODE_OPTIONS`]: cli.md#node_optionsoptions
[`Worker`]: worker_threads.md#class-worker
[`Worker` constructor]: worker_threads.md#new-workerfilename-options
[`console.error()`]: console.md#consoleerrordata-args
[`console.log()`]: console.md#consolelogdata-args
[`domain`]: domain.md
[`module.getSourceMapsSupport()`]: module.md#modulegetsourcemapssupport
[`module.isBuiltin(id)`]: module.md#moduleisbuiltinmodulename
[`module.setSourceMapsSupport()`]: module.md#modulesetsourcemapssupportenabled-options
[`net.Server`]: net.md#class-netserver
[`net.Socket`]: net.md#class-netsocket
[`os.constants.dlopen`]: os.md#dlopen-constants
[`postMessageToThread()`]: worker_threads.md#worker_threadspostmessagetothreadthreadid-value-transferlist-timeout
[`process.addUncaughtExceptionCaptureCallback()`]: #processadduncaughtexceptioncapturecallbackfn
[`process.argv`]: #processargv
[`process.config`]: #processconfig
[`process.execPath`]: #processexecpath
[`process.exit()`]: #processexitcode
[`process.exitCode`]: #processexitcode_1
[`process.hrtime()`]: #processhrtimetime
[`process.hrtime.bigint()`]: #processhrtimebigint
[`process.kill()`]: #processkillpid-signal
[`process.permission.has()`]: #processpermissionhasscope-reference
[`process.setUncaughtExceptionCaptureCallback()`]: #processsetuncaughtexceptioncapturecallbackfn
[`promise.catch()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
[`queueMicrotask()`]: globals.md#queuemicrotaskcallback
[`readable.read()`]: stream.md#readablereadsize
[`require()`]: globals.md#require
[`require.cache`]: modules.md#requirecache
[`require.main`]: modules.md#accessing-the-main-module
[`subprocess.kill()`]: child_process.md#subprocesskillsignal
[`v8.setFlagsFromString()`]: v8.md#v8setflagsfromstringflags
[built-in modules with mandatory `node:` prefix]: modules.md#built-in-modules-with-mandatory-node-prefix
[debugger]: debugger.md
[deprecation code]: deprecations.md
[loading ECMAScript modules using `require()`]: modules.md#loading-ecmascript-modules-using-require
[nodejs/node#21973]: https://github.com/nodejs/node/issues/21973
[note on process I/O]: #a-note-on-process-io
[process.cpuUsage]: #processcpuusagepreviousvalue
[process_emit_warning]: #processemitwarningwarning-type-code-ctor
[process_warning]: #event-warning
[program entry point]: https://nodejs.org/api/cli.html#program-entry-point
[report documentation]: report.md
[terminal raw mode]: tty.md#readstreamsetrawmodemode
[uv_get_available_memory]: https://docs.libuv.org/en/v1.x/misc.html#c.uv_get_available_memory
[uv_get_constrained_memory]: https://docs.libuv.org/en/v1.x/misc.html#c.uv_get_constrained_memory
[uv_rusage_t]: https://docs.libuv.org/en/v1.x/misc.html#c.uv_rusage_t
[wikipedia_major_fault]: https://en.wikipedia.org/wiki/Page_fault#Major
[wikipedia_minor_fault]: https://en.wikipedia.org/wiki/Page_fault#Minor
