---
title: "Virtual File System"
description: "node:vfs module (experimental) — node:fs နဲ့ ဆင်တူတဲ့ API ပါတဲ့ virtual file system တစ်ခု (tests, fixtures, embedded assets စတဲ့ နေရာတွေအတွက်)"
order: 130
source: "https://nodejs.org/api/vfs.html"
status: translated
updated: 2026-09-04
---

> Stability: 1 - Experimental

`node:vfs` module က `node:fs` ပုံစံ API တစ်ခုပါတဲ့ virtual file system (virtual ဖိုင်စနစ်) တစ်ခုကို ပံ့ပိုးပေးပါတယ်။ Tests, fixtures, embedded assets တွေနဲ့ — အမှန်တကယ် file system ကို မထိပဲ သီးခြား ပြည့်စုံတဲ့ (self-contained) file system တစ်ခု လိုအပ်တဲ့ အခြား အခြေအနေတွေမှာ အသုံးဝင်ပါတယ်။

ဒီ module ကို ဝင်ရောက်သုံးရန်:

```mjs
import vfs from 'node:vfs';
```

```cjs
const vfs = require('node:vfs');
```

ဒီ module ကို `node:` scheme အောက်မှာပဲ ရနိုင်ပြီး — Node.js ကို `--experimental-vfs` flag နဲ့ စတင်ထားမှသာ ရနိုင်ပါတယ်။

## လုံခြုံရေး (Security)

VFS API က sandbox (သီးခြားခွဲထားတဲ့ လုံခြုံရေး နယ်ပယ်), permission system (ခွင့်ပြုချက် စနစ်), (သို့) access-control (ဝင်ရောက်ခွင့် ထိန်းချုပ်ရေး) ယန္တရား တစ်ခု မဟုတ်ပါဘူး။ ၎င်းက ယုံကြည်မှု မရှိတဲ့ (untrusted) code တွေကို host file system (သို့) Node.js ရဲ့ အခြား စွမ်းဆောင်ရည်တွေကနေ သီးခြား ခွဲထားပေးမှာ မဟုတ်ပါဘူး။ [`VirtualFileSystem`][] instance တစ်ခုကို ဝင်ရောက်သုံးနိုင်တဲ့ code — ၎င်းကို mount လုပ်တာ, provider ရွေးတာ, (သို့) path တွေ ပေးပို့တာ ပဲဖြစ်ဖြစ် — အဲဒါတွေက ယုံကြည်ရတဲ့ application code တွေပါ။

VFS တစ်ခုကို mount လုပ်တာက — resolve လုပ်ပြီးသား path တွေက mount point အောက်မှာ ရှိနေတဲ့ support လုပ်ထားတဲ့ [`node:fs`][] calls တွေကိုပဲ လမ်းကြောင်းလွှဲ (redirect) ပေးပါတယ်။ Process အတွက် ရရှိနိုင်တဲ့ resources တွေဆီ ဝင်ရောက်ဖို့ code တွေက တခြား path တွေ (သို့) တခြား Node.js APIs တွေကို သုံးတာကို ၎င်းက တားဆီးမပေးပါဘူး။ [`RealFSProvider`][] က ၎င်းရဲ့ configure လုပ်ထားတဲ့ root အောက်မှာ ရှိတဲ့ VFS paths တွေကို map လုပ်ပြီး — အဲဒီ root ရဲ့ အပြင်ဘက်ကို resolve ဖြစ်သွားတဲ့ paths တွေကို ငြင်းပယ်ပါတယ်။ ဒါပေမယ့် အဲဒီ စစ်ဆေးမှုက security boundary (လုံခြုံရေး နယ်နမိတ်) တစ်ခု မဟုတ်ပါဘူး။ Untrusted code တွေကို run ဖို့ VFS ကို အားကိုးမနေပါနဲ့။ Security boundary လိုအပ်တဲ့အခါ — သီးခြား users, containers, (သို့) platform sandboxes တွေလိုမျိုး operating-system-level isolation (OS အဆင့် သီးခြားခွဲထားမှု) တွေကို သုံးပါ။

## အခြေခံ အသုံးပြုမှု (Basic usage)

```cjs
const vfs = require('node:vfs');

const myVfs = vfs.create();
myVfs.mkdirSync('/dir', { recursive: true });
myVfs.writeFileSync('/dir/hello.txt', 'Hello, VFS!');

console.log(myVfs.readFileSync('/dir/hello.txt', 'utf8')); // 'Hello, VFS!'
```

`vfs.create()` က ပုံမှန်အားဖြင့် [`MemoryProvider`][] တစ်ခုနဲ့ ကျောထောက်နောက်ခံ (backed) ထားတဲ့ [`VirtualFileSystem`][] instance တစ်ခုကို ပြန်ပေးပါတယ်။ အဲဒီ instance က [`node:fs`][] API ရဲ့ ပုံစံအတိုင်း ထင်ဟပ်နေတဲ့ synchronous, callback-based, နဲ့ promise-based file system methods တွေကို ထုတ်ဖော် ပံ့ပိုးပေးပါတယ်။ Path အားလုံးက POSIX ပုံစံ ဖြစ်ပြီး absolute (`/` နဲ့ စတင်) တွေပါ။

## `vfs.create([provider][, options])`

* `provider` {VirtualProvider} အသုံးပြုမည့် provider ပါ။ **Default:**
  `new MemoryProvider()`။
* `options` {Object}
  * `emitExperimentalWarning` {boolean} Instance ကို ဖန်တီးတဲ့အခါ experimental
    warning ကို emit လုပ်မလုပ် သတ်မှတ်ချက်ပါ။ **Default:** `true`။
* Returns: {VirtualFileSystem}

`new VirtualFileSystem(provider, options)` နဲ့ ညီမျှတဲ့ အဆင်ပြေ factory function တစ်ခုပါ။

```cjs
const vfs = require('node:vfs');

// Default in-memory provider
const memoryVfs = vfs.create();

// Explicit provider
const realVfs = vfs.create(new vfs.RealFSProvider('/tmp/vfs-root'));
```

## Class: `VirtualFileSystem`

`VirtualFileSystem` က [`VirtualProvider`][] တစ်ခုကို wrap လုပ်ပြီး `node:fs` ပုံစံ API တစ်ခုကို ထုတ်ဖော်ပေးပါတယ်။ Instance တစ်ခုချင်းစီက ကိုယ်ပိုင် file tree တစ်ခုကို ထိန်းသိမ်းထားပါတယ်။

### `new VirtualFileSystem([provider][, options])`

* `provider` {VirtualProvider} အသုံးပြုမည့် provider ပါ။ **Default:**
  `new MemoryProvider()`။
* `options` {Object}
  * `emitExperimentalWarning` {boolean} Experimental warning ကို emit လုပ်မလုပ်
    သတ်မှတ်ချက်ပါ။ **Default:** `true`။

### `vfs.provider`

* {VirtualProvider}

ဒီ VFS instance ကို ကျောထောက်နောက်ခံ (backing) ပေးထားတဲ့ provider ပါ။

### `vfs.readonly`

* {boolean}

အရင်းခံ provider က read-only (ဖတ်ရုံသာ) ဖြစ်နေရင် `true` ဖြစ်ပါတယ်။

### API များ (APIs)

`VirtualFileSystem` က အောက်ပါ methods တွေကို — သူတို့ရဲ့ [`node:fs`][] counterparts (အလားတူ functions) တွေနဲ့ signature အတူတူ — အကောင်အထည်ဖော်ထားပါတယ်:

#### Synchronous API (တစ်ပြိုင်နက် လုပ်ဆောင်သော API)

* `existsSync(path)`
* `statSync(path[, options])`
* `lstatSync(path[, options])`
* `readFileSync(path[, options])`
* `writeFileSync(path, data[, options])`
* `appendFileSync(path, data[, options])`
* `readdirSync(path[, options])`
* `mkdirSync(path[, options])`
* `rmdirSync(path)`
* `unlinkSync(path)`
* `renameSync(oldPath, newPath)`
* `copyFileSync(src, dest[, mode])`
* `realpathSync(path[, options])`
* `readlinkSync(path[, options])`
* `symlinkSync(target, path[, type])`
* `accessSync(path[, mode])`
* `rmSync(path[, options])`
* `truncateSync(path[, len])`
* `ftruncateSync(fd[, len])`
* `linkSync(existingPath, newPath)`
* `chmodSync(path, mode)`
* `chownSync(path, uid, gid)`
* `lchownSync(path, uid, gid)`
* `utimesSync(path, atime, mtime)`
* `lutimesSync(path, atime, mtime)`
* `mkdtempSync(prefix)`
* `opendirSync(path[, options])`
* `openAsBlob(path[, options])`
* File descriptor ဆိုင်ရာ လုပ်ဆောင်ချက်များ: `openSync`, `closeSync`, `readSync`, `writeSync`,
  `fstatSync`
* Streams များ: `createReadStream`, `createWriteStream`
* Watchers များ: `watch`, `watchFile`, `unwatchFile`

#### Callback API (callback အခြေပြု API)

အောက်ပါ methods တွေ ပါဝင်ပါတယ်: `readFile`, `writeFile`, `stat`, `lstat`, `readdir`, `realpath`, `readlink`,
`access`, `open`, `close`, `read`, `write`, `rm`, `fstat`, `truncate`,
`ftruncate`, `link`, `mkdtemp`, `opendir`။ Method တစ်ခုချင်းစီက Node.js ပုံစံ
callback `(err, ...result) => {}` တစ်ခုကို လက်ခံပါတယ်။

#### Promise API (promise အခြေပြု API)

`vfs.promises` က promise အခြေပြု variants တွေကို ထုတ်ဖော်ပေးပါတယ်:

```cjs
const vfs = require('node:vfs');

async function example() {
  const myVfs = vfs.create();
  await myVfs.promises.writeFile('/file.txt', 'hello');
  const data = await myVfs.promises.readFile('/file.txt', 'utf8');
  return data;
}
example();
```

ဒီ promise namespace က `fs.promises` ကို ထင်ဟပ်ပြီး — `readFile`,
`writeFile`, `appendFile`, `stat`, `lstat`, `readdir`, `mkdir`, `rmdir`,
`unlink`, `rename`, `copyFile`, `realpath`, `readlink`, `symlink`,
`access`, `rm`, `truncate`, `link`, `mkdtemp`, `chmod`, `chown`, `lchown`,
`utimes`, `lutimes`, `open`, `lchmod`, နဲ့ `watch` တို့ ပါဝင်ပါတယ်။

## Class: `VirtualProvider`

VFS providers အားလုံးအတွက် base class ပါ။ Subclasses တွေက မရှိမဖြစ် primitives တွေ (`open`, `stat`, `readdir`, `mkdir`, `rmdir`, `unlink`, `rename` စသည်) ကို အကောင်အထည်ဖော်ပြီး — derived methods တွေ (`readFile`, `writeFile`, `exists`, `copyFile`, `access` စသည်) ရဲ့ default implementations တွေကို အမွေဆက်ခံ (inherit) ပါတယ်။

### Capability flags (စွမ်းဆောင်ရည် အလံများ)

* `provider.readonly` {boolean} **Default:** `false`.
* `provider.supportsSymlinks` {boolean} **Default:** `false`.
* `provider.supportsWatch` {boolean} **Default:** `false`.

### ကိုယ်ပိုင် providers များ ဖန်တီးခြင်း (Creating custom providers)

```cjs
const { VirtualProvider } = require('node:vfs');

class StaticProvider extends VirtualProvider {
  get readonly() { return true; }

  statSync(path) { /* ... */ }
  openSync(path, flags) { /* ... */ }
  readdirSync(path, options) { /* ... */ }
  // ...
}
```

Base class က override မလုပ်ရသေးတဲ့ primitive တစ်ခုခုအတွက် `ERR_METHOD_NOT_IMPLEMENTED` ကို throw လုပ်ပြီး — `readonly` provider တစ်ခုကနေ write လုပ်ဖို့ ကြိုးစားမှုတွေကို `EROFS` နဲ့ ငြင်းပယ်ပါတယ်။

## Class: `MemoryProvider`

Default in-memory provider ပါ။ Files, directories, နဲ့ symbolic links တွေကို `Map` အခြေပြု tree တစ်ခုထဲမှာ သိမ်းဆည်းပြီး — symlinks (`supportsSymlinks === true`) နဲ့ watching (`supportsWatch === true`) တွေကို support လုပ်ပါတယ်။

### `memoryProvider.setReadOnly()`

Provider ကို read-only mode ထဲ သော့ခတ် (lock) လိုက်ပါတယ်။ ဒီ provider ကို သုံးထားတဲ့ [`VirtualFileSystem`][] တစ်ခုခုကနေ နောက်ပိုင်း write လုပ်မှုတွေက `EROFS` ကို throw လုပ်ပါလိမ့်မယ်။ Provider ကို writable အဖြစ် ပြန်ပြောင်းဖို့ နည်းလမ်း မရှိပါဘူး။

```cjs
const vfs = require('node:vfs');

const provider = new vfs.MemoryProvider();
const myVfs = vfs.create(provider);
myVfs.writeFileSync('/seed.txt', 'initial');

provider.setReadOnly();

myVfs.writeFileSync('/x.txt', 'fail'); // throws EROFS
```

## Class: `RealFSProvider`

Directory တစ်ခု (ဆိုလိုတာက အမှန်တကယ် file system ပေါ်က directory တစ်ခု) ကို wrap လုပ်ပြီး — ၎င်းရဲ့ contents တွေကို VFS API ကနေတစ်ဆင့် ထုတ်ဖော်ပေးတဲ့ provider ပါ။ VFS paths အားလုံးကို root နဲ့ ယှဉ်ပြီး resolve လုပ်ကာ root အတွင်းမှာပဲ ရှိနေကြောင်း စစ်ဆေးပါတယ်။ Root အပြင်ဘက်ကို resolve ဖြစ်သွားတဲ့ symbolic links တွေကို ငြင်းပယ်ပါတယ်။ ဒီ path mapping က sandbox (သို့) access-control ယန္တရား တစ်ခု မဟုတ်ပါဘူး။

### `new RealFSProvider(rootPath)`

* `rootPath` {string} Root အဖြစ် သုံးမယ့် absolute file-system path ပါ။
  Non-empty string (ဗလာ မဟုတ်သော string) တစ်ခု ဖြစ်ရပါမယ်။

```cjs
const vfs = require('node:vfs');

const realVfs = vfs.create(new vfs.RealFSProvider('/tmp/vfs-root'));
realVfs.writeFileSync('/file.txt', 'hello'); // writes /tmp/vfs-root/file.txt
```

### `realFSProvider.rootPath`

* {string}

Root အဖြစ် သုံးထားတဲ့ resolve လုပ်ပြီးသား absolute path ပါ။

## အကောင်အထည်ဖော်ပုံ အသေးစိတ်များ (Implementation details)

### `Stats` object များ (`Stats` objects)

VFS ရဲ့ `Stats` objects တွေက [`fs.Stats`][] ရဲ့ အစစ်အမှန် instances တွေပါ (`{ bigint: true }` တောင်းဆိုထားရင် [`fs.BigIntStats`][] ဖြစ်ပါတယ်)။ သူတို့ရဲ့ fields တွေက synthetic (အတုအယောင်) ဖြစ်ပေမယ့် တည်ငြိမ်တဲ့ (stable) တန်ဖိုးတွေကို သုံးပါတယ်:

* `dev` က `4085` (VFS device id) ဖြစ်ပါတယ်။
* `ino` က process တစ်ခုစီအတွက် monotonically (တစ်သမတ်တည်း) တိုးတက်နေတဲ့ တန်ဖိုးပါ။
* `blksize` က `4096` ဖြစ်ပါတယ်။
* `blocks` က `Math.ceil(size / 512)` ဖြစ်ပါတယ်။
* Times တွေက entry ကို ဖန်တီးခဲ့တဲ့/နောက်ဆုံး ပြင်ဆင်ခဲ့တဲ့ အချိန်ကို default အဖြစ် သုံးပါတယ်။

[`MemoryProvider`]: #class-memoryprovider
[`RealFSProvider`]: #class-realfsprovider
[`VirtualFileSystem`]: #class-virtualfilesystem
[`VirtualProvider`]: #class-virtualprovider
[`fs.BigIntStats`]: fs.md#class-fsstats
[`fs.Stats`]: fs.md#class-fsstats
[`node:fs`]: fs.md
