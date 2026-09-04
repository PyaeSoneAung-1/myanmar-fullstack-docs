---
title: "Web Streams API"
description: "node:stream/web — WHATWG Streams Standard ကို အခြေခံတဲ့ ReadableStream, WritableStream, TransformStream, readers/controllers, TextEncoderStream/TextDecoderStream, CompressionStream/DecompressionStream နဲ့ stream consumers တွေအကြောင်း"
order: 113
source: "https://nodejs.org/api/webstreams.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

[WHATWG Streams Standard][] ရဲ့ implementation (အကောင်အထည်ဖော်မှု) တစ်ခု ဖြစ်ပါတယ်။

## ခြုံငုံ သုံးသပ်ချက် (Overview)

[WHATWG Streams Standard][] (သို့မဟုတ် "web streams") က streaming data (စီးဆင်းနေသော ဒေတာ) တွေကို ကိုင်တွယ်ဖို့ API တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ ဒါက Node.js ရဲ့ [Streams][] API နဲ့ ဆင်တူပေမယ့် — နောက်ပိုင်းမှ ပေါ်ထွက်လာတာ ဖြစ်ပြီး JavaScript environment တွေ အများအပြားမှာ streaming data အတွက် "standard" (စံနှုန်း) API တစ်ခု ဖြစ်လာပါတယ်။

Objects တွေရဲ့ အဓိက အမျိုးအစား သုံးမျိုး ရှိပါတယ်:

* `ReadableStream` - Streaming data ရဲ့ အရင်းအမြစ် (source) တစ်ခုကို ကိုယ်စားပြုပါတယ်။
* `WritableStream` - Streaming data အတွက် ဦးတည်ရာ (destination) တစ်ခုကို ကိုယ်စားပြုပါတယ်။
* `TransformStream` - Streaming data တွေကို အသွင်ပြောင်းဖို့ algorithm တစ်ခုကို ကိုယ်စားပြုပါတယ်။

### `ReadableStream` ဥပမာ (Example `ReadableStream`)

ဒီဥပမာက — လက်ရှိ `performance.now()` timestamp ကို စက္ကန့်တိုင်း တစ်ကြိမ် အဆုံးမသတ်ဘဲ တွန်းပို့ (push) ပေးနေတဲ့ ရိုးရှင်းတဲ့ `ReadableStream` တစ်ခုကို ဖန်တီးပါတယ်။ Stream ကနေ ဒေတာတွေကို ဖတ်ဖို့ async iterable တစ်ခုကို အသုံးပြုထားပါတယ်။

```mjs
import {
  ReadableStream,
} from 'node:stream/web';

import {
  setInterval as every,
} from 'node:timers/promises';

import {
  performance,
} from 'node:perf_hooks';

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

for await (const value of stream)
  console.log(value);
```

```cjs
const {
  ReadableStream,
} = require('node:stream/web');

const {
  setInterval: every,
} = require('node:timers/promises');

const {
  performance,
} = require('node:perf_hooks');

const SECOND = 1000;

const stream = new ReadableStream({
  async start(controller) {
    for await (const _ of every(SECOND))
      controller.enqueue(performance.now());
  },
});

(async () => {
  for await (const value of stream)
    console.log(value);
})();
```

### Node.js streams အပြန်အလှန် လိုက်ဖက်မှု (Node.js streams interoperability)

Node.js streams တွေကို `toWeb` နဲ့ `fromWeb` methods တွေကနေတစ်ဆင့် web streams အဖြစ်လည်းကောင်း၊ web streams တွေကိုလည်း Node.js streams အဖြစ် ပြောင်းပြန် ပြောင်းလဲလို့ ရပါတယ်။ ဒီ methods တွေက [`stream.Readable`][], [`stream.Writable`][] နဲ့ [`stream.Duplex`][] objects တွေပေါ်မှာ ရနိုင်ပါတယ်။

အသေးစိတ် အချက်အလက်တွေအတွက် သက်ဆိုင်ရာ documentation တွေကို ကြည့်ပါ:

* [`stream.Readable.toWeb`][]
* [`stream.Readable.fromWeb`][]
* [`stream.Writable.toWeb`][]
* [`stream.Writable.fromWeb`][]
* [`stream.Duplex.toWeb`][]
* [`stream.Duplex.fromWeb`][]

## API

### `ReadableStreamTee(stream[, cloneForBranch2])`

> Stability: 1 - Experimental

* `stream` {ReadableStream}
* `cloneForBranch2` {boolean} `true` ဖြစ်ရင် — ဒုတိယ branch ထဲ enqueue လုပ်တဲ့ chunks တွေကို ပထမ branch ထဲ enqueue လုပ်ထားတဲ့ chunks တွေကနေ clone လုပ်ပါတယ်။ **Default:** `false`။
* Returns: {ReadableStream\[]} {ReadableStream} branch နှစ်ခု။

`stream` ပေါ်မှာ WHATWG ရဲ့ `ReadableStreamTee` abstract operation ကို run လုပ်ပါတယ်။

ဒါက `readableStream.tee()` နဲ့ `cloneForBranch2` က `true` ဖြစ်တဲ့အခါမှသာ ကွဲပြားပါတယ်။ `tee()` method က အမြဲတမ်း `false` ကိုပဲ ပို့ပေးပြီး — Fetch body cloning လိုမျိုး တခြား web platform specifications တွေကတော့ `true` ကို ပို့ပေးပါတယ်။ ဒါကြောင့် ဒုတိယ branch က cloned chunks တွေကို ရရှိပြီး — branch တစ်ခုကို သုံးစွဲလိုက်တာက အခြား branch တစ်ခုက မြင်နေရတဲ့ chunks တွေကို ပြောင်းလဲပစ်လို့ မရအောင် ဖြစ်ပါတယ်။

### Class: `ReadableStream`

#### `new ReadableStream([underlyingSource [, strategy]])`

* `underlyingSource` {Object}
  * `start` {Function} `ReadableStream` ကို ဖန်တီးလိုက်တာနဲ့ ချက်ချင်း ခေါ်ယူမယ့် user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `controller` {ReadableStreamDefaultController|ReadableByteStreamController}
    * Returns: `undefined` (သို့) `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise
  * `pull` {Function} `ReadableStream` ရဲ့ internal queue မပြည့်တဲ့အခါ ထပ်ခါထပ်ခါ ခေါ်ယူမယ့် user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။ ဒီလုပ်ဆောင်ချက်က sync လည်း ဖြစ်နိုင်သလို async လည်း ဖြစ်နိုင်ပါတယ်။ Async ဖြစ်ရင် — အရင်က ပြန်ပေးလိုက်တဲ့ promise က fulfilled မဖြစ်မချင်း ဒီ function ကို ထပ်ပြီး ခေါ်မှာ မဟုတ်ပါဘူး။
    * `controller` {ReadableStreamDefaultController|ReadableByteStreamController}
    * Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise
  * `cancel` {Function} `ReadableStream` ကို cancel လုပ်တဲ့အခါ ခေါ်ယူမယ့် user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `reason` {any}
    * Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise
  * `type` {string} `'bytes'` (သို့) `undefined` ဖြစ်ရပါမယ်။
  * `autoAllocateChunkSize` {number} `type` က `'bytes'` နဲ့ ညီမျှတဲ့အခါမှသာ အသုံးပြုပါတယ်။ Non-zero တန်ဖိုးတစ်ခု သတ်မှတ်ထားရင် — `ReadableByteStreamController.byobRequest` ဆီ view buffer တစ်ခုကို အလိုအလျောက် ခွဲဝေပေးပါတယ်။ မသတ်မှတ်ထားရင် — default reader ဖြစ်တဲ့ `ReadableStreamDefaultReader` ကနေတစ်ဆင့် ဒေတာတွေကို လွှဲပြောင်းဖို့ stream ရဲ့ internal queues တွေကို အသုံးပြုရပါမယ်။
* `strategy` {Object}
  * `highWaterMark` {number} Backpressure သက်ရောက်မှု မရှိခင်က internal queue ရဲ့ အများဆုံး အရွယ်အစား။
  * `size` {Function} Data chunk တစ်ခုချင်းစီရဲ့ အရွယ်အစားကို ဖော်ထုတ်ဖို့ သုံးတဲ့ user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `chunk` {any}
    * Returns: {number}

#### `readableStream.locked`

* Type: {boolean} ဒီ {ReadableStream} အတွက် active reader တစ်ခု ရှိနေရင် `true` လို့ သတ်မှတ်ပါတယ်။

`readableStream.locked` property က မူလအားဖြင့် `false` ဖြစ်ပြီး — stream ရဲ့ ဒေတာတွေကို သုံးစွဲနေတဲ့ active reader တစ်ခု ရှိနေသရွေ့ `true` အဖြစ် ပြောင်းလဲသွားပါတယ်။

#### `readableStream.cancel([reason])`

* `reason` {any}
* Returns: ဖျက်သိမ်းခြင်း (cancelation) ပြီးစီးသွားတာနဲ့ `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise

#### `readableStream.getReader([options])`

* `options` {Object}
  * `mode` {string} `'byob'` (သို့) `undefined`
* Returns: {ReadableStreamDefaultReader|ReadableStreamBYOBReader}

```mjs
import { ReadableStream } from 'node:stream/web';

const stream = new ReadableStream();

const reader = stream.getReader();

console.log(await reader.read());
```

```cjs
const { ReadableStream } = require('node:stream/web');

const stream = new ReadableStream();

const reader = stream.getReader();

reader.read().then(console.log);
```

ဒါက `readableStream.locked` ကို `true` ဖြစ်စေပါတယ်။

#### `readableStream.pipeThrough(transform[, options])`

* `transform` {Object}
  * `readable` {ReadableStream} `transform.writable` က ဒီ `ReadableStream` ကနေ လက်ခံရရှိတဲ့ — အသွင်ပြောင်းခံရနိုင်တဲ့ — ဒေတာတွေကို တွန်းပို့ပေးမယ့် `ReadableStream` ပါ။
  * `writable` {WritableStream} ဒီ `ReadableStream` ရဲ့ ဒေတာတွေကို ရေးသွင်းမယ့် `WritableStream` ပါ။
* `options` {Object}
  * `preventAbort` {boolean} `true` ဖြစ်ရင် — ဒီ `ReadableStream` ထဲက errors တွေက `transform.writable` ကို abort ဖြစ်စေမှာ မဟုတ်ပါဘူး။
  * `preventCancel` {boolean} `true` ဖြစ်ရင် — ဦးတည်ရာ `transform.writable` ထဲက errors တွေက ဒီ `ReadableStream` ကို cancel ဖြစ်စေမှာ မဟုတ်ပါဘူး။
  * `preventClose` {boolean} `true` ဖြစ်ရင် — ဒီ `ReadableStream` ကို close လုပ်တာက `transform.writable` ကို close ဖြစ်စေမှာ မဟုတ်ပါဘူး။
  * `signal` {AbortSignal} {AbortController} တစ်ခုကို သုံးပြီး ဒေတာ လွှဲပြောင်းမှုကို cancel လုပ်နိုင်အောင် ခွင့်ပြုပါတယ်။
* Returns: {ReadableStream} `transform.readable` ကနေ ပြန်ပေးပါတယ်။

ဒီ {ReadableStream} ကို `transform` argument ထဲမှာ ပေးထားတဲ့ {ReadableStream} နဲ့ {WritableStream} အတွဲဆီ ချိတ်ဆက်ပေးပါတယ် — ဒီ {ReadableStream} ကနေ လာတဲ့ ဒေတာတွေက `transform.writable` ထဲ ရေးသွင်းပြီး၊ အသွင်ပြောင်းခံရနိုင်ပြီး၊ နောက်ဆုံးမှာ `transform.readable` ဆီ တွန်းပို့ခံရပါတယ်။ Pipeline ကို configure လုပ်ပြီးတာနဲ့ `transform.readable` ကို ပြန်ပေးပါတယ်။

Pipe operation လုပ်ဆောင်နေစဉ်အတွင်း ဒါက `readableStream.locked` ကို `true` ဖြစ်စေပါတယ်။

```mjs
import {
  ReadableStream,
  TransformStream,
} from 'node:stream/web';

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

for await (const chunk of transformedStream)
  console.log(chunk);
  // Prints: A
```

```cjs
const {
  ReadableStream,
  TransformStream,
} = require('node:stream/web');

const stream = new ReadableStream({
  start(controller) {
    controller.enqueue('a');
  },
});

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

const transformedStream = stream.pipeThrough(transform);

(async () => {
  for await (const chunk of transformedStream)
    console.log(chunk);
    // Prints: A
})();
```

#### `readableStream.pipeTo(destination[, options])`

* `destination` {WritableStream} ဒီ `ReadableStream` ရဲ့ ဒေတာတွေကို ရေးသွင်းမယ့် {WritableStream} တစ်ခုပါ။
* `options` {Object}
  * `preventAbort` {boolean} `true` ဖြစ်ရင် — ဒီ `ReadableStream` ထဲက errors တွေက `destination` ကို abort ဖြစ်စေမှာ မဟုတ်ပါဘူး။
  * `preventCancel` {boolean} `true` ဖြစ်ရင် — `destination` ထဲက errors တွေက ဒီ `ReadableStream` ကို cancel ဖြစ်စေမှာ မဟုတ်ပါဘူး။
  * `preventClose` {boolean} `true` ဖြစ်ရင် — ဒီ `ReadableStream` ကို close လုပ်တာက `destination` ကို close ဖြစ်စေမှာ မဟုတ်ပါဘူး။
  * `signal` {AbortSignal} {AbortController} တစ်ခုကို သုံးပြီး ဒေတာ လွှဲပြောင်းမှုကို cancel လုပ်နိုင်အောင် ခွင့်ပြုပါတယ်။
* Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise

Pipe operation လုပ်ဆောင်နေစဉ်အတွင်း ဒါက `readableStream.locked` ကို `true` ဖြစ်စေပါတယ်။

#### `readableStream.tee()`

* Returns: {ReadableStream\[]}

ဒီ `ReadableStream` ရဲ့ ဒေတာတွေကို ဆက်လက် ပို့ဆောင်ပေးမယ့် {ReadableStream} instance အသစ် တစ်စုံကို ပြန်ပေးပါတယ်။ တစ်ခုချင်းစီက တူညီတဲ့ ဒေတာတွေကို လက်ခံရရှိပါလိမ့်မယ်။

ဒါက `readableStream.locked` ကို `true` ဖြစ်စေပါတယ်။

#### `readableStream.values([options])`

* `options` {Object}
  * `preventCancel` {boolean} `true` ဖြစ်ရင် — async iterator က ရုတ်တရက် ရပ်တန့်သွားတဲ့အခါ {ReadableStream} ကို close လုပ်ခြင်းကနေ ကာကွယ်ပေးပါတယ်။ **Default**: `false`။

ဒီ `ReadableStream` ရဲ့ ဒေတာတွေကို သုံးစွဲဖို့ အသုံးပြုနိုင်မယ့် async iterator တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

Async iterator လုပ်ဆောင်နေစဉ်အတွင်း ဒါက `readableStream.locked` ကို `true` ဖြစ်စေပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream.values({ preventCancel: true }))
  console.log(Buffer.from(chunk).toString());
```

#### Async ထပ်လုပ်ဆောင်ခြင်း (Async iteration)

{ReadableStream} object က `for await` syntax ကို သုံးပြီး async iterator protocol ကို support လုပ်ပါတယ်။

```mjs
import { Buffer } from 'node:buffer';

const stream = new ReadableStream(getSomeSource());

for await (const chunk of stream)
  console.log(Buffer.from(chunk).toString());
```

Async iterator က {ReadableStream} ကို terminate ဖြစ်သွားတဲ့အထိ ဆက်ပြီး သုံးစွဲသွားပါလိမ့်မယ်။

မူလအားဖြင့် — async iterator က စောစီးစွာ ထွက်သွားခဲ့ရင် (`break`, `return`, (သို့) `throw` တစ်ခုခုကနေတစ်ဆင့်) {ReadableStream} ကို close လုပ်ပါလိမ့်မယ်။ {ReadableStream} ကို အလိုအလျောက် close မဖြစ်စေချင်ဘူးဆိုရင် — `readableStream.values()` method ကို သုံးပြီး async iterator ကို ရယူကာ `preventCancel` option ကို `true` လို့ သတ်မှတ်ပါ။

{ReadableStream} က locked ဖြစ်နေလို့ မရပါဘူး (ဆိုလိုတာက — ရှိပြီးသား active reader တစ်ခု ရှိနေလို့ မရပါဘူး)။ Async iteration လုပ်ဆောင်နေစဉ်အတွင်း {ReadableStream} က locked ဖြစ်နေပါလိမ့်မယ်။

#### `postMessage()` ဖြင့် လွှဲပြောင်းခြင်း (Transferring with `postMessage()`)

{ReadableStream} instance တစ်ခုကို {MessagePort} တစ်ခုနဲ့ လွှဲပြောင်း (transfer) လုပ်လို့ ရပါတယ်။

```js
const stream = new ReadableStream(getReadableSourceSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getReader().read().then((chunk) => {
    console.log(chunk);
  });
};

port2.postMessage(stream, [stream]);
```

### `ReadableStream.from(iterable)`

* `iterable` {Iterable} `Symbol.asyncIterator` (သို့) `Symbol.iterator` iterable protocol ကို အကောင်အထည် ဖော်ထားတဲ့ object တစ်ခုပါ။

Iterable တစ်ခုကနေ {ReadableStream} အသစ်တစ်ခုကို ဖန်တီးပေးတဲ့ utility method တစ်ခုပါ။

```mjs
import { ReadableStream } from 'node:stream/web';

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

const stream = ReadableStream.from(asyncIterableGenerator());

for await (const chunk of stream)
  console.log(chunk); // Prints: 'a', 'b', 'c'
```

```cjs
const { ReadableStream } = require('node:stream/web');

async function* asyncIterableGenerator() {
  yield 'a';
  yield 'b';
  yield 'c';
}

(async () => {
  const stream = ReadableStream.from(asyncIterableGenerator());

  for await (const chunk of stream)
    console.log(chunk); // Prints: 'a', 'b', 'c'
})();
```

ရလာတဲ့ {ReadableStream} ကို {WritableStream} တစ်ခုထဲ pipe လုပ်ဖို့ဆိုရင် {Iterable} က {Buffer}, {TypedArray}, (သို့) {DataView} objects တွေရဲ့ sequence တစ်ခုကို yield လုပ်ပေးသင့်ပါတယ်။

```mjs
import { ReadableStream } from 'node:stream/web';
import { Buffer } from 'node:buffer';

async function* asyncIterableGenerator() {
  yield Buffer.from('a');
  yield Buffer.from('b');
  yield Buffer.from('c');
}

const stream = ReadableStream.from(asyncIterableGenerator());

await stream.pipeTo(createWritableStreamSomehow());
```

```cjs
const { ReadableStream } = require('node:stream/web');
const { Buffer } = require('node:buffer');

async function* asyncIterableGenerator() {
  yield Buffer.from('a');
  yield Buffer.from('b');
  yield Buffer.from('c');
}

const stream = ReadableStream.from(asyncIterableGenerator());

(async () => {
  await stream.pipeTo(createWritableStreamSomehow());
})();
```

### Class: `ReadableStreamDefaultReader`

မူလအားဖြင့် — `readableStream.getReader()` ကို argument တွေ မပါဘဲ ခေါ်လိုက်ရင် `ReadableStreamDefaultReader` ရဲ့ instance တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။ Default reader က stream ကနေတစ်ဆင့် ဖြတ်သန်းလာတဲ့ data chunks တွေကို opaque (ဖောက်ထွင်း မမြင်ရသော) တန်ဖိုးတွေအနေနဲ့ သဘောထားပါတယ် — ဒါက {ReadableStream} ကို ယေဘုယျအားဖြင့် ဘယ် JavaScript တန်ဖိုးနဲ့မဆို အလုပ်လုပ်နိုင်စေပါတယ်။

#### `new ReadableStreamDefaultReader(stream)`

* `stream` {ReadableStream}

ပေးထားတဲ့ {ReadableStream} ကို lock လုပ်ထားမယ့် {ReadableStreamDefaultReader} အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

#### `readableStreamDefaultReader.cancel([reason])`

* `reason` {any}
* Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise

{ReadableStream} ကို cancel လုပ်ပြီး — အရင်းခံ stream ကို cancel လုပ်ပြီးသွားတဲ့အခါ fulfilled ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

#### `readableStreamDefaultReader.closed`

* Type: {Promise} ဆက်စပ်နေတဲ့ {ReadableStream} ကို close လုပ်လိုက်တဲ့အခါ `undefined` နဲ့ fulfilled ဖြစ်ပြီး — stream က error ဖြစ်ခဲ့ရင် (သို့) stream က close လုပ်ပြီးမဆုံးခင် reader ရဲ့ lock ကို လွှတ်လိုက်ရင် rejected ဖြစ်ပါတယ်။

#### `readableStreamDefaultReader.read()`

* Returns: အောက်ပါ object တစ်ခုနဲ့ fulfilled ဖြစ်တဲ့ promise:
  * `value` {any}
  * `done` {boolean}

အရင်းခံ {ReadableStream} ကနေ နောက်ထပ် data chunk တစ်ခုကို တောင်းခံပြီး — အဲဒီ ဒေတာ ရနိုင်တာနဲ့ ဒေတာနဲ့အတူ fulfilled ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

#### `readableStreamDefaultReader.releaseLock()`

ဒီ reader ရဲ့ lock ကို အရင်းခံ {ReadableStream} ပေါ်ကနေ လွှတ်ပေးပါတယ်။

### Class: `ReadableStreamBYOBReader`

`ReadableStreamBYOBReader` က byte-oriented {ReadableStream} တွေ (ဆိုလိုတာက — `ReadableStream` ကို ဖန်တီးတဲ့အခါ `underlyingSource.type` ကို `'bytes'` နဲ့ ညီမျှအောင် သတ်မှတ်ထားတဲ့ streams တွေ) အတွက် အစားထိုး consumer တစ်ခုပါ။

`BYOB` ဆိုတာ "bring your own buffer" (ကိုယ့် buffer ကိုယ် ယူလာခြင်း) ရဲ့ အတိုကောက်ပါ။ ဒါက — အပို ကော်ပီကူးခြင်းတွေကို ရှောင်ရှားနိုင်ပြီး byte-oriented ဒေတာတွေကို ပိုပြီး ထိရောက်စွာ ဖတ်နိုင်စေတဲ့ pattern တစ်ခုပါ။

```mjs
import {
  open,
} from 'node:fs/promises';

import {
  ReadableStream,
} from 'node:stream/web';

import { Buffer } from 'node:buffer';

class Source {
  type = 'bytes';
  autoAllocateChunkSize = 1024;

  async start(controller) {
    this.file = await open(new URL(import.meta.url));
    this.controller = controller;
  }

  async pull(controller) {
    const view = controller.byobRequest?.view;
    const {
      bytesRead,
    } = await this.file.read({
      buffer: view,
      offset: view.byteOffset,
      length: view.byteLength,
    });

    if (bytesRead === 0) {
      await this.file.close();
      this.controller.close();
    }
    controller.byobRequest.respond(bytesRead);
  }
}

const stream = new ReadableStream(new Source());

async function read(stream) {
  const reader = stream.getReader({ mode: 'byob' });

  const chunks = [];
  let result;
  do {
    result = await reader.read(Buffer.alloc(100));
    if (result.value !== undefined)
      chunks.push(Buffer.from(result.value));
  } while (!result.done);

  return Buffer.concat(chunks);
}

const data = await read(stream);
console.log(Buffer.from(data).toString());
```

#### `new ReadableStreamBYOBReader(stream)`

* `stream` {ReadableStream}

ပေးထားတဲ့ {ReadableStream} ကို lock လုပ်ထားမယ့် `ReadableStreamBYOBReader` အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

#### `readableStreamBYOBReader.cancel([reason])`

* `reason` {any}
* Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise

{ReadableStream} ကို cancel လုပ်ပြီး — အရင်းခံ stream ကို cancel လုပ်ပြီးသွားတဲ့အခါ fulfilled ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

#### `readableStreamBYOBReader.closed`

* Type: {Promise} ဆက်စပ်နေတဲ့ {ReadableStream} ကို close လုပ်လိုက်တဲ့အခါ `undefined` နဲ့ fulfilled ဖြစ်ပြီး — stream က error ဖြစ်ခဲ့ရင် (သို့) stream က close လုပ်ပြီးမဆုံးခင် reader ရဲ့ lock ကို လွှတ်လိုက်ရင် rejected ဖြစ်ပါတယ်။

#### `readableStreamBYOBReader.read(view[, options])`

* `view` {Buffer|TypedArray|DataView}
* `options` {Object}
  * `min` {number} သတ်မှတ်ထားရင် — ပြန်ပေးတဲ့ promise က element အရေအတွက် `min` လောက် ရနိုင်တာနဲ့ပဲ fulfilled ဖြစ်ပါလိမ့်မယ်။ မသတ်မှတ်ထားရင် — element အနည်းဆုံး တစ်ခု ရနိုင်တာနဲ့ promise က fulfilled ဖြစ်ပါတယ်။
* Returns: အောက်ပါ object တစ်ခုနဲ့ fulfilled ဖြစ်တဲ့ promise:
  * `value` {TypedArray|DataView}
  * `done` {boolean}

အရင်းခံ {ReadableStream} ကနေ နောက်ထပ် data chunk တစ်ခုကို တောင်းခံပြီး — အဲဒီ ဒေတာ ရနိုင်တာနဲ့ ဒေတာနဲ့အတူ fulfilled ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

ဒီ method ထဲကို pooled {Buffer} object instance တစ်ခုကို ထည့်ပေးလိုက်လို့ မရပါဘူး။ Pooled `Buffer` objects တွေကို `Buffer.allocUnsafe()`, (သို့) `Buffer.from()` တွေနဲ့ ဖန်တီးတာ ဖြစ်ပြီး — `node:fs` module ရဲ့ callbacks အမျိုးမျိုးကနေ မကြာခဏ ပြန်ပေးခံရတတ်ပါတယ်။ ဒီလို `Buffer` အမျိုးအစားတွေက မျှဝေသုံးထားတဲ့ အရင်းခံ {ArrayBuffer} object တစ်ခုကို သုံးပါတယ် — အဲဒီထဲမှာ pooled `Buffer` instance အားလုံးရဲ့ ဒေတာအားလုံး ပါဝင်နေပါတယ်။ `Buffer`, {TypedArray}, (သို့) {DataView} တစ်ခုကို `readableStreamBYOBReader.read()` ထဲ ထည့်ပေးလိုက်တဲ့အခါ — view ရဲ့ အရင်းခံ `ArrayBuffer` က _ခွဲထွက် (detached)_ သွားပြီး အဲဒီ `ArrayBuffer` ပေါ်မှာ ရှိနေနိုင်တဲ့ views တွေအားလုံးကို မမှန်ကန်တော့အောင် ဖြစ်စေပါတယ်။ ဒါက သင့် application အတွက် ဆိုးရွားတဲ့ အကျိုးဆက်တွေ ရှိနိုင်ပါတယ်။

#### `readableStreamBYOBReader.releaseLock()`

ဒီ reader ရဲ့ lock ကို အရင်းခံ {ReadableStream} ပေါ်ကနေ လွှတ်ပေးပါတယ်။

### Class: `ReadableStreamDefaultController`

{ReadableStream} တိုင်းမှာ — stream ရဲ့ internal state နဲ့ stream ရဲ့ queue ကို စီမံခန့်ခွဲဖို့ တာဝန်ရှိတဲ့ controller တစ်ခု ရှိပါတယ်။ `ReadableStreamDefaultController` က byte-oriented မဟုတ်တဲ့ `ReadableStream` တွေအတွက် default controller implementation ပါ။

#### `readableStreamDefaultController.close()`

ဒီ controller နဲ့ ဆက်စပ်နေတဲ့ {ReadableStream} ကို close လုပ်ပါတယ်။

#### `readableStreamDefaultController.desiredSize`

* Type: {number}

{ReadableStream} ရဲ့ queue ကို ပြည့်စေဖို့ ကျန်နေသေးတဲ့ ဒေတာ ပမာဏကို ပြန်ပေးပါတယ်။

#### `readableStreamDefaultController.enqueue([chunk])`

* `chunk` {any}

Data chunk အသစ်တစ်ခုကို {ReadableStream} ရဲ့ queue ထဲ ထည့်ပေါင်းပေးပါတယ်။

#### `readableStreamDefaultController.error([error])`

* `error` {any}

{ReadableStream} ကို error ဖြစ်စေပြီး close ဖြစ်စေမယ့် error တစ်ခုကို အချက်ပြပေးပါတယ်။

### Class: `ReadableByteStreamController`

{ReadableStream} တိုင်းမှာ — stream ရဲ့ internal state နဲ့ stream ရဲ့ queue ကို စီမံခန့်ခွဲဖို့ တာဝန်ရှိတဲ့ controller တစ်ခု ရှိပါတယ်။ `ReadableByteStreamController` က byte-oriented `ReadableStream` တွေအတွက် ဖြစ်ပါတယ်။

#### `readableByteStreamController.byobRequest`

* Type: {ReadableStreamBYOBRequest}

#### `readableByteStreamController.close()`

ဒီ controller နဲ့ ဆက်စပ်နေတဲ့ {ReadableStream} ကို close လုပ်ပါတယ်။

#### `readableByteStreamController.desiredSize`

* Type: {number}

{ReadableStream} ရဲ့ queue ကို ပြည့်စေဖို့ ကျန်နေသေးတဲ့ ဒေတာ ပမာဏကို ပြန်ပေးပါတယ်။

#### `readableByteStreamController.enqueue(chunk)`

* `chunk` {Buffer|TypedArray|DataView}

Data chunk အသစ်တစ်ခုကို {ReadableStream} ရဲ့ queue ထဲ ထည့်ပေါင်းပေးပါတယ်။

#### `readableByteStreamController.error([error])`

* `error` {any}

{ReadableStream} ကို error ဖြစ်စေပြီး close ဖြစ်စေမယ့် error တစ်ခုကို အချက်ပြပေးပါတယ်။

### Class: `ReadableStreamBYOBRequest`

Byte-oriented streams တွေမှာ `ReadableByteStreamController` ကို သုံးတဲ့အခါ၊ ပြီးတော့ `ReadableStreamBYOBReader` ကို သုံးတဲ့အခါ — `readableByteStreamController.byobRequest` property က လက်ရှိ read request ကို ကိုယ်စားပြုတဲ့ `ReadableStreamBYOBRequest` instance တစ်ခုဆီ ဝင်ရောက်ခွင့် ပေးပါတယ်။ ဒီ object ကို — read request ဖြည့်ဖို့ ပေးထားတဲ့ `ArrayBuffer`/`TypedArray` ဆီ ဝင်ရောက်ဖို့ သုံးပြီး၊ ဒေတာ ပေးပြီးပြီဆိုတာ အချက်ပြဖို့ methods တွေလည်း ပံ့ပိုးပေးပါတယ်။

#### `readableStreamBYOBRequest.respond(bytesWritten)`

* `bytesWritten` {number}

`readableStreamBYOBRequest.view` ထဲကို byte အရေအတွက် `bytesWritten` လောက် ရေးသားပြီးပြီဆိုတာ အချက်ပြပေးပါတယ်။

#### `readableStreamBYOBRequest.respondWithNewView(view)`

* `view` {Buffer|TypedArray|DataView}

`Buffer`, `TypedArray`, (သို့) `DataView` အသစ်တစ်ခုထဲကို bytes တွေ ရေးသားပြီး request ကို ဖြည့်ဆည်းလိုက်ပြီဆိုတာ အချက်ပြပေးပါတယ်။

#### `readableStreamBYOBRequest.view`

* Type: {Buffer|TypedArray|DataView}

### Class: `WritableStream`

`WritableStream` ဆိုတာ stream data တွေ ပို့ပေးတဲ့ ဦးတည်ရာ (destination) တစ်ခုပါ။

```mjs
import {
  WritableStream,
} from 'node:stream/web';

const stream = new WritableStream({
  write(chunk) {
    console.log(chunk);
  },
});

await stream.getWriter().write('Hello World');
```

#### `new WritableStream([underlyingSink[, strategy]])`

* `underlyingSink` {Object}
  * `start` {Function} `WritableStream` ကို ဖန်တီးလိုက်တာနဲ့ ချက်ချင်း ခေါ်ယူမယ့် user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `controller` {WritableStreamDefaultController}
    * Returns: `undefined` (သို့) `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise
  * `write` {Function} `WritableStream` ထဲ data chunk တစ်ခု ရေးသားလိုက်တဲ့အခါ ခေါ်ယူမယ့် user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `chunk` {any}
    * `controller` {WritableStreamDefaultController}
    * Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise
  * `close` {Function} `WritableStream` ကို close လုပ်တဲ့အခါ ခေါ်ယူမယ့် user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise
  * `abort` {Function} `WritableStream` ကို ရုတ်တရက် ပိတ်ဖို့ ခေါ်ယူမယ့် user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `reason` {any}
    * Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise
  * `type` {any} `type` option က နောင် အနာဂတ် အသုံးပြုမှုအတွက် သီးသန့် သိမ်းဆည်းထားပြီး — `undefined` ဖြစ်_ရပါမယ်_။
* `strategy` {Object}
  * `highWaterMark` {number} Backpressure သက်ရောက်မှု မရှိခင်က internal queue ရဲ့ အများဆုံး အရွယ်အစား။
  * `size` {Function} Data chunk တစ်ခုချင်းစီရဲ့ အရွယ်အစားကို ဖော်ထုတ်ဖို့ သုံးတဲ့ user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `chunk` {any}
    * Returns: {number}

#### `writableStream.abort([reason])`

* `reason` {any}
* Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise

`WritableStream` ကို ရုတ်တရက် terminate လုပ်ပါတယ်။ Queue လုပ်ထားတဲ့ writes တွေအားလုံးကို cancel လုပ်ပြီး — သူတို့နဲ့ ဆက်စပ်နေတဲ့ promises တွေက rejected ဖြစ်သွားပါလိမ့်မယ်။

#### `writableStream.close()`

* Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise

နောက်ထပ် ရေးသားမှုတွေ မျှော်လင့်မထားတော့တဲ့အခါ `WritableStream` ကို close လုပ်ပါတယ်။

#### `writableStream.getWriter()`

* Returns: {WritableStreamDefaultWriter}

`WritableStream` ထဲကို ဒေတာတွေ ရေးသားဖို့ သုံးနိုင်တဲ့ writer instance အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

#### `writableStream.locked`

* Type: {boolean}

`writableStream.locked` property က မူလအားဖြင့် `false` ဖြစ်ပြီး — ဒီ `WritableStream` ပေါ်မှာ active writer တစ်ခု တွဲထားနေသရွေ့ `true` အဖြစ် ပြောင်းလဲသွားပါတယ်။

#### postMessage() ဖြင့် လွှဲပြောင်းခြင်း (Transferring with postMessage())

{WritableStream} instance တစ်ခုကို {MessagePort} တစ်ခုနဲ့ လွှဲပြောင်း (transfer) လုပ်လို့ ရပါတယ်။

```js
const stream = new WritableStream(getWritableSinkSomehow());

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  data.getWriter().write('hello');
};

port2.postMessage(stream, [stream]);
```

### Class: `WritableStreamDefaultWriter`

#### `new WritableStreamDefaultWriter(stream)`

* `stream` {WritableStream}

ပေးထားတဲ့ `WritableStream` ကို lock လုပ်ထားမယ့် `WritableStreamDefaultWriter` အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

#### `writableStreamDefaultWriter.abort([reason])`

* `reason` {any}
* Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise

`WritableStream` ကို ရုတ်တရက် terminate လုပ်ပါတယ်။ Queue လုပ်ထားတဲ့ writes တွေအားလုံးကို cancel လုပ်ပြီး — သူတို့နဲ့ ဆက်စပ်နေတဲ့ promises တွေက rejected ဖြစ်သွားပါလိမ့်မယ်။

#### `writableStreamDefaultWriter.close()`

* Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise

နောက်ထပ် ရေးသားမှုတွေ မျှော်လင့်မထားတော့တဲ့အခါ `WritableStream` ကို close လုပ်ပါတယ်။

#### `writableStreamDefaultWriter.closed`

* Type: {Promise} ဆက်စပ်နေတဲ့ {WritableStream} ကို close လုပ်လိုက်တဲ့အခါ `undefined` နဲ့ fulfilled ဖြစ်ပြီး — stream က error ဖြစ်ခဲ့ရင် (သို့) stream က close လုပ်ပြီးမဆုံးခင် writer ရဲ့ lock ကို လွှတ်လိုက်ရင် rejected ဖြစ်ပါတယ်။

#### `writableStreamDefaultWriter.desiredSize`

* Type: {number}

{WritableStream} ရဲ့ queue ကို ပြည့်စေဖို့ လိုအပ်တဲ့ ဒေတာ ပမာဏ။

#### `writableStreamDefaultWriter.ready`

* Type: {Promise} Writer ကို အသုံးပြုဖို့ အသင့်ဖြစ်တဲ့အခါ `undefined` နဲ့ fulfilled ဖြစ်ပါတယ်။

#### `writableStreamDefaultWriter.releaseLock()`

ဒီ writer ရဲ့ lock ကို အရင်းခံ {ReadableStream} ပေါ်ကနေ လွှတ်ပေးပါတယ်။

#### `writableStreamDefaultWriter.write([chunk])`

* `chunk` {any}
* Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise

Data chunk အသစ်တစ်ခုကို {WritableStream} ရဲ့ queue ထဲ ထည့်ပေါင်းပေးပါတယ်။

### Class: `WritableStreamDefaultController`

`WritableStreamDefaultController` က {WritableStream} ရဲ့ internal state ကို စီမံခန့်ခွဲပါတယ်။

#### `writableStreamDefaultController.error([error])`

* `error` {any}

`WritableStream` ဒေတာတွေကို လုပ်ဆောင်နေစဉ်အတွင်း error တစ်ခု ဖြစ်ပွားခဲ့တာကို အချက်ပြဖို့ user code က ခေါ်ပါတယ်။ ခေါ်လိုက်တဲ့အခါ {WritableStream} ကို abort လုပ်ပြီး — လက်ရှိ ဆိုင်းငံ့ထားတဲ့ (pending) writes တွေကို cancel လုပ်ပါလိမ့်မယ်။

#### `writableStreamDefaultController.signal`

* Type: {AbortSignal} {WritableStream} တစ်ခုကို abort လုပ်တဲ့အခါ — ဆိုင်းငံ့ထားတဲ့ write (သို့) close operations တွေကို cancel လုပ်ဖို့ သုံးနိုင်တဲ့ `AbortSignal` တစ်ခုပါ။

### Class: `TransformStream`

`TransformStream` တစ်ခုမှာ {ReadableStream} တစ်ခုနဲ့ {WritableStream} တစ်ခု ပါဝင်ပြီး — ဒီနှစ်ခုက ချိတ်ဆက်ထားတာမို့ `WritableStream` ထဲ ရေးလိုက်တဲ့ ဒေတာတွေကို လက်ခံရရှိကာ အသွင်ပြောင်းခံရနိုင်ပြီး၊ နောက်ဆုံးမှာ `ReadableStream` ရဲ့ queue ထဲ တွန်းထည့်ခံရပါတယ်။

```mjs
import {
  TransformStream,
} from 'node:stream/web';

const transform = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  },
});

await Promise.all([
  transform.writable.getWriter().write('A'),
  transform.readable.getReader().read(),
]);
```

#### `new TransformStream([transformer[, writableStrategy[, readableStrategy]]])`

* `transformer` {Object}
  * `start` {Function} `TransformStream` ကို ဖန်တီးလိုက်တာနဲ့ ချက်ချင်း ခေါ်ယူမယ့် user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `controller` {TransformStreamDefaultController}
    * Returns: `undefined` (သို့) `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise
  * `transform` {Function} `transformStream.writable` ထဲ ရေးလိုက်တဲ့ data chunk တစ်ခုကို — `transformStream.readable` ဆီ ဆက်ပို့ပေးခြင်းမပြုခင် — လက်ခံရရှိပြီး အသွင်ပြောင်းနိုင်ချေရှိတဲ့ user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `chunk` {any}
    * `controller` {TransformStreamDefaultController}
    * Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise
  * `flush` {Function} `TransformStream` ရဲ့ writable ဘက်ခြမ်းကို close လုပ်ခါနီး — အသွင်ပြောင်းခြင်း လုပ်ငန်းစဉ် ပြီးဆုံးတော့မယ်ဆိုတာ အချက်ပြဖို့ — ခေါ်ယူမယ့် user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `controller` {TransformStreamDefaultController}
    * Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise
  * `cancel` {Function} `TransformStream` ရဲ့ readable ဘက်ခြမ်းကို cancel လုပ်တဲ့အခါ (သို့) writable ဘက်ခြမ်းကို abort လုပ်တဲ့အခါ ခေါ်ယူမယ့် user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `reason` {any}
    * Returns: `undefined` နဲ့ fulfilled ဖြစ်တဲ့ promise
  * `readableType` {any} `readableType` option က နောင် အနာဂတ် အသုံးပြုမှုအတွက် သီးသန့် သိမ်းဆည်းထားပြီး — `undefined` ဖြစ်_ရပါမယ်_။
  * `writableType` {any} `writableType` option က နောင် အနာဂတ် အသုံးပြုမှုအတွက် သီးသန့် သိမ်းဆည်းထားပြီး — `undefined` ဖြစ်_ရပါမယ်_။
* `writableStrategy` {Object}
  * `highWaterMark` {number} Backpressure သက်ရောက်မှု မရှိခင်က internal queue ရဲ့ အများဆုံး အရွယ်အစား။
  * `size` {Function} Data chunk တစ်ခုချင်းစီရဲ့ အရွယ်အစားကို ဖော်ထုတ်ဖို့ သုံးတဲ့ user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `chunk` {any}
    * Returns: {number}
* `readableStrategy` {Object}
  * `highWaterMark` {number} Backpressure သက်ရောက်မှု မရှိခင်က internal queue ရဲ့ အများဆုံး အရွယ်အစား။
  * `size` {Function} Data chunk တစ်ခုချင်းစီရဲ့ အရွယ်အစားကို ဖော်ထုတ်ဖို့ သုံးတဲ့ user သတ်မှတ်ပေးတဲ့ function တစ်ခုပါ။
    * `chunk` {any}
    * Returns: {number}

#### `transformStream.readable`

* Type: {ReadableStream}

#### `transformStream.writable`

* Type: {WritableStream}

#### `postMessage()` ဖြင့် လွှဲပြောင်းခြင်း (Transferring with postMessage())

{TransformStream} instance တစ်ခုကို {MessagePort} တစ်ခုနဲ့ လွှဲပြောင်း (transfer) လုပ်လို့ ရပါတယ်။

```js
const stream = new TransformStream();

const { port1, port2 } = new MessageChannel();

port1.onmessage = ({ data }) => {
  const { writable, readable } = data;
  // ...
};

port2.postMessage(stream, [stream]);
```

### Class: `TransformStreamDefaultController`

`TransformStreamDefaultController` က `TransformStream` ရဲ့ internal state ကို စီမံခန့်ခွဲပါတယ်။

#### `transformStreamDefaultController.desiredSize`

* Type: {number}

Readable ဘက်ခြမ်းရဲ့ queue ကို ပြည့်စေဖို့ လိုအပ်တဲ့ ဒေတာ ပမာဏ။

#### `transformStreamDefaultController.enqueue([chunk])`

* `chunk` {any}

Data chunk တစ်ခုကို readable ဘက်ခြမ်းရဲ့ queue ထဲ ထည့်ပေါင်းပေးပါတယ်။

#### `transformStreamDefaultController.error([reason])`

* `reason` {any}

Transform ဒေတာတွေကို လုပ်ဆောင်နေစဉ်အတွင်း error တစ်ခု ဖြစ်ပွားခဲ့တာကို readable နဲ့ writable နှစ်ဖက်စလုံးကို အချက်ပြပြီး — နှစ်ဖက်စလုံးကို ရုတ်တရက် ပိတ်သွားစေပါတယ်။

#### `transformStreamDefaultController.terminate()`

Transport ရဲ့ readable ဘက်ခြမ်းကို close လုပ်ပြီး — writable ဘက်ခြမ်းကို error တစ်ခုနဲ့အတူ ရုတ်တရက် ပိတ်သွားစေပါတယ်။

### Class: `ByteLengthQueuingStrategy`

#### `new ByteLengthQueuingStrategy(init)`

* `init` {Object}
  * `highWaterMark` {number}

#### `byteLengthQueuingStrategy.highWaterMark`

* Type: {number}

#### `byteLengthQueuingStrategy.size`

* Type: {Function}
  * `chunk` {any}
  * Returns: {number}

### Class: `CountQueuingStrategy`

#### `new CountQueuingStrategy(init)`

* `init` {Object}
  * `highWaterMark` {number}

#### `countQueuingStrategy.highWaterMark`

* Type: {number}

#### `countQueuingStrategy.size`

* Type: {Function}
  * `chunk` {any}
  * Returns: {number}

### Class: `TextEncoderStream`

#### `new TextEncoderStream()`

`TextEncoderStream` instance အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

#### `textEncoderStream.encoding`

* Type: {string}

`TextEncoderStream` instance က support လုပ်တဲ့ encoding ပါ။

#### `textEncoderStream.readable`

* Type: {ReadableStream}

#### `textEncoderStream.writable`

* Type: {WritableStream}

### Class: `TextDecoderStream`

#### `new TextDecoderStream([encoding[, options]])`

* `encoding` {string} ဒီ `TextDecoder` instance က support လုပ်တဲ့ `encoding` ကို ဖော်ပြပါတယ်။ **Default:** `'utf-8'`။
* `options` {Object}
  * `fatal` {boolean} Decoding failure တွေ ပြင်းထန် (fatal) ဖြစ်ရင် `true` ပါ။
  * `ignoreBOM` {boolean} `true` ဖြစ်ရင် — `TextDecoderStream` က byte order mark ကို အနက်ဖွင့်ပြီးသား ရလဒ်ထဲမှာ ထည့်သွင်းပေးပါလိမ့်မယ်။ `false` ဖြစ်ရင် — byte order mark ကို output ကနေ ဖယ်ရှားပါလိမ့်မယ်။ ဒီ option ကို `encoding` က `'utf-8'`, `'utf-16be'`, (သို့) `'utf-16le'` ဖြစ်တဲ့အခါမှသာ အသုံးပြုပါတယ်။ **Default:** `false`။

`TextDecoderStream` instance အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

#### `textDecoderStream.encoding`

* Type: {string}

`TextDecoderStream` instance က support လုပ်တဲ့ encoding ပါ။

#### `textDecoderStream.fatal`

* Type: {boolean}

Decoding error တွေကြောင့် `TypeError` တစ်ခု throw ဖြစ်ရင် ဒီတန်ဖိုးက `true` ဖြစ်ပါလိမ့်မယ်။

#### `textDecoderStream.ignoreBOM`

* Type: {boolean}

Decoding ရလဒ်ထဲမှာ byte order mark ပါဝင်နေမယ်ဆိုရင် ဒီတန်ဖိုးက `true` ဖြစ်ပါလိမ့်မယ်။

#### `textDecoderStream.readable`

* Type: {ReadableStream}

#### `textDecoderStream.writable`

* Type: {WritableStream}

### Class: `CompressionStream`

#### `new CompressionStream(format)`

* `format` {string} `'deflate'`, `'deflate-raw'`, `'gzip'`, (သို့) `'brotli'` တို့အနက် တစ်ခု ဖြစ်ရပါမယ်။

#### `compressionStream.readable`

* Type: {ReadableStream}

#### `compressionStream.writable`

* Type: {WritableStream}

### Class: `DecompressionStream`

#### `new DecompressionStream(format)`

* `format` {string} `'deflate'`, `'deflate-raw'`, `'gzip'`, (သို့) `'brotli'` တို့အနက် တစ်ခု ဖြစ်ရပါမယ်။

#### `decompressionStream.readable`

* Type: {ReadableStream}

#### `decompressionStream.writable`

* Type: {WritableStream}

### အထောက်အကူပြု consumer functions (Utility Consumers)

Utility consumer functions တွေက streams တွေကို သုံးစွဲခြင်းအတွက် ဘုံ (common) options တွေ ပံ့ပိုးပေးပါတယ်။

အောက်ပါအတိုင်း ဝင်ရောက်သုံးနိုင်ပါတယ်:

```mjs
import {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} from 'node:stream/consumers';
```

```cjs
const {
  arrayBuffer,
  blob,
  buffer,
  json,
  text,
} = require('node:stream/consumers');
```

#### `streamConsumers.arrayBuffer(stream)`

* `stream` {ReadableStream|stream.Readable|AsyncIterator}
* Returns: {Promise} Stream ရဲ့ အကြောင်းအရာ အပြည့်အစုံ ပါဝင်တဲ့ `ArrayBuffer` တစ်ခုနဲ့ fulfilled ဖြစ်ပါတယ်။

```mjs
import { arrayBuffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { TextEncoder } from 'node:util';

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');

const readable = Readable.from(dataArray);
const data = await arrayBuffer(readable);
console.log(`from readable: ${data.byteLength}`);
// Prints: from readable: 76
```

```cjs
const { arrayBuffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { TextEncoder } = require('node:util');

const encoder = new TextEncoder();
const dataArray = encoder.encode('hello world from consumers!');
const readable = Readable.from(dataArray);
arrayBuffer(readable).then((data) => {
  console.log(`from readable: ${data.byteLength}`);
  // Prints: from readable: 76
});
```

#### `streamConsumers.blob(stream)`

* `stream` {ReadableStream|stream.Readable|AsyncIterator}
* Returns: {Promise} Stream ရဲ့ အကြောင်းအရာ အပြည့်အစုံ ပါဝင်တဲ့ {Blob} တစ်ခုနဲ့ fulfilled ဖြစ်ပါတယ်။

```mjs
import { blob } from 'node:stream/consumers';

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
const data = await blob(readable);
console.log(`from readable: ${data.size}`);
// Prints: from readable: 27
```

```cjs
const { blob } = require('node:stream/consumers');

const dataBlob = new Blob(['hello world from consumers!']);

const readable = dataBlob.stream();
blob(readable).then((data) => {
  console.log(`from readable: ${data.size}`);
  // Prints: from readable: 27
});
```

#### `streamConsumers.buffer(stream)`

* `stream` {ReadableStream|stream.Readable|AsyncIterator}
* Returns: {Promise} Stream ရဲ့ အကြောင်းအရာ အပြည့်အစုံ ပါဝင်တဲ့ {Buffer} တစ်ခုနဲ့ fulfilled ဖြစ်ပါတယ်။

```mjs
import { buffer } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
const data = await buffer(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```cjs
const { buffer } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { Buffer } = require('node:buffer');

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
buffer(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```

#### `streamConsumers.bytes(stream)`

* `stream` {ReadableStream|stream.Readable|AsyncIterator}
* Returns: {Promise} Stream ရဲ့ အကြောင်းအရာ အပြည့်အစုံ ပါဝင်တဲ့ {Uint8Array} တစ်ခုနဲ့ fulfilled ဖြစ်ပါတယ်။

```mjs
import { bytes } from 'node:stream/consumers';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
const data = await bytes(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```cjs
const { bytes } = require('node:stream/consumers');
const { Readable } = require('node:stream');
const { Buffer } = require('node:buffer');

const dataBuffer = Buffer.from('hello world from consumers!');

const readable = Readable.from(dataBuffer);
bytes(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```

#### `streamConsumers.json(stream)`

* `stream` {ReadableStream|stream.Readable|AsyncIterator}
* Returns: {Promise} Stream ရဲ့ အကြောင်းအရာတွေကို UTF-8 encoded string အနေနဲ့ parse လုပ်ပြီး — အဲဒီ string ကို `JSON.parse()` ကနေတစ်ဆင့် ဖြတ်သန်းလိုက်တဲ့ ရလဒ်နဲ့ fulfilled ဖြစ်ပါတယ်။

```mjs
import { json } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
const data = await json(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 100
```

```cjs
const { json } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const items = Array.from(
  {
    length: 100,
  },
  () => ({
    message: 'hello world from consumers!',
  }),
);

const readable = Readable.from(JSON.stringify(items));
json(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 100
});
```

#### `streamConsumers.text(stream)`

* `stream` {ReadableStream|stream.Readable|AsyncIterator}
* Returns: {Promise} Stream ရဲ့ အကြောင်းအရာတွေကို UTF-8 encoded string အနေနဲ့ parse လုပ်ထားတဲ့ ရလဒ်နဲ့ fulfilled ဖြစ်ပါတယ်။

```mjs
import { text } from 'node:stream/consumers';
import { Readable } from 'node:stream';

const readable = Readable.from('Hello world from consumers!');
const data = await text(readable);
console.log(`from readable: ${data.length}`);
// Prints: from readable: 27
```

```cjs
const { text } = require('node:stream/consumers');
const { Readable } = require('node:stream');

const readable = Readable.from('Hello world from consumers!');
text(readable).then((data) => {
  console.log(`from readable: ${data.length}`);
  // Prints: from readable: 27
});
```

[Streams]: stream.md
[WHATWG Streams Standard]: https://streams.spec.whatwg.org/
[`stream.Duplex.fromWeb`]: stream.md#streamduplexfromwebpair-options
[`stream.Duplex.toWeb`]: stream.md#streamduplextowebstreamduplex-options
[`stream.Duplex`]: stream.md#class-streamduplex
[`stream.Readable.fromWeb`]: stream.md#streamreadablefromwebreadablestream-options
[`stream.Readable.toWeb`]: stream.md#streamreadabletowebstreamreadable-options
[`stream.Readable`]: stream.md#class-streamreadable
[`stream.Writable.fromWeb`]: stream.md#streamwritablefromwebwritablestream-options
[`stream.Writable.toWeb`]: stream.md#streamwritabletowebstreamwritable
[`stream.Writable`]: stream.md#class-streamwritable
