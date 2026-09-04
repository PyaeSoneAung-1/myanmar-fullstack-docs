---
title: "Deprecated APIs"
description: "Node.js deprecated APIs (အသုံးမပြုတော့ရန် သတ်မှတ်ထားသော APIs) စာရင်းအပြည့်အစုံ — DEP codes (DEP0001–DEP0206), deprecation အမျိုးအစားများနဲ့ replacements"
order: 141
source: "https://nodejs.org/api/deprecations.html"
status: translated
updated: 2026-09-04
---

Node.js APIs တွေကို အောက်ပါ အကြောင်းရင်းတွေထဲက တစ်ခုခုကြောင့် deprecated (အသုံးမပြုတော့ရန် သတ်မှတ်) လုပ်နိုင်ပါတယ်:

* API ရဲ့ အသုံးပြုမှုက မလုံခြုံလို့ ဖြစ်ပါတယ်။
* ပိုမိုကောင်းမွန်တဲ့ အခြားရွေးချယ်စရာ (alternative) API တစ်ခု ရရှိနိုင်လို့ ဖြစ်ပါတယ်။
* နောင်ထွက်ရှိလာမယ့် major release တစ်ခုမှာ API ကို breaking changes (နောက်ပြန် မလိုက်ဖက်သော ပြောင်းလဲမှုများ) ပြုလုပ်ဖို့ မျှော်လင့်ထားလို့ ဖြစ်ပါတယ်။

Node.js မှာ deprecation အမျိုးအစား လေးမျိုး ရှိပါတယ်:

* Documentation-only
* Application (non-`node_modules` code only)
* Runtime (all code)
* End-of-Life

Documentation-only deprecation ဆိုတာ Node.js API docs တွေထဲမှာသာ ဖော်ပြထားတဲ့ deprecation အမျိုးအစား ဖြစ်ပါတယ်။ ဒါတွေက Node.js လည်ပတ်နေချိန်မှာ ဘေးထွက်ဆိုးကျိုး (side-effect) ဘာမှ မဖြစ်ပေါ်စေပါဘူး။ Documentation-only deprecation တစ်ချို့ကတော့ အောက်မှာ ဖော်ပြထားတဲ့ Runtime deprecation တွေလိုပဲ — [`--pending-deprecation`][] flag (သို့မဟုတ် ၎င်းရဲ့ အခြားနည်းလမ်းဖြစ်တဲ့ `NODE_PENDING_DEPRECATION=1` environment variable) နဲ့ စတင်လိုက်တဲ့အခါ runtime warning တစ်ခုကို ဖြစ်ပေါ်စေပါတယ်။ အဲဒီ flag ကို ပံ့ပိုးပေးတဲ့ Documentation-only deprecation တွေကိုတော့ [Deprecated APIs စာရင်း](https://nodejs.org/api/deprecations.html#list-of-deprecated-apis) ထဲမှာ ထို့အတူ အတိအကျ အမှတ်အသား ပြုထားပါတယ်။

non-`node_modules` code တွေအတွက်သာ သက်ရောက်တဲ့ Application deprecation က default အနေနဲ့ process warning တစ်ခုကို ဖြစ်ပေါ်စေပြီး — `node_modules` ကနေ load လုပ်ထားခြင်း မရှိတဲ့ code ထဲမှာ deprecated API ကို ပထမဆုံး အကြိမ် သုံးလိုက်တဲ့အခါ — `stderr` ဆီကို print လုပ်ပါလိမ့်မယ်။ [`--throw-deprecation`][] command-line flag ကို သုံးထားရင် Runtime deprecation တစ်ခုက error တစ်ခုကို throw လုပ်စေမှာ ဖြစ်ပါတယ်။ [`--pending-deprecation`][] ကို သုံးထားရင်တော့ `node_modules` ကနေ load လုပ်ထားတဲ့ code အတွက်ပါ warnings တွေကို emit လုပ်ပေးပါလိမ့်မယ်။

Code အားလုံးအတွက် သက်ရောက်တဲ့ runtime deprecation ကတော့ — non-`node_modules` code အတွက် runtime deprecation နဲ့ ဆင်တူပေမယ့် — `node_modules` ကနေ load လုပ်ထားတဲ့ code အတွက်ပါ warning တစ်ခုကို emit လုပ်ပေးတယ်ဆိုတဲ့ အချက်မှာတော့ ကွာခြားပါတယ်။

End-of-Life deprecation ကိုတော့ — လုပ်ဆောင်ချက် (functionality) တစ်ခုက Node.js ကနေ ဖယ်ရှားခံထားရပြီ ဖြစ်စေ၊ မကြာခင် ဖယ်ရှားတော့မယ် ဖြစ်စေ — ရှိတဲ့အခါမျိုးမှာ သုံးပါတယ်။

## Deprecations ပြန်လည်ရုတ်သိမ်းခြင်း (Revoking deprecations)

ရံဖန်ရံခါမှာ API တစ်ခုရဲ့ deprecation ကို ပြန်လည် ရုတ်သိမ်းလိုက်တာမျိုး ဖြစ်နိုင်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ ဒီ document ကို အဆုံးအဖြတ်နဲ့ သက်ဆိုင်တဲ့ အချက်အလက်တွေနဲ့အတူ update လုပ်ထားပါလိမ့်မယ်။ ဒါပေမယ့် deprecation identifier (သတ်မှတ်နံပါတ်) ကိုတော့ ပြုပြင်ပြောင်းလဲမှာ မဟုတ်ပါဘူး။

## Deprecated APIs စာရင်း (List of deprecated APIs)

### DEP0001: `http.OutgoingMessage.prototype.flush`

Type: End-of-Life

`OutgoingMessage.prototype.flush()` ကို ဖယ်ရှားလိုက်ပါပြီ။ `OutgoingMessage.prototype.flushHeaders()` ကို အစားထိုး သုံးပါ။

### DEP0002: `require('_linklist')`

Type: End-of-Life

`_linklist` module က deprecated ဖြစ်ပါတယ်။ userland က အခြားရွေးချယ်စရာ (alternative) တစ်ခုကို သုံးပေးပါ။

### DEP0003: `_writableState.buffer`

Type: End-of-Life

`_writableState.buffer` ကို ဖယ်ရှားလိုက်ပါပြီ။ `_writableState.getBuffer()` ကို အစားထိုး သုံးပါ။

### DEP0004: `CryptoStream.prototype.readyState`

Type: End-of-Life

`CryptoStream.prototype.readyState` property ကို ဖယ်ရှားလိုက်ပါပြီ။

### DEP0005: `Buffer()` constructor

Type: Application (non-`node_modules` code only)

`Buffer()` function နဲ့ `new Buffer()` constructor တို့က — API သုံးစွဲရလွယ်ကူမှု (usability) ဆိုင်ရာ ပြဿနာတွေကြောင့် မတော်တဆ လုံခြုံရေးဆိုင်ရာ ပြဿနာတွေအထိ ဖြစ်ပေါ်စေနိုင်တာမို့ — deprecated ဖြစ်ပါတယ်။

အစားထိုးအနေနဲ့ `Buffer` objects တွေကို တည်ဆောက်ဖို့ အောက်ပါ method တွေထဲက တစ်ခုကို သုံးပါ:

* [`Buffer.alloc(size[, fill[, encoding]])`][alloc]: `Buffer` တစ်ခုကို _initialized_ (တန်ဖိုး စတင်ဖြည့်ပြီးသား) memory နဲ့ ဖန်တီးပါတယ်။
* [`Buffer.allocUnsafe(size)`][alloc_unsafe_size]: `Buffer` တစ်ခုကို _uninitialized_ (တန်ဖိုး မဖြည့်ရသေးသော) memory နဲ့ ဖန်တီးပါတယ်။
* [`Buffer.allocUnsafeSlow(size)`][]: `Buffer` တစ်ခုကို _uninitialized_ memory နဲ့ ဖန်တီးပါတယ်။
* [`Buffer.from(array)`][]: `array` ရဲ့ copy တစ်ခုပါတဲ့ `Buffer` တစ်ခုကို ဖန်တီးပါတယ်
* [`Buffer.from(arrayBuffer[, byteOffset[, length]])`][from_arraybuffer] - ပေးထားတဲ့ `arrayBuffer` ကို wrap (ပတ်ဖွဲ့) လုပ်ထားတဲ့ `Buffer` တစ်ခုကို ဖန်တီးပါတယ်။
* [`Buffer.from(buffer)`][]: `buffer` ကို copy လုပ်တဲ့ `Buffer` တစ်ခုကို ဖန်တီးပါတယ်။
* [`Buffer.from(string[, encoding])`][from_string_encoding]: `string` ကို copy လုပ်တဲ့ `Buffer` တစ်ခုကို ဖန်တီးပါတယ်။

`--pending-deprecation` မသုံးဘဲနဲ့ဆိုရင် runtime warnings တွေက `node_modules` ထဲမှာ မဟုတ်တဲ့ code တွေအတွက်သာ ဖြစ်ပေါ်ပါတယ်။ ဆိုလိုတာက dependencies တွေထဲမှာ `Buffer()` သုံးထားတာအတွက် deprecation warnings တွေ ထွက်ပေါ်လာမှာ မဟုတ်ပါဘူး။ `--pending-deprecation` နဲ့ဆိုရင်တော့ — `Buffer()` သုံးတဲ့ နေရာ ဘယ်နေရာမှာပဲ ဖြစ်ပါစေ — runtime warning တစ်ခု ထွက်ပေါ်ပါလိမ့်မယ်။

### DEP0006: `child_process` `options.customFds`

Type: End-of-Life

[`child_process`][] module ရဲ့ `spawn()`, `fork()` နဲ့ `exec()` methods တွေထဲမှာ `options.customFds` option က deprecated ဖြစ်ပါတယ်။ `options.stdio` option ကို အစား သုံးသင့်ပါတယ်။

### DEP0007: Replace `cluster` `worker.suicide` with `worker.exitedAfterDisconnect`

Type: End-of-Life

Node.js `cluster` ရဲ့ အစောပိုင်း version တစ်ခုမှာ `Worker` object ပေါ်ကို `suicide` ဆိုတဲ့ နာမည်နဲ့ boolean property တစ်ခုကို ထည့်သွင်းခဲ့ပါတယ်။ ဒီ property ရဲ့ ရည်ရွယ်ချက်က `Worker` instance က ဘယ်လို၊ ဘာကြောင့် ထွက်သွားခဲ့လဲဆိုတာကို အချက်ပြပေးဖို့ ဖြစ်ပါတယ်။ Node.js 6.0.0 မှာတော့ အဲဒီ property အဟောင်းကို deprecated လုပ်ပြီး — အသစ်ဖြစ်တဲ့ [`worker.exitedAfterDisconnect`][] property နဲ့ အစားထိုးလိုက်ပါတယ်။ Property နာမည်အဟောင်းက တကယ့် semantics (အဓိပ္ပာယ်ဖွင့်ဆိုချက်များ) တွေကို တိကျစွာ ဖော်ပြနိုင်ခြင်း မရှိခဲ့ဘဲ — မလိုအပ်ဘဲ စိတ်ခံစားမှုဆန်တဲ့ (emotion-laden) နာမည်တစ်ခုလည်း ဖြစ်နေခဲ့ပါတယ်။

### DEP0008: `require('node:constants')`

Type: Documentation-only

`node:constants` module က deprecated ဖြစ်ပါတယ်။ Node.js ရဲ့ builtin modules တစ်ချို့နဲ့ သက်ဆိုင်တဲ့ constants တွေကို လိုအပ်တဲ့အခါ — developer တွေအနေနဲ့ သက်ဆိုင်ရာ module က ထုတ်ဖော်ပေးထားတဲ့ `constants` property ကို ကိုးကားသုံးသင့်ပါတယ်။ ဥပမာ — `require('node:fs').constants` နဲ့ `require('node:os').constants` တို့ ဖြစ်ပါတယ်။

### DEP0009: `crypto.pbkdf2` without digest

Type: End-of-Life

digest တစ်ခုကို သတ်မှတ်မပေးပဲ [`crypto.pbkdf2()`][] API ကို သုံးတာက Node.js 6.0 မှာ deprecated ဖြစ်ခဲ့ပါတယ် — ဘာကြောင့်လဲဆိုတော့ ဒီ method က အကြံမပြုထားတဲ့ `'SHA1'` digest ကို default အနေနဲ့ သုံးနေလို့ ဖြစ်ပါတယ်။ အရင်တုန်းက deprecation warning တစ်ခုကို print လုပ်ခဲ့ပါတယ်။ Node.js 8.0.0 ကစပြီးတော့ `digest` ကို `undefined` အဖြစ် ထားပြီး `crypto.pbkdf2()` သို့မဟုတ် `crypto.pbkdf2Sync()` ကို ခေါ်လိုက်ရင် `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

Node.js 11.0.0 ကစပြီးတော့ — `digest` ကို `null` အဖြစ် ထားပြီး ဒီ functions တွေကို ခေါ်ရင် — `digest` က `undefined` ဖြစ်တဲ့အခါနဲ့ အပြုအမူ ကိုက်ညီအောင် — deprecation warning တစ်ခုကို print လုပ်ပါလိမ့်မယ်။

အခုအချိန်မှာတော့ `undefined` ဖြစ်စေ၊ `null` ဖြစ်စေ ဖြတ်သန်းပေးလိုက်ရင် နှစ်ခုလုံး `TypeError` တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### DEP0010: `crypto.createCredentials`

Type: End-of-Life

`crypto.createCredentials()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ [`tls.createSecureContext()`][] ကို အစားထိုး သုံးပါ။

### DEP0011: `crypto.Credentials`

Type: End-of-Life

`crypto.Credentials` class ကို ဖယ်ရှားလိုက်ပါပြီ။ [`tls.SecureContext`][] ကို အစားထိုး သုံးပါ။

### DEP0012: `Domain.dispose`

Type: End-of-Life

`Domain.dispose()` ကို ဖယ်ရှားလိုက်ပါပြီ။ မအောင်မြင်ခဲ့တဲ့ (failed) I/O လုပ်ဆောင်ချက်တွေကနေ ပြန်လည် ကောင်းမွန်အောင် (recover) လုပ်ဖို့ဆိုရင် — domain ပေါ်မှာ သတ်မှတ်ထားတဲ့ error event handlers တွေကနေတစ်ဆင့် — တိုက်ရိုက် ဆောင်ရွက်ပါ။

### DEP0013: `fs` asynchronous function without callback

Type: End-of-Life

callback မပါပဲ asynchronous function တစ်ခုကို ခေါ်လိုက်တာက Node.js 10.0.0 ကစပြီး `TypeError` တစ်ခုကို throw လုပ်ပါတယ်။ <https://github.com/nodejs/node/pull/12562> ကို ကြည့်ပါ။

### DEP0014: `fs.read` legacy String interface

Type: End-of-Life

[`fs.read()`][] ရဲ့ legacy `String` interface က deprecated ဖြစ်ပါတယ်။ documentation ထဲမှာ ဖော်ပြထားတဲ့အတိုင်း `Buffer` API ကို သုံးပါ။

### DEP0015: `fs.readSync` legacy String interface

Type: End-of-Life

[`fs.readSync()`][] ရဲ့ legacy `String` interface က deprecated ဖြစ်ပါတယ်။ documentation ထဲမှာ ဖော်ပြထားတဲ့အတိုင်း `Buffer` API ကို သုံးပါ။

### DEP0016: `GLOBAL`/`root`

Type: End-of-Life

`global` property ရဲ့ `GLOBAL` နဲ့ `root` aliases တွေကို Node.js 6.0.0 မှာ deprecated လုပ်ခဲ့ပြီး — အခုအခါ ဖယ်ရှားလိုက်ပါပြီ။

### DEP0017: `Intl.v8BreakIterator`

Type: End-of-Life

`Intl.v8BreakIterator` က standard မဟုတ်တဲ့ extension တစ်ခု ဖြစ်ခဲ့ပြီး — ဖယ်ရှားလိုက်ပါပြီ။ [Intl.Segmenter](https://github.com/tc39/proposal-intl-segmenter) ကို ကြည့်ပါ။

### DEP0018: Unhandled promise rejections

Type: End-of-Life

Unhandled promise rejections (ကိုင်တွယ်မှု မရှိတဲ့ promise rejections) တွေက deprecated ဖြစ်ပါတယ်။ Default အနေနဲ့ — handle မလုပ်ထားတဲ့ promise rejections တွေက Node.js process ကို non-zero exit code နဲ့ အဆုံးသတ်စေပါတယ်။ Node.js က unhandled rejections တွေကို ဆက်ဆံပုံကို ပြောင်းလဲဖို့ဆိုရင် [`--unhandled-rejections`][] command-line option ကို သုံးပါ။

### DEP0019: `require('.')` resolved outside directory

Type: End-of-Life

အချို့သော အခြေအနေတွေမှာ `require('.')` က package directory ရဲ့ အပြင်ဘက်ကို resolve လုပ်နိုင်ခဲ့ပါတယ်။ ဒီအပြုအမူကို ဖယ်ရှားလိုက်ပါပြီ။

### DEP0020: `Server.connections`

Type: End-of-Life

`Server.connections` property ကို Node.js 0.9.7 မှာ deprecated လုပ်ခဲ့ပြီး — ဖယ်ရှားလိုက်ပါပြီ။ [`Server.getConnections()`][] method ကို သုံးပေးပါ။

### DEP0021: `Server.listenFD`

Type: End-of-Life

`Server.listenFD()` method ကို deprecated လုပ်ပြီး ဖယ်ရှားလိုက်ပါပြီ။ [`Server.listen({fd: <number>})`][] ကို အစား သုံးပေးပါ။

### DEP0022: `os.tmpDir()`

Type: End-of-Life

`os.tmpDir()` API ကို Node.js 7.0.0 မှာ deprecated လုပ်ခဲ့ပြီး — အခုအခါ ဖယ်ရှားလိုက်ပါပြီ။ [`os.tmpdir()`][] ကို သုံးပေးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/tmpdir-to-tmpdir)):

```bash
npx codemod@latest @nodejs/tmpDir-to-tmpdir
```

### DEP0023: `os.getNetworkInterfaces()`

Type: End-of-Life

`os.getNetworkInterfaces()` method က deprecated ဖြစ်ပါတယ်။ [`os.networkInterfaces()`][] method ကို သုံးပေးပါ။

### DEP0024: `REPLServer.prototype.convertToContext()`

Type: End-of-Life

`REPLServer.prototype.convertToContext()` API ကို ဖယ်ရှားလိုက်ပါပြီ။

### DEP0025: `require('node:sys')`

Type: Runtime

`node:sys` module က deprecated ဖြစ်ပါတယ်။ [`util`][] module ကို သုံးပေးပါ။

### DEP0026: `util.print()`

Type: End-of-Life

`util.print()` ကို ဖယ်ရှားလိုက်ပါပြီ။ [`console.log()`][] ကို သုံးပေးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-print-to-console-log)):

```bash
npx codemod@latest @nodejs/util-print-to-console-log
```

### DEP0027: `util.puts()`

Type: End-of-Life

`util.puts()` ကို ဖယ်ရှားလိုက်ပါပြီ။ [`console.log()`][] ကို သုံးပေးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-print-to-console-log)):

```bash
npx codemod@latest @nodejs/util-print-to-console-log
```

### DEP0028: `util.debug()`

Type: End-of-Life

`util.debug()` ကို ဖယ်ရှားလိုက်ပါပြီ။ [`console.error()`][] ကို သုံးပေးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-print-to-console-log)):

```bash
npx codemod@latest @nodejs/util-print-to-console-log
```

### DEP0029: `util.error()`

Type: End-of-Life

`util.error()` ကို ဖယ်ရှားလိုက်ပါပြီ။ [`console.error()`][] ကို သုံးပေးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-print-to-console-log)):

```bash
npx codemod@latest @nodejs/util-print-to-console-log
```

### DEP0030: `SlowBuffer`

Type: End-of-Life

`SlowBuffer` class ကို ဖယ်ရှားလိုက်ပါပြီ။ [`Buffer.allocUnsafeSlow(size)`][] ကို သုံးပေးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/slow-buffer-to-buffer-alloc-unsafe-slow)).

```bash
npx codemod@latest @nodejs/slow-buffer-to-buffer-alloc-unsafe-slow
```

### DEP0031: `ecdh.setPublicKey()`

Type: Runtime

[`ecdh.setPublicKey()`][] method က — ၎င်းကို API ထဲမှာ ထည့်သွင်းထားတာက အသုံးမဝင်တာမို့ — အခုအခါ deprecated ဖြစ်ပါတယ်။

### DEP0032: `node:domain` module

Type: Documentation-only

[`domain`][] module က deprecated ဖြစ်ပြီး — မသုံးသင့်ပါဘူး။

### DEP0033: `EventEmitter.listenerCount()`

Type: Revoked

[`events.listenerCount(emitter, eventName)`][] API က — [`emitter.listenerCount(eventName)`][] နဲ့ လုပ်ဆောင်ချက် ထပ်တူညီနေတာမို့ — deprecated လုပ်ခဲ့ပါတယ်။ ဒါပေမယ့် ဒီ function ကို {EventTarget} arguments တွေပါ လက်ခံနိုင်အောင် ရည်ရွယ်ချက်သစ်နဲ့ ပြန်လည် သုံးစွဲလာတာကြောင့် — deprecation ကို ပြန်လည်ရုတ်သိမ်း (revoked) လိုက်ပါတယ်။

### DEP0034: `fs.exists(path, callback)`

Type: Documentation-only

[`fs.exists(path, callback)`][] API က deprecated ဖြစ်ပါတယ်။ [`fs.stat()`][] သို့မဟုတ် [`fs.access()`][] ကို သုံးပေးပါ။

### DEP0035: `fs.lchmod(path, mode, callback)`

Type: Documentation-only

[`fs.lchmod(path, mode, callback)`][] API က deprecated ဖြစ်ပါတယ်။

### DEP0036: `fs.lchmodSync(path, mode)`

Type: Documentation-only

[`fs.lchmodSync(path, mode)`][] API က deprecated ဖြစ်ပါတယ်။

### DEP0037: `fs.lchown(path, uid, gid, callback)`

Type: Deprecation revoked

[`fs.lchown(path, uid, gid, callback)`][] API ကို deprecated လုပ်ခဲ့ပါတယ်။ လိုအပ်တဲ့ ပံ့ပိုးပေးတဲ့ (supporting) APIs တွေကို libuv ထဲမှာ ထည့်သွင်းလိုက်လို့ — deprecation ကို ပြန်လည်ရုတ်သိမ်းလိုက်ပါတယ်။

### DEP0038: `fs.lchownSync(path, uid, gid)`

Type: Deprecation revoked

[`fs.lchownSync(path, uid, gid)`][] API ကို deprecated လုပ်ခဲ့ပါတယ်။ လိုအပ်တဲ့ ပံ့ပိုးပေးတဲ့ (supporting) APIs တွေကို libuv ထဲမှာ ထည့်သွင်းလိုက်လို့ — deprecation ကို ပြန်လည်ရုတ်သိမ်းလိုက်ပါတယ်။

### DEP0039: `require.extensions`

Type: Documentation-only

[`require.extensions`][] property က deprecated ဖြစ်ပါတယ်။

### DEP0040: `node:punycode` module

Type: Application (non-`node_modules` code only)

[`punycode`][] module က deprecated ဖြစ်ပါတယ်။ userland က အခြားရွေးချယ်စရာ (alternative) တစ်ခုကို အစားထိုး သုံးပေးပါ။

### DEP0041: `NODE_REPL_HISTORY_FILE` environment variable

Type: End-of-Life

`NODE_REPL_HISTORY_FILE` environment variable ကို ဖယ်ရှားလိုက်ပါပြီ။ `NODE_REPL_HISTORY` ကို အစား သုံးပါ။

### DEP0042: `tls.CryptoStream`

Type: End-of-Life

`tls.CryptoStream` class ကို ဖယ်ရှားလိုက်ပါပြီ။ [`tls.TLSSocket`][] ကို သုံးပေးပါ။

### DEP0043: `tls.SecurePair`

Type: End-of-Life

`tls.SecurePair` class က deprecated ဖြစ်ပါတယ်။ [`tls.TLSSocket`][] ကို သုံးပေးပါ။

### DEP0044: `util.isArray()`

Type: Runtime

[`util.isArray()`][] API က deprecated ဖြစ်ပါတယ်။ `Array.isArray()` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0045: `util.isBoolean()`

Type: End-of-Life

`util.isBoolean()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `typeof arg === 'boolean'` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0046: `util.isBuffer()`

Type: End-of-Life

`util.isBuffer()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ [`Buffer.isBuffer()`][] ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0047: `util.isDate()`

Type: End-of-Life

`util.isDate()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `arg instanceof Date` ကို အစား သုံးပါ။

ပိုမို ခိုင်မာတဲ့ နည်းလမ်းတွေအတွက်ဆိုရင် — အောက်ပါတို့ကို သုံးစဉ်းစားပါ:
`Date.prototype.toString.call(arg) === '[object Date]' && !isNaN(arg)`.
ဒါကို invalid date objects တွေကို ကိုင်တွယ်ဖို့ `try/catch` block တစ်ခုထဲမှာလည်း သုံးနိုင်ပါတယ်။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0048: `util.isError()`

Type: End-of-Life

`util.isError()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `Error.isError(arg)` ကို သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0049: `util.isFunction()`

Type: End-of-Life

`util.isFunction()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `typeof arg === 'function'` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0050: `util.isNull()`

Type: End-of-Life

`util.isNull()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `arg === null` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0051: `util.isNullOrUndefined()`

Type: End-of-Life

`util.isNullOrUndefined()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `arg === null || arg === undefined` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0052: `util.isNumber()`

Type: End-of-Life

`util.isNumber()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `typeof arg === 'number'` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0053: `util.isObject()`

Type: End-of-Life

`util.isObject()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `arg && typeof arg === 'object'` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0054: `util.isPrimitive()`

Type: End-of-Life

`util.isPrimitive()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `Object(arg) !== arg` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0055: `util.isRegExp()`

Type: End-of-Life

`util.isRegExp()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `arg instanceof RegExp` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0056: `util.isString()`

Type: End-of-Life

`util.isString()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `typeof arg === 'string'` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0057: `util.isSymbol()`

Type: End-of-Life

`util.isSymbol()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `typeof arg === 'symbol'` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0058: `util.isUndefined()`

Type: End-of-Life

`util.isUndefined()` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `arg === undefined` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-is)):

```bash
npx codemod@latest @nodejs/util-is
```

### DEP0059: `util.log()`

Type: End-of-Life

`util.log()` API ကို — ထိန်းသိမ်းမှု (maintenance) မရှိတော့တဲ့ legacy API တစ်ခု ဖြစ်ပြီး မတော်တဆ userland ဆီကို ထိတွေ့ခဲ့တာမို့ — ဖယ်ရှားလိုက်ပါပြီ။ အဲဒီအစား — သင့်ရဲ့ လိုအပ်ချက်တွေပေါ် မူတည်ပြီး — အောက်ပါ အခြားရွေးချယ်စရာတွေကို စဉ်းစားပါ:

* **Third-Party Logging Libraries**

* **Use `console.log(new Date().toLocaleString(), message)`**

ဒီ alternatives တွေထဲက တစ်ခုကို လက်ခံကျင့်သုံးခြင်းအားဖြင့် — သင်က `util.log()` ကနေ ကူးပြောင်းနိုင်ပြီး — သင့် application ရဲ့ သတ်မှတ်ချက်တွေနဲ့ ရှုပ်ထွေးမှု (complexity) နဲ့ ကိုက်ညီတဲ့ logging strategy တစ်ခုကို ရွေးချယ်နိုင်ပါတယ်။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-log-to-console-log)):

```bash
npx codemod@latest @nodejs/util-log-to-console-log
```

### DEP0060: `util._extend()`

Type: Runtime

[`util._extend()`][] API က — ထိန်းသိမ်းမှု မရှိတော့တဲ့ legacy API တစ်ခု ဖြစ်ပြီး မတော်တဆ userland ဆီကို ထိတွေ့ခဲ့တာမို့ — deprecated ဖြစ်ပါတယ်။ `target = Object.assign(target, source)` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/util-extend-to-object-assign)):

```bash
npx codemod@latest @nodejs/util-extend-to-object-assign
```

### DEP0061: `fs.SyncWriteStream`

Type: End-of-Life

`fs.SyncWriteStream` class က public အနေနဲ့ ဝင်ရောက်သုံးလို့ရတဲ့ (publicly accessible) API တစ်ခုအဖြစ် ဘယ်တုန်းကမှ ရည်ရွယ်ထားခြင်း မရှိခဲ့ဘဲ — ဖယ်ရှားလိုက်ပါပြီ။ အစားထိုး API တစ်ခုလည်း မရရှိနိုင်ပါဘူး။ userland က အခြားရွေးချယ်စရာ (alternative) တစ်ခုကို သုံးပေးပါ။

### DEP0062: `node --debug`

Type: End-of-Life

`--debug` က legacy V8 debugger interface ကို ဖွင့်ပေးပါတယ် — ၎င်းကို V8 5.8 ကစပြီး ဖယ်ရှားလိုက်ပါပြီ။ ၎င်းအစား — `--inspect` နဲ့ ဖွင့်လှယ်တဲ့ — Inspector ကို အစားထိုး အသုံးပြုပါတယ်။

### DEP0063: `ServerResponse.prototype.writeHeader()`

Type: End-of-Life

`node:http` module ရဲ့ `ServerResponse.prototype.writeHeader()` API က deprecated ဖြစ်ပါတယ်။ `ServerResponse.prototype.writeHead()` ကို သုံးပေးပါ။

`ServerResponse.prototype.writeHeader()` method ကို တရားဝင် ပံ့ပိုးထားတဲ့ (officially supported) API အဖြစ် ဘယ်တုန်းကမှ documentation မလုပ်ခဲ့ပါဘူး။

### DEP0064: `tls.createSecurePair()`

Type: End-of-Life

`tls.createSecurePair()` API ကို Node.js 0.11.3 မှာ documentation အရ deprecated လုပ်ခဲ့ပါတယ်။ Users တွေက `tls.Socket` ကို အစား သုံးသင့်ပါတယ်။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/tls-create-secure-pair-to-tls-socket)):

```bash
npx codemod @nodejs/tls-create-secure-pair-to-tls-socket
```

### DEP0065: `repl.REPL_MODE_MAGIC` and `NODE_REPL_MODE=magic`

Type: End-of-Life

`node:repl` module ရဲ့ `replMode` option အတွက် သုံးတဲ့ `REPL_MODE_MAGIC` constant ကို ဖယ်ရှားလိုက်ပါပြီ။ ၎င်းရဲ့ အပြုအမူက V8 5.0 ကို ထည့်သွင်းခဲ့တဲ့ Node.js 6.0.0 ကတည်းက `REPL_MODE_SLOPPY` နဲ့ လုပ်ဆောင်ချက်အရ ထပ်တူကျနေခဲ့ပါတယ်။ `REPL_MODE_SLOPPY` ကို သုံးပေးပါ။

`NODE_REPL_MODE` environment variable က interactive `node` session တစ်ခုရဲ့ အခြေခံ `replMode` ကို သတ်မှတ်ဖို့ သုံးပါတယ်။ ၎င်းရဲ့ တန်ဖိုးဖြစ်တဲ့ `magic` ကိုလည်း ဖယ်ရှားလိုက်ပါပြီ။ `sloppy` ကို သုံးပေးပါ။

### DEP0066: `OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames`

Type: End-of-Life

`node:http` module ရဲ့ `OutgoingMessage.prototype._headers` နဲ့ `OutgoingMessage.prototype._headerNames` properties တွေက deprecated ဖြစ်ပါတယ်။ Outgoing headers တွေနဲ့ အလုပ်လုပ်ဖို့ဆိုရင် public methods တွေထဲက တစ်ခုကို သုံးပါ (ဥပမာ — `OutgoingMessage.prototype.getHeader()`, `OutgoingMessage.prototype.getHeaders()`, `OutgoingMessage.prototype.getHeaderNames()`, `OutgoingMessage.prototype.getRawHeaderNames()`, `OutgoingMessage.prototype.hasHeader()`, `OutgoingMessage.prototype.removeHeader()`, `OutgoingMessage.prototype.setHeader()`)။

`OutgoingMessage.prototype._headers` နဲ့ `OutgoingMessage.prototype._headerNames` properties တွေကို တရားဝင် ပံ့ပိုးထားတဲ့ properties အဖြစ် ဘယ်တုန်းကမှ documentation မလုပ်ခဲ့ပါဘူး။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/http-outgoingmessage-headers)):

```bash
npx codemod@latest @nodejs/http-outgoingmessage-headers
```

### DEP0067: `OutgoingMessage.prototype._renderHeaders`

Type: Documentation-only

`node:http` module ရဲ့ `OutgoingMessage.prototype._renderHeaders()` API က deprecated ဖြစ်ပါတယ်။

`OutgoingMessage.prototype._renderHeaders` property ကို တရားဝင် ပံ့ပိုးထားတဲ့ API အဖြစ် ဘယ်တုန်းကမှ documentation မလုပ်ခဲ့ပါဘူး။

### DEP0068: `node debug`

Type: End-of-Life

`node debug` က legacy CLI debugger နဲ့ သက်ဆိုင်ပါတယ် — ၎င်းကို `node inspect` ကနေတစ်ဆင့် ရရှိနိုင်တဲ့ V8-inspector အခြေခံ CLI debugger တစ်ခုနဲ့ အစားထိုးလိုက်ပါပြီ။

### DEP0069: `vm.runInDebugContext(string)`

Type: End-of-Life

DebugContext ကို V8 မှာ ဖယ်ရှားလိုက်ပြီး — Node.js 10+ မှာ မရရှိနိုင်တော့ပါဘူး။

DebugContext က experimental API တစ်ခု ဖြစ်ခဲ့ပါတယ်။

### DEP0070: `async_hooks.currentId()`

Type: End-of-Life

`async_hooks.currentId()` ကို ရှင်းလင်းမှု ရှိစေဖို့အတွက် `async_hooks.executionAsyncId()` လို့ နာမည်ပြောင်းလိုက်ပါတယ်။

ဒီပြောင်းလဲမှုကို `async_hooks` က experimental API တစ်ခု ဖြစ်နေတုန်း အချိန်မှာ ပြုလုပ်ခဲ့တာပါ။

### DEP0071: `async_hooks.triggerId()`

Type: End-of-Life

`async_hooks.triggerId()` ကို ရှင်းလင်းမှု ရှိစေဖို့အတွက် `async_hooks.triggerAsyncId()` လို့ နာမည်ပြောင်းလိုက်ပါတယ်။

ဒီပြောင်းလဲမှုကို `async_hooks` က experimental API တစ်ခု ဖြစ်နေတုန်း အချိန်မှာ ပြုလုပ်ခဲ့တာပါ။

### DEP0072: `async_hooks.AsyncResource.triggerId()`

Type: End-of-Life

`async_hooks.AsyncResource.triggerId()` ကို ရှင်းလင်းမှု ရှိစေဖို့အတွက် `async_hooks.AsyncResource.triggerAsyncId()` လို့ နာမည်ပြောင်းလိုက်ပါတယ်။

ဒီပြောင်းလဲမှုကို `async_hooks` က experimental API တစ်ခု ဖြစ်နေတုန်း အချိန်မှာ ပြုလုပ်ခဲ့တာပါ။

### DEP0073: Several internal properties of `net.Server`

Type: End-of-Life

သင့်လျော်မှု မရှိတဲ့ နာမည်တွေနဲ့ `net.Server` instances တွေရဲ့ အတွင်းပိုင်း (internal) ၊ documentation မလုပ်ထားတဲ့ properties တွေကို ဝင်ရောက်သုံးစွဲတာက deprecated ဖြစ်ပါတယ်။

မူရင်း API က documentation မရှိခဲ့ဘဲ — internal မဟုတ်တဲ့ code တွေအတွက် ယေဘုယျအားဖြင့် အသုံးဝင်မှု မရှိခဲ့တာမို့ — အစားထိုး API တစ်ခုကို ပေးအပ်ထားခြင်း မရှိပါဘူး။

### DEP0074: `REPLServer.bufferedCommand`

Type: End-of-Life

`REPLServer.bufferedCommand` property ကို [`REPLServer.clearBufferedCommand()`][] ဘက်ကို ဦးစားပေးပြီး deprecated လုပ်ပါတယ်။

### DEP0075: `REPLServer.parseREPLKeyword()`

Type: End-of-Life

`REPLServer.parseREPLKeyword()` ကို userland မြင်ကွင်း (visibility) ကနေ ဖယ်ရှားလိုက်ပါပြီ။

### DEP0076: `tls.parseCertString()`

Type: End-of-Life

`tls.parseCertString()` က မတော်တဆ public ဖြစ်သွားခဲ့တဲ့ ရိုးရှင်းတဲ့ parsing helper တစ်ခု ဖြစ်ပါတယ်။ ၎င်းက certificate ရဲ့ subject နဲ့ issuer strings တွေကို parse လုပ်ဖို့ ရည်ရွယ်ခဲ့ပေမယ့် — multi-value Relative Distinguished Names တွေကို ဘယ်တုန်းကမှ မှန်ကန်စွာ ကိုင်တွယ်နိုင်ခဲ့ပါဘူး။

ဒီ document ရဲ့ အစောပိုင်း version တွေက `tls.parseCertString()` ရဲ့ အခြားရွေးချယ်စရာအဖြစ် `querystring.parse()` ကို သုံးဖို့ အကြံပြုခဲ့ပါတယ်။ ဒါပေမယ့် `querystring.parse()` ကလည်း certificate subjects တွေ အားလုံးကို မှန်ကန်စွာ ကိုင်တွယ်နိုင်ခြင်း မရှိဘဲ — သုံးစွဲသင့်တာလည်း မဟုတ်ပါဘူး။

### DEP0077: `Module._debug()`

Type: End-of-Life

`Module._debug()` ကို ဖယ်ရှားလိုက်ပါပြီ။

`Module._debug()` function ကို တရားဝင် ပံ့ပိုးထားတဲ့ API အဖြစ် ဘယ်တုန်းကမှ documentation မလုပ်ခဲ့ပါဘူး။

### DEP0078: `REPLServer.turnOffEditorMode()`

Type: End-of-Life

`REPLServer.turnOffEditorMode()` ကို userland မြင်ကွင်းကနေ ဖယ်ရှားလိုက်ပါပြီ။

### DEP0079: Custom inspection function on objects via `.inspect()`

Type: End-of-Life

Object တစ်ခုပေါ်မှာ `inspect` ဆိုတဲ့ နာမည်နဲ့ property တစ်ခုကို သုံးပြီး [`util.inspect()`][] အတွက် custom inspection function တစ်ခုကို သတ်မှတ်တာက deprecated ဖြစ်ပါတယ်။ [`util.inspect.custom`][] ကို အစား သုံးပါ။ Node.js 6.4.0 ထက် စောတဲ့ version တွေနဲ့ နောက်ပြန် လိုက်ဖက်မှု (backward compatibility) ရှိစေဖို့အတွက်တော့ နှစ်ခုလုံးကို သတ်မှတ်ထားနိုင်ပါတယ်။

### DEP0080: `path._makeLong()`

Type: Documentation-only

အတွင်းပိုင်း `path._makeLong()` က public အသုံးပြုမှုအတွက် ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ ဒါပေမယ့် userland modules တွေက ၎င်းကို အသုံးဝင်တယ်လို့ တွေ့ရှိခဲ့ကြပါတယ်။ ဒီ internal API က deprecated ဖြစ်ပြီး — ထပ်တူကျတဲ့ public method ဖြစ်တဲ့ `path.toNamespacedPath()` နဲ့ အစားထိုးလိုက်ပါပြီ။

### DEP0081: `fs.truncate()` using a file descriptor

Type: End-of-Life

`fs.truncate()` နဲ့ `fs.truncateSync()` တွေကို file descriptor တစ်ခုနဲ့ သုံးတာက deprecated ဖြစ်ပါတယ်။ File descriptors တွေနဲ့ အလုပ်လုပ်ဖို့ဆိုရင် `fs.ftruncate()` သို့မဟုတ် `fs.ftruncateSync()` ကို သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/fs-truncate-fd-deprecation)):

```bash
npx codemod@latest @nodejs/fs-truncate-fd-deprecation
```

### DEP0082: `REPLServer.prototype.memory()`

Type: End-of-Life

`REPLServer.prototype.memory()` က `REPLServer` ကိုယ်တိုင်၏ အတွင်းပိုင်း ယန္တရားတွေအတွက်သာ လိုအပ်ပါတယ်။ ဒီ function ကို မသုံးပါနဲ့။

### DEP0083: Disabling ECDH by setting `ecdhCurve` to `false`

Type: End-of-Life

`tls.createSecureContext()` နဲ့ `tls.TLSSocket` တို့ရဲ့ `ecdhCurve` option ကို — server ပေါ်မှာသာ ECDH ကို လုံးဝ disable လုပ်ဖို့ — `false` အဖြစ် သတ်မှတ်နိုင်ခဲ့ပါတယ်။ ဒီ mode ကို OpenSSL 1.1.0 ဆီ ပြောင်းရွှေ့မှုနဲ့ client နဲ့ ညီညွတ်မှု ရှိစေဖို့ ပြင်ဆင်မှုတွေရဲ့ တစ်စိတ်တစ်ပိုင်းအဖြစ် deprecated လုပ်ခဲ့ပြီး — အခုအခါ support မလုပ်တော့ပါဘူး။ `ciphers` parameter ကို အစား သုံးပါ။

### DEP0084: requiring bundled internal dependencies

Type: End-of-Life

Node.js 4.4.0 နဲ့ 5.2.0 versions တွေကစပြီး — အတွင်းပိုင်း အသုံးပြုမှုအတွက်သာ ရည်ရွယ်ထားတဲ့ modules အများအပြားကို `require()` ကနေတစ်ဆင့် user code တွေဆီကို မှားယွင်းစွာ ထိတွေ့စေခဲ့ပါတယ်။ အဲဒီ modules တွေကတော့:

* `v8/tools/codemap`
* `v8/tools/consarray`
* `v8/tools/csvparser`
* `v8/tools/logreader`
* `v8/tools/profile_view`
* `v8/tools/profile`
* `v8/tools/SourceMap`
* `v8/tools/splaytree`
* `v8/tools/tickprocessor-driver`
* `v8/tools/tickprocessor`
* `node-inspect/lib/_inspect` (from 7.6.0)
* `node-inspect/lib/internal/inspect_client` (from 7.6.0)
* `node-inspect/lib/internal/inspect_repl` (from 7.6.0)

`v8/*` modules တွေမှာ exports တွေ ဘာမှ မပါဝင်ပဲ — သတ်မှတ်ထားတဲ့ အစီအစဉ် (specific order) တစ်ခုအတိုင်း import မလုပ်ရင် တကယ်တော့ errors တွေကို throw လုပ်မှာ ဖြစ်ပါတယ်။ ဒါကြောင့် ၎င်းတို့ကို `require()` ကနေတစ်ဆင့် import လုပ်ဖို့ဆိုတဲ့ တရားဝင် (legitimate) အသုံးပြုမှု ကိစ္စတွေ လက်တွေ့မှာ မရှိသလောက်ပါပဲ။

တစ်ဖက်မှာတော့ `node-inspect` ကို — npm registry ပေါ်မှာ နာမည်တူနဲ့ ထုတ်ဝေထားတာမို့ — package manager တစ်ခုကနေတစ်ဆင့် local မှာ install လုပ်နိုင်ပါတယ်။ အဲဒီလို လုပ်လိုက်ရင် source code ကို ပြုပြင်ပြောင်းလဲစရာ မလိုအပ်ပါဘူး။

### DEP0085: AsyncHooks sensitive API

Type: End-of-Life

AsyncHooks sensitive API ကို ဘယ်တုန်းကမှ documentation မလုပ်ခဲ့ဘဲ — သေးငယ်တဲ့ ပြဿနာမျိုးစုံလည်း ရှိခဲ့ပါတယ်။ `AsyncResource` API ကို အစား သုံးပါ။ <https://github.com/nodejs/node/issues/15572> ကို ကြည့်ပါ။

### DEP0086: Remove `runInAsyncIdScope`

Type: End-of-Life

`runInAsyncIdScope` က `'before'` သို့မဟုတ် `'after'` event တွေကို emit မလုပ်တာမို့ — ပြဿနာများစွာကို ဖြစ်ပေါ်စေနိုင်ပါတယ်။ <https://github.com/nodejs/node/issues/14328> ကို ကြည့်ပါ။

### DEP0089: `require('node:assert')`

Type: Deprecation revoked

assert ကို တိုက်ရိုက် import လုပ်တာက — ထုတ်ဖော်ထားတဲ့ functions တွေက loose equality checks (တင်းကျပ်မှု မရှိတဲ့ တန်းတူညီမျှမှု စစ်ဆေးမှုများ) ကို သုံးနေလို့ — အကြံမပြုခဲ့ပါဘူး။ `node:assert` module ကို သုံးတာကို မတားမြစ်တော့ဘဲ — deprecation က developer တွေကို ရှုပ်ထွေးမှု ဖြစ်စေခဲ့လို့ — deprecation ကို ပြန်လည်ရုတ်သိမ်းလိုက်ပါတယ်။

### DEP0090: Invalid GCM authentication tag lengths

Type: End-of-Life

Node.js က — [`decipher.setAuthTag()`][] ကို ခေါ်တဲ့အခါ OpenSSL က လက်ခံတဲ့ GCM authentication tag အလျားတွေ အားလုံးကို support လုပ်ခဲ့ဖူးပါတယ်။ Node.js v11.0.0 ကစပြီးတော့ 128, 120, 112, 104, 96, 64 နဲ့ 32 bits ဆိုတဲ့ authentication tag အလျားတွေကိုသာ ခွင့်ပြုပါတယ်။ တခြား အလျားတွေရှိတဲ့ authentication tags တွေက [NIST SP 800-38D][] အရ invalid ဖြစ်ပါတယ်။

### DEP0091: `crypto.DEFAULT_ENCODING`

Type: End-of-Life

`crypto.DEFAULT_ENCODING` property က Node.js 0.9.3 versions တွေထက် စောတဲ့ releases တွေနဲ့ လိုက်ဖက်မှု (compatibility) ရှိစေဖို့အတွက်သာ တည်ရှိခဲ့ပြီး — ဖယ်ရှားလိုက်ပါပြီ။

### DEP0092: Top-level `this` bound to `module.exports`

Type: Documentation-only

Top-level `this` ပေါ်မှာ properties တွေကို — `module.exports` ရဲ့ အခြားရွေးချယ်စရာတစ်ခုအနေနဲ့ — သတ်မှတ်ပေးတာက deprecated ဖြစ်ပါတယ်။ Developer တွေက `exports` သို့မဟုတ် `module.exports` ကို အစား သုံးသင့်ပါတယ်။

### DEP0093: `crypto.fips` is deprecated and replaced

Type: Runtime

[`crypto.fips`][] property က deprecated ဖြစ်ပါတယ်။ `crypto.setFips()` နဲ့ `crypto.getFips()` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/crypto-fips-to-getFips)).

```bash
npx codemod@latest @nodejs/crypto-fips-to-getFips
```

### DEP0094: Using `assert.fail()` with more than one argument

Type: End-of-Life

Argument တစ်ခုထက်ပိုပြီး `assert.fail()` ကို သုံးတာက deprecated ဖြစ်ပါတယ်။ Argument တစ်ခုတည်းနဲ့ `assert.fail()` ကို သုံးပါ — သို့မဟုတ် `node:assert` module ရဲ့ တခြား method တစ်ခုကို သုံးပါ။

### DEP0095: `timers.enroll()`

Type: End-of-Life

`timers.enroll()` ကို ဖယ်ရှားလိုက်ပါပြီ။ public အနေနဲ့ documentation လုပ်ထားတဲ့ [`setTimeout()`][] သို့မဟုတ် [`setInterval()`][] ကို သုံးပေးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/timers-deprecations)).

```bash
npx codemod @nodejs/timers-deprecations
```

### DEP0096: `timers.unenroll()`

Type: End-of-Life

`timers.unenroll()` ကို ဖယ်ရှားလိုက်ပါပြီ။ public အနေနဲ့ documentation လုပ်ထားတဲ့ [`clearTimeout()`][] သို့မဟုတ် [`clearInterval()`][] ကို သုံးပေးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/timers-deprecations)).

```bash
npx codemod @nodejs/timers-deprecations
```

### DEP0097: `MakeCallback` with `domain` property

Type: Runtime

`MakeCallback` ကို သုံးပြီး context တွေကို သယ်ဆောင်ဖို့ `domain` property ကို ထည့်သွင်းနေတဲ့ users တွေက — `MakeCallback` သို့မဟုတ် `CallbackScope` ရဲ့ `async_context` variant တွေ — သို့မဟုတ် high-level ဖြစ်တဲ့ `AsyncResource` class ကို စတင် သုံးသင့်ပါတယ်။

### DEP0098: AsyncHooks embedder `AsyncResource.emitBefore` and `AsyncResource.emitAfter` APIs

Type: End-of-Life

AsyncHooks က ပေးအပ်တဲ့ embedded API က `.emitBefore()` နဲ့ `.emitAfter()` methods တွေကို ထုတ်ဖော်ပေးပါတယ် — ဒါတွေက မှားယွင်းစွာ သုံးမိဖို့ အလွန် လွယ်ကူပြီး — ပြန်လည် ကောင်းမွန်အောင် မလုပ်နိုင်တဲ့ (unrecoverable) errors တွေအထိ ဖြစ်ပေါ်စေနိုင်ပါတယ်။

အများကြီး ပိုလုံခြုံပြီး ပိုအဆင်ပြေတဲ့ အခြားရွေးချယ်စရာတစ်ခုကို ပေးတဲ့ [`asyncResource.runInAsyncScope()`][] API ကို အစား သုံးပါ။ <https://github.com/nodejs/node/pull/18513> ကို ကြည့်ပါ။

### DEP0099: Async context-unaware `node::MakeCallback` C++ APIs

Type: Compile-time

Native addons တွေအတွက် ရရှိနိုင်တဲ့ `node::MakeCallback` APIs တွေရဲ့ version အချို့က deprecated ဖြစ်ပါတယ်။ `async_context` parameter တစ်ခုကို လက်ခံတဲ့ API versions တွေကို သုံးပေးပါ။

### DEP0100: `process.assert()`

Type: End-of-Life

`process.assert()` က deprecated ဖြစ်ပါတယ်။ [`assert`][] module ကို သုံးပေးပါ။

ဒါက documentation လုပ်ထားဖူးတဲ့ feature တစ်ခု ဘယ်တုန်းကမှ မဟုတ်ပါဘူး။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/process-assert-to-node-assert)).

```bash
npx codemod@latest @nodejs/process-assert-to-node-assert
```

### DEP0101: `--with-lttng`

Type: End-of-Life

`--with-lttng` compile-time option ကို ဖယ်ရှားလိုက်ပါပြီ။

### DEP0102: Using `noAssert` in `Buffer#(read|write)` operations

Type: End-of-Life

`noAssert` argument ကို သုံးတာက လုပ်ဆောင်ချက် (functionality) ဘာမှ မရှိတော့ပါဘူး။ `noAssert` ရဲ့ တန်ဖိုး ဘယ်လိုပဲ ရှိရှိ — input တွေ အားလုံးကို verify (စိစစ်) လုပ်ပါတယ်။ Verify လုပ်တာကို ကျော်လိုက်တာက ရှာဖွေရခက်တဲ့ errors တွေနဲ့ crashes တွေကို ဖြစ်ပေါ်စေနိုင်ပါတယ်။

### DEP0103: `process.binding('util').is[...]` typechecks

Type: Documentation-only (supports [`--pending-deprecation`][])

`process.binding()` ကို ယေဘုယျအားဖြင့် သုံးစွဲတာကို ရှောင်သင့်ပါတယ်။ Type checking methods တွေကိုတော့ [`util.types`][] ကို သုံးပြီး အစားထိုးနိုင်ပါတယ်။

ဒီ deprecation ကို `process.binding()` API ရဲ့ deprecation ([DEP0111](https://nodejs.org/api/deprecations.html#DEP0111)) က supersede (နေရာယူ) လုပ်လိုက်ပါပြီ။

### DEP0104: `process.env` string coercion

Type: Documentation-only (supports [`--pending-deprecation`][])

[`process.env`][] ဆီကို string မဟုတ်တဲ့ property တစ်ခုကို သတ်မှတ်လိုက်တဲ့အခါ — သတ်မှတ်လိုက်တဲ့ တန်ဖိုးကို implicitly string တစ်ခုအဖြစ် convert လုပ်ပါတယ်။ သတ်မှတ်လိုက်တဲ့ တန်ဖိုးက string, boolean သို့မဟုတ် number မဟုတ်ရင် ဒီအပြုအမူက deprecated ဖြစ်ပါတယ်။ အနာဂတ်မှာတော့ အဲဒီလို သတ်မှတ်မှုမျိုးက throw လုပ်လိုက်တဲ့ error တစ်ခုအထိ ဖြစ်သွားနိုင်ပါတယ်။ `process.env` ဆီကို မသတ်မှတ်ခင် property ကို string အဖြစ် ဦးစွာ convert လုပ်ပေးပါ။

### DEP0105: `decipher.finaltol`

Type: End-of-Life

`decipher.finaltol()` ကို ဘယ်တုန်းကမှ documentation မလုပ်ခဲ့ဘဲ — [`decipher.final()`][] ရဲ့ alias တစ်ခု ဖြစ်ခဲ့ပါတယ်။ ဒီ API ကို ဖယ်ရှားလိုက်ပြီး — [`decipher.final()`][] ကို သုံးဖို့ အကြံပြုပါတယ်။

### DEP0106: `crypto.createCipher` and `crypto.createDecipher`

Type: End-of-Life

`crypto.createCipher()` နဲ့ `crypto.createDecipher()` တို့က — အားနည်းတဲ့ key derivation function (salt မပါတဲ့ MD5) နဲ့ static initialization vectors တွေကို သုံးနေလို့ — ဖယ်ရှားလိုက်ပါပြီ။

Key တစ်ခုကို random salts တွေနဲ့အတူ [`crypto.pbkdf2()`][] သို့မဟုတ် [`crypto.scrypt()`][] ကို သုံးပြီး derive လုပ်ဖို့ နဲ့ — [`Cipheriv`][] နဲ့ [`Decipheriv`][] objects တွေကို အသီးသီး ရယူဖို့ — [`crypto.createCipheriv()`][] နဲ့ [`crypto.createDecipheriv()`][] တို့ကို သုံးဖို့ အကြံပြုပါတယ်။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/crypto-createcipheriv-migration)):

```bash
npx codemod @nodejs/crypto-createcipheriv-migration
```

### DEP0107: `tls.convertNPNProtocols()`

Type: End-of-Life

ဒါက Node.js core ရဲ့ အပြင်ဘက်မှာ အသုံးပြုဖို့ ရည်ရွယ်ထားခြင်း မရှိတဲ့ documentation မလုပ်ထားတဲ့ helper function တစ်ခု ဖြစ်ပြီး — NPN (Next Protocol Negotiation) support ကို ဖယ်ရှားလိုက်တာနဲ့အတူ — obsolete (ခေတ်ကုန်) ဖြစ်သွားပါတယ်။

### DEP0108: `zlib.bytesRead`

Type: End-of-Life

[`zlib.bytesWritten`][] အတွက် deprecated alias တစ်ခုပါ။ ဒီမူရင်း နာမည်ကို — engine က ဖတ်လိုက်တဲ့ bytes အရေအတွက်လို့လည်း အဓိပ္ပာယ်ကောက်လို့ ရနေလို့ — ရွေးချယ်ခဲ့တာပါ။ ဒါပေမယ့် Node.js ထဲက ဒီနာမည်တွေအောက်မှာ တန်ဖိုးတွေကို ထုတ်ဖော်ပေးတဲ့ တခြား streams တွေနဲ့တော့ မကိုက်ညီပါဘူး။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/zlib-bytesread-to-byteswritten)):

```bash
npx codemod@latest @nodejs/zlib-bytesread-to-byteswritten
```

### DEP0109: `http`, `https`, and `tls` support for invalid URLs

Type: End-of-Life

အရင်က ပံ့ပိုးထားခဲ့တဲ့ (ဒါပေမယ့် တင်းကြပ်စွာဆိုရင် invalid ဖြစ်တဲ့) URL တစ်ချို့ကို — legacy `url.parse()` API က လက်ခံခဲ့လို့ — [`http.request()`][], [`http.get()`][], [`https.request()`][], [`https.get()`][] နဲ့ [`tls.checkServerIdentity()`][] APIs တွေကနေတစ်ဆင့် လက်ခံခဲ့ပါတယ်။ ဖော်ပြခဲ့တဲ့ APIs တွေက အခုအခါ — တင်းကြပ်စွာ valid ဖြစ်တဲ့ URLs တွေကိုသာ လိုအပ်တဲ့ — WHATWG URL parser ကို သုံးပါတယ်။ Invalid URL တစ်ခုကို ဖြတ်သန်းပေးတာက deprecated ဖြစ်ပြီး — အနာဂတ်မှာ support ကို ဖယ်ရှားသွားပါလိမ့်မယ်။

### DEP0110: `vm.Script` cached data

Type: Documentation-only

`produceCachedData` option က deprecated ဖြစ်ပါတယ်။ [`script.createCachedData()`][] ကို အစား သုံးပါ။

### DEP0111: `process.binding()`

Type: Documentation-only (supports [`--pending-deprecation`][])

`process.binding()` က Node.js အတွင်းပိုင်း code တွေအတွက်သာ အသုံးပြုဖို့ ဖြစ်ပါတယ်။

`process.binding()` က ယေဘုယျအားဖြင့် End-of-Life အခြေအနေကို မရောက်ရှိသေးပေမယ့် — [permission model][] ကို ဖွင့်ထားတဲ့အခါ — ၎င်းကို မရရှိနိုင်ပါဘူး။

### DEP0112: `dgram` private APIs

Type: End-of-Life

`node:dgram` module ထဲမှာ အရင်က Node.js core ရဲ့ အပြင်ဘက်ကနေ ဝင်ရောက်သုံးစွဲဖို့ ရည်ရွယ်ထားခြင်း မရှိတဲ့ APIs တွေ အများအပြား ပါဝင်ခဲ့ပါတယ်: `Socket.prototype._handle`, `Socket.prototype._receiving`, `Socket.prototype._bindState`, `Socket.prototype._queue`, `Socket.prototype._reuseAddr`, `Socket.prototype._healthCheck()`, `Socket.prototype._stopReceiving()` နဲ့ `dgram._createSocketHandle()` တို့ ဖြစ်ပါတယ်။ ဒါတွေကို ဖယ်ရှားလိုက်ပါပြီ။

### DEP0113: `Cipher.setAuthTag()`, `Decipher.getAuthTag()`

Type: End-of-Life

`Cipher.setAuthTag()` နဲ့ `Decipher.getAuthTag()` တို့ကို မရရှိနိုင်တော့ပါဘူး။ ၎င်းတို့ကို ဘယ်တုန်းကမှ documentation မလုပ်ခဲ့ဘဲ — ခေါ်လိုက်ရင် throw လုပ်ပါလိမ့်မယ်။

### DEP0114: `crypto._toBuf()`

Type: End-of-Life

`crypto._toBuf()` function က Node.js core ရဲ့ အပြင်ဘက်က modules တွေ အသုံးပြုဖို့ ဒီဇိုင်းထုတ်ထားတာ မဟုတ်ခဲ့ဘဲ — ဖယ်ရှားလိုက်ပါပြီ။

### DEP0115: `crypto.prng()`, `crypto.pseudoRandomBytes()`, `crypto.rng()`

Type: Documentation-only (supports [`--pending-deprecation`][])

Node.js ရဲ့ မကြာသေးတဲ့ versions တွေမှာ [`crypto.randomBytes()`][] နဲ့ `crypto.pseudoRandomBytes()` အကြား ကွာခြားချက် မရှိပါဘူး။ နောက်တစ်ခုဖြစ်တဲ့ `crypto.pseudoRandomBytes()` က — documentation မလုပ်ထားတဲ့ aliases ဖြစ်တဲ့ `crypto.prng()` နဲ့ `crypto.rng()` တို့နဲ့အတူ — [`crypto.randomBytes()`][] ဘက်ကို ဦးစားပေးပြီး deprecated ဖြစ်ပြီး — အနာဂတ် release တစ်ခုမှာ ဖယ်ရှားခံရနိုင်ပါတယ်။

### DEP0116: Legacy URL API

Type: Deprecation revoked

[legacy URL API][] က deprecated ဖြစ်ပါတယ်။ ဒါမှာ [`url.format()`][], [`url.parse()`][], [`url.resolve()`][] နဲ့ [legacy `urlObject`][] တို့ ပါဝင်ပါတယ်။ [WHATWG URL API][] ကို သုံးပေးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/node-url-to-whatwg-url)).

```bash
npx codemod@latest @nodejs/node-url-to-whatwg-url
```

### DEP0117: Native crypto handles

Type: End-of-Life

Node.js ရဲ့ အရင် versions တွေက `Cipher`, `Decipher`, `DiffieHellman`, `DiffieHellmanGroup`, `ECDH`, `Hash`, `Hmac`, `Sign` နဲ့ `Verify` classes တွေရဲ့ `_handle` property ကနေတစ်ဆင့် internal native objects တွေဆီကို handles တွေ ထုတ်ဖော်ပေးခဲ့ပါတယ်။ Native object ကို မသင့်လျော်စွာ သုံးမိရင် application ကို crash ဖြစ်စေနိုင်တာမို့ — `_handle` property ကို ဖယ်ရှားလိုက်ပါပြီ။

### DEP0118: `dns.lookup()` support for a falsy host name

Type: End-of-Life

Node.js ရဲ့ အရင် versions တွေက — backward compatibility (နောက်ပြန် လိုက်ဖက်မှု) အတွက် — `dns.lookup(false)` လိုမျိုး falsy host name တစ်ခုနဲ့ `dns.lookup()` ကို support လုပ်ခဲ့ပါတယ်။ ဒါကို ဖယ်ရှားလိုက်ပါပြီ။

### DEP0119: `process.binding('uv').errname()` private API

Type: Documentation-only (supports [`--pending-deprecation`][])

`process.binding('uv').errname()` က deprecated ဖြစ်ပါတယ်။ [`util.getSystemErrorName()`][] ကို သုံးပေးပါ။

### DEP0120: Windows Performance Counter support

Type: End-of-Life

Windows Performance Counter support ကို Node.js ကနေ ဖယ်ရှားလိုက်ပါပြီ။ Documentation မလုပ်ထားတဲ့ `COUNTER_NET_SERVER_CONNECTION()`, `COUNTER_NET_SERVER_CONNECTION_CLOSE()`, `COUNTER_HTTP_SERVER_REQUEST()`, `COUNTER_HTTP_SERVER_RESPONSE()`, `COUNTER_HTTP_CLIENT_REQUEST()` နဲ့ `COUNTER_HTTP_CLIENT_RESPONSE()` functions တွေကို deprecated လုပ်ထားပါတယ်။

### DEP0121: `net._setSimultaneousAccepts()`

Type: End-of-Life

Documentation မလုပ်ထားတဲ့ `net._setSimultaneousAccepts()` function က Windows ပေါ်မှာ `node:child_process` နဲ့ `node:cluster` modules တွေကို သုံးတဲ့အခါ — debugging နဲ့ performance tuning (စွမ်းဆောင်ရည် ချိန်ညှိမှု) တွေအတွက် မူလ ရည်ရွယ်ခဲ့တာပါ။ ဒီ function က ယေဘုယျအားဖြင့် အသုံးမဝင်တာမို့ — ဖယ်ရှားနေပါပြီ။ ဆွေးနွေးချက်ကို ဒီမှာ ကြည့်ပါ: <https://github.com/nodejs/node/issues/18391>

### DEP0122: `tls` `Server.prototype.setOptions()`

Type: End-of-Life

`Server.prototype.setSecureContext()` ကို အစား သုံးပေးပါ။

### DEP0123: setting the TLS ServerName to an IP address

Type: End-of-Life

TLS ServerName ကို IP address တစ်ခုအဖြစ် သတ်မှတ်တာကို [RFC 6066][] က ခွင့်မပြုပါဘူး။

### DEP0124: using `REPLServer.rli`

Type: End-of-Life

ဒီ property က instance ကိုယ်တိုင်ဆီကို ရည်ညွှန်းချက် (reference) တစ်ခုပါ။

### DEP0125: `require('node:_stream_wrap')`

Type: End-of-Life

`node:_stream_wrap` module က deprecated ဖြစ်ပါတယ်။

### DEP0126: `timers.active()`

Type: End-of-Life

အရင်က documentation မလုပ်ခဲ့တဲ့ `timers.active()` ကို ဖယ်ရှားလိုက်ပါပြီ။ public အနေနဲ့ documentation လုပ်ထားတဲ့ [`timeout.refresh()`][] ကို သုံးပေးပါ။ Timeout ကို ပြန်လည်-ref (reference) လုပ်ဖို့ လိုအပ်ရင် — Node.js 10 ကစပြီး performance ထိခိုက်မှု မရှိဘဲ — [`timeout.ref()`][] ကို သုံးနိုင်ပါတယ်။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/timers-deprecations)).

```bash
npx codemod @nodejs/timers-deprecations
```

### DEP0127: `timers._unrefActive()`

Type: End-of-Life

အရင်က documentation မလုပ်ခဲ့ဘဲ "private" လို့ သတ်မှတ်ထားတဲ့ `timers._unrefActive()` ကို ဖယ်ရှားလိုက်ပါပြီ။ public အနေနဲ့ documentation လုပ်ထားတဲ့ [`timeout.refresh()`][] ကို သုံးပေးပါ။ Timeout ကို unreference လုပ်ဖို့ လိုအပ်ရင် — Node.js 10 ကစပြီး performance ထိခိုက်မှု မရှိဘဲ — [`timeout.unref()`][] ကို သုံးနိုင်ပါတယ်။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/timers-deprecations)).

```bash
npx codemod @nodejs/timers-deprecations
```

### DEP0128: modules with an invalid `main` entry and an `index.js` file

Type: Runtime

Invalid `main` entry (ဥပမာ — `./does-not-exist.js`) ရှိပြီး — top level directory ထဲမှာ `index.js` file တစ်ခုပါ ရှိနေတဲ့ modules တွေက `index.js` file ကို resolve လုပ်ပါလိမ့်မယ်။ ဒါက deprecated ဖြစ်ပြီး — နောင်ထွက်ရှိလာမယ့် Node.js versions တွေမှာ error တစ်ခုကို throw လုပ်တော့မှာ ဖြစ်ပါတယ်။

### DEP0129: `ChildProcess._channel`

Type: End-of-Life

`spawn()` နဲ့ အလားတူ functions တွေက ပြန်ပေးတဲ့ child process objects တွေရဲ့ `_channel` property က public အသုံးပြုမှုအတွက် ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ `ChildProcess.channel` ကို အစား သုံးပါ။

### DEP0130: `Module.createRequireFromPath()`

Type: End-of-Life

[`module.createRequire()`][] ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/create-require-from-path)):

```bash
npx codemod@latest @nodejs/create-require-from-path
```

### DEP0131: Legacy HTTP parser

Type: End-of-Life

Legacy HTTP parser ကို — Node.js 12.0.0 ထက် စောတဲ့ versions တွေမှာ default အဖြစ် သုံးခဲ့ပြီး — deprecated လုပ်ထားပြီး v13.0.0 မှာ ဖယ်ရှားလိုက်ပါပြီ။ v13.0.0 မတိုင်ခင် အချိန်တွေမှာ legacy parser ကို ပြန်သုံးဖို့ `--http-parser=legacy` command-line flag ကို သုံးနိုင်ခဲ့ပါတယ်။

### DEP0132: `worker.terminate()` with callback

Type: End-of-Life

[`worker.terminate()`][] ဆီကို callback တစ်ခု ဖြတ်သန်းပေးတာက deprecated ဖြစ်ပါတယ်။ ပြန်ပေးလိုက်တဲ့ `Promise` ကို အစား သုံးပါ — သို့မဟုတ် worker ရဲ့ `'exit'` event အတွက် listener တစ်ခုကို သုံးပါ။

### DEP0133: `http` `connection`

Type: Documentation-only

[`response.connection`][] အပေါ်မှာ [`response.socket`][] ကို ဦးစားပေးပြီး — [`request.connection`][] အပေါ်မှာ [`request.socket`][] ကို ဦးစားပေးပါ။

### DEP0134: `process._tickCallback`

Type: Documentation-only (supports [`--pending-deprecation`][])

`process._tickCallback` property ကို တရားဝင် ပံ့ပိုးထားတဲ့ API အဖြစ် ဘယ်တုန်းကမှ documentation မလုပ်ခဲ့ပါဘူး။

### DEP0135: `WriteStream.open()` and `ReadStream.open()` are internal

Type: End-of-Life

[`WriteStream.open()`][] နဲ့ [`ReadStream.open()`][] တို့က userland မှာ သုံးဖို့ အဓိပ္ပာယ် မရှိတဲ့ documentation မလုပ်ထားတဲ့ internal APIs တွေပါ။ File streams တွေကို အမြဲတမ်း ၎င်းတို့နဲ့ သက်ဆိုင်တဲ့ factory methods ဖြစ်တဲ့ [`fs.createWriteStream()`][] နဲ့ [`fs.createReadStream()`][]) ကနေတစ်ဆင့် ဖွင့်သင့်ပါတယ် — သို့မဟုတ် options တွေထဲမှာ file descriptor တစ်ခုကို ဖြတ်သန်းပေးခြင်းအားဖြင့် ဖွင့်သင့်ပါတယ်။

### DEP0136: `http` `finished`

Type: Documentation-only

[`response.finished`][] က [`response.end()`][] ကို ခေါ်ထားပြီးလား ဆိုတာကိုသာ ဖော်ပြပါတယ် — `'finish'` ကို emit လုပ်ပြီး အခြေခံ data တွေ flush ဖြစ်သွားပြီလားဆိုတာကို မဟုတ်ပါဘူး။

မရှင်းလင်းမှုတွေကို ရှောင်ရှားဖို့ — အဲဒီအစား [`response.writableFinished`][] သို့မဟုတ် [`response.writableEnded`][] ကို လိုအပ်သလို သုံးပါ။

ရှိပြီးသား အပြုအမူ (behavior) ကို ထိန်းသိမ်းဖို့ဆိုရင် `response.finished` ကို `response.writableEnded` နဲ့ အစားထိုးသင့်ပါတယ်။

### DEP0137: Closing fs.FileHandle on garbage collection

Type: End-of-Life

[`fs.FileHandle`][] object တစ်ခုကို garbage collection ပေါ်မှာ ပိတ်လို့ ရအောင် ခွင့်ပြုတာက အရင်က ခွင့်ပြုခဲ့ပေမယ့် — အခုတော့ error တစ်ခုကို throw လုပ်ပါတယ်။

`fs.FileHandle` objects တွေ အားလုံးကို — `fs.FileHandle` က မလိုအပ်တော့တဲ့အခါ — `FileHandle.prototype.close()` ကို သုံးပြီး အတိအကျ (explicitly) ပိတ်ပေးဖို့ သေချာစေပါ:

```js
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
```

### DEP0138: `process.mainModule`

Type: Documentation-only

[`process.mainModule`][] က CommonJS-only feature တစ်ခု ဖြစ်ပြီး — `process` global object ကိုတော့ CommonJS မဟုတ်တဲ့ environment တွေနဲ့ မျှဝေထားပါတယ်။ ECMAScript modules တွေထဲမှာ ၎င်းကို သုံးတာက support မလုပ်ပါဘူး။

၎င်းက တူညီတဲ့ ရည်ရွယ်ချက်ကို ဆောင်ရွက်ပေးပြီး — CommonJS environment ပေါ်မှာသာ ရရှိနိုင်တာမို့ — [`require.main`][] ဘက်ကို ဦးစားပေးပြီး deprecated ဖြစ်ပါတယ်။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/process-main-module)):

```bash
npx codemod@latest @nodejs/process-main-module
```

### DEP0139: `process.umask()` with no arguments

Type: Documentation-only

`process.umask()` ကို argument မပါပဲ ခေါ်လိုက်တာက process တစ်ခုလုံးဆိုင်ရာ umask ကို နှစ်ကြိမ် ရေးသားစေပါတယ်။ ဒါက threads တွေကြားမှာ race condition တစ်ခုကို ဖြစ်ပေါ်စေပြီး — လုံခြုံရေး အားနည်းချက် (security vulnerability) တစ်ခု ဖြစ်လာနိုင်ပါတယ်။ လုံခြုံပြီး cross-platform ဖြစ်တဲ့ အခြားရွေးချယ်စရာ API တစ်ခု မရှိပါဘူး။

### DEP0140: Use `request.destroy()` instead of `request.abort()`

Type: Documentation-only

[`request.abort()`][] အစား [`request.destroy()`][] ကို သုံးပါ။

### DEP0141: `repl.inputStream` and `repl.outputStream`

Type: Documentation-only (supports [`--pending-deprecation`][])

`node:repl` module က input နဲ့ output stream တွေကို နှစ်ကြိမ် export လုပ်ခဲ့ပါတယ်။ `.inputStream` အစား `.input` ကို သုံးပြီး — `.outputStream` အစား `.output` ကို သုံးပါ။

### DEP0142: `repl._builtinLibs`

Type: Documentation-only (supports [`--pending-deprecation`][])

`node:repl` module က built-in modules တွေရဲ့ array တစ်ခု ပါဝင်တဲ့ `_builtinLibs` property တစ်ခုကို export လုပ်ပါတယ်။ ၎င်းက အခုထိ မပြည့်စုံသေးတာမို့ — `require('node:module').builtinModules` ကို မှီခိုတာက ပိုကောင်းပါတယ်။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/repl-builtin-modules)):

```bash
npx codemod@latest @nodejs/repl-builtin-modules
```

### DEP0143: `Transform._transformState`

Type: End-of-Life

`Transform._transformState` ကို — အကောင်အထည်ဖော်မှု (implementation) ကို ရိုးရှင်းအောင် လုပ်လိုက်လို့ မလိုအပ်တော့တဲ့ — အနာဂတ် versions တွေမှာ ဖယ်ရှားပါလိမ့်မယ်။

### DEP0144: `module.parent`

Type: Documentation-only (supports [`--pending-deprecation`][])

CommonJS module တစ်ခုက ၎င်းကို ပထမဆုံး require လုပ်ခဲ့တဲ့ module ကို `module.parent` ကို သုံးပြီး ဝင်ရောက်နိုင်ပါတယ်။ ဒီ feature က — ECMAScript modules တွေ ရှိနေတဲ့အခါ ကိုက်ညီမှု (consistently) ရှိစွာ အလုပ်မလုပ်တာမို့ ဖြစ်ပြီး — CommonJS module graph ရဲ့ တိကျမှု မရှိတဲ့ ကိုယ်စားပြုမှုကိုလည်း ပေးနေလို့ — deprecated ဖြစ်ပါတယ်။

Modules တစ်ချို့က သူတို့ကိုယ်တိုင် လက်ရှိ process ရဲ့ entry point ဟုတ်မဟုတ် စစ်ဆေးဖို့ ၎င်းကို သုံးကြပါတယ်။ အဲဒီအစား `require.main` နဲ့ `module` ကို နှိုင်းယှဉ်ဖို့ အကြံပြုပါတယ်:

```js
if (require.main === module) {
  // Code section that will run only if current file is the entry point.
}
```

လက်ရှိ module ကို require လုပ်ထားတဲ့ CommonJS modules တွေကို ရှာဖွေချင်ရင် `require.cache` နဲ့ `module.children` ကို သုံးနိုင်ပါတယ်:

```js
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
```

### DEP0145: `socket.bufferSize`

Type: Documentation-only

[`socket.bufferSize`][] က [`writable.writableLength`][] ရဲ့ alias တစ်ခုမျှသာ ဖြစ်ပါတယ်။

### DEP0146: `new crypto.Certificate()`

Type: Documentation-only

[`crypto.Certificate()` constructor][] က deprecated ဖြစ်ပါတယ်။ [static methods of `crypto.Certificate()`][] ကို အစား သုံးပါ။

### DEP0147: `fs.rmdir(path, { recursive: true })`

Type: End-of-Life

`fs.rmdir`, `fs.rmdirSync` နဲ့ `fs.promises.rmdir` methods တွေက `recursive` option တစ်ခုကို support လုပ်ခဲ့ဖူးပါတယ်။ အဲဒီ option ကို ဖယ်ရှားလိုက်ပါပြီ။

`fs.rm(path, { recursive: true, force: true })`, `fs.rmSync(path, { recursive: true, force: true })` သို့မဟုတ် `fs.promises.rm(path, { recursive: true, force: true })` ကို အစား သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/rmdir)):

```bash
npx codemod@latest @nodejs/rmdir
```

### DEP0148: Folder mappings in `"exports"` (trailing `"/"`)

Type: End-of-Life

[subpath exports][] သို့မဟုတ် [subpath imports][] fields တွေထဲမှာ subpath folder mappings တွေကို သတ်မှတ်ဖို့ နောက်ဆုံးမှာ `"/"` ပါတဲ့ trailing slash ကို သုံးတာကို ဆက်လက် support မလုပ်တော့ပါဘူး။ [subpath patterns][] ကို အစား သုံးပါ။

### DEP0149: `http.IncomingMessage#connection`

Type: Documentation-only

[`message.connection`][] အပေါ်မှာ [`message.socket`][] ကို ဦးစားပေးပါ။

### DEP0150: Changing the value of `process.config`

Type: End-of-Life

`process.config` property က Node.js ရဲ့ compile-time settings တွေဆီကို ဝင်ရောက်ခွင့် ပေးပါတယ်။ ဒါပေမယ့် ဒီ property က ပြုပြင်ပြောင်းလဲလို့ ရနေတာမို့ — tampering (ဝင်ရောက် ဖောက်ပြန်မှု) ရဲ့ အန္တရာယ် ရှိနေပါတယ်။ တန်ဖိုးကို ပြောင်းလဲနိုင်တဲ့ စွမ်းရည်ကို Node.js ရဲ့ အနာဂတ် version တစ်ခုမှာ ဖယ်ရှားသွားပါလိမ့်မယ်။

### DEP0151: Main index lookup and extension searching

Type: Runtime

အရင်က `index.js` နဲ့ extension searching lookups တွေက — ES modules တွေကို resolve လုပ်နေတဲ့အခါမှာတောင် — `import 'pkg'` main entry point resolution အတွက်ပါ သက်ရောက်ခဲ့ပါတယ်။

ဒီ deprecation နဲ့အတူ ES module main entry point resolutions တွေ အားလုံးက — တိကျတဲ့ file extension ပါတဲ့ — ထင်ရှားတဲ့ [`"exports"` or `"main"` entry][] တစ်ခုကို လိုအပ်ပါတယ်။

### DEP0152: Extension PerformanceEntry properties

Type: End-of-Life

`'gc'`, `'http2'` နဲ့ `'http'` {PerformanceEntry} object types တွေမှာ အရင်က ထပ်ဆောင်း အချက်အလက်တွေကို ပေးတဲ့ properties တွေ ထပ်ဆောင်း သတ်မှတ်ပေးထားခဲ့ပါတယ်။ ဒီ properties တွေကို အခုအခါ `PerformanceEntry` object ရဲ့ standard `detail` property ထဲမှာ ရရှိနိုင်ပါတယ်။ Deprecated accessors တွေကို ဖယ်ရှားလိုက်ပါပြီ။

### DEP0153: `dns.lookup` and `dnsPromises.lookup` options type coercion

Type: End-of-Life

[`dns.lookup()`][] နဲ့ [`dnsPromises.lookup()`][] တို့မှာ — `family` option အတွက် nullish မဟုတ်တဲ့ non-integer တန်ဖိုး၊ `hints` option အတွက် nullish မဟုတ်တဲ့ non-number တန်ဖိုး၊ `all` option အတွက် nullish မဟုတ်တဲ့ non-boolean တန်ဖိုး၊ သို့မဟုတ် `verbatim` option အတွက် nullish မဟုတ်တဲ့ non-boolean တန်ဖိုး တစ်ခုကို သုံးလိုက်ရင် `ERR_INVALID_ARG_TYPE` error တစ်ခုကို throw လုပ်ပါတယ်။

### DEP0154: RSA-PSS generate key pair options

Type: End-of-Life

`'hash'` အစား `'hashAlgorithm'` ကို သုံးပြီး — `'mgf1Hash'` အစား `'mgf1HashAlgorithm'` ကို သုံးပါ။

အလိုအလျောက် migration လည်း ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/crypto-rsa-pss-update)):

```bash
npx codemod@latest @nodejs/crypto-rsa-pss-update
```

### DEP0155: Trailing slashes in pattern specifier resolutions

Type: Runtime

Package `"exports"` နဲ့ `"imports"` pattern resolutions တွေအတွက် — `import 'pkg/x/'` လိုမျိုး `"/"` နဲ့ အဆုံးသတ်တဲ့ specifiers တွေကို remapping (ပြန်လည်စီမံခြင်း) လုပ်တာက deprecated ဖြစ်ပါတယ်။

### DEP0156: `.aborted` property and `'abort'`, `'aborted'` event in `http`

Type: Documentation-only

[`http.ClientRequest`][], [`http.ServerResponse`][] နဲ့ [`http.IncomingMessage`][] တွေ အားလုံးက stream-based တွေ ဖြစ်တာမို့ — {Stream} API ဆီကို ပြောင်းသုံးပါ။ `.aborted` property အစား `stream.destroyed` ကို စစ်ဆေးပြီး — `'abort'`, `'aborted'` event တွေအစား `'close'` ကို နားထောင်ပါ။

`.aborted` property နဲ့ `'abort'` event တို့က `.abort()` calls တွေကို ထောက်လှမ်းဖို့အတွက်သာ အသုံးဝင်ပါတယ်။ Request တစ်ခုကို စောစီးစွာ ပိတ်ဖို့ဆိုရင် Stream ရဲ့ `.destroy([error])` ကို သုံးပြီး — ၎င်းနောက်မှာ `.destroyed` property နဲ့ `'close'` event ကို စစ်ဆေးတာက ထပ်တူကျတဲ့ အကျိုးသက်ရောက်မှု ရှိသင့်ပါတယ်။ လက်ခံတဲ့ဘက်က — aborted (ဖျက်လိုက်တာ) လား၊ graceful destroy (ညင်သာစွာ ဖျက်လိုက်တာ) လားဆိုတာကို သိရှိဖို့ — [`http.IncomingMessage`][] ပေါ်မှာရှိတဲ့ [`readable.readableEnded`][] တန်ဖိုးကိုလည်း စစ်ဆေးသင့်ပါတယ်။


### DEP0157: Thenable support in streams

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

Node.js streams တွေရဲ့ မှတ်တမ်းမဝင်ခဲ့တဲ့ (undocumented) feature တစ်ခုက implementation methods တွေထဲမှာ thenables တွေကို ပံ့ပိုးပေးတာပဲ ဖြစ်ပါတယ်။ ဒါကို အခုတော့ deprecated လုပ်ထားပါတယ် — callbacks တွေကို သုံးပြီး streams ရဲ့ implementation methods တွေအတွက် async function တွေ သုံးတာကို ရှောင်ကြဉ်ပါ။

ဒီ feature က user တွေကို မမျှော်လင့်ထားတဲ့ ပြဿနာတွေနဲ့ ရင်ဆိုင်စေခဲ့ပါတယ် — function ကို callback ပုံစံနဲ့ implement လုပ်ထားပေမယ့် ဥပမာ async method တစ်ခုလိုမျိုး သုံးမိရင် promise နဲ့ callback semantics တွေ ရောနှောတာက မမှန်ကန်တာမို့ error ဖြစ်စေနိုင်ပါတယ်။

```js
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
```

### DEP0158: `buffer.slice(start, end)`

Type: Documentation-only (documentation သက်သက်)

ဒီ method က `Buffer` ရဲ့ superclass ဖြစ်တဲ့ `Uint8Array.prototype.slice()` နဲ့ သဟဇာတ မဖြစ်တာမို့ deprecated လုပ်ထားပါတယ်။

အလားတူ လုပ်ဆောင်ချက် ရှိတဲ့ [`buffer.subarray`][] ကို အစားထိုး သုံးပါ။

### DEP0159: `ERR_INVALID_CALLBACK`

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

ဒီ error code က value type validation (တန်ဖိုး အမျိုးအစား စစ်ဆေးခြင်း) တွေအတွက် သုံးတဲ့ errors တွေကို ပိုပြီး ရှုပ်ထွေးစေတာမို့ ဖယ်ရှားလိုက်ပါပြီ။

အလိုအလျောက် migration ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/err-invalid-callback)):

```bash
npx codemod @nodejs/err-invalid-callback
```

### DEP0160: `process.on('multipleResolves', handler)`

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

ဒီ event က V8 promise combinators တွေနဲ့ အလုပ်မလုပ်တာမို့ ၎င်းရဲ့ အသုံးဝင်မှုကို လျော့ကျစေခဲ့ပြီး — deprecated လုပ်ပြီး ဖယ်ရှားလိုက်ပါပြီ။

### DEP0161: `process._getActiveRequests()` and `process._getActiveHandles()`

Type: Documentation-only (documentation သက်သက်)

`process._getActiveHandles()` နဲ့ `process._getActiveRequests()` functions တွေက public အသုံးပြုမှုအတွက် ရည်ရွယ်ထားတာ မဟုတ်ပဲ — နောင်ထွက်ရှိလာမယ့် releases တွေမှာ ဖယ်ရှားခံရနိုင်ပါတယ်။

Active resources တွေရဲ့ အမျိုးအစားတွေရဲ့ list တစ်ခုကို ရယူဖို့ [`process.getActiveResourcesInfo()`][] ကို သုံးပါ — တကယ့် references တွေကို ရယူဖို့ မဟုတ်ပါဘူး။

### DEP0162: `fs.write()`, `fs.writeFileSync()` coercion to string

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

ကိုယ်ပိုင် `toString` property ရှိတဲ့ objects တွေကို [`fs.write()`][], [`fs.writeFile()`][], [`fs.appendFile()`][], [`fs.writeFileSync()`][], နဲ့ [`fs.appendFileSync()`][] တို့ရဲ့ ဒုတိယ parameter အဖြစ် ပေးပို့လိုက်တဲ့အခါ string အဖြစ် သွယ်ဝိုက် ပြောင်းလဲပေးတာ (implicit coercion) ကို deprecated လုပ်ထားပါတယ်။ ၎င်းတို့ကို primitive strings တွေအဖြစ် ပြောင်းလဲပြီးမှ ပေးပို့ပါ။

### DEP0163: `channel.subscribe(onMessage)`, `channel.unsubscribe(onMessage)`

Type: Deprecation revoked (deprecation ပြန်ရုတ်သိမ်းပြီး)

ဒီ methods တွေကို deprecated လုပ်ခဲ့ရတာက — user က ခိုင်မာစွာ reference လုပ်မထားရင် channel object ဟာ garbage-collected (အမှိုက်သိမ်းခြင်း ခံရခြင်း) ဖြစ်ပြီး ပျောက်ကွယ်သွားနိုင်လို့ပါ။ Channel objects တွေမှာ active subscribers တွေ ရှိနေသရွေ့ garbage collection ကို ခံနိုင်ရည် (resistant) ရှိအောင် ပြုလုပ်ထားတာမို့ အခုတော့ deprecation ကို ပြန်ရုတ်သိမ်းလိုက်ပါတယ်။

### DEP0164: `process.exit(code)`, `process.exitCode` coercion to integer

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

[`process.exit()`][] ရဲ့ `code` parameter အတွက်ရော [`process.exitCode`][] ကို သတ်မှတ်ပေးဖို့အတွက်ပါ — `undefined`, `null`, integer numbers တွေနဲ့ integer strings တွေ (ဥပမာ `'1'`) မဟုတ်တဲ့ တန်ဖိုးတွေကို deprecated လုပ်ထားပါတယ်။

### DEP0165: `--trace-atomics-wait`

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

`--trace-atomics-wait` flag က V8 hook ဖြစ်တဲ့ `SetAtomicsWaitCallback` ကို သုံးထားတာမို့ ဖယ်ရှားလိုက်ပါပြီ — အဲဒီ hook က နောင် V8 release တစ်ခုမှာ ဖယ်ရှားခံရမှာ ဖြစ်ပါတယ်။

### DEP0166: Double slashes in imports and exports targets

Type: Runtime (code အားလုံးအတွက်)

Package imports နဲ့ exports targets တွေက double slash (slash နှစ်ခု) ပါဝင်တဲ့ paths တွေဆီ ညွှန်းတာ (_"/"_ သို့မဟုတ် _"\\"_) ကို deprecated လုပ်ထားပြီး — နောင်ထွက်ရှိမယ့် release တစ်ခုမှာ resolution validation error နဲ့ ကျရှုံးသွားပါလိမ့်မယ်။ Slash တစ်ခုနဲ့ စတင်တဲ့ သို့မဟုတ် အဆုံးသတ်တဲ့ pattern matches တွေအတွက်လည်း ဒီ deprecation က အလားတူ သက်ရောက်မှု ရှိပါတယ်။

### DEP0167: Weak `DiffieHellmanGroup` instances (`modp1`, `modp2`, `modp5`)

Type: Documentation-only (documentation သက်သက်)

လူသိများတဲ့ MODP groups ဖြစ်တဲ့ `modp1`, `modp2`, နဲ့ `modp5` တို့ဟာ လက်တွေ့ ကျင့်သုံးနိုင်တဲ့ တိုက်ခိုက်မှုတွေကို မခံနိုင်တာမို့ deprecated လုပ်ထားပါတယ်။ အသေးစိတ်အတွက် [RFC 8247 Section 2.4][] ကို ကြည့်ပါ။

ဒီ groups တွေကို Node.js ရဲ့ နောင်ဗားရှင်းတွေမှာ ဖယ်ရှားခံရနိုင်ပါတယ်။ ဒီ groups တွေကို မှီခိုနေတဲ့ applications တွေက ပိုမို အားကောင်းတဲ့ MODP groups တွေကို သုံးဖို့ အကဲဖြတ် စဉ်းစားသင့်ပါတယ်။

### DEP0168: Unhandled exception in Node-API callbacks

Type: Runtime (code အားလုံးအတွက်)

Node-API callbacks တွေထဲမှာ မကိုင်တွယ်ရသေးတဲ့ (uncaught) exceptions တွေကို သွယ်ဝိုက် ဖိနှိပ် (implicit suppression) ထားတာကို အခုဆို deprecated လုပ်ပါပြီ။

Node-API callbacks တွေထဲမှာ exception ကို မကိုင်တွယ်နိုင်ခဲ့ရင် Node.js က [`'uncaughtException'`][] event တစ်ခုကို emit လုပ်အောင် — [`--force-node-api-uncaught-exceptions-policy`][] flag ကို သတ်မှတ်ပါ။

### DEP0169: Insecure url.parse()

Type: Application (non-`node_modules` code အတွက်သာ)

[`url.parse()`][] ရဲ့ အပြုအမူ (behavior) က စံသတ်မှတ်ထားတာ မဟုတ်ပဲ security ဆိုင်ရာ သက်ရောက်မှုတွေ ရှိနိုင်တဲ့ errors တွေ ဖြစ်ပေါ်လွယ်ပါတယ်။ [WHATWG URL API][] ကို အစားထိုး သုံးပါ။ `url.parse()` ရဲ့ အားနည်းချက်တွေအတွက် CVEs တွေကို ထုတ်ပြန်ပေးတာ မရှိပါဘူး။

[`url.format(urlString)`][] သို့မဟုတ် [`url.resolve()`][] ကို ခေါ်တာက အတွင်းပိုင်းမှာ `url.parse()` ကို အသုံးပြုတာမို့ — ဒီ deprecation ရဲ့ သက်ရောက်မှုထဲမှာလည်း အကျုံးဝင်ပါတယ်။

### DEP0170: Invalid port when using `url.parse()`

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

[`url.parse()`][] က အရင်တုန်းက number မဟုတ်တဲ့ ports တွေ ပါဝင်တဲ့ URLs တွေကို လက်ခံခဲ့ပါတယ်။ ဒီအပြုအမူက မမျှော်လင့်ထားတဲ့ input တွေနဲ့ host name spoofing (host အမည် အတုအယောင် ပြုလုပ်ခြင်း) ဖြစ်ပေါ်စေနိုင်ပါတယ်။ ဒီလို URLs တွေက error တစ်ခုကို throw လုပ်ပါလိမ့်မယ် ([WHATWG URL API][] မှာလည်း အလားတူပါပဲ)။

### DEP0171: Setters for `http.IncomingMessage` headers and trailers

Type: Documentation-only (documentation သက်သက်)

Node.js ရဲ့ နောင်ဗားရှင်းတစ်ခုမှာ [`message.headers`][], [`message.headersDistinct`][], [`message.trailers`][], နဲ့ [`message.trailersDistinct`][] တို့ဟာ read-only (ဖတ်ရုံသက်သက်) ဖြစ်သွားမှာ ဖြစ်ပါတယ်။

### DEP0172: The `asyncResource` property of `AsyncResource` bound functions

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

Node.js ရဲ့ အစောပိုင်း ဗားရှင်းတွေမှာ function တစ်ခုကို `AsyncResource` တစ်ခုနဲ့ bind လုပ်တဲ့အခါ `asyncResource` property ကို ထည့်သွင်းပေးခဲ့ပါတယ်။ အခုတော့ အဲဒီလို ထည့်သွင်းပေးတော့မှာ မဟုတ်ပါဘူး။

### DEP0173: the `assert.CallTracker` class

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

`assert.CallTracker` API ကို ဖယ်ရှားလိုက်ပါပြီ။

### DEP0174: calling `promisify` on a function that returns a `Promise`

Type: Runtime (code အားလုံးအတွက်)

`Promise` တစ်ခုကို ပြန်ပေးတဲ့ function တစ်ခုပေါ်မှာ [`util.promisify`][] ကို ခေါ်တာက အဲဒီ promise ရဲ့ ရလဒ်ကို လျစ်လျူရှုလိုက်တာမို့ — unhandled promise rejections တွေ ဖြစ်ပေါ်စေနိုင်ပါတယ်။

### DEP0175: `util.toUSVString`

Type: Documentation-only (documentation သက်သက်)

[`util.toUSVString()`][] API ကို deprecated လုပ်ထားပါတယ်။ [`String.prototype.toWellFormed`][] ကို အစားထိုး သုံးပါ။

### DEP0176: `fs.F_OK`, `fs.R_OK`, `fs.W_OK`, `fs.X_OK`

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

`node:fs` ပေါ်မှာ တိုက်ရိုက် ထုတ်ဖော်ထားတဲ့ `F_OK`, `R_OK`, `W_OK` နဲ့ `X_OK` getters တွေကို ဖယ်ရှားလိုက်ပါပြီ။ ၎င်းတို့ကို `fs.constants` သို့မဟုတ် `fs.promises.constants` ကနေ ရယူပါ။

အလိုအလျောက် migration ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/fs-access-mode-constants)):

```bash
npx codemod@latest @nodejs/fs-access-mode-constants
```

### DEP0177: `util.types.isWebAssemblyCompiledModule`

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

`util.types.isWebAssemblyCompiledModule` API ကို ဖယ်ရှားလိုက်ပါပြီ။ `value instanceof WebAssembly.Module` ကို အစားထိုး သုံးပါ။

### DEP0178: `dirent.path`

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

`dirent.path` property က release lines (ထုတ်ဝေမှု လိုင်းများ) တစ်လျှောက် ညီညွတ်မှု (consistency) မရှိတာကြောင့် ဖယ်ရှားလိုက်ပါပြီ။ [`dirent.parentPath`][] ကို အစားထိုး သုံးပါ။

အလိုအလျောက် migration ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/dirent-path-to-parent-path)):

```bash
npx codemod@latest @nodejs/dirent-path-to-parent-path
```

### DEP0179: `Hash` constructor

Type: Runtime (code အားလုံးအတွက်)

`Hash()` သို့မဟုတ် `new Hash()` နဲ့ `Hash` class ကို တိုက်ရိုက် ခေါ်တာက — internals တွေ ဖြစ်ပြီး public အသုံးပြုမှုအတွက် ရည်ရွယ်ထားတာ မဟုတ်တာမို့ — deprecated ဖြစ်ပါတယ်။ Hash instances တွေ ဖန်တီးဖို့ [`crypto.createHash()`][] method ကို သုံးပါ။

### DEP0180: `fs.Stats` constructor

Type: Runtime (code အားလုံးအတွက်)

`Stats()` သို့မဟုတ် `new Stats()` နဲ့ `fs.Stats` class ကို တိုက်ရိုက် ခေါ်တာက — internals တွေ ဖြစ်ပြီး public အသုံးပြုမှုအတွက် ရည်ရွယ်ထားတာ မဟုတ်တာမို့ — deprecated ဖြစ်ပါတယ်။

### DEP0181: `Hmac` constructor

Type: Runtime (code အားလုံးအတွက်)

`Hmac()` သို့မဟုတ် `new Hmac()` နဲ့ `Hmac` class ကို တိုက်ရိုက် ခေါ်တာက — internals တွေ ဖြစ်ပြီး public အသုံးပြုမှုအတွက် ရည်ရွယ်ထားတာ မဟုတ်တာမို့ — deprecated ဖြစ်ပါတယ်။ Hmac instances တွေ ဖန်တီးဖို့ [`crypto.createHmac()`][] method ကို သုံးပါ။

### DEP0182: Short GCM authentication tags without explicit `authTagLength`

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

GCM mode ရှိ ciphers တွေအတွက် [`decipher.setAuthTag()`][] function က အရင်တုန်းက တရားဝင် အလျား (valid length) ရှိတဲ့ authentication tags တွေ အားလုံးကို လက်ခံခဲ့ပါတယ် ([DEP0090](#DEP0090) ကိုလည်း ကြည့်ပါ)။ ဒီခြွင်းချက် (exception) ကို [NIST SP 800-38D][] ရဲ့ အကြံပြုချက်တွေနဲ့ ပိုမို ကိုက်ညီအောင် ဖယ်ရှားလိုက်ပါပြီ — ပုံမှန် authentication tag အလျားထက် ပိုတိုတဲ့ (AES-GCM အတွက် 16 bytes ထက် ပိုတိုသော) authentication tags တွေကို သုံးချင်တဲ့ applications တွေက [`crypto.createDecipheriv()`][] function ရဲ့ `authTagLength` option ကို သင့်တော်တဲ့ အလျားနဲ့ အတိအကျ သတ်မှတ်ပေးရပါမယ်။

### DEP0183: OpenSSL engine-based APIs

Type: Documentation-only (documentation သက်သက်)

OpenSSL 3 က custom engines တွေအတွက် ပံ့ပိုးမှုကို deprecated လုပ်ပြီး ၎င်းရဲ့ provider model အသစ်ဆီ ပြောင်းရွှေ့ဖို့ အကြံပြုထားပါတယ်။ `https.request()`, [`tls.createSecureContext()`][], နဲ့ [`tls.createServer()`][] တို့အတွက် `clientCertEngine` option; [`tls.createSecureContext()`][] အတွက် `privateKeyEngine` နဲ့ `privateKeyIdentifier`; ပြီးတော့ [`crypto.setEngine()`][] — ဒါတွေ အားလုံးက OpenSSL ရဲ့ ဒီလုပ်ဆောင်ချက်အပေါ် မှီခိုနေပါတယ်။

### DEP0184: Instantiating `node:zlib` classes without `new`

Type: Runtime (code အားလုံးအတွက်)

`node:zlib` module က export လုပ်ထားတဲ့ classes တွေကို `new` qualifier မပါဘဲ instantiate (ဖန်တီးအသုံးပြု) လုပ်တာကို deprecated လုပ်ထားပါတယ်။ `new` qualifier ကို သုံးဖို့ အကြံပြုပါတယ်။ ဒါက Zlib classes အားလုံးနဲ့ သက်ဆိုင်ပြီး `Deflate`, `DeflateRaw`, `Gunzip`, `Inflate`, `InflateRaw`, `Unzip`, နဲ့ `Zlib` စသည်တို့ ပါဝင်ပါတယ်။

### DEP0185: Instantiating `node:repl` classes without `new`

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

`node:repl` module က export လုပ်ထားတဲ့ classes တွေကို `new` qualifier မပါဘဲ instantiate လုပ်တာကို deprecated လုပ်ထားပါတယ်။ `new` qualifier ကို အသုံးပြုရပါမယ်။ ဒါက REPL classes အားလုံးနဲ့ သက်ဆိုင်ပြီး `REPLServer` နဲ့ `Recoverable` တို့လည်း ပါဝင်ပါတယ်။

အလိုအလျောက် migration ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/repl-classes-with-new)):

```bash
npx codemod@latest @nodejs/repl-classes-with-new
```

### DEP0187: Passing invalid argument types to `fs.existsSync`

Type: Runtime (code အားလုံးအတွက်)

ပံ့ပိုးမထားတဲ့ argument types တွေကို ပေးပို့တာကို deprecated လုပ်ထားပြီး — `false` ကို ပြန်ပေးတာအစား နောင်ဗားရှင်းတစ်ခုမှာ error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### DEP0188: `process.features.ipv6` and `process.features.uv`

Type: Documentation-only (documentation သက်သက်)

ဒီ properties တွေဟာ ခြွင်းချက်မရှိ `true` ဖြစ်ပါတယ်။ ဒီ properties တွေကို အခြေခံထားတဲ့ စစ်ဆေးမှုတွေ အားလုံးဟာ မလိုအပ်တဲ့ ထပ်နေသော (redundant) အလုပ်တွေပါ။

### DEP0189: `process.features.tls_*`

Type: Documentation-only (documentation သက်သက်)

`process.features.tls_alpn`, `process.features.tls_ocsp`, နဲ့ `process.features.tls_sni` တို့ရဲ့ တန်ဖိုးတွေဟာ `process.features.tls` ရဲ့ တန်ဖိုးနဲ့ တူညီနေမှာ သေချာတာမို့ — ဒါတွေကို deprecated လုပ်ထားပါတယ်။

### DEP0190: Passing `args` to `node:child_process` `execFile`/`spawn` with `shell` option

Type: Runtime (code အားလုံးအတွက်)

`args` array တစ်ခုကို `{ shell: true }` သို့မဟုတ် `{ shell: '/path/to/shell' }` option နဲ့အတူ [`child_process.execFile`][] သို့မဟုတ် [`child_process.spawn`][] ဆီ ပေးပို့တဲ့အခါ — တန်ဖိုးတွေကို escape မလုပ်ပဲ space နဲ့သာ ခွဲခြားပေးတာမို့ shell injection (shell ထဲ မသင့်လျော်သော command များ ထည့်သွင်းခြင်း) ဖြစ်ပေါ်စေနိုင်ပါတယ်။

### DEP0191: `repl.builtinModules`

Type: Documentation-only (documentation သက်သက် — [`--pending-deprecation`][] ကိုလည်း ပံ့ပိုးသည်)

`node:repl` module က built-in modules တွေရဲ့ array တစ်ခု ပါဝင်တဲ့ `builtinModules` property တစ်ခုကို export လုပ်ပါတယ်။ ဒါက မပြည့်စုံခဲ့ပဲ — အရင်ကတည်းက deprecated ဖြစ်နေတဲ့ `repl._builtinLibs` ([DEP0142][]) နဲ့ ကိုက်ညီနေခဲ့ပါတယ်။ အဲဒီအစား `require('node:module').builtinModules` ကို မှီခိုတာက ပိုကောင်းပါတယ်။

အလိုအလျောက် migration ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/repl-builtin-modules)):

```bash
npx codemod@latest @nodejs/repl-builtin-modules
```

### DEP0192: `require('node:_tls_common')` and `require('node:_tls_wrap')`

Type: Runtime (code အားလုံးအတွက်)

`node:_tls_common` နဲ့ `node:_tls_wrap` modules တွေကို public facing API တစ်ခုထက် nodejs ရဲ့ အတွင်းပိုင်း (internal) implementation တစ်ခုအဖြစ်သာ မှတ်ယူသင့်တာမို့ — deprecated လုပ်ထားပါတယ်။ `node:tls` ကို သုံးပါ။

### DEP0193: `require('node:_stream_*')`

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

`node:_stream_duplex`, `node:_stream_passthrough`, `node:_stream_readable`, `node:_stream_transform`, `node:_stream_wrap` နဲ့ `node:_stream_writable` modules တွေကို public facing API တစ်ခုထက် nodejs ရဲ့ အတွင်းပိုင်း implementation တစ်ခုအဖြစ်သာ မှတ်ယူသင့်တာမို့ — deprecated လုပ်ထားပါတယ်။ `node:stream` ကို သုံးပါ။

### DEP0194: HTTP/2 priority signaling

Type: End-of-Life (သက်တမ်းကုန်ဆုံး)

[RFC 9113][] မှာ deprecate လုပ်ပြီးနောက် priority signaling အတွက် ပံ့ပိုးမှုကို ဖယ်ရှားလိုက်ပါပြီ။

အလိုအလျောက် migration ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/http2-priority-signaling)):

```bash
npx codemod@latest @nodejs/http2-priority-signaling
```

### DEP0195: Instantiating `node:http` classes without `new`

Type: Documentation-only (documentation သက်သက်)

`node:http` module က export လုပ်ထားတဲ့ classes တွေကို `new` qualifier မပါဘဲ instantiate လုပ်တာကို deprecated လုပ်ထားပါတယ်။ `new` qualifier ကို သုံးဖို့ အကြံပြုပါတယ်။ ဒါက http classes အားလုံးနဲ့ သက်ဆိုင်ပြီး `OutgoingMessage`, `IncomingMessage`, `ServerResponse` နဲ့ `ClientRequest` စသည်တို့ ပါဝင်ပါတယ်။

အလိုအလျောက် migration ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/http-classes-with-new)):

```bash
npx codemod@latest @nodejs/http-classes-with-new
```

### DEP0196: Calling `node:child_process` functions with `options.shell` as an empty string

Type: Documentation-only (documentation သက်သက်)

`{ shell: '' }` နဲ့ process တွေကို spawn လုပ်တဲ့ functions တွေကို ခေါ်တာက မရည်ရွယ်ဘဲ ဖြစ်တတ်တဲ့ အမှုတစ်ခု ဖြစ်ပြီး — ပုံမှန် မဟုတ်တဲ့ (aberrant) အပြုအမူတွေကို ဖြစ်စေနိုင်ပါတယ်။

[`child_process.execFile`][] သို့မဟုတ် [`child_process.spawn`][] ကို default shell သုံးစေချင်ရင် `{ shell: true }` ကို သုံးပါ။ Shell တစ်ခုကို မခေါ်ချင်ဘူးဆိုရင် (default အပြုအမူ) — `shell` option ကို ချန်လှပ်ထားပါ သို့မဟုတ် `false` (သို့) nullish တန်ဖိုးတစ်ခုကို သတ်မှတ်ပါ။

[`child_process.exec`][] ကို default shell သုံးစေချင်ရင် `shell` option ကို ချန်လှပ်ထားပါ သို့မဟုတ် nullish တန်ဖိုးတစ်ခု သတ်မှတ်ပါ။ Shell တစ်ခုကို မခေါ်ချင်ဘူးဆိုရင်တော့ [`child_process.execFile`][] ကို အစားထိုး သုံးပါ။

### DEP0197: `util.types.isNativeError()`

Type: Documentation-only (documentation သက်သက်)

[`util.types.isNativeError`][] API ကို deprecated လုပ်ထားပါတယ်။ [`Error.isError`][] ကို အစားထိုး သုံးပါ။

အလိုအလျောက် migration ရရှိနိုင်ပါတယ် ([source](https://github.com/nodejs/userland-migrations/tree/main/recipes/types-is-native-error)):

```bash
npx codemod@latest @nodejs/types-is-native-error
```

### DEP0198: Creating SHAKE-128 and SHAKE-256 digests without an explicit `options.outputLength`

Type: Runtime (code အားလုံးအတွက်)

`options.outputLength` ကို အတိအကျ မသတ်မှတ်ပဲ SHAKE-128 နဲ့ SHAKE-256 digests တွေကို ဖန်တီးတာကို deprecated လုပ်ထားပါတယ်။

### DEP0199: `require('node:_http_*')`

Type: Documentation-only (documentation သက်သက်)

`node:_http_agent`, `node:_http_client`, `node:_http_common`, `node:_http_incoming`, `node:_http_outgoing` နဲ့ `node:_http_server` modules တွေကို public facing API တစ်ခုထက် nodejs ရဲ့ အတွင်းပိုင်း implementation တစ်ခုအဖြစ်သာ မှတ်ယူသင့်တာမို့ — deprecated လုပ်ထားပါတယ်။ `node:http` ကို သုံးပါ။

### DEP0200: Closing fs.Dir on garbage collection

Type: Documentation-only (documentation သက်သက်)

[`fs.Dir`][] object တစ်ခုကို garbage collection (အမှိုက်သိမ်းချိန်) မှာ ပိတ်လို့ရအောင် ခွင့်ပြုထားတာကို deprecated လုပ်ထားပါတယ်။ နောင်တွင် ဒီလိုလုပ်တာက process ကို ရပ်တန့်စေမယ့် error တစ်ခုကို throw ဖြစ်စေနိုင်ပါတယ်။

`fs.Dir` objects တွေ အားလုံးကို `Dir.prototype.close()` သို့မဟုတ် `using` keyword သုံးပြီး အတိအကျ ပိတ်ပေးဖို့ သေချာစေပါ:

```mjs
import { opendir } from 'node:fs/promises';

{
  await using dir = await opendir('/async/disposable/directory');
} // Closed by dir[Symbol.asyncDispose]()

{
  using dir = await opendir('/sync/disposable/directory');
} // Closed by dir[Symbol.dispose]()

{
  const dir = await opendir('/unconditionally/iterated/directory');
  for await (const entry of dir) {
    // process an entry
  } // Closed by iterator
}

{
  let dir;
  try {
    dir = await opendir('/legacy/closeable/directory');
  } finally {
    await dir?.close();
  }
}
```

### DEP0201: Passing `options.type` to `Duplex.toWeb()`

Type: Runtime (code အားလုံးအတွက်)

[`Duplex.toWeb()`][] ဆီ `type` option ကို ပေးပို့တာကို deprecated လုပ်ထားပါတယ်။ တည်ဆောက်လိုက်တဲ့ readable-writable pair ရဲ့ readable ဘက်ခြမ်း (half) ရဲ့ အမျိုးအစားကို သတ်မှတ်ချင်ရင် `readableType` option ကို အစားထိုး သုံးပါ။

### DEP0202: `Http1IncomingMessage` and `Http1ServerResponse` options of HTTP/2 servers

Type: Documentation-only (documentation သက်သက်)

[`http2.createServer()`][] နဲ့ [`http2.createSecureServer()`][] တို့ရဲ့ `Http1IncomingMessage` နဲ့ `Http1ServerResponse` options တွေကို deprecated လုပ်ထားပါတယ်။ `http1Options.IncomingMessage` နဲ့ `http1Options.ServerResponse` တို့ကို အစားထိုး သုံးပါ။

```cjs
// Deprecated
const server = http2.createSecureServer({
  allowHTTP1: true,
  Http1IncomingMessage: MyIncomingMessage,
  Http1ServerResponse: MyServerResponse,
});
```

```cjs
// Use this instead
const server = http2.createSecureServer({
  allowHTTP1: true,
  http1Options: {
    IncomingMessage: MyIncomingMessage,
    ServerResponse: MyServerResponse,
  },
});
```

### DEP0203: Passing `CryptoKey` to `node:crypto` APIs

Type: Runtime (code အားလုံးအတွက်)

[`CryptoKey`][] တစ်ခုကို `node:crypto` functions တွေဆီ ပေးပို့တာကို deprecated လုပ်ထားပြီး — နောင်ဗားရှင်းတစ်ခုမှာ error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဒါတွေထဲမှာ [`crypto.createPublicKey()`][], [`crypto.createPrivateKey()`][], [`crypto.sign()`][], [`crypto.verify()`][], [`crypto.publicEncrypt()`][], [`crypto.publicDecrypt()`][], [`crypto.privateEncrypt()`][], [`crypto.privateDecrypt()`][], [`Sign.prototype.sign()`][], [`Verify.prototype.verify()`][], [`crypto.createHmac()`][], [`crypto.createCipheriv()`][], [`crypto.createDecipheriv()`][], [`crypto.encapsulate()`][] နဲ့ [`crypto.decapsulate()`][] တို့ ပါဝင်ပါတယ်။

### DEP0204: `KeyObject.from()` with non-extractable `CryptoKey`

Type: Runtime (code အားလုံးအတွက်)

Non-extractable (ထုတ်ယူ၍မရသော) [`CryptoKey`][] တစ်ခုကို [`KeyObject.from()`][] ဆီ ပေးပို့တာကို deprecated လုပ်ထားပြီး — နောင်ဗားရှင်းတစ်ခုမှာ error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### DEP0205: `module.register()`

Type: Runtime (code အားလုံးအတွက်)

[`module.register()`][] ကို deprecated လုပ်ထားပါတယ်။ [`module.registerHooks()`][] ကို အစားထိုး သုံးပါ။

`module.register()` API က ES modules တွေကို customize လုပ်ဖို့ thread ပြင်ပ (off-thread) async hooks တွေကို ပံ့ပိုးပေးပါတယ်; `module.registerHooks()` API ကတော့ အလားတူ hooks တွေကို synchronous, thread အတွင်းပိုင်း (in-thread) အနေနဲ့ ပံ့ပိုးပေးပြီး module အမျိုးအစား အားလုံးအတွက် အလုပ်လုပ်ပါတယ်။ Async hooks တွေကို ပံ့ပိုးပေးတာက worker threads တွေကို စီစဉ်ညှိနှိုင်းရတာ အပါအဝင် ရှုပ်ထွေးကြောင်း — ဖြေရှင်းလို့မရတဲ့ ပြဿနာတွေ ရှိနေကြောင်းလည်း သက်သေပြခဲ့ပြီးပါပြီ။ [caveats of asynchronous customization hooks][] ကို ကြည့်ပါ။ `module.register()` ကို Node.js ရဲ့ နောင်ဗားရှင်းတစ်ခုမှာ ဖယ်ရှားမှာ ဖြစ်တာမို့ — `module.registerHooks()` ဆီ တတ်နိုင်သမျှ အမြန်ဆုံး ပြောင်းရွှေ့ပေးပါ။

### DEP0206: Calling `digest()` on an already-finalized `Hmac` instance

Type: Documentation-only (documentation သက်သက်)

`hmac.digest()` ကို တစ်ကြိမ်ထက်ပိုပြီး ခေါ်တာက error တစ်ခုကို throw လုပ်မယ့်အစား empty buffer တစ်ခုကို ပြန်ပေးပါတယ်။ ဒီအပြုအမူက `hash.digest()` နဲ့ မကိုက်ညီပဲ — သိမ်မွေ့တဲ့ (subtle) bugs တွေကို ဖြစ်စေနိုင်ပါတယ်။ Finalize လုပ်ပြီးသား `Hmac` instance တစ်ခုပေါ်မှာ `hmac.digest()` ကို ခေါ်တာက နောင်ဗားရှင်းတစ်ခုမှာ error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

[DEP0142]: #dep0142-repl_builtinlibs
[NIST SP 800-38D]: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf
[RFC 6066]: https://tools.ietf.org/html/rfc6066#section-3
[RFC 8247 Section 2.4]: https://www.rfc-editor.org/rfc/rfc8247#section-2.4
[RFC 9113]: https://datatracker.ietf.org/doc/html/rfc9113#section-5.3.1
[WHATWG URL API]: url.md#the-whatwg-url-api
[`"exports"` or `"main"` entry]: packages.md#main-entry-point-export
[`'uncaughtException'`]: process.md#event-uncaughtexception
[`--force-node-api-uncaught-exceptions-policy`]: cli.md#--force-node-api-uncaught-exceptions-policy
[`--pending-deprecation`]: cli.md#--pending-deprecation
[`--throw-deprecation`]: cli.md#--throw-deprecation
[`--unhandled-rejections`]: cli.md#--unhandled-rejectionsmode
[`Buffer.allocUnsafeSlow(size)`]: buffer.md#static-method-bufferallocunsafeslowsize-alignment
[`Buffer.from(array)`]: buffer.md#static-method-bufferfromarray
[`Buffer.from(buffer)`]: buffer.md#static-method-bufferfrombuffer
[`Buffer.isBuffer()`]: buffer.md#static-method-bufferisbufferobj
[`Cipheriv`]: crypto.md#class-cipheriv
[`CryptoKey`]: webcrypto.md#class-cryptokey
[`Decipheriv`]: crypto.md#class-decipheriv
[`Duplex.toWeb()`]: stream.md#streamduplextowebstreamduplex-options
[`Error.isError`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/isError
[`KeyObject.from()`]: crypto.md#static-method-keyobjectfromkey
[`REPLServer.clearBufferedCommand()`]: repl.md#replserverclearbufferedcommand
[`ReadStream.open()`]: fs.md#class-fsreadstream
[`Server.getConnections()`]: net.md#servergetconnectionscallback
[`Server.listen({fd: <number>})`]: net.md#serverlistenhandle-backlog-callback
[`Sign.prototype.sign()`]: crypto.md#signsignprivatekey-outputencoding
[`String.prototype.toWellFormed`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed
[`Verify.prototype.verify()`]: crypto.md#verifyverifyobject-signature-signatureencoding
[`WriteStream.open()`]: fs.md#class-fswritestream
[`assert`]: assert.md
[`asyncResource.runInAsyncScope()`]: async_context.md#asyncresourceruninasyncscopefn-thisarg-args
[`buffer.subarray`]: buffer.md#bufsubarraystart-end
[`child_process.execFile`]: child_process.md#child_processexecfilefile-args-options-callback
[`child_process.exec`]: child_process.md#child_processexeccommand-options-callback
[`child_process.spawn`]: child_process.md#child_processspawncommand-args-options
[`child_process`]: child_process.md
[`clearInterval()`]: timers.md#clearintervaltimeout
[`clearTimeout()`]: timers.md#cleartimeouttimeout
[`console.error()`]: console.md#consoleerrordata-args
[`console.log()`]: console.md#consolelogdata-args
[`crypto.Certificate()` constructor]: crypto.md#legacy-api
[`crypto.createCipheriv()`]: crypto.md#cryptocreatecipherivalgorithm-key-iv-options
[`crypto.createDecipheriv()`]: crypto.md#cryptocreatedecipherivalgorithm-key-iv-options
[`crypto.createHash()`]: crypto.md#cryptocreatehashalgorithm-options
[`crypto.createHmac()`]: crypto.md#cryptocreatehmacalgorithm-key-options
[`crypto.createPrivateKey()`]: crypto.md#cryptocreateprivatekeykey
[`crypto.createPublicKey()`]: crypto.md#cryptocreatepublickeykey
[`crypto.decapsulate()`]: crypto.md#cryptodecapsulatekey-ciphertext-callback
[`crypto.encapsulate()`]: crypto.md#cryptoencapsulatekey-callback
[`crypto.fips`]: crypto.md#cryptofips
[`crypto.pbkdf2()`]: crypto.md#cryptopbkdf2password-salt-iterations-keylen-digest-callback
[`crypto.privateDecrypt()`]: crypto.md#cryptoprivatedecryptprivatekey-buffer
[`crypto.privateEncrypt()`]: crypto.md#cryptoprivateencryptprivatekey-buffer
[`crypto.publicDecrypt()`]: crypto.md#cryptopublicdecryptkey-buffer
[`crypto.publicEncrypt()`]: crypto.md#cryptopublicencryptkey-buffer
[`crypto.randomBytes()`]: crypto.md#cryptorandombytessize-callback
[`crypto.scrypt()`]: crypto.md#cryptoscryptpassword-salt-keylen-options-callback
[`crypto.setEngine()`]: crypto.md#cryptosetengineengine-flags
[`crypto.sign()`]: crypto.md#cryptosignalgorithm-data-key-callback
[`crypto.verify()`]: crypto.md#cryptoverifyalgorithm-data-key-signature-callback
[`decipher.final()`]: crypto.md#decipherfinaloutputencoding
[`decipher.setAuthTag()`]: crypto.md#deciphersetauthtagbuffer-encoding
[`dirent.parentPath`]: fs.md#direntparentpath
[`dns.lookup()`]: dns.md#dnslookuphostname-options-callback
[`dnsPromises.lookup()`]: dns.md#dnspromiseslookuphostname-options
[`domain`]: domain.md
[`ecdh.setPublicKey()`]: crypto.md#ecdhsetpublickeypublickey-encoding
[`emitter.listenerCount(eventName)`]: events.md#emitterlistenercounteventname-listener
[`events.listenerCount(emitter, eventName)`]: events.md#eventslistenercountemitterortarget-eventname
[`fs.Dir`]: fs.md#class-fsdir
[`fs.FileHandle`]: fs.md#class-filehandle
[`fs.access()`]: fs.md#fsaccesspath-mode-callback
[`fs.appendFile()`]: fs.md#fsappendfilepath-data-options-callback
[`fs.appendFileSync()`]: fs.md#fsappendfilesyncpath-data-options
[`fs.createReadStream()`]: fs.md#fscreatereadstreampath-options
[`fs.createWriteStream()`]: fs.md#fscreatewritestreampath-options
[`fs.exists(path, callback)`]: fs.md#fsexistspath-callback
[`fs.lchmod(path, mode, callback)`]: fs.md#fslchmodpath-mode-callback
[`fs.lchmodSync(path, mode)`]: fs.md#fslchmodsyncpath-mode
[`fs.lchown(path, uid, gid, callback)`]: fs.md#fslchownpath-uid-gid-callback
[`fs.lchownSync(path, uid, gid)`]: fs.md#fslchownsyncpath-uid-gid
[`fs.read()`]: fs.md#fsreadfd-buffer-offset-length-position-callback
[`fs.readSync()`]: fs.md#fsreadsyncfd-buffer-offset-length-position
[`fs.stat()`]: fs.md#fsstatpath-options-callback
[`fs.write()`]: fs.md#fswritefd-buffer-offset-length-position-callback
[`fs.writeFile()`]: fs.md#fswritefilefile-data-options-callback
[`fs.writeFileSync()`]: fs.md#fswritefilesyncfile-data-options
[`http.ClientRequest`]: http.md#class-httpclientrequest
[`http.IncomingMessage`]: http.md#class-httpincomingmessage
[`http.ServerResponse`]: http.md#class-httpserverresponse
[`http.get()`]: http.md#httpgetoptions-callback
[`http.request()`]: http.md#httprequestoptions-callback
[`http2.createSecureServer()`]: http2.md#http2createsecureserveroptions-onrequesthandler
[`http2.createServer()`]: http2.md#http2createserveroptions-onrequesthandler
[`https.get()`]: https.md#httpsgetoptions-callback
[`https.request()`]: https.md#httpsrequestoptions-callback
[`message.connection`]: http.md#messageconnection
[`message.headersDistinct`]: http.md#messageheadersdistinct
[`message.headers`]: http.md#messageheaders
[`message.socket`]: http.md#messagesocket
[`message.trailersDistinct`]: http.md#messagetrailersdistinct
[`message.trailers`]: http.md#messagetrailers
[`module.createRequire()`]: module.md#modulecreaterequirefilename
[`module.register()`]: module.md#moduleregisterspecifier-parenturl-options
[`module.registerHooks()`]: module.md#moduleregisterhooksoptions
[`os.networkInterfaces()`]: os.md#osnetworkinterfaces
[`os.tmpdir()`]: os.md#ostmpdir
[`process.env`]: process.md#processenv
[`process.exit()`]: process.md#processexitcode
[`process.exitCode`]: process.md#processexitcode_1
[`process.getActiveResourcesInfo()`]: process.md#processgetactiveresourcesinfo
[`process.mainModule`]: process.md#processmainmodule
[`punycode`]: punycode.md
[`readable.readableEnded`]: stream.md#readablereadableended
[`request.abort()`]: http.md#requestabort
[`request.connection`]: http.md#requestconnection
[`request.destroy()`]: http.md#requestdestroyerror
[`request.socket`]: http.md#requestsocket
[`require.extensions`]: modules.md#requireextensions
[`require.main`]: modules.md#accessing-the-main-module
[`response.connection`]: http.md#responseconnection
[`response.end()`]: http.md#responseenddata-encoding-callback
[`response.finished`]: http.md#responsefinished
[`response.socket`]: http.md#responsesocket
[`response.writableEnded`]: http.md#responsewritableended
[`response.writableFinished`]: http.md#responsewritablefinished
[`script.createCachedData()`]: vm.md#scriptcreatecacheddata
[`setInterval()`]: timers.md#setintervalcallback-delay-args
[`setTimeout()`]: timers.md#settimeoutcallback-delay-args
[`socket.bufferSize`]: net.md#socketbuffersize
[`timeout.ref()`]: timers.md#timeoutref
[`timeout.refresh()`]: timers.md#timeoutrefresh
[`timeout.unref()`]: timers.md#timeoutunref
[`tls.SecureContext`]: tls.md#tlscreatesecurecontextoptions
[`tls.TLSSocket`]: tls.md#class-tlstlssocket
[`tls.checkServerIdentity()`]: tls.md#tlscheckserveridentityhostname-cert
[`tls.createSecureContext()`]: tls.md#tlscreatesecurecontextoptions
[`tls.createServer()`]: tls.md#tlscreateserveroptions-secureconnectionlistener
[`url.format()`]: url.md#urlformaturlobject
[`url.format(urlString)`]: url.md#urlformaturlstring
[`url.parse()`]: url.md#urlparseurlstring-parsequerystring-slashesdenotehost
[`url.resolve()`]: url.md#urlresolvefrom-to
[`util._extend()`]: util.md#util_extendtarget-source
[`util.getSystemErrorName()`]: util.md#utilgetsystemerrornameerr
[`util.inspect()`]: util.md#utilinspectobject-options
[`util.inspect.custom`]: util.md#utilinspectcustom
[`util.isArray()`]: util.md#utilisarrayobject
[`util.promisify`]: util.md#utilpromisifyoriginal
[`util.toUSVString()`]: util.md#utiltousvstringstring
[`util.types.isNativeError`]: util.md#utiltypesisnativeerrorvalue
[`util.types`]: util.md#utiltypes
[`util`]: util.md
[`worker.exitedAfterDisconnect`]: cluster.md#workerexitedafterdisconnect
[`worker.terminate()`]: worker_threads.md#workerterminate
[`writable.writableLength`]: stream.md#writablewritablelength
[`zlib.bytesWritten`]: zlib.md#zlibbyteswritten
[alloc]: buffer.md#static-method-bufferallocsize-fill-encoding
[alloc_unsafe_size]: buffer.md#static-method-bufferallocunsafesize-alignment
[caveats of asynchronous customization hooks]: module.md#caveats-of-asynchronous-customization-hooks
[from_arraybuffer]: buffer.md#static-method-bufferfromarraybuffer-byteoffset-length
[from_string_encoding]: buffer.md#static-method-bufferfromstring-encoding
[legacy URL API]: url.md#legacy-url-api
[legacy `urlObject`]: url.md#legacy-urlobject
[permission model]: permissions.md#permission-model
[static methods of `crypto.Certificate()`]: crypto.md#class-certificate
[subpath exports]: packages.md#subpath-exports
[subpath imports]: packages.md#subpath-imports
[subpath patterns]: packages.md#subpath-patterns
