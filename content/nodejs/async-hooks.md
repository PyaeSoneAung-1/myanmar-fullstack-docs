---
title: "Async hooks"
description: "node:async_hooks module (experimental) — async resources တွေရဲ့ lifecycle events တွေကို ခြေရာခံခြင်း (asyncLocalStorage အပါအဝင်)။"
order: 88
source: "https://nodejs.org/api/async_hooks.html"
status: translated
updated: 2026-09-04
---

> Stability: 1 - Experimental. ဖြစ်နိုင်ရင် ဒီ API ကနေ ရွှေ့ပြောင်းသွားပေးပါ။
> [`createHook`][], [`AsyncHook`][], နဲ့ [`executionAsyncResource`][] APIs တွေမှာ usability issues (အသုံးပြုရ ခက်ခဲမှုများ), safety risks (လုံခြုံရေး အန္တရာယ်များ), နဲ့ performance implications (စွမ်းဆောင်ရည် ထိခိုက်မှုများ) ရှိနိုင်တာမို့ သုံးဖို့ အကြံမပြုပါဘူး။ Async context tracking လိုအပ်ချက်တွေကိုတော့ stable ဖြစ်တဲ့ [`AsyncLocalStorage`][] API နဲ့ ဖြည့်ဆည်းတာ ပိုကောင်းပါတယ်။ context tracking လိုအပ်ချက် (ဒါမှမဟုတ် [Diagnostics Channel][] က လောလောဆယ် ပေးနေတဲ့ diagnostics data ထက် ကျော်လွန်တဲ့) `createHook`, `AsyncHook`, (သို့) `executionAsyncResource` အတွက် သုံးစွဲမှု ကိစ္စတစ်ခုခု ရှိနေရင် — ပိုပြီး ရည်ရွယ်ချက် အာရုံစိုက်ထားတဲ့ API တစ်ခု ဖန်တီးနိုင်အောင် <https://github.com/nodejs/node/issues> မှာ သင့် use case အကြောင်း issue ဖွင့်ပေးပါ။

`async_hooks` API ကို သုံးဖို့ အထူးပင် အားမပေးပါဘူး။

၎င်းရဲ့ use cases အများစုကို ဖုံးအုပ်ပေးနိုင်တဲ့ တခြား APIs တွေ ရှိပါတယ်:

* [`AsyncLocalStorage`][] က async context ကို ခြေရာခံပေးပါတယ်
* [`process.getActiveResourcesInfo()`][] က active resources တွေကို ခြေရာခံပေးပါတယ်

`node:async_hooks` module က asynchronous resources တွေကို ခြေရာခံဖို့ API တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ အောက်ပါအတိုင်း ဝင်ရောက်သုံးနိုင်ပါတယ်:

```mjs
import async_hooks from 'node:async_hooks';
```

```cjs
const async_hooks = require('node:async_hooks');
```

## ဝေါဟာရများ (Terminology)

Asynchronous resource ဆိုတာ callback တစ်ခုနဲ့ ဆက်စပ်ထားတဲ့ object တစ်ခုကို ကိုယ်စားပြုပါတယ်။ ဒီ callback ကို — `net.createServer()` ထဲက `'connection'` event လိုမျိုး — အကြိမ်များစွာ ခေါ်နိုင်သလို၊ `fs.open()` လိုနေရာမှာတော့ တစ်ကြိမ်တည်းပဲ ခေါ်နိုင်ပါတယ်။ Resource တစ်ခုကို callback မခေါ်ခင် ပိတ်သိမ်းလိုက်တာလည်း ဖြစ်နိုင်ပါတယ်။ `AsyncHook` က ဒီကိစ္စရပ် အမျိုးမျိုးကို အတိအကျ ခွဲခြားမပြဘဲ — resource တစ်ခုဆိုတဲ့ abstract concept (စိတ္တဇ သဘောတရား) အနေနဲ့ပဲ ကိုယ်စားပြုပါလိမ့်မယ်။

[`Worker`][] တွေကို သုံးမယ်ဆိုရင် — thread တစ်ခုချင်းစီမှာ သီးခြား လွတ်လပ်တဲ့ `async_hooks` interface ရှိပြီး၊ thread တစ်ခုချင်းစီက async IDs အသစ် အစုံတစ်ခုကို သုံးပါလိမ့်မယ်။

## ခြုံငုံ သုံးသပ်ချက် (Overview)

အောက်မှာ public API ရဲ့ ရိုးရှင်းတဲ့ ခြုံငုံ သုံးသပ်ချက် ဖြစ်ပါတယ်။

```mjs
import async_hooks from 'node:async_hooks';

// Return the ID of the current execution context.
const eid = async_hooks.executionAsyncId();

// Return the ID of the handle responsible for triggering the callback of the
// current execution scope to call.
const tid = async_hooks.triggerAsyncId();

// Create a new AsyncHook instance. All of these callbacks are optional.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Allow callbacks of this AsyncHook instance to call. This is not an implicit
// action after running the constructor, and must be explicitly run to begin
// executing callbacks.
asyncHook.enable();

// Disable listening for new asynchronous events.
asyncHook.disable();

//
// The following are the callbacks that can be passed to createHook().
//

// init() is called during object construction. The resource may not have
// completed construction when this callback runs. Therefore, all fields of the
// resource referenced by "asyncId" may not have been populated.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() is called just before the resource's callback is called. It can be
// called 0-N times for handles (such as TCPWrap), and will be called exactly 1
// time for requests (such as FSReqCallback).
function before(asyncId) { }

// after() is called just after the resource's callback has finished.
function after(asyncId) { }

// destroy() is called when the resource is destroyed.
function destroy(asyncId) { }

// promiseResolve() is called only for promise resources, when the
// resolve() function passed to the Promise constructor is invoked
// (either directly or through other means of resolving a promise).
function promiseResolve(asyncId) { }
```

```cjs
const async_hooks = require('node:async_hooks');

// Return the ID of the current execution context.
const eid = async_hooks.executionAsyncId();

// Return the ID of the handle responsible for triggering the callback of the
// current execution scope to call.
const tid = async_hooks.triggerAsyncId();

// Create a new AsyncHook instance. All of these callbacks are optional.
const asyncHook =
    async_hooks.createHook({ init, before, after, destroy, promiseResolve });

// Allow callbacks of this AsyncHook instance to call. This is not an implicit
// action after running the constructor, and must be explicitly run to begin
// executing callbacks.
asyncHook.enable();

// Disable listening for new asynchronous events.
asyncHook.disable();

//
// The following are the callbacks that can be passed to createHook().
//

// init() is called during object construction. The resource may not have
// completed construction when this callback runs. Therefore, all fields of the
// resource referenced by "asyncId" may not have been populated.
function init(asyncId, type, triggerAsyncId, resource) { }

// before() is called just before the resource's callback is called. It can be
// called 0-N times for handles (such as TCPWrap), and will be called exactly 1
// time for requests (such as FSReqCallback).
function before(asyncId) { }

// after() is called just after the resource's callback has finished.
function after(asyncId) { }

// destroy() is called when the resource is destroyed.
function destroy(asyncId) { }

// promiseResolve() is called only for promise resources, when the
// resolve() function passed to the Promise constructor is invoked
// (either directly or through other means of resolving a promise).
function promiseResolve(asyncId) { }
```

## `async_hooks.createHook(options)`

* `options` {Object} မှတ်ပုံတင်ရန် [Hook Callbacks][] များ
  * `init` {Function} [`init` callback][]။
  * `before` {Function} [`before` callback][]။
  * `after` {Function} [`after` callback][]။
  * `destroy` {Function} [`destroy` callback][]။
  * `promiseResolve` {Function} [`promiseResolve` callback][]။
  * `trackPromises` {boolean} hook က `Promise` တွေကို ခြေရာခံမခံခံ သတ်မှတ်ချက်။ `promiseResolve` သတ်မှတ်ထားရင် `false` ဖြစ်လို့ မရပါ။ **Default**: `true`။
* Returns: {AsyncHook} hooks တွေကို disable နဲ့ enable လုပ်ဖို့ သုံးတဲ့ instance

ဒီ function က async operation တစ်ခုချင်းစီရဲ့ မတူညီတဲ့ lifetime events တွေမှာ ခေါ်ယူမယ့် functions တွေကို register (မှတ်ပုံတင်) လုပ်ပေးပါတယ်။

`init()`/`before()`/`after()`/`destroy()` callbacks တွေကို resource တစ်ခုရဲ့ သက်တမ်းအတွင်း သက်ဆိုင်ရာ asynchronous event ဖြစ်ပေါ်တဲ့အခါတိုင်း ခေါ်ပါတယ်။

Callbacks အားလုံးက optional ပါ။ ဥပမာ — resource cleanup (ရှင်းလင်းခြင်း) ကိုပဲ ခြေရာခံချင်တယ်ဆိုရင် `destroy` callback တစ်ခုတည်းကိုပဲ ပေးလိုက်ရင် ရပါတယ်။ `callbacks` ထဲ ပေးလို့ရတဲ့ functions အားလုံးရဲ့ အသေးစိတ်ကို [Hook Callbacks][] section မှာ ဖော်ပြထားပါတယ်။

```mjs
import { createHook } from 'node:async_hooks';

const asyncHook = createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```

```cjs
const async_hooks = require('node:async_hooks');

const asyncHook = async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { },
  destroy(asyncId) { },
});
```

Callbacks တွေကို prototype chain ကနေတစ်ဆင့် အမွေဆက်ခံ (inherit) လုပ်နိုင်ပါတယ်:

```js
class MyAsyncCallbacks {
  init(asyncId, type, triggerAsyncId, resource) { }
  destroy(asyncId) {}
}

class MyAddedCallbacks extends MyAsyncCallbacks {
  before(asyncId) { }
  after(asyncId) { }
}

const asyncHook = async_hooks.createHook(new MyAddedCallbacks());
```

Promises တွေက async hooks mechanism ကနေ သူတို့ရဲ့ lifecycle ကို ခြေရာခံခံရတဲ့ asynchronous resources တွေ ဖြစ်တာမို့ — `init()`, `before()`, `after()`, နဲ့ `destroy()` callbacks တွေက promise တွေကို ပြန်ပေးတဲ့ async functions တွေ _မဖြစ်ရပါဘူး_။

### Error ကိုင်တွယ်ခြင်း (Error handling)

`AsyncHook` callbacks တစ်ခုခုက throw လုပ်မိရင် application က stack trace ကို ပုံနှိပ်ပြီး ထွက်သွားပါတယ်။ ထွက်တဲ့ လမ်းကြောင်းက uncaught exception တစ်ခုရဲ့ အတိုင်းပဲ ဖြစ်ပေမယ့် — `'uncaughtException'` listeners အားလုံးကို ဖယ်ရှားလိုက်တာမို့ process က ထွက်ရတော့ပါတယ်။ Application ကို `--abort-on-uncaught-exception` နဲ့ run ထားတာ မဟုတ်ရင် `'exit'` callbacks တွေကို ဆက်ပြီး ခေါ်ပါဦးမယ်။ အဲဒီ flag နဲ့ run ထားရင်တော့ stack trace ပုံနှိပ်ပြီး core file ကျန်ရစ်ခဲ့လျက် application က ထွက်သွားပါတယ်။

ဒီလို error handling အပြုအမူ ဖြစ်ရတဲ့ အကြောင်းရင်းကတော့ — ဒီ callbacks တွေက object တစ်ခုရဲ့ သက်တမ်းထဲက မတည်ငြိမ်နိုင်တဲ့ (volatile) အချိန်တွေမှာ run နေတာမို့ပါ။ ဥပမာ — class တစ်ခုကို ဆောက်နေချိန် (construction) နဲ့ ဖျက်နေချိန် (destruction) မျိုးတွေပေါ့။ ဒါကြောင့် — နောင်တစ်ချိန် မရည်ရွယ်ဘဲ abort ဖြစ်မှုမျိုး မဖြစ်စေဖို့ process ကို မြန်မြန် ရပ်တန့်ပစ်တာ လိုအပ်တယ်လို့ ယူဆပါတယ်။ ဒီအပြုအမူကတော့ — exception တစ်ခုက မရည်ရွယ်တဲ့ ဘေးထွက်ဆိုးကျိုးတွေ မရှိဘဲ ပုံမှန် control flow အတိုင်း လိုက်နိုင်တယ်ဆိုတာ သေချာအောင် ကျယ်ကျယ်ပြန့်ပြန့် ခွဲခြမ်းစိတ်ဖြာမှု လုပ်ပြီးမှသာ နောင်မှာ ပြောင်းလဲနိုင်ခြေ ရှိပါတယ်။

### `AsyncHook` callbacks တွေထဲမှာ ပုံနှိပ်ခြင်း (Printing in `AsyncHook` callbacks)

Console ပေါ် ပုံနှိပ်တာက asynchronous operation တစ်ခု ဖြစ်တာမို့ — `console.log()` က `AsyncHook` callbacks တွေကို ထပ်ခေါ်မိစေပါတယ်။ `AsyncHook` callback function တစ်ခုထဲမှာ `console.log()` (သို့) အလားတူ asynchronous operations တွေကို သုံးရင် infinite recursion (အဆုံးမဲ့ ပြန်ခေါ်နေမှု) ဖြစ်ပါလိမ့်မယ်။ Debugging လုပ်နေတုန်း လွယ်ကူတဲ့ ဖြေရှင်းနည်းကတော့ — `fs.writeFileSync(file, msg, flag)` လိုမျိုး synchronous logging operation တစ်ခုကို သုံးတာပါ။ ဒါက file ထဲ ပုံနှိပ်ပေးမှာ ဖြစ်ပြီး — synchronous ဖြစ်တာမို့ `AsyncHook` ကို ပြန်ပြီး ထပ်ခေါ်စေမှာ မဟုတ်ပါဘူး။

```mjs
import { writeFileSync } from 'node:fs';
import { format } from 'node:util';

function debug(...args) {
  // Use a function like this one when debugging inside an AsyncHook callback
  writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
}
```

```cjs
const fs = require('node:fs');
const util = require('node:util');

function debug(...args) {
  // Use a function like this one when debugging inside an AsyncHook callback
  fs.writeFileSync('log.out', `${util.format(...args)}\n`, { flag: 'a' });
}
```

Logging အတွက် asynchronous operation တစ်ခု လိုအပ်နေရင် — `AsyncHook` ကိုယ်တိုင် ပေးတဲ့ အချက်အလက်တွေကို သုံးပြီး ဒီ asynchronous operation ကို ဘာက ဖြစ်စေခဲ့လဲ ခြေရာခံထားနိုင်ပါတယ်။ Logging ကိုယ်တိုင်ကပဲ `AsyncHook` callback ကို ခေါ်မိစေတာဆိုရင် အဲဒီ logging ကို ကျော်လိုက်သင့်ပါတယ်။ ဒီလိုလုပ်ခြင်းအားဖြင့် — တစ်နည်းအားဖြင့် ဖြစ်လာမယ့် infinite recursion ကို ဖြတ်တောက်လိုက်တာပါ။

## Class: `AsyncHook`

`AsyncHook` class က asynchronous operations တွေရဲ့ lifetime events တွေကို ခြေရာခံဖို့ interface တစ်ခုကို ထုတ်ဖော် ပံ့ပိုးပေးပါတယ်။

### `asyncHook.enable()`

* Returns: {AsyncHook} `asyncHook` ကို ရည်ညွှန်းတဲ့ reference ဖြစ်သည်။

ပေးထားတဲ့ `AsyncHook` instance တစ်ခုအတွက် callbacks တွေကို enable (အလုပ်လုပ်နိုင်အောင် ဖွင့်) လုပ်ပါတယ်။ Callbacks တွေ မပေးထားရင် enabling က no-op (ဘာမှ မလုပ်ခြင်း) ဖြစ်ပါတယ်။

`AsyncHook` instance က မူလအားဖြင့် disabled (ပိတ်ထား) ဖြစ်ပါတယ်။ `AsyncHook` instance ကို ဖန်တီးပြီးချင်း ချက်ချင်း enable လုပ်ချင်တယ်ဆိုရင် အောက်က pattern ကို သုံးနိုင်ပါတယ်။

```mjs
import { createHook } from 'node:async_hooks';

const hook = createHook(callbacks).enable();
```

```cjs
const async_hooks = require('node:async_hooks');

const hook = async_hooks.createHook(callbacks).enable();
```

### `asyncHook.disable()`

* Returns: {AsyncHook} `asyncHook` ကို ရည်ညွှန်းတဲ့ reference ဖြစ်သည်။

ပေးထားတဲ့ `AsyncHook` instance ရဲ့ callbacks တွေကို — run လုပ်ဖို့ စာရင်းသွင်းထားတဲ့ `AsyncHook` callbacks အားလုံးရဲ့ စုစုပေါင်း (global pool) ကနေ disable လုပ်ပါတယ်။ Hook တစ်ခု disabled ဖြစ်သွားပြီဆိုရင် — enable ပြန်မလုပ်မချင်း ထပ်ပြီး မခေါ်တော့ပါဘူး။

API တစ်ပြေးညီ ဖြစ်စေဖို့ `disable()` က `AsyncHook` instance ကိုပါ ပြန်ပေးပါတယ်။

### Hook callbacks (hook ၏ callbacks များ)

Asynchronous events တွေရဲ့ lifetime ထဲက အဓိက ဖြစ်ရပ်တွေကို ကဏ္ဍ လေးခု ခွဲထားပါတယ်: instantiation (စတင် ဖန်တီးခြင်း), callback မခေါ်မီ/ခေါ်ပြီး (before/after), နဲ့ instance ဖျက်ဆီးခံရချိန် တို့ပါ။

#### `init(asyncId, type, triggerAsyncId, resource)`

* `asyncId` {number} async resource အတွက် သီးသန့် (unique) ID တစ်ခု။
* `type` {string} async resource ရဲ့ type။
* `triggerAsyncId` {number} ဒီ async resource ကို ဖန်တီးခဲ့တဲ့ execution context ထဲက async resource ရဲ့ unique ID။
* `resource` {Object} async operation ကို ကိုယ်စားပြုတဲ့ resource ဆီကို ရည်ညွှန်းချက် — _destroy_ လုပ်ချိန်မှာ လွှတ်ပေးရန် လိုအပ်သည်။

Asynchronous event တစ်ခုကို emit လုပ်နိုင်_စွမ်းရှိတဲ့_ class တစ်ခုကို ဆောက်လိုက်တဲ့အခါ ခေါ်ပါတယ်။ ဒါက instance က `destroy` မခေါ်ခင် `before`/`after` တွေကို ခေါ်ရမယ်လို့ ဆိုလိုတာ _မဟုတ်ပါဘူး_ — ဖြစ်နိုင်ခြေ ရှိတယ်ဆိုတာကိုပဲ ဆိုလိုပါတယ်။

ဒီအပြုအမူကို — resource တစ်ခုကို ဖွင့်ပြီး မသုံးခင်မှာတင် ပိတ်လိုက်တာမျိုး လုပ်ကြည့်ရင် သတိထားမိပါလိမ့်မယ်။ အောက်က code snippet က ဒါကို သရုပ်ပြပါတယ်။

```mjs
import { createServer } from 'node:net';

createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```

```cjs
require('node:net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```

Resource အသစ်တိုင်းကို — လက်ရှိ Node.js instance ရဲ့ နယ်ပယ်အတွင်းမှာ unique ဖြစ်တဲ့ ID တစ်ခု သတ်မှတ်ပေးပါတယ်။

##### `type`

`type` ဆိုတာ — `init` ကို ခေါ်မိစေတဲ့ resource ရဲ့ type ကို ဖော်ထုတ်တဲ့ string တစ်ခုပါ။ ယေဘုယျအားဖြင့် — resource ရဲ့ constructor နာမည်နဲ့ ကိုက်ညီပါလိမ့်မယ်။

Node.js ကိုယ်တိုင် ဖန်တီးတဲ့ resources တွေရဲ့ `type` က Node.js release တိုင်းမှာ ပြောင်းလဲနိုင်ပါတယ်။ အသုံးဝင်တဲ့ တန်ဖိုးတွေထဲမှာ `TLSWRAP`, `TCPWRAP`, `TCPSERVERWRAP`, `GETADDRINFOREQWRAP`, `FSREQCALLBACK`, `Microtask`, နဲ့ `Timeout` တို့ ပါဝင်ပါတယ်။ အပြည့်အစုံ စာရင်းအတွက် သုံးနေတဲ့ Node.js version ရဲ့ source code ကို ကြည့်ရှုပါ။

ဒါ့အပြင် [`AsyncResource`][] ကို သုံးသူတွေက Node.js ကိုယ်တိုင်နဲ့ သီးခြား လွတ်လပ်တဲ့ async resources တွေကို ဖန်တီးနိုင်ပါတယ်။

ဒါ့အပြင် `PROMISE` ဆိုတဲ့ resource type လည်း ရှိပါတယ် — `Promise` instances တွေနဲ့ သူတို့က စီစဉ်ထားတဲ့ asynchronous work တွေကို ခြေရာခံဖို့ သုံးပါတယ်။ `Promise` တွေကို `trackPromises` option ကို `true` လို့ သတ်မှတ်ထားမှပဲ ခြေရာခံမှာ ဖြစ်ပါတယ်။

Users တွေက public embedder API ကို သုံးတဲ့အခါ ကိုယ်ပိုင် `type` တွေကိုလည်း သတ်မှတ်နိုင်ပါတယ်။

Type name တွေ ထပ်တူကျတာ (collision) ဖြစ်နိုင်ပါတယ်။ Embedders တွေက hook တွေကို listen လုပ်တဲ့အခါ collision မဖြစ်အောင် — npm package name လိုမျိုး unique prefix တွေကို သုံးဖို့ အကြံပြုပါတယ်။

##### `triggerAsyncId`

`triggerAsyncId` ဆိုတာ — resource အသစ်တစ်ခုကို initialize ဖြစ်စေခဲ့ပြီး `init` ကို ခေါ်မိစေတဲ့ resource ရဲ့ `asyncId` ပါ။ ဒါက resource တစ်ခု ဖန်တီးခံရတဲ့ အချိန် (_when_) ကိုပဲ ပြတဲ့ `async_hooks.executionAsyncId()` နဲ့ မတူပါဘူး — `triggerAsyncId` က resource တစ်ခု ဘာကြောင့် (_why_) ဖန်တီးခံရလဲဆိုတာကို ပြပါတယ်။

အောက်က ဥပမာက `triggerAsyncId` ရဲ့ ရိုးရှင်းတဲ့ သရုပ်ပြမှု ဖြစ်ပါတယ်:

```mjs
import { createHook, executionAsyncId } from 'node:async_hooks';
import { stdout } from 'node:process';
import net from 'node:net';
import fs from 'node:fs';

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```

```cjs
const { createHook, executionAsyncId } = require('node:async_hooks');
const { stdout } = require('node:process');
const net = require('node:net');
const fs = require('node:fs');

createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = executionAsyncId();
    fs.writeSync(
      stdout.fd,
      `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
}).enable();

net.createServer((conn) => {}).listen(8080);
```

`nc localhost 8080` နဲ့ server ကို ဝင်ကြည့်တဲ့အခါ ထွက်တဲ့ output:

```console
TCPSERVERWRAP(5): trigger: 1 execution: 1
TCPWRAP(7): trigger: 5 execution: 0
```

`TCPSERVERWRAP` က connections တွေကို လက်ခံတဲ့ server ဖြစ်ပါတယ်။

`TCPWRAP` ကတော့ client ဆီကနေ လာတဲ့ connection အသစ်ပါ။ Connection အသစ်တစ်ခု ဝင်လာတာနဲ့ `TCPWrap` instance ကို ချက်ချင်း ဆောက်လိုက်ပါတယ်။ ဒါက JavaScript stack တစ်ခုခုရဲ့ အပြင်ဘက်မှာ ဖြစ်တာပါ။ (`executionAsyncId()` က `0` ဖြစ်နေတယ်ဆိုတာ — အပေါ်မှာ JavaScript stack တစ်ခုမှ မရှိဘဲ C++ ကနေ execute လုပ်နေတာကို ဆိုလိုပါတယ်။) ဒီအချက်အလက် တစ်ခုတည်းနဲ့တော့ — resources တွေကို ဘာက ဖန်တီးစေခဲ့လဲဆိုတဲ့ ရှုထောင့်ကနေ ချိတ်ဆက်ကြည့်ဖို့ မဖြစ်နိုင်ပါဘူး။ ဒါကြောင့် — resource အသစ်ရဲ့ တည်ရှိမှုအတွက် ဘယ် resource က တာဝန်ရှိလဲဆိုတာကို ဖြန့်ဝေပေးဖို့ အလုပ်ကို `triggerAsyncId` ကို ပေးထားတာပါ။

##### `resource`

`resource` ဆိုတာ — initialize လုပ်ပြီးသား အမှန်တကယ် async resource ကို ကိုယ်စားပြုတဲ့ object တစ်ခုပါ။ Object ကို ဝင်ရောက်ဖို့ API ကို resource ရဲ့ ဖန်တီးသူ (creator) က သတ်မှတ်နိုင်ပါတယ်။ Node.js ကိုယ်တိုင် ဖန်တီးတဲ့ resources တွေကတော့ internal ဖြစ်ပြီး — အချိန်မရွေး ပြောင်းလဲနိုင်တာမို့ ဒါတွေအတွက် API ကို သတ်မှတ်မပေးထားပါဘူး။

ကိစ္စအချို့မှာ resource object ကို performance အတွက် ပြန်သုံးထားတာမို့ — အဲဒါကို `WeakMap` ထဲမှာ key အဖြစ် သုံးတာ (သို့) property တွေ ထပ်ဖြည့်တာက မလုံခြုံပါဘူး။

##### Asynchronous context ဥပမာ (Asynchronous context example)

Context tracking use case ကို stable API ဖြစ်တဲ့ [`AsyncLocalStorage`][] က ဖုံးအုပ်ပေးထားပါတယ်။ ဒီဥပမာက async hooks ရဲ့ လည်ပတ်မှုကိုပဲ သရုပ်ပြတာပါ — ဒါပေမယ့် ဒီ use case အတွက်တော့ [`AsyncLocalStorage`][] က ပိုပြီး သင့်တော်ပါတယ်။

အောက်မှာ `before` နဲ့ `after` ခေါ်မှုတွေကြားက `init` ခေါ်မှုတွေအကြောင်း အပိုအချက်အလက်တွေပါတဲ့ ဥပမာတစ်ခု ဖြစ်ပါတယ် — အထူးသဖြင့် `listen()` ရဲ့ callback က ဘယ်လိုပုံ ရှိမလဲဆိုတာကိုပါ။ Output ရဲ့ ပုံစံကို calling context တွေ ပိုမြင်လွယ်အောင် နည်းနည်း ပိုစီစဉ်ပေးထားပါတယ်။

```mjs
import async_hooks from 'node:async_hooks';
import fs from 'node:fs';
import net from 'node:net';
import { stdout } from 'node:process';
const { fd } = stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```

```cjs
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');
const net = require('node:net');
const { fd } = process.stdout;

let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      fd,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}after:  ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(fd, `${indentStr}destroy:  ${asyncId}\n`);
  },
}).enable();

net.createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});
```

Server ကို စတင်လိုက်ရုံနဲ့ ထွက်တဲ့ output:

```console
TCPSERVERWRAP(5): trigger: 1 execution: 1
TickObject(6): trigger: 5 execution: 1
before:  6
  Timeout(7): trigger: 6 execution: 6
after:   6
destroy: 6
before:  7
>>> 7
  TickObject(8): trigger: 7 execution: 7
after:   7
before:  8
after:   8
```

ဥပမာမှာ ပြထားသလိုပဲ — `executionAsyncId()` နဲ့ `execution` တစ်ခုချင်းစီက လက်ရှိ execution context ရဲ့ တန်ဖိုးကို သတ်မှတ်ပေးပါတယ်; အဲဒီ context တွေကို `before` နဲ့ `after` ခေါ်မှုတွေက ပိုင်းခြား သတ်မှတ်ပေးပါတယ်။

`execution` ကိုပဲ သုံးပြီး resource allocation ကို graph ဆွဲကြည့်ရင် အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```console
  root(1)
     ^
     |
TickObject(6)
     ^
     |
 Timeout(7)
```

`TCPSERVERWRAP` က `console.log()` ခေါ်ခံရတဲ့ အကြောင်းရင်း ဖြစ်ပေမယ့် — ဒီ graph ထဲမှာ မပါပါဘူး။ ဘာလို့လဲဆိုတော့ host name မပါဘဲ port တစ်ခုကို bind လုပ်တာက _synchronous_ operation တစ်ခု ဖြစ်ပေမယ့် — API ကို လုံးဝ asynchronous ဖြစ်အောင် ထိန်းသိမ်းဖို့အတွက် user ရဲ့ callback ကို `process.nextTick()` ထဲ ထည့်ထားလို့ပါ။ ဒါကြောင့်ပဲ output ထဲမှာ `TickObject` က ပါနေပြီး — `.listen()` callback ရဲ့ 'parent' အနေနဲ့ ရှိနေတာပါ။

ဒီ graph က resource တစ်ခု ဖန်တီးခံရတဲ့ အချိန် (_when_) ကိုပဲ ပြတာပါ — _why_ (ဘာကြောင့်လဲ) ကို မပြပါဘူး။ ဒါကြောင့် _why_ ကို ခြေရာခံဖို့ `triggerAsyncId` ကို သုံးပါ။ ဒါကို အောက်က graph နဲ့ ကိုယ်စားပြုနိုင်ပါတယ်:

```console
 bootstrap(1)
     |
     ˅
TCPSERVERWRAP(5)
     |
     ˅
 TickObject(6)
     |
     ˅
  Timeout(7)
```

#### `before(asyncId)`

* `asyncId` {number}

Asynchronous operation တစ်ခု စတင်တဲ့အခါ (TCP server တစ်ခုက connection အသစ် လက်ခံရရှိတာမျိုး) (သို့) ပြီးဆုံးတဲ့အခါ (disk ပေါ် data ရေးသားတာမျိုး) — user ကို အသိပေးဖို့ callback တစ်ခုကို ခေါ်ပါတယ်။ အဲဒီ callback ကို အမှန်တကယ် execute မလုပ်ခင် ချက်ချင်း `before` callback ကို ခေါ်ပါတယ်။ `asyncId` ဆိုတာ — callback ကို execute လုပ်တော့မယ့် resource ကို သတ်မှတ်ပေးထားတဲ့ unique identifier ပါ။

`before` callback ကို 0 ကနေ N ကြိမ်အထိ ခေါ်နိုင်ပါတယ်။ Asynchronous operation ကို ဖျက်သိမ်းလိုက်ရင် (သို့) ဥပမာ — TCP server ဆီ connections တွေ ဝင်မလာဘူးဆိုရင် `before` callback ကို ပုံမှန်အားဖြင့် 0 ကြိမ်ပဲ ခေါ်ပါတယ်။ TCP server လိုမျိုး ကြာရှည်ခံတဲ့ (persistent) asynchronous resources တွေကတော့ `before` callback ကို အကြိမ်များစွာ ခေါ်တတ်ပြီး — `fs.open()` လိုမျိုး တခြား operations တွေကတော့ တစ်ကြိမ်တည်းပဲ ခေါ်ပါလိမ့်မယ်။

#### `after(asyncId)`

* `asyncId` {number}

`before` မှာ ဖော်ပြထားတဲ့ callback ပြီးဆုံးပြီးချင်း ချက်ချင်း ခေါ်ပါတယ်။

Callback ကို execute လုပ်နေစဉ်အတွင်း uncaught exception တစ်ခု ဖြစ်ခဲ့ရင် — `after` က `'uncaughtException'` event ကို emit လုပ်ပြီးမှ (သို့) `domain` တစ်ခုရဲ့ handler run ပြီးမှ _ပြီးမှသာ_ run ပါလိမ့်မယ်။

#### `destroy(asyncId)`

* `asyncId` {number}

`asyncId` နဲ့ ကိုက်ညီတဲ့ resource ကို ဖျက်ဆီးလိုက်ပြီးတဲ့နောက်မှာ ခေါ်ပါတယ်။ ဒါ့အပြင် embedder API ဖြစ်တဲ့ `emitDestroy()` ကနေလည်း asynchronous အနေနဲ့ ခေါ်ပါတယ်။

Resources အချို့က cleanup အတွက် garbage collection (GC) ကို မှီခိုပါတယ်။ ဒါကြောင့် `init` ဆီ ပေးလိုက်တဲ့ `resource` object ကို reference ကိုင်ထားမိရင် — `destroy` ကို ဘယ်တော့မှ မခေါ်ဖြစ်တော့ဘဲ application ထဲမှာ memory leak ဖြစ်နိုင်ပါတယ်။ Resource က garbage collection ကို မမှီခိုဘူးဆိုရင်တော့ ဒါ ပြဿနာ မဟုတ်ပါဘူး။

Destroy hook ကို သုံးတာက overhead (အပို ကုန်ကျစရိတ်) ကို ဖြစ်စေပါတယ် — ဘာလို့လဲဆိုတော့ ဒါက garbage collector ကနေတစ်ဆင့် `Promise` instances တွေကို ခြေရာခံနိုင်အောင် လုပ်ပေးလို့ပါ။

#### `promiseResolve(asyncId)`

* `asyncId` {number}

`Promise` constructor ဆီ ပေးလိုက်တဲ့ `resolve` function ကို ခေါ်လိုက်တဲ့အခါ (တိုက်ရိုက် ဖြစ်စေ၊ promise ကို resolve လုပ်တဲ့ တခြား နည်းလမ်းတွေကနေ ဖြစ်စေ) ခေါ်ပါတယ်။

`resolve()` က သိသာတဲ့ synchronous အလုပ်တစ်ခုမှ မလုပ်ပါဘူး။

`Promise` တစ်ခုကို တခြား `Promise` တစ်ခုရဲ့ state ကို ယူမှတ်လိုက်ပြီး resolve လုပ်ထားတာဆိုရင် — ဒီအချိန်မှာ အဲဒီ `Promise` က fulfilled (ပြည့်စုံ) ဖြစ်နေဖို့ (သို့) rejected ဖြစ်နေဖို့ မလိုအပ်ပါဘူး။

```js
new Promise((resolve) => resolve(true)).then((a) => {});
```

ဒါက အောက်ပါ callbacks တွေကို ခေါ်ပါတယ်:

```text
init for PROMISE with id 5, trigger id: 1
  promise resolve 5      # corresponds to resolve(true)
init for PROMISE with id 6, trigger id: 5  # the Promise returned by then()
  before 6               # the then() callback is entered
  promise resolve 6      # the then() callback resolves the promise by returning
  after 6
```

### `async_hooks.executionAsyncResource()`

* Returns: {Object} လက်ရှိ execution ကို ကိုယ်စားပြုတဲ့ resource — resource ထဲမှာ data တွေ သိမ်းဖို့ အသုံးဝင်သည်။

`executionAsyncResource()` က ပြန်ပေးတဲ့ resource objects တွေက အများအားဖြင့် — documentation မရှိတဲ့ APIs တွေပါတဲ့ internal Node.js handle objects တွေပါ။ အဲဒီ object ပေါ်က functions (သို့) properties တွေကို သုံးမိရင် application crash ဖြစ်နိုင်ခြေ များတာမို့ ရှောင်သင့်ပါတယ်။

Top-level execution context မှာ `executionAsyncResource()` ကို သုံးရင် — သုံးစရာ handle (သို့) request object မရှိတာမို့ empty object တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ ဒါပေမယ့် top-level ကို ကိုယ်စားပြုတဲ့ object တစ်ခု ရှိနေတာက အသုံးဝင်နိုင်ပါတယ်။

```mjs
import { open } from 'node:fs';
import { executionAsyncId, executionAsyncResource } from 'node:async_hooks';

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(new URL(import.meta.url), 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```

```cjs
const { open } = require('node:fs');
const { executionAsyncId, executionAsyncResource } = require('node:async_hooks');

console.log(executionAsyncId(), executionAsyncResource());  // 1 {}
open(__filename, 'r', (err, fd) => {
  console.log(executionAsyncId(), executionAsyncResource());  // 7 FSReqWrap
});
```

ဒါကို metadata တွေ သိမ်းဖို့ tracking `Map` တစ်ခု မသုံးဘဲ — continuation local storage ကို အကောင်အထည်ဖော်ဖို့ သုံးနိုင်ပါတယ်:

```mjs
import { createServer } from 'node:http';
import {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} from 'node:async_hooks';
const sym = Symbol('state'); // Private symbol to avoid pollution

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```

```cjs
const { createServer } = require('node:http');
const {
  executionAsyncId,
  executionAsyncResource,
  createHook,
} = require('node:async_hooks');
const sym = Symbol('state'); // Private symbol to avoid pollution

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    const cr = executionAsyncResource();
    if (cr) {
      resource[sym] = cr[sym];
    }
  },
}).enable();

const server = createServer((req, res) => {
  executionAsyncResource()[sym] = { state: req.url };
  setTimeout(function() {
    res.end(JSON.stringify(executionAsyncResource()[sym]));
  }, 100);
}).listen(3000);
```

### `async_hooks.executionAsyncId()`

* Returns: {number} လက်ရှိ execution context ရဲ့ `asyncId` — တစ်ခုခုကို ဘယ်အချိန် ခေါ်လဲ ခြေရာခံဖို့ အသုံးဝင်သည်။

```mjs
import { executionAsyncId } from 'node:async_hooks';
import fs from 'node:fs';

console.log(executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(executionAsyncId());  // 6 - open()
});
```

```cjs
const async_hooks = require('node:async_hooks');
const fs = require('node:fs');

console.log(async_hooks.executionAsyncId());  // 1 - bootstrap
const path = '.';
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```

`executionAsyncId()` က ပြန်ပေးတဲ့ ID က execution timing နဲ့ ဆက်စပ်ပါတယ် — causality (အကြောင်းတရား ဆက်နွယ်မှု) နဲ့ မဟုတ်ပါဘူး (ဒါကို `triggerAsyncId()` က ဖုံးအုပ်ပါတယ်):

```js
const server = net.createServer((conn) => {
  // Returns the ID of the server, not of the new connection, because the
  // callback runs in the execution scope of the server's MakeCallback().
  async_hooks.executionAsyncId();

}).listen(port, () => {
  // Returns the ID of a TickObject (process.nextTick()) because all
  // callbacks passed to .listen() are wrapped in a nextTick().
  async_hooks.executionAsyncId();
});
```

Promise contexts တွေက မူလအားဖြင့် တိကျတဲ့ `executionAsyncIds` တွေကို မရနိုင်ပါဘူး။ [promise execution tracking][] ဆိုင်ရာ section ကို ကြည့်ပါ။

### `async_hooks.triggerAsyncId()`

* Returns: {number} လက်ရှိ execute လုပ်နေတဲ့ callback ကို ခေါ်ဖို့ တာဝန်ရှိတဲ့ resource ရဲ့ ID။

```js
const server = net.createServer((conn) => {
  // The resource that caused (or triggered) this callback to be called
  // was that of the new connection. Thus the return value of triggerAsyncId()
  // is the asyncId of "conn".
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // Even though all callbacks passed to .listen() are wrapped in a nextTick()
  // the callback itself exists because the call to the server's .listen()
  // was made. So the return value would be the ID of the server.
  async_hooks.triggerAsyncId();
});
```

Promise contexts တွေက မူလအားဖြင့် တရားဝင် (valid) `triggerAsyncId`s တွေကို မရနိုင်ပါဘူး။ [promise execution tracking][] ဆိုင်ရာ section ကို ကြည့်ပါ။

### `async_hooks.asyncWrapProviders`

* Returns: provider types တွေကို သက်ဆိုင်ရာ numeric id တွေနဲ့ ချိတ်ဆက်ပေးတဲ့ map တစ်ခု။ ဒီ map ထဲမှာ `async_hooks.init()` event က emit လုပ်နိုင်တဲ့ event types အားလုံး ပါဝင်ပါတယ်။

ဒီ feature က deprecated ဖြစ်နေတဲ့ `process.binding('async_wrap').Providers` အသုံးပြုမှုကို ဖိနှိပ် (suppress) ပေးပါတယ်။ ကြည့်ရန်: [DEP0111][]

## Promise execution ခြေရာခံခြင်း (Promise execution tracking)

မူလအားဖြင့် — V8 က ပံ့ပိုးပေးတဲ့ [promise introspection API][PromiseHooks] က အတော်လေး စျေးကြီးတဲ့ (expensive) သဘောရှိတာမို့ promise executions တွေကို `asyncId` တွေ သတ်မှတ်မပေးပါဘူး။ ဒါကြောင့် promises (သို့) `async`/`await` သုံးတဲ့ programs တွေက promise callback contexts တွေအတွက် မှန်ကန်တဲ့ execution နဲ့ trigger ids တွေကို မူလအားဖြင့် ရမှာ မဟုတ်ပါဘူး။

```mjs
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```

```cjs
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```

သတိထားကြည့်ရင် — asynchronous hop (အဆင့်တစ်ခု ခုန်ကျော်မှု) ပါဝင်နေပေမယ့် `then()` callback က outer scope ရဲ့ context ထဲမှာ execute လုပ်ခဲ့တယ်လို့ ဆိုနေတာ တွေ့ရပါမယ်။ ဒါ့အပြင် `triggerAsyncId` တန်ဖိုးက `0` ဖြစ်နေတာမို့ — `then()` callback ကို execute ဖြစ်အောင် လှုံ့ဆော်ပေးခဲ့တဲ့ resource အကြောင်း context ပျောက်နေတာကို ဆိုလိုပါတယ်။

`async_hooks.createHook` ကနေတစ်ဆင့် async hooks တွေကို တပ်ဆင်လိုက်ရင် promise execution tracking ကို enable လုပ်ပေးပါတယ်:

```mjs
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```

```cjs
const { createHook, executionAsyncId, triggerAsyncId } = require('node:async_hooks');

createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```

ဒီဥပမာမှာ — hook function တစ်ခုခု တကယ် ထည့်လိုက်တာနဲ့ promise တွေရဲ့ tracking ကို enable ဖြစ်သွားပါတယ်။ အပေါ်က ဥပမာထဲမှာ promise နှစ်ခု ပါပါတယ် — `Promise.resolve()` က ဖန်တီးတဲ့ promise နဲ့ `then()` ခေါ်မှုက ပြန်ပေးတဲ့ promise တို့ပါ။ အပေါ်က ဥပမာထဲမှာ ပထမ promise က `asyncId` `6` ရပြီး နောက်တစ်ခုက `asyncId` `7` ရပါတယ်။ `then()` callback ကို execute လုပ်နေစဉ်မှာ ကျွန်တော်တို့က `asyncId` `7` ရှိတဲ့ promise ရဲ့ context ထဲမှာ run နေတာပါ။ ဒီ promise ကို async resource `6` က trigger လုပ်ခဲ့တာပါ။

Promises နဲ့ ပတ်သက်ပြီး နောက်ထပ် သိမ်မွေ့တဲ့ အချက်တစ်ခုကတော့ — `before` နဲ့ `after` callbacks တွေကို chained promises တွေပေါ်မှာပဲ run ပေးတာပါ။ ဆိုလိုတာက `then()`/`catch()` ကနေ ဖန်တီးထားတဲ့ promises တွေ မဟုတ်ရင် `before` နဲ့ `after` callbacks တွေ fire လုပ်ပေးမှာ မဟုတ်ပါဘူး။ အသေးစိတ်ကို V8 ရဲ့ [PromiseHooks][] API မှာ ကြည့်ပါ။

### Promise execution tracking ကို disable လုပ်ခြင်း (Disabling promise execution tracking)

Promise execution ကို ခြေရာခံတာက သိသာတဲ့ performance overhead ကို ဖြစ်စေနိုင်ပါတယ်။ Promise tracking ကနေ ရှောင်ထွက်ချင်ရင် `trackPromises` ကို `false` လို့ သတ်မှတ်ပါ:

```cjs
const { createHook } = require('node:async_hooks');
const { writeSync } = require('node:fs');
createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    // This init hook does not get called when trackPromises is set to false.
    writeSync(1, `init hook triggered for ${type}\n`);
  },
  trackPromises: false,  // Do not track promises.
}).enable();
Promise.resolve(1729);
```

```mjs
import { createHook } from 'node:async_hooks';
import { writeSync } from 'node:fs';

createHook({
  init(asyncId, type, triggerAsyncId, resource) {
    // This init hook does not get called when trackPromises is set to false.
    writeSync(1, `init hook triggered for ${type}\n`);
  },
  trackPromises: false,  // Do not track promises.
}).enable();
Promise.resolve(1729);
```

## JavaScript embedder API (library developers များအတွက် JavaScript API)

ကိုယ်ပိုင် asynchronous resources တွေကို ကိုင်တွယ်တဲ့ library developers တွေ — I/O, connection pooling (connection များ စုစည်းထားခြင်း), (သို့) callback queues တွေကို စီမံခန့်ခွဲခြင်း လိုမျိုး အလုပ်တွေ လုပ်နေသူတွေက — သင့်လျော်တဲ့ callbacks အားလုံး ခေါ်ခံရအောင် `AsyncResource` JavaScript API ကို သုံးနိုင်ပါတယ်။

### Class: `AsyncResource`

ဒီ class ရဲ့ documentation ကို [`AsyncResource`][] ဆီ ရွှေ့ထားပါတယ်။

## Class: `AsyncLocalStorage`

ဒီ class ရဲ့ documentation ကို [`AsyncLocalStorage`][] ဆီ ရွှေ့ထားပါတယ်။

[DEP0111]: deprecations.md#dep0111-processbinding
[Diagnostics Channel]: diagnostics_channel.md
[Hook Callbacks]: #hook-callbacks
[PromiseHooks]: https://docs.google.com/document/d/1rda3yKGHimKIhg5YeoAmCOtyURgsbTH_qaYR79FELlk/edit
[`AsyncHook`]: #class-asynchook
[`AsyncLocalStorage`]: async_context.md#class-asynclocalstorage
[`AsyncResource`]: async_context.md#class-asyncresource
[`Worker`]: worker_threads.md#class-worker
[`after` callback]: #afterasyncid
[`before` callback]: #beforeasyncid
[`createHook`]: #async_hookscreatehookoptions
[`destroy` callback]: #destroyasyncid
[`executionAsyncResource`]: #async_hooksexecutionasyncresource
[`init` callback]: #initasyncid-type-triggerasyncid-resource
[`process.getActiveResourcesInfo()`]: process.md#processgetactiveresourcesinfo
[`promiseResolve` callback]: #promiseresolveasyncid
[promise execution tracking]: #promise-execution-tracking
