---
title: "HTTP"
description: "node:http module — HTTP server နဲ့ client တည်ဆောက်ရန် — http.Server, http.ClientRequest, http.ServerResponse, http.IncomingMessage, http.OutgoingMessage, http.Agent, http.createServer/request/get, METHODS & STATUS_CODES, message events/headers, trailers စသည်"
order: 148
source: "https://nodejs.org/api/http.html"
status: translated
updated: 2026-09-05
---

> Stability: 2 - Stable

ဒီ module က client ရော server ပါ ပါဝင်ပြီး — `require('node:http')` (CommonJS) သို့မဟုတ် `import * as http from 'node:http'` (ES module) ကနေတစ်ဆင့် import လုပ်နိုင်ပါတယ်။

Node.js ထဲက HTTP interfaces တွေက — အစဉ်အလာအရ သုံးစွဲရ ခက်ခဲခဲ့တဲ့ — protocol ရဲ့ features အများအပြားကို support လုပ်ဖို့ ဒီဇိုင်းထုတ်ထားပါတယ်။ အထူးသဖြင့် ကြီးမားပြီး chunk-encoded ဖြစ်နိုင်တဲ့ messages တွေပါ။ Interface က requests သို့မဟုတ် responses တစ်ခုလုံးကို buffer လုပ်တာမျိုး ဘယ်တော့မှ မလုပ်ဖို့ ဂရုစိုက်ထားတာမို့ — user တွေက data တွေကို stream လုပ်နိုင်ပါတယ်။

HTTP message headers တွေကို ဒီလိုမျိုး object တစ်ခုနဲ့ ကိုယ်စားပြုပါတယ်:

```json
{ "content-length": "123",
  "content-type": "text/plain",
  "connection": "keep-alive",
  "host": "example.com",
  "accept": "*/*" }
```

Keys တွေကို lowercase အဖြစ် ပြောင်းလဲပါတယ်။ Values တွေကိုတော့ ပြုပြင် မွမ်းမံခြင်း မပြုလုပ်ပါဘူး။

ဖြစ်နိုင်တဲ့ HTTP applications တွေရဲ့ အကွာအဝေး (spectrum) တစ်ခုလုံးကို support လုပ်နိုင်ဖို့အတွက် — Node.js ရဲ့ HTTP API က အလွန် low-level ဖြစ်ပါတယ်။ ၎င်းက stream handling နဲ့ message parsing ကိုသာ ကိုင်တွယ်ပါတယ်။ Message တစ်ခုကို headers နဲ့ body အဖြစ် parse လုပ်ပေးပေမယ့် — headers တွေရဲ့ ပါဝင်တဲ့ အကြောင်းအရာ သို့မဟုတ် body ကိုတော့ parse လုပ်မပေးပါဘူး။

Duplicate headers တွေကို ဘယ်လို ကိုင်တွယ်လဲဆိုတဲ့ အသေးစိတ်အတွက် [`message.headers`][] ကို ကြည့်ပါ။

လက်ခံရရှိခဲ့တဲ့အတိုင်း မပြောင်းလဲပဲ ထားတဲ့ raw headers တွေကို `rawHeaders` property ထဲမှာ သိမ်းဆည်းထားပြီး — ၎င်းက `[key, value, key2, value2, ...]` ပုံစံ array တစ်ခု ဖြစ်ပါတယ်။ ဥပမာ — အပေါ်က message header object မှာ အောက်ပါအတိုင်း `rawHeaders` list တစ်ခု ရှိနိုင်ပါတယ်:

```json
[ "ConTent-Length", "123456",
  "content-LENGTH", "123",
  "content-type", "text/plain",
  "CONNECTION", "keep-alive",
  "Host", "example.com",
  "accepT", "*/*" ]
```

## Class: `http.Agent`

`Agent` တစ်ခုက HTTP clients တွေအတွက် connection တွေရဲ့ persistence (ဆက်လက် ထားရှိခြင်း) နဲ့ reuse (ပြန်လည် အသုံးပြုခြင်း) ကို စီမံခန့်ခွဲရန် တာဝန်ရှိပါတယ်။ ၎င်းက host နဲ့ port တစ်ခုအတွက် pending requests တွေရဲ့ queue တစ်ခုကို ထိန်းသိမ်းပြီး — queue ဗလာ မဖြစ်မချင်း — socket connection တစ်ခုတည်းကို request တစ်ခုချင်းစီအတွက် ပြန်လည် အသုံးပြုပါတယ်။ Queue ဗလာ ဖြစ်သွားတဲ့အခါမှာတော့ socket ကို destroy လုပ်ပစ်တာ သို့မဟုတ် — တူညီတဲ့ host နဲ့ port ဆီကို requests တွေ ထပ်ပို့ဖို့ ပြန်လည် အသုံးပြုနိုင်အောင် — pool ထဲမှာ သိမ်းထားတာ ဖြစ်ပါတယ်။ Destroy လုပ်မလား pool ထဲ ထည့်မလားဆိုတာက `keepAlive` [option](#new-agentoptions) ပေါ်မှာ မူတည်ပါတယ်။

Pool ထဲမှာ ရှိတဲ့ connections တွေအတွက် TCP Keep-Alive ကို ဖွင့်ပေးထားပေမယ့် — servers တွေက idle ဖြစ်နေတဲ့ connections တွေကို ပိတ်ပစ်နိုင်ပါသေးတယ်။ အဲဒီလို ပိတ်လိုက်ရင် — ၎င်းတို့ကို pool ကနေ ဖယ်ရှားပြီး — အဲဒီ host နဲ့ port အတွက် HTTP request အသစ်တစ်ခု ပြုလုပ်တဲ့အခါ connection အသစ်တစ်ခု ပြုလုပ်ပါလိမ့်မယ်။ Servers တွေက connection တစ်ခုတည်းပေါ်မှာ requests အများအပြား ပြုလုပ်တာကို ငြင်းပယ်တာမျိုးလည်း ရှိနိုင်ပြီး — အဲဒီလိုဆိုရင် connection ကို request တိုင်းအတွက် အသစ် ပြန်ပြုလုပ်ရမှာ ဖြစ်ကာ pool လုပ်လို့ မရတော့ပါဘူး။ `Agent` က အဲဒီ server ဆီကို requests တွေ ဆက်လက် ပြုလုပ်ပေးဦးမှာ ဖြစ်ပေမယ့် — request တစ်ခုချင်းစီက connection အသစ်တစ်ခုပေါ်မှာ ဖြစ်ပွားမှာ ဖြစ်ပါတယ်။

### Response အစီအစဉ်နှင့် connection ပြန်လည် အသုံးပြုခြင်း (Response ordering with connection reuse)

ပြန်လည် အသုံးပြုထားတဲ့ HTTP/1.1 keep-alive connection တစ်ခုပေါ်မှာ — responses တွေက အဲဒီ connection ပေါ်က ၎င်းတို့ရဲ့ အစီအစဉ် (order) နဲ့အညီ requests တွေနဲ့ ဆက်စပ်ပါတယ်။ HTTP/1.1 keep-alive က အဲဒီအစီအစဉ်ထက် ပိုပြီး request တစ်ခုချင်းစီအတွက် response attribution (တာဝန်ခံမှု သတ်မှတ်ခြင်း) ကို မပံ့ပိုးပေးပါဘူး။ Request တစ်ခုချင်းစီအတွက် connection သီးခြား ခွဲထားဖို့ လိုအပ်တဲ့ applications တွေက — `Agent` တစ်ခုကို သီးခြား သုံးနိုင်သလို — keep-alive ကို ပိတ်နိုင်ပြီး — သို့မဟုတ် `agent: false` ကို ဖြတ်သန်းပေးနိုင်ပါတယ်။

Connection တစ်ခုကို client သို့မဟုတ် server က ပိတ်လိုက်တဲ့အခါ — ၎င်းကို pool ကနေ ဖယ်ရှားပါတယ်။ Pool ထဲက အသုံးမပြုရသေးတဲ့ sockets တွေ အားလုံးကို — outstanding requests တွေ မရှိတော့တဲ့အခါ Node.js process ကို ဆက်လက် run မနေစေဖို့ — unref လုပ်ထားပါတယ် ([`socket.unref()`][] ကို ကြည့်ပါ)။

အသုံးမပြုတော့တဲ့အခါ `Agent` instance တစ်ခုကို [`destroy()`][] လုပ်တာက ကောင်းမွန်တဲ့ အလေ့အကျင့်တစ်ခုပါ — အကြောင်းကတော့ အသုံးမပြုတဲ့ sockets တွေက OS resources တွေကို စားသုံးနေလို့ပါ။

Socket တစ်ခုက `'close'` event သို့မဟုတ် `'agentRemove'` event တစ်ခုခုကို emit လုပ်တဲ့အခါ — အဲဒီ socket ကို agent ကနေ ဖယ်ရှားပါတယ်။ HTTP request တစ်ခုကို agent ထဲမှာ မထားပဲ အချိန်ကြာကြာ ဖွင့်ထားချင်တယ်ဆိုရင် — အောက်ပါအတိုင်းမျိုး လုပ်နိုင်ပါတယ်:

```js
http.get(options, (res) => {
  // Do stuff
}).on('socket', (socket) => {
  socket.emit('agentRemove');
});
```

Agent တစ်ခုကို request တစ်ခုချင်းစီအတွက်လည်း သုံးနိုင်ပါတယ်။ `http.get()` သို့မဟုတ် `http.request()` functions တွေဆီကို `{agent: false}` ကို option အနေနဲ့ ပေးလိုက်ရင် — default options တွေနဲ့အတူ တစ်ကြိမ်သုံး (one-time use) `Agent` တစ်ခုကို client connection အတွက် သုံးပါလိမ့်မယ်။

`agent:false`:

```js
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false,  // Create a new agent just for this one request
}, (res) => {
  // Do stuff with response
});
```

Request တစ်ခုအတွက် connection reuse (connection ပြန်လည် အသုံးပြုခြင်း) ကို ရှောင်ရှားဖို့ `agent: false` ကို သုံးပါ။

### `new Agent([options])`

* `options` {Object} Agent ပေါ်မှာ သတ်မှတ်နိုင်တဲ့ configurable options တွေရဲ့ အစုပါ။ အောက်ပါ fields တွေ ပါဝင်နိုင်ပါတယ်:
  * `keepAlive` {boolean} Outstanding requests တွေ မရှိတော့တဲ့အခါမှာတောင် — TCP connection တစ်ခု ပြန်လည် ထူထောင်စရာ မလိုပဲ နောက်ပိုင်း requests တွေအတွက် သုံးနိုင်အောင် — sockets တွေကို ဆက်လက် ထားရှိပါတယ်။ `Connection` header ရဲ့ `keep-alive` တန်ဖိုးနဲ့ ရောထွေးမှု မဖြစ်စေဖို့ သတိပြုပါ။ Agent တစ်ခုကို သုံးတဲ့အခါ — `Connection` header ကို ရှင်းရှင်းလင်းလင်း သတ်မှတ်ပေးထားတဲ့အခါ သို့မဟုတ် `keepAlive` နဲ့ `maxSockets` options တွေကို အသီးသီး `false` နဲ့ `Infinity` အဖြစ် သတ်မှတ်ထားတဲ့အခါ (အဲဒီအခါမျိုးမှာ `Connection: close` ကို သုံးပါလိမ့်မယ်) ကလွဲလို့ — `Connection: keep-alive` header ကို အမြဲတမ်း ပို့ပေးပါတယ်။ **Default:** `false`.
  * `keepAliveMsecs` {number} `keepAlive` option ကို သုံးနေတဲ့အခါ — TCP Keep-Alive packets တွေအတွက် [initial delay][] (ကနဦး နှောင့်နှေးချိန်) ကို သတ်မှတ်ပေးပါတယ်။ `keepAlive` option က `false` သို့မဟုတ် `undefined` ဖြစ်နေရင်တော့ လျစ်လျူရှုခံရပါတယ်။ **Default:** `1000`.
  * `agentKeepAliveTimeoutBuffer` {number} Socket ရဲ့ expiration time (သက်တမ်း ကုန်ဆုံးချိန်) ကို ဆုံးဖြတ်တဲ့အခါ — server က ပေးထားတဲ့ `keep-alive: timeout=...` hint ကနေ နုတ်ယူရမယ့် milliseconds အရေအတွက်ပါ။ ဒီ buffer က — agent က server ထက် အနည်းငယ် စောပြီး socket ကို ပိတ်နိုင်အောင် ကူညီပေးပြီး — server က မကြာခင် ပိတ်တော့မယ့် socket တစ်ခုပေါ်မှာ request တစ်ခု ပို့လိုက်မိနိုင်ခြေကို လျှော့ချပေးပါတယ်။ **Default:** `1000`.
  * `maxSockets` {number} Host တစ်ခုအတွက် ခွင့်ပြုထားတဲ့ sockets အများဆုံး အရေအတွက်ပါ။ Host တစ်ခုတည်းက concurrent connections အများအပြားကို ဖွင့်နေတယ်ဆိုရင် — `maxSockets` တန်ဖိုးကို မရောက်ရှိမချင်း — request တစ်ခုချင်းစီက socket အသစ်တစ်ခုကို သုံးပါလိမ့်မယ်။ Host က `maxSockets` ထက် ပိုတဲ့ connections တွေကို ဖွင့်ဖို့ ကြိုးစားရင် — ထပ်ဆောင်း requests တွေက pending request queue ထဲကို ဝင်ရောက်ပြီး — ရှိပြီးသား connection တစ်ခု ကုန်ဆုံးသွားတဲ့အခါ active connection state ထဲကို ဝင်ရောက်ပါလိမ့်မယ်။ ဒါက ပေးထားတဲ့ host တစ်ခုကနေ — ဘယ်အချိန်မဆို — `maxSockets` ပမာဏထက် မပိုတဲ့ active connections တွေသာ ရှိနေစေဖို့ သေချာစေပါတယ်။ **Default:** `Infinity`.
  * `maxTotalSockets` {number} Host တွေ အားလုံးအတွက် စုစုပေါင်း ခွင့်ပြုထားတဲ့ sockets အများဆုံး အရေအတွက်ပါ။ အများဆုံး ပမာဏကို မရောက်ရှိမချင်း — request တစ်ခုချင်းစီက socket အသစ်တစ်ခုကို သုံးပါလိမ့်မယ်။ **Default:** `Infinity`.
  * `maxFreeSockets` {number} Host တစ်ခုအတွက် free state (လွတ်နေတဲ့ အခြေအနေ) နဲ့ ဖွင့်ထားခဲ့ရမယ့် sockets အများဆုံး အရေအတွက်ပါ။ `keepAlive` ကို `true` အဖြစ် သတ်မှတ်ထားမှသာ သက်ဆိုင်ပါတယ်။ **Default:** `256`.
  * `scheduling` {string} နောက်ထပ် သုံးစွဲဖို့ free socket တစ်ခုကို ရွေးချယ်တဲ့အခါ ကျင့်သုံးရမယ့် scheduling strategy ပါ။ ၎င်းက `'fifo'` သို့မဟုတ် `'lifo'` ဖြစ်နိုင်ပါတယ်။ Scheduling strategies နှစ်ခုကြားက အဓိက ကွာခြားချက်ကတော့ — `'lifo'` က မကြာသေးခင်က အသုံးပြုခဲ့တဲ့ socket ကို ရွေးချယ်ပြီး — `'fifo'` က အသုံးပြုပြီး သက်တမ်း အရင့်ဆုံး socket ကို ရွေးချယ်ပါတယ်။ တစ်စက္ကန့် requests အရေအတွက် နည်းနေတဲ့ အခြေအနေမှာ — `'lifo'` scheduling က — inactivity (လှုပ်ရှားမှု မရှိခြင်း) ကြောင့် server က ပိတ်ပစ်ထားနိုင်တဲ့ socket တစ်ခုကို ရွေးမိနိုင်ခြေကို လျှော့ချပေးပါတယ်။ တစ်စက္ကန့် requests အရေအတွက် များနေတဲ့ အခြေအနေမှာတော့ — `'fifo'` scheduling က ဖွင့်ထားတဲ့ sockets အရေအတွက်ကို အများဆုံး ဖြစ်အောင် လုပ်ပေးပြီး — `'lifo'` scheduling ကတော့ အနိမ့်ဆုံး ဖြစ်အောင် ထိန်းထားပါတယ်။ **Default:** `'lifo'`.
  * `timeout` {number} Socket timeout ကို milliseconds နဲ့ သတ်မှတ်ပါတယ်။ Socket ကို ဖန်တီးတဲ့အခါ ဒီ timeout ကို သတ်မှတ်ပေးပါလိမ့်မယ်။
  * `proxyEnv` {Object|undefined} Proxy configuration အတွက် environment variables တွေပါ။ အသေးစိတ်ကို [Built-in Proxy Support][] မှာ ကြည့်ပါ။ **Default:** `undefined`
    * `HTTP_PROXY` {string|undefined} HTTP requests တွေ သုံးသင့်တဲ့ proxy server ရဲ့ URL ပါ။ `undefined` ဖြစ်နေရင် — HTTP requests တွေအတွက် proxy ကို အသုံးမပြုပါဘူး။
    * `HTTPS_PROXY` {string|undefined} HTTPS requests တွေ သုံးသင့်တဲ့ proxy server ရဲ့ URL ပါ။ `undefined` ဖြစ်နေရင် — HTTPS requests တွေအတွက် proxy ကို အသုံးမပြုပါဘူး။
    * `NO_PROXY` {string|undefined} Proxy ကနေတစ်ဆင့် route မလုပ်သင့်တဲ့ endpoints တွေကို သတ်မှတ်ပေးတဲ့ patterns တွေပါ။
    * `http_proxy` {string|undefined} `HTTP_PROXY` နဲ့ အတူတူပါ။ နှစ်ခုလုံး သတ်မှတ်ထားရင် — `http_proxy` က ဦးစားပေး ရရှိပါတယ်။
    * `https_proxy` {string|undefined} `HTTPS_PROXY` နဲ့ အတူတူပါ။ နှစ်ခုလုံး သတ်မှတ်ထားရင် — `https_proxy` က ဦးစားပေး ရရှိပါတယ်။
    * `no_proxy` {string|undefined} `NO_PROXY` နဲ့ အတူတူပါ။ နှစ်ခုလုံး သတ်မှတ်ထားရင် — `no_proxy` က ဦးစားပေး ရရှိပါတယ်။
  * `defaultPort` {number} Requests တွေထဲမှာ port ကို သတ်မှတ်မထားတဲ့အခါ သုံးမယ့် default port ပါ။ **Default:** `80`.
  * `protocol` {string} Agent အတွက် သုံးမယ့် protocol ပါ။ **Default:** `'http:'`.

[`socket.connect()`][] ထဲက `options` တွေကိုလည်း support လုပ်ပါတယ်။

ဒီ options တွေထဲက တစ်ခုခုကို configure လုပ်ဖို့ — custom [`http.Agent`][] instance တစ်ခုကို ဖန်တီးရပါမယ်။

```mjs
import { Agent, request } from 'node:http';
const keepAliveAgent = new Agent({ keepAlive: true });
options.agent = keepAliveAgent;
request(options, onResponseCallback);
```

```cjs
const http = require('node:http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```

### `agent.createConnection(options[, callback])`

* `options` {Object} Connection အသေးစိတ်တွေ ပါဝင်တဲ့ options တွေပါ။ Options တွေရဲ့ ပုံစံ (format) အတွက် [`net.createConnection()`][] ကို ကြည့်ပါ။ Custom agents တွေအတွက်တော့ — ဒီ object ကို custom `createConnection` function ဆီကို ဖြတ်သန်းပေးပါတယ်။
* `callback` {Function} (Optional — အဓိကအားဖြင့် custom agents တွေအတွက်) Socket ကို ဖန်တီးလိုက်တဲ့အခါ — အထူးသဖြင့် asynchronous operations တွေအတွက် — custom `createConnection` implementation တစ်ခုက ခေါ်ယူမယ့် function တစ်ခုပါ။
  * `err` {Error | null} Socket ဖန်တီးမှု မအောင်မြင်ခဲ့ရင် error object တစ်ခုပါ။
  * `socket` {stream.Duplex} ဖန်တီးလိုက်တဲ့ socket ပါ။
* Returns: {stream.Duplex} ဖန်တီးလိုက်တဲ့ socket ပါ။ ၎င်းကို default implementation သို့မဟုတ် custom synchronous `createConnection` implementation တစ်ခုက ပြန်ပေးပါတယ်။ Custom `createConnection` တစ်ခုက asynchronous operation အတွက် `callback` ကို သုံးနေတယ်ဆိုရင် — ဒီ return တန်ဖိုးက socket ကို ရယူဖို့ အဓိက နည်းလမ်း မဟုတ်နိုင်ပါဘူး။

HTTP requests တွေအတွက် သုံးမယ့် socket/stream တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။

Default အနေနဲ့ — ဒီ function က [`net.createConnection()`][] နဲ့ ထပ်တူ အပြုအမူ ရှိပြီး — ဖန်တီးလိုက်တဲ့ socket ကို synchronously ပြန်ပေးပါတယ်။ Signature ထဲက optional ဖြစ်တဲ့ `callback` parameter ကိုတော့ ဒီ default implementation က အသုံးမပြုပါဘူး။

ဒါပေမယ့် — custom agents တွေက ပိုမို ပြောင်းလွယ်ပြင်လွယ် ဖြစ်စေဖို့ — ဥပမာ sockets တွေကို asynchronously ဖန်တီးဖို့ — ဒီ method ကို override လုပ်နိုင်ပါတယ်။ `createConnection` ကို override လုပ်တဲ့အခါ:

1. **Synchronous socket creation**: Override လုပ်ထားတဲ့ method က socket/stream ကို တိုက်ရိုက် ပြန်ပေးနိုင်ပါတယ်။
2. **Asynchronous socket creation**: Override လုပ်ထားတဲ့ method က `callback` ကို လက်ခံပြီး — ဖန်တီးလိုက်တဲ့ socket/stream ကို ၎င်းဆီကို ဖြတ်သန်းပေးနိုင်ပါတယ် (ဥပမာ — `callback(null, newSocket)`)။ Socket ဖန်တီးစဉ်မှာ error တစ်ခု ဖြစ်ပွားခဲ့ရင် — ၎င်းကို `callback` ရဲ့ ပထမဆုံး argument အဖြစ် ဖြတ်သန်းပေးရပါမယ် (ဥပမာ — `callback(err)`)။

Agent က ပေးအပ်ထားတဲ့ `createConnection` function ကို `options` နဲ့ ဒီ internal `callback` တို့နဲ့အတူ ခေါ်ပါလိမ့်မယ်။ Agent က ပေးတဲ့ `callback` က `(err, stream)` ဆိုတဲ့ signature ရှိပါတယ်။

### `agent.keepSocketAlive(socket)`

* `socket` {stream.Duplex}

`socket` ကို request တစ်ခုကနေ ခွဲထုတ်လိုက်ပြီး — `Agent` က ၎င်းကို ဆက်လက် သိမ်းဆည်းထားနိုင်တဲ့အခါ ခေါ်ယူပါတယ်။ Default အပြုအမူကတော့ အောက်ပါအတိုင်း ဖြစ်ပါတယ်:

```js
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```

ဒီ method ကို သီးခြား `Agent` subclass တစ်ခုက override လုပ်နိုင်ပါတယ်။ ဒီ method က falsy တန်ဖိုးတစ်ခုကို ပြန်ပေးခဲ့ရင် — နောက် request တစ်ခုအတွက် သိမ်းဆည်းထားမယ့်အစား — socket ကို destroy လုပ်ပစ်ပါလိမ့်မယ်။

`socket` argument က {stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ {net.Socket} ရဲ့ instance တစ်ခု ဖြစ်နိုင်ပါတယ်။

### `agent.reuseSocket(socket, request)`

* `socket` {stream.Duplex}
* `request` {http.ClientRequest}

Keep-alive options တွေကြောင့် သိမ်းဆည်းထားခဲ့တဲ့ `socket` ကို `request` တစ်ခုနဲ့ တွဲချိတ်လိုက်တဲ့အခါ ခေါ်ယူပါတယ်။ Default အပြုအမူကတော့:

```js
socket.ref();
```

ဒီ method ကို သီးခြား `Agent` subclass တစ်ခုက override လုပ်နိုင်ပါတယ်။

`socket` argument က {stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ {net.Socket} ရဲ့ instance တစ်ခု ဖြစ်နိုင်ပါတယ်။

### `agent.destroy()`

Agent က လက်ရှိ အသုံးပြုနေတဲ့ sockets တွေ အားလုံးကို destroy လုပ်ပါတယ်။

ဒီလို လုပ်ဖို့က ပုံမှန်အားဖြင့် မလိုအပ်ပါဘူး။ ဒါပေမယ့် — `keepAlive` ဖွင့်ထားတဲ့ agent တစ်ခုကို သုံးနေတယ်ဆိုရင် — မလိုအပ်တော့တဲ့အခါ agent ကို ရှင်းရှင်းလင်းလင်း shut down လုပ်ထားတာ အကောင်းဆုံးပါ။ မဟုတ်ရင် — server က သူတို့ကို terminate မလုပ်မချင်း — sockets တွေက အချိန်အတော်ကြာ ဖွင့်ထားဆဲ ဖြစ်နေနိုင်ပါတယ်။

### `agent.freeSockets`

* Type: {Object}

`keepAlive` ဖွင့်ထားတဲ့အခါ — agent က အသုံးပြုဖို့ စောင့်ဆိုင်းနေတဲ့ sockets တွေရဲ့ arrays တွေ ပါဝင်တဲ့ object တစ်ခုပါ။ ပြုပြင် မွမ်းမံခြင်း မပြုလုပ်ပါနဲ့။

`freeSockets` list ထဲက sockets တွေကို `'timeout'` ဖြစ်ပေါ်တဲ့အခါ — အလိုအလျောက် destroy လုပ်ပြီး array ကနေ ဖယ်ရှားပါလိမ့်မယ်။

### `agent.getName([options])`

* `options` {Object} Name ထုတ်လုပ်ခြင်းအတွက် အချက်အလက်တွေ ပေးစွမ်းတဲ့ options တွေရဲ့ အစုပါ
  * `host` {string} Request ပို့မယ့် server ရဲ့ domain name သို့မဟုတ် IP address ပါ
  * `port` {number} Remote server ရဲ့ port ပါ
  * `localAddress` {string} Request ပို့တဲ့အခါ network connections တွေအတွက် bind လုပ်ရမယ့် local interface ပါ
  * `family` {integer} `undefined` နဲ့ မညီဘူးဆိုရင် — 4 သို့မဟုတ် 6 ဖြစ်ရပါမယ်။
* Returns: {string}

Connection တစ်ခုကို ပြန်လည် အသုံးပြုနိုင်လားဆိုတာ ဆုံးဖြတ်ဖို့ — request options တွေရဲ့ အစုတစ်ခုအတွက် ထူးခြားတဲ့ (unique) name တစ်ခုကို ရယူပါတယ်။ HTTP agent တစ်ခုအတွက်ဆိုရင် — ၎င်းက `host:port:localAddress` သို့မဟုတ် `host:port:localAddress:family` ကို ပြန်ပေးပါတယ်။ HTTPS agent တစ်ခုအတွက်တော့ — name ထဲမှာ socket reusability ကို ဆုံးဖြတ်ပေးတဲ့ CA, cert, ciphers နဲ့ တခြား HTTPS/TLS-specific options တွေပါ ပါဝင်ပါတယ်။

### `agent.maxFreeSockets`

* Type: {number}

Default အနေနဲ့ 256 လို့ သတ်မှတ်ထားပါတယ်။ `keepAlive` ဖွင့်ထားတဲ့ agents တွေအတွက် — ဒါက free state နဲ့ ဖွင့်ထားခဲ့မယ့် sockets အများဆုံး အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။

### `agent.maxSockets`

* Type: {number}

Default အနေနဲ့ `Infinity` လို့ သတ်မှတ်ထားပါတယ်။ Agent တစ်ခုက origin တစ်ခုစီအတွက် concurrent sockets ဘယ်နှစ်ခုအထိ ဖွင့်ထားနိုင်လဲဆိုတာကို ဆုံးဖြတ်ပေးပါတယ်။ Origin ဆိုတာ [`agent.getName()`][] က ပြန်ပေးတဲ့ တန်ဖိုးပါ။

### `agent.maxTotalSockets`

* Type: {number}

Default အနေနဲ့ `Infinity` လို့ သတ်မှတ်ထားပါတယ်။ Agent တစ်ခုက concurrent sockets ဘယ်နှစ်ခုအထိ ဖွင့်ထားနိုင်လဲဆိုတာကို ဆုံးဖြတ်ပေးပါတယ်။ `maxSockets` နဲ့ မတူပဲ — ဒီ parameter က origins အားလုံးကို ခြုံငုံ အကျုံးဝင်ပါတယ်။

### `agent.requests`

* Type: {Object}

Sockets တွေဆီကို မသတ်မှတ်ရသေးတဲ့ requests တွေရဲ့ queues တွေ ပါဝင်တဲ့ object တစ်ခုပါ။ ပြုပြင် မွမ်းမံခြင်း မပြုလုပ်ပါနဲ့။

### `agent.sockets`

* Type: {Object}

Agent က လက်ရှိ အသုံးပြုနေတဲ့ sockets တွေရဲ့ arrays တွေ ပါဝင်တဲ့ object တစ်ခုပါ။ ပြုပြင် မွမ်းမံခြင်း မပြုလုပ်ပါနဲ့။

## Class: `http.ClientRequest`

* Extends: {http.OutgoingMessage}

ဒီ object ကို အတွင်းပိုင်းမှာ ဖန်တီးပြီး — [`http.request()`][] ကနေ ပြန်ပေးပါတယ်။ ၎င်းက — header ကို queue လုပ်ပြီးသား ဖြစ်တဲ့ — _in-progress_ (လုပ်ဆောင်ဆဲ) request တစ်ခုကို ကိုယ်စားပြုပါတယ်။ Header ကို [`setHeader(name, value)`][], [`getHeader(name)`][], [`removeHeader(name)`][] APIs တွေကို သုံးပြီး ပြုပြင် ပြောင်းလဲနိုင်ပါသေးတယ်။ တကယ့် header ကို — ပထမဆုံး data chunk နဲ့အတူ သို့မဟုတ် [`request.end()`][] ကို ခေါ်တဲ့အခါ — ပို့ပေးပါလိမ့်မယ်။

Response ကို ရယူဖို့ — request object ပေါ်မှာ [`'response'`][] အတွက် listener တစ်ခု ထည့်သွင်းပါ။ Response headers တွေ လက်ခံရရှိပြီးတဲ့အခါ — [`'response'`][] ကို request object ကနေ emit လုပ်ပါလိမ့်မယ်။ [`'response'`][] event ကို — [`http.IncomingMessage`][] ရဲ့ instance တစ်ခု ဖြစ်တဲ့ — argument တစ်ခုနဲ့အတူ execute လုပ်ပါတယ်။

[`'response'`][] event အတွင်းမှာ — response object ပေါ်ကို listeners တွေ ထည့်သွင်းနိုင်ပါတယ်။ အထူးသဖြင့် `'data'` event ကို နားထောင်ဖို့ပါ။

[`'response'`][] handler တစ်ခုမှ မထည့်ထားဘူးဆိုရင် — response ကို လုံးဝ စွန့်ပစ်လိုက်ပါလိမ့်မယ်။ ဒါပေမယ့် — [`'response'`][] event handler တစ်ခု ထည့်ထားမယ်ဆိုရင် — response object ကနေ လာတဲ့ data တွေကို — `'readable'` event ရှိတိုင်း `response.read()` ကို ခေါ်ခြင်း၊ `'data'` handler တစ်ခု ထည့်သွင်းခြင်း သို့မဟုတ် `.resume()` method ကို ခေါ်ခြင်း — ဒီနည်းတွေထဲက တစ်ခုခုနဲ့ **စားသုံး (consume)** ရပါမယ်။ Data တွေကို စားသုံးပြီးမှသာ `'end'` event က fire ဖြစ်ပါလိမ့်မယ်။ ထို့အပြင် — data တွေကို မဖတ်ရသေးသရွေ့ — ၎င်းတို့က memory ကို စားသုံးနေပြီး — နောက်ဆုံးမှာ 'process out of memory' error တစ်ခုဆီကို ဦးတည်သွားနိုင်ပါတယ်။

Backward compatibility (နောက်ပြန် လိုက်ဖက်ညီမှု) အတွက် — `'error'` listener တစ်ခု မှတ်ပုံတင်ထားမှသာ `res` က `'error'` ကို emit လုပ်ပါလိမ့်မယ်။

Response body ရဲ့ အရွယ်အစားကို ကန့်သတ်ဖို့ `Content-Length` header ကို သတ်မှတ်ပါ။ [`response.strictContentLength`][] ကို `true` အဖြစ် သတ်မှတ်ထားရင် — `Content-Length` header ရဲ့ တန်ဖိုးနဲ့ မကိုက်ညီမှုက — `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`][] နဲ့ ခွဲခြားသတ်မှတ်ထားတဲ့ `Error` တစ်ခုကို throw လုပ်စေပါလိမ့်မယ်။

`Content-Length` တန်ဖိုးက characters တွေ မဟုတ်ပဲ bytes တွေနဲ့ ဖြစ်သင့်ပါတယ်။ Body ရဲ့ အလျားကို bytes နဲ့ ဆုံးဖြတ်ဖို့ [`Buffer.byteLength()`][] ကို သုံးပါ။

### Event: `'abort'`

> Stability: 0 - Deprecated. Listen for the `'close'` event instead.

Request ကို client ဘက်က abort လုပ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event ကို `abort()` ဆီကို ပထမဆုံး ခေါ်တဲ့အခါမှာသာ emit လုပ်ပါတယ်။

### Event: `'close'`

Request က ပြီးဆုံးသွားကြောင်း သို့မဟုတ် ၎င်းရဲ့ underlying connection ကို — (response မပြီးဆုံးခင်) — အချိန်မတန်ပဲ ရပ်တန့်သွားကြောင်း ဖော်ပြပါတယ်။

### Event: `'connect'`

* `response` {http.IncomingMessage}
* `socket` {stream.Duplex}
* `head` {Buffer}

Server တစ်ခုက `CONNECT` method နဲ့ request တစ်ခုကို တုံ့ပြန်တိုင်း emit လုပ်ပါတယ်။ ဒီ event ကို နားထောင်မထားဘူးဆိုရင် — `CONNECT` method တစ်ခုကို လက်ခံရရှိတဲ့ clients တွေရဲ့ connections တွေကို ပိတ်ပစ်ပါလိမ့်မယ်။

User က {net.Socket} မဟုတ်တဲ့ socket type တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — ဒီ event ကို {stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ {net.Socket} class ရဲ့ instance တစ်ခုနဲ့အတူ ဖြတ်သန်းပေးတာ အာမခံပါတယ်။

`'connect'` event ကို ဘယ်လို နားထောင်ရမလဲဆိုတာ ပြသထားတဲ့ client နဲ့ server pair တစ်ခုပါ:

```mjs
import { createServer, request } from 'node:http';
import { connect } from 'node:net';
import { URL } from 'node:url';

// Create an HTTP tunneling proxy
const proxy = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

```cjs
const http = require('node:http');
const net = require('node:net');
const { URL } = require('node:url');

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80',
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

### Event: `'continue'`

Server က '100 Continue' HTTP response တစ်ခုကို ပို့တဲ့အခါ emit လုပ်ပါတယ် — ပုံမှန်အားဖြင့် request ထဲမှာ 'Expect: 100-continue' ပါဝင်နေလို့ပါ။ ဒါက client က request body ကို ပို့သင့်တယ်ဆိုတဲ့ ညွှန်ကြားချက်တစ်ခုပါ။

### Event: `'finish'`

Request ကို ပို့ပြီးသွားတဲ့အခါ emit လုပ်ပါတယ်။ ပိုတိတိကျကျ ပြောရရင် — request headers နဲ့ body ရဲ့ နောက်ဆုံး အပိုင်းကို network ပေါ်မှာ ပို့ဆောင်ဖို့ operating system ဆီကို လွှဲပြောင်းပေးလိုက်တဲ့အခါ — ဒီ event ကို emit လုပ်ပါတယ်။ ဒါက server က တစ်စုံတစ်ရာ လက်ခံရရှိပြီးပြီလို့ မဆိုလိုပါဘူး။

### Event: `'information'`

* `info` {Object}
  * `httpVersion` {string}
  * `httpVersionMajor` {integer}
  * `httpVersionMinor` {integer}
  * `statusCode` {integer}
  * `statusMessage` {string}
  * `headers` {Object}
  * `rawHeaders` {string\[]}

Server က 1xx intermediate response တစ်ခုကို ပို့တဲ့အခါ emit လုပ်ပါတယ် (101 Upgrade ကလွဲလို့)။ ဒီ event ရဲ့ listeners တွေက — HTTP version, status code, status message, key-value headers object နဲ့ — raw header names တွေနဲ့ ၎င်းတို့ရဲ့ သက်ဆိုင်ရာ တန်ဖိုးတွေ ပါဝင်တဲ့ array တစ်ခု — ပါဝင်တဲ့ object တစ်ခုကို လက်ခံရရှိပါလိမ့်မယ်။

```mjs
import { request } from 'node:http';

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```

```cjs
const http = require('node:http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request',
};

// Make a request
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`Got information prior to main response: ${info.statusCode}`);
});
```

101 Upgrade statuses တွေက — web sockets, in-place TLS upgrades (နေရာတွင် TLS အဆင့်မြှင့်တင်ခြင်း) သို့မဟုတ် HTTP 2.0 စတဲ့ — ပုံမှန် HTTP request/response chain ကနေ ခွဲထွက်သွားတာမို့ — ဒီ event ကို fire မလုပ်ပါဘူး။ 101 Upgrade အကြောင်းတွေကို အသိပေးခံချင်ရင်တော့ [`'upgrade'`][] event ကို နားထောင်ပါ။

### Event: `'response'`

* `response` {http.IncomingMessage}

ဒီ request ဆီကို response တစ်ခု လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။ ဒီ event ကို တစ်ကြိမ်တည်းသာ emit လုပ်ပါတယ်။

### Event: `'socket'`

* `socket` {stream.Duplex}

User က {net.Socket} မဟုတ်တဲ့ socket type တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — ဒီ event ကို {stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ {net.Socket} class ရဲ့ instance တစ်ခုနဲ့အတူ ဖြတ်သန်းပေးတာ အာမခံပါတယ်။

### Event: `'timeout'`

Underlying socket က inactivity (လှုပ်ရှားမှု မရှိခြင်း) ကြောင့် timeout ဖြစ်သွားတဲ့အခါ emit လုပ်ပါတယ်။ ဒါက socket က idle (အလုပ်မလုပ်ပဲ နေခြင်း) ဖြစ်နေကြောင်းကိုသာ အသိပေးပါတယ်။ Request ကို ကိုယ်တိုင် (manually) destroy လုပ်ရပါမယ်။

ဒါ့အပြင်: [`request.setTimeout()`][] ကိုလည်း ကြည့်ပါ။

### Event: `'upgrade'`

* `response` {http.IncomingMessage}
* `stream` {stream.Duplex}
* `head` {Buffer}

Server တစ်ခုက upgrade တစ်ခုနဲ့ request တစ်ခုကို တုံ့ပြန်တိုင်း emit လုပ်ပါတယ်။ ဒီ event ကို နားထောင်မထားဘူး — ပြီးတော့ response status code က 101 Switching Protocols ဖြစ်နေမယ်ဆိုရင် — upgrade header တစ်ခုကို လက်ခံရရှိတဲ့ clients တွေရဲ့ connections တွေကို ပိတ်ပစ်ပါလိမ့်မယ်။

User က {net.Socket} မဟုတ်တဲ့ socket type တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — ဒီ event ကို {stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ {net.Socket} class ရဲ့ instance တစ်ခုနဲ့အတူ ဖြတ်သန်းပေးတာ အာမခံပါတယ်။

`'upgrade'` event ကို ဘယ်လို နားထောင်ရမလဲဆိုတာ ပြသထားတဲ့ client server pair တစ်ခုပါ။

```mjs
import http from 'node:http';
import process from 'node:process';

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, stream, head) => {
  stream.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  stream.pipe(stream); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, stream, upgradeHead) => {
    console.log('got upgraded!');
    stream.end();
    process.exit(0);
  });
});
```

```cjs
const http = require('node:http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
server.on('upgrade', (req, stream, head) => {
  stream.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  stream.pipe(stream); // echo back
});

// Now that server is running
server.listen(1337, '127.0.0.1', () => {

  // make a request
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
    },
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, stream, upgradeHead) => {
    console.log('got upgraded!');
    stream.end();
    process.exit(0);
  });
});
```

### `request.abort()`

> Stability: 0 - Deprecated: Use [`request.destroy()`][] instead.

Request ကို abort လုပ်နေတဲ့အဖြစ် အမှတ်အသား ပြုလုပ်ပါတယ်။ ဒါကို ခေါ်လိုက်ရင် — response ထဲမှာ ကျန်ရှိနေတဲ့ data တွေကို ပစ်ချပြီး socket ကို destroy လုပ်ပါလိမ့်မယ်။

### `request.aborted`

> Stability: 0 - Deprecated. Check [`request.destroyed`][] instead.

* Type: {boolean}

Request ကို abort လုပ်ထားရင် `request.aborted` property က `true` ဖြစ်ပါလိမ့်မယ်။

### `request.connection`

> Stability: 0 - Deprecated. Use [`request.socket`][].

* Type: {stream.Duplex}

[`request.socket`][] ကို ကြည့်ပါ။

### `request.cork()`

[`writable.cork()`][] ကို ကြည့်ပါ။

### `request.end([data[, encoding]][, callback])`

* `data` {string|Buffer|Uint8Array}
* `encoding` {string}
* `callback` {Function}
* Returns: {this}

Request ပို့ခြင်းကို အပြီးသတ်ပါတယ်။ Body ရဲ့ မပို့ရသေးတဲ့ အပိုင်းတွေ ရှိနေရင် — ၎င်းတို့ကို stream ဆီကို flush လုပ်ပါလိမ့်မယ်။ Request က chunked ဖြစ်နေရင် — အဆုံးသတ်ပေးတဲ့ `'0\r\n\r\n'` ကို ပို့ပေးပါလိမ့်မယ်။

`data` ကို သတ်မှတ်ပေးထားရင် — ၎င်းက [`request.write(data, encoding)`][] ကို ခေါ်ပြီး `request.end(callback)` နဲ့ နောက်ကလိုက် ခေါ်တာနဲ့ ညီမျှပါတယ်။

`callback` ကို သတ်မှတ်ပေးထားရင် — request stream ပြီးဆုံးသွားတဲ့အခါ ၎င်းကို ခေါ်ပါလိမ့်မယ်။

### `request.destroy([error])`

* `error` {Error} Optional — `'error'` event နဲ့ emit လုပ်ဖို့ error တစ်ခုပါ။
* Returns: {this}

Request ကို destroy လုပ်ပါတယ်။ Optional အနေနဲ့ `'error'` event တစ်ခုကို emit လုပ်ပြီး — `'close'` event တစ်ခုကိုပါ emit လုပ်ပါတယ်။ ဒါကို ခေါ်လိုက်ရင် — response ထဲမှာ ကျန်ရှိနေတဲ့ data တွေကို ပစ်ချပြီး — socket ကို အသုံးပြုနေတယ်ဆိုရင် destroy လုပ်ပါလိမ့်မယ်။ မဟုတ်ရင် — ဖြစ်နိုင်ရင် သက်ဆိုင်ရာ Agent pool ဆီကို ပြန်ပို့ပါလိမ့်မယ်။

နောက်ထပ် အသေးစိတ်တွေအတွက် [`writable.destroy()`][] ကို ကြည့်ပါ။

#### `request.destroyed`

* Type: {boolean}

[`request.destroy()`][] ကို ခေါ်ပြီးနောက်မှာ `true` ဖြစ်ပါတယ်။

နောက်ထပ် အသေးစိတ်တွေအတွက် [`writable.destroyed`][] ကို ကြည့်ပါ။

### `request.finished`

> Stability: 0 - Deprecated. Use [`request.writableEnded`][].

* Type: {boolean}

[`request.end()`][] ကို ခေါ်ခဲ့မယ်ဆိုရင် `request.finished` property က `true` ဖြစ်ပါလိမ့်မယ်။ Request ကို [`http.get()`][] ကနေတစ်ဆင့် စတင်ခဲ့တာဆိုရင် — `request.end()` ကို အလိုအလျောက် ခေါ်ပါလိမ့်မယ်။

### `request.flushHeaders()`

Request headers တွေကို flush လုပ်ပါတယ်။

Efficiency (စွမ်းဆောင်ရည်) အကြောင်းပြချက်တွေကြောင့် — Node.js က `request.end()` ကို မခေါ်ရသေးသရွေ့ သို့မဟုတ် request data ရဲ့ ပထမဆုံး chunk ကို မရေးသားရသေးသရွေ့ — request headers တွေကို ပုံမှန်အားဖြင့် buffer လုပ်ထားပါတယ်။ အဲဒီနောက်မှာ request headers နဲ့ data တွေကို TCP packet တစ်ခုတည်းအဖြစ် ထုပ်ပိုးဖို့ ကြိုးစားပါတယ်။

ဒါက ပုံမှန်အားဖြင့် လိုချင်တဲ့ အပြုအမူပါ (TCP round-trip တစ်ခုကို သက်သာစေပါတယ်) — ဒါပေမယ့် ပထမဆုံး data ကို အများကြီး နောက်ကျမှ ပို့မယ့် အခြေအနေမျိုးမှာတော့ မဟုတ်ပါဘူး။ `request.flushHeaders()` က ဒီ optimization ကို ကျော်လွှားပြီး — request ကို ချက်ချင်း စတင်စေပါတယ်။

### `request.getHeader(name)`

* `name` {string}
* Returns: {any}

Request ပေါ်မှာ ရှိတဲ့ header တစ်ခုကို ဖတ်ထုတ်ပါတယ်။ Name က case-insensitive (စာလုံးအကြီး/အသေး ခွဲခြားမှု မရှိ) ဖြစ်ပါတယ်။ Return တန်ဖိုးရဲ့ type က [`request.setHeader()`][] ဆီကို ပေးခဲ့တဲ့ arguments တွေပေါ်မှာ မူတည်ပါတယ်။

```js
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' is 'text/html'
const contentLength = request.getHeader('Content-Length');
// 'contentLength' is of type number
const cookie = request.getHeader('Cookie');
// 'cookie' is of type string[]
```

### `request.getHeaderNames()`

* Returns: {string\[]}

လက်ရှိ outgoing headers တွေရဲ့ unique names တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ Header names တွေ အားလုံးက lowercase ဖြစ်ပါတယ်။

```js
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getHeaderNames();
// headerNames === ['foo', 'cookie']
```

### `request.getHeaders()`

* Returns: {Object}

လက်ရှိ outgoing headers တွေရဲ့ shallow copy (အပေါ်ယံ မိတ္တူ) တစ်ခုကို ပြန်ပေးပါတယ်။ Shallow copy ကို သုံးထားတာမို့ — header နဲ့ ဆက်စပ်တဲ့ http module methods အမျိုးမျိုးကို ထပ်မံ ခေါ်စရာ မလိုပဲ — array values တွေကို ပြုပြင် ပြောင်းလဲနိုင်ပါတယ်။ ပြန်ပေးတဲ့ object ရဲ့ keys တွေက header names တွေ ဖြစ်ပြီး — values တွေကတော့ သက်ဆိုင်ရာ header values တွေပါ။ Header names တွေ အားလုံးက lowercase ဖြစ်ပါတယ်။

`request.getHeaders()` method က ပြန်ပေးတဲ့ object က JavaScript `Object` ကနေ prototypically (prototype အဆင့်ဆင့်အားဖြင့်) inherit လုပ်ထားခြင်း _မဟုတ်ပါဘူး_။ ဆိုလိုတာက — `obj.toString()`, `obj.hasOwnProperty()` စတဲ့ ပုံမှန် `Object` methods တွေက define လုပ်ထားခြင်း မရှိပဲ — _အလုပ်လုပ်မှာ မဟုတ်ပါဘူး_။

```js
request.setHeader('Foo', 'bar');
request.setHeader('Cookie', ['foo=bar', 'bar=baz']);

const headers = request.getHeaders();
// headers === { foo: 'bar', 'cookie': ['foo=bar', 'bar=baz'] }
```

### `request.getRawHeaderNames()`

* Returns: {string\[]}

လက်ရှိ outgoing raw headers တွေရဲ့ unique names တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ Header names တွေကို ၎င်းတို့ရဲ့ မူရင်း casing (စာလုံးအကြီး/အသေး ပုံစံ) အတိုင်း ပြန်ပေးပါတယ်။

```js
request.setHeader('Foo', 'bar');
request.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = request.getRawHeaderNames();
// headerNames === ['Foo', 'Set-Cookie']
```

### `request.hasHeader(name)`

* `name` {string}
* Returns: {boolean}

`name` နဲ့ ခွဲခြားသတ်မှတ်ထားတဲ့ header က — outgoing headers တွေထဲမှာ လက်ရှိ သတ်မှတ်ထားရင် — `true` ကို ပြန်ပေးပါတယ်။ Header name ကို ကိုက်ညီအောင် စစ်ဆေးတာက case-insensitive ဖြစ်ပါတယ်။

```js
const hasContentType = request.hasHeader('content-type');
```

### `request.maxHeadersCount`

* Type: {number} **Default:** `2000`

Response headers တွေရဲ့ အများဆုံး အရေအတွက်ကို ကန့်သတ်ပါတယ်။ 0 အဖြစ် သတ်မှတ်ထားရင် — ကန့်သတ်ချက် ဘာမှ မရှိပါဘူး။

### `request.path`

* Type: {string} Request ရဲ့ path ပါ။

### `request.method`

* Type: {string} Request ရဲ့ method ပါ။

### `request.host`

* Type: {string} Request ရဲ့ host ပါ။

### `request.protocol`

* Type: {string} Request ရဲ့ protocol ပါ။

### `request.removeHeader(name)`

* `name` {string}

Headers object ထဲမှာ သတ်မှတ်ပြီးသား header တစ်ခုကို ဖယ်ရှားပါတယ်။

```js
request.removeHeader('Content-Type');
```

### `request.reusedSocket`

* Type: {boolean} Request ကို ပြန်လည် အသုံးပြုထားတဲ့ socket တစ်ခုကနေတစ်ဆင့် ပို့ထားခြင်း ရှိမရှိပါ။

Keep-alive ဖွင့်ထားတဲ့ agent တစ်ခုကနေတစ်ဆင့် request ပို့တဲ့အခါ — underlying socket ကို ပြန်လည် အသုံးပြုနိုင်ပါတယ်။ ဒါပေမယ့် — server က ကံမကောင်းတဲ့ အချိန်အခါမှာ connection ကို ပိတ်လိုက်မယ်ဆိုရင် — client က 'ECONNRESET' error တစ်ခုကို ကြုံတွေ့ရနိုင်ပါတယ်။

```mjs
import http from 'node:http';
const agent = new http.Agent({ keepAlive: true });

// Server has a 5 seconds keep-alive timeout by default
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adapting a keep-alive agent
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Do nothing
    });
  });
}, 5000); // Sending request on 5s interval so it's easy to hit idle timeout
```

```cjs
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

// Server has a 5 seconds keep-alive timeout by default
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adapting a keep-alive agent
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) => {
      // Do nothing
    });
  });
}, 5000); // Sending request on 5s interval so it's easy to hit idle timeout
```

Request တစ်ခုက socket ကို ပြန်လည် အသုံးပြုခဲ့လား မပြုလုပ်ခဲ့လားဆိုတာကို အမှတ်အသား ပြုလုပ်ထားခြင်းအားဖြင့် — အဲဒါကို အခြေခံပြီး error retry (error ပြန်လည် ကြိုးစားခြင်း) တွေကို အလိုအလျောက် လုပ်ဆောင်နိုင်ပါတယ်။

```mjs
import http from 'node:http';
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Check if retry is needed
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

```cjs
const http = require('node:http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) => {
      // ...
    })
    .on('error', (err) => {
      // Check if retry is needed
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

### `request.setHeader(name, value)`

* `name` {string}
* `value` {any}

Headers object အတွက် header value တစ်ခုတည်းကို သတ်မှတ်ပေးပါတယ်။ ဒီ header က — ပို့ဖို့ စီစဉ်ထားတဲ့ headers တွေထဲမှာ ရှိပြီးသား ဆိုရင် — ၎င်းရဲ့ value ကို အစားထိုးလိုက်ပါလိမ့်မယ်။ Name တူတဲ့ headers အများအပြားကို ပို့ဖို့အတွက် ဒီနေရာမှာ strings တွေရဲ့ array တစ်ခုကို သုံးနိုင်ပါတယ်။ String မဟုတ်တဲ့ values တွေကိုတော့ ပြုပြင်မွမ်းမံခြင်း မရှိပဲ သိမ်းဆည်းပါတယ်။ ဒါကြောင့် [`request.getHeader()`][] က string မဟုတ်တဲ့ values တွေကို ပြန်ပေးနိုင်ပါတယ်။ ဒါပေမယ့် — string မဟုတ်တဲ့ values တွေကို network ပေါ်မှာ ပို့ဆောင်ဖို့အတွက် strings တွေအဖြစ် ပြောင်းလဲပေးပါလိမ့်မယ်။

```js
request.setHeader('Content-Type', 'application/json');
```

သို့မဟုတ်

```js
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```

Value က string တစ်ခု ဖြစ်ပြီး — ၎င်းထဲမှာ `latin1` encoding ရဲ့ အပြင်ဘက်က characters တွေ ပါဝင်နေရင် — exception တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

Value ထဲမှာ UTF-8 characters တွေကို ဖြတ်သန်းပေးဖို့ လိုအပ်ရင် — [RFC 8187][] standard ကို သုံးပြီး value ကို encode လုပ်ပေးပါ။

```js
const filename = 'Rock 🎵.txt';
request.setHeader('Content-Disposition', `attachment; filename*=utf-8''${encodeURIComponent(filename)}`);
```

### `request.setNoDelay([noDelay])`

* `noDelay` {boolean}

Socket တစ်ခုကို ဒီ request ဆီကို သတ်မှတ်ပေးပြီး — ၎င်းက ချိတ်ဆက်ပြီးတာနဲ့ — [`socket.setNoDelay()`][] ကို ခေါ်ပါလိမ့်မယ်။

### `request.setSocketKeepAlive([enable][, initialDelay])`

* `enable` {boolean}
* `initialDelay` {number}

Socket တစ်ခုကို ဒီ request ဆီကို သတ်မှတ်ပေးပြီး — ၎င်းက ချိတ်ဆက်ပြီးတာနဲ့ — [`socket.setKeepAlive()`][] ကို ခေါ်ပါလိမ့်မယ်။

### `request.setTimeout(timeout[, callback])`

* `timeout` {number} Request တစ်ခု timeout မဖြစ်ခင် milliseconds အရေအတွက်ပါ။
* `callback` {Function} Optional — timeout ဖြစ်ပွားတဲ့အခါ ခေါ်ယူမယ့် function ပါ။ `'timeout'` event ကို bind လုပ်တာနဲ့ အတူတူပါ။
* Returns: {http.ClientRequest}

Socket တစ်ခုကို ဒီ request ဆီကို သတ်မှတ်ပေးပြီး — ၎င်းက ချိတ်ဆက်ပြီးတာနဲ့ — [`socket.setTimeout()`][] ကို ခေါ်ပါလိမ့်မယ်။

### `request.socket`

* Type: {stream.Duplex}

Underlying socket ဆီကို ရည်ညွှန်းချက် (reference) ပါ။ ပုံမှန်အားဖြင့် users တွေက ဒီ property ကို ဝင်ရောက် သုံးစွဲချင် မှာ မဟုတ်ပါဘူး။ အထူးသဖြင့် — protocol parser က socket ပေါ်ကို ချိတ်ဆွဲပုံကြောင့် — socket က `'readable'` events တွေကို emit လုပ်မှာ မဟုတ်ပါဘူး။

```mjs
import http from 'node:http';
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```

```cjs
const http = require('node:http');
const options = {
  host: 'www.google.com',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`Your IP address is ${ip} and your source port is ${port}.`);
  // Consume response object
});
```

User က {net.Socket} မဟုတ်တဲ့ socket type တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — ဒီ property က {stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ {net.Socket} class ရဲ့ instance တစ်ခု ဖြစ်တာ အာမခံပါတယ်။

### `request.uncork()`

[`writable.uncork()`][] ကို ကြည့်ပါ။

### `request.writableEnded`

* Type: {boolean}

[`request.end()`][] ကို ခေါ်ပြီးနောက်မှာ `true` ဖြစ်ပါတယ်။ ဒီ property က data တွေ flush ဖြစ်သွားလားဆိုတာကို မဖော်ပြပါဘူး — အဲဒါအတွက်တော့ [`request.writableFinished`][] ကို သုံးပါ။

### `request.writableFinished`

* Type: {boolean}

[`'finish'`][] event ကို emit မလုပ်ခင် ချက်ချင်း — data တွေ အားလုံးကို underlying system ဆီကို flush လုပ်ပြီးသွားရင် — `true` ဖြစ်ပါတယ်။

### `request.write(chunk[, encoding][, callback])`

* `chunk` {string|Buffer|Uint8Array}
* `encoding` {string}
* `callback` {Function}
* Returns: {boolean}

Body ရဲ့ chunk တစ်ခုကို ပို့ပေးပါတယ်။ ဒီ method ကို အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။ `Content-Length` ကို သတ်မှတ်မထားဘူးဆိုရင် — server က data ဘယ်အချိန်မှာ ကုန်ဆုံးလဲဆိုတာ သိရှိနိုင်ဖို့ — data တွေကို HTTP Chunked transfer encoding နဲ့ အလိုအလျောက် encode လုပ်ပါလိမ့်မယ်။ `Transfer-Encoding: chunked` header ကို ထည့်သွင်းပါတယ်။ Request ပို့ခြင်းကို အပြီးသတ်ဖို့ [`request.end()`][] ကို ခေါ်ဖို့ လိုအပ်ပါတယ်။

`encoding` argument က optional ဖြစ်ပြီး — `chunk` က string တစ်ခု ဖြစ်တဲ့အခါမှသာ သက်ဆိုင်ပါတယ်။ Default က `'utf8'` ပါ။

`callback` argument က optional ဖြစ်ပြီး — ဒီ data chunk ကို flush လုပ်ပြီးတဲ့အခါ ခေါ်ပါလိမ့်မယ် — ဒါပေမယ့် chunk က ဗလာ (empty) မဟုတ်မှသာ ဖြစ်ပါတယ်။

Data တစ်ခုလုံးကို kernel buffer ဆီကို အောင်မြင်စွာ flush လုပ်နိုင်ခဲ့ရင် `true` ကို ပြန်ပေးပါတယ်။ Data တစ်ခုလုံး သို့မဟုတ် တစ်စိတ်တစ်ပိုင်းကို user memory ထဲမှာ queue လုပ်ထားရရင် `false` ကို ပြန်ပေးပါတယ်။ Buffer က ပြန်လည် လွတ်သွားတဲ့အခါ `'drain'` ကို emit လုပ်ပါလိမ့်မယ်။

`write` function ကို empty string သို့မဟုတ် buffer တစ်ခုနဲ့ ခေါ်လိုက်ရင် — ၎င်းက ဘာမှ မလုပ်ပဲ နောက်ထပ် input တွေကို စောင့်ဆိုင်းပါတယ်။

## Class: `http.Server`

* Extends: {net.Server}

### Event: `'checkContinue'`

* `request` {http.IncomingMessage}
* `response` {http.ServerResponse}

HTTP `Expect: 100-continue` ပါတဲ့ request တစ်ခုကို လက်ခံရရှိတိုင်း emit လုပ်ပါတယ်။ ဒီ event ကို နားထောင်မထားဘူးဆိုရင် — server က သင့်လျော်သလို `100 Continue` နဲ့ အလိုအလျောက် တုံ့ပြန်ပါလိမ့်မယ်။

ဒီ event ကို ကိုင်တွယ်တာမှာ — client က request body ကို ဆက်ပို့သင့်တယ်ဆိုရင် [`response.writeContinue()`][] ကို ခေါ်ခြင်း — သို့မဟုတ် client က request body ကို မဆက်ပို့သင့်ဘူးဆိုရင် သင့်လျော်တဲ့ HTTP response တစ်ခု (ဥပမာ 400 Bad Request) ကို ထုတ်လုပ်ခြင်း — တို့ ပါဝင်ပါတယ်။

ဒီ event ကို emit လုပ်ပြီး ကိုင်တွယ်လိုက်တဲ့အခါ — [`'request'`][] event ကို emit လုပ်တော့မှာ မဟုတ်ပါဘူး။

### Event: `'checkExpectation'`

* `request` {http.IncomingMessage}
* `response` {http.ServerResponse}

HTTP `Expect` header ပါတဲ့ request တစ်ခုကို — value က `100-continue` မဟုတ်တဲ့အခါ — လက်ခံရရှိတိုင်း emit လုပ်ပါတယ်။ ဒီ event ကို နားထောင်မထားဘူးဆိုရင် — server က သင့်လျော်သလို `417 Expectation Failed` နဲ့ အလိုအလျောက် တုံ့ပြန်ပါလိမ့်မယ်။

ဒီ event ကို emit လုပ်ပြီး ကိုင်တွယ်လိုက်တဲ့အခါ — [`'request'`][] event ကို emit လုပ်တော့မှာ မဟုတ်ပါဘူး။

### Event: `'clientError'`

* `exception` {Error}
* `socket` {stream.Duplex}

Client connection တစ်ခုက `'error'` event တစ်ခုကို emit လုပ်ခဲ့ရင် — ၎င်းကို ဒီနေရာကို ရှေ့ဆက်ပို့ဆောင် (forward) ပေးပါတယ်။ ဒီ event ရဲ့ listener က underlying socket ကို ပိတ်ခြင်း/destroy လုပ်ခြင်းအတွက် တာဝန်ရှိပါတယ်။ ဥပမာ — connection ကို ရုတ်ခြည်း ဖြတ်တောက်ပစ်မယ့်အစား — custom HTTP response တစ်ခုနဲ့အတူ socket ကို ပိုမို ယဉ်ကျေးစွာ ပိတ်ချင်တာမျိုး ဖြစ်နိုင်ပါတယ်။ Listener က မဆုံးခင်မှာ socket ကို **ပိတ်ရန် သို့မဟုတ် destroy လုပ်ရန် လိုအပ်ပါတယ်**။

User က {net.Socket} မဟုတ်တဲ့ socket type တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — ဒီ event ကို {stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ {net.Socket} class ရဲ့ instance တစ်ခုနဲ့အတူ ဖြတ်သန်းပေးတာ အာမခံပါတယ်။

Default အပြုအမူကတော့ — HTTP '400 Bad Request' သို့မဟုတ် — [`HPE_HEADER_OVERFLOW`][] error ဖြစ်တဲ့ ကိစ္စမှာဆိုရင် — HTTP '431 Request Header Fields Too Large' နဲ့ socket ကို ပိတ်ဖို့ ကြိုးစားပါတယ်။ Socket က writable မဟုတ်ဘူး သို့မဟုတ် လက်ရှိ တွဲချိတ်ထားတဲ့ [`http.ServerResponse`][] ရဲ့ headers တွေကို ပို့ပြီးသား ဖြစ်နေရင် — ၎င်းကို ချက်ချင်း destroy လုပ်ပါတယ်။

`socket` ဆိုတာ error စတင်ဖြစ်ပွားခဲ့တဲ့ [`net.Socket`][] object ပါ။

```mjs
import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```

```cjs
const http = require('node:http');

const server = http.createServer((req, res) => {
  res.end();
});
server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(8000);
```

`'clientError'` event ဖြစ်ပွားတဲ့အခါ — `request` သို့မဟုတ် `response` object မရှိတာမို့ — response headers နဲ့ payload အပါအဝင် ပို့လိုက်တဲ့ HTTP response မှန်သမျှကို `socket` object ဆီကို တိုက်ရိုက် ရေးသားရပါမယ်။ Response က ပုံစံမှန်ကန်တဲ့ HTTP response message တစ်ခု ဖြစ်ဖို့လည်း ဂရုစိုက်ရပါမယ်။

`err` က နောက်ထပ် columns နှစ်ခု ပါဝင်တဲ့ `Error` ရဲ့ instance တစ်ခုပါ:

* `bytesParsed`: Node.js က မှန်ကန်စွာ parse လုပ်နိုင်ခဲ့တဲ့ request packet ရဲ့ bytes အရေအတွက်;
* `rawPacket`: လက်ရှိ request ရဲ့ raw packet ပါ။

`ECONNRESET` errors တွေလိုမျိုး အခြေအနေတစ်ချို့မှာ — client က response ကို ရပြီးသား ဖြစ်နေတာ နဲ့/သို့မဟုတ် socket ကို destroy လုပ်ပြီးသား ဖြစ်နေနိုင်ပါတယ်။ Socket ဆီကို data ပို့ဖို့ မကြိုးစားခင် — ၎င်းက writable ဖြစ်နေသေးလားဆိုတာ စစ်ဆေးတာက ပိုကောင်းပါတယ်။

```js
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
```

### Event: `'close'`

Server ပိတ်သွားတဲ့အခါ emit လုပ်ပါတယ်။

### Event: `'connect'`

* `request` {http.IncomingMessage} [`'request'`][] event မှာလိုပဲ HTTP request အတွက် arguments တွေပါ
* `socket` {stream.Duplex} Server နဲ့ client ကြားက network socket ပါ
* `head` {Buffer} Tunneling stream ရဲ့ ပထမဆုံး packet ပါ (ဗလာ ဖြစ်နိုင်ပါတယ်)

Client တစ်ခုက HTTP `CONNECT` method တစ်ခုကို တောင်းဆိုတိုင်း emit လုပ်ပါတယ်။ ဒီ event ကို နားထောင်မထားဘူးဆိုရင် — `CONNECT` method တစ်ခုကို တောင်းဆိုတဲ့ clients တွေရဲ့ connections တွေကို ပိတ်ပစ်ပါလိမ့်မယ်။

User က {net.Socket} မဟုတ်တဲ့ socket type တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — ဒီ event ကို {stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ {net.Socket} class ရဲ့ instance တစ်ခုနဲ့အတူ ဖြတ်သန်းပေးတာ အာမခံပါတယ်။

ဒီ event ကို emit လုပ်ပြီးနောက်မှာ — request ရဲ့ socket ပေါ်မှာ `'data'` event listener ရှိမှာ မဟုတ်တော့ပါဘူး။ ဆိုလိုတာက — အဲဒီ socket ပေါ်မှာ server ဆီကို ပို့လိုက်တဲ့ data တွေကို ကိုင်တွယ်ဖို့ — listener ကို ချိတ်ဆွဲပေးဖို့ လိုအပ်ပါလိမ့်မယ်။

### Event: `'connection'`

* `socket` {stream.Duplex}

TCP stream အသစ်တစ်ခု တည်ဆောက်လိုက်တဲ့အခါ ဒီ event ကို emit လုပ်ပါတယ်။ `socket` က ပုံမှန်အားဖြင့် [`net.Socket`][] type ရဲ့ object တစ်ခု ဖြစ်ပါတယ်။ ပုံမှန်အားဖြင့် users တွေက ဒီ event ကို ဝင်ရောက် သုံးစွဲချင် မှာ မဟုတ်ပါဘူး။ အထူးသဖြင့် — protocol parser က socket ပေါ်ကို ချိတ်ဆွဲပုံကြောင့် — socket က `'readable'` events တွေကို emit လုပ်မှာ မဟုတ်ပါဘူး။ `socket` ကို `request.socket` မှာလည်း ဝင်ရောက် သုံးစွဲနိုင်ပါတယ်။

ဒီ event ကို — HTTP server ထဲကို connections တွေ ထည့်သွင်းဖို့ — users တွေက တိုက်ရိုက် (explicitly) emit လုပ်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ — ဘယ် [`Duplex`][] stream မဆို ဖြတ်သန်းပေးနိုင်ပါတယ်။

ဒီနေရာမှာ `socket.setTimeout()` ကို ခေါ်ထားရင် — socket က request တစ်ခုကို ဆောင်ရွက်ပေးပြီးတဲ့အခါ — timeout ကို `server.keepAliveTimeout` နဲ့ အစားထိုးပါလိမ့်မယ် (`server.keepAliveTimeout` က သုည မဟုတ်ရင်)။

User က {net.Socket} မဟုတ်တဲ့ socket type တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — ဒီ event ကို {stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ {net.Socket} class ရဲ့ instance တစ်ခုနဲ့အတူ ဖြတ်သန်းပေးတာ အာမခံပါတယ်။

### Event: `'dropRequest'`

* `request` {http.IncomingMessage} [`'request'`][] event မှာလိုပဲ HTTP request အတွက် arguments တွေပါ
* `socket` {stream.Duplex} Server နဲ့ client ကြားက network socket ပါ

Socket တစ်ခုပေါ်မှာ requests အရေအတွက်က `server.maxRequestsPerSocket` ရဲ့ threshold (ကန့်သတ်ချက်) ကို ရောက်ရှိတဲ့အခါ — server က requests အသစ်တွေကို ပယ်ချပြီး — အဲဒီအစား `'dropRequest'` event ကို emit လုပ်ကာ — client ဆီကို `503` ကို ပို့ပါလိမ့်မယ်။

### Event: `'request'`

* `request` {http.IncomingMessage}
* `response` {http.ServerResponse}

Request တစ်ခု ရှိတိုင်း emit လုပ်ပါတယ်။ Connection တစ်ခုအတွင်းမှာ requests အများအပြား ရှိနိုင်ပါတယ် (HTTP Keep-Alive connections တွေရဲ့ ကိစ္စမှာ)။

### Event: `'upgrade'`

* `request` {http.IncomingMessage} [`'request'`][] event မှာလိုပဲ HTTP request အတွက် arguments တွေပါ
* `stream` {stream.Duplex} Server နဲ့ client ကြားက upgraded stream ပါ
* `head` {Buffer} Upgraded stream ရဲ့ ပထမဆုံး packet ပါ (ဗလာ ဖြစ်နိုင်ပါတယ်)

Client တစ်ခုရဲ့ HTTP upgrade request တစ်ခုကို လက်ခံလိုက်တိုင်း emit လုပ်ပါတယ်။ ဒီ event ကို နားထောင်မထားဘူးဆိုရင် — HTTP upgrade requests တွေ အားလုံးကို ပုံမှန်အားဖြင့် လျစ်လျူရှုပါတယ် (ဆိုလိုတာက — ပုံမှန် HTTP request/response flow ကို လိုက်နာရင်း — သာမန် `'request'` events တွေကိုသာ emit လုပ်ပါတယ်)။ ဒီ event ကို နားထောင်နေမယ်ဆိုရင်တော့ — ၎င်းတို့ အားလုံးကို လက်ခံပါတယ် (ဆိုလိုတာက — `'upgrade'` event ကို အဲဒီအစား emit လုပ်ပြီး — နောက်ပိုင်း ဆက်သွယ်မှုတွေကို raw stream ကနေတစ်ဆင့် တိုက်ရိုက် ကိုင်တွယ်ရပါမယ်)။ Server ရဲ့ `shouldUpgradeCallback` option ကို သုံးပြီး ဒါကို ပိုမို တိကျစွာ ထိန်းချုပ်နိုင်ပါတယ်။

ဒီ event ကို နားထောင်တာက optional ဖြစ်ပြီး — clients တွေက protocol ပြောင်းလဲမှုတစ်ခုကို တောင်းဆို (insist) လို့ မရပါဘူး။

Upgrade တစ်ခုကို `shouldUpgradeCallback` က လက်ခံလိုက်ပေမယ့် — event handler တစ်ခုမှ မှတ်ပုံတင်မထားဘူးဆိုရင် — socket ကို destroy လုပ်ပစ်ပြီး — client အတွက် connection ကို ချက်ချင်း ပိတ်လိုက်တာနဲ့ ညီမျှပါတယ်။

ရှားပါးတဲ့ အခြေအနေတစ်ခုအနေနဲ့ — ဝင်လာတဲ့ request မှာ body တစ်ခု ပါနေမယ်ဆိုရင် — ဒီ body ကို upgrade stream နဲ့ သီးခြားစီ — ပုံမှန်အတိုင်း parse လုပ်ပြီး — ၎င်း ပြီးဆုံးသွားမှသာ raw stream data က စတင်ပါလိမ့်မယ်။ Stream ကနေ ဖတ်တာက — request body ကို ဖတ်ဖို့ စောင့်ဆိုင်းနေလို့ ပိတ်ဆို့မခံရစေဖို့ — stream ပေါ်က ဖတ်မှုတွေ မှန်သမျှက request body ကို အလိုအလျောက် စီးဆင်းစေပါလိမ့်မယ်။ Request body ကို ဖတ်ချင်တယ်ဆိုရင် — upgraded stream ကနေ မစဖတ်ခင် — အဲဒီလို ဖတ်တာ (ဆိုလိုတာက `'data'` listeners တွေ ချိတ်တာ) ကို ဦးစွာ လုပ်ဆောင်ထားဖို့ သေချာပါစေ။

Stream argument က ပုံမှန်အားဖြင့် request က သုံးတဲ့ {net.Socket} instance ဖြစ်ပါလိမ့်မယ် — ဒါပေမယ့် အခြေအနေတစ်ချို့မှာ (request body တစ်ခု ပါတဲ့ ကိစ္စမျိုးလိုမျိုး) — duplex stream တစ်ခု ဖြစ်နိုင်ပါတယ်။ လိုအပ်ရင် — request ရဲ့ အောက်ခံ (underlying) raw connection ကို [`request.socket`][] ကနေတစ်ဆင့် ဝင်ရောက် သုံးစွဲနိုင်ပြီး — user က တခြား socket type တစ်ခုကို သတ်မှတ်မထားဘူးဆိုရင် — ၎င်းက {net.Socket} ရဲ့ instance တစ်ခု ဖြစ်တာ အာမခံပါတယ်။

### `server.close([callback])`

* `callback` {Function}

Server က connections အသစ်တွေကို လက်ခံတာ ရပ်တန့်စေပြီး — request တစ်ခု ပို့နေတာ သို့မဟုတ် response တစ်ခုကို စောင့်ဆိုင်းနေတာ မဟုတ်တဲ့ — ဒီ server နဲ့ ချိတ်ဆက်ထားတဲ့ connections တွေ အားလုံးကို ပိတ်ပါတယ်။ [`net.Server.close()`][] ကို ကြည့်ပါ။

```js
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Close the server after 10 seconds
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
}, 10000);
```

### `server.closeAllConnections()`

ဒီ server နဲ့ ချိတ်ဆက်ထားတဲ့ — request ပို့နေတာ သို့မဟုတ် response စောင့်ဆိုင်းနေတဲ့ active connections တွေ အပါအဝင် — တည်ဆောက်ပြီးသား HTTP(S) connections တွေ အားလုံးကို ပိတ်ပါတယ်။ ဒါက WebSocket သို့မဟုတ် HTTP/2 လိုမျိုး — တခြား protocol တစ်ခုဆီကို upgrade လုပ်ထားတဲ့ sockets တွေကိုတော့ destroy လုပ်ပေး_တာ မဟုတ်ပါဘူး_။

> ဒါက connections တွေ အားလုံးကို ပိတ်တဲ့ အတင်းအကြပ် (forceful) နည်းလမ်းတစ်ခု ဖြစ်ပြီး — သတိထားပြီးမှ သုံးသင့်ပါတယ်။ `server.close` နဲ့ တွဲပြီး သုံးတဲ့အခါတိုင်း — ဒီ method ကို ခေါ်တာနဲ့ `server.close` ကို ခေါ်တာကြားမှာ connections အသစ်တွေ ဖန်တီးခံရတဲ့ race conditions တွေကို ရှောင်ရှားဖို့ — `server.close` ရဲ့ _နောက်မှာ_ (after) ခေါ်တာကို အကြံပြုပါတယ်။

```js
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Close the server after 10 seconds
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
  // Closes all connections, ensuring the server closes successfully
  server.closeAllConnections();
}, 10000);
```

### `server.closeIdleConnections()`

Request တစ်ခု ပို့နေတာ သို့မဟုတ် response တစ်ခုကို စောင့်ဆိုင်းနေတာ မဟုတ်တဲ့ — ဒီ server နဲ့ ချိတ်ဆက်ထားတဲ့ connections တွေ အားလုံးကို ပိတ်ပါတယ်။

> Node.js 19.0.0 ကစပြီး — `keep-alive` connections တွေကို ဖယ်ရှားဖို့ — ဒီ method ကို `server.close` နဲ့ တွဲပြီး ခေါ်စရာ မလိုတော့ပါဘူး။ ဒါပေမယ့် — ၎င်းကို သုံးတာက ဘာအန္တရာယ်မှ မဖြစ်စေပဲ — 19.0.0 ထက် ဟောင်းတဲ့ versions တွေကို support လုပ်ဖို့ လိုအပ်တဲ့ libraries နဲ့ applications တွေအတွက် backwards compatibility (နောက်ပြန် လိုက်ဖက်ညီမှု) ကို သေချာစေဖို့ အသုံးဝင်နိုင်ပါတယ်။ `server.close` နဲ့ တွဲပြီး သုံးတဲ့အခါတိုင်း — ဒီ method ကို ခေါ်တာနဲ့ `server.close` ကို ခေါ်တာကြားမှာ connections အသစ်တွေ ဖန်တီးခံရတဲ့ race conditions တွေကို ရှောင်ရှားဖို့ — `server.close` ရဲ့ _နောက်မှာ_ (after) ခေါ်တာကို အကြံပြုပါတယ်။

```js
const http = require('node:http');

const server = http.createServer({ keepAliveTimeout: 60000 }, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
// Close the server after 10 seconds
setTimeout(() => {
  server.close(() => {
    console.log('server on port 8000 closed successfully');
  });
  // Closes idle connections, such as keep-alive connections. Server will close
  // once remaining active connections are terminated
  server.closeIdleConnections();
}, 10000);
```
### `server.headersTimeout`

* Type: {number} **Default:** [`server.requestTimeout`][] (သို့) `60000` — နှစ်ခုအနက် အနည်းဆုံး တန်ဖိုး

Parser က HTTP headers တွေ အပြည့်အဝ လက်ခံရရှိဖို့ စောင့်ဆိုင်းမယ့် အချိန် ပမာဏကို ကန့်သတ်ပေးပါတယ်။

Timeout သက်တမ်း ကုန်ဆုံးသွားခဲ့ရင် — server က request ကို request listener ဆီကို မပို့ပဲ — status 408 နဲ့ တုံ့ပြန်ပြီး — ချိတ်ဆက်မှုကို ပိတ်ပစ်ပါတယ်။

Server ကို ရှေ့မှာ reverse proxy မပါပဲ deploy လုပ်ထားတဲ့ အခြေအနေမျိုးမှာ ဖြစ်လာနိုင်တဲ့ Denial-of-Service (ဝန်ဆောင်မှု ပျက်စေသော) တိုက်ခိုက်မှုတွေကနေ ကာကွယ်ဖို့ — ဒီတန်ဖိုးကို သုည မဟုတ်တဲ့ တန်ဖိုးတစ်ခု (ဥပမာ — 120 စက္ကန့်) အဖြစ် သတ်မှတ်ထားရပါမယ်။

### `server.listen()`

HTTP server ကို connections တွေအတွက် listening စတင်စေပါတယ်။
ဒီ method က [`net.Server`][] ရဲ့ [`server.listen()`][] method နဲ့ တူညီပါတယ်။

### `server.listening`

* Type: {boolean} Server က connections တွေအတွက် listening လုပ်နေလား မလုပ်နေဘူးလားဆိုတာကို ဖော်ပြပါတယ်။

### `server.maxHeadersCount`

* Type: {number} **Default:** `2000`

ဝင်လာတဲ့ headers တွေရဲ့ အများဆုံး အရေအတွက်ကို ကန့်သတ်ပေးပါတယ်။ `0` လို့ သတ်မှတ်ထားရင် — ကန့်သတ်ချက် ဘာမှ သက်ရောက်မှာ မဟုတ်ပါဘူး။

### `server.requestTimeout`

* Type: {number} **Default:** `300000`

Client ဆီကနေ request တစ်ခုလုံးကို လက်ခံရရှိဖို့ timeout တန်ဖိုးကို millisecond နဲ့ သတ်မှတ်ပေးပါတယ်။

Timeout သက်တမ်း ကုန်ဆုံးသွားခဲ့ရင် — server က request ကို request listener ဆီကို မပို့ပဲ — status 408 နဲ့ တုံ့ပြန်ပြီး — ချိတ်ဆက်မှုကို ပိတ်ပစ်ပါတယ်။

Server ကို ရှေ့မှာ reverse proxy မပါပဲ deploy လုပ်ထားတဲ့ အခြေအနေမျိုးမှာ ဖြစ်လာနိုင်တဲ့ Denial-of-Service တိုက်ခိုက်မှုတွေကနေ ကာကွယ်ဖို့ — ဒီတန်ဖိုးကို သုည မဟုတ်တဲ့ တန်ဖိုးတစ်ခု (ဥပမာ — 120 စက္ကန့်) အဖြစ် သတ်မှတ်ထားရပါမယ်။

### `server.setTimeout([msecs][, callback])`

* `msecs` {number} **Default:** 0 (timeout မရှိပါ)
* `callback` {Function}
* Returns: {http.Server}

Sockets တွေအတွက် timeout တန်ဖိုးကို သတ်မှတ်ပေးပြီး — timeout တစ်ခု ဖြစ်ပေါ်ခဲ့ရင် — Server object ပေါ်မှာ socket ကို argument အဖြစ် ဖြတ်သန်းရင်း `'timeout'` event တစ်ခုကို emit လုပ်ပါတယ်။

Server object ပေါ်မှာ `'timeout'` event listener တစ်ခု ရှိနေရင် — timeout ဖြစ်သွားတဲ့ socket ကို argument အဖြစ် ထည့်ပြီး အဲဒီ listener ကို ခေါ်ပါလိမ့်မယ်။

Default အနေနဲ့ — Server က sockets တွေကို timeout လုပ်မပေးပါဘူး။ ဒါပေမယ့် — Server ရဲ့ `'timeout'` event ပေါ်မှာ callback တစ်ခု ချိတ်ဆွဲထားရင်တော့ — timeouts တွေကို တိုက်ရိုက် (explicitly) ကိုင်တွယ်ပေးရပါမယ်။

### `server.maxRequestsPerSocket`

* Type: {number} Socket တစ်ခုစီအတွက် requests အရေအတွက်ပါ။ **Default:** 0 (ကန့်သတ်ချက် မရှိ)

Keep-alive connection တစ်ခုကို မပိတ်ခင် socket တစ်ခုက ကိုင်တွယ်နိုင်တဲ့ requests အများဆုံး အရေအတွက်ပါ။

`0` ဆိုတဲ့ တန်ဖိုးက ဒီကန့်သတ်ချက်ကို ပိတ်ပေးပါလိမ့်မယ်။

ကန့်သတ်ချက် ရောက်ရှိသွားတဲ့အခါ — `Connection` header ရဲ့ တန်ဖိုးကို `close` အဖြစ် သတ်မှတ်ပေးပေမယ့် — connection ကို တကယ်တော့ ပိတ်ပစ်မှာ မဟုတ်ပါဘူး။ ကန့်သတ်ချက် ရောက်ရှိပြီးနောက် ပို့လိုက်တဲ့ နောက်ဆက်တွဲ requests တွေကတော့ response အဖြစ် `503 Service Unavailable` ကို ရရှိပါလိမ့်မယ်။

### `server.timeout`

* Type: {number} Millisecond ဖြင့် timeout တန်ဖိုးပါ။ **Default:** 0 (timeout မရှိပါ)

Socket တစ်ခုကို timeout ဖြစ်ပြီလို့ မှတ်ယူခံရခင် — လှုပ်ရှားမှု မရှိဘဲ (inactivity) နေရမယ့် millisecond အရေအတွက်ပါ။

`0` ဆိုတဲ့ တန်ဖိုးက incoming connections တွေပေါ်မှာ timeout အပြုအမူကို ပိတ်ပေးပါလိမ့်မယ်။

Socket timeout logic ကို connection ပြုလုပ်ချိန်မှာ သတ်မှတ်ပေးတာမို့ — ဒီတန်ဖိုးကို ပြောင်းလဲခြင်းက server ဆီကို အသစ် ချိတ်ဆက်တဲ့ connections တွေကိုသာ သက်ရောက်မှု ရှိပြီး — ရှိပြီးသား connections တွေကိုတော့ မသက်ရောက်ပါဘူး။

### `server.keepAliveTimeout`

* Type: {number} Millisecond ဖြင့် timeout တန်ဖိုးပါ။ **Default:** `5000` (5 စက္ကန့်)။

Server က နောက်ဆုံး response ကို ရေးသားပြီးသွားပြီးနောက် — socket တစ်ခု မဖျက်ဆီးခံရခင် — နောက်ထပ် incoming data တွေအတွက် စောင့်ဆိုင်းရမယ့် လှုပ်ရှားမှုမရှိတဲ့ millisecond အရေအတွက်ပါ။

ဒီ timeout တန်ဖိုးကို [`server.keepAliveTimeoutBuffer`][] option နဲ့ ပေါင်းစပ်ပြီး — တကယ့် (actual) socket timeout ကို ဆုံးဖြတ်ပါတယ်။ တွက်နည်းကတော့:
socketTimeout = keepAliveTimeout + keepAliveTimeoutBuffer
Keep-alive timeout မီးလင်းခြင်း (fire) မဖြစ်ခင် server က data အသစ် လက်ခံရရှိခဲ့ရင် — ပုံမှန် inactivity timeout — ဆိုလိုတာက [`server.timeout`][] — ကို ပြန်လည် သတ်မှတ် (reset) လုပ်ပါလိမ့်မယ်။

`0` ဆိုတဲ့ တန်ဖိုးက incoming connections တွေပေါ်မှာ keep-alive timeout အပြုအမူကို ပိတ်ပေးပါလိမ့်မယ်။
`0` ဆိုတဲ့ တန်ဖိုးက HTTP server ကို — keep-alive timeout မရှိခဲ့တဲ့ — Node.js 8.0.0 မတိုင်ခင် versions တွေလိုပဲ ပြုမူစေပါတယ်။

Socket timeout logic ကို connection ပြုလုပ်ချိန်မှာ သတ်မှတ်ပေးတာမို့ — ဒီတန်ဖိုးကို ပြောင်းလဲခြင်းက server ဆီကို အသစ် ချိတ်ဆက်တဲ့ connections တွေကိုသာ သက်ရောက်မှု ရှိပြီး — ရှိပြီးသား connections တွေကိုတော့ မသက်ရောက်ပါဘူး။

### `server.keepAliveTimeoutBuffer`

* Type: {number} Millisecond ဖြင့် timeout တန်ဖိုးပါ။ **Default:** `1000` (1 စက္ကန့်)။

[`server.keepAliveTimeout`][] ပေါ်ကို ထပ်ဆောင်း ပေါင်းထည့်ပေးပြီး — internal socket timeout ကို ပိုရှည်အောင် လုပ်ပေးတဲ့ buffer time တစ်ခုပါ။

ဒီ buffer က — socket timeout ကို ကြေညာထားတဲ့ (advertised) keep-alive timeout ထက် နည်းနည်း ပိုတိုးပေးခြင်းအားဖြင့် — connection reset (`ECONNRESET`) errors တွေကို လျှော့ချပေးဖို့ ကူညီပါတယ်။

ဒီ option က incoming connections အသစ်တွေကိုသာ သက်ရောက်ပါတယ်။

### `server[Symbol.asyncDispose]()`

[`server.close()`][] ကို ခေါ်ပြီး — server ပိတ်သွားတဲ့အခါ fulfill ဖြစ်မယ့် promise တစ်ခုကို ပြန်ပေးပါတယ်။

## Class: `http.ServerResponse`

* Extends: {http.OutgoingMessage}

ဒီ object ကို user က ဖန်တီးတာ မဟုတ်ပဲ — HTTP server က အတွင်းပိုင်းမှာ ဖန်တီးပါတယ်။ ၎င်းကို [`'request'`][] event ရဲ့ ဒုတိယ parameter အဖြစ် ဖြတ်သန်းပေးပါတယ်။

### Event: `'close'`

Response က ပြီးစီးသွားပြီ ဖြစ်ကြောင်း သို့မဟုတ် — ၎င်းရဲ့ underlying connection က (response မပြီးဆုံးခင်) စောလွန်းစွာ အဆုံးသတ်ခံခဲ့ရကြောင်း ဖော်ပြပါတယ်။

### Event: `'finish'`

Response ပို့လိုက်ပြီးတဲ့အခါ emit လုပ်ပါတယ်။ ပိုတိကျအောင် ပြောရရင် — response headers နဲ့ body ရဲ့ နောက်ဆုံး အပိုင်းကို network ကနေ ပို့ဆောင်ဖို့ operating system ဆီကို လွှဲပြောင်းပေးလိုက်ပြီးတဲ့အခါ — ဒီ event ကို emit လုပ်ပါတယ်။ ဒါက client က တစ်ခုခုကို လက်ခံရရှိပြီးပြီလို့ ဆိုလိုတာ မဟုတ်ပါဘူး။

### `response.addTrailers(headers)`

* `headers` {Object}

ဒီ method က HTTP trailing headers (message ရဲ့ အဆုံးမှာ ထည့်တဲ့ headers မျိုး) တွေကို response ဆီကို ထပ်ဖြည့်ပေးပါတယ်။

Trailers တွေကို emit လုပ်ပေးမှာက — response အတွက် chunked encoding သုံးထားတဲ့အခါမှသာ ဖြစ်ပါတယ်။ အဲဒီလို မသုံးထားဘူးဆိုရင် (ဥပမာ — request က HTTP/1.0 ဖြစ်နေရင်) — တိတ်တဆိတ် ပစ်ပယ်ခံရပါလိမ့်မယ်။

HTTP က trailers တွေ emit လုပ်ဖို့အတွက် — ၎င်းရဲ့ တန်ဖိုးထဲမှာ header fields တွေရဲ့ စာရင်း ပါဝင်တဲ့ — `Trailer` header ကို ပို့ပေးဖို့ လိုအပ်ပါတယ်။ ဥပမာ:

```js
response.writeHead(200, { 'Content-Type': 'text/plain',
                          'Trailer': 'Content-MD5' });
response.write(fileData);
response.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
response.end();
```

Invalid characters (မမှန်ကန်တဲ့ စာလုံးများ) ပါဝင်တဲ့ header field name သို့မဟုတ် value တစ်ခုကို သတ်မှတ်ဖို့ ကြိုးစားရင် — [`TypeError`][] တစ်ခု throw လုပ်ခံရပါလိမ့်မယ်။

### `response.connection`

> Stability: 0 - Deprecated. Use [`response.socket`][].

* Type: {stream.Duplex}

[`response.socket`][] ကို ကြည့်ပါ။

### `response.cork()`

[`writable.cork()`][] ကို ကြည့်ပါ။

### `response.end([data[, encoding]][, callback])`

* `data` {string|Buffer|Uint8Array}
* `encoding` {string}
* `callback` {Function}
* Returns: {this}

ဒီ method က — response headers နဲ့ body တွေ အားလုံး ပို့လိုက်ပြီးပြီ ဖြစ်ကြောင်းနဲ့ — server က ဒီ message ကို ပြီးပြည့်စုံတဲ့ message အဖြစ် မှတ်ယူသင့်ကြောင်း အချက်ပြပါတယ်။ `response.end()` method ကို response တစ်ခုစီတိုင်းမှာ မဖြစ်မနေ ခေါ်ပေးရပါမယ် (MUST)။

`data` ကို သတ်မှတ်ပေးထားရင် — အကျိုးသက်ရောက်မှုက [`response.write(data, encoding)`][] ကို ခေါ်ပြီးနောက်မှာ `response.end(callback)` ကို ခေါ်တာနဲ့ ဆင်တူပါတယ်။

`callback` ကို သတ်မှတ်ပေးထားရင် — response stream ပြီးဆုံးသွားတဲ့အခါ ၎င်းကို ခေါ်ပါလိမ့်မယ်။

### `response.finished`

> Stability: 0 - Deprecated. Use [`response.writableEnded`][].

* Type: {boolean}

[`response.end()`][] ကို ခေါ်ခဲ့ပြီးဆိုရင် — `response.finished` property က `true` ဖြစ်ပါလိမ့်မယ်။

### `response.flushHeaders()`

Response headers တွေကို flush လုပ်ပါတယ်။ ဒါ့အပြင်: [`request.flushHeaders()`][] ကိုလည်း ကြည့်ပါ။

### `response.getHeader(name)`

* `name` {string}
* Returns: {number | string | string\[] | undefined}

Queue ထဲမှာ ရှိနေပြီး client ဆီကို မပို့ရသေးတဲ့ header တစ်ခုကို ဖတ်ထုတ်ပေးပါတယ်။ Name က case-insensitive (စာလုံးအကြီး/အသေး ခွဲခြားမှု မရှိ) ပါ။ Return တန်ဖိုးရဲ့ type က [`response.setHeader()`][] ဆီကို ပေးခဲ့တဲ့ arguments တွေပေါ်မှာ မူတည်ပါတယ်။

```js
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType is 'text/html'
const contentLength = response.getHeader('Content-Length');
// contentLength is of type number
const setCookie = response.getHeader('set-cookie');
// setCookie is of type string[]
```

### `response.getHeaderNames()`

* Returns: {string\[]}

လက်ရှိ outgoing headers တွေရဲ့ ထပ်မနေတဲ့ (unique) names တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ Header names တွေ အားလုံးက lowercase ဖြစ်ပါတယ်။

```js
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### `response.getHeaders()`

* Returns: {Object}

လက်ရှိ outgoing headers တွေရဲ့ shallow copy (အပေါ်ယံ မိတ္တူ) တစ်ခုကို ပြန်ပေးပါတယ်။ Shallow copy ကို သုံးထားတာမို့ — http module ရဲ့ header နဲ့ ဆက်စပ်တဲ့ method တွေကို နောက်ထပ် မခေါ်ပဲ — array values တွေကို ပြုပြင် (mutate) လုပ်နိုင်ပါတယ်။ ပြန်ပေးလိုက်တဲ့ object ရဲ့ keys တွေက header names တွေ ဖြစ်ပြီး — values တွေကတော့ သက်ဆိုင်ရာ header values တွေ ဖြစ်ပါတယ်။ Header names တွေ အားလုံးက lowercase ဖြစ်ပါတယ်။

`response.getHeaders()` method က ပြန်ပေးတဲ့ object က JavaScript `Object` ကနေ prototypically ဆက်ခံ (inherit) လုပ်ထားတာ _မဟုတ်ပါဘူး_။ ဒါကြောင့် `obj.toString()`, `obj.hasOwnProperty()` စတဲ့ ပုံမှန် `Object` methods တွေက define လုပ်ထားခြင်း မရှိပဲ — အလုပ်လုပ်မှာ _မဟုတ်ပါဘူး_။

```js
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```

### `response.hasHeader(name)`

* `name` {string}
* Returns: {boolean}

`name` နဲ့ ခွဲခြားသတ်မှတ်ထားတဲ့ header က outgoing headers တွေထဲမှာ လက်ရှိ သတ်မှတ်ထားရင် `true` ကို ပြန်ပေးပါတယ်။ Header name ကို ကိုက်ညီစစ်ဆေးတာက case-insensitive ပါ။

```js
const hasContentType = response.hasHeader('content-type');
```

### `response.headersSent`

* Type: {boolean}

Boolean (ဖတ်ရုံသက်သက် — read-only) တစ်ခုပါ။ Headers တွေ ပို့လိုက်ပြီးဆိုရင် `true` — မဟုတ်ရင် `false` ပါ။

### `response.removeHeader(name)`

* `name` {string}

Implicit ပို့ဆောင်မှုအတွက် queue လုပ်ထားတဲ့ header တစ်ခုကို ဖယ်ရှားပါတယ်။

```js
response.removeHeader('Content-Encoding');
```

### `response.req`

* Type: {http.IncomingMessage}

မူလ HTTP `request` object ဆီကို ရည်ညွှန်းချက် (reference) တစ်ခုပါ။

### `response.sendDate`

* Type: {boolean}

`true` ဖြစ်နေရင် — headers တွေထဲမှာ မပါဝင်သေးဘူးဆိုရင် — Date header ကို အလိုအလျောက် ထုတ်လုပ်ပြီး response ထဲမှာ ပို့ပေးပါလိမ့်မယ်။ Default က `true` ပါ။

ဒါကို testing လုပ်တဲ့အခါမှသာ ပိတ်ထားသင့်ပါတယ်။ HTTP responses အများစုမှာ Date header က လိုအပ်တာမို့ ဖြစ်ပါတယ် (အသေးစိတ်ကို [RFC 9110 Section 6.6.1][] မှာ ကြည့်ပါ)။

### `response.setHeader(name, value)`

* `name` {string}
* `value` {number | string | string\[]}
* Returns: {http.ServerResponse}

Response object ကို ပြန်ပေးပါတယ်။

Implicit headers တွေအတွက် header value တစ်ခုတည်းကို သတ်မှတ်ပေးပါတယ်။ ဒီ header က ပို့တော့မယ့် headers တွေထဲမှာ ရှိပြီးသားဆိုရင် — ၎င်းရဲ့ value ကို အစားထိုးလိုက်ပါလိမ့်မယ်။ နာမည်တူတဲ့ headers အများအပြား ပို့ချင်ရင် ဒီနေရာမှာ strings တွေရဲ့ array တစ်ခုကို သုံးပါ။ Non-string values တွေကို ပြုပြင်မှု မရှိပဲ သိမ်းဆည်းထားပါတယ်။ ဒါကြောင့် [`response.getHeader()`][] က non-string values တွေကို ပြန်ပေးနိုင်ပါတယ်။ ဒါပေမယ့် — network ကနေ ပို့ဆောင်တဲ့အခါမှာတော့ non-string values တွေကို strings တွေအဖြစ် ပြောင်းလဲပေးပါလိမ့်မယ်။ Call chaining ကို ဖြစ်နိုင်စေဖို့ — ထပ်တူ response object ကိုပဲ caller ဆီကို ပြန်ပေးပါတယ်။

```js
response.setHeader('Content-Type', 'text/html');
```

သို့မဟုတ်

```js
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```

Invalid characters ပါဝင်တဲ့ header field name သို့မဟုတ် value တစ်ခုကို သတ်မှတ်ဖို့ ကြိုးစားရင် — [`TypeError`][] တစ်ခု throw လုပ်ခံရပါလိမ့်မယ်။

[`response.setHeader()`][] နဲ့ headers တွေ သတ်မှတ်ပြီးသားဆိုရင် — ၎င်းတို့ကို [`response.writeHead()`][] ဆီကို ဖြတ်သန်းလိုက်တဲ့ headers တွေနဲ့ ပေါင်းစပ်လိုက်ပြီး — [`response.writeHead()`][] ဆီကို ဖြတ်သန်းလိုက်တဲ့ headers တွေက ဦးစားပေး (precedence) ရရှိပါတယ်။

```js
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

[`response.writeHead()`][] method ကို ခေါ်ပြီး — ဒီ method ကို မခေါ်ရသေးဘူးဆိုရင် — ပေးထားတဲ့ header values တွေကို အတွင်းပိုင်း caching မလုပ်ပဲ — network channel ပေါ်ကို တိုက်ရိုက် ရေးသားလိုက်ပြီး — အဲဒီ header ပေါ်မှာ [`response.getHeader()`][] ကို ခေါ်ရင် မျှော်လင့်ထားတဲ့ ရလဒ် ထွက်လာမှာ မဟုတ်ပါဘူး။ Headers တွေကို နောက်ပိုင်းမှာ ပြန်လည်ရယူခြင်းနဲ့ ပြုပြင်ခြင်း အတွက် အလားအလာ ရှိတဲ့အနေနဲ့ — တဖြည်းဖြည်း (progressively) ဖြည့်တင်းချင်ရင်တော့ — [`response.writeHead()`][] အစား [`response.setHeader()`][] ကို သုံးပါ။

### `response.setTimeout(msecs[, callback])`

* `msecs` {number}
* `callback` {Function}
* Returns: {http.ServerResponse}

Socket ရဲ့ timeout တန်ဖိုးကို `msecs` အဖြစ် သတ်မှတ်ပေးပါတယ်။ Callback တစ်ခု ပေးထားရင် — ၎င်းကို response object ပေါ်က `'timeout'` event ရဲ့ listener အဖြစ် ထည့်သွင်းပေးပါတယ်။

Request, response သို့မဟုတ် server ပေါ်မှာ `'timeout'` listener ဘာမှ မထည့်ထားဘူးဆိုရင် — sockets တွေက timeout ဖြစ်တဲ့အခါ destroy လုပ်ခံရပါလိမ့်မယ်။ Request, response သို့မဟုတ် server ရဲ့ `'timeout'` events တွေပေါ်မှာ handler တစ်ခု သတ်မှတ်ပေးထားရင်တော့ — timeout ဖြစ်သွားတဲ့ sockets တွေကို တိုက်ရိုက် (explicitly) ကိုင်တွယ်ပေးရပါမယ်။

### `response.socket`

* Type: {stream.Duplex}

Underlying socket ဆီကို ရည်ညွှန်းချက်တစ်ခုပါ။ ပုံမှန်အားဖြင့် users တွေက ဒီ property ကို ဝင်ရောက်သုံးစွဲချင် မှာ မဟုတ်ပါဘူး။ အထူးသဖြင့် — protocol parser က socket ပေါ်မှာ ချိတ်ဆွဲပုံရဲ့ သဘောကြောင့် — socket က `'readable'` events တွေကို emit လုပ်မှာ မဟုတ်ပါဘူး။ `response.end()` ပြီးနောက်မှာ ဒီ property ကို null လုပ်ပစ်ပါတယ်။

```mjs
import http from 'node:http';
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

```cjs
const http = require('node:http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`Your IP address is ${ip} and your source port is ${port}.`);
}).listen(3000);
```

User က {net.Socket} ကလွဲလို့ တခြား socket type တစ်ခုကို သတ်မှတ်မထားရင် — ဒီ property က {stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ {net.Socket} class ရဲ့ instance တစ်ခု ဖြစ်တယ်ဆိုတာ အာမခံထားပါတယ်။

### `response.statusCode`

* Type: {number} **Default:** `200`

Implicit headers တွေကို သုံးနေတဲ့အခါ ([`response.writeHead()`][] ကို တိုက်ရိုက် မခေါ်ပဲ) — headers တွေကို flush လုပ်တဲ့အခါ client ဆီကို ပို့ပေးမယ့် status code ကို ဒီ property က ထိန်းချုပ်ပါတယ်။

```js
response.statusCode = 404;
```

Response header ကို client ဆီကို ပို့ပြီးသွားတဲ့နောက်မှာ — ဒီ property က ပို့လိုက်ခဲ့တဲ့ status code ကို ဖော်ပြပါတယ်။

### `response.statusMessage`

* Type: {string}

Implicit headers တွေကို သုံးနေတဲ့အခါ ([`response.writeHead()`][] ကို တိုက်ရိုက် မခေါ်ပဲ) — headers တွေကို flush လုပ်တဲ့အခါ client ဆီကို ပို့ပေးမယ့် status message ကို ဒီ property က ထိန်းချုပ်ပါတယ်။ ဒါကို `undefined` အဖြစ် ထားထားရင် — status code အတွက် standard message ကို သုံးပါလိမ့်မယ်။

```js
response.statusMessage = 'Not found';
```

Response header ကို client ဆီကို ပို့ပြီးသွားတဲ့နောက်မှာ — ဒီ property က ပို့လိုက်ခဲ့တဲ့ status message ကို ဖော်ပြပါတယ်။

### `response.strictContentLength`

* Type: {boolean} **Default:** `false`

`true` လို့ သတ်မှတ်ထားရင် — Node.js က `Content-Length` header ရဲ့ တန်ဖိုးနဲ့ body ရဲ့ အရွယ်အစား (bytes နဲ့) တူညီမှု ရှိမရှိကို စစ်ဆေးပါလိမ့်မယ်။ `Content-Length` header တန်ဖိုးနဲ့ မကိုက်ညီရင် — `code:` [`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`][] နဲ့ ခွဲခြားသတ်မှတ်နိုင်တဲ့ `Error` တစ်ခု throw လုပ်ခံရပါလိမ့်မယ်။

### `response.uncork()`

[`writable.uncork()`][] ကို ကြည့်ပါ။

### `response.writableEnded`

* Type: {boolean}

[`response.end()`][] ကို ခေါ်ပြီးနောက်မှာ `true` ဖြစ်ပါတယ်။ ဒီ property က data တွေ flush ဖြစ်သွားလားဆိုတာကို မဖော်ပြပါဘူး — အဲဒါအတွက်တော့ [`response.writableFinished`][] ကို သုံးပါ။

### `response.writableFinished`

* Type: {boolean}

Data တွေ အားလုံးကို underlying system ဆီကို flush လုပ်ပြီးသွားရင် — [`'finish'`][] event ကို emit မလုပ်ခင် ချက်ချင်း — `true` ဖြစ်ပါတယ်။

### `response.write(chunk[, encoding][, callback])`

* `chunk` {string|Buffer|Uint8Array}
* `encoding` {string} **Default:** `'utf8'`
* `callback` {Function}
* Returns: {boolean}

ဒီ method ကို ခေါ်ပြီး — [`response.writeHead()`][] ကို မခေါ်ရသေးဘူးဆိုရင် — implicit header mode ဆီကို ပြောင်းပြီး — implicit headers တွေကို flush လုပ်ပါလိမ့်မယ်။

ဒါက response body ရဲ့ chunk တစ်ခုကို ပို့ပေးပါတယ်။ Body ရဲ့ ဆက်တိုက် အပိုင်းတွေကို ပေးပို့ဖို့ ဒီ method ကို အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။

`createServer` ထဲမှာ `rejectNonStandardBodyWrites` ကို `true` အဖြစ် သတ်မှတ်ထားရင် — request method သို့မဟုတ် response status က content ကို support မလုပ်တဲ့အခါ — body ထဲကို ရေးသားတာ ခွင့်မပြုပါဘူး။ HEAD request တစ်ခုအတွက် သို့မဟုတ် `204` (သို့) `304` response တစ်ခုရဲ့ အစိတ်အပိုင်းအနေနဲ့ body ကို ရေးသားဖို့ ကြိုးစားခဲ့ရင် — `ERR_HTTP_BODY_NOT_ALLOWED` ဆိုတဲ့ code ပါတဲ့ synchronous `Error` တစ်ခုကို throw လုပ်ပါတယ်။

`chunk` က string သို့မဟုတ် buffer တစ်ခု ဖြစ်နိုင်ပါတယ်။ `chunk` က string ဆိုရင် — ဒုတိယ parameter က ၎င်းကို byte stream အဖြစ် ဘယ်လို encode လုပ်မလဲဆိုတာကို သတ်မှတ်ပေးပါတယ်။ ဒီ data chunk ကို flush လုပ်ပြီးတဲ့အခါ `callback` ကို ခေါ်ပါလိမ့်မယ်။

ဒါက raw HTTP body ဖြစ်ပြီး — အသုံးပြုနိုင်တဲ့ အဆင့်မြင့် (higher-level) multi-part body encodings တွေနဲ့ ဘာမှ မဆိုင်ပါဘူး။

[`response.write()`][] ကို ပထမဆုံး အကြိမ် ခေါ်တဲ့အခါ — buffer လုပ်ထားတဲ့ header information နဲ့ body ရဲ့ ပထမဆုံး chunk ကို client ဆီကို ပို့ပေးပါလိမ့်မယ်။ [`response.write()`][] ကို ဒုတိယအကြိမ် ခေါ်တဲ့အခါမှာတော့ — Node.js က data တွေကို stream လုပ်မယ်လို့ ယူဆပြီး — data အသစ်ကို သီးခြားစီ ပို့ပေးပါတယ်။ ဆိုလိုတာက — response ကို body ရဲ့ ပထမဆုံး chunk အထိပဲ buffer လုပ်ပါတယ်။

Data တစ်ခုလုံးကို kernel buffer ဆီကို အောင်မြင်စွာ flush လုပ်နိုင်ခဲ့ရင် `true` ကို ပြန်ပေးပါတယ်။ Data တစ်ခုလုံး သို့မဟုတ် တစ်စိတ်တစ်ပိုင်းက user memory ထဲမှာ queue လုပ်ခံထားရရင် `false` ကို ပြန်ပေးပါတယ်။ Buffer က ပြန်လွတ်သွားတဲ့အခါ `'drain'` ကို emit လုပ်ပါလိမ့်မယ်။

### `response.writeContinue()`

Request body ကို ပို့သင့်ကြောင်း ဖော်ပြတဲ့ HTTP/1.1 100 Continue message တစ်ခုကို client ဆီကို ပို့ပေးပါတယ်။ `Server` ပေါ်က [`'checkContinue'`][] event ကို ကြည့်ပါ။

### `response.writeEarlyHints(hints[, callback])`

* `hints` {Object}
* `callback` {Function}

Link header တစ်ခု ပါဝင်တဲ့ HTTP/1.1 103 Early Hints message တစ်ခုကို client ဆီကို ပို့ပေးပြီး — user agent က linked resources တွေကို preload/preconnect လုပ်နိုင်ကြောင်း ဖော်ပြပါတယ်။ `hints` က early hints message နဲ့အတူ ပို့ပေးရမယ့် headers တွေရဲ့ တန်ဖိုးတွေ ပါဝင်တဲ့ object တစ်ခုပါ။ Optional ဖြစ်တဲ့ `callback` argument ကို response message ရေးသားပြီးသွားတဲ့အခါ ခေါ်ပါလိမ့်မယ်။

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
  'x-trace-id': 'id for diagnostics',
});

const earlyHintsCallback = () => console.log('early hints message sent');
response.writeEarlyHints({
  'link': earlyHintsLinks,
}, earlyHintsCallback);
```

### `response.writeHead(statusCode[, statusMessage][, headers])`

* `statusCode` {number}
* `statusMessage` {string}
* `headers` {Object|Array}
* Returns: {http.ServerResponse}

Request ဆီကို response header တစ်ခု ပို့ပေးပါတယ်။ Status code က `404` လိုမျိုး ဂဏန်း ၃ လုံးပါတဲ့ HTTP status code တစ်ခုပါ။ နောက်ဆုံး argument ဖြစ်တဲ့ `headers` ကတော့ response headers တွေပါ။ ဆန္ဒရှိရင် လူဖတ်လို့ရတဲ့ (human-readable) `statusMessage` တစ်ခုကို ဒုတိယ argument အဖြစ် ပေးနိုင်ပါတယ်။

`headers` က — keys နဲ့ values တွေ တစ်တန်းတည်းမှာ ပါဝင်တဲ့ — `Array` တစ်ခု ဖြစ်နိုင်ပါတယ်။ ၎င်းက tuples တွေရဲ့ စာရင်း _မဟုတ်ပါဘူး_။ ဒါကြောင့် — စုံကိန်း (even-numbered) နေရာတွေက key values တွေ ဖြစ်ပြီး — မ ကိန်း (odd-numbered) နေရာတွေကတော့ ဆက်စပ်နေတဲ့ values တွေ ဖြစ်ပါတယ်။ ဒီ array က `request.rawHeaders` နဲ့ ပုံစံတူပါတယ်။

Calls တွေ chain လုပ်နိုင်အောင် `ServerResponse` ဆီကို ရည်ညွှန်းချက်တစ်ခု ပြန်ပေးပါတယ်။

```js
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body);
```

ဒီ method ကို message တစ်ခုပေါ်မှာ တစ်ကြိမ်သာ ခေါ်ရမှာ ဖြစ်ပြီး — [`response.end()`][] ကို မခေါ်ခင် ခေါ်ပေးရပါမယ်။

ဒါကို မခေါ်ခင် [`response.write()`][] (သို့) [`response.end()`][] ကို ခေါ်ပြီးသားဆိုရင် — implicit/mutable headers တွေကို တွက်ချက်ပြီး — ဒီ function ကို ခေါ်ပါလိမ့်မယ်။

[`response.setHeader()`][] နဲ့ headers တွေ သတ်မှတ်ပြီးသားဆိုရင် — ၎င်းတို့ကို [`response.writeHead()`][] ဆီကို ဖြတ်သန်းလိုက်တဲ့ headers တွေနဲ့ ပေါင်းစပ်လိုက်ပြီး — [`response.writeHead()`][] ဆီကို ဖြတ်သန်းလိုက်တဲ့ headers တွေက ဦးစားပေး ရရှိပါတယ်။

ဒီ method ကို ခေါ်ပြီး — [`response.setHeader()`][] ကို မခေါ်ရသေးဘူးဆိုရင် — ပေးထားတဲ့ header values တွေကို အတွင်းပိုင်း caching မလုပ်ပဲ — network channel ပေါ်ကို တိုက်ရိုက် ရေးသားလိုက်ပြီး — အဲဒီ header ပေါ်မှာ [`response.getHeader()`][] ကို ခေါ်ရင် မျှော်လင့်ထားတဲ့ ရလဒ် ထွက်လာမှာ မဟုတ်ပါဘူး။ Headers တွေကို နောက်ပိုင်းမှာ ပြန်လည်ရယူခြင်းနဲ့ ပြုပြင်ခြင်း အတွက် အလားအလာ ရှိတဲ့အနေနဲ့ — တဖြည်းဖြည်း ဖြည့်တင်းချင်ရင်တော့ — [`response.setHeader()`][] ကို အစားထိုး သုံးပါ။

```js
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

`Content-Length` ကို characters အနေနဲ့ မဟုတ်ပဲ — bytes အနေနဲ့ ဖတ်ပါတယ်။ Body ရဲ့ အရှည်ကို bytes နဲ့ ဆုံးဖြတ်ဖို့ [`Buffer.byteLength()`][] ကို သုံးပါ။ Node.js က `Content-Length` နဲ့ — ပို့လွှတ်လိုက်တဲ့ body ရဲ့ အရှည် — ညီမျှမှု ရှိမရှိကို စစ်ဆေးပါလိမ့်မယ်။

Invalid characters ပါဝင်တဲ့ header field name သို့မဟုတ် value တစ်ခုကို သတ်မှတ်ဖို့ ကြိုးစားရင် — [`TypeError`][] တစ်ခု throw လုပ်ခံရပါလိမ့်မယ်။

### `response.writeInformation(statusCode[, headers][, callback])`

* `statusCode` {number} `100` နဲ့ `199` ကြား (နှစ်ဖက်လုံး အပါအဝင်) ရှိတဲ့ HTTP 1xx informational status code တစ်ခုပါ။ `101` (Switching Protocols) ကတော့ [`'upgrade'`][] event ကနေတစ်ဆင့်သာ ရနိုင်လို့ ချန်လှပ်ထားပါတယ်။
* `headers` {Object|Array} Informational response နဲ့အတူ ပို့ပေးဖို့ optional headers အစုတစ်ခုပါ။ [`response.writeHead()`][] က လက်ခံတဲ့ ပုံစံတွေအတိုင်းပဲ လက်ခံပါတယ်။
* `callback` {Function} Optional ဖြစ်ပြီး — message ကို socket ဆီကို ရေးသားပြီးတာနဲ့ ခေါ်ပါတယ်။

Client ဆီကို မည်သည့် (arbitrary) HTTP/1.1 1xx informational response မဆို ပို့ပေးနိုင်တဲ့ method ပါ။ ဒါက [`response.writeContinue()`][], [`response.writeProcessing()`][] နဲ့ [`response.writeEarlyHints()`][] တို့ရဲ့ ယေဘုယျ ညီမျှမှု (generic equivalent) တစ်ခု ဖြစ်ပြီး — နောက်ဆုံး (final) response မတိုင်ခင် အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။ Final response headers တွေကို ([`response.writeHead()`][] သို့မဟုတ် implicit header တစ်ခုကနေတစ်ဆင့်) ပို့ပြီးသွားတဲ့နောက်မှာ — ဒီ method ကို ခေါ်ရင် `ERR_HTTP_HEADERS_SENT` ကို throw လုပ်ပါတယ်။

Clients တွေက ဒီ responses တွေကို `http.ClientRequest` ပေါ်က [`'information'`][information event] event ကနေတစ်ဆင့် လက်ခံရရှိပါတယ်။

```js
response.writeInformation(110, { 'X-Progress': '50%' });
```

### `response.writeProcessing()`

Request body ကို ပို့သင့်ကြောင်း ဖော်ပြတဲ့ HTTP/1.1 102 Processing message တစ်ခုကို client ဆီကို ပို့ပေးပါတယ်။

## Class: `http.IncomingMessage`

* Extends: {stream.Readable}

`IncomingMessage` object တစ်ခုကို [`http.Server`][] (သို့) [`http.ClientRequest`][] က ဖန်တီးပြီး — [`'request'`][] နဲ့ [`'response'`][] events တွေဆီကို အသီးသီး ပထမဆုံး argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။ ၎င်းကို response status, headers နဲ့ data တွေကို ဝင်ရောက်ကြည့်ရှုဖို့ သုံးနိုင်ပါတယ်။

{stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ ၎င်းရဲ့ `socket` တန်ဖိုးနဲ့ မတူပဲ — `IncomingMessage` ကိုယ်တိုင်က {stream.Readable} ကို extend လုပ်ပြီး — keep-alive ဖြစ်တဲ့အခါ underlying socket ကို အကြိမ်များစွာ ပြန်သုံးနိုင်တာမို့ — incoming HTTP headers နဲ့ payload တွေကို parse လုပ်ပြီး emit လုပ်ဖို့ သီးခြား ဖန်တီးထားတာပါ။

### Event: `'aborted'`

> Stability: 0 - Deprecated. Listen for `'close'` event instead.

Request ကို abort လုပ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။

### Event: `'close'`

Request ပြီးစီးသွားတဲ့အခါ emit လုပ်ပါတယ်။

### `message.aborted`

> Stability: 0 - Deprecated. Check `message.destroyed` from {stream.Readable}.

* Type: {boolean}

Request ကို abort လုပ်ခဲ့ပြီးဆိုရင် — `message.aborted` property က `true` ဖြစ်ပါလိမ့်မယ်။

### `message.complete`

* Type: {boolean}

HTTP message တစ်ခုလုံး (complete) ကို လက်ခံရရှိပြီး — အောင်မြင်စွာ parse လုပ်နိုင်ခဲ့ရင် — `message.complete` property က `true` ဖြစ်ပါလိမ့်မယ်။

ဒီ property က — connection တစ်ခု အဆုံးသတ်ခံရခင် — client (သို့) server က message တစ်ခုကို အပြည့်အဝ ပို့လွှတ်ခဲ့လားဆိုတာကို ဆုံးဖြတ်ဖို့ နည်းလမ်းတစ်ခုအနေနဲ့ အထူး အသုံးဝင်ပါတယ်:

```js
const req = http.request({
  host: '127.0.0.1',
  port: 8080,
  method: 'POST',
}, (res) => {
  res.resume();
  res.on('end', () => {
    if (!res.complete)
      console.error(
        'The connection was terminated while the message was still being sent');
  });
});
```

### `message.connection`

> Stability: 0 - Deprecated. Use [`message.socket`][].

[`message.socket`][] အတွက် alias (အမည်တူ) တစ်ခုပါ။

### `message.destroy([error])`

* `error` {Error}
* Returns: {this}

`IncomingMessage` ကို လက်ခံရရှိခဲ့တဲ့ socket ပေါ်မှာ `destroy()` ကို ခေါ်ပါတယ်။ `error` ကို ပေးထားရင် — socket ပေါ်မှာ `'error'` event တစ်ခုကို emit လုပ်ပြီး — event ပေါ်က listeners တွေဆီကို `error` ကို argument အဖြစ် ဖြတ်သန်းပေးပါတယ်။

### `message.headers`

* Type: {Object}

Request/response headers object ပါ။

Header names နဲ့ values တွေရဲ့ key-value pairs တွေပါ။ Header names တွေကို lowercase ပြောင်းထားပါတယ်။

```js
// Prints something like:
//
// { 'user-agent': 'curl/7.22.0',
//   host: '127.0.0.1:8000',
//   accept: '*/*' }
console.log(request.headers);
```

Raw headers တွေထဲမှာ ထပ်နေတဲ့ (duplicate) headers တွေကို — header name ပေါ်မူတည်ပြီး — အောက်ပါ နည်းလမ်းတွေနဲ့ ကိုင်တွယ်ပါတယ်:

* `age`, `authorization`, `content-length`, `content-type`, `etag`, `expires`, `from`, `host`, `if-modified-since`, `if-unmodified-since`, `last-modified`, `location`, `max-forwards`, `proxy-authorization`, `referer`, `retry-after`, `server`, (သို့) `user-agent` တို့ရဲ့ duplicates တွေကို ပစ်ပယ်ပါတယ်။
  အပေါ်မှာ စာရင်းပြုထားတဲ့ headers တွေရဲ့ duplicate values တွေကို ပေါင်းစပ်ခွင့်ပြုချင်ရင် — [`http.request()`][] နဲ့ [`http.createServer()`][] တို့မှာ `joinDuplicateHeaders` option ကို သုံးပါ။ အသေးစိတ်ကို RFC 9110 Section 5.3 မှာ ကြည့်ပါ။
* `set-cookie` ကတော့ အမြဲတမ်း array တစ်ခုပါ။ Duplicates တွေကို အဲဒီ array ထဲကို ထည့်သွင်းပါတယ်။
* Duplicate `cookie` headers တွေအတွက်တော့ — values တွေကို `; ` နဲ့ အတူတူ ဆက်စပ်ပါတယ်။
* တခြား headers တွေ အားလုံးအတွက်တော့ — values တွေကို `, ` နဲ့ ဆက်စပ်ပါတယ်။

### `message.headersDistinct`

* Type: {Object}

[`message.headers`][] နဲ့ ဆင်တူပေမယ့် — join logic (ဆက်စပ်မှု ယန္တရား) မပါဝင်ပဲ — headers တွေကို တစ်ကြိမ်တည်းသာ လက်ခံရရှိခဲ့ရင်တောင် — values တွေက အမြဲတမ်း strings တွေရဲ့ arrays တွေ ဖြစ်ပါတယ်။

```js
// Prints something like:
//
// { 'user-agent': ['curl/7.22.0'],
//   host: ['127.0.0.1:8000'],
//   accept: ['*/*'] }
console.log(request.headersDistinct);
```

### `message.httpVersion`

* Type: {string}

Server request ဆိုရင် — client က ပို့လိုက်တဲ့ HTTP version ဖြစ်ပြီး — client response ဆိုရင်တော့ — ချိတ်ဆက်ထားတဲ့ server ရဲ့ HTTP version ပါ။
ဖြစ်နိုင်ခြေ အများဆုံးကတော့ `'1.1'` (သို့) `'1.0'` ပါ။

ထို့ပြင် — `message.httpVersionMajor` က ပထမ integer ဖြစ်ပြီး — `message.httpVersionMinor` ကတော့ ဒုတိယ integer ဖြစ်ပါတယ်။

### `message.method`

* Type: {string}

**[`http.Server`][] ကနေ ရရှိတဲ့ request တွေအတွက်မှသာ တရားဝင်ပါတယ်။**

Request method ကို string အနေနဲ့ ဖော်ပြပါတယ်။ ဖတ်ရုံသက်သက် (read only) ပါ။ ဥပမာတွေကတော့: `'GET'`, `'DELETE'` တို့ပါ။

### `message.rawHeaders`

* Type: {string\[]}

လက်ခံရရှိခဲ့တဲ့အတိုင်း အတိအကျ ရှိနေတဲ့ raw request/response headers စာရင်းပါ။

Keys နဲ့ values တွေ တစ်တန်းတည်းမှာ ရှိပါတယ်။ ၎င်းက tuples တွေရဲ့ စာရင်း _မဟုတ်ပါဘူး_။ ဒါကြောင့် — စုံကိန်း နေရာတွေက key values တွေ ဖြစ်ပြီး — မ ကိန်း နေရာတွေကတော့ ဆက်စပ်နေတဲ့ values တွေ ဖြစ်ပါတယ်။

Header names တွေကို lowercase ပြောင်းမထားပဲ — duplicates တွေကိုလည်း ပေါင်းစပ်မထားပါဘူး။

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

### `message.rawTrailers`

* Type: {string\[]}

လက်ခံရရှိခဲ့တဲ့အတိုင်း အတိအကျ ရှိနေတဲ့ raw request/response trailer keys နဲ့ values တွေပါ။ `'end'` event မှာမှသာ ဖြည့်တင်းပေးပါတယ်။

### `message.setTimeout(msecs[, callback])`

* `msecs` {number}
* `callback` {Function}
* Returns: {http.IncomingMessage}

`message.socket.setTimeout(msecs, callback)` ကို ခေါ်ပါတယ်။

### `message.signal`

* Type: {AbortSignal}

{AbortSignal} တစ်ခုပါ — message က ပြီးဆုံးခင် destroy လုပ်ခံရတဲ့အခါ သို့မဟုတ် — request ကို ကိုင်တွယ်တာ သို့မဟုတ် response ကို ဖတ်တာ ပြီးဆုံးခင် — ၎င်းရဲ့ underlying socket ပိတ်သွားတဲ့အခါ — abort လုပ်ပါတယ်။
ဒီ signal ကို ပထမဆုံး အကြိမ် ဝင်ရောက်သုံးစွဲတဲ့အခါမှသာ lazily (လိုအပ်မှသာ) ဖန်တီးပါတယ် — ဒီ property ကို ဘယ်တော့မှ မသုံးတဲ့ requests တွေအတွက် {AbortController} တစ်ခုကို ခွဲဝေပေးမှာ မဟုတ်ပါဘူး။

ဒါက — client တစ်ဦးက request အလယ်မှာ ပြတ်တောက်သွားတဲ့အခါ — database queries (သို့) `fetch` calls တွေလိုမျိုး — downstream asynchronous အလုပ်တွေကို ပယ်ဖျက်ဖို့အတွက် အသုံးဝင်ပါတယ်။

```mjs
import http from 'node:http';

http.createServer(async (req, res) => {
  try {
    const data = await fetch('https://example.com/api', { signal: req.signal });
    res.end(JSON.stringify(await data.json()));
  } catch (err) {
    if (err.name === 'AbortError') return;
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}).listen(3000);
```

```cjs
const http = require('node:http');

http.createServer(async (req, res) => {
  try {
    const data = await fetch('https://example.com/api', { signal: req.signal });
    res.end(JSON.stringify(await data.json()));
  } catch (err) {
    if (err.name === 'AbortError') return;
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}).listen(3000);
```

### `message.socket`

* Type: {stream.Duplex}

Connection နဲ့ ဆက်စပ်နေတဲ့ [`net.Socket`][] object ပါ။

HTTPS support နဲ့ ဆိုရင် — client ရဲ့ authentication အသေးစိတ်တွေကို ရယူဖို့ [`request.socket.getPeerCertificate()`][] ကို သုံးပါ။

User က {net.Socket} ကလွဲလို့ တခြား socket type တစ်ခုကို သတ်မှတ်ထားခြင်း မရှိ သို့မဟုတ် အတွင်းပိုင်းမှာ null လုပ်ထားခြင်း မရှိဘူးဆိုရင် — ဒီ property က {stream.Duplex} ရဲ့ subclass တစ်ခု ဖြစ်တဲ့ {net.Socket} class ရဲ့ instance တစ်ခု ဖြစ်တယ်ဆိုတာ အာမခံထားပါတယ်။

### `message.statusCode`

* Type: {number}

**[`http.ClientRequest`][] ကနေ ရရှိတဲ့ response တွေအတွက်မှသာ တရားဝင်ပါတယ်။**

ဂဏန်း ၃ လုံးပါတဲ့ HTTP response status code ပါ။ ဥပမာ — `404`။

### `message.statusMessage`

* Type: {string}

**[`http.ClientRequest`][] ကနေ ရရှိတဲ့ response တွေအတွက်မှသာ တရားဝင်ပါတယ်။**

HTTP response status message (reason phrase — အကြောင်းပြချက် စကားစု) ပါ။ ဥပမာ — `OK` (သို့) `Internal Server Error`။

### `message.trailers`

* Type: {Object}

Request/response trailers object ပါ။ `'end'` event မှာမှသာ ဖြည့်တင်းပေးပါတယ်။

### `message.trailersDistinct`

* Type: {Object}

[`message.trailers`][] နဲ့ ဆင်တူပေမယ့် — join logic မပါဝင်ပဲ — headers တွေကို တစ်ကြိမ်တည်းသာ လက်ခံရရှိခဲ့ရင်တောင် — values တွေက အမြဲတမ်း strings တွေရဲ့ arrays တွေ ဖြစ်ပါတယ်။
`'end'` event မှာမှသာ ဖြည့်တင်းပေးပါတယ်။

### `message.url`

* Type: {string}

**[`http.Server`][] ကနေ ရရှိတဲ့ request တွေအတွက်မှသာ တရားဝင်ပါတယ်။**

Request URL string ပါ။ ဒါက တကယ့် (actual) HTTP request ထဲမှာ ပါဝင်တဲ့ URL ကိုသာ ပါဝင်ပါတယ်။ အောက်ပါ request ကို ကြည့်ပါ:

```http
GET /status?name=ryan HTTP/1.1
Accept: text/plain
```

URL ကို ၎င်းရဲ့ အစိတ်အပိုင်းတွေအဖြစ် parse လုပ်ဖို့:

```js
new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
```

`request.url` က `'/status?name=ryan'` ဖြစ်ပြီး — `process.env.HOST` က undefined ဖြစ်နေတဲ့အခါ:

```console
$ node
> new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
URL {
  href: 'http://localhost/status?name=ryan',
  origin: 'http://localhost',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/status',
  search: '?name=ryan',
  searchParams: URLSearchParams { 'name' => 'ryan' },
  hash: ''
}
```

`process.env.HOST` ကို server ရဲ့ host name အဖြစ် သေချာပေး သတ်မှတ်ပါ — သို့မဟုတ် ဒီအပိုင်းကို လုံးဝ အစားထိုးဖို့ စဉ်းစားပါ။ `req.headers.host` ကို သုံးမယ်ဆိုရင် — clients တွေက စိတ်ကြိုက် `Host` header တစ်ခုကို သတ်မှတ်ပေးနိုင်တာမို့ — သင့်လျော်တဲ့ validation ကို သေချာ သုံးပါ။

## Class: `http.OutgoingMessage`

* Extends: {Stream}

ဒီ class က [`http.ClientRequest`][] နဲ့ [`http.ServerResponse`][] တို့ရဲ့ parent class အဖြစ် ဆောင်ရွက်ပါတယ်။ HTTP transaction တစ်ခုရဲ့ ပါဝင်ပတ်သက်သူတွေရဲ့ ရှုထောင့်ကနေ ကြည့်ရင် — ဒါက abstract (စိတ္တဇ) outgoing message တစ်ခုပါ။

### Event: `'drain'`

Message ရဲ့ buffer က ပြန်လွတ်သွားတဲ့အခါ emit လုပ်ပါတယ်။

### Event: `'finish'`

ပို့ဆောင်မှု (transmission) အောင်မြင်စွာ ပြီးဆုံးသွားတဲ့အခါ emit လုပ်ပါတယ်။

### Event: `'prefinish'`

`outgoingMessage.end()` ကို ခေါ်ပြီးနောက်မှာ emit လုပ်ပါတယ်။
ဒီ event ကို emit လုပ်တဲ့အခါ — data တွေ အားလုံးကို process လုပ်ပြီးသွားပေမယ့် — အပြည့်အဝ flush လုပ်ပြီးသား ဖြစ်ချင်မှ ဖြစ်ပါလိမ့်မယ်။

### `outgoingMessage.addTrailers(headers)`

* `headers` {Object}

HTTP trailers (message ရဲ့ အဆုံးမှာ ရှိတဲ့ headers မျိုး) တွေကို message ဆီကို ထပ်ဖြည့်ပေးပါတယ်။

Trailers တွေကို emit လုပ်ပေးမှာက — message ကို chunked encode လုပ်ထားတဲ့အခါမှသာ ဖြစ်ပါတယ်။ မဟုတ်ရင် — trailers တွေကို တိတ်တဆိတ် ပစ်ပယ်ခံရပါလိမ့်မယ်။

HTTP က trailers တွေ emit လုပ်ဖို့အတွက် — ၎င်းရဲ့ တန်ဖိုးထဲမှာ header field names တွေရဲ့ စာရင်း ပါဝင်တဲ့ — `Trailer` header ကို ပို့ပေးဖို့ လိုအပ်ပါတယ်။ ဥပမာ:

```js
message.writeHead(200, { 'Content-Type': 'text/plain',
                         'Trailer': 'Content-MD5' });
message.write(fileData);
message.addTrailers({ 'Content-MD5': '7895bf4b8828b55ceaf47747b4bca667' });
message.end();
```

Invalid characters ပါဝင်တဲ့ header field name သို့မဟုတ် value တစ်ခုကို သတ်မှတ်ဖို့ ကြိုးစားရင် — `TypeError` တစ်ခု throw လုပ်ခံရပါလိမ့်မယ်။

### `outgoingMessage.appendHeader(name, value)`

* `name` {string} Header ၏ name ပါ
* `value` {string|string\[]} Header ၏ value ပါ
* Returns: {this}

Header object ဆီကို header value တစ်ခုတည်းကို ထပ်ဖြည့်ပေးပါတယ်။

Value က array တစ်ခုဆိုရင် — ဒီ method ကို အကြိမ်များစွာ ခေါ်တာနဲ့ ညီမျှပါတယ်။

ဒီ header အတွက် အရင်က values တွေ မရှိခဲ့ဘူးဆိုရင် — [`outgoingMessage.setHeader(name, value)`][] ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

Client request (သို့) server ကို ဖန်တီးတဲ့အခါက `options.uniqueHeaders` ရဲ့ တန်ဖိုးပေါ်မူတည်ပြီး — ဒါက header ကို အကြိမ်များစွာ ပို့ပေးတာ သို့မဟုတ် — values တွေကို `; ` နဲ့ ဆက်စပ်ပြီး တစ်ကြိမ်တည်း ပို့ပေးတာ — ဆိုတဲ့ ရလဒ်တွေထဲက တစ်ခုခုနဲ့ အဆုံးသတ်ပါလိမ့်မယ်။

### `outgoingMessage.connection`

> Stability: 0 - Deprecated: Use [`outgoingMessage.socket`][] instead.

[`outgoingMessage.socket`][] ၏ alias (အမည်တူ) တစ်ခုပါ။

### `outgoingMessage.cork()`

[`writable.cork()`][] ကို ကြည့်ပါ။

### `outgoingMessage.destroy([error])`

* `error` {Error} Optional — `error` event နဲ့ emit လုပ်ဖို့ error တစ်ခုပါ
* Returns: {this}

Message ကို destroy လုပ်ပါတယ်။ Message နဲ့ socket တစ်ခု ချိတ်ဆက်ပြီး — connect ဖြစ်သွားတာနဲ့ — အဲဒီ socket ကိုပါ destroy လုပ်ပါလိမ့်မယ်။

### `outgoingMessage.end(chunk[, encoding][, callback])`

* `chunk` {string|Buffer|Uint8Array}
* `encoding` {string} Optional — **Default**: `utf8`
* `callback` {Function} Optional
* Returns: {this}

Outgoing message ကို အဆုံးသတ်ပေးပါတယ်။ Body ရဲ့ မပို့ရသေးတဲ့ အပိုင်းတွေ ရှိနေရင် — ၎င်းတို့ကို underlying system ဆီကို flush လုပ်ပါလိမ့်မယ်။ Message က chunked ဖြစ်နေရင် — အဆုံးသတ်တဲ့ chunk `0\r\n\r\n` ကို ပို့ပေးပြီး — trailers တွေ (ရှိရင်) ကိုလည်း ပို့ပေးပါလိမ့်မယ်။

`chunk` ကို သတ်မှတ်ပေးထားရင် — `outgoingMessage.write(chunk, encoding)` ကို ခေါ်ပြီးနောက် — `outgoingMessage.end(callback)` ကို ခေါ်တာနဲ့ ညီမျှပါတယ်။

`callback` ကို ပေးထားရင် — message ပြီးဆုံးသွားတဲ့အခါ ၎င်းကို ခေါ်ပါလိမ့်မယ် (`'finish'` event ရဲ့ listener တစ်ခုနဲ့ ညီမျှပါတယ်)။

### `outgoingMessage.flushHeaders()`

Message headers တွေကို flush လုပ်ပါတယ်။

စွမ်းဆောင်ရည် (efficiency) အကြောင်းပြချက်တွေကြောင့် — Node.js က `outgoingMessage.end()` ကို ခေါ်တဲ့အထိ သို့မဟုတ် message data ရဲ့ ပထမဆုံး chunk ကို ရေးသားတဲ့အထိ — message headers တွေကို ပုံမှန်အားဖြင့် buffer လုပ်ထားပါတယ်။ အဲဒီနောက်မှာ headers နဲ့ data တွေကို TCP packet တစ်ခုတည်းထဲမှာ ထည့်သွင်း စုစည်းဖို့ ကြိုးစားပါတယ်။

ဒါက ပုံမှန်အားဖြင့် လိုချင်စရာပါ (TCP round-trip တစ်ခုကို သက်သာစေလို့) — ဒါပေမယ့် — ပထမဆုံး data ကို နောက်ကျမှသာ ပို့မယ့် အခြေအနေမျိုးမှာတော့ မလိုချင်ပါဘူး။ `outgoingMessage.flushHeaders()` က ဒီ optimization ကို ကျော်လွှားပြီး — message ကို စတင်လှုပ်ရှားစေပါတယ် (kickstarts)။

### `outgoingMessage.getHeader(name)`

* `name` {string} Header ၏ name ပါ
* Returns: {number | string | string\[] | undefined}

ပေးထားတဲ့ name ရှိတဲ့ HTTP header ရဲ့ တန်ဖိုးကို ရယူပေးပါတယ်။ အဲဒီ header ကို သတ်မှတ်မထားဘူးဆိုရင် — ပြန်ပေးလိုက်တဲ့ တန်ဖိုးက `undefined` ဖြစ်ပါလိမ့်မယ်။

### `outgoingMessage.getHeaderNames()`

* Returns: {string\[]}

လက်ရှိ outgoing headers တွေရဲ့ ထပ်မနေတဲ့ names တွေ ပါဝင်တဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ Names တွေ အားလုံးက lowercase ပါ။

### `outgoingMessage.getHeaders()`

* Returns: {Object}

လက်ရှိ outgoing headers တွေရဲ့ shallow copy တစ်ခုကို ပြန်ပေးပါတယ်။ Shallow copy ကို သုံးထားတာမို့ — http module ရဲ့ header နဲ့ ဆက်စပ်တဲ့ method တွေကို နောက်ထပ် မခေါ်ပဲ — array values တွေကို ပြုပြင်လို့ ရနိုင်ပါတယ်။ ပြန်ပေးလိုက်တဲ့ object ရဲ့ keys တွေက header names တွေ ဖြစ်ပြီး — values တွေကတော့ သက်ဆိုင်ရာ header values တွေ ဖြစ်ပါတယ်။ Header names တွေ အားလုံးက lowercase ပါ။

`outgoingMessage.getHeaders()` method က ပြန်ပေးတဲ့ object က JavaScript `Object` ကနေ prototypically ဆက်ခံ လုပ်ထားတာ မဟုတ်ပါဘူး။ ဒါကြောင့် `obj.toString()`, `obj.hasOwnProperty()` စတဲ့ ပုံမှန် `Object` methods တွေက define လုပ်ထားခြင်း မရှိပဲ — အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။

```js
outgoingMessage.setHeader('Foo', 'bar');
outgoingMessage.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = outgoingMessage.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```

### `outgoingMessage.hasHeader(name)`

* `name` {string}
* Returns: {boolean}

`name` နဲ့ ခွဲခြားသတ်မှတ်ထားတဲ့ header က outgoing headers တွေထဲမှာ လက်ရှိ သတ်မှတ်ထားရင် `true` ကို ပြန်ပေးပါတယ်။ Header name ကို ကိုက်ညီစစ်ဆေးတာက case-insensitive ပါ။

```js
const hasContentType = outgoingMessage.hasHeader('content-type');
```

### `outgoingMessage.headersSent`

* Type: {boolean}

Read-only ပါ။ Headers တွေ ပို့လိုက်ပြီးဆိုရင် `true` — မဟုတ်ရင် `false` ပါ။

### `outgoingMessage.pipe()`

`http.OutgoingMessage` ရဲ့ parent class ဖြစ်တဲ့ — ရှေးဟောင်း (legacy) `Stream` class ကနေ အမွေဆက်ခံရရှိထားတဲ့ `stream.pipe()` method ကို override လုပ်ပါတယ်။

`outgoingMessage` က write-only stream တစ်ခု ဖြစ်တာမို့ — ဒီ method ကို ခေါ်ရင် `Error` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### `outgoingMessage.removeHeader(name)`

* `name` {string} Header ၏ name ပါ

Implicit ပို့ဆောင်မှုအတွက် queue လုပ်ထားတဲ့ header တစ်ခုကို ဖယ်ရှားပါတယ်။

```js
outgoingMessage.removeHeader('Content-Encoding');
```

### `outgoingMessage.setHeader(name, value)`

* `name` {string} Header ၏ name ပါ
* `value` {number | string | string\[]} Header ၏ value ပါ
* Returns: {this}

Header value တစ်ခုတည်းကို သတ်မှတ်ပေးပါတယ်။ ဒီ header က ပို့တော့မယ့် headers တွေထဲမှာ ရှိပြီးသားဆိုရင် — ၎င်းရဲ့ value ကို အစားထိုးလိုက်ပါလိမ့်မယ်။ နာမည်တူတဲ့ headers အများအပြား ပို့ဖို့ strings တွေရဲ့ array တစ်ခုကို သုံးပါ။

### `outgoingMessage.setHeaders(headers)`

* `headers` {Headers|Map}
* Returns: {this}

Implicit headers တွေအတွက် header values အများအပြားကို သတ်မှတ်ပေးပါတယ်။
`headers` က [`Headers`][] (သို့) `Map` ရဲ့ instance တစ်ခု ဖြစ်ရပါမယ်။
Header တစ်ခုက ပို့တော့မယ့် headers တွေထဲမှာ ရှိပြီးသားဆိုရင် — ၎င်းရဲ့ value ကို အစားထိုးလိုက်ပါလိမ့်မယ်။

```js
const headers = new Headers({ foo: 'bar' });
outgoingMessage.setHeaders(headers);
```

သို့မဟုတ်

```js
const headers = new Map([['foo', 'bar']]);
outgoingMessage.setHeaders(headers);
```

[`outgoingMessage.setHeaders()`][] နဲ့ headers တွေ သတ်မှတ်ပြီးသားဆိုရင် — ၎င်းတို့ကို [`response.writeHead()`][] ဆီကို ဖြတ်သန်းလိုက်တဲ့ headers တွေနဲ့ ပေါင်းစပ်လိုက်ပြီး — [`response.writeHead()`][] ဆီကို ဖြတ်သန်းလိုက်တဲ့ headers တွေက ဦးစားပေး ရရှိပါတယ်။

```js
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  const headers = new Headers({ 'Content-Type': 'text/html' });
  res.setHeaders(headers);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

### `outgoingMessage.setTimeout(msecs[, callback])`

* `msecs` {number}
* `callback` {Function} Optional — timeout ဖြစ်ပေါ်တဲ့အခါ ခေါ်ယူရမယ့် function ပါ။ `timeout` event ကို ချိတ်ဆွဲတာနဲ့ အတူတူပါ။
* Returns: {this}

Message နဲ့ socket တစ်ခု ချိတ်ဆက်ပြီး — connect ဖြစ်သွားတာနဲ့ — `msecs` ကို ပထမဆုံး parameter အဖြစ်ထည့်ပြီး [`socket.setTimeout()`][] ကို ခေါ်ပါလိမ့်မယ်။

### `outgoingMessage.socket`

* Type: {stream.Duplex}

Underlying socket ဆီကို ရည်ညွှန်းချက်တစ်ခုပါ။ ပုံမှန်အားဖြင့် — users တွေက ဒီ property ကို ဝင်ရောက်သုံးစွဲချင် မှာ မဟုတ်ပါဘူး။

`outgoingMessage.end()` ကို ခေါ်ပြီးနောက်မှာ ဒီ property ကို null လုပ်ပစ်ပါလိမ့်မယ်။

### `outgoingMessage.uncork()`

[`writable.uncork()`][] ကို ကြည့်ပါ။

### `outgoingMessage.writableCorked`

* Type: {number}

`outgoingMessage.cork()` ကို ခေါ်ထားတဲ့ အကြိမ်အရေအတွက်ပါ။

### `outgoingMessage.writableEnded`

* Type: {boolean}

`outgoingMessage.end()` ကို ခေါ်ပြီးဆိုရင် `true` ဖြစ်ပါတယ်။ ဒီ property က data တွေ flush ဖြစ်သွားလားဆိုတာကို မဖော်ပြပါဘူး။ အဲဒီရည်ရွယ်ချက်အတွက်တော့ — `message.writableFinished` ကို အစားထိုး သုံးပါ။

### `outgoingMessage.writableFinished`

* Type: {boolean}

Data တွေ အားလုံးကို underlying system ဆီကို flush လုပ်ပြီးသွားရင် `true` ဖြစ်ပါတယ်။

### `outgoingMessage.writableHighWaterMark`

* Type: {number}

သတ်မှတ်ပေးထားရင် — underlying socket ရဲ့ `highWaterMark` ပါ။ မဟုတ်ရင် — [`writable.write()`][] က `false` စတင် ပြန်ပေးတဲ့အခါက default buffer level (`16384`) ဖြစ်ပါတယ်။

### `outgoingMessage.writableLength`

* Type: {number}

Buffer လုပ်ထားတဲ့ bytes အရေအတွက်ပါ။

### `outgoingMessage.writableObjectMode`

* Type: {boolean}

အမြဲတမ်း `false` ပါ။

### `outgoingMessage.write(chunk[, encoding][, callback])`

* `chunk` {string|Buffer|Uint8Array}
* `encoding` {string} **Default**: `utf8`
* `callback` {Function}
* Returns: {boolean}

Body ရဲ့ chunk တစ်ခုကို ပို့ပေးပါတယ်။ ဒီ method ကို အကြိမ်များစွာ ခေါ်နိုင်ပါတယ်။

`encoding` argument က `chunk` string တစ်ခု ဖြစ်တဲ့အခါမှသာ သက်ဆိုင်ပါတယ်။ Default က `'utf8'` ပါ။

`callback` argument က optional ဖြစ်ပြီး — ဒီ data chunk ကို flush လုပ်ပြီးတဲ့အခါ ခေါ်ပါလိမ့်မယ်။

Data တစ်ခုလုံးကို kernel buffer ဆီကို အောင်မြင်စွာ flush လုပ်နိုင်ခဲ့ရင် `true` ကို ပြန်ပေးပါတယ်။ Data တစ်ခုလုံး သို့မဟုတ် တစ်စိတ်တစ်ပိုင်းက user memory ထဲမှာ queue လုပ်ခံထားရရင် `false` ကို ပြန်ပေးပါတယ်။ Buffer က ပြန်လွတ်သွားတဲ့အခါ `'drain'` event ကို emit လုပ်ပါလိမ့်မယ်။

## `http.METHODS`

* Type: {string\[]}

Parser က support လုပ်တဲ့ HTTP methods တွေရဲ့ စာရင်းပါ။

## `http.STATUS_CODES`

* Type: {Object}

Standard HTTP response status codes တွေ အားလုံးနဲ့ — တစ်ခုချင်းစီရဲ့ တိုတောင်းတဲ့ ဖော်ပြချက်တွေ ပါဝင်တဲ့ collection တစ်ခုပါ။ ဥပမာ — `http.STATUS_CODES[404] === 'Not Found'` ပါ။

## `http.createServer([options][, requestListener])`

* `options` {Object}
  * `connectionsCheckingInterval`: မပြည့်စုံတဲ့ (incomplete) requests တွေထဲမှာ request နဲ့ headers timeout တွေကို စစ်ဆေးဖို့ interval တန်ဖိုးကို millisecond နဲ့ သတ်မှတ်ပေးပါတယ်။
    **Default:** `30000`။
  * `headersTimeout`: Client ဆီကနေ HTTP headers တွေ အပြည့်အဝ လက်ခံရရှိဖို့ timeout တန်ဖိုးကို millisecond နဲ့ သတ်မှတ်ပေးပါတယ်။
    ထပ်ဆောင်း အချက်အလက်အတွက် [`server.headersTimeout`][] ကို ကြည့်ပါ။
    **Default:** `60000`။
  * `highWaterMark` {number} Option အနေနဲ့ — `socket` တွေ အားလုံးရဲ့ `readableHighWaterMark` နဲ့ `writableHighWaterMark` တွေကို override လုပ်ပေးနိုင်ပါတယ်။ ဒါက `IncomingMessage` ရော `ServerResponse` ပါ နှစ်ခုလုံးရဲ့ `highWaterMark` property ကို သက်ရောက်ပါတယ်။
    **Default:** [`stream.getDefaultHighWaterMark()`][] ကို ကြည့်ပါ။
  * `httpValidation` {string} Incoming requests တွေအတွက် HTTP header value validation ရဲ့ တင်းကျပ်မှု (strictness) ကို ထိန်းချုပ်ပါတယ်။ လက်ခံနိုင်တဲ့ တန်ဖိုးတွေကတော့:
    * `'strict'`: အပြင်းထဆုံး validation ပါ — header values တွေထဲမှာ non-ASCII (သို့) control characters တွေ ပါနေရင် ငြင်းပယ်ပါတယ်။
    * `'relaxed'`: Header values တွေထဲမှာ ကန့်သတ်ထားတဲ့ non-ASCII characters အစုတစ်ခုကို ခွင့်ပြုပြီး — [Fetch specification](https://fetch.spec.whatwg.org/) နဲ့ လိုက်လျောညီထွေ ဖြစ်စေပါတယ်။
    * `'insecure'`: Header value validation အားလုံးကို ပိတ်ပေးပါတယ် (`insecureHTTPParser: true` နဲ့ ညီမျှပါတယ်)။
      `insecureHTTPParser` နဲ့အတူတူ သုံးလို့ မရပါဘူး။ **Default:** `'strict'`.
  * `insecureHTTPParser` {boolean} `true` လို့ သတ်မှတ်ထားရင် — leniency flags (ဖြေလျှော့မှု အလံများ) ဖွင့်ထားတဲ့ HTTP parser တစ်ခုကို သုံးပါလိမ့်မယ်။ Insecure parser ကို သုံးတာကို ရှောင်ရှားသင့်ပါတယ်။
    ထပ်ဆောင်း အချက်အလက်အတွက် [`--insecure-http-parser`][] ကို ကြည့်ပါ။
    **Default:** `false`။
  * `IncomingMessage` {http.IncomingMessage} သုံးစွဲရမယ့် `IncomingMessage` class ကို သတ်မှတ်ပေးပါတယ်။ မူရင်း `IncomingMessage` ကို extend လုပ်ဖို့အတွက် အသုံးဝင်ပါတယ်။
    **Default:** `IncomingMessage`။
  * `joinDuplicateHeaders` {boolean} `true` လို့ သတ်မှတ်ထားရင် — ဒီ option က request တစ်ခုထဲက headers အများအပြားရဲ့ field line values တွေကို — duplicates တွေကို ပစ်ပယ်မယ့်အစား — comma (`, `) တစ်ခုနဲ့ ဆက်စပ်ခွင့်ပြုပါတယ်။
    ထပ်ဆောင်း အချက်အလက်အတွက် [`message.headers`][] ကို ကိုးကားပါ။
    **Default:** `false`။
  * `keepAlive` {boolean} `true` လို့ သတ်မှတ်ထားရင် — incoming connection အသစ်တစ်ခုကို လက်ခံရရှိတာနဲ့ ချက်ချင်း — socket ပေါ်မှာ keep-alive လုပ်ဆောင်ချက်ကို ဖွင့်ပေးပါတယ် — [`socket.setKeepAlive()`][] မှာ လုပ်ထားသလိုပါပဲ။
    **Default:** `false`။
  * `keepAliveInitialDelay` {number} Positive ဂဏန်းတစ်ခု သတ်မှတ်ထားရင် — idle socket တစ်ခုပေါ်မှာ ပထမဆုံး keepalive probe ကို မပို့ခင် ကနဦး နှောင့်နှေးချိန် (initial delay) ကို သတ်မှတ်ပေးပါတယ်။
    **Default:** `0`။
  * `keepAliveTimeout`: Server က နောက်ဆုံး response ကို ရေးသားပြီးသွားပြီးနောက် — socket တစ်ခု မဖျက်ဆီးခံရခင် — နောက်ထပ် incoming data တွေအတွက် စောင့်ဆိုင်းရမယ့် လှုပ်ရှားမှုမရှိတဲ့ millisecond အရေအတွက်ပါ။
    ထပ်ဆောင်း အချက်အလက်အတွက် [`server.keepAliveTimeout`][] ကို ကြည့်ပါ။
    **Default:** `65000`။
  * `maxHeaderSize` {number} ဒီ server က လက်ခံရရှိတဲ့ requests တွေအတွက် — [`--max-http-header-size`][] ရဲ့ တန်ဖိုးကို Option အနေနဲ့ override လုပ်ပေးနိုင်ပါတယ် — ဆိုလိုတာက request headers တွေရဲ့ အများဆုံး အရှည်ကို bytes နဲ့ ဖြစ်ပါတယ်။
    **Default:** 16384 (16 KiB)။
  * `noDelay` {boolean} `true` လို့ သတ်မှတ်ထားရင် — incoming connection အသစ်တစ်ခု လက်ခံရရှိတာနဲ့ ချက်ချင်း — Nagle's algorithm ကို သုံးစွဲတာကို ပိတ်ပေးပါတယ်။
    **Default:** `true`။
  * `requestTimeout`: Client ဆီကနေ request တစ်ခုလုံးကို လက်ခံရရှိဖို့ timeout တန်ဖိုးကို millisecond နဲ့ သတ်မှတ်ပေးပါတယ်။
    ထပ်ဆောင်း အချက်အလက်အတွက် [`server.requestTimeout`][] ကို ကြည့်ပါ။
    **Default:** `300000`။
  * `requireHostHeader` {boolean} `true` လို့ သတ်မှတ်ထားရင် — Host header မပါဝင်တဲ့ HTTP/1.1 request message တိုင်းကို — (specification က ပြဌာန်းထားတဲ့အတိုင်း) — server က 400 (Bad Request) status code နဲ့ တုံ့ပြန်ဖို့ တွန်းအားပေးပါတယ်။
    **Default:** `true`။
  * `ServerResponse` {http.ServerResponse} သုံးစွဲရမယ့် `ServerResponse` class ကို သတ်မှတ်ပေးပါတယ်။ မူရင်း `ServerResponse` ကို extend လုပ်ဖို့အတွက် အသုံးဝင်ပါတယ်။ **Default:**
    `ServerResponse`။
  * `shouldUpgradeCallback(request)` {Function} Incoming request တစ်ခုကို လက်ခံပြီး — boolean တစ်ခု ပြန်ပေးတဲ့ callback တစ်ခုပါ — upgrade ကြိုးစားမှု (attempt) တွေထဲက ဘယ်ဟာတွေကို လက်ခံသင့်လဲဆိုတာကို ထိန်းချုပ်ဖို့ ဖြစ်ပါတယ်။ လက်ခံလိုက်တဲ့ upgrades တွေက `'upgrade'` event တစ်ခုကို fire လုပ်ပါလိမ့်မယ် (listener မှတ်ပုံတင်ထားခြင်း မရှိရင်တော့ — ၎င်းတို့ရဲ့ sockets တွေကို destroy လုပ်ပါလိမ့်မယ်) — ငြင်းပယ်ခံလိုက်တဲ့ upgrades တွေကတော့ — upgrade မဟုတ်တဲ့ request တစ်ခုလိုပဲ — `'request'` event တစ်ခုကို fire လုပ်ပါလိမ့်မယ်။ ဒီ option ရဲ့ default က
    `() => server.listenerCount('upgrade') > 0`။
  * `uniqueHeaders` {Array} တစ်ကြိမ်တည်းသာ ပို့ပေးသင့်တဲ့ response headers တွေရဲ့ စာရင်းပါ။ Header ရဲ့ တန်ဖိုးက array တစ်ခုဆိုရင် — items တွေကို `; ` သုံးပြီး ဆက်စပ်ပါလိမ့်မယ်။
  * `rejectNonStandardBodyWrites` {boolean} `true` လို့ သတ်မှတ်ထားရင် — body မပါဝင်တဲ့ HTTP response တစ်ခုဆီကို ရေးသားတဲ့အခါ error တစ်ခုကို throw လုပ်ပါတယ်။
    **Default:** `false`။
  * `optimizeEmptyRequests` {boolean} `true` လို့ သတ်မှတ်ထားရင် — `Content-Length` (သို့) `Transfer-Encoding` headers တွေ မပါဝင်တဲ့ (body မရှိကြောင်း ဖော်ပြတဲ့) requests တွေကို — ပြီးဆုံးသွားပြီးသား body stream တစ်ခုနဲ့ စတင် initialize လုပ်ပါလိမ့်မယ် — ဒါကြောင့် ၎င်းတို့က stream events တွေ (`'data'` (သို့) `'end'` လိုမျိုး) ကို ဘယ်တော့မှ emit လုပ်မှာ မဟုတ်ပါဘူး။ ဒီအခြေအနေကို သိရှိဖို့ `req.readableEnded` ကို သုံးနိုင်ပါတယ်။
    **Default:** `false`။

* `requestListener` {Function}

* Returns: {http.Server}

[`http.Server`][] ၏ instance အသစ်တစ်ခုကို ပြန်ပေးပါတယ်။

`requestListener` က [`'request'`][] event ပေါ်ကို အလိုအလျောက် ထည့်သွင်းပေးတဲ့ function တစ်ခုပါ။

```mjs
import http from 'node:http';

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```cjs
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```mjs
import http from 'node:http';

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

```cjs
const http = require('node:http');

// Create a local server to receive data from
const server = http.createServer();

// Listen to the request event
server.on('request', (request, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

## `http.get(options[, callback])`

## `http.get(url[, options][, callback])`

* `url` {string | URL}
* `options` {Object} [`http.request()`][] က လက်ခံတဲ့ `options` တွေအတိုင်း လက်ခံပြီး — method ကို default အနေနဲ့ GET အဖြစ် သတ်မှတ်ပေးပါတယ်။
* `callback` {Function}
* Returns: {http.ClientRequest}

Requests အများစုက body မပါတဲ့ GET requests တွေ ဖြစ်တာမို့ — Node.js က ဒီအဆင်ပြေတဲ့ (convenience) method ကို ပေးထားပါတယ်။ ဒီ method နဲ့ [`http.request()`][] ကြားက တစ်ခုတည်းသော ကွာခြားချက်က — method ကို default အနေနဲ့ GET အဖြစ် သတ်မှတ်ပြီး — `req.end()` ကို အလိုအလျောက် ခေါ်ပေးတာ ဖြစ်ပါတယ်။ [`http.ClientRequest`][] section မှာ ဖော်ပြထားတဲ့ အကြောင်းပြချက်တွေကြောင့် — callback က response data တွေကို စားသုံး (consume) ဖို့ ဂရုစိုက်ပေးရပါမယ်။

`callback` ကို — [`http.IncomingMessage`][] ရဲ့ instance တစ်ခု ဖြစ်တဲ့ — argument တစ်ခုတည်းနဲ့ ခေါ်ပါတယ်။

JSON ရယူခြင်း (fetching) ဥပမာ:

```js
http.get('http://localhost:8000/', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  // Any 2xx status code signals a successful response but
  // here we're only checking for 200.
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

server.listen(8000);
```

## `http.globalAgent`

* Type: {http.Agent}

HTTP client requests တွေ အားလုံးအတွက် default အဖြစ် သုံးစွဲတဲ့ `Agent` ရဲ့ global instance တစ်ခုပါ။ `keepAlive` ဖွင့်ထားပြီး — `timeout` က 5 စက္ကန့် ရှိတာကြောင့် — default `Agent` configuration နဲ့ ကွဲပြားပါတယ်။
## `http.maxHeaderSize`

* Type: {number}

HTTP headers တွေရဲ့ bytes အနေနဲ့ ခွင့်ပြုထားတဲ့ အများဆုံး အရွယ်အစားကို သတ်မှတ်ပေးတဲ့ read-only property တစ်ခုပါ။ Default က 16 KiB ဖြစ်ပါတယ်။ [`--max-http-header-size`][] CLI option ကို သုံးပြီး configure လုပ်နိုင်ပါတယ်။

ဒါကို servers တွေနဲ့ client requests တွေအတွက် — `maxHeaderSize` option ကို ဖြတ်သန်းပေးခြင်းအားဖြင့် — override လုပ်နိုင်ပါတယ်။

## `http.request(options[, callback])`

## `http.request(url[, options][, callback])`

* `url` {string | URL}
* `options` {Object}
  * `agent` {http.Agent | boolean} [`Agent`][] ၏ အပြုအမူကို ထိန်းချုပ်ပါတယ်။ ဖြစ်နိုင်တဲ့ တန်ဖိုးတွေကတော့:
    * `undefined` (default): ဒီ host နဲ့ port အတွက် [`http.globalAgent`][] ကို သုံးပါတယ်။
    * `Agent` object: ဖြတ်သန်းပေးလိုက်တဲ့ `Agent` ကို တိုက်ရိုက် (explicitly) သုံးပါတယ်။
    * `false`: default တန်ဖိုးတွေနဲ့အတူ `Agent` အသစ်တစ်ခုကို သုံးစေပါတယ်။
  * `auth` {string} Authorization header တစ်ခုကို တွက်ချက်ဖို့ Basic authentication (`'user:password'`) ပါ။
  * `createConnection` {Function} `agent` option ကို မသုံးတဲ့အခါ request အတွက် သုံးမယ့် socket/stream တစ်ခုကို ထုတ်လုပ်ပေးတဲ့ function တစ်ခုပါ။ Default `createConnection` function ကို override လုပ်ဖို့အတွက်သာ — custom `Agent` class တစ်ခု ဖန်တီးစရာ မလိုအောင် — ဒါကို သုံးနိုင်ပါတယ်။ အသေးစိတ်အတွက် [`agent.createConnection()`][] ကို ကြည့်ပါ။ [`Duplex`][] stream တစ်ခုခုက မှန်ကန်တဲ့ return တန်ဖိုး ဖြစ်ပါတယ်။
  * `defaultPort` {number} Protocol အတွက် default port ပါ။ **Default:** `Agent` တစ်ခုကို သုံးနေရင် `agent.defaultPort` — မဟုတ်ရင်တော့ `undefined` ပါ။
  * `family` {number} `host` သို့မဟုတ် `hostname` ကို resolve လုပ်တဲ့အခါ သုံးမယ့် IP address family ပါ။ တရားဝင်တဲ့ (valid) တန်ဖိုးတွေက `4` သို့မဟုတ် `6` ပါ။ မသတ်မှတ်ထားဘူးဆိုရင် — IP v4 ရော v6 ပါ နှစ်မျိုးလုံးကို သုံးပါလိမ့်မယ်။
  * `headers` {Object|Array} Request headers တွေ ပါဝင်တဲ့ object တစ်ခု သို့မဟုတ် strings တွေရဲ့ array တစ်ခုပါ။ Array က [`message.rawHeaders`][] နဲ့ ပုံစံတူပါတယ်။
  * `hints` {number} Optional — [`dns.lookup()` hints][] ပါ။
  * `host` {string} Request ပို့မယ့် server ရဲ့ domain name သို့မဟုတ် IP address ပါ။ **Default:** `'localhost'`။
  * `hostname` {string} `host` ရဲ့ alias (အခြားနာမည်ဖြင့် ခေါ်ဆိုခြင်း) တစ်ခုပါ။ [`url.parse()`][] ကို support လုပ်ဖို့အတွက် — `host` ရော `hostname` ပါ နှစ်ခုလုံး သတ်မှတ်ထားရင် — `hostname` ကို သုံးပါလိမ့်မယ်။
  * `httpValidation` {string} Outgoing requests တွေအတွက် HTTP header value validation ရဲ့ တင်းကျပ်မှု (strictness) ကို ထိန်းချုပ်ပါတယ်။ လက်ခံနိုင်တဲ့ တန်ဖိုးတွေကတော့:
    * `'strict'`: အသည်းအသန် တင်းကျပ်ဆုံး validation ပါ — header values တွေထဲမှာ non-ASCII သို့မဟုတ် control characters တွေကို ငြင်းပယ်ပါတယ်။
    * `'relaxed'`: Header values တွေထဲမှာ non-ASCII characters တွေရဲ့ အကန့်အသတ်ရှိတဲ့ အစုတစ်ခုကို ခွင့်ပြုပေးပြီး — [Fetch specification](https://fetch.spec.whatwg.org/) နဲ့ လိုက်လျောညီထွေ ဖြစ်စေပါတယ်။
    * `'insecure'`: Header value validation အားလုံးကို ပိတ်ပစ်ပါတယ် (`insecureHTTPParser: true` နဲ့ ညီမျှပါတယ်)။ `insecureHTTPParser` နဲ့အတူ တွဲသုံးလို့ မရပါဘူး။ **Default:** `'strict'`။
  * `insecureHTTPParser` {boolean} `true` လို့ သတ်မှတ်ထားရင် — leniency flags (လျှော့ပေါ့ပေးမှု အလံများ) ဖွင့်ထားတဲ့ HTTP parser တစ်ခုကို သုံးပါလိမ့်မယ်။ Insecure parser ကို သုံးတာကို ရှောင်ရှားသင့်ပါတယ်။ အသေးစိတ်အတွက် [`--insecure-http-parser`][] ကို ကြည့်ပါ။ **Default:** `false`
  * `joinDuplicateHeaders` {boolean} Request တစ်ခုထဲက headers အများအပြားရဲ့ field line values တွေကို — duplicates တွေကို ပစ်ပယ်လိုက်မယ့်အစား — `, ` နဲ့ ပေါင်းစပ်ပေးပါတယ်။ အသေးစိတ်အတွက် [`message.headers`][] ကို ကြည့်ပါ။ **Default:** `false`။
  * `localAddress` {string} Network connections တွေအတွက် bind လုပ်ရမယ့် local interface ပါ။
  * `localPort` {number} ချိတ်ဆက်မှု ပြုလုပ်ရာကနေ သုံးမယ့် local port ပါ။
  * `lookup` {Function} Custom lookup function ပါ။ **Default:** [`dns.lookup()`][]။
  * `maxHeaderSize` {number} Server ဆီကနေ လက်ခံရရှိတဲ့ responses တွေအတွက် — (response headers တွေရဲ့ bytes အနေနဲ့ အများဆုံး အလျားဖြစ်တဲ့) — [`--max-http-header-size`][] ရဲ့ တန်ဖိုးကို override လုပ်ဖို့ ဆန္ဒရှိမှသာ ဖြစ်ပါတယ်။ **Default:** 16384 (16 KiB)။
  * `method` {string} HTTP request method ကို သတ်မှတ်ပေးတဲ့ string တစ်ခုပါ။ **Default:** `'GET'`။
  * `path` {string} Request path ပါ။ Query string ရှိရင် ထည့်သွင်းသင့်ပါတယ်။ ဥပမာ — `'/index.html?page=12'`။ Request path ထဲမှာ တရားမဝင်တဲ့ (illegal) characters တွေ ပါဝင်နေရင် exception တစ်ခုကို throw လုပ်ပါတယ်။ လက်ရှိမှာ spaces တွေကိုသာ ငြင်းပယ်ပေမယ့် — နောက်ပိုင်းမှာ ဒါ ပြောင်းလဲသွားနိုင်ပါတယ်။ **Default:** `'/'`။
    `path` ထဲက content ကို HTTP 1.1 message ထဲမှာ [request target][] အဖြစ် ပို့ပေးပါတယ်။ `path` က absolute URL တစ်ခု ဖြစ်နေရင် — message ထဲက request target က [absolute form][] နဲ့ ဖြစ်နေတယ်လို့ ဆိုလိုပါတယ်။ လက်ခံရရှိတဲ့ server က proxy တစ်ခု ဖြစ်နေရင် — server က request ကို request target ထဲမှာ သတ်မှတ်ထားတဲ့ destination ဆီကို ပုံမှန်အားဖြင့် ရှေ့ဆက်ပို့ဆောင် (forward) ပေးပြီး — `Host` header ကို လျစ်လျူရှုပါတယ်။ User က `path`, `host` နဲ့ Host headers တွေက HTTP specification ထဲက [request target][] ရဲ့ လိုအပ်ချက်တွေနဲ့ ကိုက်ညီကြောင်း သေချာစေရပါမယ်။
    Request က [Built-in Proxy Support][] ကနေတစ်ဆင့် route လုပ်ခံရလို့ — လက်ခံရရှိတဲ့ server က proxy တစ်ခုဆိုတာ သိရှိရတဲ့အခါ — `http.request` က request ကို ကနဦး တည်ဆောက်နေစဉ်မှာ — `host` option သို့မဟုတ် `headers` ထဲက `Host` က `path` ထဲက authority နဲ့ ကိုက်ညီမလဲဆိုတာကို — best-effort (အကောင်းဆုံး ကြိုးပမ်းမှု) စစ်ဆေးခြင်း တစ်ခုကို ထပ်ဆောင်း လုပ်ဆောင်ပါတယ်။ Request တည်ဆောက်ချိန်မှာ ၎င်းတို့ မကိုက်ညီဘူးဆိုရင် — proxying အတွက် request target ကို ပြန်လည်ရေးသားတာကို စွန့်လွှတ်ပြီး error တစ်ခုကို throw လုပ်ပါတယ် — ဒါပေမယ့် နောက်ပိုင်းမှာ user က ပြုလုပ်တဲ့ header mutations တွေအတွက်တော့ စစ်ဆေးမှုတွေ ရှိမှာ မဟုတ်ပါဘူး။
  * `port` {number} Remote server ရဲ့ port ပါ။ **Default:** သတ်မှတ်ထားရင် `defaultPort` — မဟုတ်ရင်တော့ `80` ပါ။
  * `protocol` {string} သုံးမယ့် protocol ပါ။ **Default:** `'http:'`။
  * `setDefaultHeaders` {boolean}: `Connection`, `Content-Length`, `Transfer-Encoding` နဲ့ `Host` လိုမျိုး default headers တွေကို အလိုအလျောက် ထည့်သွင်းမလား မထည့်သွင်းဘူးလားကို သတ်မှတ်ပါတယ်။ `false` လို့ သတ်မှတ်ထားရင် — လိုအပ်တဲ့ headers တွေ အားလုံးကို ကိုယ်တိုင် (manually) ထည့်သွင်းပေးရပါမယ်။ Default က `true` ပါ။
  * `setHost` {boolean}: `Host` header ကို အလိုအလျောက် ထည့်သွင်းမလား မထည့်သွင်းဘူးလားကို သတ်မှတ်ပါတယ်။ သတ်မှတ်ပေးထားရင် — ၎င်းက `setDefaultHeaders` ကို override လုပ်ပါတယ်။ Default က `true` ပါ။
  * `signal` {AbortSignal}: လုပ်ဆောင်ဆဲ (ongoing) request တစ်ခုကို abort လုပ်ဖို့ သုံးနိုင်တဲ့ AbortSignal တစ်ခုပါ။
  * `socketPath` {string} Unix domain socket ပါ။ `host` သို့မဟုတ် `port` တစ်ခုခုကို သတ်မှတ်ထားရင် — အဲဒါတွေက TCP Socket တစ်ခုကို သတ်မှတ်ပေးတာမို့ — ၎င်းနဲ့အတူ ဒါကို သုံးလို့ မရပါဘူး။
  * `timeout` {number}: Socket timeout ကို milliseconds နဲ့ သတ်မှတ်ပေးတဲ့ ဂဏန်းတစ်ခုပါ။ Socket ကို မချိတ်ဆက်ခင် ဒီ timeout ကို သတ်မှတ်ပေးပါလိမ့်မယ်။
  * `uniqueHeaders` {Array} တစ်ကြိမ်တည်းသာ ပို့သင့်တဲ့ request headers တွေရဲ့ စာရင်းပါ။ Header ရဲ့ value က array တစ်ခု ဖြစ်နေရင် — items တွေကို `; ` သုံးပြီး ပေါင်းစပ်ပါလိမ့်မယ်။
* `callback` {Function}
* Returns: {http.ClientRequest}

[`socket.connect()`][] ထဲက `options` တွေကိုလည်း support လုပ်ပါတယ်။

Node.js က HTTP requests တွေ ပြုလုပ်ဖို့အတွက် server တစ်ခုချင်းစီဆီကို connections အများအပြား ထိန်းသိမ်းထားပါတယ်။ ဒီ function က — အောက်ခြေ connections တွေကို ကိုင်တွယ်စရာ မလိုပဲ — requests တွေကို ပွင့်လင်းမြင်သာစွာ (transparently) ထုတ်ပြန်နိုင်စေပါတယ်။

`url` က string တစ်ခု သို့မဟုတ် [`URL`][] object တစ်ခု ဖြစ်နိုင်ပါတယ်။ `url` က string ဖြစ်ရင် — [`new URL()`][] နဲ့ အလိုအလျောက် parse လုပ်ပါတယ်။ [`URL`][] object ဖြစ်နေရင်တော့ — သာမန် `options` object တစ်ခုအဖြစ် အလိုအလျောက် ပြောင်းလဲပေးပါတယ်။

`url` ရော `options` ပါ နှစ်ခုလုံး သတ်မှတ်ထားရင် — objects နှစ်ခုကို ပေါင်းစပ်ပြီး — `options` ရဲ့ properties တွေက ဦးစားပေး ရရှိပါတယ်။

Optional ဖြစ်တဲ့ `callback` parameter ကို [`'response'`][] event အတွက် one-time listener (တစ်ကြိမ်တည်းသုံး နားထောင်သူ) တစ်ခုအဖြစ် ထည့်သွင်းပါလိမ့်မယ်။

`http.request()` က [`http.ClientRequest`][] class ရဲ့ instance တစ်ခုကို ပြန်ပေးပါတယ်။ `ClientRequest` instance က writable stream တစ်ခုပါ။ POST request တစ်ခုနဲ့ file တစ်ခုကို upload လုပ်ဖို့ လိုအပ်ရင် — `ClientRequest` object ဆီကို ရေးသားပေးပါ။

```mjs
import http from 'node:http';
import { Buffer } from 'node:buffer';

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```

```cjs
const http = require('node:http');

const postData = JSON.stringify({
  'msg': 'Hello World!',
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```

ဥပမာထဲမှာ `req.end()` ကို ခေါ်ထားပါတယ်။ `http.request()` နဲ့ ဆိုရင် — request body ဆီကို ရေးသားဖို့ data မရှိဘူးဆိုရင်တောင် — request ရဲ့ အဆုံးကို အချက်ပြဖို့ `req.end()` ကို အမြဲတမ်း ခေါ်ပေးရပါမယ်။

Request အတွင်းမှာ error တစ်ခုခု ကြုံတွေ့ခဲ့ရင် (DNS resolution, TCP အဆင့် errors တွေ သို့မဟုတ် တကယ့် HTTP parse errors တွေ ဖြစ်စေ) — ပြန်ပေးလိုက်တဲ့ request object ပေါ်မှာ `'error'` event တစ်ခုကို emit လုပ်ပါတယ်။ `'error'` events တွေ အားလုံးမှာ ဖြစ်သလို — listeners တွေ မှတ်ပုံတင်မထားဘူးဆိုရင် — error ကို throw လုပ်ပါလိမ့်မယ်။

သတိပြုသင့်တဲ့ special headers တစ်ချို့ ရှိပါတယ်။

* 'Connection: keep-alive' ပို့လိုက်တာက — server ဆီက connection ကို နောက် request တစ်ခုအထိ ဆက်လက် ထားရှိသင့်ကြောင်း — Node.js ကို အသိပေးပါတယ်။

* 'Content-Length' header ပို့လိုက်တာက default chunked encoding ကို ပိတ်ပစ်ပါလိမ့်မယ်။

* 'Expect' header ပို့လိုက်တာက request headers တွေကို ချက်ချင်း ပို့စေပါလိမ့်မယ်။ ပုံမှန်အားဖြင့် — 'Expect: 100-continue' ပို့တဲ့အခါ — timeout တစ်ခုရော `'continue'` event အတွက် listener တစ်ခုပါ သတ်မှတ်ပေးထားသင့်ပါတယ်။ ထပ်ဆောင်း အချက်အလက်တွေအတွက် RFC 2616 Section 8.2.3 ကို ကြည့်ပါ။

* Authorization header ပို့လိုက်တာက — basic authentication ကို တွက်ချက်ဖို့ `auth` option ကို သုံးတာကို — override လုပ်ပါလိမ့်မယ်။

`options` အဖြစ် [`URL`][] တစ်ခုကို သုံးတဲ့ ဥပမာ:

```js
const options = new URL('http://abc:xyz@example.com');

const req = http.request(options, (res) => {
  // ...
});
```

အောင်မြင်တဲ့ request တစ်ခုမှာ — အောက်ပါ events တွေကို အောက်ပါ အစီအစဉ်အတိုင်း emit လုပ်ပါလိမ့်မယ်:

* `'socket'`
* `'response'`
  * `'data'` — `res` object ပေါ်မှာ အကြိမ် မည်မျှမဆို
    (`'data'` က — response body က ဗလာ ဖြစ်နေရင် — ဥပမာ redirects အများစုမှာ — လုံးဝ emit လုပ်မှာ မဟုတ်ပါဘူး)
  * `'end'` — `res` object ပေါ်မှာ
* `'close'`

Connection error တစ်ခု ဖြစ်ပွားတဲ့ ကိစ္စမှာတော့ အောက်ပါ events တွေကို emit လုပ်ပါလိမ့်မယ်:

* `'socket'`
* `'error'` — message `'Error: socket hang up'` နဲ့ code `'ECONNRESET'` ပါတဲ့ error တစ်ခုနဲ့အတူ
* `'close'`

Response ကို မလက်ခံရရှိခင် connection က အချိန်မတန်ပဲ (prematurely) ပိတ်သွားတဲ့ ကိစ္စမှာတော့ — အောက်ပါ events တွေကို အောက်ပါ အစီအစဉ်အတိုင်း emit လုပ်ပါလိမ့်မယ်:

* `'socket'`
* `'error'` — message `'Error: socket hang up'` နဲ့ code `'ECONNRESET'` ပါတဲ့ error တစ်ခုနဲ့အတူ
* `'close'`

Response ကို လက်ခံရရှိပြီးနောက်မှာ connection က အချိန်မတန်ပဲ ပိတ်သွားတဲ့ ကိစ္စမှာတော့ — အောက်ပါ events တွေကို အောက်ပါ အစီအစဉ်အတိုင်း emit လုပ်ပါလိမ့်မယ်:

* `'socket'`
* `'response'`
  * `'data'` — `res` object ပေါ်မှာ အကြိမ် မည်မျှမဆို
* (ဒီနေရာမှာ connection ပိတ်သွားပါတယ်)
* `'aborted'` — `res` object ပေါ်မှာ
* `'close'`
* `'error'` — message `'Error: aborted'` နဲ့ code `'ECONNRESET'` ပါတဲ့ error တစ်ခုနဲ့အတူ `res` object ပေါ်မှာ
* `'close'` — `res` object ပေါ်မှာ

Socket တစ်ခု သတ်မှတ်မပေးရသေးခင် `req.destroy()` ကို ခေါ်ထားရင် — အောက်ပါ events တွေကို အောက်ပါ အစီအစဉ်အတိုင်း emit လုပ်ပါလိမ့်မယ်:

* (ဒီနေရာမှာ `req.destroy()` ခေါ်ပါတယ်)
* `'error'` — message `'Error: socket hang up'` နဲ့ code `'ECONNRESET'` ပါတဲ့ error နဲ့အတူ — သို့မဟုတ် `req.destroy()` ကို ခေါ်တဲ့အခါ ပေးအပ်ခဲ့တဲ့ error နဲ့အတူ
* `'close'`

Connection က မအောင်မြင်သေးခင် `req.destroy()` ကို ခေါ်ထားရင် — အောက်ပါ events တွေကို အောက်ပါ အစီအစဉ်အတိုင်း emit လုပ်ပါလိမ့်မယ်:

* `'socket'`
* (ဒီနေရာမှာ `req.destroy()` ခေါ်ပါတယ်)
* `'error'` — message `'Error: socket hang up'` နဲ့ code `'ECONNRESET'` ပါတဲ့ error နဲ့အတူ — သို့မဟုတ် `req.destroy()` ကို ခေါ်တဲ့အခါ ပေးအပ်ခဲ့တဲ့ error နဲ့အတူ
* `'close'`

Response ကို လက်ခံရရှိပြီးနောက်မှာ `req.destroy()` ကို ခေါ်ထားရင် — အောက်ပါ events တွေကို အောက်ပါ အစီအစဉ်အတိုင်း emit လုပ်ပါလိမ့်မယ်:

* `'socket'`
* `'response'`
  * `'data'` — `res` object ပေါ်မှာ အကြိမ် မည်မျှမဆို
* (ဒီနေရာမှာ `req.destroy()` ခေါ်ပါတယ်)
* `'aborted'` — `res` object ပေါ်မှာ
* `'close'`
* `'error'` — message `'Error: aborted'` နဲ့ code `'ECONNRESET'` ပါတဲ့ error နဲ့အတူ `res` object ပေါ်မှာ — သို့မဟုတ် `req.destroy()` ကို ခေါ်တဲ့အခါ ပေးအပ်ခဲ့တဲ့ error နဲ့အတူ
* `'close'` — `res` object ပေါ်မှာ

Socket တစ်ခု သတ်မှတ်မပေးရသေးခင် `req.abort()` ကို ခေါ်ထားရင် — အောက်ပါ events တွေကို အောက်ပါ အစီအစဉ်အတိုင်း emit လုပ်ပါလိမ့်မယ်:

* (ဒီနေရာမှာ `req.abort()` ခေါ်ပါတယ်)
* `'abort'`
* `'close'`

Connection က မအောင်မြင်သေးခင် `req.abort()` ကို ခေါ်ထားရင် — အောက်ပါ events တွေကို အောက်ပါ အစီအစဉ်အတိုင်း emit လုပ်ပါလိမ့်မယ်:

* `'socket'`
* (ဒီနေရာမှာ `req.abort()` ခေါ်ပါတယ်)
* `'abort'`
* `'error'` — message `'Error: socket hang up'` နဲ့ code `'ECONNRESET'` ပါတဲ့ error တစ်ခုနဲ့အတူ
* `'close'`

Response ကို လက်ခံရရှိပြီးနောက်မှာ `req.abort()` ကို ခေါ်ထားရင် — အောက်ပါ events တွေကို အောက်ပါ အစီအစဉ်အတိုင်း emit လုပ်ပါလိမ့်မယ်:

* `'socket'`
* `'response'`
  * `'data'` — `res` object ပေါ်မှာ အကြိမ် မည်မျှမဆို
* (ဒီနေရာမှာ `req.abort()` ခေါ်ပါတယ်)
* `'abort'`
* `'aborted'` — `res` object ပေါ်မှာ
* `'error'` — message `'Error: aborted'` နဲ့ code `'ECONNRESET'` ပါတဲ့ error နဲ့အတူ `res` object ပေါ်မှာ
* `'close'`
* `'close'` — `res` object ပေါ်မှာ

`timeout` option ကို သတ်မှတ်တာ သို့မဟုတ် `setTimeout()` function ကို သုံးတာက — `'timeout'` event တစ်ခုကို ထည့်သွင်းပေးတာကလွဲလို့ — request ကို abort လုပ်မှာ မဟုတ်သလို — တခြား ဘာမှလည်း လုပ်ဆောင်မှာ မဟုတ်ပါဘူး။

`AbortSignal` တစ်ခုကို ဖြတ်သန်းပြီး — သက်ဆိုင်ရာ `AbortController` ပေါ်မှာ `abort()` ကို ခေါ်လိုက်ရင် — request ပေါ်မှာ `.destroy()` ကို ခေါ်တာနဲ့ ပုံစံတူ အပြုအမူ ဖြစ်ပါလိမ့်မယ်။ အထူးသဖြင့် — message `'AbortError: The operation was aborted'`, code `'ABORT_ERR'` နဲ့ — ပေးအပ်ထားခဲ့ရင် — `cause` ပါတဲ့ error တစ်ခုနဲ့အတူ `'error'` event ကို emit လုပ်ပါလိမ့်မယ်။

## `http.validateHeaderName(name[, label])`

* `name` {string}
* `label` {string} Error message အတွက် label ပါ။ **Default:** `'Header name'`။

`res.setHeader(name, value)` ကို ခေါ်တဲ့အခါ လုပ်ဆောင်သလို — ပေးထားတဲ့ `name` ပေါ်မှာ low-level validations (အောက်ခြေအဆင့် စစ်ဆေးမှုများ) တွေကို လုပ်ဆောင်ပါတယ်။

`name` အဖြစ် တရားမဝင်တဲ့ (illegal) တန်ဖိုးတစ်ခုကို ဖြတ်သန်းလိုက်ရင် — `code: 'ERR_INVALID_HTTP_TOKEN'` နဲ့ ခွဲခြားသတ်မှတ်ထားတဲ့ [`TypeError`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

HTTP request တစ်ခု သို့မဟုတ် response တစ်ခုဆီကို headers တွေ မဖြတ်သန်းခင် ဒီ method ကို သုံးဖို့ မလိုအပ်ပါဘူး။ HTTP module က အဲဒီလို headers တွေကို အလိုအလျောက် validate လုပ်ပေးပါတယ်။

ဥပမာ:

```mjs
import { validateHeaderName } from 'node:http';

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```

```cjs
const { validateHeaderName } = require('node:http');

try {
  validateHeaderName('');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code); // --> 'ERR_INVALID_HTTP_TOKEN'
  console.error(err.message); // --> 'Header name must be a valid HTTP token [""]'
}
```

## `http.validateHeaderValue(name, value)`

* `name` {string}
* `value` {any}

`res.setHeader(name, value)` ကို ခေါ်တဲ့အခါ လုပ်ဆောင်သလို — ပေးထားတဲ့ `value` ပေါ်မှာ low-level validations တွေကို လုပ်ဆောင်ပါတယ်။

`value` အဖြစ် တရားမဝင်တဲ့ တန်ဖိုးတစ်ခုကို ဖြတ်သန်းလိုက်ရင် — [`TypeError`][] တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

* Undefined value error ကို `code: 'ERR_HTTP_INVALID_HEADER_VALUE'` နဲ့ ခွဲခြားသတ်မှတ်ပါတယ်။
* Invalid value character error ကို `code: 'ERR_INVALID_CHAR'` နဲ့ ခွဲခြားသတ်မှတ်ပါတယ်။

HTTP request တစ်ခု သို့မဟုတ် response တစ်ခုဆီကို headers တွေ မဖြတ်သန်းခင် ဒီ method ကို သုံးဖို့ မလိုအပ်ပါဘူး။ HTTP module က အဲဒီလို headers တွေကို အလိုအလျောက် validate လုပ်ပေးပါတယ်။

ဥပမာများ:

```mjs
import { validateHeaderValue } from 'node:http';

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```

```cjs
const { validateHeaderValue } = require('node:http');

try {
  validateHeaderValue('x-my-header', undefined);
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_HTTP_INVALID_HEADER_VALUE'); // --> true
  console.error(err.message); // --> 'Invalid value "undefined" for header "x-my-header"'
}

try {
  validateHeaderValue('x-my-header', 'oʊmɪɡə');
} catch (err) {
  console.error(err instanceof TypeError); // --> true
  console.error(err.code === 'ERR_INVALID_CHAR'); // --> true
  console.error(err.message); // --> 'Invalid character in header content ["x-my-header"]'
}
```

## `http.setMaxIdleHTTPParsers(max)`

* `max` {number} **Default:** `1000`။

Idle ဖြစ်နေတဲ့ HTTP parsers တွေရဲ့ အများဆုံး အရေအတွက်ကို သတ်မှတ်ပါတယ်။

## `http.setGlobalProxyFromEnv([proxyEnv])`

* `proxyEnv` {Object} Proxy configuration ပါဝင်တဲ့ object တစ်ခုပါ။ ဒါက [`Agent`][] က လက်ခံတဲ့ `proxyEnv` option နဲ့ အတူတူ options တွေကို လက်ခံပါတယ်။ **Default:** `process.env`။
* Returns: {Function} ဒီ `http.setGlobalProxyFromEnv()` ကို မခေါ်ခင် အခြေအနေဆီကို — မူရင်း agent နဲ့ dispatcher settings တွေကို ပြန်လည် ထူထောင်ပေးတဲ့ function တစ်ခုပါ။

`--use-env-proxy` flag သို့မဟုတ် `NODE_USE_ENV_PROXY` environment variable ကို သုံးတာရဲ့ အစားထိုး (alternative) တစ်ခုအနေနဲ့ — `fetch()` နဲ့ `http.request()`/`https.request()` တို့အတွက် runtime မှာ built-in proxy support (ထည့်သွင်းပါရှိပြီးသား proxy ပံ့ပိုးမှု) ကို ဖွင့်ပေးဖို့ — ဒီ function က global configurations တွေကို ပြောင်းလဲ ပြန်လည်သတ်မှတ် (dynamically resets) ပေးပါတယ်။ Environment variables တွေကနေ configure လုပ်ထားတဲ့ settings တွေကို override လုပ်ဖို့လည်း သုံးနိုင်ပါတယ်။

ဒီ function က global configurations တွေကို ပြန်လည်သတ်မှတ်တာမို့ — အရင်က configure လုပ်ထားတဲ့ `http.globalAgent`, `https.globalAgent` သို့မဟုတ် undici global dispatcher တွေက — ဒီ function ကို ခေါ်လိုက်ပြီးနောက်မှာ — override ခံရပါလိမ့်မယ်။ Requests တွေ မပြုလုပ်ခင် ဒီ function ကို ခေါ်ထားဖို့ အကြံပြုပြီး — requests တစ်ခုခုရဲ့ အလယ်မှာ ခေါ်တာကို ရှောင်ကြဉ်ပါ။

Proxy URL formats နဲ့ `NO_PROXY` syntax အသေးစိတ်အတွက် [Built-in Proxy Support][] ကို ကြည့်ပါ။

## Class: `WebSocket`

{WebSocket} ရဲ့ browser-compatible (browser နှင့် လိုက်ဖက်ညီသော) implementation တစ်ခုပါ။

## Built-in proxy ပံ့ပိုးမှု (Built-in Proxy Support)

> Stability: 1.1 - Active development

Node.js က global agent ကို ဖန်တီးတဲ့အခါ — `NODE_USE_ENV_PROXY` environment variable ကို `1` အဖြစ် သတ်မှတ်ထားရင် သို့မဟုတ် `--use-env-proxy` ကို ဖွင့်ထားရင် — global agent ကို `proxyEnv: process.env` နဲ့အတူ တည်ဆောက်ပြီး — environment variables တွေကို အခြေခံတဲ့ proxy support ကို ဖွင့်ပေးပါတယ်။

Proxy support ကို ပြောင်းလဲနိုင်ပြီး global အဆင့်မှာ ဖွင့်ဖို့အတွက် — [`http.setGlobalProxyFromEnv()`][] ကို သုံးပါ။

Custom agents တွေကိုလည်း — agent ကို တည်ဆောက်တဲ့အခါ `proxyEnv` option တစ်ခုကို ဖြတ်သန်းပေးခြင်းအားဖြင့် — proxy support နဲ့အတူ ဖန်တီးနိုင်ပါတယ်။ Environment variables တွေကနေ configuration ကို ဆက်ခံ (inherit) ချင်ရုံသာ ဖြစ်ရင် အဲဒီတန်ဖိုးက `process.env` ဖြစ်နိုင်သလို — environment ကို override လုပ်တဲ့ တိကျတဲ့ settings တွေ ပါဝင်တဲ့ object တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။

Proxy support ကို configure လုပ်ဖို့ `proxyEnv` ရဲ့ အောက်ပါ properties တွေကို စစ်ဆေးပါတယ်။

* `HTTP_PROXY` သို့မဟုတ် `http_proxy`: HTTP requests တွေအတွက် proxy server ရဲ့ URL ပါ။ နှစ်ခုလုံး သတ်မှတ်ထားရင် — `http_proxy` က ဦးစားပေး ရရှိပါတယ်။
* `HTTPS_PROXY` သို့မဟုတ် `https_proxy`: HTTPS requests တွေအတွက် proxy server ရဲ့ URL ပါ။ နှစ်ခုလုံး သတ်မှတ်ထားရင် — `https_proxy` က ဦးစားပေး ရရှိပါတယ်။
* `NO_PROXY` သို့မဟုတ် `no_proxy`: Proxy ကို ရှောင်ကွင်းရမယ့် hosts တွေရဲ့ comma-separated (ကော်မာ ခြားထားသော) စာရင်းပါ။ နှစ်ခုလုံး သတ်မှတ်ထားရင် — `no_proxy` က ဦးစားပေး ရရှိပါတယ်။

Request တစ်ခုကို Unix domain socket တစ်ခုဆီကို ပြုလုပ်ထားရင် — proxy settings တွေကို လျစ်လျူရှုပါလိမ့်မယ်။

### Proxy လုံခြုံရေး ထည့်သွင်းစဉ်းစားချက်များ (Proxy security considerations)

Built-in proxy support က outbound requests တွေကို HTTP(S) proxy တစ်ခုကနေတစ်ဆင့် route လုပ်ပေးပါတယ် — မကြာခဏဆိုသလို external networks တွေဆီ ဝင်ရောက်ဖို့ firewall တစ်ခုက proxy လိုအပ်လို့ပါ။ ဒါက anonymity (အမည်ဝှက်) သို့မဟုတ် traffic-hiding (traffic ဖုံးကွယ်ခြင်း) feature တစ်ခု မဟုတ်ပဲ — proxy, local network, network operators သို့မဟုတ် deployment ကို အုပ်ချုပ်တဲ့ authorities တွေဆီကနေ traffic တွေကို ဖုံးကွယ်ဖို့ ကြိုးစားမှု မလုပ်ပါဘူး။

Deployment အတွက် ယုံကြည်ရပြီး ခွင့်ပြုချက် ရှိတဲ့ proxies တွေကိုသာ configure လုပ်ပါ။ Proxy တစ်ခုက connection metadata တွေကို ကြည့်ရှုနိုင်ပြီး — သာမန် HTTP requests တွေအတွက် သို့မဟုတ် TLS ကို proxy က terminate လုပ်တာ သို့မဟုတ် ကြားဖြတ်စစ်ဆေးတဲ့အခါ — request နဲ့ response contents တွေကိုပါ ကြည့်ရှုနိုင်ပါတယ်။ Node.js က — ယုံကြည်မှု မရှိတဲ့ proxy တစ်ခုကို privacy boundary (ကိုယ်ရေးကိုယ်တာ နယ်နိမိတ်) တစ်ခုအဖြစ် သဘောထားတာကို support မလုပ်ပါဘူး။ Deployment operators တွေက proxy configuration ကို ထိန်းချုပ်ခြင်းနဲ့ — deployment အလိုက် network policy နဲ့ legal requirements တွေကို လိုက်နာခြင်းအတွက် တာဝန်ရှိပါတယ်။

### Proxy URL ပုံစံ (Proxy URL Format)

Proxy URLs တွေက HTTP သို့မဟုတ် HTTPS protocols တစ်ခုခုကို သုံးနိုင်ပါတယ်:

* HTTP proxy: `http://proxy.example.com:8080`
* HTTPS proxy: `https://proxy.example.com:8080`
* Authentication ပါတဲ့ proxy (proxy with authentication): `http://username:password@proxy.example.com:8080`

### `NO_PROXY` Format

`NO_PROXY` environment variable က ပုံစံအမျိုးမျိုးကို support လုပ်ပါတယ်:

* `*` - Host အားလုံးအတွက် proxy ကို ရှောင်ကွင်းပါတယ်။
* `example.com` - Host name နဲ့ အတိအကျ (exactly) ကိုက်ညီမှုပါ။
* `.example.com` - Domain suffix ကိုက်ညီမှုပါ (`sub.example.com` ကို ကိုက်ညီစေပါတယ်)။
* `*.example.com` - Wildcard domain ကိုက်ညီမှုပါ။
* `192.168.1.100` - IP address နဲ့ အတိအကျ ကိုက်ညီမှုပါ။
* `192.168.1.1-192.168.1.100` - IP address အကွာအဝေး (range) တစ်ခုပါ။
* `example.com:8080` - တိကျတဲ့ port တစ်ခု ပါဝင်တဲ့ hostname ပါ။

Entries အများအပြားကို commas (ကော်မာများ) နဲ့ ခြားထားသင့်ပါတယ်။

### ဥပမာ (Example)

Default global agent ကနေတစ်ဆင့် ပို့လွှတ်တဲ့ requests တွေ အားလုံးအတွက် proxy support ဖွင့်ထားတဲ့ Node.js process တစ်ခုကို စတင်ဖို့ — `NODE_USE_ENV_PROXY` environment variable ကို သုံးနိုင်ပါတယ်:

```console
NODE_USE_ENV_PROXY=1 HTTP_PROXY=http://proxy.example.com:8080 NO_PROXY=localhost,127.0.0.1 node client.js
```

သို့မဟုတ် `--use-env-proxy` flag ကိုလည်း သုံးနိုင်ပါတယ်။

```console
HTTP_PROXY=http://proxy.example.com:8080 NO_PROXY=localhost,127.0.0.1 node --use-env-proxy client.js
```

Proxy support ကို — `process.env` နဲ့အတူ (`http.setGlobalProxyFromEnv()` ရဲ့ default option ဖြစ်တဲ့) — ပြောင်းလဲနိုင်ပြီး global အဆင့်မှာ ဖွင့်လှစ်ဖို့:

```cjs
const http = require('node:http');

// Reads proxy-related environment variables from process.env
const restore = http.setGlobalProxyFromEnv();

// Subsequent requests will use the configured proxies from environment variables
http.get('http://www.example.com', (res) => {
  // This request will be proxied if HTTP_PROXY or http_proxy is set
});

fetch('https://www.example.com', (res) => {
  // This request will be proxied if HTTPS_PROXY or https_proxy is set
});

// To restore the original global agent and dispatcher settings, call the returned function.
// restore();
```

```mjs
import http from 'node:http';

// Reads proxy-related environment variables from process.env
http.setGlobalProxyFromEnv();

// Subsequent requests will use the configured proxies from environment variables
http.get('http://www.example.com', (res) => {
  // This request will be proxied if HTTP_PROXY or http_proxy is set
});

fetch('https://www.example.com', (res) => {
  // This request will be proxied if HTTPS_PROXY or https_proxy is set
});

// To restore the original global agent and dispatcher settings, call the returned function.
// restore();
```

Proxy support ကို — custom settings တွေနဲ့အတူ — ပြောင်းလဲနိုင်ပြီး global အဆင့်မှာ ဖွင့်လှစ်ဖို့:

```cjs
const http = require('node:http');

const restore = http.setGlobalProxyFromEnv({
  http_proxy: 'http://proxy.example.com:8080',
  https_proxy: 'https://proxy.example.com:8443',
  no_proxy: 'localhost,127.0.0.1,.internal.example.com',
});

// Subsequent requests will use the configured proxies
http.get('http://www.example.com', (res) => {
  // This request will be proxied through proxy.example.com:8080
});

fetch('https://www.example.com', (res) => {
  // This request will be proxied through proxy.example.com:8443
});
```

```mjs
import http from 'node:http';

http.setGlobalProxyFromEnv({
  http_proxy: 'http://proxy.example.com:8080',
  https_proxy: 'https://proxy.example.com:8443',
  no_proxy: 'localhost,127.0.0.1,.internal.example.com',
});

// Subsequent requests will use the configured proxies
http.get('http://www.example.com', (res) => {
  // This request will be proxied through proxy.example.com:8080
});

fetch('https://www.example.com', (res) => {
  // This request will be proxied through proxy.example.com:8443
});
```

Built-in proxy support ပါတဲ့ custom agent တစ်ခုကို ဖန်တီးဖို့:

```cjs
const http = require('node:http');

// Creating a custom agent with custom proxy support.
const agent = new http.Agent({ proxyEnv: { HTTP_PROXY: 'http://proxy.example.com:8080' } });

http.request({
  hostname: 'www.example.com',
  port: 80,
  path: '/',
  agent,
}, (res) => {
  // This request will be proxied through proxy.example.com:8080 using the HTTP protocol.
  console.log(`STATUS: ${res.statusCode}`);
});
```

တစ်နည်းအားဖြင့် — အောက်ပါအတိုင်းလည်း အလုပ်လုပ်ပါတယ်:

```cjs
const http = require('node:http');
// Use lower-cased option name.
const agent1 = new http.Agent({ proxyEnv: { http_proxy: 'http://proxy.example.com:8080' } });
// Use values inherited from the environment variables, if the process is started with
// HTTP_PROXY=http://proxy.example.com:8080 this will use the proxy server specified
// in process.env.HTTP_PROXY.
const agent2 = new http.Agent({ proxyEnv: process.env });
```

[Built-in Proxy Support]: #built-in-proxy-support
[RFC 8187]: https://www.rfc-editor.org/rfc/rfc8187.txt
[RFC 9110 Section 6.6.1]: https://www.rfc-editor.org/rfc/rfc9110#section-6.6.1
[`'ERR_HTTP_CONTENT_LENGTH_MISMATCH'`]: errors.md#err_http_content_length_mismatch
[`'checkContinue'`]: #event-checkcontinue
[`'finish'`]: #event-finish
[`'request'`]: #event-request
[`'response'`]: #event-response
[`'upgrade'`]: #event-upgrade
[`--insecure-http-parser`]: cli.md#--insecure-http-parser
[`--max-http-header-size`]: cli.md#--max-http-header-sizesize
[`Agent`]: #class-httpagent
[`Buffer.byteLength()`]: buffer.md#static-method-bufferbytelengthstring-encoding
[`Duplex`]: stream.md#class-streamduplex
[`HPE_HEADER_OVERFLOW`]: errors.md#hpe_header_overflow
[`Headers`]: globals.md#class-headers
[`TypeError`]: errors.md#class-typeerror
[`URL`]: url.md#the-whatwg-url-api
[`agent.createConnection()`]: #agentcreateconnectionoptions-callback
[`agent.getName()`]: #agentgetnameoptions
[`destroy()`]: #agentdestroy
[`dns.lookup()`]: dns.md#dnslookuphostname-options-callback
[`dns.lookup()` hints]: dns.md#supported-getaddrinfo-flags
[`getHeader(name)`]: #requestgetheadername
[`http.Agent`]: #class-httpagent
[`http.ClientRequest`]: #class-httpclientrequest
[`http.IncomingMessage`]: #class-httpincomingmessage
[`http.ServerResponse`]: #class-httpserverresponse
[`http.Server`]: #class-httpserver
[`http.createServer()`]: #httpcreateserveroptions-requestlistener
[`http.get()`]: #httpgetoptions-callback
[`http.globalAgent`]: #httpglobalagent
[`http.request()`]: #httprequestoptions-callback
[`http.setGlobalProxyFromEnv()`]: #httpsetglobalproxyfromenvproxyenv
[`message.headers`]: #messageheaders
[`message.rawHeaders`]: #messagerawheaders
[`message.socket`]: #messagesocket
[`message.trailers`]: #messagetrailers
[`net.Server.close()`]: net.md#serverclosecallback
[`net.Server`]: net.md#class-netserver
[`net.Socket`]: net.md#class-netsocket
[`net.createConnection()`]: net.md#netcreateconnectionoptions-connectlistener
[`new URL()`]: url.md#new-urlinput-base
[`outgoingMessage.setHeader(name, value)`]: #outgoingmessagesetheadername-value
[`outgoingMessage.setHeaders()`]: #outgoingmessagesetheadersheaders
[`outgoingMessage.socket`]: #outgoingmessagesocket
[`removeHeader(name)`]: #requestremoveheadername
[`request.destroy()`]: #requestdestroyerror
[`request.destroyed`]: #requestdestroyed
[`request.end()`]: #requestenddata-encoding-callback
[`request.flushHeaders()`]: #requestflushheaders
[`request.getHeader()`]: #requestgetheadername
[`request.setHeader()`]: #requestsetheadername-value
[`request.setTimeout()`]: #requestsettimeouttimeout-callback
[`request.socket.getPeerCertificate()`]: tls.md#tlssocketgetpeercertificatedetailed
[`request.socket`]: #requestsocket
[`request.writableEnded`]: #requestwritableended
[`request.writableFinished`]: #requestwritablefinished
[`request.write(data, encoding)`]: #requestwritechunk-encoding-callback
[`response.end()`]: #responseenddata-encoding-callback
[`response.getHeader()`]: #responsegetheadername
[`response.setHeader()`]: #responsesetheadername-value
[`response.socket`]: #responsesocket
[`response.strictContentLength`]: #responsestrictcontentlength
[`response.writableEnded`]: #responsewritableended
[`response.writableFinished`]: #responsewritablefinished
[`response.write()`]: #responsewritechunk-encoding-callback
[`response.write(data, encoding)`]: #responsewritechunk-encoding-callback
[`response.writeContinue()`]: #responsewritecontinue
[`response.writeEarlyHints()`]: #responsewriteearlyhintshints-callback
[`response.writeHead()`]: #responsewriteheadstatuscode-statusmessage-headers
[`response.writeProcessing()`]: #responsewriteprocessing
[`server.close()`]: #serverclosecallback
[`server.headersTimeout`]: #serverheaderstimeout
[`server.keepAliveTimeoutBuffer`]: #serverkeepalivetimeoutbuffer
[`server.keepAliveTimeout`]: #serverkeepalivetimeout
[`server.listen()`]: net.md#serverlisten
[`server.requestTimeout`]: #serverrequesttimeout
[`server.timeout`]: #servertimeout
[`setHeader(name, value)`]: #requestsetheadername-value
[`socket.connect()`]: net.md#socketconnectoptions-connectlistener
[`socket.setKeepAlive()`]: net.md#socketsetkeepalive
[`socket.setNoDelay()`]: net.md#socketsetnodelaynodelay
[`socket.setTimeout()`]: net.md#socketsettimeouttimeout-callback
[`socket.unref()`]: net.md#socketunref
[`stream.getDefaultHighWaterMark()`]: stream.md#streamgetdefaulthighwatermarkobjectmode
[`url.parse()`]: url.md#urlparseurlstring-parsequerystring-slashesdenotehost
[`writable.cork()`]: stream.md#writablecork
[`writable.destroy()`]: stream.md#writabledestroyerror
[`writable.destroyed`]: stream.md#writabledestroyed
[`writable.uncork()`]: stream.md#writableuncork
[`writable.write()`]: stream.md#writablewritechunk-encoding-callback
[absolute form]: https://datatracker.ietf.org/doc/html/rfc9112#section-3.2.2
[information event]: #event-information
[initial delay]: net.md#socketsetkeepaliveenable-initialdelay-interval-count
[request target]: https://datatracker.ietf.org/doc/html/rfc9112#section-3.2
