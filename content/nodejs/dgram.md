---
title: "UDP/datagram sockets"
description: "node:dgram module — UDP datagram sockets (dgram.Socket class, multicast, events, send/bind…)။"
order: 91
source: "https://nodejs.org/api/dgram.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:dgram` module က UDP datagram sockets တွေရဲ့ implementation (အကောင်အထည်ဖော်မှု) တစ်ခုကို ပေးပါတယ်။ အောက်မှာ UDP server တစ်ခုရဲ့ ရိုးရှင်းတဲ့ ဥပမာပါ:

```mjs
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

```cjs
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

## Class: `dgram.Socket`

* Extends: {EventEmitter}

`dgram.Socket` က datagram လုပ်ဆောင်ချက်တွေကို စုစည်း (encapsulate) ထားတဲ့ class တစ်ခု ဖြစ်ပါတယ်။

`dgram.Socket` instance အသစ်တွေကို [`dgram.createSocket()`][] သုံးပြီး ဖန်တီးပါတယ်။ `dgram.Socket` instance တွေကို ဖန်တီးဖို့ `new` keyword ကို မသုံးရပါဘူး။

### Event: `'close'`

Socket တစ်ခုကို [`close()`][] နဲ့ ပိတ်လိုက်ပြီးတဲ့နောက်မှာ `'close'` event ကို emit လုပ်ပါတယ်။ ဒီ event ဖြစ်ပြီးတာနဲ့ ဒီ socket ပေါ်မှာ `'message'` event အသစ်တွေ ထပ်ပြီး emit လုပ်တော့မှာ မဟုတ်ပါဘူး။

### Event: `'connect'`

Socket တစ်ခုကို remote address တစ်ခုနဲ့ အောင်မြင်တဲ့ [`connect()`][] ခေါ်ဆိုမှုကြောင့် ချိတ်ဆက်မိ (associate) သွားပြီးတဲ့နောက်မှာ `'connect'` event ကို emit လုပ်ပါတယ်။

### Event: `'error'`

* `exception` {Error}

Error တစ်ခုခု ဖြစ်ပေါ်လာတိုင်း `'error'` event ကို emit လုပ်ပါတယ်။ Event handler function ကို `Error` object တစ်ခုတည်း အနေနဲ့ ပေးပို့ပါတယ်။

### Event: `'listening'`

`dgram.Socket` က address သတ်မှတ်နိုင်ပြီး data တွေ လက်ခံနိုင်တဲ့ အခြေအနေ ရောက်တာနဲ့ `'listening'` event ကို emit လုပ်ပါတယ်။ ဒါက `socket.bind()` ကို တိုက်ရိုက် ခေါ်လို့ ဖြစ်နိုင်သလို — `socket.send()` နဲ့ ပထမဆုံး data ပို့လိုက်တဲ့အခါ သွယ်ဝိုက်၍လည်း ဖြစ်နိုင်ပါတယ်။ `dgram.Socket` listening မဖြစ်သေးသရွေ့ အရင်းခံ system resources တွေ မရှိသေးတာမို့ — `socket.address()` နဲ့ `socket.setTTL()` လိုမျိုး ခေါ်ဆိုမှုတွေ မအောင်မြင်ပါဘူး။

### Event: `'message'`

Socket ပေါ်မှာ datagram အသစ်တစ်ခု ရောက်ရှိလာတဲ့အခါ `'message'` event ကို emit လုပ်ပါတယ်။ Event handler function ကို argument နှစ်ခုဖြစ်တဲ့ `msg` နဲ့ `rinfo` တို့နဲ့အတူ ခေါ်ပါတယ်။

* `msg` {Buffer} Message (datagram) ရဲ့ အကြောင်းအရာ။
* `rinfo` {Object} Remote address ဆိုင်ရာ အချက်အလက်များ။
  * `address` {string} ပေးပို့သူရဲ့ address။
  * `family` {string} Address family (`'IPv4'` (သို့) `'IPv6'`)။
  * `port` {number} ပေးပို့သူရဲ့ port။
  * `size` {number} Message ရဲ့ အရွယ်အစား။

အဝင် packet တစ်ခုရဲ့ source address က IPv6 link-local address ဖြစ်နေရင် interface name ကို `address` ထဲမှာ ထည့်ပေးပါတယ်။ ဥပမာ — `en0` interface ပေါ်မှာ လက်ခံရရှိတဲ့ packet တစ်ခုရဲ့ address field က `'fe80::2618:1234:ab11:3b9c%en0'` လို ဖြစ်နိုင်ပြီး — အဲဒီမှာ `'%en0'` က zone ID suffix အနေနဲ့ ပါဝင်တဲ့ interface name ပဲ ဖြစ်ပါတယ်။

### `socket.addMembership(multicastAddress[, multicastInterface])`

* `multicastAddress` {string}
* `multicastInterface` {string}

ဒီ method က kernel ကို `IP_ADD_MEMBERSHIP` socket option သုံးပြီး ပေးထားတဲ့ `multicastAddress` နဲ့ `multicastInterface` မှာ multicast group တစ်ခုကို join လုပ်ဖို့ ပြောပါတယ်။ `multicastInterface` argument ကို မသတ်မှတ်ထားရင် operating system က interface တစ်ခုကို ရွေးချယ်ပြီး အဲဒီထဲ membership ကို ထည့်ပေးပါလိမ့်မယ်။ ရနိုင်တဲ့ interface တိုင်းထဲ membership ထည့်ချင်ရင်တော့ — interface တစ်ခုချင်းစီအတွက် `addMembership` ကို အကြိမ်များစွာ ခေါ်ရပါမယ်။

Unbound socket တစ်ခုပေါ်မှာ ဒီ method ကို ခေါ်လိုက်ရင် random port တစ်ခုကို သွယ်ဝိုက်၍ bind လုပ်ပြီး — interface အားလုံးပေါ်မှာ listening လုပ်ပါလိမ့်မယ်။

UDP socket တစ်ခုကို `cluster` workers အများကြီးကြားမှာ share လုပ်တဲ့အခါ `socket.addMembership()` function ကို တစ်ခါပဲ ခေါ်ရမှာ ဖြစ်ပြီး — မဟုတ်ရင် `EADDRINUSE` error ဖြစ်ပါလိမ့်မယ်:

```mjs
import cluster from 'node:cluster';
import dgram from 'node:dgram';

if (cluster.isPrimary) {
  cluster.fork(); // Works ok.
  cluster.fork(); // Fails with EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```

```cjs
const cluster = require('node:cluster');
const dgram = require('node:dgram');

if (cluster.isPrimary) {
  cluster.fork(); // Works ok.
  cluster.fork(); // Fails with EADDRINUSE.
} else {
  const s = dgram.createSocket('udp4');
  s.bind(1234, () => {
    s.addMembership('224.0.0.114');
  });
}
```

### `socket.addSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])`

* `sourceAddress` {string}
* `groupAddress` {string}
* `multicastInterface` {string}

ဒီ method က kernel ကို `IP_ADD_SOURCE_MEMBERSHIP` socket option သုံးပြီး ပေးထားတဲ့ `sourceAddress` နဲ့ `groupAddress` မှာ source-specific multicast channel တစ်ခုကို join လုပ်ဖို့ ပြောပါတယ်။ `multicastInterface` argument ကို မသတ်မှတ်ထားရင် operating system က interface တစ်ခုကို ရွေးချယ်ပြီး အဲဒီထဲ membership ကို ထည့်ပေးပါလိမ့်မယ်။ ရနိုင်တဲ့ interface တိုင်းထဲ membership ထည့်ချင်ရင်တော့ — interface တစ်ခုချင်းစီအတွက် `socket.addSourceSpecificMembership()` ကို အကြိမ်များစွာ ခေါ်ရပါမယ်။

Unbound socket တစ်ခုပေါ်မှာ ဒီ method ကို ခေါ်လိုက်ရင် random port တစ်ခုကို သွယ်ဝိုက်၍ bind လုပ်ပြီး — interface အားလုံးပေါ်မှာ listening လုပ်ပါလိမ့်မယ်။

### `socket.address()`

* Returns: {Object}

Socket တစ်ခုအတွက် address အချက်အလက်တွေ ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ UDP sockets တွေအတွက် ဒီ object ထဲမှာ `address`, `family` နဲ့ `port` property တွေ ပါဝင်ပါလိမ့်မယ်။

ဒီ method က unbound socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် `EBADF` ကို throw လုပ်ပါတယ်။

### `socket.bind([port][, address][, callback])`

* `port` {integer}
* `address` {string}
* `callback` {Function} parameter မပါဝင်ပါ။ Binding ပြီးစီးတဲ့အခါ ခေါ်ယူပါတယ်။

UDP sockets တွေအတွက် ဒီ method က `dgram.Socket` ကို သတ်မှတ်ထားတဲ့ `port` တစ်ခုနဲ့ optional `address` တစ်ခုပေါ်မှာ datagram messages တွေကို နားထောင်စေပါတယ်။ `port` ကို မသတ်မှတ်ထားရင် (သို့) `0` ဖြစ်နေရင် operating system က random port တစ်ခုကို bind လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ `address` ကို မသတ်မှတ်ထားရင် operating system က address အားလုံးပေါ်မှာ နားထောင်ဖို့ ကြိုးစားပါလိမ့်မယ်။ Binding ပြီးစီးတာနဲ့ `'listening'` event တစ်ခုကို emit လုပ်ပြီး — optional `callback` function ကို ခေါ်ပါတယ်။

`'listening'` event listener တစ်ခုကို သတ်မှတ်ထားပြီး `socket.bind()` method ဆီ `callback` တစ်ခုကိုပါ ပေးလိုက်တာက ထိခိုက်မှု မရှိပေမယ့် — သိပ်ပြီး အသုံးမဝင်ပါဘူး။

Bind လုပ်ထားတဲ့ datagram socket တစ်ခုက datagram messages တွေ လက်ခံနိုင်ဖို့ Node.js process ကို ဆက်လက် run နေစေပါတယ်။

Binding မအောင်မြင်ရင် `'error'` event တစ်ခုကို ဖြစ်ပေါ်စေပါတယ်။ ရှားပါးတဲ့ အခြေအနေတွေမှာ (ဥပမာ — ပိတ်ပြီးသား socket တစ်ခုကို bind လုပ်ဖို့ ကြိုးစားတာ) [`Error`][] တစ်ခုကို throw လုပ်နိုင်ပါတယ်။

Port 41234 ပေါ်မှာ နားထောင်နေတဲ့ UDP server တစ်ခုရဲ့ ဥပမာ:

```mjs
import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

```cjs
const dgram = require('node:dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
// Prints: server listening 0.0.0.0:41234
```

### `socket.bind(options[, callback])`

* `options` {Object} မဖြစ်မနေ လိုအပ်ပါတယ်။ အောက်ပါ property တွေကို ပံ့ပိုးပါတယ်:
  * `port` {integer}
  * `address` {string}
  * `exclusive` {boolean}
  * `fd` {integer}
* `callback` {Function}

UDP sockets တွေအတွက် ဒီ method က `dgram.Socket` ကို ပထမဆုံး argument အနေနဲ့ ပေးလိုက်တဲ့ `options` object ရဲ့ property တွေအဖြစ် ပါဝင်တဲ့ `port` တစ်ခုနဲ့ optional `address` တစ်ခုပေါ်မှာ datagram messages တွေကို နားထောင်စေပါတယ်။ `port` ကို မသတ်မှတ်ထားရင် (သို့) `0` ဖြစ်နေရင် operating system က random port တစ်ခုကို bind လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ `address` ကို မသတ်မှတ်ထားရင် operating system က address အားလုံးပေါ်မှာ နားထောင်ဖို့ ကြိုးစားပါလိမ့်မယ်။ Binding ပြီးစီးတာနဲ့ `'listening'` event တစ်ခုကို emit လုပ်ပြီး — optional `callback` function ကို ခေါ်ပါတယ်။

`options` object ထဲမှာ `fd` property တစ်ခု ပါဝင်နိုင်ပါတယ်။ `0` ထက် ကြီးတဲ့ `fd` တစ်ခုကို သတ်မှတ်ထားရင် — ပေးထားတဲ့ file descriptor နဲ့ ရှိပြီးသား socket တစ်ခုကို wrap လုပ်ပါလိမ့်မယ်။ ဒီအခြေအနေမှာ `port` နဲ့ `address` ရဲ့ property တွေကို လျစ်လျူရှုပါလိမ့်မယ်။

`'listening'` event listener တစ်ခုကို သတ်မှတ်ထားပြီး `socket.bind()` method ဆီ `callback` တစ်ခုကိုပါ ပေးလိုက်တာက ထိခိုက်မှု မရှိပေမယ့် — သိပ်ပြီး အသုံးမဝင်ပါဘူး။

`options` object ထဲမှာ [`cluster`][] module နဲ့ `dgram.Socket` objects တွေကို သုံးတဲ့အခါ အသုံးပြုတဲ့ `exclusive` property တစ်ခု ထပ်ပါဝင်နိုင်ပါတယ်။ `exclusive` ကို `false` (ပုံမှန်) လို့ သတ်မှတ်ထားရင် cluster workers တွေက တူညီတဲ့ အရင်းခံ socket handle ကို သုံးပြီး — connection ကိုင်တွယ်တဲ့ တာဝန်တွေကို မျှဝေနိုင်ပါတယ်။ ဒါပေမယ့် `exclusive` က `true` ဆိုရင်တော့ handle ကို မျှဝေမှာ မဟုတ်ဘဲ — port sharing ကို ကြိုးစားရင် error တစ်ခု ဖြစ်ပါတယ်။ `reusePort` option ကို `true` လို့ သတ်မှတ်ထားပြီး `dgram.Socket` တစ်ခုကို ဖန်တီးထားရင် `socket.bind()` ခေါ်တဲ့အခါ `exclusive` က အမြဲတမ်း `true` ဖြစ်စေပါတယ်။

Bind လုပ်ထားတဲ့ datagram socket တစ်ခုက datagram messages တွေ လက်ခံနိုင်ဖို့ Node.js process ကို ဆက်လက် run နေစေပါတယ်။

Binding မအောင်မြင်ရင် `'error'` event တစ်ခုကို ဖြစ်ပေါ်စေပါတယ်။ ရှားပါးတဲ့ အခြေအနေတွေမှာ (ဥပမာ — ပိတ်ပြီးသား socket တစ်ခုကို bind လုပ်ဖို့ ကြိုးစားတာ) [`Error`][] တစ်ခုကို throw လုပ်နိုင်ပါတယ်။

Exclusive port တစ်ခုပေါ်မှာ နားထောင်နေတဲ့ socket တစ်ခုရဲ့ ဥပမာကို အောက်မှာ ပြထားပါတယ်။

```js
socket.bind({
  address: 'localhost',
  port: 8000,
  exclusive: true,
});
```

### `socket.bindSync([options])`

* `options` {Object}
  * `port` {integer} ချန်လိုက်ရင် (သို့) `0` ဆိုရင် operating system က မသုံးရသေးတဲ့ port တစ်ခုကို သတ်မှတ်ပေးပါလိမ့်မယ်။ **Default:** `0`။
  * `address` {string} Bind လုပ်မယ့် numeric IP address တစ်ခုပါ။ [`socket.bind()`][] နဲ့ မတူတာက — DNS resolution ကို လုပ်ဆောင်မှာ မဟုတ်တာမို့ host name တစ်ခုကို လက်မခံပါဘူး။ ချန်လိုက်ရင် operating system က address အားလုံးကို bind လုပ်ပါတယ် (`'0.0.0.0'` — `udp4` sockets တွေအတွက်၊ `'::'` — `udp6` အတွက်)။
* Returns: {Object} [`socket.address()`][] က ပြန်ပေးသလို bind ဖြစ်သွားတဲ့ address။

ဒါက [`socket.bind()`][] ရဲ့ synchronous ပုံစံတူပါ။ `bind(2)` က local ဖြစ်ပြီး non-blocking ဖြစ်တဲ့ system call တစ်ခုမို့ — bind ကို inline လုပ်ဆောင်ပြီး `port` က `0` ဆိုရင် operating system က သတ်မှတ်ပေးတဲ့ ephemeral port အပါအဝင် — resolve ဖြစ်သွားတဲ့ address ကို ချက်ချင်း ပြန်ပေးပါတယ်:

```js
const dgram = require('node:dgram');

const socket = dgram.createSocket('udp4');
const address = socket.bindSync({ address: '0.0.0.0', port: 0 });
console.log(address); // e.g. { address: '0.0.0.0', family: 'IPv4', port: 53124 }
```

`EADDRINUSE` လိုမျိုး bind မအောင်မြင်မှုတွေက `'error'` event အနေနဲ့ emit လုပ်မယ့်အစား synchronously throw လုပ်ပါတယ်။ `bindSync()` ပြန်လာပြီးတဲ့နောက်မှာ [`socket.address()`][] က synchronously စစ်မှန်ပြီးသား ဖြစ်ပြီး — `'listening'` event ကို နောက် tick မှာ emit လုပ်ပါတယ်။

`address` က numeric IP literal တစ်ခု ဖြစ်ရမှာ ဖြစ်ပြီး `bindSync()` က DNS resolution ကို ဘယ်တော့မှ လုပ်ဆောင်မှာ မဟုတ်ပါဘူး (binding ရဲ့ တကယ့် blocking ဖြစ်တဲ့ အစိတ်အပိုင်းက asynchronous name resolution သာ ဖြစ်လို့ပါ)။ Incoming datagrams တွေကိုတော့ [`'message'`][] event ကနေ asynchronous အနေနဲ့ ဆက်ပြီး ပို့ပေးပါတယ်။ `bindSync()` က socket ရဲ့ ကိုယ်ပိုင် handle ကိုပဲ အမြဲ bind လုပ်ပြီး — [`cluster`][] handle sharing ထဲမှာ ပါဝင်မှာ မဟုတ်ပါဘူး။

### `socket.close([callback])`

* `callback` {Function} Socket ပိတ်သွားတဲ့အခါ ခေါ်ယူပါတယ်။

အရင်းခံ socket ကို ပိတ်ပြီး အဲဒီပေါ်မှာ data တွေ နားထောင်တာကို ရပ်လိုက်ပါတယ်။ Callback တစ်ခု ပေးထားရင် အဲဒါကို [`'close'`][] event ရဲ့ listener တစ်ခုအဖြစ် ထည့်ပေးပါတယ်။

### `socket[Symbol.asyncDispose]()`

[`socket.close()`][] ကို ခေါ်ပြီး — socket ပိတ်သွားတဲ့အခါ fulfill ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။

### `socket.connect(port[, address][, callback])`

* `port` {integer}
* `address` {string}
* `callback` {Function} Connection ပြီးစီးချိန် (သို့) error ဖြစ်ချိန်မှာ ခေါ်ယူပါတယ်။

`dgram.Socket` ကို remote address နဲ့ port တစ်ခုနဲ့ ချိတ်ဆက်ပေးပါတယ်။ ဒီ handle ကနေ ပို့လိုက်တဲ့ message တိုင်းကို အဲဒီ destination ဆီ အလိုအလျောက် ပို့ပေးမှာ ဖြစ်ပြီး — socket က အဲဒီ remote peer ဆီကနေပဲ message တွေကို လက်ခံမှာ ဖြစ်ပါတယ်။ ချိတ်ဆက်ပြီးသား socket တစ်ခုမှာ `connect()` ကို ခေါ်ဖို့ ကြိုးစားရင် [`ERR_SOCKET_DGRAM_IS_CONNECTED`][] exception ဖြစ်ပါတယ်။ `address` မပေးထားရင် `'127.0.0.1'` (`udp4` sockets တွေအတွက်) (သို့) `'::1'` (`udp6` sockets တွေအတွက်) ကို ပုံမှန် သုံးပါလိမ့်မယ်။ Connection ပြီးစီးတာနဲ့ `'connect'` event တစ်ခုကို emit လုပ်ပြီး — optional `callback` function ကို ခေါ်ပါတယ်။ မအောင်မြင်ခဲ့ရင် `callback` ကို ခေါ်ပြီး — အဲဒါလည်း မဖြစ်ရင် `'error'` event တစ်ခုကို emit လုပ်ပါတယ်။

### `socket.connectSync(port[, address])`

* `port` {integer}
* `address` {string} Connect လုပ်မယ့် numeric IP address တစ်ခုပါ။ [`socket.connect()`][] နဲ့ မတူတာက — DNS resolution ကို လုပ်ဆောင်မှာ မဟုတ်တာမို့ host name တစ်ခုကို လက်မခံပါဘူး။ ချန်လိုက်ရင် `'127.0.0.1'` (`udp4` sockets တွေအတွက်) (သို့) `'::1'` (`udp6` sockets တွေအတွက်) ကို သုံးပါတယ်။

ဒါက [`socket.connect()`][] ရဲ့ synchronous ပုံစံတူပါ။ UDP socket တစ်ခုအတွက် `connect(2)` က default peer address ကိုပဲ မှတ်တမ်းတင်ပြီး — local ဖြစ်ပြီး non-blocking ဖြစ်တဲ့ system call တစ်ခုမို့ ချိတ်ဆက်မှုကို inline လုပ်ဆောင်ပါတယ်။ ခေါ်ဆိုမှုကိုယ်တိုင်က ပေါ်ထွက်စေတဲ့ error တစ်ခုခု (ဥပမာ — address family မကိုက်ညီတဲ့ `EAFNOSUPPORT`) က `'error'` event ကနေ အစီရင်ခံမယ့်အစား synchronously throw လုပ်ပါတယ်။ `connect(2)` က reachability ကို စစ်ဆေးတာ မဟုတ်တာမို့ — `ECONNREFUSED` လို error တွေက [`socket.connect()`][] မှာ ဖြစ်သလိုပဲ နောက်ပိုင်း send (သို့) receive မှာ asynchronous အနေနဲ့ ပေါ်လာပါသေးတယ်:

```js
const dgram = require('node:dgram');

const socket = dgram.createSocket('udp4');
socket.connectSync(41234, '127.0.0.1');
console.log(socket.remoteAddress()); // { address: '127.0.0.1', family: 'IPv4', port: 41234 }
```

Socket က unbound ဖြစ်နေသေးရင် အရင်ဆုံး synchronously bind လုပ်ပါတယ်။ `connectSync()` ပြန်လာပြီးတဲ့နောက်မှာ [`socket.remoteAddress()`][] က synchronously စစ်မှန်ပြီးသား ဖြစ်ပြီး — `'connect'` event ကို နောက် tick မှာ emit လုပ်ပါတယ်။ ချိတ်ဆက်ပြီးသား socket တစ်ခုမှာ `connectSync()` ကို ခေါ်ဖို့ ကြိုးစားရင် [`ERR_SOCKET_DGRAM_IS_CONNECTED`][] exception ကို throw လုပ်ပြီး — asynchronous [`socket.bind()`][] တစ်ခု လုပ်ဆောင်နေဆဲ အချိန်မှာ ခေါ်လိုက်ရင်တော့ [`ERR_SOCKET_ALREADY_BOUND`][] exception ကို throw လုပ်ပါတယ်။

`address` က numeric IP literal တစ်ခု ဖြစ်ရမှာ ဖြစ်ပြီး `connectSync()` က DNS resolution ကို ဘယ်တော့မှ လုပ်ဆောင်မှာ မဟုတ်ပါဘူး (connecting ရဲ့ တကယ့် blocking ဖြစ်တဲ့ အစိတ်အပိုင်းက asynchronous name resolution သာ ဖြစ်လို့ပါ)။

### `socket.disconnect()`

Connected `dgram.Socket` တစ်ခုကို သူ့ရဲ့ remote address ကနေ ခွဲထုတ်ပေးတဲ့ synchronous function တစ်ခုပါ။ Unbound (သို့) ချိတ်ဆက်မှု ဖြုတ်ပြီးသား socket တစ်ခုပေါ်မှာ `disconnect()` ကို ခေါ်ဖို့ ကြိုးစားရင် [`ERR_SOCKET_DGRAM_NOT_CONNECTED`][] exception ဖြစ်ပါတယ်။

### `socket.dropMembership(multicastAddress[, multicastInterface])`

* `multicastAddress` {string}
* `multicastInterface` {string}

Kernel ကို `IP_DROP_MEMBERSHIP` socket option သုံးပြီး `multicastAddress` မှာရှိတဲ့ multicast group ကနေ ထွက်ခွာဖို့ ညွှန်ကြားပါတယ်။ Socket ပိတ်သွားချိန် (သို့) process terminate ဖြစ်ချိန်မှာ kernel က ဒီ method ကို အလိုအလျောက် ခေါ်ပေးတာမို့ — app အများစုက ဒီ method ကို ခေါ်ဖို့ အကြောင်းပြချက် ရှိမှာ မဟုတ်ပါဘူး။

`multicastInterface` ကို မသတ်မှတ်ထားရင် operating system က valid interface အားလုံးပေါ်မှာ membership ကို ဖယ်ရှားဖို့ ကြိုးစားပါလိမ့်မယ်။

### `socket.dropSourceSpecificMembership(sourceAddress, groupAddress[, multicastInterface])`

* `sourceAddress` {string}
* `groupAddress` {string}
* `multicastInterface` {string}

Kernel ကို `IP_DROP_SOURCE_MEMBERSHIP` socket option သုံးပြီး ပေးထားတဲ့ `sourceAddress` နဲ့ `groupAddress` မှာရှိတဲ့ source-specific multicast channel ကနေ ထွက်ခွာဖို့ ညွှန်ကြားပါတယ်။ Socket ပိတ်သွားချိန် (သို့) process terminate ဖြစ်ချိန်မှာ kernel က ဒီ method ကို အလိုအလျောက် ခေါ်ပေးတာမို့ — app အများစုက ဒီ method ကို ခေါ်ဖို့ အကြောင်းပြချက် ရှိမှာ မဟုတ်ပါဘူး။

`multicastInterface` ကို မသတ်မှတ်ထားရင် operating system က valid interface အားလုံးပေါ်မှာ membership ကို ဖယ်ရှားဖို့ ကြိုးစားပါလိမ့်မယ်။

### `socket.getRecvBufferSize()`

* Returns: {number} `SO_RCVBUF` socket ရဲ့ receive buffer အရွယ်အစား (bytes နဲ့)။

ဒီ method က unbound socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် [`ERR_SOCKET_BUFFER_SIZE`][] ကို throw လုပ်ပါတယ်။

### `socket.getSendBufferSize()`

* Returns: {number} `SO_SNDBUF` socket ရဲ့ send buffer အရွယ်အစား (bytes နဲ့)။

ဒီ method က unbound socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် [`ERR_SOCKET_BUFFER_SIZE`][] ကို throw လုပ်ပါတယ်။

### `socket.getSendQueueSize()`

* Returns: {number} ပို့ဖို့ queue တင်ထားတဲ့ bytes အရေအတွက်။

### `socket.getSendQueueCount()`

* Returns: {number} လက်ရှိ queue ထဲမှာ လုပ်ဆောင်ဖို့ စောင့်ဆိုင်းနေတဲ့ send requests အရေအတွက်။

### `socket.ref()`

* Returns: {dgram.Socket}

ပုံမှန်အားဖြင့် socket တစ်ခုကို bind လုပ်လိုက်ရင် socket ဖွင့်ထားသရွေ့ Node.js process ကို exit မလုပ်နိုင်အောင် ပိတ်ဆို့ (block) ထားပါတယ်။ `socket.unref()` method ကို Node.js process ကို active ဖြစ်အောင် ထိန်းထားတဲ့ reference counting ထဲကနေ socket ကို ဖယ်ထုတ်ဖို့ သုံးနိုင်ပါတယ်။ `socket.ref()` method ကတော့ socket ကို reference counting ထဲ ပြန်ထည့်ပြီး — ပုံမှန် အပြုအမူကို ပြန်လည် ရရှိစေပါတယ်။

`socket.ref()` ကို အကြိမ်များစွာ ခေါ်လိုက်ရင် နောက်ထပ် သက်ရောက်မှု တစ်စုံတစ်ရာ ရှိမှာ မဟုတ်ပါဘူး။

`socket.ref()` method က socket ဆီကို reference တစ်ခု ပြန်ပေးတာမို့ — ခေါ်ဆိုမှုတွေကို ဆက်တွဲ (chain) လုပ်နိုင်ပါတယ်။

### `socket.remoteAddress()`

* Returns: {Object}

Remote endpoint ရဲ့ `address`, `family` နဲ့ `port` တွေ ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ Socket က connect မလုပ်ရသေးရင် ဒီ method က [`ERR_SOCKET_DGRAM_NOT_CONNECTED`][] exception တစ်ခုကို throw လုပ်ပါတယ်။

### `socket.send(msg[, offset, length][, port][, address][, callback])`

* `msg` {Buffer|TypedArray|DataView|string|Array} ပို့မယ့် message။
* `offset` {integer} Message စတင်တဲ့ buffer ထဲက offset။
* `length` {integer} Message ထဲက bytes အရေအတွက်။
* `port` {integer} Destination port။
* `address` {string} Destination ရဲ့ host name (သို့) IP address။
* `callback` {Function} Message ပို့ပြီးတဲ့အခါ ခေါ်ယူပါတယ်။

Socket ပေါ်မှာ datagram တစ်ခုကို broadcast (ထုတ်လွှင့်) လုပ်ပါတယ်။ Connectionless sockets တွေအတွက် destination `port` နဲ့ `address` ကို သတ်မှတ်ပေးရပါမယ်။ Connected sockets တွေကတော့ သူတို့နဲ့ ချိတ်ဆက်ထားတဲ့ remote endpoint ကို သုံးမှာမို့ — `port` နဲ့ `address` argument တွေကို သတ်မှတ်မပေးရပါဘူး။

`msg` argument ထဲမှာ ပို့မယ့် message ပါဝင်ပါတယ်။ သူ့ရဲ့ type ပေါ်မူတည်ပြီး အပြုအမူ ကွဲပြားနိုင်ပါတယ်။ `msg` က `Buffer` (သို့) `TypedArray` (သို့) `DataView` တစ်ခုခု ဆိုရင် — `offset` နဲ့ `length` က message စတင်တဲ့ `Buffer` ထဲက offset နဲ့ message ထဲက bytes အရေအတွက်ကို အသီးသီး သတ်မှတ်ပေးပါတယ်။ `msg` က `String` တစ်ခုဆိုရင် `'utf8'` encoding နဲ့ `Buffer` တစ်ခုအဖြစ် အလိုအလျောက် ပြောင်းလဲပေးပါတယ်။ Multi-byte character တွေ ပါဝင်တဲ့ messages တွေမှာ `offset` နဲ့ `length` ကို character နေရာပေါ်မဟုတ်ဘဲ [byte length][] ပေါ်မှာ အခြေခံပြီး တွက်ချက်ပါတယ်။ `msg` က array တစ်ခုဆိုရင် `offset` နဲ့ `length` ကို သတ်မှတ်မပေးရပါဘူး။

`address` argument က string တစ်ခုပါ။ `address` ရဲ့ တန်ဖိုးက host name တစ်ခု ဆိုရင် host ရဲ့ address ကို ရှာဖွေဖို့ DNS ကို သုံးပါလိမ့်မယ်။ `address` မပေးထားရင် (သို့) nullish ဖြစ်နေရင် `'127.0.0.1'` (`udp4` sockets တွေအတွက်) (သို့) `'::1'` (`udp6` sockets တွေအတွက်) ကို ပုံမှန် သုံးပါလိမ့်မယ်။

Socket ကို အရင်က `bind` ခေါ်ပြီး bind လုပ်ထားခြင်း မရှိဘူးဆိုရင် — socket ကို random port number တစ်ခု သတ်မှတ်ပေးပြီး "all interfaces" address (`udp4` sockets တွေအတွက် `'0.0.0.0'`၊ `udp6` sockets တွေအတွက် `'::0'`) ပေါ်မှာ bind လုပ်ပေးပါတယ်။

Optional `callback` function တစ်ခုကို — DNS errors တွေကို အစီရင်ခံဖို့ (သို့) `buf` object ကို ပြန်သုံးဖို့ ဘေးကင်းတဲ့အချိန်ကို ဆုံးဖြတ်ဖို့ အနေနဲ့ သတ်မှတ်ပေးနိုင်ပါတယ်။ DNS lookups တွေက send လုပ်ချိန်ကို Node.js event loop ရဲ့ tick တစ်ခုအနည်းဆုံး နှောင့်နှေးစေပါတယ်။

Datagram ပို့ပြီးကြောင်း သေချာစွာ သိနိုင်တဲ့ တစ်ခုတည်းသော နည်းလမ်းက `callback` တစ်ခုကို သုံးတာပါ။ Error တစ်ခု ဖြစ်ပြီး `callback` ပေးထားရင် error ကို `callback` ဆီ ပထမဆုံး argument အနေနဲ့ ပေးပို့ပါလိမ့်မယ်။ `callback` မပေးထားရင် error ကို `socket` object ပေါ်မှာ `'error'` event အနေနဲ့ emit လုပ်ပါတယ်။

Offset နဲ့ length က optional ဖြစ်ပေမယ့် — တစ်ခုခုကို သုံးမယ်ဆိုရင် နှစ်ခုလုံး _မဖြစ်မနေ_ သတ်မှတ်ပေးရပါမယ်။ ပထမဆုံး argument က `Buffer` (သို့) `TypedArray` (သို့) `DataView` တစ်ခုဖြစ်မှသာ ဒီနှစ်ခုကို ပံ့ပိုးပေးပါတယ်။

ဒီ method က unbound socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် [`ERR_SOCKET_BAD_PORT`][] ကို throw လုပ်ပါတယ်။

`localhost` ပေါ်ရှိ port တစ်ခုဆီ UDP packet တစ်ခု ပို့တဲ့ ဥပမာ:

```mjs
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```

```cjs
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, 'localhost', (err) => {
  client.close();
});
```

`127.0.0.1` ပေါ်ရှိ port တစ်ခုဆီ buffers အများကြီးနဲ့ ဖွဲ့စည်းထားတဲ့ UDP packet တစ်ခု ပို့တဲ့ ဥပမာ:

```mjs
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```

```cjs
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const buf1 = Buffer.from('Some ');
const buf2 = Buffer.from('bytes');
const client = dgram.createSocket('udp4');
client.send([buf1, buf2], 41234, (err) => {
  client.close();
});
```

Buffers အများကြီး ပို့တာက application နဲ့ operating system ပေါ်မူတည်ပြီး — ပိုမြန်နိုင်သလို ပိုနှေးလည်း နှေးနိုင်ပါတယ်။ Case-by-case အလိုက် အကောင်းဆုံး နည်းဗျူဟာကို ဆုံးဖြတ်ဖို့ benchmark တွေ run ကြည့်ပါ။ ယေဘုယျအားဖြင့်တော့ buffers အများကြီး ပို့တာက ပိုမြန်ပါတယ်။

`localhost` ပေါ်ရှိ port တစ်ခုဆီ connect လုပ်ထားတဲ့ socket တစ်ခုကို သုံးပြီး UDP packet တစ်ခု ပို့တဲ့ ဥပမာ:

```mjs
import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```

```cjs
const dgram = require('node:dgram');
const { Buffer } = require('node:buffer');

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.connect(41234, 'localhost', (err) => {
  client.send(message, (err) => {
    client.close();
  });
});
```

#### UDP datagram size ဆိုင်ရာ မှတ်ချက် (Note about UDP datagram size)

IPv4/v6 datagram တစ်ခုရဲ့ အများဆုံး အရွယ်အစားက `MTU` (Maximum Transmission Unit) နဲ့ `Payload Length` field ရဲ့ အရွယ်အစားပေါ်မှာ မူတည်ပါတယ်။

* `Payload Length` field က 16 bits အကျယ် ရှိတာမို့ — ပုံမှန် payload တစ်ခုက internet header နဲ့ data အပါအဝင် 64K octets (65,507 bytes = 65,535 − 8 bytes UDP header − 20 bytes IP header) ထက် မကျော်လွန်နိုင်ပါဘူး။ Loopback interfaces တွေမှာ ဒါက ယေဘုယျအားဖြင့် မှန်ကန်ပေမယ့် — ဒီလောက် ရှည်လျားတဲ့ datagram messages တွေက host နဲ့ network အများစုအတွက် လက်တွေ့မကျပါဘူး။

* `MTU` က ပေးထားတဲ့ link layer technology တစ်ခုက datagram messages တွေအတွက် ပံ့ပိုးနိုင်တဲ့ အကြီးဆုံး အရွယ်အစား ဖြစ်ပါတယ်။ Link တိုင်းအတွက် IPv4 က အနည်းဆုံး `MTU` 68 octets ကို သတ်မှတ်ပြီး — IPv4 အတွက် အကြံပြုထားတဲ့ `MTU` ကတော့ 576 (dial-up ပုံစံ application တွေရဲ့ `MTU` အဖြစ် ပုံမှန် အကြံပြုလေ့ရှိတာ) ဖြစ်ပါတယ်။ ဒါက packet တွေ တစ်ပိုင်းလုံး ရောက်သည်ဖြစ်စေ၊ fragment တွေအဖြစ် ရောက်သည်ဖြစ်စေ သက်ဆိုင်ပါတယ်။

  IPv6 အတွက် အနည်းဆုံး `MTU` ကတော့ 1280 octets ပါ။ ဒါပေမယ့် မဖြစ်မနေ လိုအပ်တဲ့ အနည်းဆုံး fragment reassembly buffer အရွယ်အစားကတော့ 1500 octets ပဲ ဖြစ်ပါတယ်။ 68 octets ဆိုတဲ့ တန်ဖိုးက အလွန် သေးငယ်ပါတယ် — Ethernet လို လက်ရှိ link layer technologies အများစုမှာ အနည်းဆုံး `MTU` 1500 ရှိလို့ပါ။

Packet တစ်ခု ဖြတ်သန်းသွားနိုင်တဲ့ link တစ်ခုချင်းစီရဲ့ MTU ကို ကြိုတင် သိရှိဖို့ မဖြစ်နိုင်ပါဘူး။ Receiver ရဲ့ `MTU` ထက် ပိုကြီးတဲ့ datagram တစ်ခုကို ပို့လိုက်ရင် အလုပ်ဖြစ်မှာ မဟုတ်ပါဘူး — data က ရည်ရွယ်ထားတဲ့ လက်ခံသူဆီ မရောက်ခဲ့ကြောင်း source ကို အကြောင်းကြားစရာ မရှိဘဲ packet ကို တိတ်တဆိတ် ပစ်ချခံလိုက်ရလို့ပါ။

### `socket.setBroadcast(flag)`

* `flag` {boolean}

`SO_BROADCAST` socket option ကို set (ဖွင့်) (သို့) clear (ပိတ်) လုပ်ပေးပါတယ်။ `true` လို့ သတ်မှတ်ထားရင် UDP packets တွေကို local interface တစ်ခုရဲ့ broadcast address ဆီ ပို့နိုင်ပါတယ်။

ဒီ method က unbound socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် `EBADF` ကို throw လုပ်ပါတယ်။

### `socket.setMulticastInterface(multicastInterface)`

* `multicastInterface` {string}

_ဒီ section ထဲက scope ဆိုတဲ့ ကိုးကားချက် အားလုံးက [IPv6 Zone Indexes][] တွေကို ရည်ညွှန်းနေတာ ဖြစ်ပြီး — အဲဒါတွေကို [RFC 4007][] က သတ်မှတ်ပါတယ်။ String ပုံစံနဲ့ ဆိုရင် scope index ပါတဲ့ IP တစ်ခုကို `'IP%scope'` လို ရေးသားပြီး — အဲဒီမှာ scope က interface name (သို့) interface number တစ်ခု ဖြစ်ပါတယ်။_

ဒီ method က socket ရဲ့ ပုံမှန် outgoing multicast interface ကို ရွေးချယ်ထားတဲ့ interface တစ်ခုအဖြစ် (သို့) system ရဲ့ interface ရွေးချယ်မှုဆီ ပြန်သွားအောင် သတ်မှတ်ပေးပါတယ်။ `multicastInterface` က socket ရဲ့ family ထဲက IP တစ်ခုရဲ့ valid string representation တစ်ခု ဖြစ်ရပါမယ်။

IPv4 sockets တွေအတွက် ဒါက လိုချင်တဲ့ physical interface ပေါ်မှာ သတ်မှတ်ထားတဲ့ IP ဖြစ်သင့်ပါတယ်။ Socket ပေါ်မှာ multicast ဆီ ပို့လိုက်တဲ့ packet တွေ အားလုံးကို — ဒီ method ကို နောက်ဆုံး အောင်မြင်စွာ သုံးခဲ့တဲ့အချိန်က ဆုံးဖြတ်လိုက်တဲ့ interface ပေါ်ကနေ ပို့ပါလိမ့်မယ်။

IPv6 sockets တွေအတွက် `multicastInterface` ထဲမှာ interface ကို ဖော်ပြတဲ့ scope တစ်ခု ပါဝင်သင့်ပါတယ် — အောက်က ဥပမာတွေထဲမှာ ပြထားသလိုပါ။ IPv6 မှာ `send` ခေါ်ဆိုမှု တစ်ခုချင်းစီကလည်း address ထဲမှာ explicit scope ကို သုံးနိုင်တာမို့ — explicit scope မသတ်မှတ်ဘဲ multicast address တစ်ခုဆီ ပို့တဲ့ packet တွေပဲ ဒီ method ရဲ့ နောက်ဆုံး အောင်မြင်တဲ့ အသုံးပြုမှုရဲ့ သက်ရောက်မှုကို ခံရပါတယ်။

ဒီ method က unbound socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် `EBADF` ကို throw လုပ်ပါတယ်။

#### ဥပမာ — IPv6 outgoing multicast interface (Example: IPv6 outgoing multicast interface)

Scope format က interface name ကို သုံးတဲ့ system အများစုမှာ:

```js
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%eth1');
});
```

Windows လိုမျိုး scope format က interface number ကို သုံးတဲ့နေရာမှာ:

```js
const socket = dgram.createSocket('udp6');

socket.bind(1234, () => {
  socket.setMulticastInterface('::%2');
});
```

#### ဥပမာ — IPv4 outgoing multicast interface (Example: IPv4 outgoing multicast interface)

System အားလုံးက လိုချင်တဲ့ physical interface ပေါ်ရှိ host ရဲ့ IP တစ်ခုကို သုံးပါတယ်:

```js
const socket = dgram.createSocket('udp4');

socket.bind(1234, () => {
  socket.setMulticastInterface('10.0.0.2');
});
```

#### ခေါ်ဆိုမှုရလဒ်များ (Call results)

ပို့ဖို့ အဆင်သင့် မဖြစ်သေးတဲ့ (သို့) ပိတ်သွားပြီးသား socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် _Not running_ [`Error`][] တစ်ခုကို throw လုပ်နိုင်ပါတယ်။

`multicastInterface` ကို IP တစ်ခုအဖြစ် parse လုပ်လို့ မရဘူးဆိုရင် _EINVAL_ [`System Error`][] တစ်ခုကို throw လုပ်ပါတယ်။

IPv4 မှာ `multicastInterface` က valid address တစ်ခု ဖြစ်ပေမယ့် interface တစ်ခုခုနဲ့ မကိုက်ညီဘူးဆိုရင် (သို့) address က family နဲ့ မကိုက်ညီဘူးဆိုရင် — `EADDRNOTAVAIL` (သို့) `EPROTONOSUP` လို [`System Error`][] တစ်ခုကို throw လုပ်ပါတယ်။

IPv6 မှာ scope သတ်မှတ်ရာမှာ (သို့) ချန်လိုက်ရာမှာ ဖြစ်တဲ့ error အများစုက socket ကို system ရဲ့ ပုံမှန် default interface ရွေးချယ်မှုကို ဆက်လက် သုံးစေပြီး (သို့) ပြန်လည် သုံးစေပါတယ်။

Socket ရဲ့ address family ရဲ့ ANY address (IPv4 `'0.0.0.0'` (သို့) IPv6 `'::'`) ကို သုံးပြီး — နောင်က multicast packets တွေအတွက် socket ရဲ့ ပုံမှန် outgoing interface ရဲ့ ထိန်းချုပ်မှုကို system ဆီ ပြန်ပေးနိုင်ပါတယ်။

### `socket.setMulticastLoopback(flag)`

* `flag` {boolean}

`IP_MULTICAST_LOOP` socket option ကို set (ဖွင့်) (သို့) clear (ပိတ်) လုပ်ပေးပါတယ်။ `true` လို့ သတ်မှတ်ထားရင် multicast packets တွေကို local interface ပေါ်မှာပါ ပြန်လက်ခံရရှိပါလိမ့်မယ်။

ဒီ method က unbound socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် `EBADF` ကို throw လုပ်ပါတယ်။

### `socket.setMulticastTTL(ttl)`

* `ttl` {integer}

`IP_MULTICAST_TTL` socket option ကို set လုပ်ပါတယ်။ TTL က ယေဘုယျအားဖြင့် "Time to Live" ကို ဆိုလိုပေမယ့် — ဒီ context မှာတော့ packet တစ်ခုကို ဖြတ်သန်းခွင့် ပြုထားတဲ့ IP hops အရေအတွက်ကို သတ်မှတ်ပေးတာ ဖြစ်ပြီး အထူးသဖြင့် multicast traffic အတွက် ဖြစ်ပါတယ်။ Packet တစ်ခုကို forward လုပ်တဲ့ router (သို့) gateway တိုင်းက TTL ကို လျှော့ချပါတယ်။ TTL က router တစ်ခုမှာ 0 အထိ လျှော့ခံလိုက်ရရင် အဲဒီ packet ကို forward လုပ်တော့မှာ မဟုတ်ပါဘူး။

`ttl` argument က 0 ကနေ 255 ကြား ဖြစ်နိုင်ပါတယ်။ System အများစုမှာ ပုံမှန် `1` ပဲ ဖြစ်ပါတယ်။

ဒီ method က unbound socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် `EBADF` ကို throw လုပ်ပါတယ်။

### `socket.setRecvBufferSize(size)`

* `size` {integer}

`SO_RCVBUF` socket option ကို set လုပ်ပါတယ်။ Socket ရဲ့ အများဆုံး receive buffer အရွယ်အစားကို bytes နဲ့ သတ်မှတ်ပေးပါတယ်။

ဒီ method က unbound socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် [`ERR_SOCKET_BUFFER_SIZE`][] ကို throw လုပ်ပါတယ်။

### `socket.setSendBufferSize(size)`

* `size` {integer}

`SO_SNDBUF` socket option ကို set လုပ်ပါတယ်။ Socket ရဲ့ အများဆုံး send buffer အရွယ်အစားကို bytes နဲ့ သတ်မှတ်ပေးပါတယ်။

ဒီ method က unbound socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် [`ERR_SOCKET_BUFFER_SIZE`][] ကို throw လုပ်ပါတယ်။

### `socket.setTTL(ttl)`

* `ttl` {integer}

`IP_TTL` socket option ကို set လုပ်ပါတယ်။ TTL က ယေဘုယျအားဖြင့် "Time to Live" ကို ဆိုလိုပေမယ့် — ဒီ context မှာတော့ packet တစ်ခုကို ဖြတ်သန်းခွင့် ပြုထားတဲ့ IP hops အရေအတွက်ကို သတ်မှတ်ပေးတာ ဖြစ်ပါတယ်။ Router (သို့) gateway တိုင်းက forward လုပ်တဲ့ packet တိုင်းရဲ့ TTL ကို လျှော့ချပါတယ်။ TTL က router တစ်ခုမှာ 0 အထိ လျှော့ခံလိုက်ရရင် အဲဒီ packet ကို forward လုပ်တော့မှာ မဟုတ်ပါဘူး။ TTL တန်ဖိုးတွေကို ပြောင်းလဲတာက ပုံမှန်အားဖြင့် network probes တွေ (သို့) multicasting လုပ်တဲ့အခါမျိုးမှာ လုပ်လေ့ရှိပါတယ်။

`ttl` argument က 1 ကနေ 255 ကြား ဖြစ်နိုင်ပါတယ်။ System အများစုမှာ ပုံမှန် 64 ပဲ ဖြစ်ပါတယ်။

ဒီ method က unbound socket တစ်ခုပေါ်မှာ ခေါ်လိုက်ရင် `EBADF` ကို throw လုပ်ပါတယ်။

### `socket.unref()`

* Returns: {dgram.Socket}

ပုံမှန်အားဖြင့် socket တစ်ခုကို bind လုပ်လိုက်ရင် socket ဖွင့်ထားသရွေ့ Node.js process ကို exit မလုပ်နိုင်အောင် ပိတ်ဆို့ (block) ထားပါတယ်။ `socket.unref()` method ကို Node.js process ကို active ဖြစ်အောင် ထိန်းထားတဲ့ reference counting ထဲကနေ socket ကို ဖယ်ထုတ်ဖို့ သုံးနိုင်ပြီး — socket က ဆက်ပြီး listening ဖြစ်နေရင်တောင် process ကို exit လုပ်ခွင့် ပေးပါတယ်။

`socket.unref()` ကို အကြိမ်များစွာ ခေါ်လိုက်ရင် နောက်ထပ် သက်ရောက်မှု တစ်စုံတစ်ရာ ရှိမှာ မဟုတ်ပါဘူး။

`socket.unref()` method က socket ဆီကို reference တစ်ခု ပြန်ပေးတာမို့ — ခေါ်ဆိုမှုတွေကို ဆက်တွဲ (chain) လုပ်နိုင်ပါတယ်။

## `node:dgram` module functions

### `dgram.createSocket(options[, callback])`

* `options` {Object} ရနိုင်တဲ့ options တွေကတော့:
  * `type` {string} Socket ရဲ့ family ဖြစ်ပြီး `'udp4'` (သို့) `'udp6'` ဖြစ်ရပါမယ်။ မဖြစ်မနေ လိုအပ်ပါတယ်။
  * `reuseAddr` {boolean} `true` ဆိုရင် တစ်ခြား process တစ်ခုက socket တစ်ခုကို အဲဒီပေါ်မှာ bind လုပ်ပြီးသား ဖြစ်နေရင်တောင် [`socket.bind()`][] က address ကို ပြန်သုံးပါလိမ့်မယ် — ဒါပေမယ့် socket တစ်ခုတည်းကပဲ data ကို လက်ခံနိုင်မှာ ဖြစ်ပါတယ်။ **Default:** `false`။
  * `reusePort` {boolean} `true` ဆိုရင် တစ်ခြား process တစ်ခုက socket တစ်ခုကို အဲဒီပေါ်မှာ bind လုပ်ပြီးသား ဖြစ်နေရင်တောင် [`socket.bind()`][] က port ကို ပြန်သုံးပါလိမ့်မယ်။ Incoming datagrams တွေကို listening sockets တွေကြားမှာ ခွဲဝေ ပေးပို့ပါတယ်။ ဒီ option က Linux 3.9+, DragonFlyBSD 3.6+, FreeBSD 12.0+, Solaris 11.4 နဲ့ AIX 7.2.5+ လို platform အချို့မှာပဲ ရနိုင်ပါတယ်။ မပံ့ပိုးတဲ့ platform တွေမှာ ဒီ option က socket bind လုပ်တဲ့အခါ error တစ်ခု ဖြစ်စေပါတယ်။ **Default:** `false`။
  * `ipv6Only` {boolean} `ipv6Only` ကို `true` လို့ သတ်မှတ်လိုက်ရင် dual-stack support ကို ပိတ်လိုက်တာပါ — ဆိုလိုတာက address `::` ကို bind လုပ်လိုက်ရင် `0.0.0.0` ပါ bind ဖြစ်စေမှာ မဟုတ်ပါဘူး။ **Default:** `false`။
  * `recvBufferSize` {number} `SO_RCVBUF` socket value ကို set လုပ်ပါတယ်။
  * `sendBufferSize` {number} `SO_SNDBUF` socket value ကို set လုပ်ပါတယ်။
  * `lookup` {Function} ကိုယ်ပိုင် (custom) lookup function။ **Default:** [`dns.lookup()`][]။ Default ကို သုံးတဲ့အခါ socket ရဲ့ family နဲ့ ကိုက်ညီတဲ့ literal IP address တစ်ခုက [`dns.lookup()`][] ကို မခေါ်ဘဲ သူ့ဘာသာသူ resolve ဖြစ်သွားပါတယ်။
  * `signal` {AbortSignal} Socket တစ်ခုကို ပိတ်ဖို့ သုံးနိုင်တဲ့ AbortSignal တစ်ခု။
  * `receiveBlockList` {net.BlockList} `receiveBlockList` ကို specific IP addresses, IP ranges (သို့) IP subnets တွေဆီက incoming datagrams တွေကို ပစ်ပယ်ဖို့ သုံးနိုင်ပါတယ်။ Server က reverse proxy, NAT စတာတွေရဲ့ နောက်မှာ ရှိနေရင် ဒါက အလုပ်မလုပ်ပါဘူး — blocklist နဲ့ စစ်ဆေးတဲ့ address က proxy ရဲ့ address (သို့) NAT က သတ်မှတ်တဲ့ address ဖြစ်နေလို့ပါ။
  * `sendBlockList` {net.BlockList} `sendBlockList` ကို specific IP addresses, IP ranges (သို့) IP subnets တွေဆီ outbound access ကို ပိတ်ထားဖို့ သုံးနိုင်ပါတယ်။
* `callback` {Function} `'message'` events တွေရဲ့ listener အဖြစ် ထည့်ပေးပါတယ်။ Optional ဖြစ်ပါတယ်။
* Returns: {dgram.Socket}

`dgram.Socket` object တစ်ခုကို ဖန်တီးပေးပါတယ်။ Socket ဖန်တီးပြီးတာနဲ့ [`socket.bind()`][] ကို ခေါ်လိုက်ရင် socket က datagram messages တွေကို နားထောင်တာ စတင်ပါလိမ့်မယ်။ [`socket.bind()`][] ကို ခေါ်တဲ့အခါ `address` နဲ့ `port` ကို မပေးလိုက်ဘူးဆိုရင် method က socket ကို "all interfaces" address ပေါ်မှာ random port တစ်ခုနဲ့ bind လုပ်ပါတယ် (`udp4` ရော `udp6` sockets တွေအတွက်ပါ မှန်ကန်တဲ့ အလုပ်ကို လုပ်ပေးပါတယ်)။ Bind ဖြစ်သွားတဲ့ address နဲ့ port ကို [`socket.address().address`][] နဲ့ [`socket.address().port`][] သုံးပြီး ပြန်ယူနိုင်ပါတယ်။

`signal` option ကို ဖွင့်ထားရင် သက်ဆိုင်ရာ `AbortController` ပေါ်မှာ `.abort()` ကို ခေါ်လိုက်တာက socket ပေါ်မှာ `.close()` ကို ခေါ်လိုက်တာနဲ့ ဆင်တူပါတယ်:

```js
const controller = new AbortController();
const { signal } = controller;
const server = dgram.createSocket({ type: 'udp4', signal });
server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
// Later, when you want to close the server.
controller.abort();
```

### `dgram.createSocket(type[, callback])`

* `type` {string} `'udp4'` (သို့) `'udp6'` အနက် တစ်ခု ဖြစ်ပါတယ်။
* `callback` {Function} `'message'` events တွေရဲ့ listener အဖြစ် ထည့်ပေးပါတယ်။
* Returns: {dgram.Socket}

သတ်မှတ်ထားတဲ့ `type` တစ်ခုနဲ့ `dgram.Socket` object တစ်ခုကို ဖန်တီးပေးပါတယ်။

Socket ဖန်တီးပြီးတာနဲ့ [`socket.bind()`][] ကို ခေါ်လိုက်ရင် socket က datagram messages တွေကို နားထောင်တာ စတင်ပါလိမ့်မယ်။ [`socket.bind()`][] ကို ခေါ်တဲ့အခါ `address` နဲ့ `port` ကို မပေးလိုက်ဘူးဆိုရင် method က socket ကို "all interfaces" address ပေါ်မှာ random port တစ်ခုနဲ့ bind လုပ်ပါတယ် (`udp4` ရော `udp6` sockets တွေအတွက်ပါ မှန်ကန်တဲ့ အလုပ်ကို လုပ်ပေးပါတယ်)။ Bind ဖြစ်သွားတဲ့ address နဲ့ port ကို [`socket.address().address`][] နဲ့ [`socket.address().port`][] သုံးပြီး ပြန်ယူနိုင်ပါတယ်။

[IPv6 Zone Indexes]: https://en.wikipedia.org/wiki/IPv6_address#Scoped_literal_IPv6_addresses
[RFC 4007]: https://tools.ietf.org/html/rfc4007
[`'close'`]: #event-close
[`'message'`]: #event-message
[`ERR_SOCKET_ALREADY_BOUND`]: errors.md#err_socket_already_bound
[`ERR_SOCKET_BAD_PORT`]: errors.md#err_socket_bad_port
[`ERR_SOCKET_BUFFER_SIZE`]: errors.md#err_socket_buffer_size
[`ERR_SOCKET_DGRAM_IS_CONNECTED`]: errors.md#err_socket_dgram_is_connected
[`ERR_SOCKET_DGRAM_NOT_CONNECTED`]: errors.md#err_socket_dgram_not_connected
[`Error`]: errors.md#class-error
[`System Error`]: errors.md#class-systemerror
[`close()`]: #socketclosecallback
[`cluster`]: cluster.md
[`connect()`]: #socketconnectport-address-callback
[`dgram.createSocket()`]: #dgramcreatesocketoptions-callback
[`dns.lookup()`]: dns.md#dnslookuphostname-options-callback
[`socket.address().address`]: #socketaddress
[`socket.address().port`]: #socketaddress
[`socket.address()`]: #socketaddress
[`socket.bind()`]: #socketbindport-address-callback
[`socket.close()`]: #socketclosecallback
[`socket.connect()`]: #socketconnectport-address-callback
[`socket.remoteAddress()`]: #socketremoteaddress
[byte length]: buffer.md#static-method-bufferbytelengthstring-encoding
