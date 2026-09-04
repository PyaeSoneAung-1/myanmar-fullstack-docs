---
title: "Trace events"
description: "node:trace_events module — V8, Node.js core နဲ့ userspace code များက ထုတ်လုပ်သော tracing information များကို စုစည်းဖော်ပြပေးခြင်း"
order: 119
source: "https://nodejs.org/api/tracing.html"
status: translated
updated: 2026-09-04
---
> Stability: 1 - Experimental

`node:trace_events` module က V8, Node.js core, နဲ့ userspace code တွေက ထုတ်လုပ်တဲ့ tracing information တွေကို တစ်နေရာတည်းမှာ စုစည်းဖို့ (centralize) ယန္တရား တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

Tracing ကို `--trace-event-categories` command-line flag (သို့) `node:trace_events` module ကို သုံးပြီး enable လုပ်နိုင်ပါတယ်။ `--trace-event-categories` flag က comma နဲ့ ခြားထားတဲ့ category names စာရင်းတစ်ခုကို လက်ခံပါတယ်။

ရရှိနိုင်တဲ့ categories တွေကတော့:

* `node`: ဗလာ placeholder တစ်ခုပါ။
* `node.async_hooks`: အသေးစိတ် [`async_hooks`][] trace data တွေကို ဖမ်းယူနိုင်အောင် လုပ်ပေးပါတယ်။ [`async_hooks`][] events တွေမှာ သီးသန့် `asyncId` တစ်ခုနဲ့ အထူး `triggerId` `triggerAsyncId` property တစ်ခု ရှိပါတယ်။
* `node.bootstrap`: Node.js bootstrap milestones တွေကို ဖမ်းယူနိုင်အောင် လုပ်ပေးပါတယ်။
* `node.console`: `console.time()` နဲ့ `console.count()` တို့ရဲ့ output တွေကို ဖမ်းယူနိုင်အောင် လုပ်ပေးပါတယ်။
* `node.threadpoolwork.sync`: Threadpool synchronous operations တွေဖြစ်တဲ့ `blob`, `zlib`, `crypto`, `node_api` စတာတွေအတွက် trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။
* `node.threadpoolwork.async`: Threadpool asynchronous operations တွေဖြစ်တဲ့ `blob`, `zlib`, `crypto`, `node_api` စတာတွေအတွက် trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။
* `node.dns.native`: DNS queries တွေအတွက် trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။
* `node.net.native`: Network အတွက် trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။
* `node.environment`: Node.js Environment milestones တွေကို ဖမ်းယူနိုင်အောင် လုပ်ပေးပါတယ်။
* `node.fs.sync`: File system sync methods တွေအတွက် trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။
* `node.fs_dir.sync`: File system sync directory methods တွေအတွက် trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။
* `node.fs.async`: File system async methods တွေအတွက် trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။
* `node.fs_dir.async`: File system async directory methods တွေအတွက် trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။
* `node.perf`: [Performance API][] measurements တွေကို ဖမ်းယူနိုင်အောင် လုပ်ပေးပါတယ်။
  * `node.perf.usertiming`: Performance API User Timing measures နဲ့ marks တွေကိုပဲ ဖမ်းယူနိုင်အောင် လုပ်ပေးပါတယ်။
  * `node.perf.timerify`: Performance API timerify measurements တွေကိုပဲ ဖမ်းယူနိုင်အောင် လုပ်ပေးပါတယ်။
* `node.promises.rejections`: Unhandled Promise rejections တွေနဲ့ handled-after-rejections တွေရဲ့ အရေအတွက်ကို ခြေရာခံတဲ့ trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။
* `node.vm.script`: `node:vm` module ရဲ့ `runInNewContext()`, `runInContext()`, နဲ့ `runInThisContext()` methods တွေအတွက် trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။
* `v8`: [V8][] events တွေက GC, compiling, နဲ့ execution နဲ့ ဆက်စပ်ပါတယ်။
* `node.http`: HTTP request / response တွေအတွက် trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။
* `node.module_timer`: CJS Module loading အတွက် trace data ဖမ်းယူမှုကို enable လုပ်ပေးပါတယ်။

Default အနေနဲ့ `node`, `node.async_hooks`, နဲ့ `v8` categories တွေကို enable လုပ်ထားပါတယ်။

```bash
node --trace-event-categories v8,node,node.async_hooks server.js
```

Node.js ရဲ့ အရင် versions တွေမှာ trace events တွေကို enable လုပ်ဖို့ `--trace-events-enabled` flag ကို သုံးစရာ လိုအပ်ခဲ့ပါတယ်။ အဲဒီ လိုအပ်ချက်ကို ဖယ်ရှားလိုက်ပါပြီ။ ဒါပေမယ့် `--trace-events-enabled` flag ကို _ဆက်လက်_ သုံးနိုင်ပါသေးတယ် — အဲဒီအခါ `node`, `node.async_hooks`, နဲ့ `v8` trace event categories တွေကို default အနေနဲ့ enable လုပ်ပေးပါလိမ့်မယ်။

```bash
node --trace-events-enabled

# is equivalent to

node --trace-event-categories v8,node,node.async_hooks
```

တစ်နည်းအားဖြင့် — `node:trace_events` module ကို သုံးပြီးတော့လည်း trace events တွေကို enable လုပ်နိုင်ပါတယ်:

```mjs
import { createTracing } from 'node:trace_events';
const tracing = createTracing({ categories: ['node.perf'] });
tracing.enable();  // Enable trace event capture for the 'node.perf' category

// do work

tracing.disable();  // Disable trace event capture for the 'node.perf' category
```



```cjs
const { createTracing } = require('node:trace_events');
const tracing = createTracing({ categories: ['node.perf'] });
tracing.enable();  // Enable trace event capture for the 'node.perf' category

// do work

tracing.disable();  // Disable trace event capture for the 'node.perf' category
```

Tracing enable လုပ်ထားတဲ့ Node.js ကို run လိုက်ရင် log files တွေ ထုတ်လုပ်ပေးပြီး — အဲဒါတွေကို Chrome ရဲ့ [`chrome://tracing`](https://www.chromium.org/developers/how-tos/trace-event-profiling-tool) tab ထဲမှာ ဖွင့်ကြည့်နိုင်ပါတယ်။

Logging file ကို default အနေနဲ့ `node_trace.${rotation}.log` လို့ ခေါ်ပါတယ် — `${rotation}` က တစ်ဆင့်ပြီး တစ်ဆင့် တိုးနေတဲ့ log-rotation id ပါ။ File path ရဲ့ ပုံစံကို `--trace-event-file-pattern` နဲ့ သတ်မှတ်နိုင်ပါတယ် — ဒါက `${rotation}` နဲ့ `${pid}` တွေကို support လုပ်တဲ့ template string တစ်ခုကို လက်ခံပါတယ်:

```bash
node --trace-event-categories v8 --trace-event-file-pattern '${pid}-${rotation}.log' server.js
```

`SIGINT`, `SIGTERM`, (သို့) `SIGBREAK` လိုမျိုး signal events တွေ ပြီးတဲ့အခါ log file ကို မှန်ကန်စွာ ထုတ်လုပ်နိုင်ဖို့ — သင့် code ထဲမှာ အောက်ကလိုမျိုး သင့်လျော်တဲ့ handlers တွေ ရှိဖို့ သေချာပါစေ:

```js
process.on('SIGINT', function onSigint() {
  console.info('Received SIGINT.');
  process.exit(130);  // Or applicable exit code depending on OS and signal
});
```

Tracing system က `process.hrtime()` သုံးတဲ့ time source နဲ့ အတူတူကိုပဲ သုံးပါတယ်။ ဒါပေမယ့် — nanosecond တွေကို ပြန်ပေးတဲ့ `process.hrtime()` နဲ့ မတူဘဲ — trace-event timestamps တွေကို microsecond တွေနဲ့ ဖော်ပြပါတယ်။

ဒီ module ရဲ့ features တွေက [`Worker`][] threads တွေထဲမှာ မရနိုင်ပါဘူး။

## `node:trace_events` module အကြောင်း (The `node:trace_events` module)

### `Tracing` object အကြောင်း (The `Tracing` object)

`Tracing` object က categories အစုံတွေအတွက် tracing ကို enable (သို့) disable လုပ်ဖို့ သုံးပါတယ်။ Instances တွေကို `trace_events.createTracing()` method နဲ့ ဖန်တီးပါတယ်။

ဖန်တီးလိုက်တဲ့အခါ `Tracing` object က disabled ဖြစ်နေပါတယ်။ `tracing.enable()` method ကို ခေါ်လိုက်ရင် categories တွေကို enable ဖြစ်နေတဲ့ trace event categories အစုထဲကို ထည့်ပေးပြီး — `tracing.disable()` ကို ခေါ်ရင်တော့ categories တွေကို အဲဒီအစုကနေ ဖယ်ရှားပေးပါတယ်။

#### `tracing.categories`

* Type: {string}

ဒီ `Tracing` object က ဖုံးအုပ်ထားတဲ့ trace event categories တွေရဲ့ comma နဲ့ ခြားထားတဲ့ စာရင်းတစ်ခုပါ။

#### `tracing.disable()`

ဒီ `Tracing` object ကို disable လုပ်ပေးပါတယ်။

တခြား enable ဖြစ်နေတဲ့ `Tracing` objects တွေက ဖုံးအုပ်မထားတဲ့ — နဲ့ `--trace-event-categories` flag နဲ့ သတ်မှတ်မထားတဲ့ — trace event categories တွေကိုပဲ disable လုပ်မှာ ဖြစ်ပါတယ်။

```mjs
import { createTracing, getEnabledCategories } from 'node:trace_events';
const t1 = createTracing({ categories: ['node', 'v8'] });
const t2 = createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// Prints 'node,node.perf,v8'
console.log(getEnabledCategories());

t2.disable(); // Will only disable emission of the 'node.perf' category

// Prints 'node,v8'
console.log(getEnabledCategories());
```



```cjs
const { createTracing, getEnabledCategories } = require('node:trace_events');
const t1 = createTracing({ categories: ['node', 'v8'] });
const t2 = createTracing({ categories: ['node.perf', 'node'] });
t1.enable();
t2.enable();

// Prints 'node,node.perf,v8'
console.log(getEnabledCategories());

t2.disable(); // Will only disable emission of the 'node.perf' category

// Prints 'node,v8'
console.log(getEnabledCategories());
```

#### `tracing.enable()`

ဒီ `Tracing` object က ဖုံးအုပ်ထားတဲ့ categories အစုံအတွက် ဒီ `Tracing` object ကို enable လုပ်ပေးပါတယ်။

#### `tracing.enabled`

* Type: {boolean} `Tracing` object ကို enable လုပ်ထားမှသာ `true` ဖြစ်ပါတယ်။

### `trace_events.createTracing(options)`

* `options` {Object}
  * `categories` {string\[]} Trace category names တွေရဲ့ array တစ်ခုပါ။ Array ထဲမှာ ပါဝင်တဲ့ တန်ဖိုးတွေက ဖြစ်နိုင်ရင် string အဖြစ် ပြောင်းလဲ (coerce) ပေးပါတယ်။ Coerce လုပ်လို့ မရတဲ့ တန်ဖိုးဆိုရင် error တစ်ခု throw လုပ်ပါလိမ့်မယ်။
* Returns: {Tracing}.

ပေးထားတဲ့ `categories` အစုံအတွက် `Tracing` object တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

```mjs
import { createTracing } from 'node:trace_events';
const categories = ['node.perf', 'node.async_hooks'];
const tracing = createTracing({ categories });
tracing.enable();
// do stuff
tracing.disable();
```



```cjs
const { createTracing } = require('node:trace_events');
const categories = ['node.perf', 'node.async_hooks'];
const tracing = createTracing({ categories });
tracing.enable();
// do stuff
tracing.disable();
```

### `trace_events.getEnabledCategories()`

* Returns: {string}

လက်ရှိ enable ဖြစ်နေတဲ့ trace event categories အားလုံးရဲ့ comma နဲ့ ခြားထားတဲ့ စာရင်းကို ပြန်ပေးပါတယ်။ လက်ရှိ enable ဖြစ်နေတဲ့ trace event categories အစုကို — enable ဖြစ်နေတဲ့ `Tracing` objects အားလုံးရဲ့ _union_ (ပေါင်းစည်းမှု) နဲ့ `--trace-event-categories` flag ကို သုံးပြီး enable လုပ်ထားတဲ့ categories တွေ ပေါင်းစပ်ပြီး ဆုံးဖြတ်ပါတယ်။

အောက်က `test.js` file နဲ့ဆိုရင် — `node --trace-event-categories node.perf test.js` ဆိုတဲ့ command က console ပေါ်မှာ `'node.async_hooks,node.perf'` ကို ပုံနှိပ်ပေးပါလိမ့်မယ်။

```mjs
import { createTracing, getEnabledCategories } from 'node:trace_events';
const t1 = createTracing({ categories: ['node.async_hooks'] });
const t2 = createTracing({ categories: ['node.perf'] });
const t3 = createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(getEnabledCategories());
```



```cjs
const { createTracing, getEnabledCategories } = require('node:trace_events');
const t1 = createTracing({ categories: ['node.async_hooks'] });
const t2 = createTracing({ categories: ['node.perf'] });
const t3 = createTracing({ categories: ['v8'] });

t1.enable();
t2.enable();

console.log(getEnabledCategories());
```

## ဥပမာများ (Examples)

### Inspector ကနေတစ်ဆင့် trace events data များကို စုဆောင်းခြင်း (Collect trace events data by inspector)

```mjs
import { Session } from 'node:inspector';
const session = new Session();
session.connect();

function post(message, data) {
  return new Promise((resolve, reject) => {
    session.post(message, data, (err, result) => {
      if (err)
        reject(new Error(JSON.stringify(err)));
      else
        resolve(result);
    });
  });
}

async function collect() {
  const data = [];
  session.on('NodeTracing.dataCollected', (chunk) => data.push(chunk));
  session.on('NodeTracing.tracingComplete', () => {
    // done
  });
  const traceConfig = { includedCategories: ['v8'] };
  await post('NodeTracing.start', { traceConfig });
  // do something
  setTimeout(() => {
    post('NodeTracing.stop').then(() => {
      session.disconnect();
      console.log(data);
    });
  }, 1000);
}

collect();
```



```cjs
const { Session } = require('node:inspector');
const session = new Session();
session.connect();

function post(message, data) {
  return new Promise((resolve, reject) => {
    session.post(message, data, (err, result) => {
      if (err)
        reject(new Error(JSON.stringify(err)));
      else
        resolve(result);
    });
  });
}

async function collect() {
  const data = [];
  session.on('NodeTracing.dataCollected', (chunk) => data.push(chunk));
  session.on('NodeTracing.tracingComplete', () => {
    // done
  });
  const traceConfig = { includedCategories: ['v8'] };
  await post('NodeTracing.start', { traceConfig });
  // do something
  setTimeout(() => {
    post('NodeTracing.stop').then(() => {
      session.disconnect();
      console.log(data);
    });
  }, 1000);
}

collect();
```

[Performance API]: perf_hooks.md
[V8]: v8.md
[`Worker`]: worker_threads.md#class-worker
[`async_hooks`]: async_hooks.md
