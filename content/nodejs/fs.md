---
title: "File system"
description: "node:fs module — file system (ဖိုင်စနစ်) operations — Promises/Callback/Synchronous API သုံးမျိုးလုံး, FileHandle, fs.readFile/writeFile/appendFile, createReadStream/createWriteStream, stats & lstat, watch, constants, fs/promises စသည်"
order: 147
source: "https://nodejs.org/api/fs.html"
status: translated
updated: 2026-09-05
---

> Stability: 2 - Stable

`node:fs` module က standard POSIX functions တွေကို ပုံစံယူထားတဲ့ နည်းလမ်းနဲ့ file system နဲ့ အပြန်အလှန် ဆက်သွယ် လုပ်ဆောင်နိုင်စေပါတယ်။

Promise-based APIs တွေကို သုံးစွဲဖို့အတွက်:

```mjs
import * as fs from 'node:fs/promises';
```

```cjs
const fs = require('node:fs/promises');
```

Callback နဲ့ sync APIs တွေကို သုံးစွဲဖို့အတွက်:

```mjs
import * as fs from 'node:fs';
```

```cjs
const fs = require('node:fs');
```

File system operations တွေ အားလုံးမှာ synchronous, callback နဲ့ promise-based ပုံစံတွေ ရှိပြီး — CommonJS syntax ရော ES6 Modules (ESM) နဲ့ပါ ဝင်ရောက် သုံးစွဲနိုင်ပါတယ်။

## Promise ဥပမာ (Promise example)

Promise-based operations တွေက — asynchronous operation ပြီးဆုံးသွားတဲ့အခါ — fulfill ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```cjs
const { unlink } = require('node:fs/promises');

(async function(path) {
  try {
    await unlink(path);
    console.log(`successfully deleted ${path}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello');
```

## Callback ဥပမာ (Callback example)

Callback ပုံစံက — ၎င်းရဲ့ နောက်ဆုံး argument အနေနဲ့ completion callback function တစ်ခုကို လက်ခံပြီး — operation ကို asynchronously လုပ်ဆောင်ပါတယ်။ Completion callback ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ arguments တွေက method ပေါ်မှာ မူတည်ပြီး — ပထမဆုံး argument ကတော့ exception တစ်ခုအတွက် အမြဲတမ်း သီးသန့် ထားရှိပါတယ်။ Operation က အောင်မြင်စွာ ပြီးဆုံးခဲ့ရင် ပထမဆုံး argument က `null` သို့မဟုတ် `undefined` ဖြစ်ပါတယ်။

```mjs
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

```cjs
const { unlink } = require('node:fs');

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

အမြင့်ဆုံး စွမ်းဆောင်ရည် (execution time ရော memory allocation ရောပါ) လိုအပ်တဲ့အခါမှာ `node:fs` module APIs တွေရဲ့ callback-based versions တွေက promise APIs တွေကို သုံးစွဲတာထက် ပိုနှစ်သက်ဖွယ် ဖြစ်ပါတယ်။

## Synchronous ဥပမာ (Synchronous example)

Synchronous APIs တွေက operation ပြီးဆုံးသည့်အထိ Node.js event loop နဲ့ နောက်ထပ် JavaScript execution တွေကို block (ပိတ်ဆို့) လုပ်ထားပါတယ်။ Exceptions တွေက ချက်ချင်း throw လုပ်ပြီး — `try…catch` ကို သုံးပြီး ကိုင်တွယ်နိုင်သလို — အပေါ်ဆီကို bubble up (ပြန့်ကြဲတက်) သွားအောင်လည်း ထားလို့ရပါတယ်။

```mjs
import { unlinkSync } from 'node:fs';

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```

```cjs
const { unlinkSync } = require('node:fs');

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```

## Promises API (promise အခြေပြု API)

`fs/promises` API က promises တွေကို ပြန်ပေးတဲ့ asynchronous file system methods တွေကို ပံ့ပိုးပေးပါတယ်။

Promise APIs တွေက file system operations တွေကို event loop thread ရဲ့ အပြင်ဘက်မှာ လုပ်ဆောင်ဖို့အတွက် Node.js ရဲ့ အောက်ခြေ threadpool ကို အသုံးပြုပါတယ်။ ဒီ operations တွေက synchronized (တစ်ပြိုင်တည်း ညှိနှိုင်းထား) သော်လည်းကောင်း threadsafe သော်လည်းကောင်း မဟုတ်ပါဘူး။ File တစ်ခုတည်းပေါ်မှာ concurrent modifications (တစ်ပြိုင်နက် ပြုပြင်မှုများ) အများအပြား လုပ်ဆောင်တဲ့အခါ — data corruption (ဒေတာ ပျက်စီးမှု) ဖြစ်ပွားနိုင်တာမို့ — သတိထားရပါမယ်။

### Class: `FileHandle`

{FileHandle} object က numeric file descriptor တစ်ခုအတွက် object wrapper (object ဖြင့် ထုပ်ပိုးထားမှု) တစ်ခုပါ။

{FileHandle} object ရဲ့ instances တွေကို `fsPromises.open()` method က ဖန်တီးပေးပါတယ်။

{FileHandle} objects တွေ အားလုံးက {EventEmitter}s တွေ ဖြစ်ပါတယ်။

{FileHandle} တစ်ခုကို `filehandle.close()` method နဲ့ ပိတ်မထားဘူးဆိုရင် — ၎င်းက file descriptor ကို အလိုအလျောက် ပိတ်ဖို့ ကြိုးစားပြီး — memory leaks တွေ မဖြစ်အောင် ကာကွယ်ပေးဖို့ process warning တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။ ဒီအပြုအမူက ယုံကြည်စိတ်ချရမှု မရှိနိုင်ပြီး file က ပိတ်မခံရပဲ ကျန်နေနိုင်တာမို့ — ဒီအပြုအမူပေါ်ကို အားကိုးမနေပါနဲ့။ ယင်းအစား {FileHandle} တွေကို အမြဲတမ်း တိုက်ရိုက် (explicitly) ပိတ်ပေးပါ။ Node.js က ဒီအပြုအမူကို အနာဂတ်မှာ ပြောင်းလဲနိုင်ပါတယ်။

#### Event: `'close'`

`'close'` event က {FileHandle} ကို ပိတ်လိုက်ပြီး နောက်ထပ် အသုံးမပြုနိုင်တော့တဲ့အခါ emit လုပ်ပါတယ်။

#### `filehandle.appendFile(data[, options])`

* `data` {string|Buffer|TypedArray|DataView|AsyncIterable|Iterable}
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `'utf8'`
  * `signal` {AbortSignal|undefined} လုပ်ဆောင်နေဆဲ writeFile တစ်ခုကို abort လုပ်ခွင့်ပြုပါတယ်။ **Default:** `undefined`
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

[`filehandle.writeFile()`][] ၏ alias တစ်ခုပါ။

File handles တွေပေါ်မှာ လုပ်ဆောင်တဲ့အခါ — mode ကို [`fsPromises.open()`][] နဲ့ သတ်မှတ်ထားတဲ့အတိုင်းကနေ ပြောင်းလဲလို့ မရပါဘူး။ ဒါကြောင့် ဒါက [`filehandle.writeFile()`][] နဲ့ ညီမျှပါတယ်။

#### `filehandle.chmod(mode)`

* `mode` {integer} file mode bit mask ပါ။
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

File ရဲ့ permissions တွေကို ပြုပြင်ပါတယ်။ chmod(2) ကို ကြည့်ပါ။

#### `filehandle.chown(uid, gid)`

* `uid` {integer} File ရဲ့ ပိုင်ရှင်အသစ်ရဲ့ user id ပါ။
* `gid` {integer} File ရဲ့ group အသစ်ရဲ့ group id ပါ။
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

File ရဲ့ ပိုင်ဆိုင်မှု (ownership) ကို ပြောင်းလဲပါတယ်။ chown(2) အတွက် wrapper တစ်ခုပါ။

#### `filehandle.close()`

* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

Handle ပေါ်မှာ လုပ်ဆောင်နေဆဲ (pending) operation တွေ ပြီးဆုံးတာကို စောင့်ပြီးမှ file handle ကို ပိတ်ပါတယ်။

```mjs
import { open } from 'node:fs/promises';

let filehandle;
try {
  filehandle = await open('thefile.txt', 'r');
} finally {
  await filehandle?.close();
}
```

#### `filehandle.createReadStream([options])`

* `options` {Object}
  * `encoding` {string} **Default:** `null`
  * `autoClose` {boolean} **Default:** `true`
  * `emitClose` {boolean} **Default:** `true`
  * `start` {integer}
  * `end` {integer} **Default:** `Infinity`
  * `highWaterMark` {integer} **Default:** `64 * 1024`
  * `signal` {AbortSignal|undefined} **Default:** `undefined`
* Returns: {fs.ReadStream}

`options` ထဲမှာ `start` နဲ့ `end` တန်ဖိုးတွေ ထည့်သွင်းပြီး — file တစ်ခုလုံးအစား — bytes အကွာအဝေး (range) တစ်ခုကို ဖတ်ဖို့ သတ်မှတ်နိုင်ပါတယ်။ `start` ရော `end` ပါ inclusive (အစွန်းနှစ်ဖက် အပါအဝင်) ဖြစ်ပြီး 0 ကနေ စရေတွက်ပါတယ် — ခွင့်ပြုထားတဲ့ တန်ဖိုးတွေက \[0, [`Number.MAX_SAFE_INTEGER`][]] အကွာအဝေး အတွင်းမှာ ရှိပါတယ်။ `start` ကို ချန်လှပ်ထားခဲ့ရင် သို့မဟုတ် `undefined` ဖြစ်နေရင် — `filehandle.createReadStream()` က လက်ရှိ file position ကနေ အစဉ်လိုက် (sequentially) ဖတ်ပါတယ်။ `encoding` ကတော့ {Buffer} က လက်ခံတဲ့ encoding တွေထဲက တစ်ခုခု ဖြစ်နိုင်ပါတယ်။

`FileHandle` က blocking reads (ပိတ်ဆို့ထားသော ဖတ်ခြင်းများ) တွေကိုသာ ပံ့ပိုးတဲ့ character device တစ်ခုကို ညွှန်ပြနေရင် (ဥပမာ — keyboard သို့မဟုတ် sound card) — data ရရှိနိုင်တဲ့အထိ read operations တွေက ပြီးဆုံးမှာ မဟုတ်ပါဘူး။ ဒါက process က ထွက်မသွားနိုင်အောင်နဲ့ stream က သဘာဝအတိုင်း မပိတ်နိုင်အောင် တားဆီးနိုင်ပါတယ်။

Default အနေနဲ့ stream က destroy လုပ်ပြီးနောက်မှာ `'close'` event တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။ ဒီအပြုအမူကို ပြောင်းလဲဖို့ `emitClose` option ကို `false` အဖြစ် သတ်မှတ်ပါ။

```mjs
import { open } from 'node:fs/promises';

const fd = await open('/dev/input/event0');
// Create a stream from some character device.
const stream = fd.createReadStream();
setTimeout(() => {
  stream.close(); // This may not close the stream.
  // Artificially marking end-of-stream, as if the underlying resource had
  // indicated end-of-file by itself, allows the stream to close.
  // This does not cancel pending read operations, and if there is such an
  // operation, the process may still not be able to exit successfully
  // until it finishes.
  stream.push(null);
  stream.read(0);
}, 100);
```

`autoClose` က `false` ဖြစ်နေရင် — error ဖြစ်ခဲ့တာတောင် file descriptor ကို ပိတ်ပေးမှာ မဟုတ်ပါဘူး။ အဲဒါကို ပိတ်ပေးပြီး file descriptor leak (ယိုစိမ့်မှု) မဖြစ်အောင် သေချာစေဖို့ကတော့ application ရဲ့ တာဝန်ပါ။ `autoClose` ကို `true` (default အပြုအမူ) အဖြစ် သတ်မှတ်ထားရင် — `'error'` သို့မဟုတ် `'end'` ဖြစ်တဲ့အခါ file descriptor ကို အလိုအလျောက် ပိတ်ပါလိမ့်မယ်။

Bytes 100 ရှည်တဲ့ file တစ်ခုရဲ့ နောက်ဆုံး bytes 10 ကို ဖတ်တဲ့ ဥပမာ:

```mjs
import { open } from 'node:fs/promises';

const fd = await open('sample.txt');
fd.createReadStream({ start: 90, end: 99 });
```

#### `filehandle.createWriteStream([options])`

* `options` {Object}
  * `encoding` {string} **Default:** `'utf8'`
  * `autoClose` {boolean} **Default:** `true`
  * `emitClose` {boolean} **Default:** `true`
  * `start` {integer}
  * `highWaterMark` {number} **Default:** See
    [`stream.getDefaultHighWaterMark()`][].
  * `flush` {boolean} `true` ဆိုရင် — underlying file descriptor ကို မပိတ်ခင် flush လုပ်ပါတယ်။ **Default:** `false`.
* Returns: {fs.WriteStream}

`options` ထဲမှာ `start` option တစ်ခုလည်း ပါဝင်နိုင်ပြီး — file ရဲ့ အစပိုင်းထက် ကျော်လွန်တဲ့ နေရာတစ်ခုမှာ data တွေ ရေးသားဖို့ ခွင့်ပြုပါတယ် — ခွင့်ပြုထားတဲ့ တန်ဖိုးတွေက \[0, [`Number.MAX_SAFE_INTEGER`][]] အကွာအဝေး အတွင်းမှာ ရှိပါတယ်။ File တစ်ခုကို အစားထိုးတာမဟုတ်ပဲ ပြုပြင်မွမ်းမံတာဆိုရင် — `flags` `open` option ကို default `r` အစား `r+` အဖြစ် သတ်မှတ်ဖို့ လိုအပ်နိုင်ပါတယ်။ `encoding` ကတော့ {Buffer} က လက်ခံတဲ့ encoding တွေထဲက တစ်ခုခု ဖြစ်နိုင်ပါတယ်။

`autoClose` ကို `true` (default အပြုအမူ) အဖြစ် သတ်မှတ်ထားရင် — `'error'` သို့မဟုတ် `'finish'` ဖြစ်တဲ့အခါ file descriptor ကို အလိုအလျောက် ပိတ်ပါလိမ့်မယ်။ `autoClose` က `false` ဖြစ်နေရင် — error ဖြစ်ခဲ့တာတောင် file descriptor ကို ပိတ်ပေးမှာ မဟုတ်ပါဘူး။ အဲဒါကို ပိတ်ပေးပြီး file descriptor leak မဖြစ်အောင် သေချာစေဖို့ကတော့ application ရဲ့ တာဝန်ပါ။

Default အနေနဲ့ stream က destroy လုပ်ပြီးနောက်မှာ `'close'` event တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။ ဒီအပြုအမူကို ပြောင်းလဲဖို့ `emitClose` option ကို `false` အဖြစ် သတ်မှတ်ပါ။

#### `filehandle.datasync()`

* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

File နဲ့ ဆက်စပ်နေတဲ့ လက်ရှိ queue ထဲရောက်နေတဲ့ I/O operations တွေ အားလုံးကို operating system ရဲ့ synchronized I/O completion state ဆီကို တွန်းပို့ပါတယ်။ အသေးစိတ်အတွက် POSIX fdatasync(2) documentation ကို ကြည့်ပါ။

`filehandle.sync` နဲ့ မတူပဲ — ဒီ method က ပြုပြင်ထားတဲ့ (modified) metadata တွေကို flush လုပ်မပေးပါဘူး။

#### `filehandle.fd`

* Type: {number} {FileHandle} object က စီမံခန့်ခွဲထားတဲ့ numeric file descriptor ပါ။

#### `filehandle.pull([...transforms][, options])`

> Stability: 1 - Experimental

* `...transforms` {Function|Object} [`stream/iter pull()`][] ကနေတစ်ဆင့် အသုံးချရန် optional transforms တွေပါ။
* `options` {Object}
  * `signal` {AbortSignal}
  * `autoClose` {boolean} Stream ပြီးဆုံးတဲ့အခါ file handle ကို ပိတ်ပါတယ်။ **Default:** `false`.
  * `start` {number} စတင်ဖတ်ရမယ့် byte offset ပါ။ သတ်မှတ်ထားရင် — reads တွေက explicit positioning (`pread` semantics) ကို သုံးပါတယ်။ **Default:** လက်ရှိ file position။
  * `limit` {number} Iterator ကို အဆုံးသတ်ခင် ဖတ်ရမယ့် bytes အများဆုံး အရေအတွက်ပါ။ `limit` bytes တွေ ပို့ဆောင်ပြီးသွားတာ သို့မဟုတ် EOF ကို ရောက်ရှိသွားတာ — ဘယ်ဟာ အရင်ဖြစ်ဖြစ် — အဲဒီအခါမှာ reads တွေ ရပ်ပါတယ်။ **Default:** EOF အထိ ဖတ်ပါတယ်။
  * `chunkSize` {number} Read operation တစ်ခုစီအတွက် ခွဲဝေပေးတဲ့ buffer ရဲ့ byte အရွယ်အစားပါ။ **Default:** `131072` (128 KB)။
* Returns: {AsyncIterable} ၎င်းရဲ့ chunks တွေက {Uint8Array\[]} တွေနဲ့ fulfill ဖြစ်ပါတယ်။

[`node:stream/iter`][] pull model ကို သုံးပြီး file ရဲ့ contents တွေကို async iterable တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ Reads တွေကို `chunkSize` bytes အရွယ် chunks (default 128 KB) တွေနဲ့ လုပ်ဆောင်ပါတယ်။ Transforms တွေ ပေးထားရင် — ၎င်းတို့ကို [`stream/iter pull()`][] ကနေတစ်ဆင့် အသုံးချပါတယ်။

Iterable ကို စားသုံးနေတုန်း file handle ကို lock လုပ်ထားပြီး — iteration ပြီးဆုံးတဲ့အခါ၊ error တစ်ခု ဖြစ်ပွားတဲ့အခါ သို့မဟုတ် consumer က break လုပ်လိုက်တဲ့အခါ — unlock လုပ်ပါတယ်။

ဒီ function က `--experimental-stream-iter` flag ကို ဖွင့်ထားတဲ့အခါမှသာ ရရှိနိုင်ပါတယ်။

```mjs
import { open } from 'node:fs/promises';
import { text } from 'node:stream/iter';
import { compressGzip } from 'node:zlib/iter';

const fh = await open('input.txt', 'r');

// Read as text
console.log(await text(fh.pull({ autoClose: true })));

// Read 1 KB starting at byte 100
const fh2 = await open('input.txt', 'r');
console.log(await text(fh2.pull({ start: 100, limit: 1024, autoClose: true })));

// Read with compression
const fh3 = await open('input.txt', 'r');
const compressed = fh3.pull(compressGzip(), { autoClose: true });
```

```cjs
const { open } = require('node:fs/promises');
const { text } = require('node:stream/iter');
const { compressGzip } = require('node:zlib/iter');

async function run() {
  const fh = await open('input.txt', 'r');

  // Read as text
  console.log(await text(fh.pull({ autoClose: true })));

  // Read 1 KB starting at byte 100
  const fh2 = await open('input.txt', 'r');
  console.log(await text(fh2.pull({ start: 100, limit: 1024, autoClose: true })));

  // Read with compression
  const fh3 = await open('input.txt', 'r');
  const compressed = fh3.pull(compressGzip(), { autoClose: true });
}

run().catch(console.error);
```

#### `filehandle.pullSync([...transforms][, options])`

> Stability: 1 - Experimental

* `...transforms` {Function|Object} [`stream/iter pullSync()`][] ကနေတစ်ဆင့် အသုံးချရန် optional transforms တွေပါ။
* `options` {Object}
  * `autoClose` {boolean} Stream ပြီးဆုံးတဲ့အခါ file handle ကို ပိတ်ပါတယ်။ **Default:** `false`.
  * `start` {number} စတင်ဖတ်ရမယ့် byte offset ပါ။ သတ်မှတ်ထားရင် — reads တွေက explicit positioning ကို သုံးပါတယ်။ **Default:** လက်ရှိ file position။
  * `limit` {number} Iterator ကို အဆုံးသတ်ခင် ဖတ်ရမယ့် bytes အများဆုံး အရေအတွက်ပါ။ **Default:** EOF အထိ ဖတ်ပါတယ်။
  * `chunkSize` {number} Read operation တစ်ခုစီအတွက် ခွဲဝေပေးတဲ့ buffer ရဲ့ byte အရွယ်အစားပါ။ **Default:** `131072` (128 KB)။
* Returns: {Iterable} ၎င်းရဲ့ chunks တွေက {Uint8Array\[]} တွေကို ပြန်ပေးပါတယ်။

[`filehandle.pull()`][] ၏ synchronous အဖော် (counterpart) ပါ။ Main thread ပေါ်မှာ synchronous I/O ကို သုံးပြီး file ကို ဖတ်တဲ့ sync iterable တစ်ခုကို ပြန်ပေးပါတယ်။ Reads တွေကို `chunkSize` bytes အရွယ် chunks (default 128 KB) တွေနဲ့ လုပ်ဆောင်ပါတယ်။

Iterable ကို စားသုံးနေတုန်း file handle ကို lock လုပ်ထားပါတယ်။ Async `pull()` နဲ့ မတူပဲ — ဒီ method က operations တွေ အားလုံး synchronous ဖြစ်တာမို့ — `AbortSignal` ကို support မလုပ်ပါဘူး။

ဒီ function က `--experimental-stream-iter` flag ကို ဖွင့်ထားတဲ့အခါမှသာ ရရှိနိုင်ပါတယ်။

```mjs
import { open } from 'node:fs/promises';
import { textSync, pipeToSync } from 'node:stream/iter';
import { compressGzipSync, decompressGzipSync } from 'node:zlib/iter';

const fh = await open('input.txt', 'r');

// Read as text (sync)
console.log(textSync(fh.pullSync({ autoClose: true })));

// Sync compress pipeline: file -> gzip -> file
const src = await open('input.txt', 'r');
const dst = await open('output.gz', 'w');
pipeToSync(src.pullSync(compressGzipSync(), { autoClose: true }), dst.writer({ autoClose: true }));
```

```cjs
const { open } = require('node:fs/promises');
const { textSync, pipeToSync } = require('node:stream/iter');
const { compressGzipSync, decompressGzipSync } = require('node:zlib/iter');

async function run() {
  const fh = await open('input.txt', 'r');

  // Read as text (sync)
  console.log(textSync(fh.pullSync({ autoClose: true })));

  // Sync compress pipeline: file -> gzip -> file
  const src = await open('input.txt', 'r');
  const dst = await open('output.gz', 'w');
  pipeToSync(
    src.pullSync(compressGzipSync(), { autoClose: true }),
    dst.writer({ autoClose: true }),
  );
}

run().catch(console.error);
```

#### `filehandle.read(buffer, offset, length, position)`

* `buffer` {Buffer|TypedArray|DataView} ဖတ်လိုက်တဲ့ file data တွေနဲ့ ဖြည့်သွင်းခံရမယ့် buffer တစ်ခုပါ။
* `offset` {integer} Buffer ထဲမှာ စတင်ဖြည့်ရမယ့် နေရာပါ။ **Default:** `0`
* `length` {integer} ဖတ်ရမယ့် bytes အရေအတွက်ပါ။ **Default:** `buffer.byteLength - offset`
* `position` {integer|bigint|null} File ကနေ data ဖတ်တာ စတင်ရမယ့် နေရာပါ။ `null` သို့မဟုတ် `-1` ဆိုရင် — data တွေကို လက်ရှိ file position ကနေ ဖတ်ပြီး position ကို update လုပ်ပါလိမ့်မယ်။ `position` က အနုတ်မဟုတ်တဲ့ (non-negative) integer ဆိုရင် — လက်ရှိ file position က မပြောင်းလဲပဲ ရှိနေပါလိမ့်မယ်။ **Default:** `null`
* Returns: {Promise} အောင်မြင်ပါက properties နှစ်ခုပါတဲ့ object တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်:
  * `bytesRead` {integer} ဖတ်လိုက်တဲ့ bytes အရေအတွက်ပါ
  * `buffer` {Buffer|TypedArray|DataView} ဖြတ်သန်းပေးလိုက်တဲ့ `buffer` argument ကို ရည်ညွှန်းတာပါ။

File ကနေ data တွေကို ဖတ်ပြီး ပေးထားတဲ့ buffer ထဲမှာ သိမ်းဆည်းပါတယ်။

File ကို တစ်ပြိုင်နက် (concurrently) ပြုပြင်မထားဘူးဆိုရင် — ဖတ်လိုက်တဲ့ bytes အရေအတွက် သုည ဖြစ်သွားတဲ့အခါ — end-of-file (EOF) ကို ရောက်ရှိပါတယ်။

#### `filehandle.read([options])`

* `options` {Object}
  * `buffer` {Buffer|TypedArray|DataView} ဖတ်လိုက်တဲ့ file data တွေနဲ့ ဖြည့်သွင်းခံရမယ့် buffer တစ်ခုပါ။ **Default:** `Buffer.alloc(16384)`
  * `offset` {integer} Buffer ထဲမှာ စတင်ဖြည့်ရမယ့် နေရာပါ။ **Default:** `0`
  * `length` {integer} ဖတ်ရမယ့် bytes အရေအတွက်ပါ။ **Default:** `buffer.byteLength - offset`
  * `position` {integer|bigint|null} File ကနေ data ဖတ်တာ စတင်ရမယ့် နေရာပါ။ `null` သို့မဟုတ် `-1` ဆိုရင် — data တွေကို လက်ရှိ file position ကနေ ဖတ်ပြီး position ကို update လုပ်ပါလိမ့်မယ်။ `position` က အနုတ်မဟုတ်တဲ့ (non-negative) integer ဆိုရင် — လက်ရှိ file position က မပြောင်းလဲပဲ ရှိနေပါလိမ့်မယ်။ **Default:**: `null`
* Returns: {Promise} အောင်မြင်ပါက properties နှစ်ခုပါတဲ့ object တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်:
  * `bytesRead` {integer} ဖတ်လိုက်တဲ့ bytes အရေအတွက်ပါ
  * `buffer` {Buffer|TypedArray|DataView} ဖြတ်သန်းပေးလိုက်တဲ့ `buffer` argument ကို ရည်ညွှန်းတာပါ။

File ကနေ data တွေကို ဖတ်ပြီး ပေးထားတဲ့ buffer ထဲမှာ သိမ်းဆည်းပါတယ်။

File ကို တစ်ပြိုင်နက် (concurrently) ပြုပြင်မထားဘူးဆိုရင် — ဖတ်လိုက်တဲ့ bytes အရေအတွက် သုည ဖြစ်သွားတဲ့အခါ — end-of-file (EOF) ကို ရောက်ရှိပါတယ်။

#### `filehandle.read(buffer[, options])`

* `buffer` {Buffer|TypedArray|DataView} ဖတ်လိုက်တဲ့ file data တွေနဲ့ ဖြည့်သွင်းခံရမယ့် buffer တစ်ခုပါ။
* `options` {Object}
  * `offset` {integer} Buffer ထဲမှာ စတင်ဖြည့်ရမယ့် နေရာပါ။ **Default:** `0`
  * `length` {integer} ဖတ်ရမယ့် bytes အရေအတွက်ပါ။ **Default:** `buffer.byteLength - offset`
  * `position` {integer|bigint|null} File ကနေ data ဖတ်တာ စတင်ရမယ့် နေရာပါ။ `null` သို့မဟုတ် `-1` ဆိုရင် — data တွေကို လက်ရှိ file position ကနေ ဖတ်ပြီး position ကို update လုပ်ပါလိမ့်မယ်။ `position` က အနုတ်မဟုတ်တဲ့ (non-negative) integer ဆိုရင် — လက်ရှိ file position က မပြောင်းလဲပဲ ရှိနေပါလိမ့်မယ်။ **Default:**: `null`
* Returns: {Promise} အောင်မြင်ပါက properties နှစ်ခုပါတဲ့ object တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်:
  * `bytesRead` {integer} ဖတ်လိုက်တဲ့ bytes အရေအတွက်ပါ
  * `buffer` {Buffer|TypedArray|DataView} ဖြတ်သန်းပေးလိုက်တဲ့ `buffer` argument ကို ရည်ညွှန်းတာပါ။

File ကနေ data တွေကို ဖတ်ပြီး ပေးထားတဲ့ buffer ထဲမှာ သိမ်းဆည်းပါတယ်။

File ကို တစ်ပြိုင်နက် (concurrently) ပြုပြင်မထားဘူးဆိုရင် — ဖတ်လိုက်တဲ့ bytes အရေအတွက် သုည ဖြစ်သွားတဲ့အခါ — end-of-file (EOF) ကို ရောက်ရှိပါတယ်။

#### `filehandle.readableWebStream([options])`

* `options` {Object}
  * `autoClose` {boolean} `true` ဆိုရင် — stream ကို ပိတ်တဲ့အခါ {FileHandle} ကိုပါ ပိတ်စေပါတယ်။ **Default:** `false`
* Returns: {ReadableStream}

File ရဲ့ contents တွေကို ဖတ်ဖို့ သုံးနိုင်တဲ့ byte-oriented `ReadableStream` တစ်ခုကို ပြန်ပေးပါတယ်။

ဒီ method ကို တစ်ကြိမ်ထက်ပိုပြီး ခေါ်ရင် သို့မဟုတ် `FileHandle` ကို ပိတ်ပြီးသား သို့မဟုတ် ပိတ်နေဆဲ ဖြစ်ပြီးမှ ခေါ်ရင် — error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

```mjs
import {
  open,
} from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const chunk of file.readableWebStream())
  console.log(chunk);

await file.close();
```

```cjs
const {
  open,
} = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const chunk of file.readableWebStream())
    console.log(chunk);

  await file.close();
})();
```

`ReadableStream` က file ကို အပြည့်အဝ ဖတ်ပြီးအောင် လုပ်ပေးပေမယ့် — `FileHandle` ကိုတော့ အလိုအလျောက် မပိတ်ပေးပါဘူး။ `autoClose` option ကို `true` အဖြစ် သတ်မှတ်ထားခြင်း မရှိရင် — user code က `fileHandle.close()` method ကို ကိုယ်တိုင် ခေါ်ပေးရပါသေးတယ်။

#### `filehandle.readFile(options)`

* `options` {Object|string}
  * `encoding` {string|null} **Default:** `null`
  * `signal` {AbortSignal} လုပ်ဆောင်နေဆဲ readFile တစ်ခုကို abort လုပ်ခွင့်ပြုပါတယ်
  * `buffer` {Buffer|TypedArray|DataView|Function} ဖတ်သွင်းရမယ့် buffer တစ်ခု သို့မဟုတ် — file size ကို လက်ခံပြီး buffer ကို ပြန်ပေးတဲ့ function တစ်ခုပါ။
* Returns: {Promise} အောင်မြင်တဲ့ read တစ်ခုဖြစ်ပါက file ရဲ့ contents တွေနဲ့ fulfill ဖြစ်ပါတယ်။ Encoding တစ်ခုကို (`options.encoding` ကို သုံးပြီး) သတ်မှတ်မထားရင် — data တွေကို {Buffer} object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ မဟုတ်ရင်တော့ data က string တစ်ခု ဖြစ်ပါလိမ့်မယ်။

File တစ်ခုရဲ့ contents တွေ တစ်ခုလုံးကို asynchronously ဖတ်ပါတယ်။

`options` က string တစ်ခု ဆိုရင် — အဲဒါက `encoding` ကို သတ်မှတ်ပေးတာပါ။

`buffer` ကို ပေးထားပြီး encoding မသတ်မှတ်ထားရင် — ပြန်ပေးလိုက်တဲ့ {Buffer} က ဖတ်လိုက်တဲ့ bytes တွေသာ ပါဝင်တဲ့ — ပေးထားတဲ့ buffer အပေါ်က view တစ်ခု ဖြစ်ပါတယ်။ ပေးထားတဲ့ buffer က file တစ်ခုလုံး ဆံ့ဖို့ သေးလွန်းရင် — operation က မအောင်မြင်ဘဲ (fail) ဖြစ်သွားပါလိမ့်မယ်။

{FileHandle} က reading ကို support လုပ်ရပါမယ်။

File handle တစ်ခုပေါ်မှာ `filehandle.read()` ခေါ်တွေ တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုပြီး လုပ်ပြီးမှ `filehandle.readFile()` ခေါ်တစ်ခုကို လုပ်လိုက်ရင် — data တွေကို လက်ရှိ position ကနေ file ရဲ့ အဆုံးအထိ ဖတ်ပါလိမ့်မယ်။ အမြဲတမ်း file ရဲ့ အစကနေ ဖတ်တာ မဟုတ်ပါဘူး။

Pre-allocated (ကြိုတင် ခွဲဝေထားသော) buffer တစ်ခုနဲ့ `buffer` option ကို သုံးတဲ့ ဥပမာ:

```mjs
import { Buffer } from 'node:buffer';
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');
try {
  const buf = Buffer.alloc(16384);
  const contents = await file.readFile({ buffer: buf });
  console.log(contents); // A view over `buf` containing only the bytes read
} finally {
  await file.close();
}
```

Buffer တစ်ခုကို ပြန်ပေးတဲ့ function တစ်ခုနဲ့ `buffer` option ကို သုံးတဲ့ ဥပမာ:

```mjs
import { Buffer } from 'node:buffer';
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');
try {
  const contents = await file.readFile({
    buffer: (size) => Buffer.alloc(size),
  });
  console.log(contents);
} finally {
  await file.close();
}
```

#### `filehandle.readLines([options])`

* `options` {Object}
  * `encoding` {string} **Default:** `null`
  * `autoClose` {boolean} **Default:** `true`
  * `emitClose` {boolean} **Default:** `true`
  * `start` {integer}
  * `end` {integer} **Default:** `Infinity`
  * `highWaterMark` {integer} **Default:** `64 * 1024`
* Returns: {readline.InterfaceConstructor}

File ပေါ်မှာ `readline` interface တစ်ခုနဲ့ stream တစ်ခုကို ဖန်တီးပေးတဲ့ အဆင်ပြေ (convenience) method ပါ။ Options တွေအတွက် [`filehandle.createReadStream()`][] ကို ကြည့်ပါ။

```mjs
import { open } from 'node:fs/promises';

const file = await open('./some/file/to/read');

for await (const line of file.readLines()) {
  console.log(line);
}
```

```cjs
const { open } = require('node:fs/promises');

(async () => {
  const file = await open('./some/file/to/read');

  for await (const line of file.readLines()) {
    console.log(line);
  }
})();
```

#### `filehandle.readv(buffers[, position])`

* `buffers` {Buffer\[]|TypedArray\[]|DataView\[]}
* `position` {integer|null} File ရဲ့ အစကနေ data တွေ ဖတ်ရမယ့် offset ပါ။ `position` က `number` မဟုတ်ဘူးဆိုရင် — data တွေကို လက်ရှိ position ကနေ ဖတ်ပါလိမ့်မယ်။ **Default:** `null`
* Returns: {Promise} အောင်မြင်ပါက properties နှစ်ခု ပါဝင်တဲ့ object တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်:
  * `bytesRead` {integer} ဖတ်လိုက်တဲ့ bytes အရေအတွက်ပါ
  * `buffers` {Buffer\[]|TypedArray\[]|DataView\[]} `buffers` input ကို ရည်ညွှန်းတဲ့ property ပါ။

File ကနေ ဖတ်ပြီး {ArrayBufferView}s တွေရဲ့ array တစ်ခုထဲကို ရေးသားပါတယ်

#### `filehandle.stat([options])`

* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.Stats} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
  * `signal` {AbortSignal} Operation ကို cancel လုပ်ဖို့ AbortSignal တစ်ခုပါ။ **Default:** `undefined`.
* Returns: {Promise} File အတွက် {fs.Stats} တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

#### `filehandle.sync()`

* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

ဖွင့်ထားတဲ့ file descriptor အတွက် data တွေ အားလုံးကို storage device ဆီကို flush လုပ်ဖို့ တောင်းဆိုပါတယ်။ တိကျတဲ့ အကောင်အထည်ဖော်မှုကတော့ operating system နဲ့ device အလိုက် ကွဲပြားပါတယ်။ နောက်ထပ် အသေးစိတ်အတွက် POSIX fsync(2) documentation ကို ကြည့်ပါ။

#### `filehandle.truncate(len)`

* `len` {integer} **Default:** `0`
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

File ကို truncate (ဖြတ်တောက်) လုပ်ပါတယ်။

File က `len` bytes ထက် ကြီးနေခဲ့ရင် — ပထမဆုံး `len` bytes တွေကိုသာ file ထဲမှာ ထိန်းသိမ်းထားပါလိမ့်မယ်။

အောက်က ဥပမာက file ရဲ့ ပထမဆုံး bytes လေးခုကိုသာ ထိန်းသိမ်းပါတယ်:

```mjs
import { open } from 'node:fs/promises';

let filehandle = null;
try {
  filehandle = await open('temp.txt', 'r+');
  await filehandle.truncate(4);
} finally {
  await filehandle?.close();
}
```

File က အရင်က `len` bytes ထက် ပိုတိုနေခဲ့ရင် — file ကို ရှည်အောင် ချဲ့ပြီး — ချဲ့လိုက်တဲ့ အပိုင်းကို null bytes (`'\0'`) တွေနဲ့ ဖြည့်ပါတယ်:

`len` က အနုတ်ဖြစ်နေရင် `0` ကို သုံးပါလိမ့်မယ်။

#### `filehandle.utimes(atime, mtime)`

* `atime` {number|string|Date}
* `mtime` {number|string|Date}
* Returns: {Promise}

{FileHandle} က ရည်ညွှန်းထားတဲ့ object ရဲ့ file system timestamps တွေကို ပြောင်းလဲပြီး — အောင်မြင်ပါက arguments ဘာမှ မပါပဲ promise ကို fulfill လုပ်ပါတယ်။

#### `filehandle.write(buffer, offset[, length[, position]])`

* `buffer` {Buffer|TypedArray|DataView}
* `offset` {integer} ရေးသားရမယ့် data စတင်တဲ့ `buffer` အတွင်းက start position ပါ။
* `length` {integer} `buffer` ကနေ ရေးသားရမယ့် bytes အရေအတွက်ပါ။ **Default:** `buffer.byteLength - offset`
* `position` {integer|null} `buffer` ကနေ လာတဲ့ data တွေကို ရေးသားရမယ့် — file ရဲ့ အစကနေ ရေတွက်တဲ့ — offset ပါ။ `position` က `number` မဟုတ်ဘူးဆိုရင် — data တွေကို လက်ရှိ position မှာ ရေးသားပါလိမ့်မယ်။ နောက်ထပ် အသေးစိတ်အတွက် POSIX pwrite(2) documentation ကို ကြည့်ပါ။ **Default:** `null`
* Returns: {Promise}

`buffer` ကို file ထဲကို ရေးသားပါတယ်။

Promise က properties နှစ်ခု ပါဝင်တဲ့ object တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်:

* `bytesWritten` {integer} ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ
* `buffer` {Buffer|TypedArray|DataView} ရေးသားလိုက်တဲ့ `buffer` ကို ရည်ညွှန်းတာပါ။

Promise က fulfill (သို့မဟုတ် rejected) ဖြစ်တာကို မစောင့်ပဲ file တစ်ခုတည်းပေါ်မှာ `filehandle.write()` ကို အကြိမ်များစွာ သုံးတာက မလုံခြုံပါဘူး။ ဒီလို အခြေအနေမျိုးအတွက် [`filehandle.createWriteStream()`][] ကို သုံးပါ။

Linux မှာ file ကို append mode နဲ့ ဖွင့်ထားရင် positional writes တွေ အလုပ်မလုပ်ပါဘူး။ Kernel က position argument ကို လျစ်လျူရှုပြီး data တွေကို file ရဲ့ အဆုံးမှာ အမြဲတမ်း append လုပ်ပါတယ်။

#### `filehandle.write(buffer[, options])`

* `buffer` {Buffer|TypedArray|DataView}
* `options` {Object}
  * `offset` {integer} **Default:** `0`
  * `length` {integer} **Default:** `buffer.byteLength - offset`
  * `position` {integer|null} **Default:** `null`
* Returns: {Promise}

`buffer` ကို file ထဲကို ရေးသားပါတယ်။

အပေါ်က `filehandle.write` function နဲ့ ဆင်တူပြီး — ဒီ version က optional `options` object တစ်ခုကို လက်ခံပါတယ်။ `options` object ကို သတ်မှတ်မထားဘူးဆိုရင် — အပေါ်က တန်ဖိုးတွေနဲ့ default ဖြစ်ပါလိမ့်မယ်။

#### `filehandle.write(string[, position[, encoding]])`

* `string` {string}
* `position` {integer|null} `string` ကနေ လာတဲ့ data တွေကို ရေးသားရမယ့် — file ရဲ့ အစကနေ ရေတွက်တဲ့ — offset ပါ။ `position` က `number` မဟုတ်ဘူးဆိုရင် — data တွေကို လက်ရှိ position မှာ ရေးသားပါလိမ့်မယ်။ နောက်ထပ် အသေးစိတ်အတွက် POSIX pwrite(2) documentation ကို ကြည့်ပါ။ **Default:** `null`
* `encoding` {string} မျှော်လင့်ထားတဲ့ string encoding ပါ။ **Default:** `'utf8'`
* Returns: {Promise}

`string` ကို file ထဲကို ရေးသားပါတယ်။ `string` က string မဟုတ်ဘူးဆိုရင် — promise ကို error တစ်ခုနဲ့ reject လုပ်ပါတယ်။

Promise က properties နှစ်ခု ပါဝင်တဲ့ object တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်:

* `bytesWritten` {integer} ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ
* `buffer` {string} ရေးသားလိုက်တဲ့ `string` ကို ရည်ညွှန်းတာပါ။

Promise က fulfill (သို့မဟုတ် rejected) ဖြစ်တာကို မစောင့်ပဲ file တစ်ခုတည်းပေါ်မှာ `filehandle.write()` ကို အကြိမ်များစွာ သုံးတာက မလုံခြုံပါဘူး။ ဒီလို အခြေအနေမျိုးအတွက် [`filehandle.createWriteStream()`][] ကို သုံးပါ။

Linux မှာ file ကို append mode နဲ့ ဖွင့်ထားရင် positional writes တွေ အလုပ်မလုပ်ပါဘူး။ Kernel က position argument ကို လျစ်လျူရှုပြီး data တွေကို file ရဲ့ အဆုံးမှာ အမြဲတမ်း append လုပ်ပါတယ်။

#### `filehandle.writeFile(data, options)`

* `data` {string|Buffer|TypedArray|DataView|AsyncIterable|Iterable}
* `options` {Object|string}
  * `encoding` {string|null} `data` က string တစ်ခု ဖြစ်တဲ့အခါ မျှော်လင့်ထားတဲ့ character encoding ပါ။ **Default:** `'utf8'`
  * `signal` {AbortSignal|undefined} လုပ်ဆောင်နေဆဲ writeFile တစ်ခုကို abort လုပ်ခွင့်ပြုပါတယ်။ **Default:** `undefined`
* Returns: {Promise}

Data တွေကို file တစ်ခုထဲကို asynchronously ရေးသားပြီး — file က အရင်ကတည်းက ရှိနေရင် အစားထိုးပါတယ်။ `data` က string တစ်ခု၊ buffer တစ်ခု၊ {AsyncIterable} တစ်ခု သို့မဟုတ် {Iterable} object တစ်ခု ဖြစ်နိုင်ပါတယ်။ အောင်မြင်ပါက arguments ဘာမှ မပါပဲ promise ကို fulfill လုပ်ပါတယ်။

`options` က string တစ်ခု ဆိုရင် — အဲဒါက `encoding` ကို သတ်မှတ်ပေးတာပါ။

{FileHandle} က writing ကို support လုပ်ရပါမယ်။

Promise က fulfill (သို့မဟုတ် rejected) ဖြစ်တာကို မစောင့်ပဲ file တစ်ခုတည်းပေါ်မှာ `filehandle.writeFile()` ကို အကြိမ်များစွာ သုံးတာက မလုံခြုံပါဘူး။

File handle တစ်ခုပေါ်မှာ `filehandle.write()` ခေါ်တွေ တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုပြီး လုပ်ပြီးမှ `filehandle.writeFile()` ခေါ်တစ်ခုကို လုပ်လိုက်ရင် — data တွေကို လက်ရှိ position ကနေ file ရဲ့ အဆုံးအထိ ရေးသားပါလိမ့်မယ်။ အမြဲတမ်း file ရဲ့ အစကနေ ရေးသားတာ မဟုတ်ပါဘူး။

#### `filehandle.writev(buffers[, position])`

* `buffers` {Buffer\[]|TypedArray\[]|DataView\[]}
* `position` {integer|null} `buffers` ကနေ လာတဲ့ data တွေကို ရေးသားရမယ့် — file ရဲ့ အစကနေ ရေတွက်တဲ့ — offset ပါ။ `position` က `number` မဟုတ်ဘူးဆိုရင် — data တွေကို လက်ရှိ position မှာ ရေးသားပါလိမ့်မယ်။ **Default:** `null`
* Returns: {Promise}

{ArrayBufferView}s တွေရဲ့ array တစ်ခုကို file ထဲကို ရေးသားပါတယ်။

Promise က properties နှစ်ခု ပါဝင်တဲ့ object တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်:

* `bytesWritten` {integer} ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ
* `buffers` {Buffer\[]|TypedArray\[]|DataView\[]} `buffers` input ကို ရည်ညွှန်းတာပါ။

Promise က fulfill (သို့မဟုတ် rejected) ဖြစ်တာကို မစောင့်ပဲ file တစ်ခုတည်းပေါ်မှာ `writev()` ကို အကြိမ်များစွာ ခေါ်တာက မလုံခြုံပါဘူး။

Linux မှာ file ကို append mode နဲ့ ဖွင့်ထားရင် positional writes တွေ အလုပ်မလုပ်ပါဘူး။ Kernel က position argument ကို လျစ်လျူရှုပြီး data တွေကို file ရဲ့ အဆုံးမှာ အမြဲတမ်း append လုပ်ပါတယ်။

#### `filehandle.writer([options])`

> Stability: 1 - Experimental

* `options` {Object}
  * `autoClose` {boolean} Writer က ပြီးဆုံးတဲ့အခါ သို့မဟုတ် မအောင်မြင်တဲ့အခါ file handle ကို ပိတ်ပါတယ်။ **Default:** `false`.
  * `start` {number} စတင်ရေးသားရမယ့် byte offset ပါ။ သတ်မှတ်ထားရင် — writes တွေက explicit positioning ကို သုံးပါတယ်။ **Default:** လက်ရှိ file position။
  * `limit` {number} Writer က လက်ခံမယ့် bytes အများဆုံး အရေအတွက်ပါ။ Limit ကို ကျော်လွန်မယ့် async writes (`write()`, `writev()`) တွေက `ERR_OUT_OF_RANGE` နဲ့ reject လုပ်ပါတယ်။ Sync writes (`writeSync()`, `writevSync()`) တွေကတော့ `false` ကို ပြန်ပေးပါတယ်။ **Default:** limit မရှိပါ။
  * `chunkSize` {number} Synchronous write operations တွေအတွက် bytes နဲ့ ဖော်ပြတဲ့ အများဆုံး chunk size ပါ။ ဒီ threshold ထက် ကြီးတဲ့ writes တွေက async I/O ဆီကို ပြန်ကျသွားပါတယ်။ အကောင်းဆုံး `pipeTo()` စွမ်းဆောင်ရည်အတွက် — ဒါကို reader ရဲ့ `chunkSize` နဲ့ ကိုက်ညီအောင် သတ်မှတ်ပါ။ **Default:** `131072` (128 KB)။
* Returns: {Object}
  * `write(chunk[, options])` {Function} Returns {Promise}။ `Uint8Array`, `Buffer` (သို့) string (UTF-8 encoded) တွေကို လက်ခံပါတယ်။
    * `chunk` {Buffer|TypedArray|DataView|string}
    * `options` {Object}
      * `signal` {AbortSignal} Signal ကို abort လုပ်ပြီးသား ဖြစ်နေရင် — I/O မလုပ်ဆောင်ပဲ write က `AbortError` နဲ့ reject လုပ်ပါတယ်။
  * `writev(chunks[, options])` {Function} Returns {Promise}။ `writev()` syscall တစ်ခုတည်းကနေတစ်ဆင့် scatter/gather I/O ကို သုံးပါတယ်။ `Uint8Array`/string arrays ရောထွေးတွေကို လက်ခံပါတယ်။
    * `chunks` {Buffer\[]|TypedArray\[]|DataView\[]|string\[]}
    * `options` {Object}
      * `signal` {AbortSignal} Signal ကို abort လုပ်ပြီးသား ဖြစ်နေရင် — I/O မလုပ်ဆောင်ပဲ write က `AbortError` နဲ့ reject လုပ်ပါတယ်။
  * `writeSync(chunk)` {Function} Returns {boolean}။ Synchronous write တစ်ခုကို ကြိုးစား လုပ်ဆောင်ပါတယ်။ Write က အောင်မြင်ခဲ့ရင် `true` ကို ပြန်ပေးပြီး — caller က async `write()` ဆီကို ပြန်ကျသင့်ရင် `false` ကို ပြန်ပေးပါတယ်။ Writer က closed/errored ဖြစ်နေတဲ့အခါ၊ async operation တစ်ခု လုပ်ဆောင်နေဆဲ ရှိနေတဲ့အခါ၊ chunk က `chunkSize` ကို ကျော်လွန်နေတဲ့အခါ သို့မဟုတ် write က `limit` ကို ကျော်လွန်မယ့်အခါ — `false` ကို ပြန်ပေးပါတယ်။
    * `chunk` {Buffer|TypedArray|DataView|string}
  * `writevSync(chunks)` {Function} Returns {boolean}။ Synchronous batch write ပါ။ `writeSync()` နဲ့ တူညီတဲ့ fallback semantics တွေ ရှိပါတယ်။
    * `chunks` {Buffer\[]|TypedArray\[]|DataView\[]|string\[]}
  * `end([options])` {Function} Returns {Promise} — ရေးသားပြီးသား bytes စုစုပေါင်း အရေအတွက်နဲ့ fulfill ဖြစ်ပါတယ်။ Idempotent (ထပ်ခေါ်လည်း ရလဒ် တူညီခြင်း) ပါ: ပိတ်ပြီးသား ဖြစ်နေရင် `totalBytesWritten` ကို ပြန်ပေးပြီး — ပိတ်နေဆဲ ဖြစ်နေရင် pending promise ကို ပြန်ပေးပါတယ်။ Writer က errored state မှာ ရှိနေရင် reject လုပ်ပါတယ်။
    * `options` {Object}
      * `signal` {AbortSignal} Signal ကို abort လုပ်ပြီးသား ဖြစ်နေရင် — `end()` က `AbortError` နဲ့ reject လုပ်ပြီး writer က ဖွင့်ထားဆဲ (open) ဖြစ်နေပါတယ်။
  * `endSync()` {Function} Returns {number|number} — အောင်မြင်ရင် ရေးသားပြီးသား bytes စုစုပေါင်း ဖြစ်ပြီး — writer က errored ဖြစ်နေရင် သို့မဟုတ် async operation တစ်ခု လုပ်ဆောင်နေဆဲ ရှိနေရင် `-1` ကို ပြန်ပေးပါတယ်။ ပိတ်ပြီးသား ဖြစ်နေရင် idempotent ပါ။
  * `fail(reason)` {Function} Writer ကို terminal error state တစ်ခုထဲကို ရောက်စေပါတယ်။ Synchronous ပါ။ Writer က ပိတ်ပြီးသား သို့မဟုတ် errored ဖြစ်နေပြီးသားဆိုရင် — ဒါက no-op (ဘာမျှ မလုပ်ပဲ နေခြင်း) ပါ။ `autoClose` က `true` ဆိုရင် — file handle ကို synchronously ပိတ်ပါတယ်။

ဒီ file handle ကို အခြေခံ (backed) ထားတဲ့ [`node:stream/iter`][] writer တစ်ခုကို ပြန်ပေးပါတယ်။

Writer က `Symbol.asyncDispose` ရော `Symbol.dispose` ပါ support လုပ်ပါတယ်:

* `await using w = fh.writer()` — writer က ဖွင့်ထားဆဲ ဖြစ်နေသေးရင် (`end()` ကို မခေါ်ရသေးရင်) — `asyncDispose` က `fail()` ကို ခေါ်ပါတယ်။ `end()` က pending ဖြစ်နေရင် — ၎င်းက ပြီးဆုံးတာကို စောင့်ဆိုင်းပေးပါတယ်။
* `using w = fh.writer()` — `fail()` ကို ခြွင်းချက်မရှိ ခေါ်ပါတယ်။

`writeSync()` နဲ့ `writevSync()` methods တွေက [`stream/iter pipeTo()`][] က သုံးတဲ့ try-sync fast path (အမြန်လမ်းကြောင်း) ကို ဖွင့်ပေးပါတယ်။ Reader ရဲ့ chunk size က writer ရဲ့ `chunkSize` နဲ့ ကိုက်ညီနေရင် — `pipeTo()` pipeline တစ်ခုထဲက writes တွေ အားလုံးက promise overhead သုညနဲ့ synchronously ပြီးဆုံးပါတယ်။

ဒီ function က `--experimental-stream-iter` flag ကို ဖွင့်ထားတဲ့အခါမှသာ ရရှိနိုင်ပါတယ်။

```mjs
import { open } from 'node:fs/promises';
import { from, pipeTo } from 'node:stream/iter';
import { compressGzip } from 'node:zlib/iter';

// Async pipeline
const fh = await open('output.gz', 'w');
await pipeTo(from('Hello!'), compressGzip(), fh.writer({ autoClose: true }));

// Sync pipeline with limit
const src = await open('input.txt', 'r');
const dst = await open('output.txt', 'w');
const w = dst.writer({ limit: 1024 * 1024 }); // Max 1 MB
await pipeTo(src.pull({ autoClose: true }), w);
await w.end();
await dst.close();
```

```cjs
const { open } = require('node:fs/promises');
const { from, pipeTo } = require('node:stream/iter');
const { compressGzip } = require('node:zlib/iter');

async function run() {
  // Async pipeline
  const fh = await open('output.gz', 'w');
  await pipeTo(from('Hello!'), compressGzip(), fh.writer({ autoClose: true }));

  // Sync pipeline with limit
  const src = await open('input.txt', 'r');
  const dst = await open('output.txt', 'w');
  const w = dst.writer({ limit: 1024 * 1024 }); // Max 1 MB
  await pipeTo(src.pull({ autoClose: true }), w);
  await w.end();
  await dst.close();
}

run().catch(console.error);
```

#### `filehandle[Symbol.asyncDispose]()`

* Returns: {Promise}

`filehandle.close()` ကို ခေါ်ပြီး — filehandle ကို ပိတ်လိုက်တဲ့အခါ fulfill ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။

ဒီ method က filehandle ကို [`await using`][] နဲ့ သုံးစွဲနိုင်စေပြီး — scope ကနေ ထွက်သွားတဲ့အခါ file ကို အလိုအလျောက် ပိတ်ပေးပါလိမ့်မယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [MDN documentation on `using` statements][`using`] ကို ကြည့်ပါ။

### `fsPromises.access(path[, mode])`

* `path` {string|Buffer|URL}
* `mode` {integer} **Default:** `fs.constants.F_OK`
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

`path` နဲ့ သတ်မှတ်ထားတဲ့ file သို့မဟုတ် directory အတွက် user တစ်ဦးရဲ့ permissions တွေကို စမ်းသပ်ပါတယ်။ `mode` argument က လုပ်ဆောင်ရမယ့် accessibility checks တွေကို သတ်မှတ်ပေးတဲ့ optional integer ပါ။ `mode` က `fs.constants.F_OK` တန်ဖိုး သို့မဟုတ် — `fs.constants.R_OK`, `fs.constants.W_OK` နဲ့ `fs.constants.X_OK` တွေထဲက တစ်ခုခုကို bitwise OR လုပ်ထားတဲ့ mask (ဥပမာ — `fs.constants.W_OK | fs.constants.R_OK`) ဖြစ်ရပါမယ်။ `mode` ရဲ့ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေအတွက် [File access constants][] ကို ကြည့်ပါ။

Accessibility check က အောင်မြင်ခဲ့ရင် — promise ကို တန်ဖိုး ဘာမှ မပါပဲ fulfill လုပ်ပါတယ်။ Accessibility checks တွေထဲက တစ်ခုခု မအောင်မြင်ခဲ့ရင် — promise ကို {Error} object တစ်ခုနဲ့ reject လုပ်ပါတယ်။ အောက်က ဥပမာက `/etc/passwd` file ကို လက်ရှိ process က ဖတ်လို့ရော ရေးလို့ပါ ရလားဆိုတာကို စစ်ဆေးပါတယ်။

```mjs
import { access, constants } from 'node:fs/promises';

try {
  await access('/etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can access');
} catch {
  console.error('cannot access');
}
```

`fsPromises.open()` ကို မခေါ်ခင် `fsPromises.access()` ကို သုံးပြီး file တစ်ခုရဲ့ accessibility ကို စစ်ဆေးတာကို အကြံပြုမထားပါဘူး။ အဲဒီလို လုပ်တာက race condition (ပြိုင်ဆိုင်မှု အခြေအနေ) တစ်ခုကို ဖြစ်ပေါ်စေနိုင်ပြီး — ခေါ်မှု နှစ်ခုကြားမှာ တခြား processes တွေက file ရဲ့ state ကို ပြောင်းလဲပစ်နိုင်လို့ပါ။ ယင်းအစား user code က file ကို တိုက်ရိုက် open/read/write လုပ်ပြီး — file ကို ဝင်ရောက်လို့ မရရင် ပေါ်ပေါက်လာတဲ့ error ကို ကိုင်တွယ်သင့်ပါတယ်။

### `fsPromises.appendFile(path, data[, options])`

* `path` {string|Buffer|URL|FileHandle} filename သို့မဟုတ် {FileHandle} ပါ။
* `data` {string|Buffer|TypedArray|DataView|AsyncIterable|Iterable}
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `'utf8'`
  * `mode` {integer} **Default:** `0o666`
  * `flag` {string} [support of file system `flags`][] ကို ကြည့်ပါ။ **Default:** `'a'`.
  * `flush` {boolean} `true` ဆိုရင် — underlying file descriptor ကို မပိတ်ခင် flush လုပ်ပါတယ်။ **Default:** `false`.
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

Data တွေကို file တစ်ခုထဲကို asynchronously append လုပ်ပြီး — file မရှိသေးရင် အသစ် ဖန်တီးပေးပါတယ်။ `data` က string တစ်ခု၊ buffer တစ်ခု၊ {AsyncIterable} တစ်ခု သို့မဟုတ် {Iterable} object တစ်ခု ဖြစ်နိုင်ပါတယ်။

`options` က string တစ်ခု ဆိုရင် — အဲဒါက `encoding` ကို သတ်မှတ်ပေးတာပါ။

`mode` option က အသစ် ဖန်တီးလိုက်တဲ့ file ကိုသာ သက်ရောက်မှု ရှိပါတယ်။ နောက်ထပ် အသေးစိတ်အတွက် [`fs.open()`][] ကို ကြည့်ပါ။

`path` ကို — appending အတွက် (`fsPromises.open()` ကို သုံးပြီး) ဖွင့်ထားတဲ့ {FileHandle} တစ်ခုအနေနဲ့လည်း သတ်မှတ်နိုင်ပါတယ်။

### `fsPromises.chmod(path, mode)`

* `path` {string|Buffer|URL}
* `mode` {string|integer}
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

File တစ်ခုရဲ့ permissions တွေကို ပြောင်းလဲပါတယ်။

### `fsPromises.chown(path, uid, gid)`

* `path` {string|Buffer|URL}
* `uid` {integer}
* `gid` {integer}
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

File တစ်ခုရဲ့ ပိုင်ဆိုင်မှုကို ပြောင်းလဲပါတယ်။

### `fsPromises.copyFile(src, dest[, mode])`

* `src` {string|Buffer|URL} ကူးယူရမယ့် source filename ပါ
* `dest` {string|Buffer|URL} copy operation ရဲ့ destination filename ပါ
* `mode` {integer} Copy operation ရဲ့ အပြုအမူကို သတ်မှတ်ပေးတဲ့ optional modifiers တွေပါ။ တန်ဖိုး နှစ်ခု သို့မဟုတ် နှစ်ခုထက်ပိုတာကို bitwise OR လုပ်ထားတဲ့ mask တစ်ခုကို ဖန်တီးနိုင်ပါတယ် (ဥပမာ — `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`) **Default:** `0`.
  * `fs.constants.COPYFILE_EXCL`: `dest` က အရင်ကတည်းက ရှိနေရင် copy operation က မအောင်မြင်ပါဘူး။
  * `fs.constants.COPYFILE_FICLONE`: Copy operation က copy-on-write reflink တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားပါတယ်။ Platform က copy-on-write ကို support မလုပ်ဘူးဆိုရင် — fallback copy ယန္တရား တစ်ခုကို သုံးပါတယ်။
  * `fs.constants.COPYFILE_FICLONE_FORCE`: Copy operation က copy-on-write reflink တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားပါတယ်။ Platform က copy-on-write ကို support မလုပ်ဘူးဆိုရင် — operation က မအောင်မြင်ပါဘူး။
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

`src` ကို `dest` ဆီကို asynchronously ကူးယူပါတယ်။ Default အနေနဲ့ — `dest` က အရင်ကတည်းက ရှိနေရင် — ၎င်းကို overwrite (အစားထိုး ရေးသား) လုပ်ပါတယ်။

Symbolic links တွေကို လိုက်လံ ရှာဖွေပါတယ်။ `src` က symbolic link တစ်ခု ဆိုရင် — target file ကို ကူးယူပါတယ်။ `dest` က symbolic link တစ်ခု ဆိုရင် — `mode` ထဲမှာ `fs.constants.COPYFILE_EXCL` မပါရင် — target file ကို overwrite လုပ်ပါတယ်။

Copy operation ရဲ့ atomicity (တစ်စုတစ်စည်းတည်း ပြီးမြောက်မှု) နဲ့ ပတ်သက်ပြီး အာမခံချက် ဘာမှ မပေးပါဘူး။ Destination file ကို writing အတွက် ဖွင့်ပြီးနောက်မှာ error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — destination ကို ဖယ်ရှားဖို့ ကြိုးစားမှု တစ်ခု လုပ်ပါလိမ့်မယ်။

```mjs
import { copyFile, constants } from 'node:fs/promises';

try {
  await copyFile('source.txt', 'destination.txt');
  console.log('source.txt was copied to destination.txt');
} catch {
  console.error('The file could not be copied');
}

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
try {
  await copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
  console.log('source.txt was copied to destination.txt');
} catch {
  console.error('The file could not be copied');
}
```

### `fsPromises.cp(src, dest[, options])`

* `src` {string|URL} ကူးယူရမယ့် source path ပါ။
* `dest` {string|URL} ကူးယူရောက်ရှိရမယ့် destination path ပါ။
* `options` {Object}
  * `dereference` {boolean} symlinks တွေကို dereference လုပ်ပါတယ်။ **Default:** `false`.
  * `errorOnExist` {boolean} `force` က `false` ဖြစ်ပြီး destination က ရှိနေရင် error တစ်ခုကို throw လုပ်ပါတယ်။ **Default:** `false`.
  * `filter` {Function} ကူးယူမယ့် files/directories တွေကို filter လုပ်ဖို့ function ပါ။ Item ကို ကူးယူဖို့ `true` ကို ပြန်ပေးပြီး — ၎င်းကို လျစ်လျူရှုဖို့ `false` ကို ပြန်ပေးပါတယ်။ Directory တစ်ခုကို လျစ်လျူရှုတဲ့အခါ — ၎င်းရဲ့ contents တွေ အားလုံးကိုပါ ကျော်သွားပါလိမ့်မယ်။ `true` သို့မဟုတ် `false` ကို resolve လုပ်တဲ့ `Promise` တစ်ခုကိုလည်း ပြန်ပေးနိုင်ပါတယ် **Default:** `undefined`.
    * `src` {string} ကူးယူရမယ့် source path ပါ။
    * `dest` {string} ကူးယူရောက်ရှိရမယ့် destination path ပါ။
    * Returns: {boolean|Promise} `boolean` အဖြစ် ပြောင်းလဲလို့ရတဲ့ တန်ဖိုး တစ်ခု သို့မဟုတ် — အဲဒီလို တန်ဖိုးနဲ့ fulfill ဖြစ်တဲ့ `Promise` တစ်ခုပါ။
  * `force` {boolean} ရှိပြီးသား file သို့မဟုတ် directory ကို overwrite လုပ်ပါတယ်။ ဒါကို `false` အဖြစ် သတ်မှတ်ပြီး destination က ရှိနေရင် — copy operation က errors တွေကို လျစ်လျူရှုပါလိမ့်မယ်။ ဒီအပြုအမူကို ပြောင်းလဲဖို့ `errorOnExist` option ကို သုံးပါ။ **Default:** `true`.
  * `mode` {integer} copy operation အတွက် modifiers တွေပါ။ **Default:** `0`. [`fsPromises.copyFile()`][] ရဲ့ `mode` flag ကို ကြည့်ပါ။
  * `preserveTimestamps` {boolean} `true` ဆိုရင် — `src` ကနေ timestamps တွေကို ထိန်းသိမ်းထားပါလိမ့်မယ်။ **Default:** `false`.
  * `recursive` {boolean} directories တွေကို recursively ကူးယူပါတယ် **Default:** `false`
  * `verbatimSymlinks` {boolean} `true` ဆိုရင် — symlinks တွေအတွက် path resolution ကို ကျော်သွားပါလိမ့်မယ်။ **Default:** `false`
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

Directory structure တစ်ခုလုံးကို — subdirectories နဲ့ files တွေ အပါအဝင် — `src` ကနေ `dest` ဆီကို asynchronously ကူးယူပါတယ်။

Directory တစ်ခုကို အခြား directory တစ်ခုဆီကို ကူးယူတဲ့အခါ — globs တွေကို support မလုပ်ပဲ — အပြုအမူက `cp dir1/ dir2/` နဲ့ ဆင်တူပါတယ်။

### `fsPromises.glob(pattern[, options])`

* `pattern` {string|string\[]}
* `options` {Object}
  * `cwd` {string|URL} လက်ရှိ working directory ပါ။ **Default:** `process.cwd()`
  * `exclude` {Function|string\[]} Files/directories တွေကို ဖယ်ထုတ်ဖို့ function တစ်ခု သို့မဟုတ် ဖယ်ထုတ်ရမယ့် glob patterns တွေရဲ့ စာရင်းပါ။ Function တစ်ခု ပေးထားရင် — item ကို ဖယ်ထုတ်ဖို့ `true` ကို ပြန်ပေးပြီး — ထည့်သွင်းဖို့ `false` ကို ပြန်ပေးပါတယ်။ **Default:** `undefined`. String array တစ်ခု ပေးထားရင် — string တစ်ခုချင်းစီက ဖယ်ထုတ်ရမယ့် paths တွေကို သတ်မှတ်တဲ့ glob pattern တစ်ခု ဖြစ်ရပါမယ်။ မှတ်ချက်: Negation patterns တွေ (ဥပမာ — '!foo.js') ကို support မလုပ်ပါဘူး။
  * `followSymlinks` {boolean} `true` ဆိုရင် — `**` patterns တွေကို ချဲ့ထွင်နေစဉ်မှာ directories တွေဆီကို ညွှန်တဲ့ symbolic links တွေကို လိုက်ပါပါတယ်။ **Default:** `false`.
  * `withFileTypes` {boolean} Glob က paths တွေကို Dirents အနေနဲ့ ပြန်ပေးသင့်ရင် `true` — မဟုတ်ရင် `false` ပါ။ **Default:** `false`.
* Returns: {AsyncIterator} Pattern နဲ့ ကိုက်ညီတဲ့ files တွေရဲ့ paths တွေကို yield လုပ်ပေးတဲ့ AsyncIterator တစ်ခုပါ။

`followSymlinks` ကို ဖွင့်ထားတဲ့အခါ — တွေ့ရှိလိုက်တဲ့ symbolic link cycles တွေကို recursively ဖြတ်သန်း သွားလာမှာ မဟုတ်ပါဘူး။

```mjs
import { glob } from 'node:fs/promises';

for await (const entry of glob('**/*.js'))
  console.log(entry);
```

```cjs
const { glob } = require('node:fs/promises');

(async () => {
  for await (const entry of glob('**/*.js'))
    console.log(entry);
})();
```

### `fsPromises.lchmod(path, mode)`

> Stability: 0 - Deprecated

* `path` {string|Buffer|URL}
* `mode` {integer}
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

Symbolic link တစ်ခုပေါ်မှာ permissions တွေကို ပြောင်းလဲပါတယ်။

ဒီ method ကို macOS ပေါ်မှာသာ implement လုပ်ထားပါတယ်။

### `fsPromises.lchown(path, uid, gid)`

* `path` {string|Buffer|URL}
* `uid` {integer}
* `gid` {integer}
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

Symbolic link တစ်ခုပေါ်မှာ ပိုင်ဆိုင်မှုကို ပြောင်းလဲပါတယ်။

### `fsPromises.lutimes(path, atime, mtime)`

* `path` {string|Buffer|URL}
* `atime` {number|string|Date}
* `mtime` {number|string|Date}
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

File တစ်ခုရဲ့ access နဲ့ modification times တွေကို [`fsPromises.utimes()`][] နည်းတူ ပြောင်းလဲပေးပေမယ့် — path က symbolic link တစ်ခုကို ရည်ညွှန်းနေရင် — link ကို dereference လုပ်မပေးပဲ — link ကိုယ်တိုင်ရဲ့ timestamps တွေကို ပြောင်းလဲပေးတာမို့ — ကွာခြားပါတယ်။

### `fsPromises.link(existingPath, newPath)`

* `existingPath` {string|Buffer|URL}
* `newPath` {string|Buffer|URL}
* Returns: {Promise} အောင်မြင်ပါက `undefined` နဲ့ fulfill ဖြစ်ပါတယ်။

`existingPath` ကနေ `newPath` ဆီကို link အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ နောက်ထပ် အသေးစိတ်အတွက် POSIX link(2) documentation ကို ကြည့်ပါ။

### `fsPromises.lstat(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.Stats} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
  * `signal` {AbortSignal} Operation ကို cancel လုပ်ဖို့ AbortSignal တစ်ခုပါ။ **Default:** `undefined`.
* Returns: {Promise} ပေးထားတဲ့ symbolic link `path` အတွက် {fs.Stats} object တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

`path` က symbolic link တစ်ခုကို ရည်ညွှန်းနေတဲ့အခါမှသာ — link ကိုယ်တိုင်ကို stat လုပ်တာ ဖြစ်ပြီး — ၎င်းက ရည်ညွှန်းတဲ့ file ကို stat မလုပ်တာမို့ — [`fsPromises.stat()`][] နဲ့ ညီမျှပါတယ်။ နောက်ထပ် အသေးစိတ်အတွက် POSIX lstat(2) document ကို ရည်ညွှန်းပါ။

### `fsPromises.mkdir(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object|integer}
  * `recursive` {boolean} **Default:** `false`
  * `mode` {string|integer} Windows မှာ support မလုပ်ပါဘူး။ နောက်ထပ် အသေးစိတ်အတွက် [File modes][] ကို ကြည့်ပါ။ **Default:** `0o777`.
* Returns: {Promise} အောင်မြင်ပါက — `recursive` က `false` ဆိုရင် `undefined` နဲ့ fulfill ဖြစ်ပြီး — `recursive` က `true` ဆိုရင် ဖန်တီးလိုက်တဲ့ ပထမဆုံး directory path နဲ့ fulfill ဖြစ်ပါတယ်။

Directory တစ်ခုကို asynchronously ဖန်တီးပါတယ်။

Optional ဖြစ်တဲ့ `options` argument က `mode` (permission နဲ့ sticky bits) ကို သတ်မှတ်ပေးတဲ့ integer တစ်ခု သို့မဟုတ် — parent directories တွေကို ဖန်တီးသင့်လားဆိုတာ ဖော်ပြတဲ့ `mode` property နဲ့ `recursive` property တစ်ခု ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `path` က ရှိပြီးသား directory တစ်ခုကို ညွှန်ပြနေတုန်း `fsPromises.mkdir()` ကို ခေါ်လိုက်ရင် — `recursive` က `false` ဖြစ်တဲ့အခါမှသာ rejection ဖြစ်ပါတယ်။

```mjs
import { mkdir } from 'node:fs/promises';

try {
  const projectFolder = new URL('./test/project/', import.meta.url);
  const createDir = await mkdir(projectFolder, { recursive: true });

  console.log(`created ${createDir}`);
} catch (err) {
  console.error(err.message);
}
```

```cjs
const { mkdir } = require('node:fs/promises');
const { join } = require('node:path');

async function makeDirectory() {
  const projectFolder = join(__dirname, 'test', 'project');
  const dirCreation = await mkdir(projectFolder, { recursive: true });

  console.log(dirCreation);
  return dirCreation;
}

makeDirectory().catch(console.error);
```

### `fsPromises.mkdtemp(prefix[, options])`

* `prefix` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* Returns: {Promise} အသစ် ဖန်တီးလိုက်တဲ့ temporary directory ရဲ့ file system path ပါဝင်တဲ့ string တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်။

ထူးခြားတဲ့ (unique) temporary directory တစ်ခုကို ဖန်တီးပါတယ်။ ပေးထားတဲ့ `prefix` ရဲ့ အဆုံးမှာ random characters ခြောက်လုံး ထပ်ဖြည့်ခြင်းအားဖြင့် unique directory name တစ်ခုကို ထုတ်လုပ်ပါတယ်။ Platform တွေကြားမှာ မကိုက်ညီမှုတွေ ရှိတာမို့ — `prefix` ထဲမှာ နောက်ဆုံးမှာ ပါတဲ့ `X` characters တွေကို ရှောင်ကြဉ်ပါ။ Platform အချို့ — အထူးသဖြင့် BSDs — က random characters ခြောက်လုံးထက် ပိုပြီး ပြန်ပေးနိုင်သလို — `prefix` ထဲက နောက်ဆုံး `X` characters တွေကို random characters တွေနဲ့ အစားထိုးပါတယ်။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်ပေးတဲ့ string တစ်ခု သို့မဟုတ် — သုံးရမယ့် character encoding ကို သတ်မှတ်ပေးတဲ့ `encoding` property တစ်ခု ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။

```mjs
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

try {
  await mkdtemp(join(tmpdir(), 'foo-'));
} catch (err) {
  console.error(err);
}
```

`fsPromises.mkdtemp()` method က ကျပန်း ရွေးချယ်လိုက်တဲ့ characters ခြောက်လုံးကို `prefix` string ရဲ့ နောက်မှာ တိုက်ရိုက် ထပ်ဖြည့်ပါလိမ့်မယ်။ ဥပမာ — `/tmp` ဆိုတဲ့ directory တစ်ခု ပေးထားပြီး `/tmp` ၏ အတွင်း (within) မှာ temporary directory တစ်ခု ဖန်တီးချင်တယ်ဆိုရင် — `prefix` က platform အလိုက် သီးသန့် path separator (`require('node:path').sep`) တစ်ခုနဲ့ အဆုံးသတ်ရပါမယ်။

### `fsPromises.mkdtempDisposable(prefix[, options])`

* `prefix` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* Returns: {Promise} async-disposable Object တစ်ခုအတွက် Promise တစ်ခုနဲ့ fulfill ဖြစ်ပါတယ်:
  * `path` {string} ဖန်တီးလိုက်တဲ့ directory ရဲ့ path ပါ။
  * `remove` {AsyncFunction} ဖန်တီးလိုက်တဲ့ directory ကို ဖယ်ရှားပေးတဲ့ function တစ်ခုပါ။
  * `[Symbol.asyncDispose]` {AsyncFunction} `remove` နဲ့ အတူတူပါ။

ရလာတဲ့ Promise က async-disposable object တစ်ခုကို ကိုင်ဆောင်ထားပြီး — ၎င်းရဲ့ `path` property မှာ ဖန်တီးလိုက်တဲ့ directory path ကို သိမ်းဆည်းထားပါတယ်။ Object ကို dispose လုပ်လိုက်တဲ့အခါ — directory က ရှိနေသေးရင် — directory နဲ့ ၎င်းရဲ့ contents တွေကို asynchronously ဖယ်ရှားပါလိမ့်မယ်။ Directory ကို ဖျက်လို့ မရဘူးဆိုရင် — disposal က error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ Object ပေါ်မှာ တူညီတဲ့ အလုပ်ကို လုပ်ဆောင်ပေးမယ့် async `remove()` method တစ်ခု ရှိပါတယ်။

ဒီ function ရော ရလာတဲ့ object ပေါ်က disposal function ပါ async ဖြစ်တာမို့ — `await using dir = await fsPromises.mkdtempDisposable('prefix')` ဆိုသလို — `await` + [`await using`][] နဲ့ သုံးစွဲသင့်ပါတယ်။

Explicit resource management (ရှင်းလင်းစွာ သတ်မှတ်ထားသော resource စီမံခန့်ခွဲမှု) အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [MDN documentation on `using` statements][`using`] ကို ကြည့်ပါ။

အသေးစိတ် အချက်အလက်တွေအတွက် [`fsPromises.mkdtemp()`][] ရဲ့ documentation ကို ကြည့်ပါ။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်ပေးတဲ့ string တစ်ခု သို့မဟုတ် — သုံးရမယ့် character encoding ကို သတ်မှတ်ပေးတဲ့ `encoding` property တစ်ခု ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။
### `fsPromises.open(path[, flags[, mode]])`

* `path` {string|Buffer|URL}
* `flags` {string|number} See [support of file system `flags`][].
  **Default:** `'r'`.
* `mode` {string|integer} File ကို ဖန်တီးလိုက်တဲ့အခါ file mode (permission နဲ့ sticky bits) တွေကို သတ်မှတ်ပေးပါတယ်။
  အသေးစိတ်ကို [File modes][] မှာ ကြည့်ပါ။
  **Default:** `0o666` (ဖတ်လို့ရပြီး ရေးလို့ရပါတယ်)
* Returns: {Promise} {FileHandle} object တစ်ခုဖြင့် fulfill ဖြစ်ပါတယ်။

{FileHandle} တစ်ခုကို ဖွင့်ပါတယ်။

အသေးစိတ်အတွက် POSIX open(2) documentation ကို ရည်ညွှန်း ကြည့်ပါ။

Windows မှာ character အချို့ (`< > : " / \ | ? *`) တွေက [Naming Files, Paths, and Namespaces][] မှာ မှတ်တမ်းတင်ထားတဲ့အတိုင်း reserved (သီးသန့် သိမ်းဆည်းထားသော) တွေ ဖြစ်ပါတယ်။

NTFS မှာ filename ထဲမှာ colon တစ်ခု ပါဝင်နေရင် — [this MSDN page][MSDN-Using-Streams] မှာ ဖော်ပြထားတဲ့အတိုင်း — Node.js က file system stream တစ်ခုကို ဖွင့်ပါလိမ့်မယ်။

### `fsPromises.opendir(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `encoding` {string|null} **Default:** `'utf8'`
  * `bufferSize` {number} Directory ကနေ ဖတ်ရှုနေတဲ့အခါ အတွင်းပိုင်း buffer လုပ်ထားတဲ့ directory entries အရေအတွက်ပါ။ တန်ဖိုး မြင့်လေလေ performance ကောင်းလေလေ ဖြစ်ပေမယ့် — memory အသုံးပြုမှု မြင့်လေလေ ဖြစ်ပါတယ်။ **Default:** `32`
  * `recursive` {boolean} Resolve လုပ်လိုက်တဲ့ `Dir` က sub files နဲ့ directories တွေ အားလုံး ပါဝင်တဲ့ {AsyncIterable} တစ်ခု ဖြစ်ပါလိမ့်မယ်။ **Default:** `false`
* Returns: {Promise} {fs.Dir} တစ်ခုဖြင့် fulfill ဖြစ်ပါတယ်။

Directory တစ်ခုကို — iterative scanning (တစ်ခုပြီးတစ်ခု စကင်ဖတ်ခြင်း) လုပ်ဖို့ — asynchronously ဖွင့်ပါတယ်။ အသေးစိတ်အတွက် POSIX opendir(3) documentation ကို ကြည့်ပါ။

{fs.Dir} တစ်ခုကို ဖန်တီးပေးပြီး — directory ထဲကနေ ဖတ်ရှုခြင်းနဲ့ directory ကို ရှင်းလင်း (clean up) လုပ်ခြင်းအတွက် နောက်ထပ် function တွေ အားလုံး ပါဝင်ပါတယ်။

`encoding` option က directory ကို ဖွင့်တဲ့အချိန်နဲ့ နောက်ဆက်တွဲ read operations တွေမှာ `path` အတွက် encoding ကို သတ်မှတ်ပေးပါတယ်။

Async iteration ကို သုံးတဲ့ ဥပမာ:

```mjs
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```

Async iterator ကို သုံးတဲ့အခါ — iterator က ထွက်သွားပြီးနောက်မှာ {fs.Dir} object ကို အလိုအလျောက် ပိတ်ပါလိမ့်မယ်။

### `fsPromises.readdir(path[, options])`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
  * `withFileTypes` {boolean} **Default:** `false`
  * `recursive` {boolean} `true` ဆိုရင် directory တစ်ခုရဲ့ contents တွေကို recursively ဖတ်ပါတယ်။ Recursive mode မှာ files, sub files နဲ့ directories တွေ အားလုံးကို စာရင်းပြုစုပါလိမ့်မယ်။ **Default:** `false`.
* Returns: {Promise} Directory ထဲမှာရှိတဲ့ files တွေရဲ့ နာမည်တွေ — `'.'` နဲ့ `'..'` ကလွဲလို့ — ပါဝင်တဲ့ array တစ်ခုဖြင့် fulfill ဖြစ်ပါတယ်။

Directory တစ်ခုရဲ့ contents တွေကို ဖတ်ပါတယ်။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — filenames တွေအတွက် သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `encoding` ကို `'buffer'` အဖြစ် သတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ filenames တွေကို {Buffer} objects တွေအနေနဲ့ ဖြတ်သန်းပေးပါလိမ့်မယ်။

`options.withFileTypes` ကို `true` အဖြစ် သတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ array ထဲမှာ {fs.Dirent} objects တွေ ပါဝင်ပါလိမ့်မယ်။

```mjs
import { readdir } from 'node:fs/promises';

try {
  const files = await readdir(path);
  for (const file of files)
    console.log(file);
} catch (err) {
  console.error(err);
}
```

### `fsPromises.readFile(path[, options])`

* `path` {string|Buffer|URL|FileHandle} filename သို့မဟုတ် `FileHandle` ပါ
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `null`
  * `flag` {string} See [support of file system `flags`][]. **Default:** `'r'`.
  * `signal` {AbortSignal} လုပ်ဆောင်နေဆဲ (in-progress) readFile တစ်ခုကို abort လုပ်ဖို့ ခွင့်ပြုပါတယ်
  * `buffer` {Buffer|TypedArray|DataView|Function} ဖတ်သွင်းရမယ့် buffer တစ်ခု သို့မဟုတ် — file size နဲ့အတူ ခေါ်ယူပြီး buffer ကို ပြန်ပေးတဲ့ function တစ်ခုပါ။
* Returns: {Promise} File ရဲ့ contents တွေဖြင့် fulfill ဖြစ်ပါတယ်။

File တစ်ခုရဲ့ contents တွေ တစ်ခုလုံးကို asynchronously ဖတ်ပါတယ်။

Encoding တစ်ခုမှ မသတ်မှတ်ထားဘူးဆိုရင် (`options.encoding` ကို သုံးပြီး) data ကို {Buffer} object တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ မဟုတ်ရင်တော့ data က string တစ်ခု ဖြစ်ပါလိမ့်မယ်။

`options` က string တစ်ခု ဆိုရင် ၎င်းက encoding ကို သတ်မှတ်ပေးပါတယ်။

`buffer` ကို ပေးထားပြီး encoding မသတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ {Buffer} က — ဖတ်လိုက်တဲ့ bytes တွေသာ ပါဝင်တဲ့ — ပေးထားတဲ့ buffer အပေါ်က view တစ်ခု ဖြစ်ပါတယ်။ ပေးထားတဲ့ buffer က file တစ်ခုလုံး ထည့်သွင်းဖို့ သေးလွန်းရင် promise ကို reject လုပ်ပါလိမ့်မယ်။

`path` က directory တစ်ခု ဆိုရင် `fsPromises.readFile()` ရဲ့ အပြုအမူက platform အလိုက် ကွဲပြားပါတယ်။ macOS, Linux နဲ့ Windows တွေမှာ promise ကို error တစ်ခုနဲ့ reject လုပ်ပါတယ်။ FreeBSD မှာတော့ directory ရဲ့ contents တွေရဲ့ ကိုယ်စားပြုမှု (representation) တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

လည်ပတ်နေတဲ့ code ရဲ့ directory ထဲမှာ ရှိတဲ့ `package.json` file တစ်ခုကို ဖတ်တဲ့ ဥပမာ:

```mjs
import { readFile } from 'node:fs/promises';
try {
  const filePath = new URL('./package.json', import.meta.url);
  const contents = await readFile(filePath, { encoding: 'utf8' });
  console.log(contents);
} catch (err) {
  console.error(err.message);
}
```

```cjs
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
async function logFile() {
  try {
    const filePath = resolve('./package.json');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
logFile();
```

{AbortSignal} တစ်ခုကို သုံးပြီး လုပ်ဆောင်နေတဲ့ `readFile` တစ်ခုကို abort လုပ်နိုင်ပါတယ်။ Request တစ်ခုကို abort လုပ်လိုက်ရင် ပြန်ပေးလိုက်တဲ့ promise ကို `AbortError` တစ်ခုနဲ့ reject လုပ်ပါတယ်:

```mjs
import { readFile } from 'node:fs/promises';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const promise = readFile(fileName, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```

လုပ်ဆောင်နေဆဲ request တစ်ခုကို abort လုပ်တာက operating system requests တစ်ခုချင်းစီကို abort လုပ်တာ မဟုတ်ပဲ — `fs.readFile` က လုပ်ဆောင်တဲ့ internal buffering ကိုသာ abort လုပ်ပါတယ်။

သတ်မှတ်ပေးထားတဲ့ {FileHandle} တိုင်းက reading ကို support လုပ်ရပါမယ်။

Pre-allocated (ကြိုတင် နေရာချထားတဲ့) buffer တစ်ခုနဲ့ `buffer` option ကို သုံးတဲ့ ဥပမာ:

```mjs
import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';

const buf = Buffer.alloc(16384);
const contents = await readFile('/path/to/file', { buffer: buf });
console.log(contents); // A view over `buf` containing only the bytes read
```

Buffer တစ်ခုကို ပြန်ပေးတဲ့ function တစ်ခုနဲ့ `buffer` option ကို သုံးတဲ့ ဥပမာ:

```mjs
import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';

const contents = await readFile('/path/to/file', {
  buffer: (size) => Buffer.alloc(size),
});
console.log(contents);
```

### `fsPromises.readlink(path[, options])`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* Returns: {Promise} အောင်မြင်တဲ့အခါ `linkString` ဖြင့် fulfill ဖြစ်ပါတယ်။

`path` က ရည်ညွှန်းတဲ့ symbolic link ရဲ့ contents တွေကို ဖတ်ပါတယ်။ အသေးစိတ်အတွက် POSIX readlink(2) documentation ကို ကြည့်ပါ။ အောင်မြင်တဲ့အခါ promise ကို `linkString` ဖြင့် fulfill လုပ်ပါတယ်။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — ပြန်ပေးလိုက်တဲ့ link path အတွက် သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `encoding` ကို `'buffer'` အဖြစ် သတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ link path ကို {Buffer} object တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပါလိမ့်မယ်။

### `fsPromises.realpath(path[, options])`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* Returns: {Promise} အောင်မြင်တဲ့အခါ resolve လုပ်ပြီးသား path ဖြင့် fulfill ဖြစ်ပါတယ်။

`fs.realpath.native()` function နဲ့ တူညီတဲ့ semantics (အဓိပ္ပာယ်သတ်မှတ်ချက်များ) ကို သုံးပြီး `path` ရဲ့ တကယ့် (actual) တည်နေရာကို ဆုံးဖြတ်ပါတယ်။

UTF8 strings အဖြစ် ပြောင်းလဲလို့ရတဲ့ paths တွေကိုသာ support လုပ်ပါတယ်။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — path အတွက် သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `encoding` ကို `'buffer'` အဖြစ် သတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ path ကို {Buffer} object တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပါလိမ့်မယ်။

Linux မှာ Node.js ကို musl libc နဲ့ ချိတ်ဆက်ထားတဲ့အခါ ဒီ function အလုပ်လုပ်ဖို့ procfs file system ကို `/proc` မှာ mount လုပ်ထားရပါမယ်။ Glibc မှာတော့ ဒီကန့်သတ်ချက် မရှိပါဘူး။

### `fsPromises.rename(oldPath, newPath)`

* `oldPath` {string|Buffer|URL}
* `newPath` {string|Buffer|URL}
* Returns: {Promise} အောင်မြင်တဲ့အခါ `undefined` ဖြင့် fulfill ဖြစ်ပါတယ်။

`oldPath` ကို `newPath` အဖြစ် နာမည်ပြောင်းပေးပါတယ်။

### `fsPromises.rmdir(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object} လက်ရှိမှာ ထုတ်ဖော်ထားတဲ့ (exposed) options တွေ မရှိပါဘူး။ အရင်တုန်းက
  `recursive`, `maxBusyTries` နဲ့ `emfileWait` အတွက် options တွေ ရှိခဲ့ပေမယ့် ၎င်းတို့ကို
  deprecated လုပ်ပြီး ဖယ်ရှားလိုက်ပါတယ်။ `options` argument ကို backwards compatibility (နောက်ပြန် လိုက်ဖက်ညီမှု)
  အတွက် လက်ခံဆဲ ဖြစ်ပေမယ့် အသုံးမပြုပါဘူး။
* Returns: {Promise} အောင်မြင်တဲ့အခါ `undefined` ဖြင့် fulfill ဖြစ်ပါတယ်။

`path` နဲ့ ခွဲခြားဖော်ပြတဲ့ directory ကို ဖယ်ရှားပါတယ်။

`fsPromises.rmdir()` ကို (directory မဟုတ်တဲ့) file တစ်ခုပေါ်မှာ သုံးလိုက်ရင် Windows မှာ `ENOENT` error နဲ့ POSIX မှာ `ENOTDIR` error နဲ့ promise ကို reject လုပ်ပါတယ်။

Unix ရဲ့ `rm -rf` command နဲ့ ဆင်တူတဲ့ အပြုအမူကို ရဖို့အတွက် options `{ recursive: true, force: true }` တွေနဲ့အတူ [`fsPromises.rm()`][] ကို သုံးပါ။

### `fsPromises.rm(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `force` {boolean} `true` ဆိုရင် `path` မရှိဘူးဆိုရင် exceptions တွေကို လျစ်လျူရှုပါလိမ့်မယ်။ **Default:** `false`.
  * `maxRetries` {integer} `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` သို့မဟုတ် `EPERM` error တစ်ခုခု ကြုံတွေ့ရရင် Node.js က — အကြိမ်တိုင်းမှာ `retryDelay` milliseconds ပိုရှည်တဲ့ linear backoff wait (အဆင့်လိုက် နောက်ဆုတ် စောင့်ဆိုင်းမှု) နဲ့အတူ — operation ကို ပြန်ကြိုးစားပါလိမ့်မယ်။ ဒီ option က retries အရေအတွက်ကို ကိုယ်စားပြုပါတယ်။ `recursive` option က `true` မဟုတ်ဘူးဆိုရင် ဒီ option ကို လျစ်လျူရှုပါတယ်။ **Default:** `0`.
  * `recursive` {boolean} `true` ဆိုရင် directory ကို recursively ဖယ်ရှားပါတယ်။ Recursive mode မှာ operations တွေကို မအောင်မြင်ရင် ပြန်ကြိုးစားပါတယ်။ **Default:** `false`.
  * `retryDelay` {integer} Retries တွေကြားမှာ စောင့်ဆိုင်းရမယ့် အချိန်ပမာဏကို milliseconds နဲ့ ဖော်ပြပါတယ်။ `recursive` option က `true` မဟုတ်ဘူးဆိုရင် ဒီ option ကို လျစ်လျူရှုပါတယ်။ **Default:** `100`.
* Returns: {Promise} အောင်မြင်တဲ့အခါ `undefined` ဖြင့် fulfill ဖြစ်ပါတယ်။

Files နဲ့ directories တွေကို ဖယ်ရှားပါတယ် (standard POSIX `rm` utility ကို စံပြုထားပါတယ်)။

### `fsPromises.stat(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.Stats} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
  * `throwIfNoEntry` {boolean} `undefined` ကို ပြန်ပေးမယ့်အစား — file system entry တစ်ခုမှ မရှိဘူးဆိုရင် exception တစ်ခုကို throw လုပ်မလားဆိုတာပါ။ **Default:** `true`.
  * `signal` {AbortSignal} Operation ကို ပယ်ဖျက်ဖို့ AbortSignal တစ်ခုပါ။ **Default:** `undefined`.
* Returns: {Promise} ပေးထားတဲ့ `path` အတွက် {fs.Stats} object ဖြင့် fulfill ဖြစ်ပါတယ်။

### `fsPromises.statfs(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.StatFs} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
* Returns: {Promise} ပေးထားတဲ့ `path` အတွက် {fs.StatFs} object ဖြင့် fulfill ဖြစ်ပါတယ်။

### `fsPromises.symlink(target, path[, type])`

* `target` {string|Buffer|URL}
* `path` {string|Buffer|URL}
* `type` {string|null} **Default:** `null`
* Returns: {Promise} အောင်မြင်တဲ့အခါ `undefined` ဖြင့် fulfill ဖြစ်ပါတယ်။

Symbolic link တစ်ခုကို ဖန်တီးပါတယ်။

`type` argument ကို Windows platforms တွေမှာသာ သုံးပြီး — `'dir'`, `'file'` သို့မဟုတ် `'junction'` တွေထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်။ `type` argument က `null` ဆိုရင် Node.js က `target` ရဲ့ type ကို အလိုအလျောက် စစ်ဆေးပြီး `'file'` သို့မဟုတ် `'dir'` ကို သုံးပါလိမ့်မယ်။ `target` က မရှိဘူးဆိုရင် `'file'` ကို သုံးပါလိမ့်မယ်။ Windows junction points တွေက destination path ကို absolute ဖြစ်ဖို့ လိုအပ်ပါတယ်။ `'junction'` ကို သုံးတဲ့အခါ `target` argument ကို absolute path အဖြစ် အလိုအလျောက် normalize လုပ်ပေးပါလိမ့်မယ်။ NTFS volumes တွေပေါ်က Junction points တွေက directories တွေကိုသာ ညွှန်ပြနိုင်ပါတယ်။

### `fsPromises.truncate(path[, len])`

* `path` {string|Buffer|URL}
* `len` {integer} **Default:** `0`
* Returns: {Promise} အောင်မြင်တဲ့အခါ `undefined` ဖြင့် fulfill ဖြစ်ပါတယ်။

`path` မှာရှိတဲ့ content ရဲ့ အရှည်ကို — တိုစေခြင်း သို့မဟုတ် ရှည်စေခြင်းအားဖြင့် — `len` bytes အဖြစ် ဖြတ်တောက် (truncate) ပါတယ်။

### `fsPromises.unlink(path)`

* `path` {string|Buffer|URL}
* Returns: {Promise} အောင်မြင်တဲ့အခါ `undefined` ဖြင့် fulfill ဖြစ်ပါတယ်။

`path` က symbolic link တစ်ခုကို ရည်ညွှန်းနေရင် — ဒီ link က ညွှန်ပြနေတဲ့ file သို့မဟုတ် directory ကို မထိခိုက်ပဲ — link ကိုသာ ဖယ်ရှားပါတယ်။ `path` က symbolic link မဟုတ်တဲ့ file path တစ်ခုကို ရည်ညွှန်းနေရင်တော့ file ကို ဖျက်ပစ်ပါတယ်။ အသေးစိတ်အတွက် POSIX unlink(2) documentation ကို ကြည့်ပါ။

### `fsPromises.utimes(path, atime, mtime)`

* `path` {string|Buffer|URL}
* `atime` {number|string|Date}
* `mtime` {number|string|Date}
* Returns: {Promise} အောင်မြင်တဲ့အခါ `undefined` ဖြင့် fulfill ဖြစ်ပါတယ်။

`path` က ရည်ညွှန်းတဲ့ object ရဲ့ file system timestamps တွေကို ပြောင်းလဲပါတယ်။

`atime` နဲ့ `mtime` arguments တွေက အောက်ပါ စည်းမျဉ်းတွေကို လိုက်နာပါတယ်:

* တန်ဖိုးတွေက Unix epoch time ကို ကိုယ်စားပြုတဲ့ numbers တွေ, `Date`s တွေ သို့မဟုတ် `'123456789.0'` လိုမျိုး numeric string တစ်ခု ဖြစ်နိုင်ပါတယ်။
* တန်ဖိုးကို number အဖြစ် ပြောင်းလဲလို့မရရင် သို့မဟုတ် — `NaN`, `Infinity` သို့မဟုတ် `-Infinity` ဖြစ်နေရင် — `Error` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### `fsPromises.watch(filename[, options])`

* `filename` {string|Buffer|URL}
* `options` {string|Object}
  * `persistent` {boolean} Files တွေကို watch လုပ်နေသရွေ့ process က ဆက်လည်ပတ်နေသင့်လားဆိုတာကို ဖော်ပြပါတယ်။ **Default:** `true`.
  * `recursive` {boolean} Subdirectories တွေ အားလုံးကို watch လုပ်သင့်လား သို့မဟုတ် လက်ရှိ directory တစ်ခုတည်းကိုသာ watch လုပ်သင့်လားဆိုတာကို ဖော်ပြပါတယ်။ ဒါက directory တစ်ခုကို သတ်မှတ်လိုက်တဲ့အခါ — support လုပ်တဲ့ platforms တွေပေါ်မှာသာ — သက်ရောက်ပါတယ် ([caveats][] ကို ကြည့်ပါ)။ **Default:**
    `false`.
  * `encoding` {string} Listener ဆီကို ဖြတ်သန်းပေးတဲ့ filename အတွက် သုံးမယ့် character encoding ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `'utf8'`.
  * `signal` {AbortSignal} Watcher ရပ်တန့်သင့်တဲ့အခါ အချက်ပြဖို့ သုံးတဲ့ {AbortSignal} တစ်ခုပါ။
  * `maxQueue` {number} ပြန်ပေးလိုက်တဲ့ {AsyncIterator} ရဲ့ iterations တွေကြားမှာ queue လုပ်ရမယ့် events အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `2048`.
  * `overflow` {string} `maxQueue` ခွင့်ပြုထားတာထက် queue လုပ်ရမယ့် events တွေ ပိုများနေတဲ့အခါ `'ignore'` သို့မဟုတ် `'throw'` ဖြစ်နိုင်ပါတယ်။ `'ignore'` ဆိုတာ overflow events တွေကို ပစ်ချပြီး warning တစ်ခု emit လုပ်တာကို ဆိုလိုပြီး — `'throw'` ကတော့ exception တစ်ခုကို throw လုပ်တာကို ဆိုလိုပါတယ်။ **Default:** `'ignore'`.
  * `ignore` {string|RegExp|Function|Array} လျစ်လျူရှုရမယ့် pattern(များ) ပါ။ Strings တွေက glob patterns ([`minimatch`][] ကို သုံးပြီး) ဖြစ်ပြီး — RegExp patterns တွေကို filename ပေါ်မှာ စမ်းသပ်ပါတယ် — functions တွေကတော့ filename ကို လက်ခံပြီး လျစ်လျူရှုဖို့ `true` ကို ပြန်ပေးပါတယ်။ **Default:** `undefined`.
* Returns: {AsyncIterator} အောက်ပါ properties တွေ ပါဝင်တဲ့ objects တွေကို ပြန်ပေးပါတယ်:
  * `eventType` {string} ပြောင်းလဲမှုရဲ့ အမျိုးအစားပါ
  * `filename` {string|Buffer|null} ပြောင်းလဲသွားတဲ့ file ရဲ့ နာမည်ပါ

`filename` ပေါ်မှာ ပြောင်းလဲမှုတွေကို watch လုပ်ပေးတဲ့ async iterator တစ်ခုကို ပြန်ပေးပါတယ် — `filename` က file တစ်ခု သို့မဟုတ် directory တစ်ခု ဖြစ်နိုင်ပါတယ်။

```js
const { watch } = require('node:fs/promises');

const ac = new AbortController();
const { signal } = ac;
setTimeout(() => ac.abort(), 10000);

(async () => {
  try {
    const watcher = watch(__filename, { signal });
    for await (const event of watcher)
      console.log(event);
  } catch (err) {
    if (err.name === 'AbortError')
      return;
    throw err;
  }
})();
```

Platform အများစုမှာ directory ထဲမှာ filename တစ်ခု ပေါ်လာတိုင်း သို့မဟုတ် ပျောက်ကွယ်သွားတိုင်း `'rename'` ကို emit လုပ်ပါတယ်။

`fs.watch()` အတွက် [caveats][] တွေ အားလုံးက `fsPromises.watch()` မှာလည်း သက်ရောက်ပါတယ်။

### `fsPromises.writeFile(file, data[, options])`

* `file` {string|Buffer|URL|FileHandle} filename သို့မဟုတ် `FileHandle` ပါ
* `data` {string|Buffer|TypedArray|DataView|AsyncIterable|Iterable}
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `'utf8'`
  * `mode` {integer} **Default:** `0o666`
  * `flag` {string} See [support of file system `flags`][]. **Default:** `'w'`.
  * `flush` {boolean} Data တွေ အားလုံးကို file ထဲကို အောင်မြင်စွာ ရေးသားပြီးတဲ့အခါ — `flush` က `true` ဆိုရင် — data တွေကို flush လုပ်ဖို့ `filehandle.sync()` ကို သုံးပါတယ်။ **Default:** `false`.
  * `signal` {AbortSignal} လုပ်ဆောင်နေဆဲ writeFile တစ်ခုကို abort လုပ်ဖို့ ခွင့်ပြုပါတယ်
* Returns: {Promise} အောင်မြင်တဲ့အခါ `undefined` ဖြင့် fulfill ဖြစ်ပါတယ်။

Data တွေကို file တစ်ခုထဲကို asynchronously ရေးသားပြီး — file က ရှိပြီးသားဆိုရင် အစားထိုးပါတယ်။ `data` က string, buffer, {AsyncIterable} သို့မဟုတ် {Iterable} object တစ်ခု ဖြစ်နိုင်ပါတယ်။

`data` က buffer တစ်ခုဆိုရင် `encoding` option ကို လျစ်လျူရှုပါတယ်။

`options` က string တစ်ခုဆိုရင် ၎င်းက encoding ကို သတ်မှတ်ပေးပါတယ်။

`mode` option က အသစ်ဖန်တီးလိုက်တဲ့ file ကိုသာ သက်ရောက်မှု ရှိပါတယ်။ အသေးစိတ်ကို [`fs.open()`][] မှာ ကြည့်ပါ။

သတ်မှတ်ပေးထားတဲ့ {FileHandle} တိုင်းက writing ကို support လုပ်ရပါမယ်။

Promise က settle (အဆုံးသတ်) ဖြစ်တာကို မစောင့်ပဲ `fsPromises.writeFile()` ကို file တစ်ခုတည်းပေါ်မှာ အကြိမ်များစွာ သုံးတာက မလုံခြုံပါဘူး။

`fsPromises.readFile` လိုပဲ — `fsPromises.writeFile` က — ၎င်းဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ buffer ကို ရေးသားဖို့ အတွင်းပိုင်းမှာ `write` calls အများအပြားကို လုပ်ဆောင်ပေးတဲ့ convenience method (အဆင်ပြေစေတဲ့ method) တစ်ခုပါ။ Performance အရ အရေးကြီးတဲ့ code တွေအတွက်တော့ [`fs.createWriteStream()`][] သို့မဟုတ် [`filehandle.createWriteStream()`][] ကို သုံးဖို့ စဉ်းစားပါ။

{AbortSignal} တစ်ခုကို သုံးပြီး `fsPromises.writeFile()` တစ်ခုကို ပယ်ဖျက်နိုင်ပါတယ်။ Cancelation (ပယ်ဖျက်ခြင်း) က "best effort" (တတ်နိုင်သမျှ ကြိုးစား) သဘောသာ ဖြစ်ပြီး — data အချို့ပမာဏ ရေးသားပြီး ဖြစ်နေနိုင်ပါသေးတယ်။

```mjs
import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

try {
  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from('Hello Node.js'));
  const promise = writeFile('message.txt', data, { signal });

  // Abort the request before the promise settles.
  controller.abort();

  await promise;
} catch (err) {
  // When a request is aborted - err is an AbortError
  console.error(err);
}
```

လုပ်ဆောင်နေဆဲ request တစ်ခုကို abort လုပ်တာက operating system requests တစ်ခုချင်းစီကို abort လုပ်တာ မဟုတ်ပဲ — `fs.writeFile` က လုပ်ဆောင်တဲ့ internal buffering ကိုသာ abort လုပ်ပါတယ်။

### `fsPromises.constants`

* Type: {Object}

File system operations တွေအတွက် အသုံးများတဲ့ constants တွေ ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ Object က `fs.constants` နဲ့ အတူတူပါ။ အသေးစိတ်ကို [FS constants][] မှာ ကြည့်ပါ။

## Callback API (callback အခြေပြု API)

Callback APIs တွေက operations တွေ အားလုံးကို — event loop ကို မပိတ်ဆို့ပဲ — asynchronously လုပ်ဆောင်ပြီး — ပြီးစီးချိန် သို့မဟုတ် error ဖြစ်ချိန်မှာ callback function တစ်ခုကို ခေါ်ယူပါတယ်။

Callback APIs တွေက file system operations တွေကို event loop thread ရဲ့ အပြင်ဘက်မှာ လုပ်ဆောင်ဖို့ underlying Node.js threadpool ကို သုံးပါတယ်။ ဒီ operations တွေက synchronized လည်း မဟုတ်ပါဘူး — threadsafe လည်း မဟုတ်ပါဘူး။ File တစ်ခုတည်းပေါ်မှာ concurrent modifications (တစ်ပြိုင်နက် ပြုပြင်မှုများ) အများအပြား လုပ်တဲ့အခါ — data corruption (ဒေတာ ပျက်စီးမှု) ဖြစ်နိုင်လို့ — သတိထားရပါမယ်။

### `fs.access(path[, mode], callback)`

* `path` {string|Buffer|URL}
* `mode` {integer} **Default:** `fs.constants.F_OK`
* `callback` {Function}
  * `err` {Error}

`path` နဲ့ သတ်မှတ်ထားတဲ့ file သို့မဟုတ် directory အတွက် user တစ်ယောက်ရဲ့ permissions တွေကို စစ်ဆေးပါတယ်။ `mode` argument က လုပ်ဆောင်ရမယ့် accessibility checks (ဝင်ရောက်နိုင်မှု စစ်ဆေးချက်များ) တွေကို သတ်မှတ်ပေးတဲ့ optional integer တစ်ခုပါ။ `mode` က `fs.constants.F_OK` တန်ဖိုး သို့မဟုတ် — `fs.constants.R_OK`, `fs.constants.W_OK` နဲ့ `fs.constants.X_OK` တွေထဲက တစ်ခုခုရဲ့ bitwise OR နဲ့ ဖွဲ့စည်းထားတဲ့ mask (e.g. `fs.constants.W_OK | fs.constants.R_OK`) — တစ်ခုခု ဖြစ်ရပါမယ်။ `mode` ရဲ့ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေအတွက် [File access constants][] ကို ကြည့်ပါ။

နောက်ဆုံး argument ဖြစ်တဲ့ `callback` က — ဖြစ်နိုင်တဲ့ error argument တစ်ခုနဲ့အတူ ခေါ်ယူခံရတဲ့ callback function တစ်ခုပါ။ Accessibility checks တွေထဲက တစ်ခုခု မအောင်မြင်ခဲ့ရင် error argument က `Error` object တစ်ခု ဖြစ်ပါလိမ့်မယ်။ အောက်က ဥပမာတွေက `package.json` ရှိမရှိ၊ ဖတ်လို့ရလား ရေးလို့ရလားဆိုတာကို စစ်ဆေးပါတယ်။

```mjs
import { access, constants } from 'node:fs';

const file = 'package.json';

// Check if the file exists in the current directory.
access(file, constants.F_OK, (err) => {
  console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
});

// Check if the file is readable.
access(file, constants.R_OK, (err) => {
  console.log(`${file} ${err ? 'is not readable' : 'is readable'}`);
});

// Check if the file is writable.
access(file, constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'is not writable' : 'is writable'}`);
});

// Check if the file is readable and writable.
access(file, constants.R_OK | constants.W_OK, (err) => {
  console.log(`${file} ${err ? 'is not' : 'is'} readable and writable`);
});
```

`fs.open()`, `fs.readFile()` သို့မဟုတ် `fs.writeFile()` တွေကို မခေါ်ခင် file တစ်ခုရဲ့ accessibility ကို စစ်ဆေးဖို့ `fs.access()` ကို မသုံးပါနဲ့။ အဲဒီလို လုပ်တာက race condition (ပြိုင်ဆိုင်မှု အခြေအနေ) တစ်ခုကို ဖြစ်ပေါ်စေပါတယ် — ဘာလို့လဲဆိုတော့ ခေါ်မှု နှစ်ခုကြားမှာ တခြား processes တွေက file ရဲ့ state ကို ပြောင်းလဲပစ်နိုင်လို့ပါ။ အဲဒီအစား user code က file ကို တိုက်ရိုက် open/read/write လုပ်ပြီး — file ကို ဝင်ရောက်လို့ မရရင် ထွက်ပေါ်လာတဲ့ error ကို ကိုင်တွယ်သင့်ပါတယ်။

**write (NOT RECOMMENDED — အကြံပြု မထားပါ)**

```mjs
import { access, open, close } from 'node:fs';

access('myfile', (err) => {
  if (!err) {
    console.error('myfile already exists');
    return;
  }

  open('myfile', 'wx', (err, fd) => {
    if (err) throw err;

    try {
      writeMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```

**write (RECOMMENDED — အကြံပြုထားပါ)**

```mjs
import { open, close } from 'node:fs';

open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```

**read (NOT RECOMMENDED — အကြံပြု မထားပါ)**

```mjs
import { access, open, close } from 'node:fs';
access('myfile', (err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  open('myfile', 'r', (err, fd) => {
    if (err) throw err;

    try {
      readMyData(fd);
    } finally {
      close(fd, (err) => {
        if (err) throw err;
      });
    }
  });
});
```

**read (RECOMMENDED — အကြံပြုထားပါ)**

```mjs
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```

အပေါ်က "not recommended" ဥပမာတွေက accessibility ကို စစ်ဆေးပြီးမှ file ကို သုံးပါတယ်။ "recommended" ဥပမာတွေကတော့ — file ကို တိုက်ရိုက် သုံးပြီး error ရှိရင် ကိုင်တွယ်တာမို့ — ပိုကောင်းပါတယ်။

ယေဘုယျအားဖြင့် — file ကို တိုက်ရိုက် သုံးစွဲမှာ မဟုတ်တဲ့အခါမျိုးမှာသာ — ဥပမာ ၎င်းရဲ့ accessibility က တခြား process တစ်ခုဆီက signal တစ်ခု ဖြစ်နေတဲ့အခါမျိုးမှာသာ — file တစ်ခုရဲ့ accessibility ကို စစ်ဆေးပါ။

Windows မှာ directory တစ်ခုပေါ်က access-control policies (ACLs) တွေက file သို့မဟုတ် directory တစ်ခုဆီကို ဝင်ရောက်မှုကို ကန့်သတ်နိုင်ပါတယ်။ ဒါပေမယ့် `fs.access()` function က ACL ကို မစစ်ဆေးတာမို့ — ACL က user ကို ဖတ်ခြင်း သို့မဟုတ် ရေးသားခြင်းကနေ ကန့်သတ်ထားရင်တောင် — path တစ်ခုကို ဝင်ရောက်လို့ရတယ်လို့ သတင်းပို့နိုင်ပါတယ်။

### `fs.appendFile(path, data[, options], callback)`

* `path` {string|Buffer|URL|number} filename သို့မဟုတ် file descriptor ပါ
* `data` {string|Buffer}
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `'utf8'`
  * `mode` {integer} **Default:** `0o666`
  * `flag` {string} See [support of file system `flags`][]. **Default:** `'a'`.
  * `flush` {boolean} `true` ဆိုရင် — မပိတ်ခင် — underlying file descriptor ကို flush လုပ်ပါတယ်။ **Default:** `false`.
* `callback` {Function}
  * `err` {Error}

Data တွေကို file တစ်ခုထဲကို asynchronously ထည့်ရေး (append) ပြီး — file က မရှိသေးဘူးဆိုရင် ဖန်တီးပေးပါတယ်။ `data` က string တစ်ခု သို့မဟုတ် {Buffer} တစ်ခု ဖြစ်နိုင်ပါတယ်။

`mode` option က အသစ်ဖန်တီးလိုက်တဲ့ file ကိုသာ သက်ရောက်မှု ရှိပါတယ်။ အသေးစိတ်ကို [`fs.open()`][] မှာ ကြည့်ပါ။

```mjs
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', (err) => {
  if (err) throw err;
  console.log('The "data to append" was appended to file!');
});
```

`options` က string တစ်ခုဆိုရင် ၎င်းက encoding ကို သတ်မှတ်ပေးပါတယ်:

```mjs
import { appendFile } from 'node:fs';

appendFile('message.txt', 'data to append', 'utf8', callback);
```

`path` ကို — appending (ထည့်ရေးခြင်း) အတွက် ဖွင့်ထားပြီးသား (`fs.open()` သို့မဟုတ် `fs.openSync()` ကို သုံးပြီး) — numeric file descriptor တစ်ခုအနေနဲ့လည်း သတ်မှတ်နိုင်ပါတယ်။ File descriptor ကို အလိုအလျောက် ပိတ်ပေးမှာ မဟုတ်ပါဘူး။

```mjs
import { open, close, appendFile } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('message.txt', 'a', (err, fd) => {
  if (err) throw err;

  try {
    appendFile(fd, 'data to append', 'utf8', (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```

### `fs.chmod(path, mode, callback)`

* `path` {string|Buffer|URL}
* `mode` {string|integer}
* `callback` {Function}
  * `err` {Error}

File တစ်ခုရဲ့ permissions တွေကို asynchronously ပြောင်းလဲပါတယ်။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

အသေးစိတ်အတွက် POSIX chmod(2) documentation ကို ကြည့်ပါ။

```mjs
import { chmod } from 'node:fs';

chmod('my_file.txt', 0o775, (err) => {
  if (err) throw err;
  console.log('The permissions for file "my_file.txt" have been changed!');
});
```

#### File mode များ (File modes)

`fs.chmod()` နဲ့ `fs.chmodSync()` methods နှစ်ခုလုံးမှာ သုံးတဲ့ `mode` argument က — အောက်ပါ constants တွေရဲ့ logical OR နဲ့ ဖန်တီးထားတဲ့ — numeric bitmask တစ်ခုပါ:

| Constant               | Octal   | Description              |
| ---------------------- | ------- | ------------------------ |
| `fs.constants.S_IRUSR` | `0o400` | Owner က ဖတ်နိုင်သည်     |
| `fs.constants.S_IWUSR` | `0o200` | Owner က ရေးနိုင်သည်     |
| `fs.constants.S_IXUSR` | `0o100` | Owner က execute/search လုပ်နိုင်သည် |
| `fs.constants.S_IRGRP` | `0o40`  | Group က ဖတ်နိုင်သည်     |
| `fs.constants.S_IWGRP` | `0o20`  | Group က ရေးနိုင်သည်     |
| `fs.constants.S_IXGRP` | `0o10`  | Group က execute/search လုပ်နိုင်သည် |
| `fs.constants.S_IROTH` | `0o4`   | အခြားသူများ (others) က ဖတ်နိုင်သည် |
| `fs.constants.S_IWOTH` | `0o2`   | အခြားသူများ (others) က ရေးနိုင်သည် |
| `fs.constants.S_IXOTH` | `0o1`   | အခြားသူများ (others) က execute/search လုပ်နိုင်သည် |

`mode` ကို တည်ဆောက်ဖို့ ပိုလွယ်ကူတဲ့ နည်းလမ်းက octal digits သုံးလုံး ပါတဲ့ sequence တစ်ခုကို သုံးတာပါ (e.g. `765`)။ ဘယ်ဘက်ဆုံး digit (`7` — ဥပမာထဲမှာ) က file owner အတွက် permissions တွေကို သတ်မှတ်ပေးပြီး — အလယ် digit (`6` — ဥပမာထဲမှာ) က group အတွက် permissions တွေကို သတ်မှတ်ပေးပါတယ် — ညာဘက်ဆုံး digit (`5` — ဥပမာထဲမှာ) ကတော့ အခြားသူများ (others) အတွက် permissions တွေကို သတ်မှတ်ပေးပါတယ်။

| Number | Description              |
| ------ | ------------------------ |
| `7`    | ဖတ်, ရေး နဲ့ execute     |
| `6`    | ဖတ် နဲ့ ရေး             |
| `5`    | ဖတ် နဲ့ execute         |
| `4`    | ဖတ်ရုံသာ                |
| `3`    | ရေး နဲ့ execute         |
| `2`    | ရေးရုံသာ                |
| `1`    | execute လုပ်ရုံသာ       |
| `0`    | ခွင့်ပြုချက် မရှိ        |

ဥပမာ — octal တန်ဖိုး `0o765` ဆိုရင်:

* Owner က file ကို ဖတ်, ရေး နဲ့ execute လုပ်နိုင်ပါတယ်။
* Group က file ကို ဖတ် နဲ့ ရေး လုပ်နိုင်ပါတယ်။
* အခြားသူများက file ကို ဖတ် နဲ့ execute လုပ်နိုင်ပါတယ်။

File modes တွေ မျှော်လင့်ထားတဲ့ နေရာတွေမှာ raw numbers တွေကို သုံးတဲ့အခါ — `0o777` ထက် ကြီးတဲ့ တန်ဖိုး ဘယ်ဟာမဆို — တသမတ်တည်း အလုပ်လုပ်ဖို့ support မလုပ်ထားတဲ့ — platform-specific အပြုအမူတွေကို ဖြစ်ပေါ်စေနိုင်ပါတယ်။ ဒါကြောင့် `S_ISVTX`, `S_ISGID` သို့မဟုတ် `S_ISUID` လိုမျိုး constants တွေကို `fs.constants` ထဲမှာ ထုတ်ဖော် (expose) မထားပါဘူး။

Caveats (သတိထားစရာများ): Windows မှာ write permission ကိုသာ ပြောင်းလဲနိုင်ပြီး — group, owner သို့မဟုတ် အခြားသူများရဲ့ permissions တွေကြားက ပိုင်းခြားမှုကို implement မလုပ်ထားပါဘူး။

### `fs.chown(path, uid, gid, callback)`

* `path` {string|Buffer|URL}
* `uid` {integer}
* `gid` {integer}
* `callback` {Function}
  * `err` {Error}

File တစ်ခုရဲ့ owner နဲ့ group ကို asynchronously ပြောင်းလဲပါတယ်။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

အသေးစိတ်အတွက် POSIX chown(2) documentation ကို ကြည့်ပါ။

### `fs.close(fd[, callback])`

* `fd` {integer}
* `callback` {Function}
  * `err` {Error}

File descriptor ကို ပိတ်ပါတယ်။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

တခြား `fs` operation တစ်ခုခုကနေတစ်ဆင့် လက်ရှိ အသုံးပြုနေတဲ့ file descriptor (`fd`) တစ်ခုခုပေါ်မှာ `fs.close()` ကို ခေါ်တာက — undefined အပြုအမူ (undefined behavior) တစ်ခုဆီကို ဦးတည်သွားနိုင်ပါတယ်။

အသေးစိတ်အတွက် POSIX close(2) documentation ကို ကြည့်ပါ။

### `fs.copyFile(src, dest[, mode], callback)`

* `src` {string|Buffer|URL} ကူးယူရမယ့် source filename ပါ
* `dest` {string|Buffer|URL} Copy operation ရဲ့ destination filename ပါ
* `mode` {integer} Copy operation အတွက် modifiers (ပြုပြင်မွမ်းမံမှုများ) ပါ။ **Default:** `0`.
* `callback` {Function}
  * `err` {Error}

`src` ကို `dest` ဆီကို asynchronously ကူးယူပါတယ်။ Default အနေနဲ့ — `dest` က ရှိပြီးသားဆိုရင် — အစားထိုး (overwrite) လုပ်ပါတယ်။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ callback function ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။ Copy operation ရဲ့ atomicity (တစ်စုတစ်ဝိုင်းတည်း ပြီးမြောက်မှု) အကြောင်းကို Node.js က အာမခံချက် မပေးပါဘူး။ Destination file ကို writing အတွက် ဖွင့်ပြီးနောက်မှာ error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — destination ကို ဖယ်ရှားဖို့ Node.js က ကြိုးစားပါလိမ့်မယ်။

Symbolic links တွေကို လိုက်၍ ဖြေရှင်း (follow) ပါတယ်။ `src` က symbolic link တစ်ခုဆိုရင် target file ကို ကူးယူပါတယ်။ `dest` က symbolic link တစ်ခုဆိုရင် — `mode` ထဲမှာ `fs.constants.COPYFILE_EXCL` မပါဝင်သရွေ့ — target file ကို အစားထိုး ရေးသားပါတယ်။

`mode` က copy operation ရဲ့ အပြုအမူကို သတ်မှတ်ပေးတဲ့ optional integer တစ်ခုပါ။ တန်ဖိုး နှစ်ခု သို့မဟုတ် နှစ်ခုထက်ပိုတာတွေရဲ့ bitwise OR နဲ့ ဖွဲ့စည်းထားတဲ့ mask တစ်ခုကို ဖန်တီးနိုင်ပါတယ် (e.g. `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`)။

* `fs.constants.COPYFILE_EXCL`: `dest` က ရှိပြီးသားဆိုရင် copy operation က မအောင်မြင်ပါဘူး။
* `fs.constants.COPYFILE_FICLONE`: Copy operation က copy-on-write reflink (ကူးရေးချိန်မှ ကူးယူသော reflink) တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားပါတယ်။ Platform က copy-on-write ကို support မလုပ်ဘူးဆိုရင် fallback copy mechanism (နောက်ဆုတ် ကူးယူမှု ယန္တရား) တစ်ခုကို သုံးပါတယ်။
* `fs.constants.COPYFILE_FICLONE_FORCE`: Copy operation က copy-on-write reflink တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားပါတယ်။ Platform က copy-on-write ကို support မလုပ်ဘူးဆိုရင် operation က မအောင်မြင်ပါဘူး။

```mjs
import { copyFile, constants } from 'node:fs';

function callback(err) {
  if (err) throw err;
  console.log('source.txt was copied to destination.txt');
}

// destination.txt will be created or overwritten by default.
copyFile('source.txt', 'destination.txt', callback);

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
copyFile('source.txt', 'destination.txt', constants.COPYFILE_EXCL, callback);
```

### `fs.cp(src, dest[, options], callback)`

* `src` {string|URL} ကူးယူရမယ့် source path ပါ
* `dest` {string|URL} ကူးယူရမယ့် destination path ပါ
* `options` {Object}
  * `dereference` {boolean} Symlinks တွေကို dereference (ကိုယ်တိုင် သွားရောက် ဖြေရှင်း) လုပ်ပါတယ်။ **Default:** `false`.
  * `errorOnExist` {boolean} `force` က `false` ဖြစ်ပြီး destination က ရှိနေတဲ့အခါ error တစ်ခုကို throw လုပ်ပါတယ်။ **Default:** `false`.
  * `filter` {Function} Copied files/directories တွေကို filter လုပ်ဖို့ function တစ်ခုပါ။ Item တစ်ခုကို ကူးယူဖို့
    `true` ကို ပြန်ပေးပြီး — လျစ်လျူရှုဖို့ `false` ကို ပြန်ပေးပါတယ်။ Directory တစ်ခုကို လျစ်လျူရှုတဲ့အခါ ၎င်းရဲ့ contents တွေ အားလုံးကိုပါ
    ကျော်သွားပါလိမ့်မယ်။ `true` သို့မဟုတ် `false` နဲ့ fulfill ဖြစ်တဲ့ `Promise` တစ်ခုကိုလည်း
    ပြန်ပေးနိုင်ပါတယ်။ **Default:** `undefined`.
    * `src` {string} ကူးယူရမယ့် source path ပါ
    * `dest` {string} ကူးယူရမယ့် destination path ပါ
    * Returns: {boolean|Promise} {boolean} အဖြစ် ပြောင်းလဲလို့ရတဲ့ (coercible) တန်ဖိုး တစ်ခု သို့မဟုတ် — အဲဒီလို တန်ဖိုးနဲ့ fulfill ဖြစ်တဲ့ — `Promise` တစ်ခုပါ
  * `force` {boolean} ရှိပြီးသား file သို့မဟုတ် directory ကို အစားထိုး ရေးသားပါတယ်။ ဒါကို `false` အဖြစ် သတ်မှတ်ပြီး destination က ရှိနေရင် copy operation က errors တွေကို လျစ်လျူရှုပါလိမ့်မယ်။ ဒီအပြုအမူကို ပြောင်းလဲဖို့ `errorOnExist` option ကို သုံးပါ။ **Default:** `true`.
  * `mode` {integer} Copy operation အတွက် modifiers တွေပါ။ **Default:** `0`. [`fs.copyFile()`][] ရဲ့ `mode` flag ကို ကြည့်ပါ။
  * `preserveTimestamps` {boolean} `true` ဆိုရင် `src` ကနေ timestamps တွေကို ထိန်းသိမ်း (preserve) ထားပါလိမ့်မယ်။ **Default:** `false`.
  * `recursive` {boolean} Directories တွေကို recursively ကူးယူပါတယ် **Default:** `false`
  * `verbatimSymlinks` {boolean} `true` ဆိုရင် symlinks တွေအတွက် path resolution ကို ကျော်လိုက်ပါလိမ့်မယ်။ **Default:** `false`
* `callback` {Function}
  * `err` {Error}

Directory structure တစ်ခုလုံးကို — subdirectories နဲ့ files တွေ အပါအဝင် — `src` ကနေ `dest` ဆီကို asynchronously ကူးယူပါတယ်။

Directory တစ်ခုကို အခြား directory တစ်ခုဆီကို ကူးတဲ့အခါ globs တွေကို support မလုပ်ပဲ — behavior က `cp dir1/ dir2/` နဲ့ ဆင်တူပါတယ်။

### `fs.createReadStream(path[, options])`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `flags` {string} See [support of file system `flags`][]. **Default:**
    `'r'`.
  * `encoding` {string} **Default:** `null`
  * `fd` {integer|FileHandle} **Default:** `null`
  * `mode` {integer} **Default:** `0o666`
  * `autoClose` {boolean} **Default:** `true`
  * `emitClose` {boolean} **Default:** `true`
  * `start` {integer}
  * `end` {integer} **Default:** `Infinity`
  * `highWaterMark` {integer} **Default:** `64 * 1024`
  * `fs` {Object|null} **Default:** `null`
  * `signal` {AbortSignal|null} **Default:** `null`
  * `windowsHandle` {bigint} `fd` အစား ဖတ်ရှုဖို့ သုံးတဲ့ raw Win32 `HANDLE` တန်ဖိုးပါ။ Windows မှာသာ ရပါတယ်။ **Default:** `null`
* Returns: {fs.ReadStream}

`options` ထဲမှာ `start` နဲ့ `end` တန်ဖိုးတွေ ပါဝင်နိုင်ပြီး — file တစ်ခုလုံးအစား file ကနေ bytes အပိုင်းအခြားတစ်ခုကို ဖတ်ဖို့ သုံးပါတယ်။ `start` ရော `end` ပါ inclusive (အစွန်းနှစ်ဖက် ပါဝင်) ဖြစ်ပြီး 0 ကနေ စရေတွက်ပါတယ် — ခွင့်ပြုထားတဲ့ တန်ဖိုးတွေက \[0, [`Number.MAX_SAFE_INTEGER`][]] range အတွင်းမှာ ရှိပါတယ်။ `fd` ကို သတ်မှတ်ထားပြီး `start` ကို ချန်လှပ်ထားတာ သို့မဟုတ် `undefined` ဖြစ်နေရင် `fs.createReadStream()` က လက်ရှိ file position ကနေ အစဉ်လိုက် (sequentially) ဖတ်ပါတယ်။ `encoding` က {Buffer} က လက်ခံတဲ့ encoding တစ်ခုခု ဖြစ်နိုင်ပါတယ်။

`fd` ကို သတ်မှတ်ထားရင် `ReadStream` က `path` argument ကို လျစ်လျူရှုပြီး သတ်မှတ်ထားတဲ့ file descriptor ကို သုံးပါလိမ့်မယ်။ ဆိုလိုတာက `'open'` event ကို emit လုပ်မှာ မဟုတ်ပါဘူး။ `fd` က blocking ဖြစ်သင့်ပြီး — non-blocking `fd` တွေကိုတော့ {net.Socket} ဆီကို ဖြတ်သန်းပေးသင့်ပါတယ်။

`fd` က blocking reads တွေကိုသာ support လုပ်တဲ့ character device တစ်ခု (ဥပမာ — keyboard သို့မဟုတ် sound card) ကို ညွှန်ပြနေရင် data ရနိုင်တဲ့အထိ read operations တွေ ပြီးဆုံးမှာ မဟုတ်ပါဘူး။ ဒါက process က ထွက်မသွားနိုင်အောင်နဲ့ stream က သဘာဝအတိုင်း မပိတ်နိုင်အောင် တားဆီးနိုင်ပါတယ်။

Windows မှာ `fd` ထဲကို ဖြတ်သန်းပေးလိုက်တဲ့ တန်ဖိုးကို CRT file descriptor တစ်ခုအနေနဲ့ အဓိပ္ပာယ်ကောက်ပါတယ်။ အဲဒီအစား — တခြား process တစ်ခုကနေ ရရှိတဲ့ အမွေဆက်ခံ (inherited) anonymous pipe handle တစ်ခုလိုမျိုး — raw Win32 `HANDLE` တစ်ခုကို သုံးချင်ရင် ၎င်းကို `windowsHandle` အဖြစ် ဖြတ်သန်းပေးပါ။ Handle ကို stream က ပိုင်ဆိုင်ပြီး ပိတ်ပေးတဲ့ file descriptor တစ်ခုအတွင်းမှာ wrap လုပ်ပါတယ်။ `windowsHandle` option က Windows မဟုတ်တဲ့ platforms တွေမှာ throw လုပ်ပြီး — `fs` option နဲ့ ပေါင်းစပ် သုံးလို့ မရပါဘူး။

Default အနေနဲ့ stream က destroy လုပ်ခံရပြီးနောက်မှာ `'close'` event တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။ ဒီအပြုအမူကို ပြောင်းလဲဖို့ `emitClose` option ကို `false` အဖြစ် သတ်မှတ်ပါ။

`fs` option ကို ပေးခြင်းအားဖြင့် `open`, `read` နဲ့ `close` တို့အတွက် သက်ဆိုင်ရာ `fs` implementations တွေကို override လုပ်နိုင်ပါတယ်။ `fs` option ကို ပေးတဲ့အခါ `read` အတွက် override တစ်ခု လိုအပ်ပါတယ်။ `fd` ကို မပေးထားဘူးဆိုရင် `open` အတွက် override တစ်ခုလည်း လိုအပ်ပါတယ်။ `autoClose` က `true` ဆိုရင် `close` အတွက် override တစ်ခုလည်း လိုအပ်ပါတယ်။

```mjs
import { createReadStream } from 'node:fs';

// Create a stream from some character device.
const stream = createReadStream('/dev/input/event0');
setTimeout(() => {
  stream.close(); // This may not close the stream.
  // Artificially marking end-of-stream, as if the underlying resource had
  // indicated end-of-file by itself, allows the stream to close.
  // This does not cancel pending read operations, and if there is such an
  // operation, the process may still not be able to exit successfully
  // until it finishes.
  stream.push(null);
  stream.read(0);
}, 100);
```

`autoClose` က false ဆိုရင် — error တစ်ခု ရှိနေရင်တောင် — file descriptor ကို ပိတ်မှာ မဟုတ်ပါဘူး။ ၎င်းကို ပိတ်ပြီး file descriptor leak (ပေါက်ကြားမှု) မရှိအောင် သေချာစေဖို့ဆိုတာ application ရဲ့ တာဝန်ပါ။ `autoClose` ကို `true` (default အပြုအမူ) အဖြစ် သတ်မှတ်ထားရင် `'error'` သို့မဟုတ် `'end'` ဖြစ်တဲ့အခါ file descriptor ကို အလိုအလျောက် ပိတ်ပါလိမ့်မယ်။

`mode` က file mode (permission နဲ့ sticky bits) တွေကို သတ်မှတ်ပေးပေမယ့် — file ကို ဖန်တီးလိုက်တဲ့အခါမှသာ သက်ရောက်ပါတယ်။

အရှည် bytes 100 ရှိတဲ့ file တစ်ခုရဲ့ နောက်ဆုံး bytes 10 ကို ဖတ်တဲ့ ဥပမာ:

```mjs
import { createReadStream } from 'node:fs';

createReadStream('sample.txt', { start: 90, end: 99 });
```

`options` က string တစ်ခုဆိုရင် ၎င်းက encoding ကို သတ်မှတ်ပေးပါတယ်။

### `fs.createWriteStream(path[, options])`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `flags` {string} See [support of file system `flags`][]. **Default:**
    `'w'`.
  * `encoding` {string} **Default:** `'utf8'`
  * `fd` {integer|FileHandle} **Default:** `null`
  * `mode` {integer} **Default:** `0o666`
  * `autoClose` {boolean} **Default:** `true`
  * `emitClose` {boolean} **Default:** `true`
  * `start` {integer}
  * `fs` {Object|null} **Default:** `null`
  * `signal` {AbortSignal|null} **Default:** `null`
  * `highWaterMark` {number} **Default:** See
    [`stream.getDefaultHighWaterMark()`][].
  * `flush` {boolean} `true` ဆိုရင် — မပိတ်ခင် — underlying file descriptor ကို flush လုပ်ပါတယ်။ **Default:** `false`.
  * `windowsHandle` {bigint} `fd` အစား ရေးသားဖို့ သုံးတဲ့ raw Win32 `HANDLE` တန်ဖိုးပါ။ Windows မှာသာ ရပါတယ်။ **Default:** `null`
* Returns: {fs.WriteStream}

`options` ထဲမှာ `start` option တစ်ခုလည်း ပါဝင်နိုင်ပြီး — file ရဲ့ အစကနေ ကျော်လွန်တဲ့ နေရာတစ်ခုမှာ data တွေကို ရေးသားနိုင်စေပါတယ် — ခွင့်ပြုထားတဲ့ တန်ဖိုးတွေက \[0, [`Number.MAX_SAFE_INTEGER`][]] range အတွင်းမှာ ရှိပါတယ်။ File တစ်ခုကို အစားထိုးမယ့်အစား ပြုပြင်မွမ်းမံတာက `flags` option ကို default `w` အစား `r+` အဖြစ် သတ်မှတ်ဖို့ လိုအပ်စေနိုင်ပါတယ်။ `encoding` က {Buffer} က လက်ခံတဲ့ encoding တစ်ခုခု ဖြစ်နိုင်ပါတယ်။

`autoClose` ကို `true` (default အပြုအမူ) အဖြစ် သတ်မှတ်ထားရင် `'error'` သို့မဟုတ် `'finish'` ဖြစ်တဲ့အခါ file descriptor ကို အလိုအလျောက် ပိတ်ပါလိမ့်မယ်။ `autoClose` က false ဆိုရင် — error တစ်ခု ရှိနေရင်တောင် — file descriptor ကို ပိတ်မှာ မဟုတ်ပါဘူး။ ၎င်းကို ပိတ်ပြီး file descriptor leak မရှိအောင် သေချာစေဖို့ဆိုတာ application ရဲ့ တာဝန်ပါ။

Windows မှာ `fd` ထဲကို ဖြတ်သန်းပေးလိုက်တဲ့ တန်ဖိုးကို CRT file descriptor တစ်ခုအနေနဲ့ အဓိပ္ပာယ်ကောက်ပါတယ်။ အဲဒီအစား — တခြား process တစ်ခုကနေ ရရှိတဲ့ အမွေဆက်ခံ anonymous pipe handle တစ်ခုလိုမျိုး — raw Win32 `HANDLE` တစ်ခုကို သုံးချင်ရင် ၎င်းကို `windowsHandle` အဖြစ် ဖြတ်သန်းပေးပါ။ Handle ကို stream က ပိုင်ဆိုင်ပြီး ပိတ်ပေးတဲ့ file descriptor တစ်ခုအတွင်းမှာ wrap လုပ်ပါတယ်။ `windowsHandle` option က Windows မဟုတ်တဲ့ platforms တွေမှာ throw လုပ်ပြီး — `fs` option နဲ့ ပေါင်းစပ် သုံးလို့ မရပါဘူး။

Default အနေနဲ့ stream က destroy လုပ်ခံရပြီးနောက်မှာ `'close'` event တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။ ဒီအပြုအမူကို ပြောင်းလဲဖို့ `emitClose` option ကို `false` အဖြစ် သတ်မှတ်ပါ။

`fs` option ကို ပေးခြင်းအားဖြင့် `open`, `write`, `writev` နဲ့ `close` တို့အတွက် သက်ဆိုင်ရာ `fs` implementations တွေကို override လုပ်နိုင်ပါတယ်။ `writev()` မပါပဲ `write()` ကို override လုပ်တာက — optimizations တစ်ချို့ (`_writev()`) disabled ဖြစ်သွားလို့ — performance ကို ကျဆင်းစေနိုင်ပါတယ်။ `fs` option ကို ပေးတဲ့အခါ `write` နဲ့ `writev` ထဲက အနည်းဆုံး တစ်ခုအတွက် overrides တွေ လိုအပ်ပါတယ်။ `fd` option ကို မပေးထားဘူးဆိုရင် `open` အတွက် override တစ်ခုလည်း လိုအပ်ပါတယ်။ `autoClose` က `true` ဆိုရင် `close` အတွက် override တစ်ခုလည်း လိုအပ်ပါတယ်။

{fs.ReadStream} လိုပဲ — `fd` ကို သတ်မှတ်ထားရင် {fs.WriteStream} က `path` argument ကို လျစ်လျူရှုပြီး သတ်မှတ်ထားတဲ့ file descriptor ကို သုံးပါလိမ့်မယ်။ ဆိုလိုတာက `'open'` event ကို emit လုပ်မှာ မဟုတ်ပါဘူး။ `fd` က blocking ဖြစ်သင့်ပြီး — non-blocking `fd` တွေကိုတော့ {net.Socket} ဆီကို ဖြတ်သန်းပေးသင့်ပါတယ်။

`options` က string တစ်ခုဆိုရင် ၎င်းက encoding ကို သတ်မှတ်ပေးပါတယ်။

### `fs.exists(path, callback)`

> Stability: 0 - Deprecated: Use [`fs.stat()`][] or [`fs.access()`][] instead.

* `path` {string|Buffer|URL}
* `callback` {Function}
  * `exists` {boolean}

File system ကို စစ်ဆေးပြီး ပေးထားတဲ့ `path` မှာ element တစ်ခု ရှိမရှိကို စမ်းသပ်ပါတယ်။ ပြီးရင် `callback` argument ကို true သို့မဟုတ် false တန်ဖိုးတစ်ခုခုနဲ့ ခေါ်ပါတယ်:

```mjs
import { exists } from 'node:fs';

exists('/etc/passwd', (e) => {
  console.log(e ? 'it exists' : 'no passwd!');
});
```

**ဒီ callback ရဲ့ parameters တွေက တခြား Node.js callbacks တွေနဲ့ ညီညွတ်မှု မရှိပါဘူး။** ပုံမှန်အားဖြင့် Node.js callback တစ်ခုရဲ့ ပထမဆုံး parameter က `err` parameter ဖြစ်ပြီး — optional အနေနဲ့ တခြား parameters တွေ နောက်ကလိုက်ပါတယ်။ `fs.exists()` callback မှာတော့ boolean parameter တစ်ခုတည်းသာ ရှိပါတယ်။ ဒါက `fs.exists()` အစား `fs.access()` ကို အကြံပြုရတဲ့ အကြောင်းရင်း တစ်ခုပါ။

`path` က symbolic link တစ်ခုဆိုရင် ၎င်းကို လိုက်၍ ဖြေရှင်းပါတယ်။ ဒါကြောင့် `path` က ရှိနေပေမယ့် မရှိတဲ့ element တစ်ခုကို ညွှန်ပြနေရင် callback က `false` တန်ဖိုးကို လက်ခံရရှိပါလိမ့်မယ်။

`fs.open()`, `fs.readFile()` သို့မဟုတ် `fs.writeFile()` တွေကို မခေါ်ခင် file တစ်ခု ရှိမရှိ စစ်ဆေးဖို့ `fs.exists()` ကို သုံးတာကို အကြံပြုမထားပါဘူး။ အဲဒီလို လုပ်တာက race condition တစ်ခုကို ဖြစ်ပေါ်စေပါတယ် — ဘာလို့လဲဆိုတော့ ခေါ်မှု နှစ်ခုကြားမှာ တခြား processes တွေက file ရဲ့ state ကို ပြောင်းလဲပစ်နိုင်လို့ပါ။ အဲဒီအစား user code က file ကို တိုက်ရိုက် open/read/write လုပ်ပြီး — file မရှိဘူးဆိုရင် ထွက်ပေါ်လာတဲ့ error ကို ကိုင်တွယ်သင့်ပါတယ်။

**write (NOT RECOMMENDED — အကြံပြု မထားပါ)**

```mjs
import { exists, open, close } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    console.error('myfile already exists');
  } else {
    open('myfile', 'wx', (err, fd) => {
      if (err) throw err;

      try {
        writeMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});
```

**write (RECOMMENDED — အကြံပြုထားပါ)**

```mjs
import { open, close } from 'node:fs';
open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }

    throw err;
  }

  try {
    writeMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```

**read (NOT RECOMMENDED — အကြံပြု မထားပါ)**

```mjs
import { open, close, exists } from 'node:fs';

exists('myfile', (e) => {
  if (e) {
    open('myfile', 'r', (err, fd) => {
      if (err) throw err;

      try {
        readMyData(fd);
      } finally {
        close(fd, (err) => {
          if (err) throw err;
        });
      }
    });
  } else {
    console.error('myfile does not exist');
  }
});
```

**read (RECOMMENDED — အကြံပြုထားပါ)**

```mjs
import { open, close } from 'node:fs';

open('myfile', 'r', (err, fd) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('myfile does not exist');
      return;
    }

    throw err;
  }

  try {
    readMyData(fd);
  } finally {
    close(fd, (err) => {
      if (err) throw err;
    });
  }
});
```

အပေါ်က "not recommended" ဥပမာတွေက ရှိမရှိကို စစ်ဆေးပြီးမှ file ကို သုံးပါတယ်။ "recommended" ဥပမာတွေကတော့ — file ကို တိုက်ရိုက် သုံးပြီး error ရှိရင် ကိုင်တွယ်တာမို့ — ပိုကောင်းပါတယ်။

ယေဘုယျအားဖြင့် — file ကို တိုက်ရိုက် သုံးစွဲမှာ မဟုတ်တဲ့အခါမျိုးမှာသာ — ဥပမာ ၎င်းရဲ့ တည်ရှိမှုက တခြား process တစ်ခုဆီက signal တစ်ခု ဖြစ်နေတဲ့အခါမျိုးမှာသာ — file တစ်ခုရဲ့ တည်ရှိမှုကို စစ်ဆေးပါ။

### `fs.fchmod(fd, mode, callback)`

* `fd` {integer}
* `mode` {string|integer}
* `callback` {Function}
  * `err` {Error}

File ပေါ်မှာ permissions တွေကို သတ်မှတ်ပါတယ်။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

အသေးစိတ်အတွက် POSIX fchmod(2) documentation ကို ကြည့်ပါ။

### `fs.fchown(fd, uid, gid, callback)`

* `fd` {integer}
* `uid` {integer}
* `gid` {integer}
* `callback` {Function}
  * `err` {Error}

File ရဲ့ owner ကို သတ်မှတ်ပါတယ်။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

အသေးစိတ်အတွက် POSIX fchown(2) documentation ကို ကြည့်ပါ။

### `fs.fdatasync(fd, callback)`

* `fd` {integer}
* `callback` {Function}
  * `err` {Error}

File နဲ့ ဆက်စပ်နေတဲ့ — လက်ရှိ queue လုပ်ထားတဲ့ — I/O operations တွေ အားလုံးကို operating system ရဲ့ synchronized I/O completion state ဆီကို တွန်းပို့ (force) ပါတယ်။ အသေးစိတ်အတွက် POSIX fdatasync(2) documentation ကို ရည်ညွှန်းပါ။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

### `fs.fstat(fd[, options], callback)`

* `fd` {integer}
* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.Stats} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
  * `signal` {AbortSignal} Operation ကို ပယ်ဖျက်ဖို့ AbortSignal တစ်ခုပါ။ **Default:** `undefined`.
* `callback` {Function}
  * `err` {Error}
  * `stats` {fs.Stats}

File descriptor အတွက် {fs.Stats} နဲ့အတူ callback ကို ခေါ်ယူပါတယ်။

အသေးစိတ်အတွက် POSIX fstat(2) documentation ကို ကြည့်ပါ။

### `fs.fsync(fd, callback)`

* `fd` {integer}
* `callback` {Function}
  * `err` {Error}

ဖွင့်ထားတဲ့ file descriptor အတွက် data တွေ အားလုံးကို storage device ဆီကို flush လုပ်ဖို့ တောင်းဆိုပါတယ်။ တိကျတဲ့ implementation က operating system နဲ့ device အလိုက် သီးသန့် ဖြစ်ပါတယ်။ အသေးစိတ်အတွက် POSIX fsync(2) documentation ကို ရည်ညွှန်းပါ။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

### `fs.ftruncate(fd[, len], callback)`

* `fd` {integer}
* `len` {integer} **Default:** `0`
* `callback` {Function}
  * `err` {Error}

File descriptor ကို ဖြတ်တောက် (truncate) ပါတယ်။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

အသေးစိတ်အတွက် POSIX ftruncate(2) documentation ကို ကြည့်ပါ။

File descriptor က ရည်ညွှန်းတဲ့ file က `len` bytes ထက် ကြီးနေခဲ့ရင် ပထမ `len` bytes တွေကိုသာ file ထဲမှာ ထိန်းသိမ်းထားပါလိမ့်မယ်။

ဥပမာ — အောက်က program က file ရဲ့ ပထမဆုံး bytes လေးခုကိုသာ ထိန်းသိမ်းပါတယ်:

```mjs
import { open, close, ftruncate } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('temp.txt', 'r+', (err, fd) => {
  if (err) throw err;

  try {
    ftruncate(fd, 4, (err) => {
      closeFd(fd);
      if (err) throw err;
    });
  } catch (err) {
    closeFd(fd);
    if (err) throw err;
  }
});
```

File က အရင်က `len` bytes ထက် ပိုတိုနေခဲ့ရင် ၎င်းကို ရှည်အောင် ဆန့်ထုတ်ပြီး — ဆန့်ထုတ်လိုက်တဲ့ အပိုင်းကို null bytes (`'\0'`) တွေနဲ့ ဖြည့်ပါတယ်:

`len` က negative ဖြစ်နေရင် `0` ကို သုံးပါလိမ့်မယ်။

### `fs.futimes(fd, atime, mtime, callback)`

* `fd` {integer}
* `atime` {number|string|Date}
* `mtime` {number|string|Date}
* `callback` {Function}
  * `err` {Error}

ပေးထားတဲ့ file descriptor က ရည်ညွှန်းတဲ့ object ရဲ့ file system timestamps တွေကို ပြောင်းလဲပါတယ်။ [`fs.utimes()`][] ကို ကြည့်ပါ။

### `fs.glob(pattern[, options], callback)`

* `pattern` {string|string\[]}

* `options` {Object}
  * `cwd` {string|URL} လက်ရှိ working directory ပါ။ **Default:** `process.cwd()`
  * `exclude` {Function|string\[]} Files/directories တွေကို စစ်ထုတ်ဖို့ function တစ်ခု သို့မဟုတ် — ဖယ်ထုတ်ရမယ့် glob patterns တွေရဲ့ စာရင်း တစ်ခုပါ။ Function တစ်ခု ပေးထားရင် item ကို ဖယ်ထုတ်ဖို့ `true` ကို ပြန်ပေးပြီး — ထည့်သွင်းဖို့ `false` ကို ပြန်ပေးပါတယ်။ **Default:** `undefined`.
  * `followSymlinks` {boolean} `true` ဆိုရင် `**` patterns တွေကို expand လုပ်နေစဉ်မှာ directories တွေဆီကို ညွှန်တဲ့ symbolic links တွေကို လိုက်၍ ဖြေရှင်းပါတယ်။ **Default:** `false`.
  * `withFileTypes` {boolean} Glob က paths တွေကို Dirents တွေအနေနဲ့ ပြန်ပေးသင့်ရင် `true` — မဟုတ်ရင် `false` ပါ။ **Default:** `false`.

* `callback` {Function}
  * `err` {Error}

* သတ်မှတ်ထားတဲ့ pattern နဲ့ ကိုက်ညီတဲ့ files တွေကို ပြန်လည် ရယူပါတယ်။

`followSymlinks` ကို ဖွင့်ထားတဲ့အခါ တွေ့ရှိရတဲ့ symbolic link cycles (သံသရာ ချိတ်ဆက်မှုများ) တွေကို recursively ဖြတ်သန်း (traverse) လုပ်မှာ မဟုတ်ပါဘူး။

```mjs
import { glob } from 'node:fs';

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```

```cjs
const { glob } = require('node:fs');

glob('**/*.js', (err, matches) => {
  if (err) throw err;
  console.log(matches);
});
```

### `fs.lchmod(path, mode, callback)`

> Stability: 0 - Deprecated

* `path` {string|Buffer|URL}
* `mode` {integer}
* `callback` {Function}
  * `err` {Error|AggregateError}

Symbolic link တစ်ခုပေါ်မှာ permissions တွေကို ပြောင်းလဲပါတယ်။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

ဒီ method ကို macOS ပေါ်မှာသာ implement လုပ်ထားပါတယ်။

အသေးစိတ်အတွက် POSIX lchmod(2) documentation ကို ကြည့်ပါ။

### `fs.lchown(path, uid, gid, callback)`

* `path` {string|Buffer|URL}
* `uid` {integer}
* `gid` {integer}
* `callback` {Function}
  * `err` {Error}

Symbolic link ရဲ့ owner ကို သတ်မှတ်ပါတယ်။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

အသေးစိတ်အတွက် POSIX lchown(2) documentation ကို ကြည့်ပါ။

### `fs.lutimes(path, atime, mtime, callback)`

* `path` {string|Buffer|URL}
* `atime` {number|string|Date}
* `mtime` {number|string|Date}
* `callback` {Function}
  * `err` {Error}

File တစ်ခုရဲ့ access နဲ့ modification times တွေကို [`fs.utimes()`][] နည်းတူ ပြောင်းလဲပေးပါတယ် — ကွာခြားချက်က path က symbolic link တစ်ခုကို ရည်ညွှန်းနေရင် link ကို dereference မလုပ်ပဲ — symbolic link ကိုယ်တိုင်ရဲ့ timestamps တွေကို ပြောင်းလဲပေးတာပါ။

ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

### `fs.link(existingPath, newPath, callback)`

* `existingPath` {string|Buffer|URL}
* `newPath` {string|Buffer|URL}
* `callback` {Function}
  * `err` {Error}

`existingPath` ကနေ `newPath` ဆီကို link အသစ်တစ်ခု ဖန်တီးပါတယ်။ အသေးစိတ်အတွက် POSIX link(2) documentation ကို ကြည့်ပါ။ ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ completion callback ကို arguments ဘာမှ ပေးအပ်ခြင်း မရှိပါဘူး။

### `fs.lstat(path[, options], callback)`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.Stats} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
  * `signal` {AbortSignal} Operation ကို ပယ်ဖျက်ဖို့ AbortSignal တစ်ခုပါ။ **Default:** `undefined`.
* `callback` {Function}
  * `err` {Error}
  * `stats` {fs.Stats}

Path က ရည်ညွှန်းတဲ့ symbolic link အတွက် {fs.Stats} ကို ပြန်လည် ရယူပါတယ်။ Callback က arguments နှစ်ခု `(err, stats)` ကို လက်ခံရရှိပြီး — `stats` က {fs.Stats} object တစ်ခုပါ။ `lstat()` က `stat()` နဲ့ ထပ်တူညီပြီး — ကွာခြားချက်က `path` က symbolic link တစ်ခုဆိုရင် ၎င်းက ရည်ညွှန်းတဲ့ file မဟုတ်ပဲ — link ကိုယ်တိုင်ကို stat လုပ်တာပါ။

အသေးစိတ်အတွက် POSIX lstat(2) documentation ကို ကြည့်ပါ။
### `fs.mkdir(path[, options], callback)`

* `path` {string|Buffer|URL}
* `options` {Object|integer}
  * `recursive` {boolean} **Default:** `false`
  * `mode` {string|integer} Windows မှာ support မလုပ်ပါဘူး။ အသေးစိတ်ကို [File modes][] မှာ ကြည့်ပါ။ **Default:** `0o777`.
* `callback` {Function}
  * `err` {Error}
  * `path` {string|undefined} `recursive` ကို `true` အဖြစ် သတ်မှတ်ပြီး directory တစ်ခု ဖန်တီးလိုက်တဲ့အခါမှသာ ပါဝင်ပါတယ်။

Directory တစ်ခုကို asynchronously ဖန်တီးပါတယ်။

Callback ဆီကို ဖြစ်နိုင်တဲ့ exception တစ်ခုနဲ့အတူ — `recursive` က `true` ဆိုရင် — ပထမဆုံး ဖန်တီးလိုက်တဲ့ directory path `(err[, path])` ကို ဖြတ်သန်းပေးပါတယ်။ `recursive` က `true` ဖြစ်ပေမယ့် directory တစ်ခုမှ မဖန်တီးခဲ့ရင် (ဥပမာ — အရင်ကတည်းက ဖန်တီးပြီးသား ဖြစ်နေခဲ့ရင်) `path` က `undefined` ဖြစ်နေနိုင်ပါသေးတယ်။

Optional ဖြစ်တဲ့ `options` argument က `mode` (permission နဲ့ sticky bits) ကို သတ်မှတ်ပေးတဲ့ integer တစ်ခု သို့မဟုတ် — parent directories တွေကို ဖန်တီးသင့်လားဆိုတာ ဖော်ပြတဲ့ `mode` property နဲ့ `recursive` property တစ်ခု ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `path` က ရှိပြီးသား directory တစ်ခုကို ညွှန်ပြနေတုန်း `fs.mkdir()` ကို ခေါ်လိုက်ရင် — `recursive` က `false` ဖြစ်တဲ့အခါမှသာ error ဖြစ်ပေါ်ပါတယ်။ `recursive` က `false` ဖြစ်ပြီး directory က ရှိပြီးသားဆိုရင် `EEXIST` error တစ်ခု ဖြစ်ပေါ်ပါတယ်။

```mjs
import { mkdir } from 'node:fs';

// Create ./tmp/a/apple, regardless of whether ./tmp and ./tmp/a exist.
mkdir('./tmp/a/apple', { recursive: true }, (err) => {
  if (err) throw err;
});
```

Windows မှာ root directory ပေါ်မှာ `fs.mkdir()` ကို — recursion သုံးထားရင်တောင် — သုံးလိုက်ရင် error တစ်ခု ထွက်ပေါ်ပါလိမ့်မယ်:

```mjs
import { mkdir } from 'node:fs';

mkdir('/', { recursive: true }, (err) => {
  // => [Error: EPERM: operation not permitted, mkdir 'C:\']
});
```

အသေးစိတ်အတွက် POSIX mkdir(2) documentation ကို ကြည့်ပါ။

### `fs.mkdtemp(prefix[, options], callback)`

* `prefix` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* `callback` {Function}
  * `err` {Error}
  * `directory` {string}

ထူးခြားတဲ့ (unique) temporary directory တစ်ခုကို ဖန်တီးပါတယ်။

Unique temporary directory တစ်ခု ဖန်တီးဖို့အတွက် လိုအပ်တဲ့ `prefix` တစ်ခုရဲ့ နောက်မှာ random characters ခြောက်လုံးကို ထပ်ဖြည့်ပေးပါတယ်။ Platform တွေကြားမှာ မကိုက်ညီမှုတွေ ရှိတာမို့ — `prefix` ထဲမှာ နောက်ဆုံးမှာ ပါတဲ့ `X` characters တွေကို ရှောင်ကြဉ်ပါ။ Platform အချို့ — အထူးသဖြင့် BSDs — က random characters ခြောက်လုံးထက် ပိုပြီး ပြန်ပေးနိုင်သလို — `prefix` ထဲက နောက်ဆုံး `X` characters တွေကို random characters တွေနဲ့ အစားထိုးပါတယ်။

ဖန်တီးလိုက်တဲ့ directory ရဲ့ path ကို callback ရဲ့ ဒုတိယ parameter ဆီကို string တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပါတယ်။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်ပေးတဲ့ string တစ်ခု သို့မဟုတ် — သုံးရမယ့် character encoding ကို သတ်မှတ်ပေးတဲ့ `encoding` property တစ်ခု ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။

```mjs
import { mkdtemp } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

mkdtemp(join(tmpdir(), 'foo-'), (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Prints: /tmp/foo-itXde2 or C:\Users\...\AppData\Local\Temp\foo-itXde2
});
```

`fs.mkdtemp()` method က ကျပန်း ရွေးချယ်လိုက်တဲ့ characters ခြောက်လုံးကို `prefix` string ရဲ့ နောက်မှာ တိုက်ရိုက် ထပ်ဖြည့်ပါလိမ့်မယ်။ ဥပမာ — `/tmp` ဆိုတဲ့ directory တစ်ခု ပေးထားပြီး `/tmp` ၏ အတွင်း (within) မှာ temporary directory တစ်ခု ဖန်တီးချင်တယ်ဆိုရင် — `prefix` က platform အလိုက် သီးသန့် path separator (`require('node:path').sep`) တစ်ခုနဲ့ အဆုံးသတ်ရပါမယ်။

```mjs
import { tmpdir } from 'node:os';
import { mkdtemp } from 'node:fs';

// The parent directory for the new temporary directory
const tmpDir = tmpdir();

// This method is *INCORRECT*:
mkdtemp(tmpDir, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Will print something similar to `/tmpabc123`.
  // A new temporary directory is created at the file system root
  // rather than *within* the /tmp directory.
});

// This method is *CORRECT*:
import { sep } from 'node:path';
mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
  if (err) throw err;
  console.log(directory);
  // Will print something similar to `/tmp/abc123`.
  // A new temporary directory is created within
  // the /tmp directory.
});
```

### `fs.open(path[, flags[, mode]], callback)`

* `path` {string|Buffer|URL}
* `flags` {string|number} [support of file system `flags`][] ကို ကြည့်ပါ။ **Default:** `'r'`.
* `mode` {string|integer} **Default:** `0o666` (ဖတ်လို့ရပြီး ရေးလို့ရပါတယ်)
* `callback` {Function}
  * `err` {Error}
  * `fd` {integer}

Asynchronous file open ပြုလုပ်ပါတယ်။ အသေးစိတ်အတွက် POSIX open(2) documentation ကို ကြည့်ပါ။

`mode` က file mode (permission နဲ့ sticky bits) ကို သတ်မှတ်ပေးပေမယ့် — file ကို ဖန်တီးလိုက်တဲ့အခါမှသာ သက်ရောက်ပါတယ်။ Windows မှာတော့ write permission ကိုသာ ပြောင်းလဲနိုင်ပြီး — [`fs.chmod()`][] ကို ကြည့်ပါ။

Callback က arguments နှစ်ခု `(err, fd)` ကို လက်ခံရရှိပါတယ်။

Windows မှာ character အချို့ (`< > : " / \ | ? *`) တွေက [Naming Files, Paths, and Namespaces][] မှာ မှတ်တမ်းတင်ထားတဲ့အတိုင်း reserved (သီးသန့် သိမ်းဆည်းထားသော) တွေ ဖြစ်ပါတယ်။ NTFS မှာ filename ထဲမှာ colon တစ်ခု ပါဝင်နေရင် — [this MSDN page][MSDN-Using-Streams] မှာ ဖော်ပြထားတဲ့အတိုင်း — Node.js က file system stream တစ်ခုကို ဖွင့်ပါလိမ့်မယ်။

`fs.open()` ကို အခြေခံတဲ့ function တွေ — `fs.writeFile()`, `fs.readFile()` စတာတွေ — မှာလည်း ဒီအပြုအမူမျိုး ရှိပါတယ်။

### `fs.openAsBlob(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `type` {string} Blob အတွက် optional mime type တစ်ခုပါ။
* Returns: {Promise} အောင်မြင်တဲ့အခါ {Blob} တစ်ခုဖြင့် fulfill ဖြစ်ပါတယ်။

ပြန်ပေးလိုက်တဲ့ {Blob} ရဲ့ data က ပေးထားတဲ့ file ကို နောက်ခံ (backing) အဖြစ် သုံးထားပါတယ်။

{Blob} ကို ဖန်တီးပြီးနောက်မှာ file ကို ပြုပြင် (modify) လုပ်လို့ မရပါဘူး။ ပြုပြင်လိုက်မယ်ဆိုရင် {Blob} ရဲ့ data ကို ဖတ်တာက `DOMException` error တစ်ခုနဲ့ မအောင်မြင်ပဲ ဖြစ်သွားပါလိမ့်မယ်။ File ရဲ့ data က disk ပေါ်မှာ ပြုပြင်ခံထားရလားဆိုတာ စစ်ဆေးဖို့အတွက် — `Blob` ကို ဖန်တီးတဲ့အခါနဲ့ read တစ်ခုချင်းစီ မလုပ်ဆောင်ခင် — file ပေါ်မှာ synchronous stat operations တွေကို လုပ်ဆောင်ပါတယ်။

```mjs
import { openAsBlob } from 'node:fs';

const blob = await openAsBlob('the.file.txt');
const ab = await blob.arrayBuffer();
blob.stream();
```

```cjs
const { openAsBlob } = require('node:fs');

(async () => {
  const blob = await openAsBlob('the.file.txt');
  const ab = await blob.arrayBuffer();
  blob.stream();
})();
```

### `fs.opendir(path[, options], callback)`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `encoding` {string|null} **Default:** `'utf8'`
  * `bufferSize` {number} Directory ကနေ ဖတ်ရှုနေတဲ့အခါ အတွင်းပိုင်း buffer လုပ်ထားတဲ့ directory entries အရေအတွက်ပါ။ တန်ဖိုး မြင့်လေလေ performance ကောင်းလေလေ ဖြစ်ပေမယ့် — memory အသုံးပြုမှု မြင့်လေလေ ဖြစ်ပါတယ်။ **Default:** `32`
  * `recursive` {boolean} **Default:** `false`
* `callback` {Function}
  * `err` {Error}
  * `dir` {fs.Dir}

Directory တစ်ခုကို asynchronously ဖွင့်ပါတယ်။ အသေးစိတ်အတွက် POSIX opendir(3) documentation ကို ကြည့်ပါ။

{fs.Dir} တစ်ခုကို ဖန်တီးပေးပြီး — directory ထဲကနေ ဖတ်ရှုခြင်းနဲ့ directory ကို ရှင်းလင်း (clean up) လုပ်ခြင်းအတွက် နောက်ထပ် function တွေ အားလုံး ပါဝင်ပါတယ်။

`encoding` option က directory ကို ဖွင့်တဲ့အချိန်နဲ့ နောက်ဆက်တွဲ read operations တွေမှာ `path` အတွက် encoding ကို သတ်မှတ်ပေးပါတယ်။

### `fs.read(fd, buffer, offset, length, position, callback)`

* `fd` {integer}
* `buffer` {Buffer|TypedArray|DataView} Data တွေကို ရေးသွင်းမယ့် buffer ပါ။
* `offset` {integer} `buffer` ထဲမှာ data တွေကို ရေးသားရမယ့် နေရာ (position) ပါ။
* `length` {integer} ဖတ်ရမယ့် bytes အရေအတွက်ပါ။
* `position` {integer|bigint|null} File ထဲမှာ ဘယ်နေရာကနေ စဖတ်ရမယ်ဆိုတာကို သတ်မှတ်ပေးပါတယ်။ `position` က `null` သို့မဟုတ် `-1 ` ဆိုရင် data ကို file ရဲ့ လက်ရှိ အနေအထားကနေ ဖတ်ပြီး — file ရဲ့ အနေအထားကိုလည်း update လုပ်ပါလိမ့်မယ်။ `position` က အနုတ်မဟုတ်တဲ့ (non-negative) integer တစ်ခုဆိုရင် file ရဲ့ အနေအထားက မပြောင်းလဲပဲ ရှိနေပါမယ်။
* `callback` {Function}
  * `err` {Error}
  * `bytesRead` {integer}
  * `buffer` {Buffer}

`fd` နဲ့ သတ်မှတ်ထားတဲ့ file ကနေ data ကို ဖတ်ပါတယ်။

Callback ဆီကို arguments သုံးခု `(err, bytesRead, buffer)` ကို ဖြတ်သန်းပေးပါတယ်။

File ကို တစ်ပြိုင်နက် (concurrently) ပြုပြင်မခံရဘူးဆိုရင် — ဖတ်လိုက်တဲ့ bytes အရေအတွက်က သုည ဖြစ်သွားတဲ့အခါ — file ရဲ့ အဆုံး (end-of-file) ကို ရောက်ရှိပါတယ်။

ဒီ method ကို [`util.promisify()`][] လုပ်ထားတဲ့ (promisified) version အနေနဲ့ ခေါ်ယူလိုက်ရင် — `bytesRead` နဲ့ `buffer` properties တွေ ပါတဲ့ `Object` တစ်ခုအတွက် promise တစ်ခုကို ပြန်ပေးပါတယ်။

`fs.read()` method က file descriptor (`fd`) နဲ့ သတ်မှတ်ထားတဲ့ file ကနေ data တွေကို ဖတ်ပါတယ်။ `length` argument က Node.js က kernel ကနေ ဖတ်ဖို့ ကြိုးစားမယ့် bytes အများဆုံး အရေအတွက်ကို ဖော်ပြပါတယ်။ ဒါပေမယ့် — အကြောင်းအမျိုးမျိုးကြောင့် — တကယ် ဖတ်လိုက်တဲ့ bytes အရေအတွက် (`bytesRead`) က သတ်မှတ်ထားတဲ့ `length` ထက် နည်းနေနိုင်ပါတယ်။

ဥပမာ:

* File က သတ်မှတ်ထားတဲ့ `length` ထက် တိုနေရင် — `bytesRead` ကို တကယ် ဖတ်လိုက်တဲ့ bytes အရေအတွက်အဖြစ် သတ်မှတ်ပါလိမ့်မယ်။
* Buffer ကို အပြည့် မဖြည့်နိုင်ခင် file က EOF (End of File) ကို ရောက်သွားရင် — Node.js က EOF ရောက်တဲ့အထိ ရနိုင်တဲ့ bytes တွေ အားလုံးကို ဖတ်ပြီး — callback ထဲက `bytesRead` parameter က သတ်မှတ်ထားတဲ့ `length` ထက် နည်းနိုင်တဲ့ — တကယ် ဖတ်လိုက်တဲ့ bytes အရေအတွက်ကို ဖော်ပြပါလိမ့်မယ်။
* File က နှေးကွေးတဲ့ network `filesystem` တစ်ခုပေါ်မှာ ရှိနေရင် သို့မဟုတ် ဖတ်နေတုန်း တခြား ပြဿနာတစ်ခုခု ကြုံတွေ့ရရင် — `bytesRead` က သတ်မှတ်ထားတဲ့ `length` ထက် နည်းနေနိုင်ပါတယ်။

ဒါကြောင့် `fs.read()` ကို သုံးတဲ့အခါ — file ကနေ တကယ် ဖတ်လိုက်တဲ့ bytes အရေအတွက်ကို ဆုံးဖြတ်ဖို့ `bytesRead` တန်ဖိုးကို စစ်ဆေးတာ အရေးကြီးပါတယ်။ သင့် application ရဲ့ logic ပေါ် မူတည်ပြီး — အနည်းဆုံး bytes ပမာဏတစ်ခု လိုအပ်ရင် read call ကို loop တစ်ခုအတွင်းမှာ ထုပ်ပိုးပြီး သုံးတာလိုမျိုး — `bytesRead` က သတ်မှတ်ထားတဲ့ `length` ထက် နည်းနေတဲ့ အခြေအနေတွေကို ကိုင်တွယ်ဖို့ လိုအပ်နိုင်ပါတယ်။

ဒီအပြုအမူက POSIX ရဲ့ `preadv2` function နဲ့ ဆင်တူပါတယ်။

### `fs.read(fd[, options], callback)`

* `fd` {integer}
* `options` {Object}
  * `buffer` {Buffer|TypedArray|DataView} **Default:** `Buffer.alloc(16384)`
  * `offset` {integer} **Default:** `0`
  * `length` {integer} **Default:** `buffer.byteLength - offset`
  * `position` {integer|bigint|null} **Default:** `null`
* `callback` {Function}
  * `err` {Error}
  * `bytesRead` {integer}
  * `buffer` {Buffer}

အပေါ်က [`fs.read()`][] function နဲ့ ဆင်တူပြီး — ဒီ version က optional `options` object တစ်ခုကို လက်ခံပါတယ်။ `options` object တစ်ခုမှ သတ်မှတ်မပေးထားဘူးဆိုရင် အပေါ်က တန်ဖိုးတွေနဲ့ပဲ default ဖြစ်ပါလိမ့်မယ်။

### `fs.read(fd, buffer[, options], callback)`

* `fd` {integer}
* `buffer` {Buffer|TypedArray|DataView} Data တွေကို ရေးသွင်းမယ့် buffer ပါ။
* `options` {Object}
  * `offset` {integer} **Default:** `0`
  * `length` {integer} **Default:** `buffer.byteLength - offset`
  * `position` {integer|bigint} **Default:** `null`
* `callback` {Function}
  * `err` {Error}
  * `bytesRead` {integer}
  * `buffer` {Buffer}

အပေါ်က [`fs.read()`][] function နဲ့ ဆင်တူပြီး — ဒီ version က optional `options` object တစ်ခုကို လက်ခံပါတယ်။ `options` object တစ်ခုမှ သတ်မှတ်မပေးထားဘူးဆိုရင် အပေါ်က တန်ဖိုးတွေနဲ့ပဲ default ဖြစ်ပါလိမ့်မယ်။

### `fs.readdir(path[, options], callback)`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
  * `withFileTypes` {boolean} **Default:** `false`
  * `recursive` {boolean} `true` ဆိုရင် directory တစ်ခုရဲ့ contents တွေကို recursively ဖတ်ပါတယ်။ Recursive mode မှာ files, sub files နဲ့ directories တွေ အားလုံးကို စာရင်းပြုစုပါလိမ့်မယ်။ **Default:** `false`.
* `callback` {Function}
  * `err` {Error}
  * `files` {string\[]|Buffer\[]|fs.Dirent\[]}

Directory တစ်ခုရဲ့ contents တွေကို ဖတ်ပါတယ်။ Callback က arguments နှစ်ခု `(err, files)` ကို လက်ခံရရှိပြီး — `files` က `'.'` နဲ့ `'..'` ကလွဲလို့ — directory ထဲက files တွေရဲ့ နာမည်တွေ ပါဝင်တဲ့ array တစ်ခု ဖြစ်ပါတယ်။

အသေးစိတ်အတွက် POSIX readdir(3) documentation ကို ကြည့်ပါ။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — callback ဆီကို ဖြတ်သန်းပေးတဲ့ filenames တွေအတွက် သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `encoding` ကို `'buffer'` အဖြစ် သတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ filenames တွေကို {Buffer} objects တွေအနေနဲ့ ဖြတ်သန်းပေးပါလိမ့်မယ်။

`options.withFileTypes` ကို `true` အဖြစ် သတ်မှတ်ထားရင် `files` array ထဲမှာ {fs.Dirent} objects တွေ ပါဝင်ပါလိမ့်မယ်။

### `fs.readFile(path[, options], callback)`

* `path` {string|Buffer|URL|integer} filename သို့မဟုတ် file descriptor ပါ
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `null`
  * `flag` {string} [support of file system `flags`][] ကို ကြည့်ပါ။ **Default:** `'r'`.
  * `signal` {AbortSignal} လုပ်ဆောင်နေဆဲ (in-progress) readFile တစ်ခုကို abort လုပ်ဖို့ ခွင့်ပြုပါတယ်
  * `buffer` {Buffer|TypedArray|DataView|Function} ဖတ်သွင်းရမယ့် buffer တစ်ခု သို့မဟုတ် — file size နဲ့အတူ ခေါ်ယူပြီး buffer ကို ပြန်ပေးတဲ့ function တစ်ခုပါ။
* `callback` {Function}
  * `err` {Error|AggregateError}
  * `data` {string|Buffer}

File တစ်ခုရဲ့ contents တွေ တစ်ခုလုံးကို asynchronously ဖတ်ပါတယ်။

```mjs
import { readFile } from 'node:fs';

readFile('/etc/passwd', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

Callback ဆီကို arguments နှစ်ခု `(err, data)` ဖြတ်သန်းပေးပြီး — `data` က file ရဲ့ contents တွေ ဖြစ်ပါတယ်။

Encoding တစ်ခုမှ မသတ်မှတ်ထားဘူးဆိုရင် raw buffer ကို ပြန်ပေးပါတယ်။

`buffer` ကို ပေးထားပြီး encoding မသတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ {Buffer} က — ဖတ်လိုက်တဲ့ bytes တွေသာ ပါဝင်တဲ့ — ပေးထားတဲ့ buffer အပေါ်က view တစ်ခု ဖြစ်ပါတယ်။ ပေးထားတဲ့ buffer က file တစ်ခုလုံး ထည့်သွင်းဖို့ သေးလွန်းရင် callback ကို error တစ်ခုနဲ့အတူ ခေါ်ပါတယ်။

`options` က string တစ်ခုဆိုရင် ၎င်းက encoding ကို သတ်မှတ်ပေးပါတယ်:

```mjs
import { readFile } from 'node:fs';

readFile('/etc/passwd', 'utf8', callback);
```

`path` က directory တစ်ခုဆိုရင် `fs.readFile()` နဲ့ [`fs.readFileSync()`][] တို့ရဲ့ အပြုအမူက platform အလိုက် ကွဲပြားပါတယ်။ macOS, Linux နဲ့ Windows တွေမှာ error တစ်ခု ပြန်ပေးပါလိမ့်မယ်။ FreeBSD မှာတော့ directory ရဲ့ contents တွေရဲ့ ကိုယ်စားပြုမှု (representation) တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

```mjs
import { readFile } from 'node:fs';

// macOS, Linux, and Windows
readFile('<directory>', (err, data) => {
  // => [Error: EISDIR: illegal operation on a directory, read <directory>]
});

//  FreeBSD
readFile('<directory>', (err, data) => {
  // => null, <data>
});
```

{AbortSignal} တစ်ခုကို သုံးပြီး လုပ်ဆောင်နေတဲ့ request တစ်ခုကို abort လုပ်နိုင်ပါတယ်။ Request တစ်ခုကို abort လုပ်လိုက်ရင် callback ကို `AbortError` တစ်ခုနဲ့အတူ ခေါ်ပါတယ်:

```mjs
import { readFile } from 'node:fs';

const controller = new AbortController();
const signal = controller.signal;
readFile(fileInfo[0].name, { signal }, (err, buf) => {
  // ...
});
// When you want to abort the request
controller.abort();
```

`fs.readFile()` function က file တစ်ခုလုံးကို buffer လုပ်ပါတယ်။ Memory စရိတ်တွေ အနည်းဆုံး ဖြစ်အောင် — ဖြစ်နိုင်ရင် `fs.createReadStream()` ကနေတစ်ဆင့် streaming လုပ်တာကို ဦးစားပေး သုံးပါ။

လုပ်ဆောင်နေဆဲ request တစ်ခုကို abort လုပ်တာက operating system requests တစ်ခုချင်းစီကို abort လုပ်တာ မဟုတ်ပဲ — `fs.readFile` က လုပ်ဆောင်တဲ့ internal buffering ကိုသာ abort လုပ်ပါတယ်။

ကြိုတင် နေရာချထားပြီးသား (pre-allocated) buffer တစ်ခုနဲ့ `buffer` option ကို သုံးတဲ့ ဥပမာ:

```mjs
import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs';

const buf = Buffer.alloc(16384);
readFile('/path/to/file', { buffer: buf }, (err, data) => {
  if (err) throw err;
  console.log(data); // A view over `buf` containing only the bytes read
});
```

Buffer တစ်ခုကို ပြန်ပေးတဲ့ function တစ်ခုနဲ့ `buffer` option ကို သုံးတဲ့ ဥပမာ:

```mjs
import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs';

readFile('/path/to/file', {
  buffer: (size) => Buffer.alloc(size),
}, (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

#### File descriptor များ (File descriptors)

1. သတ်မှတ်ပေးထားတဲ့ file descriptor တိုင်းက reading ကို support လုပ်ရပါမယ်။
2. `path` အနေနဲ့ file descriptor တစ်ခုကို သတ်မှတ်ပေးထားရင် ၎င်းကို အလိုအလျောက် ပိတ်ပေးမှာ မဟုတ်ပါဘူး။
3. ဖတ်ရှုခြင်းက file ရဲ့ လက်ရှိ အနေအထားကနေ စတင်ပါလိမ့်မယ်။ ဥပမာ — file ထဲမှာ `'Hello World'` ရှိပြီးသား ဖြစ်ပြီး file descriptor နဲ့ bytes ခြောက်ခု ဖတ်လိုက်ပြီးဆိုရင် — အဲဒီ file descriptor တစ်ခုတည်းနဲ့ပဲ `fs.readFile()` ကို ခေါ်လိုက်ရင် `'Hello World'` အစား `'World'` ကို ရပါလိမ့်မယ်။

#### Performance ဆိုင်ရာ ထည့်သွင်းစဉ်းစားချက်များ (Performance Considerations)

`fs.readFile()` method က file တစ်ခုရဲ့ contents တွေကို chunk တစ်ခုပြီးတစ်ခု — memory ထဲကို asynchronously ဖတ်သွင်းပြီး — chunk တစ်ခုချင်းစီကြားမှာ event loop ကို လှည့်ပတ် (turn) ခွင့် ပြုပါတယ်။ ဒါက read operation က underlying libuv thread pool ကို သုံးနေနိုင်တဲ့ တခြား လုပ်ဆောင်မှုတွေအပေါ် သက်ရောက်မှု နည်းစေပေမယ့် — file တစ်ခုလုံးကို memory ထဲကို ဖတ်ပြီးမြောက်ဖို့ အချိန် ပိုကြာစေပါတယ်။

ထပ်ဆောင်း read overhead က system အမျိုးမျိုးမှာ ကျယ်ပြန့်စွာ ကွဲပြားနိုင်ပြီး — ဖတ်နေတဲ့ file ရဲ့ အမျိုးအစားပေါ်မှာလည်း မူတည်ပါတယ်။ File type က regular file တစ်ခု မဟုတ်ဘူးဆိုရင် (ဥပမာ — pipe) ပြီး Node.js က တကယ့် file size ကို ဆုံးဖြတ်လို့ မရဘူးဆိုရင် — read operation တစ်ခုချင်းစီမှာ data 64 KiB ကို တင်ပေးပါတယ်။ Regular files တွေအတွက်တော့ read တစ်ခုချင်းစီမှာ data 512 KiB ကို process လုပ်ပါတယ်။

File contents တွေကို တတ်နိုင်သမျှ မြန်မြန် ဖတ်ဖို့ လိုအပ်တဲ့ applications တွေအတွက်တော့ — `fs.read()` ကို တိုက်ရိုက် သုံးပြီး — file ရဲ့ contents တွေ တစ်ခုလုံးကို ဖတ်တာကို application code ကိုယ်တိုင် စီမံတာက ပိုကောင်းပါတယ်။

Node.js GitHub issue [#25741][] မှာ — Node.js versions အမျိုးမျိုးမှာ file sizes အမျိုးမျိုးအတွက် `fs.readFile()` ရဲ့ performance အကြောင်း — နောက်ထပ် အချက်အလက်တွေနဲ့ အသေးစိတ် ခွဲခြမ်းစိတ်ဖြာမှု တစ်ခု ပါဝင်ပါတယ်။

### `fs.readlink(path[, options], callback)`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* `callback` {Function}
  * `err` {Error}
  * `linkString` {string|Buffer}

`path` က ရည်ညွှန်းတဲ့ symbolic link ရဲ့ contents တွေကို ဖတ်ပါတယ်။ Callback က arguments နှစ်ခု `(err, linkString)` ကို လက်ခံရရှိပါတယ်။

အသေးစိတ်အတွက် POSIX readlink(2) documentation ကို ကြည့်ပါ။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — ပြန်ပေးလိုက်တဲ့ link path အတွက် သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `encoding` ကို `'buffer'` အဖြစ် သတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ link path ကို {Buffer} object တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပါလိမ့်မယ်။

### `fs.readv(fd, buffers[, position], callback)`

* `fd` {integer}
* `buffers` {ArrayBufferView\[]}
* `position` {integer|null} **Default:** `null`
* `callback` {Function}
  * `err` {Error}
  * `bytesRead` {integer}
  * `buffers` {ArrayBufferView\[]}

`fd` နဲ့ သတ်မှတ်ထားတဲ့ file ကနေ — `readv()` ကို သုံးပြီး — `ArrayBufferView` တွေရဲ့ array တစ်ခုထဲကို ဖတ်ပြီး ရေးသွင်းပါတယ်။

`position` က file ရဲ့ အစကနေ data ဖတ်ရမယ့် offset ပါ။ `typeof position !== 'number'` ဆိုရင် data ကို လက်ရှိ အနေအထားကနေ ဖတ်ပါလိမ့်မယ်။

Callback ဆီကို arguments သုံးခု — `err`, `bytesRead` နဲ့ `buffers` — ဖြတ်သန်းပေးပါလိမ့်မယ်။ `bytesRead` က file ကနေ ဖတ်လိုက်တဲ့ bytes အရေအတွက်ပါ။

ဒီ method ကို [`util.promisify()`][] လုပ်ထားတဲ့ version အနေနဲ့ ခေါ်ယူလိုက်ရင် — `bytesRead` နဲ့ `buffers` properties တွေ ပါတဲ့ `Object` တစ်ခုအတွက် promise တစ်ခုကို ပြန်ပေးပါတယ်။

### `fs.realpath(path[, options], callback)`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* `callback` {Function}
  * `err` {Error}
  * `resolvedPath` {string|Buffer}

`.`, `..` နဲ့ symbolic links တွေကို resolve လုပ်ပြီး canonical pathname (စံသတ်မှတ်ထားသော လမ်းကြောင်းအမည်) ကို asynchronously တွက်ချက်ပေးပါတယ်။

Canonical pathname တစ်ခုက တစ်ခုတည်းသော (unique) ဖြစ်ချင်မှ ဖြစ်ပါလိမ့်မယ်။ Hard links နဲ့ bind mounts တွေက file system entity တစ်ခုကို pathnames အများအပြားကနေတစ်ဆင့် ထုတ်ဖော်ပြနိုင်ပါတယ်။

ဒီ function က realpath(3) လိုပဲ ပြုမူပေမယ့် — ခြွင်းချက်အချို့ ရှိပါတယ်:

1. Case-insensitive file systems တွေပေါ်မှာ case conversion (စာလုံး အကြီးအသေး ပြောင်းလဲမှု) ကို မလုပ်ဆောင်ပါဘူး။

2. Symbolic links တွေရဲ့ အများဆုံး အရေအတွက်က platform နဲ့ မသက်ဆိုင်ပဲ — ယေဘုယျအားဖြင့် native realpath(3) implementation က support လုပ်တာထက် (အများကြီး) ပိုများပါတယ်။

`callback` က arguments နှစ်ခု `(err, resolvedPath)` ကို လက်ခံရရှိပါတယ်။ Relative paths တွေကို resolve လုပ်ဖို့ `process.cwd` ကို သုံးနိုင်ပါတယ်။

UTF8 strings အဖြစ် ပြောင်းလဲလို့ရတဲ့ paths တွေကိုသာ support လုပ်ပါတယ်။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — callback ဆီကို ဖြတ်သန်းပေးတဲ့ path အတွက် သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `encoding` ကို `'buffer'` အဖြစ် သတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ path ကို {Buffer} object တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပါလိမ့်မယ်။

`path` က socket တစ်ခု သို့မဟုတ် pipe တစ်ခုဆီကို resolve ဖြစ်သွားရင် — function က အဲဒီ object အတွက် system ပေါ် မူတည်တဲ့ (system dependent) နာမည်တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

မရှိတဲ့ path တစ်ခုက ENOENT error တစ်ခုကို ဖြစ်ပေါ်စေပါတယ်။ `error.path` က absolute file path ပါ။

### `fs.realpath.native(path[, options], callback)`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* `callback` {Function}
  * `err` {Error}
  * `resolvedPath` {string|Buffer}

Asynchronous realpath(3) ပြုလုပ်ပါတယ်။

`callback` က arguments နှစ်ခု `(err, resolvedPath)` ကို လက်ခံရရှိပါတယ်။

UTF8 strings အဖြစ် ပြောင်းလဲလို့ရတဲ့ paths တွေကိုသာ support လုပ်ပါတယ်။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — callback ဆီကို ဖြတ်သန်းပေးတဲ့ path အတွက် သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `encoding` ကို `'buffer'` အဖြစ် သတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ path ကို {Buffer} object တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပါလိမ့်မယ်။

Linux မှာ Node.js ကို musl libc နဲ့ ချိတ်ဆက်ထားတဲ့အခါ ဒီ function အလုပ်လုပ်ဖို့ procfs file system ကို `/proc` မှာ mount လုပ်ထားရပါမယ်။ Glibc မှာတော့ ဒီကန့်သတ်ချက် မရှိပါဘူး။

### `fs.rename(oldPath, newPath, callback)`

* `oldPath` {string|Buffer|URL}
* `newPath` {string|Buffer|URL}
* `callback` {Function}
  * `err` {Error}

`oldPath` မှာရှိတဲ့ file ကို `newPath` အနေနဲ့ ပေးထားတဲ့ pathname ဆီကို asynchronously နာမည်ပြောင်းပေးပါတယ်။ `newPath` က ရှိပြီးသားဆိုရင် ၎င်းကို ထပ်ရေး (overwrite) လုပ်ပါလိမ့်မယ်။ `newPath` မှာ directory တစ်ခု ရှိနေရင်တော့ error တစ်ခု ဖြစ်ပေါ်လာပါလိမ့်မယ်။ Completion callback ဆီကို ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ တခြား arguments တွေ မပေးပါဘူး။

ဆက်စပ် ကြည့်ရှုရန်: rename(2)။

```mjs
import { rename } from 'node:fs';

rename('oldFile.txt', 'newFile.txt', (err) => {
  if (err) throw err;
  console.log('Rename complete!');
});
```

### `fs.rmdir(path[, options], callback)`

* `path` {string|Buffer|URL}
* `options` {Object} လက်ရှိမှာ ထုတ်ဖော်ထားတဲ့ (exposed) options တွေ မရှိပါဘူး။ အရင်တုန်းက `recursive`, `maxBusyTries` နဲ့ `emfileWait` အတွက် options တွေ ရှိခဲ့ပေမယ့် ၎င်းတို့ကို deprecated လုပ်ပြီး ဖယ်ရှားလိုက်ပါတယ်။ `options` argument ကို backwards compatibility (နောက်ပြန် လိုက်ဖက်ညီမှု) အတွက် လက်ခံဆဲ ဖြစ်ပေမယ့် အသုံးမပြုပါဘူး။
* `callback` {Function}
  * `err` {Error}

Asynchronous rmdir(2) ပြုလုပ်ပါတယ်။ Completion callback ဆီကို ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ တခြား arguments တွေ မပေးပါဘူး။

`fs.rmdir()` ကို (directory မဟုတ်တဲ့) file တစ်ခုပေါ်မှာ သုံးလိုက်ရင် Windows မှာ `ENOENT` error ကို ဖြစ်ပေါ်စေပြီး POSIX မှာ `ENOTDIR` error ကို ဖြစ်ပေါ်စေပါတယ်။

Unix ရဲ့ `rm -rf` command နဲ့ ဆင်တူတဲ့ အပြုအမူကို ရဖို့အတွက် options `{ recursive: true, force: true }` တွေနဲ့အတူ [`fs.rm()`][] ကို သုံးပါ။

### `fs.rm(path[, options], callback)`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `force` {boolean} `true` ဆိုရင် `path` မရှိဘူးဆိုရင် exceptions တွေကို လျစ်လျူရှုပါလိမ့်မယ်။ **Default:** `false`.
  * `maxRetries` {integer} `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` သို့မဟုတ် `EPERM` error တစ်ခုခု ကြုံတွေ့ရရင် Node.js က — အကြိမ်တိုင်းမှာ `retryDelay` milliseconds ပိုရှည်တဲ့ linear backoff wait (အဆင့်လိုက် နောက်ဆုတ် စောင့်ဆိုင်းမှု) နဲ့အတူ — operation ကို ပြန်ကြိုးစားပါလိမ့်မယ်။ ဒီ option က retries အရေအတွက်ကို ကိုယ်စားပြုပါတယ်။ `recursive` option က `true` မဟုတ်ဘူးဆိုရင် ဒီ option ကို လျစ်လျူရှုပါတယ်။ **Default:** `0`.
  * `recursive` {boolean} `true` ဆိုရင် recursive removal (အဆင့်ဆင့် ဖယ်ရှားခြင်း) ကို လုပ်ဆောင်ပါတယ်။ Recursive mode မှာ operations တွေကို မအောင်မြင်ရင် ပြန်ကြိုးစားပါတယ်။ **Default:** `false`.
  * `retryDelay` {integer} Retries တွေကြားမှာ စောင့်ဆိုင်းရမယ့် အချိန်ပမာဏကို milliseconds နဲ့ ဖော်ပြပါတယ်။ `recursive` option က `true` မဟုတ်ဘူးဆိုရင် ဒီ option ကို လျစ်လျူရှုပါတယ်။ **Default:** `100`.
* `callback` {Function}
  * `err` {Error}

Files နဲ့ directories တွေကို asynchronously ဖယ်ရှားပါတယ် (standard POSIX `rm` utility ကို စံပြုထားပါတယ်)။ Completion callback ဆီကို ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ တခြား arguments တွေ မပေးပါဘူး။

### `fs.stat(path[, options], callback)`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.Stats} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
  * `throwIfNoEntry` {boolean} `undefined` ကို ပြန်ပေးမယ့်အစား — file system entry တစ်ခုမှ မရှိဘူးဆိုရင် exception တစ်ခုကို throw လုပ်မလားဆိုတာပါ။ **Default:** `true`.
* `callback` {Function}
  * `err` {Error}
  * `stats` {fs.Stats}

Asynchronous stat(2) ပြုလုပ်ပါတယ်။ Callback က arguments နှစ်ခု `(err, stats)` ကို လက်ခံရရှိပြီး — `stats` က {fs.Stats} object တစ်ခု ဖြစ်ပါတယ်။

Error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် `err.code` က [Common System Errors][] ထဲက တစ်ခု ဖြစ်ပါလိမ့်မယ်။

[`fs.stat()`][] က symbolic links တွေကို လိုက်လံ (follow) လုပ်ပါတယ်။ Links တွေကိုယ်တိုင်ကို ကြည့်ဖို့ဆိုရင် [`fs.lstat()`][] ကို သုံးပါ။

`fs.open()`, `fs.readFile()` (သို့) `fs.writeFile()` တစ်ခုခုကို မခေါ်ခင် file တစ်ခု ရှိမရှိ စစ်ဆေးဖို့ `fs.stat()` ကို သုံးတာကို အကြံပြုလို့ မရပါဘူး။ အဲဒီအစား — user code က file ကို တိုက်ရိုက် open/read/write လုပ်ပြီး — file မရနိုင်ဘူးဆိုရင် ဖြစ်ပေါ်လာတဲ့ error ကို ကိုင်တွယ်သင့်ပါတယ်။

File တစ်ခု ရှိမရှိကို — နောက်ပိုင်း ကိုင်တွယ်စရာ မလိုပဲ — စစ်ဆေးချင်ရင် [`fs.access()`][] ကို အကြံပြုပါတယ်။

ဥပမာ — အောက်ပါ directory structure ကို ပေးထားတယ်ဆိုပါစို့:

```text
- txtDir
-- file.txt
- app.js
```

နောက် program က ပေးထားတဲ့ paths တွေရဲ့ stats တွေကို စစ်ဆေးပါလိမ့်မယ်:

```mjs
import { stat } from 'node:fs';

const pathsToCheck = ['./txtDir', './txtDir/file.txt'];

for (let i = 0; i < pathsToCheck.length; i++) {
  stat(pathsToCheck[i], (err, stats) => {
    console.log(stats.isDirectory());
    console.log(stats);
  });
}
```

ရလာတဲ့ output က ဒီလိုမျိုး ပုံစံ ရှိပါလိမ့်မယ်:

```console
true
Stats {
  dev: 16777220,
  mode: 16877,
  nlink: 3,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214262,
  size: 96,
  blocks: 0,
  atimeMs: 1561174653071.963,
  mtimeMs: 1561174614583.3518,
  ctimeMs: 1561174626623.5366,
  birthtimeMs: 1561174126937.2893,
  atime: 2019-06-22T03:37:33.072Z,
  mtime: 2019-06-22T03:36:54.583Z,
  ctime: 2019-06-22T03:37:06.624Z,
  birthtime: 2019-06-22T03:28:46.937Z,
  atimeInstant: 2019-06-22T03:37:33.071963Z,
  mtimeInstant: 2019-06-22T03:36:54.5833518Z,
  ctimeInstant: 2019-06-22T03:37:06.6235366Z,
  birthtimeInstant: 2019-06-22T03:28:46.9372893Z
}
false
Stats {
  dev: 16777220,
  mode: 33188,
  nlink: 1,
  uid: 501,
  gid: 20,
  rdev: 0,
  blksize: 4096,
  ino: 14214074,
  size: 8,
  blocks: 8,
  atimeMs: 1561174616618.8555,
  mtimeMs: 1561174614584,
  ctimeMs: 1561174614583.8145,
  birthtimeMs: 1561174007710.7478,
  atime: 2019-06-22T03:36:56.619Z,
  mtime: 2019-06-22T03:36:54.584Z,
  ctime: 2019-06-22T03:36:54.584Z,
  birthtime: 2019-06-22T03:26:47.711Z,
  atimeInstant: 2019-06-22T03:36:56.6188555Z,
  mtimeInstant: 2019-06-22T03:36:54.584Z,
  ctimeInstant: 2019-06-22T03:36:54.5838145Z,
  birthtimeInstant: 2019-06-22T03:26:47.7107478Z
}
```

### `fs.statfs(path[, options], callback)`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.StatFs} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
* `callback` {Function}
  * `err` {Error}
  * `stats` {fs.StatFs}

Asynchronous statfs(2) ပြုလုပ်ပါတယ်။ `path` ကို ပါဝင်တဲ့ mount လုပ်ထားတဲ့ file system အကြောင်း အချက်အလက်တွေကို ပြန်ပေးပါတယ်။ Callback က arguments နှစ်ခု `(err, stats)` ကို လက်ခံရရှိပြီး — `stats` က {fs.StatFs} object တစ်ခု ဖြစ်ပါတယ်။

Error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် `err.code` က [Common System Errors][] ထဲက တစ်ခု ဖြစ်ပါလိမ့်မယ်။

### `fs.symlink(target, path[, type], callback)`

* `target` {string|Buffer|URL}
* `path` {string|Buffer|URL}
* `type` {string|null} **Default:** `null`
* `callback` {Function}
  * `err` {Error}

`target` ကို ညွှန်ပြတဲ့ `path` ဆိုတဲ့ link တစ်ခုကို ဖန်တီးပါတယ်။ Completion callback ဆီကို ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ တခြား arguments တွေ မပေးပါဘူး။

အသေးစိတ်အတွက် POSIX symlink(2) documentation ကို ကြည့်ပါ။

`type` argument က Windows မှာသာ ရရှိနိုင်ပြီး — တခြား platforms တွေမှာ လျစ်လျူရှုခံရပါတယ်။ ၎င်းကို `'dir'`, `'file'` သို့မဟုတ် `'junction'` အဖြစ် သတ်မှတ်နိုင်ပါတယ်။ `type` argument က `null` ဆိုရင် Node.js က `target` ရဲ့ type ကို အလိုအလျောက် စစ်ဆေးပြီး `'file'` သို့မဟုတ် `'dir'` ကို သုံးပါလိမ့်မယ်။ `target` က မရှိဘူးဆိုရင် `'file'` ကို သုံးပါလိမ့်မယ်။ Windows junction points တွေက destination path ကို absolute ဖြစ်ဖို့ လိုအပ်ပါတယ်။ `'junction'` ကို သုံးတဲ့အခါ `target` argument ကို absolute path အဖြစ် အလိုအလျောက် normalize လုပ်ပေးပါလိမ့်မယ်။ NTFS volumes တွေပေါ်က Junction points တွေက directories တွေကိုသာ ညွှန်ပြနိုင်ပါတယ်။

Relative targets တွေက link ရဲ့ parent directory နဲ့ နှိုင်းယှဉ်ပြီး (relative) သတ်မှတ်ပါတယ်။

```mjs
import { symlink } from 'node:fs';

symlink('./mew', './mewtwo', callback);
```

အပေါ်က ဥပမာက directory တစ်ခုတည်းထဲမှာ ရှိတဲ့ `mew` ကို ညွှန်ပြတဲ့ `mewtwo` ဆိုတဲ့ symbolic link တစ်ခုကို ဖန်တီးပါတယ်:

```bash
$ tree .
.
├── mew
└── mewtwo -> ./mew
```

### `fs.truncate(path[, len], callback)`

* `path` {string|Buffer|URL}
* `len` {integer} **Default:** `0`
* `callback` {Function}
  * `err` {Error|AggregateError}

File ကို အရွယ်အစား ဖြတ်တောက် (truncate) ပါတယ်။ Completion callback ဆီကို ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ တခြား arguments တွေ မပေးပါဘူး။ File descriptor တစ်ခုကိုလည်း ပထမဆုံး argument အနေနဲ့ ဖြတ်သန်းပေးနိုင်ပါတယ်။ အဲဒီလိုအခါမျိုးမှာ `fs.ftruncate()` ကို ခေါ်ပါတယ်။

```mjs
import { truncate } from 'node:fs';
// Assuming that 'path/file.txt' is a regular file.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was truncated');
});
```

```cjs
const { truncate } = require('node:fs');
// Assuming that 'path/file.txt' is a regular file.
truncate('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was truncated');
});
```

File descriptor တစ်ခုကို ဖြတ်သန်းပေးတာက deprecated ဖြစ်ပြီး — နောင်တွင် error တစ်ခု throw လုပ်ခံရနိုင်ပါတယ်။

အသေးစိတ်အတွက် POSIX truncate(2) documentation ကို ကြည့်ပါ။

### `fs.unlink(path, callback)`

* `path` {string|Buffer|URL}
* `callback` {Function}
  * `err` {Error}

File တစ်ခု သို့မဟုတ် symbolic link တစ်ခုကို asynchronously ဖယ်ရှားပါတယ်။ Completion callback ဆီကို ဖြစ်နိုင်တဲ့ exception တစ်ခုကလွဲလို့ တခြား arguments တွေ မပေးပါဘူး။

```mjs
import { unlink } from 'node:fs';
// Assuming that 'path/file.txt' is a regular file.
unlink('path/file.txt', (err) => {
  if (err) throw err;
  console.log('path/file.txt was deleted');
});
```

`fs.unlink()` က directory တစ်ခုပေါ်မှာ — ဗလာဖြစ်ဖြစ် မဟုတ်ဖြစ်ဖြစ် — အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။ Directory တစ်ခုကို ဖယ်ရှားဖို့ဆိုရင် [`fs.rmdir()`][] ကို သုံးပါ။

အသေးစိတ်အတွက် POSIX unlink(2) documentation ကို ကြည့်ပါ။

### `fs.unwatchFile(filename[, listener])`

* `filename` {string|Buffer|URL}
* `listener` {Function} Optional — အရင်က `fs.watchFile()` ကို သုံးပြီး ချိတ်တွဲထားခဲ့တဲ့ listener တစ်ခုပါ။

`filename` ပေါ်မှာ ပြောင်းလဲမှုတွေကို စောင့်ကြည့်တာ (watching) ကို ရပ်တန့်ပါတယ်။ `listener` ကို သတ်မှတ်ပေးထားရင် အဲဒီ listener တစ်ခုတည်းကိုသာ ဖယ်ရှားပါတယ်။ မသတ်မှတ်ထားရင်တော့ listeners တွေ _အားလုံး_ (all) ကို ဖယ်ရှားပြီး — `filename` ကို စောင့်ကြည့်တာကို ထိရောက်စွာ ရပ်တန့်စေပါတယ်။

စောင့်ကြည့်မခံနေရတဲ့ filename တစ်ခုနဲ့ `fs.unwatchFile()` ကို ခေါ်လိုက်တာက error တစ်ခု မဟုတ်ပဲ — no-op (ဘာမျှ မလုပ်ဆောင်ခြင်း) ဖြစ်ပါတယ်။

`fs.watchFile()` နဲ့ `fs.unwatchFile()` တို့ထက် [`fs.watch()`][] က ပိုထိရောက်ပါတယ်။ ဖြစ်နိုင်ရင် `fs.watchFile()` နဲ့ `fs.unwatchFile()` တို့အစား `fs.watch()` ကို သုံးသင့်ပါတယ်။

### `fs.utimes(path, atime, mtime, callback)`

* `path` {string|Buffer|URL}
* `atime` {number|string|Date}
* `mtime` {number|string|Date}
* `callback` {Function}
  * `err` {Error}

`path` က ရည်ညွှန်းတဲ့ object ရဲ့ file system timestamps တွေကို ပြောင်းလဲပေးပါတယ်။

`atime` နဲ့ `mtime` arguments တွေက အောက်ပါ စည်းမျဉ်းတွေကို လိုက်နာပါတယ်:

* တန်ဖိုးတွေက Unix epoch time ကို စက္ကန့်နဲ့ ဖော်ပြတဲ့ numbers တွေ၊ `Date` တွေ သို့မဟုတ် `'123456789.0'` လိုမျိုး numeric string တစ်ခု ဖြစ်နိုင်ပါတယ်။
* တန်ဖိုးကို number အဖြစ် ပြောင်းလဲလို့ မရဘူးဆိုရင် သို့မဟုတ် `NaN`, `Infinity` (သို့) `-Infinity` ဖြစ်နေရင် `Error` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### `fs.watch(filename[, options][, listener])`

* `filename` {string|Buffer|URL}
* `options` {string|Object}
  * `persistent` {boolean} Files တွေကို watch လုပ်နေသရွေ့ process က ဆက်လည်ပတ်နေသင့်လားဆိုတာကို ဖော်ပြပါတယ်။ **Default:** `true`.
  * `recursive` {boolean} Subdirectories တွေ အားလုံးကို watch လုပ်သင့်လား သို့မဟုတ် လက်ရှိ directory တစ်ခုတည်းကိုသာ watch လုပ်သင့်လားဆိုတာကို ဖော်ပြပါတယ်။ ဒါက directory တစ်ခုကို သတ်မှတ်လိုက်တဲ့အခါ — support လုပ်တဲ့ platforms တွေပေါ်မှာသာ — သက်ရောက်ပါတယ် ([caveats][] ကို ကြည့်ပါ)။ **Default:** `false`.
  * `encoding` {string} Listener ဆီကို ဖြတ်သန်းပေးတဲ့ filename အတွက် သုံးမယ့် character encoding ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `'utf8'`.
  * `signal` {AbortSignal} AbortSignal တစ်ခုနဲ့ watcher ကို ပိတ်လို့ ရအောင် ခွင့်ပြုပါတယ်။
  * `throwIfNoEntry` {boolean} Path က မရှိတဲ့အခါ exception တစ်ခုကို throw လုပ်သင့်လားဆိုတာကို ဖော်ပြပါတယ်။ **Default:** `true`.
  * `ignore` {string|RegExp|Function|Array} လျစ်လျူရှုရမယ့် pattern(များ) ပါ။ Strings တွေက glob patterns ([`minimatch`][] ကို သုံးပြီး) ဖြစ်ပြီး — RegExp patterns တွေကို filename ပေါ်မှာ စမ်းသပ်ပါတယ် — functions တွေကတော့ filename ကို လက်ခံပြီး လျစ်လျူရှုဖို့ `true` ကို ပြန်ပေးပါတယ်။ **Default:** `undefined`.
* `listener` {Function|undefined} **Default:** `undefined`
  * `eventType` {string}
  * `filename` {string|Buffer|null}
* Returns: {fs.FSWatcher}

`filename` ပေါ်မှာ ပြောင်းလဲမှုတွေကို စောင့်ကြည့်ပါတယ် — `filename` က file တစ်ခု သို့မဟုတ် directory တစ်ခု ဖြစ်နိုင်ပါတယ်။

ဒုတိယ argument က optional ပါ။ `options` ကို string အနေနဲ့ ပေးထားရင် ၎င်းက `encoding` ကို သတ်မှတ်ပါတယ်။ မဟုတ်ရင်တော့ `options` ကို object တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးသင့်ပါတယ်။

Listener callback က arguments နှစ်ခု `(eventType, filename)` ကို လက်ခံရရှိပါတယ်။ `eventType` က `'rename'` သို့မဟုတ် `'change'` ဖြစ်ပြီး — `filename` က event ကို ဖြစ်ပေါ်စေခဲ့တဲ့ file ရဲ့ နာမည် ဖြစ်ပါတယ်။

Platform အများစုမှာ directory ထဲမှာ filename တစ်ခု ပေါ်လာတိုင်း သို့မဟုတ် ပျောက်ကွယ်သွားတိုင်း `'rename'` ကို emit လုပ်ပါတယ်။

Listener callback ကို {fs.FSWatcher} က ထုတ်လွှတ်တဲ့ `'change'` event မှာ ချိတ်တွဲထားပေမယ့် — ၎င်းက `eventType` ရဲ့ `'change'` တန်ဖိုးနဲ့တော့ တစ်ခုတည်း မဟုတ်ပါဘူး။

`signal` တစ်ခုကို ဖြတ်သန်းပေးထားရင် — သက်ဆိုင်တဲ့ AbortController ကို abort လုပ်လိုက်တာက ပြန်ပေးလိုက်တဲ့ {fs.FSWatcher} ကို ပိတ်ပစ်ပါလိမ့်မယ်။

#### သတိပြုစရာများ (Caveats)

`fs.watch` API က platform တွေအနှံ့ 100% တသမတ်တည်း မဟုတ်ပဲ — အခြေအနေအချို့မှာ မရရှိနိုင်ပါဘူး။

Windows မှာ watch လုပ်ထားတဲ့ directory ကို ရွှေ့ပြောင်းခြင်း သို့မဟုတ် နာမည်ပြောင်းခြင်း ခံရရင် events တွေ ဘာမှ emit လုပ်မှာ မဟုတ်ပါဘူး။ Watch လုပ်ထားတဲ့ directory ကို ဖျက်လိုက်တဲ့အခါ `EPERM` error တစ်ခုကို အစီရင်ခံပါတယ်။

`fs.watch` API က file system ပေါ်မှာ အန္တရာယ်ပြုတဲ့ (malicious) လုပ်ဆောင်မှုတွေကို ကာကွယ်ပေးမှု တစ်စုံတစ်ရာ မရှိပါဘူး။ ဥပမာ — Windows မှာ ၎င်းကို file တစ်ခုချင်းစီအစား directory တစ်ခုအတွင်းက ပြောင်းလဲမှုတွေကို စောင့်ကြည့်ခြင်းအားဖြင့် အကောင်အထည်ဖော်ထားပါတယ်။ ဒါက file တစ်ခုကို အစားထိုးလို့ ရစေပြီး — fs က filename တူတဲ့ file အသစ်ပေါ်မှာ ပြောင်းလဲမှုတွေကို အစီရင်ခံနိုင်စေပါတယ်။

##### ရရှိနိုင်မှု (Availability)

ဒီ feature က — file system ပြောင်းလဲမှုတွေအကြောင်း အသိပေးချက် ရရှိဖို့ နည်းလမ်းတစ်ခု ပံ့ပိုးပေးတဲ့ — underlying operating system အပေါ်မှာ မူတည်ပါတယ်။

* Linux systems တွေမှာ [`inotify(7)`][] ကို သုံးပါတယ်။
* BSD systems တွေမှာ [`kqueue(2)`][] ကို သုံးပါတယ်။
* macOS မှာ files တွေအတွက် [`kqueue(2)`][] ကို သုံးပြီး — directories တွေအတွက် [`FSEvents`][] ကို သုံးပါတယ်။
* SunOS systems တွေ (Solaris နဲ့ SmartOS အပါအဝင်) မှာ [`event ports`][] ကို သုံးပါတယ်။
* Windows systems တွေမှာ ဒီ feature က [`ReadDirectoryChangesW`][] အပေါ် မူတည်ပါတယ်။
* AIX systems တွေမှာ ဒီ feature က enable လုပ်ထားရမယ့် [`AHAFS`][] အပေါ် မူတည်ပါတယ်။
* IBM i systems တွေမှာတော့ ဒီ feature ကို support မလုပ်ပါဘူး။

ဘယ်အကြောင်းကြောင့်ပဲ ဖြစ်ဖြစ် underlying functionality မရရှိနိုင်ဘူးဆိုရင် — `fs.watch()` က လုပ်ဆောင်နိုင်မှာ မဟုတ်ပဲ exception တစ်ခုကို throw လုပ်နိုင်ပါတယ်။ ဥပမာ — network file systems (NFS, SMB စသည်) သို့မဟုတ် Vagrant, Docker လိုမျိုး virtualization software တွေကို သုံးတဲ့အခါ host file systems တွေပေါ်မှာ — files သို့မဟုတ် directories တွေကို စောင့်ကြည့်တာက စိတ်မချရပဲ — အခြေအနေအချို့မှာ မဖြစ်နိုင်ပါဘူး။

Stat polling ကို သုံးတဲ့ `fs.watchFile()` ကို သုံးဖို့တော့ ဖြစ်နိုင်ပါသေးတယ် — ဒါပေမယ့် ဒီ method က ပိုနှေးပြီး စိတ်ချရမှု နည်းပါတယ်။

##### Inode များ (Inodes)

Linux နဲ့ macOS systems တွေမှာ `fs.watch()` က path ကို [inode][] တစ်ခုဆီ resolve လုပ်ပြီး — အဲဒီ inode ကို စောင့်ကြည့်ပါတယ်။ Watch လုပ်ထားတဲ့ path ကို ဖျက်ပြီး ပြန်ဖန်တီးလိုက်ရင် ၎င်းကို inode အသစ်တစ်ခု သတ်မှတ်ပေးပါတယ်။ Watch က ဖျက်လိုက်တာအတွက် event တစ်ခုကို emit လုပ်ပေမယ့် — _မူရင်း_ (original) inode ကို ဆက်ပြီး စောင့်ကြည့်နေပါလိမ့်မယ်။ Inode အသစ်အတွက် events တွေကို emit လုပ်မှာ မဟုတ်ပါဘူး။ ဒါက မျှော်လင့်ထားတဲ့ အပြုအမူပါ။

AIX မှာ files တွေက file တစ်ခုရဲ့ သက်တမ်းတစ်လျှောက်လုံး inode တစ်ခုတည်းကို ထိန်းသိမ်းထားပါတယ်။ AIX မှာ watch လုပ်ထားတဲ့ file တစ်ခုကို သိမ်းပြီး ပိတ်လိုက်ရင် အသိပေးချက် နှစ်ခု (တစ်ခုက content အသစ် ထပ်ဖြည့်လိုက်တာအတွက် ဖြစ်ပြီး — နောက်တစ်ခုက truncation အတွက်) ရရှိပါလိမ့်မယ်။

##### Filename argument ပေးပို့ခြင်း (Filename argument)

Callback ထဲမှာ `filename` argument ကို ပေးပို့တာက Linux, macOS, Windows နဲ့ AIX တွေမှာသာ support လုပ်ပါတယ်။ Support လုပ်တဲ့ platforms တွေပေါ်မှာတောင် `filename` ကို အမြဲတမ်း ပေးပို့ဖို့ အာမခံချက် မရှိပါဘူး။ ဒါကြောင့် callback ထဲမှာ `filename` argument က အမြဲတမ်း ပါမယ်လို့ မမှတ်ယူပဲ — ၎င်းက `null` ဖြစ်နေရင် အတွက် fallback logic (အစားထိုး ကိုင်တွယ်မှု ယန္တရား) တစ်ခုခု ထားရှိပါ။

```mjs
import { watch } from 'node:fs';
watch('somedir', (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if (filename) {
    console.log(`filename provided: ${filename}`);
  } else {
    console.log('filename not provided');
  }
});
```

### `fs.watchFile(filename[, options], listener)`

* `filename` {string|Buffer|URL}
* `options` {Object}
  * `bigint` {boolean} **Default:** `false`
  * `persistent` {boolean} **Default:** `true`
  * `interval` {integer} **Default:** `5007`
* `listener` {Function}
  * `current` {fs.Stats}
  * `previous` {fs.Stats}
* Returns: {fs.StatWatcher}

`filename` ပေါ်မှာ ပြောင်းလဲမှုတွေကို စောင့်ကြည့်ပါတယ်။ File ကို access လုပ်တိုင်း `listener` callback ကို ခေါ်ပါလိမ့်မယ်။

`options` argument ကို ချန်လှပ်ထားနိုင်ပါတယ်။ ပေးမယ်ဆိုရင်တော့ object တစ်ခု ဖြစ်သင့်ပါတယ်။ `options` object ထဲမှာ — files တွေကို watch လုပ်နေသရွေ့ process က ဆက်လည်ပတ်နေသင့်လားဆိုတာကို ဖော်ပြတဲ့ `persistent` ဆိုတဲ့ boolean တစ်ခု ပါဝင်နိုင်ပါတယ်။ `options` object က target ကို milliseconds နဲ့ ဘယ်နှစ်ကြိမ်တိုင်း poll လုပ်ရမယ်ဆိုတာကို ဖော်ပြတဲ့ `interval` property တစ်ခုကိုလည်း သတ်မှတ်နိုင်ပါတယ်။

`listener` က arguments နှစ်ခု — လက်ရှိ stat object နဲ့ ယခင် stat object — ကို လက်ခံရရှိပါတယ်:

```mjs
import { watchFile } from 'node:fs';

watchFile('message.text', (curr, prev) => {
  console.log(`the current mtime is: ${curr.mtime}`);
  console.log(`the previous mtime was: ${prev.mtime}`);
});
```

ဒီ stat objects တွေက `fs.Stat` ရဲ့ instances တွေပါ။ `bigint` option က `true` ဆိုရင် ဒီ objects တွေထဲက numeric values တွေကို `BigInt` တွေအနေနဲ့ သတ်မှတ်ပါတယ်။

File ကို access လုပ်တာသာမက — ပြုပြင် (modify) လုပ်တဲ့အခါမှာပါ အသိပေးချက် ရဖို့ဆိုရင် `curr.mtimeMs` နဲ့ `prev.mtimeMs` တို့ကို နှိုင်းယှဉ်ကြည့်ဖို့ လိုအပ်ပါတယ်။

`fs.watchFile` operation တစ်ခုက `ENOENT` error တစ်ခု ဖြစ်ပေါ်စေတဲ့အခါ — fields တွေ အားလုံး zeroed (dates တွေအတွက်တော့ Unix Epoch) ဖြစ်နေတဲ့ အနေအထားနဲ့ — listener ကို တစ်ကြိမ် ခေါ်ပါလိမ့်မယ်။ File ကို နောက်ပိုင်းမှာ ဖန်တီးလိုက်ရင် နောက်ဆုံး stat objects တွေနဲ့အတူ listener ကို ထပ်ခေါ်ပါလိမ့်မယ်။ ဒါက v0.10 ကတည်းက functionality ပိုင်း ပြောင်းလဲမှုတစ်ခုပါ။

`fs.watchFile` နဲ့ `fs.unwatchFile` တို့ထက် [`fs.watch()`][] က ပိုထိရောက်ပါတယ်။ ဖြစ်နိုင်ရင် `fs.watchFile` နဲ့ `fs.unwatchFile` တို့အစား `fs.watch` ကို သုံးသင့်ပါတယ်။

`fs.watchFile()` က စောင့်ကြည့်နေတဲ့ file တစ်ခု ပျောက်ကွယ်ပြီး ပြန်ပေါ်လာတဲ့အခါ — ဒုတိယ callback event (file ပြန်ပေါ်လာခြင်း) ထဲက `previous` ရဲ့ contents တွေက ပထမ callback event (၎င်း ပျောက်ကွယ်ခြင်း) ထဲက `previous` ရဲ့ contents တွေနဲ့ အတူတူ ဖြစ်ပါလိမ့်မယ်။

ဒါက ဘယ်အခါတွေမှာ ဖြစ်လဲဆိုတော့:

* file ကို ဖျက်လိုက်ပြီး — ပြန်ထားရှိ (restore) ခံရတဲ့အခါ
* file ကို နာမည်ပြောင်းပြီး — နောက်တစ်ခါ မူရင်း နာမည်ဆီကို ဒုတိယအကြိမ် ပြန်ပြောင်းခံရတဲ့အခါ

### `fs.write(fd, buffer, offset[, length[, position]], callback)`

* `fd` {integer}
* `buffer` {Buffer|TypedArray|DataView}
* `offset` {integer} **Default:** `0`
* `length` {integer} **Default:** `buffer.byteLength - offset`
* `position` {integer|null} **Default:** `null`
* `callback` {Function}
  * `err` {Error}
  * `bytesWritten` {integer}
  * `buffer` {Buffer|TypedArray|DataView}

`fd` နဲ့ သတ်မှတ်ထားတဲ့ file ဆီကို `buffer` ကို ရေးသားပါတယ်။

`offset` က ရေးသားရမယ့် buffer ရဲ့ အပိုင်းကို သတ်မှတ်ပြီး — `length` က ရေးသားရမယ့် bytes အရေအတွက်ကို သတ်မှတ်တဲ့ integer တစ်ခုပါ။

`position` က ဒီ data ကို ရေးသားရမယ့် file ရဲ့ အစကနေ offset ကို ရည်ညွှန်းပါတယ်။ `typeof position !== 'number'` ဆိုရင် data ကို လက်ရှိ အနေအထားမှာ ရေးသားပါလိမ့်မယ်။ pwrite(2) ကို ကြည့်ပါ။

Callback ဆီကို arguments သုံးခု `(err, bytesWritten, buffer)` ဖြတ်သန်းပေးပြီး — `bytesWritten` က `buffer` ကနေ ရေးသားလိုက်တဲ့ _bytes_ အရေအတွက်ကို သတ်မှတ်ပါတယ်။

ဒီ method ကို [`util.promisify()`][] လုပ်ထားတဲ့ version အနေနဲ့ ခေါ်ယူလိုက်ရင် — `bytesWritten` နဲ့ `buffer` properties တွေ ပါတဲ့ `Object` တစ်ခုအတွက် promise တစ်ခုကို ပြန်ပေးပါတယ်။

Callback ကို မစောင့်ပဲ `fs.write()` ကို file တစ်ခုတည်းပေါ်မှာ အကြိမ်များစွာ သုံးတာက မလုံခြုံပါဘူး။ ဒီလို အခြေအနေမျိုးအတွက် [`fs.createWriteStream()`][] ကို အကြံပြုပါတယ်။

Linux မှာ file ကို append mode နဲ့ ဖွင့်ထားရင် positional writes တွေ အလုပ်မလုပ်ပါဘူး။ Kernel က position argument ကို လျစ်လျူရှုပြီး — data တွေကို file ရဲ့ အဆုံးမှာ အမြဲတမ်း append လုပ်ပါတယ်။

### `fs.write(fd, buffer[, options], callback)`

* `fd` {integer}
* `buffer` {Buffer|TypedArray|DataView}
* `options` {Object}
  * `offset` {integer} **Default:** `0`
  * `length` {integer} **Default:** `buffer.byteLength - offset`
  * `position` {integer|null} **Default:** `null`
* `callback` {Function}
  * `err` {Error}
  * `bytesWritten` {integer}
  * `buffer` {Buffer|TypedArray|DataView}

`fd` နဲ့ သတ်မှတ်ထားတဲ့ file ဆီကို `buffer` ကို ရေးသားပါတယ်။

အပေါ်က `fs.write` function နဲ့ ဆင်တူပြီး — ဒီ version က optional `options` object တစ်ခုကို လက်ခံပါတယ်။ `options` object တစ်ခုမှ သတ်မှတ်မပေးထားဘူးဆိုရင် အပေါ်က တန်ဖိုးတွေနဲ့ပဲ default ဖြစ်ပါလိမ့်မယ်။

### `fs.write(fd, string[, position[, encoding]], callback)`

* `fd` {integer}
* `string` {string}
* `position` {integer|null} **Default:** `null`
* `encoding` {string} **Default:** `'utf8'`
* `callback` {Function}
  * `err` {Error}
  * `written` {integer}
  * `string` {string}

`fd` နဲ့ သတ်မှတ်ထားတဲ့ file ဆီကို `string` ကို ရေးသားပါတယ်။ `string` က string တစ်ခု မဟုတ်ဘူးဆိုရင် exception တစ်ခုကို throw လုပ်ပါတယ်။

`position` က ဒီ data ကို ရေးသားရမယ့် file ရဲ့ အစကနေ offset ကို ရည်ညွှန်းပါတယ်။ `typeof position !== 'number'` ဆိုရင် data ကို လက်ရှိ အနေအထားမှာ ရေးသားပါလိမ့်မယ်။ pwrite(2) ကို ကြည့်ပါ။

`encoding` က မျှော်လင့်ထားတဲ့ string encoding ပါ။

Callback က arguments `(err, written, string)` တွေကို လက်ခံရရှိပြီး — `written` က ဖြတ်သန်းပေးလိုက်တဲ့ string ကို ရေးသားဖို့ လိုအပ်ခဲ့တဲ့ _bytes_ အရေအတွက်ကို သတ်မှတ်ပါတယ်။ ရေးသားလိုက်တဲ့ bytes တွေက string characters တွေရဲ့ အရေအတွက်နဲ့ မတူညီနိုင်ပါဘူး။ [`Buffer.byteLength`][] ကို ကြည့်ပါ။

Callback ကို မစောင့်ပဲ `fs.write()` ကို file တစ်ခုတည်းပေါ်မှာ အကြိမ်များစွာ သုံးတာက မလုံခြုံပါဘူး။ ဒီလို အခြေအနေမျိုးအတွက် [`fs.createWriteStream()`][] ကို အကြံပြုပါတယ်။

Linux မှာ file ကို append mode နဲ့ ဖွင့်ထားရင် positional writes တွေ အလုပ်မလုပ်ပါဘူး။ Kernel က position argument ကို လျစ်လျူရှုပြီး — data တွေကို file ရဲ့ အဆုံးမှာ အမြဲတမ်း append လုပ်ပါတယ်။

Windows မှာ file descriptor က console တစ်ခုနဲ့ ချိတ်ဆက်ထားရင် (ဥပမာ — `fd == 1` သို့မဟုတ် `stdout`) — သုံးထားတဲ့ encoding ဘယ်လိုပဲ ရှိပါစေ — non-ASCII characters တွေ ပါဝင်တဲ့ string တစ်ခုကို default အနေနဲ့ ကောင်းမွန်စွာ ပြသနိုင်မှာ မဟုတ်ပါဘူး။ `chcp 65001` command နဲ့ active codepage ကို ပြောင်းလဲခြင်းအားဖြင့် console ကို UTF-8 ကောင်းမွန်စွာ ပြသနိုင်အောင် configure လုပ်နိုင်ပါတယ်။ အသေးစိတ်အတွက် [chcp][] docs ကို ကြည့်ပါ။

### `fs.writeFile(file, data[, options], callback)`

* `file` {string|Buffer|URL|integer} filename သို့မဟုတ် file descriptor ပါ
* `data` {string|Buffer|TypedArray|DataView}
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `'utf8'`
  * `mode` {integer} **Default:** `0o666`
  * `flag` {string} [support of file system `flags`][] ကို ကြည့်ပါ။ **Default:** `'w'`.
  * `flush` {boolean} Data တွေ အားလုံးကို file ထဲကို အောင်မြင်စွာ ရေးသားပြီးတဲ့အခါ — `flush` က `true` ဆိုရင် — data တွေကို flush လုပ်ဖို့ `fs.fsync()` ကို သုံးပါတယ်။ **Default:** `false`.
  * `signal` {AbortSignal} လုပ်ဆောင်နေဆဲ writeFile တစ်ခုကို abort လုပ်ဖို့ ခွင့်ပြုပါတယ်
* `callback` {Function}
  * `err` {Error|AggregateError}

`file` က filename တစ်ခုဆိုရင် — file ရှိပြီးသားဆိုရင် အစားထိုးပြီး — data တွေကို file ထဲကို asynchronously ရေးသားပါတယ်။ `data` က string တစ်ခု သို့မဟုတ် buffer တစ်ခု ဖြစ်နိုင်ပါတယ်။

`file` က file descriptor တစ်ခုဆိုရင် — အပြုအမူက `fs.write()` ကို တိုက်ရိုက် ခေါ်တာနဲ့ (အကြံပြုထားတာက) ဆင်တူပါတယ်။ File descriptor တစ်ခုကို သုံးခြင်းနဲ့ ပတ်သက်တဲ့ အောက်က မှတ်စုတွေကို ကြည့်ပါ။

`data` က buffer တစ်ခုဆိုရင် `encoding` option ကို လျစ်လျူရှုပါတယ်။

`mode` option က အသစ်ဖန်တီးလိုက်တဲ့ file ကိုသာ သက်ရောက်မှု ရှိပါတယ်။ အသေးစိတ်ကို [`fs.open()`][] မှာ ကြည့်ပါ။

```mjs
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
```

`options` က string တစ်ခုဆိုရင် ၎င်းက encoding ကို သတ်မှတ်ပေးပါတယ်:

```mjs
import { writeFile } from 'node:fs';

writeFile('message.txt', 'Hello Node.js', 'utf8', callback);
```

Callback ကို မစောင့်ပဲ `fs.writeFile()` ကို file တစ်ခုတည်းပေါ်မှာ အကြိမ်များစွာ သုံးတာက မလုံခြုံပါဘူး။ ဒီလို အခြေအနေမျိုးအတွက် [`fs.createWriteStream()`][] ကို အကြံပြုပါတယ်။

`fs.readFile` လိုပဲ — `fs.writeFile` က — ၎င်းဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ buffer ကို ရေးသားဖို့ အတွင်းပိုင်းမှာ `write` calls အများအပြားကို လုပ်ဆောင်ပေးတဲ့ convenience method (အဆင်ပြေစေတဲ့ method) တစ်ခုပါ။ Performance အရ အရေးကြီးတဲ့ code တွေအတွက်တော့ [`fs.createWriteStream()`][] ကို သုံးဖို့ စဉ်းစားပါ။

{AbortSignal} တစ်ခုကို သုံးပြီး `fs.writeFile()` တစ်ခုကို ပယ်ဖျက်နိုင်ပါတယ်။ Cancelation (ပယ်ဖျက်ခြင်း) က "best effort" (တတ်နိုင်သမျှ ကြိုးစား) သဘောသာ ဖြစ်ပြီး — data အချို့ပမာဏ ရေးသားပြီး ဖြစ်နေနိုင်ပါသေးတယ်။

```mjs
import { writeFile } from 'node:fs';
import { Buffer } from 'node:buffer';

const controller = new AbortController();
const { signal } = controller;
const data = new Uint8Array(Buffer.from('Hello Node.js'));
writeFile('message.txt', data, { signal }, (err) => {
  // When a request is aborted - the callback is called with an AbortError
});
// When the request should be aborted
controller.abort();
```

လုပ်ဆောင်နေဆဲ request တစ်ခုကို abort လုပ်တာက operating system requests တစ်ခုချင်းစီကို abort လုပ်တာ မဟုတ်ပဲ — `fs.writeFile` က လုပ်ဆောင်တဲ့ internal buffering ကိုသာ abort လုပ်ပါတယ်။

#### Using `fs.writeFile()` with file descriptors

`file` က file descriptor တစ်ခုဆိုရင် — အပြုအမူက အောက်ပါအတိုင်း `fs.write()` ကို တိုက်ရိုက် ခေါ်တာနဲ့ နီးပါး တူညီပါတယ်:

```mjs
import { write } from 'node:fs';
import { Buffer } from 'node:buffer';

write(fd, Buffer.from(data, options.encoding), callback);
```

`fs.write()` ကို တိုက်ရိုက် ခေါ်တာနဲ့ ကွာခြားချက်က — ပုံမှန်မဟုတ်တဲ့ အခြေအနေအချို့အောက်မှာ `fs.write()` က buffer ရဲ့ အစိတ်အပိုင်းကိုသာ ရေးသားနိုင်ပြီး — ကျန်တဲ့ data တွေကို ရေးသားဖို့ ပြန်ကြိုးစား (retry) ရနိုင်တာပါ — `fs.writeFile()` ကတော့ data တွေ လုံးဝ ရေးသားပြီးမြောက်သည်အထိ (သို့မဟုတ် error တစ်ခု ဖြစ်သည်အထိ) retry လုပ်ပါတယ်။

ဒီအချက်ရဲ့ သက်ရောက်မှုတွေက ရှုပ်ထွေးမှုတွေရဲ့ အဖြစ်များတဲ့ အရင်းအမြစ်တစ်ခုပါ။ File descriptor ကိစ္စမှာ — file ကို အစားထိုးတာ မဟုတ်ပါဘူး! Data တွေကို file ရဲ့ အစမှာ ရေးသားဖို့ မလိုအပ်ပဲ — file ရဲ့ မူရင်း data တွေက အသစ် ရေးသားလိုက်တဲ့ data တွေရဲ့ ရှေ့နဲ့/သို့မဟုတ် နောက်မှာ ကျန်ရှိနေနိုင်ပါတယ်။

ဥပမာ — `fs.writeFile()` ကို ဆက်တိုက် နှစ်ကြိမ် ခေါ်ပြီး — ပထမဆုံး `'Hello'` ဆိုတဲ့ string ကို ရေးပြီး — နောက် `', World'` ဆိုတဲ့ string ကို ရေးလိုက်တယ်ဆိုရင် — file ထဲမှာ `'Hello, World'` ပါဝင်ပြီး — file ရဲ့ မူရင်း data အချို့လည်း ပါဝင်နိုင်ပါတယ် (မူရင်း file ရဲ့ အရွယ်အစားနဲ့ file descriptor ရဲ့ အနေအထားပေါ် မူတည်ပြီး)။ Descriptor အစား filename တစ်ခုကို သုံးခဲ့မယ်ဆိုရင် file ထဲမှာ `', World'` တစ်ခုတည်းသာ ပါဝင်မယ်လို့ အာမခံပါလိမ့်မယ်။

### `fs.writev(fd, buffers[, position], callback)`

* `fd` {integer}
* `buffers` {ArrayBufferView\[]}
* `position` {integer|null} **Default:** `null`
* `callback` {Function}
  * `err` {Error}
  * `bytesWritten` {integer}
  * `buffers` {ArrayBufferView\[]}

`fd` နဲ့ သတ်မှတ်ထားတဲ့ file ဆီကို — `writev()` ကို သုံးပြီး — `ArrayBufferView` တွေရဲ့ array တစ်ခုကို ရေးသားပါတယ်။

`position` က ဒီ data ကို ရေးသားရမယ့် file ရဲ့ အစကနေ offset ပါ။ `typeof position !== 'number'` ဆိုရင် data ကို လက်ရှိ အနေအထားမှာ ရေးသားပါလိမ့်မယ်။

Callback ဆီကို arguments သုံးခု — `err`, `bytesWritten` နဲ့ `buffers` — ဖြတ်သန်းပေးပါလိမ့်မယ်။ `bytesWritten` က `buffers` ကနေ ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

ဒီ method ကို [`util.promisify()`][] လုပ်ထားရင် — `bytesWritten` နဲ့ `buffers` properties တွေ ပါတဲ့ `Object` တစ်ခုအတွက် promise တစ်ခုကို ပြန်ပေးပါတယ်။

Callback ကို မစောင့်ပဲ `fs.writev()` ကို file တစ်ခုတည်းပေါ်မှာ အကြိမ်များစွာ သုံးတာက မလုံခြုံပါဘူး။ ဒီလို အခြေအနေမျိုးအတွက် [`fs.createWriteStream()`][] ကို သုံးပါ။

Linux မှာ file ကို append mode နဲ့ ဖွင့်ထားရင် positional writes တွေ အလုပ်မလုပ်ပါဘူး။ Kernel က position argument ကို လျစ်လျူရှုပြီး — data တွေကို file ရဲ့ အဆုံးမှာ အမြဲတမ်း append လုပ်ပါတယ်။

## Synchronous API (synchronous အခြေပြု API)

Synchronous APIs တွေက operations တွေ အားလုံးကို synchronously လုပ်ဆောင်ပြီး — operation က ပြီးစီးသည် သို့မဟုတ် မအောင်မြင်သည်အထိ — event loop ကို ပိတ်ဆို့ (block) ထားပါတယ်။

### `fs.accessSync(path[, mode])`

* `path` {string|Buffer|URL}
* `mode` {integer} **Default:** `fs.constants.F_OK`

`path` နဲ့ သတ်မှတ်ထားတဲ့ file သို့မဟုတ် directory အတွက် user တစ်ယောက်ရဲ့ permissions တွေကို synchronously စစ်ဆေးပါတယ်။ `mode` argument က လုပ်ဆောင်ရမယ့် accessibility checks (ဝင်ရောက်နိုင်မှု စစ်ဆေးချက်များ) တွေကို သတ်မှတ်ပေးတဲ့ optional integer တစ်ခုပါ။ `mode` က `fs.constants.F_OK` တန်ဖိုး သို့မဟုတ် — `fs.constants.R_OK`, `fs.constants.W_OK` နဲ့ `fs.constants.X_OK` တွေထဲက တစ်ခုခုရဲ့ bitwise OR နဲ့ ဖွဲ့စည်းထားတဲ့ mask (e.g. `fs.constants.W_OK | fs.constants.R_OK`) — တစ်ခုခု ဖြစ်ရပါမယ်။ `mode` ရဲ့ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေအတွက် [File access constants][] ကို ကြည့်ပါ။

Accessibility checks တွေထဲက တစ်ခုခု မအောင်မြင်ခဲ့ရင် `Error` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ မဟုတ်ရင်တော့ method က `undefined` ကို ပြန်ပေးပါလိမ့်မယ်။

```mjs
import { accessSync, constants } from 'node:fs';

try {
  accessSync('etc/passwd', constants.R_OK | constants.W_OK);
  console.log('can read/write');
} catch (err) {
  console.error('no access!');
}
```

### `fs.appendFileSync(path, data[, options])`

* `path` {string|Buffer|URL|number} filename သို့မဟုတ် file descriptor ပါ
* `data` {string|Buffer}
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `'utf8'`
  * `mode` {integer} **Default:** `0o666`
  * `flag` {string} [support of file system `flags`][] ကို ကြည့်ပါ။ **Default:** `'a'`.
  * `flush` {boolean} `true` ဆိုရင် — မပိတ်ခင် — underlying file descriptor ကို flush လုပ်ပါတယ်။ **Default:** `false`.

Data တွေကို file တစ်ခုဆီကို synchronously append လုပ်ပြီး — file က မရှိသေးဘူးဆိုရင် ဖန်တီးပေးပါတယ်။ `data` က string တစ်ခု သို့မဟုတ် {Buffer} တစ်ခု ဖြစ်နိုင်ပါတယ်။

`mode` option က အသစ်ဖန်တီးလိုက်တဲ့ file ကိုသာ သက်ရောက်မှု ရှိပါတယ်။ အသေးစိတ်ကို [`fs.open()`][] မှာ ကြည့်ပါ။

```mjs
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append');
  console.log('The "data to append" was appended to file!');
} catch (err) {
  /* Handle the error */
}
```

`options` က string တစ်ခုဆိုရင် ၎င်းက encoding ကို သတ်မှတ်ပေးပါတယ်:

```mjs
import { appendFileSync } from 'node:fs';

appendFileSync('message.txt', 'data to append', 'utf8');
```

`path` ကို appending အတွက် ဖွင့်ထားတဲ့ (`fs.open()` သို့မဟုတ် `fs.openSync()` ကို သုံးပြီး) numeric file descriptor တစ်ခုအနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ File descriptor ကို အလိုအလျောက် ပိတ်ပေးမှာ မဟုတ်ပါဘူး။

```mjs
import { openSync, closeSync, appendFileSync } from 'node:fs';

let fd;

try {
  fd = openSync('message.txt', 'a');
  appendFileSync(fd, 'data to append', 'utf8');
} catch (err) {
  /* Handle the error */
} finally {
  if (fd !== undefined)
    closeSync(fd);
}
```

### `fs.chmodSync(path, mode)`

* `path` {string|Buffer|URL}
* `mode` {string|integer}

အသေးစိတ် အချက်အလက်တွေအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.chmod()`][] ရဲ့ documentation ကို ကြည့်ပါ။

အသေးစိတ်အတွက် POSIX chmod(2) documentation ကို ကြည့်ပါ။
### `fs.chownSync(path, uid, gid)`

* `path` {string|Buffer|URL}
* `uid` {integer}
* `gid` {integer}

File တစ်ခုရဲ့ owner နဲ့ group ကို synchronously ပြောင်းလဲပေးပါတယ်။ `undefined` ကို ပြန်ပေးပါတယ်။ ဒါဟာ [`fs.chown()`][] ရဲ့ synchronous version ဖြစ်ပါတယ်။

အသေးစိတ်အတွက် POSIX chown(2) documentation ကို ကြည့်ပါ။

### `fs.closeSync(fd)`

* `fd` {integer}

File descriptor ကို ပိတ်ပါတယ်။ `undefined` ကို ပြန်ပေးပါတယ်။

တခြား `fs` operation တစ်ခုခုကနေတစ်ဆင့် လက်ရှိ အသုံးပြုနေတဲ့ file descriptor (`fd`) တစ်ခုခုပေါ်မှာ `fs.closeSync()` ကို ခေါ်တာက undefined behavior (သတ်မှတ်မထားသော အပြုအမူ) တစ်ခုဆီကို ဦးတည်သွားစေနိုင်ပါတယ်။

အသေးစိတ်အတွက် POSIX close(2) documentation ကို ကြည့်ပါ။

### `fs.copyFileSync(src, dest[, mode])`

* `src` {string|Buffer|URL} ကူးယူရမယ့် source filename ပါ
* `dest` {string|Buffer|URL} Copy operation ရဲ့ destination filename ပါ
* `mode` {integer} Copy operation အတွက် modifiers (ပြုပြင်မွမ်းမံမှုများ) တွေပါ။ **Default:** `0`.

`src` ကို `dest` ဆီကို synchronously ကူးယူပါတယ်။ Default အနေနဲ့ `dest` က ရှိပြီးသားဆိုရင် အစားထိုး (overwrite) လုပ်ပါတယ်။ `undefined` ကို ပြန်ပေးပါတယ်။ Copy operation ရဲ့ atomicity (တစ်စုတစ်ဝိုင်းတည်း ပြီးမြောက်မှု) အကြောင်းကို Node.js က အာမခံချက် မပေးပါဘူး။ Destination file ကို writing အတွက် ဖွင့်ပြီးနောက်မှာ error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် destination ကို ဖယ်ရှားဖို့ Node.js က ကြိုးစားပါလိမ့်မယ်။

Symbolic links တွေကို လိုက်၍ ဖြေရှင်း (follow) ပါတယ်။ `src` က symbolic link တစ်ခုဆိုရင် target file ကို ကူးယူပါတယ်။ `dest` က symbolic link တစ်ခုဆိုရင် — `mode` ထဲမှာ `fs.constants.COPYFILE_EXCL` မပါဝင်သရွေ့ — target file ကို အစားထိုး ရေးသားပါတယ်။

`mode` က copy operation ရဲ့ အပြုအမူကို သတ်မှတ်ပေးတဲ့ optional integer တစ်ခုပါ။ တန်ဖိုး နှစ်ခု သို့မဟုတ် နှစ်ခုထက်ပိုတာတွေရဲ့ bitwise OR နဲ့ ဖွဲ့စည်းထားတဲ့ mask တစ်ခုကို ဖန်တီးနိုင်ပါတယ် (e.g. `fs.constants.COPYFILE_EXCL | fs.constants.COPYFILE_FICLONE`)။

* `fs.constants.COPYFILE_EXCL`: `dest` က ရှိပြီးသားဆိုရင် copy operation က မအောင်မြင်ပါဘူး။
* `fs.constants.COPYFILE_FICLONE`: Copy operation က copy-on-write reflink (ကူးရေးချိန်မှ ကူးယူသော reflink) တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားပါတယ်။ Platform က copy-on-write ကို support မလုပ်ဘူးဆိုရင် fallback copy mechanism (နောက်ဆုတ် ကူးယူမှု ယန္တရား) တစ်ခုကို သုံးပါတယ်။
* `fs.constants.COPYFILE_FICLONE_FORCE`: Copy operation က copy-on-write reflink တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားပါတယ်။ Platform က copy-on-write ကို support မလုပ်ဘူးဆိုရင် operation က မအောင်မြင်ပါဘူး။

```mjs
import { copyFileSync, constants } from 'node:fs';

// destination.txt will be created or overwritten by default.
copyFileSync('source.txt', 'destination.txt');
console.log('source.txt was copied to destination.txt');

// By using COPYFILE_EXCL, the operation will fail if destination.txt exists.
copyFileSync('source.txt', 'destination.txt', constants.COPYFILE_EXCL);
```

### `fs.cpSync(src, dest[, options])`

* `src` {string|URL} ကူးယူရမယ့် source path ပါ။
* `dest` {string|URL} ကူးယူရမယ့် destination path ပါ။
* `options` {Object}
  * `dereference` {boolean} Symlinks တွေကို dereference (ကိုယ်တိုင် သွားရောက် ဖြေရှင်း) လုပ်ပါတယ်။ **Default:** `false`.
  * `errorOnExist` {boolean} `force` က `false` ဖြစ်ပြီး destination က ရှိနေတဲ့အခါ error တစ်ခုကို throw လုပ်ပါတယ်။ **Default:** `false`.
  * `filter` {Function} Copied files/directories တွေကို filter လုပ်ဖို့ function တစ်ခုပါ။ Item တစ်ခုကို ကူးယူဖို့ `true` ကို ပြန်ပေးပြီး — လျစ်လျူရှုဖို့ `false` ကို ပြန်ပေးပါတယ်။ Directory တစ်ခုကို လျစ်လျူရှုတဲ့အခါ ၎င်းရဲ့ contents တွေ အားလုံးကိုပါ ကျော်သွားပါလိမ့်မယ်။ **Default:** `undefined`
    * `src` {string} ကူးယူရမယ့် source path ပါ။
    * `dest` {string} ကူးယူရမယ့် destination path ပါ။
    * Returns: {boolean} `boolean` အဖြစ် ပြောင်းလဲလို့ရတဲ့ (coercible) `Promise` မဟုတ်တဲ့ (non-`Promise`) တန်ဖိုး ဘယ်ဟာမဆို ဖြစ်ပါတယ်။
  * `force` {boolean} ရှိပြီးသား file သို့မဟုတ် directory ကို အစားထိုး ရေးသားပါတယ်။ ဒါကို `false` အဖြစ် သတ်မှတ်ပြီး destination က ရှိနေရင် copy operation က errors တွေကို လျစ်လျူရှုပါလိမ့်မယ်။ ဒီအပြုအမူကို ပြောင်းလဲဖို့ `errorOnExist` option ကို သုံးပါ။ **Default:** `true`.
  * `mode` {integer} Copy operation အတွက် modifiers တွေပါ။ **Default:** `0`. [`fs.copyFileSync()`][] ရဲ့ `mode` flag ကို ကြည့်ပါ။
  * `preserveTimestamps` {boolean} `true` ဆိုရင် `src` ကနေ timestamps တွေကို ထိန်းသိမ်း (preserve) ထားပါလိမ့်မယ်။ **Default:** `false`.
  * `recursive` {boolean} Directories တွေကို recursively ကူးယူပါတယ် **Default:** `false`
  * `verbatimSymlinks` {boolean} `true` ဆိုရင် symlinks တွေအတွက် path resolution ကို ကျော်လိုက်ပါလိမ့်မယ်။ **Default:** `false`

Directory structure တစ်ခုလုံးကို — subdirectories နဲ့ files တွေ အပါအဝင် — `src` ကနေ `dest` ဆီကို synchronously ကူးယူပါတယ်။

Directory တစ်ခုကို အခြား directory တစ်ခုဆီကို ကူးတဲ့အခါ globs တွေကို support မလုပ်ပဲ — behavior က `cp dir1/ dir2/` နဲ့ ဆင်တူပါတယ်။

### `fs.existsSync(path)`

* `path` {string|Buffer|URL}
* Returns: {boolean}

Path တည်ရှိနေရင် `true` ကို ပြန်ပေးပြီး — မဟုတ်ရင် `false` ကို ပြန်ပေးပါတယ်။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.exists()`][] documentation ကို ကြည့်ပါ။

`fs.exists()` က deprecated ဖြစ်ပေမယ့် `fs.existsSync()` ကတော့ မဟုတ်ပါဘူး။ `fs.exists()` ရဲ့ `callback` parameter က Node.js callbacks တွေ တခြားဟာတွေနဲ့ မကိုက်ညီတဲ့ (inconsistent) parameters တွေကို လက်ခံပါတယ်။ `fs.existsSync()` ကတော့ callback ကို မသုံးပါဘူး။

```mjs
import { existsSync } from 'node:fs';

if (existsSync('/etc/passwd'))
  console.log('The path exists.');
```

### `fs.fchmodSync(fd, mode)`

* `fd` {integer}
* `mode` {string|integer}

File ပေါ်က permissions တွေကို သတ်မှတ်ပေးပါတယ်။ `undefined` ကို ပြန်ပေးပါတယ်။

အသေးစိတ်အတွက် POSIX fchmod(2) documentation ကို ကြည့်ပါ။

### `fs.fchownSync(fd, uid, gid)`

* `fd` {integer}
* `uid` {integer} File ရဲ့ ပိုင်ရှင်အသစ်ရဲ့ user id ပါ။
* `gid` {integer} File ရဲ့ group အသစ်ရဲ့ group id ပါ။

File ရဲ့ owner ကို သတ်မှတ်ပေးပါတယ်။ `undefined` ကို ပြန်ပေးပါတယ်။

အသေးစိတ်အတွက် POSIX fchown(2) documentation ကို ကြည့်ပါ။

### `fs.fdatasyncSync(fd)`

* `fd` {integer}

File နဲ့ ဆက်စပ်နေတဲ့ လက်ရှိ queue တင်ထားတဲ့ I/O operations တွေ အားလုံးကို operating system ရဲ့ synchronized I/O completion state ဆီကို တွန်းပို့ပါတယ်။ အသေးစိတ်အတွက် POSIX fdatasync(2) documentation ကို ကြည့်ပါ။ `undefined` ကို ပြန်ပေးပါတယ်။

### `fs.fstatSync(fd[, options])`

* `fd` {integer}
* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.Stats} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
* Returns: {fs.Stats}

File descriptor အတွက် {fs.Stats} ကို ပြန်လည် ရယူပါတယ်။

အသေးစိတ်အတွက် POSIX fstat(2) documentation ကို ကြည့်ပါ။

### `fs.fsyncSync(fd)`

* `fd` {integer}

ဖွင့်ထားတဲ့ file descriptor အတွက် data တွေ အားလုံးကို storage device ဆီကို flush လုပ်ဖို့ တောင်းဆိုပါတယ်။ အကောင်အထည်ဖော်မှု (implementation) အသေးစိတ်ကတော့ operating system နဲ့ device အလိုက် ကွဲပြားပါတယ်။ အသေးစိတ်အတွက် POSIX fsync(2) documentation ကို ကြည့်ပါ။ `undefined` ကို ပြန်ပေးပါတယ်။

### `fs.ftruncateSync(fd[, len])`

* `fd` {integer}
* `len` {integer} **Default:** `0`

File descriptor ကို ဖြတ်တောက် (truncate) ပါတယ်။ `undefined` ကို ပြန်ပေးပါတယ်။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.ftruncate()`][] documentation ကို ကြည့်ပါ။

### `fs.futimesSync(fd, atime, mtime)`

* `fd` {integer}
* `atime` {number|string|Date}
* `mtime` {number|string|Date}

ဒါက [`fs.futimes()`][] ရဲ့ synchronous version ပါ။ `undefined` ကို ပြန်ပေးပါတယ်။

### `fs.globSync(pattern[, options])`

* `pattern` {string|string\[]}
* `options` {Object}
  * `cwd` {string|URL} လက်ရှိ working directory ပါ။ **Default:** `process.cwd()`
  * `exclude` {Function|string\[]} Files/directories တွေကို filter ထုတ်ပစ်ဖို့ function တစ်ခု သို့မဟုတ် ဖယ်ထုတ်ရမယ့် glob patterns တွေရဲ့ စာရင်းတစ်ခုပါ။ Function တစ်ခု ပေးထားရင် item တစ်ခုကို ဖယ်ထုတ်ဖို့ `true` ကို ပြန်ပေးပြီး — ထည့်သွင်းဖို့ `false` ကို ပြန်ပေးပါတယ်။ **Default:** `undefined`.
  * `followSymlinks` {boolean} `true` ဆိုရင် `**` patterns တွေကို ချဲ့ထွင်နေတဲ့အခါ directories တွေဆီကို ညွှန်ပြတဲ့ symbolic links တွေကို လိုက်၍ ဖြေရှင်းပါတယ်။ **Default:** `false`.
  * `withFileTypes` {boolean} Glob က paths တွေကို Dirents တွေအနေနဲ့ ပြန်ပေးသင့်ရင် `true` — မဟုတ်ရင် `false` ပါ။ **Default:** `false`.
* Returns: {string\[]} pattern နဲ့ ကိုက်ညီတဲ့ files တွေရဲ့ paths တွေပါ။

`followSymlinks` ကို ဖွင့်ထားတဲ့အခါ တွေ့ရှိရတဲ့ symbolic link cycles (သံသရာလည်နေသော symbolic link များ) တွေကို recursively ဖြတ်သန်း သွားလာမှာ မဟုတ်ပါဘူး။

```mjs
import { globSync } from 'node:fs';

console.log(globSync('**/*.js'));
```

```cjs
const { globSync } = require('node:fs');

console.log(globSync('**/*.js'));
```

### `fs.lchmodSync(path, mode)`

> Stability: 0 - Deprecated

* `path` {string|Buffer|URL}
* `mode` {integer}

Symbolic link တစ်ခုပေါ်က permissions တွေကို ပြောင်းလဲပေးပါတယ်။ `undefined` ကို ပြန်ပေးပါတယ်။

ဒီ method ကို macOS မှာသာ implement လုပ်ထားပါတယ်။

အသေးစိတ်အတွက် POSIX lchmod(2) documentation ကို ကြည့်ပါ။

### `fs.lchownSync(path, uid, gid)`

* `path` {string|Buffer|URL}
* `uid` {integer} File ရဲ့ ပိုင်ရှင်အသစ်ရဲ့ user id ပါ။
* `gid` {integer} File ရဲ့ group အသစ်ရဲ့ group id ပါ။

Path အတွက် owner ကို သတ်မှတ်ပေးပါတယ်။ `undefined` ကို ပြန်ပေးပါတယ်။

အသေးစိတ်အတွက် POSIX lchown(2) documentation ကို ကြည့်ပါ။

### `fs.lutimesSync(path, atime, mtime)`

* `path` {string|Buffer|URL}
* `atime` {number|string|Date}
* `mtime` {number|string|Date}

`path` က ရည်ညွှန်းတဲ့ symbolic link ရဲ့ file system timestamps တွေကို ပြောင်းလဲပေးပါတယ်။ `undefined` ကို ပြန်ပေးပြီး — parameters တွေ မမှန်ကန်တဲ့အခါ သို့မဟုတ် operation မအောင်မြင်တဲ့အခါ exception တစ်ခုကို throw လုပ်ပါတယ်။ ဒါက [`fs.lutimes()`][] ရဲ့ synchronous version ပါ။

### `fs.linkSync(existingPath, newPath)`

* `existingPath` {string|Buffer|URL}
* `newPath` {string|Buffer|URL}

`existingPath` ကနေ `newPath` ဆီကို link အသစ်တစ်ခု ဖန်တီးပေးပါတယ်။ အသေးစိတ်အတွက် POSIX link(2) documentation ကို ကြည့်ပါ။ `undefined` ကို ပြန်ပေးပါတယ်။

### `fs.lstatSync(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.Stats} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
  * `throwIfNoEntry` {boolean} `undefined` ကို ပြန်ပေးမယ့်အစား — file system entry တစ်ခုမှ မရှိဘူးဆိုရင် exception တစ်ခုကို throw လုပ်မလားဆိုတာပါ။ **Default:** `true`.
* Returns: {fs.Stats}

`path` က ရည်ညွှန်းတဲ့ symbolic link အတွက် {fs.Stats} ကို ပြန်လည် ရယူပါတယ်။

အသေးစိတ်အတွက် POSIX lstat(2) documentation ကို ကြည့်ပါ။

### `fs.mkdirSync(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object|integer}
  * `recursive` {boolean} **Default:** `false`
  * `mode` {string|integer} Windows မှာ support မလုပ်ပါဘူး။ **Default:** `0o777`.
* Returns: {string|undefined}

Directory တစ်ခုကို synchronously ဖန်တီးပါတယ်။ `undefined` ကို ပြန်ပေးပြီး — `recursive` က `true` ဆိုရင်တော့ ပထမဆုံး ဖန်တီးလိုက်တဲ့ directory path ကို ပြန်ပေးပါတယ်။ ဒါက [`fs.mkdir()`][] ရဲ့ synchronous version ပါ။

အသေးစိတ်အတွက် POSIX mkdir(2) documentation ကို ကြည့်ပါ။

### `fs.mkdtempSync(prefix[, options])`

* `prefix` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* Returns: {string}

ဖန်တီးလိုက်တဲ့ directory ရဲ့ path ကို ပြန်ပေးပါတယ်။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.mkdtemp()`][] documentation ကို ကြည့်ပါ။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။

### `fs.mkdtempDisposableSync(prefix[, options])`

* `prefix` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* Returns: {Object} Disposable object တစ်ခုပါ:
  * `path` {string} ဖန်တီးလိုက်တဲ့ directory ရဲ့ path ပါ။
  * `remove` {Function} ဖန်တီးလိုက်တဲ့ directory ကို ဖယ်ရှားပေးတဲ့ function တစ်ခုပါ။
  * `[Symbol.dispose]` {Function} `remove` နဲ့ အတူတူပါ။

`path` property မှာ ဖန်တီးလိုက်တဲ့ directory path ကို သိမ်းဆည်းထားတဲ့ disposable object တစ်ခုကို ပြန်ပေးပါတယ်။ Object ကို dispose (စွန့်ပစ်) လုပ်လိုက်တဲ့အခါ — directory က ရှိနေသေးရင် — directory နဲ့ ၎င်းရဲ့ contents တွေကို ဖယ်ရှားပါလိမ့်မယ်။ Directory ကို ဖျက်လို့ မရဘူးဆိုရင် disposal လုပ်တာက error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ Object မှာ အလားတူ လုပ်ဆောင်ချက်ကို လုပ်ပေးမယ့် `remove()` method တစ်ခု ရှိပါတယ်။

Explicit resource management (ထင်ရှားသော resource စီမံခန့်ခွဲမှု) အကြောင်း ထပ်ဆောင်း အချက်အလက်များအတွက် [MDN documentation on `using` statements][`using`] ကို ကြည့်ပါ။

အသေးစိတ် အချက်အလက်များအတွက် [`fs.mkdtemp()`][] documentation ကို ကြည့်ပါ။

ဒီ API ကို [`using`][] syntax နဲ့ သုံးဖို့ ဒီဇိုင်းထုတ်ထားတာမို့ callback-based version မရှိပါဘူး။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။

### `fs.opendirSync(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `encoding` {string|null} **Default:** `'utf8'`
  * `bufferSize` {number} Directory ကနေ ဖတ်ရှုနေတဲ့အခါ အတွင်းပိုင်း buffer လုပ်ထားတဲ့ directory entries အရေအတွက်ပါ။ တန်ဖိုး မြင့်လေလေ performance ကောင်းလေလေ ဖြစ်ပေမယ့် — memory အသုံးပြုမှု မြင့်လေလေ ဖြစ်ပါတယ်။ **Default:** `32`
  * `recursive` {boolean} **Default:** `false`
* Returns: {fs.Dir}

Directory တစ်ခုကို synchronously ဖွင့်ပါတယ်။ opendir(3) ကို ကြည့်ပါ။

{fs.Dir} တစ်ခုကို ဖန်တီးပေးပြီး — directory ထဲကနေ ဖတ်ရှုခြင်းနဲ့ directory ကို ရှင်းလင်း (clean up) လုပ်ခြင်းအတွက် နောက်ထပ် function တွေ အားလုံး ပါဝင်ပါတယ်။

`encoding` option က directory ကို ဖွင့်တဲ့အချိန်နဲ့ နောက်ဆက်တွဲ read operations တွေမှာ `path` အတွက် encoding ကို သတ်မှတ်ပေးပါတယ်။

### `fs.openSync(path[, flags[, mode]])`

* `path` {string|Buffer|URL}
* `flags` {string|number} **Default:** `'r'`.
  See [support of file system `flags`][].
* `mode` {string|integer} **Default:** `0o666`
* Returns: {number}

File descriptor ကို ကိုယ်စားပြုတဲ့ integer တစ်ခုကို ပြန်ပေးပါတယ်။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.open()`][] documentation ကို ကြည့်ပါ။

### `fs.readdirSync(path[, options])`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
  * `withFileTypes` {boolean} **Default:** `false`
  * `recursive` {boolean} `true` ဆိုရင် directory တစ်ခုရဲ့ contents တွေကို recursively ဖတ်ပါတယ်။ Recursive mode မှာ files, sub files နဲ့ directories တွေ အားလုံးကို စာရင်းပြုစုပါလိမ့်မယ်။ **Default:** `false`.
* Returns: {string\[]|Buffer\[]|fs.Dirent\[]}

Directory ရဲ့ contents တွေကို ဖတ်ပါတယ်။

အသေးစိတ်အတွက် POSIX readdir(3) documentation ကို ကြည့်ပါ။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — ပြန်ပေးလိုက်တဲ့ filenames တွေအတွက် သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `encoding` ကို `'buffer'` အဖြစ် သတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ filenames တွေကို {Buffer} objects တွေအနေနဲ့ ဖြတ်သန်းပေးပါလိမ့်မယ်။

`options.withFileTypes` ကို `true` အဖြစ် သတ်မှတ်ထားရင် ရလဒ်ထဲမှာ {fs.Dirent} objects တွေ ပါဝင်ပါလိမ့်မယ်။

### `fs.readFileSync(path[, options])`

* `path` {string|Buffer|URL|integer} filename သို့မဟုတ် file descriptor ပါ
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `null`
  * `flag` {string} See [support of file system `flags`][]. **Default:** `'r'`.
  * `buffer` {Buffer|TypedArray|DataView|Function} ဖတ်သွင်းရမယ့် buffer တစ်ခု သို့မဟုတ် — file size နဲ့အတူ ခေါ်ယူပြီး buffer ကို ပြန်ပေးတဲ့ function တစ်ခုပါ။
* Returns: {string|Buffer}

`path` ရဲ့ contents တွေကို ပြန်ပေးပါတယ်။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.readFile()`][] documentation ကို ကြည့်ပါ။

`encoding` option ကို သတ်မှတ်ထားရင် ဒီ function က string တစ်ခုကို ပြန်ပေးပါတယ်။ မသတ်မှတ်ထားရင်တော့ buffer တစ်ခုကို ပြန်ပေးပါတယ်။

`buffer` ကို ပေးထားပြီး encoding မသတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ {Buffer} က — ဖတ်လိုက်တဲ့ bytes တွေသာ ပါဝင်တဲ့ — ပေးထားတဲ့ buffer အပေါ်က view တစ်ခု ဖြစ်ပါတယ်။ ပေးထားတဲ့ buffer က file တစ်ခုလုံး ထည့်သွင်းဖို့ သေးလွန်းရင် error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

[`fs.readFile()`][] နဲ့ ဆင်တူပြီး — path က directory တစ်ခု ဖြစ်တဲ့အခါ — `fs.readFileSync()` ရဲ့ အပြုအမူက platform အလိုက် ကွဲပြားပါတယ်။

```mjs
import { readFileSync } from 'node:fs';

// macOS, Linux, and Windows
readFileSync('<directory>');
// => [Error: EISDIR: illegal operation on a directory, read <directory>]

//  FreeBSD
readFileSync('<directory>'); // => <data>
```

### `fs.readlinkSync(path[, options])`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* Returns: {string|Buffer}

Symbolic link ရဲ့ string value ကို ပြန်ပေးပါတယ်။

အသေးစိတ်အတွက် POSIX readlink(2) documentation ကို ကြည့်ပါ။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — ပြန်ပေးလိုက်တဲ့ link path အတွက် သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `encoding` ကို `'buffer'` အဖြစ် သတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ link path ကို {Buffer} object တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပါလိမ့်မယ်။

### `fs.readSync(fd, buffer, offset, length[, position])`

* `fd` {integer}
* `buffer` {Buffer|TypedArray|DataView}
* `offset` {integer}
* `length` {integer}
* `position` {integer|bigint|null} **Default:** `null`
* Returns: {number}

`bytesRead` အရေအတွက်ကို ပြန်ပေးပါတယ်။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.read()`][] documentation ကို ကြည့်ပါ။

### `fs.readSync(fd, buffer[, options])`

* `fd` {integer}
* `buffer` {Buffer|TypedArray|DataView}
* `options` {Object}
  * `offset` {integer} **Default:** `0`
  * `length` {integer} **Default:** `buffer.byteLength - offset`
  * `position` {integer|bigint|null} **Default:** `null`
* Returns: {number}

`bytesRead` အရေအတွက်ကို ပြန်ပေးပါတယ်။

အပေါ်က `fs.readSync` function နဲ့ ဆင်တူပြီး ဒီ version က optional `options` object တစ်ခုကို လက်ခံပါတယ်။ `options` object ကို မသတ်မှတ်ထားရင် အပေါ်က တန်ဖိုးတွေကို default အနေနဲ့ သုံးပါလိမ့်မယ်။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.read()`][] documentation ကို ကြည့်ပါ။

### `fs.readvSync(fd, buffers[, position])`

* `fd` {integer}
* `buffers` {ArrayBufferView\[]}
* `position` {integer|null} **Default:** `null`
* Returns: {number} ဖတ်လိုက်တဲ့ bytes အရေအတွက်ပါ။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.readv()`][] documentation ကို ကြည့်ပါ။

### `fs.realpathSync(path[, options])`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* Returns: {string|Buffer}

Resolve လုပ်ပြီးသား pathname ကို ပြန်ပေးပါတယ်။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.realpath()`][] documentation ကို ကြည့်ပါ။

### `fs.realpathSync.native(path[, options])`

* `path` {string|Buffer|URL}
* `options` {string|Object}
  * `encoding` {string} **Default:** `'utf8'`
* Returns: {string|Buffer}

realpath(3) ၏ synchronous version ပါ။

UTF8 strings အဖြစ် ပြောင်းလဲလို့ရတဲ့ paths တွေကိုသာ support လုပ်ပါတယ်။

Optional ဖြစ်တဲ့ `options` argument က encoding တစ်ခုကို သတ်မှတ်တဲ့ string တစ်ခု သို့မဟုတ် — ပြန်ပေးလိုက်တဲ့ path အတွက် သုံးမယ့် character encoding ကို သတ်မှတ်တဲ့ `encoding` property ပါတဲ့ object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `encoding` ကို `'buffer'` အဖြစ် သတ်မှတ်ထားရင် ပြန်ပေးလိုက်တဲ့ path ကို {Buffer} object တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပါလိမ့်မယ်။

Linux မှာ Node.js ကို musl libc နဲ့ ချိတ်ဆက်ထားတဲ့အခါ ဒီ function အလုပ်လုပ်ဖို့ procfs file system ကို `/proc` မှာ mount လုပ်ထားရပါမယ်။ Glibc မှာတော့ ဒီကန့်သတ်ချက် မရှိပါဘူး။

### `fs.renameSync(oldPath, newPath)`

* `oldPath` {string|Buffer|URL}
* `newPath` {string|Buffer|URL}

`oldPath` ရှိ file ကို `newPath` အဖြစ် နာမည်ပြောင်းပေးပါတယ်။ `undefined` ကို ပြန်ပေးပါတယ်။

အသေးစိတ်အတွက် POSIX rename(2) documentation ကို ကြည့်ပါ။

### `fs.rmdirSync(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object} လက်ရှိမှာ ထုတ်ဖော်ထားတဲ့ (exposed) options တွေ မရှိပါဘူး။ အရင်တုန်းက `recursive`, `maxBusyTries` နဲ့ `emfileWait` အတွက် options တွေ ရှိခဲ့ပေမယ့် ၎င်းတို့ကို deprecated လုပ်ပြီး ဖယ်ရှားလိုက်ပါတယ်။ `options` argument ကို backwards compatibility (နောက်ပြန် လိုက်ဖက်ညီမှု) အတွက် လက်ခံဆဲ ဖြစ်ပေမယ့် အသုံးမပြုပါဘူး။

Synchronous rmdir(2) ပါ။ `undefined` ကို ပြန်ပေးပါတယ်။

`fs.rmdirSync()` ကို (directory မဟုတ်တဲ့) file တစ်ခုပေါ်မှာ သုံးလိုက်ရင် Windows မှာ `ENOENT` error ဖြစ်ပြီး — POSIX မှာ `ENOTDIR` error ဖြစ်ပါတယ်။

Unix ရဲ့ `rm -rf` command နဲ့ ဆင်တူတဲ့ အပြုအမူကို ရဖို့အတွက် options `{ recursive: true, force: true }` တွေနဲ့အတူ [`fs.rmSync()`][] ကို သုံးပါ။

### `fs.rmSync(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `force` {boolean} `true` ဆိုရင် `path` မရှိဘူးဆိုရင် exceptions တွေကို လျစ်လျူရှုပါလိမ့်မယ်။ **Default:** `false`.
  * `maxRetries` {integer} `EBUSY`, `EMFILE`, `ENFILE`, `ENOTEMPTY` သို့မဟုတ် `EPERM` error တစ်ခုခု ကြုံတွေ့ရရင် Node.js က — အကြိမ်တိုင်းမှာ `retryDelay` milliseconds ပိုရှည်တဲ့ linear backoff wait (အဆင့်လိုက် နောက်ဆုတ် စောင့်ဆိုင်းမှု) နဲ့အတူ — operation ကို ပြန်ကြိုးစားပါလိမ့်မယ်။ ဒီ option က retries အရေအတွက်ကို ကိုယ်စားပြုပါတယ်။ `recursive` option က `true` မဟုတ်ဘူးဆိုရင် ဒီ option ကို လျစ်လျူရှုပါတယ်။ **Default:** `0`.
  * `recursive` {boolean} `true` ဆိုရင် directory ကို recursively ဖယ်ရှားပါတယ်။ Recursive mode မှာ operations တွေကို မအောင်မြင်ရင် ပြန်ကြိုးစားပါတယ်။ **Default:** `false`.
  * `retryDelay` {integer} Retries တွေကြားမှာ စောင့်ဆိုင်းရမယ့် အချိန်ပမာဏကို milliseconds နဲ့ ဖော်ပြပါတယ်။ `recursive` option က `true` မဟုတ်ဘူးဆိုရင် ဒီ option ကို လျစ်လျူရှုပါတယ်။ **Default:** `100`.

Files နဲ့ directories တွေကို synchronously ဖယ်ရှားပါတယ် (standard POSIX `rm` utility ကို စံပြုထားပါတယ်)။ `undefined` ကို ပြန်ပေးပါတယ်။

### `fs.statSync(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.Stats} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
  * `throwIfNoEntry` {boolean} `undefined` ကို ပြန်ပေးမယ့်အစား — file system entry တစ်ခုမှ မရှိဘူးဆိုရင် exception တစ်ခုကို throw လုပ်မလားဆိုတာပါ။ **Default:** `true`.
* Returns: {fs.Stats}

Path အတွက် {fs.Stats} ကို ပြန်လည် ရယူပါတယ်။

### `fs.statfsSync(path[, options])`

* `path` {string|Buffer|URL}
* `options` {Object}
  * `bigint` {boolean} ပြန်ပေးလိုက်တဲ့ {fs.StatFs} object ထဲက numeric values တွေ `bigint` ဖြစ်သင့်လားဆိုတာပါ။ **Default:** `false`.
* Returns: {fs.StatFs}

Synchronous statfs(2) ပါ။ `path` ပါဝင်တဲ့ mount လုပ်ထားတဲ့ file system အကြောင်း အချက်အလက်တွေကို ပြန်ပေးပါတယ်။

Error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် `err.code` က [Common System Errors][] ထဲက တစ်ခု ဖြစ်ပါလိမ့်မယ်။

### `fs.symlinkSync(target, path[, type])`

* `target` {string|Buffer|URL}
* `path` {string|Buffer|URL}
* `type` {string|null} **Default:** `null`
* Returns: `undefined`.

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.symlink()`][] documentation ကို ကြည့်ပါ။

### `fs.truncateSync(path[, len])`

* `path` {string|Buffer|URL}
* `len` {integer} **Default:** `0`

File ကို ဖြတ်တောက် (truncate) ပါတယ်။ `undefined` ကို ပြန်ပေးပါတယ်။ ပထမဆုံး argument အနေနဲ့ file descriptor တစ်ခုကိုလည်း ဖြတ်သန်းပေးနိုင်ပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ `fs.ftruncateSync()` ကို ခေါ်ပါတယ်။

File descriptor တစ်ခုကို ဖြတ်သန်းပေးတာက deprecated ဖြစ်ပြီး — နောင်အနာဂတ်မှာ error တစ်ခု throw လုပ်ခံရနိုင်ပါတယ်။

### `fs.unlinkSync(path)`

* `path` {string|Buffer|URL}

Synchronous unlink(2) ပါ။ `undefined` ကို ပြန်ပေးပါတယ်။

### `fs.utimesSync(path, atime, mtime)`

* `path` {string|Buffer|URL}
* `atime` {number|string|Date}
* `mtime` {number|string|Date}
* Returns: `undefined`.

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.utimes()`][] documentation ကို ကြည့်ပါ။

### `fs.writeFileSync(file, data[, options])`

* `file` {string|Buffer|URL|integer} filename သို့မဟုတ် file descriptor ပါ
* `data` {string|Buffer|TypedArray|DataView}
* `options` {Object|string}
  * `encoding` {string|null} **Default:** `'utf8'`
  * `mode` {integer} **Default:** `0o666`
  * `flag` {string} See [support of file system `flags`][]. **Default:** `'w'`.
  * `flush` {boolean} Data တွေ အားလုံးကို file ထဲကို အောင်မြင်စွာ ရေးသားပြီးတဲ့အခါ — `flush` က `true` ဆိုရင် — data တွေကို flush လုပ်ဖို့ `fs.fsyncSync()` ကို သုံးပါတယ်။
* Returns: `undefined`.

`mode` option က အသစ်ဖန်တီးလိုက်တဲ့ file ကိုသာ သက်ရောက်မှု ရှိပါတယ်။ အသေးစိတ်အတွက် [`fs.open()`][] ကို ကြည့်ပါ။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.writeFile()`][] documentation ကို ကြည့်ပါ။

### `fs.writeSync(fd, buffer, offset[, length[, position]])`

* `fd` {integer}
* `buffer` {Buffer|TypedArray|DataView}
* `offset` {integer} **Default:** `0`
* `length` {integer} **Default:** `buffer.byteLength - offset`
* `position` {integer|null} **Default:** `null`
* Returns: {number} ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.write(fd, buffer...)`][] documentation ကို ကြည့်ပါ။

### `fs.writeSync(fd, buffer[, options])`

* `fd` {integer}
* `buffer` {Buffer|TypedArray|DataView}
* `options` {Object}
  * `offset` {integer} **Default:** `0`
  * `length` {integer} **Default:** `buffer.byteLength - offset`
  * `position` {integer|null} **Default:** `null`
* Returns: {number} ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.write(fd, buffer...)`][] documentation ကို ကြည့်ပါ။

### `fs.writeSync(fd, string[, position[, encoding]])`

* `fd` {integer}
* `string` {string}
* `position` {integer|null} **Default:** `null`
* `encoding` {string} **Default:** `'utf8'`
* Returns: {number} ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.write(fd, string...)`][] documentation ကို ကြည့်ပါ။

### `fs.writevSync(fd, buffers[, position])`

* `fd` {integer}
* `buffers` {ArrayBufferView\[]}
* `position` {integer|null} **Default:** `null`
* Returns: {number} ရေးသားလိုက်တဲ့ bytes အရေအတွက်ပါ။

အသေးစိတ် အချက်အလက်များအတွက် ဒီ API ရဲ့ asynchronous version ဖြစ်တဲ့ [`fs.writev()`][] documentation ကို ကြည့်ပါ။

## Common object များ (Common Objects)

ဒီ object တွေကို file system API ပုံစံမျိုးစုံ (promise, callback နဲ့ synchronous) အားလုံးက မျှဝေ သုံးစွဲပါတယ်။

### Class: `fs.Dir`

Directory stream တစ်ခုကို ကိုယ်စားပြုတဲ့ class တစ်ခုပါ။

[`fs.opendir()`][], [`fs.opendirSync()`][] သို့မဟုတ် [`fsPromises.opendir()`][] တွေက ဖန်တီးပေးပါတယ်။

```mjs
import { opendir } from 'node:fs/promises';

try {
  const dir = await opendir('./');
  for await (const dirent of dir)
    console.log(dirent.name);
} catch (err) {
  console.error(err);
}
```

Async iterator ကို သုံးတဲ့အခါ — iterator က ထွက်သွားပြီးနောက်မှာ {fs.Dir} object ကို အလိုအလျောက် ပိတ်ပါလိမ့်မယ်။

#### `dir.close()`

* Returns: {Promise}

Directory ရဲ့ underlying (အောက်ခံ) resource handle ကို asynchronously ပိတ်ပါတယ်။ နောက်ဆက်တွဲ reads တွေက errors တွေ ဖြစ်ပေါ်စေပါလိမ့်မယ်။

Resource ကို ပိတ်ပြီးနောက်မှာ fulfill ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

#### `dir.close(callback)`

* `callback` {Function}
  * `err` {Error}

Directory ရဲ့ underlying resource handle ကို asynchronously ပိတ်ပါတယ်။ နောက်ဆက်တွဲ reads တွေက errors တွေ ဖြစ်ပေါ်စေပါလိမ့်မယ်။

Resource handle ကို ပိတ်ပြီးနောက်မှာ `callback` ကို ခေါ်ပါလိမ့်မယ်။

#### `dir.closeSync()`

Directory ရဲ့ underlying resource handle ကို synchronously ပိတ်ပါတယ်။ နောက်ဆက်တွဲ reads တွေက errors တွေ ဖြစ်ပေါ်စေပါလိမ့်မယ်။

#### `dir.path`

* Type: {string}

ဒီ directory ကို [`fs.opendir()`][], [`fs.opendirSync()`][] သို့မဟုတ် [`fsPromises.opendir()`][] ဆီကို ပေးအပ်ခဲ့တဲ့အတိုင်း ဖတ်ရုံသက်သက် (read-only) path ပါ။

#### `dir.read()`

* Returns: {Promise} {fs.Dirent|null} တစ်ခုဖြင့် fulfill ဖြစ်ပါတယ်။

နောက် directory entry တစ်ခုကို readdir(3) ကနေတစ်ဆင့် {fs.Dirent} တစ်ခုအနေနဲ့ asynchronously ဖတ်ပါတယ်။

ဖတ်စရာ directory entries တွေ နောက်ထပ် မရှိတော့ရင် `null` — မဟုတ်ရင် {fs.Dirent} တစ်ခုဖြင့် fulfill ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

ဒီ function က ပြန်ပေးတဲ့ directory entries တွေက — operating system ရဲ့ underlying directory mechanisms တွေ ပေးအပ်တဲ့အတိုင်း — အစီအစဉ် တစ်စုံတစ်ရာ မရှိပါဘူး။ Directory ကို iterate လုပ်နေတုန်း ထည့်သွင်းလိုက်တာ သို့မဟုတ် ဖယ်ရှားလိုက်တဲ့ entries တွေက iteration results တွေထဲမှာ မပါဝင်နိုင်ပါဘူး။

#### `dir.read(callback)`

* `callback` {Function}
  * `err` {Error}
  * `dirent` {fs.Dirent|null}

နောက် directory entry တစ်ခုကို readdir(3) ကနေတစ်ဆင့် {fs.Dirent} တစ်ခုအနေနဲ့ asynchronously ဖတ်ပါတယ်။

Read ပြီးဆုံးသွားတဲ့အခါ — ဖတ်စရာ directory entries တွေ နောက်ထပ် မရှိတော့ရင် `null` — မဟုတ်ရင် {fs.Dirent} တစ်ခုနဲ့အတူ `callback` ကို ခေါ်ပါလိမ့်မယ်။

ဒီ function က ပြန်ပေးတဲ့ directory entries တွေက — operating system ရဲ့ underlying directory mechanisms တွေ ပေးအပ်တဲ့အတိုင်း — အစီအစဉ် တစ်စုံတစ်ရာ မရှိပါဘူး။ Directory ကို iterate လုပ်နေတုန်း ထည့်သွင်းလိုက်တာ သို့မဟုတ် ဖယ်ရှားလိုက်တဲ့ entries တွေက iteration results တွေထဲမှာ မပါဝင်နိုင်ပါဘူး။

#### `dir.readSync()`

* Returns: {fs.Dirent|null}

နောက် directory entry တစ်ခုကို {fs.Dirent} တစ်ခုအနေနဲ့ synchronously ဖတ်ပါတယ်။ အသေးစိတ်အတွက် POSIX readdir(3) documentation ကို ကြည့်ပါ။

ဖတ်စရာ directory entries တွေ နောက်ထပ် မရှိတော့ရင် `null` ကို ပြန်ပေးပါလိမ့်မယ်။

ဒီ function က ပြန်ပေးတဲ့ directory entries တွေက — operating system ရဲ့ underlying directory mechanisms တွေ ပေးအပ်တဲ့အတိုင်း — အစီအစဉ် တစ်စုံတစ်ရာ မရှိပါဘူး။ Directory ကို iterate လုပ်နေတုန်း ထည့်သွင်းလိုက်တာ သို့မဟုတ် ဖယ်ရှားလိုက်တဲ့ entries တွေက iteration results တွေထဲမှာ မပါဝင်နိုင်ပါဘူး။

#### `dir[Symbol.asyncIterator]()`

* Returns: {AsyncIterator} {fs.Dirent} တွေရဲ့ AsyncIterator တစ်ခုပါ။

Entries တွေ အားလုံး ဖတ်ပြီးသည်အထိ directory ကို asynchronously iterate လုပ်ပါတယ်။ အသေးစိတ်အတွက် POSIX readdir(3) documentation ကို ကြည့်ပါ။

Async iterator က ပြန်ပေးတဲ့ entries တွေက အမြဲတမ်း {fs.Dirent} တစ်ခုပါ။ `dir.read()` ရဲ့ `null` အခြေအနေကို အတွင်းပိုင်းမှာ ကိုင်တွယ်ပါတယ်။

ဥပမာတစ်ခုအတွက် {fs.Dir} ကို ကြည့်ပါ။

ဒီ iterator က ပြန်ပေးတဲ့ directory entries တွေက — operating system ရဲ့ underlying directory mechanisms တွေ ပေးအပ်တဲ့အတိုင်း — အစီအစဉ် တစ်စုံတစ်ရာ မရှိပါဘူး။ Directory ကို iterate လုပ်နေတုန်း ထည့်သွင်းလိုက်တာ သို့မဟုတ် ဖယ်ရှားလိုက်တဲ့ entries တွေက iteration results တွေထဲမှာ မပါဝင်နိုင်ပါဘူး။

#### `dir[Symbol.asyncDispose]()`

* Returns: {Promise}

Directory handle က ဖွင့်ထားရင် `dir.close()` ကို ခေါ်ပြီး — disposal (စွန့်ပစ်ခြင်း) ပြီးဆုံးတဲ့အခါ fulfill ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။

ဒီ method က directory ကို [`await using`][] နဲ့ သုံးနိုင်စေပြီး — scope ကနေ ထွက်သွားတဲ့အခါ directory ကို အလိုအလျောက် ပိတ်ပေးပါလိမ့်မယ်။ ထပ်ဆောင်း အချက်အလက်များအတွက် [MDN documentation on `using` statements][`using`] ကို ကြည့်ပါ။

#### `dir[Symbol.dispose]()`

Directory handle က ဖွင့်ထားရင် `dir.closeSync()` ကို ခေါ်ပြီး — `undefined` ကို ပြန်ပေးပါတယ်။

ဒီ method က directory ကို [`using`][] နဲ့ သုံးနိုင်စေပြီး — scope ကနေ ထွက်သွားတဲ့အခါ directory ကို အလိုအလျောက် ပိတ်ပေးပါလိမ့်မယ်။ ထပ်ဆောင်း အချက်အလက်များအတွက် [MDN documentation on `using` statements][`using`] ကို ကြည့်ပါ။

### Class: `fs.Dirent`

Directory entry တစ်ခုရဲ့ ကိုယ်စားပြုမှု (representation) တစ်ခုပါ — directory အတွင်းမှာ ရှိတဲ့ file တစ်ခု သို့မဟုတ် subdirectory တစ်ခု ဖြစ်နိုင်ပြီး — {fs.Dir} တစ်ခုကနေ ဖတ်ရှုခြင်းအားဖြင့် ပြန်ပေးပါတယ်။ Directory entry ဆိုတာ file name နဲ့ file type pair တွေရဲ့ ပေါင်းစပ်မှု (combination) တစ်ခုပါ။

ထို့အပြင် — `withFileTypes` option ကို `true` အဖြစ် သတ်မှတ်ပြီး [`fs.readdir()`][] သို့မဟုတ် [`fs.readdirSync()`][] ကို ခေါ်တဲ့အခါ — ရလာတဲ့ array ထဲမှာ strings တွေ သို့မဟုတ် {Buffer}s တွေ အစား {fs.Dirent} objects တွေနဲ့ ဖြည့်သွင်းပါတယ်။

Directory တစ်ခုကို — [`fs.readdir()`][] သို့မဟုတ် [`fs.opendir()`][] နဲ့ — ဖတ်တဲ့အခါ entry တစ်ခုချင်းစီရဲ့ file type က operating system က အစီရင်ခံတဲ့ (reported) type ဖြစ်ပြီး — file system ပေါ်မှာ မူတည်နိုင်ပါတယ်; ဥပမာ — file system အချို့က [`fs.lstat()`][] ပြန်ပေးတာနဲ့ ကွဲပြားတဲ့ type တစ်ခုကို အစီရင်ခံနိုင်ပါတယ်။ Node.js က အစီရင်ခံတဲ့ type က မသိတဲ့ type ဖြစ်နေတဲ့အခါမှသာ အဲဒီလို entry တစ်ခုပေါ်မှာ [`fs.lstat()`][] ကို ခေါ်ပါတယ်။ တိကျတဲ့ file type တစ်ခု လိုအပ်တဲ့အခါ [`fs.lstat()`][] ကို သုံးပါ။

#### `dirent.isBlockDevice()`

* Returns: {boolean}

{fs.Dirent} object က block device တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `dirent.isCharacterDevice()`

* Returns: {boolean}

{fs.Dirent} object က character device တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `dirent.isDirectory()`

* Returns: {boolean}

{fs.Dirent} object က file system directory တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `dirent.isFIFO()`

* Returns: {boolean}

{fs.Dirent} object က first-in-first-out (FIFO) pipe တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `dirent.isFile()`

* Returns: {boolean}

{fs.Dirent} object က regular file တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `dirent.isSocket()`

* Returns: {boolean}

{fs.Dirent} object က socket တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `dirent.isSymbolicLink()`

* Returns: {boolean}

{fs.Dirent} object က symbolic link တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `dirent.name`

* Type: {string|Buffer}

ဒီ {fs.Dirent} object က ရည်ညွှန်းတဲ့ file name ပါ။ ဒီတန်ဖိုးရဲ့ type ကို [`fs.readdir()`][] သို့မဟုတ် [`fs.readdirSync()`][] ဆီကို ဖြတ်သန်းပေးတဲ့ `options.encoding` က ဆုံးဖြတ်ပေးပါတယ်။

#### `dirent.parentPath`

* Type: {string}

ဒီ {fs.Dirent} object က ရည်ညွှန်းတဲ့ file ရဲ့ parent directory ဆီကို ရောက်ရှိတဲ့ path ပါ။

### Class: `fs.FSWatcher`

* Extends {EventEmitter}

[`fs.watch()`][] method ကို အောင်မြင်စွာ ခေါ်လိုက်တာက {fs.FSWatcher} object အသစ်တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

{fs.FSWatcher} objects တွေ အားလုံးက — watch လုပ်ထားတဲ့ file တစ်ခု ပြုပြင်ခံရတိုင်း — `'change'` event တစ်ခုကို emit လုပ်ပါတယ်။

#### Event: `'change'`

* `eventType` {string} ဖြစ်ပွားခဲ့တဲ့ change event ရဲ့ အမျိုးအစားပါ
* `filename` {string|Buffer} ပြောင်းလဲသွားတဲ့ filename ပါ (သက်ဆိုင်မှု ရှိရင်/ရရှိနိုင်ရင်)

Watch လုပ်ထားတဲ့ directory သို့မဟုတ် file တစ်ခုမှာ တစ်စုံတစ်ရာ ပြောင်းလဲသွားတဲ့အခါ emit လုပ်ပါတယ်။ အသေးစိတ်ကို [`fs.watch()`][] မှာ ကြည့်ပါ။

`filename` argument ကို — operating system ရဲ့ support ပေါ်မူတည်ပြီး — ပေးအပ်ခြင်း ခံရမယ်မဟုတ်ပါဘူး။ `filename` ကို ပေးအပ်တဲ့အခါ — `fs.watch()` ကို ၎င်းရဲ့ `encoding` option ကို `'buffer'` အဖြစ် သတ်မှတ်ပြီး ခေါ်ထားရင် — {Buffer} တစ်ခုအနေနဲ့ ပေးအပ်ပြီး — မဟုတ်ရင်တော့ `filename` က UTF-8 string တစ်ခု ဖြစ်ပါလိမ့်မယ်။

```mjs
import { watch } from 'node:fs';
// Example when handled through fs.watch() listener
watch('./tmp', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename) {
    console.log(filename);
    // Prints: <Buffer ...>
  }
});
```

#### Event: `'close'`

Watcher က ပြောင်းလဲမှုတွေကို watch လုပ်တာ ရပ်တန့်သွားတဲ့အခါ emit လုပ်ပါတယ်။ ပိတ်လိုက်တဲ့ {fs.FSWatcher} object ကို event handler ထဲမှာ နောက်ထပ် သုံးလို့ မရတော့ပါဘူး။

#### Event: `'error'`

* `error` {Error}

File ကို watch လုပ်နေတုန်း error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ emit လုပ်ပါတယ်။ Error ဖြစ်သွားတဲ့ {fs.FSWatcher} object ကို event handler ထဲမှာ နောက်ထပ် သုံးလို့ မရတော့ပါဘူး။

#### `watcher.close()`

ပေးထားတဲ့ {fs.FSWatcher} ပေါ်မှာ ပြောင်းလဲမှုတွေကို watch လုပ်တာ ရပ်တန့်ပါတယ်။ ရပ်တန့်သွားတာနဲ့ {fs.FSWatcher} object ကို နောက်ထပ် သုံးလို့ မရတော့ပါဘူး။

#### `watcher.ref()`

* Returns: {fs.FSWatcher}

ခေါ်လိုက်တဲ့အခါ — {fs.FSWatcher} က active ဖြစ်နေသရွေ့ — Node.js event loop က ထွက်မသွားဖို့ (not exit) တောင်းဆိုပါတယ်။ `watcher.ref()` ကို အကြိမ်များစွာ ခေါ်တာက ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

Default အနေနဲ့ {fs.FSWatcher} objects တွေ အားလုံးက "ref'ed" ဖြစ်နေတာမို့ — အရင်က `watcher.unref()` ကို ခေါ်ထားခြင်း မရှိရင် — `watcher.ref()` ကို ခေါ်စရာ ပုံမှန်အားဖြင့် မလိုအပ်ပါဘူး။

#### `watcher.unref()`

* Returns: {fs.FSWatcher}

ခေါ်လိုက်တဲ့အခါ — active ဖြစ်နေတဲ့ {fs.FSWatcher} object က Node.js event loop ကို active အဖြစ် ဆက်ရှိနေဖို့ မလိုအပ်တော့ပါဘူး။ Event loop ကို လည်ပတ်နေအောင် ထိန်းထားတဲ့ တခြား လုပ်ဆောင်ချက်တွေ မရှိဘူးဆိုရင် — {fs.FSWatcher} object ရဲ့ callback ကို မခေါ်ရသေးခင် process က ထွက်သွားနိုင်ပါတယ်။ `watcher.unref()` ကို အကြိမ်များစွာ ခေါ်တာက ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

### Class: `fs.StatWatcher`

* Extends {EventEmitter}

`fs.watchFile()` method ကို အောင်မြင်စွာ ခေါ်လိုက်တာက {fs.StatWatcher} object အသစ်တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

#### `watcher.ref()`

* Returns: {fs.StatWatcher}

ခေါ်လိုက်တဲ့အခါ — {fs.StatWatcher} က active ဖြစ်နေသရွေ့ — Node.js event loop က ထွက်မသွားဖို့ (not exit) တောင်းဆိုပါတယ်။ `watcher.ref()` ကို အကြိမ်များစွာ ခေါ်တာက ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

Default အနေနဲ့ {fs.StatWatcher} objects တွေ အားလုံးက "ref'ed" ဖြစ်နေတာမို့ — အရင်က `watcher.unref()` ကို ခေါ်ထားခြင်း မရှိရင် — `watcher.ref()` ကို ခေါ်စရာ ပုံမှန်အားဖြင့် မလိုအပ်ပါဘူး။

#### `watcher.unref()`

* Returns: {fs.StatWatcher}

ခေါ်လိုက်တဲ့အခါ — active ဖြစ်နေတဲ့ {fs.StatWatcher} object က Node.js event loop ကို active အဖြစ် ဆက်ရှိနေဖို့ မလိုအပ်တော့ပါဘူး။ Event loop ကို လည်ပတ်နေအောင် ထိန်းထားတဲ့ တခြား လုပ်ဆောင်ချက်တွေ မရှိဘူးဆိုရင် — {fs.StatWatcher} object ရဲ့ callback ကို မခေါ်ရသေးခင် process က ထွက်သွားနိုင်ပါတယ်။ `watcher.unref()` ကို အကြိမ်များစွာ ခေါ်တာက ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပါဘူး။

### Class: `fs.ReadStream`

* Extends: {stream.Readable}

{fs.ReadStream} ရဲ့ instances တွေကို တိုက်ရိုက် ဆောက်လုပ် (construct) လို့ မရပါဘူး။ ၎င်းတို့ကို [`fs.createReadStream()`][] function ကို သုံးပြီး ဖန်တီးပြီး ပြန်ပေးပါတယ်။

#### Event: `'close'`

{fs.ReadStream} ရဲ့ underlying file descriptor ကို ပိတ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။

#### Event: `'open'`

* `fd` {integer} {fs.ReadStream} က သုံးတဲ့ integer file descriptor ပါ။

{fs.ReadStream} ရဲ့ file descriptor ကို ဖွင့်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။

#### Event: `'ready'`

{fs.ReadStream} ကို သုံးဖို့ အသင့်ဖြစ်တဲ့အခါ emit လုပ်ပါတယ်။

`'open'` ပြီးနောက်မှာ ချက်ချင်း fire လုပ်ပါတယ်။

#### `readStream.bytesRead`

* Type: {number}

အခုထိ ဖတ်ပြီးသား bytes အရေအတွက်ပါ။

#### `readStream.path`

* Type: {string|Buffer}

Stream က ဖတ်နေတဲ့ file ဆီကို ရောက်ရှိတဲ့ path ပါ — `fs.createReadStream()` ရဲ့ ပထမဆုံး argument မှာ သတ်မှတ်ထားတဲ့အတိုင်းပါ။ `path` ကို string တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးထားရင် `readStream.path` က string တစ်ခု ဖြစ်ပါလိမ့်မယ်။ `path` ကို {Buffer} တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးထားရင် `readStream.path` က {Buffer} တစ်ခု ဖြစ်ပါလိမ့်မယ်။ `fd` ကို သတ်မှတ်ထားရင် `readStream.path` က `undefined` ဖြစ်ပါလိမ့်မယ်။

#### `readStream.pending`

* Type: {boolean}

ဒီ property က — underlying file ကို မဖွင့်ရသေးဘူးဆိုရင် — ဆိုလိုတာက `'ready'` event ကို မထုတ်လွှတ်ရသေးခင် — `true` ဖြစ်ပါတယ်။

### Class: `fs.Stats`

{fs.Stats} object တစ်ခုက file တစ်ခုအကြောင်း အချက်အလက်တွေကို ပေးပါတယ်။

[`fs.stat()`][], [`fs.lstat()`][], [`fs.fstat()`][] နဲ့ ၎င်းတို့ရဲ့ synchronous အစားထိုး (counterpart) တွေကနေ ပြန်လာတဲ့ objects တွေက ဒီ type ဖြစ်ပါတယ်။ အဲဒီ methods တွေဆီကို ဖြတ်သန်းပေးတဲ့ `options` ထဲက `bigint` က true ဆိုရင် numeric values တွေက `number` အစား `bigint` ဖြစ်ပြီး — object ထဲမှာ `Ns` နဲ့ အဆုံးသတ်တဲ့ nanosecond တိကျမှု (nanosecond-precision) properties တွေ ထပ်ဆောင်း ပါဝင်ပါလိမ့်မယ်။ `Stat` objects တွေကို `new` keyword ကို သုံးပြီး တိုက်ရိုက် ဖန်တီးလို့ မရပါဘူး။

```console
Stats {
  dev: 2114,
  ino: 48064969,
  mode: 33188,
  nlink: 1,
  uid: 85,
  gid: 100,
  rdev: 0,
  size: 527,
  blksize: 4096,
  blocks: 8,
  atimeMs: 1318289051000.1,
  mtimeMs: 1318289051000.1,
  ctimeMs: 1318289051000.1,
  birthtimeMs: 1318289051000.1,

  // Instances of Date
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT,

  // Instances of Temporal.Instant
  atimeInstant: 2011-10-10T23:24:11.0001Z,
  mtimeInstant: 2011-10-10T23:24:11.0001Z,
  ctimeInstant: 2011-10-10T23:24:11.0001Z,
  birthtimeInstant: 2011-10-10T23:24:11.0001Z
}
```

`bigint` version:

```console
BigIntStats {
  dev: 2114n,
  ino: 48064969n,
  mode: 33188n,
  nlink: 1n,
  uid: 85n,
  gid: 100n,
  rdev: 0n,
  size: 527n,
  blksize: 4096n,
  blocks: 8n,
  atimeMs: 1318289051000n,
  mtimeMs: 1318289051000n,
  ctimeMs: 1318289051000n,
  birthtimeMs: 1318289051000n,
  atimeNs: 1318289051000000000n,
  mtimeNs: 1318289051000000000n,
  ctimeNs: 1318289051000000000n,
  birthtimeNs: 1318289051000000000n,

  // Instances of Date
  atime: Mon, 10 Oct 2011 23:24:11 GMT,
  mtime: Mon, 10 Oct 2011 23:24:11 GMT,
  ctime: Mon, 10 Oct 2011 23:24:11 GMT,
  birthtime: Mon, 10 Oct 2011 23:24:11 GMT,

  // Instances of Temporal.Instant
  atimeInstant: 2011-10-10T23:24:11Z,
  mtimeInstant: 2011-10-10T23:24:11Z,
  ctimeInstant: 2011-10-10T23:24:11Z,
  birthtimeInstant: 2011-10-10T23:24:11Z
}
```

#### `stats.isBlockDevice()`

* Returns: {boolean}

{fs.Stats} object က block device တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `stats.isCharacterDevice()`

* Returns: {boolean}

{fs.Stats} object က character device တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `stats.isDirectory()`

* Returns: {boolean}

{fs.Stats} object က file system directory တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

{fs.Stats} object ကို directory တစ်ခုဆီကို ဖြေရှင်းပေးတဲ့ symbolic link တစ်ခုပေါ်မှာ [`fs.lstat()`][] ကို ခေါ်ပြီး ရယူထားတာဆိုရင် ဒီ method က `false` ကို ပြန်ပေးပါလိမ့်မယ်။ အကြောင်းကတော့ [`fs.lstat()`][] က symbolic link ကိုယ်တိုင်အကြောင်း အချက်အလက်တွေကို ပြန်ပေးပြီး — ၎င်းက ဖြေရှင်းပေးတဲ့ path အကြောင်း မဟုတ်လို့ပါ။

#### `stats.isFIFO()`

* Returns: {boolean}

{fs.Stats} object က first-in-first-out (FIFO) pipe တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `stats.isFile()`

* Returns: {boolean}

{fs.Stats} object က regular file တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `stats.isSocket()`

* Returns: {boolean}

{fs.Stats} object က socket တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

#### `stats.isSymbolicLink()`

* Returns: {boolean}

{fs.Stats} object က symbolic link တစ်ခုကို ဖော်ပြနေရင် `true` ကို ပြန်ပေးပါတယ်။

ဒီ method က [`fs.lstat()`][] ကို သုံးတဲ့အခါမှသာ တရားဝင် (valid) ပါ။

#### `stats.dev`

* Type: {number|bigint}

File ပါဝင်တဲ့ device ရဲ့ numeric identifier ပါ။

#### `stats.ino`

* Type: {number|bigint}

File အတွက် file system အလိုက် သီးသန့် "Inode" နံပါတ်ပါ။

#### `stats.mode`

* Type: {number|bigint}

File type နဲ့ mode ကို ဖော်ပြတဲ့ bit-field (bit ကွက်) တစ်ခုပါ။

#### `stats.nlink`

* Type: {number|bigint}

File အတွက် တည်ရှိနေတဲ့ hard-links အရေအတွက်ပါ။

#### `stats.uid`

* Type: {number|bigint}

File ကို ပိုင်ဆိုင်တဲ့ user ရဲ့ numeric user identifier ပါ (POSIX)။

#### `stats.gid`

* Type: {number|bigint}

File ကို ပိုင်ဆိုင်တဲ့ group ရဲ့ numeric group identifier ပါ (POSIX)။

#### `stats.rdev`

* Type: {number|bigint}

File က device တစ်ခုကို ကိုယ်စားပြုနေရင် numeric device identifier ပါ။

#### `stats.size`

* Type: {number|bigint}

File ရဲ့ အရွယ်အစားကို bytes နဲ့ ဖော်ပြပါတယ်။

Underlying file system က file ရဲ့ အရွယ်အစား ရယူခြင်းကို support မလုပ်ဘူးဆိုရင် ဒါက `0` ဖြစ်ပါလိမ့်မယ်။

#### `stats.blksize`

* Type: {number|bigint}

I/O operations တွေအတွက် file system block size ပါ။

#### `stats.blocks`

* Type: {number|bigint}

ဒီ file အတွက် ခွဲဝေပေးထားတဲ့ (allocated) blocks အရေအတွက်ပါ။

#### `stats.atimeMs`

* Type: {number|bigint}

POSIX Epoch ကနေ စတင်တွက်ပြီး — ဒီ file ကို နောက်ဆုံး ဝင်ရောက် (access) လုပ်ခဲ့တဲ့ အချိန်ကို milliseconds နဲ့ ဖော်ပြတဲ့ timestamp ပါ။

#### `stats.mtimeMs`

* Type: {number|bigint}

POSIX Epoch ကနေ စတင်တွက်ပြီး — ဒီ file ကို နောက်ဆုံး ပြုပြင် (modify) လုပ်ခဲ့တဲ့ အချိန်ကို milliseconds နဲ့ ဖော်ပြတဲ့ timestamp ပါ။

#### `stats.ctimeMs`

* Type: {number|bigint}

POSIX Epoch ကနေ စတင်တွက်ပြီး — file ရဲ့ status ကို နောက်ဆုံး ပြောင်းလဲခဲ့တဲ့ အချိန်ကို milliseconds နဲ့ ဖော်ပြတဲ့ timestamp ပါ။

#### `stats.birthtimeMs`

* Type: {number|bigint}

POSIX Epoch ကနေ စတင်တွက်ပြီး — ဒီ file ရဲ့ ဖန်တီးချိန် (creation time) ကို milliseconds နဲ့ ဖော်ပြတဲ့ timestamp ပါ။

#### `stats.atimeNs`

* Type: {bigint}

`bigint: true` ကို object ကို ထုတ်လုပ်ပေးတဲ့ method ထဲကို ဖြတ်သန်းပေးမှသာ ပါဝင်ပါတယ်။ POSIX Epoch ကနေ စတင်တွက်ပြီး — ဒီ file ကို နောက်ဆုံး ဝင်ရောက် (access) လုပ်ခဲ့တဲ့ အချိန်ကို nanoseconds နဲ့ ဖော်ပြတဲ့ timestamp ပါ။

#### `stats.mtimeNs`

* Type: {bigint}

`bigint: true` ကို object ကို ထုတ်လုပ်ပေးတဲ့ method ထဲကို ဖြတ်သန်းပေးမှသာ ပါဝင်ပါတယ်။ POSIX Epoch ကနေ စတင်တွက်ပြီး — ဒီ file ကို နောက်ဆုံး ပြုပြင် (modify) လုပ်ခဲ့တဲ့ အချိန်ကို nanoseconds နဲ့ ဖော်ပြတဲ့ timestamp ပါ။

#### `stats.ctimeNs`

* Type: {bigint}

`bigint: true` ကို object ကို ထုတ်လုပ်ပေးတဲ့ method ထဲကို ဖြတ်သန်းပေးမှသာ ပါဝင်ပါတယ်။ POSIX Epoch ကနေ စတင်တွက်ပြီး — file ရဲ့ status ကို နောက်ဆုံး ပြောင်းလဲခဲ့တဲ့ အချိန်ကို nanoseconds နဲ့ ဖော်ပြတဲ့ timestamp ပါ။

#### `stats.birthtimeNs`

* Type: {bigint}

`bigint: true` ကို object ကို ထုတ်လုပ်ပေးတဲ့ method ထဲကို ဖြတ်သန်းပေးမှသာ ပါဝင်ပါတယ်။ POSIX Epoch ကနေ စတင်တွက်ပြီး — ဒီ file ရဲ့ ဖန်တီးချိန် (creation time) ကို nanoseconds နဲ့ ဖော်ပြတဲ့ timestamp ပါ။

#### `stats.atime`

* Type: {Date}

ဒီ file ကို နောက်ဆုံး ဝင်ရောက် (access) လုပ်ခဲ့တဲ့ အချိန်ကို ဖော်ပြတဲ့ timestamp ပါ။

#### `stats.mtime`

* Type: {Date}

ဒီ file ကို နောက်ဆုံး ပြုပြင် (modify) လုပ်ခဲ့တဲ့ အချိန်ကို ဖော်ပြတဲ့ timestamp ပါ။

#### `stats.ctime`

* Type: {Date}

File ရဲ့ status ကို နောက်ဆုံး ပြောင်းလဲခဲ့တဲ့ အချိန်ကို ဖော်ပြတဲ့ timestamp ပါ။

#### `stats.birthtime`

* Type: {Date}

ဒီ file ရဲ့ ဖန်တီးချိန် (creation time) ကို ဖော်ပြတဲ့ timestamp ပါ။

#### Stat time values များ (Stat time values)

`atimeMs`, `mtimeMs`, `ctimeMs`, `birthtimeMs` properties တွေက သက်ဆိုင်ရာ အချိန်တွေကို milliseconds နဲ့ သိမ်းဆည်းထားတဲ့ numeric values တွေပါ။ ၎င်းတို့ရဲ့ တိကျမှု (precision) က platform အလိုက် ကွဲပြားပါတယ်။ `bigint: true` ကို object ကို ထုတ်လုပ်ပေးတဲ့ method ထဲကို ဖြတ်သန်းပေးလိုက်ရင် ဒီ properties တွေက [bigints][] တွေ ဖြစ်ပြီး — မဟုတ်ရင် [numbers][MDN-Number] တွေ ဖြစ်ပါလိမ့်မယ်။

`atimeNs`, `mtimeNs`, `ctimeNs`, `birthtimeNs` properties တွေက သက်ဆိုင်ရာ အချိန်တွေကို nanoseconds နဲ့ သိမ်းဆည်းထားတဲ့ [bigints][] တွေပါ။ `bigint: true` ကို object ကို ထုတ်လုပ်ပေးတဲ့ method ထဲကို ဖြတ်သန်းပေးမှသာ ၎င်းတို့ ပါဝင်ပါတယ်။ ၎င်းတို့ရဲ့ တိကျမှုက platform အလိုက် ကွဲပြားပါတယ်။

`atime`, `mtime`, `ctime` နဲ့ `birthtime` တွေက အချိန်အမျိုးမျိုးရဲ့ [`Date`][MDN-Date] object အစားထိုး ကိုယ်စားပြုမှု (alternate representation) တွေပါ။ `Date` နဲ့ number တန်ဖိုးတွေက ဆက်စပ်မှု မရှိပါဘူး။ number တန်ဖိုးအသစ်တစ်ခု သတ်မှတ်လိုက်တာ သို့မဟုတ် `Date` တန်ဖိုးကို ပြောင်းလဲလိုက်တာက သက်ဆိုင်ရာ အစားထိုး ကိုယ်စားပြုမှုထဲမှာ ထင်ဟပ်မှာ မဟုတ်ပါဘူး။

Stat object ထဲက အချိန်တွေမှာ အောက်ပါ အဓိပ္ပာယ်သတ်မှတ်ချက်တွေ (semantics) ရှိပါတယ်:

* `atime` "Access Time": File data ကို နောက်ဆုံး ဝင်ရောက်ခဲ့တဲ့ အချိန်ပါ။ mknod(2), utimes(2) နဲ့ read(2) system calls တွေက ပြောင်းလဲစေပါတယ်။
* `mtime` "Modified Time": File data ကို နောက်ဆုံး ပြုပြင်ခဲ့တဲ့ အချိန်ပါ။ mknod(2), utimes(2) နဲ့ write(2) system calls တွေက ပြောင်းလဲစေပါတယ်။
* `ctime` "Change Time": File status ကို နောက်ဆုံး ပြောင်းလဲခဲ့တဲ့ (inode data modification) အချိန်ပါ။ chmod(2), chown(2), link(2), mknod(2), rename(2), unlink(2), utimes(2), read(2) နဲ့ write(2) system calls တွေက ပြောင်းလဲစေပါတယ်။
* `birthtime` "Birth Time": File ကို ဖန်တီးခဲ့တဲ့ အချိန်ပါ။ File ကို ဖန်တီးတဲ့အခါ တစ်ကြိမ်တည်း သတ်မှတ်ပါတယ်။ Birthtime မရနိုင်တဲ့ file systems တွေပေါ်မှာ ဒီ field က `ctime` သို့မဟုတ် `1970-01-01T00:00Z` (ဆိုလိုတာက Unix epoch timestamp `0`) ကို ကိုင်ထားနိုင်ပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ ဒီတန်ဖိုးက `atime` သို့မဟုတ် `mtime` ထက် ကြီးနေနိုင်ပါတယ်။ Darwin နဲ့ FreeBSD variants တခြားဟာတွေမှာ — utimes(2) system call ကို သုံးပြီး `atime` ကို လက်ရှိ `birthtime` ထက် စောတဲ့ တန်ဖိုးတစ်ခုအဖြစ် တိုက်ရိုက် (explicitly) သတ်မှတ်လိုက်ရင်လည်း သတ်မှတ်ပေးပါတယ်။

Node.js 0.12 မတိုင်ခင် Windows systems တွေမှာ `ctime` က `birthtime` ကို ကိုင်ထားပါတယ်။ 0.12 ကစပြီး `ctime` က "creation time" မဟုတ်တော့ပါဘူး — Unix systems တွေမှာတော့ တစ်ခါမှ မဖြစ်ခဲ့ပါဘူး။

### Class: `fs.StatFs`

Mount လုပ်ထားတဲ့ file system တစ်ခုအကြောင်း အချက်အလက်တွေကို ပေးပါတယ်။

[`fs.statfs()`][] နဲ့ ၎င်းရဲ့ synchronous counterpart ကနေ ပြန်လာတဲ့ objects တွေက ဒီ type ဖြစ်ပါတယ်။ အဲဒီ methods တွေဆီကို ဖြတ်သန်းပေးတဲ့ `options` ထဲက `bigint` က `true` ဆိုရင် numeric values တွေက `number` အစား `bigint` ဖြစ်ပါလိမ့်မယ်။

```console
StatFs {
  type: 1397114950,
  bsize: 4096,
  frsize: 4096,
  blocks: 121938943,
  bfree: 61058895,
  bavail: 61058895,
  files: 999,
  ffree: 1000000
}
```

`bigint` version:

```console
StatFs {
  type: 1397114950n,
  bsize: 4096n,
  frsize: 4096n,
  blocks: 121938943n,
  bfree: 61058895n,
  bavail: 61058895n,
  files: 999n,
  ffree: 1000000n
}
```

#### `statfs.bavail`

* Type: {number|bigint}

အခွင့်ထူးမရှိတဲ့ (unprivileged) users တွေအတွက် ရနိုင်တဲ့ free blocks တွေပါ။ ရနိုင်တဲ့ bytes အရေအတွက်ကို ရဖို့ [`statfs.bsize`][] နဲ့ မြှောက်ပါ။

```mjs
import { statfs } from 'node:fs/promises';

const stats = await statfs('/');
const availableBytes = stats.bsize * stats.bavail;
console.log(`Available space: ${availableBytes} bytes`);
```

```cjs
const { statfs } = require('node:fs/promises');

(async () => {
  const stats = await statfs('/');
  const availableBytes = stats.bsize * stats.bavail;
  console.log(`Available space: ${availableBytes} bytes`);
})();
```

#### `statfs.bfree`

* Type: {number|bigint}

File system ထဲက free blocks တွေပါ။ Free bytes အရေအတွက်ကို ရဖို့ [`statfs.bsize`][] နဲ့ မြှောက်ပါ။

```mjs
import { statfs } from 'node:fs/promises';

const stats = await statfs('/');
const freeBytes = stats.bsize * stats.bfree;
console.log(`Free space: ${freeBytes} bytes`);
```

```cjs
const { statfs } = require('node:fs/promises');

(async () => {
  const stats = await statfs('/');
  const freeBytes = stats.bsize * stats.bfree;
  console.log(`Free space: ${freeBytes} bytes`);
})();
```

#### `statfs.blocks`

* Type: {number|bigint}

File system ထဲက data blocks စုစုပေါင်းပါ။ စုစုပေါင်း အရွယ်အစားကို bytes နဲ့ ရဖို့ [`statfs.bsize`][] နဲ့ မြှောက်ပါ။

```mjs
import { statfs } from 'node:fs/promises';

const stats = await statfs('/');
const totalBytes = stats.bsize * stats.blocks;
console.log(`Total space: ${totalBytes} bytes`);
```

```cjs
const { statfs } = require('node:fs/promises');

(async () => {
  const stats = await statfs('/');
  const totalBytes = stats.bsize * stats.blocks;
  console.log(`Total space: ${totalBytes} bytes`);
})();
```

#### `statfs.bsize`

* Type: {number|bigint}

အကောင်းဆုံး (optimal) transfer block size ကို bytes နဲ့ ဖော်ပြပါတယ်။

#### `statfs.frsize`

* Type: {number|bigint}

အခြေခံကျတဲ့ (fundamental) file system block size ပါ။

#### `statfs.ffree`

* Type: {number|bigint}

File system ထဲက free file nodes (လွတ်နေသော file node များ) တွေပါ။

#### `statfs.files`

* Type: {number|bigint}

File system ထဲက file nodes စုစုပေါင်းပါ။

#### `statfs.type`

* Type: {number|bigint}

File system ရဲ့ type ပါ။ File system type အတွက် platform အလိုက် သီးသန့် numeric identifier တစ်ခုပါ။ ဒီတန်ဖိုးက POSIX systems တွေပေါ်မှာ `statfs(2)` က ပြန်ပေးတဲ့ `f_type` field နဲ့ ကိုက်ညီပါတယ် (ဥပမာ — Linux ပေါ်က ext4 အတွက် `0xEF53`)။ ၎င်းရဲ့ အဓိပ္ပာယ်က OS ပေါ်မှာ မူတည်ပြီး — platforms တွေကြားမှာ တသမတ်တည်း ဖြစ်မယ်လို့ အာမခံချက် မရှိပါဘူး။

### Class: `fs.Utf8Stream`

> Stability: 1 - Experimental

အတွင်းပိုင်း buffering တွေ အားလုံးကို လိုအပ်သလို (on demand) flush လုပ်ခွင့်ပြုပေးတဲ့ optimized (ပိုမို ကောင်းမွန်အောင် ပြုပြင်ထားသော) UTF-8 stream writer တစ်ခုပါ။ ၎င်းက `EAGAIN` errors တွေကို မှန်ကန်စွာ ကိုင်တွယ်ပြီး — ဥပမာ disk က အလုပ်ရှုပ်နေရင် content တွေကို ပစ်ချလိုက်ခြင်းလိုမျိုး — customization ပြုလုပ်ခွင့် ပေးပါတယ်။

#### Event: `'close'`

Stream ကို အပြည့်အဝ ပိတ်လိုက်တဲ့အခါ `'close'` event ကို emit လုပ်ပါတယ်။

#### Event: `'drain'`

Internal buffer က ဆက်လက် ရေးသားနိုင်လောက်အောင် လုံလောက်စွာ drain ဖြစ်သွားတဲ့အခါ `'drain'` event ကို emit လုပ်ပါတယ်။

#### Event: `'drop'`

အများဆုံး အရှည် (maximal length) ကို ရောက်ရှိပြီး အဲဒီ data ကို ရေးသားမှာ မဟုတ်တဲ့အခါ `'drop'` event ကို emit လုပ်ပါတယ်။ ပစ်ချလိုက်တဲ့ data ကို event handler ဆီကို ပထမဆုံး argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။

#### Event: `'error'`

Error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ `'error'` event ကို emit လုပ်ပါတယ်။

#### Event: `'finish'`

Stream ကို end လုပ်ပြီး data တွေ အားလုံးကို underlying file ဆီကို flush လုပ်ပြီးသွားတဲ့အခါ `'finish'` event ကို emit လုပ်ပါတယ်။

#### Event: `'ready'`

Stream က writes တွေကို လက်ခံဖို့ အသင့်ဖြစ်တဲ့အခါ `'ready'` event ကို emit လုပ်ပါတယ်။

#### Event: `'write'`

Write operation တစ်ခု ပြီးဆုံးသွားတဲ့အခါ `'write'` event ကို emit လုပ်ပါတယ်။ ရေးသားလိုက်တဲ့ bytes အရေအတွက်ကို event handler ဆီကို ပထမဆုံး argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။
#### `new fs.Utf8Stream([options])`

* `options` {Object}
  * `append`: {boolean} Dest file ကို truncate (ဖြတ်တောက်) လုပ်မယ့်အစား — ရေးသားမှုတွေကို အဲဒီ file ဆီကို append (ထည့်ရေး) လုပ်ပေးပါတယ်။
    **Default**: `true`.
  * `contentMode`: {string} Write function ဆီကို ပို့လို့ရတဲ့ data အမျိုးအစားကို သတ်မှတ်ပါတယ် — support လုပ်တဲ့ တန်ဖိုးတွေက `'utf8'` သို့မဟုတ် `'buffer'` ပါ။
    **Default**: `'utf8'`.
  * `dest`: {string} ရေးသားမယ့် file တစ်ခုဆီကို ညွှန်ပြတဲ့ path ပါ (mode ကို append option က ထိန်းချုပ်ပါတယ်)။
  * `fd`: {number} `fs.open()` သို့မဟုတ် `fs.openSync()` က ပြန်ပေးလေ့ရှိတဲ့ file descriptor တစ်ခုပါ။
  * `fs`: {Object} `fs` module နဲ့ API တူညီတဲ့ object တစ်ခုပါ — stream ရဲ့ အပြုအမူကို mocking (အတုပြုလုပ်ခြင်း), testing (စမ်းသပ်ခြင်း) သို့မဟုတ် စိတ်ကြိုက် ပြုပြင်သတ်မှတ်ခြင်း အတွက် အသုံးဝင်ပါတယ်။
  * `fsync`: {boolean} Write တစ်ခု ပြီးဆုံးတိုင်း `fs.fsyncSync()` တစ်ခုကို လုပ်ဆောင်ပါတယ်။
  * `maxLength`: {number} အတွင်းပိုင်း (internal) buffer ရဲ့ အများဆုံး length ပါ။ Write operation တစ်ခုက buffer ကို `maxLength` ထက် ကျော်လွန်စေမယ်ဆိုရင် — ရေးသားလိုက်တဲ့ data ကို ပစ်ချ (drop) လိုက်ပြီး — ပစ်ချလိုက်တဲ့ data နဲ့အတူ drop event တစ်ခုကို emit လုပ်ပါတယ်
  * `maxWrite`: {number} ရေးသားနိုင်တဲ့ bytes အများဆုံး အရေအတွက်ပါ;
    **Default**: `16384`
  * `minLength`: {number} Flush မလုပ်ခင် အပြည့် (full) ဖြစ်ရန် လိုအပ်တဲ့ အတွင်းပိုင်း buffer ရဲ့ အနည်းဆုံး length ပါ။
  * `mkdir`: {boolean} `true` ဆိုရင် `dest` file အတွက် directory ရှိကြောင်း သေချာစေပါတယ်။
    **Default**: `false`.
  * `mode`: {number|string} ဖန်တီးမယ့် file ရဲ့ mode ကို သတ်မှတ်ပေးပါတယ် (`fs.open()` ကို ကြည့်ပါ)။
  * `periodicFlush`: {number} `periodicFlush` milliseconds တိုင်း flush ကို ခေါ်ယူပါတယ်။
  * `retryEAGAIN` {Function} `write()`, `writeSync()` သို့မဟုတ် `flushSync()` တစ်ခုခုက `EAGAIN` သို့မဟုတ် `EBUSY` error တစ်ခုကို ကြုံတွေ့ရတဲ့အခါ ခေါ်ယူမယ့် function တစ်ခုပါ။ Return တန်ဖိုးက `true` ဆိုရင် operation ကို ပြန်ကြိုးစားပြီး — မဟုတ်ရင်တော့ error ကို အပေါ်ကို ပြန်တင်ပို့ (bubble) ပါလိမ့်မယ်။ `err` က ဒီ function ကို ခေါ်ယူစေခဲ့တဲ့ error ဖြစ်ပြီး — `writeBufferLen` က ရေးသားခဲ့တဲ့ buffer ရဲ့ length ဖြစ်ကာ — `remainingBufferLen` ကတော့ stream က ရေးသားဖို့ မကြိုးစားခဲ့တဲ့ ကျန်ရှိနေတဲ့ buffer ရဲ့ length ပါ။
    * `err` {any} Error တစ်ခု သို့မဟုတ် `null` ပါ။
    * `writeBufferLen` {number}
    * `remainingBufferLen`: {number}
  * `sync`: {boolean} Writes တွေကို synchronously လုပ်ဆောင်ပါတယ်။
* Returns: {fs.Utf8Stream}

#### `utf8Stream.append`

* {boolean} Stream က file ဆီကို append လုပ်နေလား သို့မဟုတ် truncate လုပ်နေလားဆိုတာပါ။

#### `utf8Stream.contentMode`

* {string} Stream ဆီကို ရေးသားနိုင်တဲ့ data အမျိုးအစားပါ။ Support လုပ်တဲ့
  တန်ဖိုးတွေက `'utf8'` သို့မဟုတ် `'buffer'` ပါ။ **Default**: `'utf8'`.

#### `utf8Stream.destroy()`

Stream ကို — အတွင်းပိုင်း buffer ကို flush မလုပ်ပဲ — ချက်ချင်း ပိတ်ပါတယ်။

#### `utf8Stream.end()`

Stream ကို သပ်ရပ်စွာ (gracefully) ပိတ်ပြီး — မပိတ်ခင် — အတွင်းပိုင်း buffer ကို flush လုပ်ပါတယ်။

#### `utf8Stream.fd`

* {number} ရေးသားနေတဲ့ file descriptor ပါ။

#### `utf8Stream.file`

* {string} ရေးသားနေတဲ့ file ပါ။

#### `utf8Stream.flush(callback)`

* `callback` {Function}
  * `err` {Error|null} Flush မအောင်မြင်ခဲ့ရင် error တစ်ခု ဖြစ်ပြီး — မဟုတ်ရင်တော့ `null` ပါ။

Write တစ်ခု လုပ်ဆောင်နေခြင်း မရှိဘူးဆိုရင် — လက်ရှိ buffer ကို file ဆီကို ရေးသားပါတယ်။ `minLength` က သုည ဖြစ်နေရင် သို့မဟုတ် ရေးသားနေပြီးသား ဖြစ်နေရင်တော့ ဘာမှ မလုပ်ပါဘူး။

#### `utf8Stream.flushSync()`

Buffer လုပ်ထားတဲ့ data တွေကို synchronously flush လုပ်ပါတယ်။ ဒါက ကုန်ကျစရိတ် မြင့်တဲ့ (costly) operation တစ်ခုပါ။

#### `utf8Stream.fsync`

* {boolean} Stream က write operation တိုင်းရဲ့ နောက်မှာ `fs.fsyncSync()` တစ်ခုကို
  လုပ်ဆောင်နေလားဆိုတာပါ။

#### `utf8Stream.maxLength`

* {number} အတွင်းပိုင်း buffer ရဲ့ အများဆုံး length ပါ။ Write operation တစ်ခုက
  buffer ကို `maxLength` ထက် ကျော်လွန်စေမယ်ဆိုရင် — ရေးသားလိုက်တဲ့ data ကို ပစ်ချလိုက်ပြီး —
  ပစ်ချလိုက်တဲ့ data နဲ့အတူ drop event တစ်ခုကို emit လုပ်ပါတယ်။

#### `utf8Stream.minLength`

* {number} Flush မလုပ်ခင် အပြည့် ဖြစ်ရန် လိုအပ်တဲ့ အတွင်းပိုင်း buffer ရဲ့ အနည်းဆုံး
  length ပါ။

#### `utf8Stream.mkdir`

* {boolean} Stream က `dest` file အတွက် directory ရှိကြောင်း သေချာစေသင့်လားဆိုတာပါ။
  `true` ဆိုရင် — directory မရှိဘူးဆိုရင် — ၎င်းကို ဖန်တီးပေးပါလိမ့်မယ်။ **Default**: `false`.

#### `utf8Stream.mode`

* {number|string} ရေးသားနေတဲ့ file ရဲ့ mode ပါ။

#### `utf8Stream.periodicFlush`

* {number} Flushes တွေကြားက milliseconds အရေအတွက်ပါ။ `0` အဖြစ် သတ်မှတ်ထားရင် —
  periodic flushes တွေ ဘာမှ လုပ်ဆောင်မှာ မဟုတ်ပါဘူး။

#### `utf8Stream.reopen(file)`

* `file`: {string|Buffer|URL} ရေးသားမယ့် file တစ်ခုဆီကို ညွှန်ပြတဲ့ path ပါ (mode
  ကို append option က ထိန်းချုပ်ပါတယ်)။

File ကို နေရာမှာပဲ ပြန်လည်ဖွင့် (reopen) လုပ်ပါတယ် — log rotation အတွက် အသုံးဝင်ပါတယ်။

#### `utf8Stream.sync`

* {boolean} Stream က synchronously ရေးသားနေလား သို့မဟုတ် asynchronously ရေးသားနေလားဆိုတာပါ။

#### `utf8Stream.write(data)`

* `data` {string|Buffer} ရေးသားရမယ့် data ပါ။
* Returns {boolean}

Stream ကို ဖန်တီးတဲ့အခါ `options.contentMode` ကို `'utf8'` အဖြစ် သတ်မှတ်ထားရင် — `data` argument က string တစ်ခု ဖြစ်ရပါမယ်။ `contentMode` ကို `'buffer'` အဖြစ် သတ်မှတ်ထားရင်တော့ — `data` argument က {Buffer} တစ်ခု ဖြစ်ရပါမယ်။

#### `utf8Stream.writing`

* {boolean} Stream က လက်ရှိမှာ data တွေကို file ဆီကို ရေးသားနေလားဆိုတာပါ။

#### `utf8Stream[Symbol.dispose]()`

`utf8Stream.destroy()` ကို ခေါ်ယူပါတယ်။

ဒီ method က stream ကို [`using`][] နဲ့တွဲ သုံးနိုင်စေပြီး — scope ကနေ ထွက်သွားတဲ့အခါ — stream ကို အလိုအလျောက် destroy လုပ်ပါလိမ့်မယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [MDN documentation on `using` statements][`using`] ကို ကြည့်ပါ။

### Class: `fs.WriteStream`

* Extends {stream.Writable}

{fs.WriteStream} ရဲ့ instances တွေကို တိုက်ရိုက် (directly) ဆောက်လုပ် (construct) လို့ မရပါဘူး။ ၎င်းတို့ကို [`fs.createWriteStream()`][] function ကို သုံးပြီး ဖန်တီးကာ ပြန်ပေးပါတယ်။

#### Event: `'close'`

{fs.WriteStream} ရဲ့ underlying file descriptor ကို ပိတ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။

#### Event: `'open'`

* `fd` {integer} {fs.WriteStream} က သုံးတဲ့ integer file descriptor ပါ။

{fs.WriteStream} ရဲ့ file ကို ဖွင့်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။

#### Event: `'ready'`

{fs.WriteStream} ကို သုံးစွဲဖို့ အသင့် ဖြစ်လာတဲ့အခါ emit လုပ်ပါတယ်။

`'open'` ပြီးပြီးချင်း ချက်ချင်း ဖြစ်ပေါ်ပါတယ်။

#### `writeStream.bytesWritten`

အခုအချိန်အထိ ရေးသားပြီးတဲ့ bytes အရေအတွက်ပါ။ ရေးသားဖို့ queue ထဲမှာ ကျန်ရှိနေသေးတဲ့ data တွေကို မပါဝင်ပါဘူး။

#### `writeStream.close([callback])`

* `callback` {Function}
  * `err` {Error}

`writeStream` ကို ပိတ်ပါတယ်။ Optional အနေနဲ့ — `writeStream` ပိတ်သွားတာနဲ့ — လုပ်ဆောင်ပေးမယ့် callback တစ်ခုကို လက်ခံပါတယ်။

#### `writeStream.path`

Stream က ရေးသားနေတဲ့ file ဆီကို [`fs.createWriteStream()`][] ရဲ့ ပထမဆုံး argument မှာ သတ်မှတ်ပေးခဲ့တဲ့အတိုင်း path ပါ။ `path` ကို string အနေနဲ့ ဖြတ်သန်းပေးခဲ့ရင် `writeStream.path` က string တစ်ခု ဖြစ်ပါလိမ့်မယ်။ `path` ကို {Buffer} အနေနဲ့ ဖြတ်သန်းပေးခဲ့ရင်တော့ `writeStream.path` က {Buffer} တစ်ခု ဖြစ်ပါလိမ့်မယ်။

#### `writeStream.pending`

* Type: {boolean}

Underlying file ကို မဖွင့်ရသေးဘူးဆိုရင် — ဆိုလိုတာက `'ready'` event ကို emit မလုပ်ရသေးတဲ့အချိန်မှာ — ဒီ property က `true` ဖြစ်ပါတယ်။

### `fs.constants`

* Type: {Object}

File system operations တွေအတွက် အသုံးများတဲ့ constants တွေ ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။

#### FS constants (FS ကိန်းသေများ)

အောက်ပါ constants တွေကို `fs.constants` နဲ့ `fsPromises.constants` ကနေ export လုပ်ပါတယ်။

Constants တိုင်းက operating system တိုင်းမှာ ရနိုင်မှာ မဟုတ်ပါဘူး — ဒါက Windows အတွက် အထူး အရေးကြီးပါတယ် — POSIX အတွက် သီးသန့် definitions တွေ အများအပြားက အဲဒီမှာ မရနိုင်လို့ပါ။ Portable applications တွေအတွက်တော့ — မသုံးခင် — အဲဒီ constants တွေ ရှိမရှိကို စစ်ဆေးဖို့ အကြံပြုထားပါတယ်။

Constant တစ်ခုထက်ပိုပြီး သုံးဖို့ဆိုရင် bitwise OR `|` operator ကို သုံးပါ။

ဥပမာ:

```mjs
import { open, constants } from 'node:fs';

const {
  O_RDWR,
  O_CREAT,
  O_EXCL,
} = constants;

open('/path/to/my/file', O_RDWR | O_CREAT | O_EXCL, (err, fd) => {
  // ...
});
```

##### File access constants (file access ကိန်းသေများ)

အောက်ပါ constants တွေက [`fsPromises.access()`][], [`fs.access()`][] နဲ့ [`fs.accessSync()`][] တို့ဆီကို ဖြတ်သန်းပေးတဲ့ `mode` parameter အဖြစ် သုံးဖို့ ရည်ရွယ်ပါတယ်။

| Constant | Description |
| --- | --- |
| `F_OK` | File က calling process အတွက် မြင်နိုင်တယ်ဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ File တစ်ခု ရှိမရှိ ဆုံးဖြတ်ဖို့ အသုံးဝင်ပေမယ့် — `rwx` permissions အကြောင်းကိုတော့ ဘာမှ မဖော်ပြပါဘူး။ Mode မသတ်မှတ်ထားရင် default ဖြစ်ပါတယ်။ |
| `R_OK` | File ကို calling process က ဖတ်နိုင်တယ်ဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ |
| `W_OK` | File ကို calling process က ရေးနိုင်တယ်ဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ |
| `X_OK` | File ကို calling process က execute လုပ်နိုင်တယ်ဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ Windows မှာ အကျိုးသက်ရောက်မှု မရှိပါဘူး (`fs.constants.F_OK` လိုပဲ ပြုမူပါလိမ့်မယ်)။ |

ဒီ definitions တွေက Windows မှာလည်း ရနိုင်ပါတယ်။

##### File copy constants (file copy ကိန်းသေများ)

အောက်ပါ constants တွေက [`fs.copyFile()`][] နဲ့တွဲ သုံးဖို့ ရည်ရွယ်ပါတယ်။

| Constant | Description |
| --- | --- |
| `COPYFILE_EXCL` | ပါဝင်နေရင် — destination path က ရှိပြီးသားဆိုရင် — copy operation က error တစ်ခုနဲ့ မအောင်မြင်ပါဘူး။ |
| `COPYFILE_FICLONE` | ပါဝင်နေရင် copy operation က copy-on-write reflink (ကူးရေးချိန်မှ ကူးယူသော reflink) တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားပါတယ်။ Underlying platform က copy-on-write ကို support မလုပ်ဘူးဆိုရင် — fallback copy mechanism (နောက်ဆုတ် ကူးယူမှု ယန္တရား) တစ်ခုကို သုံးပါတယ်။ |
| `COPYFILE_FICLONE_FORCE` | ပါဝင်နေရင် copy operation က copy-on-write reflink (ကူးရေးချိန်မှ ကူးယူသော reflink) တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားပါတယ်။ Underlying platform က copy-on-write ကို support မလုပ်ဘူးဆိုရင် — operation က error တစ်ခုနဲ့ မအောင်မြင်ပါဘူး။ |

ဒီ definitions တွေက Windows မှာလည်း ရနိုင်ပါတယ်။

##### File open constants (file open ကိန်းသေများ)

အောက်ပါ constants တွေက `fs.open()` နဲ့တွဲ သုံးဖို့ ရည်ရွယ်ပါတယ်။

| Constant | Description |
| --- | --- |
| `O_RDONLY` | File တစ်ခုကို read-only (ဖတ်ရန်သာ) access အတွက် ဖွင့်ဖို့ ညွှန်ပြတဲ့ flag ပါ။ |
| `O_WRONLY` | File တစ်ခုကို write-only (ရေးရန်သာ) access အတွက် ဖွင့်ဖို့ ညွှန်ပြတဲ့ flag ပါ။ |
| `O_RDWR` | File တစ်ခုကို read-write (ဖတ်ရန်နှင့် ရေးရန်) access အတွက် ဖွင့်ဖို့ ညွှန်ပြတဲ့ flag ပါ။ |
| `O_CREAT` | File က မရှိသေးဘူးဆိုရင် ဖန်တီးဖို့ ညွှန်ပြတဲ့ flag ပါ။ |
| `O_EXCL` | `O_CREAT` flag ကို သတ်မှတ်ထားပြီး file က ရှိပြီးသားဆိုရင် — file ဖွင့်တာ မအောင်မြင်သင့်ဘူးဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ |
| `O_NOCTTY` | Path က terminal device တစ်ခုကို ခွဲခြားဖော်ပြနေရင် — (process မှာ ကိုယ်ပိုင် controlling terminal မရှိသေးဘူးဆိုရင်) — path ကို ဖွင့်လိုက်တာက အဲဒီ terminal ကို process ရဲ့ controlling terminal ဖြစ်လာစေမှာ မဟုတ်ဘူးဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ |
| `O_TRUNC` | File က ရှိပြီး regular file တစ်ခု ဖြစ်ကာ — file ကို write access အတွက် အောင်မြင်စွာ ဖွင့်လိုက်ရင် — ၎င်းရဲ့ length ကို သုညအထိ ဖြတ်တောက် (truncate) ခံရမယ်ဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ |
| `O_APPEND` | Data တွေကို file ရဲ့ အဆုံးမှာ ထည့်ရေး (append) လုပ်မယ်ဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ |
| `O_DIRECTORY` | Path က directory တစ်ခု မဟုတ်ဘူးဆိုရင် — ဖွင့်တာ မအောင်မြင်သင့်ဘူးဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ |
| `O_NOATIME` | File system ဆီကို ဖတ်ရှုခြင်း (reading) access တွေက file နဲ့ ဆက်စပ်နေတဲ့ `atime` အချက်အလက်ကို update လုပ်တော့မှာ မဟုတ်ဘူးဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ ဒီ flag က Linux operating systems တွေမှာသာ ရပါတယ်။ |
| `O_NOFOLLOW` | Path က symbolic link တစ်ခုဆိုရင် — ဖွင့်တာ မအောင်မြင်သင့်ဘူးဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ |
| `O_SYNC` | File ကို synchronized I/O အတွက် ဖွင့်ပြီး — write operations တွေက file integrity အတွက် စောင့်ဆိုင်းတယ်ဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ Windows မှာ ဒါက `FILE_FLAG_WRITE_THROUGH` ဆီကို map လုပ်ပါတယ်။ |
| `O_DSYNC` | File ကို synchronized I/O အတွက် ဖွင့်ပြီး — write operations တွေက data integrity အတွက် စောင့်ဆိုင်းတယ်ဆိုတာ ညွှန်ပြတဲ့ flag ပါ။ Windows မှာ ဒါက `FILE_FLAG_WRITE_THROUGH` ဆီကို map လုပ်ပါတယ်။ |
| `O_SYMLINK` | Symbolic link က ညွှန်ပြနေတဲ့ resource အစား — symbolic link ကိုယ်တိုင်ကို ဖွင့်ဖို့ ညွှန်ပြတဲ့ flag ပါ။ |
| `O_DIRECT` | သတ်မှတ်ထားရင် — file I/O ရဲ့ caching သက်ရောက်မှုတွေကို အနည်းဆုံးဖြစ်အောင် ကြိုးစားပါလိမ့်မယ်။ Windows မှာ ဒါက `FILE_FLAG_NO_BUFFERING` ဆီကို map လုပ်ပါတယ်။ |
| `O_NONBLOCK` | ဖြစ်နိုင်ရင် file ကို nonblocking mode နဲ့ ဖွင့်ဖို့ ညွှန်ပြတဲ့ flag ပါ။ |
| `UV_FS_O_FILEMAP` | သတ်မှတ်ထားရင် file ကို ဝင်ရောက်ဖို့ memory file mapping တစ်ခုကို သုံးပါတယ်။ ဒီ flag က Windows operating systems တွေမှာသာ ရပြီး — တခြား operating systems တွေမှာတော့ လျစ်လျူရှုခံရပါတယ်။ |
| `UV_FS_O_TEMPORARY` | သတ်မှတ်ထားရင် — file ဆီက နောက်ဆုံး handle ကို ပိတ်လိုက်တဲ့အခါ — file ကို အလိုအလျောက် ဖျက်ပါတယ်။ ဒီ flag က Windows operating systems တွေမှာသာ ရပြီး — တခြား operating systems တွေမှာတော့ လျစ်လျူရှုခံရပါတယ်။ |
| `UV_FS_O_SHORT_LIVED` | File က သက်တမ်းတို (short-lived) ဖြစ်တာမို့ — system က ဖြစ်နိုင်ရင် ၎င်းကို disk ဆီကို flush လုပ်တာ ရှောင်သင့်တယ်ဆိုတဲ့ hint ပါ။ ဒီ flag က Windows operating systems တွေမှာသာ ရပြီး — တခြား operating systems တွေမှာတော့ လျစ်လျူရှုခံရပါတယ်။ |
| `UV_FS_O_SEQUENTIAL` | Caching ကို အကောင်းဆုံးဖြစ်အောင် — file ကို အစကနေ အဆုံးအထိ sequentially (အစဉ်လိုက်) ဝင်ရောက်မယ်ဆိုတဲ့ hint ပါ။ ဒီ flag က Windows operating systems တွေမှာသာ ရပြီး — တခြား operating systems တွေမှာတော့ လျစ်လျူရှုခံရပါတယ်။ |
| `UV_FS_O_RANDOM` | Caching ကို အကောင်းဆုံးဖြစ်အောင် — file ကို random ဝင်ရောက်မယ်ဆိုတဲ့ hint ပါ။ ဒီ flag က Windows operating systems တွေမှာသာ ရပြီး — တခြား operating systems တွေမှာတော့ လျစ်လျူရှုခံရပါတယ်။ |

Windows မှာတော့ `O_APPEND`, `O_CREAT`, `O_EXCL`, `O_RDONLY`, `O_RDWR`, `O_TRUNC`, `O_WRONLY`, `UV_FS_O_FILEMAP`, `UV_FS_O_TEMPORARY`, `UV_FS_O_SHORT_LIVED`, `UV_FS_O_SEQUENTIAL` နဲ့ `UV_FS_O_RANDOM` တွေသာ ရနိုင်ပါတယ်။

##### File type constants (file type ကိန်းသေများ)

အောက်ပါ constants တွေက file တစ်ခုရဲ့ type ကို ဆုံးဖြတ်ဖို့ — {fs.Stats} object ရဲ့ `mode` property နဲ့တွဲ — သုံးဖို့ ရည်ရွယ်ပါတယ်။

| Constant | Description |
| --- | --- |
| `S_IFMT` | File type code ကို ထုတ်ယူဖို့ သုံးတဲ့ bit mask ပါ။ |
| `S_IFREG` | Regular file (သာမန် file) တစ်ခုအတွက် file type constant ပါ။ |
| `S_IFDIR` | Directory တစ်ခုအတွက် file type constant ပါ။ |
| `S_IFCHR` | Character-oriented device file (character ပုံစံ device file) တစ်ခုအတွက် file type constant ပါ။ |
| `S_IFBLK` | Block-oriented device file (block ပုံစံ device file) တစ်ခုအတွက် file type constant ပါ။ |
| `S_IFIFO` | FIFO/pipe တစ်ခုအတွက် file type constant ပါ။ |
| `S_IFLNK` | Symbolic link တစ်ခုအတွက် file type constant ပါ။ |
| `S_IFSOCK` | Socket တစ်ခုအတွက် file type constant ပါ။ |

Windows မှာတော့ `S_IFCHR`, `S_IFDIR`, `S_IFLNK`, `S_IFMT` နဲ့ `S_IFREG` တွေသာ ရနိုင်ပါတယ်။

##### File mode constants (file mode ကိန်းသေများ)

အောက်ပါ constants တွေက file တစ်ခုရဲ့ access permissions (ဝင်ရောက်ခွင့် ခွင့်ပြုချက်များ) ကို ဆုံးဖြတ်ဖို့ — {fs.Stats} object ရဲ့ `mode` property နဲ့တွဲ — သုံးဖို့ ရည်ရွယ်ပါတယ်။

| Constant | Description |
| --- | --- |
| `S_IRWXU` | Owner က ဖတ်, ရေး နဲ့ execute လုပ်နိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |
| `S_IRUSR` | Owner က ဖတ်နိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |
| `S_IWUSR` | Owner က ရေးနိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |
| `S_IXUSR` | Owner က execute လုပ်နိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |
| `S_IRWXG` | Group က ဖတ်, ရေး နဲ့ execute လုပ်နိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |
| `S_IRGRP` | Group က ဖတ်နိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |
| `S_IWGRP` | Group က ရေးနိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |
| `S_IXGRP` | Group က execute လုပ်နိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |
| `S_IRWXO` | အခြားသူများ (others) က ဖတ်, ရေး နဲ့ execute လုပ်နိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |
| `S_IROTH` | အခြားသူများ (others) က ဖတ်နိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |
| `S_IWOTH` | အခြားသူများ (others) က ရေးနိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |
| `S_IXOTH` | အခြားသူများ (others) က execute လုပ်နိုင်တာကို ညွှန်ပြတဲ့ file mode ပါ။ |

Windows မှာတော့ `S_IRUSR` နဲ့ `S_IWUSR` တွေသာ ရနိုင်ပါတယ်။

## မှတ်စုများ (Notes)

### Callback နှင့် promise-based လုပ်ဆောင်မှုများ၏ အစီအစဉ် (Ordering of callback and promise-based operations)

၎င်းတို့ကို underlying thread pool က asynchronously လုပ်ဆောင်တာမို့ — callback သို့မဟုတ် promise-based methods တစ်ခုခုကို သုံးတဲ့အခါ — အာမခံထားတဲ့ အစီအစဉ် (guaranteed ordering) ဆိုတာ မရှိပါဘူး။

ဥပမာ — အောက်က code က error ဖြစ်နိုင်ခြေ များပါတယ် — ဘာလို့လဲဆိုတော့ `fs.stat()` operation က `fs.rename()` operation ထက် အရင် ပြီးဆုံးသွားနိုင်လို့ပါ:

```js
const fs = require('node:fs');

fs.rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  console.log('renamed complete');
});
fs.stat('/tmp/world', (err, stats) => {
  if (err) throw err;
  console.log(`stats: ${JSON.stringify(stats)}`);
});
```

Operations တွေကို မှန်ကန်စွာ အစီအစဉ်တကျ ထားဖို့ — တစ်ခုရဲ့ ရလဒ်ကို await လုပ်ပြီးမှ နောက်တစ်ခုကို ခေါ်တာမျိုး — လုပ်ဆောင်ပေးဖို့ အရေးကြီးပါတယ်:

```mjs
import { rename, stat } from 'node:fs/promises';

const oldPath = '/tmp/hello';
const newPath = '/tmp/world';

try {
  await rename(oldPath, newPath);
  const stats = await stat(newPath);
  console.log(`stats: ${JSON.stringify(stats)}`);
} catch (error) {
  console.error('there was an error:', error.message);
}
```

```cjs
const { rename, stat } = require('node:fs/promises');

(async function(oldPath, newPath) {
  try {
    await rename(oldPath, newPath);
    const stats = await stat(newPath);
    console.log(`stats: ${JSON.stringify(stats)}`);
  } catch (error) {
    console.error('there was an error:', error.message);
  }
})('/tmp/hello', '/tmp/world');
```

သို့မဟုတ် — callback APIs တွေကို သုံးတဲ့အခါ — `fs.stat()` call ကို `fs.rename()` operation ရဲ့ callback ထဲကို ရွှေ့ထည့်နိုင်ပါတယ်:

```mjs
import { rename, stat } from 'node:fs';

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

```cjs
const { rename, stat } = require('node:fs');

rename('/tmp/hello', '/tmp/world', (err) => {
  if (err) throw err;
  stat('/tmp/world', (err, stats) => {
    if (err) throw err;
    console.log(`stats: ${JSON.stringify(stats)}`);
  });
});
```

### File လမ်းကြောင်းများ (File paths)

`fs` operations တွေ အများစုက — string, {Buffer} သို့မဟုတ် `file:` protocol ကို သုံးတဲ့ {URL} object တစ်ခုအနေနဲ့ — သတ်မှတ်နိုင်တဲ့ file paths တွေကို လက်ခံပါတယ်။

#### String လမ်းကြောင်းများ (String paths)

String paths တွေကို absolute သို့မဟုတ် relative filename တစ်ခုကို ခွဲခြားဖော်ပြတဲ့ UTF-8 character sequences တွေအနေနဲ့ အဓိပ္ပာယ်ကောက်ပါတယ်။ Relative paths တွေကို `process.cwd()` ကို ခေါ်ပြီး သတ်မှတ်တဲ့ current working directory နဲ့ နှိုင်းယှဉ်ပြီး resolve လုပ်ပါလိမ့်မယ်။

POSIX မှာ absolute path တစ်ခုကို သုံးတဲ့ ဥပမာ:

```mjs
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('/open/some/file.txt', 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
```

POSIX မှာ relative path တစ်ခုကို သုံးတဲ့ ဥပမာ (`process.cwd()` နဲ့ နှိုင်းယှဉ်ပြီး):

```mjs
import { open } from 'node:fs/promises';

let fd;
try {
  fd = await open('file.txt', 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
```

#### File URL လမ်းကြောင်းများ (File URL paths)

`node:fs` module ရဲ့ function တွေ အများစုအတွက် — `path` သို့မဟုတ် `filename` argument ကို `file:` protocol ကို သုံးတဲ့ {URL} object တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးနိုင်ပါတယ်။

```mjs
import { readFileSync } from 'node:fs';

readFileSync(new URL('file:///tmp/hello'));
```

`file:` URLs တွေက အမြဲတမ်း absolute paths တွေပါ။

##### Platform အလိုက် သီးသန့် သတိထားစရာများ (Platform-specific considerations)

Windows မှာ host name ပါတဲ့ `file:` {URL}s တွေက UNC paths တွေအဖြစ် ပြောင်းလဲပြီး — drive letters ပါတဲ့ `file:` {URL}s တွေကတော့ local absolute paths တွေအဖြစ် ပြောင်းလဲပါတယ်။ Host name ရော drive letter ပါ မပါတဲ့ `file:` {URL}s တွေကတော့ error တစ်ခုကို ဖြစ်ပေါ်စေပါလိမ့်မယ်:

```mjs
import { readFileSync } from 'node:fs';
// On Windows :

// - WHATWG file URLs with hostname convert to UNC path
// file://hostname/p/a/t/h/file => \\hostname\p\a\t\h\file
readFileSync(new URL('file://hostname/p/a/t/h/file'));

// - WHATWG file URLs with drive letters convert to absolute path
// file:///C:/tmp/hello => C:\tmp\hello
readFileSync(new URL('file:///C:/tmp/hello'));

// - WHATWG file URLs without hostname must have a drive letters
readFileSync(new URL('file:///notdriveletter/p/a/t/h/file'));
readFileSync(new URL('file:///c/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must be absolute
```

Drive letters ပါတဲ့ `file:` {URL}s တွေမှာ drive letter ရဲ့ နောက်မှာ ချက်ချင်း separator အဖြစ် `:` ကို သုံးရပါမယ်။ တခြား separator တစ်ခုကို သုံးရင် error တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။

တခြား platforms တွေ အားလုံးမှာတော့ host name ပါတဲ့ `file:` {URL}s တွေကို support မလုပ်ပဲ — error တစ်ခု ဖြစ်ပေါ်စေပါလိမ့်မယ်:

```mjs
import { readFileSync } from 'node:fs';
// On other platforms:

// - WHATWG file URLs with hostname are unsupported
// file://hostname/p/a/t/h/file => throw!
readFileSync(new URL('file://hostname/p/a/t/h/file'));
// TypeError [ERR_INVALID_FILE_URL_PATH]: must be absolute

// - WHATWG file URLs convert to absolute path
// file:///tmp/hello => /tmp/hello
readFileSync(new URL('file:///tmp/hello'));
```

Encoded slash characters တွေ ပါဝင်တဲ့ `file:` {URL} တစ်ခုက platforms တွေ အားလုံးမှာ error တစ်ခုကို ဖြစ်ပေါ်စေပါလိမ့်မယ်:

```mjs
import { readFileSync } from 'node:fs';

// On Windows
readFileSync(new URL('file:///C:/p/a/t/h/%2F'));
readFileSync(new URL('file:///C:/p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */

// On POSIX
readFileSync(new URL('file:///p/a/t/h/%2F'));
readFileSync(new URL('file:///p/a/t/h/%2f'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
/ characters */
```

Windows မှာ encoded backslash characters တွေ ပါဝင်တဲ့ `file:` {URL}s တွေက error တစ်ခုကို ဖြစ်ပေါ်စေပါလိမ့်မယ်:

```mjs
import { readFileSync } from 'node:fs';

// On Windows
readFileSync(new URL('file:///C:/path/%5C'));
readFileSync(new URL('file:///C:/path/%5c'));
/* TypeError [ERR_INVALID_FILE_URL_PATH]: File URL path must not include encoded
\ or / characters */
```

#### Buffer လမ်းကြောင်းများ (Buffer paths)

{Buffer} တစ်ခုကို သုံးပြီး သတ်မှတ်တဲ့ paths တွေက — file paths တွေကို opaque byte sequences (မဖော်ထုတ်နိုင်သော byte စီကြောင်းများ) အဖြစ် သဘောထားတဲ့ — POSIX operating systems အချို့ပေါ်မှာ အဓိက အသုံးဝင်ပါတယ်။ အဲဒီလို systems တွေမှာ file path တစ်ခုတည်းက character encodings အများအပြားကို သုံးတဲ့ sub-sequences တွေ ပါဝင်နိုင်ပါတယ်။ String paths တွေလိုပဲ — {Buffer} paths တွေက relative သို့မဟုတ် absolute ဖြစ်နိုင်ပါတယ်:

POSIX မှာ absolute path တစ်ခုကို သုံးတဲ့ ဥပမာ:

```mjs
import { open } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

let fd;
try {
  fd = await open(Buffer.from('/open/some/file.txt'), 'r');
  // Do something with the file
} finally {
  await fd?.close();
}
```

#### Windows တွင် drive အလိုက် working directory များ (Per-drive working directories on Windows)

Windows မှာ Node.js က per-drive working directory (drive အလိုက် working directory) ဆိုတဲ့ concept ကို လိုက်နာပါတယ်။ Backslash မပါတဲ့ drive path တစ်ခုကို သုံးတဲ့အခါ ဒီအပြုအမူကို သတိပြုမိနိုင်ပါတယ်။ ဥပမာ — `fs.readdirSync('C:\\')` က `fs.readdirSync('C:')` နဲ့ မတူတဲ့ ရလဒ်တစ်ခုကို ပြန်ပေးနိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [this MSDN page][MSDN-Rel-Path] ကို ကြည့်ပါ။

### File descriptor များ (File descriptors)

POSIX systems တွေမှာ process တိုင်းအတွက် — kernel က လက်ရှိ ဖွင့်ထားတဲ့ files နဲ့ resources တွေရဲ့ table တစ်ခုကို ထိန်းသိမ်းထားပါတယ်။ ဖွင့်ထားတဲ့ file တစ်ခုချင်းစီကို _file descriptor_ လို့ ခေါ်တဲ့ ရိုးရှင်းတဲ့ numeric identifier တစ်ခု ပေးအပ်ပါတယ်။ System အဆင့်မှာ — file system operations တွေ အားလုံးက file တစ်ခုချင်းစီကို ခွဲခြားသတ်မှတ်ပြီး ခြေရာခံဖို့ ဒီ file descriptors တွေကို သုံးပါတယ်။ Windows systems တွေကတော့ resources တွေကို ခြေရာခံဖို့ — မတူညီပေမယ့် concept အရ ဆင်တူတဲ့ — ယန္တရားတစ်ခုကို သုံးပါတယ်။ Users တွေအတွက် အရာတွေကို ရိုးရှင်းအောင်လုပ်ဖို့ — Node.js က operating systems တွေကြားက ကွာခြားချက်တွေကို abstraction လုပ်ဖယ်ထားပြီး — ဖွင့်ထားတဲ့ files တွေ အားလုံးကို numeric file descriptor တစ်ခု ပေးအပ်ပါတယ်။

Callback-based `fs.open()` နဲ့ synchronous `fs.openSync()` methods တွေက file တစ်ခုကို ဖွင့်ပြီး file descriptor အသစ်တစ်ခုကို ခွဲဝေပေးပါတယ်။ ခွဲဝေပေးလိုက်တာနဲ့ — file descriptor ကို file ကနေ data ဖတ်ရန်, file ဆီကို data ရေးသားရန် သို့မဟုတ် file အကြောင်း အချက်အလက် တောင်းခံရန် သုံးနိုင်ပါတယ်။

Operating systems တွေက တစ်ချိန်တည်းမှာ ဖွင့်ထားနိုင်တဲ့ file descriptors အရေအတွက်ကို ကန့်သတ်ထားတာမို့ — operations တွေ ပြီးဆုံးတဲ့အခါ descriptor ကို ပိတ်ပေးဖို့က အလွန် အရေးကြီးပါတယ်။ အဲဒီလို မလုပ်ရင် — နောက်ဆုံးမှာ application တစ်ခုကို crash ဖြစ်စေမယ့် — memory leak တစ်ခုကို ဖြစ်ပေါ်စေပါလိမ့်မယ်။

```mjs
import { open, close, fstat } from 'node:fs';

function closeFd(fd) {
  close(fd, (err) => {
    if (err) throw err;
  });
}

open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  try {
    fstat(fd, (err, stat) => {
      if (err) {
        closeFd(fd);
        throw err;
      }

      // use stat

      closeFd(fd);
    });
  } catch (err) {
    closeFd(fd);
    throw err;
  }
});
```

Promise-based APIs တွေက numeric file descriptor အစား {FileHandle} object တစ်ခုကို သုံးပါတယ်။ ဒီ objects တွေက resources တွေ မပေါက်ကြားအောင် သေချာစေဖို့ — system က ပိုကောင်းအောင် စီမံပေးပါတယ်။ ဒါပေမယ့် — operations တွေ ပြီးဆုံးတဲ့အခါ — ၎င်းတို့ကို ပိတ်ပေးဖို့ လိုအပ်နေဆဲ ဖြစ်ပါတယ်:

```mjs
import { open } from 'node:fs/promises';

let file;
try {
  file = await open('/open/some/file.txt', 'r');
  const stat = await file.stat();
  // use stat
} finally {
  await file.close();
}
```

### Threadpool အသုံးပြုမှု (Threadpool usage)

Callback နဲ့ promise-based file system APIs တွေ အားလုံးက (`fs.FSWatcher()` ကလွဲလို့) libuv ရဲ့ threadpool ကို သုံးပါတယ်။ ဒါက application အချို့အတွက် အံ့အားသင့်စရာကောင်းပြီး ဆိုးကျိုးရှိတဲ့ performance သက်ရောက်မှုတွေ ရှိနိုင်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`UV_THREADPOOL_SIZE`][] documentation ကို ကြည့်ပါ။

### File system flag များ (File system flags)

`flag` option က string တစ်ခုကို လက်ခံတဲ့ နေရာတိုင်းမှာ အောက်ပါ flags တွေ ရနိုင်ပါတယ်။

* `'a'`: File ကို appending (ထည့်ရေးခြင်း) အတွက် ဖွင့်ပါတယ်။
  File က မရှိဘူးဆိုရင် ဖန်တီးပါတယ်။

* `'ax'`: `'a'` လိုပါပဲ — ဒါပေမယ့် path က ရှိပြီးသားဆိုရင် မအောင်မြင်ပါဘူး။

* `'a+'`: File ကို ဖတ်ခြင်းနဲ့ appending အတွက် ဖွင့်ပါတယ်။
  File က မရှိဘူးဆိုရင် ဖန်တီးပါတယ်။

* `'ax+'`: `'a+'` လိုပါပဲ — ဒါပေမယ့် path က ရှိပြီးသားဆိုရင် မအောင်မြင်ပါဘူး။

* `'as'`: File ကို synchronous mode နဲ့ appending အတွက် ဖွင့်ပါတယ်။
  File က မရှိဘူးဆိုရင် ဖန်တီးပါတယ်။

* `'as+'`: File ကို synchronous mode နဲ့ ဖတ်ခြင်းနဲ့ appending အတွက် ဖွင့်ပါတယ်။
  File က မရှိဘူးဆိုရင် ဖန်တီးပါတယ်။

* `'r'`: File ကို ဖတ်ခြင်းအတွက် ဖွင့်ပါတယ်။
  File က မရှိဘူးဆိုရင် exception တစ်ခု ဖြစ်ပေါ်ပါတယ်။

* `'rs'`: File ကို synchronous mode နဲ့ ဖတ်ခြင်းအတွက် ဖွင့်ပါတယ်။
  File က မရှိဘူးဆိုရင် exception တစ်ခု ဖြစ်ပေါ်ပါတယ်။

* `'r+'`: File ကို ဖတ်ခြင်းနဲ့ ရေးသားခြင်းအတွက် ဖွင့်ပါတယ်။
  File က မရှိဘူးဆိုရင် exception တစ်ခု ဖြစ်ပေါ်ပါတယ်။

* `'rs+'`: File ကို synchronous mode နဲ့ ဖတ်ခြင်းနဲ့ ရေးသားခြင်းအတွက် ဖွင့်ပါတယ်။ Operating system ကို local file system cache ကို ကျော်သွားဖို့ ညွှန်ကြားပါတယ်။

  ဒါက — သက်တမ်းလွန် (stale) ဖြစ်နိုင်တဲ့ local cache ကို ကျော်သွားနိုင်စေတာမို့ — NFS mounts တွေပေါ်က files တွေကို ဖွင့်တဲ့အခါ အဓိက အသုံးဝင်ပါတယ်။ ဒါက I/O performance ကို တကယ့်ကို သိသိသာသာ သက်ရောက်မှု ရှိတာမို့ — မလိုအပ်ရင် ဒီ flag ကို သုံးဖို့ အကြံပြုမထားပါဘူး။

  ဒါက `fs.open()` သို့မဟုတ် `fsPromises.open()` ကို synchronous blocking call တစ်ခုအဖြစ် ပြောင်းလဲပေးတာ မဟုတ်ပါဘူး။ Synchronous operation လိုချင်ရင် `fs.openSync()` လိုမျိုး တစ်ခုခုကို သုံးသင့်ပါတယ်။

* `'w'`: File ကို ရေးသားခြင်းအတွက် ဖွင့်ပါတယ်။
  File ကို (မရှိဘူးဆိုရင်) ဖန်တီးပြီး — (ရှိပြီးသားဆိုရင်) truncate လုပ်ပါတယ်။

* `'wx'`: `'w'` လိုပါပဲ — ဒါပေမယ့် path က ရှိပြီးသားဆိုရင် မအောင်မြင်ပါဘူး။

* `'w+'`: File ကို ဖတ်ခြင်းနဲ့ ရေးသားခြင်းအတွက် ဖွင့်ပါတယ်။
  File ကို (မရှိဘူးဆိုရင်) ဖန်တီးပြီး — (ရှိပြီးသားဆိုရင်) truncate လုပ်ပါတယ်။

* `'wx+'`: `'w+'` လိုပါပဲ — ဒါပေမယ့် path က ရှိပြီးသားဆိုရင် မအောင်မြင်ပါဘူး။

`flag` က — open(2) မှာ မှတ်တမ်းတင်ထားသလို — number တစ်ခုလည်း ဖြစ်နိုင်ပြီး — အသုံးများတဲ့ constants တွေကို `fs.constants` ကနေ ရနိုင်ပါတယ်။ Windows မှာ flags တွေကို သက်ဆိုင်ရာ ညီမျှတဲ့ (equivalent) ပုံစံတွေဆီကို ပြောင်းပေးပါတယ် — ဥပမာ — `CreateFileW` က လက်ခံတဲ့အတိုင်း — `O_WRONLY` ကို `FILE_GENERIC_WRITE` ဆီကို သို့မဟုတ် `O_EXCL|O_CREAT` ကို `CREATE_NEW` ဆီကို ပြောင်းပေးပါတယ်။

Exclusive flag `'x'` (open(2) ထဲက `O_EXCL` flag) က — path က ရှိပြီးသားဆိုရင် — operation က error တစ်ခု ပြန်ပေးစေပါတယ်။ POSIX မှာ path က symbolic link တစ်ခုဆိုရင် — link က မရှိတဲ့ path တစ်ခုဆီကို ညွှန်ပြနေရင်တောင် — `O_EXCL` ကို သုံးတာက error တစ်ခု ပြန်ပေးပါတယ်။ Exclusive flag က network file systems တွေမှာ အလုပ်မလုပ်နိုင်ပါဘူး။

Linux မှာ file ကို append mode နဲ့ ဖွင့်ထားတဲ့အခါ — positional writes တွေ အလုပ်မလုပ်ပါဘူး။ Kernel က position argument ကို လျစ်လျူရှုပြီး data တွေကို file ရဲ့ အဆုံးမှာ အမြဲတမ်း append လုပ်ပါတယ်။

File တစ်ခုကို အစားထိုးမယ့်အစား ပြုပြင်မွမ်းမံတာက — `flag` option ကို default `'w'` အစား `'r+'` အဖြစ် — သတ်မှတ်ဖို့ လိုအပ်စေနိုင်ပါတယ်။

Flags တစ်ချို့ရဲ့ အပြုအမူက platform အလိုက် သီးသန့် ကွဲပြားပါတယ်။ အဲဒါကြောင့် — အောက်က ဥပမာထဲမှာလိုမျိုး — macOS နဲ့ Linux မှာ `'a+'` flag နဲ့ directory တစ်ခုကို ဖွင့်ရင် error တစ်ခု ပြန်ပေးပါလိမ့်မယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — Windows နဲ့ FreeBSD မှာတော့ file descriptor တစ်ခု သို့မဟုတ် `FileHandle` တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

```js
// macOS and Linux
fs.open('<directory>', 'a+', (err, fd) => {
  // => [Error: EISDIR: illegal operation on a directory, open <directory>]
});

// Windows and FreeBSD
fs.open('<directory>', 'a+', (err, fd) => {
  // => null, <fd>
});
```

Windows မှာ `'w'` flag ကို သုံးပြီး (`fs.open()`, `fs.writeFile()` သို့မဟုတ် `fsPromises.open()` — ဘယ်ဟာကနေဖြစ်ဖြစ်) ရှိပြီးသား hidden file တစ်ခုကို ဖွင့်ရင် `EPERM` error နဲ့ မအောင်မြင်ပါဘူး။ ရှိပြီးသား hidden files တွေကို `'r+'` flag နဲ့ ရေးသားဖို့ ဖွင့်နိုင်ပါတယ်။

File ရဲ့ contents တွေကို ပြန်လည်သတ်မှတ် (reset) ဖို့ `fs.ftruncate()` သို့မဟုတ် `filehandle.truncate()` call တစ်ခုကို သုံးနိုင်ပါတယ်။

[#25741]: https://github.com/nodejs/node/issues/25741
[Common System Errors]: errors.md#common-system-errors
[FS constants]: #fs-constants
[File access constants]: #file-access-constants
[File modes]: #file-modes
[MDN-Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[MDN-Number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures#number_type
[MSDN-Rel-Path]: https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths
[MSDN-Using-Streams]: https://docs.microsoft.com/en-us/windows/desktop/FileIO/using-streams
[Naming Files, Paths, and Namespaces]: https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file
[`AHAFS`]: https://www.ibm.com/docs/en/aix/7.3.0?topic=management-aix-event-infrastructure-aix-aix-clusters-ahafs
[`Buffer.byteLength`]: buffer.md#static-method-bufferbytelengthstring-encoding
[`FSEvents`]: https://developer.apple.com/documentation/coreservices/file_system_events
[`Number.MAX_SAFE_INTEGER`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER
[`ReadDirectoryChangesW`]: https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-readdirectorychangesw
[`UV_THREADPOOL_SIZE`]: cli.md#uv_threadpool_sizesize
[`await using`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/await_using
[`event ports`]: https://illumos.org/man/port_create
[`filehandle.createReadStream()`]: #filehandlecreatereadstreamoptions
[`filehandle.createWriteStream()`]: #filehandlecreatewritestreamoptions
[`filehandle.pull()`]: #filehandlepulltransforms-options
[`filehandle.writeFile()`]: #filehandlewritefiledata-options
[`fs.access()`]: #fsaccesspath-mode-callback
[`fs.accessSync()`]: #fsaccesssyncpath-mode
[`fs.chmod()`]: #fschmodpath-mode-callback
[`fs.chown()`]: #fschownpath-uid-gid-callback
[`fs.copyFile()`]: #fscopyfilesrc-dest-mode-callback
[`fs.copyFileSync()`]: #fscopyfilesyncsrc-dest-mode
[`fs.createReadStream()`]: #fscreatereadstreampath-options
[`fs.createWriteStream()`]: #fscreatewritestreampath-options
[`fs.exists()`]: #fsexistspath-callback
[`fs.fstat()`]: #fsfstatfd-options-callback
[`fs.ftruncate()`]: #fsftruncatefd-len-callback
[`fs.futimes()`]: #fsfutimesfd-atime-mtime-callback
[`fs.lstat()`]: #fslstatpath-options-callback
[`fs.lutimes()`]: #fslutimespath-atime-mtime-callback
[`fs.mkdir()`]: #fsmkdirpath-options-callback
[`fs.mkdtemp()`]: #fsmkdtempprefix-options-callback
[`fs.open()`]: #fsopenpath-flags-mode-callback
[`fs.opendir()`]: #fsopendirpath-options-callback
[`fs.opendirSync()`]: #fsopendirsyncpath-options
[`fs.read()`]: #fsreadfd-buffer-offset-length-position-callback
[`fs.readFile()`]: #fsreadfilepath-options-callback
[`fs.readFileSync()`]: #fsreadfilesyncpath-options
[`fs.readdir()`]: #fsreaddirpath-options-callback
[`fs.readdirSync()`]: #fsreaddirsyncpath-options
[`fs.readv()`]: #fsreadvfd-buffers-position-callback
[`fs.realpath()`]: #fsrealpathpath-options-callback
[`fs.rm()`]: #fsrmpath-options-callback
[`fs.rmSync()`]: #fsrmsyncpath-options
[`fs.rmdir()`]: #fsrmdirpath-options-callback
[`fs.stat()`]: #fsstatpath-options-callback
[`fs.statfs()`]: #fsstatfspath-options-callback
[`fs.symlink()`]: #fssymlinktarget-path-type-callback
[`fs.utimes()`]: #fsutimespath-atime-mtime-callback
[`fs.watch()`]: #fswatchfilename-options-listener
[`fs.write(fd, buffer...)`]: #fswritefd-buffer-offset-length-position-callback
[`fs.write(fd, string...)`]: #fswritefd-string-position-encoding-callback
[`fs.writeFile()`]: #fswritefilefile-data-options-callback
[`fs.writev()`]: #fswritevfd-buffers-position-callback
[`fsPromises.access()`]: #fspromisesaccesspath-mode
[`fsPromises.copyFile()`]: #fspromisescopyfilesrc-dest-mode
[`fsPromises.mkdtemp()`]: #fspromisesmkdtempprefix-options
[`fsPromises.open()`]: #fspromisesopenpath-flags-mode
[`fsPromises.opendir()`]: #fspromisesopendirpath-options
[`fsPromises.rm()`]: #fspromisesrmpath-options
[`fsPromises.stat()`]: #fspromisesstatpath-options
[`fsPromises.utimes()`]: #fspromisesutimespath-atime-mtime
[`inotify(7)`]: https://man7.org/linux/man-pages/man7/inotify.7.html
[`kqueue(2)`]: https://www.freebsd.org/cgi/man.cgi?query=kqueue&sektion=2
[`minimatch`]: https://github.com/isaacs/minimatch
[`node:stream/iter`]: stream_iter.md
[`statfs.bsize`]: #statfsbsize
[`stream.getDefaultHighWaterMark()`]: stream.md#streamgetdefaulthighwatermarkobjectmode
[`stream/iter pipeTo()`]: stream_iter.md#pipetosource-transforms-writer-options
[`stream/iter pull()`]: stream_iter.md#pullsource-transforms-options
[`stream/iter pullSync()`]: stream_iter.md#pullsyncsource-transforms
[`using`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/using
[`util.promisify()`]: util.md#utilpromisifyoriginal
[bigints]: https://tc39.github.io/proposal-bigint
[caveats]: #caveats
[chcp]: https://ss64.com/nt/chcp.html
[inode]: https://en.wikipedia.org/wiki/Inode
[support of file system `flags`]: #file-system-flags
