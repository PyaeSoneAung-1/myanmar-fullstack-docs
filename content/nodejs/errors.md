---
title: "Errors"
description: "Node.js error handling — error classes (Error, TypeError, RangeError…), error propagation & interception, ERR_*/HPE_*/OpenSSL error codes အပြည့်အစုံ (error.code, error.cause, stack traces စသည်)"
order: 137
source: "https://nodejs.org/api/errors.html"
status: translated
updated: 2026-09-04
---

Node.js မှာ run လုပ်နေတဲ့ applications တွေဟာ ယေဘုယျအားဖြင့် အောက်ပါ error အမျိုးအစားတွေကို ကြုံတွေ့ရလေ့ ရှိပါတယ်:

* {EvalError}, {SyntaxError}, {RangeError}, {ReferenceError}, {TypeError} နဲ့
  {URIError} စတဲ့ standard JavaScript errors တွေ။
* Standard `DOMException`s တွေ။
* Operating system ရဲ့ အောက်ခံ (underlying) ကန့်သတ်ချက်တွေကြောင့် ဖြစ်ပေါ်လာတဲ့ system errors တွေ — ဥပမာ မရှိတဲ့ file တစ်ခုကို ဖွင့်ဖို့ ကြိုးစားတာ ဒါမှမဟုတ် ပိတ်ထားပြီးသား socket တစ်ခုပေါ်ကို data ပို့ဖို့ ကြိုးစားတာမျိုးတွေကြောင့် ဖြစ်ပါတယ်။
* `AssertionError`s တွေက error ရဲ့ အထူး class တစ်မျိုး ဖြစ်ပြီး — Node.js က ဘယ်တော့မှ မဖြစ်သင့်တဲ့ ထူးခြားတဲ့ logic ချိုးဖောက်မှု (logic violation) တစ်ခုကို တွေ့ရှိတဲ့အခါ trigger လုပ်လေ့ ရှိပါတယ်။ ဒါတွေကို ပုံမှန်အားဖြင့် `node:assert` module က ထုတ်ပေးတာပါ။
* Application code ကြောင့် trigger လုပ်လိုက်တဲ့ user-specified (သုံးစွဲသူက သတ်မှတ်လိုက်တဲ့) errors တွေ။

Node.js က ထုတ်ပေးတဲ့ JavaScript နဲ့ system errors တွေ အားလုံးဟာ standard JavaScript {Error} class ကနေ အမွေဆက်ခံတဲ့ (inherit) ဟာတွေ သို့မဟုတ် အဲဒီ class ရဲ့ instances တွေ ဖြစ်ပြီး — အဲဒီ class မှာ ရနိုင်တဲ့ properties တွေကို _အနည်းဆုံး_ (at least) ပေးအပ်မယ်လို့ အာမခံထားပါတယ်။

Node.js က ထုတ်ပေးတဲ့ errors တွေရဲ့ [`error.message`][] property က version မရွေး ပြောင်းလဲသွားနိုင်ပါတယ်။ အဲဒီအစား error တစ်ခုကို ခွဲခြားသတ်မှတ်ဖို့ [`error.code`][] ကို သုံးပါ။ `DOMException` တစ်ခုအတွက်ဆိုရင် ၎င်းရဲ့ အမျိုးအစားကို ခွဲခြားဖို့ [`domException.name`][] ကို သုံးပါ။

## Error တွေ ပျံ့နှံ့ခြင်းနဲ့ ကြားဖြတ် ဖမ်းယူခြင်း (Error propagation and interception)

Application တစ်ခု run လုပ်နေစဉ်အတွင်း ဖြစ်ပေါ်လာတဲ့ errors တွေကို ပျံ့နှံ့စေခြင်းနဲ့ ကိုင်တွယ်ခြင်းအတွက် Node.js က ယန္တရား (mechanism) အများအပြားကို support လုပ်ပါတယ်။ ဒီ errors တွေကို ဘယ်လို report လုပ်ပြီး ကိုင်တွယ်မလဲဆိုတာက `Error` ရဲ့ အမျိုးအစား နဲ့ ခေါ်ယူလိုက်တဲ့ API ရဲ့ ပုံစံ (style) အပေါ်မှာ လုံးဝ မူတည်ပါတယ်။

JavaScript errors တွေ အားလုံးကို exceptions အဖြစ် ကိုင်တွယ်ပြီး — standard JavaScript `throw` mechanism ကို သုံးကာ error တစ်ခုကို _ချက်ချင်း_ (immediately) ဖန်တီး ထုတ်လွှင့် (throw) လုပ်ပါတယ်။ ဒါတွေကို JavaScript language က ပံ့ပိုးပေးထားတဲ့ [`try…catch` construct][try-catch] နဲ့ ကိုင်တွယ်ပါတယ်။

```js
// Throws with a ReferenceError because z is not defined.
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // Handle the error here.
}
```

Any use of the JavaScript `throw` mechanism က exception တစ်ခုကို ထုတ်ပေးပြီး — အဲဒါကို _မဖြစ်မနေ_ (must) ကိုင်တွယ်ရမှာ ဖြစ်ကာ မကိုင်တွယ်ရင် Node.js process က ချက်ချင်း ထွက်သွားပါလိမ့်မယ်။

ခြွင်းချက် အနည်းငယ်ကလွဲရင် — _Synchronous_ (တစ်ပြိုင်နက်တည်း) APIs တွေ ({Promise} တစ်ခုကို ပြန်မပေးတဲ့ ဒါမှမဟုတ် `callback` function တစ်ခုကို လက်မခံတဲ့ blocking method တွေ ဖြစ်တဲ့ [`fs.readFileSync`][] လိုမျိုး) က errors တွေကို report လုပ်ဖို့ `throw` ကို သုံးပါတယ်။

_Asynchronous APIs_ တွေအတွင်းမှာ ဖြစ်ပေါ်လာတဲ့ errors တွေကို နည်းလမ်းများစွာနဲ့ report လုပ်နိုင်ပါတယ်:

* Asynchronous methods အချို့က {Promise} တစ်ခုကို ပြန်ပေးပါတယ် — အဲဒီ promise က rejected (ပယ်ချခံရ) နိုင်တယ်ဆိုတာကို အမြဲတမ်း ထည့်သွင်း စဉ်းစားထားသင့်ပါတယ်။ Unhandled promise rejection (ကိုင်တွယ်မှု မရှိတဲ့ promise rejection) တစ်ခုကို process က ဘယ်လို တုံ့ပြန်မလဲဆိုတာကို [`--unhandled-rejections`][] flag မှာ ကြည့်ပါ။

  

  ```js
  const fs = require('node:fs/promises');

  (async () => {
    let data;
    try {
      data = await fs.readFile('a file that does not exist');
    } catch (err) {
      console.error('There was an error reading the file!', err);
      return;
    }
    // Otherwise handle the data
  })();
  ```

* `callback` function တစ်ခုကို လက်ခံတဲ့ asynchronous methods အများစုက — အဲဒီ function ဆီကို ပထမ argument အဖြစ် ဖြတ်သန်းပေးလိုက်တဲ့ `Error` object တစ်ခုကို လက်ခံပါတယ်။ ဒီ ပထမ argument က `null` မဟုတ်ဘဲ `Error` ရဲ့ instance တစ်ခု ဖြစ်နေရင် — error တစ်ခု ဖြစ်ပွားခဲ့ပြီး ကိုင်တွယ်သင့်တယ်လို့ ဆိုလိုပါတယ်။

  

  ```js
  const fs = require('node:fs');
  fs.readFile('a file that does not exist', (err, data) => {
    if (err) {
      console.error('There was an error reading the file!', err);
      return;
    }
    // Otherwise handle the data
  });
  ```

* [`EventEmitter`][] တစ်ခု ဖြစ်တဲ့ object တစ်ခုပေါ်မှာ asynchronous method တစ်ခုကို ခေါ်လိုက်တဲ့အခါ — errors တွေကို အဲဒီ object ရဲ့ `'error'` event ဆီကို လမ်းကြောင်းလွှဲ (route) လုပ်လို့ ရပါတယ်။

  ```js
  const net = require('node:net');
  const connection = net.connect('localhost');

  // Adding an 'error' event handler to a stream:
  connection.on('error', (err) => {
    // If the connection is reset by the server, or if it can't
    // connect at all, or on any sort of error encountered by
    // the connection, the error will be sent here.
    console.error(err);
  });

  connection.pipe(process.stdout);
  ```

* Node.js API ထဲက ပုံမှန်အားဖြင့် asynchronous ဖြစ်တဲ့ methods အနည်းငယ်ကတော့ — `try…catch` နဲ့ ကိုင်တွယ်ရမယ့် exceptions တွေကို ထုတ်ပေးဖို့ `throw` mechanism ကို ဆက်ပြီး သုံးနေနိုင်ပါသေးတယ်။ ဒီလို methods တွေရဲ့ ပြည့်စုံတဲ့ စာရင်း မရှိပါဘူး — method တစ်ခုချင်းစီအတွက် လိုအပ်တဲ့ သင့်လျော်တဲ့ error handling mechanism ကို ဆုံးဖြတ်နိုင်ဖို့ အဲဒီ method တစ်ခုချင်းစီရဲ့ documentation ကို ကိုးကားပေးပါ။

`'error'` event mechanism ကို အသုံးအများဆုံးကတော့ [stream-based][] နဲ့ [event emitter-based][] APIs တွေမှာပါ — ဒီ APIs တွေက အချိန်နဲ့အမျှ ဆက်တိုက် လုပ်ဆောင်နေတဲ့ asynchronous operations တစ်တန်းကို ကိုယ်စားပြုလို့ပါ (အောင်မြင်ဖြစ်စေ မအောင်မြင်ဖြစ်စေ နိုင်တဲ့ လုပ်ဆောင်မှု တစ်ခုတည်းနဲ့ ဆန့်ကျင်ဘက်ပါ)။

[`EventEmitter`][] objects တွေ _အားလုံး_ (all) အတွက် — `'error'` event handler တစ်ခု မပေးထားဘူးဆိုရင် error ကို throw လုပ်ပြီး Node.js process က uncaught exception (ဖမ်းယူမရတဲ့ exception) တစ်ခုကို report လုပ်ကာ crash ဖြစ်သွားပါလိမ့်မယ် — အောက်ပါ နှစ်ခုထဲက တစ်ခုခု ရှိနေရင်ကလွဲလို့ပါ: [`'uncaughtException'`][] event အတွက် handler တစ်ခု register လုပ်ထားခြင်း၊ ဒါမှမဟုတ် deprecated (ခေတ်ကုန်နေပြီ) ဖြစ်တဲ့ [`node:domain`][domains] module ကို သုံးထားခြင်းပါ။

```js
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // This will crash the process because no 'error' event
  // handler has been added.
  ee.emit('error', new Error('This will crash'));
});
```

Errors တွေကို ဒီနည်းနဲ့ ထုတ်ပေးလိုက်ရင် `try…catch` သုံးပြီး ကြားဖြတ် ဖမ်းယူလို့ _မရနိုင်_ (cannot) ပါဘူး — အကြောင်းကတော့ ဒါတွေကို ခေါ်ယူလိုက်တဲ့ code က ပြီးဆုံး ထွက်သွားပြီးမှ _after_ throw လုပ်လို့ပါ။

Developers တွေအနေနဲ့ အဲဒီ methods တွေက ထုတ်ပေးတဲ့ errors တွေ အတိအကျ ဘယ်လို ပျံ့နှံ့သွားလဲဆိုတာကို သိရှိနိုင်ဖို့ method တစ်ခုချင်းစီရဲ့ documentation ကို ကိုးကားရပါမယ်။

## Class: `Error`

ယေဘုယျ JavaScript {Error} object တစ်ခုက error ဘာကြောင့် ဖြစ်ခဲ့လဲဆိုတဲ့ တိကျတဲ့ အခြေအနေ (circumstance) တစ်ခုခုကို ဖော်ပြမထားပါဘူး။ `Error` objects တွေက `Error` ကို instantiate (အသစ်ဖန်တီး) လုပ်လိုက်တဲ့ code ထဲက နေရာအသေးစိတ်ကို ဖော်ပြတဲ့ "stack trace" တစ်ခုကို ဖမ်းယူပြီး — error ရဲ့ စာသား ဖော်ပြချက် (text description) တစ်ခုကိုလည်း ပေးနိုင်ပါတယ်။

Node.js က ထုတ်ပေးတဲ့ errors တွေ အားလုံး — system နဲ့ JavaScript errors အားလုံး အပါအဝင် — က `Error` class ရဲ့ instances တွေ သို့မဟုတ် အဲဒီ class ကနေ အမွေဆက်ခံထားတဲ့ ဟာတွေ ဖြစ်ပါတယ်။

### `new Error(message[, options])`

* `message` {string}
* `options` {Object}
  * `cause` {any} အသစ်ဖန်တီးလိုက်တဲ့ error ကို ဖြစ်ပေါ်စေခဲ့တဲ့ error ပါ။

`Error` object အသစ်တစ်ခုကို ဖန်တီးပြီး `error.message` property ကို ပေးလိုက်တဲ့ စာသား message အတိုင်း သတ်မှတ်ပါတယ်။ `message` အနေနဲ့ object တစ်ခုကို ဖြတ်သန်းလိုက်ရင် — စာသား message ကို `String(message)` ကို ခေါ်ပြီး ထုတ်လုပ်ပါတယ်။ `cause` option ကို ပေးထားရင် အဲဒါကို `error.cause` property ဆီ သတ်မှန်းပေးပါတယ်။ `error.stack` property က `new Error()` ကို ခေါ်ခဲ့တဲ့ code ထဲက နေရာကို ကိုယ်စားပြုပါလိမ့်မယ်။ Stack traces တွေက [V8's stack trace API][] အပေါ်မှာ မူတည်ပါတယ်။ Stack traces တွေက (a) _synchronous code execution_ (တစ်ပြိုင်နက်တည်း code လုပ်ဆောင်မှု) ရဲ့ အစ၊ ဒါမှမဟုတ် (b) `Error.stackTraceLimit` property က သတ်မှတ်ပေးတဲ့ frame အရေအတွက် — ဘယ်ဟာ သေးသေး အဲဒီအထိသာ ရှည်ပါတယ်။

### `Error.captureStackTrace(targetObject[, constructorOpt])`

* `targetObject` {Object}
* `constructorOpt` {Function}

`targetObject` ပေါ်မှာ `.stack` property တစ်ခုကို ဖန်တီးပေးပါတယ် — ဒီ property ကို access (ဝင်ရောက်ကြည့်ရှု) လုပ်လိုက်ရင် `Error.captureStackTrace()` ကို ခေါ်ခဲ့တဲ့ code ထဲက နေရာကို ကိုယ်စားပြုတဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

Trace ရဲ့ ပထမ စာကြောင်းကို `${myObject.name}: ${myObject.message}` နဲ့ ရှေ့ဆက်ထားပါလိမ့်မယ်။

Optional (ထည့်လည်း ရ မထည့်လည်း ရတဲ့) `constructorOpt` argument က function တစ်ခုကို လက်ခံပါတယ်။ ပေးလိုက်ရင် — `constructorOpt` အပါအဝင် `constructorOpt` ရဲ့ အထက်မှာ ရှိတဲ့ frames တွေ အားလုံးကို ထုတ်လုပ်လိုက်တဲ့ stack trace ကနေ ချန်လှပ်ပစ်လိုက်ပါတယ်။

`constructorOpt` argument က error ထုတ်လုပ်ခြင်းရဲ့ implementation အသေးစိတ်တွေကို သုံးစွဲသူဆီကနေ ဖုံးကွယ်ထားဖို့ အသုံးဝင်ပါတယ်။ ဥပမာ:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

### `Error.stackTraceLimit`

* Type: {number}

`Error.stackTraceLimit` property က stack trace တစ်ခု ( `new Error().stack` နဲ့ ထုတ်တာ ဖြစ်ဖြစ် `Error.captureStackTrace(obj)` နဲ့ ထုတ်တာ ဖြစ်ဖြစ်) က စုဆောင်းမယ့် stack frames အရေအတွက်ကို သတ်မှတ်ပေးပါတယ်။

Default တန်ဖိုးက `10` ဖြစ်ပြီး — ဘယ်လို valid JavaScript number မဆို သတ်မှတ်လို့ ရပါတယ်။ ပြောင်းလဲမှုတွေက တန်ဖိုးကို ပြောင်းလဲပြီးမှ _after_ ဖမ်းယူလိုက်တဲ့ stack traces တွေ အားလုံးအပေါ် သက်ရောက်မှု ရှိပါလိမ့်မယ်။

Non-number တန်ဖိုး တစ်ခု ဒါမှမဟုတ် အနုတ် (negative) ကိန်း တစ်ခုကို သတ်မှတ်လိုက်ရင် — stack traces တွေက frames တစ်ခုကိုမှ ဖမ်းယူမှာ မဟုတ်ပါဘူး။

### `error.cause`

* Type: {any}

ရှိနေရင် `error.cause` property က `Error` ရဲ့ မူလအကြောင်းရင်း (underlying cause) ပါ။ Message ဒါမှမဟုတ် code အသစ်တစ်ခုနဲ့ error တစ်ခုကို ဖမ်းယူပြီး အသစ်တစ်ခုကို throw လုပ်တဲ့အခါ — မူရင်း error ကို ဆက်လက် ဝင်ရောက်နိုင်ဖို့ ဒီ property ကို သုံးပါတယ်။

`error.cause` property ကို ပုံမှန်အားဖြင့် `new Error(message, { cause })` ကို ခေါ်ပြီး သတ်မှတ်ပါတယ်။ `cause` option ကို မပေးထားရင် constructor က ဒါကို သတ်မှတ်မပေးပါဘူး။

ဒီ property က errors တွေကို ချိတ်ဆွဲ (chain) လုပ်နိုင်စေပါတယ်။ `Error` objects တွေကို serialize လုပ်တဲ့အခါ — [`util.inspect()`][] က `error.cause` ကို သတ်မှတ်ထားရင် အဲဒါကိုပါ ထပ်ခါထပ်ခါ (recursively) serialize လုပ်ပါတယ်။

```js
const cause = new Error('The remote HTTP server responded with a 500 status');
const symptom = new Error('The message failed to send', { cause });

console.log(symptom);
// Prints:
//   Error: The message failed to send
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 lines matching cause stack trace ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: The remote HTTP server responded with a 500 status
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```

### `error.code`

* Type: {string}

`error.code` property က error ရဲ့ အမျိုးအစားကို ခွဲခြားသတ်မှတ်ပေးတဲ့ string label တစ်ခု ဖြစ်ပါတယ်။ Error တစ်ခုကို ခွဲခြားသတ်မှတ်ဖို့ အသေချာဆုံး နည်းလမ်းကတော့ `error.code` ပါ။ ဒါက Node.js ရဲ့ major versions တွေကြားမှာသာ ပြောင်းလဲပါတယ်။ ဆန့်ကျင်ဘက်အနေနဲ့ — `error.message` strings တွေကတော့ Node.js ရဲ့ ဘယ် versions ကြားမှာမဆို ပြောင်းလဲသွားနိုင်ပါတယ်။ Code တစ်ခုချင်းစီရဲ့ အသေးစိတ်တွေအတွက် [Node.js error codes][] ကို ကြည့်ပါ။

### `error.message`

* Type: {string}

`error.message` property က `new Error(message)` ကို ခေါ်ပြီး သတ်မှတ်လိုက်တဲ့ error ရဲ့ string ဖော်ပြချက် ဖြစ်ပါတယ်။ Constructor ဆီကို ဖြတ်သန်းလိုက်တဲ့ `message` က `Error` ရဲ့ stack trace ရဲ့ ပထမ စာကြောင်းထဲမှာလည်း ပေါ်လာပါလိမ့်မယ် — ဒါပေမယ့် `Error` object ကို ဖန်တီးပြီးမှ ဒီ property ကို ပြောင်းလိုက်ရင် stack trace ရဲ့ ပထမ စာကြောင်းကို _မပြောင်းလဲနိုင်_ (may not) ပါဘူး (ဥပမာ — ဒီ property ကို မပြောင်းခင် `error.stack` ကို အရင်ဖတ်ထားပြီးသား ဖြစ်နေရင်)။

```js
const err = new Error('The message');
console.error(err.message);
// Prints: The message
```

### `error.stack`

* Type: {string}

`error.stack` property က `Error` ကို instantiate (ဖန်တီး) လုပ်လိုက်တဲ့ code ထဲက နေရာကို ဖော်ပြတဲ့ string တစ်ခု ဖြစ်ပါတယ်။

```console
Error: Things keep happening!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```

ပထမ စာကြောင်းကို `<error class name>: <error message>` ပုံစံနဲ့ ရေးပြီး — ၎င်းနောက်မှာ stack frames တစ်တန်း (စာကြောင်း တစ်ကြောင်းချင်းစီက "at " နဲ့ စတင်ပါတယ်) က လိုက်ပါလာပါတယ်။ Frame တစ်ခုချင်းစီက error ထုတ်လုပ်ခံရတာဆီ ဦးတည်စေခဲ့တဲ့ code ထဲက ခေါ်ယူမှု နေရာ (call site) တစ်ခုကို ဖော်ပြပါတယ်။ V8 က function တစ်ခုချင်းစီအတွက် နာမည်တစ်ခု (variable name၊ function name ဒါမှမဟုတ် object method name အားဖြင့်) ပြသဖို့ ကြိုးစားပါတယ် — ဒါပေမယ့် ရံဖန်ရံခါမှာ သင့်လျော်တဲ့ နာမည်တစ်ခုကို ရှာမတွေ့နိုင်တာလည်း ရှိပါတယ်။ V8 က function ရဲ့ နာမည်ကို ဆုံးဖြတ်လို့ မရဘူးဆိုရင် — အဲဒီ frame အတွက် location အချက်အလက် တစ်ခုတည်းကိုသာ ပြသပါလိမ့်မယ်။ မဟုတ်ရင်တော့ ဆုံးဖြတ်လိုက်တဲ့ function နာမည်ကို location အချက်အလက်နဲ့အတူ ကွင်းစကွင်းပိတ် (parentheses) ထဲမှာ ဖော်ပြပြီး ပြသပါလိမ့်မယ်။

Frames တွေက JavaScript functions တွေအတွက်သာ ထုတ်ပေးပါတယ်။ ဥပမာ — execution က JavaScript function တစ်ခုကို ကိုယ်တိုင် ခေါ်တဲ့ `cheetahify` လို့ ခေါ်တဲ့ C++ addon function တစ်ခုကို synchronously ဖြတ်သွားခဲ့ရင် — `cheetahify` call ကို ကိုယ်စားပြုတဲ့ frame က stack traces တွေထဲမှာ ပါလာမှာ မဟုတ်ပါဘူး:

```js
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` *synchronously* calls speedy.
  cheetahify(function speedy() {
    throw new Error('oh no!');
  });
}

makeFaster();
// will throw:
//   /home/gbusey/file.js:6
//       throw new Error('oh no!');
//           ^
//   Error: oh no!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```

Location အချက်အလက်က အောက်ပါတို့ထဲက တစ်ခု ဖြစ်ပါလိမ့်မယ်:

* `native` — frame က V8 အတွင်းပိုင်း (internal) call တစ်ခုကို ကိုယ်စားပြုရင် ( `[].forEach` လိုမျိုး)။
* `plain-filename.js:line:column` — frame က Node.js အတွင်းပိုင်း (internal) call တစ်ခုကို ကိုယ်စားပြုရင်။
* `/absolute/path/to/file.js:line:column` — frame က user program တစ်ခု (CommonJS module system ကို သုံးတဲ့) ဒါမှမဟုတ် ၎င်းရဲ့ dependencies တွေထဲက call တစ်ခုကို ကိုယ်စားပြုရင်။
* `<transport-protocol>:///url/to/module/file.mjs:line:column` — frame က user program တစ်ခု (ES module system ကို သုံးတဲ့) ဒါမှမဟုတ် ၎င်းရဲ့ dependencies တွေထဲက call တစ်ခုကို ကိုယ်စားပြုရင်။

Stack trace က ဖမ်းယူနိုင်တဲ့ frames အရေအတွက်ကို `Error.stackTraceLimit` နဲ့ လက်ရှိ event loop tick ပေါ်မှာ ရနိုင်တဲ့ frames အရေအတွက် — ဒီနှစ်ခုထဲက ပိုသေးတဲ့ဟာနဲ့ ကန့်သတ်ထားပါတယ်။

`error.stack` က builtin (တပ်ဆင်ပါရှိပြီးသား) `Error` objects တွေပေါ်မှာသာ ရှိတဲ့ ဝှက်ထားတဲ့ internal property တစ်ခုအတွက် getter/setter တစ်ခု ဖြစ်ပါတယ် ([`Error.isError`][] က `true` ပြန်ပေးတဲ့ ဟာတွေပါ)။ `error` က builtin error object တစ်ခု မဟုတ်ဘူးဆိုရင် — `error.stack` getter က အမြဲတမ်း `undefined` ကို ပြန်ပေးပြီး setter ကတော့ ဘာမှ လုပ်မှာ မဟုတ်ပါဘူး။ Accessor ကို builtin error object မဟုတ်တဲ့ `this` တန်ဖိုး တစ်ခု — {Proxy} လိုမျိုး — နဲ့ လက်နဲ့ ခေါ်ယူလိုက်ရင် ဒီလို ဖြစ်လာနိုင်ပါတယ်။

## Class: `AssertionError`

* Extends: {errors.Error}

Assertion (စစ်ဆေးအတည်ပြုချက်) တစ်ခု မအောင်မြင်တာကို ညွှန်ပြပါတယ်။ အသေးစိတ်အတွက် [`Class: assert.AssertionError`][] ကို ကြည့်ပါ။

## Class: `RangeError`

* Extends: {errors.Error}

ပေးလိုက်တဲ့ argument တစ်ခုက function တစ်ခုအတွက် လက်ခံနိုင်တဲ့ တန်ဖိုးစု (set) ဒါမှမဟုတ် အကွာအဝေး (range) အတွင်းမှာ မရှိဘူးဆိုတာကို ညွှန်ပြပါတယ် — ကိန်းဂဏန်း အကွာအဝေး ဖြစ်ဖြစ်၊ ပေးထားတဲ့ function parameter တစ်ခုအတွက် ရွေးချယ်စရာ (options) တွေရဲ့ အပြင်ဘက်မှာ ရှိနေတာ ဖြစ်ဖြစ်ပါ။

```js
require('node:net').connect(-1);
// Throws "RangeError: "port" option should be >= 0 and < 65536: -1"
```

Node.js က `RangeError` instances တွေကို argument validation (argument စစ်ဆေးခြင်း) ပုံစံ တစ်မျိုးအနေနဲ့ _ချက်ချင်း_ (immediately) ထုတ်လုပ်ပြီး throw လုပ်ပါလိမ့်မယ်။

## Class: `ReferenceError`

* Extends: {errors.Error}

သတ်မှတ်မထားတဲ့ (not defined) variable တစ်ခုကို access လုပ်ဖို့ ကြိုးစားနေတယ်ဆိုတာကို ညွှန်ပြပါတယ်။ ဒီလို errors တွေက ပုံမှန်အားဖြင့် code ထဲက စာလုံးပေါင်း မှားယွင်းမှုတွေ (typos) ဒါမှမဟုတ် ကျိုးပဲ့နေတဲ့ (broken) program တစ်ခုကို ညွှန်ပြတတ်ပါတယ်။

Client code တွေက ဒီ errors တွေကို ထုတ်လုပ်ပြီး ပျံ့နှံ့စေနိုင်ပေမယ့် — လက်တွေ့မှာတော့ V8 တစ်ခုတည်းကသာ အဲဒီလို လုပ်လေ့ ရှိပါတယ်။

```js
doesNotExist;
// Throws ReferenceError, doesNotExist is not a variable in this program.
```

Application တစ်ခုက code တွေကို ရွေ့လျားစွာ (dynamically) ထုတ်လုပ်ပြီး run လုပ်နေတာ မဟုတ်ဘူးဆိုရင် — `ReferenceError` instances တွေက code ဒါမှမဟုတ် ၎င်းရဲ့ dependencies တွေထဲက bug တစ်ခုကို ညွှန်ပြပါတယ်။

## Class: `SyntaxError`

* Extends: {errors.Error}

Program တစ်ခုက valid JavaScript မဟုတ်ဘူးဆိုတာကို ညွှန်ပြပါတယ်။ ဒီ errors တွေကို code evaluation (code အကဲဖြတ် လုပ်ဆောင်ခြင်း) ရဲ့ ရလဒ်အနေနဲ့သာ ထုတ်လုပ်ပြီး ပျံ့နှံ့စေနိုင်ပါတယ်။ Code evaluation က `eval`, `Function`, `require` ဒါမှမဟုတ် [vm][] ရဲ့ ရလဒ်အနေနဲ့ ဖြစ်ပေါ်နိုင်ပါတယ်။ ဒီ errors တွေက ကျိုးပဲ့နေတဲ့ (broken) program တစ်ခုကို အမြဲလိုလို ညွှန်ပြနေတတ်ပါတယ်။

```js
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err' will be a SyntaxError.
}
```

`SyntaxError` instances တွေက ၎င်းတို့ကို ဖန်တီးခဲ့တဲ့ context ထဲမှာ ပြန်လည် ကောင်းမွန်အောင် လုပ်လို့ မရတဲ့ (unrecoverable) ဟာတွေ ဖြစ်ပါတယ် — တခြား contexts တွေကသာ ၎င်းတို့ကို ဖမ်းယူနိုင်ပါတယ်။

## Class: `SystemError`

* Extends: {errors.Error}

Node.js က ၎င်းရဲ့ runtime environment အတွင်းမှာ exceptions တွေ ဖြစ်ပေါ်တဲ့အခါ system errors တွေကို ထုတ်ပေးပါတယ်။ ဒါတွေက ပုံမှန်အားဖြင့် application တစ်ခုက operating system ရဲ့ ကန့်သတ်ချက်တစ်ခုကို ချိုးဖောက်တဲ့အခါ ဖြစ်ပေါ်ပါတယ်။ ဥပမာ — application တစ်ခုက မရှိတဲ့ file တစ်ခုကို ဖတ်ဖို့ ကြိုးစားရင် system error တစ်ခု ဖြစ်ပေါ်ပါလိမ့်မယ်။

* `address` {string} ရှိနေရင် — network connection တစ်ခု မအောင်မြင်ခဲ့တဲ့ address ပါ
* `code` {string} String error code ပါ
* `dest` {string} ရှိနေရင် — file system error တစ်ခုကို report လုပ်တဲ့အခါ destination file path ပါ
* `errno` {number} System က ပေးတဲ့ error number ပါ
* `info` {Object} ရှိနေရင် — error အခြေအနေရဲ့ ထပ်ဆောင်း အသေးစိတ်တွေပါ
* `message` {string} System က ပေးတဲ့ လူဖတ်လို့ရတဲ့ (human-readable) error ဖော်ပြချက်ပါ
* `path` {string} ရှိနေရင် — file system error တစ်ခုကို report လုပ်တဲ့အခါ file path ပါ
* `port` {number} ရှိနေရင် — မရနိုင်တော့တဲ့ network connection port ပါ
* `syscall` {string} Error ကို ဖြစ်ပေါ်စေခဲ့တဲ့ system call ရဲ့ နာမည်ပါ

### `error.address`

* Type: {string}

ရှိနေရင် — `error.address` က network connection တစ်ခု မအောင်မြင်ခဲ့တဲ့ address ကို ဖော်ပြတဲ့ string တစ်ခုပါ။

### `error.code`

* Type: {string}

`error.code` property က error code ကို ကိုယ်စားပြုတဲ့ string တစ်ခု ဖြစ်ပါတယ်။

### `error.dest`

* Type: {string}

ရှိနေရင် — `error.dest` က file system error တစ်ခုကို report လုပ်တဲ့အခါ destination file path ပါ။

### `error.errno`

* Type: {number}

`error.errno` property က [`libuv Error handling`][] မှာ သတ်မှတ်ထားတဲ့ error code တစ်ခုနဲ့ ကိုက်ညီတဲ့ အနုတ် (negative) ကိန်း တစ်ခု ဖြစ်ပါတယ်။

Windows မှာတော့ system က ပေးလိုက်တဲ့ error number ကို libuv က ပုံမှန် ပြောင်းလဲ (normalize) ပေးပါတယ်။

Error code ရဲ့ string ကိုယ်စားပြုမှုကို ရယူဖို့ [`util.getSystemErrorName(error.errno)`][] ကို သုံးပါ။

### `error.info`

* Type: {Object}

ရှိနေရင် — `error.info` က error အခြေအနေရဲ့ အသေးစိတ်တွေ ပါဝင်တဲ့ object တစ်ခုပါ။

### `error.message`

* Type: {string}

`error.message` က system က ပေးတဲ့ လူဖတ်လို့ရတဲ့ (human-readable) error ဖော်ပြချက် ဖြစ်ပါတယ်။

### `error.path`

* Type: {string}

ရှိနေရင် — `error.path` က သက်ဆိုင်ရာ မမှန်ကန်တဲ့ (invalid) pathname တစ်ခု ပါဝင်တဲ့ string တစ်ခုပါ။

### `error.port`

* Type: {number}

ရှိနေရင် — `error.port` က မရနိုင်တော့တဲ့ network connection port ပါ။

### `error.syscall`

* Type: {string}

`error.syscall` property က မအောင်မြင်ခဲ့တဲ့ [syscall][] ကို ဖော်ပြတဲ့ string တစ်ခု ဖြစ်ပါတယ်။

### အသုံးများလေ့ ရှိတဲ့ system errors များ (Common system errors)

ဒါက Node.js program တစ်ခု ရေးတဲ့အခါ မကြာခဏ ကြုံတွေ့ရတတ်တဲ့ system errors တွေရဲ့ စာရင်းပါ။ ပြည့်စုံတဲ့ စာရင်းအတွက်တော့ [`errno`(3) man page][] ကို ကြည့်ပါ။

* `EACCES` (Permission denied — ဝင်ရောက်ခွင့် ငြင်းပယ်ခံရခြင်း): File access permissions တွေက တားမြစ်ထားတဲ့ နည်းနဲ့ file တစ်ခုကို access လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

* `EADDRINUSE` (Address already in use — address ကို သုံးပြီးသား ဖြစ်နေခြင်း): Server တစ်ခု ([`net`][], [`http`][], ဒါမှမဟုတ် [`https`][]) ကို local address တစ်ခုနဲ့ bind လုပ်ဖို့ ကြိုးစားမှုက မအောင်မြင်ခဲ့ပါဘူး — အကြောင်းကတော့ local system ပေါ်က တခြား server တစ်ခုက အဲဒီ address ကို သိမ်းပိုက်ထားလို့ပါ။

* `ECONNREFUSED` (Connection refused — ချိတ်ဆက်မှု ငြင်းပယ်ခံရခြင်း): Target machine က တက်ကြွစွာ ငြင်းပယ်ခဲ့လို့ ချိတ်ဆက်မှု တစ်ခုမှ ပြုလုပ်နိုင်ခဲ့မပါဘူး။ ဒါက ပုံမှန်အားဖြင့် foreign host ပေါ်မှာ inactive ဖြစ်နေတဲ့ service တစ်ခုဆီ ချိတ်ဆက်ဖို့ ကြိုးစားတဲ့အခါ ဖြစ်ပေါ်တတ်ပါတယ်။

* `ECONNRESET` (Connection reset by peer — peer က ချိတ်ဆက်မှုကို ပြန်စက်ခြင်း): ချိတ်ဆက်မှု တစ်ခုကို peer တစ်ခုက အတင်းအကြပ် ပိတ်ပစ်လိုက်ပါတယ်။ ဒါက ပုံမှန်အားဖြင့် remote socket ပေါ်က ချိတ်ဆက်မှု ဆုံးရှုံးသွားတာကြောင့် ဖြစ်ပြီး — timeout ဒါမှမဟုတ် reboot ကြောင့်ပါ။ [`http`][] နဲ့ [`net`][] modules တွေကနေ မကြာခဏ ကြုံတွေ့ရတတ်ပါတယ်။

* `EEXIST` (File exists — file ရှိပြီးသား ဖြစ်ခြင်း): ပစ်မှတ် (target) က မရှိစေရဘူးလို့ လိုအပ်တဲ့ လုပ်ဆောင်မှုတစ်ခုရဲ့ ပစ်မှတ်အဖြစ် ရှိပြီးသား file တစ်ခု ရောက်နေခဲ့ပါတယ်။

* `EISDIR` (Is a directory — directory တစ်ခု ဖြစ်နေခြင်း): လုပ်ဆောင်မှုတစ်ခုက file တစ်ခုကို မျှော်လင့်ခဲ့ပေမယ့် ပေးလိုက်တဲ့ pathname က directory တစ်ခု ဖြစ်နေပါတယ်။

* `EMFILE` (Too many open files in system — system ထဲမှာ file တွေ အများကြီး ဖွင့်ထားမိခြင်း): System ပေါ်မှာ ခွင့်ပြုထားတဲ့ အများဆုံး [file descriptors][] အရေအတွက်ကို ရောက်ရှိသွားပြီ ဖြစ်လို့ — အနည်းဆုံး တစ်ခု ပိတ်လိုက်သည်အထိ နောက်ထပ် descriptor တစ်ခုအတွက် တောင်းဆိုမှုတွေကို ဖြည့်ဆည်းလို့ မရပါဘူး။ File အများကြီးကို တစ်ပြိုင်နက် parallel ဖွင့်တဲ့အခါ ကြုံတွေ့ရတတ်ပြီး — အထူးသဖြင့် processes တွေအတွက် file descriptor ကန့်သတ်ချက် နည်းတဲ့ systems တွေ (အထူးသဖြင့် macOS) မှာပါ။ နည်းနေတဲ့ ကန့်သတ်ချက်ကို ပြုပြင်ဖို့ — Node.js process ကို run လုပ်မယ့် shell တစ်ခုတည်းထဲမှာပဲ `ulimit -n 2048` ကို run လုပ်ပါ။

* `ENOENT` (No such file or directory — ဒီလို file သို့မဟုတ် directory မရှိခြင်း): သတ်မှတ်ထားတဲ့ pathname ရဲ့ အစိတ်အပိုင်း (component) တစ်ခုက မရှိဘူးဆိုတာကို ညွှန်ပြဖို့ [`fs`][] operations တွေက မကြာခဏ ထုတ်ပေးပါတယ်။ ပေးထားတဲ့ path အောက်မှာ entity (file ဒါမှမဟုတ် directory) တစ်ခုကိုမှ ရှာမတွေ့ပါဘူး။

* `ENOTDIR` (Not a directory — directory မဟုတ်ခြင်း): ပေးထားတဲ့ pathname ရဲ့ အစိတ်အပိုင်း (component) တစ်ခုက ရှိနေပေမယ့် — မျှော်လင့်ထားသလို directory တစ်ခု မဟုတ်ခဲ့ပါဘူး။ [`fs.readdir`][] ကနေ မကြာခဏ ထုတ်ပေးပါတယ်။

* `ENOTEMPTY` (Directory not empty — directory ဟာ မဗလာ ဖြစ်နေခြင်း): ဗလာ directory တစ်ခု လိုအပ်တဲ့ လုပ်ဆောင်မှုတစ်ခုရဲ့ ပစ်မှတ်အဖြစ် entry တွေ ပါဝင်နေတဲ့ directory တစ်ခု ရောက်နေခဲ့ပါတယ် — ပုံမှန်အားဖြင့် [`fs.unlink`][] ပါ။

* `ENOTFOUND` (DNS lookup failed — DNS lookup မအောင်မြင်ခြင်း): `EAI_NODATA` ဒါမှမဟုတ် `EAI_NONAME` ထဲက တစ်ခုခုရဲ့ DNS failure ကို ညွှန်ပြပါတယ်။ ဒါက standard POSIX error တစ်ခု မဟုတ်ပါဘူး။

* `EPERM` (Operation not permitted — လုပ်ဆောင်ခွင့် မရှိခြင်း): မြင့်မားတဲ့ အခွင့်အရေးတွေ (elevated privileges) လိုအပ်တဲ့ လုပ်ဆောင်မှုတစ်ခုကို လုပ်ဆောင်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

* `EPIPE` (Broken pipe — pipe ကျိုးပဲ့ခြင်း): Data ကို ဖတ်ယူမယ့် process မရှိတဲ့ pipe၊ socket ဒါမှမဟုတ် FIFO တစ်ခုပေါ်ကို write လုပ်ခဲ့ပါတယ်။ [`net`][] နဲ့ [`http`][] layers တွေမှာ မကြာခဏ ကြုံတွေ့ရတတ်ပြီး — ရေးသားနေတဲ့ stream ရဲ့ remote ဘက်ခြမ်း ပိတ်သွားပြီဆိုတာကို ညွှန်ပြပါတယ်။

* `ETIMEDOUT` (Operation timed out — လုပ်ဆောင်မှု အချိန်ကုန်သွားခြင်း): Connect ဒါမှမဟုတ် send request တစ်ခု မအောင်မြင်ခဲ့ပါဘူး — အကြောင်းကတော့ ချိတ်ဆက်ထားတဲ့ ဘက်က အချိန်ကာလ တစ်ခုကြာပြီးနောက်မှာလည်း ကောင်းမွန်စွာ တုံ့ပြန်မှု မလုပ်ခဲ့လို့ပါ။ ပုံမှန်အားဖြင့် [`http`][] ဒါမှမဟုတ် [`net`][] ကနေ ကြုံတွေ့ရတတ်ပါတယ်။ `socket.end()` ကို ကောင်းမွန်စွာ မခေါ်ခဲ့ဘူးဆိုတဲ့ လက္ခဏာတစ်ခု မကြာခဏ ဖြစ်ပါတယ်။

## Class: `TypeError`

* Extends {errors.Error}

ပေးလိုက်တဲ့ argument တစ်ခုက ခွင့်ပြုထားတဲ့ type တစ်ခု မဟုတ်ဘူးဆိုတာကို ညွှန်ပြပါတယ်။ ဥပမာ — string တစ်ခုကို မျှော်လင့်တဲ့ parameter တစ်ခုဆီကို function တစ်ခုကို ဖြတ်သန်းလိုက်ရင် `TypeError` တစ်ခု ဖြစ်ပါလိမ့်မယ်။

```js
require('node:url').parse(() => { });
// Throws TypeError, since it expected a string.
```

Node.js က `TypeError` instances တွေကို argument validation (argument စစ်ဆေးခြင်း) ပုံစံ တစ်မျိုးအနေနဲ့ _ချက်ချင်း_ (immediately) ထုတ်လုပ်ပြီး throw လုပ်ပါလိမ့်မယ်။

## Exceptions နဲ့ errors (Exceptions vs. errors)

JavaScript exception တစ်ခုက invalid operation (မမှန်ကန်တဲ့ လုပ်ဆောင်မှု) တစ်ခုရဲ့ ရလဒ်အနေနဲ့ ဒါမှမဟုတ် `throw` statement တစ်ခုရဲ့ ပစ်မှတ်အနေနဲ့ throw လုပ်ခံရတဲ့ တန်ဖိုး တစ်ခုပါ။ ဒီတန်ဖိုးတွေက `Error` ဒါမှမဟုတ် `Error` ကနေ အမွေဆက်ခံတဲ့ classes တွေရဲ့ instances တွေ ဖြစ်ဖို့ မလိုအပ်ပေမယ့် — Node.js ဒါမှမဟုတ် JavaScript runtime က throw လုပ်တဲ့ exceptions တွေ အားလုံးကတော့ `Error` ရဲ့ instances တွေ _ဖြစ်ပါလိမ့်မယ်_ (will)။

Exceptions တချို့က JavaScript layer မှာ _ပြန်လည် ကောင်းမွန်အောင် မလုပ်နိုင်တဲ့_ (unrecoverable) ဟာတွေပါ။ ဒီလို exceptions တွေက Node.js process ကို _အမြဲတမ်း_ (always) crash ဖြစ်စေပါလိမ့်မယ်။ ဥပမာတွေက C++ layer ထဲက `assert()` checks တွေ ဒါမှမဟုတ် `abort()` calls တွေပါ။

## OpenSSL errors များ (OpenSSL errors)

`crypto` ဒါမှမဟုတ် `tls` ထဲက စတင်ဖြစ်ပေါ်လာတဲ့ errors တွေက `Error` class ထဲက ဟာတွေ ဖြစ်ပြီး — standard `.code` နဲ့ `.message` properties တွေအပြင် OpenSSL အတွက် သီးသန့် (OpenSSL-specific) ဖြစ်တဲ့ ထပ်ဆောင်း properties တချို့လည်း ပါဝင်နိုင်ပါတယ်။

### `error.opensslErrorStack`

Error တစ်ခု OpenSSL library ထဲက ဘယ်နေရာကနေ စတင်ဖြစ်ပေါ်လာလဲဆိုတဲ့ အခြေအနေကို ဖော်ပြနိုင်တဲ့ errors တွေရဲ့ array တစ်ခုပါ။

### `error.function`

Error က စတင်ဖြစ်ပေါ်ခဲ့တဲ့ OpenSSL function ပါ။

### `error.library`

Error က စတင်ဖြစ်ပေါ်ခဲ့တဲ့ OpenSSL library ပါ။

### `error.reason`

Error ရဲ့ အကြောင်းပြချက်ကို ဖော်ပြတဲ့ လူဖတ်လို့ရတဲ့ (human-readable) string တစ်ခုပါ။

<a id="nodejs-error-codes"></a>

## Node.js error codes များ (Node.js error codes)

<a id="ABORT_ERR"></a>

### `ABORT_ERR`

Operation တစ်ခုကို ဖျက်သိမ်း (abort) လုပ်လိုက်တဲ့အခါ သုံးပါတယ် (ပုံမှန်အားဖြင့် `AbortController` တစ်ခုကို သုံးပြီး)။

`AbortSignal`s တွေကို မသုံးတဲ့ APIs တွေက ပုံမှန်အားဖြင့် ဒီ code နဲ့ error တစ်ခုကို မထုတ်ပေးပါဘူး။

ဒီ code က Node.js errors တွေ သုံးတဲ့ ပုံမှန် `ERR_*` convention ကို မလိုက်နာပါဘူး — web platform ရဲ့ `AbortError` နဲ့ ကိုက်ညီမှု ရှိစေဖို့ပါ။

<a id="ERR_ACCESS_DENIED"></a>

### `ERR_ACCESS_DENIED`

Node.js က [Permission Model][] နဲ့ ကန့်သတ်ထားတဲ့ resource တစ်ခုကို access လုပ်ဖို့ ကြိုးစားတိုင်း trigger လုပ်ခံရတဲ့ အထူး error အမျိုးအစား တစ်ခုပါ။

<a id="ERR_AMBIGUOUS_ARGUMENT"></a>

### `ERR_AMBIGUOUS_ARGUMENT`

Function argument တစ်ခုကို function signature ကို အထင်လွဲစေနိုင်တဲ့ နည်းနဲ့ သုံးနေပါတယ်။ `assert.throws(block, message)` ထဲက `message` parameter က `block` က throw လုပ်လိုက်တဲ့ error message နဲ့ ကိုက်ညီနေတဲ့အခါ `node:assert` module က ဒါကို throw လုပ်ပါတယ် — အကြောင်းကတော့ ဒီလို သုံးတာက သုံးစွဲသူက `block` က throw မလုပ်ရင် `AssertionError` က ပြသမယ့် message ထက် `message` ကို မျှော်လင့်ထားတဲ့ message အဖြစ် မှတ်ယူနေတယ်လို့ ညွှန်ပြနေလို့ပါ။

<a id="ERR_ARG_NOT_ITERABLE"></a>

### `ERR_ARG_NOT_ITERABLE`

Iterable argument (ဆိုလိုတာက `for...of` loops တွေနဲ့ အလုပ်လုပ်နိုင်တဲ့ တန်ဖိုး) တစ်ခု လိုအပ်ပေမယ့် Node.js API တစ်ခုဆီကို မပေးခဲ့ပါဘူး။

<a id="ERR_ASSERTION"></a>

### `ERR_ASSERTION`

Node.js က ဘယ်တော့မှ မဖြစ်သင့်တဲ့ ထူးခြားတဲ့ logic ချိုးဖောက်မှု (logic violation) တစ်ခုကို တွေ့ရှိတိုင်း trigger လုပ်နိုင်တဲ့ အထူး error အမျိုးအစား တစ်ခုပါ။ ဒါတွေကို ပုံမှန်အားဖြင့် `node:assert` module က ထုတ်ပေးပါတယ်။

<a id="ERR_ASYNC_CALLBACK"></a>

### `ERR_ASYNC_CALLBACK`

Function တစ်ခု မဟုတ်တဲ့ အရာတစ်ခုကို `AsyncHooks` callback တစ်ခုအနေနဲ့ register လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_ASYNC_LOADER_REQUEST_NEVER_SETTLED"></a>

### `ERR_ASYNC_LOADER_REQUEST_NEVER_SETTLED`

Module loading နဲ့ ဆိုင်တဲ့ လုပ်ဆောင်မှုတစ်ခုကို asynchronous loader hook တစ်ခုက စိတ်ကြိုက်ပြုပြင် (customize) လုပ်ထားပြီး — အဲဒီ hook က loader thread မထွက်ခင် promise ကို settle (ဖြေရှင်းပြီးမြောက်) မလုပ်ခဲ့ပါဘူး။

<a id="ERR_ASYNC_TYPE"></a>

### `ERR_ASYNC_TYPE`

Asynchronous resource တစ်ခုရဲ့ type က invalid ဖြစ်ခဲ့ပါတယ်။ Public embedder API ကို သုံးနေရင် သုံးစွဲသူတွေအနေနဲ့ ကိုယ်ပိုင် types တွေကိုလည်း သတ်မှတ်နိုင်ပါတယ်။

<a id="ERR_BROTLI_COMPRESSION_FAILED"></a>

### `ERR_BROTLI_COMPRESSION_FAILED`

Brotli stream တစ်ခုဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ data ကို အောင်မြင်စွာ compress မလုပ်နိုင်ခဲ့ပါဘူး။

<a id="ERR_BROTLI_INVALID_PARAM"></a>

### `ERR_BROTLI_INVALID_PARAM`

Brotli stream တစ်ခုကို တည်ဆောက်နေစဉ်အတွင်း invalid parameter key တစ်ခုကို ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_BUFFER_CONTEXT_NOT_AVAILABLE"></a>

### `ERR_BUFFER_CONTEXT_NOT_AVAILABLE`

Addon ဒါမှမဟုတ် embedder code ကနေ Node.js `Buffer` instance တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပြီး — အဲဒီအချိန်က JS engine Context က Node.js instance တစ်ခုနဲ့ ဆက်စပ်မှု မရှိခဲ့ပါဘူး။ `Buffer` method ဆီကို ဖြတ်သန်းပေးခဲ့တဲ့ data က method ပြန်အလာမှာ လွှတ်ပေးပြီးသား ဖြစ်နေပါလိမ့်မယ်။

ဒီ error ကို ကြုံတွေ့ရတဲ့အခါ — `Buffer` instance တစ်ခု ဖန်တီးတာအစား သာမန် `Uint8Array` တစ်ခုကို ဖန်တီးတာက ဖြစ်နိုင်တဲ့ ရွေးချယ်စရာ တစ်ခုပါ — ဒီနှစ်ခုက ရလဒ် object ရဲ့ prototype မှာသာ ကွာခြားပါတယ်။ `Buffer`s တွေကို လက်ခံတဲ့ Node.js core APIs တွေ အားလုံးမှာ `Uint8Array`s တွေကို ယေဘုယျအားဖြင့် လက်ခံပါတယ် — Contexts အားလုံးမှာ ရနိုင်ပါတယ်။

<a id="ERR_BUFFER_OUT_OF_BOUNDS"></a>

### `ERR_BUFFER_OUT_OF_BOUNDS`

`Buffer` တစ်ခုရဲ့ နယ်နိမိတ် (bounds) အပြင်ဘက်မှာ လုပ်ဆောင်မှုတစ်ခုကို လုပ်ဆောင်ဖို့ ကြိုးစားခဲ့ပါတယ်။

<a id="ERR_BUFFER_TOO_LARGE"></a>

### `ERR_BUFFER_TOO_LARGE`

ခွင့်ပြုထားတဲ့ အများဆုံး အရွယ်အစားထက် ပိုကြီးတဲ့ `Buffer` တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_CANNOT_WATCH_SIGINT"></a>

### `ERR_CANNOT_WATCH_SIGINT`

Node.js က `SIGINT` signal ကို စောင့်ကြည့်နိုင်ခဲ့မပါဘူး။

<a id="ERR_CHILD_CLOSED_BEFORE_REPLY"></a>

### `ERR_CHILD_CLOSED_BEFORE_REPLY`

Parent က reply တစ်ခု မရရှိခင် child process တစ်ခု ပိတ်သွားခဲ့ပါတယ်။

<a id="ERR_CHILD_PROCESS_IPC_REQUIRED"></a>

### `ERR_CHILD_PROCESS_IPC_REQUIRED`

IPC channel တစ်ခုကို သတ်မှတ်မပေးဘဲ child process တစ်ခုကို fork လုပ်နေတဲ့အခါ သုံးပါတယ်။

<a id="ERR_CHILD_PROCESS_STDIO_MAXBUFFER"></a>

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER`

Main process က child process ရဲ့ STDERR/STDOUT ကနေ data ကို ဖတ်ယူဖို့ ကြိုးစားနေပြီး — data ရဲ့ အလျားက `maxBuffer` option ထက် ပိုရှည်နေတဲ့အခါ သုံးပါတယ်။

<a id="ERR_CLOSED_MESSAGE_PORT"></a>

### `ERR_CLOSED_MESSAGE_PORT`

ပိတ်သွားပြီးသား (closed) အခြေအနေမှာ `MessagePort` instance တစ်ခုကို သုံးဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ် — ပုံမှန်အားဖြင့် `.close()` ကို ခေါ်ပြီးနောက်မှာပါ။

<a id="ERR_CONSOLE_WRITABLE_STREAM"></a>

### `ERR_CONSOLE_WRITABLE_STREAM`

`Console` ကို `stdout` stream မပါဘဲ instantiate လုပ်ခဲ့ပါတယ်၊ ဒါမှမဟုတ် `Console` မှာ write လုပ်လို့ မရတဲ့ (non-writable) `stdout` ဒါမှမဟုတ် `stderr` stream တစ်ခု ရှိနေပါတယ်။

<a id="ERR_CONSTRUCT_CALL_INVALID"></a>

### `ERR_CONSTRUCT_CALL_INVALID`

ခေါ်ယူလို့ မရတဲ့ (not callable) class constructor တစ်ခုကို ခေါ်ယူခဲ့ပါတယ်။

<a id="ERR_CONSTRUCT_CALL_REQUIRED"></a>

### `ERR_CONSTRUCT_CALL_REQUIRED`

Class တစ်ခုရဲ့ constructor တစ်ခုကို `new` မပါဘဲ ခေါ်ယူခဲ့ပါတယ်။

<a id="ERR_CONTEXT_NOT_INITIALIZED"></a>

### `ERR_CONTEXT_NOT_INITIALIZED`

API ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ vm context က မစတင်ရသေးပါဘူး။ Context ကို ဖန်တီးနေစဉ်အတွင်း error တစ်ခု ဖြစ်ပေါ်ပြီး (ဖမ်းယူလိုက်မိ) တဲ့အခါ ဒါ ဖြစ်နိုင်ပါတယ် — ဥပမာ context ကို ဖန်တီးတဲ့အခါ allocation မအောင်မြင်တာ ဒါမှမဟုတ် အများဆုံး call stack size ကို ရောက်သွားတာမျိုးပါ။

<a id="ERR_CPU_PROFILE_ALREADY_STARTED"></a>

### `ERR_CPU_PROFILE_ALREADY_STARTED`

ပေးထားတဲ့ နာမည်နဲ့ CPU profile က စတင်ပြီးသား ဖြစ်နေပါတယ်။

<a id="ERR_CPU_PROFILE_NOT_STARTED"></a>

### `ERR_CPU_PROFILE_NOT_STARTED`

ပေးထားတဲ့ နာမည်နဲ့ CPU profile က မစတင်ရသေးပါဘူး။

<a id="ERR_CPU_PROFILE_TOO_MANY"></a>

### `ERR_CPU_PROFILE_TOO_MANY`

CPU profiles တွေ အများကြီး စုဆောင်းနေမိပါတယ်။

<a id="ERR_CRYPTO_ARGON2_NOT_SUPPORTED"></a>

### `ERR_CRYPTO_ARGON2_NOT_SUPPORTED`

လက်ရှိ သုံးနေတဲ့ OpenSSL version က Argon2 ကို support မလုပ်ပါဘူး။

<a id="ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED"></a>

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED`

သုံးနေတဲ့ OpenSSL version က support မလုပ်တဲ့ OpenSSL engine တစ်ခုကို တောင်းဆိုခဲ့ပါတယ် (ဥပမာ — `clientCertEngine` ဒါမှမဟုတ် `privateKeyEngine` TLS options တွေကနေ) — compile-time flag ဖြစ်တဲ့ `OPENSSL_NO_ENGINE` ကြောင့် ဖြစ်နိုင်ခြေ များပါတယ်။

<a id="ERR_CRYPTO_ECDH_INVALID_FORMAT"></a>

### `ERR_CRYPTO_ECDH_INVALID_FORMAT`

`crypto.ECDH()` class ရဲ့ `getPublicKey()` method ဆီကို `format` argument အတွက် invalid တန်ဖိုး တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY"></a>

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY`

`crypto.ECDH()` class ရဲ့ `computeSecret()` method ဆီကို `key` argument အတွက် invalid တန်ဖိုး တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။ ဆိုလိုတာက public key က elliptic curve ရဲ့ အပြင်ဘက်မှာ ရှိနေတာပါ။

<a id="ERR_CRYPTO_ENGINE_UNKNOWN"></a>

### `ERR_CRYPTO_ENGINE_UNKNOWN`

Invalid crypto engine identifier တစ်ခုကို [`require('node:crypto').setEngine()`][] ဆီကို ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_FIPS_FORCED"></a>

### `ERR_CRYPTO_FIPS_FORCED`

[`--force-fips`][] command-line argument ကို သုံးထားပေမယ့် `node:crypto` module ထဲမှာ FIPS mode ကို ဖွင့်ဖို့ ဒါမှမဟုတ် ပိတ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_CRYPTO_FIPS_UNAVAILABLE"></a>

### `ERR_CRYPTO_FIPS_UNAVAILABLE`

FIPS mode ကို ဖွင့်ဖို့ ဒါမှမဟုတ် ပိတ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပေမယ့် — FIPS mode က မရနိုင်ပါဘူး။

<a id="ERR_CRYPTO_HASH_FINALIZED"></a>

### `ERR_CRYPTO_HASH_FINALIZED`

[`hash.digest()`][] ကို အကြိမ်များစွာ ခေါ်ယူခဲ့ပါတယ်။ `hash.digest()` method ကို `Hash` object တစ်ခုရဲ့ instance တစ်ခုစီအတွက် တစ်ကြိမ်ထက် မပိုအောင် ခေါ်ရပါမယ်။

<a id="ERR_CRYPTO_HASH_UPDATE_FAILED"></a>

### `ERR_CRYPTO_HASH_UPDATE_FAILED`

[`hash.update()`][] က ဘာအကြောင်းကြောင့်ပဲ ဖြစ်ဖြစ် မအောင်မြင်ခဲ့ပါဘူး။ ဒါက ဖြစ်ရင် ဖြစ်ရုံလောက်သာ ရှားပါးစွာ ဖြစ်သင့်ပါတယ်။

<a id="ERR_CRYPTO_INCOMPATIBLE_KEY"></a>

### `ERR_CRYPTO_INCOMPATIBLE_KEY`

ပေးထားတဲ့ crypto keys တွေက ကြိုးစားလုပ်ဆောင်နေတဲ့ operation နဲ့ မကိုက်ညီပါဘူး။

<a id="ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS"></a>

### `ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS`

ရွေးချယ်ထားတဲ့ public ဒါမှမဟုတ် private key encoding က တခြား options တွေနဲ့ မကိုက်ညီပါဘူး။

<a id="ERR_CRYPTO_INITIALIZATION_FAILED"></a>

### `ERR_CRYPTO_INITIALIZATION_FAILED`

Crypto subsystem ရဲ့ စတင်ခြင်း (initialization) မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_CRYPTO_INVALID_AUTH_TAG"></a>

### `ERR_CRYPTO_INVALID_AUTH_TAG`

Invalid authentication tag (စစ်မှန်ကြောင်း အထောက်အထား tag) တစ်ခုကို ပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_INVALID_COUNTER"></a>

### `ERR_CRYPTO_INVALID_COUNTER`

Counter-mode cipher တစ်ခုအတွက် invalid counter တစ်ခုကို ပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_INVALID_CURVE"></a>

### `ERR_CRYPTO_INVALID_CURVE`

Invalid elliptic-curve (ဘဲဥပုံ မျဉ်းကွေး) တစ်ခုကို ပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_INVALID_DIGEST"></a>

### `ERR_CRYPTO_INVALID_DIGEST`

Invalid [crypto digest algorithm][] တစ်ခုကို သတ်မှတ်ခဲ့ပါတယ်။

<a id="ERR_CRYPTO_INVALID_IV"></a>

### `ERR_CRYPTO_INVALID_IV`

Invalid initialization vector (စတင်ခြင်း vector) တစ်ခုကို ပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_INVALID_JWK"></a>

### `ERR_CRYPTO_INVALID_JWK`

Invalid JSON Web Key တစ်ခုကို ပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_INVALID_KEYLEN"></a>

### `ERR_CRYPTO_INVALID_KEYLEN`

Invalid key length (သော့ အလျား) တစ်ခုကို ပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_INVALID_KEYPAIR"></a>

### `ERR_CRYPTO_INVALID_KEYPAIR`

Invalid key pair (သော့ တွဲ) တစ်ခုကို ပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_INVALID_KEYTYPE"></a>

### `ERR_CRYPTO_INVALID_KEYTYPE`

Invalid key type (သော့ အမျိုးအစား) တစ်ခုကို ပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE"></a>

### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE`

ပေးထားတဲ့ crypto key object ရဲ့ type က ကြိုးစားလုပ်ဆောင်နေတဲ့ operation အတွက် invalid ဖြစ်ပါတယ်။

<a id="ERR_CRYPTO_INVALID_MESSAGELEN"></a>

### `ERR_CRYPTO_INVALID_MESSAGELEN`

Invalid message length (message အလျား) တစ်ခုကို ပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_INVALID_SCRYPT_PARAMS"></a>

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS`

[`crypto.scrypt()`][] ဒါမှမဟုတ် [`crypto.scryptSync()`][] ရဲ့ parameter တစ်ခု ဒါမှမဟုတ် တစ်ခုထက်ပိုတဲ့ parameter တွေက ၎င်းတို့ရဲ့ တရားဝင် (legal) အကွာအဝေး အပြင်ဘက်မှာ ရှိနေပါတယ်။

<a id="ERR_CRYPTO_INVALID_STATE"></a>

### `ERR_CRYPTO_INVALID_STATE`

Invalid state ထဲမှာ ရှိနေတဲ့ object တစ်ခုပေါ်မှာ crypto method တစ်ခုကို သုံးခဲ့ပါတယ်။ ဥပမာ — `cipher.final()` ကို မခေါ်ခင် [`cipher.getAuthTag()`][] ကို ခေါ်တာမျိုးပါ။

<a id="ERR_CRYPTO_INVALID_TAG_LENGTH"></a>

### `ERR_CRYPTO_INVALID_TAG_LENGTH`

Invalid authentication tag length (tag အလျား) တစ်ခုကို ပေးခဲ့ပါတယ်။

<a id="ERR_CRYPTO_JOB_INIT_FAILED"></a>

### `ERR_CRYPTO_JOB_INIT_FAILED`

Asynchronous crypto operation တစ်ခုရဲ့ စတင်ခြင်း (initialization) မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_CRYPTO_JWK_UNSUPPORTED_CURVE"></a>

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE`

Key ရဲ့ Elliptic Curve က [JSON Web Key Elliptic Curve Registry][] မှာ သုံးဖို့ မှတ်ပုံတင်မထားပါဘူး။

<a id="ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE"></a>

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE`

Key ရဲ့ Asymmetric Key Type က [JSON Web Key Types Registry][] မှာ သုံးဖို့ မှတ်ပုံတင်မထားပါဘူး။

<a id="ERR_CRYPTO_KEM_NOT_SUPPORTED"></a>

### `ERR_CRYPTO_KEM_NOT_SUPPORTED`

Node.js က KEM support ပါတဲ့ OpenSSL နဲ့ compile မလုပ်ထားချိန်မှာ KEM operations တွေကို သုံးဖို့ ကြိုးစားခဲ့ပါတယ်။

<a id="ERR_CRYPTO_OPERATION_FAILED"></a>

### `ERR_CRYPTO_OPERATION_FAILED`

Crypto operation တစ်ခုက တခြားနည်းနဲ့ သတ်မှတ်မထားတဲ့ အကြောင်းပြချက် တစ်ခုကြောင့် မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_CRYPTO_PBKDF2_ERROR"></a>

### `ERR_CRYPTO_PBKDF2_ERROR`

PBKDF2 algorithm က သတ်မှတ်မထားတဲ့ အကြောင်းပြချက်တွေကြောင့် မအောင်မြင်ခဲ့ပါဘူး။ OpenSSL က ဒီထက်ပိုတဲ့ အသေးစိတ်တွေကို မပေးပါဘူး — ဒါကြောင့် Node.js ကလည်း မပေးပါဘူး။

<a id="ERR_CRYPTO_SCRYPT_NOT_SUPPORTED"></a>

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED`

Node.js ကို `scrypt` support မပါဘဲ compile လုပ်ထားပါတယ်။ တရားဝင် release binaries တွေနဲ့ဆို မဖြစ်နိုင်ပေမယ့် — custom builds တွေမှာ ဖြစ်နိုင်ပါတယ်၊ distro builds တွေ အပါအဝင်ပါ။

<a id="ERR_CRYPTO_SIGN_KEY_REQUIRED"></a>

### `ERR_CRYPTO_SIGN_KEY_REQUIRED`

လက်မှတ်ရေးထိုးဖို့ (signing) `key` တစ်ခုကို [`sign.sign()`][] method ဆီကို မပေးခဲ့ပါဘူး။

<a id="ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH"></a>

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH`

[`crypto.timingSafeEqual()`][] ကို မတူညီတဲ့ အလျားတွေ ရှိတဲ့ `Buffer`, `TypedArray`, ဒါမှမဟုတ် `DataView` arguments တွေနဲ့ ခေါ်ယူခဲ့ပါတယ်။

<a id="ERR_CRYPTO_UNKNOWN_CIPHER"></a>

### `ERR_CRYPTO_UNKNOWN_CIPHER`

အမည်မသိ cipher (ကုဒ်ဝှက်စနစ်) တစ်ခုကို သတ်မှတ်ခဲ့ပါတယ်။

<a id="ERR_CRYPTO_UNKNOWN_DH_GROUP"></a>

### `ERR_CRYPTO_UNKNOWN_DH_GROUP`

အမည်မသိ Diffie-Hellman group နာမည် တစ်ခုကို ပေးခဲ့ပါတယ်။ Valid group နာမည်တွေရဲ့ စာရင်းအတွက် [`crypto.getDiffieHellman()`][] ကို ကြည့်ပါ။

<a id="ERR_CRYPTO_UNSUPPORTED_OPERATION"></a>

### `ERR_CRYPTO_UNSUPPORTED_OPERATION`

Support မလုပ်တဲ့ crypto operation တစ်ခုကို ခေါ်ယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_DEBUGGER_ERROR"></a>

### `ERR_DEBUGGER_ERROR`

[debugger][] နဲ့ error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။

<a id="ERR_DEBUGGER_STARTUP_ERROR"></a>

### `ERR_DEBUGGER_STARTUP_ERROR`

[debugger][] က လိုအပ်တဲ့ host/port ကို လွတ်နေဖို့ စောင့်ဆိုင်းရင်း အချိန်ကုန် (timeout) သွားခဲ့ပါတယ်။

<a id="ERR_DIR_CLOSED"></a>

### `ERR_DIR_CLOSED`

[`fs.Dir`][] က အရင်က ပိတ်ပြီးသား ဖြစ်ခဲ့ပါတယ်။

<a id="ERR_DIR_CONCURRENT_OPERATION"></a>

### `ERR_DIR_CONCURRENT_OPERATION`

လုပ်ဆောင်ဆဲ asynchronous operations တွေ ရှိနေတဲ့ [`fs.Dir`][] တစ်ခုပေါ်မှာ synchronous read ဒါမှမဟုတ် close call တစ်ခုကို လုပ်ဆောင်ဖို့ ကြိုးစားခဲ့ပါတယ်။

<a id="ERR_DLOPEN_DISABLED"></a>

### `ERR_DLOPEN_DISABLED`

Native addons တွေကို load လုပ်တာကို [`--no-addons`][] သုံးပြီး disable လုပ်ထားပါတယ်။

<a id="ERR_DLOPEN_FAILED"></a>

### `ERR_DLOPEN_FAILED`

`process.dlopen()` ဆီကို ခေါ်ယူမှု တစ်ခု မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_DNS_SET_SERVERS_FAILED"></a>

### `ERR_DNS_SET_SERVERS_FAILED`

`c-ares` က DNS server ကို သတ်မှတ်ရာမှာ မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_DOMAIN_CALLBACK_NOT_AVAILABLE"></a>

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE`

`node:domain` module က အသုံးပြုလို့ မရခဲ့ပါဘူး — အကြောင်းကတော့ လိုအပ်တဲ့ error handling hooks တွေကို တည်ဆောက်လို့ မရခဲ့လို့ပါ — ဘာလို့ဆို [`process.setUncaughtExceptionCaptureCallback()`][] ကို အရင်အချိန်တစ်ခုမှာ ခေါ်ထားပြီးသား ဖြစ်နေလို့ပါ။

<a id="ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE"></a>

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`

[`process.setUncaughtExceptionCaptureCallback()`][] ကို ခေါ်လို့ မရခဲ့ပါဘူး — အကြောင်းကတော့ `node:domain` module ကို အရင်အချိန်တစ်ခုမှာ load လုပ်ထားပြီးသား ဖြစ်နေလို့ပါ။

`node:domain` module ကို load လုပ်ခဲ့တဲ့ အချိန်ကိုပါ ထည့်သွင်းဖို့ stack trace ကို တိုးချဲ့ထားပါတယ်။

<a id="ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION"></a>

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION`

[`v8.startupSnapshot.setDeserializeMainFunction()`][] ကို ခေါ်လို့ မရခဲ့ပါဘူး — အကြောင်းကတော့ အရင်က ခေါ်ပြီးသား ဖြစ်နေလို့ပါ။

<a id="ERR_ENCODING_INVALID_ENCODED_DATA"></a>

### `ERR_ENCODING_INVALID_ENCODED_DATA`

`TextDecoder()` API ဆီကို ပေးလိုက်တဲ့ data က ပေးထားတဲ့ encoding အရ invalid ဖြစ်ခဲ့ပါတယ်။

<a id="ERR_ENCODING_NOT_SUPPORTED"></a>

### `ERR_ENCODING_NOT_SUPPORTED`

`TextDecoder()` API ဆီကို ပေးလိုက်တဲ့ encoding က [WHATWG Supported Encodings][] ထဲက တစ်ခု မဟုတ်ခဲ့ပါဘူး။

<a id="ERR_EVAL_ESM_CANNOT_PRINT"></a>

### `ERR_EVAL_ESM_CANNOT_PRINT`

`--print` ကို ESM input တွေနဲ့ သုံးလို့ မရပါဘူး။

<a id="ERR_EVENT_RECURSION"></a>

### `ERR_EVENT_RECURSION`

`EventTarget` တစ်ခုပေါ်မှာ event တစ်ခုကို ထပ်ခါထပ်ခါ (recursively) dispatch လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်တဲ့အခါ throw လုပ်ပါတယ်။

<a id="ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE"></a>

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE`

JS execution context က Node.js environment တစ်ခုနဲ့ ဆက်စပ်မှု မရှိပါဘူး။ Node.js ကို embedded library တစ်ခုအနေနဲ့ သုံးပြီး JS engine အတွက် hooks တချို့ကို ကောင်းမွန်စွာ သတ်မှတ်မထားတဲ့အခါ ဒါ ဖြစ်ပေါ်နိုင်ပါတယ်။

<a id="ERR_FALSY_VALUE_REJECTION"></a>

### `ERR_FALSY_VALUE_REJECTION`

`util.callbackify()` ကနေ callbackified လုပ်ထားတဲ့ `Promise` တစ်ခုကို falsy value (မှားယွင်းမှုလို့ ယူဆတဲ့ တန်ဖိုး) တစ်ခုနဲ့ rejected လုပ်ခဲ့ပါတယ်။

<a id="ERR_FEATURE_UNAVAILABLE_ON_PLATFORM"></a>

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM`

Node.js ကို run လုပ်နေတဲ့ လက်ရှိ platform ပေါ်မှာ မရနိုင်တဲ့ feature တစ်ခုကို သုံးတဲ့အခါ သုံးပါတယ်။

<a id="ERR_FFI_CALL_FAILED"></a>

### `ERR_FFI_CALL_FAILED`

အဆင့်နိမ့် (low-level) FFI call တစ်ခု မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_FFI_INVALID_POINTER"></a>

### `ERR_FFI_INVALID_POINTER`

FFI operation တစ်ခုဆီကို invalid pointer (မမှန်ကန်တဲ့ pointer) တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_FFI_LIBRARY_CLOSED"></a>

### `ERR_FFI_LIBRARY_CLOSED`

FFI dynamic library တစ်ခုကို ပိတ်ပြီးနောက်မှာ အဲဒီပေါ်မှာ လုပ်ဆောင်မှုတစ်ခုကို လုပ်ဆောင်ဖို့ ကြိုးစားခဲ့ပါတယ်။

<a id="ERR_FS_CP_DIR_TO_NON_DIR"></a>

### `ERR_FS_CP_DIR_TO_NON_DIR`

[`fs.cp()`][] ကို သုံးပြီး directory တစ်ခုကို non-directory (file, symlink စသည်) တစ်ခုဆီကို ကူးယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_FS_CP_EEXIST"></a>

### `ERR_FS_CP_EEXIST`

[`fs.cp()`][] ကို သုံးပြီး ရှိပြီးသား file တစ်ခုကို ကျော်ပြီး ကူးယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပြီး — `force` နဲ့ `errorOnExist` ကို `true` လို့ သတ်မှတ်ထားပါတယ်။

<a id="ERR_FS_CP_EINVAL"></a>

### `ERR_FS_CP_EINVAL`

[`fs.cp()`][] ကို သုံးတဲ့အခါ `src` ဒါမှမဟုတ် `dest` က invalid path တစ်ခုကို ညွှန်ပြနေခဲ့ပါတယ်။

<a id="ERR_FS_CP_FIFO_PIPE"></a>

### `ERR_FS_CP_FIFO_PIPE`

[`fs.cp()`][] နဲ့ named pipe (နာမည်ပေးထားတဲ့ pipe) တစ်ခုကို ကူးယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_FS_CP_NON_DIR_TO_DIR"></a>

### `ERR_FS_CP_NON_DIR_TO_DIR`

[`fs.cp()`][] ကို သုံးပြီး non-directory (file, symlink စသည်) တစ်ခုကို directory တစ်ခုဆီကို ကူးယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_FS_CP_SOCKET"></a>

### `ERR_FS_CP_SOCKET`

[`fs.cp()`][] နဲ့ socket တစ်ခုဆီကို ကူးယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY"></a>

### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY`

[`fs.cp()`][] ကို သုံးတဲ့အခါ `dest` ထဲက symlink တစ်ခုက `src` ရဲ့ subdirectory (အခွဲ directory) တစ်ခုကို ညွှန်ပြနေခဲ့ပါတယ်။

<a id="ERR_FS_CP_UNKNOWN"></a>

### `ERR_FS_CP_UNKNOWN`

[`fs.cp()`][] နဲ့ အမည်မသိ file type တစ်ခုဆီကို ကူးယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_FS_EISDIR"></a>

### `ERR_FS_EISDIR`

Path က directory တစ်ခုပါ။

<a id="ERR_FS_FILE_TOO_LARGE"></a>

### `ERR_FS_FILE_TOO_LARGE`

`fs.readFile()` အတွက် support လုပ်ထားတဲ့ 2 GiB ကန့်သတ်ချက်ထက် ပိုကြီးတဲ့ file တစ်ခုကို ဖတ်ယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ ဒါက `Buffer` ရဲ့ ကန့်သတ်ချက် မဟုတ်ဘဲ — internal I/O ကန့်သတ်ချက် တစ်ခုပါ။ ပိုကြီးတဲ့ files တွေကို ကိုင်တွယ်ဖို့ဆိုရင် `fs.createReadStream()` ကို သုံးပြီး file ကို အပိုင်းပိုင်း (chunks) ဖတ်ယူတာကို စဉ်းစားပါ။

<a id="ERR_FS_WATCH_QUEUE_OVERFLOW"></a>

### `ERR_FS_WATCH_QUEUE_OVERFLOW`

ကိုင်တွယ်မှု မရှိဘဲ queue လုပ်ထားတဲ့ file system events အရေအတွက်က `fs.watch()` ထဲက `maxQueue` မှာ သတ်မှတ်ထားတဲ့ အရွယ်အစားကို ကျော်လွန်သွားခဲ့ပါတယ်။

<a id="ERR_HTTP2_ALTSVC_INVALID_ORIGIN"></a>

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN`

HTTP/2 ALTSVC frames တွေက valid origin တစ်ခု လိုအပ်ပါတယ်။

<a id="ERR_HTTP2_ALTSVC_LENGTH"></a>

### `ERR_HTTP2_ALTSVC_LENGTH`

HTTP/2 ALTSVC frames တွေက payload bytes အများဆုံး 16,382 အထိသာ ကန့်သတ်ထားပါတယ်။

<a id="ERR_HTTP2_CONNECT_AUTHORITY"></a>

### `ERR_HTTP2_CONNECT_AUTHORITY`

`CONNECT` method ကို သုံးတဲ့ HTTP/2 requests တွေအတွက် `:authority` pseudo-header က လိုအပ်ပါတယ်။

<a id="ERR_HTTP2_CONNECT_PATH"></a>

### `ERR_HTTP2_CONNECT_PATH`

`CONNECT` method ကို သုံးတဲ့ HTTP/2 requests တွေအတွက် `:path` pseudo-header က တားမြစ်ထားပါတယ်။

<a id="ERR_HTTP2_CONNECT_SCHEME"></a>

### `ERR_HTTP2_CONNECT_SCHEME`

`CONNECT` method ကို သုံးတဲ့ HTTP/2 requests တွေအတွက် `:scheme` pseudo-header က တားမြစ်ထားပါတယ်။

<a id="ERR_HTTP2_ERROR"></a>

### `ERR_HTTP2_ERROR`

သတ်မှတ်ချက် မရှိတဲ့ (non-specific) HTTP/2 error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။

<a id="ERR_HTTP2_GOAWAY_SESSION"></a>

### `ERR_HTTP2_GOAWAY_SESSION`

`Http2Session` က ချိတ်ဆက်ထားတဲ့ peer ဆီကနေ `GOAWAY` frame တစ်ခုကို လက်ခံရရှိပြီးနောက်မှာ HTTP/2 Streams အသစ်တွေကို ဖွင့်လို့ မရပါဘူး။

<a id="ERR_HTTP2_HEADERS_AFTER_RESPOND"></a>

### `ERR_HTTP2_HEADERS_AFTER_RESPOND`

HTTP/2 response တစ်ခု စတင်လိုက်ပြီးနောက်မှာ ထပ်ဆောင်း headers တွေကို သတ်မှတ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_HEADERS_SENT"></a>

### `ERR_HTTP2_HEADERS_SENT`

Response headers အများအပြားကို ပို့ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_HEADER_SINGLE_VALUE"></a>

### `ERR_HTTP2_HEADER_SINGLE_VALUE`

တန်ဖိုး တစ်ခုတည်းသာ ရှိရမယ့် HTTP/2 header field တစ်ခုအတွက် တန်ဖိုးများစွာ ပေးခဲ့ပါတယ်။

<a id="ERR_HTTP2_INFO_STATUS_NOT_ALLOWED"></a>

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED`

Informational HTTP status codes (`1xx`) တွေကို HTTP/2 responses တွေရဲ့ response status code အဖြစ် သတ်မှတ်လို့ မရပါဘူး။

<a id="ERR_HTTP2_INVALID_CONNECTION_HEADERS"></a>

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS`

HTTP/1 နဲ့ ဆိုင်တဲ့ (connection specific) headers တွေကို HTTP/2 requests နဲ့ responses တွေမှာ သုံးဖို့ တားမြစ်ထားပါတယ်။

<a id="ERR_HTTP2_INVALID_HEADER_VALUE"></a>

### `ERR_HTTP2_INVALID_HEADER_VALUE`

Invalid HTTP/2 header value တစ်ခုကို သတ်မှတ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_INVALID_INFO_STATUS"></a>

### `ERR_HTTP2_INVALID_INFO_STATUS`

Invalid HTTP informational status code တစ်ခုကို သတ်မှတ်ခဲ့ပါတယ်။ Informational status codes တွေက `100` နဲ့ `199` ကြား (နှစ်ခုလုံး အပါအဝင်) ရှိတဲ့ integer တစ်ခု ဖြစ်ရပါမယ်။

<a id="ERR_HTTP2_INVALID_ORIGIN"></a>

### `ERR_HTTP2_INVALID_ORIGIN`

HTTP/2 `ORIGIN` frames တွေက valid origin တစ်ခု လိုအပ်ပါတယ်။

<a id="ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH"></a>

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH`

`http2.getUnpackedSettings()` API ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ `Buffer` နဲ့ `Uint8Array` instances တွေရဲ့ အလျားက ခြောက် (six) ၏ ဆတိုးကိန်း (multiple) တစ်ခု ဖြစ်ရပါမယ်။

<a id="ERR_HTTP2_INVALID_PSEUDOHEADER"></a>

### `ERR_HTTP2_INVALID_PSEUDOHEADER`

Valid HTTP/2 pseudoheaders (`:status`, `:path`, `:authority`, `:scheme`, နဲ့ `:method`) တွေကိုသာ သုံးလို့ ရပါတယ်။

<a id="ERR_HTTP2_INVALID_SESSION"></a>

### `ERR_HTTP2_INVALID_SESSION`

Destroy လုပ်ပြီးသား `Http2Session` object တစ်ခုပေါ်မှာ လုပ်ဆောင်မှု (action) တစ်ခုကို လုပ်ဆောင်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_INVALID_SETTING_VALUE"></a>

### `ERR_HTTP2_INVALID_SETTING_VALUE`

HTTP/2 setting တစ်ခုအတွက် invalid တန်ဖိုး တစ်ခုကို သတ်မှတ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_INVALID_STREAM"></a>

### `ERR_HTTP2_INVALID_STREAM`

Destroy လုပ်ပြီးသား stream တစ်ခုပေါ်မှာ လုပ်ဆောင်မှု (operation) တစ်ခုကို လုပ်ဆောင်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_MAX_PENDING_SETTINGS_ACK"></a>

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK`

ချိတ်ဆက်ထားတဲ့ peer တစ်ခုဆီကို HTTP/2 `SETTINGS` frame တစ်ခု ပို့လိုက်တိုင်း — peer က အဲဒီ `SETTINGS` အသစ်ကို လက်ခံရရှိပြီး အသုံးပြုကြောင်း acknowledgment (အသိအမှတ်ပြုချက်) တစ်ခု ပြန်ပို့ရန် လိုအပ်ပါတယ်။ Default အနေနဲ့ — မည်သည့်အချိန်မှာမဆို ပို့နိုင်တဲ့ အသိအမှတ်ပြုမခံရသေး (unacknowledged) `SETTINGS` frames အရေအတွက်ကို အများဆုံး ကန့်သတ်ထားပါတယ်။ ဒီကန့်သတ်ချက်ကို ရောက်ရှိသွားတဲ့အခါ ဒီ error code ကို သုံးပါတယ်။

<a id="ERR_HTTP2_NESTED_PUSH"></a>

### `ERR_HTTP2_NESTED_PUSH`

Push stream တစ်ခုရဲ့ အတွင်းကနေ push stream အသစ်တစ်ခုကို စတင်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ Nested (အသိုက်အမြုံ) push streams တွေကို ခွင့်မပြုပါဘူး။

<a id="ERR_HTTP2_NO_MEM"></a>

### `ERR_HTTP2_NO_MEM`

`http2session.setLocalWindowSize(windowSize)` API ကို သုံးတဲ့အခါ memory လုံလောက်မှု မရှိခဲ့ပါဘူး။

<a id="ERR_HTTP2_NO_SOCKET_MANIPULATION"></a>

### `ERR_HTTP2_NO_SOCKET_MANIPULATION`

`Http2Session` တစ်ခုနဲ့ တွဲထားတဲ့ socket တစ်ခုကို တိုက်ရိုက် ကိုင်တွယ် (read, write, pause, resume စသည်) ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_ORIGIN_LENGTH"></a>

### `ERR_HTTP2_ORIGIN_LENGTH`

HTTP/2 `ORIGIN` frames တွေကို 16382 bytes အလျားအထိသာ ကန့်သတ်ထားပါတယ်။

<a id="ERR_HTTP2_OUT_OF_STREAMS"></a>

### `ERR_HTTP2_OUT_OF_STREAMS`

HTTP/2 session တစ်ခုတည်းပေါ်မှာ ဖန်တီးထားတဲ့ streams အရေအတွက်က အများဆုံး ကန့်သတ်ချက်ကို ရောက်ရှိသွားခဲ့ပါတယ်။

<a id="ERR_HTTP2_PAYLOAD_FORBIDDEN"></a>

### `ERR_HTTP2_PAYLOAD_FORBIDDEN`

Payload (ပါဝင်ဒေတာ) တစ်ခု တားမြစ်ထားတဲ့ HTTP response code တစ်ခုအတွက် message payload တစ်ခုကို သတ်မှတ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_PING_CANCEL"></a>

### `ERR_HTTP2_PING_CANCEL`

HTTP/2 ping တစ်ခုကို ဖျက်သိမ်း (cancel) လုပ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_PING_LENGTH"></a>

### `ERR_HTTP2_PING_LENGTH`

HTTP/2 ping payloads တွေက အလျား 8 bytes အတိအကျ ရှိရပါမယ်။

<a id="ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED"></a>

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED`

HTTP/2 pseudo-header တစ်ခုကို မသင့်လျော်တဲ့ နည်းနဲ့ သုံးခဲ့ပါတယ်။ Pseudo-headers တွေက `:` prefix နဲ့ စတင်တဲ့ header key နာမည်တွေပါ။

<a id="ERR_HTTP2_PUSH_DISABLED"></a>

### `ERR_HTTP2_PUSH_DISABLED`

Client က disable လုပ်ထားတဲ့ push stream တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_SEND_FILE"></a>

### `ERR_HTTP2_SEND_FILE`

Directory တစ်ခုကို ပို့ဖို့ `Http2Stream.prototype.responseWithFile()` API ကို သုံးဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_SEND_FILE_NOSEEK"></a>

### `ERR_HTTP2_SEND_FILE_NOSEEK`

Regular file တစ်ခု မဟုတ်တဲ့ အရာတစ်ခုကို ပို့ဖို့ `Http2Stream.prototype.responseWithFile()` API ကို သုံးဖို့ ကြိုးစားခဲ့ပေမယ့် — `offset` ဒါမှမဟုတ် `length` options တွေကို ပေးထားခဲ့ပါတယ်။

<a id="ERR_HTTP2_SESSION_ERROR"></a>

### `ERR_HTTP2_SESSION_ERROR`

`Http2Session` က non-zero error code တစ်ခုနဲ့ ပိတ်သွားခဲ့ပါတယ်။

<a id="ERR_HTTP2_SETTINGS_CANCEL"></a>

### `ERR_HTTP2_SETTINGS_CANCEL`

`Http2Session` ရဲ့ settings တွေကို ဖျက်သိမ်း (cancel) လုပ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_SOCKET_BOUND"></a>

### `ERR_HTTP2_SOCKET_BOUND`

တခြား `Http2Session` object တစ်ခုနဲ့ bind လုပ်ပြီးသား ဖြစ်နေတဲ့ `net.Socket` ဒါမှမဟုတ် `tls.TLSSocket` တစ်ခုဆီကို `Http2Session` object တစ်ခုကို ချိတ်ဆက်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_SOCKET_UNBOUND"></a>

### `ERR_HTTP2_SOCKET_UNBOUND`

ပိတ်ပြီးသား `Http2Session` တစ်ခုရဲ့ `socket` property ကို သုံးဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_STATUS_101"></a>

### `ERR_HTTP2_STATUS_101`

HTTP/2 မှာ `101` Informational status code ကို သုံးတာ တားမြစ်ထားပါတယ်။

<a id="ERR_HTTP2_STATUS_INVALID"></a>

### `ERR_HTTP2_STATUS_INVALID`

Invalid HTTP status code တစ်ခုကို သတ်မှတ်ခဲ့ပါတယ်။ Status codes တွေက `100` နဲ့ `599` ကြား (နှစ်ခုလုံး အပါအဝင်) ရှိတဲ့ integer တစ်ခု ဖြစ်ရပါမယ်။

<a id="ERR_HTTP2_STREAM_CANCEL"></a>

### `ERR_HTTP2_STREAM_CANCEL`

ချိတ်ဆက်ထားတဲ့ peer ဆီကို data တစ်စုံတစ်ရာ မပို့လိုက်ရသေးခင် `Http2Stream` တစ်ခုကို destroy လုပ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_STREAM_ERROR"></a>

### `ERR_HTTP2_STREAM_ERROR`

`RST_STREAM` frame တစ်ခုထဲမှာ non-zero error code တစ်ခုကို သတ်မှတ်ခဲ့ပါတယ်။

<a id="ERR_HTTP2_STREAM_SELF_DEPENDENCY"></a>

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY`

HTTP/2 stream တစ်ခုရဲ့ priority ကို သတ်မှတ်တဲ့အခါ — stream တစ်ခုကို parent stream တစ်ခုအတွက် dependency အဖြစ် mark လုပ်နိုင်ပါတယ်။ Stream တစ်ခုကို ၎င်းကိုယ်တိုင်၏ dependent အဖြစ် mark လုပ်ဖို့ ကြိုးစားတဲ့အခါ ဒီ error code ကို သုံးပါတယ်။

<a id="ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS"></a>

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS`

Support လုပ်ထားတဲ့ custom settings အရေအတွက် (10) ကို ကျော်လွန်သွားခဲ့ပါတယ်။

<a id="ERR_HTTP2_TOO_MANY_INVALID_FRAMES"></a>

### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES`

`maxSessionInvalidFrames` option ကနေ သတ်မှတ်ထားတဲ့အတိုင်း — peer က ပို့လိုက်တဲ့ လက်ခံနိုင်တဲ့ invalid HTTP/2 protocol frames အရေအတွက် ကန့်သတ်ချက်ကို ကျော်လွန်သွားခဲ့ပါတယ်။

<a id="ERR_HTTP2_TOO_MANY_ORIGINS"></a>

### `ERR_HTTP2_TOO_MANY_ORIGINS`

Server က ပို့လိုက်တဲ့ unique origins အရေအတွက်က `options.maxOriginSetSize` မှာ သတ်မှတ်ထားတဲ့ တန်ဖိုးကို ကျော်လွန်သွားခဲ့ပါတယ်။

<a id="ERR_HTTP2_TRAILERS_ALREADY_SENT"></a>

### `ERR_HTTP2_TRAILERS_ALREADY_SENT`

`Http2Stream` ပေါ်မှာ Trailing headers တွေကို ပို့ပြီးသား ဖြစ်နေပါတယ်။

<a id="ERR_HTTP2_TRAILERS_NOT_READY"></a>

### `ERR_HTTP2_TRAILERS_NOT_READY`

`Http2Stream` object တစ်ခုပေါ်မှာ `'wantTrailers'` event ကို emit လုပ်ပြီးမှသာ `http2stream.sendTrailers()` method ကို ခေါ်လို့ ရပါတယ်။ `'wantTrailers'` event ကို `Http2Stream` အတွက် `waitForTrailers` option ကို သတ်မှတ်ထားမှသာ emit လုပ်ပါလိမ့်မယ်။

<a id="ERR_HTTP2_UNSUPPORTED_PROTOCOL"></a>

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL`

`http:` ဒါမှမဟုတ် `https:` ကလွဲပြီး တခြား protocol တစ်ခုခုကို သုံးထားတဲ့ URL တစ်ခုကို `http2.connect()` ဆီကို ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_HTTP_BODY_NOT_ALLOWED"></a>

### `ERR_HTTP_BODY_NOT_ALLOWED`

Contents (ပါဝင်မှုတွေ) ကို ခွင့်မပြုတဲ့ HTTP response တစ်ခုဆီကို ရေးသားတဲ့အခါ error တစ်ခုကို throw လုပ်ပါတယ်။

<a id="ERR_HTTP_CONTENT_LENGTH_MISMATCH"></a>

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH`

Response body ရဲ့ အရွယ်အစားက သတ်မှတ်ထားတဲ့ content-length header တန်ဖိုးနဲ့ မကိုက်ညီပါဘူး။

<a id="ERR_HTTP_HEADERS_SENT"></a>

### `ERR_HTTP_HEADERS_SENT`

Headers တွေ ပို့ပြီးသား ဖြစ်နေတဲ့အချိန်မှာ headers တွေ ထပ်ထည့်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_HTTP_INVALID_HEADER_VALUE"></a>

### `ERR_HTTP_INVALID_HEADER_VALUE`

Invalid HTTP header value တစ်ခုကို သတ်မှတ်ခဲ့ပါတယ်။

<a id="ERR_HTTP_INVALID_STATUS_CODE"></a>

### `ERR_HTTP_INVALID_STATUS_CODE`

Status code က ပုံမှန် status code အကွာအဝေး (100-999) အပြင်ဘက်မှာ ရှိနေခဲ့ပါတယ်။

<a id="ERR_HTTP_REQUEST_TIMEOUT"></a>

### `ERR_HTTP_REQUEST_TIMEOUT`

Client က ခွင့်ပြုထားတဲ့ အချိန်အတွင်းမှာ request တစ်ခုလုံးကို မပို့ခဲ့ပါဘူး။

<a id="ERR_HTTP_SOCKET_ASSIGNED"></a>

### `ERR_HTTP_SOCKET_ASSIGNED`

ပေးထားတဲ့ [`ServerResponse`][] ကို socket တစ်ခု သတ်မှန်းပြီးသား ဖြစ်နေခဲ့ပါတယ်။

<a id="ERR_HTTP_SOCKET_ENCODING"></a>

### `ERR_HTTP_SOCKET_ENCODING`

Socket encoding ကို ပြောင်းလဲတာက [RFC 7230 Section 3][] အရ ခွင့်မပြုပါဘူး။

<a id="ERR_HTTP_TRAILER_INVALID"></a>

### `ERR_HTTP_TRAILER_INVALID`

Transfer encoding က support မလုပ်ပေမယ့် `Trailer` header ကို သတ်မှတ်ခဲ့ပါတယ်။

<a id="ERR_ILLEGAL_CONSTRUCTOR"></a>

### `ERR_ILLEGAL_CONSTRUCTOR`

Public မဟုတ်တဲ့ constructor တစ်ခုကို သုံးပြီး object တစ်ခုကို တည်ဆောက်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_IMPORT_ATTRIBUTE_MISSING"></a>

### `ERR_IMPORT_ATTRIBUTE_MISSING`

Import attribute (တင်သွင်းမှု attribute) တစ်ခု ပျောက်ဆုံးနေလို့ — သတ်မှတ်ထားတဲ့ module ကို import လုပ်လို့ မရခဲ့ပါဘူး။

<a id="ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE"></a>

### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE`

Import `type` attribute တစ်ခုကို ပေးခဲ့ပေမယ့် — သတ်မှတ်ထားတဲ့ module က မတူညီတဲ့ type တစ်ခု ဖြစ်နေပါတယ်။

<a id="ERR_IMPORT_ATTRIBUTE_UNSUPPORTED"></a>

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED`

Import attribute တစ်ခုကို ဒီ Node.js version က support မလုပ်ပါဘူး။

<a id="ERR_INCOMPATIBLE_OPTION_PAIR"></a>

### `ERR_INCOMPATIBLE_OPTION_PAIR`

Option တွဲတစ်ခုက တစ်ခုနဲ့တစ်ခု မကိုက်ညီဘဲ — တစ်ချိန်တည်းမှာ သုံးလို့ မရပါဘူး။

<a id="ERR_INPUT_TYPE_NOT_ALLOWED"></a>

### `ERR_INPUT_TYPE_NOT_ALLOWED`

File တစ်ခုကို execute လုပ်ဖို့ `--input-type` flag ကို သုံးခဲ့ပါတယ်။ ဒီ flag ကို `--eval`, `--print`, ဒါမှမဟုတ် `STDIN` ကနေ input တွေနဲ့သာ သုံးလို့ ရပါတယ်။

<a id="ERR_INSPECTOR_ALREADY_ACTIVATED"></a>


### `ERR_INSPECTOR_ALREADY_ACTIVATED`

`node:inspector` module ကို သုံးနေစဉ် — inspector က port တစ်ခုပေါ်မှာ listen လုပ်နေပြီးသား ဖြစ်ချိန်မှာ ၎င်းကို activate လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ တခြား address တစ်ခုပေါ်မှာ activate မလုပ်ခင် `inspector.close()` ကို အရင်သုံးပါ။

<a id="ERR_INSPECTOR_ALREADY_CONNECTED"></a>

### `ERR_INSPECTOR_ALREADY_CONNECTED`

`node:inspector` module ကို သုံးနေစဉ် — inspector က connect လုပ်ပြီးသား ဖြစ်ချိန်မှာ connect လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_INSPECTOR_CLOSED"></a>

### `ERR_INSPECTOR_CLOSED`

`node:inspector` module ကို သုံးနေစဉ် — session ပိတ်ပြီးသား ဖြစ်ပြီးမှာ inspector ကို အသုံးပြုဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_INSPECTOR_COMMAND"></a>

### `ERR_INSPECTOR_COMMAND`

`node:inspector` module ကနေ command တစ်ခု ထုတ်ပြန်ရာမှာ error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။

<a id="ERR_INSPECTOR_NOT_ACTIVE"></a>

### `ERR_INSPECTOR_NOT_ACTIVE`

`inspector` က `inspector.waitForDebugger()` ကို ခေါ်ယူတဲ့အခါ active မဖြစ်ပါဘူး။

<a id="ERR_INSPECTOR_NOT_AVAILABLE"></a>

### `ERR_INSPECTOR_NOT_AVAILABLE`

`node:inspector` module ကို အသုံးပြုဖို့ မရနိုင်ပါဘူး။

<a id="ERR_INSPECTOR_NOT_CONNECTED"></a>

### `ERR_INSPECTOR_NOT_CONNECTED`

`node:inspector` module ကို သုံးနေစဉ် — inspector က connect မလုပ်ရသေးခင် ၎င်းကို အသုံးပြုဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_INSPECTOR_NOT_WORKER"></a>

### `ERR_INSPECTOR_NOT_WORKER`

worker thread ကနေသာ သုံးလို့ရတဲ့ API တစ်ခုကို main thread ပေါ်မှာ ခေါ်ယူခဲ့ပါတယ်။

<a id="ERR_INTERNAL_ASSERTION"></a>

### `ERR_INTERNAL_ASSERTION`

Node.js ထဲမှာ bug တစ်ခု ရှိနေတာ ဒါမှမဟုတ် Node.js ရဲ့ internals တွေကို မှားယွင်းစွာ အသုံးပြုခဲ့တာ ဖြစ်ပါတယ်။ ဒီ error ကို ဖြေရှင်းဖို့ <https://github.com/nodejs/node/issues> မှာ issue တစ်ခု ဖွင့်ပေးပါ။

<a id="ERR_INVALID_ADDRESS"></a>

### `ERR_INVALID_ADDRESS`

ပေးထားတဲ့ address ကို Node.js API က အသိအမှတ် မပြုနိုင်ပါဘူး။

<a id="ERR_INVALID_ADDRESS_FAMILY"></a>

### `ERR_INVALID_ADDRESS_FAMILY`

ပေးထားတဲ့ address family ကို Node.js API က အသိအမှတ် မပြုနိုင်ပါဘူး။

<a id="ERR_INVALID_ARG_TYPE"></a>

### `ERR_INVALID_ARG_TYPE`

Node.js API တစ်ခုဆီကို မှားယွင်းတဲ့ type ရှိတဲ့ argument တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_INVALID_ARG_VALUE"></a>

### `ERR_INVALID_ARG_VALUE`

ပေးထားတဲ့ argument တစ်ခုအတွက် invalid (မမှန်ကန်သော) သို့မဟုတ် support မလုပ်တဲ့ တန်ဖိုးတစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_INVALID_ASYNC_ID"></a>

### `ERR_INVALID_ASYNC_ID`

`AsyncHooks` ကို သုံးပြီး invalid ဖြစ်တဲ့ `asyncId` ဒါမှမဟုတ် `triggerAsyncId` တစ်ခုကို ဖြတ်သန်းပေးခဲ့ပါတယ်။ -1 ထက် ငယ်တဲ့ id တစ်ခုက ဘယ်တော့မှ မဖြစ်သင့်ပါဘူး။

<a id="ERR_INVALID_BUFFER_SIZE"></a>

### `ERR_INVALID_BUFFER_SIZE`

`Buffer` တစ်ခုပေါ်မှာ swap (လဲလှယ်မှု) တစ်ခုကို လုပ်ဆောင်ခဲ့ပေမယ့် ၎င်းရဲ့ size က ဒီ operation နဲ့ ကိုက်ညီမှု မရှိခဲ့ပါဘူး။

<a id="ERR_INVALID_CHAR"></a>

### `ERR_INVALID_CHAR`

headers ထဲမှာ invalid ဖြစ်တဲ့ character တွေ တွေ့ရှိခဲ့ပါတယ်။

<a id="ERR_INVALID_CURSOR_POS"></a>

### `ERR_INVALID_CURSOR_POS`

ပေးထားတဲ့ stream တစ်ခုပေါ်က cursor တစ်ခုကို column တစ်ခု သတ်မှတ်မပေးဘဲ သတ်မှတ်ထားတဲ့ row တစ်ခုဆီ ရွှေ့လို့ မရပါဘူး။

<a id="ERR_INVALID_FD"></a>

### `ERR_INVALID_FD`

file descriptor ('fd') တစ်ခု မမှန်ကန်ခဲ့ပါဘူး (ဥပမာ — အနုတ် (negative) တန်ဖိုး ဖြစ်နေတာမျိုး)။

<a id="ERR_INVALID_FD_TYPE"></a>

### `ERR_INVALID_FD_TYPE`

file descriptor ('fd') ရဲ့ type က မမှန်ကန်ခဲ့ပါဘူး။

<a id="ERR_INVALID_FILE_URL_HOST"></a>

### `ERR_INVALID_FILE_URL_HOST`

`file:` URLs တွေကို စားသုံးတဲ့ Node.js API တစ်ခု ([`fs`][] module ထဲက function အချို့လိုမျိုး) က ကိုက်ညီမှု မရှိတဲ့ host ပါတဲ့ file URL တစ်ခုကို ကြုံတွေ့ခဲ့ပါတယ်။ `localhost` ဒါမှမဟုတ် ဗလာ (empty) host ကိုသာ support လုပ်တဲ့ Unix-like systems တွေပေါ်မှာသာ ဒီအခြေအနေ ဖြစ်ပေါ်နိုင်ပါတယ်။

<a id="ERR_INVALID_FILE_URL_PATH"></a>

### `ERR_INVALID_FILE_URL_PATH`

`file:` URLs တွေကို စားသုံးတဲ့ Node.js API တစ်ခု ([`fs`][] module ထဲက function အချို့လိုမျိုး) က ကိုက်ညီမှု မရှိတဲ့ path ပါတဲ့ file URL တစ်ခုကို ကြုံတွေ့ခဲ့ပါတယ်။ path တစ်ခုကို သုံးလို့ ရလား မရလားဆိုတာ ဆုံးဖြတ်တဲ့ တိကျတဲ့ semantics တွေက platform အပေါ် မူတည်ပါတယ်။

throw လုပ်လိုက်တဲ့ error object မှာ invalid ဖြစ်တဲ့ `file:` URL ရဲ့ URL object ပါဝင်တဲ့ `input` property တစ်ခု ပါဝင်ပါတယ်။

<a id="ERR_INVALID_HANDLE_TYPE"></a>

### `ERR_INVALID_HANDLE_TYPE`

child process တစ်ခုဆီကို IPC communication channel တစ်ခုကနေ support မလုပ်တဲ့ "handle" တစ်ခု ပို့ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ အသေးစိတ် အချက်အလက်တွေအတွက် [`subprocess.send()`][] နဲ့ [`process.send()`][] ကို ကြည့်ပါ။

<a id="ERR_INVALID_HTTP_TOKEN"></a>

### `ERR_INVALID_HTTP_TOKEN`

invalid ဖြစ်တဲ့ HTTP token တစ်ခု ပေးအပ်ခဲ့ပါတယ်။

<a id="ERR_INVALID_IP_ADDRESS"></a>

### `ERR_INVALID_IP_ADDRESS`

IP address တစ်ခု မမှန်ကန်ပါဘူး။

<a id="ERR_INVALID_MIME_SYNTAX"></a>

### `ERR_INVALID_MIME_SYNTAX`

MIME တစ်ခုရဲ့ syntax က မမှန်ကန်ပါဘူး။

<a id="ERR_INVALID_MODULE"></a>

### `ERR_INVALID_MODULE`

မရှိတဲ့ ဒါမှမဟုတ် တစ်နည်းနည်းနဲ့ မမှန်ကန်တဲ့ module တစ်ခုကို load လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_INVALID_MODULE_SPECIFIER"></a>

### `ERR_INVALID_MODULE_SPECIFIER`

import လုပ်လိုက်တဲ့ module string က invalid ဖြစ်တဲ့ URL တစ်ခု၊ package name တစ်ခု၊ ဒါမှမဟုတ် package subpath specifier တစ်ခု ဖြစ်ပါတယ်။

<a id="ERR_INVALID_OBJECT_DEFINE_PROPERTY"></a>

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY`

object တစ်ခုရဲ့ property ပေါ်မှာ invalid attribute တစ်ခုကို သတ်မှတ်ရာမှာ error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။

<a id="ERR_INVALID_PACKAGE_CONFIG"></a>

### `ERR_INVALID_PACKAGE_CONFIG`

invalid ဖြစ်တဲ့ [`package.json`][] file တစ်ခုကို parse လုပ်ရာမှာ မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_INVALID_PACKAGE_TARGET"></a>

### `ERR_INVALID_PACKAGE_TARGET`

`package.json` ရဲ့ [`"exports"`][] field ထဲမှာ ကြိုးစားလုပ်ဆောင်လိုက်တဲ့ module resolution အတွက် invalid ဖြစ်တဲ့ target mapping တန်ဖိုး တစ်ခု ပါဝင်နေပါတယ်။

<a id="ERR_INVALID_PROTOCOL"></a>

### `ERR_INVALID_PROTOCOL`

`http.request()` ဆီကို invalid ဖြစ်တဲ့ `options.protocol` တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_INVALID_REPL_EVAL_CONFIG"></a>

### `ERR_INVALID_REPL_EVAL_CONFIG`

[`REPL`][] config ထဲမှာ `breakEvalOnSigint` နဲ့ `eval` option နှစ်ခုလုံးကို သတ်မှတ်ထားခဲ့ပါတယ် — ဒါက support မလုပ်ပါဘူး။

<a id="ERR_INVALID_REPL_INPUT"></a>

### `ERR_INVALID_REPL_INPUT`

ဒီ input ကို [`REPL`][] မှာ သုံးလို့ မရပါဘူး။ ဒီ error ကို ဘယ်အခြေအနေတွေမှာ သုံးလဲဆိုတာကို [`REPL`][] documentation မှာ ဖော်ပြထားပါတယ်။

<a id="ERR_INVALID_RETURN_PROPERTY"></a>

### `ERR_INVALID_RETURN_PROPERTY`

function option တစ်ခုက execute လုပ်တဲ့အခါ ၎င်းရဲ့ ပြန်ပေးလိုက်တဲ့ object properties တွေထဲက တစ်ခုအတွက် မှန်ကန်တဲ့ တန်ဖိုး တစ်ခုကို မပေးအပ်တဲ့အခါ throw လုပ်ပါတယ်။

<a id="ERR_INVALID_RETURN_PROPERTY_VALUE"></a>

### `ERR_INVALID_RETURN_PROPERTY_VALUE`

function option တစ်ခုက execute လုပ်တဲ့အခါ ၎င်းရဲ့ ပြန်ပေးလိုက်တဲ့ object properties တွေထဲက တစ်ခုအတွက် မျှော်လင့်ထားတဲ့ တန်ဖိုး type ကို မပေးအပ်တဲ့အခါ throw လုပ်ပါတယ်။

<a id="ERR_INVALID_RETURN_VALUE"></a>

### `ERR_INVALID_RETURN_VALUE`

function option တစ်ခုက execute လုပ်တဲ့အခါ မျှော်လင့်ထားတဲ့ တန်ဖိုး type ကို ပြန်မပေးတဲ့အခါ throw လုပ်ပါတယ် — ဥပမာ function တစ်ခုက promise တစ်ခုကို ပြန်ပေးဖို့ မျှော်လင့်ထားချိန်မျိုးမှာ ဖြစ်ပါတယ်။

<a id="ERR_INVALID_STATE"></a>

### `ERR_INVALID_STATE`

invalid state (မမှန်ကန်တဲ့ အခြေအနေ) တစ်ခုကြောင့် operation တစ်ခုကို ပြီးမြောက်အောင် မလုပ်နိုင်ဘူးဆိုတာကို ဖော်ပြပါတယ်။ ဥပမာ — object တစ်ခုက ဖျက်ဆီးပြီးသား (destroyed) ဖြစ်နေတာ ဒါမှမဟုတ် အခြား operation တစ်ခုကို လုပ်ဆောင်နေတာ ဖြစ်နိုင်ပါတယ်။

<a id="ERR_INVALID_SYNC_FORK_INPUT"></a>

### `ERR_INVALID_SYNC_FORK_INPUT`

asynchronous fork တစ်ခုဆီကို stdio input အဖြစ် `Buffer`, `TypedArray`, `DataView`, ဒါမှမဟုတ် `string` တစ်ခုကို ပေးအပ်ခဲ့ပါတယ်။ အသေးစိတ် အချက်အလက်တွေအတွက် [`child_process`][] module ရဲ့ documentation ကို ကြည့်ပါ။

<a id="ERR_INVALID_THIS"></a>

### `ERR_INVALID_THIS`

Node.js API function တစ်ခုကို ကိုက်ညီမှု မရှိတဲ့ `this` တန်ဖိုး တစ်ခုနဲ့ ခေါ်ယူခဲ့ပါတယ်။

```js
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// Throws a TypeError with code 'ERR_INVALID_THIS'
```

<a id="ERR_INVALID_TUPLE"></a>

### `ERR_INVALID_TUPLE`

[WHATWG][WHATWG URL API] ရဲ့ [`URLSearchParams` constructor][`new URLSearchParams(iterable)`] ဆီကို ပေးလိုက်တဲ့ `iterable` ထဲက element တစ်ခုက `[name, value]` tuple ကို ကိုယ်စားပြုမှု မရှိခဲ့ပါဘူး — ဆိုလိုတာက element တစ်ခုက iterable မဟုတ်တာ ဒါမှမဟုတ် element နှစ်ခုတိတိ ပါဝင်မှု မရှိတာမျိုး ဖြစ်တဲ့အခါ ဖြစ်ပါတယ်။

<a id="ERR_INVALID_TYPESCRIPT_SYNTAX"></a>

### `ERR_INVALID_TYPESCRIPT_SYNTAX`

ပေးထားတဲ့ TypeScript syntax က မမှန်ကန်ပါဘူး။

<a id="ERR_INVALID_URI"></a>

### `ERR_INVALID_URI`

invalid ဖြစ်တဲ့ URI တစ်ခုကို ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_INVALID_URL"></a>

### `ERR_INVALID_URL`

parse လုပ်ဖို့အတွက် [WHATWG][WHATWG URL API] ရဲ့ [`URL`
constructor][`new URL(input)`] ဒါမှမဟုတ် မျိုးဆက်ဟောင်း (legacy) [`url.parse()`][] ဆီကို invalid URL တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။ throw လုပ်လိုက်တဲ့ error object မှာ ပုံမှန်အားဖြင့် parse မအောင်မြင်ခဲ့တဲ့ URL ပါဝင်တဲ့ `'input'` ဆိုတဲ့ property အပိုတစ်ခု ပါလေ့ ရှိပါတယ်။

<a id="ERR_INVALID_URL_PATTERN"></a>

### `ERR_INVALID_URL_PATTERN`

parse လုပ်ဖို့အတွက် [WHATWG][WHATWG URL API] ရဲ့ [`URLPattern` constructor][`new URLPattern(input)`] ဆီကို invalid URLPattern တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_INVALID_URL_SCHEME"></a>

### `ERR_INVALID_URL_SCHEME`

တိကျတဲ့ ရည်ရွယ်ချက်တစ်ခုအတွက် ကိုက်ညီမှု မရှိတဲ့ scheme (protocol) တစ်ခုပါတဲ့ URL တစ်ခုကို သုံးဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ ဒါကို [`fs`][] module ထဲက [WHATWG URL API][] support မှာသာ လက်ရှိ သုံးပါတယ် (`'file'` scheme ပါတဲ့ URLs တွေကိုသာ လက်ခံတဲ့နေရာ) — ဒါပေမယ့် နောင်မှာ တခြား Node.js APIs တွေမှာလည်း သုံးလာနိုင်ပါတယ်။

<a id="ERR_IPC_CHANNEL_CLOSED"></a>

### `ERR_IPC_CHANNEL_CLOSED`

ပိတ်ပြီးသား IPC communication channel တစ်ခုကို အသုံးပြုဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_IPC_DISCONNECTED"></a>

### `ERR_IPC_DISCONNECTED`

disconnect လုပ်ပြီးသား IPC communication channel တစ်ခုကို disconnect လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ အသေးစိတ် အချက်အလက်တွေအတွက် [`child_process`][] module ရဲ့ documentation ကို ကြည့်ပါ။

<a id="ERR_IPC_ONE_PIPE"></a>

### `ERR_IPC_ONE_PIPE`

IPC communication channel တစ်ခုထက်ပိုပြီး သုံးကာ child Node.js process တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ အသေးစိတ် အချက်အလက်တွေအတွက် [`child_process`][] module ရဲ့ documentation ကို ကြည့်ပါ။

<a id="ERR_IPC_SYNC_FORK"></a>

### `ERR_IPC_SYNC_FORK`

synchronously fork လုပ်ထားတဲ့ Node.js process တစ်ခုနဲ့ IPC communication channel တစ်ခုကို ဖွင့်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ အသေးစိတ် အချက်အလက်တွေအတွက် [`child_process`][] module ရဲ့ documentation ကို ကြည့်ပါ။

<a id="ERR_IP_BLOCKED"></a>

### `ERR_IP_BLOCKED`

IP ကို `net.BlockList` က block လုပ်ထားပါတယ်။

<a id="ERR_LOADER_CHAIN_INCOMPLETE"></a>

### `ERR_LOADER_CHAIN_INCOMPLETE`

ESM loader hook တစ်ခုက `next()` ကို မခေါ်ဘဲ၊ short circuit (လမ်းကြောင်း တိုဖြတ်) ဆောင်ရွက်မှုကိုလည်း ရှင်းလင်းစွာ အချက်ပြမှု မရှိဘဲ ပြန်ထွက်သွားခဲ့ပါတယ်။

<a id="ERR_LOAD_SQLITE_EXTENSION"></a>

### `ERR_LOAD_SQLITE_EXTENSION`

SQLite extension တစ်ခုကို load လုပ်ရာမှာ error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။

<a id="ERR_MEMORY_ALLOCATION_FAILED"></a>

### `ERR_MEMORY_ALLOCATION_FAILED`

memory ခွဲဝေပေးဖို့ (များသောအားဖြင့် C++ layer ထဲမှာ) ကြိုးစားမှု ပြုလုပ်ခဲ့ပေမယ့် မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE"></a>

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE`

[`MessagePort`][] တစ်ခုဆီကို post လုပ်လိုက်တဲ့ message တစ်ခုကို target [vm][] `Context` ထဲမှာ deserialize လုပ်လို့ မရခဲ့ပါဘူး။ လက်ရှိမှာ Node.js objects တွေ အားလုံးကို context မရွေး အောင်မြင်စွာ instantiate လုပ်နိုင်တာ မဟုတ်ပါဘူး — ဒါကြောင့် အဲဒီ objects တွေကို `postMessage()` သုံးပြီး transfer လုပ်ဖို့ ကြိုးစားရင် အဲဒီလိုအခြေအနေမျိုးမှာ လက်ခံတဲ့ဘက်မှာ မအောင်မြင်နိုင်ပါဘူး။

<a id="ERR_METHOD_NOT_IMPLEMENTED"></a>

### `ERR_METHOD_NOT_IMPLEMENTED`

method တစ်ခု လိုအပ်ပေမယ့် implement မလုပ်ရသေးပါဘူး။

<a id="ERR_MISSING_ARGS"></a>

### `ERR_MISSING_ARGS`

Node.js API တစ်ခုရဲ့ မဖြစ်မနေ လိုအပ်တဲ့ argument တစ်ခုကို ဖြတ်သန်းပေးမှု မရှိခဲ့ပါဘူး။ ဒါကို API specification နဲ့ တိကျစွာ ကိုက်ညီမှု ရှိစေဖို့အတွက်သာ သုံးပါတယ် (အချို့အခြေအနေတွေမှာ `func(undefined)` ကို လက်ခံပေမယ့် `func()` ကို လက်မခံတာမျိုး ဖြစ်နိုင်ပါတယ်)။ Native Node.js APIs အများစုမှာ `func(undefined)` နဲ့ `func()` ကို တူညီတဲ့ပုံစံအတိုင်း သဘောထားပြီး — [`ERR_INVALID_ARG_TYPE`][] error code ကို အစားထိုး သုံးနိုင်ပါတယ်။

<a id="ERR_MISSING_OPTION"></a>

### `ERR_MISSING_OPTION`

options objects တွေကို လက်ခံတဲ့ APIs တွေအတွက် options အချို့က မဖြစ်မနေ လိုအပ်နိုင်ပါတယ်။ လိုအပ်တဲ့ option တစ်ခု ပျောက်နေရင် ဒီ code ကို throw လုပ်ပါတယ်။

<a id="ERR_MISSING_PASSPHRASE"></a>

### `ERR_MISSING_PASSPHRASE`

passphrase တစ်ခုကို သတ်မှတ်မပေးဘဲ encrypted key (စာဝှက်ထားတဲ့ key) တစ်ခုကို ဖတ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_MISSING_PLATFORM_FOR_WORKER"></a>

### `ERR_MISSING_PLATFORM_FOR_WORKER`

ဒီ Node.js instance က သုံးနေတဲ့ V8 platform က Workers တွေကို ဖန်တီးတာကို support မလုပ်ပါဘူး။ ဒါက Workers တွေအတွက် embedder support မရှိတာကြောင့် ဖြစ်ပါတယ်။ အထူးသဖြင့် — ဒီ error က standard Node.js builds တွေမှာ ဖြစ်မလာပါဘူး။

<a id="ERR_MODULE_LINK_MISMATCH"></a>

### `ERR_MODULE_LINK_MISMATCH`

module တစ်ခုကို link လုပ်လို့ မရပါဘူး — အကြောင်းကတော့ ၎င်းထဲက module requests တွေကို တူညီတဲ့ module တစ်ခုတည်းအဖြစ် resolve မလုပ်နိုင်လို့ ဖြစ်ပါတယ်။

<a id="ERR_MODULE_NOT_FOUND"></a>

### `ERR_MODULE_NOT_FOUND`

`import` operation တစ်ခုကို ကြိုးစားတဲ့အခါ ဒါမှမဟုတ် program ရဲ့ entry point ကို load လုပ်တဲ့အခါ ECMAScript modules loader က module file တစ်ခုကို resolve လုပ်လို့ မရခဲ့ပါဘူး။

<a id="ERR_MULTIPLE_CALLBACK"></a>

### `ERR_MULTIPLE_CALLBACK`

callback တစ်ခုကို တစ်ကြိမ်ထက်ပိုပြီး ခေါ်ယူခဲ့ပါတယ်။

callback တစ်ခုကို တစ်ကြိမ်သာ ခေါ်ယူဖို့ ရည်ရွယ်ထားပါတယ် — query တစ်ခုက fulfilled (ပြည့်စုံ) ဖြစ်နိုင်သလို rejected (ပယ်ချ) လည်း ဖြစ်နိုင်ပေမယ့် တစ်ပြိုင်နက် နှစ်မျိုးလုံး ဖြစ်လို့ မရပါဘူး။ callback တစ်ခုကို တစ်ကြိမ်ထက်ပို ခေါ်ယူမိရင်တော့ နောက်ဆုံး ပြောခဲ့တဲ့အခြေအနေမျိုး ဖြစ်လာနိုင်ပါတယ်။

<a id="ERR_NAPI_CONS_FUNCTION"></a>

### `ERR_NAPI_CONS_FUNCTION`

`Node-API` ကို သုံးနေစဉ် — ဖြတ်သန်းပေးလိုက်တဲ့ constructor တစ်ခုက function တစ်ခု မဟုတ်ခဲ့ပါဘူး။

<a id="ERR_NAPI_INVALID_DATAVIEW_ARGS"></a>

### `ERR_NAPI_INVALID_DATAVIEW_ARGS`

`napi_create_dataview()` ကို ခေါ်ယူနေစဉ် — ပေးထားတဲ့ `offset` တစ်ခုက dataview ရဲ့ နယ်နိမိတ် (bounds) ပြင်ပ ဖြစ်နေတာ ဒါမှမဟုတ် `offset + length` က ပေးထားတဲ့ `buffer` ရဲ့ အလျားထက် ကြီးနေခဲ့ပါတယ်။

<a id="ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT"></a>

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT`

`napi_create_typedarray()` ကို ခေါ်ယူနေစဉ် — ပေးထားတဲ့ `offset` က element size ရဲ့ အဆများ (multiple) မဟုတ်ခဲ့ပါဘူး။

<a id="ERR_NAPI_INVALID_TYPEDARRAY_LENGTH"></a>

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH`

`napi_create_typedarray()` ကို ခေါ်ယူနေစဉ် — `(length * size_of_element) +
byte_offset` က ပေးထားတဲ့ `buffer` ရဲ့ အလျားထက် ကြီးနေခဲ့ပါတယ်။

<a id="ERR_NAPI_TSFN_CALL_JS"></a>

### `ERR_NAPI_TSFN_CALL_JS`

thread-safe function ရဲ့ JavaScript အပိုင်းကို invoke (ခေါ်ယူ) လုပ်ရာမှာ error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။

<a id="ERR_NAPI_TSFN_GET_UNDEFINED"></a>

### `ERR_NAPI_TSFN_GET_UNDEFINED`

JavaScript ရဲ့ `undefined` တန်ဖိုးကို ပြန်ယူဖို့ ကြိုးစားရာမှာ error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။

<a id="ERR_NON_CONTEXT_AWARE_DISABLED"></a>

### `ERR_NON_CONTEXT_AWARE_DISABLED`

non-context-aware native addon တစ်ခုကို ၎င်းတို့ကို ခွင့်မပြုတဲ့ process တစ်ခုထဲမှာ load လုပ်ခဲ့ပါတယ်။

<a id="ERR_NOT_BUILDING_SNAPSHOT"></a>

### `ERR_NOT_BUILDING_SNAPSHOT`

Node.js က V8 startup snapshot တစ်ခုကို တည်ဆောက်နေတာ မဟုတ်ပေမယ့် snapshot တည်ဆောက်တဲ့အခါမှသာ သုံးလို့ရတဲ့ operations တွေကို အသုံးပြုဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION"></a>

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION`

single-executable application (တစ်ခုတည်းသော executable application) တစ်ခုထဲမှာ မဟုတ်တဲ့အခါ ဒီ operation ကို လုပ်ဆောင်လို့ မရပါဘူး။

<a id="ERR_NOT_SUPPORTED_IN_SNAPSHOT"></a>

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT`

startup snapshot တစ်ခုကို တည်ဆောက်နေချိန်မှာ support မလုပ်တဲ့ operations တွေကို လုပ်ဆောင်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_NO_CRYPTO"></a>

### `ERR_NO_CRYPTO`

Node.js ကို OpenSSL crypto support နဲ့ compile မလုပ်ထားဘဲ crypto features တွေကို အသုံးပြုဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_NO_ICU"></a>

### `ERR_NO_ICU`

[ICU][] လိုအပ်တဲ့ features တွေကို အသုံးပြုဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပေမယ့် Node.js ကို ICU support နဲ့ compile မလုပ်ထားပါဘူး။

<a id="ERR_NO_TEMPORAL"></a>

### `ERR_NO_TEMPORAL`

[`Temporal`][] လိုအပ်တဲ့ features တွေကို အသုံးပြုဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပေမယ့် Node.js ကို `Temporal` support နဲ့ compile မလုပ်ထားတာ ဒါမှမဟုတ် လက်ရှိ environment ထဲမှာ ၎င်းကို disable လုပ်ထားပါတယ် (ဥပမာ — `--no-harmony-temporal` နဲ့ run လုပ်နေချိန်မျိုး)။

<a id="ERR_NO_TYPESCRIPT"></a>

### `ERR_NO_TYPESCRIPT`

[Native TypeScript support][] လိုအပ်တဲ့ features တွေကို အသုံးပြုဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပေမယ့် Node.js ကို TypeScript support နဲ့ compile မလုပ်ထားပါဘူး။

<a id="ERR_OPERATION_FAILED"></a>

### `ERR_OPERATION_FAILED`

operation တစ်ခု မအောင်မြင်ခဲ့ပါဘူး။ ဒါကို ပုံမှန်အားဖြင့် asynchronous operation တစ်ခုရဲ့ ယေဘုယျ ကျရှုံးမှုကို အချက်ပြဖို့ သုံးပါတယ်။

<a id="ERR_OPTIONS_BEFORE_BOOTSTRAPPING"></a>

### `ERR_OPTIONS_BEFORE_BOOTSTRAPPING`

bootstrapping ပြီးမြောက်ခင် options တွေကို ရယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_OUT_OF_RANGE"></a>

### `ERR_OUT_OF_RANGE`

ပေးထားတဲ့ တန်ဖိုးတစ်ခုက လက်ခံနိုင်တဲ့ အကွာအဝေး (range) ပြင်ပ ဖြစ်နေပါတယ်။

<a id="ERR_PACKAGE_IMPORT_NOT_DEFINED"></a>

### `ERR_PACKAGE_IMPORT_NOT_DEFINED`

`package.json` ရဲ့ [`"imports"`][] field ထဲမှာ ပေးထားတဲ့ internal package specifier mapping ကို သတ်မှတ်မထားပါဘူး။

<a id="ERR_PACKAGE_MAP_EXTERNAL_FILE"></a>

### `ERR_PACKAGE_MAP_EXTERNAL_FILE`

module တစ်ခုက [package map][] ကို သုံးပြီး bare specifier တစ်ခုကို resolve လုပ်ဖို့ ကြိုးစားခဲ့ပေမယ့် import လုပ်နေတဲ့ file က map ထဲမှာ သတ်မှတ်ထားတဲ့ package တစ်ခုခုရဲ့ အတွင်းမှာ တည်ရှိမနေပါဘူး။

```console
$ node --experimental-package-map=./package-map.json /tmp/script.js
Error [ERR_PACKAGE_MAP_EXTERNAL_FILE]: Cannot resolve "dep-a" from "/tmp/script.js": file is not within any package defined in /path/to/package-map.json
```

ဒီ error ကို ဖြေရှင်းဖို့ — import လုပ်နေတဲ့ file က package map ထဲမှာ စာရင်းပြုစုထားတဲ့ package directory တစ်ခုခုရဲ့ အတွင်းမှာ ရှိနေဖို့ သေချာအောင် လုပ်ပါ၊ ဒါမှမဟုတ် `url` က import လုပ်နေတဲ့ file ကို လွှမ်းခြုံနိုင်တဲ့ package entry အသစ်တစ်ခုကို ထည့်ပါ။

<a id="ERR_PACKAGE_MAP_INVALID"></a>

### `ERR_PACKAGE_MAP_INVALID`

[package map][] configuration file က invalid ဖြစ်ပါတယ်။ အောက်ပါ အခြေအနေတွေမှာ ဖြစ်ပေါ်နိုင်ပါတယ်:

* သတ်မှတ်ထားတဲ့ path မှာ file က မရှိပါဘူး။
* file ထဲမှာ invalid JSON ပါဝင်နေပါတယ်။
* file ထဲမှာ လိုအပ်တဲ့ `packages` object ပျောက်နေပါတယ်။
* package entry တစ်ခုမှာ လိုအပ်တဲ့ `url` field ပျောက်နေပါတယ်။
* package entries နှစ်ခုမှာ `url` တန်ဖိုး တူညီနေပါတယ်။

```console
$ node --experimental-package-map=./missing.json app.js
Error [ERR_PACKAGE_MAP_INVALID]: Invalid package map at "./missing.json": file not found
```

<a id="ERR_PACKAGE_MAP_KEY_NOT_FOUND"></a>

### `ERR_PACKAGE_MAP_KEY_NOT_FOUND`

[package map][] ထဲက package တစ်ခုရဲ့ `dependencies` object က `packages` object ထဲမှာ သတ်မှတ်မထားတဲ့ package key တစ်ခုကို ရည်ညွှန်းနေပါတယ်။

```json
{
  "packages": {
    "app": {
      "url": "./app",
      "dependencies": {
        "foo": "nonexistent"
      }
    }
  }
}
```

ဒီဥပမာမှာ `"nonexistent"` ကို dependency target အဖြစ် ရည်ညွှန်းထားပေမယ့် `packages` ထဲမှာ သတ်မှတ်မထားတာကြောင့် ဒီ error ကို throw လုပ်မှာ ဖြစ်ပါတယ်။

ဒီ error ကို ဖြေရှင်းဖို့ — `dependencies` တန်ဖိုးတွေထဲမှာ ရည်ညွှန်းထားတဲ့ package keys တွေ အားလုံးက `packages` object ထဲမှာ သတ်မှတ်ထားဖို့ သေချာအောင် လုပ်ပါ။

<a id="ERR_PACKAGE_PATH_NOT_EXPORTED"></a>

### `ERR_PACKAGE_PATH_NOT_EXPORTED`

`package.json` ရဲ့ [`"exports"`][] field က တောင်းဆိုထားတဲ့ subpath ကို export မလုပ်ပါဘူး။ exports တွေက encapsulated (သီးခြားစုဖွဲ့ထား) ဖြစ်တာကြောင့် — export မလုပ်ထားတဲ့ private internal modules တွေကို absolute URL တစ်ခုကို သုံးမယ်ဆိုရင်လွဲပြီး package resolution ကနေတစ်ဆင့် import လုပ်လို့ မရပါဘူး။

<a id="ERR_PARSE_ARGS_INVALID_OPTION_VALUE"></a>

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE`

`strict` ကို `true` လို့ သတ်မှတ်ထားတဲ့အခါ — {string} type ရှိတဲ့ option တစ်ခုအတွက် {boolean} တန်ဖိုးတစ်ခု ဒါမှမဟုတ် {boolean} type ရှိတဲ့ option တစ်ခုအတွက် {string} တန်ဖိုးတစ်ခု ပေးအပ်ခဲ့ရင် [`util.parseArgs()`][] က throw လုပ်ပါတယ်။

<a id="ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL"></a>

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL`

positional argument တစ်ခုကို ပေးအပ်ပြီး `allowPositionals` က `false` လို့ သတ်မှတ်ထားတဲ့အခါ [`util.parseArgs()`][] က throw လုပ်ပါတယ်။

<a id="ERR_PARSE_ARGS_UNKNOWN_OPTION"></a>

### `ERR_PARSE_ARGS_UNKNOWN_OPTION`

`strict` ကို `true` လို့ သတ်မှတ်ထားတဲ့အခါ — argument တစ်ခုက `options` ထဲမှာ configure မလုပ်ထားဘူးဆိုရင် [`util.parseArgs()`][] က throw လုပ်ပါတယ်။

<a id="ERR_PERFORMANCE_INVALID_TIMESTAMP"></a>

### `ERR_PERFORMANCE_INVALID_TIMESTAMP`

performance mark ဒါမှမဟုတ် measure တစ်ခုအတွက် invalid ဖြစ်တဲ့ timestamp တန်ဖိုး တစ်ခုကို ပေးအပ်ခဲ့ပါတယ်။

<a id="ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS"></a>

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS`

performance measure တစ်ခုအတွက် invalid ဖြစ်တဲ့ options တွေကို ပေးအပ်ခဲ့ပါတယ်။

<a id="ERR_PROTO_ACCESS"></a>

### `ERR_PROTO_ACCESS`

`Object.prototype.__proto__` ကို ဝင်ရောက် သုံးစွဲတာကို [`--disable-proto=throw`][] သုံးပြီး တားမြစ်ထားပါတယ်။ object တစ်ခုရဲ့ prototype ကို ရယူဖို့နဲ့ သတ်မှတ်ဖို့ [`Object.getPrototypeOf`][] နဲ့ [`Object.setPrototypeOf`][] တို့ကို သုံးသင့်ပါတယ်။

<a id="ERR_PROXY_INVALID_CONFIG"></a>

### `ERR_PROXY_INVALID_CONFIG`

proxy configuration က invalid ဖြစ်နေလို့ request တစ်ခုကို proxy လုပ်ဖို့ မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_PROXY_TUNNEL"></a>

### `ERR_PROXY_TUNNEL`

`NODE_USE_ENV_PROXY` ဒါမှမဟုတ် `--use-env-proxy` ကို enable လုပ်ထားတဲ့အခါ proxy tunnel တစ်ခုကို တည်ဆောက်ဖို့ မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_QUIC_APPLICATION_ERROR"></a>

### `ERR_QUIC_APPLICATION_ERROR`

> Stability: 1 - Experimental

QUIC application error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။

<a id="ERR_QUIC_CONNECTION_FAILED"></a>

### `ERR_QUIC_CONNECTION_FAILED`

> Stability: 1 - Experimental

QUIC connection တစ်ခုကို တည်ဆောက်ရာမှာ မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_QUIC_ENDPOINT_CLOSED"></a>

### `ERR_QUIC_ENDPOINT_CLOSED`

> Stability: 1 - Experimental

QUIC Endpoint တစ်ခု error တစ်ခုနဲ့ ပိတ်သွားခဲ့ပါတယ်။

<a id="ERR_QUIC_OPEN_STREAM_FAILED"></a>

### `ERR_QUIC_OPEN_STREAM_FAILED`

> Stability: 1 - Experimental

QUIC stream တစ်ခုကို ဖွင့်ရာမှာ မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_QUIC_STREAM_ABORTED"></a>

### `ERR_QUIC_STREAM_ABORTED`

> Stability: 1 - Experimental

QUIC stream ဒါမှမဟုတ် session တစ်ခုကို ရှင်းလင်းတဲ့ application ဒါမှမဟုတ် transport error code တစ်ခုနဲ့ abort လုပ်ဖို့ throw လုပ်လိုက်တဲ့ [`QuicError`][] အတွက် Node.js error code ပါ။

<a id="ERR_QUIC_STREAM_RESET"></a>

### `ERR_QUIC_STREAM_RESET`

> Stability: 1 - Experimental

QUIC stream တစ်ခုကို peer က reset လုပ်ခဲ့ပါတယ်။ ဒီ error ထဲမှာ peer က ပေးလိုက်တဲ့ reset code ပါဝင်ပါတယ်။

<a id="ERR_QUIC_TRANSPORT_ERROR"></a>

### `ERR_QUIC_TRANSPORT_ERROR`

> Stability: 1 - Experimental

QUIC transport error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။

<a id="ERR_QUIC_VERSION_NEGOTIATION_ERROR"></a>

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR`

> Stability: 1 - Experimental

QUIC session တစ်ခု မအောင်မြင်ခဲ့ပါဘူး — အကြောင်းကတော့ version negotiation လိုအပ်နေလို့ ဖြစ်ပါတယ်။

<a id="ERR_REQUIRE_ASYNC_MODULE"></a>

### `ERR_REQUIRE_ASYNC_MODULE`

`require()` နဲ့ [ES Module][] တစ်ခုကို load ဖို့ ကြိုးစားတဲ့အခါ — အဲဒီ module က asynchronous ဖြစ်နေပါတယ်။ ဆိုလိုတာက ၎င်းထဲမှာ top-level await ပါဝင်နေပါတယ်။

ဖမ်းယူမှု မရှိ (uncaught) ဖြစ်တဲ့အခါ `--experimental-print-required-tla` flag က graph ထဲက top-level awaits တွေရဲ့ တည်နေရာတွေကို stderr ဆီကို print လုပ်ပါတယ်။

ဒီ error မှာ အောက်ပါ non-enumerable properties တွေ ထပ်ဆောင်း ပါဝင်ပါတယ်:

* `requireStack` {string\[]} asynchronous module ကို လိုအပ်ခဲ့တဲ့ module ကနေ စပြီး မအောင်မြင်တဲ့ `require()` ဆီကို ဦးတည်သွားတဲ့ modules တွေရဲ့ ကွင်းဆက် (chain) ပါ။
* `topLevelAwaitLocations` {Object\[]} graph ထဲက top-level awaits တွေရဲ့ တည်နေရာတွေပါ။ `--experimental-print-required-tla` ကို enable လုပ်ထားမှသာ ဖြည့်စွက်ပေးပါတယ်။ entry တစ်ခုစီမှာ အောက်ပါ properties တွေ ရှိပါတယ်:
  * `url` {string} top-level await ပါဝင်တဲ့ module ရဲ့ URL ပါ။
  * `line` {number} top-level await ရဲ့ 1-based line number ပါ။
  * `column` {number} top-level await ရဲ့ 1-based column number ပါ။
  * `sourceLine` {string} top-level await ပါဝင်တဲ့ source line ပါ။

<a id="ERR_REQUIRE_CYCLE_MODULE"></a>

### `ERR_REQUIRE_CYCLE_MODULE`

`require()` နဲ့ [ES Module][] တစ်ခုကို load ဖို့ ကြိုးစားတဲ့အခါ — CommonJS မှ ESM သို့ ဒါမှမဟုတ် ESM မှ CommonJS သို့ ဆက်သွယ်မှု (edge) တစ်ခုက ချက်ချင်း cycle တစ်ခုထဲမှာ ပါဝင်နေပါတယ်။ ES Modules တွေက ၎င်းတို့ကို evaluate လုပ်နေပြီးသား ဖြစ်ချိန်မှာ ထပ်ပြီး evaluate လုပ်လို့ မရတာကြောင့် ဒါကို ခွင့်မပြုပါဘူး။

cycle ကို ရှောင်ဖို့ — cycle ထဲမှာ ပါဝင်တဲ့ `require()` ခေါ်ယူမှုက ES Module တစ်ခု (via `createRequire()`) ရဲ့ ဒါမှမဟုတ် CommonJS module တစ်ခုရဲ့ top-level မှာ မဖြစ်သင့်ဘဲ — inner function တစ်ခုထဲမှာ lazily (လိုအပ်မှသာ) လုပ်ဆောင်သင့်ပါတယ်။

<a id="ERR_REQUIRE_ESM"></a>

### `ERR_REQUIRE_ESM`

> Stability: 0 - Deprecated

`require()` နဲ့ [ES Module][] တစ်ခုကို load လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

`require()` က synchronous ES modules တွေကို load လုပ်တာကို အခု support လုပ်နေပြီ ဖြစ်တာကြောင့် ဒီ error ကို deprecated (အသုံးမပြုတော့ဟု သတ်မှတ်) ထားပါတယ်။ `require()` က top-level `await` ပါဝင်တဲ့ ES module တစ်ခုကို ကြုံတွေ့ရင် — အဲဒီအစား [`ERR_REQUIRE_ASYNC_MODULE`][] ကို throw လုပ်ပါလိမ့်မယ်။

<a id="ERR_REQUIRE_ESM_RACE_CONDITION"></a>

### `ERR_REQUIRE_ESM_RACE_CONDITION`

> Stability: 1 - Experimental.

`require()` နဲ့ [ES Module][] တစ်ခုကို load ဖို့ ကြိုးစားနေချိန်မှာ — အဲဒါကို asynchronously load လုပ်ဖို့ `import()` ခေါ်ယူမှု တစ်ခုက တစ်ပြိုင်နက် လုပ်ဆောင်နေပြီးသား ဖြစ်ခဲ့ပါတယ်။

<a id="ERR_SCRIPT_EXECUTION_INTERRUPTED"></a>

### `ERR_SCRIPT_EXECUTION_INTERRUPTED`

script execution ကို `SIGINT` က ကြားဖြတ် ရပ်တန့်စေခဲ့ပါတယ် (ဥပမာ — `Ctrl`+`C` ကို နှိပ်လိုက်တာမျိုး)။

<a id="ERR_SCRIPT_EXECUTION_TIMEOUT"></a>

### `ERR_SCRIPT_EXECUTION_TIMEOUT`

script execution က timeout ဖြစ်သွားပါတယ် — execute လုပ်နေတဲ့ script ထဲမှာ bug တွေ ရှိနေလို့ ဖြစ်နိုင်ပါတယ်။

<a id="ERR_SERVER_ALREADY_LISTEN"></a>

### `ERR_SERVER_ALREADY_LISTEN`

`net.Server` တစ်ခု listen လုပ်နေပြီးသား ဖြစ်ချိန်မှာ [`server.listen()`][] method ကို ခေါ်ယူခဲ့ပါတယ်။ ဒါက HTTP, HTTPS နဲ့ HTTP/2 `Server` instances တွေ အပါအဝင် `net.Server` ရဲ့ instance အားလုံးနဲ့ သက်ဆိုင်ပါတယ်။

<a id="ERR_SERVER_NOT_RUNNING"></a>

### `ERR_SERVER_NOT_RUNNING`

`net.Server` တစ်ခု run လုပ်နေတာ မဟုတ်တဲ့အခါ [`server.close()`][] method ကို ခေါ်ယူခဲ့ပါတယ်။ ဒါက HTTP, HTTPS နဲ့ HTTP/2 `Server` instances တွေ အပါအဝင် `net.Server` ရဲ့ instance အားလုံးနဲ့ သက်ဆိုင်ပါတယ်။

<a id="ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND"></a>

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND`

single executable application APIs တွေဆီကို asset တစ်ခုကို ခွဲခြားသတ်မှတ်ဖို့ key တစ်ခု ဖြတ်သန်းပေးခဲ့ပေမယ့် ကိုက်ညီတဲ့ အရာတစ်ခုကို ရှာမတွေ့ခဲ့ပါဘူး။

<a id="ERR_SOCKET_ALREADY_BOUND"></a>

### `ERR_SOCKET_ALREADY_BOUND`

bind လုပ်ပြီးသား socket တစ်ခုကို bind လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_SOCKET_BAD_BUFFER_SIZE"></a>

### `ERR_SOCKET_BAD_BUFFER_SIZE`

[`dgram.createSocket()`][] ထဲက `recvBufferSize` ဒါမှမဟုတ် `sendBufferSize` option တစ်ခုခုအတွက် invalid (negative) size တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_SOCKET_BAD_PORT"></a>

### `ERR_SOCKET_BAD_PORT`

port >= 0 နဲ့ < 65536 ဖြစ်ဖို့ မျှော်လင့်တဲ့ API function တစ်ခုက invalid တန်ဖိုး တစ်ခုကို လက်ခံရရှိခဲ့ပါတယ်။

<a id="ERR_SOCKET_BAD_TYPE"></a>

### `ERR_SOCKET_BAD_TYPE`

socket type (`udp4` ဒါမှမဟုတ် `udp6`) တစ်ခုကို မျှော်လင့်တဲ့ API function တစ်ခုက invalid တန်ဖိုး တစ်ခုကို လက်ခံရရှိခဲ့ပါတယ်။

<a id="ERR_SOCKET_BUFFER_SIZE"></a>

### `ERR_SOCKET_BUFFER_SIZE`

[`dgram.createSocket()`][] ကို သုံးနေစဉ် — receive ဒါမှမဟုတ် send `Buffer` ရဲ့ size ကို ဆုံးဖြတ်လို့ မရခဲ့ပါဘူး။

<a id="ERR_SOCKET_CLOSED"></a>

### `ERR_SOCKET_CLOSED`

ပိတ်ပြီးသား socket တစ်ခုပေါ်မှာ operation တစ်ခုကို လုပ်ဆောင်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_SOCKET_CLOSED_BEFORE_CONNECTION"></a>

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION`

connect လုပ်နေတဲ့ socket တစ်ခုပေါ်မှာ [`net.Socket.write()`][] ကို ခေါ်ယူပြီး — connection တည်ဆောက်မပြီးခင် socket က ပိတ်သွားတဲ့အခါ ဖြစ်ပါတယ်။

<a id="ERR_SOCKET_CONNECTION_TIMEOUT"></a>

### `ERR_SOCKET_CONNECTION_TIMEOUT`

family autoselection algorithm ကို သုံးနေစဉ် — socket က ခွင့်ပြုထားတဲ့ timeout အတွင်းမှာ DNS က ပြန်ပေးလိုက်တဲ့ address တစ်ခုခုဆီကိုမှ connect လုပ်နိုင်ခဲ့ပါဘူး။

<a id="ERR_SOCKET_DGRAM_IS_CONNECTED"></a>

### `ERR_SOCKET_DGRAM_IS_CONNECTED`

connect လုပ်ပြီးသား socket တစ်ခုပေါ်မှာ [`dgram.connect()`][] ခေါ်ယူမှု တစ်ခုကို ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_SOCKET_DGRAM_NOT_CONNECTED"></a>

### `ERR_SOCKET_DGRAM_NOT_CONNECTED`

disconnect လုပ်ထားတဲ့ socket တစ်ခုပေါ်မှာ [`dgram.disconnect()`][] ဒါမှမဟုတ် [`dgram.remoteAddress()`][] ခေါ်ယူမှု တစ်ခုကို ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_SOCKET_DGRAM_NOT_RUNNING"></a>

### `ERR_SOCKET_DGRAM_NOT_RUNNING`

ခေါ်ယူမှု တစ်ခု ပြုလုပ်ခဲ့ပေမယ့် UDP subsystem က run မနေပါဘူး။

<a id="ERR_SOCKET_HANDLE_ADOPTED"></a>

### `ERR_SOCKET_HANDLE_ADOPTED`

[`net.Server`][] ဒါမှမဟုတ် [`net.Socket`][] တစ်ခုက လွှဲပြောင်း သိမ်းယူပြီးသား (adopted) [`BoundSocket`][] တစ်ခုပေါ်မှာ operation တစ်ခုကို ကြိုးစား လုပ်ဆောင်ခဲ့ပါတယ်။ bound socket တစ်ခုကို adopt လုပ်ပြီးတာနဲ့ ၎င်းရဲ့ `address()` နဲ့ `close()` methods တွေကို နောက်ထပ် သုံးလို့ မရတော့ပါဘူး။

<a id="ERR_SOURCE_MAP_CORRUPT"></a>

### `ERR_SOURCE_MAP_CORRUPT`

source map က မရှိတာ ဒါမှမဟုတ် ပျက်စီးနေတာကြောင့် ၎င်းကို parse လုပ်လို့ မရခဲ့ပါဘူး။

<a id="ERR_SOURCE_MAP_MISSING_SOURCE"></a>

### `ERR_SOURCE_MAP_MISSING_SOURCE`

source map တစ်ခုကနေ import လုပ်ထားတဲ့ file တစ်ခုကို ရှာမတွေ့ခဲ့ပါဘူး။

<a id="ERR_SOURCE_PHASE_NOT_DEFINED"></a>

### `ERR_SOURCE_PHASE_NOT_DEFINED`

ပေးထားတဲ့ module import က source phase import syntax `import source x from 'x'` ဒါမှမဟုတ် `import.source(x)` အတွက် source phase imports representation တစ်ခုကို မပေးအပ်ပါဘူး။

<a id="ERR_SQLITE_ERROR"></a>

### `ERR_SQLITE_ERROR`

[SQLite][] ကနေ error တစ်ခု ပြန်လာခဲ့ပါတယ်။

<a id="ERR_SRI_PARSE"></a>

### `ERR_SRI_PARSE`

Subresource Integrity စစ်ဆေးမှုတစ်ခုအတွက် string တစ်ခု ပေးအပ်ခဲ့ပေမယ့် ၎င်းကို parse လုပ်လို့ မရခဲ့ပါဘူး။ [Subresource Integrity specification][] ကို ကြည့်ပြီး integrity attributes တွေရဲ့ ပုံစံ (format) ကို စစ်ဆေးပါ။

<a id="ERR_STREAM_ALREADY_FINISHED"></a>

### `ERR_STREAM_ALREADY_FINISHED`

stream က finished (ပြီးဆုံး) သွားတာကြောင့် ပြီးမြောက်အောင် မလုပ်နိုင်တဲ့ stream method တစ်ခုကို ခေါ်ယူခဲ့ပါတယ်။

<a id="ERR_STREAM_CANNOT_PIPE"></a>

### `ERR_STREAM_CANNOT_PIPE`

[`Writable`][] stream တစ်ခုပေါ်မှာ [`stream.pipe()`][] ကို ခေါ်ယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_STREAM_DESTROYED"></a>

### `ERR_STREAM_DESTROYED`

stream ကို `stream.destroy()` သုံးပြီး ဖျက်ဆီးလိုက်တာကြောင့် ပြီးမြောက်အောင် မလုပ်နိုင်တဲ့ stream method တစ်ခုကို ခေါ်ယူခဲ့ပါတယ်။

<a id="ERR_STREAM_ITER_MISSING_FLAG"></a>

### `ERR_STREAM_ITER_MISSING_FLAG`

`--experimental-stream-iter` CLI flag ကို enable မလုပ်ဘဲ stream/iter API တစ်ခုကို အသုံးပြုခဲ့ပါတယ်။

<a id="ERR_STREAM_NULL_VALUES"></a>

### `ERR_STREAM_NULL_VALUES`

`null` chunk တစ်ခုနဲ့ [`stream.write()`][] ကို ခေါ်ယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_STREAM_PREMATURE_CLOSE"></a>

### `ERR_STREAM_PREMATURE_CLOSE`

stream တစ်ခု ဒါမှမဟုတ် pipeline တစ်ခုက ရှင်းလင်းတဲ့ error တစ်ခုမှ မရှိဘဲ ပုံမှန် မဟုတ်တဲ့ပုံစံနဲ့ အဆုံးသတ်သွားတဲ့အခါ `stream.finished()` နဲ့ `stream.pipeline()` က ပြန်ပေးတဲ့ error ပါ။

<a id="ERR_STREAM_PUSH_AFTER_EOF"></a>

### `ERR_STREAM_PUSH_AFTER_EOF`

stream ဆီကို `null`(EOF) တစ်ခု push လုပ်ပြီးသား ဖြစ်ချိန်မှာ [`stream.push()`][] ကို ခေါ်ယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_STREAM_UNABLE_TO_PIPE"></a>

### `ERR_STREAM_UNABLE_TO_PIPE`

pipeline တစ်ခုထဲမှာ ပိတ်ထားတဲ့ ဒါမှမဟုတ် ဖျက်ဆီးထားတဲ့ stream တစ်ခုဆီကို pipe လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_STREAM_UNSHIFT_AFTER_END_EVENT"></a>

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT`

`'end'` event ကို emit လုပ်ပြီးသား ဖြစ်ချိန်မှာ [`stream.unshift()`][] ကို ခေါ်ယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_STREAM_WRAP"></a>

### `ERR_STREAM_WRAP`

Socket ပေါ်မှာ string decoder တစ်ခု သတ်မှတ်ထားရင် ဒါမှမဟုတ် decoder က `objectMode` ထဲမှာ ရှိနေရင် abort တစ်ခု ဖြစ်ပေါ်မလာအောင် တားဆီးပေးပါတယ်။

```js
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```

<a id="ERR_STREAM_WRITE_AFTER_END"></a>

### `ERR_STREAM_WRITE_AFTER_END`

`stream.end()` ကို ခေါ်ယူပြီးသား ဖြစ်ချိန်မှာ [`stream.write()`][] ကို ခေါ်ယူဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_STRING_TOO_LONG"></a>

### `ERR_STRING_TOO_LONG`

ခွင့်ပြုထားတဲ့ အမြင့်ဆုံး အလျားထက် ပိုရှည်တဲ့ string တစ်ခုကို ဖန်တီးဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_SYNTHETIC"></a>

### `ERR_SYNTHETIC`

diagnostic reports တွေအတွက် call stack ကို ဖမ်းယူဖို့ သုံးတဲ့ artificial (အတုအယောင်) error object တစ်ခုပါ။

<a id="ERR_SYSTEM_ERROR"></a>

### `ERR_SYSTEM_ERROR`

Node.js process ထဲမှာ အတိအကျ မသတ်မှတ်နိုင်တဲ့ ဒါမှမဟုတ် ယေဘုယျသဘော system error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။ error object မှာ အပိုအသေးစိတ် အချက်အလက်တွေ ပါဝင်တဲ့ `err.info` object property တစ်ခု ပါလိမ့်မယ်။

<a id="ERR_TEST_FAILURE"></a>

### `ERR_TEST_FAILURE`

ဒီ error က မအောင်မြင်ခဲ့တဲ့ test တစ်ခုကို ကိုယ်စားပြုပါတယ်။ ကျရှုံးမှုနဲ့ ပတ်သက်တဲ့ အပိုအချက်အလက်တွေကို `cause` property ကနေတစ်ဆင့် ရယူနိုင်ပါတယ်။ `failureType` property က ကျရှုံးမှု ဖြစ်ပွားချိန်မှာ test က ဘာလုပ်နေခဲ့လဲဆိုတာကို သတ်မှတ်ဖော်ပြပါတယ်။

<a id="ERR_TLS_ALPN_CALLBACK_INVALID_RESULT"></a>

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT`

`ALPNCallback` တစ်ခုက client က ကမ်းလှမ်းထားတဲ့ ALPN protocols စာရင်းထဲမှာ မပါတဲ့ တန်ဖိုးတစ်ခုကို ပြန်ပေးတဲ့အခါ ဒီ error ကို throw လုပ်ပါတယ်။

<a id="ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS"></a>

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS`

TLS options တွေထဲမှာ `ALPNProtocols` နဲ့ `ALPNCallback` နှစ်ခုလုံး ပါဝင်နေရင် `TLSServer` တစ်ခုကို ဖန်တီးတဲ့အခါ ဒီ error ကို throw လုပ်ပါတယ်။ ဒီ options နှစ်ခုက တစ်ခုနဲ့တစ်ခု သီးသန့် (mutually exclusive) ဖြစ်ပါတယ်။

<a id="ERR_TLS_CERT_ALTNAME_FORMAT"></a>

### `ERR_TLS_CERT_ALTNAME_FORMAT`

ဒီ error ကို `checkServerIdentity` က throw လုပ်တာပါ — user က ပေးလိုက်တဲ့ `subjectaltname` property တစ်ခုက encoding rules တွေကို ချိုးဖောက်နေတဲ့အခါ ဖြစ်ပါတယ်။ Node.js ကိုယ်တိုင် ထုတ်လုပ်တဲ့ Certificate objects တွေက encoding rules တွေနဲ့ အမြဲ ကိုက်ညီပြီး — ဒီ error ကို ဘယ်တော့မှ ဖြစ်စေမှာ မဟုတ်ပါဘူး။

<a id="ERR_TLS_CERT_ALTNAME_INVALID"></a>

### `ERR_TLS_CERT_ALTNAME_INVALID`

TLS ကို သုံးနေစဉ် — peer ရဲ့ host name/IP က ၎င်းရဲ့ certificate ထဲက `subjectAltNames` တစ်ခုခုနဲ့မှ မကိုက်ညီခဲ့ပါဘူး။

<a id="ERR_TLS_DH_PARAM_SIZE"></a>

### `ERR_TLS_DH_PARAM_SIZE`

TLS ကို သုံးနေစဉ် — Diffie-Hellman (`DH`) key-agreement protocol အတွက် ကမ်းလှမ်းလိုက်တဲ့ parameter က သေးလွန်းပါတယ်။ ပုံမှန်အားဖြင့် key length က vulnerabilities (အားနည်းချက်များ) တွေ ရှောင်ရှားနိုင်ဖို့ 1024 bits ထက် ကြီးရန် သို့မဟုတ် ညီရန် လိုအပ်ပါတယ် — ဒါပေမယ့် ပိုမို ခိုင်မာတဲ့ လုံခြုံရေးအတွက် 2048 bits ဒါမှမဟုတ် အဲဒါထက် ပိုကြီးတာကို သုံးဖို့ အထူး အကြံပြုထားပါတယ်။

<a id="ERR_TLS_HANDSHAKE_TIMEOUT"></a>

### `ERR_TLS_HANDSHAKE_TIMEOUT`

TLS/SSL handshake တစ်ခု timeout ဖြစ်သွားပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ server က connection ကိုလည်း abort (ရပ်တန့်) လုပ်ရပါမယ်။

<a id="ERR_TLS_INVALID_CONTEXT"></a>

### `ERR_TLS_INVALID_CONTEXT`

context က `SecureContext` တစ်ခု ဖြစ်ရပါမယ်။

<a id="ERR_TLS_INVALID_PROTOCOL_METHOD"></a>

### `ERR_TLS_INVALID_PROTOCOL_METHOD`

သတ်မှတ်ထားတဲ့ `secureProtocol` method က invalid ပါ။ ၎င်းက မသိတဲ့ (unknown) method တစ်ခု ဖြစ်နေတာ ဒါမှမဟုတ် လုံခြုံမှု မရှိလို့ disable လုပ်ထားတာ ဖြစ်ပါတယ်။

<a id="ERR_TLS_INVALID_PROTOCOL_VERSION"></a>

### `ERR_TLS_INVALID_PROTOCOL_VERSION`

တရားဝင် (valid) TLS protocol versions တွေက `'TLSv1'`, `'TLSv1.1'`, ဒါမှမဟုတ် `'TLSv1.2'` တွေ ဖြစ်ပါတယ်။

<a id="ERR_TLS_INVALID_STATE"></a>

### `ERR_TLS_INVALID_STATE`

TLS socket က connect လုပ်ပြီး လုံခြုံစွာ တည်ဆောက်ပြီးသား (securely established) ဖြစ်ရပါမယ်။ ဆက်လုပ်ခြင်းမပြုခင် 'secure' event ကို emit လုပ်ပြီးကြောင်း သေချာပါစေ။

<a id="ERR_TLS_PROTOCOL_VERSION_CONFLICT"></a>

### `ERR_TLS_PROTOCOL_VERSION_CONFLICT`

TLS protocol ရဲ့ `minVersion` ဒါမှမဟုတ် `maxVersion` တစ်ခုကို သတ်မှတ်ဖို့ ကြိုးစားတာက `secureProtocol` ကို ရှင်းလင်းစွာ သတ်မှတ်ဖို့ ကြိုးစားတာနဲ့ ဆန့်ကျင်နေပါတယ်။ ယန္တရား တစ်ခုခုကိုသာ သုံးပါ။

<a id="ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED"></a>

### `ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED`

PSK identity hint ကို သတ်မှတ်ရာမှာ မအောင်မြင်ခဲ့ပါဘူး။ Hint က ရှည်လွန်းနေနိုင်ပါတယ်။

<a id="ERR_TLS_RENEGOTIATION_DISABLED"></a>

### `ERR_TLS_RENEGOTIATION_DISABLED`

renegotiation ကို disable လုပ်ထားတဲ့ socket instance တစ်ခုပေါ်မှာ TLS ကို renegotiate လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_TLS_RENEGOTIATION_UNSUPPORTED"></a>

### `ERR_TLS_RENEGOTIATION_UNSUPPORTED`

TLS ကို renegotiate လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပေမယ့် TLS implementation က caller-initiated renegotiation ကို support မလုပ်ပါဘူး။

<a id="ERR_TLS_REQUIRED_SERVER_NAME"></a>

### `ERR_TLS_REQUIRED_SERVER_NAME`

TLS ကို သုံးနေစဉ် — `server.addContext()` method ကို ပထမ parameter ထဲမှာ host name တစ်ခု မပေးဘဲ ခေါ်ယူခဲ့ပါတယ်။

<a id="ERR_TLS_SESSION_ATTACK"></a>

### `ERR_TLS_SESSION_ATTACK`

TLS renegotiations တွေ အလွန်အကျွံ ဖြစ်ပေါ်နေတာကို တွေ့ရှိရပါတယ် — ဒါက denial-of-service attacks (ဝန်ဆောင်မှု ငြင်းပယ်ခြင်း တိုက်ခိုက်မှုများ) အတွက် အလားအလာရှိတဲ့ လမ်းကြောင်း (vector) တစ်ခု ဖြစ်ပါတယ်။

<a id="ERR_TLS_SNI_FROM_SERVER"></a>

### `ERR_TLS_SNI_FROM_SERVER`

client တစ်ခုကနေသာ တရားဝင်တဲ့ Server Name Indication တစ်ခုကို TLS server-side socket တစ်ခုကနေ ထုတ်ပြန်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_TRACE_EVENTS_CATEGORY_REQUIRED"></a>

### `ERR_TRACE_EVENTS_CATEGORY_REQUIRED`

`trace_events.createTracing()` method က trace event category အနည်းဆုံး တစ်ခု လိုအပ်ပါတယ်။

<a id="ERR_TRACE_EVENTS_UNAVAILABLE"></a>

### `ERR_TRACE_EVENTS_UNAVAILABLE`

Node.js ကို `--without-v8-platform` flag နဲ့ compile လုပ်ထားတာကြောင့် `node:trace_events` module ကို load လုပ်လို့ မရခဲ့ပါဘူး။

<a id="ERR_TRAILING_JUNK_AFTER_STREAM_END"></a>

### `ERR_TRAILING_JUNK_AFTER_STREAM_END`

compressed stream ရဲ့ အဆုံးနောက်မှာ နောက်ဆက်တွဲ အပို data (trailing junk) တွေ တွေ့ရှိခဲ့ပါတယ်။ compressed stream တစ်ခုရဲ့ အဆုံးပြီးနောက်မှာ မမျှော်လင့်ထားတဲ့ အပို data တွေကို တွေ့ရှိရင် (ဥပမာ — zlib ဒါမှမဟုတ် gzip decompression တွေမှာ) ဒီ error ကို throw လုပ်ပါတယ်။

<a id="ERR_TRANSFORM_ALREADY_TRANSFORMING"></a>

### `ERR_TRANSFORM_ALREADY_TRANSFORMING`

`Transform` stream တစ်ခုက transforming လုပ်နေဆဲ အချိန်မှာ finished (ပြီးဆုံး) သွားခဲ့ပါတယ်။

<a id="ERR_TRANSFORM_WITH_LENGTH_0"></a>

### `ERR_TRANSFORM_WITH_LENGTH_0`

`Transform` stream တစ်ခုက write buffer ထဲမှာ data တွေ ကျန်ရှိနေဆဲ အချိန်မှာ finished ဖြစ်သွားခဲ့ပါတယ်။

<a id="ERR_TTY_INIT_FAILED"></a>

### `ERR_TTY_INIT_FAILED`

TTY တစ်ခုရဲ့ initialization က system error တစ်ခုကြောင့် မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_UNAVAILABLE_DURING_EXIT"></a>

### `ERR_UNAVAILABLE_DURING_EXIT`

[`process.on('exit')`][] handler တစ်ခုထဲမှာ — [`process.on('exit')`][] handler တစ်ခုထဲမှာ မခေါ်ယူသင့်တဲ့ function တစ်ခုကို ခေါ်ယူခဲ့ပါတယ်။

<a id="ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET"></a>

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET`

[`process.setUncaughtExceptionCaptureCallback()`][] ကို callback ကို အရင် `null` အဖြစ် ပြန်သတ်မှတ်မပေးဘဲ နှစ်ကြိမ် ခေါ်ယူခဲ့ပါတယ်။

ဒီ error က တခြား module တစ်ခုကနေ မှတ်ပုံတင်ထားတဲ့ callback တစ်ခုကို မတော်တဆ ထပ်ရေးမိ (overwriting) မဖြစ်အောင် ကာကွယ်ဖို့ ဒီဇိုင်းထုတ်ထားတာပါ။

<a id="ERR_UNESCAPED_CHARACTERS"></a>

### `ERR_UNESCAPED_CHARACTERS`

escape မလုပ်ရသေးတဲ့ (unescaped) character တွေ ပါဝင်တဲ့ string တစ်ခုကို လက်ခံရရှိခဲ့ပါတယ်။

<a id="ERR_UNHANDLED_ERROR"></a>

### `ERR_UNHANDLED_ERROR`

ကိုင်တွယ်မှု မရှိတဲ့ (unhandled) error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ် (ဥပမာ — [`EventEmitter`][] တစ်ခုက `'error'` event တစ်ခုကို emit လုပ်ပေမယ့် `'error'` handler တစ်ခုကို မှတ်ပုံတင်မထားတဲ့အခါမျိုး)။

<a id="ERR_UNKNOWN_BUILTIN_MODULE"></a>

### `ERR_UNKNOWN_BUILTIN_MODULE`

ပုံမှန်အားဖြင့် user code တွေကြောင့် trigger မလုပ်သင့်တဲ့ internal Node.js error အမျိုးအစား တစ်ခုကို ခွဲခြားသတ်မှတ်ဖို့ သုံးပါတယ်။ ဒီ error ရဲ့ instances တွေက Node.js binary ကိုယ်တိုင်ထဲမှာရှိတဲ့ internal bug တစ်ခုကို ညွှန်ပြပါတယ်။

<a id="ERR_UNKNOWN_CREDENTIAL"></a>

### `ERR_UNKNOWN_CREDENTIAL`

မရှိတဲ့ Unix group ဒါမှမဟုတ် user identifier တစ်ခုကို ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_UNKNOWN_ENCODING"></a>

### `ERR_UNKNOWN_ENCODING`

API တစ်ခုဆီကို invalid ဒါမှမဟုတ် မသိတဲ့ encoding option တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_UNKNOWN_FILE_EXTENSION"></a>

### `ERR_UNKNOWN_FILE_EXTENSION`

မသိတဲ့ ဒါမှမဟုတ် support မလုပ်တဲ့ file extension တစ်ခုပါတဲ့ module တစ်ခုကို load လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_UNKNOWN_MODULE_FORMAT"></a>

### `ERR_UNKNOWN_MODULE_FORMAT`

မသိတဲ့ ဒါမှမဟုတ် support မလုပ်တဲ့ format တစ်ခုနဲ့ module တစ်ခုကို load လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_UNKNOWN_SIGNAL"></a>

### `ERR_UNKNOWN_SIGNAL`

တရားဝင် signal တစ်ခုကို မျှော်လင့်တဲ့ API တစ်ခုဆီကို ([`subprocess.kill()`][] လိုမျိုး) invalid ဒါမှမဟုတ် မသိတဲ့ process signal တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_UNSUPPORTED_DIR_IMPORT"></a>

### `ERR_UNSUPPORTED_DIR_IMPORT`

directory URL တစ်ခုကို `import` လုပ်တာက support မလုပ်ပါဘူး။ အဲဒီအစား — [`package.json`][] file ရဲ့ [`"exports"`][] field ထဲမှာ [self-reference a package using its name][] ကို သုံးပြီး [define a custom subpath][] တစ်ခုကို သတ်မှတ်ပါ။

```mjs
import './'; // unsupported
import './index.js'; // supported
import 'package-name'; // supported
```

<a id="ERR_UNSUPPORTED_ESM_URL_SCHEME"></a>

### `ERR_UNSUPPORTED_ESM_URL_SCHEME`

`file` နဲ့ `data` ကလွဲလို့ တခြား URL schemes တွေနဲ့ `import` လုပ်တာက support မလုပ်ပါဘူး။

<a id="ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING"></a>

### `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`

`node_modules` directory တစ်ခုရဲ့ အောက်ဆင်းသက်လာတဲ့ (descendant) files တွေအတွက် type stripping ကို support မလုပ်ပါဘူး။

<a id="ERR_UNSUPPORTED_RESOLVE_REQUEST"></a>

### `ERR_UNSUPPORTED_RESOLVE_REQUEST`

invalid ဖြစ်တဲ့ module referrer တစ်ခုကို resolve လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ အောက်ပါတို့နဲ့ import လုပ်တဲ့အခါ ဒါမှမဟုတ် `import.meta.resolve()` ကို ခေါ်ယူတဲ့အခါ ဖြစ်ပွားနိုင်ပါတယ်:

* URL scheme က `file` မဟုတ်တဲ့ module တစ်ခုကနေ builtin module မဟုတ်တဲ့ bare specifier တစ်ခုကို သုံးတာ။
* URL scheme က [special scheme][] မဟုတ်တဲ့ module တစ်ခုကနေ [relative URL][] တစ်ခုကို သုံးတာ။

```mjs
try {
  // Trying to import the package 'bare-specifier' from a `data:` URL module:
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```

<a id="ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX"></a>

### `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`

ပေးထားတဲ့ TypeScript syntax က support မလုပ်ပါဘူး။ [type-stripping][] နဲ့ transformation လိုအပ်တဲ့ TypeScript syntax ကို သုံးတဲ့အခါ ဒါ ဖြစ်ပွားနိုင်ပါတယ်။

<a id="ERR_USE_AFTER_CLOSE"></a>

### `ERR_USE_AFTER_CLOSE`

ပိတ်ပြီးသား အရာတစ်ခုကို အသုံးပြုဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။

<a id="ERR_VALID_PERFORMANCE_ENTRY_TYPE"></a>

### `ERR_VALID_PERFORMANCE_ENTRY_TYPE`

Performance Timing API (`perf_hooks`) ကို သုံးနေစဉ် — valid ဖြစ်တဲ့ performance entry types တွေ ဘာမှ ရှာမတွေ့ပါဘူး။

<a id="ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING"></a>

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`

dynamic import callback တစ်ခုကို သတ်မှတ်မပေးခဲ့ပါဘူး။

<a id="ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG"></a>

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`

`--experimental-vm-modules` မပါဘဲ dynamic import callback တစ်ခုကို invoke လုပ်ခဲ့ပါတယ်။

<a id="ERR_VM_MODULE_ALREADY_LINKED"></a>

### `ERR_VM_MODULE_ALREADY_LINKED`

link လုပ်ဖို့ ကြိုးစားလိုက်တဲ့ module က အောက်ပါ အကြောင်းရင်းတွေထဲက တစ်ခုကြောင့် link လုပ်ဖို့ မထိုက်တန်ပါဘူး:

* link လုပ်ပြီးသား ဖြစ်နေပါတယ် (`linkingStatus` က `'linked'` ဖြစ်နေ)
* link လုပ်နေဆဲ ဖြစ်ပါတယ် (`linkingStatus` က `'linking'` ဖြစ်နေ)
* ဒီ module အတွက် link လုပ်မှု မအောင်မြင်ခဲ့ပါဘူး (`linkingStatus` က `'errored'` ဖြစ်နေ)

<a id="ERR_VM_MODULE_CACHED_DATA_REJECTED"></a>

### `ERR_VM_MODULE_CACHED_DATA_REJECTED`

module constructor တစ်ခုဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ `cachedData` option က invalid ပါ။

<a id="ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA"></a>

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA`

evaluate လုပ်ပြီးသား modules တွေအတွက် cached data တွေကို ဖန်တီးလို့ မရပါဘူး။

<a id="ERR_VM_MODULE_DIFFERENT_CONTEXT"></a>

### `ERR_VM_MODULE_DIFFERENT_CONTEXT`

linker function ကနေ ပြန်ပေးလိုက်တဲ့ module က parent module နဲ့ မတူညီတဲ့ context တစ်ခုကနေ လာပါတယ်။ Link လုပ်ထားတဲ့ modules တွေက context တစ်ခုတည်းကို မျှဝေရပါမယ်။

<a id="ERR_VM_MODULE_LINK_FAILURE"></a>

### `ERR_VM_MODULE_LINK_FAILURE`

module ကို ကျရှုံးမှု တစ်ခုကြောင့် link လုပ်လို့ မရခဲ့ပါဘူး။

<a id="ERR_VM_MODULE_NOT_MODULE"></a>

### `ERR_VM_MODULE_NOT_MODULE`

linking promise တစ်ခုရဲ့ fulfilled value (ပြည့်စုံလာတဲ့ တန်ဖိုး) က `vm.Module` object တစ်ခု မဟုတ်ပါဘူး။

<a id="ERR_VM_MODULE_STATUS"></a>

### `ERR_VM_MODULE_STATUS`

လက်ရှိ module ရဲ့ status က ဒီ operation ကို ခွင့်မပြုပါဘူး။ ဒီ error ရဲ့ တိကျတဲ့ အဓိပ္ပာယ်က function တစ်ခုချင်းစီအပေါ် မူတည်ပါတယ်။

<a id="ERR_WASI_ALREADY_STARTED"></a>

### `ERR_WASI_ALREADY_STARTED`

WASI instance က စတင်ပြီးသား ဖြစ်ပါတယ်။

<a id="ERR_WASI_NOT_STARTED"></a>

### `ERR_WASI_NOT_STARTED`

WASI instance ကို မစတင်ရသေးပါဘူး။

<a id="ERR_WEBASSEMBLY_NOT_SUPPORTED"></a>

### `ERR_WEBASSEMBLY_NOT_SUPPORTED`

WebAssembly လိုအပ်တဲ့ feature တစ်ခုကို အသုံးပြုခဲ့ပေမယ့် WebAssembly က support မလုပ်တာ ဒါမှမဟုတ် လက်ရှိ environment ထဲမှာ disable လုပ်ထားပါတယ် (ဥပမာ — `--jitless` နဲ့ run လုပ်နေချိန်မျိုး)။

<a id="ERR_WEBASSEMBLY_RESPONSE"></a>

### `ERR_WEBASSEMBLY_RESPONSE`

`WebAssembly.compileStreaming` ဒါမှမဟုတ် `WebAssembly.instantiateStreaming` ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ `Response` က valid ဖြစ်တဲ့ WebAssembly response တစ်ခု မဟုတ်ပါဘူး။

<a id="ERR_WORKER_HANDLE_NOT_TRANSFERABLE"></a>

### `ERR_WORKER_HANDLE_NOT_TRANSFERABLE`

`net.Socket` ဒါမှမဟုတ် `net.Server` တစ်ခုကို transferable state ထဲမှာ မရှိဘဲ `worker_threads` ရဲ့ `postMessage()` ခေါ်ယူမှုကနေတစ်ဆင့် တခြား thread တစ်ခုဆီကို transfer လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ် — ဥပမာ ၎င်းက reading စတင်နေပြီးသား ဖြစ်တာ ဒါမှမဟုတ် data တွေ buffer လုပ်ထားပြီးသား ဖြစ်တာကြောင့်မျိုး ဖြစ်နိုင်ပါတယ်။

<a id="ERR_WORKER_INIT_FAILED"></a>

### `ERR_WORKER_INIT_FAILED`

`Worker` ရဲ့ initialization မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_WORKER_INVALID_EXEC_ARGV"></a>

### `ERR_WORKER_INVALID_EXEC_ARGV`

`Worker` constructor ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ `execArgv` option ထဲမှာ invalid flags တွေ ပါဝင်နေပါတယ်။

<a id="ERR_WORKER_MESSAGING_ERRORED"></a>

### `ERR_WORKER_MESSAGING_ERRORED`

> Stability: 1.1 - Active development

[`postMessageToThread()`][] ကနေ ပို့လိုက်တဲ့ message တစ်ခုကို လုပ်ဆောင်နေစဉ်မှာ destination thread က error တစ်ခု throw လုပ်ခဲ့ပါတယ်။

<a id="ERR_WORKER_MESSAGING_FAILED"></a>

### `ERR_WORKER_MESSAGING_FAILED`

> Stability: 1.1 - Active development

[`postMessageToThread()`][] မှာ တောင်းဆိုထားတဲ့ thread က invalid ဖြစ်တာ ဒါမှမဟုတ် `workerMessage` listener တစ်ခု မရှိပါဘူး။

<a id="ERR_WORKER_MESSAGING_SAME_THREAD"></a>

### `ERR_WORKER_MESSAGING_SAME_THREAD`

> Stability: 1.1 - Active development

[`postMessageToThread()`][] မှာ တောင်းဆိုထားတဲ့ thread id က လက်ရှိ thread ရဲ့ id ကိုယ်တိုင် ဖြစ်နေပါတယ်။

<a id="ERR_WORKER_MESSAGING_TIMEOUT"></a>

### `ERR_WORKER_MESSAGING_TIMEOUT`

> Stability: 1.1 - Active development

[`postMessageToThread()`][] ကနေတစ်ဆင့် message တစ်ခု ပို့ခြင်းက timeout ဖြစ်သွားပါတယ်။

<a id="ERR_WORKER_NOT_RUNNING"></a>

### `ERR_WORKER_NOT_RUNNING`

`Worker` instance က လက်ရှိ run မနေတာကြောင့် operation တစ်ခု မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_WORKER_OUT_OF_MEMORY"></a>

### `ERR_WORKER_OUT_OF_MEMORY`

`Worker` instance က ၎င်းရဲ့ memory limit ကို ရောက်ရှိသွားလို့ အဆုံးသတ်ခံခဲ့ရပါတယ်။

<a id="ERR_WORKER_PATH"></a>

### `ERR_WORKER_PATH`

worker တစ်ခုရဲ့ main script အတွက် path က absolute path တစ်ခု မဟုတ်သလို `./` ဒါမှမဟုတ် `../` နဲ့ စတင်တဲ့ relative path တစ်ခုလည်း မဟုတ်ပါဘူး။

<a id="ERR_WORKER_UNSERIALIZABLE_ERROR"></a>

### `ERR_WORKER_UNSERIALIZABLE_ERROR`

worker thread တစ်ခုကနေ uncaught exception တစ်ခုကို serialize လုပ်ဖို့ ကြိုးစားမှု အားလုံး မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_WORKER_UNSUPPORTED_OPERATION"></a>

### `ERR_WORKER_UNSUPPORTED_OPERATION`

တောင်းဆိုထားတဲ့ လုပ်ဆောင်ချက် (functionality) ကို worker threads တွေထဲမှာ support မလုပ်ပါဘူး။

<a id="ERR_ZIP_ARCHIVE_TOO_LARGE"></a>

### `ERR_ZIP_ARCHIVE_TOO_LARGE`

archive-level structure တစ်ခုက ကန့်သတ်ချက်တစ်ခုကို ကျော်လွန်နေပါတယ်: archive comment က ZIP format က ခွင့်ပြုတဲ့ 65,535-byte encoded အလျားကို ကျော်လွန်နေတာ ဒါမှမဟုတ် archive ရဲ့ central directory က memory ထဲမှာ buffer လုပ်ဖို့ ကြီးလွန်းနေပါတယ်။

<a id="ERR_ZIP_ENTRY_CORRUPT"></a>

### `ERR_ZIP_ENTRY_CORRUPT`

ZIP archive entry တစ်ခုက ဖတ်နေစဉ်အတွင်း CRC-32 verification မအောင်မြင်တာ ဒါမှမဟုတ် ၎င်းရဲ့ ကြေညာထားတဲ့ uncompressed size ထက် bytes အရေအတွက် ပိုများ ဒါမှမဟုတ် ပိုနည်း ထွက်လာခဲ့ပါတယ်။

<a id="ERR_ZIP_ENTRY_NOT_FOUND"></a>

### `ERR_ZIP_ENTRY_NOT_FOUND`

အဲဒီနာမည်နဲ့ entry တစ်ခု မပါဝင်တဲ့ [`ZipFile`][] ဒါမှမဟုတ် [`ZipBuffer`][] တစ်ခုကနေ နာမည်ပေးထားတဲ့ entry တစ်ခုကို တောင်းဆိုခဲ့ပါတယ်။

<a id="ERR_ZIP_ENTRY_TOO_LARGE"></a>

### `ERR_ZIP_ENTRY_TOO_LARGE`

ZIP archive entry တစ်ခုရဲ့ ကြေညာထားတဲ့ size က configure လုပ်ထားတဲ့ ကန့်သတ်ချက်ကို ကျော်လွန်နေတာ ဒါမှမဟုတ် ပေးအပ်ထားတဲ့ entry name ဒါမှမဟုတ် comment က ZIP format က ခွင့်ပြုတဲ့ 65,535-byte encoded အလျားကို ကျော်လွန်နေပါတယ်။

<a id="ERR_ZIP_INVALID_ARCHIVE"></a>

### `ERR_ZIP_INVALID_ARCHIVE`

ZIP archive တစ်ခု ဒါမှမဟုတ် ၎င်းထဲက structure တစ်ခု ဖြစ်ဖို့ မျှော်လင့်ထားတဲ့ data က ပျောက်နေတာ၊ နယ်နိမိတ် (bounds) ပြင်ပ ရောက်နေတာ ဒါမှမဟုတ် ZIP format နဲ့ တစ်နည်းနည်းနဲ့ မကိုက်ညီတာ ဖြစ်ပါတယ်။

<a id="ERR_ZIP_NOT_WRITABLE"></a>

### `ERR_ZIP_NOT_WRITABLE`

`{ writable: true }` နဲ့ မဖွင့်ထားတဲ့ [`ZipFile`][] တစ်ခုပေါ်မှာ mutating method တစ်ခုကို (ဥပမာ `zipFile.addEntry()` ဒါမှမဟုတ် `zipFile.delete()`) ခေါ်ယူခဲ့ပါတယ်။

<a id="ERR_ZIP_UNSUPPORTED_FEATURE"></a>

### `ERR_ZIP_UNSUPPORTED_FEATURE`

ZIP archive တစ်ခုက ဒီ implementation က support လုပ်တာထက် ကျော်လွန်တဲ့ feature တစ်ခုကို သုံးနေပါတယ် — ဥပမာ entry encryption၊ support မလုပ်တဲ့ compression method တစ်ခု၊ ဒါမှမဟုတ် multi-disk archive တစ်ခုမျိုး။

<a id="ERR_ZLIB_INITIALIZATION_FAILED"></a>

### `ERR_ZLIB_INITIALIZATION_FAILED`

မှားယွင်းတဲ့ configuration တစ်ခုကြောင့် [`zlib`][] object တစ်ခုကို ဖန်တီးရာမှာ မအောင်မြင်ခဲ့ပါဘူး။

<a id="ERR_ZSTD_INVALID_PARAM"></a>

### `ERR_ZSTD_INVALID_PARAM`

Zstd stream တစ်ခုကို တည်ဆောက်နေစဉ်အတွင်း invalid ဖြစ်တဲ့ parameter key တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="HPE_CHUNK_EXTENSIONS_OVERFLOW"></a>

### `HPE_CHUNK_EXTENSIONS_OVERFLOW`

chunk extensions တစ်ခုအတွက် data တွေ အလွန်အကျွံ လက်ခံရရှိခဲ့ပါတယ်။ အန္တရာယ်ရှိတဲ့ (malicious) ဒါမှမဟုတ် မှားယွင်းစွာ configure လုပ်ထားတဲ့ clients တွေကနေ ကာကွယ်ဖို့ — data 16 KiB ထက်ပိုပြီး လက်ခံရရှိရင် ဒီ code ပါတဲ့ `Error` တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။

<a id="HPE_HEADER_OVERFLOW"></a>

### `HPE_HEADER_OVERFLOW`

HTTP header data တွေ အလွန်အကျွံ လက်ခံရရှိခဲ့ပါတယ်။ အန္တရာယ်ရှိတဲ့ ဒါမှမဟုတ် မှားယွင်းစွာ configure လုပ်ထားတဲ့ clients တွေကနေ ကာကွယ်ဖို့ — HTTP header data `maxHeaderSize` ထက်ပိုပြီး လက်ခံရရှိရင် request ဒါမှမဟုတ် response object တစ်ခုကို ဖန်တီးခြင်း မရှိဘဲ HTTP parsing က abort ဖြစ်ပြီး ဒီ code ပါတဲ့ `Error` တစ်ခုကို emit လုပ်ပါလိမ့်မယ်။

<a id="HPE_UNEXPECTED_CONTENT_LENGTH"></a>

### `HPE_UNEXPECTED_CONTENT_LENGTH`

Server က `Content-Length` header တစ်ခုနဲ့ `Transfer-Encoding: chunked` နှစ်ခုလုံးကို ပို့နေပါတယ်။

`Transfer-Encoding: chunked` က server ကို dynamically ထုတ်လုပ်ထားတဲ့ content တွေအတွက် HTTP persistent connection တစ်ခုကို ထိန်းသိမ်းနိုင်စေပါတယ်။ ဒီလိုအခြေအနေမျိုးမှာ `Content-Length` HTTP header ကို သုံးလို့ မရပါဘူး။

`Content-Length` ဒါမှမဟုတ် `Transfer-Encoding: chunked` တစ်ခုခုကိုသာ သုံးပါ။

<a id="MODULE_NOT_FOUND"></a>

### `MODULE_NOT_FOUND`

[`require()`][] operation တစ်ခုကို ကြိုးစားတဲ့အခါ ဒါမှမဟုတ် program ရဲ့ entry point ကို load လုပ်တဲ့အခါ CommonJS modules loader က module file တစ်ခုကို resolve လုပ်လို့ မရခဲ့ပါဘူး။

## မျိုးဆက်ဟောင်း (Legacy) Node.js error codes များ

> Stability: 0 - Deprecated. These error codes are either inconsistent, or have
> been removed.

<a id="ERR_CANNOT_TRANSFER_OBJECT"></a>

### `ERR_CANNOT_TRANSFER_OBJECT`

`postMessage()` ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ တန်ဖိုးထဲမှာ transfer လုပ်ဖို့ support မလုပ်တဲ့ object တစ်ခု ပါဝင်နေပါတယ်။

<a id="ERR_CPU_USAGE"></a>

### `ERR_CPU_USAGE`

`process.cpuUsage` ကနေ ခေါ်ယူတဲ့ native call တစ်ခုကို လုပ်ဆောင်လို့ မရခဲ့ပါဘူး။

<a id="ERR_CRYPTO_HASH_DIGEST_NO_UTF16"></a>

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16`

UTF-16 encoding ကို [`hash.digest()`][] နဲ့ အတူ အသုံးပြုခဲ့ပါတယ်။ `hash.digest()` method က `encoding` argument တစ်ခုကို ဖြတ်သန်းပေးတာကို ခွင့်ပြုပြီး — method က `Buffer` တစ်ခုအစား string တစ်ခုကို ပြန်ပေးစေပေမယ့် UTF-16 encoding (ဥပမာ `ucs` ဒါမှမဟုတ် `utf16le`) ကိုတော့ support မလုပ်ပါဘူး။

<a id="ERR_CRYPTO_SCRYPT_INVALID_PARAMETER"></a>

### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER`

[`crypto.scrypt()`][] ဒါမှမဟုတ် [`crypto.scryptSync()`][] ဆီကို ကိုက်ညီမှု မရှိတဲ့ options ပေါင်းစပ်မှု တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။ Node.js ရဲ့ ဗားရှင်းအသစ်တွေက တခြား APIs တွေနဲ့ ညီညွတ်မှု ရှိစေဖို့ [`ERR_INCOMPATIBLE_OPTION_PAIR`][] error code ကို အစားထိုး သုံးပါတယ်။

<a id="ERR_FS_INVALID_SYMLINK_TYPE"></a>

### `ERR_FS_INVALID_SYMLINK_TYPE`

[`fs.symlink()`][] ဒါမှမဟုတ် [`fs.symlinkSync()`][] methods တွေဆီကို invalid symlink type တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_HTTP2_FRAME_ERROR"></a>

### `ERR_HTTP2_FRAME_ERROR`

HTTP/2 session တစ်ခုပေါ်မှာ frame တစ်ခုချင်းစီကို ပို့တဲ့အခါ ကျရှုံးမှု တစ်ခု ဖြစ်ပွားတဲ့အခါ သုံးပါတယ်။

<a id="ERR_HTTP2_HEADERS_OBJECT"></a>

### `ERR_HTTP2_HEADERS_OBJECT`

HTTP/2 Headers Object တစ်ခုကို မျှော်လင့်ထားတဲ့အခါ သုံးပါတယ်။

<a id="ERR_HTTP2_HEADER_REQUIRED"></a>

### `ERR_HTTP2_HEADER_REQUIRED`

HTTP/2 message တစ်ခုထဲမှာ လိုအပ်တဲ့ header တစ်ခု ပျောက်နေတဲ့အခါ သုံးပါတယ်။

<a id="ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND"></a>

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND`

HTTP/2 informational headers တွေကို `Http2Stream.prototype.respond()` method ကို ခေါ်ယူတာထက် _ရှေ့မှာ_ (prior) သာ ပို့ရပါတယ်။

<a id="ERR_HTTP2_STREAM_CLOSED"></a>

### `ERR_HTTP2_STREAM_CLOSED`

ပိတ်ပြီးသား HTTP/2 Stream တစ်ခုပေါ်မှာ လုပ်ဆောင်ချက် တစ်ခုကို လုပ်ဆောင်ခဲ့တဲ့အခါ သုံးပါတယ်။

<a id="ERR_HTTP_INVALID_CHAR"></a>

### `ERR_HTTP_INVALID_CHAR`

HTTP response status message (reason phrase) တစ်ခုထဲမှာ invalid character တစ်ခု တွေ့ရှိရတဲ့အခါ သုံးပါတယ်။

<a id="ERR_IMPORT_ASSERTION_TYPE_FAILED"></a>

### `ERR_IMPORT_ASSERTION_TYPE_FAILED`

import assertion တစ်ခု မအောင်မြင်ခဲ့လို့ သတ်မှတ်ထားတဲ့ module ကို import လုပ်လို့ မရအောင် တားဆီးခဲ့ပါတယ်။

<a id="ERR_IMPORT_ASSERTION_TYPE_MISSING"></a>

### `ERR_IMPORT_ASSERTION_TYPE_MISSING`

import assertion တစ်ခု ပျောက်နေလို့ သတ်မှတ်ထားတဲ့ module ကို import လုပ်လို့ မရအောင် တားဆီးခဲ့ပါတယ်။

<a id="ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED"></a>

### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED`

import attribute တစ်ခုကို ဒီ Node.js ဗားရှင်းက support မလုပ်ပါဘူး။

<a id="ERR_INDEX_OUT_OF_RANGE"></a>

### `ERR_INDEX_OUT_OF_RANGE`

ပေးထားတဲ့ index တစ်ခုက လက်ခံနိုင်တဲ့ အကွာအဝေး ပြင်ပ ဖြစ်နေပါတယ် (ဥပမာ — အနုတ် (negative) offsets တွေ)။

<a id="ERR_INVALID_OPT_VALUE"></a>

### `ERR_INVALID_OPT_VALUE`

options object တစ်ခုထဲမှာ invalid ဒါမှမဟုတ် မမျှော်လင့်ထားတဲ့ တန်ဖိုးတစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_INVALID_OPT_VALUE_ENCODING"></a>

### `ERR_INVALID_OPT_VALUE_ENCODING`

invalid ဒါမှမဟုတ် မသိတဲ့ file encoding တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_INVALID_PERFORMANCE_MARK"></a>

### `ERR_INVALID_PERFORMANCE_MARK`

Performance Timing API (`perf_hooks`) ကို သုံးနေစဉ် — performance mark တစ်ခု invalid ဖြစ်နေပါတယ်။

<a id="ERR_INVALID_TRANSFER_OBJECT"></a>

### `ERR_INVALID_TRANSFER_OBJECT`

`postMessage()` ဆီကို invalid transfer object တစ်ခု ဖြတ်သန်းပေးခဲ့ပါတယ်။

<a id="ERR_MANIFEST_ASSERT_INTEGRITY"></a>

### `ERR_MANIFEST_ASSERT_INTEGRITY`

resource တစ်ခုကို load လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပေမယ့် resource က policy manifest မှာ သတ်မှတ်ထားတဲ့ integrity နဲ့ မကိုက်ညီခဲ့ပါဘူး။ အသေးစိတ် အချက်အလက်တွေအတွက် policy manifests တွေရဲ့ documentation ကို ကြည့်ပါ။

<a id="ERR_MANIFEST_DEPENDENCY_MISSING"></a>

### `ERR_MANIFEST_DEPENDENCY_MISSING`

resource တစ်ခုကို load လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပေမယ့် resource က ၎င်းကို load လုပ်ဖို့ ကြိုးစားတဲ့ နေရာကနေ dependency အဖြစ် စာရင်းမသွင်းထားပါဘူး။ အသေးစိတ် အချက်အလက်တွေအတွက် policy manifests တွေရဲ့ documentation ကို ကြည့်ပါ။

<a id="ERR_MANIFEST_INTEGRITY_MISMATCH"></a>

### `ERR_MANIFEST_INTEGRITY_MISMATCH`

policy manifest တစ်ခုကို load လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပေမယ့် manifest ထဲမှာ resource တစ်ခုအတွက် တစ်ခုနဲ့တစ်ခု မကိုက်ညီတဲ့ entries အများအပြား ပါဝင်နေပါတယ်။ ဒီ error ကို ဖြေရှင်းဖို့ entries တွေကို တစ်ခုနဲ့တစ်ခု ကိုက်ညီအောင် update လုပ်ပါ။ အသေးစိတ် အချက်အလက်တွေအတွက် policy manifests တွေရဲ့ documentation ကို ကြည့်ပါ။

<a id="ERR_MANIFEST_INVALID_RESOURCE_FIELD"></a>

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD`

policy manifest resource တစ်ခုရဲ့ field တစ်ခုအတွက် တန်ဖိုးက invalid ဖြစ်နေပါတယ်။ ဒီ error ကို ဖြေရှင်းဖို့ manifest entry ကို ကိုက်ညီအောင် update လုပ်ပါ။ အသေးစိတ် အချက်အလက်တွေအတွက် policy manifests တွေရဲ့ documentation ကို ကြည့်ပါ။

<a id="ERR_MANIFEST_INVALID_SPECIFIER"></a>

### `ERR_MANIFEST_INVALID_SPECIFIER`

policy manifest resource တစ်ခုရဲ့ dependency mappings တွေထဲက တစ်ခုအတွက် တန်ဖိုးက invalid ဖြစ်နေပါတယ်။ ဒီ error ကို ဖြေရှင်းဖို့ manifest entry ကို ကိုက်ညီအောင် update လုပ်ပါ။ အသေးစိတ် အချက်အလက်တွေအတွက် policy manifests တွေရဲ့ documentation ကို ကြည့်ပါ။

<a id="ERR_MANIFEST_PARSE_POLICY"></a>


### `ERR_MANIFEST_PARSE_POLICY`

policy manifest တစ်ခုကို load လုပ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပေမယ့် manifest ကို parse လုပ်နိုင်ခြင်း မရှိခဲ့ပါဘူး။ အသေးစိတ် အချက်အလက်တွေအတွက် policy manifests တွေရဲ့ documentation ကို ကြည့်ပါ။

<a id="ERR_MANIFEST_TDZ"></a>

### `ERR_MANIFEST_TDZ`

policy manifest တစ်ခုကနေ ဖတ်ရှုဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပေမယ့် manifest ရဲ့ initialization (အစပြု စတင်ခြင်း) က မဖြစ်ပေါ်ရသေးပါဘူး။ ဒါက Node.js ထဲမှာ bug တစ်ခု ရှိနေတာ ဖြစ်နိုင်ခြေ များပါတယ်။

<a id="ERR_MANIFEST_UNKNOWN_ONERROR"></a>

### `ERR_MANIFEST_UNKNOWN_ONERROR`

policy manifest တစ်ခုကို load လုပ်ခဲ့ပေမယ့် ၎င်းရဲ့ "onerror" အပြုအမူ (behavior) အတွက် အသိအမှတ် မပြုနိုင်တဲ့ တန်ဖိုး တစ်ခု ပါဝင်နေပါတယ်။ အသေးစိတ် အချက်အလက်တွေအတွက် policy manifests တွေရဲ့ documentation ကို ကြည့်ပါ။

<a id="ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST"></a>

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`

ဒီ error code ကို Node.js 15.0.0 မှာ [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`][] နဲ့ အစားထိုးလိုက်ပါတယ် — အခုဆိုရင် တခြား transferable object အမျိုးအစားတွေလည်း ရှိနေတာမို့ ဒီ error code က မှန်ကန်မှု မရှိတော့လို့ပါ။

<a id="ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST"></a>

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`

`transferList` argument ထဲမှာ အတိအကျ စာရင်းသွင်းထားဖို့ လိုအပ်တဲ့ object တစ်ခုက — [`postMessage()`][] call တစ်ခုဆီ ဖြတ်သန်းပေးလိုက်တဲ့ object ထဲမှာ ပါဝင်နေပေမယ့် — အဲဒီ call အတွက် `transferList` ထဲမှာတော့ ထည့်သွင်းမပေးထားပါဘူး။ ပုံမှန်အားဖြင့် ဒါက `MessagePort` တစ်ခု ဖြစ်ပါတယ်။

v15.0.0 မတိုင်ခင် Node.js versions တွေမှာ ဒီနေရာမှာ သုံးနေတဲ့ error code ကတော့ [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`][] ဖြစ်ပါတယ်။ ဒါပေမယ့် — transferable object အမျိုးအစားတွေရဲ့ အစုကို `MessagePort` ထက် ပိုများတဲ့ အမျိုးအစားတွေ အကျုံးဝင်အောင် တိုးချဲ့လိုက်ပါပြီ။

<a id="ERR_NAPI_CONS_PROTOTYPE_OBJECT"></a>

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT`

`Node-API` က `Constructor.prototype` က object တစ်ခု မဟုတ်တဲ့အခါ သုံးပါတယ်။

<a id="ERR_NAPI_TSFN_START_IDLE_LOOP"></a>

### `ERR_NAPI_TSFN_START_IDLE_LOOP`

main thread ပေါ်မှာ — thread-safe function နဲ့ ဆက်စပ်နေတဲ့ queue ကနေ တန်ဖိုးတွေကို idle loop (လုပ်ဆောင်စရာ မရှိချိန် လှည့်ပတ် စောင့်ကြည့်မှု) အတွင်းမှာ ဖယ်ရှားပေးပါတယ်။ ဒီ error က loop ကို စတင်ဖို့ ကြိုးစားရာမှာ error တစ်ခု ဖြစ်ပွားခဲ့တယ်ဆိုတာကို ညွှန်ပြပါတယ်။

<a id="ERR_NAPI_TSFN_STOP_IDLE_LOOP"></a>

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP`

queue ထဲမှာ ကျန်နေတဲ့ item တွေ မရှိတော့တာနဲ့ idle loop ကို ဆိုင်းငံ့ (suspend) ထားရပါတယ်။ ဒီ error က idle loop ကို ရပ်တန့်ဖို့ မအောင်မြင်ခဲ့ဘူးဆိုတာကို ညွှန်ပြပါတယ်။

<a id="ERR_NO_LONGER_SUPPORTED"></a>

### `ERR_NO_LONGER_SUPPORTED`

Node.js API တစ်ခုကို support မလုပ်တော့တဲ့ ပုံစံနဲ့ ခေါ်ယူခဲ့ပါတယ် — ဥပမာ `Buffer.write(string, encoding, offset[, length])` လိုမျိုးပါ။

<a id="ERR_OUTOFMEMORY"></a>

### `ERR_OUTOFMEMORY`

operation တစ်ခုက out of memory (မမ်မိုရီ လုံလောက်မှု မရှိခြင်း) အခြေအနေကို ဖြစ်စေခဲ့တာကို ယေဘုယျအားဖြင့် ဖော်ထုတ်ဖို့ သုံးပါတယ်။

<a id="ERR_PARSE_HISTORY_DATA"></a>

### `ERR_PARSE_HISTORY_DATA`

`node:repl` module က REPL history file ထဲက data တွေကို parse လုပ်နိုင်ခြင်း မရှိခဲ့ပါဘူး။

<a id="ERR_SOCKET_CANNOT_SEND"></a>

### `ERR_SOCKET_CANNOT_SEND`

socket တစ်ခုပေါ်မှာ data ပို့လို့ မရခဲ့ပါဘူး။

<a id="ERR_STDERR_CLOSE"></a>

### `ERR_STDERR_CLOSE`

`process.stderr` stream ကို ပိတ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ ဒီဇိုင်းအရ — Node.js က user code အနေနဲ့ `stdout` သို့မဟုတ် `stderr` streams တွေကို ပိတ်တာကို ခွင့်မပြုပါဘူး။

<a id="ERR_STDOUT_CLOSE"></a>

### `ERR_STDOUT_CLOSE`

`process.stdout` stream ကို ပိတ်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ ဒီဇိုင်းအရ — Node.js က user code အနေနဲ့ `stdout` သို့မဟုတ် `stderr` streams တွေကို ပိတ်တာကို ခွင့်မပြုပါဘူး။

<a id="ERR_STREAM_READ_NOT_IMPLEMENTED"></a>

### `ERR_STREAM_READ_NOT_IMPLEMENTED`

[`readable._read()`][] ကို implement (အကောင်အထည်ဖော်) မလုပ်ထားတဲ့ readable stream တစ်ခုကို အသုံးပြုဖို့ ကြိုးစားတဲ့အခါ သုံးပါတယ်။

<a id="ERR_TAP_LEXER_ERROR"></a>

### `ERR_TAP_LEXER_ERROR`

အောင်မြင်မှု မရှိတဲ့ lexer state တစ်ခုကို ကိုယ်စားပြုတဲ့ error တစ်ခု ဖြစ်ပါတယ်။

<a id="ERR_TAP_PARSER_ERROR"></a>

### `ERR_TAP_PARSER_ERROR`

အောင်မြင်မှု မရှိတဲ့ parser state တစ်ခုကို ကိုယ်စားပြုတဲ့ error တစ်ခု ဖြစ်ပါတယ်။ Error ကို ဖြစ်စေတဲ့ token အကြောင်း ထပ်ဆောင်း အချက်အလက်တွေကို `cause` property ကနေ ရယူနိုင်ပါတယ်။

<a id="ERR_TAP_VALIDATION_ERROR"></a>

### `ERR_TAP_VALIDATION_ERROR`

ဒီ error က မအောင်မြင်ခဲ့တဲ့ TAP validation (စစ်ဆေး အတည်ပြုမှု) တစ်ခုကို ကိုယ်စားပြုပါတယ်။

<a id="ERR_TLS_RENEGOTIATION_FAILED"></a>

### `ERR_TLS_RENEGOTIATION_FAILED`

TLS renegotiation (ပြန်လည် ညှိနှိုင်းမှု) request တစ်ခု အတိအကျ သတ်မှတ်လို့ မရတဲ့ ပုံစံနဲ့ မအောင်မြင်ခဲ့တဲ့အခါ သုံးပါတယ်။

<a id="ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER"></a>

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER`

serialization (စီစဉ် သိမ်းဆည်းမှု) လုပ်နေစဉ်မှာ — မမ်မိုရီကို JavaScript engine ဒါမှမဟုတ် Node.js က စီမံခန့်ခွဲမထားတဲ့ `SharedArrayBuffer` တစ်ခုကို ကြုံတွေ့ခဲ့ပါတယ်။ ဒီလို `SharedArrayBuffer` တစ်ခုကို serialize လုပ်လို့ မရပါဘူး။

ဒါက native addons တွေက `SharedArrayBuffer` တွေကို "externalized" mode နဲ့ ဖန်တီးတဲ့အခါ ဒါမှမဟုတ် ရှိပြီးသား `SharedArrayBuffer` တစ်ခုကို externalized mode ထဲ ထည့်လိုက်တဲ့အခါမှာသာ ဖြစ်ပေါ်နိုင်ပါတယ်။

<a id="ERR_UNKNOWN_STDIN_TYPE"></a>

### `ERR_UNKNOWN_STDIN_TYPE`

အသိအမှတ် မပြုနိုင်တဲ့ `stdin` file type တစ်ခုနဲ့ Node.js process တစ်ခုကို စတင်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ ဒီ error က ပုံမှန်အားဖြင့် Node.js ကိုယ်တိုင်ထဲမှာ bug တစ်ခု ရှိနေတာရဲ့ လက္ခဏာ ဖြစ်ပါတယ် — user code က ၎င်းကို trigger လုပ်ဖို့ ဖြစ်နိုင်ခြေ ရှိပေမယ့်ပါ။

<a id="ERR_UNKNOWN_STREAM_TYPE"></a>

### `ERR_UNKNOWN_STREAM_TYPE`

အသိအမှတ် မပြုနိုင်တဲ့ `stdout` သို့မဟုတ် `stderr` file type တစ်ခုနဲ့ Node.js process တစ်ခုကို စတင်ဖို့ ကြိုးစားမှု ပြုလုပ်ခဲ့ပါတယ်။ ဒီ error က ပုံမှန်အားဖြင့် Node.js ကိုယ်တိုင်ထဲမှာ bug တစ်ခု ရှိနေတာရဲ့ လက္ခဏာ ဖြစ်ပါတယ် — user code က ၎င်းကို trigger လုပ်ဖို့ ဖြစ်နိုင်ခြေ ရှိပေမယ့်ပါ။

<a id="ERR_V8BREAKITERATOR"></a>

### `ERR_V8BREAKITERATOR`

V8 ရဲ့ `BreakIterator` API ကို အသုံးပြုခဲ့ပေမယ့် ICU data set အပြည့်အစုံကို ထည့်သွင်းထားခြင်း မရှိပါဘူး။

<a id="ERR_VALUE_OUT_OF_RANGE"></a>

### `ERR_VALUE_OUT_OF_RANGE`

ပေးထားတဲ့ တန်ဖိုးတစ်ခုက လက်ခံနိုင်တဲ့ range (အတိုင်းအတာ) ပြင်ပ ရောက်နေတဲ့အခါ သုံးပါတယ်။

<a id="ERR_VM_MODULE_LINKING_ERRORED"></a>

### `ERR_VM_MODULE_LINKING_ERRORED`

linker function က linking (ချိတ်ဆက်မှု) မအောင်မြင်ခဲ့တဲ့ module တစ်ခုကို ပြန်ပေးခဲ့ပါတယ်။

<a id="ERR_VM_MODULE_NOT_LINKED"></a>

### `ERR_VM_MODULE_NOT_LINKED`

module တစ်ခုကို instantiation (instance ဖန်တီးခြင်း) မလုပ်ခင် အရင် အောင်မြင်စွာ link လုပ်ထားရပါတယ်။

<a id="ERR_WORKER_UNSUPPORTED_EXTENSION"></a>

### `ERR_WORKER_UNSUPPORTED_EXTENSION`

worker တစ်ခုရဲ့ main script အတွက် သုံးထားတဲ့ pathname မှာ အသိအမှတ် မပြုနိုင်တဲ့ file extension တစ်ခု ပါဝင်နေပါတယ်။

<a id="ERR_ZLIB_BINDING_CLOSED"></a>

### `ERR_ZLIB_BINDING_CLOSED`

`zlib` object တစ်ခုကို ပိတ်ပြီးသား ဖြစ်ပြီးမှာ ၎င်းကို အသုံးပြုဖို့ ကြိုးစားတဲ့အခါ သုံးပါတယ်။

<a id="openssl-error-codes"></a>

## OpenSSL error codes များ (OpenSSL Error Codes)

<a id="Time Validity Errors"></a>

### အချိန် တရားဝင်မှု အမှားများ (Time Validity Errors)

<a id="CERT_NOT_YET_VALID"></a>

#### `CERT_NOT_YET_VALID`

certificate က မတရားဝင်သေးပါဘူး: notBefore ရက်စွဲက လက်ရှိ အချိန်ထက် နောက်ကျနေလို့ပါ။

<a id="CERT_HAS_EXPIRED"></a>

#### `CERT_HAS_EXPIRED`

certificate ရဲ့ သက်တမ်း ကုန်ဆုံးသွားပါပြီ: notAfter ရက်စွဲက လက်ရှိ အချိန်ထက် စောနေလို့ပါ။

<a id="CRL_NOT_YET_VALID"></a>

#### `CRL_NOT_YET_VALID`

certificate revocation list (CRL) (certificate ပယ်ဖျက်မှု စာရင်း) ရဲ့ ထုတ်ဝေသည့် ရက်စွဲက အနာဂတ်မှာ ရှိနေပါတယ်။

<a id="CRL_HAS_EXPIRED"></a>

#### `CRL_HAS_EXPIRED`

certificate revocation list (CRL) ရဲ့ သက်တမ်း ကုန်ဆုံးသွားပါပြီ။

<a id="CERT_REVOKED"></a>

#### `CERT_REVOKED`

certificate ကို ပယ်ဖျက် (revoke) လုပ်ထားပါပြီ — ၎င်းက certificate revocation list (CRL) ပေါ်မှာ ရှိနေပါတယ်။

<a id="Trust or Chain Related Errors"></a>

### Trust သို့မဟုတ် chain ဆိုင်ရာ အမှားများ (Trust or Chain Related Errors)

<a id="UNABLE_TO_GET_ISSUER_CERT"></a>

#### `UNABLE_TO_GET_ISSUER_CERT`

ရှာဖွေကြည့်ရှုလိုက်တဲ့ certificate တစ်ခုရဲ့ issuer certificate ကို ရှာမတွေ့ခဲ့ပါဘူး။ ဒါက ပုံမှန်အားဖြင့် ယုံကြည်ရ (trusted) certificates တွေရဲ့ စာရင်းက မပြည့်စုံဘူးလို့ ဆိုလိုပါတယ်။

<a id="UNABLE_TO_GET_ISSUER_CERT_LOCALLY"></a>

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`

certificate ရဲ့ issuer ကို အသိအမှတ် မပြုနိုင်ပါဘူး။ issuer က trusted certificate စာရင်းထဲမှာ မပါဝင်ဘူးဆိုရင် ဒီလို ဖြစ်ပါတယ်။

<a id="DEPTH_ZERO_SELF_SIGNED_CERT"></a>

#### `DEPTH_ZERO_SELF_SIGNED_CERT`

ဖြတ်သန်းပေးလိုက်တဲ့ certificate က self-signed (ကိုယ်တိုင် လက်မှတ်ရေးထိုးထား) ဖြစ်ပြီး — ဒီ certificate ကိုယ်တိုင်က trusted certificates စာရင်းထဲမှာ ရှာမတွေ့ပါဘူး။

<a id="SELF_SIGNED_CERT_IN_CHAIN"></a>

#### `SELF_SIGNED_CERT_IN_CHAIN`

certificate ရဲ့ issuer ကို အသိအမှတ် မပြုနိုင်ပါဘူး။ issuer က trusted certificate စာရင်းထဲမှာ မပါဝင်ဘူးဆိုရင် ဒီလို ဖြစ်ပါတယ်။

<a id="CERT_CHAIN_TOO_LONG"></a>

#### `CERT_CHAIN_TOO_LONG`

certificate chain ရဲ့ အလျားက အများဆုံး ခွင့်ပြုထားတဲ့ depth (အနက်) ထက် ပိုရှည်နေပါတယ်။

<a id="UNABLE_TO_GET_CRL"></a>

#### `UNABLE_TO_GET_CRL`

certificate က ရည်ညွှန်းထားတဲ့ CRL ကို ရှာမတွေ့ခဲ့ပါဘူး။

<a id="UNABLE_TO_VERIFY_LEAF_SIGNATURE"></a>

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE`

chain ထဲမှာ certificate တစ်ခုတည်းသာ ပါဝင်ပြီး ၎င်းက self-signed မဟုတ်တာမို့ — signature တစ်ခုကိုမှ အတည်ပြု (verify) လုပ်လို့ မရခဲ့ပါဘူး။

<a id="CERT_UNTRUSTED"></a>

#### `CERT_UNTRUSTED`

root certificate authority (CA) ကို သတ်မှတ်ထားတဲ့ ရည်ရွယ်ချက် (purpose) အတွက် trusted အဖြစ် မှတ်သားမထားပါဘူး။

<a id="Basic Extension Errors"></a>

### အခြေခံ extension အမှားများ (Basic Extension Errors)

<a id="INVALID_CA"></a>

#### `INVALID_CA`

CA certificate တစ်ခု invalid (မမှန်ကန်) ဖြစ်နေပါတယ်။ ၎င်းက CA မဟုတ်တာမျိုး ဒါမှမဟုတ် ၎င်းရဲ့ extensions တွေက ပေးထားတဲ့ purpose နဲ့ မကိုက်ညီတာမျိုး ဖြစ်နိုင်ပါတယ်။

<a id="PATH_LENGTH_EXCEEDED"></a>

#### `PATH_LENGTH_EXCEEDED`

basicConstraints ရဲ့ pathlength parameter ကို ကျော်လွန်သွားပါပြီ။

<a id="Name Related Errors"></a>

### နာမည် (name) ဆိုင်ရာ အမှားများ (Name Related Errors)

<a id="HOSTNAME_MISMATCH"></a>

#### `HOSTNAME_MISMATCH`

certificate က ပေးထားတဲ့ နာမည်နဲ့ မကိုက်ညီပါဘူး။

<a id="Usage and Policy Errors"></a>

### အသုံးပြုမှုနဲ့ policy ဆိုင်ရာ အမှားများ (Usage and Policy Errors)

<a id="INVALID_PURPOSE"></a>

#### `INVALID_PURPOSE`

ပေးထားတဲ့ certificate ကို သတ်မှတ်ထားတဲ့ ရည်ရွယ်ချက် (purpose) အတွက် သုံးလို့ မရပါဘူး။

<a id="CERT_REJECTED"></a>

#### `CERT_REJECTED`

root CA က သတ်မှတ်ထားတဲ့ purpose ကို ပယ်ချဖို့ မှတ်သားထားပါတယ်။

<a id="Formatting Errors"></a>

### ဖော်မက်ဖွဲ့စည်းမှု (formatting) ဆိုင်ရာ အမှားများ (Formatting Errors)

<a id="CERT_SIGNATURE_FAILURE"></a>

#### `CERT_SIGNATURE_FAILURE`

certificate ရဲ့ signature က invalid (မမှန်ကန်) ဖြစ်နေပါတယ်။

<a id="CRL_SIGNATURE_FAILURE"></a>

#### `CRL_SIGNATURE_FAILURE`

certificate revocation list (CRL) ရဲ့ signature က invalid (မမှန်ကန်) ဖြစ်နေပါတယ်။

<a id="ERROR_IN_CERT_NOT_BEFORE_FIELD"></a>

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD`

certificate ရဲ့ notBefore field ထဲမှာ invalid အချိန် တစ်ခု ပါဝင်နေပါတယ်။

<a id="ERROR_IN_CERT_NOT_AFTER_FIELD"></a>

#### `ERROR_IN_CERT_NOT_AFTER_FIELD`

certificate ရဲ့ notAfter field ထဲမှာ invalid အချိန် တစ်ခု ပါဝင်နေပါတယ်။

<a id="ERROR_IN_CRL_LAST_UPDATE_FIELD"></a>

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD`

CRL ရဲ့ lastUpdate field ထဲမှာ invalid အချိန် တစ်ခု ပါဝင်နေပါတယ်။

<a id="ERROR_IN_CRL_NEXT_UPDATE_FIELD"></a>

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD`

CRL ရဲ့ nextUpdate field ထဲမှာ invalid အချိန် တစ်ခု ပါဝင်နေပါတယ်။

<a id="UNABLE_TO_DECRYPT_CERT_SIGNATURE"></a>

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE`

certificate ရဲ့ signature ကို decrypt (စာဝှက် ဖြည်ခြင်း) လုပ်လို့ မရခဲ့ပါဘူး။ ဆိုလိုတာက — မျှော်လင့်ထားတဲ့ တန်ဖိုးနဲ့ မကိုက်ညီတာကြောင့် မဟုတ်ဘဲ — တကယ့် signature တန်ဖိုးကို သတ်မှတ်နိုင်ခြင်း မရှိခဲ့လို့ ဖြစ်ပြီး — ဒါက RSA keys တွေအတွက်သာ အဓိပ္ပာယ် ရှိပါတယ်။

<a id="UNABLE_TO_DECRYPT_CRL_SIGNATURE"></a>

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE`

certificate revocation list (CRL) ရဲ့ signature ကို decrypt လုပ်လို့ မရခဲ့ပါဘူး: ဆိုလိုတာက — မျှော်လင့်ထားတဲ့ တန်ဖိုးနဲ့ မကိုက်ညီတာကြောင့် မဟုတ်ဘဲ — တကယ့် signature တန်ဖိုးကို သတ်မှတ်နိုင်ခြင်း မရှိခဲ့လို့ ဖြစ်ပါတယ်။

<a id="UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY"></a>

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY`

certificate ထဲက SubjectPublicKeyInfo ရဲ့ public key ကို ဖတ်လို့ မရခဲ့ပါဘူး။

<a id="Other OpenSSL Errors"></a>

### အခြား OpenSSL အမှားများ (Other OpenSSL Errors)

<a id="OUT_OF_MEM"></a>

#### `OUT_OF_MEM`

memory ခွဲဝေသတ်မှတ်ဖို့ ကြိုးစားရာမှာ error တစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။ ဒါက ဘယ်တော့မှ မဖြစ်သင့်ပါဘူး။

[ES Module]: esm.md
[ICU]: intl.md#internationalization-support
[JSON Web Key Elliptic Curve Registry]: https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve
[JSON Web Key Types Registry]: https://www.iana.org/assignments/jose/jose.xhtml#web-key-types
[Native TypeScript support]: typescript.md#type-stripping
[Node.js error codes]: #nodejs-error-codes
[Permission Model]: permissions.md#permission-model
[RFC 7230 Section 3]: https://tools.ietf.org/html/rfc7230#section-3
[SQLite]: sqlite.md
[Subresource Integrity specification]: https://www.w3.org/TR/SRI/#the-integrity-attribute
[V8's stack trace API]: https://v8.dev/docs/stack-trace-api
[WHATWG Supported Encodings]: util.md#whatwg-supported-encodings
[WHATWG URL API]: url.md#the-whatwg-url-api
[`"exports"`]: packages.md#exports
[`"imports"`]: packages.md#imports
[`'uncaughtException'`]: process.md#event-uncaughtexception
[`--disable-proto=throw`]: cli.md#--disable-protomode
[`--force-fips`]: cli.md#--force-fips
[`--no-addons`]: cli.md#--no-addons
[`--unhandled-rejections`]: cli.md#--unhandled-rejectionsmode
[`BoundSocket`]: net.md#class-netboundsocket
[`Class: assert.AssertionError`]: assert.md#class-assertassertionerror
[`ERR_INCOMPATIBLE_OPTION_PAIR`]: #err_incompatible_option_pair
[`ERR_INVALID_ARG_TYPE`]: #err_invalid_arg_type
[`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`]: #err_missing_message_port_in_transfer_list
[`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`]: #err_missing_transferable_in_transfer_list
[`ERR_REQUIRE_ASYNC_MODULE`]: #err_require_async_module
[`Error.isError`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/isError
[`EventEmitter`]: events.md#class-eventemitter
[`MessagePort`]: worker_threads.md#class-messageport
[`Object.getPrototypeOf`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf
[`Object.setPrototypeOf`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf
[`QuicError`]: quic.md#class-quicerror
[`REPL`]: repl.md
[`ServerResponse`]: http.md#class-httpserverresponse
[`Temporal`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal
[`Writable`]: stream.md#class-streamwritable
[`ZipBuffer`]: zlib.md#class-zlibzipbuffer
[`ZipFile`]: zlib.md#class-zlibzipfile
[`child_process`]: child_process.md
[`cipher.getAuthTag()`]: crypto.md#ciphergetauthtag
[`crypto.getDiffieHellman()`]: crypto.md#cryptogetdiffiehellmangroupname
[`crypto.scrypt()`]: crypto.md#cryptoscryptpassword-salt-keylen-options-callback
[`crypto.scryptSync()`]: crypto.md#cryptoscryptsyncpassword-salt-keylen-options
[`crypto.timingSafeEqual()`]: crypto.md#cryptotimingsafeequala-b
[`dgram.connect()`]: dgram.md#socketconnectport-address-callback
[`dgram.createSocket()`]: dgram.md#dgramcreatesocketoptions-callback
[`dgram.disconnect()`]: dgram.md#socketdisconnect
[`dgram.remoteAddress()`]: dgram.md#socketremoteaddress
[`domException.name`]: https://developer.mozilla.org/en-US/docs/Web/API/DOMException/name
[`errno`(3) man page]: https://man7.org/linux/man-pages/man3/errno.3.html
[`error.code`]: #errorcode
[`error.message`]: #errormessage
[`fs.Dir`]: fs.md#class-fsdir
[`fs.cp()`]: fs.md#fscpsrc-dest-options-callback
[`fs.readFileSync`]: fs.md#fsreadfilesyncpath-options
[`fs.readdir`]: fs.md#fsreaddirpath-options-callback
[`fs.symlink()`]: fs.md#fssymlinktarget-path-type-callback
[`fs.symlinkSync()`]: fs.md#fssymlinksynctarget-path-type
[`fs.unlink`]: fs.md#fsunlinkpath-callback
[`fs`]: fs.md
[`hash.digest()`]: crypto.md#hashdigestencoding
[`hash.update()`]: crypto.md#hashupdatedata-inputencoding
[`http`]: http.md
[`https`]: https.md
[`libuv Error handling`]: https://docs.libuv.org/en/v1.x/errors.html
[`net.Server`]: net.md#class-netserver
[`net.Socket.write()`]: net.md#socketwritedata-encoding-callback
[`net.Socket`]: net.md#class-netsocket
[`net`]: net.md
[`new URL(input)`]: url.md#new-urlinput-base
[`new URLPattern(input)`]: url.md#new-urlpatternstring-baseurl-options
[`new URLSearchParams(iterable)`]: url.md#new-urlsearchparamsiterable
[`package.json`]: packages.md#nodejs-packagejson-field-definitions
[`postMessage()`]: worker_threads.md#portpostmessagevalue-transferlist
[`postMessageToThread()`]: worker_threads.md#worker_threadspostmessagetothreadthreadid-value-transferlist-timeout
[`process.on('exit')`]: process.md#event-exit
[`process.send()`]: process.md#processsendmessage-sendhandle-options-callback
[`process.setUncaughtExceptionCaptureCallback()`]: process.md#processsetuncaughtexceptioncapturecallbackfn
[`readable._read()`]: stream.md#readable_readsize
[`require('node:crypto').setEngine()`]: crypto.md#cryptosetengineengine-flags
[`require()`]: modules.md#requireid
[`server.close()`]: net.md#serverclosecallback
[`server.listen()`]: net.md#serverlisten
[`sign.sign()`]: crypto.md#signsignprivatekey-outputencoding
[`stream.pipe()`]: stream.md#readablepipedestination-options
[`stream.push()`]: stream.md#readablepushchunk-encoding
[`stream.unshift()`]: stream.md#readableunshiftchunk-encoding
[`stream.write()`]: stream.md#writablewritechunk-encoding-callback
[`subprocess.kill()`]: child_process.md#subprocesskillsignal
[`subprocess.send()`]: child_process.md#subprocesssendmessage-sendhandle-options-callback
[`url.parse()`]: url.md#urlparseurlstring-parsequerystring-slashesdenotehost
[`util.getSystemErrorName(error.errno)`]: util.md#utilgetsystemerrornameerr
[`util.inspect()`]: util.md#utilinspectobject-options
[`util.parseArgs()`]: util.md#utilparseargsconfig
[`v8.startupSnapshot.setDeserializeMainFunction()`]: v8.md#v8startupsnapshotsetdeserializemainfunctioncallback-data
[`zlib`]: zlib.md
[crypto digest algorithm]: crypto.md#cryptogethashes
[debugger]: debugger.md
[define a custom subpath]: packages.md#subpath-exports
[domains]: domain.md
[event emitter-based]: events.md#class-eventemitter
[file descriptors]: https://en.wikipedia.org/wiki/File_descriptor
[package map]: packages.md#package-maps
[relative URL]: https://url.spec.whatwg.org/#relative-url-string
[self-reference a package using its name]: packages.md#self-referencing-a-package-using-its-name
[special scheme]: https://url.spec.whatwg.org/#special-scheme
[stream-based]: stream.md
[syscall]: https://man7.org/linux/man-pages/man2/syscalls.2.html
[try-catch]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
[type-stripping]: typescript.md#type-stripping
[vm]: vm.md
