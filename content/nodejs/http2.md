---
title: "HTTP/2"
description: "node:http2 module — HTTP/2 protocol ၏ implementation — http2.createServer/connect, Http2Server/Http2SecureServer, Http2Session, Http2Stream, Http2ServerRequest/Response, headers object & pseudo-headers, compatibility API, performance metrics, :authority နဲ့ host မှတ်စု စသည်"
order: 149
source: "https://nodejs.org/api/http2.html"
status: translated
updated: 2026-09-05
---

> Stability: 2 - Stable

`node:http2` module က [HTTP/2][] protocol ရဲ့ implementation (အကောင်အထည်ဖော်မှု) တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ ၎င်းကို အောက်ပါအတိုင်း ဝင်ရောက်သုံးစွဲနိုင်ပါတယ်:

```js
const http2 = require('node:http2');
```

## Crypto support မရနိုင်ခြင်း စစ်ဆေးခြင်း (Determining if crypto support is unavailable)

Node.js ကို `node:crypto` module အတွက် support မပါဝင်ဘဲ build လုပ်ထားတာမျိုး ဖြစ်နိုင်ပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ `node:http2` ကနေ `import` လုပ်ဖို့ ကြိုးစားတာ (သို့) `require('node:http2')` ကို ခေါ်လိုက်ရင် error တစ်ခု throw လုပ်ခံရပါလိမ့်မယ်။

CommonJS သုံးတဲ့အခါ throw လုပ်လိုက်တဲ့ error ကို try/catch သုံးပြီး ဖမ်းလို့ရပါတယ်:

```cjs
let http2;
try {
  http2 = require('node:http2');
} catch (err) {
  console.error('http2 support is disabled!');
}
```

Lexical ESM `import` keyword ကို သုံးတဲ့အခါမှာတော့ — module ကို load လုပ်ဖို့ မကြိုးစားခင် (ဥပမာ — preload module တစ်ခုကို သုံးပြီး) `process.on('uncaughtException')` အတွက် handler တစ်ခုကို ကြိုတင် register လုပ်ထားမှသာ error ကို ဖမ်းနိုင်မှာ ဖြစ်ပါတယ်။

ESM သုံးတဲ့အခါ code က crypto support မဖွင့်ထားတဲ့ Node.js build ပေါ်မှာ run ခံရနိုင်တဲ့ အလားအလာ ရှိနေရင် — lexical `import` keyword အစား [`import()`][] function ကို သုံးဖို့ စဉ်းစားပါ:

```mjs
let http2;
try {
  http2 = await import('node:http2');
} catch (err) {
  console.error('http2 support is disabled!');
}
```

## Core API (အဓိက API)

Core API က HTTP/2 protocol features တွေအတွက် support ကို အဓိကထား ဒီဇိုင်းဆွဲထားတဲ့ low-level interface တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ ဒါက ရှိပြီးသား [HTTP/1][] module API နဲ့ လိုက်ဖက်ညီဖို့အတွက် ဒီဇိုင်းဆွဲထားတာ _မဟုတ်ပါဘူး_။ ဒါပေမယ့် [Compatibility API][] ကတော့ အဲဒါအတွက် ဖြစ်ပါတယ်။

`http2` Core API က `http` API ထက် client နဲ့ server ကြားမှာ အများကြီး ပိုပြီး symmetric (အချိုးကျ) ဖြစ်ပါတယ်။ ဥပမာ — `'error'`, `'connect'` နဲ့ `'stream'` လိုမျိုး events အများစုကို client-side code ရော server-side code ပါ emit လုပ်နိုင်ပါတယ်။

### Server ဘက်မှ ဥပမာ (Server-side example)

အောက်မှာ Core API ကို သုံးထားတဲ့ ရိုးရှင်းတဲ့ HTTP/2 server တစ်ခုကို ဖော်ပြပါတယ်။ [unencrypted HTTP/2][HTTP/2 Unencrypted] (စာဝှက်မထားတဲ့ HTTP/2) ကို support လုပ်တဲ့ browsers တွေ မသိရှိရသေးတာမို့ — browser clients တွေနဲ့ ဆက်သွယ်တဲ့အခါ [`http2.createSecureServer()`][] ကို သုံးစွဲဖို့ လိုအပ်ပါတယ်။

```mjs
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const server = createSecureServer({
  key: readFileSync('localhost-privkey.pem'),
  cert: readFileSync('localhost-cert.pem'),
});

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```cjs
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
});
server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

ဒီဥပမာအတွက် certificate နဲ့ key ကို ထုတ်လုပ်ဖို့ အောက်ပါအတိုင်း run လုပ်ပါ:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```

### Client ဘက်မှ ဥပမာ (Client-side example)

အောက်မှာ HTTP/2 client တစ်ခုကို ဖော်ပြပါတယ်:

```mjs
import { connect } from 'node:http2';
import { readFileSync } from 'node:fs';

const client = connect('https://localhost:8443', {
  ca: readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```

```cjs
const http2 = require('node:http2');
const fs = require('node:fs');

const client = http2.connect('https://localhost:8443', {
  ca: fs.readFileSync('localhost-cert.pem'),
});
client.on('error', (err) => console.error(err));

const req = client.request({ ':path': '/' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();
```

### Class: `Http2Session`

* Extends: {EventEmitter}

`http2.Http2Session` class ရဲ့ instances တွေက HTTP/2 client တစ်ခုနဲ့ server တစ်ခုကြားမှာ ရှိတဲ့ active communications session (ဆက်သွယ်ရေး session) တစ်ခုကို ကိုယ်စားပြုပါတယ်။ ဒီ class ရဲ့ instances တွေကို user code ကနေ တိုက်ရိုက် ဆောက်လုပ်ဖို့ (construct) ရည်ရွယ်ထားတာ _မဟုတ်ပါဘူး_။

`Http2Session` instance တစ်ခုချင်းစီက server အဖြစ် လည်ပတ်နေလား client အဖြစ် လည်ပတ်နေလားဆိုတာပေါ် မူတည်ပြီး နည်းနည်းလေး ကွဲပြားတဲ့ အပြုအမူတွေကို ပြသပါတယ်။ `http2session.type` property ကို သုံးပြီး `Http2Session` တစ်ခု ဘယ် mode နဲ့ လည်ပတ်နေလဲဆိုတာကို ဆုံးဖြတ်နိုင်ပါတယ်။ Server ဘက်မှာ user code က `Http2Session` object နဲ့ တိုက်ရိုက် အလုပ်လုပ်ရတဲ့ အခါအခွင့်အရေးက ရှားပါတယ် — လုပ်ဆောင်မှု အများစုကို ပုံမှန်အားဖြင့် `Http2Server` သို့မဟုတ် `Http2Stream` objects တွေနဲ့ အပြန်အလှန် ဆက်သွယ်မှုကနေ ဆောင်ရွက်လေ့ ရှိပါတယ်။

User code က `Http2Session` instances တွေကို တိုက်ရိုက် ဖန်တီးမှာ မဟုတ်ပါဘူး။ Server-side `Http2Session` instances တွေကို HTTP/2 connection အသစ်တစ်ခု လက်ခံရရှိတဲ့အခါ `Http2Server` instance က ဖန်တီးပေးပါတယ်။ Client-side `Http2Session` instances တွေကိုတော့ `http2.connect()` method ကို သုံးပြီး ဖန်တီးပါတယ်။

#### `Http2Session` and sockets

`Http2Session` instance တိုင်းကို ဖန်တီးတဲ့အခါ [`net.Socket`][] (သို့) [`tls.TLSSocket`][] တစ်ခုတည်းနဲ့ တိကျစွာ ဆက်စပ်ပေးပါတယ်။ `Socket` သို့မဟုတ် `Http2Session` ထဲက တစ်ခုခုကို destroy လုပ်လိုက်ရင် — နှစ်ခုလုံး destroy လုပ်ခံရပါလိမ့်မယ်။

HTTP/2 protocol က ချမှတ်ထားတဲ့ တိကျတဲ့ serialization နဲ့ processing လိုအပ်ချက်တွေကြောင့် — `Http2Session` တစ်ခုနဲ့ ချိတ်ထားတဲ့ (bound) `Socket` instance တစ်ခုကနေ data ဖတ်တာ (သို့) ရေးသားတာကို user code အနေနဲ့ မပြုလုပ်ဖို့ အကြံပြုပါတယ်။ အဲဒီလို လုပ်လိုက်ရင် HTTP/2 session ကို မသေချာတဲ့ (indeterminate) အခြေအနေတစ်ခုထဲ ရောက်သွားစေပြီး — session ရော socket ပါ အသုံးမပြုနိုင်တော့အောင် ဖြစ်စေနိုင်ပါတယ်။

`Socket` တစ်ခုက `Http2Session` တစ်ခုနဲ့ ချိတ်လိုက်ပြီဆိုရင် — user code က `Http2Session` ရဲ့ API ကိုသာ တစ်ခုတည်း မှီခိုအားထားသင့်ပါတယ်။

#### Event: `'close'`

`'close'` event က `Http2Session` ကို destroy လုပ်လိုက်တာနဲ့ emit လုပ်ပါတယ်။ ၎င်းရဲ့ listener က argument တွေ ဘာမှ မျှော်လင့်မထားပါဘူး။

#### Event: `'connect'`

* `session` {Http2Session}
* `socket` {net.Socket}

`'connect'` event က `Http2Session` က remote peer ဆီကို အောင်မြင်စွာ ချိတ်ဆက်ပြီး — ဆက်သွယ်မှု စတင်နိုင်တဲ့အခါ emit လုပ်ပါတယ်။

User code က ပုံမှန်အားဖြင့် ဒီ event ကို တိုက်ရိုက် နားထောင်လေ့ မရှိပါဘူး။

#### Event: `'error'`

* `error` {Error}

`'error'` event က `Http2Session` တစ်ခုကို process လုပ်နေစဉ်အတွင်း error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ emit လုပ်ပါတယ်။

#### Event: `'frameError'`

* `type` {integer} Frame type ပါ။
* `code` {integer} Error code ပါ။
* `id` {integer} Stream id ပါ (frame က stream တစ်ခုနဲ့ ဆက်စပ်မှု မရှိရင် `0`)။

`'frameError'` event က session ပေါ်မှာ frame တစ်ခု ပို့ဖို့ ကြိုးစားနေစဉ် error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ emit လုပ်ပါတယ်။ ပို့လို့ မရခဲ့တဲ့ frame က `Http2Stream` တစ်ခုခုနဲ့ ဆက်စပ်နေရင် — အဲဒီ `Http2Stream` ပေါ်မှာ `'frameError'` event တစ်ခု emit လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ပါတယ်။

`'frameError'` event က stream တစ်ခုနဲ့ ဆက်စပ်နေရင် — `'frameError'` event အပြီးမှာ ချက်ချင်း stream ကို ပိတ်ပြီး destroy လုပ်ပါလိမ့်မယ်။ Event က stream တစ်ခုနဲ့ ဆက်စပ်မှု မရှိဘူးဆိုရင် — `'frameError'` event အပြီးမှာ ချက်ချင်း `Http2Session` ကို ပိတ်လိုက် (shut down) ပါလိမ့်မယ်။

#### Event: `'goaway'`

* `errorCode` {number} `GOAWAY` frame ထဲမှာ သတ်မှတ်ထားတဲ့ HTTP/2 error code ပါ။
* `lastStreamID` {number} Remote peer က အောင်မြင်စွာ process လုပ်ခဲ့တဲ့ နောက်ဆုံး stream ရဲ့ ID ပါ (ID တစ်ခုမှ သတ်မှတ်မထားရင် `0`)။
* `opaqueData` {Buffer} `GOAWAY` frame ထဲမှာ ထပ်ဆောင်း opaque data (ဖော်ထုတ်၍ မရသော data) ပါဝင်ခဲ့ရင် — အဲဒီ data ပါဝင်တဲ့ `Buffer` instance တစ်ခုကို ဖြတ်သန်းပေးပါလိမ့်မယ်။

`'goaway'` event က `GOAWAY` frame တစ်ခု လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။

`'goaway'` event ကို emit လုပ်လိုက်တဲ့အခါ `Http2Session` instance ကို အလိုအလျောက် ပိတ်လိုက်ပါလိမ့်မယ်။

#### Event: `'localSettings'`

* `settings` {HTTP/2 Settings Object} လက်ခံရရှိထားတဲ့ `SETTINGS` frame ရဲ့ မိတ္တူ (copy) တစ်ခုပါ။

`'localSettings'` event က acknowledgment (အတည်ပြုချက်) `SETTINGS` frame တစ်ခု လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။

`http2session.settings()` ကို သုံးပြီး settings အသစ်တွေ တင်သွင်းတဲ့အခါ — `'localSettings'` event ကို emit မလုပ်မချင်း — ပြုပြင်ထားတဲ့ settings တွေက အကျိုးသက်ရောက်မှု မရှိသေးပါဘူး။

```js
session.settings({ enablePush: false });

session.on('localSettings', (settings) => {
  /* Use the new settings */
});
```

#### Event: `'ping'`

* `payload` {Buffer} `PING` frame ရဲ့ 8-byte payload ပါ

`'ping'` event က ချိတ်ဆက်ထားတဲ့ peer ဆီကနေ `PING` frame တစ်ခု လက်ခံရရှိတိုင်း emit လုပ်ပါတယ်။

#### Event: `'remoteSettings'`

* `settings` {HTTP/2 Settings Object} လက်ခံရရှိထားတဲ့ `SETTINGS` frame ရဲ့ မိတ္တူ (copy) တစ်ခုပါ။

`'remoteSettings'` event က ချိတ်ဆက်ထားတဲ့ peer ဆီကနေ `SETTINGS` frame အသစ်တစ်ခု လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။

```js
session.on('remoteSettings', (settings) => {
  /* Use the new settings */
});
```

#### Event: `'stream'`

* `stream` {Http2Stream} Stream ဆီကို ရည်ညွှန်းချက် (reference) တစ်ခုပါ
* `headers` {HTTP/2 Headers Object} Headers တွေကို ဖော်ပြတဲ့ object တစ်ခုပါ
* `flags` {number} ဆက်စပ်နေတဲ့ numeric flags တွေပါ
* `rawHeaders` {HTTP/2 Raw Headers} Raw headers တွေ ပါဝင်တဲ့ array တစ်ခုပါ

`'stream'` event က `Http2Stream` အသစ်တစ်ခု ဖန်တီးလိုက်တဲ့အခါ emit လုပ်ပါတယ်။

```js
session.on('stream', (stream, headers, flags) => {
  const method = headers[':method'];
  const path = headers[':path'];
  // ...
  stream.respond({
    ':status': 200,
    'content-type': 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

Server ဘက်မှာ user code က ပုံမှန်အားဖြင့် ဒီ event ကို တိုက်ရိုက် နားထောင်လေ့ မရှိပါဘူး — အဲဒီအစား `http2.createServer()` နဲ့ `http2.createSecureServer()` တို့က အသီးသီး ပြန်ပေးတဲ့ `net.Server` (သို့) `tls.Server` instances တွေက emit လုပ်တဲ့ `'stream'` event အတွက် handler တစ်ခုကို အောက်က ဥပမာမှာ ပြထားသလို မှတ်ပုံတင်လေ့ ရှိပါတယ်:

```mjs
import { createServer } from 'node:http2';

// Create an unencrypted HTTP/2 server
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```cjs
const http2 = require('node:http2');

// Create an unencrypted HTTP/2 server
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.on('error', (error) => console.error(error));
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

HTTP/2 streams တွေနဲ့ network sockets တွေက 1:1 ကိုက်ညီမှု မရှိပေမယ့် — network error တစ်ခုက stream တစ်ခုချင်းစီကို destroy လုပ်ပါလိမ့်မယ် — အပေါ်မှာ ပြထားသလို stream အဆင့်မှာ ကိုင်တွယ်ရပါမယ်။

#### Event: `'timeout'`

ဒီ `Http2Session` အတွက် timeout ကာလကို သတ်မှတ်ဖို့ `http2session.setTimeout()` method ကို သုံးပြီးနောက် — သတ်မှတ်ထားတဲ့ millisecond အရေအတွက် ကုန်ဆုံးတဲ့အထိ `Http2Session` ပေါ်မှာ လှုပ်ရှားမှု (activity) တစ်စုံတစ်ရာ မရှိဘူးဆိုရင် — `'timeout'` event ကို emit လုပ်ပါတယ်။ ၎င်းရဲ့ listener က argument တွေ ဘာမှ မျှော်လင့်မထားပါဘူး။

```js
session.setTimeout(2000);
session.on('timeout', () => { /* .. */ });
```

#### `http2session.alpnProtocol`

* Type: {string|undefined}

`Http2Session` က socket တစ်ခုဆီကို မချိတ်ဆက်ရသေးဘူးဆိုရင် တန်ဖိုးက `undefined` ဖြစ်ပြီး — `Http2Session` က `TLSSocket` တစ်ခုနဲ့ မချိတ်ဆက်ထားဘူးဆိုရင် `h2c` ဖြစ်ကာ — ချိတ်ဆက်ထားတဲ့ `TLSSocket` ရဲ့ ကိုယ်ပိုင် `alpnProtocol` property ရဲ့ တန်ဖိုးကိုတော့ ပြန်ပေးပါလိမ့်မယ်။

#### `http2session.close([callback])`

* `callback` {Function}

`Http2Session` ကို ချောမွေ့စွာ (gracefully) ပိတ်ပေးပြီး — ရှိပြီးသား streams တွေကို ကိုယ်တိုင် ပြီးဆုံးခွင့် ပြုကာ — `Http2Stream` instances အသစ်တွေ ဖန်တီးခံရခြင်းကို တားဆီးပေးပါတယ်။ ပိတ်လိုက်ပြီးနောက်မှာ — open `Http2Stream` instances တွေ မရှိတော့ဘူးဆိုရင် — `http2session.destroy()` ကို ခေါ်လိုက်ဖို့ _ဖြစ်နိုင်သည်_ (might)။

သတ်မှတ်ပေးထားရင် `callback` function ကို `'close'` event အတွက် handler တစ်ခုအနေနဲ့ မှတ်ပုံတင်ပါတယ်။

#### `http2session.closed`

* Type: {boolean}

ဒီ `Http2Session` instance ကို ပိတ်လိုက်ပြီးဆိုရင် `true` — မဟုတ်ရင် `false` ဖြစ်ပါတယ်။

#### `http2session.connecting`

* Type: {boolean}

ဒီ `Http2Session` instance က ချိတ်ဆက်နေဆဲ ဆိုရင် `true` ဖြစ်ပြီး — `connect` event ကို emit လုပ်ခြင်း နဲ့/သို့မဟုတ် `http2.connect` callback ကို ခေါ်ခြင်း မတိုင်ခင် — `false` အဖြစ် သတ်မှတ်ခံရပါလိမ့်မယ်။

#### `http2session.destroy([error][, code])`

* `error` {Error} `Http2Session` ကို error တစ်ခုကြောင့် destroy လုပ်နေတာဆိုရင် `Error` object တစ်ခုပါ။
* `code` {number} နောက်ဆုံး `GOAWAY` frame ထဲမှာ ပို့ဖို့ HTTP/2 error code ပါ။ သတ်မှတ်မထားပဲ `error` က `undefined` မဟုတ်ဘူးဆိုရင် default က `INTERNAL_ERROR` ဖြစ်ပြီး — မဟုတ်ရင် `NO_ERROR` ကို default အနေနဲ့ သုံးပါတယ်။

`Http2Session` နဲ့ ဆက်စပ်နေတဲ့ `net.Socket` (သို့) `tls.TLSSocket` ကို ချက်ချင်း အဆုံးသတ် (terminate) လုပ်ပါတယ်။

Destroy လုပ်လိုက်တာနဲ့ `Http2Session` က `'close'` event ကို emit လုပ်ပါလိမ့်မယ်။ `error` က `undefined` မဟုတ်ဘူးဆိုရင် — `'close'` event မတိုင်ခင် ချက်ချင်း `'error'` event တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။

`Http2Session` နဲ့ ဆက်စပ်နေတဲ့ ဖွင့်ထားဆဲ (open) `Http2Streams` တွေ ကျန်ရှိနေသေးရင် — အဲဒါတွေကိုလည်း destroy လုပ်ပါလိမ့်မယ်။

#### `http2session.destroyed`

* Type: {boolean}

ဒီ `Http2Session` instance ကို destroy လုပ်ပြီး နောက်ထပ် သုံးစွဲလို့ မရတော့ဘူးဆိုရင် `true` — မဟုတ်ရင် `false` ဖြစ်ပါတယ်။

#### `http2session.encrypted`

* Type: {boolean|undefined}

`Http2Session` ရဲ့ session socket က မချိတ်ဆက်ရသေးဘူးဆိုရင် တန်ဖိုးက `undefined` ဖြစ်ပြီး — `Http2Session` က `TLSSocket` တစ်ခုနဲ့ ချိတ်ဆက်ထားရင် `true` — အခြား socket (သို့) stream အမျိုးအစား တစ်ခုခုနဲ့ ချိတ်ဆက်ထားရင်တော့ `false` ဖြစ်ပါတယ်။

#### `http2session.goaway([code[, lastStreamID[, opaqueData]]])`

* `code` {number} HTTP/2 error code တစ်ခုပါ
* `lastStreamID` {number} နောက်ဆုံး process လုပ်ခဲ့တဲ့ `Http2Stream` ရဲ့ numeric ID ပါ
* `opaqueData` {Buffer|TypedArray|DataView} `GOAWAY` frame အတွင်းမှာ သယ်ဆောင်သွားဖို့ ထပ်ဆောင်း data ပါဝင်တဲ့ `TypedArray` (သို့) `DataView` instance တစ်ခုပါ။

`Http2Session` ကို ပိတ်လိုက်ခြင်း _မရှိပဲ_ (without) — ချိတ်ဆက်ထားတဲ့ peer ဆီကို `GOAWAY` frame တစ်ခု ပို့လွှတ်ပါတယ်။

#### `http2session.localSettings`

* Type: {HTTP/2 Settings Object}

ဒီ `Http2Session` ရဲ့ လက်ရှိ local settings တွေကို ဖော်ပြတဲ့ prototype-less (prototype မပါတဲ့) object တစ်ခုပါ။ Local settings တွေက _ဒီ_ `Http2Session` instance အတွက်သာ သီးသန့် ဖြစ်ပါတယ်။

#### `http2session.originSet`

* Type: {string\[]|undefined}

`Http2Session` က `TLSSocket` တစ်ခုနဲ့ ချိတ်ဆက်ထားရင် — `originSet` property က `Http2Session` အတွက် authoritative (တရားဝင် ခွင့်ရှိ) လို့ မှတ်ယူနိုင်တဲ့ origins တွေရဲ့ `Array` တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။

`originSet` property က secure TLS connection တစ်ခုကို သုံးတဲ့အခါမှသာ ရရှိနိုင်ပါတယ်။

#### `http2session.pendingSettingsAck`

* Type: {boolean}

`Http2Session` က ပို့လိုက်တဲ့ `SETTINGS` frame တစ်ခုအတွက် acknowledgment (အတည်ပြုချက်) ကို လက်ရှိ စောင့်ဆိုင်းနေလားဆိုတာကို ဖော်ပြပါတယ်။ `http2session.settings()` method ကို ခေါ်ပြီးနောက်မှာ `true` ဖြစ်ပြီး — ပို့လိုက်တဲ့ `SETTINGS` frames တွေ အားလုံး acknowledge လုပ်ခံရတာနဲ့ — `false` ဖြစ်ပါလိမ့်မယ်။

#### `http2session.ping([payload, ]callback)`

* `payload` {Buffer|TypedArray|DataView} Optional ဖြစ်တဲ့ ping payload ပါ။
* `callback` {Function}
* Returns: {boolean}

ချိတ်ဆက်ထားတဲ့ HTTP/2 peer ဆီကို `PING` frame တစ်ခု ပို့လွှတ်ပါတယ်။ `callback` function တစ်ခု ပေးအပ်ရပါမယ်။ `PING` ကို ပို့လိုက်နိုင်ခဲ့ရင် method က `true` ကို ပြန်ပေးပြီး — မဟုတ်ရင် `false` ကို ပြန်ပေးပါတယ်။

Outstanding (acknowledge မလုပ်ရသေးတဲ့) pings တွေရဲ့ အများဆုံး အရေအတွက်ကို `maxOutstandingPings` configuration option က ဆုံးဖြတ်ပါတယ်။ Default အများဆုံး အရေအတွက်က 10 ပါ။

ပေးအပ်ထားရင် — `payload` က `PING` နဲ့အတူ ပို့လွှတ်ပြီး ping acknowledgment နဲ့အတူ ပြန်လည် ပေးအပ်မယ့် — data 8 bytes ပါဝင်တဲ့ `Buffer`, `TypedArray` (သို့) `DataView` တစ်ခု ဖြစ်ရပါမယ်။

Callback ကို arguments သုံးခုနဲ့ ခေါ်ပါလိမ့်မယ်: `PING` ကို အောင်မြင်စွာ acknowledge လုပ်ခဲ့ရင် `null` ဖြစ်မယ့် error argument တစ်ခု — ping ပို့လိုက်ချိန်ကနေ acknowledgment လက်ခံရရှိချိန်အထိ ကုန်ဆုံးသွားတဲ့ millisecond အရေအတွက်ကို ဖော်ပြတဲ့ `duration` argument တစ်ခု — နဲ့ 8-byte `PING` payload ပါဝင်တဲ့ `Buffer` တစ်ခု တို့ပါ။

```js
session.ping(Buffer.from('abcdefgh'), (err, duration, payload) => {
  if (!err) {
    console.log(`Ping acknowledged in ${duration} milliseconds`);
    console.log(`With payload '${payload.toString()}'`);
  }
});
```

`payload` argument ကို သတ်မှတ်မထားဘူးဆိုရင် — default payload က `PING` duration ရဲ့ အစပြုချိန်ကို မှတ်သားတဲ့ 64-bit timestamp (little endian) ဖြစ်ပါလိမ့်မယ်။

#### `http2session.ref()`

ဒီ `Http2Session` instance ရဲ့ အောက်ခံ (underlying) [`net.Socket`][] ပေါ်မှာ [`ref()`][`net.Socket.prototype.ref()`] ကို ခေါ်ပါတယ်။

#### `http2session.remoteSettings`

* Type: {HTTP/2 Settings Object}

ဒီ `Http2Session` ရဲ့ လက်ရှိ remote settings တွေကို ဖော်ပြတဲ့ prototype-less object တစ်ခုပါ။ Remote settings တွေကို _ချိတ်ဆက်ထားတဲ့_ (connected) HTTP/2 peer က သတ်မှတ်ပေးပါတယ်။

#### `http2session.setLocalWindowSize(windowSize)`

* `windowSize` {number}

Local endpoint ရဲ့ window size ကို သတ်မှတ်ပေးပါတယ်။ `windowSize` က သတ်မှတ်ရမယ့် စုစုပေါင်း window size ဖြစ်ပြီး — delta (ကွာဟချက်) မဟုတ်ပါဘူး။

```mjs
import { createServer } from 'node:http2';

const server = createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```

```cjs
const http2 = require('node:http2');

const server = http2.createServer();
const expectedWindowSize = 2 ** 20;
server.on('session', (session) => {

  // Set local window size to be 2 ** 20
  session.setLocalWindowSize(expectedWindowSize);
});
```

HTTP/2 clients တွေအတွက်တော့ သင့်လျော်တဲ့ event က `'connect'` (သို့) `'remoteSettings'` ဖြစ်ပါတယ်။

#### `http2session.setTimeout(msecs, callback)`

* `msecs` {number}
* `callback` {Function}

`msecs` millisecond ကြာပြီးနောက်မှာ `Http2Session` ပေါ်မှာ လှုပ်ရှားမှု မရှိတဲ့အခါ ခေါ်ယူမယ့် callback function တစ်ခုကို သတ်မှတ်ဖို့ သုံးပါတယ်။ ပေးထားတဲ့ `callback` ကို `'timeout'` event ပေါ်မှာ listener တစ်ခုအနေနဲ့ မှတ်ပုံတင်ပါတယ်။

#### `http2session.socket`

* Type: {net.Socket|tls.TLSSocket}

`net.Socket` (သို့မဟုတ် `tls.TLSSocket`) အနေနဲ့ ပြုမူပေမယ့် — ရရှိနိုင်တဲ့ methods တွေကို HTTP/2 နဲ့ သုံးစွဲဖို့ လုံခြုံတဲ့အရာတွေအထိသာ ကန့်သတ်ပေးထားတဲ့ — `Proxy` object တစ်ခုကို ပြန်ပေးပါတယ်။

`emit`, `end`, `pause`, `read`, `resume`, နဲ့ `write` တို့က `ERR_HTTP2_NO_SOCKET_MANIPULATION` code ပါတဲ့ error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`Http2Session` and Sockets][] ကို ကြည့်ပါ။

`destroy`, `setTimeout`, `ref`, နဲ့ `unref` methods တွေကို ဒီ `Http2Session` ပေါ်မှာ ခေါ်ပါလိမ့်မယ်။

အခြား အပြန်အလှန် ဆက်သွယ်မှုတွေ အားလုံးကိုတော့ socket ဆီကို တိုက်ရိုက် လမ်းကြောင်းပြောင်း ပို့ဆောင်ပါလိမ့်မယ်။

#### `http2session.state`

`Http2Session` ရဲ့ လက်ရှိ state (အခြေအနေ) အကြောင်း အမျိုးမျိုးသော အချက်အလက်တွေကို ပေးပါတယ်။

* Type: {Object}
  * `effectiveLocalWindowSize` {number} `Http2Session` အတွက် လက်ရှိ local (receive) flow control window size ပါ။
  * `effectiveRecvDataLength` {number} နောက်ဆုံး flow control `WINDOW_UPDATE` ပြီးနောက် လက်ခံရရှိခဲ့တဲ့ bytes အရေအတွက် ဖြစ်ပါတယ်။
  * `nextStreamID` {number} ဒီ `Http2Session` က `Http2Stream` အသစ်တစ်ခု နောက်တစ်ကြိမ် ဖန်တီးတဲ့အခါ သုံးရမယ့် numeric identifier ပါ။
  * `localWindowSize` {number} `WINDOW_UPDATE` တစ်ခု မလက်ခံရပဲ remote peer က ပို့နိုင်တဲ့ bytes အရေအတွက်ပါ။
  * `lastProcStreamID` {number} `HEADERS` (သို့) `DATA` frame တစ်ခုကို မကြာသေးမီက လက်ခံရရှိခဲ့တဲ့ `Http2Stream` ရဲ့ numeric id ပါ။
  * `remoteWindowSize` {number} `WINDOW_UPDATE` တစ်ခု မလက်ခံရပဲ ဒီ `Http2Session` က ပို့နိုင်တဲ့ bytes အရေအတွက်ပါ။
  * `outboundQueueSize` {number} ဒီ `Http2Session` အတွက် outbound queue ထဲမှာ လက်ရှိ ရှိနေတဲ့ frames အရေအတွက်ပါ။
  * `deflateDynamicTableSize` {number} Outbound header compression state table ရဲ့ လက်ရှိ bytes အရွယ်အစားပါ။
  * `inflateDynamicTableSize` {number} Inbound header compression state table ရဲ့ လက်ရှိ bytes အရွယ်အစားပါ။

ဒီ `Http2Session` ရဲ့ လက်ရှိ အခြေအနေကို ဖော်ပြတဲ့ object တစ်ခုပါ။

#### `http2session.settings([settings][, callback])`

* `settings` {HTTP/2 Settings Object}
* `callback` {Function} Session ချိတ်ဆက်ပြီးတာနဲ့ (သို့) session က ချိတ်ဆက်ပြီးသား ဖြစ်နေရင် ချက်ချင်း ခေါ်ယူတဲ့ callback ပါ။
  * `err` {Error|null}
  * `settings` {HTTP/2 Settings Object} အပ်ဒိတ်လုပ်ပြီးသား `settings` object ပါ။
  * `duration` {integer}

ဒီ `Http2Session` အတွက် လက်ရှိ local settings တွေကို အပ်ဒိတ်လုပ်ပြီး — ချိတ်ဆက်ထားတဲ့ HTTP/2 peer ဆီကို `SETTINGS` frame အသစ်တစ်ခု ပို့လွှတ်ပါတယ်။

ခေါ်လိုက်တာနဲ့ — session က remote peer ဆီက settings အသစ်တွေကို acknowledge လုပ်ပေးဖို့ စောင့်ဆိုင်းနေတဲ့အချိန်မှာ — `http2session.pendingSettingsAck` property က `true` ဖြစ်ပါလိမ့်မယ်။

`SETTINGS` acknowledgment ကို လက်ခံရရှိပြီး `'localSettings'` event ကို emit မလုပ်မချင်း — settings အသစ်တွေက အကျိုးသက်ရောက်မှု ရှိလာမှာ မဟုတ်ပါဘူး။ Acknowledgment က ဆိုင်းငံ့ (pending) ဖြစ်နေတုန်း `SETTINGS` frames အများအပြားကို ပို့လွှတ်ဖို့ ဖြစ်နိုင်ပါတယ်။

#### `http2session.type`

* Type: {number}

ဒီ `Http2Session` instance က server တစ်ခုဆိုရင် `http2session.type` က `http2.constants.NGHTTP2_SESSION_SERVER` နဲ့ ညီမျှပြီး — instance က client တစ်ခုဆိုရင် `http2.constants.NGHTTP2_SESSION_CLIENT` နဲ့ ညီမျှပါတယ်။

#### `http2session.unref()`

ဒီ `Http2Session` instance ရဲ့ အောက်ခံ [`net.Socket`][] ပေါ်မှာ [`unref()`][`net.Socket.prototype.unref()`] ကို ခေါ်ပါတယ်။

### Class: `ServerHttp2Session`

* Extends: {Http2Session}

#### `serverhttp2session.altsvc(alt, originOrStream)`

* `alt` {string} [RFC 7838][] မှာ သတ်မှတ်ထားတဲ့အတိုင်း alternative service configuration (အစားထိုး service ပြင်ဆင်မှု) ရဲ့ ဖော်ပြချက်တစ်ခုပါ။
* `originOrStream` {number|string|URL|Object} Origin ကို သတ်မှတ်ပေးတဲ့ URL string တစ်ခု (သို့) `origin` property ပါတဲ့ `Object` တစ်ခု — သို့မဟုတ် `http2stream.id` property က ပေးတဲ့အတိုင်း active `Http2Stream` တစ်ခုရဲ့ numeric identifier ဖြစ်ပါတယ်။

ချိတ်ဆက်ထားတဲ့ client ဆီကို [RFC 7838][] မှာ သတ်မှတ်ထားတဲ့အတိုင်း `ALTSVC` frame တစ်ခုကို တင်သွင်းပို့လွှတ်ပါတယ်။

```mjs
import { createServer } from 'node:http2';

const server = createServer();
server.on('session', (session) => {
  // Set altsvc for origin https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Set altsvc for a specific stream
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

```cjs
const http2 = require('node:http2');

const server = http2.createServer();
server.on('session', (session) => {
  // Set altsvc for origin https://example.org:80
  session.altsvc('h2=":8000"', 'https://example.org:80');
});

server.on('stream', (stream) => {
  // Set altsvc for a specific stream
  stream.session.altsvc('h2=":8000"', stream.id);
});
```

တိကျတဲ့ stream ID တစ်ခုနဲ့ `ALTSVC` frame တစ်ခုကို ပို့လိုက်တာက — alternate service က ပေးထားတဲ့ `Http2Stream` ရဲ့ origin နဲ့ ဆက်စပ်နေကြောင်း ဖော်ပြပါတယ်။

`alt` နဲ့ origin string တွေက ASCII bytes တွေသာ ပါဝင်ရမှာ ဖြစ်ပြီး — ASCII bytes တွေရဲ့ sequence တစ်ခုအနေနဲ့ တင်းကျပ်စွာ အနက်ဖွင့်ပါတယ်။ ပေးထားတဲ့ domain တစ်ခုအတွက် အရင်က သတ်မှတ်ထားခဲ့တဲ့ alternative service တစ်ခုခုကို ရှင်းလင်းဖို့ `'clear'` ဆိုတဲ့ အထူးတန်ဖိုးကို ဖြတ်သန်းပေးနိုင်ပါတယ်။

`originOrStream` argument အတွက် string တစ်ခုကို ဖြတ်သန်းပေးလိုက်ရင် — ၎င်းကို URL တစ်ခုအနေနဲ့ parse လုပ်ပြီး origin ကို ဆင်းသက်လာအောင် (derive) လုပ်ပါလိမ့်မယ်။ ဥပမာ — `'https://example.org/foo/bar'` ဆိုတဲ့ HTTP URL ရဲ့ origin က `'https://example.org'` ဆိုတဲ့ ASCII string ပါ။ ပေးထားတဲ့ string ကို URL အဖြစ် parse လုပ်လို့ မရဘူးဆိုရင် (သို့) တရားဝင် origin တစ်ခုကို ဆင်းသက်လာအောင် မလုပ်နိုင်ဘူးဆိုရင် — error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

`URL` object တစ်ခု (သို့) `origin` property ပါတဲ့ ဘယ် object မဆို — `originOrStream` အနေနဲ့ ဖြတ်သန်းပေးနိုင်ပြီး — အဲဒီအခါမှာ `origin` property ရဲ့ တန်ဖိုးကို သုံးပါလိမ့်မယ်။ `origin` property ရဲ့ တန်ဖိုးက မှန်ကန်စွာ serialization လုပ်ထားတဲ့ ASCII origin တစ်ခု _ဖြစ်ရပါမယ်_ (must)။

#### Alternative services များ သတ်မှတ်ခြင်း (Specifying alternative services)

`alt` parameter ရဲ့ ပုံစံကို [RFC 7838][] က တင်းကျပ်စွာ သတ်မှတ်ထားပြီး — တိကျတဲ့ host တစ်ခုနဲ့ port တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ "alternative" protocols တွေရဲ့ comma နဲ့ ခြားထားတဲ့ စာရင်းတစ်ခု ပါဝင်တဲ့ ASCII string တစ်ခု ဖြစ်ပါတယ်။

ဥပမာ — `'h2="example.org:81"'` ဆိုတဲ့ တန်ဖိုးက TCP/IP port 81 မှာ `'example.org'` ဆိုတဲ့ host ပေါ်အတွက် HTTP/2 protocol ရရှိနိုင်ကြောင်း ဖော်ပြပါတယ်။ Host နဲ့ port က quote (`"`) characters တွေအတွင်းမှာ ပါဝင်ရပါမယ်။

Alternatives အများအပြားကိုလည်း သတ်မှတ်နိုင်ပါတယ် — ဥပမာ: `'h2="example.org:81", h2=":82"'` လိုမျိုးပါ။

Protocol identifier (ဥပမာတွေထဲက `'h2'`) က တရားဝင် [ALPN Protocol ID][] တစ်ခုခု ဖြစ်နိုင်ပါတယ်။

ဒီတန်ဖိုးတွေရဲ့ syntax ကို Node.js implementation က စစ်ဆေးအတည်ပြုခြင်း (validate) မလုပ်ပဲ — user က ပေးတဲ့အတိုင်း (သို့) peer ဆီကနေ လက်ခံရရှိတဲ့အတိုင်း ဖြတ်သန်း ပေးလိုက်ပါတယ်။

#### `serverhttp2session.origin(...origins)`

* `origins` { string | URL | Object } သီးခြား arguments တွေအနေနဲ့ ဖြတ်သန်းပေးလိုက်တဲ့ URL Strings တစ်ခု (သို့) တစ်ခုထက်ပို ပါဝင်ပါတယ်။

Server က authoritative responses (တရားဝင် တုံ့ပြန်မှုများ) ပေးအပ်နိုင်တဲ့ origins အစုကို ကြေညာဖို့ — ချိတ်ဆက်ထားတဲ့ client ဆီကို [RFC 8336][] မှာ သတ်မှတ်ထားတဲ့အတိုင်း `ORIGIN` frame တစ်ခုကို တင်သွင်းပို့လွှတ်ပါတယ်။

```mjs
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```

```cjs
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
server.on('session', (session) => {
  session.origin('https://example.com', 'https://example.org');
});
```

`origin` အနေနဲ့ string တစ်ခုကို ဖြတ်သန်းပေးလိုက်ရင် — ၎င်းကို URL တစ်ခုအနေနဲ့ parse လုပ်ပြီး origin ကို ဆင်းသက်လာအောင် လုပ်ပါလိမ့်မယ်။ ဥပမာ — `'https://example.org/foo/bar'` ဆိုတဲ့ HTTP URL ရဲ့ origin က `'https://example.org'` ဆိုတဲ့ ASCII string ပါ။ ပေးထားတဲ့ string ကို URL အဖြစ် parse လုပ်လို့ မရဘူးဆိုရင် (သို့) တရားဝင် origin တစ်ခုကို ဆင်းသက်လာအောင် မလုပ်နိုင်ဘူးဆိုရင် — error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

`URL` object တစ်ခု (သို့) `origin` property ပါတဲ့ ဘယ် object မဆို — `origin` အနေနဲ့ ဖြတ်သန်းပေးနိုင်ပြီး — အဲဒီအခါမှာ `origin` property ရဲ့ တန်ဖိုးကို သုံးပါလိမ့်မယ်။ `origin` property ရဲ့ တန်ဖိုးက မှန်ကန်စွာ serialization လုပ်ထားတဲ့ ASCII origin တစ်ခု _ဖြစ်ရပါမယ်_ (must)။

တစ်နည်းအားဖြင့် — `http2.createSecureServer()` method ကို သုံးပြီး HTTP/2 server အသစ်တစ်ခု ဖန်တီးတဲ့အခါ — `origins` option ကိုလည်း သုံးနိုင်ပါတယ်:

```mjs
import { createSecureServer } from 'node:http2';
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```

```cjs
const http2 = require('node:http2');
const options = getSecureOptionsSomehow();
options.origins = ['https://example.com', 'https://example.org'];
const server = http2.createSecureServer(options);
server.on('stream', (stream) => {
  stream.respond();
  stream.end('ok');
});
```

### Class: `ClientHttp2Session`

* Extends: {Http2Session}

#### Event: `'altsvc'`

* `alt` {string}
* `origin` {string}
* `streamId` {number}

`'altsvc'` event က client က `ALTSVC` frame တစ်ခု လက်ခံရရှိတိုင်း emit လုပ်ပါတယ်။ Event ကို `ALTSVC` တန်ဖိုး၊ origin နဲ့ stream ID တို့နဲ့အတူ emit လုပ်ပါတယ်။ `ALTSVC` frame ထဲမှာ `origin` တစ်ခု ပေးအပ်ထားခြင်း မရှိဘူးဆိုရင် — `origin` က ဗလာ string (empty string) ဖြစ်ပါလိမ့်မယ်။

```mjs
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```

```cjs
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('altsvc', (alt, origin, streamId) => {
  console.log(alt);
  console.log(origin);
  console.log(streamId);
});
```

#### Event: `'origin'`

* `origins` {string\[]}

`'origin'` event က client က `ORIGIN` frame တစ်ခု လက်ခံရရှိတိုင်း emit လုပ်ပါတယ်။ Event ကို `origin` strings တွေရဲ့ array တစ်ခုနဲ့ emit လုပ်ပါတယ်။ `http2session.originSet` ကိုလည်း လက်ခံရရှိထားတဲ့ origins တွေ ပါဝင်အောင် အပ်ဒိတ်လုပ်ပါလိမ့်မယ်။

```mjs
import { connect } from 'node:http2';
const client = connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```

```cjs
const http2 = require('node:http2');
const client = http2.connect('https://example.org');

client.on('origin', (origins) => {
  for (let n = 0; n < origins.length; n++)
    console.log(origins[n]);
});
```

`'origin'` event က secure TLS connection တစ်ခုကို သုံးတဲ့အခါမှသာ emit လုပ်ပါတယ်။

#### `clienthttp2session.request(headers[, options])`

* `headers` {HTTP/2 Headers Object|HTTP/2 Raw Headers}

* `options` {Object}
  * `endStream` {boolean} `Http2Stream` ရဲ့ _writable_ ဘက်ကို ကနဦးမှာ ပိတ်ထားသင့်ရင် `true` — ဥပမာ payload body တစ်ခုကို မမျှော်လင့်သင့်တဲ့ `GET` request တစ်ခု ပို့တဲ့အခါမျိုးပါ။
  * `exclusive` {boolean} `true` ဖြစ်ပြီး `parent` က parent Stream တစ်ခုကို သတ်မှတ်ပေးတဲ့အခါ — ဖန်တီးလိုက်တဲ့ stream ကို parent ရဲ့ တစ်ခုတည်းသော တိုက်ရိုက် dependency အဖြစ် သတ်မှတ်ပြီး — ရှိပြီးသား dependents တွေ အားလုံးကို stream အသစ်ရဲ့ dependent တွေ ဖြစ်စေပါတယ်။ **Default:** `false`.
  * `parent` {number} ဖန်တီးလိုက်တဲ့ stream က မှီခိုနေတဲ့ stream တစ်ခုရဲ့ numeric identifier ကို သတ်မှတ်ပေးပါတယ်။
  * `waitForTrailers` {boolean} `true` ဖြစ်ရင် — နောက်ဆုံး `DATA` frame ကို ပို့ပြီးနောက်မှာ `Http2Stream` က `'wantTrailers'` event ကို emit လုပ်ပါလိမ့်မယ်။
  * `signal` {AbortSignal} လုပ်ဆောင်နေဆဲ request တစ်ခုကို abort လုပ်ဖို့ သုံးနိုင်တဲ့ AbortSignal တစ်ခုပါ။

* Returns: {ClientHttp2Stream}

HTTP/2 Client `Http2Session` instances တွေအတွက်သာ ဖြစ်ပြီး — `http2session.request()` က ချိတ်ဆက်ထားတဲ့ server ဆီကို HTTP/2 request တစ်ခု ပို့ဖို့ သုံးနိုင်တဲ့ `Http2Stream` instance တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

`ClientHttp2Session` တစ်ခုကို စဖန်တီးလိုက်တဲ့အချိန်မှာ socket က မချိတ်ဆက်ရသေးတာ ဖြစ်နိုင်ပါတယ်။ ဒီအချိန်အတွင်းမှာ `clienthttp2session.request()` ကို ခေါ်လိုက်ရင် — socket က အသင့်ဖြစ်တဲ့အထိ — တကယ့် request ကို ရွှေ့ဆိုင်းထားပါလိမ့်မယ်။

Request ကို မဖန်တီးနိုင်ခင် session က မရရှိနိုင်တော့ဘူးဆိုရင် — ပြန်ပေးလိုက်တဲ့ stream က `ERR_HTTP2_GOAWAY_SESSION` (သို့) `ERR_HTTP2_INVALID_SESSION` ကို asynchronously emit လုပ်ပါလိမ့်မယ်။

ဒီ method က `http2session.type` က `http2.constants.NGHTTP2_SESSION_CLIENT` နဲ့ ညီမျှတဲ့အခါမှသာ ရရှိနိုင်ပါတယ်။

```mjs
import { connect, constants } from 'node:http2';
const clientSession = connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```

```cjs
const http2 = require('node:http2');
const clientSession = http2.connect('https://localhost:1234');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
} = http2.constants;

const req = clientSession.request({ [HTTP2_HEADER_PATH]: '/' });
req.on('response', (headers) => {
  console.log(headers[HTTP2_HEADER_STATUS]);
  req.on('data', (chunk) => { /* .. */ });
  req.on('end', () => { /* .. */ });
});
```

`options.waitForTrailers` option ကို သတ်မှတ်ထားရင် — ပို့ဖို့ payload data ရဲ့ နောက်ဆုံး chunk ကို queue တင်လိုက်ပြီးနောက် ချက်ချင်း `'wantTrailers'` event ကို emit လုပ်ပါတယ်။ အဲဒီနောက်မှာ peer ဆီကို trailing headers တွေ ပို့ဖို့ `http2stream.sendTrailers()` method ကို ခေါ်နိုင်ပါတယ်။

`options.waitForTrailers` ကို သတ်မှတ်ထားရင် — နောက်ဆုံး `DATA` frame ကို ပို့လွှတ်လိုက်တဲ့အခါ — `Http2Stream` က အလိုအလျောက် ပိတ်မှာ မဟုတ်ပါဘူး။ `Http2Stream` ကို ပိတ်ဖို့ user code က `http2stream.sendTrailers()` (သို့) `http2stream.close()` ထဲက တစ်ခုခုကို ခေါ်ပေးရပါမယ်။

`options.signal` ကို `AbortSignal` တစ်ခုနဲ့ သတ်မှတ်ထားပြီး — သက်ဆိုင်တဲ့ `AbortController` ပေါ်မှာ `abort` ကို ခေါ်လိုက်ရင် — request က `AbortError` error တစ်ခုနဲ့ `'error'` event တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။

`:method` နဲ့ `:path` pseudo-headers တွေကို `headers` အတွင်းမှာ သတ်မှတ်စရာ မလိုပါဘူး — ၎င်းတို့က အသီးသီး အောက်ပါအတိုင်း default ဖြစ်ပါတယ်:

* `:method` = `'GET'`
* `:path` = `/`

### Class: `Http2Stream`

* Extends: {stream.Duplex}

`Http2Stream` class ရဲ့ instance တစ်ခုချင်းစီက `Http2Session` instance တစ်ခုအပေါ်မှာ ရှိတဲ့ bidirectional (နှစ်လမ်းသွား) HTTP/2 communications stream တစ်ခုကို ကိုယ်စားပြုပါတယ်။ `Http2Session` တစ်ခုတည်းက ၎င်း၏ သက်တမ်းတစ်လျှောက်လုံးမှာ `Http2Stream` instances 2^31-1 (2,147,483,647) အထိ ရှိနိုင်ပါတယ်။

User code က `Http2Stream` instances တွေကို တိုက်ရိုက် ဆောက်လုပ်မှာ မဟုတ်ပါဘူး။ ၎င်းတို့ကို `Http2Session` instance ကနေတစ်ဆင့် ဖန်တီး၊ စီမံခန့်ခွဲပြီး user code ဆီကို ပေးအပ်ပါတယ်။ Server ပေါ်မှာ `Http2Stream` instances တွေကို ဝင်လာတဲ့ HTTP request တစ်ခုကို တုံ့ပြန်တဲ့အနေနဲ့ (`'stream'` event ကနေတစ်ဆင့် user code ဆီကို လွှဲပြောင်းပေးခြင်း) (သို့) — `http2stream.pushStream()` method ဆီကို ခေါ်တာကို တုံ့ပြန်တဲ့အနေနဲ့ — ဖန်တီးပါတယ်။ Client ပေါ်မှာတော့ — `http2session.request()` method ကို ခေါ်တဲ့အခါ (သို့) ဝင်လာတဲ့ `'push'` event တစ်ခုကို တုံ့ပြန်တဲ့အနေနဲ့ — `Http2Stream` instances တွေကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

`Http2Stream` class က [`ServerHttp2Stream`][] နဲ့ [`ClientHttp2Stream`][] classes တွေအတွက် အခြေခံ (base) တစ်ခု ဖြစ်ပြီး — class တစ်ခုချင်းစီကို Server ဘက် (သို့) Client ဘက်က အသီးသီး သီးသန့် အသုံးပြုပါတယ်။

`Http2Stream` instances တွေ အားလုံးက [`Duplex`][] streams တွေပါ။ `Duplex` ရဲ့ `Writable` ဘက်ကို ချိတ်ဆက်ထားတဲ့ peer ဆီကို data ပို့ဖို့ သုံးပြီး — `Readable` ဘက်ကတော့ ချိတ်ဆက်ထားတဲ့ peer က ပို့လိုက်တဲ့ data တွေကို လက်ခံရရှိဖို့ သုံးပါတယ်။

`Http2Stream` တစ်ခုအတွက် default text character encoding က UTF-8 ပါ။ `Http2Stream` တစ်ခုကို သုံးပြီး text ပို့တဲ့အခါ — character encoding ကို သတ်မှတ်ဖို့ `'content-type'` header ကို သုံးပါ။

```js
stream.respond({
  'content-type': 'text/html; charset=utf-8',
  ':status': 200,
});
```

#### `Http2Stream` Lifecycle

##### ဖန်တီးခြင်း (Creation)

Server ဘက်မှာ [`ServerHttp2Stream`][] ရဲ့ instances တွေကို အောက်ပါ အခြေအနေတွေမှာ ဖန်တီးပါတယ်:

* HTTP/2 `HEADERS` frame အသစ်တစ်ခုကို အရင်က မသုံးရသေးတဲ့ stream ID တစ်ခုနဲ့ လက်ခံရရှိတဲ့အခါ;
* `http2stream.pushStream()` method ကို ခေါ်တဲ့အခါ။

Client ဘက်မှာ [`ClientHttp2Stream`][] ရဲ့ instances တွေကို `http2session.request()` method ကို ခေါ်တဲ့အခါ ဖန်တီးပါတယ်။

Client ပေါ်မှာ — parent `Http2Session` က အပြည့်အဝ တည်ထောင်ပြီး မဖြစ်သေးဘူးဆိုရင် — `http2session.request()` က ပြန်ပေးတဲ့ `Http2Stream` instance က ချက်ချင်း သုံးဖို့ အသင့်ဖြစ်မှာ မဟုတ်ပါဘူး။ ဒီလိုအခြေအနေမျိုးမှာ — `Http2Stream` ပေါ်မှာ ခေါ်လိုက်တဲ့ operations တွေကို `'ready'` event ကို emit လုပ်တဲ့အထိ buffer လုပ်ထားပါလိမ့်မယ်။ User code က `'ready'` event ကို တိုက်ရိုက် ကိုင်တွယ်ဖို့ လိုအပ်တာက ရှားပါတယ်။ `Http2Stream` တစ်ခုရဲ့ ready အခြေအနေကို `http2stream.id` ရဲ့ တန်ဖိုးကို စစ်ဆေးပြီး ဆုံးဖြတ်နိုင်ပါတယ်။ တန်ဖိုးက `undefined` ဆိုရင် — stream က သုံးဖို့ အသင့်မဖြစ်သေးပါဘူး။

##### ဖျက်ဆီးခြင်း (Destruction)

[`Http2Stream`][] instances တွေ အားလုံးကို အောက်ပါ အခြေအနေတွေထဲက တစ်ခုခုမှာ destroy လုပ်ပါတယ်:

* `RST_STREAM` frame တစ်ခုကို ချိတ်ဆက်ထားတဲ့ peer က လက်ခံရရှိပြီး — (client streams တွေအတွက်သာ) pending data တွေ ဖတ်ပြီးသွားတဲ့အခါ။
* `http2stream.close()` method ကို ခေါ်ပြီး — (client streams တွေအတွက်သာ) pending data တွေ ဖတ်ပြီးသွားတဲ့အခါ။
* `http2stream.destroy()` (သို့) `http2session.destroy()` methods တွေကို ခေါ်တဲ့အခါ။

`Http2Stream` instance တစ်ခုကို destroy လုပ်တဲ့အခါ — ချိတ်ဆက်ထားတဲ့ peer ဆီကို `RST_STREAM` frame တစ်ခု ပို့ဖို့ ကြိုးစားမှု ပြုလုပ်ပါလိမ့်မယ်။

`Http2Stream` instance ကို destroy လုပ်လိုက်တဲ့အခါ `'close'` event ကို emit လုပ်ပါလိမ့်မယ်။ `Http2Stream` က `stream.Duplex` ရဲ့ instance တစ်ခု ဖြစ်တာမို့ — stream data တွေ စီးဆင်းနေတဲ့အချိန်မှာ `'end'` event ကိုလည်း emit လုပ်ပါလိမ့်မယ်။ `http2stream.destroy()` ကို ပထမဆုံး argument အနေနဲ့ `Error` တစ်ခု ဖြတ်သန်းပြီး ခေါ်ခဲ့ရင် — `'error'` event ကိုလည်း emit လုပ်နိုင်ပါတယ်။

`Http2Stream` ကို destroy လုပ်ပြီးနောက်မှာ — `http2stream.destroyed` property က `true` ဖြစ်ပြီး `http2stream.rstCode` property က `RST_STREAM` error code ကို သတ်မှတ်ပေးပါလိမ့်မယ်။ Destroy လုပ်လိုက်ပြီးတာနဲ့ `Http2Stream` instance က နောက်ထပ် အသုံးပြုလို့ မရတော့ပါဘူး။

#### Event: `'aborted'`

`'aborted'` event က `Http2Stream` instance တစ်ခု ဆက်သွယ်မှု အလယ်မှာ ပုံမှန်မဟုတ်ပဲ (abnormally) abort လုပ်ခံရတိုင်း emit လုပ်ပါတယ်။ ၎င်းရဲ့ listener က argument တွေ ဘာမှ မျှော်လင့်မထားပါဘူး။

`'aborted'` event က `Http2Stream` ရဲ့ writable ဘက်ကို end မလုပ်ရသေးဘူးဆိုရင်မှသာ emit လုပ်ပါလိမ့်မယ်။

#### Event: `'close'`

`'close'` event က `Http2Stream` ကို destroy လုပ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event ကို emit လုပ်ပြီးတာနဲ့ — `Http2Stream` instance က နောက်ထပ် အသုံးပြုလို့ မရတော့ပါဘူး။

Stream ကို ပိတ်တဲ့အခါ သုံးခဲ့တဲ့ HTTP/2 error code ကို `http2stream.rstCode` property ကို သုံးပြီး ပြန်လည် ရယူနိုင်ပါတယ်။ Code က `NGHTTP2_NO_ERROR` (`0`) ကလွဲလို့ အခြား တန်ဖိုးတစ်ခုခု ဖြစ်နေရင် — `'error'` event တစ်ခုကိုလည်း emit လုပ်ပြီးသား ဖြစ်ပါလိမ့်မယ်။

#### Event: `'error'`

* `error` {Error}

`'error'` event က `Http2Stream` တစ်ခုကို process လုပ်နေစဉ်အတွင်း error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ emit လုပ်ပါတယ်။

#### Event: `'frameError'`

* `type` {integer} Frame type ပါ။
* `code` {integer} Error code ပါ။
* `id` {integer} Stream id ပါ (frame က stream တစ်ခုနဲ့ ဆက်စပ်မှု မရှိရင် `0`)။

`'frameError'` event က frame တစ်ခု ပို့ဖို့ ကြိုးစားနေစဉ် error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ emit လုပ်ပါတယ်။ ခေါ်ယူလိုက်တဲ့အခါ handler function က frame type ကို ခွဲခြားသတ်မှတ်ပေးတဲ့ integer argument တစ်ခုနဲ့ error code ကို ခွဲခြားသတ်မှတ်ပေးတဲ့ integer argument တစ်ခုကို လက်ခံရရှိပါလိမ့်မယ်။ `'frameError'` event ကို emit လုပ်ပြီးနောက် ချက်ချင်း `Http2Stream` instance ကို destroy လုပ်ပါလိမ့်မယ်။

#### Event: `'ready'`

`'ready'` event က `Http2Stream` ကို ဖွင့်လိုက်ပြီး — `id` တစ်ခု သတ်မှတ်ပေးခံရပြီး — သုံးစွဲနိုင်တဲ့အခါ emit လုပ်ပါတယ်။ Listener က argument တွေ ဘာမှ မျှော်လင့်မထားပါဘူး။

#### Event: `'timeout'`

`http2stream.setTimeout()` ကို သုံးပြီး သတ်မှတ်ထားတဲ့ millisecond အရေအတွက်အတွင်း ဒီ `Http2Stream` အတွက် လှုပ်ရှားမှု (activity) တစ်စုံတစ်ရာ မရရှိရင် — `'timeout'` event ကို emit လုပ်ပါတယ်။ ၎င်းရဲ့ listener က argument တွေ ဘာမှ မျှော်လင့်မထားပါဘူး။

#### Event: `'trailers'`

* `headers` {HTTP/2 Headers Object} Headers တွေကို ဖော်ပြတဲ့ object တစ်ခုပါ
* `flags` {number} ဆက်စပ်နေတဲ့ numeric flags တွေပါ
* `rawHeaders` {HTTP/2 Raw Headers}

`'trailers'` event က trailing header fields တွေနဲ့ ဆက်စပ်နေတဲ့ headers တစ်တွဲကို လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။ Listener callback ဆီကို [HTTP/2 Headers Object][]၊ headers တွေနဲ့ ဆက်စပ်နေတဲ့ flags တွေ နဲ့ headers တွေကို raw format အနေနဲ့ (see [HTTP/2 Raw Headers][]) ဖြတ်သန်းပေးပါတယ်။

Trailers တွေကို မလက်ခံရရှိခင် `http2stream.end()` ကို ခေါ်ပြီး — ဝင်လာတဲ့ data ကို ဖတ်နေခြင်း (သို့) နားထောင်နေခြင်း မရှိဘူးဆိုရင် — ဒီ event ကို emit မလုပ်ပဲ နေနိုင်ပါတယ်။

```js
stream.on('trailers', (headers, flags) => {
  console.log(headers);
});
```

#### Event: `'wantTrailers'`

`'wantTrailers'` event က `Http2Stream` က ပို့ရမယ့် နောက်ဆုံး `DATA` frame ကို queue တင်လိုက်ပြီး — trailing headers တွေ ပို့ဖို့ `Http2Stream` အသင့်ဖြစ်တဲ့အခါ emit လုပ်ပါတယ်။ Request (သို့) response တစ်ခုကို စတင်တဲ့အခါ — ဒီ event ကို emit ဖြစ်စေဖို့ `waitForTrailers` option ကို သတ်မှတ်ပေးရပါမယ်။

#### `http2stream.aborted`

* Type: {boolean}

`Http2Stream` instance ကို ပုံမှန်မဟုတ်ပဲ abort လုပ်ခဲ့ရင် `true` အဖြစ် သတ်မှတ်ပါတယ်။ သတ်မှတ်လိုက်တဲ့အခါ — `'aborted'` event ကို emit လုပ်ပြီးသား ဖြစ်ပါလိမ့်မယ်။

#### `http2stream.bufferSize`

* Type: {number}

ဒီ property က လက်ရှိ ရေးသားဖို့ buffer လုပ်ထားတဲ့ characters အရေအတွက်ကို ဖော်ပြပါတယ်။ အသေးစိတ်အတွက် [`net.Socket.bufferSize`][] ကို ကြည့်ပါ။

#### `http2stream.close(code[, callback])`

* `code` {number} Error code ကို ခွဲခြားသတ်မှတ်ပေးတဲ့ unsigned 32-bit integer ပါ။ **Default:** `http2.constants.NGHTTP2_NO_ERROR` (`0x00`).
* `callback` {Function} `'close'` event ကို နားထောင်ဖို့ မှတ်ပုံတင်ထားတဲ့ optional function တစ်ခုပါ။

ချိတ်ဆက်ထားတဲ့ HTTP/2 peer ဆီကို `RST_STREAM` frame တစ်ခု ပို့လွှတ်ခြင်းအားဖြင့် — `Http2Stream` instance ကို ပိတ်ပါတယ်။

#### `http2stream.closed`

* Type: {boolean}

`Http2Stream` instance ကို ပိတ်လိုက်ပြီးဆိုရင် `true` အဖြစ် သတ်မှတ်ပါတယ်။

#### `http2stream.destroyed`

* Type: {boolean}

`Http2Stream` instance ကို destroy လုပ်ပြီး နောက်ထပ် အသုံးပြုလို့ မရတော့ဘူးဆိုရင် `true` အဖြစ် သတ်မှတ်ပါတယ်။

#### `http2stream.endAfterHeaders`

* Type: {boolean}

လက်ခံရရှိတဲ့ request (သို့) response `HEADERS` frame ထဲမှာ `END_STREAM` flag သတ်မှတ်ထားခဲ့ရင် `true` အဖြစ် သတ်မှတ်ပါတယ် — ဆိုလိုတာက data နောက်ထပ် လက်ခံရရှိစရာ မလိုတော့ပဲ — `Http2Stream` ရဲ့ readable ဘက်ကို ပိတ်သွားပါလိမ့်မယ်။

#### `http2stream.id`

* Type: {number|undefined}

ဒီ `Http2Stream` instance ရဲ့ numeric stream identifier ပါ။ Stream identifier ကို မသတ်မှတ်ရသေးဘူးဆိုရင် `undefined` အဖြစ် သတ်မှတ်ထားပါတယ်။

#### `http2stream.pending`

* Type: {boolean}

`Http2Stream` instance ကို numeric stream identifier တစ်ခု မသတ်မှတ်ရသေးဘူးဆိုရင် `true` အဖြစ် သတ်မှတ်ပါတယ်။

#### `http2stream.priority(options)`

> Stability: 0 - Deprecated: support for priority signaling has been deprecated
> in the [RFC 9113][] and is no longer supported in Node.js.

ဗလာ (empty) method တစ်ခု ဖြစ်ပြီး — backward compatibility (နောက်ပြန် လိုက်ဖက်ညီမှု) အချို့ကို ထိန်းသိမ်းထားဖို့အတွက်သာ ရှိနေတာပါ။

#### `http2stream.rstCode`

* Type: {number}

ချိတ်ဆက်ထားတဲ့ peer ဆီကနေ `RST_STREAM` frame တစ်ခု လက်ခံရရှိခြင်း၊ `http2stream.close()` ကို ခေါ်ခြင်း (သို့) `http2stream.destroy()` ကို ခေါ်ခြင်း တစ်ခုခုပြီးနောက်မှာ `Http2Stream` ကို destroy လုပ်တဲ့အခါ — အစီရင်ခံထားတဲ့ `RST_STREAM` [error code][] ကို သတ်မှတ်ပေးပါတယ်။ `Http2Stream` ကို မပိတ်ရသေးဘူးဆိုရင် `undefined` ဖြစ်ပါလိမ့်မယ်။

#### `http2stream.sentHeaders`

* Type: {HTTP/2 Headers Object}

ဒီ `Http2Stream` အတွက် ပို့လွှတ်လိုက်တဲ့ outbound headers တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

#### `http2stream.sentInfoHeaders`

* Type: {HTTP/2 Headers Object\[]}

ဒီ `Http2Stream` အတွက် ပို့လွှတ်လိုက်တဲ့ outbound informational (additional — ထပ်ဆောင်း) headers တွေ ပါဝင်တဲ့ objects တွေရဲ့ array တစ်ခုပါ။

#### `http2stream.sentTrailers`

* Type: {HTTP/2 Headers Object}

ဒီ `HttpStream` အတွက် ပို့လွှတ်လိုက်တဲ့ outbound trailers တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

#### `http2stream.session`

* Type: {Http2Session}

ဒီ `Http2Stream` ကို ပိုင်ဆိုင်တဲ့ `Http2Session` instance ဆီကို ရည်ညွှန်းချက် (reference) တစ်ခုပါ။ `Http2Stream` instance ကို destroy လုပ်ပြီးနောက်မှာ တန်ဖိုးက `undefined` ဖြစ်ပါလိမ့်မယ်။

#### `http2stream.setTimeout(msecs, callback)`

* `msecs` {number}
* `callback` {Function}

```mjs
import { connect, constants } from 'node:http2';
const client = connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = constants;
const req = client.request({ ':path': '/' });

// Cancel the stream if there's no activity after 5 seconds
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

```cjs
const http2 = require('node:http2');
const client = http2.connect('http://example.org:8000');
const { NGHTTP2_CANCEL } = http2.constants;
const req = client.request({ ':path': '/' });

// Cancel the stream if there's no activity after 5 seconds
req.setTimeout(5000, () => req.close(NGHTTP2_CANCEL));
```

#### `http2stream.state`

`Http2Stream` ရဲ့ လက်ရှိ state (အခြေအနေ) အကြောင်း အမျိုးမျိုးသော အချက်အလက်တွေကို ပေးပါတယ်။

* Type: {Object}
  * `localWindowSize` {number} `WINDOW_UPDATE` တစ်ခု မလက်ခံရပဲ — ချိတ်ဆက်ထားတဲ့ peer က ဒီ `Http2Stream` အတွက် ပို့နိုင်တဲ့ bytes အရေအတွက်ပါ။
  * `state` {number} `nghttp2` က ဆုံးဖြတ်ထားတဲ့အတိုင်း `Http2Stream` ရဲ့ low-level လက်ရှိ state ကို ဖော်ပြတဲ့ flag တစ်ခုပါ။
  * `localClose` {number} ဒီ `Http2Stream` ကို local အရ ပိတ်လိုက်ပြီးဆိုရင် `1` ပါ။
  * `remoteClose` {number} ဒီ `Http2Stream` ကို remote အရ ပိတ်လိုက်ပြီးဆိုရင် `1` ပါ။
  * `sumDependencyWeight` {number} Legacy property တစ်ခု ဖြစ်ပြီး — အမြဲတမ်း `0` အဖြစ် သတ်မှတ်ထားပါတယ်။
  * `weight` {number} Legacy property တစ်ခု ဖြစ်ပြီး — အမြဲတမ်း `16` အဖြစ် သတ်မှတ်ထားပါတယ်။

ဒီ `Http2Stream` ရဲ့ လက်ရှိ state တစ်ခုပါ။

#### `http2stream.sendTrailers(headers)`

* `headers` {HTTP/2 Headers Object}

ချိတ်ဆက်ထားတဲ့ HTTP/2 peer ဆီကို trailing `HEADERS` frame တစ်ခု ပို့လွှတ်ပါတယ်။ ဒီ method က `Http2Stream` ကို ချက်ချင်း ပိတ်သွားစေမှာ ဖြစ်ပြီး — `'wantTrailers'` event ကို emit လုပ်ပြီးမှသာ ခေါ်ရပါမယ်။ Request ပို့တဲ့အခါ (သို့) response ပို့တဲ့အခါ — နောက်ဆုံး `DATA` frame အပြီးမှာလည်း trailers တွေ ပို့နိုင်အောင် `Http2Stream` ကို ဖွင့်ထားနိုင်ဖို့ `options.waitForTrailers` option ကို သတ်မှတ်ပေးရပါမယ်။

```mjs
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```

```cjs
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond(undefined, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ xyz: 'abc' });
  });
  stream.end('Hello World');
});
```

HTTP/1 specification က trailers တွေအတွင်းမှာ HTTP/2 pseudo-header fields တွေ (ဥပမာ — `':method'`, `':path'` စသည်) ပါဝင်ခြင်းကို တားမြစ်ပါတယ်။

### Class: `ClientHttp2Stream`

* Extends {Http2Stream}

`ClientHttp2Stream` class က HTTP/2 Clients တွေပေါ်မှာသာ သီးသန့် အသုံးပြုတဲ့ `Http2Stream` ရဲ့ extension တစ်ခုပါ။ Client ပေါ်မှာရှိတဲ့ `Http2Stream` instances တွေက client ပေါ်မှာသာ သက်ဆိုင်တဲ့ `'response'` နဲ့ `'push'` လိုမျိုး events တွေကို ပံ့ပိုးပေးပါတယ်။

#### Event: `'continue'`

Server က `100 Continue` status တစ်ခု ပို့တဲ့အခါ emit လုပ်ပါတယ် — ပုံမှန်အားဖြင့် request ထဲမှာ `Expect: 100-continue` ပါဝင်နေလို့ ဖြစ်ပါတယ်။ ဒါက client က request body ကို ပို့သင့်တယ်ဆိုတဲ့ ညွှန်ကြားချက်တစ်ခုပါ။

#### Event: `'headers'`

* `headers` {HTTP/2 Headers Object}
* `flags` {number}
* `rawHeaders` {HTTP/2 Raw Headers}

`'headers'` event က stream တစ်ခုအတွက် headers တွေရဲ့ ထပ်ဆောင်း တစ်တွဲကို လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ် — ဥပမာ `1xx` informational headers တစ်တွဲ လက်ခံရရှိတဲ့အခါမျိုးပါ။ Listener callback ဆီကို [HTTP/2 Headers Object][]၊ headers တွေနဲ့ ဆက်စပ်နေတဲ့ flags တွေ နဲ့ headers တွေကို raw format အနေနဲ့ (see [HTTP/2 Raw Headers][]) ဖြတ်သန်းပေးပါတယ်။

```js
stream.on('headers', (headers, flags) => {
  console.log(headers);
});
```

#### Event: `'push'`

* `headers` {HTTP/2 Headers Object}
* `flags` {number}
* `rawHeaders` {HTTP/2 Raw Headers}

`'push'` event က Server Push stream တစ်ခုအတွက် response headers တွေ လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။ Listener callback ဆီကို [HTTP/2 Headers Object][]၊ headers တွေနဲ့ ဆက်စပ်နေတဲ့ flags တွေ နဲ့ headers တွေကို raw format အနေနဲ့ (see [HTTP/2 Raw Headers][]) ဖြတ်သန်းပေးပါတယ်။

```js
stream.on('push', (headers, flags) => {
  console.log(headers);
});
```

#### Event: `'response'`

* `headers` {HTTP/2 Headers Object}
* `flags` {number}
* `rawHeaders` {HTTP/2 Raw Headers}

`'response'` event က ချိတ်ဆက်ထားတဲ့ HTTP/2 server ဆီကနေ ဒီ stream အတွက် response `HEADERS` frame တစ်ခု လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။ Listener ကို arguments သုံးခုနဲ့ ခေါ်ပါတယ်: လက်ခံရရှိထားတဲ့ [HTTP/2 Headers Object][] ပါဝင်တဲ့ `Object` တစ်ခု — headers တွေနဲ့ ဆက်စပ်နေတဲ့ flags တွေ — နဲ့ raw format အနေနဲ့ headers တွေ (see [HTTP/2 Raw Headers][]) တို့ပါ။

```mjs
import { connect } from 'node:http2';
const client = connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```

```cjs
const http2 = require('node:http2');
const client = http2.connect('https://localhost');
const req = client.request({ ':path': '/' });
req.on('response', (headers, flags) => {
  console.log(headers[':status']);
});
```

### Class: `ServerHttp2Stream`

* Extends: {Http2Stream}

`ServerHttp2Stream` class က HTTP/2 Servers တွေပေါ်မှာသာ သီးသန့် အသုံးပြုတဲ့ [`Http2Stream`][] ရဲ့ extension တစ်ခုပါ။ Server ပေါ်မှာရှိတဲ့ `Http2Stream` instances တွေက server ပေါ်မှာသာ သက်ဆိုင်တဲ့ `http2stream.pushStream()` နဲ့ `http2stream.respond()` လိုမျိုး ထပ်ဆောင်း methods တွေကို ပံ့ပိုးပေးပါတယ်။

#### `http2stream.additionalHeaders(headers)`

* `headers` {HTTP/2 Headers Object}

ချိတ်ဆက်ထားတဲ့ HTTP/2 peer ဆီကို informational (သတင်းပေး) `HEADERS` frame ထပ်ဆောင်း တစ်ခု ပို့လွှတ်ပါတယ်။

#### `http2stream.headersSent`

* Type: {boolean}

Headers တွေ ပို့လိုက်ပြီးဆိုရင် `true` — မဟုတ်ရင် `false` ဖြစ်ပါတယ် (read-only)။

#### `http2stream.pushAllowed`

* Type: {boolean}

Remote client ရဲ့ နောက်ဆုံး `SETTINGS` frame ရဲ့ `SETTINGS_ENABLE_PUSH` flag ဆီကို map လုပ်ထားတဲ့ read-only property ပါ။ Remote peer က push streams တွေကို လက်ခံတယ်ဆိုရင် `true` — မဟုတ်ရင် `false` ဖြစ်ပါလိမ့်မယ်။ `Http2Session` တစ်ခုတည်းအတွင်းက `Http2Stream` တိုင်းအတွက် settings တွေက အတူတူပါပဲ။

#### `http2stream.pushStream(headers[, options], callback)`

* `headers` {HTTP/2 Headers Object}
* `options` {Object}
  * `exclusive` {boolean} `true` ဖြစ်ပြီး `parent` က parent Stream တစ်ခုကို သတ်မှတ်ပေးတဲ့အခါ — ဖန်တီးလိုက်တဲ့ stream ကို parent ရဲ့ တစ်ခုတည်းသော တိုက်ရိုက် dependency အဖြစ် သတ်မှတ်ပြီး — ရှိပြီးသား dependents တွေ အားလုံးကို stream အသစ်ရဲ့ dependent တွေ ဖြစ်စေပါတယ်။ **Default:** `false`.
  * `parent` {number} ဖန်တီးလိုက်တဲ့ stream က မှီခိုနေတဲ့ stream တစ်ခုရဲ့ numeric identifier ကို သတ်မှတ်ပေးပါတယ်။
* `callback` {Function} Push stream ကို စတင်လိုက်တာနဲ့ ခေါ်ယူတဲ့ callback ပါ။
  * `err` {Error}
  * `pushStream` {ServerHttp2Stream} ပြန်ပေးလိုက်တဲ့ `pushStream` object ပါ။
  * `headers` {HTTP/2 Headers Object} `pushStream` ကို စတင်ခဲ့တဲ့အခါ သုံးခဲ့တဲ့ headers object ပါ။

Push stream တစ်ခုကို စတင်ပါတယ်။ Callback ကို push stream အတွက် ဖန်တီးလိုက်တဲ့ `Http2Stream` instance အသစ်ကို ဒုတိယ argument အနေနဲ့ ဖြတ်သန်းပြီး (သို့) `Error` တစ်ခုကို ပထမဆုံး argument အနေနဲ့ ဖြတ်သန်းပြီး ခေါ်ပါတယ်။

```mjs
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```

```cjs
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.pushStream({ ':path': '/' }, (err, pushStream, headers) => {
    if (err) throw err;
    pushStream.respond({ ':status': 200 });
    pushStream.end('some pushed data');
  });
  stream.end('some data');
});
```

Push stream တစ်ခုရဲ့ weight ကို `HEADERS` frame ထဲမှာ သတ်မှတ်ခြင်းကို ခွင့်မပြုပါဘူး။ Concurrent streams တွေကြားမှာ server-side bandwidth balancing (bandwidth ချိန်ခွင်လျှာ ညှိခြင်း) ကို ဖွင့်ပေးဖို့ — `silent` option ကို `true` အဖြစ် သတ်မှတ်ပြီး `weight` တန်ဖိုးတစ်ခုကို `http2stream.priority` ဆီကို ဖြတ်သန်းပေးပါ။

Pushed stream တစ်ခုရဲ့ အတွင်းကနေ `http2stream.pushStream()` ကို ခေါ်တာက ခွင့်မပြုပဲ — error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။
#### `http2stream.respond([headers[, options]])`

* `headers` {HTTP/2 Headers Object|HTTP/2 Raw Headers}
* `options` {Object}
  * `endStream` {boolean} Response မှာ payload data ပါဝင်မှာ မဟုတ်ကြောင်း ညွှန်ပြဖို့အတွက် `true` အဖြစ် သတ်မှတ်ပါ။
  * `waitForTrailers` {boolean} `true` ဖြစ်နေရင် — နောက်ဆုံး `DATA` frame ကို ပို့ပြီးနောက်မှာ — `Http2Stream` က `'wantTrailers'` event ကို emit လုပ်ပါလိမ့်မယ်။

```mjs
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```

```cjs
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 });
  stream.end('some data');
});
```

Response တစ်ခုကို စတင်ပါတယ်။ `options.waitForTrailers` option ကို သတ်မှတ်ထားရင် — ပို့ရမယ့် payload data ရဲ့ နောက်ဆုံး chunk ကို queue ထဲ ထည့်လိုက်သည်နဲ့ ချက်ချင်း `'wantTrailers'` event ကို emit လုပ်ပါလိမ့်မယ်။ ပြီးရင် `http2stream.sendTrailers()` method ကို သုံးပြီး trailing header fields တွေကို peer ဆီကို ပို့နိုင်ပါတယ်။

`options.waitForTrailers` ကို သတ်မှတ်ထားရင် — နောက်ဆုံး `DATA` frame ကို ပို့ဆောင်လိုက်တဲ့အခါ — `Http2Stream` က အလိုအလျောက် ပိတ်သွားမှာ မဟုတ်ပါဘူး။ `Http2Stream` ကို ပိတ်ဖို့အတွက် user code က `http2stream.sendTrailers()` သို့မဟုတ် `http2stream.close()` နှစ်ခုအနက် တစ်ခုခုကို ခေါ်ပေးရပါမယ်။

```mjs
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```

```cjs
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond({ ':status': 200 }, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
  stream.end('some data');
});
```

#### `http2stream.respondWithFD(fd[, headers[, options]])`

* `fd` {number|FileHandle} ဖတ်လို့ရတဲ့ file descriptor တစ်ခုပါ။
* `headers` {HTTP/2 Headers Object}
* `options` {Object}
  * `statCheck` {Function}
  * `waitForTrailers` {boolean} `true` ဖြစ်နေရင် — နောက်ဆုံး `DATA` frame ကို ပို့ပြီးနောက်မှာ — `Http2Stream` က `'wantTrailers'` event ကို emit လုပ်ပါလိမ့်မယ်။
  * `offset` {number} စတင် ဖတ်ရှုရမယ့် offset အနေအထားပါ။
  * `length` {number} fd ကနေ ပို့ရမယ့် data ပမာဏပါ။

ပေးထားတဲ့ file descriptor ကနေ data ကို ဖတ်ယူတဲ့ response တစ်ခုကို စတင်ပါတယ်။ ပေးထားတဲ့ file descriptor အပေါ်မှာ validation (စစ်ဆေးခြင်း) ကို ဘာမှ လုပ်ဆောင်မပေးပါဘူး။ File descriptor ကို သုံးပြီး data ဖတ်ဖို့ ကြိုးစားစဉ်မှာ error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — `Http2Stream` ကို standard `INTERNAL_ERROR` code ကို သုံးတဲ့ `RST_STREAM` frame တစ်ခုနဲ့ ပိတ်ပစ်ပါလိမ့်မယ်။

ဒါကို သုံးတဲ့အခါ `Http2Stream` object ရဲ့ `Duplex` interface ကို အလိုအလျောက် ပိတ်ပစ်ပါလိမ့်မယ်။

```mjs
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => closeSync(fd));
});
```

```cjs
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers);
  stream.on('close', () => fs.closeSync(fd));
});
```

Optional ဖြစ်တဲ့ `options.statCheck` function ကို သတ်မှတ်ပေးနိုင်ပြီး — ပေးထားတဲ့ fd ရဲ့ `fs.Stat` အသေးစိတ်အချက်အလက်တွေကို အခြေခံပြီး — user code က ထပ်ဆောင်း content headers တွေကို သတ်မှတ်ဖို့ အခွင့်အရေး ပေးပါတယ်။ `statCheck` function ကို ပေးထားရင် — `http2stream.respondWithFD()` method က ပေးထားတဲ့ file descriptor အကြောင်း အသေးစိတ်အချက်အလက်တွေ စုဆောင်းဖို့ `fs.fstat()` call တစ်ခုကို လုပ်ဆောင်ပါလိမ့်မယ်။

`offset` နဲ့ `length` options တွေကို သုံးပြီး response ကို တိကျတဲ့ range အပိုင်းအခြား (subset) တစ်ခုအထိ ကန့်သတ်နိုင်ပါတယ်။ ဥပမာ — HTTP Range requests တွေကို support လုပ်ဖို့ ဒါကို သုံးနိုင်ပါတယ်။

Stream ပိတ်သွားတဲ့အခါ file descriptor သို့မဟုတ် `FileHandle` ကို ပိတ်ပစ်မှာ မဟုတ်ပါဘူး — ဒါကြောင့် မလိုအပ်တော့တာနဲ့ ၎င်းကို ကိုယ်တိုင် (manually) ပိတ်ပေးဖို့ လိုအပ်ပါလိမ့်မယ်။ File descriptor တစ်ခုတည်းကို streams အများအပြားအတွက် တစ်ပြိုင်နက် (concurrently) သုံးတာကို support မလုပ်တဲ့အပြင် — data ဆုံးရှုံးမှုကိုပါ ဖြစ်စေနိုင်ပါတယ်။ Stream တစ်ခု ပြီးဆုံးသွားပြီးနောက်မှာ file descriptor တစ်ခုကို ပြန်လည် အသုံးပြုတာကတော့ support လုပ်ပါတယ်။

`options.waitForTrailers` option ကို သတ်မှတ်ထားရင် — ပို့ရမယ့် payload data ရဲ့ နောက်ဆုံး chunk ကို queue ထဲ ထည့်လိုက်သည်နဲ့ ချက်ချင်း `'wantTrailers'` event ကို emit လုပ်ပါလိမ့်မယ်။ ပြီးရင် `http2stream.sendTrailers()` method ကို သုံးပြီး trailing header fields တွေကို peer ဆီကို ပို့နိုင်ပါတယ်။

`options.waitForTrailers` ကို သတ်မှတ်ထားရင် — နောက်ဆုံး `DATA` frame ကို ပို့ဆောင်လိုက်တဲ့အခါ — `Http2Stream` က အလိုအလျောက် ပိတ်သွားမှာ မဟုတ်ပါဘူး။ `Http2Stream` ကို ပိတ်ဖို့အတွက် user code က `http2stream.sendTrailers()` သို့မဟုတ် `http2stream.close()` နှစ်ခုအနက် တစ်ခုခုကို _ခေါ်ပေးရပါမယ်_ (must)။

```mjs
import { createServer } from 'node:http2';
import { openSync, fstatSync, closeSync } from 'node:fs';

const server = createServer();
server.on('stream', (stream) => {
  const fd = openSync('/some/file', 'r');

  const stat = fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => closeSync(fd));
});
```

```cjs
const http2 = require('node:http2');
const fs = require('node:fs');

const server = http2.createServer();
server.on('stream', (stream) => {
  const fd = fs.openSync('/some/file', 'r');

  const stat = fs.fstatSync(fd);
  const headers = {
    'content-length': stat.size,
    'last-modified': stat.mtime.toUTCString(),
    'content-type': 'text/plain; charset=utf-8',
  };
  stream.respondWithFD(fd, headers, { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });

  stream.on('close', () => fs.closeSync(fd));
});
```

#### `http2stream.respondWithFile(path[, headers[, options]])`

* `path` {string|Buffer|URL}
* `headers` {HTTP/2 Headers Object}
* `options` {Object}
  * `statCheck` {Function}
  * `onError` {Function} ပို့ဆောင်မှု (send) မလုပ်ဆောင်မီ error တစ်ခု ဖြစ်ပွားတဲ့ အခြေအနေမှာ ခေါ်ယူခံရတဲ့ callback function ပါ။
  * `waitForTrailers` {boolean} `true` ဖြစ်နေရင် — နောက်ဆုံး `DATA` frame ကို ပို့ပြီးနောက်မှာ — `Http2Stream` က `'wantTrailers'` event ကို emit လုပ်ပါလိမ့်မယ်။
  * `offset` {number} စတင် ဖတ်ရှုရမယ့် offset အနေအထားပါ။
  * `length` {number} fd ကနေ ပို့ရမယ့် data ပမာဏပါ။

သာမန် file (regular file) တစ်ခုကို response အနေနဲ့ ပို့ပေးပါတယ်။ `path` က သာမန် file တစ်ခုကို သတ်မှတ်ပေးရပါမယ် — မဟုတ်ရင် `Http2Stream` object ပေါ်မှာ `'error'` event တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။

ဒါကို သုံးတဲ့အခါ `Http2Stream` object ရဲ့ `Duplex` interface ကို အလိုအလျောက် ပိတ်ပစ်ပါလိမ့်မယ်။

Optional ဖြစ်တဲ့ `options.statCheck` function ကို သတ်မှတ်ပေးနိုင်ပြီး — ပေးထားတဲ့ file ရဲ့ `fs.Stat` အသေးစိတ်အချက်အလက်တွေကို အခြေခံပြီး — user code က ထပ်ဆောင်း content headers တွေကို သတ်မှတ်ဖို့ အခွင့်အရေး ပေးပါတယ်:

File data ကို ဖတ်ဖို့ ကြိုးစားစဉ်မှာ error တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — `Http2Stream` ကို standard `INTERNAL_ERROR` code ကို သုံးတဲ့ `RST_STREAM` frame တစ်ခုနဲ့ ပိတ်ပစ်ပါလိမ့်မယ်။ `onError` callback ကို define လုပ်ထားရင် — ၎င်းကို ခေါ်ယူပါလိမ့်မယ်။ မဟုတ်ရင် stream ကို destroy လုပ်ပါလိမ့်မယ်။

File path တစ်ခုကို သုံးတဲ့ ဥပမာ:

```mjs
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() can throw if the stream has been destroyed by
    // the other side.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Perform actual error handling.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```

```cjs
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    headers['last-modified'] = stat.mtime.toUTCString();
  }

  function onError(err) {
    // stream.respond() can throw if the stream has been destroyed by
    // the other side.
    try {
      if (err.code === 'ENOENT') {
        stream.respond({ ':status': 404 });
      } else {
        stream.respond({ ':status': 500 });
      }
    } catch (err) {
      // Perform actual error handling.
      console.error(err);
    }
    stream.end();
  }

  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck, onError });
});
```

`options.statCheck` function ကို — `false` ကို ပြန်ပေးခြင်းအားဖြင့် — send လုပ်တဲ့ လုပ်ဆောင်ချက်ကို ပယ်ဖျက်ဖို့လည်း သုံးနိုင်ပါတယ်။ ဥပမာ — conditional request တစ်ခုက file ကို ပြုပြင်မွမ်းမံထားခြင်း ရှိ/မရှိ ဆုံးဖြတ်ဖို့ stat ရလဒ်တွေကို စစ်ဆေးပြီး — သင့်လျော်တဲ့ `304` response တစ်ခုကို ပြန်ပို့ဖို့ သုံးနိုင်ပါတယ်:

```mjs
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Check the stat here...
    stream.respond({ ':status': 304 });
    return false; // Cancel the send operation
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```

```cjs
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  function statCheck(stat, headers) {
    // Check the stat here...
    stream.respond({ ':status': 304 });
    return false; // Cancel the send operation
  }
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { statCheck });
});
```

`content-length` header field ကို အလိုအလျောက် သတ်မှတ်ပေးပါလိမ့်မယ်။

`offset` နဲ့ `length` options တွေကို သုံးပြီး response ကို တိကျတဲ့ range အပိုင်းအခြား (subset) တစ်ခုအထိ ကန့်သတ်နိုင်ပါတယ်။ ဥပမာ — HTTP Range requests တွေကို support လုပ်ဖို့ ဒါကို သုံးနိုင်ပါတယ်။

`options.onError` function ကို — file ပို့ဆောင်မှု စတင်ခြင်း မပြုလုပ်မီ ဖြစ်ပွားနိုင်တဲ့ errors တွေ အားလုံးကို ကိုင်တွယ်ဖို့လည်း သုံးနိုင်ပါတယ်။ Default အပြုအမူကတော့ stream ကို destroy လုပ်ပါတယ်။

`options.waitForTrailers` option ကို သတ်မှတ်ထားရင် — ပို့ရမယ့် payload data ရဲ့ နောက်ဆုံး chunk ကို queue ထဲ ထည့်လိုက်သည်နဲ့ ချက်ချင်း `'wantTrailers'` event ကို emit လုပ်ပါလိမ့်မယ်။ ပြီးရင် `http2stream.sendTrailers()` method ကို သုံးပြီး trailing header fields တွေကို peer ဆီကို ပို့နိုင်ပါတယ်။

`options.waitForTrailers` ကို သတ်မှတ်ထားရင် — နောက်ဆုံး `DATA` frame ကို ပို့ဆောင်လိုက်တဲ့အခါ — `Http2Stream` က အလိုအလျောက် ပိတ်သွားမှာ မဟုတ်ပါဘူး။ `Http2Stream` ကို ပိတ်ဖို့အတွက် user code က `http2stream.sendTrailers()` သို့မဟုတ် `http2stream.close()` နှစ်ခုအနက် တစ်ခုခုကို ခေါ်ပေးရပါမယ်။

```mjs
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```

```cjs
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile('/some/file',
                         { 'content-type': 'text/plain; charset=utf-8' },
                         { waitForTrailers: true });
  stream.on('wantTrailers', () => {
    stream.sendTrailers({ ABC: 'some value to send' });
  });
});
```

### Class: `Http2Server`

* Extends: {net.Server}

`Http2Server` ရဲ့ instances တွေကို `http2.createServer()` function ကို သုံးပြီး ဖန်တီးပါတယ်။ `Http2Server` class ကို `node:http2` module ကနေ တိုက်ရိုက် export လုပ်မထားပါဘူး။

#### Event: `'checkContinue'`

* `request` {http2.Http2ServerRequest}
* `response` {http2.Http2ServerResponse}

HTTP `Expect: 100-continue` ပါတဲ့ request တစ်ခုကို လက်ခံရရှိတိုင်း — [`'request'`][] listener တစ်ခုကို မှတ်ပုံတင်ထားရင် သို့မဟုတ် [`http2.createServer()`][] ဆီကို callback function တစ်ခု ပေးအပ်ထားရင် — `'checkContinue'` event ကို emit လုပ်ပါတယ်။ ဒီ event ကို နားမထောင်ထားဘူးဆိုရင် — server က သင့်လျော်သလို `100 Continue` status နဲ့ အလိုအလျောက် response ပြန်ပေးပါလိမ့်မယ်။

ဒီ event ကို ကိုင်တွယ်တာမှာ — client က request body ကို ဆက်ပို့သင့်ရင် [`response.writeContinue()`][] ကို ခေါ်တာ သို့မဟုတ် — client က request body ကို ဆက်မပို့သင့်ရင် (ဥပမာ — 400 Bad Request လိုမျိုး) သင့်လျော်တဲ့ HTTP response တစ်ခုကို ထုတ်လုပ်တာ ပါဝင်ပါတယ်။

ဒီ event ကို emit လုပ်ပြီး ကိုင်တွယ်လိုက်တဲ့အခါ — [`'request'`][] event ကို emit လုပ်တော့မှာ မဟုတ်ပါဘူး။

#### Event: `'connection'`

* `socket` {stream.Duplex}

TCP stream အသစ်တစ်ခု တည်ထောင်လိုက်တဲ့အခါ ဒီ event ကို emit လုပ်ပါတယ်။ `socket` ကတော့ ပုံမှန်အားဖြင့် [`net.Socket`][] အမျိုးအစား object တစ်ခုပါ။ သာမန်အားဖြင့် users တွေက ဒီ event ကို ဝင်ရောက်ကြည့်ရှုချင်စရာ မလိုပါဘူး။

ဒီ event ကို — HTTP server ထဲကို connections တွေ ထည့်သွင်း (inject) လုပ်ဖို့ — users တွေက တိုက်ရိုက် (explicitly) emit လုပ်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေမှာ [`Duplex`][] stream မည်သည့်အမျိုးအစားမဆို ဖြတ်သန်းပေးနိုင်ပါတယ်။

#### Event: `'request'`

* `request` {http2.Http2ServerRequest}
* `response` {http2.Http2ServerResponse}

Request တစ်ခု ရှိတိုင်း emit လုပ်ပါတယ်။ Session တစ်ခုအတွင်းမှာ requests အများအပြား ရှိနိုင်ပါတယ်။ [Compatibility API][] ကို ကြည့်ပါ။

#### Event: `'session'`

* `session` {ServerHttp2Session}

`Http2Session` အသစ်တစ်ခုကို `Http2Server` က ဖန်တီးလိုက်တဲ့အခါ `'session'` event ကို emit လုပ်ပါတယ်။

#### Event: `'sessionError'`

* `error` {Error}
* `session` {ServerHttp2Session}

`Http2Server` နဲ့ ဆက်စပ်နေတဲ့ `Http2Session` object တစ်ခုက `'error'` event တစ်ခုကို emit လုပ်တဲ့အခါ `'sessionError'` event ကို emit လုပ်ပါတယ်။

#### Event: `'stream'`

* `stream` {Http2Stream} Stream ဆီသို့ ရည်ညွှန်းချက် (reference) တစ်ခုပါ။
* `headers` {HTTP/2 Headers Object} Headers တွေကို ဖော်ပြတဲ့ object တစ်ခုပါ။
* `flags` {number} ဆက်စပ်နေတဲ့ numeric flags တွေပါ။
* `rawHeaders` {HTTP/2 Raw Headers} Raw headers တွေ ပါဝင်တဲ့ array တစ်ခုပါ။

Server နဲ့ ဆက်စပ်နေတဲ့ `Http2Session` တစ်ခုက `'stream'` event တစ်ခုကို emit လုပ်လိုက်တဲ့အခါ `'stream'` event ကို emit လုပ်ပါတယ်။

[`Http2Session`'s `'stream'` event][] ကိုလည်း ကြည့်ပါ။

```mjs
import { createServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const server = createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```cjs
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const server = http2.createServer();
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

#### Event: `'timeout'`

`http2server.setTimeout()` နဲ့ သတ်မှတ်ထားတဲ့ millisecond အရေအတွက်တစ်ခုအတွက် Server ပေါ်မှာ လှုပ်ရှားမှု (activity) မရှိဘူးဆိုရင် `'timeout'` event ကို emit လုပ်ပါတယ်။ **Default:** 0 (timeout မရှိပါ)

#### `server.close([callback])`

* `callback` {Function}

Server က sessions နဲ့ streams အသစ်တွေကို တည်ထောင်တာကို ရပ်တန့်စေပါတယ်။

`callback` ကို ပေးထားရင် — server က sessions အသစ်တွေကို ခွင့်ပြုတာ ရပ်တန့်ပြီးသား ဖြစ်ပေမယ့် — active sessions တွေ အားလုံး ပိတ်သွားသည်အထိ callback ကို ခေါ်ပေးမှာ မဟုတ်ပါဘူး။ နောက်ထပ် အသေးစိတ်အချက်အလက်တွေအတွက် [`net.Server.close()`][] ကို ကြည့်ပါ။

#### `server[Symbol.asyncDispose]()`

[`server.close()`][] ကို ခေါ်ပြီး — server ပိတ်သွားတဲ့အခါ fulfill ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

#### `server.setTimeout([msecs][, callback])`

* `msecs` {number} **Default:** 0 (timeout မရှိပါ)
* `callback` {Function}
* Returns: {Http2Server}

Http2 server requests တွေအတွက် timeout တန်ဖိုးကို သတ်မှတ်ဖို့ သုံးပြီး — `msecs` milliseconds ကြာပြီးနောက် `Http2Server` ပေါ်မှာ လှုပ်ရှားမှု မရှိတဲ့အခါ ခေါ်ယူခံရမယ့် callback function တစ်ခုကိုလည်း သတ်မှတ်ပေးပါတယ်။

ပေးထားတဲ့ callback ကို `'timeout'` event ပေါ်မှာ listener တစ်ခုအနေနဲ့ မှတ်ပုံတင်ပါတယ်။

`callback` က function တစ်ခု မဟုတ်ဘူးဆိုရင် — `ERR_INVALID_ARG_TYPE` error အသစ်တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

#### `server.timeout`

* Type: {number} Timeout ကို millisecond နဲ့ ဖော်ပြပါတယ်။ **Default:** 0 (timeout မရှိပါ)

Socket တစ်ခုက timeout ဖြစ်သွားပြီလို့ မှတ်ယူခံရမယ့် — မလှုပ်ရှားမှု (inactivity) ရဲ့ millisecond အရေအတွက်ပါ။

`0` တန်ဖိုးက incoming connections တွေအပေါ်မှာ timeout အပြုအမူကို ပိတ်ထားပေးပါလိမ့်မယ်။

Socket timeout ရဲ့ ယန္တရားကို connection တည်ဆောက်ချိန်မှာ သတ်မှတ်ပေးတာမို့ — ဒီတန်ဖိုးကို ပြောင်းလဲတာက server ဆီကို ချိတ်ဆက်မယ့် connections အသစ်တွေကိုသာ သက်ရောက်မှု ရှိပြီး — ရှိပြီးသား connections တွေကိုတော့ မသက်ရောက်ပါဘူး။

#### `server.updateSettings([settings])`

* `settings` {HTTP/2 Settings Object}

ပေးထားတဲ့ settings တွေနဲ့ server ကို update လုပ်ဖို့ သုံးပါတယ်။

မမှန်ကန်တဲ့ `settings` values တွေအတွက် `ERR_HTTP2_INVALID_SETTING_VALUE` ကို throw လုပ်ပါတယ်။

မမှန်ကန်တဲ့ `settings` argument အတွက် `ERR_INVALID_ARG_TYPE` ကို throw လုပ်ပါတယ်။

### Class: `Http2SecureServer`

* Extends: {tls.Server}

`Http2SecureServer` ရဲ့ instances တွေကို `http2.createSecureServer()` function ကို သုံးပြီး ဖန်တီးပါတယ်။ `Http2SecureServer` class ကို `node:http2` module ကနေ တိုက်ရိုက် export လုပ်မထားပါဘူး။

#### Event: `'checkContinue'`

* `request` {http2.Http2ServerRequest}
* `response` {http2.Http2ServerResponse}

HTTP `Expect: 100-continue` ပါတဲ့ request တစ်ခုကို လက်ခံရရှိတိုင်း — [`'request'`][] listener တစ်ခုကို မှတ်ပုံတင်ထားရင် သို့မဟုတ် [`http2.createSecureServer()`][] ဆီကို callback function တစ်ခု ပေးအပ်ထားရင် — `'checkContinue'` event ကို emit လုပ်ပါတယ်။ ဒီ event ကို နားမထောင်ထားဘူးဆိုရင် — server က သင့်လျော်သလို `100 Continue` status နဲ့ အလိုအလျောက် response ပြန်ပေးပါလိမ့်မယ်။

ဒီ event ကို ကိုင်တွယ်တာမှာ — client က request body ကို ဆက်ပို့သင့်ရင် [`response.writeContinue()`][] ကို ခေါ်တာ သို့မဟုတ် — client က request body ကို ဆက်မပို့သင့်ရင် (ဥပမာ — 400 Bad Request လိုမျိုး) သင့်လျော်တဲ့ HTTP response တစ်ခုကို ထုတ်လုပ်တာ ပါဝင်ပါတယ်။

ဒီ event ကို emit လုပ်ပြီး ကိုင်တွယ်လိုက်တဲ့အခါ — [`'request'`][] event ကို emit လုပ်တော့မှာ မဟုတ်ပါဘူး။

#### Event: `'connection'`

* `socket` {stream.Duplex}

TLS handshake မစတင်မီ — TCP stream အသစ်တစ်ခု တည်ထောင်လိုက်တဲ့အခါ ဒီ event ကို emit လုပ်ပါတယ်။ `socket` ကတော့ ပုံမှန်အားဖြင့် [`net.Socket`][] အမျိုးအစား object တစ်ခုပါ။ သာမန်အားဖြင့် users တွေက ဒီ event ကို ဝင်ရောက်ကြည့်ရှုချင်စရာ မလိုပါဘူး။

ဒီ event ကို — HTTP server ထဲကို connections တွေ ထည့်သွင်း (inject) လုပ်ဖို့ — users တွေက တိုက်ရိုက် (explicitly) emit လုပ်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေမှာ [`Duplex`][] stream မည်သည့်အမျိုးအစားမဆို ဖြတ်သန်းပေးနိုင်ပါတယ်။

#### Event: `'request'`

* `request` {http2.Http2ServerRequest}
* `response` {http2.Http2ServerResponse}

Request တစ်ခု ရှိတိုင်း emit လုပ်ပါတယ်။ Session တစ်ခုအတွင်းမှာ requests အများအပြား ရှိနိုင်ပါတယ်။ [Compatibility API][] ကို ကြည့်ပါ။

#### Event: `'session'`

* `session` {ServerHttp2Session}

`Http2Session` အသစ်တစ်ခုကို `Http2SecureServer` က ဖန်တီးလိုက်တဲ့အခါ `'session'` event ကို emit လုပ်ပါတယ်။

#### Event: `'sessionError'`

* `error` {Error}
* `session` {ServerHttp2Session}

`Http2SecureServer` နဲ့ ဆက်စပ်နေတဲ့ `Http2Session` object တစ်ခုက `'error'` event တစ်ခုကို emit လုပ်တဲ့အခါ `'sessionError'` event ကို emit လုပ်ပါတယ်။

#### Event: `'stream'`

* `stream` {Http2Stream} Stream ဆီသို့ ရည်ညွှန်းချက် (reference) တစ်ခုပါ။
* `headers` {HTTP/2 Headers Object} Headers တွေကို ဖော်ပြတဲ့ object တစ်ခုပါ။
* `flags` {number} ဆက်စပ်နေတဲ့ numeric flags တွေပါ။
* `rawHeaders` {HTTP/2 Raw Headers} Raw headers တွေ ပါဝင်တဲ့ array တစ်ခုပါ။

Server နဲ့ ဆက်စပ်နေတဲ့ `Http2Session` တစ်ခုက `'stream'` event တစ်ခုကို emit လုပ်လိုက်တဲ့အခါ `'stream'` event ကို emit လုပ်ပါတယ်။

[`Http2Session`'s `'stream'` event][] ကိုလည်း ကြည့်ပါ။

```mjs
import { createSecureServer, constants } from 'node:http2';
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = constants;

const options = getOptionsSomehow();

const server = createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

```cjs
const http2 = require('node:http2');
const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE,
} = http2.constants;

const options = getOptionsSomehow();

const server = http2.createSecureServer(options);
server.on('stream', (stream, headers, flags) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];
  // ...
  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/plain; charset=utf-8',
  });
  stream.write('hello ');
  stream.end('world');
});
```

#### Event: `'timeout'`

`http2secureServer.setTimeout()` နဲ့ သတ်မှတ်ထားတဲ့ millisecond အရေအတွက်တစ်ခုအတွက် Server ပေါ်မှာ လှုပ်ရှားမှု (activity) မရှိဘူးဆိုရင် `'timeout'` event ကို emit လုပ်ပါတယ်။ **Default:** 0 (timeout မရှိပါ)

#### Event: `'unknownProtocol'`

* `socket` {stream.Duplex}

ချိတ်ဆက်လာတဲ့ client တစ်ခုက ခွင့်ပြုထားတဲ့ protocol တစ်ခုခု (ဆိုလိုတာက HTTP/2 သို့မဟုတ် HTTP/1.1) ကို ညှိနှိုင်း (negotiate) လုပ်ဖို့ မအောင်မြင်တဲ့အခါ `'unknownProtocol'` event ကို emit လုပ်ပါတယ်။ Event handler က ကိုင်တွယ်ဖို့အတွက် socket ကို လက်ခံရရှိပါတယ်။ ဒီ event အတွက် listener တစ်ခုမှ မှတ်ပုံတင်မထားဘူးဆိုရင် — connection ကို အဆုံးသတ်လိုက်ပါတယ်။ [`http2.createSecureServer()`][] ဆီကို ဖြတ်သန်းပေးတဲ့ `'unknownProtocolTimeout'` option ကို သုံးပြီး timeout တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။

Node.js ရဲ့ အစောပိုင်း versions တွေမှာတော့ — `allowHTTP1` က `false` ဖြစ်ပြီး — TLS handshake အတွင်းမှာ client က ALPN extension တစ်ခုကို မပို့ပဲ နေတာ သို့မဟုတ် HTTP/2 (`h2`) မပါဝင်တဲ့ ALPN extension တစ်ခုကို ပို့တာမျိုး ဖြစ်ရင် — ဒီ event ကို emit လုပ်ပါလိမ့်မယ်။ Node.js ရဲ့ ပိုသစ်တဲ့ versions တွေမှာတော့ — `allowHTTP1` က `false` ဖြစ်ပြီး client က ALPN extension တစ်ခုကို မပို့ဘူးဆိုမှသာ ဒီ event ကို emit လုပ်ပါတယ်။ Client က HTTP/2 မပါဝင်တဲ့ (`allowHTTP1` က `true` ဆိုရင် HTTP/1.1 လည်း မပါဝင်တဲ့) ALPN extension တစ်ခုကို ပို့လိုက်ရင် — TLS handshake က မအောင်မြင်ပဲ secure connection တစ်ခုကို မတည်ထောင်နိုင်တော့ပါဘူး။

[Compatibility API][] ကို ကြည့်ပါ။

#### `server.close([callback])`

* `callback` {Function}

Server က sessions နဲ့ streams အသစ်တွေကို တည်ထောင်တာကို ရပ်တန့်စေပါတယ်။

`callback` ကို ပေးထားရင် — server က sessions အသစ်တွေကို ခွင့်ပြုတာ ရပ်တန့်ပြီးသား ဖြစ်ပေမယ့် — active sessions တွေ အားလုံး ပိတ်သွားသည်အထိ callback ကို ခေါ်ပေးမှာ မဟုတ်ပါဘူး။ နောက်ထပ် အသေးစိတ်အချက်အလက်တွေအတွက် [`tls.Server.close()`][] ကို ကြည့်ပါ။

#### `server.setTimeout([msecs][, callback])`

* `msecs` {number} **Default:** `120000` (2 မိနစ်)
* `callback` {Function}
* Returns: {Http2SecureServer}

Http2 secure server requests တွေအတွက် timeout တန်ဖိုးကို သတ်မှတ်ဖို့ သုံးပြီး — `msecs` milliseconds ကြာပြီးနောက် `Http2SecureServer` ပေါ်မှာ လှုပ်ရှားမှု မရှိတဲ့အခါ ခေါ်ယူခံရမယ့် callback function တစ်ခုကိုလည်း သတ်မှတ်ပေးပါတယ်။

ပေးထားတဲ့ callback ကို `'timeout'` event ပေါ်မှာ listener တစ်ခုအနေနဲ့ မှတ်ပုံတင်ပါတယ်။

`callback` က function တစ်ခု မဟုတ်ဘူးဆိုရင် — `ERR_INVALID_ARG_TYPE` error အသစ်တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

#### `server.timeout`

* Type: {number} Timeout ကို millisecond နဲ့ ဖော်ပြပါတယ်။ **Default:** 0 (timeout မရှိပါ)

Socket တစ်ခုက timeout ဖြစ်သွားပြီလို့ မှတ်ယူခံရမယ့် — မလှုပ်ရှားမှု (inactivity) ရဲ့ millisecond အရေအတွက်ပါ။

`0` တန်ဖိုးက incoming connections တွေအပေါ်မှာ timeout အပြုအမူကို ပိတ်ထားပေးပါလိမ့်မယ်။

Socket timeout ရဲ့ ယန္တရားကို connection တည်ဆောက်ချိန်မှာ သတ်မှတ်ပေးတာမို့ — ဒီတန်ဖိုးကို ပြောင်းလဲတာက server ဆီကို ချိတ်ဆက်မယ့် connections အသစ်တွေကိုသာ သက်ရောက်မှု ရှိပြီး — ရှိပြီးသား connections တွေကိုတော့ မသက်ရောက်ပါဘူး။

#### `server.updateSettings([settings])`

* `settings` {HTTP/2 Settings Object}

ပေးထားတဲ့ settings တွေနဲ့ server ကို update လုပ်ဖို့ သုံးပါတယ်။

မမှန်ကန်တဲ့ `settings` values တွေအတွက် `ERR_HTTP2_INVALID_SETTING_VALUE` ကို throw လုပ်ပါတယ်။

မမှန်ကန်တဲ့ `settings` argument အတွက် `ERR_INVALID_ARG_TYPE` ကို throw လုပ်ပါတယ်။

### `http2.createServer([options][, onRequestHandler])`

* `options` {Object}
  * `maxDeflateDynamicTableSize` {number} Header fields တွေကို deflate လုပ်ဖို့အတွက် maximum dynamic table size ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `4Kib`.
  * `maxSettings` {number} `SETTINGS` frame တစ်ခုစီအတွက် settings entries အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ ခွင့်ပြုထားတဲ့ အနိမ့်ဆုံး တန်ဖိုးက `1` ပါ။ **Default:** `32`.
  * `maxSessionMemory`{number} `Http2Session` ကို သုံးခွင့်ပြုထားတဲ့ maximum memory ကို သတ်မှတ်ပေးပါတယ်။ တန်ဖိုးကို megabytes အရေအတွက်အနေနဲ့ ဖော်ပြပါတယ် — ဥပမာ `1` ဆိုတာ 1 megabyte နဲ့ ညီမျှပါတယ်။ ခွင့်ပြုထားတဲ့ အနိမ့်ဆုံး တန်ဖိုးက `1` ပါ။ ဒါက credit အခြေခံတဲ့ limit တစ်ခုပါ — ရှိပြီးသား `Http2Stream` တွေကြောင့် ဒီ limit ကို ကျော်လွန်သွားနိုင်ပေမယ့် — limit ကျော်လွန်နေတဲ့ ကာလအတွင်းမှာ `Http2Stream` instances အသစ်တွေကိုတော့ ငြင်းပယ်ခံရပါလိမ့်မယ်။ လက်ရှိ `Http2Stream` sessions အရေအတွက်၊ header compression tables တွေရဲ့ လက်ရှိ memory အသုံးပြုမှု၊ open streams တွေက ထိန်းသိမ်းထားတဲ့ header blocks တွေ၊ ပို့ရန် queue တင်ထားတဲ့ လက်ရှိ data တွေနဲ့ — acknowledge မလုပ်ရသေးတဲ့ `PING` နဲ့ `SETTINGS` frames တွေ အားလုံးကို လက်ရှိ limit ဆီသို့ ရေတွက်ပါတယ်။ **Default:** `10`.
  * `maxHeaderListPairs` {number} Header entries အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ ဒါက `node:http` module ထဲက [`server.maxHeadersCount`][] သို့မဟုတ် [`request.maxHeadersCount`][] တို့နဲ့ ဆင်တူပါတယ်။ အနိမ့်ဆုံး တန်ဖိုးက `4` ပါ။ **Default:** `128`.
  * `maxOutstandingPings` {number} Outstanding (ဆိုင်းငံ့ထား) ဖြစ်ပြီး acknowledge မလုပ်ရသေးတဲ့ pings အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `10`.
  * `maxSendHeaderBlockLength` {number} Serialize လုပ်ပြီး compress လုပ်ထားတဲ့ headers block တစ်ခုအတွက် ခွင့်ပြုထားတဲ့ အများဆုံး အရွယ်အစားကို သတ်မှတ်ပေးပါတယ်။ ဒီ limit ကို ကျော်လွန်တဲ့ headers တွေကို ပို့ဖို့ ကြိုးစားတာက — `'frameError'` event တစ်ခုကို emit လုပ်ပြီး — stream ကို ပိတ်ပြီး destroy လုပ်သွားစေပါလိမ့်မယ်။ ဒါက headers တစ်ခုလုံးရဲ့ block အတွက် ခွင့်ပြုထားတဲ့ အများဆုံး အရွယ်အစားကို သတ်မှတ်ပေးပေမယ့် — `nghttp2` (အတွင်းပိုင်း http2 library) မှာတော့ decompress လုပ်ထားတဲ့ key/value pair တစ်ခုစီအတွက် `65536` ဆိုတဲ့ limit တစ်ခု ရှိပါတယ်။
  * `paddingStrategy` {number} `HEADERS` နဲ့ `DATA` frames တွေအတွက် သုံးမယ့် padding ပမာဏကို ဆုံးဖြတ်ရာမှာ သုံးတဲ့ strategy ပါ။ **Default:** `http2.constants.PADDING_STRATEGY_NONE`. တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:
    * `http2.constants.PADDING_STRATEGY_NONE`: Padding ကို လုံးဝ မသုံးပါဘူး။
    * `http2.constants.PADDING_STRATEGY_MAX`: အတွင်းပိုင်း implementation က ဆုံးဖြတ်တဲ့ padding အများဆုံး ပမာဏကို သုံးပါတယ်။
    * `http2.constants.PADDING_STRATEGY_ALIGNED`: 9-byte header အပါအဝင် — စုစုပေါင်း frame length က 8 ၏ အဆ (multiple) ဖြစ်အောင် သေချာစေဖို့ လုံလောက်တဲ့ padding ကို သုံးဖို့ ကြိုးစားပါတယ်။ Frame တစ်ခုစီအတွက် — လက်ရှိ flow control state နဲ့ settings တွေက ဆုံးဖြတ်ပေးတဲ့ — ခွင့်ပြုထားတဲ့ padding bytes အများဆုံး အရေအတွက် ရှိပါတယ်။ Alignment သေချာစေဖို့ လိုအပ်တဲ့ တွက်ချက်ထားတဲ့ ပမာဏထက် ဒီ maximum က နည်းနေရင် — maximum ကို သုံးပြီး — စုစုပေါင်း frame length က 8 bytes မှာ သေချာပေါက် aligned ဖြစ်နေမယ်လို့ မဆိုနိုင်ပါဘူး။
  * `peerMaxConcurrentStreams` {number} `SETTINGS` frame တစ်ခုကို လက်ခံရရှိခဲ့သလိုမျိုး — remote peer အတွက် concurrent streams အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Remote peer က `maxConcurrentStreams` အတွက် ကိုယ်ပိုင် တန်ဖိုးတစ်ခု သတ်မှတ်လိုက်ရင် — ဒီတန်ဖိုးကို override လုပ်ခံရပါလိမ့်မယ်။ **Default:** `100`.
  * `maxSessionInvalidFrames` {integer} Session ကို မပိတ်မီ သည်းခံပေးမယ့် (tolerate) invalid frames အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `1000`.
  * `maxSessionRejectedStreams` {integer} Session ကို မပိတ်မီ သည်းခံပေးမယ့် — ဖန်တီးချိန်တွင် ငြင်းပယ်ခံရတဲ့ streams အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Rejection တစ်ခုချင်းစီက — peer ကို streams တွေ နောက်ထပ် မဖွင့်ဖို့ ပြောဆိုသင့်တဲ့ — `NGHTTP2_ENHANCE_YOUR_CALM` error တစ်ခုနဲ့ ဆက်စပ်နေပါတယ်။ ဒါကြောင့် streams တွေ ဆက်ဖွင့်နေတာကို မကောင်းမွန်စွာ ပြုမူနေတဲ့ (misbehaving) peer တစ်ခုရဲ့ လက္ခဏာအဖြစ် မှတ်ယူပါတယ်။ **Default:** `100`.
  * `settings` {HTTP/2 Settings Object} Connection တည်ဆောက်ချိန်မှာ remote peer ဆီကို ပို့မယ့် ကနဦး (initial) settings တွေပါ။
  * `streamResetBurst` {number} နဲ့ `streamResetRate` {number} — incoming stream reset (RST\_STREAM frame) တွေအတွက် rate limit ကို သတ်မှတ်ပေးပါတယ်။ Settings နှစ်ခုလုံးကို သတ်မှတ်ထားမှသာ အကျိုးသက်ရောက်မှု ရှိပြီး — အသီးသီး 1000 နဲ့ 33 ဆိုပြီး default ဖြစ်ပါတယ်။
  * `remoteCustomSettings` {Array} Integer values တွေရဲ့ array က — လက်ခံရရှိတဲ့ remoteSettings ရဲ့ `CustomSettings` property မှာ ပါဝင်တဲ့ — settings types တွေကို သတ်မှတ်ပေးပါတယ်။ ခွင့်ပြုထားတဲ့ setting types တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် `Http2Settings` object ရဲ့ `CustomSettings` property ကို ကြည့်ပါ။
  * `Http1IncomingMessage` {http.IncomingMessage} HTTP/1 fallback အတွက် သုံးမယ့် `IncomingMessage` class ကို သတ်မှတ်ပေးပါတယ်။ မူရင်း `http.IncomingMessage` ကို တိုးချဲ့ဖို့ (extend) အသုံးဝင်ပါတယ်။ **Default:** `http.IncomingMessage`. **Deprecated.** ဒီအစား `http1Options.IncomingMessage` ကို သုံးပါ။ [DEP0202][] ကို ကြည့်ပါ။
  * `Http1ServerResponse` {http.ServerResponse} HTTP/1 fallback အတွက် သုံးမယ့် `ServerResponse` class ကို သတ်မှတ်ပေးပါတယ်။ မူရင်း `http.ServerResponse` ကို တိုးချဲ့ဖို့ (extend) အသုံးဝင်ပါတယ်။ **Default:** `http.ServerResponse`. **Deprecated.** ဒီအစား `http1Options.ServerResponse` ကို သုံးပါ။ [DEP0202][] ကို ကြည့်ပါ။
  * `http1Options` {Object} `allowHTTP1` က `true` ဖြစ်တဲ့အခါ HTTP/1 fallback ကို configure လုပ်ဖို့ options object တစ်ခုပါ။ ဒီ options တွေကို underlying HTTP/1 server ဆီကို ဖြတ်သန်းပေးပါတယ်။ ရနိုင်တဲ့ options တွေအတွက် [`http.createServer()`][] ကို ကြည့်ပါ။ တခြားအရာတွေထဲက အောက်ပါတို့ကို support လုပ်ပါတယ်:
    * `IncomingMessage` {http.IncomingMessage} HTTP/1 fallback အတွက် သုံးမယ့် `IncomingMessage` class ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `http.IncomingMessage`.
    * `ServerResponse` {http.ServerResponse} HTTP/1 fallback အတွက် သုံးမယ့် `ServerResponse` class ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `http.ServerResponse`.
    * `keepAliveTimeout` {number} Server က နောက်ဆုံး response ကို ရေးသားပြီးတဲ့နောက် — socket တစ်ခုကို destroy မလုပ်မီ — ထပ်ဆောင်း incoming data တွေအတွက် စောင့်ဆိုင်းရမယ့် မလှုပ်ရှားမှု (inactivity) ရဲ့ millisecond အရေအတွက်ပါ။ **Default:** `5000`.
  * `Http2ServerRequest` {http2.Http2ServerRequest} သုံးမယ့် `Http2ServerRequest` class ကို သတ်မှတ်ပေးပါတယ်။ မူရင်း `Http2ServerRequest` ကို တိုးချဲ့ဖို့ (extend) အသုံးဝင်ပါတယ်။ **Default:** `Http2ServerRequest`.
  * `Http2ServerResponse` {http2.Http2ServerResponse} သုံးမယ့် `Http2ServerResponse` class ကို သတ်မှတ်ပေးပါတယ်။ မူရင်း `Http2ServerResponse` ကို တိုးချဲ့ဖို့ (extend) အသုံးဝင်ပါတယ်။ **Default:** `Http2ServerResponse`.
  * `unknownProtocolTimeout` {number} [`'unknownProtocol'`][] တစ်ခုကို emit လုပ်တဲ့အခါ server က စောင့်ဆိုင်းရမယ့် timeout ကို millisecond အနေနဲ့ သတ်မှတ်ပေးပါတယ်။ အဲဒီအချိန်မှာ socket ကို destroy မလုပ်ရသေးဘူးဆိုရင် — server က ၎င်းကို destroy လုပ်ပါလိမ့်မယ်။ **Default:** `10000`.
  * `strictFieldWhitespaceValidation` {boolean} `true` ဆိုရင် — [RFC-9113](https://www.rfc-editor.org/rfc/rfc9113.html#section-8.2.1) အရ HTTP/2 header field names နဲ့ values တွေအတွက် — leading နဲ့ trailing whitespace တွေကို — တင်းကျပ်တဲ့ (strict) validation ပြုလုပ်တာကို ဖွင့်ပေးပါတယ်။ **Default:** `true`.
  * `strictSingleValueFields` {boolean} `true` ဆိုရင် — တန်ဖိုးတစ်ခုတည်းသာ ရှိရမယ်လို့ သတ်မှတ်ထားတဲ့ headers နဲ့ trailers တွေအတွက် strict validation ကို သုံးပါတယ် — ဒါကြောင့် values အများအပြား ပေးလိုက်ရင် error တစ်ခုကို throw လုပ်ပါတယ်။ **Default:** `true`.
  * `...options` {Object} [`net.createServer()`][] option မည်သည့်အရာမဆို ပေးနိုင်ပါတယ်။
* `onRequestHandler` {Function} [Compatibility API][] ကို ကြည့်ပါ။
* Returns: {Http2Server}

`Http2Session` instances တွေကို ဖန်တီးပြီး စီမံခန့်ခွဲပေးတဲ့ `net.Server` instance တစ်ခုကို ပြန်ပေးပါတယ်။

[unencrypted HTTP/2][HTTP/2 Unencrypted] ကို support လုပ်တဲ့ browsers တွေ မသိရှိရသေးတာမို့ — browser clients တွေနဲ့ ဆက်သွယ်တဲ့အခါ [`http2.createSecureServer()`][] ကို သုံးဖို့ လိုအပ်ပါတယ်။

```mjs
import { createServer } from 'node:http2';

// Create an unencrypted HTTP/2 server.
// Since there are no browsers known that support
// unencrypted HTTP/2, the use of `createSecureServer()`
// is necessary when communicating with browser clients.
const server = createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

```cjs
const http2 = require('node:http2');

// Create an unencrypted HTTP/2 server.
// Since there are no browsers known that support
// unencrypted HTTP/2, the use of `http2.createSecureServer()`
// is necessary when communicating with browser clients.
const server = http2.createServer();

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8000);
```

### `http2.createSecureServer(options[, onRequestHandler])`

* `options` {Object}
  * `allowHTTP1` {boolean} `true` အဖြစ် သတ်မှတ်ထားရင် — HTTP/2 ကို support မလုပ်တဲ့ incoming client connections တွေကို HTTP/1.x အဖြစ် အဆင့်လျှော့ချ (downgrade) လုပ်ပါလိမ့်မယ်။ [`'unknownProtocol'`][] event ကို ကြည့်ပါ။ [ALPN negotiation][] ကိုလည်း ကြည့်ပါ။ **Default:** `false`.
  * `maxDeflateDynamicTableSize` {number} Header fields တွေကို deflate လုပ်ဖို့အတွက် maximum dynamic table size ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `4Kib`.
  * `maxSettings` {number} `SETTINGS` frame တစ်ခုစီအတွက် settings entries အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ ခွင့်ပြုထားတဲ့ အနိမ့်ဆုံး တန်ဖိုးက `1` ပါ။ **Default:** `32`.
  * `maxSessionMemory`{number} `Http2Session` ကို သုံးခွင့်ပြုထားတဲ့ maximum memory ကို သတ်မှတ်ပေးပါတယ်။ တန်ဖိုးကို megabytes အရေအတွက်အနေနဲ့ ဖော်ပြပါတယ် — ဥပမာ `1` ဆိုတာ 1 megabyte နဲ့ ညီမျှပါတယ်။ ခွင့်ပြုထားတဲ့ အနိမ့်ဆုံး တန်ဖိုးက `1` ပါ။ ဒါက credit အခြေခံတဲ့ limit တစ်ခုပါ — ရှိပြီးသား `Http2Stream` တွေကြောင့် ဒီ limit ကို ကျော်လွန်သွားနိုင်ပေမယ့် — limit ကျော်လွန်နေတဲ့ ကာလအတွင်းမှာ `Http2Stream` instances အသစ်တွေကိုတော့ ငြင်းပယ်ခံရပါလိမ့်မယ်။ လက်ရှိ `Http2Stream` sessions အရေအတွက်၊ header compression tables တွေရဲ့ လက်ရှိ memory အသုံးပြုမှု၊ open streams တွေက ထိန်းသိမ်းထားတဲ့ header blocks တွေ၊ ပို့ရန် queue တင်ထားတဲ့ လက်ရှိ data တွေနဲ့ — acknowledge မလုပ်ရသေးတဲ့ `PING` နဲ့ `SETTINGS` frames တွေ အားလုံးကို လက်ရှိ limit ဆီသို့ ရေတွက်ပါတယ်။ **Default:** `10`.
  * `maxHeaderListPairs` {number} Header entries အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ ဒါက `node:http` module ထဲက [`server.maxHeadersCount`][] သို့မဟုတ် [`request.maxHeadersCount`][] တို့နဲ့ ဆင်တူပါတယ်။ အနိမ့်ဆုံး တန်ဖိုးက `4` ပါ။ **Default:** `128`.
  * `maxOutstandingPings` {number} Outstanding (ဆိုင်းငံ့ထား) ဖြစ်ပြီး acknowledge မလုပ်ရသေးတဲ့ pings အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `10`.
  * `maxSendHeaderBlockLength` {number} Serialize လုပ်ပြီး compress လုပ်ထားတဲ့ headers block တစ်ခုအတွက် ခွင့်ပြုထားတဲ့ အများဆုံး အရွယ်အစားကို သတ်မှတ်ပေးပါတယ်။ ဒီ limit ကို ကျော်လွန်တဲ့ headers တွေကို ပို့ဖို့ ကြိုးစားတာက — `'frameError'` event တစ်ခုကို emit လုပ်ပြီး — stream ကို ပိတ်ပြီး destroy လုပ်သွားစေပါလိမ့်မယ်။
  * `paddingStrategy` {number} `HEADERS` နဲ့ `DATA` frames တွေအတွက် သုံးမယ့် padding ပမာဏကို ဆုံးဖြတ်ရာမှာ သုံးတဲ့ strategy ပါ။ **Default:** `http2.constants.PADDING_STRATEGY_NONE`. တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:
    * `http2.constants.PADDING_STRATEGY_NONE`: Padding ကို လုံးဝ မသုံးပါဘူး။
    * `http2.constants.PADDING_STRATEGY_MAX`: အတွင်းပိုင်း implementation က ဆုံးဖြတ်တဲ့ padding အများဆုံး ပမာဏကို သုံးပါတယ်။
    * `http2.constants.PADDING_STRATEGY_ALIGNED`: 9-byte header အပါအဝင် — စုစုပေါင်း frame length က 8 ၏ အဆ (multiple) ဖြစ်အောင် သေချာစေဖို့ လုံလောက်တဲ့ padding ကို သုံးဖို့ ကြိုးစားပါတယ်။ Frame တစ်ခုစီအတွက် — လက်ရှိ flow control state နဲ့ settings တွေက ဆုံးဖြတ်ပေးတဲ့ — ခွင့်ပြုထားတဲ့ padding bytes အများဆုံး အရေအတွက် ရှိပါတယ်။ Alignment သေချာစေဖို့ လိုအပ်တဲ့ တွက်ချက်ထားတဲ့ ပမာဏထက် ဒီ maximum က နည်းနေရင် — maximum ကို သုံးပြီး — စုစုပေါင်း frame length က 8 bytes မှာ သေချာပေါက် aligned ဖြစ်နေမယ်လို့ မဆိုနိုင်ပါဘူး။
  * `peerMaxConcurrentStreams` {number} `SETTINGS` frame တစ်ခုကို လက်ခံရရှိခဲ့သလိုမျိုး — remote peer အတွက် concurrent streams အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Remote peer က `maxConcurrentStreams` အတွက် ကိုယ်ပိုင် တန်ဖိုးတစ်ခု သတ်မှတ်လိုက်ရင် — ဒီတန်ဖိုးကို override လုပ်ခံရပါလိမ့်မယ်။ **Default:** `100`.
  * `maxSessionInvalidFrames` {integer} Session ကို မပိတ်မီ သည်းခံပေးမယ့် (tolerate) invalid frames အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `1000`.
  * `maxSessionRejectedStreams` {integer} Session ကို မပိတ်မီ သည်းခံပေးမယ့် — ဖန်တီးချိန်တွင် ငြင်းပယ်ခံရတဲ့ streams အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Rejection တစ်ခုချင်းစီက — peer ကို streams တွေ နောက်ထပ် မဖွင့်ဖို့ ပြောဆိုသင့်တဲ့ — `NGHTTP2_ENHANCE_YOUR_CALM` error တစ်ခုနဲ့ ဆက်စပ်နေပါတယ်။ ဒါကြောင့် streams တွေ ဆက်ဖွင့်နေတာကို မကောင်းမွန်စွာ ပြုမူနေတဲ့ (misbehaving) peer တစ်ခုရဲ့ လက္ခဏာအဖြစ် မှတ်ယူပါတယ်။ **Default:** `100`.
  * `settings` {HTTP/2 Settings Object} Connection တည်ဆောက်ချိန်မှာ remote peer ဆီကို ပို့မယ့် ကနဦး (initial) settings တွေပါ။
  * `streamResetBurst` {number} နဲ့ `streamResetRate` {number} — incoming stream reset (RST\_STREAM frame) တွေအတွက် rate limit ကို သတ်မှတ်ပေးပါတယ်။ Settings နှစ်ခုလုံးကို သတ်မှတ်ထားမှသာ အကျိုးသက်ရောက်မှု ရှိပြီး — အသီးသီး 1000 နဲ့ 33 ဆိုပြီး default ဖြစ်ပါတယ်။
  * `remoteCustomSettings` {Array} Integer values တွေရဲ့ array က — လက်ခံရရှိတဲ့ remoteSettings ရဲ့ `customSettings` property မှာ ပါဝင်တဲ့ — settings types တွေကို သတ်မှတ်ပေးပါတယ်။ ခွင့်ပြုထားတဲ့ setting types တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် `Http2Settings` object ရဲ့ `customSettings` property ကို ကြည့်ပါ။
  * `...options` {Object} [`tls.createServer()`][] options မည်သည့်အရာမဆို ပေးနိုင်ပါတယ်။ Servers တွေအတွက် — identity options (`pfx` သို့မဟုတ် `key`/`cert`) တွေကတော့ ပုံမှန်အားဖြင့် လိုအပ်ပါတယ်။
  * `origins` {string\[]} Server `Http2Session` အသစ်တစ်ခုကို ဖန်တီးပြီးသည်နှင့် ချက်ချင်း — `ORIGIN` frame တစ်ခုအတွင်းမှာ ပို့မယ့် origin strings တွေရဲ့ array တစ်ခုပါ။
  * `unknownProtocolTimeout` {number} [`'unknownProtocol'`][] event တစ်ခုကို emit လုပ်တဲ့အခါ server က စောင့်ဆိုင်းရမယ့် timeout ကို millisecond အနေနဲ့ သတ်မှတ်ပေးပါတယ်။ အဲဒီအချိန်မှာ socket ကို destroy မလုပ်ရသေးဘူးဆိုရင် — server က ၎င်းကို destroy လုပ်ပါလိမ့်မယ်။ **Default:** `10000`.
  * `strictFieldWhitespaceValidation` {boolean} `true` ဆိုရင် — [RFC-9113](https://www.rfc-editor.org/rfc/rfc9113.html#section-8.2.1) အရ HTTP/2 header field names နဲ့ values တွေအတွက် — leading နဲ့ trailing whitespace တွေကို — တင်းကျပ်တဲ့ (strict) validation ပြုလုပ်တာကို ဖွင့်ပေးပါတယ်။ **Default:** `true`.
  * `strictSingleValueFields` {boolean} `true` ဆိုရင် — တန်ဖိုးတစ်ခုတည်းသာ ရှိရမယ်လို့ သတ်မှတ်ထားတဲ့ headers နဲ့ trailers တွေအတွက် strict validation ကို သုံးပါတယ် — ဒါကြောင့် values အများအပြား ပေးလိုက်ရင် error တစ်ခုကို throw လုပ်ပါတယ်။ **Default:** `true`.
  * `http1Options` {Object} `allowHTTP1` က `true` ဖြစ်တဲ့အခါ HTTP/1 fallback ကို configure လုပ်ဖို့ options object တစ်ခုပါ။ ဒီ options တွေကို underlying HTTP/1 server ဆီကို ဖြတ်သန်းပေးပါတယ်။ ရနိုင်တဲ့ options တွေအတွက် [`http.createServer()`][] ကို ကြည့်ပါ။ တခြားအရာတွေထဲက အောက်ပါတို့ကို support လုပ်ပါတယ်:
    * `IncomingMessage` {http.IncomingMessage} HTTP/1 fallback အတွက် သုံးမယ့် `IncomingMessage` class ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `http.IncomingMessage`.
    * `ServerResponse` {http.ServerResponse} HTTP/1 fallback အတွက် သုံးမယ့် `ServerResponse` class ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `http.ServerResponse`.
    * `keepAliveTimeout` {number} Server က နောက်ဆုံး response ကို ရေးသားပြီးတဲ့နောက် — socket တစ်ခုကို destroy မလုပ်မီ — ထပ်ဆောင်း incoming data တွေအတွက် စောင့်ဆိုင်းရမယ့် မလှုပ်ရှားမှု (inactivity) ရဲ့ millisecond အရေအတွက်ပါ။ **Default:** `5000`.
* `onRequestHandler` {Function} [Compatibility API][] ကို ကြည့်ပါ။
* Returns: {Http2SecureServer}

`Http2Session` instances တွေကို ဖန်တီးပြီး စီမံခန့်ခွဲပေးတဲ့ `tls.Server` instance တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

```cjs
const http2 = require('node:http2');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
};

// Create a secure HTTP/2 server
const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html; charset=utf-8',
    ':status': 200,
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(8443);
```

### `http2.connect(authority[, options][, listener])`

* `authority` {string|URL} ချိတ်ဆက်ရမယ့် remote HTTP/2 server ပါ။ ဒါက `http://` သို့မဟုတ် `https://` prefix, host name နဲ့ IP port (default မဟုတ်တဲ့ port တစ်ခုကို သုံးမယ်ဆိုရင်) တို့ ပါဝင်တဲ့ — အနည်းဆုံး၊ တရားဝင် (valid) URL ပုံစံမျိုး ဖြစ်ရပါမယ်။ URL ထဲက userinfo (user ID နဲ့ password), path, querystring နဲ့ fragment အသေးစိတ်အချက်အလက်တွေကိုတော့ လျစ်လျူရှုပါလိမ့်မယ်။
* `options` {Object}
  * `maxDeflateDynamicTableSize` {number} Header fields တွေကို deflate လုပ်ဖို့အတွက် maximum dynamic table size ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `4Kib`.
  * `maxSettings` {number} `SETTINGS` frame တစ်ခုစီအတွက် settings entries အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ ခွင့်ပြုထားတဲ့ အနိမ့်ဆုံး တန်ဖိုးက `1` ပါ။ **Default:** `32`.
  * `maxSessionMemory`{number} `Http2Session` ကို သုံးခွင့်ပြုထားတဲ့ maximum memory ကို သတ်မှတ်ပေးပါတယ်။ တန်ဖိုးကို megabytes အရေအတွက်အနေနဲ့ ဖော်ပြပါတယ် — ဥပမာ `1` ဆိုတာ 1 megabyte နဲ့ ညီမျှပါတယ်။ ခွင့်ပြုထားတဲ့ အနိမ့်ဆုံး တန်ဖိုးက `1` ပါ။ ဒါက credit အခြေခံတဲ့ limit တစ်ခုပါ — ရှိပြီးသား `Http2Stream` တွေကြောင့် ဒီ limit ကို ကျော်လွန်သွားနိုင်ပေမယ့် — limit ကျော်လွန်နေတဲ့ ကာလအတွင်းမှာ `Http2Stream` instances အသစ်တွေကိုတော့ ငြင်းပယ်ခံရပါလိမ့်မယ်။ လက်ရှိ `Http2Stream` sessions အရေအတွက်၊ header compression tables တွေရဲ့ လက်ရှိ memory အသုံးပြုမှု၊ open streams တွေက ထိန်းသိမ်းထားတဲ့ header blocks တွေ၊ ပို့ရန် queue တင်ထားတဲ့ လက်ရှိ data တွေနဲ့ — acknowledge မလုပ်ရသေးတဲ့ `PING` နဲ့ `SETTINGS` frames တွေ အားလုံးကို လက်ရှိ limit ဆီသို့ ရေတွက်ပါတယ်။ **Default:** `10`.
  * `maxHeaderListPairs` {number} Header entries အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ ဒါက `node:http` module ထဲက [`server.maxHeadersCount`][] သို့မဟုတ် [`request.maxHeadersCount`][] တို့နဲ့ ဆင်တူပါတယ်။ အနိမ့်ဆုံး တန်ဖိုးက `1` ပါ။ **Default:** `128`.
  * `maxOriginSetSize` {number} Server က ORIGIN frames တွေကနေတစ်ဆင့် ပို့နိုင်တဲ့ unique origins အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `128`.
  * `maxOutstandingPings` {number} Outstanding (ဆိုင်းငံ့ထား) ဖြစ်ပြီး acknowledge မလုပ်ရသေးတဲ့ pings အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `10`.
  * `maxReservedRemoteStreams` {number} Client က တစ်ချိန်ချိန်မှာ လက်ခံပေးမယ့် reserved push streams အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ လက်ရှိ reserved push streams အရေအတွက်က ဒီ limit ကို ရောက်ရှိ/ကျော်လွန်သွားတာနဲ့ — server က ပို့လိုက်တဲ့ push streams အသစ်တွေကို အလိုအလျောက် ငြင်းပယ်ပါလိမ့်မယ်။ ခွင့်ပြုထားတဲ့ အနိမ့်ဆုံး တန်ဖိုးက 0 ဖြစ်ပြီး — အများဆုံး ခွင့်ပြုထားတဲ့ တန်ဖိုးကတော့ 232-1 ပါ။ Negative တန်ဖိုးတစ်ခုက ဒီ option ကို ခွင့်ပြုထားတဲ့ အများဆုံး တန်ဖိုးအဖြစ် သတ်မှတ်ပေးပါတယ်။ **Default:** `200`.
  * `maxSendHeaderBlockLength` {number} Serialize လုပ်ပြီး compress လုပ်ထားတဲ့ headers block တစ်ခုအတွက် ခွင့်ပြုထားတဲ့ အများဆုံး အရွယ်အစားကို သတ်မှတ်ပေးပါတယ်။ ဒီ limit ကို ကျော်လွန်တဲ့ headers တွေကို ပို့ဖို့ ကြိုးစားတာက — `'frameError'` event တစ်ခုကို emit လုပ်ပြီး — stream ကို ပိတ်ပြီး destroy လုပ်သွားစေပါလိမ့်မယ်။
  * `paddingStrategy` {number} `HEADERS` နဲ့ `DATA` frames တွေအတွက် သုံးမယ့် padding ပမာဏကို ဆုံးဖြတ်ရာမှာ သုံးတဲ့ strategy ပါ။ **Default:** `http2.constants.PADDING_STRATEGY_NONE`. တန်ဖိုးက အောက်ပါတို့ထဲက တစ်ခု ဖြစ်နိုင်ပါတယ်:
    * `http2.constants.PADDING_STRATEGY_NONE`: Padding ကို လုံးဝ မသုံးပါဘူး။
    * `http2.constants.PADDING_STRATEGY_MAX`: အတွင်းပိုင်း implementation က ဆုံးဖြတ်တဲ့ padding အများဆုံး ပမာဏကို သုံးပါတယ်။
    * `http2.constants.PADDING_STRATEGY_ALIGNED`: 9-byte header အပါအဝင် — စုစုပေါင်း frame length က 8 ၏ အဆ (multiple) ဖြစ်အောင် သေချာစေဖို့ လုံလောက်တဲ့ padding ကို သုံးဖို့ ကြိုးစားပါတယ်။ Frame တစ်ခုစီအတွက် — လက်ရှိ flow control state နဲ့ settings တွေက ဆုံးဖြတ်ပေးတဲ့ — ခွင့်ပြုထားတဲ့ padding bytes အများဆုံး အရေအတွက် ရှိပါတယ်။ Alignment သေချာစေဖို့ လိုအပ်တဲ့ တွက်ချက်ထားတဲ့ ပမာဏထက် ဒီ maximum က နည်းနေရင် — maximum ကို သုံးပြီး — စုစုပေါင်း frame length က 8 bytes မှာ သေချာပေါက် aligned ဖြစ်နေမယ်လို့ မဆိုနိုင်ပါဘူး။
  * `peerMaxConcurrentStreams` {number} `SETTINGS` frame တစ်ခုကို လက်ခံရရှိခဲ့သလိုမျိုး — remote peer အတွက် concurrent streams အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။ Remote peer က `maxConcurrentStreams` အတွက် ကိုယ်ပိုင် တန်ဖိုးတစ်ခု သတ်မှတ်လိုက်ရင် — ဒီတန်ဖိုးကို override လုပ်ခံရပါလိမ့်မယ်။ **Default:** `100`.
  * `protocol` {string} `authority` ထဲမှာ သတ်မှတ်မထားရင် ချိတ်ဆက်ဖို့ သုံးမယ့် protocol ပါ။ တန်ဖိုးက `'http:'` သို့မဟုတ် `'https:'` နှစ်ခုအနက် တစ်ခု ဖြစ်နိုင်ပါတယ်။ **Default:** `'https:'`
  * `settings` {HTTP/2 Settings Object} Connection တည်ဆောက်ချိန်မှာ remote peer ဆီကို ပို့မယ့် ကနဦး (initial) settings တွေပါ။
  * `remoteCustomSettings` {Array} Integer values တွေရဲ့ array က — လက်ခံရရှိတဲ့ remoteSettings ရဲ့ `CustomSettings` property မှာ ပါဝင်တဲ့ — settings types တွေကို သတ်မှတ်ပေးပါတယ်။ ခွင့်ပြုထားတဲ့ setting types တွေအကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် `Http2Settings` object ရဲ့ `CustomSettings` property ကို ကြည့်ပါ။
  * `createConnection` {Function} Optional callback တစ်ခုပါ — `connect` ဆီကို ဖြတ်သန်းပေးခဲ့တဲ့ `URL` instance နဲ့ `options` object ကို လက်ခံပြီး — ဒီ session အတွက် connection အဖြစ် သုံးမယ့် [`Duplex`][] stream မည်သည့်အမျိုးအစားမဆို ပြန်ပေးပါတယ်။
  * `...options` {Object} [`net.connect()`][] သို့မဟုတ် [`tls.connect()`][] options မည်သည့်အရာမဆို ပေးနိုင်ပါတယ်။
  * `unknownProtocolTimeout` {number} [`'unknownProtocol'`][] event တစ်ခုကို emit လုပ်တဲ့အခါ server က စောင့်ဆိုင်းရမယ့် timeout ကို millisecond အနေနဲ့ သတ်မှတ်ပေးပါတယ်။ အဲဒီအချိန်မှာ socket ကို destroy မလုပ်ရသေးဘူးဆိုရင် — server က ၎င်းကို destroy လုပ်ပါလိမ့်မယ်။ **Default:** `10000`.
  * `strictFieldWhitespaceValidation` {boolean} `true` ဆိုရင် — [RFC-9113](https://www.rfc-editor.org/rfc/rfc9113.html#section-8.2.1) အရ HTTP/2 header field names နဲ့ values တွေအတွက် — leading နဲ့ trailing whitespace တွေကို — တင်းကျပ်တဲ့ (strict) validation ပြုလုပ်တာကို ဖွင့်ပေးပါတယ်။ **Default:** `true`.
* `listener` {Function} [`'connect'`][] event ရဲ့ one-time listener (တစ်ကြိမ်သုံး နားထောင်သူ) အဖြစ် မှတ်ပုံတင်ခံရပါလိမ့်မယ်။
* Returns: {ClientHttp2Session}

`ClientHttp2Session` instance တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { connect } from 'node:http2';
const client = connect('https://localhost:1234');

/* Use the client */

client.close();
```

```cjs
const http2 = require('node:http2');
const client = http2.connect('https://localhost:1234');

/* Use the client */

client.close();
```

### `http2.constants`
#### Header name ကိန်းသေများ (Header name constants)

`HTTP2_HEADER_*` constants တွေက HTTP/2 pseudo-headers နဲ့ လူသိများတဲ့ HTTP header names တွေအတွက် နာမည်တွေကို ပေးအပ်ပါတယ်။ ဒီ string constants တွေကို သုံးတာက မဖြစ်မနေ မဟုတ်ပဲ optional ပါ။ ဥပမာ — `http2.constants.HTTP2_HEADER_CONTENT_TYPE` က `'content-type'` နဲ့ တူညီပါတယ်။ ပုံမှန် (regular) header names တွေကို လက်ခံတဲ့ APIs တွေအတွက် — `http2.constants.HTTP2_HEADER_CONTENT_TYPE`, `'content-type'` နဲ့ `'Content-Type'` တို့က အာနိသင် တူညီပါတယ်; Node.js က နာမည်ကို lower-case (အက္ခရာအသေး) အနေနဲ့ serialize လုပ်ပါတယ်။

Regular header constants တွေကို — သက်ဆိုင်ရာ literal header name ကို လက်ခံတဲ့ နေရာတိုင်းမှာ — compatibility API နဲ့အတူ သုံးနိုင်ပါတယ်။ Compatibility API ရဲ့ request handlers တွေထဲမှာ — သက်ဆိုင်ရာ pseudo-headers တွေအတွက် — `request.method`, `request.authority`, `request.scheme` နဲ့ `request.url` တို့ကို ဦးစားပေး သုံးပါ။ တခြား incoming pseudo-headers တွေကတော့ `request.headers` ကနေတစ်ဆင့် ရရှိနိုင်ဆဲ ဖြစ်ပါတယ်။ Response status ကို `response.statusCode` ကနေတစ်ဆင့် သို့မဟုတ် `response.writeHead()` ဆီကို ပေးတဲ့ `statusCode` argument ကနေတစ်ဆင့် သတ်မှတ်ပါ။ `HTTP2_HEADER_STATUS` (`':status'`) ကို `response.setHeader()` ဆီကို ဖြတ်သန်းပေးတာ သို့မဟုတ် `response.writeHead()` ရဲ့ headers object ထဲမှာ ထည့်တာက `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` ကို throw လုပ်ပါတယ်။ `HTTP2_HEADER_PROTOCOL` က request pseudo-header တစ်ခု ဖြစ်ပြီး — response တစ်ခုထဲမှာ ပို့လို့ မရပါဘူး။

Incoming header object တွေရဲ့ keys တွေက lower-case ဖြစ်တာမို့ — ၎င်းတို့ကို object properties အဖြစ် ဝင်ရောက်သုံးတဲ့အခါ — constant တစ်ခု သို့မဟုတ် lower-case literal တစ်ခုကို သုံးပါ။ Constant တစ်ခုကို သုံးတာက header validation ကို ပြောင်းလဲစေခြင်း မရှိပဲ — constant တစ်ခု ရရှိနိုင်ခြင်းက အဲဒီ header က HTTP/2 context တိုင်းမှာ တရားဝင် (valid) ဖြစ်တယ်လို့ ဆိုလိုခြင်းလည်း မရှိပါဘူး။ Header casing နဲ့ validation အကြောင်း အသေးစိတ်အတွက် [HTTP/2 Headers Object][] နဲ့ [Invalid character handling in header names and values][] တို့ကို ကြည့်ပါ။

##### Pseudo-header ကိန်းသေများ (Pseudo-header constants)

`HTTP2_HEADER_METHOD`, `HTTP2_HEADER_AUTHORITY`, `HTTP2_HEADER_SCHEME` နဲ့ `HTTP2_HEADER_PATH` တို့က request pseudo-headers တွေကို ခွဲခြားဖော်ပြပါတယ်။ `HTTP2_HEADER_STATUS` က response pseudo-header ကို ခွဲခြားဖော်ပြပါတယ်။ `HTTP2_HEADER_PROTOCOL` က extended `CONNECT` request pseudo-header ကို ခွဲခြားဖော်ပြပါတယ်။ Pseudo-headers တွေကို trailers တွေထဲမှာ ခွင့်မပြုပါဘူး။

| Constant                                 | Value          |
| ---------------------------------------- | -------------- |
| `http2.constants.HTTP2_HEADER_STATUS`    | `':status'`    |
| `http2.constants.HTTP2_HEADER_METHOD`    | `':method'`    |
| `http2.constants.HTTP2_HEADER_AUTHORITY` | `':authority'` |
| `http2.constants.HTTP2_HEADER_SCHEME`    | `':scheme'`    |
| `http2.constants.HTTP2_HEADER_PATH`      | `':path'`      |
| `http2.constants.HTTP2_HEADER_PROTOCOL`  | `':protocol'`  |

##### Regular header ကိန်းသေများ (Regular header constants)

`HTTP2_HEADER_CONNECTION`, `HTTP2_HEADER_UPGRADE`, `HTTP2_HEADER_HTTP2_SETTINGS`, `HTTP2_HEADER_KEEP_ALIVE`, `HTTP2_HEADER_PROXY_CONNECTION` နဲ့ `HTTP2_HEADER_TRANSFER_ENCODING` constants တွေက — HTTP/2 က ခွင့်မပြုတဲ့ — connection-specific headers တွေကို ခွဲခြားဖော်ပြပါတယ်။ `HTTP2_HEADER_TE` ကတော့ ၎င်းရဲ့ တန်ဖိုးက `'trailers'` ဖြစ်တဲ့အခါမှသာ ခွင့်ပြုပါတယ်။

| Constant                                                        | Value                                |
| --------------------------------------------------------------- | ------------------------------------ |
| `http2.constants.HTTP2_HEADER_ACCEPT_ENCODING`                  | `'accept-encoding'`                  |
| `http2.constants.HTTP2_HEADER_ACCEPT_LANGUAGE`                  | `'accept-language'`                  |
| `http2.constants.HTTP2_HEADER_ACCEPT_RANGES`                    | `'accept-ranges'`                    |
| `http2.constants.HTTP2_HEADER_ACCEPT`                           | `'accept'`                           |
| `http2.constants.HTTP2_HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS` | `'access-control-allow-credentials'` |
| `http2.constants.HTTP2_HEADER_ACCESS_CONTROL_ALLOW_HEADERS`     | `'access-control-allow-headers'`     |
| `http2.constants.HTTP2_HEADER_ACCESS_CONTROL_ALLOW_METHODS`     | `'access-control-allow-methods'`     |
| `http2.constants.HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN`      | `'access-control-allow-origin'`      |
| `http2.constants.HTTP2_HEADER_ACCESS_CONTROL_EXPOSE_HEADERS`    | `'access-control-expose-headers'`    |
| `http2.constants.HTTP2_HEADER_ACCESS_CONTROL_REQUEST_HEADERS`   | `'access-control-request-headers'`   |
| `http2.constants.HTTP2_HEADER_ACCESS_CONTROL_REQUEST_METHOD`    | `'access-control-request-method'`    |
| `http2.constants.HTTP2_HEADER_AGE`                              | `'age'`                              |
| `http2.constants.HTTP2_HEADER_AUTHORIZATION`                    | `'authorization'`                    |
| `http2.constants.HTTP2_HEADER_CACHE_CONTROL`                    | `'cache-control'`                    |
| `http2.constants.HTTP2_HEADER_CONNECTION`                       | `'connection'`                       |
| `http2.constants.HTTP2_HEADER_CONTENT_DISPOSITION`              | `'content-disposition'`              |
| `http2.constants.HTTP2_HEADER_CONTENT_ENCODING`                 | `'content-encoding'`                 |
| `http2.constants.HTTP2_HEADER_CONTENT_LENGTH`                   | `'content-length'`                   |
| `http2.constants.HTTP2_HEADER_CONTENT_TYPE`                     | `'content-type'`                     |
| `http2.constants.HTTP2_HEADER_COOKIE`                           | `'cookie'`                           |
| `http2.constants.HTTP2_HEADER_DATE`                             | `'date'`                             |
| `http2.constants.HTTP2_HEADER_ETAG`                             | `'etag'`                             |
| `http2.constants.HTTP2_HEADER_FORWARDED`                        | `'forwarded'`                        |
| `http2.constants.HTTP2_HEADER_HOST`                             | `'host'`                             |
| `http2.constants.HTTP2_HEADER_IF_MODIFIED_SINCE`                | `'if-modified-since'`                |
| `http2.constants.HTTP2_HEADER_IF_NONE_MATCH`                    | `'if-none-match'`                    |
| `http2.constants.HTTP2_HEADER_IF_RANGE`                         | `'if-range'`                         |
| `http2.constants.HTTP2_HEADER_LAST_MODIFIED`                    | `'last-modified'`                    |
| `http2.constants.HTTP2_HEADER_LINK`                             | `'link'`                             |
| `http2.constants.HTTP2_HEADER_LOCATION`                         | `'location'`                         |
| `http2.constants.HTTP2_HEADER_RANGE`                            | `'range'`                            |
| `http2.constants.HTTP2_HEADER_REFERER`                          | `'referer'`                          |
| `http2.constants.HTTP2_HEADER_SERVER`                           | `'server'`                           |
| `http2.constants.HTTP2_HEADER_SET_COOKIE`                       | `'set-cookie'`                       |
| `http2.constants.HTTP2_HEADER_STRICT_TRANSPORT_SECURITY`        | `'strict-transport-security'`        |
| `http2.constants.HTTP2_HEADER_TRANSFER_ENCODING`                | `'transfer-encoding'`                |
| `http2.constants.HTTP2_HEADER_TE`                               | `'te'`                               |
| `http2.constants.HTTP2_HEADER_UPGRADE_INSECURE_REQUESTS`        | `'upgrade-insecure-requests'`        |
| `http2.constants.HTTP2_HEADER_UPGRADE`                          | `'upgrade'`                          |
| `http2.constants.HTTP2_HEADER_USER_AGENT`                       | `'user-agent'`                       |
| `http2.constants.HTTP2_HEADER_VARY`                             | `'vary'`                             |
| `http2.constants.HTTP2_HEADER_X_CONTENT_TYPE_OPTIONS`           | `'x-content-type-options'`           |
| `http2.constants.HTTP2_HEADER_X_FRAME_OPTIONS`                  | `'x-frame-options'`                  |
| `http2.constants.HTTP2_HEADER_KEEP_ALIVE`                       | `'keep-alive'`                       |
| `http2.constants.HTTP2_HEADER_PROXY_CONNECTION`                 | `'proxy-connection'`                 |
| `http2.constants.HTTP2_HEADER_X_XSS_PROTECTION`                 | `'x-xss-protection'`                 |
| `http2.constants.HTTP2_HEADER_ALT_SVC`                          | `'alt-svc'`                          |
| `http2.constants.HTTP2_HEADER_CONTENT_SECURITY_POLICY`          | `'content-security-policy'`          |
| `http2.constants.HTTP2_HEADER_EARLY_DATA`                       | `'early-data'`                       |
| `http2.constants.HTTP2_HEADER_EXPECT_CT`                        | `'expect-ct'`                        |
| `http2.constants.HTTP2_HEADER_ORIGIN`                           | `'origin'`                           |
| `http2.constants.HTTP2_HEADER_PURPOSE`                          | `'purpose'`                          |
| `http2.constants.HTTP2_HEADER_TIMING_ALLOW_ORIGIN`              | `'timing-allow-origin'`              |
| `http2.constants.HTTP2_HEADER_X_FORWARDED_FOR`                  | `'x-forwarded-for'`                  |
| `http2.constants.HTTP2_HEADER_PRIORITY`                         | `'priority'`                         |
| `http2.constants.HTTP2_HEADER_ACCEPT_CHARSET`                   | `'accept-charset'`                   |
| `http2.constants.HTTP2_HEADER_ACCESS_CONTROL_MAX_AGE`           | `'access-control-max-age'`           |
| `http2.constants.HTTP2_HEADER_ALLOW`                            | `'allow'`                            |
| `http2.constants.HTTP2_HEADER_CONTENT_LANGUAGE`                 | `'content-language'`                 |
| `http2.constants.HTTP2_HEADER_CONTENT_LOCATION`                 | `'content-location'`                 |
| `http2.constants.HTTP2_HEADER_CONTENT_MD5`                      | `'content-md5'`                      |
| `http2.constants.HTTP2_HEADER_CONTENT_RANGE`                    | `'content-range'`                    |
| `http2.constants.HTTP2_HEADER_DNT`                              | `'dnt'`                              |
| `http2.constants.HTTP2_HEADER_EXPECT`                           | `'expect'`                           |
| `http2.constants.HTTP2_HEADER_EXPIRES`                          | `'expires'`                          |
| `http2.constants.HTTP2_HEADER_FROM`                             | `'from'`                             |
| `http2.constants.HTTP2_HEADER_IF_MATCH`                         | `'if-match'`                         |
| `http2.constants.HTTP2_HEADER_IF_UNMODIFIED_SINCE`              | `'if-unmodified-since'`              |
| `http2.constants.HTTP2_HEADER_MAX_FORWARDS`                     | `'max-forwards'`                     |
| `http2.constants.HTTP2_HEADER_PREFER`                           | `'prefer'`                           |
| `http2.constants.HTTP2_HEADER_PROXY_AUTHENTICATE`               | `'proxy-authenticate'`               |
| `http2.constants.HTTP2_HEADER_PROXY_AUTHORIZATION`              | `'proxy-authorization'`              |
| `http2.constants.HTTP2_HEADER_REFRESH`                          | `'refresh'`                          |
| `http2.constants.HTTP2_HEADER_RETRY_AFTER`                      | `'retry-after'`                      |
| `http2.constants.HTTP2_HEADER_TRAILER`                          | `'trailer'`                          |
| `http2.constants.HTTP2_HEADER_TK`                               | `'tk'`                               |
| `http2.constants.HTTP2_HEADER_VIA`                              | `'via'`                              |
| `http2.constants.HTTP2_HEADER_WARNING`                          | `'warning'`                          |
| `http2.constants.HTTP2_HEADER_WWW_AUTHENTICATE`                 | `'www-authenticate'`                 |
| `http2.constants.HTTP2_HEADER_HTTP2_SETTINGS`                   | `'http2-settings'`                   |

#### Error codes for `RST_STREAM` and `GOAWAY`

| Value  | Name                | Constant                                      |
| ------ | ------------------- | --------------------------------------------- |
| `0x00` | No Error            | `http2.constants.NGHTTP2_NO_ERROR`            |
| `0x01` | Protocol Error      | `http2.constants.NGHTTP2_PROTOCOL_ERROR`      |
| `0x02` | Internal Error      | `http2.constants.NGHTTP2_INTERNAL_ERROR`      |
| `0x03` | Flow Control Error  | `http2.constants.NGHTTP2_FLOW_CONTROL_ERROR`  |
| `0x04` | Settings Timeout    | `http2.constants.NGHTTP2_SETTINGS_TIMEOUT`    |
| `0x05` | Stream Closed       | `http2.constants.NGHTTP2_STREAM_CLOSED`       |
| `0x06` | Frame Size Error    | `http2.constants.NGHTTP2_FRAME_SIZE_ERROR`    |
| `0x07` | Refused Stream      | `http2.constants.NGHTTP2_REFUSED_STREAM`      |
| `0x08` | Cancel              | `http2.constants.NGHTTP2_CANCEL`              |
| `0x09` | Compression Error   | `http2.constants.NGHTTP2_COMPRESSION_ERROR`   |
| `0x0a` | Connect Error       | `http2.constants.NGHTTP2_CONNECT_ERROR`       |
| `0x0b` | Enhance Your Calm   | `http2.constants.NGHTTP2_ENHANCE_YOUR_CALM`   |
| `0x0c` | Inadequate Security | `http2.constants.NGHTTP2_INADEQUATE_SECURITY` |
| `0x0d` | HTTP/1.1 Required   | `http2.constants.NGHTTP2_HTTP_1_1_REQUIRED`   |

`'timeout'` event ကို — `http2server.setTimeout()` ကို သုံးပြီး သတ်မှတ်ထားတဲ့ milliseconds အရေအတွက် တစ်ခုအတွက် — Server ပေါ်မှာ လှုပ်ရှားမှု (activity) တစ်စုံတစ်ရာ မရှိဘဲ ရှိနေတဲ့အခါ emit လုပ်ပါတယ်။

### `http2.getDefaultSettings()`

* Returns: {HTTP/2 Settings Object}

`Http2Session` instance တစ်ခုအတွက် default settings တွေ ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီ method ကို ခေါ်တိုင်း object instance အသစ်တစ်ခုကို ပြန်ပေးတာမို့ — ပြန်ရတဲ့ instances တွေကို အသုံးပြုဖို့အတွက် လုံခြုံစွာ ပြုပြင် (modify) လုပ်နိုင်ပါတယ်။

### `http2.getPackedSettings([settings])`

* `settings` {HTTP/2 Settings Object}
* Returns: {Buffer}

[HTTP/2][] specification မှာ သတ်မှတ်ထားတဲ့အတိုင်း — ပေးထားတဲ့ HTTP/2 settings တွေရဲ့ serialized ကိုယ်စားပြုမှု (representation) ပါဝင်တဲ့ `Buffer` instance တစ်ခုကို ပြန်ပေးပါတယ်။ ၎င်းက `HTTP2-Settings` header field နဲ့အတူ သုံးဖို့ ရည်ရွယ်ပါတယ်။

```mjs
import { getPackedSettings } from 'node:http2';

const packed = getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```

```cjs
const http2 = require('node:http2');

const packed = http2.getPackedSettings({ enablePush: false });

console.log(packed.toString('base64'));
// Prints: AAIAAAAA
```

### `http2.getUnpackedSettings(buf)`

* `buf` {Buffer|TypedArray} Packed settings များပါ။
* Returns: {HTTP/2 Settings Object}

`http2.getPackedSettings()` က ထုတ်ပေးလိုက်တဲ့ ပေးထားတဲ့ `Buffer` တစ်ခုထဲကနေ deserialize လုပ်ထားတဲ့ settings တွေ ပါဝင်တဲ့ [HTTP/2 Settings Object][] တစ်ခုကို ပြန်ပေးပါတယ်။

### `http2.performServerHandshake(socket[, options])`

* `socket` {stream.Duplex}
* `options` {Object} [`http2.createServer()`][] option တွေ မည်သည့်အရာမဆို ပေးအပ်နိုင်ပါတယ်။
* Returns: {ServerHttp2Session}

ရှိပြီးသား socket တစ်ခုကနေ HTTP/2 server session တစ်ခုကို ဖန်တီးပါတယ်။

### `http2.sensitiveHeaders`

* Type: {symbol}

ဒီ symbol ကို — sensitive (ထိခိုက်နိုင်ခြေရှိသော) လို့ မှတ်ယူရမယ့် headers တွေရဲ့ စာရင်းကို ပေးအပ်ဖို့အတွက် — HTTP/2 headers object ပေါ်မှာ array value တစ်ခုနဲ့ property တစ်ခုအနေနဲ့ သတ်မှတ်နိုင်ပါတယ်။ နောက်ထပ် အသေးစိတ်အတွက် [Sensitive headers][] ကို ကြည့်ပါ။

### Headers object (headers object — headers များကို ကိုယ်စားပြုသော object)

Headers တွေကို JavaScript objects တွေရဲ့ပေါ်မှာ own-properties (ကိုယ်ပိုင် properties) တွေအနေနဲ့ ကိုယ်စားပြုပါတယ်။ Property keys တွေကို lower-case အဖြစ် serialize လုပ်ပါလိမ့်မယ်။ Property values တွေက strings တွေ ဖြစ်သင့်ပြီး — (မဟုတ်ရင် ၎င်းတို့ကို strings တွေအဖြစ် အတင်းပြောင်းလဲ (coerce) လုပ်ပါလိမ့်မယ်) — သို့မဟုတ် strings တွေရဲ့ `Array` တစ်ခု ဖြစ်နိုင်ပါတယ် (header field တစ်ခုအတွက် တန်ဖိုး တစ်ခုထက်ပိုပြီး ပို့နိုင်စေဖို့အတွက်ပါ)။

```js
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'ABC': ['has', 'more', 'than', 'one', 'value'],
};

stream.respond(headers);
```

Callback functions တွေဆီကို ဖြတ်သန်းပေးတဲ့ header objects တွေမှာ `null` prototype ရှိပါလိမ့်မယ်။ ဒါကြောင့် — `Object.prototype.toString()` နဲ့ `Object.prototype.hasOwnProperty()` လိုမျိုး — ပုံမှန် JavaScript object methods တွေ အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။

Incoming headers တွေအတွက်:

* `:status` header ကို `number` အဖြစ် ပြောင်းလဲပေးပါတယ်။
* `:status`, `:method`, `:authority`, `:scheme`, `:path`, `:protocol`, `age`, `authorization`, `access-control-allow-credentials`, `access-control-max-age`, `access-control-request-method`, `content-encoding`, `content-language`, `content-length`, `content-location`, `content-md5`, `content-range`, `content-type`, `date`, `dnt`, `etag`, `expires`, `from`, `host`, `if-match`, `if-modified-since`, `if-none-match`, `if-range`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `range`, `referer`,`retry-after`, `tk`, `upgrade-insecure-requests`, `user-agent` သို့မဟုတ် `x-content-type-options` တို့ရဲ့ ပုံတူ (duplicate) များကို ပစ်ပယ် (discard) ပါတယ်။
* `set-cookie` က အမြဲတမ်း array တစ်ခုပါ။ ပုံတူများကို array ထဲကို ထည့်သွင်းပါတယ်။
* ပုံတူ `cookie` headers တွေအတွက်တော့ — တန်ဖိုးတွေကို '; ' နဲ့ ပေါင်းစပ်ပါတယ်။
* တခြား headers တွေ အားလုံးအတွက်တော့ — တန်ဖိုးတွေကို ', ' နဲ့ ပေါင်းစပ်ပါတယ်။

```mjs
import { createServer } from 'node:http2';
const server = createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```

```cjs
const http2 = require('node:http2');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  console.log(headers[':path']);
  console.log(headers.ABC);
});
```

#### Raw headers (raw headers — မူရင်းအတိုင်း ရှိသော headers)

APIs တစ်ချို့မှာ — object format အပြင် — headers တွေကို raw flat array (မူရင်း ပြားချပ်သော array) တစ်ခုအနေနဲ့လည်း ဖြတ်သန်း သို့မဟုတ် ဝင်ရောက် သုံးစွဲနိုင်ပြီး — မူရင်း (raw) ပို့လွှတ်မှု ပုံစံနဲ့ ကိုက်ညီဖို့ — ordering (အစီအစဉ်) နဲ့ duplicate keys တွေရဲ့ အသေးစိတ် အချက်အလက်တွေကို ထိန်းသိမ်းထားပါတယ်။

ဒီ format ထဲမှာ keys နဲ့ values တွေက စာရင်း (list) တစ်ခုတည်းထဲမှာ ရှိပါတယ်။ ၎င်းက tuples တွေရဲ့ စာရင်းတစ်ခု _မဟုတ်ပါဘူး_ (is not)။ ဒါကြောင့် — စုံကိန်း (even-numbered) offsets တွေက key values တွေ ဖြစ်ပြီး — မကိန်း (odd-numbered) offsets တွေကတော့ ဆက်စပ်နေတဲ့ values တွေပါ။ Duplicate headers တွေကို ပေါင်းစပ်မလုပ်ပဲ — key-value pair တစ်ခုချင်းစီက သီးခြားစီ ပေါ်လာပါလိမ့်မယ်။

ဒါက — လက်ခံရရှိထားတဲ့အတိုင်း headers တွေကို အတိအကျ ထပ်ဆင့် ပို့လွှတ် (forward) သင့်တဲ့ — proxies လိုမျိုး အခြေအနေတွေမှာ အသုံးဝင်နိုင်သလို — headers တွေက raw format နဲ့ ရရှိနှင့်ပြီးသား ဖြစ်တဲ့အခါ — performance ပိုင်း အကောင်းဆုံးဖြစ်အောင် (optimization) လုပ်ခြင်းအနေနဲ့လည်း အသုံးဝင်နိုင်ပါတယ်။

```js
const rawHeaders = [
  ':status',
  '404',
  'content-type',
  'text/plain',
];

stream.respond(rawHeaders);
```

#### Sensitive headers (sensitive headers — ထိခိုက်နိုင်ခြေရှိသော headers)

HTTP2 headers တွေကို sensitive (ထိခိုက်နိုင်ခြေရှိသော) အဖြစ် အမှတ်အသား (mark) လုပ်နိုင်ပြီး — ဒါက HTTP/2 header compression algorithm က ၎င်းတို့ကို ဘယ်တော့မှ index လုပ်မှာ မဟုတ်ဘူးလို့ ဆိုလိုပါတယ်။ ဒါက — entropy နည်းပြီး — တိုက်ခိုက်သူ (attacker) တစ်ယောက်အတွက် တန်ဖိုးရှိနိုင်တယ်လို့ မှတ်ယူရမယ့် — header values တွေအတွက် သင့်လျော်ပါတယ်။ ဥပမာ — `Cookie` သို့မဟုတ် `Authorization` လိုမျိုးပါ။ ဒါကို အောင်မြင်စေဖို့ — header name ကို `[http2.sensitiveHeaders]` property ဆီကို array တစ်ခုအနေနဲ့ ထည့်သွင်းပါ:

```js
const headers = {
  ':status': '200',
  'content-type': 'text-plain',
  'cookie': 'some-cookie',
  'other-sensitive-header': 'very secret data',
  [http2.sensitiveHeaders]: ['cookie', 'other-sensitive-header'],
};

stream.respond(headers);
```

`Authorization` နဲ့ တိုတောင်းတဲ့ `Cookie` headers လိုမျိုး headers တစ်ချို့အတွက်တော့ — ဒီ flag ကို အလိုအလျောက် သတ်မှတ်ပေးပါတယ်။

ဒီ property ကို လက်ခံရရှိတဲ့ headers တွေအတွက်လည်း သတ်မှတ်ပေးပါတယ်။ ၎င်းထဲမှာ — အလိုအလျောက် အမှတ်အသား လုပ်ထားတဲ့ headers တွေ အပါအဝင် — sensitive အဖြစ် အမှတ်အသား လုပ်ထားတဲ့ headers တွေ အားလုံးရဲ့ နာမည်တွေ ပါဝင်ပါလိမ့်မယ်။

Raw headers တွေအတွက်တော့ — ၎င်းကို array ရဲ့ အတွင်းမှာ သီးခြား key-value pair တစ်ခုအနေနဲ့ မဟုတ်ပဲ — `rawHeadersArray[http2.sensitiveHeaders] = ['cookie']` လိုမျိုး — array ပေါ်မှာ property တစ်ခုအနေနဲ့ သတ်မှတ်ထားသင့်ပါတယ်။

### Settings object (settings object — Http2Session တစ်ခုအတွက် configuration settings များ ပါဝင်သော object)

`http2.getDefaultSettings()`, `http2.getPackedSettings()`, `http2.createServer()`, `http2.createSecureServer()`, `http2session.settings()`, `http2session.localSettings` နဲ့ `http2session.remoteSettings` APIs တွေက — `Http2Session` object တစ်ခုအတွက် configuration settings တွေကို သတ်မှတ်ပေးတဲ့ object တစ်ခုကို — ပြန်ပေးပါတယ် သို့မဟုတ် input အနေနဲ့ လက်ခံပါတယ်။ ဒီ objects တွေက အောက်ပါ properties တွေ ပါဝင်တဲ့ သာမန် JavaScript objects တွေပါ။

* `headerTableSize` {number} Header compression အတွက် သုံးစွဲမယ့် bytes အများဆုံး အရေအတွက်ကို သတ်မှတ်ပါတယ်။ ခွင့်ပြုထားတဲ့ အနိမ့်ဆုံး တန်ဖိုးက 0 ဖြစ်ပြီး — အမြင့်ဆုံး ခွင့်ပြုတန်ဖိုးကတော့ 232-1 ပါ။ **Default:** `4096`.
* `enablePush` {boolean} `Http2Session` instances တွေပေါ်မှာ HTTP/2 Push Streams တွေကို ခွင့်ပြုရမယ်ဆိုရင် `true` လို့ သတ်မှတ်ပါတယ်။ **Default:** `true`.
* `initialWindowSize` {number} Stream-level flow control အတွက် _ပို့လွှတ်သူ၏ (sender's)_ initial window size ကို bytes နဲ့ သတ်မှတ်ပါတယ်။ ခွင့်ပြုထားတဲ့ အနိမ့်ဆုံး တန်ဖိုးက 0 ဖြစ်ပြီး — အမြင့်ဆုံး ခွင့်ပြုတန်ဖိုးကတော့ 232-1 ပါ။ **Default:** `65535`.
* `maxFrameSize` {number} အကြီးဆုံး frame payload ရဲ့ အရွယ်အစားကို bytes နဲ့ သတ်မှတ်ပါတယ်။ ခွင့်ပြုထားတဲ့ အနိမ့်ဆုံး တန်ဖိုးက 16,384 ဖြစ်ပြီး — အမြင့်ဆုံး ခွင့်ပြုတန်ဖိုးကတော့ 224-1 ပါ။ **Default:** `16384`.
* `maxConcurrentStreams` {number} `Http2Session` တစ်ခုပေါ်မှာ ခွင့်ပြုထားတဲ့ concurrent streams တွေရဲ့ အများဆုံး အရေအတွက်ကို သတ်မှတ်ပါတယ်။ Default တန်ဖိုး မရှိတာက — သီအိုရီအရ အနည်းဆုံးတော့ — `Http2Session` တစ်ခုမှာ ဘယ်အချိန်မဆို streams 232-1 ခုအထိ တစ်ပြိုင်နက် ဖွင့်ထားနိုင်တယ်လို့ ဆိုလိုပါတယ်။ အနိမ့်ဆုံး တန်ဖိုးက 0 ဖြစ်ပြီး — အမြင့်ဆုံး ခွင့်ပြုတန်ဖိုးကတော့ 232-1 ပါ။ **Default:** `4294967295`.
* `maxHeaderListSize` {number} လက်ခံမယ့် header list ရဲ့ အများဆုံး အရွယ်အစား (uncompressed octets) ကို သတ်မှတ်ပါတယ်။ ခွင့်ပြုထားတဲ့ အနိမ့်ဆုံး တန်ဖိုးက 0 ဖြစ်ပြီး — အမြင့်ဆုံး ခွင့်ပြုတန်ဖိုးကတော့ 232-1 ပါ။ **Default:** `65535`.
* `maxHeaderSize` {number} `maxHeaderListSize` ရဲ့ alias (အဓိပ္ပာယ်တူ နာမည်) တစ်ခုပါ။
* `enableConnectProtocol` {boolean} [RFC 8441][] မှာ သတ်မှတ်ထားတဲ့ "Extended Connect Protocol" ကို enable လုပ်ရမယ်ဆိုရင် `true` လို့ သတ်မှတ်ပါတယ်။ ဒီ setting က server က ပို့လွှတ်တဲ့အခါမှသာ အဓိပ္ပာယ် ရှိပါတယ်။ `enableConnectProtocol` setting ကို `Http2Session` တစ်ခုအတွက် enable လုပ်လိုက်ပြီးတာနဲ့ — ၎င်းကို disable လုပ်လို့ မရတော့ပါဘူး။ **Default:** `false`.
* `customSettings` {Object} Node.js နဲ့ underlying libraries တွေမှာ အကောင်အထည် မဖော်ရသေးတဲ့ (yet not implemented) ထပ်ဆောင်း settings တွေကို သတ်မှတ်ပါတယ်။ Object ရဲ့ key က settings type ရဲ့ numeric value ကို သတ်မှတ်ပေးပြီး — (ဒီ value ကို \[RFC 7540] က တည်ထောင်ထားတဲ့ "HTTP/2 SETTINGS" registry ထဲမှာ သတ်မှတ်ထားပါတယ်) — values တွေကတော့ settings တွေရဲ့ တကယ့် (actual) numeric values တွေပါ။ Settings type က 1 ကနေ 2^16-1 ကြားက integer တစ်ခု ဖြစ်ရပါမယ်။ ၎င်းက node မှာ ကိုင်တွယ်ပြီးသား settings type တစ်ခု မဖြစ်သင့်ပါဘူး — ဆိုလိုတာက လောလောဆယ် 6 ထက် ကြီးသင့်ပါတယ် — ဒါပေမယ့် အဲဒါက error တော့ မဟုတ်ပါဘူး။ Values တွေက 0 ကနေ 2^32-1 ကြားက unsigned integers တွေ ဖြစ်ရပါမယ်။ လောလောဆယ် custom settings အများဆုံး 10 ခုအထိ support လုပ်ပါတယ်။ ၎င်းကို SETTINGS ပို့လွှတ်ခြင်း အတွက် သို့မဟုတ် — server သို့မဟုတ် client object ရဲ့ `remoteCustomSettings` options တွေထဲမှာ သတ်မှတ်ထားတဲ့ settings values တွေကို လက်ခံရရှိခြင်း အတွက်သာ support လုပ်ပါတယ်။ Settings id တစ်ခုအတွက် `customSettings` ယန္တရားကို — natively ကိုင်တွယ်တဲ့ settings တွေအတွက် interfaces တွေနဲ့ — ရောနှောမသုံးပါနဲ့ — အကြောင်းကတော့ အနာဂတ် node version တစ်ခုမှာ setting တစ်ခု natively supported ဖြစ်လာနိုင်လို့ပါ။

Settings object ပေါ်က ထပ်ဆောင်း properties တွေ အားလုံးကို လျစ်လျူရှုပါတယ်။

### Error ကိုင်တွယ်ခြင်း (Error handling)

`node:http2` module ကို သုံးတဲ့အခါ ဖြစ်ပေါ်လာနိုင်တဲ့ error အခြေအနေ (condition) အမျိုးအစားများစွာ ရှိပါတယ်:

Validation errors တွေက — မမှန်ကန်တဲ့ argument တစ်ခု, option တစ်ခု သို့မဟုတ် setting value တစ်ခုကို ဖြတ်သန်းပေးလိုက်တဲ့အခါ — ဖြစ်ပေါ်ပါတယ်။ ၎င်းတို့ကို synchronous `throw` တစ်ခုအားဖြင့် အမြဲတမ်း အစီရင်ခံပါတယ်။

State errors တွေက — မှားယွင်းတဲ့ အချိန်အခါတစ်ခုမှာ လုပ်ဆောင်ချက်တစ်ခုကို ကြိုးစားလုပ်တဲ့အခါ (ဥပမာ — stream တစ်ခု ပိတ်သွားပြီးနောက်မှာ ၎င်းပေါ်ကို data ပို့ဖို့ ကြိုးစားခြင်း) — ဖြစ်ပေါ်ပါတယ်။ ၎င်းတို့ကို — error ဖြစ်ပွားတဲ့ နေရာနဲ့ အချိန်ပေါ် မူတည်ပြီး — synchronous `throw` တစ်ခု သို့မဟုတ် `Http2Stream`, `Http2Session` သို့မဟုတ် HTTP/2 Server objects တွေပေါ်က `'error'` event တစ်ခုကနေတစ်ဆင့် အစီရင်ခံပါတယ်။

Internal errors တွေက HTTP/2 session တစ်ခု မမျှော်လင့်ဘဲ မအောင်မြင်တဲ့အခါ ဖြစ်ပေါ်ပါတယ်။ ၎င်းတို့ကို `Http2Session` သို့မဟုတ် HTTP/2 Server objects တွေပေါ်က `'error'` event တစ်ခုကနေတစ်ဆင့် အစီရင်ခံပါတယ်။

Protocol errors တွေက — HTTP/2 protocol ရဲ့ ကန့်သတ်ချက် (constraint) အမျိုးမျိုးကို ချိုးဖောက်တဲ့အခါ — ဖြစ်ပေါ်ပါတယ်။ ၎င်းတို့ကို — error ဖြစ်ပွားတဲ့ နေရာနဲ့ အချိန်ပေါ် မူတည်ပြီး — synchronous `throw` တစ်ခု သို့မဟုတ် `Http2Stream`, `Http2Session` သို့မဟုတ် HTTP/2 Server objects တွေပေါ်က `'error'` event တစ်ခုကနေတစ်ဆင့် အစီရင်ခံပါတယ်။

### Header names နဲ့ values များထဲက မမှန်ကန်သော character များကို ကိုင်တွယ်ခြင်း (Invalid character handling in header names and values)

HTTP/2 implementation က HTTP/1 implementation ထက် — HTTP header names နဲ့ values တွေထဲက မမှန်ကန်တဲ့ characters တွေကို — ပိုတင်းကျပ်တဲ့ ကိုင်တွယ်မှု ပြုလုပ်ပါတယ်။

Header field names တွေက _case-insensitive_ (စာလုံးအကြီး/အသေး ခွဲခြားမှု မရှိသော) ဖြစ်ပြီး — wire ပေါ်မှာ lower-case strings တွေအနေနဲ့သာ တင်းကျပ်စွာ ပို့လွှတ်ပါတယ်။ Node.js က ပံ့ပိုးပေးတဲ့ API က header names တွေကို mixed-case strings တွေအနေနဲ့ သတ်မှတ်ခွင့် ပြုပေမယ့် — (ဥပမာ `Content-Type`) — ပို့လွှတ်တဲ့အခါ ၎င်းတို့ကို lower-case (ဥပမာ `content-type`) အဖြစ် ပြောင်းလဲပေးပါလိမ့်မယ်။

Header field-names တွေမှာ အောက်ပါ ASCII characters တွေထဲက တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတာတွေသာ ပါဝင်ရမယ် (must only): `a`-`z`, `A`-`Z`, `0`-`9`, `!`, `#`, `$`, `%`, `&`, `'`, `*`, `+`, `-`, `.`, `^`, `_`, `` ` `` (backtick), `|` နဲ့ `~` တို့ပါ။

HTTP header field name တစ်ခုအတွင်းမှာ မမှန်ကန်တဲ့ characters တွေ သုံးလိုက်ရင် — protocol error တစ်ခုကို အစီရင်ခံပြီး — stream ကို ပိတ်ပစ်မှာ ဖြစ်ပါတယ်။

Header field values တွေကိုတော့ ပိုပြီး ပျော့ပြောင်းစွာ ကိုင်တွယ်ပေမယ့် — HTTP specification ရဲ့ လိုအပ်ချက်တွေအရ — ၎င်းတို့ထဲမှာ new-line သို့မဟုတ် carriage return characters တွေ မပါဝင်သင့်ပဲ — US-ASCII characters တွေနဲ့သာ ကန့်သတ်ထား_သင့်ပါတယ်_ (should)။

### Client ပေါ်ရှိ Push streams (Push streams on the client)

Client ပေါ်မှာ pushed streams တွေကို လက်ခံရရှိဖို့ — `ClientHttp2Session` ပေါ်မှာ `'stream'` event အတွက် listener တစ်ခု သတ်မှတ်ပါ:

```mjs
import { connect } from 'node:http2';

const client = connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Process response headers
  });
  pushedStream.on('data', (chunk) => { /* handle pushed data */ });
});

const req = client.request({ ':path': '/' });
```

```cjs
const http2 = require('node:http2');

const client = http2.connect('http://localhost');

client.on('stream', (pushedStream, requestHeaders) => {
  pushedStream.on('push', (responseHeaders) => {
    // Process response headers
  });
  pushedStream.on('data', (chunk) => { /* handle pushed data */ });
});

const req = client.request({ ':path': '/' });
```

### Supporting the `CONNECT` method

`CONNECT` method ကို — HTTP/2 server တစ်ခုကို TCP/IP connections တွေအတွက် proxy တစ်ခုအနေနဲ့ သုံးနိုင်စေဖို့အတွက် — အသုံးပြုပါတယ်။

ရိုးရှင်းတဲ့ TCP Server တစ်ခု:

```mjs
import { createServer } from 'node:net';

const server = createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```

```cjs
const net = require('node:net');

const server = net.createServer((socket) => {
  let name = '';
  socket.setEncoding('utf8');
  socket.on('data', (chunk) => name += chunk);
  socket.on('end', () => socket.end(`hello ${name}`));
});

server.listen(8000);
```

HTTP/2 CONNECT proxy တစ်ခု:

```mjs
import { createServer, constants } from 'node:http2';
const { NGHTTP2_REFUSED_STREAM, NGHTTP2_CONNECT_ERROR } = constants;
import { connect } from 'node:net';

const proxy = createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Only accept CONNECT requests
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // It's a very good idea to verify that hostname and port are
  // things this proxy should be connecting to.
  const socket = connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```

```cjs
const http2 = require('node:http2');
const { NGHTTP2_REFUSED_STREAM } = http2.constants;
const net = require('node:net');

const proxy = http2.createServer();
proxy.on('stream', (stream, headers) => {
  if (headers[':method'] !== 'CONNECT') {
    // Only accept CONNECT requests
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[':authority']}`);
  // It's a very good idea to verify that hostname and port are
  // things this proxy should be connecting to.
  const socket = net.connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on('error', (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
```

HTTP/2 CONNECT client တစ်ခု:

```mjs
import { connect, constants } from 'node:http2';

const client = connect('http://localhost:8001');

// Must not specify the ':path' and ':scheme' headers
// for CONNECT requests or an error will be thrown.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```

```cjs
const http2 = require('node:http2');

const client = http2.connect('http://localhost:8001');

// Must not specify the ':path' and ':scheme' headers
// for CONNECT requests or an error will be thrown.
const req = client.request({
  ':method': 'CONNECT',
  ':authority': 'localhost:8000',
});

req.on('response', (headers) => {
  console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
});
let data = '';
req.setEncoding('utf8');
req.on('data', (chunk) => data += chunk);
req.on('end', () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end('Jane');
```

### The extended `CONNECT` protocol

[RFC 8441][] က HTTP/2 အတွက် "Extended CONNECT Protocol" extension တစ်ခုကို သတ်မှတ်ပေးထားပြီး — ၎င်းကို — တခြား communication protocols တွေ (WebSockets လိုမျိုး) အတွက် tunnel (လိုဏ်ခေါင်း) တစ်ခုအနေနဲ့ — `CONNECT` method ကို သုံးတဲ့ `Http2Stream` တစ်ခုရဲ့ အသုံးပြုမှုကို အစပျိုး (bootstrap) လုပ်ဖို့ သုံးနိုင်ပါတယ်။

Extended CONNECT Protocol ရဲ့ အသုံးပြုမှုကို — HTTP/2 servers တွေက `enableConnectProtocol` setting ကို သုံးပြီး enable လုပ်ပါတယ်:

```mjs
import { createServer } from 'node:http2';
const settings = { enableConnectProtocol: true };
const server = createServer({ settings });
```

```cjs
const http2 = require('node:http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
```

Client က server ဆီကနေ — extended CONNECT ကို သုံးနိုင်ကြောင်း ညွှန်ပြတဲ့ — `SETTINGS` frame တစ်ခုကို လက်ခံရရှိတာနဲ့ — ၎င်းက `':protocol'` HTTP/2 pseudo-header ကို သုံးတဲ့ `CONNECT` requests တွေကို ပို့နိုင်ပါတယ်:

```mjs
import { connect } from 'node:http2';
const client = connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```

```cjs
const http2 = require('node:http2');
const client = http2.connect('http://localhost:8080');
client.on('remoteSettings', (settings) => {
  if (settings.enableConnectProtocol) {
    const req = client.request({ ':method': 'CONNECT', ':protocol': 'foo' });
    // ...
  }
});
```

## Compatibility API (လိုက်ဖက်ညီသော API)

Compatibility API ရဲ့ ရည်မှန်းချက်က — HTTP/2 ကို သုံးတဲ့အခါ HTTP/1 နဲ့ ဆင်တူတဲ့ developer အတွေ့အကြုံ (developer experience) တစ်ခုကို ပေးအပ်ဖို့ ဖြစ်ပြီး — [HTTP/1][] ရော HTTP/2 ပါ support လုပ်တဲ့ applications တွေကို တီထွင်ဖို့ ဖြစ်နိုင်စေပါတယ်။ ဒီ API က [HTTP/1][] ရဲ့ **public API** ကိုသာ ရည်ရွယ်ပါတယ်။ ဒါပေမယ့် — modules တွေ အများအပြားက internal methods သို့မဟုတ် state တွေကို သုံးတတ်ပြီး — ၎င်းတို့ကတော့ လုံးဝ ကွဲပြားတဲ့ implementation တစ်ခု ဖြစ်တာမို့ — support လုပ်_ခြင်း မရှိပါဘူး_ (are not supported)။

အောက်က ဥပမာက compatibility API ကို သုံးပြီး HTTP/2 server တစ်ခုကို ဖန်တီးပါတယ်:

```mjs
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Foo': 'bar',
  });
  res.end('ok');
});
```

```cjs
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Foo': 'bar',
  });
  res.end('ok');
});
```

[HTTPS][] ရော HTTP/2 ပါ ရောနှောထားတဲ့ server တစ်ခုကို ဖန်တီးဖို့အတွက် — [ALPN negotiation][] section ကို ကိုးကားပါ။ Non-tls HTTP/1 servers တွေကနေ upgrade လုပ်တာကိုတော့ support မလုပ်ပါဘူး။

HTTP/2 compatibility API က [`Http2ServerRequest`][] နဲ့ [`Http2ServerResponse`][] တို့နဲ့ ဖွဲ့စည်းထားပါတယ်။ ၎င်းတို့က HTTP/1 နဲ့ API ပိုင်း လိုက်ဖက်ညီမှုကို ရည်ရွယ်ပေမယ့် — protocols တွေကြားက ကွာခြားချက်တွေကိုတော့ ဖုံးကွယ်မထားပါဘူး။ ဥပမာအနေနဲ့ — HTTP codes တွေအတွက် status message ကို လျစ်လျူရှုပါတယ်။

### ALPN ညှိနှိုင်းခြင်း (ALPN negotiation)

ALPN negotiation က — socket တစ်ခုတည်းပေါ်မှာ — [HTTPS][] ရော HTTP/2 ပါ support လုပ်နိုင်စေပါတယ်။ `req` နဲ့ `res` objects တွေက HTTP/1 သို့မဟုတ် HTTP/2 ဖြစ်နိုင်ပြီး — application တစ်ခုက [HTTP/1][] ရဲ့ public API ကိုသာ သုံးဖို့ **မဖြစ်မနေ** (must) ကန့်သတ်ထားကာ — HTTP/2 ရဲ့ ပိုအဆင့်မြင့်တဲ့ (advanced) features တွေကို သုံးဖို့ ဖြစ်နိုင်ခြေ ရှိမရှိကို စစ်ဆေး (detect) ရပါတယ်။

အောက်က ဥပမာက protocols နှစ်ခုလုံးကို support လုပ်တဲ့ server တစ်ခုကို ဖန်တီးပါတယ်:

```mjs
import { createSecureServer } from 'node:http2';
import { readFileSync } from 'node:fs';

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(8000);

function onRequest(req, res) {
  // Detects if it is an HTTPS request or HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```

```cjs
const { createSecureServer } = require('node:http2');
const { readFileSync } = require('node:fs');

const cert = readFileSync('./cert.pem');
const key = readFileSync('./key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: true },
  onRequest,
).listen(4443);

function onRequest(req, res) {
  // Detects if it is an HTTPS request or HTTP/2
  const { socket: { alpnProtocol } } = req.httpVersion === '2.0' ?
    req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    alpnProtocol,
    httpVersion: req.httpVersion,
  }));
}
```

`'request'` event က [HTTPS][] ရော HTTP/2 မှာပါ ထပ်တူကျတဲ့ (identically) ပုံစံနဲ့ အလုပ်လုပ်ပါတယ်။

### Class: `http2.Http2ServerRequest`

* Extends: {stream.Readable}

`Http2ServerRequest` object တစ်ခုကို [`http2.Server`][] သို့မဟုတ် [`http2.SecureServer`][] က ဖန်တီးပြီး — [`'request'`][] event ဆီကို ပထမဆုံး argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ ၎င်းကို request တစ်ခုရဲ့ status, headers နဲ့ data တွေကို ဝင်ရောက်ကြည့်ရှုဖို့ သုံးနိုင်ပါတယ်။

#### Event: `'aborted'`

`'aborted'` event က `Http2ServerRequest` instance တစ်ခုကို ဆက်သွယ်မှု အလယ်မှာ ပုံမှန်မဟုတ်ပဲ (abnormally) abort လုပ်ခံရတိုင်း emit လုပ်ပါတယ်။

`'aborted'` event က `Http2ServerRequest` ရဲ့ writable ဘက်ကို end မလုပ်ရသေးဘူးဆိုရင်မှသာ emit လုပ်ပါလိမ့်မယ်။

#### Event: `'close'`

Underlying [`Http2Stream`][] ကို ပိတ်လိုက်ကြောင်း ဖော်ပြပါတယ်။ `'end'` လိုပဲ — ဒီ event က response တစ်ခုအတွက် တစ်ကြိမ်တည်းသာ ဖြစ်ပေါ်ပါတယ်။

#### `request.aborted`

* Type: {boolean}

`request.aborted` property က request ကို abort လုပ်ခဲ့ရင် `true` ဖြစ်ပါလိမ့်မယ်။

#### `request.authority`

* Type: {string}

Request ရဲ့ authority pseudo header field ပါ။ HTTP/2 က requests တွေကို `:authority` သို့မဟုတ် `host` နှစ်ခုအနက် တစ်ခုခုကို သတ်မှတ်ခွင့် ပြုထားတာမို့ — ဒီတန်ဖိုးကို `req.headers[':authority']` ရှိနေရင် ၎င်းကနေ ဆင်းသက်လာပြီး — မရှိရင်တော့ `req.headers['host']` ကနေ ဆင်းသက်ပါတယ်။

#### `request.complete`

* Type: {boolean}

`request.complete` property က request ကို ပြီးမြောက်ခဲ့တာ, abort လုပ်ခဲ့တာ သို့မဟုတ် destroy လုပ်ခဲ့တာဆိုရင် `true` ဖြစ်ပါလိမ့်မယ်။

#### `request.connection`

> Stability: 0 - Deprecated. Use [`request.socket`][].

* Type: {net.Socket|tls.TLSSocket}

[`request.socket`][] ကို ကြည့်ပါ။

#### `request.destroy([error])`

* `error` {Error}

[`Http2ServerRequest`][] ကို လက်ခံရရှိခဲ့တဲ့ [`Http2Stream`][] ပေါ်မှာ `destroy()` ကို ခေါ်ပါတယ်။ `error` ပေးထားရင် — `'error'` event တစ်ခုကို emit လုပ်ပြီး — event ပေါ်က listeners တွေဆီကို `error` ကို argument တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးပါတယ်။

Stream ကို destroy လုပ်ပြီးသား ဖြစ်နေရင်တော့ ဘာမှ မလုပ်ပါဘူး။

#### `request.headers`

* Type: {Object}

Request/response headers object ပါ။

Header names နဲ့ values တွေရဲ့ key-value pairs တွေပါ။ Header names တွေကို lower-case ပြုလုပ်ထားပါတယ်။

```js
// Prints something like:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```

[HTTP/2 Headers Object][] ကို ကြည့်ပါ။

HTTP/2 မှာ — request path, host name, protocol နဲ့ method တွေကို — `:` character နဲ့ ရှေ့ဆက် (prefix) ထားတဲ့ special headers တွေအနေနဲ့ ကိုယ်စားပြုပါတယ် (ဥပမာ — `':path'`)။ ဒီ special headers တွေက `request.headers` object ထဲမှာ ပါဝင်ပါလိမ့်မယ်။ ဒီ special headers တွေကို မတော်တဆ (inadvertently) ပြုပြင်မိမှာ မဟုတ်အောင် သတိထားရပါမယ် — မဟုတ်ရင် errors တွေ ဖြစ်ပေါ်လာနိုင်ပါတယ်။ ဥပမာ — request ကနေ headers တွေ အားလုံးကို ဖယ်ရှားလိုက်ရင် errors တွေ ဖြစ်ပေါ်လာပါလိမ့်မယ်:

```js
removeAllHeaders(request.headers);
assert(request.url);   // Fails because the :path header has been removed
```

#### `request.httpVersion`

* Type: {string}

Server request ဖြစ်တဲ့အခါ — client က ပို့လွှတ်လိုက်တဲ့ HTTP version ပါ။ Client response ဖြစ်တဲ့အခါ — ချိတ်ဆက်ထားတဲ့ server ရဲ့ HTTP version ပါ။ `'2.0'` ကို ပြန်ပေးပါတယ်။

ထို့အပြင် `message.httpVersionMajor` က ပထမ integer ဖြစ်ပြီး — `message.httpVersionMinor` ကတော့ ဒုတိယ integer ပါ။

#### `request.method`

* Type: {string}

Request method ကို string တစ်ခုအနေနဲ့ ပါ။ Read-only (ဖတ်ရုံသာ) ပါ။ ဥပမာများ: `'GET'`, `'DELETE'` တို့ပါ။

#### `request.rawHeaders`

* Type: {HTTP/2 Raw Headers}

လက်ခံရရှိခဲ့တဲ့အတိုင်း အတိအကျ ရှိနေတဲ့ raw request/response headers စာရင်းပါ။

```js
// Prints something like:
//
// [ 'user-agent',
//   'this is invalid because there can be only one',
//   'User-Agent',
//   'curl/7.22.0',
//   'Host',
//   '127.0.0.1:8000',
//   'ACCEPT',
//   '*/*' ]
console.log(request.rawHeaders);
```

#### `request.rawTrailers`

* Type: {string\[]}

လက်ခံရရှိခဲ့တဲ့အတိုင်း အတိအကျ ရှိနေတဲ့ raw request/response trailer keys နဲ့ values တွေပါ။ `'end'` event မှာသာ ဖြည့်သွင်းပါတယ်။

#### `request.scheme`

* Type: {string}

Target URL ရဲ့ scheme အပိုင်းကို ဖော်ပြတဲ့ request scheme pseudo header field ပါ။

#### `request.setTimeout(msecs, callback)`

* `msecs` {number}
* `callback` {Function}
* Returns: {http2.Http2ServerRequest}

[`Http2Stream`][] ရဲ့ timeout တန်ဖိုးကို `msecs` အဖြစ် သတ်မှတ်ပါတယ်။ Callback တစ်ခု ပေးထားရင် — ၎င်းကို response object ပေါ်က `'timeout'` event မှာ listener တစ်ခုအနေနဲ့ ထည့်သွင်းပါတယ်။

`'timeout'` listener တစ်ခုကို request, response သို့မဟုတ် server ပေါ်မှာ ထည့်သွင်းမထားဘူးဆိုရင် — [`Http2Stream`][] တွေက ၎င်းတို့ time out ဖြစ်တဲ့အခါ destroy လုပ်ခံရပါလိမ့်မယ်။ Request, response သို့မဟုတ် server ရဲ့ `'timeout'` events တွေမှာ handler တစ်ခု သတ်မှတ်ပေးထားရင် — time out ဖြစ်တဲ့ sockets တွေကို တိုက်ရိုက် (explicitly) ကိုင်တွယ်ပေးရပါမယ်။

#### `request.socket`

* Type: {net.Socket|tls.TLSSocket}

`net.Socket` (သို့မဟုတ် `tls.TLSSocket`) အနေနဲ့ ပြုမူတဲ့ `Proxy` object တစ်ခုကို ပြန်ပေးပေမယ့် — HTTP/2 logic အပေါ် အခြေခံပြီး getters, setters နဲ့ methods တွေကို အသုံးချပါတယ်။

`destroyed`, `readable` နဲ့ `writable` properties တွေကို `request.stream` ပေါ်ကနေ ပြန်လည် ရယူပြီး — ၎င်းပေါ်မှာ သတ်မှတ်ပါလိမ့်မယ်။

`destroy`, `emit`, `end`, `on` နဲ့ `once` methods တွေကို `request.stream` ပေါ်မှာ ခေါ်ယူပါလိမ့်မယ်။

`setTimeout` method ကို `request.stream.session` ပေါ်မှာ ခေါ်ယူပါလိမ့်မယ်။

`pause`, `read`, `resume` နဲ့ `write` တို့က `ERR_HTTP2_NO_SOCKET_MANIPULATION` ဆိုတဲ့ code နဲ့ error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`Http2Session` and Sockets][] ကို ကြည့်ပါ။

တခြား အပြန်အလှန် ဆက်သွယ်မှုတွေ (interactions) အားလုံးကိုတော့ socket ဆီကို တိုက်ရိုက် လမ်းကြောင်းပြောင်း (route) ပေးပါလိမ့်မယ်။ TLS support နဲ့ဆိုရင် — client ရဲ့ authentication အသေးစိတ်တွေကို ရယူဖို့ — [`request.socket.getPeerCertificate()`][] ကို သုံးပါ။

#### `request.stream`

* Type: {Http2Stream}

Request ကို ကျောထောက်နောက်ခံ ပြုထားတဲ့ (backing) [`Http2Stream`][] object ပါ။

#### `request.trailers`

* Type: {Object}

Request/response trailers object ပါ။ `'end'` event မှာသာ ဖြည့်သွင်းပါတယ်။

#### `request.url`

* Type: {string}

Request URL string ပါ။ ၎င်းထဲမှာ တကယ့် (actual) HTTP request ထဲမှာ ပါဝင်တဲ့ URL သာ ပါဝင်ပါတယ်။ Request က အောက်ပါအတိုင်း ဆိုရင်:

```http
GET /status?name=ryan HTTP/1.1
Accept: text/plain
```

ဒါဆိုရင် `request.url` က အောက်ပါအတိုင်း ဖြစ်ပါလိမ့်မယ်:

```json
"/status?name=ryan"
```

URL ကို ၎င်းရဲ့ အစိတ်အပိုင်းတွေအဖြစ် ခွဲခြမ်းစိတ်ဖြာ (parse) ဖို့အတွက် — `new URL()` ကို သုံးနိုင်ပါတယ်:

```console
$ node
> new URL('/status?name=ryan', 'http://example.com')
URL {
  href: 'http://example.com/status?name=ryan',
  origin: 'http://example.com',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'example.com',
  hostname: 'example.com',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```

### Class: `http2.Http2ServerResponse`

* Extends: {Stream}

ဒီ object ကို — user က မဟုတ်ပဲ — HTTP server တစ်ခုက အတွင်းပိုင်း (internally) ဖန်တီးပါတယ်။ ၎င်းကို [`'request'`][] event ဆီကို ဒုတိယ parameter အဖြစ် ဖြတ်သန်းပေးပါတယ်။

#### Event: `'close'`

[`response.end()`][] ကို မခေါ်ရသေးပဲ သို့မဟုတ် flush လုပ်နိုင်ခြင်း မရှိသေးပဲ — underlying [`Http2Stream`][] ကို အဆုံးသတ် (terminate) လုပ်လိုက်ကြောင်း ဖော်ပြပါတယ်။

#### Event: `'finish'`

Response ကို ပို့လွှတ်ပြီးတဲ့အခါ emit လုပ်ပါတယ်။ ပိုတိကျအောင် ဆိုရင် — ဒီ event ကို — response headers နဲ့ body ရဲ့ နောက်ဆုံး အပိုင်းကို — network ပေါ်မှာ ပို့လွှတ်ဖို့အတွက် — HTTP/2 multiplexing ဆီကို လွှဲပြောင်းပေးလိုက်တဲ့အခါ — emit လုပ်ပါတယ်။ ၎င်းက client က တစ်စုံတစ်ရာ လက်ခံရရှိပြီးပြီလို့ ဆိုလိုခြင်းတော့ မဟုတ်ပါဘူး။

ဒီ event ပြီးနောက်မှာ — response object ပေါ်မှာ events တွေ နောက်ထပ် emit လုပ်တော့မှာ မဟုတ်ပါဘူး။

#### `response.addTrailers(headers)`

* `headers` {Object}

ဒီ method က HTTP trailing headers (message ရဲ့ အဆုံးမှာ ရှိတဲ့ header) တွေကို response ဆီကို ထည့်သွင်းပေးပါတယ်။

မမှန်ကန်တဲ့ characters တွေ ပါဝင်တဲ့ header field name သို့မဟုတ် value တစ်ခုကို သတ်မှတ်ဖို့ ကြိုးစားရင် — [`TypeError`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

#### `response.appendHeader(name, value)`

* `name` {string}
* `value` {string|string\[]}

Header object ဆီကို header value တစ်ခုတည်းကို ထပ်ဆောင်း (append) ပါတယ်။

Value က array တစ်ခုဆိုရင် — ဒီ method ကို အကြိမ်များစွာ ခေါ်တာနဲ့ ညီမျှပါတယ်။

Header အတွက် အရင်က values တွေ မရှိခဲ့ဘူးဆိုရင် — [`response.setHeader()`][] ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

မမှန်ကန်တဲ့ characters တွေ ပါဝင်တဲ့ header field name သို့မဟုတ် value တစ်ခုကို သတ်မှတ်ဖို့ ကြိုးစားရင် — [`TypeError`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

```js
// Returns headers including "set-cookie: a" and "set-cookie: b"
const server = http2.createServer((req, res) => {
  res.setHeader('set-cookie', 'a');
  res.appendHeader('set-cookie', 'b');
  res.writeHead(200);
  res.end('ok');
});
```

#### `response.connection`

> Stability: 0 - Deprecated. Use [`response.socket`][].

* Type: {net.Socket|tls.TLSSocket}

[`response.socket`][] ကို ကြည့်ပါ။

#### `response.createPushResponse(headers, callback)`

* `headers` {HTTP/2 Headers Object} Headers တွေကို ဖော်ပြတဲ့ object တစ်ခုပါ
* `callback` {Function} `http2stream.pushStream()` ပြီးဆုံးသွားတဲ့အခါ သို့မဟုတ် — pushed `Http2Stream` တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားမှု မအောင်မြင်ခဲ့တာ သို့မဟုတ် ငြင်းပယ်ခံခဲ့ရတာ သို့မဟုတ် — `http2stream.pushStream()` method ကို မခေါ်ခင် `Http2ServerRequest` ရဲ့ state က ပိတ်သွားပြီးသား ဖြစ်တဲ့အခါ — ခေါ်ယူပါတယ်
  * `err` {Error}
  * `res` {http2.Http2ServerResponse} အသစ် ဖန်တီးလိုက်တဲ့ `Http2ServerResponse` object ပါ

ပေးထားတဲ့ headers တွေနဲ့အတူ [`http2stream.pushStream()`][] ကို ခေါ်ပြီး — အောင်မြင်ခဲ့ရင် — ပေးထားတဲ့ [`Http2Stream`][] ကို callback parameter အဖြစ် — အသစ် ဖန်တီးလိုက်တဲ့ `Http2ServerResponse` တစ်ခုပေါ်မှာ ထုပ်ပိုး (wrap) ပေးပါတယ်။ `Http2ServerRequest` က ပိတ်သွားတဲ့အခါ — `ERR_HTTP2_INVALID_STREAM` error တစ်ခုနဲ့အတူ callback ကို ခေါ်ပါတယ်။

#### `response.end([data[, encoding]][, callback])`

* `data` {string|Buffer|Uint8Array}
* `encoding` {string}
* `callback` {Function}
* Returns: {this}

ဒီ method က — response headers နဲ့ body တွေ အားလုံး ပို့လွှတ်ပြီးကြောင်း — server ဆီကို အချက်ပြပါတယ်; ဒီ message ကို ပြီးပြည့်စုံတယ်လို့ server က မှတ်ယူသင့်ပါတယ်။ `response.end()` method ကို response တိုင်းပေါ်မှာ ခေါ်ယူရပါမယ် (MUST)။

`data` ကို သတ်မှတ်ထားရင် — [`response.write(data, encoding)`][] ကို ခေါ်ပြီး — `response.end(callback)` နဲ့ နောက်ကလိုက် ခေါ်တာနဲ့ ညီမျှပါတယ်။

`callback` ကို သတ်မှတ်ထားရင် — response stream ပြီးဆုံးသွားတဲ့အခါ — ၎င်းကို ခေါ်ယူပါလိမ့်မယ်။

#### `response.finished`

> Stability: 0 - Deprecated. Use [`response.writableEnded`][].

* Type: {boolean}

Response ပြီးမြောက်ခဲ့လားဆိုတာကို ဖော်ပြတဲ့ boolean တန်ဖိုးပါ။ `false` အနေနဲ့ စတင်ပါတယ်။ [`response.end()`][] ကို လုပ်ဆောင်ပြီးနောက်မှာ — တန်ဖိုးက `true` ဖြစ်ပါလိမ့်မယ်။

#### `response.getHeader(name)`

* `name` {string}
* Returns: {string}

Client ဆီကို မပို့ရသေးပဲ — queue လုပ်ထားပြီးသား header တစ်ခုကို ဖတ်ထုတ်ပါတယ်။ နာမည်က case-insensitive (စာလုံးအကြီး/အသေး ခွဲခြားမှု မရှိသော) ပါ။

```js
const contentType = response.getHeader('content-type');
```

#### `response.getHeaderNames()`

* Returns: {string\[]}

လက်ရှိ outgoing headers တွေရဲ့ ထပ်မဖြစ်တဲ့ (unique) နာမည်တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ Header names တွေ အားလုံးက lowercase ပါ။

```js
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

#### `response.getHeaders()`

* Returns: {Object}

လက်ရှိ outgoing headers တွေရဲ့ shallow copy (အပေါ်ယံ မိတ္တူ) တစ်ခုကို ပြန်ပေးပါတယ်။ Shallow copy ကို သုံးထားတာမို့ — header နဲ့ ဆက်စပ်တဲ့ http module methods အမျိုးမျိုးကို ထပ်မခေါ်ပဲ — array values တွေကို ပြုပြင် (mutate) လုပ်နိုင်ပါတယ်။ ပြန်ပေးလိုက်တဲ့ object ရဲ့ keys တွေက header names တွေ ဖြစ်ပြီး — values တွေကတော့ သက်ဆိုင်ရာ header values တွေပါ။ Header names တွေ အားလုံးက lowercase ပါ။

`response.getHeaders()` method က ပြန်ပေးတဲ့ object က JavaScript `Object` ကနေ prototypically အမွေဆက်ခံ (inherit) လုပ်_ထားခြင်း မရှိပါဘူး_ (does not)။ ဒါကြောင့် — `obj.toString()`, `obj.hasOwnProperty()` စတဲ့ ပုံမှန် `Object` methods တွေက သတ်မှတ်ထားခြင်း မရှိပဲ — အလုပ်လုပ်_မှာ မဟုတ်ပါဘူး_ (will not work)။

```js
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```

#### `response.hasHeader(name)`

* `name` {string}
* Returns: {boolean}

`name` နဲ့ ခွဲခြားဖော်ပြတဲ့ header က — လက်ရှိ outgoing headers တွေထဲမှာ သတ်မှတ်ထားရင် — `true` ကို ပြန်ပေးပါတယ်။ Header name ကို ကိုက်ညီစစ်ဆေးတာက case-insensitive ပါ။

```js
const hasContentType = response.hasHeader('content-type');
```

#### `response.headersSent`

* Type: {boolean}

Headers တွေကို ပို့လွှတ်ပြီးသား ဖြစ်ရင် `true` — မဟုတ်ရင် `false` ပါ (read-only)။

#### `response.removeHeader(name)`

* `name` {string}

Implicit sending (သွယ်ဝိုက်၍ ပို့လွှတ်ခြင်း) အတွက် queue လုပ်ထားတဲ့ header တစ်ခုကို ဖယ်ရှားပါတယ်။

```js
response.removeHeader('Content-Encoding');
```

#### `response.req`

* Type: {http2.Http2ServerRequest}

မူရင်း (original) HTTP2 `request` object ဆီကို ရည်ညွှန်းချက် (reference) တစ်ခုပါ။

#### `response.sendDate`

* Type: {boolean}

`true` ဖြစ်နေရင် — headers တွေထဲမှာ Date header မရှိသေးဘူးဆိုရင် — ၎င်းကို အလိုအလျောက် ထုတ်လုပ်ပြီး response ထဲမှာ ပို့လွှတ်ပါလိမ့်မယ်။ Default က `true` ပါ။

ဒါကို testing (စမ်းသပ်ခြင်း) အတွက်သာ disable လုပ်သင့်ပါတယ်; HTTP က responses တွေထဲမှာ Date header ကို လိုအပ်ပါတယ်။

#### `response.setHeader(name, value)`

* `name` {string}
* `value` {string|string\[]}

Implicit headers တွေအတွက် header value တစ်ခုတည်းကို သတ်မှတ်ပါတယ်။ ဒီ header က — ပို့ဖို့ စီစဉ်ထားတဲ့ headers တွေထဲမှာ ရှိပြီးသားဆိုရင် — ၎င်းရဲ့ တန်ဖိုးကို အစားထိုးပါလိမ့်မယ်။ နာမည်တူ headers တွေ အများအပြား ပို့ဖို့အတွက် — ဒီနေရာမှာ strings တွေရဲ့ array တစ်ခုကို သုံးပါ။

```js
response.setHeader('Content-Type', 'text/html; charset=utf-8');
```

သို့မဟုတ်

```js
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```

မမှန်ကန်တဲ့ characters တွေ ပါဝင်တဲ့ header field name သို့မဟုတ် value တစ်ခုကို သတ်မှတ်ဖို့ ကြိုးစားရင် — [`TypeError`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

[`response.setHeader()`][] နဲ့ headers တွေကို သတ်မှတ်ပြီးသားဆိုရင် — ၎င်းတို့ကို [`response.writeHead()`][] ဆီကို ဖြတ်သန်းပေးတဲ့ headers တွေနဲ့ ပေါင်းစပ်ပြီး — [`response.writeHead()`][] ဆီကို ဖြတ်သန်းပေးတဲ့ headers တွေကို ဦးစားပေး (precedence) ပေးပါတယ်။

```js
// Returns content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

#### `response.setTimeout(msecs[, callback])`

* `msecs` {number}
* `callback` {Function}
* Returns: {http2.Http2ServerResponse}

[`Http2Stream`][] ရဲ့ timeout တန်ဖိုးကို `msecs` အဖြစ် သတ်မှတ်ပါတယ်။ Callback တစ်ခု ပေးထားရင် — ၎င်းကို response object ပေါ်က `'timeout'` event မှာ listener တစ်ခုအနေနဲ့ ထည့်သွင်းပါတယ်။

`'timeout'` listener တစ်ခုကို request, response သို့မဟုတ် server ပေါ်မှာ ထည့်သွင်းမထားဘူးဆိုရင် — [`Http2Stream`][] တွေက ၎င်းတို့ time out ဖြစ်တဲ့အခါ destroy လုပ်ခံရပါလိမ့်မယ်။ Request, response သို့မဟုတ် server ရဲ့ `'timeout'` events တွေမှာ handler တစ်ခု သတ်မှတ်ပေးထားရင် — time out ဖြစ်တဲ့ sockets တွေကို တိုက်ရိုက် (explicitly) ကိုင်တွယ်ပေးရပါမယ်။

#### `response.socket`

* Type: {net.Socket|tls.TLSSocket}

`net.Socket` (သို့မဟုတ် `tls.TLSSocket`) အနေနဲ့ ပြုမူတဲ့ `Proxy` object တစ်ခုကို ပြန်ပေးပေမယ့် — HTTP/2 logic အပေါ် အခြေခံပြီး getters, setters နဲ့ methods တွေကို အသုံးချပါတယ်။

`destroyed`, `readable` နဲ့ `writable` properties တွေကို `response.stream` ပေါ်ကနေ ပြန်လည် ရယူပြီး — ၎င်းပေါ်မှာ သတ်မှတ်ပါလိမ့်မယ်။

`destroy`, `emit`, `end`, `on` နဲ့ `once` methods တွေကို `response.stream` ပေါ်မှာ ခေါ်ယူပါလိမ့်မယ်။

`setTimeout` method ကို `response.stream.session` ပေါ်မှာ ခေါ်ယူပါလိမ့်မယ်။

`pause`, `read`, `resume` နဲ့ `write` တို့က `ERR_HTTP2_NO_SOCKET_MANIPULATION` ဆိုတဲ့ code နဲ့ error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`Http2Session` and Sockets][] ကို ကြည့်ပါ။

တခြား အပြန်အလှန် ဆက်သွယ်မှုတွေ (interactions) အားလုံးကိုတော့ socket ဆီကို တိုက်ရိုက် လမ်းကြောင်းပြောင်း (route) ပေးပါလိမ့်မယ်။

```mjs
import { createServer } from 'node:http2';
const server = createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```cjs
const http2 = require('node:http2');
const server = http2.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const port = req.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

#### `response.statusCode`

* Type: {number}

Implicit headers တွေကို သုံးနေတဲ့အခါ ([`response.writeHead()`][] ကို တိုက်ရိုက် မခေါ်ပဲ) — headers တွေကို flush လုပ်တဲ့အခါ — client ဆီကို ပို့မယ့် status code ကို ဒီ property က ထိန်းချုပ်ပါတယ်။

```js
response.statusCode = 404;
```

Response header ကို client ဆီကို ပို့လွှတ်ပြီးနောက်မှာ — ဒီ property က ပို့လွှတ်လိုက်တဲ့ status code ကို ဖော်ပြပါတယ်။

#### `response.statusMessage`

* Type: {string}

HTTP/2 က status message ကို support မလုပ်ပါဘူး (RFC 7540 8.1.2.4)။ ၎င်းက empty string (ဗလာ string) တစ်ခုကို ပြန်ပေးပါတယ်။
#### `response.stream`

* Type: {Http2Stream}

ဒီ response ကို ကျောထောက်နောက်ခံ ပြုလုပ်ပေးထားတဲ့ (backing) [`Http2Stream`][] object ပါ။

#### `response.writableEnded`

* Type: {boolean}

[`response.end()`][] ကို ခေါ်လိုက်ပြီးနောက်မှာ `true` ဖြစ်ပါတယ်။ ဒီ property က data တွေ flush ဖြစ်သွားလားဆိုတာကို ဖော်ပြမှာ မဟုတ်ပါဘူး — အဲဒါအတွက်တော့ [`writable.writableFinished`][] ကို သုံးပါ။

#### `response.write(chunk[, encoding][, callback])`

* `chunk` {string|Buffer|Uint8Array}
* `encoding` {string}
* `callback` {Function}
* Returns: {boolean}

ဒီ method ကို ခေါ်လိုက်ပြီး [`response.writeHead()`][] ကို မခေါ်ရသေးဘူးဆိုရင် — implicit header mode (သွယ်ဝိုက် header စနစ်) ဆီကို ပြောင်းလဲပြီး implicit headers တွေကို flush လုပ်ပါလိမ့်မယ်။

ဒါက response body ရဲ့ chunk တစ်ခုကို ပို့ပေးပါတယ်။ Body ရဲ့ အပိုင်းဆက်တွေကို ပေးပို့ဖို့ ဒီ method ကို အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။

`node:http` module မှာ — request က HEAD request ဖြစ်နေရင် — response body ကို ချန်လှပ်ထားပါတယ်။ အလားတူပဲ — `204` နဲ့ `304` responses တွေမှာ message body တစ်ခု ပါဝင်ခွင့် _မရှိပါဘူး_ (must not)။

`chunk` က string သို့မဟုတ် buffer တစ်ခု ဖြစ်နိုင်ပါတယ်။ `chunk` က string ဆိုရင် — ဒုတိယ parameter က ၎င်းကို byte stream တစ်ခုအဖြစ် ဘယ်လို encode လုပ်ရမယ်ဆိုတာကို သတ်မှတ်ပေးပါတယ်။ Default အနေနဲ့ `encoding` က `'utf8'` ဖြစ်ပါတယ်။ ဒီ data chunk ကို flush လုပ်လိုက်တဲ့အခါ `callback` ကို ခေါ်ပါလိမ့်မယ်။

ဒါက raw HTTP body ဖြစ်ပြီး — သုံးစွဲနိုင်တဲ့ အဆင့်မြင့် multi-part body encodings တွေနဲ့ ဘာမှ ဆက်စပ်မှု မရှိပါဘူး။

[`response.write()`][] ကို ပထမဆုံး အကြိမ် ခေါ်လိုက်တဲ့အခါ — buffer လုပ်ထားတဲ့ header အချက်အလက်တွေနဲ့ body ရဲ့ ပထမ chunk ကို client ဆီကို ပို့ပေးပါတယ်။ [`response.write()`][] ကို ဒုတိယ အကြိမ် ခေါ်လိုက်တဲ့အခါမှာတော့ — Node.js က data တွေကို stream လုပ်မယ်လို့ ယူဆပြီး — data အသစ်ကို သီးခြား ပို့ပေးပါတယ်။ ဆိုလိုတာက — response ကို body ရဲ့ ပထမ chunk အထိပဲ buffer လုပ်ထားတာပါ။

Data တွေ အားလုံးကို kernel buffer ဆီကို အောင်မြင်စွာ flush လုပ်နိုင်ခဲ့ရင် `true` ကို ပြန်ပေးပါတယ်။ Data တွေ အားလုံး သို့မဟုတ် တစ်စိတ်တစ်ပိုင်းကို user memory ထဲမှာ queue တင်ထားရရင်တော့ `false` ကို ပြန်ပေးပါတယ်။ Buffer က ပြန်လည် လွတ်လာတဲ့အခါ `'drain'` ကို emit လုပ်ပါလိမ့်မယ်။

#### `response.writeContinue()`

Request body ကို ပို့သင့်ကြောင်း ဖော်ပြဖို့ — client ဆီကို status `100 Continue` တစ်ခု ပို့ပေးပါတယ်။ `Http2Server` နဲ့ `Http2SecureServer` တို့ပေါ်က [`'checkContinue'`][] event ကို ကြည့်ပါ။

#### `response.writeEarlyHints(hints)`

* `hints` {Object}

Link header တစ်ခု ပါဝင်တဲ့ status `103 Early Hints` တစ်ခုကို client ဆီကို ပို့ပေးပြီး — user agent က linked resources တွေကို preload/preconnect လုပ်နိုင်ကြောင်း ဖော်ပြပါတယ်။ `hints` က early hints message နဲ့အတူ ပို့ပေးရမယ့် headers တွေရဲ့ တန်ဖိုးတွေ ပါဝင်တဲ့ object တစ်ခုပါ။

**ဥပမာ**

```js
const earlyHintsLink = '</styles.css>; rel=preload; as=style';
response.writeEarlyHints({
  'link': earlyHintsLink,
});

const earlyHintsLinks = [
  '</styles.css>; rel=preload; as=style',
  '</scripts.js>; rel=preload; as=script',
];
response.writeEarlyHints({
  'link': earlyHintsLinks,
});
```

#### `response.writeInformation(statusCode[, headers])`

* `statusCode` {number} HTTP 1xx informational status code တစ်ခုပါ — `100` နဲ့ `199`
  ကြား (နှစ်ဖက်လုံး အပါအဝင်) ဖြစ်ပြီး — HTTP/2 မှာ ခွင့်မပြုတဲ့ `101`
  (Switching Protocols) ကတော့ ချန်လှပ်ထားပါတယ်။
* `headers` {Object} Informational response နဲ့အတူ ပို့ပေးရမယ့် headers တွေရဲ့
  optional object တစ်ခုပါ။

HTTP/2 မှာ `:status` pseudo-header က 1xx code တစ်ခု ဖြစ်တဲ့ `HEADERS` frame တစ်ခုနဲ့ ညီမျှတဲ့ — ကြိုက်ရာ (arbitrary) HTTP 1xx informational response တစ်ခုကို ပို့ပေးပါတယ်။ နောက်ဆုံး response မတိုင်ခင် ဒီ method ကို အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။ နောက်ဆုံး response headers တွေ ပို့လိုက်ပြီးနောက်မှာတော့ — ဒီ method က no-op (ဘာမျှ မလုပ်ဆောင်) ဖြစ်ပြီး `false` ကို ပြန်ပေးပါတယ်။

ဒါက [`response.writeContinue()`][] နဲ့ [`response.writeEarlyHints()`][] တို့ရဲ့ ယေဘုယျ (generic) ညီမျှဗားရှင်း ဖြစ်ပါတယ်။

```js
response.writeInformation(110, { 'X-Progress': '50%' });
```

#### `response.writeHead(statusCode[, statusMessage][, headers])`

* `statusCode` {number}
* `statusMessage` {string}
* `headers` {HTTP/2 Headers Object|HTTP/2 Raw Headers}
* Returns: {http2.Http2ServerResponse}

Request ဆီကို response header တစ်ခု ပို့ပေးပါတယ်။ Status code က `404` လိုမျိုး ဂဏန်း ၃ လုံး ပါတဲ့ HTTP status code တစ်ခုပါ။ နောက်ဆုံး argument ဖြစ်တဲ့ `headers` ကတော့ response headers တွေပါ။

Calls တွေကို chain လုပ်နိုင်အောင် — `Http2ServerResponse` ဆီကို ရည်ညွှန်းချက် (reference) တစ်ခု ပြန်ပေးပါတယ်။

[HTTP/1][] နဲ့ လိုက်ဖက်ညီမှု ရှိစေဖို့အတွက် — လူဖတ်လို့ရတဲ့ (human-readable) `statusMessage` တစ်ခုကို ဒုတိယ argument အဖြစ် ဖြတ်သန်းပေးနိုင်ပါတယ်။ ဒါပေမယ့် — HTTP/2 အတွင်းမှာ `statusMessage` က အဓိပ္ပာယ် မရှိတာမို့ — ဒီ argument က ဘာအကျိုးသက်ရောက်မှုမှ ရှိမှာ မဟုတ်ပဲ process warning တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။

```js
const body = 'hello world';
response.writeHead(200, {
  'Content-Length': Buffer.byteLength(body),
  'Content-Type': 'text/plain; charset=utf-8',
});
```

`Content-Length` ကို characters တွေနဲ့ မဟုတ်ဘဲ bytes တွေနဲ့ ဖော်ပြပါတယ်။ ပေးထားတဲ့ encoding တစ်ခုမှာ bytes အရေအတွက်ကို ဆုံးဖြတ်ဖို့ `Buffer.byteLength()` API ကို သုံးနိုင်ပါတယ်။ Outbound messages တွေမှာ — Content-Length နဲ့ ပို့လွှတ်နေတဲ့ body ရဲ့ အရှည်က တူညီလား မတူညီဘူးလားဆိုတာကို Node.js က စစ်ဆေးမပေးပါဘူး။ ဒါပေမယ့် — messages တွေကို လက်ခံရရှိတဲ့အခါမှာတော့ — `Content-Length` က တကယ့် (actual) payload size နဲ့ မကိုက်ညီဘူးဆိုရင် — Node.js က messages တွေကို အလိုအလျောက် ငြင်းပယ်ပါလိမ့်မယ်။

[`response.end()`][] ကို မခေါ်ရသေးခင် ဒီ method ကို message တစ်ခုပေါ်မှာ အများဆုံး တစ်ကြိမ်ပဲ ခေါ်နိုင်ပါတယ်။

ဒါကို မခေါ်ခင် [`response.write()`][] သို့မဟုတ် [`response.end()`][] ကို ခေါ်ထားပြီးသားဆိုရင် — implicit/mutable headers တွေကို တွက်ချက်ပြီး ဒီ function ကို ခေါ်ပါလိမ့်မယ်။

[`response.setHeader()`][] နဲ့ headers တွေ သတ်မှတ်ထားပြီးသားဆိုရင် — ၎င်းတို့ကို [`response.writeHead()`][] ဆီကို ဖြတ်သန်းလိုက်တဲ့ headers တွေနဲ့ ပေါင်းစည်း (merge) လုပ်ပါလိမ့်မယ် — [`response.writeHead()`][] ဆီကို ဖြတ်သန်းလိုက်တဲ့ headers တွေက ဦးစားပေး (precedence) ရရှိပါတယ်။

```js
// Returns content-type = text/plain
const server = http2.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});
```

Invalid characters (တရားဝင်မဟုတ်တဲ့ စာလုံးများ) ပါဝင်တဲ့ header field name သို့မဟုတ် value တစ်ခုကို သတ်မှတ်ဖို့ ကြိုးစားလိုက်ရင် — [`TypeError`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

## HTTP/2 performance metrics များ စုဆောင်းခြင်း (Collecting HTTP/2 performance metrics)

[Performance Observer][] API ကို `Http2Session` နဲ့ `Http2Stream` instance တစ်ခုချင်းစီအတွက် အခြေခံ performance metrics တွေကို စုဆောင်းဖို့ သုံးနိုင်ပါတယ်။

```mjs
import { PerformanceObserver } from 'node:perf_hooks';

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```

```cjs
const { PerformanceObserver } = require('node:perf_hooks');

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.entryType);  // prints 'http2'
  if (entry.name === 'Http2Session') {
    // Entry contains statistics about the Http2Session
  } else if (entry.name === 'Http2Stream') {
    // Entry contains statistics about the Http2Stream
  }
});
obs.observe({ entryTypes: ['http2'] });
```

`PerformanceEntry` ရဲ့ `entryType` property က `'http2'` နဲ့ ညီမျှပါလိမ့်မယ်။

`PerformanceEntry` ရဲ့ `name` property က `'Http2Stream'` သို့မဟုတ် `'Http2Session'` နှစ်ခုအနက် တစ်ခုနဲ့ ညီမျှပါလိမ့်မယ်။

`name` က `Http2Stream` နဲ့ ညီမျှနေရင် — `PerformanceEntry` ထဲမှာ အောက်ပါ ထပ်ဆောင်း properties တွေ ပါဝင်ပါလိမ့်မယ်:

* `bytesRead` {number} ဒီ `Http2Stream` အတွက် လက်ခံရရှိခဲ့တဲ့ `DATA` frame bytes
  အရေအတွက်ပါ။
* `bytesWritten` {number} ဒီ `Http2Stream` အတွက် ပို့လွှတ်ခဲ့တဲ့ `DATA` frame bytes
  အရေအတွက်ပါ။
* `id` {number} ဆက်စပ်နေတဲ့ (associated) `Http2Stream` ရဲ့ identifier ပါ
* `timeToFirstByte` {number} `PerformanceEntry` ရဲ့ `startTime` နဲ့ ပထမဆုံး `DATA`
  frame ကို လက်ခံရရှိတဲ့အချိန် ကြားမှာ ကုန်ဆုံးသွားတဲ့ milliseconds အရေအတွက်ပါ။
* `timeToFirstByteSent` {number} `PerformanceEntry` ရဲ့ `startTime` နဲ့ ပထမဆုံး
  `DATA` frame ကို ပို့လွှတ်လိုက်တဲ့အချိန် ကြားမှာ ကုန်ဆုံးသွားတဲ့ milliseconds
  အရေအတွက်ပါ။
* `timeToFirstHeader` {number} `PerformanceEntry` ရဲ့ `startTime` နဲ့ ပထမဆုံး header
  ကို လက်ခံရရှိတဲ့အချိန် ကြားမှာ ကုန်ဆုံးသွားတဲ့ milliseconds အရေအတွက်ပါ။

`name` က `Http2Session` နဲ့ ညီမျှနေရင် — `PerformanceEntry` ထဲမှာ အောက်ပါ ထပ်ဆောင်း properties တွေ ပါဝင်ပါလိမ့်မယ်:

* `bytesRead` {number} ဒီ `Http2Session` အတွက် လက်ခံရရှိခဲ့တဲ့ bytes အရေအတွက်ပါ။
* `bytesWritten` {number} ဒီ `Http2Session` အတွက် ပို့လွှတ်ခဲ့တဲ့ bytes အရေအတွက်ပါ။
* `framesReceived` {number} `Http2Session` က လက်ခံရရှိခဲ့တဲ့ HTTP/2 frames
  အရေအတွက်ပါ။
* `framesSent` {number} `Http2Session` က ပို့လွှတ်ခဲ့တဲ့ HTTP/2 frames အရေအတွက်ပါ။
* `maxConcurrentStreams` {number} `Http2Session` ရဲ့ သက်တမ်း (lifetime) တစ်လျှောက်
  တစ်ပြိုင်နက် (concurrently) ဖွင့်ထားခဲ့တဲ့ streams အများဆုံး အရေအတွက်ပါ။
* `pingRTT` {number} `PING` frame တစ်ခု ပို့လွှတ်လိုက်တာနဲ့ ၎င်းရဲ့ acknowledgment
  ကို လက်ခံရရှိတဲ့အချိန် ကြားမှာ ကုန်ဆုံးသွားတဲ့ milliseconds အရေအတွက်ပါ။
  `Http2Session` ပေါ်မှာ `PING` frame တစ်ခု ပို့လွှတ်ခဲ့ဖူးမှသာ ပါဝင်ပါတယ်။
* `streamAverageDuration` {number} `Http2Stream` instances တွေ အားလုံးအတွက်
  ပျမ်းမျှ (average) duration — milliseconds နဲ့ — ပါ။
* `streamCount` {number} `Http2Session` က process လုပ်ခဲ့တဲ့ `Http2Stream` instances
  အရေအတွက်ပါ။
* `type` {string} `Http2Session` ရဲ့ အမျိုးအစားကို ခွဲခြားသိစေဖို့ `'server'` သို့မဟုတ်
  `'client'` နှစ်ခုအနက် တစ်ခု ဖြစ်ပါတယ်။

## Note on `:authority` and `host`

HTTP/2 က requests တွေမှာ `:authority` pseudo-header သို့မဟုတ် `host` header နှစ်ခုအနက် တစ်ခုခု ပါဝင်ဖို့ လိုအပ်ပါတယ်။ HTTP/2 request တစ်ခုကို တိုက်ရိုက် တည်ဆောက်တဲ့အခါ `:authority` ကို ဦးစားပေးပြီး — (ဥပမာ proxies တွေမှာလို) HTTP/1 ကနေ ပြောင်းလဲတဲ့အခါမှာတော့ `host` ကို ဦးစားပေးပါ။

Compatibility API က — `:authority` မပါဝင်ဘူးဆိုရင် — `host` ဆီကို fall back (ပြန်ကျ) သွားပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`request.authority`][] ကို ကြည့်ပါ။ ဒါပေမယ့် — သင်က compatibility API ကို မသုံးဘူးဆိုရင် (သို့) `req.headers` ကို တိုက်ရိုက် သုံးနေရင် — fall-back အပြုအမူကို ကိုယ်တိုင် implement လုပ်ပေးရပါလိမ့်မယ်။

[ALPN Protocol ID]: https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml#alpn-protocol-ids
[ALPN negotiation]: #alpn-negotiation
[Compatibility API]: #compatibility-api
[DEP0202]: deprecations.md#dep0202-http1incomingmessage-and-http1serverresponse-options-of-http2-servers
[HTTP/1]: http.md
[HTTP/2]: https://tools.ietf.org/html/rfc7540
[HTTP/2 Headers Object]: #headers-object
[HTTP/2 Raw Headers]: #raw-headers
[HTTP/2 Settings Object]: #settings-object
[HTTP/2 Unencrypted]: https://http2.github.io/faq/#does-http2-require-encryption
[HTTPS]: https.md
[Invalid character handling in header names and values]: #invalid-character-handling-in-header-names-and-values
[Performance Observer]: perf_hooks.md
[RFC 7838]: https://tools.ietf.org/html/rfc7838
[RFC 8336]: https://tools.ietf.org/html/rfc8336
[RFC 8441]: https://tools.ietf.org/html/rfc8441
[RFC 9113]: https://datatracker.ietf.org/doc/html/rfc9113#section-5.3.1
[Sensitive headers]: #sensitive-headers
[`'checkContinue'`]: #event-checkcontinue
[`'connect'`]: #event-connect
[`'request'`]: #event-request
[`'unknownProtocol'`]: #event-unknownprotocol
[`ClientHttp2Stream`]: #class-clienthttp2stream
[`Duplex`]: stream.md#class-streamduplex
[`Http2ServerRequest`]: #class-http2http2serverrequest
[`Http2ServerResponse`]: #class-http2http2serverresponse
[`Http2Session` and Sockets]: #http2session-and-sockets
[`Http2Session`'s `'stream'` event]: #event-stream
[`Http2Stream`]: #class-http2stream
[`ServerHttp2Stream`]: #class-serverhttp2stream
[`TypeError`]: errors.md#class-typeerror
[`http.createServer()`]: http.md#httpcreateserveroptions-requestlistener
[`http2.SecureServer`]: #class-http2secureserver
[`http2.Server`]: #class-http2server
[`http2.createSecureServer()`]: #http2createsecureserveroptions-onrequesthandler
[`http2.createServer()`]: #http2createserveroptions-onrequesthandler
[`http2stream.pushStream()`]: #http2streampushstreamheaders-options-callback
[`import()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[`net.Server.close()`]: net.md#serverclosecallback
[`net.Socket.bufferSize`]: net.md#socketbuffersize
[`net.Socket.prototype.ref()`]: net.md#socketref
[`net.Socket.prototype.unref()`]: net.md#socketunref
[`net.Socket`]: net.md#class-netsocket
[`net.connect()`]: net.md#netconnect
[`net.createServer()`]: net.md#netcreateserveroptions-connectionlistener
[`request.authority`]: #requestauthority
[`request.maxHeadersCount`]: http.md#requestmaxheaderscount
[`request.socket.getPeerCertificate()`]: tls.md#tlssocketgetpeercertificatedetailed
[`request.socket`]: #requestsocket
[`response.end()`]: #responseenddata-encoding-callback
[`response.setHeader()`]: #responsesetheadername-value
[`response.socket`]: #responsesocket
[`response.writableEnded`]: #responsewritableended
[`response.write()`]: #responsewritechunk-encoding-callback
[`response.write(data, encoding)`]: http.md#responsewritechunk-encoding-callback
[`response.writeContinue()`]: #responsewritecontinue
[`response.writeEarlyHints()`]: #responsewriteearlyhintshints
[`response.writeHead()`]: #responsewriteheadstatuscode-statusmessage-headers
[`server.close()`]: #serverclosecallback
[`server.maxHeadersCount`]: http.md#servermaxheaderscount
[`tls.Server.close()`]: tls.md#serverclosecallback
[`tls.TLSSocket`]: tls.md#class-tlstlssocket
[`tls.connect()`]: tls.md#tlsconnectoptions-callback
[`tls.createServer()`]: tls.md#tlscreateserveroptions-secureconnectionlistener
[`writable.writableFinished`]: stream.md#writablewritablefinished
[error code]: #error-codes-for-rst_stream-and-goaway
