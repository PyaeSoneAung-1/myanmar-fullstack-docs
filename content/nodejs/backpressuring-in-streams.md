---
title: "Backpressure သဘောတရား"
description: "Streams တွေမှာ backpressure ဆိုတာ ဘာလဲ — data ပို့ဆောင်မှုမှာ buffer နောက်ကွယ်မှာ data တွေ ပိတ်ဆို့စုပုံလာတဲ့ ပြဿနာ၊ highWaterMark, .write() return value, 'drain' event နဲ့ backpressure ကိုင်တွယ်ပုံ"
order: 34
source: "https://nodejs.org/en/learn/modules/backpressuring-in-streams"
status: translated
updated: 2026-09-02
---

## Backpressure ဆိုတာ ဘာလဲ

Data တွေ ကိုင်တွယ်ရာမှာ ဖြစ်တတ်တဲ့ ယေဘုယျပြဿနာတစ်ခု ရှိပါတယ် — အဲဒါကို [`backpressure`](https://en.wikipedia.org/wiki/Backpressure_routing) လို့ ခေါ်ပြီး — data transfer လုပ်နေစဉ် buffer တစ်ခုရဲ့ နောက်ကွယ်မှာ data တွေ စုပုံလာတာကို ဆိုလိုပါတယ်။ Transfer ရဲ့ လက်ခံဘက် (receiving end) မှာ ရှုပ်ထွေးတဲ့ operations တွေ ရှိနေရင်၊ ဒါမှမဟုတ် တစ်နည်းနည်းနဲ့ နှေးနေရင် — incoming source ကနေ data တွေက ရေပိုက်ပိတ်သလို စုပုံလာတတ်ပါတယ်။

ဒီပြဿနာကို ဖြေရှင်းဖို့ — data တစ်နေရာကနေ တစ်နေရာကို ချောမွေ့စွာ စီးဆင်းစေမယ့် လွှဲပြောင်းစနစ် (delegation system) တစ်ခု ရှိရပါမယ်။ Community တစ်ခုချင်းစီက သူတို့ရဲ့ program တွေအတွက် သီးသန့်ဖြေရှင်းနည်းတွေ သုံးကြပါတယ် — Unix pipes နဲ့ TCP sockets တို့က ဒီအတွက် နမူနာကောင်းတွေဖြစ်ပြီး — ဒါကို _flow control_ လို့လည်း ခေါ်ပါတယ်။ Node.js မှာတော့ **streams** က ဒီပြဿနာအတွက် လက်ခံထားတဲ့ အဖြေပါ။

ဒီ guide ရဲ့ ရည်ရွယ်ချက်က backpressure ဆိုတာ ဘာလဲ၊ Node.js ရဲ့ source code ထဲမှာ streams တွေက ဒါကို ဘယ်လို ကိုင်တွယ်လဲဆိုတာ အသေးစိတ် ရှင်းပြဖို့ပါ — ဒုတိယပိုင်းမှာတော့ streams တွေ implement လုပ်တဲ့အခါ ကိုယ့် application code လုံခြုံပြီး optimized ဖြစ်အောင် သေချာစေမယ့် best practices တွေ မိတ်ဆက်ပေးပါမယ်။

[`backpressure`](https://en.wikipedia.org/wiki/Backpressure_routing), [`Buffer`](https://nodejs.org/api/buffer.html), [`EventEmitters`](https://nodejs.org/api/events.html) နဲ့ [`Stream`](https://nodejs.org/api/stream.html) တို့ရဲ့ အခြေခံ အဓိပ္ပာယ်တွေကို နည်းနည်းပါးပါး သိပြီးသားလို့ ယူဆထားပါတယ် — မဖတ်ရသေးရင် API documentation တွေကို အရင်ဖတ်ထားတာ ကောင်းပါတယ်။

## Data Handling ရဲ့ ပြဿနာ

Computer system တစ်ခုမှာ data တွေကို process တစ်ခုကနေ တစ်ခုဆီ pipes, sockets, signals တွေနဲ့ ပို့ဆောင်ပါတယ် — Node.js မှာတော့ အဲဒီနဲ့ ဆင်တူတဲ့ mechanism က [`Stream`](https://nodejs.org/api/stream.html) ပါ။ Streams တွေက Node.js အတွက် အများကြီး လုပ်ပေးထားပြီး — internal codebase ရဲ့ အစိတ်အပိုင်းတိုင်းလိုလိုက ဒီ module ကို သုံးပါတယ် — developer တွေလည်း သုံးဖို့ အားပေးပါတယ်:

```cjs
const readline = require('node:readline');

// process.stdin and process.stdout are both instances of Streams.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Why should you use streams? ', answer => {
  console.log(`Maybe it's ${answer}, maybe it's because they are awesome! :)`);

  rl.close();
});
```

```mjs
import readline from 'node:readline';

// process.stdin and process.stdout are both instances of Streams.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Why should you use streams? ', answer => {
  console.log(`Maybe it's ${answer}, maybe it's because they are awesome! :)`);

  rl.close();
});
```

Streams တွေကနေတစ်ဆင့် အကောင်အထည်ဖော်ထားတဲ့ backpressure mechanism က ဘာကြောင့် optimize လုပ်မှုကောင်းတစ်ခု ဖြစ်လဲဆိုတာ — Node.js ရဲ့ [`Stream`](https://nodejs.org/api/stream.html) implementation ကို system tools တွေနဲ့ ယှဉ်ပြီး သရုပ်ပြနိုင်ပါတယ်။

အခြေအနေတစ်ခုမှာ — file အကြီးကြီး (ခန့်မှန်းခြေ ~9 GB) တစ်ခုကို ယူပြီး — လူသိများတဲ့ [`zip(1)`](https://linux.die.net/man/1/zip) tool နဲ့ compress လုပ်ပါမယ်:

```
zip The.Matrix.1080p.mkv
```

ဒါက မိနစ်အနည်းငယ် ကြာမယ့်အချိန်မှာ — နောက် shell တစ်ခုမှာ တခြား compression tool [`gzip(1)`](https://linux.die.net/man/1/gzip) ကို wrap လုပ်ထားတဲ့ Node.js ရဲ့ [`zlib`](https://nodejs.org/api/zlib.html) module ကို သုံးတဲ့ script တစ်ခု run ကြည့်ပါမယ်:

```cjs
const fs = require('node:fs');
const gzip = require('node:zlib').createGzip();

const inp = fs.createReadStream('The.Matrix.1080p.mkv');
const out = fs.createWriteStream('The.Matrix.1080p.mkv.gz');

inp.pipe(gzip).pipe(out);
```

```mjs
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

const gzip = createGzip();

const inp = createReadStream('The.Matrix.1080p.mkv');
const out = createWriteStream('The.Matrix.1080p.mkv.gz');

inp.pipe(gzip).pipe(out);
```

ရလဒ်ကို စမ်းကြည့်ဖို့ — compressed file တစ်ခုချင်းစီကို ဖွင့်ကြည့်ပါ — [`zip(1)`](https://linux.die.net/man/1/zip) နဲ့ ချုံးထားတဲ့ file က file ပျက်စီးနေတယ်လို့ ပြောပါလိမ့်မယ် — [`Stream`](https://nodejs.org/api/stream.html) နဲ့ ချုံးပြီးသား file ကတော့ error မရှိဘဲ ပြန်ဖြည်လို့ရပါတယ်။

> ဒီဥပမာမှာ data source တစ်ဖက်ကနေ တစ်ဖက်ကို ပို့ဖို့ `.pipe()` ကို သုံးထားပါတယ် — ဒါပေမယ့် proper error handlers တွေ မပါတာ သတိပြုပါ — data chunk တစ်ခုခု မှန်မှန် လက်ခံရရှိဖို့ ပျက်ကွက်ရင် `Readable` source ဒါမှမဟုတ် `gzip` stream က destroy ဖြစ်မှာ မဟုတ်ပါဘူး။ [`pump`](https://github.com/mafintosh/pump) က stream တစ်ခုခု fail/close ဖြစ်ရင် pipeline ထဲက stream တွေ အားလုံးကို ကောင်းကောင်း destroy လုပ်ပေးမယ့် utility tool ဖြစ်ပြီး — ဒီလိုနေရာမျိုးမှာ မဖြစ်မနေ လိုအပ်ပါတယ်!

[`pump`](https://github.com/mafintosh/pump) က Node.js 8.x ဒါမှမဟုတ် အစောပိုင်း version တွေအတွက်ပဲ လိုပါတယ် — Node.js 10.x နဲ့ နောက်ပိုင်းဆိုရင် [`pipeline`](https://nodejs.org/api/stream.html#stream_stream_pipeline_streams_callback) က [`pump`](https://github.com/mafintosh/pump) နေရာကို အစားထိုးလိုက်လို့ပါ — streams တွေကြား pipe လုပ်ပြီး errors တွေ ပို့ပေးကာ — သန့်ရှင်းရေးတွေ လုပ်ပေးပြီး — pipeline ပြီးဆုံးချိန်မှာ callback တစ်ခု ပေးတဲ့ module method ပါ။

pipeline သုံးတဲ့ ဥပမာ:

```cjs
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const zlib = require('node:zlib');

// Use the pipeline API to easily pipe a series of streams
// together and get notified when the pipeline is fully done.
// A pipeline to gzip a potentially huge video file efficiently:

pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  err => {
    if (err) {
      console.error('Pipeline failed', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```

```mjs
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import zlib from 'node:zlib';

// Use the pipeline API to easily pipe a series of streams
// together and get notified when the pipeline is fully done.
// A pipeline to gzip a potentially huge video file efficiently:

pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  err => {
    if (err) {
      console.error('Pipeline failed', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```

[`stream/promises`](https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-options) module ကိုသုံးရင် pipeline ကို `async`/`await` နဲ့လည်း သုံးလို့ရပါတယ်:

```cjs
const fs = require('node:fs');
const { pipeline } = require('node:stream/promises');
const zlib = require('node:zlib');

async function run() {
  try {
    await pipeline(
      fs.createReadStream('The.Matrix.1080p.mkv'),
      zlib.createGzip(),
      fs.createWriteStream('The.Matrix.1080p.mkv.gz')
    );
    console.log('Pipeline succeeded');
  } catch (err) {
    console.error('Pipeline failed', err);
  }
}
```

```mjs
import fs from 'node:fs';
import { pipeline } from 'node:stream/promises';
import zlib from 'node:zlib';

async function run() {
  try {
    await pipeline(
      fs.createReadStream('The.Matrix.1080p.mkv'),
      zlib.createGzip(),
      fs.createWriteStream('The.Matrix.1080p.mkv.gz')
    );
    console.log('Pipeline succeeded');
  } catch (err) {
    console.error('Pipeline failed', err);
  }
}
```

## Data တွေ မြန်လွန်း များလွန်းခြင်း

တစ်ခါတစ်ရံမှာ [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) stream က data တွေကို [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) ဆီ — consumer က ကိုင်တွယ်နိုင်တာထက် အများကြီး မြန်မြန် ပို့နေတတ်ပါတယ်!

ဒီလိုဖြစ်တဲ့အခါ — consumer က data chunks တွေ အားလုံးကို နောက်မှ စားသုံးဖို့ queue တန်းစီထားပါတော့တယ် — write queue က ပိုပိုရှည်လာပြီး — process တစ်ခုလုံး ပြီးတဲ့အထိ data တွေ ပိုပိုများများ memory ထဲ သိမ်းထားရပါတယ်။

Disk ပေါ်မှာ ရေးတာက disk ကနေ ဖတ်တာထက် အများကြီး နှေးပါတယ် — ဒါကြောင့် file တစ်ခုကို compress လုပ်ပြီး hard disk ပေါ် ရေးတဲ့အခါ — write disk က read ရဲ့ မြန်နှုန်းကို မမီနိုင်လို့ backpressure ဖြစ်ပေါ်လာပါတယ်:

```js
// Secretly the stream is saying: "whoa, whoa! hang on, this is way too much!"
// Data will begin to build up on the read side of the data buffer as
// `write` tries to keep up with the incoming data flow.
inp.pipe(gzip).pipe(outputFile);
```

ဒါကြောင့် backpressure mechanism က အရေးကြီးပါတယ် — backpressure system မရှိရင် process က system ရဲ့ memory တွေကို ကုန်အောင် သုံးပြီး — တခြား processes တွေကို နှေးစေကာ — ပြီးဆုံးတဲ့အထိ system ရဲ့ အစိတ်အပိုင်း အများကြီးကို လွှမ်းမိုးထားပါလိမ့်မယ်။

ရလဒ်တွေက:

- လက်ရှိ run နေတဲ့ process တွေ အားလုံး နှေးကွေးခြင်း
- Garbage collector အလုပ်အလွန်အကျွံ လုပ်ရခြင်း
- Memory ကုန်ခမ်းခြင်း

အောက်က ဥပမာတွေမှာ — [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) function ရဲ့ [return value](https://github.com/nodejs/node/blob/55c42bc6e5602e5a47fb774009cfe9289cb88e71/lib/_stream_writable.js#L239) ကို ဖယ်ပြီး `true` အဖြစ် ပြောင်းထားပါမယ် — ဒါက Node.js core ထဲက backpressure support ကို ထိရောက်စွာ disable လုပ်လိုက်တာပါ။ 'modified' binary လို့ ပြောတဲ့အခါ — `return ret;` line အစား `return true;` ထည့်ထားတဲ့ `node` binary ကို run နေတာကို ဆိုလိုပါတယ်။

### Garbage Collection အပေါ် ဝန်ပိုခြင်း

အမြန်ဆုံး benchmark ကြည့်ရအောင် — အပေါ်က ဥပမာကိုပဲ သုံးပြီး binary နှစ်ခုလုံးအတွက် median time ရဖို့ trial တွေ ခဏခဏ run ကြည့်ပါတယ်:

```
   trial (#)  | `node` binary (ms) | modified `node` binary (ms)
=================================================================
      1       |      56924         |           55011
      2       |      52686         |           55869
      3       |      59479         |           54043
      4       |      54473         |           55229
      5       |      52933         |           59723
=================================================================
average time: |      55299         |           55975
```

နှစ်ခုလုံးက တစ်မိနစ်လောက် ကြာလို့ သိပ်မကွာဘူးလို့ ထင်ရပေမယ့် — ပိုနီးကပ်စွာ ကြည့်ဖို့ V8 garbage collector မှာ ဘာတွေ ဖြစ်နေလဲ Linux tool [`dtrace`](https://dtrace.org/about/) နဲ့ အကဲဖြတ်ကြည့်ပါတယ်။

GC (garbage collector) ရဲ့ တိုင်းတာထားတဲ့ အချိန်က garbage collector က တစ်ကြိမ် sweep လုပ်တဲ့ full cycle တစ်ခုရဲ့ ကြားကာလတွေကို ပြပါတယ်:

```
approx. time (ms) | GC (ms) | modified GC (ms)
=================================================
          0       |    0    |      0
          1       |    0    |      0
         40       |    0    |      2
        170       |    3    |      1
        300       |    3    |      1

         *             *           *
         *             *           *
         *             *           *

      39000       |    6    |     26
      42000       |    6    |     21
      47000       |    5    |     32
      50000       |    8    |     28
      54000       |    6    |     35
```

Process နှစ်ခုလုံး အတူတူ စတင်ပြီး GC ကို နှုန်းတူနီးပါး အလုပ်လုပ်စေပေမယ့် — backpressure system ကောင်းကောင်း အလုပ်လုပ်နေတဲ့နေရာမှာ စက္ကန့်အနည်းငယ်ကြာတဲ့အခါ — GC load က 4-8 milliseconds ကြားကိုက်ညီတဲ့ ကြားကာလတွေနဲ့ data transfer ပြီးတဲ့အထိ ပြန့်ကျက်သွားတာ ထင်ရှားပါတယ်။

ဒါပေမယ့် backpressure system မရှိတဲ့အခါ — V8 garbage collection က ဆွဲငင်လာပါတယ် — သာမန် binary က GC ကို တစ်မိနစ်အတွင်း ခန့်မှန်းခြေ **75** ကြိမ် ခေါ်ပြီး — modified binary ကတော့ **36** ကြိမ်ပဲ ခေါ်ပါတယ်။

ဒါက memory သုံးစွဲမှု တိုးလာတာကနေ တဖြည်းဖြည်း စုလာတဲ့ အကြွေးမျိုးပါ — backpressure system မရှိဘဲ data transfer လုပ်တဲ့အခါ — chunk တစ်ခုချင်းစီ ပို့တိုင်း memory ပိုသုံးနေလို့ပါ။ Memory များလေလေ — GC က sweep တစ်ကြိမ်မှာ ပိုပြီး ဂရုစိုက်ရလေလေ — sweep ကြီးလေ — ဘာတွေ free လုပ်လို့ရလဲ ဆုံးဖြတ်ဖို့ ပိုလိုအပ်ပြီး — memory space ကြီးကြီးထဲမှာ detached pointers ရှာတာက computing power ပိုကုန်ပါတယ်။

### Memory ကုန်ခမ်းခြင်း

Binary တစ်ခုချင်းစီရဲ့ memory သုံးစွဲမှုကို သိဖို့ — process တစ်ခုချင်းစီကို `/usr/bin/time -lp sudo ./node ./backpressure-example/zlib.js` နဲ့ တိုင်းကြည့်ပါတယ်။

သာမန် binary ရဲ့ output:

```
Respecting the return value of .write()
=============================================
real        58.88
user        56.79
sys          8.79
  87810048  maximum resident set size
         0  average shared memory size
         0  average unshared data size
         0  average unshared stack size
     19427  page reclaims
      3134  page faults
         0  swaps
         5  block input operations
       194  block output operations
         0  messages sent
         0  messages received
         1  signals received
        12  voluntary context switches
    666037  involuntary context switches
```

Virtual memory ရဲ့ အများဆုံး byte size က ခန့်မှန်းခြေ 87.81 mb ပါ။

အခု [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) function ရဲ့ [return value](https://github.com/nodejs/node/blob/55c42bc6e5602e5a47fb774009cfe9289cb88e71/lib/_stream_writable.js#L239) ကို ပြောင်းလိုက်ရင်:

```
Without respecting the return value of .write():
==================================================
real        54.48
user        53.15
sys          7.43
1524965376  maximum resident set size
         0  average shared memory size
         0  average unshared data size
         0  average unshared stack size
    373617  page reclaims
      3139  page faults
         0  swaps
        18  block input operations
       199  block output operations
         0  messages sent
         0  messages received
         1  signals received
        25  voluntary context switches
    629566  involuntary context switches
```

Virtual memory ရဲ့ အများဆုံး byte size က ခန့်မှန်းခြေ 1.52 gb ပါ။

Backpressure ကို လွှဲပြောင်းပေးဖို့ streams တွေ မရှိဘဲနဲ့ — memory space က 10 ဆလောက် ပိုခွဲဝေခံရပါတယ် — process အတူတူပဲ ဖြစ်နေတာတောင် ဒီလောက် ကွာခြားချက် ကြီးပါတယ်!

ဒီစမ်းသပ်ချက်က Node.js ရဲ့ backpressure mechanism က computing system အတွက် ဘယ်လောက် optimized ဖြစ်ပြီး cost-effective ဖြစ်လဲ ပြပါတယ်။ အခု သူ ဘယ်လို အလုပ်လုပ်လဲ ခွဲကြည့်ရအောင်!

## Backpressure က ဒီပြဿနာတွေကို ဘယ်လို ဖြေရှင်းလဲ

Process တစ်ခုကနေ တစ်ခုကို data ပို့ဖို့ function အမျိုးမျိုး ရှိပါတယ် — Node.js မှာတော့ internal built-in function [`.pipe()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_pipe_destination_options) ရှိပြီး — [တခြား packages](https://github.com/sindresorhus/awesome-nodejs#streams) တွေလည်း ရှိပါတယ်။ အခြေခံအကျဆုံး အဆင့်မှာတော့ အစိတ်အပိုင်း နှစ်ခု ရှိပါတယ် — data ရဲ့ _source_ နဲ့ _consumer_ ပါ။

Source ကနေ [`.pipe()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_pipe_destination_options) ကို ခေါ်လိုက်တာနဲ့ — consumer ဆီ ပို့ဖို့ data ရှိနေကြောင်း အချက်ပြပါတယ် — pipe function က event triggers တွေအတွက် သင့်လျော်တဲ့ backpressure closures တွေကို setup လုပ်ပေးပါတယ်။ Node.js မှာ source က [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) stream ဖြစ်ပြီး consumer က [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) stream ပါ (နှစ်ခုလုံးကို [`Duplex`](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams) ဒါမှမဟုတ် [`Transform`](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams) stream နဲ့ အစားထိုးနိုင်ပေမယ့် — အဲဒါက ဒီ guide ရဲ့ scope ထဲ မပါပါဘူး)။

Backpressure စတင် trigger ဖြစ်တဲ့ အချိန်ကို [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) ရဲ့ [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) function return value နဲ့ အတိအကျ ဆုံးဖြတ်လို့ရပါတယ် — ဒီ return value က အခြေအနေတချို့ပေါ်မှာ မူတည်ပါတယ်။

Data buffer က [`highWaterMark`](https://nodejs.org/api/stream.html#stream_buffering) ထက် ကျော်သွားတဲ့အခါ ဒါမှမဟုတ် write queue မအားတဲ့အခါ — [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) က `false` ပြန်ပါတယ်။

`false` ပြန်လာတဲ့အခါ backpressure system က ဝင်ပါတယ် — incoming [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) stream ကို data မပို့အောင် ခဏရပ်ထားပြီး — consumer ပြန်အဆင်သင့် ဖြစ်တဲ့အထိ စောင့်ပါတယ်။ Data buffer လွတ်သွားတာနဲ့ [`'drain'`](https://nodejs.org/api/stream.html#stream_event_drain) event ထွက်ပြီး — incoming data flow ကို ပြန်စပါတယ်။

Queue ပြီးသွားတာနဲ့ backpressure က data တွေ ထပ်ပို့ခွင့် ပြုပါတယ် — memory ထဲက နေရာလပ်တွေ ပြန်လွတ်ပြီး နောက် data batch အတွက် အဆင်သင့် ဖြစ်ပါတယ်။

ဒါက [`.pipe()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_pipe_destination_options) function တစ်ခုအတွက် ဘယ်အချိန်မဆို fixed amount ရှိတဲ့ memory ကိုပဲ သုံးစေပါတယ် — memory leakage မရှိ၊ infinite buffering မရှိ — garbage collector ကလည်း memory ထဲက နေရာတစ်ခုကိုပဲ ကိုင်တွယ်ရတော့တာပါ!

ဒါဆို backpressure က ဒီလောက် အရေးကြီးတာ ဘာလို့ (ဖြစ်နိုင်ခြေ ရှိတဲ့အတိုင်း) မကြားဖူးတာလဲ — အဖြေက ရိုးပါတယ် — Node.js က ဒါတွေ အားလုံးကို ကိုယ်စား အလိုအလျောက် လုပ်ပေးနေလို့ပါ!

ဒါက တော်တော်ကောင်းပါတယ် — ဒါပေမယ့် custom streams တွေ ကိုယ်တိုင် implement လုပ်ဖို့ နားလည်ဖို့ကြိုးစားနေတုန်းမှာတော့ သိပ်မကောင်းပါဘူး။

> Machine အများစုမှာ buffer တစ်ခု ဘယ်အချိန်မှာ ပြည့်တယ်လို့ သတ်မှတ်မယ့် byte size တစ်ခု ရှိပါတယ် (machine အလိုက် ကွဲပြားပါတယ်) — Node.js က ကိုယ်ပိုင် [`highWaterMark`](https://nodejs.org/api/stream.html#stream_buffering) သတ်မှတ်ခွင့် ပေးထားပေမယ့် — ပုံမှန် default က 16kb (16384, objectMode streams အတွက်တော့ 16) ပါ။ ပိုမြှင့်ချင်ရင် မြှင့်လို့ရပါတယ် — ဒါပေမယ့် သတိထားပြီး မှ လုပ်ပါ!

## `.pipe()` ရဲ့ Lifecycle

Backpressure ကို ပိုနားလည်ဖို့ — [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) stream တစ်ခုကို [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) stream ထဲ [pipe](https://nodejs.org/docs/latest/api/stream.html#stream_readable_pipe_destination_options) လုပ်တဲ့ lifecycle ရဲ့ flow-chart ပါ:

```
                                                     +===================+
                         x-->  Piping functions   +-->   src.pipe(dest)  |
                         x     are set up during     |===================|
                         x     the .pipe method.     |  Event callbacks  |
  +===============+      x                           |-------------------|
  |   Your Data   |      x     They exist outside    | .on('close', cb)  |
  +=======+=======+      x     the data flow, but    | .on('data', cb)   |
          |              x     importantly attach    | .on('drain', cb)  |
          |              x     events, and their     | .on('unpipe', cb) |
+---------v---------+    x     respective callbacks. | .on('error', cb)  |
|  Readable Stream  +----+                           | .on('finish', cb) |
+-^-------^-------^-+    |                           | .on('end', cb)    |
  ^       |       ^      |                           +-------------------+
  |       |       |      |
  |       ^       |      |
  ^       ^       ^      |    +-------------------+         +=================+
  ^       |       ^      +---->  Writable Stream  +--------->  .write(chunk)  |
  |       |       |           +-------------------+         +=======+=========+
  |       |       |                                                 |
  |       ^       |                              +------------------v---------+
  ^       |       +-> if (!chunk)                |    Is this chunk too big?  |
  ^       |       |     emit .end();             |    Is the queue busy?      |
  |       |       +-> else                       +-------+----------------+---+
  |       ^       |     emit .write();                   |                |
  |       ^       ^                                   +--v---+        +---v---+
  |       |       ^-----------------------------------<  No  |        |  Yes  |
  ^       |                                           +------+        +---v---+
  ^       |                                                               |
  |       ^               emit .pause();          +=================+     |
  |       ^---------------^-----------------------+  return false;  <-----+---+
  |                                               +=================+         |
  |                                                                           |
  ^            when queue is empty     +============+                         |
  ^------------^-----------------------<  Buffering |                         |
               |                       |============|                         |
               +> emit .drain();       |  ^Buffer^  |                         |
               +> emit .resume();      +------------+                         |
                                       |  ^Buffer^  |                         |
                                       +------------+   add chunk to queue    |
                                       |            <---^---------------------<
                                       +============+
```

> Streams တစ်ချို့ကို ဆက်ပြီး data တွေ manipulate လုပ်ဖို့ pipeline တစ်ခု စနစ်ထည့်နေတယ်ဆိုရင် — အများအားဖြင့် [`Transform`](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams) stream ကို implement လုပ်ဖို့ ဖြစ်နေပါလိမ့်မယ်။

ဒီကိစ္စမှာ — ကိုယ့် [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) stream ရဲ့ output က [`Transform`](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams) ထဲ ဝင်ပြီး — [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) ထဲ pipe လုပ်သွားပါတယ်:

```js
Readable.pipe(Transformable).pipe(Writable);
```

Backpressure က အလိုအလျောက် သက်ရောက်ပေမယ့် — [`Transform`](https://nodejs.org/api/stream.html#stream_duplex_and_transform_streams) stream ရဲ့ incoming ရော outgoing ရော `highWaterMark` နှစ်ခုလုံးကို ပြုပြင်နိုင်ပြီး — backpressure system ကို သက်ရောက်မှု ရှိတာ သတိပြုပါ။

## Backpressure Guidelines

[Node.js v0.10](https://nodejs.org/docs/v0.10.0/) ကစပြီး — [`Stream`](https://nodejs.org/api/stream.html) class က ဒီ function တွေရဲ့ underscore version ([`._read()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_read_size_1) နဲ့ [`._write()`](https://nodejs.org/docs/latest/api/stream.html#stream_writable_write_chunk_encoding_callback_1)) တွေကို override လုပ်ပြီး [`.read()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_read_size) ဒါမှမဟုတ် [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) တွေရဲ့ behavior ကို ပြုပြင်ခွင့် ပေးထားပါတယ်။

[Readable streams implement](https://nodejs.org/docs/latest/api/stream.html#stream_implementing_a_readable_stream) လုပ်ဖို့နဲ့ [Writable streams implement](https://nodejs.org/docs/latest/api/stream.html#stream_implementing_a_writable_stream) လုပ်ဖို့ guidelines တွေ မှတ်တမ်းတင်ထားပါတယ် — အဲဒါတွေ ဖတ်ပြီးပြီလို့ ယူဆပြီး — နောက်အပိုင်းမှာ ပိုနက်နက်ရှိုင်းရှိုင်း ဆက်သွားပါမယ်။

## Custom Streams ရေးတဲ့အခါ လိုက်နာရမယ့် စည်းကမ်းများ

Streams တွေရဲ့ ရွှေစည်းကမ်းကတော့ **backpressure ကို အမြဲ လေးစားလိုက်နာဖို့** ပါ။ Best practice ဆိုတာ တစ်ခုနဲ့တစ်ခု မဆန့်ကျင်တဲ့ practice ပါ — internal backpressure support နဲ့ ဆန့်ကျင်တဲ့ behavior တွေကို ရှောင်ရှားဖို့ သတိထားနေသမျှ — ကောင်းမွန်တဲ့ practice ကို လိုက်နာနေတာပါပဲ။

ယေဘုယျအားဖြင့်:

1. မတောင်းခံရဘဲ `.push()` ဘယ်တော့မှ မလုပ်ပါနဲ့။
2. `.write()` က `false` ပြန်ပြီးတာနဲ့ ဆက်မခေါ်ဘဲ — `'drain'` ကို စောင့်ပါ။
3. Streams တွေက Node.js version အလိုက်၊ library အလိုက် ပြောင်းလဲတတ်ပါတယ် — သတိထားပြီး test လုပ်ပါ။

> အချက် ၃ နဲ့ ပတ်သက်လို့ — browser streams တွေ တည်ဆောက်ဖို့ မယုံနိုင်လောက်အောင် အသုံးဝင်တဲ့ package ကတော့ [`readable-stream`](https://github.com/nodejs/readable-stream) ပါ — Rodd Vagg က ဒီ library ရဲ့ အသုံးဝင်ပုံကို [ဖော်ပြထားတဲ့ blog post](https://r.va.gg/2014/06/why-i-dont-use-nodes-core-stream-module.html) ကောင်းတစ်ပုဒ် ရေးထားပါတယ် — အတိုချုပ်ပြောရရင် — [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) streams တွေအတွက် automated graceful degradation တစ်မျိုး ပေးပြီး — browser နဲ့ Node.js version အဟောင်းတွေကိုပါ ထောက်ပံ့ပေးပါတယ်။

## Readable Streams အတွက် သီးသန့် စည်းကမ်းများ

ဒီအထိ [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) က backpressure ကို ဘယ်လို သက်ရောက်လဲ ကြည့်ပြီး [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) stream ပေါ်မှာ အဓိက အာရုံစိုက်ခဲ့ပါတယ် — Node.js ရဲ့ သဘောသဘာဝအရ data က [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) ကနေ [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) ဆီ အောက်ဘက်ကို စီးဆင်းပါတယ် — ဒါပေမယ့် data/အရာဝတ္ထု/စွမ်းအင် ပို့ဆောင်မှုတိုင်းမှာ source က destination လောက်ပဲ အရေးကြီးသလို — backpressure ကို ဘယ်လို ကိုင်တွယ်လဲဆိုတာမှာလည်း [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) stream က အရေးပါပါတယ်။

Process နှစ်ခုလုံးက တစ်ခုနဲ့တစ်ခု ထိရောက်စွာ ဆက်သွယ်ဖို့ မှီခိုနေပါတယ် — [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) က [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) stream က data မပို့ဖို့ တောင်းဆိုတာကို လျစ်လျူရှုရင် — [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) ရဲ့ return value မှားနေသလောက်ပဲ ပြဿနာ ဖြစ်နိုင်ပါတယ်။

ဒါကြောင့် [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) return value ကို လေးစားသလို — [`._read()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_read_size_1) method ထဲက [`.push()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_push_chunk_encoding) ရဲ့ return value ကိုလည်း လေးစားရပါမယ် — [`.push()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_push_chunk_encoding) က `false` ပြန်ရင် stream က source ကနေ ဖတ်တာ ရပ်ပြီး — မဟုတ်ရင် ရပ်နားစရာမရှိ ဆက်လုပ်ပါတယ်။

ဒီမှာ [`.push()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_push_chunk_encoding) သုံးတဲ့ မကောင်းတဲ့ ကျင့်သုံးမှု ဥပမာပါ:

```js
// This is problematic as it completely ignores the return value from the push
// which may be a signal for backpressure from the destination stream!
class MyReadable extends Readable {
  _read(size) {
    let chunk;
    while (null !== (chunk = getNextChunk())) {
      this.push(chunk);
    }
  }
}
```

ဒီမှာတော့ `Readable` stream က `this.push()` ရဲ့ return value ကို စစ်ပြီး backpressure ကို လေးစားတဲ့ ကောင်းမွန်တဲ့ ကျင့်သုံးမှု ဥပမာပါ:

```js
class MyReadable extends Readable {
  _read(size) {
    let chunk;
    let canPushMore = true;
    while (canPushMore && null !== (chunk = getNextChunk())) {
      canPushMore = this.push(chunk);
    }
  }
}
```

နောက်ထပ်အနေနဲ့ — custom stream အပြင်ဘက်ကနေလည်း backpressure ကို လျစ်လျူရှုတဲ့ အန္တရာယ်တွေ ရှိပါတယ် — ဒီကောင်းမွန်မှုရဲ့ ဆန့်ကျင်ဘက် ဥပမာမှာ application code က data ရနိုင်တိုင်း (ဒါကို [`'data'` event](https://nodejs.org/api/stream.html#stream_event_data) နဲ့ အချက်ပြပါတယ်) — destination stream အဆင်သင့် ရှိမရှိ မဆိုင်ဘဲ — အတင်းတွန်းပို့နေပါတယ်:

```js
// This ignores the backpressure mechanisms Node.js has set in place,
// and unconditionally pushes through data, regardless if the
// destination stream is ready for it or not.
readable.on('data', data => writable.write(data));
```

ဒီမှာ [`.push()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_push_chunk_encoding) ကို Readable stream တစ်ခုနဲ့ သုံးတဲ့ ဥပမာပါ:

```cjs
const { Readable } = require('node:stream');

// Create a custom Readable stream
const myReadableStream = new Readable({
  objectMode: true,
  read(size) {
    // Push some data onto the stream
    this.push({ message: 'Hello, world!' });
    this.push(null); // Mark the end of the stream
  },
});

// Consume the stream
myReadableStream.on('data', chunk => {
  console.log(chunk);
});

// Output:
// { message: 'Hello, world!' }
```

```mjs
import { Readable } from 'node:stream';

// Create a custom Readable stream
const myReadableStream = new Readable({
  objectMode: true,
  read(size) {
    // Push some data onto the stream
    this.push({ message: 'Hello, world!' });
    this.push(null); // Mark the end of the stream
  },
});

// Consume the stream
myReadableStream.on('data', chunk => {
  console.log(chunk);
});

// Output:
// { message: 'Hello, world!' }
```

ဒီဥပမာမှာ object တစ်ခုတည်းကို [`.push()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_push_chunk_encoding) နဲ့ stream ပေါ် တင်ပေးတဲ့ custom Readable stream တစ်ခု ဖန်တီးထားပါတယ် — stream က data စားသုံးဖို့ အဆင်သင့်ဖြစ်တဲ့အခါ [`._read()`](https://nodejs.org/docs/latest/api/stream.html#stream_readable_read_size_1) method ကို ခေါ်ပြီး — data ကို တစ်ခါတည်း push ကာ `null` push ပြီး stream ရဲ့ အဆုံးကို မှတ်သားပါတယ်။ ပြီးတော့ `'data'` event ကို listen လုပ်ပြီး chunk တစ်ခုချင်းစီကို log ပါတယ် — chunk တစ်ခုတည်းသာ ရှိတာမို့ log message တစ်ကြောင်းပဲ မြင်ရပါတယ်။

## Writable Streams အတွက် သီးသန့် စည်းကမ်းများ

[`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) က အခြေအနေတချို့ပေါ်မူတည်ပြီး `true` ဒါမှမဟုတ် `false` ပြန်တယ်ဆိုတာ သတိရပါ — ကံကောင်းတာက — ကိုယ်ပိုင် [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) stream တည်ဆောက်တဲ့အခါ — [`stream state machine`](https://en.wikipedia.org/wiki/Finite-state_machine) က callbacks တွေကို ကိုင်တွယ်ပြီး backpressure ဘယ်အချိန် ကိုင်တွယ်ရမယ်၊ data flow ကို ဘယ်လို optimize လုပ်ရမယ် ဆုံးဖြတ်ပေးပါတယ်။

ဒါပေမယ့် [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) ကို တိုက်ရိုက် သုံးချင်တဲ့အခါ — [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) ရဲ့ return value ကို လေးစားပြီး — ဒီအခြေအနေတွေကို သေချာ အာရုံစိုက်ရပါမယ်:

- Write queue မအားရင် [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) က `false` ပြန်ပါတယ်။
- Data chunk က ကြီးလွန်းရင် [`.write()`](https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback) က `false` ပြန်ပါတယ် (ကန့်သတ်ချက်ကို [`highWaterMark`](https://nodejs.org/api/stream.html#stream_buffering) variable နဲ့ ပြပါတယ်)။

```mjs
// This writable is invalid because of the async nature of JavaScript callbacks.
// Without a return statement for each callback prior to the last,
// there is a great chance multiple callbacks will be called.
class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback();
    } else if (chunk.toString().indexOf('b') >= 0) {
      callback();
    }
    callback();
  }
}

// The proper way to write this would be:
if (chunk.contains('a')) {
  return callback();
}

if (chunk.contains('b')) {
  return callback();
}
callback();
```

[`._writev()`](https://nodejs.org/api/stream.html#stream_writable_writev_chunks_callback) ကို implement လုပ်တဲ့အခါမှာလည်း သတိထားရမယ့် အချက်တွေ ရှိပါတယ် — ဒီ function က [`.cork()`](https://nodejs.org/api/stream.html#writablecork) နဲ့ တွဲသုံးပေမယ့် — မကြာခဏ မှားတတ်တဲ့ ပုံစံတစ်ခု ရှိပါတယ်:

```js
// Using .uncork() twice here makes two calls on the C++ layer, rendering the
// cork/uncork technique useless.
ws.cork();
ws.write('hello ');
ws.write('world ');
ws.uncork();

ws.cork();
ws.write('from ');
ws.write('Matteo');
ws.uncork();

// The correct way to write this is to utilize process.nextTick(), which fires
// on the next event loop.
ws.cork();
ws.write('hello ');
ws.write('world ');
process.nextTick(doUncork, ws);

ws.cork();
ws.write('from ');
ws.write('Matteo');
process.nextTick(doUncork, ws);

// As a global function.
function doUncork(stream) {
  stream.uncork();
}
```

[`.cork()`](https://nodejs.org/api/stream.html#writablecork) ကို ကြိမ်နှုန်း ဘယ်လောက်ပဲ ခေါ်ခေါ် ရပါတယ် — flow ပြန်စေဖို့ [`.uncork()`](https://nodejs.org/api/stream.html#stream_writable_uncork) ကို အရေအတွက် တူတူ ခေါ်ဖို့ပဲ သတိထားရပါတယ်။

## နိဂုံး

Streams တွေက Node.js မှာ မကြာခဏ သုံးရတဲ့ module တစ်ခုပါ — internal structure အတွက် အရေးကြီးသလို — developer တွေ Node.js modules ecosystem တစ်လျှောက် ချဲ့ထွင်ပြီး ချိတ်ဆက်ဖို့အတွက်လည်း အရေးပါပါတယ်။

အခုဆိုရင် backpressure ကို စိတ်ထဲထားပြီး ကိုယ်ပိုင် [`Writable`](https://nodejs.org/api/stream.html#stream_writable_streams) နဲ့ [`Readable`](https://nodejs.org/api/stream.html#stream_readable_streams) streams တွေကို လုံခြုံစွာ troubleshoot လုပ်ပြီး ရေးတတ်သွားမယ်လို့ မျှော်လင့်ပါတယ် — ကိုယ့်အသိပညာတွေကို လုပ်ဖော်ကိုင်ဖက်တွေဆီလည်း မျှဝေပေးပါ။

Node.js နဲ့ application တည်ဆောက်တဲ့အခါ streaming capabilities တွေ ပိုတိုးတက်အောင် — [`Stream`](https://nodejs.org/api/stream.html) အကြောင်း နောက်ထပ် API functions တွေကို ဆက်လေ့လာဖို့ မမေ့ပါနဲ့။

## ဆက်ဖတ်ရန်

- [Streams အသုံးပြုခြင်း](/docs/nodejs/how-to-use-streams) — stream အမျိုးအစားများနဲ့ pipe/pipeline အသုံးပြုပုံ
- [Node.js Event Emitter](/docs/nodejs/the-nodejs-event-emitter) — events တွေကို emit/listen လုပ်ခြင်း
- [File System](/docs/nodejs/file-system) — file streams တွေနဲ့ fs module
