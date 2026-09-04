---
title: "Stream"
description: "node:stream module — streaming data (ဒေတာစီးကြောင်း) တွေကို ကိုင်တွယ်ဖို့ abstract interface — readable/writable/duplex/transform streams, buffering/highWaterMark, backpressure, pipeline, implementer APIs (Readable.from, pipeline, compose စသည်)"
order: 136
source: "https://nodejs.org/api/stream.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

Stream ဆိုတာ Node.js မှာ streaming data (စီးဆင်းနေသော data) တွေနဲ့ အလုပ်လုပ်ဖို့အတွက် abstract interface (စိတ္တဇ မျက်နှာပြင်) တစ်ခုပါ။ `node:stream` module က stream interface ကို အကောင်အထည်ဖော်ဖို့ (implement) အတွက် API တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

Node.js က ပံ့ပိုးပေးထားတဲ့ stream objects တွေ အများအပြား ရှိပါတယ်။ ဥပမာ — [request to an HTTP server][http-incoming-message] တစ်ခုနဲ့ [`process.stdout`][] တို့ နှစ်ခုလုံးက stream instances တွေ ဖြစ်ပါတယ်။

Streams တွေက readable (ဖတ်လို့ရသော), writable (ရေးလို့ရသော) သို့မဟုတ် နှစ်မျိုးလုံး ဖြစ်နိုင်ပါတယ်။ Streams အားလုံးက [`EventEmitter`][] ရဲ့ instances တွေပါ။

`node:stream` module ကို ဝင်ရောက်သုံးစွဲဖို့:

```js
const stream = require('node:stream');
```

`node:stream` module က stream instances အမျိုးအစားသစ်တွေကို ဖန်တီးဖို့အတွက် အသုံးဝင်ပါတယ်။ Streams တွေကို သုံးစွဲဖို့အတွက်ကတော့ `node:stream` module ကို သုံးစရာ မလိုတာ များပါတယ်။

## ဤ document ၏ ဖွဲ့စည်းပုံ (Organization of this document)

ဤ document မှာ အဓိက sections နှစ်ခုနဲ့ — မှတ်စုများ (notes) အတွက် တတိယမြောက် section တစ်ခု ပါဝင်ပါတယ်။ ပထမ section က application တစ်ခုအတွင်းမှာ ရှိပြီးသား streams တွေကို ဘယ်လို သုံးစွဲရမလဲဆိုတာကို ရှင်းပြပြီး — ဒုတိယ section ကတော့ stream အမျိုးအစားသစ်တွေကို ဘယ်လို ဖန်တီးရမလဲဆိုတာကို ရှင်းပြပါတယ်။

## Stream အမျိုးအစားများ (Types of streams)

Node.js အတွင်းမှာ အခြေခံ stream types လေးမျိုး ရှိပါတယ်:

* [`Writable`][]: data တွေကို ရေးသားနိုင်တဲ့ streams (ဥပမာ — [`fs.createWriteStream()`][])။
* [`Readable`][]: data တွေကို ဖတ်ရှုနိုင်တဲ့ streams (ဥပမာ — [`fs.createReadStream()`][])။
* [`Duplex`][]: `Readable` ရော `Writable` ပါ ဖြစ်တဲ့ streams (ဥပမာ — [`net.Socket`][])။
* [`Transform`][]: data တွေကို ရေးသားစဉ်နဲ့ ဖတ်ရှုစဉ်မှာ ပြုပြင် (modify) သို့မဟုတ် ပြောင်းလဲ (transform) လုပ်ပေးနိုင်တဲ့ `Duplex` streams (ဥပမာ — [`zlib.createDeflate()`][])။

ထို့အပြင် ဤ module မှာ utility functions တွေ ဖြစ်တဲ့ [`stream.duplexPair()`][], [`stream.pipeline()`][], [`stream.finished()`][], [`stream.Readable.from()`][] နဲ့ [`stream.addAbortSignal()`][] တို့လည်း ပါဝင်ပါတယ်။

### Streams ၏ Promises API (Streams Promises API)

`stream/promises` API က — callbacks တွေကို သုံးမယ့်အစား `Promise` objects တွေကို ပြန်ပေးတဲ့ — streams များအတွက် asynchronous utility functions တွေရဲ့ အစားထိုး (alternative) အစုတစ်ခုကို ပံ့ပိုးပေးပါတယ်။ ဒီ API ကို `require('node:stream/promises')` သို့မဟုတ် `require('node:stream').promises` ကနေတစ်ဆင့် ဝင်ရောက်သုံးစွဲနိုင်ပါတယ်။

### `stream.pipeline(streams[, options])`

### `stream.pipeline(source[, ...transforms], destination[, options])`

* `streams` {Stream\[]|Iterable\[]|AsyncIterable\[]|Function\[]|
  ReadableStream\[]|WritableStream\[]|TransformStream\[]}
* `source` {Stream|Iterable|AsyncIterable|Function|ReadableStream}
  * Returns: {Promise|AsyncIterable}
* `...transforms` {Stream|Function|TransformStream}
  * `source` {AsyncIterable}
  * Returns: {Promise|AsyncIterable}
* `destination` {Stream|Function|WritableStream}
  * `source` {AsyncIterable}
  * Returns: {Promise|AsyncIterable}
* `options` {Object} Pipeline ၏ options များ
  * `signal` {AbortSignal}
  * `end` {boolean} Source stream က ဆုံးသွားတဲ့အခါ destination stream ကို end လုပ်ပါတယ်။ Transform streams တွေကတော့ ဒီတန်ဖိုး `false` ဖြစ်နေရင်တောင် အမြဲတမ်း end လုပ်ခံရပါတယ်။ **Default:** `true`.
* Returns: {Promise} Pipeline ပြီးဆုံးသွားတဲ့အခါ fulfill ဖြစ်ပါတယ်။

```cjs
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```mjs
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('archive.tar'),
  createGzip(),
  createWriteStream('archive.tar.gz'),
);
console.log('Pipeline succeeded.');
```

`AbortSignal` တစ်ခုကို သုံးဖို့ — ၎င်းကို options object တစ်ခုရဲ့ အတွင်းမှာ နောက်ဆုံး argument အဖြစ် ဖြတ်သန်းပေးပါ။ Signal ကို abort လုပ်လိုက်တဲ့အခါ — `AbortError` တစ်ခုနဲ့အတူ — underlying pipeline ပေါ်မှာ `destroy` ကို ခေါ်ယူပါလိမ့်မယ်။

```cjs
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setImmediate(() => ac.abort());
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    { signal },
  );
}

run().catch(console.error); // AbortError
```

```mjs
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

const ac = new AbortController();
const { signal } = ac;
setImmediate(() => ac.abort());
try {
  await pipeline(
    createReadStream('archive.tar'),
    createGzip(),
    createWriteStream('archive.tar.gz'),
    { signal },
  );
} catch (err) {
  console.error(err); // AbortError
}
```

`pipeline` API က async generators တွေကိုလည်း ပံ့ပိုးပေးပါတယ်:

```cjs
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal });
      }
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```mjs
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';

await pipeline(
  createReadStream('lowercase.txt'),
  async function* (source, { signal }) {
    source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
    for await (const chunk of source) {
      yield await processChunk(chunk, { signal });
    }
  },
  createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```

Async generator ထဲကို ဖြတ်သန်းပေးလိုက်တဲ့ `signal` argument ကို ကိုင်တွယ်ဖို့ သတိရပါ။ အထူးသဖြင့် — async generator က pipeline ရဲ့ source (ဆိုလိုတာက ပထမဆုံး argument) ဖြစ်နေတဲ့ အခါမျိုးမှာပါ — မဟုတ်ရင် pipeline က ဘယ်တော့မှ ပြီးဆုံးမှာ မဟုတ်ပါဘူး။

```cjs
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    async function* ({ signal }) {
      await someLongRunningfn({ signal });
      yield 'asd';
    },
    fs.createWriteStream('uppercase.txt'),
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
```

```mjs
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
await pipeline(
  async function* ({ signal }) {
    await someLongRunningfn({ signal });
    yield 'asd';
  },
  fs.createWriteStream('uppercase.txt'),
);
console.log('Pipeline succeeded.');
```

`pipeline` API က [callback version][stream-pipeline] — callback ကို သုံးတဲ့ version — ကိုလည်း ပံ့ပိုးပေးပါတယ်:

### `stream.finished(stream[, options])`

* `stream` {Stream|ReadableStream|WritableStream} Readable နဲ့/သို့မဟုတ် writable ဖြစ်တဲ့ stream/webstream တစ်ခုပါ။
* `options` {Object}
  * `error` {boolean|undefined}
  * `readable` {boolean|undefined}
  * `writable` {boolean|undefined}
  * `signal` {AbortSignal|undefined}
  * `cleanup` {boolean|undefined} `true` ဆိုရင် — promise ကို fulfill မလုပ်ခင် ဒီ function က မှတ်ပုံတင်ထားတဲ့ (registered) listeners တွေကို ဖယ်ရှားပေးပါတယ်။ **Default:** `false`.
* Returns: {Promise} Stream က readable သို့မဟုတ် writable မဟုတ်တော့ဘူးဆိုရင် fulfill ဖြစ်ပါတယ်။

```cjs
const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // Drain the stream.
```

```mjs
import { finished } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

const rs = createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // Drain the stream.
```

`finished` API ကလည်း [callback version][stream-finished] တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

`stream.finished()` က — ပြန်ပေးလိုက်တဲ့ promise ကို resolve သို့မဟုတ် reject လုပ်ပြီးနောက်မှာ — dangling event listeners တွေ (အထူးသဖြင့် `'error'`, `'end'`, `'finish'` နဲ့ `'close'`) ကို ချန်ထားခဲ့ပါတယ်။ အဲဒီလို ချန်ထားရတဲ့ အကြောင်းရင်းက — (မှားယွင်းတဲ့ stream implementations တွေကြောင့် ဖြစ်ပေါ်လာတဲ့) မမျှော်လင့်ထားတဲ့ `'error'` events တွေက မမျှော်လင့်ထားတဲ့ crashes တွေကို မဖြစ်ပေါ်စေဖို့ပါ။ ဒီအပြုအမူကို မလိုချင်ဘူးဆိုရင် `options.cleanup` ကို `true` အဖြစ် သတ်မှတ်သင့်ပါတယ်:

```mjs
await finished(rs, { cleanup: true });
```

### Object mode (object mode — object များဖြင့် လည်ပတ်သော mode)

Node.js APIs တွေက ဖန်တီးတဲ့ streams အားလုံးက strings, {Buffer}, {TypedArray} နဲ့ {DataView} objects တွေကိုသာ သီးသန့် ကိုင်တွယ်ပါတယ်:

* `Strings` နဲ့ `Buffers` တွေက streams တွေနဲ့ သုံးလေ့ ရှိတဲ့ အသုံးအများဆုံး types တွေပါ။
* `TypedArray` နဲ့ `DataView` တွေက `Int32Array` သို့မဟုတ် `Uint8Array` လိုမျိုး types တွေနဲ့ binary data တွေကို ကိုင်တွယ်နိုင်စေပါတယ်။ TypedArray သို့မဟုတ် DataView တစ်ခုကို stream တစ်ခုဆီကို ရေးသားတဲ့အခါ — Node.js က raw bytes တွေကို process လုပ်ပါတယ်။

သို့သော်လည်း — streams ရဲ့ အတွင်းမှာ အထူး ရည်ရွယ်ချက်တစ်ခုကို ဆောင်ရွက်တဲ့ `null` ကလွဲလို့ — stream implementations တွေက တခြား JavaScript values အမျိုးအစားတွေနဲ့လည်း အလုပ်လုပ်ဖို့ ဖြစ်နိုင်ပါတယ်။ အဲဒီလို streams တွေကို "object mode" နဲ့ လည်ပတ်တယ်လို့ မှတ်ယူပါတယ်။

Stream instances တွေကို stream ဖန်တီးတဲ့အခါ `objectMode` option ကို သုံးပြီး object mode ထဲကို ပြောင်းလဲပေးပါတယ်။ ရှိပြီးသား stream တစ်ခုကို object mode ထဲကို ပြောင်းဖို့ ကြိုးစားတာကတော့ မလုံခြုံပါဘူး။

### Buffering (ကြားခံ buffer လုပ်ခြင်း)

[`Writable`][] ရော [`Readable`][] streams တွေပါ data တွေကို internal buffer (အတွင်းပိုင်း ကြားခံ) တစ်ခုအတွင်းမှာ သိမ်းဆည်းပါလိမ့်မယ်။

Buffer လုပ်ခံရနိုင်တဲ့ data ပမာဏက stream ရဲ့ constructor ဆီကို ဖြတ်သန်းပေးတဲ့ `highWaterMark` option ပေါ်မှာ မူတည်ပါတယ်။ သာမန် streams တွေအတွက် `highWaterMark` option က [total number of bytes][hwm-gotcha] (စုစုပေါင်း bytes အရေအတွက်) တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ Object mode နဲ့ လည်ပတ်နေတဲ့ streams တွေအတွက်တော့ `highWaterMark` က စုစုပေါင်း objects အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Strings တွေကို (decoding မလုပ်ပဲ) ကိုင်တွယ်နေတဲ့ streams တွေအတွက်တော့ `highWaterMark` က စုစုပေါင်း UTF-16 code units အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။

`Readable` streams တွေမှာ — implementation က [`stream.push(chunk)`][stream-push] ကို ခေါ်တဲ့အခါ — data တွေကို buffer လုပ်ပါတယ်။ Stream ရဲ့ consumer က [`stream.read()`][stream-read] ကို မခေါ်ဘူးဆိုရင် — data တွေက စားသုံးခံရတဲ့အထိ internal queue ထဲမှာ ထိုင်နေပါလိမ့်မယ်။

Internal read buffer ရဲ့ စုစုပေါင်း အရွယ်အစားက `highWaterMark` က သတ်မှတ်ထားတဲ့ threshold (ကန့်သတ်ချက်) ကို ရောက်ရှိသွားတာနဲ့ — buffer လုပ်ထားတဲ့ data တွေကို စားသုံးနိုင်သည်အထိ (ဆိုလိုတာက — read buffer ကို ဖြည့်ဖို့ သုံးတဲ့ internal [`readable._read()`][] method ကို ခေါ်တာ ရပ်သွားမယ်) — stream က underlying resource ကနေ data တွေကို ဖတ်တာ ယာယီ ရပ်နားပါလိမ့်မယ်။

[`writable.write(chunk)`][stream-write] method ကို ထပ်ခါထပ်ခါ ခေါ်တဲ့အခါ `Writable` streams တွေမှာ data တွေကို buffer လုပ်ပါတယ်။ Internal write buffer ရဲ့ စုစုပေါင်း အရွယ်အစားက `highWaterMark` က သတ်မှတ်ထားတဲ့ threshold အောက်မှာ ရှိနေသမျှ — `writable.write()` ခေါ်တွေက `true` ကို ပြန်ပေးပါလိမ့်မယ်။ Internal buffer ရဲ့ အရွယ်အစားက `highWaterMark` ကို ရောက်ရှိတာ သို့မဟုတ် ကျော်လွန်သွားတာနဲ့ — `false` ကို ပြန်ပေးပါလိမ့်မယ်။

`stream` API ရဲ့ — အထူးသဖြင့် [`stream.pipe()`][] method ရဲ့ — အဓိက ရည်မှန်းချက်တစ်ခုက — မြန်နှုန်း မတူညီတဲ့ sources နဲ့ destinations တွေက ရရှိနိုင်တဲ့ memory ကို မလွှမ်းမိုးနိုင်အောင် — data တွေရဲ့ buffering ကို လက်ခံနိုင်လောက်တဲ့ အဆင့်တွေမှာ ကန့်သတ်ဖို့ပါ။

`highWaterMark` option က threshold တစ်ခုသာ ဖြစ်ပြီး — limit (ကန့်သတ်ချက် အပြည့်အစုံ) မဟုတ်ပါဘူး: ၎င်းက stream တစ်ခုက data နောက်ထပ် မတောင်းခင် buffer လုပ်ထားမယ့် data ပမာဏကို သတ်မှတ်ပေးပါတယ်။ ယေဘုယျအားဖြင့် တင်းကျပ်တဲ့ memory ကန့်သတ်ချက်ကို ပြဋ္ဌာန်းတာ မဟုတ်ပါဘူး။ တိကျတဲ့ stream implementations တစ်ချို့က ပိုတင်းကျပ်တဲ့ ကန့်သတ်ချက်တွေကို သတ်မှတ်ဖို့ ရွေးချယ်နိုင်ပေမယ့် — အဲဒီလို လုပ်တာက optional ပါ။

[`Duplex`][] နဲ့ [`Transform`][] streams တွေက `Readable` ရော `Writable` ပါ ဖြစ်တာမို့ — တစ်ခုချင်းစီက ဖတ်ခြင်းနဲ့ ရေးသားခြင်း အတွက် သီးခြား internal buffers _နှစ်ခု_ (two) ကို ထိန်းသိမ်းထားပြီး — တစ်ဖက်စီက သင့်လျော်ပြီး ထိရောက်တဲ့ data စီးဆင်းမှုကို ထိန်းသိမ်းရင်း — အခြားတစ်ဖက်နဲ့ မသက်ဆိုင်ပဲ သီးခြား လည်ပတ်နိုင်စေပါတယ်။ ဥပမာ — [`net.Socket`][] instances တွေက [`Duplex`][] streams တွေ ဖြစ်ပြီး — ၎င်းတို့ရဲ့ `Readable` side က socket ဆီက _လက်ခံရရှိတဲ့ (from)_ data တွေကို စားသုံးနိုင်စေပြီး — `Writable` side က socket ဆီကို _ပို့လွှတ်တဲ့ (to)_ data တွေကို ရေးသားနိုင်စေပါတယ်။ Socket ဆီကို data တွေကို လက်ခံရရှိတဲ့ နှုန်းထက် ပိုမြန်တာ သို့မဟုတ် ပိုနှေးတာနဲ့ ရေးသားနိုင်တာမို့ — တစ်ဖက်စီက အခြားတစ်ဖက်နဲ့ မသက်ဆိုင်ပဲ သီးခြား လည်ပတ် (buffer) သင့်ပါတယ်။

Internal buffering ရဲ့ ယန္တရား (mechanics) တွေက internal implementation အသေးစိတ်တွေ ဖြစ်ပြီး — ဘယ်အချိန်မဆို ပြောင်းလဲနိုင်ပါတယ်။ ဒါပေမယ့် — အဆင့်မြင့် implementations တစ်ချို့အတွက်တော့ internal buffers တွေကို `writable.writableBuffer` သို့မဟုတ် `readable.readableBuffer` ကို သုံးပြီး ပြန်လည် ရယူနိုင်ပါတယ်။ ဒီလို မှတ်တမ်းမဝင်ထားတဲ့ (undocumented) properties တွေကို သုံးစွဲတာကိုတော့ မထောက်ခံပါဘူး။

## Stream သုံးစွဲသူများအတွက် API (API for stream consumers)

Node.js applications တွေ အားလုံးနီးပါးက — ဘယ်လောက်ပဲ ရိုးရှင်းပါစေ — streams တွေကို တစ်နည်းမဟုတ် တစ်နည်း သုံးစွဲကြပါတယ်။ အောက်မှာက HTTP server တစ်ခုကို အကောင်အထည်ဖော်တဲ့ Node.js application တစ်ခုမှာ streams တွေကို သုံးစွဲတဲ့ ဥပမာတစ်ခုပါ:

```js
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req` is an http.IncomingMessage, which is a readable stream.
  // `res` is an http.ServerResponse, which is a writable stream.

  let body = '';
  // Get the data as utf8 strings.
  // If an encoding is not set, Buffer objects will be received.
  req.setEncoding('utf8');

  // Readable streams emit 'data' events once a listener is added.
  req.on('data', (chunk) => {
    body += chunk;
  });

  // The 'end' event indicates that the entire body has been received.
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // Write back something interesting to the user:
      res.write(typeof data);
      res.end();
    } catch (er) {
      // uh oh! bad json!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token 'o', "not json" is not valid JSON
```

[`Writable`][] streams တွေက (ဥပမာထဲက `res` လိုမျိုး) — stream ပေါ်ကို data ရေးသားဖို့ သုံးတဲ့ `write()` နဲ့ `end()` လိုမျိုး methods တွေကို ထုတ်ဖော်ပေးပါတယ်။

[`Readable`][] streams တွေက — stream ပေါ်ကနေ ဖတ်ဖို့ data ရရှိနိုင်တဲ့အခါ application code တွေကို အသိပေးဖို့ — [`EventEmitter`][] API ကို သုံးပါတယ်။ ရရှိနိုင်တဲ့ data တွေကို stream ကနေ နည်းလမ်းမျိုးစုံနဲ့ ဖတ်နိုင်ပါတယ်။

[`Writable`][] ရော [`Readable`][] streams တွေပါ — stream ရဲ့ လက်ရှိ အခြေအနေကို ဆက်သွယ် အသိပေးဖို့ — [`EventEmitter`][] API ကို နည်းလမ်းအမျိုးမျိုးနဲ့ သုံးပါတယ်။

[`Duplex`][] နဲ့ [`Transform`][] streams တွေက [`Writable`][] ရော [`Readable`][] ပါ ဖြစ်ပါတယ်။

Stream တစ်ခုဆီကို data ရေးသားနေတဲ့ သို့မဟုတ် stream တစ်ခုကနေ data စားသုံးနေတဲ့ applications တွေက stream interfaces တွေကို တိုက်ရိုက် အကောင်အထည်ဖော်ဖို့ မလိုအပ်ပါဘူး — ပြီးတော့ ယေဘုယျအားဖြင့် `require('node:stream')` ကို ခေါ်စရာ အကြောင်းလည်း မရှိပါဘူး။

Stream အမျိုးအစားသစ်တွေကို အကောင်အထည်ဖော်ချင်တဲ့ developers တွေက [API for stream implementers][] section ကို ရည်ညွှန်း သင့်ပါတယ်။

### Data ရေးသားနိုင်သော streams (Writable streams)

Writable streams တွေက data တွေကို ရေးသားသွားမယ့် _destination_ (ဦးတည်ရာ) တစ်ခုအတွက် abstraction (စိတ္တဇ ကိုယ်စားပြုမှု) တစ်ခုပါ။

[`Writable`][] streams တွေရဲ့ ဥပမာတွေကတော့:

* [HTTP requests, on the client][]
* [HTTP responses, on the server][]
* [fs write streams][]
* [zlib streams][zlib]
* [crypto streams][crypto]
* [TCP sockets][]
* [child process stdin][]
* [`process.stdout`][], [`process.stderr`][]

ဒီဥပမာတွေထဲက တစ်ချို့က တကယ်တော့ [`Writable`][] interface ကို အကောင်အထည်ဖော်ထားတဲ့ [`Duplex`][] streams တွေပါ။

[`Writable`][] streams တွေ အားလုံးက `stream.Writable` class က သတ်မှတ်ထားတဲ့ interface ကို အကောင်အထည်ဖော်ပါတယ်။

[`Writable`][] streams တွေရဲ့ တိကျတဲ့ instances တွေက နည်းလမ်းအမျိုးမျိုးနဲ့ ကွဲပြားနိုင်ပေမယ့် — `Writable` streams အားလုံးက အောက်က ဥပမာမှာ ဖော်ပြထားတဲ့အတိုင်း — အခြေခံကျတဲ့ တူညီတဲ့ usage pattern တစ်ခုကို လိုက်နာပါတယ်:

```js
const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
```

#### Class: `stream.Writable`

##### Event: `'close'`

`'close'` event က stream နဲ့ ၎င်းရဲ့ underlying resources တွေ (ဥပမာ — file descriptor တစ်ခု) ပိတ်သွားတဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event က — events တွေ နောက်ထပ် emit လုပ်တော့မှာ မဟုတ်ကြောင်းနဲ့ — နောက်ထပ် တွက်ချက်မှု (computation) တွေ ဆက်လုပ် ဖြစ်ပွားတော့မှာ မဟုတ်ကြောင်း ဖော်ပြပါတယ်။

[`Writable`][] stream တစ်ခုက — `emitClose` option နဲ့ ဖန်တီးထားရင် — `'close'` event ကို အမြဲတမ်း emit လုပ်ပါလိမ့်မယ်။

##### Event: `'drain'`

[`stream.write(chunk)`][stream-write] ဆီကို ခေါ်လိုက်တာ `false` ကို ပြန်လာခဲ့ရင် — stream ဆီကို data တွေ ဆက်ရေးသားဖို့ သင့်လျော်တဲ့အခါ — `'drain'` event ကို emit လုပ်ပါလိမ့်မယ်။

```js
// Write the data to the supplied writable stream one million times.
// Be attentive to back-pressure.
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // Last time!
        writer.write(data, encoding, callback);
      } else {
        // See if we should continue, or wait.
        // Don't pass the callback, because we're not done yet.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // Had to stop early!
      // Write some more once it drains.
      writer.once('drain', write);
    }
  }
}
```

##### Event: `'error'`

* Type: {Error}

`'error'` event က data တွေကို ရေးသားနေတုန်း သို့မဟုတ် pipe လုပ်နေတုန်း error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် emit လုပ်ပါတယ်။ ခေါ်ယူလိုက်တဲ့အခါ listener callback ဆီကို `Error` argument တစ်ခုတည်းကို ဖြတ်သန်းပေးပါတယ်။

Stream ကို ဖန်တီးတဲ့အခါ [`autoDestroy`][writable-new] option ကို `false` အဖြစ် သတ်မှတ်ထားခြင်း မရှိရင် — `'error'` event ကို emit လုပ်တဲ့အခါ stream က ပိတ်သွားပါတယ်။

`'error'` ပြီးနောက်မှာ — `'close'` ကလွဲလို့ (တခြား `'error'` events တွေ အပါအဝင်) — events တွေ နောက်ထပ် emit လုပ်_သင့်တာ_ (should) မဟုတ်ပါဘူး။

##### Event: `'finish'`

`'finish'` event က [`stream.end()`][stream-end] method ကို ခေါ်ပြီးနောက်မှာ — data တွေ အားလုံးကို underlying system ဆီကို flush လုပ်ပြီးသွားတဲ့အခါ — emit လုပ်ပါတယ်။

```js
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('All writes are now complete.');
});
writer.end('This is the end\n');
```

##### Event: `'pipe'`

* `src` {stream.Readable} ဒီ writable ဆီကို pipe လုပ်နေတဲ့ source stream ပါ

`'pipe'` event က — readable stream တစ်ခုပေါ်မှာ [`stream.pipe()`][] method ကို ခေါ်ပြီး — ဒီ writable ကို ၎င်းရဲ့ destinations အစုထဲကို ထည့်သွင်းလိုက်တဲ့အခါ — emit လုပ်ပါတယ်။

```js
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Something is piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```

##### Event: `'unpipe'`

* `src` {stream.Readable} ဒီ writable ကို [unpiped][`stream.unpipe()`] လုပ်လိုက်တဲ့ source stream ပါ

`'unpipe'` event က — [`Readable`][] stream တစ်ခုပေါ်မှာ [`stream.unpipe()`][] method ကို ခေါ်ပြီး — ဒီ [`Writable`][] ကို ၎င်းရဲ့ destinations အစုကနေ ဖယ်ရှားလိုက်တဲ့အခါ — emit လုပ်ပါတယ်။

[`Readable`][] stream တစ်ခုက ဒီထဲကို pipe လုပ်နေတုန်း ဒီ [`Writable`][] stream က error တစ်ခုကို emit လုပ်ခဲ့ရင်လည်း ဒီ event ကို emit လုပ်ပါတယ်။

```js
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('unpipe', (src) => {
  console.log('Something has stopped piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
reader.unpipe(writer);
```

##### `writable.cork()`

`writable.cork()` method က ရေးသားလိုက်တဲ့ data တွေ အားလုံးကို memory ထဲမှာ buffer လုပ်ဖို့ တွန်းအားပေးပါတယ်။ Buffer လုပ်ထားတဲ့ data တွေကို [`stream.uncork()`][] သို့မဟုတ် [`stream.end()`][stream-end] methods တွေထဲက တစ်ခုခုကို ခေါ်တဲ့အခါ flush လုပ်ပါလိမ့်မယ်။

`writable.cork()` ရဲ့ အဓိက ရည်ရွယ်ချက်က — chunk ငယ်လေးတွေ အများအပြားကို stream ဆီကို လျင်မြန်စွာ ဆက်တိုက် ရေးသားတဲ့ အခြေအနေမျိုးကို လိုက်လျောဖို့ပါ။ ၎င်းတို့ကို underlying destination ဆီကို ချက်ချင်း လွှဲပြောင်းမပေးပဲ — `writable.cork()` က chunk တွေ အားလုံးကို `writable.uncork()` ခေါ်တဲ့အထိ buffer လုပ်ထားပြီး — အဲဒီအခါမှာ ၎င်းတို့ အားလုံးကို `writable._writev()` ဆီကို (ရှိရင်) ဖြတ်သန်းပေးပါလိမ့်မယ်။ ဒါက — ပထမဆုံး chunk ငယ်လေး process လုပ်ခံရဖို့ စောင့်နေတုန်း data တွေ buffer လုပ်ခံနေရတဲ့ — head-of-line blocking (တန်းစီဦးဆုံး ပိတ်ဆို့မှု) အခြေအနေကို ကာကွယ်ပေးပါတယ်။ ဒါပေမယ့် — `writable._writev()` ကို အကောင်အထည်မဖော်ပဲ `writable.cork()` ကို သုံးတာက throughput ကို ဆိုးကျိုး သက်ရောက်စေနိုင်ပါတယ်။

ဒါ့အပြင်: [`writable.uncork()`][], [`writable._writev()`][stream-_writev] တို့ကိုလည်း ကြည့်ပါ။

##### `writable.destroy([error])`

* `error` {Error} Optional — `'error'` event နဲ့ emit လုပ်ဖို့ error တစ်ခုပါ။
* Returns: {this}

Stream ကို destroy လုပ်ပါတယ်။ Optional အနေနဲ့ `'error'` event တစ်ခုကို emit လုပ်ပြီး — `'close'` event တစ်ခုကို (`emitClose` ကို `false` အဖြစ် သတ်မှတ်ထားခြင်း မရှိရင်) emit လုပ်ပါတယ်။ ဒီ call ပြီးနောက်မှာ writable stream က အဆုံးသတ်သွားပြီး — နောက်ပိုင်း `write()` သို့မဟုတ် `end()` ခေါ်တွေက `ERR_STREAM_DESTROYED` error တစ်ခုကို ဖြစ်ပေါ်စေပါလိမ့်မယ်။
ဒါက stream တစ်ခုကို destroy လုပ်ဖို့အတွက် ပျက်စီးစေတတ်ပြီး ချက်ချင်း (destructive and immediate) လုပ်ဆောင်တဲ့ နည်းလမ်းတစ်ခုပါ။ အရင်က `write()` ခေါ်ထားတာတွေက drain မဖြစ်သေးပဲ — `ERR_STREAM_DESTROYED` error တစ်ခုကို trigger လုပ်နိုင်ပါတယ်။ ပိတ်သိမ်းခင် data တွေကို flush လုပ်စေချင်ရင် destroy အစား `end()` ကို သုံးပါ — သို့မဟုတ် stream ကို destroy မလုပ်ခင် `'drain'` event ကို စောင့်ပါ။

```cjs
const { Writable } = require('node:stream');

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error
```

```cjs
const { Writable } = require('node:stream');

const myStream = new Writable();

myStream.destroy();
myStream.on('error', function wontHappen() {});
```

```cjs
const { Writable } = require('node:stream');

const myStream = new Writable();
myStream.destroy();

myStream.write('foo', (error) => console.error(error.code));
// ERR_STREAM_DESTROYED
```

`destroy()` ကို ခေါ်လိုက်ပြီးတာနဲ့ — နောက်ထပ် ခေါ်တွေက no-op (ဘာမျှ မလုပ်ပဲ နေခြင်း) ဖြစ်ပြီး — `_destroy()` ကလွဲလို့ — `'error'` အဖြစ် emit လုပ်နိုင်တဲ့ နောက်ထပ် errors တွေ မရှိတော့ပါဘူး။

Implementors (အကောင်အထည်ဖော်သူများ) က ဒီ method ကို override မလုပ်သင့်ပဲ — အဲဒီအစား [`writable._destroy()`][writable-_destroy] ကို အကောင်အထည်ဖော်သင့်ပါတယ်။

##### `writable.closed`

* Type: {boolean}

`'close'` ကို emit လုပ်ပြီးနောက်မှာ `true` ဖြစ်ပါတယ်။

##### `writable.destroyed`

* Type: {boolean}

[`writable.destroy()`][writable-destroy] ကို ခေါ်ပြီးနောက်မှာ `true` ဖြစ်ပါတယ်။

```cjs
const { Writable } = require('node:stream');

const myStream = new Writable();

console.log(myStream.destroyed); // false
myStream.destroy();
console.log(myStream.destroyed); // true
```

##### `writable.end([chunk[, encoding]][, callback])`

* `chunk` {string|Buffer|TypedArray|DataView|any} Optional — ရေးသားရန် data ပါ။ Object mode နဲ့ မလည်ပတ်တဲ့ streams တွေမှာ `chunk` က {string}, {Buffer}, {TypedArray} သို့မဟုတ် {DataView} ဖြစ်ရပါမယ်။ Object mode streams တွေမှာတော့ `chunk` က `null` ကလွဲလို့ ဘယ် JavaScript value မဆို ဖြစ်နိုင်ပါတယ်။
* `encoding` {string} `chunk` က string ဖြစ်ရင် သုံးမယ့် encoding ပါ
* `callback` {Function} Stream ပြီးဆုံးသွားတဲ့အခါ အတွက် callback ပါ။
* Returns: {this}

`writable.end()` method ကို ခေါ်လိုက်တာက — [`Writable`][] ဆီကို data တွေ နောက်ထပ် ရေးသားတော့မှာ မဟုတ်ကြောင်း အချက်ပြပါတယ်။ Optional ဖြစ်တဲ့ `chunk` နဲ့ `encoding` arguments တွေက stream ကို မပိတ်ခင် နောက်ဆုံး data chunk တစ်ခု ထပ်ဆောင်း ချက်ချင်း ရေးသားဖို့ ခွင့်ပြုပါတယ်။

[`stream.end()`][stream-end] ကို ခေါ်ပြီးနောက်မှာ [`stream.write()`][stream-write] method ကို ခေါ်လိုက်ရင် error တစ်ခု ထွက်ပေါ်ပါလိမ့်မယ်။

```js
// Write 'hello, ' and then end with 'world!'.
const fs = require('node:fs');
const file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
// Writing more now is not allowed!
```

##### `writable.setDefaultEncoding(encoding)`

* `encoding` {string} Default encoding အသစ်ပါ
* Returns: {this}

`writable.setDefaultEncoding()` method က [`Writable`][] stream တစ်ခုအတွက် default `encoding` ကို သတ်မှတ်ပေးပါတယ်။

##### `writable.uncork()`

`writable.uncork()` method က [`stream.cork()`][] ကို ခေါ်ပြီးကတည်းက buffer လုပ်ထားတဲ့ data တွေ အားလုံးကို flush လုပ်ပါတယ်။

[`writable.cork()`][] နဲ့ `writable.uncork()` တို့ကို သုံးပြီး stream တစ်ခုဆီကို ရေးသားမှုတွေရဲ့ buffering ကို စီမံခန့်ခွဲတဲ့အခါ — `writable.uncork()` ခေါ်တွေကို `process.nextTick()` ကို သုံးပြီး ရွှေ့ဆိုင်းပေးပါ။ အဲဒီလို လုပ်ခြင်းက ပေးထားတဲ့ Node.js event loop phase တစ်ခုအတွင်းမှာ ဖြစ်ပေါ်တဲ့ `writable.write()` ခေါ်တွေ အားလုံးကို စုစည်း (batch) လုပ်နိုင်စေပါတယ်။

```js
stream.cork();
stream.write('some ');
stream.write('data ');
process.nextTick(() => stream.uncork());
```

[`writable.cork()`][] method ကို stream တစ်ခုပေါ်မှာ အကြိမ်များစွာ ခေါ်ထားရင် — buffer လုပ်ထားတဲ့ data တွေကို flush လုပ်ဖို့ — `writable.uncork()` ကိုလည်း အလားတူ အကြိမ်ရေ တူတူ ခေါ်ပေးရပါမယ်။

```js
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // The data will not be flushed until uncork() is called a second time.
  stream.uncork();
});
```

ဒါ့အပြင်: [`writable.cork()`][] ကိုလည်း ကြည့်ပါ။

##### `writable.writable`

* Type: {boolean}

[`writable.write()`][stream-write] ကို ခေါ်ဖို့ လုံခြုံတယ်ဆိုရင် `true` ဖြစ်ပါတယ် — ဆိုလိုတာက stream က destroy လုပ်ထားခြင်း မရှိ၊ error မဖြစ်၊ end မလုပ်ရသေးဘူးလို့ ဆိုလိုပါတယ်။

##### `writable.writableAborted`

* Type: {boolean}

Stream က `'finish'` ကို မထုတ်လွှတ်ခင် destroy လုပ်ခဲ့တာ သို့မဟုတ် error ဖြစ်ခဲ့တာလားဆိုတာကို ပြန်ပေးပါတယ်။

##### `writable.writableEnded`

* Type: {boolean}

[`writable.end()`][] ကို ခေါ်ပြီးနောက်မှာ `true` ဖြစ်ပါတယ်။ ဒီ property က data တွေ flush ဖြစ်သွားလားဆိုတာကို မဖော်ပြပါဘူး — အဲဒါအတွက်တော့ [`writable.writableFinished`][] ကို သုံးပါ။

##### `writable.writableCorked`

* Type: {integer}

Stream ကို အပြည့်အဝ uncork လုပ်ဖို့အတွက် [`writable.uncork()`][stream-uncork] ကို ခေါ်ဖို့ လိုအပ်တဲ့ အကြိမ်အရေအတွက်ပါ။

##### `writable.errored`

* Type: {Error}

Stream ကို error တစ်ခုနဲ့ destroy လုပ်ထားရင် အဲဒီ error ကို ပြန်ပေးပါတယ်။

##### `writable.writableFinished`

* Type: {boolean}

[`'finish'`][] event ကို emit မလုပ်ခင် ချက်ချင်း `true` အဖြစ် သတ်မှတ်ပါတယ်။

##### `writable.writableHighWaterMark`

* Type: {number}

ဒီ `Writable` ကို ဖန်တီးတဲ့အခါ ဖြတ်သန်းပေးခဲ့တဲ့ `highWaterMark` ရဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။

##### `writable.writableLength`

* Type: {number}

ဒီ property မှာ — ရေးသားဖို့ အသင့်ဖြစ်နေတဲ့ queue ထဲက bytes (သို့မဟုတ် objects) အရေအတွက်ကို ပါဝင်ပါတယ်။ ဒီတန်ဖိုးက `highWaterMark` ရဲ့ အခြေအနေနဲ့ ပတ်သက်တဲ့ introspection data (အတွင်းစစ်ဆေး အချက်အလက်) တွေကို ပေးပါတယ်။

##### `writable.writableNeedDrain`

* Type: {boolean}

Stream ရဲ့ buffer က ပြည့်သွားခဲ့ပြီး stream က `'drain'` ကို emit လုပ်တော့မယ်ဆိုရင် `true` ဖြစ်ပါတယ်။

##### `writable.writableObjectMode`

* Type: {boolean}

ပေးထားတဲ့ `Writable` stream တစ်ခုရဲ့ `objectMode` property အတွက် getter ပါ။

##### `writable[Symbol.asyncDispose]()`

[`writable.destroy()`][writable-destroy] ကို `AbortError` တစ်ခုနဲ့ ခေါ်ပြီး — stream ပြီးဆုံးသွားတဲ့အခါ fulfill ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

##### `writable.write(chunk[, encoding][, callback])`

* `chunk` {string|Buffer|TypedArray|DataView|any} Optional — ရေးသားရန် data ပါ။ Object mode နဲ့ မလည်ပတ်တဲ့ streams တွေမှာ `chunk` က {string}, {Buffer}, {TypedArray} သို့မဟုတ် {DataView} ဖြစ်ရပါမယ်။ Object mode streams တွေမှာတော့ `chunk` က `null` ကလွဲလို့ ဘယ် JavaScript value မဆို ဖြစ်နိုင်ပါတယ်။
* `encoding` {string|null} `chunk` က string ဖြစ်ရင် သုံးမယ့် encoding ပါ။ **Default:** `'utf8'`
* `callback` {Function} ဒီ data chunk ကို flush လုပ်ပြီးတဲ့အခါ အတွက် callback ပါ။
* Returns: {boolean} Stream က — data တွေ ထပ်ဆက်မရေးသားခင် `'drain'` event ကို စောင့်ဆိုင်းစေချင်ရင် `false` — မဟုတ်ရင် `true` ကို ပြန်ပေးပါတယ်။

`writable.write()` method က stream ဆီကို data တစ်ချို့ ရေးသားပြီး — data ကို အပြည့်အဝ ကိုင်တွယ်ပြီးတာနဲ့ — ပေးထားတဲ့ `callback` ကို ခေါ်ပါတယ်။ Error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — `callback` ကို error ကို ပထမဆုံး argument အဖြစ် ထည့်ပြီး ခေါ်ပါလိမ့်မယ်။ `callback` ကို asynchronously ခေါ်ပြီး — `'error'` ကို emit မလုပ်ခင် ခေါ်ပါတယ်။

`chunk` ကို လက်ခံပြီးနောက် — internal buffer က stream ဖန်တီးစဉ်က သတ်မှတ်ထားတဲ့ `highWaterMark` ထက် ငယ်နေရင် — return တန်ဖိုးက `true` ဖြစ်ပါတယ်။ `false` ကို ပြန်လာခဲ့ရင် — [`'drain'`][] event ကို emit လုပ်တဲ့အထိ — stream ဆီကို data တွေ ထပ်ရေးသားဖို့ ကြိုးစားမှုတွေကို ရပ်တန့်ထားသင့်ပါတယ်။

Stream က draining မဖြစ်နေတုန်း — `write()` ခေါ်တွေက `chunk` ကို buffer လုပ်ပြီး false ကို ပြန်ပေးပါလိမ့်မယ်။ လက်ရှိ buffer လုပ်ထားတဲ့ chunks တွေ အားလုံး drain ဖြစ်သွားတာနဲ့ (operating system က ပို့ဆောင်ဖို့ လက်ခံလိုက်တာနဲ့) — `'drain'` event ကို emit လုပ်ပါလိမ့်မယ်။ `write()` က false ပြန်လာတာနဲ့ — `'drain'` event ကို emit မလုပ်ခင် chunks တွေ ထပ်မရေးသားပါနဲ့။ Draining မဖြစ်နေတဲ့ stream တစ်ခုပေါ်မှာ `write()` ကို ခေါ်တာက ခွင့်ပြုထားပေမယ့် — Node.js က ရေးသားလိုက်တဲ့ chunks တွေ အားလုံးကို memory အသုံးပြုမှု အမြင့်ဆုံး ရောက်တဲ့အထိ buffer လုပ်ပြီး — အဲဒီအချိန်မှာ unconditionally abort လုပ်ပါလိမ့်မယ်။ Abort မလုပ်ခင် အချိန်မှာတောင် — memory အသုံးပြုမှု မြင့်မားနေတာက garbage collector ရဲ့ စွမ်းဆောင်ရည်ကို ကျဆင်းစေပြီး — RSS ကို မြင့်တက်စေပါတယ် (ဒါက memory မလိုအပ်တော့ပြီးနောက်မှာတောင် ပုံမှန်အားဖြင့် system ဆီကို ပြန်မလွှတ်ပေးပါဘူး)။ TCP sockets တွေက — remote peer က data ကို မဖတ်ဘူးဆိုရင် — ဘယ်တော့မှ drain မဖြစ်နိုင်တာမို့ — draining မဖြစ်နေတဲ့ socket တစ်ခုကို ရေးသားနေတာက remote ကနေ အမြတ်ထုတ်လို့ရတဲ့ (remotely exploitable) vulnerability တစ်ခုဆီကို ဦးတည်သွားနိုင်ပါတယ်။

Stream က draining မဖြစ်နေတုန်း data ရေးသားတာက [`Transform`][] တစ်ခုအတွက် အထူးသဖြင့် ပြဿနာ ဖြစ်စေပါတယ် — အကြောင်းကတော့ `Transform` streams တွေက pipe လုပ်ခံရတဲ့အထိ သို့မဟုတ် `'data'` သို့မဟုတ် `'readable'` event handler တစ်ခု ထည့်သွင်းခံရတဲ့အထိ — default အနေနဲ့ pause လုပ်ထားလို့ပါ။

ရေးသားရမယ့် data တွေကို လိုအပ်တဲ့အခါမှသာ ထုတ်လုပ် သို့မဟုတ် ရယူလို့ရတယ်ဆိုရင် — အဲဒီ logic ကို [`Readable`][] တစ်ခုအနေနဲ့ ထည့်သွင်းပြီး [`stream.pipe()`][] ကို သုံးဖို့ အကြံပြုပါတယ်။ ဒါပေမယ့် `write()` ကို ခေါ်တာကို ပိုနှစ်သက်တယ်ဆိုရင်တော့ — [`'drain'`][] event ကို သုံးပြီး backpressure (နောက်ပြန် ဖိအား) ကို လေးစားကာ memory ပြဿနာတွေကို ရှောင်ရှားနိုင်ပါတယ်:

```js
function write(data, cb) {
  if (!stream.write(data)) {
    stream.once('drain', cb);
  } else {
    process.nextTick(cb);
  }
}

// Wait for cb to be called before doing any other write.
write('hello', () => {
  console.log('Write completed, do more writes now.');
});
```

Object mode နဲ့ လည်ပတ်နေတဲ့ `Writable` stream တစ်ခုက `encoding` argument ကို အမြဲတမ်း လျစ်လျူရှုပါလိမ့်မယ်။

### Data ဖတ်ရှုနိုင်သော streams (Readable streams)

Readable streams တွေက data တွေကို စားသုံးသွားမယ့် _source_ (ရင်းမြစ်) တစ်ခုအတွက် abstraction တစ်ခုပါ။

`Readable` streams တွေရဲ့ ဥပမာတွေကတော့:

* [HTTP responses, on the client][http-incoming-message]
* [HTTP requests, on the server][http-incoming-message]
* [fs read streams][]
* [zlib streams][zlib]
* [crypto streams][crypto]
* [TCP sockets][]
* [child process stdout and stderr][]
* [`process.stdin`][]

[`Readable`][] streams တွေ အားလုံးက `stream.Readable` class က သတ်မှတ်ထားတဲ့ interface ကို အကောင်အထည်ဖော်ပါတယ်။

#### Reading mode နှစ်မျိုး (Two reading modes)

`Readable` streams တွေက ထိရောက်စွာ ဆိုရရင် mode နှစ်မျိုးထဲက တစ်မျိုးနဲ့ လည်ပတ်ပါတယ်: flowing (စီးဆင်းနေသော) နဲ့ paused (ရပ်နားထားသော) ပါ။ ဒီ modes တွေက [object mode][object-mode] နဲ့ သီးခြားပါ။ [`Readable`][] stream တစ်ခုက flowing mode သို့မဟုတ် paused mode နဲ့ လည်ပတ်နေတာနဲ့ မသက်ဆိုင်ပဲ — object mode နဲ့ ဖြစ်စေ၊ မဟုတ်ပဲနဲ့ ဖြစ်စေ ရှိနိုင်ပါတယ်။

* Flowing mode မှာ — data တွေကို underlying system ကနေ အလိုအလျောက် ဖတ်ပြီး — [`EventEmitter`][] interface ကနေတစ်ဆင့် events တွေကို သုံးကာ — application ဆီကို တတ်နိုင်သမျှ မြန်မြန် ပေးပို့ပါတယ်။

* Paused mode မှာ — stream ကနေ data chunks တွေကို ဖတ်ဖို့ — [`stream.read()`][stream-read] method ကို တိုက်ရိုက် (explicitly) ခေါ်ပေးရပါတယ်။

[`Readable`][] streams တွေ အားလုံးက paused mode နဲ့ စတင်ပေမယ့် — အောက်ပါ နည်းလမ်းတွေထဲက တစ်ခုခုနဲ့ flowing mode ဆီကို ပြောင်းလဲနိုင်ပါတယ်:

* [`'data'`][] event handler တစ်ခုကို ထည့်သွင်းခြင်း။
* [`stream.resume()`][stream-resume] method ကို ခေါ်ခြင်း။
* Data တွေကို [`Writable`][] တစ်ခုဆီကို ပို့ဖို့ [`stream.pipe()`][] method ကို ခေါ်ခြင်း။

`Readable` က အောက်ပါတွေထဲက တစ်ခုခုကို သုံးပြီး paused mode ဆီကို ပြန်ပြောင်းနိုင်ပါတယ်:

* Pipe destinations တွေ မရှိဘူးဆိုရင် — [`stream.pause()`][stream-pause] method ကို ခေါ်ခြင်းအားဖြင့်။
* Pipe destinations တွေ ရှိနေရင် — pipe destinations တွေ အားလုံးကို ဖယ်ရှားခြင်းအားဖြင့်။ Pipe destinations အများအပြားကို [`stream.unpipe()`][] method ကို ခေါ်ပြီး ဖယ်ရှားနိုင်ပါတယ်။

သတိရထားရမယ့် အရေးကြီးတဲ့ အချက်က — `Readable` တစ်ခုက အဲဒီ data တွေကို စားသုံးဖို့ သို့မဟုတ် လျစ်လျူရှုဖို့ ယန္တရားတစ်ခု မပေးအပ်မချင်း — data ကို ထုတ်လုပ်မှာ မဟုတ်ပါဘူး။ စားသုံးတဲ့ ယန္တရားကို ပိတ်လိုက်တာ သို့မဟုတ် ဖယ်ရှားလိုက်တာဆိုရင် — `Readable` က data ထုတ်လုပ်မှုကို ရပ်တန့်ဖို့ _ကြိုးစား_ (attempt) ပါလိမ့်မယ်။

နောက်ပြန် လိုက်ဖက်ညီမှု (backward compatibility) အကြောင်းပြချက်တွေကြောင့် — [`'data'`][] event handlers တွေကို ဖယ်ရှားလိုက်တာက stream ကို အလိုအလျောက် pause လုပ်မှာ **မဟုတ်ပါဘူး**။ ဒါ့အပြင် — piped destinations တွေ ရှိနေရင် — အဲဒီ destinations တွေ drain ဖြစ်ပြီး data နောက်ထပ် တောင်းတဲ့အခါ — stream က paused အဖြစ် _ဆက်ရှိနေမယ်လို့_ (remain) — [`stream.pause()`][stream-pause] ကို ခေါ်တာက အာမခံချက် မပေးပါဘူး။

[`Readable`][] တစ်ခုကို flowing mode ထဲကို ပြောင်းလိုက်ပြီး — data တွေကို ကိုင်တွယ်ဖို့ consumers တွေ မရှိဘူးဆိုရင် — အဲဒီ data တွေ ပျောက်ဆုံးသွားပါလိမ့်မယ်။ ဥပမာ — `'data'` event မှာ listener တစ်ခု ချိတ်မထားပဲ `readable.resume()` method ကို ခေါ်လိုက်တာ သို့မဟုတ် — stream ကနေ `'data'` event handler တစ်ခုကို ဖယ်ရှားလိုက်တာမျိုးတွေမှာ ဖြစ်ပွားနိုင်ပါတယ်။

[`'readable'`][] event handler တစ်ခုကို ထည့်သွင်းလိုက်တာက stream ကို အလိုအလျောက် flowing ရပ်တန့်စေပြီး — data တွေကို [`readable.read()`][stream-read] ကနေတစ်ဆင့် စားသုံးရပါတော့မယ်။ [`'readable'`][] event handler ကို ဖယ်ရှားလိုက်ရင် — [`'data'`][] event handler ရှိနေသေးတယ်ဆိုရင် — stream က ပြန်ပြီး flowing စတင်ပါလိမ့်မယ်။

#### States (အခြေအနေများ) သုံးမျိုး (Three states)

`Readable` stream တစ်ခုရဲ့ "mode နှစ်မျိုး" လည်ပတ်မှုက — `Readable` stream implementation အတွင်းမှာ ဖြစ်ပွားနေတဲ့ ပိုရှုပ်ထွေးတဲ့ internal state management အတွက် ရိုးရှင်းအောင် ချုံ့ထားတဲ့ abstraction တစ်ခုပါ။

အထူးသဖြင့် — အချိန်မရွေး မှတ်ယူကြည့်ရင် — `Readable` တိုင်းက ဖြစ်နိုင်တဲ့ states သုံးခုထဲက တစ်ခုထဲမှာ ရှိပါတယ်:

* `readable.readableFlowing === null`
* `readable.readableFlowing === false`
* `readable.readableFlowing === true`

`readable.readableFlowing` က `null` ဖြစ်နေတဲ့အခါ — stream ရဲ့ data တွေကို စားသုံးဖို့ ယန္တရား ဘာမှ မပေးအပ်ထားပါဘူး။ ဒါကြောင့် stream က data ကို ထုတ်လုပ်မှာ မဟုတ်ပါဘူး။ ဒီ state ထဲမှာ — `'data'` event အတွက် listener တစ်ခု ချိတ်တာ၊ `readable.pipe()` method ကို ခေါ်တာ သို့မဟုတ် `readable.resume()` method ကို ခေါ်တာက — `readable.readableFlowing` ကို `true` အဖြစ် ပြောင်းလဲစေပြီး — `Readable` က data ထုတ်လုပ်လာတာနဲ့အမျှ events တွေကို တက်ကြွစွာ စတင် emit လုပ်ပါလိမ့်မယ်။

`readable.pause()`, `readable.unpipe()` တို့ကို ခေါ်တာ သို့မဟုတ် backpressure (နောက်ပြန် ဖိအား) ကို လက်ခံရရှိတာက — `readable.readableFlowing` ကို `false` အဖြစ် သတ်မှတ်စေပြီး — events တွေရဲ့ စီးဆင်းမှုကို ယာယီ ရပ်တန့်စေပေမယ့် — data ထုတ်လုပ်မှုကိုတော့ _မရပ်တန့်_ (not halt) ပါဘူး။ ဒီ state ထဲမှာ — `'data'` event အတွက် listener တစ်ခု ချိတ်လိုက်တာက `readable.readableFlowing` ကို `true` အဖြစ် ပြောင်းလဲစေမှာ မဟုတ်ပါဘူး။

```js
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing is now false.

pass.on('data', (chunk) => { console.log(chunk.toString()); });
// readableFlowing is still false.
pass.write('ok');  // Will not emit 'data'.
pass.resume();     // Must be called to make stream emit 'data'.
// readableFlowing is now true.
```

`readable.readableFlowing` က `false` ဖြစ်နေတုန်းမှာ — data တွေက stream ရဲ့ internal buffer အတွင်းမှာ စုပုံလာနိုင်ပါတယ်။

#### API style တစ်ခုတည်းကို ရွေးချယ်ခြင်း (Choose one API style)

`Readable` stream API က Node.js versions အများအပြားကို ဖြတ်ပြီး ပြောင်းလဲ တိုးတက်လာခဲ့ပြီး — stream data တွေကို စားသုံးဖို့ နည်းလမ်းများစွာကို ပံ့ပိုးပေးပါတယ်။ ယေဘုယျအားဖြင့် developers တွေက data စားသုံးတဲ့ နည်းလမ်းတွေထဲက _တစ်ခု_ (one) ကိုသာ ရွေးချယ်ပြီး — stream တစ်ခုတည်းကနေ data စားသုံးဖို့ နည်းလမ်းမျိုးစုံကို _ဘယ်တော့မှ_ (never) မသုံးသင့်ပါဘူး။ အထူးသဖြင့် — `on('data')`, `on('readable')`, `pipe()`, သို့မဟုတ် async iterators တွေကို ပေါင်းစပ် သုံးစွဲတာက ပင်ကိုယ်အားဖြင့် နားလည်ရခက်တဲ့ (unintuitive) အပြုအမူတွေဆီကို ဦးတည်သွားနိုင်ပါတယ်။

#### Class: `stream.Readable`

##### Event: `'close'`

`'close'` event က stream နဲ့ ၎င်းရဲ့ underlying resources တွေ (ဥပမာ — file descriptor တစ်ခု) ပိတ်သွားတဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event က — events တွေ နောက်ထပ် emit လုပ်တော့မှာ မဟုတ်ကြောင်းနဲ့ — နောက်ထပ် တွက်ချက်မှု (computation) တွေ ဆက်လုပ် ဖြစ်ပွားတော့မှာ မဟုတ်ကြောင်း ဖော်ပြပါတယ်။

[`Readable`][] stream တစ်ခုက — `emitClose` option နဲ့ ဖန်တီးထားရင် — `'close'` event ကို အမြဲတမ်း emit လုပ်ပါလိမ့်မယ်။

##### Event: `'data'`

* `chunk` {Buffer|string|any} Data chunk ပါ။ Object mode နဲ့ လည်ပတ်မနေတဲ့ streams တွေအတွက် chunk က string သို့မဟုတ် `Buffer` ဖြစ်ပါလိမ့်မယ်။ Object mode ထဲမှာ ရှိနေတဲ့ streams တွေအတွက်တော့ chunk က `null` ကလွဲလို့ ဘယ် JavaScript value မဆို ဖြစ်နိုင်ပါတယ်။

`'data'` event က — stream က data chunk တစ်ခုရဲ့ ပိုင်ဆိုင်မှုကို consumer တစ်ဦးဆီကို လွှဲပြောင်းပေးလိုက်တဲ့အခါတိုင်း — emit လုပ်ပါတယ်။ ဒါက — `readable.pipe()`, `readable.resume()` တို့ကို ခေါ်ခြင်း သို့မဟုတ် `'data'` event မှာ listener callback တစ်ခု ချိတ်တွဲခြင်းအားဖြင့် — stream ကို flowing mode ထဲကို ပြောင်းလိုက်တဲ့အခါတိုင်း ဖြစ်ပွားနိုင်ပါတယ်။ `readable.read()` method ကို ခေါ်ပြီး — ပြန်ပေးဖို့ data chunk တစ်ခု ရနိုင်တဲ့အခါတိုင်းလည်း `'data'` event ကို emit လုပ်ပါလိမ့်မယ်။

တိုက်ရိုက် (explicitly) pause လုပ်မထားတဲ့ stream တစ်ခုမှာ `'data'` event listener တစ်ခုကို ချိတ်တွဲလိုက်တာက stream ကို flowing mode ထဲကို ပြောင်းလဲစေပါလိမ့်မယ်။ ဒါဆိုရင် data တွေကို ရနိုင်တာနဲ့ ချက်ချင်း ဖြတ်သန်းပေးပါလိမ့်မယ်။

Stream အတွက် default encoding တစ်ခုကို `readable.setEncoding()` method နဲ့ သတ်မှတ်ထားရင် — listener callback ဆီကို data chunk ကို string တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပြီး — မဟုတ်ရင်တော့ data ကို `Buffer` တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပါလိမ့်မယ်။

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
```

##### Event: `'end'`

`'end'` event က — stream ကနေ စားသုံးဖို့ data နောက်ထပ် မရှိတော့တဲ့အခါ — emit လုပ်ပါတယ်။

`'end'` event က data တွေကို လုံးဝ (completely) စားသုံးပြီးမှသာ emit လုပ်မှာ ဖြစ်ပြီး — မဟုတ်ရင် **emit လုပ်မှာ မဟုတ်ပါဘူး**။ ဒါကို — stream ကို flowing mode ထဲကို ပြောင်းလဲခြင်း သို့မဟုတ် — data အားလုံး စားသုံးပြီးသည်အထိ — [`stream.read()`][stream-read] ကို ထပ်ခါထပ်ခါ ခေါ်ခြင်းအားဖြင့် ပြီးမြောက်စေနိုင်ပါတယ်။

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});
readable.on('end', () => {
  console.log('There will be no more data.');
});
```

##### Event: `'error'`

* Type: {Error}

`'error'` event ကို `Readable` implementation တစ်ခုက ဘယ်အချိန်မဆို emit လုပ်နိုင်ပါတယ်။ ပုံမှန်အားဖြင့် — underlying stream က အတွင်းပိုင်း ချွတ်ယွင်းမှုတစ်ခုကြောင့် data ထုတ်လုပ်နိုင်စွမ်း မရှိတဲ့အခါ သို့မဟုတ် — stream implementation တစ်ခုက တရားဝင်မဟုတ်တဲ့ (invalid) data chunk တစ်ခုကို push လုပ်ဖို့ ကြိုးစားတဲ့အခါ — ဖြစ်ပွားနိုင်ပါတယ်။

Listener callback ဆီကို `Error` object တစ်ခုတည်း ဖြတ်သန်းပေးပါလိမ့်မယ်။

##### Event: `'pause'`

`'pause'` event က — [`stream.pause()`][stream-pause] ကို ခေါ်ပြီး `readableFlowing` က `false` မဟုတ်တဲ့အခါ — emit လုပ်ပါတယ်။

##### Event: `'readable'`

`'readable'` event က — stream ကနေ ဖတ်ဖို့ data တွေ ရရှိနိုင်တဲ့အခါ — သတ်မှတ်ထားတဲ့ high water mark (`state.highWaterMark`) အထိ — emit လုပ်ပါတယ်။ ထိရောက်စွာ ဆိုရရင် — stream ရဲ့ buffer အတွင်းမှာ အချက်အလက်သစ်တွေ ရှိနေကြောင်း ဖော်ပြပါတယ်။ ဒီ buffer အတွင်းမှာ data တွေ ရနိုင်ရင် — အဲဒီ data တွေကို ပြန်လည် ရယူဖို့ [`stream.read()`][stream-read] ကို ခေါ်နိုင်ပါတယ်။ ထို့အပြင် — stream ရဲ့ အဆုံးကို ရောက်ရှိသွားတဲ့အခါမှာလည်း `'readable'` event ကို emit လုပ်နိုင်ပါတယ်။

```js
const readable = getReadableStreamSomehow();
readable.on('readable', function() {
  // There is some data to read now.
  let data;

  while ((data = this.read()) !== null) {
    console.log(data);
  }
});
```

Stream ရဲ့ အဆုံးကို ရောက်ရှိသွားပြီဆိုရင် — [`stream.read()`][stream-read] ကို ခေါ်တာက `null` ကို ပြန်ပေးပြီး `'end'` event ကို trigger လုပ်ပါလိမ့်မယ်။ ဖတ်စရာ data တစ်ခါမှ မရှိခဲ့ဘူးဆိုရင်လည်း ဒီအတိုင်းပဲ ဖြစ်ပါတယ်။ ဥပမာ — အောက်က ဥပမာမှာ `foo.txt` က ဗလာ (empty) file တစ်ခုပါ:

```js
const fs = require('node:fs');
const rr = fs.createReadStream('foo.txt');
rr.on('readable', () => {
  console.log(`readable: ${rr.read()}`);
});
rr.on('end', () => {
  console.log('end');
});
```

ဒီ script ကို လည်ပတ်လိုက်ရင် ရတဲ့ output က:

```console
$ node test.js
readable: null
end
```

အချို့သော အခြေအနေတွေမှာ — `'readable'` event အတွက် listener တစ်ခု ချိတ်တွဲလိုက်တာက data အချို့ကို internal buffer တစ်ခုထဲကို ဖတ်သွင်းစေပါလိမ့်မယ်။

ယေဘုယျအားဖြင့် — `readable.pipe()` နဲ့ `'data'` event ယန္တရားတွေက `'readable'` event ထက် နားလည်ရ ပိုလွယ်ပါတယ်။ ဒါပေမယ့် — `'readable'` ကို ကိုင်တွယ်တာက throughput ကို မြှင့်တင်ပေးနိုင်ပါတယ်။

`'readable'` နဲ့ [`'data'`][] နှစ်ခုလုံးကို တစ်ချိန်တည်း သုံးနေရင် — flow ကို ထိန်းချုပ်ရာမှာ `'readable'` က ဦးစားပေး ရရှိပါတယ် — ဆိုလိုတာက [`stream.read()`][stream-read] ကို ခေါ်မှသာ `'data'` ကို emit လုပ်ပါလိမ့်မယ်။ `readableFlowing` property က `false` ဖြစ်သွားပါလိမ့်မယ်။ `'readable'` ကို ဖယ်ရှားလိုက်တဲ့အခါ `'data'` listeners တွေ ရှိနေသေးရင် — stream က flowing စတင်ပါလိမ့်မယ် — ဆိုလိုတာက `.resume()` ကို မခေါ်ပဲနဲ့တောင် `'data'` events တွေကို emit လုပ်ပါလိမ့်မယ်။

##### Event: `'resume'`

`'resume'` event က — [`stream.resume()`][stream-resume] ကို ခေါ်ပြီး `readableFlowing` က `true` မဟုတ်တဲ့အခါ — emit လုပ်ပါတယ်။

##### `readable.destroy([error])`

* `error` {Error} `'error'` event မှာ payload အဖြစ် ဖြတ်သန်းပေးမယ့် error ပါ
* Returns: {this}

Stream ကို destroy လုပ်ပါတယ်။ Optional အနေနဲ့ `'error'` event တစ်ခုကို emit လုပ်ပြီး — `'close'` event တစ်ခုကို (`emitClose` ကို `false` အဖြစ် သတ်မှတ်ထားခြင်း မရှိရင်) emit လုပ်ပါတယ်။ ဒီ call ပြီးနောက်မှာ readable stream က ၎င်းရဲ့ internal resources တွေ အားလုံးကို လွှတ်ပေးလိုက်ပြီး — နောက်ပိုင်း `push()` ခေါ်တွေကို လျစ်လျူရှုပါလိမ့်မယ်။

`destroy()` ကို ခေါ်လိုက်ပြီးတာနဲ့ — နောက်ထပ် ခေါ်တွေက no-op ဖြစ်ပြီး — `_destroy()` ကလွဲလို့ — `'error'` အဖြစ် emit လုပ်နိုင်တဲ့ နောက်ထပ် errors တွေ မရှိတော့ပါဘူး။

Implementors က ဒီ method ကို override မလုပ်သင့်ပဲ — အဲဒီအစား [`readable._destroy()`][readable-_destroy] ကို အကောင်အထည်ဖော်သင့်ပါတယ်။

##### `readable.closed`

* Type: {boolean}

`'close'` ကို emit လုပ်ပြီးနောက်မှာ `true` ဖြစ်ပါတယ်။

##### `readable.destroyed`

* Type: {boolean}

[`readable.destroy()`][readable-destroy] ကို ခေါ်ပြီးနောက်မှာ `true` ဖြစ်ပါတယ်။

##### `readable.isPaused()`

* Returns: {boolean}

`readable.isPaused()` method က `Readable` ရဲ့ လက်ရှိ လည်ပတ်နေတဲ့ state ကို ပြန်ပေးပါတယ်။ ဒါကို အဓိကအားဖြင့် `readable.pipe()` method ရဲ့ အောက်ခြေမှာ ရှိတဲ့ ယန္တရားက သုံးပါတယ်။ ပုံမှန် အခြေအနေအများစုမှာတော့ ဒီ method ကို တိုက်ရိုက် သုံးစရာ အကြောင်းမရှိပါဘူး။

```js
const readable = new stream.Readable();

readable.isPaused(); // === false
readable.pause();
readable.isPaused(); // === true
readable.resume();
readable.isPaused(); // === false
```

##### `readable.pause()`

* Returns: {this}

`readable.pause()` method က flowing mode ထဲမှာ ရှိနေတဲ့ stream တစ်ခုကို — [`'data'`][] events တွေ emit လုပ်တာ ရပ်တန့်စေပြီး — flowing mode ကနေ ထွက်သွားစေပါလိမ့်မယ်။ ရရှိနိုင်လာတဲ့ data တွေက internal buffer ထဲမှာ ဆက်လက် ရှိနေပါလိမ့်မယ်။

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
  readable.pause();
  console.log('There will be no additional data for 1 second.');
  setTimeout(() => {
    console.log('Now data will start flowing again.');
    readable.resume();
  }, 1000);
});
```

`readable.pause()` method က `'readable'` event listener တစ်ခု ရှိနေရင် ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

##### `readable.pipe(destination[, options])`

* `destination` {stream.Writable} Data ရေးသားဖို့ destination ပါ
* `options` {Object} Pipe ၏ options များ
  * `end` {boolean} Reader က ဆုံးသွားတဲ့အခါ writer ကို end လုပ်ပါတယ်။ **Default:** `true`.
* Returns: {stream.Writable} _destination_ ကိုယ်တိုင် ဖြစ်ပြီး — ၎င်းက [`Duplex`][] သို့မဟုတ် [`Transform`][] stream ဖြစ်နေရင် pipes တွေရဲ့ chain တစ်ခုကို တည်ဆောက်နိုင်စေပါတယ်။

`readable.pipe()` method က [`Writable`][] stream တစ်ခုကို `readable` နဲ့ တွဲချိတ်ပေးပြီး — ၎င်းကို အလိုအလျောက် flowing mode ထဲကို ပြောင်းလဲစေကာ — ၎င်းရဲ့ data တွေ အားလုံးကို တွဲချိတ်ထားတဲ့ [`Writable`][] ဆီကို တွန်းပို့ပါတယ်။ Data ရဲ့ စီးဆင်းမှုကို အလိုအလျောက် စီမံပေးတာမို့ — destination `Writable` stream က ပိုမြန်တဲ့ `Readable` stream တစ်ခုရဲ့ ဝန်ထုပ်ဝန်ပိုးကို မခံစားရအောင် ကာကွယ်ပေးပါတယ်။

အောက်က ဥပမာက `readable` ကနေ data တွေ အားလုံးကို `file.txt` ဆိုတဲ့ file တစ်ခုထဲကို pipe လုပ်ပါတယ်:

```js
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt'.
readable.pipe(writable);
```

`Writable` streams တစ်ခုထက်ပိုတာကို `Readable` stream တစ်ခုတည်းနဲ့ တွဲချိတ်ဖို့ ဖြစ်နိုင်ပါတယ်။

`readable.pipe()` method က _destination_ stream ဆီကို ရည်ညွှန်းချက် (reference) တစ်ခုကို ပြန်ပေးတာမို့ — piped streams တွေရဲ့ chains (ဆက်တန်းများ) တွေကို တည်ဆောက်ဖို့ ဖြစ်နိုင်စေပါတယ်:

```js
const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```

Default အနေနဲ့ — source `Readable` stream က [`'end'`][] ကို emit လုပ်တဲ့အခါ — destination `Writable` stream ပေါ်မှာ [`stream.end()`][stream-end] ကို ခေါ်ပြီး — destination က နောက်ထပ် writable မဖြစ်တော့အောင် လုပ်ပါတယ်။ ဒီ default အပြုအမူကို ပိတ်ချင်ရင် — `end` option ကို `false` အဖြစ် ဖြတ်သန်းပေးနိုင်ပြီး — destination stream ကို ဖွင့်ထားဆဲ (open) ဖြစ်အောင် လုပ်ပေးပါတယ်:

```js
reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
```

အရေးကြီးတဲ့ သတိထားစရာ တစ်ခုက — `Readable` stream က process လုပ်နေတုန်း error တစ်ခုကို emit လုပ်ခဲ့ရင် — `Writable` destination ကို အလိုအလျောက် ပိတ်ပေး_တာ မဟုတ်ပါဘူး_ (is not closed)။ Error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — memory leaks တွေ မဖြစ်အောင် — stream တစ်ခုချင်းစီကို _ကိုယ်တိုင်_ (manually) ပိတ်ပေးဖို့ လိုအပ်ပါလိမ့်မယ်။

[`process.stderr`][] နဲ့ [`process.stdout`][] `Writable` streams တွေကတော့ — သတ်မှတ်ထားတဲ့ options တွေ ဘယ်လိုပဲ ရှိပါစေ — Node.js process က ထွက်သွားတဲ့အထိ ဘယ်တော့မှ မပိတ်ပါဘူး။

##### `readable.read([size])`

* `size` {number} Optional — ဘယ်လောက် data ဖတ်ရမယ်ဆိုတာ သတ်မှတ်ပေးတဲ့ argument ပါ။
* Returns: {string|Buffer|null|any}

`readable.read()` method က internal buffer ထဲကနေ data ကို ဖတ်ထုတ်ပြီး ပြန်ပေးပါတယ်။ ဖတ်ဖို့ data မရနိုင်ဘူးဆိုရင် — `null` ကို ပြန်ပေးပါတယ်။ Default အနေနဲ့ — `readable.setEncoding()` method နဲ့ encoding တစ်ခု သတ်မှတ်ထားခြင်း မရှိရင် သို့မဟုတ် stream က object mode နဲ့ လည်ပတ်နေခြင်း မရှိရင် — data ကို `Buffer` object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။

Optional ဖြစ်တဲ့ `size` argument က ဖတ်ရမယ့် bytes အရေအတွက် တစ်ခုကို သတ်မှတ်ပေးပါတယ်။ `size` bytes လောက် ဖတ်ဖို့ မရနိုင်ဘူးဆိုရင် — stream က အဆုံးသတ်သွားပြီးသား ဖြစ်နေတဲ့ ကိစ္စမှာ — internal buffer ထဲမှာ ကျန်ရှိနေတဲ့ data တွေ အားလုံးကို ပြန်ပေးမယ့်အစား — `null` ကို ပြန်ပေးပါလိမ့်မယ် _လွဲလို့_ (unless)။

`size` argument ကို သတ်မှတ်မထားဘူးဆိုရင် — internal buffer ထဲမှာ ပါဝင်နေတဲ့ data တွေ အားလုံးကို ပြန်ပေးပါလိမ့်မယ်။

`size` argument က 1 GiB ထက် ငယ်ရမယ် သို့မဟုတ် ညီရပါမယ်။

`readable.read()` method ကို paused mode နဲ့ လည်ပတ်နေတဲ့ `Readable` streams တွေပေါ်မှာသာ ခေါ်သင့်ပါတယ်။ Flowing mode မှာတော့ — internal buffer က အပြည့်အဝ drain ဖြစ်သွားတဲ့အထိ — `readable.read()` ကို အလိုအလျောက် ခေါ်ပါတယ်။

```js
const readable = getReadableStreamSomehow();

// 'readable' may be triggered multiple times as data is buffered in
readable.on('readable', () => {
  let chunk;
  console.log('Stream is readable (new data received in buffer)');
  // Use a loop to make sure we read all currently available data
  while (null !== (chunk = readable.read())) {
    console.log(`Read ${chunk.length} bytes of data...`);
  }
});

// 'end' will be triggered once when there is no more data available
readable.on('end', () => {
  console.log('Reached end of stream.');
});
```

`readable.read()` ခေါ်တိုင်း — data chunk တစ်ခု သို့မဟုတ် — အဲဒီအချိန်မှာ ဖတ်စရာ data မရှိတော့ဘူးလို့ ဆိုလိုတဲ့ — `null` တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ chunks တွေကို အလိုအလျောက် ဆက်စပ် (concatenate) လုပ်မပေးပါဘူး။ `read()` ခေါ်တစ်ခုတည်းက data အားလုံးကို ပြန်မပေးတာမို့ — data တွေ အားလုံး ပြန်ရယူပြီးသည်အထိ chunks တွေကို ဆက်တိုက် ဖတ်ဖို့ while loop တစ်ခု သုံးဖို့ လိုအပ်နိုင်ပါတယ်။ ကြီးမားတဲ့ file တစ်ခုကို ဖတ်နေတဲ့အခါ — `.read()` က ယာယီ `null` ကို ပြန်ပေးနိုင်ပြီး — buffer လုပ်ထားတဲ့ content တွေ အားလုံးကို စားသုံးပြီးသွားပေမယ့် — buffer လုပ်ဖို့ data တွေ နောက်ထပ် ရှိနိုင်သေးတယ်လို့ ဖော်ပြတာပါ။ အဲဒီလို အခြေအနေမျိုးမှာ — buffer ထဲမှာ data တွေ နောက်ထပ် ရှိလာတာနဲ့ `'readable'` event အသစ်တစ်ခုကို emit လုပ်ပြီး — `'end'` event က data ပို့လွှတ်မှုရဲ့ အဆုံးကို ဖော်ပြပါတယ်။

ဒါကြောင့် `readable` တစ်ခုကနေ file တစ်ခုရဲ့ content တစ်ခုလုံးကို ဖတ်ဖို့ဆိုရင် — `'readable'` events အများအပြားကို ဖြတ်ပြီး chunks တွေကို စုဆောင်းဖို့ လိုအပ်ပါတယ်:

```js
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```

Object mode နဲ့ လည်ပတ်နေတဲ့ `Readable` stream တစ်ခုက — `size` argument ရဲ့ တန်ဖိုး ဘယ်လိုပဲ ရှိပါစေ — [`readable.read(size)`][stream-read] ခေါ်တာကနေ item တစ်ခုတည်းကို အမြဲတမ်း ပြန်ပေးပါလိမ့်မယ်။

`readable.read()` method က data chunk တစ်ခုကို ပြန်ပေးခဲ့ရင် — `'data'` event တစ်ခုကိုလည်း emit လုပ်ပါလိမ့်မယ်။

[`'end'`][] event ကို emit လုပ်ပြီးနောက်မှာ [`stream.read([size])`][stream-read] ကို ခေါ်ရင် — `null` ကို ပြန်ပေးပါလိမ့်မယ်။ Runtime error တစ်ခုကိုတော့ ထုတ်ပေးမှာ မဟုတ်ပါဘူး။

##### `readable.readable`

* Type: {boolean}

[`readable.read()`][stream-read] ကို ခေါ်ဖို့ လုံခြုံတယ်ဆိုရင် `true` ဖြစ်ပါတယ် — ဆိုလိုတာက stream က destroy လုပ်ထားခြင်း မရှိ၊ `'error'` သို့မဟုတ် `'end'` ကို emit လုပ်ထားခြင်း မရှိဘူးလို့ ဆိုလိုပါတယ်။

##### `readable.readableAborted`

* Type: {boolean}

Stream က `'end'` ကို မထုတ်လွှတ်ခင် destroy လုပ်ခဲ့တာ သို့မဟုတ် error ဖြစ်ခဲ့တာလားဆိုတာကို ပြန်ပေးပါတယ်။

##### `readable.readableDidRead`

* Type: {boolean}

`'data'` ကို emit လုပ်ခဲ့လားဆိုတာကို ပြန်ပေးပါတယ်။

##### `readable.readableEncoding`

* Type: {null|string}

ပေးထားတဲ့ `Readable` stream တစ်ခုရဲ့ `encoding` property အတွက် getter ပါ။ `encoding` property ကို [`readable.setEncoding()`][] method နဲ့ သတ်မှတ်နိုင်ပါတယ်။

##### `readable.readableEnded`

* Type: {boolean}

[`'end'`][] event ကို emit လုပ်တဲ့အခါ `true` ဖြစ်လာပါတယ်။

##### `readable.errored`

* Type: {Error}

Stream ကို error တစ်ခုနဲ့ destroy လုပ်ထားရင် အဲဒီ error ကို ပြန်ပေးပါတယ်။

##### `readable.readableFlowing`

* Type: {boolean}

ဒီ property က [Three states][] section မှာ ဖော်ပြထားတဲ့အတိုင်း — `Readable` stream တစ်ခုရဲ့ လက်ရှိ state ကို ထင်ဟပ်ဖော်ပြပါတယ်။

##### `readable.readableHighWaterMark`

* Type: {number}

ဒီ `Readable` ကို ဖန်တီးတဲ့အခါ ဖြတ်သန်းပေးခဲ့တဲ့ `highWaterMark` ရဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။

##### `readable.readableLength`

* Type: {number}

ဒီ property မှာ — ဖတ်ဖို့ အသင့်ဖြစ်နေတဲ့ queue ထဲက bytes (သို့မဟုတ် objects) အရေအတွက်ကို ပါဝင်ပါတယ်။ ဒီတန်ဖိုးက `highWaterMark` ရဲ့ အခြေအနေနဲ့ ပတ်သက်တဲ့ introspection data တွေကို ပေးပါတယ်။

##### `readable.readableObjectMode`

* Type: {boolean}

ပေးထားတဲ့ `Readable` stream တစ်ခုရဲ့ `objectMode` property အတွက် getter ပါ။

##### `readable.resume()`

* Returns: {this}

`readable.resume()` method က တိုက်ရိုက် (explicitly) pause လုပ်ထားတဲ့ `Readable` stream တစ်ခုကို — [`'data'`][] events တွေ ပြန်လည် emit လုပ်စေပြီး — stream ကို flowing mode ထဲကို ပြောင်းလဲစေပါတယ်။

`readable.resume()` method ကို — stream ကနေ data တွေကို တကယ် process မလုပ်ပဲ — အပြည့်အဝ စားသုံးပစ်ဖို့အတွက် သုံးနိုင်ပါတယ်:

```js
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('Reached the end, but did not read anything.');
  });
```

`readable.resume()` method က `'readable'` event listener တစ်ခု ရှိနေရင် ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

##### `readable.setEncoding(encoding)`

* `encoding` {string} သုံးမယ့် encoding ပါ။
* Returns: {this}

`readable.setEncoding()` method က `Readable` stream ကနေ ဖတ်လိုက်တဲ့ data တွေအတွက် character encoding ကို သတ်မှတ်ပေးပါတယ်။

Default အနေနဲ့ — encoding တစ်ခုကို သတ်မှတ်မထားပဲ — stream data တွေကို `Buffer` objects တွေအနေနဲ့ ပြန်ပေးပါတယ်။ Encoding တစ်ခုကို သတ်မှတ်လိုက်တာက — stream data တွေကို `Buffer` objects တွေအစား — သတ်မှတ်ထားတဲ့ encoding ရဲ့ strings တွေအနေနဲ့ ပြန်ပေးစေပါတယ်။ ဥပမာ — `readable.setEncoding('utf8')` ကို ခေါ်လိုက်တာက output data ကို UTF-8 data အဖြစ် အဓိပ္ပာယ်ကောက်ပြီး strings တွေအနေနဲ့ ဖြတ်သန်းစေပါလိမ့်မယ်။ `readable.setEncoding('hex')` ကို ခေါ်လိုက်တာကတော့ data ကို hexadecimal string ပုံစံနဲ့ encode လုပ်စေပါလိမ့်မယ်။

`Readable` stream က — stream ကနေ `Buffer` objects တွေအနေနဲ့ ဆွဲထုတ်လိုက်ရင် မှားယွင်းစွာ decode ဖြစ်သွားနိုင်မယ့် — multi-byte characters တွေကို stream ကနေတစ်ဆင့် ပို့ဆောင်ပေးတဲ့အခါ — ကောင်းမွန်စွာ ကိုင်တွယ်ပေးပါလိမ့်မယ်။

```js
const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('Got %d characters of string data:', chunk.length);
});
```

##### `readable.unpipe([destination])`

* `destination` {stream.Writable} Optional — unpipe လုပ်ရမယ့် တိကျတဲ့ stream ပါ
* Returns: {this}

`readable.unpipe()` method က အရင်က [`stream.pipe()`][] method ကို သုံးပြီး တွဲချိတ်ထားခဲ့တဲ့ `Writable` stream တစ်ခုကို ဖြုတ်ချပေးပါတယ်။

`destination` ကို သတ်မှတ်မထားဘူးဆိုရင် — pipes တွေ _အားလုံး_ (all) ကို ဖြုတ်ချပါတယ်။

`destination` ကို သတ်မှတ်ထားပေမယ့် — အဲဒါအတွက် pipe တစ်ခု တည်ဆောက်ထားခြင်း မရှိဘူးဆိုရင် — method က ဘာမှ မလုပ်ပါဘူး။

```js
const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// All the data from readable goes into 'file.txt',
// but only for the first second.
readable.pipe(writable);
setTimeout(() => {
  console.log('Stop writing to file.txt.');
  readable.unpipe(writable);
  console.log('Manually close the file stream.');
  writable.end();
}, 1000);
```

##### `readable.unshift(chunk[, encoding])`

* `chunk` {Buffer|TypedArray|DataView|string|null|any} Read queue ပေါ်ကို unshift လုပ်ရမယ့် data chunk ပါ။ Object mode နဲ့ မလည်ပတ်တဲ့ streams တွေမှာ `chunk` က {string}, {Buffer}, {TypedArray}, {DataView} သို့မဟုတ် `null` ဖြစ်ရပါမယ်။ Object mode streams တွေမှာတော့ `chunk` က ဘယ် JavaScript value မဆို ဖြစ်နိုင်ပါတယ်။
* `encoding` {string} String chunks တွေရဲ့ encoding ပါ။ `'utf8'` သို့မဟုတ် `'ascii'` လိုမျိုး တရားဝင် (valid) `Buffer` encoding တစ်ခု ဖြစ်ရပါမယ်။

`chunk` ကို `null` အဖြစ် ဖြတ်သန်းလိုက်တာက stream ရဲ့ အဆုံး (EOF) ကို အချက်ပြပြီး — `readable.push(null)` နဲ့ အတူတူပဲ ပြုမူပါတယ် — အဲဒီနောက်မှာ data တွေ နောက်ထပ် ရေးသားလို့ မရတော့ပါဘူး။ EOF signal ကို buffer ရဲ့ အဆုံးမှာ ထားရှိပြီး — buffer လုပ်ထားတဲ့ data တွေကို ဆက်လက် flush လုပ်ပါလိမ့်မယ်။

`readable.unshift()` method က data chunk တစ်ခုကို internal buffer ထဲကို ပြန်တွန်းထည့်ပေးပါတယ်။ ဒါက — stream တစ်ခုကို စားသုံးနေတဲ့ code က source ထဲကနေ အကောင်းမြင်စိတ်နဲ့ (optimistically) ဆွဲထုတ်လိုက်တဲ့ data အချို့ကို "un-consume" (ပြန်လည် မစားသုံး) လုပ်ဖို့ လိုအပ်ပြီး — အဲဒီ data တွေကို တခြားသူတစ်ဦးဆီကို လွှဲပြောင်းပေးဖို့ လိုအပ်တဲ့ အခြေအနေတစ်ချို့မှာ အသုံးဝင်ပါတယ်။

`stream.unshift(chunk)` method ကို [`'end'`][] event ကို emit လုပ်ပြီးနောက်မှာ ခေါ်လို့ မရတော့ပါဘူး — ခေါ်လိုက်ရင် runtime error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

`stream.unshift()` ကို သုံးနေတဲ့ developers တွေက — အဲဒီအစား [`Transform`][] stream တစ်ခုကို သုံးဖို့ ပြောင်းလဲခြင်းကို စဉ်းစားသင့်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [API for stream implementers][] section ကို ကြည့်ပါ။

```js
// Pull off a header delimited by \n\n.
// Use unshift() if we get too much.
// Call the callback with (error, header, stream).
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // Found the header boundary.
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // Remove the 'readable' listener before unshifting.
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // Now the body of the message can be read from the stream.
        callback(null, header, stream);
        return;
      }
      // Still reading the header.
      header += str;
    }
  }
}
```

[`stream.push(chunk)`][stream-push] နဲ့ မတူပဲ — `stream.unshift(chunk)` က stream ရဲ့ internal reading state ကို ပြန်လည်သတ်မှတ် (reset) ခြင်းအားဖြင့် — reading process ကို အဆုံးသတ်မပေးပါဘူး။ ဒါက — read တစ်ခုကို လုပ်ဆောင်နေတုန်း (custom stream တစ်ခုပေါ်က [`stream._read()`][stream-_read] implementation ရဲ့ အတွင်းကနေ ဆိုပါစို့) `readable.unshift()` ကို ခေါ်လိုက်ရင် — မမျှော်လင့်ထားတဲ့ ရလဒ်တွေကို ဖြစ်စေနိုင်ပါတယ်။ `readable.unshift()` ခေါ်ပြီးနောက်မှာ ချက်ချင်း [`stream.push('')`][stream-push] နဲ့ လိုက်ခေါ်ပေးရင် reading state ကို သင့်လျော်စွာ ပြန်လည်သတ်မှတ်ပေးပါလိမ့်မယ် — ဒါပေမယ့် read တစ်ခုကို လုပ်ဆောင်နေတုန်းမှာ `readable.unshift()` ကို ခေါ်တာကို ရှောင်ရှားတာကသာ အကောင်းဆုံး ဖြစ်ပါတယ်။


##### `readable.wrap(stream)`

* `stream` {Stream} "old style" readable stream တစ်ခုပါ
* Returns: {this}

Node.js 0.10 မတိုင်မီက streams တွေဟာ — လက်ရှိ သတ်မှတ်ထားတဲ့အတိုင်း — `node:stream` module API တစ်ခုလုံးကို implement လုပ်ထားခြင်း မရှိခဲ့ပါဘူး။ (နောက်ထပ် အချက်အလက်တွေအတွက် [Compatibility][] ကို ကြည့်ပါ။)

[`'data'`][] events တွေကို emit လုပ်ပြီး — အကြံပေးသက်သက် (advisory) ဖြစ်တဲ့ [`stream.pause()`][stream-pause] method တစ်ခု ရှိတဲ့ — ရှေးဟောင်း Node.js library တစ်ခုကို သုံးနေတဲ့အခါ `readable.wrap()` method ကို သုံးပြီး ရှေးဟောင်း stream ကို data source အဖြစ် သုံးတဲ့ [`Readable`][] stream တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။

`readable.wrap()` ကို သုံးဖို့ လိုအပ်တာက ရှားပါးပေမယ့် — ရှေးဟောင်း Node.js applications နဲ့ libraries တွေနဲ့ အပြန်အလှန် ဆက်သွယ်ရာမှာ အဆင်ပြေစေဖို့ ဒီ method ကို ထည့်သွင်း ပေးထားပါတယ်။

```js
const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // etc.
});
```

##### `readable[Symbol.asyncIterator]()`

* Returns: {AsyncIterator} stream ကို အပြည့်အဝ စားသုံး (consume) လုပ်ဖို့အတွက် ဖြစ်ပါတယ်။

```js
const fs = require('node:fs');

async function print(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  console.log(data);
}

print(fs.createReadStream('file')).catch(console.error);
```

Loop က `break`, `return` (သို့) `throw` တစ်ခုခုနဲ့ အဆုံးသတ်သွားရင် — stream ကို destroy လုပ်ပါလိမ့်မယ်။ တစ်နည်းပြောရရင် — stream တစ်ခုကို iterate လုပ်ခြင်းက stream ကို အပြည့်အဝ စားသုံးပစ်လိုက်တာ ဖြစ်ပါတယ်။ Stream ကို `highWaterMark` option နဲ့ တူညီတဲ့ အရွယ်အစားရှိတဲ့ chunks တွေအနေနဲ့ ဖတ်ပါလိမ့်မယ်။ အပေါ်က code ဥပမာမှာ — [`fs.createReadStream()`][] ဆီကို `highWaterMark` option ဘာမှ မပေးထားလို့ — file ထဲမှာ data 64 KiB ထက် နည်းနေရင် data က chunk တစ်ခုတည်းအနေနဲ့ ရပါလိမ့်မယ်။

##### `readable[Symbol.for('Stream.toAsyncStreamable')]()`

> Stability: 1 - Experimental

* Returns: {AsyncIterable} stream ကနေ batched chunks တွေကို yield လုပ်ပေးတဲ့ `AsyncIterable<Uint8Array[]>` တစ်ခုပါ။

`--experimental-stream-iter` flag ကို ဖွင့်ထားတဲ့အခါ — `Readable` streams တွေက [`Stream.toAsyncStreamable`][] protocol ကို implement လုပ်ပြီး — [`stream/iter`][] API အနေနဲ့ ထိရောက်စွာ စားသုံးနိုင်စေပါတယ်။

ဒါက stream ရဲ့ internal buffer ကို `Uint8Array[]` batches တွေအဖြစ် ဖယ်ထုတ်ပေးတဲ့ batched async iterator တစ်ခုကို ပေးစွမ်းပြီး — ပုံမှန် `Symbol.asyncIterator` လမ်းကြောင်းရဲ့ chunk တစ်ခုချင်းစီအတွက် Promise overhead ကို သက်သာစေပါတယ်။ Byte-mode streams တွေအတွက်ဆိုရင် chunks တွေကို `Buffer` instances တွေအနေနဲ့ တိုက်ရိုက် yield လုပ်ပါတယ် (`Buffer` က `Uint8Array` ၏ subclass တစ်ခု ဖြစ်ပါတယ်)။ Object-mode သို့မဟုတ် encoded streams တွေအတွက်တော့ — chunk တစ်ခုချင်းစီကို batching မလုပ်ခင် `Uint8Array` အဖြစ် ပုံမှန် ပြောင်းလဲပေးပါတယ်။

ပြန်ပေးလိုက်တဲ့ iterator ကို validated source တစ်ခုအနေနဲ့ tag (အမှတ်အသား) ပြုလုပ်ထားတာမို့ — [`from()`][stream-iter-from] က ၎င်းကို နောက်ထပ် normalization မလုပ်ပဲ ဖြတ်သန်းပေးပါတယ်။

```mjs
import { Readable } from 'node:stream';
import { text, from } from 'node:stream/iter';

const readable = new Readable({
  read() { this.push('hello'); this.push(null); },
});

// Readable is automatically consumed via toAsyncStreamable
console.log(await text(from(readable))); // 'hello'
```

```cjs
const { Readable } = require('node:stream');
const { text, from } = require('node:stream/iter');

async function run() {
  const readable = new Readable({
    read() { this.push('hello'); this.push(null); },
  });

  console.log(await text(from(readable))); // 'hello'
}

run().catch(console.error);
```

`--experimental-stream-iter` flag မရှိဘဲ ဒီ method ကို ခေါ်လိုက်ရင် — [`ERR_STREAM_ITER_MISSING_FLAG`][] ကို throw လုပ်ပါတယ်။

##### `readable[Symbol.asyncDispose]()`

`AbortError` တစ်ခုနဲ့အတူ [`readable.destroy()`][readable-destroy] ကို ခေါ်ပြီး — stream ပြီးဆုံးသွားတဲ့အခါ fulfilled ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

##### `readable.compose(stream[, options])`

* `stream` {Writable|Duplex|WritableStream|TransformStream|Function}
* `options` {Object}
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် stream ကို destroy လုပ်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Duplex} `stream` နဲ့ ပေါင်းစပ်ထားတဲ့ (composed) stream တစ်ခုပါ။

```mjs
import { Readable } from 'node:stream';

async function* splitToWords(source) {
  for await (const chunk of source) {
    const words = String(chunk).split(' ');

    for (const word of words) {
      yield word;
    }
  }
}

const wordsStream = Readable.from(['text passed through', 'composed stream']).compose(splitToWords);
const words = await wordsStream.toArray();

console.log(words); // prints ['text', 'passed', 'through', 'composed', 'stream']
```

`readable.compose(s)` က `stream.compose(readable, s)` နဲ့ ညီမျှပါတယ်။

ဒီ method က {AbortSignal} တစ်ခုကိုပါ ပေးနိုင်စေပြီး — abort လုပ်လိုက်တဲ့အခါ composed stream ကို destroy လုပ်ပါလိမ့်မယ်။

နောက်ထပ် အချက်အလက်တွေအတွက် [`stream.compose(...streams)`][] ကို ကြည့်ပါ။

##### `readable.iterator([options])`

* `options` {Object}
  * `destroyOnReturn` {boolean} `false` လို့ သတ်မှတ်ထားရင် — async iterator ပေါ်မှာ `return` ကို ခေါ်တာ (သို့) `break`, `return` (သို့) `throw` သုံးပြီး `for await...of` iteration တစ်ခုကနေ ထွက်လိုက်တာက stream ကို destroy လုပ်မှာ မဟုတ်ပါဘူး။ **Default:** `true`။
* Returns: {AsyncIterator} stream ကို စားသုံးဖို့အတွက် ဖြစ်ပါတယ်။

ဒီ method က ဖန်တီးပေးတဲ့ iterator က — `for await...of` loop ကို `return`, `break` (သို့) `throw` နဲ့ ထွက်လိုက်ရင် stream ကို destroy လုပ်တာကို ပယ်ဖျက်နိုင်တဲ့ option တစ်ခုကို users တွေအား ပေးပါတယ်။ ဒါ့အပြင် — iteration အတွင်းမှာ stream က error တစ်ခု emit လုပ်ခဲ့ရင် ဒီ iterator က stream ကို destroy သင့်လားဆိုတာလည်း ပါဝင်ပါတယ်။

```js
const { Readable } = require('node:stream');

async function printIterator(readable) {
  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // false

  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // Will print 2 and then 3
  }

  console.log(readable.destroyed); // True, stream was totally consumed
}

async function printSymbolAsyncIterator(readable) {
  for await (const chunk of readable) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // true
}

async function showBoth() {
  await printIterator(Readable.from([1, 2, 3]));
  await printSymbolAsyncIterator(Readable.from([1, 2, 3]));
}

showBoth();
```

##### `readable.map(fn[, options])`

> Stability: 1 - Experimental

* `fn` {Function|AsyncFunction} stream ထဲက chunk တိုင်းကို map လုပ်ဖို့ function တစ်ခုပါ။
  * `data` {any} stream ကနေ ရတဲ့ data chunk တစ်ခုပါ။
  * `options` {Object}
    * `signal` {AbortSignal} stream ကို destroy လုပ်လိုက်ရင် abort ဖြစ်ပြီး — `fn` call ကို စောစောစီးစီး abort လုပ်ခွင့်ပြုပါတယ်။
* `options` {Object}
  * `concurrency` {number} stream ပေါ်မှာ `fn` ကို တစ်ပြိုင်နက် (concurrently) ခေါ်နိုင်တဲ့ အများဆုံး အရေအတွက်ပါ။ **Default:** `1`။
  * `highWaterMark` {number} mapped items တွေကို user က စားသုံးဖို့ စောင့်နေစဉ်မှာ buffer လုပ်ထားရမယ့် items အရေအတွက်ပါ။ **Default:** `concurrency * 2 - 1`။
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် stream ကို destroy လုပ်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Readable} `fn` function နဲ့ map လုပ်ထားတဲ့ stream တစ်ခုပါ။

ဒီ method က stream ကို map လုပ်နိုင်စေပါတယ်။ Stream ထဲက chunk တိုင်းအတွက် `fn` function ကို ခေါ်ပါလိမ့်မယ်။ `fn` function က promise တစ်ခု ပြန်ပေးမယ်ဆိုရင် — အဲဒီ promise ကို ရလာတဲ့ stream ဆီကို မပို့ခင် `await` လုပ်ပါလိမ့်မယ်။

```mjs
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// With a synchronous mapper.
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// With an asynchronous mapper, making at most 2 queries at a time.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // Logs the DNS result of resolver.resolve4.
}
```

##### `readable.filter(fn[, options])`

> Stability: 1 - Experimental

* `fn` {Function|AsyncFunction} stream ကနေ chunks တွေကို filter လုပ်ဖို့ function တစ်ခုပါ။
  * `data` {any} stream ကနေ ရတဲ့ data chunk တစ်ခုပါ။
  * `options` {Object}
    * `signal` {AbortSignal} stream ကို destroy လုပ်လိုက်ရင် abort ဖြစ်ပြီး — `fn` call ကို စောစောစီးစီး abort လုပ်ခွင့်ပြုပါတယ်။
* `options` {Object}
  * `concurrency` {number} stream ပေါ်မှာ `fn` ကို တစ်ပြိုင်နက် (concurrently) ခေါ်နိုင်တဲ့ အများဆုံး အရေအတွက်ပါ။ **Default:** `1`။
  * `highWaterMark` {number} filtered items တွေကို user က စားသုံးဖို့ စောင့်နေစဉ်မှာ buffer လုပ်ထားရမယ့် items အရေအတွက်ပါ။ **Default:** `concurrency * 2 - 1`။
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် stream ကို destroy လုပ်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Readable} `fn` predicate နဲ့ filter လုပ်ထားတဲ့ stream တစ်ခုပါ။

ဒီ method က stream ကို filter လုပ်နိုင်စေပါတယ်။ Stream ထဲက chunk တစ်ခုချင်းစီအတွက် `fn` function ကို ခေါ်ပြီး — ၎င်းက truthy တန်ဖိုး တစ်ခု ပြန်ပေးမယ်ဆိုရင် အဲဒီ chunk ကို ရလာတဲ့ stream ဆီကို ပေးပို့ပါလိမ့်မယ်။ `fn` function က promise တစ်ခု ပြန်ပေးမယ်ဆိုရင် — အဲဒီ promise ကို `await` လုပ်ပါလိမ့်မယ်။

```mjs
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// With a synchronous predicate.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// With an asynchronous predicate, making at most 2 queries at a time.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).filter(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address.ttl > 60;
}, { concurrency: 2 });
for await (const result of dnsResults) {
  // Logs domains with more than 60 seconds on the resolved dns record.
  console.log(result);
}
```

##### `readable.forEach(fn[, options])`

> Stability: 1 - Experimental

* `fn` {Function|AsyncFunction} stream ထဲက chunk တစ်ခုချင်းစီမှာ ခေါ်ယူရမယ့် function တစ်ခုပါ။
  * `data` {any} stream ကနေ ရတဲ့ data chunk တစ်ခုပါ။
  * `options` {Object}
    * `signal` {AbortSignal} stream ကို destroy လုပ်လိုက်ရင် abort ဖြစ်ပြီး — `fn` call ကို စောစောစီးစီး abort လုပ်ခွင့်ပြုပါတယ်။
* `options` {Object}
  * `concurrency` {number} stream ပေါ်မှာ `fn` ကို တစ်ပြိုင်နက် (concurrently) ခေါ်နိုင်တဲ့ အများဆုံး အရေအတွက်ပါ။ **Default:** `1`။
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် stream ကို destroy လုပ်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Promise} stream ပြီးဆုံးသွားတဲ့အချိန်အတွက် promise တစ်ခုပါ။

ဒီ method က stream တစ်ခုကို iterate (တစ်ခုပြီးတစ်ခု ဖြတ်သန်း) လုပ်နိုင်စေပါတယ်။ Stream ထဲက chunk တစ်ခုချင်းစီအတွက် `fn` function ကို ခေါ်ပါလိမ့်မယ်။ `fn` function က promise တစ်ခု ပြန်ပေးမယ်ဆိုရင် — အဲဒီ promise ကို `await` လုပ်ပါလိမ့်မယ်။

ဒီ method က chunks တွေကို ဆန္ဒရှိရင် တစ်ပြိုင်နက် (concurrently) process လုပ်နိုင်တာကြောင့် — `for await...of` loops တွေနဲ့ ကွဲပြားပါတယ်။ ထို့အပြင် — `forEach` iteration တစ်ခုကို `signal` option တစ်ခု ပေးပြီး သက်ဆိုင်တဲ့ `AbortController` ကို abort လုပ်ခြင်းအားဖြင့်သာ ရပ်တန့်နိုင်ပြီး — `for await...of` ကတော့ `break` (သို့) `return` နဲ့ ရပ်တန့်နိုင်ပါတယ်။ ဘယ်လိုပဲ ဖြစ်ဖြစ် — stream ကို destroy လုပ်ပါလိမ့်မယ်။

ဒီ method က အခြေခံ ယန္တရား (machinery) ထဲမှာ [`readable`][] event ကို သုံးပြီး — တစ်ပြိုင်နက် လုပ်ဆောင်တဲ့ `fn` calls အရေအတွက်ကို ကန့်သတ်နိုင်တာကြောင့် — [`'data'`][] event ကို နားထောင်တာနဲ့ ကွဲပြားပါတယ်။

```mjs
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// With a synchronous predicate.
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// With an asynchronous predicate, making at most 2 queries at a time.
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 });
await dnsResults.forEach((result) => {
  // Logs result, similar to `for await (const result of dnsResults)`
  console.log(result);
});
console.log('done'); // Stream has finished
```

##### `readable.toArray([options])`

> Stability: 1 - Experimental

* `options` {Object}
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် toArray လုပ်ဆောင်ချက်ကို ပယ်ဖျက်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Promise} stream ရဲ့ contents တွေ ပါဝင်တဲ့ array တစ်ခုကို ပေးမယ့် promise တစ်ခုပါ။

ဒီ method က stream တစ်ခုရဲ့ contents တွေကို လွယ်ကူစွာ ရယူနိုင်စေပါတယ်။

ဒီ method က stream တစ်ခုလုံးကို memory ထဲကို ဖတ်သွင်းတာမို့ — streams တွေရဲ့ အကျိုးကျေးဇူးတွေကို ဖျောက်ပစ်လိုက်ပါတယ်။ ၎င်းက streams တွေကို စားသုံးဖို့ အဓိက နည်းလမ်း မဟုတ်ဘဲ — အချင်းချင်း ဆက်သွယ်နိုင်မှု (interoperability) နဲ့ အဆင်ပြေမှု အတွက် ရည်ရွယ်ထားတာပါ။

```mjs
import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

const resolver = new Resolver();

// Make dns queries concurrently using .map and collect
// the results into an array using toArray
const dnsResults = await Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 }).toArray();
```

##### `readable.some(fn[, options])`

> Stability: 1 - Experimental

* `fn` {Function|AsyncFunction} stream ထဲက chunk တစ်ခုချင်းစီမှာ ခေါ်ယူရမယ့် function တစ်ခုပါ။
  * `data` {any} stream ကနေ ရတဲ့ data chunk တစ်ခုပါ။
  * `options` {Object}
    * `signal` {AbortSignal} stream ကို destroy လုပ်လိုက်ရင် abort ဖြစ်ပြီး — `fn` call ကို စောစောစီးစီး abort လုပ်ခွင့်ပြုပါတယ်။
* `options` {Object}
  * `concurrency` {number} stream ပေါ်မှာ `fn` ကို တစ်ပြိုင်နက် (concurrently) ခေါ်နိုင်တဲ့ အများဆုံး အရေအတွက်ပါ။ **Default:** `1`။
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် stream ကို destroy လုပ်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Promise} chunks တွေထဲက အနည်းဆုံး တစ်ခုအတွက် `fn` က truthy တန်ဖိုး ပြန်ပေးခဲ့ရင် `true` အဖြစ် အကဲဖြတ်ပေးတဲ့ promise တစ်ခုပါ။

ဒီ method က `Array.prototype.some` နဲ့ ဆင်တူပြီး — awaited return တန်ဖိုးက `true` (သို့မဟုတ် ဘယ် truthy တန်ဖိုးမဆို) ဖြစ်သွားသည့်တိုင်အောင် — stream ထဲက chunk တစ်ခုချင်းစီမှာ `fn` ကို ခေါ်ပါတယ်။ Chunk တစ်ခုပေါ်မှာ `fn` call ရဲ့ awaited return တန်ဖိုးက truthy ဖြစ်သွားတာနဲ့ — stream ကို destroy လုပ်ပြီး promise ကို `true` နဲ့ fulfill လုပ်ပါတယ်။ Chunks တွေပေါ်မှာ `fn` calls တစ်ခုမှ truthy တန်ဖိုး မပြန်ပေးဘူးဆိုရင် — promise ကို `false` နဲ့ fulfill လုပ်ပါတယ်။

```mjs
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// With a synchronous predicate.
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// With an asynchronous predicate, making at most 2 file checks at a time.
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // `true` if any file in the list is bigger than 1MB
console.log('done'); // Stream has finished
```

##### `readable.find(fn[, options])`

> Stability: 1 - Experimental

* `fn` {Function|AsyncFunction} stream ထဲက chunk တစ်ခုချင်းစီမှာ ခေါ်ယူရမယ့် function တစ်ခုပါ။
  * `data` {any} stream ကနေ ရတဲ့ data chunk တစ်ခုပါ။
  * `options` {Object}
    * `signal` {AbortSignal} stream ကို destroy လုပ်လိုက်ရင် abort ဖြစ်ပြီး — `fn` call ကို စောစောစီးစီး abort လုပ်ခွင့်ပြုပါတယ်။
* `options` {Object}
  * `concurrency` {number} stream ပေါ်မှာ `fn` ကို တစ်ပြိုင်နက် (concurrently) ခေါ်နိုင်တဲ့ အများဆုံး အရေအတွက်ပါ။ **Default:** `1`။
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် stream ကို destroy လုပ်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Promise} `fn` က truthy တန်ဖိုးနဲ့ အကဲဖြတ်ခဲ့တဲ့ ပထမဆုံး chunk ကို ပေးတဲ့ promise တစ်ခုပါ — element တစ်ခုမှ မတွေ့ရရင်တော့ `undefined` ဖြစ်ပါတယ်။

ဒီ method က `Array.prototype.find` နဲ့ ဆင်တူပြီး — `fn` အတွက် truthy တန်ဖိုး ရှိတဲ့ chunk တစ်ခုကို ရှာဖွေဖို့ stream ထဲက chunk တစ်ခုချင်းစီမှာ `fn` ကို ခေါ်ပါတယ်။ `fn` call တစ်ခုရဲ့ awaited return တန်ဖိုးက truthy ဖြစ်သွားတာနဲ့ — stream ကို destroy လုပ်ပြီး `fn` က truthy တန်ဖိုး ပြန်ပေးခဲ့တဲ့ value နဲ့ promise ကို fulfill လုပ်ပါတယ်။ Chunks တွေပေါ်မှာ `fn` calls အားလုံးက falsy တန်ဖိုး ပြန်ပေးခဲ့ရင် — promise ကို `undefined` နဲ့ fulfill လုပ်ပါတယ်။

```mjs
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// With a synchronous predicate.
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // undefined

// With an asynchronous predicate, making at most 2 file checks at a time.
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // File name of large file, if any file in the list is bigger than 1MB
console.log('done'); // Stream has finished
```

##### `readable.every(fn[, options])`

> Stability: 1 - Experimental

* `fn` {Function|AsyncFunction} stream ထဲက chunk တစ်ခုချင်းစီမှာ ခေါ်ယူရမယ့် function တစ်ခုပါ။
  * `data` {any} stream ကနေ ရတဲ့ data chunk တစ်ခုပါ။
  * `options` {Object}
    * `signal` {AbortSignal} stream ကို destroy လုပ်လိုက်ရင် abort ဖြစ်ပြီး — `fn` call ကို စောစောစီးစီး abort လုပ်ခွင့်ပြုပါတယ်။
* `options` {Object}
  * `concurrency` {number} stream ပေါ်မှာ `fn` ကို တစ်ပြိုင်နက် (concurrently) ခေါ်နိုင်တဲ့ အများဆုံး အရေအတွက်ပါ။ **Default:** `1`။
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် stream ကို destroy လုပ်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Promise} chunks တွေ အားလုံးအတွက် `fn` က truthy တန်ဖိုး ပြန်ပေးခဲ့ရင် `true` အဖြစ် အကဲဖြတ်ပေးတဲ့ promise တစ်ခုပါ။

ဒီ method က `Array.prototype.every` နဲ့ ဆင်တူပြီး — awaited return တန်ဖိုးတွေ အားလုံး `fn` အတွက် truthy တန်ဖိုးတွေ ဟုတ်မဟုတ် စစ်ဆေးဖို့ stream ထဲက chunk တစ်ခုချင်းစီမှာ `fn` ကို ခေါ်ပါတယ်။ Chunk တစ်ခုပေါ်မှာ `fn` call ရဲ့ awaited return တန်ဖိုးက falsy ဖြစ်သွားတာနဲ့ — stream ကို destroy လုပ်ပြီး promise ကို `false` နဲ့ fulfill လုပ်ပါတယ်။ Chunks တွေပေါ်မှာ `fn` calls အားလုံးက truthy တန်ဖိုး ပြန်ပေးခဲ့ရင် — promise ကို `true` နဲ့ fulfill လုပ်ပါတယ်။

```mjs
import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// With a synchronous predicate.
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// With an asynchronous predicate, making at most 2 file checks at a time.
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stats.size > 1024 * 1024;
}, { concurrency: 2 });
// `true` if all files in the list are bigger than 1MiB
console.log(allBigFiles);
console.log('done'); // Stream has finished
```

##### `readable.flatMap(fn[, options])`

> Stability: 1 - Experimental

* `fn` {Function|AsyncGeneratorFunction|AsyncFunction} stream ထဲက chunk တိုင်းကို map လုပ်ဖို့ function တစ်ခုပါ။
  * `data` {any} stream ကနေ ရတဲ့ data chunk တစ်ခုပါ။
  * `options` {Object}
    * `signal` {AbortSignal} stream ကို destroy လုပ်လိုက်ရင် abort ဖြစ်ပြီး — `fn` call ကို စောစောစီးစီး abort လုပ်ခွင့်ပြုပါတယ်။
* `options` {Object}
  * `concurrency` {number} stream ပေါ်မှာ `fn` ကို တစ်ပြိုင်နက် (concurrently) ခေါ်နိုင်တဲ့ အများဆုံး အရေအတွက်ပါ။ **Default:** `1`။
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် stream ကို destroy လုပ်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Readable} `fn` function နဲ့ flat-map လုပ်ထားတဲ့ stream တစ်ခုပါ။

ဒီ method က ပေးထားတဲ့ callback ကို stream ရဲ့ chunk တစ်ခုချင်းစီမှာ အသုံးချပြီး — ရလာတဲ့ ရလဒ်ကို flatten (အပြားချ) လုပ်ခြင်းအားဖြင့် — stream အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

`fn` ကနေ stream တစ်ခု (သို့) တခြား iterable (သို့) async iterable တစ်ခုကို ပြန်ပေးနိုင်ပြီး — ရလာတဲ့ streams တွေကို ပြန်ပေးလိုက်တဲ့ stream ထဲကို merged (flattened) လုပ်ပါလိမ့်မယ်။

```mjs
import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// With a synchronous mapper.
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// With an asynchronous mapper, combine the contents of 4 files
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // This will contain the contents (all chunks) of all 4 files
  console.log(result);
}
```

##### `readable.drop(limit[, options])`

> Stability: 1 - Experimental

* `limit` {number} readable ကနေ ပစ်ချ (drop) ရမယ့် chunks အရေအတွက်ပါ။
* `options` {Object}
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် stream ကို destroy လုပ်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Readable} `limit` chunks ပစ်ချထားတဲ့ stream တစ်ခုပါ။

ဒီ method က ပထမ `limit` chunks တွေကို ပစ်ချထားတဲ့ stream အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```

##### `readable.take(limit[, options])`

> Stability: 1 - Experimental

* `limit` {number} readable ကနေ ယူမယ့် chunks အရေအတွက်ပါ။
* `options` {Object}
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် stream ကို destroy လုပ်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Readable} `limit` chunks ယူထားတဲ့ stream တစ်ခုပါ။

ဒီ method က ပထမ `limit` chunks တွေ ပါဝင်တဲ့ stream အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
```

##### `readable.reduce(fn[, initial[, options]])`

> Stability: 1 - Experimental

* `fn` {Function|AsyncFunction} stream ထဲက chunk တိုင်းအပေါ်မှာ ခေါ်ယူရမယ့် reducer function တစ်ခုပါ။
  * `previous` {any} နောက်ဆုံး `fn` call ကနေ ရရှိခဲ့တဲ့ တန်ဖိုး ဖြစ်ပါတယ် — `initial` ကို သတ်မှတ်ထားရင် အဲဒီ `initial` တန်ဖိုး ဖြစ်ပြီး — မသတ်မှတ်ထားရင်တော့ stream ရဲ့ ပထမဆုံး chunk ဖြစ်ပါတယ်။
  * `data` {any} stream ကနေ ရတဲ့ data chunk တစ်ခုပါ။
  * `options` {Object}
    * `signal` {AbortSignal} stream ကို destroy လုပ်လိုက်ရင် abort ဖြစ်ပြီး — `fn` call ကို စောစောစီးစီး abort လုပ်ခွင့်ပြုပါတယ်။
* `initial` {any} reduction ထဲမှာ သုံးဖို့ ကနဦး (initial) တန်ဖိုးပါ။
* `options` {Object}
  * `signal` {AbortSignal} signal ကို abort လုပ်လိုက်ရင် stream ကို destroy လုပ်ဖို့ ခွင့်ပြုပါတယ်။
* Returns: {Promise} reduction ရဲ့ နောက်ဆုံး တန်ဖိုးအတွက် promise တစ်ခုပါ။

ဒီ method က stream ရဲ့ chunk တစ်ခုချင်းစီပေါ်မှာ `fn` ကို အစဉ်လိုက် ခေါ်ပြီး — ယခင် element ပေါ်က တွက်ချက်မှု ရလဒ်ကို ၎င်းဆီကို ဖြတ်သန်းပေးပါတယ်။ Reduction ရဲ့ နောက်ဆုံး တန်ဖိုးအတွက် promise တစ်ခုကို ပြန်ပေးပါတယ်။

`initial` တန်ဖိုး ပေးမထားဘူးဆိုရင် — stream ရဲ့ ပထမဆုံး chunk ကို initial တန်ဖိုးအဖြစ် သုံးပါတယ်။ Stream က ဗလာ (empty) ဖြစ်နေရင် — `ERR_INVALID_ARGS` code property ပါတဲ့ `TypeError` တစ်ခုနဲ့ promise ကို reject လုပ်ပါတယ်။

```mjs
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .reduce(async (totalSize, file) => {
    const { size } = await stat(join(directoryPath, file));
    return totalSize + size;
  }, 0);

console.log(folderSize);
```

Reducer function က stream ကို element တစ်ခုပြီးတစ်ခု iterate လုပ်တာမို့ — `concurrency` parameter (သို့) parallelism မရှိပါဘူး။ `reduce` ကို တစ်ပြိုင်နက် လုပ်ဆောင်ချင်ရင် — async function ကို [`readable.map`][] method ထဲကို ထုတ်ယူပြီး သုံးနိုင်ပါတယ်။

```mjs
import { Readable } from 'node:stream';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = './src';
const filesInDir = await readdir(directoryPath);

const folderSize = await Readable.from(filesInDir)
  .map((file) => stat(join(directoryPath, file)), { concurrency: 2 })
  .reduce((totalSize, { size }) => totalSize + size, 0);

console.log(folderSize);
```

### Duplex နှင့် transform streams များ (Duplex and transform streams)

#### Class: `stream.Duplex`

Duplex streams တွေက [`Readable`][] ရော [`Writable`][] interfaces နှစ်ခုလုံးကိုပါ implement လုပ်တဲ့ streams တွေ ဖြစ်ပါတယ်။

`Duplex` streams တွေရဲ့ ဥပမာတွေကတော့:

* [TCP sockets][]
* [zlib streams][zlib]
* [crypto streams][crypto]

##### `duplex.allowHalfOpen`

* Type: {boolean}

`false` ဆိုရင် — readable side ဆုံးသွားတဲ့အခါ stream က writable side ကို အလိုအလျောက် end လုပ်ပါလိမ့်မယ်။ ၎င်းကို `allowHalfOpen` constructor option က ကနဦး သတ်မှတ်ပေးပြီး — အဲဒီ option ရဲ့ default က `true` ပါ။

ရှိပြီးသား `Duplex` stream instance တစ်ခုရဲ့ half-open အပြုအမူကို ပြောင်းလဲဖို့ ဒါကို လက်နဲ့ ကိုယ်တိုင် ပြောင်းလဲနိုင်ပေမယ့် — `'end'` event ကို emit မလုပ်ခင် ပြောင်းလဲပေးရပါမယ်။

#### Class: `stream.Transform`

Transform streams တွေက input နဲ့ output က တစ်နည်းနည်းနဲ့ ဆက်စပ်နေတဲ့ [`Duplex`][] streams တွေ ဖြစ်ပါတယ်။ [`Duplex`][] streams တွေ အားလုံးလိုပဲ — `Transform` streams တွေက [`Readable`][] ရော [`Writable`][] interfaces နှစ်ခုလုံးကိုပါ implement လုပ်ပါတယ်။

`Transform` streams တွေရဲ့ ဥပမာတွေကတော့:

* [zlib streams][zlib]
* [crypto streams][crypto]

##### `transform.destroy([error])`

* `error` {Error}
* Returns: {this}

Stream ကို destroy လုပ်ပြီး — ဆန္ဒရှိရင် `'error'` event တစ်ခုကိုပါ emit လုပ်ပါတယ်။ ဒီ call ပြီးနောက်မှာ transform stream က ၎င်းရဲ့ internal resources တွေ အားလုံးကို လွှတ်ပေးပါလိမ့်မယ်။ Implementors တွေက ဒီ method ကို override မလုပ်သင့်ဘဲ — [`readable._destroy()`][readable-_destroy] ကိုသာ implement လုပ်သင့်ပါတယ်။ `Transform` အတွက် `_destroy()` ရဲ့ default implementation က — `emitClose` ကို `false` လို့ သတ်မှတ်မထားရင် — `'close'` ကိုပါ emit လုပ်ပါတယ်။

`destroy()` ကို ခေါ်ပြီးတာနဲ့ — နောက်ထပ် ခေါ်ယူမှုတွေ အားလုံးက no-op (ဘာမျှ မလုပ်ဆောင်) ဖြစ်ပြီး — `_destroy()` ကလွဲရင် နောက်ထပ် errors တွေကို `'error'` အဖြစ် emit လုပ်မှာ မဟုတ်ပါဘူး။

#### `stream.duplexPair([options])`

* `options` {Object} [`Duplex`][] constructors နှစ်ခုလုံးဆီကို ပေးပို့ရမယ့် တန်ဖိုးတစ်ခုပါ — buffering လိုမျိုး options တွေ သတ်မှတ်ဖို့ပါ။
* Returns: {Array} [`Duplex`][] instances နှစ်ခု ပါဝင်တဲ့ {Array} တစ်ခုပါ။

`duplexPair` utility function က item နှစ်ခု ပါတဲ့ Array တစ်ခုကို ပြန်ပေးပြီး — item တစ်ခုချင်းစီဟာ တစ်ဖက်နဲ့တစ်ဖက် ချိတ်ဆက်ထားတဲ့ `Duplex` stream တစ်ခု ဖြစ်ပါတယ်:

```js
const [ sideA, sideB ] = duplexPair();
```

Stream တစ်ခုဆီကို ရေးလိုက်တဲ့အရာ အားလုံးက တစ်ခြား stream ပေါ်မှာ readable ဖြစ်လာပါတယ်။ ၎င်းက network connection တစ်ခုနဲ့ ဆင်တူတဲ့ အပြုအမူကို ပေးစွမ်းပြီး — client က ရေးလိုက်တဲ့ data က server အတွက် readable ဖြစ်လာကာ — အပြန်အလှန်လည်း အလားတူ ဖြစ်ပါတယ်။

Duplex streams တွေက symmetrical (အချိုးကျ) ဖြစ်ပြီး — တစ်ခုခုကို အသုံးပြုတာဟာ အပြုအမူပိုင်း ကွာခြားမှု မရှိပါဘူး။

### `stream.finished(stream[, options], callback)`

* `stream` {Stream|ReadableStream|WritableStream} readable နဲ့/သို့မဟုတ် writable stream/webstream တစ်ခုပါ။
* `options` {Object}
  * `error` {boolean} `false` လို့ သတ်မှတ်ထားရင် — `emit('error', err)` ကို ခေါ်တာကို finished အဖြစ် မသတ်မှတ်ပါဘူး။ **Default:** `true`။
  * `readable` {boolean} `false` လို့ သတ်မှတ်ထားရင် — stream က readable ဖြစ်နေဆဲ ဖြစ်နိုင်ပေမယ့် — stream ဆုံးသွားတဲ့အခါ callback ကို ခေါ်ပါလိမ့်မယ်။ **Default:** `true`။
  * `writable` {boolean} `false` လို့ သတ်မှတ်ထားရင် — stream က writable ဖြစ်နေဆဲ ဖြစ်နိုင်ပေမယ့် — stream ဆုံးသွားတဲ့အခါ callback ကို ခေါ်ပါလိမ့်မယ်။ **Default:** `true`။
  * `signal` {AbortSignal} stream finish အတွက် စောင့်ဆိုင်းမှုကို abort လုပ်ဖို့ ခွင့်ပြုပါတယ်။ Signal ကို abort လုပ်လိုက်ရင်တောင် — အခြေခံ (underlying) stream ကို abort လုပ်မှာ _မဟုတ်ပါဘူး_။ Callback ကို `AbortError` တစ်ခုနဲ့ ခေါ်ပါလိမ့်မယ်။ ဒီ function က စာရင်းသွင်းထားတဲ့ (registered) listeners တွေ အားလုံးကိုလည်း ဖယ်ရှားပါလိမ့်မယ်။
* `callback` {Function} Optional error argument တစ်ခုကို လက်ခံတဲ့ callback function တစ်ခုပါ။
* Returns: {Function} စာရင်းသွင်းထားတဲ့ listeners တွေ အားလုံးကို ဖယ်ရှားပေးတဲ့ cleanup function တစ်ခုပါ။

Stream တစ်ခု readable မဟုတ်တော့တဲ့အခါ (သို့) writable မဟုတ်တော့တဲ့အခါ (သို့) error တစ်ခု (သို့) စောလွန်းတဲ့ (premature) close event တစ်ခု ကြုံခဲ့ရတဲ့အခါ — အသိပေးခံရဖို့ function တစ်ခုပါ။

```js
const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('Stream failed.', err);
  } else {
    console.log('Stream is done reading.');
  }
});

rs.resume(); // Drain the stream.
```

Stream တစ်ခုကို စောလွန်းစွာ destroy လုပ်ခံရတဲ့ (aborted HTTP request တစ်ခုလိုမျိုး) — `'end'` (သို့) `'finish'` ကို emit လုပ်မှာ မဟုတ်တဲ့ — error handling အခြေအနေတွေမှာ အထူးသဖြင့် အသုံးဝင်ပါတယ်။

`finished` API က [promise version][stream-finished-promise] ကိုလည်း ပံ့ပိုးပေးပါတယ်။

`stream.finished()` က `callback` ကို ခေါ်ပြီးနောက်မှာ event listeners တွေ (အထူးသဖြင့် `'error'`, `'end'`, `'finish'` နဲ့ `'close'`) ကို ချိတ်ဆွဲထားတဲ့အတိုင်း ကျန်ခဲ့စေပါတယ် (dangling)။ ဒါက မမှန်ကန်တဲ့ stream implementations တွေကြောင့် ဖြစ်ပေါ်လာတဲ့ မမျှော်လင့်ထားတဲ့ `'error'` events တွေက မမျှော်လင့်တဲ့ crashes တွေ မဖြစ်ပွားစေဖို့ အတွက်ပါ။ ဒီအပြုအမူကို မလိုချင်ဘူးဆိုရင် — ပြန်ပေးလိုက်တဲ့ cleanup function ကို callback ထဲမှာ ခေါ်ပေးဖို့ လိုပါတယ်:

```js
const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
```

### `stream.pipeline(source[, ...transforms], destination, callback)`

### `stream.pipeline(streams, callback)`

* `streams` {Stream\[]|Iterable\[]|AsyncIterable\[]|Function\[]|
  ReadableStream\[]|WritableStream\[]|TransformStream\[]}
* `source` {Stream|Iterable|AsyncIterable|Function|ReadableStream}
  * Returns: {Iterable|AsyncIterable}
* `...transforms` {Stream|Function|TransformStream}
  * `source` {AsyncIterable}
  * Returns: {AsyncIterable}
* `destination` {Stream|Function|WritableStream}
  * `source` {AsyncIterable}
  * Returns: {AsyncIterable|Promise}
* `callback` {Function} Pipeline လုံးဝ ပြီးဆုံးတဲ့အခါ ခေါ်ယူပါတယ်။
  * `err` {Error}
  * `val` `destination` က ပြန်ပေးတဲ့ `Promise` ရဲ့ resolved တန်ဖိုးပါ။
* Returns: {Stream}

Streams နဲ့ generators တွေကြားမှာ pipe လုပ်ဖို့ — errors တွေကို ရှေ့ဆက်ပို့ဆောင်ပြီး သင့်လျော်စွာ cleanup လုပ်ကာ — pipeline ပြီးဆုံးတဲ့အခါ callback တစ်ခု ပေးအပ်ဖို့ module method တစ်ခုပါ။

```js
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// Use the pipeline API to easily pipe a series of streams
// together and get notified when the pipeline is fully done.

// A pipeline to gzip a potentially huge tar file efficiently:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed.', err);
    } else {
      console.log('Pipeline succeeded.');
    }
  },
);
```

`pipeline` API က [promise version][stream-pipeline-promise] ကိုလည်း ပံ့ပိုးပေးပါတယ်။

`stream.pipeline()` က အောက်ပါတို့မှလွဲပြီး — streams တွေ အားလုံးပေါ်မှာ `stream.destroy(err)` ကို ခေါ်ပါလိမ့်မယ်:

* `'end'` (သို့) `'close'` ကို emit လုပ်ပြီးသား `Readable` streams တွေပါ။
* `'finish'` (သို့) `'close'` ကို emit လုပ်ပြီးသား `Writable` streams တွေပါ။

`stream.pipeline()` က `callback` ကို ခေါ်ပြီးနောက်မှာ streams တွေပေါ်မှာ event listeners တွေကို ကျန်ခဲ့စေပါတယ် (dangling)။ မအောင်မြင်မှုတစ်ခုပြီးနောက် streams တွေကို ပြန်လည် သုံးစွဲတဲ့ အခြေအနေမျိုးမှာ — ဒါက event listener leaks တွေနဲ့ မျိုချခံလိုက်ရတဲ့ (swallowed) errors တွေကို ဖြစ်စေနိုင်ပါတယ်။ နောက်ဆုံး stream က readable ဖြစ်ရင် — နောက်ဆုံး stream ကို နောက်ပိုင်းမှာ စားသုံးနိုင်အောင် — dangling event listeners တွေကို ဖယ်ရှားပါလိမ့်မယ်။

`stream.pipeline()` က error တစ်ခု ပေါ်ပေါက်လာတဲ့အခါ streams တွေ အားလုံးကို ပိတ်ပါတယ်။ `pipeline` နဲ့ `IncomingRequest` ကို သုံးတာက — မျှော်လင့်ထားတဲ့ response ကို မပို့ပဲ socket ကို destroy လုပ်ပစ်မယ့် အခြေအနေမျိုးမှာ — မမျှော်လင့်တဲ့ အပြုအမူတစ်ခုဆီကို ဦးတည်သွားနိုင်ပါတယ်။ အောက်မှာက ဥပမာပါ:

```js
const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // No such file
      // this message can't be sent once `pipeline` already destroyed the socket
      return res.end('error!!!');
    }
  });
});
```

### `stream.compose(...streams)`

* `streams` {Stream\[]|Iterable\[]|AsyncIterable\[]|Function\[]|
  ReadableStream\[]|WritableStream\[]|TransformStream\[]|Duplex\[]|Function}
* Returns: {stream.Duplex}

Streams နှစ်ခု (သို့) နှစ်ခုထက်ပိုတာတွေကို — ပထမဆုံး stream ဆီကို ရေးပြီး နောက်ဆုံး stream ကနေ ဖတ်တဲ့ — `Duplex` stream တစ်ခုအဖြစ် ပေါင်းစပ်ပေးပါတယ်။ ပေးထားတဲ့ stream တစ်ခုချင်းစီကို `stream.pipeline` ကို သုံးပြီး နောက်တစ်ခုဆီကို pipe လုပ်ပါတယ်။ Streams တွေထဲက တစ်ခုခုမှာ error ဖြစ်ရင် — အပြင်ဘက် (outer) `Duplex` stream အပါအဝင် — အားလုံးကို destroy လုပ်ပါတယ်။

`stream.compose` က — နောက်ပိုင်းမှာ တခြား streams တွေဆီကို pipe လုပ်နိုင် (ပြီး လုပ်သင့်) တဲ့ — stream အသစ်တစ်ခုကို ပြန်ပေးတာမို့ — composition (ပေါင်းစပ်ဖွဲ့စည်းမှု) ကို ဖြစ်နိုင်စေပါတယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — `stream.pipeline` ဆီကို streams တွေ ပေးပို့တဲ့အခါ — ပုံမှန်အားဖြင့် ပထမဆုံး stream က readable stream ဖြစ်ပြီး နောက်ဆုံး stream က writable stream ဖြစ်ကာ — ပိတ်လုံးနေတဲ့ (closed) circuit တစ်ခု ဖြစ်ပေါ်ပါတယ်။

`Function` တစ်ခုကို ပေးလိုက်ရင် — ၎င်းက `source` `Iterable` တစ်ခုကို လက်ခံတဲ့ factory method တစ်ခု ဖြစ်ရပါမယ်။

```mjs
import { compose, Transform } from 'node:stream';

const removeSpaces = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, String(chunk).replace(' ', ''));
  },
});

async function* toUpper(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
}

let res = '';
for await (const buf of compose(removeSpaces, toUpper).end('hello world')) {
  res += buf;
}

console.log(res); // prints 'HELLOWORLD'
```

`stream.compose` ကို async iterables, generators နဲ့ functions တွေကို streams အဖြစ် ပြောင်းလဲဖို့ သုံးနိုင်ပါတယ်။

* `AsyncIterable` က readable `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။ `null` ကို yield လုပ်လို့ မရပါဘူး။
* `AsyncGeneratorFunction` က readable/writable transform `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။ ပထမဆုံး parameter အနေနဲ့ source `AsyncIterable` တစ်ခုကို လက်ခံရပါမယ်။ `null` ကို yield လုပ်လို့ မရပါဘူး။
* `AsyncFunction` က writable `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။ `null` (သို့) `undefined` တစ်ခုခုကို ပြန်ပေးရပါမယ်။

```mjs
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// Convert AsyncIterable into readable Duplex.
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// Convert AsyncGenerator into transform Duplex.
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// Convert AsyncFunction into writable Duplex.
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // prints 'HELLOWORLD'
```

အဆင်ပြေစေဖို့ — {Readable} နဲ့ {Duplex} streams တွေပေါ်မှာ ဒီ function ရဲ့ wrapper တစ်ခုအနေနဲ့ — [`readable.compose(stream)`][] method ကို ရရှိနိုင်ပါတယ်။

### `stream.isDestroyed(stream)`

* `stream` {Readable|Writable|Duplex}
* Returns: {boolean|null} — `stream` က valid `Readable`, `Writable` (သို့) `Duplex` မဟုတ်ရင် `null` ကိုသာ ပြန်ပေးပါတယ်။

Stream ကို destroy လုပ်ထားပြီးသားလားဆိုတာကို ပြန်ပေးပါတယ်။

### `stream.isErrored(stream)`

* `stream` {Readable|Writable|Duplex|WritableStream|ReadableStream}
* Returns: {boolean}

Stream မှာ error တစ်ခု ကြုံခဲ့ဖူးလားဆိုတာကို ပြန်ပေးပါတယ်။

### `stream.isReadable(stream)`

* `stream` {Readable|Duplex|ReadableStream}
* Returns: {boolean|null} — `stream` က valid `Readable`, `Duplex` (သို့) `ReadableStream` မဟုတ်ရင် `null` ကိုသာ ပြန်ပေးပါတယ်။

Stream က readable ဖြစ်မဖြစ်ကို ပြန်ပေးပါတယ်။

### `stream.isWritable(stream)`

* `stream` {Writable|Duplex|WritableStream}
* Returns: {boolean|null} — `stream` က valid `Writable`, `Duplex` (သို့) `WritableStream` မဟုတ်ရင် `null` ကိုသာ ပြန်ပေးပါတယ်။

Stream က writable ဖြစ်မဖြစ်ကို ပြန်ပေးပါတယ်။

### `stream.Readable.from(iterable[, options])`

* `iterable` {Iterable} `Symbol.asyncIterator` (သို့) `Symbol.iterator` iterable protocol ကို implement လုပ်ထားတဲ့ Object တစ်ခုပါ။ Null တန်ဖိုး တစ်ခုကို ဖြတ်သန်းပေးလိုက်ရင် 'error' event တစ်ခုကို emit လုပ်ပါတယ်။
* `options` {Object} `new stream.Readable([options])` ဆီကို ပေးပို့တဲ့ options တွေပါ။ Default အနေနဲ့ `Readable.from()` က `options.objectMode` ကို `true` အဖြစ် သတ်မှတ်ပါလိမ့်မယ် — `options.objectMode` ကို `false` လို့ သတ်မှတ်ပြီး တိုက်ရိုက် (explicitly) ငြင်းဆန်ထားခြင်း မရှိရင် ဖြစ်ပါတယ်။
* Returns: {stream.Readable}

Iterators တွေကနေ readable streams တွေကို ဖန်တီးဖို့ utility method တစ်ခုပါ။

```js
const { Readable } = require('node:stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
```

စွမ်းဆောင်ရည် (performance) အကြောင်းပြချက်တွေကြောင့် — `Readable.from(string)` (သို့) `Readable.from(buffer)` ကို ခေါ်တာက တခြား streams တွေရဲ့ semantics တွေနဲ့ ကိုက်ညီအောင် — strings (သို့) buffers တွေကို iterate လုပ်ပေးမှာ မဟုတ်ပါဘူး။

Promises တွေ ပါဝင်တဲ့ `Iterable` object တစ်ခုကို argument အဖြစ် ဖြတ်သန်းပေးလိုက်ရင် — unhandled rejection (ကိုင်တွယ်မှု မရှိတဲ့ rejection) တစ်ခုကို ဖြစ်ပေါ်စေနိုင်ပါတယ်။

```js
const { Readable } = require('node:stream');

Readable.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Unhandled rejection
]);
```

### `stream.Readable.fromWeb(readableStream[, options])`

* `readableStream` {ReadableStream}
* `options` {Object}
  * `encoding` {string}
  * `highWaterMark` {number}
  * `objectMode` {boolean}
  * `signal` {AbortSignal}
* Returns: {stream.Readable}

### `stream.Readable.isDisturbed(stream)`

* `stream` {stream.Readable|ReadableStream}
* Returns: `boolean`

Stream ကနေ ဖတ်ပြီးသား (သို့) cancelled (ပယ်ဖျက်) လုပ်ထားပြီးသားလားဆိုတာကို ပြန်ပေးပါတယ်။

### `stream.Readable.toWeb(streamReadable[, options])`

* `streamReadable` {stream.Readable}
* `options` {Object}
  * `strategy` {Object}
    * `highWaterMark` {number} ပေးထားတဲ့ `stream.Readable` ကနေ ဖတ်ရှုရာမှာ backpressure သက်ရောက်မလာခင် (ဖန်တီးလိုက်တဲ့ `ReadableStream` ရဲ့) အများဆုံး internal queue size ပါ။ တန်ဖိုး ပေးမထားရင် — ပေးထားတဲ့ `stream.Readable` ကနေ ယူပါလိမ့်မယ်။
    * `size` {Function} ပေးထားတဲ့ data chunk တစ်ခုရဲ့ size ကို ပြန်ပေးတဲ့ function တစ်ခုပါ။ တန်ဖိုး ပေးမထားရင် — chunks တွေ အားလုံးအတွက် size က `1` ဖြစ်ပါလိမ့်မယ်။
      * `chunk` {any}
      * Returns: {number}
  * `type` {string} ဖန်တီးလိုက်တဲ့ `ReadableStream` ရဲ့ type ကို သတ်မှတ်ပေးပါတယ်။ `'bytes'` (သို့) undefined ဖြစ်ရပါမယ်။
* Returns: {ReadableStream}

### `stream.Writable.fromWeb(writableStream[, options])`

* `writableStream` {WritableStream}
* `options` {Object}
  * `decodeStrings` {boolean}
  * `highWaterMark` {number}
  * `objectMode` {boolean}
  * `signal` {AbortSignal}
* Returns: {stream.Writable}

### `stream.Writable.toWeb(streamWritable)`

* `streamWritable` {stream.Writable}
* Returns: {WritableStream}

### `stream.Duplex.from(src)`

* `src` {Stream|Blob|ArrayBuffer|string|Iterable|AsyncIterable|
  AsyncGeneratorFunction|AsyncFunction|Promise|Object|
  ReadableStream|WritableStream}

Duplex streams တွေကို ဖန်တီးဖို့ utility method တစ်ခုပါ။

* `Stream` က writable stream တစ်ခုကို writable `Duplex` အဖြစ်လည်းကောင်း — readable stream တစ်ခုကို `Duplex` အဖြစ်လည်းကောင်း ပြောင်းလဲပေးပါတယ်။
* `Blob` က readable `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။
* `string` က readable `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။
* `ArrayBuffer` က readable `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။
* `AsyncIterable` က readable `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။ `null` ကို yield လုပ်လို့ မရပါဘူး။
* `AsyncGeneratorFunction` က readable/writable transform `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။ ပထမဆုံး parameter အနေနဲ့ source `AsyncIterable` တစ်ခုကို လက်ခံရပါမယ်။ `null` ကို yield လုပ်လို့ မရပါဘူး။
* `AsyncFunction` က writable `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။ `null` (သို့) `undefined` တစ်ခုခုကို ပြန်ပေးရပါမယ်
* `Object ({ writable, readable })` က `readable` နဲ့ `writable` တို့ကို `Stream` အဖြစ် ပြောင်းလဲပြီး — ၎င်းတို့ကို `Duplex` အဖြစ် ပေါင်းစပ်ပေးပါတယ် — အဲဒီမှာ `Duplex` က `writable` ဆီကို ရေးပြီး `readable` ကနေ ဖတ်ပါတယ်။
* `Promise` က readable `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။ `null` တန်ဖိုးကို လျစ်လျူရှုပါတယ်။
* `ReadableStream` က readable `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။
* `WritableStream` က writable `Duplex` အဖြစ် ပြောင်းလဲပေးပါတယ်။
* Returns: {stream.Duplex}

Promises တွေ ပါဝင်တဲ့ `Iterable` object တစ်ခုကို argument အဖြစ် ဖြတ်သန်းပေးလိုက်ရင် — unhandled rejection (ကိုင်တွယ်မှု မရှိတဲ့ rejection) တစ်ခုကို ဖြစ်ပေါ်စေနိုင်ပါတယ်။

```js
const { Duplex } = require('node:stream');

Duplex.from([
  new Promise((resolve) => setTimeout(resolve('1'), 1500)),
  new Promise((_, reject) => setTimeout(reject(new Error('2')), 1000)), // Unhandled rejection
]);
```

### `stream.Duplex.fromWeb(pair[, options])`

* `pair` {Object}
  * `readable` {ReadableStream}
  * `writable` {WritableStream}
* `options` {Object}
  * `allowHalfOpen` {boolean}
  * `decodeStrings` {boolean}
  * `encoding` {string}
  * `highWaterMark` {number}
  * `objectMode` {boolean}
  * `signal` {AbortSignal}
* Returns: {stream.Duplex}

```mjs
import { Duplex } from 'node:stream';
import {
  ReadableStream,
  WritableStream,
} from 'node:stream/web';

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');

for await (const chunk of duplex) {
  console.log('readable', chunk);
}
```

```cjs
const { Duplex } = require('node:stream');
const {
  ReadableStream,
  WritableStream,
} = require('node:stream/web');

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  },
});

const pair = {
  readable,
  writable,
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');
duplex.once('readable', () => console.log('readable', duplex.read()));
```

### `stream.Duplex.toWeb(streamDuplex[, options])`

* `streamDuplex` {stream.Duplex}
* `options` {Object}
  * `readableType` {string} ဖန်တီးလိုက်တဲ့ readable-writable pair ရဲ့ `ReadableStream` တစ်ဝက် (half) ရဲ့ type ကို သတ်မှတ်ပေးပါတယ်။ `'bytes'` (သို့) undefined ဖြစ်ရပါမယ်။ (`options.type` က ဒီ option အတွက် deprecated alias တစ်ခု ဖြစ်ပါတယ်။)
* Returns: {Object}
  * `readable` {ReadableStream}
  * `writable` {WritableStream}

```mjs
import { Duplex } from 'node:stream';

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

const { value } = await readable.getReader().read();
console.log('readable', value);
```

```cjs
const { Duplex } = require('node:stream');

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  },
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

readable.getReader().read().then((result) => {
  console.log('readable', result.value);
});
```

### `stream.addAbortSignal(signal, stream)`

* `signal` {AbortSignal} ဖျက်သိမ်းနိုင်ခြေ ရှိနိုင်တဲ့ (possible cancellation) အခြေအနေကို ကိုယ်စားပြုတဲ့ signal တစ်ခုပါ။
* `stream` {Stream|ReadableStream|WritableStream} signal တစ်ခုကို တွဲဆက်ရမယ့် stream တစ်ခုပါ။

AbortSignal တစ်ခုကို readable (သို့) writable stream တစ်ခုဆီကို တွဲဆက်ပေးပါတယ်။ ဒါက code အနေနဲ့ `AbortController` တစ်ခုကို သုံးပြီး stream destruction ကို ထိန်းချုပ်နိုင်စေပါတယ်။

ပေးပို့လိုက်တဲ့ `AbortSignal` နဲ့ သက်ဆိုင်တဲ့ `AbortController` ပေါ်မှာ `abort` ကို ခေါ်တာက — stream ပေါ်မှာ `.destroy(new AbortError())` ကို ခေါ်တာနဲ့ တူညီတဲ့ ပုံစံအတိုင်း ပြုမူပြီး — webstreams တွေအတွက်တော့ `controller.error(new AbortError())` နဲ့ တူညီပါတယ်။

```js
const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
// Later, abort the operation closing the stream
controller.abort();
```

ဒါမှမဟုတ် readable stream တစ်ခုကို async iterable အဖြစ် `AbortSignal` တစ်ခုနဲ့ သုံးတာမျိုး:

```js
const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // set a timeout
const stream = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json')),
);
(async () => {
  try {
    for await (const chunk of stream) {
      await process(chunk);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      // The operation was cancelled
    } else {
      throw e;
    }
  }
})();
```

ဒါမှမဟုတ် `AbortSignal` တစ်ခုကို ReadableStream တစ်ခုနဲ့ သုံးတာမျိုး:

```js
const controller = new AbortController();
const rs = new ReadableStream({
  start(controller) {
    controller.enqueue('hello');
    controller.enqueue('world');
    controller.close();
  },
});

addAbortSignal(controller.signal, rs);

finished(rs, (err) => {
  if (err) {
    if (err.name === 'AbortError') {
      // The operation was cancelled
    }
  }
});

const reader = rs.getReader();

reader.read().then(({ value, done }) => {
  console.log(value); // hello
  console.log(done); // false
  controller.abort();
});
```

### `stream.getDefaultHighWaterMark(objectMode)`

* `objectMode` {boolean}
* Returns: {integer}

Streams တွေမှာ သုံးတဲ့ default highWaterMark ကို ပြန်ပေးပါတယ်။ `objectMode` အတွက် default က `16` ပါ။ Byte streams တွေအတွက်တော့ — Windows မဟုတ်တဲ့ platforms တွေမှာ `65536` (64 KiB) — Windows မှာတော့ `16384` (16 KiB) ဖြစ်ပါတယ်။

### `stream.setDefaultHighWaterMark(objectMode, value)`

* `objectMode` {boolean}
* `value` {integer} highWaterMark တန်ဖိုးပါ။

Streams တွေမှာ သုံးတဲ့ default highWaterMark ကို သတ်မှတ်ပါတယ်။

## Stream implementers များအတွက် API (API for stream implementers)

`node:stream` module API က JavaScript ရဲ့ prototypal inheritance model (ရှေ့ပြေးပုံစံ အမွေဆက်ခံမှု ပုံစံ) ကို သုံးပြီး streams တွေကို လွယ်ကူစွာ implement လုပ်နိုင်အောင် ဒီဇိုင်းထုတ်ထားပါတယ်။

ပထမဆုံး — stream developer တစ်ယောက်က အခြေခံ stream classes လေးခု (`stream.Writable`, `stream.Readable`, `stream.Duplex` (သို့) `stream.Transform`) ထဲက တစ်ခုခုကို extend လုပ်တဲ့ JavaScript class အသစ်တစ်ခုကို ကြေညာပြီး — သင့်လျော်တဲ့ parent class constructor ကို ခေါ်ဖို့ သေချာစေရပါမယ်:

```js
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```

Streams တွေကို extend လုပ်တဲ့အခါ — ဒီ options တွေကို base constructor ဆီကို မပို့ခင် — user က ဘယ် options တွေကို ပေးနိုင်ပြီး ပေးသင့်လဲဆိုတာကို သတိပြုထားပါ။ ဥပမာ — implementation က `autoDestroy` နဲ့ `emitClose` options တွေနဲ့ ပတ်သက်ပြီး ကြိုတင်ယူဆချက် (assumptions) တွေ လုပ်ထားရင် — user ကို ဒါတွေကို override လုပ်ခွင့် မပေးပါနဲ့။ Options တွေ အားလုံးကို implicitly ရှေ့ဆက် ပို့လိုက်မယ့်အစား — ဘယ် options တွေကို ရှေ့ဆက် ပို့လဲဆိုတာကို တိုက်ရိုက် (explicit) ဖော်ပြထားပါ။

အဲဒီနောက် stream class အသစ်က ဖန်တီးနေတဲ့ stream ရဲ့ အမျိုးအစားပေါ် မူတည်ပြီး — အောက်က ဇယားမှာ အသေးစိတ် ဖော်ပြထားတဲ့အတိုင်း — သီးခြား methods တစ်ခု (သို့) တစ်ခုထက်ပိုတာကို implement လုပ်ရပါမယ်:

| Use-case                                      | Class           | Method(s) to implement                                                                                             |
| --------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ |
| ဖတ်ရှုခြင်းသာ | [`Readable`][] | [`_read()`][stream-_read] |
| ရေးသားခြင်းသာ | [`Writable`][] | [`_write()`][stream-_write], [`_writev()`][stream-_writev], [`_final()`][stream-_final] |
| ဖတ်ရှုခြင်းနှင့် ရေးသားခြင်း | [`Duplex`][] | [`_read()`][stream-_read], [`_write()`][stream-_write], [`_writev()`][stream-_writev], [`_final()`][stream-_final] |
| ရေးသားလိုက်သော data ကို လုပ်ဆောင်ပြီး ရလဒ်ကို ဖတ်ရှုခြင်း | [`Transform`][] | [`_transform()`][stream-_transform], [`_flush()`][stream-_flush], [`_final()`][stream-_final] |

Stream တစ်ခုအတွက် implementation code က consumers တွေ သုံးဖို့ ရည်ရွယ်ထားတဲ့ ([API for stream consumers][] section မှာ ဖော်ပြထားတဲ့အတိုင်း) stream ရဲ့ "public" methods တွေကို _ဘယ်တော့မှ_ ခေါ်လို့ မရပါဘူး။ ဒီလို လုပ်လိုက်ရင် stream ကို စားသုံးနေတဲ့ application code ထဲမှာ ဆိုးကျိုးသက်ရောက်မှုတွေ (adverse side effects) ဖြစ်ပေါ်စေနိုင်ပါတယ်။

`write()`, `end()`, `cork()`, `uncork()`, `read()` နဲ့ `destroy()` လိုမျိုး public methods တွေကို override လုပ်တာ (သို့) `.emit()` ကနေတစ်ဆင့် `'error'`, `'data'`, `'end'`, `'finish'` နဲ့ `'close'` လိုမျိုး internal events တွေကို emit လုပ်တာတွေကို ရှောင်ကြဉ်ပါ။ ဒီလို လုပ်လိုက်ရင် လက်ရှိ နဲ့ အနာဂတ် stream invariants တွေကို ချိုးဖောက်မိပြီး — တခြား streams တွေ, stream utilities တွေ နဲ့ user တွေရဲ့ မျှော်လင့်ချက်တွေနဲ့ ပတ်သက်ပြီး — အပြုအမူ နဲ့/သို့မဟုတ် compatibility ပြဿနာတွေကို ဖြစ်စေနိုင်ပါတယ်။

### ရိုးရှင်းသော တည်ဆောက်မှု (Simplified construction)

ရိုးရှင်းတဲ့ အခြေအနေတွေ အများစုမှာ — inheritance ကို အားမကိုးပဲ stream တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ `stream.Writable`, `stream.Readable`, `stream.Duplex` (သို့) `stream.Transform` objects တွေရဲ့ instances တွေကို တိုက်ရိုက် ဖန်တီးပြီး — သင့်လျော်တဲ့ methods တွေကို constructor options တွေအဖြစ် ဖြတ်သန်းပေးခြင်းအားဖြင့် ဒါကို ပြီးမြောက်စေနိုင်ပါတယ်။

```js
const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // Initialize state and load resources...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // Free resources...
  },
});
```

### Writable stream တစ်ခုကို အကောင်အထည်ဖော်ခြင်း (Implementing a writable stream)

[`Writable`][] stream တစ်ခုကို implement လုပ်ဖို့ `stream.Writable` class ကို extend လုပ်ပါတယ်။

Custom `Writable` streams တွေက `new stream.Writable([options])` constructor ကို ခေါ်ပြီး — `writable._write()` နဲ့/သို့မဟုတ် `writable._writev()` method ကို implement လုပ်ရပါမယ်။

#### `new stream.Writable([options])`

* `options` {Object}
  * `highWaterMark` {number} Buffer level ပါ — [`stream.write()`][stream-write] က `false` စတင် ပြန်ပေးတဲ့အခါမှာ ဖြစ်ပါတယ်။ **Default:** [`stream.getDefaultHighWaterMark()`][] ကို ကြည့်ပါ။
  * `decodeStrings` {boolean} [`stream.write()`][stream-write] ဆီကို ပေးပို့လိုက်တဲ့ `string`s တွေကို — [`stream._write()`][stream-_write] ဆီကို မပို့ခင် — `Buffer`s အဖြစ် ([`stream.write()`][stream-write] call ထဲမှာ သတ်မှတ်ထားတဲ့ encoding နဲ့) encode လုပ်မလား မလုပ်ဘူးလားဆိုတာပါ။ တခြား data အမျိုးအစားတွေကိုတော့ ပြောင်းလဲပေးမှာ မဟုတ်ပါဘူး (ဆိုလိုတာက — `Buffer`s တွေကို `string`s အဖြစ် decode မလုပ်ပါဘူး)။ `false` လို့ သတ်မှတ်လိုက်ရင် `string`s တွေကို ပြောင်းလဲခြင်းကနေ တားဆီးပါလိမ့်မယ်။ **Default:** `true`။
  * `defaultEncoding` {string} [`stream.write()`][stream-write] ဆီကို argument အနေနဲ့ encoding ဘာမှ မသတ်မှတ်ထားတဲ့အခါ သုံးတဲ့ default encoding ပါ။ **Default:** `'utf8'`။
  * `objectMode` {boolean} [`stream.write(anyObj)`][stream-write] က valid operation တစ်ခု ဟုတ်မဟုတ်ပါ။ သတ်မှတ်လိုက်ရင် — stream implementation က ပံ့ပိုးပေးမယ်ဆိုရင် — string, {Buffer}, {TypedArray} (သို့) {DataView} မဟုတ်တဲ့ JavaScript တန်ဖိုးတွေကိုပါ ရေးသားနိုင်လာပါတယ်။ **Default:** `false`။
  * `emitClose` {boolean} Stream ကို destroy လုပ်ပြီးနောက်မှာ `'close'` ကို emit လုပ်သင့်လား မလုပ်သင့်ဘူးလားပါ။ **Default:** `true`။
  * `write` {Function} [`stream._write()`][stream-_write] method အတွက် implementation ပါ။
  * `writev` {Function} [`stream._writev()`][stream-_writev] method အတွက် implementation ပါ။
  * `destroy` {Function} [`stream._destroy()`][writable-_destroy] method အတွက် implementation ပါ။
  * `final` {Function} [`stream._final()`][stream-_final] method အတွက် implementation ပါ။
  * `construct` {Function} [`stream._construct()`][writable-_construct] method အတွက် implementation ပါ။
  * `autoDestroy` {boolean} ဒီ stream က ဆုံးသွားပြီးနောက်မှာ ကိုယ်တိုင်ပေါ်မှာ `.destroy()` ကို အလိုအလျောက် ခေါ်သင့်လား မခေါ်သင့်ဘူးလားပါ။ **Default:** `true`။
  * `signal` {AbortSignal} ဖျက်သိမ်းနိုင်ခြေ ရှိနိုင်တဲ့ အခြေအနေကို ကိုယ်စားပြုတဲ့ signal တစ်ခုပါ။

```cjs
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // Calls the stream.Writable() constructor.
    super(options);
    // ...
  }
}
```

```mjs
import { Writable } from 'node:stream';

class MyWritable extends Writable {
  constructor(options) {
    // Calls the stream.Writable() constructor.
    super(options);
    // ...
  }
}
```

ဒါမှမဟုတ် ရိုးရှင်းတဲ့ constructor နည်းလမ်းကို သုံးပြီး:

```js
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
});
```

ပေးပို့လိုက်တဲ့ `AbortSignal` နဲ့ သက်ဆိုင်တဲ့ `AbortController` ပေါ်မှာ `abort` ကို ခေါ်တာက — writable stream ပေါ်မှာ `.destroy(new AbortError())` ကို ခေါ်တာနဲ့ တူညီတဲ့ ပုံစံအတိုင်း ပြုမူပါလိမ့်မယ်။

```js
const { Writable } = require('node:stream');

const controller = new AbortController();
const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
  signal: controller.signal,
});
// Later, abort the operation closing the stream
controller.abort();
```

#### `writable._construct(callback)`

* `callback` {Function} Stream က initialization ပြီးဆုံးသွားတဲ့အခါ ဒီ function ကို ခေါ်ပါ (optional အနေနဲ့ error argument တစ်ခုနဲ့ပါ ဖြစ်နိုင်ပါတယ်)။

`_construct()` method ကို တိုက်ရိုက် ခေါ်လို့ _မရပါဘူး_။ ၎င်းကို child classes တွေက implement လုပ်နိုင်ပြီး — လုပ်ထားရင် — internal `Writable` class methods တွေကသာလျှင် ခေါ်ပါလိမ့်မယ်။

ဒီ optional function ကို stream constructor က ပြန်လာပြီးနောက် tick တစ်ခုအတွင်းမှာ ခေါ်ပြီး — `callback` ကို မခေါ်မချင်း `_write()`, `_final()` နဲ့ `_destroy()` calls တွေ အားလုံးကို နှောင့်နှေးစေပါတယ်။ ဒါက stream ကို မသုံးခင် state ကို initialize လုပ်ဖို့ (သို့) resources တွေကို asynchronously initialize လုပ်ဖို့ အသုံးဝင်ပါတယ်။

```js
const { Writable } = require('node:stream');
const fs = require('node:fs');

class WriteStream extends Writable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, 'w', (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _write(chunk, encoding, callback) {
    fs.write(this.fd, chunk, callback);
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```


#### `writable._write(chunk, encoding, callback)`

* `chunk` {Buffer|string|any} ရေးသားရမယ့် `Buffer` ပါ — [`stream.write()`][stream-write] ဆီကို ပေးပို့လိုက်တဲ့ `string` ကနေ ပြောင်းလဲလာတာပါ။ Stream ရဲ့ `decodeStrings` option က `false` ဖြစ်နေရင် (သို့) stream က object mode နဲ့ လည်ပတ်နေရင် — chunk ကို ပြောင်းလဲမှာ မဟုတ်ပဲ — [`stream.write()`][stream-write] ဆီကို ပေးလိုက်တဲ့ တန်ဖိုးအတိုင်း ဖြစ်နေပါလိမ့်မယ်။
* `encoding` {string} chunk က string တစ်ခုဆိုရင် — `encoding` က အဲဒီ string ရဲ့ character encoding ပါ။ chunk က `Buffer` တစ်ခုဖြစ်နေရင် (သို့) stream က object mode နဲ့ လည်ပတ်နေရင် — `encoding` ကို လျစ်လျူရှုနိုင်ပါတယ်။
* `callback` {Function} ပေးထားတဲ့ chunk အတွက် လုပ်ဆောင်မှု ပြီးသွားတဲ့အခါ ဒီ function ကို ခေါ်ပါ (error argument တစ်ခု ထည့်ပြီး ခေါ်လည်း ရပါတယ်)။

`Writable` stream implementation တွေ အားလုံးက — underlying resource ဆီကို data ပို့ဖို့ — [`writable._write()`][stream-_write] နဲ့/သို့မဟုတ် [`writable._writev()`][stream-_writev] method ကို ထောက်ပံ့ပေးရပါမယ်။

[`Transform`][] streams တွေက [`writable._write()`][stream-_write] ရဲ့ ကိုယ်ပိုင် implementation ကို ထောက်ပံ့ပေးပါတယ်။

ဒီ function ကို application code က တိုက်ရိုက် ခေါ်လို့ မရပါဘူး။ ၎င်းကို child classes တွေက implement လုပ်သင့်ပြီး — internal `Writable` class methods တွေကသာလျှင် ခေါ်ပါလိမ့်မယ်။

`callback` function ကို `writable._write()` ရဲ့ အတွင်းမှာ synchronously ဖြစ်စေ — (ဆိုလိုတာက tick မတူတဲ့) asynchronously ဖြစ်စေ — write လုပ်မှု အောင်မြင်ခဲ့တယ် (သို့) error နဲ့ မအောင်မြင်ခဲ့ဘူးဆိုတာကို အချက်ပြဖို့ ခေါ်ရပါမယ်။ `callback` ဆီကို ပထမဆုံး argument အနေနဲ့ ပေးရမှာက — call မအောင်မြင်ခဲ့ရင် `Error` object ဖြစ်ပြီး — write အောင်မြင်ခဲ့ရင် `null` ဖြစ်ရပါမယ်။

`writable._write()` ကို ခေါ်လိုက်ချိန်ကနေ `callback` ကို ခေါ်လိုက်ချိန်အထိ ကြားထဲမှာ ဖြစ်ပွားတဲ့ `writable.write()` call တွေ အားလုံးက ရေးသားလိုက်တဲ့ data ကို buffer လုပ်ထားစေပါလိမ့်မယ်။ `callback` ကို ခေါ်လိုက်တဲ့အခါ stream က [`'drain'`][] event ကို emit လုပ်နိုင်ပါတယ်။ Stream implementation တစ်ခုက data chunk အများအပြားကို တစ်ပြိုင်နက် လုပ်ဆောင်နိုင်စွမ်း ရှိရင် — `writable._writev()` method ကို implement လုပ်သင့်ပါတယ်။

`decodeStrings` property ကို constructor options ထဲမှာ `false` လို့ အတိအကျ သတ်မှတ်ထားရင် — `chunk` က `.write()` ဆီကို ပေးလိုက်တဲ့ object အတိုင်း ဆက်ဖြစ်နေပြီး — `Buffer` အစား string တစ်ခု ဖြစ်နိုင်ပါတယ်။ ဒါက — တချို့ string data encodings တွေအတွက် အကောင်းဆုံးဖြစ်အောင် ကိုင်တွယ်မှု (optimized handling) ရှိတဲ့ implementations တွေကို ပံ့ပိုးဖို့ ဖြစ်ပါတယ်။ အဲဒီလို အခြေအနေမှာ `encoding` argument က string ရဲ့ character encoding ကို ဖော်ပြပါလိမ့်မယ်။ ဒါမှမဟုတ်ရင်တော့ `encoding` argument ကို စိတ်ချလက်ချ လျစ်လျူရှုနိုင်ပါတယ်။

`writable._write()` method ကို underscore (_) နဲ့ ရှေ့ဆွဲထားတာက — ၎င်းက ၎င်းကို သတ်မှတ်ထားတဲ့ class ရဲ့ အတွင်းပိုင်းအတွက်သာ ဖြစ်ပြီး — user programs တွေက တိုက်ရိုက် ဘယ်တော့မှ ခေါ်လို့ မရဘူးဆိုတာ ဖော်ပြဖို့ ဖြစ်ပါတယ်။

#### `writable._writev(chunks, callback)`

* `chunks` {Object\[]} ရေးသားရမယ့် data ပါ။ တန်ဖိုးက — တစ်ခုချင်းစီက ရေးသားရမယ့် သီးခြား (discrete) data chunk တစ်ခုကို ကိုယ်စားပြုတဲ့ — {Object} တွေရဲ့ array တစ်ခု ဖြစ်ပါတယ်။ ဒီ objects တွေရဲ့ properties တွေကတော့:
  * `chunk` {Buffer|string} ရေးသားရမယ့် data ပါဝင်တဲ့ buffer instance (သို့) string တစ်ခုပါ။ `Writable` ကို `decodeStrings` option `false` နဲ့ ဖန်တီးပြီး — `write()` ဆီကို string တစ်ခု ပေးပို့ခဲ့ရင် — `chunk` က string တစ်ခု ဖြစ်ပါလိမ့်မယ်။
  * `encoding` {string} `chunk` ရဲ့ character encoding ပါ။ `chunk` က `Buffer` တစ်ခုဆိုရင် `encoding` က `'buffer'` ဖြစ်ပါလိမ့်မယ်။
* `callback` {Function} ပေးထားတဲ့ chunks တွေအတွက် လုပ်ဆောင်မှု ပြီးသွားတဲ့အခါ ခေါ်ရမယ့် callback function တစ်ခုပါ (error argument တစ်ခု ထည့်ပြီး ခေါ်လည်း ရပါတယ်)။

ဒီ function ကို application code က တိုက်ရိုက် ခေါ်လို့ မရပါဘူး။ ၎င်းကို child classes တွေက implement လုပ်သင့်ပြီး — internal `Writable` class methods တွေကသာလျှင် ခေါ်ပါလိမ့်မယ်။

`writable._writev()` method ကို — data chunk အများအပြားကို တစ်ပြိုင်နက် လုပ်ဆောင်နိုင်တဲ့ stream implementations တွေမှာ — `writable._write()` နဲ့အတူ (သို့) အစားထိုးအနေနဲ့ implement လုပ်နိုင်ပါတယ်။ Implement လုပ်ထားပြီး — အရင်က writes တွေကနေ buffered data ရှိနေရင် — `_write()` အစား `_writev()` ကို ခေါ်ပါလိမ့်မယ်။

`writable._writev()` method ကို underscore (_) နဲ့ ရှေ့ဆွဲထားတာက — ၎င်းက ၎င်းကို သတ်မှတ်ထားတဲ့ class ရဲ့ အတွင်းပိုင်းအတွက်သာ ဖြစ်ပြီး — user programs တွေက တိုက်ရိုက် ဘယ်တော့မှ ခေါ်လို့ မရဘူးဆိုတာ ဖော်ပြဖို့ ဖြစ်ပါတယ်။

#### `writable._destroy(err, callback)`

* `err` {Error} ဖြစ်နိုင်ခြေ ရှိတဲ့ error တစ်ခုပါ။
* `callback` {Function} optional error argument တစ်ခုကို လက်ခံတဲ့ callback function တစ်ခုပါ။

`_destroy()` method ကို [`writable.destroy()`][writable-destroy] က ခေါ်ပါတယ်။ Child classes တွေက override လုပ်နိုင်ပေမယ့် — တိုက်ရိုက် ခေါ်လို့ **မရပါဘူး**။

#### `writable._final(callback)`

* `callback` {Function} ကျန်ရှိနေတဲ့ data တွေကို ရေးသားပြီးသွားတဲ့အခါ ဒီ function ကို ခေါ်ပါ (error argument တစ်ခု ထည့်ပြီး ခေါ်လည်း ရပါတယ်)။

`_final()` method ကို တိုက်ရိုက် ခေါ်လို့ **မရပါဘူး**။ ၎င်းကို child classes တွေက implement လုပ်နိုင်ပြီး — လုပ်ထားရင် — internal `Writable` class methods တွေကသာလျှင် ခေါ်ပါလိမ့်မယ်။

ဒီ optional function ကို stream မပိတ်ခင် ခေါ်ပြီး — `callback` ကို ခေါ်လိုက်တဲ့အထိ `'finish'` event ကို နှောင့်နှေးစေပါတယ်။ Stream မဆုံးခင် resources တွေကို ပိတ်ဖို့ (သို့) buffered data တွေ ရေးသားဖို့အတွက် အသုံးဝင်ပါတယ်။

#### ရေးသားနေစဉ် error များ (Errors while writing)

[`writable._write()`][], [`writable._writev()`][] နဲ့ [`writable._final()`][] methods တွေကို လုပ်ဆောင်နေစဉ်မှာ ဖြစ်ပွားတဲ့ errors တွေကို — callback ကို ခေါ်ပြီး error ကို ပထမဆုံး argument အနေနဲ့ ပေးပို့ခြင်းအားဖြင့် — ဖြန့်ဝေပေး (propagate) ရပါမယ်။ ဒီ methods တွေရဲ့ အတွင်းကနေ `Error` တစ်ခုကို throw လုပ်တာ (သို့) `'error'` event ကို ကိုယ်တိုင် emit လုပ်တာက undefined behavior (သတ်မှတ်မထားသော အပြုအမူ) ကို ဖြစ်စေပါတယ်။

`Readable` stream တစ်ခုက `Writable` stream တစ်ခုဆီကို pipe လုပ်ထားပြီး — `Writable` က error တစ်ခုကို emit လုပ်လိုက်ရင် — `Readable` stream ကို unpiped (pipe ဖြုတ်ခံရ) ဖြစ်သွားပါလိမ့်မယ်။

```js
const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  },
});
```

#### writable stream ဥပမာတစ်ခု (An example writable stream)

အောက်ဖော်ပြပါက — အတော်လေး ရိုးရှင်းတဲ့ (ပြီးတော့ တစ်နည်းနည်းနဲ့ အသုံးမဝင်လှတဲ့) custom `Writable` stream implementation တစ်ခုကို သရုပ်ဖော်ပါတယ်။ ဒီ တိကျတဲ့ `Writable` stream instance က လက်တွေ့မှာ တကယ့်ကို အသုံးဝင်တာမျိုး မဟုတ်ပေမယ့် — ဥပမာက custom [`Writable`][] stream instance တစ်ခုရဲ့ လိုအပ်တဲ့ အစိတ်အပိုင်းတွေ တစ်ခုချင်းစီကို သရုပ်ဖော်ပေးပါတယ်:

```js
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
}
```

#### writable stream တစ်ခုထဲမှာ buffers များကို decode လုပ်ခြင်း (Decoding buffers in a writable stream)

Buffers တွေကို decode လုပ်တာက — ဥပမာ — input က string ဖြစ်တဲ့ transformers တွေကို သုံးတဲ့အခါမျိုးမှာ အဖြစ်များတဲ့ လုပ်ငန်းတစ်ခုပါ။ UTF-8 လိုမျိုး multi-byte characters encoding တွေကို သုံးတဲ့အခါမှာတော့ ဒါက သာမန် လွယ်ကူတဲ့ လုပ်ငန်းစဉ် မဟုတ်ပါဘူး။ အောက်ပါ ဥပမာက `StringDecoder` နဲ့ [`Writable`][] ကို သုံးပြီး multi-byte strings တွေကို decode လုပ်နည်းကို ပြပါတယ်။

```js
const { Writable } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder(options?.defaultEncoding);
    this.data = '';
  }
  _write(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }
  _final(callback) {
    this.data += this._decoder.end();
    callback();
  }
}

const euro = [[0xE2, 0x82], [0xAC]].map(Buffer.from);
const w = new StringWritable();

w.write('currency: ');
w.write(euro[0]);
w.end(euro[1]);

console.log(w.data); // currency: €
```

### Readable stream တစ်ခုကို အကောင်အထည်ဖော်ခြင်း (Implementing a readable stream)

[`Readable`][] stream တစ်ခုကို implement လုပ်ဖို့ `stream.Readable` class ကို extend လုပ်ပါတယ်။

Custom `Readable` streams တွေက `new stream.Readable([options])` constructor ကို ခေါ်ပြီး — [`readable._read()`][] method ကို implement လုပ်ရပါမယ်။

#### `new stream.Readable([options])`

* `options` {Object}
  * `highWaterMark` {number} underlying resource ကနေ စာဖတ်တာ ရပ်လိုက်ခင် internal buffer ထဲမှာ သိမ်းဆည်းထားရမယ့် အများဆုံး [number of bytes][hwm-gotcha] ပါ။ **Default:** [`stream.getDefaultHighWaterMark()`][] ကို ကြည့်ပါ။
  * `encoding` {string} သတ်မှတ်ထားရင် — buffers တွေကို သတ်မှတ်ထားတဲ့ encoding နဲ့ strings တွေအဖြစ် decode လုပ်ပါလိမ့်မယ်။ **Default:** `null`။
  * `objectMode` {boolean} ဒီ stream က objects တွေရဲ့ stream တစ်ခုလို ပြုမူသင့်လား မပြုမူသင့်ဘူးလားပါ။ ဆိုလိုတာက — [`stream.read(n)`][stream-read] က အရွယ်အစား `n` ရှိတဲ့ `Buffer` တစ်ခု အစား — တန်ဖိုး (value) တစ်ခုတည်းကို ပြန်ပေးပါလိမ့်မယ်။ **Default:** `false`။
  * `emitClose` {boolean} Stream ကို destroy လုပ်ပြီးနောက်မှာ `'close'` ကို emit လုပ်သင့်လား မလုပ်သင့်ဘူးလားပါ။ **Default:** `true`။
  * `read` {Function} [`stream._read()`][stream-_read] method အတွက် implementation ပါ။
  * `destroy` {Function} [`stream._destroy()`][readable-_destroy] method အတွက် implementation ပါ။
  * `construct` {Function} [`stream._construct()`][readable-_construct] method အတွက် implementation ပါ။
  * `autoDestroy` {boolean} ဒီ stream က ဆုံးသွားပြီးနောက်မှာ ကိုယ်တိုင်ပေါ်မှာ `.destroy()` ကို အလိုအလျောက် ခေါ်သင့်လား မခေါ်သင့်ဘူးလားပါ။ **Default:** `true`။
  * `signal` {AbortSignal} ဖျက်သိမ်းနိုင်ခြေ ရှိနိုင်တဲ့ အခြေအနေကို ကိုယ်စားပြုတဲ့ signal တစ်ခုပါ။

```js
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // Calls the stream.Readable(options) constructor.
    super(options);
    // ...
  }
}
```

ဒါမှမဟုတ် — ရိုးရှင်းသော constructor နည်းလမ်းကို သုံးပြီး:

```js
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  },
});
```

ပေးပို့လိုက်တဲ့ `AbortSignal` နဲ့ ကိုက်ညီတဲ့ `AbortController` ပေါ်မှာ `abort` ကို ခေါ်လိုက်တာက — ဖန်တီးလိုက်တဲ့ readable ပေါ်မှာ `.destroy(new AbortError())` ကို ခေါ်လိုက်တာနဲ့ တူညီတဲ့ အပြုအမူ ဖြစ်စေပါလိမ့်မယ်။

```js
const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal,
});
// Later, abort the operation closing the stream
controller.abort();
```

#### `readable._construct(callback)`

* `callback` {Function} Stream က initialize လုပ်ပြီးသွားတဲ့အခါ ဒီ function ကို ခေါ်ပါ (error argument တစ်ခု ထည့်ပြီး ခေါ်လည်း ရပါတယ်)။

`_construct()` method ကို တိုက်ရိုက် ခေါ်လို့ မရပါဘူး။ ၎င်းကို child classes တွေက implement လုပ်နိုင်ပြီး — လုပ်ထားရင် — internal `Readable` class methods တွေကသာလျှင် ခေါ်ပါလိမ့်မယ်။

ဒီ optional function ကို stream constructor က နောက် tick တစ်ခုမှာ လုပ်ဆောင်ဖို့ စီစဉ်ပေးပြီး — `callback` ကို ခေါ်လိုက်တဲ့အထိ `_read()` နဲ့ `_destroy()` calls တွေကို နှောင့်နှေးစေပါတယ်။ Stream ကို မသုံးခင် state တွေ စတင်သတ်မှတ်ဖို့ (သို့) resources တွေကို asynchronously စတင်ဖို့အတွက် အသုံးဝင်ပါတယ်။

```js
const { Readable } = require('node:stream');
const fs = require('node:fs');

class ReadStream extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
```

#### `readable._read(size)`

* `size` {number} asynchronously ဖတ်ရှုရမယ့် bytes အရေအတွက်ပါ။

ဒီ function ကို application code က တိုက်ရိုက် ခေါ်လို့ မရပါဘူး။ ၎င်းကို child classes တွေက implement လုပ်သင့်ပြီး — internal `Readable` class methods တွေကသာလျှင် ခေါ်ပါလိမ့်မယ်။

`Readable` stream implementation တွေ အားလုံးက — underlying resource ကနေ data ယူဖို့ — [`readable._read()`][] method ရဲ့ implementation တစ်ခုကို ထောက်ပံ့ပေးရပါမယ်။

[`readable._read()`][] ကို ခေါ်လိုက်တဲ့အခါ — resource ကနေ data ရနိုင်ရင် — implementation က [`this.push(dataChunk)`][stream-push] method ကို သုံးပြီး အဲဒီ data ကို read queue ထဲကို စတင် push လုပ်သင့်ပါတယ်။ Stream က data ထပ်လက်ခံဖို့ အဆင်သင့် ဖြစ်သွားတာနဲ့ — `_read()` ကို [`this.push(dataChunk)`][stream-push] ခေါ်လိုက်တိုင်း နောက်တစ်ကြိမ် ထပ်ခေါ်ပါလိမ့်မယ်။ `readable.push()` က `false` ပြန်မပေးမချင်း `_read()` က resource ကနေ ဆက်ဖတ်ပြီး data တွေကို push လုပ်နေနိုင်ပါတယ်။ ရပ်သွားပြီးနောက် `_read()` ကို နောက်တစ်ကြိမ် ပြန်ခေါ်လိုက်မှသာလျှင် — queue ထဲကို နောက်ထပ် data တွေ ထပ်ပြီး push လုပ်တာ ပြန်စသင့်ပါတယ်။

[`readable._read()`][] method ကို ခေါ်လိုက်တာနဲ့ — [`readable.push()`][stream-push] method ကနေ data တွေ နောက်ထပ် push လုပ်ခံရတဲ့အထိ — နောက်တစ်ကြိမ် ထပ်ခေါ်မှာ မဟုတ်ပါဘူး။ Empty buffers နဲ့ strings တွေလို empty data တွေကတော့ [`readable._read()`][] ကို ခေါ်စေမှာ မဟုတ်ပါဘူး။

`size` argument က အကြံပေးသက်သက် (advisory) ပါ။ "read" တစ်ခုက data ပြန်ပေးတဲ့ တစ်ခုတည်းသော operation တစ်ခု ဖြစ်တဲ့ implementations တွေအတွက်တော့ — `size` argument ကို သုံးပြီး data ဘယ်လောက် ယူရမယ်ဆိုတာ ဆုံးဖြတ်နိုင်ပါတယ်။ တခြား implementations တွေက ဒီ argument ကို လျစ်လျူရှုပြီး — data ရနိုင်တာနဲ့ ရိုးရိုးသာမန် ထောက်ပံ့ပေးနိုင်ပါတယ်။ [`stream.push(chunk)`][stream-push] ကို မခေါ်ခင် `size` bytes တွေ အပြည့် ရနိုင်ဖို့ "စောင့်နေဖို့" မလိုပါဘူး။

[`readable._read()`][] method ကို underscore (_) နဲ့ ရှေ့ဆွဲထားတာက — ၎င်းက ၎င်းကို သတ်မှတ်ထားတဲ့ class ရဲ့ အတွင်းပိုင်းအတွက်သာ ဖြစ်ပြီး — user programs တွေက တိုက်ရိုက် ဘယ်တော့မှ ခေါ်လို့ မရဘူးဆိုတာ ဖော်ပြဖို့ ဖြစ်ပါတယ်။

#### `readable._destroy(err, callback)`

* `err` {Error} ဖြစ်နိုင်ခြေ ရှိတဲ့ error တစ်ခုပါ။
* `callback` {Function} optional error argument တစ်ခုကို လက်ခံတဲ့ callback function တစ်ခုပါ။

`_destroy()` method ကို [`readable.destroy()`][readable-destroy] က ခေါ်ပါတယ်။ Child classes တွေက override လုပ်နိုင်ပေမယ့် — တိုက်ရိုက် ခေါ်လို့ **မရပါဘူး**။

#### `readable.push(chunk[, encoding])`

* `chunk` {Buffer|TypedArray|DataView|string|null|any} read queue ထဲကို push လုပ်ရမယ့် data chunk ပါ။ Object mode နဲ့ မလည်ပတ်တဲ့ streams တွေအတွက် `chunk` က {string}, {Buffer}, {TypedArray} (သို့) {DataView} ဖြစ်ရပါမယ်။ Object mode streams တွေအတွက်တော့ `chunk` က ဘယ် JavaScript တန်ဖိုးမဆို ဖြစ်နိုင်ပါတယ်။
* `encoding` {string} string chunks တွေရဲ့ encoding ပါ။ `'utf8'` (သို့) `'ascii'` လိုမျိုး valid `Buffer` encoding တစ်ခု ဖြစ်ရပါမယ်။
* Returns: {boolean} data chunk အသစ်တွေကို ဆက်ပြီး push လုပ်နိုင်ရင် `true` ပြန်ပြီး — မလုပ်နိုင်ရင် `false` ပြန်ပါတယ်။

`chunk` က {Buffer}, {TypedArray}, {DataView} (သို့) {string} ဖြစ်နေရင် — data `chunk` ကို stream ရဲ့ user တွေ စားသုံးဖို့ internal queue ထဲကို ထည့်သွင်းပါလိမ့်မယ်။ `chunk` ကို `null` အနေနဲ့ ပေးလိုက်တာက stream ရဲ့ အဆုံးကို အချက်ပြတာ (EOF) ဖြစ်ပြီး — အဲဒီနောက်မှာ data ထပ်ရေးလို့ မရတော့ပါဘူး။

`Readable` က paused mode နဲ့ လည်ပတ်နေတဲ့အခါ — `readable.push()` နဲ့ ထည့်လိုက်တဲ့ data တွေကို — [`'readable'`][] event ကို emit လုပ်တဲ့အခါ — [`readable.read()`][stream-read] method ကို ခေါ်ပြီး ဖတ်ထုတ်နိုင်ပါတယ်။

`Readable` က flowing mode နဲ့ လည်ပတ်နေတဲ့အခါ — `readable.push()` နဲ့ ထည့်လိုက်တဲ့ data တွေကို `'data'` event တစ်ခု emit လုပ်ပြီး ပို့ဆောင်ပေးပါလိမ့်မယ်။

`readable.push()` method ကို တတ်နိုင်သမျှ ပြောင်းလွယ်ပြင်လွယ် (flexible) ဖြစ်အောင် ဒီဇိုင်းထားပါတယ်။ ဥပမာ — pause/resume ယန္တရား တစ်မျိုးမျိုး နဲ့ data callback တစ်ခု ထောက်ပံ့ပေးတဲ့ အောက်ခြေ (lower-level) source တစ်ခုကို wrap လုပ်တဲ့အခါ — အောက်ခြေ source ကို custom `Readable` instance က wrap လုပ်နိုင်ပါတယ်:

```js
// `_source` is an object with readStop() and readStart() methods,
// and an `ondata` member that gets called when it has data, and
// an `onend` member that gets called when the data is over.

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // Every time there's data, push it into the internal buffer.
    this._source.ondata = (chunk) => {
      // If push() returns false, then stop reading from source.
      if (!this.push(chunk))
        this._source.readStop();
    };

    // When the source ends, push the EOF-signaling `null` chunk.
    this._source.onend = () => {
      this.push(null);
    };
  }
  // _read() will be called when the stream wants to pull more data in.
  // The advisory size argument is ignored in this case.
  _read(size) {
    this._source.readStart();
  }
}
```

`readable.push()` method ကို content တွေကို internal buffer ထဲကို push လုပ်ဖို့ သုံးပါတယ်။ ၎င်းကို [`readable._read()`][] method က မောင်းနှင် (drive) နိုင်ပါတယ်။

Object mode နဲ့ မလည်ပတ်တဲ့ streams တွေမှာ — `readable.push()` ရဲ့ `chunk` parameter က `undefined` ဖြစ်နေရင် — အဲဒါကို empty string (သို့) buffer တစ်ခုလို သဘောထားပါလိမ့်မယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`readable.push('')`][] ကို ကြည့်ပါ။

#### ဖတ်ရှုနေစဉ် error များ (Errors while reading)

[`readable._read()`][] ကို လုပ်ဆောင်နေစဉ်မှာ ဖြစ်ပွားတဲ့ errors တွေကို — [`readable.destroy(err)`][readable-_destroy] method ကနေ ဖြန့်ဝေပေးရပါမယ်။ [`readable._read()`][] ရဲ့ အတွင်းကနေ `Error` တစ်ခုကို throw လုပ်တာ (သို့) `'error'` event ကို ကိုယ်တိုင် emit လုပ်တာက undefined behavior (သတ်မှတ်မထားသော အပြုအမူ) ကို ဖြစ်စေပါတယ်။

```js
const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // Do some work.
    }
  },
});
```

#### ရေတွက်ခြင်း (counting) stream ဥပမာတစ်ခု (An example counting stream)

အောက်ဖော်ပြပါက — 1 ကနေ 1,000,000 အထိ ဂဏန်းတွေကို စဉ်တိုး (ascending) အစဉ်လိုက် emit လုပ်ပြီး — နောက်ဆုံးမှာ ဆုံးသွားတဲ့ — `Readable` stream တစ်ခုရဲ့ အခြေခံ ဥပမာတစ်ခုပါ။

```js
const { Readable } = require('node:stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}
```

### Duplex stream တစ်ခုကို အကောင်အထည်ဖော်ခြင်း (Implementing a duplex stream)

[`Duplex`][] stream တစ်ခုဆိုတာ — TCP socket connection တစ်ခုလိုမျိုး — [`Readable`][] ရော [`Writable`][] နှစ်ခုလုံးကိုပါ implement လုပ်တဲ့ stream တစ်ခုပါ။

JavaScript မှာ multiple inheritance (အမွေဆက်ခံမှု အများအပြား) ကို ပံ့ပိုးမထားတာကြောင့် — `stream.Duplex` class ကို extend လုပ်ပြီး [`Duplex`][] stream တစ်ခုကို implement လုပ်ပါတယ် (`stream.Readable` ရော `stream.Writable` classes နှစ်ခုလုံးကို extend လုပ်တာမျိုး မဟုတ်ပါဘူး)။

`stream.Duplex` class က `stream.Readable` ကနေ prototypically အမွေဆက်ခံပြီး — `stream.Writable` ကနေ parasitically အမွေဆက်ခံပါတယ်။ ဒါပေမယ့် `stream.Writable` ပေါ်မှာ [`Symbol.hasInstance`][] ကို override လုပ်ထားတာကြောင့် — base classes နှစ်ခုလုံးအတွက် `instanceof` က မှန်ကန်စွာ အလုပ်လုပ်ပါလိမ့်မယ်။

Custom `Duplex` streams တွေက `new stream.Duplex([options])` constructor ကို ခေါ်ပြီး — [`readable._read()`][] ရော `writable._write()` method နှစ်ခုလုံးကိုပါ implement လုပ်ရပါမယ်။

#### `new stream.Duplex(options)`

* `options` {Object} `Writable` ရော `Readable` constructors နှစ်ခုလုံးဆီကိုပါ ပေးပို့ပါတယ်။ အောက်ပါ fields တွေလည်း ပါပါတယ်:
  * `allowHalfOpen` {boolean} `false` လို့ သတ်မှတ်ထားရင် — readable side ဆုံးသွားတဲ့အခါ stream က writable side ကို အလိုအလျောက် end လုပ်ပါလိမ့်မယ်။ **Default:** `true`။
  * `readable` {boolean} `Duplex` က readable ဖြစ်သင့်လား မဖြစ်သင့်ဘူးလား သတ်မှတ်ပါတယ်။ **Default:** `true`။
  * `writable` {boolean} `Duplex` က writable ဖြစ်သင့်လား မဖြစ်သင့်ဘူးလား သတ်မှတ်ပါတယ်။ **Default:** `true`။
  * `readableObjectMode` {boolean} Stream ရဲ့ readable side အတွက် `objectMode` ကို သတ်မှတ်ပါတယ်။ `objectMode` က `true` ဆိုရင်တော့ ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။ **Default:** `false`။
  * `writableObjectMode` {boolean} Stream ရဲ့ writable side အတွက် `objectMode` ကို သတ်မှတ်ပါတယ်။ `objectMode` က `true` ဆိုရင်တော့ ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။ **Default:** `false`။
  * `readableHighWaterMark` {number} Stream ရဲ့ readable side အတွက် `highWaterMark` ကို သတ်မှတ်ပါတယ်။ `highWaterMark` ကို ပေးထားရင်တော့ ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။
  * `writableHighWaterMark` {number} Stream ရဲ့ writable side အတွက် `highWaterMark` ကို သတ်မှတ်ပါတယ်။ `highWaterMark` ကို ပေးထားရင်တော့ ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

```cjs
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```

```mjs
import { Duplex } from 'node:stream';

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
```

ဒါမှမဟုတ် — ရိုးရှင်းသော constructor နည်းလမ်းကို သုံးပြီး:

```js
const { Duplex } = require('node:stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  },
});
```

pipeline ကို သုံးတဲ့အခါ:

```js
const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // Accept string input rather than Buffers
    construct(callback) {
      this.data = '';
      callback();
    },
    transform(chunk, encoding, callback) {
      this.data += chunk;
      callback();
    },
    flush(callback) {
      try {
        // Make sure is valid json.
        JSON.parse(this.data);
        this.push(this.data);
        callback();
      } catch (err) {
        callback(err);
      }
    },
  }),
  fs.createWriteStream('valid-object.json'),
  (err) => {
    if (err) {
      console.error('failed', err);
    } else {
      console.log('completed');
    }
  },
);
```

#### duplex stream ဥပမာတစ်ခု (An example duplex stream)

အောက်ဖော်ပြပါက — data တွေ ရေးသားလို့ရပြီး ဖတ်ရှုလို့လည်း ရတဲ့ — သို့ပေမယ့် Node.js streams တွေနဲ့ လိုက်ဖက်မှု မရှိတဲ့ API တစ်ခုကို သုံးတဲ့ — စိတ်ကူးယဉ် (hypothetical) အောက်ခြေ source object တစ်ခုကို wrap လုပ်တဲ့ `Duplex` stream တစ်ခုရဲ့ ရိုးရှင်းတဲ့ ဥပမာကို သရုပ်ဖော်ပါတယ်။
အောက်ဖော်ပြပါက — [`Writable`][] interface ကနေ ဝင်လာတဲ့ ရေးသားလိုက်တဲ့ data တွေကို buffer လုပ်ပြီး — [`Readable`][] interface ကနေ ပြန်ဖတ်ထုတ်ပေးတဲ့ — `Duplex` stream တစ်ခုရဲ့ ရိုးရှင်းတဲ့ ဥပမာကို သရုပ်ဖော်ပါတယ်။

```js
const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // The underlying source only deals with strings.
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
```

`Duplex` stream တစ်ခုရဲ့ အရေးအကြီးဆုံး သွင်ပြင်ကတော့ — `Readable` နဲ့ `Writable` sides နှစ်ခုလုံးက object instance တစ်ခုတည်းရဲ့ အတွင်းမှာ အတူယှဉ်တွဲ တည်ရှိနေပေမယ့် — တစ်ခုနဲ့တစ်ခု သီးခြားလွတ်လပ်စွာ လည်ပတ်တာပါ။

#### Object mode duplex streams များ (Object mode duplex streams)

`Duplex` streams တွေအတွက် — `objectMode` ကို `Readable` (သို့) `Writable` side တစ်ခုခုအတွက်သာ သီးသန့် သတ်မှတ်နိုင်ပြီး — `readableObjectMode` နဲ့ `writableObjectMode` options တွေကို အသီးသီး သုံးပါတယ်။

ဥပမာ အောက်ပါမှာ — (တကယ်တော့ [`Duplex`][] stream အမျိုးအစားတစ်ခု ဖြစ်တဲ့) `Transform` stream အသစ်တစ်ခုကို ဖန်တီးထားပါတယ်။ ၎င်းမှာ JavaScript numbers တွေကို လက်ခံတဲ့ object mode `Writable` side တစ်ခု ရှိပြီး — `Readable` side မှာတော့ အဲဒီ numbers တွေကို hexadecimal strings တွေအဖြစ် ပြောင်းလဲပေးပါတယ်။

```js
const { Transform } = require('node:stream');

// All Transform streams are also Duplex Streams.
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // Coerce the chunk to a number if necessary.
    chunk |= 0;

    // Transform the chunk into something else.
    const data = chunk.toString(16);

    // Push the data onto the readable queue.
    callback(null, '0'.repeat(data.length % 2) + data);
  },
});

myTransform.setEncoding('ascii');
myTransform.on('data', (chunk) => console.log(chunk));

myTransform.write(1);
// Prints: 01
myTransform.write(10);
// Prints: 0a
myTransform.write(100);
// Prints: 64
```

### Transform stream တစ်ခုကို အကောင်အထည်ဖော်ခြင်း (Implementing a transform stream)

[`Transform`][] stream တစ်ခုဆိုတာ — output ကို input ကနေ တစ်နည်းနည်းနဲ့ တွက်ချက်ထုတ်ယူတဲ့ — [`Duplex`][] stream တစ်ခုပါ။ ဥပမာတွေကတော့ — data တွေကို compress (ချုံ့), encrypt (စာဝှက်) (သို့) decrypt (စာဖော်) လုပ်ပေးတဲ့ [zlib][] streams (သို့) [crypto][] streams တွေပါ။

Output က input နဲ့ အရွယ်အစား တူညီနေဖို့၊ chunk အရေအတွက် တူညီနေဖို့ (သို့) တစ်ချိန်တည်း ရောက်ရှိဖို့ မလိုအပ်ပါဘူး။ ဥပမာ — `Hash` stream တစ်ခုက input ကို end လုပ်လိုက်တဲ့အခါမှသာ ပေးအပ်တဲ့ — output chunk တစ်ခုတည်းသာ ရှိပါလိမ့်မယ်။ `zlib` stream တစ်ခုကတော့ — input ထက် အများကြီး ပိုသေးတဲ့ (သို့) အများကြီး ပိုကြီးတဲ့ output ကို ထုတ်ပေးပါလိမ့်မယ်။

[`Transform`][] stream တစ်ခုကို implement လုပ်ဖို့ `stream.Transform` class ကို extend လုပ်ပါတယ်။

`stream.Transform` class က `stream.Duplex` ကနေ prototypically အမွေဆက်ခံပြီး — `writable._write()` နဲ့ [`readable._read()`][] methods တွေရဲ့ ကိုယ်ပိုင် ဗားရှင်းတွေကို implement လုပ်ပါတယ်။ Custom `Transform` implementations တွေက [`transform._transform()`][stream-_transform] method ကို implement လုပ်ရပြီး — [`transform._flush()`][stream-_flush] method ကိုလည်း implement လုပ်နိုင်ပါတယ်။

`Transform` streams တွေကို သုံးတဲ့အခါ သတိထားရမှာက — `Readable` side က output ကို စားသုံးမပေးရင် — stream ဆီကို ရေးလိုက်တဲ့ data တွေက stream ရဲ့ `Writable` side ကို paused ဖြစ်စေနိုင်ပါတယ်။

#### `new stream.Transform([options])`

* `options` {Object} `Writable` ရော `Readable` constructors နှစ်ခုလုံးဆီကိုပါ ပေးပို့ပါတယ်။ အောက်ပါ fields တွေလည်း ပါပါတယ်:
  * `transform` {Function} [`stream._transform()`][stream-_transform] method အတွက် implementation ပါ။
  * `flush` {Function} [`stream._flush()`][stream-_flush] method အတွက် implementation ပါ။

```cjs
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```

```mjs
import { Transform } from 'node:stream';

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
```

ဒါမှမဟုတ် — ရိုးရှင်းသော constructor နည်းလမ်းကို သုံးပြီး:

```js
const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  },
});
```

#### Event: `'end'`

[`'end'`][] event က `stream.Readable` class ကနေ လာတာပါ။ `'end'` event ကို — data အားလုံး output ဖြစ်သွားပြီးနောက်မှာ — ဆိုလိုတာက [`transform._flush()`][stream-_flush] ထဲက callback ကို ခေါ်ပြီးနောက်မှာ — emit လုပ်ပါတယ်။ Error ဖြစ်ရင် `'end'` ကို emit မလုပ်သင့်ပါဘူး။

#### Event: `'finish'`

[`'finish'`][] event က `stream.Writable` class ကနေ လာတာပါ။ `'finish'` event ကို — [`stream.end()`][stream-end] ကို ခေါ်ပြီး — chunks တွေ အားလုံးကို [`stream._transform()`][stream-_transform] က လုပ်ဆောင်ပြီးသွားပြီးနောက်မှာ — emit လုပ်ပါတယ်။ Error ဖြစ်ရင် `'finish'` ကို emit မလုပ်သင့်ပါဘူး။

#### `transform._flush(callback)`

* `callback` {Function} ကျန်ရှိနေတဲ့ data တွေကို flush လုပ်ပြီးသွားတဲ့အခါ ခေါ်ရမယ့် callback function တစ်ခုပါ (error argument နဲ့ data တစ်ခု ထည့်ပြီး ခေါ်လည်း ရပါတယ်)။

ဒီ function ကို application code က တိုက်ရိုက် ခေါ်လို့ မရပါဘူး။ ၎င်းကို child classes တွေက implement လုပ်သင့်ပြီး — internal `Readable` class methods တွေကသာလျှင် ခေါ်ပါလိမ့်မယ်။

တချို့ အခြေအနေတွေမှာ — transform operation တစ်ခုက stream ရဲ့ အဆုံးမှာ နောက်ထပ် data အနည်းငယ်ကို emit လုပ်ဖို့ လိုအပ်နိုင်ပါတယ်။ ဥပမာ — `zlib` compression stream တစ်ခုက output ကို အကောင်းဆုံး ချုံ့နိုင်ဖို့ သုံးတဲ့ internal state ပမာဏတစ်ခုကို သိမ်းဆည်းထားပါတယ်။ ဒါပေမယ့် stream ဆုံးသွားတဲ့အခါ — ချုံ့ထားတဲ့ data ပြည့်စုံဖို့ — အဲဒီ နောက်ထပ် data ကို flush လုပ်ပေးဖို့ လိုအပ်ပါတယ်။

Custom [`Transform`][] implementations တွေက `transform._flush()` method ကို implement လုပ်နိုင်ပါတယ်။ ဒါကို — စားသုံးဖို့ ရေးထားတဲ့ data မရှိတော့ပေမယ့် — [`Readable`][] stream ရဲ့ အဆုံးကို အချက်ပြတဲ့ [`'end'`][] event ကို emit မလုပ်ရသေးတဲ့ အချိန်မှာ — ခေါ်ပါလိမ့်မယ်။

`transform._flush()` implementation ရဲ့ အတွင်းမှာ — `transform.push()` method ကို သင့်လျော်သလို — သုည (သို့) အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။ Flush operation ပြီးသွားတဲ့အခါ `callback` function ကို ခေါ်ရပါမယ်။

`transform._flush()` method ကို underscore (_) နဲ့ ရှေ့ဆွဲထားတာက — ၎င်းက ၎င်းကို သတ်မှတ်ထားတဲ့ class ရဲ့ အတွင်းပိုင်းအတွက်သာ ဖြစ်ပြီး — user programs တွေက တိုက်ရိုက် ဘယ်တော့မှ ခေါ်လို့ မရဘူးဆိုတာ ဖော်ပြဖို့ ဖြစ်ပါတယ်။

#### `transform._transform(chunk, encoding, callback)`

* `chunk` {Buffer|string|any} Transform လုပ်ရမယ့် `Buffer` ပါ — [`stream.write()`][stream-write] ဆီကို ပေးပို့လိုက်တဲ့ `string` ကနေ ပြောင်းလဲလာတာပါ။ Stream ရဲ့ `decodeStrings` option က `false` ဖြစ်နေရင် (သို့) stream က object mode နဲ့ လည်ပတ်နေရင် — chunk ကို ပြောင်းလဲမှာ မဟုတ်ပဲ — [`stream.write()`][stream-write] ဆီကို ပေးလိုက်တဲ့ တန်ဖိုးအတိုင်း ဖြစ်နေပါလိမ့်မယ်။
* `encoding` {string} chunk က string တစ်ခုဆိုရင် — ဒါက encoding အမျိုးအစားပါ။ chunk က buffer တစ်ခုဆိုရင်တော့ — ဒါက `'buffer'` ဆိုတဲ့ အထူး (special) တန်ဖိုးပါ။ အဲဒီအခါမှာ ၎င်းကို လျစ်လျူရှုပါ။
* `callback` {Function} ပေးထားတဲ့ `chunk` ကို လုပ်ဆောင်ပြီးသွားပြီးနောက်မှာ ခေါ်ရမယ့် callback function တစ်ခုပါ (error argument နဲ့ data တစ်ခု ထည့်ပြီး ခေါ်လည်း ရပါတယ်)။

ဒီ function ကို application code က တိုက်ရိုက် ခေါ်လို့ မရပါဘူး။ ၎င်းကို child classes တွေက implement လုပ်သင့်ပြီး — internal `Readable` class methods တွေကသာလျှင် ခေါ်ပါလိမ့်မယ်။

`Transform` stream implementation တွေ အားလုံးက — input လက်ခံပြီး output ထုတ်ပေးဖို့ — `_transform()` method တစ်ခုကို ထောက်ပံ့ပေးရပါမယ်။ `transform._transform()` implementation က ရေးသားနေတဲ့ bytes တွေကို ကိုင်တွယ်ပြီး — output တစ်ခုကို တွက်ချက်ကာ — `transform.push()` method ကို သုံးပြီး အဲဒီ output ကို readable အပိုင်းဆီကို လွှဲပြောင်းပေးပါတယ်။

`transform.push()` method ကို — input chunk တစ်ခုတည်းကနေ output ဘယ်လောက် ထုတ်ရမယ်ဆိုတဲ့အပေါ် မူတည်ပြီး — သုည (သို့) အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။

Input data chunk တစ်ခုခုကနေ output လုံးဝ မထွက်တာလည်း ဖြစ်နိုင်ပါတယ်။

`callback` function ကို — လက်ရှိ chunk ကို လုံးဝ (completely) စားသုံးပြီးတဲ့အခါမှသာ — ခေါ်ရပါမယ်။ `callback` ဆီကို ပထမဆုံး argument အနေနဲ့ ပေးရမှာက — input ကို လုပ်ဆောင်နေစဉ် error ဖြစ်ခဲ့ရင် `Error` object ဖြစ်ပြီး — မဟုတ်ရင် `null` ဖြစ်ရပါမယ်။ `callback` ဆီကို ဒုတိယ argument တစ်ခု ပေးလိုက်ရင် — အဲဒါကို `transform.push()` method ဆီကို ဆက်လွှဲပြောင်းပေးမှာ ဖြစ်ပေမယ့် — ပထမ argument က falsy ဖြစ်နေမှသာလျှင် ဖြစ်ပါတယ်။ တစ်နည်းပြောရရင် — အောက်ပါ နှစ်ခုက တူညီပါတယ်:

```js
transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
```

`transform._transform()` method ကို underscore (_) နဲ့ ရှေ့ဆွဲထားတာက — ၎င်းက ၎င်းကို သတ်မှတ်ထားတဲ့ class ရဲ့ အတွင်းပိုင်းအတွက်သာ ဖြစ်ပြီး — user programs တွေက တိုက်ရိုက် ဘယ်တော့မှ ခေါ်လို့ မရဘူးဆိုတာ ဖော်ပြဖို့ ဖြစ်ပါတယ်။

`transform._transform()` ကို တစ်ပြိုင်နက် (in parallel) ဘယ်တော့မှ ခေါ်မှာ မဟုတ်ပါဘူး — streams တွေက queue ယန္တရားတစ်ခုကို implement လုပ်ထားပြီး — နောက် chunk ကို လက်ခံဖို့ — `callback` ကို synchronously ဖြစ်စေ asynchronously ဖြစ်စေ — ခေါ်ရပါမယ်။

#### Class: `stream.PassThrough`

`stream.PassThrough` class က — input bytes တွေကို output ဆီကို ရိုးရိုးသာမန် ဖြတ်သန်းပေးလိုက်ရုံသာရှိတဲ့ — [`Transform`][] stream တစ်ခုရဲ့ ပေါ့ပါးရိုးရှင်းတဲ့ (trivial) implementation တစ်ခုပါ။ ၎င်းရဲ့ ရည်ရွယ်ချက်က အဓိကအားဖြင့် ဥပမာတွေနဲ့ testing တွေအတွက် ဖြစ်ပေမယ့် — ဆန်းသစ်တဲ့ (novel) stream အမျိုးအစားတွေအတွက် အဆောက်အဦခံ (building block) တစ်ခုအနေနဲ့ `stream.PassThrough` အသုံးဝင်တဲ့ အခြေအနေတချို့လည်း ရှိပါတယ်။

## နောက်ထပ် မှတ်စုများ (Additional notes)

### Streams များနှင့် async generators, async iterators တို့၏ လိုက်ဖက်ညီမှု (Streams compatibility with async generators and async iterators)

JavaScript မှာ async generators နဲ့ iterators တွေကို ပံ့ပိုးလာတာနဲ့အမျှ — async generators တွေက လက်ရှိအချိန်မှာ ဘာသာစကား အဆင့် (language-level) ရဲ့ first-class stream construct တစ်ခု ဖြစ်လာပါပြီ။

Node.js streams တွေကို async generators နဲ့ async iterators တွေနဲ့ တွဲသုံးတဲ့အခါ ဖြစ်လေ့ရှိတဲ့ interop အခြေအနေတချို့ကို အောက်မှာ ဖော်ပြထားပါတယ်။

#### async iterators များဖြင့် readable streams များကို စားသုံးခြင်း (Consuming readable streams with async iterators)

```js
(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
```

Async iterators တွေက — destroy လုပ်ပြီးနောက်မှာ ကိုင်တွယ်မခံရတဲ့ (unhandled) errors တွေ မဖြစ်အောင် — stream ပေါ်မှာ အမြဲတမ်း (permanent) error handler တစ်ခုကို register လုပ်ပါတယ်။

#### async generators များဖြင့် readable streams များ ဖန်တီးခြင်း (Creating readable streams with async generators)

`Readable.from()` utility method ကို သုံးပြီး — asynchronous generator တစ်ခုကနေ Node.js readable stream တစ်ခုကို ဖန်တီးနိုင်ပါတယ်:

```js
const { Readable } = require('node:stream');

const ac = new AbortController();
const signal = ac.signal;

async function * generate() {
  yield 'a';
  await someLongRunningFn({ signal });
  yield 'b';
  yield 'c';
}

const readable = Readable.from(generate());
readable.on('close', () => {
  ac.abort();
});

readable.on('data', (chunk) => {
  console.log(chunk);
});
```

#### async iterators များမှ writable streams များဆီသို့ pipe လုပ်ခြင်း (Piping to writable streams from async iterators)

Async iterator တစ်ခုကနေ writable stream တစ်ခုဆီကို ရေးသားတဲ့အခါ — backpressure နဲ့ errors တွေကို မှန်ကန်စွာ ကိုင်တွယ်ဖို့ သေချာပါစေ။ [`stream.pipeline()`][] က backpressure နဲ့ backpressure နဲ့ ဆက်စပ်တဲ့ errors တွေရဲ့ ကိုင်တွယ်မှုကို ခြုံငုံ ဖယ်ရှားပေးပါတယ်:

```js
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// Callback Pattern
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Promise Pattern
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
```

### Node.js ဗားရှင်းအဟောင်းများနှင့် လိုက်ဖက်ညီမှု (Compatibility with older Node.js versions)

Node.js 0.10 မတိုင်မီက — `Readable` stream interface က ပိုရိုးရှင်းပေမယ့် — စွမ်းအား ပိုနည်းပြီး အသုံးဝင်မှုလည်း နည်းပါတယ်။

* [`stream.read()`][stream-read] method ဆီကို ခေါ်တာကို စောင့်နေမယ့်အစား — [`'data'`][] events တွေက ချက်ချင်း စ emit လုပ်ပါတယ်။ Data တွေကို ဘယ်လို ကိုင်တွယ်ရမယ်ဆိုတာ ဆုံးဖြတ်ဖို့ လုပ်ငန်းတချို့ လုပ်ဆောင်ဖို့ လိုတဲ့ applications တွေက — data တွေ မပျောက်အောင် — ဖတ်ထားတဲ့ data တွေကို buffers တွေထဲမှာ သိမ်းဆည်းထားဖို့ လိုအပ်ပါတယ်။
* [`stream.pause()`][stream-pause] method က အာမခံထားတဲ့ (guaranteed) သဘောမျိုး မဟုတ်ပဲ — အကြံပေးသက်သက် (advisory) သဘောသာ ဖြစ်ပါတယ်။ ဆိုလိုတာက — stream က paused state မှာ ရှိနေတဲ့အခါမှာတောင် — [`'data'`][] events တွေကို လက်ခံဖို့ အသင့်ဖြစ်နေဖို့ လိုအပ်နေတုန်းပါပဲ။

Node.js 0.10 မှာ [`Readable`][] class ကို ထည့်သွင်းခဲ့ပါတယ်။ Node.js ဗားရှင်းအဟောင်းတွေရဲ့ programs တွေနဲ့ နောက်ပြန် လိုက်ဖက်ညီမှု (backward compatibility) ရှိဖို့ — `Readable` streams တွေက — [`'data'`][] event handler တစ်ခုကို ထည့်လိုက်တဲ့အခါ (သို့) [`stream.resume()`][stream-resume] method ကို ခေါ်လိုက်တဲ့အခါ — "flowing mode" ဆီကို ပြောင်းသွားပါတယ်။ ရလဒ်ကတော့ — ပုံစံသစ် [`stream.read()`][stream-read] method နဲ့ [`'readable'`][] event ကို မသုံးတော့ဘဲနဲ့တောင် — [`'data'`][] chunks တွေ ပျောက်ဆုံးသွားမှာကို စိုးရိမ်စရာ မလိုတော့ပါဘူး။

Applications အများစုက ပုံမှန်အတိုင်း ဆက်လုပ်ဆောင်နိုင်ဦးမှာ ဖြစ်ပေမယ့် — ဒါက အောက်ပါ အခြေအနေတွေမှာ edge case (အစွန်းဖြစ်ရပ်) တစ်ခုကို ဖြစ်စေပါတယ်:

* [`'data'`][] event listener တစ်ခုမှ ထည့်မထားဘူး။
* [`stream.resume()`][stream-resume] method ကို ဘယ်တော့မှ မခေါ်ဘူး။
* Stream ကို writable destination တစ်ခုခုဆီကိုမှ pipe လုပ်မထားဘူး။

ဥပမာ — အောက်ပါ code ကို စဉ်းစားကြည့်ပါ:

```js
// WARNING!  BROKEN!
net.createServer((socket) => {

  // We add an 'end' listener, but never consume the data.
  socket.on('end', () => {
    // It will never get here.
    socket.end('The message was received but was not processed.\n');
  });

}).listen(1337);
```

Node.js 0.10 မတိုင်မီက — ဝင်လာတဲ့ message data ကို ရိုးရိုးသာမန် စွန့်ပစ်လိုက်ရုံပါပဲ။ ဒါပေမယ့် Node.js 0.10 နဲ့ ၎င်းနောက်ပိုင်းမှာတော့ — socket က ထာဝရ paused ဖြစ်နေပါတော့တယ်။

ဒီအခြေအနေမှာ ဖြေရှင်းနည်း (workaround) ကတော့ — data စီးဆင်းမှုကို စတင်ဖို့ [`stream.resume()`][stream-resume] method ကို ခေါ်တာပါ:

```js
// Workaround.
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('The message was received but was not processed.\n');
  });

  // Start the flow of data, discarding it.
  socket.resume();
}).listen(1337);
```

`Readable` streams အသစ်တွေ flowing mode ဆီကို ပြောင်းတာအပြင် — pre-0.10 ပုံစံ streams တွေကိုလည်း — [`readable.wrap()`][`stream.wrap()`] method ကို သုံးပြီး — `Readable` class တစ်ခုထဲမှာ wrap လုပ်နိုင်ပါတယ်။

### `readable.read(0)`

အောက်ခြေ readable stream ယန္တရားတွေကို — data တကယ် မစားသုံးပဲနဲ့ — ပြန်လည် ဆန်းသစ် (refresh) လုပ်ဖို့ လိုအပ်တဲ့ အခြေအနေတချို့ ရှိပါတယ်။ အဲဒီလို အခြေအနေတွေမှာ — အမြဲတမ်း `null` ပြန်ပေးမယ့် — `readable.read(0)` ကို ခေါ်နိုင်ပါတယ်။

Internal read buffer က `highWaterMark` အောက်မှာ ရှိနေပြီး — stream က လောလောဆယ် ဖတ်ရှုနေတာ မဟုတ်ဘူးဆိုရင် — `stream.read(0)` ကို ခေါ်လိုက်တာက အောက်ခြေ (low-level) [`stream._read()`][stream-_read] call တစ်ခုကို စတင်စေပါလိမ့်မယ်။

Applications အများစုက ဒါကို လုပ်ဖို့ လိုအပ်လေ့ မရှိပေမယ့် — Node.js ရဲ့ အတွင်းပိုင်း — အထူးသဖြင့် `Readable` stream class internals တွေမှာတော့ — ဒီလို လုပ်ဆောင်တဲ့ အခြေအနေတွေ ရှိပါတယ်။

### `readable.push('')`

`readable.push('')` ကို သုံးတာကို အကြံပြုလိုတာ မဟုတ်ပါဘူး။

Object mode နဲ့ မလည်ပတ်တဲ့ stream တစ်ခုဆီကို zero-byte {string}, {Buffer}, {TypedArray} (သို့) {DataView} တစ်ခုကို push လုပ်တာက — စိတ်ဝင်စားစရာ ဘေးထွက်သက်ရောက်မှု (side effect) တစ်ခု ရှိပါတယ်။ ၎င်းက [`readable.push()`][stream-push] ဆီကို ခေါ်တာတစ်ခု ဖြစ်လို့ — ဒီ call က reading process ကို အဆုံးသတ်ပါလိမ့်မယ်။ ဒါပေမယ့် argument က empty string တစ်ခု ဖြစ်နေလို့ — readable buffer ထဲကို data ဘာမှ မထည့်သွင်းလိုက်တာကြောင့် — user အတွက် စားသုံးစရာ ဘာမှ မရှိပါဘူး။

### `highWaterMark` discrepancy after calling `readable.setEncoding()`

`readable.setEncoding()` ကို သုံးလိုက်တာက — non-object mode မှာ `highWaterMark` အလုပ်လုပ်ပုံကို ပြောင်းလဲစေပါလိမ့်မယ်။

ပုံမှန်အားဖြင့် — လက်ရှိ buffer ရဲ့ အရွယ်အစားကို `highWaterMark` နဲ့ _bytes_ ယူနစ်နဲ့ တိုင်းတာပါတယ်။ ဒါပေမယ့် `setEncoding()` ကို ခေါ်ပြီးနောက်မှာ — နှိုင်းယှဉ်တဲ့ function က buffer ရဲ့ အရွယ်အစားကို _characters_ (စာလုံးရေအတွက်) နဲ့ တိုင်းတာတော့ပါလိမ့်မယ်။

ဒါက `latin1` (သို့) `ascii` တို့နဲ့ ပတ်သက်တဲ့ သာမန် အခြေအနေတွေမှာတော့ ပြဿနာ မဟုတ်ပါဘူး။ ဒါပေမယ့် — multi-byte characters တွေ ပါဝင်နိုင်တဲ့ strings တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — ဒီအပြုအမူကို သတိထားဖို့ အကြံပြုလိုပါတယ်။

[API for stream consumers]: #api-for-stream-consumers
[API for stream implementers]: #api-for-stream-implementers
[Compatibility]: #compatibility-with-older-nodejs-versions
[HTTP requests, on the client]: http.md#class-httpclientrequest
[HTTP responses, on the server]: http.md#class-httpserverresponse
[TCP sockets]: net.md#class-netsocket
[Three states]: #three-states
[`'data'`]: #event-data
[`'drain'`]: #event-drain
[`'end'`]: #event-end
[`'finish'`]: #event-finish
[`'readable'`]: #event-readable
[`Duplex`]: #class-streamduplex
[`ERR_STREAM_ITER_MISSING_FLAG`]: errors.md#err_stream_iter_missing_flag
[`EventEmitter`]: events.md#class-eventemitter
[`Readable`]: #class-streamreadable
[`Stream.toAsyncStreamable`]: stream_iter.md#streamtoasyncstreamable
[`Symbol.hasInstance`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance
[`Transform`]: #class-streamtransform
[`Writable`]: #class-streamwritable
[`fs.createReadStream()`]: fs.md#fscreatereadstreampath-options
[`fs.createWriteStream()`]: fs.md#fscreatewritestreampath-options
[`net.Socket`]: net.md#class-netsocket
[`process.stderr`]: process.md#processstderr
[`process.stdin`]: process.md#processstdin
[`process.stdout`]: process.md#processstdout
[`readable._read()`]: #readable_readsize
[`readable.compose(stream)`]: #readablecomposestream-options
[`readable.map`]: #readablemapfn-options
[`readable.push('')`]: #readablepush
[`readable.setEncoding()`]: #readablesetencodingencoding
[`stream.Readable.from()`]: #streamreadablefromiterable-options
[`stream.addAbortSignal()`]: #streamaddabortsignalsignal-stream
[`stream.compose(...streams)`]: #streamcomposestreams
[`stream.cork()`]: #writablecork
[`stream.duplexPair()`]: #streamduplexpairoptions
[`stream.finished()`]: #streamfinishedstream-options-callback
[`stream.getDefaultHighWaterMark()`]: #streamgetdefaulthighwatermarkobjectmode
[`stream.pipe()`]: #readablepipedestination-options
[`stream.pipeline()`]: #streampipelinesource-transforms-destination-callback
[`stream.uncork()`]: #writableuncork
[`stream.unpipe()`]: #readableunpipedestination
[`stream.wrap()`]: #readablewrapstream
[`stream/iter`]: stream_iter.md
[`writable._final()`]: #writable_finalcallback
[`writable._write()`]: #writable_writechunk-encoding-callback
[`writable._writev()`]: #writable_writevchunks-callback
[`writable.cork()`]: #writablecork
[`writable.end()`]: #writableendchunk-encoding-callback
[`writable.uncork()`]: #writableuncork
[`writable.writableFinished`]: #writablewritablefinished
[`zlib.createDeflate()`]: zlib.md#zlibcreatedeflateoptions
[child process stdin]: child_process.md#subprocessstdin
[child process stdout and stderr]: child_process.md#subprocessstdout
[crypto]: crypto.md
[fs read streams]: fs.md#class-fsreadstream
[fs write streams]: fs.md#class-fswritestream
[http-incoming-message]: http.md#class-httpincomingmessage
[hwm-gotcha]: #highwatermark-discrepancy-after-calling-readablesetencoding
[object-mode]: #object-mode
[readable-_construct]: #readable_constructcallback
[readable-_destroy]: #readable_destroyerr-callback
[readable-destroy]: #readabledestroyerror
[stream-_final]: #writable_finalcallback
[stream-_flush]: #transform_flushcallback
[stream-_read]: #readable_readsize
[stream-_transform]: #transform_transformchunk-encoding-callback
[stream-_write]: #writable_writechunk-encoding-callback
[stream-_writev]: #writable_writevchunks-callback
[stream-end]: #writableendchunk-encoding-callback
[stream-finished]: #streamfinishedstream-options-callback
[stream-finished-promise]: #streamfinishedstream-options
[stream-iter-from]: stream_iter.md#frominput
[stream-pause]: #readablepause
[stream-pipeline]: #streampipelinesource-transforms-destination-callback
[stream-pipeline-promise]: #streampipelinesource-transforms-destination-options
[stream-push]: #readablepushchunk-encoding
[stream-read]: #readablereadsize
[stream-resume]: #readableresume
[stream-uncork]: #writableuncork
[stream-write]: #writablewritechunk-encoding-callback
[writable-_construct]: #writable_constructcallback
[writable-_destroy]: #writable_destroyerr-callback
[writable-destroy]: #writabledestroyerror
[writable-new]: #new-streamwritableoptions
[zlib]: zlib.md
