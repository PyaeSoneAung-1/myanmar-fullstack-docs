---
title: "Inspector"
description: "node:inspector module (experimental) — V8 inspector (devtools protocol) နဲ့ ဆက်သွယ်ခြင်း (inspector.Session …)။"
order: 95
source: "https://nodejs.org/api/inspector.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:inspector` module က V8 inspector နဲ့ အပြန်အလှန် ဆက်သွယ်လုပ်ဆောင်ဖို့ API တစ်ခု ပေးပါတယ်။

အောက်ပါအတိုင်း သုံးနိုင်ပါတယ်:

```mjs
import * as inspector from 'node:inspector/promises';
```

```cjs
const inspector = require('node:inspector/promises');
```

သို့မဟုတ်

```mjs
import * as inspector from 'node:inspector';
```

```cjs
const inspector = require('node:inspector');
```

## Promises API (promise အခြေပြု API)

> Stability: 1 - Experimental

### Class: `inspector.Session`

* Extends: {EventEmitter}

`inspector.Session` ကို V8 inspector back-end ဆီ messages တွေ ပို့ဖို့ နဲ့ message responses (တုံ့ပြန်မှုများ) နဲ့ notifications တွေကို လက်ခံဖို့ သုံးပါတယ်။

#### `new inspector.Session()`

`inspector.Session` class ရဲ့ instance အသစ်တစ်ခု ဖန်တီးပါတယ်။ Inspector session က — messages တွေကို inspector backend ဆီ မပို့ခင် [`session.connect()`][] ကနေ connect လုပ်ထားဖို့ လိုအပ်ပါတယ်။

`Session` ကို သုံးတဲ့အခါ console API က ထုတ်ပေးတဲ့ object တွေကို — `Runtime.DiscardConsoleEntries` command ကို ကိုယ်တိုင် မလုပ်ပေးရင် — release (လွှတ်ပေး) လုပ်မှာ မဟုတ်ပါဘူး။

#### Event: `'inspectorNotification'`

* Type: {Object} Notification message object တစ်ခု ဖြစ်ပါတယ်။

V8 Inspector ဆီကနေ notification တစ်ခုခု လက်ခံရရှိတိုင်း emit လုပ်ပါတယ်။

```js
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```

> **သတိပြုရန် (Caveat)** — same-thread session နဲ့ breakpoints ထားသုံးတာကို အကြံပြုလို့ မရပါဘူး — [support of breakpoints][] မှာ ကြည့်ပါ။

Method တစ်ခုချင်းအလိုက် notifications တွေကိုပဲ သီးသန့် subscribe လုပ်တာလည်း ဖြစ်နိုင်ပါတယ်:

#### Event: `<inspector-protocol-method>`

* Type: {Object} Notification message object တစ်ခု ဖြစ်ပါတယ်။

Method field ရဲ့ တန်ဖိုးက `<inspector-protocol-method>` နဲ့ ကိုက်ညီတဲ့ inspector notification တစ်ခုကို လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။

အောက်က snippet က [`'Debugger.paused'`][] event ပေါ်မှာ listener တစ်ခု တပ်ဆင်ပြီး — program execution ရပ်ဆိုင်းတိုင်း (ဥပမာ — breakpoints တွေကြောင့်) ဘာကြောင့် ရပ်ဆိုင်းသွားလဲ ဆိုတဲ့ အကြောင်းရင်းကို print လုပ်ပါတယ်:

```js
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```

> **သတိပြုရန် (Caveat)** — same-thread session နဲ့ breakpoints ထားသုံးတာကို အကြံပြုလို့ မရပါဘူး — [support of breakpoints][] မှာ ကြည့်ပါ။

#### `session.connect()`

Session တစ်ခုကို inspector back-end ဆီ connect လုပ်ပေးပါတယ်။

#### `session.connectToMainThread()`

Session တစ်ခုကို main thread inspector back-end ဆီ connect လုပ်ပေးပါတယ်။ ဒီ API ကို Worker thread ပေါ်မှာ မခေါ်ရင် exception တစ်ခု throw လုပ်ပါလိမ့်မယ်။

#### `session.disconnect()`

Session ကို ချက်ချင်း ပိတ်ပါတယ်။ ဆိုင်းငံ့ထားတဲ့ message callbacks အားလုံးကို error တစ်ခုနဲ့အတူ ခေါ်ပါလိမ့်မယ်။ Messages တွေ ပြန်ပို့နိုင်ဖို့ [`session.connect()`][] ကို ပြန်ခေါ်ပေးဖို့ လိုပါတယ်။ ပြန် connect လုပ်ထားတဲ့ session က inspector state အားလုံး — enabled လုပ်ထားတဲ့ agents (သို့) သတ်မှတ်ထားတဲ့ breakpoints စတာတွေ — ဆုံးရှုံးသွားပါလိမ့်မယ်။

#### `session.post(method[, params])`

* `method` {string}
* `params` {Object}
* Returns: {Promise}

Inspector back-end ဆီ message တစ်ခု ပို့ပေးပါတယ်။

```mjs
import { Session } from 'node:inspector/promises';
try {
  const session = new Session();
  session.connect();
  const result = await session.post('Runtime.evaluate', { expression: '2 + 2' });
  console.log(result);
} catch (error) {
  console.error(error);
}
// Output: { result: { type: 'number', value: 4, description: '4' } }
```

V8 inspector protocol ရဲ့ နောက်ဆုံး version ကို [Chrome DevTools Protocol Viewer][] မှာ ထုတ်ပြန်ထားပါတယ်။

Node.js inspector က V8 က ကြေညာထားတဲ့ Chrome DevTools Protocol domains အားလုံးကို support လုပ်ပါတယ်။ Chrome DevTools Protocol domain က — application state တွေကို စစ်ဆေးဖို့ နဲ့ run-time events တွေကို နားထောင်ဖို့ သုံးတဲ့ runtime agents တစ်ခုခုနဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ interface တစ်ခု ပေးပါတယ်။

#### ဥပမာ အသုံးပြုမှုများ (Example usage)

Debugger အပြင် V8 Profilers အမျိုးမျိုးကိုလည်း DevTools protocol ကနေ ရနိုင်ပါတယ်။

##### CPU profiler

[CPU Profiler][] ကို ဘယ်လို သုံးရမလဲ ပြထားတဲ့ ဥပမာတစ်ခုပါ:

```mjs
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();
session.connect();

await session.post('Profiler.enable');
await session.post('Profiler.start');
// Invoke business logic under measurement here...

// some time later...
const { profile } = await session.post('Profiler.stop');

// Write profile to disk, upload, etc.
fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
```

##### Heap profiler

[Heap Profiler][] ကို ဘယ်လို သုံးရမလဲ ပြထားတဲ့ ဥပမာတစ်ခုပါ:

```mjs
import { Session } from 'node:inspector/promises';
import fs from 'node:fs';
const session = new Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

const result = await session.post('HeapProfiler.takeHeapSnapshot', null);
console.log('HeapProfiler.takeHeapSnapshot done:', result);
session.disconnect();
fs.closeSync(fd);
```

## Callback API (callback အခြေပြု API)

### Class: `inspector.Session`

* Extends: {EventEmitter}

`inspector.Session` ကို V8 inspector back-end ဆီ messages တွေ ပို့ဖို့ နဲ့ message responses (တုံ့ပြန်မှုများ) နဲ့ notifications တွေကို လက်ခံဖို့ သုံးပါတယ်။

#### `new inspector.Session()`

`inspector.Session` class ရဲ့ instance အသစ်တစ်ခု ဖန်တီးပါတယ်။ Inspector session က — messages တွေကို inspector backend ဆီ မပို့ခင် [`session.connect()`][] ကနေ connect လုပ်ထားဖို့ လိုအပ်ပါတယ်။

`Session` ကို သုံးတဲ့အခါ console API က ထုတ်ပေးတဲ့ object တွေကို — `Runtime.DiscardConsoleEntries` command ကို ကိုယ်တိုင် မလုပ်ပေးရင် — release (လွှတ်ပေး) လုပ်မှာ မဟုတ်ပါဘူး။

#### Event: `'inspectorNotification'`

* Type: {Object} Notification message object တစ်ခု ဖြစ်ပါတယ်။

V8 Inspector ဆီကနေ notification တစ်ခုခု လက်ခံရရှိတိုင်း emit လုပ်ပါတယ်။

```js
session.on('inspectorNotification', (message) => console.log(message.method));
// Debugger.paused
// Debugger.resumed
```

> **သတိပြုရန် (Caveat)** — same-thread session နဲ့ breakpoints ထားသုံးတာကို အကြံပြုလို့ မရပါဘူး — [support of breakpoints][] မှာ ကြည့်ပါ။

Method တစ်ခုချင်းအလိုက် notifications တွေကိုပဲ သီးသန့် subscribe လုပ်တာလည်း ဖြစ်နိုင်ပါတယ်:

#### Event: `<inspector-protocol-method>`;

* Type: {Object} Notification message object တစ်ခု ဖြစ်ပါတယ်။

Method field ရဲ့ တန်ဖိုးက `<inspector-protocol-method>` နဲ့ ကိုက်ညီတဲ့ inspector notification တစ်ခုကို လက်ခံရရှိတဲ့အခါ emit လုပ်ပါတယ်။

အောက်က snippet က [`'Debugger.paused'`][] event ပေါ်မှာ listener တစ်ခု တပ်ဆင်ပြီး — program execution ရပ်ဆိုင်းတိုင်း (ဥပမာ — breakpoints တွေကြောင့်) ဘာကြောင့် ရပ်ဆိုင်းသွားလဲ ဆိုတဲ့ အကြောင်းရင်းကို print လုပ်ပါတယ်:

```js
session.on('Debugger.paused', ({ params }) => {
  console.log(params.hitBreakpoints);
});
// [ '/the/file/that/has/the/breakpoint.js:11:0' ]
```

> **သတိပြုရန် (Caveat)** — same-thread session နဲ့ breakpoints ထားသုံးတာကို အကြံပြုလို့ မရပါဘူး — [support of breakpoints][] မှာ ကြည့်ပါ။

#### `session.connect()`

Session တစ်ခုကို inspector back-end ဆီ connect လုပ်ပေးပါတယ်။

#### `session.connectToMainThread()`

Session တစ်ခုကို main thread inspector back-end ဆီ connect လုပ်ပေးပါတယ်။ ဒီ API ကို Worker thread ပေါ်မှာ မခေါ်ရင် exception တစ်ခု throw လုပ်ပါလိမ့်မယ်။

#### `session.disconnect()`

Session ကို ချက်ချင်း ပိတ်ပါတယ်။ ဆိုင်းငံ့ထားတဲ့ message callbacks အားလုံးကို error တစ်ခုနဲ့အတူ ခေါ်ပါလိမ့်မယ်။ Messages တွေ ပြန်ပို့နိုင်ဖို့ [`session.connect()`][] ကို ပြန်ခေါ်ပေးဖို့ လိုပါတယ်။ ပြန် connect လုပ်ထားတဲ့ session က inspector state အားလုံး — enabled လုပ်ထားတဲ့ agents (သို့) သတ်မှတ်ထားတဲ့ breakpoints စတာတွေ — ဆုံးရှုံးသွားပါလိမ့်မယ်။

#### `session.post(method[, params][, callback])`

* `method` {string}
* `params` {Object}
* `callback` {Function}

Inspector back-end ဆီ message တစ်ခု ပို့ပေးပါတယ်။ Response တစ်ခု လက်ခံရရှိတဲ့အခါ `callback` ကို အကြောင်းကြားပါလိမ့်မယ်။ `callback` က optional arguments နှစ်ခု — error နဲ့ message-specific result — ကို လက်ခံတဲ့ function တစ်ခု ဖြစ်ပါတယ်။

```js
session.post('Runtime.evaluate', { expression: '2 + 2' },
             (error, { result }) => console.log(result));
// Output: { type: 'number', value: 4, description: '4' }
```

V8 inspector protocol ရဲ့ နောက်ဆုံး version ကို [Chrome DevTools Protocol Viewer][] မှာ ထုတ်ပြန်ထားပါတယ်။

Node.js inspector က V8 က ကြေညာထားတဲ့ Chrome DevTools Protocol domains အားလုံးကို support လုပ်ပါတယ်။ Chrome DevTools Protocol domain က — application state တွေကို စစ်ဆေးဖို့ နဲ့ run-time events တွေကို နားထောင်ဖို့ သုံးတဲ့ runtime agents တစ်ခုခုနဲ့ အပြန်အလှန် ဆက်သွယ်ဖို့ interface တစ်ခု ပေးပါတယ်။

V8 ဆီ `HeapProfiler.takeHeapSnapshot` (သို့) `HeapProfiler.stopTrackingHeapObjects` command ပို့တဲ့အခါ `reportProgress` ကို `true` အဖြစ် သတ်မှတ်လို့ မရပါဘူး။

#### ဥပမာ အသုံးပြုမှုများ (Example usage)

Debugger အပြင် V8 Profilers အမျိုးမျိုးကိုလည်း DevTools protocol ကနေ ရနိုင်ပါတယ်။

##### CPU profiler

[CPU Profiler][] ကို ဘယ်လို သုံးရမလဲ ပြထားတဲ့ ဥပမာတစ်ခုပါ:

```js
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();
session.connect();

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {
    // Invoke business logic under measurement here...

    // some time later...
    session.post('Profiler.stop', (err, { profile }) => {
      // Write profile to disk, upload, etc.
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile));
      }
    });
  });
});
```

##### Heap profiler

[Heap Profiler][] ကို ဘယ်လို သုံးရမလဲ ပြထားတဲ့ ဥပမာတစ်ခုပါ:

```js
const inspector = require('node:inspector');
const fs = require('node:fs');
const session = new inspector.Session();

const fd = fs.openSync('profile.heapsnapshot', 'w');

session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(fd, m.params.chunk);
});

session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
  console.log('HeapProfiler.takeHeapSnapshot done:', err, r);
  session.disconnect();
  fs.closeSync(fd);
});
```

## Common Objects (ဘုံ object များ)

### `inspector.close()`

Inspector ကို deactivate လုပ်ပါတယ်။ Active connections တွေ ရှိနေရင် သူတို့ကို အတင်းအကျပ် terminate လုပ်ပါတယ်။ Inspector server လုံးဝ ရပ်တန့်သွားတဲ့အထိ စောင့်ဆိုင်းပါတယ်။

### `inspector.console`

* Type: {Object} Remote inspector console ဆီ messages ပို့ဖို့ object တစ်ခု။

```js
require('node:inspector').console.log('a message');
```

Inspector console က Node.js console နဲ့ API parity (တူညီမှု) မရှိပါဘူး။

### `inspector.open([port[, host[, wait]]])`

* `port` {number} Inspector connections အတွက် နားထောင်ရမယ့် port။ Optional။
  **Default:** CLI မှာ သတ်မှတ်ထားတဲ့အတိုင်း။
* `host` {string} Inspector connections အတွက် နားထောင်ရမယ့် host။ Optional။
  **Default:** CLI မှာ သတ်မှတ်ထားတဲ့အတိုင်း။
* `wait` {boolean} Client တစ်ယောက် ချိတ်ဆက်သည်အထိ စောင့်ဆိုင်းခြင်း။ Optional။
  **Default:** `false`။
* Returns: {Disposable} [`inspector.close()`][] ကို ခေါ်ပေးတဲ့ Disposable တစ်ခု။

Inspector ကို host နဲ့ port ပေါ်မှာ activate လုပ်ပါတယ်။ `node --inspect=[[host:]port]` နဲ့ ညီမျှပြီး — node စတင်ပြီးနောက်မှာ programmatically လုပ်လို့ရတာက ကွာခြားပါတယ်။

`wait` က `true` ဆိုရင် — client တစ်ယောက် inspect port ဆီ ချိတ်ဆက်ပြီး flow control ကို debugger client ဆီ လွှဲပြောင်းပေးသည်အထိ စောင့်ဆိုင်းပါတယ်။

`host` parameter သုံးစွဲမှုနဲ့ ပတ်သက်တဲ့ [security warning][] ကို ကြည့်ပါ။

### `inspector.url()`

* Returns: {string|undefined}

Active inspector ရဲ့ URL ကို ပြန်ပေးပါတယ် — ဘာမှ မရှိရင်တော့ `undefined` ကို ပြန်ပေးပါတယ်။

```console
$ node --inspect -p 'inspector.url()'
Debugger listening on ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34
For help, see: https://nodejs.org/learn/getting-started/debugging
ws://127.0.0.1:9229/166e272e-7a30-4d09-97ce-f1c012b43c34

$ node --inspect=localhost:3000 -p 'inspector.url()'
Debugger listening on ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a
For help, see: https://nodejs.org/learn/getting-started/debugging
ws://localhost:3000/51cf8d0e-3c36-4c59-8efd-54519839e56a

$ node -p 'inspector.url()'
undefined
```

### `inspector.waitForDebugger()`

Client တစ်ယောက် (ရှိပြီးသား (သို့) နောက်မှ ချိတ်ဆက်လာသူ) က `Runtime.runIfWaitingForDebugger` command ပို့တဲ့အထိ စောင့်ဆိုင်းပါတယ်။

Active inspector မရှိရင် exception တစ်ခု throw လုပ်ပါလိမ့်မယ်။

## Integration with DevTools (DevTools နဲ့ ပေါင်းစည်းခြင်း)

> Stability: 1.1 - Active development

`node:inspector` module က Chrome DevTools Protocol ကို support လုပ်တဲ့ devtools တွေနဲ့ ပေါင်းစည်းဖို့ API တစ်ခု ပေးပါတယ်။ Run နေတဲ့ Node.js instance တစ်ခုဆီ ချိတ်ဆက်ထားတဲ့ DevTools frontends တွေက — instance ကနေ emit လုပ်တဲ့ protocol events တွေကို ဖမ်းယူပြီး debugging ပိုလွယ်ကူစေဖို့ အဲဒါတွေကို ပြသပေးနိုင်ပါတယ်။ အောက်က methods တွေက protocol event တစ်ခုကို ချိတ်ဆက်ထားတဲ့ frontends အားလုံးဆီ broadcast လုပ်ပါတယ်။ Methods တွေဆီ ပေးလိုက်တဲ့ `params` တွေက protocol အပေါ် မူတည်ပြီး optional ဖြစ်နိုင်ပါတယ်။

```js
// The `Network.requestWillBeSent` event will be fired.
inspector.Network.requestWillBeSent({
  requestId: 'request-id-1',
  timestamp: Date.now() / 1000,
  wallTime: Date.now(),
  request: {
    url: 'https://nodejs.org/en',
    method: 'GET',
  },
});
```

### `inspector.Network.dataReceived([params])`

* `params` {Object}

ဒီ feature က `--experimental-network-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`Network.dataReceived` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ် — ဒါမှမဟုတ် ပေးထားတဲ့ request အတွက် `Network.streamResourceContent` command ကို မခေါ်ရသေးရင် data ကို buffer လုပ်ထားပါတယ်။

ပြီးတော့ response data ကို ပြန်ယူနိုင်ဖို့ `Network.getResponseBody` command ကိုလည်း enable လုပ်ပေးပါတယ်။

### `inspector.Network.dataSent([params])`

* `params` {Object}

ဒီ feature က `--experimental-network-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

Request data ကို ပြန်ယူနိုင်ဖို့ `Network.getRequestPostData` command ကို enable လုပ်ပေးပါတယ်။

### `inspector.Network.requestWillBeSent([params])`

* `params` {Object}

ဒီ feature က `--experimental-network-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`Network.requestWillBeSent` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ်။ ဒီ event က application က HTTP request တစ်ခု ပို့တော့မယ်ဆိုတာကို အချက်ပြပါတယ်။

### `inspector.Network.responseReceived([params])`

* `params` {Object}

ဒီ feature က `--experimental-network-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`Network.responseReceived` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ်။ ဒီ event က HTTP response ရနေပြီဆိုတာကို အချက်ပြပါတယ်။

### `inspector.Network.loadingFinished([params])`

* `params` {Object}

ဒီ feature က `--experimental-network-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`Network.loadingFinished` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ်။ ဒီ event က HTTP request load လုပ်ပြီးသွားပြီဆိုတာကို အချက်ပြပါတယ်။

### `inspector.Network.loadingFailed([params])`

* `params` {Object}

ဒီ feature က `--experimental-network-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`Network.loadingFailed` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ်။ ဒီ event က HTTP request load လုပ်ရာမှာ မအောင်မြင်ခဲ့ကြောင်း အချက်ပြပါတယ်။

### `inspector.Network.webSocketCreated([params])`

* `params` {Object}

ဒီ feature က `--experimental-network-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`Network.webSocketCreated` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ်။ ဒီ event က WebSocket connection တစ်ခု စတင်လိုက်ပြီဆိုတာကို အချက်ပြပါတယ်။

### `inspector.Network.webSocketHandshakeResponseReceived([params])`

* `params` {Object}

ဒီ feature က `--experimental-network-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`Network.webSocketHandshakeResponseReceived` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ်။ ဒီ event က WebSocket handshake response ကို လက်ခံရရှိပြီဆိုတာကို အချက်ပြပါတယ်။

### `inspector.Network.webSocketClosed([params])`

* `params` {Object}

ဒီ feature က `--experimental-network-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`Network.webSocketClosed` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ်။ ဒီ event က WebSocket connection တစ်ခု ပိတ်လိုက်ပြီဆိုတာကို အချက်ပြပါတယ်။

### `inspector.NetworkResources.put`

> Stability: 1.1 - Active Development

ဒီ feature က `--experimental-inspector-network-resource` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`inspector.NetworkResources.put` method က Chrome DevTools Protocol (CDP) ကနေ ထုတ်ပေးတဲ့ loadNetworkResource request အတွက် response တစ်ခု ပေးဖို့ သုံးပါတယ်။ ပုံမှန်အားဖြင့် — source map တစ်ခုကို URL နဲ့ သတ်မှတ်ထားပြီး Chrome လိုမျိုး DevTools frontend တစ်ခုက source map ကို ရယူဖို့ resource ကို တောင်းဆိုတဲ့အခါ ဖြစ်ပေါ်ပါတယ်။

ဒီ method က developer တွေအနေနဲ့ — ဒီလို CDP requests တွေကို တုံ့ပြန်တဲ့အနေနဲ့ ပေးမယ့် resource content ကို ကြိုတင် သတ်မှတ်နိုင်အောင် လုပ်ပေးပါတယ်။

```js
const inspector = require('node:inspector');
// By preemptively calling put to register the resource, a source map can be resolved when
// a loadNetworkResource request is made from the frontend.
async function setNetworkResources() {
  const mapUrl = 'http://localhost:3000/dist/app.js.map';
  const tsUrl = 'http://localhost:3000/src/app.ts';
  const distAppJsMap = await fetch(mapUrl).then((res) => res.text());
  const srcAppTs = await fetch(tsUrl).then((res) => res.text());
  inspector.NetworkResources.put(mapUrl, distAppJsMap);
  inspector.NetworkResources.put(tsUrl, srcAppTs);
};
setNetworkResources().then(() => {
  require('./dist/app');
});
```

အသေးစိတ်အတွက် official CDP documentation ကို ကြည့်ပါ: [Network.loadNetworkResource](https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-loadNetworkResource)

### `inspector.DOMStorage.domStorageItemAdded`

* `params` {Object}
  * `storageId` {Object}
    * `securityOrigin` {string}
    * `storageKey` {string}
    * `isLocalStorage` {boolean}
  * `key` {string}
  * `newValue` {string}

ဒီ feature က `--experimental-storage-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`DOMStorage.domStorageItemAdded` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ်။ ဒီ event က storage ထဲကို item အသစ်တစ်ခု ထည့်လိုက်ပြီဆိုတာကို အချက်ပြပါတယ်။

### `inspector.DOMStorage.domStorageItemRemoved`

* `params` {Object}
  * `storageId` {Object}
    * `securityOrigin` {string}
    * `storageKey` {string}
    * `isLocalStorage` {boolean}
  * `key` {string}

ဒီ feature က `--experimental-storage-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`DOMStorage.domStorageItemRemoved` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ်။ ဒီ event က storage ထဲက item တစ်ခုကို ဖယ်ရှားလိုက်ပြီဆိုတာကို အချက်ပြပါတယ်။

### `inspector.DOMStorage.domStorageItemUpdated`

* `params` {Object}
  * `storageId` {Object}
    * `securityOrigin` {string}
    * `storageKey` {string}
    * `isLocalStorage` {boolean}
  * `key` {string}
  * `oldValue` {string}
  * `newValue` {string}

ဒီ feature က `--experimental-storage-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`DOMStorage.domStorageItemUpdated` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ်။ ဒီ event က storage item တစ်ခု update လုပ်လိုက်ပြီဆိုတာကို အချက်ပြပါတယ်။

### `inspector.DOMStorage.domStorageItemsCleared`

* `params` {Object}
  * `storageId` {Object}
    * `securityOrigin` {string}
    * `storageKey` {string}
    * `isLocalStorage` {boolean}

ဒီ feature က `--experimental-storage-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

`DOMStorage.domStorageItemsCleared` event ကို ချိတ်ဆက်ထားတဲ့ frontends တွေဆီ broadcast လုပ်ပါတယ်။ ဒီ event က storage ထဲက item အားလုံးကို ရှင်းလင်းလိုက်ပြီဆိုတာကို အချက်ပြပါတယ်။

### `inspector.DOMStorage.registerStorage`

* `params` {Object}
  * `isLocalStorage` {boolean}
  * `storageMap` {Object}

ဒီ feature က `--experimental-storage-inspection` flag ဖွင့်ထားမှသာ ရနိုင်ပါတယ်။

## Support of breakpoints

Chrome DevTools Protocol ရဲ့ [`Debugger` domain][] က `inspector.Session` တစ်ခုကို program တစ်ခုဆီ attach လုပ်ပြီး — code တွေကို step through လုပ်ဖို့ breakpoints တွေ ထားနိုင်အောင် ခွင့်ပြုပါတယ်။

ဒါပေမယ့် [`session.connect()`][] နဲ့ ချိတ်ဆက်ထားတဲ့ same-thread `inspector.Session` နဲ့ breakpoints ထားတာကို ရှောင်သင့်ပါတယ် — attach လုပ်ပြီး pause လုပ်ခံရတဲ့ program က debugger ကိုယ်တိုင် ဖြစ်နေလို့ပါ။ အဲဒီအစား [`session.connectToMainThread()`][] နဲ့ main thread ဆီ connect လုပ်ပြီး worker thread တစ်ခုထဲမှာ breakpoints ထားကြည့်ပါ — (သို့) WebSocket connection တစ်ခုကနေ [Debugger][] program တစ်ခုနဲ့ ချိတ်ဆက်ပါ။

[CPU Profiler]: https://chromedevtools.github.io/devtools-protocol/v8/Profiler
[Chrome DevTools Protocol Viewer]: https://chromedevtools.github.io/devtools-protocol/v8/
[Debugger]: debugger.md
[Heap Profiler]: https://chromedevtools.github.io/devtools-protocol/v8/HeapProfiler
[`'Debugger.paused'`]: https://chromedevtools.github.io/devtools-protocol/v8/Debugger#event-paused
[`Debugger` domain]: https://chromedevtools.github.io/devtools-protocol/v8/Debugger
[`inspector.close()`]: #inspectorclose
[`session.connect()`]: #sessionconnect
[`session.connectToMainThread()`]: #sessionconnecttomainthread
[security warning]: cli.md#warning-binding-inspector-to-a-public-ipport-combination-is-insecure
[support of breakpoints]: #support-of-breakpoints
