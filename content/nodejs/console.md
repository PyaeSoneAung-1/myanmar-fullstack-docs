---
title: "Console"
description: "node:console module — Console class နဲ့ global console instance (log/error/warn …) ရဲ့ အသေးစိတ်"
order: 90
source: "https://nodejs.org/api/console.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:console` module က web browser တွေက ပံ့ပိုးပေးတဲ့ JavaScript console ယန္တရားနဲ့ ဆင်တူတဲ့ ရိုးရှင်းတဲ့ debugging console တစ်ခုကို ပံ့ပိုးပေးပါတယ်။

ဒီ module ထဲက export လုပ်ပေးတဲ့ အစိတ်အပိုင်း နှစ်ခုကတော့:

* `Console` class — `console.log()`, `console.error()`, `console.warn()` စတဲ့ methods တွေ ပါဝင်ပြီး Node.js ရဲ့ stream တစ်ခုခုဆီကို ရေးသားဖို့ သုံးနိုင်ပါတယ်။
* Global `console` instance — [`process.stdout`][] နဲ့ [`process.stderr`][] ဆီကို ရေးသားဖို့ configure လုပ်ထားပါတယ်။ Global `console` ကို `require('node:console')` ခေါ်စရာမလိုဘဲ သုံးနိုင်ပါတယ်။

_**Warning**_: Global console object ရဲ့ methods တွေက သူတို့နဲ့ ဆင်တူတဲ့ browser API တွေလိုပဲ တစ်သမတ်တည်း synchronous လည်း မဟုတ်သလို — Node.js ရဲ့ တခြား stream တွေ အားလုံးလိုပဲ တစ်သမတ်တည်း asynchronous လည်း မဟုတ်ပါဘူး။ Console function တွေရဲ့ synchronous / asynchronous အပြုအမူပေါ်မှာ မှီခိုလိုတဲ့ program တွေက console ရဲ့ နောက်ခံ stream (backing stream) ရဲ့ သဘောသဘာဝကို အရင်ဆုံး ရှာဖွေ သေချာ စစ်ဆေးသင့်ပါတယ်။ ဘာလို့လဲဆိုတော့ ဒီ stream က လက်ရှိ process ရဲ့ အောက်ခံ platform နဲ့ standard stream configuration ပေါ်မှာ မူတည်နေလို့ပါ။ အသေးစိတ်ကို [note on process I/O][] မှာ ကြည့်ပါ။

Global `console` ကို သုံးတဲ့ ဥပမာ:

```js
console.log('hello world');
// Prints: hello world, to stdout
console.log('hello %s', 'world');
// Prints: hello world, to stdout
console.error(new Error('Whoops, something bad happened'));
// Prints error message and stack trace to stderr:
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// Prints: Danger Will Robinson! Danger!, to stderr
```

`Console` class ကို သုံးတဲ့ ဥပမာ:

```js
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hello world');
// Prints: hello world, to out
myConsole.log('hello %s', 'world');
// Prints: hello world, to out
myConsole.error(new Error('Whoops, something bad happened'));
// Prints: [Error: Whoops, something bad happened], to err

const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// Prints: Danger Will Robinson! Danger!, to err
```

## Class: `Console`

`Console` class ကို သုံးပြီး စိတ်ကြိုက် ပြင်ဆင်နိုင်တဲ့ output streams တွေနဲ့ ရိုးရှင်းတဲ့ logger တစ်ခု ဖန်တီးနိုင်ပါတယ်။ ဒီ class ကို `require('node:console').Console` သို့မဟုတ် `console.Console` (သို့ သူတို့ရဲ့ destructured ပုံစံတွေ) ကနေ ဝင်ရောက်သုံးနိုင်ပါတယ်:

```mjs
import { Console } from 'node:console';
```

```cjs
const { Console } = require('node:console');
```

```js
const { Console } = console;
```

### `new Console(stdout[, stderr][, ignoreErrors])`

### `new Console(options)`

* `options` {Object}
  * `stdout` {stream.Writable}
  * `stderr` {stream.Writable}
  * `ignoreErrors` {boolean} အောက်ခံ stream တွေဆီကို ရေးတဲ့အခါ error တွေကို လျစ်လျူရှုရန်။ **Default:** `true`။
  * `colorMode` {boolean|string} ဒီ `Console` instance အတွက် color support ကို သတ်မှတ်ပေးပါတယ်။ `true` ထားရင် value တွေကို inspect လုပ်တဲ့အခါ အရောင်ခြယ်ပေးပြီး — `false` ထားရင် inspect လုပ်တဲ့အခါ အရောင်ခြယ်မှုကို ပိတ်ပေးပါတယ်။ `'auto'` ထားရင် color support က သက်ဆိုင်ရာ stream ပေါ်က `isTTY` property ရဲ့ တန်ဖိုးနဲ့ `getColorDepth()` က ပြန်ပေးတဲ့ တန်ဖိုးပေါ်မှာ မူတည်ပါတယ်။ `inspectOptions.colors` ကိုပါ သတ်မှတ်ထားရင်တော့ ဒီ option ကို သုံးလို့ မရပါဘူး။ **Default:** `'auto'`။
  * `inspectOptions` {Object|Map} [`util.inspect()`][] ဆီကို ထပ်ဆင့် ပို့ပေးမယ့် options တွေကို သတ်မှတ်ပါတယ်။ Options object တစ်ခု ဖြစ်နိုင်သလို — stdout နဲ့ stderr အတွက် မတူညီတဲ့ options တွေ လိုချင်ရင် stream object တွေကနေ options တွေဆီကို ညွှန်းတဲ့ `Map` တစ်ခုလည်း ဖြစ်နိုင်ပါတယ်။
  * `groupIndentation` {number} group indentation ကို သတ်မှတ်ပေးပါတယ်။ **Default:** `2`။

ဒီ constructor က writable stream instance တစ်ခု သို့မဟုတ် နှစ်ခုနဲ့အတူ `Console` အသစ်တစ်ခုကို ဖန်တီးပါတယ်။ `stdout` က log သို့မဟုတ် info output တွေကို ရိုက်ထုတ်ဖို့အတွက် writable stream ဖြစ်ပြီး — `stderr` က warning သို့မဟုတ် error output တွေအတွက် သုံးပါတယ်။ `stderr` ကို မပေးထားရင် `stdout` ကိုပဲ `stderr` အနေနဲ့ သုံးပါတယ်။

```mjs
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternatively
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

```cjs
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

Global `console` ကတော့ output တွေကို [`process.stdout`][] နဲ့ [`process.stderr`][] ဆီကို ပို့ပေးတဲ့ အထူး `Console` တစ်ခုပါ။ အောက်ပါအတိုင်း ခေါ်တာနဲ့ ညီမျှပါတယ်:

```js
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### `console.assert(value[, ...message])`

* `value` {any} truthy ဟုတ်မဟုတ် စစ်ဆေးရမယ့် တန်ဖိုးပါ။
* `...message` {any} `value` ကလွဲလို့ ကျန်တဲ့ argument တွေ အားလုံးကို error message အဖြစ် သုံးပါတယ်။

`console.assert()` က `value` က [falsy][] ဖြစ်နေရင် သို့မဟုတ် ချန်လှပ်ထားရင် message တစ်ကြောင်း ရေးထုတ်ပါတယ်။ Message ရေးထုတ်ရုံကလွဲလို့ execution ကို ဘယ်နည်းနဲ့မှ ထိခိုက်စေခြင်း မရှိပါဘူး။ Output က `"Assertion failed"` နဲ့ အမြဲတမ်း စတင်ပါတယ်။ `message` ပေးထားရင် [`util.format()`][] ကို သုံးပြီး format လုပ်ပါတယ်။

`value` က [truthy][] ဖြစ်နေရင်တော့ ဘာမှ မဖြစ်ပါဘူး။

```js
console.assert(true, 'does nothing');

console.assert(false, 'Whoops %s work', 'didn\'t');
// Assertion failed: Whoops didn't work

console.assert();
// Assertion failed
```

### `console.clear()`

`stdout` က TTY တစ်ခုဆိုရင် `console.clear()` ကို ခေါ်တာက TTY ကို ရှင်းလင်းဖို့ ကြိုးစားပါလိမ့်မယ်။ `stdout` က TTY မဟုတ်ရင်တော့ ဒီ method က ဘာမှ မလုပ်ပါဘူး။

`console.clear()` ရဲ့ တိကျတဲ့ လုပ်ဆောင်ပုံက operating system နဲ့ terminal အမျိုးအစားပေါ် မူတည်ပြီး ကွဲပြားနိုင်ပါတယ်။ Linux operating system အများစုမှာ `console.clear()` က `clear` shell command နဲ့ ဆင်တူစွာ လုပ်ဆောင်ပါတယ်။ Windows မှာတော့ `console.clear()` က Node.js binary အတွက် လက်ရှိ terminal viewport ထဲက output ကိုပဲ ရှင်းလင်းပေးပါလိမ့်မယ်။

### `console.count([label])`

* `label` {string} counter အတွက် display label ပါ။ **Default:** `'default'`။

`label` တစ်ခုစီအတွက် သီးသန့် internal counter တစ်ခုကို ထိန်းသိမ်းထားပြီး — ပေးထားတဲ့ `label` နဲ့ `console.count()` ကို ဘယ်နှစ်ကြိမ် ခေါ်ထားပြီးလဲ ဆိုတဲ့ အကြိမ်အရေအတွက်ကို `stdout` ဆီကို ရေးထုတ်ပါတယ်။

```console
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```

### `console.countReset([label])`

* `label` {string} counter အတွက် display label ပါ။ **Default:** `'default'`။

`label` နဲ့ သက်ဆိုင်တဲ့ internal counter ကို ပြန်စ (reset) လုပ်ပါတယ်။

```console
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
```

### `console.debug(data[, ...args])`

* `data` {any}
* `...args` {any}

`console.debug()` function က [`console.log()`][] ရဲ့ alias တစ်ခုပါ။

### `console.dir(obj[, options])`

* `obj` {any}
* `options` {Object}
  * `showHidden` {boolean} `true` ဆိုရင် object ရဲ့ non-enumerable နဲ့ symbol properties တွေကိုပါ ပြသပေးပါလိမ့်မယ်။ **Default:** `false`။
  * `depth` {number} object ကို format လုပ်နေစဉ် [`util.inspect()`][] က ဘယ်နှစ်ဆင့် recurse လုပ်ရမလဲ ဆိုတာကို သတ်မှတ်ပါတယ်။ ကြီးမားပြီး ရှုပ်ထွေးတဲ့ object တွေကို inspect လုပ်ဖို့ အသုံးဝင်ပါတယ်။ အကန့်အသတ်မရှိ recurse လုပ်စေချင်ရင် `null` ပေးပါ။ **Default:** `2`။
  * `colors` {boolean} `true` ဆိုရင် output ကို ANSI color codes တွေနဲ့ အရောင်ခြယ်ပေးပါလိမ့်မယ်။ အရောင်တွေကို စိတ်ကြိုက် ပြင်ဆင်နိုင်ပါတယ် — [customizing `util.inspect()` colors][] မှာ ကြည့်ပါ။ **Default:** `false`။

`obj` ပေါ်မှာ [`util.inspect()`][] ကို အသုံးပြုပြီး ရလာတဲ့ string ကို `stdout` ဆီကို ရိုက်ထုတ်ပါတယ်။ ဒီ function က `obj` ပေါ်မှာ define လုပ်ထားတဲ့ custom `inspect()` function ကို ကျော်လွှားသွားပါတယ်။

### `console.dirxml(...data)`

* `...data` {any}

ဒီ method က လက်ခံရရှိတဲ့ argument တွေကို `console.log()` ဆီကို ထပ်ဆင့်ပေးပြီး ခေါ်ပါတယ်။ XML formatting တစ်စုံတစ်ရာကိုတော့ ထုတ်လုပ်ပေးခြင်း မရှိပါဘူး။

### `console.error([data][, ...args])`

* `data` {any}
* `...args` {any}

`stderr` ဆီကို newline နဲ့အတူ ရိုက်ထုတ်ပါတယ်။ Argument အများကြီး ပေးလို့ရပြီး — ပထမဆုံး argument ကို အဓိက message အဖြစ် သုံးကာ ကျန်တဲ့ argument တွေကို printf(3) နဲ့ ဆင်တူတဲ့ substitution values တွေအဖြစ် သုံးပါတယ် (argument တွေ အားလုံးကို [`util.format()`][] ဆီကို ပို့ပါတယ်)။

```js
const code = 5;
console.error('error #%d', code);
// Prints: error #5, to stderr
console.error('error', code);
// Prints: error 5, to stderr
```

ပထမဆုံး string ထဲမှာ format element တွေ (ဥပမာ `%d`) မတွေ့ရဘူးဆိုရင် — argument တစ်ခုချင်းစီပေါ်မှာ [`util.inspect()`][] ကို ခေါ်ပြီး ရလာတဲ့ string တန်ဖိုးတွေကို ဆက်စပ်လိုက်ပါတယ်။ အသေးစိတ်ကို [`util.format()`][] မှာ ကြည့်ပါ။

### `console.group([...label])`

* `...label` {any}

နောက်ဆက်တွဲ line တွေရဲ့ indentation ကို `groupIndentation` အရှည်အတိုင်း space တွေနဲ့ တိုးပေးပါတယ်။

`label` တစ်ခု (သို့) အများကြီး ပေးထားရင် — အဲဒီ label တွေကို ထပ်ဆောင်း indentation မပါဘဲ အရင်ဆုံး ရိုက်ထုတ်ပါတယ်။

### `console.groupCollapsed()`

[`console.group()`][] ရဲ့ alias တစ်ခုပါ။

### `console.groupEnd()`

နောက်ဆက်တွဲ line တွေရဲ့ indentation ကို `groupIndentation` အရှည်အတိုင်း space တွေနဲ့ လျှော့ချပေးပါတယ်။

### `console.info([data][, ...args])`

* `data` {any}
* `...args` {any}

`console.info()` function က [`console.log()`][] ရဲ့ alias တစ်ခုပါ။

### `console.log([data][, ...args])`

* `data` {any}
* `...args` {any}

`stdout` ဆီကို newline နဲ့အတူ ရိုက်ထုတ်ပါတယ်။ Argument အများကြီး ပေးလို့ရပြီး — ပထမဆုံး argument ကို အဓိက message အဖြစ် သုံးကာ ကျန်တဲ့ argument တွေကို printf(3) နဲ့ ဆင်တူတဲ့ substitution values တွေအဖြစ် သုံးပါတယ် (argument တွေ အားလုံးကို [`util.format()`][] ဆီကို ပို့ပါတယ်)။

```js
const count = 5;
console.log('count: %d', count);
// Prints: count: 5, to stdout
console.log('count:', count);
// Prints: count: 5, to stdout
```

အသေးစိတ်ကို [`util.format()`][] မှာ ကြည့်ပါ။

### `console.table(tabularData[, properties])`

* `tabularData` {any}
* `properties` {string\[]} table တည်ဆောက်ရာမှာ သုံးမယ့် အစားထိုး properties တွေပါ။

`tabularData` ရဲ့ properties တွေကို column တွေအဖြစ် (သို့ `properties` ကို သုံးပြီး) ၊ `tabularData` ရဲ့ item တွေကို row တွေအဖြစ် ယူပြီး table တစ်ခု တည်ဆောက်ဖို့ ကြိုးစားကာ log လုပ်ပါတယ်။ Tabular data အဖြစ် parse လုပ်လို့ မရရင် argument ကိုပဲ log လုပ်တာနဲ့ ပြန်ကျသွားပါတယ်။

```js
// These can't be parsed as tabular data
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```

### `console.time([label])`

* `label` {string} **Default:** `'default'`

လုပ်ဆောင်မှုတစ်ခုရဲ့ ကြာချိန် (duration) ကို တွက်ချက်ဖို့ သုံးနိုင်တဲ့ timer တစ်ခုကို စတင်ပါတယ်။ Timer တွေကို ထူးခြားတဲ့ `label` တစ်ခုစီနဲ့ ခွဲခြားသတ်မှတ်ပါတယ်။ Timer ကို ရပ်တန့်ပြီး ကုန်ဆုံးချိန်ကို သင့်လျော်တဲ့ time unit တွေနဲ့ `stdout` ဆီကို ရေးထုတ်ဖို့ [`console.timeEnd()`][] ကို ခေါ်တဲ့အခါ တူညီတဲ့ `label` ကိုပဲ သုံးပါ။ ဥပမာ — ကြာချိန်က 3869ms ဆိုရင် `console.timeEnd()` က "3.869s" လို့ ပြသပါတယ်။

### `console.timeEnd([label])`

* `label` {string} **Default:** `'default'`

[`console.time()`][] ကို ခေါ်ပြီး အရင်က စတင်ထားတဲ့ timer တစ်ခုကို ရပ်တန့်ကာ ရလဒ်ကို `stdout` ဆီကို ရိုက်ထုတ်ပါတယ်:

```js
console.time('bunch-of-stuff');
// Do a bunch of stuff.
console.timeEnd('bunch-of-stuff');
// Prints: bunch-of-stuff: 225.438ms
```

### `console.timeLog([label][, ...data])`

* `label` {string} **Default:** `'default'`
* `...data` {any}

[`console.time()`][] ကို ခေါ်ပြီး အရင်က စတင်ထားတဲ့ timer တစ်ခုအတွက် — ကုန်ဆုံးချိန် (elapsed time) နဲ့ တခြား `data` argument တွေကို `stdout` ဆီကို ရိုက်ထုတ်ပါတယ်:

```js
console.time('process');
const value = expensiveProcess1(); // Returns 42
console.timeLog('process', value);
// Prints "process: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('process');
```

### `console.trace([message][, ...args])`

* `message` {any}
* `...args` {any}

`stderr` ဆီကို `'Trace: '` ဆိုတဲ့ string ကို ရိုက်ထုတ်ပြီး — နောက်မှာ [`util.format()`][] နဲ့ format လုပ်ထားတဲ့ message နဲ့ code ထဲက လက်ရှိ နေရာအထိ stack trace တို့ကို ထပ်ဆင့် ရိုက်ထုတ်ပါတယ်။

```js
console.trace('Show me');
// Prints: (stack trace will vary based on where trace is called)
//  Trace: Show me
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### `console.warn([data][, ...args])`

* `data` {any}
* `...args` {any}

`console.warn()` function က [`console.error()`][] ရဲ့ alias တစ်ခုပါ။

## Inspector အတွက်သာ သီးသန့် methods များ (Inspector only methods)

အောက်ပါ methods တွေကို V8 engine က general API ထဲမှာ ဖော်ထုတ်ထားပေမယ့် — [inspector][] (`--inspect` flag) နဲ့ တွဲသုံးမှသာ ပြသမှု တစ်စုံတစ်ရာ ရှိပါတယ်။

### `console.profile([label])`

* `label` {string}

ဒီ method က inspector မှာ သုံးမှသာ ပြသမှု တစ်စုံတစ်ရာ ရှိပါတယ်။ `console.profile()` method က optional label တစ်ခုနဲ့အတူ JavaScript CPU profile တစ်ခုကို စတင်ပြီး — [`console.profileEnd()`][] ခေါ်တဲ့အထိ ဆက်လုပ်ပါတယ်။ အဲဒီနောက် profile ကို inspector ရဲ့ **Profile** panel ထဲကို ထည့်ပေးပါတယ်။

```js
console.profile('MyLabel');
// Some code
console.profileEnd('MyLabel');
// Adds the profile 'MyLabel' to the Profiles panel of the inspector.
```

### `console.profileEnd([label])`

* `label` {string}

ဒီ method က inspector မှာ သုံးမှသာ ပြသမှု တစ်စုံတစ်ရာ ရှိပါတယ်။ စတင်ထားတဲ့ JavaScript CPU profiling session တစ်ခု ရှိရင် အဲဒါကို ရပ်တန့်ပြီး report ကို inspector ရဲ့ **Profiles** panel ထဲကို ရိုက်ထုတ်ပေးပါတယ်။ ဥပမာအတွက် [`console.profile()`][] ကို ကြည့်ပါ။

Label မပါဘဲ ဒီ method ကို ခေါ်ရင် — နောက်ဆုံး စတင်ခဲ့တဲ့ profile ကို ရပ်တန့်ပါတယ်။

### `console.timeStamp([label])`

* `label` {string}

ဒီ method က inspector မှာ သုံးမှသာ ပြသမှု တစ်စုံတစ်ရာ ရှိပါတယ်။ `console.timeStamp()` method က label `'label'` ပါတဲ့ event တစ်ခုကို inspector ရဲ့ **Timeline** panel ထဲကို ထည့်ပေးပါတယ်။

[`console.error()`]: #consoleerrordata-args
[`console.group()`]: #consolegrouplabel
[`console.log()`]: #consolelogdata-args
[`console.profile()`]: #consoleprofilelabel
[`console.profileEnd()`]: #consoleprofileendlabel
[`console.time()`]: #consoletimelabel
[`console.timeEnd()`]: #consoletimeendlabel
[`process.stderr`]: process.md#processstderr
[`process.stdout`]: process.md#processstdout
[`util.format()`]: util.md#utilformatformat-args
[`util.inspect()`]: util.md#utilinspectobject-options
[customizing `util.inspect()` colors]: util.md#customizing-utilinspect-colors
[falsy]: https://developer.mozilla.org/en-US/docs/Glossary/Falsy
[inspector]: debugger.md
[note on process I/O]: process.md#a-note-on-process-io
[truthy]: https://developer.mozilla.org/en-US/docs/Glossary/Truthy
