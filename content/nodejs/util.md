---
title: "Util"
description: "node:util module — Node.js internal APIs တွေရဲ့ လိုအပ်ချက်တွေကို ဖြည့်ဆည်းပေးတဲ့ utility functions (callbackify, promisify, format, inspect, MIMEType စသည်)"
order: 125
source: "https://nodejs.org/api/util.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:util` module က Node.js internal APIs တွေရဲ့ လိုအပ်ချက်တွေကို ဖြည့်ဆည်းပေးပါတယ်။ ဒီ utility တွေထဲက အများစုက application နဲ့ module developers တွေအတွက်လည်း အသုံးဝင်ပါတယ်။ ဝင်ရောက်သုံးရန်:

```mjs
import util from 'node:util';
```

```cjs
const util = require('node:util');
```

## `util.callbackify(original)`

* `original` {Function} `async` function တစ်ခု
* Returns: {Function} callback style function တစ်ခု

`async` function တစ်ခု (သို့မဟုတ် `Promise` တစ်ခုကို ပြန်ပေးတဲ့ function တစ်ခု) ကို ယူပြီး — error-first callback style အတိုင်း လိုက်နာတဲ့ function တစ်ခုကို ပြန်ပေးပါတယ်။ ဆိုလိုတာက နောက်ဆုံး argument အနေနဲ့ `(err, value) => ...` callback တစ်ခုကို လက်ခံတဲ့ function ပါ။ အဲဒီ callback ထဲမှာ ပထမ argument က rejection reason (သို့မဟုတ် `Promise` resolve ဖြစ်ခဲ့ရင် `null`) ဖြစ်ပြီး — ဒုတိယ argument ကတော့ resolve လုပ်လိုက်တဲ့ တန်ဖိုး ဖြစ်ပါလိမ့်မယ်။

```mjs
import { callbackify } from 'node:util';

async function fn() {
  return 'hello world';
}
const callbackFunction = callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```

```cjs
const { callbackify } = require('node:util');

async function fn() {
  return 'hello world';
}
const callbackFunction = callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```

အောက်ပါအတိုင်း ပုံနှိပ်ပါလိမ့်မယ်:

```text
hello world
```

Callback ကို asynchronously လုပ်ဆောင်ပြီး — stack trace က ကန့်သတ်ထားတဲ့ ပမာဏပဲ ပါဝင်ပါလိမ့်မယ်။ Callback က throw လုပ်ခဲ့ရင် process က [`'uncaughtException'`][] event တစ်ခုကို emit လုပ်ပြီး — အဲဒါကို ကိုင်တွယ်မထားရင် process က ထွက်သွားပါလိမ့်မယ်။

`null` က callback တစ်ခုရဲ့ ပထမ argument အနေနဲ့ အထူး အဓိပ္ပာယ် ရှိတာမို့ — wrapped function တစ်ခုက `Promise` တစ်ခုကို falsy တန်ဖိုးတစ်ခုကို reason အဖြစ်နဲ့ reject လုပ်ခဲ့ရင် — အဲဒီတန်ဖိုးကို `reason` လို့ နာမည်ပေးထားတဲ့ field တစ်ခုထဲမှာ မူရင်း တန်ဖိုးနဲ့အတူ `Error` တစ်ခုထဲ ထုပ်ပိုးပါတယ်။

```mjs
import util from 'node:util';

function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // When the Promise was rejected with `null` it is wrapped with an Error and
  // the original value is stored in `reason`.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

```cjs
const util = require('node:util');

function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // When the Promise was rejected with `null` it is wrapped with an Error and
  // the original value is stored in `reason`.
  err && Object.hasOwn(err, 'reason') && err.reason === null;  // true
});
```

## `util.convertProcessSignalToExitCode(signal)`

* `signal` {string} signal name တစ်ခု (ဥပမာ `'SIGTERM'`)
* Returns: {number} `signal` နဲ့ ကိုက်ညီတဲ့ exit code

`util.convertProcessSignalToExitCode()` method က signal name တစ်ခုကို ၎င်းနဲ့ ကိုက်ညီတဲ့ POSIX exit code အဖြစ် ပြောင်းပေးပါတယ်။ POSIX standard အရ — signal တစ်ခုကြောင့် terminate လုပ်ခံရတဲ့ process တစ်ခုရဲ့ exit code ကို `128 + signal number` အနေနဲ့ တွက်ချက်ပါတယ်။

`signal` က တရားဝင်တဲ့ signal name မဟုတ်ဘူးဆိုရင် error တစ်ခု throw လုပ်ပါလိမ့်မယ်။ တရားဝင် signals တွေရဲ့ စာရင်းအတွက် [`signal(7)`][] ကို ကြည့်ပါ။

```mjs
import { convertProcessSignalToExitCode } from 'node:util';

console.log(convertProcessSignalToExitCode('SIGTERM')); // 143 (128 + 15)
console.log(convertProcessSignalToExitCode('SIGKILL')); // 137 (128 + 9)
```

```cjs
const { convertProcessSignalToExitCode } = require('node:util');

console.log(convertProcessSignalToExitCode('SIGTERM')); // 143 (128 + 15)
console.log(convertProcessSignalToExitCode('SIGKILL')); // 137 (128 + 9)
```

Process တွေနဲ့ အလုပ်လုပ်တဲ့အခါ — process ကို terminate လုပ်လိုက်တဲ့ signal ကို အခြေခံပြီး exit code ကို ဆုံးဖြတ်ဖို့ ဒါက အထူးသဖြင့် အသုံးဝင်ပါတယ်။

## `util.debuglog(section[, callback])`

* `section` {string} `debuglog` function ကို ဖန်တီးနေတဲ့ application ရဲ့ အပိုင်းကို ခွဲခြားဖော်ပြတဲ့ string တစ်ခု။
* `callback` {Function} Logging function ကို ပထမဆုံး အကြိမ် ခေါ်တဲ့အခါ invoke လုပ်တဲ့ callback တစ်ခု — ဒီ callback က ပိုမို optimize လုပ်ထားတဲ့ logging function တစ်ခုကို function argument အနေနဲ့ လက်ခံရရှိပါတယ်။
* Returns: {Function} logging function

`util.debuglog()` method ကို `NODE_DEBUG` environment variable ရှိမရှိပေါ် မူတည်ပြီး — debug messages တွေကို `stderr` ဆီ conditional ရေးပေးတဲ့ function တစ်ခုကို ဖန်တီးဖို့ သုံးပါတယ်။ `section` နာမည်က အဲဒီ environment variable ရဲ့ တန်ဖိုးထဲမှာ ပါနေရင် — ပြန်ပေးလိုက်တဲ့ function က [`console.error()`][] နဲ့ ဆင်တူစွာ အလုပ်လုပ်ပါတယ်။ မပါဘူးဆိုရင် — ပြန်ပေးလိုက်တဲ့ function က no-op (ဘာမှ မလုပ်သော function) တစ်ခု ဖြစ်ပါတယ်။

```mjs
import { debuglog } from 'node:util';
const log = debuglog('foo');

log('hello from foo [%d]', 123);
```

```cjs
const { debuglog } = require('node:util');
const log = debuglog('foo');

log('hello from foo [%d]', 123);
```

ဒီ program ကို environment ထဲမှာ `NODE_DEBUG=foo` နဲ့ run မယ်ဆိုရင် — ဒီလိုမျိုး output ထွက်ပါလိမ့်မယ်:

```console
FOO 3245: hello from foo [123]
```

ဒီမှာ `3245` က process id ပါ။ အဲဒီ environment variable မပါပဲ run မယ်ဆိုရင် — ဘာမှ ပုံနှိပ်မထုတ်ပါဘူး။

`section` က wildcard ကိုလည်း ထောက်ပံ့ပေးပါတယ်:

```mjs
import { debuglog } from 'node:util';
const log = debuglog('foo-bar');

log('hi there, it\'s foo-bar [%d]', 2333);
```

```cjs
const { debuglog } = require('node:util');
const log = debuglog('foo-bar');

log('hi there, it\'s foo-bar [%d]', 2333);
```

ဒါကို environment ထဲမှာ `NODE_DEBUG=foo*` နဲ့ run မယ်ဆိုရင် — ဒီလိုမျိုး output ထွက်ပါလိမ့်မယ်:

```console
FOO-BAR 3257: hi there, it's foo-bar [2333]
```

`NODE_DEBUG` environment variable ထဲမှာ comma နဲ့ ခြားထားတဲ့ `section` နာမည် အများအပြားကို သတ်မှတ်နိုင်ပါတယ်: `NODE_DEBUG=fs,net,tls`။

Optional ဖြစ်တဲ့ `callback` argument ကို — section enabled ဖြစ်မဖြစ် စစ်ဆေးတဲ့ initialization သို့မဟုတ် မလိုအပ်တဲ့ wrapping တွေ မပါတဲ့ အခြား function တစ်ခုနဲ့ logging function ကို အစားထိုးဖို့ သုံးနိုင်ပါတယ်။

```mjs
import { debuglog } from 'node:util';
let log = debuglog('internals', (debug) => {
  // Replace with a logging function that optimizes out
  // testing if the section is enabled
  log = debug;
});
```

```cjs
const { debuglog } = require('node:util');
let log = debuglog('internals', (debug) => {
  // Replace with a logging function that optimizes out
  // testing if the section is enabled
  log = debug;
});
```

### `debuglog().enabled`

* Type: {boolean}

`util.debuglog().enabled` getter ကို `NODE_DEBUG` environment variable ရှိမရှိပေါ် မူတည်တဲ့ conditionals တွေထဲမှာ သုံးလို့ရတဲ့ test တစ်ခုကို ဖန်တီးဖို့ သုံးပါတယ်။ `section` နာမည်က အဲဒီ environment variable ရဲ့ တန်ဖိုးထဲမှာ ပါနေရင် — ပြန်ပေးတဲ့ တန်ဖိုးက `true` ဖြစ်ပါလိမ့်မယ်။ မပါဘူးဆိုရင် — ပြန်ပေးတဲ့ တန်ဖိုးက `false` ဖြစ်ပါလိမ့်မယ်။

```mjs
import { debuglog } from 'node:util';
const enabled = debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}
```

```cjs
const { debuglog } = require('node:util');
const enabled = debuglog('foo').enabled;
if (enabled) {
  console.log('hello from foo [%d]', 123);
}
```

ဒီ program ကို environment ထဲမှာ `NODE_DEBUG=foo` နဲ့ run မယ်ဆိုရင် — ဒီလိုမျိုး output ထွက်ပါလိမ့်မယ်:

```console
hello from foo [123]
```

## `util.debug(section)`

`util.debuglog` ရဲ့ alias တစ်ခုပါ။ `util.debuglog().enabled` ကိုပဲ သုံးပြီး logging မပြုလုပ်တဲ့ code တွေမှာ — logging ကို ရည်ရွယ်ထားတာ မဟုတ်ဘူးဆိုတဲ့ အဓိပ္ပာယ် သက်ရောက်မှု မရှိစေဖို့ ဖတ်ရှုရလွယ်ကူအောင် ဒီ alias ကို သုံးနိုင်ပါတယ်။

## `util.deprecate(fn, msg[, code[, options]])`

* `fn` {Function} Deprecate လုပ်ခံနေရတဲ့ function။
* `msg` {string} Deprecated function ကို invoke လုပ်တဲ့အခါ ပြသမယ့် warning message တစ်ခု။
* `code` {string} Deprecation code တစ်ခု။ Codes စာရင်းအတွက် [list of deprecated APIs][] ကို ကြည့်ပါ။
* `options` {Object}
  * `modifyPrototype` {boolean} `false` ဖြစ်ရင် deprecation warning ကို emit လုပ်နေစဉ် object ရဲ့ prototype ကို မပြောင်းပါ။
    **Default:** `true`။
* Returns: {Function} Warning တစ်ခု emit လုပ်ဖို့ ထုပ်ပိုးထားတဲ့ deprecated function

`util.deprecate()` method က `fn` (function တစ်ခု သို့မဟုတ် class တစ်ခု ဖြစ်နိုင်သည်) ကို deprecated အဖြစ် အမှတ်အသား ပြုလုပ်ထားတဲ့ ပုံစံမျိုးနဲ့ ထုပ်ပိုးပေးပါတယ်။

```mjs
import { deprecate } from 'node:util';

export const obsoleteFunction = deprecate(() => {
  // Do something here.
}, 'obsoleteFunction() is deprecated. Use newShinyFunction() instead.');
```

```cjs
const { deprecate } = require('node:util');

exports.obsoleteFunction = deprecate(() => {
  // Do something here.
}, 'obsoleteFunction() is deprecated. Use newShinyFunction() instead.');
```

ခေါ်လိုက်တဲ့အခါ `util.deprecate()` က [`'warning'`][] event ကို သုံးပြီး `DeprecationWarning` တစ်ခု emit လုပ်မယ့် function တစ်ခုကို ပြန်ပေးပါတယ်။ ပြန်ပေးလိုက်တဲ့ function ကို ပထမဆုံး အကြိမ် ခေါ်တဲ့အခါ warning ကို emit လုပ်ပြီး `stderr` ဆီ ပုံနှိပ်ပါလိမ့်မယ်။ Warning emit လုပ်ပြီးတဲ့ နောက်မှာတော့ — wrapped function ကို warning မပါပဲ ခေါ်ပါတယ်။

`util.deprecate()` ကို ခေါ်တဲ့ အကြိမ်များစွာမှာ တူညီတဲ့ optional `code` ကို ထောက်ပံ့ပေးထားရင် — အဲဒီ `code` အတွက် warning ကို တစ်ကြိမ်ပဲ emit လုပ်ပါလိမ့်မယ်။

```mjs
import { deprecate } from 'node:util';

const fn1 = deprecate(
  () => 'a value',
  'deprecation message',
  'DEP0001',
);
const fn2 = deprecate(
  () => 'a  different value',
  'other dep message',
  'DEP0001',
);
fn1(); // Emits a deprecation warning with code DEP0001
fn2(); // Does not emit a deprecation warning because it has the same code
```

```cjs
const { deprecate } = require('node:util');

const fn1 = deprecate(
  function() {
    return 'a value';
  },
  'deprecation message',
  'DEP0001',
);
const fn2 = deprecate(
  function() {
    return 'a  different value';
  },
  'other dep message',
  'DEP0001',
);
fn1(); // Emits a deprecation warning with code DEP0001
fn2(); // Does not emit a deprecation warning because it has the same code
```

`--no-deprecation` သို့မဟုတ် `--no-warnings` command-line flags တွေကို သုံးထားရင် — သို့မဟုတ် `process.noDeprecation` property ကို ပထမ deprecation warning မတိုင်ခင် _prior_ အနေနဲ့ `true` အဖြစ် သတ်မှတ်ထားရင် — `util.deprecate()` method က ဘာမှ မလုပ်ပါဘူး။

`--trace-deprecation` သို့မဟုတ် `--trace-warnings` command-line flags တွေကို သတ်မှတ်ထားရင် — သို့မဟုတ် `process.traceDeprecation` property ကို `true` အဖြစ် သတ်မှတ်ထားရင် — deprecated function ကို ပထမဆုံး အကြိမ် ခေါ်တဲ့အခါ warning နဲ့ stack trace တစ်ခုကို `stderr` ဆီ ပုံနှိပ်ပါလိမ့်မယ်။

`--throw-deprecation` command-line flag ကို သတ်မှတ်ထားရင် — သို့မဟုတ် `process.throwDeprecation` property ကို `true` အဖြစ် သတ်မှတ်ထားရင် — deprecated function ကို ခေါ်တဲ့အခါ exception တစ်ခု throw လုပ်ပါလိမ့်မယ်။

`--throw-deprecation` command-line flag နဲ့ `process.throwDeprecation` property တို့က `--trace-deprecation` နဲ့ `process.traceDeprecation` တို့ထက် ဦးစားပေး အကျုံးဝင်ပါတယ်။

## `util.diff(actual, expected)`

> Stability: 1 - Experimental

* `actual` {Array|string} နှိုင်းယှဉ်ရမယ့် ပထမ တန်ဖိုး

* `expected` {Array|string} နှိုင်းယှဉ်ရမယ့် ဒုတိယ တန်ဖိုး

* Returns: {Array} ကွာခြားချက် entries တွေရဲ့ array တစ်ခု။ Entry တစ်ခုချင်းစီက element နှစ်ခုပါတဲ့ array တစ်ခုပါ:
  * `0` {number} Operation code: delete အတွက် `-1`၊ no-op/unchanged အတွက် `0`၊ insert အတွက် `1`
  * `1` {string} Operation နဲ့ ဆက်စပ်နေတဲ့ တန်ဖိုး

* Algorithm complexity: O(N\*D) — ဘယ်မှာလဲဆိုရင်:

* N က sequence နှစ်ခုရဲ့ စုစုပေါင်း အလျား ပေါင်းလဒ် ဖြစ်ပါတယ် (N = actual.length + expected.length)

* D က edit distance (sequence တစ်ခုကနေ နောက်တစ်ခုဆီကို ပြောင်းလဲဖို့ လိုအပ်တဲ့ operations အရေအတွက် အနည်းဆုံး) ဖြစ်ပါတယ်။

[`util.diff()`][] က string သို့မဟုတ် array တန်ဖိုး နှစ်ခုကို နှိုင်းယှဉ်ပြီး — ကွာခြားချက် entries တွေရဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။ အနည်းဆုံး ကွာခြားချက်တွေကို တွက်ချက်ဖို့ Myers diff algorithm ကို သုံးပါတယ် — ဒါက assertion error messages တွေထဲမှာ internally သုံးနေတဲ့ algorithm နဲ့ အတူတူပါပဲ။

တန်ဖိုးတွေ တူညီနေရင် — empty array တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const { diff } = require('node:util');

// Comparing strings
const actualString = '12345678';
const expectedString = '12!!5!7!';
console.log(diff(actualString, expectedString));
// [
//   [0, '1'],
//   [0, '2'],
//   [1, '3'],
//   [1, '4'],
//   [-1, '!'],
//   [-1, '!'],
//   [0, '5'],
//   [1, '6'],
//   [-1, '!'],
//   [0, '7'],
//   [1, '8'],
//   [-1, '!'],
// ]
// Comparing arrays
const actualArray = ['1', '2', '3'];
const expectedArray = ['1', '3', '4'];
console.log(diff(actualArray, expectedArray));
// [
//   [0, '1'],
//   [1, '2'],
//   [0, '3'],
//   [-1, '4'],
// ]
// Equal values return empty array
console.log(diff('same', 'same'));
// []
```

## `util.format(format[, ...args])`

* `format` {string} `printf`-ပုံစံ format string တစ်ခု။

`util.format()` method က ပထမ argument ကို `printf`-ပုံစံ format string အဖြစ် သုံးပြီး — format specifier သုည ခု သို့မဟုတ် ထို့ထက် ပိုပြီး ပါဝင်နိုင်တဲ့ — formatted string တစ်ခုကို ပြန်ပေးပါတယ်။ Specifier တစ်ခုချင်းစီကို သက်ဆိုင်ရာ argument ကနေ ပြောင်းလဲလိုက်တဲ့ တန်ဖိုးနဲ့ အစားထိုးပါတယ်။ ထောက်ပံ့ပေးထားတဲ့ specifiers တွေကတော့:

* `%s`: `BigInt`, `Object` နဲ့ `-0` ကလွဲပြီး — တန်ဖိုးအားလုံးကို ပြောင်းဖို့ `String` ကို သုံးပါလိမ့်မယ်။ `BigInt` တန်ဖိုးတွေကို `n` တစ်ခုနဲ့ ဖော်ပြပြီး — user က သတ်မှတ်ထားတဲ့ `toString` function ရော `Symbol.toPrimitive` function ရော နှစ်ခုလုံး မရှိတဲ့ Objects တွေကို `{ depth: 0, colors: false, compact: 3 }` options တွေနဲ့ `util.inspect()` ကို သုံးပြီး inspect လုပ်ပါတယ်။
* `%d`: `BigInt` နဲ့ `Symbol` ကလွဲပြီး — တန်ဖိုးအားလုံးကို ပြောင်းဖို့ `Number` ကို သုံးပါလိမ့်မယ်။
* `%i`: `BigInt` နဲ့ `Symbol` ကလွဲပြီး — တန်ဖိုးအားလုံးအတွက် `parseInt(value, 10)` ကို သုံးပါတယ်။
* `%f`: `Symbol` ကလွဲပြီး — တန်ဖိုးအားလုံးအတွက် `parseFloat(value)` ကို သုံးပါတယ်။
* `%j`: JSON ပါ။ Argument ထဲမှာ circular references တွေ ပါနေရင် `'[Circular]'` ဆိုတဲ့ string နဲ့ အစားထိုးပါတယ်။
* `%o`: `Object` ပါ။ Generic JavaScript object formatting နဲ့ object တစ်ခုရဲ့ string ဖော်ပြချက်ပါ။ `{ showHidden: true, showProxy: true }` options တွေနဲ့ `util.inspect()` နဲ့ ဆင်တူပါတယ်။ ဒါက non-enumerable properties နဲ့ proxies တွေ အပါအဝင် object အပြည့်အစုံကို ပြသပါလိမ့်မယ်။
* `%O`: `Object` ပါ။ Generic JavaScript object formatting နဲ့ object တစ်ခုရဲ့ string ဖော်ပြချက်ပါ။ Options မပါတဲ့ `util.inspect()` နဲ့ ဆင်တူပါတယ်။ ဒါက non-enumerable properties နဲ့ proxies တွေ မပါတဲ့ object အပြည့်အစုံကို ပြသပါလိမ့်မယ်။
* `%c`: `CSS` ပါ။ ဒီ specifier ကို လျစ်လျူရှုပြီး — ပေးလိုက်တဲ့ CSS ကို ကျော်သွားပါလိမ့်မယ်။
* `%%`: percent sign တစ်ခုတည်း (`'%'`) ပါ။ ဒါက argument တစ်ခုကို သုံးစွဲမှာ မဟုတ်ပါဘူး။
* Returns: {string} formatted string

Specifier တစ်ခုမှာ ကိုက်ညီတဲ့ argument မရှိဘူးဆိုရင် — အစားထိုး မလုပ်ပါဘူး:

```js
util.format('%s:%s', 'foo');
// Returns: 'foo:%s'
```

Format string ထဲမှာ မပါဝင်တဲ့ တန်ဖိုးတွေကို — သူတို့ရဲ့ type က `string` မဟုတ်ဘူးဆိုရင် `util.inspect()` ကို သုံးပြီး format လုပ်ပါတယ်။

`util.format()` method ဆီကို specifiers အရေအတွက်ထက် arguments တွေ ပိုပေးလိုက်ရင် — အပိုဖြစ်တဲ့ arguments တွေကို space တွေနဲ့ ခြားပြီး ပြန်ပေးတဲ့ string ဆီကို ဆက်စပ်ထည့်ပါတယ်:

```js
util.format('%s:%s', 'foo', 'bar', 'baz');
// Returns: 'foo:bar baz'
```

ပထမ argument ထဲမှာ တရားဝင်တဲ့ format specifier မပါဘူးဆိုရင် — `util.format()` က arguments အားလုံးကို space တွေနဲ့ ခြားပြီး ဆက်စပ်ထားတဲ့ string တစ်ခုကို ပြန်ပေးပါတယ်:

```js
util.format(1, 2, 3);
// Returns: '1 2 3'
```

`util.format()` ဆီကို argument တစ်ခုတည်းပဲ ပေးလိုက်ရင် — ၎င်းကို ဘာ formatting မှ မလုပ်ပဲ မူလအတိုင်း ပြန်ပေးပါတယ်:

```js
util.format('%% %s');
// Returns: '%% %s'
```

`util.format()` က debugging tool တစ်ခုအနေနဲ့ ရည်ရွယ်ထားတဲ့ synchronous method တစ်ခုပါ။ Input တန်ဖိုး အချို့က event loop ကို block လုပ်နိုင်လောက်တဲ့ သိသာတဲ့ performance overhead ရှိနိုင်ပါတယ်။ ဒီ function ကို သတိထားပြီး သုံးပါ — hot code path တွေထဲမှာ ဘယ်တော့မှ မသုံးပါနဲ့။

## `util.formatWithOptions(inspectOptions, format[, ...args])`

* `inspectOptions` {Object}
* `format` {string}

ဒီ function က [`util.format()`][] နဲ့ တူညီပါတယ် — ခြားနားချက်က [`util.inspect()`][] ဆီကို ပို့ပေးရမယ့် options တွေကို သတ်မှတ်ပေးတဲ့ `inspectOptions` argument တစ်ခုကို လက်ခံတာပါ။

```js
util.formatWithOptions({ colors: true }, 'See object %O', { foo: 42 });
// Returns 'See object { foo: 42 }', where `42` is colored as a number
// when printed to a terminal.
```

## `util.getCallSites([frameCount][, options])`

> Stability: 1.1 - Active development

* `frameCount` {integer} Call site objects တွေအနေနဲ့ ဖမ်းယူရမယ့် frames အရေအတွက် (optional)။
  **Default:** `10`။ ခွင့်ပြုထားတဲ့ range က 1 နဲ့ 200 ကြားပါ။
* `options` {Object} Optional
  * `sourceMap` {boolean} Stacktrace ထဲမှာ မူရင်း နေရာကို source-map ကနေ ပြန်လည် တည်ဆောက်ပါတယ်။
    `--enable-source-maps` flag နဲ့ဆို default အနေနဲ့ enabled ဖြစ်ပါတယ်။
* Returns: {Object\[]} Call site objects တွေရဲ့ array တစ်ခု
  * `functionName` {string} ဒီ call site နဲ့ ဆက်စပ်နေတဲ့ function ရဲ့ နာမည်ကို ပြန်ပေးပါတယ်။
  * `scriptName` {string} ဒီ call site အတွက် function ရဲ့ script ပါဝင်တဲ့ resource ရဲ့ နာမည်ကို ပြန်ပေးပါတယ်။
  * `scriptId` {string} Chrome DevTools protocol [`Runtime.ScriptId`][] မှာလိုပဲ — script ရဲ့ unique id ကို ပြန်ပေးပါတယ်။
  * `lineNumber` {number} JavaScript script ရဲ့ line number (1-based) ကို ပြန်ပေးပါတယ်။
  * `columnNumber` {number} JavaScript script ရဲ့ column number (1-based) ကို ပြန်ပေးပါတယ်။

Caller function ရဲ့ stack ပါဝင်တဲ့ call site objects တွေရဲ့ array တစ်ခုကို ပြန်ပေးပါတယ်။

`error.stack` ကို ဝင်ရောက်ကြည့်တာနဲ့ မတူဘဲ — ဒီ API ကနေ ပြန်လာတဲ့ ရလဒ်ကို `Error.prepareStackTrace` က ဝင်ရောက် စွက်ဖက်မှု မရှိပါဘူး။

```mjs
import { getCallSites } from 'node:util';

function exampleFunction() {
  const callSites = getCallSites();

  console.log('Call Sites:');
  callSites.forEach((callSite, index) => {
    console.log(`CallSite ${index + 1}:`);
    console.log(`Function Name: ${callSite.functionName}`);
    console.log(`Script Name: ${callSite.scriptName}`);
    console.log(`Line Number: ${callSite.lineNumber}`);
    console.log(`Column Number: ${callSite.columnNumber}`);
  });
  // CallSite 1:
  // Function Name: exampleFunction
  // Script Name: /home/example.js
  // Line Number: 5
  // Column Number: 26

  // CallSite 2:
  // Function Name: anotherFunction
  // Script Name: /home/example.js
  // Line Number: 22
  // Column Number: 3

  // ...
}

// A function to simulate another stack layer
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```

```cjs
const { getCallSites } = require('node:util');

function exampleFunction() {
  const callSites = getCallSites();

  console.log('Call Sites:');
  callSites.forEach((callSite, index) => {
    console.log(`CallSite ${index + 1}:`);
    console.log(`Function Name: ${callSite.functionName}`);
    console.log(`Script Name: ${callSite.scriptName}`);
    console.log(`Line Number: ${callSite.lineNumber}`);
    console.log(`Column Number: ${callSite.columnNumber}`);
  });
  // CallSite 1:
  // Function Name: exampleFunction
  // Script Name: /home/example.js
  // Line Number: 5
  // Column Number: 26

  // CallSite 2:
  // Function Name: anotherFunction
  // Script Name: /home/example.js
  // Line Number: 22
  // Column Number: 3

  // ...
}

// A function to simulate another stack layer
function anotherFunction() {
  exampleFunction();
}

anotherFunction();
```

`sourceMap` option ကို `true` အဖြစ် သတ်မှတ်ခြင်းအားဖြင့် မူရင်း နေရာတွေကို ပြန်လည် တည်ဆောက်နိုင်ပါတယ်။ Source map မရနိုင်ဘူးဆိုရင် — မူရင်း နေရာက လက်ရှိ နေရာနဲ့ အတူတူပဲ ဖြစ်ပါလိမ့်မယ်။ `--enable-source-maps` flag enabled ဖြစ်တဲ့အခါ `sourceMap` က default အနေနဲ့ `true` ဖြစ်ပါလိမ့်မယ်။

```ts
import { getCallSites } from 'node:util';

interface Foo {
  foo: string;
}

const callSites = getCallSites({ sourceMap: true });

// With sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 7
// Column Number: 26

// Without sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 2
// Column Number: 26
```

```cjs
const { getCallSites } = require('node:util');

const callSites = getCallSites({ sourceMap: true });

// With sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 7
// Column Number: 26

// Without sourceMap:
// Function Name: ''
// Script Name: example.js
// Line Number: 2
// Column Number: 26
```

## `util.getSystemErrorName(err)`

* `err` {number}
* Returns: {string}

Node.js API တစ်ခုကနေ လာတဲ့ numeric error code တစ်ခုအတွက် string နာမည်ကို ပြန်ပေးပါတယ်။ Error codes နဲ့ error names တွေကြားက mapping က platform အလိုက် ကွဲပြားပါတယ်။ Common errors တွေရဲ့ နာမည်တွေအတွက် [Common System Errors][] ကို ကြည့်ပါ။

```js
fs.access('file/that/does/not/exist', (err) => {
  const name = util.getSystemErrorName(err.errno);
  console.error(name);  // ENOENT
});
```

## `util.getSystemErrorMap()`

* Returns: {Map}

Node.js API ကနေ ရရှိနိုင်တဲ့ system error codes အားလုံးရဲ့ Map တစ်ခုကို ပြန်ပေးပါတယ်။ Error codes နဲ့ error names တွေကြားက mapping က platform အလိုက် ကွဲပြားပါတယ်။ Common errors တွေရဲ့ နာမည်တွေအတွက် [Common System Errors][] ကို ကြည့်ပါ။

```js
fs.access('file/that/does/not/exist', (err) => {
  const errorMap = util.getSystemErrorMap();
  const name = errorMap.get(err.errno);
  console.error(name);  // ENOENT
});
```

## `util.getSystemErrorMessage(err)`

* `err` {number}
* Returns: {string}

Node.js API တစ်ခုကနေ လာတဲ့ numeric error code တစ်ခုအတွက် string message ကို ပြန်ပေးပါတယ်။ Error codes နဲ့ string messages တွေကြားက mapping က platform အလိုက် ကွဲပြားပါတယ်။

```js
fs.access('file/that/does/not/exist', (err) => {
  const message = util.getSystemErrorMessage(err.errno);
  console.error(message);  // No such file or directory
});
```

## `util.setTraceSigInt(enable)`

* `enable` {boolean}

`SIGINT` ပေါ်မှာ stack trace တစ်ခုကို ပုံနှိပ်တာကို enable သို့မဟုတ် disable လုပ်ပါတယ်။ ဒီ API က main thread ပေါ်မှာပဲ ရနိုင်ပါတယ်။

## `util.inherits(constructor, superConstructor)`

> Stability: 3 - Legacy: Use ES2015 class syntax and `extends` keyword instead.

* `constructor` {Function}
* `superConstructor` {Function}

`util.inherits()` ကို သုံးတာ မတိုက်တွန်းလိုပါဘူး။ Language level မှာ inheritance support ရဖို့ ES6 `class` နဲ့ `extends` keywords တွေကို သုံးပါ။ ဒါ့အပြင် style နှစ်ခုက [semantically incompatible][] ဖြစ်တာကိုလည်း သတိပြုပါ။

[constructor][] တစ်ခုကနေ နောက်တစ်ခုဆီကို prototype methods တွေကို အမွေဆက်ခံစေပါတယ်။ `constructor` ရဲ့ prototype ကို `superConstructor` ကနေ ဖန်တီးထားတဲ့ object အသစ်တစ်ခုအနေနဲ့ သတ်မှတ်ပါလိမ့်မယ်။

ဒါက အဓိကအားဖြင့် `Object.setPrototypeOf(constructor.prototype, superConstructor.prototype)` အပေါ်မှာ input validation အချို့ ထပ်ဖြည့်ပေးတာပါ။ ထပ်ဆောင်း အဆင်ပြေစေဖို့ — `superConstructor` ကို `constructor.super_` property ကနေ ဝင်ရောက်လို့ ရနိုင်အောင် လုပ်ပေးပါတယ်။

```js
const util = require('node:util');
const EventEmitter = require('node:events');

function MyStream() {
  EventEmitter.call(this);
}

util.inherits(MyStream, EventEmitter);

MyStream.prototype.write = function(data) {
  this.emit('data', data);
};

const stream = new MyStream();

console.log(stream instanceof EventEmitter); // true
console.log(MyStream.super_ === EventEmitter); // true

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('It works!'); // Received data: "It works!"
```

ES6 နမူနာ — `class` နဲ့ `extends` သုံးထားတာ:

```mjs
import EventEmitter from 'node:events';

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

```cjs
const EventEmitter = require('node:events');

class MyStream extends EventEmitter {
  write(data) {
    this.emit('data', data);
  }
}

const stream = new MyStream();

stream.on('data', (data) => {
  console.log(`Received data: "${data}"`);
});
stream.write('With ES6');
```

## `util.inspect(object[, options])`

## `util.inspect(object[, showHidden[, depth[, colors]]])`

* `object` {any} JavaScript primitive သို့မဟုတ် `Object` မဆို ဖြစ်နိုင်တယ်။
* `options` {Object}
  * `showHidden` {boolean} `true` ဆိုရင် object ရဲ့ non-enumerable symbols နဲ့ properties တွေကို formatted result ထဲမှာ ထည့်သွင်းပါတယ်။ {WeakMap} နဲ့ {WeakSet} entries တွေအပြင် user သတ်မှတ်ထားတဲ့ prototype properties တွေ (method properties ကလွဲပြီး) ကိုလည်း ထည့်သွင်းပါတယ်။ **Default:** `false`။
  * `depth` {number} `object` ကို format လုပ်နေစဉ် recurse လုပ်ရမယ့် အကြိမ်အရေအတွက်ကို သတ်မှတ်ပါတယ်။ ကြီးမားတဲ့ objects တွေကို inspect လုပ်ဖို့ အသုံးဝင်ပါတယ်။ Maximum call stack size အထိ recurse လုပ်ဖို့ `Infinity` သို့မဟုတ် `null` ကို ပေးပါ။
    **Default:** `2`။
  * `colors` {boolean} `true` ဆိုရင် output ကို ANSI color codes တွေနဲ့ style ချပါတယ်။ Colors တွေကို စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။ [Customizing `util.inspect` colors][] ကို ကြည့်ပါ။
    **Default:** `false`။
  * `customInspect` {boolean} `false` ဆိုရင် `[util.inspect.custom](depth, opts, inspect)` functions တွေကို invoke မလုပ်ပါဘူး။
    **Default:** `true`။
  * `showProxy` {boolean} `true` ဆိုရင် `Proxy` inspection မှာ [`target` and `handler`][] objects တွေ ပါဝင်ပါတယ်။ **Default:** `false`။
  * `maxArrayLength` {integer} Format လုပ်တဲ့အခါ ထည့်သွင်းရမယ့် `Array`, {TypedArray}, {Map}, {WeakMap}, နဲ့ {WeakSet} elements တွေရဲ့ အများဆုံး အရေအတွက်ကို သတ်မှတ်ပါတယ်။ Elements အားလုံးကို ပြသဖို့ `null` သို့မဟုတ် `Infinity` ပေးပါ။ Elements မပြသဖို့ `0` သို့မဟုတ် negative တန်ဖိုး ပေးပါ။ **Default:** `100`။
  * `maxStringLength` {integer} Format လုပ်တဲ့အခါ ထည့်သွင်းရမယ့် character အရေအတွက် အများဆုံးကို သတ်မှတ်ပါတယ်။ အားလုံးကို ပြသဖို့ `null` သို့မဟုတ် `Infinity` ပေးပါ။ Character မပြသဖို့ `0` သို့မဟုတ် negative တန်ဖိုး ပေးပါ။ **Default:** `10000`။
  * `breakLength` {integer} Input တန်ဖိုးတွေကို line မျိုးစုံပေါ်မှာ ခွဲဖော်ပြတဲ့ အလျားပါ။ Input ကို line တစ်ကြောင်းတည်းအနေနဲ့ format လုပ်ဖို့ (`compact` ကို `true` သို့မဟုတ် `1` နဲ့ အထက် ဘယ်နံပါတ်နဲ့မဆို ပေါင်းစပ်ပြီး) `Infinity` ပေးပါ။
    **Default:** `80`။
  * `compact` {boolean|integer} ဒါကို `false` အဖြစ် သတ်မှတ်ရင် object key တစ်ခုချင်းစီကို line အသစ်တစ်ခုပေါ်မှာ ဖော်ပြစေပါတယ်။ `breakLength` ထက် ပိုရှည်တဲ့ စာသားတွေမှာ line သစ်တွေပေါ် ချိုးဖြတ်ပါလိမ့်မယ်။ နံပါတ်တစ်ခုအနေနဲ့ သတ်မှတ်ထားရင် — properties အားလုံး `breakLength` ထဲ ဝင်သရွေ့ အတွင်းအကျဆုံး element `n` ခုကို line တစ်ကြောင်းတည်းပေါ်မှာ စုစည်းဖော်ပြပါတယ်။ Short array elements တွေကိုလည်း အုပ်စုဖွဲ့ ဖော်ပြပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် အောက်က ဥပမာကို ကြည့်ပါ။ **Default:** `3`။
  * `sorted` {boolean|Function} `true` သို့မဟုတ် function တစ်ခု အဖြစ် သတ်မှတ်ထားရင် — object တစ်ခုရဲ့ properties အားလုံး၊ `Set` နဲ့ `Map` entries တွေကို ရလာတဲ့ string ထဲမှာ စီစဉ်ဖော်ပြပါတယ်။ `true` ဆိုရင် [default sort][] ကို သုံးပါတယ်။ Function ဆိုရင် — [compare function][] အဖြစ် သုံးပါတယ်။
  * `getters` {boolean|string} `true` အဖြစ် သတ်မှတ်ထားရင် getters တွေကို inspect လုပ်ပါတယ်။ `'get'` အဖြစ် သတ်မှတ်ထားရင် — သက်ဆိုင်ရာ setter မရှိတဲ့ getters တွေကိုပဲ inspect လုပ်ပါတယ်။ `'set'` အဖြစ် သတ်မှတ်ထားရင် — သက်ဆိုင်ရာ setter ရှိတဲ့ getters တွေကိုပဲ inspect လုပ်ပါတယ်။ ဒါက getter function ပေါ် မူတည်ပြီး side effects တွေ ဖြစ်စေနိုင်ပါတယ်။
    **Default:** `false`။
  * `numericSeparator` {boolean} `true` အဖြစ် သတ်မှတ်ထားရင် bigints နဲ့ numbers အားလုံးမှာ ဂဏန်း သုံးလုံး တစ်ကြိမ်စီကို underscore တစ်ခုနဲ့ ခြားပါတယ်။
    **Default:** `false`။
* Returns: {string} `object` ရဲ့ ဖော်ပြချက်။

`util.inspect()` method က debugging အတွက် ရည်ရွယ်ထားတဲ့ `object` ရဲ့ string ဖော်ပြချက်တစ်ခုကို ပြန်ပေးပါတယ်။ `util.inspect` ရဲ့ output က ဘယ်အချိန်မဆို ပြောင်းလဲနိုင်ပြီး — programmatically အားကိုးအားထား ပြုလို့ မရပါဘူး။ ရလဒ်ကို ပြောင်းလဲနိုင်တဲ့ ထပ်ဆောင်း `options` တွေကို ပေးပို့နိုင်ပါတယ်။
`util.inspect()` က inspect လုပ်လိုက်တဲ့ တန်ဖိုးတစ်ခုအတွက် ခွဲခြားသိနိုင်တဲ့ tag တစ်ခု ပြုလုပ်ဖို့ constructor ရဲ့ နာမည် နဲ့/သို့မဟုတ် `Symbol.toStringTag` property ကို သုံးပါလိမ့်မယ်။

```js
class Foo {
  get [Symbol.toStringTag]() {
    return 'bar';
  }
}

class Bar {}

const baz = Object.create(null, { [Symbol.toStringTag]: { value: 'foo' } });

util.inspect(new Foo()); // 'Foo [bar] {}'
util.inspect(new Bar()); // 'Bar {}'
util.inspect(baz);       // '[foo] {}'
```

Circular references တွေက reference index တစ်ခုကို သုံးပြီး သူတို့ရဲ့ anchor ဆီကို ညွှန်ပြပါတယ်:

```mjs
import { inspect } from 'node:util';

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```

```cjs
const { inspect } = require('node:util');

const obj = {};
obj.a = [obj];
obj.b = {};
obj.b.inner = obj.b;
obj.b.obj = obj;

console.log(inspect(obj));
// <ref *1> {
//   a: [ [Circular *1] ],
//   b: <ref *2> { inner: [Circular *2], obj: [Circular *1] }
// }
```

အောက်ပါ ဥပမာက `util` object ရဲ့ properties အားလုံးကို inspect လုပ်ပါတယ်:

```mjs
import util from 'node:util';

console.log(util.inspect(util, { showHidden: true, depth: null }));
```

```cjs
const util = require('node:util');

console.log(util.inspect(util, { showHidden: true, depth: null }));
```

အောက်ပါ ဥပမာက `compact` option ရဲ့ အကျိုးသက်ရောက်မှုကို မီးမောင်းထိုးပြပါတယ်:

```mjs
import { inspect } from 'node:util';

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // A long line
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// Setting `compact` to false or an integer creates more reader friendly output.
console.log(inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// Setting `breakLength` to e.g. 150 will print the "Lorem ipsum" text in a
// single line.
```

```cjs
const { inspect } = require('node:util');

const o = {
  a: [1, 2, [[
    'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit, sed do ' +
      'eiusmod \ntempor incididunt ut labore et dolore magna aliqua.',
    'test',
    'foo']], 4],
  b: new Map([['za', 1], ['zb', 'test']]),
};
console.log(inspect(o, { compact: true, depth: 5, breakLength: 80 }));

// { a:
//   [ 1,
//     2,
//     [ [ 'Lorem ipsum dolor sit amet,\nconsectetur [...]', // A long line
//           'test',
//           'foo' ] ],
//     4 ],
//   b: Map(2) { 'za' => 1, 'zb' => 'test' } }

// Setting `compact` to false or an integer creates more reader friendly output.
console.log(inspect(o, { compact: false, depth: 5, breakLength: 80 }));

// {
//   a: [
//     1,
//     2,
//     [
//       [
//         'Lorem ipsum dolor sit amet,\n' +
//           'consectetur adipiscing elit, sed do eiusmod \n' +
//           'tempor incididunt ut labore et dolore magna aliqua.',
//         'test',
//         'foo'
//       ]
//     ],
//     4
//   ],
//   b: Map(2) {
//     'za' => 1,
//     'zb' => 'test'
//   }
// }

// Setting `breakLength` to e.g. 150 will print the "Lorem ipsum" text in a
// single line.
```

`showHidden` option က {WeakMap} နဲ့ {WeakSet} entries တွေကို inspect လုပ်နိုင်စေပါတယ်။ Entries တွေက `maxArrayLength` ထက် ပိုများနေရင် — ဘယ် entries တွေကို ဖော်ပြမလဲဆိုတာ အာမခံချက် မရှိပါဘူး။ ဆိုလိုတာက {WeakSet} entries တွေကို နှစ်ကြိမ် ပြန်ယူကြည့်ရင် မတူတဲ့ output တွေ ရနိုင်ပါတယ်။ ဒါ့အပြင် — strong references မကျန်တော့တဲ့ entries တွေကို ဘယ်အချိန်မဆို garbage collected လုပ်ခံရနိုင်ပါတယ်။

```mjs
import { inspect } from 'node:util';

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```

```cjs
const { inspect } = require('node:util');

const obj = { a: 1 };
const obj2 = { b: 2 };
const weakSet = new WeakSet([obj, obj2]);

console.log(inspect(weakSet, { showHidden: true }));
// WeakSet { { a: 1 }, { b: 2 } }
```

`sorted` option က object တစ်ခုရဲ့ property insertion order က `util.inspect()` ရဲ့ ရလဒ်ကို သက်ရောက်မှု မရှိစေဖို့ သေချာစေပါတယ်။

```mjs
import { inspect } from 'node:util';
import assert from 'node:assert';

const o1 = {
  b: [2, 3, 1],
  a: '`a` comes before `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` comes before `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` comes before `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` comes before `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```

```cjs
const { inspect } = require('node:util');
const assert = require('node:assert');

const o1 = {
  b: [2, 3, 1],
  a: '`a` comes before `b`',
  c: new Set([2, 3, 1]),
};
console.log(inspect(o1, { sorted: true }));
// { a: '`a` comes before `b`', b: [ 2, 3, 1 ], c: Set(3) { 1, 2, 3 } }
console.log(inspect(o1, { sorted: (a, b) => b.localeCompare(a) }));
// { c: Set(3) { 3, 2, 1 }, b: [ 2, 3, 1 ], a: '`a` comes before `b`' }

const o2 = {
  c: new Set([2, 1, 3]),
  a: '`a` comes before `b`',
  b: [2, 3, 1],
};
assert.strict.equal(
  inspect(o1, { sorted: true }),
  inspect(o2, { sorted: true }),
);
```

`numericSeparator` option က numbers အားလုံးမှာ ဂဏန်း သုံးလုံး တစ်ကြိမ်စီကို underscore တစ်ခု ထည့်ပေးပါတယ်။

```mjs
import { inspect } from 'node:util';

const thousand = 1000;
const million = 1000000;
const bigNumber = 123456789n;
const bigDecimal = 1234.12345;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```

```cjs
const { inspect } = require('node:util');

const thousand = 1000;
const million = 1000000;
const bigNumber = 123456789n;
const bigDecimal = 1234.12345;

console.log(inspect(thousand, { numericSeparator: true }));
// 1_000
console.log(inspect(million, { numericSeparator: true }));
// 1_000_000
console.log(inspect(bigNumber, { numericSeparator: true }));
// 123_456_789n
console.log(inspect(bigDecimal, { numericSeparator: true }));
// 1_234.123_45
```

`util.inspect()` က debugging အတွက် ရည်ရွယ်ထားတဲ့ synchronous method တစ်ခုပါ။ ၎င်းရဲ့ output အများဆုံး အလျားက ခန့်မှန်းခြေ 128 MiB ပါ။ ဒီထက် ပိုရှည်တဲ့ output ကို ဖြစ်ပေါ်စေမယ့် inputs တွေကို ဖြတ်တောက် (truncate) ပါလိမ့်မယ်။

### `util.inspect` အရောင်များကို စိတ်ကြိုက် ပြင်ဆင်ခြင်း (Customizing `util.inspect` colors)

(Color output enabled ဖြစ်ရင်) `util.inspect` ရဲ့ output ကို `util.inspect.styles` နဲ့ `util.inspect.colors` properties တွေကနေ တစ်ကမ္ဘာလုံး (globally) စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ်။

`util.inspect.styles` က style နာမည်တစ်ခုကို `util.inspect.colors` ထဲက color တစ်ခုနဲ့ ဆက်စပ်ပေးတဲ့ map တစ်ခုပါ။

Default styles နဲ့ ဆက်စပ်နေတဲ့ colors တွေကတော့:

* `bigint`: `yellow`
* `boolean`: `yellow`
* `date`: `magenta`
* `module`: `underline`
* `name`: (style မရှိ)
* `null`: `bold`
* `number`: `yellow`
* `regexp`: Character classes, groups, assertions နဲ့ အခြား အစိတ်အပိုင်းတွေကို ပိုဖတ်ရလွယ်အောင် အရောင်ခြယ်ပေးတဲ့ method တစ်ခုပါ။ အရောင်ခြယ်မှုကို စိတ်ကြိုက်ပြင်ဖို့ `colors` property ကို ပြောင်းပါ။ Default အနေနဲ့ `['red', 'green', 'yellow', 'cyan', 'magenta']` လို့ သတ်မှတ်ထားပြီး — လိုသလို ချိန်ညှိနိုင်ပါတယ်။ "depth" ပေါ် မူတည်ပြီး array ကို အထပ်ထပ် လှည့်လည် သုံးပါတယ်။
* `special`: `cyan` (e.g., `Proxies`)
* `string`: `green`
* `symbol`: `green`
* `undefined`: `grey`

အရောင်ခြယ်မှုက ANSI control codes တွေကို သုံးပါတယ် — ဒါတွေက terminal တိုင်းမှာ support ချင်မှ ရနိုင်ပါတယ်။ Color support ရှိမရှိ စစ်ဆေးဖို့ [`tty.hasColors()`][] ကို သုံးပါ။

Predefined control codes တွေကို အောက်မှာ ဖော်ပြထားပါတယ် ("Modifiers", "Foreground colors", နဲ့ "Background colors" ဆိုပြီး အုပ်စုခွဲထားပါတယ်)။

#### အဆင့်မြင့် စိတ်ကြိုက် အရောင်ခြယ်ခြင်း (Complex custom coloring)

Style တစ်ခုအနေနဲ့ method တစ်ခုကို သတ်မှတ်ဖို့ ဖြစ်နိုင်ပါတယ်။ ၎င်းက input ရဲ့ string ပြောင်းပြီးသား တန်ဖိုးကို လက်ခံရရှိပြီး — coloring active ဖြစ်ပြီး type ကို inspect လုပ်နေတဲ့အခါ invoke လုပ်ပါတယ်။

ဥပမာ: `util.inspect.styles.regexp(value)`

* `value` {string} Input type ရဲ့ string ဖော်ပြချက်။
* Returns: {string} `object` ရဲ့ ချိန်ညှိပြီးသား ဖော်ပြချက်။

#### ပြုပြင်မွမ်းမံမှုများ (Modifiers)

Modifier support က terminal အမျိုးမျိုးမှာ ကွဲပြားပါတယ်။ Support မလုပ်တဲ့ terminal တွေမှာ အများစုကို လျစ်လျူရှုပါလိမ့်မယ်။

* `reset` - (အရောင်) modifiers အားလုံးကို သူတို့ရဲ့ default တွေဆီ ပြန်သတ်မှတ်ပါတယ်
* **bold** - စာသားကို bold ဖြစ်စေပါတယ်
* _italic_ - စာသားကို italic ဖြစ်စေပါတယ်
* underline - စာသားကို underlined ဖြစ်စေပါတယ်
* ~~strikethrough~~ - စာသားရဲ့ အလယ်ကနေ အလျားလိုက် မျဉ်းတစ်ကြောင်း ဖြတ်ဆွဲပါတယ် (Alias: `strikeThrough`, `crossedout`, `crossedOut`)
* `hidden` - စာသားကို ပုံနှိပ်ပေမယ့် မမြင်ရအောင် လုပ်ပါတယ် (Alias: conceal)
* dim - အရောင် ပြင်းအားကို လျှော့ချပါတယ် (Alias: `faint`)
* overlined - စာသားအပေါ်မှာ မျဉ်းဆွဲပါတယ်
* blink - စာသားကို ခဏခဏ ပြ/ပျောက် လုပ်ပါတယ်
* inverse - Foreground နဲ့ background အရောင်တွေကို လဲလှယ်ပါတယ် (Alias: `swapcolors`, `swapColors`)
* doubleunderline - စာသားကို မျဉ်းနှစ်ကြောင်း double underlined ဖြစ်စေပါတယ် (Alias: `doubleUnderline`)
* framed - စာသားတစ်ဝိုက်မှာ frame တစ်ခု ဆွဲပါတယ်

#### Foreground အရောင်များ (Foreground colors)

* `black`
* `red`
* `green`
* `yellow`
* `blue`
* `magenta`
* `cyan`
* `white`
* `gray` (alias: `grey`, `blackBright`)
* `redBright`
* `greenBright`
* `yellowBright`
* `blueBright`
* `magentaBright`
* `cyanBright`
* `whiteBright`

#### Background အရောင်များ (Background colors)

* `bgBlack`
* `bgRed`
* `bgGreen`
* `bgYellow`
* `bgBlue`
* `bgMagenta`
* `bgCyan`
* `bgWhite`
* `bgGray` (alias: `bgGrey`, `bgBlackBright`)
* `bgRedBright`
* `bgGreenBright`
* `bgYellowBright`
* `bgBlueBright`
* `bgMagentaBright`
* `bgCyanBright`
* `bgWhiteBright`

### Object များပေါ်မှာ custom inspect function များ (Custom inspection functions on objects)

Objects တွေက သူတို့ကိုယ်ပိုင် [`[util.inspect.custom](depth, opts, inspect)`][util.inspect.custom] function ကို သတ်မှတ်နိုင်ပါတယ် — `util.inspect()` က object ကို inspect လုပ်တဲ့အခါ ဒီ function ကို invoke လုပ်ပြီး သူ့ရဲ့ ရလဒ်ကို သုံးပါတယ်။

```mjs
import { inspect } from 'node:util';

class Box {
  constructor(value) {
    this.value = value;
  }

  [inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // Five space padding because that's the size of "Box< ".
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

console.log(inspect(box));
// "Box< true >"
```

```cjs
const { inspect } = require('node:util');

class Box {
  constructor(value) {
    this.value = value;
  }

  [inspect.custom](depth, options, inspect) {
    if (depth < 0) {
      return options.stylize('[Box]', 'special');
    }

    const newOptions = Object.assign({}, options, {
      depth: options.depth === null ? null : options.depth - 1,
    });

    // Five space padding because that's the size of "Box< ".
    const padding = ' '.repeat(5);
    const inner = inspect(this.value, newOptions)
                  .replace(/\n/g, `\n${padding}`);
    return `${options.stylize('Box', 'special')}< ${inner} >`;
  }
}

const box = new Box(true);

console.log(inspect(box));
// "Box< true >"
```

Custom `[util.inspect.custom](depth, opts, inspect)` functions တွေက ပုံမှန်အားဖြင့် string တစ်ခုကို ပြန်ပေးပါတယ် — ဒါပေမယ့် `util.inspect()` က လိုက်လျောညီထွေစွာ format လုပ်ပေးမယ့် ဘယ် type တန်ဖိုးမဆို ပြန်ပေးနိုင်ပါတယ်။

```mjs
import { inspect } from 'node:util';

const obj = { foo: 'this will not show up in the inspect() output' };
obj[inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

console.log(inspect(obj));
// "{ bar: 'baz' }"
```

```cjs
const { inspect } = require('node:util');

const obj = { foo: 'this will not show up in the inspect() output' };
obj[inspect.custom] = (depth) => {
  return { bar: 'baz' };
};

console.log(inspect(obj));
// "{ bar: 'baz' }"
```

### `util.inspect.custom`

* Type: {symbol} Custom inspect functions တွေကို ကြေညာဖို့ သုံးနိုင်တဲ့ symbol တစ်ခု။

`util.inspect.custom` ကနေ ဝင်ရောက်လို့ ရတာအပြင် — ဒီ symbol ကို [registered globally][global symbol registry] လုပ်ထားပြီး — ဘယ် environment မှာမဆို `Symbol.for('nodejs.util.inspect.custom')` အနေနဲ့ ဝင်ရောက်နိုင်ပါတယ်။

ဒါက code တွေကို portable ပုံစံမျိုးနဲ့ ရေးနိုင်စေပါတယ် — ဒါကြောင့် custom inspect function ကို Node.js environment မှာ သုံးပြီး browser မှာ လျစ်လျူရှုခံရပါတယ်။ ပိုမို portable ဖြစ်စေဖို့ `util.inspect()` function ကိုယ်တိုင်ကို custom inspect function ဆီကို တတိယ argument အနေနဲ့ ပေးပို့ပါတယ်။

```js
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

class Password {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return 'xxxxxxxx';
  }

  [customInspectSymbol](depth, inspectOptions, inspect) {
    return `Password <${this.toString()}>`;
  }
}

const password = new Password('r0sebud');
console.log(password);
// Prints Password <xxxxxxxx>
```

နောက်ထပ် အသေးစိတ်တွေအတွက် [Custom inspection functions on Objects][] ကို ကြည့်ပါ။

### `util.inspect.defaultOptions`

`defaultOptions` တန်ဖိုးက `util.inspect` က သုံးတဲ့ default options တွေကို စိတ်ကြိုက် ပြင်ဆင်နိုင်စေပါတယ်။ `console.log` သို့မဟုတ် `util.format` လိုမျိုး `util.inspect` ဆီကို သွယ်ဝိုက်၍ ခေါ်တဲ့ functions တွေအတွက် အသုံးဝင်ပါတယ်။ တရားဝင်တဲ့ [`util.inspect()`][] options တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုပြီး ပါဝင်တဲ့ object တစ်ခုအနေနဲ့ သတ်မှတ်ရပါမယ်။ Option properties တွေကို တိုက်ရိုက် သတ်မှတ်တာကိုလည်း ထောက်ပံ့ပေးပါတယ်။

```mjs
import { inspect } from 'node:util';
const arr = Array(156).fill(0);

console.log(arr); // Logs the truncated array
inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // logs the full array
```

```cjs
const { inspect } = require('node:util');
const arr = Array(156).fill(0);

console.log(arr); // Logs the truncated array
inspect.defaultOptions.maxArrayLength = null;
console.log(arr); // logs the full array
```

## `util.isDeepStrictEqual(val1, val2[, options])`

* `val1` {any}
* `val2` {any}
* `skipPrototype` {boolean} `true` ဆိုရင် deep strict equality check လုပ်နေစဉ် prototype နဲ့ constructor နှိုင်းယှဉ်မှုကို ကျော်သွားပါတယ်။ **Default:** `false`။
* Returns: {boolean}

`val1` နဲ့ `val2` ကြားမှာ deep strict equality ရှိရင် `true` ကို ပြန်ပေးပါတယ်။ မဟုတ်ရင် `false` ကို ပြန်ပေးပါတယ်။

Default အနေနဲ့ deep strict equality မှာ object prototypes နဲ့ constructors တွေရဲ့ နှိုင်းယှဉ်မှု ပါဝင်ပါတယ်။ `skipPrototype` က `true` ဖြစ်တဲ့အခါ — prototype သို့မဟုတ် constructor မတူတဲ့ objects တွေကိုတောင် သူတို့ရဲ့ enumerable properties တွေ deeply strictly equal ဖြစ်နေရင် တူညီတယ်လို့ သတ်မှတ်နိုင်ပါတယ်။

```js
const util = require('node:util');

class Foo {
  constructor(a) {
    this.a = a;
  }
}

class Bar {
  constructor(a) {
    this.a = a;
  }
}

const foo = new Foo(1);
const bar = new Bar(1);

// Different constructors, same properties
console.log(util.isDeepStrictEqual(foo, bar));
// false

console.log(util.isDeepStrictEqual(foo, bar, true));
// true
```

Deep strict equality အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [`assert.deepStrictEqual()`][] ကို ကြည့်ပါ။

## Class: `util.MIMEType`

[the MIMEType class](https://bmeck.github.io/node-proposal-mime-api/) ရဲ့ implementation တစ်ခုပါ။

Browser conventions တွေနဲ့အညီ — `MIMEType` objects တွေရဲ့ properties အားလုံးကို object ပေါ်မှာ data properties အဖြစ် မဟုတ်ပဲ class prototype ပေါ်မှာ getters နဲ့ setters အဖြစ် implement လုပ်ထားပါတယ်။

MIME string ဆိုတာ အဓိပ္ပာယ်ရှိတဲ့ component အများအပြား ပါဝင်တဲ့ ဖွဲ့စည်းတည်ဆောက်ထားတဲ့ string တစ်ခုပါ။ Parse လုပ်လိုက်တဲ့အခါ — component တစ်ခုချင်းစီအတွက် properties တွေ ပါဝင်တဲ့ `MIMEType` object တစ်ခုကို ပြန်ပေးပါတယ်။

### `new MIMEType(input)`

* `input` {string} Parse လုပ်ရမယ့် input MIME

`input` ကို parse လုပ်ပြီး `MIMEType` object အသစ်တစ်ခုကို ဖန်တီးပါတယ်။

```mjs
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/plain');
```

```cjs
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/plain');
```

`input` က တရားဝင်တဲ့ MIME တစ်ခု မဟုတ်ဘူးဆိုရင် `TypeError` တစ်ခု throw လုပ်ပါလိမ့်မယ်။ ပေးထားတဲ့ တန်ဖိုးတွေကို strings အဖြစ် အတင်းအကြပ် ပြောင်းဖို့ ကြိုးစားမှာ ဖြစ်တာ သတိပြုပါ။ ဥပမာ:

```mjs
import { MIMEType } from 'node:util';
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```

```cjs
const { MIMEType } = require('node:util');
const myMIME = new MIMEType({ toString: () => 'text/plain' });
console.log(String(myMIME));
// Prints: text/plain
```

### `mime.type`

* Type: {string}

MIME ရဲ့ type အပိုင်းကို ရယူ (get) ပြီး သတ်မှတ် (set) ပေးပါတယ်။

```mjs
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

```cjs
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript');
console.log(myMIME.type);
// Prints: text
myMIME.type = 'application';
console.log(myMIME.type);
// Prints: application
console.log(String(myMIME));
// Prints: application/javascript
```

### `mime.subtype`

* Type: {string}

MIME ရဲ့ subtype အပိုင်းကို ရယူ (get) ပြီး သတ်မှတ် (set) ပေးပါတယ်။

```mjs
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

```cjs
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/ecmascript');
console.log(myMIME.subtype);
// Prints: ecmascript
myMIME.subtype = 'javascript';
console.log(myMIME.subtype);
// Prints: javascript
console.log(String(myMIME));
// Prints: text/javascript
```

### `mime.essence`

* Type: {string}

MIME ရဲ့ essence ကို ရယူပေးပါတယ်။ ဒီ property က read only ပါ။ MIME ကို ပြောင်းလဲဖို့ `mime.type` သို့မဟုတ် `mime.subtype` ကို သုံးပါ။

```mjs
import { MIMEType } from 'node:util';

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

```cjs
const { MIMEType } = require('node:util');

const myMIME = new MIMEType('text/javascript;key=value');
console.log(myMIME.essence);
// Prints: text/javascript
myMIME.type = 'application';
console.log(myMIME.essence);
// Prints: application/javascript
console.log(String(myMIME));
// Prints: application/javascript;key=value
```

### `mime.params`

* Type: {MIMEParams}

MIME ရဲ့ parameters တွေကို ဖော်ပြတဲ့ [`MIMEParams`][] object ကို ရယူပေးပါတယ်။ ဒီ property က read-only ပါ။ အသေးစိတ်အတွက် [`MIMEParams`][] documentation ကို ကြည့်ပါ။

### `mime.toString()`

* Returns: {string}

`MIMEType` object ပေါ်က `toString()` method က serialized MIME ကို ပြန်ပေးပါတယ်။

Standard နဲ့ ကိုက်ညီမှု လိုအပ်ချက်ကြောင့် — ဒီ method က MIME ရဲ့ serialization process ကို users တွေ စိတ်ကြိုက် ပြင်ဆင်ခွင့် မပြုပါဘူး။

### `mime.toJSON()`

* Returns: {string}

[`mime.toString()`][] ရဲ့ alias တစ်ခုပါ။

`MIMEType` object တစ်ခုကို [`JSON.stringify()`][] နဲ့ serialize လုပ်တဲ့အခါ ဒီ method ကို အလိုအလျောက် ခေါ်ပါတယ်။

```mjs
import { MIMEType } from 'node:util';

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

```cjs
const { MIMEType } = require('node:util');

const myMIMES = [
  new MIMEType('image/png'),
  new MIMEType('image/gif'),
];
console.log(JSON.stringify(myMIMES));
// Prints: ["image/png", "image/gif"]
```

### `MIMEType.parse(string)`

* `string` {string} Parse လုပ်ရမယ့် input MIME
* Returns: {MIMEType|null}

ပေးထားတဲ့ `string` ကို MIMEType အဖြစ် parse လုပ်ဖို့ ကြိုးစားပါတယ်။ String ကို parse မလုပ်နိုင်ဘူးဆိုရင် `null` ကို ပြန်ပေးပါတယ်။

## Class: `util.MIMEParams`

`MIMEParams` API က `MIMEType` တစ်ခုရဲ့ parameters တွေဆီကို read နဲ့ write ဝင်ရောက်ခွင့် ပေးပါတယ်။

### `new MIMEParams()`

Parameters ဗလာတွေနဲ့ `MIMEParams` object အသစ်တစ်ခုကို ဖန်တီးပါတယ်

```mjs
import { MIMEParams } from 'node:util';

const myParams = new MIMEParams();
```

```cjs
const { MIMEParams } = require('node:util');

const myParams = new MIMEParams();
```

### `mimeParams.delete(name)`

* `name` {string}

နာမည် `name` ဖြစ်တဲ့ name-value pairs အားလုံးကို ဖယ်ရှားပါတယ်။

### `mimeParams.entries()`

* Returns: {Iterator}

Parameters တွေထဲက name-value pair တစ်ခုချင်းစီအပေါ်မှာ iterator တစ်ခုကို ပြန်ပေးပါတယ်။ Iterator ရဲ့ item တစ်ခုချင်းစီက JavaScript `Array` တစ်ခုပါ။ Array ရဲ့ ပထမ item က `name` ဖြစ်ပြီး — ဒုတိယ item က `value` ပါ။

### `mimeParams.get(name)`

* `name` {string}
* Returns: {string | null} ပေးထားတဲ့ `name` နဲ့ name-value pair မရှိဘူးဆိုရင် string သို့မဟုတ် `null`

နာမည် `name` ဖြစ်တဲ့ ပထမဆုံး name-value pair ရဲ့ တန်ဖိုးကို ပြန်ပေးပါတယ်။ အဲဒီလို pairs တွေ မရှိဘူးဆိုရင် `null` ကို ပြန်ပေးပါတယ်။

### `mimeParams.has(name)`

* `name` {string}
* Returns: {boolean}

နာမည် `name` ဖြစ်တဲ့ name-value pair အနည်းဆုံး တစ်ခု ရှိနေရင် `true` ကို ပြန်ပေးပါတယ်။

### `mimeParams.keys()`

* Returns: {Iterator}

Name-value pair တစ်ခုချင်းစီရဲ့ နာမည်တွေအပေါ်မှာ iterator တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

```cjs
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   bar
```

### `mimeParams.set(name, value)`

* `name` {string}
* `value` {string}

`MIMEParams` object ထဲမှာ `name` နဲ့ ဆက်စပ်နေတဲ့ တန်ဖိုးကို `value` အဖြစ် သတ်မှတ်ပါတယ်။ နာမည် `name` ဖြစ်တဲ့ name-value pairs တွေ အရင်ရှိပြီးသား ဆိုရင် — အဲဒီ pairs တွေထဲက ပထမဆုံး pair ရဲ့ တန်ဖိုးကို `value` အဖြစ် သတ်မှတ်ပါတယ်။

```mjs
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

```cjs
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=0;bar=1');
params.set('foo', 'def');
params.set('baz', 'xyz');
console.log(params.toString());
// Prints: foo=def;bar=1;baz=xyz
```

### `mimeParams.values()`

* Returns: {Iterator}

Name-value pair တစ်ခုချင်းစီရဲ့ တန်ဖိုးတွေအပေါ်မှာ iterator တစ်ခုကို ပြန်ပေးပါတယ်။

### `mimeParams[Symbol.iterator]()`

* Returns: {Iterator}

[`mimeParams.entries()`][] ရဲ့ alias တစ်ခုပါ။

```mjs
import { MIMEType } from 'node:util';

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```

```cjs
const { MIMEType } = require('node:util');

const { params } = new MIMEType('text/plain;foo=bar;xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```

## `util.parseArgs([config])`

* `config` {Object} Parsing လုပ်ဖို့ arguments တွေ ပေးအပ်ဖို့နဲ့ parser ကို configure လုပ်ဖို့ သုံးပါတယ်။
  `config` က အောက်ပါ properties တွေကို ထောက်ပံ့ပေးပါတယ်:
  * `args` {string\[]} Argument strings တွေရဲ့ array တစ်ခု။ **Default:** `execPath` နဲ့ `filename` တွေကို ဖယ်ရှားထားတဲ့ `process.argv` ပါ။
  * `options` {Object} Parser က သိတဲ့ arguments တွေကို ဖော်ပြဖို့ သုံးပါတယ်။ `options` ရဲ့ keys တွေက options တွေရဲ့ long names တွေ ဖြစ်ပြီး — values တွေက
    အောက်ပါ properties တွေကို လက်ခံတဲ့ {Object} တစ်ခု ဖြစ်ပါတယ်:
    * `type` {string} Argument ရဲ့ type ပါ — `boolean` သို့မဟုတ် `string` ဖြစ်ရပါမယ်။
    * `multiple` {boolean} ဒီ option ကို အကြိမ်များစွာ ပေးအပ်လို့ ရမရ ကို သတ်မှတ်ပါတယ်။ `true` ဆိုရင် — တန်ဖိုးအားလုံးကို array တစ်ခုထဲမှာ စုဆောင်းပါလိမ့်မယ်။
      `false` ဆိုရင် — option အတွက် တန်ဖိုးတွေက last-wins (နောက်ဆုံး ပေးလိုက်တာက အနိုင်ရ) ဖြစ်ပါတယ်။ **Default:** `false`။
    * `short` {string} Option အတွက် character တစ်လုံးတည်း alias တစ်ခုပါ။
    * `default` {string | boolean | string\[] | boolean\[]} Parse လုပ်ရမယ့် arguments တွေထဲမှာ ဒီ option မပါဘူးဆိုရင် — option ဆီကို သတ်မှတ်ပေးရမယ့် တန်ဖိုးပါ။
      အဲဒီတန်ဖိုးက `type` property က သတ်မှတ်ထားတဲ့ type နဲ့ ကိုက်ညီရပါမယ်။ `multiple` က `true` ဆိုရင် — array တစ်ခု ဖြစ်ရပါမယ်။ Option က parse လုပ်ရမယ့် arguments တွေထဲမှာ ပါနေရင်တော့ —
      ပေးထားတဲ့ တန်ဖိုးက falsy ဖြစ်နေရင်တောင် default value ကို အသုံးမပြုပါဘူး။
  * `strict` {boolean} Unknown arguments တွေ တွေ့ရှိရတဲ့အခါ သို့မဟုတ် `options` ထဲမှာ configure လုပ်ထားတဲ့ `type` နဲ့ မကိုက်ညီတဲ့ arguments တွေ ပေးအပ်ခံရတဲ့အခါ — error တစ်ခုကို
    throw လုပ်သင့်လားဆိုတာ သတ်မှတ်ပါတယ်။
    **Default:** `true`။
  * `allowPositionals` {boolean} ဒီ command က positional arguments တွေကို လက်ခံမလား ဆိုတာပါ။
    **Default:** `strict` က `true` ဆိုရင် `false` ဖြစ်ပြီး — မဟုတ်ရင် `true` ပါ။
  * `allowNegative` {boolean} `true` ဆိုရင် — option နာမည်ရဲ့ ရှေ့မှာ `--no-` ကို prefix လုပ်ပြီး boolean options တွေကို `false` အဖြစ် အတိအကျ သတ်မှတ်ခွင့် ပြုပါတယ်။
    **Default:** `false`။
  * `tokens` {boolean} Parse လုပ်ပြီးသား tokens တွေကို ပြန်ပေးပါတယ်။ ထပ်ဆောင်း checks တွေ ထည့်တာကအစ — tokens တွေကို နည်းလမ်းအမျိုးမျိုးနဲ့ ပြန်လည် လုပ်ဆောင်တာအထိ — built-in behavior ကို တိုးချဲ့ဖို့
    အသုံးဝင်ပါတယ်။
    **Default:** `false`။

* Returns: {Object} Parse လုပ်ပြီးသား command-line arguments တွေပါ:
  * `values` {Object} Parse လုပ်ထားတဲ့ option names တွေနဲ့ သူတို့ရဲ့ {string} သို့မဟုတ် {boolean} တန်ဖိုးတွေရဲ့ mapping တစ်ခု။
  * `positionals` {string\[]} Positional arguments တွေ။
  * `tokens` {Object\[] | undefined} [parseArgs tokens](#parseargs-tokens) section ကို ကြည့်ပါ။ `config` ထဲမှာ `tokens: true` ပါမှသာ ပြန်ပေးပါတယ်။

`process.argv` ကို တိုက်ရိုက် ထိတွေ့ သုံးစွဲတာထက် — command-line argument parsing အတွက် ပိုမို high-level API တစ်ခုကို ပေးအပ်ပါတယ်။ မျှော်လင့်ထားတဲ့ arguments တွေအတွက် specification တစ်ခုကို ယူပြီး — parse လုပ်ပြီးသား options နဲ့ positionals တွေပါတဲ့ structured object တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { parseArgs } from 'node:util';
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```

```cjs
const { parseArgs } = require('node:util');
const args = ['-f', '--bar', 'b'];
const options = {
  foo: {
    type: 'boolean',
    short: 'f',
  },
  bar: {
    type: 'string',
  },
};
const {
  values,
  positionals,
} = parseArgs({ args, options });
console.log(values, positionals);
// Prints: [Object: null prototype] { foo: true, bar: 'b' } []
```

### `parseArgs` `tokens`

Configuration ထဲမှာ `tokens: true` လို့ သတ်မှတ်ခြင်းအားဖြင့် — custom behaviors တွေ ထည့်သွင်းဖို့ အသေးစိတ် parse information တွေကို ရရှိနိုင်ပါတယ်။ ပြန်ပေးလိုက်တဲ့ tokens တွေမှာ အောက်ပါအတိုင်း ဖော်ပြပေးတဲ့ properties တွေ ရှိပါတယ်:

* all tokens
  * `kind` {string} 'option', 'positional' သို့မဟုတ် 'option-terminator' ထဲက တစ်ခု ဖြစ်ပါတယ်။
  * `index` {number} Token ပါဝင်တဲ့ `args` ထဲက element ရဲ့ index ပါ။ ဒါကြောင့် token တစ်ခုရဲ့ source argument က `args[token.index]` ဖြစ်ပါတယ်။
* option tokens
  * `name` {string} Option ရဲ့ long name ပါ။
  * `rawName` {string} `--foo` ရဲ့ `-f` လိုမျိုး — option ကို args တွေထဲမှာ သုံးထားတဲ့ ပုံစံပါ။
  * `value` {string | undefined} Args တွေထဲမှာ သတ်မှတ်ပေးထားတဲ့ option value ပါ။ Boolean options တွေအတွက် undefined ဖြစ်ပါတယ်။
  * `inlineValue` {boolean | undefined} `--foo=bar` လိုမျိုး — option value ကို inline အနေနဲ့ သတ်မှတ်ထားလားဆိုတာ ဖော်ပြပါတယ်။
* positional tokens
  * `value` {string} Args တွေထဲမှာ positional argument ရဲ့ တန်ဖိုး (ဆိုလိုတာက `args[index]`) ပါ။
* option-terminator token

ပြန်ပေးလိုက်တဲ့ tokens တွေက input args တွေထဲမှာ တွေ့ရှိရတဲ့ အစဉ်လိုက် ဖြစ်ပါတယ်။ Args တွေထဲမှာ တစ်ကြိမ်ထက်ပိုပြီး ပါဝင်နေတဲ့ options တွေက — အသုံးပြုမှု တစ်ခုချင်းစီအတွက် token တစ်ခုစီ ထုတ်ပေးပါတယ်။ `-xy` လိုမျိုး short option အုပ်စုတွေက option တစ်ခုချင်းစီအတွက် token အဖြစ် ချဲ့ထွင်ပေးပါတယ်။ ဒါကြောင့် `-xxx` က token သုံးခုကို ထုတ်ပေးပါတယ်။

ဥပမာ — `--no-color` လိုမျိုး negated option တစ်ခုအတွက် support ထည့်သွင်းဖို့ဆိုရင် (option ရဲ့ type က `boolean` ဖြစ်တဲ့အခါ `allowNegative` က ဒါကို ထောက်ပံ့ပေးပါတယ်) — ပြန်ပေးလိုက်တဲ့ tokens တွေကို ပြန်လည် လုပ်ဆောင်ပြီး negated option အတွက် သိမ်းဆည်းထားတဲ့ တန်ဖိုးကို ပြောင်းလဲနိုင်ပါတယ်။

```mjs
import { parseArgs } from 'node:util';

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocess the option tokens and overwrite the returned values.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Store foo:false for --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Resave value so last one wins if both --foo and --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

```cjs
const { parseArgs } = require('node:util');

const options = {
  'color': { type: 'boolean' },
  'no-color': { type: 'boolean' },
  'logfile': { type: 'string' },
  'no-logfile': { type: 'boolean' },
};
const { values, tokens } = parseArgs({ options, tokens: true });

// Reprocess the option tokens and overwrite the returned values.
tokens
  .filter((token) => token.kind === 'option')
  .forEach((token) => {
    if (token.name.startsWith('no-')) {
      // Store foo:false for --no-foo
      const positiveName = token.name.slice(3);
      values[positiveName] = false;
      delete values[token.name];
    } else {
      // Resave value so last one wins if both --foo and --no-foo.
      values[token.name] = token.value ?? true;
    }
  });

const color = values.color;
const logfile = values.logfile ?? 'default.log';

console.log({ logfile, color });
```

Negated options တွေရဲ့ အသုံးပြုပုံနဲ့ — option တစ်ခုကို နည်းလမ်းမျိုးစုံနဲ့ သုံးထားရင် နောက်ဆုံး သုံးလိုက်တဲ့ တစ်ခုက အနိုင်ရတာကို ပြသတဲ့ ဥပမာတစ်ခုပါ။

```console
$ node negate.js
{ logfile: 'default.log', color: undefined }
$ node negate.js --no-logfile --no-color
{ logfile: false, color: false }
$ node negate.js --logfile=test.log --color
{ logfile: 'test.log', color: true }
$ node negate.js --no-logfile --logfile=test.log --color --no-color
{ logfile: 'test.log', color: false }
```

## `util.parseEnv(content)`

* `content` {string}

`.env` file တစ်ခုရဲ့ raw contents တွေပါ။

* Returns: {Object}

ဥပမာ `.env` file တစ်ခုကို ကြည့်ကြည့်ရအောင်:

```cjs
const { parseEnv } = require('node:util');

parseEnv('HELLO=world\nHELLO=oh my\n');
// Returns: { HELLO: 'oh my' }
```

```mjs
import { parseEnv } from 'node:util';

parseEnv('HELLO=world\nHELLO=oh my\n');
// Returns: { HELLO: 'oh my' }
```

## `util.promisify(original)`

* `original` {Function}
* Returns: {Function}

အသုံးများတဲ့ error-first callback style ကို လိုက်နာတဲ့ function တစ်ခုကို ယူပါတယ် — ဆိုလိုတာက နောက်ဆုံး argument အနေနဲ့ `(err, value) => ...` callback တစ်ခုကို လက်ခံတဲ့ function ပါ။ ပြီးတော့ promises တွေကို ပြန်ပေးတဲ့ version တစ်ခုကို ပြန်ပေးပါတယ်။

```mjs
import { promisify } from 'node:util';
import { stat } from 'node:fs';

const promisifiedStat = promisify(stat);
promisifiedStat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
});
```

```cjs
const { promisify } = require('node:util');
const { stat } = require('node:fs');

const promisifiedStat = promisify(stat);
promisifiedStat('.').then((stats) => {
  // Do something with `stats`
}).catch((error) => {
  // Handle the error.
});
```

ဒါမှမဟုတ် — `async function` တွေကို သုံးပြီး ညီမျှတဲ့ နည်းလမ်းနဲ့ ရေးနိုင်ပါတယ်:

```mjs
import { promisify } from 'node:util';
import { stat } from 'node:fs';

const promisifiedStat = promisify(stat);

async function callStat() {
  const stats = await promisifiedStat('.');
  console.log(`This directory is owned by ${stats.uid}`);
}

callStat();
```

```cjs
const { promisify } = require('node:util');
const { stat } = require('node:fs');

const promisifiedStat = promisify(stat);

async function callStat() {
  const stats = await promisifiedStat('.');
  console.log(`This directory is owned by ${stats.uid}`);
}

callStat();
```

`original[util.promisify.custom]` property တစ်ခု ရှိနေရင် — `promisify` က ၎င်းရဲ့ တန်ဖိုးကို ပြန်ပေးပါလိမ့်မယ်။ [Custom promisified functions][] ကို ကြည့်ပါ။

`promisify()` က `original` ဟာ ကိစ္စအားလုံးမှာ နောက်ဆုံး argument အနေနဲ့ callback တစ်ခုကို လက်ခံတဲ့ function တစ်ခု ဖြစ်တယ်လို့ ယူဆပါတယ်။ `original` က function တစ်ခု မဟုတ်ဘူးဆိုရင် — `promisify()` က error တစ်ခု throw လုပ်ပါလိမ့်မယ်။ `original` က function တစ်ခု ဖြစ်ပေမယ့် ၎င်းရဲ့ နောက်ဆုံး argument က error-first callback တစ်ခု မဟုတ်ဘူးဆိုရင် — error-first callback တစ်ခုကိုပဲ ၎င်းရဲ့ နောက်ဆုံး argument အဖြစ် ပေးပို့ခံရဦးမှာ ဖြစ်ပါတယ်။

`this` ကို သုံးတဲ့ class methods တွေ သို့မဟုတ် အခြား methods တွေအပေါ်မှာ `promisify()` ကို သုံးမယ်ဆိုရင် — အထူး ကိုင်တွယ်မှု မရှိရင် မျှော်လင့်ထားသလို အလုပ်မလုပ်နိုင်ပါဘူး:

```mjs
import { promisify } from 'node:util';

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = promisify(foo.bar);
// TypeError: Cannot read properties of undefined (reading 'a')
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

```cjs
const { promisify } = require('node:util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = promisify(foo.bar);
// TypeError: Cannot read properties of undefined (reading 'a')
// naiveBar().then(a => console.log(a));

naiveBar.call(foo).then((a) => console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) => console.log(a)); // '42'
```

### စိတ်ကြိုက် promisified function များ (Custom promisified functions)

`util.promisify.custom` symbol ကို သုံးပြီး — [`util.promisify()`][] ရဲ့ ပြန်ပေးတဲ့ တန်ဖိုးကို override လုပ်နိုင်ပါတယ်:

```mjs
import { promisify } from 'node:util';

function doSomething(foo, callback) {
  // ...
}

doSomething[promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = promisify(doSomething);
console.log(promisified === doSomething[promisify.custom]);
// prints 'true'
```

```cjs
const { promisify } = require('node:util');

function doSomething(foo, callback) {
  // ...
}

doSomething[promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = promisify(doSomething);
console.log(promisified === doSomething[promisify.custom]);
// prints 'true'
```

မူရင်း function က error-first callback တစ်ခုကို နောက်ဆုံး argument အဖြစ် လက်ခံတဲ့ standard format ကို မလိုက်နာတဲ့ ကိစ္စတွေမှာ ဒါက အသုံးဝင်နိုင်ပါတယ်။

ဥပမာ — `(foo, onSuccessCallback, onErrorCallback)` တွေကို လက်ခံတဲ့ function တစ်ခုနဲ့ ဆိုရင်:

```js
doSomething[util.promisify.custom] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

`promisify.custom` က define လုပ်ထားပေမယ့် function တစ်ခု မဟုတ်ဘူးဆိုရင် — `promisify()` က error တစ်ခု throw လုပ်ပါလိမ့်မယ်။

### `util.promisify.custom`

* Type: {symbol} — function တွေရဲ့ custom promisified variants တွေကို ကြေညာဖို့ သုံးနိုင်တဲ့ symbol တစ်ခုပါ။ [Custom promisified functions][] ကို ကြည့်ပါ။

`util.promisify.custom` ကနေ ဝင်ရောက်လို့ ရတာအပြင် — ဒီ symbol ကို [registered globally][global symbol registry] လုပ်ထားပြီး — ဘယ် environment မှာမဆို `Symbol.for('nodejs.util.promisify.custom')` အနေနဲ့ ဝင်ရောက်နိုင်ပါတယ်။

ဥပမာ — `(foo, onSuccessCallback, onErrorCallback)` တွေကို လက်ခံတဲ့ function တစ်ခုနဲ့ ဆိုရင်:

```js
const kCustomPromisifiedSymbol = Symbol.for('nodejs.util.promisify.custom');

doSomething[kCustomPromisifiedSymbol] = (foo) => {
  return new Promise((resolve, reject) => {
    doSomething(foo, resolve, reject);
  });
};
```

## `util.stripVTControlCharacters(str)`

* `str` {string}
* Returns: {string}

ANSI escape codes တွေ ဖယ်ရှားထားတဲ့ `str` ကို ပြန်ပေးပါတယ်။

```js
console.log(util.stripVTControlCharacters('\u001B[4mvalue\u001B[0m'));
// Prints "value"
```

## `util.styleText(format, text[, options])`

* `format` {string | Array} Text format တစ်ခု သို့မဟုတ် — `util.inspect.colors` ထဲမှာ define လုပ်ထားတဲ့ text formats တွေရဲ့ Array တစ်ခု — ဒါမှမဟုတ် `#RGB` သို့မဟုတ် `#RRGGBB` ပုံစံရှိတဲ့ hex color တစ်ခု ဖြစ်ပါတယ်။
* `text` {string} Format လုပ်ရမယ့် စာသားပါ။
* `options` {Object}
  * `validateStream` {boolean} `true` ဆိုရင် — `stream` က colors တွေကို ကိုင်တွယ်နိုင်လားဆိုတာ စစ်ဆေးပါတယ်။ **Default:** `true`။
  * `stream` {Stream} Color ခြယ်လို့ ရမရ စစ်ဆေးခံရမယ့် stream တစ်ခုပါ။ **Default:** `process.stdout`။

ဒီ function က terminal တစ်ခုမှာ ပုံနှိပ်ဖို့အတွက် ပေးပို့လိုက်တဲ့ `format` ကို ထည့်သွင်း စဉ်းစားပြီး — formatted text တစ်ခုကို ပြန်ပေးပါတယ်။ Terminal ရဲ့ စွမ်းဆောင်ရည်တွေကို သတိပြုနိုင်ပြီး — `NO_COLOR`, `NODE_DISABLE_COLORS` နဲ့ `FORCE_COLOR` environment variables တွေကနေ သတ်မှတ်ထားတဲ့ configuration အတိုင်း လုပ်ဆောင်ပါတယ်။

```mjs
import { styleText } from 'node:util';
import { stderr } from 'node:process';

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Validate if process.stderr has TTY
  { stream: stderr },
);
console.error(errorMessage);
```

```cjs
const { styleText } = require('node:util');
const { stderr } = require('node:process');

const successMessage = styleText('green', 'Success!');
console.log(successMessage);

const errorMessage = styleText(
  'red',
  'Error! Error!',
  // Validate if process.stderr has TTY
  { stream: stderr },
);
console.error(errorMessage);
```

`util.inspect.colors` က `italic` နဲ့ `underline` လိုမျိုး text formats တွေကိုလည်း ပေးအပ်ပြီး — နှစ်ခုလုံးကို ပေါင်းစပ် သုံးနိုင်ပါတယ်:

```cjs
console.log(
  util.styleText(['underline', 'italic'], 'My italic underlined message'),
);
```

Formats တွေရဲ့ array တစ်ခုကို ပေးပို့တဲ့အခါ — အသုံးချတဲ့ formats တွေရဲ့ အစဉ်က ဘယ်ကနေ ညာဘက်ကို ဖြစ်တာမို့ — နောက် style တစ်ခုက အရင် style တစ်ခုကို overwrite (အစားထိုး) လုပ်သွားနိုင်ပါတယ်။

```cjs
console.log(
  util.styleText(['red', 'green'], 'text'), // green
);
```

`none` ဆိုတဲ့ အထူး format တန်ဖိုးက စာသားကို ဘာ styling မှ ထပ်ဆောင်း အသုံးမချပါဘူး။

ကြိုတင် သတ်မှတ်ထားတဲ့ color names တွေအပြင် — `util.styleText()` က ANSI TrueColor (24-bit) escape sequences တွေကို သုံးတဲ့ hex color strings တွေကိုလည်း ထောက်ပံ့ပေးပါတယ်။ Hex colors တွေကို 3-digit (`#RGB`) သို့မဟုတ် 6-digit (`#RRGGBB`) format နဲ့ သတ်မှတ်နိုင်ပါတယ်:

```mjs
import { styleText } from 'node:util';

// 6-digit hex color
console.log(styleText('#ff5733', 'Orange text'));

// 3-digit hex color (shorthand)
console.log(styleText('#f00', 'Red text'));
```

```cjs
const { styleText } = require('node:util');

// 6-digit hex color
console.log(styleText('#ff5733', 'Orange text'));

// 3-digit hex color (shorthand)
console.log(styleText('#f00', 'Red text'));
```

Formats တွေရဲ့ စာရင်း အပြည့်အစုံကို [modifiers][] မှာ တွေ့နိုင်ပါတယ်။

## Class: `util.TextDecoder`

[WHATWG Encoding Standard][] `TextDecoder` API ရဲ့ implementation တစ်ခုပါ။

```js
const decoder = new TextDecoder();
const u8arr = new Uint8Array([72, 101, 108, 108, 111]);
console.log(decoder.decode(u8arr)); // Hello
```

### WHATWG ထောက်ပံ့ပေးထားသော encodings များ (WHATWG supported encodings)

[WHATWG Encoding Standard][] အရ — `TextDecoder` API က ထောက်ပံ့ပေးတဲ့ encodings တွေကို အောက်က tables တွေမှာ ဖော်ပြထားပါတယ်။ Encoding တစ်ခုချင်းစီအတွက် — alias တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုပြီး သုံးနိုင်ပါတယ်။

Node.js build configuration အမျိုးမျိုးက encodings အစုအဝေး အမျိုးမျိုးကို ထောက်ပံ့ပေးပါတယ်။ ([Internationalization][] ကို ကြည့်ပါ)

#### Full ICU data နဲ့ဆိုရင် default အနေနဲ့ ထောက်ပံ့ပေးတဲ့ encodings များ (Encodings supported by default (with full ICU data))

| Encoding           | Aliases                                                                                                                                                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'ibm866'`         | `'866'`, `'cp866'`, `'csibm866'`                                                                                                                                                                                                    |
| `'iso-8859-2'`     | `'csisolatin2'`, `'iso-ir-101'`, `'iso8859-2'`, `'iso88592'`, `'iso_8859-2'`, `'iso_8859-2:1987'`, `'l2'`, `'latin2'`                                                                                                               |
| `'iso-8859-3'`     | `'csisolatin3'`, `'iso-ir-109'`, `'iso8859-3'`, `'iso88593'`, `'iso_8859-3'`, `'iso_8859-3:1988'`, `'l3'`, `'latin3'`                                                                                                               |
| `'iso-8859-4'`     | `'csisolatin4'`, `'iso-ir-110'`, `'iso8859-4'`, `'iso88594'`, `'iso_8859-4'`, `'iso_8859-4:1988'`, `'l4'`, `'latin4'`                                                                                                               |
| `'iso-8859-5'`     | `'csisolatincyrillic'`, `'cyrillic'`, `'iso-ir-144'`, `'iso8859-5'`, `'iso88595'`, `'iso_8859-5'`, `'iso_8859-5:1988'`                                                                                                              |
| `'iso-8859-6'`     | `'arabic'`, `'asmo-708'`, `'csiso88596e'`, `'csiso88596i'`, `'csisolatinarabic'`, `'ecma-114'`, `'iso-8859-6-e'`, `'iso-8859-6-i'`, `'iso-ir-127'`, `'iso8859-6'`, `'iso88596'`, `'iso_8859-6'`, `'iso_8859-6:1987'`                |
| `'iso-8859-7'`     | `'csisolatingreek'`, `'ecma-118'`, `'elot_928'`, `'greek'`, `'greek8'`, `'iso-ir-126'`, `'iso8859-7'`, `'iso88597'`, `'iso_8859-7'`, `'iso_8859-7:1987'`, `'sun_eu_greek'`                                                          |
| `'iso-8859-8'`     | `'csiso88598e'`, `'csisolatinhebrew'`, `'hebrew'`, `'iso-8859-8-e'`, `'iso-ir-138'`, `'iso8859-8'`, `'iso88598'`, `'iso_8859-8'`, `'iso_8859-8:1988'`, `'visual'`                                                                   |
| `'iso-8859-8-i'`   | `'csiso88598i'`, `'logical'`                                                                                                                                                                                                        |
| `'iso-8859-10'`    | `'csisolatin6'`, `'iso-ir-157'`, `'iso8859-10'`, `'iso885910'`, `'l6'`, `'latin6'`                                                                                                                                                  |
| `'iso-8859-13'`    | `'iso8859-13'`, `'iso885913'`                                                                                                                                                                                                       |
| `'iso-8859-14'`    | `'iso8859-14'`, `'iso885914'`                                                                                                                                                                                                       |
| `'iso-8859-15'`    | `'csisolatin9'`, `'iso8859-15'`, `'iso885915'`, `'iso_8859-15'`, `'l9'`                                                                                                                                                             |
| `'koi8-r'`         | `'cskoi8r'`, `'koi'`, `'koi8'`, `'koi8_r'`                                                                                                                                                                                          |
| `'koi8-u'`         | `'koi8-ru'`                                                                                                                                                                                                                         |
| `'macintosh'`      | `'csmacintosh'`, `'mac'`, `'x-mac-roman'`                                                                                                                                                                                           |
| `'windows-874'`    | `'dos-874'`, `'iso-8859-11'`, `'iso8859-11'`, `'iso885911'`, `'tis-620'`                                                                                                                                                            |
| `'windows-1250'`   | `'cp1250'`, `'x-cp1250'`                                                                                                                                                                                                            |
| `'windows-1251'`   | `'cp1251'`, `'x-cp1251'`                                                                                                                                                                                                            |
| `'windows-1252'`   | `'ansi_x3.4-1968'`, `'ascii'`, `'cp1252'`, `'cp819'`, `'csisolatin1'`, `'ibm819'`, `'iso-8859-1'`, `'iso-ir-100'`, `'iso8859-1'`, `'iso88591'`, `'iso_8859-1'`, `'iso_8859-1:1987'`, `'l1'`, `'latin1'`, `'us-ascii'`, `'x-cp1252'` |
| `'windows-1253'`   | `'cp1253'`, `'x-cp1253'`                                                                                                                                                                                                            |
| `'windows-1254'`   | `'cp1254'`, `'csisolatin5'`, `'iso-8859-9'`, `'iso-ir-148'`, `'iso8859-9'`, `'iso88599'`, `'iso_8859-9'`, `'iso_8859-9:1989'`, `'l5'`, `'latin5'`, `'x-cp1254'`                                                                     |
| `'windows-1255'`   | `'cp1255'`, `'x-cp1255'`                                                                                                                                                                                                            |
| `'windows-1256'`   | `'cp1256'`, `'x-cp1256'`                                                                                                                                                                                                            |
| `'windows-1257'`   | `'cp1257'`, `'x-cp1257'`                                                                                                                                                                                                            |
| `'windows-1258'`   | `'cp1258'`, `'x-cp1258'`                                                                                                                                                                                                            |
| `'x-mac-cyrillic'` | `'x-mac-ukrainian'`                                                                                                                                                                                                                 |
| `'gbk'`            | `'chinese'`, `'csgb2312'`, `'csiso58gb231280'`, `'gb2312'`, `'gb_2312'`, `'gb_2312-80'`, `'iso-ir-58'`, `'x-gbk'`                                                                                                                   |
| `'gb18030'`        |                                                                                                                                                                                                                                     |
| `'big5'`           | `'big5-hkscs'`, `'cn-big5'`, `'csbig5'`, `'x-x-big5'`                                                                                                                                                                               |
| `'euc-jp'`         | `'cseucpkdfmtjapanese'`, `'x-euc-jp'`                                                                                                                                                                                               |
| `'iso-2022-jp'`    | `'csiso2022jp'`                                                                                                                                                                                                                     |
| `'shift_jis'`      | `'csshiftjis'`, `'ms932'`, `'ms_kanji'`, `'shift-jis'`, `'sjis'`, `'windows-31j'`, `'x-sjis'`                                                                                                                                       |
| `'euc-kr'`         | `'cseuckr'`, `'csksc56011987'`, `'iso-ir-149'`, `'korean'`, `'ks_c_5601-1987'`, `'ks_c_5601-1989'`, `'ksc5601'`, `'ksc_5601'`, `'windows-949'`                                                                                      |

#### Node.js ကို `small-icu` option နဲ့ build လုပ်ထားတဲ့အခါ ထောက်ပံ့ပေးတဲ့ encodings များ (Encodings supported when Node.js is built with the `small-icu` option)

| Encoding     | Aliases                         |
| ------------ | ------------------------------- |
| `'utf-8'`    | `'unicode-1-1-utf-8'`, `'utf8'` |
| `'utf-16le'` | `'utf-16'`                      |
| `'utf-16be'` |                                 |

#### ICU disabled ဖြစ်နေတဲ့အခါ ထောက်ပံ့ပေးတဲ့ encodings များ (Encodings supported when ICU is disabled)

| Encoding     | Aliases                         |
| ------------ | ------------------------------- |
| `'utf-8'`    | `'unicode-1-1-utf-8'`, `'utf8'` |
| `'utf-16le'` | `'utf-16'`                      |

[WHATWG Encoding Standard][] မှာ ဖော်ပြထားတဲ့ `'iso-8859-16'` encoding ကိုတော့ ထောက်ပံ့မပေးပါဘူး။

### `new TextDecoder([encoding[, options]])`

* `encoding` {string} ဒီ `TextDecoder` instance က ထောက်ပံ့ပေးတဲ့ `encoding` ကို ခွဲခြားဖော်ပြပါတယ်။ **Default:** `'utf-8'`။
* `options` {Object}
  * `fatal` {boolean} Decoding failure တွေ fatal ဖြစ်မဖြစ်ကို ဖော်ပြတဲ့ `true`/`false` တန်ဖိုးပါ။ ICU disabled ဖြစ်နေတဲ့အခါ ဒီ option ကို ထောက်ပံ့မပေးပါဘူး ([Internationalization][] ကို ကြည့်ပါ)။ **Default:** `false`။
  * `ignoreBOM` {boolean} `true` ဆိုရင် — `TextDecoder` က byte order mark ကို decoded result ထဲမှာ ထည့်သွင်းပါလိမ့်မယ်။ `false` ဆိုရင် — byte order mark ကို output ကနေ ဖယ်ရှားပါလိမ့်မယ်။ ဒီ option ကို `encoding` က `'utf-8'`, `'utf-16be'` သို့မဟုတ် `'utf-16le'` ဖြစ်တဲ့အခါမှသာ သုံးပါတယ်။ **Default:** `false`။

`TextDecoder` instance အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ `encoding` က ထောက်ပံ့ပေးထားတဲ့ encodings တွေထဲက တစ်ခု သို့မဟုတ် alias တစ်ခုကို သတ်မှတ်နိုင်ပါတယ်။

`TextDecoder` class ကို global object ပေါ်မှာလည်း ရရှိနိုင်ပါတယ်။

### `textDecoder.decode([input[, options]])`

* `input` {ArrayBuffer|DataView|TypedArray} Encoded data တွေ ပါဝင်တဲ့ `ArrayBuffer`, `DataView` သို့မဟုတ် `TypedArray` instance တစ်ခု။
* `options` {Object}
  * `stream` {boolean} Data တွေရဲ့ နောက်ထပ် chunks တွေ လာဦးမယ်လို့ မျှော်လင့်ရင် `true` ဖြစ်ပါတယ်။ **Default:** `false`။
* Returns: {string}

`input` ကို decode လုပ်ပြီး string တစ်ခု ပြန်ပေးပါတယ်။ `options.stream` က `true` ဆိုရင် — `input` ရဲ့ အဆုံးမှာ ဖြစ်ပေါ်နေတဲ့ မပြည့်စုံတဲ့ byte sequences တွေကို internally buffered လုပ်ထားပြီး — နောက်တစ်ကြိမ် `textDecoder.decode()` ခေါ်လိုက်တဲ့အခါ emit လုပ်ပါတယ်။

`textDecoder.fatal` က `true` ဆိုရင် — ဖြစ်ပေါ်လာတဲ့ decoding errors တွေက `TypeError` တစ်ခု throw လုပ်ခံရခြင်းဆီကို ဦးတည်ပါလိမ့်မယ်။

### `textDecoder.encoding`

* Type: {string}

`TextDecoder` instance က ထောက်ပံ့ပေးတဲ့ encoding ပါ။

### `textDecoder.fatal`

* Type: {boolean}

Decoding errors တွေက `TypeError` တစ်ခု throw လုပ်ခံရခြင်းဆီကို ဦးတည်ရင် ဒီတန်ဖိုးက `true` ဖြစ်ပါလိမ့်မယ်။

### `textDecoder.ignoreBOM`

* Type: {boolean}

Decoding result ထဲမှာ byte order mark ပါဝင်မယ်ဆိုရင် ဒီတန်ဖိုးက `true` ဖြစ်ပါလိမ့်မယ်။

## Class: `util.TextEncoder`

[WHATWG Encoding Standard][] `TextEncoder` API ရဲ့ implementation တစ်ခုပါ။ `TextEncoder` ရဲ့ instance တွေအားလုံးက UTF-8 encoding ကိုပဲ ထောက်ပံ့ပေးပါတယ်။

```js
const encoder = new TextEncoder();
const uint8array = encoder.encode('this is some data');
```

`TextEncoder` class ကို global object ပေါ်မှာလည်း ရရှိနိုင်ပါတယ်။

### `textEncoder.encode([input])`

* `input` {string} Encode လုပ်ရမယ့် စာသားပါ။ **Default:** empty string တစ်ခု။
* Returns: {Uint8Array}

`input` string ကို UTF-8 နဲ့ encode လုပ်ပြီး — encoded bytes တွေ ပါဝင်တဲ့ `Uint8Array` တစ်ခုကို ပြန်ပေးပါတယ်။

### `textEncoder.encodeInto(src, dest)`

* `src` {string} Encode လုပ်ရမယ့် စာသားပါ။
* `dest` {Uint8Array} Encode ရလဒ်ကို သိမ်းဆည်းဖို့ array တစ်ခုပါ။
* Returns: {Object}
  * `read` {number} `src` ထဲက ဖတ်လိုက်တဲ့ (read) Unicode code units အရေအတွက်။
  * `written` {number} `dest` ထဲကို ရေးလိုက်တဲ့ (written) UTF-8 bytes အရေအတွက်။

`src` string ကို `dest` Uint8Array ဆီ UTF-8 နဲ့ encode လုပ်ပြီး — ဖတ်လိုက်တဲ့ Unicode code units တွေနဲ့ ရေးလိုက်တဲ့ UTF-8 bytes တွေ ပါဝင်တဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။

```js
const encoder = new TextEncoder();
const src = 'this is some data';
const dest = new Uint8Array(10);
const { read, written } = encoder.encodeInto(src, dest);
```

### `textEncoder.encoding`

* Type: {string}

`TextEncoder` instance က ထောက်ပံ့ပေးတဲ့ encoding ပါ။ အမြဲတမ်း `'utf-8'` လို့ သတ်မှတ်ထားပါတယ်။

## `util.toUSVString(string)`

* `string` {string}

Surrogate code points တွေ (ညီမျှစွာ ဆိုရင် — unpaired surrogate code units တွေ) အားလုံးကို Unicode "replacement character" U+FFFD နဲ့ အစားထိုးပြီးမှ — `string` ကို ပြန်ပေးပါတယ်။

## `util.transferableAbortController()`

{AbortSignal} က transferable အဖြစ် အမှတ်အသား ပြုလုပ်ထားပြီး — `structuredClone()` သို့မဟုတ် `postMessage()` တွေနဲ့ သုံးနိုင်တဲ့ {AbortController} instance တစ်ခုကို ဖန်တီးပြီး ပြန်ပေးပါတယ်။

## `util.transferableAbortSignal(signal)`

* `signal` {AbortSignal}
* Returns: {AbortSignal}

ပေးထားတဲ့ {AbortSignal} ကို transferable အဖြစ် အမှတ်အသား ပြုလုပ်ပေးပါတယ် — ဒါကြောင့် `structuredClone()` နဲ့ `postMessage()` တွေနဲ့ သုံးနိုင်ပါတယ်။

```js
const signal = transferableAbortSignal(AbortSignal.timeout(100));
const channel = new MessageChannel();
channel.port2.postMessage(signal, [signal]);
```

## `util.aborted(signal, resource)`

* `signal` {AbortSignal}
* `resource` {Object} Abortable operation နဲ့ ဆက်စပ်နေပြီး weakly ကိုင်ထားတဲ့ non-null object မဆို ဖြစ်နိုင်ပါတယ်။ `resource` က `signal` abort မဖြစ်ခင် garbage collected ဖြစ်သွားရင် — promise က pending အတိုင်း ကျန်နေပြီး — Node.js က ၎င်းကို tracking လုပ်တာ ရပ်တန့်နိုင်ပါတယ်။ ဒါက ကြာရှည် run တဲ့ သို့မဟုတ် cancel လုပ်လို့ မရတဲ့ operations တွေမှာ memory leaks တွေကို ကာကွယ်ပေးပါတယ်။
* Returns: {Promise}

ပေးထားတဲ့ `signal` ပေါ်မှာ abort event ကို နားထောင်ပြီး — `signal` abort ဖြစ်တဲ့အခါ resolve ဖြစ်တဲ့ promise တစ်ခုကို ပြန်ပေးပါတယ်။ `resource` ကို ပေးထားရင် — operation ရဲ့ ဆက်စပ်နေတဲ့ object ကို weakly reference လုပ်ထားပါတယ်။ ဒါကြောင့် `resource` က `signal` abort မဖြစ်ခင် garbage collected ဖြစ်သွားရင် — ပြန်ပေးလိုက်တဲ့ promise က pending အတိုင်း ကျန်နေပါလိမ့်မယ်။ ဒါက ကြာရှည် run တဲ့ သို့မဟုတ် cancel လုပ်လို့ မရတဲ့ operations တွေမှာ memory leaks တွေကို ကာကွယ်ပေးပါတယ်။

```cjs
const { aborted } = require('node:util');

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});
```

```mjs
import { aborted } from 'node:util';

// Obtain an object with an abortable signal, like a custom resource or operation.
const dependent = obtainSomethingAbortable();

// Pass `dependent` as the resource, indicating the promise should only resolve
// if `dependent` is still in memory when the signal is aborted.
aborted(dependent.signal, dependent).then(() => {

  // This code runs when `dependent` is aborted.
  console.log('Dependent resource was aborted.');
});

// Simulate an event that triggers the abort.
dependent.on('event', () => {
  dependent.abort(); // This will cause the `aborted` promise to resolve.
});
```

## `util.types`

`util.types` က built-in objects အမျိုးမျိုးအတွက် type checks တွေကို ပေးအပ်ပါတယ်။ `instanceof` သို့မဟုတ် `Object.prototype.toString.call(value)` တို့နဲ့ မတူဘဲ — ဒီ checks တွေက JavaScript ကနေ ဝင်ရောက်လို့ ရနိုင်တဲ့ object ရဲ့ properties တွေကို (ဥပမာ ၎င်းတို့ရဲ့ prototype) စစ်ဆေးမှု မပြုလုပ်ပါဘူး — ပြီးတော့ ပုံမှန်အားဖြင့် C++ ထဲကို ခေါ်ဝင်တဲ့ overhead ရှိပါတယ်။

ရလဒ်က ယေဘုယျအားဖြင့် — တန်ဖိုးတစ်ခုက JavaScript ထဲမှာ ဘယ်လို properties သို့မဟုတ် behavior မျိုးတွေ ဖော်ထုတ်ထားလဲ ဆိုတာအပေါ် အာမခံချက် တစ်စုံတစ်ရာ ပေးမထားပါဘူး။ ၎င်းတို့က JavaScript ထဲမှာ type checking လုပ်တာကို ဦးစားပေးတဲ့ addon developers တွေအတွက် အဓိက အသုံးဝင်ပါတယ်။

ဒီ API ကို `require('node:util').types` သို့မဟုတ် `require('node:util/types')` ကနေ ဝင်ရောက်နိုင်ပါတယ်။

### `util.types.isAnyArrayBuffer(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {ArrayBuffer} သို့မဟုတ် {SharedArrayBuffer} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

ဒါ့အပြင် [`util.types.isArrayBuffer()`][] နဲ့ [`util.types.isSharedArrayBuffer()`][] တို့ကိုလည်း ကြည့်ပါ။

```js
util.types.isAnyArrayBuffer(new ArrayBuffer());  // Returns true
util.types.isAnyArrayBuffer(new SharedArrayBuffer());  // Returns true
```

### `util.types.isArrayBufferView(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက {ArrayBuffer} views တွေထဲက တစ်ခုရဲ့ instance ဖြစ်ရင် `true` ကို ပြန်ပေးပါတယ် — ဥပမာ typed array objects တွေ သို့မဟုတ် {DataView} လိုမျိုးပါ။ [`ArrayBuffer.isView()`][] နဲ့ ညီမျှပါတယ်။

```js
util.types.isArrayBufferView(new Int8Array());  // true
util.types.isArrayBufferView(Buffer.from('hello world')); // true
util.types.isArrayBufferView(new DataView(new ArrayBuffer(16)));  // true
util.types.isArrayBufferView(new ArrayBuffer());  // false
```

ဒါ့အပြင် [`ArrayBuffer.isView()`][] ကိုလည်း ကြည့်ပါ။

### `util.types.isArgumentsObject(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက `arguments` object တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
function foo() {
  util.types.isArgumentsObject(arguments);  // Returns true
}
```

### `util.types.isArrayBuffer(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {ArrayBuffer} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။ ဒါက {SharedArrayBuffer} instances တွေကို _မပါဝင်_ ပါဘူး။ ပုံမှန်အားဖြင့် — နှစ်ခုလုံးအတွက် စစ်ဆေးတာ နှစ်လိုဖွယ် ကောင်းပါတယ်; အဲဒါအတွက် [`util.types.isAnyArrayBuffer()`][] ကို ကြည့်ပါ။

```js
util.types.isArrayBuffer(new ArrayBuffer());  // Returns true
util.types.isArrayBuffer(new SharedArrayBuffer());  // Returns false
```

### `util.types.isAsyncFunction(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက [async function][] တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။ ဒါက JavaScript engine က မြင်နေတာကိုပဲ ပြန်အစီရင်ခံပါတယ်; အထူးသဖြင့် — transpilation tool တစ်ခု သုံးထားရင် ပြန်ပေးတဲ့ တန်ဖိုးက မူရင်း source code နဲ့ မကိုက်ညီနိုင်ပါဘူး။

```js
util.types.isAsyncFunction(function foo() {});  // Returns false
util.types.isAsyncFunction(async function foo() {});  // Returns true
```

### `util.types.isBigInt64Array(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက `BigInt64Array` instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isBigInt64Array(new BigInt64Array());   // Returns true
util.types.isBigInt64Array(new BigUint64Array());  // Returns false
```

### `util.types.isBigIntObject(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက BigInt object တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ် — ဥပမာ `Object(BigInt(123))` နဲ့ ဖန်တီးထားတာမျိုးပါ။

```js
util.types.isBigIntObject(Object(BigInt(123)));   // Returns true
util.types.isBigIntObject(BigInt(123));   // Returns false
util.types.isBigIntObject(123);  // Returns false
```

### `util.types.isBigUint64Array(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက `BigUint64Array` instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isBigUint64Array(new BigInt64Array());   // Returns false
util.types.isBigUint64Array(new BigUint64Array());  // Returns true
```

### `util.types.isBooleanObject(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက boolean object တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ် — ဥပမာ `new Boolean()` နဲ့ ဖန်တီးထားတာမျိုးပါ။

```js
util.types.isBooleanObject(false);  // Returns false
util.types.isBooleanObject(true);   // Returns false
util.types.isBooleanObject(new Boolean(false)); // Returns true
util.types.isBooleanObject(new Boolean(true));  // Returns true
util.types.isBooleanObject(Boolean(false)); // Returns false
util.types.isBooleanObject(Boolean(true));  // Returns false
```

### `util.types.isBoxedPrimitive(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက boxed primitive object မဆို ဖြစ်နေရင် `true` ကို ပြန်ပေးပါတယ် — ဥပမာ `new Boolean()`, `new String()` သို့မဟုတ် `Object(Symbol())` နဲ့ ဖန်တီးထားတာမျိုးပါ။

ဥပမာ:

```js
util.types.isBoxedPrimitive(false); // Returns false
util.types.isBoxedPrimitive(new Boolean(false)); // Returns true
util.types.isBoxedPrimitive(Symbol('foo')); // Returns false
util.types.isBoxedPrimitive(Object(Symbol('foo'))); // Returns true
util.types.isBoxedPrimitive(Object(BigInt(5))); // Returns true
```

### `util.types.isCryptoKey(value)`

* `value` {Object}
* Returns: {boolean}

`value` က {CryptoKey} တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပြီး — မဟုတ်ရင် `false` ပါ။

### `util.types.isDataView(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {DataView} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
const ab = new ArrayBuffer(20);
util.types.isDataView(new DataView(ab));  // Returns true
util.types.isDataView(new Float64Array());  // Returns false
```

ဒါ့အပြင် [`ArrayBuffer.isView()`][] ကိုလည်း ကြည့်ပါ။

### `util.types.isDate(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Date} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isDate(new Date());  // Returns true
```

### `util.types.isExternal(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက native `External` value တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

Native `External` တန်ဖိုးဆိုတာ — native code ကနေ ဝင်ရောက်ဖို့ raw C++ pointer (`void*`) တစ်ခု ပါဝင်ပြီး — အခြား properties တွေ ဘာမှ မရှိတဲ့ အထူး object type တစ်ခုပါ။ အဲဒီလို objects တွေကို Node.js internals တွေ သို့မဟုတ် native addons တွေက ဖန်တီးပါတယ်။ JavaScript ထဲမှာတော့ — `null` prototype ရှိတဲ့ [frozen][`Object.freeze()`] objects တွေ ဖြစ်ပါတယ်။

```c
#include <js_native_api.h>
#include <stdlib.h>
napi_value result;
static napi_value MyNapi(napi_env env, napi_callback_info info) {
  int* raw = (int*) malloc(1024);
  napi_status status = napi_create_external(env, (void*) raw, NULL, NULL, &result);
  if (status != napi_ok) {
    napi_throw_error(env, NULL, "napi_create_external failed");
    return NULL;
  }
  return result;
}
...
DECLARE_NAPI_PROPERTY("myNapi", MyNapi)
...
```

```mjs
import native from 'napi_addon.node';
import { types } from 'node:util';

const data = native.myNapi();
types.isExternal(data); // returns true
types.isExternal(0); // returns false
types.isExternal(new String('foo')); // returns false
```

```cjs
const native = require('napi_addon.node');
const { types } = require('node:util');

const data = native.myNapi();
types.isExternal(data); // returns true
types.isExternal(0); // returns false
types.isExternal(new String('foo')); // returns false
```

`napi_create_external` အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် — [`napi_create_external()`][] ကို ကိုးကားကြည့်ပါ။

### `util.types.isFloat16Array(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Float16Array} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isFloat16Array(new ArrayBuffer());  // Returns false
util.types.isFloat16Array(new Float16Array());  // Returns true
util.types.isFloat16Array(new Float32Array());  // Returns false
```

### `util.types.isFloat32Array(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Float32Array} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isFloat32Array(new ArrayBuffer());  // Returns false
util.types.isFloat32Array(new Float32Array());  // Returns true
util.types.isFloat32Array(new Float64Array());  // Returns false
```

### `util.types.isFloat64Array(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Float64Array} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isFloat64Array(new ArrayBuffer());  // Returns false
util.types.isFloat64Array(new Uint8Array());  // Returns false
util.types.isFloat64Array(new Float64Array());  // Returns true
```

### `util.types.isGeneratorFunction(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက generator function တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။ ဒါက JavaScript engine က မြင်နေတာကိုပဲ ပြန်အစီရင်ခံပါတယ်; အထူးသဖြင့် — transpilation tool တစ်ခု သုံးထားရင် ပြန်ပေးတဲ့ တန်ဖိုးက မူရင်း source code နဲ့ မကိုက်ညီနိုင်ပါဘူး။

```js
util.types.isGeneratorFunction(function foo() {});  // Returns false
util.types.isGeneratorFunction(function* foo() {});  // Returns true
```

### `util.types.isGeneratorObject(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in generator function တစ်ခုကနေ ပြန်ပေးလိုက်တဲ့ generator object တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။ ဒါက JavaScript engine က မြင်နေတာကိုပဲ ပြန်အစီရင်ခံပါတယ်; အထူးသဖြင့် — transpilation tool တစ်ခု သုံးထားရင် ပြန်ပေးတဲ့ တန်ဖိုးက မူရင်း source code နဲ့ မကိုက်ညီနိုင်ပါဘူး။

```js
function* foo() {}
const generator = foo();
util.types.isGeneratorObject(generator);  // Returns true
```

### `util.types.isInt8Array(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Int8Array} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isInt8Array(new ArrayBuffer());  // Returns false
util.types.isInt8Array(new Int8Array());  // Returns true
util.types.isInt8Array(new Float64Array());  // Returns false
```

### `util.types.isInt16Array(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Int16Array} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isInt16Array(new ArrayBuffer());  // Returns false
util.types.isInt16Array(new Int16Array());  // Returns true
util.types.isInt16Array(new Float64Array());  // Returns false
```

### `util.types.isInt32Array(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Int32Array} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isInt32Array(new ArrayBuffer());  // Returns false
util.types.isInt32Array(new Int32Array());  // Returns true
util.types.isInt32Array(new Float64Array());  // Returns false
```

### `util.types.isKeyObject(value)`

* `value` {Object}
* Returns: {boolean}

`value` က {KeyObject} တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပြီး — မဟုတ်ရင် `false` ပါ။

### `util.types.isMap(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Map} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isMap(new Map());  // Returns true
```

### `util.types.isMapIterator(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Map} instance တစ်ခုအတွက် ပြန်ပေးလိုက်တဲ့ iterator တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
const map = new Map();
util.types.isMapIterator(map.keys());  // Returns true
util.types.isMapIterator(map.values());  // Returns true
util.types.isMapIterator(map.entries());  // Returns true
util.types.isMapIterator(map[Symbol.iterator]());  // Returns true
```

### `util.types.isModuleNamespaceObject(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက [Module Namespace Object][] တစ်ခုရဲ့ instance ဖြစ်ရင် `true` ကို ပြန်ပေးပါတယ်။

```mjs
import * as ns from './a.js';

util.types.isModuleNamespaceObject(ns);  // Returns true
```

### `util.types.isNativeError(value)`

> Stability: 0 - Deprecated: Use [`Error.isError`][] instead.

**Note:** Node.js 24 စတင်ပြီး — `Error.isError()` က လက်ရှိမှာ `util.types.isNativeError()` ထက် ပိုနှေးပါတယ်။ Performance က အရေးကြီးတယ်ဆိုရင် — သင့် environment ထဲမှာ နှစ်ခုလုံးကို benchmark လုပ်ကြည့်ဖို့ စဉ်းစားပါ။

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက [built-in `Error` type][] တစ်ခုရဲ့ constructor ကနေ ပြန်လာတာဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
console.log(util.types.isNativeError(new Error()));  // true
console.log(util.types.isNativeError(new TypeError()));  // true
console.log(util.types.isNativeError(new RangeError()));  // true
```

Native error types တွေရဲ့ subclasses တွေကလည်း native errors တွေပါပဲ:

```js
class MyError extends Error {}
console.log(util.types.isNativeError(new MyError()));  // true
```

တန်ဖိုးတစ်ခုက native error class တစ်ခုရဲ့ `instanceof` ဖြစ်နေတာက — အဲဒီတန်ဖိုးအတွက် `isNativeError()` က `true` ပြန်ပေးတာနဲ့ ညီမျှမှု မရှိပါဘူး။ `isNativeError()` က [realm][] အမျိုးမျိုးကနေ လာတဲ့ errors တွေအတွက် `true` ကို ပြန်ပေးပြီး — `instanceof Error` ကတော့ ဒီလို errors တွေအတွက် `false` ကို ပြန်ပေးပါတယ်:

```mjs
import { createContext, runInContext } from 'node:vm';
import { types } from 'node:util';

const context = createContext({});
const myError = runInContext('new Error()', context);
console.log(types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```

```cjs
const { createContext, runInContext } = require('node:vm');
const { types } = require('node:util');

const context = createContext({});
const myError = runInContext('new Error()', context);
console.log(types.isNativeError(myError)); // true
console.log(myError instanceof Error); // false
```

ပြောင်းပြန်အနေနဲ့ — `isNativeError()` က native error တစ်ခုရဲ့ constructor ကနေ ပြန်မလာတဲ့ objects အားလုံးအတွက် `false` ကို ပြန်ပေးပါတယ်။ ဒါမှာ native errors တွေရဲ့ `instanceof` ဖြစ်နေတဲ့ တန်ဖိုးတွေလည်း ပါဝင်ပါတယ်:

```js
const myError = { __proto__: Error.prototype };
console.log(util.types.isNativeError(myError)); // false
console.log(myError instanceof Error); // true
```

### `util.types.isNumberObject(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက number object တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ် — ဥပမာ `new Number()` နဲ့ ဖန်တီးထားတာမျိုးပါ။

```js
util.types.isNumberObject(0);  // Returns false
util.types.isNumberObject(new Number(0));   // Returns true
```

### `util.types.isPromise(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Promise} တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isPromise(Promise.resolve(42));  // Returns true
```

### `util.types.isProxy(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက {Proxy} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // Returns false
util.types.isProxy(proxy);  // Returns true
```

### `util.types.isRegExp(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက regular expression object တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isRegExp(/abc/);  // Returns true
util.types.isRegExp(new RegExp('abc'));  // Returns true
```

### `util.types.isSet(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Set} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isSet(new Set());  // Returns true
```

### `util.types.isSetIterator(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Set} instance တစ်ခုအတွက် ပြန်ပေးလိုက်တဲ့ iterator တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
const set = new Set();
util.types.isSetIterator(set.keys());  // Returns true
util.types.isSetIterator(set.values());  // Returns true
util.types.isSetIterator(set.entries());  // Returns true
util.types.isSetIterator(set[Symbol.iterator]());  // Returns true
```

### `util.types.isSharedArrayBuffer(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {SharedArrayBuffer} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။ ဒါက {ArrayBuffer} instances တွေကို _မပါဝင်_ ပါဘူး။ ပုံမှန်အားဖြင့် — နှစ်ခုလုံးအတွက် စစ်ဆေးတာ နှစ်လိုဖွယ် ကောင်းပါတယ်; အဲဒါအတွက် [`util.types.isAnyArrayBuffer()`][] ကို ကြည့်ပါ။

```js
util.types.isSharedArrayBuffer(new ArrayBuffer());  // Returns false
util.types.isSharedArrayBuffer(new SharedArrayBuffer());  // Returns true
```

### `util.types.isStringObject(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက string object တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ် — ဥပမာ `new String()` နဲ့ ဖန်တီးထားတာမျိုးပါ။

```js
util.types.isStringObject('foo');  // Returns false
util.types.isStringObject(new String('foo'));   // Returns true
```

### `util.types.isSymbolObject(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက symbol object တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ် — `Symbol` primitive တစ်ခုပေါ်မှာ `Object()` ကို ခေါ်ပြီး ဖန်တီးထားတာမျိုးပါ။

```js
const symbol = Symbol('foo');
util.types.isSymbolObject(symbol);  // Returns false
util.types.isSymbolObject(Object(symbol));   // Returns true
```

### `util.types.isTypedArray(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {TypedArray} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isTypedArray(new ArrayBuffer());  // Returns false
util.types.isTypedArray(new Uint8Array());  // Returns true
util.types.isTypedArray(new Float64Array());  // Returns true
```

ဒါ့အပြင် [`ArrayBuffer.isView()`][] ကိုလည်း ကြည့်ပါ။

### `util.types.isUint8Array(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Uint8Array} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isUint8Array(new ArrayBuffer());  // Returns false
util.types.isUint8Array(new Uint8Array());  // Returns true
util.types.isUint8Array(new Float64Array());  // Returns false
```

### `util.types.isUint8ClampedArray(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Uint8ClampedArray} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isUint8ClampedArray(new ArrayBuffer());  // Returns false
util.types.isUint8ClampedArray(new Uint8ClampedArray());  // Returns true
util.types.isUint8ClampedArray(new Float64Array());  // Returns false
```

### `util.types.isUint16Array(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Uint16Array} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isUint16Array(new ArrayBuffer());  // Returns false
util.types.isUint16Array(new Uint16Array());  // Returns true
util.types.isUint16Array(new Float64Array());  // Returns false
```

### `util.types.isUint32Array(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {Uint32Array} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isUint32Array(new ArrayBuffer());  // Returns false
util.types.isUint32Array(new Uint32Array());  // Returns true
util.types.isUint32Array(new Float64Array());  // Returns false
```

### `util.types.isWeakMap(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {WeakMap} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isWeakMap(new WeakMap());  // Returns true
```

### `util.types.isWeakSet(value)`

* `value` {any}
* Returns: {boolean}

တန်ဖိုးက built-in {WeakSet} instance တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။

```js
util.types.isWeakSet(new WeakSet());  // Returns true
```

## ခေတ်နောက်ကျနေသော APIs များ (Deprecated APIs)

အောက်ပါ APIs တွေက deprecated ဖြစ်နေပြီး — နောက်ထပ် သုံးစွဲမှု မပြုလုပ်သင့်တော့ပါဘူး။ ရှိပြီးသား applications နဲ့ modules တွေကို — အခြားနည်းလမ်းတွေ ရှာဖွေဖို့ update လုပ်သင့်ပါတယ်။

### `util._extend(target, source)`

> Stability: 0 - Deprecated: Use [`Object.assign()`][] instead.

* `target` {Object}
* `source` {Object}

`util._extend()` method က Node.js internal modules တွေရဲ့ အပြင်ဘက်မှာ သုံးဖို့ ရည်ရွယ်ထားတာ ဘယ်တုန်းကမှ မဟုတ်ပါဘူး။ Community က ဒါကို တွေ့ရှိပြီး ဘယ်လိုပဲဖြစ်ဖြစ် သုံးခဲ့ကြပါတယ်။

ဒါက deprecated ဖြစ်နေပြီး — code အသစ်တွေမှာ မသုံးသင့်ပါဘူး။ JavaScript မှာ [`Object.assign()`][] ကနေ အလွန်ဆင်တူတဲ့ built-in functionality တွေ ပါဝင်ပါတယ်။

Automated migration တစ်ခု ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-extend-to-object-assign)):

```bash
npx codemod@latest @nodejs/util-extend-to-object-assign
```

### `util.isArray(object)`

> Stability: 0 - Deprecated: Use [`Array.isArray()`][] instead.

* `object` {any}
* Returns: {boolean}

[`Array.isArray()`][] ရဲ့ alias တစ်ခုပါ။

ပေးထားတဲ့ `object` က `Array` တစ်ခု ဆိုရင် `true` ကို ပြန်ပေးပါတယ်။ မဟုတ်ရင် — `false` ကို ပြန်ပေးပါတယ်။

```js
const util = require('node:util');

util.isArray([]);
// Returns: true
util.isArray(new Array());
// Returns: true
util.isArray({});
// Returns: false
```

Automated migration တစ်ခု ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

[Common System Errors]: errors.md#common-system-errors
[Custom inspection functions on objects]: #custom-inspection-functions-on-objects
[Custom promisified functions]: #custom-promisified-functions
[Customizing `util.inspect` colors]: #customizing-utilinspect-colors
[Internationalization]: intl.md
[Module Namespace Object]: https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects
[WHATWG Encoding Standard]: https://encoding.spec.whatwg.org/
[`'uncaughtException'`]: process.md#event-uncaughtexception
[`'warning'`]: process.md#event-warning
[`Array.isArray()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
[`ArrayBuffer.isView()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/isView
[`Error.isError`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/isError
[`JSON.stringify()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[`MIMEparams`]: #class-utilmimeparams
[`Object.assign()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
[`Object.freeze()`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
[`Runtime.ScriptId`]: https://chromedevtools.github.io/devtools-protocol/1-3/Runtime/#type-ScriptId
[`assert.deepStrictEqual()`]: assert.md#assertdeepstrictequalactual-expected-message
[`console.error()`]: console.md#consoleerrordata-args
[`mime.toString()`]: #mimetostring
[`mimeParams.entries()`]: #mimeparamsentries
[`napi_create_external()`]: n-api.md#napi_create_external
[`signal(7)`]: https://man7.org/linux/man-pages/man7/signal.7.html
[`target` and `handler`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#terminology
[`tty.hasColors()`]: tty.md#writestreamhascolorscount-env
[`util.diff()`]: #utildiffactual-expected
[`util.format()`]: #utilformatformat-args
[`util.inspect()`]: #utilinspectobject-options
[`util.promisify()`]: #utilpromisifyoriginal
[`util.types.isAnyArrayBuffer()`]: #utiltypesisanyarraybuffervalue
[`util.types.isArrayBuffer()`]: #utiltypesisarraybuffervalue
[`util.types.isSharedArrayBuffer()`]: #utiltypesissharedarraybuffervalue
[async function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[built-in `Error` type]: https://tc39.es/ecma262/#sec-error-objects
[compare function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#parameters
[constructor]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor
[default sort]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
[global symbol registry]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for
[list of deprecated APIS]: deprecations.md#list-of-deprecated-apis
[modifiers]: #modifiers
[realm]: https://tc39.es/ecma262/#realm
[semantically incompatible]: https://github.com/nodejs/node/issues/4179
[util.inspect.custom]: #utilinspectcustom
