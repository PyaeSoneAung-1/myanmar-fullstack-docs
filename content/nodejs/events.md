---
title: "Events"
description: "node:events module — `EventEmitter` class ကို အခြေခံတဲ့ event-driven programming အတွက် listeners တွေ ထည့်သွင်း/ဖယ်ရှားခြင်း၊ events တွေ emit လုပ်ခြင်းနဲ့ error/rejection handling (on, once, emit, listenerCount စသည်)"
order: 104
source: "https://nodejs.org/api/events.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

Node.js core API အများစုကို — idiomatic ဖြစ်တဲ့ asynchronous event-driven architecture (event တွေကို ဗဟိုပြုပြီး asynchronous ပုံစံနဲ့ အလုပ်လုပ်တဲ့ ဗိသုကာ) ပေါ်မှာ တည်ဆောက်ထားပါတယ်။ ဒီပုံစံမှာ "emitters" လို့ ခေါ်တဲ့ object အမျိုးအစား တစ်ချို့က နာမည်ပေးထားတဲ့ (named) events တွေကို emit လုပ်ပြီး — အဲဒီ events တွေက `Function` objects တွေ ("listeners") ကို ခေါ်ယူဖို့ ဖြစ်စေပါတယ်။

ဥပမာ — peer တစ်ယောက် ချိတ်ဆက်လာတိုင်း [`net.Server`][] object က event တစ်ခုကို emit လုပ်ပါတယ်။ File တစ်ခု ဖွင့်လိုက်တဲ့အခါ [`fs.ReadStream`][] က event တစ်ခုကို emit လုပ်ပြီး — ဖတ်လို့ရတဲ့ data ရှိနေတိုင်း [stream][] ကလည်း event တစ်ခုကို emit လုပ်ပါတယ်။

Events တွေကို emit လုပ်တဲ့ object တွေ အားလုံးဟာ `EventEmitter` class ရဲ့ instances တွေ ဖြစ်ပါတယ်။ ဒီ object တွေမှာ `eventEmitter.on()` function ကို ထုတ်ဖော်ထားပြီး — အဲဒီ function က object က emit လုပ်တဲ့ named events တွေဆီမှာ function တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတဲ့ functions တွေကို ချိတ်တွဲခွင့် ပြုပါတယ်။ ပုံမှန်အားဖြင့် event names တွေက camel-cased strings တွေ ဖြစ်ပေမယ့် — JavaScript မှာ တရားဝင် (valid) ဖြစ်တဲ့ property key တိုင်းကိုလည်း သုံးနိုင်ပါတယ်။

`EventEmitter` object က event တစ်ခုကို emit လုပ်တဲ့အခါ — အဲဒီ event အတွက် ချိတ်တွဲထားတဲ့ function တွေ အားလုံးကို _synchronously_ (တစ်ခုပြီးတစ်ခု ချက်ချင်း) ခေါ်ယူပါတယ်။ ခေါ်ယူလိုက်တဲ့ listeners တွေက ပြန်ပေးလိုက်တဲ့ တန်ဖိုး တွေကိုတော့ _ignored_ (လျစ်လျူရှု) လုပ်ပြီး ပစ်ပယ်လိုက်ပါတယ်။

အောက်က ဥပမာက listener တစ်ခုတည်း ပါတဲ့ ရိုးရှင်းတဲ့ `EventEmitter` instance တစ်ခုကို ပြပါတယ်။ Listeners တွေကို register လုပ်ဖို့ `eventEmitter.on()` method ကို သုံးပြီး — event ကို trigger လုပ်ဖို့ကတော့ `eventEmitter.emit()` method ကို သုံးပါတယ်။

```mjs
import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```

```cjs
const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```

## Listeners တွေဆီကို arguments နဲ့ `this` ပေးပို့ခြင်း (Passing arguments and `this` to listeners)

`eventEmitter.emit()` method က listener functions တွေဆီကို — ကြိုက်သလို သတ်မှတ်နိုင်တဲ့ (arbitrary) arguments အစုတစ်ခု ဖြတ်သန်း ပေးပို့ခွင့် ပြုပါတယ်။ သတိထားရမှာက — သာမန် listener function တစ်ခုကို ခေါ်တဲ့အခါ standard `this` keyword က listener ချိတ်တွဲထားတဲ့ `EventEmitter` instance ကို ရည်ညွှန်းဖို့ ရည်ရွယ်ချက်ရှိရှိ သတ်မှတ်ပေးထားပါတယ်။

```mjs
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     Symbol(shapeMode): false,
  //     Symbol(kCapture): false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```

```cjs
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     _events: [Object: null prototype] { event: [Function (anonymous)] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined,
  //     Symbol(shapeMode): false,
  //     Symbol(kCapture): false
  //   } true
});
myEmitter.emit('event', 'a', 'b');
```

ES6 Arrow Functions တွေကို listeners တွေအဖြစ် သုံးလို့ ရပါတယ် — ဒါပေမယ့် ဒီလို သုံးလိုက်တဲ့အခါ `this` keyword က `EventEmitter` instance ကို ရည်ညွှန်းတော့မှာ မဟုတ်ပါဘူး:

```mjs
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b undefined
});
myEmitter.emit('event', 'a', 'b');
```

```cjs
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b {}
});
myEmitter.emit('event', 'a', 'b');
```

## Asynchronous နဲ့ synchronous (Asynchronous vs. synchronous)

`EventEmitter` က listeners တွေ အားလုံးကို register လုပ်ခဲ့တဲ့ အစဉ်အတိုင်း synchronously ခေါ်ယူပါတယ်။ ဒါက events တွေရဲ့ အစီအစဉ် (sequencing) မှန်ကန်စေဖို့ အာမခံပြီး — race conditions တွေနဲ့ logic errors တွေ မဖြစ်အောင် ကူညီပါတယ်။ သင့်လျော်တဲ့အခါမှာ listener functions တွေက `setImmediate()` သို့မဟုတ် `process.nextTick()` methods တွေကို သုံးပြီး asynchronous operation mode ဆီကို ပြောင်းနိုင်ပါတယ်:

```mjs
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```

```cjs
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```

## Events တွေကို တစ်ကြိမ်တည်းသာ ကိုင်တွယ်ခြင်း (Handling events only once)

Listener တစ်ခုကို `eventEmitter.on()` method နဲ့ register လုပ်ထားရင် — အဲဒီ listener ကို named event ကို emit လုပ်တိုင်း _every time_ ခေါ်ယူပါတယ်။

```mjs
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```

```cjs
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2
```

`eventEmitter.once()` method ကို သုံးပြီး — event တစ်ခုအတွက် အများဆုံး တစ်ကြိမ်ပဲ ခေါ်ယူမယ့် listener တစ်ခုကို register လုပ်လို့ ရပါတယ်။ Event ကို emit လုပ်လိုက်တာနဲ့ — listener ကို unregister လုပ်ပြီးမှ _then_ ခေါ်ယူပါတယ်။

```mjs
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```

```cjs
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```

## အမှားအယွင်း events (Error events)

`EventEmitter` instance တစ်ခုထဲမှာ error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ — ပုံမှန် လုပ်ဆောင်မှုကတော့ `'error'` event တစ်ခုကို emit လုပ်တာပါ။ ဒါတွေကို Node.js မှာ အထူး ကိစ္စရပ် (special cases) တွေအဖြစ် သဘောထားပါတယ်။

`EventEmitter` တစ်ခုမှာ `'error'` event အတွက် listener အနည်းဆုံး တစ်ခုမှ register လုပ်မထားဘဲ — `'error'` event တစ်ခုကို emit လုပ်လိုက်မယ်ဆိုရင် error ကို throw လုပ်ပြီး stack trace တစ်ခုကို print ထုတ်ပြီး Node.js process က ထွက်သွားပါတယ်။

```mjs
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Throws and crashes Node.js
```

```cjs
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// Throws and crashes Node.js
```

Node.js process က crash မဖြစ်အောင် ကာကွယ်ဖို့ [`domain`][] module ကို သုံးနိုင်ပါတယ်။ (ဒါပေမယ့် — `node:domain` module က deprecated (ခေတ်ကုန်သွားပြီ) ဖြစ်တာ သတိပြုပါ။)

အကောင်းဆုံး လုပ်ဆောင်ချက် (best practice) အနေနဲ့ — `'error'` events တွေအတွက် listeners တွေကို အမြဲတမ်း ထည့်သွင်းထားသင့်ပါတယ်။

```mjs
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Prints: whoops! there was an error
```

```cjs
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Prints: whoops! there was an error
```

`events.errorMonitor` ဆိုတဲ့ symbol ကို သုံးပြီး listener တစ်ခုကို တပ်ဆင်ခြင်းအားဖြင့် — emit လုပ်လိုက်တဲ့ error ကို စားသုံး (consume) လုပ်လိုက်တာမျိုး မရှိပဲ `'error'` events တွေကို သီးသန့် စောင့်ကြည့်လို့ ရပါတယ်။

```mjs
import { EventEmitter, errorMonitor } from 'node:events';

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Still throws and crashes Node.js
```

```cjs
const { EventEmitter, errorMonitor } = require('node:events');

const myEmitter = new EventEmitter();
myEmitter.on(errorMonitor, (err) => {
  MyMonitoringTool.log(err);
});
myEmitter.emit('error', new Error('whoops!'));
// Still throws and crashes Node.js
```

## Promise rejections တွေကို ဖမ်းယူခြင်း (Capture rejections of promises)

`async` functions တွေကို event handlers တွေအနေနဲ့ သုံးတာက ပြဿနာ ဖြစ်စေနိုင်ပါတယ် — အကြောင်းကတော့ exception တစ်ခု throw လုပ်လိုက်ရင် unhandled rejection (ကိုင်တွယ်မှု မရှိတဲ့ rejection) ဆီ ဦးတည်သွားနိုင်လို့ပါ:

```mjs
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```

```cjs
const EventEmitter = require('node:events');
const ee = new EventEmitter();
ee.on('something', async (value) => {
  throw new Error('kaboom');
});
```

`EventEmitter` constructor ထဲက `captureRejections` option (သို့) global setting က ဒီအပြုအမူကို ပြောင်းလဲပေးပြီး — `Promise` ပေါ်မှာ `.then(undefined, handler)` handler တစ်ခုကို တပ်ဆင်ပေးပါတယ်။ ဒီ handler က exception ကို — [`Symbol.for('nodejs.rejection')`][rejection] method ရှိနေရင် အဲဒီဆီကို၊ မရှိဘူးဆိုရင်တော့ [`'error'`][error] event handler ဆီကို — asynchronously လမ်းကြောင်းလွှဲ (route) ပေးပါတယ်။

```mjs
import { EventEmitter } from 'node:events';
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```

```cjs
const EventEmitter = require('node:events');
const ee1 = new EventEmitter({ captureRejections: true });
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);

const ee2 = new EventEmitter({ captureRejections: true });
ee2.on('something', async (value) => {
  throw new Error('kaboom');
});

ee2[Symbol.for('nodejs.rejection')] = console.log;
```

`events.captureRejections = true` လို့ သတ်မှတ်လိုက်ရင် — `EventEmitter` ရဲ့ instance အသစ်တွေ အားလုံးအတွက် default ကို ပြောင်းလဲပေးပါလိမ့်မယ်။

```mjs
import { EventEmitter } from 'node:events';

EventEmitter.captureRejections = true;
const ee1 = new EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```

```cjs
const events = require('node:events');
events.captureRejections = true;
const ee1 = new events.EventEmitter();
ee1.on('something', async (value) => {
  throw new Error('kaboom');
});

ee1.on('error', console.log);
```

`captureRejections` အပြုအမူကြောင့် ထုတ်ပေးလိုက်တဲ့ `'error'` events တွေမှာ — infinite error loops (အဆုံးမဲ့ error သံသရာများ) မဖြစ်အောင် catch handler တစ်ခုမှ မပါဝင်ပါဘူး: အကြံပြုချက်ကတော့ `async` functions တွေကို `'error'` event handlers တွေအဖြစ် **မသုံးဖို့ပါ**။

## Class: `EventEmitter`

`EventEmitter` class ကို `node:events` module က define လုပ်ပြီး ထုတ်ဖော်ပေးပါတယ်:

```mjs
import { EventEmitter } from 'node:events';
```

```cjs
const EventEmitter = require('node:events');
```

`EventEmitter` တွေ အားလုံးဟာ — listeners အသစ်တွေ ထည့်သွင်းလိုက်တဲ့အခါ `'newListener'` event ကို ပြီးတော့ listener အဟောင်းတွေကို ဖယ်ရှားလိုက်တဲ့အခါ `'removeListener'` event ကို emit လုပ်ပါတယ်။

အောက်ပါ option ကို support လုပ်ပါတယ်:

* `captureRejections` {boolean} ဒါက promise rejection တွေကို အလိုအလျောက် ဖမ်းယူခြင်း [automatic capturing of promise rejection][capturerejections] ကို ဖွင့်ပေးပါတယ်။ **Default:** `false`။

### Event: `'newListener'`

* `eventName` {string|symbol} နားဆင်နေတဲ့ (listen လုပ်နေတဲ့) event ရဲ့ နာမည် ဖြစ်ပါတယ်
* `listener` {Function} Event handler function ပါ

`EventEmitter` instance က listener တစ်ခုကို သူ့ရဲ့ internal listeners array ထဲကို မထည့်သွင်းခင် _before_ — ကိုယ်ပိုင် `'newListener'` event ကို emit လုပ်ပါလိမ့်မယ်။

`'newListener'` event အတွက် register လုပ်ထားတဲ့ listeners တွေဆီကို — event ရဲ့ နာမည် နဲ့ ထည့်သွင်းနေတဲ့ listener ကို ရည်ညွှန်းတဲ့ reference တစ်ခု ပေးပို့ပါတယ်။

Event က listener ကို မထည့်သွင်းခင် trigger လုပ်တယ်ဆိုတဲ့ အချက်မှာ သိမ်မွေ့ပေမယ့် အရေးကြီးတဲ့ ဘေးထွက် သက်ရောက်မှု (side effect) တစ်ခု ရှိပါတယ်: `'newListener'` callback ရဲ့ အတွင်း (_within_) မှာ တူညီတဲ့ `name` အတွက် register လုပ်လိုက်တဲ့ ထပ်ဆောင်း (_additional_) listeners တွေ မှန်သမျှကို — လောလောဆယ် ထည့်သွင်းနေတဲ့ listener ရဲ့ ရှေ့ (_before_) မှာ ထည့်သွင်းသွားပါတယ်။

```mjs
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Only do this once so we don't loop forever
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Insert a new listener in front
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Prints:
//   B
//   A
```

```cjs
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
// Only do this once so we don't loop forever
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // Insert a new listener in front
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// Prints:
//   B
//   A
```

### Event: `'removeListener'`

* `eventName` {string|symbol} Event ရဲ့ နာမည် ဖြစ်ပါတယ်
* `listener` {Function} Event handler function ပါ

`'removeListener'` event ကို `listener` ကို ဖယ်ရှားလိုက်ပြီးမှ _after_ emit လုပ်ပါတယ်။

### `emitter.addListener(eventName, listener)`

* `eventName` {string|symbol}
* `listener` {Function}

`emitter.on(eventName, listener)` ရဲ့ alias ဖြစ်ပါတယ်။

### `emitter.emit(eventName[, ...args])`

* `eventName` {string|symbol}
* `...args` {any}
* Returns: {boolean}

`eventName` လို့ နာမည်ပေးထားတဲ့ event အတွက် register လုပ်ထားတဲ့ listeners တစ်ခုချင်းစီကို — register လုပ်ခဲ့တဲ့ အစဉ်အတိုင်း — ပေးပို့လိုက်တဲ့ arguments တွေကို တစ်ခုချင်းစီဆီ ဖြတ်သန်းပေးရင်း synchronously ခေါ်ယူပါတယ်။

Event မှာ listeners တွေ ရှိခဲ့ရင် `true` ကို ပြန်ပေးပြီး — မရှိခဲ့ရင် `false` ကို ပြန်ပေးပါတယ်။

```mjs
import { EventEmitter } from 'node:events';
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

```cjs
const EventEmitter = require('node:events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

### `emitter.eventNames()`

* Returns: {string\[]|symbol\[]}

Emitter က listeners တွေ register လုပ်ထားတဲ့ events တွေကို စာရင်းပြုစုထားတဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { EventEmitter } from 'node:events';

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

```cjs
const EventEmitter = require('node:events');

const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// Prints: [ 'foo', 'bar', Symbol(symbol) ]
```

### `emitter.getMaxListeners()`

* Returns: {integer}

`EventEmitter` ရဲ့ လက်ရှိ max listener တန်ဖိုးကို ပြန်ပေးပါတယ် — ဒီတန်ဖိုးက [`emitter.setMaxListeners(n)`][] နဲ့ သတ်မှတ်ထားတာ ဖြစ်ဖြစ် — မသတ်မှတ်ထားရင် [`events.defaultMaxListeners`][] ကို default အနေနဲ့ သုံးပါတယ်။

### `emitter.listenerCount(eventName[, listener])`

* `eventName` {string|symbol} နားဆင်နေတဲ့ (listen လုပ်နေတဲ့) event ရဲ့ နာမည် ဖြစ်ပါတယ်
* `listener` {Function} Event handler function ပါ
* Returns: {integer}

`eventName` လို့ နာမည်ပေးထားတဲ့ event ကို နားဆင်နေတဲ့ (listening) listeners အရေအတွက်ကို ပြန်ပေးပါတယ်။ `listener` ကို ပေးထားရင် — အဲဒီ listener ကို event ရဲ့ listeners စာရင်းထဲမှာ အကြိမ်ရေ ဘယ်လောက် တွေ့ရတယ်ဆိုတာကို ပြန်ပေးပါလိမ့်မယ်။

### `emitter.listeners(eventName)`

* `eventName` {string|symbol}
* Returns: {Function\[]}

`eventName` လို့ နာမည်ပေးထားတဲ့ event အတွက် listeners တွေရဲ့ array ရဲ့ မိတ္တူ (copy) တစ်ခုကို ပြန်ပေးပါတယ်။

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// Prints: [ [Function] ]
```

### `emitter.off(eventName, listener)`

* `eventName` {string|symbol}
* `listener` {Function}
* Returns: {EventEmitter}

[`emitter.removeListener()`][] ရဲ့ alias ဖြစ်ပါတယ်။

### `emitter.on(eventName, listener)`

* `eventName` {string|symbol} Event ရဲ့ နာမည် ဖြစ်ပါတယ်
* `listener` {Function} Callback function ပါ
* Returns: {EventEmitter}

`eventName` လို့ နာမည်ပေးထားတဲ့ event အတွက် listeners array ရဲ့ အဆုံးမှာ `listener` function ကို ထည့်သွင်းပါတယ်။ `listener` ကို အရင်က ထည့်ပြီးသား ဟုတ်/မဟုတ် စစ်ဆေးတာမျိုး မလုပ်ပါဘူး။ `eventName` နဲ့ `listener` ရဲ့ ပေါင်းစပ်မှု တူတူကို အကြိမ်များစွာ ခေါ်လိုက်ရင် — `listener` ကို အကြိမ်များစွာ ထည့်သွင်းခံရပြီး အကြိမ်များစွာ ခေါ်ယူခံရပါလိမ့်မယ်။

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

`EventEmitter` ကို ရည်ညွှန်းတဲ့ reference တစ်ခုကို ပြန်ပေးတာမို့ — calls တွေကို chain လုပ်လို့ ရပါတယ်။

Default အနေနဲ့ event listeners တွေကို ထည့်သွင်းခဲ့တဲ့ အစဉ်အတိုင်း ခေါ်ယူပါတယ်။ Event listener ကို listeners array ရဲ့ အစပိုင်း (beginning) မှာ ထည့်ချင်တယ်ဆိုရင် — `emitter.prependListener()` method ကို အစားထိုး ရွေးချယ်စရာ (alternative) တစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်။

```mjs
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```cjs
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

### `emitter.once(eventName, listener)`

* `eventName` {string|symbol} Event ရဲ့ နာမည် ဖြစ်ပါတယ်
* `listener` {Function} Callback function ပါ
* Returns: {EventEmitter}

`eventName` လို့ နာမည်ပေးထားတဲ့ event အတွက် **one-time** (တစ်ကြိမ်တည်း) `listener` function တစ်ခုကို ထည့်သွင်းပါတယ်။ နောက်တစ်ကြိမ် `eventName` ကို trigger လုပ်လိုက်တဲ့အခါ — ဒီ listener ကို ဖယ်ရှားပြီးမှ ခေါ်ယူပါတယ်။

```js
server.once('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

`EventEmitter` ကို ရည်ညွှန်းတဲ့ reference တစ်ခုကို ပြန်ပေးတာမို့ — calls တွေကို chain လုပ်လို့ ရပါတယ်။

Default အနေနဲ့ event listeners တွေကို ထည့်သွင်းခဲ့တဲ့ အစဉ်အတိုင်း ခေါ်ယူပါတယ်။ Event listener ကို listeners array ရဲ့ အစပိုင်း (beginning) မှာ ထည့်ချင်တယ်ဆိုရင် — `emitter.prependOnceListener()` method ကို အစားထိုး ရွေးချယ်စရာ (alternative) တစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်။

```mjs
import { EventEmitter } from 'node:events';
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

```cjs
const EventEmitter = require('node:events');
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

### `emitter.prependListener(eventName, listener)`

* `eventName` {string|symbol} Event ရဲ့ နာမည် ဖြစ်ပါတယ်
* `listener` {Function} Callback function ပါ
* Returns: {EventEmitter}

`eventName` လို့ နာမည်ပေးထားတဲ့ event အတွက် listeners array ရဲ့ _beginning_ (အစဆုံး) မှာ `listener` function ကို ထည့်သွင်းပါတယ်။ `listener` ကို အရင်က ထည့်ပြီးသား ဟုတ်/မဟုတ် စစ်ဆေးတာမျိုး မလုပ်ပါဘူး။ `eventName` နဲ့ `listener` ရဲ့ ပေါင်းစပ်မှု တူတူကို အကြိမ်များစွာ ခေါ်လိုက်ရင် — `listener` ကို အကြိမ်များစွာ ထည့်သွင်းခံရပြီး အကြိမ်များစွာ ခေါ်ယူခံရပါလိမ့်မယ်။

```js
server.prependListener('connection', (stream) => {
  console.log('someone connected!');
});
```

`EventEmitter` ကို ရည်ညွှန်းတဲ့ reference တစ်ခုကို ပြန်ပေးတာမို့ — calls တွေကို chain လုပ်လို့ ရပါတယ်။

### `emitter.prependOnceListener(eventName, listener)`

* `eventName` {string|symbol} Event ရဲ့ နာမည် ဖြစ်ပါတယ်
* `listener` {Function} Callback function ပါ
* Returns: {EventEmitter}

`eventName` လို့ နာမည်ပေးထားတဲ့ event အတွက် **one-time** (တစ်ကြိမ်တည်း) `listener` function တစ်ခုကို listeners array ရဲ့ _beginning_ (အစဆုံး) မှာ ထည့်သွင်းပါတယ်။ နောက်တစ်ကြိမ် `eventName` ကို trigger လုပ်လိုက်တဲ့အခါ — ဒီ listener ကို ဖယ်ရှားပြီးမှ ခေါ်ယူပါတယ်။

```js
server.prependOnceListener('connection', (stream) => {
  console.log('Ah, we have our first user!');
});
```

`EventEmitter` ကို ရည်ညွှန်းတဲ့ reference တစ်ခုကို ပြန်ပေးတာမို့ — calls တွေကို chain လုပ်လို့ ရပါတယ်။

### `emitter.removeAllListeners([eventName])`

* `eventName` {string|symbol}
* Returns: {EventEmitter}

Listeners တွေ အားလုံးကို — ဒါမှမဟုတ် သတ်မှတ်ထားတဲ့ `eventName` ရဲ့ listeners တွေကို — ဖယ်ရှားပါတယ်။

Code ထဲက တခြား နေရာတွေမှာ ထည့်သွင်းထားတဲ့ listeners တွေကို ဖယ်ရှားတာဟာ မကောင်းတဲ့ အလေ့အထ (bad practice) တစ်ခုပါ — အထူးသဖြင့် `EventEmitter` instance ကို တခြား component သို့မဟုတ် module တစ်ခုက ဖန်တီးထားတဲ့ အခါမျိုးမှာပါ (ဥပမာ sockets သို့မဟုတ် file streams)။

`EventEmitter` ကို ရည်ညွှန်းတဲ့ reference တစ်ခုကို ပြန်ပေးတာမို့ — calls တွေကို chain လုပ်လို့ ရပါတယ်။

### `emitter.removeListener(eventName, listener)`

* `eventName` {string|symbol}
* `listener` {Function}
* Returns: {EventEmitter}

`eventName` လို့ နာမည်ပေးထားတဲ့ event ရဲ့ listener array ကနေ သတ်မှတ်ထားတဲ့ `listener` ကို ဖယ်ရှားပါတယ်။

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` က listener array ထဲကနေ listener တစ်ခုရဲ့ instance ကို အများဆုံး တစ်ခုထိ ဖယ်ရှားပေးပါတယ်။ Listener တစ်ခုတည်းကို သတ်မှတ်ထားတဲ့ `eventName` အတွက် listener array ထဲမှာ အကြိမ်များစွာ ထည့်ထားခဲ့ရင် — instance တစ်ခုချင်းစီကို ဖယ်ရှားဖို့ `removeListener()` ကို အကြိမ်များစွာ ခေါ်ပေးရပါမယ်။

Event တစ်ခုကို emit လုပ်လိုက်တာနဲ့ — အဲဒီအချိန်မှာ ချိတ်တွဲထားတဲ့ listeners တွေ အားလုံးကို အစဉ်လိုက် ခေါ်ယူပါတယ်။ ဆိုလိုတာက — emit လုပ်ပြီးသွားတဲ့ _after_ ကနေ နောက်ဆုံး listener ရဲ့ လုပ်ဆောင်ချက် မပြီးဆုံးသေးတဲ့ _before_ ကြားမှာ လုပ်လိုက်တဲ့ `removeListener()` (သို့) `removeAllListeners()` calls တွေက — လုပ်ဆောင်နေဆဲ `emit()` ထဲကနေ အဲဒီ listeners တွေကို ဖယ်ရှားပေးမှာ မဟုတ်ပါဘူး။ နောက်ပိုင်း events တွေကတော့ မျှော်လင့်ထားတဲ့အတိုင်း အလုပ်လုပ်ပါလိမ့်မယ်။

```mjs
import { EventEmitter } from 'node:events';
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

```cjs
const EventEmitter = require('node:events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Listeners တွေကို internal array တစ်ခုနဲ့ စီမံခန့်ခွဲတာမို့ — ဒါကို ခေါ်လိုက်ရင် ဖယ်ရှားခံရတဲ့ listener ရဲ့ နောက်မှာ (_after_) register လုပ်ထားတဲ့ listener တိုင်းရဲ့ position indexes တွေကို ပြောင်းလဲစေပါတယ်။ ဒါက listeners တွေကို ခေါ်ယူတဲ့ အစဉ်အစီး (order) ကိုတော့ မထိခိုက်စေပါဘူး — ဒါပေမယ့် `emitter.listeners()` method က ပြန်ပေးတဲ့ listener array ရဲ့ မိတ္တူတွေ ဘယ်ဟာမဆို ပြန်လည်ဖန်တီး (recreate) လုပ်ဖို့ လိုအပ်တယ်ဆိုတာကို ဆိုလိုပါတယ်။

Function တစ်ခုတည်းကို event တစ်ခုအတွက် handler အဖြစ် အကြိမ်များစွာ ထည့်ထားတဲ့အခါ (အောက်က ဥပမာမှာ ပြထားသလို) — `removeListener()` က နောက်ဆုံး ထည့်ခဲ့တဲ့ instance ကို ဖယ်ရှားပါလိမ့်မယ်။ ဥပမာထဲမှာ `once('ping')` listener ကို ဖယ်ရှားလိုက်တာပါ:

```mjs
import { EventEmitter } from 'node:events';
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

```cjs
const EventEmitter = require('node:events');
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

`EventEmitter` ကို ရည်ညွှန်းတဲ့ reference တစ်ခုကို ပြန်ပေးတာမို့ — calls တွေကို chain လုပ်လို့ ရပါတယ်။

### `emitter.setMaxListeners(n)`

* `n` {integer}
* Returns: {EventEmitter}

Default အနေနဲ့ `EventEmitter` တွေဟာ — event တစ်ခုအတွက် listener `10` ခုထက် ပိုပြီး ထည့်လိုက်ရင် warning (သတိပေးချက်) တစ်ခုကို print လုပ်ပါလိမ့်မယ်။ ဒါက memory leaks တွေကို ရှာဖွေတွေ့ရှိဖို့ ကူညီပေးတဲ့ အသုံးဝင်တဲ့ default တစ်ခုပါ။ `emitter.setMaxListeners()` method က ဒီ `EventEmitter` instance တစ်ခုချင်းစီအတွက် ကန့်သတ်ချက်ကို ပြုပြင်ပြောင်းလဲခွင့် ပေးပါတယ်။ Listener အရေအတွက် အကန့်အသတ် မရှိဘူးလို့ ဖော်ပြဖို့ တန်ဖိုးကို `Infinity` (သို့မဟုတ် `0`) အဖြစ် သတ်မှတ်နိုင်ပါတယ်။

`EventEmitter` ကို ရည်ညွှန်းတဲ့ reference တစ်ခုကို ပြန်ပေးတာမို့ — calls တွေကို chain လုပ်လို့ ရပါတယ်။

### `emitter.rawListeners(eventName)`

* `eventName` {string|symbol}
* Returns: {Function\[]}

`eventName` လို့ နာမည်ပေးထားတဲ့ event အတွက် listeners တွေရဲ့ array ရဲ့ မိတ္တူ (copy) တစ်ခုကို ပြန်ပေးပါတယ် — wrappers တွေ (ဥပမာ `.once()` က ဖန်တီးပေးတဲ့ ဟာတွေ) အပါအဝင်ပါ။

```mjs
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

```cjs
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));

// Returns a new Array with a function `onceWrapper` which has a property
// `listener` which contains the original listener bound above
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];

// Logs "log once" to the console and does not unbind the `once` event
logFnWrapper.listener();

// Logs "log once" to the console and removes the listener
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
// Will return a new Array with a single function bound by `.on()` above
const newListeners = emitter.rawListeners('log');

// Logs "log persistently" twice
newListeners[0]();
emitter.emit('log');
```

### `emitter[Symbol.for('nodejs.rejection')](err, eventName[, ...args])`

* `err` {Error}
* `eventName` {string|symbol}
* `...args` {any}

`Symbol.for('nodejs.rejection')` method ကို — event တစ်ခုကို emit လုပ်နေစဉ်မှာ promise rejection တစ်ခု ဖြစ်ပေါ်ပြီး emitter ပေါ်မှာ [`captureRejections`][capturerejections] ဖွင့်ထားတဲ့အခါ — ခေါ်ယူပါတယ်။ `Symbol.for('nodejs.rejection')` နေရာမှာ [`events.captureRejectionSymbol`][rejectionsymbol] ကိုလည်း သုံးလို့ ရပါတယ်။

```mjs
import { EventEmitter, captureRejectionSymbol } from 'node:events';

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```

```cjs
const { EventEmitter, captureRejectionSymbol } = require('node:events');

class MyClass extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  [captureRejectionSymbol](err, event, ...args) {
    console.log('rejection happened for', event, 'with', err, ...args);
    this.destroy(err);
  }

  destroy(err) {
    // Tear the resource down here.
  }
}
```

## `events.defaultMaxListeners`

Default အနေနဲ့ — event တစ်ခုခုအတွက် listener အများဆုံး `10` ခုအထိ register လုပ်လို့ ရပါတယ်။ ဒီကန့်သတ်ချက်ကို [`emitter.setMaxListeners(n)`][] method ကို သုံးပြီး `EventEmitter` instance တစ်ခုချင်းစီအတွက် ပြောင်းလဲနိုင်ပါတယ်။ `EventEmitter` instances _all_ (အားလုံး) အတွက် default ကို ပြောင်းချင်ရင်တော့ `events.defaultMaxListeners` property ကို သုံးနိုင်ပါတယ်။ ဒီတန်ဖိုးက positive number (အပေါင်းကိန်း) မဟုတ်ဘူးဆိုရင် `RangeError` တစ်ခုကို throw လုပ်ပါတယ်။

`events.defaultMaxListeners` ကို သတ်မှတ်တဲ့အခါ သတိထားပါ — အကြောင်းကတော့ ဒီပြောင်းလဲမှုက `EventEmitter` instances _all_ (အားလုံး) ကို သက်ရောက်မှု ရှိလို့ပါ — ပြောင်းလဲမှု မလုပ်ခင် ဖန်တီးထားပြီးသား instance တွေ အပါအဝင်ပါ။ ဒါပေမယ့် [`emitter.setMaxListeners(n)`][] ကို ခေါ်တာက `events.defaultMaxListeners` ထက် ဦးစားပေး (precedence) ရှိနေတုန်းပါပဲ။

ဒါက တင်းကျပ်တဲ့ ကန့်သတ်ချက် (hard limit) တစ်ခု မဟုတ်ပါဘူး။ `EventEmitter` instance က listeners တွေ ပိုထည့်ဖို့ ခွင့်ပြုပါလိမ့်မယ် — ဒါပေမယ့် "possible EventEmitter memory leak" တစ်ခု တွေ့ရှိခဲ့တယ်လို့ ဖော်ပြတဲ့ trace warning တစ်ခုကို stderr ဆီကို ထုတ်ပေးပါလိမ့်မယ်။ `EventEmitter` တစ်ခုချင်းစီအတွက် — ဒီ warning ကို ခဏတာ ရှောင်ရှားဖို့ `emitter.getMaxListeners()` နဲ့ `emitter.setMaxListeners()` methods တွေကို သုံးနိုင်ပါတယ်:

`defaultMaxListeners` က `AbortSignal` instances တွေအပေါ်မှာ သက်ရောက်မှု မရှိပါဘူး။ `AbortSignal` instance တစ်ခုချင်းစီအတွက် warning ကန့်သတ်ချက် သတ်မှတ်ဖို့ [`emitter.setMaxListeners(n)`][] ကို သုံးလို့ ရသေးပေမယ့် — default အနေနဲ့တော့ `AbortSignal` instances တွေက warning ထုတ်ပေးမှာ မဟုတ်ပါဘူး။

```mjs
import { EventEmitter } from 'node:events';
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

```cjs
const EventEmitter = require('node:events');
const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // do stuff
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

[`--trace-warnings`][] command-line flag ကို သုံးပြီး — ဒီလို warnings တွေအတွက် stack trace ကို ဖော်ပြနိုင်ပါတယ်။

ထုတ်ပေးလိုက်တဲ့ warning ကို [`process.on('warning')`][] နဲ့ စစ်ဆေးကြည့်လို့ ရပါတယ် — ဒီ warning မှာ event emitter instance, event ရဲ့ နာမည် နဲ့ ချိတ်တွဲထားတဲ့ listeners အရေအတွက်တွေကို အသီးသီး ရည်ညွှန်းတဲ့ `emitter`, `type`, နဲ့ `count` properties တွေ ထပ်ဆောင်း ပါဝင်ပါတယ်။ ၎င်းရဲ့ `name` property ကိုတော့ `'MaxListenersExceededWarning'` လို့ သတ်မှတ်ထားပါတယ်။

## `events.errorMonitor`

ဒီ symbol ကို `'error'` events တွေကို စောင့်ကြည့်တာတစ်ခုတည်းအတွက်သာ listener တစ်ခုကို တပ်ဆင်တဲ့နေရာမှာ သုံးသင့်ပါတယ်။ ဒီ symbol ကို သုံးပြီး တပ်ဆင်ထားတဲ့ listeners တွေကို — သာမန် `'error'` listeners တွေ မခေါ်ခင် — အရင်ခေါ်ပါတယ်။

ဒီ symbol ကို သုံးပြီး listener တစ်ခု တပ်ဆင်ထားတာက — `'error'` event တစ်ခုကို emit လုပ်ပြီးတဲ့ နောက်ပိုင်း အပြုအမူကို ပြောင်းလဲပေးမှာ မဟုတ်ပါဘူး။ ဒါကြောင့် — သာမန် `'error'` listener တစ်ခုမှ မတပ်ဆင်ထားဘူးဆိုရင် process က ဆက်ပြီး crash ဖြစ်နေဦးမှာပါ။

## `events.getEventListeners(emitterOrTarget, eventName)`

* `emitterOrTarget` {EventEmitter|EventTarget}
* `eventName` {string|symbol}
* Returns: {Function\[]}

`eventName` လို့ နာမည်ပေးထားတဲ့ event အတွက် listeners တွေရဲ့ array ရဲ့ မိတ္တူ (copy) တစ်ခုကို ပြန်ပေးပါတယ်။

`EventEmitter` တွေအတွက်တော့ — ဒါက emitter ပေါ်မှာ `.listeners` ကို ခေါ်တာနဲ့ အတိအကျ တူညီပါတယ်။

`EventTarget` တွေအတွက်တော့ — ဒါက event target ရဲ့ event listeners တွေကို ရယူဖို့ တစ်ခုတည်းသော နည်းလမ်း ဖြစ်ပါတယ်။ Debugging နဲ့ diagnostic ရည်ရွယ်ချက်တွေအတွက် အသုံးဝင်ပါတယ်။

```mjs
import { getEventListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

```cjs
const { getEventListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  const listener = () => console.log('Events are fun');
  ee.on('foo', listener);
  console.log(getEventListeners(ee, 'foo')); // [ [Function: listener] ]
}
{
  const et = new EventTarget();
  const listener = () => console.log('Events are fun');
  et.addEventListener('foo', listener);
  console.log(getEventListeners(et, 'foo')); // [ [Function: listener] ]
}
```

## `events.getMaxListeners(emitterOrTarget)`

* `emitterOrTarget` {EventEmitter|EventTarget}
* Returns: {number}

လောလောဆယ် သတ်မှတ်ထားတဲ့ max listeners အရေအတွက်ကို ပြန်ပေးပါတယ်။

`EventEmitter` တွေအတွက်ကတော့ — emitter ပေါ်မှာ `.getMaxListeners` ကို ခေါ်တာနဲ့ အတိအကျ တူညီပါတယ်။

`EventTarget` တွေအတွက်ကတော့ — event target ရဲ့ max event listeners တွေကို ရယူဖို့ တစ်ခုတည်းသော နည်းလမ်း ဖြစ်ပါတယ်။ `EventTarget` တစ်ခုတည်းပေါ်မှာ ရှိတဲ့ event handlers အရေအတွက်က သတ်မှတ်ထားတဲ့ max ထက် ကျော်လွန်သွားရင် — `EventTarget` က warning (သတိပေးချက်) တစ်ခုကို print လုပ်ပါလိမ့်မယ်။

```mjs
import { getMaxListeners, setMaxListeners, EventEmitter } from 'node:events';

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

```cjs
const { getMaxListeners, setMaxListeners, EventEmitter } = require('node:events');

{
  const ee = new EventEmitter();
  console.log(getMaxListeners(ee)); // 10
  setMaxListeners(11, ee);
  console.log(getMaxListeners(ee)); // 11
}
{
  const et = new EventTarget();
  console.log(getMaxListeners(et)); // 10
  setMaxListeners(11, et);
  console.log(getMaxListeners(et)); // 11
}
```

## `events.once(emitter, name[, options])`

* `emitter` {EventEmitter}
* `name` {string|symbol}
* `options` {Object}
  * `signal` {AbortSignal} Event ကို စောင့်ဆိုင်းနေတာကို ပယ်ဖျက် (cancel) လုပ်ဖို့ သုံးနိုင်ပါတယ်။
* Returns: {Promise}

ပေးထားတဲ့ event ကို `EventEmitter` က emit လုပ်လိုက်တဲ့အခါ fulfilled (ပြည့်စုံပြီးမြောက်) ဖြစ်မယ့် — ဒါမှမဟုတ် စောင့်ဆိုင်းနေစဉ်မှာ `EventEmitter` က `'error'` ကို emit လုပ်လိုက်ရင် rejected (ပယ်ချခံရ) မယ့် — `Promise` တစ်ခုကို ဖန်တီးပေးပါတယ်။ အဲဒီ `Promise` က ပေးထားတဲ့ event ဆီကို emit လုပ်ခဲ့တဲ့ arguments တွေ အားလုံးရဲ့ array တစ်ခုနဲ့ resolve ဖြစ်ပါလိမ့်မယ်။

ဒီ method က ရည်ရွယ်ချက်ရှိရှိနဲ့ပဲ generic ဖြစ်အောင် လုပ်ထားပြီး — အထူး `'error'` event semantics (အဓိပ္ပာယ် သဘောတရား) မရှိတဲ့၊ `'error'` event ကို နားမထောင်တဲ့ — web platform ရဲ့ [EventTarget][WHATWG-EventTarget] interface နဲ့ပါ အလုပ်လုပ်ပါတယ်။

```mjs
import { once, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

process.nextTick(() => {
  ee.emit('myevent', 42);
});

const [value] = await once(ee, 'myevent');
console.log(value);

const err = new Error('kaboom');
process.nextTick(() => {
  ee.emit('error', err);
});

try {
  await once(ee, 'myevent');
} catch (err) {
  console.error('error happened', err);
}
```

```cjs
const { once, EventEmitter } = require('node:events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('kaboom');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.error('error happened', err);
  }
}

run();
```

`'error'` event အတွက် အထူး ကိုင်တွယ်မှုက — တခြား event တစ်ခုကို စောင့်ဆိုင်းဖို့ `events.once()` ကို သုံးတဲ့အခါမှသာ အသုံးပြုပါတယ်။ `events.once()` ကို `'error'` event ကိုယ်တိုင် အတွက် စောင့်ဆိုင်းဖို့ သုံးရင်တော့ — အထူး ကိုင်တွယ်မှု မရှိပဲ အခြား event အမျိုးအစား တစ်ခုလိုပဲ သဘောထားပါတယ်:

```mjs
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

```cjs
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();

once(ee, 'error')
  .then(([err]) => console.log('ok', err.message))
  .catch((err) => console.error('error', err.message));

ee.emit('error', new Error('boom'));

// Prints: ok boom
```

{AbortSignal} တစ်ခုကို သုံးပြီး event ကို စောင့်ဆိုင်းတာကို ပယ်ဖျက်လို့ ရပါတယ်:

```mjs
import { EventEmitter, once } from 'node:events';

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```

```cjs
const { EventEmitter, once } = require('node:events');

const ee = new EventEmitter();
const ac = new AbortController();

async function foo(emitter, event, signal) {
  try {
    await once(emitter, event, { signal });
    console.log('event emitted!');
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Waiting for the event was canceled!');
    } else {
      console.error('There was an error', error.message);
    }
  }
}

foo(ee, 'foo', ac.signal);
ac.abort(); // Prints: Waiting for the event was canceled!
```

### Events အများအပြားကို စောင့်ဆိုင်းနေစဉ် သတိထားစရာများ (Caveats when awaiting multiple events)

`events.once()` method ကို သုံးပြီး events အများအပြားကို await လုပ်တဲ့အခါ — execution order (လုပ်ဆောင်မှု အစီအစဉ်) ကို သတိထားဖို့ အရေးကြီးပါတယ်။

သမားရိုးကျ (conventional) event listeners တွေကို — event ကို emit လုပ်လိုက်တဲ့အခါ synchronously ခေါ်ယူပါတယ်။ ဒါက — listeners တွေ အားလုံး လုပ်ဆောင်ပြီးမြောက်သည်အထိ — လုပ်ဆောင်မှုက emit လုပ်လိုက်တဲ့ event ကို ကျော်ပြီး ဆက်မသွားဘူးလို့ အာမခံပေးပါတယ်။

`events.once()` က ပြန်ပေးတဲ့ Promises တွေကို await လုပ်တဲ့အခါမှာတော့ — ဒါက _မမှန်_ (not true) ပါဘူး။ Promise tasks တွေက လက်ရှိ execution stack ကုန်ဆုံးသွားတဲ့အထိ ကိုင်တွယ်မခံရတာမို့ — သက်ဆိုင်ရာ `await` statement ကနေ asynchronous execution ဆက်မလုပ်ခင် — events အများအပြား ထွက်ပေါ်သွားနိုင်တယ်လို့ ဆိုလိုပါတယ်။

ဒါကြောင့် — `await events.once()` statements တစ်တွဲကို သုံးပြီး events အများအပြားကို နားဆင်မယ်ဆိုရင် — events တွေကို "လွတ်သွား" (missed) စေနိုင်ပါတယ်။ အကြောင်းကတော့ event loop ရဲ့ တစ်ဆင့်တည်း (same phase) အတွင်းမှာ event တစ်ခုထက်ပိုပြီး emit လုပ်ခံရတဲ့ အချိန်တွေ ရှိနိုင်လို့ပါ။ (`process.nextTick()` ကို သုံးပြီး events တွေကို emit လုပ်တဲ့အခါမှာလည်း အလားတူပါပဲ — အကြောင်းကတော့ `process.nextTick()` က queue လုပ်ထားတဲ့ tasks တွေကို Promise tasks တွေထက် အရင်လုပ်ဆောင်လို့ပါ။)

```mjs
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function listen() {
  await once(myEE, 'foo');
  console.log('foo');

  // This Promise will never resolve, because the 'bar' event will
  // have already been emitted before the next line is executed.
  await once(myEE, 'bar');
  console.log('bar');
}

process.nextTick(() => {
  myEE.emit('foo');
  myEE.emit('bar');
});

listen().then(() => console.log('done'));
```

```cjs
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function listen() {
  await once(myEE, 'foo');
  console.log('foo');

  // This Promise will never resolve, because the 'bar' event will
  // have already been emitted before the next line is executed.
  await once(myEE, 'bar');
  console.log('bar');
}

process.nextTick(() => {
  myEE.emit('foo');
  myEE.emit('bar');
});

listen().then(() => console.log('done'));
```

Events အများအပြားကို ဖမ်းယူဖို့ဆိုရင် — တစ်ခုကိုမှ မစောင့်ဆိုင်းခင် _အရင်_ (before) Promises အားလုံးကို ဖန်တီးထားပါ။ ဒါက `Promise.all()`, `Promise.race()`, (သို့) `Promise.allSettled()` တွေကို သုံးရင် များသောအားဖြင့် ပိုလွယ်ကူပါတယ်:

```mjs
import { EventEmitter, once } from 'node:events';
import process from 'node:process';

const myEE = new EventEmitter();

async function listen() {
  await Promise.all([
    once(myEE, 'foo'),
    once(myEE, 'bar'),
  ]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('foo');
  myEE.emit('bar');
});

listen().then(() => console.log('done'));
```

```cjs
const { EventEmitter, once } = require('node:events');

const myEE = new EventEmitter();

async function listen() {
  await Promise.all([
    once(myEE, 'bar'),
    once(myEE, 'foo'),
  ]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('foo');
  myEE.emit('bar');
});

listen().then(() => console.log('done'));
```

## `events.captureRejections`

* Type: {boolean}

`EventEmitter` objects အသစ်တွေ အားလုံးပေါ်မှာ default `captureRejections` option ကို ပြောင်းလဲပေးပါတယ်။

## `events.captureRejectionSymbol`

* Type: {symbol} `Symbol.for('nodejs.rejection')`

ကိုယ်ပိုင် (custom) [rejection handler][rejection] တစ်ခု ရေးနည်းကို ကြည့်ပါ။

## `events.listenerCount(emitterOrTarget, eventName)`

* `emitterOrTarget` {EventEmitter|EventTarget}
* `eventName` {string|symbol}
* Returns: {integer}

`eventName` လို့ နာမည်ပေးထားတဲ့ event အတွက် register လုပ်ထားတဲ့ listeners အရေအတွက်ကို ပြန်ပေးပါတယ်။

`EventEmitter` တွေအတွက်ကတော့ — emitter ပေါ်မှာ `.listenerCount` ကို ခေါ်တာနဲ့ အတိအကျ တူညီပါတယ်။

`EventTarget` တွေအတွက်ကတော့ — listener count ကို ရယူဖို့ တစ်ခုတည်းသော နည်းလမ်း ဖြစ်ပါတယ်။ ဒါက debugging နဲ့ diagnostic ရည်ရွယ်ချက်တွေအတွက် အသုံးဝင်နိုင်ပါတယ်။

```mjs
import { EventEmitter, listenerCount } from 'node:events';

{
  const ee = new EventEmitter();
  ee.on('event', () => {});
  ee.on('event', () => {});
  console.log(listenerCount(ee, 'event')); // 2
}
{
  const et = new EventTarget();
  et.addEventListener('event', () => {});
  et.addEventListener('event', () => {});
  console.log(listenerCount(et, 'event')); // 2
}
```

```cjs
const { EventEmitter, listenerCount } = require('node:events');

{
  const ee = new EventEmitter();
  ee.on('event', () => {});
  ee.on('event', () => {});
  console.log(listenerCount(ee, 'event')); // 2
}
{
  const et = new EventTarget();
  et.addEventListener('event', () => {});
  et.addEventListener('event', () => {});
  console.log(listenerCount(et, 'event')); // 2
}
```

## `events.on(emitter, eventName[, options])`

* `emitter` {EventEmitter}
* `eventName` {string|symbol} နားဆင်နေတဲ့ (listen လုပ်နေတဲ့) event ရဲ့ နာမည် ဖြစ်ပါတယ်
* `options` {Object}
  * `signal` {AbortSignal} Events တွေကို စောင့်ဆိုင်းနေတာကို ပယ်ဖျက်ဖို့ သုံးနိုင်ပါတယ်။
  * `close` {string\[]} Iteration (လှည့်လည် လုပ်ဆောင်မှု) ကို အဆုံးသတ်စေမယ့် events တွေရဲ့ နာမည်တွေပါ။
  * `highWaterMark` {integer} **Default:** `Number.MAX_SAFE_INTEGER`
    High watermark ပါ။ Buffer လုပ်ထားတဲ့ events တွေရဲ့ အရွယ်အစားက ဒီထက် မြင့်မားနေတိုင်း — emitter ကို pause လုပ်ပါတယ်။ `pause()` နဲ့ `resume()` methods တွေကို implement (အကောင်အထည်ဖော်) လုပ်ထားတဲ့ emitters တွေမှာသာ support လုပ်ပါတယ်။
  * `lowWaterMark` {integer} **Default:** `1`
    Low watermark ပါ။ Buffer လုပ်ထားတဲ့ events တွေရဲ့ အရွယ်အစားက ဒီထက် နိမ့်နေတိုင်း — emitter ကို resume လုပ်ပါတယ်။ `pause()` နဲ့ `resume()` methods တွေကို implement (အကောင်အထည်ဖော်) လုပ်ထားတဲ့ emitters တွေမှာသာ support လုပ်ပါတယ်။
* Returns: {AsyncIterator} — `emitter` က emit လုပ်တဲ့ `eventName` events တွေကို iterate လုပ်ပေးပါတယ်

```mjs
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ee = new EventEmitter();

// Emit later on
process.nextTick(() => {
  ee.emit('foo', 'bar');
  ee.emit('foo', 42);
});

for await (const event of on(ee, 'foo')) {
  // The execution of this inner block is synchronous and it
  // processes one event at a time (even with await). Do not use
  // if concurrent execution is required.
  console.log(event); // prints ['bar'] [42]
}
// Unreachable here
```

```cjs
const { on, EventEmitter } = require('node:events');

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo')) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();
```

`eventName` events တွေကို iterate လုပ်ပေးမယ့် `AsyncIterator` တစ်ခုကို ပြန်ပေးပါတယ်။ `EventEmitter` က `'error'` ကို emit လုပ်ရင် — throw လုပ်ပါလိမ့်မယ်။ Loop ကနေ ထွက်လိုက်တဲ့အခါ — listeners တွေ အားလုံးကို ဖယ်ရှားပေးပါတယ်။ Iteration တစ်ခုစီက ပြန်ပေးတဲ့ `value` က — emit လုပ်ခဲ့တဲ့ event arguments တွေနဲ့ ဖွဲ့စည်းထားတဲ့ array တစ်ခု ဖြစ်ပါတယ်။

{AbortSignal} တစ်ခုကို သုံးပြီး events တွေကို စောင့်ဆိုင်းတာကို ပယ်ဖျက်လို့ ရပါတယ်:

```mjs
import { on, EventEmitter } from 'node:events';
import process from 'node:process';

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

```cjs
const { on, EventEmitter } = require('node:events');

const ac = new AbortController();

(async () => {
  const ee = new EventEmitter();

  // Emit later on
  process.nextTick(() => {
    ee.emit('foo', 'bar');
    ee.emit('foo', 42);
  });

  for await (const event of on(ee, 'foo', { signal: ac.signal })) {
    // The execution of this inner block is synchronous and it
    // processes one event at a time (even with await). Do not use
    // if concurrent execution is required.
    console.log(event); // prints ['bar'] [42]
  }
  // Unreachable here
})();

process.nextTick(() => ac.abort());
```

## `events.setMaxListeners(n[, ...eventTargets])`

* `n` {number} အနုတ် မဟုတ်တဲ့ (non-negative) ကိန်း တစ်ခုပါ — `EventTarget` event တစ်ခုစီအတွက် အများဆုံး listeners အရေအတွက် ဖြစ်ပါတယ်။
* `...eventsTargets` {EventTarget\[]|EventEmitter\[]} {EventTarget} (သို့) {EventEmitter} instances တစ်ခု သို့မဟုတ် တစ်ခုထက်ပို ဖြစ်နိုင်ပါတယ်။ တစ်ခုမှ သတ်မှတ်မထားရင် — `n` ကို အသစ်ဖန်တီးတဲ့ {EventTarget} နဲ့ {EventEmitter} objects တွေ အားလုံးအတွက် default max အဖြစ် သတ်မှတ်ပါတယ်။

```mjs
import { setMaxListeners, EventEmitter } from 'node:events';

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

```cjs
const {
  setMaxListeners,
  EventEmitter,
} = require('node:events');

const target = new EventTarget();
const emitter = new EventEmitter();

setMaxListeners(5, target, emitter);
```

## `events.addAbortListener(signal, listener)`

* `signal` {AbortSignal}
* `listener` {Function|EventListener}
* Returns: {Disposable} — `abort` listener ကို ဖယ်ရှားပေးတဲ့ Disposable တစ်ခုပါ

ပေးထားတဲ့ `signal` ပေါ်က `abort` event ကို တစ်ကြိမ်တည်း နားဆင်ပေးပါတယ်။

Abort signals တွေပေါ်မှာ `abort` event ကို နားဆင်တာက မလုံခြုံပါဘူး — signal ကို ကိုင်ထားတဲ့ တတိယပါတီ (third party) တစ်ခုက [`e.stopImmediatePropagation()`][] ကို ခေါ်လိုက်နိုင်တာမို့ resource leaks (အရင်းအမြစ် ယိုစိမ့်မှုများ) ဆီ ဦးတည်သွားနိုင်ပါတယ်။ ဝမ်းနည်းစရာက — ဒါက web standard ကို ချိုးဖောက်ရာ ရောက်တာမို့ Node.js အနေနဲ့ ဒါကို ပြောင်းလဲလို့ မရပါဘူး။ ဒါ့အပြင် — မူရင်း API က listeners တွေကို ဖယ်ရှားဖို့ မေ့သွားလွယ်စေပါတယ်။

ဒီ API က — `stopImmediatePropagation` က listener ကို run မလုပ်ရအောင် တားဆီးလို့ မရအောင် event ကို နားဆင်တာမျိုးနဲ့ — ဒီပြဿနာ နှစ်ခုလုံးကို ဖြေရှင်းပြီး `AbortSignal` တွေကို Node.js APIs တွေထဲမှာ လုံခြုံစွာ သုံးနိုင်အောင် ခွင့်ပြုပေးပါတယ်။

ပိုလွယ်ကူစွာ unsubscribe လုပ်နိုင်အောင် — disposable တစ်ခုကို ပြန်ပေးပါတယ်။

```cjs
const { addAbortListener } = require('node:events');

function example(signal) {
  signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
  // addAbortListener() returns a disposable, so the `using` keyword ensures
  // the abort listener is automatically removed when this scope exits.
  using _ = addAbortListener(signal, (e) => {
    // Do something when signal is aborted.
  });
}
```

```mjs
import { addAbortListener } from 'node:events';

function example(signal) {
  signal.addEventListener('abort', (e) => e.stopImmediatePropagation());
  // addAbortListener() returns a disposable, so the `using` keyword ensures
  // the abort listener is automatically removed when this scope exits.
  using _ = addAbortListener(signal, (e) => {
    // Do something when signal is aborted.
  });
}
```

## Class: `events.EventEmitterAsyncResource extends EventEmitter`

Manual async tracking (လက်နဲ့ ကိုယ်တိုင် ခြေရာခံခြင်း) လိုအပ်တဲ့ `EventEmitter` တွေအတွက် — `EventEmitter` ကို {AsyncResource} နဲ့ ပေါင်းစည်းပေးပါတယ်။ အထူးသဖြင့် — `events.EventEmitterAsyncResource` ရဲ့ instances တွေက emit လုပ်တဲ့ events တွေ အားလုံးက ၎င်းရဲ့ [async context][] အတွင်းမှာ run ပါလိမ့်မယ်။

```mjs
import { EventEmitterAsyncResource, EventEmitter } from 'node:events';
import { notStrictEqual, strictEqual } from 'node:assert';
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

// Async tracking tooling will identify this as 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo' listeners will run in the EventEmitters async context.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// 'foo' listeners on ordinary EventEmitters that do not track async
// context, however, run in the same async context as the emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```

```cjs
const { EventEmitterAsyncResource, EventEmitter } = require('node:events');
const { notStrictEqual, strictEqual } = require('node:assert');
const { executionAsyncId, triggerAsyncId } = require('node:async_hooks');

// Async tracking tooling will identify this as 'Q'.
const ee1 = new EventEmitterAsyncResource({ name: 'Q' });

// 'foo' listeners will run in the EventEmitters async context.
ee1.on('foo', () => {
  strictEqual(executionAsyncId(), ee1.asyncId);
  strictEqual(triggerAsyncId(), ee1.triggerAsyncId);
});

const ee2 = new EventEmitter();

// 'foo' listeners on ordinary EventEmitters that do not track async
// context, however, run in the same async context as the emit().
ee2.on('foo', () => {
  notStrictEqual(executionAsyncId(), ee2.asyncId);
  notStrictEqual(triggerAsyncId(), ee2.triggerAsyncId);
});

Promise.resolve().then(() => {
  ee1.emit('foo');
  ee2.emit('foo');
});
```

`EventEmitterAsyncResource` class မှာ — `EventEmitter` နဲ့ `AsyncResource` တို့မှာ ရှိတဲ့ methods တွေ အတိုင်း — options တွေကိုလည်း အလားတူ လက်ခံပါတယ်။

### `new events.EventEmitterAsyncResource([options])`

* `options` {Object}
  * `captureRejections` {boolean} ဒါက promise rejection တွေကို အလိုအလျောက် ဖမ်းယူခြင်း [automatic capturing of promise rejection][capturerejections] ကို ဖွင့်ပေးပါတယ်။ **Default:** `false`။
  * `name` {string} Async event ရဲ့ အမျိုးအစား ဖြစ်ပါတယ်။ **Default:** [`new.target.name`][]။
  * `triggerAsyncId` {number} ဒီ async event ကို ဖန်တီးခဲ့တဲ့ execution context ရဲ့ ID ပါ။ **Default:** `executionAsyncId()`။
  * `requireManualDestroy` {boolean} `true` လို့ သတ်မှတ်ထားရင် — object ကို garbage collected (အမှိုက် သိမ်းဆည်းခြင်း) လုပ်တဲ့အခါ `emitDestroy` ကို disable လုပ်ပါတယ်။ ဒါက များသောအားဖြင့် သတ်မှတ်စရာ မလိုပါဘူး (`emitDestroy` ကို manually ခေါ်ထားရင်တောင်) — resource ရဲ့ `asyncId` ကို ပြန်ယူပြီး sensitive API ရဲ့ `emitDestroy` ကို အဲဒီ `asyncId` နဲ့ ခေါ်မယ့် အခြေအနေမျိုးကလွဲရင်ပါ။ `false` လို့ သတ်မှတ်ထားရင် — garbage collection လုပ်တဲ့အခါ `emitDestroy` call က active ဖြစ်နေတဲ့ `destroy` hook အနည်းဆုံး တစ်ခု ရှိမှသာ ဖြစ်ပေါ်ပါလိမ့်မယ်။ **Default:** `false`။

### `eventemitterasyncresource.asyncId`

* Type: {number} — Resource ကို သတ်မှတ်ပေးထားတဲ့ ထူးခြားတဲ့ (unique) `asyncId` ပါ

### `eventemitterasyncresource.asyncResource`

* Type: {AsyncResource} — အခြေခံ (underlying) {AsyncResource} ပါ

ပြန်ပေးလိုက်တဲ့ `AsyncResource` object မှာ — ဒီ `EventEmitterAsyncResource` ဆီကို ရည်ညွှန်းတဲ့ reference တစ်ခုကို ပေးတဲ့ — ထပ်ဆောင်း `eventEmitter` property တစ်ခု ပါရှိပါတယ်။

### `eventemitterasyncresource.emitDestroy()`

`destroy` hooks တွေ အားလုံးကို ခေါ်ယူပါတယ်။ ဒါကို တစ်ကြိမ်တည်းသာ ခေါ်သင့်ပါတယ်။ တစ်ကြိမ်ထက် ပိုခေါ်ရင် error တစ်ခု throw လုပ်ပါလိမ့်မယ်။ ဒါကို manual (လက်နဲ့ ကိုယ်တိုင်) ခေါ်ရန် **လိုအပ်** ပါတယ်။ Resource ကို GC က သိမ်းဆည်းဖို့ ချန်ထားခဲ့ရင် — `destroy` hooks တွေက ဘယ်တော့မှ ခေါ်ယူခံရမှာ မဟုတ်ပါဘူး။

### `eventemitterasyncresource.triggerAsyncId`

* Type: {number} — `AsyncResource` constructor ဆီကို ဖြတ်သန်းပေးတဲ့ `triggerAsyncId` အတိုင်း တူညီတဲ့ ဟာပါ

## `EventTarget` နဲ့ `Event` API (`EventTarget` and `Event` API)

`EventTarget` နဲ့ `Event` objects တွေက — Node.js core APIs တချို့က ထုတ်ဖော်ထားတဲ့ — [`EventTarget` Web API][] ရဲ့ Node.js-specific (Node.js အတွက် သီးသန့်) implementation တစ်ခု ဖြစ်ပါတယ်။

```js
const target = new EventTarget();

target.addEventListener('foo', (event) => {
  console.log('foo event happened!');
});
```

### Node.js `EventTarget` နဲ့ DOM `EventTarget` ကွာခြားချက်များ (Node.js `EventTarget` vs. DOM `EventTarget`)

Node.js `EventTarget` နဲ့ [`EventTarget` Web API][] အကြား အဓိက ကွာခြားချက် နှစ်ခု ရှိပါတယ်:

1. DOM `EventTarget` instances တွေဟာ အထက်အောက် အဆင့်ဆင့် (hierarchical) ဖြစ်နိုင်_ပေမယ့်_ — Node.js မှာတော့ hierarchy (အဆင့်ဆင့် ဖွဲ့စည်းမှု) နဲ့ event propagation (event ပျံ့နှံ့မှု) ဆိုတဲ့ သဘောတရား မရှိပါဘူး။ ဆိုလိုတာက — `EventTarget` တစ်ခုဆီ dispatch လုပ်လိုက်တဲ့ event တစ်ခုက — event အတွက် ကိုယ်ပိုင် handlers အစုတွေ ရှိနိုင်တဲ့ — nested target objects တွေရဲ့ အဆင့်ဆင့်ကြားကို ဖြတ်ပြီး ပျံ့နှံ့သွားတာ မဟုတ်ပါဘူး။
2. Node.js `EventTarget` မှာ — event listener တစ်ခုက async function (သို့) `Promise` တစ်ခုကို ပြန်ပေးတဲ့ function ဖြစ်ပြီး — ပြန်ပေးလိုက်တဲ့ `Promise` က reject ဖြစ်သွားရင် — အဲဒီ rejection ကို synchronously throw လုပ်တဲ့ listener တစ်ခုလိုပဲ — အလိုအလျောက် ဖမ်းယူပြီး ကိုင်တွယ်ပါတယ် (အသေးစိတ်အတွက် [`EventTarget` error handling][] ကို ကြည့်ပါ)။

### `NodeEventTarget` နဲ့ `EventEmitter` ကွာခြားချက်များ (`NodeEventTarget` vs. `EventEmitter`)

`NodeEventTarget` object က — အခြေအနေ အချို့မှာ `EventEmitter` တစ်ခုကို အနီးကပ် _အတုယူ_ (emulate) လုပ်နိုင်အောင် ခွင့်ပြုတဲ့ — `EventEmitter` API ရဲ့ ပြုပြင်ထားတဲ့ အပိုင်းအစု (modified subset) တစ်ခုကို implement လုပ်ပါတယ်။ `NodeEventTarget` တစ်ခုက `EventEmitter` ရဲ့ instance တစ်ခု _မဟုတ်ပါဘူး_ — ပြီးတော့ ကိစ္စအများစုမှာ `EventEmitter` နေရာမှာ အစားထိုး သုံးလို့ မရပါဘူး။

1. `EventEmitter` နဲ့ မတူဘဲ — `listener` တစ်ခုခုကို event `type` တစ်ခုစီအတွက် အများဆုံး တစ်ကြိမ်သာ register လုပ်နိုင်ပါတယ်။ `listener` တစ်ခုကို အကြိမ်များစွာ register လုပ်ဖို့ ကြိုးစားတာတွေကို လျစ်လျူရှုလိုက်ပါတယ်။
2. `NodeEventTarget` က `EventEmitter` API တစ်ခုလုံးကို emulate မလုပ်ပါဘူး။ အထူးသဖြင့် — `prependListener()`, `prependOnceListener()`, `rawListeners()`, နဲ့ `errorMonitor` APIs တွေကို emulate မလုပ်ပါဘူး။ `'newListener'` နဲ့ `'removeListener'` events တွေကိုလည်း emit လုပ်မှာ မဟုတ်ပါဘူး။
3. `NodeEventTarget` က `'error'` အမျိုးအစား events တွေအတွက် အထူး default အပြုအမူ (behavior) တစ်ခုမှ implement မလုပ်ပါဘူး။
4. `NodeEventTarget` က — event types တွေ အားလုံးအတွက် handlers တွေအနေနဲ့ functions တွေသာမက `EventListener` objects တွေကိုပါ support လုပ်ပါတယ်။

### Event listener များ (Event listener)

Event `type` တစ်ခုအတွက် register လုပ်ထားတဲ့ event listeners တွေက — JavaScript functions တွေ (သို့) တန်ဖိုးက function တစ်ခု ဖြစ်တဲ့ `handleEvent` property ပါတဲ့ objects တွေ — နှစ်မျိုးလုံး ဖြစ်နိုင်ပါတယ်။

ဘယ်အခြေအနေမှာပဲ ဖြစ်ဖြစ် — handler function ကို `eventTarget.dispatchEvent()` function ဆီ ဖြတ်သန်းပေးလိုက်တဲ့ `event` argument နဲ့အတူ ခေါ်ယူပါတယ်။

Async functions တွေကို event listeners တွေအနေနဲ့ သုံးနိုင်ပါတယ်။ Async handler function တစ်ခု reject ဖြစ်ရင် — အဲဒီ rejection ကို [`EventTarget` error handling][] မှာ ဖော်ပြထားတဲ့အတိုင်း ဖမ်းယူပြီး ကိုင်တွယ်ပါတယ်။

Handler function တစ်ခုက throw လုပ်လိုက်တဲ့ error တစ်ခုက — တခြား handlers တွေကို ခေါ်ယူတာကို တားဆီးမပေးပါဘူး။

Handler function တစ်ခုရဲ့ return value (ပြန်ပေးတန်ဖိုး) ကို လျစ်လျူရှုလိုက်ပါတယ်။

Handlers တွေကို ထည့်သွင်းခဲ့တဲ့ အစဉ်အတိုင်း အမြဲတမ်း ခေါ်ယူပါတယ်။

Handler functions တွေက `event` object ကို mutate (ပြောင်းလဲ) လုပ်နိုင်ပါတယ်။

```js
function handler1(event) {
  console.log(event.type);  // Prints 'foo'
  event.a = 1;
}

async function handler2(event) {
  console.log(event.type);  // Prints 'foo'
  console.log(event.a);  // Prints 1
}

const handler3 = {
  handleEvent(event) {
    console.log(event.type);  // Prints 'foo'
  },
};

const handler4 = {
  async handleEvent(event) {
    console.log(event.type);  // Prints 'foo'
  },
};

const target = new EventTarget();

target.addEventListener('foo', handler1);
target.addEventListener('foo', handler2);
target.addEventListener('foo', handler3);
target.addEventListener('foo', handler4, { once: true });
```

### `EventTarget` error ကိုင်တွယ်ခြင်း (`EventTarget` error handling)

Register လုပ်ထားတဲ့ event listener တစ်ခုက throw လုပ်လိုက်တဲ့အခါ (သို့) reject ဖြစ်တဲ့ Promise တစ်ခုကို ပြန်ပေးလိုက်တဲ့အခါ — default အနေနဲ့ အဲဒီ error ကို `process.nextTick()` ပေါ်မှာ uncaught exception (ဖမ်းယူမရတဲ့ exception) တစ်ခုအနေနဲ့ သဘောထားပါတယ်။ ဒါက `EventTarget` တွေထဲက uncaught exceptions တွေက Node.js process ကို default အနေနဲ့ အဆုံးသတ်စေမယ်လို့ ဆိုလိုပါတယ်။

Event listener တစ်ခုအတွင်းမှာ throw လုပ်တာက — တခြား register လုပ်ထားတဲ့ handlers တွေကို ခေါ်ယူတာကို _တားဆီး_ မပေးပါဘူး။

`EventTarget` က `EventEmitter` လိုမျိုး `'error'` အမျိုးအစား events တွေအတွက် အထူး default ကိုင်တွယ်မှု တစ်ခုမှ implement မလုပ်ပါဘူး။

လောလောဆယ်တော့ — errors တွေကို `process.on('uncaughtException')` ဆီ မရောက်ခင် `process.on('error')` event ဆီကို အရင်ဦးဆုံး လမ်းကြောင်းလွှဲပေးပါတယ်။ ဒီအပြုအမူက deprecated (ခေတ်ကုန်) ဖြစ်နေပြီး — `EventTarget` ကို တခြား Node.js APIs တွေနဲ့ ညှိယူနိုင်ဖို့ — နောက်ထွက်မယ့် (future) release တစ်ခုမှာ ပြောင်းလဲသွားပါလိမ့်မယ်။ `process.on('error')` event ကို အားကိုးထားတဲ့ code မှန်သမျှကို အပြုအမူအသစ်နဲ့ ညှိထားသင့်ပါတယ်။

### Class: `Event`

`Event` object က [`Event` Web API][] ကို ပြုပြင်ပြောင်းလဲ လိုက်လျောညီထွေ ဖြစ်အောင် လုပ်ထားတဲ့ (adaptation) တစ်ခု ဖြစ်ပါတယ်။ Instances တွေကို Node.js အတွင်းပိုင်းကနေ ဖန်တီးပါတယ်။

#### `event.bubbles`

* Type: {boolean} — အမြဲတမ်း `false` ကို ပြန်ပေးပါတယ်

ဒါကို Node.js မှာ အသုံးမပြုပါဘူး — ပြည့်စုံမှု (completeness) အတွက်သက်သက် ထည့်သွင်းပေးထားတာပါ။

#### `event.cancelBubble`

> Stability: 3 - Legacy: Use [`event.stopPropagation()`][] instead.

* Type: {boolean}

`true` လို့ သတ်မှတ်ထားရင် — `event.stopPropagation()` ရဲ့ alias တစ်ခု ဖြစ်ပါတယ်။ ဒါကို Node.js မှာ အသုံးမပြုပါဘူး — ပြည့်စုံမှု (completeness) အတွက်သက်သက် ထည့်သွင်းပေးထားတာပါ။

#### `event.cancelable`

* Type: {boolean} — Event ကို `cancelable` option နဲ့ ဖန်တီးထားရင် `true` ဖြစ်ပါတယ်

#### `event.composed`

* Type: {boolean} — အမြဲတမ်း `false` ကို ပြန်ပေးပါတယ်

ဒါကို Node.js မှာ အသုံးမပြုပါဘူး — ပြည့်စုံမှု (completeness) အတွက်သက်သက် ထည့်သွင်းပေးထားတာပါ။

#### `event.composedPath()`

လက်ရှိ `EventTarget` ကို တစ်ခုတည်းသော entry အဖြစ် ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ် — event ကို dispatch မလုပ်နေဘူးဆိုရင်တော့ empty (ဗလာ) ဖြစ်ပါတယ်။ ဒါကို Node.js မှာ အသုံးမပြုပါဘူး — ပြည့်စုံမှု (completeness) အတွက်သက်သက် ထည့်သွင်းပေးထားတာပါ။

#### `event.currentTarget`

* Type: {EventTarget} — Event ကို dispatch လုပ်နေတဲ့ `EventTarget` ပါ

`event.target` ရဲ့ alias ပါ။

#### `event.defaultPrevented`

* Type: {boolean}

`cancelable` က `true` ဖြစ်ပြီး `event.preventDefault()` ကို ခေါ်ထားခဲ့ရင် — `true` ဖြစ်ပါတယ်။

#### `event.eventPhase`

* Type: {number} — Event တစ်ခု dispatch မလုပ်ခံရသေးတဲ့အချိန်မှာ `0` ကို ပြန်ပေးပြီး — dispatch လုပ်နေတဲ့အချိန်မှာတော့ `2` ကို ပြန်ပေးပါတယ်

ဒါကို Node.js မှာ အသုံးမပြုပါဘူး — ပြည့်စုံမှု (completeness) အတွက်သက်သက် ထည့်သွင်းပေးထားတာပါ။

#### `event.initEvent(type[, bubbles[, cancelable]])`

> Stability: 3 - Legacy: The WHATWG spec considers it deprecated and users
> shouldn't use it at all.
> WHATWG spec က ဒီ method ကို deprecated (ခေတ်ကုန်) လို့ သတ်မှတ်ထားပြီး — သုံးစွဲသူတွေ လုံးဝ မသုံးသင့်တော့ဘူးလို့ ဆိုပါတယ်။

* `type` {string}
* `bubbles` {boolean}
* `cancelable` {boolean}

Event constructors တွေနဲ့ ထပ်နေပြီး — `composed` ကို သတ်မှတ်နိုင်စွမ်း မရှိပါဘူး။ ဒါကို Node.js မှာ အသုံးမပြုပါဘူး — ပြည့်စုံမှု (completeness) အတွက်သက်သက် ထည့်သွင်းပေးထားတာပါ။

#### `event.isTrusted`

* Type: {boolean}

{AbortSignal} ရဲ့ `"abort"` event ကို — `isTrusted` က `true` လို့ သတ်မှတ်ထားတဲ့ အနေအထားနဲ့ emit လုပ်ပါတယ်။ တခြား အခြေအနေ အားလုံးမှာတော့ တန်ဖိုးက `false` ပါ။

#### `event.preventDefault()`

`cancelable` က `true` ဖြစ်ရင် — `defaultPrevented` property ကို `true` အဖြစ် သတ်မှတ်ပေးပါတယ်။

#### `event.returnValue`

> Stability: 3 - Legacy: Use [`event.defaultPrevented`][] instead.

* Type: {boolean} — Event ကို ပယ်ဖျက် (cancel) မလုပ်ရသေးရင် `true` ဖြစ်ပါတယ်

`event.returnValue` ရဲ့ တန်ဖိုးက `event.defaultPrevented` ရဲ့ ဆန့်ကျင်ဘက် အမြဲတမ်း ဖြစ်ပါတယ်။ ဒါကို Node.js မှာ အသုံးမပြုပါဘူး — ပြည့်စုံမှု (completeness) အတွက်သက်သက် ထည့်သွင်းပေးထားတာပါ။

#### `event.srcElement`

> Stability: 3 - Legacy: Use [`event.target`][] instead.

* Type: {EventTarget} — Event ကို dispatch လုပ်နေတဲ့ `EventTarget` ပါ

`event.target` ရဲ့ alias ပါ။

#### `event.stopImmediatePropagation()`

လက်ရှိ listener ပြီးဆုံးသွားပြီးနောက် — event listeners တွေကို ခေါ်ယူတာကို ရပ်တန့်စေပါတယ်။

#### `event.stopPropagation()`

ဒါကို Node.js မှာ အသုံးမပြုပါဘူး — ပြည့်စုံမှု (completeness) အတွက်သက်သက် ထည့်သွင်းပေးထားတာပါ။

#### `event.target`

* Type: {EventTarget} — Event ကို dispatch လုပ်နေတဲ့ `EventTarget` ပါ

#### `event.timeStamp`

* Type: {number}

`Event` object ကို ဖန်တီးလိုက်တဲ့အချိန်ရဲ့ millisecond timestamp ပါ။

#### `event.type`

* Type: {string}

Event ရဲ့ အမျိုးအစား (type) identifier ပါ။

### Class: `EventTarget`

#### `eventTarget.addEventListener(type, listener[, options])`

* `type` {string}
* `listener` {Function|EventListener}
* `options` {Object}
  * `once` {boolean} `true` ဆိုရင် — listener ကို ပထမဆုံး အကြိမ် ခေါ်ယူလိုက်တာနဲ့ အလိုအလျောက် ဖယ်ရှားပါတယ်။ **Default:** `false`။
  * `passive` {boolean} `true` ဆိုရင် — listener က `Event` object ရဲ့ `preventDefault()` method ကို ခေါ်မှာ မဟုတ်ဘူးဆိုတဲ့ အရိပ်အမြွက် (hint) တစ်ခုအနေနဲ့ ဆောင်ရွက်ပါတယ်။ **Default:** `false`။
  * `capture` {boolean} Node.js က တိုက်ရိုက် အသုံးမပြုပါဘူး။ API ပြည့်စုံမှု အတွက် ထည့်ပေးထားတာပါ။ **Default:** `false`။
  * `signal` {AbortSignal} ပေးထားတဲ့ AbortSignal object ရဲ့ `abort()` method ကို ခေါ်လိုက်တဲ့အခါ — listener ကို ဖယ်ရှားပါလိမ့်မယ်။

`type` event အတွက် handler အသစ်တစ်ခုကို ထည့်သွင်းပါတယ်။ ပေးထားတဲ့ `listener` တစ်ခုခုကို `type` တစ်ခုစီ နဲ့ `capture` option တန်ဖိုး တစ်ခုစီအတွက် — တစ်ကြိမ်တည်းသာ ထည့်သွင်းပါတယ်။

`once` option က `true` ဆိုရင် — နောက်တစ်ကြိမ် `type` event တစ်ခုကို dispatch လုပ်ပြီးတာနဲ့ — `listener` ကို ဖယ်ရှားပါတယ်။

`capture` option ကို Node.js က — `EventTarget` specification အရ register လုပ်ထားတဲ့ event listeners တွေကို ခြေရာခံတာကလွဲပြီး — လုပ်ဆောင်ချက် (functional) အရ တစ်နည်းနည်းနဲ့မှ အသုံးမပြုပါဘူး။ အထူးသဖြင့် — `capture` option ကို `listener` တစ်ခု register လုပ်တဲ့အခါ key ရဲ့ အစိတ်အပိုင်း တစ်ခုအနေနဲ့ သုံးပါတယ်။ `listener` တစ်ခုချင်းစီကို `capture = false` နဲ့ တစ်ကြိမ်၊ `capture = true` နဲ့ တစ်ကြိမ် — ထည့်သွင်းနိုင်ပါတယ်။

```js
function handler(event) {}

const target = new EventTarget();
target.addEventListener('foo', handler, { capture: true });  // first
target.addEventListener('foo', handler, { capture: false }); // second

// Removes the second instance of handler
target.removeEventListener('foo', handler);

// Removes the first instance of handler
target.removeEventListener('foo', handler, { capture: true });
```

#### `eventTarget.dispatchEvent(event)`

* `event` {Event}
* Returns: {boolean} — event ရဲ့ `cancelable` attribute တန်ဖိုးက `false` ဖြစ်ရင် (သို့) ၎င်းရဲ့ `preventDefault()` method ကို မခေါ်ထားရင် — `true` ဖြစ်ပြီး — မဟုတ်ရင် `false` ဖြစ်ပါတယ်

`event` ကို `event.type` အတွက် handlers စာရင်းဆီ dispatch လုပ်ပါတယ်။

Register လုပ်ထားတဲ့ event listeners တွေကို register လုပ်ခဲ့တဲ့ အစဉ်အတိုင်း synchronously ခေါ်ယူပါတယ်။

#### `eventTarget.removeEventListener(type, listener[, options])`

* `type` {string}
* `listener` {Function|EventListener}
* `options` {Object}
  * `capture` {boolean}

`listener` ကို event `type` အတွက် handlers စာရင်းကနေ ဖယ်ရှားပါတယ်။

### Class: `CustomEvent`

* Extends: {Event}

`CustomEvent` object က [`CustomEvent` Web API][] ကို ပြုပြင်ပြောင်းလဲ လိုက်လျောညီထွေ ဖြစ်အောင် လုပ်ထားတဲ့ (adaptation) တစ်ခု ဖြစ်ပါတယ်။ Instances တွေကို Node.js အတွင်းပိုင်းကနေ ဖန်တီးပါတယ်။

#### `event.detail`

* Type: {any} — Initializing (အစပြု စတင်ခြင်း) လုပ်တဲ့အခါ ဖြတ်သန်းပေးခဲ့တဲ့ custom data ကို ပြန်ပေးပါတယ်

Read-only (ဖတ်ရုံသာ) ဖြစ်ပါတယ်။

### Class: `NodeEventTarget`

* Extends: {EventTarget}

`NodeEventTarget` က `EventEmitter` API ရဲ့ subset တစ်ခုကို emulate လုပ်တဲ့ — `EventTarget` အတွက် Node.js-specific extension (Node.js အတွက် သီးသန့် တိုးချဲ့မှု) တစ်ခု ဖြစ်ပါတယ်။

#### `nodeEventTarget.addListener(type, listener)`

* `type` {string}

* `listener` {Function|EventListener}

* Returns: {EventTarget} this

တူညီတဲ့ `EventEmitter` API ကို emulate လုပ်တဲ့ `EventTarget` class ရဲ့ Node.js-specific extension တစ်ခု ဖြစ်ပါတယ်။ `addListener()` နဲ့ `addEventListener()` အကြား တစ်ခုတည်းသော ကွာခြားချက်က — `addListener()` က `EventTarget` ဆီကို ရည်ညွှန်းတဲ့ reference တစ်ခုကို ပြန်ပေးတာပါ။

#### `nodeEventTarget.emit(type, arg)`

* `type` {string}
* `arg` {any}
* Returns: {boolean} — `type` အတွက် register လုပ်ထားတဲ့ event listeners တွေ ရှိရင် `true` — မရှိရင် `false` ဖြစ်ပါတယ်

`type` အတွက် handlers စာရင်းဆီကို `arg` ကို dispatch လုပ်ပေးတဲ့ `EventTarget` class ရဲ့ Node.js-specific extension တစ်ခု ဖြစ်ပါတယ်။

#### `nodeEventTarget.eventNames()`

* Returns: {string\[]}

Event listeners တွေ register လုပ်ထားတဲ့ event `type` နာမည်တွေရဲ့ array တစ်ခုကို ပြန်ပေးတဲ့ `EventTarget` class ရဲ့ Node.js-specific extension တစ်ခု ဖြစ်ပါတယ်။

#### `nodeEventTarget.listenerCount(type)`

* `type` {string}

* Returns: {number}

`type` အတွက် register လုပ်ထားတဲ့ event listeners အရေအတွက်ကို ပြန်ပေးတဲ့ `EventTarget` class ရဲ့ Node.js-specific extension တစ်ခု ဖြစ်ပါတယ်။

#### `nodeEventTarget.setMaxListeners(n)`

* `n` {number}

Max event listeners အရေအတွက်ကို `n` အဖြစ် သတ်မှတ်ပေးတဲ့ `EventTarget` class ရဲ့ Node.js-specific extension တစ်ခု ဖြစ်ပါတယ်။

#### `nodeEventTarget.getMaxListeners()`

* Returns: {number}

Max event listeners အရေအတွက်ကို ပြန်ပေးတဲ့ `EventTarget` class ရဲ့ Node.js-specific extension တစ်ခု ဖြစ်ပါတယ်။

#### `nodeEventTarget.off(type, listener[, options])`

* `type` {string}

* `listener` {Function|EventListener}

* `options` {Object}
  * `capture` {boolean}

* Returns: {EventTarget} this

`eventTarget.removeEventListener()` ရဲ့ Node.js-specific alias တစ်ခု ဖြစ်ပါတယ်။

#### `nodeEventTarget.on(type, listener)`

* `type` {string}

* `listener` {Function|EventListener}

* Returns: {EventTarget} this

`eventTarget.addEventListener()` ရဲ့ Node.js-specific alias တစ်ခု ဖြစ်ပါတယ်။

#### `nodeEventTarget.once(type, listener)`

* `type` {string}

* `listener` {Function|EventListener}

* Returns: {EventTarget} this

ပေးထားတဲ့ event `type` အတွက် `once` listener တစ်ခုကို ထည့်သွင်းပေးတဲ့ `EventTarget` class ရဲ့ Node.js-specific extension တစ်ခု ဖြစ်ပါတယ်။ ဒါက `once` option ကို `true` လို့ သတ်မှတ်ပြီး `on` ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

#### `nodeEventTarget.removeAllListeners([type])`

* `type` {string}

* Returns: {EventTarget} this

`EventTarget` class ရဲ့ Node.js-specific extension တစ်ခု ဖြစ်ပါတယ်။ `type` ကို သတ်မှတ်ထားရင် — `type` အတွက် register လုပ်ထားတဲ့ listeners တွေ အားလုံးကို ဖယ်ရှားပြီး — မဟုတ်ရင် register လုပ်ထားတဲ့ listeners တွေ အားလုံးကို ဖယ်ရှားပါတယ်။

#### `nodeEventTarget.removeListener(type, listener[, options])`

* `type` {string}

* `listener` {Function|EventListener}

* `options` {Object}
  * `capture` {boolean}

* Returns: {EventTarget} this

ပေးထားတဲ့ `type` အတွက် `listener` ကို ဖယ်ရှားပေးတဲ့ `EventTarget` class ရဲ့ Node.js-specific extension တစ်ခု ဖြစ်ပါတယ်။ `removeListener()` နဲ့ `removeEventListener()` အကြား တစ်ခုတည်းသော ကွာခြားချက်က — `removeListener()` က `EventTarget` ဆီကို ရည်ညွှန်းတဲ့ reference တစ်ခုကို ပြန်ပေးတာပါ။

[WHATWG-EventTarget]: https://dom.spec.whatwg.org/#interface-eventtarget
[`--trace-warnings`]: cli.md#--trace-warnings
[`CustomEvent` Web API]: https://dom.spec.whatwg.org/#customevent
[`EventTarget` Web API]: https://dom.spec.whatwg.org/#eventtarget
[`EventTarget` error handling]: #eventtarget-error-handling
[`Event` Web API]: https://dom.spec.whatwg.org/#event
[`domain`]: domain.md
[`e.stopImmediatePropagation()`]: #eventstopimmediatepropagation
[`emitter.removeListener()`]: #emitterremovelistenereventname-listener
[`emitter.setMaxListeners(n)`]: #emittersetmaxlistenersn
[`event.defaultPrevented`]: #eventdefaultprevented
[`event.stopPropagation()`]: #eventstoppropagation
[`event.target`]: #eventtarget
[`events.defaultMaxListeners`]: #eventsdefaultmaxlisteners
[`fs.ReadStream`]: fs.md#class-fsreadstream
[`net.Server`]: net.md#class-netserver
[`new.target.name`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target
[`process.on('warning')`]: process.md#event-warning
[async context]: async_context.md
[capturerejections]: #capture-rejections-of-promises
[error]: #error-events
[rejection]: #emittersymbolfornodejsrejectionerr-eventname-args
[rejectionsymbol]: #eventscapturerejectionsymbol
[stream]: stream.md
