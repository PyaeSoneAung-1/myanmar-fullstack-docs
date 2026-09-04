---
title: "Permissions"
description: "Node.js Permission Model — process တစ်ခုက system resources တွေကို ဝင်ရောက်ခွင့်နဲ့ လုပ်ဆောင်ခွင့်တွေကို --permission flag နဲ့ ထိန်းချုပ်ခြင်း (--allow-* flags, runtime API, audit mode အပါအဝင်)။"
order: 115
source: "https://nodejs.org/api/permissions.html"
status: translated
updated: 2026-09-04
---

Permissions များကို — Node.js process က ဘယ် system resources တွေကို ဝင်ရောက်ခွင့် ရှိမလဲ၊ (သို့) process က အဲဒီ resources တွေနဲ့ ဘယ်လို လုပ်ဆောင်ချက်တွေ လုပ်ဆောင်နိုင်မလဲဆိုတာကို — ထိန်းချုပ်ဖို့ အသုံးပြုနိုင်ပါတယ်။

* [Process-based permissions](#process-based-permissions) က Node.js process ရဲ့ resources တွေဆီ ဝင်ရောက်ခွင့်ကို ထိန်းချုပ်ပေးပါတယ်။ Resource တစ်ခုကို လုံးဝ ခွင့်ပြုတာ (သို့) ငြင်းပယ်တာ ဖြစ်စေ၊ ၎င်းနဲ့ ဆက်စပ်တဲ့ လုပ်ဆောင်ချက်တွေကို ထိန်းချုပ်တာ ဖြစ်စေ လုပ်နိုင်ပါတယ်။ ဥပမာ — file system ဖတ်ခြင်းကို ခွင့်ပြုပြီး ရေးသားခြင်းကိုတော့ ငြင်းပယ်ထားနိုင်ပါတယ်။ ဒီ feature က malicious code (အန္တရာယ်ရှိသော code) တွေကနေ ကာကွယ်ပေးတာ မဟုတ်ပါဘူး။ Node.js [Security Policy][] အရ — Node.js က သူ့ကို run လုပ်ဖို့ တောင်းဆိုတဲ့ code တိုင်းကို ယုံကြည်ပါတယ်။

ဒီ permission model က "seat belt" (ထိုင်ခုံခါးပတ်) ချဉ်းကပ်နည်း တစ်ခုကို အကောင်အထည်ဖော်ထားပြီး — ယုံကြည်ရတဲ့ code က ဝင်ရောက်ခွင့် အတိအလင်း ပေးမထားတဲ့ files တွေကို မရည်ရွယ်ဘဲ ပြောင်းလဲမိတာ (သို့) resources တွေကို သုံးမိတာမျိုးကနေ ကာကွယ်ပေးပါတယ်။ ၎င်းက malicious code တွေ ရှိနေတဲ့အခါမှာ security guarantees (လုံခြုံရေး အာမခံချက်များ) ကိုတော့ ပေးမထားပါဘူး။ Malicious code က permission model ကို ကျော်လွှားပြီး — permission model ရဲ့ ကန့်သတ်ချက်တွေ မပါဘဲ — arbitrary code တွေကို execute လုပ်နိုင်ပါတယ်။

အလားအလာရှိတဲ့ security vulnerability တစ်ခုကို တွေ့ရှိရင် — ကျွန်တော်တို့ရဲ့ [Security Policy][] ကို ကိုးကားကြည့်ရှုပေးပါ။

## Process အခြေပြု permissions (Process-based permissions)

### Permission Model (ခွင့်ပြုချက် စံနမူနာ)

> Stability: 2 - Stable

Node.js Permission Model ဆိုတာ — execution လုပ်နေစဉ်အတွင်း သတ်မှတ်ထားတဲ့ resources တွေဆီ ဝင်ရောက်ခွင့်ကို ကန့်သတ်ဖို့ ယန္တရား (mechanism) တစ်ခု ဖြစ်ပါတယ်။ ဒီ API က [`--permission`][] flag ရဲ့ နောက်ကွယ်မှာ တည်ရှိပြီး — enable လုပ်လိုက်တဲ့အခါ ရရှိနိုင်တဲ့ permissions အားလုံးဆီ ဝင်ရောက်ခွင့်ကို ကန့်သတ်လိုက်ပါတယ်။

ရရှိနိုင်တဲ့ permissions တွေကို [`--permission`][] flag မှာ မှတ်တမ်းတင်ဖော်ပြထားပါတယ်။

Permission Model မှာ လည်ပတ်မှု mode နှစ်မျိုး ရှိပါတယ်:

* **Enforce mode** ([`--permission`][] သုံးတဲ့အခါ default): ဝင်ရောက်ခွင့်ကို ငြင်းပယ်ပြီး — process ကို ခွင့်မပြုထားတဲ့ operation တစ်ခုခု လုပ်ဆောင်ရင် `ERR_ACCESS_DENIED` error တစ်ခုကို throw လုပ်ပါတယ်။
* **Audit mode** ([`--permission-audit`][] သုံးတဲ့အခါ): Permission checks တွေကို လုပ်ဆောင်ပြီး ချိုးဖောက်မှုတွေကို diagnostics channel ကနေတစ်ဆင့် ထုတ်ပြန်ပေမယ့် — ဝင်ရောက်ခွင့်ကိုတော့ **မငြင်းပယ်ပါဘူး**။ Execution က ပုံမှန်အတိုင်း ဆက်လုပ်ဆောင်ပါတယ်။ ဒီ mode က — enforce mode နဲ့ မဖြန့်ကျက်ခင် သင့် application က ဘယ် permissions တွေ လိုအပ်လဲဆိုတာကို ရှာဖွေဖို့ အသုံးဝင်ပါတယ်။

`--permission` နဲ့ Node.js ကို စတင်လိုက်တဲ့အခါ — `fs` module ကနေတစ်ဆင့် file system ကို ဝင်ရောက်ခွင့်၊ network ကို ဝင်ရောက်ခွင့်၊ processes တွေ spawn လုပ်ခြင်း၊ `node:worker_threads` အသုံးပြုခြင်း၊ native addons အသုံးပြုခြင်း၊ WASI အသုံးပြုခြင်း၊ FFI အသုံးပြုခြင်းနဲ့ runtime inspector ကို enable လုပ်ခြင်း စတာတွေကို ကန့်သတ်လိုက်ပါလိမ့်မယ် (SIGUSR1 အတွက် listener ကိုလည်း ဖန်တီးပေးမှာ မဟုတ်ပါဘူး)။

```console
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/home/user/index.js'
}
```

Process တစ်ခု spawn လုပ်ခွင့်နဲ့ worker threads တွေ ဖန်တီးခွင့်ကို — [`--allow-child-process`][] နဲ့ [`--allow-worker`][] flag တွေကို အသီးသီး အသုံးပြုပြီး ခွင့်ပြုနိုင်ပါတယ်။

Network ဝင်ရောက်ခွင့် အတွက် [`--allow-net`][] ကို သုံးပြီး — permission model သုံးတဲ့အခါ native addons တွေ ခွင့်ပြုဖို့ [`--allow-addons`][] flag ကို သုံးပါတယ်။ WASI အတွက် [`--allow-wasi`][] flag ကို သုံးပြီး — FFI အတွက်တော့ [`--allow-ffi`][] flag ကို သုံးပါတယ်။ [`node:ffi`](https://nodejs.org/api/ffi.html) module ကိုလည်း `--experimental-ffi` flag လိုအပ်ပြီး — FFI support ပါတဲ့ builds တွေမှာပဲ ရရှိနိုင်ပါတယ်။

OpenSSL STORE loaders တွေကို ခွင့်ပြုဖို့ — ဥပမာ [`crypto.createPrivateKey()`][] ဆီကို ပေးလိုက်တဲ့ {URL} တစ်ခုကနေ private key တစ်ခုကို load လုပ်ဖို့ — [`--allow-openssl-store`][] flag ကို သုံးပါတယ်။ ဒီ flag က ပြင်ဆင်သတ်မှတ်ထားတဲ့ OpenSSL STORE loaders တွေကို ကျယ်ပြန့်တဲ့ အခွင့်အာဏာ ပေးလိုက်တာမို့ — files, devices, tokens (သို့) network တွေကို ဝင်ရောက်နိုင်ပါတယ်။ Loader တစ်ခုက လုပ်ဆောင်တဲ့ ဝင်ရောက်မှုတွေကိုတော့ `fs.read`, `fs.write`, (သို့) `net` permission scopes တွေရဲ့ ကန့်သတ်မှုအတိုင်း မလိုက်နာပါဘူး။

#### Runtime API (runtime အတွင်း အသုံးပြုသော API)

Permission Model ကို [`--permission`][] (သို့) [`--permission-audit`][] flags တွေကနေတစ်ဆင့် enable လုပ်တဲ့အခါ — `process` object ပေါ်မှာ `permission` ဆိုတဲ့ property အသစ် တစ်ခု ထပ်ပေါင်းထည့်ပေးပါတယ်။ ဒီ property ထဲမှာ အောက်ပါ functions တွေ ပါဝင်ပါတယ်:

##### `permission.has(scope[, reference])`

Runtime မှာ permissions တွေကို စစ်ဆေးဖို့ API call ဖြစ်ပါတယ် ([`permission.has()`][])

```js
process.permission.has('fs.write'); // true
process.permission.has('fs.write', '/home/rafaelgss/protected-folder'); // true

process.permission.has('fs.read'); // true
process.permission.has('fs.read', '/home/rafaelgss/protected-folder'); // false
```

##### `permission.drop(scope[, reference])`

Runtime မှာ permissions တွေကို ဖျက်သိမ်းဖို့ API call ဖြစ်ပါတယ်။ ဒီ operation က **ပြန်လည် မပြောင်းပြန်နိုင်တဲ့ (irreversible)** သဘောရှိပါတယ်။

Reference မပါဘဲ ခေါ်လိုက်ရင် — scope တစ်ခုလုံးကို ဖျက်သိမ်းလိုက်ပါတယ်။ Reference ပါပြီး ခေါ်ရင်တော့ — သတ်မှတ်ထားတဲ့ resource အတွက် permission တစ်ခုတည်းကိုပဲ ရုပ်သိမ်းလိုက်ပါတယ်။ Permission တစ်ခုကို ဖျက်သိမ်းလိုက်တာက နောက်ပိုင်း access checks တွေကိုပဲ သက်ရောက်မှု ရှိပါတယ်။ File descriptors, network sockets, child processes, (သို့) worker threads လိုမျိုး — အရင်ကတည်းက ဖွင့်ထားပြီးသား resources တွေဆီ ဝင်ရောက်ခွင့်ကိုတော့ ပိတ်ပစ်တာ (သို့) ရုပ်သိမ်းလိုက်တာ မဟုတ်ပါဘူး။ Applications တွေက မလိုအပ်တော့တဲ့အခါ အဲဒီ resources တွေကို ကိုယ်တိုင် ပိတ်ပစ်ဖို့ (သို့) အဆုံးသတ်ဖို့ တာဝန်ရှိပါတယ်။

အတိအကျ ခွင့်ပြုပေးထားတဲ့ resource ကိုပဲ ဖျက်သိမ်းလို့ ရပါတယ်။ `drop()` ဆီကို ပေးလိုက်တဲ့ reference က မူလ ခွင့်ပြုချက်နဲ့ ကိုက်ညီရပါမယ်။ Permission တစ်ခုကို wildcard (`*`) နဲ့ ခွင့်ပြုထားခဲ့ရင် — scope တစ်ခုလုံးကိုပဲ ဖျက်သိမ်းလို့ ရပါတယ် (reference မပါဘဲ `drop()` ကို ခေါ်ခြင်းအားဖြင့်)။ Directory တစ်ခုကို ခွင့်ပြုထားခဲ့ရင် (ဥပမာ `--allow-fs-read=/my/folder`) — အဲဒီထဲက file တစ်ခုချင်းစီကိုတော့ ဖျက်သိမ်းလို့ မရပါဘူး; မူလက ခွင့်ပြုခဲ့တဲ့ directory တစ်ခုတည်းကိုပဲ ဖျက်သိမ်းရပါမယ်။

```js
const fs = require('node:fs');

// Read config at startup while we still have permission
const config = fs.readFileSync('/etc/myapp/config.json', 'utf8');

// Drop read access to /etc/myapp after initialization
process.permission.drop('fs.read', '/etc/myapp');

// This will now return false
process.permission.has('fs.read', '/etc/myapp/config.json'); // false

// Drop child process permission entirely
process.permission.drop('child');
```

#### Audit Mode (audit လုပ်ဆောင်သည့် mode)

[`--permission-audit`][] flag က Permission Model အတွက် audit mode ကို enable လုပ်ပေးပါတယ်။ Audit mode မှာ permission checks တွေကို လုပ်ဆောင်ပေမယ့် — ဝင်ရောက်ခွင့်ကိုတော့ **မငြင်းပယ်ပါဘူး** — `ERR_ACCESS_DENIED` error ကိုလည်း မထုတ်ပါဘူး။ အဲဒီအစား — permission ချိုးဖောက်မှု တစ်ခုချင်းစီကို `node:diagnostics_channel` module ကနေတစ်ဆင့် ထုတ်ပြန်ပေးတာမို့ — application က enforce mode အောက်မှာ ဘယ် operations တွေ ငြင်းပယ်ခံရမယ်ဆိုတာကို စောင့်ကြည့်ပြီး log လုပ်နိုင်ပါတယ်။ Execution က ပုံမှန်အတိုင်း ဆက်လုပ်ဆောင်ပါတယ်။

Audit mode က — [`--permission`][] နဲ့ မဖြန့်ကျက်ခင် သင့် application က ဘယ် permissions တွေ လိုအပ်လဲဆိုတာကို ရှာဖွေဖို့ အသုံးဝင်ပါတယ်။ ၎င်းကို [`--allow-fs-read`][], [`--allow-fs-write`][], [`--allow-net`][], [`--allow-child-process`][], [`--allow-worker`][], [`--allow-addons`][], [`--allow-wasi`][], နဲ့ [`--allow-ffi`][] flags တွေနဲ့လည်း ပေါင်းစပ်သုံးနိုင်ပြီး — permissions တချို့ကို ခွင့်ပြုပေးရင်း တချို့ကိုတော့ audit လုပ်နိုင်ပါတယ်။

Audit mode မှာ permission check တစ်ခု မအောင်မြင်တဲ့အခါ — ငြင်းပယ်လိုက်တဲ့ scope နဲ့ ကိုက်ညီတဲ့ diagnostics channel ဆီကို message တစ်ခု ထုတ်ပြန်ပေးပါတယ်။ Channel နာမည်တွေကတော့:

* `node:permission-model:fs` — File System (read နဲ့ write)
* `node:permission-model:net` — Network
* `node:permission-model:child` — Child Process
* `node:permission-model:worker` — Worker Threads
* `node:permission-model:inspector` — Inspector
* `node:permission-model:wasi` — WASI
* `node:permission-model:addon` — Native Addons
* `node:permission-model:ffi` — FFI

Message တစ်ခုချင်းစီက အောက်ပါ properties တွေ ပါဝင်တဲ့ object တစ်ခုပါ:

* `permission` {string} ငြင်းပယ်လိုက်တဲ့ permission scope ရဲ့ နာမည်။
* `resource` {string} ဝင်ရောက်ခွင့် ငြင်းပယ်ခံရတဲ့ resource (ဥပမာ file path တစ်ခု (သို့) host တစ်ခု)။

```js
const diagnostics_channel = require('node:diagnostics_channel');

diagnostics_channel.channel('node:permission-model:fs').subscribe((msg) => {
  console.log(`Permission denied: ${msg.permission} on ${msg.resource}`);
});

// Running with --permission-audit, this publishes a diagnostics channel
// message but does not throw
const fs = require('node:fs');
fs.readFileSync('/etc/passwd');
```

[`--permission`][] ရော [`--permission-audit`][] ရော နှစ်ခုလုံး သတ်မှတ်ထားရင် — `--permission` က ဦးစားပေးပြီး Permission Model က enforce mode နဲ့ run ပါတယ်။

#### File System Permissions (file system ဆိုင်ရာ ခွင့်ပြုချက်များ)

Permission Model က default အနေနဲ့ `node:fs` module ကနေတစ်ဆင့် file system ကို ဝင်ရောက်ခွင့်ကို ကန့်သတ်ပါတယ်။ ၎င်းက — `node:sqlite` module လိုမျိုး တခြားနည်းလမ်းတွေကနေတစ်ဆင့် user တွေ file system ကို ဝင်ရောက်လို့ မရအောင်တော့ အာမခံပေးတာ မဟုတ်ပါဘူး။

File system ကို ဝင်ရောက်ခွင့် ပြုဖို့ [`--allow-fs-read`][] နဲ့ [`--allow-fs-write`][] flags တွေကို သုံးပါ:

```console
$ node --permission --allow-fs-read=* --allow-fs-write=* index.js
Hello world!
```

Default အနေနဲ့ — သင့် application ရဲ့ entrypoints တွေက file system read ခွင့်ပြုစာရင်းထဲမှာ ပါဝင်ပါတယ်။ ဥပမာ:

```console
$ node --permission index.js
```

* `index.js` က file system read ခွင့်ပြုစာရင်းထဲမှာ ပါဝင်ပါလိမ့်မယ်

```console
$ node -r /path/to/custom-require.js --permission index.js
```

* `/path/to/custom-require.js` က file system read ခွင့်ပြုစာရင်းထဲမှာ ပါဝင်ပါလိမ့်မယ်။
* `index.js` က file system read ခွင့်ပြုစာရင်းထဲမှာ ပါဝင်ပါလိမ့်မယ်။

Flag နှစ်ခုလုံးအတွက် တရားဝင် (valid) arguments တွေကတော့:

* `*` - သက်ဆိုင်ရာ `FileSystemRead` (သို့) `FileSystemWrite` operations တွေ အားလုံးကို ခွင့်ပြုဖို့။
* လက်ရှိ working directory နဲ့ နှိုင်းယှဉ်ထားတဲ့ Relative paths တွေ။
* Absolute paths တွေ။

ဥပမာ:

* `--allow-fs-read=*` - `FileSystemRead` operations တွေ အားလုံးကို ခွင့်ပြုပါလိမ့်မယ်။
* `--allow-fs-write=*` - `FileSystemWrite` operations တွေ အားလုံးကို ခွင့်ပြုပါလိမ့်မယ်။
* `--allow-fs-write=/tmp/` - `/tmp/` folder ဆီကို `FileSystemWrite` ဝင်ရောက်ခွင့် ပေးပါလိမ့်မယ်။
* `--allow-fs-read=/tmp/ --allow-fs-read=/home/.gitignore` - `/tmp/` folder ရော `/home/.gitignore` path ရော နှစ်ခုလုံးဆီကို `FileSystemRead` ဝင်ရောက်ခွင့် ပေးပါလိမ့်မယ်။

Wildcards တွေကိုလည်း support လုပ်ပါတယ်:

* `--allow-fs-read=/home/test*` က wildcard နဲ့ ကိုက်ညီတဲ့ အရာအားလုံးကို read လုပ်ခွင့် ပေးပါလိမ့်မယ်။ ဥပမာ: `/home/test/file1` (သို့) `/home/test2`

Wildcard character (`*`) တစ်ခု ပေးပြီးတဲ့အခါ — နောက်မှာ ပါလာတဲ့ characters တွေ အားလုံးကို လျစ်လျူရှုပါတယ်။ ဥပမာ: `/home/*.js` က `/home/*` နဲ့ အလားတူ အလုပ်လုပ်ပါလိမ့်မယ်။

Permission model ကို initialize လုပ်တဲ့အခါ — သတ်မှတ်ထားတဲ့ directory ရှိနေရင် wildcard (\*) တစ်ခုကို အလိုအလျောက် ထပ်ဖြည့်ပေးပါတယ်။ ဥပမာ — `/home/test/files` ရှိနေရင် ၎င်းကို `/home/test/files/*` အနေနဲ့ သဘောထားပါတယ်။ ဒါပေမယ့် directory မရှိဘူးဆိုရင် — wildcard ကို ထပ်ဖြည့်ပေးမှာ မဟုတ်ဘဲ — ဝင်ရောက်ခွင့်က `/home/test/files` အတိုင်းပဲ ကန့်သတ်ခံရပါလိမ့်မယ်။ မရှိသေးတဲ့ folder တစ်ခုဆီကို ဝင်ရောက်ခွင့် ပေးချင်ရင် — wildcard ကို အတိအလင်း ထည့်သွင်းပေးဖို့ သေချာစေပါ: `/my-path/folder-do-not-exist/*`။

#### Configuration file support (configuration file ပံ့ပိုးမှု)

Permission flags တွေကို command line မှာ ပေးတာအပြင် — experimental ဖြစ်တဲ့ \[`--experimental-config-file`]\[] flag ကို သုံးတဲ့အခါ Node.js configuration file တစ်ခုထဲမှာလည်း ကြေညာနိုင်ပါတယ်။ Permission options တွေကို `permission` top-level object ရဲ့ အတွင်းမှာ ထားရပါမယ်။

ဥပမာ `node.config.json`:

```json
{
  "permission": {
    "allow-fs-read": ["./foo"],
    "allow-fs-write": ["./bar"],
    "allow-child-process": true,
    "allow-worker": true,
    "allow-net": true,
    "allow-addons": false,
    "allow-ffi": false,
    "allow-openssl-store": false
  }
}
```

Configuration file ထဲမှာ `permission` namespace ပါဝင်နေရင် — Node.js က `--permission` flag ကို အလိုအလျောက် enable လုပ်ပါတယ်။ အောက်ပါအတိုင်း run ပါ:

```console
$ node --experimental-default-config-file app.js
```

#### Permission Model ကို `npx` နဲ့ သုံးခြင်း (Using the Permission Model with `npx`)

Node.js script တစ်ခုကို execute လုပ်ဖို့ [`npx`][] ကို သုံးနေတယ်ဆိုရင် — `--node-options` flag ကို ပေးပြီး Permission Model ကို enable လုပ်နိုင်ပါတယ်။ ဥပမာ:

```bash
npx --node-options="--permission" package-name
```

ဒါက [`npx`][] က spawn လုပ်လိုက်တဲ့ Node.js processes တွေ အားလုံးအတွက် `NODE_OPTIONS` environment variable ကို သတ်မှတ်ပေးပြီး — `npx` process ကိုယ်တိုင်ကိုတော့ မထိခိုက်ပါဘူး။

**`npx` နဲ့ ဖြစ်ပေါ်တတ်တဲ့ FileSystemRead Error**

အပေါ်က command က `FileSystemRead` invalid access error တစ်ခုကို throw လုပ်နိုင်ခြေ များပါတယ် — ဘာလို့လဲဆိုတော့ package ကို ရှာဖွေပြီး execute လုပ်ဖို့ Node.js က file system read ဝင်ရောက်ခွင့် လိုအပ်လို့ပါ။ ရှောင်ရှားဖို့:

1. **Globally တပ်ဆင်ထားတဲ့ package တစ်ခုကို သုံးခြင်း (Using a Globally Installed Package)**
   Global `node_modules` directory ဆီကို read ခွင့် ပေးဖို့ အောက်ပါအတိုင်း run ပါ:

   ```bash
   npx --node-options="--permission --allow-fs-read=$(npm prefix -g)" package-name
   ```

2. **`npx` cache ကို သုံးခြင်း (Using the `npx` Cache)**
   Package ကို ယာယီ တပ်ဆင်နေတာ (သို့) `npx` cache ကို အားကိုးနေတာဆိုရင် — npm cache directory ဆီကို read ခွင့် ပေးပါ:

   ```bash
   npx --node-options="--permission --allow-fs-read=$(npm config get cache)" package-name
   ```

သာမန်အားဖြင့် `node` ဆီကို ပေးလေ့ရှိတဲ့ arguments တွေ (ဥပမာ `--allow-*` flags) ကိုလည်း `--node-options` flag ကနေတစ်ဆင့် ပေးပို့နိုင်ပါတယ်။ ဒီလို ပြောင်းလွယ်ပြင်လွယ်ရှိမှုက `npx` သုံးတဲ့အခါ လိုအပ်သလို permissions တွေကို configure လုပ်ရတာ လွယ်ကူစေပါတယ်။

#### Permission Model ၏ ကန့်သတ်ချက်များ (Permission Model constraints)

ဒီ system ကို မသုံးခင် သိထားရမယ့် ကန့်သတ်ချက်တွေ ရှိပါတယ်:

* ဒီ model က worker thread တစ်ခုဆီကို အမွေမဆက်ခံပါဘူး။
* Permission Model ကို သုံးတဲ့အခါ အောက်ပါ features တွေကို ကန့်သတ်ခံရပါလိမ့်မယ်:
  * Native modules
  * Network
  * Child process
  * Worker Threads
  * Inspector protocol
  * File system access
  * WASI
  * FFI
  * OpenSSL STORE loaders
* Permission Model ကို Node.js environment တည်ဆောက်ပြီးမှ initialize လုပ်ပါတယ်။ ဒါပေမယ့် `--env-file` (သို့) `--openssl-config` လိုမျိုး flag တချို့က environment initialization မဖြစ်ခင်ကတည်းက files တွေကို ဖတ်ဖို့ ဒီဇိုင်းလုပ်ထားပါတယ်။ ဒါကြောင့် — အဲဒီလို flags တွေက Permission Model ရဲ့ စည်းမျဉ်းတွေကို မလိုက်နာပါဘူး။ Runtime ကနေတစ်ဆင့် `v8.setFlagsFromString` နဲ့ သတ်မှတ်လို့ရတဲ့ V8 flags တွေအတွက်လည်း အလားတူပါပဲ။
* Permission Model enable လုပ်ထားတဲ့အခါ — runtime မှာ OpenSSL engines တွေကို တောင်းဆိုလို့ မရတော့ဘဲ — built-in crypto, https, နဲ့ tls modules တွေကို ထိခိုက်စေပါတယ်။
* Permission Model enable လုပ်ထားတဲ့အခါ — Run-Time Loadable Extensions တွေကို load လုပ်လို့ မရတော့ဘဲ — sqlite module ကို ထိခိုက်စေပါတယ်။
* `node:fs` module ကနေတစ်ဆင့် ရှိပြီးသား file descriptors တွေကို အသုံးပြုတာက Permission Model ကို ကျော်လွှားသွားပါတယ်။

#### process.\_debugProcess() နဲ့ process အချင်းချင်း Inspector activation လုပ်ခြင်း (process._debugProcess() and cross-process Inspector activation)

`kInspector` permission scope က လက်ရှိ process က ကိုယ်ပိုင် V8 Inspector ကို ဖွင့်ခြင်းကနေ ကန့်သတ်ပါတယ်။ ဒါပေမယ့် — ပြင်ပ process တစ်ခုဆီကို OS-level signal (POSIX မှာ SIGUSR1, Windows မှာ remote thread) ပို့ပေးတဲ့ process._debugProcess(pid) ကတော့ — `kInspector` scope (သို့) Permission Model ရဲ့ တခြား scope တစ်ခုခုရဲ့ ထိန်းချုပ်မှုအောက်မှာ မရှိပါဘူး။

`--permission` အောက်မှာ run နေပြီး ထပ်ဆောင်း grants တွေ မပါတဲ့ sandboxed process တစ်ခုက process._debugProcess(pid) ကို ခေါ်ပြီး — တခြား Node.js process တစ်ခုကို သူ့ရဲ့ V8 Inspector ဖွင့်ဖို့ အတင်းအကျပ် လုပ်နိုင်ပါတယ်။ Target process က `--permission` အောက်မှာ run နေဖို့ မလိုပါဘူး — host တစ်ခုတည်းပေါ်မှာ OS user တစ်ခုတည်းနဲ့ run နေတဲ့ Node.js process တိုင်းကို signal ပို့နိုင်ပါတယ်။

ဒါက Node.js ရဲ့ threat model နဲ့ ကိုက်ညီပါတယ်: Node.js က သူ run နေတဲ့ OS environment ကို ယုံကြည်ပါတယ်။ Process အချင်းချင်း signaling ဆိုတာ operating-system-level capability တစ်ခုပါ; ၎င်းကို ကန့်သတ်ခြင်းက operator ရဲ့ တာဝန်ပါ (ဥပမာ — OS-level process isolation, process တစ်ခုစီအတွက် သီးခြား OS users, (သို့) Linux ပေါ်မှာ seccomp/AppArmor profiles တွေ အသုံးပြုခြင်းအားဖြင့်)။

`--permission` ကို မယုံကြည်ရတဲ့ code တွေကို sandbox လုပ်ဖို့ အားကိုးနေတဲ့ developers တွေ သတိထားသင့်တာကတော့:

* process._debugProcess() ကို grants မပါတဲ့ sandboxed process ဘယ်ကနေမဆို ခေါ်လို့ ရပါတယ်။
* Target Node.js process တစ်ခုက host တစ်ခုတည်းပေါ်မှာ OS user တစ်ခုတည်းနဲ့ run နေရင် — ဒီ API ကနေတစ်ဆင့် သူ့ရဲ့ Inspector ကို ဖွင့်ဖို့ အတင်းအကျပ် လုပ်ခံရနိုင်ပါတယ်။
* ဒါကို ကာကွယ်ဖို့ — sandboxed နဲ့ target processes တွေကို မတူညီတဲ့ OS users တွေနဲ့ run ပါ (သို့) Node.js ရဲ့ အပြင်ဘက်မှာ OS-level isolation mechanisms တွေ သုံးပါ။

#### ကန့်သတ်ချက်များနဲ့ သိရှိပြီးသား ပြဿနာများ (Limitations and Known Issues)

* ဝင်ရောက်ခွင့် ပေးထားတဲ့ paths အစုအဝေးရဲ့ အပြင်ဘက်က နေရာတွေကိုတောင် symbolic links တွေက လိုက်ပါသွားပါလိမ့်မယ်။ Relative symbolic links တွေက ကန့်သတ်ချက်မရှိ files နဲ့ directories တွေဆီကို ဝင်ရောက်ခွင့် ဖြစ်စေနိုင်ပါတယ်။ Permission model enable လုပ်ပြီး applications တွေကို စတင်တဲ့အခါ — ဝင်ရောက်ခွင့် ပေးထားတဲ့ paths တွေထဲမှာ relative symbolic links တွေ မပါဝင်စေဖို့ သေချာစေရပါမယ်။

[Security Policy]: https://github.com/nodejs/node/blob/main/SECURITY.md
[`--allow-addons`]: cli.md#--allow-addons
[`--allow-child-process`]: cli.md#--allow-child-process
[`--allow-ffi`]: cli.md#--allow-ffi
[`--allow-fs-read`]: cli.md#--allow-fs-read
[`--allow-fs-write`]: cli.md#--allow-fs-write
[`--allow-net`]: cli.md#--allow-net
[`--allow-openssl-store`]: cli.md#--allow-openssl-store
[`--allow-wasi`]: cli.md#--allow-wasi
[`--allow-worker`]: cli.md#--allow-worker
[`--permission-audit`]: cli.md#--permission-audit
[`--permission`]: cli.md#--permission
[`crypto.createPrivateKey()`]: crypto.md#cryptocreateprivatekeykey
[`npx`]: https://docs.npmjs.com/cli/commands/npx
[`permission.has()`]: process.md#processpermissionhasscope-reference
