---
title: "WebAssembly System Interface (WASI)"
description: "node:wasi module (experimental) — WebAssembly applications များကို POSIX-like functions များကတစ်ဆင့် operating system ဆီ ဝင်ရောက်ခွင့်ပေးသော WASI API"
order: 120
source: "https://nodejs.org/api/wasi.html"
status: translated
updated: 2026-09-04
---
> Stability: 1 - Experimental
> `node:wasi` module က လောလောဆယ် WASI runtimes အချို့က ပေးအပ်တဲ့ ပြည့်စုံတဲ့ file system security properties တွေကို မပံ့ပိုးပေးသေးပါဘူး။ Secure file system sandboxing အတွက် အပြည့်အဝ support ကို အနာဂတ်မှာ အကောင်အထည် ဖော်ဖို့ ဖြစ်နိုင်ခြေ ရှိ/မရှိ မသိရသေးပါဘူး။ ဒီကြားထဲမှာတော့ — မယုံကြည်ရတဲ့ (untrusted) code တွေကို run ဖို့ ဒါကို အားကိုးမနေပါနဲ့။

WASI API က [WebAssembly System Interface][] specification ရဲ့ implementation တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ WASI က WebAssembly applications တွေကို — POSIX နဲ့ ဆင်တူတဲ့ functions အစုတစ်ခုကနေတစ်ဆင့် — အောက်ခြေ operating system ဆီ ဝင်ရောက်ခွင့် ပေးပါတယ်။

```mjs
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```



```cjs
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi');
const { argv, env } = require('node:process');
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```

အပေါ်က ဥပမာကို run ဖို့ — `demo.wat` လို့ နာမည်ပေးထားတဲ့ WebAssembly text format file အသစ် တစ်ခုကို ဖန်တီးပါ:

```text
(module
    ;; Import the required fd_write WASI function which will write the given io vectors to stdout
    ;; The function signature for fd_write is:
    ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Returns number of bytes written
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; Write 'hello world\n' to memory at an offset of 8 bytes
    ;; Note the trailing newline which is required for the text to appear
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; Creating a new io vector within linear memory
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - This is a pointer to the start of the 'hello world\n' string
        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - The length of the 'hello world\n' string

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 for stdout
            (i32.const 0) ;; *iovs - The pointer to the iov array, which is stored at memory location 0
            (i32.const 1) ;; iovs_len - We're printing 1 string stored in an iov - so one.
            (i32.const 20) ;; nwritten - A place in memory to store the number of bytes written
        )
        drop ;; Discard the number of bytes written from the top of the stack
    )
)
```

.`.wat` ကနေ `.wasm` ကို compile လုပ်ဖို့ [wabt](https://github.com/WebAssembly/wabt) ကို သုံးပါ။

```bash
wat2wasm demo.wat
```

## လုံခြုံရေး (Security)

WASI က capabilities-based model တစ်ခုကို ပံ့ပိုးပေးပါတယ် — အဲဒီ model ကနေတစ်ဆင့် applications တွေကို ကိုယ်ပိုင် စိတ်ကြိုက် `env`, `preopens`, `stdin`, `stdout`, `stderr`, နဲ့ `exit` capabilities တွေ ပေးအပ်ပါတယ်။

**လက်ရှိ Node.js threat model က WASI runtimes အချို့မှာ ရှိသလိုမျိုး secure sandboxing (လုံခြုံသော sandboxing) ကို မပံ့ပိုးပါဘူး။**

Capability features တွေကို support လုပ်ထားပေမယ့် — အဲဒါတွေက Node.js မှာ security model တစ်ခုကို မဖွဲ့စည်းပါဘူး။ ဥပမာ — file system sandboxing ကို နည်းလမ်း အမျိုးမျိုးနဲ့ ကျော်လွန် ထွက်ပြေးလို့ ရနိုင်ပါတယ်။ ဒီ security guarantees တွေကို အနာဂတ်မှာ ထည့်သွင်းပေးနိုင်မလားဆိုတာကို Project က စူးစမ်း လေ့လာနေပါတယ်။

## Class: `WASI`

`WASI` class က WASI system call API နဲ့ — WASI-based applications တွေနဲ့ အလုပ်လုပ်ဖို့ အဆင်ပြေစေတဲ့ ထပ်ဆောင်း convenience methods တွေကို ပံ့ပိုးပေးပါတယ်။ `WASI` instance တစ်ခုချင်းစီက သီးခြား environment တစ်ခုကို ကိုယ်စားပြုပါတယ်။

### `new WASI([options])`

* `options` {Object}
  * `args` {Array} WebAssembly application က command-line arguments တွေအဖြစ် မြင်ရမယ့် strings တွေရဲ့ array တစ်ခုပါ။ ပထမ argument က WASI command ကိုယ်တိုင်ရဲ့ virtual path ပါ။ **Default:** `[]`။
  * `env` {Object} WebAssembly application က ကိုယ့်ရဲ့ environment အဖြစ် မြင်ရမယ့် — `process.env` နဲ့ ဆင်တူတဲ့ object တစ်ခုပါ။ **Default:** `{}`။
  * `preopens` {Object} ဒီ object က WebAssembly application ရဲ့ local directory structure ကို ကိုယ်စားပြုပါတယ်။ `preopens` ထဲက string keys တွေကို file system အတွင်းက directories တွေအဖြစ် သဘောထားပြီး — `preopens` ထဲက သက်ဆိုင်ရာ values တွေကတော့ host machine ပေါ်က အဲဒီ directories တွေရဲ့ အမှန်တကယ် (real) paths တွေပါ။
  * `returnOnExit` {boolean} Default အနေနဲ့ WASI applications တွေက `__wasi_proc_exit()` ကို ခေါ်တဲ့အခါ — `wasi.start()` က process ကို terminate လုပ်ပစ်မယ့်အစား သတ်မှတ်ထားတဲ့ exit code နဲ့အတူ ပြန်လာပါတယ်။ ဒီ option ကို `false` လို့ သတ်မှတ်ထားရင်တော့ Node.js process ကိုယ်တိုင် သတ်မှတ်ထားတဲ့ exit code နဲ့ ထွက်သွားစေပါလိမ့်မယ်။ **Default:** `true`။
  * `stdin` {integer} WebAssembly application ထဲမှာ standard input အဖြစ် သုံးတဲ့ file descriptor ပါ။ **Default:** `0`။
  * `stdout` {integer} WebAssembly application ထဲမှာ standard output အဖြစ် သုံးတဲ့ file descriptor ပါ။ **Default:** `1`။
  * `stderr` {integer} WebAssembly application ထဲမှာ standard error အဖြစ် သုံးတဲ့ file descriptor ပါ။ **Default:** `2`။
  * `version` {string} တောင်းဆိုထားတဲ့ WASI ရဲ့ version ပါ။ လောလောဆယ် support လုပ်တဲ့ versions တွေက `unstable` နဲ့ `preview1` ပဲ ရှိပါတယ်။ ဒီ option က မဖြစ်မနေ ပေးရပါတယ်။

### `wasi.getImportObject()`

WASI က ပေးတာတွေအပြင် တခြား WASM imports တွေ မလိုအပ်ဘူးဆိုရင် — `WebAssembly.instantiate()` ဆီ ထည့်ပေးလို့ရတဲ့ import object တစ်ခုကို ပြန်ပေးပါတယ်။

Constructor ထဲကို version `unstable` ကို ထည့်ပေးခဲ့ရင် အောက်ပါအတိုင်း ပြန်ပေးပါလိမ့်မယ်:

```json
{ wasi_unstable: wasi.wasiImport }
```

Constructor ထဲကို version `preview1` ကို ထည့်ပေးခဲ့ရင် အောက်ပါအတိုင်း ပြန်ပေးပါလိမ့်မယ်:

```json
{ wasi_snapshot_preview1: wasi.wasiImport }
```

### `wasi.start(instance)`

* `instance` {WebAssembly.Instance}

`instance` ရဲ့ `_start()` export ကို ခေါ်ယူပြီး — `instance` ကို WASI command တစ်ခုအနေနဲ့ စတင် execute လုပ်ဖို့ ကြိုးစားပါတယ်။ `instance` ထဲမှာ `_start()` export မပါဘူးဆိုရင်၊ (သို့) `instance` ထဲမှာ `_initialize()` export ပါနေရင် — exception တစ်ခု throw လုပ်ပါတယ်။

`start()` က `instance` က [`WebAssembly.Memory`][] တစ်ခုကို `memory` ဆိုတဲ့ နာမည်နဲ့ export လုပ်ထားဖို့ လိုအပ်ပါတယ်။ `instance` မှာ `memory` export မရှိဘူးဆိုရင် exception တစ်ခု throw လုပ်ပါတယ်။

`start()` ကို တစ်ကြိမ်ထက် ပိုပြီး ခေါ်ရင် exception တစ်ခု throw လုပ်ပါတယ်။

### `wasi.initialize(instance)`

* `instance` {WebAssembly.Instance}

`instance` ထဲမှာ `_initialize()` export ရှိနေရင် အဲဒါကို ခေါ်ယူပြီး — `instance` ကို WASI reactor တစ်ခုအနေနဲ့ initialize လုပ်ဖို့ ကြိုးစားပါတယ်။ `instance` ထဲမှာ `_start()` export ပါနေရင် exception တစ်ခု throw လုပ်ပါတယ်။

`initialize()` က `instance` က [`WebAssembly.Memory`][] တစ်ခုကို `memory` ဆိုတဲ့ နာမည်နဲ့ export လုပ်ထားဖို့ လိုအပ်ပါတယ်။ `instance` မှာ `memory` export မရှိဘူးဆိုရင် exception တစ်ခု throw လုပ်ပါတယ်။

`initialize()` ကို တစ်ကြိမ်ထက် ပိုပြီး ခေါ်ရင် exception တစ်ခု throw လုပ်ပါတယ်။

### `wasi.finalizeBindings(instance[, options])`

* `instance` {WebAssembly.Instance}
* `options` {Object}
  * `memory` {WebAssembly.Memory} **Default:** `instance.exports.memory`။

`initialize()` (သို့) `start()` ကို မခေါ်ဘဲ — `instance` အတွက် WASI host bindings တွေကို စနစ်တကျ ပြင်ဆင်ပေးပါတယ်။ ဒီ method က WASI module ကို child threads တွေထဲမှာ instantiate လုပ်ပြီး memory ကို threads အချင်းချင်း မျှဝေသုံးချင်တဲ့အခါ အသုံးဝင်ပါတယ်။

`finalizeBindings()` က `instance` က [`WebAssembly.Memory`][] တစ်ခုကို `memory` ဆိုတဲ့ နာမည်နဲ့ export လုပ်ထားဖို့ ဒါမှမဟုတ် user က [`WebAssembly.Memory`][] object တစ်ခုကို `options.memory` ထဲမှာ သတ်မှတ်ပေးဖို့ လိုအပ်ပါတယ်။ `memory` က invalid ဖြစ်နေရင် exception တစ်ခု throw လုပ်ပါတယ်။

`start()` နဲ့ `initialize()` တို့က `finalizeBindings()` ကို အတွင်းပိုင်းကနေ ခေါ်ပါလိမ့်မယ်။ `finalizeBindings()` ကို တစ်ကြိမ်ထက် ပိုပြီး ခေါ်ရင် exception တစ်ခု throw လုပ်ပါတယ်။

### `wasi.wasiImport`

* Type: {Object}

`wasiImport` က WASI system call API ကို အကောင်အထည် ဖော်ထားတဲ့ object တစ်ခုပါ။ [`WebAssembly.Instance`][] တစ်ခုကို instantiate လုပ်နေစဉ်မှာ ဒီ object ကို `wasi_snapshot_preview1` import အဖြစ် ထည့်ပေးသင့်ပါတယ်။

[WebAssembly System Interface]: https://wasi.dev/
[`WebAssembly.Instance`]: https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Instance
[`WebAssembly.Memory`]: https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Memory
