---
title: "Global objects"
description: "Node.js မှာ module တိုင်းအတွက် ရနိုင်တဲ့ global objects တွေ — global, process, console, Buffer, URL, setTimeout မိသားစု, TextEncoder, WebAssembly စသည်တို့အကြောင်း (global ပုံပေါက်သော်လည်း တကယ်တော့ မဟုတ်တဲ့ variables တွေ အပါအဝင်)"
order: 107
source: "https://nodejs.org/api/globals.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

ဒီ objects တွေကို module တိုင်းမှာ ရနိုင်ပါတယ်။

အောက်ပါ variables တွေက global ဖြစ်ပုံ ရပေမယ့် တကယ်တော့ မဟုတ်ပါဘူး။ ဒါတွေက [CommonJS modules][] ရဲ့ scope ထဲမှာပဲ တည်ရှိပါတယ်:

* [`__dirname`][]
* [`__filename`][]
* [`exports`][]
* [`module`][]
* [`require()`][]

ဒီမှာ စာရင်းပြထားတဲ့ objects တွေက Node.js အတွက် သီးသန့် ဖြစ်ပါတယ်။ JavaScript ဘာသာစကားရဲ့ ကိုယ်ပိုင် အစိတ်အပိုင်းတွေ ဖြစ်တဲ့ [built-in objects][] တွေလည်း ရှိပါသေးတယ် — အဲဒါတွေကလည်း global အဆင့်မှာ ဝင်ရောက်သုံးလို့ ရပါတယ်။

## `__dirname`

ဒီ variable က global ဖြစ်ပုံ ရပေမယ့် တကယ်တော့ မဟုတ်ပါဘူး။ [`__dirname`][] ကို ကြည့်ပါ။

## `__filename`

ဒီ variable က global ဖြစ်ပုံ ရပေမယ့် တကယ်တော့ မဟုတ်ပါဘူး။ [`__filename`][] ကို ကြည့်ပါ။

## Class: `AbortController`

ရွေးချယ်ထားတဲ့ `Promise`-based APIs တွေမှာ cancellation (လုပ်ဆောင်ချက် ဖျက်သိမ်းခြင်း) ကို အချက်ပြဖို့ သုံးတဲ့ utility class တစ်ခုပါ။ ဒီ API က Web API {AbortController} ကို အခြေခံထားပါတယ်။

```js
const ac = new AbortController();

ac.signal.addEventListener('abort', () => console.log('Aborted!'),
                           { once: true });

ac.abort();

console.log(ac.signal.aborted);  // Prints true
```

### `abortController.abort([reason])`

* `reason` {any} Optional reason တစ်ခုပါ — `AbortSignal` ရဲ့ `reason` property ပေါ်ကနေ ပြန်လည် ရယူလို့ ရပါတယ်။

Abort signal ကို trigger လုပ်ပြီး — `abortController.signal` ကနေ `'abort'` event ကို emit လုပ်စေပါတယ်။

### `abortController.signal`

* Type: {AbortSignal}

## Class: `AbortSignal`

* Extends: {EventTarget}

`abortController.abort()` method ကို ခေါ်လိုက်တဲ့အခါ observers တွေကို အသိပေးဖို့ `AbortSignal` ကို သုံးပါတယ်။

### Static method: `AbortSignal.abort([reason])`

* `reason` {any}
* Returns: {AbortSignal}

ကြိုတင် abort လုပ်ပြီးသား `AbortSignal` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

### Static method: `AbortSignal.timeout(delay)`

* `delay` {number} AbortSignal ကို trigger မလုပ်ခင် စောင့်ဆိုင်းရမယ့် millisecond အရေအတွက်။

`delay` milliseconds ကြာပြီးတဲ့အခါ abort ဖြစ်သွားမယ့် `AbortSignal` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

### Static method: `AbortSignal.any(signals)`

* `signals` {AbortSignal\[]} `AbortSignal` အသစ်တစ်ခုကို ပေါင်းစပ် ဖွဲ့စည်းဖို့ သုံးမယ့် `AbortSignal` တွေပါ။

ပေးထားတဲ့ signals တွေထဲက တစ်ခုခု abort ဖြစ်သွားရင် abort ဖြစ်မယ့် `AbortSignal` အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။ ဘယ် `signals` က သူ့ကို abort ဖြစ်စေခဲ့လဲ — အဲဒီ signal ရဲ့ reason ကို [`abortSignal.reason`][] မှာ သတ်မှတ်ပေးမှာ ဖြစ်ပါတယ်။

### Event: `'abort'`

`abortController.abort()` method ကို ခေါ်လိုက်တဲ့အခါ `'abort'` event ကို emit လုပ်ပါတယ်။ Callback ကို object argument တစ်ခုတည်းနဲ့ ခေါ်ပြီး — အဲဒီ object မှာ `'abort'` လို့ သတ်မှတ်ထားတဲ့ `type` property တစ်ခုပဲ ပါပါတယ်:

```js
const ac = new AbortController();

// Use either the onabort property...
ac.signal.onabort = () => console.log('aborted!');

// Or the EventTarget API...
ac.signal.addEventListener('abort', (event) => {
  console.log(event.type);  // Prints 'abort'
}, { once: true });

ac.abort();
```

`AbortSignal` နဲ့ ဆက်စပ်နေတဲ့ `AbortController` က `'abort'` event ကို တစ်ကြိမ်တည်းပဲ trigger လုပ်ပါလိမ့်မယ်။ `'abort'` event listener တစ်ခု ထပ်မထည့်ခင် code တွေက `abortSignal.aborted` attribute က `false` ဖြစ်နေကြောင်း စစ်ဆေးဖို့ အကြံပြုပါတယ်။

`AbortSignal` ပေါ်မှာ တွဲထားတဲ့ event listeners တွေအားလုံးက `{ once: true }` option ကို သုံးသင့်ပါတယ် (ဒါမှမဟုတ် — listener တစ်ခု တွဲဖို့ `EventEmitter` APIs တွေကို သုံးနေတယ်ဆိုရင် `once()` method ကို သုံးပါ) — ဒါမှ `'abort'` event ကို ကိုင်တွယ်ပြီးတာနဲ့ event listener ကို ချက်ချင်း ဖယ်ရှားနိုင်မှာ ဖြစ်ပါတယ်။ ဒီလို မလုပ်ပါက memory leaks (မှတ်ဉာဏ် ယိုစိမ့်မှု) ဖြစ်နိုင်ပါတယ်။

### `abortSignal.aborted`

* Type: {boolean}

`AbortController` ကို abort လုပ်ပြီးသွားရင် `true` ဖြစ်ပါတယ်။

### `abortSignal.onabort`

* Type: {Function}

`abortController.abort()` function ကို ခေါ်လိုက်တဲ့အခါ အသိပေးခံရဖို့ user code က သတ်မှတ်ပေးနိုင်တဲ့ optional callback function တစ်ခုပါ။

### `abortSignal.reason`

* Type: {any}

`AbortSignal` ကို trigger လုပ်လိုက်တဲ့အခါ သတ်မှတ်နိုင်တဲ့ optional reason တစ်ခုပါ။

```js
const ac = new AbortController();
ac.abort(new Error('boom!'));
console.log(ac.signal.reason);  // Error: boom!
```

### `abortSignal.throwIfAborted()`

`abortSignal.aborted` က `true` ဆိုရင် `abortSignal.reason` ကို throw လုပ်ပါတယ်။

## `atob(data)`

> Stability: 3 - Legacy. Use `Buffer.from(data, 'base64')` instead.

[`buffer.atob()`][] ရဲ့ global alias (အစားထိုးအမည်) တစ်ခုပါ။

အလိုအလျောက် ပြောင်းရွှေ့ပေးတဲ့ migration တစ်ခုလည်း ရနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/buffer-atob-btoa)):

```bash
npx codemod@latest @nodejs/buffer-atob-btoa
```

## Class: `Blob`

{Blob} ကို ကြည့်ပါ။

## Class: `BroadcastChannel`

{BroadcastChannel} ကို ကြည့်ပါ။

## `btoa(data)`

> Stability: 3 - Legacy. Use `buf.toString('base64')` instead.

[`buffer.btoa()`][] ရဲ့ global alias တစ်ခုပါ။

အလိုအလျောက် ပြောင်းရွှေ့ပေးတဲ့ migration တစ်ခုလည်း ရနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/buffer-atob-btoa)):

```bash
npx codemod@latest @nodejs/buffer-atob-btoa
```

## Class: `Buffer`

* Type: {Function}

Binary data (ဒွိ ဒေတာ) တွေကို ကိုင်တွယ်ဖို့ သုံးပါတယ်။ [buffer section][] ကို ကြည့်ပါ။

## Class: `ByteLengthQueuingStrategy`

Browser နဲ့ compatible ဖြစ်တဲ့ [`ByteLengthQueuingStrategy`][] implementation တစ်ခုပါ။

## `clearImmediate(immediateObject)`

[`clearImmediate`][] ကို [timers][] section မှာ ဖော်ပြထားပါတယ်။

## `clearInterval(intervalObject)`

[`clearInterval`][] ကို [timers][] section မှာ ဖော်ပြထားပါတယ်။

## `clearTimeout(timeoutObject)`

[`clearTimeout`][] ကို [timers][] section မှာ ဖော်ပြထားပါတယ်။

## Class: `CloseEvent`

Browser နဲ့ compatible ဖြစ်တဲ့ {CloseEvent} implementation တစ်ခုပါ။ ဒီ API ကို [`--no-experimental-websocket`][] CLI flag နဲ့ ပိတ်ထားနိုင်ပါတယ်။

## Class: `CompressionStream`

Browser နဲ့ compatible ဖြစ်တဲ့ [`CompressionStream`][] implementation တစ်ခုပါ။

## `console`

* Type: {Object}

stdout နဲ့ stderr ဆီ ပုံနှိပ်ထုတ်ဖို့ သုံးပါတယ်။ [`console`][] section ကို ကြည့်ပါ။

## Class: `CountQueuingStrategy`

Browser နဲ့ compatible ဖြစ်တဲ့ [`CountQueuingStrategy`][] implementation တစ်ခုပါ။

## Class: `Crypto`

Browser နဲ့ compatible ဖြစ်တဲ့ {Crypto} implementation တစ်ခုပါ။ ဒီ global က `node:crypto` module အတွက် ပံ့ပိုးမှု အပါအဝင် compile လုပ်ထားတဲ့ Node.js binary တွေမှာပဲ ရနိုင်ပါတယ်။

## `crypto`

Browser နဲ့ compatible ဖြစ်တဲ့ [Web Crypto API][] implementation တစ်ခုပါ။

## Class: `CryptoKey`

Browser နဲ့ compatible ဖြစ်တဲ့ {CryptoKey} implementation တစ်ခုပါ။ ဒီ global က `node:crypto` module အတွက် ပံ့ပိုးမှု အပါအဝင် compile လုပ်ထားတဲ့ Node.js binary တွေမှာပဲ ရနိုင်ပါတယ်။

## Class: `CustomEvent`

Browser နဲ့ compatible ဖြစ်တဲ့ {CustomEvent} implementation တစ်ခုပါ။

## Class: `DecompressionStream`

Browser နဲ့ compatible ဖြစ်တဲ့ [`DecompressionStream`][] implementation တစ်ခုပါ။

## Class: `DOMException`

WHATWG ရဲ့ {DOMException} class ပါ။

## `ErrorEvent`

Browser နဲ့ compatible ဖြစ်တဲ့ {ErrorEvent} implementation တစ်ခုပါ။

## Class: `Event`

Browser နဲ့ compatible ဖြစ်တဲ့ `Event` class ရဲ့ implementation တစ်ခုပါ။ အသေးစိတ်အတွက် [`EventTarget` and `Event` API][] ကို ကြည့်ပါ။

## Class: `EventSource`

> Stability: 1 - Experimental. Enable this API with the [`--experimental-eventsource`][]
> CLI flag နဲ့ ဖွင့်နိုင်ပါတယ်။

Browser နဲ့ compatible ဖြစ်တဲ့ {EventSource} implementation တစ်ခုပါ။

## Class: `EventTarget`

Browser နဲ့ compatible ဖြစ်တဲ့ `EventTarget` class ရဲ့ implementation တစ်ခုပါ။ အသေးစိတ်အတွက် [`EventTarget` and `Event` API][] ကို ကြည့်ပါ။

## `exports`

ဒီ variable က global ဖြစ်ပုံ ရပေမယ့် တကယ်တော့ မဟုတ်ပါဘူး။ [`exports`][] ကို ကြည့်ပါ။

## `fetch`

Browser နဲ့ compatible ဖြစ်တဲ့ [`fetch()`][] function ရဲ့ implementation တစ်ခုပါ။

```mjs
const res = await fetch('https://nodejs.org/api/documentation.json');
if (res.ok) {
  const data = await res.json();
  console.log(data);
}
```

ဒီ implementation က [undici](https://undici.nodejs.org) ကို အခြေခံထားပါတယ် — Node.js အတွက် ဘာမှ အခြေခံမရှိဘဲ (from scratch) ရေးထားတဲ့ HTTP/1.1 client တစ်ခုပါ။ သင့် Node.js process ထဲမှာ `undici` ရဲ့ ဘယ် version က ပါဝင်နေလဲဆိုတာကို `process.versions.undici` property ကို ဖတ်ပြီး သိနိုင်ပါတယ်။

### Custom dispatcher (စိတ်ကြိုက် dispatcher)

Fetch ရဲ့ options object ထဲမှာ ထည့်ပေးလိုက်တဲ့ custom dispatcher တစ်ခုကို သုံးပြီး requests တွေကို dispatch လုပ်နိုင်ပါတယ်။ အဲဒီ dispatcher က `undici` ရဲ့ [`Dispatcher` class](https://undici.nodejs.org/api/Dispatcher) နဲ့ compatible ဖြစ်ရပါမယ်။

```js
fetch(url, { dispatcher: new MyAgent() });
```

`undici` ကို install လုပ်ပြီး `setGlobalDispatcher()` method ကို သုံးခြင်းအားဖြင့် Node.js ထဲက global dispatcher ကို ပြောင်းလဲနိုင်ပါတယ်။ ဒီ method ကို ခေါ်လိုက်ရင် `undici` ရော Node.js ရော နှစ်ခုလုံးအပေါ် သက်ရောက်မှု ရှိပါတယ်။

```mjs
import { setGlobalDispatcher } from 'undici';
setGlobalDispatcher(new MyAgent());
```

### Related classes (ဆက်စပ်သော classes များ)

အောက်ပါ globals တွေကို `fetch` နဲ့ တွဲသုံးဖို့ ရနိုင်ပါတယ်:

* [`FormData`][]
* [`Headers`][]
* [`Request`][]
* [`Response`][]

## Class: `File`

{File} ကို ကြည့်ပါ။

## Class: `FormData`

Browser နဲ့ compatible ဖြစ်တဲ့ {FormData} implementation တစ်ခုပါ။

## `global`

> Stability: 3 - Legacy. Use [`globalThis`][] instead.

* Type: {Object} Global namespace object ပါ။

Browsers တွေမှာ top-level scope က အစဉ်အလာအရ global scope ဖြစ်ပါတယ်။ ဒါကြောင့် — ECMAScript modules တွေကလွဲရင် — `var something` ဆိုတာ global variable အသစ်တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ Node.js မှာတော့ ဒါက ကွဲပြားပါတယ်။ Top-level scope က global scope မဟုတ်ပါဘူး; Node.js module တစ်ခုထဲက `var something` က — အဲဒီ module က [CommonJS module][] လား [ECMAScript module][] လားဆိုတာ မသက်ဆိုင်ဘဲ — အဲဒီ module ထဲမှာပဲ သက်ဆိုင်တဲ့ local variable ဖြစ်ပါတယ်။

## Class: `Headers`

Browser နဲ့ compatible ဖြစ်တဲ့ {Headers} implementation တစ်ခုပါ။

## `localStorage`

> Stability: 1.2 - Release candidate. Disable this API with [`--no-experimental-webstorage`][].

Browser နဲ့ compatible ဖြစ်တဲ့ [`localStorage`][] implementation တစ်ခုပါ။ Data တွေကို [`--localstorage-file`][] CLI flag နဲ့ သတ်မှတ်ထားတဲ့ file ထဲမှာ encryption (စာဝှက်ခြင်း) မပါဘဲ သိမ်းပါတယ်။ သိမ်းလို့ရတဲ့ data ရဲ့ အများဆုံး ပမာဏက 10 MB ပါ။ Web Storage API ရဲ့ အပြင်ဘက်ကနေ ဒီ data တွေကို ပြုပြင်မွမ်းမံတာကို support မလုပ်ပါဘူး။ Server တစ်ခုရဲ့ context မှာ သုံးတဲ့အခါ `localStorage` data က user တစ်ယောက်ချင်း သို့မဟုတ် request တစ်ခုချင်းအလိုက် သိမ်းတာ မဟုတ်ဘဲ — user အားလုံးနဲ့ requests အားလုံးကြားမှာ မျှဝေခံရပါတယ်။

## Class: `MessageChannel`

`MessageChannel` class ပါ။ အသေးစိတ်အတွက် [`MessageChannel`][] ကို ကြည့်ပါ။

## Class: `MessageEvent`

Browser နဲ့ compatible ဖြစ်တဲ့ {MessageEvent} implementation တစ်ခုပါ။

## Class: `MessagePort`

`MessagePort` class ပါ။ အသေးစိတ်အတွက် [`MessagePort`][] ကို ကြည့်ပါ။

## `module`

ဒီ variable က global ဖြစ်ပုံ ရပေမယ့် တကယ်တော့ မဟုတ်ပါဘူး။ [`module`][] ကို ကြည့်ပါ။

## Class: `Navigator`

> Stability: 1.1 - Active development. Disable this API with the
> [`--no-experimental-global-navigator`][] CLI flag နဲ့ ပိတ်ထားနိုင်ပါတယ်။

[Navigator API][] ရဲ့ တစိတ်တပိုင်း implementation တစ်ခုပါ။

## `navigator`

> Stability: 1.1 - Active development. Disable this API with the
> [`--no-experimental-global-navigator`][] CLI flag နဲ့ ပိတ်ထားနိုင်ပါတယ်။

[`window.navigator`][] ရဲ့ တစိတ်တပိုင်း implementation တစ်ခုပါ။

### `navigator.hardwareConcurrency`

* Type: {number}

`navigator.hardwareConcurrency` read-only property က လက်ရှိ Node.js instance အတွက် ရနိုင်တဲ့ logical processors အရေအတွက်ကို ပြန်ပေးပါတယ်။

```js
console.log(`This process is running on ${navigator.hardwareConcurrency} logical processors`);
```

### `navigator.language`

* Type: {string}

`navigator.language` read-only property က Node.js instance ရဲ့ ဦးစားပေး ဘာသာစကားကို ကိုယ်စားပြုတဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။ အဲဒီ ဘာသာစကားကို Node.js က runtime မှာ အသုံးပြုတဲ့ ICU library က — operating system ရဲ့ default ဘာသာစကားကို အခြေခံပြီး ဆုံးဖြတ်ပါတယ်။

ဒီတန်ဖိုးက [RFC 5646][] မှာ သတ်မှတ်ထားတဲ့အတိုင်း language version ကို ကိုယ်စားပြုပါတယ်။

ICU မပါတဲ့ builds တွေမှာတော့ fallback တန်ဖိုးက `'en-US'` ပါ။

```js
console.log(`The preferred language of the Node.js instance has the tag '${navigator.language}'`);
```

### `navigator.languages`

* Type: {string\[]}

`navigator.languages` read-only property က Node.js instance ရဲ့ ဦးစားပေး ဘာသာစကားတွေကို ကိုယ်စားပြုတဲ့ strings တွေရဲ့ array ကို ပြန်ပေးပါတယ်။ မူလအားဖြင့် `navigator.languages` မှာ `navigator.language` ရဲ့ တန်ဖိုးတစ်ခုတည်းပဲ ပါဝင်ပြီး — အဲဒီတန်ဖိုးကို Node.js က runtime မှာ အသုံးပြုတဲ့ ICU library က operating system ရဲ့ default ဘာသာစကားကို အခြေခံပြီး ဆုံးဖြတ်ပါတယ်။

ICU မပါတဲ့ builds တွေမှာတော့ fallback တန်ဖိုးက `['en-US']` ပါ။

```js
console.log(`The preferred languages are '${navigator.languages}'`);
```

### `navigator.locks`

> Stability: 1 - Experimental

`navigator.locks` read-only property က [`LockManager`][] instance တစ်ခုကို ပြန်ပေးပါတယ် — process တစ်ခုတည်းအတွင်းက threads အများအပြားကြားမှာ မျှဝေသုံးနိုင်တဲ့ resources တွေဆီ ဝင်ရောက်မှုကို ညှိနှိုင်းဖို့ ဒါကို သုံးနိုင်ပါတယ်။ ဒီ global implementation က [browser `LockManager`][] API ရဲ့ semantics (အဓိပ္ပာယ် သဘောတရားများ) နဲ့ ကိုက်ညီပါတယ်။

```mjs
// Request an exclusive lock
await navigator.locks.request('my_resource', async (lock) => {
  // The lock has been acquired.
  console.log(`Lock acquired: ${lock.name}`);
  // Lock is automatically released when the function returns
});

// Request a shared lock
await navigator.locks.request('shared_resource', { mode: 'shared' }, async (lock) => {
  // Multiple shared locks can be held simultaneously
  console.log(`Shared lock acquired: ${lock.name}`);
});
```

```
// Request an exclusive lock
navigator.locks.request('my_resource', async (lock) => {
  // The lock has been acquired.
  console.log(`Lock acquired: ${lock.name}`);
  // Lock is automatically released when the function returns
}).then(() => {
  console.log('Lock released');
});

// Request a shared lock
navigator.locks.request('shared_resource', { mode: 'shared' }, async (lock) => {
  // Multiple shared locks can be held simultaneously
  console.log(`Shared lock acquired: ${lock.name}`);
}).then(() => {
  console.log('Shared lock released');
});
```

အသေးစိတ် API documentation အတွက် [`worker_threads.locks`][] ကို ကြည့်ပါ။

### `navigator.platform`

* Type: {string}

`navigator.platform` read-only property က Node.js instance လည်ပတ်နေတဲ့ platform ကို ခွဲခြားဖော်ပြတဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။

```js
console.log(`This process is running on ${navigator.platform}`);
```

### `navigator.userAgent`

* Type: {string}

`navigator.userAgent` read-only property က runtime နာမည်နဲ့ major version နံပါတ် ပါဝင်တဲ့ user agent တစ်ခုကို ပြန်ပေးပါတယ်။

```js
console.log(`The user-agent is ${navigator.userAgent}`); // Prints "Node.js/21"
```

## `performance`

[`perf_hooks.performance`][] object ပါ။

## Class: `PerformanceEntry`

`PerformanceEntry` class ပါ။ အသေးစိတ်အတွက် [`PerformanceEntry`][] ကို ကြည့်ပါ။

## Class: `PerformanceMark`

`PerformanceMark` class ပါ။ အသေးစိတ်အတွက် [`PerformanceMark`][] ကို ကြည့်ပါ။

## Class: `PerformanceMeasure`

`PerformanceMeasure` class ပါ။ အသေးစိတ်အတွက် [`PerformanceMeasure`][] ကို ကြည့်ပါ။

## Class: `PerformanceObserver`

`PerformanceObserver` class ပါ။ အသေးစိတ်အတွက် [`PerformanceObserver`][] ကို ကြည့်ပါ။

## Class: `PerformanceObserverEntryList`

`PerformanceObserverEntryList` class ပါ။ အသေးစိတ်အတွက် [`PerformanceObserverEntryList`][] ကို ကြည့်ပါ။

## Class: `PerformanceResourceTiming`

`PerformanceResourceTiming` class ပါ။ အသေးစိတ်အတွက် [`PerformanceResourceTiming`][] ကို ကြည့်ပါ။

## `process`

* Type: {Object}

Process object ပါ။ [`process` object][] section ကို ကြည့်ပါ။

## `queueMicrotask(callback)`

* `callback` {Function} Queue လုပ်ရန် လိုအပ်တဲ့ function တစ်ခုပါ။

`queueMicrotask()` method က `callback` ကို ခေါ်ယူဖို့ microtask တစ်ခုကို queue ထဲ ထည့်ပေးပါတယ်။ `callback` က exception တစ်ခု throw လုပ်မိရင် — [`process` object][] ရဲ့ `'uncaughtException'` event ကို emit လုပ်ပါလိမ့်မယ်။

Microtask queue ကို V8 က စီမံပြီး — Node.js က စီမံတဲ့ [`process.nextTick()`][] queue နဲ့ အလားတူ ပုံစံမျိုး သုံးနိုင်ပါတယ်။ Node.js event loop ရဲ့ လှည့်ပတ်မှု (turn) တစ်ခုချင်းစီအတွင်းမှာ `process.nextTick()` queue ကို microtask queue ထက် အမြဲတမ်း အရင်ဆုံး လုပ်ဆောင်ပါတယ်။

```js
// Here, `queueMicrotask()` is used to ensure the 'load' event is always
// emitted asynchronously, and therefore consistently. Using
// `process.nextTick()` here would result in the 'load' event always emitting
// before any other promise jobs.

DataHandler.prototype.load = async function load(key) {
  const hit = this._cache.get(key);
  if (hit !== undefined) {
    queueMicrotask(() => {
      this.emit('load', hit);
    });
    return;
  }

  const data = await fetchData(key);
  this._cache.set(key, data);
  this.emit('load', data);
};
```

## Class: `QuotaExceededError`

WHATWG {QuotaExceededError} class ပါ။ {DOMException} ကို extends လုပ်ပါတယ်။

## Class: `ReadableByteStreamController`

Browser နဲ့ compatible ဖြစ်တဲ့ [`ReadableByteStreamController`][] implementation တစ်ခုပါ။

## Class: `ReadableStream`

Browser နဲ့ compatible ဖြစ်တဲ့ [`ReadableStream`][] implementation တစ်ခုပါ။

## Class: `ReadableStreamBYOBReader`

Browser နဲ့ compatible ဖြစ်တဲ့ [`ReadableStreamBYOBReader`][] implementation တစ်ခုပါ။

## Class: `ReadableStreamBYOBRequest`

Browser နဲ့ compatible ဖြစ်တဲ့ [`ReadableStreamBYOBRequest`][] implementation တစ်ခုပါ။

## Class: `ReadableStreamDefaultController`

Browser နဲ့ compatible ဖြစ်တဲ့ [`ReadableStreamDefaultController`][] implementation တစ်ခုပါ။

## Class: `ReadableStreamDefaultReader`

Browser နဲ့ compatible ဖြစ်တဲ့ [`ReadableStreamDefaultReader`][] implementation တစ်ခုပါ။

## Class: `Request`

Browser နဲ့ compatible ဖြစ်တဲ့ {Request} implementation တစ်ခုပါ။

## `require()`

ဒီ variable က global ဖြစ်ပုံ ရပေမယ့် တကယ်တော့ မဟုတ်ပါဘူး။ [`require()`][] ကို ကြည့်ပါ။

## Class: `Response`

Browser နဲ့ compatible ဖြစ်တဲ့ {Response} implementation တစ်ခုပါ။

## `sessionStorage`

> Stability: 1.2 - Release candidate. Disable this API with [`--no-experimental-webstorage`][].

Browser နဲ့ compatible ဖြစ်တဲ့ [`sessionStorage`][] implementation တစ်ခုပါ။ Data တွေကို memory ထဲမှာ သိမ်းပြီး — storage quota က 10 MB ပါ။ `sessionStorage` data တွေက လက်ရှိ run နေတဲ့ process အတွင်းမှာပဲ တည်တံ့ပြီး — workers တွေကြားမှာ မျှဝေမပေးပါဘူး။

## `setImmediate(callback[, ...args])`

[`setImmediate`][] ကို [timers][] section မှာ ဖော်ပြထားပါတယ်။

## `setInterval(callback, delay[, ...args])`

[`setInterval`][] ကို [timers][] section မှာ ဖော်ပြထားပါတယ်။

## `setTimeout(callback, delay[, ...args])`

[`setTimeout`][] ကို [timers][] section မှာ ဖော်ပြထားပါတယ်။

## Class: `Storage`

> Stability: 1.2 - Release candidate. Disable this API with [`--no-experimental-webstorage`][].

Browser နဲ့ compatible ဖြစ်တဲ့ {Storage} implementation တစ်ခုပါ။

## `structuredClone(value[, options])`

WHATWG [`structuredClone`][] method ပါ။

## Class: `SubtleCrypto`

Browser နဲ့ compatible ဖြစ်တဲ့ {SubtleCrypto} implementation တစ်ခုပါ။ ဒီ global က `node:crypto` module အတွက် ပံ့ပိုးမှု အပါအဝင် compile လုပ်ထားတဲ့ Node.js binary တွေမှာပဲ ရနိုင်ပါတယ်။

## Class: `TextDecoder`

WHATWG `TextDecoder` class ပါ။ [`TextDecoder`][] section ကို ကြည့်ပါ။

## Class: `TextDecoderStream`

Browser နဲ့ compatible ဖြစ်တဲ့ [`TextDecoderStream`][] implementation တစ်ခုပါ။

## Class: `TextEncoder`

WHATWG `TextEncoder` class ပါ။ [`TextEncoder`][] section ကို ကြည့်ပါ။

## Class: `TextEncoderStream`

Browser နဲ့ compatible ဖြစ်တဲ့ [`TextEncoderStream`][] implementation တစ်ခုပါ။

## Class: `TransformStream`

Browser နဲ့ compatible ဖြစ်တဲ့ [`TransformStream`][] implementation တစ်ခုပါ။

## Class: `TransformStreamDefaultController`

Browser နဲ့ compatible ဖြစ်တဲ့ [`TransformStreamDefaultController`][] implementation တစ်ခုပါ။

## Class: `URL`

WHATWG `URL` class ပါ။ [`URL`][] section ကို ကြည့်ပါ။

## Class: `URLPattern`

> Stability: 1 - Experimental

WHATWG `URLPattern` class ပါ။ [`URLPattern`][] section ကို ကြည့်ပါ။

## Class: `URLSearchParams`

WHATWG `URLSearchParams` class ပါ။ [`URLSearchParams`][] section ကို ကြည့်ပါ။

## Class: `WebAssembly`

* Type: {Object}

W3C [WebAssembly][webassembly-org] နဲ့ ဆက်စပ်တဲ့ လုပ်ဆောင်ချက်တွေ အားလုံးအတွက် namespace အဖြစ် ဆောင်ရွက်ပေးတဲ့ object ပါ။ အသုံးပြုပုံနဲ့ compatibility (လိုက်ဖက်ညီမှု) အကြောင်းကို [Mozilla Developer Network][webassembly-mdn] မှာ ကြည့်ပါ။

## Class: `WebSocket`

Browser နဲ့ compatible ဖြစ်တဲ့ {WebSocket} implementation တစ်ခုပါ။ ဒီ API ကို [`--no-experimental-websocket`][] CLI flag နဲ့ ပိတ်ထားနိုင်ပါတယ်။

## Class: `WritableStream`

Browser နဲ့ compatible ဖြစ်တဲ့ [`WritableStream`][] implementation တစ်ခုပါ။

## Class: `WritableStreamDefaultController`

Browser နဲ့ compatible ဖြစ်တဲ့ [`WritableStreamDefaultController`][] implementation တစ်ခုပါ။

## Class: `WritableStreamDefaultWriter`

Browser နဲ့ compatible ဖြစ်တဲ့ [`WritableStreamDefaultWriter`][] implementation တစ်ခုပါ။

[CommonJS module]: modules.md
[CommonJS modules]: modules.md
[ECMAScript module]: esm.md
[Navigator API]: https://html.spec.whatwg.org/multipage/system-state.html#the-navigator-object
[RFC 5646]: https://www.rfc-editor.org/rfc/rfc5646.txt
[Web Crypto API]: webcrypto.md
[`--experimental-eventsource`]: cli.md#--experimental-eventsource
[`--localstorage-file`]: cli.md#--localstorage-filefile
[`--no-experimental-global-navigator`]: cli.md#--no-experimental-global-navigator
[`--no-experimental-websocket`]: cli.md#--no-experimental-websocket
[`--no-experimental-webstorage`]: cli.md#--no-experimental-webstorage
[`ByteLengthQueuingStrategy`]: webstreams.md#class-bytelengthqueuingstrategy
[`CompressionStream`]: webstreams.md#class-compressionstream
[`CountQueuingStrategy`]: webstreams.md#class-countqueuingstrategy
[`DecompressionStream`]: webstreams.md#class-decompressionstream
[`EventTarget` and `Event` API]: events.md#eventtarget-and-event-api
[`FormData`]: #class-formdata
[`Headers`]: #class-headers
[`LockManager`]: worker_threads.md#class-lockmanager
[`MessageChannel`]: worker_threads.md#class-messagechannel
[`MessagePort`]: worker_threads.md#class-messageport
[`PerformanceEntry`]: perf_hooks.md#class-performanceentry
[`PerformanceMark`]: perf_hooks.md#class-performancemark
[`PerformanceMeasure`]: perf_hooks.md#class-performancemeasure
[`PerformanceObserverEntryList`]: perf_hooks.md#class-performanceobserverentrylist
[`PerformanceObserver`]: perf_hooks.md#class-performanceobserver
[`PerformanceResourceTiming`]: perf_hooks.md#class-performanceresourcetiming
[`ReadableByteStreamController`]: webstreams.md#class-readablebytestreamcontroller
[`ReadableStreamBYOBReader`]: webstreams.md#class-readablestreambyobreader
[`ReadableStreamBYOBRequest`]: webstreams.md#class-readablestreambyobrequest
[`ReadableStreamDefaultController`]: webstreams.md#class-readablestreamdefaultcontroller
[`ReadableStreamDefaultReader`]: webstreams.md#class-readablestreamdefaultreader
[`ReadableStream`]: webstreams.md#class-readablestream
[`Request`]: #class-request
[`Response`]: #class-response
[`TextDecoderStream`]: webstreams.md#class-textdecoderstream
[`TextDecoder`]: util.md#class-utiltextdecoder
[`TextEncoderStream`]: webstreams.md#class-textencoderstream
[`TextEncoder`]: util.md#class-utiltextencoder
[`TransformStreamDefaultController`]: webstreams.md#class-transformstreamdefaultcontroller
[`TransformStream`]: webstreams.md#class-transformstream
[`URLPattern`]: url.md#class-urlpattern
[`URLSearchParams`]: url.md#class-urlsearchparams
[`URL`]: url.md#class-url
[`WritableStreamDefaultController`]: webstreams.md#class-writablestreamdefaultcontroller
[`WritableStreamDefaultWriter`]: webstreams.md#class-writablestreamdefaultwriter
[`WritableStream`]: webstreams.md#class-writablestream
[`__dirname`]: modules.md#__dirname
[`__filename`]: modules.md#__filename
[`abortSignal.reason`]: #abortsignalreason
[`buffer.atob()`]: buffer.md#bufferatobdata
[`buffer.btoa()`]: buffer.md#bufferbtoadata
[`clearImmediate`]: timers.md#clearimmediateimmediate
[`clearInterval`]: timers.md#clearintervaltimeout
[`clearTimeout`]: timers.md#cleartimeouttimeout
[`console`]: console.md
[`exports`]: modules.md#exports
[`fetch()`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
[`globalThis`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
[`localStorage`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[`module`]: modules.md#module
[`perf_hooks.performance`]: perf_hooks.md#perf_hooksperformance
[`process.nextTick()`]: process.md#processnexttickcallback-args
[`process` object]: process.md#process
[`require()`]: modules.md#requireid
[`sessionStorage`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
[`setImmediate`]: timers.md#setimmediatecallback-args
[`setInterval`]: timers.md#setintervalcallback-delay-args
[`setTimeout`]: timers.md#settimeoutcallback-delay-args
[`structuredClone`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
[`window.navigator`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
[`worker_threads.locks`]: worker_threads.md#worker_threadslocks
[browser `LockManager`]: https://developer.mozilla.org/en-US/docs/Web/API/LockManager
[buffer section]: buffer.md
[built-in objects]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
[timers]: timers.md
[webassembly-mdn]: https://developer.mozilla.org/en-US/docs/WebAssembly
[webassembly-org]: https://webassembly.org
