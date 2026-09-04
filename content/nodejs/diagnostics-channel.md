---
title: "Diagnostics Channel"
description: "node:diagnostics_channel module — diagnostics data များအတွက် named channels (publish/subscribe, tracing, AsyncLocalStorage binding, built-in channels အပါအဝင်)။"
order: 111
source: "https://nodejs.org/api/diagnostics_channel.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:diagnostics_channel` module က diagnostics ရည်ရွယ်ချက်တွေအတွက် မည်သည့် message data မဆို သတင်းပို့နိုင်ဖို့ — နာမည်ပေးထားတဲ့ channels (ချန်နယ်များ) တွေကို ဖန်တီးနိုင်တဲ့ API တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

အောက်ပါအတိုင်း ဝင်ရောက်သုံးနိုင်ပါတယ်:

```mjs
import diagnostics_channel from 'node:diagnostics_channel';
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');
```

Diagnostics messages တွေကို သတင်းပို့ချင်တဲ့ module တစ်ခုရဲ့ ရေးသားသူ (module writer) က messages တွေ ပို့ဖို့အတွက် top-level channels တစ်ခု (သို့) အများအပြားကို ဖန်တီးမယ်လို့ ရည်ရွယ်ထားပါတယ်။ Channels တွေကို runtime မှာလည်း ရယူနိုင်ပါတယ် — ဒါပေမယ့် အဲဒီလို လုပ်ခြင်းက အပို overhead (ကုန်ကျစရိတ်) ဖြစ်စေတာမို့ အားမပေးပါဘူး။ အဆင်ပြေစေဖို့ channels တွေကို export လုပ်ထားလို့လည်း ရပါတယ် — ဒါပေမယ့် နာမည်ကို သိရှိထားသရွေ့ ဘယ်နေရာကမဆို ပြန်လည် ရယူနိုင်ပါတယ်။

သင့် module က တခြားသူတွေ သုံးစွဲနိုင်ဖို့ diagnostics data တွေ ထုတ်လုပ်ပေးမယ်ဆိုရင် — ဘယ် named channels တွေကို သုံးထားလဲ ဆိုတာနဲ့ message data ရဲ့ ပုံသဏ္ဌာန် (shape) အကြောင်း documentation ထဲမှာ ထည့်သွင်း ဖော်ပြဖို့ အကြံပြုပါတယ်။ Channel names တွေက — တခြား modules တွေရဲ့ data တွေနဲ့ collision (ထပ်တူကျမှု) မဖြစ်စေဖို့ — ယေဘုယျအားဖြင့် module ရဲ့ နာမည်ကို ထည့်သွင်းထားသင့်ပါတယ်။

## Public API (အများသုံး API)

### ခြုံငုံ သုံးသပ်ချက် (Overview)

အောက်မှာ public API ရဲ့ ရိုးရှင်းတဲ့ ခြုံငုံ သုံးသပ်ချက် ဖြစ်ပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

// Get a reusable channel object
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

// Subscribe to the channel
diagnostics_channel.subscribe('my-channel', onMessage);

// Check if the channel has an active subscriber
if (channel.hasSubscribers) {
  // Publish data to the channel
  channel.publish({
    some: 'data',
  });
}

// Unsubscribe from the channel
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

// Get a reusable channel object
const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

// Subscribe to the channel
diagnostics_channel.subscribe('my-channel', onMessage);

// Check if the channel has an active subscriber
if (channel.hasSubscribers) {
  // Publish data to the channel
  channel.publish({
    some: 'data',
  });
}

// Unsubscribe from the channel
diagnostics_channel.unsubscribe('my-channel', onMessage);
```

#### `diagnostics_channel.hasSubscribers(name)`

* `name` {string|symbol} ချန်နယ်၏ နာမည်
* Returns: {boolean} active subscribers ရှိမရှိ

နာမည်ပေးထားတဲ့ ချန်နယ်ဆီမှာ active subscribers (လှုပ်ရှားနေသော စာရင်းသွင်းသူများ) ရှိမရှိ စစ်ဆေးပါတယ်။ ပို့လိုတဲ့ message ကို ပြင်ဆင်ရတာ စျေးကြီးနိုင်တဲ့ (expensive) အခြေအနေမျိုးမှာ ဒါက အသုံးဝင်ပါတယ်။

ဒီ API က optional ဖြစ်ပေမယ့် — performance ကို အလွန် အထိမခံနိုင်တဲ့ (performance-sensitive) code တွေကနေ messages တွေ publish လုပ်ဖို့ ကြိုးစားတဲ့အခါ အသုံးဝင်ပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // There are subscribers, prepare and publish message
}
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

if (diagnostics_channel.hasSubscribers('my-channel')) {
  // There are subscribers, prepare and publish message
}
```

#### `diagnostics_channel.channel(name)`

* `name` {string|symbol} ချန်နယ်၏ နာမည်
* Returns: {Channel} နာမည်ပေးထားတဲ့ ချန်နယ် object

ဒါက နာမည်ပေးထားတဲ့ ချန်နယ်တစ်ခုဆီ publish လုပ်ချင်သူတိုင်းအတွက် အဓိက entry-point (ဝင်ပေါက်) ပါ။ ဒါက publish လုပ်ချိန်မှာ overhead ကို တတ်နိုင်သမျှ လျှော့ချဖို့ optimize လုပ်ထားတဲ့ channel object တစ်ခုကို ထုတ်ပေးပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');
```

#### `diagnostics_channel.subscribe(name, onMessage)`

* `name` {string|symbol} ချန်နယ်၏ နာမည်
* `onMessage` {Function} ချန်နယ် messages တွေကို လက်ခံရယူမယ့် handler
  * `message` {any} message data
  * `name` {string|symbol} ချန်နယ်၏ နာမည်

ဒီချန်နယ်ကို subscribe လုပ်ဖို့ message handler တစ်ခုကို register (မှတ်ပုံတင်) လုပ်ပေးပါတယ်။ ဒီ message handler က ချန်နယ်ဆီ message တစ်ခု publish လုပ်လိုက်တိုင်း — synchronously (တစ်ပြိုင်နက်) run ပါလိမ့်မယ်။ Message handler ထဲမှာ throw လုပ်လိုက်တဲ့ errors တွေက [`'uncaughtException'`][] ကို trigger လုပ်ပါလိမ့်မယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Received data
});
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.subscribe('my-channel', (message, name) => {
  // Received data
});
```

#### `diagnostics_channel.unsubscribe(name, onMessage)`

* `name` {string|symbol} ချန်နယ်၏ နာမည်
* `onMessage` {Function} ဖယ်ရှားမယ့် အရင်က စာရင်းသွင်းထားခဲ့တဲ့ handler
* Returns: {boolean} handler ကို တွေ့ရှိခဲ့ရင် `true`၊ မဟုတ်ရင် `false` ဖြစ်သည်။

[`diagnostics_channel.subscribe(name, onMessage)`][] နဲ့ အရင်က ဒီချန်နယ်ဆီ register လုပ်ထားခဲ့တဲ့ message handler တစ်ခုကို ဖယ်ရှားပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

function onMessage(message, name) {
  // Received data
}

diagnostics_channel.subscribe('my-channel', onMessage);

diagnostics_channel.unsubscribe('my-channel', onMessage);
```

#### `diagnostics_channel.tracingChannel(nameOrChannels)`

> Stability: 2 - Stable

* `nameOrChannels` {string|TracingChannel} ချန်နယ် နာမည် (သို့) [TracingChannel Channels][] အားလုံး ပါဝင်တဲ့ object
* Returns: {TracingChannel} trace လုပ်ဖို့ သုံးမယ့် channels အစုအဝေး

ပေးထားတဲ့ [TracingChannel Channels][] အတွက် [`TracingChannel`][] wrapper တစ်ခုကို ဖန်တီးပေးပါတယ်။ နာမည်တစ်ခု ပေးထားရင် — သက်ဆိုင်ရာ tracing channels တွေကို `tracing:${name}:${eventType}` ပုံစံနဲ့ ဖန်တီးပေးပါတယ်။ အဲဒီမှာ `eventType` က [TracingChannel Channels][] ရဲ့ အမျိုးအစားတွေနဲ့ ကိုက်ညီပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channelsByName = diagnostics_channel.tracingChannel('my-channel');

// or...

const channelsByCollection = diagnostics_channel.tracingChannel({
  start: diagnostics_channel.channel('tracing:my-channel:start'),
  end: diagnostics_channel.channel('tracing:my-channel:end'),
  asyncStart: diagnostics_channel.channel('tracing:my-channel:asyncStart'),
  asyncEnd: diagnostics_channel.channel('tracing:my-channel:asyncEnd'),
  error: diagnostics_channel.channel('tracing:my-channel:error'),
});
```

#### `diagnostics_channel.boundedChannel(nameOrChannels)`

> Stability: 1 - Experimental

* `nameOrChannels` {string|BoundedChannel} ချန်နယ် နာမည် (သို့) [BoundedChannel Channels][] အားလုံး ပါဝင်တဲ့ object
* Returns: {BoundedChannel} trace လုပ်ဖို့ သုံးမယ့် channels အစုအဝေး

ပေးထားတဲ့ channels တွေအတွက် [`BoundedChannel`][] wrapper တစ်ခုကို ဖန်တီးပေးပါတယ်။ နာမည်တစ်ခု ပေးထားရင် — သက်ဆိုင်ရာ channels တွေကို `tracing:${name}:${eventType}` ပုံစံနဲ့ ဖန်တီးပေးပါတယ်။ အဲဒီမှာ `eventType` က `start` (သို့) `end` ဖြစ်ပါတယ်။

`BoundedChannel` က synchronous operations တွေကိုပဲ trace လုပ်တဲ့ [`TracingChannel`][] ရဲ့ ရိုးရှင်းတဲ့ (simplified) ဗားရှင်း တစ်ခုပါ။ သူ့မှာ `start` နဲ့ `end` events တွေပဲ ရှိပြီး — `asyncStart`, `asyncEnd` (သို့) `error` events တွေ မပါပါဘူး။ ဒါကြောင့် asynchronous continuations (သို့) error handling တွေ မပါဝင်တဲ့ operations တွေကို trace လုပ်ဖို့ သင့်တော်ပါတယ်။

```mjs
import { boundedChannel, channel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

// or...

const wc2 = boundedChannel({
  start: channel('tracing:my-operation:start'),
  end: channel('tracing:my-operation:end'),
});
```

```cjs
const { boundedChannel, channel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

// or...

const wc2 = boundedChannel({
  start: channel('tracing:my-operation:start'),
  end: channel('tracing:my-operation:end'),
});
```

### Class: `Channel`

`Channel` class က data pipeline ထဲက သီးခြား (individual) named channel တစ်ခုကို ကိုယ်စားပြုပါတယ်။ Subscribers တွေကို ခြေရာခံဖို့နဲ့ — subscribers ရှိနေတဲ့အခါ messages တွေကို publish လုပ်ဖို့ သုံးပါတယ်။ ဒါက publish လုပ်ချိန်မှာ channel lookups တွေ လုပ်စရာ မလိုအောင် သီးခြား object တစ်ခုအနေနဲ့ တည်ရှိပြီး — အလွန် မြန်ဆန်တဲ့ publish speeds တွေကို ရရှိစေကာ — ကုန်ကျစရိတ် အလွန် နည်းပါးရုံဖြင့် အသုံးပြုမှု များပြားစွာကိုပါ ခွင့်ပြုပေးပါတယ်။ Channels တွေကို [`diagnostics_channel.channel(name)`][] နဲ့ ဖန်တီးပြီး — `new Channel(name)` နဲ့ တိုက်ရိုက် တည်ဆောက်တာကိုတော့ support မလုပ်ပါဘူး။

#### `channel.hasSubscribers`

* Returns: {boolean} active subscribers ရှိမရှိ

ဒီချန်နယ်ဆီမှာ active subscribers ရှိမရှိ စစ်ဆေးပါတယ်။ ပို့လိုတဲ့ message ကို ပြင်ဆင်ရတာ စျေးကြီးနိုင်တဲ့ အခြေအနေမျိုးမှာ ဒါက အသုံးဝင်ပါတယ်။

ဒီ API က optional ဖြစ်ပေမယ့် — performance ကို အလွန် အထိမခံနိုင်တဲ့ code တွေကနေ messages တွေ publish လုပ်ဖို့ ကြိုးစားတဲ့အခါ အသုံးဝင်ပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // There are subscribers, prepare and publish message
}
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

if (channel.hasSubscribers) {
  // There are subscribers, prepare and publish message
}
```

#### `channel.publish(message)`

* `message` {any} ချန်နယ် subscribers တွေဆီ ပို့မယ့် message

ချန်နယ်ကို subscribe လုပ်ထားတဲ့ subscribers တွေဆီ message တစ်ခုကို publish လုပ်ပါတယ်။ ဒါက message handlers တွေကို synchronously ခေါ်ပေးတာမို့ — တူညီတဲ့ context အတွင်းမှာပဲ execute လုပ်ကြပါလိမ့်မယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.publish({
  some: 'message',
});
```

#### `channel.subscribe(onMessage)`

* `onMessage` {Function} ချန်နယ် messages တွေကို လက်ခံရယူမယ့် handler
  * `message` {any} message data
  * `name` {string|symbol} ချန်နယ်၏ နာမည်

ဒီချန်နယ်ကို subscribe လုပ်ဖို့ message handler တစ်ခုကို register လုပ်ပေးပါတယ်။ ဒီ message handler က ချန်နယ်ဆီ message တစ်ခု publish လုပ်လိုက်တိုင်း — synchronously run ပါလိမ့်မယ်။ Message handler ထဲမှာ throw လုပ်လိုက်တဲ့ errors တွေက [`'uncaughtException'`][] ကို trigger လုပ်ပါလိမ့်မယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

channel.subscribe((message, name) => {
  // Received data
});
```

#### `channel.unsubscribe(onMessage)`

* `onMessage` {Function} ဖယ်ရှားမယ့် အရင်က စာရင်းသွင်းထားခဲ့တဲ့ handler
* Returns: {boolean} handler ကို တွေ့ရှိခဲ့ရင် `true`၊ မဟုတ်ရင် `false` ဖြစ်သည်။

[`channel.subscribe(onMessage)`][] နဲ့ အရင်က ဒီချန်နယ်ဆီ register လုပ်ထားခဲ့တဲ့ message handler တစ်ခုကို ဖယ်ရှားပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channel = diagnostics_channel.channel('my-channel');

function onMessage(message, name) {
  // Received data
}

channel.subscribe(onMessage);

channel.unsubscribe(onMessage);
```

#### `channel.bindStore(store[, transform])`

> Stability: 1 - Experimental

* `store` {AsyncLocalStorage} context data ကို bind လုပ်မယ့် store
* `transform` {Function} store context မသတ်မှတ်မခင် context data ကို ပြောင်းလဲ (transform) ပေးမယ့် function

[`channel.runStores(context, ...)`][] ကို ခေါ်လိုက်တဲ့အခါ — ပေးထားတဲ့ context data ကို ချန်နယ်နဲ့ bind လုပ်ထားတဲ့ store တိုင်းဆီ အသုံးချ (apply) ပါလိမ့်မယ်။ Store ကို အရင်ကတည်းက bind လုပ်ထားပြီးသားဆိုရင် — အရင်က `transform` function ကို အသစ်တစ်ခုနဲ့ အစားထိုးလိုက်ပါလိမ့်မယ်။ `transform` function ကို ချန်လှပ်ထားပြီး — ပေးထားတဲ့ context data ကိုပဲ context အနေနဲ့ တိုက်ရိုက် သတ်မှတ်ပေးလို့လည်း ရပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (data) => {
  return { data };
});
```

#### `channel.unbindStore(store)`

> Stability: 1 - Experimental

* `store` {AsyncLocalStorage} ချန်နယ်ကနေ unbind လုပ်မယ့် store
* Returns: {boolean} store ကို တွေ့ရှိခဲ့ရင် `true`၊ မဟုတ်ရင် `false` ဖြစ်သည်။

[`channel.bindStore(store)`][] နဲ့ အရင်က ဒီချန်နယ်ဆီ bind လုပ်ထားခဲ့တဲ့ store တစ်ခုကို ဖယ်ရှား (unbind) လုပ်ပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store);
channel.unbindStore(store);
```

#### `channel.runStores(context, fn[, thisArg[, ...args]])`

> Stability: 1 - Experimental

* `context` {any} subscribers တွေဆီ ပို့ပြီး stores တွေနဲ့ bind လုပ်မယ့် message
* `fn` {Function} ဝင်ရောက်ထားတဲ့ storage context အတွင်းမှာ run လုပ်မယ့် handler
* `thisArg` {any} function call အတွက် သုံးမယ့် receiver
* `...args` {any} function ဆီ ပေးပို့မယ့် optional arguments

ပေးထားတဲ့ function ရဲ့ ကြာချိန် (duration) အတွင်း — ပေးထားတဲ့ data ကို ချန်နယ်နဲ့ bind လုပ်ထားတဲ့ AsyncLocalStorage instances တွေဆီ အသုံးချပြီး — အဲဒီ data က stores တွေဆီ အသုံးချထားတဲ့ scope အတွင်းမှာ ချန်နယ်ဆီ publish လုပ်ပါတယ်။

[`channel.bindStore(store)`][] ဆီ transform function တစ်ခု ပေးထားခဲ့ရင် — message data က store အတွက် context value မဖြစ်လာခင် အဲဒီ function ကို အသုံးချပြီး message data ကို ပြောင်းလဲပေးမှာ ဖြစ်ပါတယ်။ Context linking (ဆက်စပ် ချိတ်ဆက်မှု) လိုအပ်တဲ့ ကိစ္စတွေမှာ — အရင်က storage context ကို transform function အတွင်းကနေ ဝင်ရောက် ရယူနိုင်ပါတယ်။

Store ဆီ အသုံးချလိုက်တဲ့ context က — ပေးထားတဲ့ function အတွင်း စတင်ခဲ့တဲ့ execution ကနေ ဆက်လက် လည်ပတ်တဲ့ async code မှန်သမျှထဲမှာ ဝင်ရောက် ရယူနိုင်သင့်ပါတယ်။ ဒါပေမယ့် [context loss][] ဖြစ်နိုင်တဲ့ အခြေအနေအချို့လည်း ရှိပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();

const channel = diagnostics_channel.channel('my-channel');

channel.bindStore(store, (message) => {
  const parent = store.getStore();
  return new Span(message, parent);
});
channel.runStores({ some: 'message' }, () => {
  store.getStore(); // Span({ some: 'message' })
});
```

#### `channel.withStoreScope(data)`

> Stability: 1 - Experimental

* `data` {any} stores တွေနဲ့ bind လုပ်မယ့် message
* Returns: {RunStoresScope} disposable scope (သုံးပြီး စွန့်ပစ်နိုင်သော scope) object

ပေးထားတဲ့ data ကို ချန်နယ်နဲ့ bind ထားတဲ့ AsyncLocalStorage instances တွေဆီ bind လုပ်ပြီး — subscribers တွေဆီ publish လုပ်ပေးတဲ့ disposable scope တစ်ခုကို ဖန်တီးပါတယ်။ Scope ကို စွန့်ပစ်လိုက်တဲ့အခါ — အရင်က storage contexts တွေကို အလိုအလျောက် ပြန်လည် သတ်မှတ်ပေးပါတယ်။

ဒီ method က JavaScript ရဲ့ explicit resource management (ထင်ရှားစွာ resource စီမံခန့်ခွဲခြင်း — `Symbol.dispose` နဲ့ `using` syntax) ကို သုံးပြီး — closure wrapping တွေ မလိုဘဲ store contexts တွေကို စီမံခန့်ခွဲနိုင်စေပါတယ်။

```mjs
import { channel } from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const store = new AsyncLocalStorage();
const ch = channel('my-channel');

ch.bindStore(store, (message) => {
  return { ...message, timestamp: Date.now() };
});

{
  using scope = ch.withStoreScope({ request: 'data' });
  // Store is entered, data is published
  console.log(store.getStore()); // { request: 'data', timestamp: ... }
}
// Store is automatically restored on scope exit
```

```cjs
const { channel } = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const store = new AsyncLocalStorage();
const ch = channel('my-channel');

ch.bindStore(store, (message) => {
  return { ...message, timestamp: Date.now() };
});

{
  using scope = ch.withStoreScope({ request: 'data' });
  // Store is entered, data is published
  console.log(store.getStore()); // { request: 'data', timestamp: ... }
}
// Store is automatically restored on scope exit
```

### Class: `RunStoresScope`

> Stability: 1 - Experimental

`RunStoresScope` class က [`channel.withStoreScope(data)`][] က ဖန်တီးလိုက်တဲ့ disposable scope တစ်ခုကို ကိုယ်စားပြုပါတယ်။ ဒါက store contexts တွေရဲ့ lifecycle ကို စီမံခန့်ခွဲပြီး — scope ထွက်သွားတဲ့အခါ သူတို့ကို စနစ်တကျ ပြန်လည် သတ်မှတ်ပေးကြောင်း အာမခံပါတယ်။

Scope ကို စနစ်တကျ စွန့်ပစ်နိုင်ဖို့ — `using` syntax နဲ့ပဲ သုံးရပါမယ်။

### Class: `TracingChannel`

> Stability: 2 - Stable

`TracingChannel` class က — အတူတကွ ပေါင်းစပ်ပြီး traceable action တစ်ခုတည်းကို ဖော်ပြတဲ့ — [TracingChannel Channels][] အစုအဝေး တစ်ခုပါ။ Application flow တွေကို trace လုပ်ဖို့ events တွေ ထုတ်လုပ်တဲ့ လုပ်ငန်းစဉ်ကို တရားဝင် စနစ်ကျအောင် (formalize) လုပ်ပြီး ရိုးရှင်းအောင် လုပ်ဖို့ သုံးပါတယ်။ `TracingChannel` တစ်ခုကို တည်ဆောက်ဖို့ [`diagnostics_channel.tracingChannel()`][] ကို သုံးပါတယ်။ `Channel` လိုပဲ — `TracingChannel` တွေကို dynamically ဖန်တီးနေမယ့်အစား — file ရဲ့ top-level မှာ တစ်ခုတည်းကို ဖန်တီးပြီး ပြန်လည် သုံးစွဲဖို့ အကြံပြုပါတယ်။

#### `tracingChannel.subscribe(subscribers)`

* `subscribers` {Object} [TracingChannel Channels][] ရဲ့ subscribers အစုအဝေး
  * `start` {Function} [`start` event][] အတွက် subscriber
  * `end` {Function} [`end` event][] အတွက် subscriber
  * `asyncStart` {Function} [`asyncStart` event][] အတွက် subscriber
  * `asyncEnd` {Function} [`asyncEnd` event][] အတွက် subscriber
  * `error` {Function} [`error` event][] အတွက် subscriber

Functions အစုအဝေး တစ်ခုကို သက်ဆိုင်ရာ channels တွေဆီ subscribe လုပ်ဖို့ ကူညီပေးတဲ့ helper တစ်ခုပါ။ ဒါက [`channel.subscribe(onMessage)`][] ကို channel တစ်ခုချင်းစီပေါ်မှာ တစ်ခုချင်း ခေါ်တာနဲ့ အတူတူပဲ ဖြစ်ပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.subscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

#### `tracingChannel.unsubscribe(subscribers)`

* `subscribers` {Object} [TracingChannel Channels][] ရဲ့ subscribers အစုအဝေး
  * `start` {Function} [`start` event][] အတွက် subscriber
  * `end` {Function} [`end` event][] အတွက် subscriber
  * `asyncStart` {Function} [`asyncStart` event][] အတွက် subscriber
  * `asyncEnd` {Function} [`asyncEnd` event][] အတွက် subscriber
  * `error` {Function} [`error` event][] အတွက် subscriber
* Returns: {boolean} handlers အားလုံးကို အောင်မြင်စွာ unsubscribe လုပ်နိုင်ခဲ့ရင် `true`၊ မဟုတ်ရင် `false` ဖြစ်သည်။

Functions အစုအဝေး တစ်ခုကို သက်ဆိုင်ရာ channels တွေကနေ unsubscribe လုပ်ဖို့ ကူညီပေးတဲ့ helper တစ်ခုပါ။ ဒါက [`channel.unsubscribe(onMessage)`][] ကို channel တစ်ခုချင်းစီပေါ်မှာ တစ်ခုချင်း ခေါ်တာနဲ့ အတူတူပဲ ဖြစ်ပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.unsubscribe({
  start(message) {
    // Handle start message
  },
  end(message) {
    // Handle end message
  },
  asyncStart(message) {
    // Handle asyncStart message
  },
  asyncEnd(message) {
    // Handle asyncEnd message
  },
  error(message) {
    // Handle error message
  },
});
```

#### `tracingChannel.traceSync(fn[, context[, thisArg[, ...args]]])`

* `fn` {Function} trace ပတ်ပိုက်မယ့် (wrap) function
* `context` {Object} events တွေကို ဆက်စပ် ချိတ်ဆက်ဖို့ မျှဝေသုံးတဲ့ object
* `thisArg` {any} function call အတွက် သုံးမယ့် receiver
* `...args` {any} function ဆီ ပေးပို့မယ့် optional arguments
* Returns: {any} ပေးထားတဲ့ function ရဲ့ return value (ပြန်ပေးတန်ဖိုး)

Synchronous function call တစ်ခုကို trace လုပ်ပါတယ်။ ဒါက execution ရဲ့ ပတ်လည်မှာ [`start` event][] နဲ့ [`end` event][] တွေကို အမြဲတမ်း ထုတ်လုပ်ပြီး — ပေးထားတဲ့ function က error တစ်ခု throw လုပ်မိရင် [`error` event][] တစ်ခုကိုလည်း ထုတ်လုပ်နိုင်ပါတယ်။ ဒါက `start` channel ပေါ်မှာ [`channel.runStores(context, ...)`][] ကို သုံးပြီး ပေးထားတဲ့ function ကို run ပေးတာမို့ — events အားလုံးမှာ ဒီ trace context နဲ့ ကိုက်ညီအောင် သတ်မှတ်ထားတဲ့ bound stores တွေ ရှိနေပါတယ်။

မှန်ကန်တဲ့ trace graphs တွေပဲ ဖြစ်ပေါ်စေဖို့ — trace မစတင်ခင် subscribers တွေ ရှိနေမှသာ events တွေကို publish လုပ်ပါတယ်။ Trace စတင်ပြီးမှ ထပ်ထည့်လိုက်တဲ့ subscriptions တွေက အဲဒီ trace ကနေ နောက်ပိုင်း events တွေကို လက်ခံရရှိမှာ မဟုတ်ပါဘူး — နောက် traces တွေကနေပဲ မြင်ရမှာ ဖြစ်ပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceSync(() => {
  // Do something
}, {
  some: 'thing',
});
```

#### `tracingChannel.tracePromise(fn[, context[, thisArg[, ...args]]])`

* `fn` {Function} trace ပတ်ပိုက်မယ့် function
* `context` {Object} trace events တွေကို ဆက်စပ် ချိတ်ဆက်ဖို့ မျှဝေသုံးတဲ့ object
* `thisArg` {any} function call အတွက် သုံးမယ့် receiver
* `...args` {any} function ဆီ ပေးပို့မယ့် optional arguments
* Returns: {any} ပေးထားတဲ့ function ရဲ့ return value။ Return value က Promise (သို့) thenable ဆိုရင် — ဒါ settle ဖြစ်တဲ့အခါ tracing events တွေကို publish လုပ်ပါတယ်။ Return value က Promise (သို့) thenable မဟုတ်ဘူးဆိုရင်တော့ — မူလအတိုင်း ပြန်ပေးလိုက်ပြီး warning တစ်ခု emit လုပ်ပါတယ်။

{Promise} (သို့) [thenable object][] ပြန်ပေးတဲ့ asynchronous function call တစ်ခုကို trace လုပ်ပါတယ်။ ဒါက function execution ရဲ့ synchronous အပိုင်းရဲ့ ပတ်လည်မှာ [`start` event][] နဲ့ [`end` event][] တွေကို အမြဲတမ်း ထုတ်လုပ်ပြီး — ပြန်ပေးလိုက်တဲ့ promise က resolved (သို့) rejected ဖြစ်တဲ့အခါ [`asyncStart` event][] နဲ့ [`asyncEnd` event][] တွေကို ထုတ်လုပ်ပါတယ်။ ပေးထားတဲ့ function က error တစ်ခု throw လုပ်မိရင် (သို့) ပြန်ပေးလိုက်တဲ့ promise က rejected ဖြစ်သွားရင် [`error` event][] တစ်ခုကိုလည်း ထုတ်လုပ်နိုင်ပါတယ်။ ဒါက `start` channel ပေါ်မှာ [`channel.runStores(context, ...)`][] ကို သုံးပြီး ပေးထားတဲ့ function ကို run ပေးတာမို့ — events အားလုံးမှာ ဒီ trace context နဲ့ ကိုက်ညီအောင် သတ်မှတ်ထားတဲ့ bound stores တွေ ရှိနေပါတယ်။

`fn` က ပြန်ပေးတဲ့ တန်ဖိုးက Promise (သို့) thenable မဟုတ်ဘူးဆိုရင် — warning တစ်ခုနဲ့အတူ ပြန်ပေးလိုက်ပြီး `asyncStart` (သို့) `asyncEnd` events တွေ ထုတ်လုပ်ပေးမှာ မဟုတ်ပါဘူး။

မှန်ကန်တဲ့ trace graphs တွေပဲ ဖြစ်ပေါ်စေဖို့ — trace မစတင်ခင် subscribers တွေ ရှိနေမှသာ events တွေကို publish လုပ်ပါတယ်။ Trace စတင်ပြီးမှ ထပ်ထည့်လိုက်တဲ့ subscriptions တွေက အဲဒီ trace ကနေ နောက်ပိုင်း events တွေကို လက်ခံရရှိမှာ မဟုတ်ပါဘူး — နောက် traces တွေကနေပဲ မြင်ရမှာ ဖြစ်ပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.tracePromise(async () => {
  // Do something
}, {
  some: 'thing',
});
```

#### `tracingChannel.traceCallback(fn[, position[, context[, thisArg[, ...args]]]])`

* `fn` {Function} trace ပတ်ပိုက်မယ့် callback သုံးတဲ့ function
* `position` {number} မျှော်လင့်ထားတဲ့ callback ရဲ့ zero-indexed argument နေရာ (`undefined` ပေးလိုက်ရင် နောက်ဆုံး argument ကို default အနေနဲ့ ယူပါတယ်)
* `context` {Object} trace events တွေကို ဆက်စပ် ချိတ်ဆက်ဖို့ မျှဝေသုံးတဲ့ object (`undefined` ပေးလိုက်ရင် `{}` ကို default အနေနဲ့ ယူပါတယ်)
* `thisArg` {any} function call အတွက် သုံးမယ့် receiver
* `...args` {any} function ဆီ ပေးပို့မယ့် arguments (callback ပါဝင်ရပါမယ်)
* Returns: {any} ပေးထားတဲ့ function ရဲ့ return value

Callback ကို လက်ခံတဲ့ function call တစ်ခုကို trace လုပ်ပါတယ်။ Callback က ပုံမှန် အသုံးပြုလေ့ရှိတဲ့ error-ပထမ-argument (error first) convention အတိုင်း လိုက်နာဖို့ မျှော်လင့်ပါတယ်။ ဒါက function execution ရဲ့ synchronous အပိုင်းရဲ့ ပတ်လည်မှာ [`start` event][] နဲ့ [`end` event][] တွေကို အမြဲတမ်း ထုတ်လုပ်ပြီး — callback execution ရဲ့ ပတ်လည်မှာ [`asyncStart` event][] နဲ့ [`asyncEnd` event][] တွေကို ထုတ်လုပ်ပါတယ်။ ပေးထားတဲ့ function က throw လုပ်မိရင် (သို့) callback ဆီ ပေးလိုက်တဲ့ ပထမ argument က သတ်မှတ်ထားရင် — [`error` event][] တစ်ခုကိုလည်း ထုတ်လုပ်နိုင်ပါတယ်။ ဒါက `start` channel ပေါ်မှာ [`channel.runStores(context, ...)`][] ကို သုံးပြီး ပေးထားတဲ့ function ကို run ပေးတာမို့ — events အားလုံးမှာ ဒီ trace context နဲ့ ကိုက်ညီအောင် သတ်မှတ်ထားတဲ့ bound stores တွေ ရှိနေပါတယ်။

မှန်ကန်တဲ့ trace graphs တွေပဲ ဖြစ်ပေါ်စေဖို့ — trace မစတင်ခင် subscribers တွေ ရှိနေမှသာ events တွေကို publish လုပ်ပါတယ်။ Trace စတင်ပြီးမှ ထပ်ထည့်လိုက်တဲ့ subscriptions တွေက အဲဒီ trace ကနေ နောက်ပိုင်း events တွေကို လက်ခံရရှိမှာ မဟုတ်ပါဘူး — နောက် traces တွေကနေပဲ မြင်ရမှာ ဖြစ်ပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

channels.traceCallback((arg1, callback) => {
  // Do something
  callback(null, 'result');
}, 1, {
  some: 'thing',
}, thisArg, arg1, callback);
```

Callback ကိုလည်း [`channel.runStores(context, ...)`][] နဲ့ run ပေးတာမို့ — အချို့ကိစ္စတွေမှာ context loss ကနေ ပြန်လည် ကောင်းမွန်အောင် (recovery) လုပ်နိုင်ပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';
import { AsyncLocalStorage } from 'node:async_hooks';

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');
const { AsyncLocalStorage } = require('node:async_hooks');

const channels = diagnostics_channel.tracingChannel('my-channel');
const myStore = new AsyncLocalStorage();

// The start channel sets the initial store data to something
// and stores that store data value on the trace context object
channels.start.bindStore(myStore, (data) => {
  const span = new Span(data);
  data.span = span;
  return span;
});

// Then asyncStart can restore from that data it stored previously
channels.asyncStart.bindStore(myStore, (data) => {
  return data.span;
});
```

#### `tracingChannel.hasSubscribers`

* Returns: {boolean} channels တစ်ခုချင်းစီထဲက တစ်ခုခုမှာ subscriber ရှိနေရင် `true`၊ မရှိရင် `false` ဖြစ်သည်။

[`TracingChannel`][] instance တစ်ခုပေါ်မှာ ရနိုင်တဲ့ helper method တစ်ခု ဖြစ်ပြီး — [TracingChannel Channels][] တစ်ခုခုမှာ subscribers ရှိမရှိ စစ်ဆေးပါတယ်။ သူတို့ထဲက တစ်ခုခုမှာ အနည်းဆုံး subscriber တစ်ယောက် ရှိနေရင် `true` ပြန်ပေးပြီး — မဟုတ်ရင် `false` ပြန်ပေးပါတယ်။

```mjs
import diagnostics_channel from 'node:diagnostics_channel';

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```

```cjs
const diagnostics_channel = require('node:diagnostics_channel');

const channels = diagnostics_channel.tracingChannel('my-channel');

if (channels.hasSubscribers) {
  // Do something
}
```

### Class: `BoundedChannel`

> Stability: 1 - Experimental

`BoundedChannel` class က synchronous operations တွေကိုပဲ trace လုပ်တဲ့ [`TracingChannel`][] ရဲ့ ရိုးရှင်းတဲ့ ဗားရှင်း တစ်ခုပါ။ သူ့မှာ channels ငါးခုအစား နှစ်ခု (`start` နဲ့ `end`) ပဲ ပါဝင်ပြီး — `asyncStart`, `asyncEnd`, နဲ့ `error` events တွေကို ချန်လှပ်ထားပါတယ်။ ဒါကြောင့် asynchronous continuations (သို့) error handling တွေ မပါဝင်တဲ့ operations တွေကို trace လုပ်ဖို့ သင့်တော်ပါတယ်။

`TracingChannel` လိုပဲ — `BoundedChannel` တွေကို dynamically ဖန်တီးနေမယ့်အစား — file ရဲ့ top-level မှာ တစ်ခုတည်းကို ဖန်တီးပြီး ပြန်လည် သုံးစွဲဖို့ အကြံပြုပါတယ်။

#### `boundedChannel.hasSubscribers`

* Returns: {boolean} channels တစ်ခုချင်းစီထဲက တစ်ခုခုမှာ subscriber ရှိနေရင် `true`၊ မရှိရင် `false` ဖြစ်သည်။

`start` (သို့) `end` channels တစ်ခုခုမှာ subscribers ရှိမရှိ စစ်ဆေးပါတယ်။

```mjs
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

if (wc.hasSubscribers) {
  // There are subscribers, perform traced operation
}
```

```cjs
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

if (wc.hasSubscribers) {
  // There are subscribers, perform traced operation
}
```

#### `boundedChannel.subscribe(handlers)`

* `handlers` {Object} ချန်နယ် subscribers အစုအဝေး
  * `start` {Function} start event အတွက် subscriber
  * `end` {Function} end event အတွက် subscriber

Bounded channel events တွေကို subscribe လုပ်ပါတယ်။ ဒါက [`channel.subscribe(onMessage)`][] ကို channel တစ်ခုချင်းစီပေါ်မှာ တစ်ခုချင်း ခေါ်တာနဲ့ ညီမျှပါတယ်။

```mjs
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

wc.subscribe({
  start(message) {
    // Handle start
  },
  end(message) {
    // Handle end
  },
});
```

```cjs
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

wc.subscribe({
  start(message) {
    // Handle start
  },
  end(message) {
    // Handle end
  },
});
```

#### `boundedChannel.unsubscribe(handlers)`

* `handlers` {Object} ချန်နယ် subscribers အစုအဝေး
  * `start` {Function} start event အတွက် subscriber
  * `end` {Function} end event အတွက် subscriber
* Returns: {boolean} handlers အားလုံးကို အောင်မြင်စွာ unsubscribe လုပ်နိုင်ခဲ့ရင် `true`၊ မဟုတ်ရင် `false` ဖြစ်သည်။

Bounded channel events တွေကနေ unsubscribe လုပ်ပါတယ်။ ဒါက [`channel.unsubscribe(onMessage)`][] ကို channel တစ်ခုချင်းစီပေါ်မှာ တစ်ခုချင်း ခေါ်တာနဲ့ ညီမျှပါတယ်။

```mjs
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

const handlers = {
  start(message) {},
  end(message) {},
};

wc.subscribe(handlers);
wc.unsubscribe(handlers);
```

```cjs
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

const handlers = {
  start(message) {},
  end(message) {},
};

wc.subscribe(handlers);
wc.unsubscribe(handlers);
```

#### `boundedChannel.run(context, fn[, thisArg[, ...args]])`

* `context` {Object} events တွေကို ဆက်စပ် ချိတ်ဆက်ဖို့ မျှဝေသုံးတဲ့ object
* `fn` {Function} trace ပတ်ပိုက်မယ့် function
* `thisArg` {any} function call အတွက် သုံးမယ့် receiver
* `...args` {any} function ဆီ ပေးပို့မယ့် optional arguments
* Returns: {any} ပေးထားတဲ့ function ရဲ့ return value

Synchronous function call တစ်ခုကို trace လုပ်ပါတယ်။ ဒါက execution ရဲ့ ပတ်လည်မှာ `start` event နဲ့ `end` event တွေကို ထုတ်လုပ်ပါတယ်။ ဒါက `start` channel ပေါ်မှာ [`channel.runStores(context, ...)`][] ကို သုံးပြီး ပေးထားတဲ့ function ကို run ပေးတာမို့ — events အားလုံးမှာ ဒီ trace context နဲ့ ကိုက်ညီအောင် သတ်မှတ်ထားတဲ့ bound stores တွေ ရှိနေပါတယ်။

```mjs
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

const result = wc.run({ operationId: '123' }, () => {
  // Perform operation
  return 42;
});
```

```cjs
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

const result = wc.run({ operationId: '123' }, () => {
  // Perform operation
  return 42;
});
```

#### `boundedChannel.withScope([context])`

* `context` {Object} events တွေကို ဆက်စပ် ချိတ်ဆက်ဖို့ မျှဝေသုံးတဲ့ object
* Returns: {BoundedChannelScope} disposable scope object

JavaScript ရဲ့ explicit resource management (`using` syntax) ကို သုံးပြီး — synchronous operation တစ်ခုကို trace လုပ်ဖို့ disposable scope တစ်ခုကို ဖန်တီးပါတယ်။ Scope က `start` နဲ့ `end` events တွေကို အလိုအလျောက် publish လုပ်ပြီး — bound stores တွေကို ဝင်ရောက်စေကာ — စွန့်ပစ်လိုက်တဲ့အခါ cleanup (ရှင်းလင်းခြင်း) ကိုပါ ကိုင်တွယ်ပေးပါတယ်။

```mjs
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

const context = { operationId: '123' };
{
  using scope = wc.withScope(context);
  // Stores are entered, start event is published

  // Perform work and set result on context
  context.result = 42;
}
// End event is published, stores are restored automatically
```

```cjs
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

const context = { operationId: '123' };
{
  using scope = wc.withScope(context);
  // Stores are entered, start event is published

  // Perform work and set result on context
  context.result = 42;
}
// End event is published, stores are restored automatically
```

### Class: `BoundedChannelScope`

> Stability: 1 - Experimental

`BoundedChannelScope` class က [`boundedChannel.withScope(context)`][] က ဖန်တီးလိုက်တဲ့ disposable scope တစ်ခုကို ကိုယ်စားပြုပါတယ်။ ဒါက trace လုပ်ထားတဲ့ operation တစ်ခုရဲ့ lifecycle ကို စီမံခန့်ခွဲပြီး — events တွေကို အလိုအလျောက် publish လုပ်ကာ store contexts တွေကိုပါ စီမံခန့်ခွဲပေးပါတယ်။

Scope ကို စနစ်တကျ စွန့်ပစ်နိုင်ဖို့ — `using` syntax နဲ့ပဲ သုံးရပါမယ်။

```mjs
import { boundedChannel } from 'node:diagnostics_channel';

const wc = boundedChannel('my-operation');

const context = {};
{
  using scope = wc.withScope(context);
  // Start event is published, stores are entered
  context.result = performOperation();
  // End event is automatically published at end of block
}
```

```cjs
const { boundedChannel } = require('node:diagnostics_channel');

const wc = boundedChannel('my-operation');

const context = {};
{
  using scope = wc.withScope(context);
  // Start event is published, stores are entered
  context.result = performOperation();
  // End event is automatically published at end of block
}
```

### BoundedChannel Channels (BoundedChannel ၏ ချန်နယ်များ)

`BoundedChannel` တစ်ခုက — `using` syntax နဲ့ ဖန်တီးထားတဲ့ scope တစ်ခုရဲ့ lifecycle ကို ကိုယ်စားပြုတဲ့ — diagnostics channels နှစ်ခု ပါဝင်ပါတယ်:

* `tracing:${name}:start` - `using` statement execute လုပ်တဲ့အခါ (scope ဖန်တီးချိန်) publish လုပ်ပါတယ်
* `tracing:${name}:end` - block ကနေ ထွက်တဲ့အခါ (scope စွန့်ပစ်ချိန်) publish လုပ်ပါတယ်

`using` syntax ကို \[`boundedChannel.withScope([context])`]\[], နဲ့ တွဲသုံးတဲ့အခါ — statement execute လုပ်တာနဲ့ `start` event ကို ချက်ချင်း publish လုပ်ပြီး — block ရဲ့ အဆုံးမှာ disposal ဖြစ်တဲ့အခါ `end` event ကို အလိုအလျောက် publish လုပ်ပါတယ်။ Events အားလုံးက context object တစ်ခုတည်းကို မျှဝေသုံးပြီး — scope execution အတွင်းမှာ `result` လိုမျိုး ထပ်ဆောင်း properties တွေနဲ့ တိုးချဲ့လို့လည်း ရပါတယ်။

### TracingChannel Channels (TracingChannel ၏ ချန်နယ်များ)

`TracingChannel` ဆိုတာ — traceable action တစ်ခုတည်းရဲ့ execution lifecycle ထဲက သတ်မှတ်ထားတဲ့ အချက်များ (specific points) တွေကို ကိုယ်စားပြုတဲ့ — diagnostics channels အများအပြားရဲ့ အစုအဝေး တစ်ခုပါ။ အပြုအမူကို `start`, `end`, `asyncStart`, `asyncEnd`, နဲ့ `error` တို့ ပါဝင်တဲ့ diagnostics channels ငါးခုအဖြစ် ခွဲထားပါတယ်။ Traceable action တစ်ခုတည်းက events အားလုံးကြားမှာ event object တစ်ခုတည်းကို မျှဝေသုံးပါတယ် — ဒါက weakmap တစ်ခုကနေတစ်ဆင့် correlation (ဆက်စပ်ချိတ်ဆက်မှု) ကို စီမံခန့်ခွဲဖို့ အသုံးဝင်နိုင်ပါတယ်။

Task တစ်ခု "ပြီးဆုံး" (completes) သွားတဲ့အခါ — ဒီ event objects တွေကို `result` (သို့) `error` တန်ဖိုးတွေနဲ့ တိုးချဲ့ပေးပါလိမ့်မယ်။ Synchronous task တစ်ခုရဲ့ ကိစ္စမှာ `result` က return value ဖြစ်ပြီး — `error` ကတော့ function ကနေ throw လုပ်လိုက်တဲ့ ဘယ်အရာမဆို ဖြစ်ပါလိမ့်မယ်။ Callback-based async functions တွေမှာ `result` က callback ရဲ့ ဒုတိယ argument ဖြစ်ပြီး — `error` ကတော့ `end` event ထဲမှာ မြင်ရတဲ့ thrown error (သို့) `asyncStart` (သို့) `asyncEnd` events နှစ်ခုအနက် တစ်ခုခုမှာ ပါဝင်တဲ့ callback ရဲ့ ပထမ argument ဖြစ်ပါလိမ့်မယ်။

မှန်ကန်တဲ့ trace graphs တွေပဲ ဖြစ်ပေါ်စေဖို့ — trace မစတင်ခင် subscribers တွေ ရှိနေမှသာ events တွေကို publish လုပ်သင့်ပါတယ်။ Trace စတင်ပြီးမှ ထပ်ထည့်လိုက်တဲ့ subscriptions တွေက အဲဒီ trace ကနေ နောက်ပိုင်း events တွေကို လက်ခံရရှိသင့်မှာ မဟုတ်ပါဘူး — နောက် traces တွေကနေပဲ မြင်ရမှာ ဖြစ်ပါတယ်။

Tracing channels တွေက အောက်ပါ နာမည်ပေးခြင်း ပုံစံ (naming pattern) ကို လိုက်နာသင့်ပါတယ်:

* `tracing:module.class.method:start` or `tracing:module.function:start`
* `tracing:module.class.method:end` or `tracing:module.function:end`
* `tracing:module.class.method:asyncStart` or `tracing:module.function:asyncStart`
* `tracing:module.class.method:asyncEnd` or `tracing:module.function:asyncEnd`
* `tracing:module.class.method:error` or `tracing:module.function:error`

#### `start(event)`

* Name: `tracing:${name}:start`

`start` event က function တစ်ခုကို ခေါ်လိုက်တဲ့ အချိန်မှတ် (point) ကို ကိုယ်စားပြုပါတယ်။ ဒီအချိန်မှာ event data ထဲမှာ function arguments တွေ (သို့) function ရဲ့ execution အစပိုင်းမှာ ရရှိနိုင်တဲ့ တခြား အရာမှန်သမျှ ပါဝင်နိုင်ပါတယ်။

#### `end(event)`

* Name: `tracing:${name}:end`

`end` event က function call တစ်ခု တန်ဖိုးတစ်ခု ပြန်ပေးလိုက်တဲ့ အချိန်မှတ်ကို ကိုယ်စားပြုပါတယ်။ Async function တစ်ခုရဲ့ ကိစ္စမှာ ဒါက — function ကိုယ်တိုင် အတွင်းပိုင်းမှာ return statement လုပ်လိုက်တဲ့ အချိန် မဟုတ်ဘဲ — ပြန်ပေးလိုက်တဲ့ promise ရဲ့ အချိန်ကို ဆိုလိုပါတယ်။ ဒီအချိန်မှာ trace လုပ်ထားတဲ့ function က synchronous ဖြစ်ခဲ့ရင် — `result` field ကို function ရဲ့ return value အနေနဲ့ သတ်မှတ်ပေးပါလိမ့်မယ်။ တနည်းအားဖြင့် — throw လုပ်လိုက်တဲ့ errors တွေကို ကိုယ်စားပြုဖို့ `error` field လည်း ရှိနေနိုင်ပါတယ်။

Traceable action တစ်ခုက errors အများအပြား ထုတ်လုပ်နိုင်တာမို့ — errors တွေကို ခြေရာခံဖို့ `error` event ကိုပဲ အထူး နားထောင်ဖို့ (listen) အကြံပြုပါတယ်။ ဥပမာ — မအောင်မြင်တဲ့ async task တစ်ခုက သူ့ရဲ့ sync အပိုင်း မတိုင်ခင် အတွင်းပိုင်းကနေ စတင်ခဲ့ပြီး — နောက်ပိုင်းမှာ error တစ်ခု throw လုပ်မိတာမျိုး ဖြစ်နိုင်ပါတယ်။

#### `asyncStart(event)`

* Name: `tracing:${name}:asyncStart`

`asyncStart` event က traceable function တစ်ခုရဲ့ callback (သို့) continuation ဆီ ရောက်ရှိသွားတာကို ကိုယ်စားပြုပါတယ်။ ဒီအချိန်မှာ callback arguments တွေလိုမျိုး (သို့) action ရဲ့ "result" ကို ဖော်ပြတဲ့ တခြားအရာမှန်သမျှ ရရှိနိုင်ပါတယ်။

Callback-based functions တွေမှာ callback ရဲ့ ပထမ argument ကို — `undefined` (သို့) `null` မဟုတ်ဘူးဆိုရင် — `error` field ဆီ သတ်မှတ်ပေးပြီး — ဒုတိယ argument ကို `result` field ဆီ သတ်မှတ်ပေးပါလိမ့်မယ်။

Promises တွေမှာ `resolve` လမ်းကြောင်းရဲ့ argument ကို `result` ဆီ သတ်မှတ်ပေးပြီး — (သို့) `reject` လမ်းကြောင်းရဲ့ argument ကို `error` ဆီ သတ်မှတ်ပေးပါလိမ့်မယ်။

Traceable action တစ်ခုက errors အများအပြား ထုတ်လုပ်နိုင်တာမို့ — errors တွေကို ခြေရာခံဖို့ `error` event ကိုပဲ အထူး နားထောင်ဖို့ အကြံပြုပါတယ်။ ဥပမာ — မအောင်မြင်တဲ့ async task တစ်ခုက သူ့ရဲ့ sync အပိုင်း မတိုင်ခင် အတွင်းပိုင်းကနေ စတင်ခဲ့ပြီး — နောက်ပိုင်းမှာ error တစ်ခု throw လုပ်မိတာမျိုး ဖြစ်နိုင်ပါတယ်။

#### `asyncEnd(event)`

* Name: `tracing:${name}:asyncEnd`

`asyncEnd` event က asynchronous function တစ်ခုရဲ့ callback ပြန်လာခြင်း (returning) ကို ကိုယ်စားပြုပါတယ်။ `asyncStart` event ပြီးနောက်မှာ event data တွေ ပြောင်းလဲဖို့ များသောအားဖြင့် မရှိပေမယ့် — callback ပြီးဆုံးတဲ့ အချိန်မှတ်ကို မြင်ရတာက အသုံးဝင်နိုင်ပါတယ်။

#### `error(event)`

* Name: `tracing:${name}:error`

`error` event က traceable function က ထုတ်လုပ်လိုက်တဲ့ error တစ်ခုခုကို — synchronously ဖြစ်စေ asynchronously ဖြစ်စေ — ကိုယ်စားပြုပါတယ်။ Trace လုပ်ထားတဲ့ function ရဲ့ synchronous အပိုင်းမှာ error တစ်ခု throw ခံရရင် — error ကို event ရဲ့ `error` field ဆီ သတ်မှတ်ပြီး `error` event ကို trigger လုပ်ပါတယ်။ Callback (သို့) promise rejection တစ်ခုကနေတစ်ဆင့် error တစ်ခုကို asynchronously ရရှိခဲ့ရင်လည်း — event ရဲ့ `error` field ဆီ သတ်မှတ်ပြီး `error` event ကို trigger လုပ်ပါလိမ့်မယ်။

Traceable function call တစ်ခုတည်းကနေ errors တွေကို အကြိမ်များစွာ ထုတ်လုပ်နိုင်တာမို့ — ဒီ event ကို သုံးစွဲတဲ့အခါ ဒါကို ထည့်သွင်း စဉ်းစားသင့်ပါတယ်။ ဥပမာ — တခြား async task တစ်ခုကို အတွင်းပိုင်းကနေ trigger လုပ်မိပြီး အဲဒါ မအောင်မြင်ဘဲ — function ရဲ့ sync အပိုင်းက error တစ်ခု နောက်ထပ် throw လုပ်မိရင် — `error` events နှစ်ခု emit လုပ်ပါလိမ့်မယ်။ Sync error အတွက် တစ်ခုနဲ့ async error အတွက် တစ်ခုပါ။

### Built-in Channels (built-in ချန်နယ်များ)

#### Console

> Stability: 1 - Experimental

##### Event: `'console.log'`

* `args` {any\[]}

`console.log()` ကို ခေါ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ `console.log()` ဆီ ပေးလိုက်တဲ့ arguments တွေရဲ့ array တစ်ခုကို လက်ခံရရှိပါတယ်။

##### Event: `'console.info'`

* `args` {any\[]}

`console.info()` ကို ခေါ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ `console.info()` ဆီ ပေးလိုက်တဲ့ arguments တွေရဲ့ array တစ်ခုကို လက်ခံရရှိပါတယ်။

##### Event: `'console.debug'`

* `args` {any\[]}

`console.debug()` ကို ခေါ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ `console.debug()` ဆီ ပေးလိုက်တဲ့ arguments တွေရဲ့ array တစ်ခုကို လက်ခံရရှိပါတယ်။

##### Event: `'console.warn'`

* `args` {any\[]}

`console.warn()` ကို ခေါ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ `console.warn()` ဆီ ပေးလိုက်တဲ့ arguments တွေရဲ့ array တစ်ခုကို လက်ခံရရှိပါတယ်။

##### Event: `'console.error'`

* `args` {any\[]}

`console.error()` ကို ခေါ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ `console.error()` ဆီ ပေးလိုက်တဲ့ arguments တွေရဲ့ array တစ်ခုကို လက်ခံရရှိပါတယ်။

#### HTTP

> Stability: 1 - Experimental

##### Event: `'http.client.request.created'`

* `request` {http.ClientRequest}

Client က request object တစ်ခု ဖန်တီးတဲ့အခါ emit လုပ်ပါတယ်။ `http.client.request.start` နဲ့ မတူဘဲ — ဒီ event က request ကို မပို့ရသေးခင် emit လုပ်ပါတယ်။

##### Event: `'http.client.request.start'`

* `request` {http.ClientRequest}

Client က request တစ်ခု စတင်တဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http.client.request.error'`

* `request` {http.ClientRequest}
* `error` {Error}

Client request တစ်ခု အတွင်းမှာ error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http.client.response.finish'`

* `request` {http.ClientRequest}
* `response` {http.IncomingMessage}

Client က response တစ်ခု လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http.server.request.start'`

* `request` {http.IncomingMessage}
* `response` {http.ServerResponse}
* `socket` {net.Socket}
* `server` {http.Server}

Server က request တစ်ခု လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http.server.response.created'`

* `request` {http.IncomingMessage}
* `response` {http.ServerResponse}

Server က response တစ်ခု ဖန်တီးတဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event က response ကို မပို့ခင် emit လုပ်ပါတယ်။

##### Event: `'http.server.response.finish'`

* `request` {http.IncomingMessage}
* `response` {http.ServerResponse}
* `socket` {net.Socket}
* `server` {http.Server}

Server က response တစ်ခု ပို့လိုက်တဲ့အခါ emit လုပ်ပါတယ်။

#### HTTP/2

> Stability: 1 - Experimental

##### Event: `'http2.client.stream.created'`

* `stream` {ClientHttp2Stream}
* `headers` {HTTP/2 Headers Object}

Client ပေါ်မှာ stream တစ်ခု ဖန်တီးတဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http2.client.stream.start'`

* `stream` {ClientHttp2Stream}
* `headers` {HTTP/2 Headers Object}

Client ပေါ်မှာ stream တစ်ခု စတင်တဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http2.client.stream.error'`

* `stream` {ClientHttp2Stream}
* `error` {Error}

Client ပေါ်မှာ stream တစ်ခုကို လုပ်ဆောင်နေစဉ် error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http2.client.stream.finish'`

* `stream` {ClientHttp2Stream}
* `headers` {HTTP/2 Headers Object}
* `flags` {number}

Client ပေါ်မှာ stream တစ်ခု လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http2.client.stream.bodyChunkSent'`

* `stream` {ClientHttp2Stream}
* `writev` {boolean}
* `data` {Buffer | string | Buffer\[] | Object\[]}
  * `chunk` {Buffer|string}
  * `encoding` {string}
* `encoding` {string}

Client stream ရဲ့ body တစ်စိတ်တစ်ပိုင်း (chunk) ကို ပို့နေတဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http2.client.stream.bodySent'`

* `stream` {ClientHttp2Stream}

Client stream ရဲ့ body ကို အပြည့်အဝ ပို့ပြီးသွားပြီးနောက် emit လုပ်ပါတယ်။

##### Event: `'http2.client.stream.close'`

* `stream` {ClientHttp2Stream}

Client ပေါ်မှာ stream တစ်ခု ပိတ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ Stream ကို ပိတ်တဲ့အခါ သုံးခဲ့တဲ့ HTTP/2 error code ကို `stream.rstCode` property နဲ့ ပြန်လည် ရယူနိုင်ပါတယ်။

##### Event: `'http2.server.stream.created'`

* `stream` {ServerHttp2Stream}
* `headers` {HTTP/2 Headers Object}

Server ပေါ်မှာ stream တစ်ခု ဖန်တီးတဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http2.server.stream.start'`

* `stream` {ServerHttp2Stream}
* `headers` {HTTP/2 Headers Object}

Server ပေါ်မှာ stream တစ်ခု စတင်တဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http2.server.stream.error'`

* `stream` {ServerHttp2Stream}
* `error` {Error}

Server ပေါ်မှာ stream တစ်ခုကို လုပ်ဆောင်နေစဉ် error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http2.server.stream.finish'`

* `stream` {ServerHttp2Stream}
* `headers` {HTTP/2 Headers Object}
* `flags` {number}

Server ပေါ်မှာ stream တစ်ခု ပို့လိုက်တဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'http2.server.stream.close'`

* `stream` {ServerHttp2Stream}

Server ပေါ်မှာ stream တစ်ခု ပိတ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ Stream ကို ပိတ်တဲ့အခါ သုံးခဲ့တဲ့ HTTP/2 error code ကို `stream.rstCode` property နဲ့ ပြန်လည် ရယူနိုင်ပါတယ်။

#### Modules

> Stability: 1 - Experimental

##### Event: `'tracing:module.require:start'`

* `event` {Object} အောက်ပါ properties များ ပါဝင်သည်
  * `id` `require()` ဆီ ပေးလိုက်တဲ့ argument — module ၏ နာမည် ဖြစ်သည်။
  * `parentFilename` require(id) လုပ်ဖို့ ကြိုးစားခဲ့တဲ့ module ၏ နာမည်

`require()` ကို execute လုပ်တဲ့အခါ emit လုပ်ပါတယ်။ [`start` event][] ကို ကြည့်ပါ။

##### Event: `'tracing:module.require:end'`

* `event` {Object} အောက်ပါ properties များ ပါဝင်သည်
  * `id` `require()` ဆီ ပေးလိုက်တဲ့ argument — module ၏ နာမည် ဖြစ်သည်။
  * `parentFilename` require(id) လုပ်ဖို့ ကြိုးစားခဲ့တဲ့ module ၏ နာမည်

`require()` call တစ်ခု ပြန်လာတဲ့အခါ emit လုပ်ပါတယ်။ [`end` event][] ကို ကြည့်ပါ။

##### Event: `'tracing:module.require:error'`

* `event` {Object} အောက်ပါ properties များ ပါဝင်သည်
  * `id` `require()` ဆီ ပေးလိုက်တဲ့ argument — module ၏ နာမည် ဖြစ်သည်။
  * `parentFilename` require(id) လုပ်ဖို့ ကြိုးစားခဲ့တဲ့ module ၏ နာမည်
* `error` {Error}

`require()` က error တစ်ခု throw လုပ်တဲ့အခါ emit လုပ်ပါတယ်။ [`error` event][] ကို ကြည့်ပါ။

##### Event: `'tracing:module.import:asyncStart'`

* `event` {Object} အောက်ပါ properties များ ပါဝင်သည်
  * `id` `import()` ဆီ ပေးလိုက်တဲ့ argument — module ၏ နာမည် ဖြစ်သည်။
  * `parentURL` import(id) လုပ်ဖို့ ကြိုးစားခဲ့တဲ့ module ၏ URL object

`import()` ကို ခေါ်ယူ (invoke) လုပ်တဲ့အခါ emit လုပ်ပါတယ်။ [`asyncStart` event][] ကို ကြည့်ပါ။

##### Event: `'tracing:module.import:asyncEnd'`

* `event` {Object} အောက်ပါ properties များ ပါဝင်သည်
  * `id` `import()` ဆီ ပေးလိုက်တဲ့ argument — module ၏ နာမည် ဖြစ်သည်။
  * `parentURL` import(id) လုပ်ဖို့ ကြိုးစားခဲ့တဲ့ module ၏ URL object

`import()` ပြီးဆုံးသွားတဲ့အခါ emit လုပ်ပါတယ်။ [`asyncEnd` event][] ကို ကြည့်ပါ။

##### Event: `'tracing:module.import:error'`

* `event` {Object} အောက်ပါ properties များ ပါဝင်သည်
  * `id` `import()` ဆီ ပေးလိုက်တဲ့ argument — module ၏ နာမည် ဖြစ်သည်။
  * `parentURL` import(id) လုပ်ဖို့ ကြိုးစားခဲ့တဲ့ module ၏ URL object
* `error` {Error}

`import()` က error တစ်ခု throw လုပ်တဲ့အခါ emit လုပ်ပါတယ်။ [`error` event][] ကို ကြည့်ပါ။

#### NET

> Stability: 1 - Experimental

##### Event: `'net.client.socket'`

* `socket` {net.Socket|tls.TLSSocket}

TCP (သို့) pipe client socket connection အသစ်တစ်ခု ဖန်တီးတဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'net.server.socket'`

* `socket` {net.Socket}

TCP (သို့) pipe connection အသစ်တစ်ခုကို လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'tracing:net.server.listen:asyncStart'`

* `server` {net.Server}
* `options` {Object}

[`net.Server.listen()`][] ကို ခေါ်ယူလိုက်တဲ့အခါ — port (သို့) pipe ကို တကယ် တပ်ဆင် (setup) မလုပ်ခင် — emit လုပ်ပါတယ်။

##### Event: `'tracing:net.server.listen:asyncEnd'`

* `server` {net.Server}

[`net.Server.listen()`][] ပြီးဆုံးသွားပြီး — server က connection တွေ လက်ခံဖို့ အသင့်ဖြစ်နေတဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'tracing:net.server.listen:error'`

* `server` {net.Server}
* `error` {Error}

[`net.Server.listen()`][] က error တစ်ခု ပြန်ပေးနေတဲ့အခါ emit လုပ်ပါတယ်။

#### UDP

> Stability: 1 - Experimental

##### Event: `'udp.socket'`

* `socket` {dgram.Socket}

UDP socket အသစ်တစ်ခု ဖန်တီးတဲ့အခါ emit လုပ်ပါတယ်။

#### Process

> Stability: 1 - Experimental

##### Event: `'child_process'`

* `process` {ChildProcess}

Process အသစ်တစ်ခု ဖန်တီးတဲ့အခါ emit လုပ်ပါတယ်။

`tracing:child_process.spawn:start`

* `process` {ChildProcess}
* `options` {Object}

[`child_process.spawn()`][] ကို ခေါ်ယူလိုက်တဲ့အခါ — process ကို တကယ် spawn မလုပ်ခင် — emit လုပ်ပါတယ်။

`tracing:child_process.spawn:end`

* `process` {ChildProcess}

[`child_process.spawn()`][] အောင်မြင်စွာ ပြီးဆုံးပြီး — process ကို ဖန်တီးလိုက်ပြီးတဲ့အခါ emit လုပ်ပါတယ်။

`tracing:child_process.spawn:error`

* `process` {ChildProcess}
* `error` {Error}

[`child_process.spawn()`][] က error တစ်ခု ကြုံတွေ့တဲ့အခါ emit လုပ်ပါတယ်။

##### Event: `'process.execve'`

* `execPath` {string}
* `args` {string\[]}
* `env` {string\[]}

[`process.execve()`][] ကို ခေါ်ယူလိုက်တဲ့အခါ emit လုပ်ပါတယ်။

#### Web Locks

> Stability: 1 - Experimental

ဒီ channels တွေက [`locks.request()`][] call တစ်ခုချင်းစီအတွက် emit လုပ်ပါတယ်။ Web Locks အကြောင်း အသေးစိတ်ကို [`worker_threads.locks`][] မှာ ကြည့်ပါ။

##### Event: `'locks.request.start'`

* `name` {string} တောင်းဆိုထားတဲ့ (requested) lock resource ၏ နာမည်
* `mode` {string} lock mode: `'exclusive'` (သို့) `'shared'`

Lock request တစ်ခု စတင်လုပ်တဲ့အခါ — lock ကို ပေးအပ်မခံရသေးခင် — emit လုပ်ပါတယ်။

##### Event: `'locks.request.grant'`

* `name` {string} တောင်းဆိုထားတဲ့ lock resource ၏ နာမည်
* `mode` {string} lock mode: `'exclusive'` (သို့) `'shared'`

Lock တစ်ခုကို အောင်မြင်စွာ ပေးအပ်ပြီး — callback က run လုပ်တော့မယ့် အချိန်မှာ emit လုပ်ပါတယ်။

##### Event: `'locks.request.miss'`

* `name` {string} တောင်းဆိုထားတဲ့ lock resource ၏ နာမည်
* `mode` {string} lock mode: `'exclusive'` (သို့) `'shared'`

`ifAvailable` က `true` ဖြစ်ပြီး lock က ချက်ချင်း မရနိုင်တဲ့အခါ emit လုပ်ပါတယ် — ဒီအခါ request callback ကို `Lock` object အစား `null` နဲ့ ခေါ်ယူပါတယ်။

##### Event: `'locks.request.end'`

* `name` {string} တောင်းဆိုထားတဲ့ lock resource ၏ နာမည်
* `mode` {string} lock mode: `'exclusive'` (သို့) `'shared'`
* `steal` {boolean} request က steal semantics သုံးမသုံး
* `ifAvailable` {boolean} request က ifAvailable semantics သုံးမသုံး
* `error` {Error|undefined} ရှိခဲ့ရင် — callback က throw လုပ်လိုက်တဲ့ error

Lock request တစ်ခု ပြီးဆုံးသွားတဲ့အခါ emit လုပ်ပါတယ် — callback က အောင်မြင်ခဲ့သည်ဖြစ်စေ၊ error တစ်ခု throw ခဲ့သည်ဖြစ်စေ၊ (သို့) lock ကို ခိုးယူ (steal) ခံခဲ့ရသည်ဖြစ်စေ ဖြစ်ပါတယ်။

#### Worker Thread

> Stability: 1 - Experimental

##### Event: `'worker_threads'`

* `worker` {Worker}

Thread အသစ်တစ်ခု ဖန်တီးတဲ့အခါ emit လုပ်ပါတယ်။

#### SQLite

> Stability: 1 - Experimental

##### Event: `'sqlite.db.query'`

* `sql` {string} Bound parameter values တွေ အစားထိုး ထည့်သွင်းပြီးသား expanded SQL ပါ။ Expansion မအောင်မြင်ခဲ့ရင်တော့ — placeholder တွေ အစားထိုး မခံရသေးတဲ့ မူရင်း SQL ကို အဲဒီအစား သုံးပါတယ်။
* `database` {DatabaseSync} statement ကို execute လုပ်ခဲ့တဲ့ [`DatabaseSync`][] instance
* `duration` {number} statement ၏ run time ကို nanosecond နဲ့ SQLite ၏ အတွင်းပိုင်း ခန့်မှန်းချက် ဖြစ်ပါတယ်။ ဒါက C-layer execution time ကိုပဲ ထင်ဟပ်ပြီး — argument marshaling (သို့) result-row တည်ဆောက်ခြင်း လိုမျိုး JavaScript binding overhead တွေ မပါဝင်ပါဘူး။

[`DatabaseSync`][] instance တစ်ခုပေါ်မှာ SQL statement တစ်ခု execute လုပ်ပြီးဆုံးသွားတဲ့အခါ emit လုပ်ပါတယ်။ ဒါက **profiling** event တစ်ခုပါ — statement တစ်ခုချင်းစီ ပြီးဆုံးချိန်မှာ တစ်ကြိမ် fire ပြီး — SQLite ၏ internal profiler ကနေ ခန့်မှန်းထားတဲ့ duration ကို သတင်းပို့ပါတယ်။ ဒါက distributed-tracing span တစ်ခု မဟုတ်ပါဘူး။ သက်ဆိုင်တဲ့ start event တစ်ခုမှ မရှိသလို — async context propagation ရော parent-span linkage ပါ မရှိပါဘူး။ OpenTelemetry-compatible spans (သို့) async context propagation လိုအပ်နေရင်တော့ — သင့် SQLite calls တွေကို JavaScript အလွှာမှာ [`TracingChannel`][] တစ်ခုနဲ့ wrap လုပ်ပါ။

Subscribers မရှိတဲ့အခါ publishing က overhead လုံးဝ မရှိပါဘူး။

Iteration အလယ်မှာ စွန့်လွှတ်လိုက်ပြီး နောက်ပိုင်းမှာ finalize လုပ်ခံရတဲ့ statement အတွက်တော့ event ကို emit လုပ်မှာ မဟုတ်ပါဘူး — [`statement.close()`][] နဲ့ ရှင်းလင်းစွာ ဖြစ်စေ၊ statement garbage collected ဖြစ်လို့ ဖြစ်စေပါ။ Event ကို ပို့ဆောင်နေချိန်မှာ database ရော statement ရော အသုံးပြုနေဆဲ ဖြစ်တာမို့ — subscribers တွေက database (သို့) statement ကို ပိတ်ပစ်လို့ မရပါဘူး။ [`database.close()`][] နဲ့ [`statement.close()`][] တို့ကို ကြည့်ပါ။

[BoundedChannel Channels]: #boundedchannel-channels
[TracingChannel Channels]: #tracingchannel-channels
[`'uncaughtException'`]: process.md#event-uncaughtexception
[`BoundedChannel`]: #class-boundedchannel
[`DatabaseSync`]: sqlite.md#class-databasesync
[`TracingChannel`]: #class-tracingchannel
[`asyncEnd` event]: #asyncendevent
[`asyncStart` event]: #asyncstartevent
[`boundedChannel.withScope(context)`]: #boundedchannelwithscopecontext
[`channel.bindStore(store)`]: #channelbindstorestore-transform
[`channel.runStores(context, ...)`]: #channelrunstorescontext-fn-thisarg-args
[`channel.subscribe(onMessage)`]: #channelsubscribeonmessage
[`channel.unsubscribe(onMessage)`]: #channelunsubscribeonmessage
[`channel.withStoreScope(data)`]: #channelwithstorescopedata
[`child_process.spawn()`]: child_process.md#child_processspawncommand-args-options
[`database.close()`]: sqlite.md#databaseclose
[`diagnostics_channel.channel(name)`]: #diagnostics_channelchannelname
[`diagnostics_channel.subscribe(name, onMessage)`]: #diagnostics_channelsubscribename-onmessage
[`diagnostics_channel.tracingChannel()`]: #diagnostics_channeltracingchannelnameorchannels
[`end` event]: #endevent
[`error` event]: #errorevent
[`locks.request()`]: worker_threads.md#locksrequestname-options-callback
[`net.Server.listen()`]: net.md#serverlisten
[`process.execve()`]: process.md#processexecvefile-args-env
[`start` event]: #startevent
[`statement.close()`]: sqlite.md#statementclose
[`worker_threads.locks`]: worker_threads.md#worker_threadslocks
[context loss]: async_context.md#troubleshooting-context-loss
[thenable object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#thenables
