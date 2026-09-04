---
title: "Iterable Streams"
description: "node:stream/iter module (experimental) — iterable အခြေပြု streaming API: from, pull, push, pipeTo, duplex, broadcast, share, classic stream interop စသည်တို့အကြောင်း"
order: 112
source: "https://nodejs.org/api/stream_iter.html"
status: translated
updated: 2026-09-04
---

> Stability: 1 - Experimental – ဒီ API ကို [`--experimental-stream-iter`][] CLI flag နဲ့ enable လုပ်ပြီးမှ သုံးနိုင်ပါတယ်။

`node:stream/iter` module က event-driven ဖြစ်တဲ့ `Readable`/`Writable`/`Transform` class hierarchy (အဆင့်ဆင့် ဖွဲ့စည်းပုံ) ဒါမှမဟုတ် Web Streams ရဲ့ `ReadableStream`/`WritableStream`/`TransformStream` interfaces တွေအစား — iterables တွေပေါ်မှာ အခြေခံတဲ့ streaming API တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

Stream တွေကို {AsyncIterable} (async) ဒါမှမဟုတ် {Iterable} (sync) အနေနဲ့ ကိုယ်စားပြုပါတယ်။ Extend (ဆက်ခံချဲ့ထွင်) လုပ်ဖို့ base classes တွေ မရှိပါဘူး — iterable protocol ကို အကောင်အထည်ဖော်ထားတဲ့ object မှန်သမျှ ပါဝင်လို့ ရပါတယ်။ Transform တွေကတော့ ရိုးရိုး functions တွေ ဒါမှမဟုတ် `transform` method ပါတဲ့ objects တွေ ဖြစ်ပါတယ်။

Data တွေက async operations တွေရဲ့ ကုန်ကျစရိတ်ကို သက်သာစေဖို့ **batches** အနေနဲ့ ({Uint8Array\[]} — iteration တစ်ခုလျှင်) စီးဆင်းပါတယ်။

```mjs
import { from, pull, text } from 'node:stream/iter';
import { compressGzip, decompressGzip } from 'node:zlib/iter';

// Compress and decompress a string
const compressed = pull(from('Hello, world!'), compressGzip());
const result = await text(pull(compressed, decompressGzip()));
console.log(result); // 'Hello, world!'
```

```cjs
const { from, pull, text } = require('node:stream/iter');
const { compressGzip, decompressGzip } = require('node:zlib/iter');

async function run() {
  // Compress and decompress a string
  const compressed = pull(from('Hello, world!'), compressGzip());
  const result = await text(pull(compressed, decompressGzip()));
  console.log(result); // 'Hello, world!'
}

run().catch(console.error);
```

```mjs
import { open } from 'node:fs/promises';
import { text, pipeTo } from 'node:stream/iter';
import { compressGzip, decompressGzip } from 'node:zlib/iter';

// Read a file, compress, write to another file
const src = await open('input.txt', 'r');
const dst = await open('output.gz', 'w');
await pipeTo(src.pull(), compressGzip(), dst.writer({ autoClose: true }));
await src.close();

// Read it back
const gz = await open('output.gz', 'r');
console.log(await text(gz.pull(decompressGzip(), { autoClose: true })));
```

```cjs
const { open } = require('node:fs/promises');
const { text, pipeTo } = require('node:stream/iter');
const { compressGzip, decompressGzip } = require('node:zlib/iter');

async function run() {
  // Read a file, compress, write to another file
  const src = await open('input.txt', 'r');
  const dst = await open('output.gz', 'w');
  await pipeTo(src.pull(), compressGzip(), dst.writer({ autoClose: true }));
  await src.close();

  // Read it back
  const gz = await open('output.gz', 'r');
  console.log(await text(gz.pull(decompressGzip(), { autoClose: true })));
}

run().catch(console.error);
```

## အခြေခံ သဘောတရားများ (Concepts)

### Byte stream များ (Byte streams)

ဒီ API ထဲက data အားလုံးကို {Uint8Array} bytes အနေနဲ့ ကိုယ်စားပြုပါတယ်။ String တွေကို `from()`, `push()`, (သို့) `pipeTo()` ဆီ ပေးပို့လိုက်တဲ့အခါ UTF-8 နဲ့ အလိုအလျောက် encode လုပ်ပါတယ်။ ဒါက encoding တွေနဲ့ ပတ်သက်တဲ့ မရေရာမှုတွေကို ဖယ်ရှားပေးပြီး — streams တွေနဲ့ native code တွေကြားမှာ zero-copy transfers (မိတ္တူမကူးဘဲ တိုက်ရိုက် လွှဲပြောင်းခြင်း) တွေကို လုပ်နိုင်စေပါတယ်။

### Batch လုပ်ခြင်း (Batching)

Iteration တစ်ခုချင်းစီကနေ **batch** တစ်ခု ထွက်လာပါတယ် — {Uint8Array} chunk တွေရဲ့ {Array} တစ်ခု ({Uint8Array\[]}) ပါ။ Batch လုပ်ခြင်းက `await` နဲ့ {Promise} ဖန်တီးခြင်းရဲ့ ကုန်ကျစရိတ်ကို chunk အများအပြားကြားမှာ ခွဲဝေ သက်သာစေပါတယ်။ Chunk တစ်ခုချင်းစီကို တစ်ချိန်ကို တစ်ခုစီ process လုပ်တဲ့ consumer က အတွင်း array ကို ရိုးရိုးရှင်းရှင်း iterate လုပ်လိုက်ရုံပါပဲ:

```mjs
for await (const batch of source) {
  for (const chunk of batch) {
    handle(chunk);
  }
}
```

```cjs
async function run() {
  for await (const batch of source) {
    for (const chunk of batch) {
      handle(chunk);
    }
  }
}
```

### Transform များ (Transforms)

Transform တွေက ပုံစံ နှစ်မျိုး ရှိပါတယ်:

* **Stateless** — batch တစ်ခုစီအတွက် တစ်ကြိမ် ခေါ်ယူတဲ့ function `(chunks, options) => result` တစ်ခု ဖြစ်ပါတယ်။ `Uint8Array[]` (သို့မဟုတ် flush signal အနေနဲ့ `null`) နဲ့ `options` object တစ်ခုကို လက်ခံရရှိပြီး {Uint8Array\[]|null|Iterable} ကို ပြန်ပေးပါတယ်။

* **Stateful** — `transform` က generator (sync သို့မဟုတ် async) ဖြစ်တဲ့ object `{ transform(source, options) }` တစ်ခု ဖြစ်ပါတယ်။ ဒီ generator က upstream iterable တစ်ခုလုံးနဲ့ `options` object တစ်ခုကို လက်ခံရရှိပြီး output တွေကို yield လုပ်ပေးပါတယ်။ ဒီပုံစံကို compression, encryption, နဲ့ batch တွေကြားမှာ buffer လုပ်ထားဖို့ လိုအပ်တဲ့ transform မျိုးတွေအတွက် သုံးပါတယ်။

ပုံစံ နှစ်မျိုးလုံးက အောက်ပါ property ပါတဲ့ `options` parameter တစ်ခုကို လက်ခံရရှိပါတယ်:

* `options.signal` {AbortSignal} Pipeline ကို cancel လုပ်တဲ့အခါ၊ error တစ်ခု ကြုံရတဲ့အခါ၊ ဒါမှမဟုတ် consumer က ဖတ်တာ ရပ်လိုက်တဲ့အခါ fire ဖြစ်စေတဲ့ AbortSignal တစ်ခု ဖြစ်ပါတယ်။ Transform တွေက `signal.aborted` ကို စစ်ဆေးနိုင်သလို — စောစော cleanup (ရှင်းလင်းခြင်း) လုပ်ဖို့ `'abort'` event ကိုလည်း listen လုပ်နိုင်ပါတယ်။

Flush signal (`null`) ကို source ပြီးဆုံးသွားပြီးနောက် ပို့ပေးပါတယ် — ဒါကြောင့် transforms တွေက နောက်ဆုံးမှ ထွက်လာတဲ့ data (ဥပမာ — compression footers) တွေကို ထုတ်လွှတ်ဖို့ အခွင့်အရေး ရရှိပါတယ်။

```js
// Stateless: uppercase transform
const upper = (chunks) => {
  if (chunks === null) return null; // flush
  return chunks.map((c) => new TextEncoder().encode(
    new TextDecoder().decode(c).toUpperCase(),
  ));
};

// Stateful: line splitter
const lines = {
  transform: async function*(source) {
    let partial = '';
    for await (const chunks of source) {
      if (chunks === null) {
        if (partial) yield [new TextEncoder().encode(partial)];
        continue;
      }
      for (const chunk of chunks) {
        const str = partial + new TextDecoder().decode(chunk);
        const parts = str.split('\n');
        partial = parts.pop();
        for (const line of parts) {
          yield [new TextEncoder().encode(`${line}\n`)];
        }
      }
    }
  },
};
```

### Pull နှင့် push (Pull vs. push)

API က ပုံစံ နှစ်မျိုးကို ပံ့ပိုးပေးပါတယ်:

* **Pull** — လိုအပ်မှသာ data တွေ စီးဆင်းပါတယ်။ `pull()` နဲ့ `pullSync()` တွေက consumer က iterate လုပ်မှသာ source ကနေ ဖတ်တဲ့ lazy pipelines တွေကို ဖန်တီးပေးပါတယ်။

* **Push** — data တွေကို ရှင်းရှင်းလင်းလင်း ရေးသွင်းပါတယ်။ `push()` က backpressure (နောက်ကန် ဖိအားပေးမှု စနစ်) ပါဝင်တဲ့ writer/readable pair တစ်ခုကို ဖန်တီးပေးပါတယ်။ Writer က data တွေကို ထည့်သွင်းပေးပြီး — readable ကို async iterable အနေနဲ့ စားသုံးပါတယ်။

### နောက်ပြန် ဖိအားပေးမှု (Backpressure)

Pull streams တွေမှာ သဘာဝအလျောက် backpressure ရှိပါတယ် — consumer က အရှိန်ကို ထိန်းချုပ်ထားတာမို့ source ကို consumer process လုပ်နိုင်တာထက် ပိုမြန်အောင် ဘယ်တော့မှ ဖတ်မှာ မဟုတ်ပါဘူး။ Push streams တွေကတော့ producer နဲ့ consumer တွေက သီးခြား လွတ်လပ်စွာ run နေတာမို့ ရှင်းလင်းတဲ့ backpressure လိုအပ်ပါတယ်။ `push()`, `broadcast()`, နဲ့ `share()` တွေပေါ်က `budget` နဲ့ `backpressure` options တွေက ဒါကို ဘယ်လို ထိန်းချုပ်လဲဆိုတာ သတ်မှတ်ပေးပါတယ်။

#### Buffer နှစ်ခု ပုံစံ (The two-buffer model)

Push streams တွေက အပိုင်း နှစ်ပိုင်း ပါတဲ့ buffering system တစ်ခုကို သုံးပါတယ်။ ပုံး (buffer) တစ်ပုံး ထဲကို ရေပိုက် (pending writes) ကနေတစ်ဆင့် ရေဖြည့်နေပြီး — ပုံး ပြည့်သွားတာနဲ့ ပိတ်သွားတဲ့ float valve (အလိုအလျောက် ပိတ်သော အဆို့ရှင်) တစ်ခု ပါတယ်လို့ မြင်ယောင်ကြည့်ပါ:

```text
                          budget (e.g., 16384)
                                 |
    Producer                     v
       |                    +---------+
       v                    |         |
  [ write() ] ----+    +--->| buffer  |---> Consumer pulls
  [ write() ]     |    |    | (bucket)|     for await (...)
  [ write() ]     v    |    +---------+
              +--------+         ^
              | pending|         |
              | writes |    float valve
              | (hose) |    (backpressure)
              +--------+
                   ^
                   |
          'strict' mode limits this too!
```

* **Buffer (the bucket)** — consumer အတွက် အသင့်ဖြစ်နေတဲ့ data တွေ ဖြစ်ပြီး `budget` bytes အထိ ကန့်သတ်ထားပါတယ်။ Consumer က pull လုပ်တဲ့အခါ buffer ထဲက data အားလုံးကို တစ်ပြိုင်နက် batch တစ်ခုတည်းအဖြစ် ထုတ်ယူသွားပါတယ်။

* **Pending writes (the hose)** — buffer နေရာလွတ် အတွက် စောင့်ဆိုင်းနေတဲ့ writes တွေ ဖြစ်ပါတယ်။ Consumer က drain လုပ်ပြီးတဲ့နောက် — pending writes တွေကို ယခု ဗလာဖြစ်နေတဲ့ buffer ထဲကို ရောက်အောင် မြှင့်တင်ပေးပြီး သူတို့ရဲ့ promises တွေ settle ဖြစ်သွားပါတယ်။

Policy တစ်ခုချင်းစီက ဒီ buffers တွေကို ဘယ်လို သုံးလဲဆိုတာ အောက်မှာ ဖော်ပြထားပါတယ်:

| Policy (မူဝါဒ) | Buffer limit (buffer ကန့်သတ်ချက်) | Pending writes limit (pending writes ကန့်သတ်ချက်) |
| --------------- | ----------------------------------- | ------------------------------------------------------ |
| `'strict'`      | `budget`                            | 1                                                      |
| `'unbounded'`   | `budget`                            | ကန့်သတ်မဲ့                                               |
| `'drop-oldest'` | `budget`                            | N/A (ဘယ်တော့မှ မစောင့်)                                |
| `'drop-newest'` | `budget`                            | N/A (ဘယ်တော့မှ မစောင့်)                                |

#### Strict (default) (တင်းကျပ်သော မူဝါဒ — မူရင်း)

Strict mode က "fire-and-forget" (ရေးလိုက်ပြီး စောင့်မကြည့်တဲ့) ပုံစံတွေကို ဖမ်းမိပါတယ် — producer က `write()` ကို await မလုပ်ဘဲ ခေါ်တာမျိုးပါ။ ဒီလိုမျိုးက memory ကို ကန့်သတ်ချက်မရှိ ကြီးထွားစေနိုင်လို့ပါ။ Buffer ကို `budget` bytes အထိ ကန့်သတ်ပြီး pending writes queue ကိုလည်း entry တစ်ခုတည်းအထိပဲ ကန့်သတ်ထားပါတယ်။

Write တစ်ခုချင်းစီကို မှန်မှန် await လုပ်မယ်ဆိုရင် — ကိုယ့်ရဲ့ write တစ်ခုတည်းကိုပဲ တစ်ကြိမ်မှာ တစ်ခုစီ pending ဖြစ်နေနိုင်တာမို့ pending writes ကန့်သတ်ချက်ကို ဘယ်တော့မှ မထိပါဘူး။ Await မလုပ်ထားတဲ့ writes တွေက pending queue ထဲမှာ စုပုံလာပြီး — queue ပြည့်လျှံသွားတာနဲ့ throw လုပ်ပါလိမ့်မယ်:

```mjs
import { push, text } from 'node:stream/iter';

const { writer, readable } = push({ budget: 16384 });

// Consumer must run concurrently -- without it, the first write
// that fills the buffer blocks the producer forever.
const consuming = text(readable);

// GOOD: awaited writes. The producer waits for the consumer to
// make room when the buffer is full.
for (const item of dataset) {
  await writer.write(item);
}
await writer.end();
console.log(await consuming);
```

```cjs
const { push, text } = require('node:stream/iter');

async function run() {
  const { writer, readable } = push({ budget: 16384 });

  // Consumer must run concurrently -- without it, the first write
  // that fills the buffer blocks the producer forever.
  const consuming = text(readable);

  // GOOD: awaited writes. The producer waits for the consumer to
  // make room when the buffer is full.
  for (const item of dataset) {
    await writer.write(item);
  }
  await writer.end();
  console.log(await consuming);
}

run().catch(console.error);
```

`await` လုပ်ဖို့ မေ့လိုက်ရင် နောက်ဆုံးမှာ throw ဖြစ်ပါလိမ့်မယ်:

```js
// BAD: fire-and-forget. Strict mode throws once both buffers fill.
for (const item of dataset) {
  writer.write(item); // Not awaited -- queues without bound
}
// --> throws "Backpressure violation: too many pending writes"
```

#### Unbounded (ကန့်သတ်မဲ့ မူဝါဒ)

Unbounded mode က buffered bytes တွေကို `budget` မှာ ကန့်သတ်ပေမယ့် — pending writes queue ကိုတော့ ဘယ်လို ကန့်သတ်ချက်မှ မရှိပါဘူး။ Awaited writes တွေက strict mode လိုပဲ consumer က နေရာလွတ် လုပ်ပေးတဲ့အထိ block လုပ်ပါတယ်။ ကွာခြားချက်ကတော့ — await မလုပ်ထားတဲ့ writes တွေက throw လုပ်မယ့်အစား တိတ်တဆိတ် အမြဲတမ်း queue ထဲ စီတန်းနေမှာ ဖြစ်ပါတယ် — producer က `await` လုပ်ဖို့ မေ့သွားရင် memory leak (မှတ်ဉာဏ် ယိုစိမ့်မှု) ဖြစ်နိုင်ခြေ ရှိပါတယ်။

ဒါက လက်ရှိ Node.js classic streams တွေနဲ့ Web Streams တွေ မူလအားဖြင့် သုံးနေတဲ့ mode ပါ။ Producer ကို ကိုယ်တိုင် ထိန်းချုပ်ထားပြီး await ကို မှန်မှန် လုပ်တယ်ဆိုတာ သေချာတဲ့အခါ (သို့) အဲဒီ APIs တွေကနေ code တွေ ပြောင်းရွှေ့နေတဲ့အခါ သုံးပါ။

```mjs
import { push, text } from 'node:stream/iter';

const { writer, readable } = push({
  budget: 16384,
  backpressure: 'unbounded',
});

const consuming = text(readable);

// Safe -- awaited writes block until the consumer reads.
for (const item of dataset) {
  await writer.write(item);
}
await writer.end();
console.log(await consuming);
```

```cjs
const { push, text } = require('node:stream/iter');

async function run() {
  const { writer, readable } = push({
    budget: 16384,
    backpressure: 'unbounded',
  });

  const consuming = text(readable);

  // Safe -- awaited writes block until the consumer reads.
  for (const item of dataset) {
    await writer.write(item);
  }
  await writer.end();
  console.log(await consuming);
}

run().catch(console.error);
```

#### Drop-oldest (အသက်အကြီးဆုံး စွန့်ပယ်ခြင်း)

Writes တွေက ဘယ်တော့မှ မစောင့်ပါဘူး။ Slots buffer ပြည့်နေတဲ့အခါ — အသက်အကြီးဆုံး buffered chunk ကို ဖယ်ထုတ်ပြီး ဝင်လာတဲ့ write အတွက် နေရာလွတ် လုပ်ပေးပါတယ်။ Consumer က အမြဲတမ်း အသစ်ဆုံး data တွေကိုပဲ မြင်ရပါတယ်။ Live feeds, telemetry (တိုင်းတာမှု အချက်အလက်), ဒါမှမဟုတ် ခေတ်နောက်ကျနေတဲ့ (stale) data ထက် လက်ရှိ data က ပိုတန်ဖိုးရှိတဲ့ ကိစ္စရပ်မျိုးတွေအတွက် အသုံးဝင်ပါတယ်။

```mjs
import { push } from 'node:stream/iter';

// Keep only the most recent ~16 KB of readings
const { writer, readable } = push({
  budget: 16384,
  backpressure: 'drop-oldest',
});
```

```cjs
const { push } = require('node:stream/iter');

// Keep only the most recent ~16 KB of readings
const { writer, readable } = push({
  budget: 16384,
  backpressure: 'drop-oldest',
});
```

#### Drop-newest (အသစ်ဆုံး စွန့်ပယ်ခြင်း)

Writes တွေက ဘယ်တော့မှ မစောင့်ပါဘူး။ Slots buffer ပြည့်နေတဲ့အခါ — ဝင်လာတဲ့ write ကို တိတ်တဆိတ် ပစ်ပယ်လိုက်ပါတယ်။ Consumer က data အသစ်တွေနဲ့ မလွှမ်းမိုးခံရဘဲ — buffer လုပ်ထားပြီးသား data တွေကိုပဲ process လုပ်ပါတယ်။ Rate-limiting (နှုန်း ကန့်သတ်ခြင်း) ဒါမှမဟုတ် ဖိအားများချိန်မှာ load လျှော့ချဖို့ (shedding load) အတွက် အသုံးဝင်ပါတယ်။

```mjs
import { push } from 'node:stream/iter';

// Accept up to 16 KB of buffered data; discard anything beyond that
const { writer, readable } = push({
  budget: 16384,
  backpressure: 'drop-newest',
});
```

```cjs
const { push } = require('node:stream/iter');

// Accept up to 16 KB of buffered data; discard anything beyond that
const { writer, readable } = push({
  budget: 16384,
  backpressure: 'drop-newest',
});
```

### Writer interface (writer ၏ interface)

Writer ဆိုတာ Writer interface နဲ့ ကိုက်ညီတဲ့ object မှန်သမျှ ဖြစ်ပါတယ်။ `write()` တစ်ခုတည်းကိုပဲ မဖြစ်မနေ လိုအပ်ပြီး — ကျန်တဲ့ method တွေ အားလုံးက optional ပါ။

Async method တစ်ခုချင်းစီမှာ try-fallback ပုံစံအတွက် ရည်ရွယ်ထားတဲ့ synchronous `*Sync` counterpart (အဖော် method) တစ်ခုစီ ရှိပါတယ် — မြန်ဆန်တဲ့ synchronous path ကို အရင် ကြိုးစားပြီး — synchronous call က မပြီးနိုင်ဘူးလို့ ပြတဲ့အခါမှသာ async version ဆီ ပြန်ကျလိုက်ပါတယ်:

```mjs
if (!writer.writeSync(chunk)) await writer.write(chunk);
if (!writer.writevSync(chunks)) await writer.writev(chunks);
if (writer.endSync() < 0) await writer.end();
writer.fail(err);  // Always synchronous, no fallback needed
```

#### `writer.canWrite`

* {boolean|null}

`true` ကို ပြန်ပေးရင် နောက် write က လက်ခံခံရဖို့ များပါတယ် (buffered data က စွမ်းရည်အောက်မှာ ရှိနေလို့ပါ)။ `false` ဆိုရင် backpressure သက်ရောက်နေပြီး — `null` ဆိုရင် writer က ပိတ်သွားပြီ (သို့) consumer က ချိတ်ဆက်မှု ဖြတ်လိုက်ပြီလို့ ဆိုလိုပါတယ်။

ဒါက အချက်ပြမှု (hint) တစ်ခုပဲ ဖြစ်ပြီး အာမခံချက် မဟုတ်ပါဘူး — စစ်ဆေးတဲ့အချိန်နဲ့ write လုပ်တဲ့အချိန်ကြားမှာ state ပြောင်းသွားနိုင်လို့ပါ။ Polling (ထပ်ခါထပ်ခါ စစ်နေခြင်း) လုပ်မယ့်အစား နေရာလွတ် စောင့်ဖို့ [`ondrain()`][] ကို သုံးပါ။

#### `writer.end([options])`

* `options` {Object}
  * `signal` {AbortSignal} ဒီ operation တစ်ခုတည်းကိုပဲ cancel လုပ်ပါတယ်။ ဒီ signal က pending ဖြစ်နေတဲ့ `end()` call ကိုပဲ cancel လုပ်ပြီး — writer ကိုယ်တိုင်ကိုတော့ fail မဖြစ်စေပါဘူး။
* Returns: {Promise} ရေးသားပြီးသား bytes စုစုပေါင်း အရေအတွက်နဲ့ fulfill ဖြစ်ပါတယ်။

နောက်ထပ် data မရေးတော့ဘူးဆိုတာ အချက်ပြပြီး — buffered data တွေ drain ဖြစ်သွားတဲ့အထိ စောင့်ပါတယ်။

#### `writer.endSync()`

* Returns: {number} ရေးသားပြီးသား bytes စုစုပေါင်း၊ (သို့) ending က synchronous အနေနဲ့ မပြီးနိုင်ရင် `-1`။

`writer.end()` ရဲ့ synchronous မူကွဲ ဖြစ်ပါတယ်။ ပြန်ပေးတဲ့ တန်ဖိုးက `-1` ဆိုရင် — ပိတ်ခြင်း စတင်ပြီးပြီ ဖြစ်ပေမယ့် asynchronous အနေနဲ့ drain လုပ်ဖို့ လိုအပ်နေတယ်လို့ ဆိုလိုပါတယ်။ ပြီးဆုံးတာကို စောင့်ဖို့ try-fallback ပုံစံကို သုံးပါ:

```cjs
const result = writer.endSync();
if (result < 0) {
  writer.end();
}
```

#### `writer.fail(reason)`

* `reason` {any}

Writer ကို terminal error state (အဆုံးသတ် error အခြေအနေ) ထဲ ရောက်အောင် လုပ်ပါတယ်။ Writer က ပိတ်ပြီးသား (သို့) error ဖြစ်ပြီးသား ဆိုရင် ဒါက no-op (ဘာမှ မလုပ်ခြင်း) ပါ။ `write()` နဲ့ `end()` တို့နဲ့ မတူဘဲ — `fail()` က ခြွင်းချက်မရှိ synchronous ဖြစ်ပါတယ်။ အကြောင်းကတော့ writer တစ်ခုကို fail လုပ်တာက async work လုပ်စရာ မလိုတဲ့ စင်ကြယ်တဲ့ state transition (အခြေအနေ ကူးပြောင်းမှု) တစ်ခုသာ ဖြစ်လို့ပါ။

#### `writer.write(chunk[, options])`

* `chunk` {Uint8Array|string}
* `options` {Object}
  * `signal` {AbortSignal} ဒီ write operation တစ်ခုတည်းကိုပဲ cancel လုပ်ပါတယ်။ ဒီ signal က pending ဖြစ်နေတဲ့ `write()` call ကိုပဲ cancel လုပ်ပြီး — writer ကိုယ်တိုင်ကိုတော့ fail မဖြစ်စေပါဘူး။
* Returns: {Promise} Buffer နေရာလွတ် ရှိလာတဲ့အခါ `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

Chunk တစ်ခုကို ရေးသားပါတယ်။

#### `writer.writeSync(chunk)`

* `chunk` {Uint8Array|string}
* Returns: {boolean} write ကို လက်ခံလိုက်ရင် `true`၊ buffer ပြည့်နေရင် `false`။

Synchronous write ဖြစ်ပါတယ်။ Block မလုပ်ပါဘူး — backpressure သက်ရောက်နေရင် `false` ကို ပြန်ပေးပါတယ်။

#### `writer.writev(chunks[, options])`

* `chunks` {Uint8Array\[]|string\[]}
* `options` {Object}
  * `signal` {AbortSignal} ဒီ write operation တစ်ခုတည်းကိုပဲ cancel လုပ်ပါတယ်။ ဒီ signal က pending ဖြစ်နေတဲ့ `writev()` call ကိုပဲ cancel လုပ်ပြီး — writer ကိုယ်တိုင်ကိုတော့ fail မဖြစ်စေပါဘူး။
* Returns: {Promise}

Chunk အများအပြားကို batch တစ်ခုတည်း အနေနဲ့ ရေးသားပါတယ်။

#### `writer.writevSync(chunks)`

* `chunks` {Uint8Array\[]|string\[]}
* Returns: {boolean} write ကို လက်ခံလိုက်ရင် `true`၊ buffer ပြည့်နေရင် `false`။

Synchronous batch write ဖြစ်ပါတယ်။

## `stream/iter` module အကြောင်း (The `stream/iter` module)

Function အားလုံးကို named exports အနေနဲ့ရော — `Stream` namespace object ရဲ့ properties တွေ အနေနဲ့ပါ ရရှိနိုင်ပါတယ်:

```mjs
// Named exports
import { from, pull, bytes, Stream } from 'node:stream/iter';

// Namespace access
Stream.from('hello');
```

```cjs
// Named exports
const { from, pull, bytes, Stream } = require('node:stream/iter');

// Namespace access
Stream.from('hello');
```

Module specifier ပေါ်မှာ `node:` prefix ထည့်တာ မထည့်တာက optional ပါ။

## Source များ (Sources)

### `from(input)`

* `input` {string|ArrayBuffer|ArrayBufferView|Iterable|AsyncIterable|Object} — `null` (သို့) `undefined` ဖြစ်လို့ မရပါ။
* Returns: {AsyncIterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေနဲ့ fulfill ဖြစ်တဲ့ async iterable။

ပေးထားတဲ့ input ကနေ async byte stream တစ်ခုကို ဖန်တီးပါတယ်။ String တွေကို UTF-8 နဲ့ encode လုပ်ပါတယ်။ `ArrayBuffer` နဲ့ `ArrayBufferView` တန်ဖိုးတွေကို `Uint8Array` အနေနဲ့ ထုပ်ပိုး (wrap) ပါတယ်။ `input` ထဲက arrays တွေနဲ့ iterables တွေကို ထပ်ခါထပ်ခါ (recursively) flatten လုပ်ပြီး ပုံမှန် (normalize) လုပ်ပါတယ်။

`Symbol.for('Stream.toAsyncStreamable')` (သို့) `Symbol.for('Stream.toStreamable')` တွေကို implement လုပ်ထားတဲ့ objects တွေကို အဲဒီ protocols တွေကနေတစ်ဆင့် ပြောင်းလဲပေးပါတယ်။ `toAsyncStreamable` protocol က `toStreamable` ထက် ဦးစားပေးပြီး — `toStreamable` ကတော့ iteration protocols တွေ (`Symbol.asyncIterator`, `Symbol.iterator`) ထက် ဦးစားပေးပါတယ်။

```mjs
import { Buffer } from 'node:buffer';
import { from, text } from 'node:stream/iter';

console.log(await text(from('hello')));       // 'hello'
console.log(await text(from(Buffer.from('hello')))); // 'hello'
```

```cjs
const { Buffer } = require('node:buffer');
const { from, text } = require('node:stream/iter');

async function run() {
  console.log(await text(from('hello')));       // 'hello'
  console.log(await text(from(Buffer.from('hello')))); // 'hello'
}

run().catch(console.error);
```

### `fromSync(input)`

* `input` {string|ArrayBuffer|ArrayBufferView|Iterable|Object} — `null` (သို့) `undefined` ဖြစ်လို့ မရပါ။
* Returns: {Iterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေကို ပြန်ပေးတဲ့ sync iterable။

[`from()`][] ရဲ့ synchronous မူကွဲ ဖြစ်ပါတယ်။ Sync iterable တစ်ခုကို ပြန်ပေးပါတယ်။ Async iterables (သို့) promises တွေကို လက်ခံလို့ မရပါဘူး။ `Symbol.for('Stream.toStreamable')` ကို implement လုပ်ထားတဲ့ objects တွေကို အဲဒီ protocol ကနေတစ်ဆင့် ပြောင်းလဲပေးပါတယ် (`Symbol.iterator` ထက် ဦးစားပေးပါတယ်)။ `toAsyncStreamable` protocol ကိုတော့ လုံးဝ လျစ်လျူရှုပါတယ်။

```mjs
import { fromSync, textSync } from 'node:stream/iter';

console.log(textSync(fromSync('hello'))); // 'hello'
```

```cjs
const { fromSync, textSync } = require('node:stream/iter');

console.log(textSync(fromSync('hello'))); // 'hello'
```

## Pipeline များ (Pipelines)

### `pipeTo(source[, ...transforms], writer[, options])`

* `source` {AsyncIterable|Iterable} — data source။
* `...transforms` {Function|Object} — သုံးစွဲရမယ့် transform သုည (သို့) ထို့ထက်ပို။
* `writer` {Object} — `write(chunk)` method ရှိတဲ့ destination။
* `options` {Object}
  * `signal` {AbortSignal} — pipeline ကို abort လုပ်ခြင်း။
  * `preventClose` {boolean} — `true` ဆိုရင် source ပြီးဆုံးတဲ့အခါ `writer.end()` ကို မခေါ်ပါဘူး။ **Default:** `false`။
  * `preventFail` {boolean} — `true` ဆိုရင် error ဖြစ်တဲ့အခါ `writer.fail()` ကို မခေါ်ပါဘူး။ **Default:** `false`။
* Returns: {Promise} — ရေးသားပြီးသား bytes စုစုပေါင်း အရေအတွက်နဲ့ fulfill ဖြစ်ပါတယ်။

Source တစ်ခုကို transforms တွေကနေတစ်ဆင့် writer ထဲကို ပို့ပေး (pipe) ပါတယ်။ Writer မှာ `writev(chunks)` method ရှိရင် — batch တစ်ခုလုံးကို call တစ်ခုတည်းနဲ့ ပေးပို့ပါတယ် (scatter/gather I/O ကို လုပ်နိုင်စေပါတယ်)။

Writer က optional `*Sync` methods တွေ (`writeSync`, `writevSync`, `endSync`) ကို implement လုပ်ထားရင် — `pipeTo()` က synchronous methods တွေကို fast path (မြန်ဆန်တဲ့ လမ်းကြောင်း) အနေနဲ့ အရင် သုံးဖို့ ကြိုးစားပြီး — sync methods တွေက မပြီးနိုင်ဘူးလို့ ပြတဲ့အခါမှသာ (ဥပမာ — backpressure သို့မဟုတ် နောက် tick စောင့်နေရတာ) async versions တွေဆီ ပြန်ကျပါတယ်။ `fail()` ကိုတော့ အမြဲတမ်း synchronously ခေါ်ပါတယ်။

```mjs
import { from, pipeTo } from 'node:stream/iter';
import { compressGzip } from 'node:zlib/iter';
import { open } from 'node:fs/promises';

const fh = await open('output.gz', 'w');
const totalBytes = await pipeTo(
  from('Hello, world!'),
  compressGzip(),
  fh.writer({ autoClose: true }),
);
```

```cjs
const { from, pipeTo } = require('node:stream/iter');
const { compressGzip } = require('node:zlib/iter');
const { open } = require('node:fs/promises');

async function run() {
  const fh = await open('output.gz', 'w');
  const totalBytes = await pipeTo(
    from('Hello, world!'),
    compressGzip(),
    fh.writer({ autoClose: true }),
  );
}

run().catch(console.error);
```

### `pipeToSync(source[, ...transforms], writer[, options])`

* `source` {Iterable} — sync data source။
* `...transforms` {Function|Object} — sync transforms သုည (သို့) ထို့ထက်ပို။
* `writer` {Object} — `write(chunk)` method ရှိတဲ့ destination။
* `options` {Object}
  * `preventClose` {boolean} **Default:** `false`။
  * `preventFail` {boolean} **Default:** `false`။
* Returns: {number} — ရေးသားပြီးသား bytes စုစုပေါင်း။

[`pipeTo()`][] ရဲ့ synchronous မူကွဲ ဖြစ်ပါတယ်။ `source`, transforms အားလုံး, နဲ့ `writer` တွေက synchronous ဖြစ်ရပါမယ်။ Async iterables (သို့) promises တွေကို လက်ခံလို့ မရပါဘူး။

ဒါ အလုပ်လုပ်ဖို့ `writer` မှာ `*Sync` methods တွေ (`writeSync`, `writevSync`, `endSync`) နဲ့ `fail()` ပါ ရှိရပါမယ်။

### `pull(source[, ...transforms][, options])`

* `source` {AsyncIterable|Iterable} — data source။
* `...transforms` {Function|Object} — သုံးစွဲရမယ့် transform သုည (သို့) ထို့ထက်ပို။
* `options` {Object}
  * `signal` {AbortSignal} — pipeline ကို abort လုပ်ခြင်း။
* Returns: {AsyncIterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေနဲ့ fulfill ဖြစ်တဲ့ async iterable။

Lazy async pipeline တစ်ခုကို ဖန်တီးပါတယ်။ ပြန်ပေးလိုက်တဲ့ iterable ကို စားသုံးတဲ့အထိ `source` ကနေ data ကို ဖတ်မှာ မဟုတ်ပါဘူး။ Transform တွေကို အစီအစဉ်အတိုင်း သုံးစွဲပါတယ်။

```mjs
import { from, pull, text } from 'node:stream/iter';

const asciiUpper = (chunks) => {
  if (chunks === null) return null;
  return chunks.map((c) => {
    for (let i = 0; i < c.length; i++) {
      c[i] -= (c[i] >= 97 && c[i] <= 122) * 32;
    }
    return c;
  });
};

const result = pull(from('hello'), asciiUpper);
console.log(await text(result)); // 'HELLO'
```

```cjs
const { from, pull, text } = require('node:stream/iter');

const asciiUpper = (chunks) => {
  if (chunks === null) return null;
  return chunks.map((c) => {
    for (let i = 0; i < c.length; i++) {
      c[i] -= (c[i] >= 97 && c[i] <= 122) * 32;
    }
    return c;
  });
};

async function run() {
  const result = pull(from('hello'), asciiUpper);
  console.log(await text(result)); // 'HELLO'
}

run().catch(console.error);
```

`AbortSignal` တစ်ခုကို သုံးခြင်း:

```mjs
import { pull } from 'node:stream/iter';

const ac = new AbortController();
const result = pull(source, transform, { signal: ac.signal });
ac.abort(); // Pipeline throws AbortError on next iteration
```

```cjs
const { pull } = require('node:stream/iter');

const ac = new AbortController();
const result = pull(source, transform, { signal: ac.signal });
ac.abort(); // Pipeline throws AbortError on next iteration
```

### `pullSync(source[, ...transforms])`

* `source` {Iterable} — sync data source။
* `...transforms` {Function|Object} — sync transforms သုည (သို့) ထို့ထက်ပို။
* Returns: {Iterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေကို ပြန်ပေးတဲ့ sync iterable။

[`pull()`][] ရဲ့ synchronous မူကွဲ ဖြစ်ပါတယ်။ Transform အားလုံးက synchronous ဖြစ်ရပါမယ်။

## Push stream များ (Push streams)

### `push([...transforms][, options])`

* `...transforms` {Function|Object} — readable ဘက်ခြမ်းမှာ သုံးစွဲမယ့် optional transforms များ။
* `options` {Object}
  * `budget` {number} — backpressure သက်ရောက်ခင် buffer လုပ်ထားနိုင်တဲ့ bytes အများဆုံး ပမာဏ။ 16384 ထက် မနည်းရပါ။ **Default:** `16384`။
  * `backpressure` {string} — backpressure policy: `'strict'`, `'unbounded'`, `'drop-oldest'`, (သို့) `'drop-newest'`။ **Default:** `'strict'`။
  * `signal` {AbortSignal} — stream ကို abort လုပ်ခြင်း။
* Returns: {Object}
  * `writer` {Writable} — writer ဘက်ခြမ်း။
  * `readable` {AsyncIterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေနဲ့ fulfill ဖြစ်တဲ့ async iterable။

Backpressure ပါတဲ့ push stream တစ်ခုကို ဖန်တီးပါတယ်။ Writer က data တွေကို ထည့်သွင်းပြီး — readable ဘက်ခြမ်းကို async iterable အနေနဲ့ စားသုံးပါတယ်။

```mjs
import { push, text } from 'node:stream/iter';

const { writer, readable } = push();

// Producer and consumer must run concurrently. With strict backpressure
// (the default), awaited writes block until the consumer reads.
const producing = (async () => {
  await writer.write('hello');
  await writer.write(' world');
  await writer.end();
})();

console.log(await text(readable)); // 'hello world'
await producing;
```

```cjs
const { push, text } = require('node:stream/iter');

async function run() {
  const { writer, readable } = push();

  // Producer and consumer must run concurrently. With strict backpressure
  // (the default), awaited writes block until the consumer reads.
  const producing = (async () => {
    await writer.write('hello');
    await writer.write(' world');
    await writer.end();
  })();

  console.log(await text(readable)); // 'hello world'
  await producing;
}

run().catch(console.error);
```

`push()` က ပြန်ပေးတဲ့ writer က \[Writer interface]\[] နဲ့ ကိုက်ညီပါတယ်။

## Duplex channel များ (Duplex channels)

### `duplex([options])`

* `options` {Object}
  * `budget` {number} — လမ်းကြောင်း နှစ်ခုလုံးအတွက် buffer အရွယ်အစား (bytes)။ **Default:** `16384`။
  * `backpressure` {string} — လမ်းကြောင်း နှစ်ခုလုံးအတွက် policy။ **Default:** `'strict'`။
  * `signal` {AbortSignal} — channel နှစ်ခုလုံးအတွက် cancellation signal။
  * `a` {Object} — A-to-B လမ်းကြောင်းအတွက် သီးသန့် options များ။ Shared options တွေကို override လုပ်ပါတယ်။
    * `budget` {number}
    * `backpressure` {string}
  * `b` {Object} — B-to-A လမ်းကြောင်းအတွက် သီးသန့် options များ။ Shared options တွေကို override လုပ်ပါတယ်။
    * `budget` {number}
    * `backpressure` {string}
* Returns: {Array} — duplex channels တစ်စုံ `[channelA, channelB]`။

လမ်းကြောင်း နှစ်ခုကြားမှာ နှစ်ဖက် ဆက်သွယ်မှုအတွက် ချိတ်ဆက်ထားတဲ့ duplex channels တစ်စုံကို ဖန်တီးပါတယ် — `socketpair()` နဲ့ ဆင်တူပါတယ်။ Channel တစ်ခုရဲ့ writer ထဲ ရေးလိုက်တဲ့ data က တစ်ဖက် channel ရဲ့ readable ထဲမှာ ပေါ်လာပါတယ်။

Channel တစ်ခုချင်းစီမှာ ပါဝင်တာတွေကတော့:

* `writer` — peer ဆီ data ပို့ဖို့ \[Writer interface]\[] object တစ်ခု။
* `readable` — peer ဆီကနေ data ဖတ်ဖို့ {AsyncIterable} တစ်ခု။
* `close()` — ဒီ channel အစွန်းကို ပိတ်ခြင်း (idempotent — ထပ်ခါထပ်ခါ ခေါ်လည်း ရသည်)။
* `[Symbol.asyncDispose]()` — `await using` အတွက် async dispose support။

```mjs
import { duplex, text } from 'node:stream/iter';

const [client, server] = duplex();

// Server echoes back
const serving = (async () => {
  for await (const chunks of server.readable) {
    await server.writer.writev(chunks);
  }
})();

await client.writer.write('hello');
await client.writer.end();

console.log(await text(server.readable)); // handled by echo
await serving;
```

```cjs
const { duplex, text } = require('node:stream/iter');

async function run() {
  const [client, server] = duplex();

  // Server echoes back
  const serving = (async () => {
    for await (const chunks of server.readable) {
      await server.writer.writev(chunks);
    }
  })();

  await client.writer.write('hello');
  await client.writer.end();

  console.log(await text(server.readable)); // handled by echo
  await serving;
}

run().catch(console.error);
```

## Consumer လုပ်ဆောင်ချက်များ (Consumers)

### `array(source[, options])`

* `source` {AsyncIterable|Iterable} — chunk တွေက {Uint8Array\[]} ဖြစ်ရမယ်။
* `options` {Object}
  * `signal` {AbortSignal}
  * `limit` {number} — စားသုံးမယ့် bytes အများဆုံး ပမာဏ။ စုဆောင်းလိုက်တဲ့ bytes စုစုပေါင်း limit ထက် ကျော်သွားရင် `ERR_OUT_OF_RANGE` error တစ်ခု throw လုပ်ပါတယ်။
* Returns: {Promise} — `Uint8Array` objects တွေရဲ့ array တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

Chunk အားလုံးကို `Uint8Array` တန်ဖိုးတွေရဲ့ array အဖြစ် စုဆောင်းပါတယ် (concatenate — ဆက်စပ်ပေါင်းစည်း — မလုပ်ပါဘူး)။

### `arrayBuffer(source[, options])`

* `source` {AsyncIterable|Iterable} — chunk တွေက {Uint8Array\[]} ဖြစ်ရမယ်။
* `options` {Object}
  * `signal` {AbortSignal}
  * `limit` {number} — စားသုံးမယ့် bytes အများဆုံး ပမာဏ။ စုဆောင်းလိုက်တဲ့ bytes စုစုပေါင်း limit ထက် ကျော်သွားရင် `ERR_OUT_OF_RANGE` error တစ်ခု throw လုပ်ပါတယ်။
* Returns: {Promise} — `ArrayBuffer` object တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

Bytes အားလုံးကို `ArrayBuffer` တစ်ခုထဲ စုဆောင်းပါတယ်။

### `arrayBufferSync(source[, options])`

* `source` {Iterable} — chunk တွေက {Uint8Array\[]} ဖြစ်ရမယ်။
* `options` {Object}
  * `limit` {number} — စားသုံးမယ့် bytes အများဆုံး ပမာဏ။ စုဆောင်းလိုက်တဲ့ bytes စုစုပေါင်း limit ထက် ကျော်သွားရင် `ERR_OUT_OF_RANGE` error တစ်ခု throw လုပ်ပါတယ်။
* Returns: {ArrayBuffer}

[`arrayBuffer()`][] ရဲ့ synchronous မူကွဲ ဖြစ်ပါတယ်။

### `arraySync(source[, options])`

* `source` {Iterable} — chunk တွေက {Uint8Array\[]} ဖြစ်ရမယ်။
* `options` {Object}
  * `limit` {number} — စားသုံးမယ့် bytes အများဆုံး ပမာဏ။ စုဆောင်းလိုက်တဲ့ bytes စုစုပေါင်း limit ထက် ကျော်သွားရင် `ERR_OUT_OF_RANGE` error တစ်ခု throw လုပ်ပါတယ်။
* Returns: {Uint8Array\[]}

[`array()`][] ရဲ့ synchronous မူကွဲ ဖြစ်ပါတယ်။

### `bytes(source[, options])`

* `source` {AsyncIterable|Iterable} — chunk တွေက {Uint8Array\[]} ဖြစ်ရမယ်။
* `options` {Object}
  * `signal` {AbortSignal}
  * `limit` {number} — စားသုံးမယ့် bytes အများဆုံး ပမာဏ။ စုဆောင်းလိုက်တဲ့ bytes စုစုပေါင်း limit ထက် ကျော်သွားရင် `ERR_OUT_OF_RANGE` error တစ်ခု throw လုပ်ပါတယ်။
* Returns: {Promise} — `Uint8Array` object တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

Stream တစ်ခုကနေ bytes အားလုံးကို `Uint8Array` တစ်ခုတည်းထဲ စုဆောင်းပါတယ်။

```mjs
import { from, bytes } from 'node:stream/iter';

const data = await bytes(from('hello'));
console.log(data); // Uint8Array(5) [ 104, 101, 108, 108, 111 ]
```

```cjs
const { from, bytes } = require('node:stream/iter');

async function run() {
  const data = await bytes(from('hello'));
  console.log(data); // Uint8Array(5) [ 104, 101, 108, 108, 111 ]
}

run().catch(console.error);
```

### `bytesSync(source[, options])`

* `source` {Iterable} — chunk တွေက {Uint8Array\[]} ဖြစ်ရမယ်။
* `options` {Object}
  * `limit` {number} — စားသုံးမယ့် bytes အများဆုံး ပမာဏ။ စုဆောင်းလိုက်တဲ့ bytes စုစုပေါင်း limit ထက် ကျော်သွားရင် `ERR_OUT_OF_RANGE` error တစ်ခု throw လုပ်ပါတယ်။
* Returns: {Uint8Array}

[`bytes()`][] ရဲ့ synchronous မူကွဲ ဖြစ်ပါတယ်။

### `text(source[, options])`

* `source` {AsyncIterable|Iterable} — chunk တွေက {Uint8Array\[]} ဖြစ်ရမယ်။
* `options` {Object}
  * `encoding` {string} — text encoding။ **Default:** `'utf-8'`။
  * `signal` {AbortSignal}
  * `limit` {number} — စားသုံးမယ့် bytes အများဆုံး ပမာဏ။ စုဆောင်းလိုက်တဲ့ bytes စုစုပေါင်း limit ထက် ကျော်သွားရင် `ERR_OUT_OF_RANGE` error တစ်ခု throw လုပ်ပါတယ်။
* Returns: {Promise} — `string` တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

Bytes အားလုံးကို စုဆောင်းပြီး text အဖြစ် decode လုပ်ပါတယ်။

```mjs
import { from, text } from 'node:stream/iter';

console.log(await text(from('hello'))); // 'hello'
```

```cjs
const { from, text } = require('node:stream/iter');

async function run() {
  console.log(await text(from('hello'))); // 'hello'
}

run().catch(console.error);
```

### `textSync(source[, options])`

* `source` {Iterable} — chunk တွေက {Uint8Array\[]} ဖြစ်ရမယ်။
* `options` {Object}
  * `encoding` {string} **Default:** `'utf-8'`။
  * `limit` {number} — စားသုံးမယ့် bytes အများဆုံး ပမာဏ။ စုဆောင်းလိုက်တဲ့ bytes စုစုပေါင်း limit ထက် ကျော်သွားရင် `ERR_OUT_OF_RANGE` error တစ်ခု throw လုပ်ပါတယ်။
* Returns: {string}

[`text()`][] ရဲ့ synchronous မူကွဲ ဖြစ်ပါတယ်။

## Utility လုပ်ဆောင်ချက်များ (Utilities)

### `ondrain(drainable)`

* `drainable` {Object} — drainable protocol ကို implement လုပ်ထားတဲ့ object။
* Returns: {Promise|null}

Drainable writer တစ်ခုရဲ့ backpressure ရှင်းသွားတာကို စောင့်ပါတယ်။ Object က drainable protocol ကို implement မလုပ်ထားရင် `null` ကို ပြန်ပေးပြီး — writer က data ထပ်လက်ခံနိုင်ပြီဆိုတဲ့အခါ `true` နဲ့ fulfill ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { push, ondrain, text } from 'node:stream/iter';

const { writer, readable } = push({ budget: 16384 });
const chunk = new Uint8Array(8192);  // 8 KB
writer.writeSync(chunk);
writer.writeSync(chunk);  // 16 KB total -- buffer full

// Start consuming so the buffer can actually drain
const consuming = text(readable);

// Buffer is full -- wait for drain
const canWrite = await ondrain(writer);
if (canWrite) {
  await writer.write('c');
}
await writer.end();
await consuming;
```

```cjs
const { push, ondrain, text } = require('node:stream/iter');

async function run() {
  const { writer, readable } = push({ budget: 16384 });
  const chunk = new Uint8Array(8192);  // 8 KB
  writer.writeSync(chunk);
  writer.writeSync(chunk);  // 16 KB total -- buffer full

  // Start consuming so the buffer can actually drain
  const consuming = text(readable);

  // Buffer is full -- wait for drain
  const canWrite = await ondrain(writer);
  if (canWrite) {
    await writer.write('c');
  }
  await writer.end();
  await consuming;
}

run().catch(console.error);
```

### `merge(...sources[, options])`

* `...sources` {AsyncIterable|Iterable} — chunk တွေက {Uint8Array\[]} ဖြစ်ရမယ်။
* `options` {Object}
  * `signal` {AbortSignal}
* Returns: {AsyncIterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေနဲ့ fulfill ဖြစ်တဲ့ async iterable။

Async iterables အများအပြားကို temporal order (အချိန် အစီအစဉ်) အတိုင်း batches တွေ ထုတ်ပေးခြင်းဖြင့် ပေါင်းစည်း (merge) ပါတယ် — ဘယ် source က အရင်ဆုံး data ထုတ်လဲအပေါ် မူတည်ပါတယ်။ Source အားလုံးကို တစ်ပြိုင်နက် (concurrently) စားသုံးပါတယ်။

```mjs
import { from, merge, text } from 'node:stream/iter';

const merged = merge(from('hello '), from('world'));
console.log(await text(merged)); // Order depends on timing
```

```cjs
const { from, merge, text } = require('node:stream/iter');

async function run() {
  const merged = merge(from('hello '), from('world'));
  console.log(await text(merged)); // Order depends on timing
}

run().catch(console.error);
```

### `tap(callback)`

* `callback` {Function} — `(chunks) => void` — batch တစ်ခုချင်းစီနဲ့အတူ ခေါ်ယူပါတယ်။
* Returns: {Function} — stateless transform တစ်ခု။

Batches တွေကို ပြုပြင်မပြောင်းလဲဘဲ စောင့်ကြည့်ပေးတဲ့ pass-through transform တစ်ခုကို ဖန်တီးပါတယ်။ Logging, metrics (တိုင်းတာချက်များ), (သို့) debugging အတွက် အသုံးဝင်ပါတယ်။

```mjs
import { from, pull, text, tap } from 'node:stream/iter';

const result = pull(
  from('hello'),
  tap((chunks) => console.log('Batch size:', chunks.length)),
);
console.log(await text(result));
```

```cjs
const { from, pull, text, tap } = require('node:stream/iter');

async function run() {
  const result = pull(
    from('hello'),
    tap((chunks) => console.log('Batch size:', chunks.length)),
  );
  console.log(await text(result));
}

run().catch(console.error);
```

`tap()` က tapping callback က chunks တွေကို in-place ပြုပြင်တာကို တားဆီး မပေးပါဘူး (ရည်ရွယ်ချက်ရှိရှိ) — ဒါပေမယ့် ပြန်ပေးတဲ့ တန်ဖိုးတွေကိုတော့ လျစ်လျူရှုပါတယ်။

### `tapSync(callback)`

* `callback` {Function}
* Returns: {Function}

[`tap()`][] ရဲ့ synchronous မူကွဲ ဖြစ်ပါတယ်။

## Consumer အများအပြား ပုံစံ (Multi-consumer)

### `broadcast([options])`

* `options` {Object}
  * `budget` {number} — buffer အရွယ်အစား (bytes)။ 16384 ထက် မနည်းရပါ။ **Default:** `65536`။
  * `backpressure` {string} — `'strict'`, `'unbounded'`, `'drop-oldest'`, (သို့) `'drop-newest'`။ **Default:** `'strict'`။
  * `signal` {AbortSignal}
* Returns: {Object}
  * `writer` {Writable}
  * `broadcast` {BroadcastChannel}

Push-model ဖြစ်တဲ့ consumer အများအပြား အတွက် broadcast channel တစ်ခုကို ဖန်တီးပါတယ်။ Writer တစ်ခုတည်းက consumers အများအပြားဆီ data တွေကို ပို့ပေးပါတယ်။ Consumer တစ်ခုချင်းစီမှာ shared buffer တစ်ခုထဲကို ကိုယ်ပိုင် သီးခြား cursor (ညွှန်းနေရာ) တစ်ခုစီ ရှိပါတယ်။

```mjs
import { broadcast, text } from 'node:stream/iter';

const { writer, broadcast: bc } = broadcast();

// Create consumers before writing
const c1 = bc.push();  // Consumer 1
const c2 = bc.push();  // Consumer 2

// Producer and consumers must run concurrently. Awaited writes
// block when the buffer fills until consumers read.
const producing = (async () => {
  await writer.write('hello');
  await writer.end();
})();

const [r1, r2] = await Promise.all([text(c1), text(c2)]);
console.log(r1); // 'hello'
console.log(r2); // 'hello'
await producing;
```

```cjs
const { broadcast, text } = require('node:stream/iter');

async function run() {
  const { writer, broadcast: bc } = broadcast();

  // Create consumers before writing
  const c1 = bc.push();  // Consumer 1
  const c2 = bc.push();  // Consumer 2

  // Producer and consumers must run concurrently. Awaited writes
  // block when the buffer fills until consumers read.
  const producing = (async () => {
    await writer.write('hello');
    await writer.end();
  })();

  const [r1, r2] = await Promise.all([text(c1), text(c2)]);
  console.log(r1); // 'hello'
  console.log(r2); // 'hello'
  await producing;
}

run().catch(console.error);
```

#### `broadcast.cancel([reason])`

* `reason` {Error}

Broadcast ကို cancel လုပ်ပါတယ်။ Consumer အားလုံး error တစ်ခုကို လက်ခံရရှိပါတယ်။

#### `broadcast.consumerCount`

* {number}

Active ဖြစ်နေတဲ့ consumers အရေအတွက်။

#### `broadcast.push([...transforms][, options])`

* `...transforms` {Function|Object}
* `options` {Object}
  * `signal` {AbortSignal}
* Returns: {AsyncIterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေနဲ့ fulfill ဖြစ်တဲ့ async iterable။

Consumer အသစ် တစ်ခုကို ဖန်တီးပါတယ်။ Consumer တစ်ခုချင်းစီက subscription (စာရင်းသွင်း) လုပ်တဲ့ အချိန်ကစပြီး broadcast ထဲ ရေးလိုက်တဲ့ data အားလုံးကို လက်ခံရရှိပါတယ်။ Optional transforms တွေကို ဒီ consumer ရဲ့ data မြင်ကွင်းအပေါ်မှာ သုံးစွဲပါတယ်။

#### `broadcast[Symbol.dispose]()`

`broadcast.cancel()` ရဲ့ alias (အစားထိုး နာမည်) ဖြစ်ပါတယ်။

### `Broadcast.from(input[, options])`

* `input` {AsyncIterable|Iterable|BroadcastChannel}
* `options` {Object} — `broadcast()` နဲ့ တူညီပါတယ်။
* Returns: {Object} — `{ writer, broadcast }`

ရှိပြီးသား source တစ်ခုကနေ {BroadcastChannel} တစ်ခုကို ဖန်တီးပါတယ်။ Source ကို အလိုအလျောက် စားသုံးပြီး — subscriber အားလုံးဆီ ပို့ပေးပါတယ်။

### `share(source[, options])`

* `source` {AsyncIterable} — share လုပ်မယ့် source။
* `options` {Object}
  * `budget` {number} — buffer အရွယ်အစား (bytes)။ 16384 ထက် မနည်းရပါ။ **Default:** `65536`။
  * `backpressure` {string} — `'strict'`, `'unbounded'`, `'drop-oldest'`, (သို့) `'drop-newest'`။ **Default:** `'strict'`။
* Returns: {Share}

Pull-model ဖြစ်တဲ့ consumer အများအပြား shared stream တစ်ခုကို ဖန်တီးပါတယ်။ `broadcast()` နဲ့ မတူဘဲ — consumer က pull လုပ်မှသာ source ကို ဖတ်ပါတယ်။ Consumer အများအပြားက buffer တစ်ခုတည်းကို မျှဝေသုံးပါတယ်။

```mjs
import { from, share, text } from 'node:stream/iter';

const shared = share(from('hello'));

const c1 = shared.pull();
const c2 = shared.pull();

// Consume concurrently to avoid deadlock with small buffers.
const [r1, r2] = await Promise.all([text(c1), text(c2)]);
console.log(r1); // 'hello'
console.log(r2); // 'hello'
```

```cjs
const { from, share, text } = require('node:stream/iter');

async function run() {
  const shared = share(from('hello'));

  const c1 = shared.pull();
  const c2 = shared.pull();

  // Consume concurrently to avoid deadlock with small buffers.
  const [r1, r2] = await Promise.all([text(c1), text(c2)]);
  console.log(r1); // 'hello'
  console.log(r2); // 'hello'
}

run().catch(console.error);
```

### Class: `Share`

#### Static method: `Share.from(input[, options])`

* `input` {AsyncIterable|Shareable}
* `options` {Object} — `share()` နဲ့ တူညီပါတယ်။
* Returns: {Share}

ရှိပြီးသား source တစ်ခုကနေ {Share} တစ်ခုကို ဖန်တီးပါတယ်။

#### `share.cancel([reason])`

* `reason` {Error}

Share ကို cancel လုပ်ပါတယ်။ Consumer အားလုံး error တစ်ခုကို လက်ခံရရှိပါတယ်။

#### `share.consumerCount`

* {number}

Active ဖြစ်နေတဲ့ consumers အရေအတွက်။

#### `share.pull([...transforms][, options])`

* `...transforms` {Function|Object}
* `options` {Object}
  * `signal` {AbortSignal}
* Returns: {AsyncIterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေနဲ့ fulfill ဖြစ်တဲ့ async iterable။

Shared source ရဲ့ consumer အသစ် တစ်ခုကို ဖန်တီးပါတယ်။

#### `share[Symbol.dispose]()`

`share.cancel()` ရဲ့ alias ဖြစ်ပါတယ်။

### Interface: `Shareable`

#### `sharable[Symbol.for('Stream.shareProtocol')]`

* {Function} — {Share} တစ်ခုကို ပြန်ပေးတဲ့ function။

### Interface: `SyncShareable`

#### `sharable[Symbol.for('Stream.shareSyncProtocol')]`

* {Function} — {SyncShare} တစ်ခုကို ပြန်ပေးတဲ့ function။

### `shareSync(source[, options])`

* `source` {Iterable} — share လုပ်မယ့် sync source။
* `options` {Object}
  * `budget` {number} — 16384 ထက် မနည်းရပါ။ **Default:** `65536`။
  * `backpressure` {string} **Default:** `'strict'`။
* Returns: {SyncShare}

[`share()`][] ရဲ့ synchronous မူကွဲ ဖြစ်ပါတယ်။

### Class: `SyncShare`

#### Static method: `SyncShare.fromSync(input[, options])`

* `input` {Iterable|SyncShareable}
* `options` {Object}
* Returns: {SyncShare}

#### `share.bufferSize`

* {number}

လက်ရှိ buffer လုပ်ထားတဲ့ chunks အရေအတွက်။

#### `share.cancel([reason])`

* `reason` {Error}

Share ကို cancel လုပ်ပါတယ်။ Consumer အားလုံး error တစ်ခုကို လက်ခံရရှိပါတယ်။

#### `share.consumerCount`

* {number}

Active ဖြစ်နေတဲ့ consumers အရေအတွက်။

#### `share.pull([...transforms][, options])`

* `...transforms` {Function|Object}
* `options` {Object}
  * `signal` {AbortSignal}
* Returns: {Iterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေကို ပြန်ပေးတဲ့ sync iterable။

Shared source ရဲ့ consumer အသစ် တစ်ခုကို ဖန်တီးပါတယ်။

#### `share[Symbol.dispose]()`

`share.cancel()` ရဲ့ alias ဖြစ်ပါတယ်။

## ချုံ့ခြင်းနှင့် ဖြန့်ချခြင်း transform များ (Compression and decompression transforms)

`pull()`, `pullSync()`, `pipeTo()`, နဲ့ `pipeToSync()` တွေနဲ့ တွဲသုံးဖို့ compression နဲ့ decompression transforms တွေကို [`node:zlib/iter`][] module ကနေတစ်ဆင့် ရရှိနိုင်ပါတယ်။ အသေးစိတ်အတွက် [`node:zlib/iter` documentation][`node:zlib/iter`] ကို ကြည့်ပါ။

## Classic stream များနှင့် အပြန်အလှန် သုံးခြင်း (Classic stream interop)

ဒီ utility functions တွေက classic [`stream.Readable`][]/[`stream.Writable`][] streams တွေနဲ့ `stream/iter` API ကြားမှာ တံတားထိုးပေးပါတယ်။

`fromReadable()` ရော `fromWritable()` ပါ duck-typed objects တွေကို လက်ခံပါတယ် — input က `stream.Readable` (သို့) `stream.Writable` ကို တိုက်ရိုက် extend လုပ်ထားဖို့ မလိုပါဘူး။ အနည်းဆုံး လိုအပ်ချက် (contract) တွေကို function တစ်ခုချင်းစီအောက်မှာ ဖော်ပြထားပါတယ်။

### `fromReadable(readable)`

> Stability: 1 - Experimental

* `readable` {stream.Readable|Object} — classic Readable stream (သို့) `read()`, `on()`, `off()` methods တွေ ပါတဲ့ object မှန်သမျှ။
* Returns: {AsyncIterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေနဲ့ fulfill ဖြစ်တဲ့ async iterable။

Classic Readable stream တစ်ခု (သို့) duck-typed ညီမျှချက် တစ်ခုကို — [`from()`][], [`pull()`][], [`text()`][] စတာတွေဆီ ပေးပို့လို့ရတဲ့ stream/iter async iterable source အဖြစ် ပြောင်းလဲပေးပါတယ်။

Object က [`toAsyncStreamable`][] protocol ကို implement လုပ်ထားရင် (`stream.Readable` က လုပ်ထားပါတယ်) — အဲဒီ protocol ကို သုံးပါတယ်။ မဟုတ်ရင် function က `read()`, `on()`, `off()` (EventEmitter) တွေပေါ်မှာ duck-type စစ်ဆေးပြီး — stream ကို batched async iterator တစ်ခုနဲ့ ထုပ်ပိုးပါတယ်။

ရလဒ်ကို instance တစ်ခုစီအလိုက် cache လုပ်ထားပါတယ် — `fromReadable()` ကို stream တစ်ခုတည်းနဲ့ နှစ်ကြိမ် ခေါ်ရင် iterable တစ်ခုတည်းကိုပဲ ပြန်ပေးပါတယ်။

Object-mode (သို့) encoded Readable streams တွေအတွက်တော့ — chunk တွေကို `Uint8Array` အဖြစ် အလိုအလျောက် ပုံမှန် (normalize) လုပ်ပေးပါတယ်။

```mjs
import { Readable } from 'node:stream';
import { fromReadable, text } from 'node:stream/iter';

const readable = new Readable({
  read() { this.push('hello world'); this.push(null); },
});

const result = await text(fromReadable(readable));
console.log(result); // 'hello world'
```

```cjs
const { Readable } = require('node:stream');
const { fromReadable, text } = require('node:stream/iter');

const readable = new Readable({
  read() { this.push('hello world'); this.push(null); },
});

async function run() {
  const result = await text(fromReadable(readable));
  console.log(result); // 'hello world'
}
run();
```

### `fromWritable(writable[, options])`

> Stability: 1 - Experimental

* `writable` {stream.Writable|Object} — classic Writable stream (သို့) `write()` နဲ့ `on()` methods တွေ ပါတဲ့ object မှန်သမျှ။
* `options` {Object}
  * `backpressure` {string} — backpressure policy။ **Default:** `'strict'`။
    * `'strict'` — buffer ပြည့်နေတဲ့အခါ writes တွေကို ငြင်းပယ်ပါတယ်။ Backpressure ကို ဂရုမစိုက်တဲ့ callers တွေကို ဖမ်းမိပါတယ်။
    * `'unbounded'` — buffer ပြည့်နေတဲ့အခါ writes တွေက drain ဖြစ်တာအတွက် စောင့်ပါတယ်။ [`pipeTo()`][] နဲ့ တွဲသုံးဖို့ အကြံပြုထားပါတယ်။
    * `'drop-newest'` — buffer ပြည့်နေတဲ့အခါ writes တွေကို တိတ်တဆိတ် ပစ်ပယ်ပါတယ်။
    * `'drop-oldest'` — **support မလုပ်ပါဘူး**။ `ERR_INVALID_ARG_VALUE` ကို throw လုပ်ပါတယ်။
* Returns: {Object} — stream/iter Writer adapter တစ်ခု။

Classic Writable stream (သို့) duck-typed ညီမျှချက် တစ်ခုကနေ stream/iter Writer adapter တစ်ခုကို ဖန်တီးပေးပါတယ်။ Adapter ကို [`pipeTo()`][] ထဲ destination အနေနဲ့ ပေးပို့လို့ ရပါတယ်။

Classic Writable ပေါ်က write အားလုံးက အခြေခံအားဖြင့် asynchronous ဖြစ်တာမို့ — synchronous Writer methods တွေ (`writeSync`, `writevSync`, `endSync`) က အမြဲတမ်း `false` (သို့) `-1` ကိုပဲ ပြန်ပေးပြီး async path ဆီ လွှဲပေးပါတယ်။ Writer interface ကနေ ပါလာတဲ့ write တစ်ခုချင်းစီရဲ့ `options.signal` parameter ကိုလည်း လျစ်လျူရှုပါတယ်။

ရလဒ်ကို instance နဲ့ backpressure policy အလိုက် cache လုပ်ထားပါတယ် — `fromWritable()` ကို stream တစ်ခုတည်းနဲ့ `backpressure` option တစ်ခုတည်း သုံးပြီး နှစ်ကြိမ် ခေါ်ရင် Writer တစ်ခုတည်းကိုပဲ ပြန်ပေးပါတယ်။

`writableHighWaterMark`, `writableLength` (သို့) အလားတူ properties တွေ မထုတ်ဖော်ထားတဲ့ duck-typed streams တွေအတွက်တော့ — သင့်တော်တဲ့ defaults တွေကို သုံးပါတယ်။ Object-mode writables တွေ (သိရှိနိုင်ရင်) ကိုတော့ ငြင်းပယ်ပါတယ် — Writer interface က bytes အတွက်ပဲ ဖြစ်လို့ပါ။

```mjs
import { Writable } from 'node:stream';
import { from, fromWritable, pipeTo } from 'node:stream/iter';

const writable = new Writable({
  write(chunk, encoding, cb) { console.log(chunk.toString()); cb(); },
});

await pipeTo(from('hello world'),
             fromWritable(writable, { backpressure: 'unbounded' }));
```

```cjs
const { Writable } = require('node:stream');
const { from, fromWritable, pipeTo } = require('node:stream/iter');

async function run() {
  const writable = new Writable({
    write(chunk, encoding, cb) { console.log(chunk.toString()); cb(); },
  });

  await pipeTo(from('hello world'),
               fromWritable(writable, { backpressure: 'unbounded' }));
}
run();
```

### `toReadable(source[, options])`

> Stability: 1 - Experimental

* `source` {AsyncIterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေနဲ့ fulfill ဖြစ်ရမယ် — [`pull()`][] (သို့) [`from()`][] ရဲ့ ပြန်ပေးတန်ဖိုး။
* `options` {Object}
  * `highWaterMark` {number} — backpressure မသက်ရောက်ခင် အတွင်းပိုင်း buffer အရွယ်အစား (bytes)။ **Default:** `65536` (64 KB)။
  * `signal` {AbortSignal} — readable ကို abort လုပ်ဖို့ optional signal။
* Returns: {stream.Readable}

`source` (stream/iter API ရဲ့ native batch format) ကနေ byte-mode [`stream.Readable`][] တစ်ခုကို ဖန်တီးပါတယ်။ Yield လုပ်လိုက်တဲ့ batch တစ်ခုထဲက `Uint8Array` တစ်ခုချင်းစီကို Readable ထဲကို သီးခြား chunk အနေနဲ့ push လုပ်ပါတယ်။

```mjs
import { createWriteStream } from 'node:fs';
import { from, pull, toReadable } from 'node:stream/iter';
import { compressGzip } from 'node:zlib/iter';

const source = pull(from('hello world'), compressGzip());
const readable = toReadable(source);

readable.pipe(createWriteStream('output.gz'));
```

```cjs
const { createWriteStream } = require('node:fs');
const { from, pull, toReadable } = require('node:stream/iter');
const { compressGzip } = require('node:zlib/iter');

const source = pull(from('hello world'), compressGzip());
const readable = toReadable(source);

readable.pipe(createWriteStream('output.gz'));
```

### `toReadableSync(source[, options])`

> Stability: 1 - Experimental

* `source` {Iterable} — chunk တွေက {Uint8Array\[]} တန်ဖိုးတွေ ပြန်ပေးရမယ် — ဥပမာ [`pullSync()`][] (သို့) [`fromSync()`][] ရဲ့ ပြန်ပေးတန်ဖိုး။
* `options` {Object}
  * `highWaterMark` {number} — backpressure မသက်ရောက်ခင် အတွင်းပိုင်း buffer အရွယ်အစား (bytes)။ **Default:** `65536` (64 KB)။
* Returns: {stream.Readable}

`source` ကနေ byte-mode [`stream.Readable`][] တစ်ခုကို ဖန်တီးပါတယ်။ `_read()` method က iterator ကနေ synchronously ဆွဲယူတာမို့ — data တွေကို `readable.read()` ကနေတစ်ဆင့် ချက်ချင်း ရရှိနိုင်ပါတယ်။

```mjs
import { fromSync, toReadableSync } from 'node:stream/iter';

const source = fromSync('hello world');
const readable = toReadableSync(source);

console.log(readable.read().toString()); // 'hello world'
```

```cjs
const { fromSync, toReadableSync } = require('node:stream/iter');

const source = fromSync('hello world');
const readable = toReadableSync(source);

console.log(readable.read().toString()); // 'hello world'
```

### `toWritable(writer)`

> Stability: 1 - Experimental

* `writer` {Object} — stream/iter Writer တစ်ခု။ `write()` method တစ်ခုတည်းကိုပဲ မဖြစ်မနေ လိုအပ်ပြီး — `end()`, `fail()`, `writeSync()`, `writevSync()`, `endSync()`, နဲ့ `writev()` တို့က optional ပါ။
* Returns: {stream.Writable}

Stream/iter Writer တစ်ခုကို ကျောထောက်နောက်ခံပြုထားတဲ့ classic [`stream.Writable`][] တစ်ခုကို ဖန်တီးပါတယ်။

`_write()` / `_writev()` call တစ်ခုချင်းစီက Writer ရဲ့ synchronous method ကို အရင် ကြိုးစားပါတယ် (`writeSync` / `writevSync`) — sync path က `false` ပြန်ရင် async method ဆီ ပြန်ကျပါတယ်။ အလားတူ — `_final()` က `end()` မလုပ်ခင် `endSync()` ကို အရင် ကြိုးစားပါတယ်။ Sync path အောင်မြင်တဲ့အခါ — async resolution contract ကို ထိန်းသိမ်းဖို့ callback ကို `queueMicrotask` ကနေတစ်ဆင့် ရွှေ့ဆိုင်း လုပ်ပေးပါတယ်။

Writable ရဲ့ `highWaterMark` ကို `Number.MAX_SAFE_INTEGER` အဖြစ် သတ်မှတ်ထားတာမို့ — ၎င်းရဲ့ အတွင်းပိုင်း buffering ကို ထိရောက်စွာ disable လုပ်ထားပြီး — နောက်ခံ Writer က backpressure ကို တိုက်ရိုက် စီမံခန့်ခွဲနိုင်ပါတယ်။

```mjs
import { push, toWritable } from 'node:stream/iter';

const { writer, readable } = push();
const writable = toWritable(writer);

writable.write('hello');
writable.end();
```

```cjs
const { push, toWritable } = require('node:stream/iter');

const { writer, readable } = push();
const writable = toWritable(writer);

writable.write('hello');
writable.end();
```

## Protocol သင်္ကေတများ (Protocol symbols)

ဒီ well-known symbols တွေက third-party objects တွေကို `node:stream/iter` ကနေ တိုက်ရိုက် import မလုပ်ဘဲ — streaming protocol ထဲ ပါဝင်လာစေပါတယ်။

### `Stream.broadcastProtocol`

* Value: `Symbol.for('Stream.broadcastProtocol')`

တန်ဖိုးက function တစ်ခု ဖြစ်ရပါမယ်။ `Broadcast.from()` က ခေါ်တဲ့အခါ — `Broadcast.from()` ဆီ ပေးလိုက်တဲ့ options တွေကို လက်ခံရရှိပြီး {BroadcastChannel} interface နဲ့ ကိုက်ညီတဲ့ object တစ်ခုကို ပြန်ပေးရပါမယ်။ Implementation က လုံးဝ စိတ်ကြိုက် (custom) ဖြစ်ပါတယ် — consumers, buffering, backpressure တွေကို သဘောကျတဲ့အတိုင်း စီမံနိုင်ပါတယ်။

```mjs
import { Broadcast, text } from 'node:stream/iter';

// This example defers to the built-in Broadcast, but a custom
// implementation could use any mechanism.
class MessageBus {
  #broadcast;
  #writer;

  constructor() {
    const { writer, broadcast } = Broadcast();
    this.#writer = writer;
    this.#broadcast = broadcast;
  }

  [Symbol.for('Stream.broadcastProtocol')](options) {
    return this.#broadcast;
  }

  send(data) {
    this.#writer.write(new TextEncoder().encode(data));
  }

  close() {
    this.#writer.end();
  }
}

const bus = new MessageBus();
const { broadcast } = Broadcast.from(bus);
const consumer = broadcast.push();
bus.send('hello');
bus.close();
console.log(await text(consumer)); // 'hello'
```

```cjs
const { Broadcast, text } = require('node:stream/iter');

// This example defers to the built-in Broadcast, but a custom
// implementation could use any mechanism.
class MessageBus {
  #broadcast;
  #writer;

  constructor() {
    const { writer, broadcast } = Broadcast();
    this.#writer = writer;
    this.#broadcast = broadcast;
  }

  [Symbol.for('Stream.broadcastProtocol')](options) {
    return this.#broadcast;
  }

  send(data) {
    this.#writer.write(new TextEncoder().encode(data));
  }

  close() {
    this.#writer.end();
  }
}

const bus = new MessageBus();
const { broadcast } = Broadcast.from(bus);
const consumer = broadcast.push();
bus.send('hello');
bus.close();
text(consumer).then(console.log); // 'hello'
```

### `Stream.drainableProtocol`

* Value: `Symbol.for('Stream.drainableProtocol')`

Writer တစ်ခုကို `ondrain()` နဲ့ တွဲသုံးလို့ရအောင် implement လုပ်ပါ။ Method က backpressure မရှိရင် `null` ကို ပြန်ပေးရပြီး — backpressure ရှင်းသွားတဲ့အခါ truthy တန်ဖိုးတစ်ခုနဲ့ fulfill ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးရပါတယ်။

```mjs
import { ondrain } from 'node:stream/iter';

class CustomWriter {
  #queue = [];
  #drain = null;
  #closed = false;
  [Symbol.for('Stream.drainableProtocol')]() {
    if (this.#closed) return null;
    if (this.#queue.length < 3) return Promise.resolve(true);
    this.#drain ??= Promise.withResolvers();
    return this.#drain.promise;
  }
  write(chunk) {
    this.#queue.push(chunk);
  }
  flush() {
    this.#queue.length = 0;
    this.#drain?.resolve(true);
    this.#drain = null;
  }
  close() {
    this.#closed = true;
  }
}
const writer = new CustomWriter();
const ready = ondrain(writer);
console.log(ready); // Promise { true } -- no backpressure
```

```cjs
const { ondrain } = require('node:stream/iter');

class CustomWriter {
  #queue = [];
  #drain = null;
  #closed = false;

  [Symbol.for('Stream.drainableProtocol')]() {
    if (this.#closed) return null;
    if (this.#queue.length < 3) return Promise.resolve(true);
    this.#drain ??= Promise.withResolvers();
    return this.#drain.promise;
  }

  write(chunk) {
    this.#queue.push(chunk);
  }

  flush() {
    this.#queue.length = 0;
    this.#drain?.resolve(true);
    this.#drain = null;
  }

  close() {
    this.#closed = true;
  }
}

const writer = new CustomWriter();
const ready = ondrain(writer);
console.log(ready); // Promise { true } -- no backpressure
```

### `Stream.shareProtocol`

* Value: `Symbol.for('Stream.shareProtocol')`

တန်ဖိုးက function တစ်ခု ဖြစ်ရပါမယ်။ `Share.from()` က ခေါ်တဲ့အခါ — `Share.from()` ဆီ ပေးလိုက်တဲ့ options တွေကို လက်ခံရရှိပြီး {Share} interface နဲ့ ကိုက်ညီတဲ့ object တစ်ခုကို ပြန်ပေးရပါမယ်။ Implementation က လုံးဝ စိတ်ကြိုက် ဖြစ်ပါတယ် — shared source, consumers, buffering, backpressure တွေကို သဘောကျတဲ့အတိုင်း စီမံနိုင်ပါတယ်။

```mjs
import { share, Share, text } from 'node:stream/iter';

// This example defers to the built-in share(), but a custom
// implementation could use any mechanism.
class DataPool {
  #share;

  constructor(source) {
    this.#share = share(source);
  }

  [Symbol.for('Stream.shareProtocol')](options) {
    return this.#share;
  }
}

const pool = new DataPool(
  (async function* () {
    yield 'hello';
  })(),
);

const shared = Share.from(pool);
const consumer = shared.pull();
console.log(await text(consumer)); // 'hello'
```

```cjs
const { share, Share, text } = require('node:stream/iter');

// This example defers to the built-in share(), but a custom
// implementation could use any mechanism.
class DataPool {
  #share;

  constructor(source) {
    this.#share = share(source);
  }

  [Symbol.for('Stream.shareProtocol')](options) {
    return this.#share;
  }
}

const pool = new DataPool(
  (async function* () {
    yield 'hello';
  })(),
);

const shared = Share.from(pool);
const consumer = shared.pull();
text(consumer).then(console.log); // 'hello'
```

### `Stream.shareSyncProtocol`

* Value: `Symbol.for('Stream.shareSyncProtocol')`

တန်ဖိုးက function တစ်ခု ဖြစ်ရပါမယ်။ `SyncShare.fromSync()` က ခေါ်တဲ့အခါ — `SyncShare.fromSync()` ဆီ ပေးလိုက်တဲ့ options တွေကို လက်ခံရရှိပြီး {SyncShare} interface နဲ့ ကိုက်ညီတဲ့ object တစ်ခုကို ပြန်ပေးရပါမယ်။ Implementation က လုံးဝ စိတ်ကြိုက် ဖြစ်ပါတယ် — shared source, consumers, buffering တွေကို သဘောကျတဲ့အတိုင်း စီမံနိုင်ပါတယ်။

```mjs
import { shareSync, SyncShare, textSync } from 'node:stream/iter';

// This example defers to the built-in shareSync(), but a custom
// implementation could use any mechanism.
class SyncDataPool {
  #share;

  constructor(source) {
    this.#share = shareSync(source);
  }

  [Symbol.for('Stream.shareSyncProtocol')](options) {
    return this.#share;
  }
}

const encoder = new TextEncoder();
const pool = new SyncDataPool(
  function* () {
    yield [encoder.encode('hello')];
  }(),
);

const shared = SyncShare.fromSync(pool);
const consumer = shared.pull();
console.log(textSync(consumer)); // 'hello'
```

```cjs
const { shareSync, SyncShare, textSync } = require('node:stream/iter');

// This example defers to the built-in shareSync(), but a custom
// implementation could use any mechanism.
class SyncDataPool {
  #share;

  constructor(source) {
    this.#share = shareSync(source);
  }

  [Symbol.for('Stream.shareSyncProtocol')](options) {
    return this.#share;
  }
}

const encoder = new TextEncoder();
const pool = new SyncDataPool(
  function* () {
    yield [encoder.encode('hello')];
  }(),
);

const shared = SyncShare.fromSync(pool);
const consumer = shared.pull();
console.log(textSync(consumer)); // 'hello'
```

### `Stream.toAsyncStreamable`

* Value: `Symbol.for('Stream.toAsyncStreamable')`

တန်ဖိုးက object တစ်ခုကို streamable တန်ဖိုးအဖြစ် ပြောင်းလဲပေးတဲ့ function တစ်ခု ဖြစ်ရပါမယ်။ Streaming pipeline ထဲ ဘယ်နေရာမှာမဆို ဒီ object ကို တွေ့ရတဲ့အခါ — (`from()` ဆီ source အနေနဲ့ ပေးတာဖြစ်စေ၊ transform တစ်ခုကနေ ပြန်ပေးတဲ့ တန်ဖိုးအနေနဲ့ ဖြစ်စေ) — တကယ့် data ကို ထုတ်လုပ်ဖို့ ဒီ method ကို ခေါ်ပါတယ်။ ပြန်ပေးလို့ရတဲ့ တန်ဖိုးက string, `Uint8Array`, `AsyncIterable`, `Iterable`, (သို့) နောက်ထပ် streamable object တစ်ခုအဖြစ် resolve ဖြစ်နိုင်တဲ့ တန်ဖိုး မှန်သမျှ ဖြစ်နိုင်ပါတယ်။

```mjs
import { from, text } from 'node:stream/iter';

class Greeting {
  #name;

  constructor(name) {
    this.#name = name;
  }

  [Symbol.for('Stream.toAsyncStreamable')]() {
    return `hello ${this.#name}`;
  }
}

const stream = from(new Greeting('world'));
console.log(await text(stream)); // 'hello world'
```

```cjs
const { from, text } = require('node:stream/iter');

class Greeting {
  #name;

  constructor(name) {
    this.#name = name;
  }

  [Symbol.for('Stream.toAsyncStreamable')]() {
    return `hello ${this.#name}`;
  }
}

const stream = from(new Greeting('world'));
text(stream).then(console.log); // 'hello world'
```

### `Stream.toStreamable`

* Value: `Symbol.for('Stream.toStreamable')`

တန်ဖိုးက object တစ်ခုကို streamable တန်ဖိုးအဖြစ် synchronously ပြောင်းလဲပေးတဲ့ function တစ်ခု ဖြစ်ရပါမယ်။ Streaming pipeline ထဲ ဘယ်နေရာမှာမဆို ဒီ object ကို တွေ့ရတဲ့အခါ — (`fromSync()` ဆီ source အနေနဲ့ ပေးတာဖြစ်စေ၊ sync transform တစ်ခုကနေ ပြန်ပေးတဲ့ တန်ဖိုးအနေနဲ့ ဖြစ်စေ) — တကယ့် data ကို ထုတ်လုပ်ဖို့ ဒီ method ကို ခေါ်ပါတယ်။ string, `Uint8Array`, (သို့) `Iterable` ဖြစ်တဲ့ streamable တန်ဖိုးတစ်ခုကို synchronously ပြန်ပေးရပါမယ်။

```mjs
import { fromSync, textSync } from 'node:stream/iter';

class Greeting {
  #name;

  constructor(name) {
    this.#name = name;
  }

  [Symbol.for('Stream.toStreamable')]() {
    return `hello ${this.#name}`;
  }
}

const stream = fromSync(new Greeting('world'));
console.log(textSync(stream)); // 'hello world'
```

```cjs
const { fromSync, textSync } = require('node:stream/iter');

class Greeting {
  #name;

  constructor(name) {
    this.#name = name;
  }

  [Symbol.for('Stream.toStreamable')]() {
    return `hello ${this.#name}`;
  }
}

const stream = fromSync(new Greeting('world'));
console.log(textSync(stream)); // 'hello world'
```

[`--experimental-stream-iter`]: cli.md#--experimental-stream-iter
[`array()`]: #arraysource-options
[`arrayBuffer()`]: #arraybuffersource-options
[`bytes()`]: #bytessource-options
[`from()`]: #frominput
[`fromSync()`]: #fromsyncinput
[`node:zlib/iter`]: zlib.md#iterable-compression
[`ondrain()`]: #ondraindrainable
[`pipeTo()`]: #pipetosource-transforms-writer-options
[`pull()`]: #pullsource-transforms-options
[`pullSync()`]: #pullsyncsource-transforms
[`share()`]: #sharesource-options
[`stream.Readable`]: stream.md#class-streamreadable
[`stream.Writable`]: stream.md#class-streamwritable
[`tap()`]: #tapcallback
[`text()`]: #textsource-options
[`toAsyncStreamable`]: #streamtoasyncstreamable
