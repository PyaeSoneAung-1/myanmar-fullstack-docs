---
title: "Performance measurement APIs"
description: "node:perf_hooks module — performance measurement APIs — performance.now/timerify/mark/measure, PerformanceObserver, Histogram, monitorEventLoopDelay, ELDHistogram စသည်"
order: 142
source: "https://nodejs.org/api/perf_hooks.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

ဒီ module က W3C [Web Performance APIs][] ရဲ့ အပိုင်းခွဲ (subset) တစ်ခုကို အကောင်အထည်ဖော်ပေးတဲ့အပြင် — Node.js အတွက် သီးသန့်ဖြစ်တဲ့ performance တိုင်းတာမှု (measurements) တွေအတွက် နောက်ထပ် APIs တွေကိုပါ ပံ့ပိုးပေးပါတယ်။

Node.js က အောက်ပါ [Web Performance APIs][] တွေကို ပံ့ပိုးပေးပါတယ်:

* [High Resolution Time][]
* [Performance Timeline][]
* [User Timing][]
* [Resource Timing][]

```mjs
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
doSomeLongRunningProcess(() => {
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
});
```

```cjs
const { PerformanceObserver, performance } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].duration);
});
obs.observe({ type: 'measure' });
performance.measure('Start to Now');

performance.mark('A');
(async function doSomeLongRunningProcess() {
  await new Promise((r) => setTimeout(r, 5000));
  performance.measure('A to Now', 'A');

  performance.mark('B');
  performance.measure('A to B', 'A', 'B');
})();
```

## `perf_hooks.performance`

လက်ရှိ Node.js instance ကနေ performance metrics (စွမ်းဆောင်ရည် တိုင်းတာချက်များ) တွေကို စုဆောင်းဖို့ သုံးနိုင်တဲ့ object တစ်ခုပါ။ Browser တွေမှာရှိတဲ့ [`window.performance`][] နဲ့ ဆင်တူပါတယ်။

### `performance.clearMarks([name])`

* `name` {string}

`name` ကို မပေးထားဘူးဆိုရင် — Performance Timeline ထဲက `PerformanceMark` objects တွေ အားလုံးကို ဖယ်ရှားပါတယ်။ `name` ပေးထားရင်တော့ — အဲဒီနာမည်ရှိတဲ့ mark တစ်ခုကိုပဲ ဖယ်ရှားပါတယ်။

### `performance.clearMeasures([name])`

* `name` {string}

`name` ကို မပေးထားဘူးဆိုရင် — Performance Timeline ထဲက `PerformanceMeasure` objects တွေ အားလုံးကို ဖယ်ရှားပါတယ်။ `name` ပေးထားရင်တော့ — အဲဒီနာမည်ရှိတဲ့ measure တစ်ခုကိုပဲ ဖယ်ရှားပါတယ်။

### `performance.clearResourceTimings([name])`

* `name` {string}

`name` ကို မပေးထားဘူးဆိုရင် — Resource Timeline ထဲက `PerformanceResourceTiming` objects တွေ အားလုံးကို ဖယ်ရှားပါတယ်။ `name` ပေးထားရင်တော့ — အဲဒီနာမည်ရှိတဲ့ resource တစ်ခုကိုပဲ ဖယ်ရှားပါတယ်။

### `performance.eventLoopUtilization([utilization1[, utilization2]])`

* `utilization1` {Object} `eventLoopUtilization()` ဆီကို ယခင် (previous) ခေါ်ဆိုမှုတစ်ခုရဲ့ ရလဒ်ပါ။
* `utilization2` {Object} `utilization1` မတိုင်မီက `eventLoopUtilization()` ဆီကို ယခင် ခေါ်ဆိုမှုတစ်ခုရဲ့ ရလဒ်ပါ။
* Returns: {Object}
  * `idle` {number}
  * `active` {number}
  * `utilization` {number}

ဒါက [`perf_hooks.eventLoopUtilization()`][] ရဲ့ alias (အစားထိုးနာမည်) တစ်ခုပါ။

_ဒီ property က Node.js ရဲ့ extension တစ်ခုပါ။ Web browsers တွေမှာတော့ မရနိုင်ပါ။_

### `performance.getEntries()`

* Returns: {PerformanceEntry\\[]}

`performanceEntry.startTime` နဲ့ စပ်လျဉ်းပြီး အချိန်စဉ်အလိုက် (chronological order) စီစဉ်ထားတဲ့ `PerformanceEntry` objects တွေရဲ့ list တစ်ခုကို ပြန်ပေးပါတယ်။ သတ်မှတ်ထားတဲ့ type (သို့) နာမည် ရှိတဲ့ performance entries တွေကိုပဲ စိတ်ဝင်စားတယ်ဆိုရင် — `performance.getEntriesByType()` နဲ့ `performance.getEntriesByName()` ကို ကြည့်ပါ။

### `performance.getEntriesByName(name[, type])`

* `name` {string}
* `type` {string}
* Returns: {PerformanceEntry\\[]}

`performanceEntry.startTime` နဲ့ စပ်လျဉ်းပြီး အချိန်စဉ်အလိုက် စီစဉ်ထားတဲ့ — `performanceEntry.name` က `name` နဲ့ ညီနေတဲ့ — ပြီးတော့ ရွေးချယ်နိုင်တဲ့အနေနဲ့ `performanceEntry.entryType` က `type` နဲ့ ညီနေတဲ့ — `PerformanceEntry` objects တွေရဲ့ list တစ်ခုကို ပြန်ပေးပါတယ်။

### `performance.getEntriesByType(type)`

* `type` {string}
* Returns: {PerformanceEntry\\[]}

`performanceEntry.startTime` နဲ့ စပ်လျဉ်းပြီး အချိန်စဉ်အလိုက် စီစဉ်ထားတဲ့ — `performanceEntry.entryType` က `type` နဲ့ ညီနေတဲ့ — `PerformanceEntry` objects တွေရဲ့ list တစ်ခုကို ပြန်ပေးပါတယ်။

### `performance.mark(name[, options])`

* `name` {string}
* `options` {Object}
  * `detail` {any} Mark နဲ့အတူ ထည့်သွင်းရမယ့် နောက်ထပ် optional detail ပါ။
  * `startTime` {number} Mark ရဲ့ အချိန်အဖြစ် သုံးမယ့် optional timestamp တစ်ခုပါ။ **Default**: `performance.now()`။

Performance Timeline ထဲမှာ `PerformanceMark` entry အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ `PerformanceMark` ဆိုတာ `PerformanceEntry` ရဲ့ subclass တစ်ခု ဖြစ်ပြီး — ၎င်းရဲ့ `performanceEntry.entryType` က အမြဲတမ်း `'mark'` ဖြစ်ကာ `performanceEntry.duration` ကတော့ အမြဲတမ်း `0` ဖြစ်ပါတယ်။ Performance marks တွေကို Performance Timeline ထဲက အရေးပါတဲ့ သီးခြား အခိုက်အတန့် (significant moments) တွေကို မှတ်သားဖို့ သုံးပါတယ်။

ဖန်တီးလိုက်တဲ့ `PerformanceMark` entry ကို global Performance Timeline ထဲ ထည့်သွင်းပြီး — `performance.getEntries`, `performance.getEntriesByName` နဲ့ `performance.getEntriesByType` တို့နဲ့ မေးမြန်းနိုင်ပါတယ်။ Observation (စောင့်ကြည့်လေ့လာခြင်း) လုပ်ဆောင်ပြီးသွားတဲ့အခါ — entries တွေကို `performance.clearMarks` နဲ့ global Performance Timeline ကနေ ကိုယ်တိုင် (manually) ရှင်းလင်းပေးသင့်ပါတယ်။

### `performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode, bodyInfo, responseStatus[, deliveryType])`

* `timingInfo` {Object} [Fetch Timing Info][]
* `requestedUrl` {string} Resource ၏ url ပါ။
* `initiatorType` {string} Initiator ၏ နာမည်ပါ။ ဥပမာ: 'fetch'
* `global` {Object}
* `cacheMode` {string} Cache mode က empty string ('') (သို့) 'local' ဖြစ်ရပါမယ်။
* `bodyInfo` {Object} [Fetch Response Body Info][]
* `responseStatus` {number} Response ၏ status code ပါ။
* `deliveryType` {string} Delivery type ပါ။  **Default:** `''`။

_ဒီ property က Node.js ရဲ့ extension တစ်ခုပါ။ Web browsers တွေမှာတော့ မရနိုင်ပါ။_

Resource Timeline ထဲမှာ `PerformanceResourceTiming` entry အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ `PerformanceResourceTiming` ဆိုတာ `PerformanceEntry` ရဲ့ subclass တစ်ခု ဖြစ်ပြီး — ၎င်းရဲ့ `performanceEntry.entryType` က အမြဲတမ်း `'resource'` ဖြစ်ပါတယ်။ Performance resources တွေကို Resource Timeline ထဲက အခိုက်အတန့်တွေကို မှတ်သားဖို့ သုံးပါတယ်။

ဖန်တီးလိုက်တဲ့ `PerformanceMark` entry ကို global Resource Timeline ထဲ ထည့်သွင်းပြီး — `performance.getEntries`, `performance.getEntriesByName` နဲ့ `performance.getEntriesByType` တို့နဲ့ မေးမြန်းနိုင်ပါတယ်။ Observation လုပ်ဆောင်ပြီးသွားတဲ့အခါ — entries တွေကို `performance.clearResourceTimings` နဲ့ global Performance Timeline ကနေ ကိုယ်တိုင် ရှင်းလင်းပေးသင့်ပါတယ်။

### `performance.measure(name[, startMarkOrOptions[, endMark]])`

* `name` {string}
* `startMarkOrOptions` {string|Object} Optional (ထည့်ရန် မလိုအပ်) ပါ။
  * `detail` {any} Measure နဲ့အတူ ထည့်သွင်းရမယ့် နောက်ထပ် optional detail ပါ။
  * `duration` {number} Start နဲ့ end times တွေကြားက ကြာချိန် (duration) ပါ။
  * `end` {number|string} End time အဖြစ် သုံးမယ့် timestamp (သို့) ယခင် မှတ်တမ်းတင်ထားတဲ့ mark တစ်ခုကို ခွဲခြားသတ်မှတ်ပေးတဲ့ string တစ်ခုပါ။
  * `start` {number|string} Start time အဖြစ် သုံးမယ့် timestamp (သို့) ယခင် မှတ်တမ်းတင်ထားတဲ့ mark တစ်ခုကို ခွဲခြားသတ်မှတ်ပေးတဲ့ string တစ်ခုပါ။
* `endMark` {string} Optional ပါ။ `startMarkOrOptions` က {Object} တစ်ခု ဖြစ်နေရင် ချန်လှပ်ထားရပါမယ်။

Performance Timeline ထဲမှာ `PerformanceMeasure` entry အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ `PerformanceMeasure` ဆိုတာ `PerformanceEntry` ရဲ့ subclass တစ်ခု ဖြစ်ပြီး — ၎င်းရဲ့ `performanceEntry.entryType` က အမြဲတမ်း `'measure'` ဖြစ်ကာ `performanceEntry.duration` က `startMark` ကနေ `endMark` အထိ ကုန်လွန်သွားတဲ့ milliseconds အရေအတွက်ကို တိုင်းတာပါတယ်။

`startMark` argument က Performance Timeline ထဲက _ရှိပြီးသား (existing)_ `PerformanceMark` တစ်ခုခုကို ခွဲခြားသတ်မှတ်နိုင်သလို — `PerformanceNodeTiming` class က ပေးထားတဲ့ timestamp properties တွေထဲက တစ်ခုခုကိုလည်း ခွဲခြားသတ်မှတ်နိုင်ပါတယ်။ နာမည်ပေးထားတဲ့ `startMark` မရှိဘူးဆိုရင် — error တစ်ခုကို throw လုပ်ပါတယ်။

Optional ဖြစ်တဲ့ `endMark` argument က Performance Timeline ထဲက _ရှိပြီးသား_ `PerformanceMark` တစ်ခုခု (သို့) `PerformanceNodeTiming` class က ပေးထားတဲ့ timestamp properties တွေထဲက တစ်ခုခုကို ခွဲခြားသတ်မှတ်ရပါမယ်။ Parameter တစ်ခုမှ မပေးပို့ဘူးဆိုရင် — `endMark` က `performance.now()` ဖြစ်ပါလိမ့်မယ်။ မဟုတ်ရင် — နာမည်ပေးထားတဲ့ `endMark` မရှိဘူးဆိုရင် error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဖန်တီးလိုက်တဲ့ `PerformanceMeasure` entry ကို global Performance Timeline ထဲ ထည့်သွင်းပြီး — `performance.getEntries`, `performance.getEntriesByName` နဲ့ `performance.getEntriesByType` တို့နဲ့ မေးမြန်းနိုင်ပါတယ်။ Observation လုပ်ဆောင်ပြီးသွားတဲ့အခါ — entries တွေကို `performance.clearMeasures` နဲ့ global Performance Timeline ကနေ ကိုယ်တိုင် ရှင်းလင်းပေးသင့်ပါတယ်။

### `performance.nodeTiming`

* Type: {PerformanceNodeTiming}

_ဒီ property က Node.js ရဲ့ extension တစ်ခုပါ။ Web browsers တွေမှာတော့ မရနိုင်ပါ။_

`PerformanceNodeTiming` class ရဲ့ instance တစ်ခု ဖြစ်ပြီး — Node.js ရဲ့ သီးခြား လုပ်ဆောင်မှုဆိုင်ရာ မှတ်တိုင်များ (operational milestones) အတွက် performance metrics တွေကို ပေးပါတယ်။

### `performance.now()`

* Returns: {number}

လက်ရှိ high resolution millisecond timestamp ကို ပြန်ပေးပါတယ် — အဲဒီမှာ `0` က လက်ရှိ `node` process စတင်ချိန်ကို ကိုယ်စားပြုပါတယ်။

### `performance.setResourceTimingBufferSize(maxSize)`

Global performance resource timing buffer ရဲ့ အရွယ်အစားကို — "resource" type ရှိတဲ့ performance entry objects တွေ သတ်မှတ်ထားတဲ့ အရေအတွက်အထိ သတ်မှတ်ပေးပါတယ်။

ပုံမှန်အားဖြင့် max buffer size ကို 250 အဖြစ် သတ်မှတ်ထားပါတယ်။

### `performance.timeOrigin`

* Type: {number}

[`timeOrigin`][] က လက်ရှိ `node` process စတင်ခဲ့တဲ့ high resolution millisecond timestamp ကို သတ်မှတ်ပေးပါတယ် — Unix time နဲ့ တိုင်းတာပါတယ်။

### `performance.timerify(fn[, options])`

* `fn` {Function}
* `options` {Object}
  * `histogram` {RecordableHistogram} `perf_hooks.createHistogram()` ကို သုံးပြီး ဖန်တီးထားတဲ့ histogram object တစ်ခုပါ — runtime durations တွေကို nanoseconds နဲ့ မှတ်တမ်းတင်ပါလိမ့်မယ်။

ဒါက [`perf_hooks.timerify()`][] ရဲ့ alias (အစားထိုးနာမည်) တစ်ခုပါ။

_ဒီ property က Node.js ရဲ့ extension တစ်ခုပါ။ Web browsers တွေမှာတော့ မရနိုင်ပါ။_

### `performance.toJSON()`

`performance` object ရဲ့ JSON ကိုယ်စားပြုမှု (representation) ဖြစ်တဲ့ object တစ်ခုပါ။ Browser တွေမှာရှိတဲ့ [`window.performance.toJSON`][] နဲ့ ဆင်တူပါတယ်။

#### Event: `'resourcetimingbufferfull'`

`'resourcetimingbufferfull'` event က global performance resource timing buffer ပြည့်သွားတဲ့အခါ fire လုပ်ပါတယ်။ Performance timeline buffer ထဲကို entries တွေ နောက်ထပ် ထည့်လို့ရအောင် — event listener ထဲမှာ `performance.setResourceTimingBufferSize()` နဲ့ resource timing buffer size ကို ချိန်ညှိပါ (သို့) `performance.clearResourceTimings()` နဲ့ buffer ကို ရှင်းလင်းပါ။

## Class: `PerformanceEntry`

ဒီ class ရဲ့ constructor ကို user တွေဆီကို တိုက်ရိုက် ထုတ်ဖော်မထားပါဘူး။

### `performanceEntry.duration`

* Type: {number}

ဒီ entry အတွက် ကုန်လွန်သွားတဲ့ milliseconds စုစုပေါင်း အရေအတွက်ပါ။ ဒီတန်ဖိုးက Performance Entry type တိုင်းအတွက်တော့ အဓိပ္ပာယ် ရှိမှာ မဟုတ်ပါဘူး။

### `performanceEntry.entryType`

* Type: {string}

Performance entry ရဲ့ type ပါ။ အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:

* `'dns'` (Node.js only)
* `'function'` (Node.js only)
* `'gc'` (Node.js only)
* `'http2'` (Node.js only)
* `'http'` (Node.js only)
* `'mark'` (available on the Web)
* `'measure'` (available on the Web)
* `'net'` (Node.js only)
* `'node'` (Node.js only)
* `'resource'` (available on the Web)

### `performanceEntry.name`

* Type: {string}

Performance entry ရဲ့ နာမည်ပါ။

### `performanceEntry.startTime`

* Type: {number}

Performance Entry ရဲ့ စတင်ချိန်ကို မှတ်သားထားတဲ့ high resolution millisecond timestamp ပါ။

## Class: `PerformanceMark`

* Extends: {PerformanceEntry}

`Performance.mark()` method ကနေ ဖန်တီးထားတဲ့ marks တွေကို ထုတ်ဖော်ပေးပါတယ်။

### `performanceMark.detail`

* Type: {any}

`Performance.mark()` method နဲ့ ဖန်တီးတဲ့အခါ သတ်မှတ်ပေးထားတဲ့ နောက်ထပ် detail ပါ။

## Class: `PerformanceMeasure`

* Extends: {PerformanceEntry}

`Performance.measure()` method ကနေ ဖန်တီးထားတဲ့ measures တွေကို ထုတ်ဖော်ပေးပါတယ်။

ဒီ class ရဲ့ constructor ကို user တွေဆီကို တိုက်ရိုက် ထုတ်ဖော်မထားပါဘူး။

### `performanceMeasure.detail`

* Type: {any}

`Performance.measure()` method နဲ့ ဖန်တီးတဲ့အခါ သတ်မှတ်ပေးထားတဲ့ နောက်ထပ် detail ပါ။

## Class: `PerformanceNodeEntry`

* Extends: {PerformanceEntry}

_ဒီ class က Node.js ရဲ့ extension တစ်ခုပါ။ Web browsers တွေမှာတော့ မရနိုင်ပါ။_

အသေးစိတ်ကျတဲ့ Node.js timing data တွေကို ပေးပါတယ်။

ဒီ class ရဲ့ constructor ကို user တွေဆီကို တိုက်ရိုက် ထုတ်ဖော်မထားပါဘူး။

### `performanceNodeEntry.detail`

* Type: {any}

`entryType` နဲ့ သက်ဆိုင်တဲ့ နောက်ထပ် detail ပါ။

### `performanceNodeEntry.flags`

> Stability: 0 - Deprecated: Use `performanceNodeEntry.detail` instead.

* Type: {number}

`performanceEntry.entryType` က `'gc'` နဲ့ ညီနေတဲ့အခါ — `performance.flags` property ထဲမှာ garbage collection (အမှိုက် စုဆောင်းခြင်း) လုပ်ဆောင်မှုနဲ့ ပတ်သက်တဲ့ နောက်ထပ် အချက်အလက်တွေ ပါဝင်ပါတယ်။ တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:

* `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
* `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
* `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
* `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
* `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
* `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
* `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### `performanceNodeEntry.kind`

> Stability: 0 - Deprecated: Use `performanceNodeEntry.detail` instead.

* Type: {number}

`performanceEntry.entryType` က `'gc'` နဲ့ ညီနေတဲ့အခါ — `performance.kind` property က ဖြစ်ပွားခဲ့တဲ့ garbage collection လုပ်ဆောင်မှုရဲ့ type ကို ခွဲခြားသတ်မှတ်ပေးပါတယ်။ တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:

* `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
* `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
* `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR_MARK_SWEEP`
* `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
* `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`

### Garbage Collection ('gc') ဆိုင်ရာ အသေးစိတ် (Garbage Collection ('gc') Details)

`performanceEntry.type` က `'gc'` နဲ့ ညီနေတဲ့အခါ — `performanceNodeEntry.detail` property က properties နှစ်ခု ပါဝင်တဲ့ {Object} တစ်ခု ဖြစ်ပါလိမ့်မယ်:

* `kind` {number} အောက်ပါတို့ထဲက တစ်ခု:
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR`
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR`
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR_MARK_SWEEP`
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL`
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB`
* `flags` {number} အောက်ပါတို့ထဲက တစ်ခု:
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO`
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED`
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED`
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING`
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE`
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY`
  * `perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE`

### HTTP ('http') ဆိုင်ရာ အသေးစိတ် (HTTP ('http') Details)

`performanceEntry.type` က `'http'` နဲ့ ညီနေတဲ့အခါ — `performanceNodeEntry.detail` property က နောက်ထပ် အချက်အလက်တွေ ပါဝင်တဲ့ {Object} တစ်ခု ဖြစ်ပါလိမ့်မယ်။

`performanceEntry.name` က `HttpClient` နဲ့ ညီနေတဲ့အခါ — `detail` ထဲမှာ `req`, `res` ဆိုတဲ့ properties တွေ ပါဝင်ပါလိမ့်မယ်။ `req` property က `method`, `url`, `headers` တို့ ပါဝင်တဲ့ {Object} တစ်ခု ဖြစ်ပြီး — `res` property ကတော့ `statusCode`, `statusMessage`, `headers` တို့ ပါဝင်တဲ့ {Object} တစ်ခု ဖြစ်ပါလိမ့်မယ်။

`performanceEntry.name` က `HttpRequest` နဲ့ ညီနေတဲ့အခါ — `detail` ထဲမှာ `req`, `res` ဆိုတဲ့ properties တွေ ပါဝင်ပါလိမ့်မယ်။ `req` property က `method`, `url`, `headers` တို့ ပါဝင်တဲ့ {Object} တစ်ခု ဖြစ်ပြီး — `res` property ကတော့ `statusCode`, `statusMessage`, `headers` တို့ ပါဝင်တဲ့ {Object} တစ်ခု ဖြစ်ပါလိမ့်မယ်။

ဒါက နောက်ထပ် memory overhead (မှတ်ဉာဏ် ပိုသုံးစွဲမှု) ကို ဖြစ်စေနိုင်တာမို့ — diagnostic (ရောဂါရှာဖွေခြင်း) ရည်ရွယ်ချက်တွေအတွက်သာ သုံးသင့်ပြီး — production မှာ ပုံမှန် (default) အနေနဲ့ ဖွင့်ထားခဲ့လို့ မရပါဘူး။

### HTTP/2 ('http2') ဆိုင်ရာ အသေးစိတ် (HTTP/2 ('http2') Details)

`performanceEntry.type` က `'http2'` နဲ့ ညီနေတဲ့အခါ — `performanceNodeEntry.detail` property က နောက်ထပ် performance အချက်အလက်တွေ ပါဝင်တဲ့ {Object} တစ်ခု ဖြစ်ပါလိမ့်မယ်။

`performanceEntry.name` က `Http2Stream` နဲ့ ညီနေတဲ့အခါ — `detail` ထဲမှာ အောက်ပါ properties တွေ ပါဝင်ပါလိမ့်မယ်:

* `bytesRead` {number} ဒီ `Http2Stream` အတွက် လက်ခံရရှိခဲ့တဲ့ `DATA` frame bytes အရေအတွက်ပါ။
* `bytesWritten` {number} ဒီ `Http2Stream` အတွက် ပို့လွှတ်ခဲ့တဲ့ `DATA` frame bytes အရေအတွက်ပါ။
* `id` {number} သက်ဆိုင်တဲ့ `Http2Stream` ရဲ့ identifier ပါ။
* `timeToFirstByte` {number} `PerformanceEntry` ရဲ့ `startTime` နဲ့ ပထမ `DATA` frame ကို လက်ခံရရှိချိန် အကြားမှာ ကုန်လွန်သွားတဲ့ milliseconds အရေအတွက်ပါ။
* `timeToFirstByteSent` {number} `PerformanceEntry` ရဲ့ `startTime` နဲ့ ပထမ `DATA` frame ကို ပို့လွှတ်ချိန် အကြားမှာ ကုန်လွန်သွားတဲ့ milliseconds အရေအတွက်ပါ။
* `timeToFirstHeader` {number} `PerformanceEntry` ရဲ့ `startTime` နဲ့ ပထမ header ကို လက်ခံရရှိချိန် အကြားမှာ ကုန်လွန်သွားတဲ့ milliseconds အရေအတွက်ပါ။

`performanceEntry.name` က `Http2Session` နဲ့ ညီနေတဲ့အခါ — `detail` ထဲမှာ အောက်ပါ properties တွေ ပါဝင်ပါလိမ့်မယ်:

* `bytesRead` {number} ဒီ `Http2Session` အတွက် လက်ခံရရှိခဲ့တဲ့ bytes အရေအတွက်ပါ။
* `bytesWritten` {number} ဒီ `Http2Session` အတွက် ပို့လွှတ်ခဲ့တဲ့ bytes အရေအတွက်ပါ။
* `framesReceived` {number} `Http2Session` က လက်ခံရရှိခဲ့တဲ့ HTTP/2 frames အရေအတွက်ပါ။
* `framesSent` {number} `Http2Session` က ပို့လွှတ်ခဲ့တဲ့ HTTP/2 frames အရေအတွက်ပါ။
* `maxConcurrentStreams` {number} `Http2Session` ရဲ့ သက်တမ်းတစ်လျှောက် တစ်ပြိုင်နက် ဖွင့်ထားနိုင်တဲ့ streams အများဆုံး အရေအတွက်ပါ။
* `pingRTT` {number} `PING` frame တစ်ခု ပို့လွှတ်ချိန်ကနေ ၎င်းရဲ့ acknowledgment (အတည်ပြုချက်) ကို လက်ခံရရှိချိန်အထိ ကုန်လွန်သွားတဲ့ milliseconds အရေအတွက်ပါ။ `Http2Session` ပေါ်မှာ `PING` frame တစ်ခု ပို့လွှတ်ထားခဲ့မှသာ ပါဝင်ပါတယ်။
* `streamAverageDuration` {number} `Http2Stream` instances အားလုံးရဲ့ ပျမ်းမျှ ကြာချိန် (milliseconds နဲ့) ပါ။
* `streamCount` {number} `Http2Session` က လုပ်ဆောင်ခဲ့တဲ့ `Http2Stream` instances အရေအတွက်ပါ။
* `type` {string} `Http2Session` ရဲ့ type ကို ခွဲခြားသတ်မှတ်ဖို့ `'server'` (သို့) `'client'` နှစ်ခုအနက် တစ်ခုပါ။

### Timerify ('function') ဆိုင်ရာ အသေးစိတ် (Timerify ('function') Details)

`performanceEntry.type` က `'function'` နဲ့ ညီနေတဲ့အခါ — `performanceNodeEntry.detail` property က {Array} တစ်ခု ဖြစ်ပြီး — time လုပ်ထားတဲ့ function ဆီကို ပေးပို့လိုက်တဲ့ input arguments တွေကို စာရင်းပြုစုထားပါလိမ့်မယ်။

### Net ('net') ဆိုင်ရာ အသေးစိတ် (Net ('net') Details)

`performanceEntry.type` က `'net'` နဲ့ ညီနေတဲ့အခါ — `performanceNodeEntry.detail` property က နောက်ထပ် အချက်အလက်တွေ ပါဝင်တဲ့ {Object} တစ်ခု ဖြစ်ပါလိမ့်မယ်။

`performanceEntry.name` က `connect` နဲ့ ညီနေတဲ့အခါ — `detail` ထဲမှာ `host`, `port` ဆိုတဲ့ properties တွေ ပါဝင်ပါလိမ့်မယ်။

### DNS ('dns') ဆိုင်ရာ အသေးစိတ် (DNS ('dns') Details)

`performanceEntry.type` က `'dns'` နဲ့ ညီနေတဲ့အခါ — `performanceNodeEntry.detail` property က နောက်ထပ် အချက်အလက်တွေ ပါဝင်တဲ့ {Object} တစ်ခု ဖြစ်ပါလိမ့်မယ်။

`performanceEntry.name` က `lookup` နဲ့ ညီနေတဲ့အခါ — `detail` ထဲမှာ `hostname`, `family`, `hints`, `verbatim`, `addresses` ဆိုတဲ့ properties တွေ ပါဝင်ပါလိမ့်မယ်။

`performanceEntry.name` က `lookupService` နဲ့ ညီနေတဲ့အခါ — `detail` ထဲမှာ `host`, `port`, `hostname`, `service` ဆိုတဲ့ properties တွေ ပါဝင်ပါလိမ့်မယ်။

`performanceEntry.name` က `queryxxx` (သို့) `getHostByAddr` နဲ့ ညီနေတဲ့အခါ — `detail` ထဲမှာ `host`, `ttl`, `result` ဆိုတဲ့ properties တွေ ပါဝင်ပါလိမ့်မယ်။ `result` ရဲ့ တန်ဖိုးက `queryxxx` (သို့) `getHostByAddr` ရဲ့ ရလဒ်နဲ့ အတူတူပါပဲ။

## Class: `PerformanceNodeTiming`

* Extends: {PerformanceEntry}

_ဒီ property က Node.js ရဲ့ extension တစ်ခုပါ။ Web browsers တွေမှာတော့ မရနိုင်ပါ။_

Node.js ကိုယ်တိုင်အတွက် timing အသေးစိတ်တွေကို ပေးပါတယ်။ ဒီ class ရဲ့ constructor ကို user တွေဆီကို ထုတ်ဖော်မထားပါဘူး။

### `performanceNodeTiming.bootstrapComplete`

* Type: {number}

Node.js process က bootstrapping (စတင် တည်ဆောက်မှု) ပြီးစီးခဲ့တဲ့ high resolution millisecond timestamp ပါ။ Bootstrapping မပြီးစီးသေးဘူးဆိုရင် — ဒီ property က `-1` တန်ဖိုး ရှိပါတယ်။

### `performanceNodeTiming.environment`

* Type: {number}

Node.js environment ကို စတင်သတ်မှတ် (initialize) လုပ်ခဲ့တဲ့ high resolution millisecond timestamp ပါ။

### `performanceNodeTiming.idleTime`

* Type: {number}

Event loop က ၎င်းရဲ့ event provider (ဥပမာ `epoll_wait`) အတွင်းမှာ idle ဖြစ်ခဲ့တဲ့ အချိန်ပမာဏကို ဖော်ပြတဲ့ high resolution millisecond timestamp ပါ။ ဒါက CPU usage ကို ထည့်သွင်း စဉ်းစားမထားပါဘူး။ Event loop မစတင်ရသေးဘူးဆိုရင် (ဥပမာ main script ရဲ့ ပထမ tick မှာ) — ဒီ property က `0` တန်ဖိုး ရှိပါတယ်။

### `performanceNodeTiming.loopExit`

* Type: {number}

Node.js event loop က ထွက်ပေါက် (exit) ဖြစ်ခဲ့တဲ့ high resolution millisecond timestamp ပါ။ Event loop မထွက်သေးဘူးဆိုရင် — ဒီ property က `-1` တန်ဖိုး ရှိပါတယ်။ [`'exit'`][] event ရဲ့ handler တစ်ခုထဲမှာမှသာ `-1` မဟုတ်တဲ့ တန်ဖိုး ရှိနိုင်ပါတယ်။

### `performanceNodeTiming.loopStart`

* Type: {number}

Node.js event loop စတင်ခဲ့တဲ့ high resolution millisecond timestamp ပါ။ Event loop မစတင်ရသေးဘူးဆိုရင် (ဥပမာ main script ရဲ့ ပထမ tick မှာ) — ဒီ property က `-1` တန်ဖိုး ရှိပါတယ်။

### `performanceNodeTiming.nodeStart`

* Type: {number}

Node.js process ကို စတင်သတ်မှတ် (initialize) လုပ်ခဲ့တဲ့ high resolution millisecond timestamp ပါ။

### `performanceNodeTiming.uvMetricsInfo`

* Returns: {Object}
  * `loopCount` {number} Event loop iterations (အလှည့်များ) အရေအတွက်ပါ။
  * `events` {number} Event handler က လုပ်ဆောင်ပြီးသား events အရေအတွက်ပါ။
  * `eventsWaiting` {number} Event provider ကို ခေါ်ယူလိုက်တဲ့အခါ လုပ်ဆောင်ဖို့ စောင့်ဆိုင်းနေတဲ့ events အရေအတွက်ပါ။

ဒါက `uv_metrics_info` function ရဲ့ wrapper တစ်ခုပါ။ လက်ရှိ event loop metrics အစုကို ပြန်ပေးပါတယ်။

လက်ရှိ loop iteration အတွင်း စီစဉ်ထားတဲ့ operations တွေ အားလုံး မပြီးဆုံးခင် metrics တွေ စုဆောင်းမိခြင်းကို ရှောင်ရှားဖို့ — ဒီ property ကို `setImmediate` နဲ့ စီစဉ်ထားတဲ့ (scheduled) function တစ်ခုရဲ့ အတွင်းမှာ သုံးဖို့ အကြံပြုထားပါတယ်။

```cjs
const { performance } = require('node:perf_hooks');

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```

```mjs
import { performance } from 'node:perf_hooks';

setImmediate(() => {
  console.log(performance.nodeTiming.uvMetricsInfo);
});
```

### `performanceNodeTiming.v8Start`

* Type: {number}

V8 platform ကို စတင်သတ်မှတ် (initialize) လုပ်ခဲ့တဲ့ high resolution millisecond timestamp ပါ။

## Class: `PerformanceResourceTiming`

* Extends: {PerformanceEntry}

Application တစ်ခုရဲ့ resources တွေကို load လုပ်ခြင်းနဲ့ ပတ်သက်တဲ့ အသေးစိတ် network timing data တွေကို ပေးပါတယ်။

ဒီ class ရဲ့ constructor ကို user တွေဆီကို တိုက်ရိုက် ထုတ်ဖော်မထားပါဘူး။

### `performanceResourceTiming.workerStart`

* Type: {number}

`fetch` request ကို dispatch မလုပ်ခင် ချက်ချင်း အချိန်ကို ဖော်ပြတဲ့ high resolution millisecond timestamp ပါ။ Resource ကို worker တစ်ခုက ကြားဖြတ် (intercept) မလုပ်ထားဘူးဆိုရင် — ဒီ property က အမြဲတမ်း 0 ကို ပြန်ပေးပါလိမ့်မယ်။

### `performanceResourceTiming.redirectStart`

* Type: {number}

Redirect ကို အစပြုလုပ်တဲ့ fetch ရဲ့ start time ကို ကိုယ်စားပြုတဲ့ high resolution millisecond timestamp ပါ။

### `performanceResourceTiming.redirectEnd`

* Type: {number}

နောက်ဆုံး redirect ရဲ့ response ရဲ့ နောက်ဆုံး byte ကို လက်ခံရရှိပြီးနောက် ချက်ချင်း မှတ်တမ်းတင်မယ့် high resolution millisecond timestamp ပါ။

### `performanceResourceTiming.fetchStart`

* Type: {number}

Node.js က resource ကို fetch လုပ်တော့မယ့် မတိုင်ခင် ချက်ချင်း အချိန်ကို ဖော်ပြတဲ့ high resolution millisecond timestamp ပါ။

### `performanceResourceTiming.domainLookupStart`

* Type: {number}

Node.js က resource အတွက် domain name lookup စတင်တော့မယ့် မတိုင်ခင် ချက်ချင်း အချိန်ကို ဖော်ပြတဲ့ high resolution millisecond timestamp ပါ။

### `performanceResourceTiming.domainLookupEnd`

* Type: {number}

Node.js က resource အတွက် domain name lookup ပြီးဆုံးသွားပြီးနောက် ချက်ချင်း အချိန်ကို ကိုယ်စားပြုတဲ့ high resolution millisecond timestamp ပါ။

### `performanceResourceTiming.connectStart`

* Type: {number}

Node.js က resource ကို ရယူဖို့ server ဆီ connection တစ်ခု စတင်တည်ဆောက်တော့မယ့် မတိုင်ခင် ချက်ချင်း အချိန်ကို ကိုယ်စားပြုတဲ့ high resolution millisecond timestamp ပါ။

### `performanceResourceTiming.connectEnd`

* Type: {number}

Node.js က resource ကို ရယူဖို့ server ဆီ connection တစ်ခု တည်ဆောက်ပြီးဆုံးသွားပြီးနောက် ချက်ချင်း အချိန်ကို ကိုယ်စားပြုတဲ့ high resolution millisecond timestamp ပါ။

### `performanceResourceTiming.secureConnectionStart`

* Type: {number}

Node.js က လက်ရှိ connection ကို လုံခြုံအောင် (secure) လုပ်ဖို့ handshake process စတင်တော့မယ့် မတိုင်ခင် ချက်ချင်း အချိန်ကို ကိုယ်စားပြုတဲ့ high resolution millisecond timestamp ပါ။

### `performanceResourceTiming.requestStart`

* Type: {number}

Node.js က server ဆီကနေ response ရဲ့ ပထမ byte ကို လက်ခံရရှိတော့မယ့် မတိုင်ခင် ချက်ချင်း အချိန်ကို ကိုယ်စားပြုတဲ့ high resolution millisecond timestamp ပါ။

### `performanceResourceTiming.responseEnd`

* Type: {number}

Node.js က resource ရဲ့ နောက်ဆုံး byte ကို လက်ခံရရှိပြီးနောက် (သို့) transport connection ပိတ်သွားတော့မယ့် မတိုင်ခင် ချက်ချင်း အချိန် — ဘယ်ဟာ အရင်ဖြစ်ဖြစ် အဲဒါကို ကိုယ်စားပြုတဲ့ high resolution millisecond timestamp ပါ။

### `performanceResourceTiming.transferSize`

* Type: {number}

Fetch လုပ်ထားတဲ့ resource ရဲ့ အရွယ်အစား (octets နဲ့) ကို ကိုယ်စားပြုတဲ့ နံပါတ်တစ်ခုပါ။ ဒီအရွယ်အစားထဲမှာ response header fields တွေ နဲ့ response payload body ပါ ပါဝင်ပါတယ်။

### `performanceResourceTiming.encodedBodySize`

* Type: {number}

Fetch (HTTP (သို့) cache) ကနေ လက်ခံရရှိတဲ့ payload body ရဲ့ အရွယ်အစား (octets နဲ့) ကို ကိုယ်စားပြုတဲ့ နံပါတ်တစ်ခုပါ — ကျင့်သုံးထားတဲ့ content-codings တွေကို မဖယ်ရှားခင်က အရွယ်အစားပါ။

### `performanceResourceTiming.decodedBodySize`

* Type: {number}

Fetch (HTTP (သို့) cache) ကနေ လက်ခံရရှိတဲ့ message body ရဲ့ အရွယ်အစား (octets နဲ့) ကို ကိုယ်စားပြုတဲ့ နံပါတ်တစ်ခုပါ — ကျင့်သုံးထားတဲ့ content-codings တွေကို ဖယ်ရှားပြီးနောက်က အရွယ်အစားပါ။

### `performanceResourceTiming.toJSON()`

`PerformanceResourceTiming` object ရဲ့ JSON ကိုယ်စားပြုမှု ဖြစ်တဲ့ `object` တစ်ခုကို ပြန်ပေးပါတယ်။

## Class: `PerformanceObserver`

### `PerformanceObserver.supportedEntryTypes`

* Type: {string\\[]}

ပံ့ပိုးထားတဲ့ types တွေကို ရယူပါတယ်။

### `new PerformanceObserver(callback)`

* `callback` {Function}
  * `list` {PerformanceObserverEntryList}
  * `observer` {PerformanceObserver}

`PerformanceObserver` objects တွေက — Performance Timeline ထဲကို `PerformanceEntry` instances အသစ်တွေ ထည့်သွင်းခံရတဲ့အခါ notifications တွေကို ပေးပါတယ်။

```mjs
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```

```cjs
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```

`PerformanceObserver` instances တွေက သူတို့ကိုယ်ပိုင် နောက်ထပ် performance overhead (စွမ်းဆောင်ရည် ပိုသုံးစွဲမှု) ကို ဖြစ်ပေါ်စေတာမို့ — instances တွေကို notifications တွေမှာ အကန့်အသတ်မရှိ subscribe လုပ်ထားခဲ့လို့ မသင့်ပါဘူး။ User တွေက observers တွေ မလိုအပ်တော့တာနဲ့ ချက်ချင်း disconnect လုပ်သင့်ပါတယ်။

`PerformanceObserver` တစ်ခုက `PerformanceEntry` instances အသစ်တွေအကြောင်း notified (အကြောင်းကြားခြင်း) လုပ်ခံရတဲ့အခါ `callback` ကို ခေါ်ယူပါတယ်။ Callback က `PerformanceObserverEntryList` instance တစ်ခုနဲ့ `PerformanceObserver` ဆီကို reference တစ်ခုကို လက်ခံရရှိပါတယ်။

### `performanceObserver.disconnect()`

`PerformanceObserver` instance ကို notifications အားလုံးကနေ ချိတ်ဆက်မှု ဖြုတ်ပစ် (disconnect) လုပ်ပါတယ်။

### `performanceObserver.observe(options)`

* `options` {Object}
  * `type` {string} {PerformanceEntry} type တစ်ခုတည်းပါ။ `entryTypes` ကို သတ်မှတ်ပြီးသား ဖြစ်နေရင် ဒါကို ပေးလို့ မရပါဘူး။
  * `entryTypes` {string\\[]} Observer က စိတ်ဝင်စားတဲ့ {PerformanceEntry} instances တွေရဲ့ types တွေကို ခွဲခြားသတ်မှတ်ပေးတဲ့ strings တွေရဲ့ array တစ်ခုပါ။ မပေးထားဘူးဆိုရင် error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။
  * `buffered` {boolean} `true` ဆိုရင် — observer callback ကို global မှာ buffered လုပ်ထားတဲ့ `PerformanceEntry` entries တွေရဲ့ list တစ်ခုနဲ့အတူ ခေါ်ယူပါတယ်။ `false` ဆိုရင် — အဲဒီအချိန်မှတ် (time point) ပြီးမှ ဖန်တီးလိုက်တဲ့ `PerformanceEntry` တွေကိုပဲ observer callback ဆီ ပို့ပေးပါတယ်။ **Default:** `false`။

{PerformanceObserver} instance ကို — `options.entryTypes` (သို့) `options.type` နဲ့ ခွဲခြားသတ်မှတ်ထားတဲ့ {PerformanceEntry} instances အသစ်တွေရဲ့ notifications တွေမှာ subscribe လုပ်ပါတယ်:

```mjs
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((list, observer) => {
  // Called once asynchronously. `list` contains three items.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

```cjs
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // Called once asynchronously. `list` contains three items.
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

### `performanceObserver.takeRecords()`

* Returns: {PerformanceEntry\\[]} Performance observer ထဲမှာ သိမ်းဆည်းထားတဲ့ entries တွေရဲ့ လက်ရှိ list ကို ပြန်ပေးပြီး — list ကို ရှင်းလင်းပစ်လိုက်ပါတယ်။

## Class: `PerformanceObserverEntryList`

`PerformanceObserverEntryList` class ကို — `PerformanceObserver` တစ်ခုဆီ ပေးပို့လိုက်တဲ့ `PerformanceEntry` instances တွေဆီကို ဝင်ရောက်ခွင့် ပေးဖို့ သုံးပါတယ်။ ဒီ class ရဲ့ constructor ကို user တွေဆီကို ထုတ်ဖော်မထားပါဘူး။

### `performanceObserverEntryList.getEntries()`

* Returns: {PerformanceEntry\\[]}

`performanceEntry.startTime` နဲ့ စပ်လျဉ်းပြီး အချိန်စဉ်အလိုက် စီစဉ်ထားတဲ့ `PerformanceEntry` objects တွေရဲ့ list တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```cjs
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

### `performanceObserverEntryList.getEntriesByName(name[, type])`

* `name` {string}
* `type` {string}
* Returns: {PerformanceEntry\\[]}

`performanceEntry.startTime` နဲ့ စပ်လျဉ်းပြီး အချိန်စဉ်အလိုက် စီစဉ်ထားတဲ့ — `performanceEntry.name` က `name` နဲ့ ညီနေတဲ့ — ပြီးတော့ ရွေးချယ်နိုင်တဲ့အနေနဲ့ `performanceEntry.entryType` က `type` နဲ့ ညီနေတဲ့ — `PerformanceEntry` objects တွေရဲ့ list တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

```cjs
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

### `performanceObserverEntryList.getEntriesByType(type)`

* `type` {string}
* Returns: {PerformanceEntry\\[]}

`performanceEntry.startTime` နဲ့ စပ်လျဉ်းပြီး အချိန်စဉ်အလိုက် စီစဉ်ထားတဲ့ — `performanceEntry.entryType` က `type` နဲ့ ညီနေတဲ့ — `PerformanceEntry` objects တွေရဲ့ list တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { performance, PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

```cjs
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0,
   *     detail: null
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0,
   *     detail: null
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

## `perf_hooks.createHistogram([options])`

* `options` {Object}
  * `lowest` {number|bigint} ခွဲခြားသိမြင်နိုင်တဲ့ (discernible) အနိမ့်ဆုံး တန်ဖိုးပါ။ `0` ထက် ကြီးတဲ့ integer တန်ဖိုး ဖြစ်ရပါမယ်။ **Default:** `1`။
  * `highest` {number|bigint} မှတ်တမ်းတင်နိုင်တဲ့ (recordable) အမြင့်ဆုံး တန်ဖိုးပါ။ `lowest` ရဲ့ နှစ်ဆနဲ့ ညီမျှသော (သို့) ပိုကြီးသော integer တန်ဖိုး ဖြစ်ရပါမယ်။ **Default:** `Number.MAX_SAFE_INTEGER`။
  * `figures` {number} တိကျမှု ဂဏန်းလုံး (accuracy digits) အရေအတွက်ပါ။ `1` နဲ့ `5` ကြားက နံပါတ်တစ်ခု ဖြစ်ရပါမယ်။ **Default:** `3`။
  * `halfLife` {number} EWMA half-life ကို samples အရေအတွက်နဲ့ ဖော်ပြပါတယ်။ `0` ထက် ကြီးတဲ့ တန်ဖိုး သတ်မှတ်လိုက်ရင် — histogram က exponentially weighted (ထပ်ကိန်းအလေးချိန်) ရှိတဲ့ moving average နဲ့ standard deviation တွေကို ခြေရာခံပြီး — `histogram.ewmaMean` နဲ့ `histogram.ewmaStddev` တို့ကနေ ဝင်ရောက်ကြည့်ရှုနိုင်ပါတယ်။ `halfLife` ပမာဏ recordings တွေ ပြီးသွားတဲ့အခါ — တန်ဖိုးတစ်ခုရဲ့ သြဇာလွှမ်းမိုးမှုက 50% အထိ ဆုတ်ယုတ်သွားပါတယ်။ **Default:** `0` (disabled)။
  * `threshold` {number} SLO threshold တန်ဖိုးတစ်ခုပါ။ `halfLife` နဲ့အတူ သတ်မှတ်လိုက်ရင် — histogram က ဒီ threshold ကို ကျော်လွန်တဲ့ တန်ဖိုးတွေအတွက် smoothed error rate (ချောမွေ့အောင် ပြုလုပ်ထားတဲ့ error rate) ကို ခြေရာခံပြီး — `histogram.ewmaErrorRate` နဲ့ `histogram.burnRate()` တို့ကနေ ဝင်ရောက်ကြည့်ရှုနိုင်ပါတယ်။ **Default:** `0` (disabled)။
* Returns: {RecordableHistogram}

{RecordableHistogram} တစ်ခုကို ပြန်ပေးပါတယ်။

## `perf_hooks.eventLoopUtilization([utilization1[, utilization2]])`

* `utilization1` {Object} `eventLoopUtilization()` ဆီကို ယခင် (previous) ခေါ်ဆိုမှုတစ်ခုရဲ့ ရလဒ်ပါ။
* `utilization2` {Object} `utilization1` မတိုင်မီက `eventLoopUtilization()` ဆီကို ယခင် ခေါ်ဆိုမှုတစ်ခုရဲ့ ရလဒ်ပါ။
* Returns: {Object}
  * `idle` {number}
  * `active` {number}
  * `utilization` {number}

`eventLoopUtilization()` function က — event loop က idle နဲ့ active ဖြစ်ခဲ့တဲ့ စုစုပေါင်း ကြာချိန် (cumulative duration) တွေကို high resolution milliseconds timer အဖြစ် ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ `utilization` တန်ဖိုးက တွက်ချက်ထားတဲ့ Event Loop Utilization (ELU) ဖြစ်ပါတယ်။

Main thread ပေါ်မှာ bootstrapping မပြီးသေးဘူးဆိုရင် — properties တွေက `0` တန်ဖိုး ရှိပါတယ်။ Bootstrap က event loop ရဲ့ အတွင်းမှာ ဖြစ်ပွားတာမို့ — [Worker threads][] တွေပေါ်မှာ ELU က ချက်ချင်း ရနိုင်ပါတယ်။

`utilization1` ရော `utilization2` ပါ optional parameters တွေ ဖြစ်ပါတယ်။

`utilization1` ကို ပေးပို့လိုက်ရင် — လက်ရှိ call ရဲ့ `active` နဲ့ `idle` times တွေကြားက delta (ကွာခြားချက်) ကို — သက်ဆိုင်တဲ့ `utilization` တန်ဖိုးနဲ့အတူ — တွက်ချက်ပြီး ပြန်ပေးပါတယ် ([`process.hrtime()`][] နဲ့ ဆင်တူပါတယ်)။

`utilization1` နဲ့ `utilization2` နှစ်ခုလုံး ပေးပို့လိုက်ရင် — delta ကို argument နှစ်ခုကြားမှာ တွက်ချက်ပါတယ်။ [`process.hrtime()`][] နဲ့ မတူဘဲ ELU တွက်ချက်မှုက တစ်ကြိမ်တည်း နုတ်လိုက်ရုံထက် ပိုရှုပ်ထွေးတာမို့ — ဒါက convenience option (အဆင်ပြေစေတဲ့ ရွေးချယ်မှု) တစ်ခုပါ။

ELU က CPU utilization နဲ့ ဆင်တူပေမယ့် — CPU usage ကိုမဟုတ်ဘဲ event loop statistics တွေကိုပဲ တိုင်းတာတာ ကွာပါတယ်။ Event loop က ၎င်းရဲ့ event provider (ဥပမာ `epoll_wait`) အပြင်ဘက်မှာ ကုန်ဆုံးခဲ့တဲ့ အချိန်ရဲ့ ရာခိုင်နှုန်းကို ကိုယ်စားပြုပါတယ်။ တခြား CPU idle time တွေကိုတော့ ထည့်သွင်း စဉ်းစားမထားပါဘူး။ အောက်က ဥပမာက — အများအားဖြင့် idle ဖြစ်နေတဲ့ process တစ်ခုက ELU မြင့်မားနေပုံကို ပြပါတယ်။

```mjs
import { eventLoopUtilization } from 'node:perf_hooks';
import { spawnSync } from 'node:child_process';

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```

```cjs
const { eventLoopUtilization } = require('node:perf_hooks');
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```

ဒီ script ကို run နေစဉ်မှာ CPU က အများအားဖြင့် idle ဖြစ်နေပေမယ့် — `utilization` တန်ဖိုးက `1` ဖြစ်နေပါတယ်။ ဘာလို့လဲဆိုတော့ [`child_process.spawnSync()`][] ဆီကို ခေါ်ဆိုမှုက event loop ကို ရှေ့ဆက်မသွားအောင် ပိတ်ဆို့ (block) ထားလို့ပါ။

`eventLoopUtilization()` ဆီကို ယခင် ခေါ်ဆိုမှုရဲ့ ရလဒ် အစား user-defined object တစ်ခုကို ပေးပို့လိုက်ရင် — undefined behavior (အဓိပ္ပာယ် မသတ်မှတ်ထားတဲ့ အပြုအမူ) တွေ ဖြစ်ပေါ်စေနိုင်ပါတယ်။ ပြန်ပေးလိုက်တဲ့ တန်ဖိုးတွေက event loop ရဲ့ မှန်ကန်တဲ့ state တစ်ခုခုကို ထင်ဟပ်မယ်လို့ အာမခံထားခြင်း မရှိပါဘူး။

## `perf_hooks.monitorEventLoopDelay([options])`

* `options` {Object}
  * `samplePerIteration` {boolean} `true` ဖြစ်ရင် — event loop iteration တစ်ခုစီတိုင်းမှာ samples တွေကို တစ်ကြိမ်စီ ယူပါတယ်။ **Default:** `false`။
  * `resolution` {number} Interval-based sampling (ကြားကာလ အခြေပြု နမူနာယူခြင်း) အတွက် sampling rate ကို milliseconds နဲ့ ဖော်ပြပါတယ်။ သုညထက် ကြီးရပါမယ်။ `samplePerIteration` က `true` ဖြစ်နေရင် ဒီ option ကို လျစ်လျူရှုပါတယ်။ **Default:** `10`။
* Returns: {ELDHistogram}

_ဒီ property က Node.js ရဲ့ extension တစ်ခုပါ။ Web browsers တွေမှာတော့ မရနိုင်ပါ။_

Event loop delay ကို အချိန်နဲ့အမျှ sample လုပ်ပြီး အစီရင်ခံပေးတဲ့ histogram object တစ်ခုကို ဖန်တီးပါတယ်။ Delays တွေကို nanoseconds နဲ့ အစီရင်ခံပါလိမ့်မယ်။

ပုံမှန်အားဖြင့် — histogram ကို သတ်မှတ်ထားတဲ့ `resolution` ကို သုံးတဲ့ timer တစ်ခုက update လုပ်ပါတယ်။ `samplePerIteration` က `true` ဖြစ်ရင် — `uv_prepare_t` နဲ့ `uv_check_t` hooks တွေကို သုံးပြီး event loop iteration တစ်ခုစီတိုင်းမှာ samples တွေကို တစ်ကြိမ်စီ ယူပါတယ်။ အဲဒီ mode မှာ — application idle ဖြစ်နေချိန်မှာ histogram က loop ကို ဆက်လက် အသက်ဝင်နေအောင် မလုပ်သလို — နောက်ထပ် iterations တွေကိုလည်း အတင်းအကျပ် မဖန်တီးပါဘူး။

Sampling mode နှစ်ခုက သိသိသာသာ ကွဲပြားတဲ့ ရလဒ်တွေကို ထုတ်ပေးတာမို့ — တိုက်ရိုက် နှိုင်းယှဉ်လို့ မသင့်ပါဘူး။

```mjs
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

```cjs
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// Do something.
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

## `perf_hooks.timerify(fn[, options])`

* `fn` {Function}
* `options` {Object}
  * `histogram` {RecordableHistogram} `perf_hooks.createHistogram()` ကို သုံးပြီး ဖန်တီးထားတဲ့ histogram object တစ်ခုပါ — runtime durations တွေကို nanoseconds နဲ့ မှတ်တမ်းတင်ပါလိမ့်မယ်။

_ဒီ property က Node.js ရဲ့ extension တစ်ခုပါ။ Web browsers တွေမှာတော့ မရနိုင်ပါ။_

Function တစ်ခုကို — ၎င်းရဲ့ run နေချိန် (running time) ကို တိုင်းတာပေးတဲ့ function အသစ်တစ်ခုအတွင်းမှာ ထုပ်ပိုး (wrap) လုပ်ပါတယ်။ Timing details တွေကို ဝင်ရောက်ကြည့်ရှုနိုင်ဖို့ — `PerformanceObserver` တစ်ခုကို `'function'` event type မှာ subscribe လုပ်ထားရပါမယ်။

```mjs
import { timerify, performance, PerformanceObserver } from 'node:perf_hooks';

function someFunction() {
  console.log('hello world');
}

const wrapped = timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```

```cjs
const {
  timerify,
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
wrapped();
```

ထုပ်ပိုးထားတဲ့ function က promise တစ်ခုကို ပြန်ပေးတယ်ဆိုရင် — အဲဒီ promise မှာ finally handler တစ်ခုကို တွဲပေးပြီး — finally handler ကို ခေါ်ယူလိုက်တာနဲ့ duration ကို အစီရင်ခံပါလိမ့်မယ်။

## Class: `Histogram`

### `histogram.count`

* Type: {number}

Histogram က မှတ်တမ်းတင်ထားတဲ့ samples အရေအတွက်ပါ။

### `histogram.countBigInt`

* Type: {bigint}

Histogram က မှတ်တမ်းတင်ထားတဲ့ samples အရေအတွက်ပါ။

### `histogram.ccdf(value)`

* `value` {number} စုံစမ်းမေးမြန်းရမယ့် တန်ဖိုးပါ။
* Returns: {number} 0.0 နဲ့ 1.0 ကြားက probability (ဖြစ်နိုင်ခြေ) တစ်ခုပါ။

ပေးထားတဲ့ တန်ဖိုးအတွက် complementary cumulative distribution function (CCDF) တန်ဖိုးကို ပြန်ပေးပါတယ် — ဆိုလိုတာက မှတ်တမ်းတင်ထားတဲ့ တန်ဖိုးတစ်ခုက `value` ကို ကျော်လွန်သွားမယ့် probability ကို ကိုယ်စားပြုပါတယ်။ `1 - histogram.cdf(value)` နဲ့ ညီမျှပါတယ်။

### `histogram.cdf(value)`

* `value` {number} စုံစမ်းမေးမြန်းရမယ့် တန်ဖိုးပါ။
* Returns: {number} 0.0 နဲ့ 1.0 ကြားက probability တစ်ခုပါ။

ပေးထားတဲ့ တန်ဖိုးအတွက် cumulative distribution function (CDF) တန်ဖိုးကို ပြန်ပေးပါတယ် — ဆိုလိုတာက မှတ်တမ်းတင်ထားတဲ့ တန်ဖိုးတစ်ခုက `value` ထက် နည်းမျှ (သို့) ညီမျှ ဖြစ်မယ့် probability ကို ကိုယ်စားပြုပါတယ်။ ဒါက `histogram.percentile()` ရဲ့ ပြောင်းပြန် လုပ်ဆောင်မှုပါ။

### `histogram.cliffsD(other)`

* `other` {Histogram} နှိုင်းယှဉ်ရမယ့် histogram ပါ။
* Returns: {number} -1.0 နဲ့ 1.0 ကြားက တန်ဖိုးတစ်ခုပါ။

Non-parametric effect size တိုင်းတာမှုတစ်ခု ဖြစ်တဲ့ [Cliff's delta][] ကို တွက်ချက်ပါတယ်။ ဒီ histogram ကနေ ကျပန်း ယူလိုက်တဲ့ တန်ဖိုးတစ်ခုက `other` ကနေ ကျပန်း ယူလိုက်တဲ့ တန်ဖိုးတစ်ခုကို ကျော်လွန်မယ့် probability ကနေ — ပြောင်းပြန် probability ကို နုတ်ပြီး ရလာတဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။ တန်ဖိုး `1` ဆိုရင် ဒီ histogram ထဲက တန်ဖိုးတိုင်းက `other` ထဲက တန်ဖိုးတိုင်းကို ကျော်လွန်တာကို ဆိုလိုပြီး — `-1` ဆိုရင် အပြောင်းပြန် ဖြစ်ပါတယ်။ `0` ဆိုရင်တော့ ဘယ်ဘက်ကိုမှ ဦးတည်ချက် (tendency) မရှိဘူးလို့ ဆိုလိုပါတယ်။

### `histogram.cohensD(other)`

* `other` {Histogram} နှိုင်းယှဉ်ရမယ့် histogram ပါ။
* Returns: {number} Effect size ပါ။

[Cohen's d][] effect size ကို တွက်ချက်ပါတယ် — pooled standard deviation ကို သုံးပြီး ဒီ histogram နဲ့ `other` ရဲ့ means (ပျမ်းမျှတန်ဖိုးများ) အကြား စံသတ်မှတ်ထားတဲ့ (standardized) ကွာခြားချက်ပါ။ Positive တန်ဖိုးတွေက ဒီ histogram မှာ mean ပိုမြင့်တာကို ညွှန်ပြပါတယ်။ သမားရိုးကျ (convention) အရ — |d| < 0.2 ဆိုရင် effect သေး (small) — 0.5 ဆိုရင် အလယ်အလတ် (medium) — 0.8 (သို့) ပိုကြီးရင်တော့ ကြီး (large) ဖြစ်ပါတယ်။ Histogram နှစ်ခုလုံးမှာ မှတ်တမ်းတင်ထားတဲ့ တန်ဖိုး အနည်းဆုံး 2 ခု ရှိရပါမယ် — မရှိရင်တော့ `0` ကို ပြန်ပေးပါတယ်။

### `histogram.countAt(value)`

* `value` {number} စုံစမ်းမေးမြန်းရမယ့် တန်ဖိုးပါ။
* Returns: {number}

ပေးထားတဲ့ တန်ဖိုးရဲ့ ညီမျှတဲ့ value range အတွင်းမှာ ကျရောက်နေတဲ့ မှတ်တမ်းတင်ထားသော တန်ဖိုးတွေရဲ့ အရေအတွက်ကို ပြန်ပေးပါတယ်။

### `histogram.exceeds`

* Type: {number}

Event loop delay က အမြင့်ဆုံး 1 နာရီ event loop delay threshold ကို ကျော်လွန်ခဲ့တဲ့ အကြိမ် အရေအတွက်ပါ။

### `histogram.exceedsBigInt`

* Type: {bigint}

Event loop delay က အမြင့်ဆုံး 1 နာရီ event loop delay threshold ကို ကျော်လွန်ခဲ့တဲ့ အကြိမ် အရေအတွက်ပါ။

### `histogram.ewmaMean`

* Type: {number}

မှတ်တမ်းတင်ထားတဲ့ တန်ဖိုးတွေရဲ့ exponentially weighted moving average ပါ။ Histogram ကို `0` ထက် ကြီးတဲ့ `halfLife` option နဲ့ ဖန်တီးထားမှသာ အလုပ်လုပ်ပါတယ်။ EWMA ကို ပိတ်ထားတဲ့အခါ (သို့) တန်ဖိုးတွေ မှတ်တမ်းမတင်ရသေးတဲ့အခါ `0` ကို ပြန်ပေးပါတယ်။

### `histogram.ewmaStddev`

* Type: {number}

Exponentially weighted moving standard deviation ပါ။ Histogram ကို `0` ထက် ကြီးတဲ့ `halfLife` option နဲ့ ဖန်တီးထားမှသာ အလုပ်လုပ်ပါတယ်။ EWMA ကို ပိတ်ထားတဲ့အခါ (သို့) တန်ဖိုးတွေ မှတ်တမ်းမတင်ရသေးတဲ့အခါ `0` ကို ပြန်ပေးပါတယ်။

### `histogram.ewmaErrorRate`

* Type: {number}

မှတ်တမ်းတင်ထားတဲ့ တန်ဖိုးတစ်ခုက သတ်မှတ်ထားတဲ့ `threshold` ကို ကျော်လွန်မယ့် EWMA-smoothed probability ပါ။ Histogram ကို `halfLife` နဲ့ `threshold` options နှစ်ခုလုံးနဲ့ ဖန်တီးထားမှသာ အလုပ်လုပ်ပါတယ်။ Enable မလုပ်ထားတဲ့အခါ (သို့) တန်ဖိုးတွေ မှတ်တမ်းမတင်ရသေးတဲ့အခါ `0` ကို ပြန်ပေးပါတယ်။

### `histogram.burnRate(sloTarget)`

* `sloTarget` {number} 0 နဲ့ 1 ကြား (အစွန်းနှစ်ဖက် မပါဝင်) fraction တစ်ခုအနေနဲ့ ဖော်ပြတဲ့ SLO target ပါ။ ဥပမာ — 99.9% SLO အတွက် `0.999` ဖြစ်ပါတယ်။
* Returns: {number}

SLO burn rate ကို ပြန်ပေးပါတယ်: `ewmaErrorRate / (1 - sloTarget)`။ Burn rate `1` ဆိုရင် — error budget က SLO window တစ်လျှောက်မှာ အတိအကျ ကုန်ဆုံးသွားမယ်လို့ ဆိုလိုပါတယ်။ Burn rate က `1` ထက် ကြီးရင် — ခွင့်ပြုထားတာထက် ပိုမြန်မြန် သုံးစွဲနေတာကို ဆိုလိုပါတယ်။ Histogram ကို `halfLife` နဲ့ `threshold` options နှစ်ခုလုံးနဲ့ ဖန်တီးထားဖို့ လိုအပ်ပါတယ်။

```js
const { createHistogram } = require('node:perf_hooks');

// Track latency with a 200ms SLO threshold, half-life of 100 samples
const h = createHistogram({ halfLife: 100, threshold: 200_000_000 });

// ... record latency values ...

// Check burn rate against a 99.9% SLO
const rate = h.burnRate(0.999);
if (rate > 1) {
  console.log(`SLO burn rate: ${rate.toFixed(2)}x — error budget depleting`);
}
```

### `histogram.ksTest(other)`

* `other` {Histogram} နှိုင်းယှဉ်ရမယ့် histogram ပါ။
* Returns: {number} 0.0 နဲ့ 1.0 ကြားက KS D-statistic ပါ။

ဒီ histogram ရဲ့ distribution ကို `other` နဲ့ နှိုင်းယှဉ်ပြီး Kolmogorov-Smirnov test statistic ကို တွက်ချက်ပါတယ်။ တန်ဖိုး `0` ဆိုရင် distributions တွေ ထပ်တူညီနေတာကို ညွှန်ပြပြီး — `1` နဲ့ နီးစပ်တဲ့ တန်ဖိုးတွေကတော့ distributions တွေ လုံးဝ ကွဲပြားနေတာကို ညွှန်ပြပါတယ်။ Before/after histograms တွေကို နှိုင်းယှဉ်ပြီး performance regressions (စွမ်းဆောင်ရည် ဆုတ်ယုတ်မှုများ) တွေကို ရှာဖွေတွေ့ရှိဖို့ အသုံးဝင်ပါတယ်။

### `histogram.kurtosis`

* Type: {number}

မှတ်တမ်းတင်ထားတဲ့ တန်ဖိုးတွေရဲ့ excess kurtosis ပါ။ Normal distribution တစ်ခုနဲ့ ယှဉ်ပြီး distribution ရဲ့ tails (အမြီးပိုင်း) တွေရဲ့ ထူထဲမှုကို တိုင်းတာပါတယ်။ Positive တန်ဖိုးတွေက tails တွေ ပိုထူထဲနေတာ (extreme outliers တွေ ပိုများနေတာ) ကို ညွှန်ပြပြီး — negative တန်ဖိုးတွေကတော့ tails တွေ ပိုပါးနေတာကို ညွှန်ပြပါတယ်။

### `histogram.linearBuckets(stepSize)`

* `stepSize` {number} Linear bucket တစ်ခုချင်းစီရဲ့ အနံ (width) ပါ။
* Returns: {Map} Bucket boundary values တွေကို counts တွေနဲ့ ချိတ်ဆက်ပေးတဲ့ map တစ်ခုပါ။

Histogram data ကို `stepSize` အကွာအဝေး (spacing) ရှိတဲ့ linearly-spaced intervals (တူညီသော အကွာအဝေးရှိ ကြားကာလများ) တွေအဖြစ် bucket ပြန်ခွဲပြီး ပြန်ပေးပါတယ်။ Visualization (မြင်သာအောင် ပြသခြင်း) နဲ့ export လုပ်ခြင်းအတွက် အသုံးဝင်ပါတယ်။

### `histogram.logBuckets(firstBucket, base)`

* `firstBucket` {number} ပထမ bucket boundary ရဲ့ တန်ဖိုးပါ။
* `base` {number} Bucket width တွေ ကြီးထွားမှုအတွက် logarithmic base ပါ။ `1` ထက် ကြီးရပါမယ်။
* Returns: {Map} Bucket boundary values တွေကို counts တွေနဲ့ ချိတ်ဆက်ပေးတဲ့ map တစ်ခုပါ။

Histogram data ကို — bucket တစ်ခုချင်းစီရဲ့ width ကို `base` နဲ့ မြှောက်သွားတဲ့ — logarithmically-spaced intervals (logarithmic အကွာအဝေးရှိ ကြားကာလများ) တွေအဖြစ် bucket ပြန်ခွဲပြီး ပြန်ပေးပါတယ်။ Visualization နဲ့ export လုပ်ခြင်းအတွက် အသုံးဝင်ပါတယ်။

### `histogram.mannWhitneyTest(other)`

* `other` {Histogram} နှိုင်းယှဉ်ရမယ့် histogram ပါ။
* Returns: {Object}
  * `uStatistic` {number} Mann-Whitney U statistic ပါ။
  * `zScore` {number} z-score (normal approximation — သာမန် ခန့်မှန်းချက်) ပါ။
  * `pValue` {number} Two-tailed p-value ပါ။

ဒီ histogram က `other` ထက် ပိုကြီးတဲ့ (သို့) ပိုသေးတဲ့ တန်ဖိုးတွေကို ထုတ်လုပ်ဖို့ သဘောထားရှိမရှိ နှိုင်းယှဉ်တဲ့ [Mann-Whitney U test][] ကို လုပ်ဆောင်ပါတယ်။ `welchTest()` နဲ့ မတူဘဲ — ဒါက distributions တွေရဲ့ ပုံသဏ္ဌာန်နဲ့ ပတ်သက်ပြီး ဘာယူဆချက်မှ မလုပ်တဲ့ non-parametric test တစ်ခုပါ။ p-value အတွက် tie correction (ဂဏန်းတူညီမှု ပြင်ဆင်ချက်) ပါတဲ့ normal approximation ကို သုံးပါတယ်။

### `histogram.max`

* Type: {number}

မှတ်တမ်းတင်ထားတဲ့ event loop delay တွေထဲက အများဆုံး (maximum) တန်ဖိုးပါ။

### `histogram.maxBigInt`

* Type: {bigint}

မှတ်တမ်းတင်ထားတဲ့ event loop delay တွေထဲက အများဆုံး (maximum) တန်ဖိုးပါ။

### `histogram.mean`

* Type: {number}

မှတ်တမ်းတင်ထားတဲ့ event loop delays တွေရဲ့ mean (ပျမ်းမျှ) ပါ။

### `histogram.min`

* Type: {number}

မှတ်တမ်းတင်ထားတဲ့ event loop delay တွေထဲက အနည်းဆုံး (minimum) တန်ဖိုးပါ။

### `histogram.minBigInt`

* Type: {bigint}

မှတ်တမ်းတင်ထားတဲ့ event loop delay တွေထဲက အနည်းဆုံး (minimum) တန်ဖိုးပါ။

### `histogram.percentile(percentile)`

* `percentile` {number} (0, 100] အကွာအဝေးထဲက percentile တန်ဖိုးတစ်ခုပါ။
* Returns: {number}

ပေးထားတဲ့ percentile မှာရှိတဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။

### `histogram.percentileBigInt(percentile)`

* `percentile` {number} (0, 100] အကွာအဝေးထဲက percentile တန်ဖိုးတစ်ခုပါ။
* Returns: {bigint}

ပေးထားတဲ့ percentile မှာရှိတဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။

### `histogram.percentileCI(percentile[, options])`

* `percentile` {number} (0, 100] အကွာအဝေးထဲက percentile တန်ဖိုးတစ်ခုပါ။
* `options` {Object}
  * `confidence` {number} Interval အတွက် confidence level ပါ — 0 နဲ့ 1 ကြားမှာ ရှိပါတယ်။ **Default:** `0.95`။
* Returns: {Object}
  * `value` {number} Point estimate (အမှတ်ခန့်မှန်းချက်) ပါ — `histogram.percentile()` နဲ့ အတူတူပါပဲ။
  * `lower` {number} Confidence interval ရဲ့ lower bound (အောက်ကန့်သတ်ချက်) ပါ။
  * `upper` {number} Confidence interval ရဲ့ upper bound (အထက်ကန့်သတ်ချက်) ပါ။

ပေးထားတဲ့ percentile အတွက် confidence interval (ယုံကြည်စိတ်ချရမှု ကြားကာလ) ကို exact binomial method သုံးပြီး ပြန်ပေးပါတယ်။ Samples နည်းလေလေ — interval က ပိုကျယ်လေလေ ဖြစ်ပြီး — percentile ခန့်မှန်းချက်မှာ မသေချာမရေရာမှု ပိုကြီးတာကို ထင်ဟပ်ပါတယ်။ မှတ်တမ်းတင်ထားတဲ့ တန်ဖိုး အနည်းဆုံး 2 ခု လိုအပ်ပါတယ် — 2 ခုထက် နည်းနေရင် `lower` နဲ့ `upper` တို့က `value` နဲ့ ညီမျှပါလိမ့်မယ်။

```js
const { createHistogram } = require('node:perf_hooks');

const h = createHistogram();
for (let i = 0; i < 1000; i++) {
  h.record(Math.floor(Math.random() * 100));
}

const ci = h.percentileCI(99);
console.log(ci.value);  // The p99 point estimate
console.log(ci.lower);  // The lower bound (95% confidence)
console.log(ci.upper);  // The upper bound (95% confidence)
```

### `histogram.percentiles`

* Type: {Map}

စုဆောင်းထားတဲ့ percentile distribution အသေးစိတ်ကို ဖော်ပြတဲ့ `Map` object တစ်ခုကို ပြန်ပေးပါတယ်။

### `histogram.percentilesBigInt`

* Type: {Map}

စုဆောင်းထားတဲ့ percentile distribution အသေးစိတ်ကို ဖော်ပြတဲ့ `Map` object တစ်ခုကို ပြန်ပေးပါတယ်။

### `histogram.percentilesAt(percentiles)`

* `percentiles` {number\\[]} (0, 100] အကွာအဝေးထဲက percentile တန်ဖိုးတွေရဲ့ array တစ်ခုပါ။
* Returns: {Map} Percentile တန်ဖိုးတွေကို သူတို့နဲ့ သက်ဆိုင်တဲ့ histogram တန်ဖိုးတွေနဲ့ ချိတ်ဆက်ပေးတဲ့ map တစ်ခုပါ။

သတ်မှတ်ထားတဲ့ percentiles တွေမှာရှိတဲ့ တန်ဖိုးတွေကို — histogram data ပေါ်မှာ ထိရောက်တဲ့ pass တစ်ကြိမ်တည်းနဲ့ တွက်ချက်ပြီး ပြန်ပေးပါတယ်။ `histogram.percentile()` ကို အကြိမ်များစွာ ခေါ်တာထက် ပိုထိရောက်ပါတယ်။

### `histogram.reset()`

စုဆောင်းထားတဲ့ histogram data ကို ပြန်လည် စတင်သတ်မှတ် (reset) လုပ်ပါတယ်။

### `histogram.skewness`

* Type: {number}

မှတ်တမ်းတင်ထားတဲ့ တန်ဖိုးတွေရဲ့ skewness (စောင်းညွှတ်မှု) ပါ။ Distribution ရဲ့ အချိုးမညီမှုကို တိုင်းတာပါတယ်။ Positive တန်ဖိုးက right-skewed distribution (ညာဘက် အမြီး ပိုရှည်ပြီး — latency data တွေမှာ အဖြစ်များတဲ့ ပုံစံ) ကို ညွှန်ပြကာ — negative တန်ဖိုးကတော့ left-skewed distribution ကို ညွှန်ပြပါတယ်။

### `histogram.stddev`

* Type: {number}

မှတ်တမ်းတင်ထားတဲ့ event loop delays တွေရဲ့ standard deviation (စံသွေဖည်မှု) ပါ။

### `histogram.welchTest(other[, options])`

* `other` {Histogram} နှိုင်းယှဉ်ရမယ့် histogram ပါ။
* `options` {Object}
  * `confidence` {number} Interval အတွက် confidence level ပါ — 0 နဲ့ 1 ကြားမှာ ရှိပါတယ်။ **Default:** `0.95`။
* Returns: {Object}
  * `tStatistic` {number} Welch t-statistic ပါ။
  * `degreesOfFreedom` {number} Welch-Satterthwaite degrees of freedom (လွတ်လပ်မှု ဒီဂရီ) ပါ။
  * `pValue` {number} Two-tailed p-value ပါ။
  * `confidenceInterval` {Object}
    * `lower` {number} Means တွေရဲ့ ကွာခြားချက်အပေါ် confidence interval ရဲ့ lower bound (အောက်ကန့်သတ်ချက်) ပါ။
    * `upper` {number} Upper bound (အထက်ကန့်သတ်ချက်) ပါ။

[Welch's t-test][] ကို လုပ်ဆောင်ပြီး ဒီ histogram နဲ့ `other` ရဲ့ means တွေကို နှိုင်းယှဉ်ပါတယ်။ p-value က — distributions နှစ်ခုမှာ mean အတူတူ ရှိတယ်ဆိုတဲ့ null hypothesis (ယူဆချက်အလွတ်) အောက်မှာ — ဒီလောက် စွန်းထင်းတဲ့ ကွာခြားချက်တစ်ခုကို လေ့လာတွေ့ရှိရမယ့် probability ကို ညွှန်ပြပါတယ်။ Histogram နှစ်ခုလုံးမှာ မှတ်တမ်းတင်ထားတဲ့ တန်ဖိုး အနည်းဆုံး 2 ခု ရှိရပါမယ် — မရှိရင်တော့ ရလဒ်မှာ `pValue` က 1 ဖြစ်ပြီး `tStatistic` က 0 ဖြစ်ပါတယ်။


## Class: `ELDHistogram extends Histogram`

ဒါက [`perf_hooks.monitorEventLoopDelay()`][] ကနေ ပြန်ပေးအပ်တဲ့ — event loop delay တွေကို မှတ်တမ်းတင်ပေးတဲ့ `Histogram` တစ်ခုပါ။

### `histogram.disable()`

* Returns: {boolean}

Event loop delay sampling ကို ပိတ်ပါတယ်။ Sampling ကို ရပ်တန့်လိုက်နိုင်ခဲ့ရင် `true` ကို — ရပြီးသား ဖြစ်နေရင်တော့ `false` ကို ပြန်ပေးပါတယ်။

### `histogram.enable()`

* Returns: {boolean}

Event loop delay sampling ကို ဖွင့်ပါတယ်။ Sampling ကို စတင်နိုင်ခဲ့ရင် `true` ကို — စပြီးသား ဖြစ်နေရင်တော့ `false` ကို ပြန်ပေးပါတယ်။

### `histogram[Symbol.dispose]()`

Histogram ကို dispose (စွန့်ပစ်) လုပ်လိုက်တဲ့အခါ event loop delay sampling ကို ပိတ်လိုက်ပါတယ်။

```js
const { monitorEventLoopDelay } = require('node:perf_hooks');
{
  using hist = monitorEventLoopDelay({ resolution: 20 });
  hist.enable();
  // The histogram will be disabled when the block is exited.
}
```

### `ELDHistogram` တစ်ခုကို clone ပြုလုပ်ခြင်း (Cloning an `ELDHistogram`)

{ELDHistogram} instance တွေကို {MessagePort} ကနေတစ်ဆင့် clone လုပ်နိုင်ပါတယ်။ Clone လုပ်ခံရတဲ့ဘက်မှာတော့ — `enable()` နဲ့ `disable()` methods တွေ မပါဝင်တဲ့ သာမန် {Histogram} object အဖြစ် clone ပြုလုပ်ပြီးသား ရောက်ရှိလာပါတယ်။

## Class: `RecordableHistogram extends Histogram`

### `histogram.add(other)`

* `other` {RecordableHistogram}

`other` ထဲက values တွေကို ဒီ histogram ထဲကို ထည့်ပေါင်းပါတယ်။

### `histogram.record(val)`

* `val` {number|bigint} Histogram ထဲမှာ မှတ်တမ်းတင်ရမယ့် ပမာဏပါ။

### `histogram.recordDelta()`

`recordDelta()` ကို နောက်ဆုံး ခေါ်ခဲ့ပြီးတည်းက ကုန်လွန်သွားတဲ့ အချိန်ပမာဏကို (nanoseconds နဲ့) တွက်ချက်ပြီး အဲဒီပမာဏကို histogram ထဲမှာ မှတ်တမ်းတင်ပါတယ်။

### `histogram.recordCorrected(val, expectedInterval)`

* `val` {number|bigint} မှတ်တမ်းတင်ရမယ့် တန်ဖိုးပါ။
* `expectedInterval` {number|bigint} မျှော်လင့်ထားတဲ့ recording interval ပါ။

တန်ဖိုးတစ်ခုကို coordinated omission correction (ပေါင်းစပ်ညှိနှိုင်းထားသော ချန်လှပ်မှု ပြင်ဆင်ချက်) နဲ့အတူ မှတ်တမ်းတင်ပါတယ်။ System stall (စနစ် ရပ်တန့်မှု) တစ်ခုက အချိန်မီ မှတ်တမ်းတင်နိုင်အောင် တားဆီးလိုက်တဲ့အခါ — ဒီ method က နောက်ဆုံး မှတ်တမ်းတင်ထားတဲ့ တန်ဖိုးနဲ့ `val` ကြားမှာ ရှိသင့်တဲ့ အလယ်အလတ် တန်ဖိုးတွေကို `expectedInterval` ခြားတိုင်း ပြန်ဖြည့်ပေးပါတယ်။ ဒါက latency ကို လျော့ပြီး ဖော်ပြမိနိုင်တဲ့ တိုင်းတာမှု ကွာဟချက်တွေအတွက် လျော်ကြေး ပေးပါတယ်။

### `histogram.subtract(other)`

* `other` {RecordableHistogram}

ဒီ histogram ကနေ `other` ရဲ့ values တွေကို နုတ်ပါတယ်။ Histogram နှစ်ခုလုံးမှာ လိုက်ဖက်ညီတဲ့ configurations (ဖွဲ့စည်းမှုပုံစံများ) ရှိသင့်ပါတယ်။ အနုတ် ဖြစ်သွားနိုင်တဲ့ bucket counts တွေကို သုညမှာ ညှပ်ထိန်း (clamp) ပါတယ်။

## Histogram ခွဲခြမ်းစိတ်ဖြာမှု ဥပမာများ (Histogram analysis examples)

`Histogram` class က performance monitoring (စွမ်းဆောင်ရည် စောင့်ကြည့်ခြင်း)၊ SLO လိုက်နာမှု သေချာစေခြင်း နဲ့ regression (နောက်ပြန် ယိုယွင်းမှု) ရှာဖွေခြင်းတို့အတွက် အသုံးဝင်တဲ့ ကိန်းဂဏန်း ခွဲခြမ်းစိတ်ဖြာမှု (statistical analysis) methods တွေကို ပံ့ပိုးပေးပါတယ်။

### Distribution ပုံသဏ္ဌာန် ခွဲခြမ်းစိတ်ဖြာခြင်း (Distribution shape analysis)

```js
const { createHistogram } = require('node:perf_hooks');

const h = createHistogram();

// Simulate a right-skewed latency distribution
for (let i = 0; i < 1000; i++) {
  h.record(Math.ceil(Math.random() * 100));
}
// Add some outliers
for (let i = 0; i < 10; i++) {
  h.record(500 + Math.ceil(Math.random() * 500));
}

console.log('Skewness:', h.skewness.toFixed(4));  // Positive = right-skewed
console.log('Kurtosis:', h.kurtosis.toFixed(4));  // Positive = heavy tails
```

### CDF နဲ့ SLO စောင့်ကြည့်ခြင်း (SLO monitoring with CDF)

```js
const { createHistogram } = require('node:perf_hooks');

const latency = createHistogram();

// Record request latencies (in nanoseconds)...

// "What fraction of requests complete within 100ms?"
const withinSLO = latency.cdf(100_000_000);
console.log(`${(withinSLO * 100).toFixed(1)}% of requests within SLO`);

// "What fraction of requests exceed 500ms?"
const violating = latency.ccdf(500_000_000);
console.log(`${(violating * 100).toFixed(1)}% of requests violating SLO`);
```

### SLO burn rate စောင့်ကြည့်ခြင်း (SLO burn rate monitoring)

```js
const { createHistogram } = require('node:perf_hooks');

// Track latency with EWMA (half-life 100 samples) and a 200ms SLO threshold
const latency = createHistogram({
  halfLife: 100,
  threshold: 200_000_000,  // 200ms in nanoseconds
});

// Record request latencies...

// Smoothed error rate: probability of exceeding the threshold
console.log(`Error rate: ${(latency.ewmaErrorRate * 100).toFixed(2)}%`);

// Burn rate against a 99.9% SLO
// >1 means the error budget is depleting faster than allowed
const rate = latency.burnRate(0.999);
console.log(`Burn rate: ${rate.toFixed(2)}x`);

// EWMA mean and stddev track the smoothed latency
console.log(`EWMA latency: ${latency.ewmaMean.toFixed(0)}ns`);
console.log(`EWMA stddev:  ${latency.ewmaStddev.toFixed(0)}ns`);
```

### KS test နဲ့ regression ရှာဖွေခြင်း (Regression detection with KS test)

```js
const { createHistogram } = require('node:perf_hooks');

const baseline = createHistogram();
const current = createHistogram();

// Record baseline and current latencies...

// D-statistic: 0 = identical, 1 = completely different
const d = baseline.ksTest(current);
if (d > 0.1) {
  console.log(`Possible regression detected (D=${d.toFixed(4)})`);
}
```

### Percentile များကို အစုလိုက် မေးမြန်းခြင်း (Batch percentile queries)

```js
const { createHistogram } = require('node:perf_hooks');

const h = createHistogram();
// Record values...

// Efficiently query common monitoring percentiles in one pass
const p = h.percentilesAt([50, 75, 90, 95, 99, 99.9]);
console.log('p50:', p.get(50));
console.log('p99:', p.get(99));
```

### `subtract` နဲ့ snapshot ကွဲလွဲချက် ရှာခြင်း (Snapshot diffing with subtract)

```js
const { createHistogram } = require('node:perf_hooks');

const total = createHistogram();
const snapshot = createHistogram();

// Record values into total...
// Periodically snapshot for "last interval" analysis:
snapshot.add(total);

// Later, take a new snapshot and diff:
const newSnapshot = createHistogram();
newSnapshot.add(total);
newSnapshot.subtract(snapshot);
// newSnapshot now contains only the values recorded since the last snapshot
console.log('Recent p99:', newSnapshot.percentile(99));
```

### Welch's t-test နဲ့ benchmark နှိုင်းယှဉ်ခြင်း (Benchmark comparison with Welch's t-test)

```js
const { createHistogram } = require('node:perf_hooks');

const baseline = createHistogram();
const candidate = createHistogram();

// Record operation rates from the old and new builds...

const result = baseline.welchTest(candidate);
const improvement = ((candidate.mean - baseline.mean) / baseline.mean * 100);

console.log(`Improvement: ${improvement.toFixed(2)}%`);
console.log(`p-value: ${result.pValue.toFixed(6)}`);
console.log(`95% CI: [${result.confidenceInterval.lower.toFixed(2)}, ` +
            `${result.confidenceInterval.upper.toFixed(2)}]`);

if (result.pValue < 0.05) {
  const d = baseline.cohensD(candidate);
  console.log(`Statistically significant (Cohen's d = ${d.toFixed(4)})`);
}
```

### Cliff's delta နဲ့ effect size ခန့်မှန်းခြင်း (Effect size with Cliff's delta)

```js
const { createHistogram } = require('node:perf_hooks');

const before = createHistogram();
const after = createHistogram();

// Record latencies before and after a change...

const delta = before.cliffsD(after);
// A delta > 0: before tends to produce larger values (improvement)
// A delta < 0: after tends to produce larger values (regression)
console.log(`Cliff's delta: ${delta.toFixed(4)}`);
```

## ဥပမာများ (Examples)

### Async operations တွေရဲ့ ကြာချိန် တိုင်းတာခြင်း (Measuring the duration of async operations)

အောက်က ဥပမာက [Async Hooks][] နဲ့ Performance APIs တွေကို သုံးပြီး Timeout operation တစ်ခုရဲ့ အမှန်တကယ် ကြာချိန် (callback ကို execute လုပ်ဖို့ ကြာတဲ့ အချိန်အပါအဝင်) ကို တိုင်းတာပါတယ်။

```mjs
import { createHook } from 'node:async_hooks';
import { performance, PerformanceObserver } from 'node:perf_hooks';

const set = new Set();
const hook = createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```

```cjs
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  },
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'] });

setTimeout(() => {}, 1000);
```

### Dependencies တွေကို load လုပ်ဖို့ ဘယ်လောက်ကြာသလဲ တိုင်းတာခြင်း (Measuring how long it takes to load dependencies)

အောက်က ဥပမာက dependencies တွေကို load လုပ်တဲ့ `require()` operations တွေရဲ့ ကြာချိန်ကို တိုင်းတာပါတယ်:

```mjs
import { performance, PerformanceObserver } from 'node:perf_hooks';

// Activate the observer
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`import('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

const timedImport = performance.timerify(async (module) => {
  return await import(module);
});

await timedImport('some-module');
```

```cjs
const {
  performance,
  PerformanceObserver,
} = require('node:perf_hooks');
const mod = require('node:module');

// Monkey patch the require function
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// Activate the observer
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

require('some-module');
```

### HTTP round-trip တစ်ကြိမ် ဘယ်လောက်ကြာသလဲ တိုင်းတာခြင်း (Measuring how long one HTTP round-trip takes)

အောက်က ဥပမာကို HTTP client (`OutgoingMessage`) နဲ့ HTTP request (`IncomingMessage`) တို့ရဲ့ အသုံးပြုချိန်တွေကို ခြေရာခံဖို့ သုံးပါတယ်။ HTTP client အတွက်ဆိုရင် — request စတင်တည်းက response လက်ခံရရှိတဲ့အထိ ကြားကာလကို ဆိုလိုပြီး — HTTP request အတွက်ကတော့ request ကို လက်ခံရရှိတည်းက response ပို့လိုက်တဲ့အထိ ကြားကာလကို ဆိုလိုပါတယ်:

```mjs
import { PerformanceObserver } from 'node:perf_hooks';
import { createServer, get } from 'node:http';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  get(`http://127.0.0.1:${PORT}`);
});
```

```cjs
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
```

### `net.connect` (TCP အတွက်သာ) က connection အောင်မြင်တဲ့အခါ ဘယ်လောက်ကြာသလဲ တိုင်းတာခြင်း (Measuring how long the `net.connect` (only for TCP) takes when the connection is successful)

```mjs
import { PerformanceObserver } from 'node:perf_hooks';
import { connect, createServer } from 'node:net';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  connect(PORT);
});
```

```cjs
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
```

### DNS က request အောင်မြင်တဲ့အခါ ဘယ်လောက်ကြာသလဲ တိုင်းတာခြင်း (Measuring how long the DNS takes when the request is successful)

```mjs
import { PerformanceObserver } from 'node:perf_hooks';
import { lookup, promises } from 'node:dns';

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
lookup('localhost', () => {});
promises.resolve('localhost');
```

```cjs
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
```

[Async Hooks]: async_hooks.md
[Cliff's delta]: https://en.wikipedia.org/wiki/Effect_size#Cliff's_delta
[Cohen's d]: https://en.wikipedia.org/wiki/Effect_size#Cohen's_d
[Fetch Response Body Info]: https://fetch.spec.whatwg.org/#response-body-info
[Fetch Timing Info]: https://fetch.spec.whatwg.org/#fetch-timing-info
[High Resolution Time]: https://www.w3.org/TR/hr-time-2
[Mann-Whitney U test]: https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test
[Performance Timeline]: https://w3c.github.io/performance-timeline/
[Resource Timing]: https://www.w3.org/TR/resource-timing-2/
[User Timing]: https://www.w3.org/TR/user-timing/
[Web Performance APIs]: https://w3c.github.io/perf-timing-primer/
[Welch's t-test]: https://en.wikipedia.org/wiki/Welch%27s_t-test
[Worker threads]: worker_threads.md#worker-threads
[`'exit'`]: process.md#event-exit
[`child_process.spawnSync()`]: child_process.md#child_processspawnsynccommand-args-options
[`perf_hooks.eventLoopUtilization()`]: #perf_hookseventlooputilizationutilization1-utilization2
[`perf_hooks.monitorEventLoopDelay()`]: #perf_hooksmonitoreventloopdelayoptions
[`perf_hooks.timerify()`]: #perf_hookstimerifyfn-options
[`process.hrtime()`]: process.md#processhrtimetime
[`timeOrigin`]: https://w3c.github.io/hr-time/#dom-performance-timeorigin
[`window.performance.toJSON`]: https://developer.mozilla.org/en-US/docs/Web/API/Performance/toJSON
[`window.performance`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/performance
