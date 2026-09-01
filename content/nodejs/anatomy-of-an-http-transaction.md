---
title: "HTTP Transaction တစ်ခု၏ ဖွဲ့စည်းပုံ"
description: "Node.js HTTP server ဘယ်လို အလုပ်လုပ်သလဲ — createServer နဲ့ request handler၊ method/URL/headers ဖတ်ခြင်း၊ request body စုခြင်း၊ response (status code, headers, body) ပို့ခြင်း၊ error handling နဲ့ echo server ဥပမာ"
order: 12
source: "https://nodejs.org/en/learn/http/anatomy-of-an-http-transaction"
status: translated
updated: 2026-09-01
---

## HTTP Transaction တစ်ခုရဲ့ ဖွဲ့စည်းပုံ

ဒီ guide ရဲ့ ရည်ရွယ်ချက်က Node.js ရဲ့ HTTP handling process ကို ခိုင်ခိုင်မာမာ နားလည်စေဖို့ပါ။ HTTP requests တွေ ယေဘုယျအားဖြင့် ဘယ်လို အလုပ်လုပ်တယ်ဆိုတာ — language ဒါမှမဟုတ် programming environment မရွေး — သင်သိတယ်လို့ ယူဆထားပါတယ်။ Node.js ရဲ့ [`EventEmitters`](https://nodejs.org/api/events.html) နဲ့ [`Streams`](https://nodejs.org/api/stream.html) တွေကိုလည်း နည်းနည်း ရင်းနှီးပြီးသားလို့ ယူဆပါတယ်။ သိပ်မရင်းနှီးသေးရင် — အဲဒီနှစ်ခုရဲ့ API docs တွေကို အမြန် တစ်ချက် ဖတ်ကြည့်တာ ထိုက်တန်ပါတယ်။

## Server ဖန်တီးခြင်း

Node.js web server application တိုင်းဟာ တစ်ချိန်ချိန်မှာ web server object တစ်ခု ဖန်တီးရပါတယ်။ ဒါကို [`createServer`](https://nodejs.org/api/http.html#http_http_createserver_requestlistener) သုံးပြီး လုပ်ပါတယ်:

```cjs
const http = require('node:http');

const server = http.createServer((request, response) => {
  // magic happens here!
});
```

[`createServer`](https://nodejs.org/api/http.html#http_http_createserver_requestlistener) ဆီ ပေးလိုက်တဲ့ function ကို အဲဒီ server ဆီ လာတဲ့ HTTP request တိုင်းအတွက် တစ်ခါ ခေါ်ပါတယ် — ဒါကြောင့် သူ့ကို request handler လို့ ခေါ်ပါတယ်။ တကယ်တော့ [`createServer`](https://nodejs.org/api/http.html#http_http_createserver_requestlistener) က ပြန်ပေးတဲ့ [`Server`](https://nodejs.org/api/http.html#http_class_http_server) object က [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) တစ်ခုဖြစ်ပြီး — ဒီမှာ မြင်ရတာက `server` object ဖန်တီးပြီး listener ကို နောက်မှ ထည့်တာရဲ့ အတိုကောက် ပုံစံပဲ ဖြစ်ပါတယ်:

```js
const server = http.createServer();
server.on('request', (request, response) => {
  // ဒီမှာလည်း အလားတူ magic တွေ ဖြစ်ပါတယ်!
});
```

HTTP request တစ်ခု server ဆီ ရောက်လာတဲ့အခါ — Node က request handler function ကို transaction ကို ကိုင်တွယ်ဖို့ အဆင်သင့် objects တချို့နဲ့အတူ ခေါ်ပါတယ်: `request` နဲ့ `response`။ ဒါတွေကို မကြာခင် ကြည့်ပါမယ်။

Requests တွေကို တကယ် ဝန်ဆောင်မှုပေးဖို့ — [`listen`](https://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback) method ကို `server` object ပေါ်မှာ ခေါ်ဖို့ လိုပါတယ်။ အများစုမှာ `listen` ဆီ ပေးစရာလိုတာက server ကို နားထောင်စေချင်တဲ့ port number ပဲ ဖြစ်ပါတယ်။ တခြား options တွေလည်း ရှိပါသေးတယ် — [API reference](https://nodejs.org/api/http.html) မှာ ကြည့်နိုင်ပါတယ်။

## Method, URL နဲ့ Headers

Request တစ်ခုကို ကိုင်တွယ်တဲ့အခါ ပထမဆုံး လုပ်ချင်တာက method နဲ့ URL ကို ကြည့်ပြီး — သင့်တော်တဲ့ လုပ်ဆောင်ချက်တွေ လုပ်ဖို့ပါ။ Node.js က ဒါကို အတော်လေး လွယ်ကူအောင် `request` object ပေါ်မှာ အဆင်သင့် properties တွေ ထားပေးပါတယ်:

```js
const { method, url } = request;
```

> `request` object က [`IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage) ရဲ့ instance တစ်ခုပါ။

ဒီမှာ `method` က ပုံမှန် HTTP method/verb ဖြစ်ပါတယ်။ `url` ကတော့ server, protocol ဒါမှမဟုတ် port မပါတဲ့ URL အပြည့်အစုံပါ — ပုံမှန် URL တစ်ခုအတွက် ဆိုရင် တတိယမြောက် forward slash ကစပြီး နောက်က အရာအားလုံးကို ဆိုလိုပါတယ်။

Headers တွေလည်း ဝေးဝေး မရှိပါဘူး — သူတို့က `request` ပေါ်က `headers` ဆိုတဲ့ ကိုယ်ပိုင် object ထဲမှာ ရှိပါတယ်:

```js
const { headers } = request;
const userAgent = headers['user-agent'];
```

ဒီမှာ အရေးကြီးတဲ့ အချက်က — client က ဘယ်လို ပို့ပေးပေး headers အားလုံးက lowercase နဲ့ပဲ ကိုယ်စားပြုပါတယ်။ ဒါက headers တွေကို ဘယ်ရည်ရွယ်ချက်အတွက်ပဲ ဖြစ်ဖြစ် parse လုပ်ရတာ ပိုလွယ်ကူစေပါတယ်။

Header တချို့ ထပ်ခါထပ်ခါ လာရင် — header အမျိုးအစားပေါ် မူတည်ပြီး သူတို့ရဲ့ values တွေကို overwrite လုပ်တာ ဒါမှမဟုတ် comma ခြားပြီး string တစ်ခုတည်း အဖြစ် ပေါင်းစပ်လိုက်ပါတယ်။ တချို့ အခြေအနေတွေမှာ ဒါက ပြဿနာ ဖြစ်နိုင်လို့ — [`rawHeaders`](https://nodejs.org/api/http.html#http_message_rawheaders) ကိုလည်း ရနိုင်ပါသေးတယ်။

## Request Body

`POST` ဒါမှမဟုတ် `PUT` request တစ်ခု လက်ခံရရှိတဲ့အခါ — request body က သင့် application အတွက် အရေးကြီးနိုင်ပါတယ်။ Body data ကို ရယူတာက request headers တွေ ဝင်ရောက်ကြည့်တာထက် နည်းနည်း ပိုပါဝင်ပတ်သက်ပါတယ်။ Handler ဆီ ပေးလိုက်တဲ့ `request` object က [`ReadableStream`](https://nodejs.org/api/stream.html#stream_class_stream_readable) interface ကို implement လုပ်ပါတယ်။ ဒီ stream ကို တခြား stream တွေလိုပဲ listen လုပ်နိုင်သလို တခြားနေရာဆီ pipe လည်း လုပ်နိုင်ပါတယ်။ Stream ရဲ့ `'data'` နဲ့ `'end'` events တွေကို listen လုပ်ပြီး data ကို stream ထဲကနေ တိုက်ရိုက် ယူနိုင်ပါတယ်။

`'data'` event တစ်ခုချင်းစီမှာ ထွက်လာတဲ့ chunk က [`Buffer`](https://nodejs.org/api/buffer.html) တစ်ခုပါ။ ဒါက string data ဖြစ်မယ်ဆိုတာ သိရင် — အကောင်းဆုံးက data တွေကို array တစ်ခုထဲ စုပြီး `'end'` မှာ ပေါင်းကာ string အဖြစ် ပြောင်းဖို့ပါ:

```js
let body = [];
request
  .on('data', chunk => {
    body.push(chunk);
  })
  .on('end', () => {
    body = Buffer.concat(body).toString();
    // ဒီအချိန်မှာ `body` ထဲမှာ request body တစ်ခုလုံး string အနေနဲ့ ရှိနေပါပြီ
  });
```

> ဒါက နည်းနည်း ငြီးငွေ့စရာ ကောင်းသလို ခံစားရနိုင်ပြီး — တော်တော်များများ အခြေအနေမှာ တကယ်လည်း အဲဒီလိုပါ။ ကံကောင်းချင်တော့ [`npm`](https://www.npmjs.com) ပေါ်မှာ [`concat-stream`](https://www.npmjs.com/package/concat-stream) နဲ့ [`body`](https://www.npmjs.com/package/body) လိုမျိုး modules တွေ ရှိပြီး — ဒီ logic တချို့ကို ဖုံးကွယ်ပေးနိုင်ပါတယ်။ အဲဒီလမ်းကြောင်း မလျှောက်ခင် ဘာတွေ ဖြစ်နေတယ်ဆိုတာ ကောင်းကောင်း နားလည်ထားဖို့ အရေးကြီးပါတယ် — ဒါကြောင့်မို့ ဒီမှာ ရောက်နေတာပါ!

## Error တွေအကြောင်း အမြန် မှတ်စု

`request` object က [`ReadableStream`](https://nodejs.org/api/stream.html#stream_class_stream_readable) ဖြစ်လို့ — သူက [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) လည်း ဖြစ်ပြီး error ဖြစ်တဲ့အခါ အဲဒီလိုပဲ ပြုမူပါတယ်။

`request` stream ထဲမှာ error ဖြစ်ရင် — stream ပေါ်မှာ `'error'` event တစ်ခု emit လုပ်ပြီး သူ့ဘာသာ ပေါ်လာပါတယ်။ **အဲဒီ event အတွက် listener မရှိရင် — error က _thrown_ ဖြစ်ပြီး သင့် Node.js program ကို crash ဖြစ်စေနိုင်ပါတယ်။** ဒါကြောင့် သင့် request streams တွေပေါ်မှာ `'error'` listener ထည့်ထားသင့်ပါတယ် — log လုပ်ပြီး ဆက်သွားရုံပဲ ဖြစ်ဖြစ်ပါ။ (ဒါပေမယ့် HTTP error response တစ်မျိုးမျိုး ပို့တာ အကောင်းဆုံးပါ — နောက်မှ ပိုပြောပါမယ်။)

```js
request.on('error', err => {
  // ဒါက error message နဲ့ stack trace ကို `stderr` ဆီ print လုပ်ပါတယ်
  console.error(err.stack);
});
```

ဒီ errors တွေကို [ကိုင်တွယ်ဖို့](https://nodejs.org/api/errors.html) တခြား နည်းလမ်းတွေလည်း ရှိပါသေးတယ် — တခြား abstractions နဲ့ tools တွေလိုမျိုးပါ။ ဒါပေမယ့် errors တွေက ဖြစ်တတ်ပြီး ဖြစ်လာရင် သင်ကိုင်တွယ်ရမယ်ဆိုတာ အမြဲ သတိထားပါ။

## အခုထိ ရရှိထားတာတွေ

ဒီအထိ server ဖန်တီးတာ၊ requests တွေကနေ method, URL, headers နဲ့ body ယူတာတွေကို ပြောပြီးပါပြီ။ အားလုံး ပေါင်းလိုက်ရင် — ဒီလိုမျိုး ဖြစ်နိုင်ပါတယ်:

```cjs
const http = require('node:http');

http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // ဒီအချိန်မှာ headers, method, url နဲ့ body တွေ ရှိနေပြီး — ဒီ request ကို
        // ပြန်ဖြေကြားဖို့ လိုသလို ဘာမဆို လုပ်နိုင်ပါပြီ
      });
  })
  .listen(8080); // ဒီ server ကို port 8080 မှာ နားထောင်စေပြီး activate လုပ်ခြင်း
```

ဒီဥပမာကို run ကြည့်ရင် — requests တွေကို _လက်ခံ_ နိုင်ပေမယ့် _ပြန်ဖြေကြား_ လို့ မရပါဘူး။ တကယ်တော့ web browser ကနေ ဒီဥပမာကို ဝင်ကြည့်ရင် — client ဆီ ဘာမှ ပြန်မပို့လို့ request က timeout ဖြစ်သွားပါလိမ့်မယ်။

ဒီအထိ `response` object ကို လုံးဝ မပြောရသေးပါဘူး — သူက [`ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse) ရဲ့ instance ဖြစ်ပြီး [`WritableStream`](https://nodejs.org/api/stream.html#stream_class_stream_writable) တစ်ခုပါ။ Client ဆီ data ပြန်ပို့ဖို့ အသုံးဝင်တဲ့ methods တွေ အများကြီး ပါဝင်ပါတယ်။ နောက်တစ်ခုမှာ ဒါတွေကို ပြောပါမယ်။

## HTTP Status Code

မသတ်မှတ်ထားရင် response ပေါ်က HTTP status code က အမြဲ 200 ပါ။ တကယ်တော့ HTTP response တိုင်း ဒါ မလိုအပ်ပါဘူး — တစ်ချိန်ချိန်မှာ မတူတဲ့ status code တစ်ခုကို ပို့ချင်လာမှာ သေချာပါတယ်။ ဒါလုပ်ဖို့ `statusCode` property ကို သတ်မှတ်နိုင်ပါတယ်:

```js
response.statusCode = 404; // resource မတွေ့ဘူးဆိုတာ client ကို ပြောခြင်း
```

ဒါအတွက် shortcut တချို့လည်း ရှိပါတယ် — မကြာခင် မြင်ရပါမယ်။

## Response Headers သတ်မှတ်ခြင်း

Headers တွေကို [`setHeader`](https://nodejs.org/api/http.html#http_response_setheader_name_value) လို့ခေါ်တဲ့ အဆင်ပြေတဲ့ method တစ်ခုကနေ သတ်မှတ်ပါတယ်:

```js
response.setHeader('Content-Type', 'application/json');
response.setHeader('X-Powered-By', 'bacon');
```

Response ပေါ်မှာ headers သတ်မှတ်တဲ့အခါ — အမည်တွေရဲ့ case က အရေးမကြီးပါဘူး (case insensitive)။ Header တစ်ခုကို ထပ်ခါထပ်ခါ သတ်မှတ်ရင် — နောက်ဆုံး သတ်မှတ်တဲ့ value ကိုပဲ ပို့ပေးပါတယ်။

## Header Data တွေကို ရှင်းရှင်းလင်းလင်း ပို့ခြင်း

အခုထိ ဆွေးနွေးခဲ့တဲ့ headers နဲ့ status code သတ်မှတ်တဲ့ methods တွေက "implicit headers" သုံးတယ်လို့ ယူဆပါတယ် — ဆိုလိုတာက body data မစပို့ခင် သင့်အတွက် headers တွေကို အချိန်မှန် node က ပို့ပေးမယ်လို့ မှီခိုနေတာပါ။

လိုချင်ရင် headers တွေကို response stream ဆီ _ရှင်းရှင်းလင်းလင်း_ (explicitly) ရေးနိုင်ပါတယ်။ ဒါအတွက် status code နဲ့ headers တွေကို stream ဆီ ရေးပေးတဲ့ [`writeHead`](https://nodejs.org/api/http.html#http_response_writehead_statuscode_statusmessage_headers) လို့ခေါ်တဲ့ method ရှိပါတယ်:

```js
response.writeHead(200, {
  'Content-Type': 'application/json',
  'X-Powered-By': 'bacon',
});
```

Headers တွေ သတ်မှတ်ပြီးတာနဲ့ (implicit ဖြစ်ဖြစ် explicit ဖြစ်ဖြစ်) — response data စပို့ဖို့ အဆင်သင့်ပါပဲ။

## Response Body ပို့ခြင်း

`response` object က [`WritableStream`](https://nodejs.org/api/stream.html#stream_class_stream_writable) ဖြစ်လို့ — response body ကို client ဆီ ရေးပို့တာက ပုံမှန် stream methods တွေ သုံးရုံပါပဲ:

```js
response.write('<html>');
response.write('<body>');
response.write('<h1>Hello, World!</h1>');
response.write('</body>');
response.write('</html>');
response.end();
```

Streams တွေပေါ်က `end` function က stream ရဲ့ နောက်ဆုံး data အပိုင်းအဖြစ် ပို့မယ့် optional data တချို့ကိုလည်း လက်ခံနိုင်ပါတယ် — ဒါကြောင့် အထက်က ဥပမာကို ဒီလို ရိုးရှင်းအောင် လုပ်နိုင်ပါတယ်:

```js
response.end('<html><body><h1>Hello, World!</h1></body></html>');
```

> Body ဆီ data chunks တွေ မစရေးခင် status နဲ့ headers တွေကို _အရင်_ သတ်မှတ်ထားဖို့ အရေးကြီးပါတယ်။ ဒါက ကျိုးကြောင်းဆီလျော်ပါတယ် — HTTP responses တွေမှာ headers တွေက body ရဲ့ ရှေ့မှာ လာလို့ပါ။

## Error တွေအကြောင်း နောက်ထပ် အမြန် မှတ်စု

`response` stream ကလည်း `'error'` events တွေ emit လုပ်နိုင်ပြီး — တစ်ချိန်ချိန်မှာ ဒါတွေကိုလည်း သင်ကိုင်တွယ်ရပါလိမ့်မယ်။ `request` stream errors တွေအတွက် ပြောထားတဲ့ အကြံပြုချက် အားလုံး ဒီမှာလည်း သက်ရောက်ပါတယ်။

## အားလုံး ပေါင်းစပ်လိုက်ခြင်း

HTTP responses လုပ်ပုံအကြောင်း လေ့လာပြီးပြီဆိုတော့ — အားလုံးကို ပေါင်းစပ်ကြည့်ရအောင်။ အရင် ဥပမာကို အခြေခံပြီး — user ဆီက ပို့လိုက်တဲ့ data အားလုံးကို ပြန်ပို့ပေးမယ့် server တစ်ခု ဆောက်ပါမယ်။ အဲဒီ data ကို `JSON.stringify` သုံးပြီး JSON အနေနဲ့ format လုပ်ပါမယ်။

```cjs
const http = require('node:http');

http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // အသစ် အပိုင်းရဲ့ အစ

        response.on('error', err => {
          console.error(err);
        });

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // Note: အထက်က ၂ ကြောင်းကို ဒီတစ်ကြောင်းနဲ့ အစားထိုးလို့ရတယ်:
        // response.writeHead(200, {'Content-Type': 'application/json'})

        const responseBody = { headers, method, url, body };

        response.write(JSON.stringify(responseBody));
        response.end();
        // Note: အထက်က ၂ ကြောင်းကို ဒီတစ်ကြောင်းနဲ့ အစားထိုးလို့ရတယ်:
        // response.end(JSON.stringify(responseBody))

        // အသစ် အပိုင်းရဲ့ အဆုံး
      });
  })
  .listen(8080);
```

## Echo Server ဥပမာ

အရင် ဥပမာကို ရိုးရှင်းအောင် လုပ်ပြီး — request ထဲမှာ ရတဲ့ data ကို response ထဲမှာ ချက်ချင်း ပြန်ပို့ပေးတဲ့ echo server လေးတစ်ခု ဆောက်ကြည့်ရအောင်။ လုပ်ရမှာက request stream ကနေ data ကို ယူပြီး အဲဒီ data ကို response stream ဆီ ရေးတာပါ — အရင်က လုပ်ခဲ့သလိုပါပဲ။

```cjs
const http = require('node:http');

http
  .createServer((request, response) => {
    let body = [];
    request
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        response.end(body);
      });
  })
  .listen(8080);
```

အခု ဒါကို ချိန်ညှိကြည့်ရအောင်။ အောက်ပါ အခြေအနေတွေမှာသာ echo ပြန်ပို့ချင်ပါတယ်:

- Request method က POST ဖြစ်ရမယ်။
- URL က `/echo` ဖြစ်ရမယ်။

အခြားကိစ္စတွေမှာ 404 နဲ့ပဲ ရိုးရိုး ပြန်ဖြေပါမယ်။

```cjs
const http = require('node:http');

http
  .createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
      let body = [];
      request
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', () => {
          body = Buffer.concat(body).toString();
          response.end(body);
        });
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

> URL ကို ဒီလိုမျိုး စစ်တာက "routing" ပုံစံတစ်ခုပါ။ တခြား routing ပုံစံတွေက `switch` statements လောက် ရိုးတာ ကနေ — [`express`](https://www.npmjs.com/package/express) လိုမျိုး framework တစ်ခုလုံး လောက် ရှုပ်ထွေးတာအထိ ရှိနိုင်ပါတယ်။ Routing တစ်ခုတည်းကိုပဲ လုပ်ပေးတာမျိုး ရှာနေရင် — [`router`](https://www.npmjs.com/package/router) ကို စမ်းကြည့်ပါ။

ကောင်းပြီ! အခု ဒါကို ပိုရိုးရှင်းအောင် လုပ်ကြည့်ရအောင်။ မှတ်ထားပါ — `request` object က [`ReadableStream`](https://nodejs.org/api/stream.html#stream_class_stream_readable) ဖြစ်ပြီး `response` object က [`WritableStream`](https://nodejs.org/api/stream.html#stream_class_stream_writable) ပါ။ ဆိုလိုတာက data တစ်ခုကနေ တစ်ခုဆီ ညွှန်ဖို့ [`pipe`](https://nodejs.org/api/stream.html#stream_readable_pipe_destination_options) ကို သုံးနိုင်ပါတယ်။ Echo server အတွက် လိုချင်တာ အတိအကျ ဒါပါပဲ!

```cjs
const http = require('node:http');

http
  .createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
      request.pipe(response);
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

Streams တွေ ကောင်းပါတယ်!

ဒါပေမယ့် ဒီနဲ့တင် ပြီးပြည့်စုံတာ မဟုတ်သေးပါဘူး။ ဒီ guide ထဲမှာ အကြိမ်ကြိမ် ပြောခဲ့သလို — errors တွေက ဖြစ်တတ်ပြီး ကိုင်တွယ်ဖို့ လိုပါတယ်။

Request stream ပေါ်က errors တွေကို ကိုင်တွယ်ဖို့ — error ကို `stderr` ဆီ log လုပ်ပြီး `Bad Request` ဖြစ်ကြောင်း ပြသဖို့ 400 status code ပို့ပါမယ်။ တကယ့် real-world application မှာတော့ — မှန်ကန်တဲ့ status code နဲ့ message ဘာဖြစ်မလဲ ဆုံးဖြတ်ဖို့ error ကို စစ်ဆေးချင်ပါလိမ့်မယ်။ Errors တွေနဲ့ ပတ်သက်လာရင် ထုံးစံအတိုင်း — [`Error` documentation](https://nodejs.org/api/errors.html) ကို တိုင်ပင်သင့်ပါတယ်။

Response ပေါ်မှာတော့ error ကို `stderr` ဆီ log လုပ်ရုံပါပဲ။

```cjs
const http = require('node:http');

http
  .createServer((request, response) => {
    request.on('error', err => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });
    response.on('error', err => {
      console.error(err);
    });
    if (request.method === 'POST' && request.url === '/echo') {
      request.pipe(response);
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

ဒီအထိ HTTP requests တွေကို ကိုင်တွယ်ခြင်းရဲ့ အခြေခံ အများစုကို ပြောပြီးပါပြီ။ ဒီအချိန်မှာ သင်လုပ်နိုင်သင့်တာတွေက:

- Request handler function ပါတဲ့ HTTP server တစ်ခု ဖန်တီးပြီး port တစ်ခုပေါ်မှာ listen လုပ်နိုင်ခြင်း။
- `request` objects တွေကနေ headers, URL, method နဲ့ body data တွေ ရယူနိုင်ခြင်း။
- `request` objects တွေထဲက URL နဲ့/ဒါမှမဟုတ် တခြား data တွေကို အခြေခံပြီး routing ဆုံးဖြတ်ချက်တွေ ချနိုင်ခြင်း။
- `response` objects တွေကနေ headers, HTTP status codes နဲ့ body data တွေ ပို့နိုင်ခြင်း။
- `request` objects တွေကနေ `response` objects တွေဆီ data pipe လုပ်နိုင်ခြင်း။
- `request` ရော `response` streams နှစ်ခုလုံးထဲက stream errors တွေကို ကိုင်တွယ်နိုင်ခြင်း။

ဒီအခြေခံတွေကနေ — အသုံးများတဲ့ use cases တော်တော်များများအတွက် Node.js HTTP servers တွေ တည်ဆောက်လို့ရပါတယ်။ ဒီ APIs တွေက ပေးထားတဲ့ တခြားအရာတွေ အများကြီး ရှိပါသေးတယ် — ဒါကြောင့် [`EventEmitters`](https://nodejs.org/api/events.html), [`Streams`](https://nodejs.org/api/stream.html) နဲ့ [`HTTP`](https://nodejs.org/api/http.html) တို့ရဲ့ API docs တွေကို သေချာ ဖတ်ကြည့်ပါ။

## ဆက်ဖတ်ရန်

- [Async Programming](/docs/nodejs/async-programming) — callback/promise/async-await ကွာခြားပုံ
- [Event Loop](/docs/nodejs/event-loop) — I/O operation တွေကို ဘယ်လို စီမံပေးသလဲ
