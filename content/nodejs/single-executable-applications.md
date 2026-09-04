---
title: "Single executable applications"
description: "node:sea — Node.js မထည့်သွင်းရသေးတဲ့ system တွေမှာ run လို့ရတဲ့ single executable applications (SEA) ဖန်တီးခြင်း — `--build-sea` flag, preparation blobs, နဲ့ `node:sea` API (assets, snapshots, code cache စသည်)"
order: 129
source: "https://nodejs.org/api/single-executable-applications.html"
status: translated
updated: 2026-09-04
---

> Stability: 1.1 - Active development

ဒီ feature က Node.js application တစ်ခုကို Node.js မထည့်သွင်းထားတဲ့ system တစ်ခုဆီကို အဆင်ပြေပြေ ဖြန့်ဝေနိုင်အောင် ပံ့ပိုးပေးပါတယ်။

Node.js က [single executable applications][] ဖန်တီးခြင်းကို — Node.js က ပြင်ဆင်ထားတဲ့ (bundled script တစ်ခု ပါဝင်နိုင်တဲ့) blob တစ်ခုကို `node` binary ထဲကို ထည့်သွင်း (inject) ခွင့်ပြုခြင်းအားဖြင့် — support လုပ်ပါတယ်။ စတင်ချိန်မှာ program က တစ်စုံတစ်ခု ထည့်သွင်းထားလားဆိုတာ စစ်ဆေးပါတယ်။ Blob ကို တွေ့ရင် — blob ထဲက script ကို execute လုပ်ပါတယ်။ မတွေ့ရင်တော့ Node.js က ပုံမှန်အတိုင်း အလုပ်လုပ်ပါတယ်။

Single executable application feature က [CommonJS][] (သို့) [ECMAScript Modules][] module system ကို သုံးပြီး embedded script တစ်ခုတည်းကို run လုပ်တာကို support လုပ်ပါတယ်။

User တွေက ကိုယ့်ရဲ့ bundled script ကနေ `node` binary ကိုယ်တိုင်နဲ့ဖြစ်စေ, binary ထဲကို resources တွေ ထည့်သွင်းနိုင်တဲ့ ဘယ် tool နဲ့ဖြစ်စေ single executable application တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။

1. JavaScript file တစ်ခု ဖန်တီးပါ:
   ```bash
   echo 'console.log(`Hello, ${process.argv[2]}!`);' > hello.js
   ```

2. Single executable application ထဲကို ထည့်သွင်းလို့ရတဲ့ blob တစ်ခုကို တည်ဆောက်ပေးမယ့် configuration file တစ်ခု ဖန်တီးပါ (အသေးစိတ်အတွက် [Generating single executable preparation blobs][] ကို ကြည့်ပါ):

   * Windows မဟုတ်တဲ့ systems တွေမှာ:

   ```bash
   echo '{ "main": "hello.js", "output": "sea" }' > sea-config.json
   ```

   * Windows မှာ:

   ```bash
   echo '{ "main": "hello.js", "output": "sea.exe" }' > sea-config.json
   ```

   `.exe` extension က မဖြစ်မနေ လိုအပ်ပါတယ်။

3. Target executable ကို generate လုပ်ပါ:
   ```bash
   node --build-sea sea-config.json
   ```

4. Binary ကို sign လုပ်ပါ (macOS နဲ့ Windows မှာပဲ):

   * macOS မှာ:

   ```bash
   codesign --sign - sea
   ```

   * Windows မှာ (optional):

   ဒါ အလုပ်လုပ်ဖို့ certificate တစ်ခု ရှိနေဖို့ လိုပါတယ်။ ဒါပေမယ့် unsigned binary က ပြေးလို့ ရနေပါသေးတယ်။

   ```powershell
   signtool sign /fd SHA256 sea.exe
   ```

5. Binary ကို run လုပ်ပါ:

   * Windows မဟုတ်တဲ့ systems တွေမှာ

   ```console
   $ ./sea world
   Hello, world!
   ```

   * Windows မှာ

   ```console
   $ .\sea.exe world
   Hello, world!
   ```

## `--build-sea` ဖြင့် single executable applications များ ထုတ်လုပ်ခြင်း (Generating single executable applications with `--build-sea`)

Single executable application တစ်ခုကို တိုက်ရိုက် generate လုပ်ဖို့ `--build-sea` flag ကို သုံးနိုင်ပါတယ်။ ဒီ flag က JSON format နဲ့ configuration file တစ်ခုရဲ့ path ကို လက်ခံပါတယ်။ ပေးလိုက်တဲ့ path က absolute မဟုတ်ရင် — Node.js က လက်ရှိ working directory ကနေ ဆက်စပ်တဲ့ (relative) path ကို သုံးပါတယ်။

Configuration က လောလောဆယ် အောက်ပါ top-level fields တွေကို ဖတ်ပါတယ်:

```json
{
  "main": "/path/to/bundled/script.js",
  "mainFormat": "commonjs", // Default: "commonjs", options: "commonjs", "module"
  "executable": "/path/to/node/binary", // Optional, if not specified, uses the current Node.js binary
  "output": "/path/to/write/the/generated/executable",
  "disableExperimentalSEAWarning": true, // Default: false
  "useSnapshot": false,  // Default: false
  "useCodeCache": true, // Default: false
  "execArgv": ["--no-warnings", "--max-old-space-size=4096"], // Optional
  "execArgvExtension": "env", // Default: "env", options: "none", "env", "cli"
  "assets": {  // Optional
    "a.dat": "/path/to/a.dat",
    "b.txt": "/path/to/b.txt"
  }
}
```

Paths တွေ absolute မဟုတ်ရင် — Node.js က လက်ရှိ working directory ကနေ ဆက်စပ်တဲ့ path ကို သုံးပါတယ်။ Blob ကို ထုတ်လုပ်ဖို့ သုံးတဲ့ Node.js binary ရဲ့ version က blob ကို ထည့်သွင်းမယ့် binary ရဲ့ version နဲ့ တူညိနေရပါမယ်။

မှတ်ချက်: Cross-platform SEAs တွေ ထုတ်လုပ်တဲ့အခါ (ဥပမာ — `darwin-arm64` ပေါ်မှာ `linux-x64` အတွက် SEA တစ်ခု ထုတ်လုပ်တာမျိုး) — သဟဇာတ မဖြစ်တဲ့ executables တွေ မထွက်လာစေဖို့ `useCodeCache` နဲ့ `useSnapshot` တွေကို `false` အဖြစ် သတ်မှတ်ထားရပါမယ်။ Code cache နဲ့ snapshots တွေက compile လုပ်ခဲ့တဲ့ platform တစ်ခုတည်းမှာပဲ load လို့ရတာမို့ — မတူညီတဲ့ platform တစ်ခုပေါ်မှာ တည်ဆောက်ထားတဲ့ code cache (သို့) snapshots တွေကို load ဖို့ ကြိုးစားတဲ့အခါ generated executable က startup မှာ crash ဖြစ်နိုင်ပါတယ်။

### Assets (assets များ)

User တွေက configuration ရဲ့ `assets` field အနေနဲ့ key-path dictionary တစ်ခုကို ထည့်ပေးခြင်းအားဖြင့် assets တွေ ထည့်သွင်းနိုင်ပါတယ်။ Build လုပ်ချိန်မှာ Node.js က သတ်မှတ်ထားတဲ့ paths တွေကနေ assets တွေကို ဖတ်ပြီး preparation blob ထဲကို ထည့်သွင်းပါတယ်။ Generated executable ထဲမှာတော့ user တွေက [`sea.getAsset()`][] နဲ့ [`sea.getAssetAsBlob()`][] APIs တွေကို သုံးပြီး assets တွေကို ပြန်ယူနိုင်ပါတယ်။

```json
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/executable",
  "assets": {
    "a.jpg": "/path/to/a.jpg",
    "b.txt": "/path/to/b.txt"
  }
}
```

Single-executable application က assets တွေကို အောက်ပါအတိုင်း ဝင်ရောက်သုံးနိုင်ပါတယ်:

```cjs
const { getAsset, getAssetAsBlob, getRawAsset, getAssetKeys } = require('node:sea');
// Get all asset keys.
const keys = getAssetKeys();
console.log(keys); // ['a.jpg', 'b.txt']
// Returns a copy of the data in an ArrayBuffer.
const image = getAsset('a.jpg');
// Returns a string decoded from the asset as UTF8.
const text = getAsset('b.txt', 'utf8');
// Returns a Blob containing the asset.
const blob = getAssetAsBlob('a.jpg');
// Returns an ArrayBuffer containing the raw asset without copying.
const raw = getRawAsset('a.jpg');
```

[`sea.getAsset()`][], [`sea.getAssetAsBlob()`][], [`sea.getRawAsset()`][] နဲ့ [`sea.getAssetKeys()`][] APIs တွေရဲ့ နောက်ထပ် အချက်အလက်တွေအတွက် သက်ဆိုင်ရာ documentation တွေကို ကြည့်ပါ။

### Startup snapshot support (startup snapshot ပံ့ပိုးမှု)

`useSnapshot` field ကို startup snapshot support ဖွင့်ဖို့ သုံးနိုင်ပါတယ်။ ဒီကိစ္စမှာ `main` script ကို နောက်ဆုံး executable စတင်တဲ့အခါ execute လုပ်မှာ မဟုတ်ပဲ — build လုပ်တဲ့ machine ပေါ်မှာ single executable application preparation blob ကို generate လုပ်တဲ့အခါ run လုပ်ပါလိမ့်မယ်။ အဲဒီလို generate လုပ်ထားတဲ့ preparation blob ထဲမှာ `main` script က initialize လုပ်ထားတဲ့ states တွေကို ဖမ်းယူထားတဲ့ snapshot တစ်ခု ပါဝင်ပါလိမ့်မယ်။ Preparation blob ကို ထည့်သွင်းထားတဲ့ နောက်ဆုံး executable က run ချိန်မှာ snapshot ကို deserialize လုပ်ပါလိမ့်မယ်။

`useSnapshot` က `true` ဖြစ်တဲ့အခါ — main script က user တွေ စတင်လိုက်တဲ့အခါ run ရမယ့် code တွေကို သတ်မှတ်ဖို့ [`v8.startupSnapshot.setDeserializeMainFunction()`][] API ကို ခေါ်ရပါမယ်။

Single executable application တစ်ခုမှာ snapshot သုံးဖို့ ပုံမှန် pattern ကတော့:

1. Build ချိန်မှာ, building machine ပေါ်မှာ — main script ကို user input လက်ခံဖို့ အသင့်ဖြစ်နေတဲ့ state တစ်ခုအထိ heap ကို initialize လုပ်ဖို့ run လုပ်ပါတယ်။ Script က [`v8.startupSnapshot.setDeserializeMainFunction()`][] နဲ့ main function တစ်ခုကိုလည်း configure လုပ်သင့်ပါတယ်။ ဒီ function ကို snapshot ထဲမှာ compile လုပ်ပြီး serialize လုပ်ထားပေမယ့် — build ချိန်မှာတော့ invoke လုပ်မှာ မဟုတ်ပါဘူး။
2. Run ချိန်မှာ — user ရဲ့ machine ပေါ်မှာ deserialize လုပ်ပြီးသား heap ပေါ်မှာ main function ကို run ပြီး user input တွေကို လုပ်ဆောင်ကာ output တွေ ထုတ်ပေးပါတယ်။

Startup snapshot scripts တွေရဲ့ ယေဘုယျ ကန့်သတ်ချက်တွေက single executable application အတွက် snapshot တည်ဆောက်ဖို့ သုံးတဲ့ main script မှာလည်း အလားတူ သက်ရောက်ပြီး — main script က ဒီ ကန့်သတ်ချက်တွေနဲ့ လိုက်လျောညီထွေ ဖြစ်အောင် [`v8.startupSnapshot` API][] ကို သုံးနိုင်ပါတယ်။ Node.js မှာ startup snapshot support အကြောင်း နောက်ထပ် အချက်အလက်တွေအတွက် [documentation about startup snapshot support in Node.js][] ကို ကြည့်ပါ။

### V8 code cache support (V8 code cache ပံ့ပိုးမှု)

Configuration ထဲမှာ `useCodeCache` ကို `true` အဖြစ် သတ်မှတ်ထားရင် — single executable preparation blob ကို generate လုပ်နေစဉ်အတွင်း Node.js က V8 code cache ကို ထုတ်လုပ်ဖို့ `main` script ကို compile လုပ်ပါလိမ့်မယ်။ Generated code cache က preparation blob ရဲ့ အစိတ်အပိုင်း ဖြစ်ပြီး နောက်ဆုံး executable ထဲကို ထည့်သွင်းခံရပါလိမ့်မယ်။ Single executable application ကို စတင်တဲ့အခါ — `main` script ကို အစကနေ compile လုပ်မယ့်အစား Node.js က code cache ကို သုံးပြီး compile လုပ်တာကို မြန်ဆန်စေကာ script ကို execute လုပ်ပါတယ် — ဒါက startup performance ကို တိုးတက်စေပါတယ်။

**မှတ်ချက်:** `useCodeCache` က `true` ဖြစ်နေတုန်း `import()` က အလုပ်မလုပ်ပါဘူး။

### Execution arguments (execution arguments များ)

`execArgv` field ကို — single executable application စတင်တဲ့အခါ အလိုအလျောက် သက်ရောက်စေမယ့် Node.js-specific arguments တွေကို သတ်မှတ်ဖို့ သုံးနိုင်ပါတယ်။ ဒါက application developers တွေကို end users တွေ ဒီ flags တွေအကြောင်း သိစရာမလိုပဲ Node.js runtime options တွေကို configure လုပ်နိုင်စေပါတယ်။

ဥပမာ — အောက်ပါ configuration:

```json
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/executable",
  "execArgv": ["--no-warnings", "--max-old-space-size=2048"]
}
```

ကတော့ SEA ကို `--no-warnings` နဲ့ `--max-old-space-size=2048` flags တွေနဲ့ စတင်စေပါလိမ့်မယ်။ Executable ထဲမှာ ထည့်သွင်းထားတဲ့ scripts တွေမှာ ဒီ flags တွေကို `process.execArgv` property ကနေ ဝင်ရောက်ကြည့်ရှုနိုင်ပါတယ်:

```js
// If the executable is launched with `sea user-arg1 user-arg2`
console.log(process.execArgv);
// Prints: ['--no-warnings', '--max-old-space-size=2048']
console.log(process.argv);
// Prints ['/path/to/sea', 'path/to/sea', 'user-arg1', 'user-arg2']
```

User က ပေးတဲ့ arguments တွေက index 2 ကနေ စပြီး `process.argv` array ထဲမှာ ရှိပါတယ် — application ကို အောက်ပါအတိုင်း စတင်ခဲ့တာနဲ့ ဆင်တူပါတယ်:

```console
node --no-warnings --max-old-space-size=2048 /path/to/bundled/script.js user-arg1 user-arg2
```

### Execution argument extension (execution argument များ တိုးချဲ့ခြင်း)

`execArgvExtension` field က `execArgv` field ထဲမှာ သတ်မှတ်ထားတာတွေအပြင် နောက်ထပ် execution arguments တွေကို ဘယ်လို ပေးနိုင်လဲဆိုတာကို ထိန်းချုပ်ပါတယ်။ ၎င်းက string တန်ဖိုး သုံးခုအနက် တစ်ခုကို လက်ခံပါတယ်:

* `"none"`: Extension ဘာမှ ခွင့်မပြုပါဘူး။ `execArgv` ထဲမှာ သတ်မှတ်ထားတဲ့ arguments တွေကိုပဲ သုံးမှာ ဖြစ်ပြီး — `NODE_OPTIONS` environment variable ကို လျစ်လျူရှုပါလိမ့်မယ်။
* `"env"`: _(Default)_ `NODE_OPTIONS` environment variable က execution arguments တွေကို တိုးချဲ့ပေးနိုင်ပါတယ်။ ဒါက backward compatibility ကို ထိန်းသိမ်းဖို့ default အပြုအမူ ဖြစ်ပါတယ်။
* `"cli"`: Executable ကို `--node-options="--flag1 --flag2"` နဲ့ စတင်နိုင်ပြီး — အဲဒီ flags တွေကို user script ဆီကို ပေးပို့မယ့်အစား Node.js အတွက် execution arguments တွေအနေနဲ့ parse လုပ်ပါလိမ့်မယ်။ ဒါက `NODE_OPTIONS` environment variable က support မလုပ်တဲ့ arguments တွေကို သုံးနိုင်စေပါတယ်။

ဥပမာ — `"execArgvExtension": "cli"` နဲ့ဆိုရင်:

```json
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/executable",
  "execArgv": ["--no-warnings"],
  "execArgvExtension": "cli"
}
```

Executable ကို အောက်ပါအတိုင်း စတင်နိုင်ပါတယ်:

```console
./my-sea --node-options="--trace-exit" user-arg1 user-arg2
```

ဒါက အောက်ပါအတိုင်း run လုပ်တာနဲ့ ညီမျှပါတယ်:

```console
node --no-warnings --trace-exit /path/to/bundled/script.js user-arg1 user-arg2
```

## Single-executable application API (single-executable application ၏ API)

`node:sea` builtin က executable ထဲမှာ ထည့်သွင်းထားတဲ့ JavaScript main script ကနေ single-executable application နဲ့ အပြန်အလှန် ဆက်သွယ်နိုင်အောင် ပံ့ပိုးပေးပါတယ်။

### `sea.isSea()`

* Returns: {boolean} ဒီ script က single-executable application တစ်ခုအတွင်းမှာ run နေလားဆိုတာပါ။

### `sea.getAsset(key[, encoding])`

ဒီ method ကို build လုပ်ချိန်မှာ single-executable application ထဲကို bundle လုပ်ဖို့ configure လုပ်ထားတဲ့ assets တွေကို ပြန်ယူဖို့ သုံးနိုင်ပါတယ်။ ကိုက်ညီတဲ့ asset တစ်ခုကို ရှာမတွေ့ရင် error တစ်ခု throw လုပ်ပါတယ်။

* `key` {string} Single-executable application configuration ရဲ့ `assets` field မှာ သတ်မှတ်ထားတဲ့ dictionary ထဲက asset ရဲ့ key ပါ။
* `encoding` {string} သတ်မှတ်ထားရင် — asset ကို string တစ်ခုအနေနဲ့ decode လုပ်ပါလိမ့်မယ်။ `TextDecoder` က support လုပ်တဲ့ ဘယ် encoding မဆို လက်ခံပါတယ်။ မသတ်မှတ်ထားရင်တော့ — asset ရဲ့ copy တစ်ခု ပါဝင်တဲ့ `ArrayBuffer` တစ်ခုကို ပြန်ပေးပါလိမ့်မယ်။
* Returns: {string|ArrayBuffer}

### `sea.getAssetAsBlob(key[, options])`

[`sea.getAsset()`][] နဲ့ ဆင်တူပေမယ့် — ရလဒ်ကို {Blob} တစ်ခုအနေနဲ့ ပြန်ပေးပါတယ်။ ကိုက်ညီတဲ့ asset တစ်ခုကို ရှာမတွေ့ရင် error တစ်ခု throw လုပ်ပါတယ်။

* `key` {string} Single-executable application configuration ရဲ့ `assets` field မှာ သတ်မှတ်ထားတဲ့ dictionary ထဲက asset ရဲ့ key ပါ။
* `options` {Object}
  * `type` {string} Blob အတွက် optional mime type တစ်ခုပါ။
* Returns: {Blob}

### `sea.getRawAsset(key)`

ဒီ method ကို build လုပ်ချိန်မှာ single-executable application ထဲကို bundle လုပ်ဖို့ configure လုပ်ထားတဲ့ assets တွေကို ပြန်ယူဖို့ သုံးနိုင်ပါတယ်။ ကိုက်ညီတဲ့ asset တစ်ခုကို ရှာမတွေ့ရင် error တစ်ခု throw လုပ်ပါတယ်။

`sea.getAsset()` (သို့) `sea.getAssetAsBlob()` တွေနဲ့ မတူတာက — ဒီ method က copy တစ်ခုကို မပြန်ပေးပဲ executable ထဲမှာ ထည့်သွင်းထားတဲ့ raw asset ကိုပဲ ပြန်ပေးပါတယ်။

လောလောဆယ်တော့ user တွေက ပြန်ပေးလိုက်တဲ့ array buffer ဆီကို မရေးသင့်ပါဘူး။ ထည့်သွင်းထားတဲ့ section က writable အဖြစ် မှတ်သားမထားရင် (သို့) ကောင်းမွန်စွာ align မလုပ်ထားရင် — ပြန်ပေးလိုက်တဲ့ array buffer ဆီကို ရေးတာက crash တစ်ခုကို ဖြစ်စေနိုင်ခြေ များပါတယ်။

* `key` {string} Single-executable application configuration ရဲ့ `assets` field မှာ သတ်မှတ်ထားတဲ့ dictionary ထဲက asset ရဲ့ key ပါ။
* Returns: {ArrayBuffer}

### `sea.getAssetKeys()`

* Returns {string\[]} Executable ထဲမှာ ထည့်သွင်းထားတဲ့ assets တွေရဲ့ keys တွေ အားလုံး ပါဝင်တဲ့ array တစ်ခုပါ။ Assets တွေ ထည့်သွင်းမထားရင် empty array တစ်ခုကို ပြန်ပေးပါတယ်။

ဒီ method ကို single-executable application ထဲမှာ ထည့်သွင်းထားတဲ့ assets တွေရဲ့ keys တွေ အားလုံးရဲ့ array တစ်ခုကို ပြန်ယူဖို့ သုံးနိုင်ပါတယ်။ Single-executable application တစ်ခုအတွင်းမှာ run မနေရင် error တစ်ခု throw လုပ်ပါတယ်။

## Injected main script အတွင်း (In the injected main script)

### Module format of the injected main script (injected main script ၏ module format)

Node.js က injected main script ကို ဘယ်လို အဓိပ္ပာယ် ဖွင့်ဆိုသင့်လဲ သတ်မှတ်ဖို့ — single-executable application configuration ထဲက `mainFormat` field ကို သုံးပါ။ လက်ခံတဲ့ တန်ဖိုးတွေက:

* `"commonjs"`: Injected main script ကို CommonJS module တစ်ခုအနေနဲ့ သဘောထားပါတယ်။
* `"module"`: Injected main script ကို ECMAScript module တစ်ခုအနေနဲ့ သဘောထားပါတယ်။

`mainFormat` field ကို မသတ်မှတ်ထားရင် — `"commonjs"` ကို default အနေနဲ့ သုံးပါတယ်။

လောလောဆယ် `"mainFormat": "module"` ကို `"useSnapshot"` နဲ့တွဲ သုံးလို့ မရပါဘူး။

### Injected main script ထဲမှာ module loading (Module loading in the injected main script)

Injected main script ထဲမှာ module loading က file system ကနေ ဖတ်ခြင်း မလုပ်ပါဘူး။ Default အနေနဲ့ `require()` ရော `import` statements ရော built-in modules တွေကိုပဲ load လုပ်နိုင်မှာ ဖြစ်ပြီး — file system ထဲမှာပဲ တွေ့နိုင်တဲ့ module တစ်ခုကို load ဖို့ ကြိုးစားရင် error တစ်ခု throw လုပ်ပါလိမ့်မယ်။

User တွေက ကိုယ့် application ကို executable ထဲကို ထည့်သွင်းဖို့ standalone JavaScript file တစ်ခုတည်းအဖြစ် bundle လုပ်နိုင်ပါတယ်။ ဒါက ပိုပြီး တသမတ်တည်း ဖြစ်တဲ့ dependency graph တစ်ခုကိုလည်း သေချာစေပါတယ်။

Injected main script ထဲမှာ file system ကနေ modules တွေကို load ဖို့ — `module.createRequire()` ကို သုံးပြီး file system ကနေ load လုပ်နိုင်တဲ့ `require` function တစ်ခုကို ဖန်တီးနိုင်ပါတယ်။ ဥပမာ — CommonJS entry point တစ်ခုမှာ:

```js
const { createRequire } = require('node:module');
require = createRequire(__filename);
```

### Injected main script ထဲမှာ `require()` (`require()` in the injected main script)

Injected main script ထဲက `require()` က injected မဟုတ်တဲ့ modules တွေမှာ ရနိုင်တဲ့ [`require()`][] နဲ့ အတူတူ မဟုတ်ပါဘူး။ လောလောဆယ် ၎င်းမှာ [`require.main`][] ကလွဲလို့ injected မဟုတ်တဲ့ [`require()`][] မှာ ရှိတဲ့ properties တွေ ဘာမှ မရှိပါဘူး။

### Injected main script ထဲမှာ `__filename` နဲ့ `module.filename` (`__filename` and `module.filename` in the injected main script)

Injected main script ထဲက `__filename` နဲ့ `module.filename` တန်ဖိုးတွေက [`process.execPath`][] နဲ့ ညီမျှပါတယ်။

### Injected main script ထဲမှာ `__dirname` (`__dirname` in the injected main script)

Injected main script ထဲက `__dirname` တန်ဖိုးက [`process.execPath`][] ရဲ့ directory name နဲ့ ညီမျှပါတယ်။

### Injected main script ထဲမှာ `import.meta` (`import.meta` in the injected main script)

`"mainFormat": "module"` ကို သုံးတဲ့အခါ — `import.meta` က injected main script ထဲမှာ အောက်ပါ properties တွေနဲ့ ရရှိနိုင်ပါတယ်:

* `import.meta.url`: [`process.execPath`][] နဲ့ ကိုက်ညီတဲ့ `file:` URL တစ်ခုပါ။
* `import.meta.filename`: [`process.execPath`][] နဲ့ ညီမျှပါတယ်။
* `import.meta.dirname`: [`process.execPath`][] ရဲ့ directory name ပါ။
* `import.meta.main`: `true`။

`import.meta.resolve` ကိုတော့ လောလောဆယ် support မလုပ်ပါဘူး။

### Injected main script ထဲမှာ `import()` (`import()` in the injected main script)

`"mainFormat": "module"` ကို သုံးတဲ့အခါ — `import()` ကို built-in modules တွေကို dynamically load လုပ်ဖို့ သုံးနိုင်ပါတယ်။ File system ကနေ modules တွေကို load ဖို့ `import()` ကို သုံးဖို့ ကြိုးစားရင်တော့ error တစ်ခု throw လုပ်ပါလိမ့်မယ်။

### Native addons တွေကို injected main script ထဲမှာ သုံးခြင်း (Using native addons in the injected main script)

Native addons တွေကို single executable application preparation blob ကို generate လုပ်ဖို့ သုံးတဲ့ configuration file ရဲ့ `assets` field ထဲမှာ သတ်မှတ်ခြင်းအားဖြင့် single-executable application ထဲကို assets တွေအနေနဲ့ bundle လုပ်နိုင်ပါတယ်။ အဲဒီနောက် addon ကို temporary file တစ်ခုဆီကို ရေးပြီး `process.dlopen()` နဲ့ load လုပ်ခြင်းအားဖြင့် injected main script ထဲမှာ load လုပ်နိုင်ပါတယ်။

```json
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/executable",
  "assets": {
    "myaddon.node": "/path/to/myaddon/build/Release/myaddon.node"
  }
}
```

```js
// script.js
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { getRawAsset } = require('node:sea');
const addonPath = path.join(os.tmpdir(), 'myaddon.node');
fs.writeFileSync(addonPath, new Uint8Array(getRawAsset('myaddon.node')));
const myaddon = { exports: {} };
process.dlopen(myaddon, addonPath);
console.log(myaddon.exports);
fs.rmSync(addonPath);
```

သိထားသင့်တဲ့ caveat (သတိထားစရာ) တစ်ခုကတော့: Single-executable application ကို Linux arm64 docker container တစ်ခုပေါ်မှာ postject နဲ့ ထုတ်လုပ်ရင် — [ထွက်လာတဲ့ ELF binary မှာ addons တွေကို load လုပ်ဖို့ မှန်ကန်တဲ့ hash table မပါတာမို့][postject-linux-arm64-issue] `process.dlopen()` မှာ crash ဖြစ်ပါလိမ့်မယ်။ ဒီပြဿနာကို ရှောင်ဖို့ single-executable application ကို တခြား platforms တွေပေါ်မှာ (သို့) အနည်းဆုံး container မဟုတ်တဲ့ Linux arm64 environment တစ်ခုပေါ်မှာ build လုပ်ပါ။

## မှတ်ချက်များ (Notes)

### Single executable application ဖန်တီးခြင်း လုပ်ငန်းစဉ် (Single executable application creation process)

ဒီမှာ မှတ်တမ်းတင်ထားတဲ့ လုပ်ငန်းစဉ်က ပြောင်းလဲနိုင်ပါတယ်။

#### 1. Single executable preparation blobs များ ထုတ်လုပ်ခြင်း (Generating single executable preparation blobs)

Single executable application တစ်ခုကို တည်ဆောက်ဖို့ — Node.js က bundled script ကို run လုပ်ဖို့ လိုအပ်တဲ့ အချက်အလက်တွေ အားလုံး ပါဝင်တဲ့ blob တစ်ခုကို အရင်ဆုံး generate လုပ်ပါလိမ့်မယ်။ `--build-sea` ကို သုံးတဲ့အခါ ဒီအဆင့်ကို injection နဲ့အတူ အတွင်းပိုင်းမှာ လုပ်ဆောင်ပါတယ်။

##### Preparation blob ကို disk ပေါ်ကို ထုတ်ရေးခြင်း (Dumping the preparation blob to disk)

`--build-sea` မမိတ်ဆက်ခင် — ပြင်ပ tools တွေက injection လုပ်ဖို့အတွက် preparation blob ကို disk ပေါ်ကို ရေးဖို့ နည်းလမ်းဟောင်း တစ်ခု မိတ်ဆက်ခဲ့ပါတယ်။ ဒါကို verification (စစ်ဆေးခြင်း) ရည်ရွယ်ချက်တွေအတွက် ဆက်ပြီး သုံးနိုင်ပါသေးတယ်။

Verification အတွက် preparation blob ကို disk ပေါ်ကို ထုတ်ရေးဖို့ — `--experimental-sea-config` ကို သုံးပါ။ ဒါက [postject][] လိုမျိုး tools တွေနဲ့ Node.js binary ထဲကို ထည့်သွင်းလို့ရတဲ့ file တစ်ခုကို ရေးပေးပါတယ်။

Configuration က `--build-sea` ရဲ့ ပုံစံနဲ့ ဆင်တူပြီး — `output` field က နောက်ဆုံး executable အစား generated blob file ရဲ့ path ကို သတ်မှတ်တာပဲ ကွာပါတယ်။

```json
{
  "main": "/path/to/bundled/script.js",
  // Instead of the final executable, this is the path to write the blob.
  "output": "/path/to/write/the/generated/blob.blob"
}
```

#### 2. Preparation blob ကို `node` binary ထဲကို ထည့်သွင်းခြင်း (Injecting the preparation blob into the `node` binary)

Single executable application တစ်ခု ဖန်တီးခြင်းကို ပြီးမြောက်ဖို့ — အောက်မှာ မှတ်တမ်းတင်ထားတဲ့အတိုင်း generated blob ကို `node` binary ရဲ့ copy တစ်ခုထဲကို ထည့်သွင်းဖို့ လိုအပ်ပါတယ်။

`--build-sea` ကို သုံးတဲ့အခါ ဒီအဆင့်ကို blob generation နဲ့အတူ အတွင်းပိုင်းမှာ လုပ်ဆောင်ပါတယ်။

* `node` binary က [PE][] file တစ်ခုဆိုရင် — blob ကို `NODE_SEA_BLOB` ဆိုတဲ့ နာမည်နဲ့ resource တစ်ခုအနေနဲ့ ထည့်သွင်းသင့်ပါတယ်။
* `node` binary က [Mach-O][] file တစ်ခုဆိုရင် — blob ကို `NODE_SEA` segment ထဲမှာ `NODE_SEA_BLOB` ဆိုတဲ့ နာမည်နဲ့ section တစ်ခုအနေနဲ့ ထည့်သွင်းသင့်ပါတယ်။
* `node` binary က [ELF][] file တစ်ခုဆိုရင် — blob ကို `NODE_SEA_BLOB` ဆိုတဲ့ နာမည်နဲ့ note တစ်ခုအနေနဲ့ ထည့်သွင်းသင့်ပါတယ်။

အဲဒီနောက် SEA building process က binary ထဲမှာ `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` [fuse][] string ကို ရှာပြီး — resource တစ်ခု ထည့်သွင်းပြီးကြောင်း ဖော်ပြဖို့ နောက်ဆုံး character ကို `1` အဖြစ် ပြောင်းလိုက်ပါတယ်။

##### Preparation blob ကို လက်နဲ့ ထည့်သွင်းခြင်း (Injecting the preparation blob manually)

`--build-sea` မမိတ်ဆက်ခင် — ပြင်ပ tools တွေက generated blob ကို `node` binary ရဲ့ copy တစ်ခုထဲကို ထည့်သွင်းနိုင်ဖို့ နည်းလမ်းဟောင်း တစ်ခု မိတ်ဆက်ခဲ့ပါတယ်။

ဥပမာ — [postject][] နဲ့ဆိုရင်:

1. `node` executable ရဲ့ copy တစ်ခုကို ဖန်တီးပြီး ကိုယ်လိုအပ်တဲ့အတိုင်း နာမည်ပေးပါ:

   * Windows မဟုတ်တဲ့ systems တွေမှာ:

   ```bash
   cp $(command -v node) hello
   ```

   * Windows မှာ:

   ```text
   node -e "require('fs').copyFileSync(process.execPath, 'hello.exe')"
   ```

   `.exe` extension က မဖြစ်မနေ လိုအပ်ပါတယ်။

2. Binary ရဲ့ signature ကို ဖယ်ရှားပါ (macOS နဲ့ Windows မှာပဲ):

   * macOS မှာ:

   ```bash
   codesign --remove-signature hello
   ```

   * Windows မှာ (optional):

   [signtool][] ကို install လုပ်ထားတဲ့ [Windows SDK][] ကနေ သုံးနိုင်ပါတယ်။ ဒီအဆင့်ကို ကျော်လိုက်ရင် — postject ကနေ ထွက်လာတဲ့ signature နဲ့ ဆိုင်တဲ့ warning တွေကို လျစ်လျူရှုလိုက်ပါ။

   ```powershell
   signtool remove /s hello.exe
   ```

3. Blob ကို ကူးယူထားတဲ့ binary ထဲကို အောက်ပါ options တွေနဲ့ `postject` ကို run ပြီး ထည့်သွင်းပါ:

   * `hello` / `hello.exe` — အဆင့် 4 မှာ ဖန်တီးခဲ့တဲ့ `node` executable ရဲ့ copy ရဲ့ နာမည်ပါ။
   * `NODE_SEA_BLOB` — binary ထဲမှာ blob ရဲ့ contents တွေ သိမ်းဆည်းမယ့် resource / note / section ရဲ့ နာမည်ပါ။
   * `sea-prep.blob` — အဆင့် 1 မှာ ဖန်တီးခဲ့တဲ့ blob ရဲ့ နာမည်ပါ။
   * `--sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2` — Node.js project က file တစ်ခု ထည့်သွင်းပြီးပြီလားဆိုတာ စစ်ဆေးဖို့ သုံးတဲ့ [fuse][] ပါ။
   * `--macho-segment-name NODE_SEA` (macOS မှာပဲ လိုအပ်ပါတယ်) — binary ထဲမှာ blob ရဲ့ contents တွေ သိမ်းဆည်းမယ့် segment ရဲ့ နာမည်ပါ။

   အကျဉ်းချုပ်ပြောရရင် — platform တစ်ခုချင်းစီအတွက် လိုအပ်တဲ့ command တွေက အောက်ပါအတိုင်းပါ:

   * Linux ပေါ်မှာ:
     ```bash
     npx postject hello NODE_SEA_BLOB sea-prep.blob \
         --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
     ```

   * Windows - PowerShell ပေါ်မှာ:
     ```powershell
     npx postject hello.exe NODE_SEA_BLOB sea-prep.blob `
         --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
     ```

   * Windows - Command Prompt ပေါ်မှာ:
     ```text
     npx postject hello.exe NODE_SEA_BLOB sea-prep.blob ^
         --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2
     ```

   * macOS ပေါ်မှာ:
     ```bash
     npx postject hello NODE_SEA_BLOB sea-prep.blob \
         --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 \
         --macho-segment-name NODE_SEA
     ```

### Platform support (platform ပံ့ပိုးမှု)

Single-executable support ကို အောက်ပါ platforms တွေပေါ်မှာပဲ CI မှာ ပုံမှန် စမ်းသပ်ပါတယ်:

* Windows
* macOS (arm64 ပဲ; x64 ကို လောလောဆယ် support မလုပ်သေးပြီး — tests တွေမှာ ကျော်သွားပါတယ်)
* Linux ([Node.js က support လုပ်တဲ့][supported by Node.js] distributions အားလုံး Alpine ကလွဲပြီး — [Node.js က support လုပ်တဲ့][supported by Node.js] architectures အားလုံး s390x ကလွဲပြီး)

ဒါက တခြား platforms တွေပေါ်မှာ ဒီ feature ကို စမ်းသပ်ဖို့ သုံးလို့ရတဲ့ single-executables တွေကို generate လုပ်နိုင်မယ့် ပိုကောင်းတဲ့ tools တွေ မရှိတာကြောင့် ဖြစ်ပါတယ်။

တခြား resource injection tools/workflows တွေအတွက် အကြံပြုချက်တွေကို ကြိုဆိုပါတယ်။ ဒါတွေကို မှတ်တမ်းတင်နိုင်အောင် <https://github.com/nodejs/single-executable/discussions> မှာ discussion တစ်ခု စတင်ပေးပါ။

[CommonJS]: modules.md#modules-commonjs-modules
[ECMAScript Modules]: esm.md#modules-ecmascript-modules
[ELF]: https://en.wikipedia.org/wiki/Executable_and_Linkable_Format
[Generating single executable preparation blobs]: #1-generating-single-executable-preparation-blobs
[Mach-O]: https://en.wikipedia.org/wiki/Mach-O
[PE]: https://en.wikipedia.org/wiki/Portable_Executable
[Windows SDK]: https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/
[`process.execPath`]: process.md#processexecpath
[`require()`]: modules.md#requireid
[`require.main`]: modules.md#accessing-the-main-module
[`sea.getAsset()`]: #seagetassetkey-encoding
[`sea.getAssetAsBlob()`]: #seagetassetasblobkey-options
[`sea.getAssetKeys()`]: #seagetassetkeys
[`sea.getRawAsset()`]: #seagetrawassetkey
[`v8.startupSnapshot.setDeserializeMainFunction()`]: v8.md#v8startupsnapshotsetdeserializemainfunctioncallback-data
[`v8.startupSnapshot` API]: v8.md#startup-snapshot-api
[documentation about startup snapshot support in Node.js]: cli.md#--build-snapshot
[fuse]: https://www.electronjs.org/docs/latest/tutorial/fuses
[postject]: https://github.com/nodejs/postject
[postject-linux-arm64-issue]: https://github.com/nodejs/postject/issues/105
[signtool]: https://learn.microsoft.com/en-us/windows/win32/seccrypto/signtool
[single executable applications]: https://github.com/nodejs/single-executable
[supported by Node.js]: https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list
