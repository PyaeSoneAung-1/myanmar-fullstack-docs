---
title: "Streams အသုံးပြုခြင်း"
description: "Node.js Streams — Readable/Writable/Duplex/Transform အမျိုးအစားများ, .pipe() နဲ့ pipeline(), async iterators, object mode, Web Streams နဲ့ အပြန်အလှန်သုံးခြင်း"
order: 33
source: "https://nodejs.org/en/learn/modules/how-to-use-streams"
status: translated
updated: 2026-09-02
---

## Streams ဆိုတာ ဘာလဲ

Node.js application တွေမှာ data အမြောက်အများနဲ့ အလုပ်လုပ်ရတာက ဓားနှစ်ချောင်း သဘောပါ — data အများကြီး ကိုင်တွယ်နိုင်တာက အသုံးဝင်ပေမယ့် — performance bottleneck တွေနဲ့ memory ကုန်ခမ်းမှုတွေလည်း ဖြစ်စေနိုင်ပါတယ်။ အစဉ်အလာ နည်းကတော့ dataset တစ်ခုလုံးကို memory ထဲ တစ်ခါတည်း ဖတ်သွင်းတာပါ — dataset ငယ်တွေအတွက် အဆင်ပြေပေမယ့် — file ကြီးတွေ၊ network requests တွေလို data ကြီးတွေအတွက်တော့ ထိရောက်မှု မရှိပါဘူး။

ဒီနေရာမှာ **Node.js streams** တွေ ဝင်လာပါတယ်။ Streams တွေက data ကို chunk လိုက် တစ်ဆင့်ချင်း process လုပ်ပြီး — memory သုံးစွဲမှုကို optimize လုပ်ပေးပါတယ်။ နာမည်ကြီးတဲ့ စကားတစ်ခွန်းအရ — "streams ဆိုတာ အချိန်နဲ့အမျှ ဖြန့်ကျက်ထားတဲ့ arrays တွေပါ"။

## Node.js Streams ဆိုတာ ဘာလဲ (အသေးစိတ်)

Streams တွေက file ဖတ်/ရေး၊ network requests စတဲ့ dataset ကြီးတွေကို ကိုင်တွယ်ရာမှာ performance မထိခိုက်စေဘဲ လုပ်နိုင်တဲ့ abstraction တစ်ခုပါ။ Data တစ်ခုလုံးကို memory ထဲ တစ်ခါတည်း မထည့်ဘဲ — chunk လိုက် process လုပ်လို့ memory သုံးစွဲမှု သိသိသာသာ လျော့ကျပါတယ်။ Node.js ထဲက stream တိုင်းက [`EventEmitter`](https://nodejs.org/api/events.html#class-eventemitter) class ကနေ အမွေဆက်ခံပြီး — data processing ရဲ့ အဆင့်အမျိုးမျိုးမှာ events တွေ emit လုပ်ပါတယ်။ Streams တွေက readable ဖြစ်နိုင်၊ writable ဖြစ်နိုင်၊ ဒါမှမဟုတ် နှစ်မျိုးလုံး ဖြစ်နိုင်ပါတယ်။

### Event-Driven Architecture

Node.js က event-driven architecture ပေါ်မှာ အခြေခံပြီး — real-time I/O အတွက် အကောင်းဆုံးပါ — input ရတာနဲ့ ချက်ချင်း စားသုံးပြီး output ထွက်တာနဲ့ ချက်ချင်း ပို့ပါတယ်။ Streams တွေက အဓိက အဆင့်တွေမှာ events emit လုပ်ပြီး ဒီနည်းနဲ့ ချောမွေ့စွာ ပေါင်းစပ်အလုပ်လုပ်ပါတယ် — data ရောက်လာတာကို ပြတဲ့ [`data`](https://nodejs.org/api/stream.html#stream_event_data) event နဲ့ stream ပြီးဆုံးကြောင်း ပြတဲ့ [`end`](https://nodejs.org/api/stream.html#event-end) event တွေပါဝင်ပါတယ်။ Developer တွေက ဒီ events တွေကို listen လုပ်ပြီး ကိုယ်ပိုင် logic တွေ သတ်မှတ်နိုင်ပါတယ်။

## ဘာကြောင့် Streams သုံးသင့်လဲ

Streams တွေက တခြား data-handling နည်းလမ်းတွေထက် အဓိက အားသာချက် သုံးခု ပေးပါတယ်:

- **Memory သက်သာခြင်း** — data ကို chunk လိုက် စားသုံး/process လုပ်လို့ dataset တစ်ခုလုံးကို memory ထဲ ထည့်စရာ မလိုပါဘူး — dataset ကြီးတွေအတွက် အဓိက အားသာချက်ပါ။
- **Response Time ပိုကောင်းခြင်း** — chunk တစ်ခု ရောက်တာနဲ့ ချက်ချင်း process လုပ်လို့ရတာမို့ payload တစ်ခုလုံး မရောက်ခင် စတင်လုပ်နိုင်ပြီး — latency လျော့ကျပါတယ်။
- **Real-Time Processing အတွက် Scalability** — resource အကန့်အသတ်နဲ့တင် data အမြောက်အများကို ထိရောက်စွာ ကိုင်တွယ်နိုင်လို့ — real-time data အများကြီး process လုပ်တဲ့ application တွေအတွက် သင့်တော်ပါတယ်။

### Performance မှတ်ချက်

ကိုယ့် application မှာ data တွေ အားလုံး memory ထဲ အဆင်သင့် ရှိနေပြီးသားဆိုရင်တော့ — streams သုံးတာက မလိုအပ်တဲ့ overhead နဲ့ ရှုပ်ထွေးမှု ထပ်တိုးပြီး application နှေးစေနိုင်ပါတယ်။

## Streams သမိုင်းကြောင်း

ဒီအပိုင်းက Node.js မှာ streams တွေရဲ့ သမိုင်းကြောင်းကို ကိုးကားဖော်ပြတာပါ — Node v0.11.5 (2013) မတိုင်ခင် version တွေအတွက် ရေးထားတဲ့ codebase တွေနဲ့ အလုပ်လုပ်နေတာမဟုတ်ရင် — streams API ဗားရှင်းအဟောင်းတွေကို ကြုံတွေ့ခဲပါတယ် — ဒါပေမယ့် ဝေါဟာရတွေကတော့ သုံးနေဆဲ ဖြစ်နိုင်ပါတယ်။

- **Streams 0** — Node.js နဲ့အတူ ပထမဆုံး ထွက်ခဲ့တဲ့ version — Stream class မရှိသေးပေမယ့် module တွေက `read`/`write` functions တွေ သုံးခဲ့ကြပါတယ်။ `util.pump()` က stream နှစ်ခုကြား data flow ထိန်းချုပ်ဖို့ ရနိုင်ပါတယ်။
- **Streams 1 (Classic)** — 2011 ခုနှစ် Node v0.4.0 နဲ့အတူ Stream class နဲ့ `pipe()` method စတင်မိတ်ဆက်ခဲ့ပါတယ်။
- **Streams 2** — 2012 ခုနှစ် Node v0.10.0 နဲ့အတူ Readable, Writable, Duplex, Transform ဆိုတဲ့ stream subclasses အသစ်တွေ ထွက်လာပြီး `readable` event ပါ ထပ်ထည့်ခဲ့ပါတယ် — backwards compatibility အတွက် `data` event listener ဒါမှမဟုတ် `pause()`/`resume()` သုံးရင် အဟောင်း mode ကို ပြောင်းနိုင်ပါတယ်။
- **Streams 3** — 2013 ခုနှစ် Node v0.11.5 နဲ့အတူ — stream တစ်ခုမှာ `data` ရော `readable` event handler ရော နှစ်ခုလုံး ရှိနေတဲ့ ပြဿနာကို ဖြေရှင်းပေးခဲ့ပါတယ်။ Streams 3 က Node.js ရဲ့ လက်ရှိ streams version ပါ။

## Stream အမျိုးအစားများ

### Readable

[`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) က data source တစ်ခုကို အစဉ်လိုက် ဖတ်ဖို့ သုံးတဲ့ class ပါ — ဥပမာ file ဖတ်တဲ့ [`fs.ReadStream`](https://nodejs.org/api/fs.html#class-fsreadstream), HTTP requests ဖတ်တဲ့ [`http.IncomingMessage`](https://nodejs.org/api/http.html#class-httpincomingmessage), standard input ကနေ ဖတ်တဲ့ [`process.stdin`](https://nodejs.org/api/process.html#processstdin) စတာတွေပါ။

#### အဓိက Methods နဲ့ Events များ

- **[`on('data')`](https://nodejs.org/api/stream.html#stream_event_data)** — stream ကနေ data ရနိုင်တိုင်း ဖြစ်ပေါ်တဲ့ event — stream က ကိုင်တွယ်နိုင်သလောက် မြန်မြန် data တွန်းပေးလို့ high-throughput အတွက် သင့်တော်ပါတယ်။
- **[`on('end')`](https://nodejs.org/api/stream.html#event-end)** — stream ထဲက data အားလုံး စားသုံးပြီးတဲ့အခါ — ဖတ်စရာ data မကျန်တော့ကြောင်း ပြတဲ့ event ပါ။
- **[`on('readable')`](https://nodejs.org/api/stream.html#event-readable)** — stream ထဲမှာ ဖတ်လို့ရတဲ့ data ရှိတဲ့အခါ (ဒါမှမဟုတ် stream အဆုံးရောက်ချိန်) ဖြစ်ပေါ်ပြီး — data ဖတ်ချိန်ကို ပိုထိန်းချုပ်ခွင့် ပေးပါတယ်။
- **[`on('close')`](https://nodejs.org/api/stream.html#event-close_1)** — stream နဲ့ သူ့ရဲ့ underlying resources တွေ ပိတ်ပြီးတဲ့အခါ — နောက်ထပ် events တွေ ထွက်တော့မှာ မဟုတ်ကြောင်း ပြတဲ့ event ပါ။
- **[`on('error')`](https://nodejs.org/api/stream.html#event-error_1)** — processing မှာ error ဖြစ်တဲ့အခါ ဘယ်အချိန်မဆို ထွက်နိုင်ပြီး — uncaught exceptions တွေ မဖြစ်အောင် handler ထားနိုင်ပါတယ်။

#### အခြေခံ Readable Stream ဥပမာ

ဒီမှာ data တွေကို ကိုယ်တိုင် generate လုပ်ပေးတဲ့ ရိုးရှင်းတဲ့ readable stream implementation ပါ:

```js
class MyStream extends Readable {
  #count = 0;
  _read(size) {
    this.push(':-)');
    if (++this.#count === 5) {
      this.push(null);
    }
  }
}

const stream = new MyStream();

stream.on('data', chunk => {
  console.log(chunk.toString());
});
```

ဒီ code မှာ `MyStream` class က Readable ကနေ extends လုပ်ပြီး — [`_read()`](https://nodejs.org/api/stream.html#readable_readsize) method ကို override လုပ်ကာ string ":-)" တွေကို internal buffer ထဲ push ပါတယ်။ ငါးကြိမ် push ပြီးတဲ့အခါ `null` push ပြီး stream ရဲ့ အဆုံးကို အချက်ပြပါတယ်။ [`on('data')`](https://nodejs.org/api/stream.html#stream_event_data) handler က chunk တစ်ခုချင်းစီ ရောက်တိုင်း console မှာ log လုပ်ပါတယ်။

#### readable Event နဲ့ အဆင့်မြင့် ထိန်းချုပ်ခြင်း

Data flow ကို ပိုတိတိကျကျ ထိန်းချုပ်ချင်ရင် `readable` event ကို သုံးနိုင်ပါတယ် — ပိုရှုပ်ထွေးပေမယ့် — data ကို ဘယ်အချိန် ဖတ်မလဲ ကိုယ်တိုင် ထိန်းချုပ်လို့ရလို့ application တချို့အတွက် performance ပိုကောင်းပါတယ်:

```js
const stream = new MyStream({
  highWaterMark: 1,
});

stream.on('readable', () => {
  console.count('>> readable event');
  let chunk;
  while ((chunk = stream.read()) !== null) {
    console.log(chunk.toString()); // Process the chunk
  }
});
stream.on('end', () => console.log('>> end event'));
```

ဒီမှာ `readable` event ကို သုံးပြီး stream ကနေ data တွေကို လိုအပ်သလို ဆွဲဖတ်ပါတယ် — handler ထဲက loop က stream buffer ထဲက data တွေကို `null` ပြန်မလာမချင်း ဆက်ဖတ်ပါတယ် (`null` ဆိုတာ buffer ခဏ လွတ်နေတာ ဒါမှမဟုတ် stream ပြီးဆုံးသွားတာကို ဆိုလိုပါတယ်)။ `highWaterMark` ကို 1 ထားတာက buffer ကို သေးအောင်လုပ်ပြီး — `readable` event ကို မကြာခဏ ဖြစ်စေကာ data flow ကို ပိုသေးငယ်တဲ့ အဆင့်တွေနဲ့ ထိန်းချုပ်နိုင်စေပါတယ်။

အပေါ်က code ရဲ့ output က ဒီလိုပါ:

```bash
>> readable event: 1
:-):-)
:-)
:-)
:-)
>> readable event: 2
>> readable event: 3
>> readable event: 4
>> end event
```

ခွဲခြမ်းစိတ်ဖြာကြည့်ရအောင် — `on('readable')` event ကို attach လုပ်လိုက်တာနဲ့ `read()` ကို ပထမဆုံး အကြိမ် ခေါ်ပါတယ် (ဒါက `readable` event ထွက်စေဖို့ trigger ဖြစ်တတ်လို့ပါ) — event ထွက်ပြီးတာနဲ့ while loop ရဲ့ ပထမဆုံး iteration မှာ `read` ခေါ်တာမို့ ပထမဆုံး smiley နှစ်ခုက တစ်တန်းတည်းမှာ ထွက်လာတာပါ။ နောက် `null` push မခံရခင် `read` ကို ဆက်ခေါ်ပါတယ် — `read` ခေါ်တိုင်း `readable` event အသစ်တစ်ခု ထွက်ဖို့ schedule လုပ်ပေမယ့် — "flow" mode ဖြစ်နေတာမို့ event တွေကို `nextTick` မှာ schedule လုပ်တာကြောင့် — loop ရဲ့ synchronous code တွေ အကုန်ပြီးမှ တစ်ခါတည်း ထွက်လာတာပါ။

NOTE: `NODE_DEBUG=stream` နဲ့ code ကို run ကြည့်ရင် `push` တစ်ခါလုပ်တိုင်း `emitReadable` ကို trigger လုပ်တာ မြင်ရပါလိမ့်မယ်။

Smiley တစ်ခုချင်းစီ မရောက်ခင် `readable` event တွေ ဖြစ်စေချင်ရင် — `push` ကို `setImmediate` ဒါမှမဟုတ် `process.nextTick` ထဲ ထည့်နိုင်ပါတယ်:

```js
class MyStream extends Readable {
  #count = 0;
  _read(size) {
    setImmediate(() => {
      this.push(':-)');
      if (++this.#count === 5) {
        return this.push(null);
      }
    });
  }
}
```

Output က ဒီလိုဖြစ်ပါလိမ့်မယ်:

```bash
>> readable event: 1
:-)
>> readable event: 2
:-)
>> readable event: 3
:-)
>> readable event: 4
:-)
>> readable event: 5
:-)
>> readable event: 6
>> end event
```

### Writable

[`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) streams တွေက file ဖန်တီးတာ၊ data upload လုပ်တာ စတဲ့ — data တွေကို အစဉ်လိုက် output ထုတ်ရတဲ့ အလုပ်တွေအတွက် သုံးပါတယ်။ Readable streams တွေက data ရဲ့ source ဆိုရင် — writable streams တွေက data ရဲ့ destination ပါ — ဥပမာ [`fs.WriteStream`](https://nodejs.org/api/fs.html#class-fswritestream), [`process.stdout`](https://nodejs.org/api/process.html#processstdout), [`process.stderr`](https://nodejs.org/api/process.html#processstderr) စတာတွေပါ။

#### Writable Streams ထဲက အဓိက Methods နဲ့ Events

- **[`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback)** — data chunk တစ်ခုကို stream ထဲ ရေးဖို့ သုံးပါတယ် — data ကို သတ်မှတ်ထားတဲ့ ကန့်သတ်ချက် (highWaterMark) အထိ buffer လုပ်ပြီး — နောက်ထပ် data တွေ ချက်ချင်း ရေးလို့ရသေးလားဆိုတဲ့ boolean ပြန်ပေးပါတယ်။
- **[`.end()`](https://nodejs.org/api/stream.html#writableendchunk-encoding-callback)** — data ရေးခြင်း လုပ်ငန်းစဉ် ပြီးဆုံးကြောင်း အချက်ပြပြီး — write operation ကို အပြီးသတ်ကာ လိုအပ်တဲ့ cleanup တွေ လုပ်ပေးပါတယ်။

#### Writable Stream တစ်ခု ဖန်တီးခြင်း

ဒီမှာ ဝင်လာတဲ့ data တွေကို uppercase ပြောင်းပြီး standard output ဆီ ရေးပေးတဲ့ writable stream ဖန်တီးပုံ ဥပမာပါ:

```cjs
const { once } = require('node:events');
const { Writable } = require('node:stream');

class MyStream extends Writable {
  constructor() {
    super({ highWaterMark: 10 /* 10 bytes */ });
  }
  _write(data, encode, cb) {
    process.stdout.write(data.toString().toUpperCase() + '\n', cb);
  }
}

async function main() {
  const stream = new MyStream();

  for (let i = 0; i < 10; i++) {
    const waitDrain = !stream.write('hello');

    if (waitDrain) {
      console.log('>> wait drain');
      await once(stream, 'drain');
    }
  }

  stream.end('world');
}

// Call the async function
main().catch(console.error);
```

```mjs
import { once } from 'node:events';
import { Writable } from 'node:stream';

class MyStream extends Writable {
  constructor() {
    super({ highWaterMark: 10 /* 10 bytes */ });
  }
  _write(data, encode, cb) {
    process.stdout.write(data.toString().toUpperCase() + '\n', cb);
  }
}
const stream = new MyStream();

for (let i = 0; i < 10; i++) {
  const waitDrain = !stream.write('hello');

  if (waitDrain) {
    console.log('>> wait drain');
    await once(stream, 'drain');
  }
}

stream.end('world');
```

ဒီ code မှာ `MyStream` က buffer capacity ([`highWaterMark`](https://nodejs.org/api/stream.html#stream_buffering)) 10 bytes ရှိတဲ့ custom [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) stream ပါ — [`_write`](https://nodejs.org/api/stream.html#writable_writechunk-encoding-callback) method ကို override လုပ်ပြီး data တွေကို uppercase ပြောင်းပြီးမှ ထုတ်ရေးပါတယ်။ Loop က hello ဆိုတဲ့ string ကို ၁၀ ကြိမ် ရေးဖို့ ကြိုးစားပြီး — buffer ပြည့်သွားရင် (`waitDrain` က `true` ဖြစ်ရင်) — [`drain`](https://nodejs.org/api/stream.html#stream_event_drain) event ကို စောင့်ပြီးမှ ဆက်လုပ်ပါတယ် — stream ရဲ့ buffer ကို မလွှမ်းမိုးနိုင်အောင် လုပ်တာပါ။

Output က:

```bash
HELLO
>> wait drain
HELLO
HELLO
>> wait drain
HELLO
HELLO
>> wait drain
HELLO
HELLO
>> wait drain
HELLO
HELLO
>> wait drain
HELLO
WORLD
```

### Duplex

[`Duplex`](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams) streams တွေက readable ရော writable ရော interface နှစ်ခုလုံး အကောင်အထည်ဖော်ထားပါတယ် — Readable နဲ့ Writable Streams ထဲက methods/events အားလုံး ပါဝင်ပါတယ်။ Duplex stream ရဲ့ နမူနာကောင်းကတော့ `net` module ထဲက `Socket` class ပါ:

```cjs
const net = require('node:net');

// Create a TCP server
const server = net.createServer(socket => {
  socket.write('Hello from server!\n');

  socket.on('data', data => {
    console.log(`Client says: ${data.toString()}`);
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

// Start the server on port 8080
server.listen(8080, () => {
  console.log('Server listening on port 8080');
});
```

```mjs
import net from 'node:net';

// Create a TCP server
const server = net.createServer(socket => {
  socket.write('Hello from server!\n');

  socket.on('data', data => {
    console.log(`Client says: ${data.toString()}`);
  });

  // Handle client disconnection
  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

// Start the server on port 8080
server.listen(8080, () => {
  console.log('Server listening on port 8080');
});
```

ဒီ code က port 8080 မှာ TCP socket တစ်ခု ဖွင့်ပြီး — connection ဝင်လာတဲ့ client တိုင်းဆီ `Hello from server!` ပို့ကာ — လက်ခံရတဲ့ data တွေကို log လုပ်ပါတယ်။

```cjs
const net = require('node:net');

// Connect to the server at localhost:8080
const client = net.createConnection({ port: 8080 }, () => {
  client.write('Hello from client!\n');
});

client.on('data', data => {
  console.log(`Server says: ${data.toString()}`);
});

// Handle the server closing the connection
client.on('end', () => {
  console.log('Disconnected from server');
});
```

```mjs
import net from 'node:net';

// Connect to the server at localhost:8080
const client = net.createConnection({ port: 8080 }, () => {
  client.write('Hello from client!\n');
});

client.on('data', data => {
  console.log(`Server says: ${data.toString()}`);
});

// Handle the server closing the connection
client.on('end', () => {
  console.log('Disconnected from server');
});
```

ဒီ code က TCP socket ဆီ connect လုပ်ပြီး `Hello from client` message ပို့ကာ — လက်ခံရတဲ့ data တွေကို log လုပ်ပါတယ်။

### Transform

[`Transform`](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams) streams တွေက duplex streams တွေပါ — output ကို input ပေါ်မူတည်ပြီး တွက်ချက်ပေးပါတယ် — နာမည်အတိုင်းပဲ readable stream နဲ့ writable stream ကြားမှာ data တွေ ဖြတ်သန်းချိန်မှာ transform လုပ်ဖို့ သုံးလေ့ရှိပါတယ်။

Duplex Streams ထဲက methods/events တွေအပြင် ထူးခြားချက်တစ်ခု ရှိပါတယ်:

- **[`_transform`](https://nodejs.org/api/stream.html#transform_transformchunk-encoding-callback)** — readable နဲ့ writable အပိုင်းတွေကြား data flow ကို ကိုင်တွယ်ဖို့ အတွင်းပိုင်းကနေ ခေါ်တဲ့ function — application code ကနေ ဒါကို ခေါ်လို့ မရပါဘူး။

#### Transform Stream တစ်ခု ဖန်တီးခြင်း

Transform stream အသစ် ဖန်တီးဖို့ — `Transform` constructor ဆီ `options` object တစ်ခု ပေးနိုင်ပါတယ် — input ကနေ output ဘယ်လို တွက်မလဲ ဆုံးဖြတ်ပေးတဲ့ `transform` function ပါဝင်ပြီး — `push` method နဲ့ ထုတ်ပေးပါတယ်:

```cjs
const { Transform } = require('node:stream');

const upper = new Transform({
  transform(data, enc, cb) {
    this.push(data.toString().toUpperCase());
    cb();
  },
});
```

```mjs
import { Transform } from 'node:stream';

const upper = new Transform({
  transform(data, enc, cb) {
    this.push(data.toString().toUpperCase());
    cb();
  },
});
```

ဒီ stream က ဝင်လာတဲ့ input ကို ယူပြီး uppercase ပုံစံနဲ့ ထုတ်ပေးပါလိမ့်မယ်။

## Streams တွေနဲ့ အလုပ်လုပ်ခြင်း

Streams တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — source ကနေ ဖတ်ပြီး destination ဆီ ရေးချင်တာ ဖြစ်ပြီး — ကြားမှာ data တချို့ transform လုပ်ချင်တာမျိုး ဖြစ်တတ်ပါတယ်။ အောက်မှာ နည်းလမ်းတွေ ကြည့်ကြရအောင်။

### `.pipe()`

[`.pipe()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_pipe_destination_options) method က readable stream တစ်ခုကို writable (ဒါမှမဟုတ် transform) stream နဲ့ ဆက်ပေးပါတယ်။ ရည်မှန်းချက် ပြည့်မြောက်ဖို့ ရိုးရှင်းတဲ့ နည်းလို့ ထင်ရပေမယ့် — error handling အားလုံးကို programmer ဆီ လွှဲချထားတာမို့ — မှန်ကန်အောင် လုပ်ဖို့ ခက်ခဲစေပါတယ်။

အောက်က ဥပမာမှာ pipe နဲ့ လက်ရှိ file ကို uppercase ပြောင်းပြီး console မှာ ထုတ်ပြဖို့ ကြိုးစားထားပါတယ်:

```cjs
const fs = require('node:fs');
const { Transform } = require('node:stream');

let errorCount = 0;
const upper = new Transform({
  transform(data, enc, cb) {
    if (errorCount === 10) {
      return cb(new Error('BOOM!'));
    }
    errorCount++;
    this.push(data.toString().toUpperCase());
    cb();
  },
});

const readStream = fs.createReadStream(__filename, { highWaterMark: 1 });
const writeStream = process.stdout;

readStream.pipe(upper).pipe(writeStream);

readStream.on('close', () => {
  console.log('Readable stream closed');
});

upper.on('close', () => {
  console.log('Transform stream closed');
});

upper.on('error', err => {
  console.error('\nError in transform stream:', err.message);
});

writeStream.on('close', () => {
  console.log('Writable stream closed');
});
```

```mjs
import fs from 'node:fs';
import { Transform } from 'node:stream';

let errorCount = 0;
const upper = new Transform({
  transform(data, enc, cb) {
    if (errorCount === 10) {
      return cb(new Error('BOOM!'));
    }
    errorCount++;
    this.push(data.toString().toUpperCase());
    cb();
  },
});

const readStream = fs.createReadStream(import.meta.filename, {
  highWaterMark: 1,
});
const writeStream = process.stdout;

readStream.pipe(upper).pipe(writeStream);

readStream.on('close', () => {
  console.log('Readable stream closed');
});

upper.on('close', () => {
  console.log('Transform stream closed');
});

upper.on('error', err => {
  console.error('\nError in transform stream:', err.message);
});

writeStream.on('close', () => {
  console.log('Writable stream closed');
});
```

Character ၁၀ လုံး ရေးပြီးတာနဲ့ — `upper` က callback ထဲမှာ error ပြန်ပေးပြီး — stream ပိတ်သွားစေပါတယ်။ ဒါပေမယ့် တခြား streams တွေကို အကြောင်းကြားမှာ မဟုတ်လို့ — memory leaks ဖြစ်နိုင်ပါတယ်။ Output က:

```bash
CONST FS =
Error in transform stream: BOOM!
Transform stream closed
```

### `pipeline()`

`.pipe()` ရဲ့ အားနည်းချက်တွေနဲ့ low-level ရှုပ်ထွေးမှုတွေကို ရှောင်ဖို့ — အများစုမှာ [`pipeline()`](https://nodejs.org/api/stream.html#stream_stream_pipeline_streams_callback) method ကို သုံးဖို့ အကြံပြုပါတယ် — error handling နဲ့ cleanup တွေကို အလိုအလျောက် ကိုင်တွယ်ပေးတဲ့ ပိုလုံခြုံပြီး ခိုင်မာတဲ့ နည်းလမ်းပါ။

အောက်က ဥပမာက `pipeline()` သုံးတာက အပေါ်က ဥပမာရဲ့ ပြဿနာတွေကို ဘယ်လို ကာကွယ်ပေးလဲ ပြပါတယ်:

```cjs
const fs = require('node:fs');
const { Transform, pipeline } = require('node:stream');

let errorCount = 0;
const upper = new Transform({
  transform(data, enc, cb) {
    if (errorCount === 10) {
      return cb(new Error('BOOM!'));
    }
    errorCount++;
    this.push(data.toString().toUpperCase());
    cb();
  },
});

const readStream = fs.createReadStream(__filename, { highWaterMark: 1 });
const writeStream = process.stdout;

readStream.on('close', () => {
  console.log('Readable stream closed');
});

upper.on('close', () => {
  console.log('\nTransform stream closed');
});

writeStream.on('close', () => {
  console.log('Writable stream closed');
});

pipeline(readStream, upper, writeStream, err => {
  if (err) {
    return console.error('Pipeline error:', err.message);
  }
  console.log('Pipeline succeeded');
});
```

```mjs
import fs from 'node:fs';
import { Transform, pipeline } from 'node:stream';

let errorCount = 0;
const upper = new Transform({
  transform(data, enc, cb) {
    if (errorCount === 10) {
      return cb(new Error('BOOM!'));
    }
    errorCount++;
    this.push(data.toString().toUpperCase());
    cb();
  },
});

const readStream = fs.createReadStream(import.meta.filename, {
  highWaterMark: 1,
});
const writeStream = process.stdout;

readStream.on('close', () => {
  console.log('Readable stream closed');
});

upper.on('close', () => {
  console.log('\nTransform stream closed');
});

writeStream.on('close', () => {
  console.log('Writable stream closed');
});

pipeline(readStream, upper, writeStream, err => {
  if (err) {
    return console.error('Pipeline error:', err.message);
  }
  console.log('Pipeline succeeded');
});
```

ဒီကိစ္စမှာ streams အားလုံး ပိတ်သွားပြီး output က:

```bash
CONST FS =
Transform stream closed
Writable stream closed
Pipeline error: BOOM!
Readable stream closed
```

[`pipeline()`](https://nodejs.org/api/stream.html#stream_stream_pipeline_streams_callback) မှာ callback မယူဘဲ — promise ပြန်ပေးတဲ့ — pipeline ကျရှုံးရင် reject ဖြစ်တဲ့ — [async version](https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-options) တစ်ခုလည်း ရှိပါတယ်။

### Async Iterators

**Async iterators** တွေက Streams API နဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ standard နည်းလမ်းအဖြစ် အကြံပြုထားပါတယ် — Web ရော Node.js ရော ရှိ stream primitives တွေနဲ့ ယှဉ်ရင် နားလည်ရလွယ်ပြီး သုံးရလွယ်ကာ — bug နည်းပြီး maintain လုပ်ရလွယ်တဲ့ code တွေ ရေးလို့ရပါတယ်။ Node.js မှာ readable streams အားလုံးက asynchronous iterables တွေပါ — `for await...of` syntax နဲ့ stream ထဲက data တွေကို ရောက်တိုင်း loop ပတ်ပြီး ကိုင်တွယ်နိုင်ပါတယ်။

အကျိုးကျေးဇူးတွေကတော့:

- **Readability ပိုကောင်းခြင်း** — အထူးသဖြင့် asynchronous data source အများကြီး ရှိတဲ့အခါ code structure ပိုရှင်းပါတယ်။
- **Error Handling** — သာမန် async function တွေလိုပဲ `try/catch` blocks တွေနဲ့ ရိုးရိုးရှင်းရှင်း error ကိုင်တွယ်လို့ရပါတယ်။
- **Flow Control** — consumer က data နောက်တစ်ပိုင်း စောင့်တာကို ထိန်းချုပ်နိုင်လို့ backpressure ကို သဘာဝကျကျ စီမံပေးပြီး — memory သုံးစွဲမှုနဲ့ processing ပိုထိရောက်ပါတယ်။

ဒီမှာ readable stream တစ်ခုနဲ့ async iterators သုံးပြထားတဲ့ ဥပမာပါ:

```cjs
const fs = require('node:fs');
const { pipeline } = require('node:stream/promises');

async function main() {
  await pipeline(
    fs.createReadStream(__filename),
    async function* (source) {
      for await (let chunk of source) {
        yield chunk.toString().toUpperCase();
      }
    },
    process.stdout
  );
}

main().catch(console.error);
```

```mjs
import fs from 'fs';
import { pipeline } from 'stream/promises';

await pipeline(
  fs.createReadStream(import.meta.filename),
  async function* (source) {
    for await (const chunk of source) {
      yield chunk.toString().toUpperCase();
    }
  },
  process.stdout
);
```

ဒီ code က အပေါ်က ဥပမာတွေနဲ့ ရလဒ်တူပေမယ့် — transform stream အသစ် သတ်မှတ်စရာ မလိုပါဘူး။ Pipeline ရဲ့ async version ကို သုံးထားလို့ — error တွေ ကိုင်တွယ်ဖို့ `try...catch` block ထဲ ထည့်ထားသင့်ပါတယ်။

### Object Mode

ပုံမှန်အားဖြင့် streams တွေက strings, [`Buffer`](https://nodejs.org/api/buffer.html), [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) တွေနဲ့ အလုပ်လုပ်နိုင်ပြီး — ဒါတွေကလွဲလို့ တခြား တန်ဖိုး (object လိုမျိုး) stream ထဲ push ရင် `TypeError` တက်ပါတယ်။ `objectMode` option ကို `true` ထားရင်တော့ — `null` ကလွဲပြီး (null က stream အဆုံးသတ်ဖို့ သုံးလို့) — ဘယ် JavaScript value နဲ့မဆို အလုပ်လုပ်နိုင်ပါတယ် — readable stream မှာ ဘာ value မဆို `push`/`read` လုပ်နိုင်ပြီး writable stream မှာ ဘာ value မဆို `write` လုပ်နိုင်ပါတယ်:

```cjs
const { Readable } = require('node:stream');

const readable = Readable({
  objectMode: true,
  read() {
    this.push({ hello: 'world' });
    this.push(null);
  },
});
```

```mjs
import { Readable } from 'node:stream';

const readable = Readable({
  objectMode: true,
  read() {
    this.push({ hello: 'world' });
    this.push(null);
  },
});
```

Object mode မှာ — `highWaterMark` option က bytes အရေအတွက် မဟုတ်ဘဲ — objects အရေအတွက်ကို ရည်ညွှန်းတာ သတိရပါ။

### Backpressure

Streams သုံးတဲ့အခါ — producer က consumer ကို မလွှမ်းမိုးအောင် သေချာစေရပါမယ် — ဒါအတွက် Node.js API ထဲက streams တွေ အားလုံးမှာ **backpressure** mechanism သုံးပြီး — implementor တွေက ဒီ behavior ကို ထိန်းသိမ်းဖို့ တာဝန်ရှိပါတယ်။ Data buffer က [`highWaterMark`](https://nodejs.org/api/stream.html#stream_buffering) ထက် ကျော်သွားတဲ့အခါ (ဒါမှမဟုတ် write queue မအားတဲ့အခါ) — [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) က `false` ပြန်ပါတယ်။ ဒါဆိုရင် backpressure system က ဝင်ပြီး — incoming [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) stream ကို ခဏရပ်ထားကာ consumer အဆင်သင့် ဖြစ်တဲ့အထိ စောင့်ပါတယ် — buffer လွတ်တာနဲ့ [`'drain'`](https://nodejs.org/api/stream.html#stream_event_drain) event ထွက်ပြီး data flow ပြန်စပါတယ်။ Backpressure အကြောင်း ပိုနားလည်ချင်ရင် [Backpressure သဘောတရား](/docs/nodejs/backpressuring-in-streams) guide ကို ဖတ်ပါ။

## Streams vs Web Streams

Stream သဘောတရားက Node.js အတွက်ပဲ သီးသန့် မဟုတ်ပါဘူး — Node.js မှာ [`Web Streams`](https://nodejs.org/api/webstreams.html) လို့ခေါ်တဲ့ — [`WHATWG Streams Standard`](https://streams.spec.whatwg.org/) ကို အကောင်အထည်ဖော်ထားတဲ့ နောက်ထပ် stream implementation တစ်မျိုးလည်း ရှိပါတယ်။ နောက်ကွယ်က သဘောတရားတွေ ဆင်တူပေမယ့် — APIs မတူညီပဲ တိုက်ရိုက် compatible မဟုတ်တာ သတိပြုပါ။ [`Web Streams`](https://nodejs.org/api/webstreams.html) ထဲက [`ReadableStream`](https://nodejs.org/api/webstreams.html#class-readablestream), [`WritableStream`](https://nodejs.org/api/webstreams.html#class-writablestream), [`TransformStream`](https://nodejs.org/api/webstreams.html#class-transformstream) classes တွေက Node.js ရဲ့ [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams), [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams), [`Transform`](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams) တွေနဲ့ တူညီပါတယ်။

### Streams နဲ့ Web Streams အပြန်အလှန် သုံးခြင်း

Node.js က Web Streams နဲ့ Node.js streams အကြား အပြန်အလှန် ပြောင်းဖို့ utility functions တွေ ပေးပါတယ် — stream class တစ်ခုစီမှာ `toWeb` နဲ့ `fromWeb` methods တွေအနေနဲ့ပါ။ အောက်က [`Duplex`](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams) class ထဲက ဥပမာမှာ readable ရော writable ရော Web Streams အဖြစ် ပြောင်းပြီး အလုပ်လုပ်ပုံ ပြထားပါတယ်:

```cjs
const { Duplex } = require('node:stream');

const duplex = Duplex({
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

readable
  .getReader()
  .read()
  .then(result => {
    console.log('readable', result.value);
  });
```

```mjs
import { Duplex } from 'node:stream';

const duplex = Duplex({
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

readable
  .getReader()
  .read()
  .then(result => {
    console.log('readable', result.value);
  });
```

ဒီ helper functions တွေက Node.js module ကနေ Web Stream ပြန်ပေးဖို့လိုတဲ့အခါ (ဒါမှမဟုတ် ပြောင်းပြန်) အသုံးဝင်ပါတယ်။ ပုံမှန် stream စားသုံးမှုအတွက်တော့ — async iterators တွေက Node.js streams ရော Web Streams ရော နှစ်မျိုးလုံးနဲ့ ချောမွေ့စွာ အလုပ်လုပ်နိုင်ပါတယ်:

```cjs
const { pipeline } = require('node:stream/promises');

async function main() {
  const { body } = await fetch('https://nodejs.org/api/stream.html');

  await pipeline(
    body,
    new TextDecoderStream(),
    async function* (source) {
      for await (const chunk of source) {
        yield chunk.toString().toUpperCase();
      }
    },
    process.stdout
  );
}

main().catch(console.error);
```

```mjs
import { pipeline } from 'node:stream/promises';

const { body } = await fetch('https://nodejs.org/api/stream.html');

await pipeline(
  body,
  new TextDecoderStream(),
  async function* (source) {
    for await (const chunk of source) {
      yield chunk.toString().toUpperCase();
    }
  },
  process.stdout
);
```

သတိပြုရမှာ — fetch ရဲ့ body က `ReadableStream<Uint8Array>` ဖြစ်လို့ — chunks တွေကို strings အနေနဲ့ အလုပ်လုပ်ဖို့ [`TextDecoderStream`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream) လိုအပ်ပါတယ်။

ဒီအကြောင်းအရာကို [Matteo Collina](https://github.com/mcollina) ရဲ့ [Platformatic's Blog](https://blog.platformatic.dev/a-guide-to-reading-and-writing-nodejs-streams) မှာ ဖော်ပြခဲ့တဲ့ content ကနေ ဆီလျော်အောင် ပြန်ဆင့်ထားတာ ဖြစ်ပါတယ်။

## ဆက်ဖတ်ရန်

- [Backpressure သဘောတရား](/docs/nodejs/backpressuring-in-streams) — stream တွေထဲက backpressure ယန္တရား အသေးစိတ်
- [Node.js Event Emitter](/docs/nodejs/the-nodejs-event-emitter) — stream events တွေရဲ့ အခြေခံ
- [Node.js Event Loop](/docs/nodejs/event-loop) — I/O ကို ဘယ်လို စီမံပေးသလဲ
