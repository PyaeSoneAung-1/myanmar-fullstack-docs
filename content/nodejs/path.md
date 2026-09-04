---
title: "Path"
description: "node:path module — file/directory paths တွေ ကိုင်တွယ်ခြင်း (join, resolve, parse, basename, win32/posix …)။"
order: 97
source: "https://nodejs.org/api/path.html"
status: translated
updated: 2026-09-04
---

> Stability: 2 - Stable

`node:path` module က file နဲ့ directory paths တွေနဲ့ အလုပ်လုပ်ဖို့ utility တွေ ပေးပါတယ်။ အောက်ပါအတိုင်း သုံးစွဲနိုင်ပါတယ်:

```cjs
const path = require('node:path');
```

```mjs
import path from 'node:path';
```

## Windows နဲ့ POSIX (Windows vs. POSIX)

`node:path` module ရဲ့ ပုံမှန် အလုပ်လုပ်ပုံက Node.js application တစ်ခု run နေတဲ့ operating system ပေါ်မူတည်ပြီး ကွဲပြားပါတယ်။ အထူးသဖြင့် Windows operating system ပေါ်မှာ run တဲ့အခါ `node:path` module က Windows-style paths တွေကို သုံးနေတယ်လို့ ယူဆပါတယ်။

ဒါကြောင့် `path.basename()` ကို သုံးရင် POSIX နဲ့ Windows ပေါ်မှာ မတူညီတဲ့ ရလဒ်တွေ ရနိုင်ပါတယ်:

POSIX ပေါ်မှာ:

```js
path.basename('C:\\temp\\myfile.html');
// Returns: 'C:\\temp\\myfile.html'
```

Windows ပေါ်မှာ:

```js
path.basename('C:\\temp\\myfile.html');
// Returns: 'myfile.html'
```

Operating system မရွေး Windows file paths တွေနဲ့ အလုပ်လုပ်တဲ့အခါ တစ်သမတ်တည်း ရလဒ်တွေ ရဖို့ [`path.win32`][] ကို သုံးပါ:

POSIX ရော Windows ပေါ်မှာပါ:

```js
path.win32.basename('C:\\temp\\myfile.html');
// Returns: 'myfile.html'
```

Operating system မရွေး POSIX file paths တွေနဲ့ အလုပ်လုပ်တဲ့အခါ တစ်သမတ်တည်း ရလဒ်တွေ ရဖို့ [`path.posix`][] ကို သုံးပါ:

POSIX ရော Windows ပေါ်မှာပါ:

```js
path.posix.basename('/tmp/myfile.html');
// Returns: 'myfile.html'
```

Windows ပေါ်မှာ Node.js က per-drive working directory (drive တစ်ခုစီအလိုက် working directory) ဆိုတဲ့ concept ကို လိုက်နာပါတယ်။ Backslash မပါတဲ့ drive path တစ်ခုကို သုံးတဲ့အခါ ဒီအပြုအမူကို သတိပြုမိနိုင်ပါတယ်။ ဥပမာ — `path.resolve('C:\\')` က `path.resolve('C:')` နဲ့ မတူတဲ့ ရလဒ်တစ်ခု ရနိုင်ပါတယ်။ အသေးစိတ် အချက်အလက်တွေအတွက် [this MSDN page][MSDN-Rel-Path] ကို ကြည့်ပါ။

## `path.basename(path[, suffix])`

* `path` {string}
* `suffix` {string} ဖယ်ရှားဖို့ optional suffix တစ်ခု
* Returns: {string}

`path.basename()` method က Unix ရဲ့ `basename` command နဲ့ ဆင်တူပြီး — `path` တစ်ခုရဲ့ နောက်ဆုံး အပိုင်းကို ပြန်ပေးပါတယ်။ နောက်ဆုံးမှာ ပါတဲ့ [directory separators][`path.sep`] တွေကို လျစ်လျူရှုပါတယ်။

```js
path.basename('/foo/bar/baz/asdf/quux.html');
// Returns: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Returns: 'quux'
```

Windows က file extensions အပါအဝင် file name တွေကို case-insensitive (စာလုံးအကြီး/အသေး ခွဲခြားမှု မရှိ) အနေနဲ့ သုံးလေ့ ရှိပေမယ့် — ဒီ function ကတော့ အဲဒီလို မဟုတ်ပါဘူး။ ဥပမာ — `C:\\foo.html` နဲ့ `C:\\foo.HTML` က file တစ်ခုတည်းကို ရည်ညွှန်းပေမယ့် — `basename` ကတော့ extension ကို case-sensitive string (စာလုံးအကြီး/အသေး ခွဲခြားတဲ့ string) အနေနဲ့ သဘောထားပါတယ်:

```js
path.win32.basename('C:\\foo.html', '.html');
// Returns: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// Returns: 'foo.HTML'
```

`path` က string မဟုတ်ဘူးဆိုရင် (သို့) `suffix` ကို ပေးထားပြီး အဲဒါက string မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါတယ်။

## `path.delimiter`

* Type: {string}

Platform အလိုက် path delimiter ကို ပေးပါတယ်:

* `;` — Windows အတွက်
* `:` — POSIX အတွက်

ဥပမာ — POSIX ပေါ်မှာ:

```js
console.log(process.env.PATH);
// Prints: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// Returns: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```

Windows ပေါ်မှာ:

```js
console.log(process.env.PATH);
// Prints: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// Returns ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```

## `path.dirname(path)`

* `path` {string}
* Returns: {string}

`path.dirname()` method က Unix ရဲ့ `dirname` command နဲ့ ဆင်တူပြီး — `path` တစ်ခုရဲ့ directory name ကို ပြန်ပေးပါတယ်။ နောက်ဆုံးမှာ ပါတဲ့ directory separators တွေကို လျစ်လျူရှုပါတယ် — [`path.sep`][] မှာ ကြည့်ပါ။

```js
path.dirname('/foo/bar/baz/asdf/quux');
// Returns: '/foo/bar/baz/asdf'
```

`path` က string မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါတယ်။

## `path.extname(path)`

* `path` {string}
* Returns: {string}

`path.extname()` method က `path` ရဲ့ extension ကို ပြန်ပေးပါတယ် — `path` ရဲ့ နောက်ဆုံး အပိုင်းထဲမှာ `.` (period) character နောက်ဆုံး ပေါ်လာတဲ့ နေရာကနေ string ရဲ့ အဆုံးအထိ ဖြစ်ပါတယ်။ `path` ရဲ့ နောက်ဆုံး အပိုင်းမှာ `.` မရှိဘူးဆိုရင် (သို့) `path` ရဲ့ basename ရဲ့ ပထမဆုံး character ကလွဲလို့ တခြား `.` characters တွေ မရှိဘူးဆိုရင် (`path.basename()` မှာ ကြည့်ပါ) — empty string တစ်ခုကို ပြန်ပေးပါတယ်။

```js
path.extname('index.html');
// Returns: '.html'

path.extname('index.coffee.md');
// Returns: '.md'

path.extname('index.');
// Returns: '.'

path.extname('index');
// Returns: ''

path.extname('.index');
// Returns: ''

path.extname('.index.md');
// Returns: '.md'
```

`path` က string မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါတယ်။

## `path.format(pathObject)`

* `pathObject` {Object} အောက်ပါ property တွေ ရှိတဲ့ JavaScript object တစ်ခုခု:
  * `dir` {string}
  * `root` {string}
  * `base` {string}
  * `name` {string}
  * `ext` {string}
* Returns: {string}

`path.format()` method က object တစ်ခုကနေ path string တစ်ခုကို ပြန်ပေးပါတယ်။ ဒါက [`path.parse()`][] ရဲ့ ဆန့်ကျင်ဘက် ဖြစ်ပါတယ်။

`pathObject` ကို property တွေ ပေးတဲ့အခါ — property တစ်ခုက နောက်တစ်ခုအပေါ် ဦးစားပေးမှု ရှိတဲ့ ပေါင်းစပ်မှုတွေ ရှိတာကို သတိရပါ:

* `pathObject.root` ကို လျစ်လျူရှုပါတယ် — `pathObject.dir` ကို ပေးထားရင်
* `pathObject.ext` နဲ့ `pathObject.name` တွေကို လျစ်လျူရှုပါတယ် — `pathObject.base` ရှိနေရင်

ဥပမာ — POSIX ပေါ်မှာ:

```js
// If `dir`, `root` and `base` are provided,
// `${dir}${path.sep}${base}`
// will be returned. `root` is ignored.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// Returns: '/home/user/dir/file.txt'

// `root` will be used if `dir` is not specified.
// If only `root` is provided or `dir` is equal to `root` then the
// platform separator will not be included. `ext` will be ignored.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// Returns: '/file.txt'

// `name` + `ext` will be used if `base` is not specified.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// Returns: '/file.txt'

// The dot will be added if it is not specified in `ext`.
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// Returns: '/file.txt'
```

Windows ပေါ်မှာ:

```js
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// Returns: 'C:\\path\\dir\\file.txt'
```

## `path.matchesGlob(path, pattern)`

* `path` {string} Glob-match လုပ်ရမယ့် path။
* `pattern` {string} Path ကို စစ်ဆေးဖို့ သုံးမယ့် glob။
* Returns: {boolean} `path` က `pattern` နဲ့ ကိုက်ညီမှု ရှိ/မရှိ။

`path.matchesGlob()` method က `path` က `pattern` နဲ့ ကိုက်ညီမှု ရှိမရှိကို ဆုံးဖြတ်ပေးပါတယ်။

ဥပမာ:

```js
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
```

`path` (သို့) `pattern` တွေက string မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါတယ်။

## `path.isAbsolute(path)`

* `path` {string}
* Returns: {boolean}

`path.isAbsolute()` method က ပေးထားတဲ့ literal `path` က absolute (အပြည့်အစုံ) ဟုတ်မဟုတ် ဆုံးဖြတ်ပေးပါတယ်။ ဒါကြောင့် path traversals တွေကို လျော့ပါးစေဖို့အတွက်တော့ မသင့်လျော်ပါဘူး။

ပေးထားတဲ့ `path` က zero-length string (အလျား သုည ရှိတဲ့ string) ဆိုရင် `false` ကို ပြန်ပေးပါလိမ့်မယ်။

ဥပမာ — POSIX ပေါ်မှာ:

```js
path.isAbsolute('/foo/bar');   // true
path.isAbsolute('/baz/..');    // true
path.isAbsolute('/baz/../..'); // true
path.isAbsolute('qux/');       // false
path.isAbsolute('.');          // false
```

Windows ပေါ်မှာ:

```js
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```

`path` က string မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါတယ်။

## `path.join([...paths])`

* `...paths` {string} Path segments တွေရဲ့ sequence (အစဉ်လိုက်)
* Returns: {string}

`path.join()` method က ပေးထားတဲ့ `path` segments တွေ အားလုံးကို platform-specific separator ကို delimiter အဖြစ် သုံးပြီး ဆက်စပ်ပေးကာ — ရလာတဲ့ path ကို normalize လုပ်ပါတယ်။

Zero-length ဖြစ်တဲ့ `path` segments တွေကို လျစ်လျူရှုပါတယ်။ ဆက်စပ်ပြီး ရလာတဲ့ path string က zero-length string ဖြစ်သွားရင်တော့ — လက်ရှိ working directory ကို ကိုယ်စားပြုတဲ့ `'.'` ကို ပြန်ပေးပါလိမ့်မယ်။

```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// Returns: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// Throws 'TypeError: Path must be a string. Received {}'
```

Path segments တစ်ခုခုက string မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါတယ်။

## `path.normalize(path)`

* `path` {string}
* Returns: {string}

`path.normalize()` method က ပေးထားတဲ့ `path` ကို normalize လုပ်ပြီး — `'..'` နဲ့ `'.'` segments တွေကို resolve လုပ်ပါတယ်။

Sequential (ဆက်တိုက်) path segment separation characters အများကြီး တွေ့ရတဲ့အခါ (ဥပမာ — POSIX မှာ `/`၊ Windows မှာ `\` (သို့) `/`) — platform-specific path segment separator တစ်ခုတည်းနဲ့ အစားထိုးပါတယ် (POSIX မှာ `/`၊ Windows မှာ `\`)။ နောက်ဆုံးမှာ ပါတဲ့ separators တွေကိုတော့ ထိန်းသိမ်းထားပါတယ်။

`path` က zero-length string ဆိုရင် — လက်ရှိ working directory ကို ကိုယ်စားပြုတဲ့ `'.'` ကို ပြန်ပေးပါတယ်။

POSIX ပေါ်မှာ ဒီ function က လုပ်ပေးတဲ့ normalization အမျိုးအစားတွေက POSIX specification ကို တိတိကျကျ လိုက်နာတာ မဟုတ်ပါဘူး။ ဥပမာ — ဒီ function က ရှေ့ဆုံးက forward slashes နှစ်ခုကို သာမန် absolute path တစ်ခုလိုမျိုး single slash တစ်ခုတည်းနဲ့ အစားထိုးပေမယ့် — POSIX system အချို့ကတော့ forward slashes နှစ်ခု အတိအကျနဲ့ စတင်တဲ့ paths တွေကို အထူး အဓိပ္ပါယ် သတ်မှတ်ပေးထားပါတယ်။ အလားတူပဲ — `..` segments တွေကို ဖယ်ရှားတာလို ဒီ function က လုပ်တဲ့ တခြား အစားထိုးမှုတွေက အရင်းခံ system က path ကို resolve လုပ်ပုံကို ပြောင်းလဲစေနိုင်ပါတယ်။

ဥပမာ — POSIX ပေါ်မှာ:

```js
path.normalize('/foo/bar//baz/asdf/quux/..');
// Returns: '/foo/bar/baz/asdf'
```

Windows ပေါ်မှာ:

```js
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Returns: 'C:\\temp\\foo\\'
```

Windows က path separators အများကြီးကို အသိအမှတ် ပြုတာမို့ — separators နှစ်မျိုးစလုံးကို Windows ရဲ့ ဦးစားပေး separator (`\`) တွေနဲ့ အစားထိုးပါလိမ့်မယ်:

```js
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// Returns: 'C:\\temp\\foo\\bar'
```

`path` က string မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါတယ်။

## `path.parse(path)`

* `path` {string}
* Returns: {Object}

`path.parse()` method က `path` ရဲ့ အဓိက အစိတ်အပိုင်းတွေကို ကိုယ်စားပြုတဲ့ property တွေ ပါတဲ့ object တစ်ခုကို ပြန်ပေးပါတယ်။ နောက်ဆုံးမှာ ပါတဲ့ directory separators တွေကို လျစ်လျူရှုပါတယ် — [`path.sep`][] မှာ ကြည့်ပါ။

ပြန်ပေးလာတဲ့ object မှာ အောက်ပါ property တွေ ပါဝင်ပါလိမ့်မယ်:

* `dir` {string}
* `root` {string}
* `base` {string}
* `name` {string}
* `ext` {string}

ဥပမာ — POSIX ပေါ်မှာ:

```js
path.parse('/home/user/dir/file.txt');
// Returns:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```

```text
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
```

Windows ပေါ်မှာ:

```js
path.parse('C:\\path\\dir\\file.txt');
// Returns:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```

```text
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
```

`path` က string မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါတယ်။

## `path.posix`

* Type: {Object}

`path.posix` property က `path` methods တွေရဲ့ POSIX-specific implementations တွေဆီ ဝင်ရောက်ခွင့် ပေးပါတယ်။

API ကို `require('node:path').posix` (သို့) `require('node:path/posix')` ကနေ ဝင်ရောက်နိုင်ပါတယ်။

## `path.relative(from, to)`

* `from` {string}
* `to` {string}
* Returns: {string}

`path.relative()` method က လက်ရှိ working directory ကို အခြေခံပြီး — `from` ကနေ `to` ဆီကို သွားတဲ့ relative path ကို ပြန်ပေးပါတယ်။ `from` နဲ့ `to` နှစ်ခုစလုံး (တစ်ခုချင်းစီပေါ်မှာ `path.resolve()` ခေါ်ပြီးတဲ့နောက်) path တစ်ခုတည်းကို resolve ဖြစ်သွားရင် — zero-length string တစ်ခုကို ပြန်ပေးပါတယ်။

`from` (သို့) `to` အနေနဲ့ zero-length string တစ်ခုကို ပေးလိုက်ရင် — အဲဒီ zero-length strings တွေရဲ့ အစား လက်ရှိ working directory ကို သုံးပါလိမ့်မယ်။

ဥပမာ — POSIX ပေါ်မှာ:

```js
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// Returns: '../../impl/bbb'
```

Windows ပေါ်မှာ:

```js
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// Returns: '..\\..\\impl\\bbb'
```

`from` (သို့) `to` ထဲက တစ်ခုခုက string မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါတယ်။

## `path.resolve([...paths])`

* `...paths` {string} Paths (သို့) path segments တွေရဲ့ sequence (အစဉ်လိုက်)
* Returns: {string}

`path.resolve()` method က paths (သို့) path segments တွေရဲ့ sequence တစ်ခုကို absolute path တစ်ခုအဖြစ် resolve လုပ်ပါတယ်။

ပေးထားတဲ့ paths sequence ကို ညာကနေ ဘယ်ဘက်သို့ process လုပ်ပြီး — absolute path တစ်ခု မဖွဲ့စည်းနိုင်မချင်း `path` တစ်ခုချင်းစီကို ရှေ့ကနေ ထည့်ပေါင်းသွားပါတယ်။ ဥပမာ — `/foo`, `/bar`, `baz` ဆိုတဲ့ path segments sequence ပေးထားတဲ့အခါ `path.resolve('/foo', '/bar', 'baz')` က `/bar/baz` ကို ပြန်ပေးပါလိမ့်မယ် — `'baz'` က absolute path မဟုတ်ပေမယ့် `'/bar' + '/' + 'baz'` ကတော့ absolute ဖြစ်နေလို့ပါ။

ပေးထားတဲ့ `path` segments တွေ အားလုံးကို process လုပ်ပြီးတဲ့အခါ absolute path တစ်ခု မထွက်သေးဘူးဆိုရင် — လက်ရှိ working directory ကို သုံးပါတယ်။

ရလာတဲ့ path ကို normalize လုပ်ပြီး — path က root directory ဆီ resolve ဖြစ်တဲ့ ကိစ္စကလွဲရင် နောက်ဆုံးက slashes တွေကို ဖယ်ရှားပါတယ်။

Zero-length ဖြစ်တဲ့ `path` segments တွေကို လျစ်လျူရှုပါတယ်။

`path` segments တစ်ခုမှ မပေးဘူးဆိုရင် `path.resolve()` က လက်ရှိ working directory ရဲ့ absolute path ကို ပြန်ပေးပါလိမ့်မယ်။

```js
path.resolve('/foo/bar', './baz');
// Returns: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// Returns: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// If the current working directory is /home/myself/node,
// this returns '/home/myself/node/wwwroot/static_files/gif/image.gif'
```

Argument တစ်ခုခုက string မဟုတ်ဘူးဆိုရင် [`TypeError`][] တစ်ခုကို throw လုပ်ပါတယ်။

## `path.sep`

* Type: {string}

Platform အလိုက် path segment separator ကို ပေးပါတယ်:

* `\` — Windows ပေါ်မှာ
* `/` — POSIX ပေါ်မှာ

ဥပမာ — POSIX ပေါ်မှာ:

```js
'foo/bar/baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz']
```

Windows ပေါ်မှာ:

```js
'foo\\bar\\baz'.split(path.sep);
// Returns: ['foo', 'bar', 'baz']
```

Windows ပေါ်မှာ forward slash (`/`) ရော backward slash (`\`) ပါ path segment separators အဖြစ် လက်ခံပါတယ် — ဒါပေမယ့် `path` methods တွေက backward slashes (`\`) တွေကိုပဲ ထည့်ပေးပါတယ်။

## `path.toNamespacedPath(path)`

* `path` {string}
* Returns: {string}

Windows systems တွေမှာပဲ — ပေးထားတဲ့ `path` အတွက် ညီမျှတဲ့ [namespace-prefixed path][] တစ်ခုကို ပြန်ပေးပါတယ်။ `path` က string မဟုတ်ဘူးဆိုရင် `path` ကို ပြုပြင်မှု တစ်စုံတစ်ရာ မရှိဘဲ ပြန်ပေးပါလိမ့်မယ်။

ဒီ method က Windows systems တွေမှာပဲ အဓိပ္ပါယ် ရှိပါတယ်။ POSIX systems တွေမှာ method က non-operational ဖြစ်ပြီး — `path` ကို ပြုပြင်မှု မရှိဘဲ အမြဲတမ်း ပြန်ပေးပါတယ်။

## `path.win32`

* Type: {Object}

`path.win32` property က `path` methods တွေရဲ့ Windows-specific implementations တွေဆီ ဝင်ရောက်ခွင့် ပေးပါတယ်။

API ကို `require('node:path').win32` (သို့) `require('node:path/win32')` ကနေ ဝင်ရောက်နိုင်ပါတယ်။

[MSDN-Rel-Path]: https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths
[`TypeError`]: errors.md#class-typeerror
[`path.parse()`]: #pathparsepath
[`path.posix`]: #pathposix
[`path.sep`]: #pathsep
[`path.win32`]: #pathwin32
[namespace-prefixed path]: https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces
