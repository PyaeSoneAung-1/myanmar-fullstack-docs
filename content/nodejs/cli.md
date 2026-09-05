---
title: "Command-line options"
description: "Node.js command-line options — node ကို run လုပ်တဲ့အခါ သုံးနိုင်တဲ့ CLI options/flags အားလုံး — synopsis, program entry point, options (--require, --watch, --env-file စသည်), environment variables, useful V8 options စသည်"
order: 145
source: "https://nodejs.org/api/cli.html"
status: translated
updated: 2026-09-05
---

Node.js မှာ CLI options အမျိုးမျိုး ပါဝင်ပါတယ်။ ဒီ options တွေက built-in debugging (ပါဝင်ပြီးသား အမှားရှာပြင်ခြင်း) လုပ်ဆောင်ချက်၊ scripts တွေကို execute လုပ်ဖို့ နည်းလမ်းမျိုးစုံ နဲ့ အခြား အသုံးဝင်တဲ့ runtime options တွေကို ထုတ်ဖော်ပေးပါတယ်။

ဒီ documentation ကို terminal တစ်ခုမှာ manual page (လက်စွဲ စာမျက်နှာ) အနေနဲ့ ကြည့်ရှုချင်ရင် — `man node` ကို run လုပ်ပါ။

## အနှစ်ချုပ် (Synopsis)

`node [options] [V8 options] [<program-entry-point> | -e "script" | -] [--] [arguments]`

`node inspect [<program-entry-point> | -e "script" | <host>:<port>] …`

`node --v8-options`

Arguments မပါပဲ execute လုပ်လိုက်ရင် [REPL][] ကို စတင်ပါလိမ့်မယ်။

`node inspect` အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [debugger][] documentation ကို ကြည့်ပါ။

## Program ၏ entry point (Program entry point)

Program entry point ဆိုတာ specifier (သတ်မှတ်ညွှန်းချက်) သဖွယ် string တစ်ခုပါ။ ဒီ string က absolute path (အကြွင်းမဲ့ လမ်းကြောင်း) မဟုတ်ဘူးဆိုရင် — လက်ရှိ working directory ကနေ relative path (ဆွေမျိုး လမ်းကြောင်း) အနေနဲ့ သတ်မှတ် (resolve) ပါတယ်။ အဲဒီနောက် ဒီ entry point string ကို — လက်ရှိ working directory ကနေ `require()` နဲ့ တောင်းဆိုထားသလိုမျိုး — resolve လုပ်ပါတယ်။ သက်ဆိုင်တဲ့ file ကို ရှာမတွေ့ဘူးဆိုရင် error တစ်ခု throw လုပ်ပါတယ်။

Default အနေနဲ့ — resolve လုပ်ထားတဲ့ path ကိုလည်း `require()` နဲ့ တောင်းဆိုထားသလိုမျိုး load လုပ်ပါတယ်။ ဒါပေမယ့် အောက်က အခြေအနေတွေထဲက တစ်ခုခု ကိုက်ညီနေရင်တော့ — `import()` နဲ့ တောင်းဆိုထားသလိုမျိုး load လုပ်ပါတယ်:

* Program ကို — entry point ကို ECMAScript module loader နဲ့ load လုပ်ဖို့ တွန်းအားပေးတဲ့ command-line flag (ဥပမာ — `--import`) တစ်ခုနဲ့ စတင်ထားတာ ဖြစ်ခြင်း။
* File မှာ `.mjs`, `.mts` သို့မဟုတ် `.wasm` extension ရှိနေခြင်း။
* File မှာ `.cjs` extension မရှိပဲ — အနီးဆုံး parent `package.json` file ထဲမှာ top-level [`"type"`][] field ရဲ့ တန်ဖိုးက `"module"` ဖြစ်နေခြင်း။

နောက်ထပ် အသေးစိတ်တွေအတွက် [module resolution and loading][] ကို ကြည့်ပါ။

## Options များ (Options)

> Stability: 2 - Stable

V8 options တွေ အပါအဝင် — options အားလုံးမှာ words တွေကို dashes (`-`) သို့မဟုတ် underscores (`_`) နှစ်မျိုးလုံးနဲ့ ပိုင်းခြားလို့ ရပါတယ်။ ဥပမာ — `--pending-deprecation` က `--pending_deprecation` နဲ့ ညီမျှပါတယ်။

တန်ဖိုးတစ်ခုတည်း ယူတဲ့ option တစ်ခု (ဥပမာ `--max-http-header-size`) ကို တစ်ကြိမ်ထက်ပိုပြီး ဖြတ်သန်းပေးခဲ့ရင် — နောက်ဆုံး ဖြတ်သန်းပေးလိုက်တဲ့ တန်ဖိုးကို သုံးပါတယ်။ Command line ကန့် options တွေက [`NODE_OPTIONS`][] environment variable ကနေတစ်ဆင့် ဖြတ်သန်းပေးတဲ့ options တွေထက် ဦးစားပေး အသုံးပြုပါတယ်။

### `-`

`stdin` အတွက် alias တစ်ခုပါ။ တခြား command-line utilities တွေမှာ `-` ကို သုံးသလိုပဲ — script ကို stdin ကနေ ဖတ်ပြီး — ကျန်တဲ့ options တွေကို အဲဒီ script ဆီကို ဖြတ်သန်းပေးတယ်လို့ ဆိုလိုပါတယ်။

### `--`

Node options တွေရဲ့ အဆုံးကို ညွှန်ပြပါတယ်။ ကျန်တဲ့ arguments တွေကို script ဆီကို ဖြတ်သန်းပေးပါတယ်။ ဒီအမှတ်မတိုင်ခင် script filename သို့မဟုတ် eval/print script တစ်ခုခုကို ပေးထားခြင်း မရှိဘူးဆိုရင် — နောက် argument ကို script filename အဖြစ် သုံးပါတယ်။

### `--abort-on-uncaught-exception`

Exit လုပ်မယ့်အစား abort (ရပ်တန့်) လုပ်လိုက်တာက — debugger တစ်ခု (ဥပမာ `lldb`, `gdb`, `mdb`) ကို သုံးပြီး post-mortem analysis (ဖြစ်ပျက်ပြီးနောက် စစ်ဆေးခြင်း) ပြုလုပ်နိုင်ဖို့ — core file တစ်ခုကို ထုတ်ပေးပါတယ်။

ဒီ flag ကို ဖြတ်သန်းပေးထားရင်တောင် — [`process.setUncaughtExceptionCaptureCallback()`][] ကနေတစ်ဆင့် (အဲဒါကို သုံးတဲ့ `node:domain` module ကို အသုံးပြုခြင်းအားဖြင့်လည်း) — abort မလုပ်ပဲ နေဖို့ အပြုအမူကို သတ်မှတ်နိုင်ပါသေးတယ်။

### `--allow-addons`

> Stability: 1.1 - Active development

[Permission Model][] ကို သုံးနေတဲ့အခါ — process က default အနေနဲ့ native addons တွေကို သုံးနိုင်မှာ မဟုတ်ပါဘူး။ အဲဒီလို ကြိုးစားတာတွေက — user က Node.js စတင်တဲ့အခါ `--allow-addons` flag ကို တိုက်ရိုက် (explicitly) ဖြတ်သန်းပေးခြင်း မရှိရင် — `ERR_DLOPEN_DISABLED` error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဥပမာ:

```cjs
// Attempt to require an native addon
require('nodejs-addon-example');
```

```console
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
```

### `--allow-child-process`

> Stability: 1.1 - Active development

[Permission Model][] ကို သုံးနေတဲ့အခါ — process က default အနေနဲ့ child process (ကလေး process) တစ်ခုကိုမှ spawn လုပ်နိုင်မှာ မဟုတ်ပါဘူး။ အဲဒီလို ကြိုးစားတာတွေက — user က Node.js စတင်တဲ့အခါ `--allow-child-process` flag ကို တိုက်ရိုက် ဖြတ်သန်းပေးခြင်း မရှိရင် — `ERR_ACCESS_DENIED` error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဥပမာ:

```js
const childProcess = require('node:child_process');
// Attempt to bypass the permission
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
```

```console
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
```

`child_process.fork()` API က parent process ဆီက execution arguments တွေကို အမွေဆက်ခံပါတယ်။ ဆိုလိုတာက — Node.js ကို Permission Model enable လုပ်ပြီး `--allow-child-process` flag ပါ သတ်မှတ်ပြီး စတင်ထားရင် — `child_process.fork()` ကို သုံးပြီး ဖန်တီးတဲ့ child process တိုင်းက သက်ဆိုင်တဲ့ Permission Model flags တွေ အားလုံးကို အလိုအလျောက် လက်ခံရရှိပါလိမ့်မယ်။

ဒီအပြုအမူက `child_process.spawn()` မှာလည်း သက်ရောက်မှု ရှိပါတယ် — ဒါပေမယ့် အဲဒီကိစ္စမှာတော့ flags တွေကို process arguments တွေကနေ တိုက်ရိုက် ပေးမယ့်အစား — `NODE_OPTIONS` environment variable ကနေတစ်ဆင့် ဖြန့်ဝေပေးပါတယ်။

### `--allow-ffi`

> Stability: 1.1 - Active development

[Permission Model][] ကို သုံးနေတဲ့အခါ — process က default အနေနဲ့ FFI APIs တွေကို သုံးနိုင်မှာ မဟုတ်ပါဘူး။ FFI APIs တွေကို သုံးဖို့ ကြိုးစားတာတွေက — user က Node.js စတင်တဲ့အခါ `--allow-ffi` flag ကို တိုက်ရိုက် ဖြတ်သန်းပေးခြင်း မရှိရင် — `ERR_ACCESS_DENIED` exception တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ [`node:ffi`][] module က `--experimental-ffi` flag ကိုလည်း လိုအပ်ပြီး — FFI support ပါတဲ့ builds တွေမှာသာ ရနိုင်ပါတယ်။

ဥပမာ:

```js
const { DynamicLibrary, suffix } = require('node:ffi');
const lib = new DynamicLibrary(`./mylib.${suffix}`);
```

```console
$ node --permission --experimental-ffi index.js
Error: Access to this API has been restricted. Use --allow-ffi to manage permissions.
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FFI'
}
```

### `--allow-fs-read`

ဒီ flag က [Permission Model][] ကို သုံးပြီး file system read permissions (ဖတ်ရှုခွင့်များ) ကို သတ်မှတ်ပေးပါတယ်။

`--allow-fs-read` flag အတွက် တရားဝင် arguments တွေကတော့:

* `*` - `FileSystemRead` operations အားလုံးကို ခွင့်ပြုရန်။
* Paths အများအပြားကို `--allow-fs-read` flags အများအပြား သုံးပြီး ခွင့်ပြုနိုင်ပါတယ်။ ဥပမာ — `--allow-fs-read=/folder1/ --allow-fs-read=/folder2/`

ဥပမာတွေကို [File System Permissions][] documentation မှာ ကြည့်နိုင်ပါတယ်။

Initializer module နဲ့ custom `--require` modules တွေမှာ implicit (သွယ်ဝိုက်သော) read permission ရှိပါတယ်။

```console
$ node --permission -r custom-require.js -r custom-require-2.js index.js
```

* `custom-require.js`, `custom-require-2.js` နဲ့ `index.js` တို့က default အနေနဲ့ allowed read list ထဲမှာ ပါဝင်ပါလိမ့်မယ်။

```js
process.permission.has('fs.read', 'index.js'); // true
process.permission.has('fs.read', 'custom-require.js'); // true
process.permission.has('fs.read', 'custom-require-2.js'); // true
```

### `--allow-fs-write`

ဒီ flag က [Permission Model][] ကို သုံးပြီး file system write permissions (ရေးသားခွင့်များ) ကို သတ်မှတ်ပေးပါတယ်။

`--allow-fs-write` flag အတွက် တရားဝင် arguments တွေကတော့:

* `*` - `FileSystemWrite` operations အားလုံးကို ခွင့်ပြုရန်။
* Paths အများအပြားကို `--allow-fs-write` flags အများအပြား သုံးပြီး ခွင့်ပြုနိုင်ပါတယ်။ ဥပမာ — `--allow-fs-write=/folder1/ --allow-fs-write=/folder2/`

Comma (`,`) နဲ့ ပိုင်းခြားထားတဲ့ paths တွေကို နောက်ထပ် ခွင့်မပြုတော့ပါဘူး။ Comma ပါတဲ့ flag တစ်ခုတည်းကို ဖြတ်သန်းပေးလိုက်ရင် warning တစ်ခု ပြသပါလိမ့်မယ်။

ဥပမာတွေကို [File System Permissions][] documentation မှာ ကြည့်နိုင်ပါတယ်။

### `--allow-inspector`

> Stability: 1.0 - Early development

[Permission Model][] ကို သုံးနေတဲ့အခါ — process က inspector protocol ကနေတစ်ဆင့် ချိတ်ဆက်နိုင်မှာ မဟုတ်ပါဘူး။ အဲဒီလို ကြိုးစားတာတွေက — user က Node.js စတင်တဲ့အခါ `--allow-inspector` flag ကို တိုက်ရိုက် ဖြတ်သန်းပေးခြင်း မရှိရင် — `ERR_ACCESS_DENIED` error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဥပမာ:

```js
const { Session } = require('node:inspector/promises');

const session = new Session();
session.connect();
```

```console
$ node --permission index.js
Error: connect ERR_ACCESS_DENIED Access to this API has been restricted. Use --allow-inspector to manage permissions.
  code: 'ERR_ACCESS_DENIED',
}
```

### `--allow-net`

> Stability: 1.1 - Active development

[Permission Model][] ကို သုံးနေတဲ့အခါ — process က default အနေနဲ့ network ကို ဝင်ရောက်သုံးစွဲနိုင်မှာ မဟုတ်ပါဘူး။ အဲဒီလို ကြိုးစားတာတွေက — user က Node.js စတင်တဲ့အခါ `--allow-net` flag ကို တိုက်ရိုက် ဖြတ်သန်းပေးခြင်း မရှိရင် — `ERR_ACCESS_DENIED` error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဥပမာ:

```js
const http = require('node:http');
// Attempt to bypass the permission
const req = http.get('http://example.com', () => {});

req.on('error', (err) => {
  console.log('err', err);
});
```

```console
$ node --permission index.js
Error: connect ERR_ACCESS_DENIED Access to this API has been restricted. Use --allow-net to manage permissions.
  code: 'ERR_ACCESS_DENIED',
}
```

### `--allow-openssl-store`

> Stability: 1.1 - Active development

[Permission Model][] ကို သုံးနေတဲ့အခါ — process က default အနေနဲ့ OpenSSL STORE loaders တွေကို သုံးနိုင်မှာ မဟုတ်ပါဘူး — ဥပမာ — [`crypto.createPrivateKey()`][] ဆီကို ဖြတ်သန်းပေးလိုက်တဲ့ {URL} တစ်ခုကနေ private key တစ်ခုကို load လုပ်တာမျိုးပါ။ အဲဒီလို ကြိုးစားတာတွေက — user က `--allow-openssl-store` flag ကို တိုက်ရိုက် ဖြတ်သန်းပေးခြင်း မရှိရင် — `ERR_ACCESS_DENIED` error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။ ဒီ permission ကို runtime မှာ [`permission.drop()`][] ကနေတစ်ဆင့် စွန့်လွှတ်နိုင်ပါတယ်။

ဒီ flag က configure လုပ်ထားတဲ့ OpenSSL STORE loaders တွေကို ကျယ်ပြန့်တဲ့ အခွင့်အာဏာ (broad authority) တစ်ရပ် ပေးအပ်ပါတယ်။ Loader တစ်ခုက files, devices, tokens သို့မဟုတ် network ကို ဝင်ရောက်သုံးစွဲနိုင်ပါတယ်။ Loader တစ်ခုက လုပ်ဆောင်တဲ့ access တွေက `fs.read`, `fs.write` သို့မဟုတ် `net` permission scopes တွေရဲ့ ကန့်သတ်မှုကို မခံရပါဘူး။

### `--allow-wasi`

> Stability: 1.1 - Active development

[Permission Model][] ကို သုံးနေတဲ့အခါ — process က default အနေနဲ့ WASI instances တစ်ခုကိုမှ ဖန်တီးနိုင်စွမ်း ရှိမှာ မဟုတ်ပါဘူး။ လုံခြုံရေး အကြောင်းပြချက်တွေကြောင့် — user က main Node.js process ထဲမှာ `--allow-wasi` flag ကို တိုက်ရိုက် ဖြတ်သန်းပေးခြင်း မရှိရင် — ဒီ call က `ERR_ACCESS_DENIED` error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဥပမာ:

```js
const { WASI } = require('node:wasi');
// Attempt to bypass the permission
new WASI({
  version: 'preview1',
  // Attempt to mount the whole filesystem
  preopens: {
    '/': '/',
  },
});
```

```console
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
```

### `--allow-worker`

> Stability: 1.1 - Active development

[Permission Model][] ကို သုံးနေတဲ့အခါ — process က default အနေနဲ့ worker threads (အလုပ်သမား thread များ) တစ်ခုကိုမှ ဖန်တီးနိုင်မှာ မဟုတ်ပါဘူး။ လုံခြုံရေး အကြောင်းပြချက်တွေကြောင့် — user က main Node.js process ထဲမှာ `--allow-worker` flag ကို တိုက်ရိုက် ဖြတ်သန်းပေးခြင်း မရှိရင် — ဒီ call က `ERR_ACCESS_DENIED` error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

ဥပမာ:

```js
const { Worker } = require('node:worker_threads');
// Attempt to bypass the permission
new Worker(__filename);
```

```console
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
```

### `--build-sea=config`

> Stability: 1.1 - Active development

JSON configuration file တစ်ခုကနေ [single executable application][] တစ်ခုကို ထုတ်လုပ်ပေးပါတယ်။ Argument က configuration file ရဲ့ path တစ်ခု ဖြစ်ရပါမယ်။ Path က absolute မဟုတ်ဘူးဆိုရင် — လက်ရှိ working directory နဲ့ ဆက်စပ်ပြီး resolve လုပ်ပါတယ်။

Configuration fields တွေ၊ cross-platform မှတ်စုတွေ နဲ့ asset APIs တွေအတွက် — [single executable application][] documentation ကို ကြည့်ပါ။

### `--build-snapshot`

Process ထွက်သွားတဲ့အခါ snapshot blob တစ်ခုကို ထုတ်လုပ်ပြီး disk ပေါ်ကို ရေးသားပေးပါတယ် — နောက်ပိုင်းမှာ `--snapshot-blob` နဲ့ ပြန်လည် load လုပ်နိုင်ပါတယ်။

Snapshot ကို build လုပ်တဲ့အခါ — `--snapshot-blob` ကို သတ်မှတ်မထားဘူးဆိုရင် — ထုတ်လုပ်လိုက်တဲ့ blob ကို default အနေနဲ့ လက်ရှိ working directory ထဲက `snapshot.blob` ဆီကို ရေးသားပါတယ်။ မဟုတ်ရင်တော့ `--snapshot-blob` က သတ်မှတ်ထားတဲ့ path ဆီကို ရေးသားပါလိမ့်မယ်။

```console
$ echo "globalThis.foo = 'I am from the snapshot'" > snapshot.js

# Run snapshot.js to initialize the application and snapshot the
# state of it into snapshot.blob.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# Load the generated snapshot and start the application from index.js.
$ node --snapshot-blob snapshot.blob index.js
I am from the snapshot
```

[`v8.startupSnapshot` API][] ကို — snapshot building အချိန်မှာ entry point တစ်ခုကို သတ်မှတ်ဖို့ သုံးနိုင်ပြီး — အဲဒီလိုဆိုရင် deserialization အချိန်မှာ နောက်ထပ် entry script တစ်ခု လိုအပ်တာကို ရှောင်ရှားနိုင်ပါတယ်:

```console
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('I am from the snapshot'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
I am from the snapshot
```

နောက်ထပ် အချက်အလက်တွေအတွက် [`v8.startupSnapshot` API][] documentation ကို ကြည့်ပါ။

Snapshot က လောလောဆယ် snapshot building process အတွင်းမှာ entrypoint တစ်ခုတည်းကိုသာ load လုပ်ဖို့ ပံ့ပိုးပေးပါတယ် — built-in modules တွေကို load လုပ်နိုင်ပေမယ့် — နောက်ထပ် user-land modules တွေကိုတော့ load လုပ်လို့ မရပါဘူး။ Users တွေက snapshot ကို build မလုပ်ခင် — မိမိနှစ်သက်ရာ bundler တစ်ခုနဲ့ မိမိတို့ရဲ့ application ကို script တစ်ခုတည်းအဖြစ် bundle လုပ်ထားနိုင်ပါတယ်။

Built-in modules တွေ အားလုံးရဲ့ serializability (စီစဉ်သိမ်းဆည်းနိုင်မှု) ကို အာမခံဖို့က ရှုပ်ထွေးပြီး — အဲဒီ modules တွေကလည်း အချိန်နဲ့အမျှ တိုးပွားလာနေတာမို့ — built-in modules တွေရဲ့ အစိတ်အပိုင်း တစ်ချို့သာလျှင် snapshot building process အတွင်းမှာ serializable ဖြစ်ဖို့ ကောင်းစွာ စမ်းသပ်ထားပါတယ်။ Node.js core test suite က ရှုပ်ထွေးမှု အတန်အသင့်ရှိတဲ့ applications အနည်းငယ်ကို snapshot လုပ်နိုင်တယ်ဆိုတာ စစ်ဆေးပါတယ်။ [captured by the built-in snapshot of Node.js][] ဆိုတဲ့ built-in modules စာရင်းကို supported (ပံ့ပိုးထားသည်) အဖြစ် မှတ်ယူပါတယ်။ Snapshot builder က serialize လုပ်လို့ မရတဲ့ built-in module တစ်ခုကို တွေ့ကြုံလိုက်ရရင် — snapshot building process ကို crash ဖြစ်စေနိုင်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ ပုံမှန် ဖြေရှင်းနည်းကတော့ — [`v8.startupSnapshot.setDeserializeMainFunction()`][] သို့မဟုတ် [`v8.startupSnapshot.addDeserializeCallback()`][] ကို သုံးပြီး — အဲဒီ module ကို runtime အထိ load လုပ်တာ ရွှေ့ဆိုင်းထားဖို့ပါ။ Snapshot building process အတွင်းမှာ နောက်ထပ် module တစ်ခုရဲ့ serialization လိုအပ်ရင် — [Node.js issue tracker][] မှာ request တစ်ခု တင်သွင်းပြီး — [tracking issue for user-land snapshots][] ထဲမှာ ချိတ်ဆက်ပေးပါ။

### `--build-snapshot-config`

Snapshot ဖန်တီးမှု အပြုအမူကို သတ်မှတ်ပေးတဲ့ JSON configuration file တစ်ခုရဲ့ path ကို သတ်မှတ်ပေးပါတယ်။

လောလောဆယ် ပံ့ပိုးထားတဲ့ options တွေကတော့:

* `builder` {string} Required ဖြစ်ပါတယ်။ Snapshot ကို build မလုပ်ခင် execute လုပ်ရမယ့် script ရဲ့ နာမည်ကို ပေးအပ်ပါတယ် — [`--build-snapshot`][] ကို main script name အဖြစ် `builder` နဲ့ ဖြတ်သန်းပေးထားသလိုမျိုး ဖြစ်ပါတယ်။
* `withoutCodeCache` {boolean} Optional ဖြစ်ပါတယ်။ Code cache ထည့်သွင်းထားတာက — snapshot အရွယ်အစား ပိုကြီးလာပြီး snapshot ရဲ့ portability (အခြားစနစ်များဆီ ရွှေ့ပြောင်းသုံးစွဲနိုင်မှု) ကို ထိခိုက်စေနိုင်တဲ့ အားနည်းချက်နဲ့အတူ — snapshot ထဲမှာ ပါဝင်တဲ့ functions တွေကို compile လုပ်ရာမှာ ကုန်ဆုံးတဲ့ အချိန်ကို လျှော့ချပေးပါတယ်။

ဒီ flag ကို သုံးတဲ့အခါ — command line ပေါ်မှာ ပေးထားတဲ့ နောက်ထပ် script files တွေကို execute လုပ်မှာ မဟုတ်ပဲ — သာမန် command line arguments တွေအနေနဲ့သာ အနက်ဖွင့်ပါလိမ့်မယ်။

### `-c`, `--check`

Script ကို execute မလုပ်ပဲ syntax check (သဒ္ဒါ စစ်ဆေးခြင်း) လုပ်ပါတယ်။

### `--completion-bash`

Node.js အတွက် source လုပ်နိုင်တဲ့ (source-able) bash completion script တစ်ခုကို print ထုတ်ပေးပါတယ်။

```bash
node --completion-bash > node_bash_completion
source node_bash_completion
```

### `-C condition`, `--conditions=condition`

Custom [conditional exports][] resolution conditions တွေကို ပေးအပ်ပါတယ်။

Custom string condition names တွေကို ဘယ်နှစ်ခုမဆို ခွင့်ပြုပါတယ်။

`"node"`, `"default"`, `"import"` နဲ့ `"require"` ဆိုတဲ့ Node.js ရဲ့ default conditions တွေက သတ်မှတ်ထားတဲ့အတိုင်း အမြဲတမ်း အကျုံးဝင်ပါလိမ့်မယ်။

ဥပမာ — "development" resolutions တွေနဲ့ module တစ်ခုကို run လုပ်ဖို့:

```bash
node -C development app.js
```

### `--cpu-prof`

စတင်ချိန်မှာ V8 CPU profiler ကို စတင်ပြီး — exit မလုပ်ခင် CPU profile ကို disk ပေါ်ကို ရေးသားပါတယ်။

`--cpu-prof-dir` ကို သတ်မှတ်မထားဘူးဆိုရင် — ထုတ်လုပ်လိုက်တဲ့ profile ကို လက်ရှိ working directory ထဲမှာ ထားရှိပါတယ်။

`--cpu-prof-name` ကို သတ်မှတ်မထားဘူးဆိုရင် — ထုတ်လုပ်လိုက်တဲ့ profile ကို `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile` လို့ နာမည်ပေးပါတယ်။

```console
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
```

`--cpu-prof-name` ကို သတ်မှတ်ထားရင် — ပေးလိုက်တဲ့ တန်ဖိုးကို file name အတွက် template အဖြစ် သုံးပါတယ်။ အောက်ပါ placeholder ကို ပံ့ပိုးထားပြီး runtime မှာ အစားထိုးပါလိမ့်မယ်:

* `${pid}` — လက်ရှိ process ရဲ့ ID ဖြစ်ပါတယ်။

```console
$ node --cpu-prof --cpu-prof-name 'CPU.${pid}.cpuprofile' index.js
$ ls *.cpuprofile
CPU.15293.cpuprofile
```

### `--cpu-prof-dir`

`--cpu-prof` က ထုတ်လုပ်တဲ့ CPU profiles တွေကို ထားရှိမယ့် directory ကို သတ်မှတ်ပေးပါတယ်။

Default တန်ဖိုးကို [`--diagnostic-dir`][] command-line option က ထိန်းချုပ်ပါတယ်။

### `--cpu-prof-interval`

`--cpu-prof` က ထုတ်လုပ်တဲ့ CPU profiles တွေအတွက် sampling interval (နမူနာ ကြားကာလ) ကို microseconds နဲ့ သတ်မှတ်ပေးပါတယ်။ Default ကတော့ 1000 microseconds ဖြစ်ပါတယ်။

### `--cpu-prof-name`

`--cpu-prof` က ထုတ်လုပ်တဲ့ CPU profile ရဲ့ file name ကို သတ်မှတ်ပေးပါတယ်။

### `--diagnostic-dir=directory`

Diagnostic output files တွေ အားလုံးကို ရေးသားမယ့် directory ကို သတ်မှတ်ပေးပါတယ်။ Default ကတော့ လက်ရှိ working directory ဖြစ်ပါတယ်။

အောက်ပါတို့ရဲ့ default output directory ကို သက်ရောက်မှု ရှိပါတယ်:

* [`--cpu-prof-dir`][]
* [`--heap-prof-dir`][]
* [`--redirect-warnings`][]

### `--disable-proto=mode`

`Object.prototype.__proto__` property ကို disable လုပ်ပါတယ်။ `mode` က `delete` ဆိုရင် — property ကို လုံးဝ ဖယ်ရှားလိုက်ပါတယ်။ `mode` က `throw` ဆိုရင် — property ကို ဝင်ရောက်ကြည့်ရှုတာတွေက `ERR_PROTO_ACCESS` ဆိုတဲ့ code နဲ့ exception တစ်ခုကို throw လုပ်ပါတယ်။

### `--disable-sigusr1`

Process ဆီကို `SIGUSR1` signal တစ်ခု ပို့ပြီး debugging session တစ်ခု စတင်နိုင်တဲ့ စွမ်းရည်ကို disable လုပ်ပါတယ်။

### `--disable-warning=code-or-type`

> Stability: 2 - Stable

`code` သို့မဟုတ် `type` အလိုက် တိကျတဲ့ process warnings တွေကို disable လုပ်ပါတယ်။

[`process.emitWarning()`][emit_warning] ကနေ emit လုပ်တဲ့ warnings တွေမှာ `code` နဲ့ `type` တစ်ခု ပါဝင်နိုင်ပါတယ်။ ဒီ option က — ကိုက်ညီတဲ့ `code` သို့မဟုတ် `type` ရှိတဲ့ warnings တွေကို emit လုပ်မှာ မဟုတ်ပါဘူး။

[deprecation warnings][] များ၏ စာရင်းကို ကြည့်ပါ။

Node.js ရဲ့ core warning types တွေကတော့ `DeprecationWarning` နဲ့ `ExperimentalWarning` တို့ပါ။

ဥပမာ — အောက်က script ကို `node --disable-warning=DEP0025` နဲ့ run လုပ်တဲ့အခါ — [DEP0025 `require('node:sys')`][DEP0025 warning] ကို emit လုပ်မှာ မဟုတ်ပါဘူး:

```mjs
import sys from 'node:sys';
```

```cjs
const sys = require('node:sys');
```

ဥပမာ — အောက်က script ကို `node --disable-warning=ExperimentalWarning` နဲ့ run လုပ်တဲ့အခါ — [DEP0025 `require('node:sys')`][DEP0025 warning] ကို emit လုပ်မှာ ဖြစ်ပေမယ့် — Experimental Warnings တစ်ခုခုကိုတော့ (<=v21 မှာ ရှိတဲ့ [ExperimentalWarning: `vm.measureMemory` is an experimental feature][] လိုမျိုး) emit လုပ်မှာ မဟုတ်ပါဘူး:

```mjs
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
```

```cjs
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
```

### `--disable-wasm-trap-handler`

Node.js က 64-bit platforms တွေမှာ V8 ရဲ့ trap-handler-based WebAssembly bound checks တွေကို enable လုပ်ပါတယ် — ဒါက inline bound checks တွေ မလိုအပ်တော့အောင် လုပ်လိုက်လို့ WebAssembly ရဲ့ performance ကို သိသိသာသာ တိုးတက်စေပါတယ်။ ဒီ optimization က out-of-bound accesses တွေကို ဖမ်းယူဖို့အတွက် — WebAssembly memory instance တစ်ခုစီမှာ virtual memory cage (virtual memory လှောင်အိမ်) ကြီးတစ်ခုကို ခွဲဝေပေးဖို့ လိုအပ်ပါတယ် (လောလောဆယ် 32-bit WebAssembly memory အတွက် 8GB ၊ 64-bit WebAssembly memory အတွက် 16GB ပုံမှန် ဖြစ်ပါတယ်)။ 64-bit platforms အများစုမှာ virtual memory address space က ပုံမှန် WebAssembly အသုံးပြုမှုတွေကို လိုက်လျောဖို့ လုံလောက်တဲ့ အရွယ်အစား (128TB ဝန်းကျင်) ရှိတတ်ပါတယ် — ဒါပေမယ့် machine မှာ virtual memory အတွက် manual limits တွေ (`ulimit -v` ကနေတစ်ဆင့် လိုမျိုး) ရှိနေရင်တော့ — WebAssembly memory allocation က `WebAssembly.Memory(): could not allocate memory` ဆိုတဲ့ error နဲ့ မအောင်မြင်ဖို့ အလားအလာ ပိုများပါတယ်။

Node.js က စတင်ချိန်မှာ — cage တစ်ခုအနည်းဆုံး ခွဲဝေဖို့ virtual memory အလုံအလောက် ရနိုင်လားဆိုတာ အလိုအလျောက် စစ်ဆေးပြီး — မရနိုင်ဘူးဆိုရင် — WebAssembly က inline bound checks တွေနဲ့ (performance ပိုနည်းပေမယ့်) ဆက်လက် run နိုင်အောင် — trap-handler optimization ကို အလိုအလျောက် disable လုပ်ပါတယ်။ ဒါပေမယ့် application က WebAssembly memory instances အများအပြား ဖန်တီးဖို့ လိုအပ်ပြီး — machine က virtual memory အပေါ် အတော်မြင့်တဲ့ limit တစ်ခုကို ဆက်လက် သတ်မှတ်ထားရင်တော့ — virtual memory အသုံးပြုမှု မြင့်တက်လာတာကြောင့် — WebAssembly memory instances တွေရဲ့ allocation က မျှော်လင့်ထားတာထက် ပိုမြန်မြန် မအောင်မြင်နိုင်ပါသေးတယ်။

`--disable-wasm-trap-handler` က ဒီ optimization ကို အပြည့်အဝ disable လုပ်လိုက်လို့ — WebAssembly memory instances တွေက virtual memory cages ကြီးတွေကို ကြိုတင် ခွဲဝေထားမယ့်အစား — inline bound checks တွေကိုသာ အမြဲတမ်း သုံးပါတော့တယ်။ ဒါက Node.js process အတွက် ရရှိနိုင်တဲ့ virtual memory address space က အကန့်အသတ် ရှိနေတဲ့အခါ — instances တွေ ပိုများများ ဖန်တီးနိုင်စေပါတယ်။

### `--disallow-code-generation-from-strings`

Strings တွေကနေ code ထုတ်လုပ်တဲ့ `eval` နဲ့ `new Function` လိုမျိုး built-in language features တွေကို — exception တစ်ခု throw လုပ်စေပါတယ်။ ဒါက Node.js ရဲ့ `node:vm` module ကိုတော့ သက်ရောက်မှု မရှိပါဘူး။

### `--dns-result-order=order`

[`dns.lookup()`][] နဲ့ [`dnsPromises.lookup()`][] တွေထဲက `order` ရဲ့ default တန်ဖိုးကို သတ်မှတ်ပေးပါတယ်။ တန်ဖိုးတွေကတော့:

* `ipv4first`: default `order` ကို `ipv4first` အဖြစ် သတ်မှတ်ပါတယ်။
* `ipv6first`: default `order` ကို `ipv6first` အဖြစ် သတ်မှတ်ပါတယ်။
* `verbatim`: default `order` ကို `verbatim` အဖြစ် သတ်မှတ်ပါတယ်။

Default ကတော့ `verbatim` ဖြစ်ပြီး — [`dns.setDefaultResultOrder()`][] က `--dns-result-order` ထက် ဦးစားပေး ပိုမြင့်ပါတယ်။

### `--enable-fips`

စတင်ချိန်မှာ [FIPS mode][] ကို enable လုပ်ပါတယ်။ OpenSSL 3 နဲ့ဆိုရင် — `fips` လို့ အမည်ပေးထားတဲ့ configured provider တစ်ခု ရရှိနိုင်ပြီး အောင်မြင်စွာ initialize လုပ်နိုင်ရပါမယ်။ OpenSSL 1.1.1 နဲ့ဆိုရင် — Node.js ကို FIPS-capable OpenSSL တစ်ခုနဲ့ built (တည်ဆောက်) ထားရပါမယ်။

### `--enable-source-maps`

Stack traces တွေအတွက် [Source Map][] support ကို enable လုပ်ပါတယ်။

TypeScript လိုမျိုး transpiler တစ်ခုကို သုံးတဲ့အခါ — application တစ်ခုက throw လုပ်တဲ့ stack traces တွေက မူရင်း source ရဲ့ နေရာကို မရည်ညွှန်းပဲ — transpile လုပ်ထားတဲ့ code ကို ရည်ညွှန်းပါတယ်။ `--enable-source-maps` က Source Maps တွေရဲ့ caching ကို enable လုပ်ပြီး — stack traces တွေကို မူရင်း source file နဲ့ ဆက်စပ်ပြီး အစီရင်ခံဖို့ အကောင်းဆုံး ကြိုးစားပါတယ်။

`Error.prepareStackTrace` ကို override လုပ်ထားရင် — `--enable-source-maps` က stack trace ကို ပြုပြင်တာကို တားဆီးနိုင်ပါတယ်။ Source maps တွေနဲ့ stack trace ကို ပြုပြင်ချင်ရင်တော့ — overriding function ထဲမှာ မူရင်း `Error.prepareStackTrace` ရဲ့ ရလဒ်တွေကို ခေါ်ပြီး ပြန်ပေးပါ။

```js
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // Modify error and trace and format stack trace with
  // original Error.prepareStackTrace.
  return originalPrepareStackTrace(error, trace);
};
```

သတိပြုရန် — source maps တွေကို enable လုပ်ထားတာက `Error.stack` ကို ဝင်ရောက်ကြည့်ရှုတဲ့အခါ — သင့် application ထဲကို latency (ကြန့်ကြာမှု) တစ်ခုကို ယူဆောင်လာနိုင်ပါတယ်။ သင့် application ထဲမှာ `Error.stack` ကို မကြာခဏ ဝင်ရောက်ကြည့်ရှုနေရရင် — `--enable-source-maps` ရဲ့ performance သက်ရောက်မှုတွေကို ထည့်သွင်း စဉ်းစားပါ။

### `--entry-url`

> Stability: 1 - Experimental

ဒီ flag ပါနေရင် — Node.js က entry point ကို path တစ်ခုအနေနဲ့ မဟုတ်ပဲ — URL တစ်ခုအနေနဲ့ အနက်ဖွင့်ပါလိမ့်မယ်။

[ECMAScript module][] ရဲ့ resolution rules တွေကို လိုက်နာပါတယ်။

URL ထဲမှာ ပါတဲ့ query parameter သို့မဟုတ် hash ကို [`import.meta.url`][] ကနေတစ်ဆင့် ဝင်ရောက်ကြည့်ရှုနိုင်ပါလိမ့်မယ်။

```bash
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
```

### `--env-file-if-exists=file`

အပြုအမူက [`--env-file`][] နဲ့ အတူတူပါပဲ — ဒါပေမယ့် file မရှိဘူးဆိုရင် error တစ်ခုကို throw လုပ်မှာ မဟုတ်ပါဘူး။

### `--env-file=file`

လက်ရှိ directory နဲ့ ဆက်စပ်တဲ့ file တစ်ခုကနေ environment variables တွေကို load လုပ်ပြီး — applications တွေအတွက် `process.env` ပေါ်မှာ ရရှိနိုင်အောင် လုပ်ပေးပါတယ်။ `NODE_OPTIONS` လိုမျိုး [environment variables which configure Node.js][environment_variables] တွေကိုလည်း parse လုပ်ပြီး အသုံးချပါတယ်။ Environment ထဲရော file ထဲမှာပါ တူညီတဲ့ variable တစ်ခုကို သတ်မှတ်ထားရင် — environment ထဲက တန်ဖိုးက ဦးစားပေး အသုံးပြုပါတယ်။

`--env-file` arguments တွေကို အများအပြား ဖြတ်သန်းပေးနိုင်ပါတယ်။ နောက်ပိုင်း files တွေက — အရင် files တွေထဲမှာ သတ်မှတ်ထားပြီးသား variables တွေကို override လုပ်ပါတယ်။

File မရှိဘူးဆိုရင် error တစ်ခုကို throw လုပ်ပါတယ်။

```bash
node --env-file=.env --env-file=.development.env index.js
```

File ရဲ့ ပုံစံက — environment variable ရဲ့ name နဲ့ value တစ်စုံချင်းစီအတွက် `=` နဲ့ ပိုင်းခြားထားတဲ့ တစ်ကြောင်းစီ ဖြစ်သင့်ပါတယ်:

```text
PORT=3000
```

`#` နောက်မှာ ပါတဲ့ စာသား အားလုံးကို comment အဖြစ် သတ်မှတ်ပါတယ်:

```text
# This is a comment
PORT=3000 # This is also a comment
```

Values တွေက အောက်ပါ quotes တွေနဲ့ စတင်နိုင်၊ ဆုံးနိုင်ပါတယ်: `` ` ``, `"` သို့မဟုတ် `'`။ ဒီ quotes တွေကို values တွေထဲကနေ ဖယ်ရှားပါတယ်။

```text
USERNAME="nodejs" # will result in `nodejs` as the value.
```

Multi-line (စာကြောင်းပေါင်းများစွာ) values တွေကို ပံ့ပိုးပါတယ်:

```text
MULTI_LINE="THIS IS
A MULTILINE"
# will result in `THIS IS\nA MULTILINE` as the value.
```

Key တစ်ခုရဲ့ ရှေ့မှာ ရှိတဲ့ export keyword ကို လျစ်လျူရှုပါတယ်:

```text
export USERNAME="nodejs" # will result in `nodejs` as the value.
```

မရှိနိုင်တဲ့ file တစ်ခုကနေ environment variables တွေကို load လုပ်ချင်တယ်ဆိုရင် — [`--env-file-if-exists`][] flag ကို အစားထိုး သုံးနိုင်ပါတယ်။

### `-e`, `--eval "script"`

နောက် argument ကို JavaScript အဖြစ် အကဲဖြတ် (evaluate) ပါတယ်။ REPL ထဲမှာ ကြိုတင် သတ်မှတ်ထားတဲ့ (predefined) modules တွေကို `script` ထဲမှာလည်း သုံးနိုင်ပါတယ်။

`script` က `-` နဲ့ စတင်နေရင် — `--eval` ရဲ့ တန်ဖိုးအဖြစ် parse ခံရအောင် — `=` ကို သုံးပြီး ဖြတ်သန်းပေးပါ (ဥပမာ — `node --print --eval=-42`)။

Windows မှာ `cmd.exe` ကို သုံးတဲ့အခါ — quoting အတွက် double `"` ကိုသာ မှတ်မိတာမို့ — single quote က မှန်ကန်စွာ အလုပ်လုပ်မှာ မဟုတ်ပါဘူး။ Powershell သို့မဟုတ် Git bash မှာတော့ `'` ရော `"` ပါ သုံးလို့ ရပါတယ်။

[`--no-strip-types`][] flag ကို မပေးထားရင် — inline types တွေ ပါဝင်တဲ့ code ကို run လုပ်နိုင်ပါတယ်။

### `--experimental-addon-modules`

> Stability: 1.2 - Release candidate

`.node` addons တွေအတွက် experimental import support ကို enable လုပ်ပါတယ်။

### `--experimental-config-file=path`, `--experimental-config-file`

> Stability: 1.2 - Release candidate

ဒီ flag ပါနေရင် — Node.js က သတ်မှတ်ထားတဲ့ path မှာ configuration file တစ်ခုကို ရှာဖွေပါလိမ့်မယ်။ Path ကို သတ်မှတ်မထားဘူးဆိုရင် — Node.js က လက်ရှိ working directory ထဲက `node.config.json` file တစ်ခုကို ရှာဖွေပါလိမ့်မယ်။ Custom path တစ်ခု သတ်မှတ်ဖို့ဆိုရင် — `--experimental-config-file=path` ပုံစံကို သုံးပါ။ Space နဲ့ ပိုင်းခြားထားတဲ့ `--experimental-config-file path` ပုံစံကိုတော့ ပံ့ပိုးမထားပါဘူး။ `--experimental-default-config-file` ဆိုတဲ့ alias က argument မပါတဲ့ `--experimental-config-file` နဲ့ ညီမျှပါတယ်။ Node.js က configuration file ကို ဖတ်ပြီး အဲဒီ settings တွေကို အသုံးချပါလိမ့်မယ်။ Configuration file က အောက်ပါ ဖွဲ့စည်းပုံ ရှိတဲ့ JSON file တစ်ခု ဖြစ်သင့်ပါတယ်။ `$schema` ထဲက `vX.Y.Z` ကို — သင်သုံးနေတဲ့ Node.js ရဲ့ version သို့မဟုတ် — အဲဒီ major release line ရဲ့ နောက်ဆုံး version အတွက် `latest-vX.x` နဲ့ အစားထိုးရပါမယ်။

```json
{
  "$schema": "https://nodejs.org/dist/vX.Y.Z/docs/node-config-schema.json",
  "nodeOptions": {
    "import": [
      "amaro/strip"
    ],
    "watch-path": "src",
    "watch-preserve-output": true
  },
  "test": {
    "test-isolation": "process"
  },
  "watch": {
    "watch-preserve-output": true
  }
}
```

Configuration file က namespace-specific options တွေကို ပံ့ပိုးပေးပါတယ်:

* `nodeOptions` field ထဲမှာ [`NODE_OPTIONS`][] ထဲမှာ ခွင့်ပြုထားတဲ့ CLI flags တွေ ပါဝင်ပါတယ်။
* `test`, `watch` နဲ့ `permission` လိုမျိုး namespace fields တွေက အဲဒီ subsystem နဲ့ သက်ဆိုင်တဲ့ configuration တွေကို ပါဝင်ပါတယ်။

Configuration file က `nodeVersion` နဲ့အတူ — တိကျတဲ့ Node.js major version တစ်ခုကို ပစ်မှတ်ထားနိုင်ပါတယ်:

```json
{
  "nodeVersion": 25,
  "nodeOptions": {
    "watch-path": "src"
  }
}
```

Version အလိုက် သီးသန့် configurations တွေ အများအပြားကို file တစ်ခုတည်းထဲမှာ ထားရှိဖို့ — `configs` array ကို သုံးပါ။ Node.js က — လက်ရှိ Node.js major version နဲ့ ကိုက်ညီတဲ့ `nodeVersion` ရှိတဲ့ ပထမဆုံး entry ကို သုံးပါလိမ့်မယ်:

```json
{
  "$schema": "https://nodejs.org/dist/latest-v26.x/docs/node-config-schema.json",
  "configs": [
    {
      "nodeVersion": 25,
      "config": {
        "$schema": "https://nodejs.org/dist/latest-v25.x/docs/node-config-schema.json",
        "nodeOptions": {
          "watch-path": "src"
        }
      }
    }
  ]
}
```

`configs` ကို သုံးတဲ့အခါ — top level မှာ `$schema` နဲ့ `configs` သာ ပါဝင်နိုင်ပါတယ်။ `configs` item တစ်ခုချင်းစီမှာ integer `nodeVersion` တစ်ခုနဲ့ object `config` တစ်ခု သတ်မှတ်ပေးရပါမယ်။ Top-level config တစ်ခုတည်းအတွက်ကတော့ `nodeVersion` မလိုအပ်ပါဘူး — ဒါပေမယ့် ပါနေရင်တော့ လက်ရှိ Node.js major version နဲ့ ကိုက်ညီရပါမယ်။

Configuration file ထဲမှာ namespace တစ်ခု ပါဝင်နေရင် — Node.js က သက်ဆိုင်တဲ့ flag (ဥပမာ — `--test`, `--watch`, `--permission`) တွေကို အလိုအလျောက် enable လုပ်ပါတယ်။ ဒါက — command line ပေါ်မှာ flag ကို တိုက်ရိုက် ဖြတ်သန်းစရာ မလိုပဲ — subsystem-specific options တွေကို configure လုပ်နိုင်စေပါတယ်။

ဥပမာ:

```json
{
  "test": {
    "test-isolation": "process"
  }
}
```

အောက်ပါနဲ့ ညီမျှပါတယ်:

```bash
node --test --test-isolation=process
```

Namespace options တွေကို ဆက်သုံးနေရင်း automatic flag ကို disable လုပ်ချင်ရင် — namespace အတွင်းမှာ flag ကို `false` အဖြစ် တိုက်ရိုက် သတ်မှတ်နိုင်ပါတယ်:

```json
{
  "test": {
    "test": false,
    "test-isolation": "process"
  }
}
```

No-op flags တွေကို ပံ့ပိုးမထားပါဘူး။ V8 flags အားလုံးကို လောလောဆယ် ပံ့ပိုးထားတာ မဟုတ်ပါဘူး။

Configuration file ကို validate လုပ်ဖို့အတွက် — Node.js version ပေါ် မူတည်ပြီး ကွဲပြားနိုင်တဲ့ [တရားဝင် JSON schema](../node-config-schema.json) ကို သုံးနိုင်ပါတယ်။ Configuration file ထဲက key တစ်ခုချင်းစီက — command-line argument တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးလို့ရတဲ့ flag တစ်ခုနဲ့ သက်ဆိုင်ပါတယ်။ Key ရဲ့ တန်ဖိုးက flag ဆီကို ဖြတ်သန်းပေးမယ့် တန်ဖိုးပါပဲ။

ဥပမာ — အပေါ်က configuration file က အောက်ပါ command-line arguments တွေနဲ့ ညီမျှပါတယ်:

```bash
node --import amaro/strip --watch-path=src --watch-preserve-output --test-isolation=process
```

Configuration ထဲမှာ ဦးစားပေး အစီအစဉ်က အောက်ပါအတိုင်းပါ:

1. NODE\_OPTIONS နဲ့ command-line options
2. Dotenv NODE\_OPTIONS
3. Configuration file

Configuration file ထဲက တန်ဖိုးတွေက — environment variables တွေ၊ command-line options တွေ သို့မဟုတ် `--env-file` flag က parse လုပ်တဲ့ `NODE_OPTIONS` env file ထဲက တန်ဖိုးတွေကို override လုပ်မှာ မဟုတ်ပါဘူး။

Keys တွေကို — namespace တစ်ခုတည်းအတွင်း သို့မဟုတ် namespace အမျိုးမျိုးကြားမှာ — ထပ်ခါထပ်ခါ သုံးလို့ မရပါဘူး။

Configuration file ထဲမှာ — အသိအမှတ်မပြုတဲ့ keys တွေ သို့မဟုတ် namespace တစ်ခုမှာ သုံးလို့မရတဲ့ keys တွေ ပါဝင်နေရင် — configuration parser က error တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

Node.js က user ပေးလိုက်တဲ့ configuration ကို sanitize လုပ်တာ သို့မဟုတ် validation လုပ်တာ လုပ်ပေးမှာ မဟုတ်ပါဘူး — ဒါကြောင့် မယုံကြည်ရထိုက်တဲ့ (untrusted) configuration files တွေကို **ဘယ်တော့မှ** မသုံးပါနဲ့။

### `--experimental-default-config-file`

> Stability: 1.0 - Early development

ဒီ flag က argument မပါတဲ့ `--experimental-config-file` အတွက် alias တစ်ခုပါ။ ပါနေရင် — Node.js က လက်ရှိ working directory ထဲက `node.config.json` file တစ်ခုကို ရှာဖွေပြီး — configuration file အဖြစ် load လုပ်ပါလိမ့်မယ်။

### `--experimental-eventsource`

Global scope ပေါ်မှာ [EventSource Web API][] ကို ထုတ်ဖော်ပြသခြင်းကို enable လုပ်ပါတယ်။

### `--experimental-ffi`

> Stability: 1 - Experimental

Experimental ဖြစ်တဲ့ [`node:ffi`][] module ကို enable လုပ်ပါတယ်။

ဒီ flag က FFI support ပါတဲ့ builds တွေမှာသာ ရနိုင်ပါတယ်။

### `--experimental-import-meta-resolve`

`import.meta.resolve()` ရဲ့ experimental parent URL support ကို enable လုပ်ပါတယ် — ဒါက contextual resolution (အခြေအနေအရ ရည်ညွှန်းဖြေရှင်းခြင်း) အတွက် ဒုတိယမြောက် `parentURL` argument တစ်ခုကို ဖြတ်သန်းပေးနိုင်စေပါတယ်။

အရင်က `import.meta.resolve` feature တစ်ခုလုံးကို ဒီ flag နဲ့ ကန့်သတ် (gate) ထားခဲ့ပါတယ်။

### `--experimental-import-text`

> Stability: 1.0 - Early development

`with { type: 'text' }` နဲ့ modules တွေကို import လုပ်ခြင်းအတွက် experimental support ကို enable လုပ်ပါတယ်။

### `--experimental-inspector-network-resource`

> Stability: 1.1 - Active Development

Inspector network resources တွေအတွက် experimental support ကို enable လုပ်ပါတယ်။

### `--experimental-loader=module`

> ဒီ flag ကို အသုံးမပြုဖို့ တိုက်တွန်းထားပြီး — Node.js ရဲ့ နောင်ထွက်ရှိမယ့် version တစ်ခုမှာ ဖယ်ရှားခံရနိုင်ပါတယ်။
> ကျေးဇူးပြု၍ — [`--import` with `register()`][preloading asynchronous module customization hooks] ကို အစားထိုး အသုံးပြုပါ။

Exported [asynchronous module customization hooks][] တွေ ပါဝင်တဲ့ `module` ကို သတ်မှတ်ပေးပါတယ်။ `module` က [`import` specifier][] တစ်ခုအနေနဲ့ လက်ခံရတဲ့ string မဆို ဖြစ်နိုင်ပါတယ်။

ဒီ feature က [Permission Model][] နဲ့ သုံးမယ်ဆိုရင် — `--allow-worker` လိုအပ်ပါတယ်။

### `--experimental-network-inspection`

> Stability: 1 - Experimental

Chrome DevTools နဲ့ network inspection (ကွန်ရက် စစ်ဆေးခြင်း) အတွက် experimental support ကို enable လုပ်ပါတယ်။

### `--experimental-package-map=<path>`

> Stability: 1 - Experimental

Experimental package map resolution ကို enable လုပ်ပါတယ်။ `path` argument က — package resolution mappings တွေကို သတ်မှတ်ပေးတဲ့ JSON configuration file တစ်ခုရဲ့ တည်နေရာကို သတ်မှတ်ပေးပါတယ်။

```bash
node --experimental-package-map=./package-map.json app.js
```

Enable လုပ်ထားတဲ့အခါ — bare specifier resolution က package map ကို တိုင်ပင်ပြီး resolution လုပ်ပါတယ်။ ဒါက — ဘယ် package တွေက ဘယ် dependencies တွေကို import လုပ်နိုင်တယ်ဆိုတာကို တိုက်ရိုက် ထိန်းချုပ်နိုင်စေပါတယ်။

Configuration file ရဲ့ ပုံစံနဲ့ resolution algorithm အသေးစိတ်အတွက် [Package maps][] ကို ကြည့်ပါ။

### `--experimental-print-required-tla`

ES module graph ထဲမှာ top-level `await` တစ်ခုခု ပါဝင်နေလို့ — အဲဒီ graph ကို `require()` လုပ်လို့ မရဘူးဆိုရင် — ဒီ flag က Node.js ကို အဲဒီ top-level awaits တွေရဲ့ တည်နေရာတွေကို ရှာဖွေပြီး print ထုတ်နိုင်စေပါတယ်။

### `--experimental-quic`

> Stability: 1.1 - Active development

QUIC protocol အတွက် experimental support ကို enable လုပ်ပါတယ်။

### `--experimental-sea-config`

> Stability: 1 - Experimental

[single executable application][] တစ်ခုကို ထုတ်လုပ်ဖို့ — Node.js binary ထဲကို ထည့်သွင်းနိုင်တဲ့ (inject) blob တစ်ခုကို ထုတ်လုပ်ဖို့အတွက် ဒီ flag ကို သုံးပါ။ အသေးစိတ်အတွက် — [ဤ configuration][`--experimental-sea-config`] အကြောင်း documentation ကို ကြည့်ပါ။

### `--experimental-shadow-realm`

[ShadowRealm][] support ကို enable လုပ်ဖို့ ဒီ flag ကို သုံးပါ။

### `--experimental-storage-inspection`

> Stability: 1.1 - Active Development

Storage inspection (သိုလှောင်မှု စစ်ဆေးခြင်း) အတွက် experimental support ကို enable လုပ်ပါတယ်။

### `--experimental-stream-iter`

> Stability: 1 - Experimental

Experimental ဖြစ်တဲ့ [`node:stream/iter`][] module ကို enable လုပ်ပါတယ်။

### `--experimental-test-coverage`

`node:test` module နဲ့ တွဲသုံးတဲ့အခါ — code coverage report (ကုဒ် လွှမ်းခြုံမှု အစီရင်ခံစာ) တစ်ခုကို test runner output ရဲ့ အစိတ်အပိုင်းအဖြစ် ထုတ်လုပ်ပါတယ်။ Tests တွေ run လုပ်ခြင်း မရှိဘူးဆိုရင် — coverage report ကို ထုတ်လုပ်မှာ မဟုတ်ပါဘူး။ နောက်ထပ် အသေးစိတ်တွေအတွက် — [collecting code coverage from tests][] documentation ကို ကြည့်ပါ။

### `--experimental-test-module-mocks`

> Stability: 1.0 - Early development

Test runner ထဲမှာ module mocking (module အတုအယောင် ပြုလုပ်ခြင်း) ကို enable လုပ်ပါတယ်။

ဒီ feature က [Permission Model][] နဲ့ သုံးမယ်ဆိုရင် — `--allow-worker` လိုအပ်ပါတယ်။

### `--experimental-test-tag-filter='<expr>'`

> Stability: 1.0 - Early development

ပေးထားတဲ့ boolean tag-filter expression နဲ့ ကိုက်ညီတဲ့ tests တွေကိုသာ run လုပ်ပါတယ်။ Tests တွေက `test()`, `it()`, `suite()` သို့မဟုတ် `describe()` တွေပေါ်က `tags` option ကနေတစ်ဆင့် tags တွေကို ကြေညာပါတယ်။ Tags တွေက suites တွေကနေ nested tests တွေဆီကို union အားဖြင့် အမွေဆက်ခံပါတယ်။

Expression က boolean operators တွေ (`and`/`&&`, `or`/`||`, `not`/`!`), grouping (အုပ်စုဖွဲ့ခြင်း) အတွက် parentheses တွေနဲ့ identifiers တွေထဲက `*` wildcards တွေကို ပံ့ပိုးပါတယ်။ Standard precedence (ပုံမှန် ရှေ့အစဉ်) အရ — `not` က `and` ထက် ပိုတင်းကျပ်စွာ ချိတ်ဆက်ပြီး — `and` က `or` ထက် ပိုတင်းကျပ်စွာ ချိတ်ဆက်ပါတယ်။ Grammar အပြည့်အစုံနဲ့ အပြုအမူအတွက် [Test tags][] ကို ကြည့်ပါ။

ဒီ flag ကို တစ်ကြိမ်ထက်ပိုပြီး သတ်မှတ်နိုင်ပါတယ်; expressions အများအပြားကို AND နဲ့ ပေါင်းစပ်ထားတာမို့ — test တစ်ခု run ဖို့ဆိုရင် expression တိုင်းကို ကျေနပ်စေရပါမယ်။

Malformed (ပုံစံမကျ) expression တစ်ခုက — tests တွေ မတိုင်ခင် — test runner ကို non-zero status နဲ့ ထွက်သွားစေပါတယ်။

### `--experimental-vfs`

> Stability: 1 - Experimental

Experimental ဖြစ်တဲ့ [`node:vfs`][] module ကို enable လုပ်ပါတယ်။

### `--experimental-vm-modules`

`node:vm` module ထဲမှာ experimental ES Module support ကို enable လုပ်ပါတယ်။

### `--experimental-wasi-unstable-preview1`

Experimental WebAssembly System Interface (WASI) support ကို enable လုပ်ပါတယ်။

### `--experimental-worker-inspection`

> Stability: 1.1 - Active Development

Chrome DevTools နဲ့ worker inspection (worker စစ်ဆေးခြင်း) အတွက် experimental support ကို enable လုပ်ပါတယ်။

### `--force-context-aware`

[context-aware][] မဟုတ်တဲ့ native addons တွေကို load လုပ်ခြင်းကို disable လုပ်ပါတယ်။

### `--force-fips`

စတင်ချိန်မှာ [FIPS mode][] ကို enable လုပ်ပြီး — script code ကနေ disable လုပ်ခံရခြင်းကို တားဆီးပါတယ်။ [`--enable-fips`][] နဲ့ တူညီတဲ့ OpenSSL လိုအပ်ချက်တွေ အကျုံးဝင်ပါတယ်။

### `--force-node-api-uncaught-exceptions-policy`

Node-API asynchronous callbacks တွေပေါ်မှာ `uncaughtException` event ကို တင်းကျပ်စွာ လိုက်နာစေပါတယ်။

ရှိပြီးသား add-on တစ်ခုက process ကို crash မဖြစ်စေဖို့ — ဒီ flag ကို default အနေနဲ့ enable မထားပါဘူး။ နောင်မှာ — မှန်ကန်တဲ့ အပြုအမူကို တင်းကျပ်စွာ လိုက်နာစေဖို့ — ဒီ flag ကို default အနေနဲ့ enable လုပ်သွားပါလိမ့်မယ်။

### `--frozen-intrinsics`

> Stability: 1 - Experimental

`Array` နဲ့ `Object` လိုမျိုး experimental frozen intrinsics (အေးခဲထားသော ပင်ကိုယ် လုပ်ဆောင်ချက်များ) တွေကို enable လုပ်ပါတယ်။

Root context ကိုသာ ပံ့ပိုးပါတယ်။ `globalThis.Array` က တကယ်တမ်း default intrinsic reference ဖြစ်တယ်ဆိုတဲ့ အာမခံချက် မရှိပါဘူး။ ဒီ flag အောက်မှာ code တွေ ပျက်စီး (break) သွားနိုင်ပါတယ်။

Polyfills တွေ ထည့်သွင်းနိုင်ဖို့ — intrinsics တွေကို freeze မလုပ်ခင် — [`--require`][] ရော [`--import`][] ပါ နှစ်ခုလုံး run လုပ်ပါတယ်။

### `--heap-prof`

စတင်ချိန်မှာ V8 heap profiler ကို စတင်ပြီး — exit မလုပ်ခင် heap profile ကို disk ပေါ်ကို ရေးသားပါတယ်။

`--heap-prof-dir` ကို သတ်မှတ်မထားဘူးဆိုရင် — ထုတ်လုပ်လိုက်တဲ့ profile ကို လက်ရှိ working directory ထဲမှာ ထားရှိပါတယ်။

`--heap-prof-name` ကို သတ်မှတ်မထားဘူးဆိုရင် — ထုတ်လုပ်လိုက်တဲ့ profile ကို `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile` လို့ နာမည်ပေးပါတယ်။

```console
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
```

### `--heap-prof-dir`

`--heap-prof` က ထုတ်လုပ်တဲ့ heap profiles တွေကို ထားရှိမယ့် directory ကို သတ်မှတ်ပေးပါတယ်။

Default တန်ဖိုးကို [`--diagnostic-dir`][] command-line option က ထိန်းချုပ်ပါတယ်။

### `--heap-prof-interval`

`--heap-prof` က ထုတ်လုပ်တဲ့ heap profiles တွေအတွက် average sampling interval ကို bytes နဲ့ သတ်မှတ်ပေးပါတယ်။ Default ကတော့ 512 \* 1024 bytes ဖြစ်ပါတယ်။

### `--heap-prof-name`

`--heap-prof` က ထုတ်လုပ်တဲ့ heap profile ရဲ့ file name ကို သတ်မှတ်ပေးပါတယ်။

### `--heapsnapshot-near-heap-limit=max_count`

V8 heap ရဲ့ အသုံးပြုမှုက heap limit ဆီကို နီးကပ်လာတဲ့အခါ — V8 heap snapshot တစ်ခုကို disk ပေါ်ကို ရေးသားပါတယ်။ `count` က non-negative (အနုတ်မဟုတ်သော) integer တစ်ခု ဖြစ်ရပါမယ် (အဲဒီလိုဆိုရင် Node.js က `max_count` snapshots ထက် ပိုပြီး disk ပေါ်ကို ရေးသားမှာ မဟုတ်ပါဘူး)။

Snapshots တွေကို ထုတ်လုပ်တဲ့အခါ — garbage collection က trigger ဖြစ်ပြီး heap အသုံးပြုမှုကို ကျဆင်းစေနိုင်ပါတယ်။ ဒါကြောင့် — Node.js instance က နောက်ဆုံးမှာ memory ကုန်သွားခင် — snapshots အများအပြား ရေးသားခံရနိုင်ပါတယ်။ Consecutive snapshots တွေကို ရိုက်ယူတဲ့ အချိန်အတွင်းမှာ ဘယ် objects တွေ allocate လုပ်ခံနေရလဲဆိုတာကို ဆုံးဖြတ်ဖို့ — ဒီ heap snapshots တွေကို နှိုင်းယှဉ်ကြည့်နိုင်ပါတယ်။ Node.js က `max_count` snapshots ကို အတိအကျ ရေးသားပါလိမ့်မယ်လို့တော့ အာမခံချက် မရှိပါဘူး — ဒါပေမယ့် `max_count` က `0` ထက် ကြီးတဲ့အခါ — Node.js instance က memory ကုန်သွားခင် — အနည်းဆုံး တစ်ခုကနေ `max_count` snapshots အထိ ထုတ်လုပ်ဖို့ အကောင်းဆုံး ကြိုးစားပါလိမ့်မယ်။

V8 snapshots တွေကို ထုတ်လုပ်တာက အချိန်နဲ့ memory နှစ်ခုလုံး လိုအပ်ပါတယ် (V8 heap က စီမံခန့်ခွဲတဲ့ memory ရော — V8 heap အပြင်ဘက်က native memory ပါ နှစ်မျိုးလုံး)။ Heap က ပိုကြီးလေလေ — resources တွေ ပိုလိုအပ်လေလေပါ။ Node.js က ထပ်ဆောင်း V8 heap memory overhead ကို လိုက်လျောဖို့ V8 heap ကို ညှိနှိုင်းပြီး — process အတွက် ရရှိနိုင်တဲ့ memory တွေ အားလုံး ကုန်ဆုံးသွားတာကို ရှောင်ရှားဖို့ အကောင်းဆုံး ကြိုးစားပါလိမ့်မယ်။ Process က system က သင့်လျော်တယ်လို့ မှတ်ယူတာထက် memory ပိုသုံးနေတဲ့အခါ — system configuration ပေါ် မူတည်ပြီး — process ကို system က ရုတ်တရက် terminate လုပ်ပစ်နိုင်ပါတယ်။

```console
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
```

### `--heapsnapshot-signal=signal`

သတ်မှတ်ထားတဲ့ signal ကို လက်ခံရရှိတဲ့အခါ — Node.js process က heap dump တစ်ခုကို ရေးသားစေမယ့် signal handler တစ်ခုကို enable လုပ်ပါတယ်။ `signal` က တရားဝင် (valid) signal name တစ်ခု ဖြစ်ရပါမယ်။ Default အနေနဲ့တော့ disabled ဖြစ်ပါတယ်။

```console
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
```

### `-h`, `--help`

Node command-line options တွေကို print ထုတ်ပေးပါတယ်။ ဒီ option ရဲ့ output က ဒီ document လောက် အသေးစိတ် မကျပါဘူး။

### `--icu-data-dir=file`

ICU data ရဲ့ load path ကို သတ်မှတ်ပေးပါတယ်။ (`NODE_ICU_DATA` ကို override လုပ်ပါတယ်။)

### `--import=module`

> Stability: 1 - Experimental

စတင်ချိန်မှာ သတ်မှတ်ထားတဲ့ module ကို preload လုပ်ပါတယ်။ Flag ကို အကြိမ်များစွာ ပေးထားရင် — module တစ်ခုချင်းစီကို — [`NODE_OPTIONS`][] ထဲမှာ ပေးထားတာတွေကနေ စပြီး — ပေါ်လာတဲ့ အစီအစဉ်အတိုင်း တစ်ခုပြီးတစ်ခု execute လုပ်ပါတယ်။

[ECMAScript module][] ရဲ့ resolution rules တွေကို လိုက်နာပါတယ်။ [CommonJS module][] တစ်ခုကို load လုပ်ဖို့ [`--require`][] ကို သုံးပါ။ `--require` နဲ့ preload လုပ်ထားတဲ့ modules တွေက `--import` နဲ့ preload လုပ်ထားတဲ့ modules တွေထက် အရင်ဦး run လုပ်ပါလိမ့်မယ်။

Modules တွေကို main thread ထဲကိုရော — worker threads တွေ၊ forked processes တွေ သို့မဟုတ် clustered processes တွေထဲကိုပါ preload လုပ်ပါတယ်။

### `--input-type=type`

ဒါက Node.js ကို — `--eval` သို့မဟုတ် `STDIN` input ကို CommonJS (သို့) ES module အဖြစ် အနက်ဖွင့်ဖို့ သတ်မှတ်ပေးပါတယ်။ တရားဝင် တန်ဖိုးတွေကတော့ `"commonjs"`, `"module"`, `"module-typescript"` နဲ့ `"commonjs-typescript"` တို့ပါ။ `"-typescript"` တန်ဖိုးတွေက `--no-strip-types` flag နဲ့တော့ မရနိုင်ပါဘူး။ Default ကတော့ တန်ဖိုး မရှိတာ ဖြစ်ပြီး — `--no-experimental-detect-module` ကို ဖြတ်သန်းပေးထားရင်တော့ `"commonjs"` ဖြစ်ပါတယ်။

`--input-type` ကို မပေးထားဘူးဆိုရင် — Node.js က အောက်ပါ အဆင့်တွေနဲ့ syntax ကို detect လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်:

1. Input ကို CommonJS အဖြစ် run လုပ်ပါတယ်။
2. အဆင့် 1 မအောင်မြင်ရင် — input ကို ES module အဖြစ် run လုပ်ပါတယ်။
3. အဆင့် 2 က SyntaxError တစ်ခုနဲ့ မအောင်မြင်ရင် — types တွေကို strip လုပ်ပါတယ်။
4. အဆင့် 3 က error code [`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`][] သို့မဟုတ် [`ERR_INVALID_TYPESCRIPT_SYNTAX`][] တစ်ခုနဲ့ မအောင်မြင်ရင် — message ထဲမှာ TypeScript error ကို ထည့်သွင်းပြီး — အဆင့် 2 ရဲ့ error ကို throw လုပ်ပါတယ် — မဟုတ်ရင်တော့ CommonJS အဖြစ် run လုပ်ပါတယ်။
5. အဆင့် 4 မအောင်မြင်ရင် — input ကို ES module အဖြစ် run လုပ်ပါတယ်။

Syntax detection ကို အကြိမ်များစွာ လုပ်ရတဲ့ ကြန့်ကြာမှုကို ရှောင်ရှားဖို့ — `--eval` input ကို ဘယ်လို အနက်ဖွင့်သင့်လဲဆိုတာ သတ်မှတ်ဖို့ — `--input-type=type` flag ကို သုံးနိုင်ပါတယ်။

REPL က ဒီ option ကို ပံ့ပိုးမထားပါဘူး။ `--input-type=module` ကို [`--print`][] နဲ့ တွဲသုံးရင် error တစ်ခု throw လုပ်ပါလိမ့်မယ် — အကြောင်းကတော့ `--print` က ES module syntax ကို ပံ့ပိုးမထားလို့ပါ။

### `--insecure-http-parser`

HTTP parser ပေါ်မှာ leniency flags (လျော့ပေါ့ခွင့်ပြုမှု flag များ) တွေကို enable လုပ်ပါတယ်။ ဒါက — စံနှုန်းနဲ့ မကိုက်ညီတဲ့ (non-conformant) HTTP implementations တွေနဲ့ interoperability (အပြန်အလှန် ဆက်သွယ်နိုင်မှု) ကို ခွင့်ပြုနိုင်ပါတယ်။

Enable လုပ်ထားတဲ့အခါ — parser က အောက်ပါတို့ကို လက်ခံပါလိမ့်မယ်:

* တရားမဝင် (invalid) HTTP headers values တွေ။
* တရားမဝင် HTTP versions တွေ။
* `Transfer-Encoding` ရော `Content-Length` headers ပါ နှစ်ခုလုံး ပါဝင်တဲ့ message တွေကို ခွင့်ပြုပါတယ်။
* `Connection: close` ရှိနေတဲ့အခါ — message ပြီးနောက်မှာ နောက်ထပ် data တွေကို ခွင့်ပြုပါတယ်။
* `chunked` ကို ပေးပြီးနောက်မှာ နောက်ထပ် transfer encodings တွေကို ခွင့်ပြုပါတယ်။
* `\r\n` အစား token separator အဖြစ် `\n` ကို သုံးခွင့်ပြုပါတယ်။
* Chunk တစ်ခု ပြီးနောက်မှာ `\r\n` မပေးပဲ နေခွင့်ပြုပါတယ်။
* Chunk size ပြီးနောက်နဲ့ `\r\n` မတိုင်ခင် နေရာလွတ် (spaces) တွေ ရှိနေခွင့်ပြုပါတယ်။

အပေါ်က အချက်တွေ အားလုံးက သင့် application ကို request smuggling (တောင်းဆိုမှု ခိုးဝှက် ပို့ဆောင်ခြင်း) သို့မဟုတ် poisoning attack (အဆိပ်သင့် တိုက်ခိုက်မှု) တွေဆီကို ထိတွေ့စေနိုင်ပါတယ်။ ဒီ option ကို သုံးတာ ရှောင်ကြဉ်ပါ။

### `--inspect-brk[=[host:]port]`

`host:port` ပေါ်မှာ inspector ကို activate လုပ်ပြီး — user script ရဲ့ အစမှာ break လုပ်ပါတယ်။ Default `host:port` ကတော့ `127.0.0.1:9229` ဖြစ်ပါတယ်။ Port `0` ကို သတ်မှတ်ထားရင် — ကျပန်း ရွေးချယ်ထားတဲ့ ရနိုင်တဲ့ port တစ်ခုကို သုံးပါလိမ့်မယ်။

Node.js debugger အကြောင်း နောက်ထပ် ရှင်းလင်းချက်တွေအတွက် [V8 Inspector integration for Node.js][] ကို ကြည့်ပါ။

`host` parameter အသုံးပြုမှုနဲ့ ပတ်သက်ပြီး — အောက်က [security warning][] ကို ကြည့်ပါ။

### `--inspect-port=[host:]port`

Inspector ကို activate လုပ်တဲ့အခါ သုံးမယ့် `host:port` ကို သတ်မှတ်ပေးပါတယ်။ `SIGUSR1` signal ကို ပို့ပြီး inspector ကို activate လုပ်တဲ့အခါ အသုံးဝင်ပါတယ်။ [`--disable-sigusr1`][] ကို ဖြတ်သန်းပေးထားတဲ့ ကိစ္စမျိုးကတော့ လွဲပါတယ်။

Default host ကတော့ `127.0.0.1` ဖြစ်ပါတယ်။ Port `0` ကို သတ်မှတ်ထားရင် — ကျပန်း ရွေးချယ်ထားတဲ့ ရနိုင်တဲ့ port တစ်ခုကို သုံးပါလိမ့်မယ်။

`host` parameter အသုံးပြုမှုနဲ့ ပတ်သက်ပြီး — အောက်က [security warning][] ကို ကြည့်ပါ။

### `--inspect-publish-uid=stderr,http`

Inspector web socket url ကို ထုတ်ဖော်ပြသမယ့် နည်းလမ်းတွေကို သတ်မှတ်ပေးပါတယ်။

Default အနေနဲ့ inspector websocket url ကို stderr ထဲမှာရော — `http://host:port/json/list` ပေါ်က `/json/list` endpoint အောက်မှာပါ ရရှိနိုင်ပါတယ်။

### `--inspect-wait[=[host:]port]`

`host:port` ပေါ်မှာ inspector ကို activate လုပ်ပြီး — debugger တစ်ခု တွဲချိတ်လာဖို့ စောင့်ဆိုင်းပါတယ်။ Default `host:port` ကတော့ `127.0.0.1:9229` ဖြစ်ပါတယ်။ Port `0` ကို သတ်မှတ်ထားရင် — ကျပန်း ရွေးချယ်ထားတဲ့ ရနိုင်တဲ့ port တစ်ခုကို သုံးပါလိမ့်မယ်။

Node.js debugger အကြောင်း နောက်ထပ် ရှင်းလင်းချက်တွေအတွက် [V8 Inspector integration for Node.js][] ကို ကြည့်ပါ။

`host` parameter အသုံးပြုမှုနဲ့ ပတ်သက်ပြီး — အောက်က [security warning][] ကို ကြည့်ပါ။

### `--inspect[=[host:]port]`

`host:port` ပေါ်မှာ inspector ကို activate လုပ်ပါတယ်။ Default ကတော့ `127.0.0.1:9229` ဖြစ်ပါတယ်။ Port `0` ကို သတ်မှတ်ထားရင် — ကျပန်း ရွေးချယ်ထားတဲ့ ရနိုင်တဲ့ port တစ်ခုကို သုံးပါလိမ့်မယ်။

V8 inspector integration က Chrome DevTools နဲ့ IDEs လိုမျိုး tools တွေကို — Node.js instances တွေကို debug လုပ်ခြင်း၊ profile လုပ်ခြင်း ပြုလုပ်နိုင်စေပါတယ်။ Tools တွေက tcp port တစ်ခုကနေတစ်ဆင့် Node.js instances တွေနဲ့ တွဲချိတ်ပြီး — [Chrome DevTools Protocol][] ကို သုံးကာ ဆက်သွယ်ပါတယ်။ Node.js debugger အကြောင်း နောက်ထပ် ရှင်းလင်းချက်တွေအတွက် [V8 Inspector integration for Node.js][] ကို ကြည့်ပါ။

<a id="inspector_security"></a>

#### သတိပေးချက် — inspector ကို public IP:port ပေါင်းစပ်မှုတစ်ခုနဲ့ binding လုပ်ခြင်းသည် လုံခြုံမှု မရှိပါ (Warning: binding inspector to a public IP:port combination is insecure)

Inspector ကို — port ဖွင့်ထားတဲ့ public IP တစ်ခု (`0.0.0.0` အပါအဝင်) နဲ့ binding လုပ်ထားတာက လုံခြုံမှု မရှိပါဘူး — အကြောင်းကတော့ ပြင်ပ hosts တွေက inspector ဆီကို ချိတ်ဆက်ပြီး — [remote code execution][] (အဝေးမှ code run လုပ်ခြင်း) တိုက်ခိုက်မှုတစ်ခုကို လုပ်ဆောင်နိုင်လို့ပါ။

Host တစ်ခုကို သတ်မှတ်ပေးမယ်ဆိုရင် — အောက်ပါတို့ထဲက တစ်ခုခု သေချာစေပါ:

* Host က public networks တွေကနေ ဝင်ရောက်လို့ မရတဲ့အရာ ဖြစ်ခြင်း။
* Firewall တစ်ခုက အဲဒီ port ပေါ်က မလိုလားအပ်တဲ့ connections တွေကို တားမြစ်ထားခြင်း။

**ပိုတိကျပြောရရင် — `--inspect=0.0.0.0` က port (`9229` — default) ကို firewall နဲ့ မကာကွယ်ထားဘူးဆိုရင် — လုံခြုံမှု မရှိပါဘူး။**

နောက်ထပ် အချက်အလက်တွေအတွက် [debugging security implications][] section ကို ကြည့်ပါ။

### `-i`, `--interactive`

stdin က terminal တစ်ခုလို မပေါ်ရင်တောင် — REPL ကို ဖွင့်ပေးပါတယ်။

### `--jitless`

> Stability: 1 - Experimental. ဤ flag ကို V8 မှ အမွေဆက်ခံထားပြီး — upstream တွင် ပြောင်းလဲမှု ရှိနိုင်ပါတယ်။

Executable memory (run လုပ်နိုင်သော memory) ၏ [runtime allocation][jitless] ကို disable လုပ်ပါတယ်။ လုံခြုံရေး အကြောင်းပြချက်တွေကြောင့် — platform အချို့မှာ ဒါ လိုအပ်နိုင်ပါတယ်။ တခြား platforms တွေမှာလည်း attack surface (တိုက်ခိုက်ခံရနိုင်သော မျက်နှာပြင်) ကို လျှော့ချပေးနိုင်ပေမယ့် — performance သက်ရောက်မှုကတော့ ပြင်းထန်နိုင်ပါတယ်။

### `--localstorage-file=file`

> Stability: 1.2 - Release candidate.

`localStorage` data တွေကို သိမ်းဆည်းဖို့ သုံးတဲ့ file ပါ။ File မရှိဘူးဆိုရင် — `localStorage` ကို ပထမဆုံး အကြိမ် ဝင်ရောက်သုံးစွဲတဲ့အခါ — ၎င်းကို ဖန်တီးပေးပါတယ်။ File တစ်ခုတည်းကို Node.js processes အများအပြားကြားမှာ တစ်ပြိုင်နက် (concurrently) မျှဝေသုံးစွဲနိုင်ပါတယ်။

### `--max-http-header-size=size`

HTTP headers တွေရဲ့ အများဆုံး အရွယ်အစားကို bytes နဲ့ သတ်မှတ်ပေးပါတယ်။ Default ကတော့ 16 KiB ဖြစ်ပါတယ်။

### `--max-old-space-size-percentage=percentage`

V8 ရဲ့ old memory section ရဲ့ အများဆုံး memory အရွယ်အစားကို — ရရှိနိုင်တဲ့ system memory ရဲ့ ရာခိုင်နှုန်း (percentage) တစ်ခုအနေနဲ့ သတ်မှတ်ပေးပါတယ်။ နှစ်ခုလုံး သတ်မှတ်ထားတဲ့အခါ — ဒီ flag က `--max-old-space-size` ထက် ဦးစားပေး အသုံးပြုပါတယ်။

`percentage` parameter က — V8 heap ဆီကို ခွဲဝေပေးရမယ့် ရရှိနိုင်တဲ့ system memory ရဲ့ ရာခိုင်နှုန်းကို ကိုယ်စားပြုတဲ့ — 0 ထက် ကြီးပြီး 100 အထိ ရှိတဲ့ ဂဏန်းတစ်ခု ဖြစ်ရပါမယ်။

**မှတ်ချက်:** ဒီ flag က `--max-old-space-size` ကို အသုံးပြုပါတယ် — integer overflow ပြဿနာတွေကြောင့် 32-bit platforms တွေမှာ အဲဒါ စိတ်ချရမှု မရှိနိုင်ပါဘူး။

```bash
# Using 50% of available system memory
node --max-old-space-size-percentage=50 index.js

# Using 75% of available system memory
node --max-old-space-size-percentage=75 index.js
```

### `--network-family-autoselection-attempt-timeout`

Network family autoselection attempt timeout အတွက် default တန်ဖိုးကို သတ်မှတ်ပေးပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [`net.getDefaultAutoSelectFamilyAttemptTimeout()`][] ကို ကြည့်ပါ။

### `--no-addons`

`node-addons` exports condition ကို disable လုပ်သလို — native addons တွေကို load လုပ်ခြင်းကိုလည်း disable လုပ်ပါတယ်။ `--no-addons` ကို သတ်မှတ်ထားတဲ့အခါ — `process.dlopen` ကို ခေါ်တာ သို့မဟုတ် native C++ addon တစ်ခုကို require လုပ်တာက မအောင်မြင်ပဲ — exception တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### `--no-async-context-frame`

[`AsyncLocalStorage`][] ကို `AsyncContextFrame` နဲ့ ကျောထောက်နောက်ခံပြုထားတဲ့ အသုံးပြုမှုကို disable လုပ်ပြီး — async\_hooks ပေါ်ကို မှီခိုခဲ့တဲ့ အရင် implementation ကို သုံးပါတယ်။ အရင် model ကို Electron နဲ့ လိုက်ဖက်ညီမှု အတွက်ရော — context flow ကွဲပြားနိုင်တဲ့ အခြေအနေတွေအတွက်ပါ ထိန်းသိမ်းထားပါတယ်။ ဒါပေမယ့် — flow မှာ ကွဲပြားမှုတစ်ခု တွေ့ရှိရင် — အစီရင်ခံပေးပါ။

### `--no-deprecation`

Deprecation warnings (ခေတ်မမီတော့ကြောင်း သတိပေးချက်များ) တွေကို တိတ်ဆိတ်စေ (silence) ပါတယ်။

### `--no-experimental-detect-module`

Module type ကို ဆုံးဖြတ်ဖို့ [syntax detection][] ကို သုံးခြင်းကို disable လုပ်ပါတယ်။

### `--no-experimental-global-navigator`

> Stability: 1 - Experimental

Global scope ပေါ်မှာ [Navigator API][] ကို ထုတ်ဖော်ပြသခြင်းကို disable လုပ်ပါတယ်။

### `--no-experimental-repl-await`

REPL ထဲမှာ top-level await ကို disable လုပ်ဖို့ ဒီ flag ကို သုံးပါ။

### `--no-experimental-require-module`

> Stability: 3 - Legacy: Use [`--no-require-module`][] instead.

[`--no-require-module`][] အတွက် legacy alias (အမွေဆက်ခံ alias) တစ်ခုပါ။

### `--no-experimental-sqlite`

Experimental ဖြစ်တဲ့ [`node:sqlite`][] module ကို disable လုပ်ပါတယ်။

### `--no-experimental-websocket`

Global scope ပေါ်မှာ {WebSocket} ကို ထုတ်ဖော်ပြသခြင်းကို disable လုပ်ပါတယ်။

### `--no-experimental-webstorage`

> Stability: 1.2 - Release candidate.

[`Web Storage`][] support ကို disable လုပ်ပါတယ်။

### `--no-extra-info-on-fatal-exception`

Exit ဖြစ်စေတဲ့ fatal exception (ဆိုးဝါးသော exception) တစ်ခုပေါ်မှာ ထပ်ဆောင်း အချက်အလက်တွေကို ဖုံးကွယ်ပါတယ်။

### `--no-force-async-hooks-checks`

`async_hooks` အတွက် runtime checks တွေကို disable လုပ်ပါတယ်။ `async_hooks` ကို enable လုပ်ထားတဲ့အခါ — အဲဒီ checks တွေကို dynamically ပြန်လည် enable လုပ်ပါဦးမယ်။

### `--no-global-search-paths`

`$HOME/.node_modules` နဲ့ `$NODE_PATH` လိုမျိုး global paths တွေကနေ modules တွေကို ရှာဖွေမှာ မဟုတ်ပါဘူး။

### `--no-network-family-autoselection`

Connection options တွေက တိုက်ရိုက် enable မလုပ်ထားရင် — family autoselection algorithm ကို disable လုပ်ပါတယ်။

<a id="--experimental-require-module"></a>

### `--no-require-module`

`require()` ထဲမှာ synchronous ES module graph တစ်ခုကို load လုပ်ခြင်းအတွက် support ကို disable လုပ်ပါတယ်။

[Loading ECMAScript modules using `require()`][] ကို ကြည့်ပါ။

### `--no-strip-types`

TypeScript files တွေအတွက် type-stripping (type ချွတ်ခြင်း) ကို disable လုပ်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် — [TypeScript type-stripping][] documentation ကို ကြည့်ပါ။
### `--no-warnings`

Process warnings တွေ အားလုံးကို — deprecations တွေ အပါအဝင် — တိတ်ဆိတ်စေပါတယ်။

### `--node-memory-debug`

Node.js ရဲ့ internals (အတွင်းပိုင်း ယန္တရားများ) တွေမှာ memory leaks (မှတ်ဉာဏ် ယိုစိမ့်မှုများ) အတွက် ထပ်ဆောင်း debug checks တွေကို enable လုပ်ပါတယ်။ ဒါက ပုံမှန်အားဖြင့် Node.js ကိုယ်တိုင်ကို debug လုပ်နေတဲ့ developers တွေအတွက်သာ အသုံးဝင်ပါတယ်။

### `--openssl-config=file`

စတင်ချိန်မှာ OpenSSL configuration file တစ်ခုကို load လုပ်ပါတယ်။ ဒီ file က OpenSSL 3 FIPS provider တစ်ခုကို activate လုပ်နိုင်သလို — FIPS-capable (FIPS လုပ်နိုင်သော) OpenSSL 1.1.1 build တစ်ခုကိုလည်း configure လုပ်နိုင်ပါတယ်။ [FIPS mode][] ကို ကြည့်ပါ။

ဒီ option က `OPENSSL_CONF` environment variable ထက် ဦးစားပေး သတ်မှတ်ခံရပါတယ်။

### `--openssl-legacy-provider`

OpenSSL 3.0 ရဲ့ legacy provider ကို enable လုပ်ပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [OSSL\_PROVIDER-legacy][OSSL_PROVIDER-legacy] ကို ကြည့်ပါ။

### `--openssl-shared-config`

OpenSSL configuration file ကနေ ဖတ်ရှုရမယ့် OpenSSL ရဲ့ default configuration section ဖြစ်တဲ့ `openssl_conf` ကို enable လုပ်ပါတယ်။ Default configuration file ရဲ့ အမည်က `openssl.cnf` ဖြစ်ပေမယ့် — `OPENSSL_CONF` environment variable ဒါမှမဟုတ် `--openssl-config` command line option ကို သုံးပြီး ပြောင်းလဲနိုင်ပါတယ်။ Default OpenSSL configuration file ရဲ့ တည်နေရာက OpenSSL ကို Node.js နဲ့ ဘယ်လို ချိတ်ဆက် (link) ထားလဲဆိုတာပေါ်မှာ မူတည်ပါတယ်။ OpenSSL configuration ကို မျှဝေသုံးစွဲတာက မလိုလားအပ်တဲ့ သက်ရောက်မှုတွေ ရှိနိုင်တာမို့ — Node.js အတွက် သီးသန့်ဖြစ်တဲ့ configuration section ဖြစ်တဲ့ `nodejs_conf` ကို သုံးဖို့ အကြံပြုပါတယ် — အဲဒီ section က ဒီ option ကို မသုံးတဲ့အခါ default ဖြစ်ပါတယ်။

### `--pending-deprecation`

Pending deprecation warnings တွေကို emit လုပ်ပါတယ်။

Pending deprecations တွေက ယေဘုယျအားဖြင့် runtime deprecation တစ်ခုနဲ့ အတူတူပဲ ဖြစ်ပေမယ့် — ထူးခြားတဲ့ ချွင်းချက်က — ၎င်းတို့ကို default အနေနဲ့ _ပိတ်_ (off) ထားပြီး — `--pending-deprecation` command-line flag ဒါမှမဟုတ် `NODE_PENDING_DEPRECATION=1` environment variable ထဲက တစ်ခုခုကို သတ်မှတ်မထားရင် — emit လုပ်မှာ မဟုတ်ပါဘူး။ Pending deprecations တွေကို — deprecated API အသုံးပြုမှုတွေကို ထောက်လှမ်းဖို့ developers တွေ အသုံးချနိုင်တဲ့ — ရွေးချယ်ထားသော "ကြိုတင် သတိပေးချက် (early warning)" ယန္တရားတစ်မျိုး ပေးအပ်ဖို့ သုံးပါတယ်။

### `--permission`

လက်ရှိ process အတွက် Permission Model (ခွင့်ပြုချက် ပုံစံ) ကို enable လုပ်ပါတယ်။ Enable လုပ်လိုက်တဲ့အခါ — အောက်ပါ permissions တွေကို ကန့်သတ် (restrict) လုပ်ပါတယ်:

> Access တွေကို ငြင်းပယ်မလုပ်ပဲ ချိုးဖောက်မှုတွေကို မှတ်တမ်းတင်ရုံသာ လုပ်တဲ့ audit-only mode အတွက်
> [`--permission-audit`](#--permission-audit) ကိုလည်း ကြည့်ပါ။

* File System - [`--allow-fs-read`][], [`--allow-fs-write`][] flags တွေကနေတစ်ဆင့် စီမံခန့်ခွဲနိုင်ပါတယ်။
* Network - [`--allow-net`][] flag ကနေတစ်ဆင့် စီမံခန့်ခွဲနိုင်ပါတယ်။
* Child Process - [`--allow-child-process`][] flag ကနေတစ်ဆင့် စီမံခန့်ခွဲနိုင်ပါတယ်။
* Worker Threads - [`--allow-worker`][] flag ကနေတစ်ဆင့် စီမံခန့်ခွဲနိုင်ပါတယ်။
* WASI - [`--allow-wasi`][] flag ကနေတစ်ဆင့် စီမံခန့်ခွဲနိုင်ပါတယ်။
* Addons - [`--allow-addons`][] flag ကနေတစ်ဆင့် စီမံခန့်ခွဲနိုင်ပါတယ်။
* FFI - [`--allow-ffi`](#--allow-ffi) flag ကနေတစ်ဆင့် စီမံခန့်ခွဲနိုင်ပါတယ်။
* OpenSSL STORE loaders - [`--allow-openssl-store`][] flag ကနေတစ်ဆင့် စီမံခန့်ခွဲနိုင်ပါတယ်။

### `--permission-audit`

Permission model အတွက် audit mode ကို enable လုပ်ပါတယ်။ Enable လုပ်လိုက်တဲ့အခါ — permission checks တွေကို လုပ်ဆောင်ပေမယ့် — access တွေကို **ငြင်းပယ်** (denied) လုပ်မှာ မဟုတ်ပါဘူး — `ERR_ACCESS_DENIED` error တစ်ခုကိုလည်း throw လုပ်မှာ မဟုတ်ပါဘူး။ အဲဒီအစား — permission violation တစ်ခုချင်းစီကို `node:diagnostics_channel` module ကနေတစ်ဆင့် ထုတ်ပြန် (publish) လုပ်ပြီး — execution က ပုံမှန်အတိုင်း ဆက်လက် လုပ်ဆောင်ပါတယ်။

ဒီ flag ကို သုံးဖို့ [`--permission`](#--permission) ကို သတ်မှတ်ပေးဖို့ မလိုပါဘူး။ Audit mode မှာ access ဘာမှ ငြင်းပယ်မခံရတာမို့ — `--allow-*` flags တွေလည်း မလိုအပ်ပါဘူး။

Audit mode က — [`--permission`](#--permission) နဲ့ deploy (ဖြန့်ကျက်) မလုပ်ခင် — သင့် application က ဘယ် permissions တွေ လိုအပ်လဲဆိုတာကို ရှာဖွေတွေ့ရှိဖို့ အသုံးဝင်ပါတယ်။ Diagnostics channel names တွေရဲ့ စာရင်းနဲ့ message format အတွက် [Permission Model][] documentation ကို ကြည့်ပါ။

[`--permission`](#--permission) နဲ့ `--permission-audit` နှစ်ခုလုံးကို သတ်မှတ်ထားရင် — `--permission` က ဦးစားပေး ရရှိပြီး — Permission Model က enforce mode (တွန်းအားပေး လိုက်နာစေသော mode) နဲ့ လည်ပတ်ပါတယ်။

### `--preserve-symlinks`

Modules တွေကို resolve လုပ်ပြီး cache လုပ်တဲ့အခါ — module loader ကို symbolic links တွေကို ထိန်းသိမ်းထားဖို့ (preserve) ညွှန်ကြားပါတယ်။

Default အနေနဲ့ — Node.js က disk ပေါ်က တခြားနေရာတစ်ခုဆီကို symbolically link လုပ်ထားတဲ့ path တစ်ခုကနေ module တစ်ခုကို load လုပ်တဲ့အခါ — link ကို dereference လုပ်ပြီး — module ရဲ့ disk ပေါ်က တကယ့် "real path" ကို — identifier တစ်ခုအနေနဲ့ရော — တခြား dependency modules တွေကို ရှာဖွေဖို့ root path တစ်ခုအနေနဲ့ပါ — သုံးပါတယ်။ အများစုသော အခြေအနေတွေမှာ ဒီ default အပြုအမူက လက်ခံနိုင်ပါတယ်။ ဒါပေမယ့် — symbolically linked လုပ်ထားတဲ့ peer dependencies တွေကို သုံးတဲ့အခါ — အောက်က ဥပမာမှာ ပြထားသလိုပဲ — `moduleA` က `moduleB` ကို peer dependency တစ်ခုအနေနဲ့ require လုပ်ဖို့ ကြိုးစားရင် — default အပြုအမူက exception တစ်ခုကို throw ဖြစ်စေပါတယ်:

```text
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
```

`--preserve-symlinks` command-line flag က — real path အစား modules တွေအတွက် symlink path ကို သုံးဖို့ Node.js ကို ညွှန်ကြားပြီး — symbolically linked လုပ်ထားတဲ့ peer dependencies တွေကို ရှာဖွေတွေ့ရှိနိုင်စေပါတယ်။

ဒါပေမယ့် — `--preserve-symlinks` ကို သုံးတာက တခြား ဘေးထွက် ဆိုးကျိုးတွေ (side effects) ရှိနိုင်တာ သတိပြုပါ။ အထူးသဖြင့် — dependency tree ထဲမှာ နေရာတစ်ခုထက်ပိုပြီး link လုပ်ခံထားရတဲ့ — symbolically linked _native_ modules တွေက load လုပ်ဖို့ မအောင်မြင်နိုင်ပါဘူး (Node.js က ၎င်းတို့ကို သီးခြား modules နှစ်ခုအနေနဲ့ မြင်ပြီး — module ကို အကြိမ်များစွာ load လုပ်ဖို့ ကြိုးစားရာကနေ — exception တစ်ခု throw ဖြစ်သွားနိုင်လို့ပါ)။

`--preserve-symlinks` flag က main module ကို သက်ရောက်မှု မရှိပါဘူး — အဲဒါကြောင့် `node --preserve-symlinks node_module/.bin/<foo>` က အလုပ်လုပ်နိုင်တာပါ။ Main module အတွက်ပါ အလားတူ အပြုအမူ ရစေချင်ရင် — `--preserve-symlinks-main` ကိုပါ သုံးပါ။

### `--preserve-symlinks-main`

Main module (`require.main`) ကို resolve လုပ်ပြီး cache လုပ်တဲ့အခါ — module loader ကို symbolic links တွေ ထိန်းသိမ်းထားဖို့ ညွှန်ကြားပါတယ်။

ဒီ flag က — main module ကို `--preserve-symlinks` က တခြား imports တွေ အားလုံးအတွက် ပေးတဲ့ အပြုအမူအတိုင်း opt-in လုပ်နိုင်ဖို့ ဖြစ်ပါတယ်။ ဒါပေမယ့် — Node.js ရဲ့ ဟောင်းနွမ်းတဲ့ versions တွေနဲ့ backward compatibility (နောက်ပြန် လိုက်ဖက်ညီမှု) အတွက် — ၎င်းတို့က သီးခြား flags တွေပါ။

`--preserve-symlinks-main` က `--preserve-symlinks` ကို ဆိုလိုတာ မဟုတ်ပါဘူး။ Relative paths တွေကို resolve မလုပ်ခင် symlinks တွေကို လိုက်လံ ဖော်ပြခြင်း (follow) မပြုလုပ်စေချင်တဲ့အခါ — `--preserve-symlinks-main` ကို `--preserve-symlinks` နဲ့အတူ ထပ်ဆောင်း သုံးပါ။

နောက်ထပ် အချက်အလက်တွေအတွက် [`--preserve-symlinks`][] ကို ကြည့်ပါ။

### `-p`, `--print "script"`

`-e` နဲ့ အတူတူပဲ ဖြစ်ပေမယ့် — ရလဒ် (result) ကို print လုပ်ပါတယ်။

### `--prof`

V8 profiler output ကို ထုတ်လုပ်ပါတယ်။

### `--prof-process`

V8 option `--prof` ကို သုံးပြီး ထုတ်လုပ်ထားတဲ့ V8 profiler output ကို process လုပ်ပါတယ်။

### `--redirect-warnings=file`

Process warnings တွေကို stderr မှာ print လုပ်မယ့်အစား — ပေးထားတဲ့ file ထဲကို ရေးသားပါတယ်။ File မရှိသေးရင် အသစ် ဖန်တီးပေးပြီး — ရှိပြီးသားဆိုရင်တော့ နောက်ကနေ ထပ်ဆင့် ရေးသား (append) လုပ်ပါတယ်။ Warning ကို file ထဲ ရေးသားဖို့ ကြိုးစားတုန်း error တစ်ခု ဖြစ်ခဲ့ရင် — warning ကို stderr မှာ ရေးသားပါလိမ့်မယ်။

`file` ရဲ့ အမည်က absolute path တစ်ခု ဖြစ်နိုင်ပါတယ်။ မဟုတ်ရင် — ရေးသားမယ့် default directory ကို [`--diagnostic-dir`][] command-line option က ထိန်းချုပ်ပါတယ်။

### `--report-compact`

Reports တွေကို compact format (ကျစ်လျစ်သော ပုံစံ) နဲ့ ရေးသားပါတယ် — single-line JSON ဖြစ်ပြီး — လူတွေ ဖတ်ရှုဖို့ ဒီဇိုင်းထုတ်ထားတဲ့ default multi-line format ထက် log processing systems တွေအတွက် စားသုံးရ (consume) ပိုလွယ်ပါတယ်။

### `--report-dir=directory`, `--report-directory=directory`

Report ကို ထုတ်လုပ်မယ့် နေရာ (location) ပါ။

### `--report-exclude-env`

`--report-exclude-env` ကို ဖြတ်သန်းပေးလိုက်ရင် — ထုတ်လုပ်လိုက်တဲ့ diagnostic report ထဲမှာ `environmentVariables` data ပါဝင်မှာ မဟုတ်ပါဘူး။

### `--report-exclude-network`

`header.networkInterfaces` ကို diagnostic report ကနေ ဖယ်ထုတ် (exclude) လုပ်ပါတယ်။ Default အနေနဲ့ ဒါကို သတ်မှတ်မထားပဲ — network interfaces တွေ ပါဝင်ပါတယ်။

### `--report-filename=filename`

Report ကို ရေးသားမယ့် file ရဲ့ အမည်ပါ။

Filename ကို `'stdout'` သို့မဟုတ် `'stderr'` အဖြစ် သတ်မှတ်ထားရင် — report ကို process ရဲ့ stdout သို့မဟုတ် stderr ဆီကို အသီးသီး ရေးသားပါတယ်။

### `--report-on-fatalerror`

Application ကို terminate လုပ်ဖို့ ဦးတည်စေတဲ့ fatal errors တွေ (out of memory လိုမျိုး Node.js runtime အတွင်းက internal errors) ပေါ်မှာ report ကို trigger လုပ်နိုင်စေပါတယ်။ Fatal error အကြောင်း ဆင်ခြင် နားလည်ဖို့ — heap, stack, event loop state, resource consumption (အရင်းအမြစ် သုံးစွဲမှု) စတဲ့ diagnostic data elements အမျိုးမျိုးကို စစ်ဆေးဖို့ အသုံးဝင်ပါတယ်။

### `--report-on-signal`

လည်ပတ်နေတဲ့ Node.js process ဆီကို သတ်မှတ်ထားတဲ့ (သို့) ကြိုတင် သတ်မှတ်ထားတဲ့ signal တစ်ခု ရောက်ရှိလာတဲ့အခါ — report ကို ထုတ်လုပ်နိုင်စေပါတယ်။ Report ကို trigger လုပ်မယ့် signal ကို `--report-signal` ကနေတစ်ဆင့် သတ်မှတ်ပါတယ်။

### `--report-signal=signal`

Report ထုတ်လုပ်မှုအတွက် signal ကို သတ်မှတ် သို့မဟုတ် ပြန်လည် သတ်မှတ်ပါတယ် (Windows မှာ support မလုပ်ပါဘူး)။ Default signal က `SIGUSR2` ပါ။

### `--report-uncaught-exception`

Process က uncaught exception တစ်ခုကြောင့် exit ဖြစ်တဲ့အခါ report ကို ထုတ်လုပ်နိုင်စေပါတယ်။ JavaScript stack ကို native stack နဲ့ တခြား runtime environment data တွေနဲ့ တွဲပြီး စစ်ဆေးတဲ့အခါ အသုံးဝင်ပါတယ်။

### `-r`, `--require module`

စတင်ချိန်မှာ သတ်မှတ်ထားတဲ့ module ကို preload လုပ်ပါတယ်။

`require()` ရဲ့ module resolution rules တွေကို လိုက်နာပါတယ်။ `module` က file တစ်ခုဆီကို ညွှန်ပြတဲ့ path တစ်ခု သို့မဟုတ် node module ရဲ့ အမည်တစ်ခု ဖြစ်နိုင်ပါတယ်။

`--require` နဲ့ preload လုပ်ထားတဲ့ modules တွေက `--import` နဲ့ preload လုပ်ထားတဲ့ modules တွေထက် အရင်ဦး run ပါလိမ့်မယ်။

Modules တွေကို main thread ရော — worker threads, forked processes (ခွဲထုတ်ထားတဲ့ processes) သို့မဟုတ် clustered processes တွေထဲကိုပါ preload လုပ်ပါတယ်။

### `--run`

ဒါက package.json ရဲ့ `"scripts"` object ထဲက သတ်မှတ်ထားတဲ့ command တစ်ခုကို run လုပ်ပါတယ်။ ပေးလိုက်တဲ့ `"command"` မရှိရင် (missing) — ရနိုင်တဲ့ scripts တွေကို စာရင်းပြ ပေးပါလိမ့်မယ်။

`--run` က root directory အထိ အထက်သို့ ဖြတ်သန်း (traverse) လုပ်ပြီး — command ကို run လုပ်ဖို့ `package.json` file တစ်ခုကို ရှာဖွေပါတယ်။

`node_modules` directories အများအပြား ရှိနေတဲ့အခါ — `ancestor-folder/node_modules/.bin` က directory တစ်ခု ဖြစ်နေရင် — `--run` က folder အမျိုးမျိုးကနေ binaries တွေကို လုပ်ဆောင်နိုင်ဖို့ — current directory ရဲ့ ancestor တစ်ခုချင်းစီအတွက် `./node_modules/.bin` ကို `PATH` ရဲ့ ရှေ့ဆုံးမှာ ထည့်သွင်းပေးပါတယ်။

`--run` က command ကို သက်ဆိုင်ရာ `package.json` ပါဝင်တဲ့ directory ထဲမှာ လုပ်ဆောင်ပါတယ်။

ဥပမာ — အောက်က command က current folder ထဲက `package.json` ရဲ့ `test` script ကို run လုပ်ပါလိမ့်မယ်:

```console
$ node --run test
```

Command ဆီကို arguments တွေလည်း ဖြတ်သန်းပေးနိုင်ပါတယ်။ `--` ရဲ့ နောက်မှာ ရှိတဲ့ argument တိုင်းကို script ရဲ့ နောက်မှာ ထပ်ဆင့် ထည့်သွင်းပါလိမ့်မယ်:

```console
$ node --run test -- --verbose
```

#### Intentional limitations (ရည်ရွယ်ချက်ရှိရှိ ကန့်သတ်ချက်များ)

`node --run` က `npm run` သို့မဟုတ် တခြား package managers တွေရဲ့ `run` commands တွေရဲ့ အပြုအမူတွေနဲ့ ကိုက်ညီဖို့ ရည်ရွယ်ထားတာ မဟုတ်ပါဘူး။ Node.js ရဲ့ implementation က — အသုံးအများဆုံး use cases တွေအတွက် ထိပ်တန်း စွမ်းဆောင်ရည်ကို အာရုံစိုက်ဖို့ — ရည်ရွယ်ချက်ရှိရှိ ပိုမို ကန့်သတ်ထားပါတယ်။ တခြား `run` implementations တွေရဲ့ ရည်ရွယ်ချက်ရှိရှိ ဖယ်ထုတ်ထားတဲ့ features တချို့ကတော့:

* သတ်မှတ်ထားတဲ့ script အပြင် `pre` သို့မဟုတ် `post` scripts တွေကို run လုပ်ခြင်း။
* Package manager တစ်ခုချင်းစီအတွက် သီးသန့်ဖြစ်တဲ့ environment variables တွေကို define လုပ်ခြင်း။

#### Environment variables (ပတ်ဝန်းကျင် ကိန်းရှင်များ)

`--run` နဲ့ script တစ်ခုကို run လုပ်တဲ့အခါ အောက်ပါ environment variables တွေကို သတ်မှတ်ပေးပါတယ်:

* `NODE_RUN_SCRIPT_NAME`: Run လုပ်နေတဲ့ script ရဲ့ အမည်ပါ။ ဥပမာ — `--run` ကို `test` run လုပ်ဖို့ သုံးရင် — ဒီ variable ရဲ့ တန်ဖိုးက `test` ဖြစ်ပါလိမ့်မယ်။
* `NODE_RUN_PACKAGE_JSON_PATH`: Process လုပ်ခံနေရတဲ့ `package.json` ဆီကို ညွှန်ပြတဲ့ path ပါ။

[`--env-file`][] နဲ့ file တစ်ခုကနေ load လုပ်ထားတဲ့ environment variables တွေက `--run` က လုပ်ဆောင်တဲ့ command အတွက် အသုံးပြုမှာ မဟုတ်ပါဘူး။

### `--secure-heap-min=n`

`--secure-heap` ကို သုံးတဲ့အခါ — `--secure-heap-min` flag က secure heap ကနေ ခွဲဝေသုံးစွဲမယ့် (allocate) အနည်းဆုံး ပမာဏကို သတ်မှတ်ပေးပါတယ်။ အနည်းဆုံး တန်ဖိုးက `2` ပါ။ အများဆုံး တန်ဖိုးကတော့ `--secure-heap` နဲ့ `2147483647` ထဲက ပိုငယ်တဲ့ဟာ ဖြစ်ပါတယ်။ ပေးလိုက်တဲ့ တန်ဖိုးက power of two (ဂဏန်း ၂ ၏ အဆ) တစ်ခု ဖြစ်ရပါမယ်။

### `--secure-heap=n`

OpenSSL ရဲ့ secure heap တစ်ခုကို `n` bytes နဲ့ initialize လုပ်ပါတယ်။ Initialize လုပ်ပြီးတာနဲ့ — key generation နဲ့ တခြား operations တွေအတွင်း OpenSSL ထဲမှာ — ရွေးချယ်ထားတဲ့ allocation အမျိုးအစားတွေအတွက် secure heap ကို သုံးပါတယ်။ ဥပမာ — pointer overruns (ပိုလျှံ ကျော်လွန်မှုများ) သို့မဟုတ် underruns (လိုတင်းမ လျော့နည်းမှုများ) တွေကြောင့် ထိခိုက်နိုင်တဲ့ (sensitive) အချက်အလက်တွေ ပေါက်ကြား (leak) မသွားအောင် တားဆီးဖို့ ဒါက အသုံးဝင်ပါတယ်။

Secure heap က ပုံသေ အရွယ်အစား ရှိပြီး — runtime မှာ အရွယ်အစား ပြန်လည် ချိန်ညှိလို့ မရတာမို့ — သုံးမယ်ဆိုရင် — application ရဲ့ အသုံးပြုမှု အားလုံးကို ဖုံးအုပ်နိုင်လောက်တဲ့ — လုံလောက်စွာ ကြီးမားတဲ့ heap တစ်ခုကို ရွေးချယ်ဖို့ အရေးကြီးပါတယ်။

ပေးလိုက်တဲ့ heap size က power of two (ဂဏန်း ၂ ၏ အဆ) ဖြစ်ရပါမယ်။ 2 ထက် ငယ်တဲ့ တန်ဖိုး မှန်သမျှက secure heap ကို disable လုပ်ပါလိမ့်မယ်။

Secure heap ကို default အနေနဲ့ disable ထားပါတယ်။

Secure heap က Windows မှာ မရနိုင်ပါဘူး။

နောက်ထပ် အသေးစိတ်တွေအတွက် [`CRYPTO_secure_malloc_init`][] ကို ကြည့်ပါ။

### `--snapshot-blob=path`

> Stability: 1 - Experimental

`--build-snapshot` နဲ့အတူ သုံးတဲ့အခါ — `--snapshot-blob` က ထုတ်လုပ်လိုက်တဲ့ snapshot blob ကို ရေးသားမယ့် path ကို သတ်မှတ်ပေးပါတယ်။ မသတ်မှတ်ထားရင် — ထုတ်လုပ်လိုက်တဲ့ blob ကို current working directory ထဲက `snapshot.blob` ဆီကို ရေးသားပါတယ်။

`--build-snapshot` မပါပဲ သုံးတဲ့အခါ — `--snapshot-blob` က application state ကို ပြန်လည် ရယူ (restore) ဖို့ သုံးတဲ့ blob ဆီကို ညွှန်ပြတဲ့ path ကို သတ်မှတ်ပေးပါတယ်။

Snapshot တစ်ခုကို load လုပ်တဲ့အခါ Node.js က အောက်ပါတို့ကို စစ်ဆေးပါတယ်:

1. လည်ပတ်နေတဲ့ Node.js binary ရဲ့ version, architecture နဲ့ platform တွေက snapshot ကို ထုတ်လုပ်တဲ့ binary ရဲ့ဟာနဲ့ အတိအကျ တူညီနေခြင်း။
2. V8 flags နဲ့ CPU features တွေက snapshot ကို ထုတ်လုပ်တဲ့ binary ရဲ့ဟာနဲ့ လိုက်ဖက်ညီနေခြင်း။

မကိုက်ညီဘူးဆိုရင် — Node.js က snapshot ကို load လုပ်ဖို့ ငြင်းဆန်ပြီး — status code 1 နဲ့ exit လုပ်ပါတယ်။

### `--test`

Node.js ရဲ့ command line test runner ကို စတင်ပါတယ်။ ဒီ flag ကို `--watch-path`, `--check`, `--eval`, `--interactive` သို့မဟုတ် inspector တို့နဲ့ တွဲသုံးလို့ မရပါဘူး။ နောက်ထပ် အသေးစိတ်တွေအတွက် [running tests from the command line][] ဆိုင်ရာ documentation ကို ကြည့်ပါ။

### `--test-concurrency`

Test runner CLI က တစ်ပြိုင်နက် (concurrently) လုပ်ဆောင်မယ့် test files တွေရဲ့ အများဆုံး အရေအတွက်ပါ။ `--test-isolation` ကို `'none'` အဖြစ် သတ်မှတ်ထားရင် — ဒီ flag ကို လျစ်လျူရှုပြီး — concurrency က တစ်ခု ဖြစ်ပါတယ်။ မဟုတ်ရင် concurrency က default အနေနဲ့ `os.availableParallelism() - 1` ဖြစ်ပါတယ်။

### `--test-coverage-branches=threshold`

> Stability: 1 - Experimental

ဖုံးအုပ်ထားတဲ့ (covered) branches တွေရဲ့ အနည်းဆုံး ရာခိုင်နှုန်း (percent) တစ်ခုကို လိုအပ်ပါတယ်။ Code coverage က သတ်မှတ်ထားတဲ့ threshold ကို မရောက်ရှိရင် — process က code `1` နဲ့ exit လုပ်ပါလိမ့်မယ်။

### `--test-coverage-exclude`

> Stability: 1 - Experimental

Glob pattern တစ်ခုကို သုံးပြီး — absolute ရော relative file paths တွေပါ ကိုက်ညီနိုင်တဲ့ — တိကျတဲ့ files တွေကို code coverage ကနေ ဖယ်ထုတ် (exclude) လုပ်ပါတယ်။

ဒီ option ကို glob patterns အများအပြား ဖယ်ထုတ်ဖို့ — အကြိမ်များစွာ သတ်မှတ်နိုင်ပါတယ်။

`--test-coverage-exclude` နဲ့ `--test-coverage-include` နှစ်ခုလုံးကို ပေးထားရင် — coverage report ထဲမှာ ပါဝင်ဖို့ — files တွေက သတ်မှတ်ချက် **နှစ်ခုလုံး** (both) ကို ပြည့်မီရပါမယ်။

Default အနေနဲ့ — ကိုက်ညီတဲ့ test files တွေ အားလုံးကို coverage report ကနေ ဖယ်ထုတ်ထားပါတယ်။ ဒီ option ကို သတ်မှတ်လိုက်တာက default အပြုအမူကို ကျော်လွှား (override) လုပ်ပါတယ်။

### `--test-coverage-functions=threshold`

> Stability: 1 - Experimental

ဖုံးအုပ်ထားတဲ့ (covered) functions တွေရဲ့ အနည်းဆုံး ရာခိုင်နှုန်း တစ်ခုကို လိုအပ်ပါတယ်။ Code coverage က သတ်မှတ်ထားတဲ့ threshold ကို မရောက်ရှိရင် — process က code `1` နဲ့ exit လုပ်ပါလိမ့်မယ်။

### `--test-coverage-include`

> Stability: 1 - Experimental

Glob pattern တစ်ခုကို သုံးပြီး — absolute ရော relative file paths တွေပါ ကိုက်ညီနိုင်တဲ့ — တိကျတဲ့ files တွေကို code coverage ထဲမှာ ထည့်သွင်း (include) လုပ်ပါတယ်။

ဒီ option ကို glob patterns အများအပြား ထည့်သွင်းဖို့ — အကြိမ်များစွာ သတ်မှတ်နိုင်ပါတယ်။

`--test-coverage-exclude` နဲ့ `--test-coverage-include` နှစ်ခုလုံးကို ပေးထားရင် — coverage report ထဲမှာ ပါဝင်ဖို့ — files တွေက သတ်မှတ်ချက် **နှစ်ခုလုံး** (both) ကို ပြည့်မီရပါမယ်။

### `--test-coverage-include-all`

> Stability: 1 - Experimental

Test run က ဘယ်တုန်းကမှ load မလုပ်ခဲ့တဲ့ source files တွေကို — coverage သုည ရှိတယ်လို့ အစီရင်ခံထားတဲ့အနေနဲ့ — coverage report ထဲမှာ ထည့်သွင်းပါတယ်။

Candidate files တွေကို current working directory ထဲမှာ ရှာဖွေပြီး — report ရဲ့ တခြားအစိတ်အပိုင်းတွေအတိုင်း — `--test-coverage-include` နဲ့ `--test-coverage-exclude` filtering တွေကို ခံယူရပါတယ်။

### `--test-coverage-lines=threshold`

> Stability: 1 - Experimental

ဖုံးအုပ်ထားတဲ့ (covered) lines တွေရဲ့ အနည်းဆုံး ရာခိုင်နှုန်း တစ်ခုကို လိုအပ်ပါတယ်။ Code coverage က သတ်မှတ်ထားတဲ့ threshold ကို မရောက်ရှိရင် — process က code `1` နဲ့ exit လုပ်ပါလိမ့်မယ်။

### `--test-force-exit`

သိထားတဲ့ tests တွေ အားလုံး လုပ်ဆောင်ပြီးသွားတာနဲ့ — event loop က မဟုတ်ရင် ဆက်လက် တက်ကြွ (active) နေဦးမယ်ဆိုရင်တောင် — process ကို exit လုပ်စေဖို့ test runner ကို configure လုပ်ပါတယ်။

### `--test-global-setup=module`

> Stability: 1.0 - Early development

Tests တွေ အားလုံး မလုပ်ဆောင်ခင် အကဲဖြတ် (evaluate) လုပ်ခံရမယ့် module တစ်ခုကို သတ်မှတ်ပါတယ် — ဒီ module ကို tests တွေအတွက် global state သို့မဟုတ် fixtures တွေ ပြင်ဆင် သတ်မှတ်ဖို့ သုံးနိုင်ပါတယ်။

နောက်ထပ် အသေးစိတ်တွေအတွက် [global setup and teardown][] ဆိုင်ရာ documentation ကို ကြည့်ပါ။

### `--test-isolation=mode`

Test runner ထဲမှာ သုံးတဲ့ test isolation (စမ်းသပ်မှု သီးခြားခွဲထားမှု) အမျိုးအစားကို configure လုပ်ပါတယ်။ `mode` က `'process'` ဖြစ်ရင် — test file တစ်ခုချင်းစီကို သီးခြား child process တစ်ခုထဲမှာ run လုပ်ပါတယ်။ `mode` က `'none'` ဖြစ်ရင် — test files တွေ အားလုံးကို test runner နဲ့အတူ process တစ်ခုတည်းထဲမှာ run လုပ်ပါတယ်။ Default isolation mode က `'process'` ပါ။ `--test` flag မရှိရင် ဒီ flag ကို လျစ်လျူရှုပါတယ်။ နောက်ထပ် အချက်အလက်တွေအတွက် [test runner execution model][] section ကို ကြည့်ပါ။

### `--test-name-pattern`

ပေးထားတဲ့ pattern နဲ့ အမည် ကိုက်ညီတဲ့ tests တွေကိုသာ လုပ်ဆောင်ဖို့ test runner ကို configure လုပ်တဲ့ regular expression တစ်ခုပါ။ နောက်ထပ် အသေးစိတ်တွေအတွက် [filtering tests by name][] ဆိုင်ရာ documentation ကို ကြည့်ပါ။

`--test-name-pattern` နဲ့ `--test-skip-pattern` နှစ်ခုလုံးကို ပေးထားရင် — လုပ်ဆောင်ခံရဖို့ tests တွေက လိုအပ်ချက် **နှစ်ခုလုံး** (both) ကို ပြည့်မီရပါမယ်။

### `--test-only`

`only` option သတ်မှတ်ထားတဲ့ top level tests တွေကိုသာ လုပ်ဆောင်ဖို့ test runner ကို configure လုပ်ပါတယ်။ Test isolation ကို disable လုပ်ထားရင် ဒီ flag က မလိုအပ်ပါဘူး။

### `--test-random-seed`

Test execution order (လုပ်ဆောင်မှု အစီအစဉ်) ကို randomize (ကျပန်း ပြောင်းလဲ) လုပ်ဖို့ သုံးတဲ့ seed ကို သတ်မှတ်ပါတယ်။ ဒါက test file တွေရဲ့ execution order ရော — file တစ်ခုချင်းစီအတွင်းက queue တင်ထားတဲ့ tests တွေကိုပါ သက်ရောက်ပါတယ်။ ဒီ flag ကို ပေးလိုက်တာက — `--test-randomize` မပါပဲနဲ့တောင် — randomization ကို သွယ်ဝိုက်၍ (implicitly) enable လုပ်ပါတယ်။

တန်ဖိုးက `0` နဲ့ `4294967295` ကြားက integer တစ်ခု ဖြစ်ရပါမယ်။

ဒီ flag ကို `--watch` သို့မဟုတ် `--test-rerun-failures` တို့နဲ့ တွဲသုံးလို့ မရပါဘူး။

### `--test-randomize`

Test execution order တွေကို randomize လုပ်ပါတယ်။ ဒါက test file တွေရဲ့ execution order ရော — file တစ်ခုချင်းစီအတွင်းက queue တင်ထားတဲ့ tests တွေကိုပါ သက်ရောက်ပါတယ်။ ဒါက shared state (မျှဝေထားတဲ့ state) သို့မဟုတ် execution order ပေါ်မှာ မှီခိုနေတဲ့ tests တွေကို ထောက်လှမ်းဖို့ အထောက်အကူ ပြုနိုင်ပါတယ်။

Randomization အတွက် သုံးတဲ့ seed ကို test summary ထဲမှာ print လုပ်ပြီး — `--test-random-seed` နဲ့ ပြန်လည် အသုံးပြုနိုင်ပါတယ်။

အသေးစိတ် အပြုအမူတွေနဲ့ ဥပမာတွေအတွက် [randomizing tests execution order][] ကို ကြည့်ပါ။

ဒီ flag ကို `--watch` သို့မဟုတ် `--test-rerun-failures` တို့နဲ့ တွဲသုံးလို့ မရပါဘူး။

### `--test-reporter`

Tests တွေ run လုပ်တဲ့အခါ သုံးမယ့် test reporter တစ်ခုပါ။ နောက်ထပ် အသေးစိတ်တွေအတွက် [test reporters][] ဆိုင်ရာ documentation ကို ကြည့်ပါ။

### `--test-reporter-destination`

သက်ဆိုင်ရာ test reporter အတွက် destination (ဦးတည်ရာ) ပါ။ နောက်ထပ် အသေးစိတ်တွေအတွက် [test reporters][] ဆိုင်ရာ documentation ကို ကြည့်ပါ။

### `--test-rerun-failures`

Test runner ကို run တစ်ခုနဲ့တစ်ခုကြားမှာ test suite ရဲ့ state ကို သိမ်းဆည်း (persist) လုပ်နိုင်စေတဲ့ file တစ်ခုဆီကို ညွှန်ပြတဲ့ path ပါ။ ဘယ် tests တွေ အောင်မြင်ပြီးသား သို့မဟုတ် မအောင်မြင်ပြီးသားဆိုတာကို ဆုံးဖြတ်ဖို့ test runner က ဒီ file ကို သုံးပြီး — test suite တစ်ခုလုံးကို ပြန်လည် run စရာမလိုပဲ — မအောင်မြင်ခဲ့တဲ့ tests တွေကို ပြန်လည် run လုပ်နိုင်စေပါတယ်။ File မရှိသေးရင် test runner က ဒီ file ကို ဖန်တီးပေးပါလိမ့်မယ်။ နောက်ထပ် အသေးစိတ်တွေအတွက် [test reruns][] ဆိုင်ရာ documentation ကို ကြည့်ပါ။

### `--test-shard`

`<index>/<total>` ပုံစံနဲ့ လုပ်ဆောင်ရမယ့် test suite shard (အပိုင်းခွဲ) တစ်ခုပါ — အဲဒီမှာ:

* `index` — ပိုင်းခြားထားတဲ့ အပိုင်းတွေထဲက index ကို ကိုယ်စားပြုတဲ့ positive integer တစ်ခုပါ။
* `total` — ပိုင်းခြားထားတဲ့ အပိုင်း စုစုပေါင်း အရေအတွက်ကို ကိုယ်စားပြုတဲ့ positive integer တစ်ခုပါ။

ဒီ command က test files တွေ အားလုံးကို `total` ညီတူညီတူ အပိုင်းတွေအဖြစ် ပိုင်းခြားပြီး — `index` အပိုင်းထဲမှာ ရောက်နေတဲ့ဟာတွေကိုသာ run လုပ်ပါလိမ့်မယ်။

ဥပမာ — သင့် test suite ကို အပိုင်းသုံးပိုင်း ခွဲဖို့ အောက်ပါအတိုင်း သုံးပါ:

```bash
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
```

### `--test-skip-pattern`

ပေးထားတဲ့ pattern နဲ့ အမည် ကိုက်ညီတဲ့ tests တွေကို ကျော်လိုက်ဖို့ test runner ကို configure လုပ်တဲ့ regular expression တစ်ခုပါ။ နောက်ထပ် အသေးစိတ်တွေအတွက် [filtering tests by name][] ဆိုင်ရာ documentation ကို ကြည့်ပါ။

`--test-name-pattern` နဲ့ `--test-skip-pattern` နှစ်ခုလုံးကို ပေးထားရင် — လုပ်ဆောင်ခံရဖို့ tests တွေက လိုအပ်ချက် **နှစ်ခုလုံး** (both) ကို ပြည့်မီရပါမယ်။

### `--test-timeout`

Test execution က ကြာမြင့်သွားရင် fail ဖြစ်မယ့် milliseconds အရေအတွက်ပါ။ သတ်မှတ်မထားရင် — subtests တွေက ဒီတန်ဖိုးကို ၎င်းတို့ရဲ့ parent ကနေ အမွေဆက်ခံပါတယ်။ Default တန်ဖိုးက `Infinity` ပါ။

### `--test-update-snapshots`

Test runner က [snapshot testing][] အတွက် သုံးတဲ့ snapshot files တွေကို ပြန်လည် ထုတ်လုပ်ပါတယ်။

### `--throw-deprecation`

Deprecations တွေအတွက် errors တွေကို throw လုပ်ပါတယ်။

### `--title=title`

စတင်ချိန်မှာ `process.title` ကို သတ်မှတ်ပါတယ်။

### `--tls-cipher-list=list`

အစားထိုး (alternative) default TLS cipher list တစ်ခုကို သတ်မှတ်ပါတယ်။ Node.js ကို crypto support (default) နဲ့ build လုပ်ထားဖို့ လိုအပ်ပါတယ်။

### `--tls-keylog=file`

TLS key material (သော့ချက် အချက်အလက်) တွေကို file တစ်ခုထဲမှာ log လုပ်ပါတယ်။ Key material က NSS ရဲ့ `SSLKEYLOGFILE` format နဲ့ ဖြစ်ပြီး — TLS traffic တွေကို decrypt လုပ်ဖို့ (Wireshark လိုမျိုး) software တွေက သုံးနိုင်ပါတယ်။

### `--tls-max-v1.2`

[`tls.DEFAULT_MAX_VERSION`][] ကို 'TLSv1.2' အဖြစ် သတ်မှတ်ပါတယ်။ TLSv1.3 အတွက် support ကို ပိတ်ထားဖို့ သုံးပါတယ်။

### `--tls-max-v1.3`

Default [`tls.DEFAULT_MAX_VERSION`][] ကို 'TLSv1.3' အဖြစ် သတ်မှတ်ပါတယ်။ TLSv1.3 အတွက် support ကို ဖွင့်ဖို့ သုံးပါတယ်။

### `--tls-min-v1.0`

Default [`tls.DEFAULT_MIN_VERSION`][] ကို 'TLSv1' အဖြစ် သတ်မှတ်ပါတယ်။ ဟောင်းနွမ်းတဲ့ TLS clients သို့မဟုတ် servers တွေနဲ့ လိုက်ဖက်ညီမှု အတွက် သုံးပါတယ်။

### `--tls-min-v1.1`

Default [`tls.DEFAULT_MIN_VERSION`][] ကို 'TLSv1.1' အဖြစ် သတ်မှတ်ပါတယ်။ ဟောင်းနွမ်းတဲ့ TLS clients သို့မဟုတ် servers တွေနဲ့ လိုက်ဖက်ညီမှု အတွက် သုံးပါတယ်။

### `--tls-min-v1.2`

Default [`tls.DEFAULT_MIN_VERSION`][] ကို 'TLSv1.2' အဖြစ် သတ်မှတ်ပါတယ်။ ဒါက 12.x နဲ့ ၎င်းနောက်ပိုင်း versions တွေအတွက် default ဖြစ်ပေမယ့် — ဒီ option ကို ဟောင်းနွမ်းတဲ့ Node.js versions တွေနဲ့ လိုက်ဖက်ညီမှု အတွက် support လုပ်ပေးထားပါတယ်။

### `--tls-min-v1.3`

Default [`tls.DEFAULT_MIN_VERSION`][] ကို 'TLSv1.3' အဖြစ် သတ်မှတ်ပါတယ်။ TLSv1.3 လောက် မလုံခြုံတဲ့ TLSv1.2 အတွက် support ကို ပိတ်ဖို့ သုံးပါတယ်။

### `--trace-deprecation`

Deprecations တွေအတွက် stack traces တွေကို print လုပ်ပါတယ်။

### `--trace-env`

လက်ရှိ Node.js instance ထဲမှာ environment variables တွေကို access လုပ်မှု တစ်ခုခုအကြောင်း အချက်အလက်တွေကို stderr ဆီကို print လုပ်ပါတယ် — အောက်ပါတို့ အပါအဝင်:

* Node.js က အတွင်းပိုင်းမှာ လုပ်တဲ့ environment variable reads တွေ။
* `process.env.KEY = "SOME VALUE"` ပုံစံနဲ့ ရေးသားမှုတွေ (writes)။
* `process.env.KEY` ပုံစံနဲ့ ဖတ်ရှုမှုတွေ (reads)။
* `Object.defineProperty(process.env, 'KEY', {...})` ပုံစံနဲ့ define လုပ်မှုတွေ။
* `Object.hasOwn(process.env, 'KEY')`, `process.env.hasOwnProperty('KEY')` သို့မဟုတ် `'KEY' in process.env` ပုံစံနဲ့ စစ်ဆေး မေးမြန်းမှုတွေ (queries)။
* `delete process.env.KEY` ပုံစံနဲ့ ဖျက်ခြင်းတွေ (deletions)။
* `...process.env` သို့မဟုတ် `Object.keys(process.env)` ပုံစံနဲ့ enumeration (စာရင်းကောက်ယူခြင်း) တွေ။

Access လုပ်ခံရတဲ့ environment variables တွေရဲ့ အမည်တွေကိုသာ print လုပ်ပါတယ်။ Values တွေကို print လုပ်မှာ မဟုတ်ပါဘူး။

Access ရဲ့ stack trace ကို print လုပ်ချင်ရင် — `--trace-env-js-stack` နဲ့/သို့မဟုတ် `--trace-env-native-stack` ကို သုံးပါ။

### `--trace-env-js-stack`

`--trace-env` က လုပ်တာတွေအပြင် — ဒါက access ရဲ့ JavaScript stack trace ကိုပါ print လုပ်ပါတယ်။

### `--trace-env-native-stack`

`--trace-env` က လုပ်တာတွေအပြင် — ဒါက access ရဲ့ native stack trace ကိုပါ print လုပ်ပါတယ်။

### `--trace-event-categories`

`--trace-events-enabled` ကို သုံးပြီး trace event tracing ကို enable လုပ်ထားတဲ့အခါ — trace လုပ်သင့်တဲ့ categories တွေရဲ့ comma နဲ့ ခွဲခြားထားတဲ့ စာရင်းတစ်ခုပါ။

### `--trace-event-file-pattern`

Trace event data အတွက် filepath ကို သတ်မှတ်ပေးတဲ့ template string တစ်ခုပါ — ၎င်းက `${rotation}` နဲ့ `${pid}` တွေကို support လုပ်ပါတယ်။

### `--trace-events-enabled`

Trace event tracing information တွေရဲ့ စုဆောင်းမှု (collection) ကို enable လုပ်ပါတယ်။

### `--trace-exit`

Environment တစ်ခုကို တက်ကြွစွာ (proactively) exit လုပ်တဲ့အခါတိုင်း — ဆိုလိုတာက `process.exit()` ကို ခေါ်တဲ့အခါ — stack trace တစ်ခုကို print လုပ်ပါတယ်။

### `--trace-require-module=mode`

[Loading ECMAScript modules using `require()`][] ရဲ့ အသုံးပြုမှုအကြောင်း အချက်အလက်တွေကို print လုပ်ပါတယ်။

`mode` က `all` ဖြစ်ရင် — အသုံးပြုမှု အားလုံးကို print လုပ်ပါတယ်။ `mode` က `no-node-modules` ဖြစ်ရင် — `node_modules` folder ကနေ ဖြစ်တဲ့ အသုံးပြုမှုတွေကို ဖယ်ထုတ်ပါတယ်။

### `--trace-sigint`

SIGINT ပေါ်မှာ stack trace တစ်ခုကို print လုပ်ပါတယ်။

### `--trace-sync-io`

Event loop ရဲ့ ပထမဆုံး turn ပြီးနောက်မှာ synchronous I/O ကို ထောက်လှမ်းမိတိုင်း — stack trace တစ်ခုကို print လုပ်ပါတယ်။

### `--trace-tls`

TLS packet trace information တွေကို `stderr` ဆီကို print လုပ်ပါတယ်။ ဒါကို TLS connection ပြဿနာတွေကို debug လုပ်ဖို့ သုံးနိုင်ပါတယ်။

### `--trace-uncaught`

Uncaught exceptions တွေအတွက် stack traces တွေကို print လုပ်ပါတယ်။ ပုံမှန်အားဖြင့် — `Error` တစ်ခုကို ဖန်တီးမှုနဲ့ ဆက်စပ်တဲ့ stack trace ကိုသာ print လုပ်ပြီး — ဒါက value ကို throw လုပ်မှုနဲ့ ဆက်စပ်တဲ့ stack trace ကိုပါ (အဲဒီ value က `Error` instance တစ်ခု ဖြစ်စရာ မလိုပါဘူး) print လုပ်စေပါတယ်။

ဒီ option ကို enable လုပ်တာက garbage collection ရဲ့ အပြုအမူကို ဆိုးရွားစွာ သက်ရောက်မှု ရှိနိုင်ပါတယ်။

### `--trace-warnings`

Process warnings တွေ (deprecations အပါအဝင်) အတွက် stack traces တွေကို print လုပ်ပါတယ်။

### `--track-heap-objects`

Heap snapshots တွေအတွက် heap object allocations တွေကို ခြေရာခံ (track) လုပ်ပါတယ်။

### `--unhandled-rejections=mode`

ဒီ flag ကို သုံးတာက — unhandled rejection တစ်ခု ဖြစ်ပွားတဲ့အခါ ဘာဖြစ်သင့်လဲဆိုတာကို ပြောင်းလဲနိုင်စေပါတယ်။ အောက်ပါ modes တွေထဲက တစ်ခုကို ရွေးချယ်နိုင်ပါတယ်:

* `throw`: [`unhandledRejection`][] ကို emit လုပ်ပါတယ်။ ဒီ hook ကို သတ်မှတ်မထားရင် — unhandled rejection ကို uncaught exception တစ်ခုအနေနဲ့ မြှင့်တင် (raise) လုပ်ပါတယ်။ ဒါက default ပါ။
* `strict`: Unhandled rejection ကို uncaught exception တစ်ခုအနေနဲ့ မြှင့်တင် လုပ်ပါတယ်။ Exception ကို ကိုင်တွယ်လိုက်ရင် — [`unhandledRejection`][] ကို emit လုပ်ပါတယ်။
* `warn`: [`unhandledRejection`][] hook ကို သတ်မှတ်ထား မထား — အမြဲတမ်း warning တစ်ခုကို trigger လုပ်ပေမယ့် — deprecation warning ကိုတော့ print မလုပ်ပါဘူး။
* `warn-with-error-code`: [`unhandledRejection`][] ကို emit လုပ်ပါတယ်။ ဒီ hook ကို သတ်မှတ်မထားရင် — warning တစ်ခုကို trigger လုပ်ပြီး — process ရဲ့ exit code ကို 1 အဖြစ် သတ်မှတ်ပါတယ်။
* `none`: Warnings တွေ အားလုံးကို တိတ်ဆိတ်စေပါတယ်။

Command line entry point ရဲ့ ES module static loading phase အတွင်းမှာ rejection တစ်ခု ဖြစ်ပွားခဲ့ရင် — ၎င်းကို uncaught exception တစ်ခုအနေနဲ့ အမြဲတမ်း မြှင့်တင် လုပ်ပါလိမ့်မယ်။

### `--use-bundled-ca`, `--use-openssl-ca`

လက်ရှိ Node.js version က ပံ့ပိုးပေးတဲ့ bundled Mozilla CA store ကို သုံးပါ — သို့မဟုတ် — OpenSSL ရဲ့ default CA store ကို သုံးပါ။ Default store ကို build-time မှာ ရွေးချယ်နိုင်ပါတယ်။

Node.js က ပံ့ပိုးပေးတဲ့ bundled CA store က — release လုပ်ချိန်မှာ ပုံသေ သတ်မှတ်ထားတဲ့ Mozilla CA store ရဲ့ snapshot တစ်ခုပါ။ ၎င်းက support လုပ်ထားတဲ့ platform တွေ အားလုံးပေါ်မှာ ထပ်တူညီတူ ဖြစ်ပါတယ်။

OpenSSL store ကို သုံးတာက store ကို ပြင်ပကနေ ပြုပြင်မွမ်းမံနိုင်စေပါတယ်။ Linux နဲ့ BSD distributions အများစုမှာ — ဒီ store ကို distribution ရဲ့ maintainers (ထိန်းသိမ်းသူများ) နဲ့ system administrators တွေက ထိန်းသိမ်းပါတယ်။ OpenSSL CA store ရဲ့ တည်နေရာက OpenSSL library ရဲ့ configuration အပေါ် မူတည်ပေမယ့် — environment variables တွေကို သုံးပြီး runtime မှာ ပြောင်းလဲနိုင်ပါတယ်။

`SSL_CERT_DIR` နဲ့ `SSL_CERT_FILE` တို့ကို ကြည့်ပါ။

### `--use-env-proxy`

> Stability: 1.1 - Active Development

Enable လုပ်ထားရင် — Node.js က startup ကာလအတွင်းမှာ `HTTP_PROXY`, `HTTPS_PROXY` နဲ့ `NO_PROXY` environment variables တွေကို parse လုပ်ပြီး — requests တွေကို သတ်မှတ်ထားတဲ့ proxy ကနေတစ်ဆင့် လမ်းကြောင်း (route) လွှဲပေးပါတယ်။

ဒါကို deployment အတွက် ယုံကြည်ရပြီး ခွင့်ပြုချက် ရှိတဲ့ proxies တွေနဲ့သာ သုံးပါ။ Proxy support က — ဥပမာ firewall တစ်ခုက proxy တစ်ခု လိုအပ်တဲ့အခါမျိုးမှာ — ခွင့်ပြုထားတဲ့ proxy servers တွေကနေတစ်ဆင့် external networks တွေဆီ ရောက်ရှိဖို့ ရည်ရွယ်ထားတာပါ။ Traffic တွေကို ဖုံးကွယ်ဖို့ သို့မဟုတ် network policy တွေကို ရှောင်တိမ်းဖို့ မဟုတ်ပါဘူး။ [Built-in Proxy Support][] ကို ကြည့်ပါ။

ဒါက [`NODE_USE_ENV_PROXY=1`][] environment variable ကို သတ်မှတ်တာနဲ့ ညီမျှပါတယ်။ နှစ်ခုလုံး သတ်မှတ်ထားရင် — `--use-env-proxy` က ဦးစားပေး ရရှိပါတယ်။

### `--use-largepages=mode`

စတင်ချိန်မှာ Node.js ရဲ့ static code ကို large memory pages (ကြီးမားသော memory pages) တွေဆီကို ပြန်လည် map လုပ်ပါတယ်။ Target system မှာ support လုပ်ရင် — ဒါက Node.js static code ကို 4 KiB pages တွေအစား 2 MiB pages တွေဆီကို ရွှေ့ပြောင်းစေပါလိမ့်မယ်။

`mode` အတွက် အောက်ပါ တန်ဖိုးတွေ မှန်ကန်ပါတယ်:

* `off`: Mapping လုပ်ဖို့ ကြိုးစားမှာ မဟုတ်ပါဘူး။ ဒါက default ပါ။
* `on`: OS က support လုပ်ရင် — mapping လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ Map လုပ်ဖို့ မအောင်မြင်ရင် လျစ်လျူရှုပြီး — standard error ဆီကို message တစ်ခု print လုပ်ပါလိမ့်မယ်။
* `silent`: OS က support လုပ်ရင် — mapping လုပ်ဖို့ ကြိုးစားပါလိမ့်မယ်။ Map လုပ်ဖို့ မအောင်မြင်ရင် လျစ်လျူရှုပြီး — အစီရင်ခံမှာ မဟုတ်ပါဘူး။

### `--use-system-ca`

Node.js က system store ထဲမှာ ရှိတဲ့ trusted CA certificates တွေကို — `--use-bundled-ca` option နဲ့ `NODE_EXTRA_CA_CERTS` environment variable တို့နဲ့အတူ — အသုံးပြုပါတယ်။ Windows နဲ့ macOS ကလွဲပြီး တခြား platform တွေမှာ — ဒါက `--use-openssl-ca` နဲ့ ဆင်တူစွာ — OpenSSL က ယုံကြည်ထားတဲ့ directory နဲ့ file ကနေ certificates တွေကို load လုပ်ပေမယ့် — ကွာခြားချက်က — ပထမဆုံး load လုပ်ပြီးနောက်မှာ certificates တွေကို cache လုပ်ထားတာ ဖြစ်ပါတယ်။

Windows နဲ့ macOS တွေမှာ — certificate trust policy က [Chromium's policy for locally trusted certificates][] နဲ့ ဆင်တူပေမယ့် — ကွာခြားချက်တချို့ ရှိပါတယ်:

macOS မှာ အောက်ပါ settings တွေကို လေးစား လိုက်နာပါတယ်:

* Default and System Keychains
  * Trust:
    * "When using this certificate" flag ကို "Always Trust" အဖြစ် သတ်မှတ်ထားတဲ့ certificate မှန်သမျှ၊ သို့မဟုတ်
    * "Secure Sockets Layer (SSL)" flag ကို "Always Trust" အဖြစ် သတ်မှတ်ထားတဲ့ certificate မှန်သမျှ။
  * Certificate က "X.509 Basic Policy" ကို "Always Trust" အဖြစ် သတ်မှတ်ထားပြီး — တရားဝင် (valid) လည်း ဖြစ်ရပါမယ်။

Windows မှာ အောက်ပါ settings တွေကို လေးစား လိုက်နာပါတယ်:

* Local Machine (`certlm.msc` ကနေတစ်ဆင့် ဝင်ရောက်သည်)
  * Trust:
    * Trusted Root Certification Authorities
    * Trusted People
    * Enterprise Trust -> Enterprise -> Trusted Root Certification Authorities
    * Enterprise Trust -> Enterprise -> Trusted People
    * Enterprise Trust -> Group Policy -> Trusted Root Certification Authorities
    * Enterprise Trust -> Group Policy -> Trusted People
* Current User (`certmgr.msc` ကနေတစ်ဆင့် ဝင်ရောက်သည်)
  * Trust:
    * Trusted Root Certification Authorities
    * Enterprise Trust -> Group Policy -> Trusted Root Certification Authorities

Windows နဲ့ macOS တွေမှာ — Node.js က trusted certificates တွေအတွက် user settings တွေက TLS server authentication (server စစ်ဆေး အတည်ပြုမှု) အတွက် ၎င်းတို့ကို တားမြစ်မထားဘူးဆိုတာကို — မသုံးခင် — စစ်ဆေးပါတယ်။

Node.js က လက်ရှိမှာ — system settings တွေအပေါ် အခြေခံပြီး — တခြား source တစ်ခုကနေ ရလာတဲ့ certificates တွေကို distrust (မယုံကြည်) လုပ်ခြင်း/revocation (ပယ်ဖျက်ခြင်း) တွေကို support မလုပ်ပါဘူး။

တခြား systems တွေမှာ — Node.js က default certificate file (ပုံမှန်အားဖြင့် `/etc/ssl/cert.pem`) နဲ့ default certificate directory (ပုံမှန်အားဖြင့် `/etc/ssl/certs`) — Node.js က link လုပ်ထားတဲ့ OpenSSL version က လေးစား လိုက်နာတဲ့နေရာတွေ — ကနေ certificates တွေကို load လုပ်ပါတယ်။ ဒါက အဓိက Linux distributions တွေနဲ့ တခြား Unix-like systems တွေရဲ့ စံနှုန်း (convention) တွေနဲ့ ပုံမှန်အားဖြင့် အလုပ်လုပ်ပါတယ်။ Override လုပ်တဲ့ OpenSSL environment variables တွေ (Node.js က link လုပ်ထားတဲ့ OpenSSL ရဲ့ configuration အပေါ် မူတည်ပြီး ပုံမှန်အားဖြင့် `SSL_CERT_FILE` နဲ့ `SSL_CERT_DIR`) ကို သတ်မှတ်ထားရင် — အဲဒီအစား သတ်မှတ်ထားတဲ့ paths တွေကို သုံးပြီး certificates တွေကို load လုပ်ပါလိမ့်မယ်။ Node.js က link လုပ်ထားတဲ့ OpenSSL version က သုံးတဲ့ စံနှုန်း paths တွေက — တစ်နည်းနည်းနဲ့ — users တွေရဲ့ system configuration နဲ့ မကိုက်ညီဘူးဆိုရင် — ဒီ environment variables တွေကို ဖြေရှင်းနည်း (workaround) တစ်ခုအနေနဲ့ သုံးနိုင်ပါတယ်။

### `--v8-options`

V8 command-line options တွေကို print လုပ်ပါတယ်။

### `--v8-pool-size=num`

Background jobs တွေကို allocate လုပ်ဖို့ သုံးမယ့် V8 ရဲ့ thread pool size ကို သတ်မှတ်ပါတယ်။

`0` အဖြစ် သတ်မှတ်ထားရင် — Node.js က parallelism ပမာဏရဲ့ ခန့်မှန်းချက်တစ်ခုအပေါ် အခြေခံပြီး — thread pool ရဲ့ သင့်လျော်တဲ့ အရွယ်အစားတစ်ခုကို ရွေးချယ်ပါလိမ့်မယ်။

Parallelism ပမာဏ ဆိုတာက — ပေးထားတဲ့ machine တစ်ခုမှာ တစ်ပြိုင်နက် လုပ်ဆောင်နိုင်တဲ့ computations (တွက်ချက်မှုများ) အရေအတွက်ကို ရည်ညွှန်းပါတယ်။ ယေဘုယျအားဖြင့် — CPUs အရေအတွက်နဲ့ အတူတူပဲ ဖြစ်ပေမယ့် — VMs သို့မဟုတ် containers လိုမျိုး environments တွေမှာတော့ ကွဲပြားသွားနိုင်ပါတယ်။

### `-v`, `--version`

Node ရဲ့ version ကို print လုပ်ပါတယ်။

### `--watch`

Node.js ကို watch mode နဲ့ စတင်ပါတယ်။ Watch mode မှာ — watch လုပ်ထားတဲ့ files တွေထဲမှာ ပြောင်းလဲမှုတွေ ဖြစ်တဲ့အခါ — Node.js process က ပြန်လည် စတင်ပါတယ်။ Default အနေနဲ့ — watch mode က entry point နဲ့ required သို့မဟုတ် imported လုပ်ထားတဲ့ module တွေ အားလုံးကို watch လုပ်ပါတယ်။ ဘယ် paths တွေကို watch လုပ်မယ်ဆိုတာ သတ်မှတ်ဖို့ `--watch-path` ကို သုံးပါ။

ဒီ flag ကို `--check`, `--eval`, `--interactive` သို့မဟုတ် REPL တို့နဲ့ တွဲသုံးလို့ မရပါဘူး။

မှတ်ချက်: `--watch` flag က argument တစ်ခုအနေနဲ့ file path တစ်ခု လိုအပ်ပြီး — `--run` က ဦးစားပေး ရရှိကာ watch mode ကို လျစ်လျူရှုတာမို့ — `--run` သို့မဟုတ် inline script input တွေနဲ့ မလိုက်ဖက်ပါဘူး။ File တစ်ခုမှ မပေးထားရင် — Node.js က status code `9` နဲ့ exit လုပ်ပါလိမ့်မယ်။

```bash
node --watch index.js
```

### `--watch-kill-signal`

> Stability: 1.1 - Active Development

Watch mode ပြန်လည် စတင်မှုတွေမှာ process ဆီကို ပို့လွှတ်တဲ့ signal ကို စိတ်ကြိုက် ပြင်ဆင် သတ်မှတ်ပါတယ်။

```bash
node --watch --watch-kill-signal SIGINT test.js
```

### `--watch-path`

Node.js ကို watch mode နဲ့ စတင်ပြီး — ဘယ် paths တွေကို watch လုပ်မယ်ဆိုတာ သတ်မှတ်ပါတယ်။ Watch mode မှာ — watch လုပ်ထားတဲ့ paths တွေထဲမှာ ပြောင်းလဲမှုတွေ ဖြစ်တဲ့အခါ — Node.js process က ပြန်လည် စတင်ပါတယ်။ ဒါက `--watch` နဲ့ တွဲသုံးထားရင်တောင် — required သို့မဟုတ် imported modules တွေကို watch လုပ်တာကို ပိတ်ပစ်ပါလိမ့်မယ်။

ဒီ flag ကို `--check`, `--eval`, `--interactive`, `--test` သို့မဟုတ် REPL တို့နဲ့ တွဲသုံးလို့ မရပါဘူး။

မှတ်ချက်: `--watch-path` ကို သုံးတာက `--watch` ကို သွယ်ဝိုက်၍ enable လုပ်ပါတယ် — အဲဒါက file path တစ်ခု လိုအပ်ပြီး — `--run` က ဦးစားပေး ရရှိကာ watch mode ကို လျစ်လျူရှုတာမို့ — `--run` နဲ့ မလိုက်ဖက်ပါဘူး။

```bash
node --watch-path=./src --watch-path=./tests index.js
```

ဒီ option ကို macOS နဲ့ Windows တွေမှာသာ support လုပ်ပါတယ်။ Support မလုပ်တဲ့ platform တစ်ခုပေါ်မှာ ဒီ option ကို သုံးလိုက်ရင် — `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` exception တစ်ခုကို throw လုပ်ပါလိမ့်မယ်။

### `--watch-preserve-output`

Watch mode က process ကို ပြန်လည် စတင်တဲ့အခါ — console ကို ရှင်းလင်းပစ်တာကို ပိတ်ထားပါတယ်။

```bash
node --watch --watch-preserve-output test.js
```

### `--zero-fill-buffers`

အသစ် allocate လုပ်လိုက်တဲ့ [`Buffer`][] instances တွေ အားလုံးကို zero နဲ့ အလိုအလျောက် ဖြည့်သွင်းပေးပါတယ်။

## Environment variables (ပတ်ဝန်းကျင် ကိန်းရှင်များ)

> Stability: 2 - Stable

### `FORCE_COLOR=[1, 2, 3]`

`FORCE_COLOR` environment variable ကို ANSI နဲ့ အရောင်ခြယ်ထားတဲ့ (colorized) output ကို enable လုပ်ဖို့ သုံးပါတယ်။ တန်ဖိုးက အောက်ပါအတိုင်း ဖြစ်နိုင်ပါတယ်:

* `1`, `true` သို့မဟုတ် ဗလာ string `''` — 16-color support ကို ဖော်ပြပါတယ်၊
* `2` — 256-color support ကို ဖော်ပြဖို့ ဖြစ်ပြီး၊
* `3` — 16 million-color (အရောင် ၁၆ သန်း) support ကို ဖော်ပြဖို့ ဖြစ်ပါတယ်။

`FORCE_COLOR` ကို support လုပ်တဲ့ တန်ဖိုးတစ်ခုနဲ့ သုံးထားရင် — `NO_COLOR` နဲ့ `NODE_DISABLE_COLORS` environment variables နှစ်ခုလုံးကို လျစ်လျူရှုပါတယ်။

တခြား တန်ဖိုး မှန်သမျှက colorized output ကို disable ဖြစ်စေပါလိမ့်မယ်။

### `NODE_COMPILE_CACHE=dir`

Node.js instance အတွက် [module compile cache][] ကို enable လုပ်ပါတယ်။ အသေးစိတ်တွေအတွက် [module compile cache][] ရဲ့ documentation ကို ကြည့်ပါ။

### `NODE_COMPILE_CACHE_PORTABLE=1`

1 အဖြစ် သတ်မှတ်ထားရင် — [module compile cache][] ကို — cache directory နဲ့ ဆက်စပ်တဲ့ module layout က အတူတူ ရှိနေသရွေ့ — directory နေရာ အမျိုးမျိုးကြားမှာ ပြန်လည် အသုံးပြုနိုင်ပြီး — user တစ်ယောက်ယောက်ကလည်း သုံးနိုင်ပါတယ် (cache subdirectory ကို ဖန်တီးတဲ့ user ရဲ့ uid နဲ့ suffix လုပ်မထားပါဘူး)။

### `NODE_COMPILE_CACHE_READONLY=1`

1 အဖြစ် သတ်မှတ်ထားရင် — [module compile cache][] က ၎င်းရဲ့ directory ကနေ ရှိပြီးသား entries တွေကိုသာ ဖတ်ပါတယ်: ၎င်းထဲကို ဘာမှ ရေးသားမှာ မဟုတ်ပဲ — မရှိရင်လည်း ဖန်တီးမပေးပါဘူး။

### `NODE_DEBUG=module[,…]`

Debug information တွေ print လုပ်သင့်တဲ့ core modules တွေရဲ့ `','` နဲ့ ခွဲခြားထားတဲ့ စာရင်းတစ်ခုပါ။

### `NODE_DEBUG_NATIVE=module[,…]`

Debug information တွေ print လုပ်သင့်တဲ့ core C++ modules တွေရဲ့ `','` နဲ့ ခွဲခြားထားတဲ့ စာရင်းတစ်ခုပါ။

### `NODE_DISABLE_COLORS=1`

သတ်မှတ်ထားရင် — REPL ထဲမှာ colors တွေကို သုံးမှာ မဟုတ်ပါဘူး။

### `NODE_DISABLE_COMPILE_CACHE=1`

> Stability: 1.1 - Active Development

Node.js instance အတွက် [module compile cache][] ကို disable လုပ်ပါတယ်။ အသေးစိတ်တွေအတွက် [module compile cache][] ရဲ့ documentation ကို ကြည့်ပါ။

### `NODE_EXTRA_CA_CERTS=file`

သတ်မှတ်ထားရင် — လူသိများတဲ့ "root" CAs တွေ (VeriSign လိုမျိုး) ကို `file` ထဲက ထပ်ဆောင်း certificates တွေနဲ့ တိုးချဲ့ပါလိမ့်မယ်။ File ထဲမှာ PEM format နဲ့ ယုံကြည်ရတဲ့ certificate တစ်ခု သို့မဟုတ် တစ်ခုထက်ပိုတာ ပါဝင်သင့်ပါတယ်။ File က ပျောက်ဆုံးနေရင် သို့မဟုတ် ပုံပျက် (malformed) နေရင် — [`process.emitWarning()`][emit_warning] နဲ့ message တစ်ခုကို (တစ်ကြိမ်) emit လုပ်ပါလိမ့်မယ် — ဒါပေမယ့် တခြား errors တွေကိုတော့ လျစ်လျူရှုပါတယ်။

TLS သို့မဟုတ် HTTPS client/server တစ်ခုအတွက် `ca` options property ကို တိုက်ရိုက် သတ်မှတ်ထားရင် — well known ရော extra certificates တွေပါ သုံးမှာ မဟုတ်ပါဘူး။

`node` က setuid root အနေနဲ့ run နေရင် သို့မဟုတ် Linux file capabilities သတ်မှတ်ထားရင် — ဒီ environment variable ကို လျစ်လျူရှုပါတယ်။

`NODE_EXTRA_CA_CERTS` environment variable ကို Node.js process ကို ပထမဆုံး စတင်လိုက်တဲ့အခါမှသာ ဖတ်ပါတယ်။ Runtime မှာ `process.env.NODE_EXTRA_CA_CERTS` ကို သုံးပြီး တန်ဖိုး ပြောင်းလဲတာက လက်ရှိ process ပေါ်မှာ သက်ရောက်မှု မရှိပါဘူး။

### `NODE_ICU_DATA=file`

ICU (`Intl` object) data အတွက် data path ပါ။ Small-icu support နဲ့ compile လုပ်ထားရင် — link လုပ်ထားပြီးသား data ကို တိုးချဲ့ပေးပါလိမ့်မယ်။

### `NODE_NO_WARNINGS=1`

`1` အဖြစ် သတ်မှတ်ထားရင် — process warnings တွေကို တိတ်ဆိတ်စေပါတယ်။

### `NODE_OPTIONS=options...`

Space နဲ့ ခွဲခြားထားတဲ့ command-line options တွေရဲ့ စာရင်းတစ်ခုပါ။ `options...` တွေကို command-line options တွေထက် အရင်ဦး အနက်ဖွင့် (interpret) လုပ်တာမို့ — command-line options တွေက `options...` ထဲက အရာတွေကို override လုပ်နိုင်သလို — ၎င်းတို့ရဲ့ နောက်မှာ ထပ်ပေါင်း ပေါင်းစပ်သွားနိုင်ပါတယ်။ Environment ထဲမှာ ခွင့်မပြုထားတဲ့ option တစ်ခုကို သုံးရင် — `-p` သို့မဟုတ် script file တစ်ခုလိုမျိုး — Node.js က error တစ်ခုနဲ့ exit လုပ်ပါလိမ့်မယ်။

Option တစ်ခုရဲ့ တန်ဖိုးထဲမှာ space တစ်ခု ပါဝင်နေရင် — double quotes တွေကို သုံးပြီး escape လုပ်နိုင်ပါတယ်:

```bash
NODE_OPTIONS='--require "./my path/file.js"'
```

Command-line option တစ်ခုအနေနဲ့ ဖြတ်သန်းပေးလိုက်တဲ့ singleton flag တစ်ခုက — `NODE_OPTIONS` ထဲကို ဖြတ်သန်းပေးထားတဲ့ အလားတူ flag ကို override လုပ်ပါလိမ့်မယ်:

```bash
# The inspector will be available on port 5555
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
```

အကြိမ်များစွာ ဖြတ်သန်းပေးနိုင်တဲ့ flag တစ်ခုကို — ၎င်းရဲ့ `NODE_OPTIONS` instances တွေကို အရင်ဦး ဖြတ်သန်းပေးပြီး — ၎င်းနောက်မှာ command-line instances တွေကို ဖြတ်သန်းပေးလိုက်သလို သဘောထား ကိုင်တွယ်ပါလိမ့်မယ်:

```bash
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# is equivalent to:
node --require "./a.js" --require "./b.js"
```

ခွင့်ပြုထားတဲ့ Node.js options တွေက အောက်က စာရင်းထဲမှာ ပါပါတယ်။ Option တစ်ခုက --XX ရော --no-XX variants နှစ်မျိုးလုံးကို support လုပ်ရင် — နှစ်ခုလုံးကို support လုပ်ပေမယ့် — အောက်က စာရင်းထဲမှာတော့ တစ်ခုကိုသာ ထည့်သွင်းထားပါတယ်။

* `--allow-addons`
* `--allow-child-process`
* `--allow-ffi`
* `--allow-fs-read`
* `--allow-fs-write`
* `--allow-inspector`
* `--allow-net`
* `--allow-openssl-store`
* `--allow-wasi`
* `--allow-worker`
* `--conditions`, `-C`
* `--cpu-prof-dir`
* `--cpu-prof-interval`
* `--cpu-prof-name`
* `--cpu-prof`
* `--diagnostic-dir`
* `--disable-proto`
* `--disable-sigusr1`
* `--disable-warning`
* `--disable-wasm-trap-handler`
* `--dns-result-order`
* `--enable-fips`
* `--enable-network-family-autoselection`
* `--enable-source-maps`
* `--entry-url`
* `--experimental-abortcontroller`
* `--experimental-addon-modules`
* `--experimental-detect-module`
* `--experimental-eventsource`
* `--experimental-ffi`
* `--experimental-import-meta-resolve`
* `--experimental-import-text`
* `--experimental-json-modules`
* `--experimental-loader`
* `--experimental-modules`
* `--experimental-package-map`
* `--experimental-print-required-tla`
* `--experimental-quic`
* `--experimental-require-module`
* `--experimental-shadow-realm`
* `--experimental-specifier-resolution`
* `--experimental-stream-iter`
* `--experimental-test-isolation`
* `--experimental-top-level-await`
* `--experimental-vfs`
* `--experimental-vm-modules`
* `--experimental-wasi-unstable-preview1`
* `--force-context-aware`
* `--force-fips`
* `--force-node-api-uncaught-exceptions-policy`
* `--frozen-intrinsics`
* `--heap-prof-dir`
* `--heap-prof-interval`
* `--heap-prof-name`
* `--heap-prof`
* `--heapsnapshot-near-heap-limit`
* `--heapsnapshot-signal`
* `--http-parser`
* `--icu-data-dir`
* `--import`
* `--input-type`
* `--insecure-http-parser`
* `--inspect-brk`
* `--inspect-port`, `--debug-port`
* `--inspect-publish-uid`
* `--inspect-wait`
* `--inspect`
* `--localstorage-file`
* `--max-http-header-size`
* `--max-old-space-size-percentage`
* `--network-family-autoselection-attempt-timeout`
* `--no-addons`
* `--no-async-context-frame`
* `--no-deprecation`
* `--no-experimental-global-navigator`
* `--no-experimental-repl-await`
* `--no-experimental-sqlite`
* `--no-experimental-strip-types`
* `--no-experimental-websocket`
* `--no-experimental-webstorage`
* `--no-extra-info-on-fatal-exception`
* `--no-force-async-hooks-checks`
* `--no-global-search-paths`
* `--no-network-family-autoselection`
* `--no-strip-types`
* `--no-warnings`
* `--no-webstorage`
* `--node-memory-debug`
* `--openssl-config`
* `--openssl-legacy-provider`
* `--openssl-shared-config`
* `--pending-deprecation`
* `--permission-audit`
* `--permission`
* `--preserve-symlinks-main`
* `--preserve-symlinks`
* `--prof-process`
* `--redirect-warnings`
* `--report-compact`
* `--report-dir`, `--report-directory`
* `--report-exclude-env`
* `--report-exclude-network`
* `--report-filename`
* `--report-on-fatalerror`
* `--report-on-signal`
* `--report-signal`
* `--report-uncaught-exception`
* `--require-module`
* `--require`, `-r`
* `--secure-heap-min`
* `--secure-heap`
* `--snapshot-blob`
* `--test-coverage-branches`
* `--test-coverage-exclude`
* `--test-coverage-functions`
* `--test-coverage-include-all`
* `--test-coverage-include`
* `--test-coverage-lines`
* `--test-global-setup`
* `--test-isolation`
* `--test-name-pattern`
* `--test-only`
* `--test-random-seed`
* `--test-randomize`
* `--test-reporter-destination`
* `--test-reporter`
* `--test-rerun-failures`
* `--test-shard`
* `--test-skip-pattern`
* `--throw-deprecation`
* `--title`
* `--tls-cipher-list`
* `--tls-keylog`
* `--tls-max-v1.2`
* `--tls-max-v1.3`
* `--tls-min-v1.0`
* `--tls-min-v1.1`
* `--tls-min-v1.2`
* `--tls-min-v1.3`
* `--trace-deprecation`
* `--trace-env-js-stack`
* `--trace-env-native-stack`
* `--trace-env`
* `--trace-event-categories`
* `--trace-event-file-pattern`
* `--trace-events-enabled`
* `--trace-exit`
* `--trace-require-module`
* `--trace-sigint`
* `--trace-sync-io`
* `--trace-tls`
* `--trace-uncaught`
* `--trace-warnings`
* `--track-heap-objects`
* `--unhandled-rejections`
* `--use-bundled-ca`
* `--use-env-proxy`
* `--use-largepages`
* `--use-openssl-ca`
* `--use-system-ca`
* `--v8-pool-size`
* `--watch-kill-signal`
* `--watch-path`
* `--watch-preserve-output`
* `--watch`
* `--zero-fill-buffers`

ခွင့်ပြုထားတဲ့ V8 options တွေကတော့:

* `--abort-on-uncaught-exception`
* `--disallow-code-generation-from-strings`
* `--enable-etw-stack-walking`
* `--expose-gc`
* `--interpreted-frames-native-stack`
* `--jitless`
* `--max-heap-size`
* `--max-old-space-size`
* `--max-semi-space-size`
* `--perf-basic-prof-only-functions`
* `--perf-basic-prof`
* `--perf-prof-unwinding-info`
* `--perf-prof`
* `--stack-trace-limit`

`--perf-basic-prof-only-functions`, `--perf-basic-prof`, `--perf-prof-unwinding-info` နဲ့ `--perf-prof` တို့က Linux ပေါ်မှာသာ ရနိုင်ပါတယ်။

`--enable-etw-stack-walking` က Windows ပေါ်မှာသာ ရနိုင်ပါတယ်။

### `NODE_PATH=path[:…]`

Module search path ရဲ့ ရှေ့ဆုံးမှာ ထည့်သွင်းမယ့် directories တွေရဲ့ `':'` နဲ့ ခွဲခြားထားတဲ့ စာရင်းတစ်ခုပါ။

Windows မှာတော့ ဒါက `';'` နဲ့ ခွဲခြားထားတဲ့ စာရင်းတစ်ခု ဖြစ်ပါတယ်။

### `NODE_PENDING_DEPRECATION=1`

`1` အဖြစ် သတ်မှတ်ထားရင် — pending deprecation warnings တွေကို emit လုပ်ပါတယ်။

Pending deprecations တွေက ယေဘုယျအားဖြင့် runtime deprecation တစ်ခုနဲ့ အတူတူပဲ ဖြစ်ပေမယ့် — ထူးခြားတဲ့ ချွင်းချက်က — ၎င်းတို့ကို default အနေနဲ့ _ပိတ်_ (off) ထားပြီး — `--pending-deprecation` command-line flag ဒါမှမဟုတ် `NODE_PENDING_DEPRECATION=1` environment variable ထဲက တစ်ခုခုကို သတ်မှတ်မထားရင် — emit လုပ်မှာ မဟုတ်ပါဘူး။ Pending deprecations တွေကို — deprecated API အသုံးပြုမှုတွေကို ထောက်လှမ်းဖို့ developers တွေ အသုံးချနိုင်တဲ့ — ရွေးချယ်ထားသော "ကြိုတင် သတိပေးချက် (early warning)" ယန္တရားတစ်မျိုး ပေးအပ်ဖို့ သုံးပါတယ်။

### `NODE_PENDING_PIPE_INSTANCES=instances`

Pipe server က connections တွေကို စောင့်နေတဲ့အခါ — pending pipe instance handles တွေရဲ့ အရေအတွက်ကို သတ်မှတ်ပါတယ်။ ဒီ setting က Windows မှာသာ သက်ရောက်ပါတယ်။

### `NODE_PRESERVE_SYMLINKS=1`

`1` အဖြစ် သတ်မှတ်ထားရင် — modules တွေကို resolve လုပ်ပြီး cache လုပ်တဲ့အခါ — module loader ကို symbolic links တွေ ထိန်းသိမ်းထားဖို့ ညွှန်ကြားပါတယ်။

### `NODE_REDIRECT_WARNINGS=file`

သတ်မှတ်ထားရင် — process warnings တွေကို stderr မှာ print လုပ်မယ့်အစား — ပေးထားတဲ့ file ဆီကို emit လုပ်ပါတယ်။ File မရှိသေးရင် အသစ် ဖန်တီးပေးပြီး — ရှိပြီးသားဆိုရင် နောက်ကနေ ထပ်ဆင့် ရေးသားပါတယ်။ Warning ကို file ထဲ ရေးသားဖို့ ကြိုးစားတုန်း error တစ်ခု ဖြစ်ခဲ့ရင် — warning ကို stderr မှာ ရေးသားပါလိမ့်မယ်။ ဒါက `--redirect-warnings=file` command-line flag ကို သုံးတာနဲ့ ညီမျှပါတယ်။

### `NODE_REPL_EXTERNAL_MODULE=file`

Built-in REPL အစား load လုပ်ခံရမယ့် Node.js module တစ်ခုဆီကို ညွှန်ပြတဲ့ path ပါ။ ဒီတန်ဖိုးကို ဗလာ string (`''`) အဖြစ် override လုပ်ထားရင် — built-in REPL ကို သုံးပါလိမ့်မယ်။

### `NODE_REPL_HISTORY=file`

Persistent REPL history ကို သိမ်းဆည်းဖို့ သုံးတဲ့ file ဆီကို ညွှန်ပြတဲ့ path ပါ။ Default path က `~/.node_repl_history` ဖြစ်ပြီး — ဒီ variable က override လုပ်ပါတယ်။ တန်ဖိုးကို ဗလာ string (`''` သို့မဟုတ် `' '`) အဖြစ် သတ်မှတ်ထားရင် — persistent REPL history ကို disable လုပ်ပါတယ်။

### `NODE_SKIP_PLATFORM_CHECK=value`

`value` က `'1'` နဲ့ ညီရင် — Node.js startup ကာလအတွင်းမှာ supported platform တစ်ခု ဟုတ်မဟုတ် စစ်ဆေးတာကို ကျော်လိုက်ပါတယ်။ အဲဒီလိုဆိုရင် Node.js က မှန်ကန်စွာ လည်ပတ်မယ်လို့ အာမခံလို့ မရပါဘူး။ Unsupported platforms တွေပေါ်မှာ ကြုံတွေ့ရတဲ့ ပြဿနာတွေကို ပြုပြင်ပေးမှာ မဟုတ်ပါဘူး။

### `NODE_TEST_CONTEXT=value`

`value` က `'child'` နဲ့ ညီရင် — test reporter options တွေကို override လုပ်ပြီး — test output ကို TAP format နဲ့ stdout ဆီကို ပို့ပေးပါလိမ့်မယ်။ တခြား တန်ဖိုး တစ်ခုခု ပေးထားရင် — Node.js က သုံးတဲ့ reporter format ဒါမှမဟုတ် ၎င်းရဲ့ stability အကြောင်း အာမခံချက် ဘာမှ မပေးပါဘူး။

### `NODE_TLS_REJECT_UNAUTHORIZED=value`

`value` က `'0'` နဲ့ ညီရင် — TLS connections တွေအတွက် certificate validation (certificate စစ်ဆေး အတည်ပြုမှု) ကို disable လုပ်ပါတယ်။ ဒါက TLS ကို — အကျိုးဆက်အနေနဲ့ HTTPS ကိုပါ — မလုံခြုံစေပါတယ်။ ဒီ environment variable ကို သုံးတာကို အပြင်းအထန် တွန်းလှန် (discourage) လုပ်ထားပါတယ်။

### `NODE_USE_ENV_PROXY=1`

> Stability: 1.1 - Active Development

Enable လုပ်ထားရင် — Node.js က startup ကာလအတွင်းမှာ `HTTP_PROXY`, `HTTPS_PROXY` နဲ့ `NO_PROXY` environment variables တွေကို parse လုပ်ပြီး — requests တွေကို သတ်မှတ်ထားတဲ့ proxy ကနေတစ်ဆင့် လမ်းကြောင်း (route) လွှဲပေးပါတယ်။

ဒါကို deployment အတွက် ယုံကြည်ရပြီး ခွင့်ပြုချက် ရှိတဲ့ proxies တွေနဲ့သာ သုံးပါ။ Proxy support က — ဥပမာ firewall တစ်ခုက proxy တစ်ခု လိုအပ်တဲ့အခါမျိုးမှာ — ခွင့်ပြုထားတဲ့ proxy servers တွေကနေတစ်ဆင့် external networks တွေဆီ ရောက်ရှိဖို့ ရည်ရွယ်ထားတာပါ။ Traffic တွေကို ဖုံးကွယ်ဖို့ သို့မဟုတ် network policy တွေကို ရှောင်တိမ်းဖို့ မဟုတ်ပါဘူး။ [Built-in Proxy Support][] ကို ကြည့်ပါ။

ဒါကို [`--use-env-proxy`][] command-line flag ကို သုံးပြီးလည်း enable လုပ်နိုင်ပါတယ်။ နှစ်ခုလုံး သတ်မှတ်ထားရင် — `--use-env-proxy` က ဦးစားပေး ရရှိပါတယ်။

### `NODE_USE_SYSTEM_CA=1`

Node.js က system store ထဲမှာ ရှိတဲ့ trusted CA certificates တွေကို — `--use-bundled-ca` option နဲ့ `NODE_EXTRA_CA_CERTS` environment variable တို့နဲ့အတူ — အသုံးပြုပါတယ်။

ဒါကို [`--use-system-ca`][] command-line flag ကို သုံးပြီးလည်း enable လုပ်နိုင်ပါတယ်။ နှစ်ခုလုံး သတ်မှတ်ထားရင် — `--use-system-ca` က ဦးစားပေး ရရှိပါတယ်။

### `NODE_V8_COVERAGE=dir`

သတ်မှတ်ထားရင် — Node.js က [V8 JavaScript code coverage][] နဲ့ [Source Map][] data တွေကို — argument အဖြစ် ပေးထားတဲ့ directory ဆီကို output စတင် ထုတ်ပေးပါလိမ့်မယ် (coverage information တွေကို `coverage` prefix ပါတဲ့ files တွေထဲကို JSON အဖြစ် ရေးသားပါတယ်)။

`NODE_V8_COVERAGE` က subprocesses တွေဆီကို အလိုအလျောက် ပျံ့နှံ့ (propagate) သွားတာမို့ — `child_process.spawn()` function မိသားစုကို ခေါ်တဲ့ applications တွေကို instrument (တိုင်းတာ စောင့်ကြည့်) လုပ်ဖို့ ပိုလွယ်ကူစေပါတယ်။ ပျံ့နှံ့မှုကို တားဆီးဖို့ `NODE_V8_COVERAGE` ကို ဗလာ string အဖြစ် သတ်မှတ်ထားနိုင်ပါတယ်။

#### Coverage output (coverage data ထွက်ရှိပုံ)

Coverage ကို top-level key `result` ပေါ်မှာ [ScriptCoverage][] objects တွေရဲ့ array တစ်ခုအနေနဲ့ output လုပ်ပါတယ်:

```json
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
```

#### Source map cache (source maps များကို cache လုပ်ထားခြင်း)

> Stability: 1 - Experimental

တွေ့ရှိရင် — source map data ကို JSON coverage object ပေါ်က top-level key `source-map-cache` ထဲမှာ ထပ်ဆင့် ထည့်သွင်းပါတယ်။

`source-map-cache` က object တစ်ခုပါ — keys တွေက source maps တွေကို ထုတ်ယူခဲ့တဲ့ files တွေကို ကိုယ်စားပြုပြီး — values တွေမှာ raw source-map URL (`url` key ထဲမှာ), parse လုပ်ပြီးသား Source Map v3 information (`data` key ထဲမှာ) နဲ့ source file ရဲ့ line lengths (`lineLengths` key ထဲမှာ) တို့ ပါဝင်ပါတယ်။

```json
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
```

### `NO_COLOR=<any>`

[`NO_COLOR`][] က `NODE_DISABLE_COLORS` ရဲ့ alias (အစားထိုး အမည်) တစ်ခုပါ။ Environment variable ရဲ့ တန်ဖိုးက ဘာဖြစ်ဖြစ် ရပါတယ် (arbitrary)။

### `OPENSSL_CONF=file`

စတင်ချိန်မှာ OpenSSL configuration file တစ်ခုကို load လုပ်ပါတယ်။ ဒီ file ကို [FIPS mode][] configuration တစ်ခုရဲ့ အစိတ်အပိုင်းအနေနဲ့ သုံးနိုင်ပါတယ်။

Variable ကို ဗလာ တန်ဖိုးတစ်ခုနဲ့ သတ်မှတ်ထားရင် — Node.js က OpenSSL configuration file တစ်ခုကိုမှ မလုပ်ပဲ စတင်ပါတယ်။ ဒါက — ရှိနေပေမယ့် ဖတ်လို့ မရတဲ့ — default configuration file တစ်ခုကို ကျော်လွှားဖို့ နည်းလမ်းတစ်ခုပါ — ဥပမာ — Node.js က run နေတဲ့ user အတွက် `/etc/ssl` ကို ဝင်ရောက်လို့ မရတဲ့အခါမျိုးမှာ — မဟုတ်ရင် ဒါက startup မှာ fatal (ပြင်းထန်သော error) ဖြစ်ပါတယ်။ အဲဒီလို အခြေအနေမျိုးမှာ — file က လုပ်ဆောင်ပေးမယ့် [FIPS mode][] setup တွေ အပါအဝင် — configuration ဘာမှ သုံးမှာ မဟုတ်ပါဘူး။

[`--openssl-config`][] command-line option ကို သုံးထားရင် — environment variable ကို လျစ်လျူရှုပြီး — ဗလာ တန်ဖိုးက ဘာအကျိုးသက်ရောက်မှုမှ မရှိပါဘူး။

### `SSL_CERT_DIR=dir`

`--use-openssl-ca` ကို enable လုပ်ထားရင် သို့မဟုတ် — macOS နဲ့ Windows ကလွဲပြီး တခြား platform တွေမှာ `--use-system-ca` ကို enable လုပ်ထားရင် — ဒါက trusted certificates တွေ ပါဝင်တဲ့ OpenSSL ရဲ့ directory ကို override လုပ်ပြီး သတ်မှတ်ပေးပါတယ်။

Child environment ကို တိုက်ရိုက် သတ်မှတ်မထားရင် — ဒီ environment variable က child processes တွေ အားလုံးဆီကို အမွေဆက်ခံ ရောက်ရှိသွားပြီး — ၎င်းတို့က OpenSSL ကို သုံးရင် — node က ယုံကြည်တဲ့ CAs တွေအတိုင်း ယုံကြည်မိစေနိုင်တာ သတိထားပါ။

### `SSL_CERT_FILE=file`

`--use-openssl-ca` ကို enable လုပ်ထားရင် သို့မဟုတ် — macOS နဲ့ Windows ကလွဲပြီး တခြား platform တွေမှာ `--use-system-ca` ကို enable လုပ်ထားရင် — ဒါက trusted certificates တွေ ပါဝင်တဲ့ OpenSSL ရဲ့ file ကို override လုပ်ပြီး သတ်မှတ်ပေးပါတယ်။

Child environment ကို တိုက်ရိုက် သတ်မှတ်မထားရင် — ဒီ environment variable က child processes တွေ အားလုံးဆီကို အမွေဆက်ခံ ရောက်ရှိသွားပြီး — ၎င်းတို့က OpenSSL ကို သုံးရင် — node က ယုံကြည်တဲ့ CAs တွေအတိုင်း ယုံကြည်မိစေနိုင်တာ သတိထားပါ။

### `TZ`

`TZ` environment variable ကို timezone configuration သတ်မှတ်ဖို့ သုံးပါတယ်။

Node.js က [ways that `TZ` is handled in other environments][] ထဲက နည်းလမ်း အမျိုးမျိုး အားလုံးကို support မလုပ်ပေမယ့် — အခြေခံ [timezone IDs][] တွေ (`'Etc/UTC'`, `'Europe/Paris'` သို့မဟုတ် `'America/New_York'` လိုမျိုး) ကိုတော့ support လုပ်ပါတယ်။ တခြား abbreviations (အတိုကောက်များ) သို့မဟုတ် aliases တစ်ချို့ကိုလည်း support လုပ်နိုင်ပေမယ့် — အဲဒါတွေကို သုံးတာက အပြင်းအထန် တွန်းလှန်ထားပြီး — အာမခံချက်လည်း မရှိပါဘူး။

```console
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
```
### `UV_THREADPOOL_SIZE=size`

libuv ရဲ့ threadpool ထဲမှာ သုံးမယ့် threads အရေအတွက်ကို `size` အဖြစ် သတ်မှတ်ပေးပါတယ်။

Node.js က ဖြစ်နိုင်တဲ့အခါတိုင်း asynchronous system APIs တွေကို သုံးပါတယ် — ဒါပေမယ့် အဲဒီလို APIs တွေ မရှိတဲ့ နေရာတွေမှာတော့ — synchronous system APIs တွေကို အခြေခံပြီး asynchronous node APIs တွေ ဖန်တီးဖို့ — libuv ရဲ့ threadpool ကို သုံးပါတယ်။ Threadpool ကို သုံးစွဲတဲ့ Node.js APIs တွေကတော့:

* `fs` APIs အားလုံး — file watcher APIs တွေနဲ့ တိုက်ရိုက် (explicitly) synchronous ဖြစ်တဲ့ APIs တွေ ကလွဲလို့
* `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()` လိုမျိုး asynchronous crypto APIs တွေ
* `dns.lookup()`
* `zlib` APIs အားလုံး — တိုက်ရိုက် (explicitly) synchronous ဖြစ်တဲ့ဟာတွေ ကလွဲလို့

libuv ရဲ့ threadpool က ပုံသေ အရွယ်အစား (fixed size) ရှိတာမို့ — ဒီ APIs တွေထဲက တစ်ခုခုက ဘယ်အကြောင်းကြောင့်ပဲ ဖြစ်ဖြစ် ကြာမြင့်စွာ အလုပ်လုပ်နေခဲ့ရင် — libuv ရဲ့ threadpool ထဲမှာ run လုပ်နေတဲ့ — (ပတ်သက်ပုံ မရတဲ့) တခြား APIs တွေကပါ — စွမ်းဆောင်ရည် ကျဆင်းမှု (degraded performance) ကို ကြုံတွေ့ရပါလိမ့်မယ်။ ဒီပြဿနာကို လျော့ပါးစေဖို့ ဖြေရှင်းနည်း တစ်ခုကတော့ — `'UV_THREADPOOL_SIZE'` environment variable ကို `4` (လက်ရှိ default တန်ဖိုး) ထက် ကြီးတဲ့ တန်ဖိုးတစ်ခုအဖြစ် သတ်မှတ်ပြီး — libuv ရဲ့ threadpool အရွယ်အစားကို တိုးမြှင့်ဖို့ပါ။ ဒါပေမယ့် — `process.env.UV_THREADPOOL_SIZE=size` ကို သုံးပြီး process ရဲ့ အတွင်းကနေ ဒီလို သတ်မှတ်တာကတော့ — threadpool ကို user code run လုပ်တာထက် အများကြီး စောပြီး — runtime initialization (runtime စတင် လုပ်ဆောင်မှု) ရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ ဖန်တီးပြီးသား ဖြစ်နေတာမို့ — အလုပ်လုပ်မယ်လို့ အာမခံလို့ မရပါဘူး။ နောက်ထပ် အချက်အလက်တွေအတွက် [libuv threadpool documentation][] ကို ကြည့်ပါ။

## အသုံးဝင်သော V8 options များ (Useful V8 options)

V8 မှာ ကိုယ်ပိုင် CLI options အစုတစ်ခု ရှိပါတယ်။ `node` ဆီကို ပေးအပ်လိုက်တဲ့ V8 CLI option မှန်သမျှကို ကိုင်တွယ်ဖို့ V8 ဆီကို လွှဲပြောင်း ပေးပို့ပါလိမ့်မယ်။ V8 ရဲ့ options တွေမှာ _stability အာမခံချက် (stability guarantee) မရှိပါဘူး_။ V8 team ကိုယ်တိုင်က ၎င်းတို့ကို မိမိတို့ရဲ့ တရားဝင် API ရဲ့ အစိတ်အပိုင်းတစ်ခုအနေနဲ့ မမှတ်ယူကြပဲ — ဘယ်အချိန်မဆို ပြောင်းလဲပိုင်ခွင့်လည်း ရှိပါတယ်။ အလားတူပဲ — အဲဒီ options တွေက Node.js ရဲ့ stability အာမခံချက်တွေနဲ့လည်း ဖုံးအုပ်မထားပါဘူး။ V8 options အများစုက V8 developers တွေအတွက်သာ စိတ်ဝင်စားစရာ ကောင်းပါတယ်။ ဒါပေမယ့် — Node.js နဲ့ ကျယ်ကျယ်ပြန့်ပြန့် သက်ဆိုင်တဲ့ V8 options အစုငယ်တစ်ခုကတော့ ရှိပြီး — အဲဒါတွေကို ဒီမှာ မှတ်တမ်းတင်ထားပါတယ်:

### `--abort-on-uncaught-exception`

### `--disallow-code-generation-from-strings`

### `--enable-etw-stack-walking`

### `--expose-gc`

### `--harmony-shadow-realm`

### `--heap-snapshot-on-oom`

### `--interpreted-frames-native-stack`

### `--jitless`

### `--max-heap-size`

Process အတွက် အများဆုံး heap size ကို megabytes (မီဂါဘိုက်) ယူနစ်နဲ့ သတ်မှတ်ပေးပါတယ်။

ဒီ option ကို ပုံမှန်အားဖြင့် — process က ၎င်းရဲ့ JavaScript heap အတွက် သုံးစွဲနိုင်တဲ့ memory ပမာဏကို ကန့်သတ်ဖို့ သုံးပါတယ်။

<a id="--max-old-space-sizesize-in-megabytes"></a>

### `--max-old-space-size=SIZE` (in MiB)

V8 ရဲ့ old memory section ရဲ့ အများဆုံး memory အရွယ်အစားကို သတ်မှတ်ပေးပါတယ်။ Memory သုံးစွဲမှုက ကန့်သတ်ချက်ဆီကို နီးကပ်လာတာနဲ့အမျှ — V8 က မသုံးတော့တဲ့ memory တွေကို လွှတ်ပေးနိုင်ဖို့ — garbage collection ပေါ်မှာ အချိန် ပိုမို ကုန်ဆုံးစေပါလိမ့်မယ်။

Memory 2 GiB ရှိတဲ့ machine တစ်လုံးမှာ — တခြား အသုံးပြုမှုတွေအတွက် memory အနည်းငယ် ချန်ထားနိုင်ဖို့နဲ့ swapping (memory ဖလှယ် သုံးစွဲခြင်း) ကို ရှောင်ရှားနိုင်ဖို့ — ဒီတန်ဖိုးကို 1536 (1.5 GiB) အဖြစ် သတ်မှတ်ဖို့ စဉ်းစားပါ။

```bash
node --max-old-space-size=1536 index.js
```

<a id="--max-semi-space-sizesize-in-megabytes"></a>

### `--max-semi-space-size=SIZE` (in MiB)

V8 ရဲ့ [scavenge garbage collector][] အတွက် အများဆုံး [semi-space][] အရွယ်အစားကို MiB (mebibytes) နဲ့ သတ်မှတ်ပေးပါတယ်။ Semi-space တစ်ခုရဲ့ အများဆုံး အရွယ်အစားကို တိုးမြှင့်လိုက်တာက — memory သုံးစွဲမှု ပိုများလာတဲ့ ကုန်ကျစရိတ်နဲ့အတူ — Node.js အတွက် throughput (လုပ်ဆောင်နိုင်စွမ်း) ကို တိုးတက်စေနိုင်ပါတယ်။

V8 heap ရဲ့ young generation အရွယ်အစားက semi-space ရဲ့ အရွယ်အစားရဲ့ သုံးဆ ဖြစ်တာမို့ (V8 ထဲက [`YoungGenerationSizeFromSemiSpaceSize`][] ကို ကြည့်ပါ) — semi-space ကို 1 MiB တိုးလိုက်တာက semi-space တစ်ခုချင်းစီ သုံးခုလုံးကို သက်ရောက်ပြီး — heap size ကို 3 MiB တိုးလာစေပါတယ်။ Throughput တိုးတက်မှုကတော့ သင့် workload (လုပ်ငန်းဝန်) အပေါ်မှာ မူတည်ပါတယ် ([#42511][] ကို ကြည့်ပါ)။

Default တန်ဖိုးက memory limit အပေါ်မှာ မူတည်ပါတယ်။ ဥပမာ — memory limit 512 MiB ရှိတဲ့ 64-bit systems တွေမှာ — semi-space ရဲ့ အများဆုံး အရွယ်အစားက default အနေနဲ့ 1 MiB ဖြစ်ပါတယ်။ 2 GiB အထိ (2 GiB အပါအဝင်) memory limits တွေအတွက်ဆိုရင် — 64-bit systems တွေမှာ semi-space ရဲ့ default အများဆုံး အရွယ်အစားက 16 MiB ထက် ငယ်ပါလိမ့်မယ်။

သင့် application အတွက် အကောင်းဆုံး configuration ကို ရရှိဖို့ဆိုရင် — သင့် application အတွက် benchmarks (စွမ်းဆောင်ရည် စမ်းသပ်မှုများ) run လုပ်တဲ့အခါ — max-semi-space-size တန်ဖိုး အမျိုးမျိုးကို စမ်းသုံးကြည့်သင့်ပါတယ်။

ဥပမာ — 64-bit systems တွေပေါ်မှာ benchmark လုပ်ကြည့်ရင်:

```bash
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
```

### `--perf-basic-prof`

### `--perf-basic-prof-only-functions`

### `--perf-prof`

### `--perf-prof-unwinding-info`

### `--prof`

### `--security-revert`

### `--stack-trace-limit=limit`

Error တစ်ခုရဲ့ stack trace ထဲမှာ စုဆောင်းမယ့် stack frames တွေရဲ့ အများဆုံး အရေအတွက်ပါ။ 0 အဖြစ် သတ်မှတ်လိုက်ရင် stack trace စုဆောင်းမှုကို disable လုပ်ပါတယ်။ Default တန်ဖိုးကတော့ 10 ပါ။

```bash
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # prints 12
```

[#42511]: https://github.com/nodejs/node/issues/42511
[Built-in Proxy Support]: http.md#built-in-proxy-support
[Chrome DevTools Protocol]: https://chromedevtools.github.io/devtools-protocol/
[Chromium's policy for locally trusted certificates]: https://chromium.googlesource.com/chromium/src/+/main/net/data/ssl/chrome_root_store/faq.md#does-the-chrome-certificate-verifier-consider-local-trust-decisions
[CommonJS module]: modules.md
[DEP0025 warning]: deprecations.md#dep0025-requirenodesys
[ECMAScript module]: esm.md#modules-ecmascript-modules
[EventSource Web API]: https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events
[ExperimentalWarning: `vm.measureMemory` is an experimental feature]: vm.md#vmmeasurememoryoptions
[FIPS mode]: crypto.md#fips-mode
[File System Permissions]: permissions.md#file-system-permissions
[Loading ECMAScript modules using `require()`]: modules.md#loading-ecmascript-modules-using-require
[Module resolution and loading]: packages.md#module-resolution-and-loading
[Navigator API]: globals.md#navigator
[Node.js issue tracker]: https://github.com/nodejs/node/issues
[OSSL_PROVIDER-legacy]: https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy.html
[Package maps]: packages.md#package-maps
[Permission Model]: permissions.md#permission-model
[REPL]: repl.md
[ScriptCoverage]: https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage
[ShadowRealm]: https://github.com/tc39/proposal-shadowrealm
[Source Map]: https://tc39.es/ecma426/
[Test tags]: test.md#test-tags
[TypeScript type-stripping]: typescript.md#type-stripping
[V8 Inspector integration for Node.js]: debugger.md#v8-inspector-integration-for-nodejs
[V8 JavaScript code coverage]: https://v8project.blogspot.com/2017/12/javascript-code-coverage.html
[`"type"`]: packages.md#type
[`--allow-addons`]: #--allow-addons
[`--allow-child-process`]: #--allow-child-process
[`--allow-fs-read`]: #--allow-fs-read
[`--allow-fs-write`]: #--allow-fs-write
[`--allow-net`]: #--allow-net
[`--allow-openssl-store`]: #--allow-openssl-store
[`--allow-wasi`]: #--allow-wasi
[`--allow-worker`]: #--allow-worker
[`--build-snapshot`]: #--build-snapshot
[`--cpu-prof-dir`]: #--cpu-prof-dir
[`--diagnostic-dir`]: #--diagnostic-dirdirectory
[`--disable-sigusr1`]: #--disable-sigusr1
[`--enable-fips`]: #--enable-fips
[`--env-file-if-exists`]: #--env-file-if-existsfile
[`--env-file`]: #--env-filefile
[`--experimental-sea-config`]: single-executable-applications.md#1-generating-single-executable-preparation-blobs
[`--heap-prof-dir`]: #--heap-prof-dir
[`--import`]: #--importmodule
[`--no-require-module`]: #--no-require-module
[`--no-strip-types`]: #--no-strip-types
[`--openssl-config`]: #--openssl-configfile
[`--preserve-symlinks`]: #--preserve-symlinks
[`--print`]: #-p---print-script
[`--redirect-warnings`]: #--redirect-warningsfile
[`--require`]: #-r---require-module
[`--use-env-proxy`]: #--use-env-proxy
[`--use-system-ca`]: #--use-system-ca
[`AsyncLocalStorage`]: async_context.md#class-asynclocalstorage
[`Buffer`]: buffer.md#class-buffer
[`CRYPTO_secure_malloc_init`]: https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init.html
[`ERR_INVALID_TYPESCRIPT_SYNTAX`]: errors.md#err_invalid_typescript_syntax
[`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`]: errors.md#err_unsupported_typescript_syntax
[`NODE_OPTIONS`]: #node_optionsoptions
[`NODE_USE_ENV_PROXY=1`]: #node_use_env_proxy1
[`NO_COLOR`]: https://no-color.org
[`Web Storage`]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
[`YoungGenerationSizeFromSemiSpaceSize`]: https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328
[`crypto.createPrivateKey()`]: crypto.md#cryptocreateprivatekeykey
[`dns.lookup()`]: dns.md#dnslookuphostname-options-callback
[`dns.setDefaultResultOrder()`]: dns.md#dnssetdefaultresultorderorder
[`dnsPromises.lookup()`]: dns.md#dnspromiseslookuphostname-options
[`import.meta.url`]: esm.md#importmetaurl
[`import` specifier]: esm.md#import-specifiers
[`net.getDefaultAutoSelectFamilyAttemptTimeout()`]: net.md#netgetdefaultautoselectfamilyattempttimeout
[`node:ffi`]: ffi.md
[`node:sqlite`]: sqlite.md
[`node:stream/iter`]: stream_iter.md
[`node:vfs`]: vfs.md
[`permission.drop()`]: permissions.md#permissiondropscope-reference
[`process.setUncaughtExceptionCaptureCallback()`]: process.md#processsetuncaughtexceptioncapturecallbackfn
[`tls.DEFAULT_MAX_VERSION`]: tls.md#tlsdefault_max_version
[`tls.DEFAULT_MIN_VERSION`]: tls.md#tlsdefault_min_version
[`unhandledRejection`]: process.md#event-unhandledrejection
[`v8.startupSnapshot.addDeserializeCallback()`]: v8.md#v8startupsnapshotadddeserializecallbackcallback-data
[`v8.startupSnapshot.setDeserializeMainFunction()`]: v8.md#v8startupsnapshotsetdeserializemainfunctioncallback-data
[`v8.startupSnapshot` API]: v8.md#startup-snapshot-api
[asynchronous module customization hooks]: module.md#asynchronous-customization-hooks
[captured by the built-in snapshot of Node.js]: https://github.com/nodejs/node/blob/b19525a33cc84033af4addd0f80acd4dc33ce0cf/test/parallel/test-bootstrap-modules.js#L24
[collecting code coverage from tests]: test.md#collecting-code-coverage
[conditional exports]: packages.md#conditional-exports
[context-aware]: addons.md#context-aware-addons
[debugger]: debugger.md
[debugging security implications]: https://nodejs.org/learn/getting-started/debugging#security-implications
[deprecation warnings]: deprecations.md#list-of-deprecated-apis
[emit_warning]: process.md#processemitwarningwarning-options
[environment_variables]: #environment-variables-1
[filtering tests by name]: test.md#filtering-tests-by-name
[global setup and teardown]: test.md#global-setup-and-teardown
[jitless]: https://v8.dev/blog/jitless
[libuv threadpool documentation]: https://docs.libuv.org/en/latest/threadpool.html
[module compile cache]: module.md#module-compile-cache
[preloading asynchronous module customization hooks]: module.md#registration-of-asynchronous-customization-hooks
[randomizing tests execution order]: test.md#randomizing-tests-execution-order
[remote code execution]: https://www.owasp.org/index.php/Code_Injection
[running tests from the command line]: test.md#running-tests-from-the-command-line
[scavenge garbage collector]: https://v8.dev/blog/orinoco-parallel-scavenger
[security warning]: #warning-binding-inspector-to-a-public-ipport-combination-is-insecure
[semi-space]: https://v8.dev/blog/trash-talk#minor-gc
[single executable application]: single-executable-applications.md
[snapshot testing]: test.md#snapshot-testing
[syntax detection]: packages.md#syntax-detection
[test reporters]: test.md#test-reporters
[test reruns]: test.md#rerunning-failed-tests
[test runner execution model]: test.md#test-runner-execution-model
[timezone IDs]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[tracking issue for user-land snapshots]: https://github.com/nodejs/node/issues/44014
[ways that `TZ` is handled in other environments]: https://www.gnu.org/software/libc/manual/html_node/TZ-Variable.html
