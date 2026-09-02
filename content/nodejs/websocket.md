---
title: "Node.js မှာ Native WebSocket Client သုံးခြင်း"
description: "Node.js ရဲ့ built-in native WebSocket client အကြောင်း — WebSocket ဆိုတာ ဘာလဲ၊ connection ဖွင့်ခြင်း၊ message ပို့/လက်ခံခြင်း၊ JSON data ဖလှယ်ခြင်း"
order: 42
source: "https://nodejs.org/learn/getting-started/websocket"
status: translated
updated: 2026-09-02
---

## မိတ်ဆက်

Node.js v21 ကစပြီး — [Undici](https://undici.nodejs.org) library ကို သုံးပြီး [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) ကို မြှင့်တင်ခဲ့ပြီး — built-in WebSocket client တစ်ခု ပါဝင်လာပါတယ်။ ဒါက Node.js application တွေအတွက် real-time ဆက်သွယ်ရေးကို ရိုးရှင်းစေပါတယ်။ [Node.js v22.4.0](https://github.com/nodejs/node/releases/tag/v22.4.0) release မှာတော့ WebSocket API ကို stable အဖြစ် သတ်မှတ်လိုက်ပြီး — production မှာ သုံးဖို့ အသင့်ဖြစ်နေပါပြီ။

## WebSocket ဆိုတာ ဘာလဲ

[WebSocket](https://en.wikipedia.org/wiki/WebSocket) က standardized communication protocol တစ်ခုဖြစ်ပြီး — TCP connection တစ်ခုတည်းပေါ်မှာ နှစ်ဖက် တစ်ပြိုင်နက် (two-way) ဆက်သွယ်မှု လုပ်နိုင်စေပါတယ်။ HTTP နဲ့ ကွဲပြားစေတဲ့ အချက်က — full-duplex (သို့) bi-directional စွမ်းရည် ရှိတာပါ။ WebSocket က HTTP Upgrade header ကို သုံးပြီး protocol ပြောင်းတာမို့ — HTTP နဲ့ compatible ဖြစ်ပါတယ်။ ဒါက server တွေကို client ရဲ့ ကနဦး request မလိုဘဲ content တွေ တွန်းပို့ (push) နိုင်စေပြီး — message တွေ အဆက်မပြတ် ဖလှယ်နိုင်ဖို့ connection တွေကို ဖွင့်ထားနိုင်ပါတယ်။ ဒါကြောင့် HTTP polling လိုမျိုး အခြားနည်းလမ်းတွေထက် overhead နည်းပြီး — real-time data ပို့ဆောင်မှုအတွက် အကောင်းဆုံး ဖြစ်ပါတယ်။ WebSocket ဆက်သွယ်ရေးက ပုံမှန်အားဖြင့် TCP port 443 (secure) (သို့) port 80 (secure မဟုတ်) ပေါ်မှာ လုပ်ဆောင်ပြီး — web နဲ့ မဆိုင်တဲ့ connection တွေအပေါ် firewall ကန့်သတ်ချက်တွေကို ကျော်လွှားနိုင်အောင် ကူညီပေးပါတယ်။ ဒီ protocol က encrypt မလုပ်ထားတဲ့ connection တွေအတွက် `ws://` နဲ့ encrypt လုပ်ထားတဲ့ connection တွေအတွက် `wss://` ဆိုပြီး — ကိုယ်ပိုင် URI scheme တွေ သတ်မှတ်ထားပြီး — browser အဓိကတွေ အားလုံးက ထောက်ပံ့ပါတယ်။

## Native WebSocket Client

Node.js က အခုဆို — client connection တွေအတွက် `ws` (သို့) `socket.io` လိုမျိုး external library တွေကို အားမကိုးဘဲ — WebSocket `client` တစ်ခုအနေနဲ့ လုပ်ဆောင်နိုင်ပါပြီ။ ဒါက Node.js application တွေကို outgoing WebSocket connection တွေ တိုက်ရိုက် စတင်ပြီး စီမံခန့်ခွဲနိုင်စေပြီး — real-time data feed တွေဆီ ချိတ်ဆက်တာ၊ တခြား WebSocket server တွေနဲ့ အပြန်အလှန် ဆက်သွယ်တာလိုမျိုး အလုပ်တွေကို ရိုးရှင်းစေပါတယ်။ User တွေက standard [new WebSocket()](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) constructor နဲ့ websocket client connection တစ်ခုကို အခု ဖန်တီးလို့ရပါပြီ။

အပေါ်က အခြေခံကို ဆက်ပြီး — WebSocket client ရဲ့ လုပ်ဆောင်ချက်အသစ်ကို သရုပ်ပြတဲ့ လက်တွေ့ ဥပမာတွေ ထပ်ထည့်ကြည့်ရအောင်။ ဒါတွေက အခြေခံအသုံးပြုမှုပုံစံ (basic use case) တွေကို ပြသထားပါတယ်။

### အခြေခံ Connection နဲ့ Message ကိုင်တွယ်ခြင်း

```js
// သတ်မှတ်ထားတဲ့ URL ဆီ WebSocket connection အသစ်တစ်ခု ဖန်တီးတယ်။
const socket = new WebSocket('ws://localhost:8080');

// Connection ကို အောင်မြင်စွာ တည်ဆောက်ပြီးတဲ့အခါ run လုပ်တယ်။
socket.addEventListener('open', event => {
  console.log('WebSocket connection established!');
  // WebSocket server ဆီ message တစ်ခု ပို့တယ်။
  socket.send('Hello Server!');
});

// Server ဆီကနေ message တစ်ခု လက်ခံရရှိတဲ့အခါ run လုပ်တယ်။
socket.addEventListener('message', event => {
  console.log('Message from server: ', event.data);
});

// Connection ပိတ်သွားတဲ့အခါ run လုပ်ပြီး — close code နဲ့ reason ကို ပေးပါတယ်။
socket.addEventListener('close', event => {
  console.log('WebSocket connection closed:', event.code, event.reason);
});

// WebSocket ဆက်သွယ်ရေးအတွင်း error တစ်ခုခု ဖြစ်ခဲ့ရင် run လုပ်တယ်။
socket.addEventListener('error', error => {
  console.error('WebSocket error:', error);
});
```

### JSON Data ပို့ခြင်းနဲ့ လက်ခံခြင်း

```js
const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', () => {
  const data = { type: 'message', content: 'Hello from Node.js!' };
  socket.send(JSON.stringify(data));
});

socket.addEventListener('message', event => {
  try {
    const receivedData = JSON.parse(event.data);
    console.log('Received JSON:', receivedData);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    console.log('Received data was:', event.data);
  }
});
```

အပေါ်က JavaScript code က WebSocket application တွေမှာ အသုံးများတဲ့ — JSON data ပို့တာနဲ့ လက်ခံတာကို သရုပ်ပြပါတယ်။ ပို့တဲ့အခါမှာ [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) ကို သုံးပြီး JavaScript object တွေကို JSON string အဖြစ် ပြောင်းပြီးမှ ပို့ပါတယ်။ လက်ခံရတဲ့ string ကိုတော့ [JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) နဲ့ JavaScript object အဖြစ် ပြန်ပြောင်းပါတယ်။ နောက်ဆုံးမှာ JSON parsing အတွက် error handling တွေလည်း ထည့်ထားပါတယ်။

ဒါက dependency စီမံခန့်ခွဲမှု လျော့ကျစေပြီး — compatibility ကို ပိုကောင်းစေပါတယ်။ Developer တွေက WebSocket client library တွေကို သပ်သပ် install လုပ်ပြီး ထိန်းသိမ်းစရာ မလိုတော့ပါဘူး။ Built-in implementation က ခေတ်မီ web standard တွေနဲ့ ကိုက်ညီပြီး — ပိုကောင်းတဲ့ interoperability (အပြန်အလှန် လိုက်ဖက်ညီမှု) ကို ရရှိစေပါတယ်။ ဒီမြှင့်တင်မှုက WebSocket ဆက်သွယ်ရေးရဲ့ client ဘက်ကို အဓိက ဦးတည်ပြီး — Node.js ကို WebSocket client တစ်ခုအနေနဲ့ လုပ်ဆောင်နိုင်စေတာပါ။

## နားလည်ထားရမယ့် အရေးကြီးအချက်

Node.js v22 မှာ built-in native WebSocket **server** implementation ကိုတော့ **မပါဝင်ပါဘူး**။ Web browser တွေ (သို့) တခြား client တွေဆီက ဝင်လာတဲ့ connection တွေကို လက်ခံတဲ့ WebSocket server တစ်ခု ဖန်တီးဖို့ဆိုရင် — [ws](https://www.npmjs.com/package/ws) (သို့) [socket.io](https://www.npmjs.com/package/socket.io) လိုမျိုး library တွေကို သုံးနေဖို့ လိုပါသေးတယ်။ ဆိုလိုတာက — Node.js က WebSocket server တွေဆီ အခု အလွယ်တကူ **ချိတ်ဆက်**နိုင်ပေမယ့် — WebSocket server **ဖြစ်လာဖို့**ကတော့ external tool တွေ လိုနေပါသေးတယ်။

## အနှစ်ချုပ်

Node.js v22 က application တွေကို WebSocket server တွေနဲ့ `client` တစ်ခုအနေနဲ့ ချောမွေ့စွာ အပြန်အလှန် ဆက်သွယ်နိုင်စေပေမယ့် — Node.js ထဲမှာ WebSocket server တွေ ဖန်တီးတာကတော့ ရင့်ကျက်ပြီးသား library တွေအပေါ်မှာ မှီခိုနေပါသေးတယ်။ Node.js project တွေမှာ real-time ဆက်သွယ်ရေး အကောင်အထည်ဖော်တဲ့အခါ developer တွေ နားလည်ထားရမယ့် အရေးကြီးတဲ့ ကွာခြားချက်က ဒါပါပဲ။

## ဆက်ဖတ်ရန်

- [Fetching Data with Node.js](/docs/nodejs/fetching-data-with-nodejs) — HTTP requests တွေနဲ့ data ဖတ်ယူခြင်း
- [Anatomy of an HTTP Transaction](/docs/nodejs/anatomy-of-an-http-transaction) — HTTP server တစ်ခု ဘယ်လို အလုပ်လုပ်လဲဆိုတဲ့ ခြုံငုံသုံးသပ်ချက်
- [The Node.js Event Emitter](/docs/nodejs/the-nodejs-event-emitter) — event-based code ရေးသားခြင်း
