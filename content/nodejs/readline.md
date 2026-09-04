---
title: "Readline"
description: "node:readline module — line-by-line input ဖတ်ခြင်း (interface, promises, keybindings, events)။"
order: 100
source: "https://nodejs.org/api/readline.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:readline` module က [Readable][] stream တစ်ခု (ဥပမာ — [`process.stdin`][]) ကနေ data တွေကို တစ်ကြောင်းချင်း (line-by-line) ဖတ်ဖို့ interface တစ်ခု ပေးပါတယ်။

Promise-based APIs တွေကို သုံးဖို့:

```mjs
import * as readline from 'node:readline/promises';
```

```cjs
const readline = require('node:readline/promises');
```

Callback နဲ့ sync APIs တွေကို သုံးဖို့:

```mjs
import * as readline from 'node:readline';
```

```cjs
const readline = require('node:readline');
```

အောက်က ရိုးရှင်းတဲ့ ဥပမာက `node:readline` module ရဲ့ အခြေခံ အသုံးပြုပုံကို ဖော်ပြပါတယ်။

```mjs
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const answer = await rl.question('What do you think of Node.js? ');

console.log(`Thank you for your valuable feedback: ${answer}`);

rl.close();
```

```cjs
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('What do you think of Node.js? ', (answer) => {
  // TODO: Log the answer in a database
  console.log(`Thank you for your valuable feedback: ${answer}`);

  rl.close();
});
```

ဒီ code ကို ခေါ်လိုက်တာနဲ့ — `readline.Interface` ပိတ်သွားတဲ့အထိ Node.js application က terminate (ရပ်တန့်) မှာ မဟုတ်ပါဘူး။ Interface က `input` stream ပေါ်မှာ data လက်ခံရရှိဖို့ စောင့်ဆိုင်းနေလို့ပါ။

## Class: `InterfaceConstructor`

* Extends: {EventEmitter}

`InterfaceConstructor` class ရဲ့ instances တွေကို `readlinePromises.createInterface()` (သို့) `readline.createInterface()` method နဲ့ ဖန်တီးပါတယ်။ Instance တိုင်းက `input` [Readable][] stream တစ်ခုတည်းနဲ့ `output` [Writable][] stream တစ်ခုတည်းနဲ့ ဆက်စပ်နေပါတယ်။ `output` stream ကို — `input` stream ပေါ်မှာ ရောက်ရှိလာပြီး ဖတ်ယူတဲ့ user input တွေအတွက် prompts တွေ ရိုက်နှိပ်ဖို့ သုံးပါတယ်။

### Event: `'close'`

အောက်ပါ အခြေအနေတွေထဲက တစ်ခုခု ဖြစ်ပေါ်တဲ့အခါ `'close'` event ကို emit လုပ်ပါတယ်:

* `rl.close()` method ကို ခေါ်ပြီး `InterfaceConstructor` instance က `input` နဲ့ `output` streams တွေအပေါ် ထိန်းချုပ်မှုကို စွန့်လွှတ်လိုက်တဲ့အခါ;
* `input` stream က သူ့ရဲ့ `'end'` event ကို လက်ခံရရှိတဲ့အခါ;
* `input` stream က transmission အဆုံးသတ် (EOT) အချက်ပြဖို့ `Ctrl`+`D` ကို လက်ခံရရှိတဲ့အခါ;
* `input` stream က `SIGINT` အချက်ပြဖို့ `Ctrl`+`C` ကို လက်ခံရရှိပြီး `InterfaceConstructor` instance ပေါ်မှာ `'SIGINT'` event listener တစ်ခုမှ register လုပ်ထားခြင်း မရှိတဲ့အခါ။

Listener function ကို argument ဘာမှ မပေးဘဲ ခေါ်ပါတယ်။

`'close'` event emit လုပ်ပြီးတာနဲ့ `InterfaceConstructor` instance က ပြီးဆုံး (finished) သွားပါတယ်။

### Event: `'error'`

`node:readline` `Interface` နဲ့ ဆက်စပ်နေတဲ့ `input` stream ပေါ်မှာ error တစ်ခု ဖြစ်ပေါ်တဲ့အခါ `'error'` event ကို emit လုပ်ပါတယ်။

Listener function ကို `Error` object တစ်ခုတည်းကို argument အဖြစ် ပေးပြီး ခေါ်ပါတယ်။

### Event: `'line'`

`input` stream က line အဆုံးသတ် (end-of-line) input တစ်ခု (`\n`, `\r` (သို့) `\r\n`) လက်ခံရရှိတိုင်း `'line'` event ကို emit လုပ်ပါတယ်။ User က `Enter` (သို့) `Return` ကို နှိပ်တဲ့အခါ များသောအားဖြင့် ဒီလို ဖြစ်တတ်ပါတယ်။

Stream တစ်ခုကနေ data အသစ် ဖတ်ပြီး အဲဒီ stream က နောက်ဆုံး end-of-line marker မပါဘဲ ဆုံးသွားရင်လည်း `'line'` event ကို emit လုပ်ပါတယ်။

Listener function ကို လက်ခံရရှိတဲ့ input ရဲ့ line တစ်ကြောင်းတည်း ပါဝင်တဲ့ string တစ်ခုနဲ့အတူ ခေါ်ပါတယ်။

```js
rl.on('line', (input) => {
  console.log(`Received: ${input}`);
});
```

### Event: `'history'`

History array ပြောင်းလဲသွားတိုင်း `'history'` event ကို emit လုပ်ပါတယ်။

Listener function ကို history array ပါဝင်တဲ့ array တစ်ခုနဲ့အတူ ခေါ်ပါတယ်။ ဒီ array ထဲမှာ — `historySize` နဲ့ `removeHistoryDuplicates` ကြောင့် ထည့်လိုက်တဲ့ lines တွေ၊ ဖယ်ရှားလိုက်တဲ့ lines တွေ အပါအဝင် ပြောင်းလဲမှု အားလုံး ထင်ဟပ်နေပါလိမ့်မယ်။

အဓိက ရည်ရွယ်ချက်ကတော့ listener တစ်ခုကို history သိမ်းဆည်းထားနိုင်အောင် ခွင့်ပြုဖို့ ဖြစ်ပါတယ်။ Listener က history object ကို ပြောင်းလဲဖို့လည်း ဖြစ်နိုင်ပါတယ်။ Password လိုမျိုး — အချို့ lines တွေကို history ထဲ မထည့်မိအောင် တားဆီးဖို့ ဒါက အသုံးဝင်နိုင်ပါတယ်။

```js
rl.on('history', (history) => {
  console.log(`Received: ${history}`);
});
```

### Event: `'pause'`

အောက်ပါ အခြေအနေတွေထဲက တစ်ခုခု ဖြစ်ပေါ်တဲ့အခါ `'pause'` event ကို emit လုပ်ပါတယ်:

* `input` stream ကို pause လုပ်လိုက်တဲ့အခါ။
* `input` stream က pause မဖြစ်သေးဘဲ `'SIGCONT'` event ကို လက်ခံရရှိတဲ့အခါ။ ([`'SIGTSTP'`][] နဲ့ [`'SIGCONT'`][] events တွေကို ကြည့်ပါ။)

Listener function ကို argument ဘာမှ မပေးဘဲ ခေါ်ပါတယ်။

```js
rl.on('pause', () => {
  console.log('Readline paused.');
});
```

### Event: `'resume'`

`input` stream ကို resume လုပ်လိုက်တိုင်း `'resume'` event ကို emit လုပ်ပါတယ်။

Listener function ကို argument ဘာမှ မပေးဘဲ ခေါ်ပါတယ်။

```js
rl.on('resume', () => {
  console.log('Readline resumed.');
});
```

### Event: `'SIGCONT'`

`Ctrl`+`Z` (ဆိုလိုတာက `SIGTSTP`) သုံးပြီး အရင်က background ထဲ ရွှေ့ထားခဲ့တဲ့ Node.js process တစ်ခုကို fg(1p) နဲ့ foreground ဆီ ပြန်ခေါ်လိုက်တဲ့အခါ `'SIGCONT'` event ကို emit လုပ်ပါတယ်။

`SIGTSTP` request မဖြစ်ခင် _ကတည်းက_ `input` stream ကို pause လုပ်ထားခဲ့ရင် ဒီ event ကို emit လုပ်မှာ မဟုတ်ပါဘူး။

Listener function ကို argument ဘာမှ မပေးဘဲ ခေါ်ယူပါတယ်။

```js
rl.on('SIGCONT', () => {
  // `prompt` will automatically resume the stream
  rl.prompt();
});
```

`'SIGCONT'` event က Windows မှာ _မပံ့ပိုး_ ပါဘူး။

### Event: `'SIGINT'`

`input` stream က ပုံမှန်အားဖြင့် `SIGINT` လို့ သိကြတဲ့ `Ctrl+C` input တစ်ခုကို လက်ခံရရှိတိုင်း `'SIGINT'` event ကို emit လုပ်ပါတယ်။ `input` stream က `SIGINT` လက်ခံရရှိတဲ့အခါ `'SIGINT'` event listeners တွေ register လုပ်ထားခြင်း မရှိဘူးဆိုရင် — `'pause'` event ကို emit လုပ်ပါလိမ့်မယ်။

Listener function ကို argument ဘာမှ မပေးဘဲ ခေါ်ယူပါတယ်။

```js
rl.on('SIGINT', () => {
  rl.question('Are you sure you want to exit? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
```

### Event: `'SIGTSTP'`

`input` stream က ပုံမှန်အားဖြင့် `SIGTSTP` လို့ သိကြတဲ့ `Ctrl`+`Z` input တစ်ခုကို လက်ခံရရှိတဲ့အခါ `'SIGTSTP'` event ကို emit လုပ်ပါတယ်။ `input` stream က `SIGTSTP` လက်ခံရရှိတဲ့အခါ `'SIGTSTP'` event listeners တွေ register လုပ်ထားခြင်း မရှိဘူးဆိုရင် — Node.js process ကို background ဆီ ပို့လိုက်ပါလိမ့်မယ်။

fg(1p) သုံးပြီး program ကို ပြန်စ (resume) လုပ်တဲ့အခါ `'pause'` နဲ့ `'SIGCONT'` events တွေကို emit လုပ်ပါလိမ့်မယ်။ `input` stream ကို resume လုပ်ဖို့ ဒါတွေကို သုံးနိုင်ပါတယ်။

Process ကို background ဆီ မပို့ခင် `input` ကို pause လုပ်ထားခဲ့ရင် — `'pause'` နဲ့ `'SIGCONT'` events တွေကို emit လုပ်မှာ မဟုတ်ပါဘူး။

Listener function ကို argument ဘာမှ မပေးဘဲ ခေါ်ယူပါတယ်။

```js
rl.on('SIGTSTP', () => {
  // This will override SIGTSTP and prevent the program from going to the
  // background.
  console.log('Caught SIGTSTP.');
});
```

`'SIGTSTP'` event က Windows မှာ _မပံ့ပိုး_ ပါဘူး။

### `rl.close()`

`rl.close()` method က `InterfaceConstructor` instance ကို ပိတ်ပြီး `input` နဲ့ `output` streams တွေအပေါ် ထိန်းချုပ်မှုကို စွန့်လွှတ်ပါတယ်။ ခေါ်လိုက်တဲ့အခါ `'close'` event ကို emit လုပ်ပါလိမ့်မယ်။

`rl.close()` ခေါ်လိုက်တာက `InterfaceConstructor` instance ကနေ တခြား events တွေ (`'line'` အပါအဝင်) ဆက်ပြီး emit လုပ်တာကို ချက်ချင်း ရပ်တန့်စေတာ မဟုတ်ပါဘူး။

### `rl[Symbol.dispose]()`

`rl.close()` ရဲ့ alias (ခေါ်ဆိုမှု အစားထိုး) တစ်ခုပါ။

### `rl.pause()`

`rl.pause()` method က `input` stream ကို pause လုပ်ပြီး — လိုအပ်ရင် နောက်မှ ပြန် resume လုပ်နိုင်အောင် ခွင့်ပြုပါတယ်။

`rl.pause()` ခေါ်လိုက်တာက `InterfaceConstructor` instance ကနေ တခြား events တွေ (`'line'` အပါအဝင်) ဆက်ပြီး emit လုပ်တာကို ချက်ချင်း ရပ်တန့်စေတာ မဟုတ်ပါဘူး။

### `rl.prompt([preserveCursor])`

* `preserveCursor` {boolean} `true` ဆိုရင် cursor နေရာချထားမှုကို `0` ဆီ ပြန်လည် သတ်မှတ်ခြင်းကနေ တားဆီးပေးပါတယ်။

`rl.prompt()` method က `InterfaceConstructor` instance အတွက် သတ်မှတ်ထားတဲ့ `prompt` ကို `output` ထဲက line အသစ်တစ်ခုမှာ ရေးပေးပြီး — user က input ထည့်ဖို့ နေရာအသစ် တစ်ခု ရရှိစေပါတယ်။

ခေါ်လိုက်တဲ့အခါ `rl.prompt()` က `input` stream ကို pause လုပ်ထားခဲ့ရင် resume လုပ်ပေးပါလိမ့်မယ်။

`InterfaceConstructor` ကို `output` က `null` (သို့) `undefined` နဲ့ ဖန်တီးထားရင် prompt ကို ရေးပေးမှာ မဟုတ်ပါဘူး။

### `rl.resume()`

`rl.resume()` method က `input` stream ကို pause လုပ်ထားခဲ့ရင် resume လုပ်ပေးပါတယ်။

### `rl.setPrompt(prompt)`

* `prompt` {string}

`rl.setPrompt()` method က `rl.prompt()` ခေါ်လိုက်တိုင်း `output` ဆီ ရေးပေးမယ့် prompt ကို သတ်မှတ်ပေးပါတယ်။

### `rl.getPrompt()`

* Returns: {string} လက်ရှိ prompt string ဖြစ်ပါတယ်။

`rl.getPrompt()` method က `rl.prompt()` မှာ သုံးနေတဲ့ လက်ရှိ prompt ကို ပြန်ပေးပါတယ်။

### `rl.write(data[, key])`

* `data` {string}
* `key` {Object}
  * `ctrl` {boolean} `true` ဆိုရင် `Ctrl` key ကို ညွှန်ပြပါတယ်။
  * `meta` {boolean} `true` ဆိုရင် `Meta` key ကို ညွှန်ပြပါတယ်။
  * `shift` {boolean} `true` ဆိုရင် `Shift` key ကို ညွှန်ပြပါတယ်။
  * `name` {string} Key တစ်ခုရဲ့ နာမည်ပါ။

`rl.write()` method က `data` (သို့) `key` နဲ့ ဖော်ပြတဲ့ key sequence တစ်ခုကို `output` ဆီ ရေးပေးပါလိမ့်မယ်။ `output` က [TTY][] text terminal တစ်ခု ဖြစ်မှသာ `key` argument ကို ပံ့ပိုးပေးပါတယ်။ Key ပေါင်းစပ်မှုများရဲ့ စာရင်းအတွက် [TTY keybindings][] ကို ကြည့်ပါ။

`key` ကို သတ်မှတ်ပေးထားရင် `data` ကို လျစ်လျူရှုပါတယ်။

ခေါ်လိုက်တဲ့အခါ `rl.write()` က `input` stream ကို pause လုပ်ထားခဲ့ရင် resume လုပ်ပေးပါလိမ့်မယ်။

`InterfaceConstructor` ကို `output` က `null` (သို့) `undefined` နဲ့ ဖန်တီးထားရင် `data` နဲ့ `key` တွေကို ရေးပေးမှာ မဟုတ်ပါဘူး။

```js
rl.write('Delete this!');
// Simulate Ctrl+U to delete the line written previously
rl.write(null, { ctrl: true, name: 'u' });
```

`rl.write()` method က data ကို `readline` `Interface` ရဲ့ `input` ဆီ — _user ကိုယ်တိုင် ထည့်ပေးလိုက်သလိုမျိုး_ ရေးပေးပါလိမ့်မယ်။

### `rl[Symbol.asyncIterator]()`

* Returns: {AsyncIterator}

Input stream ထဲက line တစ်ကြောင်းချင်းစီကို string အနေနဲ့ ဖြတ်သန်း iterate လုပ်မယ့် `AsyncIterator` object တစ်ခုကို ဖန်တီးပါတယ်။ ဒီ method က `InterfaceConstructor` objects တွေကို `for await...of` loops တွေကနေ asynchronous အနေနဲ့ iterate လုပ်နိုင်အောင် ခွင့်ပြုပါတယ်။

Input stream ထဲက errors တွေကို forward (ထပ်ဆင့်ပို့) လုပ်မှာ မဟုတ်ပါဘူး။

Loop ကို `break`, `throw` (သို့) `return` နဲ့ အဆုံးသတ်လိုက်ရင် [`rl.close()`][] ကို ခေါ်ပါလိမ့်မယ်။ တစ်နည်းပြောရရင် — `InterfaceConstructor` တစ်ခုကို iterate လုပ်တာက input stream ကို အမြဲတမ်း အပြည့်အဝ သုံးစွဲ (consume) လိုက်တာ ဖြစ်ပါတယ်။

Performance ကတော့ သမားရိုးကျ `'line'` event API လောက် မကောင်းပါဘူး။ Performance အရေးကြီးတဲ့ applications တွေအတွက် `'line'` ကို အစား သုံးပါ။

```js
async function processLineByLine() {
  const rl = readline.createInterface({
    // ...
  });

  for await (const line of rl) {
    // Each line in the readline input will be successively available here as
    // `line`.
  }
}
```

`readline.createInterface()` ကို ခေါ်လိုက်တာနဲ့ input stream ကို စတင် consume လုပ်ပါလိမ့်မယ်။ Interface ဖန်တီးခြင်းနဲ့ asynchronous iteration အကြားမှာ asynchronous operations တွေ ရှိနေရင် lines တွေ လွတ်သွား (missed) နိုင်ပါတယ်။

### `rl.line`

* Type: {string}

Node က လက်ရှိ process လုပ်နေတဲ့ input data ပါ။

TTY stream တစ်ခုကနေ input စုဆောင်းနေတဲ့အခါ — `line` event မထုတ်ခင် အခုထိ process လုပ်ပြီးသား လက်ရှိတန်ဖိုးကို ပြန်ယူဖို့ ဒါကို သုံးနိုင်ပါတယ်။ `line` event emit လုပ်ပြီးတာနဲ့ ဒီ property က empty string ဖြစ်သွားပါလိမ့်မယ်။

`rl.cursor` ကိုပါ တစ်ပြိုင်နက် ထိန်းချုပ်မထားဘူးဆိုရင် — instance run နေချိန်အတွင်း ဒီ value ကို ပြုပြင်မွမ်းမံတာက မလိုလားအပ်တဲ့ အကျိုးဆက်တွေ ဖြစ်စေနိုင်တာ သတိပြုပါ။

**Input အတွက် TTY stream မသုံးဘူးဆိုရင် [`'line'`][] event ကို သုံးပါ။**

ဖြစ်နိုင်ခြေရှိတဲ့ အသုံးပြုမှု နမူနာ တစ်ခုကတော့ အောက်မှာ ပြထားပါတယ်:

```js
const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = debounce(() => {
  console.log(
    '\n',
    values.filter((val) => val.startsWith(rl.line)).join(' '),
  );
}, 300);
process.stdin.on('keypress', (c, k) => {
  showResults();
});
```

### `rl.cursor`

* Type: {number|undefined}

`rl.line` နဲ့ ယှဉ်လျက် cursor ရဲ့ အနေအထား (position) ပါ။

TTY stream တစ်ခုကနေ input ဖတ်တဲ့အခါ — လက်ရှိ cursor က input string ထဲ ဘယ်နေရာမှာ ရောက်နေလဲဆိုတာကို ဒါက ခြေရာခံပေးပါတယ်။ Cursor ရဲ့ အနေအထားက — input process လုပ်တဲ့အခါ ပြုပြင်မယ့် input string ရဲ့ အပိုင်း၊ ပြီးတော့ terminal ရဲ့ caret ကို render လုပ်မယ့် column တို့ကို ဆုံးဖြတ်ပေးပါတယ်။

### `rl.getCursorPos()`

* Returns: {Object}
  * `rows` {number} cursor က လက်ရှိ ရောက်နေတဲ့ prompt ရဲ့ row ပါ။
  * `cols` {number} cursor က လက်ရှိ ရောက်နေတဲ့ screen column ပါ။

Input prompt + string နဲ့ ဆက်စပ်လျက် cursor ရဲ့ တကယ့် အနေအထားကို ပြန်ပေးပါတယ်။ ရှည်လျားတဲ့ (လိပ်နေတဲ့) input strings တွေအပြင် line မျိုးစုံ ပါတဲ့ prompts တွေကိုပါ တွက်ချက်မှုထဲ ထည့်သွင်းပါတယ်။

## Promises API (promise အခြေပြု API)

### Class: `readlinePromises.Interface`

* Extends: {readline.InterfaceConstructor}

`readlinePromises.Interface` class ရဲ့ instances တွေကို `readlinePromises.createInterface()` method နဲ့ ဖန်တီးပါတယ်။ Instance တိုင်းက `input` [Readable][] stream တစ်ခုတည်းနဲ့ `output` [Writable][] stream တစ်ခုတည်းနဲ့ ဆက်စပ်နေပါတယ်။ `output` stream ကို — `input` stream ပေါ်မှာ ရောက်ရှိလာပြီး ဖတ်ယူတဲ့ user input တွေအတွက် prompts တွေ ရိုက်နှိပ်ဖို့ သုံးပါတယ်။

#### `rl.question(query[, options])`

* `query` {string} Prompt ရဲ့ ရှေ့မှာ ထည့်ပြီး `output` ဆီ ရေးဖို့ statement (သို့) query တစ်ခုပါ။
* `options` {Object}
  * `signal` {AbortSignal} `question()` ကို `AbortSignal` သုံးပြီး cancel လုပ်နိုင်အောင် ရွေးချယ်နိုင်တဲ့ အနေနဲ့ ခွင့်ပြုပါတယ်။
* Returns: {Promise} `query` ကို တုံ့ပြန်တဲ့အနေနဲ့ user ရဲ့ input နဲ့အတူ fulfilled ဖြစ်တဲ့ promise တစ်ခုပါ။

`rl.question()` method က `query` ကို `output` ဆီ ရေးပြီး ပြသပါတယ်။ `input` ပေါ်မှာ user input ပေးအပ်ဖို့ စောင့်ဆိုင်းပြီး — ပေးလိုက်တဲ့ input ကို ပထမဆုံး argument အဖြစ် ထည့်ကာ `callback` function ကို ခေါ်ပါတယ်။

ခေါ်လိုက်တဲ့အခါ `rl.question()` က `input` stream ကို pause လုပ်ထားခဲ့ရင် resume လုပ်ပေးပါလိမ့်မယ်။

`readlinePromises.Interface` ကို `output` က `null` (သို့) `undefined` နဲ့ ဖန်တီးထားရင် `query` ကို ရေးပေးမှာ မဟုတ်ပါဘူး။

`rl.close()` ပြီးမှ question ကို ခေါ်လိုက်ရင် rejected promise တစ်ခုကို ပြန်ပေးပါတယ်။

ဥပမာ အသုံးပြုမှု:

```mjs
const answer = await rl.question('What is your favorite food? ');
console.log(`Oh, so your favorite food is ${answer}`);
```

`AbortSignal` တစ်ခုကို သုံးပြီး question တစ်ခုကို cancel လုပ်ခြင်း။

```mjs
const signal = AbortSignal.timeout(10_000);

signal.addEventListener('abort', () => {
  console.log('The food question timed out');
}, { once: true });

const answer = await rl.question('What is your favorite food? ', { signal });
console.log(`Oh, so your favorite food is ${answer}`);
```

### Class: `readlinePromises.Readline`

#### `new readlinePromises.Readline(stream[, options])`

* `stream` {stream.Writable} [TTY][] stream တစ်ခုပါ။
* `options` {Object}
  * `autoCommit` {boolean} `true` ဆိုရင် `rl.commit()` ကို ခေါ်စရာ မလိုပါဘူး။

#### `rl.clearLine(dir)`

* `dir` {integer}
  * `-1`: cursor ကနေ ဘယ်ဘက်ဆီ
  * `1`: cursor ကနေ ညာဘက်ဆီ
  * `0`: line တစ်ကြောင်းလုံး
* Returns: this

`rl.clearLine()` method က pending actions တွေရဲ့ internal list ထဲကို — `dir` နဲ့ သတ်မှတ်ထားတဲ့ ဦးတည်ချက် တစ်ခုအလိုက် ဆက်စပ်နေတဲ့ `stream` ရဲ့ လက်ရှိ line ကို ရှင်းလင်းပေးမယ့် action တစ်ခုကို ထည့်ပေးပါတယ်။ Constructor ဆီ `autoCommit: true` ပေးထားခြင်း မရှိဘူးဆိုရင် — ဒီ method ရဲ့ အကျိုးသက်ရောက်မှုကို မြင်ဖို့ `rl.commit()` ကို ခေါ်ပါ။

#### `rl.clearScreenDown()`

* Returns: this

`rl.clearScreenDown()` method က pending actions တွေရဲ့ internal list ထဲကို — ဆက်စပ်နေတဲ့ stream ကို cursor ရဲ့ လက်ရှိ အနေအထားကနေ အောက်ဘက် ရှင်းလင်းပေးမယ့် action တစ်ခုကို ထည့်ပေးပါတယ်။ Constructor ဆီ `autoCommit: true` ပေးထားခြင်း မရှိဘူးဆိုရင် — ဒီ method ရဲ့ အကျိုးသက်ရောက်မှုကို မြင်ဖို့ `rl.commit()` ကို ခေါ်ပါ။

#### `rl.commit()`

* Returns: {Promise}

`rl.commit()` method က pending actions အားလုံးကို ဆက်စပ်နေတဲ့ `stream` ဆီ ပို့ပေးပြီး pending actions တွေရဲ့ internal list ကို ရှင်းလင်းပါတယ်။

#### `rl.cursorTo(x[, y])`

* `x` {integer}
* `y` {integer}
* Returns: this

`rl.cursorTo()` method က pending actions တွေရဲ့ internal list ထဲကို — ဆက်စပ်နေတဲ့ `stream` ထဲက သတ်မှတ်ထားတဲ့ အနေအထားဆီ cursor ကို ရွှေ့ပေးမယ့် action တစ်ခုကို ထည့်ပေးပါတယ်။ Constructor ဆီ `autoCommit: true` ပေးထားခြင်း မရှိဘူးဆိုရင် — ဒီ method ရဲ့ အကျိုးသက်ရောက်မှုကို မြင်ဖို့ `rl.commit()` ကို ခေါ်ပါ။

#### `rl.moveCursor(dx, dy)`

* `dx` {integer}
* `dy` {integer}
* Returns: this

`rl.moveCursor()` method က pending actions တွေရဲ့ internal list ထဲကို — ဆက်စပ်နေတဲ့ `stream` ထဲက cursor ရဲ့ လက်ရှိ အနေအထားကို မှီလျက် cursor ကို _ဆွေမျိုး (relative)_ အနေနဲ့ ရွှေ့ပေးမယ့် action တစ်ခုကို ထည့်ပေးပါတယ်။ Constructor ဆီ `autoCommit: true` ပေးထားခြင်း မရှိဘူးဆိုရင် — ဒီ method ရဲ့ အကျိုးသက်ရောက်မှုကို မြင်ဖို့ `rl.commit()` ကို ခေါ်ပါ။

#### `rl.rollback()`

* Returns: this

`rl.rollback` method က pending actions တွေကို ဆက်စပ်နေတဲ့ `stream` ဆီ မပို့ဘဲ internal list ကို ရှင်းလင်းပေးပါတယ်။

### `readlinePromises.createInterface(options)`

* `options` {Object}
  * `input` {stream.Readable} နားထောင်ဖို့ [Readable][] stream ပါ။ ဒီ option က _မဖြစ်မနေ လိုအပ်_ ပါတယ်။
  * `output` {stream.Writable} readline data တွေကို ရေးဖို့ [Writable][] stream ပါ။
  * `completer` {Function} Tab autocompletion အတွက် သုံးတဲ့ optional function တစ်ခုပါ။
  * `terminal` {boolean} `input` နဲ့ `output` streams တွေကို TTY တစ်ခုလို သဘောထားပြီး ANSI/VT100 escape codes တွေ ရေးပေးသင့်ရင် `true` ဖြစ်ပါတယ်။ **Default:** instantiation လုပ်တဲ့အခါ `output` stream ပေါ်မှာ `isTTY` ကို စစ်ဆေးခြင်း ဖြစ်ပါတယ်။
  * `history` {string\[]} History lines တွေရဲ့ ကနဦး list ပါ။ ဒီ option က `terminal` ကို user (သို့) internal `output` check က `true` လို့ သတ်မှတ်မှသာ အဓိပ္ပာယ် ရှိပါတယ် — မဟုတ်ရင် history caching mechanism ကို လုံးဝ initialize လုပ်မှာ မဟုတ်ပါဘူး။ **Default:** `[]`။
  * `historySize` {number} သိမ်းဆည်းထားမယ့် history lines အများဆုံး အရေအတွက်ပါ။ History ကို disable လုပ်ချင်ရင် ဒီ value ကို `0` လို့ သတ်မှတ်ပါ။ ဒီ option က `terminal` ကို user (သို့) internal `output` check က `true` လို့ သတ်မှတ်မှသာ အဓိပ္ပာယ် ရှိပါတယ် — မဟုတ်ရင် history caching mechanism ကို လုံးဝ initialize လုပ်မှာ မဟုတ်ပါဘူး။ **Default:** `30`။
  * `removeHistoryDuplicates` {boolean} `true` ဆိုရင် history list ထဲကို input line အသစ် တစ်ခု ထည့်တဲ့အခါ အရင် line ဟောင်း တစ်ခုနဲ့ ထပ်နေရင် — အဲဒီ line အဟောင်းကို list ကနေ ဖယ်ရှားပေးပါတယ်။ **Default:** `false`။
  * `prompt` {string} သုံးမယ့် prompt string ပါ။ **Default:** `'> '`။
  * `crlfDelay` {number} `\r` နဲ့ `\n` အကြား delay က `crlfDelay` milliseconds ထက် ကျော်လွန်ရင် — `\r` ရော `\n` ရော သီးခြား end-of-line inputs တွေအဖြစ် သဘောထားပါတယ်။ `crlfDelay` ကို `100` ထက် မနည်းတဲ့ ကိန်းတစ်ခုအဖြစ် အတင်းပြောင်း (coerce) လုပ်ပါတယ်။ `Infinity` လို့ သတ်မှတ်နိုင်ပြီး — အဲဒီအခါ `\r` နောက်ကို `\n` လိုက်တာကို single newline တစ်ခုတည်းအဖြစ် အမြဲ သတ်မှတ်ပါလိမ့်မယ် (`\r\n` line delimiter ပါတဲ့ [reading files][] အတွက် ဒါက သင့်လျော်နိုင်ပါတယ်)။ **Default:** `100`။
  * `escapeCodeTimeout` {number} `readlinePromises` က character တစ်ခုအတွက် စောင့်ဆိုင်းမယ့် ကြာချိန် (milliseconds နဲ့) ဖြစ်ပြီး — မရေရာတဲ့ (ambiguous) key sequence တစ်ခုကို ဖတ်တဲ့အခါ၊ အခုထိ ဖတ်ပြီးသား input နဲ့ key sequence အပြည့်အစုံ ဖွဲ့စည်းနိုင်သလို — ပိုရှည်တဲ့ key sequence ပြည့်စုံဖို့ နောက်ထပ် input တွေကိုပါ လက်ခံနိုင်တဲ့ sequence မျိုးကို ဆိုလိုပါတယ်။ **Default:** `500`။
  * `tabSize` {integer} Tab တစ်ခုနဲ့ ညီမျှတဲ့ spaces အရေအတွက် (အနည်းဆုံး 1) ပါ။ **Default:** `8`။
  * `signal` {AbortSignal} `AbortSignal` တစ်ခုကို သုံးပြီး interface ကို ပိတ်နိုင်အောင် ခွင့်ပြုပါတယ်။
* Returns: {readlinePromises.Interface}

`readlinePromises.createInterface()` method က `readlinePromises.Interface` instance အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။

```mjs
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```cjs
const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```

`readlinePromises.Interface` instance ကို ဖန်တီးပြီးတာနဲ့ အသုံးအများဆုံး ကိစ္စကတော့ `'line'` event ကို နားထောင်တာပါ:

```js
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```

ဒီ instance အတွက် `terminal` က `true` ဆိုရင် — `output` stream က `output.columns` property တစ်ခုကို သတ်မှတ်ပေးပြီး columns တွေ ပြောင်းလဲတဲ့အခါ (သို့) ပြောင်းလဲလျှင် `output` ပေါ်မှာ `'resize'` event တစ်ခုကို emit လုပ်ပေးမယ်ဆိုရင် — အကောင်းဆုံး လိုက်ဖက်ညီမှု (compatibility) ရရှိပါလိမ့်မယ် ([`process.stdout`][] က TTY တစ်ခု ဖြစ်တဲ့အခါ ဒါကို အလိုအလျောက် လုပ်ပေးပါတယ်)။

#### `completer` function ကို အသုံးပြုခြင်း (Use of the `completer` function)

`completer` function က user ရိုက်ထည့်ထားတဲ့ လက်ရှိ line ကို argument အဖြစ် လက်ခံပြီး — entries 2 ခု ပါတဲ့ `Array` တစ်ခုကို ပြန်ပေးပါတယ်:

* Completion အတွက် ကိုက်ညီတဲ့ entries တွေ ပါတဲ့ `Array` တစ်ခု။
* Matching လုပ်ဖို့ သုံးခဲ့တဲ့ substring။

ဥပမာ: `[[substr1, substr2, ...], originalsubstring]`။

```js
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}
```

`completer` function က {Promise} တစ်ခုကိုလည်း ပြန်ပေးနိုင်သလို — asynchronous လည်း ဖြစ်နိုင်ပါတယ်:

```js
async function completer(linePartial) {
  await someAsyncWork();
  return [['123'], linePartial];
}
```

## Callback API (callback အခြေပြု API)

### Class: `readline.Interface`

* Extends: {readline.InterfaceConstructor}

`readline.Interface` class ရဲ့ instances တွေကို `readline.createInterface()` method နဲ့ ဖန်တီးပါတယ်။ Instance တိုင်းက `input` [Readable][] stream တစ်ခုတည်းနဲ့ `output` [Writable][] stream တစ်ခုတည်းနဲ့ ဆက်စပ်နေပါတယ်။ `output` stream ကို — `input` stream ပေါ်မှာ ရောက်ရှိလာပြီး ဖတ်ယူတဲ့ user input တွေအတွက် prompts တွေ ရိုက်နှိပ်ဖို့ သုံးပါတယ်။

#### `rl.question(query[, options], callback)`

* `query` {string} Prompt ရဲ့ ရှေ့မှာ ထည့်ပြီး `output` ဆီ ရေးဖို့ statement (သို့) query တစ်ခုပါ။
* `options` {Object}
  * `signal` {AbortSignal} `question()` ကို `AbortController` သုံးပြီး cancel လုပ်နိုင်အောင် ရွေးချယ်နိုင်တဲ့ အနေနဲ့ ခွင့်ပြုပါတယ်။
* `callback` {Function} `query` ကို တုံ့ပြန်တဲ့အနေနဲ့ user ရဲ့ input နဲ့အတူ ခေါ်ယူတဲ့ callback function တစ်ခုပါ။

`rl.question()` method က `query` ကို `output` ဆီ ရေးပြီး ပြသပါတယ်။ `input` ပေါ်မှာ user input ပေးအပ်ဖို့ စောင့်ဆိုင်းပြီး — ပေးလိုက်တဲ့ input ကို ပထမဆုံး argument အဖြစ် ထည့်ကာ `callback` function ကို ခေါ်ပါတယ်။

ခေါ်လိုက်တဲ့အခါ `rl.question()` က `input` stream ကို pause လုပ်ထားခဲ့ရင် resume လုပ်ပေးပါလိမ့်မယ်။

`readline.Interface` ကို `output` က `null` (သို့) `undefined` နဲ့ ဖန်တီးထားရင် `query` ကို ရေးပေးမှာ မဟုတ်ပါဘူး။

`rl.question()` ဆီ ပေးလိုက်တဲ့ `callback` function က — `Error` object (သို့) `null` ကို ပထမဆုံး argument အဖြစ် လက်ခံတဲ့ ပုံမှန် pattern ကို လိုက်နာတာ မဟုတ်ပါဘူး။ `callback` ကို ပေးလိုက်တဲ့ answer တစ်ခုတည်းကိုပဲ argument အဖြစ် ထည့်ပြီး ခေါ်ပါတယ်။

`rl.close()` ပြီးမှ `rl.question()` ကို ခေါ်လိုက်ရင် error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဥပမာ အသုံးပြုမှု:

```js
rl.question('What is your favorite food? ', (answer) => {
  console.log(`Oh, so your favorite food is ${answer}`);
});
```

`AbortController` တစ်ခုကို သုံးပြီး question တစ်ခုကို cancel လုပ်ခြင်း။

```js
const ac = new AbortController();
const signal = ac.signal;

rl.question('What is your favorite food? ', { signal }, (answer) => {
  console.log(`Oh, so your favorite food is ${answer}`);
});

signal.addEventListener('abort', () => {
  console.log('The food question timed out');
}, { once: true });

setTimeout(() => ac.abort(), 10000);
```

### `readline.clearLine(stream, dir[, callback])`

* `stream` {stream.Writable}
* `dir` {number}
  * `-1`: cursor ကနေ ဘယ်ဘက်ဆီ
  * `1`: cursor ကနေ ညာဘက်ဆီ
  * `0`: line တစ်ကြောင်းလုံး
* `callback` {Function} Operation ပြီးစီးတာနဲ့ ခေါ်ယူပါတယ်။
* Returns: {boolean} `false` ဆိုတာ — `stream` က နောက်ထပ် data တွေ ဆက်မရေးသားခင် `'drain'` event emit ဖြစ်တာကို စောင့်ဆိုင်းဖို့ calling code ကို တောင်းဆိုနေတဲ့အခါ ဖြစ်ပြီး — မဟုတ်ရင် `true` ပါ။

`readline.clearLine()` method က ပေးထားတဲ့ [TTY][] stream ရဲ့ လက်ရှိ line ကို `dir` နဲ့ သတ်မှတ်ထားတဲ့ ဦးတည်ချက် တစ်ခုအလိုက် ရှင်းလင်းပေးပါတယ်။

### `readline.clearScreenDown(stream[, callback])`

* `stream` {stream.Writable}
* `callback` {Function} Operation ပြီးစီးတာနဲ့ ခေါ်ယူပါတယ်။
* Returns: {boolean} `false` ဆိုတာ — `stream` က နောက်ထပ် data တွေ ဆက်မရေးသားခင် `'drain'` event emit ဖြစ်တာကို စောင့်ဆိုင်းဖို့ calling code ကို တောင်းဆိုနေတဲ့အခါ ဖြစ်ပြီး — မဟုတ်ရင် `true` ပါ။

`readline.clearScreenDown()` method က ပေးထားတဲ့ [TTY][] stream ကို cursor ရဲ့ လက်ရှိ အနေအထားကနေ အောက်ဘက် ရှင်းလင်းပေးပါတယ်။

### `readline.createInterface(options)`

* `options` {Object}
  * `input` {stream.Readable} နားထောင်ဖို့ [Readable][] stream ပါ။ ဒီ option က _မဖြစ်မနေ လိုအပ်_ ပါတယ်။
  * `output` {stream.Writable} readline data တွေကို ရေးဖို့ [Writable][] stream ပါ။
  * `completer` {Function} Tab autocompletion အတွက် သုံးတဲ့ optional function တစ်ခုပါ။
  * `terminal` {boolean} `input` နဲ့ `output` streams တွေကို TTY တစ်ခုလို သဘောထားပြီး ANSI/VT100 escape codes တွေ ရေးပေးသင့်ရင် `true` ဖြစ်ပါတယ်။ **Default:** instantiation လုပ်တဲ့အခါ `output` stream ပေါ်မှာ `isTTY` ကို စစ်ဆေးခြင်း ဖြစ်ပါတယ်။
  * `history` {string\[]} History lines တွေရဲ့ ကနဦး list ပါ။ ဒီ option က `terminal` ကို user (သို့) internal `output` check က `true` လို့ သတ်မှတ်မှသာ အဓိပ္ပာယ် ရှိပါတယ် — မဟုတ်ရင် history caching mechanism ကို လုံးဝ initialize လုပ်မှာ မဟုတ်ပါဘူး။ **Default:** `[]`။
  * `historySize` {number} သိမ်းဆည်းထားမယ့် history lines အများဆုံး အရေအတွက်ပါ။ History ကို disable လုပ်ချင်ရင် ဒီ value ကို `0` လို့ သတ်မှတ်ပါ။ ဒီ option က `terminal` ကို user (သို့) internal `output` check က `true` လို့ သတ်မှတ်မှသာ အဓိပ္ပာယ် ရှိပါတယ် — မဟုတ်ရင် history caching mechanism ကို လုံးဝ initialize လုပ်မှာ မဟုတ်ပါဘူး။ **Default:** `30`။
  * `removeHistoryDuplicates` {boolean} `true` ဆိုရင် history list ထဲကို input line အသစ် တစ်ခု ထည့်တဲ့အခါ အရင် line ဟောင်း တစ်ခုနဲ့ ထပ်နေရင် — အဲဒီ line အဟောင်းကို list ကနေ ဖယ်ရှားပေးပါတယ်။ **Default:** `false`။
  * `prompt` {string} သုံးမယ့် prompt string ပါ။ **Default:** `'> '`။
  * `crlfDelay` {number} `\r` နဲ့ `\n` အကြား delay က `crlfDelay` milliseconds ထက် ကျော်လွန်ရင် — `\r` ရော `\n` ရော သီးခြား end-of-line inputs တွေအဖြစ် သဘောထားပါတယ်။ `crlfDelay` ကို `100` ထက် မနည်းတဲ့ ကိန်းတစ်ခုအဖြစ် အတင်းပြောင်း (coerce) လုပ်ပါတယ်။ `Infinity` လို့ သတ်မှတ်နိုင်ပြီး — အဲဒီအခါ `\r` နောက်ကို `\n` လိုက်တာကို single newline တစ်ခုတည်းအဖြစ် အမြဲ သတ်မှတ်ပါလိမ့်မယ် (`\r\n` line delimiter ပါတဲ့ [reading files][] အတွက် ဒါက သင့်လျော်နိုင်ပါတယ်)။ **Default:** `100`။
  * `escapeCodeTimeout` {number} `readline` က character တစ်ခုအတွက် စောင့်ဆိုင်းမယ့် ကြာချိန် (milliseconds နဲ့) ဖြစ်ပြီး — မရေရာတဲ့ (ambiguous) key sequence တစ်ခုကို ဖတ်တဲ့အခါ၊ အခုထိ ဖတ်ပြီးသား input နဲ့ key sequence အပြည့်အစုံ ဖွဲ့စည်းနိုင်သလို — ပိုရှည်တဲ့ key sequence ပြည့်စုံဖို့ နောက်ထပ် input တွေကိုပါ လက်ခံနိုင်တဲ့ sequence မျိုးကို ဆိုလိုပါတယ်။ **Default:** `500`။
  * `tabSize` {integer} Tab တစ်ခုနဲ့ ညီမျှတဲ့ spaces အရေအတွက် (အနည်းဆုံး 1) ပါ။ **Default:** `8`။
  * `signal` {AbortSignal} `AbortSignal` တစ်ခုကို သုံးပြီး interface ကို ပိတ်နိုင်အောင် ခွင့်ပြုပါတယ်။ Signal ကို abort လုပ်လိုက်ရင် interface ပေါ်မှာ `close` ကို အတွင်းပိုင်း (internally) ကနေ ခေါ်ပေးပါလိမ့်မယ်။
* Returns: {readline.Interface}

`readline.createInterface()` method က `readline.Interface` instance အသစ်တစ်ခုကို ဖန်တီးပေးပါတယ်။

```mjs
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```cjs
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```

`readline.Interface` instance ကို ဖန်တီးပြီးတာနဲ့ အသုံးအများဆုံး ကိစ္စကတော့ `'line'` event ကို နားထောင်တာပါ:

```js
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```

ဒီ instance အတွက် `terminal` က `true` ဆိုရင် — `output` stream က `output.columns` property တစ်ခုကို သတ်မှတ်ပေးပြီး columns တွေ ပြောင်းလဲတဲ့အခါ (သို့) ပြောင်းလဲလျှင် `output` ပေါ်မှာ `'resize'` event တစ်ခုကို emit လုပ်ပေးမယ်ဆိုရင် — အကောင်းဆုံး လိုက်ဖက်ညီမှု (compatibility) ရရှိပါလိမ့်မယ် ([`process.stdout`][] က TTY တစ်ခု ဖြစ်တဲ့အခါ ဒါကို အလိုအလျောက် လုပ်ပေးပါတယ်)။

`stdin` ကို input အဖြစ် သုံးပြီး `readline.Interface` တစ်ခုကို ဖန်တီးတဲ့အခါ — program က [EOF character][] လက်ခံရရှိတဲ့အထိ terminate မှာ မဟုတ်ပါဘူး။ User input ကို မစောင့်ဘဲ ထွက်ချင်ရင် `process.stdin.unref()` ကို ခေါ်ပါ။

#### `completer` function ကို အသုံးပြုခြင်း (Use of the `completer` function)

`completer` function က user ရိုက်ထည့်ထားတဲ့ လက်ရှိ line ကို argument အဖြစ် လက်ခံပြီး — entries 2 ခု ပါတဲ့ `Array` တစ်ခုကို ပြန်ပေးပါတယ်:

* Completion အတွက် ကိုက်ညီတဲ့ entries တွေ ပါတဲ့ `Array` တစ်ခု။
* Matching လုပ်ဖို့ သုံးခဲ့တဲ့ substring။

ဥပမာ: `[[substr1, substr2, ...], originalsubstring]`။

```js
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}
```

`completer` function က argument နှစ်ခုကို လက်ခံမယ်ဆိုရင် asynchronous အနေနဲ့ ခေါ်နိုင်ပါတယ်:

```js
function completer(linePartial, callback) {
  callback(null, [['123'], linePartial]);
}
```

### `readline.cursorTo(stream, x[, y][, callback])`

* `stream` {stream.Writable}
* `x` {number}
* `y` {number}
* `callback` {Function} Operation ပြီးစီးတာနဲ့ ခေါ်ယူပါတယ်။
* Returns: {boolean} `false` ဆိုတာ — `stream` က နောက်ထပ် data တွေ ဆက်မရေးသားခင် `'drain'` event emit ဖြစ်တာကို စောင့်ဆိုင်းဖို့ calling code ကို တောင်းဆိုနေတဲ့အခါ ဖြစ်ပြီး — မဟုတ်ရင် `true` ပါ။

`readline.cursorTo()` method က cursor ကို ပေးထားတဲ့ [TTY][] `stream` ထဲက သတ်မှတ်ထားတဲ့ အနေအထားဆီ ရွှေ့ပေးပါတယ်။

### `readline.moveCursor(stream, dx, dy[, callback])`

* `stream` {stream.Writable}
* `dx` {number}
* `dy` {number}
* `callback` {Function} Operation ပြီးစီးတာနဲ့ ခေါ်ယူပါတယ်။
* Returns: {boolean} `false` ဆိုတာ — `stream` က နောက်ထပ် data တွေ ဆက်မရေးသားခင် `'drain'` event emit ဖြစ်တာကို စောင့်ဆိုင်းဖို့ calling code ကို တောင်းဆိုနေတဲ့အခါ ဖြစ်ပြီး — မဟုတ်ရင် `true` ပါ။

`readline.moveCursor()` method က cursor ကို ပေးထားတဲ့ [TTY][] `stream` ထဲက သူ့ရဲ့ လက်ရှိ အနေအထားကို မှီလျက် _ဆွေမျိုး (relative)_ အနေနဲ့ ရွှေ့ပေးပါတယ်။

## `readline.emitKeypressEvents(stream[, interface])`

* `stream` {stream.Readable}
* `interface` {readline.InterfaceConstructor}

`readline.emitKeypressEvents()` method က ပေးထားတဲ့ [Readable][] stream ကို — လက်ခံရရှိတဲ့ input တွေနဲ့ သက်ဆိုင်တဲ့ `'keypress'` events တွေ စတင် emit လုပ်စေပါတယ်။

Optionally အနေနဲ့ — copy-paste လုပ်ထားတဲ့ input တစ်ခုကို detect လုပ်မိတဲ့အခါ autocompletion ကို disable လုပ်ပေးမယ့် `readline.Interface` instance တစ်ခုကို `interface` က သတ်မှတ်ပေးနိုင်ပါတယ်။

`stream` က [TTY][] တစ်ခုဆိုရင် — raw mode မှာ ရှိရပါမယ်။

`input` က terminal တစ်ခုဆိုရင် — readline instance တိုင်းက သူ့ရဲ့ `input` ပေါ်မှာ ဒါကို အလိုအလျောက် ခေါ်ပေးပါတယ်။ `readline` instance ကို ပိတ်လိုက်တာက `input` ကနေ `'keypress'` events တွေ emit လုပ်တာကို ရပ်တန့်စေမှာ မဟုတ်ပါဘူး။

```js
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
```

## ဥပမာ — Tiny CLI (Example: Tiny CLI)

အောက်က ဥပမာက `readline.Interface` class ကို သုံးပြီး command-line interface အသေးစားတစ်ခု အကောင်အထည်ဖော်ပုံကို ဖော်ပြပါတယ်:

```mjs
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  exit(0);
});
```

```cjs
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```

## Example: Read file stream line-by-Line

`readline` အတွက် အသုံးများတဲ့ ကိစ္စတစ်ခုကတော့ input file တစ်ခုကို တစ်ကြောင်းချင်း (one line at a time) သုံးစွဲတာပါ။ ဒါကို လုပ်ဖို့ အလွယ်ဆုံး နည်းကတော့ [`fs.ReadStream`][] API ကို `for await...of` loop တစ်ခုနဲ့တွဲ သုံးတာပါ:

```mjs
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```

```cjs
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```

တစ်နည်းအားဖြင့် [`'line'`][] event ကိုလည်း သုံးနိုင်ပါတယ်:

```mjs
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```

```cjs
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```

လက်ရှိမှာ `for await...of` loop က နည်းနည်း ပိုနှေးနိုင်ပါတယ်။ `async` / `await` flow ရော speed ရော နှစ်ခုလုံး အရေးကြီးတယ်ဆိုရင် — ရောနှော (mixed) ချဉ်းကပ်နည်း တစ်ခုကို သုံးနိုင်ပါတယ်:

```mjs
import { once } from 'node:events';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```

```cjs
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```

## TTY keybindings

| Keybindings | ဖော်ပြချက် | မှတ်ချက်များ |
| --- | --- | --- |
| `Ctrl`+`Shift`+`Backspace` | Line ရဲ့ ဘယ်ဘက်အပိုင်း ဖျက်ခြင်း | Linux, Mac နဲ့ Windows တွေမှာ အလုပ်မလုပ်ပါ |
| `Ctrl`+`Shift`+`Delete` | Line ရဲ့ ညာဘက်အပိုင်း ဖျက်ခြင်း | Mac မှာ အလုပ်မလုပ်ပါ |
| `Ctrl`+`C` | `SIGINT` emit လုပ်ခြင်း (သို့) readline instance ကို ပိတ်ခြင်း |  |
| `Ctrl`+`H` | ဘယ်ဘက်ကို ဖျက်ခြင်း |  |
| `Ctrl`+`D` | ညာဘက်ကို ဖျက်ခြင်း (သို့) — လက်ရှိ line က empty / EOF ဖြစ်နေရင် readline instance ကို ပိတ်ခြင်း | Windows မှာ အလုပ်မလုပ်ပါ |
| `Ctrl`+`U` | လက်ရှိ အနေအထားကနေ line ရဲ့ အစဆီအထိ ဖျက်ခြင်း |  |
| `Ctrl`+`K` | လက်ရှိ အနေအထားကနေ line ရဲ့ အဆုံးဆီအထိ ဖျက်ခြင်း |  |
| `Ctrl`+`Y` | အရင်က ဖျက်ထားခဲ့တဲ့ text ကို ပြန်ဆွဲယူခြင်း (Yank/Recall) | `Ctrl`+`U` (သို့) `Ctrl`+`K` နဲ့ ဖျက်ထားတဲ့ text တွေမှာပဲ အလုပ်လုပ်ပါတယ် |
| `Meta`+`Y` | အရင်က ဖျက်ထားခဲ့တဲ့ texts တွေကြားမှာ လှည့်လည် ရွေးချယ်ခြင်း | နောက်ဆုံး keystroke က `Ctrl`+`Y` (သို့) `Meta`+`Y` ဖြစ်မှသာ ရနိုင်ပါတယ် |
| `Ctrl`+`A` | Line ရဲ့ အစဆီ သွားခြင်း |  |
| `Ctrl`+`E` | Line ရဲ့ အဆုံးဆီ သွားခြင်း |  |
| `Ctrl`+`B` | Character တစ်လုံး နောက်ပြန် |  |
| `Ctrl`+`F` | Character တစ်လုံး ရှေ့သို့ |  |
| `Ctrl`+`L` | Screen ရှင်းလင်းခြင်း |  |
| `Ctrl`+`N` | နောက် history item |  |
| `Ctrl`+`P` | အရင် history item |  |
| `Ctrl`+`-` | အရင် ပြောင်းလဲမှုကို ပြန်ဖျက်ခြင်း (Undo) | Key code `0x1F` ကို emit လုပ်တဲ့ keystroke မှန်သမျှ ဒီ action ကို လုပ်ဆောင်ပါတယ်။ `xterm` လိုမျိုး terminals တော်တော်များများမှာ ဒါကို `Ctrl`+`-` နဲ့ ချိတ်ဆက်ထားပါတယ်။ |
| `Ctrl`+`6` | အရင် ပြောင်းလဲမှုကို ပြန်လုပ်ခြင်း (Redo) | Terminals တော်တော်များများမှာ default redo keystroke မရှိပါဘူး။ Redo လုပ်ဖို့ key code `0x1E` ကို ရွေးထားပါတယ်။ `xterm` မှာတော့ ပုံမှန်အားဖြင့် `Ctrl`+`6` နဲ့ ချိတ်ဆက်ထားပါတယ်။ |
| `Ctrl`+`Z` | Run နေတဲ့ process ကို background ထဲ ရွှေ့ခြင်း။ ပြန်လာဖို့ `fg` လို့ ရိုက်ပြီး `Enter` နှိပ်ပါ။ | Windows မှာ အလုပ်မလုပ်ပါ |
| `Ctrl`+`W` or `Ctrl` +`Backspace` | Word boundary (စကားလုံး နယ်နိမိတ်) အထိ နောက်ပြန် ဖျက်ခြင်း | `Ctrl`+`Backspace` က Linux, Mac နဲ့ Windows တွေမှာ အလုပ်မလုပ်ပါ |
| `Ctrl`+`Delete` | Word boundary အထိ ရှေ့သို့ ဖျက်ခြင်း | Mac မှာ အလုပ်မလုပ်ပါ |
| `Ctrl`+`Left arrow` or `Meta`+`B` | ဘယ်ဘက် word ဆီ ရွှေ့ခြင်း | `Ctrl`+`Left arrow` က Mac မှာ အလုပ်မလုပ်ပါ |
| `Ctrl`+`Right arrow` or `Meta`+`F` | ညာဘက် word ဆီ ရွှေ့ခြင်း | `Ctrl`+`Right arrow` က Mac မှာ အလုပ်မလုပ်ပါ |
| `Meta`+`D` or `Meta` +`Delete` | ညာဘက် word ဖျက်ခြင်း | `Meta`+`Delete` က Windows မှာ အလုပ်မလုပ်ပါ |
| `Meta`+`Backspace` | ဘယ်ဘက် word ဖျက်ခြင်း | Mac မှာ အလုပ်မလုပ်ပါ |

[EOF character]: https://en.wikipedia.org/wiki/End-of-file#EOF_character
[Readable]: stream.md#readable-streams
[TTY]: tty.md
[TTY keybindings]: #tty-keybindings
[Writable]: stream.md#writable-streams
[`'SIGCONT'`]: #event-sigcont
[`'SIGTSTP'`]: #event-sigtstp
[`'line'`]: #event-line
[`fs.ReadStream`]: fs.md#class-fsreadstream
[`process.stdin`]: process.md#processstdin
[`process.stdout`]: process.md#processstdout
[`rl.close()`]: #rlclose
[reading files]: #example-read-file-stream-line-by-line
