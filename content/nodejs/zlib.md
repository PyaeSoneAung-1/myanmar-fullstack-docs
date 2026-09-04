---
title: "Zlib"
description: "node:zlib module — gzip/deflate/brotli/zstd စတဲ့ compression (ချုံ့ခြင်း) streams — createGzip, BrotliOptions, ZstdOptions, constants, convenience methods, zip archive APIs စသည်"
order: 139
source: "https://nodejs.org/api/zlib.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:zlib` module က Gzip, Deflate/Inflate, Brotli နဲ့ Zstd တို့ကို သုံးပြီး အကောင်အထည်ဖော်ထားတဲ့ compression (ဒေတာ ချုံ့ခြင်း) လုပ်ဆောင်ချက်တွေကို ပံ့ပိုးပေးပါတယ်။

အောက်ပါအတိုင်း ဝင်ရောက်သုံးနိုင်ပါတယ်:

```mjs
import zlib from 'node:zlib';
```

```cjs
const zlib = require('node:zlib');
```

Compression နဲ့ decompression (ချုံ့ထားတဲ့ data ကို ပြန်လည် ဖြန့်ချခြင်း) တွေက Node.js ရဲ့ [Streams API][] ကို အခြေခံပြီး တည်ဆောက်ထားပါတယ်။

Stream တစ်ခု (ဥပမာ — file တစ်ခု) ကို compress သို့မဟုတ် decompress လုပ်ဖို့အတွက် source stream ကို `zlib` ရဲ့ `Transform` stream တစ်ခုကနေတစ်ဆင့် destination stream တစ်ခုဆီကို pipe (ချိတ်ဆက်ပို့ဆောင်) လုပ်နိုင်ပါတယ်:

```mjs
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream';

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
});
```

```cjs
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
});
```

ဒါမှမဟုတ် promise `pipeline` API ကို သုံးပြီး ရေးနိုင်ပါတယ်:

```mjs
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

await do_gzip('input.txt', 'input.txt.gz');
```

```cjs
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream/promises');

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

do_gzip('input.txt', 'input.txt.gz')
  .catch((err) => {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  });
```

Data တွေကို တစ်ဆင့်တည်းနဲ့ပဲ compress သို့မဟုတ် decompress လုပ်တာလည်း ဖြစ်နိုင်ပါတယ်:

```mjs
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { deflate, unzip } from 'node:zlib';

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

import { promisify } from 'node:util';
const do_unzip = promisify(unzip);

const unzippedBuffer = await do_unzip(buffer);
console.log(unzippedBuffer.toString());
```

```cjs
const { deflate, unzip } = require('node:zlib');

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

const { promisify } = require('node:util');
const do_unzip = promisify(unzip);

do_unzip(buffer)
  .then((buf) => console.log(buf.toString()))
  .catch((err) => {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  });
```

## Threadpool အသုံးပြုမှုနှင့် performance ဆိုင်ရာ ထည့်သွင်းစဉ်းစားချက်များ (Threadpool usage and performance considerations)

`zlib` APIs အားလုံးက — ထင်ရှားစွာ synchronous (တစ်ပြိုင်နက်တည်း) ဖြစ်တဲ့ APIs တွေကလွဲလို့ — Node.js ရဲ့ internal threadpool ကို သုံးပါတယ်။ ဒါက application တစ်ချို့မှာ မျှော်လင့်မထားတဲ့ အကျိုးဆက်တွေနဲ့ performance ကန့်သတ်ချက်တွေကို ဖြစ်စေနိုင်ပါတယ်။

Zlib objects အများအပြားကို တစ်ပြိုင်နက် ဖန်တီးပြီး သုံးစွဲတာက memory fragmentation (မှတ်ဉာဏ် စိတ်စိတ်အမွှာမွှာ ကွဲအက်ခြင်း) ကို သိသိသာသာ ဖြစ်စေနိုင်ပါတယ်။

```mjs
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

const payload = Buffer.from('This is some data');

// WARNING: DO NOT DO THIS!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

```cjs
const zlib = require('node:zlib');

const payload = Buffer.from('This is some data');

// WARNING: DO NOT DO THIS!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

အထက်က ဥပမာမှာ deflate instances ပေါင်း 30,000 ခုကို တစ်ပြိုင်နက် ဖန်တီးထားပါတယ်။ Operating system တစ်ချို့က memory ခွဲဝေပေးခြင်း (allocation) နဲ့ ပြန်လွှတ်ပေးခြင်း (deallocation) တွေကို ကိုင်တွယ်ပုံကြောင့် ဒါက memory fragmentation ကို သိသိသာသာ ဖြစ်စေနိုင်ပါတယ်။

အလုပ်တွေ ထပ်ခါတလဲလဲ လုပ်နေရတာကို ရှောင်ရှားဖို့ compression လုပ်ဆောင်ချက်တွေရဲ့ ရလဒ်တွေကို cache (ကက်ရှ်) လုပ်ထားဖို့ အခိုင်အမာ အကြံပြုပါတယ်။

## HTTP requests နဲ့ responses တွေကို compress လုပ်ခြင်း (Compressing HTTP requests and responses)

`node:zlib` module ကို [HTTP](https://tools.ietf.org/html/rfc7230#section-4.2) မှာ သတ်မှတ်ထားတဲ့ `gzip`, `deflate`, `br` နဲ့ `zstd` content-encoding ယန္တရားတွေအတွက် support အကောင်အထည်ဖော်ဖို့ သုံးနိုင်ပါတယ်။

HTTP request တစ်ခုထဲမှာ [`Accept-Encoding`][] header ကို client က လက်ခံနိုင်တဲ့ compression encodings တွေကို ဖော်ပြဖို့ သုံးပါတယ်။ [`Content-Encoding`][] header ကတော့ message တစ်ခုပေါ်မှာ တကယ် အသုံးပြုထားတဲ့ compression encodings တွေကို ဖော်ပြဖို့ သုံးပါတယ်။

အောက်မှာ ပေးထားတဲ့ ဥပမာတွေက အခြေခံ concept ကို ပြသဖို့အတွက် အလွန် ရိုးရှင်းအောင် ချုံ့ထားပါတယ်။ `zlib` encoding ကို သုံးတာက ကုန်ကျစရိတ် မြင့်နိုင်ပြီး ရလဒ်တွေကို cache လုပ်ထားသင့်ပါတယ်။ `zlib` သုံးစွဲမှုမှာ ပါဝင်တဲ့ speed/memory/compression အပေးအယူတွေအကြောင်း ပိုမိုသိရှိဖို့ [Memory usage tuning][] ကို ကြည့်ပါ။

```mjs
// Client request example
import fs from 'node:fs';
import zlib from 'node:zlib';
import http from 'node:http';
import process from 'node:process';
import { pipeline } from 'node:stream';

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate,zstd' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Or, just use zlib.createUnzip() to handle both of the following cases:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    case 'zstd':
      pipeline(response, zlib.createZstdDecompress(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```

```cjs
// Client request example
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate,zstd' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Or, just use zlib.createUnzip() to handle both of the following cases:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    case 'zstd':
      pipeline(response, zlib.createZstdDecompress(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```

```mjs
// server example
// Running a gzip operation on every request is quite expensive.
// It would be much more efficient to cache the compressed buffer.
import zlib from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Store both a compressed and an uncompressed version of the resource.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // Note: This is not a conformant accept-encoding parser.
  // See https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else if (/\bzstd\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'zstd' });
    pipeline(raw, zlib.createZstdCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```

```cjs
// server example
// Running a gzip operation on every request is quite expensive.
// It would be much more efficient to cache the compressed buffer.
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Store both a compressed and an uncompressed version of the resource.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // Note: This is not a conformant accept-encoding parser.
  // See https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else if (/\bzstd\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'zstd' });
    pipeline(raw, zlib.createZstdCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```

Default အနေနဲ့ `zlib` methods တွေက ဖြတ်တောက်ထားတဲ့ (truncated) data ကို decompress လုပ်တဲ့အခါ error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဒါပေမယ့် data က မပြည့်စုံဘူးဆိုတာ သိထားရင် သို့မဟုတ် compressed file တစ်ခုရဲ့ အစပိုင်းကိုသာ ကြည့်ရှုစစ်ဆေးချင်တယ်ဆိုရင် — input data ရဲ့ နောက်ဆုံး chunk ကို decompress လုပ်ဖို့ သုံးတဲ့ flushing method ကို ပြောင်းလဲခြင်းအားဖြင့် — default error handling ကို ဖိနှိပ်ထားနိုင်ပါတယ်:

```js
// This is a truncated version of the buffer from the above examples
const buffer = Buffer.from('eJzT0yMA', 'base64');

zlib.unzip(
  buffer,
  // For Brotli, the equivalent is zlib.constants.BROTLI_OPERATION_FLUSH.
  // For Zstd, the equivalent is zlib.constants.ZSTD_e_flush.
  { finishFlush: zlib.constants.Z_SYNC_FLUSH },
  (err, buffer) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
    console.log(buffer.toString());
  });
```

ဒါက တခြား error ဖြစ်စေတဲ့ အခြေအနေတွေမှာတော့ (ဥပမာ — input data ရဲ့ format က မမှန်ကန်တဲ့အခါ) အပြုအမူကို ပြောင်းလဲပေးမှာ မဟုတ်ပါဘူး။ ဒီနည်းလမ်းကို သုံးရင် input က စောစောစီးစီး အဆုံးသတ်သွားတာလား သို့မဟုတ် integrity checks (ဒေတာ ကြံ့ခိုင်မှု စစ်ဆေးချက်များ) မပါဝင်ဘူးလားဆိုတာကို ဆုံးဖြတ်နိုင်တော့မှာ မဟုတ်ပါဘူး — ဒါကြောင့် decompress လုပ်ထားတဲ့ ရလဒ်က မှန်ကန်ကြောင်း ကိုယ်တိုင် စစ်ဆေးပေးဖို့ လိုအပ်ပါတယ်။

## Memory သုံးစွဲမှု ချိန်ညှိခြင်း (Memory usage tuning)

### zlib-based streams များအတွက် (For zlib-based streams)

Node.js အသုံးပြုမှုအတွက် ပြင်ဆင်ထားတဲ့ `zlib/zconf.h` ကနေ:

Deflate အတွက် လိုအပ်တဲ့ memory ပမာဏက (bytes နဲ့):

```js
(1 << (windowBits + 2)) + (1 << (memLevel + 9));
```

ဆိုလိုတာက — `windowBits` = 15 အတွက် 128K + `memLevel` = 8 အတွက် 128K (default တန်ဖိုးတွေပါ) ဖြစ်ပြီး small objects တွေအတွက် kilobytes အနည်းငယ် ထပ်ပေါင်းပါတယ်။

ဥပမာ — default memory လိုအပ်ချက်ကို 256K ကနေ 128K အထိ လျှော့ချဖို့ options တွေကို အောက်ပါအတိုင်း သတ်မှတ်သင့်ပါတယ်:

```js
const options = { windowBits: 14, memLevel: 7 };
```

ဒါပေမယ့် ဒါက ယေဘုယျအားဖြင့် compression အရည်အသွေးကို ကျဆင်းစေပါလိမ့်မယ်။

Inflate အတွက် လိုအပ်တဲ့ memory ပမာဏက (bytes နဲ့) `1 << windowBits` ပါ။ ဆိုလိုတာက — `windowBits` = 15 (default တန်ဖိုး) အတွက် 32K ဖြစ်ပြီး small objects တွေအတွက် kilobytes အနည်းငယ် ထပ်ပေါင်းပါတယ်။

ဒါက `chunkSize` အရွယ်အစားရှိတဲ့ internal output slab buffer တစ်ခုတည်းရဲ့ အပြင် ထပ်ဆောင်း လိုအပ်တာပါ — `chunkSize` က default အနေနဲ့ 16K ဖြစ်ပါတယ်။

`zlib` compression ရဲ့ အမြန်နှုန်းကို `level` setting က အထင်ရှားဆုံး သက်ရောက်မှု ရှိပါတယ်။ Level မြင့်လေလေ compression ပိုကောင်းလေလေ ဖြစ်ပေမယ့် ပြီးဆုံးဖို့ အချိန် ပိုကြာပါတယ်။ Level နိမ့်ရင် compression နည်းပေမယ့် အများကြီး ပိုမြန်ပါတယ်။

ယေဘုယျအားဖြင့် memory ပိုသုံးတဲ့ options တွေက Node.js က `zlib` ကို ခေါ်ယူမှု နည်းသွားစေပါတယ် — အကြောင်းကတော့ `write` လုပ်ဆောင်မှုတစ်ခုစီမှာ data တွေ ပိုများများ လုပ်ဆောင်နိုင်လို့ပါ။ ဒါကြောင့် ဒါက memory သုံးစွဲမှုကို ကုန်ကျစရိတ်အဖြစ်နဲ့ speed ကို သက်ရောက်စေတဲ့ နောက်ထပ် အချက်တစ်ခု ဖြစ်ပါတယ်။

### Brotli-based streams များအတွက် (For Brotli-based streams)

Brotli-based streams တွေအတွက်လည်း zlib options တွေနဲ့ ညီမျှတဲ့ options တွေ ရှိပါတယ် — ဒါပေမယ့် ဒီ options တွေရဲ့ range တွေကတော့ zlib ရဲ့ဟာတွေနဲ့ မတူပါဘူး:

* zlib ရဲ့ `level` option က Brotli ရဲ့ `BROTLI_PARAM_QUALITY` option နဲ့ ကိုက်ညီပါတယ်။
* zlib ရဲ့ `windowBits` option က Brotli ရဲ့ `BROTLI_PARAM_LGWIN` option နဲ့ ကိုက်ညီပါတယ်။

Brotli-specific options တွေရဲ့ အသေးစိတ်တွေအတွက် [below][Brotli parameters] ကို ကြည့်ပါ။

### Zstd-based streams များအတွက် (For Zstd-based streams)

> Stability: 1 - Experimental

Zstd-based streams တွေအတွက်လည်း zlib options တွေနဲ့ ညီမျှတဲ့ options တွေ ရှိပါတယ် — ဒါပေမယ့် ဒီ options တွေရဲ့ range တွေကတော့ zlib ရဲ့ဟာတွေနဲ့ မတူပါဘူး:

* zlib ရဲ့ `level` option က Zstd ရဲ့ `ZSTD_c_compressionLevel` option နဲ့ ကိုက်ညီပါတယ်။
* zlib ရဲ့ `windowBits` option က Zstd ရဲ့ `ZSTD_c_windowLog` option နဲ့ ကိုက်ညီပါတယ်။

Zstd-specific options တွေရဲ့ အသေးစိတ်တွေအတွက် [below][Zstd parameters] ကို ကြည့်ပါ။

## Flush လုပ်ခြင်း (Flushing)

Compression stream တစ်ခုပေါ်မှာ [`.flush()`][] ကို ခေါ်လိုက်ရင် `zlib` က လောလောဆယ် ဖြစ်နိုင်သလောက် output များများကို ပြန်ပေးပါလိမ့်မယ်။ ဒါက compression အရည်အသွေး ကျဆင်းတာကို ကုန်ကျစရိတ်အဖြစ် ရနိုင်ပေမယ့် data တွေကို ဖြစ်နိုင်သမျှ မြန်မြန် ရနိုင်ဖို့ လိုအပ်တဲ့အခါ အသုံးဝင်နိုင်ပါတယ်။

အောက်ပါ ဥပမာမှာ `flush()` ကို compress လုပ်ထားတဲ့ တစ်စိတ်တစ်ပိုင်း HTTP response ကို client ဆီ ရေးသားဖို့ သုံးထားပါတယ်:

```mjs
import zlib from 'node:zlib';
import http from 'node:http';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  // For the sake of simplicity, the Accept-Encoding checks are omitted.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // The data has been passed to zlib, but the compression algorithm may
      // have decided to buffer the data for more efficient compression.
      // Calling .flush() will make the data available as soon as the client
      // is ready to receive it.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```

```cjs
const zlib = require('node:zlib');
const http = require('node:http');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  // For the sake of simplicity, the Accept-Encoding checks are omitted.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // The data has been passed to zlib, but the compression algorithm may
      // have decided to buffer the data for more efficient compression.
      // Calling .flush() will make the data available as soon as the client
      // is ready to receive it.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```

## ကိန်းသေများ (Constants)

### zlib ကိန်းသေများ (zlib constants)

`zlib.h` မှာ သတ်မှတ်ထားတဲ့ constants (ကိန်းသေများ) တွေ အားလုံးကို `require('node:zlib').constants` ပေါ်မှာလည်း သတ်မှတ်ထားပါတယ်။ ပုံမှန် လုပ်ဆောင်မှုတွေမှာတော့ ဒီ constants တွေကို သုံးဖို့ မလိုအပ်ပါဘူး။ ၎င်းတို့ ရှိနေတာကို အံ့သြစရာ မဖြစ်စေဖို့အတွက် ဒီမှာ မှတ်တမ်းတင်ထားတာပါ။ ဒီ section ကို [zlib documentation][] ကနေ နီးပါး တိုက်ရိုက် ယူထားတာပါ။

အရင်က constants တွေကို `require('node:zlib')` ကနေ တိုက်ရိုက် ရနိုင်ပါတယ် — ဥပမာ `zlib.Z_NO_FLUSH` လိုမျိုးပါ။ Constants တွေကို module ကနေ တိုက်ရိုက် ဝင်ရောက်သုံးစွဲတာက လောလောဆယ် ဖြစ်နိုင်သေးပေမယ့် deprecated (အသုံးပြုမှု ရပ်ဆိုင်းရန် သတ်မှတ်ထား) ဖြစ်ပါတယ်။

ခွင့်ပြုထားတဲ့ flush တန်ဖိုးများ။

* `zlib.constants.Z_NO_FLUSH`
* `zlib.constants.Z_PARTIAL_FLUSH`
* `zlib.constants.Z_SYNC_FLUSH`
* `zlib.constants.Z_FULL_FLUSH`
* `zlib.constants.Z_FINISH`
* `zlib.constants.Z_BLOCK`

Compression/decompression functions တွေရဲ့ return codes တွေပါ။ Negative တန်ဖိုးတွေက errors တွေ ဖြစ်ပြီး — positive တန်ဖိုးတွေကိုတော့ အထူး ဖြစ်ရိုးဖြစ်စဉ် (special but normal) events တွေအတွက် သုံးပါတယ်။

* `zlib.constants.Z_OK`
* `zlib.constants.Z_STREAM_END`
* `zlib.constants.Z_NEED_DICT`
* `zlib.constants.Z_ERRNO`
* `zlib.constants.Z_STREAM_ERROR`
* `zlib.constants.Z_DATA_ERROR`
* `zlib.constants.Z_MEM_ERROR`
* `zlib.constants.Z_BUF_ERROR`
* `zlib.constants.Z_VERSION_ERROR`

Compression levels (ချုံ့မှု အဆင့်များ)။

* `zlib.constants.Z_NO_COMPRESSION`
* `zlib.constants.Z_BEST_SPEED`
* `zlib.constants.Z_BEST_COMPRESSION`
* `zlib.constants.Z_DEFAULT_COMPRESSION`

Compression strategy (ချုံ့မှု နည်းဗျူဟာ)။

* `zlib.constants.Z_FILTERED`
* `zlib.constants.Z_HUFFMAN_ONLY`
* `zlib.constants.Z_RLE`
* `zlib.constants.Z_FIXED`
* `zlib.constants.Z_DEFAULT_STRATEGY`

### Brotli ကိန်းသေများ (Brotli constants)

Brotli-based streams တွေအတွက် options တွေနဲ့ တခြား constants တွေ အများအပြား ရနိုင်ပါတယ်:

#### Flush လုပ်ဆောင်ချက်များ (Flush operations)

အောက်ပါ တန်ဖိုးတွေက Brotli-based streams တွေအတွက် valid ဖြစ်တဲ့ flush operations တွေပါ:

* `zlib.constants.BROTLI_OPERATION_PROCESS` (လုပ်ဆောင်ချက် အားလုံးအတွက် default)
* `zlib.constants.BROTLI_OPERATION_FLUSH` (`.flush()` ခေါ်တဲ့အခါ default)
* `zlib.constants.BROTLI_OPERATION_FINISH` (နောက်ဆုံး chunk အတွက် default)
* `zlib.constants.BROTLI_OPERATION_EMIT_METADATA`
  * ဒီ သီးခြား operation က Node.js context မှာ သုံးဖို့ ခက်ခဲနိုင်ပါတယ် — streaming layer က ဘယ် data တွေ ဒီ frame ထဲ ရောက်သွားမလဲဆိုတာကို သိရှိဖို့ ခက်ခဲစေလို့ပါ။ ဒါ့အပြင် Node.js API ကနေတစ်ဆင့် ဒီ data ကို စားသုံးဖို့ နည်းလမ်း လောလောဆယ် မရှိပါဘူး။

#### Compressor ရွေးချယ်စရာများ (Compressor options)

Brotli encoders တွေပေါ်မှာ သတ်မှတ်နိုင်တဲ့ options အများအပြား ရှိပြီး — ၎င်းတို့က compression ထိရောက်မှုနဲ့ speed ကို သက်ရောက်မှု ရှိပါတယ်။ Keys တွေရော values တွေရော `zlib.constants` object ရဲ့ properties တွေအနေနဲ့ ဝင်ရောက်သုံးစွဲနိုင်ပါတယ်။

အရေးအကြီးဆုံး options တွေကတော့:

* `BROTLI_PARAM_MODE`
  * `BROTLI_MODE_GENERIC` (default)
  * `BROTLI_MODE_TEXT` — UTF-8 text တွေအတွက် ချိန်ညှိထားတာ
  * `BROTLI_MODE_FONT` — WOFF 2.0 fonts တွေအတွက် ချိန်ညှိထားတာ
* `BROTLI_PARAM_QUALITY`
  * `BROTLI_MIN_QUALITY` ကနေ `BROTLI_MAX_QUALITY` အထိ range ရှိပြီး — default က `BROTLI_DEFAULT_QUALITY` ပါ။
* `BROTLI_PARAM_SIZE_HINT`
  * မျှော်မှန်းထားတဲ့ input size ကို ကိုယ်စားပြုတဲ့ integer တန်ဖိုး ဖြစ်ပြီး — input size မသိရသေးတဲ့အခါ `0` ကို default အနေနဲ့ သုံးပါတယ်။

အောက်ပါ flags တွေကို compression algorithm အပေါ် အဆင့်မြင့် ထိန်းချုပ်မှုနဲ့ memory သုံးစွဲမှု ချိန်ညှိခြင်းအတွက် သတ်မှတ်နိုင်ပါတယ်:

* `BROTLI_PARAM_LGWIN`
  * `BROTLI_MIN_WINDOW_BITS` ကနေ `BROTLI_MAX_WINDOW_BITS` အထိ range ရှိပြီး — default က `BROTLI_DEFAULT_WINDOW` ပါ; `BROTLI_PARAM_LARGE_WINDOW` flag သတ်မှတ်ထားရင်တော့ `BROTLI_LARGE_MAX_WINDOW_BITS` အထိ ရနိုင်ပါတယ်။
* `BROTLI_PARAM_LGBLOCK`
  * `BROTLI_MIN_INPUT_BLOCK_BITS` ကနေ `BROTLI_MAX_INPUT_BLOCK_BITS` အထိ range ရှိပါတယ်။
* `BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING`
  * Decompression speed ကို ဦးစားပေးပြီး compression ratio ကို လျှော့ချပေးတဲ့ Boolean flag တစ်ခုပါ။
* `BROTLI_PARAM_LARGE_WINDOW`
  * “Large Window Brotli” mode ကို ဖွင့်ပေးတဲ့ Boolean flag တစ်ခုပါ ([RFC 7932][] မှာ စံသတ်မှတ်ထားတဲ့ Brotli format နဲ့တော့ တွဲဖက် အသုံးပြုလို့ မရပါဘူး)။
* `BROTLI_PARAM_NPOSTFIX`
  * `0` ကနေ `BROTLI_MAX_NPOSTFIX` အထိ range ရှိပါတယ်။
* `BROTLI_PARAM_NDIRECT`
  * `1 << NPOSTFIX` ရဲ့ အဆင့်တွေနဲ့ `0` ကနေ `15 << NPOSTFIX` အထိ range ရှိပါတယ်။

#### Decompressor ရွေးချယ်စရာများ (Decompressor options)

Decompression ကို ထိန်းချုပ်ဖို့အတွက် ဒီ အဆင့်မြင့် options တွေ ရနိုင်ပါတယ်:

* `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION`
  * Internal memory allocation ပုံစံတွေကို သက်ရောက်မှု ရှိတဲ့ Boolean flag တစ်ခုပါ။
* `BROTLI_DECODER_PARAM_LARGE_WINDOW`
  * “Large Window Brotli” mode ကို ဖွင့်ပေးတဲ့ Boolean flag တစ်ခုပါ ([RFC 7932][] မှာ စံသတ်မှတ်ထားတဲ့ Brotli format နဲ့တော့ တွဲဖက် အသုံးပြုလို့ မရပါဘူး)။

### Zstd ကိန်းသေများ (Zstd constants)

> Stability: 1 - Experimental

Zstd-based streams တွေအတွက် options တွေနဲ့ တခြား constants တွေ အများအပြား ရနိုင်ပါတယ်:

#### Flush လုပ်ဆောင်ချက်များ (Flush operations)

အောက်ပါ တန်ဖိုးတွေက Zstd-based streams တွေအတွက် valid ဖြစ်တဲ့ flush operations တွေပါ:

* `zlib.constants.ZSTD_e_continue` (လုပ်ဆောင်ချက် အားလုံးအတွက် default)
* `zlib.constants.ZSTD_e_flush` (`.flush()` ခေါ်တဲ့အခါ default)
* `zlib.constants.ZSTD_e_end` (နောက်ဆုံး chunk အတွက် default)

#### Compressor ရွေးချယ်စရာများ (Compressor options)

Zstd encoders တွေပေါ်မှာ သတ်မှတ်နိုင်တဲ့ options အများအပြား ရှိပြီး — ၎င်းတို့က compression ထိရောက်မှုနဲ့ speed ကို သက်ရောက်မှု ရှိပါတယ်။ Keys တွေရော values တွေရော `zlib.constants` object ရဲ့ properties တွေအနေနဲ့ ဝင်ရောက်သုံးစွဲနိုင်ပါတယ်။

အရေးအကြီးဆုံး options တွေကတော့:

* `ZSTD_c_compressionLevel`
  * ကြိုတင်သတ်မှတ်ထားတဲ့ cLevel table အရ compression parameters တွေကို သတ်မှတ်ပေးပါတယ်။ Default level က ZSTD\_CLEVEL\_DEFAULT==3 ပါ။
* `ZSTD_c_strategy`
  * Compression strategy ကို ရွေးချယ်ပါတယ်။
  * ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကို အောက်က strategy options section မှာ စာရင်းပြုထားပါတယ်။

#### Strategy ရွေးချယ်စရာများ (Strategy options)

အောက်ပါ constants တွေကို `ZSTD_c_strategy` parameter ရဲ့ တန်ဖိုးတွေအဖြစ် သုံးနိုင်ပါတယ်:

* `zlib.constants.ZSTD_fast`
* `zlib.constants.ZSTD_dfast`
* `zlib.constants.ZSTD_greedy`
* `zlib.constants.ZSTD_lazy`
* `zlib.constants.ZSTD_lazy2`
* `zlib.constants.ZSTD_btlazy2`
* `zlib.constants.ZSTD_btopt`
* `zlib.constants.ZSTD_btultra`
* `zlib.constants.ZSTD_btultra2`

ဥပမာ:

```js
const stream = zlib.createZstdCompress({
  params: {
    [zlib.constants.ZSTD_c_strategy]: zlib.constants.ZSTD_btultra,
  },
});
```

#### ကတိပြုထားသော source size (Pledged Source Size)

Compress မလုပ်ရသေးတဲ့ (uncompressed) input ရဲ့ မျှော်မှန်းထားတဲ့ စုစုပေါင်း အရွယ်အစားကို `opts.pledgedSrcSize` ကနေတစ်ဆင့် သတ်မှတ်နိုင်ပါတယ် — ဒါက non-negative safe integer တစ်ခု ဖြစ်ရပါမယ်။ Input ရဲ့ အဆုံးမှာ အရွယ်အစား မကိုက်ညီဘူးဆိုရင် compression က `ZSTD_error_srcSize_wrong` ဆိုတဲ့ code နဲ့ မအောင်မြင်ပါဘူး။

#### Decompressor ရွေးချယ်စရာများ (Decompressor options)

Decompression ကို ထိန်းချုပ်ဖို့အတွက် ဒီ အဆင့်မြင့် options တွေ ရနိုင်ပါတယ်:

* `ZSTD_d_windowLogMax`
  * Streaming API က ကျိုးကြောင်းဆီလျော်မှု မရှိတဲ့ memory လိုအပ်ချက်တွေကနေ host ကို ကာကွယ်ဖို့အတွက် — ဘယ် size limit (2 ၏ ထပ်ကိန်း ပုံစံ) ကျော်လွန်ရင် memory buffer ခွဲဝေပေးဖို့ ငြင်းဆန်မလဲဆိုတာကို ရွေးချယ်ပါတယ်။

## Class: `Options`

zlib-based class တစ်ခုချင်းစီက `options` object တစ်ခုကို လက်ခံပါတယ်။ Options ဘာမှ မပေးစရာ မလိုပါဘူး။

Options တစ်ချို့က compress လုပ်တဲ့အခါမှသာ သက်ဆိုင်ပြီး — decompression classes တွေကတော့ ၎င်းတို့ကို လျစ်လျူရှုပါတယ်။

* `flush` {integer} **Default:** `zlib.constants.Z_NO_FLUSH`
* `finishFlush` {integer} **Default:** `zlib.constants.Z_FINISH`
* `chunkSize` {integer} **Default:** `16 * 1024`
* `windowBits` {integer}
* `level` {integer} (compress လုပ်ရာတွင်သာ)
* `memLevel` {integer} (compress လုပ်ရာတွင်သာ)
* `strategy` {integer} (compress လုပ်ရာတွင်သာ)
* `dictionary` {Buffer|TypedArray|DataView|ArrayBuffer} (deflate/inflate အတွက်သာ — default အနေနဲ့ dictionary ဗလာ)
* `info` {boolean} (`true` ဆိုရင် `buffer` နဲ့ `engine` ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။)
* `maxOutputLength` {integer} [convenience methods][] သုံးတဲ့အခါ output size ကို ကန့်သတ်ပါတယ်။ **Default:** [`buffer.kMaxLength`][]
* `rejectGarbageAfterEnd` {boolean} `true` ဆိုရင် compressed stream ရဲ့ အဆုံးနောက်မှာ trailing input (နောက်ဆက်တွဲ input) ကို တွေ့ရှိရင် decompression က မအောင်မြင်ပါဘူး။ ဒါမှာ ဖတ်လို့မရတဲ့ bytes တွေ ပါဝင်ပြီး — gzip ကို decompress လုပ်တဲ့အခါမှာတော့ ပထမ member နောက်ကို လိုက်တဲ့ gzip members တွေ ထပ်ဆောင်း ပါဝင်ပါတယ်။ **Default:** `false`

နောက်ထပ် အချက်အလက်တွေအတွက် [`deflateInit2` and `inflateInit2`][] documentation ကို ကြည့်ပါ။

## Class: `BrotliOptions`

Brotli-based class တစ်ခုချင်းစီက `options` object တစ်ခုကို လက်ခံပါတယ်။ Options တွေ အားလုံးက optional ပါ။

* `flush` {integer} **Default:** `zlib.constants.BROTLI_OPERATION_PROCESS`
* `finishFlush` {integer} **Default:** `zlib.constants.BROTLI_OPERATION_FINISH`
* `chunkSize` {integer} **Default:** `16 * 1024`
* `params` {Object} Indexed [Brotli parameters][] တွေ ပါဝင်တဲ့ key-value object ပါ။
* `maxOutputLength` {integer} [convenience methods][] သုံးတဲ့အခါ output size ကို ကန့်သတ်ပါတယ်။ **Default:** [`buffer.kMaxLength`][]
* `info` {boolean} `true` ဆိုရင် `buffer` နဲ့ `engine` ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ **Default:** `false`
* `rejectGarbageAfterEnd` {boolean} `true` ဆိုရင် ပထမဆုံး ပြည့်စုံတဲ့ compressed stream ပြီးနောက်မှာ input ကျန်နေသေးရင် decompression က မအောင်မြင်ပါဘူး။ **Default:** `false`

ဥပမာ:

```js
const stream = zlib.createBrotliCompress({
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fs.statSync(inputFile).size,
  },
});
```

## Class: `zlib.BrotliCompress`

* Extends: [`ZlibBase`][]

Brotli algorithm ကို သုံးပြီး data တွေကို compress လုပ်ပါတယ်။

## Class: `zlib.BrotliDecompress`

* Extends: [`ZlibBase`][]

Brotli algorithm ကို သုံးပြီး data တွေကို decompress လုပ်ပါတယ်။

## Class: `zlib.Deflate`

* Extends: [`ZlibBase`][]

Deflate ကို သုံးပြီး data တွေကို compress လုပ်ပါတယ်။

## Class: `zlib.DeflateRaw`

* Extends: [`ZlibBase`][]

Deflate ကို သုံးပြီး data တွေကို compress လုပ်ပေမယ့် `zlib` header တစ်ခုကိုတော့ ထပ်ဆင့် မဖြည့်စွက်ပါဘူး။

## Class: `zlib.Gunzip`

* Extends: [`ZlibBase`][]

Gzip stream တစ်ခုကို decompress လုပ်ပါတယ်။

## Class: `zlib.Gzip`

* Extends: [`ZlibBase`][]

Gzip ကို သုံးပြီး data တွေကို compress လုပ်ပါတယ်။

## Class: `zlib.Inflate`

* Extends: [`ZlibBase`][]

Deflate stream တစ်ခုကို decompress လုပ်ပါတယ်။

## Class: `zlib.InflateRaw`

* Extends: [`ZlibBase`][]

Raw deflate stream တစ်ခုကို decompress လုပ်ပါတယ်။

## Class: `zlib.Unzip`

* Extends: [`ZlibBase`][]

Header ကို auto-detect လုပ်ပြီး Gzip သို့မဟုတ် Deflate နဲ့ ချုံ့ထားတဲ့ stream တစ်ခုခုကို decompress လုပ်ပါတယ်။

## Class: `zlib.ZipBuffer`

> Stability: 1.0 - Early development

ZIP archive API က experimental (စမ်းသပ်ဆဲ) အဆင့်ပါ။ ၎င်းရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို (ဒီ class အပါအဝင်) ပထမဆုံး အကြိမ် သုံးလိုက်တာနဲ့ experimental warning တစ်ခုကို emit လုပ်ပါတယ်; `node:zlib` ကို import လုပ်ရုံနဲ့တော့ မထုတ်ပါဘူး။

`Buffer`, `TypedArray`, `DataView` သို့မဟုတ် `ArrayBuffer` တစ်ခုထဲမှာ ရှိပြီးသား ZIP archive တစ်ခုရဲ့ entries တွေအပေါ် in-memory **zero-copy** (မိတ္တူကူးစရာ မလိုဘဲ တိုက်ရိုက် ကြည့်ရှု) view တစ်ခုပါ။ ၎င်းရဲ့ entries အစုကို တည်းဖြတ်နိုင်ပါတယ် — entries တွေ ထည့်နိုင်၊ ဖယ်ရှားနိုင်ပါတယ် — ဒါပေမယ့် [`ZipFile`][] နဲ့ မတူဘဲ အဲဒီ တည်းဖြတ်မှုတွေကို source buffer ထဲ **မရေးသား**ပါဘူး: အသစ် ထည့်လိုက်တဲ့ entry တစ်ခုကို သီးခြား in-memory [`ZipEntry`][] တစ်ခုအနေနဲ့ ထိန်းသိမ်းထားပြီး (ပေးလိုက်တဲ့ buffer က နောက်ထပ် ထည့်စရာ နေရာ မရှိတဲ့ fixed-size view တစ်ခုပါ) — ဖယ်ရှားလိုက်တာကတော့ `ZipBuffer` ရဲ့ index ကနေ entry ကို ချပစ်လိုက်ရုံပါပဲ။ မူရင်း bytes တွေကို ဘယ်တော့မှ ပြုပြင်မွမ်းမံတာ မရှိပါဘူး။ [`zipBuffer.toBuffer()`][] က လက်ရှိ entries အစုကို archive အသစ်တစ်ခုအဖြစ် serialize လုပ်ပါတယ်။

`ZipBuffer` က သင် ပေးအပ်လိုက်တဲ့ archive ကို copy မလုပ်ပါဘူး။ ၎င်းက အဲဒီ memory အပေါ် view တစ်ခုကို ထိန်းသိမ်းထားပြီး — entry တစ်ခုချင်းစီရဲ့ content တွေကို lazily (လိုအပ်မှသာ) ဖတ်ပါတယ် — ဒါကြောင့်ပဲ archive ဘယ်လောက်ကြီးကြီး ဖန်တီးမှု စရိတ် သက်သာတာပါ။ အပေးအယူကတော့ — `ZipBuffer` (သို့မဟုတ် ၎င်းကနေ ရယူထားတဲ့ [`ZipEntry`][] တစ်ခုခု) ကို သုံးနေဆဲ ဖြစ်ချိန်မှာ အဲဒီ memory ကို — `TypedArray`/`DataView` တစ်ခုကို ကျောထောက်နေတဲ့ `ArrayBuffer` အပါအဝင် — **ပြုပြင်မွမ်းမံခြင်း သို့မဟုတ် ပြန်လည် အသုံးပြုခြင်း မပြုရပါဘူး**: နောက်ပိုင်း ဖတ်မှုတစ်ခုက အပြောင်းအလဲကို မြင်တွေ့နိုင်ပြီး မအောင်မြင်ခြင်း သို့မဟုတ် ပျက်စီးနေတဲ့ data ကို ပြန်ပေးခြင်း ဖြစ်နိုင်ပါတယ်။ Source ကို ပြုပြင်မွမ်းမံခြင်း သို့မဟုတ် ပြန်လည် အသုံးပြုခြင်း ဖြစ်နိုင်ရင် copy တစ်ခု (ဥပမာ — `Buffer.from(source)`) ကို ပေးလိုက်ပါ။

`add()` နဲ့ `toBuffer()` တစ်ခုချင်းစီမှာ တူညီတဲ့ compression အလုပ်ကို synchronously လုပ်ဆောင်ပေးတဲ့ `*Sync` ဗားရှင်းတွေ ရှိပါတယ် ([`addSync()`][`zipBuffer.addSync()`], [`toBufferSync()`][`zipBuffer.toBufferSync()`])။ Synchronous `node:fs` APIs တွေလိုပဲ — ဒါတွေက operation ပြီးဆုံးသည်အထိ Node.js event loop နဲ့ နောက်ထပ် JavaScript execution တွေကို ပိတ်ဆို့ (block) ထားပါတယ်; synchronous execution သင့်လျော်တဲ့ နေရာမှာသာ (ဥပမာ — သက်တမ်းတိုတဲ့ scripts တွေ သို့မဟုတ် startup code တွေ) သုံးပြီး — တုံ့ပြန်မှု မြန်နေဖို့ လိုအပ်တဲ့ code တွေမှာတော့ မသုံးပါနဲ့။

```mjs
import { ZipBuffer } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';
import { Buffer } from 'node:buffer';

const zip = new ZipBuffer(readFileSync('archive.zip'));
for (const [name, entry] of zip) {
  console.log(name, entry.size);
}
await zip.add('hello.txt', Buffer.from('Hello, world!'));
zip.delete('unwanted.txt');
writeFileSync('archive.zip', await zip.toBuffer());
```

```cjs
const { ZipBuffer } = require('node:zlib');
const { readFileSync, writeFileSync } = require('node:fs');

async function main() {
  const zip = new ZipBuffer(readFileSync('archive.zip'));
  for (const [name, entry] of zip) {
    console.log(name, entry.size);
  }
  await zip.add('hello.txt', Buffer.from('Hello, world!'));
  zip.delete('unwanted.txt');
  writeFileSync('archive.zip', await zip.toBuffer());
}
main();
```

### `new zlib.ZipBuffer(buffer)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer} ပြီးပြည့်စုံတဲ့ ZIP archive တစ်ခုပါ။

Archive ရဲ့ central directory ကို parse လုပ်ပါတယ်။ `buffer` က ကောင်းမွန်စွာ ဖွဲ့စည်းထားပြီး ပံ့ပိုးထားတဲ့ archive တစ်ခု မဟုတ်ရင် [`ERR_ZIP_INVALID_ARCHIVE`][] သို့မဟုတ် [`ERR_ZIP_UNSUPPORTED_FEATURE`][] error တစ်ခုကို throw လုပ်ပါတယ်။

`buffer` ကို **copy မလုပ်ပါဘူး**: `ZipBuffer` က ၎င်းအပေါ် zero-copy view တစ်ခုကို ထိန်းသိမ်းထားပြီး (a `TypedArray`, `DataView`, သို့မဟုတ် `ArrayBuffer` အတွက်ဆိုရင် အခြေခံ `ArrayBuffer` ပေါ်မှာ) — entry content တွေကို လိုအပ်သလို ၎င်းကနေ တိုက်ရိုက် ဖတ်ပါတယ်။ `ZipBuffer` သို့မဟုတ် ၎င်းကနေ ဖတ်ထားတဲ့ entry တစ်ခုခု အသက်ဝင်နေဆဲ ဖြစ်ချိန်မှာ အဲဒီ memory ကို ပြုပြင်မွမ်းမံခြင်း သို့မဟုတ် ပြန်လည် အသုံးပြုခြင်း မပြုပါနဲ့; ပြောင်းလဲနိုင်ခြေ ရှိရင် copy တစ်ခု ပေးလိုက်ပါ။

### `zipBuffer.add(filename, data[, options])`

* `filename` {string} Archive ထဲမှာ entry ရဲ့ နာမည်ပါ။ နောက်ဆုံးမှာ `/` ပါနေရင် directory entry တစ်ခုကို ညွှန်ပြပါတယ်။
* `data` {Buffer|TypedArray|DataView|ArrayBuffer} Entry ရဲ့ ပြည့်စုံတဲ့၊ compress မလုပ်ရသေးတဲ့ content ပါ။
* `options` {Object} [`zlib.ZipEntry.create()`][] ကို ကြည့်ပါ။
* Returns: {Promise} ဖန်တီးလိုက်တဲ့ {ZipEntry} နဲ့ fulfilled ဖြစ်ပါတယ်။

`zipBuffer.addEntry(await zlib.ZipEntry.create(filename, data, options))` နဲ့ ညီမျှပါတယ်။

### `zipBuffer.addSync(filename, data[, options])`

* `filename` {string} Archive ထဲမှာ entry ရဲ့ နာမည်ပါ။ နောက်ဆုံးမှာ `/` ပါနေရင် directory entry တစ်ခုကို ညွှန်ပြပါတယ်။
* `data` {Buffer|TypedArray|DataView|ArrayBuffer} Entry ရဲ့ ပြည့်စုံတဲ့၊ compress မလုပ်ရသေးတဲ့ content ပါ။
* `options` {Object} [`zlib.ZipEntry.createSync()`][] ကို ကြည့်ပါ။
* Returns: {ZipEntry} ဖန်တီးလိုက်တဲ့ entry ပါ။

[`zipBuffer.add()`][] ရဲ့ synchronous ဗားရှင်းပါ။ `zipBuffer.addEntry(zlib.ZipEntry.createSync(filename, data, options))` နဲ့ ညီမျှပါတယ်။

### `zipBuffer.addEntry(entry)`

* `entry` {ZipEntry}
* Returns: {ZipEntry} `entry` ပါ။

ကြိုတင် တည်ဆောက်ပြီးသား entry တစ်ခုကို ၎င်းရဲ့ ကိုယ်ပိုင် [`zipEntry.name`][] နဲ့ သော့ခတ်ပြီး ထည့်သွင်းပါတယ်။ အဲဒီ နာမည်နဲ့ ရှိပြီးသား entry တစ်ခုခုကို အစားထိုးပါတယ်။

### `zipBuffer.clear()`

Entry တွေ အားလုံးကို ဖယ်ရှားပါတယ်။

### `zipBuffer.comment`

* Type: {string}

Archive-level comment ပါ — override မလုပ်ထားရင် [`zipBuffer.toBuffer()`][] ခေါ်ယူမှုတွေ တစ်လျှောက် byte-for-byte (byte တစ်ခုချင်းစီ မပြောင်းလဲဘဲ) ထိန်းသိမ်းထားပါတယ်။ Bytes တွေက valid UTF-8 ဖြစ်တဲ့အခါ UTF-8 အဖြစ် — မဟုတ်ရင် CP437 အဖြစ် — decode လုပ်ပါတယ် (ဒီ field မှာ ကိုယ်ပိုင် encoding flag မပါပါဘူး)။

### `zipBuffer.delete(name)`

* `name` {string}
* Returns: {boolean} `name` ဆိုတဲ့ နာမည်နဲ့ entry တစ်ခု ရှိခဲ့ပြီး ဖယ်ရှားလိုက်နိုင်ရင် `true` ပါ။

### `zipBuffer.entries()`

* Returns: {Iterator} `[name, entry]` အတွဲတွေရဲ့ {Iterator} ပါ — `entry` က [`ZipEntry`][] တစ်ခု ဖြစ်ပါတယ်။

### `zipBuffer.forEach(callback[, thisArg])`

* `callback` {Function}
* `thisArg` {any}

Archive က စာရင်းပြုထားတဲ့ အစဉ်အတိုင်း entry တစ်ခုချင်းစီအတွက် `callback` ကို တစ်ကြိမ် ခေါ်ပါတယ်။

### `zipBuffer.get(name)`

* `name` {string}
* Returns: {ZipEntry}

Archive ထဲမှာ `name` နာမည်နဲ့ entry မရှိဘူးဆိုရင် [`ERR_ZIP_ENTRY_NOT_FOUND`][] ကို throw လုပ်ပါတယ်။

### `zipBuffer.has(name)`

* `name` {string}
* Returns: {boolean}

### `zipBuffer.keys()`

* Returns: {Iterator} Entry နာမည်တွေရဲ့ {Iterator} ပါ။

### `zipBuffer.size`

* Type: {number}

Archive ထဲမှာ ရှိတဲ့ entries အရေအတွက်ပါ။

### `zipBuffer.toBuffer([options])`

* `options` {string|Object} Archive comment တစ်ခုပါ — `{ comment: options }` ရဲ့ အတိုကောက် ပုံစံပါ။
  * `comment` {string} Archive comment တစ်ခုပါ။ **Default:** [`zipBuffer.comment`][]။
  * `baseOffset` {number} Archive က မှတ်တမ်းတင်ထားတဲ့ offset တိုင်းကို ဒီ bytes အရေအတွက်နဲ့ ရွှေ့ပေးပါတယ် — ဒါကြောင့် serialize လုပ်ထားတဲ့ archive က ၎င်းရဲ့ နောက်ဆုံး file ရဲ့ အစပိုင်းကလွဲပြီး တခြားနေရာမှာ ရေးထားရင်တောင် (ဥပမာ — output တစ်ခုတည်းထဲကို အရင်ရေးပြီးသား `baseOffset` bytes တွေရဲ့ နောက်မှာ) မိမိကိုယ်ကို ဖော်ပြနိုင်စွမ်း ရှိနေပါတယ်။ **Default:** `0`။
* Returns: {Promise} Serialize လုပ်ထားတဲ့ archive ပါဝင်တဲ့ {Buffer} တစ်ခုနဲ့ fulfilled ဖြစ်ပါတယ်။

လက်ရှိ entries အစုကို — ထည့်သွင်းခဲ့သည့် သို့မဟုတ် ဖတ်ခဲ့သည့် အစဉ်အတိုင်း — archive အသစ်တစ်ခုအဖြစ် serialize လုပ်ပြီး — လိုအပ်သလို Zip64 structures တွေကို အလိုအလျောက် ပြောင်းလဲ အသုံးပြုပါတယ် ([`zlib.createZipArchive()`][] ကို ကြည့်ပါ)။

### `zipBuffer.toBufferSync([options])`

* `options` {string|Object} [`zipBuffer.toBuffer()`][] ကို ကြည့်ပါ။
* Returns: {Buffer} Serialize လုပ်ထားတဲ့ archive ပါ။

[`zipBuffer.toBuffer()`][] ရဲ့ synchronous ဗားရှင်းပါ (see [`zlib.createZipArchiveSync()`][])။

### `zipBuffer.values()`

* Returns: {Iterator} [`ZipEntry`][] တွေရဲ့ {Iterator} ပါ။

### `zipBuffer.writable`

* Type: {boolean}

အမြဲတမ်း `true` ပါ။

## Class: `zlib.ZipEntry`

> Stability: 1.0 - Early development

ZIP archive API က experimental (စမ်းသပ်ဆဲ) အဆင့်ပါ။ ၎င်းရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို (ဒီ class အပါအဝင်) ပထမဆုံး အကြိမ် သုံးလိုက်တာနဲ့ experimental warning တစ်ခုကို emit လုပ်ပါတယ်; `node:zlib` ကို import လုပ်ရုံနဲ့တော့ မထုတ်ပါဘူး။

ZIP archive တစ်ခုထဲက file တစ်ခု သို့မဟုတ် directory တစ်ခုတည်းပါ။ Instances တွေကို [`ZipBuffer`][] နဲ့ [`ZipFile`][] က ထုတ်လုပ်ပေးပြီး — သို့မဟုတ် writing အတွက် `ZipEntry.create()`/`ZipEntry.createStream()` နဲ့ တိုက်ရိုက် ဖန်တီးနိုင်ပါတယ်။

`create()` နဲ့ `content()` တစ်ခုချင်းစီမှာ `*Sync` ဗားရှင်းတွေ ရှိပါတယ် (streaming ဖြစ်တဲ့ `contentIterator()` မှာတော့ မရှိပါဘူး)။ Synchronous `node:fs` APIs တွေလိုပဲ — ဒါတွေက operation (deflate/inflate pass တွေ အပါအဝင်) ပြီးဆုံးသည်အထိ Node.js event loop နဲ့ နောက်ထပ် JavaScript execution တွေကို ပိတ်ဆို့ (block) ထားပါတယ်; synchronous execution သင့်လျော်တဲ့ နေရာမှာသာ (ဥပမာ — သက်တမ်းတိုတဲ့ scripts တွေ သို့မဟုတ် startup code တွေ) သုံးပြီး — တုံ့ပြန်မှု မြန်နေဖို့ လိုအပ်တဲ့ code တွေမှာတော့ မသုံးပါနဲ့။

### Static method: `zlib.ZipEntry.create(filename, data[, options])`

* `filename` {string} Archive ထဲမှာ entry ရဲ့ နာမည်ပါ။ နောက်ဆုံးမှာ `/` ပါနေရင် directory entry တစ်ခုကို ညွှန်ပြပါတယ်။
* `data` {Buffer|TypedArray|DataView|ArrayBuffer} Entry ရဲ့ ပြည့်စုံတဲ့၊ compress မလုပ်ရသေးတဲ့ content ပါ။ `filename` က directory တစ်ခုကို ရည်ညွှန်းရင် data က ဗလာ ဖြစ်ရပါမယ်။
* `options` {Object}
  * `comment` {string} Entry comment တစ်ခုပါ။
  * `mode` {integer} Unix permission bits တွေပါ။ **Default:** `0o644` (directories တွေအတွက် `0o755`)။
  * `modified` {Date} Entry ရဲ့ modification time ပါ။ **Default:** လက်ရှိ အချိန်ပါ။
  * `method` {string} `'deflate'`, `'store'` သို့မဟုတ် `'zstd'` ထဲက တစ်ခုပါ။ **Default:** `'deflate'` — ဒါပေမယ့် directories တွေနဲ့ ဗလာ content တွေကတော့ အမြဲတမ်း stored လုပ်ပါတယ်။
* Returns: {Promise} {ZipEntry} တစ်ခုနဲ့ fulfilled ဖြစ်ပါတယ်။

`data` ကို compress လုပ်ပြီး (သို့သော် `method` က `'store'` ဆိုရင် သို့မဟုတ် compression က ၎င်းရဲ့ size ကို မလျှော့ချနိုင်ဘူးဆိုရင်တော့ မလုပ်ပါဘူး) — ၎င်းရဲ့ CRC-32 ကို တွက်ချက်ပါတယ်။

Entry က compress မလုပ်ဘဲ stored (သိမ်းဆည်း) ဖြစ်သွားတဲ့အခါ (`method` က `'store'` ဖြစ်လို့ သို့မဟုတ် compression က size ကို မလျှော့ချနိုင်လို့) — entry က `data` ရဲ့ copy အစား zero-copy view တစ်ခုကို ထိန်းသိမ်းထားပြီး — ၎င်းရဲ့ CRC-32 ကိုတော့ မှတ်တမ်းတင်ပြီးသား ဖြစ်ပါတယ်။ Entry ကို ဖန်တီးပြီးနောက်မှာ `data` ကို ပြုပြင်မွမ်းမံခြင်း မပြုပါနဲ့; ပြောင်းလဲနိုင်ခြေ ရှိရင် copy တစ်ခု ပေးလိုက်ပါ။

ZIP က `modified` အတွက် သုံးတဲ့ MS-DOS date/time fields တွေမှာ 2-second resolution (၂ စက္ကန့် တိကျမှု) ရှိပြီး time zone မပါပါဘူး။ `modified` က 2-second boundary တစ်ခုပေါ်မှာ အတိအကျ မကျရောက်တဲ့အခါ Info-ZIP extended-timestamp extra field တစ်ခုကိုပါ ထပ်ရေးပေးပြီး — အချိန်က ပိုတိကျစွာ round-trip (ပြန်လည် ဖတ်ယူနိုင်) ဖြစ်စေဖို့ စက္ကန့် (UTC) အပြည့်ကို မှတ်တမ်းတင်ပါတယ် ([`zipEntry.modified`][] ကို ကြည့်ပါ)။ ဒါက entry-creation လမ်းကြောင်း တိုင်းအတွက် သက်ရောက်ပါတယ်။

### Static method: `zlib.ZipEntry.createStream(filename, source[, options])`

* `filename` {string} Archive ထဲမှာ entry ရဲ့ နာမည်ပါ။ `/` နဲ့ အဆုံး မသတ်ရပါဘူး။
* `source` {AsyncIterable} `Uint8Array` chunks တွေအနေနဲ့ entry ရဲ့ compress မလုပ်ရသေးတဲ့ content ကို ထုတ်ပေးတဲ့ {AsyncIterable} ပါ။
* `options` {Object}
  * `comment` {string} Entry comment တစ်ခုပါ။
  * `mode` {integer} Unix permission bits တွေပါ။ **Default:** `0o644`။
  * `modified` {Date} Entry ရဲ့ modification time ပါ။ **Default:** လက်ရှိ အချိန်ပါ။
  * `method` {string} `'deflate'`, `'store'` သို့မဟုတ် `'zstd'` ထဲက တစ်ခုပါ။ **Default:** `'deflate'`။
* Returns: {ZipEntry}

[`zlib.createZipArchive()`][] က serialize လုပ်တဲ့အခါ content ကို နေရာမှာ ချက်ချင်း (on the fly) compress လုပ်တဲ့ entry တစ်ခုကို ဖန်တီးပါတယ် — `source` ကို memory ထဲ buffer မလုပ်ဘဲနဲ့ပါ။ ၎င်းရဲ့ `size`, `compressedSize` နဲ့ `crc32` တွေက serialization ပြီးဆုံးမှသာ ရနိုင်ပါတယ်။ Synchronous ဗားရှင်း မရှိပါဘူး: streaming entries တွေက asynchronous ဖြစ်ပြီး တစ်ဆင့်ချင်း ထုတ်လုပ်တဲ့ `source` တစ်ခုနဲ့မှသာ အဓိပ္ပာယ် ရှိပါတယ်။

`source` ကို serialization အတွင်းမှာ အတိအကျ တစ်ကြိမ်တည်းသာ စားသုံး (drain) ပါတယ်။ အဲဒီအချိန် မတိုင်ခင် entry မှာ ဖတ်လို့ရတဲ့ content မရှိသေးတာမို့ — [`zipEntry.content()`][], [`zipEntry.contentSync()`][] နဲ့ [`zipEntry.contentIterator()`][] တို့က [`ERR_INVALID_STATE`][] ကို throw လုပ်ပါတယ်။ Entry ကို writable [`ZipFile`][] တစ်ခုဆီ [`zipFile.addEntry()`][] (သို့မဟုတ် `addEntrySync()`) နဲ့ ထည့်သွင်းပြီး serialize လုပ်ရင် — ၎င်းကို ရေးပြီးစ copy တစ်ခုကို ညွှန်ပြတဲ့ file-backed entry တစ်ခုအဖြစ် **နေရာမှာပဲ အဆင့်မြှင့်တင် (promoted in place)** လုပ်လိုက်ပြီး — အဲဒီ `ZipFile` ဖွင့်ထားသရွေ့ ဖတ်လို့ရအောင် (ပြီးတော့ ပြန်လည် serialize လုပ်နိုင်အောင်) ဖြစ်သွားပါတယ်။ တခြား နည်းနဲ့ (ဥပမာ — [`zlib.createZipArchive()`][] ကနေ တိုက်ရိုက်) serialize လုပ်ရင်တော့ entry က ကုန်ဆုံးပြီး ဖတ်လို့မရတော့ပါဘူး။

`source` က operating-system resource တစ်ခုကို ကိုင်ထားနိုင်တာမို့ (ဥပမာ — file read stream တစ်ခု) — streaming entry တစ်ခုက disposable (စွန့်ပစ်၍ရနိုင်) ဖြစ်ပါတယ်: ၎င်းရဲ့ `Symbol.dispose` နဲ့ `Symbol.asyncDispose` methods တွေက `source` ကို စားသုံးပြီးသား မဟုတ်သေးရင် destroy လုပ်ပါတယ်။ Archive တစ်ခုဆီ ပေးအပ်လိုက်တဲ့ entry ကို အဲဒီ archive က dispose လုပ်ပါတယ် ([`zlib.createZipArchive()`][] ကို ကြည့်ပါ); entry တစ်ခုကို တည်ဆောက်ပြီး archive တစ်ခုဆီ ဘယ်တော့မှ မပေးအပ်ဖြစ်ရင်မှသာ တိုက်ရိုက် dispose လုပ်ပါ။ Non-streaming entries တွေအတွက်တော့ disposal က no-op (ဘာမှ မလုပ်ပဲ နေခြင်း) ပါ — အထူးသဖြင့် file-backed entry တစ်ခုက ၎င်း ငှားသုံးထားတဲ့ [`ZipFile`][] descriptor ကို ဘယ်တော့မှ မပိတ်ပါဘူး။

### Static method: `zlib.ZipEntry.createSymlink(filename, target[, options])`

* `filename` {string} Archive ထဲမှာ entry ရဲ့ နာမည်ပါ။
* `target` {string} Symbolic link ရဲ့ target path ပါ။
* `options` {Object}
  * `comment` {string} Entry comment တစ်ခုပါ။
  * `mode` {integer} Unix permission bits တွေပါ။ **Default:** `0o777`။
  * `modified` {Date} Entry ရဲ့ modification time ပါ။ **Default:** လက်ရှိ အချိန်ပါ။
* Returns: {ZipEntry}

Symbolic-link entry တစ်ခုကို ဖန်တီးပါတယ်: content က `target` ဖြစ်ပြီး Unix mode type bits တွေက ၎င်းကို symlink အဖြစ် မှတ်သားထားတဲ့ stored entry တစ်ခုပါ — ဒါကြောင့် ပြန်ဖတ်တဲ့အခါ [`zipEntry.isSymlink`][] က `true` ဖြစ်ပါတယ်။ Symlink entries တွေကို လေးစားလိုက်နာတဲ့ extraction tools တွေက link ကို ပြန်လည် ဖန်တီးပေးပါတယ်; `target` ကို ယုံကြည်စိတ်ချရမှု မရှိတဲ့အရာအဖြစ် သဘောထားပါ (path ဘေးကင်းမှုအကြောင်း [`zipEntry.name`][] ကို ကြည့်ပါ)။

### Static method: `zlib.ZipEntry.createSync(filename, data[, options])`

* `filename` {string} Archive ထဲမှာ entry ရဲ့ နာမည်ပါ။ နောက်ဆုံးမှာ `/` ပါနေရင် directory entry တစ်ခုကို ညွှန်ပြပါတယ်။
* `data` {Buffer|TypedArray|DataView|ArrayBuffer} Entry ရဲ့ ပြည့်စုံတဲ့၊ compress မလုပ်ရသေးတဲ့ content ပါ။ `filename` က directory တစ်ခုကို ရည်ညွှန်းရင် data က ဗလာ ဖြစ်ရပါမယ်။
* `options` {Object} [`zlib.ZipEntry.create()`][] ကို ကြည့်ပါ။
* Returns: {ZipEntry}

[`zlib.ZipEntry.create()`][] ရဲ့ synchronous ဗားရှင်းပါ။

### Static method: `zlib.ZipEntry.read(buffer)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer} ပြီးပြည့်စုံတဲ့ ZIP archive တစ်ခုပါ။
* Returns: {Iterator} {ZipEntry} တွေရဲ့ {Iterator} ပါ။

Entry တိုင်းကို `buffer` ကနေ တိုက်ရိုက် parse လုပ်ပါတယ် — [`ZipBuffer`][] ထဲ index လုပ်ခြင်း မရှိပါဘူး။ [`ZipBuffer`][] လိုပဲ — ထုတ်ပေးလိုက်တဲ့ entries တွေက ၎င်းတို့ရဲ့ content copy တွေအစား `buffer` ရဲ့ zero-copy views တွေကို ကိုင်ထားပါတယ် — ဒါကြောင့် တူညီတဲ့ စည်းမျဉ်း သက်ရောက်ပါတယ်: ၎င်းတို့ တစ်ခုခု သုံးနေဆဲ ဖြစ်ချိန်မှာ `buffer` ကို ပြုပြင်မွမ်းမံခြင်း သို့မဟုတ် ပြန်လည် အသုံးပြုခြင်း မပြုပါနဲ့။

### `zipEntry.comment`

* Type: {string}

### `zipEntry.compressed`

* Type: {boolean}

Entry ရဲ့ content ကို compressed ပုံစံနဲ့ သိမ်းဆည်းထားရင် (compression method ဘယ်ဟာမဆို — လောလောဆယ်တော့ deflate သို့မဟုတ် Zstandard) `true` ဖြစ်ပြီး — compress မလုပ်ဘဲ သိမ်းဆည်းထားရင်တော့ `false` ပါ။

### `zipEntry.compressedSize`

* Type: {number}

### `zipEntry.content([options])`

* `options` {Object}
  * `verify` {boolean} Entry ရဲ့ CRC-32 checksum ကို စစ်ဆေးပါတယ်။ **Default:** `true`။
  * `maxSize` {number} ဘာမှ allocate မလုပ်ခင် — ဒီထက်ပိုတဲ့ uncompressed bytes အရေအတွက်ကို ကြေညာထားတဲ့ content ကို ပယ်ချပါတယ်။ **Default:** [`zlib.getMaxZipContentSize()`][]။
* Returns: {Promise} Entry ရဲ့ decompress လုပ်ထားတဲ့ content ပါဝင်တဲ့ {Buffer} တစ်ခုနဲ့ fulfilled ဖြစ်ပါတယ်။ Buffer က archive သို့မဟုတ် entry ကို ဖန်တီးခဲ့တဲ့ data တွေနဲ့ memory မျှဝေခြင်း မရှိတဲ့ copy အသစ်တစ်ခုပါ။

Entry ရဲ့ ကြေညာထားတဲ့ size က `maxSize` ထက် ကျော်လွန်ရင် [`ERR_ZIP_ENTRY_TOO_LARGE`][] error — content က CRC-32 စစ်ဆေးမှု မအောင်ရင် သို့မဟုတ် ကြေညာထားတဲ့ size နဲ့ မကိုက်ညီရင် [`ERR_ZIP_ENTRY_CORRUPT`][] error — ပြီးတော့ content မရနိုင်သေးတဲ့ streaming entry ([`zlib.ZipEntry.createStream()`][]) တစ်ခုအတွက်ဆိုရင် [`ERR_INVALID_STATE`][] error — တို့ကို throw လုပ်ပါတယ် (streaming entry တစ်ခု ဘယ်အချိန်မှာ ဖတ်လို့ရလာလဲဆိုတာ အဲဒီ method မှာ ကြည့်ပါ)။

### `zipEntry.contentSync([options])`

* `options` {Object} [`zipEntry.content()`][] ကို ကြည့်ပါ။
* Returns: {Buffer} Entry ရဲ့ decompress လုပ်ထားတဲ့ content ပါ။

[`zipEntry.content()`][] ရဲ့ synchronous ဗားရှင်းပါ။

### `zipEntry.contentIterator([options])`

* `options` {Object}
  * `verify` {boolean} Entry ရဲ့ CRC-32 checksum ကို စစ်ဆေးပါတယ်။ **Default:** `true`။
  * `maxSize` {number} ဘာမှ decompress မလုပ်ခင် — ဒီထက်ပိုတဲ့ uncompressed bytes အရေအတွက်ကို ကြေညာထားတဲ့ content ကို ပယ်ချပါတယ်။ **Default:** ကန့်သတ်ချက် မရှိပါဘူး။
* Returns: {AsyncIterator} Entry ရဲ့ decompress လုပ်ထားတဲ့ content ရဲ့ {Buffer} chunks တွေရဲ့ {AsyncIterator} ပါ။

[`zipEntry.content()`][] နဲ့ မတူဘဲ ဒါက member တစ်ခုလုံးကို memory ထဲ buffer မလုပ်ပါဘူး။ File-backed entry တစ်ခု ([`zipFile.get()`][] က ပြန်ပေးတဲ့ဟာမျိုး) အတွက်ဆိုရင် — iterator ကို စားသုံးတာနဲ့အမျှ compressed bytes တွေကို disk ကနေ ဖတ်ပြီး — ဘာမှ သိမ်းဆည်းထားခြင်း မရှိပါဘူး; entry က ၎င်းရဲ့ `ZipFile` ဖွင့်ထားချိန်မှာသာ valid ဖြစ်ပါတယ်။

Streaming က ကြီးမားလွန်းတဲ့ (arbitrarily large) members တွေအတွက် memory ကန့်သတ်ထားတဲ့ လမ်းကြောင်း ဖြစ်တာမို့ — [`zipEntry.content()`][] ကို ကန့်သတ်ထားသလိုမျိုး [`zlib.getMaxZipContentSize()`][] က ဒါကို **မကန့်သတ်**ပါဘူး — အဲဒီ default က single large allocation တစ်ခုကို ကာကွယ်ပေးတာဖြစ်ပြီး streaming က အဲဒီလို allocation မျိုး ဘယ်တော့မှ မလုပ်ပါဘူး။ Output က chunk တစ်ခုချင်းစီအလိုက် ကြေညာထားတဲ့ uncompressed size နဲ့သာ ကန့်သတ်ထားဆဲ ဖြစ်ပြီး — ရှင်းလင်းတဲ့ ကန့်သတ်ချက်တစ်ခု သတ်မှတ်ချင်ရင် `maxSize` ကို ပေးလိုက်ပါ။

Compression မလုပ်ဘဲ သိမ်းထားတဲ့ in-memory entry တစ်ခုအတွက်ဆိုရင် ထုတ်ပေးလိုက်တဲ့ chunks တွေက entry ရဲ့ ထိန်းသိမ်းထားတဲ့ content ရဲ့ zero-copy views တွေပါ ([`zipEntry.rawContent`][] ကို ကြည့်ပါ); ၎င်းတို့ကို ပြုပြင်မွမ်းမံခြင်း မပြုပါနဲ့။

ထုတ်ပေးလိုက်တဲ့ chunks တွေက **iterator ပြီးဆုံးသည်အထိ ယာယီ (provisional)** သဘောပါ။ CRC-32 စစ်ဆေးမှု (နဲ့ နောက်ဆုံး declared-size စစ်ဆေးမှု) က byte တိုင်း ဖတ်ပြီးမှသာ လုပ်ဆောင်နိုင်တာမို့ — ပျက်စီးနေတဲ့ သို့မဟုတ် ဖြတ်တောက်ထားတဲ့ entry တစ်ခုကို iterator က ပထမဆုံး chunk မတိုင်ခင် မဟုတ်ဘဲ နောက်ဆုံး chunk ပြီးမှ _after_ throw လုပ်ခြင်းအားဖြင့် သတင်းပို့ပါတယ်။ Chunk တစ်ခုချင်းစီက စုစုပေါင်း ကြေညာထားတဲ့ size သို့မဟုတ် `maxSize` ကို ဘယ်တော့မှ မကျော်လွန်အောင် ကန့်သတ်ထားဆဲ ဖြစ်ပေမယ့် — အတည်မပြုရသေးတဲ့ bytes တွေကို လုပ်ဆောင်မှု မပြုရမယ့် consumer တစ်ခုကတော့ chunks တွေ ရောက်လာတာနဲ့ ချက်ချင်း process လုပ်မယ့်အစား ၎င်းတို့ကို buffer လုပ်ထားသင့်ပါတယ် (သို့မဟုတ် — ဘာမှ မပြန်ခင် စစ်ဆေးပေးတဲ့ — [`zipEntry.content()`][] ကို သုံးသင့်ပါတယ်)။

### `zipEntry.crc32`

* Type: {number}

### `zipEntry.flags`

* Type: {number}

Entry ရဲ့ raw general-purpose bit flag ပါ။

### `zipEntry.isDirectory`

* Type: {boolean}

Entry က directory တစ်ခုဆိုရင် (၎င်းရဲ့ နာမည်က `/` နဲ့ အဆုံးသတ်ရင်) `true` ပါ။

### `zipEntry.isFile`

* Type: {boolean}

Entry က regular file တစ်ခုဆိုရင် — ဆိုလိုတာက directory မဟုတ်၊ symbolic link လည်း မဟုတ်ရင် — `true` ပါ။

### `zipEntry.isSymlink`

* Type: {boolean}

Entry က symbolic link တစ်ခုဆိုရင် (၎င်းရဲ့ Unix mode type bits တွေက `S_IFLNK` ဖြစ်ရင်) `true` ပါ; ၎င်းရဲ့ content က link target ပါ။ Unix-like system ပေါ်မှာ မရေးထားတဲ့ archives တွေအတွက်တော့ အမြဲတမ်း `false` ပါ။ Extract လုပ်တဲ့အခါ symlink ရဲ့ target ကို ယုံကြည်စိတ်ချရမှု မရှိတဲ့အရာအဖြစ် သဘောထားပါ — path ဘေးကင်းမှုအကြောင်း [`zipEntry.name`][] ကို ကြည့်ပါ။

### `zipEntry.mode`

* Type: {number}

Entry ရဲ့ Unix mode permission bits တွေပါ — setuid, setgid နဲ့ sticky bits တွေ အပါအဝင် (အနိမ့်ဆုံး 12 bits, `0o7777`) — archive ကို Unix-like system ပေါ်မှာ မရေးထားရင်တော့ `0` ပါ။ File-type bits တွေကိုတော့ ဒီမှာ မထည့်သွင်းပါဘူး; type အတွက် [`zipEntry.isDirectory`][] / [`zipEntry.isSymlink`][] ကို သုံးပါ။

### `zipEntry.modified`

* Type: {Date}

Entry ရဲ့ နောက်ဆုံး ပြုပြင်မွမ်းမံချိန် ဖြစ်ပါတယ်။ Archive ထဲမှာ extra field တစ်ခုထဲ ပိုတိကျတဲ့ timestamp ပါနေရင် — modern tools အများစု ရေးလေ့ရှိတဲ့ NTFS (`0x000a`), Info-ZIP extended (`0x5455`) သို့မဟုတ် Info-ZIP Unix (`0x5855`) field လိုမျိုး — အဲဒီ absolute (UTC) အချိန်ကို သုံးပါတယ်; မဟုတ်ရင်တော့ ကြမ်းတမ်းတဲ့ local-time MS-DOS date/time field (2-second resolution) ကို သုံးပါတယ်။

Tools တစ်ချို့က ၎င်းတို့ရဲ့ high-fidelity timestamp ကို local file header ထဲမှာသာ သိမ်းဆည်းပါတယ် — ဒါကြောင့် file-backed entry တစ်ခု ([`zipFile.get()`][] က ပြန်ပေးတဲ့ဟာမျိုး) ပေါ်မှာ ဒီ property ကို ပထမဆုံး ဖတ်တာက အဲဒီ header ကို ရှာဖွေဖို့ disk ပေါ်မှာ နေရာသတ်မှတ်ထားတဲ့ synchronous read အသေးစား တစ်ခုကို လုပ်ဆောင်နိုင်ပါတယ်။ အဲဒီ read က မအောင်မြင်ရင် တန်ဖိုးက central-directory data ဆီကို တိတ်တဆိတ် ပြန်ကျသွားပါတယ်။

### `zipEntry.method`

* Type: {number}

Entry ရဲ့ raw compression method ပါ: stored အတွက် `0`, deflate အတွက် `8`, Zstandard အတွက် `93` ဖြစ်ပါတယ်။

### `zipEntry.name`

* Type: {string}

Entry ရဲ့ နာမည်ပါ — central directory ကနေ decode လုပ်ပြီး အဲဒီဟာကို စာရင်း အာဏာပိုင် (authoritative) အဖြစ် သတ်မှတ်ပါတယ် — မကိုက်ညီတဲ့ local file header တစ်ခုကို လျစ်လျူရှုလိုက်တာမို့ — mismatched-header ("ZIP-confusion") archive တစ်ခုက `name` ကို ဖတ်လိုက်တဲ့အရာနဲ့ မကိုက်ညီအောင် မလုပ်နိုင်ပါဘူး။ Bytes တွေကို valid Info-ZIP Unicode Path extra field (`0x7075`) တစ်ခု ရှိနေရင် အဲဒီကနေ decode လုပ်ပြီး — မဟုတ်ရင် language-encoding flag (general-purpose bit 11) သတ်မှတ်ထားတဲ့အခါ **သို့မဟုတ်** bytes တွေ valid UTF-8 ဖြစ်တဲ့အခါ (flag ကို ဘယ်တော့မှ မသတ်မှတ်ဘဲ UTF-8 နာမည်တွေ ရေးခဲ့တဲ့ tools တွေ အများကြီး ရှိပါတယ်) UTF-8 အဖြစ် — နှစ်ခုလုံး မဟုတ်မှသာ CP437 (သမိုင်းဝင် default) အဖြစ် — decode လုပ်ပါတယ်။ Raw bytes တွေအတွက် [`zipEntry.nameBuffer`][] ကို ကြည့်ပါ။

နာမည်ကို **မူရင်းအတိုင်း (verbatim)** ပြန်ပေးပါတယ်: ၎င်းကို ဘယ်တော့မှ normalize မလုပ်ပါဘူး — `..` ပါတဲ့ နာမည်၊ ရှေ့ဆုံးမှာ `/` ပါတဲ့ နာမည်၊ drive letter သို့မဟုတ် backslashes ပါတဲ့ နာမည်တွေကို ပြန်ရေးခြင်း သို့မဟုတ် ပယ်ချခြင်း ဘာမှ မလုပ်ပါဘူး။ `ZipFile`/`ZipBuffer` က disk ပေါ်ကို ဘယ်တော့မှ မရေးပါဘူး — ဒါကြောင့် extract လုပ်တဲ့အခါ path traversal ("Zip Slip") ကို ကာကွယ်တာက caller ရဲ့ တာဝန်ပါ။

### `zipEntry.nameBuffer`

* Type: {Buffer}

Character decoding မလုပ်ခင် entry ရဲ့ raw name bytes တွေပါ။ Archive ရဲ့ နာမည်တွေက UTF-8 သို့မဟုတ် CP437 ကလွဲပြီး တခြား encoding တစ်ခုနဲ့ ရှိနေပြီး caller က ကိုယ်တိုင် decode လုပ်ချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

### `zipEntry.rawContent`

* Type: {Buffer|null}

Entry ကို memory ထဲမှာ ထားတဲ့အခါ ၎င်းရဲ့ raw (သက်ဆိုင်ရင် ဆက်လက် compressed ဖြစ်နေတဲ့) content ပါ — ထုတ်ပြဖို့ in-memory buffer မရှိတဲ့အခါမှာတော့ `null` ပါ: [`zlib.ZipEntry.createStream()`][] နဲ့ ဖန်တီးထားတဲ့ entry တစ်ခု သို့မဟုတ် [`zipFile.get()`][] က ပြန်ပေးတဲ့ file-backed entry တစ်ခုမှာ bytes တွေကို ထိန်းသိမ်းမထားပဲ disk ကနေ လိုအပ်သလို ဖတ်ပါတယ်။ File-backed entry တစ်ခုကို ဖတ်ဖို့ [`zipEntry.content()`][] သို့မဟုတ် [`zipEntry.contentIterator()`][] ကို သုံးပါ။

### `zipEntry.size`

* Type: {number}

Entry ရဲ့ uncompressed size ကို bytes နဲ့ ဖော်ပြတာပါ။

## Class: `zlib.ZipFile`

> Stability: 1.0 - Early development

ZIP archive API က experimental (စမ်းသပ်ဆဲ) အဆင့်ပါ။ ၎င်းရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို (ဒီ class အပါအဝင်) ပထမဆုံး အကြိမ် သုံးလိုက်တာနဲ့ experimental warning တစ်ခုကို emit လုပ်ပါတယ်; `node:zlib` ကို import လုပ်ရုံနဲ့တော့ မထုတ်ပါဘူး။

Disk ပေါ်မှာ ရှိတဲ့ ZIP archive တစ်ခုရဲ့ entries တွေအပေါ် random-access view တစ်ခုပါ။ Archive ရဲ့ tail နဲ့ central directory ကိုသာ အစမှာ ဖတ်ပြီး — member content တွေကိုတော့ disk ကနေ lazily (လိုအပ်မှသာ) ဖတ်ပါတယ်။ `{ writable: true }` နဲ့ ဖွင့်ထားရင် ရေးလို့ရပါတယ်: [`zipFile.addEntry()`][]/[`zipFile.add()`][] တို့က member အသစ်ရဲ့ data ကို central directory ရှိခဲ့တဲ့ နေရာမှာ ထည့်သွင်းပြီး — ချက်ချင်း ၎င်းနောက်မှာ central directory ကို ပြန်ရေးပါတယ်; [`zipFile.delete()`][] ကတော့ central directory ကိုသာ ပြန်ရေးပါတယ်။ နှစ်ခုလုံးက method ရဲ့ ပြန်ပေးတဲ့ `Promise` fulfilled ဖြစ်တာနဲ့ file ကို ပြောင်းလဲလိုက်တာ ဖြစ်ပါတယ်။ ဖျက်လိုက်တဲ့ သို့မဟုတ် အစားထိုးလိုက်တဲ့ members တွေက dead space (အသုံးမကျသော နေရာ) အဖြစ် ကျန်ခဲ့ပါတယ်; [`zipFile.compact()`][] ကတော့ အဲဒါတွေ မပါတဲ့ stream တစ်ခုကို ထုတ်ပေးပါတယ်။

ဒီ in-place တည်းဖြတ်မှုတွေက **crash-atomic (ပျက်ကျမှုအခါတွင်ပါ သမာဓိရှိ)** မဟုတ်ပါဘူး။ Central directory ကို ပြန်ရေးတာက နေရာမှာပဲ ဖြစ်ပွားတာမို့ — တစ်ဝက်မှာ မအောင်မြင်သွားတဲ့ write တစ်ခု (disk ပြည့်သွားတာ၊ device ပြတ်တောက်သွားတာ၊ process သတ်ခံရတာ) က disk ပေါ်မှာ central directory တစ်စိတ်တစ်ပိုင်း သို့မဟုတ် ပျောက်နေတဲ့ — ဆိုလိုတာက ဖတ်လို့မရတဲ့ — archive တစ်ခုကို ကျန်ခဲ့စေနိုင်ပါတယ် — ၎င်းရဲ့ ရှေ့က member data တွေ နဂိုအတိုင်း ရှိနေရင်တောင် ပါ။ ပယ်ချခံရတဲ့ call က အခြေခံ error ကို ပေါ်လွင်စေပြီး `ZipFile` object က ဆက်သုံးလို့ရအောင် ကျန်ခဲ့ပါတယ် (၎င်းရဲ့ in-memory view ကို မစွန့်ပစ်လိုက်တာမို့ — caller က ဥပမာ [`zipFile.compact()`][] နဲ့ entries တွေကို တခြားနေရာမှာ ပြန်ရေးပြီး — ပြန်လည် ရယူဖို့ ကြိုးစားနိုင်ပါတယ်) — ဒါပေမယ့် အဲဒီ in-memory view က disk ပေါ်က bytes တွေနဲ့ မကိုက်ညီတော့တာ ဖြစ်နိုင်ပါတယ်။ Failure တစ်ခုကို ဖြတ်ကျော်ပြီး တည်တံ့မှု (durability) အရေးကြီးတဲ့အခါ copy တစ်ခုပေါ်မှာ ရေးပါ — သို့မဟုတ် file အသစ်တစ်ခုထဲ `compact()` လုပ်ပါ။

Method တိုင်းမှာ `*Sync` ဗားရှင်း ရှိပါတယ်။ Synchronous `node:fs` APIs တွေလိုပဲ — ဒါတွေက operation ပြီးဆုံးသည်အထိ Node.js event loop နဲ့ နောက်ထပ် JavaScript execution တွေကို ပိတ်ဆို့ (block) ထားပါတယ်; synchronous execution သင့်လျော်တဲ့ နေရာမှာသာ (ဥပမာ — သက်တမ်းတိုတဲ့ scripts တွေ သို့မဟုတ် startup code တွေ) သုံးပြီး — တုံ့ပြန်မှု မြန်နေဖို့ လိုအပ်တဲ့ code တွေမှာတော့ မသုံးပါနဲ့။ တူညီတဲ့ `ZipFile` ပေါ်မှာ လုပ်နေတဲ့ asynchronous `add()`, `addEntry()`, `delete()` သို့မဟုတ် `close()` တစ်ခုခု အပြီးမသတ်ရသေးတဲ့အချိန်မှာ synchronous method တစ်ခုကို ခေါ်လိုက်ရင် `ERR_INVALID_STATE` ကို throw လုပ်ပါတယ် — နှစ်ခု ရောပြွမ်း လုပ်ဆောင်မိရင် archive ကို ပျက်စီးစေနိုင်လို့ပါ။

```mjs
import { ZipFile } from 'node:zlib';
import { Buffer } from 'node:buffer';

const zip = await ZipFile.open('archive.zip', { writable: true });
try {
  const entry = await zip.get('member.txt');
  console.log((await entry.content()).toString());
  for await (const chunk of await zip.stream('huge.bin')) {
    // Process each chunk without buffering the whole member.
  }
  await zip.add('new.txt', Buffer.from('hello'));
  await zip.delete('unwanted.txt');
} finally {
  await zip.close();
}
```

```cjs
const { ZipFile } = require('node:zlib');

async function main() {
  const zip = await ZipFile.open('archive.zip', { writable: true });
  try {
    const entry = await zip.get('member.txt');
    console.log((await entry.content()).toString());
    for await (const chunk of await zip.stream('huge.bin')) {
      // Process each chunk without buffering the whole member.
    }
    await zip.add('new.txt', Buffer.from('hello'));
    await zip.delete('unwanted.txt');
  } finally {
    await zip.close();
  }
}
main();
```


### Static method: `zlib.ZipFile.open(filename[, options])`

* `filename` {string}
* `options` {Object}
  * `writable` {boolean} အရင်းခံ file ကို ဖတ်ရော ရေးရော (`'r+'`) နှစ်မျိုးစလုံးအတွက် ဖွင့်ပေးပြီး — [`zipFile.addEntry()`][]/[`zipFile.add()`][]/[`zipFile.delete()`][] တို့ကို သုံးနိုင်စေပါတယ်။ **Default:** `false`။
* Returns: {Promise} {ZipFile} တစ်ခုနဲ့ fulfilled ဖြစ်ပါတယ်။

Archive ရဲ့ central directory က memory ထဲမှာ buffer လုပ်ဖို့ ကြီးလွန်းနေရင် [`ERR_ZIP_ARCHIVE_TOO_LARGE`][] error တစ်ခုကို throw လုပ်ပါတယ်။

### Static method: `zlib.ZipFile.openSync(filename[, options])`

* `filename` {string}
* `options` {Object} [`zlib.ZipFile.open()`][] ကို ကြည့်ပါ။
* Returns: {ZipFile}

[`zlib.ZipFile.open()`][] ရဲ့ synchronous ဗားရှင်းပါ။

### `zipFile.add(filename, data[, options])`

* `filename` {string} Archive ထဲမှာ entry ရဲ့ နာမည်ပါ။ နောက်ဆုံးမှာ `/` ပါနေရင် directory entry တစ်ခုကို ညွှန်ပြပါတယ်။
* `data` {Buffer|TypedArray|DataView|ArrayBuffer} Entry ရဲ့ ပြည့်စုံတဲ့၊ compress မလုပ်ရသေးတဲ့ content ပါ။
* `options` {Object} [`zlib.ZipEntry.create()`][] ကို ကြည့်ပါ။
* Returns: {Promise} ဖန်တီးလိုက်တဲ့ {ZipEntry} နဲ့ fulfilled ဖြစ်ပါတယ်။

`zipFile.addEntry(await zlib.ZipEntry.create(filename, data, options))` နဲ့ ညီမျှပါတယ်။

### `zipFile.addEntry(entry)`

* `entry` {ZipEntry}
* Returns: {Promise} `entry` နဲ့ fulfilled ဖြစ်ပါတယ်။

`entry` ကို central directory လက်ရှိ စတင်တဲ့ နေရာမှာ ရေးပြီး — ၎င်းပါဝင်လာအောင် central directory ကို ပြန်လည် ရေးသားကာ — နာမည်တူ ရှိပြီးသား entry တစ်ခုခုကို အစားထိုးပါတယ်။ `ZipFile` ကို `{ writable: true }` နဲ့ မဖွင့်ထားရင် [`ERR_ZIP_NOT_WRITABLE`][] ကို throw လုပ်ပါတယ်။

ပြန်ပေးလိုက်တဲ့ (တူညီတဲ့) `entry` က ဆက်ပြီး ဖတ်လို့ရအောင် ကျန်ခဲ့ပါတယ်: serialize လုပ်ပြီးတာနဲ့ ကုန်ဆုံးသွားမယ့် — [`zlib.ZipEntry.createStream()`][] နဲ့ ဖန်တီးထားတဲ့ streaming entry တစ်ခုကို — ရေးပြီးစ copy တစ်ခုကို ညွှန်ပြတဲ့ file-backed entry တစ်ခုအဖြစ် နေရာမှာပဲ အဆင့်မြှင့်တင် (promoted in place) လုပ်လိုက်ပါတယ် (ဒီ `ZipFile` ဖွင့်ထားသရွေ့ သက်တမ်းဝင်ပါတယ်)။ In-memory entries တွေကတော့ ကိုယ်ပိုင် buffer ကို မပြောင်းလဲဘဲ ထိန်းသိမ်းထားပါတယ်။

### `zipFile.addEntrySync(entry)`

* `entry` {ZipEntry}
* Returns: {ZipEntry} `entry` ပါ။

[`zipFile.addEntry()`][] ရဲ့ synchronous ဗားရှင်းပါ။ `entry` က ဆိုင်းငံ့ထားတဲ့ (pending) streaming entry — [`zlib.ZipEntry.createStream()`][] နဲ့ ဖန်တီးထားတဲ့ entry — မဖြစ်ရပါဘူး: ၎င်းရဲ့ asynchronous source ကို စုပ်ထုတ်ဖို့ (drain) synchronous နည်းလမ်း မရှိပါဘူး။

### `zipFile.addSync(filename, data[, options])`

* `filename` {string} Archive ထဲမှာ entry ရဲ့ နာမည်ပါ။ နောက်ဆုံးမှာ `/` ပါနေရင် directory entry တစ်ခုကို ညွှန်ပြပါတယ်။
* `data` {Buffer|TypedArray|DataView|ArrayBuffer} Entry ရဲ့ ပြည့်စုံတဲ့၊ compress မလုပ်ရသေးတဲ့ content ပါ။
* `options` {Object} [`zlib.ZipEntry.createSync()`][] ကို ကြည့်ပါ။
* Returns: {ZipEntry} ဖန်တီးလိုက်တဲ့ entry ပါ။

[`zipFile.add()`][] ရဲ့ synchronous ဗားရှင်းပါ။ `zipFile.addEntrySync(zlib.ZipEntry.createSync(filename, data, options))` နဲ့ ညီမျှပါတယ်။

### `zipFile.close()`

* Returns: {Promise}

အရင်းခံ file handle ကို ပိတ်ပါတယ်။

ပိတ်လိုက်တာက လက်ကျန် (outstanding) objects တွေကို အလုပ်မလုပ်နိုင်အောင် မဖြစ်စေပါဘူး: [`zipFile.get()`][] က အရင်က ပြန်ပေးခဲ့တဲ့ `ZipEntry` objects တွေနဲ့ `ZipFile` ရဲ့ ကိုယ်ပိုင် methods တွေက ပိတ်ပြီးနောက် သုံးမိရင် သီးသန့် Node.js error code တစ်ခုနဲ့ မဟုတ်ဘဲ system-level errors တွေ (ဥပမာ `EBADF`) နဲ့ ကျရှုံးပါလိမ့်မယ်။ [`zipFile.closeSync()`][] အတွက်လည်း အလားတူပါပဲ။

### `zipFile.closeSync()`

[`zipFile.close()`][] ရဲ့ synchronous ဗားရှင်းပါ။

### `zipFile.comment`

* Type: {string}

Archive-level comment ပါ — [`zipFile.addEntry()`][]/[`zipFile.delete()`][] ခေါ်ယူမှုတွေ တစ်လျှောက် byte-for-byte (byte တစ်ခုချင်းစီ မပြောင်းလဲဘဲ) ထိန်းသိမ်းထားပါတယ်။ Bytes တွေက valid UTF-8 ဖြစ်တဲ့အခါ UTF-8 အဖြစ် — မဟုတ်ရင် CP437 အဖြစ် — decode လုပ်ပါတယ် (ဒီ field မှာ ကိုယ်ပိုင် encoding flag မပါပါဘူး)။

### `zipFile.compact([comment])`

* `comment` {string} Archive comment တစ်ခုပါ။ **Default:** [`zipFile.comment`][]။
* Returns: {stream.Readable} လက်ရှိ live entries တွေရဲ့ stream ပါ — အရင်က [`zipFile.addEntry()`][]/[`zipFile.delete()`][] ခေါ်ယူမှုတွေကြောင့် ကျန်ခဲ့တဲ့ dead space (အသုံးမကျသော နေရာ) မပါတဲ့ archive အသစ်တစ်ခုအဖြစ် serialize လုပ်ထားပါတယ်။

ဖွင့်ထားတဲ့ file ကို မပြုပြင်ပါဘူး; ရလဒ်ကို file အသစ်တစ်ခုဆီ pipe လုပ်ပါ:

```mjs
import { createWriteStream } from 'node:fs';
zip.compact().pipe(createWriteStream('compacted.zip'));
```

### `zipFile.compactSync([comment])`

* `comment` {string} Archive comment တစ်ခုပါ။ **Default:** [`zipFile.comment`][]။
* Returns: {Buffer} လက်ရှိ live entries တွေပါ — အရင်က [`zipFile.addEntry()`][]/[`zipFile.delete()`][] ခေါ်ယူမှုတွေကြောင့် ကျန်ခဲ့တဲ့ dead space (အသုံးမကျသော နေရာ) မပါတဲ့ archive အသစ်တစ်ခုအဖြစ် serialize လုပ်ထားပါတယ်။

[`zipFile.compact()`][] ရဲ့ synchronous ဗားရှင်းပါ။ ဖွင့်ထားတဲ့ file ကို မပြုပြင်ပါဘူး။

### `zipFile.delete(name)`

* `name` {string}
* Returns: {Promise} `name` နာမည်နဲ့ entry တစ်ခု ရှိခဲ့ပြီး ဖယ်ရှားလိုက်နိုင်ရင် `true` — မဟုတ်ရင် `false` နဲ့ fulfilled ဖြစ်ပါတယ်။

ဘယ်အကြောင်းအရာ အသစ်မှ မရေးဘဲ central directory ကိုသာ ပြန်လည် ရေးသားပါတယ် — archive က မကြီးထွားပါဘူး။ `ZipFile` ကို `{ writable: true }` နဲ့ မဖွင့်ထားရင် [`ERR_ZIP_NOT_WRITABLE`][] ကို throw လုပ်ပါတယ်။

### `zipFile.deleteSync(name)`

* `name` {string}
* Returns: {boolean} `name` နာမည်နဲ့ entry တစ်ခု ရှိခဲ့ပြီး ဖယ်ရှားလိုက်နိုင်ရင် `true` — မဟုတ်ရင် `false` ပါ။

[`zipFile.delete()`][] ရဲ့ synchronous ဗားရှင်းပါ။

### `zipFile.entries()`

* Returns: {Iterator} `[name, entry]` အတွဲတွေရဲ့ iterator ပါ — `entry` က [`ZipEntry`][] တစ်ခုနဲ့ fulfilled ဖြစ်တဲ့ {Promise} တစ်ခု ဖြစ်ပါတယ်။

### `zipFile.entriesSync()`

* Returns: {Iterator} `[name, entry]` အတွဲတွေရဲ့ iterator ပါ — `entry` က resolve လုပ်ပြီးသား [`ZipEntry`][] တစ်ခု ဖြစ်ပါတယ် (`Promise` မဟုတ်ပါဘူး)။

[`zipFile.entries()`][] ရဲ့ synchronous ဗားရှင်းပါ။

### `zipFile.forEach(callback[, thisArg])`

* `callback` {Function}
* `thisArg` {any}

### `zipFile.forEachSync(callback[, thisArg])`

* `callback` {Function}
* `thisArg` {any}

[`zipFile.forEach()`][] ရဲ့ synchronous ဗားရှင်းပါ: `callback` ကို `Promise` အစား resolve လုပ်ပြီးသား [`ZipEntry`][] တစ်ခုနဲ့ ခေါ်ပါတယ်။

### `zipFile.get(name)`

* `name` {string}
* Returns: {Promise} {ZipEntry} တစ်ခုနဲ့ fulfilled ဖြစ်ပါတယ်။

`name` အတွက် lazy ဖြစ်ပြီး file-backed [`ZipEntry`][] တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီနေရာမှာ disk ကနေ ဘာမှ မဖတ်ဘဲ content ဘာမှ buffer မလုပ်ပါဘူး: ပြန်ပေးလိုက်တဲ့ entry က ၎င်းရဲ့ member ကို file ကနေ တိုက်ရိုက် ဖတ်တယ် ([`zipEntry.content()`][] အတွက်ဆိုရင် decompress လည်း လုပ်တယ်) — ဝင်ရောက်မှု (access) တစ်ခုချင်းစီမှာပါ — ပြီးတော့ `ZipFile` က member content ဘာမှ မထိန်းသိမ်းပါဘူး။ Entry က ဒီ `ZipFile` ဖွင့်ထားသရွေ့သာ သက်တမ်းဝင်ပါတယ်။ ၎င်းရဲ့ content ကို နောက်မှ ဖတ်တဲ့အခါ — member က buffer တစ်ခုတည်းထဲ ထည့်သွင်းဖို့ ကြီးလွန်းရင် — [`ERR_ZIP_ENTRY_TOO_LARGE`][] ကို throw လုပ်နိုင်ပါတယ်; အဲဒီအစား [`zipEntry.contentIterator()`][] (သို့မဟုတ် [`zipFile.stream()`][]) ကို သုံးပါ။ Archive ထဲမှာ `name` နာမည်နဲ့ entry မရှိရင် [`ERR_ZIP_ENTRY_NOT_FOUND`][] ကို throw လုပ်ပါတယ်။

### `zipFile.getSync(name)`

* `name` {string}
* Returns: {ZipEntry}

[`zipFile.get()`][] ရဲ့ synchronous ဗားရှင်းပါ။ `get()` လိုပဲ — အစမှာ ဘာမှ မဖတ်ဘဲ lazy handle ကိုသာ တည်ဆောက်တာမို့ — ၎င်းကိုယ်တိုင် I/O ပေါ်မှာ block မလုပ်ပါဘူး — ဒါပေမယ့် ပြန်ပေးလိုက်တဲ့ entry ကနေတစ်ဆင့် နောက်မှ လုပ်တဲ့ reads တွေ (ဥပမာ [`zipEntry.contentSync()`][]) ကတော့ block လုပ်ပါတယ်; synchronous methods တွေအကြောင်း အထက်က မှတ်ချက်ကို ကြည့်ပါ။

### `zipFile.has(name)`

* `name` {string}
* Returns: {boolean}

### `zipFile.keys()`

* Returns: {Iterator} Entry နာမည်တွေရဲ့ iterator ပါ။

### `zipFile.size`

* Type: {number}

Archive ထဲမှာ ရှိတဲ့ entries အရေအတွက်ပါ။

### `zipFile.stream(name[, options])`

* `name` {string}
* `options` {Object}
  * `verify` {boolean} Entry ရဲ့ CRC-32 checksum ကို စစ်ဆေးပါတယ်။ **Default:** `true`။
  * `maxSize` {number} ဒီထက် ပိုများတဲ့ uncompressed bytes အရေအတွက်ကို ကြေညာထားတဲ့ content ကို ပယ်ချပါတယ်။ **Default:** ကန့်သတ်ချက် မရှိပါ။
* Returns: {Promise} Member ရဲ့ decompress လုပ်ထားတဲ့ content ရဲ့ {stream.Readable} တစ်ခုနဲ့ fulfilled ဖြစ်ပါတယ် — member တစ်ခုလုံးကို memory ထဲ buffer မလုပ်ဘဲနဲ့ပါ။

[`zipFile.get()`][]`(name)` ရဲ့ [`zipEntry.contentIterator()`][] အပေါ်က `Readable` တစ်ခုဆီ resolve ဖြစ်စေတဲ့ အဆင်ပြေ wrapper တစ်ခုပါ; stream ကို စားသုံးတာနဲ့ compressed bytes တွေကို disk ကနေ ဖတ်ပါတယ်။ Archive ထဲမှာ `name` နာမည်နဲ့ entry မရှိရင် ပြန်ပေးတဲ့ promise က [`ERR_ZIP_ENTRY_NOT_FOUND`][] နဲ့ reject ဖြစ်ပါတယ်။

### `zipFile.values()`

* Returns: {Iterator} {Promise} objects တွေရဲ့ iterator ပါ — တစ်ခုချင်းစီက [`ZipEntry`][] တစ်ခုနဲ့ fulfilled ဖြစ်ပါတယ်။

### `zipFile.valuesSync()`

* Returns: {Iterator} resolve လုပ်ပြီးသား [`ZipEntry`][] တန်ဖိုးတွေရဲ့ iterator ပါ (`Promise` တွေ မဟုတ်ပါဘူး)။

[`zipFile.values()`][] ရဲ့ synchronous ဗားရှင်းပါ။

### `zipFile.writable`

* Type: {boolean}

ဒီ `ZipFile` ကို `{ writable: true }` နဲ့ ဖွင့်ခဲ့လား ဆိုတာကို ဖော်ပြပါတယ်။

## Class: `zlib.ZlibBase`

* Extends: [`stream.Transform`][]

`node:zlib` module က ဒါကို export မလုပ်ပါဘူး။ ဒီမှာ မှတ်တမ်းတင်ထားတာက ၎င်းက compressor/decompressor classes တွေရဲ့ base class ဖြစ်လို့ပါ။

ဒီ class က [`stream.Transform`][] ကနေ အမွေဆက်ခံထားပြီး — `node:zlib` objects တွေကို pipes တွေနဲ့ အလားတူ stream operations တွေမှာ သုံးနိုင်စေပါတယ်။

### `zlib.bytesWritten`

* Type: {number}

`zlib.bytesWritten` property က — bytes တွေကို process မလုပ်ခင် (derived class နဲ့ လိုက်လျောညီထွေစွာ compress သို့မဟုတ် decompress မလုပ်ခင်) — engine ဆီ ရေးသွင်းခဲ့တဲ့ bytes အရေအတွက်ကို ဖော်ပြပါတယ်။

### `zlib.close([callback])`

* `callback` {Function}

အရင်းခံ handle ကို ပိတ်ပါတယ်။

### `zlib.flush([kind, ]callback)`

* `kind` **Default:** zlib-based streams တွေအတွက် `zlib.constants.Z_FULL_FLUSH` ဖြစ်ပြီး Brotli-based streams တွေအတွက် `zlib.constants.BROTLI_OPERATION_FLUSH` ဖြစ်ပါတယ်။
* `callback` {Function}

ဆိုင်းငံ့ထားတဲ့ data ကို flush လုပ်ပါတယ်။ ဒါကို ပေါ့ပေါ့ဆဆ မခေါ်ပါနဲ့ — အချိန်မတန်ဘဲ flush လုပ်တာတွေက compression algorithm ရဲ့ ထိရောက်မှုကို ဆိုးရွားစွာ ထိခိုက်စေပါတယ်။

ဒါကို ခေါ်တာက internal `zlib` state ကနေသာ data တွေကို flush လုပ်ပြီး — streams အဆင့်မှာ ဘယ်လို flushing မျိုးကိုမှ မလုပ်ပါဘူး။ ယင်းအစား — `.write()` ကို သာမန် ခေါ်တာလိုပဲ ပြုမူပါတယ် — ဆိုလိုတာက ဆိုင်းငံ့ထားတဲ့ တခြား writes တွေရဲ့ နောက်မှာ queue တက်ပြီး stream ကနေ data ကို ဖတ်နေမှသာ output ထွက်ပါလိမ့်မယ်။

### `zlib.params(level, strategy, callback)`

* `level` {integer}
* `strategy` {integer}
* `callback` {Function}

ဒီ function က zlib-based streams တွေအတွက်သာ ရနိုင်ပါတယ် — Brotli အတွက် မဟုတ်ပါဘူး။

Compression level နဲ့ compression strategy ကို လည်ပတ်နေချိန်မှာ (dynamically) update လုပ်ပါတယ်။ Deflate algorithm အတွက်သာ သက်ဆိုင်ပါတယ်။

### `zlib.reset()`

Compressor/decompressor ကို factory defaults တွေဆီ ပြန်လည် သတ်မှတ်ပါတယ်။ Inflate နဲ့ deflate algorithms တွေအတွက်သာ သက်ဆိုင်ပါတယ်။

## Class: `ZstdOptions`

> Stability: 1 - Experimental

Zstd-based class တစ်ခုချင်းစီက `options` object တစ်ခုကို လက်ခံပါတယ်။ Options အားလုံးက မထည့်လည်း ရပါတယ်။

* `flush` {integer} **Default:** `zlib.constants.ZSTD_e_continue`
* `finishFlush` {integer} **Default:** `zlib.constants.ZSTD_e_end`
* `chunkSize` {integer} **Default:** `16 * 1024`
* `params` {Object} [Zstd parameters][] စာရင်းဝင် parameters တွေ ပါဝင်တဲ့ key-value object ပါ။
* `maxOutputLength` {integer} [convenience methods][] သုံးတဲ့အခါ output size ကို ကန့်သတ်ပါတယ်။ **Default:** [`buffer.kMaxLength`][]
* `info` {boolean} `true` ဆိုရင် `buffer` နဲ့ `engine` ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ **Default:** `false`
* `dictionary` {Buffer|TypedArray|DataView|ArrayBuffer} Dictionary နဲ့ တူညီတဲ့ ပုံစံများ (patterns) မျှဝေတဲ့ data တွေကို compress သို့မဟုတ် decompress လုပ်တဲ့အခါ compression ထိရောက်မှု မြှင့်တင်ဖို့ သုံးတဲ့ optional dictionary ပါ။
* `rejectGarbageAfterEnd` {boolean} `true` ဆိုရင် — ပထမဆုံး ပြည့်စုံတဲ့ compressed stream ပြီးနောက်မှာ input ကျန်နေသေးရင် — decompression က ကျရှုံးပါတယ်။ **Default:** `false`

ဥပမာ:

```js
const stream = zlib.createZstdCompress({
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.ZSTD_c_compressionLevel]: 10,
    [zlib.constants.ZSTD_c_checksumFlag]: 1,
  },
});
```

## Class: `zlib.ZstdCompress`

> Stability: 1 - Experimental

Zstd algorithm ကို သုံးပြီး data ကို compress လုပ်ပါတယ်။

## Class: `zlib.ZstdDecompress`

> Stability: 1 - Experimental

Zstd algorithm ကို သုံးပြီး data ကို decompress လုပ်ပါတယ်။

## `zlib.constants`

Zlib-related constants တွေကို စာရင်းပြုစုထားတဲ့ object တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

## `zlib.crc32(data[, value])`

* `data` {string|Buffer|TypedArray|DataView} `data` က string ဆိုရင် — တွက်ချက်မှုမှာ မသုံးခင် UTF-8 အဖြစ် encode လုပ်ပါလိမ့်မယ်။
* `value` {integer} Optional ဖြစ်တဲ့ အစပြု တန်ဖိုးပါ။ 32-bit unsigned integer ဖြစ်ရပါမယ်။ **Default:** `0`
* Returns: {integer} Checksum ပါဝင်တဲ့ 32-bit unsigned integer ပါ။

`data` ရဲ့ 32-bit [Cyclic Redundancy Check][] checksum ကို တွက်ချက်ပါတယ်။ `value` သတ်မှတ်ထားရင် checksum ရဲ့ အစပြု တန်ဖိုးအဖြစ် သုံးပြီး — မဟုတ်ရင် 0 ကို အစပြု တန်ဖိုးအဖြစ် သုံးပါတယ်။

CRC algorithm က checksums တွေ တွက်ချက်ဖို့နဲ့ data ပို့ဆောင်မှုထဲက error တွေကို ရှာဖွေဖို့ ဒီဇိုင်းထုတ်ထားတာပါ။ Cryptographic authentication (လုံခြုံရေး ဆိုင်ရာ အထောက်အထား စိစစ်ခြင်း) အတွက်တော့ မသင့်တော်ပါဘူး။

တခြား APIs တွေနဲ့ ကိုက်ညီစေဖို့ — `data` က string ဆိုရင် — တွက်ချက်မှုမှာ မသုံးခင် UTF-8 နဲ့ encode လုပ်ပါလိမ့်မယ်။ User တွေက checksums တွေကို တွက်ချက်ဖို့နဲ့ ကိုက်ညီမှု စစ်ဆေးဖို့ Node.js ကိုသာ သုံးမယ်ဆိုရင် — default အနေနဲ့ UTF-8 encoding သုံးတဲ့ တခြား APIs တွေနဲ့ ကောင်းကောင်း အလုပ်လုပ်ပါတယ်။

Third-party JavaScript libraries တစ်ချို့က string တစ်ခုအပေါ်မှာ `str.charCodeAt()` ကို အခြေခံပြီး checksum ကို တွက်တာမို့ — browser တွေမှာပါ လည်ပတ်နိုင်ပါတယ်။ User တွေက browser ထဲမှာ ဒီလို library မျိုးနဲ့ တွက်ထားတဲ့ checksum ကို ကိုက်ညီအောင် လုပ်ချင်ရင် — အဲဒီ library က Node.js မှာလည်း လည်ပတ်နိုင်ရင် — Node.js ထဲမှာလည်း အဲဒီ library ကိုပဲ သုံးတာ ပိုကောင်းပါတယ်။ ဒီလို third-party library တစ်ခုက ထုတ်လုပ်တဲ့ checksum နဲ့ ကိုက်ညီအောင် `zlib.crc32()` ကို သုံးကို သုံးရမယ်ဆိုရင်:

1. Library က input အဖြစ် `Uint8Array` ကို လက်ခံရင် — browser ထဲမှာ `TextEncoder` ကို သုံးပြီး string ကို UTF-8 encoding နဲ့ `Uint8Array` အဖြစ် encode လုပ်ကာ — UTF-8 encoded string ကို အခြေခံပြီး browser ထဲမှာ checksum တွက်ပါ။
2. Library က string ကိုသာ လက်ခံပြီး `str.charCodeAt()` ကို အခြေခံပြီး data တွက်ရင် — Node.js ဘက်မှာ `Buffer.from(str, 'utf16le')` ကို သုံးပြီး string ကို buffer အဖြစ် ပြောင်းလဲပါ။

```mjs
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```

```cjs
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```

## `zlib.createBrotliCompress([options])`

* `options` {brotli options}

[`BrotliCompress`][] object အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

## `zlib.createBrotliDecompress([options])`

* `options` {brotli options}

[`BrotliDecompress`][] object အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

## `zlib.createDeflate([options])`

* `options` {zlib options}

[`Deflate`][] object အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

## `zlib.createDeflateRaw([options])`

* `options` {zlib options}

[`DeflateRaw`][] object အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

zlib ကို 1.2.8 ကနေ 1.2.11 ကို upgrade လုပ်တာက raw deflate streams တွေအတွက် `windowBits` ကို 8 လို့ သတ်မှတ်တဲ့အခါ အပြုအမူ ပြောင်းလဲစေခဲ့ပါတယ်။ `windowBits` ကို အစပိုင်းမှာ 8 လို့ သတ်မှတ်ထားရင် zlib က 9 ဆီ အလိုအလျောက် upgrade လုပ်ပေးပါလိမ့်မယ်။ zlib ဗားရှင်း အသစ်တွေက exception တစ်ခုကို throw လုပ်တာမို့ — Node.js က 8 ဆိုတဲ့ တန်ဖိုးကို 9 ဆီ upgrade လုပ်တဲ့ မူလ အပြုအမူကို ပြန်လည် တည်ဆောင်ပေးခဲ့ပါတယ် — `windowBits = 9` ကို zlib ဆီ ပေးလိုက်တာက တကယ်တော့ 8-bit window ကိုသာ ထိရောက်စွာ သုံးတဲ့ compressed stream တစ်ခုကို ဖြစ်ထွန်းစေလို့ပါ။

## `zlib.createGunzip([options])`

* `options` {zlib options}

[`Gunzip`][] object အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

## `zlib.createGzip([options])`

* `options` {zlib options}

[`Gzip`][] object အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။ [ဥပမာ][zlib.createGzip example] ကို ကြည့်ပါ။

## `zlib.createInflate([options])`

* `options` {zlib options}

[`Inflate`][] object အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

## `zlib.createInflateRaw([options])`

* `options` {zlib options}

[`InflateRaw`][] object အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

## `zlib.createUnzip([options])`

* `options` {zlib options}

[`Unzip`][] object အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

## `zlib.createZipArchive(entries[, options])`

> Stability: 1.0 - Early development

ZIP archive API က experimental (စမ်းသပ်ဆဲ) အဆင့်ပါ။ ၎င်းရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို (ဒီ function အပါအဝင်) ပထမဆုံး အကြိမ် သုံးလိုက်တာနဲ့ experimental warning တစ်ခုကို emit လုပ်ပါတယ်; `node:zlib` ကို import လုပ်ရုံနဲ့တော့ မထုတ်ပါဘူး။

* `entries` {Iterable|AsyncIterable} of [`ZipEntry`][]။
* `options` {string|Object} Archive comment တစ်ခုပါ — `{ comment: options }` ရဲ့ အတိုကောက် ပုံစံပါ။
  * `comment` {string} Archive comment တစ်ခုပါ။
  * `baseOffset` {number} Archive က မှတ်တမ်းတင်ထားတဲ့ local/central header offset တိုင်းကို ဒီ bytes အရေအတွက်နဲ့ ရွှေ့ပေးပါတယ် — ဒါကြောင့် ထုတ်လွှတ်လိုက်တဲ့ stream က ၎င်းရဲ့ ရှေ့မှာ တခြားအရာတစ်ခုခု ရေးထားရင်တောင် (ဥပမာ — archive ကို file ရဲ့ အစပိုင်းမှာ မဟုတ်ဘဲ အဲဒီ file ထဲကို အရင်ရေးပြီးသား `baseOffset` bytes တွေရဲ့ နောက်မှာ ဆက်တွဲ ရေးတာမျိုး) မိမိကိုယ်ကို ဖော်ပြနိုင်စွမ်း ရှိနေပါတယ်။ **Default:** `0`။
* Returns: {stream.Readable} Serialize လုပ်ထားတဲ့ archive ရဲ့ byte stream ပါ။

`entries` တွေကို ZIP archive တစ်ခုအဖြစ် serialize လုပ်ပြီး — entry အရေအတွက် သို့မဟုတ် offset သို့မဟုတ် size တစ်ခုခုက classic 32-/16-bit ZIP fields တွေ ထည့်သွင်းနိုင်တာထက် ကျော်လွန်သွားတာနဲ့ Zip64 structures တွေကို အလိုအလျောက် ပြောင်းလဲ အသုံးပြုပါတယ်။ ပြန်ပေးတဲ့ `Readable` က ၎င်း stream လုပ်ပေးတဲ့ {Buffer} chunks တွေကိုပဲ ထုတ်ပေးတဲ့ `AsyncIterable` တစ်ခုလည်း ဖြစ်ပါတယ်။

Entries တွေကို iteration order အတိုင်း ရေးပြီး နာမည်တွေကို ဘယ်အရာကမှ duplicate ဖြုတ်မပေးပါဘူး: နာမည်တူ entries နှစ်ခုကို ထုတ်ပေးတဲ့ iterable တစ်ခုက နှစ်ခုလုံး ပါဝင်တဲ့ archive တစ်ခုကို ထုတ်လုပ်ပြီး — extraction tools အများစုက နောက်မှာ ပေါ်လာတဲ့ entry ကို သိမ်းထားပါတယ်။ [`ZipBuffer`][] နဲ့ [`ZipFile`][] ရဲ့ `add()` methods တွေကတော့ နာမည်အလိုက် entries တွေကို အစားထိုးပါတယ်။

Entries တွေက ပြန်ပေးလိုက်တဲ့ stream ရဲ့ ပိုင်ဆိုင်မှုအောက်မှာ ရှိပါတယ်: archive ကို ထုတ်လုပ်တာနဲ့ entry တစ်ခုချင်းစီကို စားသုံးလိုက်ပြီး — နောက်ပိုင်းမှာ ပြန်လည် သုံးလို့ မရတော့ပါဘူး။ ဒါက streaming entries တွေ ([`zlib.ZipEntry.createStream()`][] ကနေ ရတဲ့ဟာတွေ) အတွက် အရေးကြီးပါတယ် — ၎င်းတို့က file read stream လိုမျိုး အရင်းခံ source တစ်ခုကို ကိုင်ထားလို့ပါ။ ပြန်ပေးလိုက်တဲ့ stream ကို အပြည့်အဝ မစားသုံးခင် ဖျက်ဆီးလိုက်ရင် — ဥပမာ — [`pipeline()`][] ရဲ့ destination ကျရှုံးသွားရင် — ၎င်းက serialize လုပ်နေတဲ့ entry နဲ့ ၎င်းနောက်မှာ queue တက်ကျန်နေတဲ့ entry တိုင်းကို dispose လုပ်လိုက်ပြီး — ၎င်းတို့ရဲ့ sources တွေကို ဖျက်ဆီးလိုက်လို့ descriptor တွေ ယိုစိမ့်မကျန်တော့ပါဘူး။ Stream ကို အဆုံးအထိ စားသုံးပါ — သို့မဟုတ် ဖျက်ဆီးပါ (တိုက်ရိုက်ဖြစ်စေ၊ ကျရှုံးသွားတဲ့ `pipeline()` ကနေဖြစ်စေ၊ `await using` နဲ့ဖြစ်စေ) — ဒီ သန့်ရှင်းရေး အာမခံဖို့အတွက်ပါ; စားသုံးလည်း မခံရဘဲ ဖျက်ဆီးလည်း မခံရတဲ့ stream တစ်ခုက ဘာကိုမှ လွှတ်ပေးလို့ မရပါဘူး။ Archive တစ်ခုဆီ ဘယ်တော့မှ မအပ်လိုက်တဲ့ [`ZipEntry`][] တစ်ခုကိုတော့ `Symbol.dispose` / `Symbol.asyncDispose` နဲ့ တိုက်ရိုက် လွှတ်ပေးနိုင်ပါတယ်။

Archive comment က UTF-8 အဖြစ် encode လုပ်တဲ့အခါ bytes 65,535 ကို ကျော်လွန်ရင် [`ERR_ZIP_ARCHIVE_TOO_LARGE`][] error တစ်ခုကို throw လုပ်ပါတယ်။

```mjs
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Buffer } from 'node:buffer';
import { ZipEntry, createZipArchive } from 'node:zlib';

const entries = [
  await ZipEntry.create('hello.txt', Buffer.from('Hello, world!')),
  await ZipEntry.create('data/', Buffer.alloc(0)),
];
await pipeline(
  createZipArchive(entries, 'created by node:zlib'),
  createWriteStream('archive.zip'),
);
```

```cjs
const { createWriteStream } = require('node:fs');
const { pipeline } = require('node:stream/promises');
const { ZipEntry, createZipArchive } = require('node:zlib');

async function main() {
  const entries = [
    await ZipEntry.create('hello.txt', Buffer.from('Hello, world!')),
    await ZipEntry.create('data/', Buffer.alloc(0)),
  ];
  await pipeline(
    createZipArchive(entries, 'created by node:zlib'),
    createWriteStream('archive.zip'),
  );
}
main();
```

`options.baseOffset` ကို ပေးလိုက်တာက — reader တစ်ယောက်ရဲ့ self-extracting-archive detection ကို အမှီပြုပြီး အဲဒီ shift ကို ကာမိစေစရာ မလိုဘဲ — archive ကို file တစ်ခုတည်းထဲက တခြား content တွေရဲ့ နောက်မှာ နေရာချလိုက်တာနဲ့ ချက်ချင်း အသုံးဝင်တဲ့ archive တစ်ခုကို ထုတ်ပေးပါတယ်:

```mjs
import { createWriteStream } from 'node:fs';
import { Buffer } from 'node:buffer';
import { ZipEntry, createZipArchive } from 'node:zlib';

const prefix = Buffer.from('#!/bin/sh\nexit 0\n');
const entries = [await ZipEntry.create('hello.txt', Buffer.from('Hello, world!'))];
const out = createWriteStream('self-extracting.zip');
out.write(prefix);
createZipArchive(entries, { baseOffset: prefix.byteLength }).pipe(out);
```

## `zlib.createZipArchiveSync(entries[, options])`

> Stability: 1.0 - Early development

ZIP archive API က experimental (စမ်းသပ်ဆဲ) အဆင့်ပါ။ ၎င်းရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို (ဒီ function အပါအဝင်) ပထမဆုံး အကြိမ် သုံးလိုက်တာနဲ့ experimental warning တစ်ခုကို emit လုပ်ပါတယ်; `node:zlib` ကို import လုပ်ရုံနဲ့တော့ မထုတ်ပါဘူး။

* `entries` {Iterable} of [`ZipEntry`][]။
* `options` {string|Object} [`zlib.createZipArchive()`][] ကို ကြည့်ပါ။
* Returns: {Iterator} Serialize လုပ်ထားတဲ့ archive ကို ဖွဲ့စည်းတဲ့ {Buffer} chunks တွေရဲ့ iterator ပါ။

[`zlib.createZipArchive()`][] ရဲ့ synchronous ဗားရှင်းပါ။ Archive တစ်ခုလုံး (deflate passes တွေ အပါအဝင်) ထုတ်လုပ်ပြီးသည်အထိ Node.js event loop နဲ့ နောက်ထပ် JavaScript execution တွေကို ပိတ်ဆို့ (block) ပါတယ်; synchronous execution သင့်လျော်တဲ့ နေရာမှာသာ (ဥပမာ — သက်တမ်းတိုတဲ့ scripts တွေ သို့မဟုတ် startup code တွေ) သုံးပြီး — တုံ့ပြန်မှု မြန်နေဖို့ လိုအပ်တဲ့ code တွေမှာတော့ မသုံးပါနဲ့။ `entries` က သာမန် (synchronous) `Iterable` တစ်ခု ဖြစ်ရပါမယ် — [`zlib.ZipEntry.createStream()`][] နဲ့ ဖန်တီးထားတဲ့ streaming entry တစ်ခုက ၎င်းရဲ့ serialize လုပ်ဖို့ အလှည့် ရောက်လာတဲ့အခါ throw လုပ်ပါတယ် — ၎င်းရဲ့ asynchronous source ကို စုပ်ထုတ်ဖို့ synchronous နည်းလမ်း မရှိလို့ပါ။

[`zlib.createZipArchive()`][] မှာ ရှိသလိုပဲ — entries တွေက ပြန်ပေးလိုက်တဲ့ iterator ရဲ့ ပိုင်ဆိုင်မှုအောက်မှာ ရှိပြီး ပြန်လည် သုံးလို့ မရပါဘူး။ Iteration က စောစော ရပ်သွားရင် — streaming entry တစ်ခုပေါ်မှာ throw လုပ်တာ အပါအဝင် — ၎င်းကို ရပ်တန့်စေတဲ့ entry နဲ့ ၎င်းနောက်မှာ queue တက်ကျန်နေတဲ့ entry တိုင်းကို dispose လုပ်လိုက်ပြီး — ၎င်းတို့ ကိုင်ထားတဲ့ sources တွေကို လွှတ်ပေးပါတယ်။

## `zlib.zipFiles(files[, options])`

> Stability: 1.0 - Early development

ZIP archive API က experimental (စမ်းသပ်ဆဲ) အဆင့်ပါ။ ၎င်းရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို (ဒီ function အပါအဝင်) ပထမဆုံး အကြိမ် သုံးလိုက်တာနဲ့ experimental warning တစ်ခုကို emit လုပ်ပါတယ်; `node:zlib` ကို import လုပ်ရုံနဲ့တော့ မထုတ်ပါဘူး။

* `files` {Iterable} `[sourcePath, entryName]` string အတွဲတွေရဲ့ (Iterable) ပါ။ Array တစ်ခု၊ `Map` တစ်ခု၊ `Object.entries()` ရဲ့ ရလဒ်၊ generator တစ်ခု — ဘယ် iterable မဆို အလုပ်လုပ်ပါတယ်။
* `options` {string|Object}
  * `followSymlinks` {boolean} Symbolic link တစ်ခုကို resolve လုပ်ပြီး — link ကိုယ်တိုင် သိမ်းမယ့်အစား — ၎င်း ညွှန်ပြတဲ့ file ကို archive လုပ်ပါတယ်။ **Default:** `true`။
  * `comment` {string} Archive comment တစ်ခုပါ; string `options` တစ်ခုက `{ comment: options }` ရဲ့ အတိုကောက် ပုံစံပါ။
  * `baseOffset` {number} [`zlib.createZipArchive()`][] ကို ကြည့်ပါ။
* Returns: {stream.Readable} Serialize လုပ်ထားတဲ့ archive ကို ဖွဲ့စည်းတဲ့ {Buffer} chunks တွေရဲ့ (stream.Readable) ပါ။

Disk ပေါ်က files တွေကနေ archive တစ်ခုကို တည်ဆောက်ပါတယ်။ `[sourcePath, entryName]` အတွဲ တစ်ခုချင်းစီအတွက် `sourcePath` ကို ဖတ်ပြီး — file ရဲ့ Unix mode နဲ့ modification time ကို ဖမ်းယူကာ — `entryName` ဆိုတဲ့ နာမည်နဲ့ entry တစ်ခု ထည့်သွင်းပါတယ်။ Directory တစ်ခုက directory entry တစ်ခု ဖြစ်လာပြီး — သာမန် file တစ်ခုရဲ့ contents တွေကို memory ထဲ buffer မလုပ်ဘဲ (a [`zlib.ZipEntry.createStream()`][] entry တစ်ခုအဖြစ်) stream လုပ်ပြီး ထည့်သွင်းပါတယ်။ Directory ရဲ့ အတွင်းအကြောင်းအရာတွေကို ထပ်ဆင့် လျှောက်ကြည့် (recursively walk) မလုပ်ပါဘူး — ထည့်သွင်းချင်တဲ့ path တစ်ခုချင်းစီကို ကိုယ်တိုင် စာရင်းပေးပါ။

`followSymlinks` က `true` (default) ဖြစ်တဲ့အခါ symbolic link တစ်ခုကို resolve လုပ်ပြီး ၎င်းရဲ့ target file အဖြစ် archive လုပ်ပါတယ်; `false` ဖြစ်တဲ့အခါတော့ link ကိုယ်တိုင်ကို — content က target path ဖြစ်တဲ့ symbolic-link entry တစ်ခုအဖြစ် — သိမ်းဆည်းပါတယ် ([`zlib.ZipEntry.createSymlink()`][] ကို ကြည့်ပါ)။

```mjs
import { zipFiles } from 'node:zlib';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

await pipeline(
  zipFiles([
    ['/data/report.pdf', 'report.pdf'],
    ['/data/notes.txt', 'docs/notes.txt'],
  ]),
  createWriteStream('archive.zip'),
);
```

## `zlib.createZstdCompress([options])`

> Stability: 1 - Experimental

* `options` {zstd options}

[`ZstdCompress`][] object အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

## `zlib.createZstdDecompress([options])`

> Stability: 1 - Experimental

* `options` {zstd options}

[`ZstdDecompress`][] object အသစ်တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

## `zlib.getMaxZipContentSize()`

> Stability: 1.0 - Early development

ZIP archive API က experimental (စမ်းသပ်ဆဲ) အဆင့်ပါ။ ၎င်းရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို (ဒီ function အပါအဝင်) ပထမဆုံး အကြိမ် သုံးလိုက်တာနဲ့ experimental warning တစ်ခုကို emit လုပ်ပါတယ်; `node:zlib` ကို import လုပ်ရုံနဲ့တော့ မထုတ်ပါဘူး။

* Returns: {number}

[`zipEntry.content()`][] က explicit `maxSize` မပေးရတဲ့အခါ အသုံးပြုတဲ့ လက်ရှိ default မျက်နှာကျက် (ceiling) ကို bytes နဲ့ ပြန်ပေးပါတယ်။ **Default:** `268435456` (256 MiB)။

## `zlib.setMaxZipContentSize(size)`

> Stability: 1.0 - Early development

ZIP archive API က experimental (စမ်းသပ်ဆဲ) အဆင့်ပါ။ ၎င်းရဲ့ ဘယ်အစိတ်အပိုင်းကိုမဆို (ဒီ function အပါအဝင်) ပထမဆုံး အကြိမ် သုံးလိုက်တာနဲ့ experimental warning တစ်ခုကို emit လုပ်ပါတယ်; `node:zlib` ကို import လုပ်ရုံနဲ့တော့ မထုတ်ပါဘူး။

* `size` {number}

[`zipEntry.content()`][] က explicit `maxSize` option မပေးရတဲ့အခါ အသုံးပြုတဲ့ default မျက်နှာကျက် (ceiling) ကို သတ်မှတ်ပေးပါတယ်။ ဒါက zip bombs တွေကို ကာကွယ်တဲ့ အကာ (guard) တစ်ခုပါ: central directory က ဒီထက် ပိုကြီးတဲ့ member တစ်ခုကို ကြေညာထားတဲ့ archive တစ်ခုကို — ၎င်းအတွက် memory ခွဲဝေမပေးခင် — ပယ်ချလိုက်ပါတယ်။ Streaming reads တွေ ([`zipEntry.contentIterator()`][], [`zipFile.stream()`][]) က ဒီဇိုင်းအရ bounded-memory ဖြစ်ပြီး ဒီ setting ရဲ့ သက်ရောက်မှု မရှိပါဘူး။

## အဆင်ပြေ convenience methods များ (Convenience methods)

ဒါတွေ အားလုံးက {Buffer}, {TypedArray}, {DataView}, {ArrayBuffer} သို့မဟုတ် string တစ်ခုကို ပထမ argument အဖြစ် လက်ခံပြီး — `zlib` classes တွေဆီ options တွေ ပေးဖို့ optional ဖြစ်တဲ့ ဒုတိယ argument တစ်ခုကိုလည်း လက်ခံကာ — ပေးထားတဲ့ callback ကို `callback(error, result)` နဲ့ ခေါ်ပါတယ်။

Method တိုင်းမှာ `*Sync` ဗားရှင်း ရှိပါတယ် — တူညီတဲ့ arguments တွေကို လက်ခံပေမယ့် callback မပါဘဲနဲ့ပါ။

### `zlib.brotliCompress(buffer[, options], callback)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {brotli options}
* `callback` {Function}

### `zlib.brotliCompressSync(buffer[, options])`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {brotli options}

Data chunk တစ်ခုကို [`BrotliCompress`][] နဲ့ compress လုပ်ပါတယ်။

### `zlib.brotliDecompress(buffer[, options], callback)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {brotli options}
* `callback` {Function}

### `zlib.brotliDecompressSync(buffer[, options])`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {brotli options}

Data chunk တစ်ခုကို [`BrotliDecompress`][] နဲ့ decompress လုပ်ပါတယ်။

### `zlib.deflate(buffer[, options], callback)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}
* `callback` {Function}

### `zlib.deflateSync(buffer[, options])`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}

Data chunk တစ်ခုကို [`Deflate`][] နဲ့ compress လုပ်ပါတယ်။

### `zlib.deflateRaw(buffer[, options], callback)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}
* `callback` {Function}

### `zlib.deflateRawSync(buffer[, options])`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}

Data chunk တစ်ခုကို [`DeflateRaw`][] နဲ့ compress လုပ်ပါတယ်။

### `zlib.gunzip(buffer[, options], callback)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}
* `callback` {Function}

### `zlib.gunzipSync(buffer[, options])`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}

Data chunk တစ်ခုကို [`Gunzip`][] နဲ့ decompress လုပ်ပါတယ်။

### `zlib.gzip(buffer[, options], callback)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}
* `callback` {Function}

### `zlib.gzipSync(buffer[, options])`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}

Data chunk တစ်ခုကို [`Gzip`][] နဲ့ compress လုပ်ပါတယ်။

### `zlib.inflate(buffer[, options], callback)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}
* `callback` {Function}

### `zlib.inflateSync(buffer[, options])`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}

Data chunk တစ်ခုကို [`Inflate`][] နဲ့ decompress လုပ်ပါတယ်။

### `zlib.inflateRaw(buffer[, options], callback)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}
* `callback` {Function}

### `zlib.inflateRawSync(buffer[, options])`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}

Data chunk တစ်ခုကို [`InflateRaw`][] နဲ့ decompress လုပ်ပါတယ်။

### `zlib.unzip(buffer[, options], callback)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}
* `callback` {Function}

### `zlib.unzipSync(buffer[, options])`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zlib options}

Data chunk တစ်ခုကို [`Unzip`][] နဲ့ decompress လုပ်ပါတယ်။

### `zlib.zstdCompress(buffer[, options], callback)`

> Stability: 1 - Experimental

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zstd options}
* `callback` {Function}

### `zlib.zstdCompressSync(buffer[, options])`

> Stability: 1 - Experimental

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zstd options}

Data chunk တစ်ခုကို [`ZstdCompress`][] နဲ့ compress လုပ်ပါတယ်။

### `zlib.zstdDecompress(buffer[, options], callback)`

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zstd options}
* `callback` {Function}

### `zlib.zstdDecompressSync(buffer[, options])`

> Stability: 1 - Experimental

* `buffer` {Buffer|TypedArray|DataView|ArrayBuffer|string}
* `options` {zstd options}

Data chunk တစ်ခုကို [`ZstdDecompress`][] နဲ့ decompress လုပ်ပါတယ်။

## Iterable ဒေတာများ ချုံ့ခြင်း (Iterable Compression)

> Stability: 1 - Experimental

`node:zlib/iter` module က [`node:stream/iter`][] iterable streams API နဲ့ တွဲသုံးဖို့ compression နဲ့ decompression transforms တွေကို ပံ့ပိုးပေးပါတယ်။

ဒီ module ကို `--experimental-stream-iter` CLI flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

Algorithm တစ်ခုချင်းစီမှာ async ဗားရှင်း (stateful async generator — [`pull()`][] နဲ့ [`pipeTo()`][] အတွက်) နဲ့ sync ဗားရှင်း (stateful sync generator — `pullSync()` နဲ့ `pipeToSync()` အတွက်) ဆိုပြီး နှစ်မျိုးလုံး ရှိပါတယ်။

Async transforms တွေက compression ကို libuv threadpool ပေါ်မှာ လည်ပတ်စေပြီး — I/O ကို JavaScript execution နဲ့ ထပ်ဆင့် (overlap) လုပ်ပါတယ်။ Sync transforms တွေကတော့ compression ကို main thread ပေါ်မှာ တိုက်ရိုက် လည်ပတ်စေပါတယ်။

> Note: ဒီ transforms တွေရဲ့ defaults တွေက streaming throughput အတွက် ချိန်ညှိထားပြီး — `node:zlib` ထဲက defaults တွေနဲ့ ကွဲပြားပါတယ်။ အထူးသဖြင့် gzip/deflate တို့က level 4 (6 မဟုတ်) နဲ့ memLevel 9 (8 မဟုတ်) ကို default ထားပြီး — Brotli က quality 6 (11 မဟုတ်) ကို default ထားပါတယ်။ ဒီ ရွေးချယ်မှုတွေက သာမန် HTTP server configurations တွေနဲ့ ကိုက်ညီပြီး — compression ratio မှာ အနည်းငယ်သာ လျှော့ချပြီး သိသိသာသာ ပိုမြန်တဲ့ compression ကို ပေးပါတယ်။ Default အားလုံးကို options ကနေတစ်ဆင့် override လုပ်နိုင်ပါတယ်။

```mjs
import { from, pull, bytes, text } from 'node:stream/iter';
import { compressGzip, decompressGzip } from 'node:zlib/iter';

// Async round-trip
const compressed = await bytes(pull(from('hello'), compressGzip()));
const original = await text(pull(from(compressed), decompressGzip()));
console.log(original); // 'hello'
```

```cjs
const { from, pull, bytes, text } = require('node:stream/iter');
const { compressGzip, decompressGzip } = require('node:zlib/iter');

async function run() {
  const compressed = await bytes(pull(from('hello'), compressGzip()));
  const original = await text(pull(from(compressed), decompressGzip()));
  console.log(original); // 'hello'
}

run().catch(console.error);
```

```mjs
import { fromSync, pullSync, textSync } from 'node:stream/iter';
import { compressGzipSync, decompressGzipSync } from 'node:zlib/iter';

// Sync round-trip
const compressed = pullSync(fromSync('hello'), compressGzipSync());
const original = textSync(pullSync(compressed, decompressGzipSync()));
console.log(original); // 'hello'
```

```cjs
const { fromSync, pullSync, textSync } = require('node:stream/iter');
const { compressGzipSync, decompressGzipSync } = require('node:zlib/iter');

const compressed = pullSync(fromSync('hello'), compressGzipSync());
const original = textSync(pullSync(compressed, decompressGzipSync()));
console.log(original); // 'hello'
```

### `compressBrotli([options])`

### `compressBrotliSync([options])`

* `options` {Object}
  * `chunkSize` {number} Output buffer size ပါ။ **Default:** `65536` (64 KB)။
  * `params` {Object} Keys တွေရော values တွေရော `zlib.constants` entries တွေ ဖြစ်တဲ့ key-value object ပါ။ အရေးအကြီးဆုံး compressor parameters တွေကတော့:
    * `BROTLI_PARAM_MODE` -- `BROTLI_MODE_GENERIC` (default)၊ `BROTLI_MODE_TEXT` သို့မဟုတ် `BROTLI_MODE_FONT` ဖြစ်ပါတယ်။
    * `BROTLI_PARAM_QUALITY` -- `BROTLI_MIN_QUALITY` ကနေ `BROTLI_MAX_QUALITY` အထိ အကွာအဝေး ရှိပါတယ်။ **Default:** `6` (`BROTLI_DEFAULT_QUALITY` ဖြစ်တဲ့ 11 မဟုတ်ပါ)။ Quality 6 က streaming အတွက် သင့်လျော်ပြီး — quality 11 က offline/build-time compression အတွက် ရည်ရွယ်ထားတာပါ။
    * `BROTLI_PARAM_SIZE_HINT` -- မျှော်မှန်းထားတဲ့ input size ပါ။ **Default:** `0` (မသိရသေးပါ)။
    * `BROTLI_PARAM_LGWIN` -- window size (log2) ပါ။ **Default:** `20` (1 MB)။ Brotli library ရဲ့ default က 22 (4 MB) ဖြစ်ပြီး — လျှော့ချထားတဲ့ ဒီ default က streaming workloads တွေအတွက် compression အပေါ် သိသာတဲ့ သက်ရောက်မှု မရှိဘဲ memory ကို သက်သာစေပါတယ်။
    * `BROTLI_PARAM_LGBLOCK` -- input block size (log2) ပါ။ စာရင်း အပြည့်အစုံအတွက် zlib documentation ထဲက [Brotli compressor options][] ကို ကြည့်ပါ။
  * `dictionary` {Buffer|TypedArray|DataView}
* Returns: {Object} Stateful transform တစ်ခုပါ။

Brotli compression transform တစ်ခုကို ဖန်တီးပါတယ်။ Output က `zlib.brotliDecompress()` နဲ့ `decompressBrotli()`/`decompressBrotliSync()` တို့နဲ့ လိုက်ဖက်ညီပါတယ်။

### `compressDeflate([options])`

### `compressDeflateSync([options])`

* `options` {Object}
  * `chunkSize` {number} Output buffer size ပါ။ **Default:** `65536` (64 KB)။
  * `level` {number} Compression level (`0`-`9`) ပါ။ **Default:** `4`။
  * `windowBits` {number} **Default:** `Z_DEFAULT_WINDOWBITS` (15)။
  * `memLevel` {number} **Default:** `9`။
  * `strategy` {number} **Default:** `Z_DEFAULT_STRATEGY`။
  * `dictionary` {Buffer|TypedArray|DataView}
* Returns: {Object} Stateful transform တစ်ခုပါ။

Deflate compression transform တစ်ခုကို ဖန်တီးပါတယ်။ Output က `zlib.inflate()` နဲ့ `decompressDeflate()`/`decompressDeflateSync()` တို့နဲ့ လိုက်ဖက်ညီပါတယ်။

### `compressGzip([options])`

### `compressGzipSync([options])`

* `options` {Object}
  * `chunkSize` {number} Output buffer size ပါ။ **Default:** `65536` (64 KB)။
  * `level` {number} Compression level (`0`-`9`) ပါ။ **Default:** `4`။
  * `windowBits` {number} **Default:** `Z_DEFAULT_WINDOWBITS` (15)။
  * `memLevel` {number} **Default:** `9`။
  * `strategy` {number} **Default:** `Z_DEFAULT_STRATEGY`။
  * `dictionary` {Buffer|TypedArray|DataView}
* Returns: {Object} Stateful transform တစ်ခုပါ။

Gzip compression transform တစ်ခုကို ဖန်တီးပါတယ်။ Output က `zlib.gunzip()` နဲ့ `decompressGzip()`/`decompressGzipSync()` တို့နဲ့ လိုက်ဖက်ညီပါတယ်။

### `compressZstd([options])`

### `compressZstdSync([options])`

* `options` {Object}
  * `chunkSize` {number} Output buffer size ပါ။ **Default:** `65536` (64 KB)။
  * `params` {Object} Keys တွေရော values တွေရော `zlib.constants` entries တွေ ဖြစ်တဲ့ key-value object ပါ။ အရေးအကြီးဆုံး compressor parameters တွေကတော့:
    * `ZSTD_c_compressionLevel` -- **Default:** `ZSTD_CLEVEL_DEFAULT` (3)။
    * `ZSTD_c_checksumFlag` -- checksum တစ်ခု ထုတ်ပေးပါတယ်။ **Default:** `0`။
    * `ZSTD_c_strategy` -- compression strategy ပါ။ တန်ဖိုးတွေထဲမှာ `ZSTD_fast`, `ZSTD_dfast`, `ZSTD_greedy`, `ZSTD_lazy`, `ZSTD_lazy2`, `ZSTD_btlazy2`, `ZSTD_btopt`, `ZSTD_btultra`, `ZSTD_btultra2` တို့ ပါဝင်ပါတယ်။ စာရင်း အပြည့်အစုံအတွက် zlib documentation ထဲက [Zstd compressor options][] ကို ကြည့်ပါ။
  * `pledgedSrcSize` {number} Non-negative safe integer တစ်ခုအနေနဲ့ မျှော်မှန်းထားတဲ့ uncompressed size ပါ (optional hint)။
  * `dictionary` {Buffer|TypedArray|DataView}
* Returns: {Object} Stateful transform တစ်ခုပါ။

Zstandard compression transform တစ်ခုကို ဖန်တီးပါတယ်။ Output က `zlib.zstdDecompress()` နဲ့ `decompressZstd()`/`decompressZstdSync()` တို့နဲ့ လိုက်ဖက်ညီပါတယ်။

### `decompressBrotli([options])`

### `decompressBrotliSync([options])`

* `options` {Object}
  * `chunkSize` {number} Output buffer size ပါ။ **Default:** `65536` (64 KB)။
  * `params` {Object} Keys တွေရော values တွေရော `zlib.constants` entries တွေ ဖြစ်တဲ့ key-value object ပါ။ ရနိုင်တဲ့ decompressor parameters တွေကတော့:
    * `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION` -- internal memory ခွဲဝေမှုကို သက်ရောက်တဲ့ boolean flag ပါ။
    * `BROTLI_DECODER_PARAM_LARGE_WINDOW` -- "Large Window Brotli" mode ကို ဖွင့်ပေးတဲ့ boolean flag ပါ ([RFC 7932][] မှာ စံသတ်မှတ်ထားတဲ့ Brotli format နဲ့ လိုက်ဖက်မှု မရှိပါဘူး)။ အသေးစိတ်အတွက် zlib documentation ထဲက [Brotli decompressor options][] ကို ကြည့်ပါ။
  * `dictionary` {Buffer|TypedArray|DataView}
* Returns: {Object} Stateful transform တစ်ခုပါ။

Brotli decompression transform တစ်ခုကို ဖန်တီးပါတယ်။

### `decompressDeflate([options])`

### `decompressDeflateSync([options])`

* `options` {Object}
  * `chunkSize` {number} Output buffer size ပါ။ **Default:** `65536` (64 KB)။
  * `windowBits` {number} **Default:** `Z_DEFAULT_WINDOWBITS` (15)။
  * `dictionary` {Buffer|TypedArray|DataView}
* Returns: {Object} Stateful transform တစ်ခုပါ။

Deflate decompression transform တစ်ခုကို ဖန်တီးပါတယ်။

### `decompressGzip([options])`

### `decompressGzipSync([options])`

* `options` {Object}
  * `chunkSize` {number} Output buffer size ပါ။ **Default:** `65536` (64 KB)။
  * `windowBits` {number} **Default:** `Z_DEFAULT_WINDOWBITS` (15)။
  * `dictionary` {Buffer|TypedArray|DataView}
* Returns: {Object} Stateful transform တစ်ခုပါ။

Gzip decompression transform တစ်ခုကို ဖန်တီးပါတယ်။

### `decompressZstd([options])`

### `decompressZstdSync([options])`

* `options` {Object}
  * `chunkSize` {number} Output buffer size ပါ။ **Default:** `65536` (64 KB)။
  * `params` {Object} Keys တွေရော values တွေရော `zlib.constants` entries တွေ ဖြစ်တဲ့ key-value object ပါ။ ရနိုင်တဲ့ decompressor parameters တွေကတော့:
    * `ZSTD_d_windowLogMax` -- decompressor က ခွဲဝေပေးမယ့် အမြင့်ဆုံး window size (log2) ပါ။ Malicious input တွေကို ဆန့်ကျင်ပြီး memory အသုံးပြုမှုကို ကန့်သတ်ပေးပါတယ်။ အသေးစိတ်အတွက် zlib documentation ထဲက [Zstd decompressor options][] ကို ကြည့်ပါ။
  * `dictionary` {Buffer|TypedArray|DataView}
* Returns: {Object} Stateful transform တစ်ခုပါ။

Zstandard decompression transform တစ်ခုကို ဖန်တီးပါတယ်။

[Brotli compressor options]: #compressor-options
[Brotli decompressor options]: #decompressor-options
[Brotli parameters]: #brotli-constants
[Cyclic redundancy check]: https://en.wikipedia.org/wiki/Cyclic_redundancy_check
[Memory usage tuning]: #memory-usage-tuning
[RFC 7932]: https://www.rfc-editor.org/rfc/rfc7932.html
[Streams API]: stream.md
[Zstd compressor options]: #compressor-options-1
[Zstd decompressor options]: #decompressor-options-1
[Zstd parameters]: #zstd-constants
[`.flush()`]: #zlibflushkind-callback
[`Accept-Encoding`]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
[`BrotliCompress`]: #class-zlibbrotlicompress
[`BrotliDecompress`]: #class-zlibbrotlidecompress
[`Content-Encoding`]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
[`DeflateRaw`]: #class-zlibdeflateraw
[`Deflate`]: #class-zlibdeflate
[`ERR_INVALID_STATE`]: errors.md#err_invalid_state
[`ERR_ZIP_ARCHIVE_TOO_LARGE`]: errors.md#err_zip_archive_too_large
[`ERR_ZIP_ENTRY_CORRUPT`]: errors.md#err_zip_entry_corrupt
[`ERR_ZIP_ENTRY_NOT_FOUND`]: errors.md#err_zip_entry_not_found
[`ERR_ZIP_ENTRY_TOO_LARGE`]: errors.md#err_zip_entry_too_large
[`ERR_ZIP_INVALID_ARCHIVE`]: errors.md#err_zip_invalid_archive
[`ERR_ZIP_NOT_WRITABLE`]: errors.md#err_zip_not_writable
[`ERR_ZIP_UNSUPPORTED_FEATURE`]: errors.md#err_zip_unsupported_feature
[`Gunzip`]: #class-zlibgunzip
[`Gzip`]: #class-zlibgzip
[`InflateRaw`]: #class-zlibinflateraw
[`Inflate`]: #class-zlibinflate
[`Unzip`]: #class-zlibunzip
[`ZipBuffer`]: #class-zlibzipbuffer
[`ZipEntry`]: #class-zlibzipentry
[`ZipFile`]: #class-zlibzipfile
[`ZlibBase`]: #class-zlibzlibbase
[`ZstdCompress`]: #class-zlibzstdcompress
[`ZstdDecompress`]: #class-zlibzstddecompress
[`buffer.kMaxLength`]: buffer.md#bufferkmaxlength
[`deflateInit2` and `inflateInit2`]: https://zlib.net/manual.html#Advanced
[`node:stream/iter`]: stream_iter.md
[`pipeTo()`]: stream_iter.md#pipetosource-transforms-writer-options
[`pipeline()`]: stream.md#streampipelinesource-transforms-destination-callback
[`pull()`]: stream_iter.md#pullsource-transforms-options
[`stream.Transform`]: stream.md#class-streamtransform
[`zipBuffer.add()`]: #zipbufferaddfilename-data-options
[`zipBuffer.addSync()`]: #zipbufferaddsyncfilename-data-options
[`zipBuffer.comment`]: #zipbuffercomment
[`zipBuffer.toBuffer()`]: #zipbuffertobufferoptions
[`zipBuffer.toBufferSync()`]: #zipbuffertobuffersyncoptions
[`zipEntry.content()`]: #zipentrycontentoptions
[`zipEntry.contentIterator()`]: #zipentrycontentiteratoroptions
[`zipEntry.contentSync()`]: #zipentrycontentsyncoptions
[`zipEntry.isDirectory`]: #zipentryisdirectory
[`zipEntry.isSymlink`]: #zipentryissymlink
[`zipEntry.modified`]: #zipentrymodified
[`zipEntry.nameBuffer`]: #zipentrynamebuffer
[`zipEntry.name`]: #zipentryname
[`zipEntry.rawContent`]: #zipentryrawcontent
[`zipFile.add()`]: #zipfileaddfilename-data-options
[`zipFile.addEntry()`]: #zipfileaddentryentry
[`zipFile.close()`]: #zipfileclose
[`zipFile.closeSync()`]: #zipfileclosesync
[`zipFile.comment`]: #zipfilecomment
[`zipFile.compact()`]: #zipfilecompactcomment
[`zipFile.delete()`]: #zipfiledeletename
[`zipFile.entries()`]: #zipfileentries
[`zipFile.forEach()`]: #zipfileforeachcallback-thisarg
[`zipFile.get()`]: #zipfilegetname
[`zipFile.stream()`]: #zipfilestreamname-options
[`zipFile.values()`]: #zipfilevalues
[`zlib.ZipEntry.create()`]: #static-method-zlibzipentrycreatefilename-data-options
[`zlib.ZipEntry.createStream()`]: #static-method-zlibzipentrycreatestreamfilename-source-options
[`zlib.ZipEntry.createSymlink()`]: #static-method-zlibzipentrycreatesymlinkfilename-target-options
[`zlib.ZipEntry.createSync()`]: #static-method-zlibzipentrycreatesyncfilename-data-options
[`zlib.ZipFile.open()`]: #static-method-zlibzipfileopenfilename-options
[`zlib.createZipArchive()`]: #zlibcreateziparchiveentries-options
[`zlib.createZipArchiveSync()`]: #zlibcreateziparchivesyncentries-options
[`zlib.getMaxZipContentSize()`]: #zlibgetmaxzipcontentsize
[convenience methods]: #convenience-methods
[zlib documentation]: https://zlib.net/manual.html#Constants
[zlib.createGzip example]: #zlib
