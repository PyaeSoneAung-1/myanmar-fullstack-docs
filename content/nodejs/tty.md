---
title: "TTY"
description: "node:tty module — terminal (TTY) တစ်ခုနဲ့ အလုပ်လုပ်ရန် tty.ReadStream နဲ့ tty.WriteStream classes များကို ပံ့ပိုးပေးခြင်း"
order: 118
source: "https://nodejs.org/api/tty.html"
status: translated
updated: 2026-09-04
---
> Stability: 2 - Stable

`node:tty` module က `tty.ReadStream` နဲ့ `tty.WriteStream` classes တွေကို ပံ့ပိုးပေးပါတယ်။ အများစုမှာတော့ ဒီ module ကို တိုက်ရိုက် သုံးဖို့ မလိုအပ်သလို — မဖြစ်နိုင်တာလည်း ရှိပါတယ်။ ဒါပေမယ့် အောက်ပါအတိုင်း ဝင်ရောက်သုံးနိုင်ပါတယ်:

```js
const tty = require('node:tty');
```

Node.js က text terminal ("TTY") တစ်ခုနဲ့ တွဲပြီး run နေတယ်ဆိုတာ သိလိုက်ရတဲ့အခါ — [`process.stdin`][] ကို default အနေနဲ့ `tty.ReadStream` instance တစ်ခုအဖြစ် initialize လုပ်ပြီး၊ [`process.stdout`][] နဲ့ [`process.stderr`][] နှစ်ခုလုံးကိုလည်း default အနေနဲ့ `tty.WriteStream` instances တွေ ဖြစ်စေပါတယ်။ Node.js က TTY context တစ်ခုထဲမှာ run နေလားဆိုတာ ဆုံးဖြတ်ဖို့ အကောင်းဆုံး နည်းလမ်းကတော့ — `process.stdout.isTTY` property ရဲ့ တန်ဖိုးက `true` ဟုတ်မဟုတ် စစ်ဆေးတာပါ:

```console
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```

အများအားဖြင့်တော့ application တစ်ခုက `tty.ReadStream` နဲ့ `tty.WriteStream` classes တွေရဲ့ instances တွေကို ကိုယ်တိုင် ဖန်တီးစရာ အကြောင်းရင်း သိပ်မရှိပါဘူး။

## Class: `tty.ReadStream`

* Extends: {net.Socket}

TTY တစ်ခုရဲ့ readable ဘက်ခြမ်းကို ကိုယ်စားပြုပါတယ်။ ပုံမှန် အခြေအနေတွေမှာ Node.js process တစ်ခုထဲမှာ [`process.stdin`][] က တစ်ခုတည်းသော `tty.ReadStream` instance ဖြစ်လေ့ ရှိပြီး — နောက်ထပ် instances တွေ ဖန်တီးစရာ အကြောင်းမရှိပါဘူး။

### `readStream.isRaw`

TTY က လက်ရှိ raw device အနေနဲ့ လည်ပတ်ဖို့ သတ်မှတ်ထားရင် `true` ဖြစ်တဲ့ `boolean` တစ်ခုပါ။

ဒီ flag က process တစ်ခု စတင်ချိန်မှာ terminal က raw mode နဲ့ လည်ပတ်နေတာတောင် — အမြဲတမ်း `false` ဖြစ်နေပါတယ်။ `setRawMode` ကို နောက်ပိုင်း ခေါ်မှုတွေနဲ့အတူ ဒီတန်ဖိုးက ပြောင်းလဲသွားပါလိမ့်မယ်။

### `readStream.isTTY`

`tty.ReadStream` instances တွေအတွက် အမြဲတမ်း `true` ဖြစ်တဲ့ `boolean` တစ်ခုပါ။

### `readStream.setRawMode(mode)`

* `mode` {boolean|string} `true` (သို့) `'raw'` ဆိုရင် `tty.ReadStream` ကို raw device အနေနဲ့ လည်ပတ်ဖို့ သတ်မှတ်ပါတယ်။ `'io'` ဆိုရင်တော့ `tty.ReadStream` ကို binary-safe I/O mode နဲ့ လည်ပတ်ဖို့ သတ်မှတ်ပါတယ်။ `false` ဆိုရင်တော့ `tty.ReadStream` ကို ၎င်းရဲ့ default mode အတိုင်း သတ်မှတ်ပါတယ်။ `readStream.isRaw` property က stream က raw mode မှာ ရှိမရှိကို သတ်မှတ်ပေးပြီး — `readStream.rawMode` property ကတော့ ရလဒ် mode ကို သတ်မှတ်ပေးပါတယ်။
* Returns: {this} Read stream instance ကိုပဲ ပြန်ပေးပါတယ်။

`tty.ReadStream` ကို raw device အနေနဲ့ လည်ပတ်နိုင်အောင် ပြင်ဆင်သတ်မှတ်ပေးပါတယ်။

Raw mode မှာ input က modifier တွေ မပါဘဲ — character-by-character (စာလုံးတစ်လုံးချင်းစီ) အနေနဲ့ အမြဲတမ်း ရနိုင်ပါတယ်။ ဒါ့အပြင် — input characters တွေကို echo ပြန်လုပ်တာ အပါအဝင် — terminal က input characters တွေကို လုပ်ပေးတဲ့ special processing အားလုံးကို disable လုပ်ထားပါတယ်။ ဒီ mode မှာ `Ctrl`+`C` က `SIGINT` တစ်ခုကို ဖြစ်စေတော့မှာ မဟုတ်ပါဘူး။ ဒီ mode က Unix terminals တွေမှာ newline translation လိုမျိုး terminal output processing တွေကိုတော့ သက်ရောက်မှု မရှိပါဘူး။

Windows မှာ `setRawMode()` က console input buffer ဆီ ရေးသားခွင့် (write permission) လိုအပ်ပါတယ်။ [`fs.open()`][] family ထဲက APIs တွေနဲ့ `"\\\\.\\CONIN$"` ကို ဖွင့်တဲ့အခါ (`new tty.ReadStream()` ဆီ ထည့်ပေးဖို့ အတွက်) — `'r+'` လိုမျိုး read/write flag တစ်ခုကို သေချာပေါက် သုံးပါ။

Binary-safe I/O mode မှာတော့ terminal output processing ကိုပါ disable လုပ်ပါတယ်။ ဒါက libuv ရဲ့ `UV_TTY_MODE_IO` mode နဲ့ ကိုက်ညီပြီး — Windows မှာ support မလုပ်ပါဘူး။

### `readStream.rawMode`

* {boolean|string}

`tty.ReadStream` ရဲ့ လက်ရှိ raw mode ပါ။ Stream က default mode မှာ ရှိနေရင် `false`၊ raw input mode enable ဖြစ်နေရင် `'raw'`၊ binary-safe I/O mode enable ဖြစ်နေရင်တော့ `'io'` ဖြစ်ပါတယ်။

## Class: `tty.WriteStream`

* Extends: {net.Socket}

TTY တစ်ခုရဲ့ writable ဘက်ခြမ်းကို ကိုယ်စားပြုပါတယ်။ ပုံမှန် အခြေအနေတွေမှာ Node.js process တစ်ခုအတွက် [`process.stdout`][] နဲ့ [`process.stderr`][] တို့ကပဲ ဖန်တီးပေးလေ့ ရှိတဲ့ `tty.WriteStream` instances တွေ ဖြစ်ပြီး — နောက်ထပ် instances တွေ ဖန်တီးစရာ အကြောင်းမရှိပါဘူး။

### `new tty.ReadStream(fd[, options])`

* `fd` {number} TTY တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ file descriptor တစ်ခုပါ။
* `options` {Object} Parent `net.Socket` ဆီ ပေးပို့တဲ့ options တွေပါ — [`net.Socket` constructor][] ရဲ့ `options` ကို ကြည့်ပါ။
* Returns: {tty.ReadStream}

TTY တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ `fd` အတွက် `ReadStream` တစ်ခုကို ဖန်တီးပေးပါတယ်။

### `new tty.WriteStream(fd)`

* `fd` {number} TTY တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ file descriptor တစ်ခုပါ။
* Returns: {tty.WriteStream}

TTY တစ်ခုနဲ့ ဆက်စပ်နေတဲ့ `fd` အတွက် `WriteStream` တစ်ခုကို ဖန်တီးပေးပါတယ်။

### Event: `'resize'`

`writeStream.columns` (သို့) `writeStream.rows` properties တစ်ခုခု ပြောင်းလဲသွားတိုင်း `'resize'` event ကို emit လုပ်ပါတယ်။ ခေါ်ယူတဲ့အခါ listener callback ဆီ argument တွေ ဘာမှ ပေးပို့မှာ မဟုတ်ပါဘူး။

```js
process.stdout.on('resize', () => {
  console.log('screen size has changed!');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```

### `writeStream.clearLine(dir[, callback])`

* `dir` {number}
  * `-1`: cursor ရဲ့ ဘယ်ဘက်ဆီသို့
  * `1`: cursor ရဲ့ ညာဘက်ဆီသို့
  * `0`: line တစ်ကြောင်းလုံး
* `callback` {Function} လုပ်ဆောင်မှု ပြီးဆုံးတာနဲ့ တစ်ကြိမ် ခေါ်ပါတယ်။
* Returns: {boolean} Stream က နောက်ထပ် data တွေ ဆက်ရေးခင်မှာ `'drain'` event ကို emit လုပ်ဖို့ calling code ကို စောင့်စေချင်တယ်ဆိုရင် `false` — မဟုတ်ရင် `true` ပါ။

`writeStream.clearLine()` က ဒီ `WriteStream` ရဲ့ လက်ရှိ line ကို `dir` က ညွှန်ပြတဲ့ ဦးတည်ချက် အတိုင်း ရှင်းလင်းပေးပါတယ်။

### `writeStream.clearScreenDown([callback])`

* `callback` {Function} လုပ်ဆောင်မှု ပြီးဆုံးတာနဲ့ တစ်ကြိမ် ခေါ်ပါတယ်။
* Returns: {boolean} Stream က နောက်ထပ် data တွေ ဆက်ရေးခင်မှာ `'drain'` event ကို emit လုပ်ဖို့ calling code ကို စောင့်စေချင်တယ်ဆိုရင် `false` — မဟုတ်ရင် `true` ပါ။

`writeStream.clearScreenDown()` က ဒီ `WriteStream` ကို လက်ရှိ cursor ကနေ အောက်ဘက်အထိ ရှင်းလင်းပေးပါတယ်။

### `writeStream.columns`

TTY မှာ လက်ရှိ ရှိတဲ့ column အရေအတွက်ကို သတ်မှတ်ပေးတဲ့ `number` တစ်ခုပါ။ `'resize'` event ကို emit လုပ်တိုင်း ဒီ property ကို update လုပ်ပါတယ်။

### `writeStream.cursorTo(x[, y][, callback])`

* `x` {number}
* `y` {number}
* `callback` {Function} လုပ်ဆောင်မှု ပြီးဆုံးတာနဲ့ တစ်ကြိမ် ခေါ်ပါတယ်။
* Returns: {boolean} Stream က နောက်ထပ် data တွေ ဆက်ရေးခင်မှာ `'drain'` event ကို emit လုပ်ဖို့ calling code ကို စောင့်စေချင်တယ်ဆိုရင် `false` — မဟုတ်ရင် `true` ပါ။

`writeStream.cursorTo()` က ဒီ `WriteStream` ရဲ့ cursor ကို သတ်မှတ်ထားတဲ့ နေရာဆီ ရွှေ့ပေးပါတယ်။

### `writeStream.getColorDepth([env])`

* `env` {Object} စစ်ဆေးရမယ့် environment variables တွေ ပါဝင်တဲ့ object တစ်ခုပါ။ ဒါက သတ်မှတ်ထားတဲ့ terminal တစ်ခုရဲ့ အသုံးပြုမှုကို simulate (အတုယူ) လုပ်နိုင်အောင် လုပ်ပေးပါတယ်။ **Default:** `process.env`။
* Returns: {number}

အောက်ပါအတိုင်း ပြန်ပေးပါတယ်:

* 2 အတွက် `1`၊
* 16 အတွက် `4`၊
* 256 အတွက် `8`၊
* 16,777,216 colors support လုပ်တာတွေအတွက် `24`။

Terminal က ဘယ်လို colors တွေ support လုပ်လဲ ဆုံးဖြတ်ဖို့ ဒါကို သုံးပါ။ Terminal တွေထဲက colors တွေရဲ့ သဘောသဘာဝကြောင့် — false positives (မှားယွင်းသော အပြုသဘော ရလဒ်များ) (သို့) false negatives (မှားယွင်းသော အပျက်သဘော ရလဒ်များ) ဖြစ်နိုင်ခြေ ရှိပါတယ်။ ဒါက process အချက်အလက်တွေနဲ့ — ဘယ် terminal ကို သုံးနေလဲဆိုတာ မမှန်မကန် ပြောနိုင်တဲ့ environment variables တွေပေါ်မှာ မူတည်ပါတယ်။

သတ်မှတ်ထားတဲ့ terminal တစ်ခုရဲ့ အသုံးပြုမှုကို simulate လုပ်ဖို့ `env` object တစ်ခုကို ထည့်ပေးနိုင်ပါတယ်။ ဒါက သတ်မှတ်ထားတဲ့ environment settings တွေ ဘယ်လို အပြုအမူ ရှိလဲ စစ်ဆေးကြည့်ဖို့ အသုံးဝင်ပါတယ်။

သတ်မှတ်ထားတဲ့ color support တစ်ခုကို အတင်းအကျပ် သုံးစေချင်ရင် အောက်က environment settings တွေထဲက တစ်ခုကို သုံးပါ။

* 2 colors: `FORCE_COLOR = 0` (colors တွေကို disable လုပ်ပါတယ်)
* 16 colors: `FORCE_COLOR = 1`
* 256 colors: `FORCE_COLOR = 2`
* 16,777,216 colors: `FORCE_COLOR = 3`

`NO_COLOR` နဲ့ `NODE_DISABLE_COLORS` environment variables တွေကို သုံးပြီးတော့လည်း color support ကို disable လုပ်နိုင်ပါတယ်။

### `writeStream.getWindowSize()`

* Returns: {number\[]}

`writeStream.getWindowSize()` က ဒီ `WriteStream` နဲ့ ကိုက်ညီတဲ့ TTY ရဲ့ အရွယ်အစားကို ပြန်ပေးပါတယ်။ Array က `[numColumns, numRows]` ပုံစံ ဖြစ်ပြီး — `numColumns` နဲ့ `numRows` တို့က သက်ဆိုင်ရာ TTY ထဲက column နဲ့ row အရေအတွက်တွေကို ကိုယ်စားပြုပါတယ်။

### `writeStream.hasColors([count][, env])`

* `count` {integer} တောင်းဆိုထားတဲ့ colors အရေအတွက်ပါ (အနည်းဆုံး 2)။ **Default:** 16။
* `env` {Object} စစ်ဆေးရမယ့် environment variables တွေ ပါဝင်တဲ့ object တစ်ခုပါ။ ဒါက သတ်မှတ်ထားတဲ့ terminal တစ်ခုရဲ့ အသုံးပြုမှုကို simulate လုပ်နိုင်အောင် လုပ်ပေးပါတယ်။ **Default:** `process.env`။
* Returns: {boolean}

`writeStream` က `count` ထဲမှာ ပေးထားတဲ့ ပမာဏနဲ့ အနည်းဆုံး အမျှ colors တွေကို support လုပ်နိုင်ရင် `true` ကို ပြန်ပေးပါတယ်။ အနိမ့်ဆုံး support ကတော့ 2 (အနက်ရောင် နဲ့ အဖြူရောင်) ပါ။

ဒါက [`writeStream.getColorDepth()`][] မှာ ဖော်ပြထားတဲ့အတိုင်း false positives နဲ့ false negatives တွေ ရှိနိုင်တာချင်း အတူတူပါပဲ။

```js
process.stdout.hasColors();
// Returns true or false depending on if `stdout` supports at least 16 colors.
process.stdout.hasColors(256);
// Returns true or false depending on if `stdout` supports at least 256 colors.
process.stdout.hasColors({ TMUX: '1' });
// Returns true.
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// Returns false (the environment setting pretends to support 2 ** 8 colors).
```

### `writeStream.isTTY`

အမြဲတမ်း `true` ဖြစ်တဲ့ `boolean` တစ်ခုပါ။

### `writeStream.moveCursor(dx, dy[, callback])`

* `dx` {number}
* `dy` {number}
* `callback` {Function} လုပ်ဆောင်မှု ပြီးဆုံးတာနဲ့ တစ်ကြိမ် ခေါ်ပါတယ်။
* Returns: {boolean} Stream က နောက်ထပ် data တွေ ဆက်ရေးခင်မှာ `'drain'` event ကို emit လုပ်ဖို့ calling code ကို စောင့်စေချင်တယ်ဆိုရင် `false` — မဟုတ်ရင် `true` ပါ။

`writeStream.moveCursor()` က ဒီ `WriteStream` ရဲ့ cursor ကို လက်ရှိ အနေအထားကနေ _ဆက်စပ်၍ (relative)_ ရွှေ့ပေးပါတယ်။

### `writeStream.rows`

TTY မှာ လက်ရှိ ရှိတဲ့ row အရေအတွက်ကို သတ်မှတ်ပေးတဲ့ `number` တစ်ခုပါ။ `'resize'` event ကို emit လုပ်တိုင်း ဒီ property ကို update လုပ်ပါတယ်။

## `tty.isatty(fd)`

* `fd` {number} ဂဏန်း file descriptor တစ်ခုပါ။
* Returns: {boolean}

`tty.isatty()` method က ပေးထားတဲ့ `fd` က TTY တစ်ခုနဲ့ ဆက်စပ်နေရင် `true` ကို — မဟုတ်ရင် `false` ကို ပြန်ပေးပါတယ်။ `fd` က non-negative integer မဟုတ်တဲ့ အခြေအနေတွေလည်း အပါအဝင်ပါ။

[`fs.open()`]: fs.md#fsopenpath-flags-mode-callback
[`net.Socket` constructor]: net.md#new-netsocketoptions
[`process.stderr`]: process.md#processstderr
[`process.stdin`]: process.md#processstdin
[`process.stdout`]: process.md#processstdout
[`writeStream.getColorDepth()`]: #writestreamgetcolordepthenv
